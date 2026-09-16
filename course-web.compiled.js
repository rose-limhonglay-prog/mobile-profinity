/* ===========================================================================
   PROfinity — Course (web)
   Desktop port of the mobile course reader (lesson-confidence.jsx →
   CourseDetail.html): the same course trees, monetisation, progress,
   resources, related courses, comments, Ava card and share sheet in a
   two-column desktop layout, plus the web-only strengths (breadcrumb,
   curriculum search, expand/collapse all, instructor, What's included).

   URL contract (every My Learning web page links here via PFLearn.courseUrl):
     ?course=<slug>                          bespoke tree (8d-lip-design, toxin-battle; 8d-lips is an alias)
     ?course=<slug>&title=&price=&dur=&instr= generic course built from its title
     ?title=&instr=&pct=                     legacy generic shape (no slug)
     &level=&module=&lesson=[&sub=]          pre-select a lesson (mobile shape)
     &play=1                                 open the lesson player (LessonWeb.html) straight away
     &share=1                                open the Share lesson modal

   Data + helpers come from course-data-web.js (window.PFCourseData); tier,
   purchases, completion (pf-lessons-done, shared with the phone) and URLs from
   learning-store-web.js (window.PFLearn). The lesson player is LessonWeb.html
   (lesson-web.jsx). Suffixed -CW because every page script shares one scope.
   =========================================================================== */
const {
  useState: useStateCW,
  useEffect: useEffectCW,
  useRef: useRefCW,
  useMemo: useMemoCW
} = React;
const DSCW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavCW,
  IconifyIcon: IconCW,
  Avatar: AvatarCW
} = DSCW;
const CD = window.PFCourseData;
const PFL = window.PFLearn;
const ME_CW = {
  name: CD.ME.fullName,
  role: CD.ME.role,
  avatar: CD.ME.avatar
};
const CW_PARAMS = new URLSearchParams(window.location.search);
function goCW(url) {
  CD.go(url);
}
/* Member → profile links (profile-link.js); inert pass-through if the script is absent. */
const ProfileLinkCW = window.PFProfileLink && window.PFProfileLink.Link || function ({
  children
}) {
  return children;
};
function openProfileCW(a) {
  return !!(window.PFProfileLink && window.PFProfileLink.open(a));
}
function navigateCW(label) {
  const u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": PFL.myLearningUrl,
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goCW(u);
}

/* gold ink for DS icons — AA-safe on the light page, raw gold in dark mode */
const INK_CW = {
  gold: "var(--cd-gold)",
  text: "var(--cd-text)",
  muted: "var(--cd-text-3)",
  success: "var(--cd-success)",
  onNavy: "#FFFFFF",
  onGold: "var(--cd-on-gold)",
  heading: "var(--cd-heading)"
};
const CW_COURSE = CD.resolveCourse(CW_PARAMS);

/* "2:10" + "6:48" … → "1h 40m" for the meta row when the URL carries no ?dur= */
function totalDurationCW(flat) {
  let secs = 0;
  flat.forEach(l => {
    const m = /^(\d+):(\d\d)$/.exec(l.dur || "");
    if (m) secs += Number(m[1]) * 60 + Number(m[2]);
  });
  if (!secs) return null;
  const mins = Math.round(secs / 60);
  return mins >= 60 ? Math.floor(mins / 60) + "h " + (mins % 60 ? mins % 60 + "m" : "") : mins + "m";
}

/* ---------------------------------------------------------------- crumb -- */
function CWCrumb({
  course
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-crumb-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-back-btn",
    "aria-label": "Back to My Learning",
    onClick: () => goCW(PFL.myLearningUrl)
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:arrow-left",
    size: 19,
    color: INK_CW.heading
  })), /*#__PURE__*/React.createElement("span", {
    className: "cw-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goCW(PFL.myLearningUrl)
  }, "My Learning"), " \xA0/\xA0 ", /*#__PURE__*/React.createElement("span", null, course.title)));
}

/* ---------------------------------------------------------------- hero -- */
function CWHero({
  course,
  item,
  content,
  locked,
  started,
  curDone,
  next,
  onOpen,
  onContinue,
  onShare,
  onBuy,
  total
}) {
  const fill = Math.round(item.groupPos / item.groupTotal * 100);
  const kindIcon = item.kind === "pdf" ? "lucide:file-text" : item.kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled";
  const continueLabel = !next ? curDone ? "Course complete" : "Finish course" : started ? "Continue learning" : "Start learning";
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-hero-card",
    "data-screen-label": "Hero"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-still" + (locked ? " locked" : ""),
    onClick: onOpen,
    "aria-label": locked ? "Buy this course to play " + item.name : (item.kind === "pdf" ? "Open " : item.kind === "quiz" ? "Start " : "Play ") + item.name
  }, /*#__PURE__*/React.createElement("img", {
    src: course.still,
    alt: ""
  }), !locked && /*#__PURE__*/React.createElement("span", {
    className: "cw-still-play" + (item.kind ? " doc" : ""),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: kindIcon,
    size: 26,
    color: "#0B1024"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cw-still-dur",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: item.kind === "pdf" ? "lucide:file-text" : "lucide:clock",
    size: 12,
    color: "#fff"
  }), item.dur), locked && /*#__PURE__*/React.createElement("span", {
    className: "cw-still-lock",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:lock",
    size: 14,
    color: "#fff"
  }), "Paid course · £", course.price)), /*#__PURE__*/React.createElement("div", {
    className: "cw-hero-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-eyebrow"
  }, CD.eyebrow(item, course)), /*#__PURE__*/React.createElement("h1", {
    className: "cw-title"
  }, item.name), !locked && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cw-prog-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-prog-label"
  }, "Lesson progress"), /*#__PURE__*/React.createElement("span", {
    className: "cw-prog-count"
  }, item.groupPos, " of ", item.groupTotal)), /*#__PURE__*/React.createElement("div", {
    className: "cd-track",
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": item.groupTotal,
    "aria-valuenow": item.groupPos,
    "aria-label": "Lesson progress"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: fill + "%"
    }
  }))), /*#__PURE__*/React.createElement("p", {
    className: "cw-intro"
  }, content.intro), locked ? /*#__PURE__*/React.createElement(CWPaywall, {
    course: course,
    total: total,
    onBuy: onBuy
  }) : /*#__PURE__*/React.createElement("div", {
    className: "cw-ctas",
    "data-screen-label": "CTAs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-fill",
    onClick: onContinue,
    disabled: !next && curDone
  }, continueLabel, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:arrow-right",
    size: 17,
    color: INK_CW.onNavy
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-outline",
    onClick: onShare
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:share-2",
    size: 17,
    color: INK_CW.heading
  }), "Share lesson"))));
}

/* Shown on a paid course that hasn't been bought: what's inside, the price, and the one way in. */
function CWPaywall({
  course,
  total,
  onBuy
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cd-paywall",
    "data-screen-label": "Paid course"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-paywall-ic"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:lock",
    size: 20,
    color: INK_CW.gold
  })), /*#__PURE__*/React.createElement("div", {
    className: "cd-paywall-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-eyebrow"
  }, "Paid course"), /*#__PURE__*/React.createElement("h3", {
    className: "cd-paywall-title"
  }, "Buy to start this course"), /*#__PURE__*/React.createElement("p", {
    className: "cd-paywall-body"
  }, "Browse every level, module and lesson below. Buy the course to start the lessons, download the resources and take the success path quiz."), /*#__PURE__*/React.createElement("ul", {
    className: "cd-paywall-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:check",
    size: 14,
    color: INK_CW.gold,
    strokeWidth: 2.5
  }), total, " lessons across ", course.levels.filter(l => !l.quiz).length, " levels"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:check",
    size: 14,
    color: INK_CW.gold,
    strokeWidth: 2.5
  }), "One-time payment · lifetime access"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:check",
    size: 14,
    color: INK_CW.gold,
    strokeWidth: 2.5
  }), "Certificate on completion")), /*#__PURE__*/React.createElement("div", {
    className: "cd-paywall-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-paywall-price"
  }, /*#__PURE__*/React.createElement("small", null, "One-time"), "£", course.price), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-gold",
    onClick: onBuy
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:shopping-bag",
    size: 16,
    color: INK_CW.onGold
  }), "Buy course"))));
}

/* ---------------------------------------------------------------- In this lesson -- */
function CWInThisLesson({
  content
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-pad",
    "data-screen-label": "In this lesson"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec"
  }, /*#__PURE__*/React.createElement("h2", null, "In this lesson")), /*#__PURE__*/React.createElement("p", {
    className: "cd-body"
  }, content.body), /*#__PURE__*/React.createElement("ul", {
    className: "cd-points"
  }, content.points.map((p, i) => /*#__PURE__*/React.createElement("li", {
    className: "cd-point",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:check",
    size: 14,
    color: INK_CW.gold,
    strokeWidth: 2.5
  })), /*#__PURE__*/React.createElement("span", null, p)))));
}

/* ---------------------------------------------------------------- course content -- */
function CWMarker({
  done,
  kind,
  locked
}) {
  if (done) return /*#__PURE__*/React.createElement("span", {
    className: "cd-marker done"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:check",
    size: 15,
    color: INK_CW.success,
    strokeWidth: 2.5
  }));
  if (locked) return /*#__PURE__*/React.createElement("span", {
    className: "cd-marker lock"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:lock",
    size: 13,
    color: INK_CW.muted
  }));
  const icon = kind === "pdf" ? "lucide:file-text" : kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled";
  return /*#__PURE__*/React.createElement("span", {
    className: "cd-marker"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: icon,
    size: 13,
    color: INK_CW.gold
  }));
}
function CWLessonRow({
  lesson,
  done,
  current,
  locked,
  onSelect,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-lesson" + (done ? " done" : "") + (current ? " on" : "") + (locked ? " locked" : ""),
    "aria-current": current ? "true" : undefined,
    onClick: onSelect,
    title: locked ? "Buy this course to start its lessons" : "Select lesson"
  }, /*#__PURE__*/React.createElement(CWMarker, {
    done: done,
    kind: lesson.kind,
    locked: locked && !done
  }), /*#__PURE__*/React.createElement("span", {
    className: "cd-lesson-name"
  }, lesson.name), /*#__PURE__*/React.createElement("span", {
    className: "cd-lesson-dur"
  }, lesson.dur), !locked && /*#__PURE__*/React.createElement("span", {
    className: "cd-lesson-open",
    role: "button",
    "aria-label": "Open " + lesson.name,
    title: "Open lesson",
    onClick: e => {
      e.stopPropagation();
      onOpen();
    }
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:arrow-up-right",
    size: 16,
    color: INK_CW.gold
  })));
}
function CWSubModule({
  sub,
  done,
  currentName,
  locked,
  forceOpen,
  onSelect,
  onOpen
}) {
  const [open, setOpen] = useStateCW(!!sub.open);
  const isOpen = forceOpen || open;
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-sub"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-sub-hd",
    "aria-expanded": isOpen,
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: isOpen ? "lucide:folder-open" : "lucide:folder",
    size: 19,
    color: INK_CW.gold
  }), /*#__PURE__*/React.createElement("span", {
    className: "cd-sub-name"
  }, sub.name), /*#__PURE__*/React.createElement("span", {
    className: "cd-sub-n"
  }, sub.lessons.length), /*#__PURE__*/React.createElement(IconCW, {
    name: isOpen ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 18,
    color: INK_CW.muted
  })), isOpen && /*#__PURE__*/React.createElement("div", {
    className: "cd-sub-body"
  }, sub.lessons.map(l => /*#__PURE__*/React.createElement(CWLessonRow, {
    key: l.name,
    lesson: l,
    done: done.indexOf(l.name) !== -1,
    current: currentName === l.name,
    locked: locked,
    onSelect: () => onSelect(l.name),
    onOpen: () => onOpen(l.name)
  }))));
}
function CWSection({
  section,
  done,
  currentName,
  locked,
  forceOpen,
  onSelect,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-section-name"
  }, section.name), section.free && !locked && /*#__PURE__*/React.createElement("span", {
    className: "cd-tag"
  }, "Free"), locked && /*#__PURE__*/React.createElement("span", {
    className: "cd-tag paid"
  }, "Paid")), /*#__PURE__*/React.createElement("p", {
    className: "cd-section-desc"
  }, section.desc), section.bullets && section.bullets.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "cd-bullets"
  }, section.bullets.map((b, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, b))), section.lessons && section.lessons.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cd-lessons"
  }, section.lessons.map(l => /*#__PURE__*/React.createElement(CWLessonRow, {
    key: l.name,
    lesson: l,
    done: done.indexOf(l.name) !== -1,
    current: currentName === l.name,
    locked: locked,
    onSelect: () => onSelect(l.name),
    onOpen: () => onOpen(l.name)
  }))), (section.subs || []).map(s => /*#__PURE__*/React.createElement(CWSubModule, {
    key: s.name,
    sub: s,
    done: done,
    currentName: currentName,
    locked: locked,
    forceOpen: forceOpen,
    onSelect: onSelect,
    onOpen: onOpen
  })));
}
function CWLevel({
  level,
  fullLevel,
  open,
  onToggle,
  done,
  currentName,
  locked,
  forceOpen,
  onSelect,
  onOpen
}) {
  const pct = CD.pct(CD.levelLessonNames(fullLevel), done);
  const empty = !level.sections || level.sections.length === 0;
  const isOpen = forceOpen || open;
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-level"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-level-hd",
    "aria-expanded": isOpen,
    onClick: onToggle
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-level-name"
  }, !level.quiz && level.name && /*#__PURE__*/React.createElement("small", null, level.title), level.quiz || !level.name ? level.title : level.name), /*#__PURE__*/React.createElement("span", {
    className: "cd-level-pct"
  }, pct, "%"), /*#__PURE__*/React.createElement(IconCW, {
    name: isOpen ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 20,
    color: "#FFFFFF"
  })), isOpen && (empty ? /*#__PURE__*/React.createElement("div", {
    className: "cd-unlock"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:lock",
    size: 16,
    color: INK_CW.muted
  })), /*#__PURE__*/React.createElement("span", null, level.unlock || "Unlocks when you complete the previous level.")) : /*#__PURE__*/React.createElement("div", {
    className: "cd-level-body"
  }, level.sections.map(s => /*#__PURE__*/React.createElement(CWSection, {
    key: s.name,
    section: s,
    done: done,
    currentName: currentName,
    locked: locked,
    forceOpen: forceOpen,
    onSelect: onSelect,
    onOpen: onOpen
  })))));
}

/* Search filter: keep levels / sections / sub-modules that hold a matching
   lesson (or match by name themselves); locked "Unlocks when…" levels drop out. */
function filterCourseCW(course, q) {
  const hit = s => (s || "").toLowerCase().includes(q);
  const levels = course.levels.map(lvl => {
    const sections = (lvl.sections || []).map(sec => {
      const secHit = hit(sec.name);
      const lessons = sec.lessons.filter(l => secHit || hit(l.name));
      const subs = (sec.subs || []).map(sub => {
        const subHit = secHit || hit(sub.name);
        return {
          ...sub,
          lessons: sub.lessons.filter(l => subHit || hit(l.name))
        };
      }).filter(sub => sub.lessons.length);
      return lessons.length || subs.length ? {
        ...sec,
        lessons,
        subs
      } : null;
    }).filter(Boolean);
    return sections.length || (hit(lvl.name) || hit(lvl.title)) && (lvl.sections || []).length ? {
      ...lvl,
      sections: sections.length ? sections : lvl.sections
    } : null;
  }).filter(Boolean);
  return {
    ...course,
    levels
  };
}
function CWCourseContent({
  course,
  flat,
  done,
  currentName,
  locked,
  onSelect,
  onOpen
}) {
  const [query, setQuery] = useStateCW("");
  const [openSet, setOpenSet] = useStateCW(() => new Set(course.levels.map((l, i) => l.open ? i : -1).filter(i => i !== -1)));
  const q = query.trim().toLowerCase();
  const view = q ? filterCourseCW(course, q) : course;
  const doneCount = done.filter(n => flat.some(l => l.name === n)).length;
  const total = flat.length;
  const allOpen = openSet.size === course.levels.length;
  const toggle = i => setOpenSet(prev => {
    const n = new Set(prev);
    if (n.has(i)) n.delete(i);else n.add(i);
    return n;
  });
  const expandAll = () => setOpenSet(allOpen ? new Set() : new Set(course.levels.map((_, i) => i)));
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-pad",
    "data-screen-label": "Course content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-curr-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec",
    style: {
      margin: 0,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("h2", null, "Course content"), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, locked ? total + " lessons · buy to start" : doneCount + " of " + total + " completed")), /*#__PURE__*/React.createElement("div", {
    className: "cw-curr-tools"
  }, /*#__PURE__*/React.createElement("label", {
    className: "cw-search"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:search",
    size: 17,
    color: INK_CW.muted
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search lessons…",
    "aria-label": "Search lessons",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cw-expand-all",
    onClick: expandAll
  }, allOpen ? "Collapse all" : "Expand all"))), /*#__PURE__*/React.createElement("div", {
    className: "cd-levels"
  }, view.levels.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "cw-no-results"
  }, "No lessons match \"", query, "\"."), view.levels.map(lvl => {
    const i = course.levels.indexOf(course.levels.find(x => x.title === lvl.title));
    return /*#__PURE__*/React.createElement(CWLevel, {
      key: lvl.title,
      level: lvl,
      fullLevel: course.levels[i],
      open: openSet.has(i),
      onToggle: () => toggle(i),
      forceOpen: !!q,
      done: done,
      currentName: currentName,
      locked: locked,
      onSelect: onSelect,
      onOpen: onOpen
    });
  })));
}

/* ---------------------------------------------------------------- resources / related / instructor -- */
function CWResources({
  onToast,
  locked,
  onLocked
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-pad",
    "data-screen-label": "Resources"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec"
  }, /*#__PURE__*/React.createElement("h2", null, "Resources"), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, CD.RESOURCES.length, " downloads")), /*#__PURE__*/React.createElement("div", {
    className: "cd-res-list"
  }, CD.RESOURCES.map(r => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-res",
    key: r.name,
    onClick: () => locked ? onLocked() : onToast("Downloading " + r.name)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-res-ic"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:file-text",
    size: 20,
    color: INK_CW.gold
  })), /*#__PURE__*/React.createElement("span", {
    className: "cd-res-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-res-name"
  }, r.name), /*#__PURE__*/React.createElement("span", {
    className: "cd-res-meta"
  }, "PDF · ", r.size)), /*#__PURE__*/React.createElement("span", {
    className: "cd-res-dl"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: locked ? "lucide:lock" : "lucide:download",
    size: 16,
    color: locked ? INK_CW.muted : INK_CW.text
  }))))));
}
function CWRelated({
  course
}) {
  const related = CD.RELATED.filter(c => PFL.slugify(c.title) !== course.slug);
  if (!related.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-pad",
    "data-screen-label": "Related courses"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec"
  }, /*#__PURE__*/React.createElement("h2", null, "Related courses")), /*#__PURE__*/React.createElement("div", {
    className: "cd-related"
  }, related.map(c => {
    const included = PFL.included(PFL.slugify(c.title));
    const price = included ? 0 : c.price;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cd-course",
      key: c.title,
      onClick: () => goCW(CD.relatedUrl(c, price))
    }, /*#__PURE__*/React.createElement("span", {
      className: "cd-course-thumb"
    }, /*#__PURE__*/React.createElement("img", {
      src: c.image,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", {
      className: "cd-course-chip"
    }, c.lessons, " lessons")), /*#__PURE__*/React.createElement("span", {
      className: "cd-course-tx"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cd-course-eyebrow"
    }, included ? "Included in your membership" : price ? "Paid course" : "Course"), /*#__PURE__*/React.createElement("span", {
      className: "cd-course-title"
    }, c.title), price > 0 && /*#__PURE__*/React.createElement("span", {
      className: "cd-course-price"
    }, /*#__PURE__*/React.createElement(IconCW, {
      name: "lucide:lock",
      size: 11,
      color: INK_CW.gold
    }), "£", price)), /*#__PURE__*/React.createElement("span", {
      className: "cd-course-arrow",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(IconCW, {
      name: "lucide:arrow-right",
      size: 18,
      color: INK_CW.onGold
    })));
  })));
}
function CWInstructor() {
  const t = CD.INSTRUCTOR;
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-pad cw-instructor",
    "data-screen-label": "Instructor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec"
  }, /*#__PURE__*/React.createElement("h2", null, "Your instructor")), /*#__PURE__*/React.createElement("div", {
    className: "cw-instructor-row"
  }, /*#__PURE__*/React.createElement("img", {
    src: t.avatar,
    alt: t.name
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cw-instructor-name"
  }, t.name), /*#__PURE__*/React.createElement("div", {
    className: "cw-instructor-role"
  }, t.role), /*#__PURE__*/React.createElement("div", {
    className: "cw-instructor-bio"
  }, t.bio))));
}

/* ---------------------------------------------------------------- comments -- */
/* Render "@Name" mentions in comment text in gold. */
function CWCommentText({
  text
}) {
  const parts = text.split(/(@[A-Za-z.]+(?: [A-Z][A-Za-z.]+)?)/g);
  return /*#__PURE__*/React.createElement("p", {
    className: "cd-cmt-text"
  }, parts.map((p, i) => p.charAt(0) === "@" ? /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "cd-cmt-mention"
  }, p) : p));
}
function CWComment({
  c,
  onLike,
  onReply
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-cmt"
  }, /*#__PURE__*/React.createElement(ProfileLinkCW, {
    author: c.author,
    className: "pf-prof-av"
  }, /*#__PURE__*/React.createElement(AvatarCW, {
    name: c.author.name,
    src: c.author.avatar,
    size: 38
  })), /*#__PURE__*/React.createElement("div", {
    className: "cd-cmt-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-cmt-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-cmt-name"
  }, /*#__PURE__*/React.createElement(ProfileLinkCW, {
    author: c.author,
    className: "pf-prof-nm"
  }, c.author.name)), /*#__PURE__*/React.createElement("span", {
    className: "cd-cmt-time"
  }, c.time)), /*#__PURE__*/React.createElement(CWCommentText, {
    text: c.text
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-cmt-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-cmt-act" + (c.liked ? " on" : ""),
    "aria-pressed": !!c.liked,
    onClick: onLike
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:heart",
    size: 15,
    color: c.liked ? INK_CW.gold : INK_CW.muted
  }), "Like", c.likes ? ` · ${c.likes}` : ""), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-cmt-act",
    onClick: onReply
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:message-circle",
    size: 15,
    color: INK_CW.muted
  }), "Reply"))));
}
let _cwseq = 0;
function CWComments({
  lessonName,
  courseSlug
}) {
  const [comments, setComments] = useStateCW(() => CD.DEFAULT_COMMENTS.map(c => ({
    ...c,
    _id: "cw" + _cwseq++
  })));
  const [draft, setDraft] = useStateCW("");
  const inputRef = useRefCW(null);
  const me = {
    name: CD.ME.name,
    avatar: CD.ME.avatar
  };
  /* First comment asks "Share this comment?" (shared prompt, window.PFCommentShare);
     after "Remember my decision" the saved choice is applied silently. */
  const prompt = window.PFCommentShare.useSharePrompt((text, share) => {
    setComments(all => [{
      author: me,
      time: "Just now",
      text,
      likes: 0,
      liked: false,
      sharedToNewsfeed: share,
      _id: "cw" + _cwseq++
    }, ...all]);
    if (share) window.PFCommentShare.shareToNewsfeed({
      author: me,
      courseSlug,
      text
    });
  }, {
    variant: "dialog"
  });
  const like = id => setComments(all => all.map(c => c._id === id ? {
    ...c,
    liked: !c.liked,
    likes: (c.likes || 0) + (c.liked ? -1 : 1)
  } : c));
  const reply = c => {
    setDraft("@" + c.author.name + " ");
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
    }
  };
  const post = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    prompt.submit(text);
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "cw-card cw-pad",
    "data-screen-label": "Comments"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec"
  }, /*#__PURE__*/React.createElement("h2", null, comments.length, " Comment", comments.length === 1 ? "" : "s")), /*#__PURE__*/React.createElement("form", {
    className: "cd-composer",
    onSubmit: e => {
      e.preventDefault();
      post();
    }
  }, /*#__PURE__*/React.createElement(AvatarCW, {
    name: CD.ME.name,
    src: CD.ME.avatar,
    size: 34
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: draft,
    onChange: e => setDraft(e.target.value),
    placeholder: "Comment on " + lessonName + "…",
    "aria-label": "Write a comment"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "cd-send",
    "aria-label": "Post comment",
    disabled: !draft.trim()
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:send",
    size: 17,
    color: INK_CW.onNavy
  }))), /*#__PURE__*/React.createElement(window.PFCommentShare.Note, {
    className: "cd-composer-note"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-cmts"
  }, comments.map(c => /*#__PURE__*/React.createElement(CWComment, {
    key: c._id,
    c: c,
    onLike: () => like(c._id),
    onReply: () => reply(c)
  }))), prompt.modal);
}

/* ---------------------------------------------------------------- Ava -- */
function CWAvaCard({
  lessonName,
  courseTitle
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cd-ava stack",
    "data-screen-label": "Talk this through with Ava"
  }, /*#__PURE__*/React.createElement("span", {
    className: "orb"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:sparkles",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "Talk this through with Ava"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Stuck on a landmark or unsure how this applies to your patients? Ava knows where you are in the course."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-coach-link",
    "data-coach": `I'm on the lesson "${lessonName}" in ${courseTitle}. Quiz me on the key points and tell me what to practise next.`
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:sparkles",
    size: 14,
    color: "#fff"
  }), "Ask Ava")));
}

/* ---------------------------------------------------------------- share modal -- */
function CWShareModal({
  item,
  course,
  url,
  onClose,
  onDone
}) {
  useEffectCW(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const title = item.name + " · " + course.title;
  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: "Take a look at this lesson on PROfinity",
        url
      }).catch(() => {});
      onDone("");
      return;
    }
    CD.copyText(url);
    onDone("Lesson link copied");
  };
  const tiles = [{
    k: "copy",
    label: "Copy link",
    icon: "lucide:link",
    run: () => {
      CD.copyText(url);
      onDone("Lesson link copied");
    }
  }, {
    k: "feed",
    label: "Newsfeed",
    icon: "lucide:newspaper",
    run: () => onDone("Shared to your newsfeed")
  }, {
    k: "dm",
    label: "Messages",
    icon: "lucide:message-circle",
    run: () => goCW("Messages.html")
  }, {
    k: "more",
    label: "More",
    icon: "lucide:more-horizontal",
    run: shareNative
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-share",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Share lesson",
    "data-screen-label": "Share lesson"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-share-hd"
  }, /*#__PURE__*/React.createElement("h3", null, "Share lesson"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:x",
    size: 18,
    color: INK_CW.text
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-prev"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.still,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-prev-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-share-prev-eyebrow"
  }, CD.eyebrow(item, course)), /*#__PURE__*/React.createElement("span", {
    className: "cd-share-prev-name"
  }, item.name), /*#__PURE__*/React.createElement("span", {
    className: "cd-share-prev-course"
  }, course.title))), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-sec"
  }, "Send in Messages"), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-rail"
  }, CD.SHARE_CONTACTS.map(c => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-person",
    key: c.id,
    onClick: () => onDone("Lesson sent to " + c.name)
  }, /*#__PURE__*/React.createElement(AvatarCW, {
    name: c.name,
    src: c.avatar,
    size: 52
  }), /*#__PURE__*/React.createElement("span", null, c.name)))), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-sec"
  }, "Share to"), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-tiles"
  }, tiles.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-tile",
    key: t.k,
    onClick: t.run
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-share-tile-ic"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: t.icon,
    size: 22,
    color: INK_CW.text
  })), /*#__PURE__*/React.createElement("span", null, t.label)))), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-link"
  }, /*#__PURE__*/React.createElement("code", null, url), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-fill",
    onClick: () => {
      CD.copyText(url);
      onDone("Lesson link copied");
    }
  }, "Copy"))));
}

/* ---------------------------------------------------------------- sidebar -- */
function CWSide({
  course,
  flat,
  done,
  locked,
  purchased,
  started,
  curDone,
  next,
  onContinue,
  onBuy,
  item
}) {
  const total = flat.length;
  const doneCount = flat.filter(l => done.indexOf(l.name) !== -1).length;
  const pct = total ? Math.round(doneCount / total * 100) : 0;
  const included = PFL.included(course.slug);
  const levels = course.levels.filter(l => !l.quiz).length;
  const continueLabel = !next ? curDone ? "Course complete" : "Finish course" : started ? "Continue learning" : "Start learning";
  const access = locked ? {
    icon: "lucide:lock",
    text: "Paid course · £" + course.price,
    cls: " paid"
  } : included ? {
    icon: "fluent:shield-checkmark-16-filled",
    text: "Included in your membership",
    cls: ""
  } : purchased ? {
    icon: "lucide:badge-check",
    text: "Purchased · lifetime access",
    cls: ""
  } : {
    icon: "fluent:shield-checkmark-16-filled",
    text: "Free access",
    cls: ""
  };
  const meta = [{
    icon: "lucide:clock",
    key: "Duration",
    value: course.dur || totalDurationCW(flat) || "—"
  }, {
    icon: "lucide:layers",
    key: "Levels",
    value: levels + " levels"
  }, {
    icon: "lucide:play-circle",
    key: "Lessons",
    value: total + " lessons"
  }, {
    icon: "lucide:award",
    key: "Certificate",
    value: "Included"
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "cw-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-side-card",
    "data-screen-label": "Course card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-side-thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.still,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "cw-side-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-access" + access.cls
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: access.icon,
    size: 20,
    color: locked ? INK_CW.gold : INK_CW.heading
  }), access.text), !locked && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cw-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-prog-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-prog-label"
  }, "Course progress"), /*#__PURE__*/React.createElement("span", {
    className: "cw-prog-count"
  }, doneCount, " of ", total)), /*#__PURE__*/React.createElement("div", {
    className: "cd-track",
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": pct,
    "aria-label": "Course progress"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "cw-progress-label"
  }, pct, "% complete")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-fill cw-continue",
    onClick: onContinue,
    disabled: !next && curDone
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "fluent:play-16-filled",
    size: 16,
    color: INK_CW.onNavy
  }), continueLabel)), locked && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-gold cw-continue",
    onClick: onBuy
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: "lucide:shopping-bag",
    size: 16,
    color: INK_CW.onGold
  }), "Buy course · £", course.price), /*#__PURE__*/React.createElement("div", {
    className: "cw-meta-grid"
  }, meta.map(m => /*#__PURE__*/React.createElement("div", {
    className: "cw-meta-item",
    key: m.key
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-meta-key"
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: m.icon,
    size: 15,
    color: INK_CW.heading
  }), m.key), /*#__PURE__*/React.createElement("span", {
    className: "cw-meta-val"
  }, m.value)))), /*#__PURE__*/React.createElement("div", {
    className: "cw-included"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-included-h"
  }, "What's included"), CD.INCLUDED.map(it => /*#__PURE__*/React.createElement("div", {
    className: "cw-included-row",
    key: it.text
  }, /*#__PURE__*/React.createElement(IconCW, {
    name: it.icon,
    size: 19,
    color: INK_CW.heading
  }), it.text))))), /*#__PURE__*/React.createElement(CWAvaCard, {
    lessonName: item.name,
    courseTitle: course.title
  }));
}

/* ---------------------------------------------------------------- app -- */
function CourseWebApp() {
  const course = CW_COURSE;
  const flat = useMemoCW(() => CD.flatten(course), []);
  const [done, markDone] = PFL.useLessonsDone();
  const purchased = PFL.usePurchased();
  const isPurchased = purchased.indexOf(course.slug) !== -1;
  /* paid course, not bought yet: browse only — nothing plays until checkout */
  const locked = course.price > 0 && !isPurchased;

  /* current lesson = URL position → web resume pointer → first not-yet-completed → first */
  const [curIdx, setCurIdx] = useStateCW(() => {
    const fromUrl = CD.lessonIdxFromParams(flat, CW_PARAMS);
    if (fromUrl != null) return fromUrl;
    const saved = PFL.readProgress(course.slug);
    const doneNow = PFL.readDone();
    if (typeof saved.activeIdx === "number" && flat[saved.activeIdx] && doneNow.indexOf(flat[saved.activeIdx].name) === -1) return saved.activeIdx;
    const i = flat.findIndex(l => doneNow.indexOf(l.name) === -1);
    return i === -1 ? 0 : i;
  });
  const cur = flat[curIdx];
  const content = CD.genericContent(cur);
  const curDone = done.indexOf(cur.name) !== -1;
  const next = flat[curIdx + 1] || null;
  const started = curIdx > 0 || flat.some(l => done.indexOf(l.name) !== -1);
  const [toast, setToast] = useStateCW(null);
  const toastTimer = useRefCW(null);
  const showToast = msg => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };
  useEffectCW(() => {
    document.title = "PROfinity — My Learning · " + course.title;
  }, []);
  /* web resume pointer (completed = flat indices of the shared name-keyed store) */
  useEffectCW(() => {
    PFL.writeProgress(course.slug, {
      completed: flat.map((l, i) => done.indexOf(l.name) !== -1 ? i : -1).filter(i => i !== -1),
      activeIdx: curIdx
    });
  }, [curIdx, done]);
  /* keep the URL on the selected lesson so refresh / share keep the place */
  const syncUrl = i => {
    try {
      const u = new URL(window.location.href);
      const it = flat[i];
      /* rebuilt so the query reads course → title/price/dur → position */
      const rest = new URLSearchParams(u.search);
      ["course", "level", "module", "lesson", "sub", "share", "play"].forEach(k => rest.delete(k));
      const q = new URLSearchParams({
        course: course.slug
      });
      rest.forEach((v, k) => q.set(k, v));
      q.set("level", it.li);
      q.set("module", it.si);
      q.set("lesson", it.ni);
      if (it.subIdx != null) q.set("sub", it.subIdx);
      u.search = q.toString();
      history.replaceState(history.state, "", u);
    } catch (e) {}
  };
  /* ?play=1 (LearningMobile / MyLearning deep links) — the player is its own page on the web */
  useEffectCW(() => {
    if (CW_PARAMS.get("play") === "1" && !PFL.locked(course.slug, CW_PARAMS.get("price"))) goCW(CD.lessonUrl(course, cur));else syncUrl(curIdx);
  }, []);
  const buyCourse = () => goCW(CD.checkoutUrl(course));
  const nudgeBuy = () => showToast("Buy this course to start its lessons");
  const openLesson = i => {
    if (locked) {
      nudgeBuy();
      return;
    }
    goCW(CD.lessonUrl(course, flat[i]));
  };
  const selectLesson = name => {
    const i = flat.findIndex(l => l.name === name);
    if (i === -1) return;
    if (flat[i].kind === "pdf" && !locked) {
      openLesson(i);
      return;
    }
    setCurIdx(i);
    syncUrl(i);
    if (locked) nudgeBuy();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const openByName = name => {
    const i = flat.findIndex(l => l.name === name);
    if (i !== -1) openLesson(i);
  };
  /* Continue — open the player on the current lesson (or the next one when the current is already ticked) */
  const continueLesson = () => {
    if (!next && curDone) return;
    openLesson(curDone && next ? curIdx + 1 : curIdx);
  };

  /* Share lesson — ?share=1 opens it on load for design review */
  const [shareOpen, setShareOpen] = useStateCW(() => CW_PARAMS.get("share") === "1");
  const shareUrl = (() => {
    try {
      const u = new URL(CD.lessonUrl(course, cur), window.location.href);
      return u.href;
    } catch (e) {
      return window.location.href;
    }
  })();
  const shareDone = msg => {
    setShareOpen(false);
    if (msg) showToast(msg);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen cd-root",
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
    "data-screen-label": "Course (web) · " + (locked ? "locked" : "unlocked")
  }, /*#__PURE__*/React.createElement(CWCrumb, {
    course: course
  }), /*#__PURE__*/React.createElement("div", {
    className: "cw-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-main"
  }, /*#__PURE__*/React.createElement(CWHero, {
    course: course,
    item: cur,
    content: content,
    locked: locked,
    started: started,
    curDone: curDone,
    next: next,
    total: flat.length,
    onOpen: () => openLesson(curIdx),
    onContinue: continueLesson,
    onShare: () => setShareOpen(true),
    onBuy: buyCourse
  }), /*#__PURE__*/React.createElement(CWInThisLesson, {
    content: content
  }), /*#__PURE__*/React.createElement(CWCourseContent, {
    course: course,
    flat: flat,
    done: done,
    currentName: cur.name,
    locked: locked,
    onSelect: selectLesson,
    onOpen: openByName
  }), /*#__PURE__*/React.createElement(CWResources, {
    onToast: showToast,
    locked: locked,
    onLocked: nudgeBuy
  }), /*#__PURE__*/React.createElement(CWRelated, {
    course: course
  }), /*#__PURE__*/React.createElement(CWInstructor, null), /*#__PURE__*/React.createElement(CWComments, {
    lessonName: cur.name,
    courseSlug: course.slug
  })), /*#__PURE__*/React.createElement(CWSide, {
    course: course,
    flat: flat,
    done: done,
    locked: locked,
    purchased: isPurchased,
    started: started,
    curDone: curDone,
    next: next,
    onContinue: continueLesson,
    onBuy: buyCourse,
    item: cur
  }))), shareOpen && /*#__PURE__*/React.createElement(CWShareModal, {
    item: cur,
    course: course,
    url: shareUrl,
    onClose: () => setShareOpen(false),
    onDone: shareDone
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "cd-toast",
    role: "status"
  }, toast));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CourseWebApp, null));
