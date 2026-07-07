/* PROfinity — page effects: entrance fade + exit transition.
   Loaded early in <body> so it runs before React mounts.
   Mirrors pagetrans.js; also exposes window.pfGo for nav. */
(function () {
  var root = document.documentElement;
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  // ENTER — gentle fade + rise on page load
  if (!reduce) {
    root.style.opacity = "0";
    root.style.transform = "translateY(10px)";
    root.style.willChange = "opacity, transform";
    var reveal = function () {
      root.style.transition = "opacity .30s ease, transform .34s cubic-bezier(.22,.61,.36,1)";
      root.style.opacity = "1";
      root.style.transform = "none";
    };
    requestAnimationFrame(function () { requestAnimationFrame(reveal); });
    // safety net: never leave the page invisible
    setTimeout(function () {
      root.style.opacity = "1";
      root.style.transform = "none";
    }, 600);
  }

  // EXIT — fade out before navigating
  window.pfGo = function (url) {
    if (!url) return;
    if (reduce) { window.location.href = url; return; }
    root.style.transition = "opacity .19s ease, transform .19s ease";
    root.style.opacity = "0";
    root.style.transform = "translateY(-7px)";
    setTimeout(function () { window.location.href = url; }, 175);
  };
})();
