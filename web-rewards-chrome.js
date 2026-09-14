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
  var LOTTIE_SRC = "https://lottie.host/f5203bff-edd1-4727-a629-2a619bbe4edc/ArWGbXL6R3.json";
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
    d.className = "m-pts-delta"; d.setAttribute("aria-hidden", "true"); d.textContent = "+" + amt;
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
    showTotal(total); updateLabel(); pop(amt);
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
  function install() {
    var h = findHeader();
    if (!h) return false;
    addNavItem(h.nav);
    addPill(h.cluster);
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
