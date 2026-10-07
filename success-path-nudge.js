/* ===========================================================================
   PROfinity — Success Path nudges (plain JS)
   1. Post-login banner on NewsfeedMobile / NewsfeedWeb: one benefit-framed
      card per session, copy from PFSuccessPath.nudge() (goal → ready → near →
      progress → ascension). Waits for the launch splash / daily check-in /
      reward overlays to clear so it never competes with activation moments.
      Dismiss = snoozed for 24h. ?nudge=1 forces it for review.
   2. Push mock on LockScreen.html?push=sp: the first notification card takes
      the same copy and opens the Success Path hub.
   =========================================================================== */
(function () {
  "use strict";
  var SHOWN = "pf-sp-nudge-shown", SNOOZE = "pf-sp-nudge-snooze";
  var P = function () { return window.PFSuccessPath; };
  var isWeb = function () { return /Web\.html/i.test(location.pathname) || !document.querySelector("[data-ios-device], .m-screen"); };
  var q = new URLSearchParams(location.search);
  function hubUrl(u) { return isWeb() ? String(u).replace("SuccessPath.html", "SuccessPathWeb.html") : u; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function busy() {
    try { if (window.PFRewards && window.PFRewards.takeoverUp && window.PFRewards.takeoverUp()) return true; } catch (e) {}
    var h = document.documentElement;
    return h.classList.contains("pf-launch-active") || !!document.querySelector(".pf-launch, .pf-dci-screen.is-open, .pf-rsp, .pf-wn-open, .tour-overlay");
  }
  function ensureCss() {
    if (document.querySelector('link[href*="success-path.css"]')) return;
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "success-path.css?v=20261008a"; document.head.appendChild(l);
  }
  function show() {
    var n = P() && P().nudge(); if (!n) return;
    ensureCss();
    var host = document.querySelector("[data-ios-device] .m-screen") || document.querySelector(".m-screen") || document.body;
    if (isWeb()) {
      /* desktop: join the notification toast stack (notifications.js) so the
         nudge sits in line with the other toasts instead of under them */
      host = document.getElementById("pf-toast-stack");
      if (!host) { host = document.createElement("div"); host.id = "pf-toast-stack"; document.body.appendChild(host); }
    }
    var el = document.createElement("div");
    el.className = "sp-nudge"; el.setAttribute("role", "status"); el.setAttribute("data-screen-label", "Success Path nudge");
    el.classList.add("sp-nudge--" + (n.kind || "coach"));
    var ICONS = {
      goal: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      ready: '<path d="M20 6 9 17l-5-5"/>',
      near: '<path d="M20 6 9 17l-5-5"/>',
      progress: '<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>',
      ascension: '<path d="m18 15-6-6-6 6"/>',
      coach: '<path d="M12 3l1.8 4.9L19 9.7l-4.9 1.8L12 16.5l-1.8-5L5 9.7l5.2-1.8z"/>'
    };
    var icon = ICONS[n.kind] || ICONS.coach;
    el.innerHTML = '<span class="sp-nudge-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icon + "</svg></span>" +
      '<div class="sp-nudge-tx"><p class="sp-nudge-t">' + esc(n.title) + '</p><p class="sp-nudge-b">' + esc(n.body) + '</p>' +
      '<div class="sp-nudge-meta"><span class="sp-nudge-time">Just now</span><button type="button" class="sp-nudge-cta">' + esc(n.cta) + "</button></div></div>" +
      '<button type="button" class="sp-nudge-x" aria-label="Dismiss notification"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>';
    if (host !== document.body && getComputedStyle(host).position === "static") host.style.position = "relative";
    host.appendChild(el);
    /* low priority: if a takeover (check-in, What's new, reward splash) opens
       later, step aside and come back once it lifts */
    var guard = setInterval(function () {
      if (!el.parentNode) { clearInterval(guard); return; }
      el.style.visibility = busy() ? "hidden" : "visible";
    }, 400);
    try { sessionStorage.setItem(SHOWN, "1"); } catch (e) {}
    var go = function () { (window.pfGo || function (u) { location.href = u; })(hubUrl(n.url)); };
    el.querySelector(".sp-nudge-cta").addEventListener("click", function (e) { e.stopPropagation(); go(); });
    el.addEventListener("click", function (e) { if (!e.target.closest(".sp-nudge-x")) go(); });
    el.querySelector(".sp-nudge-x").addEventListener("click", function (e) {
      e.stopPropagation();
      try { localStorage.setItem(SNOOZE, String(Date.now())); } catch (e) {}
      el.style.transition = "opacity .2s"; el.style.opacity = "0"; setTimeout(function () { el.remove(); }, 220);
    });
  }
  function banner() {
    if (!/Newsfeed/i.test(location.pathname) && q.get("nudge") !== "1") return;
    var force = q.get("nudge") === "1";
    try {
      if (!force && sessionStorage.getItem(SHOWN)) return;
      var sn = +localStorage.getItem(SNOOZE) || 0;
      if (!force && Date.now() - sn < 864e5) return;
    } catch (e) {}
    /* activation first: wait until the launch splash, check-in, What's new and
       reward splashes have all had their turn — 3.5s of quiet, 4s minimum */
    var t0 = Date.now(), quietSince = 0;
    (function wait() {
      if (!P()) { if (Date.now() - t0 < 8000) return setTimeout(wait, 300); return; }
      var now = Date.now();
      if (busy()) quietSince = 0; else if (!quietSince) quietSince = now;
      var ready = quietSince && now - quietSince >= 3500 && now - t0 >= 4000;
      if (!ready && now - t0 < 60000) return setTimeout(wait, 300);
      show();
    })();
  }
  function lockPush() {
    if (!/LockScreen/i.test(location.pathname) || q.get("push") !== "sp") return;
    var n = P() && P().nudge(); if (!n) return;
    var card = document.querySelector("[data-notif]"); if (!card) return;
    var t = card.querySelector(".notif-title"), b = card.querySelector(".notif-body");
    if (t) t.textContent = n.title; if (b) b.textContent = n.body;
    card.addEventListener("click", function () { window.PF_LOCK_TARGET = n.url; }, true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { banner(); lockPush(); });
  else { banner(); lockPush(); }
})();
