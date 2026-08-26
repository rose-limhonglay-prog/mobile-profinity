/* ===========================================================================
   PROfinity Academy — My Learning (web)
   Goal-first layout, mirroring the mobile My Learning redesign: welcome +
   tier pill → goal card → tabs/search → Continue Learning → My Courses rail
   → Free Resources / Discover your journey / Unlock-with-next-tier promos.
   Composed from the bound Profinity Design System bundle.
   =========================================================================== */
const { useState } = React;
const { useEffect: useEffectL } = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const { TopNav, LevelBadge, IconifyIcon, Icon, Spark, Tabs } = DS;

const ME = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const TUTOR = "Dr Tim Pearce";

const IMG = {
  lip: "assets/course-8d-lip-design.jpg",
  temple: "assets/course-temple-filler.webp",
  protox: "assets/course-protox.png",
  browLift: "assets/course-brow-lift.jpg",
  fullFace: "assets/course-full-face-rejuvenation.jpg",
  cheek: "assets/course-cheek-contouring.jpg",
  complications: "assets/course-complications.jpg",
  consultation: "assets/course-consultation.jpg",
};

/* Same "pf-subscription-tier" key the newsfeed/community/membership pages
   read and write — this page doesn't load app.jsx, so it keeps its own tiny
   copy rather than depending on window.PFApp. */
function lrnReadTier() {
  if (window.PF_TIER) return window.PF_TIER;
  try { return localStorage.getItem("pf-subscription-tier") || "free"; } catch (e) { return "free"; }
}
const TIER = lrnReadTier();
const FREE_TIER = TIER === "free";
const TIER_LADDER = ["confidence", "mastery", "freedom", "inner"];
const TIER_DISPLAY_NAME = { confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", inner: "Inner Circle" };
function nextTierOf(tier) {
  const i = TIER_LADDER.indexOf(tier);
  if (i === -1) return TIER_LADDER[0];
  if (i === TIER_LADDER.length - 1) return null;
  return TIER_LADDER[i + 1];
}
const NEXT_TIER = nextTierOf(TIER);

const GOAL = {
  title: "My Goal & Dream Clinic",
  vision: "Boutique clinic with lips + skin treatments, £80k/month revenue, team of 3 professionals",
  clarifier: "Where you're heading — not where you are today.",
};

const CONTINUE = { image: IMG.lip, level: "Intermediate", title: "8D Lip Design", progress: 20, note: "Only 6 more modules until you get your certificate", cta: "Resume Lesson 4" };

const TABS = ["All Courses", "In Progress", "Completed"];

function course(image, level, title, description, extra) {
  const completed = !!(extra && extra.completed);
  const inProgress = !completed && !!(extra && extra.progress);
  return {
    image, level, title, description, inProgress, completed,
    progress: completed ? 100 : (extra && extra.progress ? extra.progress : 0),
    lesson: extra && extra.lesson,
    cta: completed ? "View Certificate" : inProgress ? "Resume Lesson " + extra.lesson : "Learn More",
    certificate: completed ? { issuedDate: extra.issuedDate, id: extra.certId } : null,
  };
}

const MY_COURSES = [
  course(IMG.lip, "Intermediate", "8D Lip Design", "Discover a complete view of lip anatomy for deeper learning.", { progress: 20, lesson: 4 }),
  course(IMG.temple, "Advance", "Temple Filler", "Master safe injection techniques with anatomical precision."),
  course(IMG.protox, "Advance", "Protox Course", "Elevate your botulinum toxin skills and refine your technique.", { completed: true, issuedDate: "12 Jun 2026", certId: "PF-PTX-2201" }),
  course(IMG.browLift, "Intermediate", "Brow Lift Training", "Learn expert techniques for achieving flawless, natural brow lifts."),
  course(IMG.fullFace, "Advance", "Full-Face Rejuvenation Protocol", "A complete framework for combination treatments across the face."),
  course(IMG.cheek, "Intermediate", "Cheek & Midface Contouring", "Master volumising techniques for natural-looking cheek definition."),
  course(IMG.complications, "Advance", "Complications Management", "Recognise, prevent and manage vascular and other complications."),
  course(IMG.consultation, "Beginner", "Consultation & Patient Assessment", "Build trust and plan safe, effective treatments from the first visit.", { completed: true, issuedDate: "03 Feb 2026", certId: "PF-CPA-1187" }),
];

function goToCourse(c) {
  if (c.completed && c.certificate) return goToCertificate(c);
  const url = c.inProgress ? "LessonWeb.html" : `CourseWeb.html?${new URLSearchParams({ title: c.title, instr: TUTOR, pct: c.progress || 0 })}`;
  (window.pfGo || function (u) { window.location.href = u; })(url);
}

function goToCertificate(c) {
  const params = new URLSearchParams({
    title: c.title,
    instr: TUTOR,
    student: ME.name,
    issued: c.certificate.issuedDate,
    id: c.certificate.id,
  });
  (window.pfGo || function (u) { window.location.href = u; })(`CertificateWeb.html?${params}`);
}

/* ---------------------------------------------------------------- pieces -- */
function setPreviewTierAndReload(tier) {
  try {
    if (tier === "free") localStorage.removeItem("pf-subscription-tier");
    else localStorage.setItem("pf-subscription-tier", tier);
  } catch (e) {}
  window.location.reload();
}

/* Lets Katy preview this page as a free user or as a subscriber, without
   needing a real account switch — writes the same "pf-subscription-tier"
   key every other page reads and reloads. Left button previews the other
   state; right side is a status badge for the state showing right now. */
function PreviewTierToggle() {
  const previewTier = TIER_LADDER[0];
  return (
    <div className="lrn2-tiertoggle">
      <button type="button" className="lrn2-toggle-switch" onClick={() => setPreviewTierAndReload(FREE_TIER ? previewTier : "free")}>
        {FREE_TIER ? "View as member" : "View as free"}
      </button>
      <span className={"lrn2-toggle-status" + (FREE_TIER ? " free" : " paid")}>
        <IconifyIcon name={FREE_TIER ? "lucide:user" : "fluent:crown-16-filled"} size={16} color={FREE_TIER ? "var(--brand-navy)" : "#fff"} />
        {FREE_TIER ? "Free account" : TIER_DISPLAY_NAME[TIER] + " Path"}
      </span>
    </div>
  );
}

function LockedCoursesPanel() {
  return (
    <div className="lrn2-locked">
      <span className="lrn2-locked-icon"><IconifyIcon name="lucide:lock" size={28} color="#fff" /></span>
      <h3>Unlock My Courses</h3>
      <p>Upgrade to purchase courses and they&rsquo;ll live here for easy access.</p>
      <button type="button" className="lrn2-locked-upgrade-btn" onClick={() => (window.pfGo || function (u) { window.location.href = u; })("MembershipTier.html")}>
        Upgrade<IconifyIcon name="lucide:arrow-up-right" size={19} color="#fff" />
      </button>
    </div>
  );
}

function GoalCard() {
  return (
    <section className="lrn2-goal" data-screen-label={GOAL.title}>
      <span className="lrn2-goal-icon"><IconifyIcon name="lucide:target" size={22} color="var(--brand-gold)" /></span>
      <div className="lrn2-goal-body">
        <h2>{GOAL.title}</h2>
        <p className="vision">{GOAL.vision}</p>
        <p className="clarifier">{GOAL.clarifier}</p>
      </div>
      <button type="button" className="pf-coach-link lrn2-goal-coach" data-coach="Help me get closer to my goal — what should I focus on next?">
        <Spark size={17} color="#fff" />Discuss with Ava
      </button>
    </section>
  );
}

function SectionHead({ title, big, viewAll }) {
  return (
    <div className="sec-h">
      <span className={big ? "t big" : "t"}>{title}</span>
      <span className="grow" />
      {viewAll &&
        <a className="viewall" href="#" tabIndex={0} onClick={(e) => { e.preventDefault(); (window.pfGo || function (u) { window.location.href = u; })(viewAll); }}>View All</a>}
    </div>
  );
}

function ContinueLearning() {
  return (
    <section className="lrn2-continue" data-screen-label="Continue Learning">
      <SectionHead title="Continue Learning" big />
      <article className="lrn2-continuecard">
        <div className="thumb" style={{ backgroundImage: "url(" + CONTINUE.image + ")" }}>
          <LevelBadge level={CONTINUE.level} className="lvl" />
        </div>
        <div className="body">
          <div className="ti">{CONTINUE.title}</div>
          <div className="progrow">
            <span className="bar"><span style={{ width: CONTINUE.progress + "%" }} /></span>
            <span className="pct">{CONTINUE.progress}% Complete</span>
          </div>
          <p className="note">{CONTINUE.note}</p>
          <button type="button" className="lrn2-resume-btn" onClick={() => goToCourse({ ...MY_COURSES[0], inProgress: true })}>
            {CONTINUE.cta}<IconifyIcon name="lucide:arrow-up-right" size={18} color="#fff" />
          </button>
        </div>
      </article>
    </section>
  );
}

function CourseCard({ c }) {
  return (
    <article className="lrn2-coursecard">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <LevelBadge level={c.level} className="lvl" />
        <span className="play"><IconifyIcon name="fluent:play-16-filled" size={20} color="var(--ai-purple)" /></span>
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="ds">{c.description}</div>
        <div className="by">{TUTOR}</div>
        {c.completed &&
          <div className="progrow done">
            <IconifyIcon name="fluent:checkmark-circle-16-filled" size={16} color="var(--success)" />
            <span className="pct">Completed</span>
          </div>}
        {c.inProgress &&
          <div className="progrow">
            <span className="bar"><span style={{ width: c.progress + "%" }} /></span>
            <span className="pct">{c.progress}% Complete</span>
          </div>}
        <button type="button" className={c.inProgress ? "lrn2-cta filled" : "lrn2-cta ghost"} onClick={() => goToCourse(c)}>{c.cta}</button>
      </div>
    </article>
  );
}

function CertificateCard({ c }) {
  return (
    <article className="lrn2-certcard">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <LevelBadge level={c.level} className="lvl" />
        <span className="cert-ribbon"><IconifyIcon name="fluent:ribbon-star-16-filled" size={18} color="#fff" /></span>
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="by">{TUTOR}</div>
        <div className="cert-meta">Issued {c.certificate.issuedDate} &middot; {c.certificate.id}</div>
        <button type="button" className="lrn2-cta filled" onClick={() => goToCourse(c)}>View Certificate</button>
      </div>
    </article>
  );
}

function SkeletonCourseCard() {
  return (
    <div className="skel-card lrn2-coursecard">
      <div className="skel" style={{ height: 168 }} />
      <div className="sk-body">
        <div className="skel sk-line" style={{ width: "70%" }} />
        <div className="skel sk-line" style={{ width: "90%", height: 10 }} />
        <div className="skel sk-line" style={{ width: "40%", height: 10 }} />
        <div className="skel sk-btn" />
      </div>
    </div>
  );
}

function PromoFreeResources() {
  return (
    <div className="lrn2-promo card" data-screen-label="Free Resources">
      <span className="ic gold"><IconifyIcon name="lucide:folder-open" size={24} color="var(--brand-gold)" /></span>
      <div className="tx">
        <h3>Free Resources</h3>
        <p>Guides, checklists and vein maps tailored to your clinic goals.</p>
        <button type="button" className="lrn2-outline-btn" onClick={() => (window.pfGo || function (u) { window.location.href = u; })("SavedWeb.html")}>
          View free resources<IconifyIcon name="lucide:arrow-up-right" size={17} color="var(--brand-navy)" />
        </button>
      </div>
    </div>
  );
}

function PromoLearningPath() {
  return (
    <button type="button" className="lrn2-promo navy" data-screen-label="Discover your journey" onClick={() => (window.pfGo || function (u) { window.location.href = u; })("AllCoursesWeb.html")}>
      <span className="ic"><IconifyIcon name="lucide:route" size={24} color="var(--brand-gold)" /></span>
      <div className="tx">
        <h3>Discover your journey</h3>
        <p>We sequence your next-best courses &mdash; one clear step at a time toward your goal.</p>
      </div>
      <span className="lrn2-navy-btn">Explore learning path<IconifyIcon name="lucide:arrow-right" size={17} color="var(--brand-navy)" /></span>
    </button>
  );
}

function PromoUpgrade() {
  if (!NEXT_TIER) return null;
  const nextName = TIER_DISPLAY_NAME[NEXT_TIER];
  return (
    <div className="lrn2-promo navy big" data-screen-label={"Unlock more with " + nextName}>
      <span className="ic circle"><Spark size={28} color="var(--premium-orange)" /></span>
      <div className="tx">
        <h3>Unlock more with {nextName}</h3>
        <p>More courses, live events &amp; community perks.</p>
      </div>
      <button type="button" className="lrn2-upgrade-btn" onClick={() => (window.pfGo || function (u) { window.location.href = u; })("MembershipTier.html")}>
        {FREE_TIER ? "Subscribe" : "Upgrade"}<IconifyIcon name="lucide:arrow-up-right" size={19} color="#fff" />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- app ----- */
function pfTagActiveNav(activeLabel) {
  document.querySelectorAll("#pf-root nav > button").forEach((b) => {
    const label = b.textContent.replace(/[0-9]/g, "").trim();
    const active = label === activeLabel;
    b.style.setProperty("-webkit-appearance", "none", "important");
    b.style.setProperty("appearance", "none", "important");
    b.style.setProperty("background", active ? "rgb(225, 223, 242)" : "none", "important");
    b.style.setProperty("transition", "background .18s ease", "important");
    const path = b.querySelector("svg path");
    if (path) path.style.setProperty("fill", active ? "currentColor" : "", "important");
  });
}

function navigate(label) {
  var u = { Home: "Newsfeed.html", Profile: "Profile.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) (window.pfGo || function (x) { window.location.href = x; })(u);
}

const COURSE_TAB_FILTERS = {
  "In Progress": (c) => c.inProgress,
  "Completed": (c) => c.completed,
};

function MyLearningApp() {
  const [tab, setTab] = useState("All Courses");
  const [loading, setLoading] = useState(true);
  useEffectL(() => pfTagActiveNav("My Learning"));
  useEffectL(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  const visibleCourses = MY_COURSES.filter(COURSE_TAB_FILTERS[tab] || (() => true));
  const showContinue = !FREE_TIER && (tab === "All Courses" || tab === "In Progress");

  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNav active="My Learning" user={ME} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigate}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="page" data-screen-label="My Learning">
        <div className="lrn2-top">
          <div>
            <h1 className="welcome">Welcome, Katy!</h1>
            <p className="welcome-sub">Your goal is to grow in aesthetics or medical school</p>
          </div>
          <PreviewTierToggle />
        </div>

        <GoalCard />

        <div className="lrn-tabs">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>

        <label className="search">
          <Icon name="search" size={20} color="var(--gray-450)" />
          <input placeholder="Search course&hellip;" aria-label="Search course" />
        </label>

        {showContinue && <ContinueLearning />}

        <section className="panel" data-screen-label="My Courses">
          <SectionHead title="My Courses" viewAll={FREE_TIER ? null : "MyCoursesWeb.html"} />
          {FREE_TIER ? (
            <LockedCoursesPanel />
          ) : (
            <>
              <div className="row">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonCourseCard key={i} />)
                  : visibleCourses.map((c, i) =>
                      tab === "Completed"
                        ? <CertificateCard key={i} c={c} />
                        : <CourseCard key={i} c={c} />)}
              </div>
              {!loading && (tab === "In Progress" || tab === "Completed") && visibleCourses.length === 0 &&
                <p className="lrn2-empty">{tab === "In Progress" ? "No courses in progress yet." : "Complete a course to earn your first certificate."}</p>}
            </>
          )}
        </section>

        <section className="lrn2-promos">
          <PromoFreeResources />
          <PromoLearningPath />
          <PromoUpgrade />
        </section>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MyLearningApp />);
