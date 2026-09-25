/* ===========================================================================
   PROfinity — Reward router (plain JS, no React)
   One place that decides WHICH celebration surface a reward gets, so the
   individual earn sites never have to. The rule:

     Points indicator    small everyday actions — a like, comment, share, a
                         new post, a poll vote. The "+N" float (popPoints in
                         app.jsx), the header pill count-up and the coin chime.
                         Nothing here to do: those fire on pf:points-earned.
     Streak screen       daily consistency — the automatic check-in
                         (daily-checkin.js "Welcome back · Day N in a row")
                         and the Check-In Streak page. Owned by those scripts;
                         the router only waits for the takeover to lift.
     Goal Reached Screen gaining points — the day's points total reaching the
                         next mark on the daily ladder (280, 500, 750, 1,000;
                         daily-goal.js) → DailyGoal.html "Goal reached, Katy!
                         You've earned N pts today. Next goal: M pts".
     Reward Splash Screen
                         ONE major milestone from an action — a level badge
                         (Bronze → Silver …), an achievement badge unlocking
                         or a league promotion — and the sign-up welcome bonus
                         (+100) and the daily login reward handed over by the
                         auth pages → ALWAYS an in-page overlay (showSplash
                         below) that fades out by itself after ~2.5 seconds.
                         Never a page (MilestoneSplash.html is a preview only).
     Combined            SEVERAL major rewards from the same action (e.g. one
                         earn tips the daily goal AND unlocks a badge) → a
                         single CombinedCelebration.html instead of two pages
                         fighting over the navigation.

   How majors are detected: every pf:points-earned is followed by a diff of
   the loyalty engine — level badge key, unlocked achievements — against the
   last snapshot; daily-goal.js hands its 280/500/750/1,000 marks here; the league
   engine's pf:league-changed (up) counts too. Majors that land within
   COLLECT_MS of each other belong to the same action. The decision is then
   routed once the launch splash / check-in takeover is off screen. If the
   page navigates away first (share to a channel, Create Post → feed), the
   pending majors are stashed in sessionStorage and routed on the next page.

   Gate: pf-gamification.milestonePopup (default on) — the pop-up settings
   store points-sound.js owns; dailyGoalPopup still gates the daily goal.
   API: window.PFRewards = { classify, major, fromAction, pending, flush,
   route, preview, KINDS }. classify() returns one of KINDS:
   "indicator" | "streak" | "goalReached" | "rewardSplash" | "major" | "combined".
   A way to earn's own Reward UI (action.celebration, set in Admin → Ways to
   Earn) is applied by actionSurface() after every pf:points-earned.
   ?celebrate=combined|rewardSplash opens a demo of the two new surfaces.
   =========================================================================== */
(function () {
  "use strict";
  var COLLECT_MS = 900;          /* majors within this window = same action */
  var STASH_KEY = "pf-celebration-pending";
  var PAYLOAD_KEY = "pf-celebration";
  var STASH_TTL = 25000;
  var MAJOR_TYPES = { level: 1, achievement: 1, league: 1, dailyGoal: 1, action: 1 };   /* action = a way to earn whose admin-set Reward UI is bigger than the indicator */
  var KINDS = ["indicator", "streak", "goalReached", "rewardSplash", "major", "combined"];

  var pending = [];               /* majors collected for the current action */
  var timer = null;
  var lastLevelKey = null, lastUnlocked = null, lastLeagueKey = null;
  var seen = {};                  /* "type:key" → ts, so a major is never celebrated twice */

  function eng() { return window.PFLoyalty || null; }
  function gamiOn(k) { try { var s = JSON.parse(localStorage.getItem("pf-gamification")) || {}; return s[k] !== false; } catch (e) { return true; } }
  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
  function currentPage() { return (location.pathname.split("/").pop() || "NewsfeedMobile.html") + location.search; }
  function saveScroll() {
    if (!window.pfSaveScroll) return;
    var el = document.querySelector(".m-scroll");
    if (!el || !(el.scrollTop > 0)) {
      var all = document.querySelectorAll("*");
      for (var i = 0; i < all.length; i++) { var n = all[i]; if (n.scrollTop > 0 && n.scrollHeight > n.clientHeight + 1) { el = n; break; } }
    }
    if (el) window.pfSaveScroll(el);
  }

  /* ---- engine snapshot / diff ---- */
  function levelKey() {
    var e = eng(); if (!e || !e.getBadgeProgress) return null;
    try { var cur = e.getBadgeProgress(e.getState()).current; return cur ? cur.key : ""; } catch (err) { return null; }
  }
  function unlockedKeys() {
    var e = eng(); if (!e) return null;
    try { return (e.getState().unlockedAchievements || []).slice(); } catch (err) { return null; }
  }
  function leagueKey() {
    var L = window.PFLeague; if (!L || !L.getCurrent) return null;
    try { var c = L.getCurrent(); return c ? c.key : null; } catch (err) { return null; }
  }
  function snapshot() {
    lastLevelKey = levelKey();
    lastUnlocked = unlockedKeys();
    lastLeagueKey = leagueKey();
  }
  /* After an earn: did the level badge change? Any achievement newly met? */
  function diffEngine(detail) {
    var e = eng(); if (!e) return;
    var lk = levelKey();
    if (lk && lastLevelKey !== null && lk !== lastLevelKey) {
      var cfg = e.getConfig();
      var badge = (cfg.levelBadges || []).filter(function (b) { return b.key === lk; })[0];
      if (badge) major({ type: "level", key: lk, kind: badge.celebration === "major" ? "major" : undefined, title: badge.splashTitle || (badge.name + " unlocked"), sub: "You've crossed " + e.formatNumber(badge.threshold) + " lifetime points.", color: badge.color, badge: badge });
    }
    lastLevelKey = lk;
    var before = lastUnlocked || [];
    var newly = [];
    try { newly = e.evaluateAchievements ? e.evaluateAchievements() : []; } catch (err) { newly = []; }
    var after = unlockedKeys() || [];
    /* union: evaluateAchievements returns what it just unlocked, the state
       diff catches unlocks other callers (completeAction) already stored */
    var fresh = {};
    newly.forEach(function (b) { fresh[b.key] = b; });
    after.forEach(function (k) {
      if (before.indexOf(k) === -1 && !fresh[k]) {
        var b = (e.getConfig().achievementBadges || []).filter(function (x) { return x.key === k; })[0];
        if (b) fresh[k] = b;
      }
    });
    Object.keys(fresh).forEach(function (k) {
      var b = fresh[k];
      major({ type: "achievement", key: k, title: b.name, sub: b.description, reward: b.reward, icon: b.icon, badge: b });
    });
    lastUnlocked = after;
  }

  /* ---- collecting ---- */
  function major(m) {
    if (!m || !MAJOR_TYPES[m.type]) return false;
    var id = m.type + ":" + (m.key || "");
    var now = Date.now();
    if (seen[id] && now - seen[id] < 60000) return false;
    seen[id] = now;
    m.ts = now;
    pending.push(m);
    if (timer) clearTimeout(timer);
    timer = setTimeout(decide, COLLECT_MS);
    return true;
  }
  /* Pages that call PFLoyalty.completeAction themselves can hand the result
     over; anything the pf:points-earned diff already caught is deduped. */
  function fromAction(res, extra) {
    if (!res) return;
    var e = eng();
    if (res.leveledUp && res.newLevel) {
      major({ type: "level", key: res.newLevel.key, kind: res.newLevel.celebration === "major" ? "major" : undefined, title: res.newLevel.splashTitle || (res.newLevel.name + " unlocked"),
        sub: e ? "You've crossed " + e.formatNumber(res.newLevel.threshold) + " lifetime points." : "", color: res.newLevel.color, badge: res.newLevel });
    }
    (res.newlyUnlockedAchievements || []).forEach(function (b) {
      major({ type: "achievement", key: b.key, title: b.name, sub: b.description, reward: b.reward, icon: b.icon, badge: b });
    });
    if (extra && extra.dailyGoal) major({ type: "dailyGoal", key: String(extra.dailyGoal), mark: extra.dailyGoal });
    snapshot();
  }

  /* ---- the rule: indicator | streak | goalReached | rewardSplash | combined ---- */
  function classify(items) {
    var majors = (items || []).filter(function (m) { return MAJOR_TYPES[m.type]; });
    if (majors.some(function (m) { return m.kind === "combined"; })) return "combined";
    if (majors.length >= 2) return "combined";
    if (majors.length === 1) {
      if (majors[0].type === "dailyGoal") return "goalReached";
      if (majors[0].kind === "major") return "major";        /* Major Celebration Splash: one big reward, full page */
      return "rewardSplash";
    }
    if ((items || []).some(function (m) { return m.type === "checkin"; })) return "streak";
    return "indicator";
  }

  /* ---- takeovers we must not interrupt ---- */
  function takeoverUp() {
    var h = document.documentElement;
    return h.classList.contains("pf-launch-active") || !!document.querySelector(".pf-launch") ||
      h.classList.contains("pf-dci-open") || !!document.querySelector(".pf-dci-screen.is-open") ||
      h.classList.contains("pf-rsp-open") || h.classList.contains("pf-wn-open");
  }
  function whenClear(cb, maxMs) {
    var t0 = Date.now();
    (function poll() {
      if (!takeoverUp() || Date.now() - t0 > (maxMs || 30000)) { cb(); return; }
      setTimeout(poll, 200);
    })();
  }

  /* ---- routing ---- */
  function payloadFor(items, kind) {
    var e = eng(), st = null;
    try { st = e && e.getState(); } catch (err) {}
    var pts = 0;
    try {
      var dg = JSON.parse(localStorage.getItem("pf-daily-goal") || "null");
      pts = dg && dg.earned || 0;
    } catch (err) {}
    return { kind: kind, items: items, ts: Date.now(), ret: currentPage(), todayPoints: pts,
      streak: st && st.streak ? st.streak.current : 0, tier: st && st.user ? st.user.membershipTier : "" };
  }
  function route(items) {
    items = items || [];
    var kind = classify(items);
    if (kind === "indicator" || kind === "streak") return kind;
    if (!gamiOn("milestonePopup")) return "muted";
    var payload = payloadFor(items, kind);
    try { sessionStorage.setItem(PAYLOAD_KEY, JSON.stringify(payload)); } catch (err) {}
    var m = items.filter(function (x) { return MAJOR_TYPES[x.type]; })[0];
    /* Reward Splash: an in-page overlay that lifts itself after 2s (user rule
       2026-09-18) — no page change. Only the sign-up bonus still uses the full
       MilestoneSplash.html page, because it carries the "Take the tour" CTA. */
    if (kind === "rewardSplash") { showSplash(m); return kind; }
    saveScroll();
    var ret = encodeURIComponent(payload.ret);
    if (kind === "combined" || kind === "major") { go("CombinedCelebration.html?ret=" + ret); return kind; }
    if (!gamiOn("dailyGoalPopup")) return "muted";
    go("DailyGoal.html?ret=" + ret);
    return kind;
  }

  /* ---- Reward Splash overlay (level / achievement / league) ----
     Same look as MilestoneSplash.html — navy gradient, the winking doctor
     with the reward's medal at his shoulder, kicker, title, one line — but
     rendered inside the phone frame, no buttons, and gone again after
     SPLASH_MS (tap anywhere to dismiss sooner). Plays the milestone fanfare
     via pf:milestone. lottie-web is loaded on demand like daily-checkin.js. */
  var SPLASH_MS = 2500;                        /* user rule: overlay only, gone after 2–3s */
  var SPLASH_LOTTIE = "assets/lottie/checkin-wink.json?v=20260918a";
  var SPLASH_WAVE_LOTTIE = "assets/lottie/goal-reached.json?v=20260918a";   /* sign-up / login: the waving character */
  var SPLASH_CONFETTI = "https://lottie.host/1b8bdd21-9711-48bb-873f-3889b01b43c8/jrTeYYuQqi.json";
  var HANDOFF_KEY = "pf-celebration-handoff";  /* auth pages → newsfeed: { type: "signup"|"login", tour, ts } */
  var SIGNUP_POINTS = 100, SIGNUP_KEY = "pf-signup-bonus";
  var LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
  var HOST_SELECTOR = "[data-ios-device], [data-screen-label], .ml-screen, .lm-screen, .m-screen, .pm-screen, .cm-screen, .lcm-screen, .acc-screen";
  var splashEl = null, splashAnim = null, splashTimer = null, libPromise = null;
  function findHost() {
    var dev = document.querySelector("[data-ios-device]");
    if (dev) return dev;
    var nodes = document.querySelectorAll(HOST_SELECTOR);
    return nodes.length ? nodes[0] : null;
  }
  function ensureLottie() {
    if (window.lottie) return Promise.resolve(window.lottie);
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var sc = document.createElement("script"); sc.src = LOTTIE_LIB; sc.async = true;
      sc.onload = function () { resolve(window.lottie); }; sc.onerror = reject;
      document.head.appendChild(sc);
    });
    return libPromise;
  }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function firstName() { try { var n = eng().getState().user.name || ""; return n.split(" ")[0]; } catch (e) { return ""; } }
  function splashCopy(m) {
    var b = m.badge || {}, lg = m.league || {}, f = firstName();
    if (m.type === "signup") return { kicker: null, points: m.points || SIGNUP_POINTS, title: "Welcome to PROfinity" + (f ? ", " + f : "") + "!", sub: "You've earned " + (m.points || SIGNUP_POINTS) + " points just for joining.", icon: null, wave: true };
    if (m.type === "login") {
      var streak = 0; try { streak = eng().getState().streak.current || 0; } catch (e) {}
      return { kicker: null, points: m.points || 0, title: "Welcome back" + (f ? ", " + f : "") + "!", sub: streak > 1 ? "Daily login bonus — " + streak + " days in a row." : "Daily login bonus — see you again tomorrow.", icon: null, wave: true };
    }
    if (m.type === "action") return { kicker: "Reward earned", points: m.points || 0, title: m.title || "Nice work", sub: m.sub || "", icon: m.icon || "lucide:sparkles", color: "#d9a21b" };
    if (m.type === "achievement") return { kicker: "Achievement unlocked", title: m.title || b.name || "New badge", sub: m.reward || b.reward || m.sub || "", icon: m.icon || b.icon || "lucide:award", color: "#d9a21b" };
    if (m.type === "league") return { kicker: "League promotion", title: m.title || ("Welcome to the " + (lg.name || "next") + " League"), sub: "A new leaderboard, new rivals, new prizes", icon: "lucide:trophy", color: m.color || lg.accent || "#d9a21b" };
    return { kicker: "Milestone reached", title: m.title || ((b.name || "Level") + " unlocked"), sub: m.sub || "", icon: "lucide:gem", color: m.color || b.color || "#d9a21b" };
  }
  var SPLASH_CSS =
    ".pf-rsp{position:absolute;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 28px;color:#fff;font-family:var(--font-sans,system-ui);cursor:pointer;" +
      "background:radial-gradient(120% 90% at 50% 0%,#3a3480 0%,#292569 55%,#1b1848 100%);opacity:0;transition:opacity .32s ease}" +
    "[data-ios-device] .pf-rsp{border-radius:inherit;overflow:hidden}" +
    "body>.pf-rsp{position:fixed}" +
    ".pf-rsp.is-in{opacity:1}" +
    ".pf-rsp-glow{position:absolute;left:50%;top:34%;width:320px;height:240px;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;background:radial-gradient(closest-side,rgba(253,195,93,.4),rgba(253,195,93,0))}" +
    ".pf-rsp-hero{position:relative;width:272px;height:204px;margin:0 auto 6px;transform:scale(.6);opacity:0;transition:transform .55s cubic-bezier(.2,1.4,.4,1) .05s,opacity .3s ease .05s}" +
    ".pf-rsp-hero.is-square{width:236px;height:236px;margin-bottom:10px}" +
    ".pf-rsp-confetti{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:3;transition:opacity .6s ease}" +
    ".pf-rsp-confetti.is-done{opacity:0}.pf-rsp-confetti svg{display:block;width:100%!important;height:100%!important}" +
    ".pf-rsp-pts{position:relative;display:flex;align-items:baseline;justify-content:center;gap:8px;margin:0 0 8px;line-height:1;color:#fdc35d}" +
    ".pf-rsp-pts b{font-size:40px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums;text-shadow:0 4px 18px rgba(253,195,93,.35)}" +
    ".pf-rsp-pts i{font-style:normal;font-size:15px;font-weight:700;color:#f0c98a}" +
    ".pf-rsp.is-in .pf-rsp-hero{transform:scale(1);opacity:1}" +
    ".pf-rsp-lottie,.pf-rsp-lottie svg{display:block;width:100%!important;height:100%!important}" +
    ".pf-rsp-medal{position:absolute;right:42px;bottom:6px;width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #292569;box-shadow:0 10px 24px rgba(0,0,0,.35)}" +
    ".pf-rsp-medal iconify-icon{color:#fff;font-size:26px}" +
    ".pf-rsp-k{position:relative;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f0c98a;margin:6px 0 8px}" +
    ".pf-rsp-t{position:relative;margin:0 0 10px;font-size:26px;line-height:1.1;font-weight:800}" +
    ".pf-rsp-s{position:relative;margin:0;font-size:14px;color:rgba(255,255,255,.78);max-width:300px}" +
    ".pf-rsp-k,.pf-rsp-t,.pf-rsp-s,.pf-rsp-pts{opacity:0;transform:translateY(8px);transition:opacity .4s ease .2s,transform .4s ease .2s}" +
    ".pf-rsp.is-in .pf-rsp-k,.pf-rsp.is-in .pf-rsp-t,.pf-rsp.is-in .pf-rsp-s,.pf-rsp.is-in .pf-rsp-pts{opacity:1;transform:none}" +
    "@media (prefers-reduced-motion:reduce){.pf-rsp,.pf-rsp *{transition:none!important}}";
  function ensureSplashCss() {
    if (document.getElementById("pf-rsp-css")) return;
    var st = document.createElement("style"); st.id = "pf-rsp-css"; st.textContent = SPLASH_CSS;
    document.head.appendChild(st);
  }
  var splashConf = null, splashAfter = null, splashRaf = null;
  function hideSplash() {
    if (!splashEl) return;
    var node = splashEl; splashEl = null;
    clearTimeout(splashTimer); splashTimer = null;
    if (splashRaf) { cancelAnimationFrame(splashRaf); splashRaf = null; }
    document.documentElement.classList.remove("pf-rsp-open");
    node.classList.remove("is-in");
    /* the feed re-times an in-flight upload card once the splash is gone */
    try { window.dispatchEvent(new CustomEvent("pf:reward-splash-done")); } catch (e) {}
    var a = splashAnim, c = splashConf; splashAnim = null; splashConf = null;
    setTimeout(function () { try { a && a.destroy(); } catch (e) {} try { c && c.destroy(); } catch (e) {} if (node.parentElement) node.parentElement.removeChild(node); }, 360);
    var after = splashAfter; splashAfter = null;
    if (after) setTimeout(after, 380);
  }
  /* rolling "+N" for the sign-up / login overlays */
  function countUp(node, total, ms, delay) {
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      node.textContent = "+" + Math.round(total * e);
      if (p < 1) splashRaf = requestAnimationFrame(step); else splashRaf = null;
    }
    setTimeout(function () { if (node.isConnected) splashRaf = requestAnimationFrame(step); }, delay);
  }
  function showSplash(m) {
    hideSplash();
    ensureSplashCss();
    var c = splashCopy(m);
    var host = findHost() || document.body;
    var wrap = document.createElement("div");
    wrap.className = "pf-rsp";
    wrap.setAttribute("role", "status");
    wrap.setAttribute("aria-live", "polite");
    wrap.innerHTML =
      '<span class="pf-rsp-glow" aria-hidden="true"></span>' +
      '<div class="pf-rsp-confetti" aria-hidden="true"></div>' +
      '<div class="pf-rsp-hero' + (c.wave ? " is-square" : "") + '" aria-hidden="true"><span class="pf-rsp-lottie"></span>' +
        (c.icon ? '<span class="pf-rsp-medal" style="background:' + esc(c.color) + '"><iconify-icon icon="' + esc(c.icon) + '" width="26" height="26"></iconify-icon></span>' : "") + "</div>" +
      (c.kicker ? '<p class="pf-rsp-k">' + esc(c.kicker) + "</p>" : "") +
      (c.points ? '<p class="pf-rsp-pts" aria-label="+' + esc(c.points) + ' points"><b>+0</b><i>points</i></p>' : "") +
      '<h2 class="pf-rsp-t">' + esc(c.title) + "</h2>" +
      (c.sub ? '<p class="pf-rsp-s">' + esc(c.sub) + "</p>" : "");
    splashAfter = m.after || null;
    if (host !== document.body && getComputedStyle(host).position === "static") host.style.position = "relative";
    host.appendChild(wrap);
    splashEl = wrap;
    document.documentElement.classList.add("pf-rsp-open");
    wrap.addEventListener("click", hideSplash);
    requestAnimationFrame(function () { requestAnimationFrame(function () { wrap.classList.add("is-in"); }); });
    try { window.dispatchEvent(new CustomEvent("pf:milestone", { detail: { kind: m.type, key: m.key } })); } catch (e) {}
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (c.points) countUp(wrap.querySelector(".pf-rsp-pts b"), c.points, 900, reduce ? 0 : 350);
    if (!reduce) {
      ensureLottie().then(function (lottie) {
        if (splashEl !== wrap) return;
        var mount = wrap.querySelector(".pf-rsp-lottie");
        try { splashAnim = lottie.loadAnimation({ container: mount, renderer: "svg", loop: true, autoplay: true, path: c.wave ? SPLASH_WAVE_LOTTIE : SPLASH_LOTTIE }); } catch (e) {}
        /* one confetti burst, then the layer fades */
        var cm = wrap.querySelector(".pf-rsp-confetti");
        try {
          splashConf = lottie.loadAnimation({ container: cm, renderer: "svg", loop: false, autoplay: true, path: SPLASH_CONFETTI, rendererSettings: { preserveAspectRatio: "xMidYMid slice" } });
          splashConf.addEventListener("complete", function () { cm.classList.add("is-done"); });
        } catch (e) {}
      }).catch(function () {});
    }
    splashTimer = setTimeout(hideSplash, SPLASH_MS);
  }
  function decide() {
    timer = null;
    if (!pending.length) return;
    var items = pending.slice();
    pending = [];
    if (classify(items) === "indicator") return;
    /* let the "+N" float / toast land first, then wait for any takeover */
    setTimeout(function () { whenClear(function () { route(items); }); }, 400);
  }
  function flush() { if (timer) { clearTimeout(timer); timer = null; } decide(); }

  /* ---- cross-page stash ---- */
  function stash() {
    if (!pending.length) return;
    try { sessionStorage.setItem(STASH_KEY, JSON.stringify({ ts: Date.now(), items: pending })); } catch (err) {}
    pending = [];
  }
  function unstash() {
    var s = null;
    try { s = JSON.parse(sessionStorage.getItem(STASH_KEY)); sessionStorage.removeItem(STASH_KEY); } catch (err) {}
    if (!s || !s.items || !s.items.length || Date.now() - s.ts > STASH_TTL) return;
    /* never re-route onto the celebration pages themselves */
    if (/MilestoneSplash|CombinedCelebration|DailyGoal/.test(location.pathname)) return;
    s.items.forEach(function (m) { seen[m.type + ":" + (m.key || "")] = 0; });
    setTimeout(function () { s.items.forEach(major); }, 900);
  }
  window.addEventListener("pagehide", stash);

  /* ---- the admin-set Reward UI of the way to earn itself ----
     Ways to Earn rows carry action.celebration (loyalty-engine DEFAULT_ACTIONS
     / AdminActionsEditor): indicator (nothing extra), streak, goalReached,
     rewardSplash, major, combined. Badge / level / daily-goal majors detected
     above still stack on top, so a rewardSplash action that also unlocks a
     badge becomes one Combined Celebration. */
  function showStreak(pts) {
    if (!gamiOn("streakPopup")) return;
    var st = null; try { st = eng().getState(); } catch (err) {}
    var streak = (st && st.streak && st.streak.current) || 1;
    if (window.PFDailyCheckin && window.PFDailyCheckin.show) { window.PFDailyCheckin.show(pts, streak); return; }
    showSplash({ type: "login", points: pts });
  }
  function actionSurface(d) {
    var e = eng(); if (!e || !d.actionId || !e.getActionById) return;
    var a = null; try { a = e.getActionById(d.actionId); } catch (err) {}
    if (!a || !a.celebration || a.celebration === "indicator") return;
    var pts = Number(d.amount) || a.basePoints || 0;
    if (a.celebration === "streak") {
      /* the automatic check-in already paints its own Welcome back screen */
      if (a.id === "evt_mobile_checkin" || d.sound === "checkin") return;
      setTimeout(function () { whenClear(function () { showStreak(pts); }); }, 400);
      return;
    }
    if (a.celebration === "goalReached") {
      var G = window.PFDailyGoal, mark = 280;
      try { mark = (G && (G.markFor(G.today()) || G.goal)) || 280; } catch (err) {}
      major({ type: "dailyGoal", key: "action:" + a.id + ":" + Date.now(), mark: mark });
      return;
    }
    major({ type: "action", kind: a.celebration, key: a.id + ":" + Date.now(), actionId: a.id, title: a.label, sub: d.label && d.label !== a.label ? d.label : "", points: pts, icon: "lucide:sparkles" });
  }

  /* ---- listeners ---- */
  window.addEventListener("pf:points-earned", function (e) {
    var d = (e && e.detail) || {};
    if (!(Number(d.amount) > 0)) return;
    /* the engine books the points synchronously in the pill / awardPoints
       listeners; diff one tick later so we see the new lifetime total */
    setTimeout(function () { diffEngine(d); actionSurface(d); }, 60);
  });
  document.addEventListener("pf:league-changed", function (e) {
    var d = (e && e.detail) || {};
    if (!d.up || !d.to) return;
    var L = window.PFLeague, lg = null;
    try { lg = L && L.getLeague ? L.getLeague(d.to) : null; } catch (err) {}
    var name = (lg && lg.name) || (d.to && d.to.name) || String(d.to);
    var key = (lg && lg.key) || (d.to && d.to.key) || String(d.to);
    major({ type: "league", key: key, title: "Welcome to the " + name + " League", sub: "You've been promoted — a new leaderboard, new rivals, new prizes.", color: lg && lg.accent, league: lg });
  });

  /* ---- sign-up / login hand-off from the auth pages ----
     The auth page stores { type, tour } and sends the member to the newsfeed;
     we book the reward here (the auth pages carry no loyalty engine) and show
     the overlay once the launch splash has lifted. Booking happens at script
     load, before daily-checkin.js decides whether today's check-in is due —
     so a login books the check-in and the feed's own "Welcome back" takeover
     stays quiet for the day. */
  var handoff = null;
  try { handoff = JSON.parse(sessionStorage.getItem(HANDOFF_KEY)); sessionStorage.removeItem(HANDOFF_KEY); } catch (e) { handoff = null; }
  if (handoff && (!handoff.ts || Date.now() - handoff.ts > STASH_TTL)) handoff = null;
  function bookHandoff(h) {
    var e = eng();
    if (h.type === "signup") {
      var done = false;
      try { done = !!localStorage.getItem(SIGNUP_KEY); } catch (err) {}
      if (!done) {
        try { localStorage.setItem(SIGNUP_KEY, String(Date.now())); } catch (err) {}
        try { e && e.awardPoints && e.awardPoints(SIGNUP_POINTS, "Welcome bonus", "evt_signup"); } catch (err) {}
        try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: SIGNUP_POINTS, label: "Welcome bonus", actionId: "evt_signup", booked: true, sound: "none" } })); } catch (err) {}
      }
      return SIGNUP_POINTS;
    }
    if (h.type === "login") {
      var res = null;
      try { res = e && e.completeAction ? e.completeAction("evt_mobile_checkin") : null; } catch (err) { res = null; }
      if (res && res.ok && !res.capped && res.pointsAwarded > 0) {
        try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: res.pointsAwarded, label: "Mobile Check-In", actionId: res.txn ? res.txn.actionId : "evt_mobile_checkin", booked: true, sound: "none" } })); } catch (err) {}
        return res.pointsAwarded;
      }
      /* already checked in today: show the day's amount without booking again */
      try { var a = e.getActionById("evt_mobile_checkin"); return Math.round(a.basePoints * e.tierMultiplierFor(a, e.getState().user.membershipTier)); } catch (err) { return 50; }
    }
    return 0;
  }
  var handoffPoints = handoff ? bookHandoff(handoff) : 0;
  function showHandoff() {
    if (!handoff) return;
    var h = handoff; handoff = null;
    var after = h.tour ? function () {
      try { localStorage.setItem("pf-tour", "1"); localStorage.setItem("pf-tour-step", "welcome"); } catch (err) {}
      if (window.PFTour && window.PFTour.start) window.PFTour.start(h.flavor || "mobile");
    } : null;
    whenClear(function () { showSplash({ type: h.type, key: h.type, points: handoffPoints, after: after }); });
  }

  function init() {
    snapshot();
    unstash();
    setTimeout(showHandoff, 500);
    var q = /[?&]celebrate=(combined|rewardSplash|goalReached|milestone|major|streak)/.exec(location.search);
    if (q) setTimeout(function () { preview(q[1]); }, 800);
  }
  /* demo: fake a set of majors so the pages can be reviewed without earning */
  function preview(kind) {
    var e = eng(), cfg = e ? e.getConfig() : { levelBadges: [], achievementBadges: [] };
    if (kind === "streak") { showStreak(50); return "streak"; }
    if (kind === "major") return route([{ type: "action", kind: "major", key: "demo:" + Date.now(), title: "Attend Annual Conference", points: 500, icon: "lucide:sparkles" }]);
    if (kind === "goalReached") { var gg = (window.PFDailyGoal && window.PFDailyGoal.goal) || 280; return route([{ type: "dailyGoal", key: String(gg), mark: gg }]); }
    var lvl = (cfg.levelBadges || [])[1] || { key: "silver", name: "Silver", threshold: 5000, color: "#8a94a6" };
    var ach = (cfg.achievementBadges || [])[0] || { key: "first_blood", name: "First Blood", description: "Complete your very first point-earning action.", reward: "50 bonus credits", icon: "lucide:zap" };
    var items = [{ type: "level", key: lvl.key, title: lvl.splashTitle || (lvl.name + " unlocked"), sub: "You've crossed " + (e ? e.formatNumber(lvl.threshold) : lvl.threshold) + " lifetime points.", color: lvl.color, badge: lvl }];
    if (kind === "combined") {
      var g = (window.PFDailyGoal && window.PFDailyGoal.goal) || 280;
      items.push({ type: "dailyGoal", key: String(g), mark: g });
      items.push({ type: "achievement", key: ach.key, title: ach.name, sub: ach.description, reward: ach.reward, icon: ach.icon, badge: ach });
    }
    return route(items);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  window.PFRewards = {
    KINDS: KINDS, classify: classify, major: major, fromAction: fromAction, showSplash: showSplash, hideSplash: hideSplash, HANDOFF_KEY: HANDOFF_KEY,
    pending: function () { return pending.slice(); }, flush: flush, route: route, preview: preview,
    takeoverUp: takeoverUp, snapshot: snapshot
  };
})();
