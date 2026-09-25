/* ===========================================================================
   PROfinity — Voice conference call state + movable mini call (plain JS)
   The Voice Conference lives in the Messages bundle (messages-mobile.jsx,
   Conference tab) on both Messages.html (mobile) and MessagesWeb.html (web).
   Joining a room writes the live call to localStorage ("pf-voice-call") so
   it survives navigation. This script runs on every mobile and desktop page:
   while a call is live and the page isn't showing the full conference stage
   it draws a small draggable call card (room name, host, mic / hand / emoji /
   hang-up) that the member can move anywhere, collapse to a bubble, or tap
   to jump back into the room. The stage claims ownership while mounted
   (PFVoiceCall.setOwner(true)) so the card hides there.

   window.PFVoiceCall = { get, start, end, set, toggleMute, toggleHand,
                          elapsed, setOwner, url, isWeb, refresh }
   Events: "pf:voice-call-changed" (this tab) · "storage" (other tabs)
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-voice-call";
  var POS_KEY = "pf-voice-call-pos";
  var TICK = 1000;
  var HOST_SELECTOR = "[data-ios-device], [data-screen-label], .ml-screen, .lm-screen, .m-screen, .pm-screen, .cm-screen, .lcm-screen, .acc-screen";
  var EMOJIS = ["👍", "❤️", "👏", "😂", "🙌", "🔥"];

  var NOT_READ = {};
  var owned = false, el = null, timer = null, raw = NOT_READ, call = null, collapsed = false, emojiOpen = false;

  /* ------------------------------------------------------------ state */
  function readRaw() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function read() {
    var s = readRaw();
    if (s === raw) return call;
    raw = s;
    try { call = s ? JSON.parse(s) : null; } catch (e) { call = null; }
    if (call && (!call.id || !call.startedAt)) call = null;
    return call;
  }
  function write(next) {
    try { if (next) localStorage.setItem(KEY, JSON.stringify(next)); else localStorage.removeItem(KEY); } catch (e) {}
    raw = NOT_READ; read();
    try { window.dispatchEvent(new CustomEvent("pf:voice-call-changed", { detail: { call: call } })); } catch (e) {}
    render();
  }
  function start(conf) {
    var c = conf || {};
    write({ id: c.id, name: c.name || "Voice conference", hostId: c.hostId || null, hostName: c.hostName || "", hostAvatar: c.hostAvatar || null,
      link: c.link || "", count: c.count || 0, mine: !!c.mine, startedAt: c.startedAt || Date.now(), joinedAt: Date.now(), muted: c.muted !== false, hand: false });
  }
  function end() { collapsed = false; emojiOpen = false; write(null); }
  function set(patch) { var c = read(); if (!c) return; write(Object.assign({}, c, patch || {})); }
  function toggleMute() { var c = read(); if (c) set({ muted: !c.muted }); }
  function toggleHand() { var c = read(); if (c) set({ hand: !c.hand }); }
  function elapsed() { var c = read(); return c ? Math.max(0, Date.now() - c.startedAt) : 0; }
  function isWeb() { return !!(window.PF_DM_WEB || window.PFMessagesChrome || document.querySelector(".dm-web-app")); }
  function url(c) { var x = c || read(); return (isWeb() ? "MessagesWeb.html" : "Messages.html") + "?tab=conference" + (x ? "&conf=" + encodeURIComponent(x.id) : ""); }
  function go(u) { (window.pfGo || function (v) { window.location.href = v; })(u); }
  function fmt(ms) {
    var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return p(h) + ":" + p(m) + ":" + p(r);
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function initials(name) { return String(name || "").replace(/^(dr\.?|nurse|prof\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "").split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(""); }

  /* ------------------------------------------------------------ icons (lucide) */
  var I = {
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    micOff: '<line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" x2="12" y1="19" y2="22"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    expand: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    wave: '<path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>' };
  function svg(name, size) { return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[name] + "</svg>"; }

  /* ------------------------------------------------------------ DOM */
  function findHost() {
    var dev = document.querySelector("[data-ios-device]");
    if (dev) return dev;
    if (isWeb()) return null;
    var nodes = document.querySelectorAll(HOST_SELECTOR);
    return nodes.length ? nodes[0] : null;
  }
  function readPos() { try { return JSON.parse(localStorage.getItem(POS_KEY + (isWeb() ? ":web" : ":m"))) || null; } catch (e) { return null; } }
  function savePos(p) { try { localStorage.setItem(POS_KEY + (isWeb() ? ":web" : ":m"), JSON.stringify(p)); } catch (e) {} }

  function build() {
    if (el) return el;
    el = document.createElement("div");
    el.className = "pf-vcall";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Ongoing voice conference");
    el.innerHTML =
      '<div class="pf-vcall-card">' +
        '<div class="pf-vcall-head" data-drag>' +
          '<span class="pf-vcall-ic">' + svg("wave", 15) + "</span>" +
          '<span class="pf-vcall-name"></span>' +
          '<span class="pf-vcall-time" aria-live="off">00:00:00</span>' +
          '<button type="button" class="pf-vcall-hbtn" data-act="expand" aria-label="Back to the conference" title="Back to the conference">' + svg("expand", 15) + "</button>" +
          '<button type="button" class="pf-vcall-hbtn" data-act="collapse" aria-label="Minimise call" title="Minimise">' + svg("x", 16) + "</button>" +
        "</div>" +
        '<div class="pf-vcall-body" data-drag>' +
          '<span class="pf-vcall-av"><img alt="" /><i></i><b class="pf-vcall-live"></b></span>' +
          '<span class="pf-vcall-who"><span class="pf-vcall-host"></span><span class="pf-vcall-role">Host</span></span>' +
        "</div>" +
        '<div class="pf-vcall-ctl">' +
          '<button type="button" class="pf-vcall-btn pf-vcall-mic" data-act="mic" aria-pressed="true" aria-label="Unmute"></button>' +
          '<button type="button" class="pf-vcall-btn pf-vcall-hand" data-act="hand" aria-pressed="false" aria-label="Raise hand">' + svg("hand", 18) + "</button>" +
          '<button type="button" class="pf-vcall-btn pf-vcall-emoji" data-act="emoji" aria-label="Send a reaction" aria-expanded="false">' + svg("smile", 18) + "</button>" +
          '<button type="button" class="pf-vcall-btn pf-vcall-end" data-act="end" aria-label="Leave the conference">' + svg("phone", 18) + "</button>" +
        "</div>" +
        '<div class="pf-vcall-emojis" role="group" aria-label="Reactions">' + EMOJIS.map(function (e) { return '<button type="button" data-emoji="' + e + '" aria-label="React ' + e + '">' + e + "</button>"; }).join("") + "</div>" +
      "</div>" +
      '<button type="button" class="pf-vcall-bubble" data-act="open" data-drag aria-label="Ongoing call — tap to show controls">' +
        '<span class="pf-vcall-bubble-ic">' + svg("mic", 20) + "</span>" +
        '<span class="pf-vcall-bubble-time">00:00</span>' +
      "</button>";
    el.addEventListener("click", onClick);
    wireDrag(el);
    return el;
  }

  function onClick(e) {
    var t = e.target.closest("[data-act], [data-emoji]");
    if (!t || dragging.moved) return;
    e.preventDefault(); e.stopPropagation();
    if (t.hasAttribute("data-emoji")) { burst(t.getAttribute("data-emoji")); return; }
    var act = t.getAttribute("data-act");
    if (act === "mic") toggleMute();
    else if (act === "hand") toggleHand();
    else if (act === "emoji") { emojiOpen = !emojiOpen; render(); }
    else if (act === "collapse") { collapsed = true; emojiOpen = false; render(); }
    else if (act === "open") { collapsed = false; render(); }
    else if (act === "expand") go(url());
    else if (act === "end") end();
  }

  function burst(emoji) {
    var s = document.createElement("span");
    s.className = "pf-vcall-burst";
    s.textContent = emoji;
    s.style.left = (30 + Math.random() * 40) + "%";
    el.querySelector(".pf-vcall-card").appendChild(s);
    window.setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 1400);
  }

  /* ---- drag (pointer events) — clamps to the host / viewport, remembers position ---- */
  var dragging = { on: false, moved: false };
  function wireDrag(root) {
    root.addEventListener("pointerdown", function (e) {
      var handle = e.target.closest("[data-drag]");
      if (!handle || e.target.closest("button:not([data-drag])")) return;
      var r = el.getBoundingClientRect();
      dragging = { on: true, moved: false, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, id: e.pointerId };
      el.classList.add("is-dragging");
      try { root.setPointerCapture(e.pointerId); } catch (err) {}
    });
    root.addEventListener("pointermove", function (e) {
      if (!dragging.on) return;
      var dx = e.clientX - dragging.sx, dy = e.clientY - dragging.sy;
      if (!dragging.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
      dragging.moved = true;
      place(dragging.ox + dx, dragging.oy + dy, true);
    });
    var stop = function (e) {
      if (!dragging.on) return;
      dragging.on = false;
      el.classList.remove("is-dragging");
      try { root.releasePointerCapture(dragging.id); } catch (err) {}
      if (dragging.moved) {
        var b = bounds(), r = el.getBoundingClientRect();
        savePos({ x: (r.left - b.left) / Math.max(1, b.width - r.width), y: (r.top - b.top) / Math.max(1, b.height - r.height) });
        /* let the trailing click be swallowed, then clear */
        window.setTimeout(function () { dragging.moved = false; }, 0);
      }
    };
    root.addEventListener("pointerup", stop);
    root.addEventListener("pointercancel", stop);
  }
  function bounds() {
    var host = el && el.parentNode !== document.body ? el.parentNode : null;
    if (host) { var r = host.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; }
    return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
  }
  /* viewport coords → offsets inside the host; clamped so the card never leaves it */
  function place(vx, vy, live) {
    var b = bounds(), r = el.getBoundingClientRect();
    var pad = 10;
    var x = Math.min(Math.max(vx, b.left + pad), b.left + b.width - r.width - pad);
    var y = Math.min(Math.max(vy, b.top + pad), b.top + b.height - r.height - pad);
    el.style.left = (x - b.left) + "px";
    el.style.top = (y - b.top) + "px";
    el.style.right = "auto"; el.style.bottom = "auto";
    if (!live) el.classList.add("is-placed");
  }
  function applyPos() {
    if (!el || !el.parentNode) return;
    var p = readPos(), b = bounds(), r = el.getBoundingClientRect();
    if (!p) {
      /* default: bottom-right, above the tab bar on phones */
      var tabs = el.parentNode !== document.body && document.querySelector(".m-tabbar, .dm-dock, .lm-tabs, nav[aria-label='Primary']");
      var lift = tabs ? 104 : (isWeb() ? 28 : 28);
      place(b.left + b.width - r.width - 14, b.top + b.height - r.height - lift);
      return;
    }
    place(b.left + p.x * (b.width - r.width), b.top + p.y * (b.height - r.height));
  }

  function mount() {
    var node = build();
    var host = findHost();
    var target = host || document.body;
    if (node.parentNode !== target) {
      target.appendChild(node);
      node.classList.toggle("pf-vcall--fixed", !host);
      if (host && getComputedStyle(host).position === "static") host.style.position = "relative";
    }
  }
  function unmount() {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    if (el) el.classList.remove("is-open");
  }

  function render() {
    var c = read();
    if (!c || owned) { unmount(); stopTick(); return; }
    mount();
    var host = c.hostName || "";
    el.querySelector(".pf-vcall-name").textContent = c.name || "Voice conference";
    el.querySelector(".pf-vcall-host").textContent = host || "Live room";
    el.querySelector(".pf-vcall-role").textContent = c.mine ? "You're hosting" : "Host";
    var img = el.querySelector(".pf-vcall-av img"), ini = el.querySelector(".pf-vcall-av i");
    if (c.hostAvatar) { img.src = c.hostAvatar; img.style.display = ""; ini.style.display = "none"; }
    else { img.removeAttribute("src"); img.style.display = "none"; ini.style.display = ""; ini.textContent = initials(host); }
    var mic = el.querySelector(".pf-vcall-mic");
    mic.innerHTML = svg(c.muted ? "micOff" : "mic", 18);
    mic.classList.toggle("is-off", !!c.muted);
    mic.setAttribute("aria-pressed", c.muted ? "true" : "false");
    mic.setAttribute("aria-label", c.muted ? "Unmute" : "Mute");
    var hand = el.querySelector(".pf-vcall-hand");
    hand.classList.toggle("is-on", !!c.hand);
    hand.setAttribute("aria-pressed", c.hand ? "true" : "false");
    hand.setAttribute("aria-label", c.hand ? "Lower hand" : "Raise hand");
    el.querySelector(".pf-vcall-emoji").setAttribute("aria-expanded", emojiOpen ? "true" : "false");
    el.classList.toggle("has-emojis", emojiOpen);
    el.classList.toggle("is-collapsed", collapsed);
    tick();
    if (!el.classList.contains("is-open")) {
      el.classList.add("is-open");
      requestAnimationFrame(applyPos);
    } else applyPos();
    startTick();
  }
  function tick() {
    var c = read();
    if (!el || !c) return;
    var t = fmt(Date.now() - c.startedAt);
    el.querySelector(".pf-vcall-time").textContent = t;
    el.querySelector(".pf-vcall-bubble-time").textContent = t.replace(/^00:/, "");
  }
  function startTick() { if (timer) return; timer = window.setInterval(tick, TICK); }
  function stopTick() { if (timer) { window.clearInterval(timer); timer = null; } }

  function setOwner(v) { owned = !!v; render(); }

  /* ------------------------------------------------------------ boot */
  window.addEventListener("storage", function (e) { if (!e.key || e.key === KEY) { raw = NOT_READ; render(); } });
  window.addEventListener("pf:voice-call-changed", function () { render(); });
  window.addEventListener("resize", function () { if (el && el.parentNode) applyPos(); });
  /* React pages paint the phone frame after this script runs — re-home the card once the host exists */
  var settle = 0;
  var obs = new MutationObserver(function () {
    if (!read() || owned) return;
    var host = findHost();
    if (host && el && el.parentNode !== host) { mount(); applyPos(); }
    else if (!el || !el.parentNode) render();
  });
  function boot() {
    render();
    obs.observe(document.body, { childList: true, subtree: true });
    /* after the page has settled, stop watching to keep the observer cheap */
    settle = window.setTimeout(function () { obs.disconnect(); }, 6000);
  }
  if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);

  window.PFVoiceCall = { get: read, start: start, end: end, set: set, toggleMute: toggleMute, toggleHand: toggleHand, elapsed: elapsed,
    setOwner: setOwner, url: url, isWeb: isWeb, refresh: render, fmt: fmt, KEY: KEY };
})();
