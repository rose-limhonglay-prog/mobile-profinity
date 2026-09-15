/* ===========================================================================
   PROfinity Academy — My Courses (web)
   Full list of the member's own courses for desktop: search + All/In
   Progress/Completed/Saved tabs over a responsive grid. Reached from the
   "View All" link on the My Courses rail on MyLearning.html (learning.jsx).

   Tier-scoped like the mobile page: Confidence sees the three courses in that
   membership, higher tiers the full list. Course data comes from
   learning-courses-web.js (window.PFLearnCourses); tier, saved courses and
   URLs from learning-store-web.js (window.PFLearn). Suffixed -MCW to avoid
   global-scope clashes.
   =========================================================================== */
const { useState: useStateMCW } = React;
const DSMCW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavMCW, LevelBadge: LevelBadgeMCW, IconifyIcon: IconifyMCW, Icon: IconMCW } = DSMCW;
const PFL_MCW = window.PFLearn;
const PFC_MCW = window.PFLearnCourses;

const ME_MCW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const TUTOR_MCW = PFC_MCW.TUTOR;

function goMCW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateMCW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goMCW(u);
}

const TIER_MCW = PFL_MCW.readTier();
const FREE_TIER_MCW = TIER_MCW === "free";
const MY_COURSES_MCW = PFC_MCW.coursesForTier(TIER_MCW);

/* Resume deep link: the course's saved level/module + its 1-based lesson. */
const PFS_MCW = window.PFLearnShared || null;
function resumePointMCW(c) {
  if (PFS_MCW && PFS_MCW.CURRICULA && PFS_MCW.CURRICULA[c.slug] && PFS_MCW.resume) { try { return PFS_MCW.resume(c.slug); } catch (e) {} }
  return null;
}
function resumeLessonNumberMCW(c) { const r = resumePointMCW(c); return r ? r.lessonNumber : c.lesson; }
function resumeUrlMCW(c) {
  const rp = resumePointMCW(c);
  if (rp && rp.item) return PFL_MCW.lessonUrl(c.slug, { level: rp.item.li, module: rp.item.si, lesson: rp.item.ni, sub: rp.item.subIdx == null ? undefined : rp.item.subIdx });
  const r = c.resume || { level: 0, module: 0 };
  return PFL_MCW.lessonUrl(c.slug, { level: r.level, module: r.module, lesson: Math.max(0, (c.lesson || 1) - 1) });
}
function certificateUrlMCW(c) {
  return "CertificateWeb.html?" + new URLSearchParams({
    title: c.title, instr: TUTOR_MCW, student: ME_MCW.name, issued: c.certificate.issuedDate, id: c.certificate.id,
  });
}
/* completed → View Certificate; in progress → filled "Continue · n%"; else "Start learning" */
function courseCtaMCW(c) {
  if (c.completed) return { label: "View Certificate", fill: true, go: () => goMCW(certificateUrlMCW(c)) };
  if (c.inProgress) return { label: "Continue · " + c.progress + "%", fill: true, go: () => goMCW(resumeUrlMCW(c)) };
  return { label: "Start learning", fill: false, go: () => goMCW(PFL_MCW.courseUrl(c.slug, { title: c.title })) };
}

const MCW_TABS = ["All Courses", "In Progress", "Completed", "Saved"];
const MCW_EMPTY = {
  "In Progress": "No courses in progress yet.",
  "Completed": "Complete a course to earn your first certificate.",
  "Saved": "Tap the bookmark on a course to keep it here.",
};

function MCWSaveButton({ title, saved }) {
  const on = saved.indexOf(title) !== -1;
  return (
    <button type="button" className={"mcw-save" + (on ? " on" : "")} aria-label={on ? "Remove from saved" : "Save course"} aria-pressed={on}
      onClick={(e) => { e.stopPropagation(); PFL_MCW.toggleSaved(title); }}>
      <IconifyMCW name={on ? "lucide:bookmark-check" : "lucide:bookmark"} size={18} color={on ? "var(--brand-gold)" : "var(--brand-navy)"} />
    </button>
  );
}

function MCWCourseCard({ c, saved }) {
  const cta = courseCtaMCW(c);
  return (
    <article className="mcw-coursecard">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <LevelBadgeMCW level={c.level} className="lvl" />
        <MCWSaveButton title={c.title} saved={saved} />
        <span className="play"><IconifyMCW name="fluent:play-16-filled" size={20} color="var(--ai-purple)" /></span>
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="ds">{c.description}</div>
        <div className="by">{TUTOR_MCW}</div>
        {c.completed &&
          <div className="progrow done">
            <IconifyMCW name="fluent:checkmark-circle-16-filled" size={16} color="var(--success)" />
            <span className="pct">Completed</span>
          </div>}
        {c.inProgress &&
          <div className="progrow">
            <span className="bar"><span style={{ width: c.progress + "%" }} /></span>
            <span className="pct">{c.progress}% Complete</span>
          </div>}
        <button type="button" className={cta.fill ? "mcw-cta filled" : "mcw-cta ghost"} onClick={cta.go}>{cta.label}</button>
      </div>
    </article>
  );
}

/* First in-progress card spans the grid: progress bar, modules-left note and
   "Resume Lesson n" (mirrors LM2CourseCardWide on mobile). */
function MCWCourseCardWide({ c, saved }) {
  return (
    <article className="mcw-coursecard mcw-coursecard-wide">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <LevelBadgeMCW level={c.level} className="lvl" />
        <MCWSaveButton title={c.title} saved={saved} />
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="progrow">
          <span className="bar"><span style={{ width: c.progress + "%" }} /></span>
          <span className="pct">{c.progress}%</span>
        </div>
        <div className="ds">Only {c.modulesLeft} more modules until you get your certificate</div>
        <div className="by">{TUTOR_MCW}</div>
        <button type="button" className="mcw-cta filled" onClick={() => goMCW(resumeUrlMCW(c))}>
          Resume Lesson {resumeLessonNumberMCW(c)}<IconifyMCW name="lucide:arrow-up-right" size={17} color="#fff" />
        </button>
      </div>
    </article>
  );
}

function MCWCertificateCard({ c }) {
  return (
    <article className="mcw-certcard">
      <div className="thumb" style={{ backgroundImage: "url(" + c.certificate.image + ")" }}>
        <LevelBadgeMCW level={c.level} className="lvl" />
        <span className="cert-ribbon"><IconifyMCW name="fluent:ribbon-star-16-filled" size={18} color="#fff" /></span>
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="by">{TUTOR_MCW}</div>
        <div className="cert-meta">Issued {c.certificate.issuedDate} &middot; {c.certificate.id}</div>
        <button type="button" className="mcw-cta filled" onClick={() => goMCW(certificateUrlMCW(c))}>View Certificate</button>
      </div>
    </article>
  );
}

function MCWLockedPanel() {
  return (
    <div className="mcw-locked">
      <span className="mcw-locked-icon"><IconifyMCW name="lucide:lock" size={28} color="#fff" /></span>
      <h3>Unlock My Courses</h3>
      <p>Upgrade to purchase courses and they&rsquo;ll live here for easy access.</p>
      <button type="button" className="mcw-locked-upgrade-btn" onClick={() => goMCW(PFL_MCW.membershipUrl)}>
        Upgrade<IconifyMCW name="lucide:arrow-up-right" size={19} color="#fff" />
      </button>
    </div>
  );
}

function MyCoursesWebApp() {
  const [query, setQuery] = useStateMCW("");
  const [tab, setTab] = useStateMCW("All Courses");
  const saved = PFL_MCW.useSaved();

  const q = query.trim().toLowerCase();
  const filters = {
    "In Progress": (c) => c.inProgress,
    "Completed": (c) => c.completed,
    "Saved": (c) => saved.indexOf(c.title) !== -1,
  };
  const courses = MY_COURSES_MCW.filter(filters[tab] || (() => true))
    .filter((c) => !q || c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q));
  /* the first in-progress card spans two columns (All Courses / In Progress, no search) */
  const wideIdx = !q && (tab === "All Courses" || tab === "In Progress") ? courses.findIndex((c) => c.inProgress) : -1;
  const inProgressCount = MY_COURSES_MCW.filter((c) => c.inProgress).length;
  const completedCount = MY_COURSES_MCW.filter((c) => c.completed).length;

  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavMCW active="My Learning" user={ME_MCW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateMCW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="mcw-page" data-screen-label="My Courses">
        <button type="button" className="mcw-back" onClick={() => goMCW(PFL_MCW.myLearningUrl)}>
          <IconifyMCW name="lucide:arrow-left" size={18} color="var(--brand-navy)" />Back to My Learning
        </button>

        <div className="mcw-head">
          <div>
            <h1>My Courses</h1>
            <p>Every course you&rsquo;ve started, saved or completed &mdash; all in one place.</p>
          </div>
          {!FREE_TIER_MCW &&
            <div className="mcw-head-side">
              <span className="mcw-tierpill"><IconifyMCW name="lucide:crown" size={15} color="#fff" />{PFL_MCW.TIER_NAME[TIER_MCW]} Path</span>
              <span className="mcw-count">{MY_COURSES_MCW.length} courses &middot; {inProgressCount} in progress &middot; {completedCount} completed</span>
            </div>}
        </div>

        {FREE_TIER_MCW ? (
          <MCWLockedPanel />
        ) : (
          <>
            <div className="mcw-toolbar">
              <label className="mcw-search">
                <IconMCW name="search" size={20} color="var(--gray-450)" />
                <input placeholder="Search your courses…" aria-label="Search your courses" value={query}
                  onChange={(e) => setQuery(e.target.value)} />
              </label>
              <div className="mcw-tabs" role="tablist" aria-label="Filter my courses">
                {MCW_TABS.map((t) => (
                  <button key={t} type="button" role="tab" aria-selected={tab === t}
                    className={"mcw-tab" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>
                    {t}{t === "Saved" && saved.length > 0 && <span className="mcw-tab-n">{saved.filter((s) => MY_COURSES_MCW.some((c) => c.title === s)).length}</span>}
                  </button>
                ))}
              </div>
            </div>

            {courses.length === 0 ? (
              <p className="mcw-empty">{q ? "No courses match your search." : MCW_EMPTY[tab] || "No courses here yet."}</p>
            ) : (
              <div className="mcw-grid">
                {courses.map((c, i) =>
                  tab === "Completed" || (c.completed && tab === "Saved")
                    ? <MCWCertificateCard key={c.slug} c={c} />
                    : i === wideIdx
                      ? <MCWCourseCardWide key={c.slug} c={c} saved={saved} />
                      : <MCWCourseCard key={c.slug} c={c} saved={saved} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MyCoursesWebApp />);
