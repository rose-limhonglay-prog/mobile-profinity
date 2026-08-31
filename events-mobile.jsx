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
/* Every Tuesday from `start` through `end`, inclusive (both plain Date). */
function evTuesdaysBetween(start, end) {
  const out = [];
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  d.setDate(d.getDate() + ((2 - d.getDay() + 7) % 7));
  while (d <= end) { out.push(new Date(d)); d.setDate(d.getDate() + 7); }
  return out;
}
/* Parse "March 17, 2026" / "November 26 – 30, 2026" into {y, m, d}. */
function evParse(date) {
  const m = EV_MONTHS.findIndex((n) => date.startsWith(n));
  const d = parseInt(date.replace(/^[A-Za-z]+\s+/, ""), 10);
  const y = parseInt(date.slice(-4), 10);
  return { y, m, d };
}

/* Ten events across 2026: Technique Tuesday recurs weekly, every Tuesday from
   August 4 through the end of December (co-hosted by Dr Tim Pearce & Miranda
   Pearce, soonest occurrence live), plus nine one-off events. */
const EVENTS_LIST = [
  ...evTuesdaysBetween(new Date(2026, 7, 4), new Date(2026, 11, 31)).map((d, i) => ({
    id: "tt" + i, title: "Technique Tuesday", host: "Dr Tim Pearce", cohost: "Miranda Pearce", banner: null,
    date: evFmtDate(d), time: "20:00 GMT", weekly: true, primary: i === 0,
    state: i === 0 ? "live" : "upcoming", going: i === 0 ? "342" : "128", watching: i === 0 ? "44" : undefined,
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
  { key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
  { key: "Learning", label: "Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
  { key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
  { key: "Rewards", label: "Rewards", icon: "lucide:gift", href: "RewardsDashboard.html" },
];

const CALL_PEOPLE = [
  { name: "Sarah", avatar: "assets/avatar-katy.jpg" },
  { name: "Jordan", avatar: "assets/avatar-drtim.png" },
  { name: "Priya", avatar: "assets/avatar-katy.jpg" },
  { name: "Marcus", avatar: "assets/avatar-drtim.png" },
];

/* ---- live stream: audience view seed data ---- */
const LS_ONCAM = [
  { id: "tim", name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", mic: true, speaking: true },
  { id: "miranda", name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", mic: true, speaking: false },
];
const LS_OFFCAM = [
  { id: "katy", name: "Katy Wilson", avatar: "assets/avatar-katy.jpg", mic: false, host: true },
  { id: "grace", name: "Grace Lindqvist", avatar: "assets/avatar-sarah-collins.jpg", mic: false, host: false },
];

const LS_REACT_EMOJI = ["❤️", "💜", "👏", "🔥", "🙌"];
const LS_COMPOSER_MORE = ["💜", "👏", "🔥", "🙌", "😂"];
const LS_BASKET_COUNT = 79;

/* ---- live stream: host view seed data — viewers who've raised a hand to
   join the stage, shown in the host's participants panel. ---- */
const LS_REQUESTS = [
  { id: "amir", name: "Amir Khan", avatar: "assets/avatar-amir-khan.jpg", note: "wants to demo a case" },
  { id: "mark", name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", note: "raised their hand" },
];

const LS_CHAT_SEED = [
  { name: "Dr Tim Pearce", text: "Good question — covering migration next" },
  { name: "Olivia Marsh", text: "Saved. Watching the replay tomorrow." },
  { name: "Ravi Chandra", text: "How do you review for asymmetry afterwards?" },
  { name: "Nadia Farouk", text: "This is gold, thank you Dr Pearce" },
  { name: "Sam O'Connell", text: "Anyone else taking notes for their next clinic day?" },
  { name: "Beth Okafor", text: "The fanning technique really clicked for me just now" },
  { name: "Marcus Webb", text: "Can you share the slide deck after?" },
  { name: "Priya Nair", text: "Miranda's tip on cannula angle was so useful" },
  { name: "Leah Whitmore", text: "First live session — loving it so far" },
  { name: "Dr Tim Pearce", text: "Great turnout tonight, keep the questions coming" },
  { name: "Josh Reilly", text: "Does this count toward my CPD hours?" },
  { name: "Ingrid Voss", text: "Watching from Oslo, thanks for the early slot!" },
];

const LS_PRODUCTS = [
  { num: 1, img: "assets/course-8d-lip-design.jpg", title: "8D Lip Design — full course", note: "CPD accredited", price: 468, was: 520, off: "-10%", flashSecs: 9437 },
  { num: 2, img: "assets/course-advanced-lip-techniques.jpg", title: "Advanced Lip Techniques", note: "CPD accredited", price: 342, was: 380, off: "-10%", flashSecs: 6120 },
  { num: 3, img: "assets/course-full-face-rejuvenation.jpg", title: "Full Face Rejuvenation", note: "Certificate included", price: 612, was: 680, off: "-10%", flashSecs: 4310 },
  { num: 4, img: "assets/course-brow-lift.jpg", title: "Brow Lift Masterclass", note: "CPD accredited", price: 396, was: 440, off: "-10%", flashSecs: 7215 },
  { num: 5, img: "assets/course-cheek-contouring.jpg", title: "Cheek Contouring Essentials", note: "Certificate included", price: 378, was: 420, off: "-10%", flashSecs: 5540 },
  { num: 6, img: "assets/course-complications.jpg", title: "Complications Management", note: "CPD accredited", price: 450, was: 500, off: "-10%", flashSecs: 8802 },
  { num: 7, img: "assets/course-consultation.jpg", title: "Consultation Skills for Injectors", note: "Certificate included", price: 270, was: 300, off: "-10%", flashSecs: 3190 },
  { num: 8, img: "assets/course-jawline-sculpting.jpg", title: "Jawline Sculpting", note: "CPD accredited", price: 414, was: 460, off: "-10%", flashSecs: 6710 },
  { num: 9, img: "assets/course-lip.png", title: "Lip Filler Fundamentals", note: "Certificate included", price: 288, was: 320, off: "-10%", flashSecs: 2985 },
  { num: 10, img: "assets/course-marketing.webp", title: "Clinic Marketing Blueprint", note: "CPD accredited", price: 324, was: 360, off: "-10%", flashSecs: 9010 },
  { num: 11, img: "assets/course-protox.png", title: "Tox Fundamentals", note: "Certificate included", price: 432, was: 480, off: "-10%", flashSecs: 4025 },
  { num: 12, img: "assets/course-rhinoplasty.jpg", title: "Non-Surgical Rhinoplasty", note: "CPD accredited", price: 558, was: 620, off: "-10%", flashSecs: 7960 },
  { num: 13, img: "assets/course-skin-boosters.jpg", title: "Skin Boosters Masterclass", note: "Certificate included", price: 306, was: 340, off: "-10%", flashSecs: 5325 },
  { num: 14, img: "assets/course-tear-trough.jpg", title: "Tear Trough Correction", note: "CPD accredited", price: 360, was: 400, off: "-10%", flashSecs: 6455 },
  { num: 15, img: "assets/course-temple-filler.webp", title: "Temple Filler Technique", note: "Certificate included", price: 342, was: 380, off: "-10%", flashSecs: 3720 },
  { num: 16, img: "assets/course-temple.png", title: "Temple Volumising", note: "CPD accredited", price: 315, was: 350, off: "-10%", flashSecs: 8340 },
  { num: 17, img: "assets/course-jawline-sculpting.jpg", title: "Advanced Jawline Sculpting", note: "CPD accredited", price: 522, was: 580, off: "-10%", flashSecs: 4590 },
  { num: 18, img: "assets/course-cheek-contouring.jpg", title: "Advanced Cheek Contouring", note: "Certificate included", price: 468, was: 520, off: "-10%", flashSecs: 7130 },
  { num: 19, img: "assets/course-rhinoplasty.jpg", title: "Non-Surgical Rhinoplasty — Advanced", note: "CPD accredited", price: 630, was: 700, off: "-10%", flashSecs: 2410 },
  { num: 20, img: "assets/course-complications.jpg", title: "Complications: Vascular Occlusion", note: "CPD accredited", price: 486, was: 540, off: "-10%", flashSecs: 5875 },
  { num: 21, img: "assets/course-skin-boosters.jpg", title: "Skin Boosters — Advanced Layering", note: "Certificate included", price: 360, was: 400, off: "-10%", flashSecs: 9155 },
  { num: 22, img: "assets/course-brow-lift.jpg", title: "Brow Lift — Advanced Shaping", note: "CPD accredited", price: 450, was: 500, off: "-10%", flashSecs: 3055 },
];

function lsFmtClock(totalSecs) {
  const s = Math.max(0, Math.floor(totalSecs));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return pad(h) + ":" + pad(m) + ":" + pad(sec);
}

/* Deterministic funnel numbers for the host's product-performance stats —
   clicks > add-to-cart > sold, seeded off each product's own num so the
   panel reads consistently without a real backing analytics feed. */
function lsProductStats(p) {
  const clicks = 20 + ((p.num * 37) % 80);
  const cart = Math.max(4, Math.round(clicks * 0.4));
  const sold = Math.max(1, Math.round(cart * 0.3));
  return { clicks, cart, sold };
}

function EvTabBar({ active }) {
  return (
    <nav className="ev-tabs" aria-label="Primary">
      {EV_TABS.map((t) => (
        <button key={t.key} className={"ev-tab" + (t.key === active ? " on" : "")} onClick={() => t.href && goEV(t.href)}>
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
    setInCal((v) => { const nv = !v; if (d.id) evMark(d.id, { calendar: nv }); return nv; });
  };
  const findStatus = (icon) => { const s = (d.status || []).find((s) => s.icon === icon); return s ? s.t : null; };
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

          <h2 className="ev-sec-h">About this event</h2>
          <p className="ev-sec-p">{d.about}</p>

          <h2 className="ev-sec-h">You'll learn:</h2>
          <ul className="ev-checklist">
            {d.learn.map((l, i) => <li key={i}><DSEV.IconifyIcon name="lucide:check" size={19} color="var(--brand-navy)" />{l}</li>)}
          </ul>

          <div className="ev-stats">
            <div className="ev-stat"><span className="l">Attendees</span><span className="n">{d.attendees || d.going}</span><span className="s">registered so far</span></div>
            <div className="ev-stat"><span className="l">Duration</span><span className="n">{findStatus("lucide:timer") || "60 min"}</span><span className="s">live session</span></div>
            <div className="ev-stat"><span className="l">Format</span><span className="n">{findStatus("lucide:video") || "Live Webinar"}</span><span className="s">{d.membersOnly ? "Members only" : "Open access"}</span></div>
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
      {gate && <MembersGate onClose={() => setGate(false)} onUpgrade={() => goEV("MembershipTier.html")} />}
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

/* ---- live stream: audience view. The member is watching, not presenting —
   no self camera, no mute/camera controls, just a stage, chat and a shop. ---- */
/* Note: nothing needing pointer events belongs inside LSStage — it's
   position:absolute and z-index:0, so its stacking context sits below the
   sibling .ls-overlay (z-index:2) regardless of z-index set on children
   here. LSTopBar/LSTitleBlock must render as .ls-screen siblings instead
   (see LiveStream), or their buttons become visually present but unclickable. */
function LSStage({ onCam, offCam }) {
  const n = onCam.length;
  return (
    <div className="ls-stage">
      <div className={"ls-grid n" + n}>
        {onCam.map((p) => (
          <div className={"ls-cell" + (p.speaking ? " speaking" : "") + (p.camOff ? " camoff" : "")} key={p.id}>
            {p.camOff ?
              <span className="ls-camoff-av"><img src={p.avatar} alt="" /></span> :
              <img className={p.rear ? "rear" : undefined} src={p.avatar} alt="" />}
            <span className="ls-namechip">
              {p.name}
              <DSEV.IconifyIcon name={p.mic ? "lucide:mic" : "lucide:mic-off"} size={13} color="#fff" />
            </span>
          </div>
        ))}
      </div>
      <div className="ls-offcam">
        {offCam.map((p) => (
          <div className="ls-offtile" key={p.id}>
            {p.host && <span className="cap">Host</span>}
            <img src={p.avatar} alt="" />
            <span className="nm">
              {p.name.split(" ")[0]}
              <DSEV.IconifyIcon name={p.mic ? "lucide:mic" : "lucide:mic-off"} size={10} color="#fff" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LSTopBar({ role, elapsed, viewers, onLeave, onEndClick, onParticipants, pendingCount }) {
  return (
    <div className="ls-topbar">
      <span className="ls-live"><span className="pulse" />LIVE</span>
      <span className="ls-timer">{lsFmtClock(elapsed)}</span>
      {role === "host" ?
        <button className="ls-viewers as-btn" aria-label={"Participants" + (pendingCount ? " — " + pendingCount + " requests" : "")} title="Participants" onClick={onParticipants}>
          <DSEV.IconifyIcon name="lucide:eye" size={14} color="#fff" />{viewers}
          {pendingCount > 0 && <span className="dot">{pendingCount}</span>}
        </button> :
        <span className="ls-viewers"><DSEV.IconifyIcon name="lucide:eye" size={14} color="#fff" />{viewers}</span>}
      {role === "host" ?
        <button className="ls-end" onClick={onEndClick}>End</button> :
        <button className="ls-close" aria-label={role === "speaker" ? "Leave stage" : "Leave stream"} title={role === "speaker" ? "Leave stage" : "Leave stream"} onClick={onLeave}>
          <DSEV.IconifyIcon name="lucide:x" size={18} color="#fff" />
        </button>}
    </div>
  );
}

function LSTitleBlock({ title, hosts }) {
  return (
    <div className="ls-titleblock">
      <div className="t">{title}</div>
      <div className="s">{hosts}</div>
    </div>
  );
}

/* Ambient + user-triggered reaction particles. Travel distance/duration are
   explicit px/seconds per particle — a percentage translateY would resolve
   against the emoji's own ~30px box and barely move. */
function useReactionParticles() {
  const [particles, setParticles] = useStateEV([]);
  const idRef = React.useRef(0);
  const spawn = (emoji) => {
    const id = ++idRef.current;
    const dist = Math.round(460 + Math.random() * 160);
    const dur = +(4.4 + Math.random() * 2).toFixed(2);
    const size = Math.round(20 + Math.random() * 14);
    const drift = Math.round(-22 + Math.random() * 44);
    const right = Math.round(18 + Math.random() * 46);
    setParticles((ps) => ps.concat([{ id, emoji, dist, dur, size, drift, right }]));
    setTimeout(() => setParticles((ps) => ps.filter((p) => p.id !== id)), dur * 1000 + 200);
  };
  useEffectEV(() => {
    const t = setInterval(() => spawn(LS_REACT_EMOJI[Math.floor(Math.random() * LS_REACT_EMOJI.length)]), 700);
    return () => clearInterval(t);
  }, []);
  return { particles, spawn };
}

function LSReactions({ particles }) {
  return (
    <div className="ls-reactions" aria-hidden="true">
      {particles.map((p) => (
        <span key={p.id} className="ls-particle" style={{
          right: p.right + "px", fontSize: p.size + "px", animationDuration: p.dur + "s",
          "--dist": p.dist + "px", "--drift": p.drift + "px",
        }}>{p.emoji}</span>
      ))}
    </div>
  );
}

function LSChat({ msgs }) {
  const ref = React.useRef(null);
  useEffectEV(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length]);
  return (
    <div className="ls-chat" ref={ref} aria-live="polite" aria-label="Live chat">
      <div className="ls-chat-inner">
        {msgs.map((m) => <div className="ls-msg" key={m.id}><b>{m.name}</b> {m.text}</div>)}
      </div>
    </div>
  );
}

function LSComposer({ value, onChange, onSend, onReact, onOpenBasket }) {
  return (
    <div className="ls-composer">
      {onOpenBasket &&
      <button className="ls-basket" aria-label={"Shop this stream — " + LS_BASKET_COUNT + " items"} title="Shop" onClick={onOpenBasket}>
        <DSEV.IconifyIcon name="lucide:shopping-basket" size={19} color="var(--brand-navy)" />
        <span className="badge">{LS_BASKET_COUNT}</span>
      </button>}
      <input className="ls-input" value={value} onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSend(); }} placeholder="Say something…" aria-label="Say something" />
      <button className="ls-send" aria-label="Send message" title="Send" onClick={onSend}>
        <DSEV.IconifyIcon name="lucide:send" size={17} color="#fff" />
      </button>
      <div className="ls-react">
        <button className="ls-heart" aria-label="Send heart reaction" title="React" onClick={() => onReact("❤️")}>❤️</button>
        <div className="ls-react-pop" role="menu" aria-label="More reactions">
          {LS_COMPOSER_MORE.map((e, i) => (
            <button key={i} role="menuitem" aria-label={"Send " + e + " reaction"} onClick={() => onReact(e)}>{e}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Audience-side popup for whatever product the host currently has pinned.
   It only closes when the viewer taps the X — no auto-hide, no auto-cycle
   — and pops back open whenever the host pins a new product. Tapping the
   basket re-shows the currently pinned product. */
function usePinnedPopup(pushedNum) {
  const [phase, setPhase] = useStateEV("hidden");
  const prevNum = React.useRef(null);
  const timer = React.useRef(null);
  useEffectEV(() => {
    if (pushedNum == null) {
      setPhase("hidden");
    } else if (pushedNum !== prevNum.current) {
      clearTimeout(timer.current);
      setPhase("visible");
    }
    prevNum.current = pushedNum;
  }, [pushedNum]);
  useEffectEV(() => () => clearTimeout(timer.current), []);
  const dismiss = () => {
    setPhase("out");
    timer.current = setTimeout(() => setPhase("hidden"), 500);
  };
  const show = () => { if (pushedNum != null) setPhase("visible"); };
  return { phase, dismiss, show };
}

function LSProductCard({ product, phase, onBuy, onClose }) {
  const [secs, setSecs] = useStateEV(product.flashSecs);
  useEffectEV(() => {
    setSecs(product.flashSecs);
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [product]);
  if (phase === "hidden") return null;
  return (
    <div className={"ls-product" + (phase === "out" ? " out" : "")}>
      <button className="x" aria-label="Dismiss offer" title="Dismiss" onClick={onClose}>
        <span className="dot"><DSEV.IconifyIcon name="lucide:x" size={13} color="var(--gray-500)" /></span>
      </button>
      <span className="thumb"><img src={product.img} alt="" /><b>{product.num}</b></span>
      <span className="tx">
        <span className="ttl">{product.title}</span>
        <span className="flash"><DSEV.IconifyIcon name="lucide:zap" size={11} color="var(--error)" />Flash sale · {lsFmtClock(secs)}</span>
        <span className="note">{product.note}</span>
        <span className="price">£{product.price.toFixed(2)} <s>£{product.was.toFixed(2)}</s> <i>{product.off}</i></span>
      </span>
      <button className="buy" onClick={() => onBuy(product)}>Buy</button>
    </div>
  );
}

function LSShowcase({ onClose, onBuy }) {
  useEffectEV(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="ev-sheet" role="dialog" aria-modal="true" aria-label="Shop this stream">
      <button className="ev-sheet-scrim" aria-label="Close" onClick={onClose} />
      <div className="ev-sheet-card ls-showcase">
        <span className="ev-sheet-grab" />
        <div className="ls-showcase-hd">
          <span className="brand">Profinity</span>
          <button className="ev-sheet-x" aria-label="Close" onClick={onClose}><DSEV.IconifyIcon name="lucide:x" size={20} color="var(--gray-500)" /></button>
        </div>
        <div className="ls-rows">
          {LS_PRODUCTS.map((p, i) => (
            <div className="ls-row" key={p.num}>
              <span className="thumb"><img src={p.img} alt="" /><b>{p.num}</b></span>
              <span className="tx">
                {i === 0 && <span className="tag live"><span className="d" />LIVE now</span>}
                {i === 1 && <span className="tag trend">On Trend</span>}
                <span className="ttl">{p.title}</span>
                <span className="perk">{p.note} · Certificate included</span>
                <span className="flash"><DSEV.IconifyIcon name="lucide:zap" size={11} color="var(--error)" />{lsFmtClock(p.flashSecs)}</span>
                <span className="price">£{p.price.toFixed(2)} <s>£{p.was.toFixed(2)}</s> <i>{p.off}</i></span>
              </span>
              <button className="buy" onClick={() => onBuy(p)}>Buy</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Echo of whatever the host is currently pushing to viewers (LSHostShowcase).
   For the speaker this is read-only — see what's pinned so they can talk to
   it, without granting them showcase controls of their own; the host gets
   an Unpin action since it's their own push. */
function LSPinnedForViewers({ product, onUnpin }) {
  if (!product) return null;
  return (
    <div className="ls-pinned">
      <span className="thumb"><img src={product.img} alt="" /></span>
      <span className="tx">
        <span className="lbl">Pinned for viewers</span>
        <span className="ttl">{product.title}</span>
        <span className="price">£{product.price.toFixed(2)}</span>
      </span>
      {onUnpin && <button className="unpin" onClick={onUnpin}>Unpin</button>}
    </div>
  );
}

/* ---- live stream: host + speaker controls. Host runs the stage (device
   toggles, admits raised hands, ends for everyone); speaker just controls
   their own mic/camera/facing while presenting — no moderation power. ---- */
function LSToolbar({ role, mic, cam, onToggleMic, onToggleCam, onFlipCam, onShowcase, pushedNum }) {
  if (role === "host") {
    return (
      <div className="ls-toolbar ls-toolbar-pills">
        <button className={"ls-pillbtn" + (mic ? "" : " off")} aria-label={mic ? "Mute microphone" : "Unmute microphone"} title="Microphone" onClick={onToggleMic}>
          <DSEV.IconifyIcon name={mic ? "lucide:mic" : "lucide:mic-off"} size={20} color="#fff" />
          <span>{mic ? "Live" : "Muted"}</span>
        </button>
        <button className={"ls-pillbtn" + (cam ? "" : " off")} aria-label={cam ? "Turn camera off" : "Turn camera on"} title="Camera" onClick={onToggleCam}>
          <DSEV.IconifyIcon name={cam ? "lucide:video" : "lucide:video-off"} size={20} color="#fff" />
          <span>{cam ? "On" : "Off"}</span>
        </button>
        <button className="ls-pillbtn neutral" aria-label="Flip camera" title="Flip camera" onClick={onFlipCam}>
          <DSEV.IconifyIcon name="lucide:refresh-cw" size={20} color="#fff" />
          <span>Flip</span>
        </button>
        <button className="ls-pillbtn gold" aria-label="Products" title="Products" onClick={onShowcase}>
          <DSEV.IconifyIcon name="lucide:shopping-bag" size={20} color="#fff" />
          <span>Products</span>
          {pushedNum != null && <span className="dot" aria-hidden="true" />}
        </button>
      </div>
    );
  }
  return (
    <div className="ls-toolbar ls-toolbar-pills">
      <button className={"ls-pillbtn" + (mic ? "" : " off")} aria-label={mic ? "Mute microphone" : "Unmute microphone"} title="Microphone" onClick={onToggleMic}>
        <DSEV.IconifyIcon name={mic ? "lucide:mic" : "lucide:mic-off"} size={20} color="#fff" />
        <span>{mic ? "Live" : "Muted"}</span>
      </button>
      <button className={"ls-pillbtn" + (cam ? "" : " off")} aria-label={cam ? "Turn camera off" : "Turn camera on"} title="Camera" onClick={onToggleCam}>
        <DSEV.IconifyIcon name={cam ? "lucide:video" : "lucide:video-off"} size={20} color="#fff" />
        <span>{cam ? "On" : "Off"}</span>
      </button>
      <button className="ls-pillbtn neutral" aria-label="Flip camera" title="Flip camera" onClick={onFlipCam}>
        <DSEV.IconifyIcon name="lucide:refresh-cw" size={20} color="#fff" />
        <span>Flip</span>
      </button>
    </div>
  );
}

function LSEndConfirm({ onCancel, onConfirm }) {
  useEffectEV(() => {
    const esc = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onCancel]);
  return (
    <div className="ev-sheet" role="dialog" aria-modal="true" aria-label="End live stream">
      <button className="ev-sheet-scrim" aria-label="Close" onClick={onCancel} />
      <div className="ev-sheet-card">
        <span className="ev-gate-ic warn"><DSEV.IconifyIcon name="lucide:radio" size={26} color="var(--error)" /></span>
        <h3 className="ev-sheet-ttl">End the live stream?</h3>
        <p className="ev-sheet-p">Everyone watching will be disconnected and the stream will end for all viewers. This can't be undone.</p>
        <button className="ev-detail-cta danger" onClick={onConfirm}>End live stream</button>
        <button className="ev-detail-cta ghost" onClick={onCancel}>Keep streaming</button>
      </div>
    </div>
  );
}

function LSParticipants({ onCam, offCam, onToggleMute, requests, onApprove, onDecline, onClose }) {
  useEffectEV(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const live = onCam.concat(offCam);
  return (
    <div className="ev-sheet" role="dialog" aria-modal="true" aria-label="Participants">
      <button className="ev-sheet-scrim" aria-label="Close" onClick={onClose} />
      <div className="ev-sheet-card ls-participants">
        <span className="ev-sheet-grab" />
        <div className="ls-showcase-hd">
          <span className="brand">Participants</span>
          <button className="ev-sheet-x" aria-label="Close" onClick={onClose}><DSEV.IconifyIcon name="lucide:x" size={20} color="var(--gray-500)" /></button>
        </div>

        {requests.length > 0 &&
        <React.Fragment>
          <h4 className="ls-plabel">Requests to speak</h4>
          <div className="ls-preqs">
            {requests.map((r) => (
              <div className="ls-preq" key={r.id}>
                <img src={r.avatar} alt="" />
                <span className="tx"><b>{r.name}</b><span>{r.note}</span></span>
                <button className="ok" aria-label={"Approve " + r.name} title="Approve" onClick={() => onApprove(r)}><DSEV.IconifyIcon name="lucide:check" size={16} color="#fff" /></button>
                <button className="no" aria-label={"Decline " + r.name} title="Decline" onClick={() => onDecline(r)}><DSEV.IconifyIcon name="lucide:x" size={16} color="var(--gray-500)" /></button>
              </div>
            ))}
          </div>
        </React.Fragment>}

        <h4 className="ls-plabel">Live now — {live.length}</h4>
        <div className="ls-plist">
          {live.map((p) => (
            <div className="ls-prow" key={p.id}>
              <img src={p.avatar} alt="" />
              <span className="tx"><b>{p.name}</b>{p.host && <span className="cap">Host</span>}</span>
              <button className={"mute" + (p.mic ? "" : " off")} aria-label={p.mic ? "Mute " + p.name : "Unmute " + p.name} title="Mute" onClick={() => onToggleMute(p)}>
                <DSEV.IconifyIcon name={p.mic ? "lucide:mic" : "lucide:mic-off"} size={16} color={p.mic ? "var(--text-primary)" : "var(--error)"} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LSHostShowcase({ pushedNum, onTogglePush, viewers, onClose }) {
  useEffectEV(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const rows = LS_PRODUCTS.slice(0, 6).map((p) => Object.assign({}, p, lsProductStats(p)));
  const totalSales = rows.reduce((s, p) => s + p.sold * p.price, 0);
  const totalClicks = rows.reduce((s, p) => s + p.clicks, 0);
  return (
    <div className="ev-sheet" role="dialog" aria-modal="true" aria-label="Products">
      <button className="ev-sheet-scrim" aria-label="Close" onClick={onClose} />
      <div className="ev-sheet-card ls-showcase">
        <span className="ev-sheet-grab" />
        <div className="ls-showcase-hd">
          <span className="brand">Products</span>
          <button className="ev-sheet-x" aria-label="Close" onClick={onClose}><DSEV.IconifyIcon name="lucide:x" size={20} color="var(--gray-500)" /></button>
        </div>
        <div className="ls-pstats">
          <span className="c"><span className="n">£{totalSales.toLocaleString()}</span><span className="l">Sales</span></span>
          <span className="c"><span className="n">{viewers}</span><span className="l">Current viewers</span></span>
          <span className="c"><span className="n">{totalClicks}</span><span className="l">Product clicks</span></span>
        </div>
        <div className="ls-rows">
          {rows.map((p) => {
            const pinned = p.num === pushedNum;
            const off = p.was - p.price;
            return (
              <div className="ls-row" key={p.num}>
                <span className="thumb"><img src={p.img} alt="" /><b>{p.num}</b></span>
                <span className="tx">
                  {pinned &&
                  <span className="tagrow">
                    <span className="tag pinned"><DSEV.IconifyIcon name="lucide:pin" size={10} color="var(--premium-gold-deep)" />Pinned</span>
                    <span className="tag hot"><DSEV.IconifyIcon name="lucide:flame" size={10} color="#fff" />Hot deal</span>
                  </span>}
                  <span className="ttl">{p.title}</span>
                  <span className="tag off">Extra £{off} off</span>
                  <span className="price">£{p.price.toFixed(2)} <s>£{p.was.toFixed(2)}</s></span>
                </span>
                <button className={"pin" + (pinned ? " on" : "")} onClick={() => onTogglePush(pinned ? null : p.num)}>{pinned ? "Unpin" : "Pin"}</button>
                <div className="ls-pstats sm">
                  <span className="c"><span className="n">{p.sold}</span><span className="l">Items sold</span></span>
                  <span className="c"><span className="n">{p.cart}</span><span className="l">Add-to-cart</span></span>
                  <span className="c"><span className="n">{p.clicks}</span><span className="l">Clicks</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const LS_ROLES = [
  { key: "audience", label: "Audience" },
  { key: "host", label: "Host" },
  { key: "speaker", label: "Speaker" },
];

/* Dev-only preview control — lets whoever's demoing this screen flip
   between the three live-stream views without separate URLs/logins. */
function LSRoleSwitcher({ role, onChange }) {
  return (
    <div className="ls-roleswitch" role="group" aria-label="Preview role">
      {LS_ROLES.map((r) => (
        <button key={r.key} className={role === r.key ? "on" : ""} onClick={() => onChange(r.key)}>{r.label}</button>
      ))}
    </div>
  );
}

function LiveStream({ event, onLeave }) {
  const d = Object.assign({}, EV_DETAIL, event || {});
  const hostline = d.cohost ? (d.host + " & " + d.cohost) : d.host;
  const [elapsed, setElapsed] = useStateEV(1990);
  const [viewers] = useStateEV(() => (d.watching ? Number(d.watching) * 8 : 350));
  const { particles, spawn } = useReactionParticles();
  const [msgs, setMsgs] = useStateEV(() => LS_CHAT_SEED.map((m, i) => Object.assign({ id: i }, m)));
  const [val, setVal] = useStateEV("");
  const [showcase, setShowcase] = useStateEV(false);
  const [pushedNum, setPushedNum] = useStateEV(LS_PRODUCTS[0].num);
  const pinnedPopup = usePinnedPopup(pushedNum);

  /* Host + speaker preview state — role defaults to audience (today's real
     behaviour is unchanged); switching roles is a dev-only affordance via
     LSRoleSwitcher, not a real permissions system. */
  const [role, setRole] = useStateEV("audience");
  const [selfMic, setSelfMic] = useStateEV(true);
  const [selfCam, setSelfCam] = useStateEV(true);
  const [selfFront, setSelfFront] = useStateEV(true);
  const [onCamPeople, setOnCamPeople] = useStateEV(() => LS_ONCAM.map((p) => Object.assign({}, p)));
  const [offCamPeople, setOffCamPeople] = useStateEV(() => LS_OFFCAM.map((p) => Object.assign({}, p)));
  const [requests, setRequests] = useStateEV(LS_REQUESTS);
  const [panel, setPanel] = useStateEV(null); // null | "participants" | "showcase" | "end"

  /* Katy Wilson (the logged-in user, PFAEV.ME) already sits in LS_OFFCAM as
     a host chip — speaker role promotes her into the main stage grid,
     host role just wires her chip's mic icon to the self-mic toggle. */
  const stageOnCam = role === "speaker" ?
    onCamPeople.concat([{ id: "katy", name: "Katy Wilson", avatar: "assets/avatar-katy.jpg", mic: selfMic, speaking: selfMic, camOff: !selfCam, rear: !selfFront }]) :
    onCamPeople;
  const stageOffCam = role === "host" ?
    offCamPeople.map((p) => p.id === "katy" ? Object.assign({}, p, { mic: selfMic }) : p) :
    role === "speaker" ?
    offCamPeople.filter((p) => p.id !== "katy") :
    offCamPeople;

  const toggleMute = (p) => {
    if (p.id === "katy") { setSelfMic((m) => !m); return; }
    setOnCamPeople((arr) => arr.map((x) => x.id === p.id ? Object.assign({}, x, { mic: !x.mic }) : x));
    setOffCamPeople((arr) => arr.map((x) => x.id === p.id ? Object.assign({}, x, { mic: !x.mic }) : x));
  };
  const approveRequest = (r) => {
    setOnCamPeople((arr) => arr.concat([{ id: r.id, name: r.name, avatar: r.avatar, mic: true, speaking: false }]));
    setRequests((rs) => rs.filter((x) => x.id !== r.id));
  };
  const declineRequest = (r) => setRequests((rs) => rs.filter((x) => x.id !== r.id));

  useEffectEV(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffectEV(() => {
    let i = LS_CHAT_SEED.length;
    const t = setInterval(() => {
      const next = LS_CHAT_SEED[i % LS_CHAT_SEED.length];
      i++;
      setMsgs((m) => {
        const last = m[m.length - 1];
        if (last && last.name === next.name && last.text === next.text) return m;
        return m.slice(-40).concat([Object.assign({ id: Date.now() }, next)]);
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);

  useEffectEV(() => {
    const esc = (e) => e.key === "Escape" && onLeave();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onLeave]);

  const send = () => {
    const t = val.trim();
    if (!t) return;
    const me = (PFAEV && PFAEV.ME && PFAEV.ME.name) || "You";
    setMsgs((m) => m.slice(-40).concat([{ id: Date.now(), name: me, text: t }]));
    setVal("");
  };

  const buy = (p) => {
    const params = new URLSearchParams({ title: p.title, instr: "Dr. Tim Pearce", price: String(p.price) });
    goEV("CourseCheckout.html?" + params.toString());
  };

  return (
    <div className="ls-screen" data-screen-label="Live Stream">
      <LSStage onCam={stageOnCam} offCam={stageOffCam} />
      <LSTopBar role={role} elapsed={elapsed} viewers={viewers} onLeave={onLeave} onEndClick={() => setPanel("end")}
        onParticipants={() => setPanel("participants")} pendingCount={requests.length} />
      <LSTitleBlock title={d.title} hosts={hostline} />

      {/* Everything below floats over the full-bleed camera feed — the
          stage is the whole screen, not just a top strip. */}
      <div className="ls-overlay">
        <LSChat msgs={msgs} />

        {role === "audience" && pushedNum != null && pinnedPopup.phase !== "hidden" &&
          <LSProductCard product={LS_PRODUCTS.find((p) => p.num === pushedNum)} phase={pinnedPopup.phase} onBuy={buy} onClose={pinnedPopup.dismiss} />}

        {role !== "audience" && pushedNum &&
          <LSPinnedForViewers product={LS_PRODUCTS.find((p) => p.num === pushedNum)}
            onUnpin={role === "host" ? () => setPushedNum(null) : undefined} />}

        {role !== "audience" &&
          <LSToolbar role={role} mic={selfMic} cam={selfCam}
            onToggleMic={() => setSelfMic((m) => !m)} onToggleCam={() => setSelfCam((c) => !c)}
            onFlipCam={() => setSelfFront((f) => !f)}
            onShowcase={() => setPanel("showcase")} pushedNum={pushedNum} />}

        <LSComposer value={val} onChange={setVal} onSend={send} onReact={spawn}
          onOpenBasket={role === "audience" ? () => { setShowcase(true); pinnedPopup.show(); } : undefined} />
      </div>

      <LSReactions particles={particles} />

      {role === "audience" && showcase && <LSShowcase onClose={() => setShowcase(false)} onBuy={buy} />}

      {role === "host" && panel === "participants" &&
        <LSParticipants onCam={stageOnCam} offCam={stageOffCam} onToggleMute={toggleMute}
          requests={requests} onApprove={approveRequest} onDecline={declineRequest} onClose={() => setPanel(null)} />}
      {role === "host" && panel === "showcase" &&
        <LSHostShowcase pushedNum={pushedNum} onTogglePush={setPushedNum} viewers={viewers} onClose={() => setPanel(null)} />}
      {role === "host" && panel === "end" &&
        <LSEndConfirm onCancel={() => setPanel(null)} onConfirm={onLeave} />}

      <LSRoleSwitcher role={role} onChange={setRole} />
    </div>
  );
}

/* ---- waiting room: the live lobby shown between "Join Live Now" and the
   live stream. Full-bleed host camera, no self-preview or camera permission
   — the audience joins muted with camera off, so this is a lobby, not a
   device check. A member "arrives" in the chat every ~2.6s. ---- */
const EV_ARRIVALS = [
  { name: "Miranda Pearce", text: "Just joined — excited for this one" },
  { name: "Aisha Rahman", text: "Can't wait, my first Technique Tuesday 🙌" },
  { name: "Grace Lindqvist", text: "Hello from Stockholm!" },
  { name: "Jonas Adeyemi", text: "Hoping he covers migration tonight" },
];

function WaitingRoom({ onBack, onJoin, event }) {
  const d = Object.assign({}, EV_DETAIL, event || {});
  const watching = d.watching || d.going || "40";
  const [msgs, setMsgs] = useStateEV(() => [Object.assign({ id: 0 }, EV_ARRIVALS[0])]);
  useEffectEV(() => {
    let i = 1;
    const t = setInterval(() => {
      setMsgs((m) => m.slice(-4).concat([Object.assign({ id: Date.now() }, EV_ARRIVALS[i % EV_ARRIVALS.length])]));
      i++;
    }, 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="ev-lobby" data-screen-label="Waiting Room" style={{ backgroundImage: "url(assets/live-preview-camera.jpg)" }}>
      <div className="ev-lobby-scrim" aria-hidden="true" />

      <div className="ev-lobby-top">
        <button className="ev-lobby-back" aria-label="Back" title="Back" onClick={onBack}>
          <DSEV.IconifyIcon name="lucide:chevron-left" size={24} color="#fff" />
        </button>
        <span className="ev-lobby-live"><span className="pulse" />LIVE NOW</span>
        <span className="ev-lobby-viewers"><DSEV.IconifyIcon name="lucide:users" size={15} color="#fff" />{watching}</span>
      </div>

      <div className="ev-lobby-center">
        <span className="ev-lobby-badge"><DSEV.IconifyIcon name="lucide:radio" size={28} color="#fff" /></span>
        <h1 className="ev-lobby-h">{d.title} is live now</h1>
        <p className="ev-lobby-lead"><b>{watching} clinicians</b> are already watching. Tap below to join — no approval needed.</p>
        <p className="ev-lobby-desc">Join {d.host} every week for a live, interactive session — expert technique demonstrations, your questions answered, and the latest thinking in aesthetic medicine.</p>
        <ul className="ev-lobby-checks">
          <li><DSEV.IconifyIcon name="lucide:check" size={16} color="var(--success)" />Step-by-step technique demonstration</li>
          <li><DSEV.IconifyIcon name="lucide:check" size={16} color="var(--success)" />Live Q&amp;A with the panel</li>
          <li><DSEV.IconifyIcon name="lucide:check" size={16} color="var(--success)" />Real-world case studies</li>
        </ul>
      </div>

      <div className="ev-lobby-chat" aria-live="polite">
        {msgs.map((m) => <div className="ev-lobby-msg" key={m.id}><b>{m.name}</b> {m.text}</div>)}
      </div>

      <button className="ev-lobby-join" onClick={onJoin}>
        <DSEV.IconifyIcon name="lucide:radio" size={19} color="#fff" />Join the live
      </button>
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
  /* Where the waiting room's back button returns to: a live event tapped
     straight from the list skips detail entirely, so back must return to
     the list — not a detail screen the user never saw. */
  const [waitFrom, setWaitFrom] = useStateEV("list");
  const open = (e) => {
    setSel(e);
    if (e.state === "live") { setWaitFrom("list"); setScreen("waiting"); }
    else { setScreen("detail"); }
  };
  return (
    <>
      {screen === "list" && <EventsList onBack={() => goEV("NewsfeedMobile.html")} onOpen={open} view={view} setView={setView} cur={cur} setCur={setCur} />}
      {screen === "detail" && <EventDetail event={sel} onBack={() => setScreen("list")} onJoin={() => { setWaitFrom("detail"); setScreen("waiting"); }} />}
      {screen === "waiting" && <WaitingRoom event={sel} onBack={() => setScreen(waitFrom)} onJoin={() => setScreen("call")} />}
      {screen === "call" && <LiveStream event={sel} onLeave={() => setScreen("detail")} />}
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
