/* ===========================================================================
   PROfinity — Course (web)
   Curriculum/overview page reached from "Continue learning" / "Start learning"
   on a My Learning course tile (MyLearning.html) via ?course=<slug>, or generic
   ?title=&instr=&pct=&price= for tiles that don't have bespoke content. Media
   hero + About/What you'll learn/Curriculum/Instructor/Discussion. Clicking a
   lesson or "Continue Learning" opens the dedicated LessonWeb.html video-player
   page, which shares this page's localStorage progress key. Mirrors the
   sibling course-landing-web.jsx (PROfinity Membership) layout. Suffixed -CW
   to avoid clashing with other page globals.
   =========================================================================== */
const {
  useState: useStateCW,
  useEffect: useEffectCW
} = React;
const DSCW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavCW,
  IconifyIcon: IconCW,
  LevelBadge: LevelBadgeCW,
  Spark: SparkCW
} = DSCW;
const ME_CW = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function goCW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateCW(label) {
  var u = {
    Home: "Newsfeed.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goCW(u);
}

/* ---------------------------------------------------------------- module completion progress -- */
function progressKeyCW(slug) {
  return "pf-lesson-progress-" + slug;
}
function loadProgressCW(slug) {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKeyCW(slug)));
    if (saved && Array.isArray(saved.completed)) return saved;
  } catch (e) {}
  return {
    completed: [],
    activeIdx: 0
  };
}
function saveProgressCW(slug, data) {
  try {
    localStorage.setItem(progressKeyCW(slug), JSON.stringify(data));
  } catch (e) {}
}

/* ---------------------------------------------------------------- shared bullets -- */
const SCREENING_BULLETS_CW = ["Take a comprehensive medical history (bleeding disorders, neuromuscular diseases, medications).", "Screen for contraindications (pregnancy, active infections, known hypersensitivities).", "Assess psychological readiness and set realistic expectations."];
const UPPER_LID_BULLETS_CW = ["Evaluate eyelid skin laxity and excess fat.", "Discuss surgical options (traditional vs. minimally invasive techniques).", "Ensure patient understands post-operative care and recovery."];
const DEFAULT_RESOURCES_CW = [{
  name: "Course Handbook.pdf",
  size: "2.3 MB",
  ext: "pdf"
}, {
  name: "Contraindications Screening Form.pdf",
  size: "268 KB",
  ext: "pdf"
}, {
  name: "Patient Consent Template.docx",
  size: "88 KB",
  ext: "doc"
}, {
  name: "Post-Treatment Care Sheet.pdf",
  size: "245 KB",
  ext: "pdf"
}];
const DEFAULT_COMMENTS_CW = [{
  name: "Sarah Jenkins",
  time: "2 hours ago",
  likes: 12,
  text: "I found the section on eye complications really informative. Does anyone have any tips for managing patient anxiety during the procedure?"
}, {
  name: "Dr. Michael Chen",
  time: "Yesterday",
  likes: 8,
  text: "Great module! I've been using the cognitive training tools with my patients and have seen a significant improvement in their focus during sessions."
}, {
  name: "Emily R.",
  time: "3 days ago",
  likes: 5,
  text: "Where can I find the downloadable course handbook mentioned in the overview? I couldn't locate it in the Resources tab."
}];
const DEFAULT_INCLUDED_CW = [{
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
}];
const INSTRUCTOR_CW = {
  name: "Dr Tim Pearce",
  role: "Clinical Director · PROfinity Academy",
  avatar: "assets/avatar-drtim.png",
  bio: "Medical Doctor · Leading Aesthetic Clinician & Educator · Clinical Director · Longevity Advocate"
};

/* ---------------------------------------------------------------- course data -- */
const COURSES_WEB = {
  "8d-lips": {
    slug: "8d-lips",
    title: "8D Lips",
    level: "Beginner",
    category: "Toxin & filler · Upper & lower face",
    bannerImage: "assets/clinic-treatment-collage.png",
    description: "Julie Bass Kaplan reveals her secrets for advanced upper-face, lower-face and neck technique — so you inject with confidence and protect your practice.",
    instructor: INSTRUCTOR_CW,
    aboutParas: ["We don't like to say this upgrade is mandatory, but we HIGHLY RECOMMEND it!", "If you're going to invest in mastering advanced toxin technique, you really need to learn how to manage potential eye complications so you can deliver the best results and protect your practice."],
    introParas: ["You will see a complete list of course modules below. Simply click to start your course.", "You can follow the course in any order, but will need to complete all modules in order to access your certificate. Please mark each module complete as you progress. Note, video modules need to be watched in full before they can be marked complete.", "You can access your downloadable course handbook and a variety of extra resources in the 'Course Downloads' tab."],
    learn: ["Identify, prevent and manage the most serious eye-related toxin complications with confidence.", "Take a comprehensive medical history and screen for contraindications before every treatment.", "Master linear threading, tenting and cannula techniques for lip filler injections.", "Evaluate eyelid skin laxity and choose between surgical and minimally invasive options.", "Conduct neurological assessment and manage blepharospasm with botulinum toxin.", "Use proven consultation scripts and consent templates to protect your practice."],
    duration: "2h 36m",
    points: 1000,
    resources: DEFAULT_RESOURCES_CW,
    comments: DEFAULT_COMMENTS_CW,
    included: DEFAULT_INCLUDED_CW,
    sections: [{
      title: "Module 1",
      lessons: [{
        name: "Diagnosis",
        kind: "video",
        desc: "How to diagnose, treat and most of all understand how to avoid Eyelid Ptosis from Botox treatment.",
        bullets: SCREENING_BULLETS_CW
      }, {
        name: "Brow Ptosis",
        kind: "video",
        desc: "How to Select Patients & Conduct Medical Screening",
        bullets: SCREENING_BULLETS_CW
      }]
    }, {
      title: "Module 2",
      lessons: [{
        name: "Welcome & how to use this module",
        kind: "video",
        dur: "2:10"
      }, {
        name: "Safety essentials (watch first)",
        kind: "video",
        dur: "6:48"
      }],
      subs: [{
        title: "Injection Techniques",
        lessons: [{
          name: "Linear threading technique",
          kind: "video",
          dur: "4:32"
        }, {
          name: "Tenting technique",
          kind: "video",
          dur: "3:58"
        }, {
          name: "Cannula approach",
          kind: "video",
          dur: "6:11"
        }]
      }, {
        title: "Case Studies",
        lessons: [{
          name: "Case 1: thin lips, first treatment",
          kind: "video",
          dur: "7:20"
        }, {
          name: "Case 2: correction of migrated filler",
          kind: "video",
          dur: "9:05"
        }]
      }, {
        title: "Downloads & Resources",
        lessons: [{
          name: "Technique recipe cards",
          kind: "pdf"
        }, {
          name: "Consent form templates",
          kind: "pdf"
        }]
      }],
      groupDesc: "Start with the two orientation lessons, then work through the sub-module folders in order."
    }, {
      title: "Module 3",
      lessons: [{
        name: "Upper Eyelid Lift",
        kind: "video",
        desc: "Indications and Surgical Techniques for Upper Eyelid Lift",
        bullets: UPPER_LID_BULLETS_CW
      }, {
        name: "Lower Eyelid Surgery",
        kind: "video",
        desc: "Approaches and Considerations for Lower Eyelid Surgery",
        bullets: ["Assess lower eyelid for signs of aging and fat herniation.", "Discuss risks and benefits of surgical versus non-surgical treatments.", "Prepare patient for realistic outcomes and duration of results."]
      }]
    }, {
      title: "Module 4",
      lessons: [{
        name: "Blepharospasm Treatment",
        kind: "video",
        desc: "Understanding Blepharospasm and Its Management",
        bullets: ["Conduct neurological assessments to confirm diagnosis.", "Explore treatment options including botulinum toxin injections.", "Educate patients on the potential for recurrent symptoms."]
      }]
    }, {
      title: "Bonus Module",
      lessons: [{
        name: "Bonus Module – Key Concepts",
        kind: "video"
      }]
    }, {
      title: "End of Success Path Quiz",
      lessons: [{
        name: "Botulinum Toxin Complications – End Of Course Quiz",
        kind: "quiz"
      }]
    }]
  }
};
function slugifyCW(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function buildGenericCourseWeb(params) {
  const title = params.get("title") || "Course";
  return {
    slug: slugifyCW(title),
    title: title,
    level: "All Levels",
    category: title + " · Course",
    bannerImage: "assets/clinic-lip-design.png",
    description: "Mastering this technique will help you deliver safer, more predictable results and protect your practice's reputation.",
    instructor: INSTRUCTOR_CW,
    aboutParas: ["We don't like to say this course is essential, but we HIGHLY RECOMMEND it!", "Mastering this technique will help you deliver safer, more predictable results and protect your practice's reputation."],
    introParas: ["You will see a complete list of course modules below. Simply click to start your course.", "You can follow the course in any order, but will need to complete all modules in order to access your certificate. Please mark each module complete as you progress."],
    learn: ["Build a step-by-step protocol you can use with confidence from your very next patient.", "Avoid the most common mistakes practitioners make when starting out with this technique."],
    duration: "45m",
    points: 1000,
    resources: DEFAULT_RESOURCES_CW,
    comments: DEFAULT_COMMENTS_CW,
    included: DEFAULT_INCLUDED_CW,
    sections: [{
      title: "Module 1",
      lessons: [{
        name: "Getting Started",
        kind: "video",
        desc: "Foundations you need before your first patient session.",
        bullets: SCREENING_BULLETS_CW
      }]
    }, {
      title: "End of Success Path Quiz",
      lessons: [{
        name: title + " – End Of Course Quiz",
        kind: "quiz"
      }]
    }]
  };
}
function getCourseWeb() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("course");
  if (slug && COURSES_WEB[slug]) return COURSES_WEB[slug];
  if (params.get("title")) return buildGenericCourseWeb(params);
  return COURSES_WEB["8d-lips"];
}
function lessonUrlCW(course, idx) {
  const params = new URLSearchParams();
  params.set(COURSES_WEB[course.slug] ? "course" : "title", COURSES_WEB[course.slug] ? course.slug : course.title);
  params.set("lesson", idx);
  return "LessonWeb.html?" + params.toString();
}

/* ---------------------------------------------------------------- flatten for progress tracking -- */
function flattenSectionsCW(course) {
  const flat = [];
  course.sections.forEach((sec, si) => {
    sec.lessons.forEach(l => {
      Object.assign(l, {
        sectionIndex: si,
        sectionTitle: sec.title,
        flatIdx: flat.length
      });
      flat.push(l);
    });
    (sec.subs || []).forEach(sub => {
      sub.lessons.forEach(l => {
        Object.assign(l, {
          sectionIndex: si,
          sectionTitle: sec.title,
          subTitle: sub.title,
          flatIdx: flat.length
        });
        flat.push(l);
      });
    });
  });
  return flat;
}
function sectionLessonCount(s) {
  const subCount = (s.subs || []).reduce((total, sub) => total + sub.lessons.length, 0);
  return s.lessons.length + subCount;
}

/* ---------------------------------------------------------------- crumb / hero -- */
function CWCrumb({
  course
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-crumb-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-back-btn",
    "aria-label": "Back to My Learning",
    onClick: () => goCW("MyLearning.html")
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:arrow-left",
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cw-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goCW("MyLearning.html")
  }, "My Learning"), " \xA0/\xA0 ", /*#__PURE__*/React.createElement("span", null, course.title)));
}
function CWMetaItem({
  m
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-meta-key"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: m.icon,
    size: 16,
    color: "var(--brand-navy)"
  }), m.key), /*#__PURE__*/React.createElement("span", {
    className: "cw-meta-val"
  }, m.value));
}
function CWHero({
  course,
  totalLessons,
  onPlay
}) {
  const meta = [{
    icon: "lucide:clock",
    key: "Duration",
    value: course.duration
  }, {
    icon: "lucide:layers",
    key: "Modules",
    value: course.sections.length + " modules"
  }, {
    icon: "lucide:play-circle",
    key: "Lessons",
    value: totalLessons + " lessons"
  }, {
    icon: "lucide:award",
    key: "Certificate",
    value: "Included"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-hero-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-hero-media"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.bannerImage,
    alt: course.title
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-play-btn",
    "aria-label": "Play course intro",
    onClick: onPlay
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "fluent:play-16-filled",
    size: 26,
    color: "var(--ai-purple)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cw-hero-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-badge-row"
  }, /*#__PURE__*/React.createElement(LevelBadgeCW, {
    level: course.level
  }), /*#__PURE__*/React.createElement("span", {
    className: "cw-category"
  }, course.category)), /*#__PURE__*/React.createElement("h1", {
    className: "cw-title"
  }, course.title), /*#__PURE__*/React.createElement("p", {
    className: "cw-sub"
  }, course.description), /*#__PURE__*/React.createElement("div", {
    className: "cw-instr-row"
  }, /*#__PURE__*/React.createElement("img", {
    className: "cw-instr-avatar",
    src: course.instructor.avatar,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "cw-instr-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-instr-name"
  }, course.instructor.name), /*#__PURE__*/React.createElement("span", {
    className: "cw-instr-role"
  }, course.instructor.role))), /*#__PURE__*/React.createElement("div", {
    className: "cw-meta-row"
  }, meta.map((m, i) => /*#__PURE__*/React.createElement(CWMetaItem, {
    m: m,
    key: i
  })))));
}
function CWAbout({
  course
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-about"
  }, /*#__PURE__*/React.createElement("h2", null, "About this course"), course.aboutParas.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, p)));
}
function CWLearn({
  course
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-learn"
  }, /*#__PURE__*/React.createElement("h2", null, "What you'll learn"), /*#__PURE__*/React.createElement("div", {
    className: "cw-learn-grid"
  }, course.learn.map((l, i) => /*#__PURE__*/React.createElement("div", {
    className: "cw-learn-item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-learn-tick"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:check",
    size: 13,
    color: "#fff"
  })), l))));
}

/* ---------------------------------------------------------------- curriculum -- */
function lessonIconCW(kind) {
  return kind === "pdf" ? "lucide:file-text" : kind === "quiz" ? "lucide:file-question" : "lucide:play-circle";
}
function lessonBadgeCW(l) {
  if (l.dur) return l.dur;
  return l.kind === "pdf" ? "PDF" : l.kind === "quiz" ? "Quiz" : "Video";
}
function CWLessonRow({
  lesson,
  isActive,
  isDone,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-lesson" + (isActive ? " active" : ""),
    onClick: onSelect
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: lessonIconCW(lesson.kind),
    size: 17,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cw-lesson-name"
  }, lesson.name), isDone && /*#__PURE__*/React.createElement("span", {
    className: "cw-lesson-done"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:check",
    size: 11,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cw-lesson-badge"
  }, lessonBadgeCW(lesson)));
}
function CWSubLessonRow({
  lesson,
  isActive,
  isDone,
  onSelect
}) {
  const pdf = lesson.kind === "pdf";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-sub-lesson" + (isActive ? " active" : ""),
    onClick: onSelect
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: pdf ? "lucide:file-text" : "lucide:play-circle",
    size: 15,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cw-sub-lesson-name"
  }, lesson.name), isDone && /*#__PURE__*/React.createElement("span", {
    className: "cw-sub-lesson-done"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:check",
    size: 10,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cw-sub-lesson-badge"
  }, lessonBadgeCW(lesson)));
}
function CWSubModule({
  sub,
  activeFlatIdx,
  completed,
  onSelect
}) {
  const [open, setOpen] = useStateCW(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-sub" + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-sub-hd",
    onClick: () => setOpen(v => !v),
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: open ? "lucide:folder-open" : "lucide:folder",
    size: 17,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cw-sub-title"
  }, sub.title), /*#__PURE__*/React.createElement("span", {
    className: "cw-sub-n"
  }, sub.lessons.length), /*#__PURE__*/React.createElement(IconCW, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 18,
    color: "var(--gray-450)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "cw-sub-body"
  }, sub.lessons.map(l => /*#__PURE__*/React.createElement(CWSubLessonRow, {
    lesson: l,
    key: l.flatIdx,
    isActive: l.flatIdx === activeFlatIdx,
    isDone: completed.has(l.flatIdx),
    onSelect: () => onSelect(l.flatIdx)
  }))));
}
function CWSection({
  section,
  index,
  open,
  activeFlatIdx,
  completed,
  onToggle,
  onSelect
}) {
  const count = sectionLessonCount(section);
  const hasBody = section.lessons.length > 0 || section.subs && section.subs.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-acc" + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-acc-hd",
    onClick: onToggle,
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-acc-chip"
  }, index + 1), /*#__PURE__*/React.createElement("span", {
    className: "cw-acc-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-acc-title"
  }, section.title), /*#__PURE__*/React.createElement("span", {
    className: "cw-acc-sub"
  }, count, " lesson", count === 1 ? "" : "s")), /*#__PURE__*/React.createElement(IconCW, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 20,
    color: "var(--gray-500)"
  })), open && hasBody && /*#__PURE__*/React.createElement("div", {
    className: "cw-acc-body"
  }, section.groupDesc && /*#__PURE__*/React.createElement("p", {
    className: "cw-card-desc",
    style: {
      margin: "0 0 4px",
      fontSize: 13.5,
      color: "var(--gray-500)"
    }
  }, section.groupDesc), section.lessons.map(l => /*#__PURE__*/React.createElement(CWLessonRow, {
    lesson: l,
    key: l.flatIdx,
    isActive: l.flatIdx === activeFlatIdx,
    isDone: completed.has(l.flatIdx),
    onSelect: () => onSelect(l.flatIdx)
  })), (section.subs || []).map((s, i) => /*#__PURE__*/React.createElement(CWSubModule, {
    sub: s,
    key: i,
    activeFlatIdx: activeFlatIdx,
    completed: completed,
    onSelect: onSelect
  }))));
}
function CWCurriculum({
  course,
  sectionsWithIdx,
  totalLessons,
  openSet,
  activeFlatIdx,
  completed,
  onToggle,
  onExpandAll,
  onSelect,
  query,
  onQuery
}) {
  const q = query.trim().toLowerCase();
  const matches = s => !q || s.title.toLowerCase().includes(q) || s.lessons.some(l => l.name.toLowerCase().includes(q)) || (s.subs || []).some(sub => sub.title.toLowerCase().includes(q) || sub.lessons.some(l => l.name.toLowerCase().includes(q)));
  const visible = sectionsWithIdx.filter(({
    s
  }) => matches(s));
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-curriculum"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-curr-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Curriculum"), /*#__PURE__*/React.createElement("div", {
    className: "cw-curr-sub"
  }, course.sections.length, " modules · ", totalLessons, " lessons")), /*#__PURE__*/React.createElement("div", {
    className: "cw-curr-tools"
  }, /*#__PURE__*/React.createElement("label", {
    className: "cw-search"
  }, /*#__PURE__*/React.createElement(IconCW, {
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
    className: "cw-expand-all",
    onClick: onExpandAll
  }, openSet.size === course.sections.length ? "Collapse all" : "Expand all"))), /*#__PURE__*/React.createElement("div", {
    className: "cw-sections"
  }, visible.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "cw-no-results"
  }, "No lessons match \"", query, "\"."), visible.map(({
    s,
    i
  }) => /*#__PURE__*/React.createElement(CWSection, {
    section: s,
    index: i,
    key: i,
    open: openSet.has(i) || !!q && s.title.toLowerCase().includes(q),
    activeFlatIdx: activeFlatIdx,
    completed: completed,
    onToggle: () => onToggle(i),
    onSelect: onSelect
  }))));
}
function CWInstructor({
  course
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-instructor"
  }, /*#__PURE__*/React.createElement("h2", null, "Your instructor"), /*#__PURE__*/React.createElement("div", {
    className: "cw-instructor-row"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.instructor.avatar,
    alt: course.instructor.name
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cw-instructor-name"
  }, course.instructor.name), /*#__PURE__*/React.createElement("div", {
    className: "cw-instructor-bio"
  }, course.instructor.bio))));
}

/* ---------------------------------------------------------------- discussion -- */
function CWCommentReply({
  r
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-reply"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-avatar small"
  }, r.name.slice(0, 1)), /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-cmt-name"
  }, r.name), /*#__PURE__*/React.createElement("span", {
    className: "cw-cmt-time"
  }, r.time)), /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-text"
  }, r.text)));
}
function CWComment({
  c,
  onToggleLike,
  onReply
}) {
  const [replying, setReplying] = useStateCW(false);
  const [draft, setDraft] = useStateCW("");
  function submitReply() {
    if (!draft.trim()) return;
    onReply(draft.trim());
    setDraft("");
    setReplying(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-avatar"
  }, c.name.slice(0, 1)), /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-cmt-name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "cw-cmt-time"
  }, c.time)), /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-text"
  }, c.text), /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-cmt-like" + (c.liked ? " liked" : ""),
    onClick: onToggleLike
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: c.liked ? "fluent:thumb-like-16-filled" : "lucide:thumbs-up",
    size: 14,
    color: c.liked ? "var(--brand-navy)" : "var(--gray-450)"
  }), c.likes), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-cmt-reply-btn",
    onClick: () => setReplying(r => !r)
  }, "Reply")), c.replies && c.replies.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-replies"
  }, c.replies.map((r, i) => /*#__PURE__*/React.createElement(CWCommentReply, {
    r: r,
    key: i
  }))), replying && /*#__PURE__*/React.createElement("div", {
    className: "cw-reply-composer"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: `Reply to ${c.name}…`,
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => e.key === "Enter" && submitReply(),
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: submitReply
  }, "Post"))));
}
function CWDiscussion({
  comments,
  onAdd,
  onToggleLike,
  onReply
}) {
  const [draft, setDraft] = useStateCW("");
  function submit() {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-discussion"
  }, /*#__PURE__*/React.createElement("h2", null, "Discussion"), /*#__PURE__*/React.createElement("div", {
    className: "cw-composer"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:message-circle",
    size: 18,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Ask a question or leave a comment…",
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => e.key === "Enter" && submit()
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-composer-post",
    onClick: submit
  }, "Post")), /*#__PURE__*/React.createElement("div", {
    className: "cw-cmt-list"
  }, comments.map((c, i) => /*#__PURE__*/React.createElement(CWComment, {
    c: c,
    key: i,
    onToggleLike: () => onToggleLike(i),
    onReply: text => onReply(i, text)
  }))));
}

/* ---------------------------------------------------------------- sidebar -- */
function CWSide({
  course,
  pct,
  onContinue
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "cw-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-side-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-side-thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.bannerImage,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "cw-side-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-free"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "fluent:shield-checkmark-16-filled",
    size: 20,
    color: "var(--brand-navy)"
  }), "Free access"), /*#__PURE__*/React.createElement("div", {
    className: "cw-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-progress-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "cw-progress-label"
  }, pct, "% complete")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-continue",
    onClick: onContinue
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "fluent:play-16-filled",
    size: 18,
    color: "#fff"
  }), "Continue Learning"), /*#__PURE__*/React.createElement("div", {
    className: "cw-included"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-included-h"
  }, "What's included:"), course.included.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "cw-included-row",
    key: i
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: it.icon,
    size: 19,
    color: "var(--brand-navy)"
  }), it.text))))), /*#__PURE__*/React.createElement("div", {
    className: "cw-ava-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-ava-head"
  }, /*#__PURE__*/React.createElement(SparkCW, {
    size: 20,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", null, "Ask Ava about this course")), /*#__PURE__*/React.createElement("p", {
    className: "cw-ava-desc"
  }, "Not sure if this is your next best step? Ava can tell you how it maps to your goal."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-ava-btn",
    onClick: () => goCW("Agent.html")
  }, "Ask Ava", /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:arrow-up-right",
    size: 16,
    color: "var(--brand-navy)"
  }))));
}

/* ---------------------------------------------------------------- app -- */
function CourseWebApp() {
  const course = getCourseWeb();
  const flat = flattenSectionsCW(course);
  const totalItems = flat.length;
  const initialProgress = loadProgressCW(course.slug);
  const activeIdx = Math.min(initialProgress.activeIdx || 0, totalItems - 1);
  const [completed] = useStateCW(new Set(initialProgress.completed || []));
  const [openSet, setOpenSet] = useStateCW(() => new Set([0]));
  const [query, setQuery] = useStateCW("");
  const [comments, setComments] = useStateCW(() => course.comments.map(c => ({
    ...c,
    liked: false,
    replies: []
  })));
  useEffectCW(() => {
    document.title = "PROfinity — " + course.title;
  }, []);
  function handleSelectLesson(idx) {
    goCW(lessonUrlCW(course, idx));
  }
  function handleContinue() {
    const resumeIdx = flat.findIndex((_, i) => !completed.has(i));
    handleSelectLesson(resumeIdx === -1 ? 0 : resumeIdx);
  }
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
  function handleAddComment(text) {
    setComments(all => [{
      name: ME_CW.name,
      time: "Just now",
      likes: 0,
      liked: false,
      text,
      replies: []
    }, ...all]);
  }
  function handleToggleLike(i) {
    setComments(all => all.map((c, idx) => idx === i ? {
      ...c,
      liked: !c.liked,
      likes: c.likes + (c.liked ? -1 : 1)
    } : c));
  }
  function handleReply(i, text) {
    setComments(all => all.map((c, idx) => idx === i ? {
      ...c,
      replies: [...c.replies, {
        name: ME_CW.name,
        time: "Just now",
        text
      }]
    } : c));
  }
  const pct = totalItems ? Math.round(completed.size / totalItems * 100) : 0;
  const sectionsWithIdx = course.sections.map((s, i) => ({
    s,
    i
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavCW, {
    active: "My Learning",
    user: ME_CW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateCW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "cw-page",
    "data-screen-label": "Course (web)"
  }, /*#__PURE__*/React.createElement(CWCrumb, {
    course: course
  }), /*#__PURE__*/React.createElement("div", {
    className: "cw-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-main"
  }, /*#__PURE__*/React.createElement(CWHero, {
    course: course,
    totalLessons: totalItems,
    onPlay: handleContinue
  }), /*#__PURE__*/React.createElement(CWAbout, {
    course: course
  }), /*#__PURE__*/React.createElement(CWLearn, {
    course: course
  }), /*#__PURE__*/React.createElement(CWCurriculum, {
    course: course,
    sectionsWithIdx: sectionsWithIdx,
    totalLessons: totalItems,
    openSet: openSet,
    activeFlatIdx: activeIdx,
    completed: completed,
    onToggle: toggleSection,
    onExpandAll: expandAll,
    onSelect: handleSelectLesson,
    query: query,
    onQuery: setQuery
  }), /*#__PURE__*/React.createElement(CWInstructor, {
    course: course
  }), /*#__PURE__*/React.createElement(CWDiscussion, {
    comments: comments,
    onAdd: handleAddComment,
    onToggleLike: handleToggleLike,
    onReply: handleReply
  })), /*#__PURE__*/React.createElement(CWSide, {
    course: course,
    pct: pct,
    onContinue: handleContinue
  }))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CourseWebApp, null));
