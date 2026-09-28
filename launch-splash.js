/* PROfinity — launch splash.
   A native CSS-animated cold-start sequence built from the brand artwork in
   assets/splash/ (the same images the old launch-logo.json Lottie embedded):
     navy plate + soft glow → diamond "twist" icon settles in and flips twice
     → dissolves into the white "P" mark → the P warms to gold with a light
     sweep → hold on the icon alone → the plate fades and gently zooms away to
     reveal the page underneath. (The "ROfinity" wordmark was dropped
     2026-09-28 at the user's request: the splash ends on the icon only.)
   Runs on CSS keyframes (see launch-splash.css) so it starts instantly — no
   lottie-web download or 940 KB JSON parse before the first frame.
   It plays once per tab — on the first entry page the tab opens — and again
   only on a hard refresh (Navigation Timing type "reload"). Ordinary
   navigation between screens never replays it. Debug: ?splash=1 forces it,
   ?splash=0 suppresses it. API: window.PFLaunchSplash.replay() / .reset() /
   .close(). Fires "pf:launch-splash-done" on window when it has gone. */
(function () {
  var KEY = "pf-launch-seen";
  var DIR = "assets/splash/";
  var ASSETS = {
    twistA: DIR + "twist-a.png",   // purple diamond, gold P
    twistB: DIR + "twist-b.png",   // gold diamond, purple P
    pWhite: DIR + "p-white.png",
    pGold:  DIR + "p-gold.png"
  };
  var BG = "#2a2569";          // navy plate (painted inline so it shows before the CSS lands)
  var HOLD_MS = 3900;          // when the exit starts (see the timeline in launch-splash.css)
  var EXIT_MS = 560;           // .pf-launch--out transition length
  var MAX_MS = 7000;           // safety net: never trap the user behind the splash
  var DECODE_WAIT_MS = 700;    // how long we wait for the first image before starting anyway

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

  // Kick the image downloads off as early as possible (this script runs in <head>).
  var preloaded = {};
  function preload() {
    Object.keys(ASSETS).forEach(function (k) {
      if (preloaded[k]) return;
      var im = new Image();
      im.decoding = "async";
      im.src = ASSETS[k];
      preloaded[k] = im;
    });
  }

  // The splash lives inside the phone frame when there is one, so the bezel,
  // island and home indicator stay visible around it like a real cold start.
  function findHost() {
    return document.querySelector("[data-ios-device]");
  }

  var overlay = null, closing = false, timer = null, holdTimer = null;

  function el(cls, tag) {
    var n = document.createElement(tag || "div");
    n.className = cls;
    return n;
  }
  function img(cls, src, alt) {
    var n = document.createElement("img");
    n.className = cls;
    n.src = src;
    n.alt = alt || "";
    n.draggable = false;
    n.decoding = "async";
    return n;
  }

  function build(host) {
    overlay = el("pf-launch");
    overlay.setAttribute("role", "presentation");
    overlay.setAttribute("aria-hidden", "true");
    // critical styles inline so the plate paints even before launch-splash.css
    overlay.style.cssText = "position:" + (host ? "absolute" : "fixed") + ";inset:0;background:" + BG +
      ";overflow:hidden;z-index:2147483000" + (host ? ";border-radius:inherit" : "");

    var glow = el("pf-launch__glow");
    var scene = el("pf-launch__scene");

    // diamond twist icon (two colourways flipped on the Y axis)
    var twist = el("pf-launch__twist");
    twist.appendChild(img("pf-launch__twist-face pf-launch__twist-a", ASSETS.twistA));
    twist.appendChild(img("pf-launch__twist-face pf-launch__twist-b", ASSETS.twistB));

    // the P mark, centred (white first, then gold with a light sweep + halo)
    var lockup = el("pf-launch__lockup");
    var mark = el("pf-launch__mark");
    mark.appendChild(img("pf-launch__p pf-launch__p-white", ASSETS.pWhite));
    mark.appendChild(img("pf-launch__p pf-launch__p-gold", ASSETS.pGold));
    var sheen = el("pf-launch__sheen");
    sheen.style.webkitMaskImage = "url(" + ASSETS.pGold + ")";
    sheen.style.maskImage = "url(" + ASSETS.pGold + ")";
    mark.appendChild(sheen);
    var halo = el("pf-launch__halo");
    mark.appendChild(halo);
    lockup.appendChild(mark);

    scene.appendChild(twist);
    scene.appendChild(lockup);
    overlay.appendChild(glow);
    overlay.appendChild(scene);

    if (host) { overlay.classList.add("pf-launch--framed"); host.appendChild(overlay); }
    else document.body.appendChild(overlay);
  }

  function close() {
    if (closing) return;
    closing = true;
    clearTimeout(timer); clearTimeout(holdTimer);
    markSeen();
    if (!overlay) return;
    overlay.classList.add("pf-launch--out");
    setTimeout(function () {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      overlay = null;
      document.documentElement.classList.remove("pf-launch-active");
      try { window.dispatchEvent(new CustomEvent("pf:launch-splash-done")); } catch (e) {}
    }, EXIT_MS);
  }

  // Start the keyframes only once the first image is decoded so the diamond
  // doesn't pop in half-loaded; give up waiting after DECODE_WAIT_MS.
  function whenFirstFrameReady(cb) {
    var done = false;
    function go() { if (!done) { done = true; cb(); } }
    var first = preloaded.twistA;
    if (first && first.complete && first.naturalWidth) { go(); return; }
    if (first && first.decode) first.decode().then(go, go);
    else if (first) { first.onload = go; first.onerror = go; }
    setTimeout(go, DECODE_WAIT_MS);
  }

  function play() {
    closing = false;
    preload();
    document.documentElement.classList.add("pf-launch-active");
    build(findHost());
    timer = setTimeout(close, MAX_MS);
    whenFirstFrameReady(function () {
      if (!overlay) return;
      // two frames so the initial (pre-run) styles are committed before the animations start
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        if (!overlay) return;
        overlay.classList.add("pf-launch--run");
        holdTimer = setTimeout(close, HOLD_MS);
      }); });
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
    preload();
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
