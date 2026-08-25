/* ===========================================================================
   PROfinity — Web notifications (plain JS, no React)
   Loaded on every desktop (TopNav) page, before that page's own compiled
   script. Owns one source of truth (localStorage-backed) for the bell badge,
   the notification centre dropdown, and push toasts, so all three always
   agree. Exposes window.PFNotify for pages and the settings screen to use.
   =========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "pf-notifications";
  var SETTINGS_KEY = "pf-notif-settings";
  var MAX_VISIBLE_TOASTS = 3;
  var TOAST_LIFE_MS = 5000;
  var STAGGER_MS = 90;

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  /* -------------------------------------------------- category taxonomy -------------------------------------------------- */
  var CATEGORY_META = {
    chat:          { icon: "lucide:message-circle", group: "Confidence Chat" },
    verification:  { icon: "lucide:badge-check",    group: "Account and verification", persist: true },
    learning:      { icon: "lucide:book-open",       group: "My Learning" },
    billing:       { icon: "lucide:credit-card",     group: "Account and verification", persist: true }
  };
  var GROUP_ORDER = ["Confidence Chat", "My Learning", "Account and verification"];

  var DEFAULT_SETTINGS = {
    inApp: { activityFeed: true, popupToasts: true },
    push: { reminders: true, securityAlerts: true },
    sound: { notificationSound: true, tone: "default", vibration: true, dnd: false },
    social: { commentsOnPost: true, postLikes: true, commentLikes: false },
    newsfeed: { newsUpdates: true, communityPosts: true },
    learning: { courseReminder: true, newCourseAvailable: true }
  };

  function seedNotifications() {
    var now = Date.now();
    return [
      { id: "n1", category: "chat", title: "New message in Confidence Chat", body: "Dr. Bruno Giacomet replied to your question", time: now - 2 * 60 * 1000, read: false },
      { id: "n2", category: "chat", title: "New message in Confidence Chat", body: "Miranda Pearce mentioned you in Technique Tuesday", time: now - 25 * 60 * 1000, read: false },
      { id: "n3", category: "chat", title: "New message in Confidence Chat", body: "Ash sent you a direct message", time: now - 62 * 60 * 1000, read: false },
      { id: "n4", category: "learning", title: "New course in My Learning", body: "Advanced filler techniques is now live", time: now - 65 * 60 * 1000, read: false, action: { label: "View course", href: "CourseWeb.html" } },
      { id: "n5", category: "learning", title: "Course reminder", body: "Continue “8D Lips” — you’re 60% through", time: now - 3 * 60 * 60 * 1000, read: true },
      { id: "n6", category: "verification", title: "Verification complete", body: "Your clinician profile is now verified", time: now - 30 * 1000, read: false },
      { id: "n7", category: "verification", title: "Security alert", body: "New sign-in detected from a new device", time: now - 3 * 24 * 60 * 60 * 1000, read: true }
    ];
  }

  /* -------------------------------------------------- persistence -------------------------------------------------- */
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function deepMerge(base, extra) {
    var out = {};
    Object.keys(base).forEach(function (k) {
      if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) {
        out[k] = deepMerge(base[k], (extra && extra[k]) || {});
      } else {
        out[k] = (extra && extra[k] !== undefined) ? extra[k] : base[k];
      }
    });
    return out;
  }

  var state = {
    notifications: readJSON(STORAGE_KEY, null) || seedNotifications(),
    settings: deepMerge(DEFAULT_SETTINGS, readJSON(SETTINGS_KEY, {})),
    listeners: [],
    centreOpen: false,
    activeToasts: [],
    toastQueue: [],
    lastFocused: null
  };
  if (!readJSON(STORAGE_KEY, null)) writeJSON(STORAGE_KEY, state.notifications);

  function persistNotifications() { writeJSON(STORAGE_KEY, state.notifications); }
  function persistSettings() { writeJSON(SETTINGS_KEY, state.settings); }

  function getUnreadCount() { return state.notifications.filter(function (n) { return !n.read; }).length; }

  function emitChange() {
    var count = getUnreadCount();
    state.listeners.forEach(function (fn) { try { fn(count); } catch (e) {} });
    syncBell();
    if (state.centreOpen) renderCentreBody();
  }

  /* -------------------------------------------------- time formatting -------------------------------------------------- */
  function formatRelative(ts) {
    var diff = Math.max(0, Date.now() - ts);
    var m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return m + "m ago";
    var h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    var d = Math.floor(h / 24);
    return d + "d ago";
  }

  /* -------------------------------------------------- gating -------------------------------------------------- */
  function toastAllowed(category) {
    var s = state.settings;
    if (s.sound.dnd) return false;
    if (!s.inApp.popupToasts) return false;
    if (category === "verification" || category === "billing") return !!s.push.securityAlerts;
    if (category === "learning") return !!s.learning.newCourseAvailable;
    return true;
  }
  function soundAllowed() { return state.settings.sound.notificationSound && !state.settings.sound.dnd; }

  /* -------------------------------------------------- aria-live announcer -------------------------------------------------- */
  var liveRegion;
  function ensureLiveRegion() {
    if (liveRegion) return liveRegion;
    liveRegion = document.createElement("div");
    liveRegion.id = "pf-notif-live";
    liveRegion.className = "pf-notif-sr-only";
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("role", "status");
    document.body.appendChild(liveRegion);
    return liveRegion;
  }
  function announce(text) {
    var el = ensureLiveRegion();
    el.textContent = "";
    window.setTimeout(function () { el.textContent = text; }, 40);
  }

  /* -------------------------------------------------- toast stack -------------------------------------------------- */
  var toastStackEl;
  function ensureToastStack() {
    if (toastStackEl) return toastStackEl;
    toastStackEl = document.createElement("div");
    toastStackEl.id = "pf-toast-stack";
    document.body.appendChild(toastStackEl);
    return toastStackEl;
  }

  function iconFor(category) { return (CATEGORY_META[category] || CATEGORY_META.chat).icon; }
  function groupFor(category) { return (CATEGORY_META[category] || CATEGORY_META.chat).group; }
  function isPersistCategory(category) { return !!(CATEGORY_META[category] || {}).persist; }

  function buildToastNode(notif) {
    var node = document.createElement("div");
    node.className = "pf-toast pf-toast--" + notif.category;
    node.setAttribute("role", "status");
    node.dataset.id = notif.id;

    var icon = document.createElement("div");
    icon.className = "pf-toast-icon";
    icon.innerHTML = '<iconify-icon icon="' + iconFor(notif.category) + '" width="22" height="22" style="color:var(--pf-accent)"></iconify-icon>';
    node.appendChild(icon);

    var body = document.createElement("div");
    body.className = "pf-toast-body";
    var title = document.createElement("div");
    title.className = "pf-toast-title";
    title.textContent = notif.title;
    var text = document.createElement("div");
    text.className = "pf-toast-text";
    text.textContent = notif.body;
    var meta = document.createElement("div");
    meta.className = "pf-toast-meta";
    var time = document.createElement("span");
    time.className = "pf-toast-time";
    time.textContent = formatRelative(notif.time);
    meta.appendChild(time);
    if (notif.action) {
      var actionBtn = document.createElement("button");
      actionBtn.type = "button";
      actionBtn.className = "pf-toast-action";
      actionBtn.textContent = notif.action.label;
      actionBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        dismissToast(notif.id);
        if (notif.action.href) (window.pfGo || function (u) { window.location.href = u; })(notif.action.href);
      });
      meta.appendChild(actionBtn);
    }
    body.appendChild(title);
    body.appendChild(text);
    body.appendChild(meta);
    node.appendChild(body);

    var close = document.createElement("button");
    close.type = "button";
    close.className = "pf-toast-close";
    close.setAttribute("aria-label", "Dismiss notification");
    close.innerHTML = '<iconify-icon icon="lucide:x" width="16" height="16"></iconify-icon>';
    close.addEventListener("click", function (e) { e.stopPropagation(); dismissToast(notif.id); });
    node.appendChild(close);

    node.style.cursor = "pointer";
    node.addEventListener("click", function () {
      dismissToast(notif.id);
      var href = (notif.action && notif.action.href) || "NewsfeedWeb.html";
      (window.pfGo || function (u) { window.location.href = u; })(href);
    });
    node.addEventListener("mouseenter", function () { pauseTimer(notif.id); });
    node.addEventListener("mouseleave", function () { resumeTimer(notif.id); });

    return node;
  }

  function pauseTimer(id) {
    var entry = findActive(id);
    if (!entry || !entry.timeoutId) return;
    window.clearTimeout(entry.timeoutId);
    entry.timeoutId = null;
    entry.remaining -= (Date.now() - entry.startedAt);
  }
  function resumeTimer(id) {
    var entry = findActive(id);
    if (!entry || entry.persist || entry.timeoutId) return;
    entry.startedAt = Date.now();
    entry.timeoutId = window.setTimeout(function () { dismissToast(id); }, Math.max(400, entry.remaining));
  }
  function findActive(id) {
    for (var i = 0; i < state.activeToasts.length; i++) if (state.activeToasts[i].id === id) return state.activeToasts[i];
    return null;
  }

  function showToast(notif) {
    if (state.activeToasts.length >= MAX_VISIBLE_TOASTS) {
      state.toastQueue.push(notif);
      return;
    }
    var stack = ensureToastStack();
    var node = buildToastNode(notif);
    stack.appendChild(node);
    var persist = isPersistCategory(notif.category);
    var entry = { id: notif.id, node: node, persist: persist, remaining: TOAST_LIFE_MS, startedAt: Date.now(), timeoutId: null };
    state.activeToasts.push(entry);

    var delay = reduceMotion ? 0 : (state.activeToasts.length - 1) * STAGGER_MS;
    window.setTimeout(function () { node.classList.add("pf-toast-in"); }, delay);

    if (!persist) {
      entry.timeoutId = window.setTimeout(function () { dismissToast(notif.id); }, TOAST_LIFE_MS);
    }
    announce(notif.title + ". " + notif.body);

    if (soundAllowed()) { /* audible cue omitted in this prototype — sound preference is still honoured/gated */ }
  }

  function dismissToast(id) {
    var entry = findActive(id);
    if (!entry) return;
    if (entry.timeoutId) window.clearTimeout(entry.timeoutId);
    entry.node.classList.remove("pf-toast-in");
    entry.node.classList.add("pf-toast-out");
    window.setTimeout(function () {
      if (entry.node.parentNode) entry.node.parentNode.removeChild(entry.node);
      state.activeToasts = state.activeToasts.filter(function (e) { return e.id !== id; });
      processToastQueue();
    }, reduceMotion ? 0 : 300);
  }
  function processToastQueue() {
    if (state.activeToasts.length >= MAX_VISIBLE_TOASTS) return;
    var next = state.toastQueue.shift();
    if (next) showToast(next);
  }

  /* -------------------------------------------------- notification centre -------------------------------------------------- */
  var panelEl, scrimEl, headEl, bodyEl, markAllBtn;

  function ensurePanel() {
    if (panelEl) return;
    scrimEl = document.createElement("div");
    scrimEl.id = "pf-notif-scrim";
    scrimEl.style.display = "none";
    document.body.appendChild(scrimEl);

    panelEl = document.createElement("div");
    panelEl.id = "pf-notif-panel";
    panelEl.setAttribute("role", "dialog");
    panelEl.setAttribute("aria-modal", "true");
    panelEl.setAttribute("aria-label", "Notifications");
    panelEl.style.display = "none";
    panelEl.innerHTML =
      '<div class="pf-notif-head">' +
        '<h2>Notifications</h2>' +
        '<button type="button" class="pf-notif-markall" id="pf-notif-markall">Mark all read</button>' +
      '</div>' +
      '<div class="pf-notif-body" id="pf-notif-body"></div>' +
      '<div class="pf-notif-footer">' +
        '<button type="button" class="pf-notif-settings-link" id="pf-notif-settings-link">Notification settings</button>' +
      '</div>';
    document.body.appendChild(panelEl);

    bodyEl = panelEl.querySelector("#pf-notif-body");
    markAllBtn = panelEl.querySelector("#pf-notif-markall");
    markAllBtn.addEventListener("click", function () { markAllRead(); });
    panelEl.querySelector("#pf-notif-settings-link").addEventListener("click", function () {
      closeCentre();
      (window.pfGo || function (u) { window.location.href = u; })("NotificationSettingsWeb.html");
    });
    scrimEl.addEventListener("click", closeCentre);
    panelEl.addEventListener("keydown", onPanelKeydown);
  }

  function rowHTML(n) {
    var meta = CATEGORY_META[n.category] || CATEGORY_META.chat;
    var actionHTML = n.action
      ? '<button type="button" class="pf-notif-row-action" data-action-id="' + n.id + '">' + n.action.label + '</button>'
      : "";
    return (
      '<button type="button" class="pf-notif-row' + (n.read ? "" : " pf-unread") + '" data-row-id="' + n.id + '" style="--pf-icon-bg:' + iconBgFor(n.category) + '">' +
        '<span class="pf-notif-row-icon"><iconify-icon icon="' + meta.icon + '" width="18" height="18" style="color:' + accentFor(n.category) + '"></iconify-icon></span>' +
        '<span class="pf-notif-row-main">' +
          '<span class="pf-notif-row-title">' + escapeHTML(n.title) + '</span>' +
          '<span class="pf-notif-row-text">' + escapeHTML(n.body) + '</span>' +
          '<span class="pf-notif-row-footer"><span class="pf-notif-row-time">' + formatRelative(n.time) + '</span>' + actionHTML + '</span>' +
        '</span>' +
        (n.read ? "" : '<span class="pf-notif-dot" aria-hidden="true"></span>') +
      '</button>'
    );
  }
  function accentFor(category) { return { chat: "#6C63FF", verification: "#2A9568", learning: "#CE9957", billing: "#475467" }[category] || "#6C63FF"; }
  function iconBgFor(category) { return { chat: "#EEF0FF", verification: "#E9F7EF", learning: "#FBF2E7", billing: "#F2F4F7" }[category] || "#EEF0FF"; }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }

  function renderCentreBody() {
    if (!bodyEl) return;
    var byGroup = {};
    state.notifications.forEach(function (n) {
      var g = groupFor(n.category);
      (byGroup[g] = byGroup[g] || []).push(n);
    });
    var html = "";
    GROUP_ORDER.forEach(function (g) {
      var list = (byGroup[g] || []).slice().sort(function (a, b) { return b.time - a.time; });
      if (!list.length) return;
      var unread = list.filter(function (n) { return !n.read; }).length;
      html += '<div class="pf-notif-section-label">' + g + (unread ? '<span class="pf-notif-pill">' + unread + '</span>' : "") + '</div>';
      html += list.map(rowHTML).join("");
    });
    bodyEl.innerHTML = html || '<div class="pf-notif-empty">You’re all caught up.</div>';

    bodyEl.querySelectorAll("[data-row-id]").forEach(function (rowEl) {
      rowEl.addEventListener("click", function (e) {
        if (e.target.closest("[data-action-id]")) return;
        markRead(rowEl.getAttribute("data-row-id"));
      });
    });
    bodyEl.querySelectorAll("[data-action-id]").forEach(function (actionEl) {
      actionEl.addEventListener("click", function (e) {
        e.stopPropagation();
        var id = actionEl.getAttribute("data-action-id");
        var n = state.notifications.filter(function (x) { return x.id === id; })[0];
        markRead(id);
        if (n && n.action && n.action.href) (window.pfGo || function (u) { window.location.href = u; })(n.action.href);
      });
    });

    markAllBtn.disabled = getUnreadCount() === 0;
  }

  function markRead(id) {
    var n = state.notifications.filter(function (x) { return x.id === id; })[0];
    if (!n || n.read) return;
    n.read = true;
    persistNotifications();
    emitChange();
  }
  function markAllRead() {
    var changed = false;
    state.notifications.forEach(function (n) { if (!n.read) { n.read = true; changed = true; } });
    if (!changed) return;
    persistNotifications();
    emitChange();
  }

  function positionPanel() {
    var bell = document.getElementById("pf-notif-bell");
    if (!bell) return;
    var rect = bell.getBoundingClientRect();
    panelEl.style.top = Math.round(rect.bottom + 8) + "px";
    var right = Math.max(12, window.innerWidth - rect.right);
    panelEl.style.right = right + "px";
    panelEl.style.left = "auto";
  }

  function focusableIn(container) {
    return Array.prototype.slice.call(container.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return el.offsetParent !== null; });
  }

  function onPanelKeydown(e) {
    if (e.key === "Escape") { e.stopPropagation(); closeCentre(); return; }
    if (e.key !== "Tab") return;
    var items = focusableIn(panelEl);
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openCentre() {
    ensurePanel();
    renderCentreBody();
    scrimEl.style.display = "block";
    panelEl.style.display = "flex";
    positionPanel();
    state.centreOpen = true;
    state.lastFocused = document.activeElement;
    window.requestAnimationFrame(function () { panelEl.classList.add("pf-notif-open"); });
    var bell = document.getElementById("pf-notif-bell");
    if (bell) bell.setAttribute("aria-expanded", "true");
    document.addEventListener("keydown", onDocKeydown);
    document.addEventListener("click", onDocClick, true);
    window.addEventListener("resize", positionPanel);
    window.setTimeout(function () { markAllBtn.focus(); }, reduceMotion ? 0 : 190);
  }
  function closeCentre() {
    if (!state.centreOpen) return;
    state.centreOpen = false;
    panelEl.classList.remove("pf-notif-open");
    var bell = document.getElementById("pf-notif-bell");
    if (bell) bell.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onDocKeydown);
    document.removeEventListener("click", onDocClick, true);
    window.removeEventListener("resize", positionPanel);
    window.setTimeout(function () {
      panelEl.style.display = "none";
      scrimEl.style.display = "none";
    }, reduceMotion ? 0 : 180);
    if (state.lastFocused && state.lastFocused.focus) { try { state.lastFocused.focus(); } catch (e) {} }
    else { var bell2 = document.getElementById("pf-notif-bell"); if (bell2) bell2.focus(); }
  }
  function toggleCentre() { if (state.centreOpen) closeCentre(); else openCentre(); }
  function onDocKeydown(e) { if (e.key === "Escape") closeCentre(); }
  function onDocClick(e) {
    if (e.target.closest && (e.target.closest("#pf-notif-panel") || e.target.closest("#pf-notif-bell"))) return;
    closeCentre();
  }

  /* -------------------------------------------------- bell click + badge sync -------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var bell = e.target.closest && e.target.closest("#pf-notif-bell");
    if (!bell) return;
    e.stopPropagation();
    toggleCentre();
  }, true);

  function syncBell() {
    var bell = document.getElementById("pf-notif-bell");
    if (!bell) return;
    var count = getUnreadCount();
    var badge = bell.querySelector("span");
    if (!badge) return;
    var text = count > 99 ? "99+" : String(count);
    if (badge.textContent !== text) badge.textContent = text;
    badge.style.display = count > 0 ? "" : "none";
  }

  var bellObserver = new MutationObserver(function () { syncBell(); });
  function startBellSync() {
    bellObserver.observe(document.body, { childList: true, subtree: true });
    syncBell();
  }
  if (document.body) startBellSync();
  else document.addEventListener("DOMContentLoaded", startBellSync);

  /* -------------------------------------------------- centred save confirmation -------------------------------------------------- */
  var confirmEl;
  function showConfirm(text) {
    if (!confirmEl) {
      confirmEl = document.createElement("div");
      confirmEl.id = "pf-confirm-toast";
      confirmEl.innerHTML = '<iconify-icon icon="lucide:check-circle-2" width="18" height="18" style="color:var(--success,#2A9568)"></iconify-icon><span id="pf-confirm-text"></span>';
      document.body.appendChild(confirmEl);
    }
    confirmEl.querySelector("#pf-confirm-text").textContent = text;
    confirmEl.classList.add("pf-show");
    window.clearTimeout(confirmEl._hideTimer);
    confirmEl._hideTimer = window.setTimeout(function () { confirmEl.classList.remove("pf-show"); }, 2600);
  }

  /* -------------------------------------------------- demo sequence (every page load) -------------------------------------------------- */
  function runDemo() {
    var demoIds = ["n1", "n6", "n4"];
    demoIds.forEach(function (id, i) {
      window.setTimeout(function () {
        var n = state.notifications.filter(function (x) { return x.id === id; })[0];
        if (n) showToast(n);
      }, 900 + i * 500);
    });
  }
  var isNewsfeedPage = /NewsfeedWeb\.html/i.test(window.location.pathname);
  if (isNewsfeedPage) window.setTimeout(runDemo, 0);

  /* -------------------------------------------------- public API -------------------------------------------------- */
  window.PFNotify = {
    push: function (data) {
      var n = {
        id: data.id || ("n-" + Date.now() + "-" + Math.floor(Math.random() * 1000)),
        category: data.category || "chat",
        title: data.title || "",
        body: data.body || "",
        time: data.time || Date.now(),
        read: false,
        action: data.action || null
      };
      state.notifications.unshift(n);
      persistNotifications();
      emitChange();
      if (data.force || toastAllowed(n.category)) showToast(n);
      return n.id;
    },
    previewPush: function () {
      showToast({ id: "preview-" + Date.now(), category: "learning", title: "New course in My Learning", body: "Advanced filler techniques is now live", time: Date.now(), action: { label: "View course", href: "CourseWeb.html" } });
    },
    getUnreadCount: getUnreadCount,
    subscribe: function (fn) {
      state.listeners.push(fn);
      fn(getUnreadCount());
      return function () { state.listeners = state.listeners.filter(function (f) { return f !== fn; }); };
    },
    markAllRead: markAllRead,
    markRead: markRead,
    openCentre: openCentre,
    closeCentre: closeCentre,
    toggleCentre: toggleCentre,
    getSettings: function () { return JSON.parse(JSON.stringify(state.settings)); },
    setSettings: function (next) {
      state.settings = deepMerge(DEFAULT_SETTINGS, next || {});
      persistSettings();
    },
    showConfirm: showConfirm
  };
})();
