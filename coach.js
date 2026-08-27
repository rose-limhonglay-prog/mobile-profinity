/* ===========================================================================
   PROfinity — Ava, the global AI coach (plain JS, no React)
   Loaded on every mobile screen. Builds its own DOM, re-parents itself into
   whichever screen root (.m-screen / .lm-screen / .cm-screen / .pm-screen /
   .ev-screen / …) is currently mounted, and exposes window.PFAva.open(prompt)
   for contextual deep links ([data-coach="…"] triggers anywhere on the page).
   =========================================================================== */
(function () {
  "use strict";

  /* Ava is scoped to the My Learning page only (mobile + desktop) — every
     other screen used to get the floating orb too, which read as an
     always-on nag. Both "My Learning" HTML pages carry that exact phrase
     in <title>, so bail out before building/mounting anything elsewhere. */
  if (!/My Learning/.test(document.title)) return;

  /* Every mobile page's outermost app screen carries one of these classes
     (named ones per spec, plus every other screen root discovered across the
     mobile app) so Ava can mount on literally every screen, not just five.
     .wa-screen marks the true desktop web pages (app.jsx / events-web.jsx /
     agents.jsx / notification-settings-web.jsx) — coach.css pins Ava to the
     real browser viewport there instead of the mobile bottom-sheet behavior. */
  var PRIMARY_HOST_SELECTOR = [
    ".m-screen", ".lm-screen", ".cm-screen", ".pm-screen", ".ev-screen",
    ".ag-screen", ".cd-screen", ".rl-screen", ".sr-screen", ".cp-screen",
    ".ms-screen", ".as-screen", ".ns-screen", ".ds-screen", ".cc-screen",
    ".sc-screen", ".ma-screen", ".mt-screen", ".dm-screen", ".ls-screen",
    ".wa-screen"
  ].join(", ");
  /* Any screen root not covered above still carries data-screen-label — last resort only. */
  var FALLBACK_HOST_SELECTOR = "[data-screen-label]";

  var TARGETS_KEY = "pf-coach-targets";
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  var QUICK_CHIPS = [
    { label: "Review my progress", prompt: "Review my progress across the Prosperity Spiral and tell me what to focus on next." },
    { label: "Plan today's targets", prompt: "Help me plan today's targets so I make progress on my £80k/month clinic goal." },
    { label: "Marketing tip", prompt: "Give me one marketing action I can take today to get more visibility." },
    { label: "Pricing help", prompt: "How should I think about pricing my treatments this month?" }
  ];

  function replyFor(prompt) {
    var p = (prompt || "").toLowerCase();
    if (p.indexOf("market") !== -1) {
      return { text: "Post 3 before/after case studies this week and reply to every comment within the hour — visibility compounds fast when you're consistent.", outcome: "Post 3 case studies and reply to comments within an hour" };
    }
    if (p.indexOf("sale") !== -1 || p.indexOf("pric") !== -1) {
      return { text: "Script your consultation close: restate the outcome the patient wants, offer two package options, then ask for the booking directly.", outcome: "Script and use a two-option consultation close" };
    }
    if (p.indexOf("clinical") !== -1) {
      return { text: "Book one peer case review this week and log the outcome — it's the fastest way to sharpen clinical skills without another course.", outcome: "Book a peer case review this week" };
    }
    if (p.indexOf("system") !== -1 || p.indexOf("business") !== -1) {
      return { text: "Write a one-page SOP for your top recurring task — it's the quickest Business Systems win you can bank today.", outcome: "Write a one-page SOP for your top recurring task" };
    }
    if (p.indexOf("target") !== -1) {
      return { text: "Here's a target that'll move the needle today: confirm tomorrow's bookings and send one follow-up to a lapsed patient.", outcome: "Confirm bookings and follow up with one lapsed patient" };
    }
    if (p.indexOf("goal") !== -1 || p.indexOf("spiral") !== -1 || p.indexOf("progress") !== -1) {
      return { text: "Your Prosperity Spiral shows Marketing as your weakest pillar right now — focus there first and the other three tend to follow.", outcome: "Focus this week's effort on Marketing" };
    }
    return { text: "Good question — here's a focused next step you can act on today: pick your single biggest bottleneck and give it 30 minutes before anything else.", outcome: "Give your biggest bottleneck 30 focused minutes" };
  }

  function readTargets() {
    try { return JSON.parse(localStorage.getItem(TARGETS_KEY)) || []; } catch (e) { return []; }
  }
  function addTarget(outcome) {
    var list = readTargets();
    list.push({ text: outcome, addedAt: Date.now() });
    try { localStorage.setItem(TARGETS_KEY, JSON.stringify(list)); } catch (e) {}
  }

  var el = {};
  var state = { built: false, open: false, expanded: false, collapseTimer: null, lastFocused: null };

  function build() {
    if (state.built) return;
    state.built = true;

    var root = document.createElement("div");
    root.id = "pf-ava-root";
    root.className = "pf-ava-root";

    root.innerHTML =
      '<button type="button" id="pf-ava-tab" class="pf-ava-tab" aria-haspopup="dialog" aria-expanded="false" aria-label="Ask Ava, your AI coach">' +
        '<span class="pf-ava-orb">' +
          '<span class="pf-ava-halo" aria-hidden="true"></span>' +
          '<iconify-icon icon="lucide:sparkles" width="18" height="18" style="color:#6C63FF"></iconify-icon>' +
          '<span class="pf-ava-dot" aria-hidden="true"></span>' +
        '</span>' +
        '<span class="pf-ava-label"><b>Ask Ava</b><span>Your coach</span></span>' +
      '</button>' +
      '<div id="pf-ava-sheet-wrap" class="pf-ava-sheet-wrap">' +
        '<div class="pf-ava-scrim" id="pf-ava-scrim"></div>' +
        '<div class="pf-ava-sheet" role="dialog" aria-modal="true" aria-label="Ava, your AI coach">' +
          '<span class="pf-ava-handle" aria-hidden="true"></span>' +
          '<header class="pf-ava-head">' +
            '<span class="pf-ava-head-orb"><iconify-icon icon="lucide:sparkles" width="20" height="20" style="color:#fff"></iconify-icon></span>' +
            '<span class="pf-ava-head-main"><b>Ava</b><span>Your coach &middot; Online</span></span>' +
            '<button type="button" class="pf-ava-close" id="pf-ava-close" aria-label="Close Ava">' +
              '<iconify-icon icon="lucide:x" width="20" height="20" style="color:#fff"></iconify-icon>' +
            '</button>' +
          '</header>' +
          '<div class="pf-ava-thread" id="pf-ava-thread"></div>' +
          '<div class="pf-ava-chips" id="pf-ava-chips"></div>' +
          '<div class="pf-ava-inputrow">' +
            '<input type="text" id="pf-ava-input" class="pf-ava-input" placeholder="Ask Ava anything…" aria-label="Message Ava" />' +
            '<button type="button" class="pf-ava-send" id="pf-ava-send" aria-label="Send message">' +
              '<iconify-icon icon="lucide:arrow-up" width="19" height="19" style="color:#fff"></iconify-icon>' +
            '</button>' +
          '</div>' +
          '<p class="pf-ava-disclaimer">AI can make mistakes. Verify important outputs.</p>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);

    el.root = root;
    el.tab = root.querySelector("#pf-ava-tab");
    el.sheetWrap = root.querySelector("#pf-ava-sheet-wrap");
    el.sheet = root.querySelector(".pf-ava-sheet");
    el.scrim = root.querySelector("#pf-ava-scrim");
    el.close = root.querySelector("#pf-ava-close");
    el.thread = root.querySelector("#pf-ava-thread");
    el.chips = root.querySelector("#pf-ava-chips");
    el.input = root.querySelector("#pf-ava-input");
    el.send = root.querySelector("#pf-ava-send");

    QUICK_CHIPS.forEach(function (c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pf-ava-chip";
      btn.innerHTML = '<iconify-icon icon="lucide:sparkles" width="14" height="14" style="color:var(--ai-purple)"></iconify-icon><span>' + c.label + '</span>';
      btn.addEventListener("click", function () { sendMessage(c.prompt); });
      el.chips.appendChild(btn);
    });

    addBubble("ava", "Hi Katy — I'm Ava, your AI coach. Ask me anything about your goal, or tap a quick action below.", false);

    el.tab.addEventListener("click", onTabClick);
    el.close.addEventListener("click", closeSheet);
    el.scrim.addEventListener("click", closeSheet);
    el.send.addEventListener("click", submitInput);
    el.input.addEventListener("keydown", function (e) { if (e.key === "Enter") submitInput(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) closeSheet();
    });
  }

  function isCoarsePointer() {
    try { return window.matchMedia("(hover: none), (pointer: coarse)").matches; } catch (e) { return false; }
  }

  function onTabClick() {
    if (isForceExpandedHost() ) { openSheet(); return; }
    if (isCoarsePointer() && !state.expanded) {
      expandTab();
      return;
    }
    openSheet();
  }

  function expandTab() {
    state.expanded = true;
    el.tab.classList.add("expanded");
    clearTimeout(state.collapseTimer);
    state.collapseTimer = setTimeout(collapseTab, 2600);
  }
  function collapseTab() {
    if (isForceExpandedHost()) return;
    state.expanded = false;
    el.tab.classList.remove("expanded");
  }

  function isForceExpandedHost() {
    var host = el.root && el.root.parentElement;
    return !!(host && host.classList && (host.classList.contains("lm-screen") || host.classList.contains("wa-screen")));
  }

  function addBubble(who, text, withActions) {
    var row = document.createElement("div");
    row.className = "pf-ava-bubblerow " + (who === "user" ? "me" : "ava");
    if (who !== "user") {
      var label = document.createElement("div");
      label.className = "pf-ava-bubble-label";
      label.innerHTML = '<iconify-icon icon="lucide:sparkles" width="14" height="14" style="color:var(--ai-purple)"></iconify-icon><b>Ava</b>';
      row.appendChild(label);
    }
    var bubble = document.createElement("div");
    bubble.className = "pf-ava-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);
    if (withActions) {
      var actions = document.createElement("div");
      actions.className = "pf-ava-bubble-actions";
      var addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "pf-ava-addtarget";
      addBtn.innerHTML = '<iconify-icon icon="lucide:plus" width="15" height="15" style="color:var(--brand-navy)"></iconify-icon> Add to my targets';
      addBtn.addEventListener("click", function () {
        addTarget(withActions);
        addBtn.disabled = true;
        addBtn.innerHTML = '<iconify-icon icon="lucide:check" width="15" height="15" style="color:var(--success)"></iconify-icon> Added to targets';
      });
      actions.appendChild(addBtn);
      row.appendChild(actions);
    }
    el.thread.appendChild(row);
    el.thread.scrollTop = el.thread.scrollHeight;
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    build();
    ensureMounted();
    if (!state.open) openSheet();
    addBubble("user", text.trim(), false);
    el.input.value = "";
    var reply = replyFor(text);
    setTimeout(function () {
      addBubble("ava", reply.text, reply.outcome);
    }, 450);
  }

  function submitInput() {
    sendMessage(el.input.value);
  }

  function openSheet() {
    build();
    ensureMounted();
    clearTimeout(state.collapseTimer);
    state.open = true;
    el.sheetWrap.classList.add("open");
    el.tab.setAttribute("aria-expanded", "true");
    state.lastFocused = document.activeElement;
    setTimeout(function () { el.input && el.input.focus(); }, reduceMotion ? 0 : 220);
  }

  function closeSheet() {
    state.open = false;
    el.sheetWrap.classList.remove("open");
    el.tab.setAttribute("aria-expanded", "false");
    if (state.lastFocused && state.lastFocused.focus) { try { state.lastFocused.focus(); } catch (e) {} }
  }

  /* -------------------------------------------------- mounting -------------------------------------------------- */
  function findHost() {
    return document.querySelector(PRIMARY_HOST_SELECTOR) || document.querySelector(FALLBACK_HOST_SELECTOR);
  }

  function ensureMounted() {
    build();
    var host = findHost();
    if (!host) return false;
    host.style.position = "relative";
    if (el.root.parentElement !== host) host.appendChild(el.root);
    return true;
  }

  function attemptMount() {
    if (ensureMounted()) {
      if (pollId) { clearInterval(pollId); pollId = null; }
    }
  }

  var pollId = setInterval(attemptMount, 300);
  var observer = new MutationObserver(function () { attemptMount(); });

  function startObserving() {
    observer.observe(document.body, { childList: true, subtree: true });
    attemptMount();
  }

  if (document.body) startObserving();
  else document.addEventListener("DOMContentLoaded", startObserving);

  /* -------------------------------------------------- contextual deep links ------------------------------------- */
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest && e.target.closest("[data-coach]");
    if (!trigger) return;
    e.preventDefault();
    var prompt = trigger.getAttribute("data-coach") || "Help me with this.";
    sendMessage(prompt);
  });

  window.PFAva = {
    open: function (prompt) { if (prompt) { sendMessage(prompt); } else { openSheet(); } },
    close: closeSheet
  };
})();
