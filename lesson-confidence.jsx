/* ===========================================================================
   PROfinity — Course Detail (Confidence tier, mobile) · iPhone 17 Pro Max
   Shared by CourseDetail.html (the standard course page — variant follows the
   app theme), CourseDetailConfidence.html (pinned dark reader, #0B1024) and
   CourseDetailConfidenceLight.html (pinned light surface).

   Composed on the bound DS bundle (IconifyIcon, Avatar). Suffixed -LX because
   every page script shares one global scope.

   Not used by Lesson.html (that is the standard lesson page, lesson.jsx).
   When no shell pins PF_LC_LIGHT the variant follows the app theme
   (pf-theme → data-theme) or a ?theme=light|dark override. The screen root
   adds .lc-light for the light variant; see resolveLightLX().

   Completion: localStorage["pf-lessons-done"] (array of lesson names) with a
   "pf-lessons-done" CustomEvent on write — the same key + event lesson.jsx
   uses, so the tick states here and on the lesson page never disagree.
   =========================================================================== */
const { useState: useStateLX, useEffect: useEffectLX, useRef: useRefLX, useMemo: useMemoLX } = React;
const DSLX = window.ProfinityDesignSystem_c2b5cc;

function goLX(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}
const LX_PARAMS = new URLSearchParams(window.location.search);

/* Variant resolution, in priority order:
     1. window.PF_LC_LIGHT set by a shell (the two Confidence pages pin it);
     2. ?theme=light|dark on the URL (handy for viewing either variant);
     3. the app-wide theme — dark-mode-init.js stamps data-theme from pf-theme.
   LX_LIGHT / LX_INK / LX_LOCKUP are module-level `let`s re-derived when the
   theme changes (see useThemeSyncLX) and the whole tree re-renders. */
function resolveLightLX() {
  if (window.PF_LC_LIGHT != null) return !!window.PF_LC_LIGHT;
  const q = LX_PARAMS.get("theme");
  if (q === "light") return true;
  if (q === "dark") return false;
  return document.documentElement.getAttribute("data-theme") !== "dark";
}

/* Glyph ink per variant. Gold #CE9957 fails AA on the light surface (~2.4:1),
   so meaningful gold icons/text use #8A5303 there. The DS IconifyIcon writes
   its colour inline, so these are passed at the call site. */
function inkLX(light) {
  return {
    gold: light ? "#8A5303" : "#CE9957",
    text: light ? "#0C1928" : "#FFFFFF", /* My Learning navy */
    body: light ? "#475467" : "rgba(255,255,255,.76)",
    muted: light ? "#475467" : "rgba(255,255,255,.62)",
    success: light ? "#2a9568" : "#5CD39A",
    onNavy: "#FFFFFF",
    onGold: light ? "#FFFFFF" : "#0B1024",
    outline: light ? "#0C1928" : "#FFFFFF"
  };
}
function lockupLX(light) { return light ? "assets/profinity-academy-logo-full.png" : "assets/profinity-logo-dark.jpg"; }

let LX_LIGHT = resolveLightLX();
let LX_INK = inkLX(LX_LIGHT);
let LX_LOCKUP = lockupLX(LX_LIGHT);

/* Follow the app theme live: a data-theme change on <html> (Display toggle,
   Account settings) or a pf-theme write in another tab re-derives the variant. */
function useThemeSyncLX() {
  const [, bump] = useStateLX(0);
  useEffectLX(() => {
    if (window.PF_LC_LIGHT != null || LX_PARAMS.get("theme")) return;
    const apply = () => {
      const light = resolveLightLX();
      if (light === LX_LIGHT) return;
      LX_LIGHT = light; LX_INK = inkLX(light); LX_LOCKUP = lockupLX(light);
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

const LX_ME = { name: "Katy", avatar: "assets/avatar-katy.jpg" };
const LX_LEARNING_URL = "LearningMobile.html";

/* ---------------------------------------------------------------- completion store -- */
const LX_DONE_KEY = "pf-lessons-done";

function readDoneLX() {
  try {
    const raw = window.localStorage.getItem(LX_DONE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function writeDoneLX(names) {
  try {
    window.localStorage.setItem(LX_DONE_KEY, JSON.stringify(names));
    window.dispatchEvent(new CustomEvent(LX_DONE_KEY));
  } catch (e) {}
}

/* Read on mount, listen for the shared event (and cross-tab storage), write through. */
function useLessonsDoneLX() {
  const [done, setDone] = useStateLX(readDoneLX);
  useEffectLX(() => {
    const sync = () => setDone(readDoneLX());
    const onStorage = (e) => { if (!e.key || e.key === LX_DONE_KEY) sync(); };
    window.addEventListener(LX_DONE_KEY, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LX_DONE_KEY, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const mark = (name) => {
    const cur = readDoneLX();
    if (cur.indexOf(name) === -1) writeDoneLX(cur.concat(name));
    setDone(readDoneLX());
  };
  return [done, mark];
}

/* ---------------------------------------------------------------- course data -- */
const LX_8D = {
  slug: "8d-lip-design",
  title: "8D Lip Design",
  still: "assets/course-8d-lip-design.jpg",
  levels: [
  {
    title: "Level 1", name: "Lip Anatomy", eyebrow: "Module 3 · Lip Anatomy", open: true,
    sections: [
    {
      name: "Assessment", free: true,
      desc: "Read the lips before you ever pick up a needle — the anatomy, the vascular danger zones and a repeatable assessment routine you can run in every consultation.",
      bullets: [
      "Map the superior and inferior labial arteries and where they run superficially.",
      "Assess proportions, projection and lip-to-face balance before planning volume.",
      "Document every case with the same standardised photo set."],

      lessons: [
      {
        name: "Lip anatomy essentials", dur: "4:12",
        intro: "Before we talk product or technique, we need a shared map of the lip. This lesson walks the layers from skin to mucosa, names the landmarks you'll use in every plan, and shows why the vermilion border behaves differently to the body of the lip.",
        body: "Dr Tim Pearce breaks the lip into five zones and explains what each one does when you add volume — and what goes wrong when you treat them as one structure.",
        points: [
        "The five zones of the lip and how each responds to filler.",
        "Where the orbicularis oris sits and why depth matters.",
        "Reading the vermilion border, Cupid's bow and philtral columns."]
      },
      {
        name: "Vascular landmarks of the lip", dur: "5:36",
        intro: "The labial arteries are the reason lips are a high-stakes area. Here we trace their typical course, the variations you must assume are present, and the injection planes that keep you away from them.",
        body: "Using cadaveric and ultrasound references, this lesson turns the anatomy into practical rules for needle depth, cannula entry points and aspiration.",
        points: [
        "Typical course and depth of the superior and inferior labial arteries.",
        "The three anatomical variants you must plan for.",
        "Safe planes for needle and cannula in each zone."]
      },
      {
        name: "Assessing lip proportions", dur: "3:48",
        intro: "Beautiful lips are balanced lips. This lesson gives you the ratios and angles to assess the upper-to-lower lip relationship, projection and how the lips sit within the lower face.",
        body: "You'll learn the 1:1.6 golden ratio guide, how to judge projection from the profile and the tell-tale signs of an over-filled lip so your plans stay natural.",
        points: [
        "Upper-to-lower lip ratios and when to deviate from them.",
        "Judging projection and the nasolabial angle in profile.",
        "Spotting existing over-fill and migration before you plan."]
      },
      {
        name: "Photographing the lips for assessment", dur: "2:57",
        intro: "Your photographs are your clinical record, your consent evidence and your best marketing. This short lesson sets up a repeatable five-shot lip set you can capture in under two minutes.",
        body: "Lighting, angles and expressions that reveal asymmetry — and the mistakes that hide it.",
        points: [
        "The five-shot standard set: frontal, both obliques, both profiles.",
        "Repose vs. smile: why you need both.",
        "Consistent lighting and distance for honest before-and-afters."]
      },
      {
        name: "Assessment checklist walkthrough", dur: "4:05",
        intro: "Everything from this module comes together in one checklist. Dr Tim runs a live consultation using it so you can see how the anatomy, ratios and photos drive the treatment plan.",
        body: "Download the checklist from Resources and follow along — by the end you should be able to complete it on a real patient without prompting.",
        points: [
        "Running the checklist in a real consultation.",
        "Turning assessment findings into a written treatment plan.",
        "Setting expectations with the patient before booking."]
      }]
    }]
  },
  {
    title: "Level 2", name: "Lip Filler Technique", eyebrow: "Module 4 · Lip Filler Technique", open: true,
    sections: [
    {
      name: "Lip Filler Technique",
      desc: "Start with the two orientation lessons, then work through the technique, case study and resource folders in order.",
      bullets: [],
      lessons: [
      { name: "Welcome & how to use this module", dur: "2:10" },
      { name: "Safety essentials (watch first)", dur: "6:48" }],

      subs: [
      { name: "Injection Techniques", open: true, lessons: [
        { name: "Linear threading technique", dur: "4:32" },
        { name: "Tenting technique", dur: "3:58" },
        { name: "Cannula approach", dur: "6:11" }] },
      { name: "Case Studies", lessons: [
        { name: "Case 1: thin lips, first treatment", dur: "7:20" },
        { name: "Case 2: correction of migrated filler", dur: "9:05" }] },
      { name: "Downloads & Resources", lessons: [
        { name: "Technique recipe cards (PDF)", dur: "PDF", kind: "pdf" },
        { name: "Consent form templates (PDF)", dur: "PDF", kind: "pdf" }] }]
    }]
  },
  { title: "Level 3", name: "Perioral Rejuvenation", eyebrow: "Module 5 · Perioral Rejuvenation", sections: [], unlock: "Unlocks when you complete Level 2 — Lip Filler Technique." },
  { title: "Level 4", name: "Complications & Recovery", eyebrow: "Module 6 · Complications & Recovery", sections: [], unlock: "Unlocks when you complete Level 3 — Perioral Rejuvenation." },
  { title: "Level 5", name: "Advanced Cases", eyebrow: "Module 7 · Advanced Cases", sections: [], unlock: "Unlocks when you complete Level 4 — Complications & Recovery." },
  {
    title: "End of Success Path Quiz", name: "Final Assessment", eyebrow: "Final · Success Path Quiz", quiz: true,
    sections: [
    {
      name: "Final Assessment",
      desc: "Twenty-five questions across anatomy, technique and complications. Pass at 80% to earn your 8D Lip Design certificate.",
      bullets: [],
      lessons: [
      { name: "8D Lip Design success path quiz", dur: "25 Qs", kind: "quiz",
        intro: "You've reached the end of the success path. The quiz draws on every level — take it when you can run the assessment checklist and describe the safe planes for each technique without notes.",
        body: "Twenty-five multiple-choice questions, untimed. You can retake it after 24 hours if you need to.",
        points: ["Anatomy and vascular landmarks.", "Technique selection and safe planes.", "Recognising and managing complications."] }]
    }]
  }]
};


/* Toxin Battle — same levels/modules/lesson names as course-detail.jsx and
   lesson.jsx so Lesson.html?course=toxin-battle&level=&module=&lesson= deep
   links from CourseDetail/Module/SubModule keep resolving, and completions
   share names with those pages. */
const LX_SCREENING = [
"Take a comprehensive medical history (bleeding disorders, neuromuscular diseases, medications).",
"Screen for contraindications (pregnancy, active infections, known hypersensitivities).",
"Assess psychological readiness and set realistic expectations."];

const LX_TOXIN = {
  slug: "toxin-battle",
  title: "Toxin Battle with Julie Bass Kaplan",
  still: "assets/course-complications.jpg",
  levels: [
  {
    title: "Level 1", open: true,
    sections: [
    { name: "Diagnosis", free: true,
      desc: "How to diagnose, treat and most of all understand how to avoid Eyelid Ptosis from Botox treatment.",
      bullets: LX_SCREENING,
      lessons: [
      { name: "Treatment", dur: "3:04" },
      { name: "Technique reducing the risk of Eyelid Ptosis", dur: "2:14" },
      { name: "Treatment Avoidance", dur: "5:24" }] },
    { name: "Brow Ptosis", free: true,
      desc: "How to select patients and conduct a thorough medical screening before treatment.",
      bullets: [
      "Consult on patient goals and prior treatment history.",
      "Assess brow position, asymmetry, and forehead muscle strength.",
      "Explain realistic outcomes and set expectations."],
      lessons: [
      { name: "Consultation", dur: "3:04" },
      { name: "Avoiding Forehead Paralysis", dur: "2:14" },
      { name: "Managing Asymmetries", dur: "5:24" }] }]
  },
  {
    title: "Level 2", open: true,
    sections: [
    { name: "Lip Filler Technique",
      desc: "Start with the two orientation lessons, then work through the technique, case study and resource folders in order.",
      bullets: [],
      lessons: [
      { name: "Welcome & how to use this module", dur: "2:10" },
      { name: "Safety essentials (watch first)", dur: "6:48" }],
      subs: [
      { name: "Injection Techniques", open: true, lessons: [
        { name: "Linear threading technique", dur: "4:32" },
        { name: "Tenting technique", dur: "3:58" },
        { name: "Cannula approach", dur: "6:11" }] },
      { name: "Case Studies", lessons: [
        { name: "Case 1: thin lips, first treatment", dur: "7:20" },
        { name: "Case 2: correction of migrated filler", dur: "9:05" }] },
      { name: "Downloads & Resources", lessons: [
        { name: "Technique recipe cards (PDF)", dur: "PDF", kind: "pdf" },
        { name: "Consent form templates (PDF)", dur: "PDF", kind: "pdf" }] }] },
    { name: "Upper Eyelid Lift",
      desc: "Indications and surgical techniques for upper eyelid lift.",
      bullets: [
      "Evaluate eyelid skin laxity and excess fat.",
      "Discuss surgical options (traditional vs. minimally invasive techniques).",
      "Ensure patient understands post-operative care and recovery."],
      lessons: [
      { name: "Preparation", dur: "1:42" },
      { name: "Glabellar Region Injections", dur: "3:22" },
      { name: "Treating Marionette Lines", dur: "4:39" }] }]
  },
  { title: "Level 3", sections: [], unlock: "Unlocks when you complete Level 2." },
  { title: "Level 4", sections: [], unlock: "Unlocks when you complete Level 3." },
  { title: "End of Success Path Quiz", quiz: true, sections: [
    { name: "Final Assessment", desc: "Twenty questions across diagnosis, technique and complication management.", bullets: [],
      lessons: [{ name: "Toxin Battle success path quiz", dur: "20 Qs", kind: "quiz" }] }] }]
};

const LX_COURSES = { "8d-lip-design": LX_8D, "toxin-battle": LX_TOXIN };
const LX_COURSE_PARAM = LX_PARAMS.get("course");

/* Any other course arrives as ?title=&instr=&dur= (course cards on the learning
   pages, events products, related-course cards, checkout) — the same shape
   course-detail.jsx accepted. Build a generic success path for it so the page
   never 404s to the default course. */
const LX_STILLS = [
[/temple/i, "assets/course-temple-filler.webp"],
[/membership/i, "assets/course-membership-banner.jpg"],
[/lip/i, "assets/course-8d-lip-design.jpg"],
[/brow|eyelid|ptosis/i, "assets/course-brow-lift.jpg"],
[/cheek/i, "assets/course-cheek-contouring.jpg"],
[/jaw/i, "assets/course-jawline-sculpting.jpg"],
[/tear/i, "assets/course-tear-trough.jpg"],
[/rhino|nose/i, "assets/course-rhinoplasty.jpg"],
[/skin|booster/i, "assets/course-skin-boosters.jpg"],
[/complication|toxin|botox/i, "assets/course-complications.jpg"],
[/marketing|business|clinic/i, "assets/course-marketing.webp"],
[/full.?face|rejuven/i, "assets/course-full-face-rejuvenation.jpg"]];
function stillForLX(title) {
  const hit = LX_STILLS.find(([re]) => re.test(title));
  return hit ? hit[1] : "assets/course-consultation.jpg";
}
function buildGenericCourseLX(params) {
  const title = params.get("title") || "Course";
  const instr = params.get("instr") || "Dr Tim Pearce";
  const dur = params.get("dur") || "45m";
  return {
    slug: slugLX(title),
    title,
    still: params.get("image") || stillForLX(title),
    levels: [
    { title: "Level 1", open: true,
      sections: [
      { name: "Getting Started", free: true,
        desc: `Foundations you need before your first ${title.toLowerCase()} patient — a focused ${dur} path with ${instr}, filled with practical protocols and real clinic scenarios.`,
        bullets: LX_SCREENING,
        lessons: [
        { name: "Orientation", dur: "3:04" },
        { name: "Core Technique Walkthrough", dur: "2:14" },
        { name: "Common Pitfalls to Avoid", dur: "5:24" }] }] },
    /* every level is open and listed up front (user, 2026-09-11) so a buyer
       can see the whole course before paying — no "Unlocks when…" rows */
    { title: "Level 2", open: true,
      sections: [
      { name: "Core Technique",
        desc: `Anatomy, product choice and the ${title.toLowerCase()} technique itself, demonstrated step by step on a real patient.`,
        bullets: [],
        lessons: [
        { name: "Anatomy & Danger Zones", dur: "6:12" },
        { name: "Product Selection & Dosing", dur: "4:48" },
        { name: "Injection Technique Demonstration", dur: "8:31" },
        { name: "Aftercare Protocol", dur: "3:05" }] }] },
    { title: "Level 3", open: true,
      sections: [
      { name: "Advanced Practice",
        desc: "Complications, case reviews and how to bring this treatment into your clinic with confidence.",
        bullets: [],
        lessons: [
        { name: "Managing Complications", dur: "7:20" },
        { name: "Case Study Review", dur: "5:56" },
        { name: "Consultation & Consent Checklist", dur: "4 pages", kind: "pdf" },
        { name: "Building Your Treatment Menu", dur: "3:44" }] }] },
    { title: "End of Success Path Quiz", quiz: true, open: true, sections: [
      { name: "Final Assessment", desc: "Twenty questions across assessment, technique and aftercare.", bullets: [],
        lessons: [{ name: title + " success path quiz", dur: "20 Qs", kind: "quiz" }] }] }]
  };
}
const LX_COURSE = LX_COURSES[LX_COURSE_PARAM] || (LX_PARAMS.get("title") ? buildGenericCourseLX(LX_PARAMS) : LX_8D);

/* Back: this IS the course page, so back returns to the learning page — the
   Confidence one (same variant) when a Confidence shell pinned the theme,
   otherwise the standard My Learning page. */
const LX_BACK_URL = window.PF_LC_LIGHT == null ? LX_LEARNING_URL : window.PF_LC_LIGHT ? "LearningMobileConfidenceLight.html" : "LearningMobileConfidence.html";

/* ?level=&module=&lesson=[&sub=] (the shape CourseDetail/Module/SubModule emit)
   → index into the flat lesson list; null when absent or out of range. */
function lessonIdxFromParamsLX(flat) {
  if (LX_PARAMS.get("lesson") == null) return null;
  const li = Number(LX_PARAMS.get("level") || 0), si = Number(LX_PARAMS.get("module") || 0), ni = Number(LX_PARAMS.get("lesson") || 0);
  const sub = LX_PARAMS.get("sub") == null ? null : Number(LX_PARAMS.get("sub"));
  const i = flat.findIndex((l) => l.li === li && l.si === si && l.ni === ni && l.subIdx === sub);
  return i === -1 ? null : i;
}

/* ---------------------------------------------------------------- paid courses -- */
/* Related courses are paid. The course page still lists every level, module
   and lesson, but nothing can be started until the course is bought: the CTA
   goes to CourseCheckout.html, which writes the slug into
   localStorage["pf-purchased-courses"] (the same key course-detail.jsx and
   course-checkout.jsx share) and returns here unlocked. Prices are keyed by
   slug so every route into these courses is paid; ?price= overrides. */
const LX_PURCHASED_KEY = "pf-purchased-courses";
const LX_PRICES = {
  "temple-filler": 342,
  "profinity-membership": 199,
  "advanced-lip-techniques": 342,
  "complications-management": 450,
  /* My Learning → Explore related content */
  "functional-anatomy": 198,
  "treatment-approaches": 246,
  "safety-injection-essentials": 294,
  /* backfill once one of the above is bought */
  "cheek-contouring": 246,
  "jawline-sculpting": 294,
  "tear-trough-treatment": 342 };

/* Courses that come with the member's tier are already paid for by the
   membership (user, 2026-09-15): they open unlocked with a Start / Continue
   learning CTA, never the Buy paywall, whatever LX_PRICES or ?price= says.
   Lists mirror My Learning's LM2_MY_COURSES_CONFIDENCE / LM2_MY_COURSES in
   learning-mobile.jsx. Tier comes from window.PF_TIER (pinned Confidence
   shells) or the app-wide "pf-subscription-tier" key. */
function readTierLX() {
  if (window.PF_TIER) return window.PF_TIER;
  try { return localStorage.getItem("pf-subscription-tier") || "free"; } catch (e) { return "free"; }
}
const LX_TIER = readTierLX();
const LX_INCLUDED_CONFIDENCE = ["profinity-membership", "8d-lip-design", "temple-filler"];
const LX_INCLUDED_MASTERY = LX_INCLUDED_CONFIDENCE.concat([
  "protox-course", "brow-lift-training", "full-face-rejuvenation-protocol", "cheek-midface-contouring",
  "non-surgical-rhinoplasty", "jawline-sculpting-masterclass", "tear-trough-correction",
  "skin-boosters-hydration-therapy", "complications-management", "consultation-patient-assessment"]);
function includedLX(slug) {
  if (!LX_TIER || LX_TIER === "free") return false;
  const list = LX_TIER === "confidence" ? LX_INCLUDED_CONFIDENCE : LX_INCLUDED_MASTERY;
  return list.indexOf(slug) !== -1;
}

function priceLX(slug) {
  if (includedLX(slug)) return 0;
  const q = Number(LX_PARAMS.get("price"));
  if (q > 0) return q;
  return LX_PRICES[slug] || 0;
}

function readPurchasedLX() {
  try {
    const arr = JSON.parse(window.localStorage.getItem(LX_PURCHASED_KEY));
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function usePurchasedLX() {
  const [list, setList] = useStateLX(readPurchasedLX);
  useEffectLX(() => {
    const onStorage = (e) => { if (!e.key || e.key === LX_PURCHASED_KEY) setList(readPurchasedLX()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return list;
}

/* Checkout for this course; `ret` brings the buyer back to this exact page
   (CourseDetail / CourseDetailConfidence / …Light) once paid. */
function checkoutUrlLX(course) {
  const p = new URLSearchParams({ title: course.title, instr: "Dr. Tim Pearce", price: course.price });
  if (LX_COURSES[course.slug]) p.set("course", course.slug);
  const back = { course: course.slug, title: course.title };
  const dur = LX_PARAMS.get("dur"); if (dur) back.dur = dur;
  p.set("ret", window.location.pathname.split("/").pop() + "?" + new URLSearchParams(back).toString());
  return "CourseCheckout.html?" + p.toString();
}
LX_COURSE.price = priceLX(LX_COURSE.slug);

const LX_RESOURCES = [
{ name: "Lip anatomy reference chart.pdf", size: "1.8 MB" },
{ name: "Lip assessment checklist.pdf", size: "240 KB" },
{ name: "Lip filler consent form template.pdf", size: "120 KB" }];

/* These are courses — route to the course page, never to a lesson index. */
const LX_RELATED = [
{ title: "Temple Filler", lessons: 12, dur: "1h 40m", image: "assets/course-temple-filler.webp", price: LX_PRICES["temple-filler"] },
{ title: "Profinity Membership", lessons: 6, dur: "45m", image: "assets/course-membership-banner.jpg", price: LX_PRICES["profinity-membership"] }];


const LX_DEFAULT_COMMENTS = [
{ author: { name: "Dr. Maya Chen" }, time: "2h ago", likes: 4,
  text: "Great breakdown of the anatomy. I've found that a quick review of the patient's history before the procedure makes all the difference." },
{ author: { name: "Dr. Jordan Lee" }, time: "5h ago", likes: 2,
  text: "The vascular landmarks section is super helpful. Does anyone have tips for spotting a superficial labial artery on the first consult?" },
{ author: { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" }, time: "1d ago", likes: 7,
  text: "Bookmarking this for our next team training session — clear and concise!" }];

/* ---------------------------------------------------------------- derived structure -- */
/* Flatten every lesson (section lessons, then each sub-module) in reading order.
   Each item knows its group (section or sub-module) for the "N of M" row. */
function flattenLX(course) {
  const out = [];
  course.levels.forEach((level, li) => {
    (level.sections || []).forEach((section, si) => {
      section.lessons.forEach((l, ni) => out.push({ ...l, level, section, sub: null, li, si, subIdx: null, ni, groupTotal: section.lessons.length, groupPos: ni + 1 }));
      (section.subs || []).forEach((sub, ui) => {
        sub.lessons.forEach((l, ni) => out.push({ ...l, level, section, sub, li, si, subIdx: ui, ni, groupTotal: sub.lessons.length, groupPos: ni + 1 }));
      });
    });
  });
  return out;
}

function levelLessonNamesLX(level) {
  const names = [];
  (level.sections || []).forEach((s) => {
    s.lessons.forEach((l) => names.push(l.name));
    (s.subs || []).forEach((sub) => sub.lessons.forEach((l) => names.push(l.name)));
  });
  return names;
}

function pctLX(names, done) {
  if (!names.length) return 0;
  const n = names.filter((nm) => done.indexOf(nm) !== -1).length;
  return Math.round(n / names.length * 100);
}

/* Module numbering runs across the whole course (matches Module.html). */
function eyebrowLX(item, course) {
  if (item.level.eyebrow) return item.level.eyebrow;
  let n = 0;
  for (let i = 0; i < item.li; i++) n += (course.levels[i].sections || []).length;
  return "Module " + (n + item.si + 1) + " · " + item.section.name;
}

function slugLX(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

function genericContentLX(item) {
  const where = item.sub ? item.sub.name : item.section.name;
  return {
    intro: item.intro || `${item.name} — part of ${where}. Watch the demonstration, then pause and note the three things you'd do differently in your own clinic before moving on.`,
    body: item.body || `Dr Tim Pearce demonstrates ${item.name.toLowerCase()} step by step, calling out the landmarks, depth and product choice as he goes.`,
    points: item.points || ["Set-up, markings and product choice.", "The technique itself, with the safety checks at each step.", "Aftercare and what to tell the patient to expect."]
  };
}

function courseUrlLX(c) {
  const p = { title: c.title, instr: "Dr. Tim Pearce", dur: c.dur, pct: 0 };
  if (c.price) p.price = c.price;
  return "CourseDetail.html?" + new URLSearchParams(p).toString();
}

/* ---------------------------------------------------------------- pieces -- */
function LXHeader() {
  return (
    <header className="lc-top" data-screen-label="Header">
      {/* the course page header is navy in both variants, so its ink is white
          and the lockup is the dark-surface one */}
      <button type="button" className="lc-back" aria-label="Back" onClick={() => goLX(LX_BACK_URL)}>
        <DSLX.IconifyIcon name="lucide:chevron-left" size={22} color="#FFFFFF" />
      </button>
      <div className="lc-lockup"><img src={lockupLX(false)} alt="PROfinity Academy" /></div>
      <button type="button" className="lc-avatar" aria-label="Your profile" onClick={() => goLX("ProfileMobile.html")}>
        <img src={LX_ME.avatar} alt={LX_ME.name} />
      </button>
    </header>);
}

function LXHero({ item, course, locked }) {
  const fill = Math.round(item.groupPos / item.groupTotal * 100);
  return (
    <section className="lc-hero" data-screen-label="Hero">
      <span className="lc-eyebrow">{eyebrowLX(item, course)}</span>
      <h1 className="lc-title">{item.name}</h1>
      {/* no lesson progress on a paid course that hasn't been bought yet */}
      {!locked && <>
      <div className="lc-prog-row">
        <span className="lc-prog-label">Lesson progress</span>
        <span className="lc-prog-count">{item.groupPos} of {item.groupTotal}</span>
      </div>
      <div className="lc-track" role="progressbar" aria-valuemin={0} aria-valuemax={item.groupTotal} aria-valuenow={item.groupPos} aria-label="Lesson progress">
        <span style={{ width: fill + "%" }} />
      </div>
      </>}
    </section>);
}

function LXMarker({ done, kind, locked }) {
  if (done) {
    return <span className="lc-marker done"><DSLX.IconifyIcon name="lucide:check" size={15} color={LX_INK.success} strokeWidth={2.5} /></span>;
  }
  if (locked) {
    return <span className="lc-marker lock"><DSLX.IconifyIcon name="lucide:lock" size={13} color={LX_INK.muted} /></span>;
  }
  const icon = kind === "pdf" ? "lucide:file-text" : kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled";
  return <span className="lc-marker"><DSLX.IconifyIcon name={icon} size={13} color={LX_INK.gold} /></span>;
}

function LXLessonRow({ lesson, done, current, locked, onSelect }) {
  return (
    <button type="button" className={"lc-lesson" + (done ? " done" : "") + (current ? " on" : "") + (locked ? " locked" : "")}
    aria-current={current ? "true" : undefined} onClick={onSelect}>
      <LXMarker done={done} kind={lesson.kind} locked={locked && !done} />
      <span className="lc-lesson-name">{lesson.name}</span>
      <span className="lc-lesson-dur">{lesson.dur}</span>
    </button>);
}

function LXSubModule({ sub, done, currentName, locked, onSelect }) {
  const [open, setOpen] = useStateLX(!!sub.open);
  return (
    <div className="lc-sub">
      <button type="button" className="lc-sub-hd" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <DSLX.IconifyIcon name={open ? "lucide:folder-open" : "lucide:folder"} size={19} color={LX_INK.gold} />
        <span className="lc-sub-name">{sub.name}</span>
        <span className="lc-sub-n">{sub.lessons.length}</span>
        <DSLX.IconifyIcon name={open ? "lucide:chevron-up" : "lucide:chevron-down"} size={18} color={LX_INK.muted} />
      </button>
      {open &&
      <div className="lc-sub-body">
          {sub.lessons.map((l) =>
        <LXLessonRow key={l.name} lesson={l} done={done.indexOf(l.name) !== -1} current={currentName === l.name} locked={locked} onSelect={() => onSelect(l.name)} />
        )}
          <button type="button" className="lc-sub-about" onClick={() => goLX("SubModule.html?s=" + slugLX(sub.name))}>
            About this sub-module
            <DSLX.IconifyIcon name="lucide:arrow-up-right" size={16} color={LX_INK.text} />
          </button>
        </div>}
    </div>);
}

function LXSection({ section, done, currentName, locked, onSelect }) {
  return (
    <div className="lc-section">
      <div className="lc-section-head">
        <span className="lc-section-name">{section.name}</span>
        {section.free && !locked && <span className="lc-free">Free</span>}
        {locked && <span className="lc-free lc-paid">Paid</span>}
      </div>
      <p className="lc-section-desc">{section.desc}</p>
      {section.bullets && section.bullets.length > 0 &&
      <ul className="lc-bullets">{section.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
      {/* lessons that sit directly on the module (generic / related courses
          have no sub-modules) — so the buyer can see what's inside */}
      {section.lessons && section.lessons.length > 0 &&
      <div className="lc-lessons">
          {section.lessons.map((l) =>
        <LXLessonRow key={l.name} lesson={l} done={done.indexOf(l.name) !== -1} current={currentName === l.name} locked={locked} onSelect={() => onSelect(l.name)} />
        )}
        </div>}
      {(section.subs || []).map((s) => <LXSubModule key={s.name} sub={s} done={done} currentName={currentName} locked={locked} onSelect={onSelect} />)}
    </div>);
}

function LXLevel({ level, done, currentName, locked, onSelect }) {
  const [open, setOpen] = useStateLX(!!level.open);
  const pct = pctLX(levelLessonNamesLX(level), done);
  const empty = !level.sections || level.sections.length === 0;
  return (
    <div className="lc-level">
      <button type="button" className="lc-level-hd" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="lc-level-name">
          {!level.quiz && level.name && <small>{level.title}</small>}
          {level.quiz || !level.name ? level.title : level.name}
        </span>
        <span className="lc-level-pct">{pct}%</span>
        <DSLX.IconifyIcon name={open ? "lucide:chevron-up" : "lucide:chevron-down"} size={20} color={LX_INK.onNavy} />
      </button>
      {open && (empty ?
      <div className="lc-unlock">
          <span className="ic"><DSLX.IconifyIcon name="lucide:lock" size={16} color={LX_INK.muted} /></span>
          <span>{level.unlock || "Unlocks when you complete the previous level."}</span>
        </div> :
      <div className="lc-level-body">
          {level.sections.map((s) => <LXSection key={s.name} section={s} done={done} currentName={currentName} locked={locked} onSelect={onSelect} />)}
        </div>)}
    </div>);
}

function LXCourseContent({ course, done, total, currentName, locked, onSelect }) {
  const doneCount = done.filter((n) => flattenLX(course).some((l) => l.name === n)).length;
  return (
    <section data-screen-label="Course content">
      <div className="lc-sec">
        <h2>Course content</h2>
        <span className="sub">{locked ? total + " lessons · buy to start" : doneCount + " of " + total + " completed"}</span>
      </div>
      <div className="lc-levels">
        {course.levels.map((lvl) => <LXLevel key={lvl.title} level={lvl} done={done} currentName={currentName} locked={locked} onSelect={onSelect} />)}
      </div>
    </section>);
}

function LXResources({ onToast, compact, locked, onLocked }) {
  return (
    <section data-screen-label="Resources">
      {compact ?
      <p className="lc-body lc-res-intro">Downloads for this lesson — tap to save a copy.</p> :
      <div className="lc-sec"><h2>Resources</h2></div>}
      <div className="lc-res-list">
        {LX_RESOURCES.map((r) =>
        <button type="button" className="lc-res" key={r.name} onClick={() => locked ? onLocked() : onToast("Downloading " + r.name)}>
            <span className="lc-res-ic"><DSLX.IconifyIcon name="lucide:file-text" size={20} color={LX_INK.gold} /></span>
            <span className="lc-res-tx">
              <span className="lc-res-name">{r.name}</span>
              <span className="lc-res-meta" style={{ display: "block" }}>PDF · {r.size}</span>
            </span>
            <span className="lc-res-dl"><DSLX.IconifyIcon name={locked ? "lucide:lock" : "lucide:download"} size={16} color={locked ? LX_INK.muted : LX_INK.text} /></span>
          </button>
        )}
      </div>
    </section>);
}

/* Shown on a paid course that hasn't been bought: what's inside, the price,
   and the one way in. */
function LXPaywall({ course, total, onBuy }) {
  return (
    <section className="lc-paywall" data-screen-label="Paid course">
      <span className="lc-paywall-ic"><DSLX.IconifyIcon name="lucide:lock" size={20} color={LX_INK.gold} /></span>
      <div className="lc-paywall-tx">
        <span className="lc-paywall-eyebrow">Paid course</span>
        <h3 className="lc-paywall-title">Buy to start this course</h3>
        <p className="lc-paywall-body">Browse every level, module and lesson below. Buy the course to start the lessons, download the resources and take the success path quiz.</p>
        <ul className="lc-paywall-list">
          <li><DSLX.IconifyIcon name="lucide:check" size={14} color={LX_INK.gold} strokeWidth={2.5} />{total} lessons across {course.levels.filter((l) => !l.quiz).length} levels</li>
          <li><DSLX.IconifyIcon name="lucide:check" size={14} color={LX_INK.gold} strokeWidth={2.5} />One-time payment · lifetime access</li>
          <li><DSLX.IconifyIcon name="lucide:check" size={14} color={LX_INK.gold} strokeWidth={2.5} />Certificate on completion</li>
        </ul>
        <div className="lc-paywall-row">
          <span className="lc-paywall-price"><small>One-time</small>£{course.price}</span>
          <button type="button" className="lc-btn lc-btn-gold" onClick={onBuy}>
            <DSLX.IconifyIcon name="lucide:shopping-bag" size={16} color={LX_INK.onGold} />
            Buy course
          </button>
        </div>
      </div>
    </section>);
}

/* ---- Share lesson sheet ----
   Bottom sheet mirroring the newsfeed ShareSheet's two zones: a horizontal
   "Send in Messages" rail of DM contacts (ids match messages-mobile.jsx
   threads) and a "Share to" row of round tiles. Every action closes the
   sheet and confirms with the page toast; nothing here needs a backend. */
const LX_SHARE_CONTACTS = [
  { id: "tim", name: "Dr Tim", avatar: "assets/avatar-drtim.png" },
  { id: "miranda", name: "Miranda", avatar: "assets/avatar-miranda.jpg" },
  { id: "sarahc", name: "Dr Sarah", avatar: "assets/avatar-sarah-collins.jpg" },
  { id: "amir", name: "Dr Amir", avatar: "assets/avatar-amir-khan.jpg" },
  { id: "mark", name: "Mark", avatar: "assets/avatar-mark-ellis.jpg" },
  { id: "beth", name: "Beth", avatar: "assets/avatar-nurse-beth.jpg" },
  { id: "priya", name: "Priya", avatar: "assets/avatar-priya-shah.jpg" }];

function copyLX(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(() => {});
  } catch (e) {}
}

function LXShareSheet({ item, course, url, onClose, onDone }) {
  useEffectLX(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const title = item.name + " · " + course.title;
  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title, text: "Take a look at this lesson on PROfinity", url }).catch(() => {});
      onDone("");
      return;
    }
    copyLX(url); onDone("Lesson link copied");
  };
  const tiles = [
    { k: "copy", label: "Copy link", icon: "lucide:link", run: () => { copyLX(url); onDone("Lesson link copied"); } },
    { k: "feed", label: "Newsfeed", icon: "lucide:newspaper", run: () => onDone("Shared to your newsfeed") },
    { k: "dm", label: "Messages", icon: "lucide:message-circle", run: () => goLX("Messages.html") },
    { k: "more", label: "More", icon: "lucide:more-horizontal", run: shareNative }];
  return (
    <div className="lc-share" role="dialog" aria-modal="true" aria-label="Share lesson" data-screen-label="Share lesson">
      <button type="button" className="lc-share-scrim" aria-label="Close" onClick={onClose} />
      <div className="lc-share-card">
        <span className="lc-share-grab" aria-hidden="true" />
        <div className="lc-share-hd">
          <h3>Share lesson</h3>
          <button type="button" className="lc-share-x" aria-label="Close" onClick={onClose}>
            <DSLX.IconifyIcon name="lucide:x" size={18} color={LX_INK.text} />
          </button>
        </div>

        <div className="lc-share-prev">
          <img src={course.still} alt="" />
          <div className="lc-share-prev-tx">
            <span className="lc-share-prev-eyebrow">{eyebrowLX(item, course)}</span>
            <span className="lc-share-prev-name">{item.name}</span>
            <span className="lc-share-prev-course">{course.title}</span>
          </div>
        </div>

        <div className="lc-share-sec">Send in Messages</div>
        <div className="lc-share-rail">
          {LX_SHARE_CONTACTS.map((c) =>
          <button type="button" className="lc-share-person" key={c.id} onClick={() => onDone("Lesson sent to " + c.name)}>
              <DSLX.Avatar name={c.name} src={c.avatar} size={52} />
              <span>{c.name}</span>
            </button>)}
        </div>

        <div className="lc-share-sec">Share to</div>
        <div className="lc-share-tiles">
          {tiles.map((t) =>
          <button type="button" className="lc-share-tile" key={t.k} onClick={t.run}>
              <span className="lc-share-tile-ic"><DSLX.IconifyIcon name={t.icon} size={22} color={LX_INK.text} /></span>
              <span>{t.label}</span>
            </button>)}
        </div>
      </div>
    </div>);
}

function LXRelated() {
  const related = LX_RELATED.filter((c) => slugLX(c.title) !== LX_COURSE.slug);
  if (!related.length) return null;
  return (
    <section data-screen-label="Related courses">
      <div className="lc-sec"><h2>Related courses</h2></div>
      <div className="lc-related">
        {related.map((c) => {
        const included = includedLX(slugLX(c.title));
        const price = included ? 0 : c.price;
        return (
        <button type="button" className="lc-course" key={c.title} onClick={() => goLX(courseUrlLX({ ...c, price }))}>
            <span className="lc-course-thumb">
              <img src={c.image} alt="" />
              <span className="lc-course-chip">{c.lessons} lessons</span>
            </span>
            <span className="lc-course-tx">
              <span className="lc-course-eyebrow">{included ? "Included in your membership" : price ? "Paid course" : "Course"}</span>
              <span className="lc-course-title" style={{ display: "block" }}>{c.title}</span>
              {price > 0 &&
              <span className="lc-course-price">
                <DSLX.IconifyIcon name="lucide:lock" size={11} color={LX_INK.gold} />£{price}
              </span>}
            </span>
            <span className="lc-course-arrow" aria-hidden="true">
              <DSLX.IconifyIcon name="lucide:arrow-right" size={18} color={LX_INK.onGold} />
            </span>
          </button>);
        })}
      </div>
    </section>);
}

/* Render "@Name" mentions in comment text in gold. */
function LXCommentText({ text }) {
  const parts = text.split(/(@[A-Za-z.]+(?: [A-Z][A-Za-z.]+)?)/g);
  return <p className="lc-cmt-text">{parts.map((p, i) => p.charAt(0) === "@" ? <span key={i} className="lc-cmt-mention">{p}</span> : p)}</p>;
}

function LXComment({ c, onLike, onReply }) {
  return (
    <div className="lc-cmt">
      <DSLX.Avatar name={c.author.name} src={c.author.avatar} size={38} />
      <div className="lc-cmt-main">
        <div className="lc-cmt-meta">
          <span className="lc-cmt-name">{c.author.name}</span>
          <span className="lc-cmt-time">{c.time}</span>
        </div>
        <LXCommentText text={c.text} />
        <div className="lc-cmt-actions">
          <button type="button" className={"lc-cmt-act" + (c.liked ? " on" : "")} aria-pressed={!!c.liked} onClick={onLike}>
            <DSLX.IconifyIcon name="lucide:heart" size={15} color={c.liked ? LX_INK.gold : LX_INK.muted} />
            Like{c.likes ? ` · ${c.likes}` : ""}
          </button>
          <button type="button" className="lc-cmt-act" onClick={onReply}>
            <DSLX.IconifyIcon name="lucide:message-circle" size={15} color={LX_INK.muted} />
            Reply
          </button>
        </div>
      </div>
    </div>);
}

let _lxseq = 0;
function LXComments({ lessonName }) {
  const [comments, setComments] = useStateLX(() => LX_DEFAULT_COMMENTS.map((c) => ({ ...c, _id: "lx" + _lxseq++ })));
  const [draft, setDraft] = useStateLX("");
  const inputRef = useRefLX(null);

  const like = (id) => setComments((all) => all.map((c) => c._id === id ? { ...c, liked: !c.liked, likes: (c.likes || 0) + (c.liked ? -1 : 1) } : c));
  const reply = (c) => {
    setDraft("@" + c.author.name + " ");
    if (inputRef.current) { inputRef.current.focus(); inputRef.current.scrollIntoView({ block: "center", behavior: "smooth" }); }
  };
  const post = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((all) => [{ author: LX_ME, time: "Just now", text, likes: 0, liked: false, _id: "lx" + _lxseq++ }, ...all]);
    setDraft("");
  };

  return (
    <section data-screen-label="Comments">
      <div className="lc-sec"><h2>{comments.length} Comment{comments.length === 1 ? "" : "s"}</h2></div>
      <form className="lc-composer" onSubmit={(e) => { e.preventDefault(); post(); }}>
        <DSLX.Avatar name={LX_ME.name} src={LX_ME.avatar} size={34} />
        <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={"Comment on " + lessonName + "…"} aria-label="Write a comment" />
        <button type="submit" className="lc-send" aria-label="Post comment" disabled={!draft.trim()}>
          <DSLX.IconifyIcon name="lucide:send" size={17} color={LX_INK.onNavy} />
        </button>
      </form>
      <div className="lc-cmts">
        {comments.map((c) => <LXComment key={c._id} c={c} onLike={() => like(c._id)} onReply={() => reply(c)} />)}
      </div>
    </section>);
}

function LXAvaCard({ lessonName, courseTitle }) {
  return (
    <section className="lc-ava" data-screen-label="Talk this through with Ava">
      <span className="orb"><DSLX.IconifyIcon name="lucide:sparkles" size={22} color="#fff" /></span>
      <div className="tx">
        <div className="ti">Talk this through with Ava</div>
        <div className="su">Stuck on a landmark or unsure how this applies to your patients? Ava knows where you are in the course.</div>
        <button type="button" className="pf-coach-link" data-coach={`I'm on the lesson "${lessonName}" in ${courseTitle}. Quiz me on the key points and tell me what to practise next.`}>
          <DSLX.IconifyIcon name="lucide:sparkles" size={14} color="#fff" />Ask Ava
        </button>
      </div>
    </section>);
}

const LX_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: LX_LEARNING_URL },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" },
{ key: "Rewards", label: "Rewards", icon: "lucide:gift", href: "RewardsDashboard.html" }];

function LXTabBar({ compact }) {
  const off = LX_LIGHT ? "#000" : "#fff";
  return (
    <nav className={"lm-tabs" + (compact ? " lm-tabs-compact" : "")} aria-label="Primary">
      {LX_TABS.map((t) => {
        const on = t.key === "Learning";
        return (
          <button key={t.key} type="button" className={"lm-tab" + (on ? " on" : "")} aria-current={on ? "page" : undefined} onClick={() => goLX(t.href)}>
            <span className="ic">
              <DSLX.IconifyIcon name={t.icon} size={24} color={on ? LX_INK.onGold : off} />
              {t.dot && <span className="dot">{t.dot}</span>}
            </span>
            <span className="lbl">{t.label}</span>
          </button>);
      })}
    </nav>);
}

/* ---------------------------------------------------------------- lesson player -- */
/* The full-screen view behind "Continue lesson" (and ?play=1 deep links from
   the Confidence learning page). Video lessons play assets/sample-reel.mp4
   behind the course still with our own chrome; PDF lessons page through a
   paper document; the quiz item runs its questions inline. Completion is
   written through the shared pf-lessons-done store from here — a video ticks
   at 90% watched, a PDF on its last page, the quiz when passed — and the bar
   at the bottom advances to the next lesson. */
const LX_VIDEO_SRC = "assets/sample-reel.mp4";

function fmtTimeLX(s) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return m + ":" + (r < 10 ? "0" : "") + r;
}

function LXVideo({ item, course, onComplete, onPrev, onNext }) {
  const ref = useRefLX(null);
  const rootRef = useRefLX(null);
  /* Landscape "theatre" mode: the same <video> (playback keeps going) fills the
     screen in a stage rotated 90°, sized from the .lc-screen box. Exit via the
     chevron, the minimise button or Esc. */
  const [fs, setFs] = useStateLX(false);
  const [stage, setStage] = useStateLX({ w: 0, h: 0 });
  const [v, setV] = useStateLX({ playing: false, started: false, ended: false, muted: false, cur: 0, dur: 0 });
  const [chrome, setChrome] = useStateLX(true);
  const hideTimer = useRefLX(null);
  const doneRef = useRefLX(false);

  useEffectLX(() => {
    doneRef.current = false;
    setV({ playing: false, started: false, ended: false, muted: false, cur: 0, dur: 0 });
    setChrome(true);
    setFs(false);
    const el = ref.current;
    if (el) { el.pause(); el.currentTime = 0; el.muted = false; }
    return () => clearTimeout(hideTimer.current);
  }, [item.name]);

  useEffectLX(() => {
    if (!fs) return;
    const measure = () => {
      const scr = rootRef.current && rootRef.current.closest(".lc-screen");
      if (scr) setStage({ w: scr.clientWidth, h: scr.clientHeight });
    };
    measure();
    const onKey = (e) => { if (e.key === "Escape") setFs(false); };
    window.addEventListener("resize", measure);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("resize", measure); window.removeEventListener("keydown", onKey); };
  }, [fs]);

  const poke = () => {
    setChrome(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChrome(false), 2800);
  };
  const el = () => ref.current;
  const toggle = () => { const e = el(); if (!e) return; if (e.paused) e.play().catch(() => {}); else e.pause(); poke(); };
  const skip = (d) => { const e = el(); if (!e) return; e.currentTime = Math.max(0, Math.min(e.duration || 0, e.currentTime + d)); poke(); };
  const seek = (ev) => { const e = el(); if (!e || !e.duration) return; e.currentTime = Number(ev.target.value) / 1000 * e.duration; poke(); };
  const mute = () => { const e = el(); if (!e) return; e.muted = !e.muted; setV((s) => ({ ...s, muted: e.muted })); poke(); };
  const full = () => { setFs(true); poke(); };
  const exitFull = () => { setFs(false); poke(); };
  const stop = (e) => e.stopPropagation();
  const onTime = () => {
    const e = el(); if (!e) return;
    setV((s) => ({ ...s, cur: e.currentTime, dur: e.duration || 0 }));
    if (!doneRef.current && e.duration && e.currentTime / e.duration >= 0.9) { doneRef.current = true; onComplete(); }
  };
  const onEnded = () => {
    setV((s) => ({ ...s, playing: false, ended: true }));
    setChrome(true);
    if (!doneRef.current) { doneRef.current = true; onComplete(); }
  };
  const pct = v.dur ? v.cur / v.dur * 100 : 0;
  const showChrome = chrome || !v.playing;
  return (
    <div ref={rootRef} className={"lc-media lc-video" + (showChrome ? " chrome" : "") + (fs ? " lc-vfull" : "")} data-screen-label={fs ? "Video · full screen" : "Video"}
    onClick={toggle} onMouseMove={poke} onTouchStart={poke}>
      <div className="lc-vstage" style={fs && stage.w ? { width: stage.h, height: stage.w } : undefined}>
      <video ref={ref} src={LX_VIDEO_SRC} poster={course.still} playsInline preload="metadata"
      onPlay={() => setV((s) => ({ ...s, playing: true, started: true, ended: false }))}
      onPause={() => setV((s) => ({ ...s, playing: false }))}
      onTimeUpdate={onTime} onLoadedMetadata={onTime} onEnded={onEnded} />
      <div className="lc-vshade" aria-hidden="true" />
      {!v.started && !fs &&
      <span className="lc-vdur" aria-hidden="true"><DSLX.IconifyIcon name="lucide:clock" size={12} color="#fff" />{item.dur}</span>}
      {fs &&
      <div className="lc-vtop" onClick={stop}>
        <button type="button" className="lc-vplain" aria-label="Exit full screen" onClick={exitFull}>
          <DSLX.IconifyIcon name="lucide:chevron-down" size={24} color="#fff" />
        </button>
        <span className="lc-vtop-title">{item.name}</span>
        <span className="lc-vtop-r">
          <button type="button" className="lc-vplain" aria-label="Cast"><DSLX.IconifyIcon name="lucide:cast" size={22} color="#fff" /></button>
          <button type="button" className="lc-vplain" aria-label="AirPlay"><DSLX.IconifyIcon name="lucide:airplay" size={22} color="#fff" /></button>
          <button type="button" className="lc-vplain" aria-label="Playback settings"><DSLX.IconifyIcon name="lucide:settings-2" size={22} color="#fff" /></button>
        </span>
      </div>}
      <div className="lc-vcenter" onClick={(e) => e.stopPropagation()}>
        {fs &&
        <button type="button" className="lc-vplain lc-vtrack" aria-label="Previous lesson" disabled={!onPrev} onClick={() => onPrev && onPrev()}>
          <DSLX.IconifyIcon name="lucide:skip-back" size={26} color="#fff" />
        </button>}
        <button type="button" className="lc-vskip" aria-label="Back 10 seconds" onClick={() => skip(-10)}>
          <DSLX.IconifyIcon name="lucide:rotate-ccw" size={22} color="#fff" /><span>10</span>
        </button>
        <button type="button" className={"lc-vbig" + (v.playing ? " paused" : "")} aria-label={v.ended ? "Replay" : v.playing ? "Pause" : "Play"} onClick={toggle}>
          <DSLX.IconifyIcon name={v.ended ? "lucide:rotate-ccw" : v.playing ? "lucide:pause" : "fluent:play-16-filled"} size={26} color="#0B1024" />
        </button>
        <button type="button" className="lc-vskip" aria-label="Forward 10 seconds" onClick={() => skip(10)}>
          <DSLX.IconifyIcon name="lucide:rotate-cw" size={22} color="#fff" /><span>10</span>
        </button>
        {fs &&
        <button type="button" className="lc-vplain lc-vtrack" aria-label="Next lesson" disabled={!onNext} onClick={() => onNext && onNext()}>
          <DSLX.IconifyIcon name="lucide:skip-forward" size={26} color="#fff" />
        </button>}
      </div>
      <div className="lc-vbar" onClick={(e) => e.stopPropagation()}>
        {fs &&
        <button type="button" className="lc-vplain" aria-label="Lesson notes"><DSLX.IconifyIcon name="lucide:notebook-pen" size={20} color="#fff" /></button>}
        <span className="lc-vtime">{fmtTimeLX(v.cur)}</span>
        <input type="range" className="lc-vrange" min={0} max={1000} value={Math.round(pct * 10)} onChange={seek} aria-label="Seek"
        style={{ "--fill": pct + "%" }} />
        <span className="lc-vtime">{v.dur ? fmtTimeLX(v.dur) : item.dur}</span>
        <button type="button" className="lc-vic" aria-label={v.muted ? "Unmute" : "Mute"} onClick={mute}>
          <DSLX.IconifyIcon name={v.muted ? "lucide:volume-x" : "lucide:volume-2"} size={18} color="#fff" />
        </button>
        <button type="button" className="lc-vic" aria-label={fs ? "Exit full screen" : "Full screen"} onClick={fs ? exitFull : full}>
          <DSLX.IconifyIcon name={fs ? "lucide:minimize" : "lucide:maximize"} size={17} color="#fff" />
        </button>
      </div>
      </div>
    </div>);
}

/* Pages for the PDF reader — real content for the two named downloads, a
   generic three-pager for anything else marked kind: "pdf". */
function pdfPagesLX(item, course) {
  if (/consent/i.test(item.name)) return [
  { heading: "Lip Filler Treatment — Consent Form", sub: "Template · complete with the patient before every treatment",
    fields: ["Patient name", "Date of birth", "Treating clinician", "Product & batch number", "Volume planned (ml)"] },
  { heading: "Risks, side effects & alternatives", sub: "Tick each item as it is discussed",
    checks: ["Swelling, bruising and tenderness for 3–7 days", "Asymmetry or lumps that may need adjustment", "Infection at the injection site",
    "Vascular occlusion — rare, but an emergency", "Allergic reaction to hyaluronic acid or lidocaine", "Alternatives, including no treatment, discussed"] },
  { heading: "Declaration & signatures", sub: "Both parties sign before treatment begins",
    body: "I confirm that the treatment, its risks and the alternatives have been explained to me, that my questions have been answered and that I have had time to consider my decision.",
    fields: ["Patient signature", "Date", "Clinician signature", "Date"] }];
  if (/recipe|technique/i.test(item.name)) return [
  { heading: "Recipe card 1 · Linear threading", sub: "Vermilion border definition",
    rows: [["Indication", "Border definition, mild volume"], ["Product", "Medium-G′ HA with lidocaine"], ["Needle", "27G or 30G ½″"],
    ["Depth", "Superficial subcutaneous, along the border"], ["Volume", "0.1–0.2 ml per side"], ["Safety check", "Aspirate; stay superficial to the labial artery"]] },
  { heading: "Recipe card 2 · Tenting", sub: "Lip body volume and eversion",
    rows: [["Indication", "Volume and eversion of the lip body"], ["Product", "Medium-G′ HA"], ["Needle", "27G ½″, perpendicular entry"],
    ["Depth", "Submucosal, 2–3 mm"], ["Volume", "0.05 ml per pass"], ["Safety check", "Slow bolus; watch for blanching"]] },
  { heading: "Recipe card 3 · Cannula approach", sub: "Lower-risk full-lip volume",
    rows: [["Indication", "Full-lip volume; previously treated lips"], ["Product", "Soft-to-medium HA"], ["Cannula", "25G, entry at the oral commissure"],
    ["Depth", "Submucosal plane"], ["Volume", "0.3–0.5 ml per lip"], ["Safety check", "Confirm the plane before every retrograde thread"]] }];
  const c = genericContentLX(item);
  return [
  { heading: item.name.replace(/\s*\(PDF\)$/i, ""), sub: course.title, body: c.intro },
  { heading: "Key points", sub: item.sub ? item.sub.name : item.section.name, checks: c.points },
  { heading: "Checklist", sub: "Tick off in clinic", checks: ["Read before the session", "Discuss with your mentor", "File in the patient record"] }];
}

function LXDoc({ item, course, onComplete, onToast }) {
  const pages = useMemoLX(() => pdfPagesLX(item, course), [item.name]);
  const [p, setP] = useStateLX(0);
  useEffectLX(() => { setP(0); }, [item.name]);
  useEffectLX(() => { if (p === pages.length - 1) onComplete(); }, [p, pages.length]);
  const pg = pages[p];
  return (
    <div className="lc-media lc-doc" data-screen-label="PDF">
      <div className="lc-doc-bar">
        <span className="lc-doc-name"><DSLX.IconifyIcon name="lucide:file-text" size={15} color="#fff" />{item.name}</span>
        <button type="button" className="lc-vic" aria-label="Download PDF" onClick={() => onToast("Downloading " + item.name)}>
          <DSLX.IconifyIcon name="lucide:download" size={18} color="#fff" />
        </button>
      </div>
      <div className="lc-page" key={p}>
        <div className="lc-page-hd"><span>PROfinity Academy</span><span>{course.title}</span></div>
        <h3>{pg.heading}</h3>
        {pg.sub && <p className="lc-page-sub">{pg.sub}</p>}
        {pg.body && <p className="lc-page-body">{pg.body}</p>}
        {pg.rows && <dl className="lc-page-rows">{pg.rows.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl>}
        {pg.checks && <ul className="lc-page-checks">{pg.checks.map((c) => <li key={c}><span className="bx" aria-hidden="true" />{c}</li>)}</ul>}
        {pg.fields && <div className="lc-page-fields">{pg.fields.map((f, i) => <div key={f + i}><span>{f}</span><i /></div>)}</div>}
        <div className="lc-page-ft">Page {p + 1} of {pages.length}</div>
      </div>
      <div className="lc-doc-nav">
        <button type="button" className="lc-doc-btn" disabled={p === 0} onClick={() => setP(p - 1)} aria-label="Previous page">
          <DSLX.IconifyIcon name="lucide:chevron-left" size={20} color={LX_INK.text} />
        </button>
        <span className="lc-doc-pg">{p + 1} / {pages.length}</span>
        <button type="button" className="lc-doc-btn" disabled={p === pages.length - 1} onClick={() => setP(p + 1)} aria-label="Next page">
          <DSLX.IconifyIcon name="lucide:chevron-right" size={20} color={LX_INK.text} />
        </button>
      </div>
    </div>);
}

const LX_QUIZ = [
{ q: "Which vessels are the primary vascular risk when injecting the body of the lip?",
  opts: ["Facial artery", "Superior and inferior labial arteries", "Angular artery", "Mental artery"], a: 1,
  why: "The labial arteries run within the lip itself, so depth and plane matter more here than anywhere else in the perioral area." },
{ q: "The classic upper-to-lower lip volume ratio used as a starting guide is:",
  opts: ["1 : 1", "1 : 1.6", "1.6 : 1", "2 : 1"], a: 1,
  why: "Around 1 : 1.6 keeps the lower lip slightly fuller. Deviate deliberately, not by accident." },
{ q: "Which plane is the safest default for a cannula in the lip body?",
  opts: ["Intramuscular", "Deep, on periosteum", "Submucosal", "Intradermal"], a: 2,
  why: "The submucosal plane sits away from the typical course of the labial arteries and gives a smooth, even result." },
{ q: "The standard assessment photo set for the lips contains how many views?",
  opts: ["Two", "Three", "Five", "Eight"], a: 2,
  why: "Frontal, both obliques and both profiles — the five-shot set from the assessment module." },
{ q: "You suspect a vascular occlusion during a lip treatment. Your first action is to:",
  opts: ["Continue slowly and monitor", "Stop injecting immediately and assess", "Apply ice and review tomorrow", "Massage firmly and carry on"], a: 1,
  why: "Stop, assess capillary refill and colour, then follow your occlusion protocol without delay." }];

function LXQuiz({ item, onComplete }) {
  const [i, setI] = useStateLX(0);
  const [pick, setPick] = useStateLX(null);
  const [checked, setChecked] = useStateLX(false);
  const [score, setScore] = useStateLX(0);
  const [finished, setFinished] = useStateLX(false);
  const reset = () => { setI(0); setPick(null); setChecked(false); setScore(0); setFinished(false); };
  useEffectLX(() => { reset(); }, [item.name]);
  const total = LX_QUIZ.length;
  const passed = score / total >= 0.8;
  useEffectLX(() => { if (finished && passed) onComplete(); }, [finished]);
  const q = LX_QUIZ[i];
  const check = () => { if (pick == null) return; setChecked(true); if (pick === q.a) setScore((s) => s + 1); };
  const nextQ = () => { if (i + 1 < total) { setI(i + 1); setPick(null); setChecked(false); } else setFinished(true); };
  if (finished) {
    return (
      <div className="lc-media lc-quiz" data-screen-label="Quiz result">
        <div className="lc-qresult">
          <span className={"lc-qring" + (passed ? " pass" : "")}>{Math.round(score / total * 100)}%</span>
          <h3>{passed ? "You passed" : "Not quite yet"}</h3>
          <p>{passed ?
            score + " of " + total + " correct — your " + item.section.name.toLowerCase() + " is complete." :
            score + " of " + total + " correct. You need 80% to pass — review the lessons and try again."}</p>
          <button type="button" className="lc-btn lc-btn-outline" onClick={reset}>
            <DSLX.IconifyIcon name="lucide:rotate-ccw" size={16} color={LX_INK.outline} />Retake quiz
          </button>
        </div>
      </div>);
  }
  return (
    <div className="lc-media lc-quiz" data-screen-label="Quiz">
      <div className="lc-qhead">
        <span className="lc-qn">Question {i + 1} of {total}</span>
        <span className="lc-qscore">{score} correct</span>
      </div>
      <div className="lc-track" aria-hidden="true"><span style={{ width: i / total * 100 + "%" }} /></div>
      <h3 className="lc-qq">{q.q}</h3>
      <div className="lc-qopts" role="radiogroup" aria-label="Answers">
        {q.opts.map((o, k) => {
          const st = !checked ? (pick === k ? " picked" : "") : k === q.a ? " right" : pick === k ? " wrong" : "";
          return (
            <button type="button" role="radio" aria-checked={pick === k} key={o} className={"lc-qopt" + st} disabled={checked} onClick={() => setPick(k)}>
              <span className="lc-qkey">{String.fromCharCode(65 + k)}</span>
              <span className="tx">{o}</span>
              {checked && k === q.a && <DSLX.IconifyIcon name="lucide:check" size={18} color={LX_INK.success} strokeWidth={2.5} />}
              {checked && pick === k && k !== q.a && <DSLX.IconifyIcon name="lucide:x" size={18} color="#E5484D" strokeWidth={2.5} />}
            </button>);
        })}
      </div>
      {checked && <p className={"lc-qwhy" + (pick === q.a ? " ok" : "")}>{pick === q.a ? "Correct. " : "Not quite. "}{q.why}</p>}
      <button type="button" className="lc-btn lc-btn-fill lc-qcta" disabled={!checked && pick == null} onClick={checked ? nextQ : check}>
        {checked ? (i + 1 < total ? "Next question" : "See result") : "Check answer"}
      </button>
    </div>);
}

/* Course-level progress at the top of the player. Default is a minimised
   strip — label, "n of N", thin bar — so it doesn't compete with the lesson.
   Tapping the strip expands the ring, lessons-to-go and an Open course link. */
function LXRing({ pct, size = 84, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg className="lc-cring" width={size} height={size} viewBox={"0 0 " + size + " " + size} role="img" aria-label={pct + "% complete"}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--lc-ring-track)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--lc-ring)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"} />
      <text x="50%" y="50%" dy=".36em" textAnchor="middle" className="lc-cring-n">{pct}%</text>
    </svg>);
}
function LXCourseProgress({ course, flat, done, onOpen }) {
  const [open, setOpen] = useStateLX(false);
  const total = flat.length;
  const doneCount = flat.filter((l) => done.indexOf(l.name) !== -1).length;
  const pct = Math.round(doneCount / total * 100);
  const left = total - doneCount;
  return (
    <div className={"lc-cprog" + (open ? " is-open" : " is-min")} data-screen-label="Course progress">
      <button type="button" className="lc-cprog-min" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        aria-label={course.title + " course progress, " + doneCount + " of " + total + " lessons complete. " + (open ? "Collapse" : "Expand")}>
        <span className="lc-cprog-min-row">
          <span className="lc-cprog-eyebrow">Course progress</span>
          <span className="lc-cprog-min-n"><b>{doneCount}</b> of {total}</span>
          <span className="lc-cprog-chev" aria-hidden="true">
            <DSLX.IconifyIcon name="lucide:chevron-down" size={18} color={LX_INK.muted} />
          </span>
        </span>
        <span className="lc-cprog-bar"><DSLX.ProgressBar value={pct} showPercent={false} height={open ? 8 : 6} /></span>
      </button>
      {open && (
        <div className="lc-cprog-full">
          <LXRing pct={pct} size={72} stroke={7} />
          <span className="lc-cprog-tx">
            <span className="lc-cprog-left"><b>{left}</b> {left === 1 ? "lesson" : "lessons"} to go</span>
            <span className="lc-cprog-sub">{pct}% of the course complete</span>
            <button type="button" className="lc-cprog-open" onClick={onOpen} aria-label={"Open " + course.title + " course"}>
              Open course
              <DSLX.IconifyIcon name="lucide:chevron-right" size={16} color={LX_INK.muted} />
            </button>
          </span>
        </div>
      )}
    </div>);
}

function LXPlayer({ course, flat, idx, done, onClose, onSelect, onMarkDone, onToast, onShare }) {
  const item = flat[idx];
  const next = flat[idx + 1] || null;
  const isDone = done.indexOf(item.name) !== -1;
  const kind = item.kind || "video";
  const content = genericContentLX(item);
  const scrollRef = useRefLX(null);
  /* Details | Resources sub-tabs under the media; back to Details on each lesson */
  const [tab, setTab] = useStateLX("details");
  useEffectLX(() => { setTab("details"); if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 }); }, [idx]);

  const complete = () => {
    if (isDone) return;
    onMarkDone(item.name);
    onToast(kind === "quiz" ? "Quiz passed — lesson complete" : kind === "pdf" ? "Document reviewed ✓" : "Lesson complete ✓");
  };
  const advance = () => {
    onMarkDone(item.name);
    if (next) onSelect(idx + 1);
    else { onToast("Course complete — certificate on its way 🎓"); onClose(); }
  };
  const quizLocked = kind === "quiz" && !isDone;
  const cta = quizLocked ? "Pass the quiz to finish" : next ? (isDone ? "Next lesson" : "Mark complete & continue") : isDone ? "Course complete" : "Finish course";
  const kindIcon = kind === "pdf" ? "lucide:file-text" : kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled";

  /* Up next: the next module (the first group after the current lesson's
     group) — its title and how many lessons it holds. Hidden on the last one. */
  const groupKeyLX = (l) => l.li + ":" + l.si + ":" + (l.subIdx == null ? "" : l.subIdx);
  const nextModIdx = flat.findIndex((l, i) => i > idx && groupKeyLX(l) !== groupKeyLX(item));
  const nextMod = nextModIdx === -1 ? null : flat[nextModIdx];
  const nextModCount = nextMod ? flat.filter((l) => groupKeyLX(l) === groupKeyLX(nextMod)).length : 0;
  const nextModName = nextMod ? (nextMod.sub ? nextMod.sub.name : nextMod.section.name) : "";

  return (
    <div className="lc-player" data-screen-label={"Lesson player · " + kind}>
      <header className="lc-ptop">
        {/* navy header like the course page — white ink in both variants */}
        <button type="button" className="lc-back" aria-label="Back to course" onClick={onClose}>
          <DSLX.IconifyIcon name="lucide:chevron-left" size={22} color="#FFFFFF" />
        </button>
        <div className="lc-ptitle">
          <span className="lc-peyebrow">{eyebrowLX(item, course)}</span>
          <span className="lc-pname">{item.name}</span>
        </div>
        <button type="button" className="lc-back" aria-label="Share lesson" onClick={onShare}>
          <DSLX.IconifyIcon name="lucide:share-2" size={18} color="#FFFFFF" />
        </button>
      </header>

      <div className="lc-pscroll" ref={scrollRef}>
        {kind === "pdf" ? <LXDoc item={item} course={course} onComplete={complete} onToast={onToast} /> :
        kind === "quiz" ? <LXQuiz item={item} onComplete={complete} /> :
        <LXVideo item={item} course={course} onComplete={complete}
          onPrev={idx > 0 ? () => onSelect(idx - 1) : null} onNext={next ? () => onSelect(idx + 1) : null} />}

        <div className="lc-ptabs" role="tablist" aria-label="Lesson sections">
          <button type="button" role="tab" className={"lc-ptab" + (tab === "details" ? " on" : "")} aria-selected={tab === "details"} onClick={() => setTab("details")}>Details</button>
          <button type="button" role="tab" className={"lc-ptab" + (tab === "resources" ? " on" : "")} aria-selected={tab === "resources"} onClick={() => setTab("resources")}>
            Resources <span className="lc-ptab-n">({LX_RESOURCES.length})</span>
          </button>
        </div>

        {tab === "resources" &&
        <div role="tabpanel" className="lc-ppanel">
          <h1 className="lc-title lc-ptitle-full">{item.name}</h1>
          <LXResources compact onToast={onToast} />
        </div>}

        {tab === "details" && <div role="tabpanel" className="lc-ppanel">
        <div className="lc-pmeta">
          <span className="lc-chip"><DSLX.IconifyIcon name={kindIcon} size={13} color={LX_INK.gold} />{kind === "pdf" ? "PDF" : item.dur}</span>
          <span className="lc-chip">Lesson {item.groupPos} of {item.groupTotal}</span>
          {isDone && <span className="lc-chip done"><DSLX.IconifyIcon name="lucide:check" size={13} color={LX_INK.success} strokeWidth={2.5} />Completed</span>}
        </div>
        <h1 className="lc-title lc-ptitle-full">{item.name}</h1>
        <p className="lc-body">{content.intro}</p>

        <section data-screen-label="In this lesson">
          <div className="lc-sec"><h2>In this lesson</h2></div>
          <p className="lc-body">{content.body}</p>
          <ul className="lc-points">
            {content.points.map((p, i) =>
            <li className="lc-point" key={i}>
                <span className="tick"><DSLX.IconifyIcon name="lucide:check" size={14} color={LX_INK.gold} strokeWidth={2.5} /></span>
                <span>{p}</span>
              </li>
            )}
          </ul>
        </section>

        {nextMod &&
        <section data-screen-label="Up next">
            <div className="lc-sec"><h2>Up next</h2></div>
            <div className="lc-upnext">
              <button type="button" className="lc-uptile" onClick={() => onSelect(nextModIdx)}
                aria-label={"Open " + nextModName + ", " + nextModCount + (nextModCount === 1 ? " lesson" : " lessons")}>
                <span className="lc-uptile-go" aria-hidden="true">
                  <DSLX.IconifyIcon name="lucide:arrow-up-right" size={18} color="#fff" />
                </span>
                <span className="lc-uptile-dur">{nextModCount} {nextModCount === 1 ? "lesson" : "lessons"}</span>
                <span className="lc-uptile-name">{nextModName}</span>
              </button>
            </div>
          </section>}

        <LXAvaCard lessonName={item.name} courseTitle={course.title} />
        </div>}
        <div style={{ height: 16 }} />
      </div>

      <div className="lc-pbar">
        <button type="button" className="lc-btn lc-btn-fill" disabled={quizLocked || (!next && isDone)} onClick={advance}>
          <DSLX.IconifyIcon name={isDone && next ? "fluent:play-16-filled" : "lucide:check"} size={16} color={LX_INK.onNavy} />
          {cta}
        </button>
      </div>
    </div>);
}

/* ---------------------------------------------------------------- screen -- */
function CourseDetailConfidence() {
  const course = LX_COURSE;
  const flat = useMemoLX(() => flattenLX(course), []);
  const [done, markDone] = useLessonsDoneLX();
  const purchased = usePurchasedLX();
  /* paid course, not bought yet: browse only — nothing plays until checkout */
  const locked = course.price > 0 && purchased.indexOf(course.slug) === -1;

  /* current lesson = first not-yet-completed lesson, else the first */
  const [curIdx, setCurIdx] = useStateLX(() => {
    const fromUrl = lessonIdxFromParamsLX(flat);
    if (fromUrl != null) return fromUrl;
    const i = flat.findIndex((l) => done.indexOf(l.name) === -1);
    return i === -1 ? 0 : i;
  });
  const cur = flat[curIdx];
  const content = genericContentLX(cur);
  const curDone = done.indexOf(cur.name) !== -1;
  const next = flat[curIdx + 1] || null;

  const [toast, setToast] = useStateLX(null);
  const toastTimer = useRefLX(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const scrollRef = useRefLX(null);
  const [compact, setCompact] = useStateLX(false);
  useEffectLX(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const dy = y - lastY;
      if (y < 40) setCompact(false);
      else if (dy > 6) setCompact(true);
      else if (dy < -6) setCompact(false);
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* Lesson player — full-screen over this page. ?play=1 opens it on load (the
     Confidence learning page deep-links here); opening pushes a history entry
     so the browser/phone back gesture closes it; the URL tracks the lesson. */
  const [playing, setPlaying] = useStateLX(() => !locked && LX_PARAMS.get("play") === "1");
  const pushedRef = useRefLX(false);
  /* Light variant: both the course header and the player header are navy, so
     the device frame's status bar uses white ink throughout. */
  useEffectLX(() => {
    document.body.classList.toggle("lc-navy-status", LX_LIGHT);
    return () => document.body.classList.remove("lc-navy-status");
  }, [LX_LIGHT]);
  const syncUrl = (i, play) => {
    try {
      const u = new URL(window.location.href);
      const it = flat[i];
      u.searchParams.set("course", course.slug);
      u.searchParams.set("level", it.li); u.searchParams.set("module", it.si); u.searchParams.set("lesson", it.ni);
      if (it.subIdx == null) u.searchParams.delete("sub"); else u.searchParams.set("sub", it.subIdx);
      if (play) u.searchParams.set("play", "1"); else u.searchParams.delete("play");
      return u;
    } catch (e) { return null; }
  };
  const buyCourse = () => goLX(checkoutUrlLX(course));
  const nudgeBuy = () => showToast("Buy this course to start its lessons");
  const openPlayer = (i) => {
    if (locked) { nudgeBuy(); return; }
    setCurIdx(i);
    if (playing) { const u = syncUrl(i, true); if (u) history.replaceState(history.state, "", u); return; }
    const u = syncUrl(i, true);
    if (u) { history.pushState({ lxPlay: 1 }, "", u); pushedRef.current = true; }
    setPlaying(true);
  };
  const closePlayer = () => {
    if (pushedRef.current) { pushedRef.current = false; history.back(); return; }
    setPlaying(false);
    const u = syncUrl(curIdx, false);
    if (u) history.replaceState(history.state, "", u);
  };
  useEffectLX(() => {
    const onPop = () => { pushedRef.current = false; setPlaying(new URLSearchParams(window.location.search).get("play") === "1"); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const playerSelect = (i) => {
    setCurIdx(i);
    const u = syncUrl(i, true);
    if (u) history.replaceState(history.state, "", u);
  };

  const selectLesson = (name) => {
    const i = flat.findIndex((l) => l.name === name);
    if (i === -1) return;
    if (flat[i].kind === "pdf" && !locked) { openPlayer(i); return; }
    setCurIdx(i);
    if (locked) nudgeBuy();
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Continue lesson — open the player on the current lesson (or the next one
     when the current is already ticked). Completion is written from there. */
  const continueLesson = () => {
    if (!next && curDone) return;
    openPlayer(curDone && next ? curIdx + 1 : curIdx);
  };

  /* Share lesson — opens the in-app share sheet (Messages rail + share-to
     tiles). ?share=1 opens it on load for design review. */
  const [shareOpen, setShareOpen] = useStateLX(() => LX_PARAMS.get("share") === "1");
  const shareLesson = () => setShareOpen(true);
  const shareUrl = window.location.href.split("#")[0].replace(/[?&]share=1/, "") + "#" + slugLX(cur.name);
  const shareDone = (msg) => { setShareOpen(false); if (msg) showToast(msg); };

  /* Start learning until the first lesson of this course is done, then
     Continue learning (user, 2026-09-15). */
  const started = curIdx > 0 || flat.some((l) => done.indexOf(l.name) !== -1);
  const continueLabel = !next ? (curDone ? "Course complete" : "Finish course") : started ? "Continue learning" : "Start learning";

  return (
    <div className={"lc-screen" + (LX_LIGHT ? " lc-light" : "")} data-screen-label={"Course Detail · Confidence (" + (LX_LIGHT ? "light" : "dark") + ")"}>
      <LXHeader />

      <div className="lc-scroll" ref={scrollRef}>
        <LXHero item={cur} course={course} locked={locked} />

        <button type="button" className={"lc-still" + (locked ? " locked" : "")} data-screen-label="Still" onClick={() => openPlayer(curIdx)}
        aria-label={locked ? "Buy this course to play " + cur.name : (cur.kind === "pdf" ? "Open " : cur.kind === "quiz" ? "Start " : "Play ") + cur.name}>
          <img src={course.still} alt="" />
          {/* no play / lock button on a locked course — the image is browse-only */}
          {!locked &&
          <span className={"lc-still-play" + (cur.kind ? " doc" : "")} aria-hidden="true">
            <DSLX.IconifyIcon name={cur.kind === "pdf" ? "lucide:file-text" : cur.kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled"} size={22} color="#0B1024" />
          </span>}
          <span className="lc-still-dur" aria-hidden="true">
            <DSLX.IconifyIcon name={cur.kind === "pdf" ? "lucide:file-text" : "lucide:clock"} size={12} color="#fff" />{cur.dur}
          </span>
        </button>

        <p className="lc-intro">{content.intro}</p>

        {locked && <LXPaywall course={course} total={flat.length} onBuy={buyCourse} />}

        {/* locked: the paywall card's Buy button is the only CTA */}
        {!locked &&
        <div className="lc-ctas" data-screen-label="CTAs">
          <button type="button" className="lc-btn lc-btn-fill" onClick={continueLesson} disabled={!next && curDone}>
            {continueLabel}
            <DSLX.IconifyIcon name="lucide:arrow-right" size={17} color={LX_INK.onNavy} />
          </button>
          <button type="button" className="lc-btn lc-btn-outline" onClick={shareLesson}>
            <DSLX.IconifyIcon name="lucide:share-2" size={17} color={LX_INK.outline} />
            Share lesson
          </button>
        </div>}

        <section data-screen-label="In this lesson">
          <div className="lc-sec"><h2>In this lesson</h2></div>
          <p className="lc-body">{content.body}</p>
          <ul className="lc-points">
            {content.points.map((p, i) =>
            <li className="lc-point" key={i}>
                <span className="tick"><DSLX.IconifyIcon name="lucide:check" size={14} color={LX_INK.gold} strokeWidth={2.5} /></span>
                <span>{p}</span>
              </li>
            )}
          </ul>
        </section>

        <LXCourseContent course={course} done={done} total={flat.length} currentName={cur.name} locked={locked} onSelect={selectLesson} />

        <LXResources onToast={showToast} locked={locked} onLocked={nudgeBuy} />

        <LXRelated />

        <LXComments lessonName={cur.name} />

        <LXAvaCard lessonName={cur.name} courseTitle={course.title} />

        <div style={{ height: 12 }} />
      </div>

      {playing && !locked &&
      <LXPlayer course={course} flat={flat} idx={curIdx} done={done} onClose={closePlayer} onSelect={playerSelect}
      onMarkDone={markDone} onToast={showToast} onShare={shareLesson} />}

      {shareOpen && <LXShareSheet item={cur} course={course} url={shareUrl} onClose={() => setShareOpen(false)} onDone={shareDone} />}

      {toast && <div className="lc-toast" role="status">{toast}</div>}
      <LXTabBar compact={compact} />
    </div>);
}

function useDeviceScaleLX() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateLX(calc);
  useEffectLX(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

function useIsMobileLX() {
  const [mobile, setMobile] = useStateLX(() => window.matchMedia("(max-width:768px)").matches);
  useEffectLX(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

function CourseDetailConfidenceApp() {
  useThemeSyncLX();
  const mobile = useIsMobileLX();
  const scale = useDeviceScaleLX();
  const vars = { "--action-primary": "#0C1928", "--action-primary-hover": "#081120" };
  const pageBg = LX_LIGHT ? "#F9F7F4" : "#0B1024";
  if (mobile) {
    return <div className="app" style={{ ...vars, background: pageBg }}><CourseDetailConfidence /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: LX_LIGHT ? "rgb(217, 218, 225)" : "#05081a" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><CourseDetailConfidence /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CourseDetailConfidenceApp />);
