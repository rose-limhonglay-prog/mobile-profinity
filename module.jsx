/* ===========================================================================
   PROfinity — Module (mobile) · a module's lessons, in the mixed model:
   lessons directly under the module, plus sub-module folders.
   Suffixed -MO to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateMO } = React;
const DMO = window.ProfinityDesignSystem_c2b5cc;
const { IconifyIcon: IcoMO, LevelBadge: LevelBadgeMO, ProgressBar: ProgressBarMO, Button: ButtonMO, Card: CardMO } = DMO;

function goMO(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

/* Mirrors the "toxin-battle" course tree in lesson.jsx's LS_COURSES — kept as
   its own copy since Module.html is a standalone page bundle, but the level/
   module indices below must line up so links into Lesson.html/SubModule.html
   resolve to the right content. */
const MO_DATA = {
  "module-1": {
    courseSlug: "toxin-battle", level: 0, module: 0,
    course: "Toxin Battle with Julie Bass Kaplan",
    name: "Module 1: Diagnosis",
    levelLabel: "Intermediate", mins: "13 min",
    desc: "How to diagnose, treat and — most of all — understand how to avoid eyelid ptosis from toxin treatment.",
    lessons: [
      ["Treatment", "3:04"],
      ["Technique reducing the risk of Eyelid Ptosis", "2:14"],
      ["Treatment Avoidance", "5:24"],
    ],
    subs: [],
    nextModule: "module-2",
  },
  "module-2": {
    courseSlug: "toxin-battle", level: 1, module: 0,
    course: "Toxin Battle with Julie Bass Kaplan",
    name: "Module 2: Lip Filler Technique",
    levelLabel: "Intermediate", mins: "32 min",
    desc: "Start with the two orientation lessons, then work through the technique, case study and resource folders in order.",
    lessons: [
      ["Welcome & how to use this module", "2:10"],
      ["Safety essentials (watch first)", "6:48"],
    ],
    subs: [
      { name: "Injection Techniques", n: 3, mins: "14 min", lessons: ["Linear threading technique", "Tenting technique", "Cannula approach"] },
      { name: "Case Studies", n: 2, mins: "16 min", lessons: ["Case 1: thin lips, first treatment", "Case 2: correction of migrated filler"] },
      { name: "Downloads & Resources", n: 2, mins: "2 files", lessons: ["Technique recipe cards (PDF)", "Consent form templates (PDF)"] },
    ],
    nextModule: null,
  },
};

const MO_KEY_BY_INDEX = {};
Object.keys(MO_DATA).forEach((k) => { MO_KEY_BY_INDEX[MO_DATA[k].level + ":" + MO_DATA[k].module] = k; });

function moKey() {
  try {
    const p = new URLSearchParams(location.search);
    if (p.has("level") && p.has("module")) {
      const k = MO_KEY_BY_INDEX[p.get("level") + ":" + p.get("module")];
      if (k) return k;
    }
    const k = p.get("m") || "";
    return MO_DATA[k] ? k : "module-1";
  } catch (e) { return "module-1"; }
}

function lessonUrlMO(d, i) {
  return `Lesson.html?course=${d.courseSlug}&level=${d.level}&module=${d.module}&lesson=${i}`;
}
function subLessonUrlMO(d, si, i) {
  return `Lesson.html?course=${d.courseSlug}&level=${d.level}&module=${d.module}&sub=${si}&lesson=${i}`;
}
function subModuleUrlMO(d, si) {
  return `SubModule.html?course=${d.courseSlug}&level=${d.level}&module=${d.module}&sub=${si}`;
}

/* First lesson the learner hasn't finished yet: module's own lessons first,
   then each sub-module's lessons in order. Null once everything is done. */
function firstIncompleteMO(d, doneSet) {
  for (let i = 0; i < d.lessons.length; i++) {
    if (doneSet.indexOf(d.lessons[i][0]) === -1) return { url: lessonUrlMO(d, i) };
  }
  for (let si = 0; si < d.subs.length; si++) {
    const s = d.subs[si];
    for (let i = 0; i < s.lessons.length; i++) {
      if (doneSet.indexOf(s.lessons[i]) === -1) return { url: subLessonUrlMO(d, si, i) };
    }
  }
  return null;
}

/* Completion is shared with Lesson/SubModule — a flat array of lesson names
   in localStorage, broadcast on change so every open page's progress agrees. */
function moDone() {
  try { return JSON.parse(localStorage.getItem("pf-lessons-done") || "[]"); } catch (e) { return []; }
}

function MOLesson({ d, l, n, i, done }) {
  const pdf = l[2] === "pdf";
  return (
    <button type="button" className={"mo-lesson" + (done ? " done" : "")} onClick={() => goMO(lessonUrlMO(d, i))}>
      <span className="mo-lesson-n">{done ? <IcoMO name="lucide:check" size={14} color="#fff" /> : n}</span>
      <span className="mo-lesson-tx">
        <span className="nm">{l[0]}</span>
        <span className="mt">
          <IcoMO name={pdf ? "lucide:file-text" : "lucide:play"} size={13} color="var(--gray-450)" />
          {pdf ? "Download" : l[1]}
        </span>
      </span>
      <IcoMO name="lucide:chevron-right" size={19} color="var(--gray-450)" />
    </button>
  );
}

function MOSubRow({ d, s, si }) {
  return (
    <button type="button" className="mo-sub" onClick={() => goMO(subModuleUrlMO(d, si))}>
      <span className="mo-sub-ic"><IcoMO name="lucide:folder" size={20} color="var(--brand-gold)" /></span>
      <span className="mo-sub-tx">
        <span className="nm">{s.name}</span>
        <span className="mt">{s.n} lessons · {s.mins}</span>
      </span>
      <IcoMO name="lucide:chevron-right" size={19} color="var(--gray-450)" />
    </button>
  );
}

function ModuleHome() {
  const d = MO_DATA[moKey()];
  const [doneSet, setDoneSet] = useStateMO(moDone);
  React.useEffect(() => {
    const sync = () => setDoneSet(moDone());
    window.addEventListener("pf-lessons-done", sync);
    return () => window.removeEventListener("pf-lessons-done", sync);
  }, []);
  const total = d.lessons.length + d.subs.reduce((a, s) => a + s.lessons.length, 0);
  const doneN = d.lessons.filter((l) => doneSet.indexOf(l[0]) !== -1).length +
    d.subs.reduce((a, s) => a + s.lessons.filter((n) => doneSet.indexOf(n) !== -1).length, 0);
  const pct = total ? Math.round((doneN / total) * 100) : 0;
  const next = firstIncompleteMO(d, doneSet);
  const nextModule = d.nextModule ? MO_DATA[d.nextModule] : null;
  let ctaLabel, ctaHref;
  if (next) {
    ctaLabel = doneN ? "Continue where you left off" : "Start this module";
    ctaHref = next.url;
  } else if (nextModule) {
    ctaLabel = "Continue to " + nextModule.name;
    ctaHref = `Module.html?course=${nextModule.courseSlug}&level=${nextModule.level}&module=${nextModule.module}`;
  } else {
    ctaLabel = "Back to course";
    ctaHref = `CourseDetail.html?course=${d.courseSlug}`;
  }
  return (
    <div className="mo-screen" data-screen-label="Module (mobile)">
      <header className="mo-top">
        <button type="button" className="mo-back" aria-label="Back" onClick={() => goMO("CourseDetail.html")}>
          <IcoMO name="lucide:arrow-left" size={22} color="var(--brand-navy)" />
        </button>
        <span className="mo-head-tx">
          <span className="h">{d.course}</span>
          <span className="s">{d.name}</span>
        </span>
        <span className="mo-top-sp" />
      </header>

      <div className="mo-scroll">
        <CardMO className="mo-hero">
          <span className="mo-kind">Module</span>
          <div className="mo-meta">
            <LevelBadgeMO level={d.levelLabel} />
            <span className="mo-chip"><IcoMO name="lucide:layers" size={15} color="var(--brand-gold)" />{total} lessons</span>
            <span className="mo-chip"><IcoMO name="lucide:clock" size={15} color="var(--brand-gold)" />{d.mins}</span>
          </div>
          <p className="mo-desc">{d.desc}</p>
          <ProgressBarMO value={pct} label={pct + "% Complete"} style={{ marginBottom: 16 }} />
          <ButtonMO variant="brand" size="lg" fullWidth
            iconTrailing={<IcoMO name="lucide:arrow-right" size={17} color="#fff" />}
            onClick={() => goMO(ctaHref)}
            style={{ whiteSpace: "normal", height: "auto", minHeight: 52, lineHeight: 1.3, padding: "13px 18px", textAlign: "center" }}>
            {ctaLabel}
          </ButtonMO>
        </CardMO>

        <div className="mo-sec-h"><h2>Lessons in this module</h2></div>
        <CardMO className="mo-lessons" style={{ padding: 0, overflow: "hidden" }}>
          {d.lessons.map((l, i) => <MOLesson key={i} d={d} l={l} n={i + 1} i={i} done={doneSet.indexOf(l[0]) !== -1} />)}
        </CardMO>

        {d.subs.length > 0 &&
          <React.Fragment>
            <div className="mo-sec-h"><h2>Sub-modules</h2></div>
            <div className="mo-subs">
              {d.subs.map((s, si) => <MOSubRow key={s.name} d={d} s={s} si={si} />)}
            </div>
          </React.Fragment>}

        <div className="mo-foot">
          <ButtonMO variant="secondary" fullWidth
            iconLeading={<IcoMO name="lucide:list" size={18} color="var(--gray-600)" />}
            onClick={() => goMO("CourseDetail.html")}>
            Back to course outline
          </ButtonMO>
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function useDeviceScaleMO() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateMO(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

function useIsMobileMO() {
  const [mobile, setMobile] = useStateMO(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

function ModuleApp() {
  const mobile = useIsMobileMO();
  const scale = useDeviceScaleMO();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><ModuleHome /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: "scale(" + scale + ")", transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><ModuleHome /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ModuleApp />);
