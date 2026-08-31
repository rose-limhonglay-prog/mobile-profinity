/* ===========================================================================
   PROfinity — Sub-module (web) · desktop chrome for a folder inside a module.
   Reached from the "Toxin Battle" mobile course tree (CourseDetail/Module),
   which is the only place this sub-module folder concept currently exists —
   kept as its own data copy since SubModuleWeb.html is a standalone page
   bundle, but the level/module/sub indices line up with submodule.jsx so
   links into Lesson.html/Module.html resolve to the right content.
   "Start first lesson"/"Continue" and lesson rows drop into the shared
   phone-framed Lesson.html player rather than duplicating a desktop player
   here. Suffixed -SMW to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateSMW, useEffect: useEffectSMW } = React;
const DSMW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavSMW, IconifyIcon: IconSMW, Spark: SparkSMW } = DSMW;

const ME_SMW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goSMW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateSMW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goSMW(u);
}

/* ---------------------------------------------------------------- data -- */
const SMW_DATA = {
  "injection-techniques": {
    courseSlug: "toxin-battle", levelIdx: 1, moduleIdx: 0, subIdx: 0,
    module: "Module 2: Lip Filler Technique",
    name: "Injection Techniques",
    intro: "Three techniques, in the order they should be learned. Each one builds on the needle control of the one before it, so work through them in sequence rather than picking the technique you like the look of.",
    prep: [
      "Watch the module's two orientation lessons first — this folder assumes that safety baseline.",
      "Have your product, cannula and needle options to hand so you can follow the demonstrations.",
      "Download the technique recipe cards from Downloads & Resources before your next clinic day."
    ],
    lessons: [
      { name: "Linear threading technique", dur: "4:32", kind: "video" },
      { name: "Tenting technique", dur: "3:58", kind: "video" },
      { name: "Cannula approach", dur: "6:11", kind: "video" }
    ],
    nextSub: "case-studies"
  },
  "case-studies": {
    courseSlug: "toxin-battle", levelIdx: 1, moduleIdx: 0, subIdx: 1,
    module: "Module 2: Lip Filler Technique",
    name: "Case Studies",
    intro: "Two full cases, filmed end to end, so you can see how the techniques are chosen and adapted in front of a real patient — including the moments where the plan changes.",
    prep: [
      "Complete the Injection Techniques folder first; these cases assume you know all three.",
      "Watch each case once through before rewatching for the decision points.",
      "Note the consultation language — it is as important as the injecting."
    ],
    lessons: [
      { name: "Case 1: thin lips, first treatment", dur: "7:20", kind: "video" },
      { name: "Case 2: correction of migrated filler", dur: "9:05", kind: "video" }
    ],
    nextSub: "downloads-resources"
  },
  "downloads-resources": {
    courseSlug: "toxin-battle", levelIdx: 1, moduleIdx: 0, subIdx: 2,
    module: "Module 2: Lip Filler Technique",
    name: "Downloads & Resources",
    intro: "The printable material for this module. Keep the recipe cards in your treatment room and use the consent templates from your next appointment onwards.",
    prep: [
      "Print the recipe cards double-sided and laminate them for the treatment room.",
      "Adapt the consent templates to your own clinic name and insurer requirements.",
      "Re-download after each course update — the templates are revised periodically."
    ],
    lessons: [
      { name: "Technique recipe cards", dur: "PDF", kind: "pdf" },
      { name: "Consent form templates", dur: "PDF", kind: "pdf" }
    ],
    nextSub: null
  }
};

function smwSlug() {
  try {
    const s = new URLSearchParams(location.search).get("s");
    return SMW_DATA[s] ? s : "injection-techniques";
  } catch (e) { return "injection-techniques"; }
}

function lessonUrlSMW(d, i) {
  return `Lesson.html?course=${d.courseSlug}&level=${d.levelIdx}&module=${d.moduleIdx}&sub=${d.subIdx}&lesson=${i}`;
}
function moduleUrlSMW(d) {
  return `Module.html?course=${d.courseSlug}&level=${d.levelIdx}&module=${d.moduleIdx}`;
}
function courseUrlSMW(d) {
  return `CourseDetail.html?course=${d.courseSlug}`;
}
function subModuleUrlSMW(slug) {
  return `SubModuleWeb.html?s=${slug}`;
}

function firstIncompleteSMW(d, doneSet) {
  for (let i = 0; i < d.lessons.length; i++) {
    if (doneSet.indexOf(d.lessons[i].name) === -1) return i;
  }
  return null;
}

/* Completion is shared with Lesson/Module/SubModule (mobile) — a flat array
   of lesson names in localStorage, broadcast on change so every open page's
   progress agrees. */
function smwDone() {
  try { return JSON.parse(localStorage.getItem("pf-lessons-done") || "[]"); } catch (e) { return []; }
}

/* ---------------------------------------------------------------- crumb -- */
function SMWCrumb({ d }) {
  return (
    <div className="smw-crumb-row">
      <button type="button" className="smw-back-btn" aria-label="Back to course" onClick={() => goSMW(courseUrlSMW(d))}>
        <IconSMW name="lucide:arrow-left" size={19} color="var(--brand-navy)" />
      </button>
      <span className="smw-crumb">
        <a onClick={() => goSMW("MyLearning.html")}>My Learning</a> &nbsp;/&nbsp;
        <a onClick={() => goSMW(courseUrlSMW(d))}>Toxin Battle</a> &nbsp;/&nbsp;
        <span className="smw-crumb-mod">{d.module}</span> &nbsp;/&nbsp;
        <span className="smw-crumb-cur">{d.name}</span>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- hero -- */
function smwStats(d) {
  const videos = d.lessons.filter((l) => l.kind !== "pdf");
  const docs = d.lessons.length - videos.length;
  const totalSec = videos.reduce((acc, l) => {
    const [m, s] = l.dur.split(":").map(Number);
    return acc + m * 60 + s;
  }, 0);
  const mins = Math.round(totalSec / 60);
  return [
    { icon: "lucide:play-circle", key: "Lessons", value: videos.length + (videos.length === 1 ? " video" : " videos") },
    { icon: "lucide:clock", key: "Watch time", value: mins > 0 ? mins + " min" : "—" },
    { icon: "lucide:file-text", key: "Downloads", value: docs + (docs === 1 ? " file" : " files") }
  ];
}

function SMWHero({ d }) {
  return (
    <section className="smw-card smw-hero">
      <div className="smw-hero-head">
        <span className="smw-hero-ic"><IconSMW name="lucide:folder-open" size={26} color="var(--brand-gold)" /></span>
        <span className="smw-hero-tx">
          <span className="smw-eyebrow">Sub-module &middot; {d.module}</span>
          <h1>{d.name}</h1>
        </span>
      </div>
      <p className="smw-intro">{d.intro}</p>
      <div className="smw-stats">
        {smwStats(d).map((s, i) => (
          <div className="smw-stat" key={i}>
            <span className="smw-stat-key"><IconSMW name={s.icon} size={16} color="var(--brand-navy)" />{s.key}</span>
            <span className="smw-stat-val">{s.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- before you start -- */
function SMWPrep({ d }) {
  return (
    <section className="smw-card smw-prep">
      <h2>Before you start</h2>
      <div className="smw-prep-list">
        {d.prep.map((text, i) => (
          <div className="smw-prep-item" key={i}>
            <span className="smw-prep-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="smw-prep-tx">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- lessons -- */
function SMWLessonRow({ d, l, i, done }) {
  const pdf = l.kind === "pdf";
  return (
    <a href={lessonUrlSMW(d, i)} className="smw-row" onClick={(e) => { e.preventDefault(); goSMW(lessonUrlSMW(d, i)); }}>
      <span className={"smw-row-n" + (done ? " done" : "")}>{done ? <IconSMW name="lucide:check" size={14} color="#fff" /> : i + 1}</span>
      <span className="smw-row-tx">
        <span className="smw-row-name">{l.name}</span>
        <span className="smw-row-kind">{pdf ? "Downloadable resource" : "Video lesson"}</span>
      </span>
      <span className="smw-row-dur">{l.dur}</span>
      <IconSMW name="lucide:chevron-right" size={19} color="var(--gray-450)" />
    </a>
  );
}

function SMWLessons({ d, doneSet }) {
  return (
    <section className="smw-card smw-lessons">
      <div className="smw-lessons-head">
        <h2>Lessons in this sub-module</h2>
        <span className="smw-lessons-count">{d.lessons.length} item{d.lessons.length === 1 ? "" : "s"}</span>
      </div>
      <div className="smw-rows">
        {d.lessons.map((l, i) => (
          <SMWLessonRow d={d} l={l} i={i} key={i} done={doneSet.indexOf(l.name) !== -1} />
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- sidebar -- */
function SMWSide({ d, doneSet, siblingsBySlug, activeSlug }) {
  const done = d.lessons.filter((l) => doneSet.indexOf(l.name) !== -1).length;
  const pct = Math.round((done / d.lessons.length) * 100);
  const nextIncomplete = firstIncompleteSMW(d, doneSet);
  const nextSub = d.nextSub ? SMW_DATA[d.nextSub] : null;
  let ctaLabel, ctaHref;
  if (nextIncomplete != null) {
    ctaLabel = done ? "Continue where you left off" : "Start first lesson";
    ctaHref = lessonUrlSMW(d, nextIncomplete);
  } else if (nextSub) {
    ctaLabel = "Continue to " + nextSub.name;
    ctaHref = subModuleUrlSMW(d.nextSub);
  } else {
    ctaLabel = "Back to " + d.module;
    ctaHref = moduleUrlSMW(d);
  }
  return (
    <aside className="smw-aside">
      <div className="smw-side-card">
        <div className="smw-progress-row">
          <span>Sub-module progress</span>
          <span className="smw-progress-pct">{pct}%</span>
        </div>
        <span className="smw-progress-bar"><span style={{ width: pct + "%" }} /></span>

        <button type="button" className="smw-cta-primary" onClick={() => goSMW(ctaHref)}>
          <IconSMW name="fluent:play-16-filled" size={19} color="#fff" />{ctaLabel}
        </button>
        <button type="button" className="smw-cta-secondary" onClick={() => goSMW(moduleUrlSMW(d))}>Back to curriculum</button>

        <div className="smw-divider" />

        <div className="smw-siblings-h">Other sub-modules</div>
        <div className="smw-siblings">
          {Object.keys(SMW_DATA).map((slug) => {
            const s = SMW_DATA[slug];
            const on = slug === activeSlug;
            return (
              <button type="button" key={slug} className={"smw-sibling" + (on ? " on" : "")}
                onClick={() => goSMW(subModuleUrlSMW(slug))}>
                <IconSMW name={on ? "lucide:folder-open" : "lucide:folder"} size={17} color="var(--brand-gold)" />
                <span className="smw-sibling-name">{s.name}</span>
                <span className="smw-sibling-n">{s.lessons.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="smw-ava-card">
        <div className="smw-ava-head">
          <SparkSMW size={20} color="var(--brand-gold)" />
          <span>Ask Ava first</span>
        </div>
        <p>Want a quick primer before you start? Ava can summarise this sub-module in 30 seconds.</p>
        <button type="button" className="smw-ava-btn" onClick={() => goSMW("Agent.html")}>
          Ask Ava<IconSMW name="lucide:arrow-up-right" size={16} color="var(--brand-navy)" />
        </button>
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------------- app -- */
function SubModuleWebApp() {
  const [slug, setSlug] = useStateSMW(smwSlug);
  const [doneSet, setDoneSet] = useStateSMW(smwDone);
  const d = SMW_DATA[slug];

  useEffectSMW(() => { document.title = "PROfinity — " + d.name; }, [slug]);
  useEffectSMW(() => {
    const sync = () => setDoneSet(smwDone());
    window.addEventListener("pf-lessons-done", sync);
    return () => window.removeEventListener("pf-lessons-done", sync);
  }, []);
  useEffectSMW(() => {
    const onPop = () => setSlug(smwSlug());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div className="app" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavSMW active="My Learning" user={ME_SMW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateSMW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="smw-page" data-screen-label="Sub-module (web)">
        <SMWCrumb d={d} />
        <div className="smw-grid">
          <div className="smw-main">
            <SMWHero d={d} />
            <SMWPrep d={d} />
            <SMWLessons d={d} doneSet={doneSet} />
          </div>
          <SMWSide d={d} doneSet={doneSet} activeSlug={slug} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<SubModuleWebApp />);
