/* ===========================================================================
   PROfinity Academy — My Courses (web)
   Full list of the member's own enrolled/purchased courses for desktop:
   search + All/In Progress/Completed/Saved tabs over a responsive grid.
   Reached from the "View All" link on the My Courses rail on MyLearning.html
   (learning.jsx). Mirrors the catalog shell used by all-courses-web.jsx, but
   over MY_COURSES (owned) rather than the full platform catalog.
   Suffixed -MCW to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateMCW
} = React;
const DSMCW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavMCW,
  LevelBadge: LevelBadgeMCW,
  IconifyIcon: IconifyMCW,
  Icon: IconMCW
} = DSMCW;
const ME_MCW = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const TUTOR_MCW = "Dr Tim Pearce";
function goMCW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateMCW(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goMCW(u);
}

/* Same "pf-subscription-tier" key MyLearning.html reads/writes — this page
   doesn't load app.jsx, so it keeps its own tiny copy. */
function mcwReadTier() {
  if (window.PF_TIER) return window.PF_TIER;
  try {
    return localStorage.getItem("pf-subscription-tier") || "free";
  } catch (e) {
    return "free";
  }
}
const FREE_TIER_MCW = mcwReadTier() === "free";
const IMG_MCW = {
  lip: "assets/course-8d-lip-design.jpg",
  temple: "assets/course-temple-filler.webp",
  protox: "assets/course-protox.png",
  browLift: "assets/course-brow-lift.jpg",
  fullFace: "assets/course-full-face-rejuvenation.jpg",
  cheek: "assets/course-cheek-contouring.jpg",
  complications: "assets/course-complications.jpg",
  consultation: "assets/course-consultation.jpg"
};
const CERT_THUMB_MCW = "assets/certificate-thumb.svg";
function courseMCW(image, level, title, description, extra) {
  const completed = !!(extra && extra.completed);
  const inProgress = !completed && !!(extra && extra.progress);
  return {
    image,
    level,
    title,
    description,
    inProgress,
    completed,
    progress: completed ? 100 : extra && extra.progress ? extra.progress : 0,
    lesson: extra && extra.lesson,
    cta: completed ? "View Certificate" : inProgress ? "Resume Lesson " + extra.lesson : "Learn More",
    certificate: completed ? {
      issuedDate: extra.issuedDate,
      id: extra.certId,
      image: extra.certImage || CERT_THUMB_MCW
    } : null
  };
}
const MY_COURSES_MCW = [courseMCW(IMG_MCW.lip, "Intermediate", "8D Lip Design", "Discover a complete view of lip anatomy for deeper learning.", {
  progress: 20,
  lesson: 4
}), courseMCW(IMG_MCW.temple, "Advance", "Temple Filler", "Master safe injection techniques with anatomical precision."), courseMCW(IMG_MCW.protox, "Advance", "Protox Course", "Elevate your botulinum toxin skills and refine your technique.", {
  completed: true,
  issuedDate: "12 Jun 2026",
  certId: "PF-PTX-2201"
}), courseMCW(IMG_MCW.browLift, "Intermediate", "Brow Lift Training", "Learn expert techniques for achieving flawless, natural brow lifts."), courseMCW(IMG_MCW.fullFace, "Advance", "Full-Face Rejuvenation Protocol", "A complete framework for combination treatments across the face."), courseMCW(IMG_MCW.cheek, "Intermediate", "Cheek & Midface Contouring", "Master volumising techniques for natural-looking cheek definition."), courseMCW(IMG_MCW.complications, "Advance", "Complications Management", "Recognise, prevent and manage vascular and other complications."), courseMCW(IMG_MCW.consultation, "Beginner", "Consultation & Patient Assessment", "Build trust and plan safe, effective treatments from the first visit.", {
  completed: true,
  issuedDate: "03 Feb 2026",
  certId: "PF-CPA-1187"
})];
function goToCourseMCW(c) {
  if (c.completed && c.certificate) return goToCertificateMCW(c);
  const url = c.inProgress ? "LessonWeb.html" : `CourseWeb.html?${new URLSearchParams({
    title: c.title,
    instr: TUTOR_MCW,
    pct: c.progress || 0
  })}`;
  goMCW(url);
}
function goToCertificateMCW(c) {
  const params = new URLSearchParams({
    title: c.title,
    instr: TUTOR_MCW,
    student: ME_MCW.name,
    issued: c.certificate.issuedDate,
    id: c.certificate.id
  });
  goMCW(`CertificateWeb.html?${params}`);
}
const MCW_TABS = ["All Courses", "In Progress", "Completed"];
const MCW_TAB_FILTERS = {
  "In Progress": c => c.inProgress,
  "Completed": c => c.completed
};
function MCWCourseCard({
  c
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "mcw-coursecard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + c.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadgeMCW, {
    level: c.level,
    className: "lvl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "play"
  }, /*#__PURE__*/React.createElement(IconifyMCW, {
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
  }, TUTOR_MCW), c.completed && /*#__PURE__*/React.createElement("div", {
    className: "progrow done"
  }, /*#__PURE__*/React.createElement(IconifyMCW, {
    name: "fluent:checkmark-circle-16-filled",
    size: 16,
    color: "var(--success)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pct"
  }, "Completed")), c.inProgress && /*#__PURE__*/React.createElement("div", {
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
    className: c.inProgress ? "mcw-cta filled" : "mcw-cta ghost",
    onClick: () => goToCourseMCW(c)
  }, c.cta)));
}
function MCWCertificateCard({
  c
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "mcw-certcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + c.certificate.image + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadgeMCW, {
    level: c.level,
    className: "lvl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cert-ribbon"
  }, /*#__PURE__*/React.createElement(IconifyMCW, {
    name: "fluent:ribbon-star-16-filled",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, TUTOR_MCW), /*#__PURE__*/React.createElement("div", {
    className: "cert-meta"
  }, "Issued ", c.certificate.issuedDate, " · ", c.certificate.id), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mcw-cta filled",
    onClick: () => goToCourseMCW(c)
  }, "View Certificate")));
}
function MCWLockedPanel() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mcw-locked"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcw-locked-icon"
  }, /*#__PURE__*/React.createElement(IconifyMCW, {
    name: "lucide:lock",
    size: 28,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h3", null, "Unlock My Courses"), /*#__PURE__*/React.createElement("p", null, "Upgrade to purchase courses and they’ll live here for easy access."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mcw-locked-upgrade-btn",
    onClick: () => goMCW("MembershipTier.html")
  }, "Upgrade", /*#__PURE__*/React.createElement(IconifyMCW, {
    name: "lucide:arrow-up-right",
    size: 19,
    color: "#fff"
  })));
}
function MyCoursesWebApp() {
  const [query, setQuery] = useStateMCW("");
  const [tab, setTab] = useStateMCW("All Courses");
  const courses = MY_COURSES_MCW.filter(MCW_TAB_FILTERS[tab] || (() => true)).filter(c => {
    if (query.trim() && !c.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavMCW, {
    active: "My Learning",
    user: ME_MCW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateMCW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mcw-page",
    "data-screen-label": "My Courses"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mcw-back",
    onClick: () => goMCW("MyLearning.html")
  }, /*#__PURE__*/React.createElement(IconifyMCW, {
    name: "lucide:arrow-left",
    size: 18,
    color: "var(--brand-navy)"
  }), "Back to My Learning"), /*#__PURE__*/React.createElement("div", {
    className: "mcw-head"
  }, /*#__PURE__*/React.createElement("h1", null, "My Courses"), /*#__PURE__*/React.createElement("p", null, "Every course you’ve started, saved or completed — all in one place.")), FREE_TIER_MCW ? /*#__PURE__*/React.createElement(MCWLockedPanel, null) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mcw-toolbar"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mcw-search"
  }, /*#__PURE__*/React.createElement(IconMCW, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search your courses…",
    "aria-label": "Search your courses",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mcw-tabs",
    role: "tablist",
    "aria-label": "Filter my courses"
  }, MCW_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    type: "button",
    role: "tab",
    "aria-selected": tab === t,
    className: "mcw-tab" + (tab === t ? " on" : ""),
    onClick: () => setTab(t)
  }, t)))), courses.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "mcw-empty"
  }, query.trim() ? "No courses match your search." : tab === "In Progress" ? "No courses in progress yet." : tab === "Completed" ? "Complete a course to earn your first certificate." : "No courses here yet.") : /*#__PURE__*/React.createElement("div", {
    className: "mcw-grid"
  }, courses.map((c, i) => tab === "Completed" ? /*#__PURE__*/React.createElement(MCWCertificateCard, {
    key: i,
    c: c
  }) : /*#__PURE__*/React.createElement(MCWCourseCard, {
    key: i,
    c: c
  }))))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MyCoursesWebApp, null));
