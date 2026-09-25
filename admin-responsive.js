/* admin-responsive.js — off-canvas sidebar toggle for the desktop admin pages.
   Pairs with admin-responsive.css: below 1024px the sidebar is hidden and the
   header's lucide:panel-left icon opens/closes it (body.adm-nav-open). Works by
   event delegation so no React bundle needs to change. */
(function () {
  if (window.PFAdminResponsive) return;
  var MQ = '(max-width: 1024px)';
  var OPEN = 'adm-nav-open';
  var backdrop = null;

  function ensureBackdrop() {
    if (backdrop) return backdrop;
    backdrop = document.createElement('div');
    backdrop.className = 'adm-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.addEventListener('click', close);
    document.body.appendChild(backdrop);
    return backdrop;
  }
  function isNarrow() { return window.matchMedia(MQ).matches; }
  function open() { ensureBackdrop(); document.body.classList.add(OPEN); }
  function close() { document.body.classList.remove(OPEN); }
  function toggle() { document.body.classList.contains(OPEN) ? close() : open(); }

  document.addEventListener('click', function (e) {
    var icon = e.target && e.target.closest && e.target.closest('iconify-icon[icon="lucide:panel-left"]');
    if (icon && icon.parentElement && /-header$/.test((icon.parentElement.className || '').split(' ')[0] || '')) {
      if (!isNarrow()) return;
      e.preventDefault(); toggle(); return;
    }
    // tap on a nav item inside the open drawer closes it
    if (document.body.classList.contains(OPEN)) {
      var side = e.target.closest && e.target.closest('[class$="-sidebar"], .adl-sidebar');
      if (side && e.target.closest('button, a')) setTimeout(close, 120);
    }
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', function () { if (!isNarrow()) close(); });

  // ?admnav=1 opens the drawer on load (design review / screenshots)
  if (/[?&]admnav=1/.test(location.search)) {
    var boot = function () { if (isNarrow()) open(); };
    document.body ? boot() : document.addEventListener("DOMContentLoaded", boot);
  }
  window.PFAdminResponsive = { open: open, close: close, toggle: toggle };
})();
