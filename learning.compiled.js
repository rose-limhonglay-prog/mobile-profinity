/* ===========================================================================
   PROfinity Academy — My Learning (web)
   Goal-first layout, mirroring the mobile My Learning redesign: welcome +
   tier pill → goal card → tabs/search → Continue Learning → My Courses rail
   → Free Resources / Discover your journey / Unlock-with-next-tier promos.
   Composed from the bound Profinity Design System bundle.
   =========================================================================== */
const {
  useState
} = React;
const {
  useEffect: useEffectL
} = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav,
  LevelBadge,
  IconifyIcon,
  Icon,
  Spark,
  Tabs
} = DS;
const ME = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const TUTOR = "Dr Tim Pearce";
const IMG = {
  lip: "assets/course-8d-lip-design.jpg",
  temple: "assets/course-temple-filler.webp",
  protox: "assets/course-protox.png",
  browLift: "assets/course-brow-lift.jpg",
  fullFace: "assets/course-full-face-rejuvenation.jpg",
  cheek: "assets/course-cheek-contouring.jpg",
  complications: "assets/course-complications.jpg",
  consultation: "assets/course-consultation.jpg"
};

/* Same "pf-subscription-tier" key the newsfeed/community/membership pages
   read and write — this page doesn't load app.jsx, so it keeps its own tiny
   copy rather than depending on window.PFApp. */
function lrnReadTier() {
  if (window.PF_TIER) return window.PF_TIER;
  try {
    return localStorage.getItem("pf-subscription-tier") || "free";
  } catch (e) {
    return "free";
  }
}
const TIER = lrnReadTier();
const FREE_TIER = TIER === "free";
const TIER_LADDER = ["confidence", "mastery", "freedom", "inner"];
const TIER_DISPLAY_NAME = {
  confidence: "Confidence",
  mastery: "Mastery",
  freedom: "Freedom",
  inner: "Inner Circle"
};
function nextTierOf(tier) {
  const i = TIER_LADDER.indexOf(tier);
  if (i === -1) return TIER_LADDER[0];
  if (i === TIER_LADDER.length - 1) return null;
  return TIER_LADDER[i + 1];
}
const NEXT_TIER = nextTierOf(TIER);
const GOAL = {
  title: "My Goal & Dream Clinic",
  vision: "Boutique clinic with lips + skin treatments, £80k/month revenue, team of 3 professionals",
  clarifier: "Where you're heading — not where you are today."
};
const CONTINUE = {
  image: IMG.lip,
  level: "Intermediate",
  title: "8D Lip Design",
  progress: 20,
  note: "Only 6 more modules until you get your certificate",
  cta: "Resume Lesson 4"
};
const TABS = ["All Courses", "In Progress", "Completed", "Certificates", "Saved"];
function course(image, level, title, description, extra) {
  const inProgress = !!(extra && extra.progress);
  return {
    image,
    level,
    title,
    description,
    inProgress,
    progress: extra && extra.progress ? extra.progress : 0,
    lesson: extra && extra.lesson,
    cta: inProgress ? "Resume Lesson " + extra.lesson : "Learn More"
  };
}
const MY_COURSES = [course(IMG.lip, "Intermediate", "8D Lip Design", "Discover a complete view of lip anatomy for deeper learning.", {
  progress: 20,
  lesson: 4
}), course(IMG.temple, "Advance", "Temple Filler", "Master safe injection techniques with anatomical precision."), course(IMG.protox, "Advance", "Protox Course", "Elevate your botulinum toxin skills and refine your technique."), course(IMG.browLift, "Intermediate", "Brow Lift Training", "Learn expert techniques for achieving flawless, natural brow lifts."), course(IMG.fullFace, "Advance", "Full-Face Rejuvenation Protocol", "A complete framework for combination treatments across the face."), course(IMG.cheek, "Intermediate", "Cheek & Midface Contouring", "Master volumising techniques for natural-looking cheek definition."), course(IMG.complications, "Advance", "Complications Management", "Recognise, prevent and manage vascular and other complications."), course(IMG.consultation, "Beginner", "Consultation & Patient Assessment", "Build trust and plan safe, effective treatments from the first visit.")];
function goToCourse(c) {
  const url = c.inProgress ? "LessonWeb.html" : `CourseWeb.html?${new URLSearchParams({
    title: c.title,
    instr: TUTOR,
    pct: c.progress || 0
  })}`;
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ---------------------------------------------------------------- pieces -- */
function TierPill({
  tier
}) {
  if (FREE_TIER) return null;
  return /*#__PURE__*/React.createElement("span", {
    className: "lrn2-tierpill"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "fluent:crown-16-filled",
    size: 16,
    color: "#fff"
  }), TIER_DISPLAY_NAME[tier], " Path");
}
function GoalCard() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lrn2-goal",
    "data-screen-label": GOAL.title
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-goal-icon"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:target",
    size: 22,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-goal-body"
  }, /*#__PURE__*/React.createElement("h2", null, GOAL.title), /*#__PURE__*/React.createElement("p", {
    className: "vision"
  }, GOAL.vision), /*#__PURE__*/React.createElement("p", {
    className: "clarifier"
  }, GOAL.clarifier)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-coach-link lrn2-goal-coach",
    "data-coach": "Help me get closer to my goal — what should I focus on next?"
  }, /*#__PURE__*/React.createElement(Spark, {
    size: 17,
    color: "#fff"
  }), "Discuss with Ava"));
}
function SectionHead({
  title,
  big
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: big ? "t big" : "t"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("a", {
    className: "viewall",
    tabIndex: 0
  }, "View All"));
}
function ContinueLearning() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lrn2-continue",
    "data-screen-label": "Continue Learning"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Continue Learning",
    big: true
  }), /*#__PURE__*/React.createElement("article", {
    className: "lrn2-continuecard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + CONTINUE.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadge, {
    level: CONTINUE.level,
    className: "lvl"
  })), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, CONTINUE.title), /*#__PURE__*/React.createElement("div", {
    className: "progrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: CONTINUE.progress + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "pct"
  }, CONTINUE.progress, "% Complete")), /*#__PURE__*/React.createElement("p", {
    className: "note"
  }, CONTINUE.note), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-resume-btn",
    onClick: () => goToCourse({
      ...MY_COURSES[0],
      inProgress: true
    })
  }, CONTINUE.cta, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 18,
    color: "#fff"
  })))));
}
function CourseCard({
  c
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "lrn2-coursecard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + c.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadge, {
    level: c.level,
    className: "lvl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "play"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "fluent:play-16-filled",
    size: 20,
    color: "var(--ai-purple)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "ds"
  }, c.description), /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, TUTOR), c.inProgress && /*#__PURE__*/React.createElement("div", {
    className: "progrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: c.progress + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "pct"
  }, c.progress, "% Complete")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: c.inProgress ? "lrn2-cta filled" : "lrn2-cta ghost",
    onClick: () => goToCourse(c)
  }, c.cta)));
}
function SkeletonCourseCard() {
  return /*#__PURE__*/React.createElement("div", {
    className: "skel-card lrn2-coursecard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel",
    style: {
      height: 168
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "70%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "90%",
      height: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "40%",
      height: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-btn"
  })));
}
function PromoFreeResources() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-promo card",
    "data-screen-label": "Free Resources"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic gold"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:folder-open",
    size: 24,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h3", null, "Free Resources"), /*#__PURE__*/React.createElement("p", null, "Guides, checklists and vein maps tailored to your clinic goals."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-outline-btn",
    onClick: () => (window.pfGo || function (u) {
      window.location.href = u;
    })("MySaved.html")
  }, "View free resources", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 17,
    color: "var(--brand-navy)"
  }))));
}
function PromoLearningPath() {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-promo navy",
    "data-screen-label": "Discover your journey",
    onClick: () => (window.pfGo || function (u) {
      window.location.href = u;
    })("AllCoursesMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:route",
    size: 24,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h3", null, "Discover your journey"), /*#__PURE__*/React.createElement("p", null, "We sequence your next-best courses — one clear step at a time toward your goal.")), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-navy-btn"
  }, "Explore learning path", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-right",
    size: 17,
    color: "var(--brand-navy)"
  })));
}
function PromoUpgrade() {
  if (!NEXT_TIER) return null;
  const nextName = TIER_DISPLAY_NAME[NEXT_TIER];
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-promo navy big",
    "data-screen-label": "Unlock more with " + nextName
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic circle"
  }, /*#__PURE__*/React.createElement(Spark, {
    size: 28,
    color: "var(--premium-orange)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h3", null, "Unlock more with ", nextName), /*#__PURE__*/React.createElement("p", null, "More courses, live events & community perks.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-upgrade-btn",
    onClick: () => (window.pfGo || function (u) {
      window.location.href = u;
    })("MembershipTier.html")
  }, FREE_TIER ? "Subscribe" : "Upgrade", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 19,
    color: "#fff"
  })));
}

/* ---------------------------------------------------------------- app ----- */
function pfTagActiveNav(activeLabel) {
  document.querySelectorAll("#pf-root nav > button").forEach(b => {
    const label = b.textContent.replace(/[0-9]/g, "").trim();
    const active = label === activeLabel;
    b.style.setProperty("-webkit-appearance", "none", "important");
    b.style.setProperty("appearance", "none", "important");
    b.style.setProperty("background", active ? "rgb(225, 223, 242)" : "none", "important");
    b.style.setProperty("transition", "background .18s ease", "important");
    const path = b.querySelector("svg path");
    if (path) path.style.setProperty("fill", active ? "currentColor" : "", "important");
  });
}
function navigate(label) {
  var u = {
    Home: "Newsfeed.html",
    Profile: "Profile.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) (window.pfGo || function (x) {
    window.location.href = x;
  })(u);
}
function MyLearningApp() {
  const [tab, setTab] = useState("All Courses");
  const [loading, setLoading] = useState(true);
  useEffectL(() => pfTagActiveNav("My Learning"));
  useEffectL(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNav, {
    active: "My Learning",
    user: ME,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigate,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "page",
    "data-screen-label": "My Learning"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "welcome"
  }, "Welcome, Katy!"), /*#__PURE__*/React.createElement("p", {
    className: "welcome-sub"
  }, "Your goal is to grow in aesthetics or medical school")), /*#__PURE__*/React.createElement(TierPill, {
    tier: TIER
  })), /*#__PURE__*/React.createElement(GoalCard, null), /*#__PURE__*/React.createElement("div", {
    className: "lrn-tabs"
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: TABS,
    active: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("label", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search course…",
    "aria-label": "Search course"
  })), !FREE_TIER && /*#__PURE__*/React.createElement(ContinueLearning, null), /*#__PURE__*/React.createElement("section", {
    className: "panel",
    "data-screen-label": "My Courses"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "My Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, loading ? Array.from({
    length: 4
  }).map((_, i) => /*#__PURE__*/React.createElement(SkeletonCourseCard, {
    key: i
  })) : MY_COURSES.map((c, i) => /*#__PURE__*/React.createElement(CourseCard, {
    key: i,
    c: c
  })))), /*#__PURE__*/React.createElement("section", {
    className: "lrn2-promos"
  }, /*#__PURE__*/React.createElement(PromoFreeResources, null), /*#__PURE__*/React.createElement(PromoLearningPath, null), /*#__PURE__*/React.createElement(PromoUpgrade, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MyLearningApp, null));
