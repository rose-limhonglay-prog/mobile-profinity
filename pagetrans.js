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

  // Scroll memory: each screen is a full page load rather than a kept-alive
  // stack entry, so a screen must save its own scroll offset right before
  // navigating away and restore it on the next load of that same page.
  window.pfSaveScroll = function (el) {
    if (!el) return;
    try { sessionStorage.setItem("pfScroll:" + location.pathname, String(el.scrollTop)); } catch (e) {}
  };
  window.pfRestoreScroll = function (el) {
    if (!el) return;
    try {
      var key = "pfScroll:" + location.pathname;
      var saved = sessionStorage.getItem(key);
      if (saved == null) return;
      sessionStorage.removeItem(key);
      el.scrollTop = parseInt(saved, 10) || 0;
    } catch (e) {}
  };

  // Watched-video memory: once a feed video has been opened (tapped through
  // to the fullscreen reel), remember it for the rest of the session so the
  // "people you follow reacted" bubbles don't keep nudging a video already seen.
  window.pfMarkWatched = function (id) {
    if (id == null) return;
    try { sessionStorage.setItem("pfWatched:" + id, "1"); } catch (e) {}
  };
  window.pfWasWatched = function (id) {
    if (id == null) return false;
    try { return sessionStorage.getItem("pfWatched:" + id) === "1"; } catch (e) { return false; }
  };
})();
