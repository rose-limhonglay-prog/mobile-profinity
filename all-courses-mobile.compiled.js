/* ===========================================================================
   PROfinity — All Courses (mobile) · iPhone 17 Pro Max
   Full course catalog: search + Recommended/New/Popular filter pills over a
   two-column grid of every course on the platform.
   Suffixed -AC to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateAC
} = React;
const DSAC = window.ProfinityDesignSystem_c2b5cc;
const {
  LevelBadge: LevelBadgeAC,
  IconifyIcon: IconifyAC,
  Icon: IconAC
} = DSAC;
function goAC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const TUTOR_AC = "Dr Tim Pearce";
const IMG_AC = {
  eightDLip: "assets/course-8d-lip-design.jpg",
  templeFiller: "assets/course-temple-filler.webp",
  protox: "assets/course-protox.png",
  browLift: "assets/course-brow-lift.jpg",
  fullFace: "assets/course-full-face-rejuvenation.jpg",
  cheekContouring: "assets/course-cheek-contouring.jpg",
  rhinoplasty: "assets/course-rhinoplasty.jpg",
  jawlineSculpting: "assets/course-jawline-sculpting.jpg",
  tearTrough: "assets/course-tear-trough.jpg",
  skinBoosters: "assets/course-skin-boosters.jpg",
  complications: "assets/course-complications.jpg",
  consultation: "assets/course-consultation.jpg"
};
const AC_FILTERS = ["All", "Recommended", "New", "Popular"];
const AC_COURSES = [{
  image: IMG_AC.eightDLip,
  level: "Intermediate",
  title: "8D Lip Design",
  description: "Discover a complete view of lip anatomy for deeper learning.",
  tags: ["Recommended", "Popular"]
}, {
  image: IMG_AC.templeFiller,
  level: "Advanced",
  title: "Temple Filler",
  description: "Master safe injection techniques with anatomical precision.",
  tags: ["Recommended"]
}, {
  image: IMG_AC.protox,
  level: "Advanced",
  title: "Protox Course",
  description: "Elevate your botulinum toxin skills and refine your technique.",
  tags: ["Recommended", "Popular"]
}, {
  image: IMG_AC.browLift,
  level: "Intermediate",
  title: "Brow Lift Training",
  description: "Learn expert techniques for achieving flawless, natural brow lifts.",
  tags: ["New"]
}, {
  image: IMG_AC.fullFace,
  level: "Advanced",
  title: "Full-Face Rejuvenation Protocol",
  description: "A complete framework for combination treatments across the face.",
  tags: ["New", "Recommended"]
}, {
  image: IMG_AC.cheekContouring,
  level: "Intermediate",
  title: "Cheek & Midface Contouring",
  description: "Master volumising techniques for natural-looking cheek definition.",
  tags: ["Popular"]
}, {
  image: IMG_AC.rhinoplasty,
  level: "Advanced",
  title: "Non-Surgical Rhinoplasty",
  description: "Reshape and refine the nose using dermal filler with confidence.",
  tags: ["New"]
}, {
  image: IMG_AC.jawlineSculpting,
  level: "Advanced",
  title: "Jawline Sculpting Masterclass",
  description: "Define and balance the lower face with precision filler technique.",
  tags: ["New", "Popular"]
}, {
  image: IMG_AC.tearTrough,
  level: "Advanced",
  title: "Tear Trough Correction",
  description: "Safely treat under-eye hollowing with anatomically-guided technique.",
  tags: ["Popular"]
}, {
  image: IMG_AC.skinBoosters,
  level: "Beginner",
  title: "Skin Boosters & Hydration Therapy",
  description: "Introduce biorevitalisation treatments to improve skin quality.",
  tags: ["Recommended"]
}, {
  image: IMG_AC.complications,
  level: "Advanced",
  title: "Complications Management",
  description: "Recognise, prevent and manage vascular and other complications.",
  tags: ["New"]
}, {
  image: IMG_AC.consultation,
  level: "Beginner",
  title: "Consultation & Patient Assessment",
  description: "Build trust and plan safe, effective treatments from the first visit.",
  tags: ["Recommended", "Popular"]
}];
const AC_TABS = [{
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
function ACTabBar() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "lm-tabs",
    "aria-label": "Primary"
  }, AC_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "lm-tab" + (t.key === "Learning" ? " on" : ""),
    "aria-current": t.key === "Learning" ? "page" : undefined,
    onClick: () => t.href && goAC(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyAC, {
    name: t.icon,
    size: 24,
    color: t.key === "Learning" ? "#fff" : "#000"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
}
function ACCourseCard({
  c
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "lm2-coursecard ac-coursecard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + c.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadgeAC, {
    level: c.level,
    className: "lvl"
  })), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "ds"
  }, c.description), /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, TUTOR_AC), /*#__PURE__*/React.createElement("div", {
    className: "foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-ghost",
    onClick: () => goAC("CourseDetail.html")
  }, "Learn More"))));
}
function AllCoursesHome() {
  const [query, setQuery] = useStateAC("");
  const [filter, setFilter] = useStateAC("All");
  const courses = AC_COURSES.filter(c => {
    if (filter !== "All" && !c.tags.includes(filter)) return false;
    if (query.trim() && !c.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "ac-screen",
    "data-screen-label": "All Courses"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ac-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ac-back",
    "aria-label": "Back",
    onClick: () => goAC("LearningMobile.html")
  }, /*#__PURE__*/React.createElement(IconifyAC, {
    name: "lucide:arrow-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ac-title"
  }, "All Courses"), /*#__PURE__*/React.createElement("span", {
    className: "spacer",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ac-scroll"
  }, /*#__PURE__*/React.createElement("label", {
    className: "ac-search"
  }, /*#__PURE__*/React.createElement(IconAC, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search courses…",
    "aria-label": "Search courses",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "ac-filters",
    role: "tablist",
    "aria-label": "Filter courses"
  }, AC_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    type: "button",
    role: "tab",
    "aria-selected": filter === f,
    className: "ac-filter" + (filter === f ? " on" : ""),
    onClick: () => setFilter(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    className: "ac-coach-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-coach-link",
    "data-coach": "I'm looking at the course catalog — which course should I take next to grow my clinic?"
  }, /*#__PURE__*/React.createElement(IconifyAC, {
    name: "lucide:sparkles",
    size: 14,
    color: "var(--ai-purple)"
  }), "Which course should I take next?")), courses.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "ac-empty"
  }, "No courses match your search.") : /*#__PURE__*/React.createElement("div", {
    className: "ac-grid"
  }, courses.map((c, i) => /*#__PURE__*/React.createElement(ACCourseCard, {
    key: i,
    c: c
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  })), /*#__PURE__*/React.createElement(ACTabBar, null));
}
function useDeviceScaleAC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateAC(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileAC() {
  const [mobile, setMobile] = useStateAC(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function AllCoursesMobileApp() {
  const mobile = useIsMobileAC();
  const scale = useDeviceScaleAC();
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
    }, /*#__PURE__*/React.createElement(AllCoursesHome, null));
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
  }, /*#__PURE__*/React.createElement(AllCoursesHome, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AllCoursesMobileApp, null));
