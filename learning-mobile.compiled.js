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
const LM_FREE = lmReadTierL() === "free";
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
  consultation: "assets/course-consultation.jpg"
};
const LM2_GOAL = {
  title: "My Goal & Dream Clinic",
  vision: "Boutique clinic with lips + skin treatments, £80k/month revenue, team of 3 professionals",
  clarifier: "Where you're heading — not where you are today."
};
const LM2_CONTINUE = {
  image: IMG_L.lip,
  title: "8D Lip Design",
  moduleText: "Module 4 · Lesson 2 — Landmark mapping",
  progress: 62,
  total: 100,
  href: "Lesson.html"
};
const LM2_PROGRESS_SPOTLIGHT = {
  pillar: "Marketing",
  progress: 52,
  note: "You need visibility. You aren't known yet."
};
const LM2_MY_COURSES = [{
  image: IMG_L.eightDLip,
  level: "Intermediate",
  title: "8D Lip Design",
  description: "Discover a complete view of lip anatomy for deeper learning."
}, {
  image: IMG_L.templeFiller,
  level: "Advanced",
  title: "Temple Filler",
  description: "Master safe injection techniques with anatomical precision."
}, {
  image: IMG_L.protox,
  level: "Advanced",
  title: "Protox Course",
  description: "Elevate your botulinum toxin skills and refine your technique."
}, {
  image: IMG_L.browLift,
  level: "Intermediate",
  title: "Brow Lift Training",
  description: "Learn expert techniques for achieving flawless, natural brow lifts."
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
  description: "Build trust and plan safe, effective treatments from the first visit."
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
  href: null
}];
function LM2Header({
  freeTier
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-head" + (freeTier ? " has-sub" : ""),
    "data-screen-label": "Header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-head-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-head-greet"
  }, "Good morning, Katy! ", /*#__PURE__*/React.createElement("span", {
    className: "lm2-sun",
    role: "img",
    "aria-label": "sun"
  }, "☀️")), freeTier ? /*#__PURE__*/React.createElement("img", {
    className: "lm2-head-avatar",
    src: "assets/avatar-katy.jpg",
    alt: "Katy"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "lm2-tierpill"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:crown",
    size: 12,
    color: "#fff"
  }), " Confidence Path")), freeTier && /*#__PURE__*/React.createElement("p", {
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
  }, data.clarifier));
}
function LM2ProgressSpotlight({
  data
}) {
  const [saved, setSaved] = useStateL(false);
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-hero",
    "data-screen-label": "Let's work on your goal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-card lm2-progress-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-progress-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm2-progress-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:trophy",
    size: 13,
    color: "var(--brand-gold)"
  }), "Let's work on your goal"), /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, data.pillar), /*#__PURE__*/React.createElement("p", {
    className: "note"
  }, data.note), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "lm2-spiral-link",
    onClick: e => {
      e.preventDefault();
      goL("MyLearning.html");
    }
  }, "See my full Prosperity Spiral", /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-up-right",
    size: 14,
    color: "var(--ai-purple)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lm2-progress-side"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-save-btn" + (saved ? " saved" : ""),
    "aria-pressed": saved,
    "aria-label": saved ? "Remove from saved" : "Save this recommendation",
    onClick: () => setSaved(s => !s)
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: saved ? "lucide:bookmark-check" : "lucide:bookmark",
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lm2-progress-ring",
    style: {
      "--pct": data.progress
    },
    role: "img",
    "aria-label": data.progress + " progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, data.progress), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Progress"))))));
}
function LM2ContinueCard({
  data
}) {
  const pct = Math.round(data.progress / data.total * 100);
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-continue",
    "data-screen-label": "Continue Learning"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-continue-card",
    onClick: () => goL(data.href),
    "aria-label": "Resume " + data.title + ", " + data.moduleText
  }, /*#__PURE__*/React.createElement("span", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + data.image + ")"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "play",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:play",
    size: 16,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, data.title), /*#__PURE__*/React.createElement("span", {
    className: "mod"
  }, data.moduleText), /*#__PURE__*/React.createElement("span", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "pct"
  }, data.progress, " of ", data.total, " complete"))));
}
function SecHead({
  title,
  viewAll = true,
  linkLabel = "See All"
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title), viewAll && /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goL("MyLearning.html");
    }
  }, linkLabel));
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
  }, /*#__PURE__*/React.createElement("button", {
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
function LM2FreeResources({
  unlocked,
  onStartSurvey
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lm2-freeres",
    "data-screen-label": "Free Resources"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "Free Resources",
    linkLabel: "View All"
  }), unlocked ? /*#__PURE__*/React.createElement("div", {
    className: "lm2-freeres-open"
  }, /*#__PURE__*/React.createElement("p", null, "Your free resources are unlocked — guides, checklists and vein maps tailored to your clinic goals."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm2-outline-btn",
    onClick: () => goL("MySaved.html")
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
  }, t.dot)), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
});
function LM2FloatChrome() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm2-float-icons"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fi",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:search",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fi",
    "aria-label": "Saved",
    onClick: () => goL("MySaved.html")
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:bookmark",
    size: 18,
    color: "var(--brand-navy)"
  })));
}
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
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useScrollChromeL(scrollRef);
  const unlockResources = () => {
    setResourcesUnlocked(true);
    try {
      localStorage.setItem("pf-resources-unlocked", "1");
    } catch (e) {}
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "My Learning (mobile)"
  }, /*#__PURE__*/React.createElement(MobileChromeC, null), /*#__PURE__*/React.createElement(LM2FloatChrome, null), /*#__PURE__*/React.createElement("div", {
    className: "lm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement(LM2Header, {
    freeTier: LM_FREE
  }), /*#__PURE__*/React.createElement(LM2GoalBanner, {
    data: LM2_GOAL,
    onHelp: () => setHelpOpen(true)
  }), /*#__PURE__*/React.createElement("section", {
    className: "lm2-continue-sec",
    "data-screen-label": "Continue Learning"
  }, LM_FREE ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "lm2-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Continue Learning")), /*#__PURE__*/React.createElement(LM2LockedCard, {
    title: "Unlock Continue Learning",
    body: "Upgrade to start a course and track your progress toward your goal.",
    onUpgrade: () => goL("MembershipTier.html")
  })) : /*#__PURE__*/React.createElement(LM2ContinueCard, {
    data: LM2_CONTINUE
  })), /*#__PURE__*/React.createElement(LM2ProgressSpotlight, {
    data: LM2_PROGRESS_SPOTLIGHT
  }), /*#__PURE__*/React.createElement("section", {
    className: "lm2-courseband",
    "data-screen-label": "My Courses"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "My Courses"
  }), LM_FREE ? /*#__PURE__*/React.createElement(LM2LockedCard, {
    title: "Unlock My Courses",
    body: "Upgrade to purchase courses and they'll live here for easy access.",
    onUpgrade: () => goL("MembershipTier.html")
  }) : /*#__PURE__*/React.createElement("div", {
    className: "lm2-coursegrid"
  }, LM2_MY_COURSES.map((c, i) => /*#__PURE__*/React.createElement(LM2CourseCard, {
    key: i,
    c: c
  })))), /*#__PURE__*/React.createElement(LM2FreeResources, {
    unlocked: resourcesUnlocked,
    onStartSurvey: () => setSurveyOpen(true)
  }), /*#__PURE__*/React.createElement(LM2LearningPathCard, null), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  })), /*#__PURE__*/React.createElement(LMTabBar, null), /*#__PURE__*/React.createElement(SurveyMobile, {
    open: surveyOpen,
    onClose: () => setSurveyOpen(false),
    onComplete: unlockResources
  }), /*#__PURE__*/React.createElement(LM2HelpSheet, {
    open: helpOpen,
    onClose: () => setHelpOpen(false)
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
