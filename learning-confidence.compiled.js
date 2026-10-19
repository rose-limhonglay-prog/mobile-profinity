/* ===========================================================================
   PROfinity — My Learning (Confidence tier, mobile) · iPhone 17 Pro Max
   Shared by LearningMobileConfidence.html (deep-navy reader, #0B1024) and
   LearningMobileConfidenceLight.html (standard light page surface).

   Separate from the free-tier LearningMobile.html / learning-mobile.jsx, which
   keeps its locked courses and Free Resources gate. Composed on the bound DS
   bundle (ProgressBar, Avatar, IconifyIcon) and the shared mobile chrome
   (window.PFSideMenuC, window.PFUseHeaderHideC). Suffixed -LC because every
   Babel page script shares one global scope.

   Variant flags are read at module scope, so the shell must set them before
   this script loads:
     window.PF_TIER     = "confidence"
     window.PF_LC_LIGHT = true          (light page only)
   The screen root is .lcm-screen and adds .lc-light for the light variant.

   Completion: localStorage["pf-lessons-done"] (array of lesson names) with a
   "pf-lessons-done" CustomEvent on write — the same store the lesson reader
   (lesson-confidence.jsx) and the course detail page use, so the "n of 5
   completed" counter and the row ticks here never disagree with them.
   =========================================================================== */
const {
  useState: useStateLC,
  useEffect: useEffectLC,
  useRef: useRefLC,
  useMemo: useMemoLC
} = React;
const DSLC = window.ProfinityDesignSystem_c2b5cc;
const SideMenuLC = window.PFSideMenuC;
const NotificationsLC = window.PFNotificationsPanelC;
const MessagesLC = window.PFMessagesPanelC;
const useHeaderHideLC = window.PFUseHeaderHideC;
const PFLS_LC = window.PFLearnShared;
const LC_TIER = window.PF_TIER || "confidence";
const LC_LIGHT = !!window.PF_LC_LIGHT;

/* Glyph ink per variant. The DS IconifyIcon writes its colour inline, so
   per-variant colours are passed at the call site, never set in CSS.
   Gold #CE9957 fails AA on the light surface (~2.4:1) → #8A5303 there. */
const LC_INK = {
  gold: LC_LIGHT ? "#8A5303" : "#CE9957",
  text: LC_LIGHT ? "#0C1928" : "#FFFFFF",
  /* My Learning navy */
  body: LC_LIGHT ? "#475467" : "rgba(255,255,255,.76)",
  muted: LC_LIGHT ? "#475467" : "rgba(255,255,255,.62)",
  success: LC_LIGHT ? "#2a9568" : "#5CD39A",
  /* glyph on a #CE9957 circle — navy reads 5.3:1 on light, #0B1024 7.5:1 on dark */
  onGold: LC_LIGHT ? "#0C1928" : "#0B1024",
  /* glyph on the deep-gold ramp (#A26301 → #7A4A03) — white ink */
  onRamp: "#FFFFFF",
  /* glyph inside the white circle on that ramp */
  rampDeep: "#7A4A03",
  tabOff: LC_LIGHT ? "#000000" : "#FFFFFF"
};
const LC_LOCKUP = LC_LIGHT ? "assets/profinity-academy-logo-full.png" : "assets/profinity-logo-dark.jpg";
const LC_ME = {
  name: "Katy",
  avatar: "assets/avatar-katy.jpg"
};

/* Sibling pages in the same variant so the theme never flips mid-journey. */
const LC_URLS = {
  self: LC_LIGHT ? "LearningMobileConfidenceLight.html" : "LearningMobileConfidence.html",
  other: LC_LIGHT ? "LearningMobileConfidence.html" : "LearningMobileConfidenceLight.html",
  courseDetail: LC_LIGHT ? "CourseDetailConfidenceLight.html" : "CourseDetailConfidence.html",
  /* Lesson deep links open the Confidence reader's full-screen player
     (?play=1) in the same variant. Lesson.html is the standard lesson page
     (lesson.jsx) and stays untouched. */
  lesson: LC_LIGHT ? "CourseDetailConfidenceLight.html" : "CourseDetailConfidence.html",
  /* Confidence catalogue browser in the same variant */
  allCourses: LC_LIGHT ? "AllCoursesConfidenceLight.html" : "AllCoursesConfidence.html",
  theme: LC_LIGHT ? "light" : "dark"
};
function goLC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ---------------------------------------------------------------- completion store -- */
const LC_DONE_KEY = "pf-lessons-done";
function readDoneLC() {
  try {
    const raw = window.localStorage.getItem(LC_DONE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

/* Read on mount, re-read on the shared event and on cross-tab storage. This
   page never writes — completion is recorded by the lesson reader. */
function useLessonsDoneLC() {
  const [done, setDone] = useStateLC(readDoneLC);
  useEffectLC(() => {
    const sync = () => setDone(readDoneLC());
    const onStorage = e => {
      if (!e.key || e.key === LC_DONE_KEY) sync();
    };
    window.addEventListener(LC_DONE_KEY, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LC_DONE_KEY, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return done;
}

/* ---------------------------------------------------------------- course data -- */
/* The 8D Lip Design course. Only the current module's lessons are listed here.
   Each row has a display `name` and a store `key` — the key is the lesson name
   lesson-confidence.jsx writes to pf-lessons-done on completion, so ticks here
   follow the reader. `base` marks lessons finished in earlier sessions (the
   "4 of 5 completed" baseline). Course-level "28 of 39" = lessons completed in
   earlier modules + this module's completed rows. */
const LC_COURSE = {
  slug: "8d-lip-design",
  title: "8D Lip Design",
  still: "assets/course-full-face-rejuvenation.jpg",
  totalLessons: 39,
  doneBeforeThisModule: 24
};
const LC_MODULE = {
  eyebrow: "Module 3 · Lip Anatomy",
  name: "Assessment",
  /* ?level=&module= indices lesson-confidence.jsx expects for these rows */
  level: 0,
  section: 0,
  lessons: [{
    name: "The Aesthetic Impact",
    mins: 6,
    key: "Lip anatomy essentials",
    base: true
  }, {
    name: "Emotional Impact",
    mins: 4,
    key: "Vascular landmarks of the lip",
    base: true
  }, {
    name: "Patient Perspective",
    mins: 5,
    key: "Assessing lip proportions",
    base: true
  }, {
    name: "Practitioner Perspective",
    mins: 5,
    key: "Photographing the lips for assessment",
    base: true
  }, {
    name: "Aesthetic Impact in Practice",
    mins: 8,
    key: "Assessment checklist walkthrough"
  }]
};
function lessonDoneLC(l, done) {
  return !!l.base || done.indexOf(l.key) !== -1;
}

/* Related courses are paid — the course page (lesson-confidence.jsx) lists
   their lessons but gates starting behind CourseCheckout.html. Prices match
   LX_PRICES there. Temple Filler carries no price: it is part of the
   Confidence membership (My Courses on LearningMobile.html), so it opens
   unlocked (user, 2026-09-15). */
const LC_RELATED = [{
  title: "Temple Filler",
  level: "Advanced",
  lessons: 14,
  image: "assets/course-temple-filler.webp",
  blurb: "Master safe injection techniques with anatomical precision."
}, {
  title: "Advanced Lip Techniques",
  level: "Advanced",
  lessons: 18,
  price: 342,
  image: "assets/course-advanced-lip-techniques.jpg",
  blurb: "Build on 8D with layered volume, borders and perioral balance."
}, {
  title: "Complications Management",
  level: "Advanced",
  lessons: 12,
  price: 450,
  image: "assets/course-complications.jpg",
  blurb: "Recognise, prevent and manage vascular and other complications."
}];
const LC_TABS = [{
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
  href: null
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Agent",
  label: "Agents",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}, {
  key: "Rewards",
  label: "Rewards",
  icon: "lucide:gift",
  href: "RewardsDashboard.html"
}];
function lessonUrlLC(idx) {
  return LC_URLS.lesson + "?" + new URLSearchParams({
    course: LC_COURSE.slug,
    level: LC_MODULE.level,
    module: LC_MODULE.section,
    lesson: idx,
    theme: LC_URLS.theme,
    play: 1
  }).toString();
}
function courseUrlLC(c) {
  const p = {
    title: c.title,
    instr: "Dr. Tim Pearce",
    pct: 0
  };
  if (c.dur) p.dur = c.dur;
  if (c.price) p.price = c.price;
  return "CourseDetail.html?" + new URLSearchParams(p).toString();
}

/* ---------------------------------------------------------------- header -- */
/* burger · lockup · search · notifications · messages — the shared newsfeed
   top bar minus the points pill. The bell and message buttons open the shared
   drawers from mobilechrome.jsx. */
function LCHeader({
  onMenu,
  onBell,
  onMessages
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "lcm-top",
    "data-screen-label": "Header"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-burger",
    "aria-label": "Menu",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:menu",
    size: 24,
    color: LC_INK.text
  })), /*#__PURE__*/React.createElement("div", {
    className: "lcm-lockup"
  }, /*#__PURE__*/React.createElement("img", {
    src: LC_LOCKUP,
    alt: "PROfinity Academy"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lcm-grow"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-ic",
    "aria-label": "Search",
    onClick: () => goLC("SearchMobile.html")
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:search",
    size: 20,
    color: LC_INK.text
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-ic",
    "aria-label": "Notifications, 12 unread",
    onClick: onBell
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:bell",
    size: 20,
    color: LC_INK.text
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    "aria-hidden": "true"
  }, "12")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-ic",
    "aria-label": "Messages, 12 unread",
    onClick: onMessages
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:message-circle",
    size: 20,
    color: LC_INK.text
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot",
    "aria-hidden": "true"
  }, "12")));
}

/* ---------------------------------------------------------------- course progress -- */
function LCRing({
  pct,
  size = 78,
  stroke = 7
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return /*#__PURE__*/React.createElement("svg", {
    className: "lcm-ring",
    width: size,
    height: size,
    viewBox: "0 0 " + size + " " + size,
    role: "img",
    "aria-label": pct + "% complete"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--lcm-ring-track)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--lcm-ring)",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: off,
    transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")"
  }), /*#__PURE__*/React.createElement("text", {
    x: "50%",
    y: "50%",
    dy: ".36em",
    textAnchor: "middle",
    className: "lcm-ring-n"
  }, pct, "%"));
}
function LCProgressCard({
  doneCount,
  total
}) {
  const pct = Math.round(doneCount / total * 100);
  const left = total - doneCount;
  return /*#__PURE__*/React.createElement("section", {
    className: "lcm-sec lcm-sec-first",
    "data-screen-label": "Course progress"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-card lcm-prog",
    onClick: () => goLC(LC_URLS.courseDetail),
    "aria-label": "Open " + LC_COURSE.title + " course, " + pct + "% complete"
  }, /*#__PURE__*/React.createElement(LCRing, {
    pct: pct,
    size: 92,
    stroke: 9
  }), /*#__PURE__*/React.createElement("span", {
    className: "lcm-prog-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-eyebrow lcm-eyebrow-strong"
  }, "Course progress"), /*#__PURE__*/React.createElement("span", {
    className: "lcm-prog-stat"
  }, /*#__PURE__*/React.createElement("b", null, doneCount), " of ", /*#__PURE__*/React.createElement("span", {
    className: "lcm-prog-total"
  }, total), " lessons"), /*#__PURE__*/React.createElement("span", {
    className: "lcm-prog-bar"
  }, /*#__PURE__*/React.createElement(DSLC.ProgressBar, {
    value: pct,
    showPercent: false,
    height: 8
  })), /*#__PURE__*/React.createElement("span", {
    className: "lcm-prog-left"
  }, left, " ", left === 1 ? "lesson" : "lessons", " to go")), /*#__PURE__*/React.createElement("span", {
    className: "lcm-prog-arrow",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: LC_INK.muted
  }))));
}

/* ---------------------------------------------------------------- current lesson -- */
function LCCurrentLesson({
  lesson,
  idx,
  saved,
  onSave
}) {
  const open = () => goLC(lessonUrlLC(idx));
  return /*#__PURE__*/React.createElement("section", {
    className: "lcm-sec",
    "data-screen-label": "Current lesson"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-card lcm-cur"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-cur-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-cur-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-eyebrow lcm-eyebrow-gold"
  }, "Current lesson"), /*#__PURE__*/React.createElement("span", {
    className: "lcm-cur-mod"
  }, LC_MODULE.eyebrow)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-save" + (saved ? " on" : ""),
    "aria-label": saved ? "Remove from saved" : "Save lesson",
    "aria-pressed": saved,
    onClick: onSave
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: saved ? "lucide:bookmark-check" : "lucide:bookmark",
    size: 22,
    color: saved ? LC_INK.gold : LC_INK.text
  }))), /*#__PURE__*/React.createElement("h1", {
    className: "lcm-title"
  }, lesson.name), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-still",
    onClick: open,
    "aria-label": "Open " + lesson.name
  }, /*#__PURE__*/React.createElement("img", {
    src: LC_COURSE.still,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "lcm-expand",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:maximize-2",
    size: 18,
    color: "#fff"
  })))));
}

/* ---------------------------------------------------------------- lesson modules -- */
function LCModules({
  done,
  currentIdx,
  nextIdx
}) {
  const lessons = LC_MODULE.lessons;
  const doneCount = lessons.filter(l => lessonDoneLC(l, done)).length;
  const allDone = doneCount === lessons.length;
  return /*#__PURE__*/React.createElement("section", {
    className: "lcm-sec",
    "data-screen-label": "Lesson modules"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-sec-h lcm-sec-h-eyebrow"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "lcm-eyebrow lcm-eyebrow-gold"
  }, "Lesson modules"), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, doneCount, " of ", lessons.length, " completed")), /*#__PURE__*/React.createElement("ol", {
    className: "lcm-rows"
  }, lessons.map((l, i) => {
    const isDone = lessonDoneLC(l, done);
    const isCur = i === currentIdx;
    return /*#__PURE__*/React.createElement("li", {
      key: l.key
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "lcm-row" + (isDone ? " done" : "") + (isCur ? " on" : ""),
      onClick: () => goLC(lessonUrlLC(i)),
      "aria-current": isCur ? "step" : undefined
    }, /*#__PURE__*/React.createElement("span", {
      className: "lcm-row-title"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lcm-row-n"
    }, i + 1, "."), " ", l.name), /*#__PURE__*/React.createElement("span", {
      className: "lcm-row-dur"
    }, l.mins, " min"), /*#__PURE__*/React.createElement("span", {
      className: "lcm-tick" + (isDone ? " done" : ""),
      role: "img",
      "aria-label": isDone ? "Completed" : "Not completed"
    }, isDone && /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
      name: "lucide:check",
      size: 14,
      color: "#fff",
      strokeWidth: 3
    }))));
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-continue",
    onClick: () => goLC(allDone ? LC_URLS.courseDetail : lessonUrlLC(nextIdx))
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: allDone ? "lucide:check" : "fluent:play-16-filled",
    size: 16,
    color: LC_INK.onGold
  }), allDone ? "Module complete — open course" : "Continue to next lesson"));
}

/* ---------------------------------------------------------------- related -- */
function LCRelated() {
  /* shared pool + PRICES: a bought course drops out and the next back-fills;
     Temple Filler stays as "included" for Confidence */
  const purchased = PFLS_LC.usePurchased();
  const related = PFLS_LC.pickRelated({
    purchased,
    tier: LC_TIER,
    n: 3,
    includeOwned: true,
    exclude: [LC_COURSE.slug]
  });
  if (!related.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "lcm-sec",
    "data-screen-label": "Related courses"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Related")), /*#__PURE__*/React.createElement("div", {
    className: "lcm-list"
  }, related.map(c => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-card lcm-course",
    key: c.title,
    onClick: () => goLC(courseUrlLC(c))
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-course-thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: c.image,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "lcm-course-chip"
  }, c.lessons, " lessons"), c.price > 0 && /*#__PURE__*/React.createElement("span", {
    className: "lcm-course-chip lcm-course-lock",
    "aria-label": "Paid course"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:lock",
    size: 11,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "lcm-course-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-eyebrow lcm-eyebrow-gold"
  }, c.level, c.price ? " · £" + c.price : ""), /*#__PURE__*/React.createElement("span", {
    className: "lcm-course-title"
  }, c.title), /*#__PURE__*/React.createElement("span", {
    className: "lcm-course-blurb"
  }, c.blurb)), /*#__PURE__*/React.createElement("span", {
    className: "lcm-arrow lcm-arrow-gold",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: LC_INK.onGold
  }))))));
}

/* ---------------------------------------------------------------- free resources -- */
function LCFreeResources() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lcm-sec",
    "data-screen-label": "Free resources"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Free resources")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-card lcm-res",
    onClick: () => goLC(LC_URLS.allCourses + "?free=1")
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-res-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:folder-open",
    size: 22,
    color: LC_INK.gold
  })), /*#__PURE__*/React.createElement("span", {
    className: "lcm-res-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-res-title"
  }, "Guides, checklists & vein maps"), /*#__PURE__*/React.createElement("span", {
    className: "lcm-res-sub"
  }, "Free downloads tailored to your clinic goals, kept in My Saved.")), /*#__PURE__*/React.createElement("span", {
    className: "lcm-arrow lcm-arrow-gold",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: LC_INK.onGold
  }))));
}

/* ---------------------------------------------------------------- ramp cards -- */
/* White ink needs the deep-gold ramp (#A26301 → #7A4A03); on the light gold
   white sits at ~2.1:1, so the surface is darkened rather than the text. */
function LCRampCard({
  title,
  body,
  cta,
  onClick,
  label
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lcm-sec",
    "data-screen-label": label
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-ramp",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-ramp-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-ramp-title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "lcm-ramp-body"
  }, body), cta && /*#__PURE__*/React.createElement("span", {
    className: "lcm-ramp-cta"
  }, cta)), /*#__PURE__*/React.createElement("span", {
    className: "lcm-arrow lcm-arrow-white",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: LC_INK.rampDeep
  }))));
}

/* ---------------------------------------------------------------- tab bar -- */
function LCTabBar({
  compact
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "lm-tabs" + (compact ? " lm-tabs-compact" : ""),
    "aria-label": "Primary"
  }, LC_TABS.map(t => {
    const on = t.key === "Learning";
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      className: "lm-tab" + (on ? " on" : ""),
      "aria-current": on ? "page" : undefined,
      onClick: () => t.href && goLC(t.href)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
      name: t.icon,
      size: 24,
      color: on ? LC_LIGHT ? "#fff" : LC_INK.onGold : LC_INK.tabOff
    }), t.dot && /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, t.dot)), /*#__PURE__*/React.createElement("span", {
      className: "lbl"
    }, t.label));
  }));
}

/* ---------------------------------------------------------------- my membership · technique tuesdays -- */
/* Entry point into the Confidence membership journey (2026-10-15):
   My Learning → My Membership (MembershipConfidence.html) → Technique
   Tuesdays (TechniqueTuesdays.html) → lesson. Data is the REAL PROfinity
   Membership course via window.PFMembership (membership-data.js, loaded by
   the shell after learning-shared.js): lesson titles, numbers, durations and
   intros come from the app seed; nothing here is invented. The membership
   CDN posters are not public, so cards draw a numbered tile — a placeholder,
   not artwork. Sessions before Lesson 50 have no duration in the seed, so
   their duration chip is simply omitted rather than guessed.
   Watch progress (Continue watching) is the shared pf-membership-watch store
   the lesson reader writes; completion is pf-lessons-done like everything
   else on this page. The section renders nothing when the module is absent. */
const M_LC = window.PFMembership || null;
if (M_LC && M_LC.seed) M_LC.seed(); /* idempotent demo baseline, before first render */

const LC_MEMBERSHIP_URLS = {
  hub: "MembershipConfidence.html",
  tuesdays: "TechniqueTuesdays.html"
};

/* Lesson details → straight into the player, in THIS variant, returning here. */
function membershipLessonUrlLC(l, play) {
  const p = {
    course: M_LC.SLUG,
    level: l.li,
    module: l.si,
    lesson: l.ni,
    theme: LC_URLS.theme,
    ret: LC_URLS.self
  };
  if (play) p.play = 1;
  return LC_URLS.lesson + "?" + new URLSearchParams(p).toString();
}
function withThemeLC(url) {
  return url + (url.indexOf("?") === -1 ? "?" : "&") + "theme=" + LC_URLS.theme;
}

/* Numbered tile standing in for the (non-public) session poster. */
function LCTTTile({
  lesson,
  size,
  pct
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-tile" + (size ? " lcm-tt-tile-" + size : ""),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-tile-n"
  }, lesson.n), /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-tile-play"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "fluent:play-16-filled",
    size: size === "lg" ? 18 : 12,
    color: "#fff"
  })), pct > 0 && /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-tile-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + "%"
    }
  })));
}
function LCTechniqueTuesdays({
  done
}) {
  if (!M_LC) return null;
  const watch = M_LC.useWatch();
  const tt = M_LC.ttLessons();
  const latest = M_LC.ttLatest(3);
  const featured = latest[0];
  const resume = useMemoLC(() => M_LC.continueWatching(done, watch).filter(x => x.lesson.n).slice(0, 4), [done, watch]);
  const ttDone = tt.filter(l => done.indexOf(l.name) !== -1).length;
  const live = M_LC.nextLive();
  const featuredPct = watch[featured.name] ? M_LC.watchPct(watch[featured.name]) : 0;
  const featuredDone = done.indexOf(featured.name) !== -1;
  const ctaFor = l => done.indexOf(l.name) !== -1 ? "Rewatch" : watch[l.name] && M_LC.watchPct(watch[l.name]) > 0 ? "Continue" : "Watch";
  const openAll = () => goLC(withThemeLC(LC_MEMBERSHIP_URLS.tuesdays));
  return /*#__PURE__*/React.createElement("section", {
    className: "lcm-sec",
    "data-screen-label": "Technique Tuesdays"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-sec-h lcm-sec-h-eyebrow"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "lcm-eyebrow lcm-eyebrow-gold"
  }, "My membership"), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, M_LC.TIER_NAME)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-card lcm-mem",
    onClick: () => goLC(withThemeLC(LC_MEMBERSHIP_URLS.hub)),
    "aria-label": "Open my Confidence membership"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-res-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:graduation-cap",
    size: 22,
    color: LC_INK.gold
  })), /*#__PURE__*/React.createElement("span", {
    className: "lcm-res-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-res-title"
  }, M_LC.TITLE), /*#__PURE__*/React.createElement("span", {
    className: "lcm-res-sub"
  }, "Learning Map, ", M_LC.MODULES.length, " modules and the weekly live session — everything in Confidence.")), /*#__PURE__*/React.createElement("span", {
    className: "lcm-prog-arrow",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: LC_INK.muted
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lcm-sec-h lcm-tt-h"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "lcm-eyebrow lcm-eyebrow-gold"
  }, "Technique Tuesdays"), /*#__PURE__*/React.createElement("h2", {
    className: "lcm-tt-title"
  }, "Weekly live injection demos")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-tt-all",
    onClick: openAll
  }, "View all")), /*#__PURE__*/React.createElement("p", {
    className: "lcm-tt-desc"
  }, "Dr Tim's members-only training library: ", tt.length, " recorded sessions, a new one every Tuesday.", ttDone > 0 ? " You've completed " + ttDone + " so far." : ""), /*#__PURE__*/React.createElement("div", {
    className: "lcm-tt-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-tt-art"
  }, /*#__PURE__*/React.createElement("img", {
    src: M_LC.TT_ART,
    alt: "Technique Tuesday — every week, 8 PM UK / 3 PM ET"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-chip lcm-tt-chip-live"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:calendar",
    size: 12,
    color: "#fff"
  }), "Next live · ", live.label, " · ", live.time.split(" · ")[0])), /*#__PURE__*/React.createElement("div", {
    className: "lcm-tt-hero-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-hero-eyebrow"
  }, "Latest session · Lesson ", featured.n), /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-hero-name"
  }, M_LC.shortTitle(featured)), /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-hero-meta"
  }, featured.dur && /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-chip lcm-tt-chip-card"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:clock",
    size: 12,
    color: LC_INK.gold
  }), featured.dur), /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-chip lcm-tt-chip-card"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:user",
    size: 12,
    color: LC_INK.gold
  }), M_LC.HOST.name), featuredDone && /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-chip lcm-tt-chip-done"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:check",
    size: 12,
    color: "#fff",
    strokeWidth: 3
  }), "Completed")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-tt-watch",
    onClick: () => goLC(membershipLessonUrlLC(featured, true))
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "fluent:play-16-filled",
    size: 15,
    color: LC_INK.onGold
  }), featuredDone ? "Rewatch" : featuredPct > 0 ? "Continue · " + featuredPct + "%" : "Watch now"))), resume.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "lcm-tt-sub",
    "data-screen-label": "Continue watching"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-sec-h lcm-sec-h-eyebrow"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "lcm-eyebrow lcm-eyebrow-gold"
  }, "Continue watching"), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, resume.length, " in progress")), /*#__PURE__*/React.createElement("div", {
    className: "lcm-tt-rail"
  }, resume.map(x => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-tt-rcard",
    key: x.lesson.name,
    onClick: () => goLC(membershipLessonUrlLC(x.lesson, true)),
    "aria-label": "Resume Lesson " + x.lesson.n + ", " + x.pct + "% watched"
  }, /*#__PURE__*/React.createElement(LCTTTile, {
    lesson: x.lesson,
    size: "lg",
    pct: x.pct
  }), /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-rname"
  }, M_LC.shortTitle(x.lesson)), /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-rmeta"
  }, x.pct, "% watched", x.leftSecs ? " · " + M_LC.fmtSecs(x.leftSecs) + " left" : ""), /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-resume"
  }, /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "fluent:play-16-filled",
    size: 12,
    color: LC_INK.gold
  }), "Resume"))))), /*#__PURE__*/React.createElement("div", {
    className: "lcm-tt-sub",
    "data-screen-label": "Recently added"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lcm-sec-h lcm-sec-h-eyebrow"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "lcm-eyebrow lcm-eyebrow-gold"
  }, "Recently added"), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "Newest first")), /*#__PURE__*/React.createElement("ol", {
    className: "lcm-rows lcm-tt-rows"
  }, latest.map(l => {
    const isDone = done.indexOf(l.name) !== -1;
    const cta = ctaFor(l);
    return /*#__PURE__*/React.createElement("li", {
      key: l.name
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "lcm-row lcm-tt-row" + (isDone ? " done" : ""),
      onClick: () => goLC(membershipLessonUrlLC(l, true))
    }, /*#__PURE__*/React.createElement(LCTTTile, {
      lesson: l,
      pct: watch[l.name] && !isDone ? M_LC.watchPct(watch[l.name]) : 0
    }), /*#__PURE__*/React.createElement("span", {
      className: "lcm-tt-rowtx"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lcm-row-title lcm-tt-rowname"
    }, M_LC.shortTitle(l)), /*#__PURE__*/React.createElement("span", {
      className: "lcm-tt-rowmeta"
    }, "Lesson ", l.n, l.dur ? " · " + l.dur : "", isDone ? " · Completed" : "")), /*#__PURE__*/React.createElement("span", {
      className: "lcm-tt-cta" + (cta === "Rewatch" ? " muted" : "")
    }, cta)));
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lcm-tt-viewall",
    onClick: openAll
  }, "View all Technique Tuesdays", /*#__PURE__*/React.createElement("span", {
    className: "lcm-tt-viewall-n"
  }, tt.length), /*#__PURE__*/React.createElement(DSLC.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 16,
    color: LC_INK.gold
  })));
}

/* ---------------------------------------------------------------- screen -- */
function LearningConfidence() {
  const done = useLessonsDoneLC();
  const lessons = LC_MODULE.lessons;

  /* current lesson = first not-yet-completed, else the last one */
  const currentIdx = useMemoLC(() => {
    const i = lessons.findIndex(l => !lessonDoneLC(l, done));
    return i === -1 ? lessons.length - 1 : i;
  }, [done]);
  const doneInModule = lessons.filter(l => lessonDoneLC(l, done)).length;
  const courseDone = Math.min(LC_COURSE.totalLessons, LC_COURSE.doneBeforeThisModule + doneInModule);
  const [menuOpen, setMenuOpen] = useStateLC(false);
  const [notifOpen, setNotifOpen] = useStateLC(false);
  const [msgOpen, setMsgOpen] = useStateLC(false);
  const [saved, setSaved] = useStateLC(() => {
    try {
      return (JSON.parse(localStorage.getItem("pf-saved-courses")) || []).indexOf(LC_COURSE.title) !== -1;
    } catch (e) {
      return false;
    }
  });
  const toggleSave = () => {
    const next = !saved;
    setSaved(next);
    try {
      const list = JSON.parse(localStorage.getItem("pf-saved-courses")) || [];
      const i = list.indexOf(LC_COURSE.title);
      if (next && i === -1) list.push(LC_COURSE.title);
      if (!next && i !== -1) list.splice(i, 1);
      localStorage.setItem("pf-saved-courses", JSON.stringify(list));
    } catch (e) {}
  };
  const scrollRef = useRefLC(null);
  const {
    hidden,
    floating
  } = useHeaderHideLC(scrollRef);
  return /*#__PURE__*/React.createElement("div", {
    className: "lcm-screen" + (LC_LIGHT ? " lc-light" : "") + (floating ? " chrome-float" : "") + (hidden ? " chrome-hidden" : ""),
    "data-screen-label": "My Learning · Confidence (" + (LC_LIGHT ? "light" : "dark") + ")"
  }, /*#__PURE__*/React.createElement(LCHeader, {
    onMenu: () => setMenuOpen(true),
    onBell: () => setNotifOpen(true),
    onMessages: () => setMsgOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "lcm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement(LCProgressCard, {
    doneCount: courseDone,
    total: LC_COURSE.totalLessons
  }), /*#__PURE__*/React.createElement(LCCurrentLesson, {
    lesson: lessons[currentIdx],
    idx: currentIdx,
    saved: saved,
    onSave: toggleSave
  }), /*#__PURE__*/React.createElement(LCModules, {
    done: done,
    currentIdx: currentIdx,
    nextIdx: currentIdx
  }), /*#__PURE__*/React.createElement(LCTechniqueTuesdays, {
    done: done
  }), /*#__PURE__*/React.createElement(LCFreeResources, null), /*#__PURE__*/React.createElement(LCRampCard, {
    label: "Discover your journey",
    title: "Discover your journey",
    body: "We sequence your next-best courses from Recommended, New & Popular — one clear step at a time toward your goal.",
    onClick: () => goLC(LC_URLS.allCourses)
  }), /*#__PURE__*/React.createElement(LCRampCard, {
    label: "Unlock more with Mastery",
    title: "Unlock more with Mastery",
    body: "Every course in the catalogue, live case reviews and the Mastery community channels.",
    cta: "See what's included",
    onClick: () => goLC("MembershipTier.html")
  })), /*#__PURE__*/React.createElement(LCTabBar, {
    compact: hidden
  }), /*#__PURE__*/React.createElement(SideMenuLC, {
    open: menuOpen,
    onClose: () => setMenuOpen(false),
    dark: !LC_LIGHT,
    onToggleDark: () => goLC(LC_URLS.other)
  }), /*#__PURE__*/React.createElement(NotificationsLC, {
    open: notifOpen,
    onClose: () => setNotifOpen(false)
  }), /*#__PURE__*/React.createElement(MessagesLC, {
    open: msgOpen,
    onClose: () => setMsgOpen(false)
  }));
}
function useDeviceScaleLC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateLC(calc);
  useEffectLC(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}
function useIsMobileLC() {
  const [mobile, setMobile] = useStateLC(() => window.matchMedia("(max-width:768px)").matches);
  useEffectLC(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function LearningConfidenceApp() {
  const mobile = useIsMobileLC();
  const scale = useDeviceScaleLC();
  const vars = {
    "--action-primary": "#0C1928",
    "--action-primary-hover": "#081120"
  };
  const pageBg = LC_LIGHT ? "#F6F3EF" : "#0B1024";
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: pageBg
      }
    }, /*#__PURE__*/React.createElement(LearningConfidence, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: LC_LIGHT ? "rgb(217, 218, 225)" : "#05081a"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956,
    dark: !LC_LIGHT
  }, /*#__PURE__*/React.createElement(LearningConfidence, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(LearningConfidenceApp, null));
