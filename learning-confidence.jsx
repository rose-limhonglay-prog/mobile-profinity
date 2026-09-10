/* ===========================================================================
   PROfinity — My Learning (Confidence tier, mobile) · iPhone 17 Pro Max
   Shared by LearningMobileConfidence.html (deep-navy reader, #0B1024) and
   LearningMobileConfidenceLight.html (standard light page surface).

   Separate from the free-tier LearningMobile.html / learning-mobile.jsx, which
   keeps its locked courses and Free Resources gate. Composed on the bound DS
   bundle (ProgressBar, Avatar, IconifyIcon) and the shared mobile chrome
   (window.PFSideMenuC, window.PFUseHeaderHideC). Suffixed -LC because every
   Babel page script shares one global scope.

   Variant flags are read at module scope, so the shell must set them before
   this script loads:
     window.PF_TIER     = "confidence"
     window.PF_LC_LIGHT = true          (light page only)
   The screen root is .lcm-screen and adds .lc-light for the light variant.

   Completion: localStorage["pf-lessons-done"] (array of lesson names) with a
   "pf-lessons-done" CustomEvent on write — the same store the lesson reader
   (lesson-confidence.jsx) and the course detail page use, so the "n of 5
   completed" counter and the row ticks here never disagree with them.
   =========================================================================== */
const { useState: useStateLC, useEffect: useEffectLC, useRef: useRefLC, useMemo: useMemoLC } = React;
const DSLC = window.ProfinityDesignSystem_c2b5cc;
const SideMenuLC = window.PFSideMenuC;
const NotificationsLC = window.PFNotificationsPanelC;
const MessagesLC = window.PFMessagesPanelC;
const useHeaderHideLC = window.PFUseHeaderHideC;

const LC_TIER = window.PF_TIER || "confidence";
const LC_LIGHT = !!window.PF_LC_LIGHT;

/* Glyph ink per variant. The DS IconifyIcon writes its colour inline, so
   per-variant colours are passed at the call site, never set in CSS.
   Gold #CE9957 fails AA on the light surface (~2.4:1) → #8A5303 there. */
const LC_INK = {
  gold: LC_LIGHT ? "#8A5303" : "#CE9957",
  text: LC_LIGHT ? "#292569" : "#FFFFFF",
  body: LC_LIGHT ? "#475467" : "rgba(255,255,255,.76)",
  muted: LC_LIGHT ? "#475467" : "rgba(255,255,255,.62)",
  success: LC_LIGHT ? "#2a9568" : "#5CD39A",
  /* glyph on a #CE9957 circle — navy reads 5.3:1 on light, #0B1024 7.5:1 on dark */
  onGold: LC_LIGHT ? "#292569" : "#0B1024",
  /* glyph on the deep-gold ramp (#A26301 → #7A4A03) — white ink */
  onRamp: "#FFFFFF",
  /* glyph inside the white circle on that ramp */
  rampDeep: "#7A4A03",
  tabOff: LC_LIGHT ? "#000000" : "#FFFFFF"
};
const LC_LOCKUP = LC_LIGHT ? "assets/profinity-academy-logo-full.png" : "assets/profinity-logo-dark.jpg";
const LC_ME = { name: "Katy", avatar: "assets/avatar-katy.jpg" };

/* Sibling pages in the same variant so the theme never flips mid-journey. */
const LC_URLS = {
  self: LC_LIGHT ? "LearningMobileConfidenceLight.html" : "LearningMobileConfidence.html",
  other: LC_LIGHT ? "LearningMobileConfidence.html" : "LearningMobileConfidenceLight.html",
  courseDetail: LC_LIGHT ? "CourseDetailConfidenceLight.html" : "CourseDetailConfidence.html",
  /* Lesson deep links open the Confidence reader's full-screen player
     (?play=1) in the same variant. Lesson.html is the standard lesson page
     (lesson.jsx) and stays untouched. */
  lesson: LC_LIGHT ? "CourseDetailConfidenceLight.html" : "CourseDetailConfidence.html",
  theme: LC_LIGHT ? "light" : "dark"
};

function goLC(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ---------------------------------------------------------------- completion store -- */
const LC_DONE_KEY = "pf-lessons-done";

function readDoneLC() {
  try {
    const raw = window.localStorage.getItem(LC_DONE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

/* Read on mount, re-read on the shared event and on cross-tab storage. This
   page never writes — completion is recorded by the lesson reader. */
function useLessonsDoneLC() {
  const [done, setDone] = useStateLC(readDoneLC);
  useEffectLC(() => {
    const sync = () => setDone(readDoneLC());
    const onStorage = (e) => { if (!e.key || e.key === LC_DONE_KEY) sync(); };
    window.addEventListener(LC_DONE_KEY, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LC_DONE_KEY, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return done;
}

/* ---------------------------------------------------------------- course data -- */
/* The 8D Lip Design course. Only the current module's lessons are listed here.
   Each row has a display `name` and a store `key` — the key is the lesson name
   lesson-confidence.jsx writes to pf-lessons-done on completion, so ticks here
   follow the reader. `base` marks lessons finished in earlier sessions (the
   "4 of 5 completed" baseline). Course-level "28 of 39" = lessons completed in
   earlier modules + this module's completed rows. */
const LC_COURSE = {
  slug: "8d-lip-design",
  title: "8D Lip Design",
  still: "assets/course-full-face-rejuvenation.jpg",
  totalLessons: 39,
  doneBeforeThisModule: 24
};

const LC_MODULE = {
  eyebrow: "Module 3 · Lip Anatomy",
  name: "Assessment",
  /* ?level=&module= indices lesson-confidence.jsx expects for these rows */
  level: 0,
  section: 0,
  lessons: [
  { name: "The Aesthetic Impact", mins: 6, key: "Lip anatomy essentials", base: true },
  { name: "Emotional Impact", mins: 4, key: "Vascular landmarks of the lip", base: true },
  { name: "Patient Perspective", mins: 5, key: "Assessing lip proportions", base: true },
  { name: "Practitioner Perspective", mins: 5, key: "Photographing the lips for assessment", base: true },
  { name: "Aesthetic Impact in Practice", mins: 8, key: "Assessment checklist walkthrough" }]
};
function lessonDoneLC(l, done) { return !!l.base || done.indexOf(l.key) !== -1; }

const LC_RELATED = [
{ title: "Temple Filler", level: "Advanced", lessons: 14, image: "assets/course-temple-filler.webp",
  blurb: "Master safe injection techniques with anatomical precision." },
{ title: "Advanced Lip Techniques", level: "Advanced", lessons: 18, image: "assets/course-advanced-lip-techniques.jpg",
  blurb: "Build on 8D with layered volume, borders and perioral balance." },
{ title: "Complications Management", level: "Advanced", lessons: 12, image: "assets/course-complications.jpg",
  blurb: "Recognise, prevent and manage vascular and other complications." }];

const LC_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: null },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" },
{ key: "Rewards", label: "Rewards", icon: "lucide:gift", href: "RewardsDashboard.html" }];

function lessonUrlLC(idx) {
  return LC_URLS.lesson + "?" + new URLSearchParams({
    course: LC_COURSE.slug, level: LC_MODULE.level, module: LC_MODULE.section, lesson: idx, theme: LC_URLS.theme, play: 1
  }).toString();
}

function courseUrlLC(c) {
  return "CourseDetail.html?" + new URLSearchParams({ title: c.title, instr: "Dr. Tim Pearce", pct: 0 }).toString();
}

/* ---------------------------------------------------------------- header -- */
/* burger · lockup · search · notifications · messages — the shared newsfeed
   top bar minus the points pill. The bell and message buttons open the shared
   drawers from mobilechrome.jsx. */
function LCHeader({ onMenu, onBell, onMessages }) {
  return (
    <header className="lcm-top" data-screen-label="Header">
      <button type="button" className="lcm-burger" aria-label="Menu" onClick={onMenu}>
        <DSLC.IconifyIcon name="lucide:menu" size={24} color={LC_INK.text} />
      </button>
      <div className="lcm-lockup"><img src={LC_LOCKUP} alt="PROfinity Academy" /></div>
      <span className="lcm-grow" />
      <button type="button" className="lcm-ic" aria-label="Search" onClick={() => goLC("SearchMobile.html")}>
        <DSLC.IconifyIcon name="lucide:search" size={20} color={LC_INK.text} />
      </button>
      <button type="button" className="lcm-ic" aria-label="Notifications, 12 unread" onClick={onBell}>
        <DSLC.IconifyIcon name="lucide:bell" size={20} color={LC_INK.text} />
        <span className="dot" aria-hidden="true">12</span>
      </button>
      <button type="button" className="lcm-ic" aria-label="Messages, 12 unread" onClick={onMessages}>
        <DSLC.IconifyIcon name="lucide:message-circle" size={20} color={LC_INK.text} />
        <span className="dot" aria-hidden="true">12</span>
      </button>
    </header>);
}

/* ---------------------------------------------------------------- course progress -- */
function LCRing({ pct, size = 78, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <svg className="lcm-ring" width={size} height={size} viewBox={"0 0 " + size + " " + size} role="img" aria-label={pct + "% complete"}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--lcm-ring-track)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--lcm-ring)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"} />
      <text x="50%" y="50%" dy=".36em" textAnchor="middle" className="lcm-ring-n">{pct}%</text>
    </svg>);
}

function LCProgressCard({ doneCount, total }) {
  const pct = Math.round(doneCount / total * 100);
  const left = total - doneCount;
  return (
    <section className="lcm-sec lcm-sec-first" data-screen-label="Course progress">
      <button type="button" className="lcm-card lcm-prog" onClick={() => goLC(LC_URLS.courseDetail)} aria-label={"Open " + LC_COURSE.title + " course, " + pct + "% complete"}>
        <LCRing pct={pct} size={92} stroke={9} />
        <span className="lcm-prog-tx">
          <span className="lcm-eyebrow lcm-eyebrow-strong">Course progress</span>
          <span className="lcm-prog-stat"><b>{doneCount}</b> of <span className="lcm-prog-total">{total}</span> lessons</span>
          <span className="lcm-prog-bar"><DSLC.ProgressBar value={pct} showPercent={false} height={8} /></span>
          <span className="lcm-prog-left">{left} {left === 1 ? "lesson" : "lessons"} to go</span>
        </span>
        <span className="lcm-prog-arrow" aria-hidden="true">
          <DSLC.IconifyIcon name="lucide:chevron-right" size={20} color={LC_INK.muted} />
        </span>
      </button>
    </section>);
}

/* ---------------------------------------------------------------- current lesson -- */
function LCCurrentLesson({ lesson, idx, saved, onSave }) {
  const open = () => goLC(lessonUrlLC(idx));
  return (
    <section className="lcm-sec" data-screen-label="Current lesson">
      <div className="lcm-card lcm-cur">
        <div className="lcm-cur-head">
          <span className="lcm-cur-tx">
            <span className="lcm-eyebrow lcm-eyebrow-gold">Current lesson</span>
            <span className="lcm-cur-mod">{LC_MODULE.eyebrow}</span>
          </span>
          <button type="button" className={"lcm-save" + (saved ? " on" : "")} aria-label={saved ? "Remove from saved" : "Save lesson"} aria-pressed={saved} onClick={onSave}>
            <DSLC.IconifyIcon name={saved ? "lucide:bookmark-check" : "lucide:bookmark"} size={22} color={saved ? LC_INK.gold : LC_INK.text} />
          </button>
        </div>
        <h1 className="lcm-title">{lesson.name}</h1>
        <button type="button" className="lcm-still" onClick={open} aria-label={"Open " + lesson.name}>
          <img src={LC_COURSE.still} alt="" />
          <span className="lcm-expand" aria-hidden="true">
            <DSLC.IconifyIcon name="lucide:maximize-2" size={18} color="#fff" />
          </span>
        </button>
      </div>
    </section>);
}

/* ---------------------------------------------------------------- lesson modules -- */
function LCModules({ done, currentIdx, nextIdx }) {
  const lessons = LC_MODULE.lessons;
  const doneCount = lessons.filter((l) => lessonDoneLC(l, done)).length;
  const allDone = doneCount === lessons.length;
  return (
    <section className="lcm-sec" data-screen-label="Lesson modules">
      <div className="lcm-sec-h lcm-sec-h-eyebrow">
        <h2 className="lcm-eyebrow lcm-eyebrow-gold">Lesson modules</h2>
        <span className="sub">{doneCount} of {lessons.length} completed</span>
      </div>
      <ol className="lcm-rows">
        {lessons.map((l, i) => {
          const isDone = lessonDoneLC(l, done);
          const isCur = i === currentIdx;
          return (
            <li key={l.key}>
              <button type="button" className={"lcm-row" + (isDone ? " done" : "") + (isCur ? " on" : "")}
                onClick={() => goLC(lessonUrlLC(i))} aria-current={isCur ? "step" : undefined}>
                <span className="lcm-row-title"><span className="lcm-row-n">{i + 1}.</span> {l.name}</span>
                <span className="lcm-row-dur">{l.mins} min</span>
                <span className={"lcm-tick" + (isDone ? " done" : "")} role="img" aria-label={isDone ? "Completed" : "Not completed"}>
                  {isDone && <DSLC.IconifyIcon name="lucide:check" size={14} color="#fff" strokeWidth={3} />}
                </span>
              </button>
            </li>);
        })}
      </ol>
      <button type="button" className="lcm-continue" onClick={() => goLC(allDone ? LC_URLS.courseDetail : lessonUrlLC(nextIdx))}>
        <DSLC.IconifyIcon name={allDone ? "lucide:check" : "fluent:play-16-filled"} size={16} color={LC_INK.onGold} />
        {allDone ? "Module complete — open course" : "Continue to next lesson"}
      </button>
    </section>);
}

/* ---------------------------------------------------------------- related -- */
function LCRelated() {
  return (
    <section className="lcm-sec" data-screen-label="Related courses">
      <div className="lcm-sec-h"><h2>Related</h2></div>
      <div className="lcm-list">
        {LC_RELATED.map((c) =>
        <button type="button" className="lcm-card lcm-course" key={c.title} onClick={() => goLC(courseUrlLC(c))}>
            <span className="lcm-course-thumb">
              <img src={c.image} alt="" />
              <span className="lcm-course-chip">{c.lessons} lessons</span>
            </span>
            <span className="lcm-course-tx">
              <span className="lcm-eyebrow lcm-eyebrow-gold">{c.level}</span>
              <span className="lcm-course-title">{c.title}</span>
              <span className="lcm-course-blurb">{c.blurb}</span>
            </span>
            <span className="lcm-arrow lcm-arrow-gold" aria-hidden="true">
              <DSLC.IconifyIcon name="lucide:arrow-right" size={18} color={LC_INK.onGold} />
            </span>
          </button>
        )}
      </div>
    </section>);
}

/* ---------------------------------------------------------------- free resources -- */
function LCFreeResources() {
  return (
    <section className="lcm-sec" data-screen-label="Free resources">
      <div className="lcm-sec-h"><h2>Free resources</h2></div>
      <button type="button" className="lcm-card lcm-res" onClick={() => goLC("MySaved.html")}>
        <span className="lcm-res-ic" aria-hidden="true">
          <DSLC.IconifyIcon name="lucide:folder-open" size={22} color={LC_INK.gold} />
        </span>
        <span className="lcm-res-tx">
          <span className="lcm-res-title">Guides, checklists &amp; vein maps</span>
          <span className="lcm-res-sub">Free downloads tailored to your clinic goals, kept in My Saved.</span>
        </span>
        <span className="lcm-arrow lcm-arrow-gold" aria-hidden="true">
          <DSLC.IconifyIcon name="lucide:arrow-right" size={18} color={LC_INK.onGold} />
        </span>
      </button>
    </section>);
}

/* ---------------------------------------------------------------- ramp cards -- */
/* White ink needs the deep-gold ramp (#A26301 → #7A4A03); on the light gold
   white sits at ~2.1:1, so the surface is darkened rather than the text. */
function LCRampCard({ icon, title, body, cta, onClick, label }) {
  return (
    <section className="lcm-sec" data-screen-label={label}>
      <button type="button" className="lcm-ramp" onClick={onClick}>
        <span className="lcm-ramp-ic" aria-hidden="true">
          <DSLC.IconifyIcon name={icon} size={22} color={LC_INK.onRamp} />
        </span>
        <span className="lcm-ramp-tx">
          <span className="lcm-ramp-title">{title}</span>
          <span className="lcm-ramp-body">{body}</span>
          {cta && <span className="lcm-ramp-cta">{cta}</span>}
        </span>
        <span className="lcm-arrow lcm-arrow-white" aria-hidden="true">
          <DSLC.IconifyIcon name="lucide:arrow-right" size={18} color={LC_INK.rampDeep} />
        </span>
      </button>
    </section>);
}

/* ---------------------------------------------------------------- tab bar -- */
function LCTabBar({ compact }) {
  return (
    <nav className={"lm-tabs" + (compact ? " lm-tabs-compact" : "")} aria-label="Primary">
      {LC_TABS.map((t) => {
        const on = t.key === "Learning";
        return (
          <button key={t.key} type="button" className={"lm-tab" + (on ? " on" : "")} aria-current={on ? "page" : undefined}
            onClick={() => t.href && goLC(t.href)}>
            <span className="ic">
              <DSLC.IconifyIcon name={t.icon} size={24} color={on ? (LC_LIGHT ? "#fff" : LC_INK.onGold) : LC_INK.tabOff} />
              {t.dot && <span className="dot">{t.dot}</span>}
            </span>
            <span className="lbl">{t.label}</span>
          </button>);
      })}
    </nav>);
}

/* ---------------------------------------------------------------- screen -- */
function LearningConfidence() {
  const done = useLessonsDoneLC();
  const lessons = LC_MODULE.lessons;

  /* current lesson = first not-yet-completed, else the last one */
  const currentIdx = useMemoLC(() => {
    const i = lessons.findIndex((l) => !lessonDoneLC(l, done));
    return i === -1 ? lessons.length - 1 : i;
  }, [done]);
  const doneInModule = lessons.filter((l) => lessonDoneLC(l, done)).length;
  const courseDone = Math.min(LC_COURSE.totalLessons, LC_COURSE.doneBeforeThisModule + doneInModule);

  const [menuOpen, setMenuOpen] = useStateLC(false);
  const [notifOpen, setNotifOpen] = useStateLC(false);
  const [msgOpen, setMsgOpen] = useStateLC(false);
  const [saved, setSaved] = useStateLC(() => {
    try { return (JSON.parse(localStorage.getItem("pf-saved-courses")) || []).indexOf(LC_COURSE.title) !== -1; } catch (e) { return false; }
  });
  const toggleSave = () => {
    const next = !saved;
    setSaved(next);
    try {
      const list = JSON.parse(localStorage.getItem("pf-saved-courses")) || [];
      const i = list.indexOf(LC_COURSE.title);
      if (next && i === -1) list.push(LC_COURSE.title);
      if (!next && i !== -1) list.splice(i, 1);
      localStorage.setItem("pf-saved-courses", JSON.stringify(list));
    } catch (e) {}
  };

  const scrollRef = useRefLC(null);
  const { hidden, floating } = useHeaderHideLC(scrollRef);

  return (
    <div className={"lcm-screen" + (LC_LIGHT ? " lc-light" : "") + (floating ? " chrome-float" : "") + (hidden ? " chrome-hidden" : "")}
      data-screen-label={"My Learning · Confidence (" + (LC_LIGHT ? "light" : "dark") + ")"}>
      <LCHeader onMenu={() => setMenuOpen(true)} onBell={() => setNotifOpen(true)} onMessages={() => setMsgOpen(true)} />

      <div className="lcm-scroll" ref={scrollRef}>
        <LCProgressCard doneCount={courseDone} total={LC_COURSE.totalLessons} />
        <LCCurrentLesson lesson={lessons[currentIdx]} idx={currentIdx} saved={saved} onSave={toggleSave} />
        <LCModules done={done} currentIdx={currentIdx} nextIdx={currentIdx} />
        <LCRelated />
        <LCFreeResources />
        <LCRampCard label="Discover your journey" icon="lucide:route" title="Discover your journey"
          body="We sequence your next-best courses from Recommended, New & Popular — one clear step at a time toward your goal."
          onClick={() => goLC("AllCoursesMobile.html")} />
        <LCRampCard label="Unlock more with Mastery" icon="lucide:crown" title="Unlock more with Mastery"
          body="Every course in the catalogue, live case reviews and the Mastery community channels."
          cta="See what's included" onClick={() => goLC("MembershipTier.html")} />
      </div>

      <LCTabBar compact={hidden} />
      <SideMenuLC open={menuOpen} onClose={() => setMenuOpen(false)} dark={!LC_LIGHT} onToggleDark={() => goLC(LC_URLS.other)} />
      <NotificationsLC open={notifOpen} onClose={() => setNotifOpen(false)} />
      <MessagesLC open={msgOpen} onClose={() => setMsgOpen(false)} />
    </div>);
}

function useDeviceScaleLC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateLC(calc);
  useEffectLC(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

function useIsMobileLC() {
  const [mobile, setMobile] = useStateLC(() => window.matchMedia("(max-width:768px)").matches);
  useEffectLC(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

function LearningConfidenceApp() {
  const mobile = useIsMobileLC();
  const scale = useDeviceScaleLC();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  const pageBg = LC_LIGHT ? "#F9F7F4" : "#0B1024";
  if (mobile) {
    return <div className="app" style={{ ...vars, background: pageBg }}><LearningConfidence /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: LC_LIGHT ? "rgb(217, 218, 225)" : "#05081a" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={!LC_LIGHT}><LearningConfidence /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<LearningConfidenceApp />);
