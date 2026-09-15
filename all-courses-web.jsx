/* ===========================================================================
   PROfinity — All Courses (web)
   Desktop catalogue browser, redesigned 2026-09-15 to mirror the mobile
   All Courses (allcourses-confidence.jsx): hero + search, subject chips,
   Popular topics, one rail per category (unowned courses only — the enrolled
   ones live in My Learning), Popular instructors, and a Category page
   (?cat=Anatomy) with starter courses, the category's topics and instructors,
   a filter/sort bar and the full list. Catalogue data comes from
   learning-shared.js (window.PFLearnShared.CATALOG / CATS / TOPICS /
   INSTRUCTORS) so web and mobile list the same courses; tier, purchases,
   completed lessons and URLs come from learning-store-web.js (window.PFLearn).

   Members-only (user, 2026-09-15): a free viewer is sent to the subscription
   page, like the mobile page. Suffixed -ACW to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateACW, useEffect: useEffectACW, useMemo: useMemoACW, useRef: useRefACW } = React;
const DSACW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavACW, LevelBadge: LevelBadgeACW, IconifyIcon: IconifyACW, Icon: IconACW, Avatar: AvatarACW } = DSACW;
/* window.PFLearn — tier / purchases / completed lessons / URLs (learning-store-web.js).
   window.PFLearnShared — catalogue, curricula, progress (learning-shared.js).
   Both are feature-detected with fallbacks so the page stays up if a shell
   ships only one of them (an older learning-shared.js merged into PFLearn). */
const PFLACW = window.PFLearn || window.PFLearnShared || {};
const PFLSACW = window.PFLearnShared || window.PFLearn || {};

const ME_ACW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const TIER_ACW = PFLACW.readTier ? PFLACW.readTier() : (function () { try { return localStorage.getItem("pf-subscription-tier") || "free"; } catch (e) { return "free"; } })();
const TIER_NAME_ACW = (PFLACW.TIER_NAME || PFLSACW.TIER_NAME || {})[TIER_ACW] || "Confidence";
const FREE_ACW = PFLACW.isFree ? PFLACW.isFree() : TIER_ACW === "free";
const MEMBERSHIP_URL_ACW = PFLACW.membershipUrl || "MembershipTier.html";
const MY_LEARNING_URL_ACW = PFLACW.myLearningUrl || "MyLearning.html";
/* members-only: a free viewer is sent to the subscription page before anything renders */
/* ?free=1 — the Free Resources view (user, 2026-09-16): the survey-unlocked
   downloads listed with this page's card design. Open to every tier, so the
   members-only redirect steps aside for it. */
const ACW_FREE_VIEW = new URLSearchParams(window.location.search).get("free") === "1";
const ACW_FREE_KEY = "Free Resources";
if (FREE_ACW && !ACW_FREE_VIEW) window.location.replace(MEMBERSHIP_URL_ACW);

let ACW_REDUCE = false;
try { ACW_REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
const behaviorACW = () => (ACW_REDUCE ? "auto" : "smooth");

/* purchases made on CourseWeb / checkout (pf-purchased-courses) count as owned;
   the app re-renders on the store's focus / pageshow / storage refresh and
   republishes the list here before the tree below reads it */
let ACW_PURCHASED = [];
const ownedACW = (c) => !!c.owned || ACW_PURCHASED.indexOf(c.slug) !== -1;
const includedInACW = (slug) => (PFLSACW.includedIn ? PFLSACW.includedIn(slug, TIER_ACW) : PFLACW.included ? PFLACW.included(slug) : false);
/* a course the member's plan already covers is not an upgrade — no lock, opens the course page */
const accessibleACW = (c) => ownedACW(c) || includedInACW(c.slug) || TIER_ACW !== "confidence";
const haystackACW = PFLSACW.haystack || ((c) => [c.title, c.cat, c.blurb, c.by].concat(c.topics || []).join(" ").toLowerCase());
const catalogPctACW = PFLSACW.catalogPct || ((c) => c.pct || 0);
const hasCurriculumACW = (slug) => !!((PFLSACW.CURRICULA || {})[slug]);

function goACW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateACW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": MY_LEARNING_URL_ACW, Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goACW(u);
}
function pfTagActiveNavACW(activeLabel) {
  document.querySelectorAll("#pf-root nav > button").forEach((b) => {
    const label = b.textContent.replace(/[0-9]/g, "").trim();
    const active = label === activeLabel;
    b.style.setProperty("background", active ? "var(--pf-nav-active-bg, rgb(225, 223, 242))" : "none", "important");
  });
}

const ACW_PARAMS = new URLSearchParams(window.location.search);
const ACW_CATS = PFLSACW.CATS || ["Lips & Perioral", "Anatomy", "Safety", "Patient Journey"];
const ACW_TOPICS = PFLSACW.TOPICS || [];
const ACW_INSTRUCTORS = PFLSACW.INSTRUCTORS || [];
const ACW_COURSES = PFLSACW.CATALOG || [];
const ACW_FREE_RES = PFLSACW.FREE_RESOURCES || [];
const ownedCountACW = () => ACW_COURSES.filter(ownedACW).length;

/* Owned → the course page; locked → Mastery upgrade (every unowned course in
   the catalogue is part of Mastery), unless the member's plan already covers
   it, in which case the course page opens as included. Links go through the
   shared PFLearn.courseUrl: ?course=<slug> for a course CourseWeb knows, plus
   the ?title=&instr=&… generic shape for the rest. */
function courseUrlACW(c) {
  if (!c.free && !accessibleACW(c)) return MEMBERSHIP_URL_ACW;
  const extra = hasCurriculumACW(c.slug) ? {} : { title: c.title, instr: c.by, pct: c.pct || 0, level: c.level, lessons: c.lessons, dur: c.mins + " min" };
  if (PFLACW.courseUrl) return PFLACW.courseUrl(c.slug, extra);
  return "CourseWeb.html?" + new URLSearchParams(Object.assign({ course: c.slug }, extra)).toString();
}
function minsLabelACW(m) { return m >= 60 ? Math.floor(m / 60) + "h " + (m % 60 ? (m % 60) + "m" : "") : m + " min"; }

/* ---------------------------------------------------------------- course card -- */
function ACWCourseCard({ c, wide, large, done }) {
  const free = !!c.free;
  const locked = !free && !ownedACW(c);
  const upgrade = locked && !accessibleACW(c);
  const pct = locked || free ? 0 : catalogPctACW(c, done);
  const label = c.title + " — " + (free ? "free " + c.meta.toLowerCase() : c.lessons + " lessons, " + minsLabelACW(c.mins) + (locked ? ", included in Mastery" : ", " + pct + "% complete"));
  return (
    <button type="button" className={"acw-card" + (wide ? " acw-card-wide" : "") + (large ? " acw-card-lg" : "")} onClick={() => goACW(courseUrlACW(c))} aria-label={label}>
      <span className="acw-card-cover">
        {c.image ? <img src={c.image} alt="" loading="lazy" /> :
          <span className="acw-card-ph" aria-hidden="true"><IconifyACW name={c.kind === "Video" || c.kind === "Case study" ? "lucide:play-circle" : c.kind === "Lesson" ? "lucide:graduation-cap" : "lucide:file-text"} size={36} color="var(--gray-450)" /></span>}
        {!free && <LevelBadgeACW level={c.level} className="acw-card-lvl" />}
        {upgrade && <span className="acw-card-lock" aria-hidden="true"><IconifyACW name="lucide:lock" size={12} color="#fff" /></span>}
      </span>
      <span className="acw-card-body">
        <span className="lrn-eyebrow">{free ? c.meta : c.cat}</span>
        <span className="acw-card-title">{c.title}</span>
        <span className="acw-card-by">{c.by}</span>
        <span className="acw-card-blurb">{c.blurb}</span>
        {!free && <span className="acw-card-meta">{c.lessons} lessons · {minsLabelACW(c.mins)}</span>}
        {free ?
          <span className="lrn-included lrn-free"><IconifyACW name="lucide:gift" size={13} color="var(--lrn-gold-ink)" />Free</span> :
        locked ?
          <span className="lrn-included"><IconifyACW name="lucide:crown" size={13} color="var(--lrn-gold-ink)" />Included in Mastery</span> :
          <span className="acw-card-prog">
            <span className="lrn-bar"><span style={{ width: pct + "%" }} /></span>
            <span className="acw-card-pct">{pct}% complete</span>
          </span>}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- rails -- */
function ACWRail({ cat, courses, expanded, onToggle, onOpenCat, done }) {
  const id = "acw-rail-" + cat.replace(/[^a-z]+/gi, "-").toLowerCase();
  return (
    <section className="acw-sec" data-screen-label={cat}>
      <div className="lrn-sec-h">
        <h2 id={id + "-h"}><button type="button" className="acw-cat-link" onClick={() => onOpenCat(cat)}>{cat}<IconifyACW name="lucide:chevron-right" size={20} color="var(--text-heading)" /></button></h2>
        <span className="acw-sec-tools">
          <span className="sub">{courses.length} courses</span>
          {courses.length > 5 &&
            <button type="button" className="link" aria-expanded={expanded} aria-controls={id} onClick={onToggle}>{expanded ? "Show less" : "See all"}</button>}
        </span>
      </div>
      <div id={id} className={expanded ? "acw-grid" : "acw-rail"} role="list" aria-labelledby={id + "-h"}>
        {courses.map((c) => <div role="listitem" key={c.slug} className="acw-rail-item"><ACWCourseCard c={c} done={done} /></div>)}
      </div>
    </section>
  );
}

function ACWInstructors({ onPick, people, who }) {
  return (
    <section className="acw-sec" data-screen-label="Popular instructors">
      <div className="lrn-sec-h"><h2>Popular instructors</h2></div>
      <div className="acw-people" role="list">
        {(people || ACW_INSTRUCTORS).map((p) => {
          const n = ACW_COURSES.filter((c) => c.by === p.name).length;
          return (
            <div role="listitem" key={p.name}>
              <button type="button" className={"acw-person" + (who === p.name ? " on" : "")} aria-pressed={who != null ? who === p.name : undefined}
                onClick={() => onPick(p.name)} aria-label={"Show courses by " + p.name}>
                <AvatarACW src={p.avatar} name={p.name} size={56} />
                <span className="acw-person-tx">
                  <span className="acw-person-name">{p.name}</span>
                  <span className="acw-person-role">{p.role}</span>
                  <span className="acw-person-n">{n} {n === 1 ? "course" : "courses"}</span>
                </span>
              </button>
            </div>);
        })}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- category page -- */
const ACW_SORTS = [
  { key: "rec", label: "Recommended" },
  { key: "short", label: "Shortest first" },
  { key: "long", label: "Most lessons" },
  { key: "az", label: "A to Z" }];
const ACW_SHOWS = [
  { key: "all", label: "All courses" },
  { key: "new", label: "Not started" },
  { key: "mine", label: "In progress" }];
const ACW_LEVELS = ["Beginner", "Intermediate", "Advanced"];

function catFromUrlACW() {
  if (ACW_FREE_VIEW) return ACW_FREE_KEY;
  const c = new URLSearchParams(window.location.search).get("cat");
  return ACW_CATS.indexOf(c) !== -1 ? c : null;
}

function ACWCategoryPage({ cat, onBack, done, free }) {
  const courses = useMemoACW(() => free ? ACW_FREE_RES : ACW_COURSES.filter((c) => c.cat === cat), [cat, free]);
  const starters = free ? [] : courses.filter((c) => !ownedACW(c)).slice(0, 4);
  const topics = ACW_TOPICS.filter((t) => courses.some((c) => (c.topics || []).indexOf(t) !== -1));
  const people = ACW_INSTRUCTORS.filter((p) => courses.some((c) => c.by === p.name));
  const totalMins = courses.reduce((a, c) => a + c.mins, 0);

  const [topic, setTopic] = useStateACW(null);
  const [who, setWho] = useStateACW(null);
  const [level, setLevel] = useStateACW(null);
  const [sort, setSort] = useStateACW("rec");
  const [show, setShow] = useStateACW("all");
  const listRef = useRefACW(null);

  const list = useMemoACW(() => {
    let out = courses.slice();
    if (topic) out = out.filter((c) => (c.topics || []).indexOf(topic) !== -1);
    if (who) out = out.filter((c) => c.by === who);
    if (level) out = out.filter((c) => c.level === level);
    if (show === "new") out = out.filter((c) => !ownedACW(c));
    if (show === "mine") out = out.filter((c) => ownedACW(c));
    if (sort === "short") out.sort((a, b) => a.mins - b.mins);
    if (sort === "long") out.sort((a, b) => b.lessons - a.lessons);
    if (sort === "az") out.sort((a, b) => a.title.localeCompare(b.title));
    return out;
  }, [courses, topic, who, level, show, sort]);

  const jump = () => { const el = listRef.current; if (el) el.scrollIntoView({ behavior: behaviorACW(), block: "start" }); };
  const pickTopic = (t) => { setTopic(topic === t ? null : t); jump(); };
  const pickWho = (n) => { setWho(who === n ? null : n); jump(); };
  const filtered = topic || who || level || show !== "all" || sort !== "rec";
  const reset = () => { setTopic(null); setWho(null); setLevel(null); setShow("all"); setSort("rec"); };

  useEffectACW(() => { document.title = "PROfinity — " + cat + (free ? "" : " · All Courses") + " · My Learning"; window.scrollTo({ top: 0 }); }, [cat]);

  return (
    <div className="acw-page acw-cat" data-screen-label={"Category · " + cat}>
      <div className="acw-crumb-row">
        <button type="button" className="acw-back-btn" aria-label={free ? "Back to My Learning" : "Back to all courses"} onClick={onBack}>
          <IconifyACW name="lucide:arrow-left" size={19} color="var(--brand-navy)" />
        </button>
        <span className="acw-crumb">
          <a onClick={() => goACW(MY_LEARNING_URL_ACW)}>My Learning</a> &nbsp;/&nbsp; {!free && <React.Fragment><a onClick={onBack}>All Courses</a> &nbsp;/&nbsp; </React.Fragment>}<span>{cat}</span>
        </span>
      </div>

      <section className="acw-cat-hero">
        <span className="lrn-eyebrow">{free ? "Unlocked for you" : "Category"}</span>
        <h1 className="acw-cat-h1">{cat}</h1>
        {free ?
        <p className="acw-lede">Dr Tim's free library — {courses.length} guides, checklists, protocols, lessons and videos. Free to open and keep.</p> :
        <p className="acw-lede">{courses.length} courses · {courses.reduce((a, c) => a + c.lessons, 0)} lessons · {minsLabelACW(totalMins)} of teaching from {people.map((p) => p.name).join(", ").replace(/, ([^,]*)$/, " and $1")}.</p>}
      </section>

      {!free &&
      <section className="acw-sec acw-sec-tight" data-screen-label="Courses to get you started">
        <div className="lrn-sec-h"><h2>Courses to get you started</h2></div>
        <div className="acw-rail" role="list">
          {starters.map((c) => <div role="listitem" key={c.slug} className="acw-rail-item"><ACWCourseCard c={c} large done={done} /></div>)}
        </div>
      </section>}

      {!free && topics.length > 0 &&
        <section className="acw-sec" data-screen-label="Popular topics">
          <div className="lrn-sec-h"><h2>Popular topics</h2></div>
          <div className="acw-topics" role="list">
            {topics.map((t) =>
              <button key={t} type="button" role="listitem" className={"acw-topic" + (topic === t ? " on" : "")} aria-pressed={topic === t} onClick={() => pickTopic(t)}>{t}</button>)}
          </div>
        </section>}

      {!free && people.length > 0 && <ACWInstructors people={people} who={who} onPick={pickWho} />}

      <section className="acw-sec" data-screen-label="All courses in category" ref={listRef}>
        <div className="lrn-sec-h">
          <h2>{free ? "All free resources" : "All " + cat + " courses"}</h2>
          <span className="sub">{list.length} {free ? (list.length === 1 ? "resource" : "resources") : (list.length === 1 ? "course" : "courses")}</span>
        </div>

        <div className="acw-filterbar" role="group" aria-label="Filter and sort">
          <div className="acw-chips">
            {!free && ACW_LEVELS.map((l) =>
              <button key={l} type="button" className={"acw-chip" + (level === l ? " on" : "")} aria-pressed={level === l} onClick={() => setLevel(level === l ? null : l)}>{l}</button>)}
            {!free && <span className="acw-chip-sep" aria-hidden="true" />}
            {!free && ACW_SHOWS.map((o) =>
              <button key={o.key} type="button" className={"acw-chip" + (show === o.key ? " on" : "")} aria-pressed={show === o.key} onClick={() => setShow(o.key)}>{o.label}</button>)}
          </div>
          <label className="acw-sort">
            <IconifyACW name="lucide:arrow-up-down" size={16} color="var(--gray-500)" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort courses">
              {(free ? ACW_SORTS.filter((o) => o.key === "rec" || o.key === "az") : ACW_SORTS).map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </label>
        </div>

        {filtered &&
          <div className="acw-active" aria-live="polite">
            {topic && <button type="button" className="acw-active-chip" onClick={() => setTopic(null)}>{topic}<IconifyACW name="lucide:x" size={14} color="var(--text-primary)" /></button>}
            {who && <button type="button" className="acw-active-chip" onClick={() => setWho(null)}>{who}<IconifyACW name="lucide:x" size={14} color="var(--text-primary)" /></button>}
            <button type="button" className="acw-clear" onClick={reset}>Clear all</button>
          </div>}

        {list.length === 0 ?
          <div className="acw-empty-box">
            <p>No {free ? "free resources" : cat + " courses"} match these filters.</p>
            <button type="button" className="acw-clear" onClick={reset}>Clear filters</button>
          </div> :
          <div className="acw-grid" role="list">
            {list.map((c) => <div role="listitem" key={c.slug} className="acw-rail-item"><ACWCourseCard c={c} done={done} /></div>)}
          </div>}
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- browse page -- */
function ACWBrowse({ onOpenCat, done }) {
  const [query, setQuery] = useStateACW(ACW_PARAMS.get("q") || "");
  const [expanded, setExpanded] = useStateACW({});
  const searchRef = useRefACW(null);
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const results = useMemoACW(() => searching ? ACW_COURSES.filter((c) => haystackACW(c).indexOf(q) !== -1) : [], [q]);
  const purchasedKey = ACW_PURCHASED.join("|");
  const rails = useMemoACW(() => ACW_CATS.map((k) => ({ cat: k, courses: ACW_COURSES.filter((c) => c.cat === k && !ownedACW(c)) })), [purchasedKey]);
  const ownedCount = ownedCountACW();
  const pickQuery = (text) => { setQuery(query.trim() === text ? "" : text); window.scrollTo({ top: 0, behavior: behaviorACW() }); if (searchRef.current) searchRef.current.focus({ preventScroll: true }); };
  const toggleExpanded = (k) => setExpanded((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="acw-page" data-screen-label="All Courses">
      <div className="acw-crumb-row">
        <button type="button" className="acw-back-btn" aria-label="Back to My Learning" onClick={() => goACW(MY_LEARNING_URL_ACW)}>
          <IconifyACW name="lucide:arrow-left" size={19} color="var(--brand-navy)" />
        </button>
        <span className="acw-crumb"><a onClick={() => goACW(MY_LEARNING_URL_ACW)}>My Learning</a> &nbsp;/&nbsp; <span>All Courses</span></span>
      </div>

      <div className="acw-head">
        <div>
          <span className="lrn-eyebrow">{TIER_NAME_ACW} Path</span>
          <h1>All courses</h1>
          <p>Browse the catalogue by subject. The {ownedCount} {ownedCount === 1 ? "course" : "courses"} you're already enrolled on {ownedCount === 1 ? "lives" : "live"} in My Learning.</p>
        </div>
        <label className="acw-search">
          <IconACW name="search" size={20} color="var(--gray-450)" />
          <input ref={searchRef} type="search" placeholder="Search courses, topics, instructors…" aria-label="Search courses" value={query}
            autoComplete="off" onChange={(e) => setQuery(e.target.value)} />
          {searching && <button type="button" className="acw-clear-btn" aria-label="Clear search" onClick={() => setQuery("")}><IconifyACW name="lucide:x" size={16} color="var(--text-primary)" /></button>}
        </label>
      </div>

      {!searching &&
        <div className="acw-filters" data-screen-label="Subject filter" role="list">
          {["All"].concat(ACW_CATS).map((k) =>
            <button key={k} type="button" role="listitem" className={"acw-filter" + (k === "All" ? " on" : "")} aria-current={k === "All" ? "page" : undefined}
              onClick={() => k !== "All" && onOpenCat(k)}>{k}</button>)}
        </div>}

      {searching ?
        <section className="acw-sec" data-screen-label="Search results" aria-live="polite">
          <div className="lrn-sec-h">
            <h2>Results</h2>
            <span className="sub">{results.length} {results.length === 1 ? "course" : "courses"}</span>
          </div>
          {results.length === 0 ?
            <div className="acw-empty-box">
              <p>No courses match “{query.trim()}”.</p>
              <button type="button" className="acw-clear" onClick={() => setQuery("")}>Clear search</button>
            </div> :
            <div className="acw-grid" role="list">
              {results.map((c) => <div role="listitem" key={c.slug} className="acw-rail-item"><ACWCourseCard c={c} done={done} /></div>)}
            </div>}
        </section> :
        <React.Fragment>
          <section className="acw-sec" data-screen-label="Popular topics">
            <div className="lrn-sec-h"><h2>Popular topics</h2></div>
            <div className="acw-topics" role="list">
              {ACW_TOPICS.map((t) => <button key={t} type="button" role="listitem" className="acw-topic" onClick={() => pickQuery(t)}>{t}</button>)}
            </div>
          </section>

          {rails.map((r) =>
            <ACWRail key={r.cat} cat={r.cat} courses={r.courses} expanded={!!expanded[r.cat]} onToggle={() => toggleExpanded(r.cat)} onOpenCat={onOpenCat} done={done} />)}

          <ACWInstructors onPick={pickQuery} />
        </React.Fragment>}
    </div>
  );
}

/* ---------------------------------------------------------------- app -- */
function AllCoursesWebApp() {
  const [view, setView] = useStateACW(catFromUrlACW);
  const pushedRef = useRefACW(false);
  /* learning-store-web returns [done, mark]; learning-shared returns the array */
  const doneRaw = PFLACW.useLessonsDone ? PFLACW.useLessonsDone() : [];
  const done = Array.isArray(doneRaw) && doneRaw.length === 2 && Array.isArray(doneRaw[0]) && typeof doneRaw[1] === "function" ? doneRaw[0] : doneRaw;
  ACW_PURCHASED = PFLACW.usePurchased ? PFLACW.usePurchased() : [];
  useEffectACW(() => pfTagActiveNavACW("My Learning"));
  useEffectACW(() => {
    const onPop = () => setView(catFromUrlACW());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffectACW(() => { if (!view) document.title = "PROfinity — All Courses · My Learning"; }, [view]);
  const openCat = (k) => {
    try { window.history.pushState({ cat: k }, "", "?cat=" + encodeURIComponent(k)); pushedRef.current = true; } catch (e) {}
    setView(k);
    window.scrollTo({ top: 0 });
  };
  const closeCat = () => {
    if (pushedRef.current) { pushedRef.current = false; window.history.back(); return; }
    try { window.history.replaceState({}, "", window.location.pathname); } catch (e) {}
    setView(null);
  };

  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavACW active="My Learning" user={ME_ACW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateACW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      {view ? <ACWCategoryPage key={view} cat={view} free={view === ACW_FREE_KEY} onBack={view === ACW_FREE_KEY ? () => goACW(MY_LEARNING_URL_ACW) : closeCat} done={done} /> : <ACWBrowse onOpenCat={openCat} done={done} />}
    </div>
  );
}

if (!FREE_ACW || ACW_FREE_VIEW) ReactDOM.createRoot(document.getElementById("pf-root")).render(<AllCoursesWebApp />);
