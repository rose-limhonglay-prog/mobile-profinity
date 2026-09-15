/* learning-courses-web.js — the member's course data for the WEB My Learning
   pages (MyLearning.html / learning.jsx and MyCoursesWeb.html / my-courses-web.jsx).
   One copy of the lists learning-mobile.jsx (LM2_MY_COURSES,
   LM2_MY_COURSES_CONFIDENCE, LM2_RELATED_POOL) and learning-confidence.jsx
   (LC_COURSE / LC_MODULE / LC_RELATED) keep, so phone and desktop always show
   the same courses. Plain JS, no JSX — loaded after learning-store-web.js and
   before the page bundle. window.PFLearnCourses */
(function () {
  const IMG = {
    lip: "assets/clinic-lip-design.png",
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
    advancedLip: "assets/course-advanced-lip-techniques.jpg",
    membership: "https://prncpjnraanretzdeuou.supabase.co/storage/v1/object/public/course-content/courses/profinity-membership/poster.jpg"
  };
  const CERT_THUMB = "assets/certificate-thumb.svg";
  const TUTOR = "Dr Tim Pearce";

  const slugify = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  /* progress / lesson / modulesLeft are the per-course resume data
     (learning-mobile.jsx:79-101). `lesson` is 1-based; the resume deep link
     opens level 0 · module 0 · lesson (lesson - 1). */
  function course(o) {
    const c = Object.assign({ slug: slugify(o.title), resume: { level: 0, module: 0 } }, o);
    c.inProgress = typeof c.progress === "number" && !c.completed;
    if (c.completed && c.certificate && !c.certificate.image) c.certificate.image = CERT_THUMB;
    return c;
  }

  const MY_COURSES = [
    course({ image: IMG.eightDLip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of lip anatomy for deeper learning.", progress: 20, lesson: 4, modulesLeft: 6 }),
    course({ image: IMG.templeFiller, level: "Advanced", title: "Temple Filler", description: "Master safe injection techniques with anatomical precision.", progress: 45, lesson: 6, modulesLeft: 4 }),
    course({ image: IMG.protox, level: "Advanced", title: "Protox Course", description: "Elevate your botulinum toxin skills and refine your technique.", completed: true, certificate: { issuedDate: "12 Jun 2026", id: "PF-PTX-2201" } }),
    course({ image: IMG.browLift, level: "Intermediate", title: "Brow Lift Training", description: "Learn expert techniques for achieving flawless, natural brow lifts.", progress: 10, lesson: 2, modulesLeft: 7 }),
    course({ image: IMG.fullFace, level: "Advanced", title: "Full-Face Rejuvenation Protocol", description: "A complete framework for combination treatments across the face." }),
    course({ image: IMG.cheekContouring, level: "Intermediate", title: "Cheek & Midface Contouring", description: "Master volumising techniques for natural-looking cheek definition." }),
    course({ image: IMG.rhinoplasty, level: "Advanced", title: "Non-Surgical Rhinoplasty", description: "Reshape and refine the nose using dermal filler with confidence." }),
    course({ image: IMG.jawlineSculpting, level: "Advanced", title: "Jawline Sculpting Masterclass", description: "Define and balance the lower face with precision filler technique." }),
    course({ image: IMG.tearTrough, level: "Advanced", title: "Tear Trough Correction", description: "Safely treat under-eye hollowing with anatomically-guided technique." }),
    course({ image: IMG.skinBoosters, level: "Beginner", title: "Skin Boosters & Hydration Therapy", description: "Introduce biorevitalisation treatments to improve skin quality." }),
    course({ image: IMG.complications, level: "Advanced", title: "Complications Management", description: "Recognise, prevent and manage vascular and other complications." }),
    course({ image: IMG.consultation, level: "Beginner", title: "Consultation & Patient Assessment", description: "Build trust and plan safe, effective treatments from the first visit.", completed: true, certificate: { issuedDate: "03 Feb 2026", id: "PF-CPA-1187" } })
  ];

  /* Confidence tier only sees the courses included in that membership. */
  const MY_COURSES_CONFIDENCE = [
    course({ image: IMG.membership, level: "Beginner", title: "Profinity Membership", description: "Your welcome course — get the most out of your Confidence membership." }),
    course({ image: IMG.eightDLip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of lip anatomy for deeper learning.", progress: 20, lesson: 4, modulesLeft: 6 }),
    course({ image: IMG.templeFiller, level: "Advanced", title: "Temple Filler", description: "Master safe injection techniques with anatomical precision." })
  ];

  function coursesForTier(tier) { return tier === "confidence" ? MY_COURSES_CONFIDENCE : MY_COURSES; }

  /* Paid related courses under My Courses. Three unbought ones are always on
     offer — bought slugs (pf-purchased-courses) drop out and the next in the
     pool backfills. Prices match PFLearn.PRICES. */
  const RELATED_POOL = [
    { title: "Functional Anatomy", level: "Intermediate", lessons: 14, dur: "2h 00m", category: "Anatomy", blurb: "The structures that shape the lip line.", image: IMG.eightDLip, price: 198 },
    { title: "Treatment Approaches", level: "Intermediate", lessons: 10, dur: "1h 25m", category: "Patient Journey", blurb: "Evidence-based strategies for natural outcomes.", image: IMG.consultation, price: 246 },
    { title: "Safety & Injection Essentials", level: "Beginner", lessons: 12, dur: "1h 40m", category: "Safety", blurb: "Protect your patients. Protect your practice.", image: IMG.complications, price: 294 },
    { title: "Cheek Contouring", level: "Advanced", lessons: 9, dur: "1h 15m", category: "Midface", blurb: "Restore midface volume with balanced, natural lift.", image: IMG.cheekContouring, price: 246 },
    { title: "Jawline Sculpting", level: "Advanced", lessons: 11, dur: "1h 30m", category: "Lower face", blurb: "Define and strengthen the lower face with precision.", image: IMG.jawlineSculpting, price: 294 },
    { title: "Tear Trough Treatment", level: "Advanced", lessons: 8, dur: "1h 05m", category: "Periorbital", blurb: "Refresh tired eyes safely in a delicate area.", image: IMG.tearTrough, price: 342 }
  ].map((r) => Object.assign({ slug: slugify(r.title) }, r));
  const RELATED_VISIBLE = 3;
  function relatedFor(purchased) {
    purchased = purchased || [];
    return RELATED_POOL.filter((r) => purchased.indexOf(r.slug) === -1).slice(0, RELATED_VISIBLE);
  }

  /* "How this page works" help sheet copy (learning-mobile.jsx LM2_HOWITWORKS) */
  const HOW_IT_WORKS = [
    { icon: "lucide:target", title: "Your goal", body: "This is the clinic and income you're building towards — not where you are today. Everything on this page is chosen to move you closer to it." },
    { icon: "lucide:trophy", title: "Progress", body: "A single 0–100 score for the one area we think matters most for your goal right now." },
    { icon: "lucide:list-checks", title: "Today's targets", body: "A short daily checklist of small actions. Tick them off as you go — they're picked to build momentum on your goal." },
    { icon: "lucide:route", title: "Next best courses", body: "Your courses in the order that gets you to your goal fastest, not just the order you enrolled in them." },
    { icon: "lucide:sparkles", title: "Ava", body: "Your AI coach. Ask her anything about your goal, your targets, or what to do next — she knows your progress." }
  ];

  /* ---- Confidence-tier dashboard (learning-confidence.jsx) ---- */
  /* Only the current module's lessons are listed. `key` is the lesson name the
     reader writes to pf-lessons-done; `base` marks lessons finished in earlier
     sessions ("4 of 5 completed" baseline). Course-level "28 of 39" =
     doneBeforeThisModule + this module's completed rows. */
  const CONFIDENCE_COURSE = {
    slug: "8d-lip-design",
    title: "8D Lip Design",
    still: IMG.fullFace,
    totalLessons: 39,
    doneBeforeThisModule: 24
  };
  const CONFIDENCE_MODULE = {
    eyebrow: "Module 3 · Lip Anatomy",
    name: "Assessment",
    level: 0,
    section: 0,
    lessons: [
      { name: "The Aesthetic Impact", mins: 6, key: "Lip anatomy essentials", base: true },
      { name: "Emotional Impact", mins: 4, key: "Vascular landmarks of the lip", base: true },
      { name: "Patient Perspective", mins: 5, key: "Assessing lip proportions", base: true },
      { name: "Practitioner Perspective", mins: 5, key: "Photographing the lips for assessment", base: true },
      { name: "Aesthetic Impact in Practice", mins: 8, key: "Assessment checklist walkthrough" }
    ]
  };
  const lessonDone = (l, done) => !!l.base || (done || []).indexOf(l.key) !== -1;

  /* Related courses on the Confidence dashboard. Temple Filler carries no
     price: it is part of the Confidence membership. */
  const CONFIDENCE_RELATED = [
    { title: "Temple Filler", level: "Advanced", lessons: 14, image: IMG.templeFiller, blurb: "Master safe injection techniques with anatomical precision." },
    { title: "Advanced Lip Techniques", level: "Advanced", lessons: 18, price: 342, image: IMG.advancedLip, blurb: "Build on 8D with layered volume, borders and perioral balance." },
    { title: "Complications Management", level: "Advanced", lessons: 12, price: 450, image: IMG.complications, blurb: "Recognise, prevent and manage vascular and other complications." }
  ].map((r) => Object.assign({ slug: slugify(r.title) }, r));

  window.PFLearnCourses = { IMG, CERT_THUMB, TUTOR, slugify, MY_COURSES, MY_COURSES_CONFIDENCE, coursesForTier,
    RELATED_POOL, RELATED_VISIBLE, relatedFor, HOW_IT_WORKS,
    CONFIDENCE_COURSE, CONFIDENCE_MODULE, CONFIDENCE_RELATED, lessonDone };
})();
