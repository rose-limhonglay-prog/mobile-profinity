/* PROfinity — launch splash.
   Plays the PROfinity logo Lottie (assets/lottie/launch-logo.json) full-screen
   like a cold start, then fades away to reveal the page underneath. It plays
   once per tab — on the first entry page the tab opens — and again only on a
   hard refresh (Navigation Timing type "reload"). Ordinary navigation between
   screens (newsfeed → profile → back) never replays it. Debug: ?splash=1
   forces it, ?splash=0 suppresses it. API: window.PFLaunchSplash.replay() /
   .reset(). */
(function () {
  var KEY = "pf-launch-seen";
  var SRC = "assets/lottie/launch-logo.json";
  var LOTTIE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
  var BG = "#2a2569";          // navy plate the animation paints
  var MAX_MS = 6500;           // safety net: never trap the user behind the splash
  var FADE_MS = 420;

  var q = "";
  try { q = new URLSearchParams(location.search).get("splash") || ""; } catch (e) {}
  // Once per tab (sessionStorage), replayed on a hard refresh.
  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
  var reloaded = false;
  try {
    var nav = performance.getEntriesByType("navigation")[0];
    reloaded = !!nav && nav.type === "reload";
  } catch (e) {}

  function markSeen() { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} }

  function loadLottie(cb) {
    if (window.lottie) { cb(); return; }
    var s = document.createElement("script");
    s.src = LOTTIE_CDN; s.async = true;
    s.onload = cb;
    s.onerror = cb; // play() checks window.lottie and bails gracefully
    document.head.appendChild(s);
  }

  // The splash lives inside the phone frame when there is one, so the bezel,
  // island and home indicator stay visible around it like a real cold start.
  function findHost() {
    return document.querySelector("[data-ios-device]");
  }

  var overlay = null, anim = null, closing = false, timer = null;

  function build(host) {
    overlay = document.createElement("div");
    overlay.className = "pf-launch";
    overlay.setAttribute("role", "presentation");
    overlay.setAttribute("aria-hidden", "true");
    // critical styles inline so the plate paints even before launch-splash.css
    overlay.style.cssText = "position:" + (host ? "absolute" : "fixed") + ";inset:0;background:" + BG +
      ";overflow:hidden;z-index:" + "2147483000" + (host ? ";border-radius:inherit" : "");
    var stage = document.createElement("div");
    stage.className = "pf-launch__stage";
    stage.style.cssText = "position:absolute;inset:0;";
    overlay.appendChild(stage);
    if (host) { overlay.classList.add("pf-launch--framed"); host.appendChild(overlay); }
    else document.body.appendChild(overlay);
    return stage;
  }

  function close() {
    if (closing) return;
    closing = true;
    clearTimeout(timer);
    markSeen();
    if (!overlay) return;
    overlay.classList.add("pf-launch--out");
    setTimeout(function () {
      if (anim) { try { anim.destroy(); } catch (e) {} anim = null; }
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      overlay = null;
      document.documentElement.classList.remove("pf-launch-active");
      try { window.dispatchEvent(new CustomEvent("pf:launch-splash-done")); } catch (e) {}
    }, FADE_MS);
  }

  function play() {
    closing = false;
    document.documentElement.classList.add("pf-launch-active");
    var host = findHost();
    var stage = build(host);
    timer = setTimeout(close, MAX_MS);
    loadLottie(function () {
      if (!window.lottie || !overlay) { close(); return; }
      try {
        anim = window.lottie.loadAnimation({
          container: stage, renderer: "svg", loop: false, autoplay: true, path: SRC,
          rendererSettings: { preserveAspectRatio: "xMidYMid slice", progressiveLoad: false }
        });
        anim.addEventListener("complete", close);
        anim.addEventListener("data_failed", close);
        anim.addEventListener("error", close);
      } catch (e) { close(); }
    });
  }

  // Wait until the React shell has mounted the phone frame (it renders
  // synchronously on script run, so one frame after DOMContentLoaded is enough;
  // fall back to body if no frame appears).
  function whenReady(cb) {
    var tries = 0;
    (function tick() {
      if (findHost() || tries++ > 20) { cb(); return; }
      requestAnimationFrame(tick);
    })();
  }

  // First load of the tab or a hard refresh; ?splash=1 forces, ?splash=0 suppresses
  // (reduced-motion doesn't skip it).
  var should = q === "1" || ((!seen || reloaded) && q !== "0");
  if (should) {
    markSeen();
    // Hide the page paint under the splash instantly (before React mounts).
    document.documentElement.classList.add("pf-launch-active");
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { whenReady(play); });
    } else whenReady(play);
  }

  window.PFLaunchSplash = {
    replay: function () { if (overlay) return; play(); },
    reset: function () { try { sessionStorage.removeItem(KEY); } catch (e) {} },
    close: close
  };
})();
