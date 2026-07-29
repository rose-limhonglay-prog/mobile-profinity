/* ===========================================================================
   PROfinity — Events (mobile)
   Upcoming Events (list/calendar) → Event Detail → waiting room → live call
   (with Live Chat). Composed on the bound DS bundle. Suffixed -EV to avoid
   global-scope clashes.
   =========================================================================== */
const { useState: useStateEV, useEffect: useEffectEV } = React;
const DSEV = window.ProfinityDesignSystem_c2b5cc;
const PFAEV = window.PFApp;

function goEV(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

function useDeviceScaleEV() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateEV(calc);
  useEffectEV(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileEV() {
  const [mobile, setMobile] = useStateEV(() => window.matchMedia('(max-width:768px)').matches);
  useEffectEV(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

/* ---- date helpers: Technique Tuesday recurs weekly, generated from today ---- */
const EV_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const EV_TODAY = new Date();

function evFmtDate(d) {
  return EV_MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}
/* Next `n` Tuesdays from today (today counts if it is itself a Tuesday). */
function evNextTuesdays(n) {
  const out = [];
  const d = new Date(EV_TODAY.getFullYear(), EV_TODAY.getMonth(), EV_TODAY.getDate());
  d.setDate(d.getDate() + ((2 - d.getDay() + 7) % 7));
  for (let i = 0; i < n; i++) { out.push(new Date(d)); d.setDate(d.getDate() + 7); }
  return out;
}
/* Parse "March 17, 2026" / "November 26 – 30, 2026" into {y, m, d}. */
function evParse(date) {
  const m = EV_MONTHS.findIndex((n) => date.startsWith(n));
  const d = parseInt(date.replace(/^[A-Za-z]+\s+/, ""), 10);
  const y = parseInt(date.slice(-4), 10);
  return { y, m, d };
}

/* Ten events across 2026: Technique Tuesday recurs weekly (co-hosted by Dr Tim
   Pearce & Miranda Pearce, soonest occurrence live) plus nine one-off events. */
const EVENTS_LIST = [
  ...evNextTuesdays(3).map((d, i) => ({
    id: "tt" + i, title: "Technique Tuesday", host: "Dr Tim Pearce", cohost: "Miranda Pearce", banner: null,
    date: evFmtDate(d), time: "20:00 GMT", weekly: true, primary: i === 0,
    state: i === 0 ? "live" : "upcoming", going: i === 0 ? "342" : "128",
    membersOnly: i !== 1,
  })),
  { id: "ac", title: "Art Codes Live Webinar", host: "Dr Tim Pearce", banner: null,
    date: "March 24, 2026", time: "19:00 GMT", primary: false, state: "full", going: "500", membersOnly: false },
  { id: "ch", title: "Chew the FATPAD", host: "Dr Tim Pearce", banner: null,
    date: "June 12, 2026", time: "21:00 BST", primary: false, state: "attending", going: "212", membersOnly: true },
  { id: "tl1", title: "Technique Library Webinar", host: "Dr Tim Pearce", banner: null,
    date: "September 24, 2026", time: "20:00 BST", primary: false, state: "upcoming", going: "96", membersOnly: true },
  { id: "tl2", title: "Live Replay Technique Library Webinar", host: "Dr Tim Pearce", banner: null,
    date: "October 4, 2026", time: "19:00 BST", primary: false, state: "upcoming", going: "64", membersOnly: true },
  { id: "ht1", title: "High Ticket Webinar", host: "Dr Tim Pearce", banner: null,
    date: "October 15, 2026", time: "20:00 BST", primary: false, state: "upcoming", going: "410", membersOnly: false },
  { id: "tl3", title: "Live Replay Technique Library Webinar", host: "Dr Tim Pearce", banner: null,
    date: "October 29, 2026", time: "19:00 GMT", primary: false, state: "upcoming", going: "58", membersOnly: true },
  { id: "bfr", title: "BF Registration", host: "Dr Tim Pearce", banner: null,
    date: "November 1, 2026", time: "09:00 GMT", primary: false, state: "upcoming", going: "740", membersOnly: false },
  { id: "bfs", title: "BF Sales Period", host: "Dr Tim Pearce", banner: null,
    date: "November 26 – 30, 2026", time: "All day", primary: false, state: "upcoming", going: "890", membersOnly: false },
  { id: "ht2", title: "High Ticket Webinar", host: "Dr Tim Pearce", banner: null,
    date: "December 15, 2026", time: "20:00 GMT", primary: false, state: "upcoming", going: "302", membersOnly: false },
];

const EV_DETAIL = {
  /* No default banner: real per-event thumbnails aren't photographed yet, so
     the hero shows a plain placeholder rather than a stock photo that may not
     match the event. */
  title: "Chew the FATPAD", host: "Dr Tim Pearce", banner: null,
  date: "June 12, 2026", time: "9:00 PM", attendees: "380",
  about: "Join Dr. Tim Pearce every week for Technique Tuesday, a live, interactive session where he shares his expert knowledge, answers your burning questions, and demonstrates the latest techniques in aesthetic medicine. Don't miss this opportunity to enhance your skills and stay ahead of the curve!",
  membersOnly: true,
  state: "live",
  learn: ["Step-by-Step Technique demonstration", "Interactive Group Exercise", "Individual Feedback Sessions", "Real-world Case Studies", "Q&A Panel Discussion"],
  stats: [{ n: "342", l: "Attendees", s: "Joined" }, { n: "45", l: "Pending", s: "Awaiting" }, { n: "12", l: "Cancelled", s: "Withdrawn" }],
  status: [
    { icon: "lucide:calendar", t: "17 August 2026" },
    { icon: "lucide:clock", t: "20:00 GMT | 16:00 ET" },
    { icon: "lucide:timer", t: "60 minutes" },
    { icon: "lucide:video", t: "Live Webinar" },
    { icon: "lucide:star", t: "Premium Event" },
  ],
  attend: ["Aesthetic Practitioners", "Holistic Health Coaches", "Fitness Instructors", "Nutritional Therapists", "Wellness Consultants"],
};

const EV_TABS = [
  { key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
  { key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
  { key: "Learning", label: "My Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
  { key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
  { key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "AgentMobile.html" },
];

const CALL_PEOPLE = [
  { name: "Sarah", avatar: "assets/avatar-katy.jpg" },
  { name: "Jordan", avatar: "assets/avatar-drtim.png" },
  { name: "Priya", avatar: "assets/avatar-katy.jpg" },
  { name: "Marcus", avatar: "assets/avatar-drtim.png" },
];

const CHAT_SEED = [
  { who: "Dr Marcus", me: false, text: "Hi Katy, I hope you're doing well! I wanted to share a new case study." },
  { who: "Katy Wilson", me: true, text: "Hi Dr Marcus, I trust you're having a productive day! That sounds great." },
  { who: "Dr Marcus", me: false, text: "Yes, I typically use a 22G 70mm cannula with a fanning technique." },
];

function EvTabBar({ active }) {
  return (
    <nav className="ev-tabs" aria-label="Primary">
      {EV_TABS.map((t) => (
        <button key={t.key} className={"ev-tab" + (t.key === active ? " on" : "")} onClick={() => goEV(t.href)}>
          <span className="ic">
            <DSEV.IconifyIcon name={t.icon} size={23} color={t.key === active ? "#fff" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

/* ---- per-event join / calendar state (persisted, shared by both views) ---- */
function evStore() {
  try { return JSON.parse(localStorage.getItem("pf-event-status") || "{}"); } catch (e) { return {}; }
}
function evSave(map) {
  try { localStorage.setItem("pf-event-status", JSON.stringify(map)); } catch (e) {}
  window.dispatchEvent(new CustomEvent("pf-event-status"));
}
function evMark(id, patch) {
  const map = evStore();
  map[id] = Object.assign({}, map[id], patch);
  evSave(map);
}
/* Seed "attending" from the event data so the demo shows a mixed list. */
function evStatusOf(e, map) {
  const s = (map || {})[e.id] || {};
  return { registered: s.registered || e.state === "attending", calendar: !!s.calendar };
}
function useEvStatus() {
  const [map, setMap] = useStateEV(evStore);
  useEffectEV(() => {
    const sync = () => setMap(evStore());
    window.addEventListener("pf-event-status", sync);
    return () => window.removeEventListener("pf-event-status", sync);
  }, []);
  return map;
}
function EvStatusPill({ st }) {
  if (st.registered) return (
    <span className="ev-dotstat on"><span className="d" />Attending</span>
  );
  if (st.calendar) return (
    <span className="ev-dotstat cal"><span className="d" />In your calendar</span>
  );
  return <span className="ev-dotstat off"><span className="d" />Not added</span>;
}

function EvStatusBtn({ e, st }) {
  if (st.registered) return (
    <span className="ev-attpill"><DSEV.IconifyIcon name="lucide:check-circle-2" size={16} color="var(--success)" />Attending</span>
  );
  return (
    <button className={"ev-statusbtn" + (st.calendar ? " done" : "")}
      aria-pressed={st.calendar}
      onClick={(ev) => { ev.stopPropagation(); evMark(e.id, { calendar: !st.calendar }); }}>
      <DSEV.IconifyIcon name={st.calendar ? "lucide:calendar-check" : "lucide:calendar-plus"} size={16} color={st.calendar ? "var(--success)" : "var(--brand-navy)"} />
      {st.calendar ? "Added to calendar" : "Add to calendar"}
    </button>
  );
}

/* ---- screen 1b: calendar view ---- */
function EvCalendar({ onOpen, cur, setCur }) {
  const statusMap = useEvStatus();
  const parsed = EVENTS_LIST.map((e) => Object.assign({ ev: e }, evParse(e.date)));
  const inMonth = parsed.filter((p) => p.y === cur.y && p.m === cur.m);
  const days = new Date(cur.y, cur.m + 1, 0).getDate();
  const lead = (new Date(cur.y, cur.m, 1).getDay() + 6) % 7; // Monday-first
  const step = (n) => setCur((c) => {
    const m = c.m + n;
    return { y: c.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
  });
  return (
    <div className="ev-cal">
      <div className="ev-cal-head">
        <button className="ev-cal-nav" aria-label="Previous month" title="Previous month" onClick={() => step(-1)}>
          <DSEV.IconifyIcon name="lucide:chevron-left" size={20} color="var(--brand-navy)" />
        </button>
        <span className="ev-cal-month">{EV_MONTHS[cur.m]} {cur.y}</span>
        <button className="ev-cal-nav" aria-label="Next month" title="Next month" onClick={() => step(1)}>
          <DSEV.IconifyIcon name="lucide:chevron-right" size={20} color="var(--brand-navy)" />
        </button>
      </div>
      <div className="ev-cal-dow">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="ev-cal-grid">
        {Array.from({ length: lead }).map((_, i) => <span className="ev-cal-cell empty" key={"e" + i} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const hit = inMonth.find((p) => p.d === day);
          const hs = hit ? evStatusOf(hit.ev, statusMap) : null;
          const today = cur.y === EV_TODAY.getFullYear() && cur.m === EV_TODAY.getMonth() && day === EV_TODAY.getDate();
          return (
            <button key={day} className={"ev-cal-cell" + (hit ? " has" : "") + (today ? " today" : "") + (hs && hs.registered ? " joined" : "") + (hs && !hs.registered && hs.calendar ? " incal" : "")} disabled={!hit}
              aria-label={hit ? (day + " — " + hit.ev.title + (hs.registered ? " (attending)" : hs.calendar ? " (in your calendar)" : " (not added yet)")) : String(day)}
              onClick={() => hit && onOpen(hit.ev)}>
              {day}{hit && <span className="ev-cal-dot" />}
            </button>
          );
        })}
      </div>
      <div className="ev-cal-list">
        {inMonth.length === 0
          ? <p className="ev-cal-none">No events this month.</p>
          : inMonth.map((p) => (
            <button className="ev-cal-item" key={p.ev.id} onClick={() => onOpen(p.ev)}>
              <span className="ev-cal-item-d"><b>{p.d}</b><i>{EV_MONTHS[cur.m].slice(0, 3).toUpperCase()}</i></span>
              <span className="ev-cal-item-tx">
                <span className="t">{p.ev.title}</span>
                <span className="s">{p.ev.time}</span>
                <EvStatusPill st={evStatusOf(p.ev, statusMap)} />
              </span>
              <DSEV.IconifyIcon name="lucide:chevron-right" size={19} color="var(--gray-450)" />
            </button>
          ))}
      </div>
    </div>
  );
}

/* ---- screen 1a: events list ---- */
function EventsList({ onBack, onOpen, view, setView, cur, setCur }) {
  const statusMap = useEvStatus();
  return (
    <div className="ev-screen" data-screen-label="Upcoming Events">
      <header className="ev-head">
        <button className="ev-back" aria-label="Back" onClick={onBack}><DSEV.IconifyIcon name="lucide:arrow-left" size={22} color="var(--brand-navy)" /></button>
        <span className="ev-title">Upcoming Events</span>
        <span className="spacer" />
      </header>
      <div className="ev-scroll">
        <div className="ev-searchrow">
          <label className="ev-search"><DSEV.Icon name="search" size={20} color="var(--gray-450)" />
            <input placeholder="Search events…" aria-label="Search events" />
          </label>
          <div className="ev-viewtoggle" role="tablist" aria-label="View">
            {[{ k: "list", l: "List view", i: "lucide:list" }, { k: "calendar", l: "Calendar view", i: "lucide:calendar-days" }].map((v) => (
              <button key={v.k} role="tab" aria-selected={view === v.k} aria-label={v.l} title={v.l}
                className={"ev-viewbtn" + (view === v.k ? " on" : "")} onClick={() => setView(v.k)}>
                <DSEV.IconifyIcon name={v.i} size={20} color={view === v.k ? "#fff" : "var(--gray-600)"} />
              </button>
            ))}
          </div>
        </div>
        {view === "calendar" && <EvCalendar onOpen={onOpen} cur={cur} setCur={setCur} />}
        {view === "list" && EVENTS_LIST.map((e, i) => {
          const [d, mo] = [e.date.split(" ")[1].replace(",", ""), e.date.split(" ")[0].slice(0, 3).toUpperCase()];
          const isLive = e.state === "live";
          return (
          <div className={"ev-card" + (i === 0 ? " feat" : "")} key={e.id} onClick={() => onOpen(e)}>
            <div className="ev-card-media">
              {e.banner
                ? <img className="banner" src={e.banner} alt={e.title} />
                : <div className="banner ev-banner-ph" role="img" aria-label={e.title + " — thumbnail coming soon"} />}
              <span className="ev-date-chip"><b>{d}</b><i>{mo}</i></span>
              {isLive && <span className="ev-flag live"><span className="pulse" />Live now</span>}
            </div>
            <div className="body">
              <h3 className="ttl">{e.title}</h3>
              <div className="host">
                <span className="ev-hosts">
                  <img src="assets/avatar-drtim.png" alt="" />
                  {e.cohost && <img src="assets/avatar-miranda.jpg" alt="" />}
                </span>
                Hosted: <b>{e.cohost ? (e.host + " & " + e.cohost) : e.host}</b>
              </div>
              <div className="meta">
                <span className="ev-chip"><DSEV.IconifyIcon name="lucide:calendar" size={16} color="var(--brand-gold)" />{e.date}</span>
                <span className="ev-chip"><DSEV.IconifyIcon name="lucide:clock" size={16} color="var(--brand-gold)" />{e.time}</span>
              </div>
              <button className={"ev-cta" + (i === 0 ? "" : " ghost")} onClick={(ev) => { ev.stopPropagation(); onOpen(e); }}>
                View Event<DSEV.IconifyIcon name="lucide:arrow-right" size={17} color={i === 0 ? "#fff" : "var(--brand-navy)"} />
              </button>
              <EvStatusBtn e={e} st={evStatusOf(e, statusMap)} />
            </div>
          </div>);
        })}
      </div>
      <EvTabBar active="Home" />
    </div>
  );
}

/* Free members can read everything; the members-only gate fires on action.
   Read window.PF_TIER (per-page preview override), falling back to the same
   subscription-tier source (window.PFApp.getUserTier) every other screen in
   the app already reads from — see mobile.jsx's smReadTierM for the sibling
   pattern used by the side-menu tier ladder. */
function evIsFree() {
  if (typeof window === "undefined") return false;
  if (window.PF_TIER) return window.PF_TIER === "free";
  try { return (PFAEV && PFAEV.getUserTier ? PFAEV.getUserTier() : "free") === "free"; } catch (e) { return false; }
}

/* Status-aware CTA label/icon for an event. */
function evCta(state, attending) {
  if (attending) return { label: "Attending", icon: "lucide:check-circle-2", cls: " attending" };
  if (state === "live") return { label: "Join Live Now", icon: "lucide:radio", cls: " live" };
  if (state === "full") return { label: "Join Waitlist", icon: "lucide:hourglass", cls: "" };
  return { label: "Register Now", icon: "lucide:calendar-plus", cls: "" };
}

/* Members-only gate — shown only AFTER the user acts, never up front. */
function MembersGate({ onClose, onUpgrade }) {
  useEffectEV(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="ev-sheet" role="dialog" aria-modal="true" aria-label="Members only event">
      <button className="ev-sheet-scrim" aria-label="Close" onClick={onClose} />
      <div className="ev-sheet-card">
        <span className="ev-gate-ic"><DSEV.IconifyIcon name="lucide:lock" size={26} color="var(--brand-gold)" /></span>
        <h3 className="ev-sheet-ttl">This event is for members</h3>
        <p className="ev-sheet-p">You can browse the full details any time. To attend live, join a membership tier — it includes every weekly session, replays and the Q&amp;A.</p>
        <button className="ev-detail-cta" onClick={onUpgrade}>See membership tiers</button>
        <button className="ev-detail-cta ghost" onClick={onClose}>Not now</button>
      </div>
    </div>
  );
}

function InviteSheet({ title, event, onClose }) {
  const [copied, setCopied] = useStateEV(false);
  useEffectEV(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const link = (typeof window !== "undefined" ? window.location.href.split("#")[0] : "") + "#event";
  const blurb = "Join me at " + title + (event && event.date ? " on " + event.date + " at " + event.time : "") + " — PROfinity Academy.";
  const share = (k) => {
    try {
      if (k === "copy") {
        if (navigator.clipboard) navigator.clipboard.writeText(link);
        setCopied(true);
        return;
      }
      if (k === "mail") window.open("mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(blurb + "\n\n" + link), "_blank");
      if (k === "msg") window.open("sms:?&body=" + encodeURIComponent(blurb + " " + link), "_blank");
      if (k === "wa") window.open("https://wa.me/?text=" + encodeURIComponent(blurb + " " + link), "_blank");
      if (k === "more") {
        if (navigator.share) { navigator.share({ title: title, text: blurb, url: link }); return; }
        if (navigator.clipboard) navigator.clipboard.writeText(link);
        setCopied(true);
        return;
      }
    } catch (e) {}
  };
  const ways = [
    { k: "copy", l: copied ? "Copied" : "Copy link", i: copied ? "lucide:check" : "lucide:link" },
    { k: "mail", l: "Email", i: "lucide:mail" },
    { k: "msg", l: "Message", i: "lucide:message-circle" },
    { k: "wa", l: "WhatsApp", i: "lucide:phone" },
    { k: "more", l: "More", i: "lucide:share-2" },
  ];
  return (
    <div className="ev-sheet" role="dialog" aria-modal="true" aria-label="Invite your colleagues">
      <button className="ev-sheet-scrim" aria-label="Close" onClick={onClose} />
      <div className="ev-sheet-card">
        <span className="ev-sheet-grab" />
        <div className="ev-sheet-hd">
          <div>
            <h3 className="ev-sheet-ttl">Invite your colleagues</h3>
            <p className="ev-sheet-p">Share this event with your team.</p>
          </div>
          <button className="ev-sheet-x" aria-label="Close" onClick={onClose}>
            <DSEV.IconifyIcon name="lucide:x" size={20} color="var(--gray-500)" />
          </button>
        </div>
        <div className="ev-invite-ev">
          <span className="ic"><DSEV.IconifyIcon name="lucide:calendar-days" size={22} color="var(--brand-navy)" /></span>
          <span className="tx">
            <span className="t">{title}</span>
            {event && event.date && <span className="s">{event.date} · {event.time}</span>}
          </span>
        </div>
        <div className="ev-invite-ways">
          {ways.map((w) => (
            <button key={w.k} className={"ev-invite-way" + (w.k === "copy" && copied ? " done" : "")} onClick={() => share(w.k)}>
              <span className="ic"><DSEV.IconifyIcon name={w.i} size={22} color={w.k === "copy" && copied ? "var(--success)" : "var(--brand-navy)"} /></span>
              <span className="l">{w.l}</span>
            </button>
          ))}
        </div>
        <div className="ev-invite-link">
          <span className="u">{link.replace(/^https?:\/\//, "").slice(0, 34)}…</span>
          <button onClick={() => share("copy")}>{copied ? "Copied" : "Copy"}</button>
        </div>
      </div>
    </div>
  );
}

/* ---- screen 2: event detail (open to everyone; gate fires on action) ---- */
function EventDetail({ onBack, onJoin, event }) {
  const d = Object.assign({}, EV_DETAIL, event || {});
  const [tab, setTab] = useStateEV("Overview");
  const [attending, setAttending] = useStateEV(() => evStatusOf(d, evStore()).registered);
  const [inCal, setInCal] = useStateEV(() => evStatusOf(d, evStore()).calendar);
  const [gate, setGate] = useStateEV(false);
  const [invite, setInvite] = useStateEV(false);
  const [toast, setToast] = useStateEV(false);
  useEffectEV(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(false), 4200);
    return () => clearTimeout(t);
  }, [toast]);
  const cta = evCta(d.state, attending);
  const register = () => {
    setAttending(true);
    setToast(true);
    if (d.id) evMark(d.id, { registered: true });
    try {
      const regs = JSON.parse(localStorage.getItem("pf-event-regs") || "[]");
      regs.unshift({ title: d.title, date: d.date, time: d.time, going: d.going || d.attendees });
      localStorage.setItem("pf-event-regs", JSON.stringify(regs.slice(0, 3)));
    } catch (e) {}
  };
  const act = () => {
    if (d.membersOnly && evIsFree() && !attending) { setGate(true); return; }
    if (d.state === "live") { onJoin(); return; }
    register();
  };
  const addToCalendar = () => {
    if (d.membersOnly && evIsFree() && !inCal) { setGate(true); return; }
    setInCal((v) => { const nv = !v; if (d.id) evMark(d.id, { calendar: nv }); return nv; });
  };
  return (
    <div className="ev-screen" data-screen-label="Event Details" key={d.title + d.date}>
      <header className="ev-head">
        <button className="ev-back" aria-label="Back" onClick={onBack}><DSEV.IconifyIcon name="lucide:arrow-left" size={22} color="var(--brand-navy)" /></button>
        <span className="ev-title">Event Details</span>
        <span className="spacer" />
      </header>
      <div className="ev-scroll">
        {d.banner
          ? <div className="ev-hero" style={{ backgroundImage: "url(" + d.banner + ")" }} />
          : <div className="ev-hero ev-hero-ph" role="img" aria-label={d.title + " — thumbnail coming soon"} />}
        <div className="ev-detail-body">
          <span className={"ev-live-badge" + (d.state === "live" ? " live" : "")}>
            {d.state === "live" ? <React.Fragment><span className="pulse" />Live now · started 4 min ago</React.Fragment> : "Live Event"}
          </span>
          <h1 className="ttl">{d.title}</h1>
          {d.membersOnly &&
          <span className="ev-members-tag">
            <DSEV.IconifyIcon name="fluent:premium-16-filled" size={15} color="#fff" />Members only
          </span>}
          <div className="ev-hostline">
            <span className="k">Hosted:</span>
            <span className="ev-hosts">
              <img src="assets/avatar-drtim.png" alt="" />
              {d.cohost && <img src="assets/avatar-miranda.jpg" alt="" />}
            </span>
            <a href="ProfileMobile.html"><b>{d.host}</b></a>
            {d.cohost && <React.Fragment> and <a href="ProfileMobile.html"><b>{d.cohost}</b></a></React.Fragment>}
          </div>
          <div className="ev-detail-meta">
            <span><DSEV.IconifyIcon name="lucide:calendar" size={20} color="var(--brand-navy)" />{d.date}</span>
            <span><DSEV.IconifyIcon name="lucide:clock" size={20} color="var(--brand-navy)" />{d.time}</span>
          </div>
          <div className="ev-attend">
            <span className="ev-faces">
              {CALL_PEOPLE.concat(CALL_PEOPLE.slice(0, 3)).map((p, i) => <DSEV.Avatar key={i} name={p.name} src={p.avatar} size={32} />)}
            </span>
            <span className="n">{d.attendees || d.going} other attendees</span>
          </div>
          <div className="ev-detail-actions">
            <button className={"ev-detail-cta" + cta.cls} onClick={act}>
              {cta.label}<DSEV.IconifyIcon name={cta.icon} size={18} color={attending ? "var(--success)" : "#fff"} />
            </button>
            <button className="ev-detail-cta ghost" onClick={() => setInvite(true)}>
              <DSEV.IconifyIcon name="lucide:user-plus" size={18} color="var(--brand-navy)" />Invite Your Colleagues
            </button>
          </div>
          <div className="ev-sec-actions one">
            <button className={"ev-sec-act" + (inCal ? " done" : "")} onClick={addToCalendar}>
              <DSEV.IconifyIcon name={inCal ? "lucide:calendar-check" : "lucide:calendar"} size={22} color={inCal ? "var(--success)" : "var(--brand-navy)"} />{inCal ? "Added to Calendar" : "Add to Calendar"}
            </button>
          </div>

          <div className="ev-dtabs" role="tablist">
            {["Overview", "About the Host", "Agenda"].map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} className={"ev-dtab" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          <h2 className="ev-sec-h">About this event</h2>
          <p className="ev-sec-p">{d.about}</p>

          <h2 className="ev-sec-h">You'll learn:</h2>
          <ul className="ev-checklist">
            {d.learn.map((l, i) => <li key={i}><DSEV.IconifyIcon name="lucide:check" size={19} color="var(--brand-navy)" />{l}</li>)}
          </ul>

          <div className="ev-stats">
            {d.stats.map((s, i) => (
              <div className="ev-stat" key={i}><span className="l">{s.l}</span><span className="n">{s.n}</span><span className="s">{s.s}</span></div>
            ))}
          </div>

          <h2 className="ev-sec-h">Event Status</h2>
          <div className="ev-status">
            {d.status.map((s, i) => (
              <div className="ev-status-row" key={i}><DSEV.IconifyIcon name={s.icon} size={20} color="var(--brand-navy)" />{s.t}</div>
            ))}
          </div>

          <h2 className="ev-sec-h">Who Should Attend</h2>
          <ul className="ev-checklist">
            {d.attend.map((l, i) => <li key={i}><DSEV.IconifyIcon name="lucide:check" size={19} color="var(--brand-navy)" />{l}</li>)}
          </ul>

          <h2 className="ev-sec-h">Need Help?</h2>
          <button className="ev-help">
            <span>Contact Support - We are here to help if you have any questions about this event.</span>
            <DSEV.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-450)" />
          </button>
        </div>
      </div>
      <EvTabBar active="Home" />
      {gate && <MembersGate onClose={() => setGate(false)} onUpgrade={() => goEV("SubscriptionMobile.html")} />}
      {invite && <InviteSheet title={d.title} event={d} onClose={() => setInvite(false)} />}
      {toast &&
      <div className="ev-toast" role="status">
        <DSEV.IconifyIcon name="lucide:check-circle-2" size={20} color="var(--success)" />
        <span>You're registered — shared to your feed.</span>
        <button onClick={() => goEV("NewsfeedMobile.html")}>View</button>
      </div>}
    </div>
  );
}

/* ---- live chat overlay ---- */
function LiveChat({ open, onClose }) {
  const [msgs, setMsgs] = useStateEV(CHAT_SEED);
  const [v, setV] = useStateEV("");
  const send = () => { const t = v.trim(); if (!t) return; setMsgs((m) => [...m, { who: "Katy Wilson", me: true, text: t }]); setV(""); };
  return (
    <div className={"ev-chat-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="ev-chat-scrim" onClick={onClose} />
      <aside className="ev-chat" role="dialog" aria-modal="true" aria-label="Live Chat">
        <div className="ev-chat-head">
          <span className="t">Live Chat</span>
          <button aria-label="Close chat" onClick={onClose}><DSEV.IconifyIcon name="lucide:x" size={22} color="var(--text-primary)" /></button>
        </div>
        <div className="ev-chat-body">
          {msgs.map((m, i) => (
            <div className={"ev-msg " + (m.me ? "me" : "them")} key={i}>
              <div className="who">{m.who}</div>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="ev-chat-foot">
          <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Type a message…" />
          <button className="ev-chat-send" aria-label="Send" onClick={send}><DSEV.IconifyIcon name="lucide:send" size={20} color="var(--white)" /></button>
        </div>
      </aside>
    </div>
  );
}

/* ---- screen 4: video call ---- */
function VideoCall({ onLeave }) {
  const [chat, setChat] = useStateEV(false);
  const [muted, setMuted] = useStateEV(true);
  const [cam, setCam] = useStateEV(true);
  return (
    <div className="ev-call" data-screen-label="Live Call">
      <div className="ev-call-top">
        <img src="assets/profinity-icon-twist.png" alt="PROfinity" />
        <span className="ev-call-timer"><DSEV.IconifyIcon name="lucide:clock" size={17} color="var(--white)" />00:32:54</span>
      </div>
      <div className="ev-stage">
        <img src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
        <div className="ev-pip"><img src="assets/avatar-katy.jpg" alt="You" /><span>You</span></div>
        <span className="ev-name-tag">Dr Tim Pearce <DSEV.IconifyIcon name="lucide:mic" size={15} color="var(--white)" /></span>
        <span className="ev-mic-off"><DSEV.IconifyIcon name="lucide:mic-off" size={14} color="var(--white)" />Mic off</span>
      </div>
      <div className="ev-thumbs">
        {CALL_PEOPLE.map((p, i) => (
          <div className="ev-thumb" key={i}><img src={p.avatar} alt={p.name} /><span>{p.name}</span></div>
        ))}
      </div>
      <div className="ev-controls">
        <button className={"ev-ctl" + (muted ? "" : " on")} onClick={() => setMuted((m) => !m)}>
          <span className="cbtn"><DSEV.IconifyIcon name={muted ? "lucide:mic-off" : "lucide:mic"} size={22} color="var(--white)" /></span>Mute
        </button>
        <button className={"ev-ctl" + (cam ? " on" : "")} onClick={() => setCam((c) => !c)}>
          <span className="cbtn"><DSEV.IconifyIcon name={cam ? "lucide:video" : "lucide:video-off"} size={22} color="var(--white)" /></span>Camera
        </button>
        <button className="ev-ctl">
          <span className="cbtn"><DSEV.IconifyIcon name="lucide:users" size={22} color="var(--white)" /></span>People
        </button>
        <button className="ev-ctl" onClick={() => setChat(true)}>
          <span className="cbtn"><DSEV.IconifyIcon name="lucide:message-circle" size={22} color="var(--white)" /></span>Chat
        </button>
        <button className="ev-ctl leave" onClick={onLeave}>
          <span className="cbtn"><DSEV.IconifyIcon name="lucide:phone-off" size={22} color="var(--white)" /></span>Leave
        </button>
      </div>
      <LiveChat open={chat} onClose={() => setChat(false)} />
    </div>
  );
}

/* ---- waiting room (between Join Live Now and the live call) ---- */
function WaitingRoom({ onBack, onAdmit, event }) {
  const d = Object.assign({}, EV_DETAIL, event || {});
  const [muted, setMuted] = useStateEV(false);
  const [cam, setCam] = useStateEV(true);
  return (
    <div className="ev-screen" data-screen-label="Waiting Room">
      <header className="ev-head">
        <button className="ev-back" aria-label="Back" onClick={onBack}><DSEV.IconifyIcon name="lucide:arrow-left" size={22} color="var(--brand-navy)" /></button>
        <span className="ev-title">Waiting Room</span>
        <span className="spacer" />
      </header>
      <div className="ev-scroll">
        <div className="ev-wait-banner">
          <DSEV.IconifyIcon name="lucide:circle-check" size={26} color="var(--success)" />
          <div>
            <div className="t">You're in the waiting room</div>
            <div className="s">The host will let you in shortly. Thank you for your patience.</div>
          </div>
        </div>
        <div className="ev-wait-card">
          <span className="ev-live-badge live"><span className="pulse" />Live now</span>
          <h1 className="ttl">{d.title}</h1>
          <p className="ev-wait-sub">Weekly live techniques, Q&amp;A and expert insights to elevate your skills</p>
          <div className="ev-wait-host"><DSEV.Avatar name={d.host} src="assets/avatar-drtim.png" size={36} />Hosted by <b>{d.cohost ? (d.host + " & " + d.cohost) : d.host}</b></div>
          <div className="ev-wait-meta">
            <span><DSEV.IconifyIcon name="lucide:calendar" size={19} color="var(--brand-navy)" />{d.date}</span>
            <span className="dotsep">•</span>
            <span><DSEV.IconifyIcon name="lucide:clock" size={19} color="var(--brand-navy)" />{d.time}</span>
          </div>
        </div>
        <div className="ev-wait-video">
          <img src="assets/waiting-self-preview.png" alt="You" />
          <span className="ev-wait-you">You</span>
          <div className="ev-wait-vctl">
            <button className={"vbtn" + (muted ? " off" : "")} aria-label="Mic" onClick={() => setMuted((m) => !m)}>
              <DSEV.IconifyIcon name={muted ? "lucide:mic-off" : "lucide:mic"} size={20} color="var(--white)" />
            </button>
            <button className={"vbtn" + (cam ? "" : " off")} aria-label="Camera" onClick={() => setCam((c) => !c)}>
              <DSEV.IconifyIcon name={cam ? "lucide:video" : "lucide:video-off"} size={20} color="var(--white)" />
            </button>
          </div>
        </div>
        <div className="ev-detail-actions ev-wait-actions">
          <button className="ev-detail-cta" onClick={onAdmit}>Join Now!</button>
          <button className="ev-detail-cta ghost">Share Event</button>
        </div>
        <p className="ev-wait-note">You'll automatically join the live session when the host admits you.</p>
        <h2 className="ev-sec-h">Need Help?</h2>
        <button className="ev-help">
          <DSEV.IconifyIcon name="lucide:circle-help" size={22} color="var(--brand-navy)" />
          <span>Contact Support - We are here to help if you have any questions about this event.</span>
          <DSEV.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-450)" />
        </button>
      </div>
      <EvTabBar active="Home" />
    </div>
  );
}

/* ---- app shell: list/detail/waiting/call screen stack, view + calendar
   month lifted here so Back returns you to the list in the view you left it
   (list stays list; calendar returns to the same month). ---- */
function EventsContent() {
  const [screen, setScreen] = useStateEV("list"); // list | detail | waiting | call
  const [sel, setSel] = useStateEV(null);
  const [view, setView] = useStateEV("list");
  const [cur, setCur] = useStateEV({ y: EV_TODAY.getFullYear(), m: EV_TODAY.getMonth() });
  return (
    <>
      {screen === "list" && <EventsList onBack={() => goEV("NewsfeedMobile.html")} onOpen={(e) => { setSel(e); setScreen("detail"); }} view={view} setView={setView} cur={cur} setCur={setCur} />}
      {screen === "detail" && <EventDetail event={sel} onBack={() => setScreen("list")} onJoin={() => setScreen("waiting")} />}
      {screen === "waiting" && <WaitingRoom event={sel} onBack={() => setScreen("detail")} onAdmit={() => setScreen("call")} />}
      {screen === "call" && <VideoCall onLeave={() => setScreen("detail")} />}
    </>
  );
}

function EventsApp() {
  const mobile = useIsMobileEV();
  const scale = useDeviceScaleEV();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><EventsContent /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><EventsContent /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<EventsApp />);
