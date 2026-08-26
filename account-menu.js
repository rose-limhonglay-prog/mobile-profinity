/* ===========================================================================
   PROfinity — Web account menu (plain JS, no React)
   Loaded on every desktop (TopNav) page, after that page's own compiled
   script. TopNav's user/name/chevron block ships with no click handler of
   its own (it's a plain decorative <div> in the design-system bundle), so
   this progressively enhances it the same way notifications.js enhances the
   bell icon: find the element, make it a real control, open a small menu.
   =========================================================================== */
(function () {
  "use strict";

  function findTrigger() {
    var header = document.querySelector("header");
    if (!header) return null;
    var groups = header.querySelectorAll(":scope > div");
    if (!groups.length) return null;
    var iconCluster = groups[groups.length - 1];
    var divs = iconCluster.querySelectorAll(":scope > div");
    return divs.length ? divs[divs.length - 1] : null;
  }

  var triggerEl, menuEl, open = false;

  var NAV_ITEMS = [
    { label: "Edit Profile", icon: "lucide:user", href: "Profile.html" },
    { label: "Settings", icon: "lucide:settings", href: "AccountSettingsWeb.html" },
    { label: "Notifications", icon: "lucide:bell", href: "NotificationSettingsWeb.html" }
  ];

  function isDark() {
    try { return localStorage.getItem("pf-theme") === "dark"; } catch (e) { return false; }
  }

  function setDark(next) {
    try {
      localStorage.setItem("pf-theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    } catch (e) {}
  }

  function navItemsHtml() {
    return NAV_ITEMS.map(function (item) {
      return '<button type="button" class="pf-account-menu-item" role="menuitem" data-href="' + item.href + '">' +
        '<iconify-icon icon="' + item.icon + '" width="17" height="17"></iconify-icon>' + item.label +
      '</button>';
    }).join("");
  }

  function ensureMenu() {
    if (menuEl) return;
    menuEl = document.createElement("div");
    menuEl.id = "pf-account-menu";
    menuEl.setAttribute("role", "menu");
    menuEl.setAttribute("aria-label", "Account");
    menuEl.style.display = "none";
    menuEl.innerHTML =
      navItemsHtml() +
      '<div class="pf-account-menu-row" id="pf-account-dark-row" role="menuitemcheckbox">' +
        '<span class="pf-account-menu-row-label">' +
          '<iconify-icon icon="lucide:moon" width="17" height="17"></iconify-icon>Dark mode' +
        '</span>' +
        '<button type="button" class="pf-toggle" role="switch" id="pf-account-dark-toggle" aria-label="Toggle dark mode">' +
          '<span class="pf-toggle-knob"></span>' +
        '</button>' +
      '</div>' +
      '<div class="pf-account-menu-divider"></div>' +
      '<button type="button" class="pf-account-menu-item pf-account-menu-item--danger" role="menuitem" id="pf-account-logout">' +
        '<iconify-icon icon="lucide:log-out" width="17" height="17"></iconify-icon>Log out' +
      '</button>';
    document.body.appendChild(menuEl);

    menuEl.querySelectorAll(".pf-account-menu-item[data-href]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeMenu();
        (window.pfGo || function (u) { window.location.href = u; })(btn.getAttribute("data-href"));
      });
    });

    var darkToggle = menuEl.querySelector("#pf-account-dark-toggle");
    function syncDarkToggle() {
      var on = isDark();
      darkToggle.classList.toggle("on", on);
      darkToggle.setAttribute("aria-checked", on ? "true" : "false");
    }
    syncDarkToggle();
    darkToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setDark(!isDark());
      syncDarkToggle();
    });

    menuEl.querySelector("#pf-account-logout").addEventListener("click", function () {
      closeMenu();
      (window.pfGo || function (u) { window.location.href = u; })("AuthWeb.html?view=loggedout");
    });
    menuEl.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  function positionMenu() {
    var rect = triggerEl.getBoundingClientRect();
    menuEl.style.top = Math.round(rect.bottom + 10) + "px";
    menuEl.style.right = Math.max(12, window.innerWidth - rect.right) + "px";
    menuEl.style.left = "auto";
  }

  function openMenu() {
    ensureMenu();
    menuEl.style.display = "block";
    positionMenu();
    open = true;
    triggerEl.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(function () { menuEl.classList.add("pf-account-menu-open"); });
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", onDocKeydown);
    window.addEventListener("resize", positionMenu);
  }

  function closeMenu() {
    if (!open) return;
    open = false;
    triggerEl.setAttribute("aria-expanded", "false");
    menuEl.classList.remove("pf-account-menu-open");
    document.removeEventListener("click", onDocClick, true);
    document.removeEventListener("keydown", onDocKeydown);
    window.removeEventListener("resize", positionMenu);
    window.setTimeout(function () { if (menuEl) menuEl.style.display = "none"; }, 150);
  }

  function toggleMenu() { if (open) closeMenu(); else openMenu(); }
  function onDocKeydown(e) { if (e.key === "Escape") closeMenu(); }
  function onDocClick(e) {
    if (e.target.closest && (e.target.closest("#pf-account-menu") || e.target === triggerEl || triggerEl.contains(e.target))) return;
    closeMenu();
  }

  function wireTrigger() {
    if (!triggerEl || triggerEl.dataset.pfAccountWired) return;
    triggerEl.dataset.pfAccountWired = "1";
    triggerEl.classList.add("pf-account-trigger");
    triggerEl.setAttribute("role", "button");
    triggerEl.setAttribute("tabindex", "0");
    triggerEl.setAttribute("aria-haspopup", "menu");
    triggerEl.setAttribute("aria-expanded", "false");
    triggerEl.setAttribute("aria-label", "Account menu");
    triggerEl.addEventListener("click", function (e) { e.stopPropagation(); toggleMenu(); });
    triggerEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleMenu(); }
    });
  }

  function boot() {
    triggerEl = findTrigger();
    if (triggerEl) { wireTrigger(); return; }
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      triggerEl = findTrigger();
      if (triggerEl) { clearInterval(iv); wireTrigger(); }
      else if (tries > 80) clearInterval(iv);
    }, 120);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
