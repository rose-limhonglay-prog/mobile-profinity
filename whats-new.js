/* ===========================================================================
   PROfinity — "What's new" release popup (plain JS, no React)
   A plain white modal that appears once per release on the newsfeed
   (NewsfeedMobile / NewsfeedMobileFree inside the phone frame, NewsfeedWeb
   centred on the desktop page). Walks through the headline changes for the
   current version as a stepper: one feature per step with a screenshot
   (assets/whats-new/*.jpg, captured from the real pages), an icon, a title
   and one line, plus dots, Back / Next and a final "Got it". Swipe, the
   arrow keys and tapping a dot also move between steps.
   Waits for the launch splash (launch-splash.js) and the daily check-in
   takeover (daily-checkin.js) to clear before it appears, and flags
   html.pf-wn-open while it is up so the reward router's celebrations queue
   behind it. Fixed white card in both light and dark mode (user rule).

   Seen state: localStorage pf-whats-new-seen = <version>. Bump WHATS_NEW.version
   to show it again to everyone.
   Debug: ?whatsnew=1 forces the popup, ?whatsnew=0 suppresses it.
   API: window.PFWhatsNew = { show, hide, go, reset, version, isSeen }.
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
    /* each step: image = assets/whats-new/<file>, fit = "phone" (screen peeking
       in from the top of the panel) or "card" (a single card centred) */
    items: [
      { icon: "lucide:gem", tone: "gold", image: "assets/whats-new/rewards.jpg", fit: "phone",
        title: "Rewards & Milestone Path",
        body: "Earn points for checking in, posting and learning, and climb from Jade to Sapphire." },
      { icon: "lucide:calendar-check", tone: "violet", image: "assets/whats-new/checkin.jpg", fit: "phone",
        title: "Daily check-in bonus",
        body: "Open the app each day for bonus points and keep your streak alive." },
      { icon: "lucide:brain", tone: "teal", image: "assets/whats-new/quiz.jpg", fit: "card",
        title: "Quizzes in your feed",
        body: "Quick knowledge checks between posts, with points for every correct answer." },
      { icon: "lucide:headset", tone: "rose", image: "assets/whats-new/support.jpg", fit: "phone",
        title: "Chat Support",
        body: "Message the team straight from the menu without leaving the app." }
    ],
    next: "Next",
    back: "Back",
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
  var el = null, lastFocus = null, cur = 0;
  var N = WHATS_NEW.items.length;

  function build() {
    if (el) return el;
    var root = document.createElement("div");
    root.className = "pf-wn-root";
    var steps = WHATS_NEW.items.map(function (it, i) {
      return '<section class="pf-wn-step" data-step="' + i + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + N + '">' +
        '<div class="pf-wn-shot pf-wn-shot--' + esc(it.tone || "gold") + ' pf-wn-shot--' + esc(it.fit || "phone") + '">' +
          '<img class="pf-wn-shot-img" src="' + esc(it.image) + '" alt="" draggable="false">' +
        '</div>' +
        '<div class="pf-wn-stx">' +
          '<span class="pf-wn-ico pf-wn-ico--' + esc(it.tone || "gold") + '" aria-hidden="true"><iconify-icon icon="' + esc(it.icon) + '" width="18" height="18"></iconify-icon></span>' +
          '<span class="pf-wn-tx"><b>' + esc(it.title) + '</b><span>' + esc(it.body) + '</span></span>' +
        '</div>' +
      '</section>';
    }).join("");
    var dots = WHATS_NEW.items.map(function (it, i) {
      return '<button class="pf-wn-dot" type="button" data-wn-go="' + i + '" aria-label="Step ' + (i + 1) + ': ' + esc(it.title) + '"></button>';
    }).join("");
    root.innerHTML =
      '<button class="pf-wn-scrim" type="button" aria-label="Close" data-wn-close></button>' +
      '<div class="pf-wn-card" role="dialog" aria-modal="true" aria-labelledby="pf-wn-title">' +
        '<button class="pf-wn-x" type="button" aria-label="Close" data-wn-close><iconify-icon icon="lucide:x" width="18" height="18"></iconify-icon></button>' +
        '<div class="pf-wn-head">' +
          '<span class="pf-wn-badge">' + esc(WHATS_NEW.version) + '</span>' +
          '<h2 class="pf-wn-title" id="pf-wn-title">' + esc(WHATS_NEW.title) + '</h2>' +
          '<p class="pf-wn-intro">' + esc(WHATS_NEW.intro) + '</p>' +
        '</div>' +
        '<div class="pf-wn-view"><div class="pf-wn-track">' + steps + '</div></div>' +
        '<div class="pf-wn-prog"><span class="pf-wn-dots">' + dots + '</span><span class="pf-wn-count" aria-live="polite"></span></div>' +
        '<div class="pf-wn-foot">' +
          '<div class="pf-wn-nav">' +
            '<button class="pf-wn-btn pf-wn-btn--ghost" type="button" data-wn-back><iconify-icon icon="lucide:arrow-left" width="18" height="18"></iconify-icon>' + esc(WHATS_NEW.back) + '</button>' +
            '<button class="pf-wn-btn" type="button" data-wn-next><span class="pf-wn-btn-l"></span><iconify-icon class="pf-wn-btn-arr" icon="lucide:arrow-right" width="18" height="18"></iconify-icon></button>' +
          '</div>' +
          '<small class="pf-wn-date">' + esc(WHATS_NEW.date) + '</small>' +
        '</div>' +
      '</div>';
    root.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest("[data-wn-close]")) { hide(); return; }
      if (t.closest("[data-wn-back]")) { go(cur - 1); return; }
      if (t.closest("[data-wn-next]")) { if (cur >= N - 1) hide(); else go(cur + 1); return; }
      var d = t.closest("[data-wn-go]"); if (d) go(+d.getAttribute("data-wn-go"));
    });
    /* swipe between steps */
    var view = root.querySelector(".pf-wn-view"), sx = 0, sy = 0, swiping = false;
    view.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; swiping = true; }, { passive: true });
    view.addEventListener("pointerup", function (e) {
      if (!swiping) return; swiping = false;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1));
    });
    view.addEventListener("pointercancel", function () { swiping = false; });
    el = root;
    return root;
  }

  /* move the stepper to step i and sync dots, counter and buttons */
  function go(i, instant) {
    if (!el) return;
    i = Math.max(0, Math.min(N - 1, i));
    cur = i;
    var track = el.querySelector(".pf-wn-track");
    if (instant) { track.style.transition = "none"; }
    track.style.transform = "translateX(" + (-i * 100) + "%)";
    if (instant) { void track.offsetWidth; track.style.transition = ""; }
    el.querySelectorAll(".pf-wn-step").forEach(function (n, k) { n.classList.toggle("is-active", k === i); n.setAttribute("aria-hidden", k === i ? "false" : "true"); });
    el.querySelectorAll(".pf-wn-dot").forEach(function (n, k) { n.classList.toggle("is-on", k === i); n.classList.toggle("is-done", k < i); n.setAttribute("aria-current", k === i ? "step" : "false"); });
    el.querySelector(".pf-wn-count").textContent = (i + 1) + " of " + N;
    var back = el.querySelector("[data-wn-back]"), next = el.querySelector("[data-wn-next]");
    back.classList.toggle("is-hidden", i === 0);
    back.disabled = i === 0;
    var last = i === N - 1;
    next.querySelector(".pf-wn-btn-l").textContent = last ? WHATS_NEW.cta : WHATS_NEW.next;
    next.classList.toggle("is-last", last);
    el.classList.toggle("is-last", last);
  }
  function onKey(e) {
    if (e.key === "Escape") hide();
    else if (e.key === "ArrowRight") go(cur + 1);
    else if (e.key === "ArrowLeft") go(cur - 1);
  }

  function show() {
    build();
    var host = findHost() || document.body;
    if (host !== document.body && !host.style.position) host.style.position = "relative";
    el.classList.toggle("pf-wn-root--fixed", host === document.body);
    if (el.parentElement !== host) host.appendChild(el);
    go(0, true);
    lastFocus = document.activeElement;
    document.documentElement.classList.add("pf-wn-open");
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (el) el.classList.add("is-open"); }); });
    document.addEventListener("keydown", onKey);
    setTimeout(function () { var b = el && el.querySelector("[data-wn-next]"); if (b) b.focus(); }, 80);
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
  function preload() { WHATS_NEW.items.forEach(function (it) { if (it.image) { var im = new Image(); im.src = it.image; } }); }
  function schedule() {
    preload();
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
    go: go,
    reset: function () { try { localStorage.removeItem(SEEN_KEY); } catch (e) {} },
    version: WHATS_NEW.version,
    isSeen: isSeen
  };
})();
