/* ===========================================================================
   PROfinity — All Courses (mobile) · iPhone 17 Pro Max
   Full course catalog: search + Recommended/New/Popular filter pills over a
   two-column grid of every course on the platform.
   Suffixed -AC to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateAC } = React;
const DSAC = window.ProfinityDesignSystem_c2b5cc;
const { LevelBadge: LevelBadgeAC, IconifyIcon: IconifyAC, Icon: IconAC } = DSAC;

function goAC(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

const TUTOR_AC = "Dr Tim Pearce";
const IMG_AC = {
  eightDLip: "assets/course-8d-lip-design.jpg",
  templeFiller: "assets/course-temple-filler.webp",
  protox: "assets/course-protox.png",
  browLift: "assets/course-brow-lift.jpg",
  fullFace: "assets/course-full-face-rejuvenation.jpg",
  cheekContouring: "assets/course-cheek-contouring.jpg",
  rhinoplasty: "assets/course-rhinoplasty.jpg",
  jawlineSculpting: "assets/course-jawline-sculpting.jpg",
  tearTrough: "assets/course-tear-trough.jpg",
  skinBoosters: "assets/course-skin-boosters.jpg",
  complications: "assets/course-complications.jpg",
  consultation: "assets/course-consultation.jpg",
};

const AC_FILTERS = ["All", "Recommended", "New", "Popular"];

const AC_COURSES = [
{ image: IMG_AC.eightDLip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of lip anatomy for deeper learning.", tags: ["Recommended", "Popular"] },
{ image: IMG_AC.templeFiller, level: "Advanced", title: "Temple Filler", description: "Master safe injection techniques with anatomical precision.", tags: ["Recommended"] },
{ image: IMG_AC.protox, level: "Advanced", title: "Protox Course", description: "Elevate your botulinum toxin skills and refine your technique.", tags: ["Recommended", "Popular"] },
{ image: IMG_AC.browLift, level: "Intermediate", title: "Brow Lift Training", description: "Learn expert techniques for achieving flawless, natural brow lifts.", tags: ["New"] },
{ image: IMG_AC.fullFace, level: "Advanced", title: "Full-Face Rejuvenation Protocol", description: "A complete framework for combination treatments across the face.", tags: ["New", "Recommended"] },
{ image: IMG_AC.cheekContouring, level: "Intermediate", title: "Cheek & Midface Contouring", description: "Master volumising techniques for natural-looking cheek definition.", tags: ["Popular"] },
{ image: IMG_AC.rhinoplasty, level: "Advanced", title: "Non-Surgical Rhinoplasty", description: "Reshape and refine the nose using dermal filler with confidence.", tags: ["New"] },
{ image: IMG_AC.jawlineSculpting, level: "Advanced", title: "Jawline Sculpting Masterclass", description: "Define and balance the lower face with precision filler technique.", tags: ["New", "Popular"] },
{ image: IMG_AC.tearTrough, level: "Advanced", title: "Tear Trough Correction", description: "Safely treat under-eye hollowing with anatomically-guided technique.", tags: ["Popular"] },
{ image: IMG_AC.skinBoosters, level: "Beginner", title: "Skin Boosters & Hydration Therapy", description: "Introduce biorevitalisation treatments to improve skin quality.", tags: ["Recommended"] },
{ image: IMG_AC.complications, level: "Advanced", title: "Complications Management", description: "Recognise, prevent and manage vascular and other complications.", tags: ["New"] },
{ image: IMG_AC.consultation, level: "Beginner", title: "Consultation & Patient Assessment", description: "Build trust and plan safe, effective treatments from the first visit.", tags: ["Recommended", "Popular"] }];


const AC_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" },
{ key: "Rewards", label: "Rewards", icon: "lucide:gift", href: null }];


function ACTabBar() {
  return (
    <nav className="lm-tabs" aria-label="Primary">
      {AC_TABS.map((t) =>
      <button key={t.key} className={"lm-tab" + (t.key === "Learning" ? " on" : "")}
      aria-current={t.key === "Learning" ? "page" : undefined} onClick={() => t.href && goAC(t.href)}>
          <span className="ic">
            <IconifyAC name={t.icon} size={24} color={t.key === "Learning" ? "#fff" : "#000"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          <span className="lbl">{t.label}</span>
        </button>
      )}
    </nav>);

}

function ACCourseCard({ c }) {
  return (
    <article className="lm2-coursecard ac-coursecard">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <LevelBadgeAC level={c.level} className="lvl" />
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="ds">{c.description}</div>
        <div className="by">{TUTOR_AC}</div>
        <div className="foot">
          <button type="button" className="lm-ghost" onClick={() => goAC("CourseDetail.html")}>Learn More</button>
        </div>
      </div>
    </article>);

}

function AllCoursesHome() {
  const [query, setQuery] = useStateAC("");
  const [filter, setFilter] = useStateAC("All");

  const courses = AC_COURSES.filter((c) => {
    if (filter !== "All" && !c.tags.includes(filter)) return false;
    if (query.trim() && !c.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="ac-screen" data-screen-label="All Courses">
      <header className="ac-head">
        <button type="button" className="ac-back" aria-label="Back" onClick={() => goAC("LearningMobile.html")}>
          <IconifyAC name="lucide:arrow-left" size={22} color="var(--brand-navy)" />
        </button>
        <span className="ac-title">All Courses</span>
        <span className="spacer" aria-hidden="true" />
      </header>
      <div className="ac-scroll">
        <label className="ac-search">
          <IconAC name="search" size={20} color="var(--gray-450)" />
          <input placeholder="Search courses…" aria-label="Search courses" value={query}
            onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="ac-filters" role="tablist" aria-label="Filter courses">
          {AC_FILTERS.map((f) =>
          <button key={f} type="button" role="tab" aria-selected={filter === f}
          className={"ac-filter" + (filter === f ? " on" : "")} onClick={() => setFilter(f)}>
              {f}
            </button>
          )}
        </div>
        {courses.length === 0 ?
        <p className="ac-empty">No courses match your search.</p> :

        <div className="ac-grid">
            {courses.map((c, i) => <ACCourseCard key={i} c={c} />)}
          </div>
        }
        <div style={{ height: 20 }} />
      </div>
      <ACTabBar />
    </div>);

}

function useDeviceScaleAC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateAC(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileAC() {
  const [mobile, setMobile] = useStateAC(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function AllCoursesMobileApp() {
  const mobile = useIsMobileAC();
  const scale = useDeviceScaleAC();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><AllCoursesHome /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><AllCoursesHome /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AllCoursesMobileApp />);
