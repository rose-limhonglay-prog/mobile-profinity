/* ===========================================================================
   PROfinity — responsive web TopNav
   The DS TopNav is a bound component with inline styles and no class hooks,
   so (like account-menu.js / web-rewards-chrome.js) this waits for React to
   paint the <header>, then:
     • tags its parts  (.pf-hdr, -logo, -search, -nav, -cluster, -user)
     • adds a search icon button to the right-hand cluster (shown ≤1023px,
       toggles the search row under the bar)
     • adds the member avatar to the name/role block (shown ≤1279px, where
       the name text is hidden — account-menu.js keeps the block clickable)
   web-header-responsive.css does the actual collapsing. A MutationObserver
   re-tags after any React re-render / remount.
   =========================================================================== */
(function () {
  "use strict";

  var AVATAR = "assets/avatar-katy.jpg";
  var SHORT = { "My Learning": "Learning" };


  /* ======================================================================
     Hamburger drawer — plain-DOM twin of the mobile SideMenuC
     (mobilechrome.jsx). Same sections, same tier ladder, links re-pointed at
     the web twins of each mobile page. Built lazily on first open.
     ====================================================================== */
  var WEB_TWIN = {
    "ProfileMobile.html": "Profile.html", "LearningMobile.html": "MyLearning.html",
    "EventsMobile.html": "EventsWeb.html", "CommunityMobile.html": "Community.html",
    "DirectMessage.html": "MessagesWeb.html", "PaymentsMobile.html": "PaymentsWeb.html",
    "MySaved.html": "SavedWeb.html", "NotificationSettings.html": "NotificationSettingsWeb.html",
    "ChatSupport.html": "ChatSupportWeb.html", "AccountSettings.html": "AccountSettingsWeb.html",
    "AuthMobile.html?view=signin": "AuthWeb.html?view=loggedout"
  };
  function web(href) { return WEB_TWIN[href] || href; }
  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ic(name, size, color) { return '<iconify-icon icon="' + name + '" width="' + size + '" height="' + size + '" style="color:' + color + '"></iconify-icon>'; }

  var TIER_LADDER = ["confidence", "mastery", "freedom", "sovereign"];
  var TIER_NAME = { confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", sovereign: "Sovereign" };
  var MEMBERSHIP_TIERS = ["confidence", "mastery", "freedom"];
  var MEMBERSHIP_ROWS = [
    { label: "Membership Training", icon: "lucide:graduation-cap", href: "LearningMobile.html" },
    { label: "Technique Tuesday",   icon: "lucide:calendar-check", href: "EventsMobile.html" },
    { label: "Complications Help",  icon: "lucide:shield-alert",   href: "DirectMessage.html" },
    { label: "AI Coach",            icon: "lucide:sparkles",       href: "LearningMobile.html" }];
  var FREEDOM_LECTURE_ROW = { label: "Freedom Path Lectures", icon: "lucide:presentation", href: "LearningMobile.html" };
  var UPGRADE_LABEL = { free: "Confidence", confidence: "Mastery", mastery: "Freedom Path", freedom: "Sovereign" };
  var UPGRADE_METAL = { free: "bronze", confidence: "silver", mastery: "gold", freedom: "gold" };
  var TIER_METAL = { confidence: "bronze", mastery: "silver", freedom: "gold" };
  var METAL_ICON_COLOR = { bronze: "#fff", silver: "#3F4650", gold: "#5A3A00" };
  var TIER_COLOR = { confidence: "var(--info)", mastery: "var(--level-intermediate)", freedom: "var(--ai-purple)", sovereign: "var(--premium-gold-deep)" };
  var CHAT_LABEL = { confidence: "Community Chat", mastery: "Mastery Chat", freedom: "Freedom Path Chat" };
  var CHAT_BADGE = { confidence: "10+", mastery: 6, freedom: "10+" };
  var TIER_RESOURCES = {
    confidence: MEMBERSHIP_ROWS,
    mastery: [
      { label: "Mastery lounge",         icon: "lucide:message-circle", n: 6,  href: "CommunityMobile.html" },
      { label: "Advanced masterclasses", icon: "lucide:graduation-cap", n: 9,  href: "LearningMobile.html" },
      { label: "Complication library",   icon: "lucide:file-text",      n: 18, href: "LearningMobile.html" },
      { label: "Live case reviews",      icon: "lucide:calendar",       n: 3,  href: "EventsMobile.html" }],
    freedom: [
      { label: "Freedom circle",      icon: "lucide:message-circle", n: 2, href: "CommunityMobile.html" },
      { label: "Business playbooks",  icon: "lucide:graduation-cap", n: 7, href: "LearningMobile.html" },
      { label: "1:1 mentor sessions", icon: "lucide:calendar",       n: 1, href: "EventsMobile.html" }],
    sovereign: [
      { label: "Sovereign roundtable", icon: "lucide:message-circle", n: 4, href: "CommunityMobile.html" },
      { label: "Executive mentorship", icon: "lucide:calendar",       n: 1, href: "EventsMobile.html" },
      { label: "Legacy case archive",  icon: "lucide:file-text",      n: 9, href: "LearningMobile.html" },
      { label: "Founder office hours", icon: "lucide:calendar",       n: 2, href: "EventsMobile.html" }]
  };
  var EVENTS = [
    { d: "30", m: "JUN", label: "Technique Tuesday Webinar", t: "8:00 PM", access: "open",
      hosts: [{ name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png" }, { name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg" }] },
    { d: "5", m: "JUL", label: "Confidence Masterclass", t: "6:00 PM", access: "members" }];
  var PROFILE_ROWS = [
    { label: "Edit Profile",       icon: "lucide:book-open",   href: "ProfileMobile.html" },
    { label: "Account Settings",   icon: "lucide:settings",    href: "AccountSettings.html" },
    { label: "Payments",           icon: "lucide:credit-card", href: "PaymentsMobile.html" },
    { label: "My Saved",           icon: "lucide:bookmark",    href: "MySaved.html" },
    { label: "Notifications",      icon: "lucide:calendar",    href: "NotificationSettings.html" },
    { label: "Privacy & Security", icon: "lucide:book-open",   href: null },
    { label: "Chat Support",       icon: "lucide:headset",     href: "ChatSupport.html" },
    { label: "Display Settings",   icon: "lucide:cpu",         href: "DisplaySettings.html" }];

  function userTier() {
    var t = "free";
    if (window.PF_TIER) t = window.PF_TIER;
    else {
      try {
        if (window.PFApp && window.PFApp.getUserTier) t = window.PFApp.getUserTier() || "free";
        else t = localStorage.getItem("pf-subscription-tier") || "free";
      } catch (e) { t = "free"; }
    }
    return t === "inner" ? "sovereign" : t;
  }
  function unlockedTiers(tier) { var i = TIER_LADDER.indexOf(tier); return i === -1 ? [] : TIER_LADDER.slice(0, i + 1).reverse(); }
  function nextTier(tier) { var i = TIER_LADDER.indexOf(tier); return i === TIER_LADDER.length - 1 ? null : TIER_LADDER[i + 1]; }
  function isDark() { try { return localStorage.getItem("pf-theme") === "dark"; } catch (e) { return false; } }
  function setDark(next) {
    try { localStorage.setItem("pf-theme", next ? "dark" : "light"); } catch (e) {}
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }
  function me() { return (window.PFApp && window.PFApp.ME) || { name: "Katy Wilson", avatar: AVATAR }; }

  function resourceRow(r) {
    return '<button type="button" class="smt-resource" data-href="' + esc(web(r.href)) + '">' +
      ic(r.icon, 20, "var(--gray-900)") + '<span class="smt-resource-label">' + esc(r.label) + '</span>' +
      (r.n != null ? '<span class="smt-badge">' + esc(r.n) + '</span>' : '') +
      ic("lucide:chevron-right", 20, "var(--gray-450)") + '</button>';
  }
  function tierCard(key, own) {
    var color = TIER_COLOR[key];
    return '<div class="smt-card"><div class="smt-head"><span class="smt-top"><span class="smt-name">' + TIER_NAME[key] + ' Path</span></span>' +
      (own ? '<span class="smt-pill smt-pill-yours" style="color:' + color + ';border-color:' + color + '">YOUR TIER</span>' : '<span class="smt-pill">INCLUDED</span>') +
      '</div><div class="smt-resources">' + TIER_RESOURCES[key].map(resourceRow).join("") + '</div></div>';
  }
  function membershipCard(tier) {
    var chat = { label: CHAT_LABEL[tier], icon: "lucide:message-circle", href: "CommunityMobile.html", n: CHAT_BADGE[tier] };
    var rows = tier === "freedom" ? [FREEDOM_LECTURE_ROW, chat].concat(MEMBERSHIP_ROWS) : [chat].concat(MEMBERSHIP_ROWS);
    return '<div class="smt-card sm-membership-card"><div class="smt-head sm-membership-head"><span class="sm-membership-title">MY MEMBERSHIP</span>' +
      '<span class="sm-memb-ribbon sm-memb-ribbon-' + TIER_METAL[tier] + '"><span class="sm-memb-ribbon-text">' + TIER_NAME[tier] + ' Path</span></span></div>' +
      '<div class="smt-resources">' + rows.map(resourceRow).join("") + '</div></div>';
  }
  function displayCard() {
    var on = isDark();
    return '<div class="sm-display-card"><div class="sm-display-top"><span class="sm-display-label">Display</span>' +
      '<button type="button" class="sm-switch' + (on ? ' on' : '') + '" role="switch" aria-checked="' + on + '" aria-label="' + (on ? 'Switch to light mode' : 'Switch to dark mode') + '">' +
      '<span class="sm-knob">' + ic(on ? "lucide:moon" : "lucide:sun", 13, on ? "#1A1736" : "var(--gray-450)") + '</span></button></div>' +
      '<p class="sm-display-desc">Adjust the appearance of the app to reduce glare and give your eyes a break</p></div>';
  }
  function drawerHtml() {
    var tier = userTier(), nxt = nextTier(tier), unlocked = unlockedTiers(tier);
    var showMembership = MEMBERSHIP_TIERS.indexOf(tier) !== -1;
    var showTierCards = !showMembership && unlocked.length > 0;
    var m = me(), h = '';
    h += '<div class="m-drawer-scrim"></div>';
    h += '<aside class="m-drawer" role="dialog" aria-modal="true" aria-label="Menu">';
    h += '<button type="button" class="m-drawer-profile" data-href="Profile.html"><img class="pf-wd-av" src="' + esc(m.avatar || AVATAR) + '" alt="">' +
      '<span class="m-dp-main"><span class="m-dp-name">' + esc(m.name || "Katy Wilson") + ic("lucide:badge-check", 18, "var(--reaction-like)") + '</span>' +
      '<span class="m-dp-role">Registered Nurse</span></span>' + ic("lucide:chevron-right", 22, "var(--gray-800)") + '</button>';
    h += '<div class="sm-body">';
    if (nxt) {
      var metal = UPGRADE_METAL[tier] || "bronze", col = METAL_ICON_COLOR[metal];
      h += '<button type="button" class="sm-upgrade metal-' + metal + '" data-href="MembershipTier.html"><span class="sm-upgrade-icon">' + ic("lucide:gem", 20, col) + '</span>' +
        '<span class="sm-upgrade-main"><span class="sm-upgrade-title">Upgrade to ' + UPGRADE_LABEL[tier] + '</span><span class="sm-upgrade-sub">Unlock more premium channels &amp; courses</span></span>' +
        ic("lucide:chevron-right", 20, col) + '</button>';
    }
    if (showMembership) h += membershipCard(tier);
    if (showTierCards) h += '<div class="sm-sec-h">My Membership</div><div class="smt-list">' + unlocked.map(function (k) { return tierCard(k, k === tier); }).join("") + '</div>';
    h += '<button type="button" class="sm-primary-card" data-href="MyLearning.html"><span class="sm-primary-icon">' + ic("lucide:graduation-cap", 22, "var(--brand-navy)") + '</span>' +
      '<span class="sm-primary-main"><span class="sm-primary-title">My Learning</span><span class="sm-primary-sub">Courses, protocols &amp; certificates</span></span>' + ic("lucide:chevron-right", 20, "var(--gray-450)") + '</button>';
    h += '<div class="sm-sec-h">Upcoming Events</div><div class="sm-events">' + EVENTS.map(function (e) {
      return '<button type="button" class="sm-event" data-href="EventsWeb.html"><span class="sm-date"><b>' + e.d + '</b><i>' + e.m + '</i></span>' +
        '<span class="sm-event-main"><span class="sm-event-name">' + esc(e.label) + '</span><span class="sm-event-time">' + e.t + '</span>' +
        (e.hosts ? '<span class="sm-event-hosts"><span class="mp-group-av" style="width:26px;height:26px">' + e.hosts.map(function (x) { return '<span class="mp-group-av-item" style="width:18px;height:18px"><img src="' + x.avatar + '" alt=""></span>'; }).join("") + '</span>' +
          '<span class="sm-event-hosts-label">Dr Tim Pearce &amp; Miranda Pearce</span></span>' : '') + '</span>' +
        '<span class="sm-event-access ' + (e.access === "members" ? 'sm-event-access-members' : 'sm-event-access-open') + '">' + (e.access === "members" ? 'Members only' : 'Open to all') + '</span></button>';
    }).join("") + '</div>';
    h += '<div class="sm-sec-h">My Profile</div>';
    h += '<button type="button" class="sm-row sm-verify" data-href="Profile.html">' + ic("lucide:book-open", 23, "var(--premium-orange)") + '<span class="sm-row-label">Verify Profile</span><span class="sm-verify-pill">Not Verified</span></button>';
    h += '<nav class="sm-list">' + PROFILE_ROWS.map(function (c) {
      if (c.label === "Display Settings") return displayCard();
      return '<button type="button" class="sm-row"' + (c.href ? ' data-href="' + esc(web(c.href)) + '"' : '') + '>' + ic(c.icon, 23, "var(--gray-900)") +
        '<span class="sm-row-label">' + esc(c.label) + '</span>' + ic("lucide:chevron-right", 20, "var(--gray-450)") + '</button>';
    }).join("") + '</nav>';
    h += '<button type="button" class="m-drawer-logout" data-href="' + web("AuthMobile.html?view=signin") + '">' + ic("lucide:log-out", 22, "var(--error)") + 'Logout</button>';
    h += '</div></aside>';
    return h;
  }

  var drawerRoot = null, drawerWrap = null, drawerOpen = false, lastBurger = null;
  function ensureDrawer() {
    if (drawerRoot) return;
    drawerRoot = document.createElement("div");
    drawerRoot.className = "pf-wd";
    drawerWrap = document.createElement("div");
    drawerWrap.className = "m-drawer-wrap";
    drawerWrap.setAttribute("aria-hidden", "true");
    drawerWrap.innerHTML = drawerHtml();
    drawerRoot.appendChild(drawerWrap);
    document.body.appendChild(drawerRoot);
    drawerWrap.querySelector(".m-drawer-scrim").addEventListener("click", closeDrawer);
    drawerWrap.addEventListener("click", function (e) {
      var sw = e.target.closest(".sm-switch");
      if (sw) {
        var next = !isDark();
        setDark(next);
        sw.classList.toggle("on", next);
        sw.setAttribute("aria-checked", String(next));
        sw.setAttribute("aria-label", next ? "Switch to light mode" : "Switch to dark mode");
        sw.querySelector(".sm-knob").innerHTML = ic(next ? "lucide:moon" : "lucide:sun", 13, next ? "#1A1736" : "var(--gray-450)");
        return;
      }
      var b = e.target.closest("[data-href]");
      if (b && b.getAttribute("data-href")) { closeDrawer(); go(b.getAttribute("data-href")); }
    });
  }
  function openDrawer(burger) {
    ensureDrawer();
    lastBurger = burger || null;
    /* re-render so tier / theme / avatar are current */
    drawerWrap.innerHTML = drawerHtml();
    drawerWrap.querySelector(".m-drawer-scrim").addEventListener("click", closeDrawer);
    drawerOpen = true;
    drawerWrap.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("pf-wd-lock");
    requestAnimationFrame(function () { drawerWrap.classList.add("open"); });
    if (burger) burger.setAttribute("aria-expanded", "true");
    var first = drawerWrap.querySelector(".m-drawer-profile");
    if (first) setTimeout(function () { first.focus(); }, 320);
  }
  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;
    drawerWrap.classList.remove("open");
    drawerWrap.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("pf-wd-lock");
    if (lastBurger) { lastBurger.setAttribute("aria-expanded", "false"); lastBurger.focus(); }
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawerOpen) closeDrawer(); });
  /* leaving mobile width closes it */
  if (window.matchMedia) {
    var mq = window.matchMedia("(max-width: 760px)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function (ev) { if (!ev.matches) closeDrawer(); });
  }

  function addBurger(header) {
    if (header.querySelector(".pf-hdr-burger")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pf-hdr-burger";
    btn.setAttribute("aria-label", "Menu");
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<iconify-icon icon="lucide:menu" width="24" height="24"></iconify-icon>';
    btn.addEventListener("click", function () { drawerOpen ? closeDrawer() : openDrawer(btn); });
    header.insertBefore(btn, header.firstChild);
  }


  /* ======================================================================
     "Get the app" banner — iOS Smart-App-Banner style strip ABOVE the header,
     phone widths only (CSS hides it ≥761px). In normal flow so it scrolls
     away like Safari's; the sticky header takes over at top:0. Dismiss is
     remembered in localStorage; ?appbanner=1 forces it back for testing.
     Store link: window.PF_APP_STORE_URL (set before this script) or the
     APP_STORE_URL constant below — replace with the real listing.
     ====================================================================== */
  var APP_STORE_URL = "https://apps.apple.com/app/profinity-academy/id0000000000";
  var PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.profinity.academy";
  var BANNER_KEY = "pf-app-banner-dismissed";
  function storeUrl() {
    if (window.PF_APP_STORE_URL) return window.PF_APP_STORE_URL;
    var ua = navigator.userAgent || "";
    return /android/i.test(ua) && !window.PF_APP_STORE_IOS_ONLY ? PLAY_STORE_URL : APP_STORE_URL;
  }
  function addAppBanner() {
    if (document.querySelector(".pf-appbn")) return;
    var force = false;
    try { force = new URLSearchParams(location.search).get("appbanner") === "1"; } catch (e) {}
    if (!force) { try { if (localStorage.getItem(BANNER_KEY)) return; } catch (e) {} }
    var isAndroid = /android/i.test(navigator.userAgent || "");
    var storeName = window.PF_APP_STORE_URL ? "App Store" : (isAndroid ? "Google Play" : "App Store");
    var el = document.createElement("div");
    el.className = "pf-appbn";
    el.setAttribute("role", "complementary");
    el.setAttribute("aria-label", "Get the PROfinity app");
    el.innerHTML =
      '<button type="button" class="pf-appbn-x" aria-label="Dismiss"><iconify-icon icon="lucide:x" width="16" height="16"></iconify-icon></button>' +
      '<img class="pf-appbn-ic" src="assets/app-icon-512.png" alt="">' +
      '<span class="pf-appbn-tx"><span class="pf-appbn-t">PROfinity Academy</span>' +
      '<span class="pf-appbn-s">Free on the ' + storeName + '</span>' +
      '<span class="pf-appbn-stars" aria-label="Rated 4.9 out of 5">★★★★★</span></span>' +
      '<a class="pf-appbn-cta" href="' + storeUrl().replace(/"/g, "&quot;") + '" target="_blank" rel="noopener">Download</a>';
    el.querySelector(".pf-appbn-x").addEventListener("click", function () {
      try { localStorage.setItem(BANNER_KEY, String(Date.now())); } catch (e) {}
      el.classList.add("is-out");
      setTimeout(function () { el.remove(); }, 220);
    });
    document.body.insertBefore(el, document.body.firstChild);
  }

  function findHeader() {
    var header = document.querySelector("header");
    if (!header || !header.querySelector("nav")) return null;
    return header;
  }

  function tag(header) {
    if (!header.classList.contains("pf-hdr")) header.classList.add("pf-hdr");
    addBurger(header);
    var kids = Array.prototype.slice.call(header.children);
    var nav = header.querySelector(":scope > nav");
    var logo = header.querySelector(":scope > img");
    var divs = kids.filter(function (k) { return k.tagName === "DIV"; });
    var search = divs.filter(function (d) { return d.querySelector("input"); })[0];
    var cluster = divs[divs.length - 1];
    if (logo) logo.classList.add("pf-hdr-logo");
    if (nav) {
      nav.classList.add("pf-hdr-nav");
      /* short tab captions for the bottom bar (CSS swaps them in ≤760px) */
      Array.prototype.forEach.call(nav.children, function (b) {
        var lbl = b.lastElementChild;
        if (!lbl || lbl.hasAttribute("data-short")) return;
        var t = (lbl.textContent || "").trim();
        if (t) lbl.setAttribute("data-short", SHORT[t] || t);
      });
    }
    if (search && search !== cluster) search.classList.add("pf-hdr-search");
    if (!cluster) return;
    cluster.classList.add("pf-hdr-cluster");
    var inner = cluster.querySelectorAll(":scope > div");
    var user = inner.length ? inner[inner.length - 1] : null;
    if (user) {
      user.classList.add("pf-hdr-user");
      if (!user.querySelector(".pf-hdr-avatar")) {
        var img = document.createElement("img");
        img.className = "pf-hdr-avatar";
        img.src = AVATAR;
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        user.insertBefore(img, user.firstChild);
      }
    }
    if (search && !cluster.querySelector(".pf-hdr-search-btn")) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pf-hdr-search-btn";
      btn.setAttribute("aria-label", "Search");
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = '<iconify-icon icon="lucide:search" width="24" height="24"></iconify-icon>';
      btn.addEventListener("click", function () {
        var open = header.classList.toggle("pf-hdr-search-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          var input = search.querySelector("input");
          if (input) setTimeout(function () { input.focus(); }, 30);
        }
      });
      cluster.insertBefore(btn, cluster.firstChild);
    }
  }

  /* close the search row on outside tap / Escape */
  document.addEventListener("click", function (e) {
    var header = document.querySelector("header.pf-hdr.pf-hdr-search-open");
    if (!header) return;
    if (header.contains(e.target)) return;
    header.classList.remove("pf-hdr-search-open");
    var b = header.querySelector(".pf-hdr-search-btn"); if (b) b.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var header = document.querySelector("header.pf-hdr.pf-hdr-search-open");
    if (!header) return;
    header.classList.remove("pf-hdr-search-open");
    var b = header.querySelector(".pf-hdr-search-btn"); if (b) { b.setAttribute("aria-expanded", "false"); b.focus(); }
  });

  var scheduled = false;
  function run() {
    scheduled = false;
    var h = findHeader();
    if (h) tag(h);
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    (window.requestAnimationFrame || setTimeout)(run);
  }

  function start() {
    addAppBanner();
    var root = document.getElementById("pf-root") || document.body;
    new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
    schedule();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
