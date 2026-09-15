/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Goal-first flow: goal header → goal banner → Continue Learning → progress
   spotlight → My Courses → Free Resources → Your Learning Path.
   Suffixed -L to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateL
} = React;
const DSL = window.ProfinityDesignSystem_c2b5cc;
const {
  LevelBadge: LevelBadgeL,
  IconifyIcon: IconifyL
} = DSL;
const MobileChromeC = window.MobileChromeC;
const SurveyMobile = window.SurveyMobile;
/* shared My Learning data (learning-shared.js): greeting, 8D curriculum +
   pf-lessons-done store, prices, purchased courses, related pool */
const PFLS_L = window.PFLearnShared;
function goL(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* Same "pf-subscription-tier" key the newsfeed/community/membership pages
   read and write — this file doesn't load app.jsx, so it keeps its own tiny
   copy rather than depending on window.PFApp. */
function lmReadTierL() {
  if (window.PF_TIER) return window.PF_TIER;
  try {
    return localStorage.getItem("pf-subscription-tier") || "free";
  } catch (e) {
    return "free";
  }
}
const LM_TIER = lmReadTierL();
const LM_FREE = LM_TIER === "free";

/* Membership ladder — mirrors mobilechrome.jsx's SM_TIER_LADDER_C /
   profile-mobile.jsx's SM_TIER_LADDER_PM, so a Confidence/Mastery/Freedom
   member sees their actual tier here instead of this page's old hardcoded
   "Confidence Path" for every paid viewer. */
const LM_TIER_LADDER = ["confidence", "mastery", "freedom", "inner"];
const LM_TIER_DISPLAY_NAME = {
  confidence: "Confidence",
  mastery: "Mastery",
  freedom: "Freedom",
  inner: "Inner Circle"
};
function lmNextTierL(tier) {
  const i = LM_TIER_LADDER.indexOf(tier);
  if (i === -1) return LM_TIER_LADDER[0];
  if (i === LM_TIER_LADDER.length - 1) return null;
  return LM_TIER_LADDER[i + 1];
}
const TUTOR_L = "Dr Tim Pearce";
const IMG_L = {
  lip: "assets/clinic-lip-design.png",
  protox: "assets/course-protox.png",
  eightDLip: "assets/course-8d-lip-design.jpg",
  templeFiller: "assets/course-temple-filler.webp",
  browLift: "assets/course-brow-lift.jpg",
  fullFace: "assets/course-full-face-rejuvenation.jpg",
  cheekContouring: "assets/course-cheek-contouring.jpg",
  rhinoplasty: "assets/course-rhinoplasty.jpg",
  jawlineSculpting: "assets/course-jawline-sculpting.jpg",
  tearTrough: "assets/course-tear-trough.jpg",
  skinBoosters: "assets/course-skin-boosters.jpg",
  complications: "assets/course-complications.jpg",
  consultation: "assets/course-consultation.jpg",
  membership: "https://prncpjnraanretzdeuou.supabase.co/storage/v1/object/public/course-content/courses/profinity-membership/poster.jpg"
};
const CERT_THUMB_L = "assets/certificate-thumb.svg";

/* All Courses / In Progress / Completed / Saved — same
   category strip as the web My Learning page (learning.jsx). */
/* "View all" on the My Courses rail → the mobile My Courses page (this same
   bundle, mounted with window.PF_LM_PAGE = "mycourses"). */
const LM2_MY_COURSES_URL = "MyCoursesMobile.html";
const LM2_TABS = ["All Courses", "In Progress", "Completed", "Saved"];
const LM2_COURSE_TAB_FILTERS = {
  "In Progress": c => typeof c.progress === "number" && !c.completed,
  "Completed": c => !!c.completed
};
const LM2_GOAL = {
  title: "My Goal & Dream Clinic",
  vision: "Boutique clinic with lips + skin treatments, £80k/month revenue, team of 3 professionals",
  clarifier: "Where you're heading — not where you are today."
};

/* Continue Learning resumes 8D Lip Design at the first lesson not yet
   completed — read live from the shared pf-lessons-done store, so the card
   always opens the course and lesson the member is actually on (the reader's
   player opens straight away via ?play=1). */
const LM2_CONTINUE_SLUG = "8d-lip-design";
function continueDataL(done) {
  const r = PFLS_L.resume(LM2_CONTINUE_SLUG, done);
  const inModule = r.flat.filter(l => PFLS_L.groupName(l) === r.groupName);
  const leftInModule = inModule.filter(l => done.indexOf(l.name) === -1).length;
  return {
    image: IMG_L.lip,
    level: "Intermediate",
    title: r.course.title,
    progress: r.pct,
    resume: r,
    note: r.allDone ? "Course complete — your certificate is ready." : leftInModule <= 1 ? "Last lesson in this module — then " + (r.nextModule ? r.nextModule.name : "the final quiz") + "." : "Only " + leftInModule + " more lessons in " + r.groupName + " · " + r.left + " to your certificate",
    cta: r.allDone ? "Review course" : r.started ? "Resume Lesson " + r.lessonNumber : "Start Lesson 1",
    href: r.allDone ? "CourseDetail.html?course=" + LM2_CONTINUE_SLUG : PFLS_L.mobileLessonUrl("CourseDetail.html", r.course, r.item, {
      play: 1
    })
  };
}

/* Resume link for a My Courses card — the 8D course resumes at its real
   current lesson; other courses land on the course page. */
function resumeUrlL(c) {
  if (c.slug === LM2_CONTINUE_SLUG) {
    const r = PFLS_L.resume(LM2_CONTINUE_SLUG);
    return PFLS_L.mobileLessonUrl("CourseDetail.html", r.course, r.item, {
      play: 1
    });
  }
  return "CourseDetail.html?" + new URLSearchParams({
    title: c.title,
    instr: "Dr. Tim Pearce",
    pct: c.progress || 0
  }).toString();
}

/* The 8D card reads its progress from the shared store like Continue Learning does. */
function withLiveProgressL(list, done) {
  const r = PFLS_L.resume(LM2_CONTINUE_SLUG, done);
  return list.map(c => {
    if (c.title !== "8D Lip Design") return c;
    if (r.allDone) return {
      ...c,
      slug: LM2_CONTINUE_SLUG,
      progress: undefined,
      completed: true,
      certificate: {
        issuedDate: "Today",
        id: "PF-8DL-0039",
        image: CERT_THUMB_L
      }
    };
    return {
      ...c,
      slug: LM2_CONTINUE_SLUG,
      progress: r.pct,
      lesson: r.lessonNumber,
      modulesLeft: Math.max(1, r.course.levels.filter(l => (l.sections || []).length).length - r.item.li)
    };
  });
}
const LM2_MY_COURSES = [{
  image: IMG_L.eightDLip,
  level: "Intermediate",
  title: "8D Lip Design",
  description: "Discover a complete view of lip anatomy for deeper learning.",
  progress: 20,
  lesson: 4,
  modulesLeft: 6
}, {
  image: IMG_L.templeFiller,
  level: "Advanced",
  title: "Temple Filler",
  description: "Master safe injection techniques with anatomical precision.",
  progress: 45,
  lesson: 6,
  modulesLeft: 4
}, {
  image: IMG_L.protox,
  level: "Advanced",
  title: "Protox Course",
  description: "Elevate your botulinum toxin skills and refine your technique.",
  completed: true,
  certificate: {
    issuedDate: "12 Jun 2026",
    id: "PF-PTX-2201",
    image: CERT_THUMB_L
  }
}, {
  image: IMG_L.browLift,
  level: "Intermediate",
  title: "Brow Lift Training",
  description: "Learn expert techniques for achieving flawless, natural brow lifts.",
  progress: 10,
  lesson: 2,
  modulesLeft: 7
}, {
  image: IMG_L.fullFace,
  level: "Advanced",
  title: "Full-Face Rejuvenation Protocol",
  description: "A complete framework for combination treatments across the face."
}, {
  image: IMG_L.cheekContouring,
  level: "Intermediate",
  title: "Cheek & Midface Contouring",
  description: "Master volumising techniques for natural-looking cheek definition."
}, {
  image: IMG_L.rhinoplasty,
  level: "Advanced",
  title: "Non-Surgical Rhinoplasty",
  description: "Reshape and refine the nose using dermal filler with confidence."
}, {
  image: IMG_L.jawlineSculpting,
  level: "Advanced",
  title: "Jawline Sculpting Masterclass",
  description: "Define and balance the lower face with precision filler technique."
}, {
  image: IMG_L.tearTrough,
  level: "Advanced",
  title: "Tear Trough Correction",
  description: "Safely treat under-eye hollowing with anatomically-guided technique."
}, {
  image: IMG_L.skinBoosters,
  level: "Beginner",
  title: "Skin Boosters & Hydration Therapy",
  description: "Introduce biorevitalisation treatments to improve skin quality."
}, {
  image: IMG_L.complications,
  level: "Advanced",
  title: "Complications Management",
  description: "Recognise, prevent and manage vascular and other complications."
}, {
  image: IMG_L.consultation,
  level: "Beginner",
  title: "Consultation & Patient Assessment",
  description: "Build trust and plan safe, effective treatments from the first visit.",
  completed: true,
  certificate: {
    issuedDate: "03 Feb 2026",
    id: "PF-CPA-1187",
    image: CERT_THUMB_L
  }
}];

/* Confidence tier only sees the courses included in that membership —
   the full catalogue above is for higher tiers. */
const LM2_MY_COURSES_CONFIDENCE = [{
  image: IMG_L.membership,
  level: "Beginner",
  title: "Profinity Membership",
  description: "Your welcome course — get the most out of your Confidence membership."
}, {
  image: IMG_L.eightDLip,
  level: "Intermediate",
  title: "8D Lip Design",
  description: "Discover a complete view of lip anatomy for deeper learning.",
  progress: 20,
  lesson: 4,
  modulesLeft: 6
}, {
  image: IMG_L.templeFiller,
  level: "Advanced",
  title: "Temple Filler",
  description: "Master safe injection techniques with anatomical precision."
}];
const LM2_HOWITWORKS = [{
  icon: "lucide:target",
  title: "Your goal",
  body: "This is the clinic and income you're building towards — not where you are today. Everything on this page is chosen to move you closer to it."
}, {
  icon: "lucide:trophy",
  title: "Progress",
  body: "A single 0–100 score for the one area we think matters most for your goal right now."
}, {
  icon: "lucide:list-checks",
  title: "Today's targets",
  body: "A short daily checklist of small actions. Tick them off as you go — they're picked to build momentum on your goal."
}, {
  icon: "lucide:route",
  title: "Next best courses",
  body: "Your courses in the order that gets you to your goal fastest, not just the order you enrolled in them."
}, {
  icon: "lucide:sparkles",
  title: "Ava",
  body: "Your AI coach. Ask her anything about your goal, your targets, or what to do next — she knows your progress."
}];
const LM_TABS = [{
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
  label: "Ava",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}, {
  key: "Rewards",
  label: "Rewards",
  icon: "lucide:gift",
  href: "RewardsDashboard.html"
}];

/* Time-of-day greeting in the member's own time zone: sun before noon,
   sun-and-clouds until 6pm, moon after. PFLearnShared.useGreeting re-checks
   every minute and when the app comes back to the foreground, so a page left
   open through noon flips from morning to afternoon by itself. */
function LM2Header({
  freeTier,
  tier
}) {
  const greet = PFLS_L.useGreeting();
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-head" + (freeTier ? " has-sub" : ""),
    "data-screen-label": "Header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-head-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-head-greet",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: greet.icon,
    size: 22,
    color: "#CE9957"
  }), greet.text, ", Katy!"), freeTier ? /*#__PURE__*/React.createElement("img", {
    className: "lm2-head-avatar",
    src: "assets/avatar-katy.jpg",
    alt: "Katy"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "lm2-tierpill"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:crown",
    size: 12,
    color: "#fff"
  }), " ", LM_TIER_DISPLAY_NAME[tier], " Path")), freeTier && /*#__PURE__*/React.createElement("p", {
    className: "lm2-head-sub"
  }, "Your goal is to grow in aesthetics or medical school"));
}
function LM2GoalBanner({
  data,
  onHelp
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-goalcard",
    "data-screen-label": data.title
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-goal-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-goal-icon"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:target",
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lm2-goal-title"
  }, data.title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-goal-help",
    "aria-label": "How this page works",
    onClick: onHelp
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:help-circle",
    size: 19,
    color: "rgba(255,255,255,.85)"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "lm2-goal-vision"
  }, data.vision), /*#__PURE__*/React.createElement("p", {
    className: "lm2-goal-clarifier"
  }, data.clarifier), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-coach-link lm2-goal-coach",
    "data-coach": "Help me get closer to my £80k/month clinic goal — what should I focus on next?"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:sparkles",
    size: 14,
    color: "#fff"
  }), "Discuss with Ava"));
}

/* Before / after compare — ported from learning.jsx BeforeAfterCompare. */
function LM2BeforeAfter({
  before,
  after
}) {
  const [pos, setPos] = useStateL(50);
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-ba",
    style: {
      "--ba": pos + "%"
    },
    "data-screen-label": "Before / after"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-ba-pane before"
  }, /*#__PURE__*/React.createElement("img", {
    src: before,
    alt: "Before treatment",
    draggable: "false"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm2-ba-tag"
  }, "Before")), /*#__PURE__*/React.createElement("div", {
    className: "lm2-ba-pane after"
  }, /*#__PURE__*/React.createElement("img", {
    src: after,
    alt: "After treatment",
    draggable: "false"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm2-ba-tag"
  }, "After")), /*#__PURE__*/React.createElement("span", {
    className: "lm2-ba-line",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm2-ba-handle",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:chevrons-left-right",
    size: 18,
    color: "#0C1928"
  })), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "lm2-ba-range",
    min: "8",
    max: "92",
    step: "0.5",
    value: pos,
    onChange: e => setPos(Number(e.target.value)),
    "aria-label": "Compare before and after",
    "aria-valuetext": Math.round(pos) + "% before"
  }));
}

/* Continue Learning — mirrors the desktop hero (learning.jsx ConfidenceDashboard,
   user 2026-09-16): "Continue Learning" eyebrow, the current lesson's name as
   the serif title, its intro, the module strip with the next two lessons, then
   Continue Lesson + Share Lesson (strip above the buttons — user, 2026-09-16). */
function LM2ContinueCard({
  data
}) {
  const r = data.resume;
  const heroTitle = r && r.item ? r.item.name : data.title;
  const heroDesc = r && r.item && (r.item.intro || r.item.body) || "";
  /* label (user, 2026-09-16): "Continue Lesson" from the first lesson on; "Review course" once done */
  const label = r && r.allDone ? "Review course" : "Continue Lesson";
  const shareHref = r && r.item ? PFLS_L.mobileLessonUrl("CourseDetail.html", r.course, r.item, {
    share: 1
  }) : "CourseDetail.html?share=1";
  const rowAt = l => ({
    key: l.name,
    name: l.name,
    dur: l.dur || (l.mins ? l.mins + " min" : ""),
    href: PFLS_L.mobileLessonUrl("CourseDetail.html", r.course, l)
  });
  const rows = !r || r.allDone ? [] : [rowAt(r.item)].concat(r.flat[r.idx + 1] ? [rowAt(r.flat[r.idx + 1])] : []);
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-hero",
    "data-screen-label": "Continue Learning"
  }, /*#__PURE__*/React.createElement("article", {
    className: "lm2-hero2"
  }, /*#__PURE__*/React.createElement(LM2BeforeAfter, {
    before: "assets/ba-cheek-before.jpg",
    after: "assets/ba-cheek-after.jpg"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm2-hero2-eyebrow"
  }, "Continue Learning", /*#__PURE__*/React.createElement("i", {
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "lm2-hero2-title"
  }, heroTitle), heroDesc && /*#__PURE__*/React.createElement("p", {
    className: "lm2-hero2-desc"
  }, heroDesc), /*#__PURE__*/React.createElement("nav", {
    className: "lm2-modstrip",
    "aria-label": "Current module and next lessons"
  }, rows.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "lm2-modstrip-empty"
  }, "Course complete — ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-modstrip-link",
    onClick: () => goL(data.href)
  }, "review course")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "lm2-modstrip-mod"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:layers",
    size: 15,
    color: "#8A5303"
  }), r.moduleLabel), /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:chevron-right",
    size: 16,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm2-modstrip-count"
  }, rows.length === 1 ? "1 lesson next" : rows.length + " lessons next"), /*#__PURE__*/React.createElement("ol", {
    className: "lm2-modstrip-list"
  }, rows.map((row, i) => /*#__PURE__*/React.createElement("li", {
    key: row.key
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-modstrip-lesson" + (i === 0 ? " on" : ""),
    onClick: () => goL(row.href),
    "aria-current": i === 0 ? "step" : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, row.name), row.dur && /*#__PURE__*/React.createElement("span", {
    className: "d"
  }, row.dur))))))), /*#__PURE__*/React.createElement("div", {
    className: "lm2-hero2-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-cta",
    onClick: () => goL(data.href),
    "aria-label": label + " — open course page"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:play",
    size: 16,
    color: "#fff"
  }), label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-hero2-share",
    onClick: () => goL(shareHref),
    "aria-label": "Share the current lesson"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:share-2",
    size: 18,
    color: "currentColor"
  }), "Share Lesson"))));
}
function SecHead({
  title,
  viewAll = true,
  linkLabel = "See All",
  onLink
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title), viewAll && /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onLink ? onLink() : goL("MyLearning.html");
    }
  }, linkLabel));
}
function LM2CourseTabs({
  tab,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-coursetabs"
  }, /*#__PURE__*/React.createElement(DSL.Tabs, {
    tabs: LM2_TABS,
    active: tab,
    onChange: onChange,
    style: {
      gap: 22,
      borderBottom: "none"
    }
  }));
}
function LM2SearchBar() {
  return /*#__PURE__*/React.createElement("label", {
    className: "lm2-search"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:search",
    size: 18,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search course…",
    "aria-label": "Search course"
  }));
}
function LM2SubscribeCard({
  isFree,
  nextTier,
  onSubscribe
}) {
  const nextName = LM_TIER_DISPLAY_NAME[nextTier];
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-subscribe",
    "data-screen-label": "Unlock more with " + nextName
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:sparkles",
    size: 22,
    color: "var(--premium-orange)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h3", null, "Unlock more with ", nextName), /*#__PURE__*/React.createElement("p", null, "More courses, live events & community perks.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-subscribe-btn",
    onClick: onSubscribe
  }, isFree ? "Subscribe" : "Upgrade", /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-up-right",
    size: 15,
    color: "#fff"
  })));
}
function LM2LockedCard({
  title,
  body,
  onUpgrade
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-locked"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:lock",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, body), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-upgrade-btn",
    onClick: onUpgrade
  }, "Upgrade", /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-up-right",
    size: 16,
    color: "#fff"
  })));
}

/* Card CTA (user, 2026-09-11): in progress → filled "Continue · n%" to the
   resume point; completed → "View Certificate"; otherwise "Start Now". */
function courseCtaL(c) {
  if (c.completed) return {
    label: "View Certificate",
    fill: false,
    go: () => goL("CourseDetail.html?" + new URLSearchParams({
      title: c.title,
      instr: "Dr. Tim Pearce",
      pct: 100
    }).toString())
  };
  if (typeof c.progress === "number") return {
    label: "Continue · " + c.progress + "%",
    fill: true,
    go: () => goL(resumeUrlL(c))
  };
  return {
    label: "Start learning",
    fill: false,
    go: () => goL("CourseDetail.html?" + new URLSearchParams({
      title: c.title,
      instr: "Dr. Tim Pearce",
      pct: 0
    }).toString())
  };
}

/* ---------------------------------------------------------------- My Courses cards -- */
/* Ported from the desktop My Learning redesign (learning.jsx MyCourseCard,
   user 2026-09-16): 16:9 cover with level badge, status pill and play /
   award mark, uppercase eyebrow, serif title, two-line blurb, thin gold
   progress bar and a tutor / CTA footer. One card covers not-started,
   in-progress and completed courses; the first in-progress card is featured. */
const TUTOR_AVATAR_L = "assets/avatar-drtim.png";
function inProgressL(c) {
  return typeof c.progress === "number" && !c.completed;
}

/* Saved (bookmarked) courses — same "pf-saved-courses" [title] key as the
   desktop My Courses page (learning-store-web.js), so a bookmark set on the
   phone shows on the web and vice versa. */
const LM2_SAVED_KEY = "pf-saved-courses";
function readSavedL() {
  try {
    const a = JSON.parse(window.localStorage.getItem(LM2_SAVED_KEY));
    return Array.isArray(a) ? a : [];
  } catch (e) {
    return [];
  }
}
function toggleSavedL(title) {
  const list = readSavedL();
  const i = list.indexOf(title);
  if (i === -1) list.push(title);else list.splice(i, 1);
  try {
    window.localStorage.setItem(LM2_SAVED_KEY, JSON.stringify(list));
  } catch (e) {}
  try {
    window.dispatchEvent(new CustomEvent(LM2_SAVED_KEY));
  } catch (e) {}
}
function useSavedL() {
  const [list, setList] = useStateL(readSavedL);
  React.useEffect(() => {
    const sync = () => setList(readSavedL());
    const onStorage = e => {
      if (!e.key || e.key === LM2_SAVED_KEY) sync();
    };
    window.addEventListener(LM2_SAVED_KEY, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LM2_SAVED_KEY, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return list;
}
function LM2SaveButton({
  title,
  saved
}) {
  const on = saved.indexOf(title) !== -1;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-mc-save" + (on ? " on" : ""),
    "aria-label": on ? "Remove from saved" : "Save course",
    "aria-pressed": on,
    onClick: e => {
      e.stopPropagation();
      toggleSavedL(title);
    }
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: on ? "lucide:bookmark-check" : "lucide:bookmark",
    size: 17,
    color: "currentColor"
  }));
}
function courseStatusL(c, featured) {
  if (c.completed) return {
    key: "done",
    eyebrow: "Completed",
    pill: c.certificate ? "Certificate earned" : "Completed"
  };
  if (inProgressL(c)) return {
    key: "live",
    eyebrow: featured ? "Continue where you left off" : "In progress \u00b7 Lesson " + (c.lesson || 1),
    pill: c.progress + "% complete"
  };
  return {
    key: "new",
    eyebrow: c.level ? c.level + " level" : "Not started",
    pill: "Not started"
  };
}
/* `saved` (optional, My Courses page only) adds the bookmark toggle on the cover. */
function LM2MyCourseCard({
  c,
  featured,
  saved
}) {
  const live = inProgressL(c);
  const st = courseStatusL(c, featured);
  const cta = courseCtaL(c);
  const label = c.completed ? "View certificate" : live ? "Resume lesson " + (c.lesson || 1) : "Start learning";
  return /*#__PURE__*/React.createElement("article", {
    className: "lm2-mc lm2-mc-" + st.key + (featured ? " lm2-mc-featured" : "") + (saved ? " lm2-mc-savable" : ""),
    role: "listitem"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-mc-cover",
    onClick: cta.go,
    "aria-label": "Open " + c.title
  }, /*#__PURE__*/React.createElement("img", {
    src: c.image,
    alt: "",
    loading: "lazy"
  }), /*#__PURE__*/React.createElement(LevelBadgeL, {
    level: c.level,
    className: "lm2-mc-lvl"
  }), c.completed ? /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-ribbon",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:award",
    size: 20,
    color: "#fff"
  })) : /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-play",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "fluent:play-16-filled",
    size: 16,
    color: "#0C1928"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-pill" + (c.completed ? " done" : "")
  }, st.pill)), saved && /*#__PURE__*/React.createElement(LM2SaveButton, {
    title: c.title,
    saved: saved
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm2-mc-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-eyebrow " + st.key
  }, st.eyebrow), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-mc-title",
    onClick: cta.go
  }, c.title), c.completed && c.certificate ? /*#__PURE__*/React.createElement("p", {
    className: "lm2-mc-blurb"
  }, "Issued ", c.certificate.issuedDate, " · ", c.certificate.id) : /*#__PURE__*/React.createElement("p", {
    className: "lm2-mc-blurb"
  }, c.description), live && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "lm2-mc-prog",
    role: "progressbar",
    "aria-valuenow": c.progress,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-label": c.title + " progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: c.progress + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-pct"
  }, c.progress, "%")), c.modulesLeft != null && /*#__PURE__*/React.createElement("p", {
    className: "lm2-mc-note"
  }, "Only ", c.modulesLeft, " more ", c.modulesLeft === 1 ? "module" : "modules", " until your certificate")), /*#__PURE__*/React.createElement("div", {
    className: "lm2-mc-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-tutor"
  }, /*#__PURE__*/React.createElement("img", {
    src: TUTOR_AVATAR_L,
    alt: ""
  }), TUTOR_L), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-mc-cta " + (c.completed ? "gold" : live ? "filled" : "ghost"),
    onClick: cta.go
  }, label, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-up-right",
    size: 14,
    color: "currentColor"
  })))));
}
function LM2ActionCard({
  icon,
  title,
  sub,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-unlock",
    "data-screen-label": title
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-unlock-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, icon && /*#__PURE__*/React.createElement(IconifyL, {
    name: icon,
    size: 15,
    color: "var(--brand-navy)",
    style: {
      marginRight: 6,
      verticalAlign: -2
    }
  }), title), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, sub)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-unlock-btn",
    "aria-label": title,
    onClick: onClick
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-right",
    size: 20,
    color: "#fff"
  })));
}

/* ---------------------------------------------------------------- explore related content -- */
/* Three topic cards under My Courses (user mock, 2026-09-11): thumb · title +
   one-line blurb · gold arrow. Each opens the course page for that topic. */
/* These are paid courses (user, 2026-09-11): the card shows the price and the
   course page gates starting behind checkout — prices match LX_PRICES in
   lesson-confidence.jsx. Once a course is bought (its slug lands in
   localStorage["pf-purchased-courses"] via CourseCheckout.html) it drops out
   of this section and the next course in the pool takes its place, so three
   unbought courses are always on offer. */
const LM2_RELATED_POOL = [{
  title: "Functional Anatomy",
  blurb: "The structures that shape the lip line.",
  image: IMG_L.eightDLip,
  price: 198
}, {
  title: "Treatment Approaches",
  blurb: "Evidence-based strategies for natural outcomes.",
  image: IMG_L.consultation,
  price: 246
}, {
  title: "Safety & Injection Essentials",
  blurb: "Protect your patients. Protect your practice.",
  image: IMG_L.complications,
  price: 294
}, {
  title: "Cheek Contouring",
  blurb: "Restore midface volume with balanced, natural lift.",
  image: IMG_L.cheekContouring,
  price: 246
}, {
  title: "Jawline Sculpting",
  blurb: "Define and strengthen the lower face with precision.",
  image: IMG_L.jawlineSculpting,
  price: 294
}, {
  title: "Tear Trough Treatment",
  blurb: "Refresh tired eyes safely in a delicate area.",
  image: IMG_L.tearTrough,
  price: 342
}];
const LM2_RELATED_VISIBLE = 3;
const LM2_PURCHASED_KEY = "pf-purchased-courses";
function slugL(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function readPurchasedL() {
  try {
    const arr = JSON.parse(window.localStorage.getItem(LM2_PURCHASED_KEY));
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

/* Read on mount; re-read on cross-tab storage events and whenever the page
   regains focus (returning from checkout in the same tab). */
function usePurchasedL() {
  const [list, setList] = useStateL(readPurchasedL);
  React.useEffect(() => {
    const refresh = () => setList(readPurchasedL());
    const onStorage = e => {
      if (!e.key || e.key === LM2_PURCHASED_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return list;
}
function LM2RelatedContent() {
  const purchased = usePurchasedL();
  /* shared pool + PRICES: bought courses drop out, the next one back-fills */
  const related = PFLS_L.pickRelated({
    purchased,
    tier: LM_TIER,
    n: LM2_RELATED_VISIBLE
  });
  if (!related.length) return null;
  const open = r => goL("CourseDetail.html?" + new URLSearchParams({
    title: r.title,
    instr: "Dr. Tim Pearce",
    pct: 0,
    price: r.price,
    dur: r.dur
  }).toString());
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-related",
    "data-screen-label": "Explore related content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-related-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-related-eyebrow"
  }, "Recommended for you"), /*#__PURE__*/React.createElement("h2", {
    className: "lm2-related-h"
  }, "Explore related content"), /*#__PURE__*/React.createElement("p", {
    className: "lm2-related-sub"
  }, "Paid courses hand-picked to build on 8D Lip Design.")), /*#__PURE__*/React.createElement("div", {
    className: "lm2-related-rail",
    role: "list"
  }, related.map((r, i) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-relcard" + (i === 0 ? " lm2-relcard-first" : ""),
    key: r.slug,
    role: "listitem",
    onClick: () => open(r),
    "aria-label": r.title + (r.price ? ", £" + r.price : ", included") + ", " + r.lessons + " lessons"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-cover"
  }, /*#__PURE__*/React.createElement("img", {
    src: r.image,
    alt: "",
    loading: "lazy"
  }), /*#__PURE__*/React.createElement(LevelBadgeL, {
    level: r.level,
    className: "lm2-relcard-lvl"
  }), r.price > 0 && /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-lock",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:lock",
    size: 12,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-chip"
  }, r.lessons, " lessons · ", r.dur)), /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-eyebrow"
  }, r.level, " · Paid course"), /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-title"
  }, r.title), /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-blurb"
  }, r.blurb), /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-foot"
  }, r.price > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-price"
  }, /*#__PURE__*/React.createElement("b", null, "£", r.price), /*#__PURE__*/React.createElement("small", null, "one-time")) : /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-incl"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:crown",
    size: 12,
    color: "#8A5303"
  }), "Included in ", LM_TIER_DISPLAY_NAME[LM_TIER] || "your membership"), /*#__PURE__*/React.createElement("span", {
    className: "lm2-relcard-go",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-right",
    size: 18,
    color: "#0C1928"
  }))))))));
}
function LM2FreeResources({
  unlocked,
  onStartSurvey
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-freeres",
    "data-screen-label": "Free Resources"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "Free Resources",
    linkLabel: "View All",
    viewAll: unlocked,
    onLink: () => goL("AllCoursesMobile.html?free=1")
  }), unlocked ? /*#__PURE__*/React.createElement("div", {
    className: "lm2-freeres-open"
  }, /*#__PURE__*/React.createElement("p", null, "Your free resources are unlocked — guides, checklists and vein maps tailored to your clinic goals."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-outline-btn",
    onClick: () => goL("AllCoursesMobile.html?free=1")
  }, "View free resources", /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-up-right",
    size: 16,
    color: "var(--brand-navy)"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "lm2-actions"
  }, /*#__PURE__*/React.createElement(LM2ActionCard, {
    icon: "lucide:lock",
    title: "Free Resources",
    sub: "Complete a quick survey to unlock free resources tailored to your clinic goals",
    onClick: onStartSurvey
  })));
}
function LM2LearningPathCard() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-pathsec",
    "data-screen-label": "Discover your journey"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-pathcard",
    onClick: () => goL("AllCoursesMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:route",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, "Discover your journey"), /*#__PURE__*/React.createElement("span", {
    className: "body"
  }, "We sequence your next-best courses from Recommended, New & Popular — one clear step at a time toward your goal.")), /*#__PURE__*/React.createElement("span", {
    className: "arrow",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-right",
    size: 19,
    color: "#fff"
  }))));
}
function LM2HelpSheet({
  open,
  onClose
}) {
  const closeRef = React.useRef(null);
  const lastFocused = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current && closeRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      if (lastFocused.current && lastFocused.current.focus) {
        try {
          lastFocused.current.focus();
        } catch (e) {}
      }
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-help-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-help-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm2-help-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "How this page works"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-help-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("header", {
    className: "lm2-help-head"
  }, /*#__PURE__*/React.createElement("h2", null, "How this page works"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    ref: closeRef,
    className: "lm2-help-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-700)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lm2-help-body"
  }, LM2_HOWITWORKS.map((h, i) => /*#__PURE__*/React.createElement("div", {
    className: "lm2-help-item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: h.icon,
    size: 17,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, h.title), /*#__PURE__*/React.createElement("p", null, h.body))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-help-gotit",
    onClick: onClose
  }, "Got it")));
}
const LMTabBar = React.forwardRef(function LMTabBar({
  compact
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "lm-tabs" + (compact ? " lm-tabs-compact" : ""),
    "aria-label": "Primary"
  }, LM_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "lm-tab" + (t.key === "Learning" ? " on" : ""),
    "aria-current": t.key === "Learning" ? "page" : undefined,
    onClick: () => t.href && goL(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: t.icon,
    size: 24,
    color: t.key === "Learning" ? "#fff" : "#000"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
});
function useScrollChromeL(scrollRef) {
  const [state, setState] = useStateL({
    hidden: false,
    floating: false
  });
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY;
      setState(prev => {
        let hidden = prev.hidden;
        if (y < 40) hidden = false;else if (delta > 6) hidden = true;else if (delta < -6) hidden = false;
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
function lmReadResourcesUnlockedL() {
  try {
    return localStorage.getItem("pf-resources-unlocked") === "1";
  } catch (e) {
    return false;
  }
}
function LearningHome() {
  const [surveyOpen, setSurveyOpen] = useStateL(false);
  const [helpOpen, setHelpOpen] = useStateL(false);
  const [resourcesUnlocked, setResourcesUnlocked] = useStateL(lmReadResourcesUnlockedL);
  const [tab, setTab] = useStateL("All Courses");
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useScrollChromeL(scrollRef);
  const nextTier = lmNextTierL(LM_TIER);
  const done = PFLS_L.useLessonsDone();
  const myCourses = withLiveProgressL(LM_TIER === "confidence" ? LM2_MY_COURSES_CONFIDENCE : LM2_MY_COURSES, done);
  const continueData = continueDataL(done);
  const visibleCourses = myCourses.filter(LM2_COURSE_TAB_FILTERS[tab] || (() => true));
  const showContinue = !LM_FREE && (tab === "All Courses" || tab === "In Progress");
  /* My Courses rail (user, 2026-09-16, ported from desktop): the first
     in-progress course leads and is the featured card; All Courses shows
     six and the rest sit behind "View all", which opens the mobile My Courses
     page (MyCoursesMobile.html) — not the desktop MyLearning.html. */
  const leadTabL = tab !== "Completed";
  const leadIdxL = leadTabL ? visibleCourses.findIndex(inProgressL) : -1;
  const orderedCoursesL = leadIdxL > 0 ? [visibleCourses[leadIdxL]].concat(visibleCourses.filter((_, j) => j !== leadIdxL)) : visibleCourses;
  const shownCoursesL = tab === "All Courses" ? orderedCoursesL.slice(0, 6) : orderedCoursesL;
  const hiddenCountL = orderedCoursesL.length - shownCoursesL.length;
  const inProgressNL = myCourses.filter(inProgressL).length;
  const certNL = myCourses.filter(c => c.completed).length;
  const mcSummaryL = [myCourses.length + (myCourses.length === 1 ? " course" : " courses"), inProgressNL ? inProgressNL + " in progress" : null, certNL ? certNL + (certNL === 1 ? " certificate" : " certificates") : null].filter(Boolean).join(" \u00b7 ");
  const unlockResources = () => {
    setResourcesUnlocked(true);
    try {
      localStorage.setItem("pf-resources-unlocked", "1");
    } catch (e) {}
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "My Learning (mobile)"
  }, /*#__PURE__*/React.createElement(MobileChromeC, null), /*#__PURE__*/React.createElement("div", {
    className: "lm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement(LM2Header, {
    freeTier: LM_FREE,
    tier: LM_TIER
  }), /*#__PURE__*/React.createElement(LM2GoalBanner, {
    data: LM2_GOAL,
    onHelp: () => setHelpOpen(true)
  }), /*#__PURE__*/React.createElement(LM2SearchBar, null), showContinue && /*#__PURE__*/React.createElement(LM2ContinueCard, {
    data: continueData
  }), /*#__PURE__*/React.createElement("section", {
    className: "lm2-courseband" + (LM_FREE ? "" : " lm2-mc-band"),
    "data-screen-label": "My Courses"
  }, LM_FREE ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SecHead, {
    title: "My Courses"
  }), /*#__PURE__*/React.createElement(LM2LockedCard, {
    title: "Unlock My Courses",
    body: "Upgrade to purchase courses and they'll live here for easy access.",
    onUpgrade: () => goL("MembershipTier.html")
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "lm2-mc-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-mc-head-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-kicker"
  }, "Your library"), /*#__PURE__*/React.createElement("h2", {
    className: "lm2-mc-h"
  }, "My Courses"), /*#__PURE__*/React.createElement("p", {
    className: "lm2-mc-sub"
  }, mcSummaryL)), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "lm2-mc-viewall",
    onClick: e => {
      e.preventDefault();
      goL(LM2_MY_COURSES_URL);
    }
  }, "View all", /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-right",
    size: 14,
    color: "currentColor"
  }))), shownCoursesL.length ? /*#__PURE__*/React.createElement("div", {
    className: "lm2-mc-rail",
    role: "list"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-coursegrid-pad",
    "aria-hidden": "true"
  }), shownCoursesL.map((c, i) => /*#__PURE__*/React.createElement(LM2MyCourseCard, {
    key: c.slug || c.title,
    c: c,
    featured: leadTabL && i === 0 && inProgressL(c)
  })), hiddenCountL > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-mc-more",
    role: "listitem",
    onClick: () => goL(LM2_MY_COURSES_URL)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:library",
    size: 22,
    color: "#8A5303"
  })), /*#__PURE__*/React.createElement("b", null, "View all ", orderedCoursesL.length, " courses"), /*#__PURE__*/React.createElement("span", null, hiddenCountL, " more in your library")), /*#__PURE__*/React.createElement("span", {
    className: "lm2-coursegrid-pad",
    "aria-hidden": "true"
  })) : /*#__PURE__*/React.createElement("div", {
    className: "lm2-mc-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: tab === "Completed" ? "lucide:award" : "lucide:play-circle",
    size: 22,
    color: "#8A5303"
  })), /*#__PURE__*/React.createElement("p", null, tab === "In Progress" ? "No courses in progress yet." : "Complete a course to earn your first certificate.")))), !LM_FREE && /*#__PURE__*/React.createElement(LM2RelatedContent, null), /*#__PURE__*/React.createElement(LM2FreeResources, {
    unlocked: resourcesUnlocked,
    onStartSurvey: () => setSurveyOpen(true)
  }), !LM_FREE && /*#__PURE__*/React.createElement(LM2LearningPathCard, null), nextTier && /*#__PURE__*/React.createElement(LM2SubscribeCard, {
    isFree: LM_FREE,
    nextTier: nextTier,
    onSubscribe: () => goL("MembershipTier.html")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  })), /*#__PURE__*/React.createElement(LMTabBar, {
    compact: chromeHidden
  }), /*#__PURE__*/React.createElement(SurveyMobile, {
    open: surveyOpen,
    onClose: () => setSurveyOpen(false),
    onComplete: unlockResources
  }), /*#__PURE__*/React.createElement(LM2HelpSheet, {
    open: helpOpen,
    onClose: () => setHelpOpen(false)
  }));
}

/* ================================================================ My Courses (mobile) -- */
/* MyCoursesMobile.html — reached from "View all" on the My Courses rail
   (user, 2026-09-16: the link used to open the desktop MyLearning.html).
   Same bundle as the home page, mounted when window.PF_LM_PAGE === "mycourses":
   search + All / In Progress / Completed / Saved chips over a full-width
   stack of the same LM2MyCourseCard cards, tier-scoped like the rail. */
const LM2_MCP_EMPTY = {
  "In Progress": "No courses in progress yet.",
  "Completed": "Complete a course to earn your first certificate.",
  "Saved": "Tap the bookmark on a course to keep it here."
};
const LM2_MCP_EMPTY_ICON = {
  "In Progress": "lucide:play-circle",
  "Completed": "lucide:award",
  "Saved": "lucide:bookmark"
};
function lmReturnUrlL() {
  try {
    const ret = new URLSearchParams(window.location.search).get("ret");
    if (ret && /^[A-Za-z0-9_-]+\.html(\?.*)?$/.test(ret)) return ret;
  } catch (e) {}
  return "LearningMobile.html";
}
function MyCoursesHome() {
  const [query, setQuery] = useStateL("");
  const [tab, setTab] = useStateL("All Courses");
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useScrollChromeL(scrollRef);
  const done = PFLS_L.useLessonsDone();
  const saved = useSavedL();
  const myCourses = withLiveProgressL(LM_TIER === "confidence" ? LM2_MY_COURSES_CONFIDENCE : LM2_MY_COURSES, done);
  const q = query.trim().toLowerCase();
  const filters = {
    "In Progress": inProgressL,
    "Completed": c => !!c.completed,
    "Saved": c => saved.indexOf(c.title) !== -1
  };
  const courses = myCourses.filter(filters[tab] || (() => true)).filter(c => !q || c.title.toLowerCase().indexOf(q) !== -1 || (c.description || "").toLowerCase().indexOf(q) !== -1);
  /* the first in-progress course leads and is featured (All / In Progress, no search) — same as the rail */
  const leadTab = !q && (tab === "All Courses" || tab === "In Progress");
  const leadIdx = leadTab ? courses.findIndex(inProgressL) : -1;
  const ordered = leadIdx > 0 ? [courses[leadIdx]].concat(courses.filter((_, j) => j !== leadIdx)) : courses;
  const inProgressN = myCourses.filter(inProgressL).length;
  const certN = myCourses.filter(c => c.completed).length;
  const savedN = saved.filter(t => myCourses.some(c => c.title === t)).length;
  const summary = [myCourses.length + (myCourses.length === 1 ? " course" : " courses"), inProgressN ? inProgressN + " in progress" : null, certN ? certN + (certN === 1 ? " certificate" : " certificates") : null].filter(Boolean).join(" · ");
  const backUrl = lmReturnUrlL();
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-screen lm2-mcp-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "My Courses (mobile)"
  }, /*#__PURE__*/React.createElement(MobileChromeC, null), /*#__PURE__*/React.createElement("div", {
    className: "lm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-mcp-back",
    onClick: () => goL(backUrl)
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:chevron-left",
    size: 20,
    color: "currentColor"
  }), "My Learning"), /*#__PURE__*/React.createElement("header", {
    className: "lm2-mcp-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm2-mc-kicker"
  }, "Your library"), /*#__PURE__*/React.createElement("h1", {
    className: "lm2-mcp-h"
  }, "My Courses"), /*#__PURE__*/React.createElement("p", {
    className: "lm2-mc-sub"
  }, LM_FREE ? "Every course you start, save or complete — all in one place." : summary)), LM_FREE ? /*#__PURE__*/React.createElement("section", {
    className: "lm2-courseband lm2-mc-band",
    "data-screen-label": "My Courses locked"
  }, /*#__PURE__*/React.createElement(LM2LockedCard, {
    title: "Unlock My Courses",
    body: "Upgrade to purchase courses and they'll live here for easy access.",
    onUpgrade: () => goL("MembershipTier.html")
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    className: "lm2-search lm2-mcp-search"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:search",
    size: 18,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search your courses…",
    "aria-label": "Search your courses",
    value: query,
    onChange: e => setQuery(e.target.value)
  }), query && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-mcp-clear",
    "aria-label": "Clear search",
    onClick: () => setQuery("")
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:x",
    size: 16,
    color: "currentColor"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lm2-mcp-tabs",
    role: "tablist",
    "aria-label": "Filter my courses"
  }, LM2_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    type: "button",
    role: "tab",
    "aria-selected": tab === t,
    className: "lm2-mcp-tab" + (tab === t ? " on" : ""),
    onClick: () => setTab(t)
  }, t, t === "Saved" && savedN > 0 && /*#__PURE__*/React.createElement("span", {
    className: "lm2-mcp-tab-n"
  }, savedN)))), /*#__PURE__*/React.createElement("section", {
    className: "lm2-mcp-list-wrap",
    "data-screen-label": "My Courses · " + tab
  }, /*#__PURE__*/React.createElement("p", {
    className: "lm2-mcp-count",
    "aria-live": "polite"
  }, ordered.length === 0 ? "" : ordered.length === 1 ? "1 course" : ordered.length + " courses", q ? " matching “" + query.trim() + "”" : ""), ordered.length ? /*#__PURE__*/React.createElement("div", {
    className: "lm2-mcp-list",
    role: "list"
  }, ordered.map((c, i) => /*#__PURE__*/React.createElement(LM2MyCourseCard, {
    key: c.slug || c.title,
    c: c,
    saved: saved,
    featured: leadTab && i === 0 && inProgressL(c)
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "lm2-mc-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: q ? "lucide:search" : LM2_MCP_EMPTY_ICON[tab] || "lucide:book-open",
    size: 22,
    color: "#8A5303"
  })), /*#__PURE__*/React.createElement("p", null, q ? "No courses match your search." : LM2_MCP_EMPTY[tab] || "No courses here yet."), q && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-mcp-reset",
    onClick: () => setQuery("")
  }, "Clear search")))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  })), /*#__PURE__*/React.createElement(LMTabBar, {
    compact: chromeHidden
  }));
}
function useDeviceScaleL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateL(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileL() {
  const [mobile, setMobile] = useStateL(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

/* window.PF_LM_PAGE (set by the shell before this bundle) picks the screen:
   "mycourses" → MyCoursesMobile.html's My Courses list, otherwise the home. */
const LM_PAGE = window.PF_LM_PAGE === "mycourses" ? MyCoursesHome : LearningHome;
function LearningMobileApp() {
  const mobile = useIsMobileL();
  const scale = useDeviceScaleL();
  const vars = {
    "--action-primary": "#0C1928",
    "--action-primary-hover": "#081120"
  }; /* My Learning navy */
  const Page = LM_PAGE;
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "#F6F3EF"
      }
    }, /*#__PURE__*/React.createElement(Page, null));
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
  }, /*#__PURE__*/React.createElement(Page, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(LearningMobileApp, null));
