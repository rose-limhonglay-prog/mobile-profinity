/* ===========================================================================
   PROfinity — "5 in a row" earn-streak splash (plain JS, no React)
   Counts every successful pf:points-earned event (the same event the header
   points pill listens to). The fifth consecutive earn pops a full-screen
   celebration inside the current screen root — lemon-in-shades Lottie over
   a full-card confetti Lottie,
   "5 in a row!", the points banked across the run — then the counter resets
   so the next five earns celebrate again. A gap of 12h+ between earns
   breaks the run. window.PFEarnStreak = { show, reset, count } for demos,
   and ?fiveinarow=1 previews the splash on load.
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-earn-streak";
  var TARGET = 5;
  var GAP_MS = 12 * 3600000;
  var LOTTIE_SRC = "https://lottie.host/82113f83-6260-46ed-b045-3fdc9092198f/lGsCEPPU0v.json";
  var CONFETTI_SRC = "https://lottie.host/ea37076b-d19a-4bc1-b9a5-cbb0ee2ee18e/lIBo4xoANl.json";
  var LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
  var HOST_SELECTOR = "[data-screen-label], .ml-screen, .lm-screen, .m-screen, .pm-screen, .cm-screen";

  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || { count: 0, total: 0, lastTs: 0 }; } catch (e) { return { count: 0, total: 0, lastTs: 0 }; } }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function reset() { write({ count: 0, total: 0, lastTs: 0 }); }
  /* Gamification preference (Notification Settings → Gamification). Read
     straight from localStorage so this script doesn't depend on load order. */
  function gamiOn(k) { try { var s = JSON.parse(localStorage.getItem("pf-gamification")) || {}; return s[k] !== false; } catch (e) { return true; } }

  /* ---- Lottie: load the library on demand, then the raw JSON ---- */
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

  /* ---- DOM ---- */
  var el = null, anim = null, confAnim = null, lastFocus = null;
  function build() {
    if (el) return el;
    var root = document.createElement("div");
    root.className = "pf-fiar-root";
    root.innerHTML =
      '<div class="pf-fiar-scrim" data-fiar-close></div>' +
      '<div class="pf-fiar-card" role="dialog" aria-modal="true" aria-labelledby="pf-fiar-title">' +
        '<div class="pf-fiar-confetti" aria-hidden="true"></div>' +
        '<span class="pf-fiar-glow" aria-hidden="true"></span>' +
        '<button class="pf-fiar-close" type="button" aria-label="Close" data-fiar-close>&times;</button>' +
        '<span class="pf-fiar-lottie" aria-hidden="true"></span>' +
        '<div class="pf-fiar-kicker">Nice streak</div>' +
        '<h2 class="pf-fiar-title" id="pf-fiar-title"><b>5</b> in a row!</h2>' +
        '<p class="pf-fiar-sub"></p>' +
        '<div class="pf-fiar-dots" aria-hidden="true"></div>' +
        '<div class="pf-fiar-actions">' +
          '<button class="pf-fiar-btn pf-fiar-btn-gold" type="button" data-fiar-close>Keep earning</button>' +
          '<button class="pf-fiar-btn pf-fiar-btn-ghost" type="button" data-fiar-rewards>View my rewards</button>' +
        '</div>' +
      '</div>';
    var dots = root.querySelector(".pf-fiar-dots");
    for (var j = 0; j < TARGET; j++) {
      var d = document.createElement("span"); d.className = "pf-fiar-dot is-lit"; d.style.setProperty("--d", (250 + j * 110) + "ms"); d.textContent = "✓"; dots.appendChild(d);
    }
    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-fiar-close]")) hide();
      else if (e.target.closest("[data-fiar-rewards]")) { hide(); (window.pfGo || function (u) { window.location.href = u; })("RewardsDashboard.html"); }
    });
    el = root;
    return root;
  }

  function findHost() {
    var nodes = document.querySelectorAll(HOST_SELECTOR);
    /* prefer the outermost screen root (the one the phone frame wraps) */
    return nodes.length ? nodes[0] : null;
  }

  function show(total) {
    build();
    var host = findHost() || document.body;
    if (host !== document.body) host.style.position = host.style.position || "relative";
    if (el.parentElement !== host) host.appendChild(el);
    var sub = el.querySelector(".pf-fiar-sub");
    sub.innerHTML = total > 0
      ? "You’ve earned points five times running — <b>+" + Math.round(total).toLocaleString("en-GB") + " pts</b> banked in this run."
      : "You’ve earned points five times running. Keep the momentum going.";
    /* restart the pop animations */
    el.querySelectorAll(".pf-fiar-dot, .pf-fiar-lottie").forEach(function (n) { n.style.animation = "none"; void n.offsetWidth; n.style.animation = ""; });
    lastFocus = document.activeElement;
    el.classList.add("is-open");
    var mount = el.querySelector(".pf-fiar-lottie");
    var confMount = el.querySelector(".pf-fiar-confetti");
    ensureLottie().then(function (lottie) {
      if (!el.classList.contains("is-open")) return;
      if (anim) { anim.destroy(); anim = null; }
      if (confAnim) { confAnim.destroy(); confAnim = null; }
      mount.innerHTML = ""; confMount.innerHTML = "";
      anim = lottie.loadAnimation({ container: mount, renderer: "svg", loop: true, autoplay: true, path: LOTTIE_SRC });
      /* confetti fills the whole card behind the content; cropped to cover so no letterboxing */
      confAnim = lottie.loadAnimation({ container: confMount, renderer: "svg", loop: true, autoplay: true, path: CONFETTI_SRC,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" } });
    }).catch(function () { /* offline: the card still reads without the lemon or confetti */ });
    document.addEventListener("keydown", onKey);
    setTimeout(function () { var b = el.querySelector(".pf-fiar-btn-gold"); if (b) b.focus(); }, 60);
    try { window.dispatchEvent(new CustomEvent("pf:five-in-a-row", { detail: { total: total } })); } catch (e) {}
  }
  function hide() {
    if (!el) return;
    el.classList.remove("is-open");
    document.removeEventListener("keydown", onKey);
    if (anim) { anim.destroy(); anim = null; }
    if (confAnim) { confAnim.destroy(); confAnim = null; }
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function onKey(e) { if (e.key === "Escape") hide(); }

  /* ---- the counter ---- */
  function onEarn(e) {
    var amount = e && e.detail && Number(e.detail.amount) || 0;
    if (amount <= 0) return;
    var s = read();
    var now = Date.now();
    if (s.lastTs && now - s.lastTs > GAP_MS) s = { count: 0, total: 0, lastTs: 0 };
    s.count += 1; s.total += amount; s.lastTs = now;
    if (s.count >= TARGET) {
      var total = s.total;
      reset();
      if (!gamiOn("streakPopup")) return;   /* streak celebrations turned off in settings */
      /* let the +pts pop / toast land first, then celebrate */
      setTimeout(function () { show(total); }, 900);
    } else {
      write(s);
    }
  }
  window.addEventListener("pf:points-earned", onEarn);

  window.PFEarnStreak = { show: function (total) { show(total || 0); }, hide: hide, reset: reset, count: function () { return read().count; } };

  if (/[?&]fiveinarow=1/.test(location.search)) {
    var tries = 0, iv = setInterval(function () { if (findHost() || ++tries > 40) { clearInterval(iv); show(375); } }, 200);
  }
})();
