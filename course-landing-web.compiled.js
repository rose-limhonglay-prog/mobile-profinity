/* ===========================================================================
   PROfinity — Course Landing (web)
   Overview/enrollment page for the PROfinity Membership, reached from a
   My Learning course tile before entering the in-course experience
   (CourseWeb.html). Suffixed -CL to avoid clashing with other page globals.
   =========================================================================== */
const {
  useState: useStateCL
} = React;
const DSCL = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavCL,
  IconifyIcon: IconCL,
  LevelBadge: LevelBadgeCL,
  Spark: SparkCL
} = DSCL;
const ME_CL = {
  name: "Rose Lim",
  role: "PROfinity Team",
  avatar: "assets/avatar-katy.jpg"
};
function goCL(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateCL(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goCL(u);
}
function continueCL() {
  goCL("CourseWeb.html?course=8d-lips");
}
const COURSE_CL = {
  title: "PROfinity Membership",
  category: "PROfinity Membership · All access",
  level: "All Levels",
  bannerImage: "assets/course-membership-banner.jpg",
  description: "A comprehensive membership giving you ongoing protocols, weekly demos, marketing resources, and community support.",
  instructor: {
    name: "Dr Tim Pearce",
    role: "Clinical Director · PROfinity Academy",
    avatar: "assets/avatar-drtim.png"
  },
  instructorBio: "Medical Doctor · Leading Aesthetic Clinician & Educator · Clinical Director · Longevity Advocate",
  progress: 14,
  aboutParas: ["A comprehensive membership giving you ongoing protocols, weekly demos, marketing resources, and community support."],
  included: [{
    icon: "lucide:book-open",
    text: "Full course access"
  }, {
    icon: "lucide:award",
    text: "Certificate on completion"
  }, {
    icon: "lucide:clipboard-check",
    text: "End-of-course assessment"
  }, {
    icon: "lucide:refresh-cw",
    text: "Lifetime access & future updates"
  }],
  learn: ["Access comprehensive protocols for complications, botox, and anatomy", "Watch Technique Tuesday weekly injection demonstrations", "Use social media templates and marketing resources", "Get real-time support from the PROfinity community"],
  sectionsSummary: "22 sections • 258 lectures",
  sections: [{
    title: "START HERE",
    open: true,
    lessons: [{
      name: "Step 1. Welcome from Dr Tim",
      kind: "video"
    }, {
      name: "Step 2. Join the next onboarding call",
      kind: "article"
    }, {
      name: "Your Member Discounts",
      kind: "article"
    }]
  }, {
    title: "Get Help With Complications",
    open: true,
    lessons: [{
      name: "Complications Resources",
      kind: "article"
    }]
  }, {
    title: "Technique Tuesday",
    lessons: [],
    subs: [{
      title: "Lip Filler Technique",
      lessons: [{
        name: "Linear threading technique",
        kind: "video"
      }, {
        name: "Tenting technique",
        kind: "video"
      }, {
        name: "Cannula approach",
        kind: "video"
      }]
    }, {
      title: "Case Studies",
      lessons: [{
        name: "Case 1: thin lips, first treatment",
        kind: "video"
      }, {
        name: "Case 2: correction of migrated filler",
        kind: "video"
      }]
    }, {
      title: "Downloads & Resources",
      lessons: [{
        name: "Technique recipe cards (PDF)",
        kind: "pdf"
      }, {
        name: "Consent form templates (PDF)",
        kind: "pdf"
      }]
    }]
  }, {
    title: "Treatments",
    count: 24,
    lessons: []
  }, {
    title: "Marketing",
    count: 6,
    lessons: []
  }, {
    title: "Sales",
    count: 3,
    lessons: []
  }, {
    title: "Library & Protocols",
    count: 9,
    lessons: []
  }, {
    title: "The Vault",
    count: 128,
    lessons: []
  }]
};
const META_CL = [{
  icon: "lucide:clock",
  key: "Duration",
  value: "147h 34m"
}, {
  icon: "lucide:layers",
  key: "Sections",
  value: "22 sections"
}, {
  icon: "lucide:bar-chart-2",
  key: "Level",
  value: COURSE_CL.level
}, {
  icon: "lucide:award",
  key: "Certificate",
  value: "Included"
}];
function sectionLessonCount(s) {
  const subCount = (s.subs || []).reduce((total, sub) => total + sub.lessons.length, 0);
  return s.lessons.length + subCount || s.count || 0;
}
function CLCrumb() {
  return /*#__PURE__*/React.createElement("div", {
    className: "cl-crumb-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cl-back-btn",
    "aria-label": "Back to My Learning",
    onClick: () => goCL("MyLearning.html")
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: "lucide:arrow-left",
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cl-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goCL("MyLearning.html")
  }, "My Learning"), " \xA0/\xA0 ", /*#__PURE__*/React.createElement("span", null, COURSE_CL.title)));
}
function CLMetaItem({
  m
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cl-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cl-meta-key"
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: m.icon,
    size: 16,
    color: "var(--brand-navy)"
  }), m.key), /*#__PURE__*/React.createElement("span", {
    className: "cl-meta-val"
  }, m.value));
}
function CLHero({
  course
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cl-card cl-hero-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-hero-media"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.bannerImage,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "cl-hero-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-badge-row"
  }, /*#__PURE__*/React.createElement(LevelBadgeCL, {
    level: course.level
  }), /*#__PURE__*/React.createElement("span", {
    className: "cl-category"
  }, course.category)), /*#__PURE__*/React.createElement("h1", {
    className: "cl-title"
  }, course.title), /*#__PURE__*/React.createElement("p", {
    className: "cl-sub"
  }, course.description), /*#__PURE__*/React.createElement("div", {
    className: "cl-instr-row"
  }, /*#__PURE__*/React.createElement("img", {
    className: "cl-instr-avatar",
    src: course.instructor.avatar,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "cl-instr-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cl-instr-name"
  }, course.instructor.name), /*#__PURE__*/React.createElement("span", {
    className: "cl-instr-role"
  }, course.instructor.role))), /*#__PURE__*/React.createElement("div", {
    className: "cl-meta-row"
  }, META_CL.map((m, i) => /*#__PURE__*/React.createElement(CLMetaItem, {
    m: m,
    key: i
  })))));
}
function CLAbout({
  course
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cl-card cl-about"
  }, /*#__PURE__*/React.createElement("h2", null, "About this course"), course.aboutParas.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, p)));
}
function CLLearn({
  course
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cl-card cl-learn"
  }, /*#__PURE__*/React.createElement("h2", null, "What you'll learn"), /*#__PURE__*/React.createElement("div", {
    className: "cl-learn-grid"
  }, course.learn.map((l, i) => /*#__PURE__*/React.createElement("div", {
    className: "cl-learn-item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "cl-learn-tick"
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: "lucide:check",
    size: 13,
    color: "#fff"
  })), l))));
}
function CLLessonRow({
  lesson
}) {
  const isVideo = lesson.kind === "video";
  return /*#__PURE__*/React.createElement("div", {
    className: "cl-lesson"
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: isVideo ? "lucide:play-circle" : "lucide:file-text",
    size: 17,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cl-lesson-name"
  }, lesson.name), /*#__PURE__*/React.createElement("span", {
    className: "cl-lesson-badge"
  }, isVideo ? "Video" : "Article"));
}
function CLSubLessonRow({
  lesson
}) {
  const pdf = lesson.kind === "pdf";
  const isVideo = lesson.kind === "video";
  return /*#__PURE__*/React.createElement("div", {
    className: "cl-sub-lesson"
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: pdf ? "lucide:file-text" : "lucide:play-circle",
    size: 15,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cl-sub-lesson-name"
  }, lesson.name), /*#__PURE__*/React.createElement("span", {
    className: "cl-sub-lesson-badge"
  }, pdf ? "PDF" : isVideo ? "Video" : "Article"));
}
function CLSubModule({
  sub
}) {
  const [open, setOpen] = useStateCL(!!sub.open);
  return /*#__PURE__*/React.createElement("div", {
    className: "cl-sub" + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cl-sub-hd",
    onClick: () => setOpen(v => !v),
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: open ? "lucide:folder-open" : "lucide:folder",
    size: 17,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cl-sub-title"
  }, sub.title), /*#__PURE__*/React.createElement("span", {
    className: "cl-sub-n"
  }, sub.lessons.length), /*#__PURE__*/React.createElement(IconCL, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 18,
    color: "var(--gray-450)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "cl-sub-body"
  }, sub.lessons.map((l, i) => /*#__PURE__*/React.createElement(CLSubLessonRow, {
    lesson: l,
    key: i
  }))));
}
function CLSection({
  section,
  index,
  open,
  onToggle
}) {
  const count = sectionLessonCount(section);
  const hasBody = section.lessons.length > 0 || section.subs && section.subs.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "cl-acc" + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cl-acc-hd",
    onClick: onToggle,
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("span", {
    className: "cl-acc-chip"
  }, index + 1), /*#__PURE__*/React.createElement("span", {
    className: "cl-acc-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cl-acc-title"
  }, section.title), /*#__PURE__*/React.createElement("span", {
    className: "cl-acc-sub"
  }, count, " lesson", count === 1 ? "" : "s")), /*#__PURE__*/React.createElement(IconCL, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 20,
    color: "var(--gray-500)"
  })), open && hasBody && /*#__PURE__*/React.createElement("div", {
    className: "cl-acc-body"
  }, section.lessons.map((l, i) => /*#__PURE__*/React.createElement(CLLessonRow, {
    lesson: l,
    key: i
  })), (section.subs || []).map((s, i) => /*#__PURE__*/React.createElement(CLSubModule, {
    sub: s,
    key: i
  }))));
}
function CLCurriculum({
  course,
  openSet,
  onToggle,
  onExpandAll,
  query,
  onQuery
}) {
  const q = query.trim().toLowerCase();
  const visible = course.sections.map((s, i) => ({
    s,
    i
  })).filter(({
    s
  }) => !q || s.title.toLowerCase().includes(q) || s.lessons.some(l => l.name.toLowerCase().includes(q)) || (s.subs || []).some(sub => sub.title.toLowerCase().includes(q) || sub.lessons.some(l => l.name.toLowerCase().includes(q))));
  return /*#__PURE__*/React.createElement("section", {
    className: "cl-card cl-curriculum"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-curr-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Course content"), /*#__PURE__*/React.createElement("div", {
    className: "cl-curr-sub"
  }, course.sectionsSummary)), /*#__PURE__*/React.createElement("div", {
    className: "cl-curr-tools"
  }, /*#__PURE__*/React.createElement("label", {
    className: "cl-search"
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: "lucide:search",
    size: 17,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search lesson…",
    "aria-label": "Search lesson",
    value: query,
    onChange: e => onQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cl-expand-all",
    onClick: onExpandAll
  }, openSet.size === course.sections.length ? "Collapse all" : "Expand all"))), /*#__PURE__*/React.createElement("div", {
    className: "cl-sections"
  }, visible.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "cl-no-results"
  }, "No lessons match \"", query, "\"."), visible.map(({
    s,
    i
  }) => /*#__PURE__*/React.createElement(CLSection, {
    section: s,
    index: i,
    key: i,
    open: openSet.has(i) || !!q && s.title.toLowerCase().includes(q),
    onToggle: () => onToggle(i)
  }))));
}
function CLInstructor({
  course
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cl-card cl-instructor"
  }, /*#__PURE__*/React.createElement("h2", null, "Your instructor"), /*#__PURE__*/React.createElement("div", {
    className: "cl-instructor-row"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.instructor.avatar,
    alt: course.instructor.name
  }), /*#__PURE__*/React.createElement("div", {
    className: "cl-instructor-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-instructor-name"
  }, course.instructor.name), /*#__PURE__*/React.createElement("div", {
    className: "cl-instructor-bio"
  }, course.instructorBio))));
}
function CLSide({
  course
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "cl-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-side-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-side-thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.bannerImage,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "cl-side-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-free"
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: "fluent:shield-checkmark-16-filled",
    size: 20,
    color: "var(--brand-navy)"
  }), "Free access"), /*#__PURE__*/React.createElement("div", {
    className: "cl-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cl-progress-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: course.progress + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "cl-progress-label"
  }, course.progress, "% complete")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cl-continue",
    onClick: continueCL
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: "fluent:play-16-filled",
    size: 18,
    color: "#fff"
  }), "Continue Learning"), /*#__PURE__*/React.createElement("div", {
    className: "cl-included"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-included-h"
  }, "What's included:"), course.included.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "cl-included-row",
    key: i
  }, /*#__PURE__*/React.createElement(IconCL, {
    name: it.icon,
    size: 19,
    color: "var(--brand-navy)"
  }), it.text))))), /*#__PURE__*/React.createElement("div", {
    className: "cl-ava-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-ava-head"
  }, /*#__PURE__*/React.createElement(SparkCL, {
    size: 20,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", null, "Ask Ava about this course")), /*#__PURE__*/React.createElement("p", {
    className: "cl-ava-desc"
  }, "Not sure if this is your next best step? Ava can tell you how it maps to your goal."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cl-ava-btn",
    onClick: () => goCL("Agent.html")
  }, "Ask Ava", /*#__PURE__*/React.createElement(IconCL, {
    name: "lucide:arrow-up-right",
    size: 16,
    color: "var(--brand-navy)"
  }))));
}
function CourseLandingApp() {
  const course = COURSE_CL;
  const [openSet, setOpenSet] = useStateCL(() => new Set(course.sections.map((s, i) => i).filter(i => course.sections[i].open)));
  const [query, setQuery] = useStateCL("");
  React.useEffect(() => {
    document.title = "PROfinity — " + course.title;
  }, []);
  function toggleSection(i) {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);else next.add(i);
      return next;
    });
  }
  function expandAll() {
    setOpenSet(prev => prev.size === course.sections.length ? new Set() : new Set(course.sections.map((_, i) => i)));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavCL, {
    active: "My Learning",
    user: ME_CL,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateCL,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "cl-page",
    "data-screen-label": "Course Landing (web)"
  }, /*#__PURE__*/React.createElement(CLCrumb, null), /*#__PURE__*/React.createElement("div", {
    className: "cl-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cl-main"
  }, /*#__PURE__*/React.createElement(CLHero, {
    course: course
  }), /*#__PURE__*/React.createElement(CLAbout, {
    course: course
  }), /*#__PURE__*/React.createElement(CLLearn, {
    course: course
  }), /*#__PURE__*/React.createElement(CLCurriculum, {
    course: course,
    openSet: openSet,
    onToggle: toggleSection,
    onExpandAll: expandAll,
    query: query,
    onQuery: setQuery
  }), /*#__PURE__*/React.createElement(CLInstructor, {
    course: course
  })), /*#__PURE__*/React.createElement(CLSide, {
    course: course
  }))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CourseLandingApp, null));
