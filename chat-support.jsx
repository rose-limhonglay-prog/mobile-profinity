/* ===========================================================================
   PROfinity — Chat Support (mobile) · iPhone 17 Pro Max
   Standalone drill-in reached from the sidebar drawer ("My Profile → Chat
   Support") on every mobile page and from Account Settings. A support thread
   with a welcome message, topic quick-replies that answer with deep links to
   the relevant page (Payments, Membership, My Learning, Ways to Earn), and a
   free-text composer that opens a ticket and shows a scripted acknowledgement
   after a short typing indicator. The thread persists in localStorage
   ("pf-support-chat") so it survives leaving and coming back.
   Composed on the bound DS bundle. Suffixed -CS to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateCS, useEffect: useEffectCS, useRef: useRefCS } = React;
const DSCS = window.ProfinityDesignSystem_c2b5cc;

function goCS(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

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
  return "NewsfeedMobile.html";
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

/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkCS() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateCS(read);
  useEffectCS(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

/* ---- data ---------------------------------------------------------------- */
const CS_KEY = "pf-support-chat";
const CS_USER = "Katy";
const CS_AGENT = { name: "PROfinity Support", status: "Online · replies in a few minutes" };

const CS_TOPICS = [
  { id: "billing", label: "Billing & payments", icon: "lucide:credit-card",
    reply: "Happy to help with billing. Your plan, saved cards and invoices all live under Payments — or tell me what looks wrong and I'll take a look.",
    links: [{ label: "Open Payments", href: "PaymentsMobile.html" }, { label: "View invoices", href: "InvoicesMobile.html" }] },
  { id: "membership", label: "My membership", icon: "lucide:gem",
    reply: "Of course. Is it about upgrading, what's included in your tier, or pausing? Here's the tier overview while you tell me more.",
    links: [{ label: "Membership tiers", href: "MembershipTier.html" }] },
  { id: "courses", label: "Courses & lessons", icon: "lucide:graduation-cap",
    reply: "Got it. Is a lesson not loading, or is a course missing from My Learning? Send me the course name and I'll check your access.",
    links: [{ label: "Go to My Learning", href: "LearningMobile.html" }] },
  { id: "rewards", label: "Points & rewards", icon: "lucide:gift",
    reply: "Points normally land within a minute of an action. If something's missing, tell me what you did and roughly when — I'll check the ledger.",
    links: [{ label: "Ways to earn", href: "WaysToEarn.html" }, { label: "My rewards", href: "MyRewards.html" }] },
  { id: "technical", label: "Technical issue", icon: "lucide:wrench",
    reply: "Sorry about that. What were you doing when it happened, and are you on the app or the web? A screenshot helps a lot too.",
    links: [] },
  { id: "other", label: "Something else", icon: "lucide:message-circle",
    reply: "No problem — tell me a little more and I'll point you in the right direction.",
    links: [] }];

const CS_ACKS = [
  "Thanks, {name}. I've logged this as ticket #{ticket} and a team member will pick it up shortly — you'll get a notification the moment they reply.",
  "Noted — I've added that to ticket #{ticket}. Anything else you can tell me while the team takes a look?",
  "Got it, thanks. That's on the ticket too. We'll reply here as soon as we have an answer.",
  "Thanks for the extra detail, {name}. The team has everything they need for now — hang tight."];

const CS_WELCOME = "Hi " + CS_USER + " 👋 Welcome to PROfinity Support. Pick a topic below or just type your question — a real person picks up from here.";

function readStoreCS() {
  try {
    const raw = localStorage.getItem(CS_KEY);
    if (raw) { const s = JSON.parse(raw); if (s && Array.isArray(s.messages) && s.messages.length) return s; }
  } catch (e) {}
  return null;
}
function saveStoreCS(s) { try { localStorage.setItem(CS_KEY, JSON.stringify(s)); } catch (e) {} }
function seedStoreCS() {
  return { ticket: null, acks: 0, messages: [{ id: "w" + Date.now(), from: "support", text: CS_WELCOME, ts: Date.now(), chips: true }] };
}
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

function CSAgentFace({ size = 40, dot = true }) {
  return (
    <span className="cs-agent" style={{ width: size, height: size }} aria-hidden="true">
      <DSCS.IconifyIcon name="lucide:headset" size={Math.round(size * 0.52)} color="#fff" />
      {dot && <span className="cs-online" />}
    </span>);
}

/* ---- thread pieces ------------------------------------------------------- */
function CSMessage({ m, showFace, showTime }) {
  const mine = m.from === "me";
  return (
    <div className={"cs-msg" + (mine ? " me" : "") + (showFace ? " first" : "")}>
      {!mine && <span className="cs-msg-av">{showFace ? <CSAgentFace size={28} dot={false} /> : null}</span>}
      <div className="cs-msg-col">
        <div className={"cs-bubble" + (mine ? " me" : "")}>{m.text}</div>
        {m.links && m.links.length > 0 &&
          <div className="cs-links">
            {m.links.map((l) =>
              <button type="button" key={l.href} className="cs-link" onClick={() => goCS(l.href + (l.href.indexOf("?") === -1 ? "?" : "&") + "ret=ChatSupport.html")}>
                <span>{l.label}</span>
                <DSCS.IconifyIcon name="lucide:arrow-up-right" size={15} color="var(--brand-navy)" />
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
          <DSCS.IconifyIcon name={t.icon} size={16} color="var(--brand-navy)" />
          <span>{t.label}</span>
        </button>)}
    </div>);
}

/* ---- screen ----------------------------------------------------------------- */
function ChatSupportScreen() {
  const [store, setStore] = useStateCS(() => readStoreCS() || seedStoreCS());
  const [draft, setDraft] = useStateCS("");
  const [typing, setTyping] = useStateCS(false);
  const [menuOpen, setMenuOpen] = useStateCS(false);
  const [toast, showToast] = useCSToast();
  const bodyRef = useRefCS(null);
  const inputRef = useRefCS(null);
  const timers = useRefCS([]);

  useEffectCS(() => saveStoreCS(store), [store]);
  useEffectCS(() => () => timers.current.forEach(clearTimeout), []);

  /* keep the newest message in view */
  useEffectCS(() => {
    const el = bodyRef.current; if (!el) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [store.messages.length, typing]);

  const msgs = store.messages;
  const last = msgs[msgs.length - 1];
  const showChips = !typing && last && last.from === "support" && last.chips;

  function push(m) { setStore((s) => ({ ...s, messages: [...s.messages, m] })); }
  function later(fn, ms) { timers.current.push(setTimeout(fn, ms)); }

  function replyWith(build, delay) {
    setTyping(true);
    later(() => {
      setTyping(false);
      setStore((s) => {
        const built = build(s);
        return { ...s, ...built.patch, messages: [...s.messages, { id: "s" + Date.now(), from: "support", ts: Date.now(), ...built.msg }] };
      });
    }, delay);
  }

  function pickTopic(t) {
    /* the chips retire once a topic is chosen */
    setStore((s) => ({ ...s, messages: s.messages.map((m) => m.chips ? { ...m, chips: false } : m) }));
    push({ id: "m" + Date.now(), from: "me", text: t.label, ts: Date.now() });
    replyWith(() => ({ patch: {}, msg: { text: t.reply, links: t.links } }), 1100 + Math.random() * 500);
  }

  function send() {
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    setStore((s) => ({ ...s, messages: s.messages.map((m) => m.chips ? { ...m, chips: false } : m) }));
    push({ id: "m" + Date.now(), from: "me", text, ts: Date.now() });
    replyWith((s) => {
      const ticket = s.ticket || newTicketCS();
      const ack = CS_ACKS[Math.min(s.acks, CS_ACKS.length - 1)].replace("{name}", CS_USER).replace("{ticket}", ticket);
      return { patch: { ticket, acks: s.acks + 1 }, msg: { text: ack } };
    }, 1400 + Math.random() * 600);
    if (inputRef.current) inputRef.current.focus();
  }

  function onKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  function restart() {
    timers.current.forEach(clearTimeout); timers.current = [];
    setTyping(false); setMenuOpen(false);
    const fresh = seedStoreCS(); setStore(fresh);
    showToast("Started a new conversation");
  }
  function emailTranscript() {
    setMenuOpen(false);
    showToast("Transcript sent to your email");
  }

  const canSend = draft.trim().length > 0 && !typing;

  return (
    <div className="cs-screen" data-screen-label="Chat Support (mobile)">
      <header className="cs-top">
        <button className="cs-back" aria-label="Back" onClick={() => goCS(backTargetCS())}>
          <DSCS.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <CSAgentFace size={40} />
        <div className="cs-id">
          <h1>{CS_AGENT.name}</h1>
          <span className="cs-status">{CS_AGENT.status}</span>
        </div>
        <button className="cs-more" aria-label="Conversation options" onClick={() => setMenuOpen(true)}>
          <DSCS.IconifyIcon name="lucide:more-horizontal" size={22} color="var(--gray-900)" />
        </button>
      </header>

      {store.ticket &&
        <div className="cs-ticket" role="status">
          <DSCS.IconifyIcon name="lucide:ticket" size={16} color="var(--brand-navy)" />
          <span><b>Ticket #{store.ticket}</b> is open — we'll reply here and by email.</span>
        </div>}

      <div className="cs-body" ref={bodyRef}>
        <div className="cs-daychip"><span>{fmtDayCS(msgs[0].ts)}</span></div>
        <div className="cs-hours">
          <DSCS.IconifyIcon name="lucide:clock" size={14} color="var(--gray-500)" />
          <span>Our team is online Mon–Fri, 9am–6pm UK time</span>
        </div>
        {msgs.map((m, i) => {
          const prev = msgs[i - 1], next = msgs[i + 1];
          const showFace = m.from !== "me" && (!prev || prev.from !== m.from);
          const showTime = !next || next.from !== m.from || next.ts - m.ts > 3 * 60 * 1000;
          return <CSMessage key={m.id} m={m} showFace={showFace} showTime={showTime} />;
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
          <span className="cs-opt-ic"><DSCS.IconifyIcon name="lucide:mail" size={20} color="var(--brand-navy)" /></span>
          <span className="cs-opt-main"><span className="cs-opt-label">Email me this transcript</span><span className="cs-opt-sub">A copy of the whole conversation</span></span>
        </button>
        <button type="button" className="cs-opt" onClick={restart}>
          <span className="cs-opt-ic"><DSCS.IconifyIcon name="lucide:refresh-cw" size={20} color="var(--brand-navy)" /></span>
          <span className="cs-opt-main"><span className="cs-opt-label">Start a new conversation</span><span className="cs-opt-sub">Clears this thread on this device</span></span>
        </button>
        <button type="button" className="cs-opt cs-opt-cancel" onClick={() => setMenuOpen(false)}>Cancel</button>
      </CSSheet>

      {toast && <div className="cs-toast" role="status"><DSCS.IconifyIcon name="lucide:check" size={16} color="#fff" />{toast}</div>}
    </div>);
}

function ChatSupportApp() {
  const mobile = useIsMobileCS();
  const scale = useDeviceScaleCS();
  const dark = useIsDarkCS();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><ChatSupportScreen /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><ChatSupportScreen /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ChatSupportApp />);
