/* ===========================================================================
   PROfinity Academy — My Learning
   Composed from the bound Profinity Design System bundle. The course rows use
   the DS CourseTile / Tabs / LevelBadge / ProgressBar; bespoke rail cards
   (locked resource, price, success-path, brand intro) are built from tokens.
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
  CourseTile,
  Tabs,
  LevelBadge,
  IconifyIcon,
  Icon
} = DS;
const ME = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const TUTOR = "Dr Tim Pearce";
const IMG = {
  lip: "assets/clinic-lip-design.png",
  protox: "assets/clinic-toxin-guide.png",
  temple: "assets/clinic-treatment-collage.png",
  gold: "assets/texture-gold.png",
  logo: "assets/profinity-icon-purple-gold.png"
};
const TABS = ["All Courses", "Free Resources", "New Courses", "Recommended Courses", "Upcoming Webinars", "Certification Programs"];
const MY_COURSES = [{
  image: IMG.lip,
  level: "Beginner",
  title: "8D Lip Design",
  description: "Discover a complete view of human anatomy for deeper learning.",
  progress: 20,
  cta: "Continue learning",
  active: true,
  slug: "8d-lips"
}, {
  image: IMG.temple,
  level: "Intermediate",
  title: "Temple Filler",
  description: "Confidently Inject Temples & add YOUTH back into your patients.",
  progress: 0,
  cta: "Start learning"
}, {
  image: IMG.protox,
  level: "Advance",
  title: "Protox Course",
  description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.",
  progress: 0,
  cta: "Start learning"
}, {
  image: IMG.temple,
  level: "Advance",
  title: "Temple Filler",
  description: "Confidently Inject Temples & add YOUTH back into your patients.",
  progress: 0,
  cta: "Start learning"
}];
function goToCourse(c) {
  const url = c.slug ? `CourseWeb.html?course=${c.slug}` : `CourseWeb.html?${new URLSearchParams({
    title: c.title,
    instr: TUTOR,
    pct: c.progress || 0
  })}`;
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const RESOURCES = [{
  image: IMG.temple,
  title: "13 Risky Injection Areas",
  lines: ["Facial Vein Mapping", "Navigating Risky Zones"]
}, {
  image: IMG.protox,
  title: "Aspirating Experiment",
  lines: ["Sample Analysis", "Essential Lab Techniques"]
}, {
  image: IMG.lip,
  title: "Bruising Checklist",
  lines: ["Injection Site Prep", "Minimize Post-Injection Bruising"]
}, {
  image: IMG.temple,
  title: "Botox Lesson Hook",
  lines: ["Delve into the nuances of", "assessment & treatment"]
}];
const PATHS = [{
  image: IMG.protox,
  title: "Botox",
  description: "Discover a complete view of human anatomy for deeper learning.",
  price: "£1,998"
}, {
  image: IMG.temple,
  title: "Filler",
  description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.",
  price: "£794"
}, {
  image: IMG.lip,
  title: "Lips",
  description: "Confidently Inject Temples & add YOUTH back into your patients.",
  price: "£1,234"
}];
const NEW_COURSES = [{
  image: IMG.lip,
  level: "Intermediate",
  title: "8D Lip Design",
  description: "Discover a complete view of human anatomy for deeper learning.",
  by: TUTOR,
  price: "£112"
}, {
  image: IMG.protox,
  level: "Intermediate",
  title: "Protox Course",
  description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.",
  by: TUTOR,
  price: "£99"
}, {
  image: IMG.temple,
  level: "Intermediate",
  title: "Temple Filler",
  description: "Confidently Inject Temples & add YOUTH back into your patients.",
  by: TUTOR,
  price: "£100"
}, {
  image: IMG.temple,
  level: "Intermediate",
  title: "Brow Lift Training",
  description: "Learn expert techniques for achieving flawless brow lifts.",
  by: TUTOR,
  price: "£99"
}];

/* ---------------------------------------------------------------- pieces -- */
function SectionHead({
  title,
  pill,
  viewAll = true,
  big
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t",
    style: big ? null : null
  }, title), pill, /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), viewAll && /*#__PURE__*/React.createElement("a", {
    className: "viewall",
    tabIndex: 0
  }, "View All"));
}
function ResourceCard({
  r
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rcard w-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + r.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadge, {
    level: "Intermediate",
    className: "lvl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:lock",
    size: 20,
    color: "var(--white)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, r.title), r.lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    className: "ds",
    key: i
  }, l)), /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, TUTOR), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ghost",
    style: {
      marginTop: 14
    }
  }, "Learn More")));
}
function PriceCard({
  c
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pcard w-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + c.image + ")"
    }
  }, c.level && /*#__PURE__*/React.createElement(LevelBadge, {
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
  }, c.by), /*#__PURE__*/React.createElement("div", {
    className: "foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "price"
  }, c.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ghost"
  }, "Learn More"))));
}
function PathCard({
  c
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pcard w-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + c.image + ")"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-path"
  }, "Success Path")), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "ds"
  }, c.description), /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, TUTOR), /*#__PURE__*/React.createElement("div", {
    className: "foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "price"
  }, c.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ghost"
  }, "Learn More"))));
}
function OutroBlock({
  title,
  description,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn-outro w-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "ds"
  }, description), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn-outro-btn",
    onClick: onClick
  }, "Find out more", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 18,
    color: "var(--white)"
  })));
}
function PathIntro() {
  return /*#__PURE__*/React.createElement("div", {
    className: "intro w-intro"
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG.logo,
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "Profinity Success Paths Certificates"), /*#__PURE__*/React.createElement("div", {
    className: "ds"
  }, "Learn more about success paths, and build your journey towards achieving your goals with tailored strategies and resources."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "out"
  }, "Learn More"));
}

/* ---------------------------------------------------------------- skeletons -- */
function SkeletonCourseCard() {
  return /*#__PURE__*/React.createElement("div", {
    className: "skel-card w-course"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel",
    style: {
      height: 150
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "30%",
      height: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "80%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "90%",
      height: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel",
    style: {
      height: 8,
      width: "100%",
      borderRadius: "var(--r-pill)",
      marginTop: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-btn"
  })));
}
function SkeletonResourceCard() {
  return /*#__PURE__*/React.createElement("div", {
    className: "skel-card w-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel",
    style: {
      height: 150
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "75%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "90%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "90%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "45%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-btn"
  })));
}
function SkeletonPriceCard() {
  return /*#__PURE__*/React.createElement("div", {
    className: "skel-card w-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel",
    style: {
      height: 158
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
      width: "90%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "90%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "50%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: 64,
      height: 22
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel",
    style: {
      height: 42,
      width: 110,
      borderRadius: "var(--r-sm)"
    }
  }))));
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
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
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
  }, /*#__PURE__*/React.createElement("h1", {
    className: "welcome"
  }, "Welcome, Katy!"), /*#__PURE__*/React.createElement("p", {
    className: "welcome-sub"
  }, "Your goal is to grow in ", /*#__PURE__*/React.createElement("u", null, "aesthetics or medical school")), /*#__PURE__*/React.createElement("div", {
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
  })), /*#__PURE__*/React.createElement("section", {
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
  })) : MY_COURSES.map((c, i) => /*#__PURE__*/React.createElement(CourseTile, {
    key: i,
    ...c,
    onCta: () => goToCourse(c),
    className: "w-course",
    style: {
      width: 264
    }
  })))), /*#__PURE__*/React.createElement("section", {
    className: "sec",
    "data-screen-label": "Free Resources"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Free Resources",
    pill: /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pill navy"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bookmark",
      size: 16,
      color: "var(--white)"
    }), "Complete Survey To Unlock Resources Archive ", /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:arrow-right",
      size: 16,
      color: "var(--white)"
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, loading ? Array.from({
    length: 4
  }).map((_, i) => /*#__PURE__*/React.createElement(SkeletonResourceCard, {
    key: i
  })) : RESOURCES.map((r, i) => /*#__PURE__*/React.createElement(ResourceCard, {
    key: i,
    r: r
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sec-divider"
  })), /*#__PURE__*/React.createElement("section", {
    className: "sec",
    "data-screen-label": "Success Path"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "Success Path")), /*#__PURE__*/React.createElement("div", {
    className: "panel cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, loading ? Array.from({
    length: 4
  }).map((_, i) => /*#__PURE__*/React.createElement(SkeletonPriceCard, {
    key: i
  })) : [/*#__PURE__*/React.createElement(PathIntro, {
    key: "intro"
  }), ...PATHS.map((c, i) => /*#__PURE__*/React.createElement(PathCard, {
    key: i,
    c: c
  }))]))), /*#__PURE__*/React.createElement("section", {
    className: "sec",
    "data-screen-label": "Recommended Course"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Recommended Course",
    viewAll: false
  }), /*#__PURE__*/React.createElement(OutroBlock, {
    title: "Recommended For You",
    description: "Courses picked for your goal, hand-picked by Ava based on your Prosperity Spiral.",
    onClick: () => (window.pfGo || function (u) {
      window.location.href = u;
    })("MembershipTier.html")
  }), /*#__PURE__*/React.createElement("div", {
    className: "sec-divider"
  })), /*#__PURE__*/React.createElement("section", {
    className: "sec",
    "data-screen-label": "New Courses"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "New Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, loading ? Array.from({
    length: 4
  }).map((_, i) => /*#__PURE__*/React.createElement(SkeletonPriceCard, {
    key: i
  })) : NEW_COURSES.map((c, i) => /*#__PURE__*/React.createElement(PriceCard, {
    key: i,
    c: c
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sec-divider"
  })), /*#__PURE__*/React.createElement("section", {
    className: "sec",
    "data-screen-label": "Popular Courses"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Popular Courses",
    viewAll: false
  }), /*#__PURE__*/React.createElement(OutroBlock, {
    title: "Popular With Members",
    description: "See what the wider PROfinity community is learning right now.",
    onClick: () => (window.pfGo || function (u) {
      window.location.href = u;
    })("MembershipTier.html")
  }))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MyLearningApp, null));
