/* ===========================================================================
   PROfinity — Automatic daily check-in (plain JS, no React)
   The first time the app is opened on a given day, book the loyalty engine's
   "Mobile Check-In" action (evt_mobile_checkin: 50 pts × tier multiplier,
   daily cap 1, also advances the check-in streak), announce it with the same
   `pf:points-earned` event the header points pill listens to (detail.sound "none" — the welcome chime from points-sound.js is
   played by show() the moment the screen appears), and celebrate with a
   full-screen dark-navy takeover inside the phone frame (daily-checkin.css):
   welcome Lottie, "+N pts" counting up from 0, "Day N in a row", 7-day
   streak dots, confetti that plays twice then fades out. Fixed navy palette
   (same gradient as the Daily Goal page) in both light and dark mode.
   Waits for the launch splash (launch-splash.js) to lift when it is up.
   Idempotent: the engine's own per-day action count is the source of truth,
   so reloads / other pages on the same day never award twice.
   Debug: ?checkin=1 re-runs the screen (points stay capped by the engine),
   ?checkin=0 suppresses. API: window.PFDailyCheckin = { run, show, hide, status, reset }.
   =========================================================================== */
(function () {
  "use strict";
  var ACTION_ID = "evt_mobile_checkin";
  var HOST_SELECTOR = "[data-ios-device], [data-screen-label], .ml-screen, .lm-screen, .m-screen, .pm-screen, .cm-screen";
  var WELCOME_SRC = "assets/lottie/checkin-welcome.json";   // user-supplied welcome avatar (lottie.host bF8ChK4F6y), saved locally
  var CONFETTI_SRC = "https://lottie.host/ea37076b-d19a-4bc1-b9a5-cbb0ee2ee18e/lIBo4xoANl.json";  // same confetti as 5-in-a-row
  var LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
  var WEEK = 7;

  var q = "";
  try { q = new URLSearchParams(location.search).get("checkin") || ""; } catch (e) {}

  function eng() { return window.PFLoyalty || null; }
  function dayKey(d) { var dt = d ? new Date(d) : new Date(); return dt.toISOString().slice(0, 10); }
  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
  /* Gamification preference (Notification Settings → Gamification). Read
     straight from localStorage so this script doesn't depend on load order. */
  function gamiOn(k) { try { var s = JSON.parse(localStorage.getItem("pf-gamification")) || {}; return s[k] !== false; } catch (e) { return true; } }

  /* has today's check-in already been booked? (engine counts, same day key the engine uses) */
  function doneToday() {
    var e = eng(); if (!e) return true;
    try {
      var c = (e.getState().actionCounts || {})[ACTION_ID];
      return !!(c && c.day === dayKey() && c.dayCount >= 1);
    } catch (err) { return true; }
  }

  function findHost() {
    var dev = document.querySelector("[data-ios-device]");
    if (dev) return dev;
    var nodes = document.querySelectorAll(HOST_SELECTOR);
    return nodes.length ? nodes[0] : null;
  }

  /* ---- Lottie: load the library on demand ---- */
  var libPromise = null;
  function ensureLottie() {
    if (window.lottie) return Promise.resolve(window.lottie);
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script"); s.src = LOTTIE_LIB; s.async = true;
      s.onload = function () { resolve(window.lottie); }; s.onerror = reject;
      document.head.appendChild(s);
    });
    return libPromise;
  }

  /* ---- the full-screen takeover ---- */
  var el = null, anim = null, confAnim = null, lastFocus = null, countRaf = null;
  var CONFETTI_PLAYS = 2;   // confetti runs twice, then fades out and stops
  var COUNT_MS = 1200;      // "+N pts" counts up from 0 over this long

  function reduceMotion() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function ptsHtml(n) { return "+" + Math.round(n).toLocaleString("en-GB") + " <small>pts</small>"; }
  /* Running number: ease the pill from 0 up to the awarded total and stop
     exactly on it. Skipped (set straight to the total) under reduced motion. */
  function countUp(node, target) {
    if (countRaf) { cancelAnimationFrame(countRaf); countRaf = null; }
    if (target <= 0 || reduceMotion() || typeof requestAnimationFrame !== "function") { node.innerHTML = ptsHtml(target); return; }
    node.innerHTML = ptsHtml(0);
    var t0 = null;
    var tick = function (now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / COUNT_MS), e = 1 - Math.pow(1 - p, 3);
      node.innerHTML = ptsHtml(target * e);
      if (p < 1) countRaf = requestAnimationFrame(tick);
      else { countRaf = null; node.innerHTML = ptsHtml(target); node.classList.add("is-settled"); }
    };
    countRaf = requestAnimationFrame(tick);
  }
  function build() {
    if (el) return el;
    var root = document.createElement("div");
    root.className = "pf-dci-root";
    root.innerHTML =
      '<div class="pf-dci-screen" role="dialog" aria-modal="true" aria-labelledby="pf-dci-title">' +
        '<div class="pf-dci-confetti" aria-hidden="true"></div>' +
        '<button class="pf-dci-close" type="button" aria-label="Close" data-dci-close>&times;</button>' +
        '<div class="pf-dci-body">' +
          '<span class="pf-dci-glow" aria-hidden="true"></span>' +
          '<span class="pf-dci-lottie" aria-hidden="true"></span>' +
          '<div class="pf-dci-kicker">Daily check-in</div>' +
          '<h2 class="pf-dci-title" id="pf-dci-title">Welcome back!</h2>' +
          '<div class="pf-dci-pts"></div>' +
          '<p class="pf-dci-sub"></p>' +
          '<div class="pf-dci-dots" aria-hidden="true"></div>' +
        '</div>' +
        '<div class="pf-dci-actions">' +
          '<button class="pf-dci-btn pf-dci-btn-gold" type="button" data-dci-close>Keep going</button>' +
          '<button class="pf-dci-btn pf-dci-btn-ghost" type="button" data-dci-streak>View my streak</button>' +
        '</div>' +
      '</div>';
    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-dci-close]")) hide();
      else if (e.target.closest("[data-dci-streak]")) { hide(); go("CheckInStreak.html"); }
    });
    el = root;
    return root;
  }
  function onKey(e) { if (e.key === "Escape") hide(); }

  function show(pts, streak, tierMult) {
    build();
    var host = findHost() || document.body;
    if (host !== document.body && !host.style.position) host.style.position = "relative";
    if (host === document.body) el.classList.add("pf-dci-root--fixed");
    if (el.parentElement !== host) host.appendChild(el);

    var ptsEl = el.querySelector(".pf-dci-pts");
    ptsEl.classList.remove("is-settled");
    ptsEl.innerHTML = pts > 0 ? ptsHtml(0) : "Already checked in";
    var sub = el.querySelector(".pf-dci-sub");
    if (streak > 1) {
      sub.innerHTML = "That’s <b>day " + streak + " in a row</b>. Come back tomorrow to keep the streak going" +
        (tierMult && tierMult !== 1 ? " — your tier multiplier is <b>" + tierMult + "×</b>." : ".");
    } else {
      sub.innerHTML = "Points for simply showing up. Come back tomorrow to <b>start a streak</b>.";
    }
    /* 7-day streak row: lit for each day of the current run (this week’s slice) */
    var dots = el.querySelector(".pf-dci-dots");
    dots.innerHTML = "";
    var lit = streak > 0 ? ((streak - 1) % WEEK) + 1 : 0;
    var todayDot = null;
    /* weekday initial under each dot: dot j sits (j - todayIndex) days from today */
    var DOW = ["S", "M", "T", "W", "T", "F", "S"];
    var todayIdx = lit > 0 ? lit - 1 : 0, now = new Date();
    for (var j = 0; j < WEEK; j++) {
      var col = document.createElement("span");
      col.className = "pf-dci-day";
      var d = document.createElement("span");
      var isToday = j === lit - 1;
      /* earlier days arrive lit; today's dot arrives empty and checks itself
         in a beat later (see below) so the new check-in is visibly booked */
      d.className = "pf-dci-dot" + (j < lit && !isToday ? " is-lit" : "") + (isToday ? " is-today" : "");
      d.style.setProperty("--d", (220 + j * 80) + "ms");
      d.innerHTML = j < lit && !isToday ? "<i>✓</i>" : "";
      if (isToday) todayDot = d;
      var lbl = document.createElement("small");
      lbl.className = "pf-dci-dow" + (isToday ? " is-today" : "");
      var dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (j - todayIdx));
      lbl.textContent = DOW[dayDate.getDay()];
      lbl.setAttribute("aria-label", dayDate.toLocaleDateString(undefined, { weekday: "long" }));
      lbl.style.setProperty("--d", (220 + j * 80) + "ms");
      col.appendChild(d); col.appendChild(lbl);
      dots.appendChild(col);
    }
    if (todayDot) {
      var checkIn = function () { if (!todayDot || !el || !el.parentElement) return; todayDot.innerHTML = "<i>✓</i>"; todayDot.classList.add("is-lit", "is-checking"); };
      if (reduceMotion()) checkIn(); else setTimeout(checkIn, 220 + WEEK * 80 + 520);
    }

    el.querySelectorAll(".pf-dci-dot, .pf-dci-lottie").forEach(function (n) { n.style.animation = "none"; void n.offsetWidth; n.style.animation = ""; });
    lastFocus = document.activeElement;
    // two frames so the enter transition plays after mount; the welcome chime
    // (points-sound.js) starts the moment the screen appears
    // html.pf-dci-open lets daily-checkin.css hide the header's floating points
    // tally while the takeover is up — the screen already shows the +N itself
    document.documentElement.classList.add("pf-dci-open");
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      el.classList.add("is-open");
      if (pts > 0) setTimeout(function () { if (el && el.classList.contains("is-open")) countUp(ptsEl, pts); }, 180);
      if (window.PFPointsSound && window.PFPointsSound.playCheckin) window.PFPointsSound.playCheckin();
    }); });

    var mount = el.querySelector(".pf-dci-lottie");
    var confMount = el.querySelector(".pf-dci-confetti");
    ensureLottie().then(function (lottie) {
      if (!el || !el.parentElement) return;
      if (anim) { anim.destroy(); anim = null; }
      if (confAnim) { confAnim.destroy(); confAnim = null; }
      mount.innerHTML = ""; confMount.innerHTML = ""; confMount.classList.remove("is-done");
      anim = lottie.loadAnimation({ container: mount, renderer: "svg", loop: true, autoplay: true, path: WELCOME_SRC + "?v=20260917c" });
      /* lottie-web's numeric loop is the number of *repeats*, so CONFETTI_PLAYS - 1
         repeats = CONFETTI_PLAYS full runs; `complete` then fades the layer out. */
      confAnim = lottie.loadAnimation({ container: confMount, renderer: "svg", loop: CONFETTI_PLAYS - 1, autoplay: true, path: CONFETTI_SRC,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" } });
      confAnim.addEventListener("complete", function () {
        confMount.classList.add("is-done");
        var a = confAnim; confAnim = null;
        setTimeout(function () { if (a) a.destroy(); if (confMount.classList.contains("is-done")) confMount.innerHTML = ""; }, 700);
      });
    }).catch(function () { /* offline: the screen still reads without the avatar or confetti */ });
    document.addEventListener("keydown", onKey);
    setTimeout(function () { var b = el && el.querySelector(".pf-dci-btn-gold"); if (b) b.focus(); }, 80);
  }
  function hide() {
    if (!el) return;
    el.classList.remove("is-open");
    document.documentElement.classList.remove("pf-dci-open");
    if (countRaf) { cancelAnimationFrame(countRaf); countRaf = null; }
    document.removeEventListener("keydown", onKey);
    if (anim) { anim.destroy(); anim = null; }
    if (confAnim) { confAnim.destroy(); confAnim = null; }
    var node = el;
    setTimeout(function () { if (node && node.parentElement && !node.classList.contains("is-open")) node.parentElement.removeChild(node); }, 400);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  /* Book the check-in. Returns the engine result (or null when nothing to do). */
  function run(force) {
    var e = eng(); if (!e) return null;
    if (!force && doneToday()) return null;
    var action = e.getActionById(ACTION_ID);
    if (!action || !action.active) return null;
    var res = e.completeAction(ACTION_ID);
    if (!res || !res.ok) return res || null;
    var streak = 0, mult = 1;
    try { var st = e.getState(); streak = st.streak.current || 0; mult = e.tierMultiplierFor(action, st.user.membershipTier) || 1; } catch (err) {}
    /* streak celebrations off (Notification Settings → Gamification): book the
       bonus quietly — the header pill still counts up and points-sound.js
       plays the welcome chime from the event instead of the modal */
    var modal = force || gamiOn("streakPopup");
    if (!res.capped && res.pointsAwarded > 0) {
      try {
        window.dispatchEvent(new CustomEvent("pf:points-earned", {
          detail: { amount: res.pointsAwarded, label: action.label, actionId: action.id, booked: true, sound: modal ? "none" : "checkin" }
        }));
      } catch (err) { /* older WebView */ }
    }
    if (!modal) return res;
    show(res.capped ? 0 : res.pointsAwarded, streak, mult);
    if (res.leveledUp) setTimeout(function () { hide(); go("MilestoneSplash.html"); }, 2400);
    return res;
  }

  /* Give the header pill a moment to mount, and if the launch splash is
     covering the screen wait for it to lift so the +pts lands in view. */
  function splashUp() {
    return document.documentElement.classList.contains("pf-launch-active") || !!document.querySelector(".pf-launch");
  }
  function schedule() {
    var fire = function () { setTimeout(function () { run(q === "1"); }, 700); };
    if (!splashUp()) { fire(); return; }
    var done = false, t0 = Date.now();
    var goNow = function () { if (done) return; done = true; window.removeEventListener("pf:launch-splash-done", goNow); fire(); };
    window.addEventListener("pf:launch-splash-done", goNow);
    (function poll() {
      if (done) return;
      if (!splashUp() || Date.now() - t0 > 30000) { goNow(); return; }
      setTimeout(poll, 250);
    })();
  }

  if (q !== "0" && (q === "1" || !doneToday())) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
    else schedule();
  }

  window.PFDailyCheckin = {
    run: function () { return run(true); },
    show: function (pts, streak) { show(pts == null ? 50 : pts, streak == null ? 3 : streak, 1); },
    hide: hide,
    status: function () { return { doneToday: doneToday(), day: dayKey() }; },
    reset: function () {
      var e = eng(); if (!e) return;
      var st = e.getState(); var counts = Object.assign({}, st.actionCounts); delete counts[ACTION_ID];
      e.setState({ actionCounts: counts });
    }
  };
})();
