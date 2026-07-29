/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Ported from the bound claude.ai/design source (Confidence Engine dashboard:
   Vision, weekly focus ring, domain confidence, daily targets) onto the DS
   bundle. Suffixed -L to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateL
} = React;
const DSL = window.ProfinityDesignSystem_c2b5cc;
const {
  CourseTile: CourseTileL,
  LevelBadge: LevelBadgeL,
  IconifyIcon: IconifyL,
  Icon: IconL
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
  lip: "assets/clinic-lip-design.png",
  protox: "assets/clinic-toxin-guide.png",
  temple: "assets/clinic-treatment-collage.png",
  logo: "assets/profinity-academy-logo-full.png"
};
const LM_VISION = "Boutique clinic with lips + skin treatments, £80k/month revenue, team of 3 professionals";
const LM_DOMAINS = [{
  key: "Clinical",
  pct: 62,
  color: "#2E86FF"
}, {
  key: "Marketing",
  pct: 52,
  color: "#CE9957"
}, {
  key: "Sales",
  pct: 31,
  color: "#BE1E2D"
}, {
  key: "Business",
  pct: 41,
  color: "#E58F0C"
}];
const LM_FOCUS = {
  domain: "Marketing",
  line: "You need visibility. You aren't known yet.",
  pct: 52
};
const LM_TARGETS = [{
  t: "Write 3 LinkedIn posts about treatments",
  tag: "MKT",
  rung: "DO",
  pts: 15,
  done: true
}, {
  t: "Record 30-second TikTok intro to clinic",
  tag: "MKT",
  rung: "DO",
  pts: 15
}, {
  t: "Engage on 5 local business Instagram posts",
  tag: "MKT",
  rung: "LEARN",
  pts: 5
}, {
  t: "Document 3 common side effects and care",
  tag: "CLIN",
  rung: "LEARN",
  pts: 15
}, {
  t: "Follow up with 3 warm enquiries within 24h",
  tag: "SALE",
  rung: "DO",
  pts: 15
}];
const LM_TABS_TOP = ["All Courses", "Free Resources", "New Courses", "Recommended", "Upcoming Webinars", "Certification"];
const MY_COURSES_L = [{
  image: IMG_L.lip,
  level: "Beginner",
  title: "8D Lip Design",
  description: "Discover a complete view of human anatomy for deeper learning.",
  progress: 20,
  cta: "Continue learning",
  active: true
}, {
  image: IMG_L.temple,
  level: "Intermediate",
  title: "Temple Filler",
  description: "Confidently Inject Temples & add YOUTH back into your patients.",
  progress: 0,
  cta: "Start learning"
}, {
  image: IMG_L.protox,
  level: "Advance",
  title: "Protox Course",
  description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.",
  progress: 0,
  cta: "Start learning"
}];
const RESOURCES_L = [{
  image: IMG_L.temple,
  title: "13 Risky Injection Areas",
  lines: ["Facial Vein Mapping", "Navigating Risky Zones"]
}, {
  image: IMG_L.protox,
  title: "Aspirating Experiment",
  lines: ["Sample Analysis", "Essential Lab Techniques"]
}, {
  image: IMG_L.lip,
  title: "Bruising Checklist",
  lines: ["Injection Site Prep", "Minimize Bruising"]
}];
const PATHS_L = [{
  image: IMG_L.protox,
  title: "Botox",
  description: "Discover a complete view of human anatomy for deeper learning.",
  price: "£1,998"
}, {
  image: IMG_L.temple,
  title: "Filler",
  description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.",
  price: "£794"
}, {
  image: IMG_L.lip,
  title: "Lips",
  description: "Confidently Inject Temples & add YOUTH back into your patients.",
  price: "£1,234"
}];
const RECOMMENDED_L = [{
  image: IMG_L.lip,
  level: "Beginner",
  title: "Dynamic Facial Structures",
  description: "Explore intricate facial anatomy to enhance artistry.",
  by: "Dr Emily Carter",
  price: "£1,245"
}, {
  image: IMG_L.protox,
  level: "Intermediate",
  title: "Advanced Lip Techniques",
  description: "Master the nuances of lip anatomy for precise techniques.",
  by: "Prof. Jonah Lee",
  price: "£1,300"
}, {
  image: IMG_L.temple,
  level: "Intermediate",
  title: "Comprehensive Facial Anatomy",
  description: "A thorough exploration of facial structures.",
  by: "Dr Lisa Huang",
  price: "£1,550"
}];
const NEW_COURSES_L = [{
  image: IMG_L.lip,
  level: "Intermediate",
  title: "8D Lip Design",
  description: "Discover a complete view of human anatomy for deeper learning.",
  by: TUTOR_L,
  price: "£112"
}, {
  image: IMG_L.protox,
  level: "Intermediate",
  title: "Protox Course",
  description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence.",
  by: TUTOR_L,
  price: "£99"
}, {
  image: IMG_L.temple,
  level: "Intermediate",
  title: "Temple Filler",
  description: "Confidently Inject Temples & add YOUTH back into your patients.",
  by: TUTOR_L,
  price: "£100"
}];
const POPULAR_L = [{
  image: IMG_L.lip,
  level: "Advance",
  title: "8D Lip Design",
  description: "Discover a complete view of human anatomy for deeper learning.",
  by: TUTOR_L,
  price: "£112"
}, {
  image: IMG_L.protox,
  level: "Advance",
  title: "Protox Course",
  description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence.",
  by: TUTOR_L,
  price: "£99"
}, {
  image: IMG_L.temple,
  level: "Advance",
  title: "Brow Lift Training",
  description: "Learn expert techniques for achieving flawless brow lifts.",
  by: TUTOR_L,
  price: "£99"
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
  label: "My Learning",
  icon: "lucide:book-open",
  href: null
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Agent",
  label: "Agent",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}];
function LMSearch() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-search"
  }, /*#__PURE__*/React.createElement(DSL.Icon, {
    name: "search",
    size: 21,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search course…",
    "aria-label": "Search course"
  }), /*#__PURE__*/React.createElement(DSL.IconifyIcon, {
    name: "lucide:sliders-horizontal",
    size: 21,
    color: "var(--gray-500)"
  }));
}
function LMSaveFab() {
  return /*#__PURE__*/React.createElement("button", {
    className: "lm-savefab",
    "aria-label": "Saved",
    onClick: () => goL("MySaved.html?from=learning")
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:bookmark",
    size: 20,
    color: "var(--brand-navy)"
  }));
}
const LM_TIER_CONTENT = [{
  label: "Foundation Courses",
  n: "8 courses",
  icon: "lucide:graduation-cap",
  tint: "#2A9568",
  href: "MyLearning.html"
}, {
  label: "Live Masterclasses",
  n: "5 replays",
  icon: "lucide:play-circle",
  tint: "#6C63FF",
  href: "MyLearning.html"
}, {
  label: "Protocols & Guides",
  n: "12 files",
  icon: "lucide:file-text",
  tint: "#CE9957",
  href: "MyLearning.html"
}, {
  label: "Confidence Channel",
  n: "Community",
  icon: "lucide:users",
  tint: "#2E86FF",
  href: "CommunityMobile.html"
}];
function MembershipTier() {
  const [open, setOpen] = useStateL(false);
  return /*#__PURE__*/React.createElement("section", {
    className: "lm-tier",
    "data-screen-label": "Your Membership"
  }, /*#__PURE__*/React.createElement("button", {
    className: "lm-tier-mini",
    onClick: () => setOpen(true),
    "aria-haspopup": "dialog"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-tier-badge"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:crown",
    size: 16,
    color: "#fff"
  }), " Confidence Path"), /*#__PURE__*/React.createElement("span", {
    className: "lm-tier-mini-tx"
  }, "Your Membership · ", /*#__PURE__*/React.createElement("b", null, "Active")), /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "lm-tier-overlay",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "lm-tier-h",
    onClick: () => setOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-tier-sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-tier-sheet-hd"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "lm-tier-h"
  }, "Your Membership"), /*#__PURE__*/React.createElement("button", {
    className: "lm-tier-close",
    "aria-label": "Close",
    onClick: () => setOpen(false)
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:x",
    size: 22,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lm-tier-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-tier-badge"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:crown",
    size: 16,
    color: "#fff"
  }), " Confidence Path"), /*#__PURE__*/React.createElement("span", {
    className: "lm-tier-note"
  }, "Active")), /*#__PURE__*/React.createElement("p", {
    className: "lm-tier-sub"
  }, "Jump straight into everything included in your plan."), /*#__PURE__*/React.createElement("div", {
    className: "lm-tier-grid"
  }, LM_TIER_CONTENT.map((c, i) => /*#__PURE__*/React.createElement("button", {
    className: "lm-tier-item",
    key: i,
    onClick: () => goL(c.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: {
      background: c.tint + "1f"
    }
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: c.icon,
    size: 22,
    color: c.tint
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, c.label), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, c.n)), /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "lm-tier-manage",
    onClick: () => goL("MyLearning.html")
  }, "Manage membership"))));
}
function ConfidenceEngine() {
  const [targets, setTargets] = useStateL(LM_TARGETS.map(t => !!t.done));
  const toggle = i => setTargets(s => s.map((v, j) => j === i ? !v : v));
  return /*#__PURE__*/React.createElement("section", {
    className: "lm-engine",
    "data-screen-label": "Confidence Engine"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-vision"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-vision-k"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:target",
    size: 16,
    color: "var(--brand-gold)"
  }), " Your Vision"), /*#__PURE__*/React.createElement("span", {
    className: "lm-vision-tx"
  }, LM_VISION)), /*#__PURE__*/React.createElement("div", {
    className: "lm-focus"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-focus-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-focus-eyebrow"
  }, "Your focus this week"), /*#__PURE__*/React.createElement("span", {
    className: "lm-focus-domain"
  }, LM_FOCUS.domain), /*#__PURE__*/React.createElement("span", {
    className: "lm-focus-line"
  }, LM_FOCUS.line)), /*#__PURE__*/React.createElement("div", {
    className: "lm-focus-ring",
    style: {
      "--pct": LM_FOCUS.pct
    },
    role: "img",
    "aria-label": LM_FOCUS.pct + "% confident in " + LM_FOCUS.domain
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, LM_FOCUS.pct, /*#__PURE__*/React.createElement("i", null, "%")))), /*#__PURE__*/React.createElement("div", {
    className: "lm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Your Domain Confidence")), /*#__PURE__*/React.createElement("div", {
    className: "lm-domains"
  }, LM_DOMAINS.map(d => /*#__PURE__*/React.createElement("div", {
    className: "lm-domain",
    key: d.key
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-domain-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, d.key.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, d.pct, "%")), /*#__PURE__*/React.createElement("span", {
    className: "lm-domain-track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-domain-fill",
    style: {
      width: d.pct + "%",
      background: d.color
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "lm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Today's Targets")), /*#__PURE__*/React.createElement("div", {
    className: "lm-targets"
  }, LM_TARGETS.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "lm-target" + (targets[i] ? " done" : ""),
    onClick: () => toggle(i),
    role: "checkbox",
    "aria-checked": targets[i]
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-target-box"
  }, targets[i] && /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:check",
    size: 15,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lm-target-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-target-t"
  }, t.t), /*#__PURE__*/React.createElement("span", {
    className: "lm-target-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-target-tag"
  }, t.tag), " Rung: ", t.rung)), /*#__PURE__*/React.createElement("span", {
    className: "lm-target-pts"
  }, "+", t.pts, " pts")))));
}
function LMTopTabs({
  active,
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-toptabs",
    role: "tablist",
    "aria-label": "Course categories"
  }, LM_TABS_TOP.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    role: "tab",
    "aria-selected": active === c,
    className: "lm-tt" + (active === c ? " on" : ""),
    onClick: () => onPick(c)
  }, c)));
}
function SecHead({
  title,
  viewAll = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title), viewAll && /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goL("MyLearning.html");
    }
  }, "View All"));
}
function ResourceCardL({
  r,
  locked = true
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "lm-res"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + r.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadgeL, {
    level: "Intermediate",
    className: "lvl"
  }), locked && /*#__PURE__*/React.createElement("span", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:lock",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, r.title), r.lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    className: "ds",
    key: i
  }, l)), /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, TUTOR_L), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-ghost",
    onClick: () => goL("CourseDetail.html")
  }, locked ? "Learn More" : "Start course")));
}
function PriceCardL({
  c
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "lm-price"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + c.image + ")"
    }
  }, c.level && /*#__PURE__*/React.createElement(LevelBadgeL, {
    level: c.level,
    className: "lvl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "play"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "fluent:play-16-filled",
    size: 18,
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
    className: "lm-ghost",
    onClick: () => goL("CourseDetail.html")
  }, "Learn More"))));
}
function PathCardL({
  c
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "lm-price"
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
function PathIntroL() {
  return /*#__PURE__*/React.createElement("article", {
    className: "lm-intro"
  }, /*#__PURE__*/React.createElement("img", {
    src: IMG_L.logo,
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "Profinity Success Paths Certificates"), /*#__PURE__*/React.createElement("div", {
    className: "ds"
  }, "Learn more about success paths, and build your journey towards achieving your goals with tailored strategies and resources."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-out",
    onClick: () => goL("MyLearning.html")
  }, "Learn More"));
}
function FreeResourcesL({
  unlocked,
  onStart
}) {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Free Resources"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "Free Resources",
    viewAll: unlocked
  }), unlocked ? /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, RESOURCES_L.map((r, i) => /*#__PURE__*/React.createElement(ResourceCardL, {
    key: i,
    r: r,
    locked: false
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "lm-locked"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-locked-rail",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, RESOURCES_L.map((r, i) => /*#__PURE__*/React.createElement(ResourceCardL, {
    key: i,
    r: r
  })))), /*#__PURE__*/React.createElement("div", {
    className: "lm-locked-veil"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-locked-card",
    role: "group",
    "aria-label": "Free Resources locked"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-locked-ic"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:lock",
    size: 26,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lm-locked-ti"
  }, "Resources archive is locked"), /*#__PURE__*/React.createElement("div", {
    className: "lm-locked-sub"
  }, "Complete a short onboarding survey to unlock the full free resources archive."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-locked-btn",
    onClick: onStart
  }, "Complete survey to unlock", /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-right",
    size: 17,
    color: "#fff"
  }))))));
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
function AICoachFab() {
  const [open, setOpen] = useStateL(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "lm-coach-fab" + (open ? " on" : ""),
    onClick: () => setOpen(v => !v),
    "aria-label": "AI Coach",
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement(DSL.Spark, {
    size: 22,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm-coach-fab-tx"
  }, "AI Coach")), open && /*#__PURE__*/React.createElement("div", {
    className: "lm-coach-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "AI Coach"
  }, /*#__PURE__*/React.createElement("button", {
    className: "lm-coach-scrim",
    "aria-label": "Close",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-coach-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-coach-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-coach-av"
  }, /*#__PURE__*/React.createElement(DSL.Spark, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "lm-coach-hd-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, "Profinity Coach"), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, "Your learning companion")), /*#__PURE__*/React.createElement("button", {
    className: "lm-coach-x",
    "aria-label": "Close",
    onClick: () => setOpen(false)
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lm-coach-msg"
  }, "Hi Katy! 👋 Based on your ", /*#__PURE__*/React.createElement("b", null, "Marketing"), " focus, I'd suggest starting with today's targets. Want me to build a study plan for this week?"), /*#__PURE__*/React.createElement("div", {
    className: "lm-coach-chips"
  }, /*#__PURE__*/React.createElement("button", {
    className: "lm-coach-chip"
  }, "Build my study plan"), /*#__PURE__*/React.createElement("button", {
    className: "lm-coach-chip"
  }, "What should I learn next?"), /*#__PURE__*/React.createElement("button", {
    className: "lm-coach-chip"
  }, "Explain my confidence score")), /*#__PURE__*/React.createElement("div", {
    className: "lm-coach-input"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Ask your coach anything…",
    "aria-label": "Message"
  }), /*#__PURE__*/React.createElement("button", {
    className: "lm-coach-send",
    "aria-label": "Send"
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-up",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "lm-coach-disc"
  }, "AI can make mistakes. Verify important outputs."))));
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
function LearningHome() {
  const [unlocked, setUnlocked] = useStateL(() => {
    try {
      return localStorage.getItem("pf-free-unlocked") === "1";
    } catch (e) {
      return false;
    }
  });
  const [surveyOpen, setSurveyOpen] = useStateL(false);
  const [topTab, setTopTab] = useStateL("All Courses");
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useScrollChromeL(scrollRef);
  function completeSurvey() {
    setUnlocked(true);
    try {
      localStorage.setItem("pf-free-unlocked", "1");
    } catch (e) {}
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "My Learning (mobile)"
  }, /*#__PURE__*/React.createElement(MobileChromeC, null), /*#__PURE__*/React.createElement(LMSaveFab, null), /*#__PURE__*/React.createElement(LMSearch, null), /*#__PURE__*/React.createElement("div", {
    className: "lm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement(ConfidenceEngine, null), /*#__PURE__*/React.createElement(LMTopTabs, {
    active: topTab,
    onPick: setTopTab
  }), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "My Courses"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "My Courses",
    viewAll: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, MY_COURSES_L.map((c, i) => /*#__PURE__*/React.createElement(CourseTileL, {
    key: i,
    ...c,
    style: {
      width: 268,
      flex: "none",
      scrollSnapAlign: "start"
    }
  })))), /*#__PURE__*/React.createElement(MembershipTier, null), /*#__PURE__*/React.createElement(FreeResourcesL, {
    unlocked: unlocked,
    onStart: () => setSurveyOpen(true)
  }), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Success Path"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Success Path")), /*#__PURE__*/React.createElement("div", {
    className: "lm-cream"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, /*#__PURE__*/React.createElement(PathIntroL, null), PATHS_L.map((c, i) => /*#__PURE__*/React.createElement(PathCardL, {
    key: i,
    c: c
  }))))), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Recommended Course"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "Recommended Course"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-pill gold",
    onClick: () => goL("MyLearning.html")
  }, /*#__PURE__*/React.createElement(IconifyL, {
    name: "fluent:crown-16-filled",
    size: 15,
    color: "#fff"
  }), "Upgrade to Premium for 15% OFF all products", /*#__PURE__*/React.createElement(IconifyL, {
    name: "lucide:arrow-right",
    size: 15,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, RECOMMENDED_L.map((c, i) => /*#__PURE__*/React.createElement(PriceCardL, {
    key: i,
    c: c
  })))), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "New Courses"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "New Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, NEW_COURSES_L.map((c, i) => /*#__PURE__*/React.createElement(PriceCardL, {
    key: i,
    c: c
  })))), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Popular Courses"
  }, /*#__PURE__*/React.createElement(SecHead, {
    title: "Popular Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lm-rail"
  }, POPULAR_L.map((c, i) => /*#__PURE__*/React.createElement(PriceCardL, {
    key: i,
    c: c
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  })), /*#__PURE__*/React.createElement(LMTabBar, null), /*#__PURE__*/React.createElement(AICoachFab, null), /*#__PURE__*/React.createElement(SurveyMobile, {
    open: surveyOpen,
    onClose: () => setSurveyOpen(false),
    onComplete: completeSurvey
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
