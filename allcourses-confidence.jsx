/* ===========================================================================
   PROfinity — All courses (Confidence tier, mobile) · iPhone 17 Pro Max
   Shared by AllCoursesConfidence.html (deep-navy reader, #0B1024),
   AllCoursesConfidenceLight.html (warm off-white My Learning surface) and
   AllCoursesMobile.html (standard shell: unpinned, follows the app theme and
   links back to LearningMobile.html / CourseDetail.html).

   Reached from the "Discover your journey" card on the Confidence My Learning
   page (learning-confidence.jsx). Browses the Confidence catalogue by subject:
   the courses the member is already enrolled on live in My Learning, so the
   category rails list only the courses they do NOT own yet — every one of
   those is "Included in Mastery" and routes to the subscription page. Owned
   courses still surface in search results, with their progress bar.

   Composed on the bound DS bundle (ProgressBar, Avatar, IconifyIcon) and the
   shared mobile chrome (window.PFSideMenuC / PFNotificationsPanelC /
   PFMessagesPanelC / PFUseHeaderHideC). Identifiers are suffixed -ACC (the
   legacy all-courses-mobile.jsx already owns -AC) because every Babel page
   script shares one global scope.

   Variant flags are read at module scope, so the shell must set them before
   this script loads:
     window.PF_TIER     = "confidence"
     window.PF_LC_LIGHT = true          (light page only)
   The screen root is .acc-screen and adds .lc-light for the light variant.
   Deep links: ?cat=Anatomy opens that category page, ?q=lip prefills search.
   =========================================================================== */
const { useState: useStateACC, useEffect: useEffectACC, useRef: useRefACC, useMemo: useMemoACC } = React;
const DSACC = window.ProfinityDesignSystem_c2b5cc;
const SideMenuACC = window.PFSideMenuC;
const NotificationsACC = window.PFNotificationsPanelC;
const MessagesACC = window.PFMessagesPanelC;
const useHeaderHideACC = window.PFUseHeaderHideC;

/* Variant resolution, in priority order:
     1. window.PF_LC_LIGHT set by a shell (the two Confidence pages pin it);
     2. ?theme=light|dark on the URL;
     3. the app-wide theme — dark-mode-init.js stamps data-theme from pf-theme
        (AllCoursesMobile.html, the standard shell, follows this).
   ACC_LIGHT / ACC_INK / ACC_LOCKUP / ACC_URLS are module-level `let`s
   re-derived when the theme changes (see useThemeSyncACC). */
const ACC_PARAMS = new URLSearchParams(window.location.search);
const ACC_PINNED = window.PF_LC_LIGHT != null;
function resolveLightACC() {
  if (ACC_PINNED) return !!window.PF_LC_LIGHT;
  const q = ACC_PARAMS.get("theme");
  if (q === "light") return true;
  if (q === "dark") return false;
  return document.documentElement.getAttribute("data-theme") !== "dark";
}

/* Glyph ink per variant. The DS IconifyIcon writes its colour inline, so
   per-variant colours are passed at the call site, never set in CSS.
   Gold #CE9957 fails AA on the light surface (~2.4:1) → #8A5303 there. */
function inkACC(light) {
  return {
    gold: light ? "#8A5303" : "#CE9957",
    text: light ? "#292569" : "#FFFFFF",
    body: light ? "#475467" : "rgba(255,255,255,.76)",
    muted: light ? "#475467" : "rgba(255,255,255,.62)",
    /* glyph on a solid #CE9957 fill — navy reads 5.3:1 on light, #0B1024 7.5:1 on dark */
    onGold: light ? "#292569" : "#0B1024",
    onNavy: "#FFFFFF",
    tabOff: light ? "#000000" : "#FFFFFF"
  };
}
function lockupACC(light) { return light ? "assets/profinity-academy-logo-full.png" : "assets/profinity-logo-dark.jpg"; }

/* Sibling pages in the same shell so the theme never flips mid-journey.
   Pinned Confidence shells stay in the Confidence pages; the standard shell
   (AllCoursesMobile.html) goes back to the standard My Learning / course page. */
function urlsACC(light) {
  if (!ACC_PINNED) {
    return {
      self: "AllCoursesMobile.html",
      learning: "LearningMobile.html",
      courseDetail: "CourseDetail.html",
      membership: "MembershipTier.html"
    };
  }
  return {
    self: light ? "AllCoursesConfidenceLight.html" : "AllCoursesConfidence.html",
    other: light ? "AllCoursesConfidence.html" : "AllCoursesConfidenceLight.html",
    learning: light ? "LearningMobileConfidenceLight.html" : "LearningMobileConfidence.html",
    courseDetail: light ? "CourseDetailConfidenceLight.html" : "CourseDetailConfidence.html",
    /* locked courses are part of Mastery — the subscription page sells the upgrade */
    membership: "MembershipTier.html"
  };
}

let ACC_LIGHT = resolveLightACC();
let ACC_INK = inkACC(ACC_LIGHT);
let ACC_LOCKUP = lockupACC(ACC_LIGHT);
let ACC_URLS = urlsACC(ACC_LIGHT);

/* Follow the app theme live on the standard shell: a data-theme change on
   <html> or a pf-theme write in another tab re-derives the variant. */
function useThemeSyncACC() {
  const [, bump] = useStateACC(0);
  /* compare against what THIS hook last rendered with — the screen and the
     app shell both subscribe, and whichever runs first updates the module
     state, so a shared comparison would leave the other one stale */
  const seen = useRefACC(ACC_LIGHT);
  useEffectACC(() => {
    if (ACC_PINNED || ACC_PARAMS.get("theme")) return;
    const apply = () => {
      const light = resolveLightACC();
      if (light !== ACC_LIGHT) { ACC_LIGHT = light; ACC_INK = inkACC(light); ACC_LOCKUP = lockupACC(light); ACC_URLS = urlsACC(light); }
      if (light === seen.current) return;
      seen.current = light;
      bump((n) => n + 1);
    };
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onStorage = (e) => {
      if (e.key && e.key !== "pf-theme") return;
      try {
        const t = localStorage.getItem("pf-theme");
        if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
      } catch (err) {}
      apply();
    };
    window.addEventListener("storage", onStorage);
    return () => { mo.disconnect(); window.removeEventListener("storage", onStorage); };
  }, []);
}

/* Drawer "Display" toggle: pinned shells swap to the sibling page; the
   standard shell flips the app-wide theme (pf-theme → data-theme). */
function toggleDarkACC() {
  if (ACC_PINNED) { goACC(ACC_URLS.other); return; }
  const next = ACC_LIGHT ? "dark" : "light";
  try { localStorage.setItem("pf-theme", next); } catch (e) {}
  document.documentElement.setAttribute("data-theme", next);
}

function goACC(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

let ACC_REDUCE = false;
try { ACC_REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

/* ---------------------------------------------------------------- catalogue -- */
const ACC_CATS = ["Lips & Perioral", "Anatomy", "Safety", "Patient Journey"];

/* Popular topics act as search shortcuts: tapping one fills the search field. */
const ACC_TOPICS = [
"Lip anatomy", "Complication management", "Cannula technique", "Consent & consultation",
"Vascular occlusion", "Facial assessment", "Marionette lines", "Aftercare", "Photography", "Toxin"];

const ACC_INSTRUCTORS = [
{ name: "Dr Tim Pearce", role: "Founder · Lips & toxin", avatar: "assets/avatar-drtim.png" },
{ name: "Dr Priya Shah", role: "Facial anatomy", avatar: "assets/avatar-priya-shah.jpg" },
{ name: "Dr Amir Khan", role: "Complications & safety", avatar: "assets/avatar-amir-khan.jpg" },
{ name: "Sarah Collins", role: "Consultation & consent", avatar: "assets/avatar-sarah-collins.jpg" },
{ name: "Miranda Pearce", role: "Patient journey & growth", avatar: "assets/avatar-miranda.jpg" }];

const ACC_IMG = {
  eightD: "assets/course-8d-lip-design.jpg",
  fullFace: "assets/course-full-face-rejuvenation.jpg",
  lip: "assets/course-lip.png",
  advLip: "assets/course-advanced-lip-techniques.jpg",
  protox: "assets/course-protox.png",
  clinicLip: "assets/clinic-lip-design.png",
  complications: "assets/course-complications.jpg",
  cheek: "assets/course-cheek-contouring.jpg",
  tearTrough: "assets/course-tear-trough.jpg",
  temple: "assets/course-temple.png",
  templeFiller: "assets/course-temple-filler.webp",
  jawline: "assets/course-jawline-sculpting.jpg",
  brow: "assets/course-brow-lift.jpg",
  skin: "assets/course-skin-boosters.jpg",
  rhino: "assets/course-rhinoplasty.jpg",
  consult: "assets/course-consultation.jpg",
  membership: "assets/course-membership-banner.jpg",
  marketing: "assets/course-marketing.webp"
};

/* Every category carries six unowned courses so each rail scrolls and its
   "See all" has something to expand into. `owned` courses (progress `pct`)
   are the two the member is enrolled on — hidden from the rails, found by
   search. `slug` set → the course page knows it; otherwise the generic
   ?title= route builds it. */
const ACC_COURSES = [
/* Lips & Perioral */
{ title: "8D Lip Design", cat: "Lips & Perioral", blurb: "The complete lip anatomy, assessment and technique pathway.", lessons: 39, mins: 250, image: ACC_IMG.eightD, by: "Dr Tim Pearce", topics: ["Lip anatomy"], owned: true, pct: 72, slug: "8d-lip-design" },
{ title: "Perioral Rejuvenation", cat: "Lips & Perioral", blurb: "Marionette lines, chin support and smoker's lines.", lessons: 12, mins: 96, image: ACC_IMG.fullFace, by: "Dr Tim Pearce", topics: ["Marionette lines"] },
{ title: "Corner Lip Lift", cat: "Lips & Perioral", blurb: "Lift a downturned mouth corner without over-filling.", lessons: 8, mins: 64, image: ACC_IMG.lip, by: "Dr Tim Pearce", topics: ["Marionette lines"] },
{ title: "Advanced Lip Techniques", cat: "Lips & Perioral", blurb: "Layered volume, borders and perioral balance built on 8D.", lessons: 18, mins: 150, image: ACC_IMG.advLip, by: "Dr Tim Pearce", topics: ["Lip anatomy", "Cannula technique"] },
{ title: "Lip Flip with Toxin", cat: "Lips & Perioral", blurb: "Subtle eversion of the upper lip with micro-doses.", lessons: 6, mins: 45, image: ACC_IMG.protox, by: "Dr Tim Pearce", topics: ["Toxin"] },
{ title: "Russian Lip Technique", cat: "Lips & Perioral", blurb: "Vertical tenting for height with a flat side profile.", lessons: 10, mins: 80, image: ACC_IMG.clinicLip, by: "Dr Tim Pearce", topics: ["Lip anatomy"] },
{ title: "Lip Correction & Dissolving", cat: "Lips & Perioral", blurb: "Hyaluronidase protocols and re-treatment planning.", lessons: 9, mins: 72, image: ACC_IMG.complications, by: "Dr Tim Pearce", topics: ["Complication management"] },
/* Anatomy */
{ title: "Functional Facial Anatomy", cat: "Anatomy", blurb: "Layers, planes and danger zones every injector needs.", lessons: 14, mins: 120, image: ACC_IMG.cheek, by: "Dr Priya Shah", topics: ["Facial assessment"] },
{ title: "Vascular Anatomy of the Face", cat: "Anatomy", blurb: "Facial, angular and labial arteries mapped for filler.", lessons: 10, mins: 85, image: ACC_IMG.tearTrough, by: "Dr Priya Shah", topics: ["Vascular occlusion"] },
{ title: "Lip Anatomy Deep Dive", cat: "Anatomy", blurb: "Vermilion, philtrum, orbicularis oris and the labial arteries.", lessons: 8, mins: 64, image: ACC_IMG.eightD, by: "Dr Priya Shah", topics: ["Lip anatomy"] },
{ title: "Midface & Cheek Anatomy", cat: "Anatomy", blurb: "Fat pads, ligaments and support for volumising.", lessons: 11, mins: 90, image: ACC_IMG.temple, by: "Dr Priya Shah", topics: ["Facial assessment"] },
{ title: "Lower Face & Jawline Anatomy", cat: "Anatomy", blurb: "Masseter, mandible and the marionette region.", lessons: 9, mins: 75, image: ACC_IMG.jawline, by: "Dr Priya Shah", topics: ["Marionette lines"] },
{ title: "Periorbital Anatomy", cat: "Anatomy", blurb: "Tear trough, orbital rim and the infraorbital bundle.", lessons: 7, mins: 56, image: ACC_IMG.brow, by: "Dr Priya Shah", topics: ["Vascular occlusion"] },
/* Safety */
{ title: "Complications Management", cat: "Safety", blurb: "Recognise, prevent and manage vascular and other complications.", lessons: 12, mins: 100, image: ACC_IMG.complications, by: "Dr Tim Pearce", topics: ["Complication management", "Vascular occlusion"] },
{ title: "Vascular Occlusion Protocol", cat: "Safety", blurb: "Spot the signs early and act on a rehearsed hyaluronidase plan.", lessons: 6, mins: 48, image: ACC_IMG.skin, by: "Dr Amir Khan", topics: ["Vascular occlusion", "Complication management"] },
{ title: "Safety & Injection Essentials", cat: "Safety", blurb: "Aseptic technique, aspiration and needle versus cannula.", lessons: 10, mins: 80, image: ACC_IMG.templeFiller, by: "Dr Amir Khan", topics: ["Cannula technique"] },
{ title: "Cannula Technique Masterclass", cat: "Safety", blurb: "Entry points, planes and depth control for safer filler.", lessons: 8, mins: 64, image: ACC_IMG.temple, by: "Dr Amir Khan", topics: ["Cannula technique"] },
{ title: "Emergency Kit & Protocols", cat: "Safety", blurb: "Build, check and drill your clinic's emergency response.", lessons: 5, mins: 40, image: ACC_IMG.rhino, by: "Dr Amir Khan", topics: ["Complication management"] },
{ title: "Infection Control & Aftercare", cat: "Safety", blurb: "Prevent, recognise and treat infection and biofilm.", lessons: 7, mins: 56, image: ACC_IMG.skin, by: "Dr Amir Khan", topics: ["Aftercare"] },
/* Patient Journey */
{ title: "Consultation & Patient Assessment", cat: "Patient Journey", blurb: "Build trust and plan safe, effective treatments from the first visit.", lessons: 9, mins: 72, image: ACC_IMG.consult, by: "Sarah Collins", topics: ["Consent & consultation", "Facial assessment"], owned: true, pct: 20 },
{ title: "Consent & Documentation", cat: "Patient Journey", blurb: "Consent forms, cooling-off periods and record keeping.", lessons: 6, mins: 45, image: ACC_IMG.membership, by: "Sarah Collins", topics: ["Consent & consultation"] },
{ title: "Facial Assessment & Treatment Planning", cat: "Patient Journey", blurb: "Proportions, photography and a phased treatment plan.", lessons: 10, mins: 85, image: ACC_IMG.fullFace, by: "Sarah Collins", topics: ["Facial assessment", "Photography"] },
{ title: "Clinical Photography", cat: "Patient Journey", blurb: "Standardised before-and-afters that protect you and the patient.", lessons: 5, mins: 40, image: ACC_IMG.brow, by: "Miranda Pearce", topics: ["Photography"] },
{ title: "Managing Expectations", cat: "Patient Journey", blurb: "Difficult conversations, unhappy patients and the follow-up.", lessons: 7, mins: 56, image: ACC_IMG.marketing, by: "Miranda Pearce", topics: ["Consent & consultation"] },
{ title: "Aftercare & Review Visits", cat: "Patient Journey", blurb: "Aftercare scripts, review timing and patient retention.", lessons: 6, mins: 48, image: ACC_IMG.skin, by: "Sarah Collins", topics: ["Aftercare"] },
{ title: "Pricing & Treatment Packages", cat: "Patient Journey", blurb: "Package, price and present your treatments with confidence.", lessons: 6, mins: 50, image: ACC_IMG.marketing, by: "Miranda Pearce", topics: [] }];

const ACC_OWNED_COUNT = ACC_COURSES.filter((c) => c.owned).length;

function haystackACC(c) {
  return [c.title, c.cat, c.blurb, c.by].concat(c.topics || []).join(" ").toLowerCase();
}

/* Owned → the course page in this variant; locked → Mastery upgrade. */
function courseUrlACC(c) {
  if (!c.owned) return ACC_URLS.membership;
  const p = c.slug ? { course: c.slug } : { title: c.title, instr: c.by, pct: c.pct };
  return ACC_URLS.courseDetail + "?" + new URLSearchParams(p).toString();
}

const ACC_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: null },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" },
{ key: "Rewards", label: "Rewards", icon: "lucide:gift", href: "RewardsDashboard.html" }];

/* ---------------------------------------------------------------- header -- */
/* burger · lockup · search · notifications · messages — the same top bar as
   the Confidence My Learning page. Search focuses this page's own field. */
function ACCHeader({ onMenu, onSearch, onBell, onMessages }) {
  return (
    <header className="acc-top" data-screen-label="Header">
      <button type="button" className="acc-burger" aria-label="Menu" onClick={onMenu}>
        <DSACC.IconifyIcon name="lucide:menu" size={24} color={ACC_INK.text} />
      </button>
      <div className="acc-lockup"><img src={ACC_LOCKUP} alt="PROfinity Academy" /></div>
      <span className="acc-grow" />
      <button type="button" className="acc-ic" aria-label="Search courses" onClick={onSearch}>
        <DSACC.IconifyIcon name="lucide:search" size={20} color={ACC_INK.text} />
      </button>
      <button type="button" className="acc-ic" aria-label="Notifications, 12 unread" onClick={onBell}>
        <DSACC.IconifyIcon name="lucide:bell" size={20} color={ACC_INK.text} />
        <span className="dot" aria-hidden="true">12</span>
      </button>
      <button type="button" className="acc-ic" aria-label="Messages, 12 unread" onClick={onMessages}>
        <DSACC.IconifyIcon name="lucide:message-circle" size={20} color={ACC_INK.text} />
        <span className="dot" aria-hidden="true">12</span>
      </button>
    </header>);
}

/* ---------------------------------------------------------------- course card -- */
/* The whole card is the control — no chevron. 282px wide with a 150px cover
   on the rails; `wide` renders the compact row used by expanded lists and
   search results. Locked courses carry the gold "Included in Mastery" chip
   and route to the subscription page; owned ones show their progress. */
function ACCCourseCard({ c, wide, large }) {
  const locked = !c.owned;
  const label = c.title + " — " + c.lessons + " lessons, " + c.mins + " minutes" + (locked ? ", included in Mastery" : ", " + c.pct + "% complete");
  return (
    <button type="button" className={"acc-card" + (wide ? " acc-card-wide" : "") + (large ? " acc-card-lg" : "")} onClick={() => goACC(courseUrlACC(c))} aria-label={label}>
      <span className="acc-card-cover">
        <img src={c.image} alt="" loading="lazy" />
        {locked &&
        <span className="acc-card-lock" aria-hidden="true">
          <DSACC.IconifyIcon name="lucide:lock" size={12} color="#fff" />
        </span>}
      </span>
      <span className="acc-card-body">
        <span className="acc-eyebrow acc-eyebrow-gold">{c.cat}</span>
        <span className="acc-card-title">{c.title}</span>
        {(large || wide) && <span className="acc-card-by">{c.by}</span>}
        <span className="acc-card-blurb">{c.blurb}</span>
        <span className="acc-card-meta">{c.lessons} lessons · {c.mins} min</span>
        {locked ?
        <span className="acc-chip-mastery">
          <DSACC.IconifyIcon name="lucide:crown" size={13} color={ACC_INK.gold} />
          Included in Mastery
        </span> :
        <span className="acc-card-prog">
          <DSACC.ProgressBar value={c.pct} showPercent={false} height={6} />
          <span className="acc-card-pct">{c.pct}% complete</span>
        </span>}
      </span>
    </button>);
}

/* ---------------------------------------------------------------- category rail -- */
/* Horizontal snap rail; "See all" (only when the category has more than five
   courses) expands it into the full vertical list and flips to "Show less". */
function ACCRail({ cat, courses, expanded, onToggle }) {
  const canExpand = courses.length > 5;
  const id = "acc-rail-" + cat.replace(/[^a-z]+/gi, "-").toLowerCase();
  return (
    <section className="acc-sec" data-screen-label={cat}>
      <div className="acc-sec-h">
        <h2 className="acc-eyebrow acc-eyebrow-gold" id={id + "-h"}>{cat}</h2>
        {canExpand &&
        <button type="button" className="acc-seeall" aria-expanded={expanded} aria-controls={id} onClick={onToggle}>
          {expanded ? "Show less" : "See all"}
          <DSACC.IconifyIcon name={expanded ? "lucide:chevron-up" : "lucide:chevron-right"} size={16} color={ACC_INK.text} />
        </button>}
      </div>
      <div id={id} className={expanded ? "acc-list" : "acc-rail"} role="list" aria-labelledby={id + "-h"}>
        {courses.map((c) => <div role="listitem" key={c.title} className="acc-rail-item"><ACCCourseCard c={c} wide={expanded} /></div>)}
      </div>
    </section>);
}

/* ---------------------------------------------------------------- instructors -- */
/* No "See all": there is no instructor directory to link to. Each card
   filters the catalogue to that instructor's courses instead. */
function ACCInstructors({ onPick }) {
  return (
    <section className="acc-sec" data-screen-label="Popular instructors">
      <div className="acc-sec-h"><h2 className="acc-eyebrow acc-eyebrow-gold">Popular instructors</h2></div>
      <div className="acc-rail acc-rail-people" role="list">
        {ACC_INSTRUCTORS.map((p) =>
        <div role="listitem" key={p.name} className="acc-rail-item">
          <button type="button" className="acc-person" onClick={() => onPick(p.name)} aria-label={"Show courses by " + p.name}>
            <DSACC.Avatar src={p.avatar} name={p.name} size={52} />
            <span className="acc-person-tx">
              <span className="acc-person-name">{p.name}</span>
              <span className="acc-person-role">{p.role}</span>
            </span>
          </button>
        </div>)}
      </div>
    </section>);
}

/* ---------------------------------------------------------------- category page -- */
/* Tapping a subject chip opens this layer over the browse screen (the browse
   scroller stays mounted underneath, so its position and header state
   survive). Floating back / filter buttons, a large serif title, a "Courses to
   get you started" rail, the category's own topics and instructors, then the
   full "All Courses" list. The title slides into the bar once you scroll. */
const ACC_SORTS = [
{ key: "rec", label: "Recommended" },
{ key: "short", label: "Shortest first" },
{ key: "long", label: "Most lessons" },
{ key: "az", label: "A to Z" }];
const ACC_SHOWS = [
{ key: "all", label: "All courses" },
{ key: "new", label: "Not started" },
{ key: "mine", label: "In progress" }];

function catFromUrlACC() {
  const c = new URLSearchParams(window.location.search).get("cat");
  return ACC_CATS.indexOf(c) !== -1 ? c : null;
}

function ACCFilterSheet({ open, sort, show, onSort, onShow, onReset, onClose }) {
  useEffectACC(() => {
    const root = document.querySelector(".acc-screen");
    if (root) root.classList.toggle("sheet-open", !!open);
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); if (root) root.classList.remove("sheet-open"); };
  }, [open]);
  if (!open) return null;
  return (
    <div className="acc-sheet-wrap" data-screen-label="Filter sheet">
      <div className="acc-scrim" onClick={onClose} />
      <div className="acc-sheet" role="dialog" aria-modal="true" aria-label="Filter and sort">
        <span className="acc-sheet-handle" aria-hidden="true" />
        <div className="acc-sheet-h">
          <h2 className="acc-h2">Filter &amp; sort</h2>
          <button type="button" className="acc-round acc-round-flat" aria-label="Close" onClick={onClose}>
            <DSACC.IconifyIcon name="lucide:x" size={20} color={ACC_INK.text} />
          </button>
        </div>
        <div className="acc-sheet-group" role="group" aria-labelledby="acc-sort-h">
          <span className="acc-eyebrow acc-eyebrow-gold" id="acc-sort-h">Sort by</span>
          <div className="acc-sheet-opts">
            {ACC_SORTS.map((o) =>
            <button key={o.key} type="button" className={"acc-opt" + (sort === o.key ? " on" : "")} aria-pressed={sort === o.key} onClick={() => onSort(o.key)}>
              {o.label}
              {sort === o.key && <DSACC.IconifyIcon name="lucide:check" size={16} color={ACC_INK.onNavy} />}
            </button>)}
          </div>
        </div>
        <div className="acc-sheet-group" role="group" aria-labelledby="acc-show-h">
          <span className="acc-eyebrow acc-eyebrow-gold" id="acc-show-h">Show</span>
          <div className="acc-sheet-opts">
            {ACC_SHOWS.map((o) =>
            <button key={o.key} type="button" className={"acc-opt" + (show === o.key ? " on" : "")} aria-pressed={show === o.key} onClick={() => onShow(o.key)}>
              {o.label}
              {show === o.key && <DSACC.IconifyIcon name="lucide:check" size={16} color={ACC_INK.onNavy} />}
            </button>)}
          </div>
        </div>
        <div className="acc-sheet-foot">
          <button type="button" className="acc-btn-ghost" onClick={onReset}>Reset</button>
          <button type="button" className="acc-btn-fill" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>);
}

function ACCCategoryPage({ cat, onBack }) {
  const courses = useMemoACC(() => ACC_COURSES.filter((c) => c.cat === cat), [cat]);
  const starters = courses.filter((c) => !c.owned).slice(0, 4);
  const topics = ACC_TOPICS.filter((t) => courses.some((c) => (c.topics || []).indexOf(t) !== -1));
  const people = ACC_INSTRUCTORS.filter((p) => courses.some((c) => c.by === p.name));

  const [topic, setTopic] = useStateACC(null);
  const [who, setWho] = useStateACC(null);
  const [sort, setSort] = useStateACC("rec");
  const [show, setShow] = useStateACC("all");
  const [sheet, setSheet] = useStateACC(false);
  const [scrolled, setScrolled] = useStateACC(false);
  const scrollRef = useRefACC(null);
  const listRef = useRefACC(null);

  useEffectACC(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 72);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const list = useMemoACC(() => {
    let out = courses.slice();
    if (topic) out = out.filter((c) => (c.topics || []).indexOf(topic) !== -1);
    if (who) out = out.filter((c) => c.by === who);
    if (show === "new") out = out.filter((c) => !c.owned);
    if (show === "mine") out = out.filter((c) => c.owned);
    if (sort === "short") out.sort((a, b) => a.mins - b.mins);
    if (sort === "long") out.sort((a, b) => b.lessons - a.lessons);
    if (sort === "az") out.sort((a, b) => a.title.localeCompare(b.title));
    return out;
  }, [courses, topic, who, show, sort]);

  const jumpToList = () => {
    const el = listRef.current;
    if (el) el.scrollIntoView({ behavior: ACC_REDUCE ? "auto" : "smooth", block: "start" });
  };
  const pickTopic = (t) => { setTopic(topic === t ? null : t); jumpToList(); };
  const pickWho = (n) => { setWho(who === n ? null : n); jumpToList(); };
  const filtered = topic || who || show !== "all" || sort !== "rec";
  const reset = () => { setTopic(null); setWho(null); setShow("all"); setSort("rec"); };
  const sortLabel = ACC_SORTS.filter((o) => o.key === sort)[0].label;
  const showLabel = ACC_SHOWS.filter((o) => o.key === show)[0].label;

  return (
    <React.Fragment>
    <div className="acc-cat" data-screen-label={"Category · " + cat}>
      <header className={"acc-cat-top" + (scrolled ? " on" : "")}>
        <button type="button" className="acc-round" aria-label="Back to all courses" onClick={onBack}>
          <DSACC.IconifyIcon name="lucide:chevron-left" size={24} color={ACC_INK.text} />
        </button>
        <span className="acc-cat-top-title" aria-hidden={!scrolled}>{cat}</span>
        <button type="button" className={"acc-round" + (filtered ? " acc-round-dot" : "")} aria-label={"Filter and sort" + (filtered ? ", filters active" : "")} aria-expanded={sheet} onClick={() => setSheet(true)}>
          <DSACC.IconifyIcon name="lucide:settings-2" size={22} color={ACC_INK.text} />
        </button>
      </header>

      <div className="acc-scroll acc-cat-scroll" ref={scrollRef}>
        <h1 className="acc-cat-h1">{cat}</h1>

        <section className="acc-sec acc-sec-tight" data-screen-label="Courses to get you started">
          <h2 className="acc-h2">Courses to get you started</h2>
          <div className="acc-rail" role="list">
            {starters.map((c) => <div role="listitem" key={c.title} className="acc-rail-item"><ACCCourseCard c={c} large /></div>)}
          </div>
        </section>

        {topics.length > 0 &&
        <section className="acc-sec" data-screen-label="Popular topics">
          <h2 className="acc-h2">Popular topics</h2>
          <div className="acc-topics" role="list">
            {topics.map((t) =>
            <button key={t} type="button" role="listitem" className={"acc-topic" + (topic === t ? " on" : "")} aria-pressed={topic === t} onClick={() => pickTopic(t)}>{t}</button>)}
          </div>
        </section>}

        {people.length > 0 &&
        <section className="acc-sec" data-screen-label="Popular instructors">
          <h2 className="acc-h2">Popular instructors</h2>
          <div className="acc-rail acc-rail-people" role="list">
            {people.map((p) =>
            <div role="listitem" key={p.name} className="acc-rail-item">
              <button type="button" className={"acc-person" + (who === p.name ? " on" : "")} aria-pressed={who === p.name} onClick={() => pickWho(p.name)}>
                <DSACC.Avatar src={p.avatar} name={p.name} size={52} />
                <span className="acc-person-tx">
                  <span className="acc-person-name">{p.name}</span>
                  <span className="acc-person-role">{p.role}</span>
                </span>
              </button>
            </div>)}
          </div>
        </section>}

        <section className="acc-sec" data-screen-label="All courses in category" ref={listRef}>
          <div className="acc-sec-h acc-sec-h-lg">
            <h2 className="acc-h2">All Courses</h2>
            <span className="acc-sub">{list.length} {list.length === 1 ? "course" : "courses"}</span>
          </div>
          {filtered &&
          <div className="acc-active" aria-live="polite">
            {topic && <button type="button" className="acc-active-chip" onClick={() => setTopic(null)}>{topic}<DSACC.IconifyIcon name="lucide:x" size={14} color={ACC_INK.text} /></button>}
            {who && <button type="button" className="acc-active-chip" onClick={() => setWho(null)}>{who}<DSACC.IconifyIcon name="lucide:x" size={14} color={ACC_INK.text} /></button>}
            {show !== "all" && <button type="button" className="acc-active-chip" onClick={() => setShow("all")}>{showLabel}<DSACC.IconifyIcon name="lucide:x" size={14} color={ACC_INK.text} /></button>}
            {sort !== "rec" && <button type="button" className="acc-active-chip" onClick={() => setSort("rec")}>{sortLabel}<DSACC.IconifyIcon name="lucide:x" size={14} color={ACC_INK.text} /></button>}
            <button type="button" className="acc-seeall" onClick={reset}>Clear all</button>
          </div>}
          {list.length === 0 ?
          <div className="acc-empty">
            <p>No {cat} courses match these filters.</p>
            <button type="button" className="acc-seeall" onClick={reset}>Clear filters</button>
          </div> :
          <div className="acc-list" role="list">
            {list.map((c) => <div role="listitem" key={c.title} className="acc-rail-item"><ACCCourseCard c={c} wide /></div>)}
          </div>}
        </section>
      </div>
    </div>
    {/* rendered at screen level so it stacks above the dock and status bar */}
    <ACCFilterSheet open={sheet} sort={sort} show={show} onSort={setSort} onShow={setShow} onReset={reset} onClose={() => setSheet(false)} />
    </React.Fragment>);
}

/* ---------------------------------------------------------------- tab bar -- */
function ACCTabBar({ compact }) {
  return (
    <nav className={"lm-tabs" + (compact ? " lm-tabs-compact" : "")} aria-label="Primary">
      {ACC_TABS.map((t) => {
        const on = t.key === "Learning";
        return (
          <button key={t.key} type="button" className={"lm-tab" + (on ? " on" : "")} aria-current={on ? "page" : undefined}
            onClick={() => { const h = t.key === "Learning" ? ACC_URLS.learning : t.href; if (h) goACC(h); }}>
            <span className="ic">
              <DSACC.IconifyIcon name={t.icon} size={24} color={on ? (ACC_LIGHT ? "#fff" : ACC_INK.onGold) : ACC_INK.tabOff} />
              {t.dot && <span className="dot">{t.dot}</span>}
            </span>
            <span className="lbl">{t.label}</span>
          </button>);
      })}
    </nav>);
}

/* ---------------------------------------------------------------- screen -- */
function AllCoursesConfidence() {
  useThemeSyncACC();
  /* subject chips open the category layer; ?cat= deep-links straight into it */
  const [view, setView] = useStateACC(catFromUrlACC);
  const pushedRef = useRefACC(false);
  useEffectACC(() => {
    const onPop = () => setView(catFromUrlACC());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const openCat = (k) => {
    if (k === "All") return;
    try { window.history.pushState({ cat: k }, "", "?cat=" + encodeURIComponent(k)); pushedRef.current = true; } catch (e) {}
    setView(k);
  };
  const closeCat = () => {
    if (pushedRef.current) { pushedRef.current = false; window.history.back(); return; }
    try { window.history.replaceState({}, "", window.location.pathname); } catch (e) {}
    setView(null);
  };
  const [query, setQuery] = useStateACC(ACC_PARAMS.get("q") || "");
  const [expanded, setExpanded] = useStateACC({});
  const [menuOpen, setMenuOpen] = useStateACC(false);
  const [notifOpen, setNotifOpen] = useStateACC(false);
  const [msgOpen, setMsgOpen] = useStateACC(false);

  const scrollRef = useRefACC(null);
  const searchRef = useRefACC(null);
  const { hidden, floating } = useHeaderHideACC(scrollRef);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  /* live search across title, category, blurb, instructor and topics */
  const results = useMemoACC(() => searching ? ACC_COURSES.filter((c) => haystackACC(c).indexOf(q) !== -1) : [], [q]);

  /* rails list unowned courses only — the enrolled ones live in My Learning */
  const rails = useMemoACC(() => ACC_CATS.map((k) => ({ cat: k, courses: ACC_COURSES.filter((c) => c.cat === k && !c.owned) })), []);

  const scrollTop = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: 0, behavior: ACC_REDUCE ? "auto" : "smooth" });
  };
  const pickQuery = (text) => { setQuery(query.trim() === text ? "" : text); scrollTop(); };
  const focusSearch = () => { scrollTop(); const el = searchRef.current; if (el) el.focus(); };
  const toggleExpanded = (k) => setExpanded((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className={"acc-screen" + (ACC_LIGHT ? " lc-light" : "") + (floating ? " chrome-float" : "") + (hidden ? " chrome-hidden" : "") + (view ? " cat-open" : "")}
      data-screen-label={"All courses · Confidence (" + (ACC_LIGHT ? "light" : "dark") + ")"}>
      <ACCHeader onMenu={() => setMenuOpen(true)} onSearch={focusSearch} onBell={() => setNotifOpen(true)} onMessages={() => setMsgOpen(true)} />

      <div className="acc-scroll" ref={scrollRef}>
        <button type="button" className="acc-back" onClick={() => goACC(ACC_URLS.learning)}>
          <DSACC.IconifyIcon name="lucide:chevron-left" size={20} color={ACC_INK.text} />
          My Learning
        </button>

        <section className="acc-sec acc-hero" data-screen-label="Title">
          <span className="acc-eyebrow acc-eyebrow-gold">Confidence Path</span>
          <h1 className="acc-h1">All courses</h1>
          <p className="acc-lede">
            Browse the Confidence catalogue by subject. The {ACC_OWNED_COUNT} courses you're already enrolled on live in My Learning.
          </p>
        </section>

        <section className="acc-sec" data-screen-label="Search">
          <label className="acc-search">
            <DSACC.IconifyIcon name="lucide:search" size={20} color={ACC_INK.muted} />
            <input ref={searchRef} type="search" placeholder="Search courses…" aria-label="Search courses" value={query}
              autoComplete="off" onChange={(e) => setQuery(e.target.value)} />
            {searching &&
            <button type="button" className="acc-clear" aria-label="Clear search" onClick={() => setQuery("")}>
              <DSACC.IconifyIcon name="lucide:x" size={16} color={ACC_INK.text} />
            </button>}
          </label>
        </section>

        {!searching &&
        <div className="acc-filters" data-screen-label="Subject filter">
          {["All"].concat(ACC_CATS).map((k) =>
          <button key={k} type="button" className={"acc-filter" + (k === "All" ? " on" : "")} aria-current={k === "All" ? "page" : undefined}
            aria-label={k === "All" ? "All courses, current page" : "Open " + k + " courses"} onClick={() => openCat(k)}>
            {k}
          </button>)}
        </div>}

        {searching ?
        <section className="acc-sec" data-screen-label="Search results" aria-live="polite">
          <div className="acc-sec-h">
            <h2 className="acc-eyebrow acc-eyebrow-gold">Results</h2>
            <span className="acc-sub">{results.length} {results.length === 1 ? "course" : "courses"}</span>
          </div>
          {results.length === 0 ?
          <div className="acc-empty">
            <p>No courses match “{query.trim()}”.</p>
            <button type="button" className="acc-seeall" onClick={() => setQuery("")}>Clear search</button>
          </div> :
          <div className="acc-list" role="list">
            {results.map((c) => <div role="listitem" key={c.title} className="acc-rail-item"><ACCCourseCard c={c} wide /></div>)}
          </div>}
        </section> :
        <React.Fragment>
          <section className="acc-sec" data-screen-label="Popular topics">
            <div className="acc-sec-h"><h2 className="acc-eyebrow acc-eyebrow-gold">Popular topics</h2></div>
            <div className="acc-topics" role="list">
              {ACC_TOPICS.map((t) =>
              <button key={t} type="button" role="listitem" className="acc-topic" onClick={() => pickQuery(t)}>{t}</button>)}
            </div>
          </section>

          {rails.map((r) =>
          <ACCRail key={r.cat} cat={r.cat} courses={r.courses} expanded={!!expanded[r.cat]} onToggle={() => toggleExpanded(r.cat)} />)}

          <ACCInstructors onPick={pickQuery} />
        </React.Fragment>}
      </div>

      {view && <ACCCategoryPage key={view} cat={view} onBack={closeCat} />}

      <ACCTabBar compact={hidden && !view} />
      <SideMenuACC open={menuOpen} onClose={() => setMenuOpen(false)} dark={!ACC_LIGHT} onToggleDark={toggleDarkACC} />
      <NotificationsACC open={notifOpen} onClose={() => setNotifOpen(false)} />
      <MessagesACC open={msgOpen} onClose={() => setMsgOpen(false)} />
    </div>);
}

function useDeviceScaleACC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateACC(calc);
  useEffectACC(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

function useIsMobileACC() {
  const [mobile, setMobile] = useStateACC(() => window.matchMedia("(max-width:768px)").matches);
  useEffectACC(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

function AllCoursesConfidenceApp() {
  useThemeSyncACC();
  const mobile = useIsMobileACC();
  const scale = useDeviceScaleACC();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  const pageBg = ACC_LIGHT ? "#F9F7F4" : "#0B1024";
  if (mobile) {
    return <div className="app" style={{ ...vars, background: pageBg }}><AllCoursesConfidence /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: ACC_LIGHT ? "rgb(217, 218, 225)" : "#05081a" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={!ACC_LIGHT}><AllCoursesConfidence /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AllCoursesConfidenceApp />);
