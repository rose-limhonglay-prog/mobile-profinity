/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -L to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateL,
  useEffect: useEffectL
} = React;
const DSL = window.ProfinityDesignSystem_c2b5cc;
const MobileChromeC = window.MobileChromeC;
const SurveyMobile = window.SurveyMobile;
function goL(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const LM_MINE = [{
  title: "Advanced Lip Techniques",
  dur: "4h 12m",
  rating: "4.8",
  reviews: "1,240",
  instr: "Dr. Tim Pearce",
  pct: 68,
  grad: "linear-gradient(140deg,#6172f3 0%,#3b82f6 100%)"
}, {
  title: "Temple Filler",
  dur: "2h 45m",
  rating: "4.7",
  reviews: "820",
  instr: "Dr. Tim Pearce",
  pct: 45,
  grad: "linear-gradient(140deg,#f59e0b 0%,#f0617a 100%)"
}];
const LM_REC = [{
  title: "Toxin Battle with Julie Bass Kaplan",
  slug: "toxin-battle",
  cat: "Masterclass",
  rating: "4.9",
  price: "REPLAY",
  enrolled: "2h 36m replay",
  grad: "linear-gradient(150deg,#1a1550 0%,#292569 45%,#7c2d3f 100%)"
}, {
  title: "Facial Anatomy for Artists",
  cat: "Design",
  rating: "4.9",
  price: "£ 129",
  enrolled: "12.4k enrolled",
  grad: "linear-gradient(140deg,#0fb6a3 0%,#28d3a0 100%)"
}, {
  title: "Marketing Strategy Foundations",
  cat: "Business",
  rating: "4.8",
  price: "£ 99",
  enrolled: "8.1k enrolled",
  grad: "linear-gradient(140deg,#a855f7 0%,#d946ef 100%)"
}];
const LM_FREE = [{
  title: "13 Risky Injection Areas",
  dur: "1h 20m",
  instr: "Dr. Tim Pearce",
  grad: "linear-gradient(140deg,#0fb6a3 0%,#28d3a0 100%)"
}, {
  title: "Bruising Checklist",
  dur: "45m",
  instr: "Dr. Tim Pearce",
  grad: "linear-gradient(140deg,#f59e0b 0%,#f0617a 100%)"
}];
function lmCourseUrl(c) {
  if (c.slug) return "CourseDetail.html?course=" + c.slug;
  const p = new URLSearchParams({
    title: c.title,
    instr: c.instr || "Dr. Tim Pearce",
    dur: c.dur || "45m",
    grad: c.grad || "",
    pct: c.pct || 0
  });
  return "CourseDetail.html?" + p.toString();
}
function lmPriceValue(price) {
  const n = parseInt(String(price || "").replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}
function lmCheckoutUrl(c) {
  const p = new URLSearchParams({
    title: c.title,
    instr: c.instr || "Dr. Tim Pearce",
    grad: c.grad || "",
    price: lmPriceValue(c.price)
  });
  if (c.slug) p.set("course", c.slug);
  return "CourseCheckout.html?" + p.toString();
}
function lmEnrollUrl(c) {
  return c.price === "REPLAY" ? lmCourseUrl(c) : lmCheckoutUrl(c);
}
const LM_MEMBERSHIP = [{
  icon: "lucide:graduation-cap",
  iconBg: "#E8F5E9",
  iconColor: "#2E7D32",
  label: "Foundation Courses",
  sub: "8 courses",
  href: "MyLearning.html"
}, {
  icon: "lucide:play-circle",
  iconBg: "#EDE7F6",
  iconColor: "#7B1FA2",
  label: "Live Masterclasses",
  sub: "5 replays",
  href: "CourseDetail.html?course=toxin-battle"
}, {
  icon: "lucide:file-text",
  iconBg: "#FFF3E0",
  iconColor: "#CE9957",
  label: "Protocols & Guides",
  sub: "12 files",
  href: "MyLearning.html"
}, {
  icon: "lucide:users",
  iconBg: "#E3F2FD",
  iconColor: "#1565C0",
  label: "Confidence Channel",
  sub: "Community",
  href: "MyLearning.html"
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
function useDeviceScaleL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateL(calc);
  useEffectL(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileL() {
  const [mobile, setMobile] = useStateL(() => window.matchMedia('(max-width:768px)').matches);
  useEffectL(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function useHeaderHideL(scrollRef) {
  const [hidden, setHidden] = useStateL(false);
  useEffectL(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY;
      if (y < 24) setHidden(false);else if (delta > 6) setHidden(true);else if (delta < -6) setHidden(false);
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}
function LMGreeting() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-greeting"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lm-greeting-hi"
  }, "Good morning,"), /*#__PURE__*/React.createElement("h1", {
    className: "lm-greeting-name"
  }, "Katy!")), /*#__PURE__*/React.createElement("div", {
    className: "lm-greeting-right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "lm-mysave",
    onClick: () => goL("MySaved.html?from=learning")
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:bookmark",
    size: 18,
    color: "var(--brand-navy)"
  }), "My Save")));
}
function LMSearch() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-search"
  }, /*#__PURE__*/React.createElement(DSL.Icon, {
    name: "search",
    size: 21,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search courses, topics, instructors…",
    "aria-label": "Search courses"
  }), /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:sliders-horizontal",
    size: 21,
    color: "var(--gray-500)"
  }));
}
function LMCurrent() {
  const url = lmCourseUrl({
    title: "8D Lip Design",
    instr: "Dr. Tim Pearce",
    dur: "4h 30m",
    pct: 68
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-current",
    role: "button",
    tabIndex: 0,
    onClick: () => goL(url),
    onKeyDown: e => {
      if (e.key === "Enter") goL(url);
    },
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Current course"), /*#__PURE__*/React.createElement("div", {
    className: "lm-current-row",
    style: {
      gap: "65px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ttl"
  }, "8D Lip Design"), /*#__PURE__*/React.createElement("div", {
    className: "ins"
  }, "with Dr. Tim Pearce")), /*#__PURE__*/React.createElement("button", {
    className: "lm-continue",
    onClick: e => {
      e.stopPropagation();
      goL(url);
    }
  }, "Continue", /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lm-current-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Lesson 6 of 12"), /*#__PURE__*/React.createElement("span", {
    className: "p"
  }, "68%")), /*#__PURE__*/React.createElement("div", {
    className: "lm-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "68%"
    }
  })));
}
function YourMembership({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lm-mem-section"
  }, /*#__PURE__*/React.createElement("button", {
    className: "lm-mem-simple",
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-tier"
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "fluent:crown-16-filled",
    size: 15,
    color: "#fff"
  }), "Confidence Path"), /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-simple-text"
  }, "Your Membership ", /*#__PURE__*/React.createElement("b", null, "Active")), /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })));
}
function MembershipModal({
  open,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-mem-overlay",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Your Membership",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-mem-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-mem-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-tier"
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "fluent:crown-16-filled",
    size: 15,
    color: "#fff"
  }), "Confidence Path"), /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-active"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-dot"
  }), "Active")), /*#__PURE__*/React.createElement("p", {
    className: "lm-mem-desc"
  }, "Jump straight into everything included in your plan."), /*#__PURE__*/React.createElement("div", {
    className: "lm-mem-rows"
  }, LM_MEMBERSHIP.map((item, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "lm-mem-row",
    onClick: () => goL(item.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-icon",
    style: {
      background: item.iconBg
    }
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: item.icon,
    size: 22,
    color: item.iconColor
  })), /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-label"
  }, item.label), /*#__PURE__*/React.createElement("span", {
    className: "lm-mem-sub"
  }, item.sub)), /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  }))))));
}
function MyCourses({
  loading
}) {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "lm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "My Courses"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goL("MyLearning.html");
    },
    style: {
      color: "rgb(41, 37, 105)"
    }
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, loading ? Array.from({
    length: 2
  }).map((_, i) => /*#__PURE__*/React.createElement(LMSkeletonCourse, {
    key: i
  })) : LM_MINE.map((c, i) => /*#__PURE__*/React.createElement("article", {
    className: "lm-mc",
    key: i,
    role: "button",
    tabIndex: 0,
    onClick: () => goL(lmCourseUrl(c)),
    onKeyDown: e => {
      if (e.key === "Enter") goL(lmCourseUrl(c));
    },
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-mc-img",
    style: {
      background: c.grad
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-mc-dur"
  }, c.dur)), /*#__PURE__*/React.createElement("div", {
    className: "lm-mc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-mc-ttl"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "lm-rate"
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "fluent:star-16-filled",
    size: 17,
    color: "var(--premium-gold)"
  }), c.rating, " ", /*#__PURE__*/React.createElement("span", {
    className: "rv"
  }, "(", c.reviews, ")")), /*#__PURE__*/React.createElement("div", {
    className: "ins"
  }, c.instr), /*#__PURE__*/React.createElement("div", {
    className: "lm-bar gold"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: c.pct + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "pct"
  }, c.pct, "% complete"))))));
}
function Recommended({
  loading
}) {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "lm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Recommended For You"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goL("MyLearning.html");
    },
    style: {
      color: "rgb(41, 37, 105)"
    }
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    className: "lm-rail",
    style: {
      padding: "0px 24px",
      justifyContent: "flex-start"
    }
  }, loading ? Array.from({
    length: 2
  }).map((_, i) => /*#__PURE__*/React.createElement(LMSkeletonRec, {
    key: i
  })) : LM_REC.map((c, i) => /*#__PURE__*/React.createElement("article", {
    className: "lm-rc",
    key: i,
    role: "button",
    tabIndex: 0,
    onClick: () => goL(lmCourseUrl(c)),
    onKeyDown: e => {
      if (e.key === "Enter") goL(lmCourseUrl(c));
    },
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-rc-img",
    style: {
      background: c.grad
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-rc-cat"
  }, c.cat)), /*#__PURE__*/React.createElement("div", {
    className: "lm-rc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-rc-ttl"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "lm-rc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-rate"
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "fluent:star-16-filled",
    size: 17,
    color: "var(--premium-gold)"
  }), c.rating), /*#__PURE__*/React.createElement("div", {
    className: "lm-rc-price"
  }, c.price)), /*#__PURE__*/React.createElement("div", {
    className: "lm-rc-enr"
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:users",
    size: 17,
    color: "var(--gray-450)"
  }), c.enrolled), /*#__PURE__*/React.createElement("button", {
    className: "lm-enroll",
    onClick: e => {
      e.stopPropagation();
      goL(lmEnrollUrl(c));
    }
  }, "Enroll", /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 17,
    color: "#fff"
  })))))));
}
function FreeCourses({
  onQuiz,
  unlocked
}) {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "lm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Free Courses"), /*#__PURE__*/React.createElement("a", {
    className: "muted",
    href: "#",
    onClick: e => e.preventDefault()
  }, "See all")), unlocked ? /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, LM_FREE.map((c, i) => /*#__PURE__*/React.createElement("article", {
    className: "lm-mc",
    key: i,
    role: "button",
    tabIndex: 0,
    onClick: () => goL(lmCourseUrl(c)),
    onKeyDown: e => {
      if (e.key === "Enter") goL(lmCourseUrl(c));
    },
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-mc-img",
    style: {
      background: c.grad
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-mc-dur"
  }, c.dur), /*#__PURE__*/React.createElement("span", {
    className: "lm-free-badge"
  }, "Free")), /*#__PURE__*/React.createElement("div", {
    className: "lm-mc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-mc-ttl"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "ins"
  }, c.instr), /*#__PURE__*/React.createElement("button", {
    className: "lm-enroll",
    style: {
      marginTop: 14
    },
    onClick: e => {
      e.stopPropagation();
      goL(lmCourseUrl(c));
    }
  }, "Start", /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 17,
    color: "#fff"
  })))))) : /*#__PURE__*/React.createElement("div", {
    className: "lm-free"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-free-ghosts"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-ghost a"
  }, /*#__PURE__*/React.createElement("span", {
    className: "free"
  }, "Free")), /*#__PURE__*/React.createElement("div", {
    className: "lm-ghost b"
  }, /*#__PURE__*/React.createElement("span", {
    className: "free"
  }, "Free"))), /*#__PURE__*/React.createElement("div", {
    className: "lm-unlock",
    style: {
      padding: "12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:lock",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "uc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ut",
    style: {
      fontSize: "14px",
      fontWeight: "600"
    }
  }, "Complete your profile to unlock"), /*#__PURE__*/React.createElement("div", {
    className: "us",
    style: {
      fontSize: "12px"
    }
  }, "Take a quick onboarding quiz to get free access to all courses")), /*#__PURE__*/React.createElement("button", {
    className: "lm-quiz",
    onClick: onQuiz,
    "aria-label": "Start Questionnaire",
    style: {
      width: "24px",
      height: "24px"
    }
  }, /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 20,
    color: "#fff"
  })))));
}
function LMSkeletonCourse() {
  return /*#__PURE__*/React.createElement("article", {
    className: "lm-mc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 132
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-mc-body",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 20,
      width: "85%",
      borderRadius: "var(--r-sm)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 14,
      width: "50%",
      borderRadius: "var(--r-sm)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 13,
      width: "60%",
      borderRadius: "var(--r-sm)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 8,
      width: "100%",
      borderRadius: "var(--r-pill)",
      marginTop: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 13,
      width: "40%",
      borderRadius: "var(--r-sm)"
    }
  })));
}
function LMSkeletonRec() {
  return /*#__PURE__*/React.createElement("article", {
    className: "lm-rc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 188
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-rc-body",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 20,
      width: "85%",
      borderRadius: "var(--r-sm)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 16,
      width: 60,
      borderRadius: "var(--r-sm)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 16,
      width: 60,
      borderRadius: "var(--r-sm)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 14,
      width: "60%",
      borderRadius: "var(--r-sm)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-skel",
    style: {
      height: 42,
      width: 110,
      borderRadius: "var(--r-md)",
      marginTop: 4
    }
  })));
}
const LMTabBar = React.forwardRef(function LMTabBar({
  hidden
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "lm-tabs" + (hidden ? " lm-tabs-hidden" : ""),
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
    color: t.key === "Learning" ? "var(--brand-navy)" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), t.label)));
});
function LearningHome() {
  const [loading, setLoading] = useStateL(true);
  const [surveyOpen, setSurveyOpen] = useStateL(false);
  const [membershipOpen, setMembershipOpen] = useStateL(false);
  const [coursesUnlocked, setCoursesUnlocked] = useStateL(false);
  useEffectL(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);
  const scrollRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const tabsRef = React.useRef(null);
  const [headerH, setHeaderH] = useStateL(0);
  const [tabsH, setTabsH] = useStateL(0);
  const chromeHidden = useHeaderHideL(scrollRef);
  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const measure = () => setTabsH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  function handleSurveyComplete() {
    setCoursesUnlocked(true);
    setSurveyOpen(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-screen",
    "data-screen-label": "My Learning (mobile)"
  }, /*#__PURE__*/React.createElement("div", {
    ref: headerRef,
    className: "lm-header-wrap" + (chromeHidden ? " lm-header-hidden" : "")
  }, /*#__PURE__*/React.createElement(MobileChromeC, null), /*#__PURE__*/React.createElement(LMGreeting, null), /*#__PURE__*/React.createElement(LMSearch, null)), /*#__PURE__*/React.createElement("div", {
    className: "lm-scroll",
    ref: scrollRef,
    style: {
      paddingTop: chromeHidden ? 0 : headerH,
      paddingBottom: chromeHidden ? 0 : tabsH
    }
  }, /*#__PURE__*/React.createElement(LMCurrent, null), /*#__PURE__*/React.createElement(MyCourses, {
    loading: loading
  }), /*#__PURE__*/React.createElement(YourMembership, {
    onOpen: () => setMembershipOpen(true)
  }), /*#__PURE__*/React.createElement(Recommended, {
    loading: loading
  }), /*#__PURE__*/React.createElement(FreeCourses, {
    onQuiz: () => setSurveyOpen(true),
    unlocked: coursesUnlocked
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  })), /*#__PURE__*/React.createElement(LMTabBar, {
    ref: tabsRef,
    hidden: chromeHidden
  }), /*#__PURE__*/React.createElement(SurveyMobile, {
    open: surveyOpen,
    onClose: () => setSurveyOpen(false),
    onComplete: handleSurveyComplete
  }), /*#__PURE__*/React.createElement(MembershipModal, {
    open: membershipOpen,
    onClose: () => setMembershipOpen(false)
  }));
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
