/* learning-store-web.js — shared My Learning state + URL helpers for the WEB shells
   (MyLearning / MyCoursesWeb / AllCoursesWeb / CourseWeb / LessonWeb / CourseCheckoutWeb).
   Mirrors the mobile stores in lesson-confidence.jsx / learning-mobile.jsx /
   learning-confidence.jsx so a member's tier, purchases, completed lessons and
   saved courses are the same on phone and desktop. Plain JS (no JSX) — loaded
   before each page bundle; hooks use the global React. window.PFLearn */
(function () {
  const KEYS = {
    tier: "pf-subscription-tier",          // "free" | "confidence" | "mastery" | "freedom" | "inner"
    purchased: "pf-purchased-courses",     // [slug]
    done: "pf-lessons-done",               // [lesson name] (course-agnostic, same as mobile)
    saved: "pf-saved-courses",             // [course title]
    resources: "pf-resources-unlocked",    // "1" once the Free Resources survey is finished
    discounts: "pf-course-discounts",      // { [slug]: { pct, code } } written by loyalty-engine
    progress: (slug) => "pf-lesson-progress-" + slug // { completed:[flatIdx], activeIdx } (web resume pointer)
  };

  const readJSON = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? fb : v; } catch (e) { return fb; } };
  const readArr = (k) => { const v = readJSON(k, []); return Array.isArray(v) ? v : []; };
  const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* ---- tier ---- */
  const TIER_LADDER = ["confidence", "mastery", "freedom", "inner"];
  const TIER_NAME = { free: "Free", confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", inner: "Inner Circle" };
  function readTier() {
    if (window.PF_TIER) return window.PF_TIER;
    try { return localStorage.getItem(KEYS.tier) || "free"; } catch (e) { return "free"; }
  }
  function nextTier(t) {
    const i = TIER_LADDER.indexOf(t);
    if (i === -1) return TIER_LADDER[0];
    return i === TIER_LADDER.length - 1 ? null : TIER_LADDER[i + 1];
  }
  const isFree = () => readTier() === "free";

  /* ---- catalogue prices + tier-included courses (copied from lesson-confidence.jsx) ---- */
  const PRICES = {
    "temple-filler": 342, "profinity-membership": 199, "advanced-lip-techniques": 342, "complications-management": 450,
    "functional-anatomy": 198, "treatment-approaches": 246, "safety-injection-essentials": 294,
    "cheek-contouring": 246, "jawline-sculpting": 294, "tear-trough-treatment": 342 };
  const INCLUDED_CONFIDENCE = ["profinity-membership", "8d-lip-design", "temple-filler"];
  const INCLUDED_MASTERY = INCLUDED_CONFIDENCE.concat([
    "protox-course", "brow-lift-training", "full-face-rejuvenation-protocol", "cheek-midface-contouring",
    "non-surgical-rhinoplasty", "jawline-sculpting-masterclass", "tear-trough-correction",
    "skin-boosters-hydration-therapy", "complications-management", "consultation-patient-assessment"]);
  function included(slug) {
    const t = readTier();
    if (!t || t === "free") return false;
    return (t === "confidence" ? INCLUDED_CONFIDENCE : INCLUDED_MASTERY).indexOf(slug) !== -1;
  }
  /* price after membership + optional ?price= override (0 = free/included) */
  function price(slug, override) {
    if (included(slug)) return 0;
    const q = Number(override);
    if (q > 0) return q;
    return PRICES[slug] || 0;
  }
  const slugify = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  /* ---- purchases ---- */
  const readPurchased = () => readArr(KEYS.purchased);
  function addPurchased(slug) {
    const list = readPurchased();
    if (list.indexOf(slug) === -1) { list.push(slug); writeJSON(KEYS.purchased, list); }
    try { window.dispatchEvent(new CustomEvent(KEYS.purchased)); } catch (e) {}
  }
  const owns = (slug, override) => price(slug, override) === 0 || readPurchased().indexOf(slug) !== -1;
  const locked = (slug, override) => !owns(slug, override);
  /* re-reads on cross-tab storage, focus, pageshow, visibility (back from checkout) */
  function usePurchased() {
    const [list, setList] = React.useState(readPurchased);
    React.useEffect(() => {
      const refresh = () => setList(readPurchased());
      const onStorage = (e) => { if (!e.key || e.key === KEYS.purchased) refresh(); };
      window.addEventListener("storage", onStorage);
      window.addEventListener(KEYS.purchased, refresh);
      window.addEventListener("focus", refresh);
      window.addEventListener("pageshow", refresh);
      document.addEventListener("visibilitychange", refresh);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(KEYS.purchased, refresh);
        window.removeEventListener("focus", refresh);
        window.removeEventListener("pageshow", refresh);
        document.removeEventListener("visibilitychange", refresh);
      };
    }, []);
    return list;
  }
  const readDiscounts = () => readJSON(KEYS.discounts, {}) || {};

  /* ---- completed lessons (name-keyed, shared with mobile) ---- */
  const readDone = () => readArr(KEYS.done);
  function writeDone(names) {
    writeJSON(KEYS.done, names);
    try { window.dispatchEvent(new CustomEvent(KEYS.done)); } catch (e) {}
  }
  function markDone(name) {
    const cur = readDone();
    if (cur.indexOf(name) === -1) writeDone(cur.concat(name));
  }
  function unmarkDone(name) { writeDone(readDone().filter((n) => n !== name)); }
  function useLessonsDone() {
    const [done, setDone] = React.useState(readDone);
    React.useEffect(() => {
      const sync = () => setDone(readDone());
      const onStorage = (e) => { if (!e.key || e.key === KEYS.done) sync(); };
      window.addEventListener(KEYS.done, sync);
      window.addEventListener("storage", onStorage);
      return () => { window.removeEventListener(KEYS.done, sync); window.removeEventListener("storage", onStorage); };
    }, []);
    const mark = (name) => { markDone(name); setDone(readDone()); };
    return [done, mark];
  }
  /* web resume pointer (kept so existing LessonWeb links keep working) */
  const readProgress = (slug) => { const p = readJSON(KEYS.progress(slug), {}); return p && typeof p === "object" ? p : {}; };
  const writeProgress = (slug, data) => writeJSON(KEYS.progress(slug), data);

  /* ---- saved (bookmarked) courses ---- */
  const readSaved = () => readArr(KEYS.saved);
  const isSaved = (title) => readSaved().indexOf(title) !== -1;
  function toggleSaved(title) {
    const list = readSaved(); const i = list.indexOf(title);
    if (i === -1) list.push(title); else list.splice(i, 1);
    writeJSON(KEYS.saved, list);
    try { window.dispatchEvent(new CustomEvent(KEYS.saved)); } catch (e) {}
    return i === -1;
  }
  function useSaved() {
    const [list, setList] = React.useState(readSaved);
    React.useEffect(() => {
      const sync = () => setList(readSaved());
      const onStorage = (e) => { if (!e.key || e.key === KEYS.saved) sync(); };
      window.addEventListener(KEYS.saved, sync); window.addEventListener("storage", onStorage);
      return () => { window.removeEventListener(KEYS.saved, sync); window.removeEventListener("storage", onStorage); };
    }, []);
    return list;
  }

  const resourcesUnlocked = () => { try { return localStorage.getItem(KEYS.resources) === "1"; } catch (e) { return false; } };
  const unlockResources = () => { try { localStorage.setItem(KEYS.resources, "1"); } catch (e) {} };

  /* ---- URLs (single source of truth so every web page links the same way) ---- */
  const qs = (o) => { const p = new URLSearchParams(); Object.keys(o).forEach((k) => { if (o[k] !== undefined && o[k] !== null && o[k] !== "") p.set(k, o[k]); }); return p.toString(); };
  /* CourseWeb.html?course=<slug>[&title=&price=&dur=] — course detail (generic courses fall back to ?title) */
  const courseUrl = (slug, extra) => "CourseWeb.html?" + qs(Object.assign({ course: slug }, extra || {}));
  /* LessonWeb.html?course=<slug>&level=&module=&lesson=[&sub=]  (mobile shape)  or  ?course=&lesson=<flatIdx> via {flat} */
  function lessonUrl(slug, pos) {
    pos = pos || {};
    if (pos.flat != null) return "LessonWeb.html?" + qs({ course: slug, lesson: pos.flat });
    return "LessonWeb.html?" + qs({ course: slug, level: pos.level, module: pos.module, lesson: pos.lesson, sub: pos.sub, play: pos.play });
  }
  /* CourseCheckoutWeb.html — ret brings the buyer back to the sending page */
  function checkoutUrl(course, ret) {
    const p = { title: course.title, instr: course.instr || "Dr. Tim Pearce", price: course.price, course: course.slug };
    if (course.img) p.img = course.img;
    p.ret = ret || (window.location.pathname.split("/").pop() + window.location.search);
    return "CourseCheckoutWeb.html?" + qs(p);
  }
  const membershipUrl = "MembershipTier.html";
  const allCoursesUrl = (extra) => "AllCoursesWeb.html" + (extra ? "?" + qs(extra) : "");
  const myLearningUrl = "MyLearning.html";

  window.PFLearn = { KEYS, TIER_LADDER, TIER_NAME, readTier, nextTier, isFree,
    PRICES, INCLUDED_CONFIDENCE, INCLUDED_MASTERY, included, price, slugify,
    readPurchased, addPurchased, owns, locked, usePurchased, readDiscounts,
    readDone, writeDone, markDone, unmarkDone, useLessonsDone, readProgress, writeProgress,
    readSaved, isSaved, toggleSaved, useSaved, resourcesUnlocked, unlockResources,
    courseUrl, lessonUrl, checkoutUrl, membershipUrl, allCoursesUrl, myLearningUrl };
})();
