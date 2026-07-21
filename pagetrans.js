/* PROfinity — lightweight page transition (no loader / no curtain).
   ENTER: the page fades + eases up into place on load.
   EXIT:  window.pfGo(url) fades the page out, then navigates.
   Uses style transitions (not keyframes w/ fill) so a backgrounded tab
   always settles visible. Honors prefers-reduced-motion. */
(function () {
  var root = document.documentElement;
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  // ENTER
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
    // clear the will-change hint once settled — left on, it keeps forcing a
    // containing block for every position:fixed element on the page (modals
    // end up sized against full document height instead of the viewport)
    var clearWillChange = function () { root.style.willChange = "auto"; };
    root.addEventListener("transitionend", clearWillChange, { once: true });
    // safety net: never leave the page invisible (or will-change stuck)
    setTimeout(function () { root.style.opacity = "1"; root.style.transform = "none"; clearWillChange(); }, 600);
  }

  // EXIT
  window.pfGo = function (url) {
    if (!url) return;
    if (reduce) { window.location.href = url; return; }
    root.style.transition = "opacity .19s ease, transform .19s ease";
    root.style.opacity = "0";
    root.style.transform = "translateY(-7px)";
    setTimeout(function () { window.location.href = url; }, 175);
  };
})();
