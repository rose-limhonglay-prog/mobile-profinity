/* ===========================================================================
   PROfinity — icons-preload.js
   Load this INSTEAD of the bare <iconify-icon> component script.

   Why: the component resolves icon names lazily against api.iconify.design,
   one batch per pending name set. On a page with ~90 glyphs that pass stalls
   and most <iconify-icon> instances end up with a shadow root and no <svg>
   (they render 0×0). This file:
     1. claims the `script[data-iconify]` slot synchronously so the DS bundle's
        ensureIconify() does not inject the CDN component behind our back;
     2. bulk-fetches the collections the page uses (one request per prefix);
     3. hands them to the component via window.IconifyPreload and only then
        loads vendor/iconify-icon.min.js — every glyph resolves locally.
   If the API is unreachable the component still loads after a short timeout
   and falls back to its normal lazy behaviour.

   Pages needing extra glyphs can add them before this script runs:
     window.PF_ICONS_EXTRA = { lucide: ["lucide:foo"], fluent: ["fluent:bar"] };
   =========================================================================== */
(function () {
  var self = document.currentScript;
  if (self) self.setAttribute("data-iconify", "");
  else if (!document.querySelector("script[data-iconify]")) {
    var marker = document.createElement("script");
    marker.type = "text/plain";
    marker.setAttribute("data-iconify", "");
    document.head.appendChild(marker);
  }

  /* Every icon name used by the mobile chrome, the Ava coach, the tour and the
     Course Detail (Confidence) page. Keep prefix-grouped; names are the part
     after "prefix:". */
  var ICONS = {
    lucide: [
      "chevron-left", "chevron-right", "chevron-up", "chevron-down", "arrow-left", "arrow-right", "arrow-up-right",
      "cast", "airplay", "settings-2", "skip-back", "skip-forward", "notebook-pen", "minimize", "maximize",
      "search", "bookmark", "bookmark-check", "share-2", "play", "circle-play", "check", "check-circle-2",
      "file-text", "file", "file-type-2", "download", "folder", "folder-open", "lock", "sparkles", "send",
      "heart", "message-circle", "home", "users", "book-open", "user", "gift", "bell", "menu", "x",
      "clock", "layers", "bar-chart-2", "award", "target", "trophy", "list-checks", "route", "help-circle",
      "crown", "gem", "badge-check", "log-out", "moon", "sun", "cloud-sun", "syringe", "more-vertical", "calendar",
      "graduation-cap", "phone", "phone-call", "maximize-2", "square-pen", "bell-off", "megaphone",
      "rotate-ccw", "rotate-cw", "skip-forward", "presentation", "info", "flag", "star", "pause", "volume-2", "volume-x", "maximize",
      "plus", "tag", "link", "newspaper", "more-horizontal", "headset", "settings"],
    fluent: ["play-16-filled", "pause-16-filled", "ribbon-star-16-filled"]
  };
  var extra = window.PF_ICONS_EXTRA || {};
  Object.keys(extra).forEach(function (prefix) {
    ICONS[prefix] = ICONS[prefix] || [];
    (extra[prefix] || []).forEach(function (n) {
      n = String(n).replace(/^[^:]+:/, "");
      if (ICONS[prefix].indexOf(n) === -1) ICONS[prefix].push(n);
    });
  });

  var loaded = false;
  /* Register collections. Before the component boots they ride in on
     window.IconifyPreload; after it has booted (slow API → timeout fallback)
     they go straight to the element class, which upgrades pending glyphs. */
  function register(collections) {
    var good = (collections || []).filter(function (c) { return c && typeof c === "object" && c.icons; });
    if (!good.length) return;
    var El = window.customElements && window.customElements.get("iconify-icon");
    if (El && typeof El.addCollection === "function") {
      good.forEach(function (c) { try { El.addCollection(c); } catch (e) {} });
    } else {
      window.IconifyPreload = (window.IconifyPreload || []).concat(good);
    }
  }
  function loadComponent(collections) {
    register(collections);
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.src = "vendor/iconify-icon.min.js";
    s.async = false;
    document.head.appendChild(s);
  }

  var fetches = Object.keys(ICONS).map(function (prefix) {
    var url = "https://api.iconify.design/" + prefix + ".json?icons=" + encodeURIComponent(ICONS[prefix].join(","));
    return fetch(url).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  });

  /* never hold the page hostage: if the API is slow, load lazily instead */
  var timer = setTimeout(function () { loadComponent([]); }, 4000);
  Promise.all(fetches).then(function (cols) { clearTimeout(timer); loadComponent(cols); },
    function () { clearTimeout(timer); loadComponent([]); });
})();
