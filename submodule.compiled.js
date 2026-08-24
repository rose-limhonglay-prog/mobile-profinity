/* ===========================================================================
   PROfinity — Sub-module (mobile) · a folder inside a module.
   Reached from a sub-module header on CourseDetail or the lesson outline.
   Suffixed -SM to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateSM
} = React;
const DSM = window.ProfinityDesignSystem_c2b5cc;
const {
  IconifyIcon: IcoSM,
  LevelBadge: LevelBadgeSM,
  ProgressBar: ProgressBarSM,
  Button: ButtonSM,
  Card: CardSM
} = DSM;
function goSM(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* Mirrors the "toxin-battle" course tree in lesson.jsx's LS_COURSES — kept as
   its own copy since SubModule.html is a standalone page bundle, but the
   level/module/sub indices must line up so links into Lesson.html resolve
   to the right content. */
const SM_DATA = {
  "injection-techniques": {
    courseSlug: "toxin-battle",
    levelIdx: 1,
    moduleIdx: 0,
    subIdx: 0,
    module: "Module 2: Lip Filler Technique",
    name: "Injection Techniques",
    desc: "The three core delivery methods, filmed chairside. Work through them in order — each builds on the needle control taught in the one before.",
    mins: "14 min",
    level: "Intermediate",
    outcomes: ["Choose between needle and cannula based on tissue plane and patient history.", "Control depth and speed to keep product where you placed it.", "Recognise the tactile cues that mean you should stop and reassess."],
    lessons: [["Linear threading technique", "4:32"], ["Tenting technique", "3:58"], ["Cannula approach", "6:11"]],
    nextSub: "case-studies"
  },
  "case-studies": {
    courseSlug: "toxin-battle",
    levelIdx: 1,
    moduleIdx: 0,
    subIdx: 1,
    module: "Module 2: Lip Filler Technique",
    name: "Case Studies",
    desc: "Two full cases from consultation to review, including the decisions that were reconsidered mid-treatment.",
    mins: "16 min",
    level: "Intermediate",
    outcomes: ["Plan a conservative first treatment for a patient with thin lips.", "Assess and stage the correction of migrated filler.", "Set review intervals and document expected outcomes."],
    lessons: [["Case 1: thin lips, first treatment", "7:20"], ["Case 2: correction of migrated filler", "9:05"]],
    nextSub: "downloads-resources"
  },
  "downloads-resources": {
    courseSlug: "toxin-battle",
    levelIdx: 1,
    moduleIdx: 0,
    subIdx: 2,
    module: "Module 2: Lip Filler Technique",
    name: "Downloads & Resources",
    desc: "Chairside references and paperwork you can use in clinic tomorrow.",
    mins: "2 files",
    level: "All levels",
    outcomes: ["Keep the technique recipe cards to hand during treatment.", "Use the consent templates as the basis for your own paperwork."],
    lessons: [["Technique recipe cards (PDF)", "PDF", "pdf"], ["Consent form templates (PDF)", "PDF", "pdf"]],
    nextSub: null
  }
};
const SM_KEY_BY_INDEX = {};
Object.keys(SM_DATA).forEach(k => {
  SM_KEY_BY_INDEX[SM_DATA[k].levelIdx + ":" + SM_DATA[k].moduleIdx + ":" + SM_DATA[k].subIdx] = k;
});
function smKey() {
  try {
    const p = new URLSearchParams(location.search);
    if (p.has("level") && p.has("module") && p.has("sub")) {
      const k = SM_KEY_BY_INDEX[p.get("level") + ":" + p.get("module") + ":" + p.get("sub")];
      if (k) return k;
    }
    const k = p.get("s") || "";
    return SM_DATA[k] ? k : "injection-techniques";
  } catch (e) {
    return "injection-techniques";
  }
}
function lessonUrlSM(d, i) {
  return `Lesson.html?course=${d.courseSlug}&level=${d.levelIdx}&module=${d.moduleIdx}&sub=${d.subIdx}&lesson=${i}`;
}
function moduleUrlSM(d) {
  return `Module.html?course=${d.courseSlug}&level=${d.levelIdx}&module=${d.moduleIdx}`;
}
function subModuleUrlSM(d) {
  return `SubModule.html?course=${d.courseSlug}&level=${d.levelIdx}&module=${d.moduleIdx}&sub=${d.subIdx}`;
}
function firstIncompleteSM(d, doneSet) {
  for (let i = 0; i < d.lessons.length; i++) {
    if (doneSet.indexOf(d.lessons[i][0]) === -1) return i;
  }
  return null;
}

/* Completion is shared with Lesson/Module — a flat array of lesson names in
   localStorage, broadcast on change so every open page's progress agrees. */
function smDone() {
  try {
    return JSON.parse(localStorage.getItem("pf-lessons-done") || "[]");
  } catch (e) {
    return [];
  }
}
function SMLesson({
  d,
  l,
  n,
  i,
  done
}) {
  const pdf = l[2] === "pdf";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-lesson" + (done ? " done" : ""),
    onClick: () => goSM(lessonUrlSM(d, i))
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-lesson-n"
  }, done ? /*#__PURE__*/React.createElement(IcoSM, {
    name: "lucide:check",
    size: 14,
    color: "#fff"
  }) : n), /*#__PURE__*/React.createElement("span", {
    className: "sm-lesson-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, l[0]), /*#__PURE__*/React.createElement("span", {
    className: "mt"
  }, /*#__PURE__*/React.createElement(IcoSM, {
    name: pdf ? "lucide:file-text" : "lucide:play",
    size: 13,
    color: "var(--gray-450)"
  }), pdf ? "Download" : l[1])), /*#__PURE__*/React.createElement(IcoSM, {
    name: "lucide:chevron-right",
    size: 19,
    color: "var(--gray-450)"
  }));
}
function SubModuleHome() {
  const d = SM_DATA[smKey()];
  const [doneSet, setDoneSet] = useStateSM(smDone);
  React.useEffect(() => {
    const sync = () => setDoneSet(smDone());
    window.addEventListener("pf-lessons-done", sync);
    return () => window.removeEventListener("pf-lessons-done", sync);
  }, []);
  const done = d.lessons.filter(l => doneSet.indexOf(l[0]) !== -1).length;
  const pct = Math.round(done / d.lessons.length * 100);
  const nextIncomplete = firstIncompleteSM(d, doneSet);
  const nextSub = d.nextSub ? SM_DATA[d.nextSub] : null;
  let ctaLabel, ctaHref;
  if (nextIncomplete != null) {
    ctaLabel = done ? "Continue where you left off" : "Start this sub-module";
    ctaHref = lessonUrlSM(d, nextIncomplete);
  } else if (nextSub) {
    ctaLabel = "Continue to " + nextSub.name;
    ctaHref = subModuleUrlSM(nextSub);
  } else {
    ctaLabel = "Back to " + d.module;
    ctaHref = moduleUrlSM(d);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-screen",
    "data-screen-label": "Sub-module (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sm-top"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sm-back",
    "aria-label": "Back",
    onClick: () => goSM("CourseDetail.html")
  }, /*#__PURE__*/React.createElement(IcoSM, {
    name: "lucide:arrow-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-head-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h"
  }, d.module), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, d.name)), /*#__PURE__*/React.createElement("span", {
    className: "sm-top-sp"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-scroll"
  }, /*#__PURE__*/React.createElement(CardSM, {
    className: "sm-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-hero-ic"
  }, /*#__PURE__*/React.createElement(IcoSM, {
    name: "lucide:folder-open",
    size: 26,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-kind"
  }, "Sub-module"), /*#__PURE__*/React.createElement("span", {
    className: "sm-crumb"
  }, d.module), /*#__PURE__*/React.createElement("h1", null, d.name), /*#__PURE__*/React.createElement("div", {
    className: "sm-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-chip"
  }, /*#__PURE__*/React.createElement(IcoSM, {
    name: "lucide:layers",
    size: 15,
    color: "var(--brand-gold)"
  }), d.lessons.length, " lessons"), /*#__PURE__*/React.createElement("span", {
    className: "sm-chip"
  }, /*#__PURE__*/React.createElement(IcoSM, {
    name: "lucide:clock",
    size: 15,
    color: "var(--brand-gold)"
  }), d.mins), d.level === "All levels" ? /*#__PURE__*/React.createElement("span", {
    className: "sm-chip"
  }, /*#__PURE__*/React.createElement(IcoSM, {
    name: "lucide:signal",
    size: 15,
    color: "var(--brand-gold)"
  }), "All levels") : /*#__PURE__*/React.createElement(LevelBadgeSM, {
    level: d.level
  })), /*#__PURE__*/React.createElement(ProgressBarSM, {
    value: pct,
    label: pct + "% Complete",
    style: {
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "sm-desc"
  }, d.desc), /*#__PURE__*/React.createElement(ButtonSM, {
    variant: "brand",
    size: "lg",
    fullWidth: true,
    iconTrailing: /*#__PURE__*/React.createElement(IcoSM, {
      name: "lucide:arrow-right",
      size: 17,
      color: "#fff"
    }),
    onClick: () => goSM(ctaHref)
  }, ctaLabel)), /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "What you'll be able to do")), /*#__PURE__*/React.createElement(CardSM, {
    className: "sm-outcomes-card"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "sm-outcomes"
  }, d.outcomes.map(o => /*#__PURE__*/React.createElement("li", {
    key: o
  }, /*#__PURE__*/React.createElement(IcoSM, {
    name: "lucide:check-circle-2",
    size: 18,
    color: "var(--success)"
  }), /*#__PURE__*/React.createElement("span", null, o))))), /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Lessons")), /*#__PURE__*/React.createElement(CardSM, {
    className: "sm-lessons",
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, d.lessons.map((l, i) => /*#__PURE__*/React.createElement(SMLesson, {
    key: i,
    d: d,
    l: l,
    n: i + 1,
    i: i,
    done: doneSet.indexOf(l[0]) !== -1
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sm-tomod-wrap"
  }, /*#__PURE__*/React.createElement(ButtonSM, {
    variant: "secondary",
    fullWidth: true,
    iconLeading: /*#__PURE__*/React.createElement(IcoSM, {
      name: "lucide:list",
      size: 18,
      color: "var(--gray-600)"
    }),
    onClick: () => goSM(moduleUrlSM(d))
  }, "Back to ", d.module)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })));
}
function useDeviceScaleSM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSM(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}
function useIsMobileSM() {
  const [mobile, setMobile] = useStateSM(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function SubModuleApp() {
  const mobile = useIsMobileSM();
  const scale = useDeviceScaleSM();
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
    }, /*#__PURE__*/React.createElement(SubModuleHome, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "scale(" + scale + ")",
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(SubModuleHome, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(SubModuleApp, null));
