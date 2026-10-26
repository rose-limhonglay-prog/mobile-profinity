/* ===========================================================================
   PROfinity — Jane (patient) app · iPhone 17 Pro Max
   The second mobile link (profinity-mobile-2.vercel.app) is the PATIENT side
   of PROfinity: "Jane" is the patient persona, "Katie/Katy" the clinician
   (same split as the Flutter app's user_type 'jane' | 'katy'). One bundle
   serves eight shells, picked by window.PF_JN_PAGE:
     home · profile · onboarding · wearables · health · coach · events · messages
   Everything persists in localStorage under pf-jane-*. Suffixed -JN.
   =========================================================================== */
const { useState: useStateJN, useEffect: useEffectJN, useRef: useRefJN, useMemo: useMemoJN } = React;
const DSJN = window.ProfinityDesignSystem_c2b5cc;
const JN_PAGE = window.PF_JN_PAGE || "home";

function goJN(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function qJN(k) { try { return new URLSearchParams(window.location.search).get(k); } catch (e) { return null; } }
function readJN(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }
function saveJN(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
const IcJN = ({ name, size = 20, color = "currentColor", style }) => <DSJN.IconifyIcon name={"lucide:" + name} size={size} color={color} style={style} />;

/* ---- people ------------------------------------------------------------ */
const JANE = { id: "jane", name: "Jane Taylor", first: "Jane", avatar: "assets/avatar-sarah-collins.jpg", role: "Patient", clinic: "Pearce Aesthetics", passId: "HP-2048-JT", dob: "14 Mar 1991", since: "Jun 2026" };
const KATY = { id: "katy", name: "Katy Wilson", avatar: "assets/avatar-katy.jpg", role: "Clinician", title: "Registered Nurse · Pearce Aesthetics" };
const PEOPLE = {
  katy: KATY,
  beth: { id: "beth", name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg", role: "Clinician", title: "Aesthetic Nurse" },
  priya: { id: "priya", name: "Dr Priya Shah", avatar: "assets/avatar-priya-shah.jpg", role: "Clinician", title: "Aesthetic Doctor" },
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

function JNTabs({ active }) {
  return (
    <nav className="jn-tabs" aria-label="Primary">
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
  { id: "p1", by: "katy", t: "2h", text: "Winter skin reminder 🧴 Cold air + central heating = dehydrated skin. Double-cleanse at night, layer a hyaluronic serum under your moisturiser, and yes — SPF still counts in December. The UVA that ages skin comes straight through cloud, so the habit matters more than the forecast.", likes: 48, shares: 6, liked: false, comments: [{ by: "miranda", text: "Guilty of skipping SPF when it's grey out 🙈", likes: 4, t: "1h" }, { by: "katy", text: "The UVA doesn't care about the clouds Miranda 😄", likes: 9, t: "50m" }] },
  { id: "p2", by: "miranda", t: "4h", text: "6 weeks post lip filler and I've finally stopped overthinking it. Katy was right about the swelling timeline 😅 Any tips for keeping lips hydrated through winter?", img: "assets/clinic-lip-design.png", likes: 21, shares: 2, liked: true, comments: [{ by: "beth", text: "A plain balm (no menthol or 'plumping' ingredients) and a big glass of water before bed. Simple wins.", likes: 7, t: "3h" }, { by: "amir", text: "They look so natural!", likes: 2, t: "2h" }] },
  { id: "p3", by: "beth", t: "Yesterday", text: "Aftercare 101 after anti-wrinkle treatment: no lying flat for 4 hours, skip the gym today, no facials or massage for 2 weeks, and don't rub the area. Save this post 📌", likes: 73, shares: 14, liked: false, comments: [] },
  { id: "p4", by: "amir", t: "Yesterday", text: "Just booked my first consultation 🙈 nervous but excited. What should I ask? Anything you wish you'd known before your first one?", likes: 12, shares: 1, liked: false, comments: [{ by: "mark", text: "Ask about the downtime for YOUR job — mine was more than I expected.", likes: 3, t: "20h" }, { by: "katy", text: "Bring a list of medications and any allergies, and photos of looks you like AND don't like. See you Thursday Amir!", likes: 11, t: "18h" }] },
  { id: "p5", by: "priya", t: "2d", text: "Patient Q&A live this Thursday 7pm — bring your questions about skin boosters, what they do and who they suit. Free for all clinic patients.", event: "ev1", likes: 35, shares: 9, liked: false, comments: [] },
  { id: "p6", by: "mark", t: "3d", text: "Week 3 of the sleep + hydration plan from the coach. Energy is noticeably better and my skin check-in score has gone from 61 to 72. Small habits, big difference.", img: "assets/course-skin-boosters.jpg", likes: 29, shares: 3, liked: false, comments: [{ by: "katy", text: "This is exactly it Mark 👏", likes: 5, t: "2d" }] },
];
const PINNED_IDS = ["p3", "p5"];
const PUSH_JN = { app: "Pearce Aesthetics", icon: "assets/profinity-icon-purple-gold.png", title: "Appointment reminder", body: "Your 2-week review with Katy Wilson is Monday 3 Nov at 2:30pm. Tap to confirm or reschedule.", cta: "Confirm" };
const NOTIFS_JN = [
  { by: "katy", text: "replied to your comment on her winter skin post", t: "50m", icon: "message-square" },
  { by: "reception", text: "Appointment confirmed · Mon 3 Nov, 2:30pm", t: "2h", icon: "calendar" },
  { by: "miranda", text: "liked your post", t: "4h", icon: "heart" },
  { by: "priya", text: "is hosting Skin Boosters Q&A · Live on Thursday", t: "1d", icon: "video" },
  { by: "beth", text: "sent you an aftercare sheet", t: "4d", icon: "paperclip" },
];
function loadPosts() { const s = readJN(POSTS_KEY, null); return s && s[0] && "shares" in s[0] ? s : POSTS_SEED; }
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

/* Drawer (burger) and notifications panel — slide-in layers like the
   clinician SideMenu / NotificationsPanel, scoped to Jane's pages. */
function JNDrawer({ open, onClose }) {
  const onb = onbState();
  const rows = [
    ["user", "My profile", "JaneProfile.html"], ["qr-code", "Health Pass", "JaneProfile.html"], ["clipboard-list", onb.done ? "Onboarding · completed" : "Finish onboarding", "JaneOnboarding.html"],
    ["watch", "Connect your wearables", "JaneWearables.html"], ["heart-pulse", "Health Analytics", "JaneHealth.html"], ["sparkles", "Coach", "JaneCoach.html"],
    ["calendar", "Events", "JaneEvents.html"], ["message-circle", "Messages", "JaneMessages.html"]];
  return (
    <div className={"jn-layer" + (open ? " open" : "")} aria-hidden={!open}>
      <button type="button" className="jn-scrim" aria-label="Close menu" onClick={onClose} />
      <aside className="jn-drawer">
        <div className="jn-drawer-head"><JNFace p={JANE} size={56} /><div><b>{JANE.name}</b><small>Patient · {JANE.clinic}</small></div></div>
        <div className="jn-drawer-pass" onClick={() => goJN("JaneProfile.html")}><span className="lbl">Health Pass</span><b>{JANE.passId}</b><span className={"st" + (onb.done ? " ok" : "")}>{onb.done ? "Active" : "Incomplete"}</span></div>
        <nav className="jn-drawer-nav">
          {rows.map(([ic, l, href]) => <button key={l} onClick={() => goJN(href)}><IcJN name={ic} size={19} color="var(--brand-navy)" /><span>{l}</span><IcJN name="chevron-right" size={16} color="var(--gray-400)" /></button>)}
        </nav>
        <button className="jn-drawer-out" onClick={onClose}><IcJN name="log-out" size={18} color="var(--error)" />Log out</button>
      </aside>
    </div>);
}
function JNNotifPanel({ open, onClose }) {
  return (
    <div className={"jn-layer right" + (open ? " open" : "")} aria-hidden={!open}>
      <button type="button" className="jn-scrim" aria-label="Close notifications" onClick={onClose} />
      <aside className="jn-panel">
        <header className="jn-panel-head"><h2>Notifications</h2><button className="m-iconbtn" aria-label="Close" onClick={onClose}><IcJN name="x" size={20} color="var(--brand-navy)" /></button></header>
        <div className="jn-panel-list">
          {NOTIFS_JN.map((n, i) => { const p = PEOPLE[n.by]; return (
            <button key={i} className="jn-notif" onClick={() => goJN(n.icon === "calendar" ? "JaneMessages.html?to=reception" : n.icon === "video" ? "JaneEvents.html?event=ev1" : n.icon === "paperclip" ? "JaneMessages.html?to=beth" : "JaneNewsfeed.html")}>
              <span className="av"><JNFace p={p} size={44} /><i><IcJN name={n.icon} size={11} color="#fff" /></i></span>
              <span className="tx"><b>{p.name}</b> {n.text}<small>{n.t}</small></span>
            </button>); })}
        </div>
      </aside>
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
  const lastTap = useRefJN(0); const [heart, setHeart] = useStateJN(null); const seq = useRefJN(0);
  const onTap = (e) => { const now = Date.now(); if (now - lastTap.current < 300) { lastTap.current = 0; const key = ++seq.current; setHeart({ x: e.clientX, y: e.clientY, key }); setTimeout(() => setHeart((h) => h && h.key === key ? null : h), 700); onLove(); return; } lastTap.current = now; };
  const heartNode = heart ? ReactDOM.createPortal(<span key={heart.key} className="sm-double-heart" style={{ left: heart.x, top: heart.y }}><DSJN.IconifyIcon name="fluent:heart-16-filled" size={96} color="var(--reaction-love)" /></span>, document.body) : null;
  return { onTap, heartNode };
}

function FeedPostJN({ p, pinned, onLike, onReact, onComment, onShare, onSave, saved, showToast }) {
  const a = authorJN(p.by);
  const first = p.comments[0];
  const ref = useRefJN(null);
  const reaction = p.reaction || (p.liked ? "like" : null);
  const { picker, pick, cancelHide, scheduleHide } = useReactionPickerJN(ref, reaction, (key) => onReact(p, key));
  const { onTap, heartNode } = useDoubleTapLoveJN(() => { if (reaction !== "love") { onReact(p, "love"); burstFromJN(likeButtonJN(ref.current), "love"); } });
  const handleLike = () => { const willReact = !reaction; onLike(p); if (willReact) burstFromJN(likeButtonJN(ref.current), "like"); };
  const handleComment = () => { const g = actionIconJN(ref.current, 1); if (g && g.animate) g.animate([{ transform: "rotate(0)" }, { transform: "rotate(-17deg)" }, { transform: "rotate(13deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(0)" }], { duration: 520, easing: "ease-in-out" }); onComment(p); };
  const handleShare = () => { const g = actionIconJN(ref.current, 2); if (g && g.animate) g.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: "translate(8px,-10px) scale(1.28)", opacity: 0.35, offset: 0.5 }, { transform: "translate(-3px,2px) scale(1)", opacity: 1, offset: 0.78 }, { transform: "translate(0,0) scale(1)", opacity: 1 }], { duration: 560, easing: "cubic-bezier(.34,1.56,.64,1)" }); onShare(p); };
  const media = p.img ? (
    <div className="pf-media-bleed" style={{ margin: "0 -16px" }} onClick={onTap}><img src={p.img} alt="" draggable={false} style={{ width: "100%", height: 380, objectFit: "cover", display: "block", background: "var(--gray-100)", userSelect: "none" }} /></div>
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
        time={pinned ? <React.Fragment>{p.t}<span className="pf-pin-chip"><DSJN.IconifyIcon name="fluent:pin-12-filled" size={11} color="var(--brand-navy)" />Pinned</span></React.Fragment> : p.t}
        body={<ClampTextJN text={p.text} />}
        media={media}
        hashtags={[]}
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
  useEffectJN(() => { if (qJN("search") === "1") showToast("Search coming soon"); }, []);
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
  const postProps = { onLike: like, onReact: react, onComment: (p) => setCommentId(p.id), onShare: () => showToast("Link copied"), onSave: save, showToast };

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
              <FeedPostJN p={p} saved={!!saved[p.id]} {...postProps} />
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
      <button className={"m-fab" + (chromeHidden ? " m-fab-compact" : "")} aria-label="Share a Post" onClick={() => setComposeOpen(true)}><IcJN name="plus" size={24} color="#fff" /></button>
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
   PROFILE / HEALTH PASS
   ======================================================================= */
const PROFILE_KEY = "pf-jane-profile";
const SUPPLEMENTS = [{ n: "Vitamin D3", d: "2000 IU", f: "Daily, morning" }, { n: "Omega-3", d: "1000 mg", f: "Daily with food" }, { n: "Collagen peptides", d: "10 g", f: "Most days" }];
const GOALS = [{ t: "Sleep", target: "7h 30m a night", p: 0.82 }, { t: "Hydration", target: "2 L a day", p: 0.6 }, { t: "SPF every day", target: "7 of 7 days", p: 0.71 }];

function QRMark() {
  const cells = useMemoJN(() => { let s = 7; const out = []; for (let i = 0; i < 121; i++) { s = (s * 9301 + 49297) % 233280; out.push(s / 233280 > 0.55); } return out; }, []);
  return <div className="jn-qr" aria-hidden="true">{cells.map((on, i) => <span key={i} className={on ? "on" : ""} />)}</div>;
}

function ProfileScreen() {
  const [prof, setProf] = useStateJN(() => readJN(PROFILE_KEY, { name: JANE.name, phone: "+44 7700 900123", email: "jane.taylor@example.com", dob: JANE.dob }));
  const [edit, setEdit] = useStateJN(qJN("edit") === "1");
  const [passOpen, setPassOpen] = useStateJN(false);
  const [draft, setDraft] = useStateJN(prof);
  const [toast, showToast] = useToastJN();
  const onb = onbState();
  const wear = connectedWearables();
  const medical = onb.answers.medical || ["No known allergies"];
  const goalsChosen = onb.answers.goals || [];

  function save() { setProf(draft); saveJN(PROFILE_KEY, draft); setEdit(false); showToast("Profile updated"); }
  const Row = ({ icon, label, sub, href, onClick, danger }) => (
    <button className={"jn-row" + (danger ? " danger" : "")} onClick={onClick || (() => goJN(href))}>
      <span className="ic"><IcJN name={icon} size={18} color={danger ? "var(--error)" : "var(--brand-navy)"} /></span>
      <span className="tx"><b>{label}</b>{sub && <small>{sub}</small>}</span>
      <IcJN name="chevron-right" size={18} color="var(--gray-450)" />
    </button>);

  return (
    <div className="jn-screen">
      <JNTop title="Profile" />
      <div className="jn-scroll">
        <section className="jn-prof">
          <JNFace p={JANE} size={88} className="big" />
          <h2>{prof.name}</h2>
          <p>Patient at {JANE.clinic} · with {KATY.name}</p>
          <div className="jn-row-btns center">
            <button className="jn-btn sm" onClick={() => { setDraft(prof); setEdit(true); }}><IcJN name="pencil" size={16} />Edit profile</button>
            <button className="jn-btn sm ghost" onClick={() => goJN("JaneMessages.html?to=katy")}><IcJN name="message-circle" size={16} />Message Katy</button>
          </div>
        </section>

        <button className="jn-pass" onClick={() => setPassOpen(true)}>
          <div className="jn-pass-top"><img src="assets/profinity-academy-logo-full.png" alt="PROfinity" /><span className="st">{onb.done ? "Active" : "Incomplete"}</span></div>
          <div className="jn-pass-mid"><span className="lbl">Health Pass</span><b>{prof.name}</b><small>ID {JANE.passId} · DOB {prof.dob}</small></div>
          <div className="jn-pass-bot"><span>{JANE.clinic} · member since {JANE.since}</span><span className="qrbtn"><IcJN name="qr-code" size={16} color="#fff" />Show</span></div>
        </button>
        {!onb.done && <button className="jn-link-row" onClick={() => goJN("JaneOnboarding.html")}><IcJN name="alert-circle" size={16} color="var(--warning)" />Complete the onboarding questionnaire to activate your pass<IcJN name="chevron-right" size={16} /></button>}

        <h3 className="jn-h">Medical history</h3>
        <div className="jn-card">
          <div className="jn-tags">{medical.map((m) => <span key={m} className="jn-tag">{m}</span>)}</div>
          {healthSetup().height && <div className="jn-kv"><span>Height · Weight</span><b>{healthSetup().height} cm · {healthSetup().weight} kg</b></div>}
          <div className="jn-kv"><span>Previous treatments</span><b>{onb.answers.history || "Not answered"}</b></div>
          <div className="jn-kv"><span>Last treatment</span><b>Lip filler · 1 Oct 2026</b></div>
          <div className="jn-kv"><span>Next review</span><b>Mon 3 Nov · 2:30pm</b></div>
        </div>

        <h3 className="jn-h">Supplements</h3>
        <div className="jn-card list">
          {SUPPLEMENTS.map((s) => <div key={s.n} className="jn-li"><span className="ic"><IcJN name="pill" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>{s.n}</b><small>{s.d} · {s.f}</small></span></div>)}
          <button className="jn-li add" onClick={() => showToast("Ask Katy to add a supplement")}><span className="ic"><IcJN name="plus" size={16} color="var(--brand-navy)" /></span><span className="tx"><b>Add supplement</b></span></button>
        </div>

        <h3 className="jn-h">Goals</h3>
        <div className="jn-card list">
          {GOALS.map((g) => <div key={g.t} className="jn-goal"><div className="top"><b>{g.t}</b><span>{g.target}</span></div><div className="bar"><i style={{ width: g.p * 100 + "%" }} /></div></div>)}
          {goalsChosen.length > 0 && <div className="jn-tags pad">{goalsChosen.map((g) => <span key={g} className="jn-tag gold">{g}</span>)}</div>}
        </div>

        <h3 className="jn-h">Wearables & analytics</h3>
        <div className="jn-card list">
          <Row icon="watch" label={wear.length ? wear.map((w) => w.name).join(", ") : "No wearables connected"} sub={wear.length ? "Synced a few minutes ago" : "Connect Apple Health, Oura, Fitbit and more"} href="JaneWearables.html" />
          <Row icon="heart-pulse" label="Health Analytics" sub="Sleep, movement, nutrition and skin trends" href="JaneHealth.html" />
          <Row icon="clipboard-list" label="Onboarding questionnaire" sub={onb.done ? "Completed · tap to review" : "Not finished"} href="JaneOnboarding.html" />
        </div>

        <h3 className="jn-h">More</h3>
        <div className="jn-card list">
          <Row icon="message-circle" label="Messages" href="JaneMessages.html" />
          <Row icon="calendar" label="Events" href="JaneEvents.html" />
          <Row icon="sparkles" label="Coach" href="JaneCoach.html" />
          <Row icon="shield-check" label="Privacy & sharing" sub="Your Health Pass is shared with Pearce Aesthetics only" onClick={() => showToast("Sharing settings coming soon")} />
          <Row icon="log-out" label="Log out" danger onClick={() => showToast("Logged out (demo)")} />
        </div>
        <div className="jn-end">PROfinity · patient app</div>
      </div>
      <JNTabs active="profile" />

      <JNSheet open={edit} onClose={() => setEdit(false)} title="Edit profile">
        {[["name", "Full name"], ["dob", "Date of birth"], ["phone", "Phone"], ["email", "Email"]].map(([k, l]) => (
          <label key={k} className="jn-field"><span>{l}</span><input className="jn-in" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} /></label>))}
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

  return (
    <div className="jn-screen">
      <JNBar title="Connect your wearables" back={() => history.length > 1 ? history.back() : goJN("JaneProfile.html")} />
      <div className="jn-scroll">
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
  const tracking = wear.length > 0 || phone;
  useEffectJN(() => { if (!workout) return; const t = setInterval(() => setElapsed(Math.floor((Date.now() - workout.start) / 1000)), 1000); return () => clearInterval(t); }, [workout]);
  function saveLogs(l) { setLogs(l); saveJN(LOGS_KEY, l); }
  function onRail() { const el = railRef.current; if (!el) return; setPage(Math.round(el.scrollLeft / el.clientWidth)); }
  function goPage(i) { const el = railRef.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" }); }
  const mmss = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

  const ring = tracking ? { pct: 64, sub: "96 of 150 min", plus: "+12" } : { pct: 0, sub: "Calibrating – 7 days left", plus: "+0" };
  const tiles = {
    steps: { k: "steps", ic: "footprints", t: "Steps", v: tracking ? HEALTH.steps[6].toLocaleString() : "0", tone: "mint" },
    readiness: { k: "readiness", ic: "activity", t: "Readiness", v: tracking ? "82 · Good" : "Calibrating", tone: tracking ? "mint" : "grey" },
    sleep: { k: "sleep", ic: "moon", t: "Sleep", v: tracking ? fmtH(HEALTH.sleep[6]) : "No data", tone: "lav" },
    vitals: { k: "vitals", ic: "activity", t: "Vitals", v: tracking ? "RHR 61 bpm" : "No data", tone: tracking ? "mint" : "grey" },
    weight: { k: "weight", ic: "scale", t: "Weight", v: logs.weight ? logs.weight + " kg" : "No data", tone: "grey", navy: true, on: () => setSheet("log") },
    food: { k: "food", ic: "apple", t: "Food", v: logs.food ? logs.food + (logs.food === 1 ? " meal" : " meals") : "No data", tone: logs.food ? "mint" : "grey", on: () => setSheet("log") },
    water: { k: "water", ic: "glass-water", t: "Hydration", v: logs.water ? (logs.water * 250).toLocaleString() + " ml" : "No data", tone: logs.water ? "mint" : "grey", on: () => setSheet("log") },
    skin: { k: "skin", ic: "sun", t: "Skin check-in", v: logs.skin ? logs.skin + " / 100" : "Tap to log", tone: logs.skin ? "gold" : "grey", on: () => setSheet("log") },
    review: { k: "review", ic: "calendar", t: "Next review", v: "Mon 3 Nov", tone: "grey", navy: true, on: () => goJN("JaneMessages.html?to=reception") },
    distance: { k: "distance", ic: "map-pin", t: "Distance", v: tracking ? "7.4 km" : "0 km", tone: "mint" },
    cal: { k: "cal", ic: "flame", t: "Cal burned", v: tracking ? "1,840" : "0", tone: "mint" },
    exdays: { k: "exdays", ic: "dumbbell", t: "Exercise days", v: tracking ? "3 of 5" : "0 of 5", tone: "mint" },
    hourly: { k: "hourly", ic: "timer", t: "Hourly activity", v: tracking ? "9 of 12 hrs" : "No data", tone: "mint" },
    hr: { k: "hr", ic: "heart", t: "Heart rate", v: tracking ? "61 bpm" : "--", tone: "grey", navy: true },
    cycle: { k: "cycle", ic: "flower", t: "Cycle health", v: cycle ? "Day " + cycleDay(cycle) + " · " + cyclePhase(cycle) : "Tap to set up", tone: cycle ? "rose" : "grey", on: () => setSheet("cycle") },
  };
  const show = (keys) => keys.map((k) => tiles[k]).filter((t) => !hidden[t.k]);
  const Tile = ({ t, wide }) => (
    <button className={"jh-tile " + t.tone + (wide ? " wide" : "") + (t.navy ? " navy" : "")} onClick={t.on || (() => showToast(t.t + " · " + t.v))}>
      <span className="ic"><IcJN name={t.ic} size={22} /></span>
      <span className="tx"><b>{t.t}</b><span>{t.v}</span></span>
    </button>);

  const checklist = [
    { k: "apps", ic: "layout-grid", art: "lav", t: "Connect apps to see all your data", done: wear.length > 0, on: () => goJN("JaneWearables.html") },
    { k: "cycle", ic: "flower", art: "blue", t: "Set up your cycle health tracking", done: !!cycle, on: () => setSheet("cycle") },
    { k: "phone", ic: "footprints", art: "teal", t: "Track steps and more with your phone", done: phone, on: () => { setPhone(true); saveJN(PHONE_KEY, true); showToast("Phone tracking on · steps will sync from your phone"); } },
    { k: "friends", ic: "users", art: "pink", t: "Add friends to motivate each other", done: friends.length > 0, on: () => setSheet("friends") },
  ];
  const doneN = checklist.filter((c) => c.done).length;
  const OTHER_JANES = ["miranda", "amir", "mark"];
  function toggleFriend(id) { const f = friends.includes(id) ? friends.filter((x) => x !== id) : [...friends, id]; setFriends(f); saveJN(FRIENDS_KEY, f); }

  return (
    <div className="jn-screen jh">
      <header className="jh-head">
        <button className="jh-hbtn" aria-label="Devices" onClick={() => goJN("JaneWearables.html")}><IcJN name="smartphone" size={24} color="var(--text-heading)" /></button>
        <h1>Health</h1>
        <button className="jh-hbtn av" aria-label="Profile" onClick={() => goJN("JaneProfile.html")}><JNFace p={JANE} size={40} /></button>
      </header>
      <div className="jn-scroll jh-scroll">
        {workout && <div className="jh-workout"><span className="dot" /><b>{workout.kind} in progress</b><span className="time">{mmss(elapsed)}</span><button onClick={() => { setWorkout(null); showToast(workout.kind + " saved · " + mmss(elapsed)); }}>Stop</button></div>}
        <div className="jh-rail" ref={railRef} onScroll={onRail}>
          <section className="jh-page">
            <button className="jh-ring" onClick={() => showToast(tracking ? "Weekly cardio · " + ring.sub : "Connect a wearable or turn on phone tracking to start")}>
              <Ring value={ring.pct / 100} size={178} stroke={30} color="var(--brand-navy)">
                <small className="arc">Weekly cardio</small><b>{ring.pct}<i>%</i></b><small className="sub">{ring.sub}</small>
              </Ring>
              <span className="plus">{ring.plus}</span>
            </button>
            <div className="jh-stack">{show(["steps", "readiness", "sleep"]).map((t) => <Tile key={t.k} t={t} wide />)}</div>
          </section>
          <section className="jh-page grid">{show(["vitals", "weight", "food", "water", "skin", "review"]).map((t) => <Tile key={t.k} t={t} />)}</section>
          <section className="jh-page grid">{show(["distance", "cal", "exdays", "hourly", "hr", "cycle"]).map((t) => <Tile key={t.k} t={t} />)}</section>
        </div>
        <div className="jh-dots">{[0, 1, 2].map((i) => <button key={i} className={page === i ? "on" : ""} aria-label={"Page " + (i + 1)} onClick={() => goPage(i)} />)}</div>
        <div className="jh-actions">
          <button className="jh-act" onClick={() => setSheet("log")}><IcJN name="plus" size={22} />Log</button>
          <button className="jh-act" onClick={() => setSheet("start")}><IcJN name="activity" size={22} />Start</button>
          <button className="jh-act round" aria-label="Customise" onClick={() => setSheet("edit")}><IcJN name="pencil" size={20} /></button>
        </div>

        <section className="jh-sheet">
          <div className="jh-list">
            <button className="jh-list-head" onClick={() => setListOpen(!listOpen)} aria-expanded={listOpen}>
              <span className="count">{doneN}/{checklist.length}</span>
              <span className="tx">{doneN === checklist.length ? "You're all set up 🎉" : "Welcome! Let's get you set up"}</span>
              <IcJN name={listOpen ? "chevron-up" : "chevron-down"} size={22} color="var(--text-heading)" />
            </button>
            {listOpen && checklist.map((c) => (
              <button key={c.k} className={"jh-item" + (c.done ? " done" : "")} onClick={c.on}>
                <span className={"art " + c.art}><IcJN name={c.ic} size={30} color="#fff" /></span>
                <span className="tx">{c.t}</span>
                <span className="radio">{c.done && <IcJN name="check" size={14} color="#fff" />}</span>
              </button>))}
          </div>

          {tracking ? (
            <React.Fragment>
              <h3 className="jn-h">This week</h3>
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
              <button className="jn-coachcta" onClick={() => goJN("JaneCoach.html?q=" + encodeURIComponent("How can I improve my hydration this week?"))}><IcJN name="sparkles" size={18} color="var(--ai-purple)" /><span>Ask the coach how to lift your hydration score</span><IcJN name="chevron-right" size={18} color="var(--ai-purple)" /></button>
            </React.Fragment>
          ) : (
            <div className="jh-empty"><IcJN name="trending-up" size={26} color="var(--gray-400)" /><b>Your trends will appear here</b><small>Connect a wearable or turn on phone tracking and this view fills with your sleep, movement and skin trends.</small></div>)}
          <div className="jn-end">Not medical advice · talk to your clinician about any concerns</div>
        </section>
      </div>
      <JNTabs active="health" />

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
   COACH — chat or voice
   ======================================================================= */
const COACH_KEY = "pf-jane-coach";
const COACH = { name: "PROfinity Coach", sub: "Reviewed by " + KATY.name, avatar: "assets/profinity-icon-purple-gold.png" };
const COACH_PROMPTS = ["Prep me for my review on Monday", "Aftercare for lip filler", "Build me a simple skincare routine", "Help me sleep better", "What does my skin score mean?"];
function coachReply(q) {
  const s = q.toLowerCase();
  if (/appoint|review|monday|consult|prep/.test(s)) return "Your review with Katy is Mon 3 Nov at 2:30pm. Three things to bring:\n\n1. Any photos of the swelling from days 2–5\n2. The question you asked in the feed about lip hydration\n3. Your Health Pass QR (Profile → Show)\n\nWant me to add a reminder the night before?";
  if (/aftercare|filler|swell|bruis|lip/.test(s)) return "Lip filler aftercare, week 1 onwards:\n\n• Ice 10 minutes on, 10 off for the first 48h\n• No straws, hot drinks or intense exercise for 24h\n• A plain balm only — skip menthol or 'plumping' products\n• Sleep slightly propped up\n\nSwelling peaks at day 2–3 and settles by week 2. Anything hot, hard or very painful — message Katy straight away.";
  if (/routine|skin|cleans|spf|serum/.test(s)) return "A routine you'll actually keep:\n\nAM — gentle cleanser → vitamin C or hyaluronic serum → moisturiser → SPF 50\nPM — cleanse (double if you wore SPF/makeup) → retinol 2–3 nights a week → moisturiser\n\nYou've logged SPF 5 of 7 days this week — that's the one that moves your skin score most.";
  if (/sleep|tired|energy|bed/.test(s)) return "You averaged 7h 12m this week — your best nights (Fri–Sat) had no screens after 10pm and a caffeine cut-off at 2pm. Let's make those the default:\n\n• Phone on charge outside the bedroom\n• Last coffee 2pm\n• Same wake time, even weekends\n\nI'll check your sleep trend again on Sunday.";
  if (/hydrat|water|drink/.test(s)) return "Your water intake drops on low-step days — 1.4 L on Wednesday vs 2.2 L on Thursday. Easiest fix: a 750 ml bottle finished by lunch and again by 5pm. I can nudge you at 11am and 3pm if you'd like.";
  if (/score|mean|78/.test(s)) return "Your skin score (78 today) comes from your daily selfie rating plus hydration, sleep and SPF habits. Anything over 70 means your routine is working. The biggest swing factors for you have been SPF days and sleep over 7 hours.";
  return "Noted. Based on your Health Pass, the single most useful thing this week is consistency — SPF daily and 7+ hours of sleep. Would you like a short plan, or shall I pass this to Katy before your review?";
}
function loadCoach() { return readJN(COACH_KEY, { msgs: [{ by: "coach", text: "Hi " + JANE.first + " 👋 I'm your wellness coach. I can help with aftercare, routines, sleep and getting ready for appointments. Chat here, or switch to voice.", ts: Date.now() - 3600000 }] }); }
function fmtClockJN(ts) { const d = new Date(ts); return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0"); }

function CoachScreen() {
  const [store, setStore] = useStateJN(loadCoach);
  const [mode, setMode] = useStateJN(qJN("mode") === "voice" ? "voice" : "chat");
  const [draft, setDraft] = useStateJN("");
  const [typing, setTyping] = useStateJN(false);
  const [voice, setVoice] = useStateJN("idle"); // idle | listening | thinking | speaking
  const [heard, setHeard] = useStateJN("");
  const [said, setSaid] = useStateJN("");
  const [muted, setMuted] = useStateJN(false);
  const scrollRef = useRefJN(null);
  const asked = useRefJN(false);

  function persist(s) { setStore(s); saveJN(COACH_KEY, s); }
  function send(text) {
    const t = (text || draft).trim(); if (!t || typing) return;
    const s = { msgs: [...store.msgs, { by: "jane", text: t, ts: Date.now() }] }; persist(s); setDraft(""); setTyping(true);
    setTimeout(() => { persist({ msgs: [...s.msgs, { by: "coach", text: coachReply(t), ts: Date.now() }] }); setTyping(false); }, 1100 + Math.random() * 600);
  }
  useEffectJN(() => { const q = qJN("q"); if (q && !asked.current) { asked.current = true; setTimeout(() => send(q), 300); } }, []);
  useEffectJN(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [store.msgs.length, typing, mode]);

  function talk() {
    if (voice !== "idle") { setVoice("idle"); setHeard(""); setSaid(""); return; }
    const samples = ["How should I prepare for my review appointment on Monday?", "What's the aftercare for lip filler this week?", "Can you help me sleep better?"];
    const q = samples[Math.floor(Math.random() * samples.length)];
    setVoice("listening"); setHeard(""); setSaid("");
    let i = 0; const words = q.split(" ");
    const iv = setInterval(() => { i++; setHeard(words.slice(0, i).join(" ")); if (i >= words.length) { clearInterval(iv); setVoice("thinking");
      setTimeout(() => { const r = coachReply(q); setSaid(r); setVoice("speaking"); persist({ msgs: [...store.msgs, { by: "jane", text: q, ts: Date.now(), voice: true }, { by: "coach", text: r, ts: Date.now(), voice: true }] });
        setTimeout(() => setVoice("idle"), 6000); }, 1200); } }, 180);
  }

  return (
    <div className="jn-screen jn-coachscr">
      <header className="jn-top">
        <img className="jn-face coach" src={COACH.avatar} alt="" />
        <div className="jn-top-txt"><h1>{COACH.name}</h1><span><i className="jn-online" />{COACH.sub}</span></div>
        <span className="grow" />
        <div className="jn-seg mini">{[["chat", "message-circle", "Chat"], ["voice", "mic", "Voice"]].map(([k, ic, l]) => <button key={k} className={mode === k ? "on" : ""} aria-label={l} onClick={() => setMode(k)}><IcJN name={ic} size={16} /><span>{l}</span></button>)}</div>
      </header>

      {mode === "chat" ? (
        <React.Fragment>
          <div className="jn-scroll jn-thread" ref={scrollRef}>
            {store.msgs.map((m, i) => (
              <div key={i} className={"jn-msg " + (m.by === "jane" ? "me" : "them")}>
                {m.by !== "jane" && <img className="jn-face" src={COACH.avatar} alt="" style={{ width: 28, height: 28 }} />}
                <div className="bub">{m.voice && <small className="vc"><IcJN name="mic" size={11} /> voice</small>}{m.text.split("\n").map((l, j) => <p key={j}>{l || " "}</p>)}<time>{fmtClockJN(m.ts)}</time></div>
              </div>))}
            {typing && <div className="jn-msg them"><img className="jn-face" src={COACH.avatar} alt="" style={{ width: 28, height: 28 }} /><div className="bub typing"><i /><i /><i /></div></div>}
            <div className="jn-prompts">{COACH_PROMPTS.map((p) => <button key={p} className="jn-chip" onClick={() => send(p)}>{p}</button>)}</div>
          </div>
          <div className="jn-input-row dock">
            <button className="jn-iconbtn sm" aria-label="Voice" onClick={() => setMode("voice")}><IcJN name="mic" size={18} color="var(--brand-navy)" /></button>
            <input className="jn-in" placeholder="Ask your coach…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <button className="jn-send" aria-label="Send" disabled={!draft.trim()} onClick={() => send()}><IcJN name="send" size={18} color="#fff" /></button>
          </div>
        </React.Fragment>
      ) : (
        <div className="jn-voice">
          <div className={"jn-orb " + voice} onClick={talk} role="button" aria-label="Tap to talk">
            <span className="r r1" /><span className="r r2" /><span className="r r3" />
            <span className="core">{voice === "listening" ? <IcJN name="mic" size={38} color="#fff" /> : voice === "speaking" ? <IcJN name="volume-2" size={38} color="#fff" /> : voice === "thinking" ? <IcJN name="sparkles" size={38} color="#fff" /> : <IcJN name="mic" size={38} color="#fff" />}</span>
          </div>
          <b className="jn-voice-state">{voice === "idle" ? "Tap to talk" : voice === "listening" ? "Listening…" : voice === "thinking" ? "Thinking…" : "Speaking"}</b>
          <div className="jn-voice-txt">
            {heard && <p className="you">“{heard}{voice === "listening" ? "…" : "”"}</p>}
            {said && <div className="ans">{said.split("\n").map((l, j) => <p key={j}>{l || " "}</p>)}</div>}
            {!heard && !said && <p className="hint">Ask about aftercare, your routine, sleep or your next appointment. Your coach has your Health Pass to hand.</p>}
          </div>
          <div className="jn-voice-ctl">
            <button className={"jn-iconbtn lg" + (muted ? " on" : "")} aria-label="Mute" onClick={() => setMuted(!muted)}><IcJN name={muted ? "mic-off" : "mic"} size={22} color={muted ? "#fff" : "var(--brand-navy)"} /></button>
            <button className="jn-iconbtn lg end" aria-label="End" onClick={() => { setVoice("idle"); setHeard(""); setSaid(""); setMode("chat"); }}><IcJN name="phone-off" size={22} color="#fff" /></button>
            <button className="jn-iconbtn lg" aria-label="Keyboard" onClick={() => setMode("chat")}><IcJN name="message-circle" size={22} color="var(--brand-navy)" /></button>
          </div>
        </div>)}
      <JNTabs active="coach" />
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
function evIcsJN(e) {
  const p = PEOPLE[e.host];
  const m = /(\d+):(\d+)(am|pm)/.exec(e.time); let h = +m[1] % 12 + (m[3] === "pm" ? 12 : 0);
  const start = new Date(e.date + "T" + String(h).padStart(2, "0") + ":" + m[2] + ":00"); const end = new Date(start.getTime() + e.dur * 60000);
  const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PROfinity//Jane//EN", "BEGIN:VEVENT", "UID:" + e.id + "@profinity", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(start), "DTEND:" + f(end), "SUMMARY:" + e.title, "LOCATION:" + e.where, "DESCRIPTION:Hosted by " + p.name + ". " + e.desc, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics); a.download = e.title.replace(/[^a-z0-9]+/gi, "-") + ".ics"; document.body.appendChild(a); a.click(); a.remove();
}

function EventsScreen() {
  const [rsvp, setRsvp] = useStateJN(() => readJN(EV_KEY, { ev1: true }));
  const [view, setView] = useStateJN("upcoming");
  const [open, setOpen] = useStateJN(() => EVENTS.find((e) => e.id === qJN("event")) || null);
  const [toast, showToast] = useToastJN();
  function toggle(e) { const r = { ...rsvp, [e.id]: !rsvp[e.id] }; setRsvp(r); saveJN(EV_KEY, r); showToast(r[e.id] ? "You're going to " + e.title : "RSVP removed"); }
  const list = view === "mine" ? EVENTS.filter((e) => rsvp[e.id]) : EVENTS;
  const Card = ({ e }) => { const d = evDate(e); const h = PEOPLE[e.host]; return (
    <article className="jn-ev">
      <button className="jn-ev-img" onClick={() => setOpen(e)}><img src={e.img} alt="" /><span className="date"><b>{d.d}</b><small>{d.m}</small></span>{e.online && <span className="live"><IcJN name="video" size={12} color="#fff" />Online</span>}</button>
      <div className="jn-ev-body">
        <button className="jn-ev-ttl" onClick={() => setOpen(e)}>{e.title}</button>
        <div className="jn-ev-meta"><span><IcJN name="clock" size={14} />{d.wd} {d.d} {d.m} · {e.time}</span><span><IcJN name="map-pin" size={14} />{e.where}</span></div>
        <div className="jn-ev-foot">
          <span className="host"><JNFace p={h} size={24} />{h.name}</span>
          {e.spots != null && <span className="spots">{e.spots - (rsvp[e.id] ? 1 : 0)} spots left</span>}
          <button className={"jn-btn sm" + (rsvp[e.id] ? " going" : "")} onClick={() => toggle(e)}>{rsvp[e.id] ? <React.Fragment><IcJN name="check" size={15} />Going</React.Fragment> : "RSVP"}</button>
        </div>
      </div>
    </article>); };

  return (
    <div className="jn-screen">
      <JNTop title="Events" sub="From your clinic and the PROfinity community" />
      <div className="jn-scroll">
        <div className="jn-seg">{[["upcoming", "Upcoming"], ["mine", "My events"]].map(([k, l]) => <button key={k} className={view === k ? "on" : ""} onClick={() => setView(k)}>{l}</button>)}</div>
        {list.length === 0 && <div className="jn-emptybox"><IcJN name="calendar" size={28} color="var(--gray-400)" /><b>No events yet</b><small>RSVP to an event and it will show up here.</small></div>}
        {list.map((e) => <Card key={e.id} e={e} />)}
        <div className="jn-end">All events are free for Pearce Aesthetics patients</div>
      </div>
      <JNTabs active="events" />

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
    { by: "katy", text: "Also — your 2-week review is booked for Mon 3 Nov, 2:30pm. See you then! 📅", ts: Date.now() - 2 * 3600000 }] },
  { id: "reception", unread: 1, msgs: [{ by: "reception", text: "Reminder: your appointment with Katy Wilson is Monday 3 Nov at 2:30pm. Reply C to confirm or call us to reschedule.", ts: Date.now() - 5 * 3600000 }] },
  { id: "miranda", unread: 0, msgs: [{ by: "miranda", text: "Saw your post! Want to go to the SPF workshop together? 🧴", ts: Date.now() - 30 * 3600000 }, { by: "jane", text: "Yes! I'll RSVP now", ts: Date.now() - 29 * 3600000 }] },
  { id: "beth", unread: 0, msgs: [{ by: "beth", text: "Your aftercare sheet from today's treatment 📎 Aftercare-Lips.pdf", ts: Date.now() - 4 * 86400000, file: "Aftercare-Lips.pdf" }, { by: "jane", text: "Thank you Beth!", ts: Date.now() - 4 * 86400000 + 900000 }] },
] };
const DM_REPLIES = { katy: ["Perfect, thanks for letting me know 🙂", "Noted — I'll add that to your file before Monday.", "Good question. Keep doing what you're doing and we'll check it at your review.", "Send me a photo if it changes, otherwise see you Monday!"], reception: ["Thanks Jane, your appointment is confirmed ✅", "Noted — we'll see you then."], miranda: ["Yay! Let's grab a coffee after 😄", "Perfect, see you there!"], beth: ["You're welcome Jane! Shout if anything's unclear.", "Any time 🙂"] };
function fmtListTimeJN(ts) { const d = new Date(ts), n = new Date(); return d.toDateString() === n.toDateString() ? fmtClockJN(ts) : (n - d < 7 * 86400000 ? WD[d.getDay()] : d.getDate() + " " + MONTHS[d.getMonth()]); }

function MessagesScreen() {
  const [store, setStore] = useStateJN(() => readJN(DM_KEY, DM_SEED));
  const [openId, setOpenId] = useStateJN(qJN("to"));
  const [draft, setDraft] = useStateJN("");
  const [q, setQ] = useStateJN("");
  const [typing, setTyping] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const scrollRef = useRefJN(null);
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
      <JNBar title={p.name} back={() => setOpenId(null)} trailing={<JNFace p={p} size={34} />} />
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
        {conv.id === "katy" && <div className="jn-prompts">{["Thanks Katy!", "Is this swelling normal?", "Can I send a photo?"].map((x) => <button key={x} className="jn-chip" onClick={() => send(x)}>{x}</button>)}</div>}
      </div>
      <div className="jn-input-row dock">
        <button className="jn-iconbtn sm" aria-label="Attach" onClick={() => showToast("Photo & file sharing coming soon")}><IcJN name="plus" size={20} color="var(--brand-navy)" /></button>
        <input className="jn-in" placeholder={"Message " + p.name.split(" ")[0] + "…"} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <button className="jn-send" aria-label="Send" disabled={!draft.trim()} onClick={() => send()}><IcJN name="send" size={18} color="#fff" /></button>
      </div>
      <JNToast toast={toast} />
    </div>); }

  return (
    <div className="jn-screen">
      <JNBar title="Messages" back="JaneNewsfeed.html" trailing={<button className="jn-iconbtn sm" aria-label="New message" onClick={() => showToast("Pick a contact below")}><IcJN name="pencil" size={17} color="var(--brand-navy)" /></button>} />
      <div className="jn-scroll">
        <div className="jn-search"><IcJN name="search" size={17} color="var(--gray-450)" /><input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="jn-care"><JNFace p={KATY} size={44} /><div><b>Your care team</b><small>{KATY.name} · Nurse Beth · Reception</small></div><button className="jn-btn sm" onClick={() => openConv("katy")}>Message</button></div>
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
      <JNToast toast={toast} />
    </div>);
}

/* =======================================================================
   mount
   ======================================================================= */
const JN_SCREENS = { home: HomeScreen, profile: ProfileScreen, onboarding: OnboardingScreen, wearables: WearablesScreen, health: HealthScreen, coach: CoachScreen, events: EventsScreen, messages: MessagesScreen };
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
