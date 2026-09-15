/* ===========================================================================
   PROfinity — My Learning shared data + helpers (web + mobile)
   Plain script (no JSX) exposing window.PFLearnShared (learning-store-web.js owns window.PFLearn). Loaded BEFORE the page
   bundle on every My Learning page: MyLearning / CourseWeb / LessonWeb /
   AllCoursesWeb / MyCoursesWeb (desktop) and LearningMobile* / CourseDetail* /
   AllCourses* / Lesson / Module / SubModule (mobile).

   One source of truth for the things that used to be copied per page and
   drifted apart:
     • greeting()          time-of-day greeting in the viewer's own time zone
     • CURRICULA           the 8D Lip Design course (levels → modules → lessons)
                           — the course "Continue a course" resumes into
     • flatten / resume    reading order + "first lesson not yet completed"
     • pf-lessons-done     the completion store (array of lesson names) that the
                           Confidence reader, Lesson.html and Module.html write
     • PRICES / INCLUDED   paid-course prices and what each tier already owns
     • pf-purchased-courses the checkout store; RELATED_POOL + pickRelated()
                           drop bought courses and back-fill the next one
     • CATALOG             the All Courses catalogue (categories, popular
                           topics, popular instructors) shared by web + mobile
   =========================================================================== */
(function () {
  var P = window.PFLearnShared = window.PFLearnShared || {};
  var PARAMS = new URLSearchParams(window.location.search);

  /* ---------------------------------------------------------------- greeting -- */
  /* Morning until noon, afternoon until 6pm, evening after — evaluated in the
     viewer's time zone (Intl resolves the device zone). ?tz=Europe/London and
     ?hour=20 override for design review. */
  P.timeZone = function () {
    var q = PARAMS.get("tz");
    if (q) return q;
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return undefined; }
  };
  P.localHour = function (d) {
    var h = Number(PARAMS.get("hour"));
    if (PARAMS.get("hour") != null && !isNaN(h)) return h;
    d = d || new Date();
    try {
      var s = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: P.timeZone() }).format(d);
      var n = parseInt(s, 10);
      if (!isNaN(n)) return n;
    } catch (e) {}
    return d.getHours();
  };
  P.greeting = function (d) {
    var h = P.localHour(d);
    if (h < 12) return { text: "Good morning", icon: "lucide:sun", part: "morning" };
    if (h < 18) return { text: "Good afternoon", icon: "lucide:cloud-sun", part: "afternoon" };
    return { text: "Good evening", icon: "lucide:moon", part: "evening" };
  };
  /* React hook: re-evaluates every minute and when the tab comes back, so a
     page left open through noon flips from morning to afternoon by itself. */
  P.useGreeting = function () {
    var R = window.React;
    var st = R.useState(P.greeting);
    var g = st[0], set = st[1];
    R.useEffect(function () {
      var tick = function () { var n = P.greeting(); set(function (o) { return o.part === n.part ? o : n; }); };
      var t = setInterval(tick, 60 * 1000);
      document.addEventListener("visibilitychange", tick);
      window.addEventListener("focus", tick);
      return function () { clearInterval(t); document.removeEventListener("visibilitychange", tick); window.removeEventListener("focus", tick); };
    }, []);
    return g;
  };

  P.ME = { name: "Katy", fullName: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
  P.TUTOR = "Dr Tim Pearce";

  P.slug = function (s) { return String(s || "").toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); };

  /* ---------------------------------------------------------------- tier -- */
  P.TIER_LADDER = ["confidence", "mastery", "freedom", "inner"];
  P.TIER_NAME = { free: "Free", confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", inner: "Inner Circle" };
  P.readTier = function () {
    if (window.PF_TIER) return window.PF_TIER;
    try { return localStorage.getItem("pf-subscription-tier") || "free"; } catch (e) { return "free"; }
  };
  P.nextTier = function (tier) {
    var i = P.TIER_LADDER.indexOf(tier);
    if (i === -1) return P.TIER_LADDER[0];
    if (i === P.TIER_LADDER.length - 1) return null;
    return P.TIER_LADDER[i + 1];
  };

  /* ---------------------------------------------------------------- completion store -- */
  P.DONE_KEY = "pf-lessons-done";
  P.readDone = function () {
    try {
      var raw = localStorage.getItem(P.DONE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  };
  P.markDone = function (name) {
    var names = P.readDone();
    if (names.indexOf(name) !== -1) return names;
    names.push(name);
    try {
      localStorage.setItem(P.DONE_KEY, JSON.stringify(names));
      window.dispatchEvent(new CustomEvent(P.DONE_KEY));
    } catch (e) {}
    return names;
  };
  P.useLessonsDone = function () {
    var R = window.React;
    var st = R.useState(P.readDone);
    var set = st[1];
    R.useEffect(function () {
      var sync = function () { set(P.readDone()); };
      var onStorage = function (e) { if (!e.key || e.key === P.DONE_KEY) sync(); };
      window.addEventListener(P.DONE_KEY, sync);
      window.addEventListener("storage", onStorage);
      window.addEventListener("focus", sync);
      window.addEventListener("pageshow", sync);
      return function () {
        window.removeEventListener(P.DONE_KEY, sync);
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("focus", sync);
        window.removeEventListener("pageshow", sync);
      };
    }, []);
    return st[0];
  };

  /* ---------------------------------------------------------------- curricula -- */
  /* 8D Lip Design — the course every "Continue a course" CTA resumes into.
     Shape: levels[] → sections[] (modules) → lessons[] (+ subs[] folders).
     Lesson names are the completion keys written to pf-lessons-done, so they
     must stay stable. */
  var EIGHT_D = {
    slug: "8d-lip-design",
    title: "8D Lip Design",
    level: "Intermediate",
    category: "Lips & Perioral",
    still: "assets/course-8d-lip-design.jpg",
    blurb: "Discover a complete view of lip anatomy for deeper learning.",
    duration: "4h 10m",
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
  P.CURRICULA = { "8d-lip-design": EIGHT_D };
  P.curriculum = function (slugOrCourse) {
    if (!slugOrCourse) return null;
    if (typeof slugOrCourse === "object") return slugOrCourse;
    return P.CURRICULA[slugOrCourse] || null;
  };

  /* Reading order: a module's own lessons, then each sub-folder in order.
     Each item knows its level/module/sub indices (the ?level=&module=&lesson=
     [&sub=] shape the mobile pages deep-link with) and its group position. */
  P.flatten = function (course) {
    var out = [];
    (course.levels || []).forEach(function (level, li) {
      (level.sections || []).forEach(function (section, si) {
        (section.lessons || []).forEach(function (l, ni) {
          out.push(Object.assign({}, l, { kind: l.kind || "video", level: level, section: section, sub: null, li: li, si: si, subIdx: null, ni: ni, groupTotal: section.lessons.length, groupPos: ni + 1 }));
        });
        (section.subs || []).forEach(function (sub, ui) {
          (sub.lessons || []).forEach(function (l, ni) {
            out.push(Object.assign({}, l, { kind: l.kind || "video", level: level, section: section, sub: sub, li: li, si: si, subIdx: ui, ni: ni, groupTotal: sub.lessons.length, groupPos: ni + 1 }));
          });
        });
      });
    });
    return out;
  };
  /* "Module 3 · Lip Anatomy" — module numbering runs across the whole course. */
  P.moduleLabel = function (course, item) {
    if (item.level && item.level.eyebrow) return item.level.eyebrow;
    var n = 0;
    for (var i = 0; i < item.li; i++) n += ((course.levels[i] || {}).sections || []).length;
    return "Module " + (n + item.si + 1) + " · " + item.section.name;
  };
  P.groupName = function (item) { return item.sub ? item.sub.name : item.section.name; };

  /* Where "Continue" should land: the first lesson not yet completed (the
     last one when everything is done), with the course-level counts. */
  P.resume = function (slugOrCourse, done) {
    var course = P.curriculum(slugOrCourse);
    if (!course) return null;
    done = done || P.readDone();
    var flat = P.flatten(course);
    var total = flat.length;
    var doneCount = flat.filter(function (l) { return done.indexOf(l.name) !== -1; }).length;
    var idx = -1;
    for (var i = 0; i < flat.length; i++) { if (done.indexOf(flat[i].name) === -1) { idx = i; break; } }
    var allDone = idx === -1;
    if (allDone) idx = flat.length - 1;
    var item = flat[idx];
    /* the next module after the current lesson's group (for "What's next") */
    var key = function (l) { return l.li + ":" + l.si + ":" + (l.subIdx == null ? "" : l.subIdx); };
    var nextModIdx = -1;
    for (var j = idx + 1; j < flat.length; j++) { if (key(flat[j]) !== key(item)) { nextModIdx = j; break; } }
    return {
      course: course, flat: flat, idx: idx, item: item, total: total, doneCount: doneCount,
      left: total - doneCount, pct: total ? Math.round(doneCount / total * 100) : 0,
      started: doneCount > 0, allDone: allDone,
      lessonNumber: idx + 1, moduleLabel: P.moduleLabel(course, item), groupName: P.groupName(item),
      next: flat[idx + 1] || null,
      nextModule: nextModIdx === -1 ? null : { idx: nextModIdx, item: flat[nextModIdx], name: P.groupName(flat[nextModIdx]),
        count: flat.filter(function (l) { return key(l) === key(flat[nextModIdx]); }).length }
    };
  };

  /* course-web / lesson-web read a flat sections[] shape — adapt a curriculum
     so the same 8D course renders on desktop with the same lesson names. */
  P.toWebSections = function (course) {
    var sections = [];
    var n = 0;
    (course.levels || []).forEach(function (level, li) {
      if (!(level.sections || []).length) {
        sections.push({ title: level.eyebrow || level.title, lessons: [], subs: [], locked: level.unlock || "Locked" });
        return;
      }
      level.sections.forEach(function (section, si) {
        n += 1;
        var title = level.eyebrow || ("Module " + n + " · " + section.name);
        var mapL = function (l) { return { name: l.name, kind: l.kind || "video", dur: l.kind ? undefined : l.dur, desc: l.intro, bullets: l.points }; };
        sections.push({
          title: title,
          groupDesc: section.desc,
          lessons: (section.lessons || []).map(mapL),
          subs: (section.subs || []).map(function (s) { return { title: s.name, lessons: (s.lessons || []).map(mapL) }; })
        });
      });
    });
    return sections;
  };

  /* Mobile deep link into the Confidence reader's player for a flat index. */
  P.mobileLessonUrl = function (page, course, item, extra) {
    var p = new URLSearchParams(Object.assign({ course: course.slug, level: item.li, module: item.si, lesson: item.ni }, extra || {}));
    if (item.subIdx != null) p.set("sub", item.subIdx);
    return page + "?" + p.toString();
  };

  /* ---------------------------------------------------------------- pricing -- */
  /* Paid courses, keyed by slug. Every route into these (My Learning related
     cards, course pages, All Courses, checkout) reads the same number. */
  P.PRICES = {
    "temple-filler": 342,
    "profinity-membership": 199,
    "advanced-lip-techniques": 342,
    "complications-management": 450,
    "functional-anatomy": 198,
    "treatment-approaches": 246,
    "safety-injection-essentials": 294,
    "cheek-contouring": 246,
    "jawline-sculpting": 294,
    "tear-trough-treatment": 342,
    "perioral-rejuvenation": 246,
    "vascular-occlusion-protocol": 198,
    "consent-documentation": 150
  };
  /* Courses each tier already owns through the membership — never paywalled. */
  P.INCLUDED = {};
  P.INCLUDED.confidence = ["profinity-membership", "8d-lip-design", "temple-filler"];
  P.INCLUDED.mastery = P.INCLUDED.confidence.concat([
    "protox-course", "brow-lift-training", "full-face-rejuvenation-protocol", "cheek-midface-contouring",
    "non-surgical-rhinoplasty", "jawline-sculpting-masterclass", "tear-trough-correction",
    "skin-boosters-hydration-therapy", "complications-management", "consultation-patient-assessment"]);
  P.INCLUDED.freedom = P.INCLUDED.mastery;
  P.INCLUDED.inner = P.INCLUDED.mastery;
  P.includedIn = function (slug, tier) {
    tier = tier || P.readTier();
    if (!tier || tier === "free") return false;
    return (P.INCLUDED[tier] || []).indexOf(slug) !== -1;
  };
  P.priceFor = function (slug, tier, override) {
    if (P.includedIn(slug, tier)) return 0;
    if (override > 0) return Number(override);
    return P.PRICES[slug] || 0;
  };

  P.PURCHASED_KEY = "pf-purchased-courses";
  P.readPurchased = function () {
    try {
      var arr = JSON.parse(localStorage.getItem(P.PURCHASED_KEY));
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  };
  /* Re-read on cross-tab storage, on focus/pageshow (back from checkout in
     the same tab) and on the pf-purchased-courses event. */
  P.usePurchased = function () {
    var R = window.React;
    var st = R.useState(P.readPurchased);
    var set = st[1];
    R.useEffect(function () {
      var refresh = function () { set(P.readPurchased()); };
      var onStorage = function (e) { if (!e.key || e.key === P.PURCHASED_KEY) refresh(); };
      window.addEventListener("storage", onStorage);
      window.addEventListener(P.PURCHASED_KEY, refresh);
      window.addEventListener("focus", refresh);
      window.addEventListener("pageshow", refresh);
      document.addEventListener("visibilitychange", refresh);
      return function () {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(P.PURCHASED_KEY, refresh);
        window.removeEventListener("focus", refresh);
        window.removeEventListener("pageshow", refresh);
        document.removeEventListener("visibilitychange", refresh);
      };
    }, []);
    return st[0];
  };
  P.isOwned = function (slug, purchased, tier) {
    return P.includedIn(slug, tier) || (purchased || P.readPurchased()).indexOf(slug) !== -1;
  };

  /* ---------------------------------------------------------------- related courses -- */
  /* Recommendations shown under My Courses and on course pages. Paid — the
     card shows the price and the course page gates starting behind checkout.
     pickRelated() drops anything already owned (bought or included in the
     tier) and back-fills from the pool so three are always on offer. */
  P.RELATED_POOL = [
  { title: "Functional Anatomy", level: "Intermediate", lessons: 14, dur: "2h 00m", image: "assets/course-8d-lip-design.jpg", blurb: "The structures that shape the lip line." },
  { title: "Treatment Approaches", level: "Intermediate", lessons: 10, dur: "1h 25m", image: "assets/course-consultation.jpg", blurb: "Evidence-based strategies for natural outcomes." },
  { title: "Safety & Injection Essentials", level: "Beginner", lessons: 10, dur: "1h 20m", image: "assets/course-complications.jpg", blurb: "Protect your patients. Protect your practice." },
  { title: "Advanced Lip Techniques", level: "Advanced", lessons: 18, dur: "2h 30m", image: "assets/course-advanced-lip-techniques.jpg", blurb: "Build on 8D with layered volume, borders and perioral balance." },
  { title: "Complications Management", level: "Advanced", lessons: 12, dur: "1h 40m", image: "assets/course-complications.jpg", blurb: "Recognise, prevent and manage vascular and other complications." },
  { title: "Cheek Contouring", level: "Intermediate", lessons: 11, dur: "1h 30m", image: "assets/course-cheek-contouring.jpg", blurb: "Restore midface volume with balanced, natural lift." },
  { title: "Jawline Sculpting", level: "Advanced", lessons: 9, dur: "1h 15m", image: "assets/course-jawline-sculpting.jpg", blurb: "Define and strengthen the lower face with precision." },
  { title: "Tear Trough Treatment", level: "Advanced", lessons: 7, dur: "56m", image: "assets/course-tear-trough.jpg", blurb: "Refresh tired eyes safely in a delicate area." },
  { title: "Temple Filler", level: "Advanced", lessons: 14, dur: "1h 40m", image: "assets/course-temple-filler.webp", blurb: "Master safe injection techniques with anatomical precision." }
  ].map(function (c) { c.slug = P.slug(c.title); return c; });

  P.pickRelated = function (opts) {
    opts = opts || {};
    var tier = opts.tier || P.readTier();
    var purchased = opts.purchased || P.readPurchased();
    var n = opts.n || 3;
    var exclude = opts.exclude || [];
    var includeOwned = !!opts.includeOwned;
    var out = [];
    for (var i = 0; i < P.RELATED_POOL.length && out.length < n; i++) {
      var c = P.RELATED_POOL[i];
      if (exclude.indexOf(c.slug) !== -1) continue;
      var included = P.includedIn(c.slug, tier);
      var bought = purchased.indexOf(c.slug) !== -1;
      if (bought) continue;                       /* replaced by the next in the pool */
      if (included && !includeOwned) continue;    /* already in My Courses */
      out.push(Object.assign({}, c, { price: included ? 0 : (P.PRICES[c.slug] || 0), included: included }));
    }
    return out;
  };

  /* ---------------------------------------------------------------- catalogue -- */
  P.CATS = ["Lips & Perioral", "Anatomy", "Safety", "Patient Journey"];
  P.TOPICS = [
  "Lip anatomy", "Complication management", "Cannula technique", "Consent & consultation",
  "Vascular occlusion", "Facial assessment", "Marionette lines", "Aftercare", "Photography", "Toxin"];
  P.INSTRUCTORS = [
  { name: "Dr Tim Pearce", role: "Founder · Lips & toxin", avatar: "assets/avatar-drtim.png" },
  { name: "Dr Priya Shah", role: "Facial anatomy", avatar: "assets/avatar-priya-shah.jpg" },
  { name: "Dr Amir Khan", role: "Complications & safety", avatar: "assets/avatar-amir-khan.jpg" },
  { name: "Sarah Collins", role: "Consultation & consent", avatar: "assets/avatar-sarah-collins.jpg" },
  { name: "Miranda Pearce", role: "Patient journey & growth", avatar: "assets/avatar-miranda.jpg" }];

  var IMG = {
    eightD: "assets/course-8d-lip-design.jpg", fullFace: "assets/course-full-face-rejuvenation.jpg", lip: "assets/course-lip.png",
    advLip: "assets/course-advanced-lip-techniques.jpg", protox: "assets/course-protox.png", clinicLip: "assets/clinic-lip-design.png",
    complications: "assets/course-complications.jpg", cheek: "assets/course-cheek-contouring.jpg", tearTrough: "assets/course-tear-trough.jpg",
    temple: "assets/course-temple.png", templeFiller: "assets/course-temple-filler.webp", jawline: "assets/course-jawline-sculpting.jpg",
    brow: "assets/course-brow-lift.jpg", skin: "assets/course-skin-boosters.jpg", rhino: "assets/course-rhinoplasty.jpg",
    consult: "assets/course-consultation.jpg", membership: "assets/course-membership-banner.jpg", marketing: "assets/course-marketing.webp" };

  /* Every category carries six-plus courses so each rail scrolls. `owned`
     marks the two the member is enrolled on (hidden from the rails, found
     by search). `slug` set → the course page knows it; otherwise the generic
     ?title= route builds it. `level` feeds the level badge. */
  P.CATALOG = [
  /* Lips & Perioral */
  { title: "8D Lip Design", cat: "Lips & Perioral", level: "Intermediate", blurb: "The complete lip anatomy, assessment and technique pathway.", lessons: 39, mins: 250, image: IMG.eightD, by: "Dr Tim Pearce", topics: ["Lip anatomy"], owned: true, slug: "8d-lip-design", tags: ["Recommended", "Popular"] },
  { title: "Perioral Rejuvenation", cat: "Lips & Perioral", level: "Intermediate", blurb: "Marionette lines, chin support and smoker's lines.", lessons: 12, mins: 96, image: IMG.fullFace, by: "Dr Tim Pearce", topics: ["Marionette lines"], tags: ["New"] },
  { title: "Corner Lip Lift", cat: "Lips & Perioral", level: "Advanced", blurb: "Lift a downturned mouth corner without over-filling.", lessons: 8, mins: 64, image: IMG.lip, by: "Dr Tim Pearce", topics: ["Marionette lines"], tags: [] },
  { title: "Advanced Lip Techniques", cat: "Lips & Perioral", level: "Advanced", blurb: "Layered volume, borders and perioral balance built on 8D.", lessons: 18, mins: 150, image: IMG.advLip, by: "Dr Tim Pearce", topics: ["Lip anatomy", "Cannula technique"], tags: ["Recommended", "Popular"] },
  { title: "Lip Flip with Toxin", cat: "Lips & Perioral", level: "Beginner", blurb: "Subtle eversion of the upper lip with micro-doses.", lessons: 6, mins: 45, image: IMG.protox, by: "Dr Tim Pearce", topics: ["Toxin"], tags: ["Popular"] },
  { title: "Russian Lip Technique", cat: "Lips & Perioral", level: "Advanced", blurb: "Vertical tenting for height with a flat side profile.", lessons: 10, mins: 80, image: IMG.clinicLip, by: "Dr Tim Pearce", topics: ["Lip anatomy"], tags: ["New"] },
  { title: "Lip Correction & Dissolving", cat: "Lips & Perioral", level: "Advanced", blurb: "Hyaluronidase protocols and re-treatment planning.", lessons: 9, mins: 72, image: IMG.complications, by: "Dr Tim Pearce", topics: ["Complication management"], tags: [] },
  /* Anatomy */
  { title: "Functional Facial Anatomy", cat: "Anatomy", level: "Intermediate", blurb: "Layers, planes and danger zones every injector needs.", lessons: 14, mins: 120, image: IMG.cheek, by: "Dr Priya Shah", topics: ["Facial assessment"], tags: ["Recommended"] },
  { title: "Vascular Anatomy of the Face", cat: "Anatomy", level: "Intermediate", blurb: "Facial, angular and labial arteries mapped for filler.", lessons: 10, mins: 85, image: IMG.tearTrough, by: "Dr Priya Shah", topics: ["Vascular occlusion"], tags: ["Popular"] },
  { title: "Lip Anatomy Deep Dive", cat: "Anatomy", level: "Beginner", blurb: "Vermilion, philtrum, orbicularis oris and the labial arteries.", lessons: 8, mins: 64, image: IMG.eightD, by: "Dr Priya Shah", topics: ["Lip anatomy"], tags: ["New"] },
  { title: "Midface & Cheek Anatomy", cat: "Anatomy", level: "Intermediate", blurb: "Fat pads, ligaments and support for volumising.", lessons: 11, mins: 90, image: IMG.temple, by: "Dr Priya Shah", topics: ["Facial assessment"], tags: [] },
  { title: "Lower Face & Jawline Anatomy", cat: "Anatomy", level: "Intermediate", blurb: "Masseter, mandible and the marionette region.", lessons: 9, mins: 75, image: IMG.jawline, by: "Dr Priya Shah", topics: ["Marionette lines"], tags: [] },
  { title: "Periorbital Anatomy", cat: "Anatomy", level: "Advanced", blurb: "Tear trough, orbital rim and the infraorbital bundle.", lessons: 7, mins: 56, image: IMG.brow, by: "Dr Priya Shah", topics: ["Vascular occlusion"], tags: ["New"] },
  /* Safety */
  { title: "Complications Management", cat: "Safety", level: "Advanced", blurb: "Recognise, prevent and manage vascular and other complications.", lessons: 12, mins: 100, image: IMG.complications, by: "Dr Tim Pearce", topics: ["Complication management", "Vascular occlusion"], tags: ["Recommended", "Popular"] },
  { title: "Vascular Occlusion Protocol", cat: "Safety", level: "Advanced", blurb: "Spot the signs early and act on a rehearsed hyaluronidase plan.", lessons: 6, mins: 48, image: IMG.skin, by: "Dr Amir Khan", topics: ["Vascular occlusion", "Complication management"], tags: ["Popular"] },
  { title: "Safety & Injection Essentials", cat: "Safety", level: "Beginner", blurb: "Aseptic technique, aspiration and needle versus cannula.", lessons: 10, mins: 80, image: IMG.templeFiller, by: "Dr Amir Khan", topics: ["Cannula technique"], tags: ["Recommended"] },
  { title: "Cannula Technique Masterclass", cat: "Safety", level: "Intermediate", blurb: "Entry points, planes and depth control for safer filler.", lessons: 8, mins: 64, image: IMG.temple, by: "Dr Amir Khan", topics: ["Cannula technique"], tags: ["New"] },
  { title: "Emergency Kit & Protocols", cat: "Safety", level: "Beginner", blurb: "Build, check and drill your clinic's emergency response.", lessons: 5, mins: 40, image: IMG.rhino, by: "Dr Amir Khan", topics: ["Complication management"], tags: [] },
  { title: "Infection Control & Aftercare", cat: "Safety", level: "Beginner", blurb: "Prevent, recognise and treat infection and biofilm.", lessons: 7, mins: 56, image: IMG.skin, by: "Dr Amir Khan", topics: ["Aftercare"], tags: [] },
  /* Patient Journey */
  { title: "Consultation & Patient Assessment", cat: "Patient Journey", level: "Beginner", blurb: "Build trust and plan safe, effective treatments from the first visit.", lessons: 9, mins: 72, image: IMG.consult, by: "Sarah Collins", topics: ["Consent & consultation", "Facial assessment"], owned: true, pct: 20, tags: ["Recommended", "Popular"] },
  { title: "Consent & Documentation", cat: "Patient Journey", level: "Beginner", blurb: "Consent forms, cooling-off periods and record keeping.", lessons: 6, mins: 45, image: IMG.membership, by: "Sarah Collins", topics: ["Consent & consultation"], tags: [] },
  { title: "Facial Assessment & Treatment Planning", cat: "Patient Journey", level: "Intermediate", blurb: "Proportions, photography and a phased treatment plan.", lessons: 10, mins: 85, image: IMG.fullFace, by: "Sarah Collins", topics: ["Facial assessment", "Photography"], tags: ["New"] },
  { title: "Clinical Photography", cat: "Patient Journey", level: "Beginner", blurb: "Standardised before-and-afters that protect you and the patient.", lessons: 5, mins: 40, image: IMG.brow, by: "Miranda Pearce", topics: ["Photography"], tags: [] },
  { title: "Managing Expectations", cat: "Patient Journey", level: "Intermediate", blurb: "Difficult conversations, unhappy patients and the follow-up.", lessons: 7, mins: 56, image: IMG.marketing, by: "Miranda Pearce", topics: ["Consent & consultation"], tags: ["Popular"] },
  { title: "Aftercare & Review Visits", cat: "Patient Journey", level: "Beginner", blurb: "Aftercare scripts, review timing and patient retention.", lessons: 6, mins: 48, image: IMG.skin, by: "Sarah Collins", topics: ["Aftercare"], tags: [] },
  { title: "Pricing & Treatment Packages", cat: "Patient Journey", level: "Intermediate", blurb: "Package, price and present your treatments with confidence.", lessons: 6, mins: 50, image: IMG.marketing, by: "Miranda Pearce", topics: [], tags: ["New"] }
  ].map(function (c) { if (!c.slug) c.slug = P.slug(c.title); return c; });

  P.haystack = function (c) { return [c.title, c.cat, c.blurb, c.by].concat(c.topics || []).join(" ").toLowerCase(); };
  P.instructor = function (name) {
    for (var i = 0; i < P.INSTRUCTORS.length; i++) if (P.INSTRUCTORS[i].name === name) return P.INSTRUCTORS[i];
    return null;
  };
  /* progress for a catalogue card: the 8D curriculum reads the real store,
     the other enrolled course keeps its demo percentage. */
  P.catalogPct = function (c, done) {
    if (P.CURRICULA[c.slug]) { var r = P.resume(c.slug, done); return r ? r.pct : 0; }
    return c.pct || 0;
  };
  /* ---------------------------------------------------------------- free resources -- */
  /* Free Resources (user, 2026-09-16): the real free library from the live
     site, listed with the All Courses card design (AllCoursesMobile.html?free=1 /
     AllCoursesWeb.html?free=1). Only items marked Free there — the membership
     and completed Chin course cards are not resources. `image: null` renders
     the card's placeholder cover until the thumbnails are exported; `meta` is
     the card footer line. Survey answers are kept (pf-survey-answers) but no
     longer re-order this list — the user asked for the plain library only. */
  P.SURVEY_KEY = "pf-survey-answers";
  P.readSurvey = function () {
    try { var v = JSON.parse(localStorage.getItem(P.SURVEY_KEY) || "null"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  };
  P.FREE_RESOURCES = [
  { title: "How to Choose the Right Technique When Injecting", kind: "Video", meta: "Video", blurb: "Dr Tim walks through how to match technique to the patient in front of you, not the trend of the week.", by: "Dr Tim Pearce", image: null },
  { title: "The Dream Clinic Playbook", kind: "Video", meta: "Video", blurb: "Building a successful aesthetics clinic isn't about working harder. It's about designing the clinic you actually want to run.", by: "Dr Tim Pearce", image: null },
  { title: "Full Consultation, Live Reversal & Full Face Filler", kind: "Video", meta: "Video", blurb: "Access one of Dr Tim's members-only Technique Tuesday sessions: a full consultation, live reversal and full-face filler plan.", by: "Dr Tim Pearce", image: null },
  { title: "Diagnosing Complications: 7 Steps to Get Great Advice Fast", kind: "Guide", meta: "PDF guide", blurb: "This 7-step process will help you write a short but high-impact case summary that gets you useful advice quickly.", by: "Dr Tim Pearce", image: null },
  { title: "Aspirating Experiment Test Results", kind: "Guide", meta: "PDF guide", blurb: "Ever wondered how long it takes to get a positive aspirate? Dr Tim's bench results by needle and product.", by: "Dr Tim Pearce", image: null },
  { title: "Prepare BOTOX: Step-by-Step Guide", kind: "Guide", meta: "PDF guide", blurb: "Get ready to elevate your injection technique with our beautifully presented step-by-step preparation guide.", by: "Dr Tim Pearce", image: null },
  { title: "Lip Anatomy Lesson", kind: "Lesson", meta: "Lesson", blurb: "Explore the intricate world of lip anatomy and gain a deeper understanding of the structures you inject.", by: "Dr Tim Pearce", image: null },
  { title: "Botox Lesson Gummy Smile", kind: "Lesson", meta: "Lesson", blurb: "Discover everything you need to know about Botox and gummy smile: assessment, dosing and pitfalls.", by: "Dr Tim Pearce", image: null },
  { title: "5 Steps to Create a Successful Aesthetics Business", kind: "Guide", meta: "PDF guide", blurb: "Have you ever thought about starting your own aesthetics business? Start with these five steps.", by: "Dr Tim Pearce", image: null },
  { title: "Botox Lesson Hooded Eyes", kind: "Lesson", meta: "Lesson", blurb: "Delve into the nuances of clinical assessment, treatment considerations and technique for hooded eyes.", by: "Dr Tim Pearce", image: null },
  { title: "Bruising Checklist: Prevent & Minimise Bruises from Injections", kind: "Checklist", meta: "Checklist", blurb: "Although we all accept that causing a bruise from dermal filler is possible, most can be prevented.", by: "Dr Tim Pearce", image: null },
  { title: "Hyaluronidase Consent Form", kind: "Form", meta: "Consent form", blurb: "Have you had a client who is in need of a reversal following treatment? Use this consent form.", by: "Dr Tim Pearce", image: null },
  { title: "Guide to the Medical Model for Cosmetic Procedures", kind: "Guide", meta: "PDF guide", blurb: "Practising the medical model has been held up as a vital factor in all safe cosmetic practice. Here's what it means.", by: "Dr Tim Pearce", image: null },
  { title: "7 Locations on Instagram to Get Followers", kind: "Guide", meta: "PDF guide", blurb: "Instagram marketing guru Miranda Pearce shares inside secrets for aesthetic clinicians who want to grow.", by: "Dr Tim Pearce", image: null },
  { title: "How to Improve Needle Control when Injecting", kind: "Guide", meta: "PDF guide", blurb: "Needle control can be difficult to master. If your patient sees the needle shake, confidence goes with it.", by: "Dr Tim Pearce", image: null },
  { title: "Does COVID-19 Vaccine Cause Dermal Filler Reactions?", kind: "Guide", meta: "PDF guide", blurb: "Dr Tim surveyed 1,503 aesthetic clinicians to establish if they had seen filler reactions after vaccination.", by: "Dr Tim Pearce", image: null },
  { title: "You're Worth More Than the Price of 1ml", kind: "Guide", meta: "PDF guide", blurb: "It can be quite a vulnerable feeling when a potential patient asks you 'how much is 1ml?'. Here's how to answer.", by: "Dr Tim Pearce", image: null },
  { title: "How to Reduce Biological Age for Your Patients", kind: "Guide", meta: "PDF guide", blurb: "Discover how to reduce biological age for your patients with practical steps you can share in clinic.", by: "Dr Tim Pearce", image: null },
  { title: "Body Dysmorphia vs Modification Checklist", kind: "Checklist", meta: "Checklist", blurb: "Different techniques don't work universally for every patient. Success starts with knowing who you should treat.", by: "Dr Tim Pearce", image: null },
  { title: "Is It Safe to Treat? 5-Step Contraindication Checklist", kind: "Checklist", meta: "Checklist", blurb: "There are countless diseases and drugs your patients could present with. Run these five checks first.", by: "Dr Tim Pearce", image: null },
  { title: "How to Avoid Causing a Lateral Rectus Palsy from Botulinum Toxin", kind: "Guide", meta: "PDF guide", blurb: "This guide teaches you essential techniques to safely administer botulinum toxin around the orbit.", by: "Dr Tim Pearce", image: null },
  { title: "Technique Tuesday Case Study", kind: "Case study", meta: "Case study", blurb: "Full-face correction and restoration in a patient with low-placed Harmony, from assessment to result.", by: "Dr Tim Pearce", image: null },
  { title: "How Sugar Exacerbates Aging: A Guide for Clinicians", kind: "Guide", meta: "PDF guide", blurb: "Learn how to educate your patients on the effects of excessive sugar consumption on the skin.", by: "Dr Tim Pearce", image: null },
  { title: "Emergency Reversal Protocol", kind: "Protocol", meta: "Protocol sheet", blurb: "Hopefully you will not encounter many emergency reversal situations, but when you do, follow this.", by: "Dr Tim Pearce", image: null },
  { title: "Delayed Onset Nodules: Diagnosis, Treatment & Prevention", kind: "Guide", meta: "PDF guide", blurb: "Learn how to diagnose, treat and avoid delayed onset nodules caused by dermal filler.", by: "Dr Tim Pearce", image: null },
  { title: "Elective Filler Reversal Protocol", kind: "Protocol", meta: "Protocol sheet", blurb: "Having the necessary knowledge to be able to reverse dermal fillers when a patient asks is essential.", by: "Dr Tim Pearce", image: null },
  { title: "Does HRT Increase Cancer Risk? Guide for Clinicians", kind: "Guide", meta: "PDF guide", blurb: "Learn how to confidently discuss hormone replacement therapy with your patients using the evidence.", by: "Dr Tim Pearce", image: null },
  { title: "3 Time-Saving Hacks for Social Media", kind: "Guide", meta: "PDF guide", blurb: "One thing I've discovered over the past few years is that, if you want to grow, you need a system.", by: "Dr Tim Pearce", image: null },
  { title: "Common Needle & Cannula Choices for Lips", kind: "Guide", meta: "PDF guide", blurb: "If you're wondering which instrument you should choose based on filler viscosity, start here.", by: "Dr Tim Pearce", image: null },
  { title: "15 Easy Instagram Reels Ideas", kind: "Guide", meta: "PDF guide", blurb: "Instagram Reels are the biggest opportunity on Instagram right now. Fifteen ideas you can film today.", by: "Dr Tim Pearce", image: null },
  { title: "Periorbital Oedema Protocol", kind: "Protocol", meta: "Protocol sheet", blurb: "The tear trough area is one of the most likely to cause complications. A management protocol.", by: "Dr Tim Pearce", image: null },
  { title: "The 7 Deadly Hashtag Sins", kind: "Guide", meta: "PDF guide", blurb: "Have you ever thought about using Instagram to build your aesthetics business? Avoid these seven mistakes.", by: "Dr Tim Pearce", image: null },
  { title: "The Injector's Social Media Cheatsheet: 7 Post Types", kind: "Guide", meta: "PDF guide", blurb: "Why are some aesthetic clinicians killing it on social media and getting booked? They post these seven types.", by: "Dr Tim Pearce", image: null },
  { title: "The 13 Extra Risky Injection Areas: Facial Vessel Map", kind: "Facial map", meta: "Facial map", blurb: "We all know certain areas of the face hold more risk of causing a complication. Here are thirteen of them.", by: "Dr Tim Pearce", image: null },
  { title: "Lip Filler Aftercare", kind: "Guide", meta: "PDF guide", blurb: "Do you worry that some patients aren't following your aftercare advice? A hand-out that makes it stick.", by: "Dr Tim Pearce", image: null },
  { title: "Frequently Used Filler Volumes: Facial Map", kind: "Facial map", meta: "Facial map", blurb: "It can make you feel quite vulnerable when you've got the skill but not the numbers. Typical volumes by area.", by: "Dr Tim Pearce", image: null },
  { title: "Dermal Filler Complications: The Essential Guide", kind: "Guide", meta: "PDF guide", blurb: "In this essential guide, Dr Tim covers a range of complications that every injector should recognise.", by: "Dr Tim Pearce", image: null }
  ].map(function (c) { c.free = true; c.cat = "Free Resources"; c.lessons = 1; c.mins = 0; c.topics = []; c.slug = "free-" + P.slug(c.title); return c; });
})();
