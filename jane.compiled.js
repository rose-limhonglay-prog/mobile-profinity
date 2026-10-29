/* ===========================================================================
   PROfinity — Jane (patient) app · iPhone 17 Pro Max
   The second mobile link (profinity-mobile-2.vercel.app) is the PATIENT side
   of PROfinity: "Jane" is the patient persona, "Katie/Katy" the clinician
   (same split as the Flutter app's user_type 'jane' | 'katy'). One bundle
   serves ten shells, picked by window.PF_JN_PAGE:
     home · profile · onboarding · wearables · health · coach · events
     (+ schedule · create · pass = JaneHealthPass.html). Messages is NOT a screen here any more: since
     2026-10-29 JaneMessages.html runs messages-mobile.jsx (the clinician DM
     app) with PF_DM_JANE, and loads this bundle first with PF_JN_NO_MOUNT
     only for window.JaneChromeC (drawer + notifications) and window.PFJaneDM.
   Everything persists in localStorage under pf-jane-*. Suffixed -JN.
   =========================================================================== */
const {
  useState: useStateJN,
  useEffect: useEffectJN,
  useRef: useRefJN,
  useMemo: useMemoJN
} = React;
const DSJN = window.ProfinityDesignSystem_c2b5cc;
const JN_PAGE = window.PF_JN_PAGE || "home";
function goJN(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function hereJN() {
  return (window.location.pathname.split("/").pop() || "JaneNewsfeed.html") + window.location.search;
}
function qJN(k) {
  try {
    return new URLSearchParams(window.location.search).get(k);
  } catch (e) {
    return null;
  }
}
function readJN(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}
function saveJN(key, v) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch (e) {}
}
const IcJN = ({
  name,
  size = 20,
  color = "currentColor",
  style
}) => /*#__PURE__*/React.createElement(DSJN.IconifyIcon, {
  name: "lucide:" + name,
  size: size,
  color: color,
  style: style
});

/* ---- people ------------------------------------------------------------ */
const JANE = {
  id: "jane",
  name: "Jane Taylor",
  first: "Jane",
  avatar: "assets/avatar-sarah-collins.jpg",
  role: "Patient",
  clinic: "Pearce Aesthetics",
  passId: "HP-2048-JT",
  dob: "14 Mar 1991",
  since: "Jun 2026"
};
const KATY = {
  id: "katy",
  name: "Katy Wilson",
  first: "Katy",
  avatar: "assets/avatar-katy.jpg",
  role: "Clinician",
  title: "Registered Nurse · Pearce Aesthetics"
};
const PEOPLE = {
  katy: KATY,
  beth: {
    id: "beth",
    name: "Nurse Beth",
    first: "Beth",
    avatar: "assets/avatar-nurse-beth.jpg",
    role: "Clinician",
    title: "Aesthetic Nurse"
  },
  priya: {
    id: "priya",
    name: "Dr Priya Shah",
    first: "Dr Priya",
    avatar: "assets/avatar-priya-shah.jpg",
    role: "Clinician",
    title: "Aesthetic Doctor"
  },
  miranda: {
    id: "miranda",
    name: "Miranda P.",
    avatar: "assets/avatar-miranda.jpg",
    role: "Patient",
    title: "Patient · 6 weeks post treatment"
  },
  amir: {
    id: "amir",
    name: "Amir K.",
    avatar: "assets/avatar-amir-khan.jpg",
    role: "Patient",
    title: "Patient · new"
  },
  mark: {
    id: "mark",
    name: "Mark E.",
    avatar: "assets/avatar-mark-ellis.jpg",
    role: "Patient",
    title: "Patient"
  },
  reception: {
    id: "reception",
    name: "Pearce Aesthetics",
    avatar: "assets/profinity-icon-purple-gold.png",
    role: "Clinic",
    title: "Reception"
  },
  jane: JANE
};

/* ---- tabs + chrome ---------------------------------------------------- */
const JN_TABS = [{
  key: "home",
  label: "Home",
  icon: "home",
  href: "JaneNewsfeed.html"
}, {
  key: "health",
  label: "Health",
  icon: "heart-pulse",
  href: "JaneHealth.html"
}, {
  key: "coach",
  label: "Coach",
  icon: "sparkles",
  href: "JaneCoach.html"
}, {
  key: "events",
  label: "Events",
  icon: "calendar",
  href: "JaneEvents.html"
}, {
  key: "profile",
  label: "Profile",
  icon: "user",
  href: "JaneProfile.html"
}];
function useIsMobileJN() {
  const [m, setM] = useStateJN(() => window.matchMedia("(max-width:768px)").matches);
  useEffectJN(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setM(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return m;
}
function useDeviceScaleJN() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [s, setS] = useStateJN(calc);
  useEffectJN(() => {
    const u = () => setS(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return s;
}
function useToastJN() {
  const [t, setT] = useStateJN(null);
  const ref = useRefJN(null);
  return [t, msg => {
    setT(msg);
    clearTimeout(ref.current);
    ref.current = setTimeout(() => setT(null), 2200);
  }];
}
/* Header / tab badge — the Messages store is messages-mobile.jsx's (PF_DM_JANE
   → pf-jane-messages-v1) plus any call-booking notes still queued for it. */
function unreadDMJN() {
  const pending = readJN("pf-jane-dm-pending", []).length;
  const s = readJN("pf-jane-messages-v1", null);
  if (s && Array.isArray(s.conversations)) return s.conversations.filter(c => !c.archived).reduce((n, c) => n + (c.unread || 0), 0) + pending;
  return 4 + pending; /* seed: Katy 1 · reception 1 · aftercare club 2 */
}
function JNTabs({
  active,
  compact
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "jn-tabs" + (compact ? " jn-tabs-compact" : ""),
    "aria-label": "Primary"
  }, JN_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "jn-tab" + (t.key === active ? " on" : ""),
    onClick: () => t.key !== active && goJN(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: t.icon,
    size: 22,
    color: t.key === active ? "#fff" : "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
}
function JNTop({
  title,
  sub
}) {
  const unread = unreadDMJN();
  return /*#__PURE__*/React.createElement("header", {
    className: "jn-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-avbtn",
    "aria-label": "Profile",
    onClick: () => goJN("JaneProfile.html")
  }, /*#__PURE__*/React.createElement("img", {
    src: JANE.avatar,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-top-txt"
  }, title ? /*#__PURE__*/React.createElement("h1", null, title) : /*#__PURE__*/React.createElement("img", {
    className: "jn-logo",
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity"
  }), sub && /*#__PURE__*/React.createElement("span", null, sub)), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "jn-iconbtn",
    "aria-label": "Messages",
    onClick: () => goJN("JaneMessages.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "message-circle",
    size: 20,
    color: "var(--brand-navy)"
  }), unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, unread)));
}
function JNBar({
  title,
  back,
  trailing
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "jn-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-back",
    "aria-label": "Back",
    onClick: () => typeof back === "function" ? back() : goJN(back || "JaneNewsfeed.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-left",
    size: 26,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("span", {
    className: "jn-bar-tr"
  }, trailing));
}
function JNSheet({
  open,
  onClose,
  title,
  children,
  tall
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-sheet-wrap",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-sheet" + (tall ? " tall" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "jn-handle"
  }), title && /*#__PURE__*/React.createElement("h3", {
    className: "jn-sheet-ttl"
  }, title), children));
}
function JNToast({
  toast
}) {
  return toast ? /*#__PURE__*/React.createElement("div", {
    className: "jn-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 16,
    color: "#fff"
  }), toast) : null;
}
function JNFace({
  p,
  size = 40,
  className
}) {
  return /*#__PURE__*/React.createElement("img", {
    className: "jn-face " + (className || ""),
    src: p.avatar,
    alt: "",
    style: {
      width: size,
      height: size
    }
  });
}
function RoleChip({
  p
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "jn-role " + (p.role === "Clinician" ? "cl" : p.role === "Clinic" ? "cl" : "pt")
  }, p.role);
}

/* ---- shared stores ---------------------------------------------------- */
const ONB_KEY = "pf-jane-onboarding";
function onbState() {
  return readJN(ONB_KEY, {
    answers: {},
    step: 0,
    done: false
  });
}
const ONB_STEPS = [{
  key: "reason",
  q: "What brings you to the clinic?",
  sub: "Pick everything that applies.",
  multi: true,
  opts: ["Skin quality & glow", "Lines & wrinkles", "Lips", "Volume loss", "Acne or scarring", "Just exploring"]
}, {
  key: "history",
  q: "Have you had aesthetic treatments before?",
  multi: false,
  opts: ["Never — this is my first", "Once or twice", "Regularly", "I'm between clinics"]
}, {
  key: "medical",
  q: "Anything we should know medically?",
  sub: "Shared only with your clinician.",
  multi: true,
  opts: ["No known allergies", "Allergy to lidocaine", "Cold sores (HSV)", "Autoimmune condition", "Pregnant or breastfeeding", "Blood thinners"]
}, {
  key: "sleep",
  q: "How much sleep do you usually get?",
  multi: false,
  opts: ["Less than 6 hours", "6–7 hours", "7–8 hours", "More than 8 hours"]
}, {
  key: "habits",
  q: "Daily habits",
  sub: "Honest answers make better advice.",
  multi: true,
  opts: ["SPF every day", "2L+ water a day", "I smoke or vape", "Regular exercise", "Retinol at night", "Skip skincare some days"]
}, {
  key: "goals",
  q: "Goals for the next 3 months",
  multi: true,
  opts: ["Clearer, brighter skin", "A natural refresh", "Better sleep", "A routine I actually keep", "Feel more confident", "Prepare for an event"]
}];
const WEAR_KEY = "pf-jane-wearables";
const WEARABLES = [{
  id: "apple",
  name: "Apple Health",
  sub: "Sleep · Steps · Heart rate · Mindfulness",
  icon: "heart-pulse",
  tint: "#ff3b5c"
}, {
  id: "oura",
  name: "Oura Ring",
  sub: "Sleep stages · Readiness · HRV",
  icon: "circle",
  tint: "#2b2b4f"
}, {
  id: "fitbit",
  name: "Fitbit",
  sub: "Steps · Sleep · Active minutes",
  icon: "activity",
  tint: "#00b0b9"
}, {
  id: "garmin",
  name: "Garmin",
  sub: "Training · Body battery · Sleep",
  icon: "watch",
  tint: "#1467c2"
}, {
  id: "whoop",
  name: "WHOOP",
  sub: "Strain · Recovery · Sleep",
  icon: "zap",
  tint: "#111"
}, {
  id: "withings",
  name: "Withings",
  sub: "Weight · Body composition",
  icon: "scale",
  tint: "#1aa386"
}, {
  id: "google",
  name: "Google Fit",
  sub: "Steps · Heart points",
  icon: "smartphone",
  tint: "#4285f4"
}];
function wearState() {
  return readJN(WEAR_KEY, {});
}
function connectedWearables() {
  const s = wearState();
  return WEARABLES.filter(w => s[w.id]);
}

/* ---- health data (sample week) ---------------------------------------- */
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const HEALTH = {
  sleep: [6.8, 7.4, 7.1, 6.2, 7.9, 8.1, 7.3],
  steps: [5200, 7800, 6400, 9100, 7200, 4800, 10300],
  water: [1.6, 2.0, 1.4, 2.2, 1.8, 1.5, 2.1],
  skin: [62, 64, 68, 66, 70, 74, 78],
  hr: [62, 61, 64, 63, 60, 59, 61]
};
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
function fmtH(h) {
  const m = Math.round(h % 1 * 60);
  return Math.floor(h) + "h " + (m < 10 ? "0" : "") + m + "m";
}

/* =======================================================================
   HOME — newsfeed, a twin of Katy's NewsfeedMobile (MobileHome in
   mobile.jsx): .m-push banner, .m-top header, pinned accordion, DS PostCard
   inside .post-wrap, comment preview, .m-fab and the .m-tabs glass dock.
   JaneNewsfeed.html therefore also loads styles.css + mobile.css.
   ======================================================================= */
const POSTS_KEY = "pf-jane-posts";
const SEALS = {
  katy: ["gb", "verified"],
  beth: ["gb", "verified"],
  priya: ["gb", "verified"],
  miranda: ["gb"],
  amir: [],
  mark: ["gb"],
  jane: ["gb"],
  reception: ["verified"]
};
const POSTS_SEED = [{
  id: "p0",
  kind: "live",
  by: "katy",
  t: "now",
  live: {
    viewers: 86,
    title: "Aftercare Q&A · ask me anything"
  },
  text: "",
  likes: 31,
  shares: 4,
  liked: false,
  comments: []
}, {
  id: "p1",
  by: "katy",
  t: "2h",
  tags: ["skincare", "tips"],
  text: "Winter skin reminder 🧴 Cold air + central heating = dehydrated skin. Double-cleanse at night, layer a hyaluronic serum under your moisturiser, and yes — SPF still counts in December. The UVA that ages skin comes straight through cloud, so the habit matters more than the forecast.",
  likes: 48,
  shares: 6,
  liked: false,
  comments: [{
    by: "miranda",
    text: "Guilty of skipping SPF when it's grey out 🙈",
    likes: 4,
    t: "1h"
  }, {
    by: "katy",
    text: "The UVA doesn't care about the clouds Miranda 😄",
    likes: 9,
    t: "50m"
  }]
}, {
  id: "p10",
  kind: "reel",
  by: "katy",
  t: "3h",
  tags: ["aftercare", "tips"],
  reel: {
    src: "assets/sample-reel.mp4",
    dur: 30
  },
  text: "30 seconds on the first 24 hours after lip filler 💋 ice on, lipstick off, and please leave the swelling alone — it settles.",
  likes: 86,
  shares: 12,
  liked: false,
  comments: [{
    by: "miranda",
    text: "Wish I'd seen this before my first appointment 😅",
    likes: 3,
    t: "2h"
  }, {
    by: "katy",
    text: "Saving you all the overthinking Miranda 😄",
    likes: 6,
    t: "1h"
  }]
}, {
  id: "p2",
  by: "miranda",
  t: "4h",
  tags: ["progress", "question"],
  text: "6 weeks post lip filler and I've finally stopped overthinking it. Katy was right about the swelling timeline 😅 Any tips for keeping lips hydrated through winter?",
  img: "assets/clinic-lip-design.png",
  likes: 21,
  shares: 2,
  liked: true,
  comments: [{
    by: "beth",
    text: "A plain balm (no menthol or 'plumping' ingredients) and a big glass of water before bed. Simple wins.",
    likes: 7,
    t: "3h"
  }, {
    by: "amir",
    text: "They look so natural!",
    likes: 2,
    t: "2h"
  }]
}, {
  id: "p7",
  kind: "poll",
  by: "katy",
  t: "5h",
  text: "",
  poll: {
    question: "What's your biggest winter skin struggle right now?",
    votes: 212,
    options: [{
      label: "Dryness & tightness",
      pct: 46
    }, {
      label: "Redness",
      pct: 22
    }, {
      label: "Breakouts",
      pct: 18
    }, {
      label: "Dull, tired skin",
      pct: 14
    }]
  },
  likes: 19,
  shares: 3,
  liked: false,
  comments: [{
    by: "mark",
    text: "Dryness, every single year 🙃",
    likes: 3,
    t: "4h"
  }]
}, {
  id: "p3",
  by: "beth",
  t: "Yesterday",
  tags: ["aftercare", "tips"],
  text: "Aftercare 101 after anti-wrinkle treatment: no lying flat for 4 hours, skip the gym today, no facials or massage for 2 weeks, and don't rub the area. Save this post 📌",
  likes: 73,
  shares: 14,
  liked: false,
  comments: []
}, {
  id: "p8",
  kind: "eventreg",
  by: "amir",
  t: "Yesterday",
  event: "ev1",
  going: 12,
  likes: 0,
  shares: 0,
  liked: false,
  comments: []
}, {
  id: "p4",
  by: "amir",
  t: "Yesterday",
  tags: ["question", "appointment"],
  text: "Just booked my first consultation 🙈 nervous but excited. What should I ask? Anything you wish you'd known before your first one?",
  likes: 12,
  shares: 1,
  liked: false,
  comments: [{
    by: "mark",
    text: "Ask about the downtime for YOUR job — mine was more than I expected.",
    likes: 3,
    t: "20h"
  }, {
    by: "katy",
    text: "Bring a list of medications and any allergies, and photos of looks you like AND don't like. See you Thursday Amir!",
    likes: 11,
    t: "18h"
  }]
}, {
  id: "p9",
  kind: "quiz",
  by: "beth",
  t: "2d",
  text: "",
  quiz: {
    question: "Myth or fact: you don't need SPF on a cloudy day.",
    options: [{
      label: "Myth — UVA comes through cloud",
      correct: true
    }, {
      label: "Fact — clouds block the sun"
    }],
    explain: "up to 80% of UV passes through cloud, so SPF is a daily habit, not a weather call."
  },
  likes: 27,
  shares: 5,
  liked: false,
  comments: [{
    by: "miranda",
    text: "Got it right for once 😄",
    likes: 2,
    t: "1d"
  }]
}, {
  id: "p5",
  by: "priya",
  t: "2d",
  tags: ["appointment"],
  text: "Patient Q&A live this Thursday 7pm — bring your questions about skin boosters, what they do and who they suit. Free for all clinic patients.",
  event: "ev1",
  likes: 35,
  shares: 9,
  liked: false,
  comments: []
}, {
  id: "p6",
  by: "mark",
  t: "3d",
  tags: ["wins", "sleep"],
  text: "Week 3 of the sleep + hydration plan from Ava. Energy is noticeably better and my skin check-in score has gone from 61 to 72. Small habits, big difference.",
  imgs: ["assets/course-skin-boosters.jpg", "assets/course-consultation.jpg", "assets/course-full-face-rejuvenation.jpg"],
  likes: 29,
  shares: 3,
  liked: false,
  comments: [{
    by: "katy",
    text: "This is exactly it Mark 👏",
    likes: 5,
    t: "2d"
  }]
}];
const POSTS_SEED_V = 7;
const PINNED_IDS = ["p3", "p5"];
const PUSH_JN = {
  app: "Pearce Aesthetics",
  icon: "assets/profinity-icon-purple-gold.png",
  title: "Appointment reminder",
  body: "Your 2-week review with Katy Wilson is Tuesday 3 Nov at 2:30pm. Tap to confirm or reschedule.",
  cta: "Confirm"
};
const NOTIFS_JN = [{
  by: "katy",
  text: "replied to your comment on her winter skin post",
  t: "50m",
  icon: "message-square"
}, {
  by: "reception",
  text: "Appointment confirmed · Tue 3 Nov, 2:30pm",
  t: "2h",
  icon: "calendar"
}, {
  by: "miranda",
  text: "liked your post",
  t: "4h",
  icon: "heart"
}, {
  by: "priya",
  text: "is hosting Skin Boosters Q&A · Live on Thursday",
  t: "1d",
  icon: "video"
}, {
  by: "beth",
  text: "sent you an aftercare sheet",
  t: "4d",
  icon: "paperclip"
}];
function loadPosts() {
  const s = readJN(POSTS_KEY, null);
  if (readJN("pf-jane-posts-v", 0) < POSTS_SEED_V) {
    const mine = (s || []).filter(p => p.by === "jane");
    const merged = [...mine, ...POSTS_SEED];
    saveJN(POSTS_KEY, merged);
    saveJN("pf-jane-posts-v", POSTS_SEED_V);
    return merged;
  }
  return s || POSTS_SEED;
}
function authorJN(id) {
  const p = PEOPLE[id];
  return {
    name: p.name,
    avatar: p.avatar,
    seals: SEALS[id] || []
  };
}
function fmtN(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(n);
}
function ClampTextJN({
  text,
  lines = 3
}) {
  const [expanded, setExpanded] = useStateJN(false);
  const [overflowing, setOverflowing] = useStateJN(false);
  const ref = useRefJN(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (el) setOverflowing(el.scrollHeight - el.clientHeight > 2);
  }, [text]);
  return /*#__PURE__*/React.createElement("span", {
    className: "pf-clampwrap"
  }, /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: "pf-clamp" + (expanded ? " open" : ""),
    style: expanded ? null : {
      WebkitLineClamp: lines
    }
  }, text), (overflowing || expanded) && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-seemore",
    onClick: () => setExpanded(v => !v)
  }, expanded ? "See less" : "See more"));
}
function PushBannerJN() {
  const [open, setOpen] = useStateJN(true);
  const [expanded, setExpanded] = useStateJN(false);
  useEffectJN(() => {
    if (expanded) return;
    const t = setTimeout(() => setOpen(false), 7000);
    return () => clearTimeout(t);
  }, [expanded]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "m-push" + (expanded ? " expanded" : ""),
    role: "alert",
    "aria-label": PUSH_JN.title,
    onClick: () => setExpanded(e => !e)
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-push-row"
  }, /*#__PURE__*/React.createElement("img", {
    className: "m-push-icon",
    src: PUSH_JN.icon,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-push-app"
  }, PUSH_JN.app), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-push-time"
  }, "now")), /*#__PURE__*/React.createElement("div", {
    className: "m-push-title"
  }, PUSH_JN.title), /*#__PURE__*/React.createElement("p", {
    className: "m-push-body"
  }, PUSH_JN.body), expanded && /*#__PURE__*/React.createElement("div", {
    className: "m-push-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-push-cta",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
      goJN("JaneMessages.html?to=reception");
    }
  }, PUSH_JN.cta), /*#__PURE__*/React.createElement("button", {
    className: "m-push-dismiss",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
    }
  }, "Dismiss")), /*#__PURE__*/React.createElement("span", {
    className: "m-push-handle",
    role: "button",
    "aria-label": "Dismiss notification",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
    }
  }));
}
function useHeaderHideJN(scrollRef) {
  const [state, setState] = useStateJN({
    hidden: false,
    floating: false
  });
  useEffectJN(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop,
        dy = y - lastY;
      setState(prev => {
        let hidden = prev.hidden;
        if (y < 40) hidden = false;else if (dy > 6) hidden = true;else if (dy < -6) hidden = false;
        return {
          hidden,
          floating: y > 40
        };
      });
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}
function usePullToRefreshJN(scrollRef, onRefresh) {
  const THRESHOLD = 64,
    MAX = 90;
  const [pull, setPull] = useStateJN(0);
  const [dragging, setDragging] = useStateJN(false);
  const [refreshing, setRefreshing] = useStateJN(false);
  const drag = useRefJN({
    active: false,
    startY: 0
  });
  const busy = useRefJN(false);
  const cb = useRefJN(onRefresh);
  cb.current = onRefresh;
  useEffectJN(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onDown = e => {
      if (busy.current || el.scrollTop > 0) return;
      drag.current = {
        active: true,
        startY: e.clientY
      };
      setDragging(true);
    };
    const onMove = e => {
      if (!drag.current.active) return;
      const dy = e.clientY - drag.current.startY;
      if (dy <= 0 || el.scrollTop > 0) {
        drag.current.active = false;
        setDragging(false);
        setPull(0);
        return;
      }
      e.preventDefault();
      setPull(Math.min(MAX, dy * 0.45));
    };
    const onUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      setDragging(false);
      setPull(p => {
        if (p < THRESHOLD) return 0;
        busy.current = true;
        setRefreshing(true);
        Promise.resolve(cb.current()).then(() => {
          busy.current = false;
          setRefreshing(false);
          setPull(0);
        });
        return THRESHOLD;
      });
    };
    el.addEventListener("pointerdown", onDown, {
      passive: true
    });
    el.addEventListener("pointermove", onMove, {
      passive: false
    });
    el.addEventListener("pointerup", onUp, {
      passive: true
    });
    el.addEventListener("pointercancel", onUp, {
      passive: true
    });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);
  return {
    pull,
    dragging,
    refreshing
  };
}
const JNTopBar = React.forwardRef(function JNTopBar({
  onMenu,
  onBell
}, ref) {
  const unread = unreadDMJN();
  return /*#__PURE__*/React.createElement("header", {
    ref: ref,
    className: "m-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-burger",
    "aria-label": "Menu",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "menu",
    size: 24,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Search",
    onClick: () => goJN("JaneNewsfeed.html?search=1")
  }, /*#__PURE__*/React.createElement(DSJN.Icon, {
    name: "search",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Notifications",
    onClick: onBell
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "bell",
    size: 20,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, NOTIFS_JN.length)), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Messages",
    onClick: () => goJN("JaneMessages.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "message-circle",
    size: 20,
    color: "var(--brand-navy)"
  }), unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, unread)));
});
const JNDock = React.forwardRef(function JNDock({
  compact,
  active
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "m-tabs" + (compact ? " m-tabs-compact" : ""),
    "aria-label": "Primary"
  }, JN_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "m-tab" + (t.key === active ? " on" : ""),
    "aria-current": t.key === active ? "page" : undefined,
    onClick: () => t.key !== active && goJN(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: t.icon,
    size: 20,
    color: t.key === active ? "#fff" : "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
});

/* Drawer (burger) — a twin of the clinician SideMenu in mobile.jsx (same
   .m-drawer / .sm-* classes from mobile.css, which Home and Health load):
   profile head, Health Passport primary card, upcoming events, My Profile rows
   with the gold status row, Display toggle, Logout. */
function useDarkModeJN() {
  const [dark, setDark] = useStateJN(() => {
    try {
      return localStorage.getItem("pf-theme") === "dark";
    } catch (e) {
      return false;
    }
  });
  const toggle = () => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem("pf-theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    } catch (e) {}
  };
  return [dark, toggle];
}
function JNDrawer({
  open,
  onClose
}) {
  const [dark, toggleDark] = useDarkModeJN();
  const onb = onbState();
  const wear = connectedWearables();
  useEffectJN(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const rows = [["user", "Edit Profile", "JaneProfile.html?edit=1"], ["watch", wear.length ? "My Wearables" : "Connect your wearables", "JaneWearables.html"], ["heart-pulse", "Health Analytics", "JaneHealth.html"], ["sparkles", "Ava", "JaneCoach.html"], ["calendar", "Events", "JaneEvents.html"], ["message-circle", "Messages", "JaneMessages.html"], ["phone", "Calls & appointments", "JaneScheduleCall.html?ret=" + encodeURIComponent(hereJN())], ["shield-check", "Privacy & Security", null], ["headphones", "Clinic Support", "JaneMessages.html?to=reception"]];
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-profile",
    onClick: () => goJN("JaneProfile.html")
  }, /*#__PURE__*/React.createElement(DSJN.Avatar, {
    name: JANE.name,
    src: JANE.avatar,
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-dp-name"
  }, JANE.name, onb.done && /*#__PURE__*/React.createElement(IcJN, {
    name: "badge-check",
    size: 18,
    color: "var(--reaction-like)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-role"
  }, "Patient · ", JANE.clinic)), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 22,
    color: "var(--gray-800)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-wrap sm"
  }, /*#__PURE__*/React.createElement(HealthPassCard, {
    onClick: () => goJN("JaneHealthPass.html?ret=" + encodeURIComponent(hereJN()))
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, "Upcoming Events"), /*#__PURE__*/React.createElement("div", {
    className: "sm-events"
  }, EVENTS.slice(0, 2).map(e => {
    const d = evDate(e);
    const h = PEOPLE[e.host];
    return /*#__PURE__*/React.createElement("button", {
      key: e.id,
      className: "sm-event",
      onClick: () => goJN("JaneEvents.html?event=" + e.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-date"
    }, /*#__PURE__*/React.createElement("b", null, d.d), /*#__PURE__*/React.createElement("i", null, d.m.toUpperCase())), /*#__PURE__*/React.createElement("span", {
      className: "sm-event-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-event-name"
    }, e.title), /*#__PURE__*/React.createElement("span", {
      className: "sm-event-time"
    }, d.wd, " · ", e.time), /*#__PURE__*/React.createElement("span", {
      className: "sm-event-hosts"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: h,
      size: 26
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-event-hosts-label"
    }, h.name))), /*#__PURE__*/React.createElement("span", {
      className: "sm-event-access" + (e.online ? " sm-event-access-open" : " sm-event-access-members")
    }, e.online ? "Online" : "In clinic"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, "My Profile"), !onb.done && /*#__PURE__*/React.createElement("button", {
    className: "sm-row sm-verify",
    onClick: () => goJN("JaneOnboarding.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "clipboard-list",
    size: 23,
    color: "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, "Complete Health Passport"), /*#__PURE__*/React.createElement("span", {
    className: "sm-verify-pill"
  }, Object.keys(onb.answers || {}).length ? "In progress" : "Not started")), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, rows.map(([ic, label, href]) => /*#__PURE__*/React.createElement("button", {
    key: label,
    className: "sm-row",
    onClick: () => href ? goJN(href) : null
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: ic,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, label), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 20,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sm-display-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-display-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-display-label"
  }, "Display"), /*#__PURE__*/React.createElement("button", {
    className: "sm-switch" + (dark ? " on" : ""),
    onClick: toggleDark,
    role: "switch",
    "aria-checked": dark,
    "aria-label": dark ? "Switch to light mode" : "Switch to dark mode"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-knob"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: dark ? "moon" : "sun",
    size: 13,
    color: dark ? "#1A1736" : "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("p", {
    className: "sm-display-desc"
  }, "Adjust the appearance of the app to reduce glare and give your eyes a break"))), /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-logout",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "log-out",
    size: 22,
    color: "var(--error)"
  }), "Logout"))));
}
function JNNotifPanel({
  open,
  onClose
}) {
  const up = upcomingCall();
  const notifs = up ? [{
    by: up.with || "katy",
    text: "confirmed your " + callTypeLabel(up).toLowerCase() + " · " + callWhen(up),
    t: "Just now",
    icon: "phone"
  }, ...NOTIFS_JN] : NOTIFS_JN;
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-layer right" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-scrim",
    "aria-label": "Close notifications",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "jn-panel"
  }, /*#__PURE__*/React.createElement("header", {
    className: "jn-panel-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Notifications"), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "x",
    size: 20,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "jn-panel-list"
  }, notifs.map((n, i) => {
    const p = PEOPLE[n.by];
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      className: "jn-notif",
      onClick: () => goJN(n.icon === "phone" ? "JaneScheduleCall.html?ret=" + encodeURIComponent(hereJN()) : n.icon === "calendar" ? "JaneMessages.html?to=reception" : n.icon === "video" ? "JaneEvents.html?event=ev1" : n.icon === "paperclip" ? "JaneMessages.html?to=beth" : "JaneNewsfeed.html")
    }, /*#__PURE__*/React.createElement("span", {
      className: "av"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: p,
      size: 44
    }), /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement(IcJN, {
      name: n.icon,
      size: 11,
      color: "#fff"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, p.name), " ", n.text, /*#__PURE__*/React.createElement("small", null, n.t)));
  }))));
}

/* ---- Katy-feed content kinds for Jane (same styles.css classes as the
   clinician feed: .pf-livenow, .pf-poll, .pf-quiz, .pf-event-feed) ---- */
function PollJN({
  poll,
  onVote
}) {
  const [voted, setVoted] = useStateJN(poll.voted == null ? null : poll.voted);
  const answered = voted !== null;
  const total = poll.votes + (answered ? 1 : 0);
  const pctOf = (o, i) => poll.votes ? o.pct : voted === i ? 100 : 0;
  const leadIdx = poll.options.reduce((b, o, i) => pctOf(o, i) > pctOf(poll.options[b], b) ? i : b, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "pf-poll" + (answered ? " answered" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-poll-q"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-poll-badge"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "bar-chart-2",
    size: 15,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("span", null, poll.question)), /*#__PURE__*/React.createElement("div", {
    className: "pf-poll-opts"
  }, poll.options.map((o, i) => {
    const p = pctOf(o, i);
    const mine = voted === i;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: o.label,
      className: "pf-poll-opt" + (answered ? " answered" : "") + (mine ? " selected" : "") + (answered && i === leadIdx ? " leading" : ""),
      disabled: answered,
      "aria-pressed": mine,
      onClick: () => {
        setVoted(i);
        onVote && onVote(i);
      }
    }, answered && /*#__PURE__*/React.createElement("span", {
      className: "pf-poll-fill",
      style: {
        width: p + "%"
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "pf-poll-opt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pf-poll-letter"
    }, String.fromCharCode(65 + i)), /*#__PURE__*/React.createElement("span", {
      className: "pf-poll-label"
    }, o.label), answered && /*#__PURE__*/React.createElement("span", {
      className: "pf-poll-pct"
    }, p, "%"), mine && /*#__PURE__*/React.createElement("span", {
      className: "pf-poll-check"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 16,
      color: "var(--pf-poll-accent)"
    }))));
  })), answered ? /*#__PURE__*/React.createElement("div", {
    className: "pf-poll-after"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-poll-after-head"
  }, /*#__PURE__*/React.createElement("b", null, "Thanks for voting!"), /*#__PURE__*/React.createElement("span", {
    className: "pf-poll-chip"
  }, "Voted")), /*#__PURE__*/React.createElement("p", null, total.toLocaleString(), " votes so far · ", /*#__PURE__*/React.createElement("b", null, poll.options[leadIdx].label), " is leading with ", pctOf(poll.options[leadIdx], leadIdx), "%.")) : /*#__PURE__*/React.createElement("div", {
    className: "pf-poll-foot"
  }, total.toLocaleString(), " votes · Tap an option to vote"));
}
function QuizJN({
  quiz,
  onAnswer
}) {
  const [picked, setPicked] = useStateJN(quiz.picked == null ? null : quiz.picked);
  const answered = picked !== null;
  const isCorrect = answered && quiz.options[picked].correct;
  return /*#__PURE__*/React.createElement("div", {
    className: "pf-quiz"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-quiz-q"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-quiz-badge"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "brain",
    size: 15,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("span", null, quiz.question)), /*#__PURE__*/React.createElement("div", {
    className: "pf-quiz-opts"
  }, quiz.options.map((o, i) => {
    const state = answered && o.correct ? "correct" : answered && picked === i ? "incorrect" : "";
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: o.label,
      className: "pf-quiz-opt" + (answered ? " answered" : "") + (state ? " " + state : ""),
      disabled: answered,
      onClick: () => {
        setPicked(i);
        onAnswer && onAnswer(i);
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "pf-quiz-opt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pf-quiz-letter" + (state ? " " + state : "")
    }, String.fromCharCode(65 + i)), /*#__PURE__*/React.createElement("span", {
      className: "pf-quiz-label"
    }, o.label), state && /*#__PURE__*/React.createElement("span", {
      className: "pf-quiz-mark " + state
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: state === "correct" ? "check" : "x",
      size: 16,
      color: state === "correct" ? "var(--success)" : "var(--error)"
    }))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-quiz-foot" + (answered ? " " + (isCorrect ? "correct" : "incorrect") : "")
  }, answered ? (isCorrect ? "Correct! " : "Not quite — ") + quiz.explain : "Tap an option to answer"));
}
function LiveNowJN({
  live,
  author,
  onTap
}) {
  const initials = author.name.split(" ").map(p => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    className: "pf-livenow",
    onClick: onTap,
    role: "img",
    "aria-label": author.name + " is live now, " + live.viewers + " watching"
  }, live.frame ? /*#__PURE__*/React.createElement("img", {
    src: live.frame,
    alt: ""
  }) : /*#__PURE__*/React.createElement("div", {
    className: "pf-livenow-initials",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null, initials)), /*#__PURE__*/React.createElement("span", {
    className: "pf-livenow-badge"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-livenow-dot",
    "aria-hidden": "true"
  }), "LIVE"), /*#__PURE__*/React.createElement("span", {
    className: "pf-livenow-viewers"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "eye",
    size: 13,
    color: "var(--white)"
  }), live.viewers), /*#__PURE__*/React.createElement("span", {
    className: "jn-live-title"
  }, live.title));
}
function EventRegJN({
  p
}) {
  const a = authorJN(p.by);
  const ev = EVENTS.find(e => e.id === p.event) || EVENTS[0];
  const d = evDate(ev);
  const go = () => goJN("JaneEvents.html?event=" + ev.id);
  return /*#__PURE__*/React.createElement("div", {
    className: "post-wrap pf-event-feed",
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--r-md)",
      overflow: "hidden",
      padding: "0px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-prof-av"
  }, /*#__PURE__*/React.createElement(DSJN.Avatar, {
    name: a.name,
    src: a.avatar,
    size: 44
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-head-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-head-name"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "pf-prof-nm"
  }, a.name)), a.seals.length > 0 && /*#__PURE__*/React.createElement(DSJN.VerificationSeals, {
    seals: a.seals,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-head-sub"
  }, /*#__PURE__*/React.createElement("span", null, p.t)))), /*#__PURE__*/React.createElement("div", {
    className: "pf-event-feed-label"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar-check",
    size: 14,
    color: "var(--premium-gold-deep)"
  }), /*#__PURE__*/React.createElement("span", null, "EVENT")), /*#__PURE__*/React.createElement("p", {
    className: "pf-event-reg-headline"
  }, /*#__PURE__*/React.createElement("b", null, a.name), " is going to ", /*#__PURE__*/React.createElement("b", null, ev.title), "."), /*#__PURE__*/React.createElement("div", {
    className: "pf-event-reg-card"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-event-reg-main",
    onClick: go
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-event-reg-title"
  }, ev.title), /*#__PURE__*/React.createElement("span", {
    className: "pf-event-reg-sub"
  }, d.wd, " ", d.d, " ", d.m, " · ", ev.time, " · ", ev.where), /*#__PURE__*/React.createElement("span", {
    className: "pf-event-reg-going"
  }, p.going, " patients going")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-event-reg-cta",
    onClick: go
  }, readJN("pf-jane-events", {
    ev1: true
  })[ev.id] ? "You're going · see details" : "RSVP to this event")));
}

/* ---- reactions: a copy of the clinician feed's animation set (app.jsx
   burstFrom / ReactionPicker / useReactionPicker / useDoubleTapLove), CSS
   from styles.css (.pf-react-*, .sm-double-heart). Like = tap; hover or
   long-press the like button for the six-emoji bar; double-tap a photo for
   the big heart. No points on the patient side. ---- */
const REACTIONS_JN = [{
  key: "like",
  label: "Like",
  icon: "fluent-emoji-flat:thumbs-up",
  flat: "fluent:thumb-like-16-filled",
  color: "--reaction-like"
}, {
  key: "love",
  label: "Love",
  icon: "fluent-emoji-flat:red-heart",
  flat: "fluent:heart-16-filled",
  color: "--reaction-love"
}, {
  key: "laugh",
  label: "Laugh",
  icon: "fluent-emoji-flat:grinning-squinting-face",
  flat: "fluent:emoji-laugh-16-filled",
  color: "--premium-orange"
}, {
  key: "wow",
  label: "Wow",
  icon: "fluent-emoji-flat:face-with-open-mouth",
  flat: "fluent:emoji-16-filled",
  color: "--premium-orange"
}, {
  key: "cry",
  label: "Cry",
  icon: "fluent-emoji-flat:crying-face",
  flat: "fluent:emoji-sad-16-filled",
  color: "--premium-orange"
}, {
  key: "angry",
  label: "Angry",
  icon: "fluent-emoji-flat:pouting-face",
  flat: "fluent:emoji-angry-16-filled",
  color: "--error"
}];
const REACTION_MAP_JN = REACTIONS_JN.reduce((m, r) => {
  m[r.key] = r;
  return m;
}, {});
function cssVarJN(name) {
  const cs = getComputedStyle(document.querySelector(".app") || document.body);
  return cs.getPropertyValue(name).trim() || "currentColor";
}
function frameScaleJN(el) {
  const f = el && el.closest && el.closest("[data-ios-device]");
  if (!f || !f.offsetWidth) return 1;
  const s = f.getBoundingClientRect().width / f.offsetWidth;
  return s > 0 && isFinite(s) ? s : 1;
}
function likeButtonJN(wrap) {
  if (!wrap) return null;
  const bar = wrap.querySelector('[style*="space-between"]');
  return (bar || wrap).querySelector("button");
}
function actionIconJN(wrap, idx) {
  const bar = wrap && wrap.querySelector('[style*="space-between"]');
  const b = bar ? bar.querySelectorAll("button")[idx] : null;
  return b ? b.querySelector("iconify-icon, svg") : null;
}
function burstFromJN(btn, key) {
  if (!btn) return;
  const r = REACTION_MAP_JN[key] || REACTION_MAP_JN.like;
  const color = cssVarJN(r.color);
  const icon = btn.querySelector("iconify-icon");
  if (icon && icon.animate) icon.animate([{
    transform: "scale(1)"
  }, {
    transform: "scale(1.6)"
  }, {
    transform: "scale(0.9)"
  }, {
    transform: "scale(1)"
  }], {
    duration: 460,
    easing: "cubic-bezier(.34,1.56,.64,1)"
  });
  const s = frameScaleJN(btn);
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + 16 * s,
    cy = rect.top + rect.height / 2;
  for (let i = 0; i < 7; i++) {
    const size = (13 + Math.random() * 10) * s;
    const el = document.createElement("iconify-icon");
    el.setAttribute("icon", r.icon);
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;left:" + cx + "px;top:" + cy + "px;width:" + size + "px;height:" + size + "px;pointer-events:none;z-index:9999;line-height:0;will-change:transform,opacity;color:" + color + ";";
    document.body.appendChild(el);
    const dx = (Math.random() - 0.5) * 96 * s,
      dy = (-56 - Math.random() * 74) * s;
    const anim = el.animate([{
      transform: "translate(-50%,-50%) scale(.3)",
      opacity: 0
    }, {
      transform: "translate(calc(-50% + " + dx * 0.35 + "px),calc(-50% + " + dy * 0.35 + "px)) scale(1)",
      opacity: 1,
      offset: 0.28
    }, {
      transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(.55)",
      opacity: 0
    }], {
      duration: 740 + Math.random() * 280,
      easing: "cubic-bezier(.22,.61,.36,1)"
    });
    anim.onfinish = () => el.remove();
    setTimeout(() => el.remove(), 1500);
  }
}
function ReactionPickerJN({
  at,
  onPick,
  onEnter,
  onLeave
}) {
  if (!at) return null;
  const scale = at.scale || 1;
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: at.bottom,
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: scale !== 1 ? "scale(" + scale + ")" : undefined,
      transformOrigin: "center bottom",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    className: "pf-react-bar",
    role: "menu",
    "aria-label": "Pick a reaction",
    style: {
      pointerEvents: "auto"
    }
  }, REACTIONS_JN.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.key,
    type: "button",
    role: "menuitem",
    "aria-label": r.label,
    onClick: () => onPick(r.key),
    className: "pf-react-opt",
    "data-react": r.key,
    style: {
      animationDelay: i * 35 + "ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-react-label"
  }, r.label), /*#__PURE__*/React.createElement(DSJN.IconifyIcon, {
    name: r.icon,
    size: 40
  })))))), document.body);
}
function useReactionPickerJN(ref, reaction, onReact) {
  const [picker, setPicker] = useStateJN(null);
  const hideT = useRefJN(null);
  const pressT = useRefJN(null);
  const pressed = useRefJN(false);
  const show = () => {
    clearTimeout(hideT.current);
    const btn = likeButtonJN(ref.current);
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const scale = frameScaleJN(btn);
    setPicker({
      bottom: window.innerHeight - r.top + 8 * scale,
      scale
    });
  };
  const scheduleHide = () => {
    clearTimeout(hideT.current);
    hideT.current = setTimeout(() => setPicker(null), 280);
  };
  const cancelHide = () => clearTimeout(hideT.current);
  useEffectJN(() => {
    const btn = likeButtonJN(ref.current);
    if (!btn) return undefined;
    const down = () => {
      pressed.current = false;
      clearTimeout(pressT.current);
      pressT.current = setTimeout(() => {
        pressed.current = true;
        show();
      }, 420);
    };
    const up = () => clearTimeout(pressT.current);
    const click = e => {
      if (pressed.current) {
        e.stopPropagation();
        e.preventDefault();
        pressed.current = false;
      }
    };
    btn.addEventListener("mouseenter", show);
    btn.addEventListener("mouseleave", scheduleHide);
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
    btn.addEventListener("pointerleave", up);
    btn.addEventListener("click", click, true);
    return () => {
      btn.removeEventListener("mouseenter", show);
      btn.removeEventListener("mouseleave", scheduleHide);
      btn.removeEventListener("pointerdown", down);
      btn.removeEventListener("pointerup", up);
      btn.removeEventListener("pointercancel", up);
      btn.removeEventListener("pointerleave", up);
      btn.removeEventListener("click", click, true);
      clearTimeout(hideT.current);
      clearTimeout(pressT.current);
    };
  }, []);
  useEffectJN(() => {
    if (!picker) return undefined;
    const close = e => {
      if (!e.target.closest || !e.target.closest(".pf-react-bar")) setPicker(null);
    };
    const t = setTimeout(() => document.addEventListener("pointerdown", close, true), 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener("pointerdown", close, true);
    };
  }, [picker]);
  React.useLayoutEffect(() => {
    const btn = likeButtonJN(ref.current);
    if (!btn) return;
    const icon = btn.querySelector("iconify-icon");
    const label = btn.querySelector("span");
    const r = REACTION_MAP_JN[reaction];
    if (r) {
      const col = cssVarJN(r.color);
      if (icon) {
        icon.setAttribute("icon", r.icon);
        icon.style.color = col;
      }
      if (label) {
        label.style.color = col;
        label.style.fontWeight = "var(--fw-semibold)";
      }
      btn.dataset.reacted = r.key;
    } else if (btn.dataset.reacted) {
      if (icon) {
        icon.setAttribute("icon", "fluent:thumb-like-16-filled");
        icon.style.color = "";
      }
      if (label) {
        label.style.color = "";
        label.style.fontWeight = "";
      }
      delete btn.dataset.reacted;
    }
  });
  const pick = key => {
    const changing = reaction !== key;
    onReact(key);
    if (changing) burstFromJN(likeButtonJN(ref.current), key);
    setPicker(null);
  };
  return {
    picker,
    pick,
    cancelHide,
    scheduleHide
  };
}
function useDoubleTapLoveJN(onLove) {
  const lastTap = useRefJN(0);
  const pending = useRefJN(null);
  const [heart, setHeart] = useStateJN(null);
  const seq = useRefJN(0);
  const wrap = singleTap => e => {
    const now = Date.now();
    const x = e.clientX,
      y = e.clientY;
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      clearTimeout(pending.current);
      const key = ++seq.current;
      setHeart({
        x,
        y,
        key
      });
      setTimeout(() => setHeart(h => h && h.key === key ? null : h), 700);
      onLove();
      return;
    }
    lastTap.current = now;
    if (singleTap) pending.current = setTimeout(singleTap, 260);
  };
  const onTap = wrap(null);
  const heartNode = heart ? ReactDOM.createPortal(/*#__PURE__*/React.createElement("span", {
    key: heart.key,
    className: "sm-double-heart",
    style: {
      left: heart.x,
      top: heart.y
    }
  }, /*#__PURE__*/React.createElement(DSJN.IconifyIcon, {
    name: "fluent:heart-16-filled",
    size: 96,
    color: "var(--reaction-love)"
  })), document.body) : null;
  return {
    onTap,
    wrap,
    heartNode
  };
}
/* Swipeable photo carousel — Katy's MediaCarousel (styles.css .mc-*):
   scroll-snap slides, 1/N counter, sliding dots, tap for the fullscreen
   strip (.sm-fs). Single photos render as one square slide. */
function SlidingDotsJN({
  count,
  idx
}) {
  const MAX = 5;
  if (count <= MAX) return /*#__PURE__*/React.createElement("div", {
    className: "mc-dots"
  }, Array.from({
    length: count
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "mc-dot" + (i === idx ? " on" : "")
  })));
  const SCALES = [0.57, 0.78, 1, 0.78, 0.57];
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-dots"
  }, SCALES.map((sc, pos) => /*#__PURE__*/React.createElement("span", {
    key: pos,
    className: "mc-dot" + (pos === 2 ? " on" : ""),
    style: {
      transform: "scale(" + sc + ")"
    }
  })));
}
function CarouselJN({
  imgs,
  wrap
}) {
  const [idx, setIdx] = useStateJN(0);
  const [fs, setFs] = useStateJN(false);
  const [fsIdx, setFsIdx] = useStateJN(0);
  const ref = useRefJN(null);
  const fsRef = useRefJN(null);
  const single = imgs.length === 1;
  useEffectJN(() => {
    if (!fs) return;
    const onKey = e => {
      if (e.key === "Escape") setFs(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [fs]);
  useEffectJN(() => {
    if (fs && fsRef.current) fsRef.current.scrollLeft = fsIdx * fsRef.current.clientWidth;
  }, [fs]);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild;
    const w = first ? first.offsetWidth + 8 : el.clientWidth;
    setIdx(Math.max(0, Math.min(imgs.length - 1, Math.round(el.scrollLeft / w))));
  };
  const onFsScroll = () => {
    const el = fsRef.current;
    if (el) setFsIdx(Math.round(el.scrollLeft / el.clientWidth));
  };
  const tap = i => wrap ? wrap(() => {
    if (!single) {
      setFsIdx(i);
      setFs(true);
    }
  }) : () => {
    if (!single) {
      setFsIdx(i);
      setFs(true);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-scroll" + (single ? " mc-scroll-single" : ""),
    ref: ref,
    onScroll: onScroll
  }, imgs.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: "Image " + (i + 1) + " of " + imgs.length,
    className: "mc-img",
    draggable: false,
    onClick: tap(i)
  }))), !single && /*#__PURE__*/React.createElement("span", {
    className: "mc-count"
  }, idx + 1, "/", imgs.length), !single && /*#__PURE__*/React.createElement(SlidingDotsJN, {
    count: imgs.length,
    idx: idx
  }), fs && /*#__PURE__*/React.createElement("div", {
    className: "sm-fs",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-fs-track",
    onScroll: onFsScroll,
    ref: fsRef
  }, imgs.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: "Image " + (i + 1) + " of " + imgs.length
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-fs-close",
    "aria-label": "Close fullscreen",
    onClick: () => setFs(false)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "x",
    size: 24,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mc-fs-count"
  }, fsIdx + 1, "/", imgs.length)));
}

/* Reel post (user 2026-10-27 "add post in jane that also shows the reels similar in Katy"):
   9:16 clip plays muted inline like the Katy feed's vertical reel card (play/pause · time ·
   track · mute controls); tapping it opens a full-screen reel viewer (black stage, right-hand
   action rail, author + caption foot, progress bar) in the style of Katy's ReelMobile page. */
function ReelJN({
  p,
  author,
  liked,
  saved,
  onLike,
  onComment,
  onShare,
  onSave,
  showToast
}) {
  const vRef = useRefJN(null);
  const fsRef = useRefJN(null);
  const [playing, setPlaying] = useStateJN(true);
  const [muted, setMuted] = useStateJN(true);
  const [t, setT] = useStateJN(0);
  const [dur, setDur] = useStateJN(p.reel.dur || 30);
  const [open, setOpen] = useStateJN(false);
  const [fsPlaying, setFsPlaying] = useStateJN(true);
  const [fsT, setFsT] = useStateJN(0);
  const [heart, setHeart] = useStateJN(null);
  const lastTap = useRefJN(0);
  const fmt = x => Math.floor(x / 60) + ":" + String(Math.floor(x % 60)).padStart(2, "0");
  useEffectJN(() => {
    const v = vRef.current;
    if (!v) return;
    if (playing && !open) v.play().catch(() => {});else v.pause();
  }, [playing, open]);
  useEffectJN(() => {
    const v = fsRef.current;
    if (!v || !open) return;
    v.currentTime = t;
    if (fsPlaying) v.play().catch(() => {});else v.pause();
  }, [open, fsPlaying]);
  useEffectJN(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  const openFs = () => {
    setFsPlaying(true);
    setOpen(true);
  };
  const closeFs = () => {
    setOpen(false);
    setPlaying(true);
  };
  const fsTap = e => {
    const now = Date.now();
    const r = e.currentTarget.getBoundingClientRect();
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      if (!liked) onLike();
      setHeart({
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        k: now
      });
      setTimeout(() => setHeart(h => h && h.k === now ? null : h), 900);
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current === now) {
          lastTap.current = 0;
          setFsPlaying(v => !v);
        }
      }, 300);
    }
  };
  const Act = ({
    icon,
    label,
    on,
    active,
    color
  }) => /*#__PURE__*/React.createElement("button", {
    className: "jn-reel-act" + (active ? " on" : ""),
    onClick: e => {
      e.stopPropagation();
      on();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: active && color ? {
      background: color,
      borderColor: color
    } : undefined
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: icon,
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("small", null, label));
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-reel-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-vertical sm-reel jn-reel" + (playing ? " playing" : ""),
    onClick: openFs,
    role: "button",
    tabIndex: 0,
    "aria-label": "Open reel"
  }, /*#__PURE__*/React.createElement("video", {
    ref: vRef,
    src: p.reel.src,
    muted: muted,
    loop: true,
    playsInline: true,
    autoPlay: true,
    preload: "metadata",
    onTimeUpdate: e => setT(e.target.currentTime),
    onLoadedMetadata: e => isFinite(e.target.duration) && setDur(e.target.duration)
  }), /*#__PURE__*/React.createElement("span", {
    className: "jn-reel-chip"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "film",
    size: 12,
    color: "#fff"
  }), "Reel"), /*#__PURE__*/React.createElement("span", {
    className: "sm-bigplay" + (playing ? " hide" : "")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "play",
    size: 30,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-controls",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-ctl",
    "aria-label": playing ? "Pause" : "Play",
    onClick: () => setPlaying(v => !v)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: playing ? "pause" : "play",
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-time"
  }, fmt(t)), /*#__PURE__*/React.createElement("span", {
    className: "sm-track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-fill jn-reel-fill",
    style: {
      width: (dur ? t / dur * 100 : 0) + "%",
      animation: "none"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-time"
  }, fmt(dur)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-ctl",
    "aria-label": muted ? "Unmute" : "Mute",
    onClick: () => setMuted(m => !m)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: muted ? "volume-x" : "volume-2",
    size: 16,
    color: "#fff"
  })))), open && /*#__PURE__*/React.createElement("div", {
    className: "jn-reel-fs",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("video", {
    ref: fsRef,
    src: p.reel.src,
    muted: muted,
    loop: true,
    playsInline: true,
    autoPlay: true,
    onTimeUpdate: e => setFsT(e.target.currentTime)
  }), /*#__PURE__*/React.createElement("span", {
    className: "scrim t"
  }), /*#__PURE__*/React.createElement("span", {
    className: "scrim b"
  }), /*#__PURE__*/React.createElement("button", {
    className: "jn-reel-tap",
    "aria-label": fsPlaying ? "Pause" : "Play",
    onClick: fsTap
  }), !fsPlaying && /*#__PURE__*/React.createElement("span", {
    className: "jn-reel-play"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "play",
    size: 32,
    color: "#fff"
  })), heart && /*#__PURE__*/React.createElement("span", {
    className: "jn-reel-heart",
    key: heart.k,
    style: {
      left: heart.x,
      top: heart.y
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "heart",
    size: 88,
    color: "#F0425F"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-reel-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "gb",
    "aria-label": "Close",
    onClick: closeFs
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "x",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("b", null, "Reels"), /*#__PURE__*/React.createElement("button", {
    className: "gb",
    "aria-label": muted ? "Unmute" : "Mute",
    onClick: () => setMuted(m => !m)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: muted ? "volume-x" : "volume-2",
    size: 20,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "jn-reel-rail"
  }, /*#__PURE__*/React.createElement(Act, {
    icon: "heart",
    label: fmtN(p.likes + (liked && !p.liked ? 0 : 0)),
    on: onLike,
    active: liked,
    color: "#F0425F"
  }), /*#__PURE__*/React.createElement(Act, {
    icon: "message-circle",
    label: String(p.comments.length),
    on: () => {
      closeFs();
      onComment();
    }
  }), /*#__PURE__*/React.createElement(Act, {
    icon: "share-2",
    label: fmtN(p.shares),
    on: () => {
      closeFs();
      onShare();
    }
  }), /*#__PURE__*/React.createElement(Act, {
    icon: "bookmark",
    label: saved ? "Saved" : "Save",
    on: onSave,
    active: saved,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-reel-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: PEOPLE[p.by],
    size: 38
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, PEOPLE[p.by].name), /*#__PURE__*/React.createElement("small", null, PEOPLE[p.by].title)), /*#__PURE__*/React.createElement(RoleChip, {
    p: PEOPLE[p.by]
  })), /*#__PURE__*/React.createElement("p", null, p.text), /*#__PURE__*/React.createElement("div", {
    className: "tags"
  }, (p.tags || []).map(x => /*#__PURE__*/React.createElement("span", {
    key: x
  }, "#", x)))), /*#__PURE__*/React.createElement("span", {
    className: "jn-reel-track"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: (dur ? fsT / dur * 100 : 0) + "%"
    }
  }))));
}
function FeedPostJN({
  p,
  pinned,
  onLike,
  onReact,
  onComment,
  onShare,
  onSave,
  onPatch,
  saved,
  showToast
}) {
  const a = authorJN(p.by);
  const first = p.comments[0];
  const ref = useRefJN(null);
  const reaction = p.reaction || (p.liked ? "like" : null);
  const {
    picker,
    pick,
    cancelHide,
    scheduleHide
  } = useReactionPickerJN(ref, reaction, key => onReact(p, key));
  const {
    onTap,
    wrap,
    heartNode
  } = useDoubleTapLoveJN(() => {
    if (reaction !== "love") {
      onReact(p, "love");
      burstFromJN(likeButtonJN(ref.current), "love");
    }
  });
  const handleLike = () => {
    const willReact = !reaction;
    onLike(p);
    if (willReact) burstFromJN(likeButtonJN(ref.current), "like");
  };
  const handleComment = () => {
    const g = actionIconJN(ref.current, 1);
    if (g && g.animate) g.animate([{
      transform: "rotate(0)"
    }, {
      transform: "rotate(-17deg)"
    }, {
      transform: "rotate(13deg)"
    }, {
      transform: "rotate(-6deg)"
    }, {
      transform: "rotate(0)"
    }], {
      duration: 520,
      easing: "ease-in-out"
    });
    onComment(p);
  };
  const handleShare = () => {
    const g = actionIconJN(ref.current, 2);
    if (g && g.animate) g.animate([{
      transform: "translate(0,0) scale(1)",
      opacity: 1
    }, {
      transform: "translate(8px,-10px) scale(1.28)",
      opacity: 0.35,
      offset: 0.5
    }, {
      transform: "translate(-3px,2px) scale(1)",
      opacity: 1,
      offset: 0.78
    }, {
      transform: "translate(0,0) scale(1)",
      opacity: 1
    }], {
      duration: 560,
      easing: "cubic-bezier(.34,1.56,.64,1)"
    });
    onShare(p);
  };
  const imgs = p.imgs && p.imgs.length ? p.imgs : p.img ? [p.img] : [];
  const media = p.kind === "live" ? /*#__PURE__*/React.createElement("div", {
    className: "pf-media-bleed",
    style: {
      margin: "0 -16px"
    }
  }, /*#__PURE__*/React.createElement(LiveNowJN, {
    live: p.live,
    author: a,
    onTap: () => showToast("Joining " + a.name.split(" ")[0] + "'s live…")
  })) : p.kind === "reel" ? /*#__PURE__*/React.createElement("div", {
    className: "pf-media-bleed",
    style: {
      margin: "0 -16px"
    }
  }, /*#__PURE__*/React.createElement(ReelJN, {
    p: p,
    author: a,
    liked: !!reaction,
    saved: saved,
    onLike: handleLike,
    onComment: handleComment,
    onShare: handleShare,
    onSave: () => onSave(p),
    showToast: showToast
  })) : p.kind === "poll" ? /*#__PURE__*/React.createElement("div", {
    className: "pf-media-bleed",
    style: {
      margin: "0 -16px"
    }
  }, /*#__PURE__*/React.createElement(PollJN, {
    poll: p.poll,
    onVote: i => onPatch && onPatch(p, {
      poll: {
        ...p.poll,
        voted: i
      }
    })
  })) : p.kind === "quiz" ? /*#__PURE__*/React.createElement("div", {
    className: "pf-media-bleed",
    style: {
      margin: "0 -16px"
    }
  }, /*#__PURE__*/React.createElement(QuizJN, {
    quiz: p.quiz,
    onAnswer: i => onPatch && onPatch(p, {
      quiz: {
        ...p.quiz,
        picked: i
      }
    })
  })) : imgs.length ? /*#__PURE__*/React.createElement("div", {
    className: "pf-media-bleed",
    style: {
      margin: "0 -16px"
    }
  }, /*#__PURE__*/React.createElement(CarouselJN, {
    imgs: imgs,
    wrap: wrap
  })) : p.event ? /*#__PURE__*/React.createElement("div", {
    className: "pf-media-bleed",
    style: {
      margin: "0 -16px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-post-ev infeed",
    onClick: () => goJN("JaneEvents.html?event=" + p.event)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Skin Boosters Q&A · Live"), /*#__PURE__*/React.createElement("small", null, "Thu 29 Oct · 7:00pm · Online · Free for patients")), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 18,
    color: "var(--gray-450)"
  }))) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "post-wrap",
    id: "post-" + p.id,
    ref: ref,
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--r-md)",
      overflow: "hidden",
      padding: "0px 16px"
    }
  }, /*#__PURE__*/React.createElement(DSJN.PostCard, {
    author: a,
    time: p.kind === "live" ? /*#__PURE__*/React.createElement("span", {
      className: "pf-livenow-meta"
    }, "is live now · ", p.live.viewers, " watching") : pinned ? /*#__PURE__*/React.createElement(React.Fragment, null, p.t, /*#__PURE__*/React.createElement("span", {
      className: "pf-pin-chip"
    }, /*#__PURE__*/React.createElement(DSJN.IconifyIcon, {
      name: "fluent:pin-12-filled",
      size: 11,
      color: "var(--brand-navy)"
    }), "Pinned")) : p.t,
    body: !p.text ? null : p.bg ? /*#__PURE__*/React.createElement("div", {
      className: "pf-post-bg",
      style: {
        background: p.bg.css,
        color: p.bg.fg
      }
    }, /*#__PURE__*/React.createElement(ClampTextJN, {
      text: p.text,
      lines: 6
    })) : /*#__PURE__*/React.createElement(ClampTextJN, {
      text: p.text
    }),
    media: media,
    hashtags: (p.tags || []).map(t => JN_TAG_MAP[t]).filter(Boolean),
    liked: !!reaction,
    saved: saved,
    actioned: false,
    likes: fmtN(p.likes),
    shares: fmtN(p.shares),
    comments: String(p.comments.length),
    onLike: handleLike,
    onComment: handleComment,
    onShare: handleShare,
    onSave: () => onSave(p),
    onReport: () => showToast("Thanks, we'll take a look"),
    onReactionsClick: () => showToast(fmtN(p.likes) + " people reacted"),
    menuItems: [],
    style: {
      boxShadow: "none",
      border: "none",
      borderRadius: 0,
      background: "transparent",
      padding: "24px 8px"
    }
  }), first && /*#__PURE__*/React.createElement("div", {
    className: "comments-region cm-preview-region",
    style: {
      padding: "0px 8px 24px",
      margin: "8px 0px 0px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmt-preview",
    role: "button",
    tabIndex: 0,
    onClick: () => onComment(p)
  }, /*#__PURE__*/React.createElement(DSJN.CommentItem, {
    author: authorJN(first.by),
    text: first.text,
    likes: fmtN(first.likes || 0),
    comments: "1",
    reactions: null,
    reactionCount: null,
    replies: [],
    onCommentsClick: () => onComment(p)
  })), p.comments.length > 1 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cmt-viewmore",
    onClick: () => onComment(p)
  }, "View all ", p.comments.length, " comments")), /*#__PURE__*/React.createElement(ReactionPickerJN, {
    at: picker,
    onPick: pick,
    onEnter: cancelHide,
    onLeave: scheduleHide
  }), heartNode);
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
  const scrollRef = useRefJN(null);
  const headerRef = useRefJN(null);
  const tabsRef = useRefJN(null);
  const [headerH, setHeaderH] = useStateJN(0);
  const [tabsH, setTabsH] = useStateJN(0);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useHeaderHideJN(scrollRef);
  const {
    pull,
    dragging,
    refreshing
  } = usePullToRefreshJN(scrollRef, () => new Promise(r => setTimeout(() => {
    setFeedKey(k => k + 1);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    r();
  }, 600)));
  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const m = () => setHeaderH(el.offsetHeight);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const m = () => setTabsH(el.offsetHeight);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffectJN(() => {
    if (qJN("search") === "1") showToast("Search coming soon");
    if (qJN("posted") === "1") {
      showToast("Shared with your clinic");
      try {
        const u = new URL(location.href);
        u.searchParams.delete("posted");
        history.replaceState(null, "", u.pathname + u.search);
      } catch (e) {}
    }
  }, []);
  const onb = onbState();
  const wear = connectedWearables();
  const onbPct = onb.done ? 100 : Math.round(Object.keys(onb.answers).length / ONB_STEPS.length * 100);
  function persist(list) {
    setPosts(list);
    saveJN(POSTS_KEY, list);
  }
  function like(p) {
    const had = !!(p.reaction || p.liked);
    persist(posts.map(x => x.id === p.id ? {
      ...x,
      liked: false,
      reaction: had ? null : "like",
      likes: x.likes + (had ? -1 : 1)
    } : x));
  }
  function react(p, key) {
    const had = !!(p.reaction || p.liked);
    persist(posts.map(x => x.id === p.id ? {
      ...x,
      liked: false,
      reaction: key,
      likes: x.likes + (had ? 0 : 1)
    } : x));
  }
  function save(p) {
    const s = {
      ...saved,
      [p.id]: !saved[p.id]
    };
    setSaved(s);
    saveJN("pf-jane-saved", s);
    showToast(s[p.id] ? "Saved to My Saved" : "Removed from My Saved");
  }
  function addComment() {
    const t = cDraft.trim();
    if (!t) return;
    persist(posts.map(x => x.id === commentId ? {
      ...x,
      comments: [...x.comments, {
        by: "jane",
        text: t,
        likes: 0,
        t: "Just now"
      }]
    } : x));
    setCDraft("");
  }
  function publish() {
    const t = draft.trim();
    if (!t) return;
    persist([{
      id: "p" + Date.now(),
      by: "jane",
      t: "Just now",
      text: t,
      likes: 0,
      shares: 0,
      liked: false,
      comments: []
    }, ...posts]);
    setDraft("");
    setComposeOpen(false);
    showToast("Shared with your clinic and other patients");
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }
  const pinnedPosts = PINNED_IDS.map(id => posts.find(x => x.id === id)).filter(Boolean);
  const feed = posts.filter(x => !PINNED_IDS.includes(x.id));
  const curPost = posts.find(x => x.id === commentId);
  function patch(p, fields) {
    persist(posts.map(x => x.id === p.id ? {
      ...x,
      ...fields
    } : x));
  }
  const postProps = {
    onLike: like,
    onReact: react,
    onPatch: patch,
    onComment: p => setCommentId(p.id),
    onShare: () => showToast("Link copied"),
    onSave: save,
    showToast
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "m-screen jn-home" + (chromeHidden ? " chrome-hidden" : "") + (chromeFloat ? " chrome-float" : "")
  }, /*#__PURE__*/React.createElement(PushBannerJN, null), /*#__PURE__*/React.createElement(JNTopBar, {
    ref: headerRef,
    onMenu: () => setMenuOpen(true),
    onBell: () => setNotifOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "m-scroll",
    ref: scrollRef,
    style: {
      paddingTop: chromeHidden ? 0 : headerH,
      paddingBottom: tabsH + 34
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-pull-refresh",
    style: {
      height: pull,
      transition: dragging ? "none" : "height .25s cubic-bezier(.22,.61,.36,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-pull-spinner" + (refreshing ? " is-spinning" : ""),
    style: !refreshing ? {
      transform: "rotate(" + pull * 3.2 + "deg)"
    } : undefined
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "refresh-cw",
    size: 18,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement("main", {
    className: "feed",
    key: feedKey
  }, /*#__PURE__*/React.createElement("section", {
    className: "pf-pinned-box pf-pinned-box--m" + (pinsOpen ? " open" : ""),
    "aria-label": "Pinned posts"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-pinned-box-head",
    onClick: () => setPinsOpen(!pinsOpen),
    "aria-expanded": pinsOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-pinned-card-tag-tx"
  }, /*#__PURE__*/React.createElement(DSJN.IconifyIcon, {
    name: "fluent:pin-16-filled",
    size: 15,
    color: "#fff"
  }), "Pinned"), /*#__PURE__*/React.createElement("span", {
    className: "pf-pinned-box-avs",
    "aria-hidden": "true"
  }, pinnedPosts.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: p.id,
    className: "pf-pinned-box-av",
    style: {
      marginLeft: i ? -10 : 0
    }
  }, /*#__PURE__*/React.createElement(DSJN.Avatar, {
    name: PEOPLE[p.by].name,
    src: PEOPLE[p.by].avatar,
    size: 28
  })))), /*#__PURE__*/React.createElement("span", {
    className: "pf-pinned-box-count"
  }, pinnedPosts.length, " pinned posts"), /*#__PURE__*/React.createElement("span", {
    className: "pf-pinned-box-hint"
  }, pinsOpen ? "Hide" : "Show"), /*#__PURE__*/React.createElement("span", {
    className: "pf-pinned-box-chev"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-down",
    size: 22,
    color: "var(--brand-navy)"
  }))), pinsOpen && /*#__PURE__*/React.createElement("div", {
    className: "pf-pinned-box-list"
  }, pinnedPosts.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "pf-pinned-box-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-pinned-box-item-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-pinned-box-item-lbl"
  }, /*#__PURE__*/React.createElement(DSJN.IconifyIcon, {
    name: "fluent:pin-12-filled",
    size: 12,
    color: "var(--brand-gold)"
  }), "Pinned post")), /*#__PURE__*/React.createElement(FeedPostJN, {
    p: p,
    pinned: true,
    saved: !!saved[p.id],
    ...postProps
  }))))), !onb.done && /*#__PURE__*/React.createElement("button", {
    className: "jn-feednudge",
    onClick: () => goJN("JaneOnboarding.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "bar"
  }), /*#__PURE__*/React.createElement(JNFace, {
    p: KATY,
    size: 40
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("small", null, "From Katy, your clinician · Just now"), /*#__PURE__*/React.createElement("b", null, onbPct ? "You're " + onbPct + "% through your Health Passport" : "Set up your Health Passport before Monday"), /*#__PURE__*/React.createElement("em", null, "Finish onboarding"))), feed.map((p, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: p.id
  }, p.kind === "eventreg" ? /*#__PURE__*/React.createElement(EventRegJN, {
    p: p
  }) : /*#__PURE__*/React.createElement(FeedPostJN, {
    p: p,
    saved: !!saved[p.id],
    ...postProps
  }), i === 1 && !wear.length && /*#__PURE__*/React.createElement("button", {
    className: "jn-connect infeed",
    onClick: () => goJN("JaneWearables.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "watch",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Connect your wearables"), /*#__PURE__*/React.createElement("small", null, "Sleep, movement and nutrition feed your Health Analytics")), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 20,
    color: "rgba(255,255,255,.8)"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "You're all caught up ✨"))), /*#__PURE__*/React.createElement(JNDock, {
    ref: tabsRef,
    compact: chromeHidden,
    active: "home"
  }), /*#__PURE__*/React.createElement("button", {
    className: "m-fab" + (chromeHidden ? " m-fab-compact" : ""),
    "aria-label": "Share a Post",
    onClick: () => goJN("JaneCreatePost.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "plus",
    size: 24,
    color: "#fff"
  })), /*#__PURE__*/React.createElement(JNDrawer, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }), /*#__PURE__*/React.createElement(JNNotifPanel, {
    open: notifOpen,
    onClose: () => setNotifOpen(false)
  }), /*#__PURE__*/React.createElement(JNSheet, {
    open: composeOpen,
    onClose: () => setComposeOpen(false),
    title: "Share an update"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-compose-who"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: JANE,
    size: 36
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, JANE.name), /*#__PURE__*/React.createElement("small", null, "Visible to your clinic and other patients"))), /*#__PURE__*/React.createElement("textarea", {
    className: "jn-ta",
    rows: 5,
    placeholder: "How are you feeling? Ask a question, share progress…",
    value: draft,
    onChange: e => setDraft(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-row-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-btn ghost",
    onClick: () => showToast("Photos coming soon")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "camera",
    size: 18
  }), "Photo"), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn",
    disabled: !draft.trim(),
    onClick: publish
  }, "Post"))), /*#__PURE__*/React.createElement(JNSheet, {
    open: !!curPost,
    onClose: () => setCommentId(null),
    title: "Comments",
    tall: true
  }, curPost && /*#__PURE__*/React.createElement("div", {
    className: "jn-comments"
  }, curPost.comments.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "jn-empty"
  }, "No comments yet. Be the first."), curPost.comments.map((c, i) => /*#__PURE__*/React.createElement(DSJN.CommentItem, {
    key: i,
    author: authorJN(c.by),
    text: c.text,
    likes: fmtN(c.likes || 0),
    comments: "0",
    reactions: null,
    reactionCount: null,
    replies: [],
    style: {
      marginBottom: 16
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "jn-input-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    placeholder: "Write a comment…",
    value: cDraft,
    onChange: e => setCDraft(e.target.value),
    onKeyDown: e => e.key === "Enter" && addComment()
  }), /*#__PURE__*/React.createElement("button", {
    className: "jn-send",
    "aria-label": "Send",
    disabled: !cDraft.trim(),
    onClick: addComment
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "send",
    size: 18,
    color: "#fff"
  })))), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   PROFILE / HEALTH PASS — Katy's ProfileMobile layout (pm-ig hero: avatar +
   counts, name + seals, bio lines, chips, Edit / Share / saved / settings;
   pm-steps "Complete your Health Passport"; pm-card sections) with the Health
   Pass card kept (user, 2026-10-26); Medical history, Health documents, Calls,
   Supplements, Goals and Track your health moved to JaneHealthPass.html (2026-10-29).
   JaneProfile.html loads styles.css + mobile.css + profile-mobile.css.
   ======================================================================= */
const PROFILE_KEY = "pf-jane-profile";
const SUPPLEMENTS = [{
  n: "Vitamin D3",
  d: "2000 IU",
  f: "Daily, morning"
}, {
  n: "Omega-3",
  d: "1000 mg",
  f: "Daily with food"
}, {
  n: "Collagen peptides",
  d: "10 g",
  f: "Most days"
}];
const GOALS = [{
  t: "Sleep",
  target: "7h 30m a night",
  p: 0.82
}, {
  t: "Hydration",
  target: "2 L a day",
  p: 0.6
}, {
  t: "SPF every day",
  target: "7 of 7 days",
  p: 0.71
}];

/* Katy's app chrome on a Jane page: .m-top header (burger · logo · search ·
   bell · messages) + drawer + notifications, with the measured header height
   so the scroller can start under the absolute header. */
function useKatyChromeJN() {
  const headerRef = useRefJN(null);
  const [headerH, setHeaderH] = useStateJN(0);
  const [menuOpen, setMenuOpen] = useStateJN(false);
  const [notifOpen, setNotifOpen] = useStateJN(false);
  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const m = () => setHeaderH(el.offsetHeight);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  /* same scroll choreography as Home: past 40px the header floats, scrolling
     down hides it and compacts the dock, scrolling up brings both back */
  const scrollRef = useRefJN(null);
  const {
    hidden,
    floating
  } = useHeaderHideJN(scrollRef);
  const top = /*#__PURE__*/React.createElement(JNTopBar, {
    ref: headerRef,
    onMenu: () => setMenuOpen(true),
    onBell: () => setNotifOpen(true)
  });
  const layers = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(JNDrawer, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }), /*#__PURE__*/React.createElement(JNNotifPanel, {
    open: notifOpen,
    onClose: () => setNotifOpen(false)
  }));
  const cls = (hidden ? " chrome-hidden" : "") + (floating ? " chrome-float" : "");
  const padTop = extra => hidden ? 0 : headerH + (extra || 0);
  return {
    top,
    layers,
    headerH,
    scrollRef,
    hidden,
    floating,
    cls,
    padTop
  };
}
function QRMark() {
  const cells = useMemoJN(() => {
    let s = 7;
    const out = [];
    for (let i = 0; i < 121; i++) {
      s = (s * 9301 + 49297) % 233280;
      out.push(s / 233280 > 0.55);
    }
    return out;
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-qr",
    "aria-hidden": "true"
  }, cells.map((on, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: on ? "on" : ""
  })));
}
/* Pass photo (user, 2026-10-29): Jane can upload her own ID-style photo for the
   Health Passport card. pf-jane-pass-photo = square 400px JPEG data URL; null
   falls back to her profile picture. Changed only via the Update passport
   photo button on the Health Passport page (user, 2026-10-29: not on the card). */
const PASS_PHOTO_KEY = "pf-jane-pass-photo";
function passPhoto() {
  return readJN(PASS_PHOTO_KEY, null);
}
function readPassPhoto(file) {
  return new Promise(res => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2,
          sy = (img.height - side) / 2;
        const c = document.createElement("canvas");
        c.width = c.height = 400;
        c.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, 400, 400);
        res(c.toDataURL("image/jpeg", 0.84));
      } catch (e) {
        res(null);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      res(null);
    };
    img.src = url;
  });
}
function PassPhotoSheet({
  open,
  onClose,
  current,
  onSave,
  onRemove
}) {
  const [draft, setDraft] = useStateJN(null);
  const [busy, setBusy] = useStateJN(false);
  const fileRef = useRefJN(null);
  const camRef = useRefJN(null);
  useEffectJN(() => {
    if (open) setDraft(null);
  }, [open]);
  function pick(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    readPassPhoto(f).then(d => {
      setBusy(false);
      if (d) setDraft(d);
    });
  }
  return /*#__PURE__*/React.createElement(JNSheet, {
    open: open,
    onClose: onClose,
    title: "Your passport photo"
  }, /*#__PURE__*/React.createElement("p", {
    className: "jn-sheet-p"
  }, "Shown on your Health Passport so reception can check it's you. A clear, front-facing photo in good light works best."), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    hidden: true,
    onChange: pick
  }), /*#__PURE__*/React.createElement("input", {
    ref: camRef,
    type: "file",
    accept: "image/*",
    capture: "user",
    hidden: true,
    onChange: pick
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-pp-preview"
  }, /*#__PURE__*/React.createElement("img", {
    src: draft || current || JANE.avatar,
    alt: ""
  }), !draft && !current && /*#__PURE__*/React.createElement("small", null, "Using your profile picture"), draft && /*#__PURE__*/React.createElement("small", null, "New photo · not saved yet")), /*#__PURE__*/React.createElement("div", {
    className: "jn-doc-drop"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-doc-dropbtn",
    onClick: () => fileRef.current && fileRef.current.click(),
    disabled: busy
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "image",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("b", null, busy ? "Reading…" : "Choose a photo"), /*#__PURE__*/React.createElement("small", null, "From your library")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-doc-dropbtn",
    onClick: () => camRef.current && camRef.current.click(),
    disabled: busy
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "camera",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("b", null, "Take a photo"), /*#__PURE__*/React.createElement("small", null, "Front camera"))), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    disabled: !draft || busy,
    onClick: () => onSave(draft)
  }, "Use this photo"), current && !draft && /*#__PURE__*/React.createElement("button", {
    className: "jn-btn ghost block",
    onClick: onRemove
  }, "Use my profile picture instead"));
}

/* The navy Health Passport card — same design on the Profile page and in the
   side-menu drawer (user, 2026-10-29). Reads the saved profile name so both
   places agree; tapping it opens JaneHealthPass.html (medical history +
   documents) from the drawer; Profile and the page use HealthPassFlip (tap →
   back of the card first; Profile shows an Open Health Passport button under the card). Logo = the
   gold PROfinity Academy wordmark (user, 2026-10-29, replaced the white lockup) on the navy card. */
function HealthPassCard({
  onClick,
  prof,
  onQr,
  hint,
  className,
  photo,
  onPhoto
}) {
  const p = prof || readJN(PROFILE_KEY, {
    name: JANE.name,
    dob: JANE.dob
  });
  const onb = onbState();
  return /*#__PURE__*/React.createElement("button", {
    className: "jn-pass" + (className ? " " + className : ""),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jn-pass-logo"
  }, /*#__PURE__*/React.createElement("img", {
    className: "full gold",
    src: "assets/profinity-academy-gold.png?v=20261029b",
    alt: "PROfinity Academy"
  })), /*#__PURE__*/React.createElement("span", {
    className: "jn-pass-kind"
  }, "Health Passport")), /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-mid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jn-pass-photo" + (onPhoto ? " edit" : ""),
    role: onPhoto ? "button" : undefined,
    "aria-label": onPhoto ? "Change passport photo" : undefined,
    onClick: onPhoto ? e => {
      e.stopPropagation();
      onPhoto();
    } : undefined
  }, /*#__PURE__*/React.createElement("img", {
    src: photo === undefined ? passPhoto() || JANE.avatar : photo || JANE.avatar,
    alt: ""
  }), onPhoto && /*#__PURE__*/React.createElement("i", {
    className: "cam"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "camera",
    size: 11,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, p.name), /*#__PURE__*/React.createElement("small", null, "ID ", JANE.passId, " · DOB ", p.dob), /*#__PURE__*/React.createElement("small", {
    className: "clinic"
  }, JANE.clinic), /*#__PURE__*/React.createElement("small", {
    className: "since"
  }, "Member since ", JANE.since))));
}

/* Flip version for the Health Passport page (user, 2026-10-29): tap the card and it
   turns over like an ID card; the back = QR tile + DOB / Pass ID / Sex /
   Contact (same on Profile and the Health Passport page; Profile adds an
   Open Health Passport button under the card). `qr` prop kept for callers, no longer branches. */
function HealthPassFlip({
  prof,
  hs = {},
  bmi,
  onQr,
  onOpen,
  qr,
  flipRef,
  photo,
  onPhoto
}) {
  const [flipped, setFlipped] = useStateJN(false);
  const wrapRef = useRefJN(null);
  useEffectJN(() => {
    if (flipRef) flipRef.current = v => setFlipped(v == null ? f => !f : v);
  }, [flipRef]);
  /* The floating tab bar covers the bottom ~110px of the scroll view, so when
     the card turns over make sure its bottom row (Open Health Passport / Flip
     back) is scrolled clear of it (user, 2026-10-29 "can't click"). */
  useEffectJN(() => {
    if (!flipped || !wrapRef.current) return;
    const el = wrapRef.current;
    const sc = el.closest(".jn-scroll");
    if (!sc) return;
    const r = el.getBoundingClientRect(),
      p = sc.getBoundingClientRect();
    const over = r.bottom - (p.bottom - 118);
    if (over > 0) sc.scrollBy({
      top: over,
      behavior: "smooth"
    });
  }, [flipped]);
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-flip" + (flipped ? " flipped" : ""),
    ref: wrapRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-3d"
  }, /*#__PURE__*/React.createElement(HealthPassCard, {
    className: "face front",
    prof: prof,
    onClick: () => setFlipped(true),
    onQr: onQr,
    photo: photo,
    onPhoto: onPhoto
  }), /*#__PURE__*/React.createElement("button", {
    className: "jn-pass face back qr",
    onClick: () => setFlipped(false),
    "aria-label": "Flip back"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jn-pass-logo"
  }, /*#__PURE__*/React.createElement("img", {
    className: "full gold",
    src: "assets/profinity-academy-gold.png?v=20261029b",
    alt: "PROfinity Academy"
  })), /*#__PURE__*/React.createElement("span", {
    className: "jn-pass-kind"
  }, "Health Passport")), /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-qrwrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tile"
  }, /*#__PURE__*/React.createElement(QRMark, null)), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, prof.name), [["DOB", prof.dob], ["Pass ID", JANE.passId], ["Sex", hs.sex || "Not set"], ["Contact", prof.phone]].map(([k, v]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    className: "kv"
  }, /*#__PURE__*/React.createElement("small", null, k), /*#__PURE__*/React.createElement("i", null, v))))))), onOpen && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-btn block jn-pass-openbtn",
    onClick: onOpen
  }, "Open Health Passport", /*#__PURE__*/React.createElement(IcJN, {
    name: "arrow-right",
    size: 16,
    color: "#fff"
  })));
}

/* Dev switch (user, 2026-10-29): "what if the user is still new" — New patient
   clears every Health Passport store; Returning patient seeds a finished
   questionnaire, height & weight, two documents and Apple Health. Reloads. */
function JNDevPassRow() {
  const mode = onbState().done ? "returning" : "new";
  function set(m) {
    if (m === mode) return;
    [ONB_KEY, HSETUP_KEY, DOCS_KEY, WEAR_KEY, PASS_PHOTO_KEY].forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (e) {}
    });
    if (m === "returning") {
      saveJN(ONB_KEY, {
        done: true,
        step: ONB_STEPS.length,
        consent: true,
        answers: {
          reason: ["Lips", "Skin quality & glow"],
          history: "Once or twice",
          medical: ["Cold sores (HSV)", "Allergy to lidocaine"],
          sleep: "6–7 hours",
          habits: ["SPF every day", "2L+ water a day", "Retinol at night"],
          goals: ["Clearer, brighter skin", "A natural refresh"]
        }
      });
      saveJN(HSETUP_KEY, {
        done: true,
        method: "phone",
        height: "172",
        weight: "54",
        sex: "Female",
        emails: true,
        at: Date.now()
      });
      saveJN(DOCS_KEY, [{
        id: "d-dev-1",
        type: "blood",
        title: "Full blood count",
        date: "2026-09-30",
        by: "you",
        note: "Iron slightly low — GP suggested a supplement",
        share: true,
        file: {
          name: "fbc-sept.pdf",
          size: "PDF · 2 pages",
          kind: "pdf"
        }
      }, ...DOCS_SEED]);
      saveJN(WEAR_KEY, {
        apple: true
      });
    }
    window.location.reload();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-dev"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-dev-h"
  }, /*#__PURE__*/React.createElement("i", null), "Dev · Health Passport state"), /*#__PURE__*/React.createElement("div", {
    className: "jn-dev-chips"
  }, [["new", "New patient"], ["returning", "Returning patient"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    className: "jn-dev-chip" + (mode === k ? " on" : ""),
    onClick: () => set(k)
  }, l))), /*#__PURE__*/React.createElement("p", {
    className: "jn-dev-p"
  }, mode === "new" ? "Nothing answered yet, no documents, no wearable, profile picture on the pass." : "Questionnaire done, height & weight, two documents, Apple Health connected."));
}

/* Health documents (user, 2026-10-29): blood tests, scans, letters and other
   health history Jane uploads to her Health Passport. pf-jane-docs holds the
   metadata plus a small JPEG preview for photos (PDFs keep name + size only).
   One clinic-added treatment record is seeded so the list is never bare. */
const DOCS_KEY = "pf-jane-docs";
const DOC_TYPES = [{
  k: "blood",
  t: "Blood test",
  ic: "flask-conical",
  tint: "#fde2e4",
  c: "#c0334d"
}, {
  k: "scan",
  t: "Scan or imaging",
  ic: "scan-line",
  tint: "#e0ecff",
  c: "#2457c5"
}, {
  k: "letter",
  t: "Clinic or GP letter",
  ic: "file-text",
  tint: "#ede9ff",
  c: "#6c63ff"
}, {
  k: "prescription",
  t: "Prescription",
  ic: "pill",
  tint: "#dcfce7",
  c: "#16a34a"
}, {
  k: "vaccine",
  t: "Vaccination",
  ic: "syringe",
  tint: "#fff4d6",
  c: "#b7791f"
}, {
  k: "history",
  t: "Health history",
  ic: "clipboard-list",
  tint: "#fde8d0",
  c: "#c2410c"
}, {
  k: "other",
  t: "Other",
  ic: "paperclip",
  tint: "#e9e7f2",
  c: "#4a4573"
}];
const DOCS_SEED = [{
  id: "d-seed-1",
  type: "letter",
  title: "Treatment record · Lip filler",
  date: "2026-10-01",
  by: "clinic",
  file: {
    name: "treatment-record-1-oct.pdf",
    size: "PDF · 1 page",
    kind: "pdf"
  },
  share: true
}];
function healthDocs() {
  return readJN(DOCS_KEY, DOCS_SEED);
}
function docType(k) {
  return DOC_TYPES.find(t => t.k === k) || DOC_TYPES[DOC_TYPES.length - 1];
}
function fmtDocDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? iso : d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function fmtBytes(n) {
  return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";
}
/* Reads a picked file: photos are downscaled to a 720px JPEG preview so the
   store stays small; PDFs and anything else keep just name, size and kind. */
function readDocFile(file) {
  const base = {
    name: file.name,
    kind: /pdf/i.test(file.type) || /\.pdf$/i.test(file.name) ? "pdf" : /^image\//.test(file.type) ? "image" : "file",
    size: (/pdf/i.test(file.type) ? "PDF · " : "") + fmtBytes(file.size)
  };
  if (base.kind !== "image") return Promise.resolve(base);
  return new Promise(res => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const k = Math.min(1, 720 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        res({
          ...base,
          preview: c.toDataURL("image/jpeg", 0.78)
        });
      } catch (e) {
        res(base);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      res(base);
    };
    img.src = url;
  });
}
function DocIcon({
  type,
  size = 36,
  preview
}) {
  const t = docType(type);
  if (preview) return /*#__PURE__*/React.createElement("span", {
    className: "ic jn-doc-ic img",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: preview,
    alt: ""
  }));
  return /*#__PURE__*/React.createElement("span", {
    className: "ic jn-doc-ic",
    style: {
      background: t.tint,
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: t.ic,
    size: Math.round(size * 0.5),
    color: t.c
  }));
}
/* Bottom sheet for adding a document: choose a file / take a photo, pick a
   type, name and date it, optionally add a note, choose whether Katy sees it. */
function AddDocSheet({
  open,
  onClose,
  onSave
}) {
  const today = new Date().toISOString().slice(0, 10);
  const blank = {
    type: null,
    title: "",
    date: today,
    note: "",
    share: true,
    file: null
  };
  const [d, setD] = useStateJN(blank);
  const [busy, setBusy] = useStateJN(false);
  const fileRef = useRefJN(null);
  const camRef = useRefJN(null);
  useEffectJN(() => {
    if (open) setD(blank);
  }, [open]);
  function pick(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    readDocFile(f).then(file => {
      setBusy(false);
      setD(cur => ({
        ...cur,
        file,
        title: cur.title || f.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ")
      }));
    });
  }
  const t = d.type && docType(d.type);
  return /*#__PURE__*/React.createElement(JNSheet, {
    open: open,
    onClose: onClose,
    title: "Add a health document",
    tall: true
  }, /*#__PURE__*/React.createElement("p", {
    className: "jn-sheet-p"
  }, "Blood tests, scans, GP letters, prescriptions or anything from your health history. It's kept with your Health Passport so ", KATY.first, " has the full picture."), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "application/pdf,image/*",
    hidden: true,
    onChange: pick
  }), /*#__PURE__*/React.createElement("input", {
    ref: camRef,
    type: "file",
    accept: "image/*",
    capture: "environment",
    hidden: true,
    onChange: pick
  }), d.file ? /*#__PURE__*/React.createElement("div", {
    className: "jn-doc-picked"
  }, /*#__PURE__*/React.createElement(DocIcon, {
    type: d.type || "other",
    size: 44,
    preview: d.file.preview
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, d.file.name), /*#__PURE__*/React.createElement("small", null, d.file.size)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-doc-x",
    "aria-label": "Remove file",
    onClick: () => setD({
      ...d,
      file: null
    })
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "x",
    size: 16
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "jn-doc-drop"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-doc-dropbtn",
    onClick: () => fileRef.current && fileRef.current.click(),
    disabled: busy
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "upload",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("b", null, busy ? "Reading file…" : "Choose a file"), /*#__PURE__*/React.createElement("small", null, "PDF or photo · up to 20 MB")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-doc-dropbtn",
    onClick: () => camRef.current && camRef.current.click(),
    disabled: busy
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "camera",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("b", null, "Take a photo"), /*#__PURE__*/React.createElement("small", null, "Snap a letter or results sheet"))), /*#__PURE__*/React.createElement("div", {
    className: "jn-field"
  }, /*#__PURE__*/React.createElement("span", null, "What is it?"), /*#__PURE__*/React.createElement("div", {
    className: "jn-doc-types"
  }, DOC_TYPES.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.k,
    type: "button",
    className: "jn-chip" + (d.type === x.k ? " on" : ""),
    onClick: () => setD({
      ...d,
      type: x.k
    })
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: x.ic,
    size: 14
  }), x.t)))), /*#__PURE__*/React.createElement("label", {
    className: "jn-field"
  }, /*#__PURE__*/React.createElement("span", null, "Name"), /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    placeholder: t ? t.t + " · e.g. Full blood count" : "e.g. Full blood count",
    value: d.title,
    onChange: e => setD({
      ...d,
      title: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", {
    className: "jn-field"
  }, /*#__PURE__*/React.createElement("span", null, "Date of the test or letter"), /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    type: "date",
    max: today,
    value: d.date,
    onChange: e => setD({
      ...d,
      date: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", {
    className: "jn-field"
  }, /*#__PURE__*/React.createElement("span", null, "Note for ", KATY.first, " (optional)"), /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    placeholder: "e.g. Iron was low — GP suggested a supplement",
    value: d.note,
    onChange: e => setD({
      ...d,
      note: e.target.value
    })
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-perm jn-doc-share",
    onClick: () => setD({
      ...d,
      share: !d.share
    })
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: KATY,
    size: 30
  }), /*#__PURE__*/React.createElement("span", null, "Share with ", KATY.name, /*#__PURE__*/React.createElement("small", null, d.share ? "Visible to your clinic before your next review" : "Only you can see this document")), /*#__PURE__*/React.createElement("span", {
    className: "jn-switch" + (d.share ? " on" : "")
  }, /*#__PURE__*/React.createElement("i", null))), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    disabled: !d.file || !d.type || busy,
    onClick: () => onSave({
      id: "d" + Date.now(),
      type: d.type,
      title: d.title.trim() || (t ? t.t : "Document"),
      date: d.date || today,
      note: d.note.trim(),
      share: d.share,
      by: "you",
      file: d.file
    })
  }, "Save to my Health Passport"));
}
function ViewDocSheet({
  doc,
  onClose,
  onChange,
  onDelete
}) {
  if (!doc) return null;
  const t = docType(doc.type);
  return /*#__PURE__*/React.createElement(JNSheet, {
    open: !!doc,
    onClose: onClose,
    title: doc.title
  }, doc.file && doc.file.preview ? /*#__PURE__*/React.createElement("img", {
    className: "jn-doc-preview",
    src: doc.file.preview,
    alt: doc.title
  }) : /*#__PURE__*/React.createElement("div", {
    className: "jn-doc-preview tile",
    style: {
      background: t.tint
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: doc.file && doc.file.kind === "pdf" ? "file-text" : t.ic,
    size: 40,
    color: t.c
  }), /*#__PURE__*/React.createElement("small", null, doc.file ? doc.file.name : "No file")), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Type"), /*#__PURE__*/React.createElement("b", null, t.t)), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Date"), /*#__PURE__*/React.createElement("b", null, fmtDocDate(doc.date))), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "File"), /*#__PURE__*/React.createElement("b", null, doc.file ? doc.file.size : "—")), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Added by"), /*#__PURE__*/React.createElement("b", null, doc.by === "clinic" ? JANE.clinic : "You")), doc.note && /*#__PURE__*/React.createElement("div", {
    className: "jn-kv col"
  }, /*#__PURE__*/React.createElement("span", null, "Note for ", KATY.first), /*#__PURE__*/React.createElement("b", null, doc.note)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-perm jn-doc-share",
    onClick: () => onChange({
      ...doc,
      share: !doc.share
    })
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: KATY,
    size: 30
  }), /*#__PURE__*/React.createElement("span", null, "Share with ", KATY.name, /*#__PURE__*/React.createElement("small", null, doc.share ? "Visible to your clinic" : "Only you can see this")), /*#__PURE__*/React.createElement("span", {
    className: "jn-switch" + (doc.share ? " on" : "")
  }, /*#__PURE__*/React.createElement("i", null))), /*#__PURE__*/React.createElement("div", {
    className: "jn-row-btns",
    style: {
      marginTop: 12
    }
  }, doc.by !== "clinic" && /*#__PURE__*/React.createElement("button", {
    className: "jn-btn danger",
    onClick: () => onDelete(doc)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "trash-2",
    size: 16
  }), "Delete"), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn",
    onClick: onClose
  }, "Done")));
}
function PMCardJN({
  title,
  sub,
  href,
  onClick,
  children,
  className
}) {
  const Head = href || onClick ? "button" : "div";
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-card jn-pmc" + (className ? " " + className : "")
  }, /*#__PURE__*/React.createElement(Head, {
    className: "jn-pmc-h",
    onClick: onClick || (href ? () => goJN(href) : undefined)
  }, /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h3", null, title), sub && /*#__PURE__*/React.createElement("p", null, sub)), (href || onClick) && /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), children);
}

/* "Professional Information" on Jane's profile (user, 2026-10-29: same card as
   the clinician ProfileMobile one — PMProfessionalInfoMenu in
   profile-mobile.jsx; collapsed card with count chips, tap → slides to the
   full Services / Experience / Education / Licenses / Language list). Uses
   the pm-menu-* / pm-sec / pm-lrow styles from profile-mobile.css, which
   JaneProfile.html already loads. Seeded for Jane's own career. */
const JN_PRO = {
  services: [{
    ti: "Brand strategy",
    su: "Positioning, messaging and launch plans"
  }, {
    ti: "Social media management",
    su: "Instagram, TikTok and LinkedIn"
  }, {
    ti: "Content creation",
    su: "Short-form video, photography and copy"
  }, {
    ti: "Email campaigns",
    su: "Newsletters, automations and reporting"
  }],
  experience: [{
    ti: "Marketing Manager",
    yrs: "2021 – Present · 5 yrs",
    org: "Glow Studio",
    loc: "London, UK"
  }, {
    ti: "Marketing Executive",
    yrs: "2017 – 2021 · 4 yrs",
    org: "Boots UK",
    loc: "Nottingham, UK"
  }],
  education: [{
    logo: "UoM",
    school: "University of Manchester",
    program: "BA (Hons) Marketing",
    years: "2014 – 2017"
  }],
  licenses: ["Google Ads Search Certification", "HubSpot Inbound Marketing", "Meta Blueprint · Media Buying", "Google Analytics 4", "CIM Level 4 Certificate in Professional Marketing"],
  languages: [{
    flag: "🇬🇧",
    name: "English",
    level: "Native"
  }, {
    flag: "🇪🇸",
    name: "Spanish",
    level: "Conversational"
  }]
};
function JNSection({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title)), children);
}
function JNProfessionalInfo() {
  const d = JN_PRO;
  const [expanded, setExpanded] = useStateJN(false);
  const colRef = useRefJN(null);
  const expRef = useRefJN(null);
  const [h, setH] = useStateJN(null);
  useEffectJN(() => {
    const el = expanded ? expRef.current : colRef.current;
    if (el) setH(el.offsetHeight);
  }, [expanded]);
  useEffectJN(() => {
    const t = setTimeout(() => {
      if (colRef.current) setH(colRef.current.offsetHeight);
    }, 60);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-viewport jn-pro",
    style: h != null ? {
      height: h + "px"
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-slider" + (expanded ? " expanded" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    ref: colRef,
    className: "pm-menu-pane pm-menu-collapsed",
    "aria-label": "Professional Information — tap to view",
    onClick: () => setExpanded(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-collapsed-top"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "pm-steps-h"
  }, "Professional Information"), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-sub"
  }, "Services, Experience, Education, Licenses & Languages"), /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-tag"
  }, d.services.length, " Services"), /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-tag"
  }, d.experience.length, " Experience"), /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-tag"
  }, d.licenses.length, " Certifications"), /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-tag"
  }, d.languages.length, " Languages"))), /*#__PURE__*/React.createElement("div", {
    ref: expRef,
    className: "pm-menu-pane pm-menu-expanded"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-menu-back",
    onClick: () => setExpanded(false)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-left",
    size: 20,
    color: "var(--text-heading)"
  }), "Professional Information"), /*#__PURE__*/React.createElement(JNSection, {
    title: "Services"
  }, d.services.map((x, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, x.ti), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, x.su)))), /*#__PURE__*/React.createElement(JNSection, {
    title: "Experience"
  }, d.experience.map((x, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, x.ti), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, x.yrs), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, x.org), /*#__PURE__*/React.createElement("div", {
    className: "su flag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, "🇬🇧"), x.loc)))), /*#__PURE__*/React.createElement(JNSection, {
    title: "Education"
  }, d.education.map((x, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow media",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-logo"
  }, x.logo), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, x.school), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, x.program), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, x.years))))), /*#__PURE__*/React.createElement(JNSection, {
    title: "Licenses & Certifications"
  }, d.licenses.map((x, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow media",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-logo cert"
  }, "P"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, x), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Issued 2023"))))), /*#__PURE__*/React.createElement(JNSection, {
    title: "Language"
  }, d.languages.map((x, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lang"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, x.flag), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, x.name), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, x.level)))))))));
}
function ProfileScreen() {
  const {
    top,
    layers,
    scrollRef,
    cls,
    padTop,
    hidden
  } = useKatyChromeJN();
  const [prof, setProf] = useStateJN(() => readJN(PROFILE_KEY, {
    name: JANE.name,
    phone: "+44 7700 900123",
    email: "jane.taylor@example.com",
    dob: JANE.dob,
    location: "London, UK",
    bio: ""
  }));
  const [edit, setEdit] = useStateJN(qJN("edit") === "1");
  const [passOpen, setPassOpen] = useStateJN(qJN("pass") === "1");
  const [draft, setDraft] = useStateJN(prof);
  const myDocs = healthDocs().filter(x => x.by !== "clinic");
  const [toast, showToast] = useToastJN();
  const onb = onbState();
  const wear = connectedWearables();
  const hs = healthSetup();
  useEffectJN(() => {
    if (qJN("doc") === "1") goJN("JaneHealthPass.html?doc=1&ret=JaneProfile.html");
  }, []);
  const friends = readJN("pf-jane-friends", []);
  const myPosts = (readJN("pf-jane-posts", null) || []).filter(p => p.by === "jane");
  const going = Object.values(readJN("pf-jane-events", {
    ev1: true
  })).filter(Boolean).length;
  const steps = [{
    label: "Add a photo to your Health Passport",
    done: !!passPhoto(),
    href: "JaneHealthPass.html?photo=1&ret=JaneProfile.html"
  }, {
    label: "Answer the onboarding questions",
    done: !!onb.done,
    href: "JaneOnboarding.html"
  }, {
    label: "Tell us your height & weight",
    done: !!hs.height,
    href: "JaneHealth.html?setup=1"
  }, {
    label: "Upload a blood test or health record",
    done: myDocs.length > 0,
    href: "JaneHealthPass.html?doc=1&ret=JaneProfile.html"
  }, {
    label: "Connect a wearable",
    done: wear.length > 0,
    href: "JaneWearables.html"
  }, {
    label: "Share your Health Passport with Katy",
    done: onb.consent !== false && !!onb.done,
    href: "JaneOnboarding.html"
  }, {
    label: "Add a friend",
    done: friends.length > 0,
    href: "JaneHealth.html"
  }];
  const doneN = steps.filter(s => s.done).length;
  const pct = Math.round(doneN / steps.length * 100);
  const next = steps.find(s => !s.done);
  const seals = ["gb", ...(onb.done ? ["verified"] : [])];
  function save() {
    setProf(draft);
    saveJN(PROFILE_KEY, draft);
    setEdit(false);
    showToast("Profile updated");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen m-screen jn-prof-screen" + cls
  }, top, /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll",
    ref: scrollRef,
    style: {
      paddingTop: padTop(0)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-top"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-ig-avwrap pm-ig-avbtn",
    "aria-label": "View profile picture",
    onClick: () => setPassOpen(true)
  }, /*#__PURE__*/React.createElement(DSJN.Avatar, {
    name: prof.name,
    src: JANE.avatar,
    size: 92,
    className: "pm-ig-av"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, myPosts.length), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "posts")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, friends.length), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "friends")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, going), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "events")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, prof.name), /*#__PURE__*/React.createElement(DSJN.VerificationSeals, {
    seals: seals,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-bio"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "🇬🇧"), " Patient at ", JANE.clinic, " · with ", KATY.name), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "💉"), " Lip filler · Skin boosters · SPF every day"), /*#__PURE__*/React.createElement("p", {
    className: "pm-ig-live",
    onClick: () => goJN("JaneScheduleCall.html?ret=JaneProfile.html"),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar",
    size: 14,
    color: "var(--text-primary)"
  })), "Next review: ", /*#__PURE__*/React.createElement("b", null, "Tue 3 Nov · 2:30pm")), prof.bio && /*#__PURE__*/React.createElement("p", null, prof.bio)), /*#__PURE__*/React.createElement("div", {
    className: "jn-chiprow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-chip pin"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "map-pin",
    size: 16,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, prof.location || "London, UK")), /*#__PURE__*/React.createElement("span", {
    className: "pm-chip pin"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "building-2",
    size: 16,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, JANE.clinic)), /*#__PURE__*/React.createElement("button", {
    className: "pm-chip add",
    onClick: () => {
      setDraft(prof);
      setEdit(true);
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "plus",
    size: 16
  }), "Add")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn",
    onClick: () => {
      setDraft(prof);
      setEdit(true);
    }
  }, "Edit Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn",
    onClick: () => setPassOpen(true)
  }, "Share Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn icon",
    "aria-label": "My Saved",
    onClick: () => goJN("JaneNewsfeed.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "bookmark",
    size: 20,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn icon",
    "aria-label": "Settings",
    onClick: () => showToast("Settings coming soon")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "settings",
    size: 20,
    color: "var(--text-heading)"
  })))), false && /*#__PURE__*/React.createElement("button", {
    className: "pm-steps jn-steps",
    onClick: () => next && (next.open ? next.open() : goJN(next.href || "JaneOnboarding.html"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-collapsed-top"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "pm-steps-h"
  }, "Complete your Health Passport"), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-sub"
  }, doneN, " of ", steps.length, " complete · so Katy can tailor your care"), /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-track",
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-steps-fill",
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-pct"
  }, pct, "% complete"), next ? /*#__PURE__*/React.createElement("span", {
    className: "pm-steps-next jn-steps-next"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-steps-next-lb"
  }, "Next step"), /*#__PURE__*/React.createElement("span", {
    className: "pm-steps-next-ti"
  }, next.label), /*#__PURE__*/React.createElement(IcJN, {
    name: "arrow-right",
    size: 16,
    color: "var(--text-heading)"
  })) : /*#__PURE__*/React.createElement("span", {
    className: "pm-steps-next jn-steps-next done"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 16,
    color: "var(--success)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-steps-next-ti"
  }, "All set — your Health Passport is active"))), /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-wrap"
  }, /*#__PURE__*/React.createElement(HealthPassFlip, {
    prof: prof,
    hs: hs,
    bmi: (() => {
      const h = parseFloat(hs.height),
        w = parseFloat(hs.weight);
      return h > 0 && w > 0 ? (w / Math.pow(h / 100, 2)).toFixed(1) : null;
    })(),
    onQr: () => setPassOpen(true),
    onOpen: () => goJN("JaneHealthPass.html?ret=JaneProfile.html")
  }), !onb.done && /*#__PURE__*/React.createElement("button", {
    className: "jn-link-row",
    onClick: () => goJN("JaneOnboarding.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "alert-circle",
    size: 16,
    color: "var(--warning)"
  }), "Complete the onboarding questionnaire to activate your pass", /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 16
  }))), /*#__PURE__*/React.createElement(PMCardJN, {
    title: "Activity",
    sub: myPosts.length ? myPosts.length + " recent posts & updates" : "Nothing shared yet",
    href: "JaneNewsfeed.html"
  }, myPosts.slice(0, 3).map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "jn-act-row"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: JANE,
    size: 26
  }), /*#__PURE__*/React.createElement("b", null, JANE.name), /*#__PURE__*/React.createElement("span", null, p.text.slice(0, 48), p.text.length > 48 ? "…" : ""), /*#__PURE__*/React.createElement("em", null, p.t)))), /*#__PURE__*/React.createElement(PMCardJN, {
    title: "Connected apps & devices",
    sub: wear.length ? "Synced a few minutes ago" : "Connect Apple Health, Oura, Fitbit and more",
    href: "JaneWearables.html"
  }), /*#__PURE__*/React.createElement(JNProfessionalInfo, null), /*#__PURE__*/React.createElement("button", {
    className: "pm-logout",
    onClick: () => showToast("Logged out (demo)")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "log-out",
    size: 20,
    color: "var(--error)"
  }), "Logout"), /*#__PURE__*/React.createElement(JNDevPassRow, null), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "PROfinity · patient app")), /*#__PURE__*/React.createElement(JNTabs, {
    active: "profile",
    compact: hidden
  }), layers, /*#__PURE__*/React.createElement(JNSheet, {
    open: edit,
    onClose: () => setEdit(false),
    title: "Edit profile"
  }, [["name", "Full name"], ["dob", "Date of birth"], ["location", "Location"], ["phone", "Phone"], ["email", "Email"], ["bio", "Bio"]].map(([k, l]) => /*#__PURE__*/React.createElement("label", {
    key: k,
    className: "jn-field"
  }, /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    value: draft[k] || "",
    onChange: e => setDraft({
      ...draft,
      [k]: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    onClick: save
  }, "Save changes")), /*#__PURE__*/React.createElement(JNSheet, {
    open: passOpen,
    onClose: () => setPassOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-passqr"
  }, /*#__PURE__*/React.createElement(QRMark, null), /*#__PURE__*/React.createElement("b", null, prof.name), /*#__PURE__*/React.createElement("small", null, "Health Passport ", JANE.passId), /*#__PURE__*/React.createElement("p", null, "Show this at reception. It gives ", JANE.clinic, " your medical history, consent, treatment record and the documents you've shared."), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    onClick: () => setPassOpen(false)
  }, "Done"))), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   HEALTH PASSPORT PAGE — JaneHealthPass.html (PF_JN_PAGE="pass")
   Tapping the navy Health Passport card (Profile + drawer) lands here (user,
   2026-10-29): the pass itself, who it's shared with, Jane's medical
   history (onboarding answers + height/weight + treatment timeline) and her
   health documents with upload. ?doc=1 opens the add sheet, ?pass=1 the QR
   sheet, ?ret= is where Back goes. Same pf-jane-* stores as Profile.
   ======================================================================= */
const TREATMENTS_JN = [{
  id: "tr-next",
  date: "2026-11-03",
  time: "2:30pm",
  title: "Review appointment",
  by: "katy",
  note: "Check how the lips have settled and plan the next step.",
  upcoming: true
}, {
  id: "tr-2",
  date: "2026-10-01",
  title: "Lip filler · 0.5 ml",
  by: "katy",
  note: "Hyaluronic acid filler, lidocaine-free. Aftercare: no pressure or heat for 48h, SPF daily.",
  docId: "d-seed-1"
}, {
  id: "tr-1",
  date: "2026-09-18",
  title: "Consultation & consent",
  by: "katy",
  note: "Skin assessment, treatment plan agreed, consent form signed in clinic."
}, {
  id: "tr-0",
  date: "2026-06-12",
  title: "Joined Pearce Aesthetics",
  by: "reception",
  note: "Health Passport created · ID " + JANE.passId + "."
}];
function HealthPassScreen() {
  const ret = qJN("ret") || "JaneProfile.html";
  const prof = readJN(PROFILE_KEY, {
    name: JANE.name,
    dob: JANE.dob,
    phone: "+44 7700 900123",
    email: "jane.taylor@example.com",
    location: "London, UK"
  });
  const [onb, setOnb] = useStateJN(onbState);
  const hs = healthSetup();
  const wear = connectedWearables();
  const [docs, setDocs] = useStateJN(healthDocs);
  const [docSheet, setDocSheet] = useStateJN(qJN("doc") === "1" ? "add" : null);
  const flipRef = useRefJN(null);
  const [photo, setPhoto] = useStateJN(passPhoto);
  const [photoOpen, setPhotoOpen] = useStateJN(qJN("photo") === "1");
  const [filt, setFilt] = useStateJN("all");
  const [tlAll, setTlAll] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const scrollRef = useRefJN(null);
  const docsRef = useRefJN(null);
  useEffectJN(() => {
    if (qJN("pass") === "1") setTimeout(() => flipRef.current && flipRef.current(true), 350);
  }, []);
  useEffectJN(() => {
    if (qJN("docs") === "1" && docsRef.current && scrollRef.current) scrollRef.current.scrollTop = docsRef.current.offsetTop - 12;
  }, []);
  function setDocsSave(next) {
    setDocs(next);
    saveJN(DOCS_KEY, next);
  }
  const a = onb.answers || {};
  const medical = a.medical || [];
  const myDocs = docs.filter(x => x.by !== "clinic");
  const sharedN = docs.filter(x => x.share).length;
  const shared = onb.consent !== false;
  const h = parseFloat(hs.height),
    w = parseFloat(hs.weight);
  const bmi = h > 0 && w > 0 ? (w / Math.pow(h / 100, 2)).toFixed(1) : null;
  const shown = docs.filter(x => filt === "all" || (filt === "shared" ? x.share : filt === "private" ? !x.share : x.type === filt)).sort((x, y) => (y.date || "").localeCompare(x.date || ""));
  const typesUsed = DOC_TYPES.filter(t => docs.some(x => x.type === t.k));
  function toggleShare() {
    const next = {
      ...onb,
      consent: !shared
    };
    setOnb(next);
    saveJN(ONB_KEY, next);
    showToast(!shared ? "Health Passport shared with " + KATY.first : "Health Passport is now private");
  }
  const fmtTr = iso => {
    const d = new Date(iso + "T12:00:00");
    return WD[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen jn-hp"
  }, /*#__PURE__*/React.createElement(JNBar, {
    title: "Health Passport",
    back: () => goJN(ret),
    trailing: /*#__PURE__*/React.createElement("button", {
      className: "jn-iconbtn sm",
      "aria-label": "Show QR code",
      onClick: () => {
        flipRef.current && flipRef.current();
        scrollRef.current && (scrollRef.current.scrollTop = 0);
      }
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "qr-code",
      size: 20,
      color: "var(--brand-navy)"
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-wrap hp"
  }, /*#__PURE__*/React.createElement(HealthPassFlip, {
    prof: prof,
    hs: hs,
    qr: true,
    flipRef: flipRef,
    onQr: () => flipRef.current && flipRef.current(true),
    photo: photo
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-hp-photo-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-btn ghost sm",
    onClick: () => setPhotoOpen(true)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "camera",
    size: 15
  }), photo ? "Update passport photo" : "Add a passport photo")), !onb.done && /*#__PURE__*/React.createElement("button", {
    className: "jn-link-row",
    onClick: () => goJN("JaneOnboarding.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "alert-circle",
    size: 16,
    color: "var(--warning)"
  }), "Complete the onboarding questionnaire to activate your pass", /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-hp-stats"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-hp-stat",
    onClick: () => docsRef.current && scrollRef.current && (scrollRef.current.scrollTop = docsRef.current.offsetTop - 12)
  }, /*#__PURE__*/React.createElement("b", null, docs.length), /*#__PURE__*/React.createElement("span", null, "Documents")), /*#__PURE__*/React.createElement("button", {
    className: "jn-hp-stat",
    onClick: () => {
      setFilt("shared");
      docsRef.current && scrollRef.current && (scrollRef.current.scrollTop = docsRef.current.offsetTop - 12);
    }
  }, /*#__PURE__*/React.createElement("b", null, sharedN), /*#__PURE__*/React.createElement("span", null, "Shared")), /*#__PURE__*/React.createElement("button", {
    className: "jn-hp-stat",
    onClick: () => goJN("JaneScheduleCall.html?ret=" + encodeURIComponent("JaneHealthPass.html"))
  }, /*#__PURE__*/React.createElement("b", null, TREATMENTS_JN.filter(t => !t.upcoming && t.by !== "reception").length), /*#__PURE__*/React.createElement("span", null, "Clinic visits"))), /*#__PURE__*/React.createElement("section", {
    className: "jn-card jn-hp-share"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: KATY,
    size: 44
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, shared ? "Shared with " + KATY.name : "Not shared with your clinic"), /*#__PURE__*/React.createElement("small", null, shared ? KATY.first + " sees your history, answers and the documents you've marked Shared." : "Turn on sharing so " + KATY.first + " has your history before your next visit.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "jn-switch" + (shared ? " on" : ""),
    role: "switch",
    "aria-checked": shared,
    "aria-label": "Share Health Passport",
    onClick: toggleShare
  }, /*#__PURE__*/React.createElement("i", null))), /*#__PURE__*/React.createElement(PMCardJN, {
    title: "Medical history",
    sub: onb.done ? "From your onboarding answers · shared only with " + KATY.first : "Answer the questionnaire to fill this in",
    onClick: () => goJN("JaneOnboarding.html"),
    className: "jn-mh"
  }, (() => {
    const flags = medical.filter(m => m !== "No known allergies");
    const none = medical.includes("No known allergies");
    const st = flags.length ? "warn" : none ? "ok" : "empty";
    return /*#__PURE__*/React.createElement("div", {
      className: "jn-mh-alert " + st
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: st === "warn" ? "alert-circle" : st === "ok" ? "shield-check" : "clipboard-list",
      size: 20,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("div", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, st === "warn" ? (flags.length === 1 ? "1 thing" : flags.length + " things") + " " + KATY.first + " should know" : st === "ok" ? "No known allergies" : "Allergies & conditions"), /*#__PURE__*/React.createElement("small", null, st === "warn" ? "Flagged before every treatment" : st === "ok" ? "Nothing flagged for your treatments" : "Tell us about allergies, conditions or medication"), flags.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "jn-tags"
    }, flags.map(m => /*#__PURE__*/React.createElement("span", {
      key: m,
      className: "jn-tag warn"
    }, m)))));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "jn-mh-grid"
  }, [["syringe", "#ede9ff", "#6c63ff", "Previous treatments", a.history], ["target", "#fff4d6", "#b7791f", "Reason for visiting", (a.reason || []).join(", ")], ["moon", "#e0ecff", "#2457c5", "Sleep", a.sleep], ["scale", "#dcfce7", "#16a34a", "Height · Weight", hs.height ? hs.height + " cm · " + hs.weight + " kg" + (bmi ? " · BMI " + bmi : "") : ""]].map(([ic, tint, c, l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    className: "jn-mh-tile" + (v ? "" : " empty")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: {
      background: tint
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: ic,
    size: 18,
    color: c
  })), /*#__PURE__*/React.createElement("small", null, l), /*#__PURE__*/React.createElement("b", null, v || "Not answered")))), (a.habits || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "jn-mh-habits"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "sun",
    size: 14
  }), "Daily habits"), /*#__PURE__*/React.createElement("div", {
    className: "jn-tags"
  }, a.habits.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    className: "jn-tag"
  }, m)))), /*#__PURE__*/React.createElement("div", {
    className: "jn-mh-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "upd"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "clock",
    size: 13
  }), onb.done ? "Reviewed at every visit" : "Takes about 2 minutes"), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm",
    onClick: () => goJN("JaneOnboarding.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "pencil",
    size: 14
  }), onb.done ? "Update answers" : "Start questionnaire"))), /*#__PURE__*/React.createElement(PMCardJN, {
    title: "Treatment history",
    sub: "At " + JANE.clinic
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-hp-tl"
  }, (tlAll ? TREATMENTS_JN : TREATMENTS_JN.slice(0, 3)).map(t => {
    const p = PEOPLE[t.by];
    const doc = t.docId && docs.find(x => x.id === t.docId);
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      className: "jn-hp-tli" + (t.upcoming ? " next" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: t.upcoming ? "calendar" : "check",
      size: 12,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("div", {
      className: "bx"
    }, /*#__PURE__*/React.createElement("small", null, t.upcoming ? "Next · " : "", fmtTr(t.date), t.time ? " · " + t.time : ""), /*#__PURE__*/React.createElement("b", null, t.title), /*#__PURE__*/React.createElement("p", null, t.note), /*#__PURE__*/React.createElement("span", {
      className: "who"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: p,
      size: 20
    }), p.name), doc && /*#__PURE__*/React.createElement("button", {
      className: "jn-hp-doclink",
      onClick: () => setDocSheet(doc.id)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "file-text",
      size: 14
    }), doc.title), t.upcoming && /*#__PURE__*/React.createElement("button", {
      className: "jn-hp-doclink",
      onClick: () => goJN("JaneScheduleCall.html?ret=" + encodeURIComponent("JaneHealthPass.html"))
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "calendar-plus",
      size: 14
    }), "Calls & appointments")));
  })), TREATMENTS_JN.length > 3 && /*#__PURE__*/React.createElement("button", {
    className: "jn-btn ghost block sm jn-hp-more",
    onClick: () => setTlAll(!tlAll)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: tlAll ? "chevron-up" : "chevron-down",
    size: 16
  }), tlAll ? "Show less" : "Show " + (TREATMENTS_JN.length - 3) + " more")), /*#__PURE__*/React.createElement(PMCardJN, {
    title: "Supplements",
    sub: SUPPLEMENTS.length + " in your plan",
    onClick: () => goJN("JaneMessages.html?to=katy")
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pmc-list"
  }, SUPPLEMENTS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    className: "jn-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "pill",
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, s.n), /*#__PURE__*/React.createElement("small", null, s.d, " · ", s.f))))), /*#__PURE__*/React.createElement("p", {
    className: "jn-hp-note"
  }, "Ask ", KATY.first, " to update your supplements.")), /*#__PURE__*/React.createElement(PMCardJN, {
    title: "Goals",
    sub: "What you're working on this quarter",
    href: "JaneHealth.html"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pmc-list"
  }, GOALS.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.t,
    className: "jn-goal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement("b", null, g.t), /*#__PURE__*/React.createElement("span", null, g.target)), /*#__PURE__*/React.createElement("div", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: g.p * 100 + "%"
    }
  }))))), (a.goals || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "jn-tags",
    style: {
      marginTop: 10
    }
  }, a.goals.map(g => /*#__PURE__*/React.createElement("span", {
    key: g,
    className: "jn-tag gold"
  }, g)))), /*#__PURE__*/React.createElement(PMCardJN, {
    title: "Track your health",
    sub: "Sleep · Movement · Nutrition · Skin check-in",
    href: "JaneHealth.html"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pmc-chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jn-tag"
  }, wear.length ? wear.map(x => x.name).join(", ") : "No wearable yet"), /*#__PURE__*/React.createElement("span", {
    className: "jn-tag"
  }, "Skin score 78"), /*#__PURE__*/React.createElement("span", {
    className: "jn-tag"
  }, "Sleep 7h 18m"))), /*#__PURE__*/React.createElement("div", {
    ref: docsRef
  }), /*#__PURE__*/React.createElement(PMCardJN, {
    title: "Health documents",
    sub: myDocs.length ? myDocs.length + " uploaded · " + sharedN + " shared with " + KATY.first : "Blood tests, scans, letters & your health history",
    className: "jn-hp-docs"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block jn-hp-upload",
    onClick: () => setDocSheet("add")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "upload",
    size: 18,
    color: "#fff"
  }), "Upload a document"), docs.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "jn-hp-filt"
  }, [["all", "All"], ["shared", "Shared"], ["private", "Private"], ...typesUsed.map(t => [t.k, t.t])].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: "jn-chip" + (filt === k ? " on" : ""),
    onClick: () => setFilt(k)
  }, l))), /*#__PURE__*/React.createElement("div", {
    className: "jn-pmc-list jn-docs"
  }, shown.map(x => {
    const t = docType(x.type);
    return /*#__PURE__*/React.createElement("button", {
      key: x.id,
      className: "jn-li",
      onClick: () => setDocSheet(x.id)
    }, /*#__PURE__*/React.createElement(DocIcon, {
      type: x.type,
      preview: x.file && x.file.preview
    }), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, x.title), /*#__PURE__*/React.createElement("small", null, t.t, " · ", fmtDocDate(x.date), x.by === "clinic" ? " · from clinic" : "")), x.share ? /*#__PURE__*/React.createElement("span", {
      className: "jn-pill soft"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "shield-check",
      size: 12
    }), "Shared") : /*#__PURE__*/React.createElement("span", {
      className: "jn-pill ghost"
    }, "Private"));
  }), !shown.length && /*#__PURE__*/React.createElement("p", {
    className: "jn-docs-empty"
  }, docs.length ? "Nothing matches this filter." : "Add blood tests, scans, GP letters, prescriptions or past treatment notes so " + KATY.first + " has the full picture before your next review."))), /*#__PURE__*/React.createElement("div", {
    className: "sc-info jn-hp-info"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "shield-check",
    size: 15,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Your Health Passport is encrypted and only visible to clinicians you share it with. Show the QR code at reception to check in.")), /*#__PURE__*/React.createElement(JNDevPassRow, null), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "PROfinity · Health Passport ", JANE.passId)), /*#__PURE__*/React.createElement(JNTabs, {
    active: "pass"
  }), /*#__PURE__*/React.createElement(PassPhotoSheet, {
    open: photoOpen,
    onClose: () => setPhotoOpen(false),
    current: photo,
    onSave: d => {
      setPhoto(d);
      saveJN(PASS_PHOTO_KEY, d);
      setPhotoOpen(false);
      showToast("Passport photo updated");
    },
    onRemove: () => {
      setPhoto(null);
      saveJN(PASS_PHOTO_KEY, null);
      setPhotoOpen(false);
      showToast("Using your profile picture");
    }
  }), /*#__PURE__*/React.createElement(AddDocSheet, {
    open: docSheet === "add",
    onClose: () => setDocSheet(null),
    onSave: doc => {
      setDocsSave([doc, ...docs]);
      setDocSheet(null);
      setFilt("all");
      showToast(doc.share ? "Added and shared with " + KATY.first : "Added to your Health Passport");
    }
  }), /*#__PURE__*/React.createElement(ViewDocSheet, {
    doc: docSheet && docSheet !== "add" ? docs.find(x => x.id === docSheet) : null,
    onClose: () => setDocSheet(null),
    onChange: doc => {
      setDocsSave(docs.map(x => x.id === doc.id ? doc : x));
      showToast(doc.share ? "Shared with " + KATY.first : "Now private");
    },
    onDelete: doc => {
      setDocsSave(docs.filter(x => x.id !== doc.id));
      setDocSheet(null);
      showToast("Document removed");
    }
  }), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
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
  const pct = Math.round((done ? total : step) / total * 100);
  function toggle(opt) {
    const prev = answers[cur.key];
    let next;
    if (cur.multi) {
      const list = Array.isArray(prev) ? prev : [];
      if (cur.key === "medical" && opt === "No known allergies") next = list.includes(opt) ? [] : [opt];else next = list.includes(opt) ? list.filter(x => x !== opt) : [...list.filter(x => !(cur.key === "medical" && x === "No known allergies")), opt];
    } else next = opt;
    const a = {
      ...answers,
      [cur.key]: next
    };
    setAnswers(a);
    saveJN(ONB_KEY, {
      answers: a,
      step,
      done: false,
      consent
    });
  }
  const answered = cur ? cur.multi ? (answers[cur.key] || []).length > 0 : !!answers[cur.key] : true;
  function next() {
    if (step < ONB_STEPS.length - 1) {
      const s = step + 1;
      setStep(s);
      saveJN(ONB_KEY, {
        answers,
        step: s,
        done: false,
        consent
      });
    } else if (step === ONB_STEPS.length - 1) setStep(ONB_STEPS.length);else {
      saveJN(ONB_KEY, {
        answers,
        step: 0,
        done: true,
        consent,
        completedAt: Date.now()
      });
      setDone(true);
    }
  }
  function back() {
    if (step === 0) goJN("JaneProfile.html");else setStep(step - 1);
  }
  if (done) return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen jn-onb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-onb-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ok"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 40,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h2", null, "Your Health Passport is ready"), /*#__PURE__*/React.createElement("p", null, "Thanks ", JANE.first, ". Katy can now see your history, goals and preferences before your next visit."), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    onClick: () => goJN("JaneProfile.html")
  }, "View my Health Passport"), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block ghost",
    onClick: () => goJN("JaneWearables.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "watch",
    size: 18
  }), "Connect your wearables")));
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen jn-onb"
  }, /*#__PURE__*/React.createElement(JNBar, {
    title: "Get to know you",
    back: back,
    trailing: /*#__PURE__*/React.createElement("button", {
      className: "jn-skip",
      onClick: () => goJN("JaneNewsfeed.html")
    }, "Later")
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-onb-prog"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("span", null, pct, "% complete")), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll"
  }, cur ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "jn-onb-step"
  }, "Question ", step + 1, " of ", ONB_STEPS.length), /*#__PURE__*/React.createElement("h2", {
    className: "jn-onb-q"
  }, cur.q), cur.sub && /*#__PURE__*/React.createElement("p", {
    className: "jn-onb-sub"
  }, cur.sub), /*#__PURE__*/React.createElement("div", {
    className: "jn-opts"
  }, cur.opts.map((o, i) => {
    const on = cur.multi ? (answers[cur.key] || []).includes(o) : answers[cur.key] === o;
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      className: "jn-opt" + (on ? " on" : ""),
      onClick: () => toggle(o)
    }, /*#__PURE__*/React.createElement("span", {
      className: "letter"
    }, String.fromCharCode(65 + i)), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, o), /*#__PURE__*/React.createElement("span", {
      className: "tick" + (cur.multi ? " sq" : "")
    }, on && /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 14,
      color: "#fff"
    })));
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "jn-onb-step"
  }, "Last step"), /*#__PURE__*/React.createElement("h2", {
    className: "jn-onb-q"
  }, "Share your answers with your clinician?"), /*#__PURE__*/React.createElement("p", {
    className: "jn-onb-sub"
  }, "Your Health Passport is private. Sharing lets ", KATY.name, " prepare for your appointments and tailor aftercare."), /*#__PURE__*/React.createElement("button", {
    className: "jn-consent" + (consent ? " on" : ""),
    onClick: () => setConsent(!consent)
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: KATY,
    size: 44
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Share with ", KATY.name), /*#__PURE__*/React.createElement("small", null, KATY.title)), /*#__PURE__*/React.createElement("span", {
    className: "jn-switch" + (consent ? " on" : "")
  }, /*#__PURE__*/React.createElement("i", null))), /*#__PURE__*/React.createElement("div", {
    className: "jn-summary"
  }, ONB_STEPS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.key,
    className: "jn-kv col"
  }, /*#__PURE__*/React.createElement("span", null, s.q), /*#__PURE__*/React.createElement("b", null, Array.isArray(answers[s.key]) ? answers[s.key].join(", ") : answers[s.key] || "—")))))), /*#__PURE__*/React.createElement("div", {
    className: "jn-onb-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    disabled: !answered,
    onClick: next
  }, cur ? "Continue" : "Finish", /*#__PURE__*/React.createElement(IcJN, {
    name: "arrow-right",
    size: 18
  }))));
}

/* =======================================================================
   CONNECT YOUR WEARABLES
   ======================================================================= */
function WearablesScreen() {
  const [state, setState] = useStateJN(wearState);
  const [sel, setSel] = useStateJN(null);
  const [perms, setPerms] = useStateJN({
    sleep: true,
    movement: true,
    nutrition: true,
    heart: true
  });
  const [busy, setBusy] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const connected = WEARABLES.filter(w => state[w.id]);
  function connect() {
    setBusy(true);
    setTimeout(() => {
      const s = {
        ...state,
        [sel.id]: {
          at: Date.now(),
          perms
        }
      };
      setState(s);
      saveJN(WEAR_KEY, s);
      setBusy(false);
      setSel(null);
      showToast(sel.name + " connected");
    }, 1400);
  }
  function disconnect(w) {
    const s = {
      ...state
    };
    delete s[w.id];
    setState(s);
    saveJN(WEAR_KEY, s);
    setSel(null);
    showToast(w.name + " disconnected");
  }
  const {
    top,
    layers,
    scrollRef,
    cls,
    padTop,
    hidden
  } = useKatyChromeJN();
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen m-screen" + cls
  }, top, /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll",
    ref: scrollRef,
    style: {
      paddingTop: padTop(8)
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-backlink",
    onClick: () => history.length > 1 ? history.back() : goJN("JaneProfile.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-left",
    size: 18
  }), "Back"), /*#__PURE__*/React.createElement("section", {
    className: "jn-wear-hero"
  }, /*#__PURE__*/React.createElement(LottieJN, {
    src: WEAR_LOTTIE_JN,
    className: "jn-wear-lottie"
  }), /*#__PURE__*/React.createElement("h2", null, "Your body, in your Health Passport"), /*#__PURE__*/React.createElement("p", null, "We read sleep, movement and nutrition only. Nothing is shared beyond your clinic, and you can disconnect any time.")), connected.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "Connected"), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
  }, connected.map(w => /*#__PURE__*/React.createElement("button", {
    key: w.id,
    className: "jn-li",
    onClick: () => setSel(w)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic tint",
    style: {
      background: w.tint
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: w.icon,
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, w.name), /*#__PURE__*/React.createElement("small", {
    className: "ok"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "check-circle-2",
    size: 12,
    color: "var(--success)"
  }), " Connected · synced just now")), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 18,
    color: "var(--gray-450)"
  }))))), /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, connected.length ? "Add another" : "Choose a device or app"), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
  }, WEARABLES.filter(w => !state[w.id]).map(w => /*#__PURE__*/React.createElement("button", {
    key: w.id,
    className: "jn-li",
    onClick: () => setSel(w)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic tint",
    style: {
      background: w.tint
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: w.icon,
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, w.name), /*#__PURE__*/React.createElement("small", null, w.sub)), /*#__PURE__*/React.createElement("span", {
    className: "jn-pill"
  }, "Connect")))), /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "What we track"), /*#__PURE__*/React.createElement("div", {
    className: "jn-track"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "moon",
    size: 20,
    color: "#6c63ff"
  }), /*#__PURE__*/React.createElement("b", null, "Sleep"), /*#__PURE__*/React.createElement("small", null, "Duration, quality, bedtime")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "footprints",
    size: 20,
    color: "#16a34a"
  }), /*#__PURE__*/React.createElement("b", null, "Movement"), /*#__PURE__*/React.createElement("small", null, "Steps, active minutes")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "droplets",
    size: 20,
    color: "#0ea5e9"
  }), /*#__PURE__*/React.createElement("b", null, "Nutrition"), /*#__PURE__*/React.createElement("small", null, "Water, logged meals"))), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "Data stays on your Health Passport · encrypted in transit")), /*#__PURE__*/React.createElement(JNTabs, {
    active: "health",
    compact: hidden
  }), layers, /*#__PURE__*/React.createElement(JNSheet, {
    open: !!sel,
    onClose: () => !busy && setSel(null),
    title: sel ? state[sel.id] ? sel.name : "Connect " + sel.name : ""
  }, sel && !state[sel.id] && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "jn-sheet-p"
  }, "PROfinity would like to read the following from ", sel.name, ":"), [["sleep", "Sleep", "moon"], ["movement", "Movement & steps", "footprints"], ["nutrition", "Nutrition & water", "droplets"], ["heart", "Heart rate", "heart-pulse"]].map(([k, l, ic]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: "jn-perm",
    onClick: () => setPerms({
      ...perms,
      [k]: !perms[k]
    })
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: ic,
    size: 18,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement("span", {
    className: "jn-switch" + (perms[k] ? " on" : "")
  }, /*#__PURE__*/React.createElement("i", null)))), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    disabled: busy,
    onClick: connect
  }, busy ? /*#__PURE__*/React.createElement("span", {
    className: "jn-spin"
  }) : /*#__PURE__*/React.createElement(IcJN, {
    name: "link",
    size: 18
  }), busy ? "Connecting…" : "Allow & connect"), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block ghost",
    disabled: busy,
    onClick: () => setSel(null)
  }, "Not now")), sel && state[sel.id] && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "jn-sheet-p"
  }, /*#__PURE__*/React.createElement("b", null, sel.name), " is connected and syncing sleep, movement and nutrition to your Health Passport."), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block ghost",
    onClick: () => {
      showToast("Syncing " + sel.name + "…");
      setSel(null);
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "refresh-cw",
    size: 18
  }), "Sync now"), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block danger",
    onClick: () => disconnect(sel)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "link-2",
    size: 18
  }), "Disconnect"))), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   HEALTH ANALYTICS
   ======================================================================= */
function Bars({
  data,
  color,
  max,
  unit,
  fmt
}) {
  const m = max || Math.max(...data) * 1.1;
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-bars"
  }, data.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "col"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      height: Math.max(6, v / m * 100) + "%",
      background: i === 6 ? color : color + "66"
    },
    title: (fmt ? fmt(v) : v) + (unit || "")
  }), /*#__PURE__*/React.createElement("span", null, DAYS[i]))));
}
function Line({
  data,
  color
}) {
  const w = 300,
    h = 90,
    min = Math.min(...data) - 5,
    max = Math.max(...data) + 5;
  const pts = data.map((v, i) => [i / (data.length - 1) * (w - 20) + 10, h - 10 - (v - min) / (max - min) * (h - 20)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return /*#__PURE__*/React.createElement("svg", {
    className: "jn-line",
    viewBox: "0 0 " + w + " " + h,
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "jnfill",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: color,
    stopOpacity: ".35"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: d + " L" + pts[pts.length - 1][0] + " " + h + " L" + pts[0][0] + " " + h + " Z",
    fill: "url(#jnfill)"
  }), /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: color,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: i === pts.length - 1 ? 4.5 : 2.5,
    fill: i === pts.length - 1 ? color : "#fff",
    stroke: color,
    strokeWidth: "2"
  })));
}
function Ring({
  value,
  size = 128,
  stroke = 11,
  color = "var(--brand-gold)",
  children
}) {
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r;
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-ring",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 " + size + " " + size
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: "var(--gray-150)",
    strokeWidth: stroke,
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: color,
    strokeWidth: stroke,
    fill: "none",
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - value),
    transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")"
  })), /*#__PURE__*/React.createElement("div", {
    className: "in"
  }, children));
}

/* First-time Health setup (user, 2026-10-23, Google Health screenshots):
   tracking method → profile info → email updates. Shown once (pf-jane-health-
   setup), ?setup=1 replays it. Choosing a watch/tracker ends on Connect your
   wearables; choosing the phone ends on Health Analytics. */
const HSETUP_KEY = "pf-jane-health-setup";
function healthSetup() {
  return readJN(HSETUP_KEY, {});
}
function HealthSetup({
  onDone
}) {
  const [step, setStep] = useStateJN(0);
  const [method, setMethod] = useStateJN(null);
  const [prof, setProf] = useStateJN({
    height: "172",
    weight: "54",
    sex: "Female"
  });
  const finish = emails => {
    const s = {
      done: true,
      method,
      ...prof,
      emails,
      at: Date.now()
    };
    saveJN(HSETUP_KEY, s);
    onDone(s);
  };
  const h = parseFloat(prof.height),
    w = parseFloat(prof.weight);
  const bmi = h > 0 && w > 0 ? (w / Math.pow(h / 100, 2)).toFixed(1) : "—";
  const STEPS = [{
    ic: "watch",
    eyebrow: "Tracking"
  }, {
    ic: "user",
    eyebrow: "About you"
  }, {
    ic: "mail",
    eyebrow: "Updates"
  }];
  const Opt = ({
    k,
    icon,
    tint,
    title,
    sub,
    chips
  }) => /*#__PURE__*/React.createElement("button", {
    className: "jn-setup-opt" + (method === k ? " on" : ""),
    onClick: () => setMethod(k),
    "aria-pressed": method === k
  }, /*#__PURE__*/React.createElement("span", {
    className: "art",
    style: {
      background: tint
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: icon,
    size: 28,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("small", null, sub), chips && /*#__PURE__*/React.createElement("span", {
    className: "chips"
  }, chips.map(c => /*#__PURE__*/React.createElement("i", {
    key: c
  }, c)))), /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, method === k && /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 14,
    color: "#fff"
  })));
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen jn-setup"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-setup-back",
    "aria-label": "Back",
    onClick: () => setStep(Math.max(0, step - 1)),
    style: {
      visibility: step ? "visible" : "hidden"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "arrow-left",
    size: 20,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "jn-setup-steps",
    "aria-label": "Step " + (step + 1) + " of 3"
  }, STEPS.map((x, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    className: i < step ? "done" : i === step ? "cur" : ""
  }))), /*#__PURE__*/React.createElement("button", {
    className: "jn-setup-skip",
    onClick: () => step === 2 ? finish(false) : setStep(step + 1)
  }, "Skip")), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jn-setup-ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: STEPS[step].ic,
    size: 26,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "jn-setup-eyebrow"
  }, "Step ", step + 1, " of 3 · ", STEPS[step].eyebrow)), step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "How would you like to track your health?"), /*#__PURE__*/React.createElement("p", {
    className: "jn-setup-sub"
  }, "Pick one to start. You can change it or add more devices any time."), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-opts"
  }, /*#__PURE__*/React.createElement(Opt, {
    k: "wearable",
    icon: "watch",
    tint: "linear-gradient(135deg,#292569,#4f47d6)",
    title: "Connect a device",
    sub: "Smartwatch, fitness tracker or smart scale",
    chips: ["Apple Watch", "Oura", "Fitbit", "Garmin"]
  }), /*#__PURE__*/React.createElement(Opt, {
    k: "phone",
    icon: "smartphone",
    tint: "linear-gradient(135deg,#0f766e,#14b8a6)",
    title: "Just my phone",
    sub: "Steps, sleep and daily check-ins with the app — no extra kit"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("b", null, "What you'll see"), /*#__PURE__*/React.createElement("span", null, "Your Health view")), /*#__PURE__*/React.createElement("div", {
    className: "tiles"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "#ede9ff"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "moon",
    size: 16,
    color: "#6c63ff"
  })), /*#__PURE__*/React.createElement("small", null, "Sleep"), /*#__PURE__*/React.createElement("b", null, "7h 18m")), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "#dcfce7"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "footprints",
    size: 16,
    color: "#16a34a"
  })), /*#__PURE__*/React.createElement("small", null, "Steps"), /*#__PURE__*/React.createElement("b", null, "8,240")), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "var(--brand-gold-100)"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "sun",
    size: 16,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("small", null, "Skin score"), /*#__PURE__*/React.createElement("b", null, "78")))), /*#__PURE__*/React.createElement("p", {
    className: "jn-setup-alt"
  }, /*#__PURE__*/React.createElement("b", null, "Want to use another method?"), " You can connect medical records from your favourite apps later.")), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Tell us about yourself"), /*#__PURE__*/React.createElement("p", {
    className: "jn-setup-sub"
  }, "PROfinity uses this to work out calories burned, cardio load and your targets. Only you and your clinic can see it."), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "jn-setup-field"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "ruler",
    size: 14
  }), "Height"), /*#__PURE__*/React.createElement("div", {
    className: "in"
  }, /*#__PURE__*/React.createElement("input", {
    inputMode: "decimal",
    value: prof.height,
    onChange: e => setProf({
      ...prof,
      height: e.target.value
    })
  }), /*#__PURE__*/React.createElement("em", null, "cm"))), /*#__PURE__*/React.createElement("label", {
    className: "jn-setup-field"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "scale",
    size: 14
  }), "Weight"), /*#__PURE__*/React.createElement("div", {
    className: "in"
  }, /*#__PURE__*/React.createElement("input", {
    inputMode: "decimal",
    value: prof.weight,
    onChange: e => setProf({
      ...prof,
      weight: e.target.value
    })
  }), /*#__PURE__*/React.createElement("em", null, "kg")))), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-field"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "user",
    size: 14
  }), "Sex"), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-seg",
    role: "radiogroup"
  }, ["Female", "Male", "Prefer not to say"].map(x => /*#__PURE__*/React.createElement("button", {
    key: x,
    type: "button",
    role: "radio",
    "aria-checked": prof.sex === x,
    className: prof.sex === x ? "on" : "",
    onClick: () => setProf({
      ...prof,
      sex: x
    })
  }, x)))), /*#__PURE__*/React.createElement("p", {
    className: "jn-setup-note"
  }, "Sex is only used for metrics like calories burned and cardio load."), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph"
  }, /*#__PURE__*/React.createElement("b", null, "We'll calculate"), /*#__PURE__*/React.createElement("span", null, "Updates as you type")), /*#__PURE__*/React.createElement("div", {
    className: "tiles"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "#e0ecff"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "activity",
    size: 16,
    color: "#2457c5"
  })), /*#__PURE__*/React.createElement("small", null, "BMI"), /*#__PURE__*/React.createElement("b", null, bmi)), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "#fde8d0"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "flame",
    size: 16,
    color: "#c2410c"
  })), /*#__PURE__*/React.createElement("small", null, "Calorie burn"), /*#__PURE__*/React.createElement("b", null, "Daily")), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "#fde2e4"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "heart-pulse",
    size: 16,
    color: "#c0334d"
  })), /*#__PURE__*/React.createElement("small", null, "Cardio load"), /*#__PURE__*/React.createElement("b", null, "Weekly"))))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Stay in the loop with PROfinity"), /*#__PURE__*/React.createElement("p", {
    className: "jn-setup-sub"
  }, "A short email now and then — never more than one a week."), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-list"
  }, [["sparkles", "#ede9ff", "#6c63ff", "New features", "Be first to try what's new in the app"], ["calendar", "var(--brand-gold-100)", "var(--brand-gold)", "Clinic events & offers", "Open evenings, lives and member-only pricing"], ["flask-conical", "#dcfce7", "#16a34a", "Skin health research", "Invitations to surveys and studies you can opt into"], ["shield-check", "#e0ecff", "#2457c5", "Unsubscribe any time", "One tap in any email, no questions asked"]].map(([ic, bg, c, t, sub]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    className: "row"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: bg
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: ic,
    size: 18,
    color: c
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, t), /*#__PURE__*/React.createElement("small", null, sub))))), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-mail"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: KATY,
    size: 34
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "From ", KATY.first, " and the ", JANE.clinic, " team"), /*#__PURE__*/React.createElement("small", null, "Sent to jane.taylor@example.com"))))), /*#__PURE__*/React.createElement("div", {
    className: "jn-setup-foot"
  }, step === 0 && /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    disabled: !method,
    onClick: () => setStep(1)
  }, "Continue", /*#__PURE__*/React.createElement(IcJN, {
    name: "arrow-right",
    size: 18
  })), step === 1 && /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    disabled: !prof.height || !prof.weight,
    onClick: () => setStep(2)
  }, "Save and continue", /*#__PURE__*/React.createElement(IcJN, {
    name: "arrow-right",
    size: 18
  })), step === 2 && /*#__PURE__*/React.createElement("div", {
    className: "jn-row-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-btn ghost",
    onClick: () => finish(false)
  }, "Not now"), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn",
    onClick: () => finish(true)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "mail",
    size: 18
  }), "Stay updated"))));
}
function HealthScreen() {
  const [setup, setSetup] = useStateJN(() => qJN("setup") === "1" || !healthSetup().done);
  if (setup) return /*#__PURE__*/React.createElement(HealthSetup, {
    onDone: st => {
      if (st.method === "wearable" && !connectedWearables().length) goJN("JaneWearables.html");else setSetup(false);
    }
  });
  return /*#__PURE__*/React.createElement(HealthDashboard, null);
}
/* Health "Today" dashboard (user, 2026-10-23, Google Health screenshots):
   centred title, three swipeable tile pages (weekly ring + Steps/Readiness/
   Sleep · Vitals/Weight/Food/Hydration/Skin/Next review · Distance/Calories/
   Exercise days/Hourly/Heart rate/Cycle), Log · Start · edit actions and the
   "Welcome! Let's get you set up" 0/4 checklist. Fresh users (nothing
   connected, no phone tracking) see zeros / Calibrating / No data; once a
   wearable or phone tracking is on, the sample week fills the tiles. */
const LOGS_KEY = "pf-jane-logs",
  CYCLE_KEY = "pf-jane-cycle",
  FRIENDS_KEY = "pf-jane-friends",
  PHONE_KEY = "pf-jane-phone-tracking",
  TILES_KEY = "pf-jane-tiles";
function HealthDashboard() {
  const hs = healthSetup();
  const wear = connectedWearables();
  const [phone, setPhone] = useStateJN(() => hs.method === "phone" || readJN(PHONE_KEY, false));
  const [logs, setLogs] = useStateJN(() => readJN(LOGS_KEY, {
    water: 0,
    weight: hs.weight || "",
    food: 0,
    skin: null
  }));
  const [cycle, setCycle] = useStateJN(() => readJN(CYCLE_KEY, null));
  const [friends, setFriends] = useStateJN(() => readJN(FRIENDS_KEY, []));
  const [hidden, setHidden] = useStateJN(() => readJN(TILES_KEY, {}));
  const [page, setPage] = useStateJN(0);
  const [listOpen, setListOpen] = useStateJN(true);
  const [sheet, setSheet] = useStateJN(null); // log | start | edit | cycle | friends
  const [workout, setWorkout] = useStateJN(null); // { kind, start }
  const [elapsed, setElapsed] = useStateJN(0);
  const [weightDraft, setWeightDraft] = useStateJN(logs.weight || "");
  const [cycleDraft, setCycleDraft] = useStateJN({
    last: "2026-10-12",
    len: 28
  });
  const [toast, showToast] = useToastJN();
  const railRef = useRefJN(null);
  const chrome = useKatyChromeJN();
  const tracking = wear.length > 0 || phone;
  useEffectJN(() => {
    if (!workout) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - workout.start) / 1000)), 1000);
    return () => clearInterval(t);
  }, [workout]);
  function saveLogs(l) {
    setLogs(l);
    saveJN(LOGS_KEY, l);
  }
  function onRail() {
    const el = railRef.current;
    if (!el) return;
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }
  function goPage(i) {
    const el = railRef.current;
    if (el) el.scrollTo({
      left: i * el.clientWidth,
      behavior: "smooth"
    });
  }
  const mmss = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  const ring = tracking ? {
    pct: 64,
    sub: "96 of 150 min",
    plus: "+12"
  } : {
    pct: 0,
    sub: "Calibrating – 7 days left",
    plus: "+0"
  };
  const tiles = {
    /* c = icon tint (mint · lav · sky · rose · gold · navy), polish 2026-10-28 */
    steps: {
      k: "steps",
      ic: "footprints",
      t: "Steps",
      v: tracking ? HEALTH.steps[6].toLocaleString() : "0",
      tone: "mint",
      c: "mint"
    },
    readiness: {
      k: "readiness",
      ic: "activity",
      t: "Readiness",
      v: tracking ? "82 · Good" : "Calibrating",
      tone: tracking ? "mint" : "grey",
      c: "sky"
    },
    sleep: {
      k: "sleep",
      ic: "moon",
      t: "Sleep",
      v: tracking ? fmtH(HEALTH.sleep[6]) : "No data",
      tone: "lav",
      c: "lav"
    },
    vitals: {
      k: "vitals",
      ic: "activity",
      t: "Vitals",
      v: tracking ? "RHR 61 bpm" : "No data",
      tone: tracking ? "mint" : "grey",
      c: "rose"
    },
    weight: {
      k: "weight",
      ic: "scale",
      t: "Weight",
      v: logs.weight ? logs.weight + " kg" : "No data",
      tone: "grey",
      navy: true,
      c: "navy",
      on: () => setSheet("log")
    },
    food: {
      k: "food",
      ic: "apple",
      t: "Food",
      v: logs.food ? logs.food + (logs.food === 1 ? " meal" : " meals") : "No data",
      tone: logs.food ? "mint" : "grey",
      c: "gold",
      on: () => setSheet("log")
    },
    water: {
      k: "water",
      ic: "glass-water",
      t: "Hydration",
      v: logs.water ? (logs.water * 250).toLocaleString() + " ml" : "No data",
      tone: logs.water ? "mint" : "grey",
      c: "sky",
      on: () => setSheet("log")
    },
    skin: {
      k: "skin",
      ic: "sun",
      t: "Skin check-in",
      v: logs.skin ? logs.skin + " / 100" : "Tap to log",
      tone: logs.skin ? "gold" : "grey",
      c: "gold",
      on: () => setSheet("log")
    },
    review: {
      k: "review",
      ic: "calendar",
      t: "Next review",
      v: "Tue 3 Nov",
      tone: "grey",
      navy: true,
      c: "navy",
      on: () => goJN("JaneScheduleCall.html?ret=JaneHealth.html")
    },
    distance: {
      k: "distance",
      ic: "map-pin",
      t: "Distance",
      v: tracking ? "7.4 km" : "0 km",
      tone: "mint",
      c: "mint"
    },
    cal: {
      k: "cal",
      ic: "flame",
      t: "Cal burned",
      v: tracking ? "1,840" : "0",
      tone: "mint",
      c: "rose"
    },
    exdays: {
      k: "exdays",
      ic: "dumbbell",
      t: "Exercise days",
      v: tracking ? "3 of 5" : "0 of 5",
      tone: "mint",
      c: "lav"
    },
    hourly: {
      k: "hourly",
      ic: "timer",
      t: "Hourly activity",
      v: tracking ? "9 of 12 hrs" : "No data",
      tone: "mint",
      c: "sky"
    },
    hr: {
      k: "hr",
      ic: "heart",
      t: "Heart rate",
      v: tracking ? "61 bpm" : "--",
      tone: "grey",
      navy: true,
      c: "rose"
    },
    cycle: {
      k: "cycle",
      ic: "flower",
      t: "Cycle health",
      v: cycle ? "Day " + cycleDay(cycle) + " · " + cyclePhase(cycle) : "Tap to set up",
      tone: cycle ? "rose" : "grey",
      c: "rose",
      on: () => setSheet("cycle")
    }
  };
  const show = keys => keys.map(k => tiles[k]).filter(t => !hidden[t.k]);
  const Tile = ({
    t,
    wide
  }) => /*#__PURE__*/React.createElement("button", {
    className: "jh-tile " + t.tone + (wide ? " wide" : "") + (t.navy ? " navy" : ""),
    onClick: t.on || (() => showToast(t.t + " · " + t.v))
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic c-" + (t.c || "navy")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: t.ic,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, t.t), /*#__PURE__*/React.createElement("span", null, t.v)));
  const checklist = [{
    k: "apps",
    ic: "layout-grid",
    art: "lav",
    t: "Connect apps to see all your data",
    sub: "Apple Health, Oura, Fitbit and more",
    done: wear.length > 0,
    on: () => goJN("JaneWearables.html")
  }, {
    k: "cycle",
    ic: "flower",
    art: "rose",
    t: "Set up cycle health tracking",
    sub: "Time treatments around your cycle",
    done: !!cycle,
    on: () => setSheet("cycle")
  }, {
    k: "phone",
    ic: "footprints",
    art: "mint",
    t: "Track steps with your phone",
    sub: "No wearable needed",
    done: phone,
    on: () => {
      setPhone(true);
      saveJN(PHONE_KEY, true);
      showToast("Phone tracking on · steps will sync from your phone");
    }
  }, {
    k: "friends",
    ic: "users",
    art: "sky",
    t: "Add friends to motivate each other",
    sub: "Cheer each other on, data stays private",
    done: friends.length > 0,
    on: () => setSheet("friends")
  }];
  const doneN = checklist.filter(c => c.done).length;
  const OTHER_JANES = ["miranda", "amir", "mark"];
  function toggleFriend(id) {
    const f = friends.includes(id) ? friends.filter(x => x !== id) : [...friends, id];
    setFriends(f);
    saveJN(FRIENDS_KEY, f);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen m-screen jh" + chrome.cls
  }, chrome.top, /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll jh-scroll",
    ref: chrome.scrollRef,
    style: {
      paddingTop: chrome.padTop(8)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "jh-title"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Health"), /*#__PURE__*/React.createElement("span", {
    className: "jh-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jh-date"
  }, new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })), /*#__PURE__*/React.createElement("span", {
    className: "jh-src" + (tracking ? " on" : "")
  }, /*#__PURE__*/React.createElement("i", null), tracking ? wear.length ? wear.map(w => w.name).join(", ") : "Phone tracking" : "Not tracking yet"))), /*#__PURE__*/React.createElement("button", {
    className: "jn-iconbtn",
    "aria-label": "Devices",
    onClick: () => goJN("JaneWearables.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "watch",
    size: 20,
    color: "var(--brand-navy)"
  }))), workout && /*#__PURE__*/React.createElement("div", {
    className: "jh-workout"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("b", null, workout.kind, " in progress"), /*#__PURE__*/React.createElement("span", {
    className: "time"
  }, mmss(elapsed)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setWorkout(null);
      showToast(workout.kind + " saved · " + mmss(elapsed));
    }
  }, "Stop")), /*#__PURE__*/React.createElement("div", {
    className: "jh-rail",
    ref: railRef,
    onScroll: onRail
  }, /*#__PURE__*/React.createElement("section", {
    className: "jh-page"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jh-ring",
    onClick: () => showToast(tracking ? "Weekly cardio · " + ring.sub : "Connect a wearable or turn on phone tracking to start")
  }, /*#__PURE__*/React.createElement(Ring, {
    value: ring.pct / 100,
    size: 178,
    stroke: 26,
    color: "var(--brand-gold)"
  }, /*#__PURE__*/React.createElement("small", {
    className: "arc"
  }, "Weekly cardio"), /*#__PURE__*/React.createElement("b", null, ring.pct, /*#__PURE__*/React.createElement("i", null, "%")), /*#__PURE__*/React.createElement("small", {
    className: "sub"
  }, ring.sub))), /*#__PURE__*/React.createElement("div", {
    className: "jh-stack"
  }, show(["steps", "readiness", "sleep"]).map(t => /*#__PURE__*/React.createElement(Tile, {
    key: t.k,
    t: t,
    wide: true
  })))), /*#__PURE__*/React.createElement("section", {
    className: "jh-page grid"
  }, show(["vitals", "weight", "food", "water", "skin", "review"]).map(t => /*#__PURE__*/React.createElement(Tile, {
    key: t.k,
    t: t
  }))), /*#__PURE__*/React.createElement("section", {
    className: "jh-page grid"
  }, show(["distance", "cal", "exdays", "hourly", "hr", "cycle"]).map(t => /*#__PURE__*/React.createElement(Tile, {
    key: t.k,
    t: t
  })))), /*#__PURE__*/React.createElement("div", {
    className: "jh-dots"
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: page === i ? "on" : "",
    "aria-label": "Page " + (i + 1),
    onClick: () => goPage(i)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "jh-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jh-act",
    onClick: () => setSheet("log")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "plus",
    size: 22
  }), "Log"), /*#__PURE__*/React.createElement("button", {
    className: "jh-act primary",
    onClick: () => setSheet("start")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "activity",
    size: 22
  }), "Start"), /*#__PURE__*/React.createElement("button", {
    className: "jh-act round",
    "aria-label": "Customise",
    onClick: () => setSheet("edit")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "pencil",
    size: 20
  }))), /*#__PURE__*/React.createElement("section", {
    className: "jh-sheet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jh-list"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jh-list-head",
    onClick: () => setListOpen(!listOpen),
    "aria-expanded": listOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, doneN === checklist.length ? "You're all set up 🎉" : "Let's get you set up"), /*#__PURE__*/React.createElement("small", null, doneN === checklist.length ? "Every step done · your Health view is complete" : doneN + " of " + checklist.length + " done · " + (checklist.length - doneN) + (checklist.length - doneN === 1 ? " quick step" : " quick steps") + " left"), /*#__PURE__*/React.createElement("span", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: Math.round(doneN / checklist.length * 100) + "%"
    }
  }))), /*#__PURE__*/React.createElement("span", {
    className: "chev"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: listOpen ? "chevron-up" : "chevron-down",
    size: 18,
    color: "var(--brand-navy)"
  }))), listOpen && checklist.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.k,
    className: "jh-item" + (c.done ? " done" : ""),
    onClick: c.on
  }, /*#__PURE__*/React.createElement("span", {
    className: "art c-" + c.art
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: c.ic,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, c.t), /*#__PURE__*/React.createElement("small", null, c.done ? "Done" : c.sub)), /*#__PURE__*/React.createElement("span", {
    className: "radio"
  }, c.done ? /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 13,
    color: "#fff"
  }) : /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 14,
    color: "var(--gray-400)"
  }))))), tracking ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "jh-sec"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "This week"), /*#__PURE__*/React.createElement("span", null, "Last 7 days")), /*#__PURE__*/React.createElement("div", {
    className: "jn-metric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: {
      background: "#ede9ff"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "moon",
    size: 18,
    color: "#6c63ff"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Sleep"), /*#__PURE__*/React.createElement("small", null, "Average ", fmtH(avg(HEALTH.sleep)), " · goal 7h 30m")), /*#__PURE__*/React.createElement("span", {
    className: "delta up"
  }, "+12%")), /*#__PURE__*/React.createElement(Bars, {
    data: HEALTH.sleep,
    color: "#6c63ff",
    max: 9,
    fmt: fmtH
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-metric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: {
      background: "#dcfce7"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "footprints",
    size: 18,
    color: "#16a34a"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Movement"), /*#__PURE__*/React.createElement("small", null, "Average ", Math.round(avg(HEALTH.steps)).toLocaleString(), " steps · goal 8,000")), /*#__PURE__*/React.createElement("span", {
    className: "delta"
  }, "−3%")), /*#__PURE__*/React.createElement(Bars, {
    data: HEALTH.steps,
    color: "#16a34a",
    max: 11000,
    fmt: v => v.toLocaleString(),
    unit: " steps"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-metric"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: {
      background: "var(--brand-gold-100)"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "sun",
    size: 18,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Skin check-in"), /*#__PURE__*/React.createElement("small", null, "Today ", logs.skin || HEALTH.skin[6], " · from your daily rating")), /*#__PURE__*/React.createElement("span", {
    className: "delta up"
  }, "+16")), /*#__PURE__*/React.createElement(Line, {
    data: HEALTH.skin,
    color: "#CE9957"
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-days"
  }, DAYS.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, d)))), /*#__PURE__*/React.createElement("button", {
    className: "jn-coachcta",
    onClick: () => goJN("JaneCoach.html?q=" + encodeURIComponent("How can I improve my hydration this week?"))
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "sparkles",
    size: 18,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("span", null, "Ask Ava how to lift your hydration score"), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 18,
    color: "var(--ai-purple)"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "jh-empty"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "trending-up",
    size: 26,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("b", null, "Your trends will appear here"), /*#__PURE__*/React.createElement("small", null, "Connect a wearable or turn on phone tracking and this view fills with your sleep, movement and skin trends.")), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "Not medical advice · talk to your clinician about any concerns"))), /*#__PURE__*/React.createElement(JNTabs, {
    active: "health",
    compact: chrome.hidden
  }), chrome.layers, /*#__PURE__*/React.createElement(JNSheet, {
    open: sheet === "log",
    onClose: () => setSheet(null),
    title: "Log"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jh-logrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic mint"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "glass-water",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Water"), /*#__PURE__*/React.createElement("small", null, logs.water, " glasses · ", (logs.water * 250).toLocaleString(), " ml today")), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm",
    onClick: () => {
      saveLogs({
        ...logs,
        water: logs.water + 1
      });
      showToast("Glass of water logged");
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "plus",
    size: 15
  }), "Glass")), /*#__PURE__*/React.createElement("div", {
    className: "jh-logrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic mint"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "apple",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Food"), /*#__PURE__*/React.createElement("small", null, logs.food, " meals logged today")), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm",
    onClick: () => {
      saveLogs({
        ...logs,
        food: logs.food + 1
      });
      showToast("Meal logged");
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "plus",
    size: 15
  }), "Meal")), /*#__PURE__*/React.createElement("div", {
    className: "jh-logrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic grey"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "scale",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Weight"), /*#__PURE__*/React.createElement("small", null, "Today's reading")), /*#__PURE__*/React.createElement("span", {
    className: "jh-wt"
  }, /*#__PURE__*/React.createElement("input", {
    inputMode: "decimal",
    value: weightDraft,
    onChange: e => setWeightDraft(e.target.value),
    placeholder: "54"
  }), /*#__PURE__*/React.createElement("em", null, "kg")), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm",
    onClick: () => {
      saveLogs({
        ...logs,
        weight: weightDraft
      });
      showToast("Weight saved");
    }
  }, "Save")), /*#__PURE__*/React.createElement("div", {
    className: "jh-logrow col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic gold"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "sun",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Skin check-in"), /*#__PURE__*/React.createElement("small", null, "How does your skin feel today?"))), /*#__PURE__*/React.createElement("div", {
    className: "jh-skin"
  }, [["😣", 40], ["😕", 55], ["🙂", 70], ["😊", 85], ["🤩", 100]].map(([e, v]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    className: logs.skin === v ? "on" : "",
    onClick: () => {
      saveLogs({
        ...logs,
        skin: v
      });
      showToast("Skin check-in saved · " + v);
    }
  }, e)))), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block ghost",
    onClick: () => setSheet(null)
  }, "Done")), /*#__PURE__*/React.createElement(JNSheet, {
    open: sheet === "start",
    onClose: () => setSheet(null),
    title: "Start an activity"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jh-kinds"
  }, [["Walk", "footprints"], ["Run", "activity"], ["Yoga", "flower"], ["Strength", "dumbbell"], ["Cycle", "bike"], ["Swim", "waves"]].map(([k, ic]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => {
      setWorkout({
        kind: k,
        start: Date.now()
      });
      setElapsed(0);
      setSheet(null);
      showToast(k + " started");
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: ic,
    size: 22
  })), k)))), /*#__PURE__*/React.createElement(JNSheet, {
    open: sheet === "edit",
    onClose: () => setSheet(null),
    title: "Customise your tiles"
  }, /*#__PURE__*/React.createElement("p", {
    className: "jn-sheet-p"
  }, "Choose what shows on your Today view."), Object.values(tiles).map(t => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    className: "jn-perm",
    onClick: () => {
      const h = {
        ...hidden,
        [t.k]: !hidden[t.k]
      };
      setHidden(h);
      saveJN(TILES_KEY, h);
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: t.ic,
    size: 18,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, t.t), /*#__PURE__*/React.createElement("span", {
    className: "jn-switch" + (!hidden[t.k] ? " on" : "")
  }, /*#__PURE__*/React.createElement("i", null)))), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    onClick: () => setSheet(null)
  }, "Done")), /*#__PURE__*/React.createElement(JNSheet, {
    open: sheet === "cycle",
    onClose: () => setSheet(null),
    title: "Cycle health tracking"
  }, /*#__PURE__*/React.createElement("p", {
    className: "jn-sheet-p"
  }, "Track your cycle so your clinician can time treatments around it. Only you and your clinic can see this."), /*#__PURE__*/React.createElement("label", {
    className: "jn-field"
  }, /*#__PURE__*/React.createElement("span", null, "First day of your last period"), /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    type: "date",
    value: cycleDraft.last,
    onChange: e => setCycleDraft({
      ...cycleDraft,
      last: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", {
    className: "jn-field"
  }, /*#__PURE__*/React.createElement("span", null, "Average cycle length (days)"), /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    inputMode: "numeric",
    value: cycleDraft.len,
    onChange: e => setCycleDraft({
      ...cycleDraft,
      len: e.target.value
    })
  })), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    onClick: () => {
      const c = {
        last: cycleDraft.last,
        len: +cycleDraft.len || 28
      };
      setCycle(c);
      saveJN(CYCLE_KEY, c);
      setSheet(null);
      showToast("Cycle tracking set up");
    }
  }, "Save"), cycle && /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block danger",
    onClick: () => {
      setCycle(null);
      saveJN(CYCLE_KEY, null);
      setSheet(null);
    }
  }, "Stop tracking")), /*#__PURE__*/React.createElement(JNSheet, {
    open: sheet === "friends",
    onClose: () => setSheet(null),
    title: "Add friends"
  }, /*#__PURE__*/React.createElement("p", {
    className: "jn-sheet-p"
  }, "Other patients at ", JANE.clinic, ". Friends can cheer each other on — your health data stays private."), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
  }, OTHER_JANES.map(id => {
    const p = PEOPLE[id];
    const on = friends.includes(id);
    return /*#__PURE__*/React.createElement("div", {
      key: id,
      className: "jn-li"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: p,
      size: 40
    }), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, p.name), /*#__PURE__*/React.createElement("small", null, p.title)), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn sm" + (on ? " going" : ""),
      onClick: () => toggleFriend(id)
    }, on ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 15
    }), "Added") : "Add"));
  })), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block ghost",
    onClick: () => setSheet(null)
  }, "Done")), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}
function cycleDay(c) {
  const d = Math.floor((Date.now() - new Date(c.last + "T00:00:00").getTime()) / 86400000);
  return (d % (c.len || 28) + (c.len || 28)) % (c.len || 28) + 1;
}
function cyclePhase(c) {
  const d = cycleDay(c),
    len = c.len || 28;
  return d <= 5 ? "Menstrual" : d <= Math.round(len / 2) ? "Follicular" : d <= Math.round(len / 2) + 2 ? "Ovulation" : "Luteal";
}

/* =======================================================================
   COACH — chat or voice, styled after the clinician Ava sheet (coach.css:
   purple gradient head, sparkle avatar, white coach bubbles, quick-action
   tiles, purple composer) + chat HISTORY (user, 2026-10-26): every
   conversation is kept in pf-jane-coach {convs:[{id,title,msgs,ts}],cur}.
   ======================================================================= */
const COACH_KEY = "pf-jane-coach";
const COACH = {
  name: "Ava",
  sub: "Reviewed by " + KATY.name
};
/* Dr Tim doctor Lottie (assets/lottie/drtim-doctor.json, same cut as DailyGoal/Katy celebrations) for the Your chats header
   avatar (user 2026-10-29 "replace the icon to DRTIM animation in Katy version"). lottie-web is loaded on demand. */
const DRTIM_LOTTIE_JN = "assets/lottie/drtim-doctor.json?v=20261014b";
const LOTTIE_LIB_JN = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
let lottieLibJN = null;
function ensureLottieJN() {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (lottieLibJN) return lottieLibJN;
  lottieLibJN = new Promise((res, rej) => {
    const el = document.createElement("script");
    el.src = LOTTIE_LIB_JN;
    el.async = true;
    el.onload = () => res(window.lottie);
    el.onerror = () => {
      lottieLibJN = null;
      rej(new Error("lottie failed"));
    };
    document.head.appendChild(el);
  });
  return lottieLibJN;
}
/* Generic on-demand Lottie host (user 2026-10-29: Wearables hero orbit → lottie.host clinician animation,
   saved as assets/lottie/wearables-hero.json). Renders nothing visible until the animation has loaded. */
const WEAR_LOTTIE_JN = "assets/lottie/wearables-hero.json?v=20261029b";
function LottieJN({
  src,
  className,
  loop = true
}) {
  const host = useRefJN(null);
  const [ok, setOk] = useStateJN(false);
  useEffectJN(() => {
    let anim,
      dead = false;
    ensureLottieJN().then(L => {
      if (dead || !host.current) return;
      anim = L.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop,
        autoplay: true,
        path: src,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet"
        }
      });
      anim.addEventListener("DOMLoaded", () => {
        if (!dead) setOk(true);
      });
    }).catch(() => {});
    return () => {
      dead = true;
      if (anim) anim.destroy();
    };
  }, [src]);
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-lottie" + (ok ? " on" : "") + (className ? " " + className : ""),
    ref: host,
    "aria-hidden": "true"
  });
}
function DrTimJN({
  size = 48
}) {
  const host = useRefJN(null);
  const [ok, setOk] = useStateJN(false);
  useEffectJN(() => {
    let anim,
      dead = false;
    ensureLottieJN().then(L => {
      if (dead || !host.current) return;
      anim = L.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: DRTIM_LOTTIE_JN
      });
      anim.addEventListener("DOMLoaded", () => {
        if (!dead) setOk(true);
      });
    }).catch(() => {});
    return () => {
      dead = true;
      if (anim) anim.destroy();
    };
  }, []);
  return /*#__PURE__*/React.createElement("span", {
    className: "jn-drtim" + (ok ? " on" : ""),
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "lot",
    ref: host
  }), /*#__PURE__*/React.createElement(IcJN, {
    name: "sparkles",
    size: Math.round(size * 0.54),
    color: "var(--ai-purple)"
  }));
}
const COACH_PROMPTS = [{
  t: "Prep me for my review on Monday",
  ic: "calendar-check"
}, {
  t: "Aftercare for lip filler",
  ic: "heart-pulse"
}, {
  t: "Build me a simple skincare routine",
  ic: "sparkles"
}, {
  t: "Help me sleep better",
  ic: "moon"
}, {
  t: "What does my skin score mean?",
  ic: "sun"
}, {
  t: "How can I drink more water?",
  ic: "droplets"
}];
function coachReply(q) {
  const s = q.toLowerCase();
  if (/appoint|review|monday|consult|prep/.test(s)) return "Your review with Katy is Tue 3 Nov at 2:30pm. Three things to bring:\n\n1. Any photos of the swelling from days 2–5\n2. The question you asked in the feed about lip hydration\n3. Your Health Passport QR (Profile → Show)\n\nWant me to add a reminder the night before?";
  if (/aftercare|filler|swell|bruis|lip/.test(s)) return "Lip filler aftercare, week 1 onwards:\n\n• Ice 10 minutes on, 10 off for the first 48h\n• No straws, hot drinks or intense exercise for 24h\n• A plain balm only — skip menthol or 'plumping' products\n• Sleep slightly propped up\n\nSwelling peaks at day 2–3 and settles by week 2. Anything hot, hard or very painful — message Katy straight away.";
  if (/routine|skin care|skincare|cleans|spf|serum/.test(s)) return "A routine you'll actually keep:\n\nAM — gentle cleanser → vitamin C or hyaluronic serum → moisturiser → SPF 50\nPM — cleanse (double if you wore SPF/makeup) → retinol 2–3 nights a week → moisturiser\n\nYou've logged SPF 5 of 7 days this week — that's the one that moves your skin score most.";
  if (/sleep|tired|energy|bed/.test(s)) return "You averaged 7h 12m this week — your best nights (Fri–Sat) had no screens after 10pm and a caffeine cut-off at 2pm. Let's make those the default:\n\n• Phone on charge outside the bedroom\n• Last coffee 2pm\n• Same wake time, even weekends\n\nI'll check your sleep trend again on Sunday.";
  if (/hydrat|water|drink/.test(s)) return "Your water intake drops on low-step days — 1.4 L on Wednesday vs 2.2 L on Thursday. Easiest fix: a 750 ml bottle finished by lunch and again by 5pm. I can nudge you at 11am and 3pm if you'd like.";
  if (/score|mean|78/.test(s)) return "Your skin score (78 today) comes from your daily selfie rating plus hydration, sleep and SPF habits. Anything over 70 means your routine is working. The biggest swing factors for you have been SPF days and sleep over 7 hours.";
  return "Noted. Based on your Health Passport, the single most useful thing this week is consistency — SPF daily and 7+ hours of sleep. Would you like a short plan, or shall I pass this to Katy before your review?";
}
function coachWelcome() {
  return {
    by: "coach",
    text: "Hi " + JANE.first + " 👋 I'm Ava, your wellness coach. I can help with aftercare, routines, sleep and getting ready for appointments. Ask me anything, or tap a quick action below.",
    ts: Date.now()
  };
}
function newConvJN() {
  return {
    id: "c" + Date.now().toString(36),
    title: "New chat",
    msgs: [coachWelcome()],
    ts: Date.now()
  };
}
const COACH_HISTORY_SEED = [{
  id: "c-seed1",
  title: "Swelling after lip filler",
  ts: Date.now() - 3 * 86400000,
  msgs: [{
    by: "coach",
    text: coachWelcome().text,
    ts: Date.now() - 3 * 86400000
  }, {
    by: "jane",
    text: "Is swelling on day 3 normal after lip filler?",
    ts: Date.now() - 3 * 86400000 + 60000
  }, {
    by: "coach",
    text: coachReply("swelling lip filler"),
    ts: Date.now() - 3 * 86400000 + 62000
  }]
}, {
  id: "c-seed2",
  title: "Skincare routine for winter",
  ts: Date.now() - 9 * 86400000,
  msgs: [{
    by: "coach",
    text: coachWelcome().text,
    ts: Date.now() - 9 * 86400000
  }, {
    by: "jane",
    text: "Can you build me a simple skincare routine for winter?",
    ts: Date.now() - 9 * 86400000 + 50000
  }, {
    by: "coach",
    text: coachReply("skincare routine"),
    ts: Date.now() - 9 * 86400000 + 53000
  }]
}];
function loadCoach() {
  const s = readJN(COACH_KEY, null);
  if (s && s.convs) return {
    ...s,
    convs: s.convs.map(c => ({
      ...c,
      msgs: c.msgs.map(m => m.by === "coach" && m.text && m.text.indexOf("I'm your wellness coach") >= 0 ? {
        ...m,
        text: m.text.replace("I'm your wellness coach", "I'm Ava, your wellness coach")
      } : m)
    }))
  };
  const legacy = s && s.msgs && s.msgs.length > 1 ? [{
    id: "c-legacy",
    title: coachTitle(s.msgs),
    msgs: s.msgs,
    ts: s.msgs[s.msgs.length - 1].ts || Date.now()
  }] : [];
  const cur = newConvJN();
  return {
    convs: [cur, ...legacy, ...COACH_HISTORY_SEED],
    cur: cur.id
  };
}
function coachTitle(msgs) {
  const m = msgs.find(x => x.by === "jane");
  return m ? m.text.length > 42 ? m.text.slice(0, 40).replace(/\s+\S*$/, "") + "…" : m.text : "New chat";
}
function fmtClockJN(ts) {
  const d = new Date(ts);
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}
function fmtWhenJN(ts) {
  const d = new Date(ts),
    n = new Date();
  if (d.toDateString() === n.toDateString()) return "Today · " + fmtClockJN(ts);
  const diff = Math.round((n - d) / 86400000);
  if (diff === 1) return "Yesterday";
  if (diff < 7) return WD[d.getDay()];
  return d.getDate() + " " + MONTHS[d.getMonth()];
}
function CoachScreen() {
  const [store, setStore] = useStateJN(loadCoach);
  const conv = store.convs.find(c => c.id === store.cur) || store.convs[0];
  const [mode, setMode] = useStateJN(qJN("mode") === "voice" ? "voice" : "chat");
  const [draft, setDraft] = useStateJN("");
  const [typing, setTyping] = useStateJN(false);
  /* History first (user, 2026-10-26): the page opens on the list of past
     chats; a chat opens from there, back returns to the list. Deep links
     (?q=, ?mode=voice) go straight into the chat. */
  const [view, setView] = useStateJN(() => qJN("q") || qJN("mode") === "voice" ? "chat" : "history");
  const [ctxOpen, setCtxOpen] = useStateJN(false);
  const [voice, setVoice] = useStateJN("idle");
  const [heard, setHeard] = useStateJN("");
  const [said, setSaid] = useStateJN("");
  const [muted, setMuted] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const scrollRef = useRefJN(null);
  const {
    hidden: chromeHidden
  } = useHeaderHideJN(scrollRef);
  const asked = useRefJN(false);
  const hs = healthSetup();
  function persist(s) {
    setStore(s);
    saveJN(COACH_KEY, s);
  }
  function updateConv(id, fn) {
    persist({
      ...store,
      convs: store.convs.map(c => c.id === id ? fn(c) : c)
    });
  }
  function append(msg, cid) {
    const id = cid || conv.id;
    const s2 = {
      ...store,
      convs: store.convs.map(c => c.id === id ? {
        ...c,
        msgs: [...c.msgs, msg],
        ts: Date.now(),
        title: c.title === "New chat" && msg.by === "jane" ? coachTitle([msg]) : c.title
      } : c)
    };
    persist(s2);
    return s2;
  }
  function send(text) {
    const t = (text || draft).trim();
    if (!t || typing) return;
    const live = readJN(COACH_KEY, store);
    const id = live.cur || conv.id;
    const s2 = {
      ...live,
      convs: live.convs.map(c => c.id === id ? {
        ...c,
        msgs: [...c.msgs, {
          by: "jane",
          text: t,
          ts: Date.now()
        }],
        ts: Date.now(),
        title: c.title === "New chat" ? coachTitle([{
          by: "jane",
          text: t
        }]) : c.title
      } : c)
    };
    persist(s2);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setStore(cur => {
        const s3 = {
          ...cur,
          convs: cur.convs.map(c => c.id === id ? {
            ...c,
            msgs: [...c.msgs, {
              by: "coach",
              text: coachReply(t),
              ts: Date.now()
            }],
            ts: Date.now()
          } : c)
        };
        saveJN(COACH_KEY, s3);
        return s3;
      });
      setTyping(false);
    }, 1100 + Math.random() * 600);
  }
  const toHistory = () => {
    const kept = store.convs.filter(c => c.msgs.length > 1);
    if (kept.length !== store.convs.length) persist({
      convs: kept.length ? kept : store.convs.slice(0, 1),
      cur: (kept[0] || store.convs[0]).id
    });
    setView("history");
    setMode("chat");
  };
  function newChat() {
    const c = newConvJN();
    persist({
      convs: [c, ...store.convs.filter(x => !(x.msgs.length <= 1 && x.id !== c.id))],
      cur: c.id
    });
    setView("chat");
    setMode("chat");
  }
  function openConv(id) {
    persist({
      ...store,
      cur: id
    });
    setView("chat");
    setMode("chat");
  }
  const [menuFor, setMenuFor] = useStateJN(null);
  const [archOpen, setArchOpen] = useStateJN(false);
  function setArchived(id, on) {
    const left = store.convs.map(c => c.id === id ? {
      ...c,
      archived: on
    } : c);
    const active = left.filter(c => !c.archived);
    const next = active.length ? left : [...left, newConvJN()];
    persist({
      convs: next,
      cur: store.cur === id && on ? (next.find(c => !c.archived) || next[0]).id : store.cur
    });
    setMenuFor(null);
    showToast(on ? "Chat archived" : "Chat restored");
  }
  function deleteConv(id) {
    const left = store.convs.filter(c => c.id !== id);
    const next = left.length ? left : [newConvJN()];
    persist({
      convs: next,
      cur: store.cur === id ? next[0].id : store.cur
    });
    setMenuFor(null);
    showToast("Chat deleted");
  }
  useEffectJN(() => {
    const q = qJN("q");
    if (q && !asked.current) {
      asked.current = true;
      setTimeout(() => send(q), 300);
    }
  }, []);
  useEffectJN(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conv && conv.msgs.length, typing, mode, store.cur]);
  function talk() {
    if (voice !== "idle") {
      setVoice("idle");
      setHeard("");
      setSaid("");
      return;
    }
    const samples = ["How should I prepare for my review appointment on Monday?", "What's the aftercare for lip filler this week?", "Can you help me sleep better?"];
    const q = samples[Math.floor(Math.random() * samples.length)];
    setVoice("listening");
    setHeard("");
    setSaid("");
    let i = 0;
    const words = q.split(" ");
    const iv = setInterval(() => {
      i++;
      setHeard(words.slice(0, i).join(" "));
      if (i >= words.length) {
        clearInterval(iv);
        setVoice("thinking");
        setTimeout(() => {
          const r = coachReply(q);
          setSaid(r);
          setVoice("speaking");
          const id = conv.id;
          setStore(cur => {
            const s3 = {
              ...cur,
              convs: cur.convs.map(c => c.id === id ? {
                ...c,
                title: c.title === "New chat" ? coachTitle([{
                  by: "jane",
                  text: q
                }]) : c.title,
                ts: Date.now(),
                msgs: [...c.msgs, {
                  by: "jane",
                  text: q,
                  ts: Date.now(),
                  voice: true
                }, {
                  by: "coach",
                  text: r,
                  ts: Date.now(),
                  voice: true
                }]
              } : c)
            };
            saveJN(COACH_KEY, s3);
            return s3;
          });
          setTimeout(() => setVoice("idle"), 6000);
        }, 1200);
      }
    }, 180);
  }
  const CoachFace = ({
    size = 28
  }) => /*#__PURE__*/React.createElement("span", {
    className: "jc-face",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "sparkles",
    size: Math.round(size * 0.55),
    color: "#fff"
  }));
  const lastCoachIdx = conv ? conv.msgs.map(m => m.by).lastIndexOf("coach") : -1;
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen jc" + (chromeHidden && mode === "chat" ? " chrome-hidden" : "") + (view === "chat" ? " jc-inchat" : ""),
    onClick: () => menuFor && setMenuFor(null)
  }, view === "chat" ? /*#__PURE__*/React.createElement("header", {
    className: "jc-head chat"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jc-hbtn",
    "aria-label": "Back to your chats",
    onClick: toHistory
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jc-head-title"
  }, /*#__PURE__*/React.createElement("b", null, conv ? conv.title : "New chat"), /*#__PURE__*/React.createElement("small", null, COACH.name, " · AI coach · Online")), /*#__PURE__*/React.createElement("span", {
    className: "jc-hmenu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jc-hbtn" + (menuFor === "head" ? " on" : ""),
    "aria-label": "Chat options",
    "aria-expanded": menuFor === "head",
    onClick: e => {
      e.stopPropagation();
      setMenuFor(menuFor === "head" ? null : "head");
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "more-vertical",
    size: 20,
    color: "var(--brand-navy)"
  })), menuFor === "head" && conv && /*#__PURE__*/React.createElement("div", {
    className: "jc-dd",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMenuFor(null);
      newChat();
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "square-pen",
    size: 16
  }), "New chat"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setArchived(conv.id, !conv.archived);
      setView("history");
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: conv.archived ? "archive-restore" : "archive",
    size: 16
  }), conv.archived ? "Unarchive" : "Archive"), /*#__PURE__*/React.createElement("button", {
    className: "danger",
    onClick: () => {
      deleteConv(conv.id);
      setView("history");
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "trash-2",
    size: 16
  }), "Delete")))) : /*#__PURE__*/React.createElement("header", {
    className: "jc-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jc-av tim"
  }, /*#__PURE__*/React.createElement(DrTimJN, {
    size: 48
  }), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "jc-head-tx"
  }, /*#__PURE__*/React.createElement("b", null, "Profinity AI Coach"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "jn-online"
  }), "Online · ", COACH.sub))), view === "history" ? /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll jc-histview",
    onClick: () => menuFor && setMenuFor(null)
  }, (() => {
    const active = store.convs.filter(c => !c.archived).slice().sort((a, b) => b.ts - a.ts);
    const archived = store.convs.filter(c => c.archived).slice().sort((a, b) => b.ts - a.ts);
    const Row = ({
      c
    }) => {
      const last = c.msgs[c.msgs.length - 1];
      const n = c.msgs.filter(m => m.by === "jane").length;
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        className: "jc-hist-row" + (c.id === store.cur && !c.archived ? " cur" : "") + (c.archived ? " archived" : "")
      }, /*#__PURE__*/React.createElement("button", {
        className: "main",
        onClick: () => openConv(c.id)
      }, /*#__PURE__*/React.createElement("span", {
        className: "tx"
      }, /*#__PURE__*/React.createElement("b", null, c.title), /*#__PURE__*/React.createElement("small", null, last ? last.text.replace(/\n+/g, " ").slice(0, 70) : ""), /*#__PURE__*/React.createElement("em", null, fmtWhenJN(c.ts), " · ", n, " ", n === 1 ? "question" : "questions"))), /*#__PURE__*/React.createElement("button", {
        className: "del" + (menuFor === c.id ? " on" : ""),
        "aria-label": "Chat options",
        "aria-expanded": menuFor === c.id,
        onClick: e => {
          e.stopPropagation();
          setMenuFor(menuFor === c.id ? null : c.id);
        }
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "more-vertical",
        size: 18,
        color: "var(--gray-450)"
      })), menuFor === c.id && /*#__PURE__*/React.createElement("div", {
        className: "jc-dd",
        onClick: e => e.stopPropagation()
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => setArchived(c.id, !c.archived)
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: c.archived ? "archive-restore" : "archive",
        size: 16
      }), c.archived ? "Unarchive" : "Archive"), /*#__PURE__*/React.createElement("button", {
        className: "danger",
        onClick: () => deleteConv(c.id)
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "trash-2",
        size: 16
      }), "Delete")));
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "jc-hist-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("h2", null, "Your chats"), /*#__PURE__*/React.createElement("span", null, active.length, " ", active.length === 1 ? "conversation" : "conversations", " · saved to your Health Passport")), /*#__PURE__*/React.createElement("button", {
      className: "jc-newbtn",
      "aria-label": "New chat",
      onClick: newChat
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "square-pen",
      size: 19,
      color: "var(--brand-navy)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "jc-hist"
    }, active.map(c => /*#__PURE__*/React.createElement(Row, {
      key: c.id,
      c: c
    }))), archived.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "jc-arch"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jc-arch-h" + (archOpen ? " open" : ""),
      onClick: () => setArchOpen(!archOpen)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "archive",
      size: 15,
      color: "var(--text-secondary)"
    }), "Archived ", /*#__PURE__*/React.createElement("em", null, archived.length), /*#__PURE__*/React.createElement(IcJN, {
      name: "chevron-down",
      size: 18,
      color: "var(--gray-450)"
    })), archOpen && /*#__PURE__*/React.createElement("div", {
      className: "jc-hist"
    }, archived.map(c => /*#__PURE__*/React.createElement(Row, {
      key: c.id,
      c: c
    })))));
  })(), /*#__PURE__*/React.createElement("p", {
    className: "jc-disc"
  }, "Not medical advice. Talk to your clinician about any concerns.")) : null, view === "chat" && /*#__PURE__*/React.createElement("div", {
    className: "jc-modes"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-seg mini"
  }, [["chat", "message-circle", "Chat"], ["voice", "mic", "Voice"]].map(([k, ic, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: mode === k ? "on" : "",
    onClick: () => setMode(k)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: ic,
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, l))))), view !== "chat" ? null : mode === "chat" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll jn-thread jc-thread",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("button", {
    className: "jc-ctx" + (ctxOpen ? " open" : ""),
    onClick: () => setCtxOpen(!ctxOpen)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "qr-code",
    size: 16,
    color: "var(--ai-purple)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "What Ava knows"), /*#__PURE__*/React.createElement("small", null, ctxOpen ? "From your Health Passport — only you and your clinic can see this." : "Lip filler · 1 Oct · Review Tue 3 Nov · Skin score 78"), ctxOpen && /*#__PURE__*/React.createElement("span", {
    className: "jc-ctx-list"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "syringe",
    size: 13
  }), "Lip filler · 1 Oct 2026"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar",
    size: 13
  }), "Review Tue 3 Nov · 2:30pm"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "sun",
    size: 13
  }), "Skin score 78 · SPF 5 of 7 days"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "moon",
    size: 13
  }), "Sleep avg 7h 12m"), hs.height && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
    name: "user",
    size: 13
  }), hs.height, " cm · ", hs.weight, " kg"))), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-down",
    size: 18,
    color: "var(--gray-450)"
  })), conv && conv.msgs.map((m, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-msg " + (m.by === "jane" ? "me" : "them")
  }, m.by !== "jane" && /*#__PURE__*/React.createElement(CoachFace, null), /*#__PURE__*/React.createElement("div", {
    className: "bub"
  }, m.voice && /*#__PURE__*/React.createElement("small", {
    className: "vc"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "mic",
    size: 11
  }), " voice"), m.text.split("\n").map((l, j) => /*#__PURE__*/React.createElement("p", {
    key: j
  }, l || " ")), /*#__PURE__*/React.createElement("time", null, fmtClockJN(m.ts)))), m.by === "coach" && i === lastCoachIdx && i > 0 && /*#__PURE__*/React.createElement("div", {
    className: "jc-acts"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => showToast("Saved to your notes")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "notebook-pen",
    size: 15
  }), "Save to notes"), /*#__PURE__*/React.createElement("button", {
    onClick: () => showToast("Sent to " + KATY.name)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "send",
    size: 15
  }), "Share with Katy")))), typing && /*#__PURE__*/React.createElement("div", {
    className: "jn-msg them"
  }, /*#__PURE__*/React.createElement(CoachFace, null), /*#__PURE__*/React.createElement("div", {
    className: "bub typing"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)))), /*#__PURE__*/React.createElement("div", {
    className: "jc-foot"
  }, conv && conv.msgs.length <= 1 && !typing && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "jc-starts-h"
  }, /*#__PURE__*/React.createElement("b", null, "Start with a question"), /*#__PURE__*/React.createElement("small", null, "Pick one and Ava takes it from there")), /*#__PURE__*/React.createElement("div", {
    className: "jc-starts jn-chips wrap"
  }, COACH_PROMPTS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.t,
    className: "jn-chip",
    onClick: () => send(p.t)
  }, p.t)))), /*#__PURE__*/React.createElement("div", {
    className: "jc-composer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jc-mic",
    "aria-label": "Voice",
    onClick: () => setMode("voice")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "mic",
    size: 18,
    color: "var(--ai-purple)"
  })), /*#__PURE__*/React.createElement("input", {
    placeholder: "Ask Ava anything…",
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => e.key === "Enter" && send()
  }), /*#__PURE__*/React.createElement("button", {
    className: "jc-send",
    "aria-label": "Send",
    disabled: !draft.trim(),
    onClick: () => send()
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "arrow-up",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "jc-disc"
  }, "Not medical advice. Talk to your clinician about any concerns."))) : /*#__PURE__*/React.createElement("div", {
    className: "jn-voice jc-voice"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jc-orb " + voice,
    onClick: talk,
    role: "button",
    "aria-label": voice === "idle" ? "Tap to talk" : "Stop"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jc-orb-halo",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "jc-orb-ripple r1",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "jc-orb-ripple r2",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "jc-orb-body",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", {
    className: "c1"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c2"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c3"
  })), voice === "idle" && /*#__PURE__*/React.createElement("span", {
    className: "jc-orb-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "mic",
    size: 30,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "jc-orb-caption"
  }, voice === "idle" ? /*#__PURE__*/React.createElement("span", null, "Tap to talk") : voice === "listening" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "jc-live"
  }), /*#__PURE__*/React.createElement("span", null, "Listening · Ava is hearing you")) : voice === "thinking" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcJN, {
    name: "sparkles",
    size: 14,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("span", null, "Thinking…")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcJN, {
    name: "volume-2",
    size: 14,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("span", null, "Ava is speaking"))), /*#__PURE__*/React.createElement("div", {
    className: "jn-voice-txt"
  }, heard && /*#__PURE__*/React.createElement("p", {
    className: "you"
  }, "“", heard, voice === "listening" ? "…" : "”"), said && /*#__PURE__*/React.createElement("div", {
    className: "ans"
  }, said.split("\n").map((l, j) => /*#__PURE__*/React.createElement("p", {
    key: j
  }, l || " "))), !heard && !said && /*#__PURE__*/React.createElement("p", {
    className: "hint"
  }, "Ask about aftercare, your routine, sleep or your next appointment. Ava has your Health Passport to hand, and the conversation is saved to your history.")), /*#__PURE__*/React.createElement("div", {
    className: "jn-voice-ctl"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-iconbtn lg" + (muted ? " on" : ""),
    "aria-label": "Mute",
    onClick: () => setMuted(!muted)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: muted ? "mic-off" : "mic",
    size: 22,
    color: muted ? "#fff" : "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "jn-iconbtn lg end",
    "aria-label": "End",
    onClick: () => {
      setVoice("idle");
      setHeard("");
      setSaid("");
      setMode("chat");
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "phone-off",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    className: "jn-iconbtn lg",
    "aria-label": "Keyboard",
    onClick: () => setMode("chat")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "message-circle",
    size: 22,
    color: "var(--brand-navy)"
  })))), view !== "chat" && /*#__PURE__*/React.createElement(JNTabs, {
    active: "coach"
  }), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   EVENTS
   ======================================================================= */
const EV_KEY = "pf-jane-events";
const EVENTS = [{
  id: "ev1",
  title: "Skin Boosters Q&A · Live",
  host: "priya",
  date: "2026-10-29",
  time: "7:00pm",
  dur: 60,
  where: "Online · Zoom",
  online: true,
  img: "assets/course-skin-boosters.jpg",
  spots: null,
  desc: "Dr Priya answers your questions on skin boosters: what they do, who they suit, what results to expect and how they differ from filler. Free for all clinic patients."
}, {
  id: "ev2",
  title: "Skin Health Open Evening",
  host: "katy",
  date: "2026-11-07",
  time: "6:30pm",
  dur: 120,
  where: "Pearce Aesthetics · Manchester",
  online: false,
  img: "assets/course-consultation.jpg",
  spots: 12,
  desc: "Meet the team, try a skin scan and get a personalised plan. Fizz, small bites and 10% off bookings made on the night."
}, {
  id: "ev3",
  title: "SPF & Winter Skin Workshop",
  host: "beth",
  date: "2026-11-10",
  time: "6:00pm",
  dur: 75,
  where: "Pearce Aesthetics · Manchester",
  online: false,
  img: "assets/course-full-face-rejuvenation.jpg",
  spots: 8,
  desc: "Hands-on: how much SPF is enough, layering with makeup, and a winter routine for dry or sensitive skin. Take home a sample kit."
}, {
  id: "ev4",
  title: "Aftercare clinic · Ask Katy anything",
  host: "katy",
  date: "2026-11-18",
  time: "7:00pm",
  dur: 45,
  where: "Online · Zoom",
  online: true,
  img: "assets/course-complications.jpg",
  spots: null,
  desc: "A relaxed drop-in for anyone treated in the last month. Swelling, bruising, what's normal and what isn't."
}, {
  id: "ev5",
  title: "Patient appreciation brunch",
  host: "katy",
  date: "2026-12-06",
  time: "11:00am",
  dur: 120,
  where: "Pearce Aesthetics · Manchester",
  online: false,
  img: "assets/event-thumbnail-1.png",
  spots: 20,
  desc: "Our thank-you to you. Brunch, a few surprises and first look at the new treatment menu for 2027."
}];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function evDate(e) {
  const d = new Date(e.date + "T12:00:00");
  return {
    d: d.getDate(),
    m: MONTHS[d.getMonth()],
    wd: WD[d.getDay()]
  };
}
function parseTimeJN(t) {
  const m = /(\d+):(\d+)(am|pm)/.exec(t);
  return {
    h: +m[1] % 12 + (m[3] === "pm" ? 12 : 0),
    min: +m[2]
  };
}
function icsDownloadJN({
  id,
  title,
  start,
  end,
  where,
  desc
}) {
  const f = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PROfinity//Jane//EN", "BEGIN:VEVENT", "UID:" + id + "@profinity", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(start), "DTEND:" + f(end), "SUMMARY:" + title, "LOCATION:" + where, "DESCRIPTION:" + desc, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  a.download = title.replace(/[^a-z0-9]+/gi, "-") + ".ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
function evIcsJN(e) {
  const p = PEOPLE[e.host];
  const t = parseTimeJN(e.time);
  const start = new Date(e.date + "T" + String(t.h).padStart(2, "0") + ":" + String(t.min).padStart(2, "0") + ":00");
  icsDownloadJN({
    id: e.id,
    title: e.title,
    start,
    end: new Date(start.getTime() + e.dur * 60000),
    where: e.where,
    desc: "Hosted by " + p.name + ". " + e.desc
  });
}
function EventsScreen() {
  const [rsvp, setRsvp] = useStateJN(() => readJN(EV_KEY, {
    ev1: true
  }));
  const [view, setView] = useStateJN("upcoming");
  const [open, setOpen] = useStateJN(() => EVENTS.find(e => e.id === qJN("event")) || null);
  const [toast, showToast] = useToastJN();
  function toggle(e) {
    const r = {
      ...rsvp,
      [e.id]: !rsvp[e.id]
    };
    setRsvp(r);
    saveJN(EV_KEY, r);
    showToast(r[e.id] ? "You're going to " + e.title : "RSVP removed");
  }
  const list = view === "mine" ? EVENTS.filter(e => rsvp[e.id]) : EVENTS;
  /* Editorial card (user 2026-10-29 "make the events nice"): soft-shadow white card on the Coach page's warm
     off-white, gradient scrim under the date badge, meta as chips, host name + title, gold "spots left" pill. */
  const Card = ({
    e
  }) => {
    const d = evDate(e);
    const h = PEOPLE[e.host];
    const going = !!rsvp[e.id];
    return /*#__PURE__*/React.createElement("article", {
      className: "jn-ev" + (going ? " is-going" : "")
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-ev-img",
      onClick: () => setOpen(e)
    }, /*#__PURE__*/React.createElement("img", {
      src: e.img,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", {
      className: "date"
    }, /*#__PURE__*/React.createElement("b", null, d.d), /*#__PURE__*/React.createElement("small", null, d.m)), e.online ? /*#__PURE__*/React.createElement("span", {
      className: "live"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "video",
      size: 12,
      color: "#fff"
    }), "Online") : /*#__PURE__*/React.createElement("span", {
      className: "live venue"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "map-pin",
      size: 12,
      color: "#fff"
    }), "In clinic"), going && /*#__PURE__*/React.createElement("span", {
      className: "going-tag"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 12
    }), "You're going")), /*#__PURE__*/React.createElement("div", {
      className: "jn-ev-body"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-ev-ttl",
      onClick: () => setOpen(e)
    }, e.title), /*#__PURE__*/React.createElement("div", {
      className: "jn-ev-meta"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "clock",
      size: 13,
      color: "var(--brand-navy)"
    }), d.wd, " ", d.d, " ", d.m, " · ", e.time), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "map-pin",
      size: 13,
      color: "var(--brand-navy)"
    }), e.where)), /*#__PURE__*/React.createElement("div", {
      className: "jn-ev-foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "host"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: h,
      size: 30
    }), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, h.name), /*#__PURE__*/React.createElement("small", null, h.title))), e.spots != null && /*#__PURE__*/React.createElement("span", {
      className: "spots"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "users",
      size: 12
    }), e.spots - (going ? 1 : 0), " left"), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn sm" + (going ? " going" : ""),
      onClick: () => toggle(e)
    }, going ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 15
    }), "Going") : "RSVP"))));
  };
  const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let lastMonth = "";
  const {
    top,
    layers,
    scrollRef,
    cls,
    padTop,
    hidden
  } = useKatyChromeJN();
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen m-screen jn-evpage" + cls
  }, top, /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll",
    ref: scrollRef,
    style: {
      paddingTop: padTop(12)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pagehead"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Events"), /*#__PURE__*/React.createElement("p", null, "From your clinic and the PROfinity community")), /*#__PURE__*/React.createElement("span", {
    className: "jn-ev-count"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar",
    size: 13
  }), EVENTS.filter(e => rsvp[e.id]).length, " going")), /*#__PURE__*/React.createElement("div", {
    className: "jn-seg"
  }, [["upcoming", "Upcoming"], ["mine", "My events"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: view === k ? "on" : "",
    onClick: () => setView(k)
  }, l, k === "mine" && EVENTS.filter(e => rsvp[e.id]).length > 0 && /*#__PURE__*/React.createElement("i", {
    className: "n"
  }, EVENTS.filter(e => rsvp[e.id]).length)))), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "jn-emptybox"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar",
    size: 26,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("b", null, "No events yet"), /*#__PURE__*/React.createElement("small", null, "RSVP to an event and it will show up here."), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm",
    onClick: () => setView("upcoming")
  }, "Browse upcoming")), list.map(e => {
    const mo = MONTH_FULL[new Date(e.date + "T12:00:00").getMonth()];
    const first = mo !== lastMonth;
    lastMonth = mo;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: e.id
    }, first && /*#__PURE__*/React.createElement("div", {
      className: "jn-ev-month"
    }, mo), /*#__PURE__*/React.createElement(Card, {
      e: e
    }));
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "All events are free for Pearce Aesthetics patients")), /*#__PURE__*/React.createElement(JNTabs, {
    active: "events",
    compact: hidden
  }), layers, /*#__PURE__*/React.createElement(JNSheet, {
    open: !!open,
    onClose: () => setOpen(null),
    tall: true
  }, open && (() => {
    const d = evDate(open);
    const h = PEOPLE[open.host];
    return /*#__PURE__*/React.createElement("div", {
      className: "jn-evd"
    }, /*#__PURE__*/React.createElement("img", {
      className: "hero",
      src: open.img,
      alt: ""
    }), /*#__PURE__*/React.createElement("h3", null, open.title), /*#__PURE__*/React.createElement("div", {
      className: "jn-ev-meta col"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "calendar",
      size: 15
    }), d.wd, " ", d.d, " ", d.m, " · ", open.time, " · ", open.dur, " min"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "map-pin",
      size: 15
    }), open.where), open.spots != null && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "users",
      size: 15
    }), open.spots - (rsvp[open.id] ? 1 : 0), " spots left")), /*#__PURE__*/React.createElement("div", {
      className: "jn-evd-host"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: h,
      size: 40
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, h.name), /*#__PURE__*/React.createElement("small", null, h.title)), /*#__PURE__*/React.createElement(RoleChip, {
      p: h
    })), /*#__PURE__*/React.createElement("p", null, open.desc), /*#__PURE__*/React.createElement("div", {
      className: "jn-row-btns"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-btn ghost",
      onClick: () => {
        evIcsJN(open);
        showToast("Added to calendar");
      }
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "calendar-plus",
      size: 18
    }), "Calendar"), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn ghost",
      onClick: () => showToast("Invite link copied")
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "share-2",
      size: 18
    }), "Invite"), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn" + (rsvp[open.id] ? " going" : ""),
      onClick: () => toggle(open)
    }, rsvp[open.id] ? "Going ✓" : "RSVP")), open.online && rsvp[open.id] && /*#__PURE__*/React.createElement("button", {
      className: "jn-btn block",
      onClick: () => showToast("The join link opens 15 minutes before the start")
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "video",
      size: 18
    }), "Join online"));
  })()), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   MESSAGES — JaneMessages.html runs messages-mobile.jsx with PF_DM_JANE
   (user 2026-10-29: "copy all UI we have in Katy's DM to the Jane version").
   This bundle is loaded on that page with PF_JN_NO_MOUNT and only lends it
   the Jane chrome (top bar hidden by the DM CSS, drawer + notifications
   live) and the call-booking hooks below.
   ======================================================================= */
function JaneChromeC() {
  const [menuOpen, setMenuOpen] = useStateJN(false);
  const [notifOpen, setNotifOpen] = useStateJN(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(JNTopBar, {
    onMenu: () => setMenuOpen(true),
    onBell: () => setNotifOpen(true)
  }), /*#__PURE__*/React.createElement(JNDrawer, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }), /*#__PURE__*/React.createElement(JNNotifPanel, {
    open: notifOpen,
    onClose: () => setNotifOpen(false)
  }));
}
window.JaneChromeC = JaneChromeC;
window.PFJaneDM = {
  /* next booked call → link row above the inbox */
  upcoming() {
    const up = upcomingCall();
    if (!up) return null;
    return {
      icon: up.type === "phone" ? "lucide:phone" : "lucide:video",
      label: callTypeLabel(up) + " with " + callWho(up).first,
      sub: callWhen(up) + " · " + up.reason,
      href: "JaneScheduleCall.html?ret=" + encodeURIComponent("JaneMessages.html")
    };
  }
};

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
const CALL_TYPES = [{
  key: "video",
  label: "Video call",
  icon: "video",
  sub: "Face to face, from your phone"
}, {
  key: "phone",
  label: "Phone call",
  icon: "phone",
  sub: "Katy calls your number"
}];
const CALL_REASONS = ["Aftercare check-in", "Treatment question", "Swelling or bruising", "Before my review", "Something else"];
const CALL_SLOTS = [["Morning", ["9:00am", "9:30am", "10:00am", "10:30am", "11:00am", "11:30am"]], ["Afternoon", ["1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", "4:00pm"]]];
function callsState() {
  return readJN(CALLS_KEY, {
    calls: []
  });
}
function callStart(c) {
  const t = parseTimeJN(c.time);
  return new Date(c.date + "T" + String(t.h).padStart(2, "0") + ":" + String(t.min).padStart(2, "0") + ":00");
}
function upcomingCall() {
  const now = Date.now();
  return callsState().calls.filter(c => c.status === "booked" && callStart(c).getTime() > now - CALL_DUR * 60000).sort((a, b) => callStart(a) - callStart(b))[0] || null;
}
function callTypeLabel(c) {
  return (CALL_TYPES.find(t => t.key === c.type) || CALL_TYPES[0]).label;
}
/* who Jane can call: her own clinician first, then the rest of the care team.
   days = weekdays the clinician takes calls (0 = Sun). */
const CLINICIANS = [{
  id: "katy",
  tag: "Your clinician",
  short: "Registered Nurse",
  days: [1, 2, 3, 4, 5, 6],
  seed: 0
}, {
  id: "beth",
  tag: "Aftercare",
  short: "Aesthetic Nurse",
  days: [1, 2, 3, 4, 5],
  seed: 3
}, {
  id: "priya",
  tag: "Tue & Thu",
  short: "Aesthetic Doctor",
  days: [2, 4],
  seed: 5
}];
function clinOf(id) {
  return CLINICIANS.find(c => c.id === id) || CLINICIANS[0];
}
function callWho(c) {
  return PEOPLE[c && c.with || "katy"];
}
/* In-clinic appointments booked through reception (read-only here; the
   dates match the "Next review Tue 3 Nov · 2:30pm" copy used across Jane). */
const APPOINTMENTS = [{
  id: "ap0",
  kind: "appt",
  with: "katy",
  title: "Lip filler",
  date: "2026-10-01",
  time: "3:00pm",
  dur: 45,
  where: "Pearce Aesthetics · Manchester",
  status: "done",
  note: "Treatment completed. Aftercare sheet sent by Nurse Beth."
}, {
  id: "ap1",
  kind: "appt",
  with: "katy",
  title: "2-week review",
  date: "2026-11-03",
  time: "2:30pm",
  dur: 30,
  where: "Pearce Aesthetics · Manchester",
  status: "confirmed",
  note: "Katy checks how the lips have settled. Bring any photos of swelling, and your supplements list."
}, {
  id: "ap2",
  kind: "appt",
  with: "priya",
  title: "Skin consultation",
  date: "2026-11-24",
  time: "11:00am",
  dur: 45,
  where: "Pearce Aesthetics · Manchester",
  status: "confirmed",
  note: "Skin scan and a personalised plan with Dr Priya. Arrive make-up free if you can."
}];
function scheduleItems(calls) {
  const now = Date.now();
  const all = [...APPOINTMENTS, ...calls.map(c => ({
    ...c,
    kind: "call"
  }))];
  const isPast = x => x.status === "cancelled" || x.status === "done" || callStart(x).getTime() < now - (x.dur || CALL_DUR) * 60000;
  const byTime = (a, b) => callStart(a) - callStart(b);
  return {
    upcoming: all.filter(x => !isPast(x)).sort(byTime),
    past: all.filter(isPast).sort((a, b) => byTime(b, a))
  };
}
function callWhen(c) {
  const d = new Date(c.date + "T12:00:00");
  return WD[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()] + " · " + c.time;
}
function isoDateJN(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
/* Katy's diary for the next two weeks: Sundays closed, Saturday mornings
   only, and a deterministic scatter of taken slots so the grid feels real. */
function callDays(withId) {
  const cl = clinOf(withId);
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  for (let i = 0; i < 14; i++) {
    const x = new Date(d.getTime() + i * 86400000);
    const dow = x.getDay();
    out.push({
      iso: isoDateJN(x),
      d: x.getDate(),
      wd: WD[dow],
      m: MONTHS[x.getMonth()],
      dow,
      off: dow === 0 ? "closed" : cl.days.indexOf(dow) === -1 ? "away" : null
    });
  }
  return out;
}
function slotTaken(iso, time, withId) {
  const n = +iso.slice(-2) + +iso.slice(5, 7) * 3 + clinOf(withId).seed;
  const i = CALL_SLOTS[0][1].concat(CALL_SLOTS[1][1]).indexOf(time);
  return (n * 7 + i * 11) % 5 === 0 || (n + i) % 9 === 4;
}
/* Booking confirmation from the clinician lands in the Messages thread: queued
   under pf-jane-dm-pending, folded into the DM store (messages-mobile.jsx
   mergeJanePendingDM) the next time JaneMessages.html loads. */
function dmCallNote(text, withId) {
  saveJN("pf-jane-dm-pending", [...readJN("pf-jane-dm-pending", []), {
    id: withId || "katy",
    text,
    ts: Date.now()
  }]);
}

/* Slide-to-open control: drag the knob to the end (or just tap the track) to fire onDone. */
function SlideJN({
  label,
  onDone,
  hot
}) {
  const ref = useRefJN(null);
  const [x, setX] = useStateJN(0);
  const drag = useRefJN(null);
  const maxX = () => {
    const el = ref.current;
    return el ? el.clientWidth - 52 : 0;
  };
  const down = e => {
    drag.current = {
      sx: e.clientX,
      moved: false
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = e => {
    if (!drag.current) return;
    const dx = Math.max(0, Math.min(maxX(), e.clientX - drag.current.sx));
    if (dx > 4) drag.current.moved = true;
    setX(dx);
  };
  const up = e => {
    if (!drag.current) return;
    const done = x >= maxX() * 0.8 || !drag.current.moved;
    drag.current = null;
    if (done) {
      setX(maxX());
      setTimeout(() => {
        setX(0);
        onDone();
      }, done && x > 0 ? 120 : 0);
    } else setX(0);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "sc-slide" + (hot ? " hot" : ""),
    ref: ref,
    onClick: () => {
      if (!drag.current) onDone();
    },
    role: "button",
    "aria-label": label
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-slide-l",
    style: {
      opacity: 1 - x / Math.max(1, maxX())
    }
  }, label, /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "sc-slide-k",
    style: {
      transform: "translateX(" + x + "px)",
      transition: drag.current ? "none" : "transform .18s ease"
    },
    onPointerDown: down,
    onPointerMove: move,
    onPointerUp: up,
    onPointerCancel: up,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "arrow-right",
    size: 20,
    color: hot ? "var(--brand-navy)" : "#fff"
  })));
}
function ScheduleCallScreen() {
  const ret = qJN("ret") || "JaneNewsfeed.html";
  const prof = readJN(PROFILE_KEY, {
    phone: "+44 7700 900123"
  });
  const [store, setStore] = useStateJN(callsState);
  const up = useMemoJN(() => {
    const now = Date.now();
    return store.calls.filter(c => c.status === "booked" && callStart(c).getTime() > now - CALL_DUR * 60000).sort((a, b) => callStart(a) - callStart(b))[0] || null;
  }, [store]);
  const [view, setView] = useStateJN(() => qJN("new") === "1" ? "book" : "schedule");
  const [sel, setSel] = useStateJN(null);
  const [apptOpen, setApptOpen] = useStateJN(null);
  const [filt, setFilt] = useStateJN("all");
  const [pastOpen, setPastOpen] = useStateJN(false);
  const items = useMemoJN(() => scheduleItems(store.calls), [store]);
  const [step, setStep] = useStateJN(0);
  const [editing, setEditing] = useStateJN(null);
  const [draft, setDraft] = useStateJN({
    with: CLINICIANS.some(c => c.id === qJN("with")) ? qJN("with") : "katy",
    type: qJN("type") === "phone" ? "phone" : "video",
    reason: null,
    note: "",
    date: null,
    time: null
  });
  const who = PEOPLE[draft.with];
  const [booked, setBooked] = useStateJN(null);
  const [cancelOpen, setCancelOpen] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const days = useMemoJN(() => callDays(draft.with), [draft.with]);
  const scrollRef = useRefJN(null);
  useEffectJN(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step, view]);
  function persist(s) {
    setStore(s);
    saveJN(CALLS_KEY, s);
  }
  function startBooking(from) {
    if (from) {
      setEditing(from.id);
      setDraft({
        with: from.with || "katy",
        type: from.type,
        reason: from.reason,
        note: from.note || "",
        date: from.date,
        time: from.time
      });
      setStep(1);
    } else {
      setEditing(null);
      setDraft({
        with: "katy",
        type: "video",
        reason: null,
        note: "",
        date: null,
        time: null
      });
      setStep(0);
    }
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
    const call = {
      id: editing || "call" + Date.now().toString(36),
      with: draft.with,
      type: draft.type,
      reason: draft.reason,
      note: draft.note.trim(),
      date: draft.date,
      time: draft.time,
      dur: CALL_DUR,
      status: "booked",
      ts: Date.now()
    };
    const others = store.calls.filter(c => c.id !== call.id);
    persist({
      calls: [call, ...others]
    });
    dmCallNote(editing ? "No problem — I've moved your " + callTypeLabel(call).toLowerCase() + " to " + callWhen(call) + ". See you then 🙂" : "📅 Your " + callTypeLabel(call).toLowerCase() + " is booked for " + callWhen(call) + ". " + (call.type === "video" ? "I'll send the link here 10 minutes before." : "I'll call you on " + prof.phone + ".") + " Anything you'd like me to look at beforehand, just send it over.", call.with);
    setBooked({
      ...call,
      rescheduled: !!editing
    });
    setEditing(null);
    setView("done");
  }
  function cancelCall() {
    const target = sel || up;
    persist({
      calls: store.calls.map(c => c.id === target.id ? {
        ...c,
        status: "cancelled"
      } : c)
    });
    dmCallNote("Got it — I've cancelled your call. Book another whenever you need me 🙂", target.with);
    setCancelOpen(false);
    showToast("Call cancelled");
    setSel(null);
    setView("schedule");
  }
  function addToCalendar(c) {
    const start = callStart(c);
    if (c.kind === "appt") icsDownloadJN({
      id: c.id,
      title: c.title + " with " + callWho(c).name,
      start,
      end: new Date(start.getTime() + c.dur * 60000),
      where: c.where,
      desc: c.note
    });else icsDownloadJN({
      id: c.id,
      title: callTypeLabel(c) + " with " + callWho(c).name,
      start,
      end: new Date(start.getTime() + CALL_DUR * 60000),
      where: c.type === "video" ? "Video call · link in PROfinity Messages" : "Phone call · " + prof.phone,
      desc: c.reason + (c.note ? ". " + c.note : "") + ". Booked through the PROfinity patient app."
    });
    showToast("Added to calendar");
  }
  const kindOf = x => x.kind === "call" ? x.type : "clinic";
  const kindIcon = x => x.kind === "call" ? x.type === "phone" ? "phone" : "video" : "building-2";
  const titleOf = x => x.kind === "call" ? callTypeLabel(x) + " with " + callWho(x).first : x.title + " with " + callWho(x).first;
  const openItem = (x, past) => x.kind === "call" ? past ? null : (setSel(x), setView("detail")) : setApptOpen(x);
  const relDay = x => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const d = Math.round((new Date(x.date + "T00:00:00") - t) / 86400000);
    return d === 0 ? "Today" : d === 1 ? "Tomorrow" : d < 7 ? "In " + d + " days" : d < 14 ? "Next week" : "In " + Math.round(d / 7) + " weeks";
  };
  const ItemRow = ({
    x,
    past
  }) => {
    const w = callWho(x);
    const d = new Date(x.date + "T12:00:00");
    const isCall = x.kind === "call";
    return /*#__PURE__*/React.createElement("button", {
      className: "sc-item" + (past ? " past" : "") + (x.status === "cancelled" ? " cancelled" : ""),
      onClick: () => openItem(x, past)
    }, /*#__PURE__*/React.createElement("span", {
      className: "date"
    }, /*#__PURE__*/React.createElement("i", null, WD[d.getDay()]), /*#__PURE__*/React.createElement("b", null, d.getDate())), /*#__PURE__*/React.createElement("span", {
      className: "av"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: w,
      size: 42
    }), /*#__PURE__*/React.createElement("i", {
      className: "bd " + kindOf(x)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: kindIcon(x),
      size: 11,
      color: "#fff"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, titleOf(x)), /*#__PURE__*/React.createElement("small", null, x.time, " · ", x.dur || CALL_DUR, " min · ", isCall ? x.reason : "In clinic")), /*#__PURE__*/React.createElement("span", {
      className: "st " + (x.status || "booked")
    }, x.status === "cancelled" ? "Cancelled" : x.status === "done" || past ? "Done" : isCall ? "Booked" : "Confirmed"));
  };
  const todayIso = isoDateJN(new Date());
  const HeroCard = ({
    x
  }) => {
    const w = callWho(x);
    const isCall = x.kind === "call";
    const hot = x.date === todayIso;
    return /*#__PURE__*/React.createElement("section", {
      className: "sc-hero" + (hot ? "" : " lite"),
      role: "button",
      tabIndex: 0,
      onClick: () => openItem(x),
      onKeyDown: e => {
        if (e.key === "Enter") openItem(x);
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "sc-hero-st " + (x.status || "booked")
    }, isCall ? "Booked" : "Confirmed"), /*#__PURE__*/React.createElement("div", {
      className: "sc-hero-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sc-hero-av"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: w,
      size: 62
    }), /*#__PURE__*/React.createElement("i", {
      className: "bd " + kindOf(x)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: kindIcon(x),
      size: 13,
      color: "#fff"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lbl"
    }, /*#__PURE__*/React.createElement("i", null), " ", hot ? "Today" : relDay(x)), /*#__PURE__*/React.createElement("b", null, titleOf(x)))), /*#__PURE__*/React.createElement("div", {
      className: "sc-hero-meta"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "calendar",
      size: 14
    }), callWhen(x).split(" · ")[0]), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "clock",
      size: 14
    }), x.time, " · ", x.dur || CALL_DUR, " min"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: isCall ? x.type === "phone" ? "phone" : "video" : "map-pin",
      size: 14
    }), isCall ? callTypeLabel(x) : "Manchester clinic")), /*#__PURE__*/React.createElement("div", {
      className: "sc-hero-acts",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => addToCalendar(x)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "calendar-plus",
      size: 16
    }), "Calendar"), /*#__PURE__*/React.createElement("button", {
      onClick: () => goJN("JaneMessages.html?to=" + (isCall ? w.id : "reception"))
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "message-circle",
      size: 16
    }), "Message")));
  };
  const canNext = step === 0 ? !!draft.reason : step === 1 ? !!(draft.date && draft.time) : true;
  const Picker = () => /*#__PURE__*/React.createElement("div", {
    className: "sc-clins"
  }, CLINICIANS.map(cl => {
    const p = PEOPLE[cl.id];
    const on = draft.with === cl.id;
    return /*#__PURE__*/React.createElement("button", {
      key: cl.id,
      className: "sc-clin" + (on ? " on" : ""),
      onClick: () => setDraft({
        ...draft,
        with: cl.id,
        date: null,
        time: null
      })
    }, /*#__PURE__*/React.createElement("span", {
      className: "av"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: p,
      size: 56
    }), on && /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 11,
      color: "#fff"
    }))), /*#__PURE__*/React.createElement("b", null, p.name), /*#__PURE__*/React.createElement("small", null, cl.short), /*#__PURE__*/React.createElement("em", {
      className: cl.id === "katy" ? "mine" : ""
    }, cl.tag));
  }));
  const Summary = ({
    c,
    compact
  }) => /*#__PURE__*/React.createElement("div", {
    className: "jn-summary sc-sum" + (compact ? " compact" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "With"), /*#__PURE__*/React.createElement("b", {
    className: "who"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: callWho(c),
    size: 22
  }), callWho(c).name)), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Call"), /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(IcJN, {
    name: c.type === "phone" ? "phone" : "video",
    size: 14
  }), " ", callTypeLabel(c), " · ", CALL_DUR, " min")), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "When"), /*#__PURE__*/React.createElement("b", null, callWhen(c))), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "About"), /*#__PURE__*/React.createElement("b", null, c.reason)), c.note && /*#__PURE__*/React.createElement("div", {
    className: "jn-kv col"
  }, /*#__PURE__*/React.createElement("span", null, "Your note"), /*#__PURE__*/React.createElement("b", null, c.note)), c.type === "phone" && /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, callWho(c).first, " will call"), /*#__PURE__*/React.createElement("b", null, prof.phone)));

  /* ---- booked / upcoming -------------------------------------------- */
  if (view === "schedule") {
    const shown = items.upcoming.filter(x => filt === "all" || (filt === "call" ? x.kind === "call" : x.kind === "appt"));
    const groups = shown.reduce((g, x) => {
      const d = new Date(x.date + "T12:00:00");
      const k = d.toLocaleString("en-GB", {
        month: "long"
      }) + " " + d.getFullYear();
      (g[k] = g[k] || []).push(x);
      return g;
    }, {});
    return /*#__PURE__*/React.createElement("div", {
      className: "jn-screen sc sc-page"
    }, /*#__PURE__*/React.createElement(JNBar, {
      title: "Calls & appointments",
      back: () => goJN("JaneNewsfeed.html"),
      trailing: /*#__PURE__*/React.createElement("button", {
        className: "jn-iconbtn sm",
        "aria-label": "Schedule a call",
        onClick: () => startBooking(null)
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "plus",
        size: 20,
        color: "var(--brand-navy)"
      }))
    }), /*#__PURE__*/React.createElement("div", {
      className: "jn-scroll",
      ref: scrollRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "jn-seg sc-seg"
    }, [["all", "All"], ["call", "Calls"], ["appt", "In clinic"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      className: filt === k ? "on" : "",
      onClick: () => setFilt(k)
    }, l))), Object.keys(groups).length === 0 && /*#__PURE__*/React.createElement("div", {
      className: "jn-emptybox sc-empty"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "calendar",
      size: 26,
      color: "var(--gray-400)"
    }), /*#__PURE__*/React.createElement("b", null, "Nothing upcoming"), /*#__PURE__*/React.createElement("small", null, filt === "call" ? "Schedule a call with your care team." : filt === "appt" ? "Message reception to book a visit." : "Nothing booked yet.")), Object.entries(groups).map(([month, list]) => /*#__PURE__*/React.createElement("section", {
      key: month,
      className: "sc-group"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "sc-month-h"
    }, month, " ", /*#__PURE__*/React.createElement("em", null, list.length)), /*#__PURE__*/React.createElement("div", {
      className: "sc-cards"
    }, list.map(x => /*#__PURE__*/React.createElement(HeroCard, {
      key: x.id,
      x: x
    }))))), items.past.length > 0 && /*#__PURE__*/React.createElement("section", {
      className: "sc-group"
    }, /*#__PURE__*/React.createElement("button", {
      className: "sc-month-h sc-past-h" + (pastOpen ? " open" : ""),
      onClick: () => setPastOpen(!pastOpen)
    }, "Past ", /*#__PURE__*/React.createElement("em", null, items.past.length), /*#__PURE__*/React.createElement(IcJN, {
      name: "chevron-down",
      size: 18,
      color: "var(--gray-450)"
    })), pastOpen && /*#__PURE__*/React.createElement("div", {
      className: "jn-card list sc-list"
    }, items.past.map(x => /*#__PURE__*/React.createElement(ItemRow, {
      key: x.id,
      x: x,
      past: true
    })))), /*#__PURE__*/React.createElement("div", {
      className: "sc-info"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "info",
      size: 15,
      color: "var(--brand-navy)"
    }), /*#__PURE__*/React.createElement("span", null, "Clinic appointments are booked by reception. To move one, message the clinic or call 0161 000 0000.")), /*#__PURE__*/React.createElement("div", {
      className: "jn-end"
    }, "Calls are free for ", JANE.clinic, " patients")), /*#__PURE__*/React.createElement(JNTabs, {
      active: "schedule"
    }), /*#__PURE__*/React.createElement(JNSheet, {
      open: !!apptOpen,
      onClose: () => setApptOpen(null)
    }, apptOpen && (() => {
      const w = callWho(apptOpen);
      const isPast = apptOpen.status === "done";
      return /*#__PURE__*/React.createElement("div", {
        className: "sc-apptd"
      }, /*#__PURE__*/React.createElement("div", {
        className: "sc-apptd-head"
      }, /*#__PURE__*/React.createElement("span", {
        className: "ic"
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "building-2",
        size: 22,
        color: "#fff"
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, apptOpen.title), /*#__PURE__*/React.createElement("small", null, callWhen(apptOpen), " · ", apptOpen.dur, " min"))), /*#__PURE__*/React.createElement("div", {
        className: "jn-evd-host"
      }, /*#__PURE__*/React.createElement(JNFace, {
        p: w,
        size: 40
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, w.name), /*#__PURE__*/React.createElement("small", null, w.title)), /*#__PURE__*/React.createElement(RoleChip, {
        p: w
      })), /*#__PURE__*/React.createElement("div", {
        className: "jn-kv"
      }, /*#__PURE__*/React.createElement("span", null, "Where"), /*#__PURE__*/React.createElement("b", null, apptOpen.where)), /*#__PURE__*/React.createElement("div", {
        className: "jn-kv"
      }, /*#__PURE__*/React.createElement("span", null, "Status"), /*#__PURE__*/React.createElement("b", null, isPast ? "Completed" : "Confirmed")), /*#__PURE__*/React.createElement("p", {
        className: "jn-sheet-p",
        style: {
          marginTop: 10
        }
      }, apptOpen.note), !isPast && /*#__PURE__*/React.createElement("div", {
        className: "jn-row-btns"
      }, /*#__PURE__*/React.createElement("button", {
        className: "jn-btn ghost",
        onClick: () => addToCalendar(apptOpen)
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "calendar-plus",
        size: 18
      }), "Calendar"), /*#__PURE__*/React.createElement("button", {
        className: "jn-btn ghost",
        onClick: () => showToast("Opening directions…")
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "map-pin",
        size: 18
      }), "Directions"), /*#__PURE__*/React.createElement("button", {
        className: "jn-btn",
        onClick: () => goJN("JaneMessages.html?to=reception")
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "message-circle",
        size: 18
      }), "Reschedule")), isPast && /*#__PURE__*/React.createElement("button", {
        className: "jn-btn block ghost",
        onClick: () => {
          setApptOpen(null);
          startBooking(null);
        }
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "phone",
        size: 18
      }), "Book a follow-up call"));
    })()), /*#__PURE__*/React.createElement(JNToast, {
      toast: toast
    }));
  }
  if (view === "detail" && sel) {
    const up = sel;
    const uw = callWho(up);
    return /*#__PURE__*/React.createElement("div", {
      className: "jn-screen sc"
    }, /*#__PURE__*/React.createElement(JNBar, {
      title: "Your call with " + uw.first,
      back: () => setView("schedule"),
      trailing: /*#__PURE__*/React.createElement(JNFace, {
        p: uw,
        size: 34
      })
    }), /*#__PURE__*/React.createElement("div", {
      className: "jn-scroll",
      ref: scrollRef
    }, /*#__PURE__*/React.createElement("section", {
      className: "sc-upcard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: up.type === "phone" ? "phone" : "video",
      size: 22,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("div", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, callTypeLabel(up), " with ", uw.first), /*#__PURE__*/React.createElement("small", null, callWhen(up))), /*#__PURE__*/React.createElement("span", {
      className: "st"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 12,
      color: "#fff"
    }), "Booked")), /*#__PURE__*/React.createElement("div", {
      className: "jn-kv"
    }, /*#__PURE__*/React.createElement("span", null, "About"), /*#__PURE__*/React.createElement("b", null, up.reason)), /*#__PURE__*/React.createElement("div", {
      className: "jn-kv"
    }, /*#__PURE__*/React.createElement("span", null, "Length"), /*#__PURE__*/React.createElement("b", null, CALL_DUR, " minutes")), up.note && /*#__PURE__*/React.createElement("div", {
      className: "jn-kv col"
    }, /*#__PURE__*/React.createElement("span", null, "Your note"), /*#__PURE__*/React.createElement("b", null, up.note)), /*#__PURE__*/React.createElement("div", {
      className: "sc-join"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: up.type === "phone" ? "phone-call" : "video",
      size: 18,
      color: "var(--brand-navy)"
    }), /*#__PURE__*/React.createElement("span", null, up.type === "phone" ? uw.first + " will call you on " + prof.phone + "." : "Your join link arrives in Messages 10 minutes before the call.")), /*#__PURE__*/React.createElement("div", {
      className: "jn-row-btns"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-btn ghost",
      onClick: () => addToCalendar(up)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "calendar-plus",
      size: 18
    }), "Calendar"), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn ghost",
      onClick: () => goJN("JaneMessages.html?to=" + uw.id)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "message-circle",
      size: 18
    }), "Message"), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn ghost",
      onClick: () => startBooking(up)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "refresh-cw",
      size: 18
    }), "Move")), /*#__PURE__*/React.createElement("button", {
      className: "sc-cancel",
      onClick: () => setCancelOpen(true)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "x",
      size: 15
    }), "Cancel this call")), /*#__PURE__*/React.createElement("div", {
      className: "sc-tips"
    }, /*#__PURE__*/React.createElement("h4", null, "Before the call"), /*#__PURE__*/React.createElement("div", {
      className: "jn-li"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "camera",
      size: 16,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, "Good light helps"), /*#__PURE__*/React.createElement("small", null, "Sit facing a window so ", uw.first, " can see the treated area clearly."))), /*#__PURE__*/React.createElement("div", {
      className: "jn-li"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "clipboard-list",
      size: 16,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, "Jot down your questions"), /*#__PURE__*/React.createElement("small", null, "Fifteen minutes goes quickly — have them ready."))), /*#__PURE__*/React.createElement("div", {
      className: "jn-li"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "shield-check",
      size: 16,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, "Your Health Passport is shared"), /*#__PURE__*/React.createElement("small", null, uw.first, " can see your history and aftercare notes during the call.")))), /*#__PURE__*/React.createElement("div", {
      className: "jn-end"
    }, "Calls are free for ", JANE.clinic, " patients · for anything urgent call the clinic")), /*#__PURE__*/React.createElement(JNSheet, {
      open: cancelOpen,
      onClose: () => setCancelOpen(false),
      title: "Cancel this call?"
    }, /*#__PURE__*/React.createElement("p", {
      className: "jn-sheet-p"
    }, uw.first, " will be let know. You can book another call any time — the slot goes back to other patients."), /*#__PURE__*/React.createElement("div", {
      className: "jn-row-btns"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-btn ghost",
      onClick: () => setCancelOpen(false)
    }, "Keep call"), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn danger",
      onClick: cancelCall
    }, "Cancel call"))), /*#__PURE__*/React.createElement(JNToast, {
      toast: toast
    }));
  }

  /* ---- done ---------------------------------------------------------- */
  if (view === "done" && booked) {
    const bw = callWho(booked);
    return /*#__PURE__*/React.createElement("div", {
      className: "jn-screen sc"
    }, /*#__PURE__*/React.createElement(JNBar, {
      title: "Call booked",
      back: () => goJN(ret),
      trailing: /*#__PURE__*/React.createElement(JNFace, {
        p: bw,
        size: 34
      })
    }), /*#__PURE__*/React.createElement("div", {
      className: "jn-scroll",
      ref: scrollRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "jn-onb-done sc-done"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ok"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 44,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("h2", null, booked.rescheduled ? "Call moved" : "You're booked in"), /*#__PURE__*/React.createElement("p", null, bw.first, " will ", booked.type === "phone" ? "call you" : "see you", " on ", /*#__PURE__*/React.createElement("b", null, callWhen(booked)), ". We'll remind you 10 minutes before", booked.type === "video" ? " and drop the link in Messages" : "", "."), /*#__PURE__*/React.createElement(Summary, {
      c: booked,
      compact: true
    }), /*#__PURE__*/React.createElement("div", {
      className: "jn-row-btns"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-btn ghost",
      onClick: () => addToCalendar(booked)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "calendar-plus",
      size: 18
    }), "Add to calendar"), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn ghost",
      onClick: () => goJN("JaneMessages.html?to=" + bw.id)
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "message-circle",
      size: 18
    }), "Message ", bw.first)), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn block",
      onClick: () => {
        setBooked(null);
        setView("schedule");
      }
    }, "See all calls & appointments"), /*#__PURE__*/React.createElement("button", {
      className: "sc-cancel",
      style: {
        color: "var(--text-secondary)"
      },
      onClick: () => goJN(ret)
    }, "Done"))), /*#__PURE__*/React.createElement(JNToast, {
      toast: toast
    }));
  }

  /* ---- booking steps ------------------------------------------------- */
  const selDay = days.find(d => d.iso === draft.date);
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen sc jn-onb"
  }, /*#__PURE__*/React.createElement(JNBar, {
    title: editing ? "Move your call" : "Schedule a call",
    back: back,
    trailing: /*#__PURE__*/React.createElement(JNFace, {
      p: who,
      size: 34
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-onb-prog"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: (step + 1) / 3 * 100 + "%"
    }
  })), /*#__PURE__*/React.createElement("span", null, "Step ", step + 1, " of 3")), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll",
    ref: scrollRef
  }, step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "jn-onb-step"
  }, "Step 1 · Who and what"), /*#__PURE__*/React.createElement("h2", {
    className: "jn-onb-q"
  }, "Who would you like to talk to?"), /*#__PURE__*/React.createElement("p", {
    className: "jn-onb-sub"
  }, "A free ", CALL_DUR, "-minute call with your care team. Pick a clinician, how you'd like to talk and what it's about."), /*#__PURE__*/React.createElement(Picker, null), /*#__PURE__*/React.createElement("h4", {
    className: "sc-h4"
  }, "How"), /*#__PURE__*/React.createElement("div", {
    className: "sc-types"
  }, CALL_TYPES.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "sc-type" + (draft.type === t.key ? " on" : ""),
    onClick: () => setDraft({
      ...draft,
      type: t.key
    })
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: t.icon,
    size: 22,
    color: draft.type === t.key ? "#fff" : "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("b", null, t.label), /*#__PURE__*/React.createElement("small", null, t.key === "phone" ? who.first + " calls your number" : t.sub), /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, draft.type === t.key && /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 13,
    color: "#fff"
  }))))), /*#__PURE__*/React.createElement("h4", {
    className: "sc-h4"
  }, "Reason"), /*#__PURE__*/React.createElement("div", {
    className: "jn-prompts sc-reasons"
  }, CALL_REASONS.map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    className: "jn-chip" + (draft.reason === r ? " on" : ""),
    onClick: () => setDraft({
      ...draft,
      reason: r
    })
  }, r))), /*#__PURE__*/React.createElement("h4", {
    className: "sc-h4"
  }, "Anything ", who.first, " should know first? ", /*#__PURE__*/React.createElement("em", null, "optional")), /*#__PURE__*/React.createElement("textarea", {
    className: "jn-in sc-note",
    rows: 3,
    placeholder: "e.g. Left side still a little swollen since Tuesday…",
    value: draft.note,
    onChange: e => setDraft({
      ...draft,
      note: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "sc-info"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "info",
    size: 15,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Calls are for questions and check-ins. If something feels urgent, phone the clinic on 0161 000 0000."))), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "jn-onb-step"
  }, "Step 2 · Pick a time"), /*#__PURE__*/React.createElement("h2", {
    className: "jn-onb-q"
  }, "When suits you?"), /*#__PURE__*/React.createElement("p", {
    className: "jn-onb-sub"
  }, who.first, "'s next two weeks", clinOf(draft.with).days.length < 5 ? " · takes calls on " + clinOf(draft.with).tag : "", ". Times are UK time."), /*#__PURE__*/React.createElement("div", {
    className: "sc-month"
  }, selDay ? selDay.m + " " + new Date(selDay.iso + "T12:00:00").getFullYear() : days[0].m + (days[0].m !== days[13].m ? " – " + days[13].m : "")), /*#__PURE__*/React.createElement("div", {
    className: "sc-days"
  }, days.map(d => {
    const off = !!d.off;
    return /*#__PURE__*/React.createElement("button", {
      key: d.iso,
      className: "sc-day" + (draft.date === d.iso ? " on" : "") + (off ? " off" : ""),
      disabled: off,
      onClick: () => setDraft({
        ...draft,
        date: d.iso,
        time: null
      })
    }, /*#__PURE__*/React.createElement("small", null, d.wd), /*#__PURE__*/React.createElement("b", null, d.d), off ? /*#__PURE__*/React.createElement("i", null, d.off) : /*#__PURE__*/React.createElement("i", null, d.m));
  })), !draft.date && /*#__PURE__*/React.createElement("div", {
    className: "jn-emptybox sc-empty"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar",
    size: 26,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("b", null, "Pick a day"), /*#__PURE__*/React.createElement("small", null, "Then choose one of ", who.first, "'s free slots.")), draft.date && CALL_SLOTS.filter(([g]) => !(selDay.dow === 6 && g === "Afternoon")).map(([g, slots]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    className: "sc-group"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "sc-h4"
  }, g), /*#__PURE__*/React.createElement("div", {
    className: "sc-slots"
  }, slots.map(t => {
    const taken = slotTaken(draft.date, t, draft.with);
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      className: "sc-slot" + (draft.time === t ? " on" : "") + (taken ? " taken" : ""),
      disabled: taken,
      onClick: () => setDraft({
        ...draft,
        time: t
      })
    }, t);
  })))), draft.date && selDay.dow === 6 && /*#__PURE__*/React.createElement("div", {
    className: "sc-info"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "info",
    size: 15,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Saturdays are mornings only."))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "jn-onb-step"
  }, "Step 3 · Confirm"), /*#__PURE__*/React.createElement("h2", {
    className: "jn-onb-q"
  }, "Does this look right?"), /*#__PURE__*/React.createElement("p", {
    className: "jn-onb-sub"
  }, who.first, " will get a note straight away and you'll both get a reminder 10 minutes before."), /*#__PURE__*/React.createElement(Summary, {
    c: draft
  }), draft.type === "phone" && /*#__PURE__*/React.createElement("button", {
    className: "jn-link-row sc-phone",
    onClick: () => goJN("JaneProfile.html?edit=1")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "pencil",
    size: 15
  }), "Wrong number? Update it on your profile", /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "sc-tips sc-how"
  }, /*#__PURE__*/React.createElement("h4", null, "How it works"), /*#__PURE__*/React.createElement("div", {
    className: "jn-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "bell",
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Reminder 10 minutes before"), /*#__PURE__*/React.createElement("small", null, "By notification and in Messages."))), /*#__PURE__*/React.createElement("div", {
    className: "jn-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: draft.type === "phone" ? "phone-call" : "video",
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, draft.type === "phone" ? who.first + " calls you" : "Tap the link to join"), /*#__PURE__*/React.createElement("small", null, draft.type === "phone" ? "From the clinic number, so save it in your contacts." : "No app to install — it opens right here."))), /*#__PURE__*/React.createElement("div", {
    className: "jn-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "shield-check",
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Health Passport shared for the call"), /*#__PURE__*/React.createElement("small", null, "So ", who.first, " has your history and aftercare notes to hand.")))))), /*#__PURE__*/React.createElement("div", {
    className: "jn-onb-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    disabled: !canNext,
    onClick: () => step < 2 ? setStep(step + 1) : confirm()
  }, step === 2 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar-check",
    size: 18
  }), editing ? "Confirm new time" : "Book call") : "Continue")), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   CREATE POST — twin of Katy's CreatePostMobile (create-post-mobile.css
   cp-* classes, same top bar / author row / text area / hashtag rail /
   "Add to your post" tools / background styles / destination sheet).
   Posts land in pf-jane-posts and the feed reopens on top.
   ======================================================================= */
const JN_TAGS = [{
  slug: "progress",
  label: "Progress"
}, {
  slug: "question",
  label: "Question"
}, {
  slug: "aftercare",
  label: "Aftercare"
}, {
  slug: "skincare",
  label: "Skincare"
}, {
  slug: "appointment",
  label: "Appointment"
}, {
  slug: "tips",
  label: "Tips"
}, {
  slug: "sleep",
  label: "Sleep"
}, {
  slug: "wins",
  label: "Wins"
}];
const JN_TAG_MAP = JN_TAGS.reduce((m, t) => {
  m[t.slug] = t;
  return m;
}, {});
const JN_BACKGROUNDS = [{
  id: "none",
  label: "No background",
  css: "",
  fg: "var(--text-primary)"
}, {
  id: "navy",
  label: "Navy",
  css: "linear-gradient(150deg,#292569,#3d3688)",
  fg: "#fff"
}, {
  id: "gold",
  label: "Gold",
  css: "linear-gradient(150deg,#ce9957,#a26301)",
  fg: "#fff"
}, {
  id: "purple",
  label: "Purple",
  css: "linear-gradient(150deg,#6c63ff,#4022a8)",
  fg: "#fff"
}, {
  id: "teal",
  label: "Teal",
  css: "linear-gradient(150deg,#25515c,#173840)",
  fg: "#fff"
}, {
  id: "cream",
  label: "Cream",
  css: "linear-gradient(150deg,#fcf4e4,#f3e3c8)",
  fg: "var(--brand-navy)"
}, {
  id: "navygold",
  label: "Navy to gold",
  css: "linear-gradient(150deg,#292569 40%,#ce9957)",
  fg: "#fff"
}, {
  id: "sunrise",
  label: "Sunrise",
  css: "linear-gradient(150deg,#e58f0c,#be1e2d)",
  fg: "#fff"
}, {
  id: "mint",
  label: "Mint",
  css: "linear-gradient(150deg,#2a9568,#186b4a)",
  fg: "#fff"
}, {
  id: "slate",
  label: "Slate",
  css: "linear-gradient(150deg,#475467,#1f2937)",
  fg: "#fff"
}, {
  id: "blush",
  label: "Blush",
  css: "linear-gradient(150deg,#f7d6de,#e9afbe)",
  fg: "var(--brand-navy)"
}, {
  id: "ink",
  label: "Ink",
  css: "#101828",
  fg: "#fff"
}];
const JN_DESTS = [{
  k: "feed",
  label: "Clinic feed",
  sub: "Your clinic team and other patients",
  icon: "rss"
}, {
  k: "patients",
  label: "Patients only",
  sub: "Other patients at " + JANE.clinic,
  icon: "users"
}, {
  k: "katy",
  label: "Just my clinician",
  sub: "A private note to " + KATY.name,
  icon: "lock"
}];
const JN_ATTACH = [{
  k: "photo",
  icon: "image",
  label: "Photo",
  color: "#2d9d5a"
}, {
  k: "video",
  icon: "video",
  label: "Video",
  color: "#e56c1b"
}, {
  k: "tag",
  icon: "at-sign",
  label: "Tag people",
  color: "#1d7fc4"
}, {
  k: "loc",
  icon: "map-pin",
  label: "Location",
  color: "#d03b3b"
}, {
  k: "feel",
  icon: "smile",
  label: "Feeling",
  color: "#d4a017"
}];
const JN_FEELINGS = ["😊 happy", "🤩 excited", "😌 relaxed", "😬 nervous", "🥱 tired", "💪 motivated", "🙏 grateful", "😣 sore"];
const JN_MEDIA_SOURCES = {
  photo: {
    title: "Add photos",
    rows: [{
      k: "library",
      icon: "images",
      label: "Photo library",
      sub: "Choose up to 5 photos"
    }, {
      k: "camera",
      icon: "camera",
      label: "Take a photo",
      sub: "Open the camera now"
    }]
  },
  video: {
    title: "Add a video",
    rows: [{
      k: "library",
      icon: "film",
      label: "Video library",
      sub: "Choose a clip from your gallery"
    }, {
      k: "camera",
      icon: "video",
      label: "Record a video",
      sub: "Capture one right now"
    }]
  }
};
function jnReadImage(file, max = 1280) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
function CPSheetJN({
  title,
  onClose,
  children,
  done
}) {
  useEffectJN(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-sheet-grip",
    "aria-hidden": "true"
  }), done ? /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-hd"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("button", {
    className: "cp-sheet-done",
    "aria-label": "Done",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 22,
    color: "var(--brand-navy)"
  }))) : /*#__PURE__*/React.createElement("h3", null, title), children));
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
  const fileRef = useRefJN(null);
  const fileCfg = useRefJN({});
  const taRef = useRefJN(null);
  const bg = JN_BACKGROUNDS.find(b => b.id === bgId) || JN_BACKGROUNDS[0];
  const canPost = text.trim().length > 0 || images.length > 0 || !!video;
  const backTo = qJN("ret") || "JaneNewsfeed.html";
  useEffectJN(() => {
    if (taRef.current) taRef.current.focus();
  }, []);
  function pickSource(kind, src) {
    setSheet(null);
    fileCfg.current = {
      kind,
      src
    };
    const input = fileRef.current;
    if (!input) return;
    input.accept = kind === "photo" ? "image/*" : "video/*";
    input.multiple = kind === "photo";
    if (src === "camera") input.setAttribute("capture", "environment");else input.removeAttribute("capture");
    input.value = "";
    input.click();
  }
  async function onFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (fileCfg.current.kind === "video") {
      const f = files[0];
      setVideo({
        src: URL.createObjectURL(f),
        name: f.name
      });
      setBgId("none");
      return;
    }
    const room = Math.max(0, 5 - images.length);
    const out = [];
    for (const f of files.slice(0, room)) {
      const d = await jnReadImage(f);
      if (d) out.push(d);
    }
    if (out.length) {
      setImages(p => [...p, ...out]);
      setBgId("none");
    }
    if (files.length > room) showToast("Photo limit is 5");
  }
  function insertMention() {
    const t = text.replace(/\s*$/, "");
    setText((t ? t + " " : "") + "@Katy Wilson ");
    if (taRef.current) taRef.current.focus();
  }
  function post() {
    const posts = loadPosts();
    const p = {
      id: "p" + Date.now(),
      by: "jane",
      t: "Just now",
      text: text.trim() + (feeling ? "\n— feeling " + feeling : "") + (loc ? "\n📍 " + loc : ""),
      likes: 0,
      shares: 0,
      liked: false,
      reaction: null,
      comments: [],
      tags,
      dest
    };
    if (images.length) p.imgs = images;
    if (video) p.video = {
      name: video.name
    };
    if (bg.css) p.bg = {
      css: bg.css,
      fg: bg.fg
    };
    try {
      saveJN(POSTS_KEY, [p, ...posts]);
    } catch (e) {
      p.imgs = images.slice(0, 1);
      try {
        saveJN(POSTS_KEY, [p, ...posts]);
      } catch (e2) {
        delete p.imgs;
        saveJN(POSTS_KEY, [p, ...posts]);
      }
    }
    goJN(dest === "katy" ? "JaneMessages.html?to=katy" : "JaneNewsfeed.html?posted=1");
  }
  const d = JN_DESTS.find(x => x.k === dest);
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-screen jn-cp",
    "data-screen-label": "Create Post (Jane)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "cp-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-cancel",
    onClick: () => goJN(backTo)
  }, "Cancel"), /*#__PURE__*/React.createElement("span", {
    className: "cp-title"
  }, "Create Post"), /*#__PURE__*/React.createElement("button", {
    className: "cp-post-btn",
    disabled: !canPost,
    onClick: post
  }, dest === "katy" ? "Send" : "Post")), /*#__PURE__*/React.createElement("div", {
    className: "cp-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-author"
  }, /*#__PURE__*/React.createElement(DSJN.Avatar, {
    name: JANE.name,
    src: JANE.avatar,
    size: 46
  }), /*#__PURE__*/React.createElement("div", {
    className: "cp-author-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-author-name-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-author-name"
  }, JANE.name)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-channel-btn",
    onClick: () => setSheet("dest"),
    "aria-haspopup": "dialog"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: d.icon,
    size: 14,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("span", {
    className: dest === "feed" ? "cp-channel-feed" : "cp-channel-chip"
  }, dest === "feed" ? "Post to Clinic feed" : d.label), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-down",
    size: 14,
    color: "var(--gray-500)"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "cp-compose" + (bg.css ? " cp-compose-bg" : ""),
    style: bg.css ? {
      background: bg.css
    } : undefined
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    className: "cp-textarea" + (bg.css ? " on-bg" : ""),
    placeholder: dest === "katy" ? "Write a private note to Katy…" : "What's on your mind?",
    value: text,
    style: bg.css ? {
      color: bg.fg
    } : undefined,
    onChange: e => setText(e.target.value)
  }), bg.css && /*#__PURE__*/React.createElement("button", {
    className: "cp-bg-fab",
    "aria-label": "Change background style",
    onClick: () => setSheet("bg")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-bg-aa"
  }, "Aa"))), (feeling || loc) && /*#__PURE__*/React.createElement("div", {
    className: "jn-cp-meta"
  }, feeling && /*#__PURE__*/React.createElement("span", {
    className: "jn-cp-chip",
    onClick: () => setFeeling(null)
  }, "feeling ", feeling, /*#__PURE__*/React.createElement(IcJN, {
    name: "x",
    size: 12
  })), loc && /*#__PURE__*/React.createElement("span", {
    className: "jn-cp-chip",
    onClick: () => setLoc(null)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "map-pin",
    size: 12
  }), loc, /*#__PURE__*/React.createElement(IcJN, {
    name: "x",
    size: 12
  }))), video && /*#__PURE__*/React.createElement("div", {
    className: "cp-video-wrap"
  }, /*#__PURE__*/React.createElement("video", {
    src: video.src,
    className: "cp-video-cover",
    muted: true,
    playsInline: true,
    preload: "metadata"
  }), /*#__PURE__*/React.createElement("button", {
    className: "cp-video-rm",
    "aria-label": "Remove video",
    onClick: () => setVideo(null)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "x",
    size: 14,
    color: "var(--white)"
  }))), images.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cp-images cp-images-" + images.length + (video ? " cp-images-with-video" : "")
  }, images.map((src, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "cp-img-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    className: "cp-img"
  }), /*#__PURE__*/React.createElement("button", {
    className: "cp-img-rm",
    "aria-label": "Remove",
    onClick: () => setImages(p => p.filter((_, j) => j !== i))
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "x",
    size: 14,
    color: "var(--white)"
  }))))), (images.length > 0 || video) && /*#__PURE__*/React.createElement("p", {
    className: "cp-media-count"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "paperclip",
    size: 12,
    color: "var(--gray-500)"
  }), [video ? "1 video" : null, images.length ? images.length + (images.length === 1 ? " photo" : " photos") : null].filter(Boolean).join(" · "), images.length < 5 ? " · add up to " + (5 - images.length) + " more photo" + (5 - images.length === 1 ? "" : "s") : " · photo limit reached"), /*#__PURE__*/React.createElement("div", {
    className: "cp-tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-attach-label"
  }, "Add hashtags"), /*#__PURE__*/React.createElement("div", {
    className: "pf-tagbar"
  }, JN_TAGS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.slug,
    type: "button",
    className: "pf-tagchip" + (tags.includes(t.slug) ? " on" : ""),
    onClick: () => setTags(p => p.includes(t.slug) ? p.filter(x => x !== t.slug) : [...p, t.slug])
  }, "#", t.label))))), /*#__PURE__*/React.createElement("div", {
    className: "cp-attach-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-attach-label"
  }, "Add to your post"), /*#__PURE__*/React.createElement("div", {
    className: "cp-attach-row"
  }, JN_ATTACH.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.k,
    className: "cp-attach-btn",
    "aria-label": a.label,
    disabled: a.k === "photo" && (!!bg.css || images.length >= 5) || a.k === "video" && (!!bg.css || !!video),
    onClick: a.k === "photo" ? () => setSheet("photo") : a.k === "video" ? () => setSheet("video") : a.k === "tag" ? insertMention : a.k === "loc" ? () => setSheet("loc") : () => setSheet("feel")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: a.icon,
    size: 24,
    color: a.color
  }))), /*#__PURE__*/React.createElement("button", {
    className: "cp-attach-btn",
    "aria-label": "Background",
    disabled: images.length > 0 || !!video,
    onClick: () => setSheet("bg")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-bg-aa lg"
  }, "Aa")))), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    hidden: true,
    onChange: onFiles
  }), sheet === "bg" && /*#__PURE__*/React.createElement(CPSheetJN, {
    title: "Background",
    done: true,
    onClose: () => setSheet(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-swatches",
    role: "radiogroup",
    "aria-label": "Background style"
  }, JN_BACKGROUNDS.map(b => /*#__PURE__*/React.createElement("button", {
    key: b.id,
    role: "radio",
    "aria-checked": b.id === bgId,
    "aria-label": b.label,
    className: "cp-swatch" + (b.id === bgId ? " on" : "") + (b.id === "none" ? " none" : ""),
    style: b.css ? {
      background: b.css
    } : undefined,
    onClick: () => {
      setBgId(b.id);
      if (b.css) {
        setImages([]);
        setVideo(null);
      }
    }
  }, b.id === "none" && /*#__PURE__*/React.createElement(IcJN, {
    name: "ban",
    size: 20,
    color: "var(--gray-450)"
  }), b.id === bgId && b.id !== "none" && /*#__PURE__*/React.createElement("span", {
    className: "cp-swatch-ck"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 15,
    color: "var(--brand-navy)"
  })))))), sheet === "dest" && /*#__PURE__*/React.createElement(CPSheetJN, {
    title: "Post to",
    onClose: () => setSheet(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-list",
    role: "radiogroup",
    "aria-label": "Destination"
  }, JN_DESTS.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.k,
    type: "button",
    role: "radio",
    "aria-checked": dest === x.k,
    className: "cp-opt" + (dest === x.k ? " on" : ""),
    onClick: () => {
      setDest(x.k);
      setSheet(null);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: x.icon,
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-tx"
  }, /*#__PURE__*/React.createElement("b", null, x.label), /*#__PURE__*/React.createElement("i", null, x.sub)), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-rd"
  }, dest === x.k && /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 14,
    color: "#fff"
  })))))), (sheet === "photo" || sheet === "video") && /*#__PURE__*/React.createElement(CPSheetJN, {
    title: JN_MEDIA_SOURCES[sheet].title,
    onClose: () => setSheet(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-list"
  }, JN_MEDIA_SOURCES[sheet].rows.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.k,
    type: "button",
    className: "cp-opt",
    onClick: () => pickSource(sheet, r.k)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: r.icon,
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-tx"
  }, /*#__PURE__*/React.createElement("b", null, r.label), /*#__PURE__*/React.createElement("i", null, r.sub)), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 18,
    color: "var(--gray-400)"
  }))))), sheet === "loc" && /*#__PURE__*/React.createElement(CPSheetJN, {
    title: "Add a location",
    onClose: () => setSheet(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-list"
  }, [["Pearce Aesthetics, Manchester", "building-2"], ["Home", "home"], ["Manchester, UK", "map-pin"], ["Use my current location", "navigation"]].map(([l, ic]) => /*#__PURE__*/React.createElement("button", {
    key: l,
    type: "button",
    className: "cp-opt" + (loc === l ? " on" : ""),
    onClick: () => {
      setLoc(l === "Use my current location" ? "Manchester, UK" : l);
      setSheet(null);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: ic,
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-tx"
  }, /*#__PURE__*/React.createElement("b", null, l)), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-rd"
  }, loc === l && /*#__PURE__*/React.createElement(IcJN, {
    name: "check",
    size: 14,
    color: "#fff"
  })))))), sheet === "feel" && /*#__PURE__*/React.createElement(CPSheetJN, {
    title: "How are you feeling?",
    onClose: () => setSheet(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-cp-feel"
  }, JN_FEELINGS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    className: feeling === f ? "on" : "",
    onClick: () => {
      setFeeling(f);
      setSheet(null);
    }
  }, f)))), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   mount
   ======================================================================= */
const JN_SCREENS = {
  pass: HealthPassScreen,
  schedule: ScheduleCallScreen,
  create: CreatePostScreen,
  home: HomeScreen,
  profile: ProfileScreen,
  onboarding: OnboardingScreen,
  wearables: WearablesScreen,
  health: HealthScreen,
  coach: CoachScreen,
  events: EventsScreen
};
function JaneApp() {
  const Screen = JN_SCREENS[JN_PAGE] || HomeScreen;
  const mobile = useIsMobileJN();
  const scale = useDeviceScaleJN();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(Screen, null));
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "scale(" + scale + ")",
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(Screen, null))));
}
if (!window.PF_JN_NO_MOUNT) ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(JaneApp, null));
