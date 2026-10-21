/* ===========================================================================
   PROfinity — web TopNav rewards chrome
   Adds two things to the DS TopNav on every desktop page (loaded after
   account-menu.js, before the page's own compiled script):

     1. a "Rewards" nav item (gift icon) after Agent → RewardsWeb.html
     2. the lifetime points tally pill in the right-hand icon cluster, before
        the bell — the desktop twin of the mobile header pill (PointsPillC in
        mobilechrome.jsx): syringe Lottie, gold number, listens for
        `pf:points-earned` (books the payout in window.PFLoyalty, pops the
        number, floats a "+N" delta) and `storage` (another tab earned).

   The TopNav is a bound DS component with a fixed item list, so — like
   account-menu.js — this waits for React to paint the <header> and then
   injects plain DOM. Classes reuse the mobile .m-pts names so the shared
   dark-mode.css rules apply; the base styles live in web-rewards-chrome.css.
   =========================================================================== */
(function () {
  "use strict";

  var REWARDS_URL = "RewardsWeb.html";
  var LOTTIE_SRC = "https://lottie.host/f5203bff-edd1-4727-a629-2a619bbe4edc/ArWGbXL6R3.json";   /* smiling face (the Dr Tim avatar was reverted 2026-10-13) */
  var LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
  var FALLBACK_TOTAL = 14000, FALLBACK_FULL = 20000;

  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
  function reduceMotion() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function fmt(n) { return Math.round(n).toLocaleString("en-GB"); }
  function isRewardsPage() { return /RewardsWeb\.html$/i.test(window.location.pathname); }

  function readTotal() {
    var eng = window.PFLoyalty;
    if (eng) { try { return Math.max(0, Math.round(eng.getState().lifetimePoints || 0)); } catch (e) { /* fall through */ } }
    return FALLBACK_TOTAL;
  }
  function readFull() {
    var eng = window.PFLoyalty;
    if (eng && eng.getConfig) { try { return Math.max(1, +eng.getConfig().beakerFullPoints || FALLBACK_FULL); } catch (e) { /* fall through */ } }
    return FALLBACK_FULL;
  }

  /* ------------------------------------------------------------ header */
  function findHeader() {
    var header = document.querySelector("header");
    if (!header || !header.querySelector("nav")) return null;
    var groups = header.querySelectorAll(":scope > div");
    if (!groups.length) return null;
    return { header: header, nav: header.querySelector("nav"), cluster: groups[groups.length - 1] };
  }

  /* ------------------------------------------------------- nav item */
  function addNavItem(nav) {
    if (nav.querySelector(".pf-nav-rewards")) return;
    var active = isRewardsPage();
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pf-nav-rewards" + (active ? " is-active" : "");
    if (active) btn.setAttribute("aria-current", "page");
    btn.innerHTML =
      '<span class="pf-nav-rewards-ic"><iconify-icon icon="lucide:gift" width="24" height="24"></iconify-icon></span>' +
      '<span class="pf-nav-rewards-lbl">Rewards</span>';
    btn.addEventListener("click", function () { if (!active) go(REWARDS_URL); });
    nav.appendChild(btn);
  }

  /* ------------------------------------------------------- points pill */
  var pill, numEl, icHost, icFb, total, shownVal, rafId;

  function ensureLottieLib() {
    if (window.lottie || document.querySelector("script[data-pf-lottie]")) return;
    var sc = document.createElement("script");
    sc.src = LOTTIE_LIB; sc.async = true; sc.setAttribute("data-pf-lottie", "1");
    document.head.appendChild(sc);
  }
  function startLottie() {
    var still = reduceMotion();
    fetch(LOTTIE_SRC).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
      if (!data || !window.lottie || !icHost) return;
      var anim = window.lottie.loadAnimation({ container: icHost, renderer: "svg", loop: !still, autoplay: !still, animationData: data,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet", progressiveLoad: false } });
      anim.addEventListener("DOMLoaded", function () {
        if (still) anim.goToAndStop(0, true);
        icHost.classList.add("on");
        if (icFb) icFb.style.display = "none";
      });
    }).catch(function () { /* keep the static syringe */ });
  }
  function bootLottie() {
    ensureLottieLib();
    if (window.lottie) { startLottie(); return; }
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (window.lottie) { clearInterval(iv); startLottie(); }
      else if (tries > 65) clearInterval(iv);
    }, 120);
  }

  /* Ease the displayed number from its previous value to the new total. */
  function showTotal(target) {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    var start = shownVal == null ? target : shownVal;
    if (start === target || reduceMotion() || typeof requestAnimationFrame !== "function") {
      shownVal = target; numEl.textContent = fmt(target); return;
    }
    var t0 = performance.now(), dur = 650;
    var tick = function (now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      shownVal = Math.round(start + (target - start) * e);
      numEl.textContent = fmt(shownVal);
      if (p < 1) rafId = requestAnimationFrame(tick); else rafId = null;
    };
    rafId = requestAnimationFrame(tick);
  }
  function updateLabel() {
    var full = readFull();
    pill.setAttribute("aria-label", fmt(total) + " points, " + Math.round(Math.min(1, total / full) * 100) + "% of " + fmt(full) + ". Open rewards");
    pill.title = fmt(total) + " / " + fmt(full) + " pts";
  }
  function refresh() { total = readTotal(); showTotal(total); updateLabel(); }

  function pop(amt) {
    numEl.classList.remove("pop"); void numEl.offsetWidth; numEl.classList.add("pop");
    pill.classList.remove("earn"); void pill.offsetWidth; pill.classList.add("earn");
    var old = pill.querySelector(".m-pts-delta"); if (old) old.remove();
    var d = document.createElement("span");
    d.className = "m-pts-delta" + (amt < 0 ? " is-neg" : ""); d.setAttribute("aria-hidden", "true"); d.textContent = amt < 0 ? "\u2212" + Math.abs(amt) : "+" + amt;
    pill.appendChild(d);
    setTimeout(function () { d.remove(); pill.classList.remove("earn"); }, 1500);
  }
  function onEarn(e) {
    var amt = e && e.detail ? Math.round(+e.detail.amount || 0) : 0;
    if (!amt) return;
    var eng = window.PFLoyalty;
    if (eng) {
      try {
        if (e.detail.booked) { /* sender already wrote the ledger entry */ }
        else if (eng.awardPoints) eng.awardPoints(amt, e.detail.label, e.detail.actionId);
        else eng.setState({ lifetimePoints: (eng.getState().lifetimePoints || 0) + amt });
      } catch (err) { /* fall through to a local bump */ }
      total = readTotal();
    } else {
      total += amt;
    }
    showTotal(total); updateLabel();
    /* points pop-ups off (Notification Settings → Gamification) */
    var popOn = true; try { var gs = JSON.parse(localStorage.getItem("pf-gamification")) || {}; popOn = gs.pointsPopup !== false; } catch (e2) {}
    if (popOn) pop(amt);
  }
  function onStorage(e) { if (!e.key || e.key === "pf-loyalty-state-v1" || e.key === "pf-loyalty-config-v1") refresh(); }

  function addPill(cluster) {
    if (cluster.querySelector(".m-pts")) return;
    total = readTotal();
    pill = document.createElement("button");
    pill.type = "button";
    pill.className = "m-pts pf-web-pts";
    pill.innerHTML =
      '<span class="m-pts-ic" aria-hidden="true">' +
        '<span class="m-pts-ic-fb"><iconify-icon icon="lucide:smile" width="18" height="18" style="color:#FCC25D"></iconify-icon></span>' +
        '<span class="m-pts-ic-anim"></span>' +
      '</span>' +
      '<span class="m-pts-n"></span>';
    numEl = pill.querySelector(".m-pts-n");
    icHost = pill.querySelector(".m-pts-ic-anim");
    icFb = pill.querySelector(".m-pts-ic-fb");
    numEl.textContent = fmt(total); shownVal = total;
    updateLabel();
    pill.addEventListener("click", function () { go(REWARDS_URL); });
    cluster.insertBefore(pill, cluster.firstChild);
    window.addEventListener("pf:points-earned", onEarn);
    window.addEventListener("storage", onStorage);
    bootLottie();
  }

  /* --------------------------------------------------------------- boot */
  /* Rewards page header (user, 2026-10-20): no search box, bell or messages —
     the points pill, a streak pill and a settings button instead. Desktop
     twin of the mobile PF_CHROME_REWARDS header in mobilechrome.jsx. */
  /* the header streak flame (lottie.host "Streak icon update" COmLSCf8Io, blue),
     loaded as raw JSON through lottie-web — the /embed URL is an HTML page */
  var FLAME_SRC = "https://lottie.host/9f92eeef-b540-4344-afb9-0ea438a4f381/COmLSCf8Io.json";
  var GEAR_SVG = '<svg class="pf-fun-gear" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><defs><linearGradient id="pfFunGearGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B3A8FF"/><stop offset="1" stop-color="#5B4FD6"/></linearGradient></defs><path class="pf-fun-gear-body" d="M19.94 11.00 L22.17 11.28 L22.17 12.72 L19.94 13.00 L18.32 16.90 L19.70 18.69 L18.69 19.70 L16.90 18.32 L13.00 19.94 L12.72 22.17 L11.28 22.17 L11.00 19.94 L7.10 18.32 L5.31 19.70 L4.30 18.69 L5.68 16.90 L4.06 13.00 L1.83 12.72 L1.83 11.28 L4.06 11.00 L5.68 7.10 L4.30 5.31 L5.31 4.30 L7.10 5.68 L11.00 4.06 L11.28 1.83 L12.72 1.83 L13.00 4.06 L16.90 5.68 L18.69 4.30 L19.70 5.31 L18.32 7.10 Z" fill="url(#pfFunGearGrad)" stroke="url(#pfFunGearGrad)" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.4" fill="#FFF3D6"/><circle cx="12" cy="12" r="1.3" fill="#5B4FD6"/><path class="pf-fun-gear-spark" d="M19.2 2.2 L19.9 4.3 L22 5 L19.9 5.7 L19.2 7.8 L18.5 5.7 L16.4 5 L18.5 4.3 Z" fill="#FCC25D"/></svg>';
  function bootFlame(host, fb) {
    ensureLottieLib();
    var go2 = function () {
      var still = reduceMotion();
      fetch(FLAME_SRC).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
        if (!data || !window.lottie || !host) return;
        var anim = window.lottie.loadAnimation({ container: host, renderer: "svg", loop: !still, autoplay: !still, animationData: data,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet", progressiveLoad: false } });
        anim.addEventListener("DOMLoaded", function () { if (still) anim.goToAndStop(0, true); host.classList.add("on"); if (fb) fb.style.display = "none"; });
      }).catch(function () {});
    };
    if (window.lottie) { go2(); return; }
    var tries = 0, iv = setInterval(function () { tries++; if (window.lottie) { clearInterval(iv); go2(); } else if (tries > 65) clearInterval(iv); }, 120);
  }
  function readStreak() { try { var L = window.PFLoyalty, s = L && L.getState ? L.getState() : null; return s && s.streak ? (s.streak.current || 0) : 0; } catch (e) { return 0; } }
  function rewardsHeader(h) {
    if (!isRewardsPage() || h.cluster.querySelector(".pf-web-streak")) return;
    /* hide via a header class + CSS (web-rewards-chrome.css): the TopNav is
       React-rendered and would re-apply inline styles over a style="" hide */
    h.header.classList.add("pf-hdr-rewards");
    var streak = document.createElement("button");
    streak.type = "button"; streak.className = "m-pts pf-web-pts pf-web-streak";
    streak.innerHTML =
      '<span class="m-pts-ic" aria-hidden="true">' +
        '<span class="m-pts-ic-fb"><iconify-icon icon="lucide:flame" width="20" height="20" style="color:#43CBFF"></iconify-icon></span>' +
        '<span class="m-pts-ic-anim pf-web-streak-anim"></span>' +
      '</span><span class="m-pts-n"></span>';
    bootFlame(streak.querySelector(".pf-web-streak-anim"), streak.querySelector(".m-pts-ic-fb"));
    var sn = streak.querySelector(".m-pts-n");
    var paintStreak = function () { var d = readStreak(); sn.textContent = d; streak.setAttribute("aria-label", d + "-day streak. Open check-in streak"); streak.title = d + "-day streak"; };
    paintStreak();
    streak.addEventListener("click", function () { go("CheckInStreak.html"); });
    window.addEventListener("pf:points-earned", paintStreak);
    window.addEventListener("storage", function (e) { if (!e.key || e.key === "pf-loyalty-state-v1") paintStreak(); });
    var gear = document.createElement("button");
    gear.type = "button"; gear.className = "pf-web-gear"; gear.setAttribute("aria-label", "Rewards settings"); gear.title = "Rewards settings";
    gear.innerHTML = GEAR_SVG;   /* fun gear: violet gradient, cream hub, gold twinkle (user, 2026-10-20) */
    gear.addEventListener("click", function () { go("RewardsSettingsWeb.html"); });
    /* visible order: points pill (first child) · streak · settings · account */
    var user = h.cluster.querySelector(".pf-hdr-user") || null;
    h.cluster.insertBefore(streak, user);
    h.cluster.insertBefore(gear, user);
  }
  function install() {
    var h = findHeader();
    if (!h) return false;
    addNavItem(h.nav);
    addPill(h.cluster);
    rewardsHeader(h);
    return true;
  }
  function boot() {
    if (install()) return;
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (install() || tries > 80) clearInterval(iv);
    }, 120);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
