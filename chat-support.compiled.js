/* ===========================================================================
   PROfinity — Chat Support (mobile) · iPhone 17 Pro Max
   Intercom-style support home reached from the sidebar drawer ("My Profile →
   Chat Support") on every mobile page and from Account Settings.
     · Home     — navy bar, teal hero ("Dr Tim" signature, "Hi there 👋 How can
                  we help?"), "Start a conversation" card, latest conversation,
                  quick-help topics and opening hours.
     · Messages — every conversation on this device (open ticket / status),
                  empty state with a "Send us a message" CTA.
     · Thread   — the chat itself: welcome + topic chips that answer with deep
                  links, free text opens a ticket and gets a scripted
                  acknowledgement after a typing indicator.
   Conversations persist in localStorage ("pf-support-chat"; the older single-
   thread shape is migrated). ?view=messages|thread&c=<id> deep-links a view.
   Composed on the bound DS bundle. Suffixed -CS to avoid global-scope clashes.

   Desktop twin: ChatSupportWeb.html loads this same bundle with
   window.PF_CS_WEB = true — the screen renders as an Intercom-style messenger
   card under the DS TopNav instead of inside the phone frame, and the topic
   deep links / back target swap to their web pages (chat-support-web.css
   holds the desktop overrides).
   =========================================================================== */
const {
  useState: useStateCS,
  useEffect: useEffectCS,
  useRef: useRefCS,
  useMemo: useMemoCS
} = React;
const DSCS = window.ProfinityDesignSystem_c2b5cc;
const CS_WEB = !!window.PF_CS_WEB;
function goCS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
/* Own page name (for ?ret= round-trips) and the desktop equivalents of the
   mobile pages the topic replies link to. */
function selfPageCS() {
  return CS_WEB ? "ChatSupportWeb.html" : "ChatSupport.html";
}
const CS_WEB_HREFS = {
  "PaymentsMobile.html": "AccountSettingsWeb.html",
  "InvoicesMobile.html": "AccountSettingsWeb.html",
  "LearningMobile.html": "MyLearning.html",
  "WaysToEarn.html": "RewardsWeb.html",
  "MyRewards.html": "RewardsWeb.html"
};
function hrefCS(href) {
  return CS_WEB ? CS_WEB_HREFS[href] || href : href;
}
const CS_ME = {
  name: "Katy Wilson",
  role: "Registered Nurse",
  avatar: "assets/avatar-katy.jpg"
};
function navigateCS(label) {
  const u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goCS(u);
}

/* Back goes to ?ret= when given, else the same-origin page that opened us
   (any drawer can open this page), else the newsfeed. */
function backTargetCS() {
  try {
    const r = new URLSearchParams(window.location.search).get("ret");
    if (r) return r;
  } catch (e) {}
  try {
    const ref = document.referrer;
    if (ref) {
      const u = new URL(ref);
      if (u.origin === window.location.origin && !/ChatSupport/.test(u.pathname)) return u.pathname.split("/").pop() + u.search;
    }
  } catch (e) {}
  return CS_WEB ? "NewsfeedWeb.html" : "NewsfeedMobile.html";
}
function queryCS(k) {
  try {
    return new URLSearchParams(window.location.search).get(k);
  } catch (e) {
    return null;
  }
}
function useDeviceScaleCS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateCS(calc);
  useEffectCS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileCS() {
  const [mobile, setMobile] = useStateCS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectCS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

/* ---- data ---------------------------------------------------------------- */
const CS_KEY = "pf-support-chat";
const CS_USER = "Katy";
const CS_AGENT = {
  name: "PROfinity Support",
  status: "Online · replies in a few minutes"
};
const CS_TOPICS = [{
  id: "billing",
  label: "Billing & payments",
  sub: "Invoices, cards and your plan",
  icon: "lucide:credit-card",
  reply: "Happy to help with billing. Your plan, saved cards and invoices all live under Payments — or tell me what looks wrong and I'll take a look.",
  links: [{
    label: "Open Payments",
    href: "PaymentsMobile.html"
  }, {
    label: "View invoices",
    href: "InvoicesMobile.html"
  }]
}, {
  id: "membership",
  label: "My membership",
  sub: "Upgrades, what's included, pausing",
  icon: "lucide:gem",
  reply: "Of course. Is it about upgrading, what's included in your tier, or pausing? Here's the tier overview while you tell me more.",
  links: [{
    label: "Membership tiers",
    href: "MembershipTier.html"
  }]
}, {
  id: "courses",
  label: "Courses & lessons",
  sub: "Access, progress and certificates",
  icon: "lucide:graduation-cap",
  reply: "Got it. Is a lesson not loading, or is a course missing from My Learning? Send me the course name and I'll check your access.",
  links: [{
    label: "Go to My Learning",
    href: "LearningMobile.html"
  }]
}, {
  id: "rewards",
  label: "Points & rewards",
  sub: "Missing points, vouchers, badges",
  icon: "lucide:gift",
  reply: "Points normally land within a minute of an action. If something's missing, tell me what you did and roughly when — I'll check the ledger.",
  links: [{
    label: "Ways to earn",
    href: "WaysToEarn.html"
  }, {
    label: "My rewards",
    href: "MyRewards.html"
  }]
}, {
  id: "technical",
  label: "Technical issue",
  sub: "Something isn't working",
  icon: "lucide:wrench",
  reply: "Sorry about that. What were you doing when it happened, and are you on the app or the web? A screenshot helps a lot too.",
  links: []
}, {
  id: "other",
  label: "Something else",
  sub: "Anything we haven't covered",
  icon: "lucide:message-circle",
  reply: "No problem — tell me a little more and I'll point you in the right direction.",
  links: []
}];
const CS_ACKS = ["Thanks, {name}. I've logged this as ticket #{ticket} and a team member will pick it up shortly — you'll get a notification the moment they reply.", "Noted — I've added that to ticket #{ticket}. Anything else you can tell me while the team takes a look?", "Got it, thanks. That's on the ticket too. We'll reply here as soon as we have an answer.", "Thanks for the extra detail, {name}. The team has everything they need for now — hang tight."];
const CS_WELCOME = "Hi " + CS_USER + " 👋 Welcome to PROfinity Support. Pick a topic below or just type your question — a real person picks up from here.";
function newConvCS(chips) {
  const now = Date.now();
  return {
    id: "c" + now,
    ticket: null,
    acks: 0,
    updatedAt: now,
    messages: [{
      id: "w" + now,
      from: "support",
      text: CS_WELCOME,
      ts: now,
      chips: chips !== false
    }]
  };
}
function readStoreCS() {
  try {
    const raw = localStorage.getItem(CS_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.conversations)) return s;
      /* pre-Messages shape: one bare thread */
      if (s && Array.isArray(s.messages) && s.messages.length) {
        const last = s.messages[s.messages.length - 1];
        return {
          conversations: [{
            id: "c-legacy",
            ticket: s.ticket || null,
            acks: s.acks || 0,
            messages: s.messages,
            updatedAt: last.ts || Date.now()
          }]
        };
      }
    }
  } catch (e) {}
  return {
    conversations: []
  };
}
function saveStoreCS(s) {
  try {
    localStorage.setItem(CS_KEY, JSON.stringify(s));
  } catch (e) {}
}
function newTicketCS() {
  return "PF-" + (4000 + Math.floor(Math.random() * 900));
}
function fmtClockCS(ts) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + (m < 10 ? "0" : "") + m + " " + ap;
}
function fmtDayCS(ts) {
  const d = new Date(ts),
    now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short"
  });
}
function fmtListTimeCS(ts) {
  return fmtDayCS(ts) === "Today" ? fmtClockCS(ts) : fmtDayCS(ts);
}
function previewCS(c) {
  const last = c.messages[c.messages.length - 1];
  if (!last) return "";
  return (last.from === "me" ? "You: " : "") + last.text.replace(/\s+/g, " ");
}

/* ---- small shared bits ------------------------------------------------- */
function CSSheet({
  open,
  onClose,
  title,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "cs-sheet-wrap",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "cs-sheet"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-sheet-handle"
  }), title && /*#__PURE__*/React.createElement("h3", {
    className: "cs-sheet-ttl"
  }, title), children));
}
function useCSToast() {
  const [toast, setToast] = useStateCS(null);
  const timer = useRefCS(null);
  function show(msg) {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }
  useEffectCS(() => () => clearTimeout(timer.current), []);
  return [toast, show];
}

/* Support avatar: teal disc + headset, green presence dot. `light` flips it
   to a white disc for use on the navy bar. */
function CSAgentFace({
  size = 40,
  dot = true,
  light = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "cs-agent" + (light ? " light" : ""),
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:headset",
    size: Math.round(size * 0.52),
    color: light ? "#2F5F6E" : "#fff"
  }), dot && /*#__PURE__*/React.createElement("span", {
    className: "cs-online"
  }));
}

/* Navy top bar shared by every view */
function CSBar({
  onBack,
  title,
  children,
  trailing
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "cs-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cs-bar-btn",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 28,
    color: "#fff"
  })), children || /*#__PURE__*/React.createElement("h1", {
    className: "cs-bar-title"
  }, title), trailing || /*#__PURE__*/React.createElement("span", {
    className: "cs-bar-spacer"
  }));
}
function CSTabs({
  view,
  onChange,
  unread
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "cs-tabs",
    "aria-label": "Chat Support sections"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-tab" + (view === "home" ? " on" : ""),
    onClick: () => onChange("home"),
    "aria-current": view === "home" ? "page" : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-tab-ic"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: view === "home" ? "fluent:home-16-filled" : "lucide:home",
    size: 26,
    color: view === "home" ? "#2F5F6E" : "var(--gray-500)"
  })), /*#__PURE__*/React.createElement("span", null, "Home")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-tab" + (view === "messages" ? " on" : ""),
    onClick: () => onChange("messages"),
    "aria-current": view === "messages" ? "page" : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-tab-ic"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: view === "messages" ? "fluent:chat-16-filled" : "lucide:message-square-text",
    size: 26,
    color: view === "messages" ? "#2F5F6E" : "var(--gray-500)"
  }), unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "cs-tab-badge"
  }, unread)), /*#__PURE__*/React.createElement("span", null, "Messages")));
}

/* ---- Home --------------------------------------------------------------- */
function CSHome({
  convs,
  onStart,
  onOpen,
  onBack
}) {
  const latest = convs[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "cs-view"
  }, /*#__PURE__*/React.createElement(CSBar, {
    onBack: onBack,
    title: "Chat Support"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cs-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "cs-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-hero-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-sig",
    "aria-label": "Dr Tim"
  }, "Dr Tim"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-x",
    "aria-label": "Close",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "cs-hello"
  }, "Hi there ", /*#__PURE__*/React.createElement("span", {
    className: "cs-wave",
    "aria-hidden": "true"
  }, "👋"), /*#__PURE__*/React.createElement("br", null), "How can we help?"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-start",
    onClick: () => onStart()
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-start-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-start-label"
  }, "Start a conversation"), /*#__PURE__*/React.createElement("span", {
    className: "cs-start-sub"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-dot"
  }), CS_AGENT.status)), /*#__PURE__*/React.createElement("span", {
    className: "cs-start-ic"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:send",
    size: 20,
    color: "#fff"
  }))), latest && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-recent",
    onClick: () => onOpen(latest.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-recent-eyebrow"
  }, "Your latest conversation"), /*#__PURE__*/React.createElement("span", {
    className: "cs-recent-row"
  }, /*#__PURE__*/React.createElement(CSAgentFace, {
    size: 44
  }), /*#__PURE__*/React.createElement("span", {
    className: "cs-recent-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-recent-top"
  }, /*#__PURE__*/React.createElement("b", null, CS_AGENT.name), /*#__PURE__*/React.createElement("span", {
    className: "cs-recent-time"
  }, fmtListTimeCS(latest.updatedAt))), /*#__PURE__*/React.createElement("span", {
    className: "cs-recent-preview"
  }, previewCS(latest))), /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })), latest.ticket && /*#__PURE__*/React.createElement("span", {
    className: "cs-pill open"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:ticket",
    size: 13,
    color: "#2F5F6E"
  }), "Ticket #", latest.ticket, " · Open"))), /*#__PURE__*/React.createElement("section", {
    className: "cs-home-body"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "cs-h"
  }, "Quick help"), /*#__PURE__*/React.createElement("div", {
    className: "cs-card cs-topics"
  }, CS_TOPICS.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t.id,
    className: "cs-topic",
    onClick: () => onStart(t)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-topic-ic"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: t.icon,
    size: 20,
    color: "#2F5F6E"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cs-topic-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-topic-label"
  }, t.label), /*#__PURE__*/React.createElement("span", {
    className: "cs-topic-sub"
  }, t.sub)), /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "cs-card cs-hours-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-hours-ic"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:clock",
    size: 20,
    color: "#2F5F6E"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cs-hours-main"
  }, /*#__PURE__*/React.createElement("b", null, "Our team is online Mon–Fri, 9am–6pm UK time"), /*#__PURE__*/React.createElement("span", null, "Outside those hours, leave a message and we'll reply first thing."))))));
}

/* ---- Messages ------------------------------------------------------------- */
function CSMessages({
  convs,
  onStart,
  onOpen,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cs-view"
  }, /*#__PURE__*/React.createElement(CSBar, {
    onBack: onBack,
    title: "Messages"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cs-scroll cs-scroll-msgs"
  }, convs.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "cs-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-empty-ic"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:message-square-text",
    size: 40,
    color: "#2F5F6E"
  })), /*#__PURE__*/React.createElement("h3", null, "No messages yet"), /*#__PURE__*/React.createElement("p", null, "Questions about your membership, courses or points? We're a message away.")) : /*#__PURE__*/React.createElement("div", {
    className: "cs-convs"
  }, convs.map(c => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: c.id,
    className: "cs-conv",
    onClick: () => onOpen(c.id)
  }, /*#__PURE__*/React.createElement(CSAgentFace, {
    size: 52
  }), /*#__PURE__*/React.createElement("span", {
    className: "cs-conv-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-conv-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-conv-name"
  }, CS_AGENT.name), /*#__PURE__*/React.createElement("span", {
    className: "cs-conv-time"
  }, fmtListTimeCS(c.updatedAt))), /*#__PURE__*/React.createElement("span", {
    className: "cs-conv-preview"
  }, previewCS(c)), c.ticket ? /*#__PURE__*/React.createElement("span", {
    className: "cs-pill open"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:ticket",
    size: 13,
    color: "#2F5F6E"
  }), "#", c.ticket, " · Open") : /*#__PURE__*/React.createElement("span", {
    className: "cs-pill"
  }, "Getting started")))))), /*#__PURE__*/React.createElement("div", {
    className: "cs-fab-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-fab",
    onClick: () => onStart()
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:send",
    size: 18,
    color: "#fff"
  }), "Send us a message")));
}

/* ---- Thread ------------------------------------------------------------- */
function CSMessage({
  m,
  showFace,
  showTime,
  threadId
}) {
  const mine = m.from === "me";
  return /*#__PURE__*/React.createElement("div", {
    className: "cs-msg" + (mine ? " me" : "") + (showFace ? " first" : "")
  }, !mine && /*#__PURE__*/React.createElement("span", {
    className: "cs-msg-av"
  }, showFace ? /*#__PURE__*/React.createElement(CSAgentFace, {
    size: 28,
    dot: false
  }) : null), /*#__PURE__*/React.createElement("div", {
    className: "cs-msg-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-bubble" + (mine ? " me" : "")
  }, m.text), m.links && m.links.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cs-links"
  }, m.links.map(l => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: l.href,
    className: "cs-link",
    onClick: () => {
      const h = hrefCS(l.href);
      goCS(h + (h.indexOf("?") === -1 ? "?" : "&") + "ret=" + encodeURIComponent(selfPageCS() + "?view=thread&c=" + threadId));
    }
  }, /*#__PURE__*/React.createElement("span", null, l.label), /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 15,
    color: "#2F5F6E"
  })))), showTime && /*#__PURE__*/React.createElement("span", {
    className: "cs-msg-time"
  }, fmtClockCS(m.ts))));
}
function CSTyping() {
  return /*#__PURE__*/React.createElement("div", {
    className: "cs-msg first",
    "aria-label": CS_AGENT.name + " is typing"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-msg-av"
  }, /*#__PURE__*/React.createElement(CSAgentFace, {
    size: 28,
    dot: false
  })), /*#__PURE__*/React.createElement("div", {
    className: "cs-msg-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-bubble cs-typing"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null))));
}
function CSChips({
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cs-chips",
    role: "group",
    "aria-label": "Choose a topic"
  }, CS_TOPICS.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t.id,
    className: "cs-chip",
    onClick: () => onPick(t)
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: t.icon,
    size: 16,
    color: "#2F5F6E"
  }), /*#__PURE__*/React.createElement("span", null, t.label))));
}
function CSThread({
  conv,
  onChange,
  onBack,
  initialTopic,
  showToast
}) {
  const [draft, setDraft] = useStateCS("");
  const [typing, setTyping] = useStateCS(false);
  const [menuOpen, setMenuOpen] = useStateCS(false);
  const bodyRef = useRefCS(null);
  const inputRef = useRefCS(null);
  const timers = useRefCS([]);
  const started = useRefCS(false);
  useEffectCS(() => () => timers.current.forEach(clearTimeout), []);

  /* keep the newest message in view */
  useEffectCS(() => {
    const el = bodyRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [conv.messages.length, typing]);
  const msgs = conv.messages;
  const last = msgs[msgs.length - 1];
  const showChips = !typing && last && last.from === "support" && last.chips;
  function later(fn, ms) {
    timers.current.push(setTimeout(fn, ms));
  }
  function retireChips(c) {
    return {
      ...c,
      messages: c.messages.map(m => m.chips ? {
        ...m,
        chips: false
      } : m)
    };
  }
  function replyWith(build, delay) {
    setTyping(true);
    later(() => {
      setTyping(false);
      onChange(c => {
        const built = build(c);
        return {
          ...c,
          ...built.patch,
          messages: [...c.messages, {
            id: "s" + Date.now(),
            from: "support",
            ts: Date.now(),
            ...built.msg
          }]
        };
      });
    }, delay);
  }
  function pickTopic(t) {
    onChange(c => ({
      ...retireChips(c),
      messages: [...retireChips(c).messages, {
        id: "m" + Date.now(),
        from: "me",
        text: t.label,
        ts: Date.now()
      }]
    }));
    replyWith(() => ({
      patch: {},
      msg: {
        text: t.reply,
        links: t.links
      }
    }), 1100 + Math.random() * 500);
  }
  /* a Quick-help row on Home lands here with the topic pre-chosen */
  useEffectCS(() => {
    if (initialTopic && !started.current) {
      started.current = true;
      pickTopic(initialTopic);
    }
  }, []);
  function send() {
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    onChange(c => ({
      ...retireChips(c),
      messages: [...retireChips(c).messages, {
        id: "m" + Date.now(),
        from: "me",
        text,
        ts: Date.now()
      }]
    }));
    replyWith(c => {
      const ticket = c.ticket || newTicketCS();
      const ack = CS_ACKS[Math.min(c.acks, CS_ACKS.length - 1)].replace("{name}", CS_USER).replace("{ticket}", ticket);
      return {
        patch: {
          ticket,
          acks: c.acks + 1
        },
        msg: {
          text: ack
        }
      };
    }, 1400 + Math.random() * 600);
    if (inputRef.current) inputRef.current.focus();
  }
  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
  function emailTranscript() {
    setMenuOpen(false);
    showToast("Transcript sent to your email");
  }
  const canSend = draft.trim().length > 0 && !typing;
  return /*#__PURE__*/React.createElement("div", {
    className: "cs-view cs-thread"
  }, /*#__PURE__*/React.createElement(CSBar, {
    onBack: onBack,
    trailing: /*#__PURE__*/React.createElement("button", {
      className: "cs-bar-btn",
      "aria-label": "Conversation options",
      onClick: () => setMenuOpen(true)
    }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
      name: "lucide:more-horizontal",
      size: 24,
      color: "#fff"
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-bar-id"
  }, /*#__PURE__*/React.createElement(CSAgentFace, {
    size: 38,
    light: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "cs-bar-idtext"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "cs-bar-name"
  }, CS_AGENT.name), /*#__PURE__*/React.createElement("span", {
    className: "cs-bar-status"
  }, CS_AGENT.status)))), conv.ticket && /*#__PURE__*/React.createElement("div", {
    className: "cs-ticket",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:ticket",
    size: 16,
    color: "#2F5F6E"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Ticket #", conv.ticket), " is open — we'll reply here and by email.")), /*#__PURE__*/React.createElement("div", {
    className: "cs-body",
    ref: bodyRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-daychip"
  }, /*#__PURE__*/React.createElement("span", null, fmtDayCS(msgs[0].ts))), msgs.map((m, i) => {
    const prev = msgs[i - 1],
      next = msgs[i + 1];
    const showFace = m.from !== "me" && (!prev || prev.from !== m.from);
    const showTime = !next || next.from !== m.from || next.ts - m.ts > 3 * 60 * 1000;
    return /*#__PURE__*/React.createElement(CSMessage, {
      key: m.id,
      m: m,
      showFace: showFace,
      showTime: showTime,
      threadId: conv.id
    });
  }), typing && /*#__PURE__*/React.createElement(CSTyping, null), showChips && /*#__PURE__*/React.createElement(CSChips, {
    onPick: pickTopic
  })), /*#__PURE__*/React.createElement("div", {
    className: "cs-composer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-attach",
    "aria-label": "Attach a screenshot",
    onClick: () => showToast("Screenshots can be attached in the live app")
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:paperclip",
    size: 22,
    color: "var(--gray-600)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cs-field"
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: onKey,
    placeholder: "Type your message…",
    "aria-label": "Message",
    autoComplete: "off"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-send" + (canSend ? " on" : ""),
    "aria-label": "Send",
    disabled: !canSend,
    onClick: send
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:send",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cs-safe"
  }), /*#__PURE__*/React.createElement(CSSheet, {
    open: menuOpen,
    onClose: () => setMenuOpen(false),
    title: "Conversation"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-opt",
    onClick: emailTranscript
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-opt-ic"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:mail",
    size: 20,
    color: "#2F5F6E"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cs-opt-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-opt-label"
  }, "Email me this transcript"), /*#__PURE__*/React.createElement("span", {
    className: "cs-opt-sub"
  }, "A copy of the whole conversation"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-opt",
    onClick: () => {
      setMenuOpen(false);
      onBack("messages");
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-opt-ic"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:message-square-text",
    size: 20,
    color: "#2F5F6E"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cs-opt-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-opt-label"
  }, "All conversations"), /*#__PURE__*/React.createElement("span", {
    className: "cs-opt-sub"
  }, "Open the Messages tab"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cs-opt cs-opt-cancel",
    onClick: () => setMenuOpen(false)
  }, "Cancel")));
}

/* ---- screen ----------------------------------------------------------------- */
function ChatSupportScreen() {
  const [store, setStore] = useStateCS(readStoreCS);
  const [view, setView] = useStateCS(() => {
    const v = queryCS("view");
    return v === "messages" || v === "thread" ? v : "home";
  });
  const [activeId, setActiveId] = useStateCS(() => queryCS("c"));
  const [pendingTopic, setPendingTopic] = useStateCS(null);
  const [toast, showToast] = useCSToast();
  useEffectCS(() => saveStoreCS(store), [store]);
  const convs = useMemoCS(() => [...store.conversations].sort((a, b) => b.updatedAt - a.updatedAt), [store]);
  const active = convs.find(c => c.id === activeId) || null;
  const unread = convs.filter(c => c.ticket).length;

  /* ?view=thread with an unknown id falls back to the newest conversation */
  useEffectCS(() => {
    if (view === "thread" && !active) {
      if (convs.length) setActiveId(convs[0].id);else setView("home");
    }
  }, [view, active, convs.length]);
  function start(topic) {
    const c = newConvCS(!topic);
    setStore(s => ({
      ...s,
      conversations: [...s.conversations, c]
    }));
    setActiveId(c.id);
    setPendingTopic(topic || null);
    setView("thread");
  }
  function open(id) {
    setActiveId(id);
    setPendingTopic(null);
    setView("thread");
  }
  function changeConv(id, fn) {
    setStore(s => ({
      ...s,
      conversations: s.conversations.map(c => c.id === id ? {
        ...fn(c),
        updatedAt: Date.now()
      } : c)
    }));
  }
  const [lastTab, setLastTab] = useStateCS("home");
  function switchTab(t) {
    setLastTab(t);
    setView(t);
  }
  function leaveThread(to) {
    setPendingTopic(null);
    setView(to === "messages" || to === "home" ? to : lastTab);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cs-screen",
    "data-screen-label": "Chat Support (mobile) · " + view
  }, view === "home" && /*#__PURE__*/React.createElement(CSHome, {
    convs: convs,
    onStart: start,
    onOpen: open,
    onBack: () => goCS(backTargetCS())
  }), view === "messages" && /*#__PURE__*/React.createElement(CSMessages, {
    convs: convs,
    onStart: start,
    onOpen: open,
    onBack: () => switchTab("home")
  }), view === "thread" && active && /*#__PURE__*/React.createElement(CSThread, {
    key: active.id,
    conv: active,
    onChange: fn => changeConv(active.id, fn),
    onBack: leaveThread,
    initialTopic: pendingTopic,
    showToast: showToast
  }), view !== "thread" && /*#__PURE__*/React.createElement(CSTabs, {
    view: view,
    onChange: switchTab,
    unread: unread
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "cs-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "#fff"
  }), toast));
}
function ChatSupportApp() {
  const mobile = useIsMobileCS();
  const scale = useDeviceScaleCS();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (CS_WEB) {
    /* Desktop: DS TopNav, then the same screen as a fixed-size messenger card
       (Intercom's desktop launcher panel) with a short intro column beside it. */
    return /*#__PURE__*/React.createElement("div", {
      className: "app wa-screen cs-web",
      style: vars
    }, /*#__PURE__*/React.createElement(DSCS.TopNav, {
      active: "Support",
      user: CS_ME,
      logoSrc: "assets/profinity-icon-purple-gold.png",
      onNavigate: navigateCS,
      style: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-default)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "cs-web-page",
      "data-screen-label": "Chat Support (web)"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "cs-web-intro"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cs-web-back",
      onClick: () => goCS(backTargetCS())
    }, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
      name: "lucide:arrow-left",
      size: 18,
      color: "var(--text-primary)"
    }), "Back"), /*#__PURE__*/React.createElement("h1", null, "Chat Support"), /*#__PURE__*/React.createElement("p", null, "Questions about your membership, courses, payments or points? Message the PROfinity team — a real person picks up from here."), /*#__PURE__*/React.createElement("ul", {
      className: "cs-web-facts"
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
      name: "lucide:clock",
      size: 17,
      color: "#2F5F6E"
    }), /*#__PURE__*/React.createElement("span", null, "Online Mon–Fri, 9am–6pm UK time")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
      name: "lucide:message-circle",
      size: 17,
      color: "#2F5F6E"
    }), /*#__PURE__*/React.createElement("span", null, CS_AGENT.status)), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSCS.IconifyIcon, {
      name: "lucide:mail",
      size: 17,
      color: "#2F5F6E"
    }), /*#__PURE__*/React.createElement("span", null, "Replies also land in your inbox")))), /*#__PURE__*/React.createElement("div", {
      className: "cs-web-card"
    }, /*#__PURE__*/React.createElement(ChatSupportScreen, null))));
  }
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(ChatSupportScreen, null));
  }
  /* the navy bar sits under the status bar in every view, so the frame's
     status text is always white */
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956,
    dark: true
  }, /*#__PURE__*/React.createElement(ChatSupportScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ChatSupportApp, null));
