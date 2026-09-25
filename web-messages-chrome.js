/* ===========================================================================
   PROfinity — web TopNav messages chrome
   The DS TopNav's right-hand cluster already draws a chat-bubble button with
   a static "12" badge straight after the bell, but nothing is wired to it.
   Loaded after web-rewards-chrome.js on every desktop page, this:

     1. labels that button "Messages" and keeps its badge equal to the real
        unread total in the shared Messages store ("pf-messages-v1", written
        by messages-mobile.jsx on both the mobile and the web Messages page).
        No store yet → the seed's total. Listens for `storage` (another tab)
        and `pf:messages-changed` (this tab).
     2. on click, opens Messenger's "Chats" dropdown under the button and
        floating chat popups bottom-right — the DM bundle
        (messages-mobile.compiled.js + its two stylesheets) is loaded lazily
        on first click with PF_DM_NO_MOUNT + PF_DM_WEB, then
        PFMessagesDM.mountChrome() renders MessagesChromeDM into #pf-dm-chrome.
        On MessagesWeb.html itself the button is just marked current.

   Like account-menu.js it waits for React to paint the <header>, then works
   on the plain DOM. No stylesheet of its own.
   =========================================================================== */
(function () {
  "use strict";

  var MESSAGES_URL = "MessagesWeb.html";
  var STORE_KEY = "pf-messages-v1";
  var SEED_UNREAD = 10; // sum of CONVERSATIONS_SEED_DM[].unread in messages-mobile.jsx
  var BUNDLE = "messages-mobile.compiled.js?v=30";
  var SHEETS = ["messages-mobile.css?v=29", "messages-web.css?v=3"];

  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
  function isMessagesPage() { return /MessagesWeb\.html$/i.test(window.location.pathname); }

  function unreadTotal() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!s || !Array.isArray(s.conversations)) return SEED_UNREAD;
      return s.conversations.reduce(function (n, c) { return n + (c.archived ? 0 : (c.unread || 0)); }, 0);
    } catch (e) { return SEED_UNREAD; }
  }

  /* the cluster button right after the bell */
  function findButton() {
    var header = document.querySelector("header");
    if (!header || !header.querySelector("nav")) return null;
    var groups = header.querySelectorAll(":scope > div");
    var cluster = groups[groups.length - 1];
    if (!cluster) return null;
    var bell = cluster.querySelector("#pf-notif-bell");
    if (!bell) return null;
    var el = bell.nextElementSibling;
    return el && el.tagName === "BUTTON" ? el : null;
  }

  var btn = null;

  function sync() {
    if (!btn || !document.body.contains(btn)) { btn = null; return; }
    var n = unreadTotal();
    var badge = btn.querySelector("span");
    var text = n > 99 ? "99+" : String(n);
    if (badge) {
      if (badge.textContent !== text) badge.textContent = text;
      badge.style.display = n > 0 ? "" : "none";
    }
    var label = n > 0 ? "Messages, " + n + " unread" : "Messages";
    if (btn.getAttribute("aria-label") !== label) btn.setAttribute("aria-label", label);
  }

  /* ------------------------------------------------ lazy DM bundle + chrome */
  var chrome = null, loading = false;
  function ensureBundle(cb) {
    if (window.PFMessagesDM) { cb(); return; }
    if (loading) return;
    loading = true;
    SHEETS.forEach(function (href) {
      var base = href.split("?")[0];
      if (document.querySelector('link[href^="' + base + '"]')) return;
      var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
    });
    window.PF_DM_WEB = true;
    window.PF_DM_NO_MOUNT = true;
    var s = document.createElement("script");
    s.src = BUNDLE;
    s.onload = function () { loading = false; cb(); };
    s.onerror = function () { loading = false; go(MESSAGES_URL); };
    document.body.appendChild(s);
  }
  function toggleChats() {
    if (chrome) { chrome.toggle(); return; }
    if (!window.React || !window.ReactDOM || !window.ProfinityDesignSystem_c2b5cc) { go(MESSAGES_URL); return; }
    ensureBundle(function () {
      var host = document.getElementById("pf-dm-chrome");
      if (!host) { host = document.createElement("div"); host.id = "pf-dm-chrome"; document.body.appendChild(host); }
      chrome = window.PFMessagesDM.mountChrome(host, { open: true });
    });
  }

  function wire(el) {
    btn = el;
    btn.id = "pf-msg-btn";
    btn.classList.add("pf-web-msgs");
    btn.title = "Messages";
    btn.setAttribute("aria-haspopup", "dialog");
    if (isMessagesPage()) btn.setAttribute("aria-current", "page");
    btn.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      if (isMessagesPage()) return;
      toggleChats();
    });
    sync();
  }

  window.addEventListener("storage", function (e) { if (!e.key || e.key === STORE_KEY) sync(); });
  window.addEventListener("pf:messages-changed", sync);

  /* React owns the header — re-find the button after any re-render and keep
     the badge honest (same pattern as notifications.js' bell sync) */
  var observer = new MutationObserver(function () {
    if (btn && document.body.contains(btn)) { sync(); return; }
    var el = findButton();
    if (el) wire(el);
  });
  function boot() {
    var el = findButton();
    if (el) wire(el);
    observer.observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);

  window.PFMessagesChrome = { sync: sync, unread: unreadTotal, url: MESSAGES_URL, toggle: toggleChats,
    openThread: function (id) { ensureBundle(function () { if (!chrome) toggleChats(); if (chrome) { chrome.close(); chrome.openThread(id); } }); } };
})();
