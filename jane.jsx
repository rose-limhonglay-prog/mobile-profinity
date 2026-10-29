/* ===========================================================================
   PROfinity — Jane (patient) app · iPhone 17 Pro Max
   The second mobile link (profinity-mobile-2.vercel.app) is the PATIENT side
   of PROfinity: "Jane" is the patient persona, "Katie/Katy" the clinician
   (same split as the Flutter app's user_type 'jane' | 'katy'). One bundle
   serves ten shells, picked by window.PF_JN_PAGE:
     home · profile · onboarding · wearables · health · coach · events · messages
   Everything persists in localStorage under pf-jane-*. Suffixed -JN.
   =========================================================================== */
const { useState: useStateJN, useEffect: useEffectJN, useRef: useRefJN, useMemo: useMemoJN } = React;
const DSJN = window.ProfinityDesignSystem_c2b5cc;
const JN_PAGE = window.PF_JN_PAGE || "home";

function goJN(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function hereJN() { return (window.location.pathname.split("/").pop() || "JaneNewsfeed.html") + window.location.search; }
function qJN(k) { try { return new URLSearchParams(window.location.search).get(k); } catch (e) { return null; } }
function readJN(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }
function saveJN(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
const IcJN = ({ name, size = 20, color = "currentColor", style }) => <DSJN.IconifyIcon name={"lucide:" + name} size={size} color={color} style={style} />;

/* ---- people ------------------------------------------------------------ */
const JANE = { id: "jane", name: "Jane Taylor", first: "Jane", avatar: "assets/avatar-sarah-collins.jpg", role: "Patient", clinic: "Pearce Aesthetics", passId: "HP-2048-JT", dob: "14 Mar 1991", since: "Jun 2026" };
const KATY = { id: "katy", name: "Katy Wilson", first: "Katy", avatar: "assets/avatar-katy.jpg", role: "Clinician", title: "Registered Nurse · Pearce Aesthetics" };
const PEOPLE = {
  katy: KATY,
  beth: { id: "beth", name: "Nurse Beth", first: "Beth", avatar: "assets/avatar-nurse-beth.jpg", role: "Clinician", title: "Aesthetic Nurse" },
  priya: { id: "priya", name: "Dr Priya Shah", first: "Dr Priya", avatar: "assets/avatar-priya-shah.jpg", role: "Clinician", title: "Aesthetic Doctor" },
  miranda: { id: "miranda", name: "Miranda P.", avatar: "assets/avatar-miranda.jpg", role: "Patient", title: "Patient · 6 weeks post treatment" },
  amir: { id: "amir", name: "Amir K.", avatar: "assets/avatar-amir-khan.jpg", role: "Patient", title: "Patient · new" },
  mark: { id: "mark", name: "Mark E.", avatar: "assets/avatar-mark-ellis.jpg", role: "Patient", title: "Patient" },
  reception: { id: "reception", name: "Pearce Aesthetics", avatar: "assets/profinity-icon-purple-gold.png", role: "Clinic", title: "Reception" },
  jane: JANE,
};

/* ---- tabs + chrome ---------------------------------------------------- */
const JN_TABS = [
  { key: "home", label: "Home", icon: "home", href: "JaneNewsfeed.html" },
  { key: "health", label: "Health", icon: "heart-pulse", href: "JaneHealth.html" },
  { key: "coach", label: "Coach", icon: "sparkles", href: "JaneCoach.html" },
  { key: "events", label: "Events", icon: "calendar", href: "JaneEvents.html" },
  { key: "profile", label: "Profile", icon: "user", href: "JaneProfile.html" },
];

function useIsMobileJN() {
  const [m, setM] = useStateJN(() => window.matchMedia("(max-width:768px)").matches);
  useEffectJN(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setM(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return m;
}
function useDeviceScaleJN() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [s, setS] = useStateJN(calc);
  useEffectJN(() => { const u = () => setS(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return s;
}
function useToastJN() {
  const [t, setT] = useStateJN(null);
  const ref = useRefJN(null);
  return [t, (msg) => { setT(msg); clearTimeout(ref.current); ref.current = setTimeout(() => setT(null), 2200); }];
}
function unreadDMJN() { return readJN("pf-jane-dm", null) ? readJN("pf-jane-dm", {}).convs.reduce((n, c) => n + (c.unread || 0), 0) : 2; }

function JNTabs({ active, compact }) {
  return (
    <nav className={"jn-tabs" + (compact ? " jn-tabs-compact" : "")} aria-label="Primary">
      {JN_TABS.map((t) => (
        <button key={t.key} className={"jn-tab" + (t.key === active ? " on" : "")} onClick={() => t.key !== active && goJN(t.href)}>
          <span className="ic"><IcJN name={t.icon} size={22} color={t.key === active ? "#fff" : "var(--gray-450)"} /></span>
          <span className="lbl">{t.label}</span>
        </button>))}
    </nav>);
}
function JNTop({ title, sub }) {
  const unread = unreadDMJN();
  return (
    <header className="jn-top">
      <button className="jn-avbtn" aria-label="Profile" onClick={() => goJN("JaneProfile.html")}><img src={JANE.avatar} alt="" /></button>
      <div className="jn-top-txt">
        {title ? <h1>{title}</h1> : <img className="jn-logo" src="assets/profinity-icon-purple-gold.png" alt="PROfinity" />}
        {sub && <span>{sub}</span>}
      </div>
      <span className="grow" />
      <button className="jn-iconbtn" aria-label="Messages" onClick={() => goJN("JaneMessages.html")}>
        <IcJN name="message-circle" size={20} color="var(--brand-navy)" />{unread > 0 && <span className="dot">{unread}</span>}
      </button>
    </header>);
}
function JNBar({ title, back, trailing }) {
  return (
    <header className="jn-bar">
      <button className="jn-back" aria-label="Back" onClick={() => (typeof back === "function" ? back() : goJN(back || "JaneNewsfeed.html"))}><IcJN name="chevron-left" size={26} color="var(--brand-navy)" /></button>
      <h1>{title}</h1>
      <span className="jn-bar-tr">{trailing}</span>
    </header>);
}
function JNSheet({ open, onClose, title, children, tall }) {
  if (!open) return null;
  return (
    <div className="jn-sheet-wrap" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="jn-scrim" aria-label="Close" onClick={onClose} />
      <div className={"jn-sheet" + (tall ? " tall" : "")}>
        <span className="jn-handle" />
        {title && <h3 className="jn-sheet-ttl">{title}</h3>}
        {children}
      </div>
    </div>);
}
function JNToast({ toast }) { return toast ? <div className="jn-toast" role="status"><IcJN name="check" size={16} color="#fff" />{toast}</div> : null; }
function JNFace({ p, size = 40, className }) { return <img className={"jn-face " + (className || "")} src={p.avatar} alt="" style={{ width: size, height: size }} />; }
function RoleChip({ p }) { return <span className={"jn-role " + (p.role === "Clinician" ? "cl" : p.role === "Clinic" ? "cl" : "pt")}>{p.role}</span>; }

/* ---- shared stores ---------------------------------------------------- */
const ONB_KEY = "pf-jane-onboarding";
function onbState() { return readJN(ONB_KEY, { answers: {}, step: 0, done: false }); }
const ONB_STEPS = [
  { key: "reason", q: "What brings you to the clinic?", sub: "Pick everything that applies.", multi: true, opts: ["Skin quality & glow", "Lines & wrinkles", "Lips", "Volume loss", "Acne or scarring", "Just exploring"] },
  { key: "history", q: "Have you had aesthetic treatments before?", multi: false, opts: ["Never — this is my first", "Once or twice", "Regularly", "I'm between clinics"] },
  { key: "medical", q: "Anything we should know medically?", sub: "Shared only with your clinician.", multi: true, opts: ["No known allergies", "Allergy to lidocaine", "Cold sores (HSV)", "Autoimmune condition", "Pregnant or breastfeeding", "Blood thinners"] },
  { key: "sleep", q: "How much sleep do you usually get?", multi: false, opts: ["Less than 6 hours", "6–7 hours", "7–8 hours", "More than 8 hours"] },
  { key: "habits", q: "Daily habits", sub: "Honest answers make better advice.", multi: true, opts: ["SPF every day", "2L+ water a day", "I smoke or vape", "Regular exercise", "Retinol at night", "Skip skincare some days"] },
  { key: "goals", q: "Goals for the next 3 months", multi: true, opts: ["Clearer, brighter skin", "A natural refresh", "Better sleep", "A routine I actually keep", "Feel more confident", "Prepare for an event"] },
];
const WEAR_KEY = "pf-jane-wearables";
const WEARABLES = [
  { id: "apple", name: "Apple Health", sub: "Sleep · Steps · Heart rate · Mindfulness", icon: "heart-pulse", tint: "#ff3b5c" },
  { id: "oura", name: "Oura Ring", sub: "Sleep stages · Readiness · HRV", icon: "circle", tint: "#2b2b4f" },
  { id: "fitbit", name: "Fitbit", sub: "Steps · Sleep · Active minutes", icon: "activity", tint: "#00b0b9" },
  { id: "garmin", name: "Garmin", sub: "Training · Body battery · Sleep", icon: "watch", tint: "#1467c2" },
  { id: "whoop", name: "WHOOP", sub: "Strain · Recovery · Sleep", icon: "zap", tint: "#111" },
  { id: "withings", name: "Withings", sub: "Weight · Body composition", icon: "scale", tint: "#1aa386" },
  { id: "google", name: "Google Fit", sub: "Steps · Heart points", icon: "smartphone", tint: "#4285f4" },
];
function wearState() { return readJN(WEAR_KEY, {}); }
function connectedWearables() { const s = wearState(); return WEARABLES.filter((w) => s[w.id]); }

/* ---- health data (sample week) ---------------------------------------- */
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const HEALTH = {
  sleep: [6.8, 7.4, 7.1, 6.2, 7.9, 8.1, 7.3],
  steps: [5200, 7800, 6400, 9100, 7200, 4800, 10300],
  water: [1.6, 2.0, 1.4, 2.2, 1.8, 1.5, 2.1],
  skin: [62, 64, 68, 66, 70, 74, 78],
  hr: [62, 61, 64, 63, 60, 59, 61],
};
const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
function fmtH(h) { const m = Math.round((h % 1) * 60); return Math.floor(h) + "h " + (m < 10 ? "0" : "") + m + "m"; }

/* =======================================================================
   HOME — newsfeed, a twin of Katy's NewsfeedMobile (MobileHome in
   mobile.jsx): .m-push banner, .m-top header, pinned accordion, DS PostCard
   inside .post-wrap, comment preview, .m-fab and the .m-tabs glass dock.
   JaneNewsfeed.html therefore also loads styles.css + mobile.css.
   ======================================================================= */
const POSTS_KEY = "pf-jane-posts";
const SEALS = { katy: ["gb", "verified"], beth: ["gb", "verified"], priya: ["gb", "verified"], miranda: ["gb"], amir: [], mark: ["gb"], jane: ["gb"], reception: ["verified"] };
const POSTS_SEED = [
  { id: "p0", kind: "live", by: "katy", t: "now", live: { viewers: 86, title: "Aftercare Q&A · ask me anything" }, text: "", likes: 31, shares: 4, liked: false, comments: [] },
  { id: "p1", by: "katy", t: "2h", tags: ["skincare", "tips"], text: "Winter skin reminder 🧴 Cold air + central heating = dehydrated skin. Double-cleanse at night, layer a hyaluronic serum under your moisturiser, and yes — SPF still counts in December. The UVA that ages skin comes straight through cloud, so the habit matters more than the forecast.", likes: 48, shares: 6, liked: false, comments: [{ by: "miranda", text: "Guilty of skipping SPF when it's grey out 🙈", likes: 4, t: "1h" }, { by: "katy", text: "The UVA doesn't care about the clouds Miranda 😄", likes: 9, t: "50m" }] },
  { id: "p10", kind: "reel", by: "katy", t: "3h", tags: ["aftercare", "tips"], reel: { src: "assets/sample-reel.mp4", dur: 30 }, text: "30 seconds on the first 24 hours after lip filler 💋 ice on, lipstick off, and please leave the swelling alone — it settles.", likes: 86, shares: 12, liked: false, comments: [{ by: "miranda", text: "Wish I'd seen this before my first appointment 😅", likes: 3, t: "2h" }, { by: "katy", text: "Saving you all the overthinking Miranda 😄", likes: 6, t: "1h" }] },
  { id: "p2", by: "miranda", t: "4h", tags: ["progress", "question"], text: "6 weeks post lip filler and I've finally stopped overthinking it. Katy was right about the swelling timeline 😅 Any tips for keeping lips hydrated through winter?", img: "assets/clinic-lip-design.png", likes: 21, shares: 2, liked: true, comments: [{ by: "beth", text: "A plain balm (no menthol or 'plumping' ingredients) and a big glass of water before bed. Simple wins.", likes: 7, t: "3h" }, { by: "amir", text: "They look so natural!", likes: 2, t: "2h" }] },
  { id: "p7", kind: "poll", by: "katy", t: "5h", text: "", poll: { question: "What's your biggest winter skin struggle right now?", votes: 212, options: [{ label: "Dryness & tightness", pct: 46 }, { label: "Redness", pct: 22 }, { label: "Breakouts", pct: 18 }, { label: "Dull, tired skin", pct: 14 }] }, likes: 19, shares: 3, liked: false, comments: [{ by: "mark", text: "Dryness, every single year 🙃", likes: 3, t: "4h" }] },
  { id: "p3", by: "beth", t: "Yesterday", tags: ["aftercare", "tips"], text: "Aftercare 101 after anti-wrinkle treatment: no lying flat for 4 hours, skip the gym today, no facials or massage for 2 weeks, and don't rub the area. Save this post 📌", likes: 73, shares: 14, liked: false, comments: [] },
  { id: "p8", kind: "eventreg", by: "amir", t: "Yesterday", event: "ev1", going: 12, likes: 0, shares: 0, liked: false, comments: [] },
  { id: "p4", by: "amir", t: "Yesterday", tags: ["question", "appointment"], text: "Just booked my first consultation 🙈 nervous but excited. What should I ask? Anything you wish you'd known before your first one?", likes: 12, shares: 1, liked: false, comments: [{ by: "mark", text: "Ask about the downtime for YOUR job — mine was more than I expected.", likes: 3, t: "20h" }, { by: "katy", text: "Bring a list of medications and any allergies, and photos of looks you like AND don't like. See you Thursday Amir!", likes: 11, t: "18h" }] },
  { id: "p9", kind: "quiz", by: "beth", t: "2d", text: "", quiz: { question: "Myth or fact: you don't need SPF on a cloudy day.", options: [{ label: "Myth — UVA comes through cloud", correct: true }, { label: "Fact — clouds block the sun" }], explain: "up to 80% of UV passes through cloud, so SPF is a daily habit, not a weather call." }, likes: 27, shares: 5, liked: false, comments: [{ by: "miranda", text: "Got it right for once 😄", likes: 2, t: "1d" }] },
  { id: "p5", by: "priya", t: "2d", tags: ["appointment"], text: "Patient Q&A live this Thursday 7pm — bring your questions about skin boosters, what they do and who they suit. Free for all clinic patients.", event: "ev1", likes: 35, shares: 9, liked: false, comments: [] },
  { id: "p6", by: "mark", t: "3d", tags: ["wins", "sleep"], text: "Week 3 of the sleep + hydration plan from Ava. Energy is noticeably better and my skin check-in score has gone from 61 to 72. Small habits, big difference.", imgs: ["assets/course-skin-boosters.jpg", "assets/course-consultation.jpg", "assets/course-full-face-rejuvenation.jpg"], likes: 29, shares: 3, liked: false, comments: [{ by: "katy", text: "This is exactly it Mark 👏", likes: 5, t: "2d" }] },
];
const POSTS_SEED_V = 7;

const PINNED_IDS = ["p3", "p5"];
const PUSH_JN = { app: "Pearce Aesthetics", icon: "assets/profinity-icon-purple-gold.png", title: "Appointment reminder", body: "Your 2-week review with Katy Wilson is Tuesday 3 Nov at 2:30pm. Tap to confirm or reschedule.", cta: "Confirm" };
const NOTIFS_JN = [
  { by: "katy", text: "replied to your comment on her winter skin post", t: "50m", icon: "message-square" },
  { by: "reception", text: "Appointment confirmed · Tue 3 Nov, 2:30pm", t: "2h", icon: "calendar" },
  { by: "miranda", text: "liked your post", t: "4h", icon: "heart" },
  { by: "priya", text: "is hosting Skin Boosters Q&A · Live on Thursday", t: "1d", icon: "video" },
  { by: "beth", text: "sent you an aftercare sheet", t: "4d", icon: "paperclip" },
];
function loadPosts() {
  const s = readJN(POSTS_KEY, null);
  if (readJN("pf-jane-posts-v", 0) < POSTS_SEED_V) { const mine = (s || []).filter((p) => p.by === "jane"); const merged = [...mine, ...POSTS_SEED]; saveJN(POSTS_KEY, merged); saveJN("pf-jane-posts-v", POSTS_SEED_V); return merged; }
  return s || POSTS_SEED;
}
function authorJN(id) { const p = PEOPLE[id]; return { name: p.name, avatar: p.avatar, seals: SEALS[id] || [] }; }
function fmtN(n) { return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(n); }

function ClampTextJN({ text, lines = 3 }) {
  const [expanded, setExpanded] = useStateJN(false);
  const [overflowing, setOverflowing] = useStateJN(false);
  const ref = useRefJN(null);
  React.useLayoutEffect(() => { const el = ref.current; if (el) setOverflowing(el.scrollHeight - el.clientHeight > 2); }, [text]);
  return (
    <span className="pf-clampwrap">
      <span ref={ref} className={"pf-clamp" + (expanded ? " open" : "")} style={expanded ? null : { WebkitLineClamp: lines }}>{text}</span>
      {(overflowing || expanded) && <button type="button" className="pf-seemore" onClick={() => setExpanded((v) => !v)}>{expanded ? "See less" : "See more"}</button>}
    </span>);
}

function PushBannerJN() {
  const [open, setOpen] = useStateJN(true);
  const [expanded, setExpanded] = useStateJN(false);
  useEffectJN(() => { if (expanded) return; const t = setTimeout(() => setOpen(false), 7000); return () => clearTimeout(t); }, [expanded]);
  if (!open) return null;
  return (
    <div className={"m-push" + (expanded ? " expanded" : "")} role="alert" aria-label={PUSH_JN.title} onClick={() => setExpanded((e) => !e)}>
      <div className="m-push-row"><img className="m-push-icon" src={PUSH_JN.icon} alt="" /><span className="m-push-app">{PUSH_JN.app}</span><span style={{ flex: 1 }} /><span className="m-push-time">now</span></div>
      <div className="m-push-title">{PUSH_JN.title}</div>
      <p className="m-push-body">{PUSH_JN.body}</p>
      {expanded && <div className="m-push-actions"><button className="m-push-cta" onClick={(e) => { e.stopPropagation(); setOpen(false); goJN("JaneMessages.html?to=reception"); }}>{PUSH_JN.cta}</button><button className="m-push-dismiss" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>Dismiss</button></div>}
      <span className="m-push-handle" role="button" aria-label="Dismiss notification" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
    </div>);
}

function useHeaderHideJN(scrollRef) {
  const [state, setState] = useStateJN({ hidden: false, floating: false });
  useEffectJN(() => {
    const el = scrollRef.current; if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => { const y = el.scrollTop, dy = y - lastY; setState((prev) => { let hidden = prev.hidden; if (y < 40) hidden = false; else if (dy > 6) hidden = true; else if (dy < -6) hidden = false; return { hidden, floating: y > 40 }; }); lastY = y; };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}
function usePullToRefreshJN(scrollRef, onRefresh) {
  const THRESHOLD = 64, MAX = 90;
  const [pull, setPull] = useStateJN(0); const [dragging, setDragging] = useStateJN(false); const [refreshing, setRefreshing] = useStateJN(false);
  const drag = useRefJN({ active: false, startY: 0 }); const busy = useRefJN(false); const cb = useRefJN(onRefresh); cb.current = onRefresh;
  useEffectJN(() => {
    const el = scrollRef.current; if (!el) return;
    const onDown = (e) => { if (busy.current || el.scrollTop > 0) return; drag.current = { active: true, startY: e.clientY }; setDragging(true); };
    const onMove = (e) => { if (!drag.current.active) return; const dy = e.clientY - drag.current.startY; if (dy <= 0 || el.scrollTop > 0) { drag.current.active = false; setDragging(false); setPull(0); return; } e.preventDefault(); setPull(Math.min(MAX, dy * 0.45)); };
    const onUp = () => { if (!drag.current.active) return; drag.current.active = false; setDragging(false); setPull((p) => { if (p < THRESHOLD) return 0; busy.current = true; setRefreshing(true); Promise.resolve(cb.current()).then(() => { busy.current = false; setRefreshing(false); setPull(0); }); return THRESHOLD; }); };
    el.addEventListener("pointerdown", onDown, { passive: true }); el.addEventListener("pointermove", onMove, { passive: false }); el.addEventListener("pointerup", onUp, { passive: true }); el.addEventListener("pointercancel", onUp, { passive: true });
    return () => { el.removeEventListener("pointerdown", onDown); el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerup", onUp); el.removeEventListener("pointercancel", onUp); };
  }, []);
  return { pull, dragging, refreshing };
}

const JNTopBar = React.forwardRef(function JNTopBar({ onMenu, onBell }, ref) {
  const unread = unreadDMJN();
  return (
    <header ref={ref} className="m-top">
      <button className="m-burger" aria-label="Menu" onClick={onMenu}><IcJN name="menu" size={24} color="var(--gray-700)" /></button>
      <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity" />
      <span className="grow" />
      <button className="m-iconbtn" aria-label="Search" onClick={() => goJN("JaneNewsfeed.html?search=1")}><DSJN.Icon name="search" size={20} color="var(--brand-navy)" /></button>
      <button className="m-iconbtn" aria-label="Notifications" onClick={onBell}><IcJN name="bell" size={20} color="var(--brand-navy)" /><span className="dot">{NOTIFS_JN.length}</span></button>
      <button className="m-iconbtn" aria-label="Messages" onClick={() => goJN("JaneMessages.html")}><IcJN name="message-circle" size={20} color="var(--brand-navy)" />{unread > 0 && <span className="dot">{unread}</span>}</button>
    </header>);
});
const JNDock = React.forwardRef(function JNDock({ compact, active }, ref) {
  return (
    <nav ref={ref} className={"m-tabs" + (compact ? " m-tabs-compact" : "")} aria-label="Primary">
      {JN_TABS.map((t) => (
        <button key={t.key} className={"m-tab" + (t.key === active ? " on" : "")} aria-current={t.key === active ? "page" : undefined} onClick={() => t.key !== active && goJN(t.href)}>
          <span className="ic"><IcJN name={t.icon} size={20} color={t.key === active ? "#fff" : "var(--gray-450)"} /></span>
          <span className="lbl">{t.label}</span>
        </button>))}
    </nav>);
});

/* Drawer (burger) — a twin of the clinician SideMenu in mobile.jsx (same
   .m-drawer / .sm-* classes from mobile.css, which Home and Health load):
   profile head, Health Pass primary card, upcoming events, My Profile rows
   with the gold status row, Display toggle, Logout. */
function useDarkModeJN() {
  const [dark, setDark] = useStateJN(() => { try { return localStorage.getItem("pf-theme") === "dark"; } catch (e) { return false; } });
  const toggle = () => { const next = !dark; setDark(next); try { localStorage.setItem("pf-theme", next ? "dark" : "light"); document.documentElement.setAttribute("data-theme", next ? "dark" : "light"); } catch (e) {} };
  return [dark, toggle];
}
function JNDrawer({ open, onClose }) {
  const [dark, toggleDark] = useDarkModeJN();
  const onb = onbState();
  const wear = connectedWearables();
  useEffectJN(() => { if (!open) return; const onKey = (e) => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [open]);
  const rows = [
    ["user", "Edit Profile", "JaneProfile.html?edit=1"],
    ["watch", wear.length ? "My Wearables" : "Connect your wearables", "JaneWearables.html"],
    ["heart-pulse", "Health Analytics", "JaneHealth.html"],
    ["sparkles", "Ava", "JaneCoach.html"],
    ["calendar", "Events", "JaneEvents.html"],
    ["message-circle", "Messages", "JaneMessages.html"],
    ["phone", "Calls & appointments", "JaneScheduleCall.html?ret=" + encodeURIComponent(hereJN())],
    ["shield-check", "Privacy & Security", null],
    ["headphones", "Clinic Support", "JaneMessages.html?to=reception"]];
  return (
    <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="m-drawer-scrim" onClick={onClose} />
      <aside className="m-drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <button className="m-drawer-profile" onClick={() => goJN("JaneProfile.html")}>
          <DSJN.Avatar name={JANE.name} src={JANE.avatar} size={56} />
          <span className="m-dp-main">
            <span className="m-dp-name">{JANE.name}{onb.done && <IcJN name="badge-check" size={18} color="var(--reaction-like)" />}</span>
            <span className="m-dp-role">Patient · {JANE.clinic}</span>
          </span>
          <IcJN name="chevron-right" size={22} color="var(--gray-800)" />
        </button>
        <div className="sm-body">
          <button className="sm-primary-card" onClick={() => goJN("JaneProfile.html")}>
            <span className="sm-primary-icon"><IcJN name="qr-code" size={22} color="var(--brand-navy)" /></span>
            <span className="sm-primary-main"><span className="sm-primary-title">Health Pass</span><span className="sm-primary-sub">{JANE.passId} · {onb.done ? "Active" : "Incomplete"} · show at reception</span></span>
            <IcJN name="chevron-right" size={20} color="var(--gray-450)" />
          </button>

          <div className="sm-sec-h">Upcoming Events</div>
          <div className="sm-events">
            {EVENTS.slice(0, 2).map((e) => { const d = evDate(e); const h = PEOPLE[e.host]; return (
              <button key={e.id} className="sm-event" onClick={() => goJN("JaneEvents.html?event=" + e.id)}>
                <span className="sm-date"><b>{d.d}</b><i>{d.m.toUpperCase()}</i></span>
                <span className="sm-event-main">
                  <span className="sm-event-name">{e.title}</span>
                  <span className="sm-event-time">{d.wd} · {e.time}</span>
                  <span className="sm-event-hosts"><JNFace p={h} size={26} /><span className="sm-event-hosts-label">{h.name}</span></span>
                </span>
                <span className={"sm-event-access" + (e.online ? " sm-event-access-open" : " sm-event-access-members")}>{e.online ? "Online" : "In clinic"}</span>
              </button>); })}
          </div>

          <div className="sm-sec-h">My Profile</div>
          {!onb.done && (
            <button className="sm-row sm-verify" onClick={() => goJN("JaneOnboarding.html")}>
              <IcJN name="clipboard-list" size={23} color="var(--premium-orange)" />
              <span className="sm-row-label">Complete Health Pass</span>
              <span className="sm-verify-pill">{Object.keys(onb.answers || {}).length ? "In progress" : "Not started"}</span>
            </button>)}
          <nav className="sm-list">
            {rows.map(([ic, label, href]) => (
              <button key={label} className="sm-row" onClick={() => href ? goJN(href) : null}>
                <IcJN name={ic} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{label}</span>
                <IcJN name="chevron-right" size={20} color="var(--gray-450)" />
              </button>))}
            <div className="sm-display-card">
              <div className="sm-display-top">
                <span className="sm-display-label">Display</span>
                <button className={"sm-switch" + (dark ? " on" : "")} onClick={toggleDark} role="switch" aria-checked={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
                  <span className="sm-knob"><IcJN name={dark ? "moon" : "sun"} size={13} color={dark ? "#1A1736" : "var(--gray-450)"} /></span>
                </button>
              </div>
              <p className="sm-display-desc">Adjust the appearance of the app to reduce glare and give your eyes a break</p>
            </div>
          </nav>
          <button className="m-drawer-logout" onClick={onClose}><IcJN name="log-out" size={22} color="var(--error)" />Logout</button>
        </div>
      </aside>
    </div>);
}
function JNNotifPanel({ open, onClose }) {
  const up = upcomingCall();
  const notifs = up ? [{ by: up.with || "katy", text: "confirmed your " + callTypeLabel(up).toLowerCase() + " · " + callWhen(up), t: "Just now", icon: "phone" }, ...NOTIFS_JN] : NOTIFS_JN;
  return (
    <div className={"jn-layer right" + (open ? " open" : "")} aria-hidden={!open}>
      <button type="button" className="jn-scrim" aria-label="Close notifications" onClick={onClose} />
      <aside className="jn-panel">
        <header className="jn-panel-head"><h2>Notifications</h2><button className="m-iconbtn" aria-label="Close" onClick={onClose}><IcJN name="x" size={20} color="var(--brand-navy)" /></button></header>
        <div className="jn-panel-list">
          {notifs.map((n, i) => { const p = PEOPLE[n.by]; return (
            <button key={i} className="jn-notif" onClick={() => goJN(n.icon === "phone" ? "JaneScheduleCall.html?ret=" + encodeURIComponent(hereJN()) : n.icon === "calendar" ? "JaneMessages.html?to=reception" : n.icon === "video" ? "JaneEvents.html?event=ev1" : n.icon === "paperclip" ? "JaneMessages.html?to=beth" : "JaneNewsfeed.html")}>
              <span className="av"><JNFace p={p} size={44} /><i><IcJN name={n.icon} size={11} color="#fff" /></i></span>
              <span className="tx"><b>{p.name}</b> {n.text}<small>{n.t}</small></span>
            </button>); })}
        </div>
      </aside>
    </div>);
}

/* ---- Katy-feed content kinds for Jane (same styles.css classes as the
   clinician feed: .pf-livenow, .pf-poll, .pf-quiz, .pf-event-feed) ---- */
function PollJN({ poll, onVote }) {
  const [voted, setVoted] = useStateJN(poll.voted == null ? null : poll.voted);
  const answered = voted !== null;
  const total = poll.votes + (answered ? 1 : 0);
  const pctOf = (o, i) => poll.votes ? o.pct : voted === i ? 100 : 0;
  const leadIdx = poll.options.reduce((b, o, i) => pctOf(o, i) > pctOf(poll.options[b], b) ? i : b, 0);
  return (
    <div className={"pf-poll" + (answered ? " answered" : "")}>
      <div className="pf-poll-q"><span className="pf-poll-badge"><IcJN name="bar-chart-2" size={15} color="var(--white)" /></span><span>{poll.question}</span></div>
      <div className="pf-poll-opts">
        {poll.options.map((o, i) => { const p = pctOf(o, i); const mine = voted === i; return (
          <button type="button" key={o.label} className={"pf-poll-opt" + (answered ? " answered" : "") + (mine ? " selected" : "") + (answered && i === leadIdx ? " leading" : "")} disabled={answered} aria-pressed={mine} onClick={() => { setVoted(i); onVote && onVote(i); }}>
            {answered && <span className="pf-poll-fill" style={{ width: p + "%" }} />}
            <span className="pf-poll-opt-row"><span className="pf-poll-letter">{String.fromCharCode(65 + i)}</span><span className="pf-poll-label">{o.label}</span>{answered && <span className="pf-poll-pct">{p}%</span>}{mine && <span className="pf-poll-check"><IcJN name="check" size={16} color="var(--pf-poll-accent)" /></span>}</span>
          </button>); })}
      </div>
      {answered ? <div className="pf-poll-after"><div className="pf-poll-after-head"><b>Thanks for voting!</b><span className="pf-poll-chip">Voted</span></div><p>{total.toLocaleString()} votes so far · <b>{poll.options[leadIdx].label}</b> is leading with {pctOf(poll.options[leadIdx], leadIdx)}%.</p></div>
                : <div className="pf-poll-foot">{total.toLocaleString()} votes · Tap an option to vote</div>}
    </div>);
}
function QuizJN({ quiz, onAnswer }) {
  const [picked, setPicked] = useStateJN(quiz.picked == null ? null : quiz.picked);
  const answered = picked !== null; const isCorrect = answered && quiz.options[picked].correct;
  return (
    <div className="pf-quiz">
      <div className="pf-quiz-q"><span className="pf-quiz-badge"><IcJN name="brain" size={15} color="var(--white)" /></span><span>{quiz.question}</span></div>
      <div className="pf-quiz-opts">
        {quiz.options.map((o, i) => { const state = answered && o.correct ? "correct" : answered && picked === i ? "incorrect" : ""; return (
          <button type="button" key={o.label} className={"pf-quiz-opt" + (answered ? " answered" : "") + (state ? " " + state : "")} disabled={answered} onClick={() => { setPicked(i); onAnswer && onAnswer(i); }}>
            <span className="pf-quiz-opt-row"><span className={"pf-quiz-letter" + (state ? " " + state : "")}>{String.fromCharCode(65 + i)}</span><span className="pf-quiz-label">{o.label}</span>{state && <span className={"pf-quiz-mark " + state}><IcJN name={state === "correct" ? "check" : "x"} size={16} color={state === "correct" ? "var(--success)" : "var(--error)"} /></span>}</span>
          </button>); })}
      </div>
      <div className={"pf-quiz-foot" + (answered ? " " + (isCorrect ? "correct" : "incorrect") : "")}>{answered ? (isCorrect ? "Correct! " : "Not quite — ") + quiz.explain : "Tap an option to answer"}</div>
    </div>);
}
function LiveNowJN({ live, author, onTap }) {
  const initials = author.name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return (
    <div className="pf-livenow" onClick={onTap} role="img" aria-label={author.name + " is live now, " + live.viewers + " watching"}>
      {live.frame ? <img src={live.frame} alt="" /> : <div className="pf-livenow-initials" aria-hidden="true"><span>{initials}</span></div>}
      <span className="pf-livenow-badge"><span className="pf-livenow-dot" aria-hidden="true" />LIVE</span>
      <span className="pf-livenow-viewers"><IcJN name="eye" size={13} color="var(--white)" />{live.viewers}</span>
      <span className="jn-live-title">{live.title}</span>
    </div>);
}
function EventRegJN({ p }) {
  const a = authorJN(p.by); const ev = EVENTS.find((e) => e.id === p.event) || EVENTS[0]; const d = evDate(ev);
  const go = () => goJN("JaneEvents.html?event=" + ev.id);
  return (
    <div className="post-wrap pf-event-feed" style={{ background: "var(--surface-card)", borderRadius: "var(--r-md)", overflow: "hidden", padding: "0px 16px" }}>
      <div className="pf-teaser-head">
        <span className="pf-prof-av"><DSJN.Avatar name={a.name} src={a.avatar} size={44} /></span>
        <div className="pf-teaser-head-main">
          <div className="pf-teaser-head-name"><span><span className="pf-prof-nm">{a.name}</span></span>{a.seals.length > 0 && <DSJN.VerificationSeals seals={a.seals} size={16} />}</div>
          <div className="pf-teaser-head-sub"><span>{p.t}</span></div>
        </div>
      </div>
      <div className="pf-event-feed-label"><IcJN name="calendar-check" size={14} color="var(--premium-gold-deep)" /><span>EVENT</span></div>
      <p className="pf-event-reg-headline"><b>{a.name}</b> is going to <b>{ev.title}</b>.</p>
      <div className="pf-event-reg-card">
        <button type="button" className="pf-event-reg-main" onClick={go}>
          <span className="pf-event-reg-title">{ev.title}</span>
          <span className="pf-event-reg-sub">{d.wd} {d.d} {d.m} · {ev.time} · {ev.where}</span>
          <span className="pf-event-reg-going">{p.going} patients going</span>
        </button>
        <button type="button" className="pf-event-reg-cta" onClick={go}>{readJN("pf-jane-events", { ev1: true })[ev.id] ? "You're going · see details" : "RSVP to this event"}</button>
      </div>
    </div>);
}

/* ---- reactions: a copy of the clinician feed's animation set (app.jsx
   burstFrom / ReactionPicker / useReactionPicker / useDoubleTapLove), CSS
   from styles.css (.pf-react-*, .sm-double-heart). Like = tap; hover or
   long-press the like button for the six-emoji bar; double-tap a photo for
   the big heart. No points on the patient side. ---- */
const REACTIONS_JN = [
  { key: "like", label: "Like", icon: "fluent-emoji-flat:thumbs-up", flat: "fluent:thumb-like-16-filled", color: "--reaction-like" },
  { key: "love", label: "Love", icon: "fluent-emoji-flat:red-heart", flat: "fluent:heart-16-filled", color: "--reaction-love" },
  { key: "laugh", label: "Laugh", icon: "fluent-emoji-flat:grinning-squinting-face", flat: "fluent:emoji-laugh-16-filled", color: "--premium-orange" },
  { key: "wow", label: "Wow", icon: "fluent-emoji-flat:face-with-open-mouth", flat: "fluent:emoji-16-filled", color: "--premium-orange" },
  { key: "cry", label: "Cry", icon: "fluent-emoji-flat:crying-face", flat: "fluent:emoji-sad-16-filled", color: "--premium-orange" },
  { key: "angry", label: "Angry", icon: "fluent-emoji-flat:pouting-face", flat: "fluent:emoji-angry-16-filled", color: "--error" }];
const REACTION_MAP_JN = REACTIONS_JN.reduce((m, r) => { m[r.key] = r; return m; }, {});
function cssVarJN(name) { const cs = getComputedStyle(document.querySelector(".app") || document.body); return cs.getPropertyValue(name).trim() || "currentColor"; }
function frameScaleJN(el) { const f = el && el.closest && el.closest("[data-ios-device]"); if (!f || !f.offsetWidth) return 1; const s = f.getBoundingClientRect().width / f.offsetWidth; return s > 0 && isFinite(s) ? s : 1; }
function likeButtonJN(wrap) { if (!wrap) return null; const bar = wrap.querySelector('[style*="space-between"]'); return (bar || wrap).querySelector("button"); }
function actionIconJN(wrap, idx) { const bar = wrap && wrap.querySelector('[style*="space-between"]'); const b = bar ? bar.querySelectorAll("button")[idx] : null; return b ? b.querySelector("iconify-icon, svg") : null; }
function burstFromJN(btn, key) {
  if (!btn) return;
  const r = REACTION_MAP_JN[key] || REACTION_MAP_JN.like; const color = cssVarJN(r.color);
  const icon = btn.querySelector("iconify-icon");
  if (icon && icon.animate) icon.animate([{ transform: "scale(1)" }, { transform: "scale(1.6)" }, { transform: "scale(0.9)" }, { transform: "scale(1)" }], { duration: 460, easing: "cubic-bezier(.34,1.56,.64,1)" });
  const s = frameScaleJN(btn); const rect = btn.getBoundingClientRect(); const cx = rect.left + 16 * s, cy = rect.top + rect.height / 2;
  for (let i = 0; i < 7; i++) {
    const size = (13 + Math.random() * 10) * s;
    const el = document.createElement("iconify-icon"); el.setAttribute("icon", r.icon); el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;left:" + cx + "px;top:" + cy + "px;width:" + size + "px;height:" + size + "px;pointer-events:none;z-index:9999;line-height:0;will-change:transform,opacity;color:" + color + ";";
    document.body.appendChild(el);
    const dx = (Math.random() - 0.5) * 96 * s, dy = (-56 - Math.random() * 74) * s;
    const anim = el.animate([
      { transform: "translate(-50%,-50%) scale(.3)", opacity: 0 },
      { transform: "translate(calc(-50% + " + dx * 0.35 + "px),calc(-50% + " + dy * 0.35 + "px)) scale(1)", opacity: 1, offset: 0.28 },
      { transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(.55)", opacity: 0 }],
      { duration: 740 + Math.random() * 280, easing: "cubic-bezier(.22,.61,.36,1)" });
    anim.onfinish = () => el.remove(); setTimeout(() => el.remove(), 1500);
  }
}
function ReactionPickerJN({ at, onPick, onEnter, onLeave }) {
  if (!at) return null;
  const scale = at.scale || 1;
  return ReactDOM.createPortal(
    <div style={{ position: "fixed", left: 0, right: 0, bottom: at.bottom, zIndex: 9999, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ transform: scale !== 1 ? "scale(" + scale + ")" : undefined, transformOrigin: "center bottom", display: "flex" }}>
        <div onMouseEnter={onEnter} onMouseLeave={onLeave} className="pf-react-bar" role="menu" aria-label="Pick a reaction" style={{ pointerEvents: "auto" }}>
          {REACTIONS_JN.map((r, i) => (
            <button key={r.key} type="button" role="menuitem" aria-label={r.label} onClick={() => onPick(r.key)} className="pf-react-opt" data-react={r.key} style={{ animationDelay: i * 35 + "ms" }}>
              <span className="pf-react-label">{r.label}</span>
              <DSJN.IconifyIcon name={r.icon} size={40} />
            </button>))}
        </div>
      </div>
    </div>, document.body);
}
function useReactionPickerJN(ref, reaction, onReact) {
  const [picker, setPicker] = useStateJN(null);
  const hideT = useRefJN(null); const pressT = useRefJN(null); const pressed = useRefJN(false);
  const show = () => { clearTimeout(hideT.current); const btn = likeButtonJN(ref.current); if (!btn) return; const r = btn.getBoundingClientRect(); const scale = frameScaleJN(btn); setPicker({ bottom: window.innerHeight - r.top + 8 * scale, scale }); };
  const scheduleHide = () => { clearTimeout(hideT.current); hideT.current = setTimeout(() => setPicker(null), 280); };
  const cancelHide = () => clearTimeout(hideT.current);
  useEffectJN(() => {
    const btn = likeButtonJN(ref.current); if (!btn) return undefined;
    const down = () => { pressed.current = false; clearTimeout(pressT.current); pressT.current = setTimeout(() => { pressed.current = true; show(); }, 420); };
    const up = () => clearTimeout(pressT.current);
    const click = (e) => { if (pressed.current) { e.stopPropagation(); e.preventDefault(); pressed.current = false; } };
    btn.addEventListener("mouseenter", show); btn.addEventListener("mouseleave", scheduleHide);
    btn.addEventListener("pointerdown", down); btn.addEventListener("pointerup", up); btn.addEventListener("pointercancel", up); btn.addEventListener("pointerleave", up);
    btn.addEventListener("click", click, true);
    return () => { btn.removeEventListener("mouseenter", show); btn.removeEventListener("mouseleave", scheduleHide); btn.removeEventListener("pointerdown", down); btn.removeEventListener("pointerup", up); btn.removeEventListener("pointercancel", up); btn.removeEventListener("pointerleave", up); btn.removeEventListener("click", click, true); clearTimeout(hideT.current); clearTimeout(pressT.current); };
  }, []);
  useEffectJN(() => { if (!picker) return undefined; const close = (e) => { if (!e.target.closest || !e.target.closest(".pf-react-bar")) setPicker(null); }; const t = setTimeout(() => document.addEventListener("pointerdown", close, true), 50); return () => { clearTimeout(t); document.removeEventListener("pointerdown", close, true); }; }, [picker]);
  React.useLayoutEffect(() => {
    const btn = likeButtonJN(ref.current); if (!btn) return;
    const icon = btn.querySelector("iconify-icon"); const label = btn.querySelector("span"); const r = REACTION_MAP_JN[reaction];
    if (r) { const col = cssVarJN(r.color); if (icon) { icon.setAttribute("icon", r.icon); icon.style.color = col; } if (label) { label.style.color = col; label.style.fontWeight = "var(--fw-semibold)"; } btn.dataset.reacted = r.key; }
    else if (btn.dataset.reacted) { if (icon) { icon.setAttribute("icon", "fluent:thumb-like-16-filled"); icon.style.color = ""; } if (label) { label.style.color = ""; label.style.fontWeight = ""; } delete btn.dataset.reacted; }
  });
  const pick = (key) => { const changing = reaction !== key; onReact(key); if (changing) burstFromJN(likeButtonJN(ref.current), key); setPicker(null); };
  return { picker, pick, cancelHide, scheduleHide };
}
function useDoubleTapLoveJN(onLove) {
  const lastTap = useRefJN(0); const pending = useRefJN(null); const [heart, setHeart] = useStateJN(null); const seq = useRefJN(0);
  const wrap = (singleTap) => (e) => { const now = Date.now(); const x = e.clientX, y = e.clientY; if (now - lastTap.current < 300) { lastTap.current = 0; clearTimeout(pending.current); const key = ++seq.current; setHeart({ x, y, key }); setTimeout(() => setHeart((h) => h && h.key === key ? null : h), 700); onLove(); return; } lastTap.current = now; if (singleTap) pending.current = setTimeout(singleTap, 260); };
  const onTap = wrap(null);
  const heartNode = heart ? ReactDOM.createPortal(<span key={heart.key} className="sm-double-heart" style={{ left: heart.x, top: heart.y }}><DSJN.IconifyIcon name="fluent:heart-16-filled" size={96} color="var(--reaction-love)" /></span>, document.body) : null;
  return { onTap, wrap, heartNode };
}
/* Swipeable photo carousel — Katy's MediaCarousel (styles.css .mc-*):
   scroll-snap slides, 1/N counter, sliding dots, tap for the fullscreen
   strip (.sm-fs). Single photos render as one square slide. */
function SlidingDotsJN({ count, idx }) {
  const MAX = 5;
  if (count <= MAX) return <div className="mc-dots">{Array.from({ length: count }, (_, i) => <span key={i} className={"mc-dot" + (i === idx ? " on" : "")} />)}</div>;
  const SCALES = [0.57, 0.78, 1, 0.78, 0.57];
  return <div className="mc-dots">{SCALES.map((sc, pos) => <span key={pos} className={"mc-dot" + (pos === 2 ? " on" : "")} style={{ transform: "scale(" + sc + ")" }} />)}</div>;
}
function CarouselJN({ imgs, wrap }) {
  const [idx, setIdx] = useStateJN(0); const [fs, setFs] = useStateJN(false); const [fsIdx, setFsIdx] = useStateJN(0);
  const ref = useRefJN(null); const fsRef = useRefJN(null);
  const single = imgs.length === 1;
  useEffectJN(() => { if (!fs) return; const onKey = (e) => { if (e.key === "Escape") setFs(false); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [fs]);
  useEffectJN(() => { if (fs && fsRef.current) fsRef.current.scrollLeft = fsIdx * fsRef.current.clientWidth; }, [fs]);
  const onScroll = () => { const el = ref.current; if (!el) return; const first = el.firstElementChild; const w = first ? first.offsetWidth + 8 : el.clientWidth; setIdx(Math.max(0, Math.min(imgs.length - 1, Math.round(el.scrollLeft / w)))); };
  const onFsScroll = () => { const el = fsRef.current; if (el) setFsIdx(Math.round(el.scrollLeft / el.clientWidth)); };
  const tap = (i) => wrap ? wrap(() => { if (!single) { setFsIdx(i); setFs(true); } }) : () => { if (!single) { setFsIdx(i); setFs(true); } };
  return (
    <div className="mc-wrap">
      <div className={"mc-scroll" + (single ? " mc-scroll-single" : "")} ref={ref} onScroll={onScroll}>
        {imgs.map((src, i) => <img key={i} src={src} alt={"Image " + (i + 1) + " of " + imgs.length} className="mc-img" draggable={false} onClick={tap(i)} />)}
      </div>
      {!single && <span className="mc-count">{idx + 1}/{imgs.length}</span>}
      {!single && <SlidingDotsJN count={imgs.length} idx={idx} />}
      {fs && (
        <div className="sm-fs" onClick={(e) => e.stopPropagation()}>
          <div className="mc-fs-track" onScroll={onFsScroll} ref={fsRef}>{imgs.map((src, i) => <img key={i} src={src} alt={"Image " + (i + 1) + " of " + imgs.length} />)}</div>
          <button type="button" className="sm-fs-close" aria-label="Close fullscreen" onClick={() => setFs(false)}><IcJN name="x" size={24} color="var(--white)" /></button>
          <span className="mc-fs-count">{fsIdx + 1}/{imgs.length}</span>
        </div>)}
    </div>);
}

/* Reel post (user 2026-10-27 "add post in jane that also shows the reels similar in Katy"):
   9:16 clip plays muted inline like the Katy feed's vertical reel card (play/pause · time ·
   track · mute controls); tapping it opens a full-screen reel viewer (black stage, right-hand
   action rail, author + caption foot, progress bar) in the style of Katy's ReelMobile page. */
function ReelJN({ p, author, liked, saved, onLike, onComment, onShare, onSave, showToast }) {
  const vRef = useRefJN(null); const fsRef = useRefJN(null);
  const [playing, setPlaying] = useStateJN(true); const [muted, setMuted] = useStateJN(true);
  const [t, setT] = useStateJN(0); const [dur, setDur] = useStateJN(p.reel.dur || 30);
  const [open, setOpen] = useStateJN(false); const [fsPlaying, setFsPlaying] = useStateJN(true); const [fsT, setFsT] = useStateJN(0);
  const [heart, setHeart] = useStateJN(null); const lastTap = useRefJN(0);
  const fmt = (x) => Math.floor(x / 60) + ":" + String(Math.floor(x % 60)).padStart(2, "0");
  useEffectJN(() => { const v = vRef.current; if (!v) return; if (playing && !open) v.play().catch(() => {}); else v.pause(); }, [playing, open]);
  useEffectJN(() => { const v = fsRef.current; if (!v || !open) return; v.currentTime = t; if (fsPlaying) v.play().catch(() => {}); else v.pause(); }, [open, fsPlaying]);
  useEffectJN(() => { if (!open) return; const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = prev; }; }, [open]);
  const openFs = () => { setFsPlaying(true); setOpen(true); };
  const closeFs = () => { setOpen(false); setPlaying(true); };
  const fsTap = (e) => {
    const now = Date.now(); const r = e.currentTarget.getBoundingClientRect();
    if (now - lastTap.current < 300) { lastTap.current = 0; if (!liked) onLike(); setHeart({ x: e.clientX - r.left, y: e.clientY - r.top, k: now }); setTimeout(() => setHeart((h) => h && h.k === now ? null : h), 900); }
    else { lastTap.current = now; setTimeout(() => { if (lastTap.current === now) { lastTap.current = 0; setFsPlaying((v) => !v); } }, 300); }
  };
  const Act = ({ icon, label, on, active, color }) => (
    <button className={"jn-reel-act" + (active ? " on" : "")} onClick={(e) => { e.stopPropagation(); on(); }}>
      <span className="ic" style={active && color ? { background: color, borderColor: color } : undefined}><IcJN name={icon} size={22} color="#fff" /></span><small>{label}</small>
    </button>);
  return (
    <div className="jn-reel-wrap">
      <div className={"sm-vertical sm-reel jn-reel" + (playing ? " playing" : "")} onClick={openFs} role="button" tabIndex={0} aria-label="Open reel">
        <video ref={vRef} src={p.reel.src} muted={muted} loop playsInline autoPlay preload="metadata" onTimeUpdate={(e) => setT(e.target.currentTime)} onLoadedMetadata={(e) => isFinite(e.target.duration) && setDur(e.target.duration)} />
        <span className="jn-reel-chip"><IcJN name="film" size={12} color="#fff" />Reel</span>
        <span className={"sm-bigplay" + (playing ? " hide" : "")}><IcJN name="play" size={30} color="#fff" /></span>
        <div className="sm-controls" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="sm-ctl" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((v) => !v)}><IcJN name={playing ? "pause" : "play"} size={18} color="#fff" /></button>
          <span className="sm-time">{fmt(t)}</span>
          <span className="sm-track"><span className="sm-fill jn-reel-fill" style={{ width: (dur ? (t / dur) * 100 : 0) + "%", animation: "none" }} /></span>
          <span className="sm-time">{fmt(dur)}</span>
          <button type="button" className="sm-ctl" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((m) => !m)}><IcJN name={muted ? "volume-x" : "volume-2"} size={16} color="#fff" /></button>
        </div>
      </div>
      {open && (
        <div className="jn-reel-fs" onClick={(e) => e.stopPropagation()}>
          <video ref={fsRef} src={p.reel.src} muted={muted} loop playsInline autoPlay onTimeUpdate={(e) => setFsT(e.target.currentTime)} />
          <span className="scrim t" /><span className="scrim b" />
          <button className="jn-reel-tap" aria-label={fsPlaying ? "Pause" : "Play"} onClick={fsTap} />
          {!fsPlaying && <span className="jn-reel-play"><IcJN name="play" size={32} color="#fff" /></span>}
          {heart && <span className="jn-reel-heart" key={heart.k} style={{ left: heart.x, top: heart.y }}><IcJN name="heart" size={88} color="#F0425F" /></span>}
          <div className="jn-reel-top">
            <button className="gb" aria-label="Close" onClick={closeFs}><IcJN name="x" size={22} color="#fff" /></button>
            <b>Reels</b>
            <button className="gb" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((m) => !m)}><IcJN name={muted ? "volume-x" : "volume-2"} size={20} color="#fff" /></button>
          </div>
          <div className="jn-reel-rail">
            <Act icon="heart" label={fmtN(p.likes + (liked && !p.liked ? 0 : 0))} on={onLike} active={liked} color="#F0425F" />
            <Act icon="message-circle" label={String(p.comments.length)} on={() => { closeFs(); onComment(); }} />
            <Act icon="share-2" label={fmtN(p.shares)} on={() => { closeFs(); onShare(); }} />
            <Act icon="bookmark" label={saved ? "Saved" : "Save"} on={onSave} active={saved} color="var(--brand-gold)" />
          </div>
          <div className="jn-reel-foot">
            <div className="au"><JNFace p={PEOPLE[p.by]} size={38} /><div><b>{PEOPLE[p.by].name}</b><small>{PEOPLE[p.by].title}</small></div><RoleChip p={PEOPLE[p.by]} /></div>
            <p>{p.text}</p>
            <div className="tags">{(p.tags || []).map((x) => <span key={x}>#{x}</span>)}</div>
          </div>
          <span className="jn-reel-track"><i style={{ width: (dur ? (fsT / dur) * 100 : 0) + "%" }} /></span>
        </div>)}
    </div>);
}

function FeedPostJN({ p, pinned, onLike, onReact, onComment, onShare, onSave, onPatch, saved, showToast }) {
  const a = authorJN(p.by);
  const first = p.comments[0];
  const ref = useRefJN(null);
  const reaction = p.reaction || (p.liked ? "like" : null);
  const { picker, pick, cancelHide, scheduleHide } = useReactionPickerJN(ref, reaction, (key) => onReact(p, key));
  const { onTap, wrap, heartNode } = useDoubleTapLoveJN(() => { if (reaction !== "love") { onReact(p, "love"); burstFromJN(likeButtonJN(ref.current), "love"); } });
  const handleLike = () => { const willReact = !reaction; onLike(p); if (willReact) burstFromJN(likeButtonJN(ref.current), "like"); };
  const handleComment = () => { const g = actionIconJN(ref.current, 1); if (g && g.animate) g.animate([{ transform: "rotate(0)" }, { transform: "rotate(-17deg)" }, { transform: "rotate(13deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(0)" }], { duration: 520, easing: "ease-in-out" }); onComment(p); };
  const handleShare = () => { const g = actionIconJN(ref.current, 2); if (g && g.animate) g.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: "translate(8px,-10px) scale(1.28)", opacity: 0.35, offset: 0.5 }, { transform: "translate(-3px,2px) scale(1)", opacity: 1, offset: 0.78 }, { transform: "translate(0,0) scale(1)", opacity: 1 }], { duration: 560, easing: "cubic-bezier(.34,1.56,.64,1)" }); onShare(p); };
  const imgs = p.imgs && p.imgs.length ? p.imgs : (p.img ? [p.img] : []);
  const media = p.kind === "live" ? (
    <div className="pf-media-bleed" style={{ margin: "0 -16px" }}><LiveNowJN live={p.live} author={a} onTap={() => showToast("Joining " + a.name.split(" ")[0] + "'s live…")} /></div>
  ) : p.kind === "reel" ? (
    <div className="pf-media-bleed" style={{ margin: "0 -16px" }}><ReelJN p={p} author={a} liked={!!reaction} saved={saved} onLike={handleLike} onComment={handleComment} onShare={handleShare} onSave={() => onSave(p)} showToast={showToast} /></div>
  ) : p.kind === "poll" ? (
    <div className="pf-media-bleed" style={{ margin: "0 -16px" }}><PollJN poll={p.poll} onVote={(i) => onPatch && onPatch(p, { poll: { ...p.poll, voted: i } })} /></div>
  ) : p.kind === "quiz" ? (
    <div className="pf-media-bleed" style={{ margin: "0 -16px" }}><QuizJN quiz={p.quiz} onAnswer={(i) => onPatch && onPatch(p, { quiz: { ...p.quiz, picked: i } })} /></div>
  ) : imgs.length ? (
    <div className="pf-media-bleed" style={{ margin: "0 -16px" }}><CarouselJN imgs={imgs} wrap={wrap} /></div>
  ) : p.event ? (
    <div className="pf-media-bleed" style={{ margin: "0 -16px" }}>
      <button className="jn-post-ev infeed" onClick={() => goJN("JaneEvents.html?event=" + p.event)}>
        <span className="ic"><IcJN name="calendar" size={18} color="var(--brand-navy)" /></span>
        <span className="tx"><b>Skin Boosters Q&A · Live</b><small>Thu 29 Oct · 7:00pm · Online · Free for patients</small></span>
        <IcJN name="chevron-right" size={18} color="var(--gray-450)" />
      </button>
    </div>) : null;
  return (
    <div className="post-wrap" id={"post-" + p.id} ref={ref} style={{ background: "var(--surface-card)", borderRadius: "var(--r-md)", overflow: "hidden", padding: "0px 16px" }}>
      <DSJN.PostCard author={a}
        time={p.kind === "live" ? <span className="pf-livenow-meta">is live now · {p.live.viewers} watching</span> : pinned ? <React.Fragment>{p.t}<span className="pf-pin-chip"><DSJN.IconifyIcon name="fluent:pin-12-filled" size={11} color="var(--brand-navy)" />Pinned</span></React.Fragment> : p.t}
        body={!p.text ? null : p.bg ? <div className="pf-post-bg" style={{ background: p.bg.css, color: p.bg.fg }}><ClampTextJN text={p.text} lines={6} /></div> : <ClampTextJN text={p.text} />}
        media={media}
        hashtags={(p.tags || []).map((t) => JN_TAG_MAP[t]).filter(Boolean)}
        liked={!!reaction} saved={saved} actioned={false} likes={fmtN(p.likes)} shares={fmtN(p.shares)} comments={String(p.comments.length)}
        onLike={handleLike} onComment={handleComment} onShare={handleShare} onSave={() => onSave(p)}
        onReport={() => showToast("Thanks, we'll take a look")}
        onReactionsClick={() => showToast(fmtN(p.likes) + " people reacted")}
        menuItems={[]}
        style={{ boxShadow: "none", border: "none", borderRadius: 0, background: "transparent", padding: "24px 8px" }} />
      {first && (
        <div className="comments-region cm-preview-region" style={{ padding: "0px 8px 24px", margin: "8px 0px 0px" }}>
          <div className="cmt-preview" role="button" tabIndex={0} onClick={() => onComment(p)}>
            <DSJN.CommentItem author={authorJN(first.by)} text={first.text} likes={fmtN(first.likes || 0)} comments="1" reactions={null} reactionCount={null} replies={[]} onCommentsClick={() => onComment(p)} />
          </div>
          {p.comments.length > 1 && <button type="button" className="cmt-viewmore" onClick={() => onComment(p)}>View all {p.comments.length} comments</button>}
        </div>)}
      <ReactionPickerJN at={picker} onPick={pick} onEnter={cancelHide} onLeave={scheduleHide} />
      {heartNode}
    </div>);
}

function HomeScreen() {
  const [posts, setPosts] = useStateJN(loadPosts);
  const [saved, setSaved] = useStateJN(() => readJN("pf-jane-saved", {}));
  const [pinsOpen, setPinsOpen] = useStateJN(false);
  const [menuOpen, setMenuOpen] = useStateJN(false);
  const [notifOpen, setNotifOpen] = useStateJN(false);
  const [composeOpen, setComposeOpen] = useStateJN(false);
  const [draft, setDraft] = useStateJN("");
  const [commentId, setCommentId] = useStateJN(null);
  const [cDraft, setCDraft] = useStateJN("");
  const [feedKey, setFeedKey] = useStateJN(0);
  const [toast, showToast] = useToastJN();
  const scrollRef = useRefJN(null); const headerRef = useRefJN(null); const tabsRef = useRefJN(null);
  const [headerH, setHeaderH] = useStateJN(0); const [tabsH, setTabsH] = useStateJN(0);
  const { hidden: chromeHidden, floating: chromeFloat } = useHeaderHideJN(scrollRef);
  const { pull, dragging, refreshing } = usePullToRefreshJN(scrollRef, () => new Promise((r) => setTimeout(() => { setFeedKey((k) => k + 1); if (scrollRef.current) scrollRef.current.scrollTop = 0; r(); }, 600)));
  React.useLayoutEffect(() => { const el = headerRef.current; if (!el) return; const m = () => setHeaderH(el.offsetHeight); m(); const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect(); }, []);
  React.useLayoutEffect(() => { const el = tabsRef.current; if (!el) return; const m = () => setTabsH(el.offsetHeight); m(); const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffectJN(() => { if (qJN("search") === "1") showToast("Search coming soon"); if (qJN("posted") === "1") { showToast("Shared with your clinic"); try { const u = new URL(location.href); u.searchParams.delete("posted"); history.replaceState(null, "", u.pathname + u.search); } catch (e) {} } }, []);
  const onb = onbState();
  const wear = connectedWearables();
  const onbPct = onb.done ? 100 : Math.round((Object.keys(onb.answers).length / ONB_STEPS.length) * 100);

  function persist(list) { setPosts(list); saveJN(POSTS_KEY, list); }
  function like(p) { const had = !!(p.reaction || p.liked); persist(posts.map((x) => x.id === p.id ? { ...x, liked: false, reaction: had ? null : "like", likes: x.likes + (had ? -1 : 1) } : x)); }
  function react(p, key) { const had = !!(p.reaction || p.liked); persist(posts.map((x) => x.id === p.id ? { ...x, liked: false, reaction: key, likes: x.likes + (had ? 0 : 1) } : x)); }
  function save(p) { const s = { ...saved, [p.id]: !saved[p.id] }; setSaved(s); saveJN("pf-jane-saved", s); showToast(s[p.id] ? "Saved to My Saved" : "Removed from My Saved"); }
  function addComment() {
    const t = cDraft.trim(); if (!t) return;
    persist(posts.map((x) => x.id === commentId ? { ...x, comments: [...x.comments, { by: "jane", text: t, likes: 0, t: "Just now" }] } : x)); setCDraft("");
  }
  function publish() {
    const t = draft.trim(); if (!t) return;
    persist([{ id: "p" + Date.now(), by: "jane", t: "Just now", text: t, likes: 0, shares: 0, liked: false, comments: [] }, ...posts]);
    setDraft(""); setComposeOpen(false); showToast("Shared with your clinic and other patients");
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }
  const pinnedPosts = PINNED_IDS.map((id) => posts.find((x) => x.id === id)).filter(Boolean);
  const feed = posts.filter((x) => !PINNED_IDS.includes(x.id));
  const curPost = posts.find((x) => x.id === commentId);
  function patch(p, fields) { persist(posts.map((x) => x.id === p.id ? { ...x, ...fields } : x)); }
  const postProps = { onLike: like, onReact: react, onPatch: patch, onComment: (p) => setCommentId(p.id), onShare: () => showToast("Link copied"), onSave: save, showToast };

  return (
    <div className={"m-screen jn-home" + (chromeHidden ? " chrome-hidden" : "") + (chromeFloat ? " chrome-float" : "")}>
      <PushBannerJN />
      <JNTopBar ref={headerRef} onMenu={() => setMenuOpen(true)} onBell={() => setNotifOpen(true)} />
      <div className="m-scroll" ref={scrollRef} style={{ paddingTop: chromeHidden ? 0 : headerH, paddingBottom: tabsH + 34 }}>
        <div className="m-pull-refresh" style={{ height: pull, transition: dragging ? "none" : "height .25s cubic-bezier(.22,.61,.36,1)" }}>
          <div className={"m-pull-spinner" + (refreshing ? " is-spinning" : "")} style={!refreshing ? { transform: "rotate(" + (pull * 3.2) + "deg)" } : undefined}><IcJN name="refresh-cw" size={18} color="var(--brand-navy)" /></div>
        </div>
        <main className="feed" key={feedKey}>
          <section className={"pf-pinned-box pf-pinned-box--m" + (pinsOpen ? " open" : "")} aria-label="Pinned posts">
            <button type="button" className="pf-pinned-box-head" onClick={() => setPinsOpen(!pinsOpen)} aria-expanded={pinsOpen}>
              <span className="pf-pinned-card-tag-tx"><DSJN.IconifyIcon name="fluent:pin-16-filled" size={15} color="#fff" />Pinned</span>
              <span className="pf-pinned-box-avs" aria-hidden="true">{pinnedPosts.map((p, i) => <span key={p.id} className="pf-pinned-box-av" style={{ marginLeft: i ? -10 : 0 }}><DSJN.Avatar name={PEOPLE[p.by].name} src={PEOPLE[p.by].avatar} size={28} /></span>)}</span>
              <span className="pf-pinned-box-count">{pinnedPosts.length} pinned posts</span>
              <span className="pf-pinned-box-hint">{pinsOpen ? "Hide" : "Show"}</span>
              <span className="pf-pinned-box-chev"><IcJN name="chevron-down" size={22} color="var(--brand-navy)" /></span>
            </button>
            {pinsOpen && <div className="pf-pinned-box-list">{pinnedPosts.map((p) => (
              <div key={p.id} className="pf-pinned-box-item">
                <div className="pf-pinned-box-item-bar"><span className="pf-pinned-box-item-lbl"><DSJN.IconifyIcon name="fluent:pin-12-filled" size={12} color="var(--brand-gold)" />Pinned post</span></div>
                <FeedPostJN p={p} pinned saved={!!saved[p.id]} {...postProps} />
              </div>))}</div>}
          </section>

          {!onb.done && (
            <button className="jn-feednudge" onClick={() => goJN("JaneOnboarding.html")}>
              <span className="bar" />
              <JNFace p={KATY} size={40} />
              <span className="tx"><small>From Katy, your clinician · Just now</small><b>{onbPct ? "You're " + onbPct + "% through your Health Pass" : "Set up your Health Pass before Monday"}</b><em>Finish onboarding</em></span>
            </button>)}

          {feed.map((p, i) => (
            <React.Fragment key={p.id}>
              {p.kind === "eventreg" ? <EventRegJN p={p} /> : <FeedPostJN p={p} saved={!!saved[p.id]} {...postProps} />}
              {i === 1 && !wear.length && (
                <button className="jn-connect infeed" onClick={() => goJN("JaneWearables.html")}>
                  <span className="ic"><IcJN name="watch" size={20} color="#fff" /></span>
                  <span className="tx"><b>Connect your wearables</b><small>Sleep, movement and nutrition feed your Health Analytics</small></span>
                  <IcJN name="chevron-right" size={20} color="rgba(255,255,255,.8)" />
                </button>)}
            </React.Fragment>))}
          <div className="jn-end">You're all caught up ✨</div>
        </main>
      </div>
      <JNDock ref={tabsRef} compact={chromeHidden} active="home" />
      <button className={"m-fab" + (chromeHidden ? " m-fab-compact" : "")} aria-label="Share a Post" onClick={() => goJN("JaneCreatePost.html")}><IcJN name="plus" size={24} color="#fff" /></button>
      <JNDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <JNNotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      <JNSheet open={composeOpen} onClose={() => setComposeOpen(false)} title="Share an update">
        <div className="jn-compose-who"><JNFace p={JANE} size={36} /><div><b>{JANE.name}</b><small>Visible to your clinic and other patients</small></div></div>
        <textarea className="jn-ta" rows={5} placeholder="How are you feeling? Ask a question, share progress…" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <div className="jn-row-btns">
          <button className="jn-btn ghost" onClick={() => showToast("Photos coming soon")}><IcJN name="camera" size={18} />Photo</button>
          <button className="jn-btn" disabled={!draft.trim()} onClick={publish}>Post</button>
        </div>
      </JNSheet>

      <JNSheet open={!!curPost} onClose={() => setCommentId(null)} title="Comments" tall>
        {curPost && (
          <div className="jn-comments">
            {curPost.comments.length === 0 && <p className="jn-empty">No comments yet. Be the first.</p>}
            {curPost.comments.map((c, i) => <DSJN.CommentItem key={i} author={authorJN(c.by)} text={c.text} likes={fmtN(c.likes || 0)} comments="0" reactions={null} reactionCount={null} replies={[]} style={{ marginBottom: 16 }} />)}
          </div>)}
        <div className="jn-input-row">
          <input className="jn-in" placeholder="Write a comment…" value={cDraft} onChange={(e) => setCDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addComment()} />
          <button className="jn-send" aria-label="Send" disabled={!cDraft.trim()} onClick={addComment}><IcJN name="send" size={18} color="#fff" /></button>
        </div>
      </JNSheet>
      <JNToast toast={toast} />
    </div>);
}

/* =======================================================================
   PROFILE / HEALTH PASS — Katy's ProfileMobile layout (pm-ig hero: avatar +
   counts, name + seals, bio lines, chips, Edit / Share / saved / settings;
   pm-steps "Complete your Health Pass"; pm-card sections) with the Health
   Pass card, Medical history, Supplements and Goals kept (user, 2026-10-26).
   JaneProfile.html loads styles.css + mobile.css + profile-mobile.css.
   ======================================================================= */
const PROFILE_KEY = "pf-jane-profile";
const SUPPLEMENTS = [{ n: "Vitamin D3", d: "2000 IU", f: "Daily, morning" }, { n: "Omega-3", d: "1000 mg", f: "Daily with food" }, { n: "Collagen peptides", d: "10 g", f: "Most days" }];
const GOALS = [{ t: "Sleep", target: "7h 30m a night", p: 0.82 }, { t: "Hydration", target: "2 L a day", p: 0.6 }, { t: "SPF every day", target: "7 of 7 days", p: 0.71 }];

/* Katy's app chrome on a Jane page: .m-top header (burger · logo · search ·
   bell · messages) + drawer + notifications, with the measured header height
   so the scroller can start under the absolute header. */
function useKatyChromeJN() {
  const headerRef = useRefJN(null);
  const [headerH, setHeaderH] = useStateJN(0);
  const [menuOpen, setMenuOpen] = useStateJN(false);
  const [notifOpen, setNotifOpen] = useStateJN(false);
  React.useLayoutEffect(() => { const el = headerRef.current; if (!el) return; const m = () => setHeaderH(el.offsetHeight); m(); const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect(); }, []);
  /* same scroll choreography as Home: past 40px the header floats, scrolling
     down hides it and compacts the dock, scrolling up brings both back */
  const scrollRef = useRefJN(null);
  const { hidden, floating } = useHeaderHideJN(scrollRef);
  const top = <JNTopBar ref={headerRef} onMenu={() => setMenuOpen(true)} onBell={() => setNotifOpen(true)} />;
  const layers = <React.Fragment><JNDrawer open={menuOpen} onClose={() => setMenuOpen(false)} /><JNNotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} /></React.Fragment>;
  const cls = (hidden ? " chrome-hidden" : "") + (floating ? " chrome-float" : "");
  const padTop = (extra) => hidden ? 0 : headerH + (extra || 0);
  return { top, layers, headerH, scrollRef, hidden, floating, cls, padTop };
}

function QRMark() {
  const cells = useMemoJN(() => { let s = 7; const out = []; for (let i = 0; i < 121; i++) { s = (s * 9301 + 49297) % 233280; out.push(s / 233280 > 0.55); } return out; }, []);
  return <div className="jn-qr" aria-hidden="true">{cells.map((on, i) => <span key={i} className={on ? "on" : ""} />)}</div>;
}
function PMCardJN({ title, sub, href, onClick, children, className }) {
  const Head = href || onClick ? "button" : "div";
  return (
    <section className={"pm-card jn-pmc" + (className ? " " + className : "")}>
      <Head className="jn-pmc-h" onClick={onClick || (href ? () => goJN(href) : undefined)}>
        <span className="tx"><h3>{title}</h3>{sub && <p>{sub}</p>}</span>
        {(href || onClick) && <IcJN name="chevron-right" size={20} color="var(--gray-400)" />}
      </Head>
      {children}
    </section>);
}

function ProfileScreen() {
  const { top, layers, scrollRef, cls, padTop, hidden } = useKatyChromeJN();
  const [prof, setProf] = useStateJN(() => readJN(PROFILE_KEY, { name: JANE.name, phone: "+44 7700 900123", email: "jane.taylor@example.com", dob: JANE.dob, location: "London, UK", bio: "" }));
  const [edit, setEdit] = useStateJN(qJN("edit") === "1");
  const [passOpen, setPassOpen] = useStateJN(false);
  const [draft, setDraft] = useStateJN(prof);
  const [toast, showToast] = useToastJN();
  const onb = onbState();
  const wear = connectedWearables();
  const hs = healthSetup();
  const medical = onb.answers.medical || ["No known allergies"];
  const goalsChosen = onb.answers.goals || [];
  const friends = readJN("pf-jane-friends", []);
  const myPosts = (readJN("pf-jane-posts", null) || []).filter((p) => p.by === "jane");
  const going = Object.values(readJN("pf-jane-events", { ev1: true })).filter(Boolean).length;
  const steps = [
    { label: "Add a profile photo", done: true },
    { label: "Answer the onboarding questions", done: !!onb.done, href: "JaneOnboarding.html" },
    { label: "Tell us your height & weight", done: !!hs.height, href: "JaneHealth.html?setup=1" },
    { label: "Connect a wearable", done: wear.length > 0, href: "JaneWearables.html" },
    { label: "Share your Health Pass with Katy", done: onb.consent !== false && !!onb.done, href: "JaneOnboarding.html" },
    { label: "Add a friend", done: friends.length > 0, href: "JaneHealth.html" }];
  const doneN = steps.filter((s) => s.done).length; const pct = Math.round((doneN / steps.length) * 100); const next = steps.find((s) => !s.done);
  const seals = ["gb", ...(onb.done ? ["verified"] : [])];
  function save() { setProf(draft); saveJN(PROFILE_KEY, draft); setEdit(false); showToast("Profile updated"); }

  return (
    <div className={"jn-screen m-screen jn-prof-screen" + cls}>
      {top}
      <div className="jn-scroll" ref={scrollRef} style={{ paddingTop: padTop(0) }}>
        <div className="pm-ig">
          <div className="pm-ig-top">
            <button type="button" className="pm-ig-avwrap pm-ig-avbtn" aria-label="View profile picture" onClick={() => setPassOpen(true)}>
              <DSJN.Avatar name={prof.name} src={JANE.avatar} size={92} className="pm-ig-av" />
            </button>
            <div className="pm-ig-stats">
              <div className="pm-ig-stat"><span className="n">{myPosts.length}</span><span className="l">posts</span></div>
              <div className="pm-ig-stat"><span className="n">{friends.length}</span><span className="l">friends</span></div>
              <div className="pm-ig-stat"><span className="n">{going}</span><span className="l">events</span></div>
            </div>
          </div>
          <div className="pm-ig-name"><span className="nm">{prof.name}</span><DSJN.VerificationSeals seals={seals} size={20} /></div>
          <div className="pm-ig-bio">
            <p><span className="bi">🇬🇧</span> Patient at {JANE.clinic} · with {KATY.name}</p>
            <p><span className="bi">💉</span> Lip filler · Skin boosters · SPF every day</p>
            <p className="pm-ig-live" onClick={() => goJN("JaneScheduleCall.html?ret=JaneProfile.html")} style={{ cursor: "pointer" }}><span className="bi"><IcJN name="calendar" size={14} color="var(--text-primary)" /></span>Next review: <b>Tue 3 Nov · 2:30pm</b></p>
            {prof.bio && <p>{prof.bio}</p>}
          </div>
          <div className="jn-chiprow">
            <span className="pm-chip pin"><IcJN name="map-pin" size={16} color="var(--brand-navy)" /><span className="tx">{prof.location || "London, UK"}</span></span>
            <span className="pm-chip pin"><IcJN name="building-2" size={16} color="var(--brand-navy)" /><span className="tx">{JANE.clinic}</span></span>
            <button className="pm-chip add" onClick={() => { setDraft(prof); setEdit(true); }}><IcJN name="plus" size={16} />Add</button>
          </div>
          <div className="pm-ig-actions">
            <button className="pm-ig-btn" onClick={() => { setDraft(prof); setEdit(true); }}>Edit Profile</button>
            <button className="pm-ig-btn" onClick={() => setPassOpen(true)}>Share Profile</button>
            <button className="pm-ig-btn icon" aria-label="My Saved" onClick={() => goJN("JaneNewsfeed.html")}><IcJN name="bookmark" size={20} color="var(--text-heading)" /></button>
            <button className="pm-ig-btn icon" aria-label="Settings" onClick={() => showToast("Settings coming soon")}><IcJN name="settings" size={20} color="var(--text-heading)" /></button>
          </div>
        </div>

        <button className="pm-steps jn-steps" onClick={() => next && goJN(next.href || "JaneOnboarding.html")}>
          <div className="pm-steps-collapsed-top"><h3 className="pm-steps-h">Complete your Health Pass</h3><IcJN name="chevron-right" size={20} color="var(--gray-400)" /></div>
          <p className="pm-steps-sub">{doneN} of {steps.length} complete · so Katy can tailor your care</p>
          <div className="pm-steps-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><span className="pm-steps-fill" style={{ width: pct + "%" }} /></div>
          <p className="pm-steps-pct">{pct}% complete</p>
          {next ? <span className="pm-steps-next jn-steps-next"><span className="pm-steps-next-lb">Next step</span><span className="pm-steps-next-ti">{next.label}</span><IcJN name="arrow-right" size={16} color="var(--text-heading)" /></span>
                : <span className="pm-steps-next jn-steps-next done"><IcJN name="check" size={16} color="var(--success)" /><span className="pm-steps-next-ti">All set — your Health Pass is active</span></span>}
        </button>

        <div className="jn-pass-wrap">
          <button className="jn-pass" onClick={() => setPassOpen(true)}>
            <div className="jn-pass-top"><img src="assets/profinity-academy-logo-full.png" alt="PROfinity" /><span className="st">{onb.done ? "Active" : "Incomplete"}</span></div>
            <div className="jn-pass-mid"><span className="lbl">Health Pass</span><b>{prof.name}</b><small>ID {JANE.passId} · DOB {prof.dob}</small></div>
            <div className="jn-pass-bot"><span>{JANE.clinic} · member since {JANE.since}</span><span className="qrbtn"><IcJN name="qr-code" size={16} color="#fff" />Show</span></div>
          </button>
          {!onb.done && <button className="jn-link-row" onClick={() => goJN("JaneOnboarding.html")}><IcJN name="alert-circle" size={16} color="var(--warning)" />Complete the onboarding questionnaire to activate your pass<IcJN name="chevron-right" size={16} /></button>}
        </div>

        <PMCardJN title="Medical history" sub="Allergies, treatments & your next review" onClick={() => goJN("JaneOnboarding.html")}>
          <div className="jn-tags">{medical.map((m) => <span key={m} className="jn-tag">{m}</span>)}</div>
          {hs.height && <div className="jn-kv"><span>Height · Weight</span><b>{hs.height} cm · {hs.weight} kg</b></div>}
          <div className="jn-kv"><span>Previous treatments</span><b>{onb.answers.history || "Not answered"}</b></div>
          <div className="jn-kv"><span>Last treatment</span><b>Lip filler · 1 Oct 2026</b></div>
          <div className="jn-kv"><span>Next review</span><b>Tue 3 Nov · 2:30pm</b></div>
        </PMCardJN>

        {(() => { const up = upcomingCall(); return (
        <PMCardJN title="Calls & appointments" sub={up ? "Next call: " + callWhen(up) + " with " + callWho(up).first : "Your clinic visits and free 15-minute calls"} href={"JaneScheduleCall.html?ret=JaneProfile.html"}>
          <div className="jn-pmc-list">
            {up ? <div className="jn-li"><span className="ic"><IcJN name={up.type === "phone" ? "phone" : "video"} size={16} color="var(--brand-navy)" /></span><span className="tx"><b>{callTypeLabel(up)} with {callWho(up).first}</b><small>{callWhen(up)} · {up.reason}</small></span><span className="jn-pill">Booked</span></div>
                : <div className="jn-li"><span className="ic"><IcJN name="phone" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>Schedule a call</b><small>Katy, Nurse Beth or Dr Priya · aftercare, swelling, anything you're unsure about</small></span><IcJN name="chevron-right" size={18} color="var(--gray-400)" /></div>}
          </div>
        </PMCardJN>); })()}

        <PMCardJN title="Supplements" sub={SUPPLEMENTS.length + " in your plan"} onClick={() => showToast("Ask Katy to update your supplements")}>
          <div className="jn-pmc-list">
            {SUPPLEMENTS.map((s) => <div key={s.n} className="jn-li"><span className="ic"><IcJN name="pill" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>{s.n}</b><small>{s.d} · {s.f}</small></span></div>)}
          </div>
        </PMCardJN>

        <PMCardJN title="Goals" sub="What you're working on this quarter" href="JaneHealth.html">
          <div className="jn-pmc-list">
            {GOALS.map((g) => <div key={g.t} className="jn-goal"><div className="top"><b>{g.t}</b><span>{g.target}</span></div><div className="bar"><i style={{ width: g.p * 100 + "%" }} /></div></div>)}
          </div>
          {goalsChosen.length > 0 && <div className="jn-tags" style={{ marginTop: 10 }}>{goalsChosen.map((g) => <span key={g} className="jn-tag gold">{g}</span>)}</div>}
        </PMCardJN>

        <PMCardJN title="Track your health" sub="Sleep · Movement · Nutrition · Skin check-in" href="JaneHealth.html">
          <div className="jn-pmc-chips"><span className="jn-tag">{wear.length ? wear.map((w) => w.name).join(", ") : "No wearable yet"}</span><span className="jn-tag">Skin score 78</span><span className="jn-tag">Sleep 7h 18m</span></div>
        </PMCardJN>

        <PMCardJN title="Activity" sub={myPosts.length ? myPosts.length + " recent posts & updates" : "Nothing shared yet"} href="JaneNewsfeed.html">
          {myPosts.slice(0, 3).map((p) => <div key={p.id} className="jn-act-row"><JNFace p={JANE} size={26} /><b>{JANE.name}</b><span>{p.text.slice(0, 48)}{p.text.length > 48 ? "…" : ""}</span><em>{p.t}</em></div>)}
        </PMCardJN>

        <PMCardJN title="Connected apps & devices" sub={wear.length ? "Synced a few minutes ago" : "Connect Apple Health, Oura, Fitbit and more"} href="JaneWearables.html" />

        <button className="pm-logout" onClick={() => showToast("Logged out (demo)")}><IcJN name="log-out" size={20} color="var(--error)" />Logout</button>
        <div className="jn-end">PROfinity · patient app</div>
      </div>
      <JNTabs active="profile" compact={hidden} />
      {layers}

      <JNSheet open={edit} onClose={() => setEdit(false)} title="Edit profile">
        {[["name", "Full name"], ["dob", "Date of birth"], ["location", "Location"], ["phone", "Phone"], ["email", "Email"], ["bio", "Bio"]].map(([k, l]) => (
          <label key={k} className="jn-field"><span>{l}</span><input className="jn-in" value={draft[k] || ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} /></label>))}
        <button className="jn-btn block" onClick={save}>Save changes</button>
      </JNSheet>

      <JNSheet open={passOpen} onClose={() => setPassOpen(false)}>
        <div className="jn-passqr">
          <QRMark />
          <b>{prof.name}</b>
          <small>Health Pass {JANE.passId}</small>
          <p>Show this at reception. It gives {JANE.clinic} your medical history, consent and treatment record.</p>
          <button className="jn-btn block" onClick={() => setPassOpen(false)}>Done</button>
        </div>
      </JNSheet>
      <JNToast toast={toast} />
    </div>);
}

/* =======================================================================
   ONBOARDING QUESTIONNAIRE
   ======================================================================= */
function OnboardingScreen() {
  const init = onbState();
  const [step, setStep] = useStateJN(init.done ? 0 : Math.min(init.step || 0, ONB_STEPS.length - 1));
  const [answers, setAnswers] = useStateJN(init.answers || {});
  const [consent, setConsent] = useStateJN(init.consent !== false);
  const [done, setDone] = useStateJN(false);
  const total = ONB_STEPS.length + 1;
  const cur = ONB_STEPS[step];
  const pct = Math.round(((done ? total : step) / total) * 100);

  function toggle(opt) {
    const prev = answers[cur.key];
    let next;
    if (cur.multi) {
      const list = Array.isArray(prev) ? prev : [];
      if (cur.key === "medical" && opt === "No known allergies") next = list.includes(opt) ? [] : [opt];
      else next = list.includes(opt) ? list.filter((x) => x !== opt) : [...list.filter((x) => !(cur.key === "medical" && x === "No known allergies")), opt];
    } else next = opt;
    const a = { ...answers, [cur.key]: next }; setAnswers(a); saveJN(ONB_KEY, { answers: a, step, done: false, consent });
  }
  const answered = cur ? (cur.multi ? (answers[cur.key] || []).length > 0 : !!answers[cur.key]) : true;
  function next() {
    if (step < ONB_STEPS.length - 1) { const s = step + 1; setStep(s); saveJN(ONB_KEY, { answers, step: s, done: false, consent }); }
    else if (step === ONB_STEPS.length - 1) setStep(ONB_STEPS.length);
    else { saveJN(ONB_KEY, { answers, step: 0, done: true, consent, completedAt: Date.now() }); setDone(true); }
  }
  function back() { if (step === 0) goJN("JaneProfile.html"); else setStep(step - 1); }

  if (done) return (
    <div className="jn-screen jn-onb">
      <div className="jn-onb-done">
        <span className="ok"><IcJN name="check" size={40} color="#fff" /></span>
        <h2>Your Health Pass is ready</h2>
        <p>Thanks {JANE.first}. Katy can now see your history, goals and preferences before your next visit.</p>
        <button className="jn-btn block" onClick={() => goJN("JaneProfile.html")}>View my Health Pass</button>
        <button className="jn-btn block ghost" onClick={() => goJN("JaneWearables.html")}><IcJN name="watch" size={18} />Connect your wearables</button>
      </div>
    </div>);

  return (
    <div className="jn-screen jn-onb">
      <JNBar title="Get to know you" back={back} trailing={<button className="jn-skip" onClick={() => goJN("JaneNewsfeed.html")}>Later</button>} />
      <div className="jn-onb-prog"><div className="bar"><i style={{ width: pct + "%" }} /></div><span>{pct}% complete</span></div>
      <div className="jn-scroll">
        {cur ? (
          <React.Fragment>
            <span className="jn-onb-step">Question {step + 1} of {ONB_STEPS.length}</span>
            <h2 className="jn-onb-q">{cur.q}</h2>
            {cur.sub && <p className="jn-onb-sub">{cur.sub}</p>}
            <div className="jn-opts">
              {cur.opts.map((o, i) => { const on = cur.multi ? (answers[cur.key] || []).includes(o) : answers[cur.key] === o; return (
                <button key={o} className={"jn-opt" + (on ? " on" : "")} onClick={() => toggle(o)}>
                  <span className="letter">{String.fromCharCode(65 + i)}</span><span className="tx">{o}</span>
                  <span className={"tick" + (cur.multi ? " sq" : "")}>{on && <IcJN name="check" size={14} color="#fff" />}</span>
                </button>); })}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span className="jn-onb-step">Last step</span>
            <h2 className="jn-onb-q">Share your answers with your clinician?</h2>
            <p className="jn-onb-sub">Your Health Pass is private. Sharing lets {KATY.name} prepare for your appointments and tailor aftercare.</p>
            <button className={"jn-consent" + (consent ? " on" : "")} onClick={() => setConsent(!consent)}>
              <JNFace p={KATY} size={44} />
              <span className="tx"><b>Share with {KATY.name}</b><small>{KATY.title}</small></span>
              <span className={"jn-switch" + (consent ? " on" : "")}><i /></span>
            </button>
            <div className="jn-summary">
              {ONB_STEPS.map((s) => <div key={s.key} className="jn-kv col"><span>{s.q}</span><b>{Array.isArray(answers[s.key]) ? answers[s.key].join(", ") : (answers[s.key] || "—")}</b></div>)}
            </div>
          </React.Fragment>)}
      </div>
      <div className="jn-onb-foot">
        <button className="jn-btn block" disabled={!answered} onClick={next}>{cur ? "Continue" : "Finish"}<IcJN name="arrow-right" size={18} /></button>
      </div>
    </div>);
}

/* =======================================================================
   CONNECT YOUR WEARABLES
   ======================================================================= */
function WearablesScreen() {
  const [state, setState] = useStateJN(wearState);
  const [sel, setSel] = useStateJN(null);
  const [perms, setPerms] = useStateJN({ sleep: true, movement: true, nutrition: true, heart: true });
  const [busy, setBusy] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const connected = WEARABLES.filter((w) => state[w.id]);

  function connect() {
    setBusy(true);
    setTimeout(() => { const s = { ...state, [sel.id]: { at: Date.now(), perms } }; setState(s); saveJN(WEAR_KEY, s); setBusy(false); setSel(null); showToast(sel.name + " connected"); }, 1400);
  }
  function disconnect(w) { const s = { ...state }; delete s[w.id]; setState(s); saveJN(WEAR_KEY, s); setSel(null); showToast(w.name + " disconnected"); }

  const { top, layers, scrollRef, cls, padTop, hidden } = useKatyChromeJN();
  return (
    <div className={"jn-screen m-screen" + cls}>
      {top}
      <div className="jn-scroll" ref={scrollRef} style={{ paddingTop: padTop(8) }}>
        <button className="jn-backlink" onClick={() => history.length > 1 ? history.back() : goJN("JaneProfile.html")}><IcJN name="chevron-left" size={18} />Back</button>
        <section className="jn-wear-hero">
          <div className="orbit"><span className="c1"><IcJN name="moon" size={16} color="#fff" /></span><span className="c2"><IcJN name="footprints" size={16} color="#fff" /></span><span className="c3"><IcJN name="droplets" size={16} color="#fff" /></span><span className="core"><IcJN name="heart-pulse" size={26} color="#fff" /></span></div>
          <h2>Your body, in your Health Pass</h2>
          <p>We read sleep, movement and nutrition only. Nothing is shared beyond your clinic, and you can disconnect any time.</p>
        </section>
        {connected.length > 0 && (
          <React.Fragment>
            <h3 className="jn-h">Connected</h3>
            <div className="jn-card list">
              {connected.map((w) => (
                <button key={w.id} className="jn-li" onClick={() => setSel(w)}>
                  <span className="ic tint" style={{ background: w.tint }}><IcJN name={w.icon} size={18} color="#fff" /></span>
                  <span className="tx"><b>{w.name}</b><small className="ok"><IcJN name="check-circle-2" size={12} color="var(--success)" /> Connected · synced just now</small></span>
                  <IcJN name="chevron-right" size={18} color="var(--gray-450)" />
                </button>))}
            </div>
          </React.Fragment>)}
        <h3 className="jn-h">{connected.length ? "Add another" : "Choose a device or app"}</h3>
        <div className="jn-card list">
          {WEARABLES.filter((w) => !state[w.id]).map((w) => (
            <button key={w.id} className="jn-li" onClick={() => setSel(w)}>
              <span className="ic tint" style={{ background: w.tint }}><IcJN name={w.icon} size={18} color="#fff" /></span>
              <span className="tx"><b>{w.name}</b><small>{w.sub}</small></span>
              <span className="jn-pill">Connect</span>
            </button>))}
        </div>
        <h3 className="jn-h">What we track</h3>
        <div className="jn-track">
          <div><IcJN name="moon" size={20} color="#6c63ff" /><b>Sleep</b><small>Duration, quality, bedtime</small></div>
          <div><IcJN name="footprints" size={20} color="#16a34a" /><b>Movement</b><small>Steps, active minutes</small></div>
          <div><IcJN name="droplets" size={20} color="#0ea5e9" /><b>Nutrition</b><small>Water, logged meals</small></div>
        </div>
        <div className="jn-end">Data stays on your Health Pass · encrypted in transit</div>
      </div>
      <JNTabs active="health" compact={hidden} />
      {layers}

      <JNSheet open={!!sel} onClose={() => !busy && setSel(null)} title={sel ? (state[sel.id] ? sel.name : "Connect " + sel.name) : ""}>
        {sel && !state[sel.id] && (
          <React.Fragment>
            <p className="jn-sheet-p">PROfinity would like to read the following from {sel.name}:</p>
            {[["sleep", "Sleep", "moon"], ["movement", "Movement & steps", "footprints"], ["nutrition", "Nutrition & water", "droplets"], ["heart", "Heart rate", "heart-pulse"]].map(([k, l, ic]) => (
              <button key={k} className="jn-perm" onClick={() => setPerms({ ...perms, [k]: !perms[k] })}><IcJN name={ic} size={18} color="var(--brand-navy)" /><span>{l}</span><span className={"jn-switch" + (perms[k] ? " on" : "")}><i /></span></button>))}
            <button className="jn-btn block" disabled={busy} onClick={connect}>{busy ? <span className="jn-spin" /> : <IcJN name="link" size={18} />}{busy ? "Connecting…" : "Allow & connect"}</button>
            <button className="jn-btn block ghost" disabled={busy} onClick={() => setSel(null)}>Not now</button>
          </React.Fragment>)}
        {sel && state[sel.id] && (
          <React.Fragment>
            <p className="jn-sheet-p"><b>{sel.name}</b> is connected and syncing sleep, movement and nutrition to your Health Pass.</p>
            <button className="jn-btn block ghost" onClick={() => { showToast("Syncing " + sel.name + "…"); setSel(null); }}><IcJN name="refresh-cw" size={18} />Sync now</button>
            <button className="jn-btn block danger" onClick={() => disconnect(sel)}><IcJN name="link-2" size={18} />Disconnect</button>
          </React.Fragment>)}
      </JNSheet>
      <JNToast toast={toast} />
    </div>);
}

/* =======================================================================
   HEALTH ANALYTICS
   ======================================================================= */
function Bars({ data, color, max, unit, fmt }) {
  const m = max || Math.max(...data) * 1.1;
  return (
    <div className="jn-bars">
      {data.map((v, i) => <div key={i} className="col"><i style={{ height: Math.max(6, (v / m) * 100) + "%", background: i === 6 ? color : color + "66" }} title={(fmt ? fmt(v) : v) + (unit || "")} /><span>{DAYS[i]}</span></div>)}
    </div>);
}
function Line({ data, color }) {
  const w = 300, h = 90, min = Math.min(...data) - 5, max = Math.max(...data) + 5;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * (w - 20) + 10, h - 10 - ((v - min) / (max - min)) * (h - 20)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return (
    <svg className="jn-line" viewBox={"0 0 " + w + " " + h} preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="jnfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={d + " L" + pts[pts.length - 1][0] + " " + h + " L" + pts[0][0] + " " + h + " Z"} fill="url(#jnfill)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4.5 : 2.5} fill={i === pts.length - 1 ? color : "#fff"} stroke={color} strokeWidth="2" />)}
    </svg>);
}
function Ring({ value, size = 128, stroke = 11, color = "var(--brand-gold)", children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="jn-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={"0 0 " + size + " " + size}><circle cx={size / 2} cy={size / 2} r={r} stroke="var(--gray-150)" strokeWidth={stroke} fill="none" /><circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)} transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"} /></svg>
      <div className="in">{children}</div>
    </div>);
}

/* First-time Health setup (user, 2026-10-23, Google Health screenshots):
   tracking method → profile info → email updates. Shown once (pf-jane-health-
   setup), ?setup=1 replays it. Choosing a watch/tracker ends on Connect your
   wearables; choosing the phone ends on Health Analytics. */
const HSETUP_KEY = "pf-jane-health-setup";
function healthSetup() { return readJN(HSETUP_KEY, {}); }
function HealthSetup({ onDone }) {
  const [step, setStep] = useStateJN(0);
  const [method, setMethod] = useStateJN(null);
  const [prof, setProf] = useStateJN({ height: "172", weight: "54", sex: "Female" });
  const finish = (emails) => { const s = { done: true, method, ...prof, emails, at: Date.now() }; saveJN(HSETUP_KEY, s); onDone(s); };
  const Opt = ({ k, icon, tint, text }) => (
    <button className={"jn-setup-opt" + (method === k ? " on" : "")} onClick={() => setMethod(k)}>
      <span className="art" style={{ background: tint }}><IcJN name={icon} size={30} color="#fff" /></span>
      <span className="tx">{text}</span>
      <span className="tick">{method === k && <IcJN name="check" size={14} color="#fff" />}</span>
    </button>);
  return (
    <div className="jn-screen jn-setup">
      <div className="jn-scroll">
        {step === 0 && (
          <React.Fragment>
            <span className="jn-setup-ic"><IcJN name="watch" size={30} color="var(--brand-navy)" /></span>
            <h2>How would you like to track your health?</h2>
            <div className="jn-setup-opts">
              <Opt k="wearable" icon="watch" tint="linear-gradient(135deg,#292569,#4f47d6)" text="Connect a smartwatch, fitness tracker or smart scale" />
              <Opt k="phone" icon="footprints" tint="linear-gradient(135deg,#0f766e,#14b8a6)" text="Use your phone to track your steps and more with the app" />
            </div>
          </React.Fragment>)}
        {step === 1 && (
          <React.Fragment>
            <span className="jn-setup-ic"><IcJN name="user" size={30} color="var(--brand-navy)" /></span>
            <h2>Tell us about yourself</h2>
            <p className="jn-setup-sub">PROfinity uses this information to calculate some metrics.</p>
            <h3 className="jn-h">Your profile info</h3>
            <div className="jn-setup-grid">
              <label className="jn-setup-field"><span>Height</span><div className="in"><input inputMode="decimal" value={prof.height} onChange={(e) => setProf({ ...prof, height: e.target.value })} /><em>cm</em></div></label>
              <label className="jn-setup-field"><span>Weight</span><div className="in"><input inputMode="decimal" value={prof.weight} onChange={(e) => setProf({ ...prof, weight: e.target.value })} /><em>kg</em></div></label>
            </div>
            <label className="jn-setup-field focus"><span>Sex</span><div className="in"><select value={prof.sex} onChange={(e) => setProf({ ...prof, sex: e.target.value })}><option>Female</option><option>Male</option><option>Prefer not to say</option></select><IcJN name="chevron-down" size={18} color="var(--text-secondary)" /></div></label>
            <p className="jn-setup-note">Sex is used to calculate metrics like calories burned and cardio load.</p>
          </React.Fragment>)}
        {step === 2 && (
          <React.Fragment>
            <span className="jn-setup-ic"><IcJN name="bell" size={30} color="var(--brand-navy)" /></span>
            <h2>Stay updated with emails from PROfinity</h2>
            <p className="jn-setup-sub">Stay up to date on new features, clinic events and offers. Plus, receive surveys and invitations to take part in skin health research.</p>
          </React.Fragment>)}
      </div>
      <div className="jn-setup-foot">
        {step === 0 && <React.Fragment>
          <p className="jn-setup-alt"><b>Want to use another method?</b> You can connect medical records on your favourite apps later.</p>
          {method ? <button className="jn-btn block" onClick={() => setStep(1)}>Continue<IcJN name="arrow-right" size={18} /></button>
                  : <button className="jn-btn block ghost outline" onClick={() => setStep(1)}>Not now</button>}
        </React.Fragment>}
        {step === 1 && <button className="jn-btn block" disabled={!prof.height || !prof.weight} onClick={() => setStep(2)}>Save and continue</button>}
        {step === 2 && <div className="jn-row-btns"><button className="jn-btn" onClick={() => finish(false)}>Not now</button><button className="jn-btn" onClick={() => finish(true)}>Stay updated</button></div>}
      </div>
    </div>);
}

function HealthScreen() {
  const [setup, setSetup] = useStateJN(() => qJN("setup") === "1" || !healthSetup().done);
  if (setup) return <HealthSetup onDone={(st) => { if (st.method === "wearable" && !connectedWearables().length) goJN("JaneWearables.html"); else setSetup(false); }} />;
  return <HealthDashboard />;
}
/* Health "Today" dashboard (user, 2026-10-23, Google Health screenshots):
   centred title, three swipeable tile pages (weekly ring + Steps/Readiness/
   Sleep · Vitals/Weight/Food/Hydration/Skin/Next review · Distance/Calories/
   Exercise days/Hourly/Heart rate/Cycle), Log · Start · edit actions and the
   "Welcome! Let's get you set up" 0/4 checklist. Fresh users (nothing
   connected, no phone tracking) see zeros / Calibrating / No data; once a
   wearable or phone tracking is on, the sample week fills the tiles. */
const LOGS_KEY = "pf-jane-logs", CYCLE_KEY = "pf-jane-cycle", FRIENDS_KEY = "pf-jane-friends", PHONE_KEY = "pf-jane-phone-tracking", TILES_KEY = "pf-jane-tiles";
function HealthDashboard() {
  const hs = healthSetup();
  const wear = connectedWearables();
  const [phone, setPhone] = useStateJN(() => hs.method === "phone" || readJN(PHONE_KEY, false));
  const [logs, setLogs] = useStateJN(() => readJN(LOGS_KEY, { water: 0, weight: hs.weight || "", food: 0, skin: null }));
  const [cycle, setCycle] = useStateJN(() => readJN(CYCLE_KEY, null));
  const [friends, setFriends] = useStateJN(() => readJN(FRIENDS_KEY, []));
  const [hidden, setHidden] = useStateJN(() => readJN(TILES_KEY, {}));
  const [page, setPage] = useStateJN(0);
  const [listOpen, setListOpen] = useStateJN(true);
  const [sheet, setSheet] = useStateJN(null); // log | start | edit | cycle | friends
  const [workout, setWorkout] = useStateJN(null); // { kind, start }
  const [elapsed, setElapsed] = useStateJN(0);
  const [weightDraft, setWeightDraft] = useStateJN(logs.weight || "");
  const [cycleDraft, setCycleDraft] = useStateJN({ last: "2026-10-12", len: 28 });
  const [toast, showToast] = useToastJN();
  const railRef = useRefJN(null);
  const chrome = useKatyChromeJN();
  const tracking = wear.length > 0 || phone;
  useEffectJN(() => { if (!workout) return; const t = setInterval(() => setElapsed(Math.floor((Date.now() - workout.start) / 1000)), 1000); return () => clearInterval(t); }, [workout]);
  function saveLogs(l) { setLogs(l); saveJN(LOGS_KEY, l); }
  function onRail() { const el = railRef.current; if (!el) return; setPage(Math.round(el.scrollLeft / el.clientWidth)); }
  function goPage(i) { const el = railRef.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" }); }
  const mmss = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

  const ring = tracking ? { pct: 64, sub: "96 of 150 min", plus: "+12" } : { pct: 0, sub: "Calibrating – 7 days left", plus: "+0" };
  const tiles = {
    /* c = icon tint (mint · lav · sky · rose · gold · navy), polish 2026-10-28 */
    steps: { k: "steps", ic: "footprints", t: "Steps", v: tracking ? HEALTH.steps[6].toLocaleString() : "0", tone: "mint", c: "mint" },
    readiness: { k: "readiness", ic: "activity", t: "Readiness", v: tracking ? "82 · Good" : "Calibrating", tone: tracking ? "mint" : "grey", c: "sky" },
    sleep: { k: "sleep", ic: "moon", t: "Sleep", v: tracking ? fmtH(HEALTH.sleep[6]) : "No data", tone: "lav", c: "lav" },
    vitals: { k: "vitals", ic: "activity", t: "Vitals", v: tracking ? "RHR 61 bpm" : "No data", tone: tracking ? "mint" : "grey", c: "rose" },
    weight: { k: "weight", ic: "scale", t: "Weight", v: logs.weight ? logs.weight + " kg" : "No data", tone: "grey", navy: true, c: "navy", on: () => setSheet("log") },
    food: { k: "food", ic: "apple", t: "Food", v: logs.food ? logs.food + (logs.food === 1 ? " meal" : " meals") : "No data", tone: logs.food ? "mint" : "grey", c: "gold", on: () => setSheet("log") },
    water: { k: "water", ic: "glass-water", t: "Hydration", v: logs.water ? (logs.water * 250).toLocaleString() + " ml" : "No data", tone: logs.water ? "mint" : "grey", c: "sky", on: () => setSheet("log") },
    skin: { k: "skin", ic: "sun", t: "Skin check-in", v: logs.skin ? logs.skin + " / 100" : "Tap to log", tone: logs.skin ? "gold" : "grey", c: "gold", on: () => setSheet("log") },
    review: { k: "review", ic: "calendar", t: "Next review", v: "Tue 3 Nov", tone: "grey", navy: true, c: "navy", on: () => goJN("JaneScheduleCall.html?ret=JaneHealth.html") },
    distance: { k: "distance", ic: "map-pin", t: "Distance", v: tracking ? "7.4 km" : "0 km", tone: "mint", c: "mint" },
    cal: { k: "cal", ic: "flame", t: "Cal burned", v: tracking ? "1,840" : "0", tone: "mint", c: "rose" },
    exdays: { k: "exdays", ic: "dumbbell", t: "Exercise days", v: tracking ? "3 of 5" : "0 of 5", tone: "mint", c: "lav" },
    hourly: { k: "hourly", ic: "timer", t: "Hourly activity", v: tracking ? "9 of 12 hrs" : "No data", tone: "mint", c: "sky" },
    hr: { k: "hr", ic: "heart", t: "Heart rate", v: tracking ? "61 bpm" : "--", tone: "grey", navy: true, c: "rose" },
    cycle: { k: "cycle", ic: "flower", t: "Cycle health", v: cycle ? "Day " + cycleDay(cycle) + " · " + cyclePhase(cycle) : "Tap to set up", tone: cycle ? "rose" : "grey", c: "rose", on: () => setSheet("cycle") },
  };
  const show = (keys) => keys.map((k) => tiles[k]).filter((t) => !hidden[t.k]);
  const Tile = ({ t, wide }) => (
    <button className={"jh-tile " + t.tone + (wide ? " wide" : "") + (t.navy ? " navy" : "")} onClick={t.on || (() => showToast(t.t + " · " + t.v))}>
      <span className={"ic c-" + (t.c || "navy")}><IcJN name={t.ic} size={20} /></span>
      <span className="tx"><b>{t.t}</b><span>{t.v}</span></span>
    </button>);

  const checklist = [
    { k: "apps", ic: "layout-grid", art: "lav", t: "Connect apps to see all your data", sub: "Apple Health, Oura, Fitbit and more", done: wear.length > 0, on: () => goJN("JaneWearables.html") },
    { k: "cycle", ic: "flower", art: "rose", t: "Set up cycle health tracking", sub: "Time treatments around your cycle", done: !!cycle, on: () => setSheet("cycle") },
    { k: "phone", ic: "footprints", art: "mint", t: "Track steps with your phone", sub: "No wearable needed", done: phone, on: () => { setPhone(true); saveJN(PHONE_KEY, true); showToast("Phone tracking on · steps will sync from your phone"); } },
    { k: "friends", ic: "users", art: "sky", t: "Add friends to motivate each other", sub: "Cheer each other on, data stays private", done: friends.length > 0, on: () => setSheet("friends") },
  ];
  const doneN = checklist.filter((c) => c.done).length;
  const OTHER_JANES = ["miranda", "amir", "mark"];
  function toggleFriend(id) { const f = friends.includes(id) ? friends.filter((x) => x !== id) : [...friends, id]; setFriends(f); saveJN(FRIENDS_KEY, f); }

  return (
    <div className={"jn-screen m-screen jh" + chrome.cls}>
      {chrome.top}
      <div className="jn-scroll jh-scroll" ref={chrome.scrollRef} style={{ paddingTop: chrome.padTop(8) }}>
        <div className="jh-title">
          <div><h1>Health</h1><span className="jh-meta"><span className="jh-date">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</span><span className={"jh-src" + (tracking ? " on" : "")}><i />{tracking ? (wear.length ? wear.map((w) => w.name).join(", ") : "Phone tracking") : "Not tracking yet"}</span></span></div>
          <button className="jn-iconbtn" aria-label="Devices" onClick={() => goJN("JaneWearables.html")}><IcJN name="watch" size={20} color="var(--brand-navy)" /></button>
        </div>
        {workout && <div className="jh-workout"><span className="dot" /><b>{workout.kind} in progress</b><span className="time">{mmss(elapsed)}</span><button onClick={() => { setWorkout(null); showToast(workout.kind + " saved · " + mmss(elapsed)); }}>Stop</button></div>}
        <div className="jh-rail" ref={railRef} onScroll={onRail}>
          <section className="jh-page">
            <button className="jh-ring" onClick={() => showToast(tracking ? "Weekly cardio · " + ring.sub : "Connect a wearable or turn on phone tracking to start")}>
              <Ring value={ring.pct / 100} size={178} stroke={26} color="var(--brand-gold)">
                <small className="arc">Weekly cardio</small><b>{ring.pct}<i>%</i></b><small className="sub">{ring.sub}</small>
              </Ring>
            </button>
            <div className="jh-stack">{show(["steps", "readiness", "sleep"]).map((t) => <Tile key={t.k} t={t} wide />)}</div>
          </section>
          <section className="jh-page grid">{show(["vitals", "weight", "food", "water", "skin", "review"]).map((t) => <Tile key={t.k} t={t} />)}</section>
          <section className="jh-page grid">{show(["distance", "cal", "exdays", "hourly", "hr", "cycle"]).map((t) => <Tile key={t.k} t={t} />)}</section>
        </div>
        <div className="jh-dots">{[0, 1, 2].map((i) => <button key={i} className={page === i ? "on" : ""} aria-label={"Page " + (i + 1)} onClick={() => goPage(i)} />)}</div>
        <div className="jh-actions">
          <button className="jh-act" onClick={() => setSheet("log")}><IcJN name="plus" size={22} />Log</button>
          <button className="jh-act primary" onClick={() => setSheet("start")}><IcJN name="activity" size={22} />Start</button>
          <button className="jh-act round" aria-label="Customise" onClick={() => setSheet("edit")}><IcJN name="pencil" size={20} /></button>
        </div>

        <section className="jh-sheet">
          <div className="jh-list">
            <button className="jh-list-head" onClick={() => setListOpen(!listOpen)} aria-expanded={listOpen}>
              <span className="tx">
                <b>{doneN === checklist.length ? "You're all set up 🎉" : "Let's get you set up"}</b>
                <small>{doneN === checklist.length ? "Every step done · your Health view is complete" : doneN + " of " + checklist.length + " done · " + (checklist.length - doneN) + (checklist.length - doneN === 1 ? " quick step" : " quick steps") + " left"}</small>
                <span className="bar"><i style={{ width: Math.round((doneN / checklist.length) * 100) + "%" }} /></span>
              </span>
              <span className="chev"><IcJN name={listOpen ? "chevron-up" : "chevron-down"} size={18} color="var(--brand-navy)" /></span>
            </button>
            {listOpen && checklist.map((c) => (
              <button key={c.k} className={"jh-item" + (c.done ? " done" : "")} onClick={c.on}>
                <span className={"art c-" + c.art}><IcJN name={c.ic} size={20} /></span>
                <span className="tx"><b>{c.t}</b><small>{c.done ? "Done" : c.sub}</small></span>
                <span className="radio">{c.done ? <IcJN name="check" size={13} color="#fff" /> : <IcJN name="chevron-right" size={14} color="var(--gray-400)" />}</span>
              </button>))}
          </div>

          {tracking ? (
            <React.Fragment>
              <div className="jh-sec"><h3 className="jn-h">This week</h3><span>Last 7 days</span></div>
              <div className="jn-metric">
                <div className="head"><span className="ic" style={{ background: "#ede9ff" }}><IcJN name="moon" size={18} color="#6c63ff" /></span><div><b>Sleep</b><small>Average {fmtH(avg(HEALTH.sleep))} · goal 7h 30m</small></div><span className="delta up">+12%</span></div>
                <Bars data={HEALTH.sleep} color="#6c63ff" max={9} fmt={fmtH} />
              </div>
              <div className="jn-metric">
                <div className="head"><span className="ic" style={{ background: "#dcfce7" }}><IcJN name="footprints" size={18} color="#16a34a" /></span><div><b>Movement</b><small>Average {Math.round(avg(HEALTH.steps)).toLocaleString()} steps · goal 8,000</small></div><span className="delta">−3%</span></div>
                <Bars data={HEALTH.steps} color="#16a34a" max={11000} fmt={(v) => v.toLocaleString()} unit=" steps" />
              </div>
              <div className="jn-metric">
                <div className="head"><span className="ic" style={{ background: "var(--brand-gold-100)" }}><IcJN name="sun" size={18} color="var(--brand-gold)" /></span><div><b>Skin check-in</b><small>Today {logs.skin || HEALTH.skin[6]} · from your daily rating</small></div><span className="delta up">+16</span></div>
                <Line data={HEALTH.skin} color="#CE9957" />
                <div className="jn-days">{DAYS.map((d, i) => <span key={i}>{d}</span>)}</div>
              </div>
              <button className="jn-coachcta" onClick={() => goJN("JaneCoach.html?q=" + encodeURIComponent("How can I improve my hydration this week?"))}><IcJN name="sparkles" size={18} color="var(--ai-purple)" /><span>Ask Ava how to lift your hydration score</span><IcJN name="chevron-right" size={18} color="var(--ai-purple)" /></button>
            </React.Fragment>
          ) : (
            <div className="jh-empty"><IcJN name="trending-up" size={26} color="var(--gray-400)" /><b>Your trends will appear here</b><small>Connect a wearable or turn on phone tracking and this view fills with your sleep, movement and skin trends.</small></div>)}
          <div className="jn-end">Not medical advice · talk to your clinician about any concerns</div>
        </section>
      </div>
      <JNTabs active="health" compact={chrome.hidden} />
      {chrome.layers}

      <JNSheet open={sheet === "log"} onClose={() => setSheet(null)} title="Log">
        <div className="jh-logrow"><span className="ic mint"><IcJN name="glass-water" size={20} /></span><span className="tx"><b>Water</b><small>{logs.water} glasses · {(logs.water * 250).toLocaleString()} ml today</small></span><button className="jn-btn sm" onClick={() => { saveLogs({ ...logs, water: logs.water + 1 }); showToast("Glass of water logged"); }}><IcJN name="plus" size={15} />Glass</button></div>
        <div className="jh-logrow"><span className="ic mint"><IcJN name="apple" size={20} /></span><span className="tx"><b>Food</b><small>{logs.food} meals logged today</small></span><button className="jn-btn sm" onClick={() => { saveLogs({ ...logs, food: logs.food + 1 }); showToast("Meal logged"); }}><IcJN name="plus" size={15} />Meal</button></div>
        <div className="jh-logrow"><span className="ic grey"><IcJN name="scale" size={20} /></span><span className="tx"><b>Weight</b><small>Today's reading</small></span><span className="jh-wt"><input inputMode="decimal" value={weightDraft} onChange={(e) => setWeightDraft(e.target.value)} placeholder="54" /><em>kg</em></span><button className="jn-btn sm" onClick={() => { saveLogs({ ...logs, weight: weightDraft }); showToast("Weight saved"); }}>Save</button></div>
        <div className="jh-logrow col"><div className="row"><span className="ic gold"><IcJN name="sun" size={20} /></span><span className="tx"><b>Skin check-in</b><small>How does your skin feel today?</small></span></div>
          <div className="jh-skin">{[["😣", 40], ["😕", 55], ["🙂", 70], ["😊", 85], ["🤩", 100]].map(([e, v]) => <button key={v} className={logs.skin === v ? "on" : ""} onClick={() => { saveLogs({ ...logs, skin: v }); showToast("Skin check-in saved · " + v); }}>{e}</button>)}</div></div>
        <button className="jn-btn block ghost" onClick={() => setSheet(null)}>Done</button>
      </JNSheet>

      <JNSheet open={sheet === "start"} onClose={() => setSheet(null)} title="Start an activity">
        <div className="jh-kinds">{[["Walk", "footprints"], ["Run", "activity"], ["Yoga", "flower"], ["Strength", "dumbbell"], ["Cycle", "bike"], ["Swim", "waves"]].map(([k, ic]) => (
          <button key={k} onClick={() => { setWorkout({ kind: k, start: Date.now() }); setElapsed(0); setSheet(null); showToast(k + " started"); }}><span className="ic"><IcJN name={ic} size={22} /></span>{k}</button>))}</div>
      </JNSheet>

      <JNSheet open={sheet === "edit"} onClose={() => setSheet(null)} title="Customise your tiles">
        <p className="jn-sheet-p">Choose what shows on your Today view.</p>
        {Object.values(tiles).map((t) => (
          <button key={t.k} className="jn-perm" onClick={() => { const h = { ...hidden, [t.k]: !hidden[t.k] }; setHidden(h); saveJN(TILES_KEY, h); }}><IcJN name={t.ic} size={18} color="var(--brand-navy)" /><span>{t.t}</span><span className={"jn-switch" + (!hidden[t.k] ? " on" : "")}><i /></span></button>))}
        <button className="jn-btn block" onClick={() => setSheet(null)}>Done</button>
      </JNSheet>

      <JNSheet open={sheet === "cycle"} onClose={() => setSheet(null)} title="Cycle health tracking">
        <p className="jn-sheet-p">Track your cycle so your clinician can time treatments around it. Only you and your clinic can see this.</p>
        <label className="jn-field"><span>First day of your last period</span><input className="jn-in" type="date" value={cycleDraft.last} onChange={(e) => setCycleDraft({ ...cycleDraft, last: e.target.value })} /></label>
        <label className="jn-field"><span>Average cycle length (days)</span><input className="jn-in" inputMode="numeric" value={cycleDraft.len} onChange={(e) => setCycleDraft({ ...cycleDraft, len: e.target.value })} /></label>
        <button className="jn-btn block" onClick={() => { const c = { last: cycleDraft.last, len: +cycleDraft.len || 28 }; setCycle(c); saveJN(CYCLE_KEY, c); setSheet(null); showToast("Cycle tracking set up"); }}>Save</button>
        {cycle && <button className="jn-btn block danger" onClick={() => { setCycle(null); saveJN(CYCLE_KEY, null); setSheet(null); }}>Stop tracking</button>}
      </JNSheet>

      <JNSheet open={sheet === "friends"} onClose={() => setSheet(null)} title="Add friends">
        <p className="jn-sheet-p">Other patients at {JANE.clinic}. Friends can cheer each other on — your health data stays private.</p>
        <div className="jn-card list">
          {OTHER_JANES.map((id) => { const p = PEOPLE[id]; const on = friends.includes(id); return (
            <div key={id} className="jn-li"><JNFace p={p} size={40} /><span className="tx"><b>{p.name}</b><small>{p.title}</small></span><button className={"jn-btn sm" + (on ? " going" : "")} onClick={() => toggleFriend(id)}>{on ? <React.Fragment><IcJN name="check" size={15} />Added</React.Fragment> : "Add"}</button></div>); })}
        </div>
        <button className="jn-btn block ghost" onClick={() => setSheet(null)}>Done</button>
      </JNSheet>
      <JNToast toast={toast} />
    </div>);
}
function cycleDay(c) { const d = Math.floor((Date.now() - new Date(c.last + "T00:00:00").getTime()) / 86400000); return ((d % (c.len || 28)) + (c.len || 28)) % (c.len || 28) + 1; }
function cyclePhase(c) { const d = cycleDay(c), len = c.len || 28; return d <= 5 ? "Menstrual" : d <= Math.round(len / 2) ? "Follicular" : d <= Math.round(len / 2) + 2 ? "Ovulation" : "Luteal"; }

/* =======================================================================
   COACH — chat or voice, styled after the clinician Ava sheet (coach.css:
   purple gradient head, sparkle avatar, white coach bubbles, quick-action
   tiles, purple composer) + chat HISTORY (user, 2026-10-26): every
   conversation is kept in pf-jane-coach {convs:[{id,title,msgs,ts}],cur}.
   ======================================================================= */
const COACH_KEY = "pf-jane-coach";
const COACH = { name: "Ava", sub: "Reviewed by " + KATY.name };
/* Dr Tim doctor Lottie (assets/lottie/drtim-doctor.json, same cut as DailyGoal/Katy celebrations) for the Your chats header
   avatar (user 2026-10-29 "replace the icon to DRTIM animation in Katy version"). lottie-web is loaded on demand. */
const DRTIM_LOTTIE_JN = "assets/lottie/drtim-doctor.json?v=20261014b";
const LOTTIE_LIB_JN = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
let lottieLibJN = null;
function ensureLottieJN() {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (lottieLibJN) return lottieLibJN;
  lottieLibJN = new Promise((res, rej) => { const el = document.createElement("script"); el.src = LOTTIE_LIB_JN; el.async = true; el.onload = () => res(window.lottie); el.onerror = () => { lottieLibJN = null; rej(new Error("lottie failed")); }; document.head.appendChild(el); });
  return lottieLibJN;
}
function DrTimJN({ size = 48 }) {
  const host = useRefJN(null); const [ok, setOk] = useStateJN(false);
  useEffectJN(() => { let anim, dead = false;
    ensureLottieJN().then((L) => { if (dead || !host.current) return; anim = L.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: true, path: DRTIM_LOTTIE_JN }); anim.addEventListener("DOMLoaded", () => { if (!dead) setOk(true); }); }).catch(() => {});
    return () => { dead = true; if (anim) anim.destroy(); }; }, []);
  return <span className={"jn-drtim" + (ok ? " on" : "")} style={{ width: size, height: size }}><span className="lot" ref={host} /><IcJN name="sparkles" size={Math.round(size * 0.54)} color="var(--ai-purple)" /></span>;
}
const COACH_PROMPTS = [
  { t: "Prep me for my review on Monday", ic: "calendar-check" }, { t: "Aftercare for lip filler", ic: "heart-pulse" },
  { t: "Build me a simple skincare routine", ic: "sparkles" }, { t: "Help me sleep better", ic: "moon" },
  { t: "What does my skin score mean?", ic: "sun" }, { t: "How can I drink more water?", ic: "droplets" }];
function coachReply(q) {
  const s = q.toLowerCase();
  if (/appoint|review|monday|consult|prep/.test(s)) return "Your review with Katy is Tue 3 Nov at 2:30pm. Three things to bring:\n\n1. Any photos of the swelling from days 2–5\n2. The question you asked in the feed about lip hydration\n3. Your Health Pass QR (Profile → Show)\n\nWant me to add a reminder the night before?";
  if (/aftercare|filler|swell|bruis|lip/.test(s)) return "Lip filler aftercare, week 1 onwards:\n\n• Ice 10 minutes on, 10 off for the first 48h\n• No straws, hot drinks or intense exercise for 24h\n• A plain balm only — skip menthol or 'plumping' products\n• Sleep slightly propped up\n\nSwelling peaks at day 2–3 and settles by week 2. Anything hot, hard or very painful — message Katy straight away.";
  if (/routine|skin care|skincare|cleans|spf|serum/.test(s)) return "A routine you'll actually keep:\n\nAM — gentle cleanser → vitamin C or hyaluronic serum → moisturiser → SPF 50\nPM — cleanse (double if you wore SPF/makeup) → retinol 2–3 nights a week → moisturiser\n\nYou've logged SPF 5 of 7 days this week — that's the one that moves your skin score most.";
  if (/sleep|tired|energy|bed/.test(s)) return "You averaged 7h 12m this week — your best nights (Fri–Sat) had no screens after 10pm and a caffeine cut-off at 2pm. Let's make those the default:\n\n• Phone on charge outside the bedroom\n• Last coffee 2pm\n• Same wake time, even weekends\n\nI'll check your sleep trend again on Sunday.";
  if (/hydrat|water|drink/.test(s)) return "Your water intake drops on low-step days — 1.4 L on Wednesday vs 2.2 L on Thursday. Easiest fix: a 750 ml bottle finished by lunch and again by 5pm. I can nudge you at 11am and 3pm if you'd like.";
  if (/score|mean|78/.test(s)) return "Your skin score (78 today) comes from your daily selfie rating plus hydration, sleep and SPF habits. Anything over 70 means your routine is working. The biggest swing factors for you have been SPF days and sleep over 7 hours.";
  return "Noted. Based on your Health Pass, the single most useful thing this week is consistency — SPF daily and 7+ hours of sleep. Would you like a short plan, or shall I pass this to Katy before your review?";
}
function coachWelcome() { return { by: "coach", text: "Hi " + JANE.first + " 👋 I'm Ava, your wellness coach. I can help with aftercare, routines, sleep and getting ready for appointments. Ask me anything, or tap a quick action below.", ts: Date.now() }; }
function newConvJN() { return { id: "c" + Date.now().toString(36), title: "New chat", msgs: [coachWelcome()], ts: Date.now() }; }
const COACH_HISTORY_SEED = [
  { id: "c-seed1", title: "Swelling after lip filler", ts: Date.now() - 3 * 86400000, msgs: [{ by: "coach", text: coachWelcome().text, ts: Date.now() - 3 * 86400000 }, { by: "jane", text: "Is swelling on day 3 normal after lip filler?", ts: Date.now() - 3 * 86400000 + 60000 }, { by: "coach", text: coachReply("swelling lip filler"), ts: Date.now() - 3 * 86400000 + 62000 }] },
  { id: "c-seed2", title: "Skincare routine for winter", ts: Date.now() - 9 * 86400000, msgs: [{ by: "coach", text: coachWelcome().text, ts: Date.now() - 9 * 86400000 }, { by: "jane", text: "Can you build me a simple skincare routine for winter?", ts: Date.now() - 9 * 86400000 + 50000 }, { by: "coach", text: coachReply("skincare routine"), ts: Date.now() - 9 * 86400000 + 53000 }] },
];
function loadCoach() {
  const s = readJN(COACH_KEY, null);
  if (s && s.convs) return { ...s, convs: s.convs.map((c) => ({ ...c, msgs: c.msgs.map((m) => m.by === "coach" && m.text && m.text.indexOf("I'm your wellness coach") >= 0 ? { ...m, text: m.text.replace("I'm your wellness coach", "I'm Ava, your wellness coach") } : m) })) };
  const legacy = s && s.msgs && s.msgs.length > 1 ? [{ id: "c-legacy", title: coachTitle(s.msgs), msgs: s.msgs, ts: s.msgs[s.msgs.length - 1].ts || Date.now() }] : [];
  const cur = newConvJN();
  return { convs: [cur, ...legacy, ...COACH_HISTORY_SEED], cur: cur.id };
}
function coachTitle(msgs) { const m = msgs.find((x) => x.by === "jane"); return m ? (m.text.length > 42 ? m.text.slice(0, 40).replace(/\s+\S*$/, "") + "…" : m.text) : "New chat"; }
function fmtClockJN(ts) { const d = new Date(ts); return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0"); }
function fmtWhenJN(ts) { const d = new Date(ts), n = new Date(); if (d.toDateString() === n.toDateString()) return "Today · " + fmtClockJN(ts); const diff = Math.round((n - d) / 86400000); if (diff === 1) return "Yesterday"; if (diff < 7) return WD[d.getDay()]; return d.getDate() + " " + MONTHS[d.getMonth()]; }

function CoachScreen() {
  const [store, setStore] = useStateJN(loadCoach);
  const conv = store.convs.find((c) => c.id === store.cur) || store.convs[0];
  const [mode, setMode] = useStateJN(qJN("mode") === "voice" ? "voice" : "chat");
  const [draft, setDraft] = useStateJN("");
  const [typing, setTyping] = useStateJN(false);
  /* History first (user, 2026-10-26): the page opens on the list of past
     chats; a chat opens from there, back returns to the list. Deep links
     (?q=, ?mode=voice) go straight into the chat. */
  const [view, setView] = useStateJN(() => (qJN("q") || qJN("mode") === "voice") ? "chat" : "history");
  const [ctxOpen, setCtxOpen] = useStateJN(false);
  const [voice, setVoice] = useStateJN("idle");
  const [heard, setHeard] = useStateJN("");
  const [said, setSaid] = useStateJN("");
  const [muted, setMuted] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const scrollRef = useRefJN(null);
  const { hidden: chromeHidden } = useHeaderHideJN(scrollRef);
  const asked = useRefJN(false);
  const hs = healthSetup();

  function persist(s) { setStore(s); saveJN(COACH_KEY, s); }
  function updateConv(id, fn) { persist({ ...store, convs: store.convs.map((c) => c.id === id ? fn(c) : c) }); }
  function append(msg, cid) { const id = cid || conv.id; const s2 = { ...store, convs: store.convs.map((c) => c.id === id ? { ...c, msgs: [...c.msgs, msg], ts: Date.now(), title: c.title === "New chat" && msg.by === "jane" ? coachTitle([msg]) : c.title } : c) }; persist(s2); return s2; }
  function send(text) {
    const t = (text || draft).trim(); if (!t || typing) return;
    const live = readJN(COACH_KEY, store); const id = live.cur || conv.id;
    const s2 = { ...live, convs: live.convs.map((c) => c.id === id ? { ...c, msgs: [...c.msgs, { by: "jane", text: t, ts: Date.now() }], ts: Date.now(), title: c.title === "New chat" ? coachTitle([{ by: "jane", text: t }]) : c.title } : c) }; persist(s2); setDraft(""); setTyping(true);
    setTimeout(() => { setStore((cur) => { const s3 = { ...cur, convs: cur.convs.map((c) => c.id === id ? { ...c, msgs: [...c.msgs, { by: "coach", text: coachReply(t), ts: Date.now() }], ts: Date.now() } : c) }; saveJN(COACH_KEY, s3); return s3; }); setTyping(false); }, 1100 + Math.random() * 600);
  }
  const toHistory = () => { const kept = store.convs.filter((c) => c.msgs.length > 1); if (kept.length !== store.convs.length) persist({ convs: kept.length ? kept : store.convs.slice(0, 1), cur: (kept[0] || store.convs[0]).id }); setView("history"); setMode("chat"); };
  function newChat() { const c = newConvJN(); persist({ convs: [c, ...store.convs.filter((x) => !(x.msgs.length <= 1 && x.id !== c.id))], cur: c.id }); setView("chat"); setMode("chat"); }
  function openConv(id) { persist({ ...store, cur: id }); setView("chat"); setMode("chat"); }
  const [menuFor, setMenuFor] = useStateJN(null); const [archOpen, setArchOpen] = useStateJN(false);
  function setArchived(id, on) { const left = store.convs.map((c) => c.id === id ? { ...c, archived: on } : c); const active = left.filter((c) => !c.archived); const next = active.length ? left : [...left, newConvJN()]; persist({ convs: next, cur: store.cur === id && on ? (next.find((c) => !c.archived) || next[0]).id : store.cur }); setMenuFor(null); showToast(on ? "Chat archived" : "Chat restored"); }
  function deleteConv(id) { const left = store.convs.filter((c) => c.id !== id); const next = left.length ? left : [newConvJN()]; persist({ convs: next, cur: store.cur === id ? next[0].id : store.cur }); setMenuFor(null); showToast("Chat deleted"); }
  useEffectJN(() => { const q = qJN("q"); if (q && !asked.current) { asked.current = true; setTimeout(() => send(q), 300); } }, []);
  useEffectJN(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [conv && conv.msgs.length, typing, mode, store.cur]);

  function talk() {
    if (voice !== "idle") { setVoice("idle"); setHeard(""); setSaid(""); return; }
    const samples = ["How should I prepare for my review appointment on Monday?", "What's the aftercare for lip filler this week?", "Can you help me sleep better?"];
    const q = samples[Math.floor(Math.random() * samples.length)];
    setVoice("listening"); setHeard(""); setSaid("");
    let i = 0; const words = q.split(" ");
    const iv = setInterval(() => { i++; setHeard(words.slice(0, i).join(" ")); if (i >= words.length) { clearInterval(iv); setVoice("thinking");
      setTimeout(() => { const r = coachReply(q); setSaid(r); setVoice("speaking"); const id = conv.id; setStore((cur) => { const s3 = { ...cur, convs: cur.convs.map((c) => c.id === id ? { ...c, title: c.title === "New chat" ? coachTitle([{ by: "jane", text: q }]) : c.title, ts: Date.now(), msgs: [...c.msgs, { by: "jane", text: q, ts: Date.now(), voice: true }, { by: "coach", text: r, ts: Date.now(), voice: true }] } : c) }; saveJN(COACH_KEY, s3); return s3; });
        setTimeout(() => setVoice("idle"), 6000); }, 1200); } }, 180);
  }
  const CoachFace = ({ size = 28 }) => <span className="jc-face" style={{ width: size, height: size }}><IcJN name="sparkles" size={Math.round(size * 0.55)} color="#fff" /></span>;
  const lastCoachIdx = conv ? conv.msgs.map((m) => m.by).lastIndexOf("coach") : -1;

  return (
    <div className={"jn-screen jc" + (chromeHidden && mode === "chat" ? " chrome-hidden" : "") + (view === "chat" ? " jc-inchat" : "")} onClick={() => menuFor && setMenuFor(null)}>
      {view === "chat" ? (
      <header className="jc-head chat">
        <button className="jc-hbtn" aria-label="Back to your chats" onClick={toHistory}><IcJN name="chevron-left" size={22} color="var(--brand-navy)" /></button>
        <div className="jc-head-title"><b>{conv ? conv.title : "New chat"}</b><small>{COACH.name} · AI coach · Online</small></div>
        <span className="jc-hmenu">
          <button className={"jc-hbtn" + (menuFor === "head" ? " on" : "")} aria-label="Chat options" aria-expanded={menuFor === "head"} onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === "head" ? null : "head"); }}><IcJN name="more-vertical" size={20} color="var(--brand-navy)" /></button>
          {menuFor === "head" && conv && (
            <div className="jc-dd" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setMenuFor(null); newChat(); }}><IcJN name="square-pen" size={16} />New chat</button>
              <button onClick={() => { setArchived(conv.id, !conv.archived); setView("history"); }}><IcJN name={conv.archived ? "archive-restore" : "archive"} size={16} />{conv.archived ? "Unarchive" : "Archive"}</button>
              <button className="danger" onClick={() => { deleteConv(conv.id); setView("history"); }}><IcJN name="trash-2" size={16} />Delete</button>
            </div>
          )}
        </span>
      </header>) : (
      <header className="jc-head">
        <span className="jc-av tim"><DrTimJN size={48} /><i /></span>
        <div className="jc-head-tx">
          <b>Profinity AI Coach</b>
          <span><i className="jn-online" />Online · {COACH.sub}</span>
        </div>
      </header>)}
      {view === "history" ? (
        <div className="jn-scroll jc-histview" onClick={() => menuFor && setMenuFor(null)}>
          {(() => { const active = store.convs.filter((c) => !c.archived).slice().sort((a, b) => b.ts - a.ts); const archived = store.convs.filter((c) => c.archived).slice().sort((a, b) => b.ts - a.ts);
            const Row = ({ c }) => { const last = c.msgs[c.msgs.length - 1]; const n = c.msgs.filter((m) => m.by === "jane").length; return (
              <div key={c.id} className={"jc-hist-row" + (c.id === store.cur && !c.archived ? " cur" : "") + (c.archived ? " archived" : "")}>
                <button className="main" onClick={() => openConv(c.id)}>
                  <span className="tx"><b>{c.title}</b><small>{last ? last.text.replace(/\n+/g, " ").slice(0, 70) : ""}</small><em>{fmtWhenJN(c.ts)} · {n} {n === 1 ? "question" : "questions"}</em></span>
                </button>
                <button className={"del" + (menuFor === c.id ? " on" : "")} aria-label="Chat options" aria-expanded={menuFor === c.id} onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === c.id ? null : c.id); }}><IcJN name="more-vertical" size={18} color="var(--gray-450)" /></button>
                {menuFor === c.id && (
                  <div className="jc-dd" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setArchived(c.id, !c.archived)}><IcJN name={c.archived ? "archive-restore" : "archive"} size={16} />{c.archived ? "Unarchive" : "Archive"}</button>
                    <button className="danger" onClick={() => deleteConv(c.id)}><IcJN name="trash-2" size={16} />Delete</button>
                  </div>)}
              </div>); };
            return (<React.Fragment>
          <div className="jc-hist-h"><div className="tx"><h2>Your chats</h2><span>{active.length} {active.length === 1 ? "conversation" : "conversations"} · saved to your Health Pass</span></div><button className="jc-newbtn" aria-label="New chat" onClick={newChat}><IcJN name="square-pen" size={19} color="var(--brand-navy)" /></button></div>
          <div className="jc-hist">{active.map((c) => <Row key={c.id} c={c} />)}</div>
          {archived.length > 0 && (
            <div className="jc-arch">
              <button className={"jc-arch-h" + (archOpen ? " open" : "")} onClick={() => setArchOpen(!archOpen)}><IcJN name="archive" size={15} color="var(--text-secondary)" />Archived <em>{archived.length}</em><IcJN name="chevron-down" size={18} color="var(--gray-450)" /></button>
              {archOpen && <div className="jc-hist">{archived.map((c) => <Row key={c.id} c={c} />)}</div>}
            </div>)}
            </React.Fragment>); })()}
          <p className="jc-disc">Not medical advice. Talk to your clinician about any concerns.</p>
        </div>
      ) : null}
      {view === "chat" && <div className="jc-modes"><div className="jn-seg mini">{[["chat", "message-circle", "Chat"], ["voice", "mic", "Voice"]].map(([k, ic, l]) => <button key={k} className={mode === k ? "on" : ""} onClick={() => setMode(k)}><IcJN name={ic} size={16} /><span>{l}</span></button>)}</div></div>}

      {view !== "chat" ? null : mode === "chat" ? (
        <React.Fragment>
          <div className="jn-scroll jn-thread jc-thread" ref={scrollRef}>
            <button className={"jc-ctx" + (ctxOpen ? " open" : "")} onClick={() => setCtxOpen(!ctxOpen)}>
              <span className="ic"><IcJN name="qr-code" size={16} color="var(--ai-purple)" /></span>
              <span className="tx"><b>What Ava knows</b><small>{ctxOpen ? "From your Health Pass — only you and your clinic can see this." : "Lip filler · 1 Oct · Review Tue 3 Nov · Skin score 78"}</small>
                {ctxOpen && <span className="jc-ctx-list"><span><IcJN name="syringe" size={13} />Lip filler · 1 Oct 2026</span><span><IcJN name="calendar" size={13} />Review Tue 3 Nov · 2:30pm</span><span><IcJN name="sun" size={13} />Skin score 78 · SPF 5 of 7 days</span><span><IcJN name="moon" size={13} />Sleep avg 7h 12m</span>{hs.height && <span><IcJN name="user" size={13} />{hs.height} cm · {hs.weight} kg</span>}</span>}
              </span>
              <IcJN name="chevron-down" size={18} color="var(--gray-450)" />
            </button>
            {conv && conv.msgs.map((m, i) => (
              <React.Fragment key={i}>
                <div className={"jn-msg " + (m.by === "jane" ? "me" : "them")}>
                  {m.by !== "jane" && <CoachFace />}
                  <div className="bub">{m.voice && <small className="vc"><IcJN name="mic" size={11} /> voice</small>}{m.text.split("\n").map((l, j) => <p key={j}>{l || " "}</p>)}<time>{fmtClockJN(m.ts)}</time></div>
                </div>
                {m.by === "coach" && i === lastCoachIdx && i > 0 && (
                  <div className="jc-acts"><button onClick={() => showToast("Saved to your notes")}><IcJN name="notebook-pen" size={15} />Save to notes</button><button onClick={() => showToast("Sent to " + KATY.name)}><IcJN name="send" size={15} />Share with Katy</button></div>)}
              </React.Fragment>))}
            {typing && <div className="jn-msg them"><CoachFace /><div className="bub typing"><i /><i /><i /></div></div>}
          </div>
          <div className="jc-foot">
            {conv && conv.msgs.length <= 1 && !typing && (
              <React.Fragment>
                <div className="jc-starts-h"><b>Start with a question</b><small>Pick one and Ava takes it from there</small></div>
                <div className="jc-starts jn-chips wrap">{COACH_PROMPTS.map((p) => <button key={p.t} className="jn-chip" onClick={() => send(p.t)}>{p.t}</button>)}</div>
              </React.Fragment>)}
            <div className="jc-composer">
              <button className="jc-mic" aria-label="Voice" onClick={() => setMode("voice")}><IcJN name="mic" size={18} color="var(--ai-purple)" /></button>
              <input placeholder="Ask Ava anything…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
              <button className="jc-send" aria-label="Send" disabled={!draft.trim()} onClick={() => send()}><IcJN name="arrow-up" size={18} color="#fff" /></button>
            </div>
            <p className="jc-disc">Not medical advice. Talk to your clinician about any concerns.</p>
          </div>
        </React.Fragment>
      ) : (
        <div className="jn-voice jc-voice">
          <div className={"jn-orb " + voice} onClick={talk} role="button" aria-label="Tap to talk">
            <span className="r r1" /><span className="r r2" /><span className="r r3" />
            <span className="core">{voice === "listening" ? <IcJN name="mic" size={38} color="#fff" /> : voice === "speaking" ? <IcJN name="volume-2" size={38} color="#fff" /> : voice === "thinking" ? <IcJN name="sparkles" size={38} color="#fff" /> : <IcJN name="mic" size={38} color="#fff" />}</span>
          </div>
          <b className="jn-voice-state">{voice === "idle" ? "Tap to talk" : voice === "listening" ? "Listening…" : voice === "thinking" ? "Thinking…" : "Speaking"}</b>
          <div className="jn-voice-txt">
            {heard && <p className="you">“{heard}{voice === "listening" ? "…" : "”"}</p>}
            {said && <div className="ans">{said.split("\n").map((l, j) => <p key={j}>{l || " "}</p>)}</div>}
            {!heard && !said && <p className="hint">Ask about aftercare, your routine, sleep or your next appointment. Ava has your Health Pass to hand, and the conversation is saved to your history.</p>}
          </div>
          <div className="jn-voice-ctl">
            <button className={"jn-iconbtn lg" + (muted ? " on" : "")} aria-label="Mute" onClick={() => setMuted(!muted)}><IcJN name={muted ? "mic-off" : "mic"} size={22} color={muted ? "#fff" : "var(--brand-navy)"} /></button>
            <button className="jn-iconbtn lg end" aria-label="End" onClick={() => { setVoice("idle"); setHeard(""); setSaid(""); setMode("chat"); }}><IcJN name="phone-off" size={22} color="#fff" /></button>
            <button className="jn-iconbtn lg" aria-label="Keyboard" onClick={() => setMode("chat")}><IcJN name="message-circle" size={22} color="var(--brand-navy)" /></button>
          </div>
        </div>)}
      {view !== "chat" && <JNTabs active="coach" />}

      <JNToast toast={toast} />
    </div>);
}

/* =======================================================================
   EVENTS
   ======================================================================= */
const EV_KEY = "pf-jane-events";
const EVENTS = [
  { id: "ev1", title: "Skin Boosters Q&A · Live", host: "priya", date: "2026-10-29", time: "7:00pm", dur: 60, where: "Online · Zoom", online: true, img: "assets/course-skin-boosters.jpg", spots: null, desc: "Dr Priya answers your questions on skin boosters: what they do, who they suit, what results to expect and how they differ from filler. Free for all clinic patients." },
  { id: "ev2", title: "Skin Health Open Evening", host: "katy", date: "2026-11-07", time: "6:30pm", dur: 120, where: "Pearce Aesthetics · Manchester", online: false, img: "assets/course-consultation.jpg", spots: 12, desc: "Meet the team, try a skin scan and get a personalised plan. Fizz, small bites and 10% off bookings made on the night." },
  { id: "ev3", title: "SPF & Winter Skin Workshop", host: "beth", date: "2026-11-10", time: "6:00pm", dur: 75, where: "Pearce Aesthetics · Manchester", online: false, img: "assets/course-full-face-rejuvenation.jpg", spots: 8, desc: "Hands-on: how much SPF is enough, layering with makeup, and a winter routine for dry or sensitive skin. Take home a sample kit." },
  { id: "ev4", title: "Aftercare clinic · Ask Katy anything", host: "katy", date: "2026-11-18", time: "7:00pm", dur: 45, where: "Online · Zoom", online: true, img: "assets/course-complications.jpg", spots: null, desc: "A relaxed drop-in for anyone treated in the last month. Swelling, bruising, what's normal and what isn't." },
  { id: "ev5", title: "Patient appreciation brunch", host: "katy", date: "2026-12-06", time: "11:00am", dur: 120, where: "Pearce Aesthetics · Manchester", online: false, img: "assets/event-thumbnail-1.png", spots: 20, desc: "Our thank-you to you. Brunch, a few surprises and first look at the new treatment menu for 2027." },
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function evDate(e) { const d = new Date(e.date + "T12:00:00"); return { d: d.getDate(), m: MONTHS[d.getMonth()], wd: WD[d.getDay()] }; }
function parseTimeJN(t) { const m = /(\d+):(\d+)(am|pm)/.exec(t); return { h: +m[1] % 12 + (m[3] === "pm" ? 12 : 0), min: +m[2] }; }
function icsDownloadJN({ id, title, start, end, where, desc }) {
  const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PROfinity//Jane//EN", "BEGIN:VEVENT", "UID:" + id + "@profinity", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(start), "DTEND:" + f(end), "SUMMARY:" + title, "LOCATION:" + where, "DESCRIPTION:" + desc, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics); a.download = title.replace(/[^a-z0-9]+/gi, "-") + ".ics"; document.body.appendChild(a); a.click(); a.remove();
}
function evIcsJN(e) {
  const p = PEOPLE[e.host]; const t = parseTimeJN(e.time);
  const start = new Date(e.date + "T" + String(t.h).padStart(2, "0") + ":" + String(t.min).padStart(2, "0") + ":00");
  icsDownloadJN({ id: e.id, title: e.title, start, end: new Date(start.getTime() + e.dur * 60000), where: e.where, desc: "Hosted by " + p.name + ". " + e.desc });
}

function EventsScreen() {
  const [rsvp, setRsvp] = useStateJN(() => readJN(EV_KEY, { ev1: true }));
  const [view, setView] = useStateJN("upcoming");
  const [open, setOpen] = useStateJN(() => EVENTS.find((e) => e.id === qJN("event")) || null);
  const [toast, showToast] = useToastJN();
  function toggle(e) { const r = { ...rsvp, [e.id]: !rsvp[e.id] }; setRsvp(r); saveJN(EV_KEY, r); showToast(r[e.id] ? "You're going to " + e.title : "RSVP removed"); }
  const list = view === "mine" ? EVENTS.filter((e) => rsvp[e.id]) : EVENTS;
  /* Editorial card (user 2026-10-29 "make the events nice"): soft-shadow white card on the Coach page's warm
     off-white, gradient scrim under the date badge, meta as chips, host name + title, gold "spots left" pill. */
  const Card = ({ e }) => { const d = evDate(e); const h = PEOPLE[e.host]; const going = !!rsvp[e.id]; return (
    <article className={"jn-ev" + (going ? " is-going" : "")}>
      <button className="jn-ev-img" onClick={() => setOpen(e)}><img src={e.img} alt="" /><span className="date"><b>{d.d}</b><small>{d.m}</small></span>{e.online ? <span className="live"><IcJN name="video" size={12} color="#fff" />Online</span> : <span className="live venue"><IcJN name="map-pin" size={12} color="#fff" />In clinic</span>}{going && <span className="going-tag"><IcJN name="check" size={12} />You're going</span>}</button>
      <div className="jn-ev-body">
        <button className="jn-ev-ttl" onClick={() => setOpen(e)}>{e.title}</button>
        <div className="jn-ev-meta"><span><IcJN name="clock" size={13} color="var(--brand-navy)" />{d.wd} {d.d} {d.m} · {e.time}</span><span><IcJN name="map-pin" size={13} color="var(--brand-navy)" />{e.where}</span></div>
        <div className="jn-ev-foot">
          <span className="host"><JNFace p={h} size={30} /><span className="tx"><b>{h.name}</b><small>{h.title}</small></span></span>
          {e.spots != null && <span className="spots"><IcJN name="users" size={12} />{e.spots - (going ? 1 : 0)} left</span>}
          <button className={"jn-btn sm" + (going ? " going" : "")} onClick={() => toggle(e)}>{going ? <React.Fragment><IcJN name="check" size={15} />Going</React.Fragment> : "RSVP"}</button>
        </div>
      </div>
    </article>); };
  const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let lastMonth = "";

  const { top, layers, scrollRef, cls, padTop, hidden } = useKatyChromeJN();
  return (
    <div className={"jn-screen m-screen jn-evpage" + cls}>
      {top}
      <div className="jn-scroll" ref={scrollRef} style={{ paddingTop: padTop(12) }}>
        <div className="jn-pagehead"><div><h2>Events</h2><p>From your clinic and the PROfinity community</p></div><span className="jn-ev-count"><IcJN name="calendar" size={13} />{EVENTS.filter((e) => rsvp[e.id]).length} going</span></div>
        <div className="jn-seg">{[["upcoming", "Upcoming"], ["mine", "My events"]].map(([k, l]) => <button key={k} className={view === k ? "on" : ""} onClick={() => setView(k)}>{l}{k === "mine" && EVENTS.filter((e) => rsvp[e.id]).length > 0 && <i className="n">{EVENTS.filter((e) => rsvp[e.id]).length}</i>}</button>)}</div>
        {list.length === 0 && <div className="jn-emptybox"><span className="ic"><IcJN name="calendar" size={26} color="var(--brand-navy)" /></span><b>No events yet</b><small>RSVP to an event and it will show up here.</small><button className="jn-btn sm" onClick={() => setView("upcoming")}>Browse upcoming</button></div>}
        {list.map((e) => { const mo = MONTH_FULL[new Date(e.date + "T12:00:00").getMonth()]; const first = mo !== lastMonth; lastMonth = mo; return (
          <React.Fragment key={e.id}>{first && <div className="jn-ev-month">{mo}</div>}<Card e={e} /></React.Fragment>); })}
        <div className="jn-end">All events are free for Pearce Aesthetics patients</div>
      </div>
      <JNTabs active="events" compact={hidden} />
      {layers}

      <JNSheet open={!!open} onClose={() => setOpen(null)} tall>
        {open && (() => { const d = evDate(open); const h = PEOPLE[open.host]; return (
          <div className="jn-evd">
            <img className="hero" src={open.img} alt="" />
            <h3>{open.title}</h3>
            <div className="jn-ev-meta col"><span><IcJN name="calendar" size={15} />{d.wd} {d.d} {d.m} · {open.time} · {open.dur} min</span><span><IcJN name="map-pin" size={15} />{open.where}</span>{open.spots != null && <span><IcJN name="users" size={15} />{open.spots - (rsvp[open.id] ? 1 : 0)} spots left</span>}</div>
            <div className="jn-evd-host"><JNFace p={h} size={40} /><div><b>{h.name}</b><small>{h.title}</small></div><RoleChip p={h} /></div>
            <p>{open.desc}</p>
            <div className="jn-row-btns">
              <button className="jn-btn ghost" onClick={() => { evIcsJN(open); showToast("Added to calendar"); }}><IcJN name="calendar-plus" size={18} />Calendar</button>
              <button className="jn-btn ghost" onClick={() => showToast("Invite link copied")}><IcJN name="share-2" size={18} />Invite</button>
              <button className={"jn-btn" + (rsvp[open.id] ? " going" : "")} onClick={() => toggle(open)}>{rsvp[open.id] ? "Going ✓" : "RSVP"}</button>
            </div>
            {open.online && rsvp[open.id] && <button className="jn-btn block" onClick={() => showToast("The join link opens 15 minutes before the start")}><IcJN name="video" size={18} />Join online</button>}
          </div>); })()}
      </JNSheet>
      <JNToast toast={toast} />
    </div>);
}

/* =======================================================================
   MESSAGES (DM)
   ======================================================================= */
const DM_KEY = "pf-jane-dm";
const DM_SEED = { convs: [
  { id: "katy", unread: 1, msgs: [
    { by: "katy", text: "Hi Jane, how are the lips settling? Any tenderness today?", ts: Date.now() - 26 * 3600000 },
    { by: "jane", text: "Much better! A bit of swelling on the left still.", ts: Date.now() - 25 * 3600000 },
    { by: "katy", text: "Totally normal at day 3. Keep icing 10 mins on / 10 off and no straws 🙂", ts: Date.now() - 25 * 3600000 + 120000 },
    { by: "katy", text: "Also — your 2-week review is booked for Tue 3 Nov, 2:30pm. See you then! 📅", ts: Date.now() - 2 * 3600000 }] },
  { id: "reception", unread: 1, msgs: [{ by: "reception", text: "Reminder: your appointment with Katy Wilson is Tuesday 3 Nov at 2:30pm. Reply C to confirm or call us to reschedule.", ts: Date.now() - 5 * 3600000 }] },
  { id: "miranda", unread: 0, msgs: [{ by: "miranda", text: "Saw your post! Want to go to the SPF workshop together? 🧴", ts: Date.now() - 30 * 3600000 }, { by: "jane", text: "Yes! I'll RSVP now", ts: Date.now() - 29 * 3600000 }] },
  { id: "beth", unread: 0, msgs: [{ by: "beth", text: "Your aftercare sheet from today's treatment 📎 Aftercare-Lips.pdf", ts: Date.now() - 4 * 86400000, file: "Aftercare-Lips.pdf" }, { by: "jane", text: "Thank you Beth!", ts: Date.now() - 4 * 86400000 + 900000 }] },
] };
const DM_REPLIES = { katy: ["Perfect, thanks for letting me know 🙂", "Noted — I'll add that to your file before Monday.", "Good question. Keep doing what you're doing and we'll check it at your review.", "Send me a photo if it changes, otherwise see you Monday!"], reception: ["Thanks Jane, your appointment is confirmed ✅", "Noted — we'll see you then."], miranda: ["Yay! Let's grab a coffee after 😄", "Perfect, see you there!"], beth: ["You're welcome Jane! Shout if anything's unclear.", "Any time 🙂"], priya: ["Thanks Jane — I'll have a look before our call.", "Good question, let's go through it on the call 🙂", "Noted. If anything changes before then, send a photo."] };
function fmtListTimeJN(ts) { const d = new Date(ts), n = new Date(); return d.toDateString() === n.toDateString() ? fmtClockJN(ts) : (n - d < 7 * 86400000 ? WD[d.getDay()] : d.getDate() + " " + MONTHS[d.getMonth()]); }

function MessagesScreen() {
  const [store, setStore] = useStateJN(() => readJN(DM_KEY, DM_SEED));
  const [openId, setOpenId] = useStateJN(qJN("to"));
  const [draft, setDraft] = useStateJN("");
  const [q, setQ] = useStateJN("");
  const [typing, setTyping] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const scrollRef = useRefJN(null);
  const chrome = useKatyChromeJN();
  const conv = store.convs.find((c) => c.id === openId);
  function persist(s) { setStore(s); saveJN(DM_KEY, s); }
  function openConv(id) { persist({ convs: store.convs.map((c) => c.id === id ? { ...c, unread: 0 } : c) }); setOpenId(id); }
  useEffectJN(() => { if (openId) openConv(openId); }, []);
  useEffectJN(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [openId, conv && conv.msgs.length, typing]);
  function send(text) {
    const t = (text || draft).trim(); if (!t || !conv) return;
    const s = { convs: store.convs.map((c) => c.id === conv.id ? { ...c, msgs: [...c.msgs, { by: "jane", text: t, ts: Date.now() }] } : c) }; persist(s); setDraft("");
    const pool = DM_REPLIES[conv.id]; if (!pool) return;
    setTyping(true);
    setTimeout(() => { setTyping(false); persist({ convs: s.convs.map((c) => c.id === conv.id ? { ...c, msgs: [...c.msgs, { by: conv.id, text: pool[Math.floor(Math.random() * pool.length)], ts: Date.now() }] } : c) }); }, 1400 + Math.random() * 800);
  }
  const sorted = store.convs.slice().sort((a, b) => b.msgs[b.msgs.length - 1].ts - a.msgs[a.msgs.length - 1].ts).filter((c) => !q || PEOPLE[c.id].name.toLowerCase().includes(q.toLowerCase()));

  if (conv) { const p = PEOPLE[conv.id]; let lastDay = ""; return (
    <div className="jn-screen">
      <JNBar title={p.name} back={() => setOpenId(null)} trailing={<React.Fragment>{p.role === "Clinician" && <button className="jn-iconbtn sm" aria-label="Schedule a call" onClick={() => goJN("JaneScheduleCall.html?new=1&with=" + conv.id + "&ret=" + encodeURIComponent("JaneMessages.html?to=" + conv.id))}><IcJN name="phone" size={17} color="var(--brand-navy)" /></button>}<JNFace p={p} size={34} /></React.Fragment>} />
      <div className="jn-dm-sub">{p.title}{p.role === "Clinician" && <span><i className="jn-online" />Usually replies within the hour</span>}</div>
      <div className="jn-scroll jn-thread" ref={scrollRef}>
        {conv.msgs.map((m, i) => { const day = new Date(m.ts).toDateString(); const showDay = day !== lastDay; lastDay = day; const me = m.by === "jane"; return (
          <React.Fragment key={i}>
            {showDay && <div className="jn-day">{day === new Date().toDateString() ? "Today" : fmtListTimeJN(m.ts)}</div>}
            <div className={"jn-msg " + (me ? "me" : "them")}>
              {!me && <JNFace p={PEOPLE[m.by]} size={28} />}
              <div className="bub">{m.file ? <span className="file"><IcJN name="paperclip" size={14} />{m.file}</span> : null}<p>{m.file ? m.text.replace(" 📎 " + m.file, "") : m.text}</p><time>{fmtClockJN(m.ts)}</time></div>
            </div>
          </React.Fragment>); })}
        {typing && <div className="jn-msg them"><JNFace p={p} size={28} /><div className="bub typing"><i /><i /><i /></div></div>}
        {conv.id === "reception" && <div className="jn-prompts">{["C — confirm", "Can I reschedule?", "What should I bring?"].map((x) => <button key={x} className="jn-chip" onClick={() => send(x === "C — confirm" ? "C" : x)}>{x}</button>)}</div>}
        {conv.id === "katy" && <div className="jn-prompts"><button className="jn-chip" onClick={() => goJN("JaneScheduleCall.html?new=1&with=katy&ret=" + encodeURIComponent("JaneMessages.html?to=katy"))}><IcJN name="phone" size={13} /> Schedule a call</button>{["Thanks Katy!", "Is this swelling normal?", "Can I send a photo?"].map((x) => <button key={x} className="jn-chip" onClick={() => send(x)}>{x}</button>)}</div>}
      </div>
      <div className="jn-input-row dock">
        <button className="jn-iconbtn sm" aria-label="Attach" onClick={() => showToast("Photo & file sharing coming soon")}><IcJN name="plus" size={20} color="var(--brand-navy)" /></button>
        <input className="jn-in" placeholder={"Message " + (p.first || p.name.split(" ")[0]) + "…"} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <button className="jn-send" aria-label="Send" disabled={!draft.trim()} onClick={() => send()}><IcJN name="send" size={18} color="#fff" /></button>
      </div>
      <JNToast toast={toast} />
    </div>); }

  return (
    <div className={"jn-screen m-screen" + chrome.cls}>
      {chrome.top}
      <div className="jn-scroll" ref={chrome.scrollRef} style={{ paddingTop: chrome.padTop(12) }}>
        <div className="jn-pagehead"><h2>Messages</h2><button className="jn-iconbtn sm" aria-label="New message" onClick={() => showToast("Pick a contact below")}><IcJN name="pencil" size={17} color="var(--brand-navy)" /></button></div>
        <div className="jn-search"><IcJN name="search" size={17} color="var(--gray-450)" /><input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="jn-care"><JNFace p={KATY} size={44} /><div><b>Your care team</b><small>{KATY.name} · Nurse Beth · Reception</small></div><span className="jn-care-btns"><button className="jn-iconbtn sm" aria-label="Schedule a call" onClick={() => goJN("JaneScheduleCall.html?new=1&ret=JaneMessages.html")}><IcJN name="phone" size={17} color="var(--brand-navy)" /></button><button className="jn-btn sm" onClick={() => openConv("katy")}>Message</button></span></div>
        {(() => { const up = upcomingCall(); return up ? (
          <button className="sc-banner" onClick={() => goJN("JaneScheduleCall.html?ret=JaneMessages.html")}>
            <span className="ic"><IcJN name={up.type === "phone" ? "phone" : "video"} size={18} color="#fff" /></span>
            <span className="tx"><b>{callTypeLabel(up)} with {callWho(up).first}</b><small>{callWhen(up)} · {up.reason}</small></span>
            <IcJN name="chevron-right" size={18} color="var(--gray-450)" />
          </button>) : null; })()}
        <div className="jn-card list">
          {sorted.map((c) => { const p = PEOPLE[c.id]; const last = c.msgs[c.msgs.length - 1]; return (
            <button key={c.id} className={"jn-conv" + (c.unread ? " unread" : "")} onClick={() => openConv(c.id)}>
              <JNFace p={p} size={50} />
              <span className="tx"><b>{p.name} {p.role !== "Patient" && <RoleChip p={p} />}</b><small>{last.by === "jane" ? "You: " : ""}{last.text}</small></span>
              <span className="meta"><time>{fmtListTimeJN(last.ts)}</time>{c.unread > 0 && <i>{c.unread}</i>}</span>
            </button>); })}
        </div>
        <div className="jn-end">Messages with your clinic are private and kept with your Health Pass</div>
      </div>
      <JNTabs active="messages" compact={chrome.hidden} />
      {chrome.layers}
      <JNToast toast={toast} />
    </div>);
}

/* =======================================================================
   SCHEDULE A CALL WITH KATY — JaneScheduleCall.html (PF_JN_PAGE="schedule")
   Opens on the "Calls & appointments" schedule (APPOINTMENTS seed +
   booked calls, upcoming/past, appointment sheet, call detail with Move /
   Cancel); + or "Schedule a call" starts the three steps (who and what →
   pick a time → confirm) and the done screen.
   Store pf-jane-calls = { calls: [{ id, type, reason, note, date, time,
   status: booked|cancelled|done, ts }] }. Booking also drops a confirmation
   from Katy into the Messages thread. Entry points: drawer row, Messages
   (care-team phone button, upcoming banner, Katy thread phone icon + chip),
   Profile "Calls with your care team" card, notifications. ?ret= returns
   there, ?new=1 skips the upcoming view, ?type=phone preselects the phone
   call, ?with=katy|beth|priya preselects the clinician (CLINICIANS).
   ======================================================================= */
const CALLS_KEY = "pf-jane-calls";
const CALL_DUR = 15;
const CALL_TYPES = [
  { key: "video", label: "Video call", icon: "video", sub: "Face to face, from your phone" },
  { key: "phone", label: "Phone call", icon: "phone", sub: "Katy calls your number" }];
const CALL_REASONS = ["Aftercare check-in", "Treatment question", "Swelling or bruising", "Before my review", "Something else"];
const CALL_SLOTS = [["Morning", ["9:00am", "9:30am", "10:00am", "10:30am", "11:00am", "11:30am"]], ["Afternoon", ["1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", "4:00pm"]]];
function callsState() { return readJN(CALLS_KEY, { calls: [] }); }
function callStart(c) { const t = parseTimeJN(c.time); return new Date(c.date + "T" + String(t.h).padStart(2, "0") + ":" + String(t.min).padStart(2, "0") + ":00"); }
function upcomingCall() { const now = Date.now(); return callsState().calls.filter((c) => c.status === "booked" && callStart(c).getTime() > now - CALL_DUR * 60000).sort((a, b) => callStart(a) - callStart(b))[0] || null; }
function callTypeLabel(c) { return (CALL_TYPES.find((t) => t.key === c.type) || CALL_TYPES[0]).label; }
/* who Jane can call: her own clinician first, then the rest of the care team.
   days = weekdays the clinician takes calls (0 = Sun). */
const CLINICIANS = [
  { id: "katy", tag: "Your clinician", short: "Registered Nurse", days: [1, 2, 3, 4, 5, 6], seed: 0 },
  { id: "beth", tag: "Aftercare", short: "Aesthetic Nurse", days: [1, 2, 3, 4, 5], seed: 3 },
  { id: "priya", tag: "Tue & Thu", short: "Aesthetic Doctor", days: [2, 4], seed: 5 }];
function clinOf(id) { return CLINICIANS.find((c) => c.id === id) || CLINICIANS[0]; }
function callWho(c) { return PEOPLE[(c && c.with) || "katy"]; }
/* In-clinic appointments booked through reception (read-only here; the
   dates match the "Next review Tue 3 Nov · 2:30pm" copy used across Jane). */
const APPOINTMENTS = [
  { id: "ap0", kind: "appt", with: "katy", title: "Lip filler", date: "2026-10-01", time: "3:00pm", dur: 45, where: "Pearce Aesthetics · Manchester", status: "done", note: "Treatment completed. Aftercare sheet sent by Nurse Beth." },
  { id: "ap1", kind: "appt", with: "katy", title: "2-week review", date: "2026-11-03", time: "2:30pm", dur: 30, where: "Pearce Aesthetics · Manchester", status: "confirmed", note: "Katy checks how the lips have settled. Bring any photos of swelling, and your supplements list." },
  { id: "ap2", kind: "appt", with: "priya", title: "Skin consultation", date: "2026-11-24", time: "11:00am", dur: 45, where: "Pearce Aesthetics · Manchester", status: "confirmed", note: "Skin scan and a personalised plan with Dr Priya. Arrive make-up free if you can." }];
function scheduleItems(calls) {
  const now = Date.now();
  const all = [...APPOINTMENTS, ...calls.map((c) => ({ ...c, kind: "call" }))];
  const isPast = (x) => x.status === "cancelled" || x.status === "done" || callStart(x).getTime() < now - (x.dur || CALL_DUR) * 60000;
  const byTime = (a, b) => callStart(a) - callStart(b);
  return { upcoming: all.filter((x) => !isPast(x)).sort(byTime), past: all.filter(isPast).sort((a, b) => byTime(b, a)) };
}
function callWhen(c) { const d = new Date(c.date + "T12:00:00"); return WD[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()] + " · " + c.time; }
function isoDateJN(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
/* Katy's diary for the next two weeks: Sundays closed, Saturday mornings
   only, and a deterministic scatter of taken slots so the grid feels real. */
function callDays(withId) {
  const cl = clinOf(withId);
  const out = []; const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + 1);
  for (let i = 0; i < 14; i++) { const x = new Date(d.getTime() + i * 86400000); const dow = x.getDay(); out.push({ iso: isoDateJN(x), d: x.getDate(), wd: WD[dow], m: MONTHS[x.getMonth()], dow, off: dow === 0 ? "closed" : cl.days.indexOf(dow) === -1 ? "away" : null }); }
  return out;
}
function slotTaken(iso, time, withId) { const n = +iso.slice(-2) + +iso.slice(5, 7) * 3 + clinOf(withId).seed; const i = CALL_SLOTS[0][1].concat(CALL_SLOTS[1][1]).indexOf(time); return (n * 7 + i * 11) % 5 === 0 || (n + i) % 9 === 4; }
function dmCallNote(text, withId) {
  const id = withId || "katy";
  const s = readJN(DM_KEY, DM_SEED);
  const has = s.convs.some((c) => c.id === id);
  const convs = has ? s.convs : [...s.convs, { id, unread: 0, msgs: [] }];
  saveJN(DM_KEY, { convs: convs.map((c) => c.id === id ? { ...c, unread: (c.unread || 0) + 1, msgs: [...c.msgs, { by: id, text, ts: Date.now() }] } : c) });
}

/* Slide-to-open control: drag the knob to the end (or just tap the track) to fire onDone. */
function SlideJN({ label, onDone, hot }) {
  const ref = useRefJN(null); const [x, setX] = useStateJN(0); const drag = useRefJN(null);
  const maxX = () => { const el = ref.current; return el ? el.clientWidth - 52 : 0; };
  const down = (e) => { drag.current = { sx: e.clientX, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { if (!drag.current) return; const dx = Math.max(0, Math.min(maxX(), e.clientX - drag.current.sx)); if (dx > 4) drag.current.moved = true; setX(dx); };
  const up = (e) => { if (!drag.current) return; const done = x >= maxX() * 0.8 || !drag.current.moved; drag.current = null; if (done) { setX(maxX()); setTimeout(() => { setX(0); onDone(); }, done && x > 0 ? 120 : 0); } else setX(0); };
  return (
    <div className={"sc-slide" + (hot ? " hot" : "")} ref={ref} onClick={() => { if (!drag.current) onDone(); }} role="button" aria-label={label}>
      <span className="sc-slide-l" style={{ opacity: 1 - x / Math.max(1, maxX()) }}>{label}<IcJN name="chevron-right" size={16} /></span>
      <span className="sc-slide-k" style={{ transform: "translateX(" + x + "px)", transition: drag.current ? "none" : "transform .18s ease" }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClick={(e) => e.stopPropagation()}><IcJN name="arrow-right" size={20} color={hot ? "var(--brand-navy)" : "#fff"} /></span>
    </div>);
}

function ScheduleCallScreen() {
  const ret = qJN("ret") || "JaneNewsfeed.html";
  const prof = readJN(PROFILE_KEY, { phone: "+44 7700 900123" });
  const [store, setStore] = useStateJN(callsState);
  const up = useMemoJN(() => { const now = Date.now(); return store.calls.filter((c) => c.status === "booked" && callStart(c).getTime() > now - CALL_DUR * 60000).sort((a, b) => callStart(a) - callStart(b))[0] || null; }, [store]);
  const [view, setView] = useStateJN(() => (qJN("new") === "1" ? "book" : "schedule"));
  const [sel, setSel] = useStateJN(null);
  const [apptOpen, setApptOpen] = useStateJN(null);
  const [filt, setFilt] = useStateJN("all");
  const [pastOpen, setPastOpen] = useStateJN(false);
  const items = useMemoJN(() => scheduleItems(store.calls), [store]);
  const [step, setStep] = useStateJN(0);
  const [editing, setEditing] = useStateJN(null);
  const [draft, setDraft] = useStateJN({ with: CLINICIANS.some((c) => c.id === qJN("with")) ? qJN("with") : "katy", type: qJN("type") === "phone" ? "phone" : "video", reason: null, note: "", date: null, time: null });
  const who = PEOPLE[draft.with];
  const [booked, setBooked] = useStateJN(null);
  const [cancelOpen, setCancelOpen] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const days = useMemoJN(() => callDays(draft.with), [draft.with]);
  const scrollRef = useRefJN(null);
  useEffectJN(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [step, view]);
  function persist(s) { setStore(s); saveJN(CALLS_KEY, s); }
  function startBooking(from) {
    if (from) { setEditing(from.id); setDraft({ with: from.with || "katy", type: from.type, reason: from.reason, note: from.note || "", date: from.date, time: from.time }); setStep(1); }
    else { setEditing(null); setDraft({ with: "katy", type: "video", reason: null, note: "", date: null, time: null }); setStep(0); }
    setView("book");
  }
  function back() {
    if (view === "book" && step > 0) return setStep(step - 1);
    if (view === "book" && qJN("new") !== "1") return setView("schedule");
    if (view === "book" && editing) return setView("schedule");
    if (view === "detail") return setView("schedule");
    goJN(ret);
  }
  function confirm() {
    const call = { id: editing || "call" + Date.now().toString(36), with: draft.with, type: draft.type, reason: draft.reason, note: draft.note.trim(), date: draft.date, time: draft.time, dur: CALL_DUR, status: "booked", ts: Date.now() };
    const others = store.calls.filter((c) => c.id !== call.id);
    persist({ calls: [call, ...others] });
    dmCallNote(editing
      ? "No problem — I've moved your " + callTypeLabel(call).toLowerCase() + " to " + callWhen(call) + ". See you then 🙂"
      : "📅 Your " + callTypeLabel(call).toLowerCase() + " is booked for " + callWhen(call) + ". " + (call.type === "video" ? "I'll send the link here 10 minutes before." : "I'll call you on " + prof.phone + ".") + " Anything you'd like me to look at beforehand, just send it over.", call.with);
    setBooked({ ...call, rescheduled: !!editing }); setEditing(null); setView("done");
  }
  function cancelCall() {
    const target = sel || up;
    persist({ calls: store.calls.map((c) => c.id === target.id ? { ...c, status: "cancelled" } : c) });
    dmCallNote("Got it — I've cancelled your call. Book another whenever you need me 🙂", target.with);
    setCancelOpen(false); showToast("Call cancelled"); setSel(null); setView("schedule");
  }
  function addToCalendar(c) {
    const start = callStart(c);
    if (c.kind === "appt") icsDownloadJN({ id: c.id, title: c.title + " with " + callWho(c).name, start, end: new Date(start.getTime() + c.dur * 60000), where: c.where, desc: c.note });
    else icsDownloadJN({ id: c.id, title: callTypeLabel(c) + " with " + callWho(c).name, start, end: new Date(start.getTime() + CALL_DUR * 60000), where: c.type === "video" ? "Video call · link in PROfinity Messages" : "Phone call · " + prof.phone, desc: c.reason + (c.note ? ". " + c.note : "") + ". Booked through the PROfinity patient app." });
    showToast("Added to calendar");
  }
  const kindOf = (x) => x.kind === "call" ? x.type : "clinic";
  const kindIcon = (x) => x.kind === "call" ? (x.type === "phone" ? "phone" : "video") : "building-2";
  const titleOf = (x) => x.kind === "call" ? callTypeLabel(x) + " with " + callWho(x).first : x.title + " with " + callWho(x).first;
  const openItem = (x, past) => x.kind === "call" ? (past ? null : (setSel(x), setView("detail"))) : setApptOpen(x);
  const relDay = (x) => { const t = new Date(); t.setHours(0, 0, 0, 0); const d = Math.round((new Date(x.date + "T00:00:00") - t) / 86400000); return d === 0 ? "Today" : d === 1 ? "Tomorrow" : d < 7 ? "In " + d + " days" : d < 14 ? "Next week" : "In " + Math.round(d / 7) + " weeks"; };
  const ItemRow = ({ x, past }) => { const w = callWho(x); const d = new Date(x.date + "T12:00:00"); const isCall = x.kind === "call"; return (
    <button className={"sc-item" + (past ? " past" : "") + (x.status === "cancelled" ? " cancelled" : "")} onClick={() => openItem(x, past)}>
      <span className="date"><i>{WD[d.getDay()]}</i><b>{d.getDate()}</b></span>
      <span className="av"><JNFace p={w} size={42} /><i className={"bd " + kindOf(x)}><IcJN name={kindIcon(x)} size={11} color="#fff" /></i></span>
      <span className="tx">
        <b>{titleOf(x)}</b>
        <small>{x.time} · {x.dur || CALL_DUR} min · {isCall ? x.reason : "In clinic"}</small>
      </span>
      <span className={"st " + (x.status || "booked")}>{x.status === "cancelled" ? "Cancelled" : x.status === "done" || past ? "Done" : isCall ? "Booked" : "Confirmed"}</span>
    </button>); };
  const todayIso = isoDateJN(new Date());
  const HeroCard = ({ x }) => { const w = callWho(x); const isCall = x.kind === "call"; const hot = x.date === todayIso; return (
    <section className={"sc-hero" + (hot ? "" : " lite")} role="button" tabIndex={0} onClick={() => openItem(x)} onKeyDown={(e) => { if (e.key === "Enter") openItem(x); }}>
      <span className={"sc-hero-st " + (x.status || "booked")}>{isCall ? "Booked" : "Confirmed"}</span>
      <div className="sc-hero-top">
        <span className="sc-hero-av"><JNFace p={w} size={62} /><i className={"bd " + kindOf(x)}><IcJN name={kindIcon(x)} size={13} color="#fff" /></i></span>
        <div className="tx">
          <span className="lbl"><i /> {hot ? "Today" : relDay(x)}</span>
          <b>{titleOf(x)}</b>
        </div>
      </div>
      <div className="sc-hero-meta">
        <span><IcJN name="calendar" size={14} />{callWhen(x).split(" · ")[0]}</span>
        <span><IcJN name="clock" size={14} />{x.time} · {x.dur || CALL_DUR} min</span>
        <span><IcJN name={isCall ? (x.type === "phone" ? "phone" : "video") : "map-pin"} size={14} />{isCall ? callTypeLabel(x) : "Manchester clinic"}</span>
      </div>
      <div className="sc-hero-acts" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => addToCalendar(x)}><IcJN name="calendar-plus" size={16} />Calendar</button>
        <button onClick={() => goJN("JaneMessages.html?to=" + (isCall ? w.id : "reception"))}><IcJN name="message-circle" size={16} />Message</button>
      </div>
    </section>); };
  const canNext = step === 0 ? !!draft.reason : step === 1 ? !!(draft.date && draft.time) : true;
  const Picker = () => (
    <div className="sc-clins">
      {CLINICIANS.map((cl) => { const p = PEOPLE[cl.id]; const on = draft.with === cl.id; return (
        <button key={cl.id} className={"sc-clin" + (on ? " on" : "")} onClick={() => setDraft({ ...draft, with: cl.id, date: null, time: null })}>
          <span className="av"><JNFace p={p} size={56} />{on && <i><IcJN name="check" size={11} color="#fff" /></i>}</span>
          <b>{p.name}</b><small>{cl.short}</small>
          <em className={cl.id === "katy" ? "mine" : ""}>{cl.tag}</em>
        </button>); })}
    </div>);
  const Summary = ({ c, compact }) => (
    <div className={"jn-summary sc-sum" + (compact ? " compact" : "")}>
      <div className="jn-kv"><span>With</span><b className="who"><JNFace p={callWho(c)} size={22} />{callWho(c).name}</b></div>
      <div className="jn-kv"><span>Call</span><b><IcJN name={c.type === "phone" ? "phone" : "video"} size={14} /> {callTypeLabel(c)} · {CALL_DUR} min</b></div>
      <div className="jn-kv"><span>When</span><b>{callWhen(c)}</b></div>
      <div className="jn-kv"><span>About</span><b>{c.reason}</b></div>
      {c.note && <div className="jn-kv col"><span>Your note</span><b>{c.note}</b></div>}
      {c.type === "phone" && <div className="jn-kv"><span>{callWho(c).first} will call</span><b>{prof.phone}</b></div>}
    </div>);

  /* ---- booked / upcoming -------------------------------------------- */
  if (view === "schedule") {
    const shown = items.upcoming.filter((x) => filt === "all" || (filt === "call" ? x.kind === "call" : x.kind === "appt"));
    const groups = shown.reduce((g, x) => { const d = new Date(x.date + "T12:00:00"); const k = d.toLocaleString("en-GB", { month: "long" }) + " " + d.getFullYear(); (g[k] = g[k] || []).push(x); return g; }, {});
    return (
    <div className="jn-screen sc sc-page">
      <JNBar title="Calls & appointments" back={() => goJN("JaneNewsfeed.html")} trailing={<button className="jn-iconbtn sm" aria-label="Schedule a call" onClick={() => startBooking(null)}><IcJN name="plus" size={20} color="var(--brand-navy)" /></button>} />
      <div className="jn-scroll" ref={scrollRef}>

        <div className="jn-seg sc-seg">{[["all", "All"], ["call", "Calls"], ["appt", "In clinic"]].map(([k, l]) => <button key={k} className={filt === k ? "on" : ""} onClick={() => setFilt(k)}>{l}</button>)}</div>

        {Object.keys(groups).length === 0 && <div className="jn-emptybox sc-empty"><IcJN name="calendar" size={26} color="var(--gray-400)" /><b>Nothing upcoming</b><small>{filt === "call" ? "Schedule a call with your care team." : filt === "appt" ? "Message reception to book a visit." : "Nothing booked yet."}</small></div>}
        {Object.entries(groups).map(([month, list]) => (
          <section key={month} className="sc-group">
            <h4 className="sc-month-h">{month} <em>{list.length}</em></h4>
            <div className="sc-cards">{list.map((x) => <HeroCard key={x.id} x={x} />)}</div>
          </section>))}

        {items.past.length > 0 && (
          <section className="sc-group">
            <button className={"sc-month-h sc-past-h" + (pastOpen ? " open" : "")} onClick={() => setPastOpen(!pastOpen)}>Past <em>{items.past.length}</em><IcJN name="chevron-down" size={18} color="var(--gray-450)" /></button>
            {pastOpen && <div className="jn-card list sc-list">{items.past.map((x) => <ItemRow key={x.id} x={x} past />)}</div>}
          </section>)}

        <div className="sc-info"><IcJN name="info" size={15} color="var(--brand-navy)" /><span>Clinic appointments are booked by reception. To move one, message the clinic or call 0161 000 0000.</span></div>
        <div className="jn-end">Calls are free for {JANE.clinic} patients</div>
      </div>
      <JNTabs active="schedule" />

      <JNSheet open={!!apptOpen} onClose={() => setApptOpen(null)}>
        {apptOpen && (() => { const w = callWho(apptOpen); const isPast = apptOpen.status === "done"; return (
          <div className="sc-apptd">
            <div className="sc-apptd-head"><span className="ic"><IcJN name="building-2" size={22} color="#fff" /></span><div><h3>{apptOpen.title}</h3><small>{callWhen(apptOpen)} · {apptOpen.dur} min</small></div></div>
            <div className="jn-evd-host"><JNFace p={w} size={40} /><div><b>{w.name}</b><small>{w.title}</small></div><RoleChip p={w} /></div>
            <div className="jn-kv"><span>Where</span><b>{apptOpen.where}</b></div>
            <div className="jn-kv"><span>Status</span><b>{isPast ? "Completed" : "Confirmed"}</b></div>
            <p className="jn-sheet-p" style={{ marginTop: 10 }}>{apptOpen.note}</p>
            {!isPast && <div className="jn-row-btns">
              <button className="jn-btn ghost" onClick={() => addToCalendar(apptOpen)}><IcJN name="calendar-plus" size={18} />Calendar</button>
              <button className="jn-btn ghost" onClick={() => showToast("Opening directions…")}><IcJN name="map-pin" size={18} />Directions</button>
              <button className="jn-btn" onClick={() => goJN("JaneMessages.html?to=reception")}><IcJN name="message-circle" size={18} />Reschedule</button>
            </div>}
            {isPast && <button className="jn-btn block ghost" onClick={() => { setApptOpen(null); startBooking(null); }}><IcJN name="phone" size={18} />Book a follow-up call</button>}
          </div>); })()}
      </JNSheet>
      <JNToast toast={toast} />
    </div>); }

  if (view === "detail" && sel) { const up = sel; const uw = callWho(up); return (
    <div className="jn-screen sc">
      <JNBar title={"Your call with " + uw.first} back={() => setView("schedule")} trailing={<JNFace p={uw} size={34} />} />
      <div className="jn-scroll" ref={scrollRef}>
        <section className="sc-upcard">
          <div className="top">
            <span className="ic"><IcJN name={up.type === "phone" ? "phone" : "video"} size={22} color="#fff" /></span>
            <div className="tx"><b>{callTypeLabel(up)} with {uw.first}</b><small>{callWhen(up)}</small></div>
            <span className="st"><IcJN name="check" size={12} color="#fff" />Booked</span>
          </div>
          <div className="jn-kv"><span>About</span><b>{up.reason}</b></div>
          <div className="jn-kv"><span>Length</span><b>{CALL_DUR} minutes</b></div>
          {up.note && <div className="jn-kv col"><span>Your note</span><b>{up.note}</b></div>}
          <div className="sc-join">
            <IcJN name={up.type === "phone" ? "phone-call" : "video"} size={18} color="var(--brand-navy)" />
            <span>{up.type === "phone" ? uw.first + " will call you on " + prof.phone + "." : "Your join link arrives in Messages 10 minutes before the call."}</span>
          </div>
          <div className="jn-row-btns">
            <button className="jn-btn ghost" onClick={() => addToCalendar(up)}><IcJN name="calendar-plus" size={18} />Calendar</button>
            <button className="jn-btn ghost" onClick={() => goJN("JaneMessages.html?to=" + uw.id)}><IcJN name="message-circle" size={18} />Message</button>
            <button className="jn-btn ghost" onClick={() => startBooking(up)}><IcJN name="refresh-cw" size={18} />Move</button>
          </div>
          <button className="sc-cancel" onClick={() => setCancelOpen(true)}><IcJN name="x" size={15} />Cancel this call</button>
        </section>

        <div className="sc-tips">
          <h4>Before the call</h4>
          <div className="jn-li"><span className="ic"><IcJN name="camera" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>Good light helps</b><small>Sit facing a window so {uw.first} can see the treated area clearly.</small></span></div>
          <div className="jn-li"><span className="ic"><IcJN name="clipboard-list" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>Jot down your questions</b><small>Fifteen minutes goes quickly — have them ready.</small></span></div>
          <div className="jn-li"><span className="ic"><IcJN name="shield-check" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>Your Health Pass is shared</b><small>{uw.first} can see your history and aftercare notes during the call.</small></span></div>
        </div>

        <div className="jn-end">Calls are free for {JANE.clinic} patients · for anything urgent call the clinic</div>
      </div>

      <JNSheet open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel this call?">
        <p className="jn-sheet-p">{uw.first} will be let know. You can book another call any time — the slot goes back to other patients.</p>
        <div className="jn-row-btns"><button className="jn-btn ghost" onClick={() => setCancelOpen(false)}>Keep call</button><button className="jn-btn danger" onClick={cancelCall}>Cancel call</button></div>
      </JNSheet>
      <JNToast toast={toast} />
    </div>); }

  /* ---- done ---------------------------------------------------------- */
  if (view === "done" && booked) { const bw = callWho(booked); return (
    <div className="jn-screen sc">
      <JNBar title="Call booked" back={() => goJN(ret)} trailing={<JNFace p={bw} size={34} />} />
      <div className="jn-scroll" ref={scrollRef}>
        <div className="jn-onb-done sc-done">
          <span className="ok"><IcJN name="check" size={44} color="#fff" /></span>
          <h2>{booked.rescheduled ? "Call moved" : "You're booked in"}</h2>
          <p>{bw.first} will {booked.type === "phone" ? "call you" : "see you"} on <b>{callWhen(booked)}</b>. We'll remind you 10 minutes before{booked.type === "video" ? " and drop the link in Messages" : ""}.</p>
          <Summary c={booked} compact />
          <div className="jn-row-btns">
            <button className="jn-btn ghost" onClick={() => addToCalendar(booked)}><IcJN name="calendar-plus" size={18} />Add to calendar</button>
            <button className="jn-btn ghost" onClick={() => goJN("JaneMessages.html?to=" + bw.id)}><IcJN name="message-circle" size={18} />Message {bw.first}</button>
          </div>
          <button className="jn-btn block" onClick={() => { setBooked(null); setView("schedule"); }}>See all calls & appointments</button>
          <button className="sc-cancel" style={{ color: "var(--text-secondary)" }} onClick={() => goJN(ret)}>Done</button>
        </div>
      </div>
      <JNToast toast={toast} />
    </div>); }

  /* ---- booking steps ------------------------------------------------- */
  const selDay = days.find((d) => d.iso === draft.date);
  return (
    <div className="jn-screen sc jn-onb">
      <JNBar title={editing ? "Move your call" : "Schedule a call"} back={back} trailing={<JNFace p={who} size={34} />} />
      <div className="jn-onb-prog"><div className="bar"><i style={{ width: ((step + 1) / 3) * 100 + "%" }} /></div><span>Step {step + 1} of 3</span></div>
      <div className="jn-scroll" ref={scrollRef}>
        {step === 0 && (
          <React.Fragment>
            <span className="jn-onb-step">Step 1 · Who and what</span>
            <h2 className="jn-onb-q">Who would you like to talk to?</h2>
            <p className="jn-onb-sub">A free {CALL_DUR}-minute call with your care team. Pick a clinician, how you'd like to talk and what it's about.</p>
            <Picker />
            <h4 className="sc-h4">How</h4>
            <div className="sc-types">
              {CALL_TYPES.map((t) => (
                <button key={t.key} className={"sc-type" + (draft.type === t.key ? " on" : "")} onClick={() => setDraft({ ...draft, type: t.key })}>
                  <span className="ic"><IcJN name={t.icon} size={22} color={draft.type === t.key ? "#fff" : "var(--brand-navy)"} /></span>
                  <b>{t.label}</b><small>{t.key === "phone" ? who.first + " calls your number" : t.sub}</small>
                  <span className="tick">{draft.type === t.key && <IcJN name="check" size={13} color="#fff" />}</span>
                </button>))}
            </div>
            <h4 className="sc-h4">Reason</h4>
            <div className="jn-prompts sc-reasons">{CALL_REASONS.map((r) => <button key={r} className={"jn-chip" + (draft.reason === r ? " on" : "")} onClick={() => setDraft({ ...draft, reason: r })}>{r}</button>)}</div>
            <h4 className="sc-h4">Anything {who.first} should know first? <em>optional</em></h4>
            <textarea className="jn-in sc-note" rows={3} placeholder="e.g. Left side still a little swollen since Tuesday…" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
            <div className="sc-info"><IcJN name="info" size={15} color="var(--brand-navy)" /><span>Calls are for questions and check-ins. If something feels urgent, phone the clinic on 0161 000 0000.</span></div>
          </React.Fragment>)}

        {step === 1 && (
          <React.Fragment>
            <span className="jn-onb-step">Step 2 · Pick a time</span>
            <h2 className="jn-onb-q">When suits you?</h2>
            <p className="jn-onb-sub">{who.first}'s next two weeks{clinOf(draft.with).days.length < 5 ? " · takes calls on " + clinOf(draft.with).tag : ""}. Times are UK time.</p>
            <div className="sc-month">{selDay ? selDay.m + " " + new Date(selDay.iso + "T12:00:00").getFullYear() : days[0].m + (days[0].m !== days[13].m ? " – " + days[13].m : "")}</div>
            <div className="sc-days">
              {days.map((d) => { const off = !!d.off; return (
                <button key={d.iso} className={"sc-day" + (draft.date === d.iso ? " on" : "") + (off ? " off" : "")} disabled={off} onClick={() => setDraft({ ...draft, date: d.iso, time: null })}>
                  <small>{d.wd}</small><b>{d.d}</b>{off ? <i>{d.off}</i> : <i>{d.m}</i>}
                </button>); })}
            </div>
            {!draft.date && <div className="jn-emptybox sc-empty"><IcJN name="calendar" size={26} color="var(--gray-400)" /><b>Pick a day</b><small>Then choose one of {who.first}'s free slots.</small></div>}
            {draft.date && CALL_SLOTS.filter(([g]) => !(selDay.dow === 6 && g === "Afternoon")).map(([g, slots]) => (
              <div key={g} className="sc-group">
                <h4 className="sc-h4">{g}</h4>
                <div className="sc-slots">
                  {slots.map((t) => { const taken = slotTaken(draft.date, t, draft.with); return (
                    <button key={t} className={"sc-slot" + (draft.time === t ? " on" : "") + (taken ? " taken" : "")} disabled={taken} onClick={() => setDraft({ ...draft, time: t })}>{t}</button>); })}
                </div>
              </div>))}
            {draft.date && selDay.dow === 6 && <div className="sc-info"><IcJN name="info" size={15} color="var(--brand-navy)" /><span>Saturdays are mornings only.</span></div>}
          </React.Fragment>)}

        {step === 2 && (
          <React.Fragment>
            <span className="jn-onb-step">Step 3 · Confirm</span>
            <h2 className="jn-onb-q">Does this look right?</h2>
            <p className="jn-onb-sub">{who.first} will get a note straight away and you'll both get a reminder 10 minutes before.</p>
            <Summary c={draft} />
            {draft.type === "phone" && <button className="jn-link-row sc-phone" onClick={() => goJN("JaneProfile.html?edit=1")}><IcJN name="pencil" size={15} />Wrong number? Update it on your profile<IcJN name="chevron-right" size={16} /></button>}
            <div className="sc-tips sc-how">
              <h4>How it works</h4>
              <div className="jn-li"><span className="ic"><IcJN name="bell" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>Reminder 10 minutes before</b><small>By notification and in Messages.</small></span></div>
              <div className="jn-li"><span className="ic"><IcJN name={draft.type === "phone" ? "phone-call" : "video"} size={16} color="var(--brand-navy)" /></span><span className="tx"><b>{draft.type === "phone" ? who.first + " calls you" : "Tap the link to join"}</b><small>{draft.type === "phone" ? "From the clinic number, so save it in your contacts." : "No app to install — it opens right here."}</small></span></div>
              <div className="jn-li"><span className="ic"><IcJN name="shield-check" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>Health Pass shared for the call</b><small>So {who.first} has your history and aftercare notes to hand.</small></span></div>
            </div>
          </React.Fragment>)}
      </div>
      <div className="jn-onb-foot">
        <button className="jn-btn block" disabled={!canNext} onClick={() => step < 2 ? setStep(step + 1) : confirm()}>
          {step === 2 ? <React.Fragment><IcJN name="calendar-check" size={18} />{editing ? "Confirm new time" : "Book call"}</React.Fragment> : "Continue"}
        </button>
      </div>
      <JNToast toast={toast} />
    </div>);
}


/* =======================================================================
   CREATE POST — twin of Katy's CreatePostMobile (create-post-mobile.css
   cp-* classes, same top bar / author row / text area / hashtag rail /
   "Add to your post" tools / background styles / destination sheet).
   Posts land in pf-jane-posts and the feed reopens on top.
   ======================================================================= */
const JN_TAGS = [
  { slug: "progress", label: "Progress" }, { slug: "question", label: "Question" }, { slug: "aftercare", label: "Aftercare" },
  { slug: "skincare", label: "Skincare" }, { slug: "appointment", label: "Appointment" }, { slug: "tips", label: "Tips" },
  { slug: "sleep", label: "Sleep" }, { slug: "wins", label: "Wins" }];
const JN_TAG_MAP = JN_TAGS.reduce((m, t) => { m[t.slug] = t; return m; }, {});
const JN_BACKGROUNDS = [
  { id: "none", label: "No background", css: "", fg: "var(--text-primary)" },
  { id: "navy", label: "Navy", css: "linear-gradient(150deg,#292569,#3d3688)", fg: "#fff" },
  { id: "gold", label: "Gold", css: "linear-gradient(150deg,#ce9957,#a26301)", fg: "#fff" },
  { id: "purple", label: "Purple", css: "linear-gradient(150deg,#6c63ff,#4022a8)", fg: "#fff" },
  { id: "teal", label: "Teal", css: "linear-gradient(150deg,#25515c,#173840)", fg: "#fff" },
  { id: "cream", label: "Cream", css: "linear-gradient(150deg,#fcf4e4,#f3e3c8)", fg: "var(--brand-navy)" },
  { id: "navygold", label: "Navy to gold", css: "linear-gradient(150deg,#292569 40%,#ce9957)", fg: "#fff" },
  { id: "sunrise", label: "Sunrise", css: "linear-gradient(150deg,#e58f0c,#be1e2d)", fg: "#fff" },
  { id: "mint", label: "Mint", css: "linear-gradient(150deg,#2a9568,#186b4a)", fg: "#fff" },
  { id: "slate", label: "Slate", css: "linear-gradient(150deg,#475467,#1f2937)", fg: "#fff" },
  { id: "blush", label: "Blush", css: "linear-gradient(150deg,#f7d6de,#e9afbe)", fg: "var(--brand-navy)" },
  { id: "ink", label: "Ink", css: "#101828", fg: "#fff" }];
const JN_DESTS = [
  { k: "feed", label: "Clinic feed", sub: "Your clinic team and other patients", icon: "rss" },
  { k: "patients", label: "Patients only", sub: "Other patients at " + JANE.clinic, icon: "users" },
  { k: "katy", label: "Just my clinician", sub: "A private note to " + KATY.name, icon: "lock" }];
const JN_ATTACH = [
  { k: "photo", icon: "image", label: "Photo", color: "#2d9d5a" }, { k: "video", icon: "video", label: "Video", color: "#e56c1b" },
  { k: "tag", icon: "at-sign", label: "Tag people", color: "#1d7fc4" }, { k: "loc", icon: "map-pin", label: "Location", color: "#d03b3b" },
  { k: "feel", icon: "smile", label: "Feeling", color: "#d4a017" }];
const JN_FEELINGS = ["😊 happy", "🤩 excited", "😌 relaxed", "😬 nervous", "🥱 tired", "💪 motivated", "🙏 grateful", "😣 sore"];
const JN_MEDIA_SOURCES = {
  photo: { title: "Add photos", rows: [{ k: "library", icon: "images", label: "Photo library", sub: "Choose up to 5 photos" }, { k: "camera", icon: "camera", label: "Take a photo", sub: "Open the camera now" }] },
  video: { title: "Add a video", rows: [{ k: "library", icon: "film", label: "Video library", sub: "Choose a clip from your gallery" }, { k: "camera", icon: "video", label: "Record a video", sub: "Capture one right now" }] } };
function jnReadImage(file, max = 1280) {
  return new Promise((resolve) => { const url = URL.createObjectURL(file); const img = new Image(); img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); resolve(c.toDataURL("image/jpeg", 0.82)); }; img.onerror = () => resolve(null); img.src = url; });
}
function CPSheetJN({ title, onClose, children, done }) {
  useEffectJN(() => { const onKey = (e) => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, []);
  return (
    <div className="cp-sheet-overlay" onClick={onClose}>
      <div className="cp-sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <span className="cp-sheet-grip" aria-hidden="true"></span>
        {done ? <div className="cp-sheet-hd"><h3>{title}</h3><button className="cp-sheet-done" aria-label="Done" onClick={onClose}><IcJN name="check" size={22} color="var(--brand-navy)" /></button></div> : <h3>{title}</h3>}
        {children}
      </div>
    </div>);
}
function CreatePostScreen() {
  const [text, setText] = useStateJN("");
  const [dest, setDest] = useStateJN("feed");
  const [bgId, setBgId] = useStateJN("none");
  const [tags, setTags] = useStateJN([]);
  const [images, setImages] = useStateJN([]);
  const [video, setVideo] = useStateJN(null);
  const [loc, setLoc] = useStateJN(null);
  const [feeling, setFeeling] = useStateJN(null);
  const [sheet, setSheet] = useStateJN(null); // bg | dest | photo | video | loc | feel
  const [toast, showToast] = useToastJN();
  const fileRef = useRefJN(null); const fileCfg = useRefJN({});
  const taRef = useRefJN(null);
  const bg = JN_BACKGROUNDS.find((b) => b.id === bgId) || JN_BACKGROUNDS[0];
  const canPost = text.trim().length > 0 || images.length > 0 || !!video;
  const backTo = qJN("ret") || "JaneNewsfeed.html";
  useEffectJN(() => { if (taRef.current) taRef.current.focus(); }, []);
  function pickSource(kind, src) {
    setSheet(null); fileCfg.current = { kind, src };
    const input = fileRef.current; if (!input) return;
    input.accept = kind === "photo" ? "image/*" : "video/*"; input.multiple = kind === "photo";
    if (src === "camera") input.setAttribute("capture", "environment"); else input.removeAttribute("capture");
    input.value = ""; input.click();
  }
  async function onFiles(e) {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    if (fileCfg.current.kind === "video") { const f = files[0]; setVideo({ src: URL.createObjectURL(f), name: f.name }); setBgId("none"); return; }
    const room = Math.max(0, 5 - images.length); const out = [];
    for (const f of files.slice(0, room)) { const d = await jnReadImage(f); if (d) out.push(d); }
    if (out.length) { setImages((p) => [...p, ...out]); setBgId("none"); }
    if (files.length > room) showToast("Photo limit is 5");
  }
  function insertMention() { const t = text.replace(/\s*$/, ""); setText((t ? t + " " : "") + "@Katy Wilson "); if (taRef.current) taRef.current.focus(); }
  function post() {
    const posts = loadPosts();
    const p = { id: "p" + Date.now(), by: "jane", t: "Just now", text: text.trim() + (feeling ? "\n— feeling " + feeling : "") + (loc ? "\n📍 " + loc : ""), likes: 0, shares: 0, liked: false, reaction: null, comments: [], tags, dest };
    if (images.length) p.imgs = images; if (video) p.video = { name: video.name }; if (bg.css) p.bg = { css: bg.css, fg: bg.fg };
    try { saveJN(POSTS_KEY, [p, ...posts]); } catch (e) { p.imgs = images.slice(0, 1); try { saveJN(POSTS_KEY, [p, ...posts]); } catch (e2) { delete p.imgs; saveJN(POSTS_KEY, [p, ...posts]); } }
    goJN(dest === "katy" ? "JaneMessages.html?to=katy" : "JaneNewsfeed.html?posted=1");
  }
  const d = JN_DESTS.find((x) => x.k === dest);
  return (
    <div className="cp-screen jn-cp" data-screen-label="Create Post (Jane)">
      <header className="cp-top">
        <button className="cp-cancel" onClick={() => goJN(backTo)}>Cancel</button>
        <span className="cp-title">Create Post</span>
        <button className="cp-post-btn" disabled={!canPost} onClick={post}>{dest === "katy" ? "Send" : "Post"}</button>
      </header>
      <div className="cp-scroll">
        <div className="cp-author">
          <DSJN.Avatar name={JANE.name} src={JANE.avatar} size={46} />
          <div className="cp-author-meta">
            <div className="cp-author-name-row"><span className="cp-author-name">{JANE.name}</span></div>
            <button type="button" className="cp-channel-btn" onClick={() => setSheet("dest")} aria-haspopup="dialog">
              <IcJN name={d.icon} size={14} color="var(--gray-500)" />
              <span className={dest === "feed" ? "cp-channel-feed" : "cp-channel-chip"}>{dest === "feed" ? "Post to Clinic feed" : d.label}</span>
              <IcJN name="chevron-down" size={14} color="var(--gray-500)" />
            </button>
          </div>
        </div>
        <div className={"cp-compose" + (bg.css ? " cp-compose-bg" : "")} style={bg.css ? { background: bg.css } : undefined}>
          <textarea ref={taRef} className={"cp-textarea" + (bg.css ? " on-bg" : "")} placeholder={dest === "katy" ? "Write a private note to Katy…" : "What's on your mind?"} value={text} style={bg.css ? { color: bg.fg } : undefined} onChange={(e) => setText(e.target.value)} />
          {bg.css && <button className="cp-bg-fab" aria-label="Change background style" onClick={() => setSheet("bg")}><span className="cp-bg-aa">Aa</span></button>}
        </div>
        {(feeling || loc) && <div className="jn-cp-meta">{feeling && <span className="jn-cp-chip" onClick={() => setFeeling(null)}>feeling {feeling}<IcJN name="x" size={12} /></span>}{loc && <span className="jn-cp-chip" onClick={() => setLoc(null)}><IcJN name="map-pin" size={12} />{loc}<IcJN name="x" size={12} /></span>}</div>}
        {video && (
          <div className="cp-video-wrap"><video src={video.src} className="cp-video-cover" muted playsInline preload="metadata" /><button className="cp-video-rm" aria-label="Remove video" onClick={() => setVideo(null)}><IcJN name="x" size={14} color="var(--white)" /></button></div>)}
        {images.length > 0 && (
          <div className={"cp-images cp-images-" + images.length + (video ? " cp-images-with-video" : "")}>
            {images.map((src, i) => <div key={i} className="cp-img-wrap"><img src={src} alt="" className="cp-img" /><button className="cp-img-rm" aria-label="Remove" onClick={() => setImages((p) => p.filter((_, j) => j !== i))}><IcJN name="x" size={14} color="var(--white)" /></button></div>)}
          </div>)}
        {(images.length > 0 || video) && <p className="cp-media-count"><IcJN name="paperclip" size={12} color="var(--gray-500)" />{[video ? "1 video" : null, images.length ? images.length + (images.length === 1 ? " photo" : " photos") : null].filter(Boolean).join(" · ")}{images.length < 5 ? " · add up to " + (5 - images.length) + " more photo" + (5 - images.length === 1 ? "" : "s") : " · photo limit reached"}</p>}
        <div className="cp-tags">
          <span className="cp-attach-label">Add hashtags</span>
          <div className="pf-tagbar">{JN_TAGS.map((t) => <button key={t.slug} type="button" className={"pf-tagchip" + (tags.includes(t.slug) ? " on" : "")} onClick={() => setTags((p) => p.includes(t.slug) ? p.filter((x) => x !== t.slug) : [...p, t.slug])}>#{t.label}</button>)}</div>
        </div>
      </div>
      <div className="cp-attach-bar">
        <span className="cp-attach-label">Add to your post</span>
        <div className="cp-attach-row">
          {JN_ATTACH.map((a) => (
            <button key={a.k} className="cp-attach-btn" aria-label={a.label}
              disabled={(a.k === "photo" && (!!bg.css || images.length >= 5)) || (a.k === "video" && (!!bg.css || !!video))}
              onClick={a.k === "photo" ? () => setSheet("photo") : a.k === "video" ? () => setSheet("video") : a.k === "tag" ? insertMention : a.k === "loc" ? () => setSheet("loc") : () => setSheet("feel")}>
              <IcJN name={a.icon} size={24} color={a.color} />
            </button>))}
          <button className="cp-attach-btn" aria-label="Background" disabled={images.length > 0 || !!video} onClick={() => setSheet("bg")}><span className="cp-bg-aa lg">Aa</span></button>
        </div>
      </div>
      <input ref={fileRef} type="file" hidden onChange={onFiles} />

      {sheet === "bg" && (
        <CPSheetJN title="Background" done onClose={() => setSheet(null)}>
          <div className="cp-swatches" role="radiogroup" aria-label="Background style">
            {JN_BACKGROUNDS.map((b) => (
              <button key={b.id} role="radio" aria-checked={b.id === bgId} aria-label={b.label} className={"cp-swatch" + (b.id === bgId ? " on" : "") + (b.id === "none" ? " none" : "")} style={b.css ? { background: b.css } : undefined} onClick={() => { setBgId(b.id); if (b.css) { setImages([]); setVideo(null); } }}>
                {b.id === "none" && <IcJN name="ban" size={20} color="var(--gray-450)" />}
                {b.id === bgId && b.id !== "none" && <span className="cp-swatch-ck"><IcJN name="check" size={15} color="var(--brand-navy)" /></span>}
              </button>))}
          </div>
        </CPSheetJN>)}
      {sheet === "dest" && (
        <CPSheetJN title="Post to" onClose={() => setSheet(null)}>
          <div className="cp-sheet-list" role="radiogroup" aria-label="Destination">
            {JN_DESTS.map((x) => (
              <button key={x.k} type="button" role="radio" aria-checked={dest === x.k} className={"cp-opt" + (dest === x.k ? " on" : "")} onClick={() => { setDest(x.k); setSheet(null); }}>
                <span className="cp-opt-ic"><IcJN name={x.icon} size={20} color="var(--brand-navy)" /></span>
                <span className="cp-opt-tx"><b>{x.label}</b><i>{x.sub}</i></span>
                <span className="cp-opt-rd">{dest === x.k && <IcJN name="check" size={14} color="#fff" />}</span>
              </button>))}
          </div>
        </CPSheetJN>)}
      {(sheet === "photo" || sheet === "video") && (
        <CPSheetJN title={JN_MEDIA_SOURCES[sheet].title} onClose={() => setSheet(null)}>
          <div className="cp-sheet-list">
            {JN_MEDIA_SOURCES[sheet].rows.map((r) => (
              <button key={r.k} type="button" className="cp-opt" onClick={() => pickSource(sheet, r.k)}>
                <span className="cp-opt-ic"><IcJN name={r.icon} size={20} color="var(--brand-navy)" /></span>
                <span className="cp-opt-tx"><b>{r.label}</b><i>{r.sub}</i></span>
                <IcJN name="chevron-right" size={18} color="var(--gray-400)" />
              </button>))}
          </div>
        </CPSheetJN>)}
      {sheet === "loc" && (
        <CPSheetJN title="Add a location" onClose={() => setSheet(null)}>
          <div className="cp-sheet-list">
            {[["Pearce Aesthetics, Manchester", "building-2"], ["Home", "home"], ["Manchester, UK", "map-pin"], ["Use my current location", "navigation"]].map(([l, ic]) => (
              <button key={l} type="button" className={"cp-opt" + (loc === l ? " on" : "")} onClick={() => { setLoc(l === "Use my current location" ? "Manchester, UK" : l); setSheet(null); }}>
                <span className="cp-opt-ic"><IcJN name={ic} size={20} color="var(--brand-navy)" /></span>
                <span className="cp-opt-tx"><b>{l}</b></span>
                <span className="cp-opt-rd">{loc === l && <IcJN name="check" size={14} color="#fff" />}</span>
              </button>))}
          </div>
        </CPSheetJN>)}
      {sheet === "feel" && (
        <CPSheetJN title="How are you feeling?" onClose={() => setSheet(null)}>
          <div className="jn-cp-feel">{JN_FEELINGS.map((f) => <button key={f} className={feeling === f ? "on" : ""} onClick={() => { setFeeling(f); setSheet(null); }}>{f}</button>)}</div>
        </CPSheetJN>)}
      <JNToast toast={toast} />
    </div>);
}

/* =======================================================================
   mount
   ======================================================================= */
const JN_SCREENS = { schedule: ScheduleCallScreen, create: CreatePostScreen, home: HomeScreen, profile: ProfileScreen, onboarding: OnboardingScreen, wearables: WearablesScreen, health: HealthScreen, coach: CoachScreen, events: EventsScreen, messages: MessagesScreen };
function JaneApp() {
  const Screen = JN_SCREENS[JN_PAGE] || HomeScreen;
  const mobile = useIsMobileJN();
  const scale = useDeviceScaleJN();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><Screen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: "scale(" + scale + ")", transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><Screen /></IOSDevice>
      </div>
    </div>);
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(<JaneApp />);
