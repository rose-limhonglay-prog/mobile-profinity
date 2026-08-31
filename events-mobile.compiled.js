/* ===========================================================================
   PROfinity — Events (mobile)
   Upcoming Events (list/calendar) → Event Detail → waiting room → live call
   (with Live Chat). Composed on the bound DS bundle. Suffixed -EV to avoid
   global-scope clashes.
   =========================================================================== */
const {
  useState: useStateEV,
  useEffect: useEffectEV
} = React;
const DSEV = window.ProfinityDesignSystem_c2b5cc;
const PFAEV = window.PFApp;
function goEV(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
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
  d.setDate(d.getDate() + (2 - d.getDay() + 7) % 7);
  while (d <= end) {
    out.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return out;
}
/* Parse "March 17, 2026" / "November 26 – 30, 2026" into {y, m, d}. */
function evParse(date) {
  const m = EV_MONTHS.findIndex(n => date.startsWith(n));
  const d = parseInt(date.replace(/^[A-Za-z]+\s+/, ""), 10);
  const y = parseInt(date.slice(-4), 10);
  return {
    y,
    m,
    d
  };
}

/* Ten events across 2026: Technique Tuesday recurs weekly, every Tuesday from
   August 4 through the end of December (co-hosted by Dr Tim Pearce & Miranda
   Pearce, soonest occurrence live), plus nine one-off events. */
const EVENTS_LIST = [...evTuesdaysBetween(new Date(2026, 7, 4), new Date(2026, 11, 31)).map((d, i) => ({
  id: "tt" + i,
  title: "Technique Tuesday",
  host: "Dr Tim Pearce",
  cohost: "Miranda Pearce",
  banner: null,
  date: evFmtDate(d),
  time: "20:00 GMT",
  weekly: true,
  primary: i === 0,
  state: i === 0 ? "live" : "upcoming",
  going: i === 0 ? "342" : "128",
  watching: i === 0 ? "44" : undefined,
  membersOnly: i !== 1
})), {
  id: "ac",
  title: "Art Codes Live Webinar",
  host: "Dr Tim Pearce",
  banner: null,
  date: "March 24, 2026",
  time: "19:00 GMT",
  primary: false,
  state: "full",
  going: "500",
  membersOnly: false
}, {
  id: "ch",
  title: "Chew the FATPAD",
  host: "Dr Tim Pearce",
  banner: null,
  date: "June 12, 2026",
  time: "21:00 BST",
  primary: false,
  state: "attending",
  going: "212",
  membersOnly: true
}, {
  id: "tl1",
  title: "Technique Library Webinar",
  host: "Dr Tim Pearce",
  banner: null,
  date: "September 24, 2026",
  time: "20:00 BST",
  primary: false,
  state: "upcoming",
  going: "96",
  membersOnly: true
}, {
  id: "tl2",
  title: "Live Replay Technique Library Webinar",
  host: "Dr Tim Pearce",
  banner: null,
  date: "October 4, 2026",
  time: "19:00 BST",
  primary: false,
  state: "upcoming",
  going: "64",
  membersOnly: true
}, {
  id: "ht1",
  title: "High Ticket Webinar",
  host: "Dr Tim Pearce",
  banner: null,
  date: "October 15, 2026",
  time: "20:00 BST",
  primary: false,
  state: "upcoming",
  going: "410",
  membersOnly: false
}, {
  id: "tl3",
  title: "Live Replay Technique Library Webinar",
  host: "Dr Tim Pearce",
  banner: null,
  date: "October 29, 2026",
  time: "19:00 GMT",
  primary: false,
  state: "upcoming",
  going: "58",
  membersOnly: true
}, {
  id: "bfr",
  title: "BF Registration",
  host: "Dr Tim Pearce",
  banner: null,
  date: "November 1, 2026",
  time: "09:00 GMT",
  primary: false,
  state: "upcoming",
  going: "740",
  membersOnly: false
}, {
  id: "bfs",
  title: "BF Sales Period",
  host: "Dr Tim Pearce",
  banner: null,
  date: "November 26 – 30, 2026",
  time: "All day",
  primary: false,
  state: "upcoming",
  going: "890",
  membersOnly: false
}, {
  id: "ht2",
  title: "High Ticket Webinar",
  host: "Dr Tim Pearce",
  banner: null,
  date: "December 15, 2026",
  time: "20:00 GMT",
  primary: false,
  state: "upcoming",
  going: "302",
  membersOnly: false
}];
const EV_DETAIL = {
  /* No default banner: real per-event thumbnails aren't photographed yet, so
     the hero shows a plain placeholder rather than a stock photo that may not
     match the event. */
  title: "Chew the FATPAD",
  host: "Dr Tim Pearce",
  banner: null,
  date: "June 12, 2026",
  time: "9:00 PM",
  attendees: "380",
  about: "Join Dr. Tim Pearce every week for Technique Tuesday, a live, interactive session where he shares his expert knowledge, answers your burning questions, and demonstrates the latest techniques in aesthetic medicine. Don't miss this opportunity to enhance your skills and stay ahead of the curve!",
  membersOnly: true,
  state: "live",
  learn: ["Step-by-Step Technique demonstration", "Interactive Group Exercise", "Individual Feedback Sessions", "Real-world Case Studies", "Q&A Panel Discussion"],
  status: [{
    icon: "lucide:calendar",
    t: "17 August 2026"
  }, {
    icon: "lucide:clock",
    t: "20:00 GMT | 16:00 ET"
  }, {
    icon: "lucide:timer",
    t: "60 minutes"
  }, {
    icon: "lucide:video",
    t: "Live Webinar"
  }, {
    icon: "lucide:star",
    t: "Premium Event"
  }],
  attend: ["Aesthetic Practitioners", "Holistic Health Coaches", "Fitness Instructors", "Nutritional Therapists", "Wellness Consultants"]
};
const EV_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: "NewsfeedMobile.html"
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Learning",
  label: "Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Rewards",
  label: "Rewards",
  icon: "lucide:gift",
  href: "RewardsDashboard.html"
}];
const CALL_PEOPLE = [{
  name: "Sarah",
  avatar: "assets/avatar-katy.jpg"
}, {
  name: "Jordan",
  avatar: "assets/avatar-drtim.png"
}, {
  name: "Priya",
  avatar: "assets/avatar-katy.jpg"
}, {
  name: "Marcus",
  avatar: "assets/avatar-drtim.png"
}];

/* ---- live stream: audience view seed data ---- */
const LS_ONCAM = [{
  id: "tim",
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  mic: true,
  speaking: true
}, {
  id: "miranda",
  name: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  mic: true,
  speaking: false
}];
const LS_OFFCAM = [{
  id: "katy",
  name: "Katy Wilson",
  avatar: "assets/avatar-katy.jpg",
  mic: false,
  host: true,
  camOff: true
}, {
  id: "grace",
  name: "Grace Lindqvist",
  avatar: "assets/avatar-sarah-collins.jpg",
  mic: false,
  host: false,
  camOff: true
}];
const LS_REACT_EMOJI = ["❤️", "💜", "👏", "🔥", "🙌"];
const LS_COMPOSER_MORE = ["💜", "👏", "🔥", "🙌", "😂"];
const LS_BASKET_COUNT = 79;

/* ---- live stream: host view seed data — viewers who've raised a hand to
   join the stage, shown in the host's participants panel. ---- */
const LS_REQUESTS = [{
  id: "amir",
  name: "Amir Khan",
  avatar: "assets/avatar-amir-khan.jpg",
  note: "wants to demo a case"
}, {
  id: "mark",
  name: "Mark Ellis",
  avatar: "assets/avatar-mark-ellis.jpg",
  note: "raised their hand"
}];
const LS_CHAT_SEED = [{
  name: "Dr Tim Pearce",
  text: "Good question — covering migration next"
}, {
  name: "Olivia Marsh",
  text: "Saved. Watching the replay tomorrow."
}, {
  name: "Ravi Chandra",
  text: "How do you review for asymmetry afterwards?"
}, {
  name: "Nadia Farouk",
  text: "This is gold, thank you Dr Pearce"
}, {
  name: "Sam O'Connell",
  text: "Anyone else taking notes for their next clinic day?"
}, {
  name: "Beth Okafor",
  text: "The fanning technique really clicked for me just now"
}, {
  name: "Marcus Webb",
  text: "Can you share the slide deck after?"
}, {
  name: "Priya Nair",
  text: "Miranda's tip on cannula angle was so useful"
}, {
  name: "Leah Whitmore",
  text: "First live session — loving it so far"
}, {
  name: "Dr Tim Pearce",
  text: "Great turnout tonight, keep the questions coming"
}, {
  name: "Josh Reilly",
  text: "Does this count toward my CPD hours?"
}, {
  name: "Ingrid Voss",
  text: "Watching from Oslo, thanks for the early slot!"
}];
const LS_PRODUCTS = [{
  num: 1,
  img: "assets/course-8d-lip-design.jpg",
  title: "8D Lip Design — full course",
  note: "CPD accredited",
  price: 468,
  was: 520,
  off: "-10%",
  flashSecs: 9437
}, {
  num: 2,
  img: "assets/course-advanced-lip-techniques.jpg",
  title: "Advanced Lip Techniques",
  note: "CPD accredited",
  price: 342,
  was: 380,
  off: "-10%",
  flashSecs: 6120
}, {
  num: 3,
  img: "assets/course-full-face-rejuvenation.jpg",
  title: "Full Face Rejuvenation",
  note: "Certificate included",
  price: 612,
  was: 680,
  off: "-10%",
  flashSecs: 4310
}, {
  num: 4,
  img: "assets/course-brow-lift.jpg",
  title: "Brow Lift Masterclass",
  note: "CPD accredited",
  price: 396,
  was: 440,
  off: "-10%",
  flashSecs: 7215
}, {
  num: 5,
  img: "assets/course-cheek-contouring.jpg",
  title: "Cheek Contouring Essentials",
  note: "Certificate included",
  price: 378,
  was: 420,
  off: "-10%",
  flashSecs: 5540
}, {
  num: 6,
  img: "assets/course-complications.jpg",
  title: "Complications Management",
  note: "CPD accredited",
  price: 450,
  was: 500,
  off: "-10%",
  flashSecs: 8802
}, {
  num: 7,
  img: "assets/course-consultation.jpg",
  title: "Consultation Skills for Injectors",
  note: "Certificate included",
  price: 270,
  was: 300,
  off: "-10%",
  flashSecs: 3190
}, {
  num: 8,
  img: "assets/course-jawline-sculpting.jpg",
  title: "Jawline Sculpting",
  note: "CPD accredited",
  price: 414,
  was: 460,
  off: "-10%",
  flashSecs: 6710
}, {
  num: 9,
  img: "assets/course-lip.png",
  title: "Lip Filler Fundamentals",
  note: "Certificate included",
  price: 288,
  was: 320,
  off: "-10%",
  flashSecs: 2985
}, {
  num: 10,
  img: "assets/course-marketing.webp",
  title: "Clinic Marketing Blueprint",
  note: "CPD accredited",
  price: 324,
  was: 360,
  off: "-10%",
  flashSecs: 9010
}, {
  num: 11,
  img: "assets/course-protox.png",
  title: "Tox Fundamentals",
  note: "Certificate included",
  price: 432,
  was: 480,
  off: "-10%",
  flashSecs: 4025
}, {
  num: 12,
  img: "assets/course-rhinoplasty.jpg",
  title: "Non-Surgical Rhinoplasty",
  note: "CPD accredited",
  price: 558,
  was: 620,
  off: "-10%",
  flashSecs: 7960
}, {
  num: 13,
  img: "assets/course-skin-boosters.jpg",
  title: "Skin Boosters Masterclass",
  note: "Certificate included",
  price: 306,
  was: 340,
  off: "-10%",
  flashSecs: 5325
}, {
  num: 14,
  img: "assets/course-tear-trough.jpg",
  title: "Tear Trough Correction",
  note: "CPD accredited",
  price: 360,
  was: 400,
  off: "-10%",
  flashSecs: 6455
}, {
  num: 15,
  img: "assets/course-temple-filler.webp",
  title: "Temple Filler Technique",
  note: "Certificate included",
  price: 342,
  was: 380,
  off: "-10%",
  flashSecs: 3720
}, {
  num: 16,
  img: "assets/course-temple.png",
  title: "Temple Volumising",
  note: "CPD accredited",
  price: 315,
  was: 350,
  off: "-10%",
  flashSecs: 8340
}, {
  num: 17,
  img: "assets/course-jawline-sculpting.jpg",
  title: "Advanced Jawline Sculpting",
  note: "CPD accredited",
  price: 522,
  was: 580,
  off: "-10%",
  flashSecs: 4590
}, {
  num: 18,
  img: "assets/course-cheek-contouring.jpg",
  title: "Advanced Cheek Contouring",
  note: "Certificate included",
  price: 468,
  was: 520,
  off: "-10%",
  flashSecs: 7130
}, {
  num: 19,
  img: "assets/course-rhinoplasty.jpg",
  title: "Non-Surgical Rhinoplasty — Advanced",
  note: "CPD accredited",
  price: 630,
  was: 700,
  off: "-10%",
  flashSecs: 2410
}, {
  num: 20,
  img: "assets/course-complications.jpg",
  title: "Complications: Vascular Occlusion",
  note: "CPD accredited",
  price: 486,
  was: 540,
  off: "-10%",
  flashSecs: 5875
}, {
  num: 21,
  img: "assets/course-skin-boosters.jpg",
  title: "Skin Boosters — Advanced Layering",
  note: "Certificate included",
  price: 360,
  was: 400,
  off: "-10%",
  flashSecs: 9155
}, {
  num: 22,
  img: "assets/course-brow-lift.jpg",
  title: "Brow Lift — Advanced Shaping",
  note: "CPD accredited",
  price: 450,
  was: 500,
  off: "-10%",
  flashSecs: 3055
}];
function lsFmtClock(totalSecs) {
  const s = Math.max(0, Math.floor(totalSecs));
  const h = Math.floor(s / 3600),
    m = Math.floor(s % 3600 / 60),
    sec = s % 60;
  const pad = n => String(n).padStart(2, "0");
  return pad(h) + ":" + pad(m) + ":" + pad(sec);
}

/* Deterministic funnel numbers for the host's product-performance stats —
   clicks > add-to-cart > sold, seeded off each product's own num so the
   panel reads consistently without a real backing analytics feed. */
function lsProductStats(p) {
  const clicks = 20 + p.num * 37 % 80;
  const cart = Math.max(4, Math.round(clicks * 0.4));
  const sold = Math.max(1, Math.round(cart * 0.3));
  return {
    clicks,
    cart,
    sold
  };
}
function EvTabBar({
  active
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "ev-tabs",
    "aria-label": "Primary"
  }, EV_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "ev-tab" + (t.key === active ? " on" : ""),
    onClick: () => t.href && goEV(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: t.icon,
    size: 23,
    color: t.key === active ? "#fff" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), t.label)));
}

/* ---- per-event join / calendar state (persisted, shared by both views) ---- */
function evStore() {
  try {
    return JSON.parse(localStorage.getItem("pf-event-status") || "{}");
  } catch (e) {
    return {};
  }
}
function evSave(map) {
  try {
    localStorage.setItem("pf-event-status", JSON.stringify(map));
  } catch (e) {}
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
  return {
    registered: s.registered || e.state === "attending",
    calendar: !!s.calendar
  };
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
function EvStatusPill({
  st
}) {
  if (st.registered) return /*#__PURE__*/React.createElement("span", {
    className: "ev-dotstat on"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), "Attending");
  if (st.calendar) return /*#__PURE__*/React.createElement("span", {
    className: "ev-dotstat cal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), "In your calendar");
  return /*#__PURE__*/React.createElement("span", {
    className: "ev-dotstat off"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), "Not added");
}
function EvStatusBtn({
  e,
  st
}) {
  if (st.registered) return /*#__PURE__*/React.createElement("span", {
    className: "ev-attpill"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 16,
    color: "var(--success)"
  }), "Attending");
  return /*#__PURE__*/React.createElement("button", {
    className: "ev-statusbtn" + (st.calendar ? " done" : ""),
    "aria-pressed": st.calendar,
    onClick: ev => {
      ev.stopPropagation();
      evMark(e.id, {
        calendar: !st.calendar
      });
    }
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: st.calendar ? "lucide:calendar-check" : "lucide:calendar-plus",
    size: 16,
    color: st.calendar ? "var(--success)" : "var(--brand-navy)"
  }), st.calendar ? "Added to calendar" : "Add to calendar");
}

/* ---- screen 1b: calendar view ---- */
function EvCalendar({
  onOpen,
  cur,
  setCur
}) {
  const statusMap = useEvStatus();
  const parsed = EVENTS_LIST.map(e => Object.assign({
    ev: e
  }, evParse(e.date)));
  const inMonth = parsed.filter(p => p.y === cur.y && p.m === cur.m);
  const days = new Date(cur.y, cur.m + 1, 0).getDate();
  const lead = (new Date(cur.y, cur.m, 1).getDay() + 6) % 7; // Monday-first
  const step = n => setCur(c => {
    const m = c.m + n;
    return {
      y: c.y + Math.floor(m / 12),
      m: (m % 12 + 12) % 12
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-cal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-cal-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-cal-nav",
    "aria-label": "Previous month",
    title: "Previous month",
    onClick: () => step(-1)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ev-cal-month"
  }, EV_MONTHS[cur.m], " ", cur.y), /*#__PURE__*/React.createElement("button", {
    className: "ev-cal-nav",
    "aria-label": "Next month",
    title: "Next month",
    onClick: () => step(1)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ev-cal-dow"
  }, ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, d))), /*#__PURE__*/React.createElement("div", {
    className: "ev-cal-grid"
  }, Array.from({
    length: lead
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    className: "ev-cal-cell empty",
    key: "e" + i
  })), Array.from({
    length: days
  }).map((_, i) => {
    const day = i + 1;
    const hit = inMonth.find(p => p.d === day);
    const hs = hit ? evStatusOf(hit.ev, statusMap) : null;
    const today = cur.y === EV_TODAY.getFullYear() && cur.m === EV_TODAY.getMonth() && day === EV_TODAY.getDate();
    return /*#__PURE__*/React.createElement("button", {
      key: day,
      className: "ev-cal-cell" + (hit ? " has" : "") + (today ? " today" : "") + (hs && hs.registered ? " joined" : "") + (hs && !hs.registered && hs.calendar ? " incal" : ""),
      disabled: !hit,
      "aria-label": hit ? day + " — " + hit.ev.title + (hs.registered ? " (attending)" : hs.calendar ? " (in your calendar)" : " (not added yet)") : String(day),
      onClick: () => hit && onOpen(hit.ev)
    }, day, hit && /*#__PURE__*/React.createElement("span", {
      className: "ev-cal-dot"
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "ev-cal-list"
  }, inMonth.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "ev-cal-none"
  }, "No events this month.") : inMonth.map(p => /*#__PURE__*/React.createElement("button", {
    className: "ev-cal-item",
    key: p.ev.id,
    onClick: () => onOpen(p.ev)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-cal-item-d"
  }, /*#__PURE__*/React.createElement("b", null, p.d), /*#__PURE__*/React.createElement("i", null, EV_MONTHS[cur.m].slice(0, 3).toUpperCase())), /*#__PURE__*/React.createElement("span", {
    className: "ev-cal-item-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, p.ev.title), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, p.ev.time), /*#__PURE__*/React.createElement(EvStatusPill, {
    st: evStatusOf(p.ev, statusMap)
  })), /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 19,
    color: "var(--gray-450)"
  })))));
}

/* ---- screen 1a: events list ---- */
function EventsList({
  onBack,
  onOpen,
  view,
  setView,
  cur,
  setCur
}) {
  const statusMap = useEvStatus();
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-screen",
    "data-screen-label": "Upcoming Events"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ev-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-back",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ev-title"
  }, "Upcoming Events"), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ev-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-searchrow"
  }, /*#__PURE__*/React.createElement("label", {
    className: "ev-search"
  }, /*#__PURE__*/React.createElement(DSEV.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search events…",
    "aria-label": "Search events"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ev-viewtoggle",
    role: "tablist",
    "aria-label": "View"
  }, [{
    k: "list",
    l: "List view",
    i: "lucide:list"
  }, {
    k: "calendar",
    l: "Calendar view",
    i: "lucide:calendar-days"
  }].map(v => /*#__PURE__*/React.createElement("button", {
    key: v.k,
    role: "tab",
    "aria-selected": view === v.k,
    "aria-label": v.l,
    title: v.l,
    className: "ev-viewbtn" + (view === v.k ? " on" : ""),
    onClick: () => setView(v.k)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: v.i,
    size: 20,
    color: view === v.k ? "#fff" : "var(--gray-600)"
  }))))), view === "calendar" && /*#__PURE__*/React.createElement(EvCalendar, {
    onOpen: onOpen,
    cur: cur,
    setCur: setCur
  }), view === "list" && EVENTS_LIST.map((e, i) => {
    const [d, mo] = [e.date.split(" ")[1].replace(",", ""), e.date.split(" ")[0].slice(0, 3).toUpperCase()];
    const isLive = e.state === "live";
    return /*#__PURE__*/React.createElement("div", {
      className: "ev-card" + (i === 0 ? " feat" : ""),
      key: e.id,
      onClick: () => onOpen(e)
    }, /*#__PURE__*/React.createElement("div", {
      className: "ev-card-media"
    }, e.banner ? /*#__PURE__*/React.createElement("img", {
      className: "banner",
      src: e.banner,
      alt: e.title
    }) : /*#__PURE__*/React.createElement("div", {
      className: "banner ev-banner-ph",
      role: "img",
      "aria-label": e.title + " — thumbnail coming soon"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ev-date-chip"
    }, /*#__PURE__*/React.createElement("b", null, d), /*#__PURE__*/React.createElement("i", null, mo)), isLive && /*#__PURE__*/React.createElement("span", {
      className: "ev-flag live"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pulse"
    }), "Live now")), /*#__PURE__*/React.createElement("div", {
      className: "body"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "ttl"
    }, e.title), /*#__PURE__*/React.createElement("div", {
      className: "host"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ev-hosts"
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/avatar-drtim.png",
      alt: ""
    }), e.cohost && /*#__PURE__*/React.createElement("img", {
      src: "assets/avatar-miranda.jpg",
      alt: ""
    })), "Hosted: ", /*#__PURE__*/React.createElement("b", null, e.cohost ? e.host + " & " + e.cohost : e.host)), /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ev-chip"
    }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: "lucide:calendar",
      size: 16,
      color: "var(--brand-gold)"
    }), e.date), /*#__PURE__*/React.createElement("span", {
      className: "ev-chip"
    }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: "lucide:clock",
      size: 16,
      color: "var(--brand-gold)"
    }), e.time)), /*#__PURE__*/React.createElement("button", {
      className: "ev-cta" + (i === 0 ? "" : " ghost"),
      onClick: ev => {
        ev.stopPropagation();
        onOpen(e);
      }
    }, "View Event", /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: "lucide:arrow-right",
      size: 17,
      color: i === 0 ? "#fff" : "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement(EvStatusBtn, {
      e: e,
      st: evStatusOf(e, statusMap)
    })));
  })), /*#__PURE__*/React.createElement(EvTabBar, {
    active: "Home"
  }));
}

/* Free members can read everything; the members-only gate fires on action.
   Read window.PF_TIER (per-page preview override), falling back to the same
   subscription-tier source (window.PFApp.getUserTier) every other screen in
   the app already reads from — see mobile.jsx's smReadTierM for the sibling
   pattern used by the side-menu tier ladder. */
function evIsFree() {
  if (typeof window === "undefined") return false;
  if (window.PF_TIER) return window.PF_TIER === "free";
  try {
    return (PFAEV && PFAEV.getUserTier ? PFAEV.getUserTier() : "free") === "free";
  } catch (e) {
    return false;
  }
}

/* Status-aware CTA label/icon for an event. */
function evCta(state, attending) {
  if (attending) return {
    label: "Attending",
    icon: "lucide:check-circle-2",
    cls: " attending"
  };
  if (state === "live") return {
    label: "Join Live Now",
    icon: "lucide:radio",
    cls: " live"
  };
  if (state === "full") return {
    label: "Join Waitlist",
    icon: "lucide:hourglass",
    cls: ""
  };
  return {
    label: "Register Now",
    icon: "lucide:calendar-plus",
    cls: ""
  };
}

/* Members-only gate — shown only AFTER the user acts, never up front. */
function MembersGate({
  onClose,
  onUpgrade
}) {
  useEffectEV(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Members only event"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-gate-ic"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:lock",
    size: 26,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "ev-sheet-ttl"
  }, "This event is for members"), /*#__PURE__*/React.createElement("p", {
    className: "ev-sheet-p"
  }, "You can browse the full details any time. To attend live, join a membership tier — it includes every weekly session, replays and the Q&A."), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta",
    onClick: onUpgrade
  }, "See membership tiers"), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta ghost",
    onClick: onClose
  }, "Not now")));
}
function InviteSheet({
  title,
  event,
  onClose
}) {
  const [copied, setCopied] = useStateEV(false);
  useEffectEV(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const link = (typeof window !== "undefined" ? window.location.href.split("#")[0] : "") + "#event";
  const blurb = "Join me at " + title + (event && event.date ? " on " + event.date + " at " + event.time : "") + " — PROfinity Academy.";
  const share = k => {
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
        if (navigator.share) {
          navigator.share({
            title: title,
            text: blurb,
            url: link
          });
          return;
        }
        if (navigator.clipboard) navigator.clipboard.writeText(link);
        setCopied(true);
        return;
      }
    } catch (e) {}
  };
  const ways = [{
    k: "copy",
    l: copied ? "Copied" : "Copy link",
    i: copied ? "lucide:check" : "lucide:link"
  }, {
    k: "mail",
    l: "Email",
    i: "lucide:mail"
  }, {
    k: "msg",
    l: "Message",
    i: "lucide:message-circle"
  }, {
    k: "wa",
    l: "WhatsApp",
    i: "lucide:phone"
  }, {
    k: "more",
    l: "More",
    i: "lucide:share-2"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Invite your colleagues"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-sheet-grab"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "ev-sheet-ttl"
  }, "Invite your colleagues"), /*#__PURE__*/React.createElement("p", {
    className: "ev-sheet-p"
  }, "Share this event with your team.")), /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ev-invite-ev"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:calendar-days",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, title), event && event.date && /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, event.date, " · ", event.time))), /*#__PURE__*/React.createElement("div", {
    className: "ev-invite-ways"
  }, ways.map(w => /*#__PURE__*/React.createElement("button", {
    key: w.k,
    className: "ev-invite-way" + (w.k === "copy" && copied ? " done" : ""),
    onClick: () => share(w.k)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: w.i,
    size: 22,
    color: w.k === "copy" && copied ? "var(--success)" : "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, w.l)))), /*#__PURE__*/React.createElement("div", {
    className: "ev-invite-link"
  }, /*#__PURE__*/React.createElement("span", {
    className: "u"
  }, link.replace(/^https?:\/\//, "").slice(0, 34), "…"), /*#__PURE__*/React.createElement("button", {
    onClick: () => share("copy")
  }, copied ? "Copied" : "Copy"))));
}

/* ---- screen 2: event detail (open to everyone; gate fires on action) ---- */
function EventDetail({
  onBack,
  onJoin,
  event
}) {
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
    if (d.id) evMark(d.id, {
      registered: true
    });
    try {
      const regs = JSON.parse(localStorage.getItem("pf-event-regs") || "[]");
      regs.unshift({
        title: d.title,
        date: d.date,
        time: d.time,
        going: d.going || d.attendees
      });
      localStorage.setItem("pf-event-regs", JSON.stringify(regs.slice(0, 3)));
    } catch (e) {}
  };
  const act = () => {
    if (d.membersOnly && evIsFree() && !attending) {
      setGate(true);
      return;
    }
    if (d.state === "live") {
      onJoin();
      return;
    }
    register();
  };
  const addToCalendar = () => {
    setInCal(v => {
      const nv = !v;
      if (d.id) evMark(d.id, {
        calendar: nv
      });
      return nv;
    });
  };
  const findStatus = icon => {
    const s = (d.status || []).find(s => s.icon === icon);
    return s ? s.t : null;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-screen",
    "data-screen-label": "Event Details",
    key: d.title + d.date
  }, /*#__PURE__*/React.createElement("header", {
    className: "ev-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-back",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ev-title"
  }, "Event Details"), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ev-scroll"
  }, d.banner ? /*#__PURE__*/React.createElement("div", {
    className: "ev-hero",
    style: {
      backgroundImage: "url(" + d.banner + ")"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "ev-hero ev-hero-ph",
    role: "img",
    "aria-label": d.title + " — thumbnail coming soon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-detail-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-live-badge" + (d.state === "live" ? " live" : "")
  }, d.state === "live" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "pulse"
  }), "Live now · started 4 min ago") : "Live Event"), /*#__PURE__*/React.createElement("h1", {
    className: "ttl"
  }, d.title), d.membersOnly && /*#__PURE__*/React.createElement("span", {
    className: "ev-members-tag"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "fluent:premium-16-filled",
    size: 15,
    color: "#fff"
  }), "Members only"), /*#__PURE__*/React.createElement("div", {
    className: "ev-hostline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Hosted:"), /*#__PURE__*/React.createElement("span", {
    className: "ev-hosts"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar-drtim.png",
    alt: ""
  }), d.cohost && /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar-miranda.jpg",
    alt: ""
  })), /*#__PURE__*/React.createElement("a", {
    href: "ProfileMobile.html"
  }, /*#__PURE__*/React.createElement("b", null, d.host)), d.cohost && /*#__PURE__*/React.createElement(React.Fragment, null, " and ", /*#__PURE__*/React.createElement("a", {
    href: "ProfileMobile.html"
  }, /*#__PURE__*/React.createElement("b", null, d.cohost)))), /*#__PURE__*/React.createElement("div", {
    className: "ev-detail-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:calendar",
    size: 20,
    color: "var(--brand-navy)"
  }), d.date), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:clock",
    size: 20,
    color: "var(--brand-navy)"
  }), d.time)), /*#__PURE__*/React.createElement("div", {
    className: "ev-attend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-faces"
  }, CALL_PEOPLE.concat(CALL_PEOPLE.slice(0, 3)).map((p, i) => /*#__PURE__*/React.createElement(DSEV.Avatar, {
    key: i,
    name: p.name,
    src: p.avatar,
    size: 32
  }))), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, d.attendees || d.going, " other attendees")), /*#__PURE__*/React.createElement("div", {
    className: "ev-detail-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta" + cta.cls,
    onClick: act
  }, cta.label, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: cta.icon,
    size: 18,
    color: attending ? "var(--success)" : "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta ghost",
    onClick: () => setInvite(true)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:user-plus",
    size: 18,
    color: "var(--brand-navy)"
  }), "Invite Your Colleagues")), /*#__PURE__*/React.createElement("div", {
    className: "ev-sec-actions one"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-sec-act" + (inCal ? " done" : ""),
    onClick: addToCalendar
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: inCal ? "lucide:calendar-check" : "lucide:calendar",
    size: 22,
    color: inCal ? "var(--success)" : "var(--brand-navy)"
  }), inCal ? "Added to Calendar" : "Add to Calendar")), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "About this event"), /*#__PURE__*/React.createElement("p", {
    className: "ev-sec-p"
  }, d.about), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "You'll learn:"), /*#__PURE__*/React.createElement("ul", {
    className: "ev-checklist"
  }, d.learn.map((l, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check",
    size: 19,
    color: "var(--brand-navy)"
  }), l))), /*#__PURE__*/React.createElement("div", {
    className: "ev-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Attendees"), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, d.attendees || d.going), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, "registered so far")), /*#__PURE__*/React.createElement("div", {
    className: "ev-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Duration"), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, findStatus("lucide:timer") || "60 min"), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, "live session")), /*#__PURE__*/React.createElement("div", {
    className: "ev-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Format"), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, findStatus("lucide:video") || "Live Webinar"), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, d.membersOnly ? "Members only" : "Open access"))), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "Event Status"), /*#__PURE__*/React.createElement("div", {
    className: "ev-status"
  }, d.status.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "ev-status-row",
    key: i
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: s.icon,
    size: 20,
    color: "var(--brand-navy)"
  }), s.t))), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "Who Should Attend"), /*#__PURE__*/React.createElement("ul", {
    className: "ev-checklist"
  }, d.attend.map((l, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check",
    size: 19,
    color: "var(--brand-navy)"
  }), l))), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "Need Help?"), /*#__PURE__*/React.createElement("button", {
    className: "ev-help"
  }, /*#__PURE__*/React.createElement("span", null, "Contact Support - We are here to help if you have any questions about this event."), /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement(EvTabBar, {
    active: "Home"
  }), gate && /*#__PURE__*/React.createElement(MembersGate, {
    onClose: () => setGate(false),
    onUpgrade: () => goEV("MembershipTier.html")
  }), invite && /*#__PURE__*/React.createElement(InviteSheet, {
    title: d.title,
    event: d,
    onClose: () => setInvite(false)
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "ev-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 20,
    color: "var(--success)"
  }), /*#__PURE__*/React.createElement("span", null, "You're registered — shared to your feed."), /*#__PURE__*/React.createElement("button", {
    onClick: () => goEV("NewsfeedMobile.html")
  }, "View")));
}

/* ---- live stream: audience view. The member is watching, not presenting —
   no self camera, no mute/camera controls, just a stage, chat and a shop. ---- */
/* Note: nothing needing pointer events belongs inside LSStage — it's
   position:absolute and z-index:0, so its stacking context sits below the
   sibling .ls-overlay (z-index:2) regardless of z-index set on children
   here. LSTopBar/LSTitleBlock must render as .ls-screen siblings instead
   (see LiveStream), or their buttons become visually present but unclickable. */
/* Everyone on the call gets a full grid cell — including anyone whose
   camera is off (rendered as a dimmed avatar bubble via .camoff) — so no
   one included in the live drops off screen just for muting their video. */
function LSStage({
  onCam,
  offCam
}) {
  const people = onCam.concat(offCam);
  const n = people.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ls-grid n" + n
  }, people.map(p => /*#__PURE__*/React.createElement("div", {
    className: "ls-cell" + (p.speaking ? " speaking" : "") + (p.camOff ? " camoff" : ""),
    key: p.id
  }, p.host && /*#__PURE__*/React.createElement("span", {
    className: "cap"
  }, "Host"), p.camOff ? /*#__PURE__*/React.createElement("span", {
    className: "ls-camoff-av"
  }, /*#__PURE__*/React.createElement("img", {
    src: p.avatar,
    alt: ""
  })) : /*#__PURE__*/React.createElement("img", {
    className: p.rear ? "rear" : undefined,
    src: p.avatar,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "ls-namechip"
  }, p.name, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: p.mic ? "lucide:mic" : "lucide:mic-off",
    size: 13,
    color: "#fff"
  }))))));
}
function LSTopBar({
  role,
  elapsed,
  viewers,
  onLeave,
  onEndClick,
  onParticipants,
  pendingCount
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-topbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ls-live"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse"
  }), "LIVE"), /*#__PURE__*/React.createElement("span", {
    className: "ls-timer"
  }, lsFmtClock(elapsed)), role === "host" ? /*#__PURE__*/React.createElement("button", {
    className: "ls-viewers as-btn",
    "aria-label": "Participants" + (pendingCount ? " — " + pendingCount + " requests" : ""),
    title: "Participants",
    onClick: onParticipants
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:eye",
    size: 14,
    color: "#fff"
  }), viewers, pendingCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, pendingCount)) : /*#__PURE__*/React.createElement("span", {
    className: "ls-viewers"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:eye",
    size: 14,
    color: "#fff"
  }), viewers), role === "host" ? /*#__PURE__*/React.createElement("button", {
    className: "ls-end",
    onClick: onEndClick
  }, "End") : /*#__PURE__*/React.createElement("button", {
    className: "ls-close",
    "aria-label": role === "speaker" ? "Leave stage" : "Leave stream",
    title: role === "speaker" ? "Leave stage" : "Leave stream",
    onClick: onLeave
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "#fff"
  })));
}
function LSTitleBlock({
  title,
  hosts
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-titleblock"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, hosts));
}

/* Ambient + user-triggered reaction particles. Travel distance/duration are
   explicit px/seconds per particle — a percentage translateY would resolve
   against the emoji's own ~30px box and barely move. */
function useReactionParticles() {
  const [particles, setParticles] = useStateEV([]);
  const idRef = React.useRef(0);
  const spawn = emoji => {
    const id = ++idRef.current;
    const dist = Math.round(460 + Math.random() * 160);
    const dur = +(4.4 + Math.random() * 2).toFixed(2);
    const size = Math.round(20 + Math.random() * 14);
    const drift = Math.round(-22 + Math.random() * 44);
    const right = Math.round(18 + Math.random() * 46);
    setParticles(ps => ps.concat([{
      id,
      emoji,
      dist,
      dur,
      size,
      drift,
      right
    }]));
    setTimeout(() => setParticles(ps => ps.filter(p => p.id !== id)), dur * 1000 + 200);
  };
  useEffectEV(() => {
    const t = setInterval(() => spawn(LS_REACT_EMOJI[Math.floor(Math.random() * LS_REACT_EMOJI.length)]), 700);
    return () => clearInterval(t);
  }, []);
  return {
    particles,
    spawn
  };
}
function LSReactions({
  particles
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-reactions",
    "aria-hidden": "true"
  }, particles.map(p => /*#__PURE__*/React.createElement("span", {
    key: p.id,
    className: "ls-particle",
    style: {
      right: p.right + "px",
      fontSize: p.size + "px",
      animationDuration: p.dur + "s",
      "--dist": p.dist + "px",
      "--drift": p.drift + "px"
    }
  }, p.emoji)));
}
function LSChat({
  msgs,
  onAddReply
}) {
  const ref = React.useRef(null);
  const [replyFor, setReplyFor] = useStateEV(null);
  const [replyVal, setReplyVal] = useStateEV("");
  useEffectEV(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length]);
  const submitReply = m => {
    const t = replyVal.trim();
    if (!t) return;
    onAddReply(m.id, t);
    setReplyVal("");
    setReplyFor(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-chat",
    ref: ref,
    "aria-live": "polite",
    "aria-label": "Live chat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ls-chat-inner"
  }, msgs.map(m => /*#__PURE__*/React.createElement("div", {
    className: "ls-msg-block",
    key: m.id
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-msg",
    "aria-expanded": replyFor === m.id,
    onClick: () => setReplyFor(replyFor === m.id ? null : m.id)
  }, /*#__PURE__*/React.createElement("b", null, m.name), " ", m.text), m.replies && m.replies.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ls-msg-replies"
  }, m.replies.map(r => /*#__PURE__*/React.createElement("div", {
    className: "ls-msg ls-msg-reply",
    key: r.id
  }, /*#__PURE__*/React.createElement("b", null, r.name), " ", r.text))), replyFor === m.id && /*#__PURE__*/React.createElement("div", {
    className: "ls-reply-box"
  }, /*#__PURE__*/React.createElement("input", {
    className: "ls-reply-input",
    autoFocus: true,
    value: replyVal,
    onChange: e => setReplyVal(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") submitReply(m);
      if (e.key === "Escape") setReplyFor(null);
    },
    placeholder: "Reply to " + m.name + "…",
    "aria-label": "Reply to " + m.name
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-reply-send",
    "aria-label": "Send reply",
    title: "Send",
    onClick: () => submitReply(m)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:send",
    size: 14,
    color: "#fff"
  })))))));
}
function LSComposer({
  value,
  onChange,
  onSend,
  onReact,
  onOpenBasket
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-composer"
  }, onOpenBasket && /*#__PURE__*/React.createElement("button", {
    className: "ls-basket",
    "aria-label": "Shop this stream — " + LS_BASKET_COUNT + " items",
    title: "Shop",
    onClick: onOpenBasket
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:shopping-basket",
    size: 19,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, LS_BASKET_COUNT)), /*#__PURE__*/React.createElement("input", {
    className: "ls-input",
    value: value,
    onChange: e => onChange(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") onSend();
    },
    placeholder: "Say something…",
    "aria-label": "Say something"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ls-send",
    "aria-label": "Send message",
    title: "Send",
    onClick: onSend
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:send",
    size: 17,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ls-react"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ls-heart",
    "aria-label": "Send heart reaction",
    title: "React",
    onClick: () => onReact("❤️")
  }, "❤️"), /*#__PURE__*/React.createElement("div", {
    className: "ls-react-pop",
    role: "menu",
    "aria-label": "More reactions"
  }, LS_COMPOSER_MORE.map((e, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    role: "menuitem",
    "aria-label": "Send " + e + " reaction",
    onClick: () => onReact(e)
  }, e)))));
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
  const show = () => {
    if (pushedNum != null) setPhase("visible");
  };
  return {
    phase,
    dismiss,
    show
  };
}
function LSProductCard({
  product,
  phase,
  onBuy,
  onClose
}) {
  const [secs, setSecs] = useStateEV(product.flashSecs);
  useEffectEV(() => {
    setSecs(product.flashSecs);
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [product]);
  if (phase === "hidden") return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-product" + (phase === "out" ? " out" : "")
  }, /*#__PURE__*/React.createElement("button", {
    className: "x",
    "aria-label": "Dismiss offer",
    title: "Dismiss",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 13,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: product.img,
    alt: ""
  }), /*#__PURE__*/React.createElement("b", null, product.num)), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ttl"
  }, product.title), /*#__PURE__*/React.createElement("span", {
    className: "flash"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:zap",
    size: 11,
    color: "var(--error)"
  }), "Flash sale · ", lsFmtClock(secs)), /*#__PURE__*/React.createElement("span", {
    className: "note"
  }, product.note), /*#__PURE__*/React.createElement("span", {
    className: "price"
  }, "£", product.price.toFixed(2), " ", /*#__PURE__*/React.createElement("s", null, "£", product.was.toFixed(2)), " ", /*#__PURE__*/React.createElement("i", null, product.off))), /*#__PURE__*/React.createElement("button", {
    className: "buy",
    onClick: () => onBuy(product)
  }, "Buy"));
}
function LSShowcase({
  onClose,
  onBuy
}) {
  useEffectEV(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Shop this stream"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet-card ls-showcase"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-sheet-grab"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ls-showcase-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand"
  }, "Profinity"), /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ls-rows"
  }, LS_PRODUCTS.map((p, i) => /*#__PURE__*/React.createElement("div", {
    className: "ls-row",
    key: p.num
  }, /*#__PURE__*/React.createElement("span", {
    className: "thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: ""
  }), /*#__PURE__*/React.createElement("b", null, p.num)), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, i === 0 && /*#__PURE__*/React.createElement("span", {
    className: "tag live"
  }, /*#__PURE__*/React.createElement("span", {
    className: "d"
  }), "LIVE now"), i === 1 && /*#__PURE__*/React.createElement("span", {
    className: "tag trend"
  }, "On Trend"), /*#__PURE__*/React.createElement("span", {
    className: "ttl"
  }, p.title), /*#__PURE__*/React.createElement("span", {
    className: "perk"
  }, p.note, " · Certificate included"), /*#__PURE__*/React.createElement("span", {
    className: "flash"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:zap",
    size: 11,
    color: "var(--error)"
  }), lsFmtClock(p.flashSecs)), /*#__PURE__*/React.createElement("span", {
    className: "price"
  }, "£", p.price.toFixed(2), " ", /*#__PURE__*/React.createElement("s", null, "£", p.was.toFixed(2)), " ", /*#__PURE__*/React.createElement("i", null, p.off))), /*#__PURE__*/React.createElement("button", {
    className: "buy",
    onClick: () => onBuy(p)
  }, "Buy"))))));
}

/* In-viewer checkout — buying from a live stream must never navigate the
   audience away from the video (that's the whole point of watching live),
   so this stays an overlay sheet on top of the stream instead of routing
   to CourseCheckout.html. */
function LSCheckout({
  product,
  onClose
}) {
  const [paying, setPaying] = useStateEV(false);
  const [done, setDone] = useStateEV(false);
  useEffectEV(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  if (!product) return null;
  const vat = Math.round(product.price * 0.2 * 100) / 100;
  const total = product.price + vat;
  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setDone(true);
    }, 900);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet ls-checkout-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Checkout"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet-card ls-checkout"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-sheet-grab"
  }), done ? /*#__PURE__*/React.createElement("div", {
    className: "ls-checkout-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ico"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 40,
    color: "var(--success)"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "ev-sheet-ttl"
  }, "You're in!"), /*#__PURE__*/React.createElement("p", {
    className: "ev-sheet-p"
  }, product.title, " has been added to your account — watch it any time from My Learning."), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta",
    onClick: onClose
  }, "Continue watching")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ls-showcase-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand"
  }, "Checkout"), /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ls-checkout-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: product.img,
    alt: ""
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ttl"
  }, product.title), /*#__PURE__*/React.createElement("span", {
    className: "note"
  }, product.note, " · with Dr. Tim Pearce"))), /*#__PURE__*/React.createElement("div", {
    className: "ls-checkout-summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", null, "Price"), /*#__PURE__*/React.createElement("span", null, "£", product.price.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", null, "VAT (20%)"), /*#__PURE__*/React.createElement("span", null, "£", vat.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "row total"
  }, /*#__PURE__*/React.createElement("span", null, "Total due today"), /*#__PURE__*/React.createElement("span", null, "£", total.toFixed(2)))), /*#__PURE__*/React.createElement("div", {
    className: "ls-checkout-pay"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:credit-card",
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Visa ending 4242"), /*#__PURE__*/React.createElement("span", null, "Expires 08/28")), /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta ls-checkout-cta",
    disabled: paying,
    onClick: pay
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:lock",
    size: 14,
    color: "#fff"
  }), " ", paying ? "Processing…" : "Pay £" + total.toFixed(2) + " & unlock"), /*#__PURE__*/React.createElement("p", {
    className: "ls-checkout-secure"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:shield-check",
    size: 12,
    color: "var(--gray-400)"
  }), "Secured by Stripe · stay live while you pay"))));
}

/* Echo of whatever the host is currently pushing to viewers (LSHostShowcase).
   For the speaker this is read-only — see what's pinned so they can talk to
   it, without granting them showcase controls of their own — but they can
   still dismiss the popup from their own view with the X; the host gets
   an Unpin action instead since it's their own push (removes it for
   everyone, not just their view). */
function LSPinnedForViewers({
  product,
  phase,
  onUnpin,
  onClose
}) {
  if (!product || phase === "hidden") return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-pinned" + (phase === "out" ? " out" : "")
  }, onClose && /*#__PURE__*/React.createElement("button", {
    className: "x",
    "aria-label": "Dismiss",
    title: "Dismiss",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 13,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: product.img,
    alt: ""
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Pinned for viewers"), /*#__PURE__*/React.createElement("span", {
    className: "ttl"
  }, product.title), /*#__PURE__*/React.createElement("span", {
    className: "price"
  }, "£", product.price.toFixed(2))), onUnpin && /*#__PURE__*/React.createElement("button", {
    className: "unpin",
    onClick: onUnpin
  }, "Unpin"));
}

/* ---- live stream: host + speaker controls. Host runs the stage (device
   toggles, admits raised hands, ends for everyone); speaker just controls
   their own mic/camera/facing while presenting — no moderation power. ---- */
function LSToolbar({
  role,
  mic,
  cam,
  onToggleMic,
  onToggleCam,
  onFlipCam,
  onShowcase,
  pushedNum
}) {
  if (role === "host") {
    return /*#__PURE__*/React.createElement("div", {
      className: "ls-toolbar ls-toolbar-pills"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ls-pillbtn" + (mic ? "" : " off"),
      "aria-label": mic ? "Mute microphone" : "Unmute microphone",
      title: "Microphone",
      onClick: onToggleMic
    }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: mic ? "lucide:mic" : "lucide:mic-off",
      size: 20,
      color: "#fff"
    }), /*#__PURE__*/React.createElement("span", null, mic ? "Live" : "Muted")), /*#__PURE__*/React.createElement("button", {
      className: "ls-pillbtn" + (cam ? "" : " off"),
      "aria-label": cam ? "Turn camera off" : "Turn camera on",
      title: "Camera",
      onClick: onToggleCam
    }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: cam ? "lucide:video" : "lucide:video-off",
      size: 20,
      color: "#fff"
    }), /*#__PURE__*/React.createElement("span", null, cam ? "On" : "Off")), /*#__PURE__*/React.createElement("button", {
      className: "ls-pillbtn neutral",
      "aria-label": "Flip camera",
      title: "Flip camera",
      onClick: onFlipCam
    }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: "lucide:refresh-cw",
      size: 20,
      color: "#fff"
    }), /*#__PURE__*/React.createElement("span", null, "Flip")), /*#__PURE__*/React.createElement("button", {
      className: "ls-pillbtn gold",
      "aria-label": "Products",
      title: "Products",
      onClick: onShowcase
    }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: "lucide:shopping-bag",
      size: 20,
      color: "#fff"
    }), /*#__PURE__*/React.createElement("span", null, "Products"), pushedNum != null && /*#__PURE__*/React.createElement("span", {
      className: "dot",
      "aria-hidden": "true"
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-toolbar ls-toolbar-pills"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ls-pillbtn" + (mic ? "" : " off"),
    "aria-label": mic ? "Mute microphone" : "Unmute microphone",
    title: "Microphone",
    onClick: onToggleMic
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: mic ? "lucide:mic" : "lucide:mic-off",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", null, mic ? "Live" : "Muted")), /*#__PURE__*/React.createElement("button", {
    className: "ls-pillbtn" + (cam ? "" : " off"),
    "aria-label": cam ? "Turn camera off" : "Turn camera on",
    title: "Camera",
    onClick: onToggleCam
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: cam ? "lucide:video" : "lucide:video-off",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", null, cam ? "On" : "Off")), /*#__PURE__*/React.createElement("button", {
    className: "ls-pillbtn neutral",
    "aria-label": "Flip camera",
    title: "Flip camera",
    onClick: onFlipCam
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:refresh-cw",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", null, "Flip")));
}
function LSEndConfirm({
  onCancel,
  onConfirm
}) {
  useEffectEV(() => {
    const esc = e => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onCancel]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "End live stream"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-scrim",
    "aria-label": "Close",
    onClick: onCancel
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-gate-ic warn"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:radio",
    size: 26,
    color: "var(--error)"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "ev-sheet-ttl"
  }, "End the live stream?"), /*#__PURE__*/React.createElement("p", {
    className: "ev-sheet-p"
  }, "Everyone watching will be disconnected and the stream will end for all viewers. This can't be undone."), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta danger",
    onClick: onConfirm
  }, "End live stream"), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta ghost",
    onClick: onCancel
  }, "Keep streaming")));
}
function LSParticipants({
  onCam,
  offCam,
  onToggleMute,
  requests,
  onApprove,
  onDecline,
  onClose
}) {
  useEffectEV(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const live = onCam.concat(offCam);
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Participants"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet-card ls-participants"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-sheet-grab"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ls-showcase-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand"
  }, "Participants"), /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-500)"
  }))), requests.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", {
    className: "ls-plabel"
  }, "Requests to speak"), /*#__PURE__*/React.createElement("div", {
    className: "ls-preqs"
  }, requests.map(r => /*#__PURE__*/React.createElement("div", {
    className: "ls-preq",
    key: r.id
  }, /*#__PURE__*/React.createElement("img", {
    src: r.avatar,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, r.name), /*#__PURE__*/React.createElement("span", null, r.note)), /*#__PURE__*/React.createElement("button", {
    className: "ok",
    "aria-label": "Approve " + r.name,
    title: "Approve",
    onClick: () => onApprove(r)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    className: "no",
    "aria-label": "Decline " + r.name,
    title: "Decline",
    onClick: () => onDecline(r)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 16,
    color: "var(--gray-500)"
  })))))), /*#__PURE__*/React.createElement("h4", {
    className: "ls-plabel"
  }, "Live now — ", live.length), /*#__PURE__*/React.createElement("div", {
    className: "ls-plist"
  }, live.map(p => /*#__PURE__*/React.createElement("div", {
    className: "ls-prow",
    key: p.id
  }, /*#__PURE__*/React.createElement("img", {
    src: p.avatar,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, p.name), p.host && /*#__PURE__*/React.createElement("span", {
    className: "cap"
  }, "Host")), /*#__PURE__*/React.createElement("button", {
    className: "mute" + (p.mic ? "" : " off"),
    "aria-label": p.mic ? "Mute " + p.name : "Unmute " + p.name,
    title: "Mute",
    onClick: () => onToggleMute(p)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: p.mic ? "lucide:mic" : "lucide:mic-off",
    size: 16,
    color: p.mic ? "var(--text-primary)" : "var(--error)"
  })))))));
}
function LSHostShowcase({
  pushedNum,
  onTogglePush,
  viewers,
  onClose
}) {
  useEffectEV(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const rows = LS_PRODUCTS.slice(0, 6).map(p => Object.assign({}, p, lsProductStats(p)));
  const totalSales = rows.reduce((s, p) => s + p.sold * p.price, 0);
  const totalClicks = rows.reduce((s, p) => s + p.clicks, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Products"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-sheet-card ls-showcase"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-sheet-grab"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ls-showcase-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand"
  }, "Products"), /*#__PURE__*/React.createElement("button", {
    className: "ev-sheet-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ls-pstats"
  }, /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "£", totalSales.toLocaleString()), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Sales")), /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, viewers), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Current viewers")), /*#__PURE__*/React.createElement("span", {
    className: "c"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, totalClicks), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Product clicks"))), /*#__PURE__*/React.createElement("div", {
    className: "ls-rows"
  }, rows.map(p => {
    const pinned = p.num === pushedNum;
    const off = p.was - p.price;
    return /*#__PURE__*/React.createElement("div", {
      className: "ls-row",
      key: p.num
    }, /*#__PURE__*/React.createElement("span", {
      className: "thumb"
    }, /*#__PURE__*/React.createElement("img", {
      src: p.img,
      alt: ""
    }), /*#__PURE__*/React.createElement("b", null, p.num)), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, pinned && /*#__PURE__*/React.createElement("span", {
      className: "tagrow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag pinned"
    }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: "lucide:pin",
      size: 10,
      color: "var(--premium-gold-deep)"
    }), "Pinned"), /*#__PURE__*/React.createElement("span", {
      className: "tag hot"
    }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
      name: "lucide:flame",
      size: 10,
      color: "#fff"
    }), "Hot deal")), /*#__PURE__*/React.createElement("span", {
      className: "ttl"
    }, p.title), /*#__PURE__*/React.createElement("span", {
      className: "tag off"
    }, "Extra £", off, " off"), /*#__PURE__*/React.createElement("span", {
      className: "price"
    }, "£", p.price.toFixed(2), " ", /*#__PURE__*/React.createElement("s", null, "£", p.was.toFixed(2)))), /*#__PURE__*/React.createElement("button", {
      className: "pin" + (pinned ? " on" : ""),
      onClick: () => onTogglePush(pinned ? null : p.num)
    }, pinned ? "Unpin" : "Pin"), /*#__PURE__*/React.createElement("div", {
      className: "ls-pstats sm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "c"
    }, /*#__PURE__*/React.createElement("span", {
      className: "n"
    }, p.sold), /*#__PURE__*/React.createElement("span", {
      className: "l"
    }, "Items sold")), /*#__PURE__*/React.createElement("span", {
      className: "c"
    }, /*#__PURE__*/React.createElement("span", {
      className: "n"
    }, p.cart), /*#__PURE__*/React.createElement("span", {
      className: "l"
    }, "Add-to-cart")), /*#__PURE__*/React.createElement("span", {
      className: "c"
    }, /*#__PURE__*/React.createElement("span", {
      className: "n"
    }, p.clicks), /*#__PURE__*/React.createElement("span", {
      className: "l"
    }, "Clicks"))));
  }))));
}
const LS_ROLES = [{
  key: "audience",
  label: "Audience"
}, {
  key: "host",
  label: "Host"
}, {
  key: "speaker",
  label: "Speaker"
}];

/* Dev-only preview control — lets whoever's demoing this screen flip
   between the three live-stream views without separate URLs/logins. */
function LSRoleSwitcher({
  role,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-roleswitch",
    role: "group",
    "aria-label": "Preview role"
  }, LS_ROLES.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.key,
    className: role === r.key ? "on" : "",
    onClick: () => onChange(r.key)
  }, r.label)));
}
function LiveStream({
  event,
  onLeave
}) {
  const d = Object.assign({}, EV_DETAIL, event || {});
  const hostline = d.cohost ? d.host + " & " + d.cohost : d.host;
  const [elapsed, setElapsed] = useStateEV(1990);
  const [viewers] = useStateEV(() => d.watching ? Number(d.watching) * 8 : 350);
  const {
    particles,
    spawn
  } = useReactionParticles();
  const [msgs, setMsgs] = useStateEV(() => LS_CHAT_SEED.map((m, i) => Object.assign({
    id: i
  }, m)));
  const [val, setVal] = useStateEV("");
  const [showcase, setShowcase] = useStateEV(false);
  const [checkoutProduct, setCheckoutProduct] = useStateEV(null);
  const [pushedNum, setPushedNum] = useStateEV(LS_PRODUCTS[0].num);
  const pinnedPopup = usePinnedPopup(pushedNum);
  const speakerPinnedPopup = usePinnedPopup(pushedNum);

  /* Host + speaker preview state — role defaults to audience (today's real
     behaviour is unchanged); switching roles is a dev-only affordance via
     LSRoleSwitcher, not a real permissions system. */
  const [role, setRole] = useStateEV("audience");
  const [selfMic, setSelfMic] = useStateEV(true);
  const [selfCam, setSelfCam] = useStateEV(true);
  const [selfFront, setSelfFront] = useStateEV(true);
  const [onCamPeople, setOnCamPeople] = useStateEV(() => LS_ONCAM.map(p => Object.assign({}, p)));
  const [offCamPeople, setOffCamPeople] = useStateEV(() => LS_OFFCAM.map(p => Object.assign({}, p)));
  const [requests, setRequests] = useStateEV(LS_REQUESTS);
  const [panel, setPanel] = useStateEV(null); // null | "participants" | "showcase" | "end"

  /* Katy Wilson (the logged-in user, PFAEV.ME) already sits in LS_OFFCAM
     as the host, camera off — speaker role promotes her into the main
     stage grid instead with a live camOff/mic state of her own, host role
     just wires her existing stage tile's mic icon to the self-mic toggle. */
  const stageOnCam = role === "speaker" ? onCamPeople.concat([{
    id: "katy",
    name: "Katy Wilson",
    avatar: "assets/avatar-katy.jpg",
    mic: selfMic,
    speaking: selfMic,
    camOff: !selfCam,
    rear: !selfFront
  }]) : onCamPeople;
  const stageOffCam = role === "host" ? offCamPeople.map(p => p.id === "katy" ? Object.assign({}, p, {
    mic: selfMic
  }) : p) : role === "speaker" ? offCamPeople.filter(p => p.id !== "katy") : offCamPeople;
  const toggleMute = p => {
    if (p.id === "katy") {
      setSelfMic(m => !m);
      return;
    }
    setOnCamPeople(arr => arr.map(x => x.id === p.id ? Object.assign({}, x, {
      mic: !x.mic
    }) : x));
    setOffCamPeople(arr => arr.map(x => x.id === p.id ? Object.assign({}, x, {
      mic: !x.mic
    }) : x));
  };
  const approveRequest = r => {
    setOnCamPeople(arr => arr.concat([{
      id: r.id,
      name: r.name,
      avatar: r.avatar,
      mic: true,
      speaking: false
    }]));
    setRequests(rs => rs.filter(x => x.id !== r.id));
  };
  const declineRequest = r => setRequests(rs => rs.filter(x => x.id !== r.id));
  useEffectEV(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffectEV(() => {
    let i = LS_CHAT_SEED.length;
    const t = setInterval(() => {
      const next = LS_CHAT_SEED[i % LS_CHAT_SEED.length];
      i++;
      setMsgs(m => {
        const last = m[m.length - 1];
        if (last && last.name === next.name && last.text === next.text) return m;
        return m.slice(-40).concat([Object.assign({
          id: Date.now()
        }, next)]);
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);
  useEffectEV(() => {
    const esc = e => e.key === "Escape" && onLeave();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onLeave]);
  const send = () => {
    const t = val.trim();
    if (!t) return;
    const me = PFAEV && PFAEV.ME && PFAEV.ME.name || "You";
    setMsgs(m => m.slice(-40).concat([{
      id: Date.now(),
      name: me,
      text: t
    }]));
    setVal("");
  };
  const addReply = (msgId, text) => {
    const me = PFAEV && PFAEV.ME && PFAEV.ME.name || "You";
    setMsgs(m => m.map(x => x.id === msgId ? Object.assign({}, x, {
      replies: (x.replies || []).concat([{
        id: Date.now(),
        name: me,
        text
      }])
    }) : x));
  };
  const buy = p => {
    setShowcase(false);
    setCheckoutProduct(p);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-screen",
    "data-screen-label": "Live Stream"
  }, /*#__PURE__*/React.createElement(LSStage, {
    onCam: stageOnCam,
    offCam: stageOffCam
  }), /*#__PURE__*/React.createElement(LSTopBar, {
    role: role,
    elapsed: elapsed,
    viewers: viewers,
    onLeave: onLeave,
    onEndClick: () => setPanel("end"),
    onParticipants: () => setPanel("participants"),
    pendingCount: requests.length
  }), /*#__PURE__*/React.createElement(LSTitleBlock, {
    title: d.title,
    hosts: hostline
  }), /*#__PURE__*/React.createElement("div", {
    className: "ls-overlay"
  }, /*#__PURE__*/React.createElement(LSChat, {
    msgs: msgs,
    onAddReply: addReply
  }), role === "audience" && pushedNum != null && pinnedPopup.phase !== "hidden" && /*#__PURE__*/React.createElement(LSProductCard, {
    product: LS_PRODUCTS.find(p => p.num === pushedNum),
    phase: pinnedPopup.phase,
    onBuy: buy,
    onClose: pinnedPopup.dismiss
  }), role !== "audience" && pushedNum && /*#__PURE__*/React.createElement(LSPinnedForViewers, {
    product: LS_PRODUCTS.find(p => p.num === pushedNum),
    phase: role === "speaker" ? speakerPinnedPopup.phase : "visible",
    onUnpin: role === "host" ? () => setPushedNum(null) : undefined,
    onClose: role === "speaker" ? speakerPinnedPopup.dismiss : undefined
  }), role !== "audience" && /*#__PURE__*/React.createElement(LSToolbar, {
    role: role,
    mic: selfMic,
    cam: selfCam,
    onToggleMic: () => setSelfMic(m => !m),
    onToggleCam: () => setSelfCam(c => !c),
    onFlipCam: () => setSelfFront(f => !f),
    onShowcase: () => setPanel("showcase"),
    pushedNum: pushedNum
  }), /*#__PURE__*/React.createElement(LSComposer, {
    value: val,
    onChange: setVal,
    onSend: send,
    onReact: spawn,
    onOpenBasket: role === "audience" ? () => {
      setShowcase(true);
      pinnedPopup.show();
    } : undefined
  })), /*#__PURE__*/React.createElement(LSReactions, {
    particles: particles
  }), role === "audience" && showcase && /*#__PURE__*/React.createElement(LSShowcase, {
    onClose: () => setShowcase(false),
    onBuy: buy
  }), checkoutProduct && /*#__PURE__*/React.createElement(LSCheckout, {
    product: checkoutProduct,
    onClose: () => setCheckoutProduct(null)
  }), role === "host" && panel === "participants" && /*#__PURE__*/React.createElement(LSParticipants, {
    onCam: stageOnCam,
    offCam: stageOffCam,
    onToggleMute: toggleMute,
    requests: requests,
    onApprove: approveRequest,
    onDecline: declineRequest,
    onClose: () => setPanel(null)
  }), role === "host" && panel === "showcase" && /*#__PURE__*/React.createElement(LSHostShowcase, {
    pushedNum: pushedNum,
    onTogglePush: setPushedNum,
    viewers: viewers,
    onClose: () => setPanel(null)
  }), role === "host" && panel === "end" && /*#__PURE__*/React.createElement(LSEndConfirm, {
    onCancel: () => setPanel(null),
    onConfirm: onLeave
  }), /*#__PURE__*/React.createElement(LSRoleSwitcher, {
    role: role,
    onChange: setRole
  }));
}

/* ---- waiting room: the live lobby shown between "Join Live Now" and the
   live stream. Full-bleed host camera, no self-preview or camera permission
   — the audience joins muted with camera off, so this is a lobby, not a
   device check. A member "arrives" in the chat every ~2.6s. ---- */
const EV_ARRIVALS = [{
  name: "Miranda Pearce",
  text: "Just joined — excited for this one"
}, {
  name: "Aisha Rahman",
  text: "Can't wait, my first Technique Tuesday 🙌"
}, {
  name: "Grace Lindqvist",
  text: "Hello from Stockholm!"
}, {
  name: "Jonas Adeyemi",
  text: "Hoping he covers migration tonight"
}];
function WaitingRoom({
  onBack,
  onJoin,
  event
}) {
  const d = Object.assign({}, EV_DETAIL, event || {});
  const watching = d.watching || d.going || "40";
  const [msgs, setMsgs] = useStateEV(() => [Object.assign({
    id: 0
  }, EV_ARRIVALS[0])]);
  useEffectEV(() => {
    let i = 1;
    const t = setInterval(() => {
      setMsgs(m => m.slice(-4).concat([Object.assign({
        id: Date.now()
      }, EV_ARRIVALS[i % EV_ARRIVALS.length])]));
      i++;
    }, 2600);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-lobby",
    "data-screen-label": "Waiting Room",
    style: {
      backgroundImage: "url(assets/live-preview-camera.jpg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-lobby-scrim",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-lobby-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-lobby-back",
    "aria-label": "Back",
    title: "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ev-lobby-live"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse"
  }), "LIVE NOW"), /*#__PURE__*/React.createElement("span", {
    className: "ev-lobby-viewers"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:users",
    size: 15,
    color: "#fff"
  }), watching)), /*#__PURE__*/React.createElement("div", {
    className: "ev-lobby-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-lobby-badge"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:radio",
    size: 28,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h1", {
    className: "ev-lobby-h"
  }, d.title, " is live now"), /*#__PURE__*/React.createElement("p", {
    className: "ev-lobby-lead"
  }, /*#__PURE__*/React.createElement("b", null, watching, " clinicians"), " are already watching. Tap below to join — no approval needed."), /*#__PURE__*/React.createElement("p", {
    className: "ev-lobby-desc"
  }, "Join ", d.host, " every week for a live, interactive session — expert technique demonstrations, your questions answered, and the latest thinking in aesthetic medicine."), /*#__PURE__*/React.createElement("ul", {
    className: "ev-lobby-checks"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "var(--success)"
  }), "Step-by-step technique demonstration"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "var(--success)"
  }), "Live Q&A with the panel"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "var(--success)"
  }), "Real-world case studies"))), /*#__PURE__*/React.createElement("div", {
    className: "ev-lobby-chat",
    "aria-live": "polite"
  }, msgs.map(m => /*#__PURE__*/React.createElement("div", {
    className: "ev-lobby-msg",
    key: m.id
  }, /*#__PURE__*/React.createElement("b", null, m.name), " ", m.text))), /*#__PURE__*/React.createElement("button", {
    className: "ev-lobby-join",
    onClick: onJoin
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:radio",
    size: 19,
    color: "#fff"
  }), "Join the live"));
}

/* ---- app shell: list/detail/waiting/call screen stack, view + calendar
   month lifted here so Back returns you to the list in the view you left it
   (list stays list; calendar returns to the same month). ---- */
function EventsContent() {
  const [screen, setScreen] = useStateEV("list"); // list | detail | waiting | call
  const [sel, setSel] = useStateEV(null);
  const [view, setView] = useStateEV("list");
  const [cur, setCur] = useStateEV({
    y: EV_TODAY.getFullYear(),
    m: EV_TODAY.getMonth()
  });
  /* Where the waiting room's back button returns to: a live event tapped
     straight from the list skips detail entirely, so back must return to
     the list — not a detail screen the user never saw. */
  const [waitFrom, setWaitFrom] = useStateEV("list");
  const open = e => {
    setSel(e);
    if (e.state === "live") {
      setWaitFrom("list");
      setScreen("waiting");
    } else {
      setScreen("detail");
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, screen === "list" && /*#__PURE__*/React.createElement(EventsList, {
    onBack: () => goEV("NewsfeedMobile.html"),
    onOpen: open,
    view: view,
    setView: setView,
    cur: cur,
    setCur: setCur
  }), screen === "detail" && /*#__PURE__*/React.createElement(EventDetail, {
    event: sel,
    onBack: () => setScreen("list"),
    onJoin: () => {
      setWaitFrom("detail");
      setScreen("waiting");
    }
  }), screen === "waiting" && /*#__PURE__*/React.createElement(WaitingRoom, {
    event: sel,
    onBack: () => setScreen(waitFrom),
    onJoin: () => setScreen("call")
  }), screen === "call" && /*#__PURE__*/React.createElement(LiveStream, {
    event: sel,
    onLeave: () => setScreen("detail")
  }));
}
function EventsApp() {
  const mobile = useIsMobileEV();
  const scale = useDeviceScaleEV();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(EventsContent, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(EventsContent, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(EventsApp, null));
