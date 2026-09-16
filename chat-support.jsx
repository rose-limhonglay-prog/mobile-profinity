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
const { useState: useStateCS, useEffect: useEffectCS, useRef: useRefCS, useMemo: useMemoCS } = React;
const DSCS = window.ProfinityDesignSystem_c2b5cc;
const CS_WEB = !!window.PF_CS_WEB;

function goCS(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}
/* Own page name (for ?ret= round-trips) and the desktop equivalents of the
   mobile pages the topic replies link to. */
function selfPageCS() { return CS_WEB ? "ChatSupportWeb.html" : "ChatSupport.html"; }
const CS_WEB_HREFS = {
  "PaymentsMobile.html": "AccountSettingsWeb.html",
  "InvoicesMobile.html": "AccountSettingsWeb.html",
  "LearningMobile.html": "MyLearning.html",
  "WaysToEarn.html": "RewardsWeb.html",
  "MyRewards.html": "RewardsWeb.html"
};
function hrefCS(href) { return CS_WEB ? (CS_WEB_HREFS[href] || href) : href; }
const CS_ME = { name: "Katy Wilson", role: "Registered Nurse", avatar: "assets/avatar-katy.jpg" };
function navigateCS(label) {
  const u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goCS(u);
}

/* Back goes to ?ret= when given, else the same-origin page that opened us
   (any drawer can open this page), else the newsfeed. */
function backTargetCS() {
  try { const r = new URLSearchParams(window.location.search).get("ret"); if (r) return r; } catch (e) {}
  try {
    const ref = document.referrer;
    if (ref) {
      const u = new URL(ref);
      if (u.origin === window.location.origin && !/ChatSupport/.test(u.pathname)) return u.pathname.split("/").pop() + u.search;
    }
  } catch (e) {}
  return CS_WEB ? "NewsfeedWeb.html" : "NewsfeedMobile.html";
}
function queryCS(k) { try { return new URLSearchParams(window.location.search).get(k); } catch (e) { return null; } }

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
const CS_AGENT = { name: "PROfinity Support", status: "Online · replies in a few minutes" };

const CS_TOPICS = [
  { id: "billing", label: "Billing & payments", sub: "Invoices, cards and your plan", icon: "lucide:credit-card",
    reply: "Happy to help with billing. Your plan, saved cards and invoices all live under Payments — or tell me what looks wrong and I'll take a look.",
    links: [{ label: "Open Payments", href: "PaymentsMobile.html" }, { label: "View invoices", href: "InvoicesMobile.html" }] },
  { id: "membership", label: "My membership", sub: "Upgrades, what's included, pausing", icon: "lucide:gem",
    reply: "Of course. Is it about upgrading, what's included in your tier, or pausing? Here's the tier overview while you tell me more.",
    links: [{ label: "Membership tiers", href: "MembershipTier.html" }] },
  { id: "courses", label: "Courses & lessons", sub: "Access, progress and certificates", icon: "lucide:graduation-cap",
    reply: "Got it. Is a lesson not loading, or is a course missing from My Learning? Send me the course name and I'll check your access.",
    links: [{ label: "Go to My Learning", href: "LearningMobile.html" }] },
  { id: "rewards", label: "Points & rewards", sub: "Missing points, vouchers, badges", icon: "lucide:gift",
    reply: "Points normally land within a minute of an action. If something's missing, tell me what you did and roughly when — I'll check the ledger.",
    links: [{ label: "Ways to earn", href: "WaysToEarn.html" }, { label: "My rewards", href: "MyRewards.html" }] },
  { id: "technical", label: "Technical issue", sub: "Something isn't working", icon: "lucide:wrench",
    reply: "Sorry about that. What were you doing when it happened, and are you on the app or the web? A screenshot helps a lot too.",
    links: [] },
  { id: "other", label: "Something else", sub: "Anything we haven't covered", icon: "lucide:message-circle",
    reply: "No problem — tell me a little more and I'll point you in the right direction.",
    links: [] }];

const CS_ACKS = [
  "Thanks, {name}. I've logged this as ticket #{ticket} and a team member will pick it up shortly — you'll get a notification the moment they reply.",
  "Noted — I've added that to ticket #{ticket}. Anything else you can tell me while the team takes a look?",
  "Got it, thanks. That's on the ticket too. We'll reply here as soon as we have an answer.",
  "Thanks for the extra detail, {name}. The team has everything they need for now — hang tight."];

const CS_WELCOME = "Hi " + CS_USER + " 👋 Welcome to PROfinity Support. Pick a topic below or just type your question — a real person picks up from here.";

function newConvCS(chips) {
  const now = Date.now();
  return { id: "c" + now, ticket: null, acks: 0, updatedAt: now,
    messages: [{ id: "w" + now, from: "support", text: CS_WELCOME, ts: now, chips: chips !== false }] };
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
        return { conversations: [{ id: "c-legacy", ticket: s.ticket || null, acks: s.acks || 0, messages: s.messages, updatedAt: last.ts || Date.now() }] };
      }
    }
  } catch (e) {}
  return { conversations: [] };
}
function saveStoreCS(s) { try { localStorage.setItem(CS_KEY, JSON.stringify(s)); } catch (e) {} }
function newTicketCS() { return "PF-" + (4000 + Math.floor(Math.random() * 900)); }

function fmtClockCS(ts) {
  const d = new Date(ts); let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + (m < 10 ? "0" : "") + m + " " + ap;
}
function fmtDayCS(ts) {
  const d = new Date(ts), now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
function fmtListTimeCS(ts) { return fmtDayCS(ts) === "Today" ? fmtClockCS(ts) : fmtDayCS(ts); }
function previewCS(c) {
  const last = c.messages[c.messages.length - 1];
  if (!last) return "";
  return (last.from === "me" ? "You: " : "") + last.text.replace(/\s+/g, " ");
}

/* ---- small shared bits ------------------------------------------------- */
function CSSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="cs-sheet-wrap" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="cs-scrim" aria-label="Close" onClick={onClose} />
      <div className="cs-sheet">
        <span className="cs-sheet-handle" />
        {title && <h3 className="cs-sheet-ttl">{title}</h3>}
        {children}
      </div>
    </div>);
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
function CSAgentFace({ size = 40, dot = true, light = false }) {
  return (
    <span className={"cs-agent" + (light ? " light" : "")} style={{ width: size, height: size }} aria-hidden="true">
      <DSCS.IconifyIcon name="lucide:headset" size={Math.round(size * 0.52)} color={light ? "#2F5F6E" : "#fff"} />
      {dot && <span className="cs-online" />}
    </span>);
}

/* Navy top bar shared by every view */
function CSBar({ onBack, title, children, trailing }) {
  return (
    <header className="cs-bar">
      <button className="cs-bar-btn" aria-label="Back" onClick={onBack}>
        <DSCS.IconifyIcon name="lucide:chevron-left" size={28} color="#fff" />
      </button>
      {children || <h1 className="cs-bar-title">{title}</h1>}
      {trailing || <span className="cs-bar-spacer" />}
    </header>);
}

function CSTabs({ view, onChange, unread }) {
  return (
    <nav className="cs-tabs" aria-label="Chat Support sections">
      <button type="button" className={"cs-tab" + (view === "home" ? " on" : "")} onClick={() => onChange("home")} aria-current={view === "home" ? "page" : undefined}>
        <span className="cs-tab-ic"><DSCS.IconifyIcon name={view === "home" ? "fluent:home-16-filled" : "lucide:home"} size={26} color={view === "home" ? "#2F5F6E" : "var(--gray-500)"} /></span>
        <span>Home</span>
      </button>
      <button type="button" className={"cs-tab" + (view === "messages" ? " on" : "")} onClick={() => onChange("messages")} aria-current={view === "messages" ? "page" : undefined}>
        <span className="cs-tab-ic">
          <DSCS.IconifyIcon name={view === "messages" ? "fluent:chat-16-filled" : "lucide:message-square-text"} size={26} color={view === "messages" ? "#2F5F6E" : "var(--gray-500)"} />
          {unread > 0 && <span className="cs-tab-badge">{unread}</span>}
        </span>
        <span>Messages</span>
      </button>
    </nav>);
}

/* ---- Home --------------------------------------------------------------- */
function CSHome({ convs, onStart, onOpen, onBack }) {
  const latest = convs[0];
  return (
    <div className="cs-view">
      <CSBar onBack={onBack} title="Chat Support" />
      <div className="cs-scroll">
        <section className="cs-hero">
          <div className="cs-hero-top">
            <span className="cs-sig" aria-label="Dr Tim">Dr Tim</span>
            <button type="button" className="cs-x" aria-label="Close" onClick={onBack}>
              <DSCS.IconifyIcon name="lucide:x" size={22} color="#fff" />
            </button>
          </div>
          <h2 className="cs-hello">Hi there <span className="cs-wave" aria-hidden="true">👋</span><br />How can we help?</h2>

          <button type="button" className="cs-start" onClick={() => onStart()}>
            <span className="cs-start-main">
              <span className="cs-start-label">Start a conversation</span>
              <span className="cs-start-sub"><span className="cs-dot" />{CS_AGENT.status}</span>
            </span>
            <span className="cs-start-ic"><DSCS.IconifyIcon name="lucide:send" size={20} color="#fff" /></span>
          </button>

          {latest &&
            <button type="button" className="cs-recent" onClick={() => onOpen(latest.id)}>
              <span className="cs-recent-eyebrow">Your latest conversation</span>
              <span className="cs-recent-row">
                <CSAgentFace size={44} />
                <span className="cs-recent-main">
                  <span className="cs-recent-top">
                    <b>{CS_AGENT.name}</b>
                    <span className="cs-recent-time">{fmtListTimeCS(latest.updatedAt)}</span>
                  </span>
                  <span className="cs-recent-preview">{previewCS(latest)}</span>
                </span>
                <DSCS.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </span>
              {latest.ticket && <span className="cs-pill open"><DSCS.IconifyIcon name="lucide:ticket" size={13} color="#2F5F6E" />Ticket #{latest.ticket} · Open</span>}
            </button>}
        </section>

        <section className="cs-home-body">
          <h4 className="cs-h">Quick help</h4>
          <div className="cs-card cs-topics">
            {CS_TOPICS.map((t) =>
              <button type="button" key={t.id} className="cs-topic" onClick={() => onStart(t)}>
                <span className="cs-topic-ic"><DSCS.IconifyIcon name={t.icon} size={20} color="#2F5F6E" /></span>
                <span className="cs-topic-main">
                  <span className="cs-topic-label">{t.label}</span>
                  <span className="cs-topic-sub">{t.sub}</span>
                </span>
                <DSCS.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </button>)}
          </div>

          <div className="cs-card cs-hours-card">
            <span className="cs-hours-ic"><DSCS.IconifyIcon name="lucide:clock" size={20} color="#2F5F6E" /></span>
            <span className="cs-hours-main">
              <b>Our team is online Mon–Fri, 9am–6pm UK time</b>
              <span>Outside those hours, leave a message and we'll reply first thing.</span>
            </span>
          </div>
        </section>
      </div>
    </div>);
}

/* ---- Messages ------------------------------------------------------------- */
function CSMessages({ convs, onStart, onOpen, onBack }) {
  return (
    <div className="cs-view">
      <CSBar onBack={onBack} title="Messages" />
      <div className="cs-scroll cs-scroll-msgs">
        {convs.length === 0 ?
          <div className="cs-empty">
            <span className="cs-empty-ic"><DSCS.IconifyIcon name="lucide:message-square-text" size={40} color="#2F5F6E" /></span>
            <h3>No messages yet</h3>
            <p>Questions about your membership, courses or points? We're a message away.</p>
          </div> :
          <div className="cs-convs">
            {convs.map((c) =>
              <button type="button" key={c.id} className="cs-conv" onClick={() => onOpen(c.id)}>
                <CSAgentFace size={52} />
                <span className="cs-conv-main">
                  <span className="cs-conv-top">
                    <span className="cs-conv-name">{CS_AGENT.name}</span>
                    <span className="cs-conv-time">{fmtListTimeCS(c.updatedAt)}</span>
                  </span>
                  <span className="cs-conv-preview">{previewCS(c)}</span>
                  {c.ticket ? <span className="cs-pill open"><DSCS.IconifyIcon name="lucide:ticket" size={13} color="#2F5F6E" />#{c.ticket} · Open</span>
                    : <span className="cs-pill">Getting started</span>}
                </span>
              </button>)}
          </div>}
      </div>
      <div className="cs-fab-wrap">
        <button type="button" className="cs-fab" onClick={() => onStart()}>
          <DSCS.IconifyIcon name="lucide:send" size={18} color="#fff" />Send us a message
        </button>
      </div>
    </div>);
}

/* ---- Thread ------------------------------------------------------------- */
function CSMessage({ m, showFace, showTime, threadId }) {
  const mine = m.from === "me";
  return (
    <div className={"cs-msg" + (mine ? " me" : "") + (showFace ? " first" : "")}>
      {!mine && <span className="cs-msg-av">{showFace ? <CSAgentFace size={28} dot={false} /> : null}</span>}
      <div className="cs-msg-col">
        <div className={"cs-bubble" + (mine ? " me" : "")}>{m.text}</div>
        {m.links && m.links.length > 0 &&
          <div className="cs-links">
            {m.links.map((l) =>
              <button type="button" key={l.href} className="cs-link"
                onClick={() => { const h = hrefCS(l.href); goCS(h + (h.indexOf("?") === -1 ? "?" : "&") + "ret=" + encodeURIComponent(selfPageCS() + "?view=thread&c=" + threadId)); }}>
                <span>{l.label}</span>
                <DSCS.IconifyIcon name="lucide:arrow-up-right" size={15} color="#2F5F6E" />
              </button>)}
          </div>}
        {showTime && <span className="cs-msg-time">{fmtClockCS(m.ts)}</span>}
      </div>
    </div>);
}

function CSTyping() {
  return (
    <div className="cs-msg first" aria-label={CS_AGENT.name + " is typing"}>
      <span className="cs-msg-av"><CSAgentFace size={28} dot={false} /></span>
      <div className="cs-msg-col">
        <div className="cs-bubble cs-typing"><i /><i /><i /></div>
      </div>
    </div>);
}

function CSChips({ onPick }) {
  return (
    <div className="cs-chips" role="group" aria-label="Choose a topic">
      {CS_TOPICS.map((t) =>
        <button type="button" key={t.id} className="cs-chip" onClick={() => onPick(t)}>
          <DSCS.IconifyIcon name={t.icon} size={16} color="#2F5F6E" />
          <span>{t.label}</span>
        </button>)}
    </div>);
}

function CSThread({ conv, onChange, onBack, initialTopic, showToast }) {
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
    const el = bodyRef.current; if (!el) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [conv.messages.length, typing]);

  const msgs = conv.messages;
  const last = msgs[msgs.length - 1];
  const showChips = !typing && last && last.from === "support" && last.chips;

  function later(fn, ms) { timers.current.push(setTimeout(fn, ms)); }
  function retireChips(c) { return { ...c, messages: c.messages.map((m) => m.chips ? { ...m, chips: false } : m) }; }
  function replyWith(build, delay) {
    setTyping(true);
    later(() => {
      setTyping(false);
      onChange((c) => {
        const built = build(c);
        return { ...c, ...built.patch, messages: [...c.messages, { id: "s" + Date.now(), from: "support", ts: Date.now(), ...built.msg }] };
      });
    }, delay);
  }
  function pickTopic(t) {
    onChange((c) => ({ ...retireChips(c), messages: [...retireChips(c).messages, { id: "m" + Date.now(), from: "me", text: t.label, ts: Date.now() }] }));
    replyWith(() => ({ patch: {}, msg: { text: t.reply, links: t.links } }), 1100 + Math.random() * 500);
  }
  /* a Quick-help row on Home lands here with the topic pre-chosen */
  useEffectCS(() => {
    if (initialTopic && !started.current) { started.current = true; pickTopic(initialTopic); }
  }, []);

  function send() {
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    onChange((c) => ({ ...retireChips(c), messages: [...retireChips(c).messages, { id: "m" + Date.now(), from: "me", text, ts: Date.now() }] }));
    replyWith((c) => {
      const ticket = c.ticket || newTicketCS();
      const ack = CS_ACKS[Math.min(c.acks, CS_ACKS.length - 1)].replace("{name}", CS_USER).replace("{ticket}", ticket);
      return { patch: { ticket, acks: c.acks + 1 }, msg: { text: ack } };
    }, 1400 + Math.random() * 600);
    if (inputRef.current) inputRef.current.focus();
  }
  function onKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }
  function emailTranscript() { setMenuOpen(false); showToast("Transcript sent to your email"); }

  const canSend = draft.trim().length > 0 && !typing;

  return (
    <div className="cs-view cs-thread">
      <CSBar onBack={onBack}
        trailing={<button className="cs-bar-btn" aria-label="Conversation options" onClick={() => setMenuOpen(true)}>
          <DSCS.IconifyIcon name="lucide:more-horizontal" size={24} color="#fff" /></button>}>
        <div className="cs-bar-id">
          <CSAgentFace size={38} light />
          <div className="cs-bar-idtext">
            <h1 className="cs-bar-name">{CS_AGENT.name}</h1>
            <span className="cs-bar-status">{CS_AGENT.status}</span>
          </div>
        </div>
      </CSBar>

      {conv.ticket &&
        <div className="cs-ticket" role="status">
          <DSCS.IconifyIcon name="lucide:ticket" size={16} color="#2F5F6E" />
          <span><b>Ticket #{conv.ticket}</b> is open — we'll reply here and by email.</span>
        </div>}

      <div className="cs-body" ref={bodyRef}>
        <div className="cs-daychip"><span>{fmtDayCS(msgs[0].ts)}</span></div>
        {msgs.map((m, i) => {
          const prev = msgs[i - 1], next = msgs[i + 1];
          const showFace = m.from !== "me" && (!prev || prev.from !== m.from);
          const showTime = !next || next.from !== m.from || next.ts - m.ts > 3 * 60 * 1000;
          return <CSMessage key={m.id} m={m} showFace={showFace} showTime={showTime} threadId={conv.id} />;
        })}
        {typing && <CSTyping />}
        {showChips && <CSChips onPick={pickTopic} />}
      </div>

      <div className="cs-composer">
        <button type="button" className="cs-attach" aria-label="Attach a screenshot" onClick={() => showToast("Screenshots can be attached in the live app")}>
          <DSCS.IconifyIcon name="lucide:paperclip" size={22} color="var(--gray-600)" />
        </button>
        <div className="cs-field">
          <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey}
            placeholder="Type your message…" aria-label="Message" autoComplete="off" />
        </div>
        <button type="button" className={"cs-send" + (canSend ? " on" : "")} aria-label="Send" disabled={!canSend} onClick={send}>
          <DSCS.IconifyIcon name="lucide:send" size={18} color="#fff" />
        </button>
      </div>
      <div className="cs-safe" />

      <CSSheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Conversation">
        <button type="button" className="cs-opt" onClick={emailTranscript}>
          <span className="cs-opt-ic"><DSCS.IconifyIcon name="lucide:mail" size={20} color="#2F5F6E" /></span>
          <span className="cs-opt-main"><span className="cs-opt-label">Email me this transcript</span><span className="cs-opt-sub">A copy of the whole conversation</span></span>
        </button>
        <button type="button" className="cs-opt" onClick={() => { setMenuOpen(false); onBack("messages"); }}>
          <span className="cs-opt-ic"><DSCS.IconifyIcon name="lucide:message-square-text" size={20} color="#2F5F6E" /></span>
          <span className="cs-opt-main"><span className="cs-opt-label">All conversations</span><span className="cs-opt-sub">Open the Messages tab</span></span>
        </button>
        <button type="button" className="cs-opt cs-opt-cancel" onClick={() => setMenuOpen(false)}>Cancel</button>
      </CSSheet>
    </div>);
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
  const active = convs.find((c) => c.id === activeId) || null;
  const unread = convs.filter((c) => c.ticket).length;

  /* ?view=thread with an unknown id falls back to the newest conversation */
  useEffectCS(() => {
    if (view === "thread" && !active) {
      if (convs.length) setActiveId(convs[0].id); else setView("home");
    }
  }, [view, active, convs.length]);

  function start(topic) {
    const c = newConvCS(!topic);
    setStore((s) => ({ ...s, conversations: [...s.conversations, c] }));
    setActiveId(c.id); setPendingTopic(topic || null); setView("thread");
  }
  function open(id) { setActiveId(id); setPendingTopic(null); setView("thread"); }
  function changeConv(id, fn) {
    setStore((s) => ({ ...s, conversations: s.conversations.map((c) => c.id === id ? { ...fn(c), updatedAt: Date.now() } : c) }));
  }
  const [lastTab, setLastTab] = useStateCS("home");
  function switchTab(t) { setLastTab(t); setView(t); }
  function leaveThread(to) { setPendingTopic(null); setView(to === "messages" || to === "home" ? to : lastTab); }

  return (
    <div className="cs-screen" data-screen-label={"Chat Support (mobile) · " + view}>
      {view === "home" && <CSHome convs={convs} onStart={start} onOpen={open} onBack={() => goCS(backTargetCS())} />}
      {view === "messages" && <CSMessages convs={convs} onStart={start} onOpen={open} onBack={() => switchTab("home")} />}
      {view === "thread" && active &&
        <CSThread key={active.id} conv={active} onChange={(fn) => changeConv(active.id, fn)} onBack={leaveThread}
          initialTopic={pendingTopic} showToast={showToast} />}
      {view !== "thread" && <CSTabs view={view} onChange={switchTab} unread={unread} />}
      {toast && <div className="cs-toast" role="status"><DSCS.IconifyIcon name="lucide:check" size={16} color="#fff" />{toast}</div>}
    </div>);
}

function ChatSupportApp() {
  const mobile = useIsMobileCS();
  const scale = useDeviceScaleCS();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (CS_WEB) {
    /* Desktop: DS TopNav, then the same screen as a fixed-size messenger card
       (Intercom's desktop launcher panel) with a short intro column beside it. */
    return (
      <div className="app wa-screen cs-web" style={vars}>
        <DSCS.TopNav active="Support" user={CS_ME} logoSrc="assets/profinity-icon-purple-gold.png" onNavigate={navigateCS}
          style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
        <div className="cs-web-page" data-screen-label="Chat Support (web)">
          <aside className="cs-web-intro">
            <button type="button" className="cs-web-back" onClick={() => goCS(backTargetCS())}>
              <DSCS.IconifyIcon name="lucide:arrow-left" size={18} color="var(--text-primary)" />Back
            </button>
            <h1>Chat Support</h1>
            <p>Questions about your membership, courses, payments or points? Message the PROfinity team — a real person picks up from here.</p>
            <ul className="cs-web-facts">
              <li><DSCS.IconifyIcon name="lucide:clock" size={17} color="#2F5F6E" /><span>Online Mon–Fri, 9am–6pm UK time</span></li>
              <li><DSCS.IconifyIcon name="lucide:message-circle" size={17} color="#2F5F6E" /><span>{CS_AGENT.status}</span></li>
              <li><DSCS.IconifyIcon name="lucide:mail" size={17} color="#2F5F6E" /><span>Replies also land in your inbox</span></li>
            </ul>
          </aside>
          <div className="cs-web-card"><ChatSupportScreen /></div>
        </div>
      </div>);
  }
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><ChatSupportScreen /></div>;
  }
  /* the navy bar sits under the status bar in every view, so the frame's
     status text is always white */
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark><ChatSupportScreen /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ChatSupportApp />);
