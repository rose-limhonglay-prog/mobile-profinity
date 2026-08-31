/* ===========================================================================
   PROfinity — Course Landing (web)
   Overview/enrollment page for the PROfinity Membership, reached from a
   My Learning course tile before entering the in-course experience
   (CourseWeb.html). Suffixed -CL to avoid clashing with other page globals.
   =========================================================================== */
const { useState: useStateCL } = React;
const DSCL = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavCL, IconifyIcon: IconCL, LevelBadge: LevelBadgeCL, Spark: SparkCL } = DSCL;

const ME_CL = { name: "Rose Lim", role: "PROfinity Team", avatar: "assets/avatar-katy.jpg" };

function goCL(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateCL(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goCL(u);
}
function continueCL() { goCL("CourseWeb.html?course=8d-lips"); }

const COURSE_CL = {
  title: "PROfinity Membership",
  category: "PROfinity Membership · All access",
  level: "All Levels",
  bannerImage: "assets/course-membership-banner.jpg",
  description: "A comprehensive membership giving you ongoing protocols, weekly demos, marketing resources, and community support.",
  instructor: { name: "Dr Tim Pearce", role: "Clinical Director · PROfinity Academy", avatar: "assets/avatar-drtim.png" },
  instructorBio: "Medical Doctor · Leading Aesthetic Clinician & Educator · Clinical Director · Longevity Advocate",
  progress: 14,
  aboutParas: [
    "A comprehensive membership giving you ongoing protocols, weekly demos, marketing resources, and community support."
  ],
  included: [
    { icon: "lucide:book-open", text: "Full course access" },
    { icon: "lucide:award", text: "Certificate on completion" },
    { icon: "lucide:clipboard-check", text: "End-of-course assessment" },
    { icon: "lucide:refresh-cw", text: "Lifetime access & future updates" }
  ],
  learn: [
    "Access comprehensive protocols for complications, botox, and anatomy",
    "Watch Technique Tuesday weekly injection demonstrations",
    "Use social media templates and marketing resources",
    "Get real-time support from the PROfinity community"
  ],
  sectionsSummary: "22 sections • 258 lectures",
  sections: [
    { title: "START HERE", open: true, lessons: [
      { name: "Step 1. Welcome from Dr Tim", kind: "video" },
      { name: "Step 2. Join the next onboarding call", kind: "article" },
      { name: "Your Member Discounts", kind: "article" }
    ] },
    { title: "Get Help With Complications", open: true, lessons: [
      { name: "Complications Resources", kind: "article" }
    ] },
    { title: "Technique Tuesday", lessons: [], subs: [
      { title: "Lip Filler Technique", lessons: [
        { name: "Linear threading technique", kind: "video" },
        { name: "Tenting technique", kind: "video" },
        { name: "Cannula approach", kind: "video" }
      ] },
      { title: "Case Studies", lessons: [
        { name: "Case 1: thin lips, first treatment", kind: "video" },
        { name: "Case 2: correction of migrated filler", kind: "video" }
      ] },
      { title: "Downloads & Resources", lessons: [
        { name: "Technique recipe cards (PDF)", kind: "pdf" },
        { name: "Consent form templates (PDF)", kind: "pdf" }
      ] }
    ] },
    { title: "Treatments", count: 24, lessons: [] },
    { title: "Marketing", count: 6, lessons: [] },
    { title: "Sales", count: 3, lessons: [] },
    { title: "Library & Protocols", count: 9, lessons: [] },
    { title: "The Vault", count: 128, lessons: [] }
  ]
};

const META_CL = [
  { icon: "lucide:clock", key: "Duration", value: "147h 34m" },
  { icon: "lucide:layers", key: "Sections", value: "22 sections" },
  { icon: "lucide:bar-chart-2", key: "Level", value: COURSE_CL.level },
  { icon: "lucide:award", key: "Certificate", value: "Included" }
];

function sectionLessonCount(s) {
  const subCount = (s.subs || []).reduce((total, sub) => total + sub.lessons.length, 0);
  return (s.lessons.length + subCount) || s.count || 0;
}

function CLCrumb() {
  return (
    <div className="cl-crumb-row">
      <button type="button" className="cl-back-btn" aria-label="Back to My Learning" onClick={() => goCL("MyLearning.html")}>
        <IconCL name="lucide:arrow-left" size={19} color="var(--brand-navy)" />
      </button>
      <span className="cl-crumb">
        <a onClick={() => goCL("MyLearning.html")}>My Learning</a> &nbsp;/&nbsp; <span>{COURSE_CL.title}</span>
      </span>
    </div>
  );
}

function CLMetaItem({ m }) {
  return (
    <div className="cl-meta-item">
      <span className="cl-meta-key"><IconCL name={m.icon} size={16} color="var(--brand-navy)" />{m.key}</span>
      <span className="cl-meta-val">{m.value}</span>
    </div>
  );
}

function CLHero({ course }) {
  return (
    <section className="cl-card cl-hero-card">
      <div className="cl-hero-media">
        <img src={course.bannerImage} alt="" />
      </div>
      <div className="cl-hero-body">
        <div className="cl-badge-row">
          <LevelBadgeCL level={course.level} />
          <span className="cl-category">{course.category}</span>
        </div>
        <h1 className="cl-title">{course.title}</h1>
        <p className="cl-sub">{course.description}</p>
        <div className="cl-instr-row">
          <img className="cl-instr-avatar" src={course.instructor.avatar} alt="" />
          <span className="cl-instr-text">
            <span className="cl-instr-name">{course.instructor.name}</span>
            <span className="cl-instr-role">{course.instructor.role}</span>
          </span>
        </div>
        <div className="cl-meta-row">
          {META_CL.map((m, i) => <CLMetaItem m={m} key={i} />)}
        </div>
      </div>
    </section>
  );
}

function CLAbout({ course }) {
  return (
    <section className="cl-card cl-about">
      <h2>About this course</h2>
      {course.aboutParas.map((p, i) => <p key={i}>{p}</p>)}
    </section>
  );
}

function CLLearn({ course }) {
  return (
    <section className="cl-card cl-learn">
      <h2>What you'll learn</h2>
      <div className="cl-learn-grid">
        {course.learn.map((l, i) => (
          <div className="cl-learn-item" key={i}>
            <span className="cl-learn-tick"><IconCL name="lucide:check" size={13} color="#fff" /></span>
            {l}
          </div>
        ))}
      </div>
    </section>
  );
}

function CLLessonRow({ lesson }) {
  const isVideo = lesson.kind === "video";
  return (
    <div className="cl-lesson">
      <IconCL name={isVideo ? "lucide:play-circle" : "lucide:file-text"} size={17} color="var(--brand-navy)" />
      <span className="cl-lesson-name">{lesson.name}</span>
      <span className="cl-lesson-badge">{isVideo ? "Video" : "Article"}</span>
    </div>
  );
}

function CLSubLessonRow({ lesson }) {
  const pdf = lesson.kind === "pdf";
  const isVideo = lesson.kind === "video";
  return (
    <div className="cl-sub-lesson">
      <IconCL name={pdf ? "lucide:file-text" : "lucide:play-circle"} size={15} color="var(--brand-navy)" />
      <span className="cl-sub-lesson-name">{lesson.name}</span>
      <span className="cl-sub-lesson-badge">{pdf ? "PDF" : isVideo ? "Video" : "Article"}</span>
    </div>
  );
}

function CLSubModule({ sub }) {
  const [open, setOpen] = useStateCL(!!sub.open);
  return (
    <div className={"cl-sub" + (open ? " open" : "")}>
      <button type="button" className="cl-sub-hd" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <IconCL name={open ? "lucide:folder-open" : "lucide:folder"} size={17} color="var(--brand-gold)" />
        <span className="cl-sub-title">{sub.title}</span>
        <span className="cl-sub-n">{sub.lessons.length}</span>
        <IconCL name={open ? "lucide:chevron-up" : "lucide:chevron-down"} size={18} color="var(--gray-450)" />
      </button>
      {open && (
        <div className="cl-sub-body">
          {sub.lessons.map((l, i) => <CLSubLessonRow lesson={l} key={i} />)}
        </div>
      )}
    </div>
  );
}

function CLSection({ section, index, open, onToggle }) {
  const count = sectionLessonCount(section);
  const hasBody = section.lessons.length > 0 || (section.subs && section.subs.length > 0);
  return (
    <div className={"cl-acc" + (open ? " open" : "")}>
      <button type="button" className="cl-acc-hd" onClick={onToggle} aria-expanded={open}>
        <span className="cl-acc-chip">{index + 1}</span>
        <span className="cl-acc-text">
          <span className="cl-acc-title">{section.title}</span>
          <span className="cl-acc-sub">{count} lesson{count === 1 ? "" : "s"}</span>
        </span>
        <IconCL name={open ? "lucide:chevron-up" : "lucide:chevron-down"} size={20} color="var(--gray-500)" />
      </button>
      {open && hasBody && (
        <div className="cl-acc-body">
          {section.lessons.map((l, i) => <CLLessonRow lesson={l} key={i} />)}
          {(section.subs || []).map((s, i) => <CLSubModule sub={s} key={i} />)}
        </div>
      )}
    </div>
  );
}

function CLCurriculum({ course, openSet, onToggle, onExpandAll, query, onQuery }) {
  const q = query.trim().toLowerCase();
  const visible = course.sections
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => !q || s.title.toLowerCase().includes(q) || s.lessons.some((l) => l.name.toLowerCase().includes(q)) ||
      (s.subs || []).some((sub) => sub.title.toLowerCase().includes(q) || sub.lessons.some((l) => l.name.toLowerCase().includes(q))));
  return (
    <section className="cl-card cl-curriculum">
      <div className="cl-curr-head">
        <div>
          <h2>Course content</h2>
          <div className="cl-curr-sub">{course.sectionsSummary}</div>
        </div>
        <div className="cl-curr-tools">
          <label className="cl-search">
            <IconCL name="lucide:search" size={17} color="var(--gray-450)" />
            <input placeholder="Search lesson…" aria-label="Search lesson" value={query} onChange={(e) => onQuery(e.target.value)} />
          </label>
          <button type="button" className="cl-expand-all" onClick={onExpandAll}>
            {openSet.size === course.sections.length ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>
      <div className="cl-sections">
        {visible.length === 0 && <div className="cl-no-results">No lessons match "{query}".</div>}
        {visible.map(({ s, i }) => (
          <CLSection section={s} index={i} key={i} open={openSet.has(i) || (!!q && (s.title.toLowerCase().includes(q)))} onToggle={() => onToggle(i)} />
        ))}
      </div>
    </section>
  );
}

function CLInstructor({ course }) {
  return (
    <section className="cl-card cl-instructor">
      <h2>Your instructor</h2>
      <div className="cl-instructor-row">
        <img src={course.instructor.avatar} alt={course.instructor.name} />
        <div className="cl-instructor-info">
          <div className="cl-instructor-name">{course.instructor.name}</div>
          <div className="cl-instructor-bio">{course.instructorBio}</div>
        </div>
      </div>
    </section>
  );
}

function CLSide({ course }) {
  return (
    <aside className="cl-side">
      <div className="cl-side-card">
        <div className="cl-side-thumb"><img src={course.bannerImage} alt="" /></div>
        <div className="cl-side-body">
          <div className="cl-free">
            <IconCL name="fluent:shield-checkmark-16-filled" size={20} color="var(--brand-navy)" />
            Free access
          </div>
          <div className="cl-progress">
            <span className="cl-progress-bar"><span style={{ width: course.progress + "%" }} /></span>
            <span className="cl-progress-label">{course.progress}% complete</span>
          </div>
          <button type="button" className="cl-continue" onClick={continueCL}>
            <IconCL name="fluent:play-16-filled" size={18} color="#fff" />
            Continue Learning
          </button>
          <div className="cl-included">
            <div className="cl-included-h">What's included:</div>
            {course.included.map((it, i) => (
              <div className="cl-included-row" key={i}>
                <IconCL name={it.icon} size={19} color="var(--brand-navy)" />
                {it.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cl-ava-card">
        <div className="cl-ava-head">
          <SparkCL size={20} color="var(--brand-gold)" />
          <span>Ask Ava about this course</span>
        </div>
        <p className="cl-ava-desc">Not sure if this is your next best step? Ava can tell you how it maps to your goal.</p>
        <button type="button" className="cl-ava-btn" onClick={() => goCL("Agent.html")}>
          Ask Ava
          <IconCL name="lucide:arrow-up-right" size={16} color="var(--brand-navy)" />
        </button>
      </div>
    </aside>
  );
}

function CourseLandingApp() {
  const course = COURSE_CL;
  const [openSet, setOpenSet] = useStateCL(
    () => new Set(course.sections.map((s, i) => i).filter((i) => course.sections[i].open))
  );
  const [query, setQuery] = useStateCL("");
  React.useEffect(() => { document.title = "PROfinity — " + course.title; }, []);
  function toggleSection(i) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }
  function expandAll() {
    setOpenSet((prev) =>
      prev.size === course.sections.length
        ? new Set()
        : new Set(course.sections.map((_, i) => i))
    );
  }
  return (
    <div className="app" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavCL active="My Learning" user={ME_CL} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateCL}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="cl-page" data-screen-label="Course Landing (web)">
        <CLCrumb />
        <div className="cl-grid">
          <div className="cl-main">
            <CLHero course={course} />
            <CLAbout course={course} />
            <CLLearn course={course} />
            <CLCurriculum course={course} openSet={openSet} onToggle={toggleSection} onExpandAll={expandAll}
              query={query} onQuery={setQuery} />
            <CLInstructor course={course} />
          </div>
          <CLSide course={course} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CourseLandingApp />);
