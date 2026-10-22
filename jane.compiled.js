/* ===========================================================================
   PROfinity — Jane (patient) app · iPhone 17 Pro Max
   The second mobile link (profinity-mobile-2.vercel.app) is the PATIENT side
   of PROfinity: "Jane" is the patient persona, "Katie/Katy" the clinician
   (same split as the Flutter app's user_type 'jane' | 'katy'). One bundle
   serves eight shells, picked by window.PF_JN_PAGE:
     home · profile · onboarding · wearables · health · coach · events · messages
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
  avatar: "assets/avatar-katy.jpg",
  role: "Clinician",
  title: "Registered Nurse · Pearce Aesthetics"
};
const PEOPLE = {
  katy: KATY,
  beth: {
    id: "beth",
    name: "Nurse Beth",
    avatar: "assets/avatar-nurse-beth.jpg",
    role: "Clinician",
    title: "Aesthetic Nurse"
  },
  priya: {
    id: "priya",
    name: "Dr Priya Shah",
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
function unreadDMJN() {
  return readJN("pf-jane-dm", null) ? readJN("pf-jane-dm", {}).convs.reduce((n, c) => n + (c.unread || 0), 0) : 2;
}
function JNTabs({
  active
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "jn-tabs",
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
   HOME — newsfeed (posts from Katies and other Janes)
   ======================================================================= */
const POSTS_KEY = "pf-jane-posts";
const POSTS_SEED = [{
  id: "p1",
  by: "katy",
  t: "2h",
  text: "Winter skin reminder 🧴 Cold air + central heating = dehydrated skin. Double-cleanse at night, layer a hyaluronic serum under your moisturiser, and yes — SPF still counts in December.",
  likes: 48,
  liked: false,
  comments: [{
    by: "miranda",
    text: "Guilty of skipping SPF when it's grey out 🙈"
  }, {
    by: "katy",
    text: "The UVA doesn't care about the clouds Miranda 😄"
  }]
}, {
  id: "p2",
  by: "miranda",
  t: "4h",
  text: "6 weeks post lip filler and I've finally stopped overthinking it. Katy was right about the swelling timeline 😅 Any tips for keeping lips hydrated through winter?",
  img: "assets/clinic-lip-design.png",
  likes: 21,
  liked: true,
  comments: [{
    by: "beth",
    text: "A plain balm (no menthol or 'plumping' ingredients) and a big glass of water before bed. Simple wins."
  }, {
    by: "amir",
    text: "They look so natural!"
  }]
}, {
  id: "p3",
  by: "beth",
  t: "Yesterday",
  text: "Aftercare 101 after anti-wrinkle treatment: no lying flat for 4 hours, skip the gym today, no facials or massage for 2 weeks, and don't rub the area. Save this post 📌",
  likes: 73,
  liked: false,
  comments: []
}, {
  id: "p4",
  by: "amir",
  t: "Yesterday",
  text: "Just booked my first consultation 🙈 nervous but excited. What should I ask? Anything you wish you'd known before your first one?",
  likes: 12,
  liked: false,
  comments: [{
    by: "mark",
    text: "Ask about the downtime for YOUR job — mine was more than I expected."
  }, {
    by: "katy",
    text: "Bring a list of medications and any allergies, and photos of looks you like AND don't like. See you Thursday Amir!"
  }]
}, {
  id: "p5",
  by: "priya",
  t: "2d",
  text: "Patient Q&A live this Thursday 7pm — bring your questions about skin boosters, what they do and who they suit. Free for all clinic patients.",
  event: "ev1",
  likes: 35,
  liked: false,
  comments: []
}, {
  id: "p6",
  by: "mark",
  t: "3d",
  text: "Week 3 of the sleep + hydration plan from the coach. Energy is noticeably better and my skin check-in score has gone from 61 to 72. Small habits, big difference.",
  likes: 29,
  liked: false,
  comments: [{
    by: "katy",
    text: "This is exactly it Mark 👏"
  }]
}];
function loadPosts() {
  return readJN(POSTS_KEY, null) || POSTS_SEED;
}
function PostCardJN({
  p,
  onLike,
  onComment,
  onShare
}) {
  const a = PEOPLE[p.by];
  return /*#__PURE__*/React.createElement("article", {
    className: "jn-post"
  }, /*#__PURE__*/React.createElement("header", {
    className: "jn-post-h"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: a,
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-post-who"
  }, /*#__PURE__*/React.createElement("b", null, a.name), /*#__PURE__*/React.createElement("span", null, a.title, " · ", p.t)), /*#__PURE__*/React.createElement(RoleChip, {
    p: a
  })), /*#__PURE__*/React.createElement("p", {
    className: "jn-post-txt"
  }, p.text), p.img && /*#__PURE__*/React.createElement("img", {
    className: "jn-post-img",
    src: p.img,
    alt: ""
  }), p.event && /*#__PURE__*/React.createElement("button", {
    className: "jn-post-ev",
    onClick: () => goJN("JaneEvents.html?event=" + p.event)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Skin Boosters Q&A · Live"), /*#__PURE__*/React.createElement("small", null, "Thu 29 Oct · 7:00pm · Online")), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 18,
    color: "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("footer", {
    className: "jn-post-f"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-act" + (p.liked ? " on" : ""),
    onClick: () => onLike(p)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "heart",
    size: 18
  }), p.likes), /*#__PURE__*/React.createElement("button", {
    className: "jn-act",
    onClick: () => onComment(p)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "message-square",
    size: 18
  }), p.comments.length), /*#__PURE__*/React.createElement("button", {
    className: "jn-act",
    onClick: () => onShare(p)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "share-2",
    size: 18
  }), "Share")));
}
function HomeScreen() {
  const [posts, setPosts] = useStateJN(loadPosts);
  const [filter, setFilter] = useStateJN("all");
  const [composeOpen, setComposeOpen] = useStateJN(false);
  const [draft, setDraft] = useStateJN("");
  const [commentPost, setCommentPost] = useStateJN(null);
  const [cDraft, setCDraft] = useStateJN("");
  const [toast, showToast] = useToastJN();
  const onb = onbState();
  const wear = connectedWearables();
  const onbPct = onb.done ? 100 : Math.round(Object.keys(onb.answers).length / ONB_STEPS.length * 100);
  function persist(list) {
    setPosts(list);
    saveJN(POSTS_KEY, list);
  }
  function like(p) {
    persist(posts.map(x => x.id === p.id ? {
      ...x,
      liked: !x.liked,
      likes: x.likes + (x.liked ? -1 : 1)
    } : x));
  }
  function addComment() {
    const t = cDraft.trim();
    if (!t) return;
    const list = posts.map(x => x.id === commentPost.id ? {
      ...x,
      comments: [...x.comments, {
        by: "jane",
        text: t
      }]
    } : x);
    persist(list);
    setCommentPost(list.find(x => x.id === commentPost.id));
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
      liked: false,
      comments: []
    }, ...posts]);
    setDraft("");
    setComposeOpen(false);
    showToast("Shared with your clinic and other Janes");
  }
  const shown = posts.filter(p => filter === "all" || (filter === "katies" ? PEOPLE[p.by].role === "Clinician" : PEOPLE[p.by].role === "Patient"));
  const curPost = commentPost ? posts.find(x => x.id === commentPost.id) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen"
  }, /*#__PURE__*/React.createElement(JNTop, null), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "jn-hello"
  }, /*#__PURE__*/React.createElement("h2", null, "Good morning, ", JANE.first, " 👋"), /*#__PURE__*/React.createElement("p", null, wear.length ? "Sleep " + fmtH(HEALTH.sleep[6]) + " · " + HEALTH.steps[6].toLocaleString() + " steps so far" : "Your clinic feed, health and coach in one place.")), !onb.done && /*#__PURE__*/React.createElement("button", {
    className: "jn-nudge",
    onClick: () => goJN("JaneOnboarding.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ring",
    style: {
      "--p": onbPct
    }
  }, /*#__PURE__*/React.createElement("b", null, onbPct, "%")), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Finish your Health Pass"), /*#__PURE__*/React.createElement("small", null, onbPct ? "Pick up where you left off" : "6 quick questions so Katy can tailor your care")), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-today"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-tile",
    onClick: () => goJN("JaneHealth.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "moon",
    size: 18,
    color: "#6c63ff"
  }), /*#__PURE__*/React.createElement("b", null, fmtH(HEALTH.sleep[6])), /*#__PURE__*/React.createElement("small", null, "Sleep")), /*#__PURE__*/React.createElement("button", {
    className: "jn-tile",
    onClick: () => goJN("JaneHealth.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "footprints",
    size: 18,
    color: "#16a34a"
  }), /*#__PURE__*/React.createElement("b", null, HEALTH.steps[6].toLocaleString()), /*#__PURE__*/React.createElement("small", null, "Steps")), /*#__PURE__*/React.createElement("button", {
    className: "jn-tile",
    onClick: () => goJN("JaneHealth.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "sun",
    size: 18,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("b", null, HEALTH.skin[6]), /*#__PURE__*/React.createElement("small", null, "Skin score"))), !wear.length && /*#__PURE__*/React.createElement("button", {
    className: "jn-connect",
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
  })), /*#__PURE__*/React.createElement("button", {
    className: "jn-compose",
    onClick: () => setComposeOpen(true)
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: JANE,
    size: 38
  }), /*#__PURE__*/React.createElement("span", null, "Share an update with your clinic…"), /*#__PURE__*/React.createElement(IcJN, {
    name: "image",
    size: 20,
    color: "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-chips"
  }, [["all", "All"], ["katies", "From clinicians"], ["janes", "From other patients"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: "jn-chip" + (filter === k ? " on" : ""),
    onClick: () => setFilter(k)
  }, l))), shown.map(p => /*#__PURE__*/React.createElement(PostCardJN, {
    key: p.id,
    p: p,
    onLike: like,
    onComment: x => setCommentPost(x),
    onShare: () => showToast("Link copied")
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "You're all caught up ✨")), /*#__PURE__*/React.createElement(JNTabs, {
    active: "home"
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
    onClose: () => setCommentPost(null),
    title: "Comments",
    tall: true
  }, curPost && /*#__PURE__*/React.createElement("div", {
    className: "jn-comments"
  }, curPost.comments.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "jn-empty"
  }, "No comments yet. Be the first."), curPost.comments.map((c, i) => {
    const a = PEOPLE[c.by];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "jn-comment"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: a,
      size: 32
    }), /*#__PURE__*/React.createElement("div", {
      className: "bub"
    }, /*#__PURE__*/React.createElement("b", null, a.name, " ", /*#__PURE__*/React.createElement(RoleChip, {
      p: a
    })), /*#__PURE__*/React.createElement("p", null, c.text)));
  })), /*#__PURE__*/React.createElement("div", {
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
   PROFILE / HEALTH PASS
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
function ProfileScreen() {
  const [prof, setProf] = useStateJN(() => readJN(PROFILE_KEY, {
    name: JANE.name,
    phone: "+44 7700 900123",
    email: "jane.taylor@example.com",
    dob: JANE.dob
  }));
  const [edit, setEdit] = useStateJN(qJN("edit") === "1");
  const [passOpen, setPassOpen] = useStateJN(false);
  const [draft, setDraft] = useStateJN(prof);
  const [toast, showToast] = useToastJN();
  const onb = onbState();
  const wear = connectedWearables();
  const medical = onb.answers.medical || ["No known allergies"];
  const goalsChosen = onb.answers.goals || [];
  function save() {
    setProf(draft);
    saveJN(PROFILE_KEY, draft);
    setEdit(false);
    showToast("Profile updated");
  }
  const Row = ({
    icon,
    label,
    sub,
    href,
    onClick,
    danger
  }) => /*#__PURE__*/React.createElement("button", {
    className: "jn-row" + (danger ? " danger" : ""),
    onClick: onClick || (() => goJN(href))
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: icon,
    size: 18,
    color: danger ? "var(--error)" : "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, label), sub && /*#__PURE__*/React.createElement("small", null, sub)), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 18,
    color: "var(--gray-450)"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen"
  }, /*#__PURE__*/React.createElement(JNTop, {
    title: "Profile"
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "jn-prof"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: JANE,
    size: 88,
    className: "big"
  }), /*#__PURE__*/React.createElement("h2", null, prof.name), /*#__PURE__*/React.createElement("p", null, "Patient at ", JANE.clinic, " · with ", KATY.name), /*#__PURE__*/React.createElement("div", {
    className: "jn-row-btns center"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm",
    onClick: () => {
      setDraft(prof);
      setEdit(true);
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "pencil",
    size: 16
  }), "Edit profile"), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm ghost",
    onClick: () => goJN("JaneMessages.html?to=katy")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "message-circle",
    size: 16
  }), "Message Katy"))), /*#__PURE__*/React.createElement("button", {
    className: "jn-pass",
    onClick: () => setPassOpen(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-top"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity"
  }), /*#__PURE__*/React.createElement("span", {
    className: "st"
  }, onb.done ? "Active" : "Incomplete")), /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-mid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Health Pass"), /*#__PURE__*/React.createElement("b", null, prof.name), /*#__PURE__*/React.createElement("small", null, "ID ", JANE.passId, " · DOB ", prof.dob)), /*#__PURE__*/React.createElement("div", {
    className: "jn-pass-bot"
  }, /*#__PURE__*/React.createElement("span", null, JANE.clinic, " · member since ", JANE.since), /*#__PURE__*/React.createElement("span", {
    className: "qrbtn"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "qr-code",
    size: 16,
    color: "#fff"
  }), "Show"))), !onb.done && /*#__PURE__*/React.createElement("button", {
    className: "jn-link-row",
    onClick: () => goJN("JaneOnboarding.html")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "alert-circle",
    size: 16,
    color: "var(--warning)"
  }), "Complete the onboarding questionnaire to activate your pass", /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 16
  })), /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "Medical history"), /*#__PURE__*/React.createElement("div", {
    className: "jn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-tags"
  }, medical.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    className: "jn-tag"
  }, m))), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Previous treatments"), /*#__PURE__*/React.createElement("b", null, onb.answers.history || "Not answered")), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Last treatment"), /*#__PURE__*/React.createElement("b", null, "Lip filler · 1 Oct 2026")), /*#__PURE__*/React.createElement("div", {
    className: "jn-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Next review"), /*#__PURE__*/React.createElement("b", null, "Mon 3 Nov · 2:30pm"))), /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "Supplements"), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
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
  }, /*#__PURE__*/React.createElement("b", null, s.n), /*#__PURE__*/React.createElement("small", null, s.d, " · ", s.f)))), /*#__PURE__*/React.createElement("button", {
    className: "jn-li add",
    onClick: () => showToast("Ask Katy to add a supplement")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "plus",
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Add supplement")))), /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "Goals"), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
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
  })))), goalsChosen.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "jn-tags pad"
  }, goalsChosen.map(g => /*#__PURE__*/React.createElement("span", {
    key: g,
    className: "jn-tag gold"
  }, g)))), /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "Wearables & analytics"), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
  }, /*#__PURE__*/React.createElement(Row, {
    icon: "watch",
    label: wear.length ? wear.map(w => w.name).join(", ") : "No wearables connected",
    sub: wear.length ? "Synced a few minutes ago" : "Connect Apple Health, Oura, Fitbit and more",
    href: "JaneWearables.html"
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "heart-pulse",
    label: "Health Analytics",
    sub: "Sleep, movement, nutrition and skin trends",
    href: "JaneHealth.html"
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "clipboard-list",
    label: "Onboarding questionnaire",
    sub: onb.done ? "Completed · tap to review" : "Not finished",
    href: "JaneOnboarding.html"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "More"), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
  }, /*#__PURE__*/React.createElement(Row, {
    icon: "message-circle",
    label: "Messages",
    href: "JaneMessages.html"
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "calendar",
    label: "Events",
    href: "JaneEvents.html"
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "sparkles",
    label: "Coach",
    href: "JaneCoach.html"
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "shield-check",
    label: "Privacy & sharing",
    sub: "Your Health Pass is shared with Pearce Aesthetics only",
    onClick: () => showToast("Sharing settings coming soon")
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "log-out",
    label: "Log out",
    danger: true,
    onClick: () => showToast("Logged out (demo)")
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "PROfinity · patient app")), /*#__PURE__*/React.createElement(JNTabs, {
    active: "profile"
  }), /*#__PURE__*/React.createElement(JNSheet, {
    open: edit,
    onClose: () => setEdit(false),
    title: "Edit profile"
  }, [["name", "Full name"], ["dob", "Date of birth"], ["phone", "Phone"], ["email", "Email"]].map(([k, l]) => /*#__PURE__*/React.createElement("label", {
    key: k,
    className: "jn-field"
  }, /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    value: draft[k],
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
  }, /*#__PURE__*/React.createElement(QRMark, null), /*#__PURE__*/React.createElement("b", null, prof.name), /*#__PURE__*/React.createElement("small", null, "Health Pass ", JANE.passId), /*#__PURE__*/React.createElement("p", null, "Show this at reception. It gives ", JANE.clinic, " your medical history, consent and treatment record."), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    onClick: () => setPassOpen(false)
  }, "Done"))), /*#__PURE__*/React.createElement(JNToast, {
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
  })), /*#__PURE__*/React.createElement("h2", null, "Your Health Pass is ready"), /*#__PURE__*/React.createElement("p", null, "Thanks ", JANE.first, ". Katy can now see your history, goals and preferences before your next visit."), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn block",
    onClick: () => goJN("JaneProfile.html")
  }, "View my Health Pass"), /*#__PURE__*/React.createElement("button", {
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
  }, "Your Health Pass is private. Sharing lets ", KATY.name, " prepare for your appointments and tailor aftercare."), /*#__PURE__*/React.createElement("button", {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen"
  }, /*#__PURE__*/React.createElement(JNBar, {
    title: "Connect your wearables",
    back: () => history.length > 1 ? history.back() : goJN("JaneProfile.html")
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "jn-wear-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "orbit"
  }, /*#__PURE__*/React.createElement("span", {
    className: "c1"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "moon",
    size: 16,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "c2"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "footprints",
    size: 16,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "c3"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "droplets",
    size: 16,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "core"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "heart-pulse",
    size: 26,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("h2", null, "Your body, in your Health Pass"), /*#__PURE__*/React.createElement("p", null, "We read sleep, movement and nutrition only. Nothing is shared beyond your clinic, and you can disconnect any time.")), connected.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
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
  }, "Data stays on your Health Pass · encrypted in transit")), /*#__PURE__*/React.createElement(JNSheet, {
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
  }, /*#__PURE__*/React.createElement("b", null, sel.name), " is connected and syncing sleep, movement and nutrition to your Health Pass."), /*#__PURE__*/React.createElement("button", {
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
function HealthScreen() {
  const [period, setPeriod] = useStateJN("week");
  const [toast, showToast] = useToastJN();
  const wear = connectedWearables();
  const score = 78;
  const sleepAvg = avg(HEALTH.sleep),
    stepsAvg = Math.round(avg(HEALTH.steps)),
    waterAvg = avg(HEALTH.water);
  const INSIGHTS = [{
    ic: "trending-up",
    c: "var(--success)",
    t: "Sleep is up 12% on last week",
    s: "Average " + fmtH(sleepAvg) + ". Your best nights were Fri–Sat."
  }, {
    ic: "droplets",
    c: "#0ea5e9",
    t: "Hydration below goal 3 of 7 days",
    s: "You drink less on days under 6,000 steps. Try a bottle on your desk."
  }, {
    ic: "sun",
    c: "var(--brand-gold)",
    t: "Skin score climbing",
    s: "From 62 to 78 since you started SPF daily. Katy will love this."
  }, {
    ic: "heart-pulse",
    c: "var(--brand-rose)",
    t: "Resting heart rate 61 bpm",
    s: "Steady and in a healthy range for you."
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen"
  }, /*#__PURE__*/React.createElement(JNTop, {
    title: "Health Analytics",
    sub: wear.length ? "Live from " + wear.map(w => w.name).join(", ") : "Sample data until a wearable is connected"
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll"
  }, !wear.length && /*#__PURE__*/React.createElement("button", {
    className: "jn-connect slim",
    onClick: () => goJN("JaneWearables.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "watch",
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Connect a wearable for live data")), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 18,
    color: "rgba(255,255,255,.8)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-seg"
  }, [["week", "This week"], ["month", "This month"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: period === k ? "on" : "",
    onClick: () => setPeriod(k)
  }, l))), /*#__PURE__*/React.createElement("section", {
    className: "jn-score"
  }, /*#__PURE__*/React.createElement(Ring, {
    value: score / 100
  }, /*#__PURE__*/React.createElement("b", null, score), /*#__PURE__*/React.createElement("small", null, "Wellness")), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h2", null, "Looking good, ", JANE.first), /*#__PURE__*/React.createElement("p", null, "Your score blends sleep, movement, hydration and your daily skin check-in. Up 6 points ", period === "week" ? "this week" : "this month", "."), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm",
    onClick: () => showToast("Summary sent to " + KATY.name)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "send",
    size: 15
  }), "Share with Katy"))), /*#__PURE__*/React.createElement("div", {
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
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Sleep"), /*#__PURE__*/React.createElement("small", null, "Average ", fmtH(sleepAvg), " · goal 7h 30m")), /*#__PURE__*/React.createElement("span", {
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
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Movement"), /*#__PURE__*/React.createElement("small", null, "Average ", stepsAvg.toLocaleString(), " steps · goal 8,000")), /*#__PURE__*/React.createElement("span", {
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
      background: "#e0f2fe"
    }
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "droplets",
    size: 18,
    color: "#0ea5e9"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Nutrition"), /*#__PURE__*/React.createElement("small", null, "Water ", waterAvg.toFixed(1), " L a day · goal 2 L")), /*#__PURE__*/React.createElement("span", {
    className: "delta"
  }, "−8%")), /*#__PURE__*/React.createElement(Bars, {
    data: HEALTH.water,
    color: "#0ea5e9",
    max: 2.6,
    fmt: v => v.toFixed(1),
    unit: " L"
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-nutri"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "82g"), /*#__PURE__*/React.createElement("small", null, "Protein")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "3.4"), /*#__PURE__*/React.createElement("small", null, "Veg portions")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "1"), /*#__PURE__*/React.createElement("small", null, "Caffeine after 2pm")))), /*#__PURE__*/React.createElement("div", {
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
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Skin check-in"), /*#__PURE__*/React.createElement("small", null, "Today ", HEALTH.skin[6], " · from your daily selfie rating")), /*#__PURE__*/React.createElement("span", {
    className: "delta up"
  }, "+16")), /*#__PURE__*/React.createElement(Line, {
    data: HEALTH.skin,
    color: "#CE9957"
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-days"
  }, DAYS.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, d)))), /*#__PURE__*/React.createElement("h3", {
    className: "jn-h"
  }, "Insights"), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
  }, INSIGHTS.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.t,
    className: "jn-li"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: x.ic,
    size: 17,
    color: x.c
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, x.t), /*#__PURE__*/React.createElement("small", null, x.s))))), /*#__PURE__*/React.createElement("button", {
    className: "jn-coachcta",
    onClick: () => goJN("JaneCoach.html?q=" + encodeURIComponent("How can I improve my hydration this week?"))
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "sparkles",
    size: 18,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("span", null, "Ask the coach how to lift your hydration score"), /*#__PURE__*/React.createElement(IcJN, {
    name: "chevron-right",
    size: 18,
    color: "var(--ai-purple)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "Not medical advice · talk to your clinician about any concerns")), /*#__PURE__*/React.createElement(JNTabs, {
    active: "health"
  }), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   COACH — chat or voice
   ======================================================================= */
const COACH_KEY = "pf-jane-coach";
const COACH = {
  name: "PROfinity Coach",
  sub: "Reviewed by " + KATY.name,
  avatar: "assets/profinity-icon-purple-gold.png"
};
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
function loadCoach() {
  return readJN(COACH_KEY, {
    msgs: [{
      by: "coach",
      text: "Hi " + JANE.first + " 👋 I'm your wellness coach. I can help with aftercare, routines, sleep and getting ready for appointments. Chat here, or switch to voice.",
      ts: Date.now() - 3600000
    }]
  });
}
function fmtClockJN(ts) {
  const d = new Date(ts);
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}
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
  function persist(s) {
    setStore(s);
    saveJN(COACH_KEY, s);
  }
  function send(text) {
    const t = (text || draft).trim();
    if (!t || typing) return;
    const s = {
      msgs: [...store.msgs, {
        by: "jane",
        text: t,
        ts: Date.now()
      }]
    };
    persist(s);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      persist({
        msgs: [...s.msgs, {
          by: "coach",
          text: coachReply(t),
          ts: Date.now()
        }]
      });
      setTyping(false);
    }, 1100 + Math.random() * 600);
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
  }, [store.msgs.length, typing, mode]);
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
          persist({
            msgs: [...store.msgs, {
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
          });
          setTimeout(() => setVoice("idle"), 6000);
        }, 1200);
      }
    }, 180);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen jn-coachscr"
  }, /*#__PURE__*/React.createElement("header", {
    className: "jn-top"
  }, /*#__PURE__*/React.createElement("img", {
    className: "jn-face coach",
    src: COACH.avatar,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-top-txt"
  }, /*#__PURE__*/React.createElement("h1", null, COACH.name), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "jn-online"
  }), COACH.sub)), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-seg mini"
  }, [["chat", "message-circle", "Chat"], ["voice", "mic", "Voice"]].map(([k, ic, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: mode === k ? "on" : "",
    "aria-label": l,
    onClick: () => setMode(k)
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: ic,
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, l))))), mode === "chat" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll jn-thread",
    ref: scrollRef
  }, store.msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "jn-msg " + (m.by === "jane" ? "me" : "them")
  }, m.by !== "jane" && /*#__PURE__*/React.createElement("img", {
    className: "jn-face",
    src: COACH.avatar,
    alt: "",
    style: {
      width: 28,
      height: 28
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "bub"
  }, m.voice && /*#__PURE__*/React.createElement("small", {
    className: "vc"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "mic",
    size: 11
  }), " voice"), m.text.split("\n").map((l, j) => /*#__PURE__*/React.createElement("p", {
    key: j
  }, l || " ")), /*#__PURE__*/React.createElement("time", null, fmtClockJN(m.ts))))), typing && /*#__PURE__*/React.createElement("div", {
    className: "jn-msg them"
  }, /*#__PURE__*/React.createElement("img", {
    className: "jn-face",
    src: COACH.avatar,
    alt: "",
    style: {
      width: 28,
      height: 28
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "bub typing"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null))), /*#__PURE__*/React.createElement("div", {
    className: "jn-prompts"
  }, COACH_PROMPTS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: "jn-chip",
    onClick: () => send(p)
  }, p)))), /*#__PURE__*/React.createElement("div", {
    className: "jn-input-row dock"
  }, /*#__PURE__*/React.createElement("button", {
    className: "jn-iconbtn sm",
    "aria-label": "Voice",
    onClick: () => setMode("voice")
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "mic",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("input", {
    className: "jn-in",
    placeholder: "Ask your coach…",
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => e.key === "Enter" && send()
  }), /*#__PURE__*/React.createElement("button", {
    className: "jn-send",
    "aria-label": "Send",
    disabled: !draft.trim(),
    onClick: () => send()
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "send",
    size: 18,
    color: "#fff"
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "jn-voice"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-orb " + voice,
    onClick: talk,
    role: "button",
    "aria-label": "Tap to talk"
  }, /*#__PURE__*/React.createElement("span", {
    className: "r r1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "r r2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "r r3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "core"
  }, voice === "listening" ? /*#__PURE__*/React.createElement(IcJN, {
    name: "mic",
    size: 38,
    color: "#fff"
  }) : voice === "speaking" ? /*#__PURE__*/React.createElement(IcJN, {
    name: "volume-2",
    size: 38,
    color: "#fff"
  }) : voice === "thinking" ? /*#__PURE__*/React.createElement(IcJN, {
    name: "sparkles",
    size: 38,
    color: "#fff"
  }) : /*#__PURE__*/React.createElement(IcJN, {
    name: "mic",
    size: 38,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("b", {
    className: "jn-voice-state"
  }, voice === "idle" ? "Tap to talk" : voice === "listening" ? "Listening…" : voice === "thinking" ? "Thinking…" : "Speaking"), /*#__PURE__*/React.createElement("div", {
    className: "jn-voice-txt"
  }, heard && /*#__PURE__*/React.createElement("p", {
    className: "you"
  }, "“", heard, voice === "listening" ? "…" : "”"), said && /*#__PURE__*/React.createElement("div", {
    className: "ans"
  }, said.split("\n").map((l, j) => /*#__PURE__*/React.createElement("p", {
    key: j
  }, l || " "))), !heard && !said && /*#__PURE__*/React.createElement("p", {
    className: "hint"
  }, "Ask about aftercare, your routine, sleep or your next appointment. Your coach has your Health Pass to hand.")), /*#__PURE__*/React.createElement("div", {
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
  })))), /*#__PURE__*/React.createElement(JNTabs, {
    active: "coach"
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
function evIcsJN(e) {
  const p = PEOPLE[e.host];
  const m = /(\d+):(\d+)(am|pm)/.exec(e.time);
  let h = +m[1] % 12 + (m[3] === "pm" ? 12 : 0);
  const start = new Date(e.date + "T" + String(h).padStart(2, "0") + ":" + m[2] + ":00");
  const end = new Date(start.getTime() + e.dur * 60000);
  const f = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PROfinity//Jane//EN", "BEGIN:VEVENT", "UID:" + e.id + "@profinity", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(start), "DTEND:" + f(end), "SUMMARY:" + e.title, "LOCATION:" + e.where, "DESCRIPTION:Hosted by " + p.name + ". " + e.desc, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
  a.download = e.title.replace(/[^a-z0-9]+/gi, "-") + ".ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
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
  const Card = ({
    e
  }) => {
    const d = evDate(e);
    const h = PEOPLE[e.host];
    return /*#__PURE__*/React.createElement("article", {
      className: "jn-ev"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-ev-img",
      onClick: () => setOpen(e)
    }, /*#__PURE__*/React.createElement("img", {
      src: e.img,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", {
      className: "date"
    }, /*#__PURE__*/React.createElement("b", null, d.d), /*#__PURE__*/React.createElement("small", null, d.m)), e.online && /*#__PURE__*/React.createElement("span", {
      className: "live"
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "video",
      size: 12,
      color: "#fff"
    }), "Online")), /*#__PURE__*/React.createElement("div", {
      className: "jn-ev-body"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-ev-ttl",
      onClick: () => setOpen(e)
    }, e.title), /*#__PURE__*/React.createElement("div", {
      className: "jn-ev-meta"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "clock",
      size: 14
    }), d.wd, " ", d.d, " ", d.m, " · ", e.time), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IcJN, {
      name: "map-pin",
      size: 14
    }), e.where)), /*#__PURE__*/React.createElement("div", {
      className: "jn-ev-foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "host"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: h,
      size: 24
    }), h.name), e.spots != null && /*#__PURE__*/React.createElement("span", {
      className: "spots"
    }, e.spots - (rsvp[e.id] ? 1 : 0), " spots left"), /*#__PURE__*/React.createElement("button", {
      className: "jn-btn sm" + (rsvp[e.id] ? " going" : ""),
      onClick: () => toggle(e)
    }, rsvp[e.id] ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcJN, {
      name: "check",
      size: 15
    }), "Going") : "RSVP"))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen"
  }, /*#__PURE__*/React.createElement(JNTop, {
    title: "Events",
    sub: "From your clinic and the PROfinity community"
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-seg"
  }, [["upcoming", "Upcoming"], ["mine", "My events"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: view === k ? "on" : "",
    onClick: () => setView(k)
  }, l))), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "jn-emptybox"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "calendar",
    size: 28,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("b", null, "No events yet"), /*#__PURE__*/React.createElement("small", null, "RSVP to an event and it will show up here.")), list.map(e => /*#__PURE__*/React.createElement(Card, {
    key: e.id,
    e: e
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "All events are free for Pearce Aesthetics patients")), /*#__PURE__*/React.createElement(JNTabs, {
    active: "events"
  }), /*#__PURE__*/React.createElement(JNSheet, {
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
   MESSAGES (DM)
   ======================================================================= */
const DM_KEY = "pf-jane-dm";
const DM_SEED = {
  convs: [{
    id: "katy",
    unread: 1,
    msgs: [{
      by: "katy",
      text: "Hi Jane, how are the lips settling? Any tenderness today?",
      ts: Date.now() - 26 * 3600000
    }, {
      by: "jane",
      text: "Much better! A bit of swelling on the left still.",
      ts: Date.now() - 25 * 3600000
    }, {
      by: "katy",
      text: "Totally normal at day 3. Keep icing 10 mins on / 10 off and no straws 🙂",
      ts: Date.now() - 25 * 3600000 + 120000
    }, {
      by: "katy",
      text: "Also — your 2-week review is booked for Mon 3 Nov, 2:30pm. See you then! 📅",
      ts: Date.now() - 2 * 3600000
    }]
  }, {
    id: "reception",
    unread: 1,
    msgs: [{
      by: "reception",
      text: "Reminder: your appointment with Katy Wilson is Monday 3 Nov at 2:30pm. Reply C to confirm or call us to reschedule.",
      ts: Date.now() - 5 * 3600000
    }]
  }, {
    id: "miranda",
    unread: 0,
    msgs: [{
      by: "miranda",
      text: "Saw your post! Want to go to the SPF workshop together? 🧴",
      ts: Date.now() - 30 * 3600000
    }, {
      by: "jane",
      text: "Yes! I'll RSVP now",
      ts: Date.now() - 29 * 3600000
    }]
  }, {
    id: "beth",
    unread: 0,
    msgs: [{
      by: "beth",
      text: "Your aftercare sheet from today's treatment 📎 Aftercare-Lips.pdf",
      ts: Date.now() - 4 * 86400000,
      file: "Aftercare-Lips.pdf"
    }, {
      by: "jane",
      text: "Thank you Beth!",
      ts: Date.now() - 4 * 86400000 + 900000
    }]
  }]
};
const DM_REPLIES = {
  katy: ["Perfect, thanks for letting me know 🙂", "Noted — I'll add that to your file before Monday.", "Good question. Keep doing what you're doing and we'll check it at your review.", "Send me a photo if it changes, otherwise see you Monday!"],
  reception: ["Thanks Jane, your appointment is confirmed ✅", "Noted — we'll see you then."],
  miranda: ["Yay! Let's grab a coffee after 😄", "Perfect, see you there!"],
  beth: ["You're welcome Jane! Shout if anything's unclear.", "Any time 🙂"]
};
function fmtListTimeJN(ts) {
  const d = new Date(ts),
    n = new Date();
  return d.toDateString() === n.toDateString() ? fmtClockJN(ts) : n - d < 7 * 86400000 ? WD[d.getDay()] : d.getDate() + " " + MONTHS[d.getMonth()];
}
function MessagesScreen() {
  const [store, setStore] = useStateJN(() => readJN(DM_KEY, DM_SEED));
  const [openId, setOpenId] = useStateJN(qJN("to"));
  const [draft, setDraft] = useStateJN("");
  const [q, setQ] = useStateJN("");
  const [typing, setTyping] = useStateJN(false);
  const [toast, showToast] = useToastJN();
  const scrollRef = useRefJN(null);
  const conv = store.convs.find(c => c.id === openId);
  function persist(s) {
    setStore(s);
    saveJN(DM_KEY, s);
  }
  function openConv(id) {
    persist({
      convs: store.convs.map(c => c.id === id ? {
        ...c,
        unread: 0
      } : c)
    });
    setOpenId(id);
  }
  useEffectJN(() => {
    if (openId) openConv(openId);
  }, []);
  useEffectJN(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [openId, conv && conv.msgs.length, typing]);
  function send(text) {
    const t = (text || draft).trim();
    if (!t || !conv) return;
    const s = {
      convs: store.convs.map(c => c.id === conv.id ? {
        ...c,
        msgs: [...c.msgs, {
          by: "jane",
          text: t,
          ts: Date.now()
        }]
      } : c)
    };
    persist(s);
    setDraft("");
    const pool = DM_REPLIES[conv.id];
    if (!pool) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      persist({
        convs: s.convs.map(c => c.id === conv.id ? {
          ...c,
          msgs: [...c.msgs, {
            by: conv.id,
            text: pool[Math.floor(Math.random() * pool.length)],
            ts: Date.now()
          }]
        } : c)
      });
    }, 1400 + Math.random() * 800);
  }
  const sorted = store.convs.slice().sort((a, b) => b.msgs[b.msgs.length - 1].ts - a.msgs[a.msgs.length - 1].ts).filter(c => !q || PEOPLE[c.id].name.toLowerCase().includes(q.toLowerCase()));
  if (conv) {
    const p = PEOPLE[conv.id];
    let lastDay = "";
    return /*#__PURE__*/React.createElement("div", {
      className: "jn-screen"
    }, /*#__PURE__*/React.createElement(JNBar, {
      title: p.name,
      back: () => setOpenId(null),
      trailing: /*#__PURE__*/React.createElement(JNFace, {
        p: p,
        size: 34
      })
    }), /*#__PURE__*/React.createElement("div", {
      className: "jn-dm-sub"
    }, p.title, p.role === "Clinician" && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "jn-online"
    }), "Usually replies within the hour")), /*#__PURE__*/React.createElement("div", {
      className: "jn-scroll jn-thread",
      ref: scrollRef
    }, conv.msgs.map((m, i) => {
      const day = new Date(m.ts).toDateString();
      const showDay = day !== lastDay;
      lastDay = day;
      const me = m.by === "jane";
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, showDay && /*#__PURE__*/React.createElement("div", {
        className: "jn-day"
      }, day === new Date().toDateString() ? "Today" : fmtListTimeJN(m.ts)), /*#__PURE__*/React.createElement("div", {
        className: "jn-msg " + (me ? "me" : "them")
      }, !me && /*#__PURE__*/React.createElement(JNFace, {
        p: PEOPLE[m.by],
        size: 28
      }), /*#__PURE__*/React.createElement("div", {
        className: "bub"
      }, m.file ? /*#__PURE__*/React.createElement("span", {
        className: "file"
      }, /*#__PURE__*/React.createElement(IcJN, {
        name: "paperclip",
        size: 14
      }), m.file) : null, /*#__PURE__*/React.createElement("p", null, m.file ? m.text.replace(" 📎 " + m.file, "") : m.text), /*#__PURE__*/React.createElement("time", null, fmtClockJN(m.ts)))));
    }), typing && /*#__PURE__*/React.createElement("div", {
      className: "jn-msg them"
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: p,
      size: 28
    }), /*#__PURE__*/React.createElement("div", {
      className: "bub typing"
    }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null))), conv.id === "reception" && /*#__PURE__*/React.createElement("div", {
      className: "jn-prompts"
    }, ["C — confirm", "Can I reschedule?", "What should I bring?"].map(x => /*#__PURE__*/React.createElement("button", {
      key: x,
      className: "jn-chip",
      onClick: () => send(x === "C — confirm" ? "C" : x)
    }, x))), conv.id === "katy" && /*#__PURE__*/React.createElement("div", {
      className: "jn-prompts"
    }, ["Thanks Katy!", "Is this swelling normal?", "Can I send a photo?"].map(x => /*#__PURE__*/React.createElement("button", {
      key: x,
      className: "jn-chip",
      onClick: () => send(x)
    }, x)))), /*#__PURE__*/React.createElement("div", {
      className: "jn-input-row dock"
    }, /*#__PURE__*/React.createElement("button", {
      className: "jn-iconbtn sm",
      "aria-label": "Attach",
      onClick: () => showToast("Photo & file sharing coming soon")
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "plus",
      size: 20,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("input", {
      className: "jn-in",
      placeholder: "Message " + p.name.split(" ")[0] + "…",
      value: draft,
      onChange: e => setDraft(e.target.value),
      onKeyDown: e => e.key === "Enter" && send()
    }), /*#__PURE__*/React.createElement("button", {
      className: "jn-send",
      "aria-label": "Send",
      disabled: !draft.trim(),
      onClick: () => send()
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "send",
      size: 18,
      color: "#fff"
    }))), /*#__PURE__*/React.createElement(JNToast, {
      toast: toast
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "jn-screen"
  }, /*#__PURE__*/React.createElement(JNBar, {
    title: "Messages",
    back: "JaneNewsfeed.html",
    trailing: /*#__PURE__*/React.createElement("button", {
      className: "jn-iconbtn sm",
      "aria-label": "New message",
      onClick: () => showToast("Pick a contact below")
    }, /*#__PURE__*/React.createElement(IcJN, {
      name: "pencil",
      size: 17,
      color: "var(--brand-navy)"
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "jn-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jn-search"
  }, /*#__PURE__*/React.createElement(IcJN, {
    name: "search",
    size: 17,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-care"
  }, /*#__PURE__*/React.createElement(JNFace, {
    p: KATY,
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Your care team"), /*#__PURE__*/React.createElement("small", null, KATY.name, " · Nurse Beth · Reception")), /*#__PURE__*/React.createElement("button", {
    className: "jn-btn sm",
    onClick: () => openConv("katy")
  }, "Message")), /*#__PURE__*/React.createElement("div", {
    className: "jn-card list"
  }, sorted.map(c => {
    const p = PEOPLE[c.id];
    const last = c.msgs[c.msgs.length - 1];
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: "jn-conv" + (c.unread ? " unread" : ""),
      onClick: () => openConv(c.id)
    }, /*#__PURE__*/React.createElement(JNFace, {
      p: p,
      size: 50
    }), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, p.name, " ", p.role !== "Patient" && /*#__PURE__*/React.createElement(RoleChip, {
      p: p
    })), /*#__PURE__*/React.createElement("small", null, last.by === "jane" ? "You: " : "", last.text)), /*#__PURE__*/React.createElement("span", {
      className: "meta"
    }, /*#__PURE__*/React.createElement("time", null, fmtListTimeJN(last.ts)), c.unread > 0 && /*#__PURE__*/React.createElement("i", null, c.unread)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "jn-end"
  }, "Messages with your clinic are private and kept with your Health Pass")), /*#__PURE__*/React.createElement(JNToast, {
    toast: toast
  }));
}

/* =======================================================================
   mount
   ======================================================================= */
const JN_SCREENS = {
  home: HomeScreen,
  profile: ProfileScreen,
  onboarding: OnboardingScreen,
  wearables: WearablesScreen,
  health: HealthScreen,
  coach: CoachScreen,
  events: EventsScreen,
  messages: MessagesScreen
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
    style: vars
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
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(JaneApp, null));
