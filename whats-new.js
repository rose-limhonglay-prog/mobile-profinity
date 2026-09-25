/* ===========================================================================
   PROfinity — "What's new" release popup (plain JS, no React)
   A plain white modal that appears once per release on the newsfeed
   (NewsfeedMobile / NewsfeedMobileFree inside the phone frame, NewsfeedWeb
   centred on the desktop page). Lists the headline changes for the current
   version with an icon, a title and one line each, plus a "Got it" button.
   Waits for the launch splash (launch-splash.js) and the daily check-in
   takeover (daily-checkin.js) to clear before it appears, and flags
   html.pf-wn-open while it is up so the reward router's celebrations queue
   behind it. Fixed white card in both light and dark mode (user rule).

   Seen state: localStorage pf-whats-new-seen = <version>. Bump WHATS_NEW.version
   to show it again to everyone.
   Debug: ?whatsnew=1 forces the popup, ?whatsnew=0 suppresses it.
   API: window.PFWhatsNew = { show, hide, reset, version, isSeen }.
   =========================================================================== */
(function () {
  "use strict";
  var SEEN_KEY = "pf-whats-new-seen";

  /* ---- copy: bump `version` when the list changes ---- */
  var WHATS_NEW = {
    version: "v1.9.1",
    date: "September 2026",
    title: "What’s new",
    intro: "A few things we’ve added since your last visit.",
    items: [
      { icon: "lucide:gem", tone: "gold",
        title: "Rewards & Milestone Path",
        body: "Earn points for checking in, posting and learning, and climb from Jade to Sapphire." },
      { icon: "lucide:calendar-check", tone: "violet",
        title: "Daily check-in bonus",
        body: "Open the app each day for bonus points and keep your streak alive." },
      { icon: "lucide:brain", tone: "teal",
        title: "Quizzes in your feed",
        body: "Quick knowledge checks between posts, with points for every correct answer." },
      { icon: "lucide:headset", tone: "rose",
        title: "Chat Support",
        body: "Message the team straight from the menu without leaving the app." }
    ],
    cta: "Got it"
  };

  var q = "";
  try { q = new URLSearchParams(location.search).get("whatsnew") || ""; } catch (e) {}

  function read() { try { return localStorage.getItem(SEEN_KEY) || ""; } catch (e) { return ""; } }
  function write(v) { try { localStorage.setItem(SEEN_KEY, v); } catch (e) {} }
  function isSeen() { return read() === WHATS_NEW.version; }

  /* inside the phone frame on the mobile shells, otherwise fixed over the page */
  function findHost() { return document.querySelector("[data-ios-device]"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---- the modal ---- */
  var el = null, lastFocus = null;

  function build() {
    if (el) return el;
    var root = document.createElement("div");
    root.className = "pf-wn-root";
    var items = WHATS_NEW.items.map(function (it, i) {
      return '<li class="pf-wn-item" style="--d:' + (120 + i * 60) + 'ms">' +
        '<span class="pf-wn-ico pf-wn-ico--' + esc(it.tone || "gold") + '" aria-hidden="true"><iconify-icon icon="' + esc(it.icon) + '" width="20" height="20"></iconify-icon></span>' +
        '<span class="pf-wn-tx"><b>' + esc(it.title) + '</b><span>' + esc(it.body) + '</span></span>' +
      '</li>';
    }).join("");
    root.innerHTML =
      '<button class="pf-wn-scrim" type="button" aria-label="Close" data-wn-close></button>' +
      '<div class="pf-wn-card" role="dialog" aria-modal="true" aria-labelledby="pf-wn-title">' +
        '<button class="pf-wn-x" type="button" aria-label="Close" data-wn-close><iconify-icon icon="lucide:x" width="18" height="18"></iconify-icon></button>' +
        '<div class="pf-wn-head">' +
          '<span class="pf-wn-badge"><iconify-icon icon="lucide:sparkles" width="14" height="14"></iconify-icon>' + esc(WHATS_NEW.version) + '</span>' +
          '<h2 class="pf-wn-title" id="pf-wn-title">' + esc(WHATS_NEW.title) + '</h2>' +
          '<p class="pf-wn-intro">' + esc(WHATS_NEW.intro) + '</p>' +
        '</div>' +
        '<ul class="pf-wn-list">' + items + '</ul>' +
        '<div class="pf-wn-foot">' +
          '<button class="pf-wn-btn" type="button" data-wn-close>' + esc(WHATS_NEW.cta) + '</button>' +
          '<small class="pf-wn-date">' + esc(WHATS_NEW.date) + '</small>' +
        '</div>' +
      '</div>';
    root.addEventListener("click", function (e) { if (e.target.closest("[data-wn-close]")) hide(); });
    el = root;
    return root;
  }
  function onKey(e) { if (e.key === "Escape") hide(); }

  function show() {
    build();
    var host = findHost() || document.body;
    if (host !== document.body && !host.style.position) host.style.position = "relative";
    el.classList.toggle("pf-wn-root--fixed", host === document.body);
    if (el.parentElement !== host) host.appendChild(el);
    el.querySelectorAll(".pf-wn-item").forEach(function (n) { n.style.animation = "none"; void n.offsetWidth; n.style.animation = ""; });
    lastFocus = document.activeElement;
    document.documentElement.classList.add("pf-wn-open");
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (el) el.classList.add("is-open"); }); });
    document.addEventListener("keydown", onKey);
    setTimeout(function () { var b = el && el.querySelector(".pf-wn-btn"); if (b) b.focus(); }, 80);
    write(WHATS_NEW.version);
  }
  function hide() {
    if (!el) return;
    el.classList.remove("is-open");
    document.documentElement.classList.remove("pf-wn-open");
    document.removeEventListener("keydown", onKey);
    var node = el;
    setTimeout(function () { if (node && node.parentElement && !node.classList.contains("is-open")) node.parentElement.removeChild(node); }, 320);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    try { window.dispatchEvent(new CustomEvent("pf:whats-new-done")); } catch (e) {}
  }

  /* ---- sequencing: after the launch splash and the daily check-in ---- */
  function takeoverUp() {
    var h = document.documentElement;
    return h.classList.contains("pf-launch-active") || !!document.querySelector(".pf-launch") ||
      h.classList.contains("pf-dci-open") || !!document.querySelector(".pf-dci-screen.is-open");
  }
  function schedule() {
    var t0 = Date.now();
    /* give daily-checkin.js (700ms after the splash lifts) a chance to claim the screen first */
    setTimeout(function poll() {
      if (takeoverUp() && Date.now() - t0 < 45000) { setTimeout(poll, 250); return; }
      setTimeout(function () { if (!takeoverUp()) show(); else setTimeout(poll, 250); }, 500);
    }, 1400);
  }

  if (q !== "0" && (q === "1" || !isSeen())) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", schedule);
    else schedule();
  }

  window.PFWhatsNew = {
    show: show,
    hide: hide,
    reset: function () { try { localStorage.removeItem(SEEN_KEY); } catch (e) {} },
    version: WHATS_NEW.version,
    isSeen: isSeen
  };
})();
