/* ===========================================================================
   PROfinity — Course Detail (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -CD to avoid global-scope clashes.
   Reached by tapping any course card on LearningMobile.html via ?course=<slug>.
   =========================================================================== */
const { useState: useStateCD, useEffect: useEffectCD } = React;
const DSCD = window.ProfinityDesignSystem_c2b5cc;

function goCD(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleCD() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateCD(calc);
  useEffectCD(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileCD() {
  const [mobile, setMobile] = useStateCD(() => window.matchMedia('(max-width:768px)').matches);
  useEffectCD(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

/* ---------------------------------------------------------------- generic module template -- */
const CD_GENERIC_SCREENING_BULLETS = [
  "Take a comprehensive medical history (bleeding disorders, neuromuscular diseases, medications).",
  "Screen for contraindications (pregnancy, active infections, known hypersensitivities).",
  "Assess psychological readiness and set realistic expectations."];


function genericModules(instr) {
  return [
  {
    title: "Level 1", pct: 0, open: true, modules: [
    {
      title: "Getting Started", free: true,
      heading: "Foundations you need before your first patient session.",
      bullets: CD_GENERIC_SCREENING_BULLETS,
      lessons: [
      { name: "Orientation", dur: "3:04" },
      { name: "Core Technique Walkthrough", dur: "2:14" },
      { name: "Common Pitfalls to Avoid", dur: "5:24" }]

    }]

  },
  { title: "Level 2", pct: 0, open: false, modules: [] },
  { title: "Level 3", pct: 0, open: false, modules: [] },
  { title: "End of Success Path Quiz", pct: 0, open: false, modules: [] }];

}

/* ---------------------------------------------------------------- course data -- */
const COURSES_CD = {
  "toxin-battle": {
    slug: "toxin-battle",
    crumb: "Courses",
    title: "Toxin Battle with Julie Bass Kaplan",
    headline: "Julie Bass Kaplan Reveals Her Secrets to Achieving Optimal Toxin Injection Results",
    tagline: "Stop feeling uncertain about your abilities. Start injecting with confidence and transforming your patients' appearance.",
    longDesc: "This transformative, 2hr 36 min video—filled with advanced toxin techniques for the upper face, lower face, and neck from two industry leaders—will guide you in elevating your practice and delivering exceptional patient outcomes.",
    pct: 0,
    duration: "1-2 Read",
    modulesCount: "1 Module",
    level: "All Level",
    certification: "Included",
    heroFaces: ["assets/avatar-mark-ellis.jpg", "assets/avatar-drtim.png", "assets/avatar-priya-shah.jpg"],
    heroBattle: "UK vs USA",
    heroFace: "TECHNIQUE FACE OFF",
    aboutParas: [
    "We don't like to say this upgrade is mandatory, but we HIGHLY RECOMMEND it!",
    "If you're going to invest in mastering advanced toxin technique, you really need to learn how to manage potential eye complications so you can deliver the best results and protect your practice."],

    learn: [
    "How to identify, prevent, and manage the 12 most serious eye-related toxin complications and side-effects (the vast majority of new injectors discover these secrets the HARD WAY!)",
    "Step-by-step protocols for handling complications swiftly and effectively, so you can keep your patients safe, satisfied and singing your praises",
    "Proven scripts for communicating with patients about complications, so you don't stumble over your words or say the wrong thing",
    "Stunning 3D graphics that will instantly 10x your understanding of anatomy and each complication",
    "Proven injection strategies to minimise risk and ensure optimal results, even in the most challenging cases, so you feel confident taking on the most advanced treatments (and charging accordingly!)"],

    modLevelCount: "6 Level", modCourseCount: "27 Course", modLength: "1h 13m total length",
    levels: [
    {
      title: "Level 1", pct: 0, open: true, modules: [
      {
        title: "Diagnosis", free: true,
        heading: "How to diagnose, treat and most of all understand how to avoid Eyelid Ptosis from Botox treatment.",
        bullets: CD_GENERIC_SCREENING_BULLETS,
        lessons: [
        { name: "Treatment", dur: "3:04" },
        { name: "Technique reducing the risk of Eyelid Ptosis", dur: "2:14" },
        { name: "Treatment Avoidance", dur: "5:24" }]

      },
      {
        title: "Brow Ptosis", free: true,
        heading: "How to Select Patients & Conduct Medical Screening",
        bullets: CD_GENERIC_SCREENING_BULLETS,
        lessons: [
        { name: "Consultation", dur: "3:04" },
        { name: "Avoiding Forehead Paralysis", dur: "2:14" },
        { name: "Managing Asymmetries", dur: "5:24" }]

      }]

    },
    {
      title: "Level 2", pct: 0, open: true, modules: [
      {
        title: "Upper Eyelid Lift", free: false,
        heading: "Indications and Surgical Techniques for Upper Eyelid Lift",
        bullets: [
        "Evaluate eyelid skin laxity and excess fat.",
        "Discuss surgical options (traditional vs. minimally invasive techniques).",
        "Ensure patient understands post-operative care and recovery."],

        lessons: [
        { name: "Preparation", dur: "1:42" },
        { name: "Glabellar Region Injections", dur: "3:22" },
        { name: "Treating Marionette Lines", dur: "4:39" }]

      }]

    },
    { title: "Level 3", pct: 0, open: false, modules: [] },
    { title: "Level 4", pct: 0, open: false, modules: [] },
    { title: "End of Success Path Quiz", pct: 0, open: false, modules: [] }],

    instructor: { name: "Dr Tim Pearce", role: "Medical Doctor | Leading Aesthetic Clinician & Educator | Clinical Director | Longevity Advocate", avatar: "assets/avatar-drtim.png" }
  }
};

function slugifyCD(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PF_PURCHASED_KEY_CD = "pf-purchased-courses";

function isPurchasedCD(slug) {
  try { return (JSON.parse(localStorage.getItem(PF_PURCHASED_KEY_CD)) || []).includes(slug); } catch (e) { return false; }
}

function buildCheckoutUrlCD(course) {
  const p = new URLSearchParams({ title: course.title, instr: course.instructor.name, grad: course.heroGrad || "", price: course.price || 0 });
  if (COURSES_CD[course.slug]) p.set("course", course.slug);
  return "CourseCheckout.html?" + p.toString();
}

function buildGenericCourse(params) {
  const title = params.get("title") || "Course";
  const instr = params.get("instr") || "Dr. Tim Pearce";
  const dur = params.get("dur") || "45m";
  const grad = params.get("grad") || "linear-gradient(140deg,#6172f3 0%,#3b82f6 100%)";
  const pct = Number(params.get("pct") || 0);
  const price = Number(params.get("price") || 0);
  return {
    slug: slugifyCD(title),
    crumb: "Courses",
    title: title,
    headline: title,
    tagline: `with ${instr}`,
    longDesc: `A focused, ${dur} lesson guiding you step-by-step through the technique — filled with practical protocols and real clinic scenarios to help you deliver confident, consistent results.`,
    pct: pct,
    price: price,
    duration: dur,
    modulesCount: "1 Module",
    level: "All Level",
    certification: "Included",
    heroFaces: null,
    heroGrad: grad,
    aboutParas: [
    "We don't like to say this course is essential, but we HIGHLY RECOMMEND it!",
    "Mastering this technique will help you deliver safer, more predictable results and protect your practice's reputation."],

    learn: [
    "Step-by-step protocols you can apply in your very next clinic session",
    "How to spot and avoid the most common mistakes new injectors make",
    "Proven scripts for talking patients through the treatment with confidence",
    "Clear anatomy visuals to speed up your understanding of each technique"],

    modLevelCount: "4 Level", modCourseCount: "12 Course", modLength: dur + " total length",
    levels: genericModules(instr),
    instructor: { name: "Dr Tim Pearce", role: "Medical Doctor | Leading Aesthetic Clinician & Educator | Clinical Director | Longevity Advocate", avatar: "assets/avatar-drtim.png" }
  };
}

function getCourseCD() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("course");
  if (slug && COURSES_CD[slug]) return COURSES_CD[slug];
  if (params.get("title")) return buildGenericCourse(params);
  return COURSES_CD["toxin-battle"];
}

/* ---------------------------------------------------------------- pieces -- */
function CDHero({ course }) {
  return (
    <div className="cd-hero" style={course.heroFaces ? null : { background: course.heroGrad }}>
      {course.heroFaces ?
      <>
          <div className="cd-hero-battle">
            <span className="cd-hero-flag">🇬🇧</span>
            <span className="cd-hero-vs">BATTLE<br />{course.heroBattle}</span>
            <span className="cd-hero-flag">🇺🇸</span>
          </div>
          <span className="cd-hero-tag">{course.heroFace}</span>
          <div className="cd-hero-faces">
            {course.heroFaces.map((f, i) => <img key={i} src={f} alt="" className="cd-hero-face" />)}
          </div>
        </> :

      <span className="cd-hero-tag" style={{ position: "static", marginBottom: 8 }}>{course.duration}</span>}

      <button type="button" className="cd-replay" onClick={() => {}} aria-label={course.heroFaces ? "Replay video" : "Preview course"}>
        <DSCD.IconifyIcon name="fluent:play-16-filled" size={16} color="var(--brand-navy)" />
        {course.heroFaces ? "REPLAY" : "PREVIEW"}
      </button>
    </div>);

}

function CDMeta({ course }) {
  const items = [
  { icon: "lucide:clock", label: "Duration", value: course.duration },
  { icon: "lucide:layers", label: "Modules", value: course.modulesCount },
  { icon: "lucide:bar-chart-2", label: "Level", value: course.level },
  { icon: "lucide:award", label: "Certification", value: course.certification }];

  return (
    <div className="cd-meta">
      {items.map((it, i) =>
      <div className="cd-meta-item" key={i}>
          <DSCD.IconifyIcon name={it.icon} size={20} color="var(--gray-450)" />
          <span className="cd-meta-label">{it.label}</span>
          <span className="cd-meta-value">{it.value}</span>
        </div>
      )}
    </div>);

}

function CDLessonRow({ lesson, course, levelIdx, moduleIdx, lessonIdx }) {
  return (
    <div className="cd-lesson">
      <DSCD.IconifyIcon name="fluent:play-16-filled" size={15} color="var(--brand-navy)" />
      <a href={`Lesson.html?course=${course.slug}&level=${levelIdx}&module=${moduleIdx}&lesson=${lessonIdx}`}
      className="cd-lesson-name"
      onClick={(e) => {e.preventDefault();goCD(e.currentTarget.getAttribute("href"));}}>{lesson.name}</a>
      <span className="cd-lesson-dur">{lesson.dur}</span>
    </div>);

}

function CDModuleCard({ mod, course, levelIdx, moduleIdx }) {
  return (
    <div className="cd-module">
      <div className="cd-module-head">
        <span className="cd-module-title">{mod.title}</span>
        {mod.free && <span className="cd-module-free">Free</span>}
      </div>
      <div className="cd-module-heading">{mod.heading}</div>
      <ul className="cd-module-bullets">
        {mod.bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <div className="cd-module-lessons">
        {mod.lessons.map((l, i) =>
        <CDLessonRow lesson={l} course={course} levelIdx={levelIdx} moduleIdx={moduleIdx} lessonIdx={i} key={i} />
        )}
      </div>
    </div>);

}

function CDLevel({ level, pulse, course, levelIdx }) {
  const [open, setOpen] = useStateCD(!!level.open);
  useEffectCD(() => { if (pulse) setOpen(pulse.value); }, [pulse && pulse.id]);
  return (
    <div className="cd-level">
      <button type="button" className="cd-level-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{level.title}</span>
        <span className="cd-level-right">
          <span className="cd-level-pct">{level.pct}%</span>
          <DSCD.IconifyIcon name={open ? "lucide:chevron-up" : "lucide:chevron-down"} size={18} color="#fff" />
        </span>
      </button>
      {open && level.modules.length > 0 &&
      <div className="cd-level-body">
          {level.modules.map((m, i) => <CDModuleCard mod={m} course={course} levelIdx={levelIdx} moduleIdx={i} key={i} />)}
        </div>}

    </div>);

}

function CDModules({ course }) {
  const [pulse, setPulse] = useStateCD(null);
  const nextValue = pulse ? !pulse.value : true;
  return (
    <section className="cd-modules-section">
      <div className="cd-sec-head"><h2>Modules</h2></div>
      <label className="cd-search">
        <DSCD.IconifyIcon name="lucide:search" size={18} color="var(--gray-450)" />
        <input type="text" placeholder="Search lesson…" aria-label="Search lesson" />
      </label>
      <div className="cd-modules-meta">
        <span>{course.modLevelCount} • {course.modCourseCount} • {course.modLength}</span>
        <button type="button" className="cd-expand-all" onClick={() => setPulse({ id: Date.now(), value: nextValue })}>
          {nextValue ? "Expand all sections" : "Collapse all sections"}
        </button>
      </div>
      <div className="cd-levels">
        {course.levels.map((lvl, i) => <CDLevel level={lvl} pulse={pulse} course={course} levelIdx={i} key={i} />)}
      </div>
    </section>);

}

function CDInstructor({ instructor }) {
  return (
    <section className="cd-instructor">
      <h2>Your Instructor</h2>
      <div className="cd-instructor-row">
        <img src={instructor.avatar} alt={instructor.name} className="cd-instructor-avatar" />
        <div className="cd-instructor-info">
          <div className="cd-instructor-name">{instructor.name}</div>
          <div className="cd-instructor-role">{instructor.role}</div>
        </div>
      </div>
    </section>);

}

function CourseDetail() {
  const course = getCourseCD();
  const purchased = !course.price || isPurchasedCD(course.slug);
  const ctaLabel = purchased ? "Start Now" : `Buy Now — £${course.price}`;
  const handleCta = () => goCD(purchased ? "LearningMobile.html" : buildCheckoutUrlCD(course));

  return (
    <div className="cd-screen" data-screen-label="Course Detail (mobile)">
      <header className="cd-top">
        <button className="cd-back" aria-label="Back" onClick={() => goCD("LearningMobile.html")}>
          <DSCD.IconifyIcon name="lucide:chevron-left" size={22} color="var(--brand-navy)" />
        </button>
        <div className="cd-top-titles">
          <h1>{course.crumb}</h1>
          <div className="cd-top-sub">{course.title}</div>
        </div>
      </header>

      <div className="cd-scroll">
        <CDHero course={course} />

        <div className="cd-body">
          <h1 className="cd-headline">{course.headline}</h1>
          <p className="cd-tagline">{course.tagline}</p>
          <p className="cd-longdesc">{course.longDesc}</p>

          <div className="cd-progress-row">
            <span className="cd-progress-label">Start Now</span>
            <span className="cd-progress-pct">{course.pct}%</span>
          </div>
          <div className="cd-bar"><span style={{ width: course.pct + "%" }} /></div>

          <CDMeta course={course} />

          <button type="button" className="cd-start" onClick={handleCta}>{ctaLabel}</button>

          <div className="cd-divider" />

          <section className="cd-about">
            <h2>About this course</h2>
            {course.aboutParas.map((p, i) => <p key={i}>{p}</p>)}
          </section>

          <section className="cd-learn">
            <h2>What you'll learn</h2>
            <ul>
              {course.learn.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </section>

          <div className="cd-divider" />

          <CDModules course={course} />

          <div className="cd-divider" />

          <CDInstructor instructor={course.instructor} />
        </div>
      </div>

      <div className="cd-cta">
        <button type="button" className="cd-cta-btn" onClick={handleCta}>{ctaLabel}</button>
      </div>
    </div>);

}

function CourseDetailApp() {
  const mobile = useIsMobileCD();
  const scale = useDeviceScaleCD();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><CourseDetail /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><CourseDetail /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CourseDetailApp />);
