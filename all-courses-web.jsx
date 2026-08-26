/* ===========================================================================
   PROfinity — All Courses (web)
   Full course catalog for desktop: search + Recommended/New/Popular filter
   pills over a responsive grid of every course on the platform. Reached from
   the "Discover your journey" promo on MyLearning.html (learning.jsx). Mirrors
   the mobile catalog (all-courses-mobile.jsx) on the web page shell (TopNav +
   centered column) instead of the phone frame + bottom tab dock.
   Suffixed -ACW to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateACW } = React;
const DSACW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavACW, LevelBadge: LevelBadgeACW, IconifyIcon: IconifyACW, Icon: IconACW } = DSACW;

const ME_ACW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const TUTOR_ACW = "Dr Tim Pearce";

function goACW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateACW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goACW(u);
}

const IMG_ACW = {
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

const ACW_FILTERS = ["All", "Recommended", "New", "Popular"];

const ACW_COURSES = [
  { image: IMG_ACW.eightDLip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of lip anatomy for deeper learning.", tags: ["Recommended", "Popular"] },
  { image: IMG_ACW.templeFiller, level: "Advanced", title: "Temple Filler", description: "Master safe injection techniques with anatomical precision.", tags: ["Recommended"] },
  { image: IMG_ACW.protox, level: "Advanced", title: "Protox Course", description: "Elevate your botulinum toxin skills and refine your technique.", tags: ["Recommended", "Popular"] },
  { image: IMG_ACW.browLift, level: "Intermediate", title: "Brow Lift Training", description: "Learn expert techniques for achieving flawless, natural brow lifts.", tags: ["New"] },
  { image: IMG_ACW.fullFace, level: "Advanced", title: "Full-Face Rejuvenation Protocol", description: "A complete framework for combination treatments across the face.", tags: ["New", "Recommended"] },
  { image: IMG_ACW.cheekContouring, level: "Intermediate", title: "Cheek & Midface Contouring", description: "Master volumising techniques for natural-looking cheek definition.", tags: ["Popular"] },
  { image: IMG_ACW.rhinoplasty, level: "Advanced", title: "Non-Surgical Rhinoplasty", description: "Reshape and refine the nose using dermal filler with confidence.", tags: ["New"] },
  { image: IMG_ACW.jawlineSculpting, level: "Advanced", title: "Jawline Sculpting Masterclass", description: "Define and balance the lower face with precision filler technique.", tags: ["New", "Popular"] },
  { image: IMG_ACW.tearTrough, level: "Advanced", title: "Tear Trough Correction", description: "Safely treat under-eye hollowing with anatomically-guided technique.", tags: ["Popular"] },
  { image: IMG_ACW.skinBoosters, level: "Beginner", title: "Skin Boosters & Hydration Therapy", description: "Introduce biorevitalisation treatments to improve skin quality.", tags: ["Recommended"] },
  { image: IMG_ACW.complications, level: "Advanced", title: "Complications Management", description: "Recognise, prevent and manage vascular and other complications.", tags: ["New"] },
  { image: IMG_ACW.consultation, level: "Beginner", title: "Consultation & Patient Assessment", description: "Build trust and plan safe, effective treatments from the first visit.", tags: ["Recommended", "Popular"] },
];

function goToCourseACW(c) {
  const url = `CourseWeb.html?${new URLSearchParams({ title: c.title, instr: TUTOR_ACW, pct: 0 })}`;
  goACW(url);
}

function ACWCourseCard({ c }) {
  return (
    <article className="acw-coursecard">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <LevelBadgeACW level={c.level} className="lvl" />
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="ds">{c.description}</div>
        <div className="by">{TUTOR_ACW}</div>
        <button type="button" className="acw-cta" onClick={() => goToCourseACW(c)}>Learn More</button>
      </div>
    </article>
  );
}

function AllCoursesWebApp() {
  const [query, setQuery] = useStateACW("");
  const [filter, setFilter] = useStateACW("All");

  const courses = ACW_COURSES.filter((c) => {
    if (filter !== "All" && !c.tags.includes(filter)) return false;
    if (query.trim() && !c.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavACW active="My Learning" user={ME_ACW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateACW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="acw-page" data-screen-label="All Courses">
        <button type="button" className="acw-back" onClick={() => goACW("MyLearning.html")}>
          <IconifyACW name="lucide:arrow-left" size={18} color="var(--brand-navy)" />Back to My Learning
        </button>

        <div className="acw-head">
          <h1>All Courses</h1>
          <p>We sequence your next-best courses &mdash; browse everything available and find your next step.</p>
        </div>

        <div className="acw-toolbar">
          <label className="acw-search">
            <IconACW name="search" size={20} color="var(--gray-450)" />
            <input placeholder="Search courses…" aria-label="Search courses" value={query}
              onChange={(e) => setQuery(e.target.value)} />
          </label>
          <div className="acw-filters" role="tablist" aria-label="Filter courses">
            {ACW_FILTERS.map((f) => (
              <button key={f} type="button" role="tab" aria-selected={filter === f}
                className={"acw-filter" + (filter === f ? " on" : "")} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="acw-coach-row">
          <button type="button" className="pf-coach-link" data-coach="I'm looking at the course catalog — which course should I take next to grow my clinic?">
            <IconifyACW name="lucide:sparkles" size={14} color="var(--ai-purple)" />Which course should I take next?
          </button>
        </div>

        {courses.length === 0 ? (
          <p className="acw-empty">No courses match your search.</p>
        ) : (
          <div className="acw-grid">
            {courses.map((c, i) => <ACWCourseCard key={i} c={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AllCoursesWebApp />);
