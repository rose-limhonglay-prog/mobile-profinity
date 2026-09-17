/* ===========================================================================
   PROfinity — Background upload tracker (plain JS, no React)
   A media post shared from Create Post is handed to the newsfeed straight
   away carrying an `uploading` marker (see cpUploadDuration in
   create-post-mobile.jsx and FeedUploadCard in app.jsx). Progress is derived
   from the wall clock, so it keeps running wherever the member goes — but
   only the feed used to *render* it and book the "+75 shared a post" reward
   when it finished. This script runs on every mobile page: while a post is
   still uploading it shows a compact floating card (thumb, %, cancel) above
   the tab bar, and when the upload completes on a page that isn't the feed
   it drops the marker, books the reward (PFLoyalty) and pops the points
   exactly as the feed would have. The newsfeed / Community feed claims
   ownership while mounted (PFUploadTracker.setOwner) so their inline
   FeedUploadCard stays the single source of truth there.
   window.PFUploadTracker = { setOwner, list, refresh, cancel }.
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-newsfeed-user-posts";
  var REWARD_KEY = "pf-post-reward";
  var DONE_HOLD = 2600;      /* ms the floating "Posted" state lingers */
  var TICK = 120;
  var HOST_SELECTOR = "[data-ios-device], [data-screen-label], .ml-screen, .lm-screen, .m-screen, .pm-screen, .cm-screen, .lcm-screen, .acc-screen";
  var POST_POINTS = 75;

  var owned = false;        /* a Feed (newsfeed / community) is mounted and renders its own cards */
  var el = null, timer = null, raw = null, posts = [], hideTimer = null, mountedAt = Date.now();
  var covers = {};          /* resolved "pfmedia:" refs → object URL */

  function readRaw() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function readPosts() {
    var s = readRaw();
    if (s === raw) return posts;
    raw = s;
    try { posts = JSON.parse(s) || []; } catch (e) { posts = []; }
    if (!Array.isArray(posts)) posts = [];
    return posts;
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
    raw = null; readPosts();
  }
  /* same easing as uploadProgressOf in app.jsx — quick first half, slower tail */
  function progress(p) {
    var u = p && p.uploading;
    if (!u || !u.started) return 1;
    var t = Math.min(1, Math.max(0, (Date.now() - u.started) / Math.max(1, u.duration || 6000)));
    if (t >= 1) return 1;
    return Math.max(0.02, 1 - Math.pow(1 - t, 1.7));
  }
  function mediaLabel(p) {
    var n = (p.media || []).length;
    if (p.video && n) return "video + " + n + (n === 1 ? " photo" : " photos");
    if (p.video) return "video";
    if (n > 1) return n + " photos";
    if (n === 1) return "photo";
    return "post";
  }
  function uploading() { return readPosts().filter(function (p) { return p && p.uploading; }); }

  function findHost() {
    var dev = document.querySelector("[data-ios-device]");
    if (dev) return dev;
    var nodes = document.querySelectorAll(HOST_SELECTOR);
    return nodes.length ? nodes[0] : null;
  }
  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---- booking the reward on a non-feed page ---- */
  function book(reward) {
    var r = reward || {};
    var amount = Number(r.amount) || POST_POINTS;
    var label = r.label || "Shared a post", actionId = r.actionId || "evt_create_post";
    var eng = window.PFLoyalty;
    var booked = false;
    if (eng && eng.awardPoints) {
      try { eng.awardPoints(amount, label, actionId); booked = true; } catch (e) {}
    }
    if (!booked && !document.querySelector(".m-pts, .m-pts-pill")) {
      /* no engine and no header pill on this page: hand the payout to the
         feed, which pays it out (with its sound) the next time it loads */
      try { sessionStorage.setItem(REWARD_KEY, JSON.stringify({ amount: amount, label: label, actionId: actionId, ts: Date.now() })); } catch (e) {}
      return;
    }
    /* the header pill re-reads the engine (detail.booked) instead of awarding
       twice; points-sound plays the fuller "post" chime; daily-goal tallies */
    try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: amount, label: label, actionId: actionId, sound: "post", booked: booked } })); } catch (e) {}
  }

  /* ---- floating card ---- */
  function build() {
    if (el) return el;
    el = document.createElement("div");
    el.className = "pf-uplt";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<div class="pf-uplt-card">' +
        '<div class="pf-uplt-thumb" aria-hidden="true"><img alt="" /><span class="pf-uplt-ph"><iconify-icon icon="lucide:video"></iconify-icon></span><span class="pf-uplt-play"><iconify-icon icon="lucide:play"></iconify-icon></span><span class="pf-uplt-count"></span><span class="pf-uplt-dim"></span></div>' +
        '<div class="pf-uplt-main">' +
          '<div class="pf-uplt-title">Uploading your post…</div>' +
          '<div class="pf-uplt-sub"><span class="pf-uplt-snippet"></span><span class="pf-uplt-pct">0%</span></div>' +
          '<div class="pf-uplt-track"><span class="pf-uplt-bar"></span></div>' +
        '</div>' +
        '<button type="button" class="pf-uplt-cancel" aria-label="Cancel upload"><iconify-icon icon="lucide:x"></iconify-icon></button>' +
        '<span class="pf-uplt-check" aria-hidden="true"><iconify-icon icon="lucide:check"></iconify-icon></span>' +
      '</div>';
    el.addEventListener("click", function (e) {
      if (e.target.closest(".pf-uplt-cancel")) { e.stopPropagation(); var id = el.getAttribute("data-post"); if (id) cancel(id); return; }
      /* tap the finished card → see the post on the newsfeed */
      if (el.classList.contains("is-done")) go("NewsfeedMobile.html");
    });
    return el;
  }
  function mount() {
    build();
    var host = findHost() || document.body;
    if (host !== document.body && getComputedStyle(host).position === "static") host.style.position = "relative";
    el.classList.toggle("pf-uplt--fixed", host === document.body);
    el.classList.toggle("has-tabs", !!host.querySelector(".m-tabs, .m-tabbar, .cm-tabs, .pm-tabs"));
    if (el.parentElement !== host) host.appendChild(el);
  }
  function setCover(p) {
    var img = el.querySelector(".pf-uplt-thumb img");
    var src = p.video ? p.video.cover : (p.media || [])[0];
    var store = window.PFMediaStore;
    if (src && store && store.isRef && store.isRef(src)) {
      if (covers[src]) src = covers[src];
      else { var ref = src; src = null; try { store.url(ref).then(function (u) { if (u) { covers[ref] = u; if (el.getAttribute("data-post") === p.id) { img.src = u; el.classList.add("has-cover"); } } }); } catch (e) {} }
    }
    if (src) { if (img.getAttribute("src") !== src) img.src = src; el.classList.add("has-cover"); }
    else { img.removeAttribute("src"); el.classList.remove("has-cover"); }
    el.classList.toggle("is-video", !!p.video);
    var extra = (p.media || []).length - 1;
    var cnt = el.querySelector(".pf-uplt-count");
    cnt.textContent = extra > 0 ? "+" + extra : "";
    cnt.style.display = !p.video && extra > 0 ? "" : "none";
  }
  function render(p, done) {
    mount();
    var pct = done ? 100 : Math.round(progress(p) * 100);
    if (el.getAttribute("data-post") !== p.id) { el.setAttribute("data-post", p.id); setCover(p); }
    el.classList.toggle("is-done", !!done);
    el.querySelector(".pf-uplt-title").textContent = done ? "Posted" : "Uploading your post…";
    var snip = el.querySelector(".pf-uplt-snippet");
    snip.textContent = done ? "Your " + mediaLabel(p) + " is live on the feed — tap to view" : (p.body || "");
    el.querySelector(".pf-uplt-pct").textContent = pct + "%";
    el.querySelector(".pf-uplt-pct").style.display = done ? "none" : "";
    el.querySelector(".pf-uplt-bar").style.width = pct + "%";
    el.querySelector(".pf-uplt-dim").style.height = (100 - pct) + "%";
    if (!el.classList.contains("is-open")) requestAnimationFrame(function () { el && el.classList.add("is-open"); });
  }
  function hide() {
    if (!el) return;
    el.classList.remove("is-open");
    el.removeAttribute("data-post");
  }

  var doneShown = null; /* { id, at, post } — the finished post we're holding on screen */
  function tick() {
    var list = uploading();
    /* the feed renders its own FeedUploadCard: stay out of the way entirely */
    if (owned || document.querySelector(".pf-upl")) { hide(); if (!list.length) stop(); return; }
    if (doneShown) {
      if (Date.now() - doneShown.at < DONE_HOLD) { render(doneShown.post, true); return; }
      doneShown = null; hide();
    }
    if (!list.length) { stop(); return; }
    var p = list[list.length - 1]; /* oldest still-uploading post first */
    if (progress(p) >= 1) {
      /* finished while the member was on this page: strip the marker for
         everyone (a later feed visit must not replay it) and pay out */
      var all = readPosts().map(function (q) { return q && q.id === p.id ? Object.assign({}, q, { uploading: null }) : q; });
      write(all);
      doneShown = { id: p.id, at: Date.now(), post: p };
      render(p, true);
      book(p.uploading && p.uploading.reward);
      return;
    }
    /* let the page's own chrome settle before the card slides in */
    if (Date.now() - mountedAt < 260) return;
    render(p, false);
  }
  function start() { if (timer) return; timer = setInterval(tick, TICK); tick(); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } if (!doneShown) hide(); }

  function cancel(id) {
    var next = readPosts().filter(function (p) { return !p || p.id !== id; });
    write(next);
    doneShown = null;
    hide();
    try { window.dispatchEvent(new CustomEvent("pf:upload-cancelled", { detail: { id: id } })); } catch (e) {}
  }
  function setOwner(on) {
    owned = !!on;
    if (owned) hide(); else refresh();
  }
  function refresh() { raw = null; if (uploading().length || doneShown) start(); else stop(); }

  /* another page/tab (Create Post) just added an uploading post */
  window.addEventListener("storage", function (e) { if (!e.key || e.key === KEY) refresh(); });
  window.addEventListener("pageshow", refresh);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh); else refresh();

  window.PFUploadTracker = { setOwner: setOwner, list: uploading, refresh: refresh, cancel: cancel, progress: progress };
})();
