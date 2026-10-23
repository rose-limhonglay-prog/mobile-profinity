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
    ".lcm-screen", ".acc-screen", ".wa-screen"
  ].join(", ");
  /* Any screen root not covered above still carries data-screen-label — last resort only. */
  var FALLBACK_HOST_SELECTOR = "[data-screen-label]";

  var TARGETS_KEY = "pf-coach-targets";
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  var QUICK_CHIPS = [
    { icon: "lucide:bar-chart-2", label: "Review my progress", prompt: "Review my progress across the Prosperity Spiral and tell me what to focus on next." },
    { icon: "lucide:list-checks", label: "Plan today's targets", prompt: "Help me plan today's targets so I make progress on my £80k/month clinic goal." },
    { icon: "lucide:megaphone", label: "Marketing tip", prompt: "Give me one marketing action I can take today to get more visibility." },
    { icon: "lucide:tag", label: "Pricing help", prompt: "How should I think about pricing my treatments this month?" }
  ];

  /* ---- Ava's voice (MKT Oct 2026) ----
     Members asked for Ava to sound like Tim: warm, direct, practical, plain
     UK English, one clear next step, and a question back so the chat never
     stalls. Never an em dash, never a hashtag, and she never asks for an
     email address or any contact details (the live bot did, then went quiet).
     AVA_VOICE is the brief the real model integration runs with as its system
     prompt; tidyReply() is the safety net applied to every answer Ava shows,
     so anything a model slips through still reads the way the brief says. */
  var AVA_VOICE_RULES = [
    "You are Ava, the PROfinity coach. You talk the way Dr Tim Pearce talks to the clinicians he mentors: warm, direct, practical, plain UK English, no hype and no lecture.",
    "Keep every answer short. Two to four sentences, one idea at a time, then one clear next step the member can do today.",
    "End with a short question back to the member so the conversation keeps moving. Never go quiet and never wait for information before replying.",
    "Use the member's own numbers, goals and Prosperity Spiral pillars when you have them. Be honest when something is hard.",
    "Never use em dashes or en dashes. Use a full stop or a comma instead.",
    "Never use hashtags, bullet points, headings or emojis. Plain sentences only.",
    "Never ask for the member's email address, phone number or any contact details. You already know who they are.",
    "If you do not know something, say so and point the member to the right place in PROfinity."
  ];
  var AVA_VOICE = AVA_VOICE_RULES.join(" ");

  /* "How Ava talks" card at the top of the thread (MKT Oct 2026): the voice
     brief is visible in the chat itself, collapsed to one line, tap to read
     every rule. Keeps the prompt reviewable without opening the code. */
  function voiceCard() {
    var row = document.createElement("div");
    row.className = "pf-ava-voice";
    row.innerHTML = '<button type="button" class="pf-ava-voice-hd" aria-expanded="false">' +
        '<span class="pf-ava-voice-ic"><iconify-icon icon="lucide:mic-vocal" width="14" height="14"></iconify-icon></span>' +
        '<span class="pf-ava-voice-tx"><b>How Ava talks</b><span>Tim\'s tone. Short, direct, no em dashes, no hashtags, never asks for your details.</span></span>' +
        '<iconify-icon class="pf-ava-voice-chev" icon="lucide:chevron-down" width="16" height="16"></iconify-icon>' +
      '</button>' +
      '<div class="pf-ava-voice-body" hidden><p class="pf-ava-voice-lead">The brief every Ava answer follows:</p><ol>' +
        AVA_VOICE_RULES.map(function (r) { return "<li>" + escHtml(r) + "</li>"; }).join("") +
      '</ol></div>';
    var hd = row.querySelector(".pf-ava-voice-hd"), body = row.querySelector(".pf-ava-voice-body");
    hd.addEventListener("click", function () {
      var open = body.hidden;
      body.hidden = !open;
      row.classList.toggle("open", open);
      hd.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) el.thread.scrollTop = row.offsetTop - 8;
    });
    return row;
  }

  function tidyReply(text) {
    return String(text || "")
      .replace(/\s*[\u2014\u2013]+\s*/g, ", ")      /* em / en dash → comma */
      .replace(/(^|[\s(])#[\w-]+/g, "$1")           /* hashtags */
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\s+([,.!?])/g, "$1")
      .replace(/,\s*([.!?])/g, "$1")
      .trim();
  }

  function replyFor(prompt) {
    var p = (prompt || "").toLowerCase();
    if (/@|e-?mail/.test(p)) {
      return { text: "No need for your email, I already know who you are. Let's just carry on. What's the one thing you want to get moving this week?", outcome: null };
    }
    if (p.indexOf("market") !== -1) {
      return { text: "Visibility is a numbers game, so let's keep it simple. Post three before and after cases this week and reply to every comment within the hour. Consistency beats clever every time. Which treatment do you want to be known for first?", outcome: "Post 3 before and after cases and reply to comments within an hour" };
    }
    if (p.indexOf("sale") !== -1 || p.indexOf("pric") !== -1) {
      return { text: "Pricing is a confidence problem more than a maths problem. Restate the result the patient wants, give them two package options, then ask for the booking. Don't apologise for your prices. Which treatment do you feel least sure about charging properly for?", outcome: "Use a two-option consultation close and ask for the booking" };
    }
    if (p.indexOf("clinical") !== -1) {
      return { text: "The fastest way to sharpen up isn't another course. Book one peer case review this week, present a real case, and write down the one thing you'd do differently. Which case has been bugging you lately?", outcome: "Book a peer case review this week" };
    }
    if (p.indexOf("system") !== -1 || p.indexOf("business") !== -1) {
      return { text: "Pick the task you repeat most often and write a one page SOP for it today. Thirty minutes now saves you hours every month, and it's the first step to a clinic that doesn't need you in every room. What's the job that always lands back on your desk?", outcome: "Write a one page SOP for your most repeated task" };
    }
    if (p.indexOf("target") !== -1) {
      return { text: "Here's a target that actually moves the needle today. Confirm tomorrow's bookings and send one follow up to a patient who's gone quiet. Small, boring, done. Want me to add that to your targets?", outcome: "Confirm bookings and follow up with one lapsed patient" };
    }
    if (p.indexOf("goal") !== -1 || p.indexOf("spiral") !== -1 || p.indexOf("progress") !== -1) {
      return { text: "Your Prosperity Spiral says Marketing is the pillar holding you back right now. Fix that first and the other three tend to follow. Shall I set you one marketing target for this week?", outcome: "Focus this week's effort on Marketing" };
    }
    return { text: "Good question. Here's what I'd do today: pick your single biggest bottleneck and give it thirty focused minutes before anything else. Tell me what's getting in the way most and I'll help you break it down.", outcome: "Give your biggest bottleneck 30 focused minutes" };
  }

  function readTargets() {
    try { return JSON.parse(localStorage.getItem(TARGETS_KEY)) || []; } catch (e) { return []; }
  }
  function addTarget(outcome) {
    var list = readTargets();
    list.push({ text: outcome, addedAt: Date.now() });
    try { localStorage.setItem(TARGETS_KEY, JSON.stringify(list)); } catch (e) {}
  }

  /* ---- Learning notepad (MKT Oct 2026) ----
     Members asked to keep Ava's answers. "Save to notepad" on any answer
     stores the question + answer; the notepad button in Ava's header lists
     them (copy / remove). localStorage only in this prototype — the app
     would persist these per user. */
  var NOTEPAD_KEY = "pf-learning-notepad";
  function readNotes() {
    try { var a = JSON.parse(localStorage.getItem(NOTEPAD_KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function writeNotes(list) {
    try { localStorage.setItem(NOTEPAD_KEY, JSON.stringify(list)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent("pf:notepad-change")); } catch (e) {}
    updateNoteCount();
  }
  function saveNote(q, a) {
    var list = readNotes();
    list.unshift({ id: "n" + Date.now().toString(36), q: q || "", a: a, savedAt: Date.now() });
    writeNotes(list);
  }
  function removeNote(id) { writeNotes(readNotes().filter(function (n) { return n.id !== id; })); }
  function escHtml(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmtDate(ts) {
    try { return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short" }); } catch (e) { return ""; }
  }
  function updateNoteCount() {
    if (!el.noteCount) return;
    var n = readNotes().length;
    el.noteCount.textContent = n;
    el.noteCount.style.display = n ? "" : "none";
  }
  function renderNotepad() {
    var list = readNotes();
    if (!list.length) {
      el.notesList.innerHTML = '<div class="pf-ava-notes-empty"><span class="ic"><iconify-icon icon="lucide:notebook-pen" width="24" height="24" style="color:var(--ai-purple)"></iconify-icon></span>' +
        '<b>Your notepad is empty</b><p>Tap “Save to notepad” under any of Ava’s answers to keep it here for later.</p></div>';
      return;
    }
    el.notesList.innerHTML = list.map(function (n) {
      return '<article class="pf-ava-note" data-id="' + n.id + '">' +
        (n.q ? '<p class="pf-ava-note-q"><iconify-icon icon="lucide:message-circle-question" width="14" height="14"></iconify-icon>' + escHtml(n.q) + '</p>' : '') +
        '<p class="pf-ava-note-a">' + escHtml(n.a) + '</p>' +
        '<div class="pf-ava-note-foot"><span>Saved ' + fmtDate(n.savedAt) + '</span>' +
          '<button type="button" class="pf-ava-note-btn" data-act="copy"><iconify-icon icon="lucide:copy" width="14" height="14"></iconify-icon>Copy</button>' +
          '<button type="button" class="pf-ava-note-btn" data-act="del" aria-label="Remove note"><iconify-icon icon="lucide:trash-2" width="14" height="14"></iconify-icon>Remove</button>' +
        '</div></article>';
    }).join("");
  }
  function openNotepad() {
    renderNotepad();
    el.notes.classList.add("open");
    el.notes.setAttribute("aria-hidden", "false");
  }
  function closeNotepad() {
    el.notes.classList.remove("open");
    el.notes.setAttribute("aria-hidden", "true");
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
          '<header class="pf-ava-head">' +
            '<span class="pf-ava-head-glow pf-ava-head-glow-a" aria-hidden="true"></span>' +
            '<span class="pf-ava-head-glow pf-ava-head-glow-b" aria-hidden="true"></span>' +
            '<span class="pf-ava-handle" aria-hidden="true"></span>' +
            '<div class="pf-ava-head-row">' +
              '<span class="pf-ava-head-orb">' +
                '<span class="pf-ava-head-halo" aria-hidden="true"></span>' +
                '<iconify-icon icon="lucide:sparkles" width="22" height="22" style="color:#fff"></iconify-icon>' +
              '</span>' +
              '<span class="pf-ava-head-main">' +
                '<span class="pf-ava-head-title"><b>Ava</b><em class="pf-ava-head-badge">AI coach</em></span>' +
                '<span class="pf-ava-head-status"><i aria-hidden="true"></i>Online</span>' +
              '</span>' +
              '<button type="button" class="pf-ava-notebtn pf-ava-voicebtn" id="pf-ava-voicebtn" aria-label="How Ava talks" title="How Ava talks">' +
                '<iconify-icon icon="lucide:info" width="20" height="20" style="color:#fff"></iconify-icon>' +
              '</button>' +
              '<button type="button" class="pf-ava-notebtn" id="pf-ava-notebtn" aria-label="Open my learning notepad" title="My learning notepad">' +
                '<iconify-icon icon="lucide:notebook-pen" width="19" height="19" style="color:#fff"></iconify-icon>' +
                '<span class="pf-ava-notecount" id="pf-ava-notecount"></span>' +
              '</button>' +
              '<button type="button" class="pf-ava-close" id="pf-ava-close" aria-label="Close Ava">' +
                '<iconify-icon icon="lucide:x" width="20" height="20" style="color:#fff"></iconify-icon>' +
              '</button>' +
            '</div>' +
          '</header>' +
          '<div class="pf-ava-thread" id="pf-ava-thread"></div>' +
          '<section class="pf-ava-notes" id="pf-ava-notes" aria-hidden="true" aria-label="My learning notepad">' +
            '<div class="pf-ava-notes-hd">' +
              '<button type="button" class="pf-ava-notes-back" id="pf-ava-notes-back"><iconify-icon icon="lucide:chevron-left" width="20" height="20"></iconify-icon>Back to chat</button>' +
              '<span class="pf-ava-notes-ti"><iconify-icon icon="lucide:notebook-pen" width="16" height="16" style="color:var(--ai-purple)"></iconify-icon>My learning notepad</span>' +
            '</div>' +
            '<div class="pf-ava-notes-list" id="pf-ava-notes-list"></div>' +
          '</section>' +
          '<div class="pf-ava-footer">' +
            '<div class="pf-ava-chips-label"><iconify-icon icon="lucide:sparkles" width="12" height="12" style="color:var(--ai-purple)"></iconify-icon><span>Quick actions</span></div>' +
            '<div class="pf-ava-chips" id="pf-ava-chips"></div>' +
            '<div class="pf-ava-inputrow">' +
              '<div class="pf-ava-composer">' +
                '<input type="text" id="pf-ava-input" class="pf-ava-input" placeholder="Ask Ava anything…" aria-label="Message Ava" />' +
                '<button type="button" class="pf-ava-send" id="pf-ava-send" aria-label="Send message">' +
                  '<iconify-icon icon="lucide:arrow-up" width="19" height="19" style="color:#fff"></iconify-icon>' +
                '</button>' +
              '</div>' +
            '</div>' +
            '<p class="pf-ava-disclaimer">AI can make mistakes. Verify important outputs.</p>' +
          '</div>' +
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
    el.notes = root.querySelector("#pf-ava-notes");
    el.notesList = root.querySelector("#pf-ava-notes-list");
    el.noteCount = root.querySelector("#pf-ava-notecount");
    root.querySelector("#pf-ava-notebtn").addEventListener("click", function () {
      if (el.notes.classList.contains("open")) closeNotepad(); else openNotepad();
    });
    root.querySelector("#pf-ava-notes-back").addEventListener("click", closeNotepad);
    /* header (i): jump to the "How Ava talks" card and open it (user, 2026-10-22
       couldn't find it once the thread had scrolled) */
    root.querySelector("#pf-ava-voicebtn").addEventListener("click", function () {
      closeNotepad();
      var card = el.thread.querySelector(".pf-ava-voice");
      if (!card) return;
      if (!card.classList.contains("open")) card.querySelector(".pf-ava-voice-hd").click();
      el.thread.scrollTop = 0;
      card.classList.add("flash");
      setTimeout(function () { card.classList.remove("flash"); }, 1200);
    });
    el.notesList.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest(".pf-ava-note-btn");
      if (!btn) return;
      var card = btn.closest(".pf-ava-note");
      var id = card && card.getAttribute("data-id");
      if (btn.getAttribute("data-act") === "del") { removeNote(id); renderNotepad(); return; }
      var note = readNotes().filter(function (n) { return n.id === id; })[0];
      if (!note) return;
      var done = function () { btn.innerHTML = '<iconify-icon icon="lucide:check" width="14" height="14"></iconify-icon>Copied'; };
      try { navigator.clipboard.writeText(note.a).then(done, done); } catch (err) { done(); }
    });
    updateNoteCount();

    QUICK_CHIPS.forEach(function (c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pf-ava-chip";
      btn.innerHTML = '<span class="pf-ava-chip-ic"><iconify-icon icon="' + c.icon + '" width="16" height="16" style="color:var(--ai-purple)"></iconify-icon></span><span>' + c.label + '</span>';
      btn.addEventListener("click", function () { sendMessage(c.prompt); });
      el.chips.appendChild(btn);
    });

    el.thread.appendChild(voiceCard());
    addBubble("ava", "Hi Katy, I'm Ava. Ask me anything about your goal, your targets or what to do next, or tap a quick action below.", false);

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
    /* .lm-screen (mobile My Learning) used to be forced open too; it now
       starts minimised and behaves like every other mobile screen. */
    return !!(host && host.classList && host.classList.contains("wa-screen"));
  }

  function avatarNode() {
    var av = document.createElement("span");
    av.className = "pf-ava-avatar";
    av.setAttribute("aria-hidden", "true");
    av.innerHTML = '<iconify-icon icon="lucide:sparkles" width="14" height="14" style="color:#fff"></iconify-icon>';
    return av;
  }

  function addBubble(who, text, withActions, question) {
    var row = document.createElement("div");
    row.className = "pf-ava-bubblerow " + (who === "user" ? "me" : "ava");
    var col = row;
    if (who !== "user") {
      row.appendChild(avatarNode());
      col = document.createElement("div");
      col.className = "pf-ava-msg";
      row.appendChild(col);
    }
    var bubble = document.createElement("div");
    bubble.className = "pf-ava-bubble";
    if (who !== "user") text = tidyReply(text);
    bubble.textContent = text;
    col.appendChild(bubble);
    if (withActions) {
      var actions = document.createElement("div");
      actions.className = "pf-ava-bubble-actions";
      var addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "pf-ava-addtarget";
      addBtn.innerHTML = '<span class="pf-ava-addtarget-ic"><iconify-icon icon="lucide:plus" width="14" height="14" style="color:#fff"></iconify-icon></span><span>Add to my targets</span>';
      addBtn.addEventListener("click", function () {
        addTarget(withActions);
        addBtn.disabled = true;
        addBtn.classList.add("added");
        addBtn.innerHTML = '<span class="pf-ava-addtarget-ic"><iconify-icon icon="lucide:check" width="14" height="14" style="color:#fff"></iconify-icon></span><span>Added to targets</span>';
      });
      actions.appendChild(addBtn);
      var noteBtn = document.createElement("button");
      noteBtn.type = "button";
      noteBtn.className = "pf-ava-savenote";
      noteBtn.innerHTML = '<iconify-icon icon="lucide:notebook-pen" width="15" height="15"></iconify-icon><span>Save to notepad</span>';
      noteBtn.addEventListener("click", function () {
        saveNote(question, text);
        noteBtn.disabled = true;
        noteBtn.classList.add("saved");
        noteBtn.innerHTML = '<iconify-icon icon="lucide:check" width="15" height="15"></iconify-icon><span>Saved to notepad</span>';
      });
      actions.appendChild(noteBtn);
      col.appendChild(actions);
    }
    el.thread.appendChild(row);
    el.thread.scrollTop = el.thread.scrollHeight;
  }

  /* "Ava is typing…" placeholder shown while her reply is pending */
  function showTyping() {
    hideTyping();
    var row = document.createElement("div");
    row.className = "pf-ava-bubblerow ava pf-ava-typing-row";
    row.id = "pf-ava-typing";
    row.setAttribute("aria-label", "Ava is typing");
    row.appendChild(avatarNode());
    var col = document.createElement("div");
    col.className = "pf-ava-msg";
    col.innerHTML = '<div class="pf-ava-bubble pf-ava-typing"><i></i><i></i><i></i></div>';
    row.appendChild(col);
    el.thread.appendChild(row);
    el.thread.scrollTop = el.thread.scrollHeight;
  }
  function hideTyping() {
    var t = el.thread && el.thread.querySelector("#pf-ava-typing");
    if (t) t.parentNode.removeChild(t);
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    build();
    ensureMounted();
    if (!state.open) openSheet();
    addBubble("user", text.trim(), false);
    el.input.value = "";
    var reply = replyFor(text);
    if (!reduceMotion) showTyping();
    setTimeout(function () {
      hideTyping();
      addBubble("ava", reply.text, reply.outcome, text.trim());
    }, reduceMotion ? 300 : 900);
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
    close: closeSheet,
    voice: AVA_VOICE, tidy: tidyReply,
    notepad: { open: function () { openSheet(); openNotepad(); }, list: readNotes }
  };

  /* ?ava=<prompt> deep link — screens where Ava isn't mounted (Profile's
     "Why Ava asks" / "Ask Ava" CTAs) redirect to My Learning with the
     question in the URL. Open the quick chat once the host screen exists,
     send the prompt (bare ?ava=1 just opens the sheet) and drop the param so
     a refresh doesn't replay it. */
  (function () {
    var prompt = null;
    try { prompt = new URLSearchParams(window.location.search).get("ava"); } catch (e) {}
    if (prompt == null) return;
    try {
      var u = new URL(window.location.href);
      u.searchParams.delete("ava");
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch (e) {}
    var tries = 0;
    var wait = setInterval(function () {
      tries++;
      if (!ensureMounted() && tries < 120) return;
      clearInterval(wait);
      setTimeout(function () {
        if (prompt && prompt !== "1") sendMessage(prompt); else openSheet();
      }, reduceMotion ? 0 : 450);
    }, 150);
  })();
})();
