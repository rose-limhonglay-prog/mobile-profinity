/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Ported from the bound claude.ai/design source (Clinic Growth dashboard:
   stats + On Track ring, Continue Learning, Next Best Action, Clinic Growth
   Score, Today's Target, My Courses, action cards) onto the DS bundle.
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
function goL(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const TUTOR_L = "Dr Tim Pearce";
const IMG_L = {
  lip: "assets/clinic-lip-design.png"
};
const LM2_STATS = [{
  icon: "lucide:banknote",
  text: "£80k/month"
}, {
  icon: "lucide:image",
  text: "Boutique Lips & Skin Clinic"
}, {
  icon: "lucide:users",
  text: "Team of 3"
}];
const LM2_TRACK_PCT = 52;
const LM2_CONTINUE = {
  image: IMG_L.lip,
  level: "Intermediate",
  title: "8D Lip Design",
  progress: 20,
  note: "Only 6 more modules until you get your certificate",
  cta: "Resume Lesson 4",
  href: "Lesson.html"
};
const LM2_NEXT_ACTION = {
  image: IMG_L.lip,
  level: "Intermediate",
  title: "Marketing",
  progress: 52,
  note: "Complete 3 lessons to reach 70%",
  cta: "Work on your goal",
  href: "CourseDetail.html"
};
const LM2_REASONING = "Based on your goal of building an £80k/month boutique clinic, and because Marketing is currently your weakest growth area, today's lesson has been selected to improve patient acquisition.";
const LM2_GROWTH = [{
  key: "Marketing",
  pct: 52
}, {
  key: "Clinical",
  pct: 85
}, {
  key: "Business",
  pct: 64
}, {
  key: "Patient Care",
  pct: 78
}];
const LM2_TARGETS = ["Complete Lesson 4: Lip Anatomy", "Watch: Patient Consultation Tips", "Quiz: Safety Protocols"];
const LM2_MY_COURSES = [{
  image: IMG_L.lip,
  level: "Intermediate",
  title: "8D Lip Design",
  description: "Discover a complete view of lip anatomy for deeper learning.",
  price: "£112"
}, {
  image: IMG_L.lip,
  level: "Advanced",
  title: "Temple Filler",
  description: "Master safe injection techniques with anatomical precision.",
  price: "£89"
}];
const LM_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: "NewsfeedMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Learning",
  label: "My Learning",
  icon: "lucide:book-open",
  href: null
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Agent",
  label: "Agent",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}];
function LM2Header() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-head",
    "data-screen-label": "Header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-head-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-head-greet"
  }, "Good morning, Katy! ", /*#__PURE__*/React.createElement("span", {
    className: "lm2-sun",
    role: "img",
    "aria-label": "sun"
  }, "☀️")), /*#__PURE__*/React.createElement("span", {
    className: "lm2-tierpill"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:crown",
    size: 12,
    color: "#fff"
  }), " Confidence Path")), /*#__PURE__*/React.createElement("div", {
    className: "lm2-headcard"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "lm2-stats"
  }, LM2_STATS.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.text
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: s.icon,
    size: 17,
    color: "var(--gray-500)"
  }), s.text))), /*#__PURE__*/React.createElement("div", {
    className: "lm2-ring",
    style: {
      "--pct": LM2_TRACK_PCT
    },
    role: "img",
    "aria-label": LM2_TRACK_PCT + "% on track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, LM2_TRACK_PCT, "%"), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "On Track"))));
}
function LM2HeroCard({
  title,
  data,
  reasoning
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-hero",
    "data-screen-label": title
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title)), reasoning && /*#__PURE__*/React.createElement("p", {
    className: "lm2-reasoning"
  }, reasoning), /*#__PURE__*/React.createElement("article", {
    className: "lm2-herocard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + data.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadgeL, {
    level: data.level,
    className: "lvl"
  })), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, data.title), /*#__PURE__*/React.createElement("div", {
    className: "lm2-progrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: data.progress + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "pct"
  }, data.progress, "% Complete")), /*#__PURE__*/React.createElement("p", {
    className: "note"
  }, data.note), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-cta",
    onClick: () => goL(data.href)
  }, data.cta, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-up-right",
    size: 17,
    color: "#fff"
  })))));
}
function LM2GrowthCard() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-card",
    "data-screen-label": "Clinic Growth Score"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-card-hd"
  }, /*#__PURE__*/React.createElement("h2", null, "Clinic Growth Score"), /*#__PURE__*/React.createElement("span", {
    className: "lm2-chip"
  }, "+6 this month")), /*#__PURE__*/React.createElement("div", {
    className: "lm2-growth-rows"
  }, LM2_GROWTH.map(g => /*#__PURE__*/React.createElement("button", {
    key: g.key,
    type: "button",
    className: "lm2-growth-row",
    onClick: () => goL("MyLearning.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, g.key), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, g.pct, "%"), /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: g.pct + "%"
    }
  }))))));
}
function LM2TargetsCard() {
  const [done, setDone] = useStateL(LM2_TARGETS.map(() => false));
  const toggle = i => setDone(s => s.map((v, j) => j === i ? !v : v));
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-card",
    "data-screen-label": "Today's Target"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-card-hd"
  }, /*#__PURE__*/React.createElement("h2", null, "Today's Target")), /*#__PURE__*/React.createElement("div", {
    className: "lm2-target-rows"
  }, LM2_TARGETS.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "lm2-target-row" + (done[i] ? " done" : ""),
    onClick: () => toggle(i),
    role: "checkbox",
    "aria-checked": done[i]
  }, /*#__PURE__*/React.createElement("span", {
    className: "circle"
  }, done[i] && /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:check",
    size: 12,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, t)))), /*#__PURE__*/React.createElement("p", {
    className: "lm2-target-note"
  }, "Completing these will increase your Clinical score"));
}
function SecHead({
  title,
  viewAll = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title), viewAll && /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goL("MyLearning.html");
    }
  }, "See All"));
}
function LM2CourseCard({
  c
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "lm2-coursecard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + c.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadgeL, {
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
  }, TUTOR_L), /*#__PURE__*/React.createElement("div", {
    className: "foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "price"
  }, c.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-ghost",
    onClick: () => goL("CourseDetail.html")
  }, "Learn More"))));
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
const LMTabBar = React.forwardRef(function LMTabBar(_props, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "lm-tabs",
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
  }, t.dot)), t.label)));
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
function LearningHome() {
  const [surveyOpen, setSurveyOpen] = useStateL(false);
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useScrollChromeL(scrollRef);
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "My Learning (mobile)"
  }, /*#__PURE__*/React.createElement(MobileChromeC, null), /*#__PURE__*/React.createElement("div", {
    className: "lm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement(LM2Header, null), /*#__PURE__*/React.createElement(LM2HeroCard, {
    title: "Continue Learning",
    data: LM2_CONTINUE
  }), /*#__PURE__*/React.createElement(LM2HeroCard, {
    title: "Next Best Action",
    data: LM2_NEXT_ACTION,
    reasoning: LM2_REASONING
  }), /*#__PURE__*/React.createElement(LM2GrowthCard, null), /*#__PURE__*/React.createElement(LM2TargetsCard, null), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "My Courses"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "My Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm2-coursegrid"
  }, LM2_MY_COURSES.map((c, i) => /*#__PURE__*/React.createElement(LM2CourseCard, {
    key: i,
    c: c
  })))), /*#__PURE__*/React.createElement("div", {
    className: "lm2-actions"
  }, /*#__PURE__*/React.createElement(LM2ActionCard, {
    icon: "lucide:lock",
    title: "Free Resources",
    sub: "Complete a quick survey to unlock free resources tailored to your clinic goals",
    onClick: () => setSurveyOpen(true)
  }), /*#__PURE__*/React.createElement(LM2ActionCard, {
    title: "Your Success Path",
    sub: "A personalised learning journey designed to help you reach your £80k/month clinic goal",
    onClick: () => goL("MyLearning.html")
  }), /*#__PURE__*/React.createElement(LM2ActionCard, {
    title: "Browse All Courses",
    sub: "Recommended, New & Popular courses",
    onClick: () => goL("MyLearning.html")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  })), /*#__PURE__*/React.createElement(LMTabBar, null), /*#__PURE__*/React.createElement(SurveyMobile, {
    open: surveyOpen,
    onClose: () => setSurveyOpen(false),
    onComplete: () => setSurveyOpen(false)
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
function LearningMobileApp() {
  const mobile = useIsMobileL();
  const scale = useDeviceScaleL();
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
    }, /*#__PURE__*/React.createElement(LearningHome, null));
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
  }, /*#__PURE__*/React.createElement(LearningHome, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(LearningMobileApp, null));