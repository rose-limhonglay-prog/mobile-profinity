/* ===========================================================================
   PROfinity — shared course data for the WEB course + lesson pages
   (CourseWeb.html / course-web.jsx and LessonWeb.html / lesson-web.jsx).

   One copy of the course trees, catalogue and pure helpers so both bundles
   agree on lesson names (completion is name-keyed in pf-lessons-done and
   shared with the phone). The trees, resources, related courses, comments,
   share contacts and quiz are copied verbatim from the mobile reader
   (lesson-confidence.jsx) — the data model is the lesson-confidence shape:
   levels → sections → lessons / subs → lessons.

   Plain JS (no JSX), loaded after learning-store-web.js (window.PFLearn) and
   before each page bundle. window.PFCourseData
   =========================================================================== */
(function () {
  "use strict";
  var PFLearn = window.PFLearn;

  var ME = { name: "Katy", fullName: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
  var INSTRUCTOR = {
    name: "Dr Tim Pearce",
    role: "Clinical Director · PROfinity Academy",
    avatar: "assets/avatar-drtim.png",
    bio: "Medical Doctor · Leading Aesthetic Clinician & Educator · Clinical Director · Longevity Advocate"
  };
  var VIDEO_SRC = "assets/sample-reel.mp4";

  /* ---------------------------------------------------------------- course trees -- */
  var COURSE_8D = {
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

  var SCREENING = [
  "Take a comprehensive medical history (bleeding disorders, neuromuscular diseases, medications).",
  "Screen for contraindications (pregnancy, active infections, known hypersensitivities).",
  "Assess psychological readiness and set realistic expectations."];

  var COURSE_TOXIN = {
    slug: "toxin-battle",
    title: "Toxin Battle with Julie Bass Kaplan",
    still: "assets/course-complications.jpg",
    levels: [
    {
      title: "Level 1", open: true,
      sections: [
      { name: "Diagnosis", free: true,
        desc: "How to diagnose, treat and most of all understand how to avoid Eyelid Ptosis from Botox treatment.",
        bullets: SCREENING,
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

  var COURSES = { "8d-lip-design": COURSE_8D, "toxin-battle": COURSE_TOXIN };
  /* The web pages used to ship a mislabelled "8d-lips" course (toxin material
     under a lips title). Old links keep resolving — to the real 8D Lip Design. */
  var ALIASES = { "8d-lips": "8d-lip-design", "8d-lip": "8d-lip-design", "toxin": "toxin-battle" };
  function resolveSlug(slug) { return ALIASES[slug] || slug; }

  /* Any other course arrives as ?course=<slug>&title=&instr=&dur= (course cards
     on My Learning / All courses, related-course cards, checkout). Build a
     generic success path for it so the page never 404s to the default course. */
  var STILLS = [
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
  function stillFor(title) {
    for (var i = 0; i < STILLS.length; i++) if (STILLS[i][0].test(title)) return STILLS[i][1];
    return "assets/course-consultation.jpg";
  }
  function titleFromSlug(slug) {
    return String(slug || "Course").split("-").map(function (w) { return w ? w.charAt(0).toUpperCase() + w.slice(1) : w; }).join(" ");
  }
  function buildGenericCourse(params, slugHint) {
    var title = params.get("title") || titleFromSlug(slugHint);
    var instr = params.get("instr") || "Dr Tim Pearce";
    var dur = params.get("dur") || "45m";
    var lower = title.toLowerCase();
    return {
      slug: slugHint || PFLearn.slugify(title),
      title: title,
      generic: true,
      instr: instr,
      dur: dur,
      still: params.get("image") || params.get("img") || stillFor(title),
      levels: [
      { title: "Level 1", open: true,
        sections: [
        { name: "Getting Started", free: true,
          desc: "Foundations you need before your first " + lower + " patient — a focused " + dur + " path with " + instr + ", filled with practical protocols and real clinic scenarios.",
          bullets: SCREENING,
          lessons: [
          { name: "Orientation", dur: "3:04" },
          { name: "Core Technique Walkthrough", dur: "2:14" },
          { name: "Common Pitfalls to Avoid", dur: "5:24" }] }] },
      /* every level is open and listed up front so a buyer can see the whole
         course before paying — no "Unlocks when…" rows */
      { title: "Level 2", open: true,
        sections: [
        { name: "Core Technique",
          desc: "Anatomy, product choice and the " + lower + " technique itself, demonstrated step by step on a real patient.",
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

  /* ?course=<slug> (bespoke, or an alias) → the tree; ?course=<slug>&title=…
     or plain ?title=… → a generic course; nothing → 8D Lip Design. The
     returned object is a fresh copy carrying price (after membership +
     ?price= override), dur and the instructor. */
  function resolveCourse(params) {
    params = params || new URLSearchParams(window.location.search);
    var raw = params.get("course");
    var slug = raw ? resolveSlug(raw) : null;
    var base;
    if (slug && COURSES[slug]) base = COURSES[slug];
    else if (params.get("title") || slug) base = buildGenericCourse(params, slug);
    else base = COURSE_8D;
    var course = Object.assign({}, base);
    course.price = PFLearn.price(course.slug, params.get("price"));
    course.dur = params.get("dur") || course.dur || null;
    course.instr = course.instr || INSTRUCTOR.name;
    course.bespoke = !!COURSES[course.slug];
    return course;
  }

  /* ---------------------------------------------------------------- catalogue -- */
  var RESOURCES = [
  { name: "Lip anatomy reference chart.pdf", size: "1.8 MB" },
  { name: "Lip assessment checklist.pdf", size: "240 KB" },
  { name: "Lip filler consent form template.pdf", size: "120 KB" }];

  /* These are courses — route to the course page, never to a lesson index. */
  var RELATED = [
  { title: "Temple Filler", lessons: 12, dur: "1h 40m", image: "assets/course-temple-filler.webp", price: PFLearn.PRICES["temple-filler"] },
  { title: "Profinity Membership", lessons: 6, dur: "45m", image: "assets/course-membership-banner.jpg", price: PFLearn.PRICES["profinity-membership"] }];

  var DEFAULT_COMMENTS = [
  { author: { name: "Dr. Maya Chen" }, time: "2h ago", likes: 4,
    text: "Great breakdown of the anatomy. I've found that a quick review of the patient's history before the procedure makes all the difference." },
  { author: { name: "Dr. Jordan Lee" }, time: "5h ago", likes: 2,
    text: "The vascular landmarks section is super helpful. Does anyone have tips for spotting a superficial labial artery on the first consult?" },
  { author: { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" }, time: "1d ago", likes: 7,
    text: "Bookmarking this for our next team training session — clear and concise!" }];

  /* "Send in Messages" rail — ids match messages-mobile.jsx threads */
  var SHARE_CONTACTS = [
  { id: "tim", name: "Dr Tim", avatar: "assets/avatar-drtim.png" },
  { id: "miranda", name: "Miranda", avatar: "assets/avatar-miranda.jpg" },
  { id: "sarahc", name: "Dr Sarah", avatar: "assets/avatar-sarah-collins.jpg" },
  { id: "amir", name: "Dr Amir", avatar: "assets/avatar-amir-khan.jpg" },
  { id: "mark", name: "Mark", avatar: "assets/avatar-mark-ellis.jpg" },
  { id: "beth", name: "Beth", avatar: "assets/avatar-nurse-beth.jpg" },
  { id: "priya", name: "Priya", avatar: "assets/avatar-priya-shah.jpg" }];

  var QUIZ = [
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

  var INCLUDED = [
  { icon: "lucide:book-open", text: "Full course access" },
  { icon: "lucide:award", text: "Certificate on completion" },
  { icon: "lucide:clipboard-check", text: "Success path quiz" },
  { icon: "lucide:refresh-cw", text: "Lifetime access & future updates" }];

  /* ---------------------------------------------------------------- derived structure -- */
  /* Flatten every lesson (section lessons, then each sub-module) in reading
     order. Each item knows its group (section or sub-module) for "N of M". */
  function flatten(course) {
    var out = [];
    course.levels.forEach(function (level, li) {
      (level.sections || []).forEach(function (section, si) {
        section.lessons.forEach(function (l, ni) {
          out.push(Object.assign({}, l, { level: level, section: section, sub: null, li: li, si: si, subIdx: null, ni: ni, groupTotal: section.lessons.length, groupPos: ni + 1, flat: out.length }));
        });
        (section.subs || []).forEach(function (sub, ui) {
          sub.lessons.forEach(function (l, ni) {
            out.push(Object.assign({}, l, { level: level, section: section, sub: sub, li: li, si: si, subIdx: ui, ni: ni, groupTotal: sub.lessons.length, groupPos: ni + 1, flat: out.length }));
          });
        });
      });
    });
    return out;
  }

  function levelLessonNames(level) {
    var names = [];
    (level.sections || []).forEach(function (s) {
      s.lessons.forEach(function (l) { names.push(l.name); });
      (s.subs || []).forEach(function (sub) { sub.lessons.forEach(function (l) { names.push(l.name); }); });
    });
    return names;
  }

  function pct(names, done) {
    if (!names.length) return 0;
    var n = names.filter(function (nm) { return done.indexOf(nm) !== -1; }).length;
    return Math.round(n / names.length * 100);
  }

  /* Module numbering runs across the whole course (matches Module.html). */
  function eyebrow(item, course) {
    if (item.level.eyebrow) return item.level.eyebrow;
    var n = 0;
    for (var i = 0; i < item.li; i++) n += (course.levels[i].sections || []).length;
    return "Module " + (n + item.si + 1) + " · " + item.section.name;
  }

  function genericContent(item) {
    var where = item.sub ? item.sub.name : item.section.name;
    return {
      intro: item.intro || (item.name + " — part of " + where + ". Watch the demonstration, then pause and note the three things you'd do differently in your own clinic before moving on."),
      body: item.body || ("Dr Tim Pearce demonstrates " + item.name.toLowerCase() + " step by step, calling out the landmarks, depth and product choice as he goes."),
      points: item.points || ["Set-up, markings and product choice.", "The technique itself, with the safety checks at each step.", "Aftercare and what to tell the patient to expect."]
    };
  }

  /* Pages for the PDF reader — real content for the two named downloads, a
     generic three-pager for anything else marked kind: "pdf". */
  function pdfPages(item, course) {
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
    var c = genericContent(item);
    return [
    { heading: item.name.replace(/\s*\(PDF\)$/i, ""), sub: course.title, body: c.intro },
    { heading: "Key points", sub: item.sub ? item.sub.name : item.section.name, checks: c.points },
    { heading: "Checklist", sub: "Tick off in clinic", checks: ["Read before the session", "Discuss with your mentor", "File in the patient record"] }];
  }

  /* ---------------------------------------------------------------- URL helpers -- */
  /* Lesson position from the URL → flat index, or null.
       ?level=&module=&lesson=[&sub=]  — the mobile shape (CourseDetail/Module/SubModule/LearningMobile emit it)
       ?lesson=<flatIdx>               — the legacy web shape (no level/module on the URL) */
  function lessonIdxFromParams(flat, params) {
    params = params || new URLSearchParams(window.location.search);
    if (params.get("lesson") == null) return null;
    var mobileShape = params.get("level") != null || params.get("module") != null || params.get("sub") != null;
    if (!mobileShape) {
      var n = parseInt(params.get("lesson"), 10);
      return isNaN(n) || n < 0 || n >= flat.length ? null : n;
    }
    var li = Number(params.get("level") || 0), si = Number(params.get("module") || 0), ni = Number(params.get("lesson") || 0);
    var sub = params.get("sub") == null ? null : Number(params.get("sub"));
    for (var i = 0; i < flat.length; i++) {
      var l = flat[i];
      if (l.li === li && l.si === si && l.ni === ni && l.subIdx === sub) return i;
    }
    return null;
  }

  /* The ?course=&title=&price=&dur= tail that re-opens this exact course on
     either web page (generic courses need the title to rebuild their tree). */
  function courseParams(course) {
    var p = { course: course.slug };
    if (!COURSES[course.slug]) {
      p.title = course.title;
      if (course.dur) p.dur = course.dur;
      if (course.price) p.price = course.price;
    }
    return p;
  }
  function positionParams(item) {
    return { level: item.li, module: item.si, lesson: item.ni, sub: item.subIdx == null ? undefined : item.subIdx };
  }
  function courseUrl(course, extra) {
    return PFLearn.courseUrl(course.slug, Object.assign(courseParams(course), extra || {}));
  }
  function courseUrlAt(course, item, extra) {
    return PFLearn.courseUrl(course.slug, Object.assign(courseParams(course), positionParams(item), extra || {}));
  }
  function lessonUrl(course, item, extra) {
    var pos = positionParams(item);
    var cp = courseParams(course); delete cp.course;
    return PFLearn.lessonUrl(course.slug, Object.assign(pos, cp, extra || {}));
  }
  /* Related-course card → CourseWeb (generic unless it's one of the bespoke trees) */
  function relatedUrl(c, price) {
    var slug = PFLearn.slugify(c.title);
    if (COURSES[slug]) return PFLearn.courseUrl(slug);
    var extra = { title: c.title, instr: "Dr. Tim Pearce", dur: c.dur };
    if (price) extra.price = price;
    return PFLearn.courseUrl(slug, extra);
  }
  /* Checkout with a return pointer to the page that sent the buyer. */
  function checkoutUrl(course) {
    var ret;
    try {
      var u = new URL(window.location.href);
      u.searchParams.delete("share"); u.searchParams.delete("play");
      ret = u.pathname.split("/").pop() + u.search;
    } catch (e) { ret = "CourseWeb.html?" + new URLSearchParams(courseParams(course)).toString(); }
    return PFLearn.checkoutUrl({ slug: course.slug, title: course.title, price: course.price, instr: "Dr. Tim Pearce", img: course.still }, ret);
  }

  /* ---------------------------------------------------------------- misc -- */
  function fmtTime(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }
  function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(function () {});
    } catch (e) {}
  }
  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

  window.PFCourseData = {
    ME: ME, INSTRUCTOR: INSTRUCTOR, VIDEO_SRC: VIDEO_SRC,
    COURSES: COURSES, ALIASES: ALIASES, COURSE_8D: COURSE_8D, COURSE_TOXIN: COURSE_TOXIN, SCREENING: SCREENING,
    STILLS: STILLS, stillFor: stillFor, buildGenericCourse: buildGenericCourse, resolveSlug: resolveSlug, resolveCourse: resolveCourse,
    RESOURCES: RESOURCES, RELATED: RELATED, DEFAULT_COMMENTS: DEFAULT_COMMENTS, SHARE_CONTACTS: SHARE_CONTACTS, QUIZ: QUIZ, INCLUDED: INCLUDED,
    flatten: flatten, levelLessonNames: levelLessonNames, pct: pct, eyebrow: eyebrow, genericContent: genericContent, pdfPages: pdfPages,
    lessonIdxFromParams: lessonIdxFromParams, courseParams: courseParams, positionParams: positionParams,
    courseUrl: courseUrl, courseUrlAt: courseUrlAt, lessonUrl: lessonUrl, relatedUrl: relatedUrl, checkoutUrl: checkoutUrl,
    fmtTime: fmtTime, copyText: copyText, go: go
  };
})();
