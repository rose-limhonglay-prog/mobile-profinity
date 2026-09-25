/* ===========================================================================
   PROfinity — Feed Quiz engine (plain JS, no React)
   The question pool behind the random knowledge-check posts the newsfeed
   scatters through itself (see planFeedQuizzes / FeedQuizPost in app.jsx).
   Every question is tagged with the course + lesson it is drawn from —
   either an existing course quiz ("course") or a new one written by Dr Tim
   ("tim") or Alicia from the Profinity team ("alicia") — so the card can
   route the member somewhere useful once they've answered:

     owns course  + correct →  points, CTA to finish that course's quiz
     owns course  + wrong   →  suggest revisiting the lesson it came from
     no course    + correct →  points, upsell to buy the course
     no course    + wrong   →  upsell to buy the course

   Answers are remembered in localStorage ("pf-feed-quiz") so a question
   already answered correctly earns no further points when it comes round
   again (the card still works, it just says so). Course ownership defers to
   PFLearnShared (tier-included lists + pf-purchased-courses) when that
   module is on the page and falls back to a local copy of the same rules.

   The pool is admin-editable: Admin · Loyalty & Gamification · Quiz
   Questions (AdminQuizEditor.html) saves its list to localStorage
   ("pf-feed-quiz-pool"), which replaces DEFAULT_QUESTIONS wholesale on the
   next load. `active: false` hides a question without deleting it and
   `points` overrides POINTS per question. The same page edits the Business
   Survey (the "Let's personalise" onboarding wizard in survey.jsx) through
   "pf-business-survey".

   window.PFQuizEngine = { QUESTIONS, DEFAULT_QUESTIONS, COURSES, POINTS, pick,
     byKey, pointsFor, ownsCourse, isKnown, markAnswered, readAnswered,
     scenario, courseUrl, courseFor, getQuestions, setQuestions,
     upsertQuestion, deleteQuestion, resetQuestions, isCustomPool,
     getSurvey, setSurvey, resetSurvey, DEFAULT_SURVEY }.
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-feed-quiz";
  var POINTS = 100;

  /* ---------------------------------------------------------------- courses -- */
  /* Slug + display data for every course a question can point at. `price`
     is only the fallback when PFLearnShared.PRICES has no entry; ownership
     through the membership tier comes from INCLUDED below / PFLearnShared. */
  var COURSES = {
    "8d-lip-design":                { title: "8D Lip Design", price: 342, lessons: 39, image: "assets/course-8d-lip-design.jpg", curriculum: true },
    "tear-trough-treatment":        { title: "Tear Trough Treatment", price: 342, lessons: 7, image: "assets/course-tear-trough.jpg" },
    "jawline-sculpting":            { title: "Jawline Sculpting", price: 294, lessons: 9, image: "assets/course-jawline-sculpting.jpg" },
    "vascular-occlusion-protocol":  { title: "Vascular Occlusion Protocol", price: 198, lessons: 6, image: "assets/course-complications.jpg" },
    "protox-course":                { title: "Protox", price: 246, lessons: 10, image: "assets/course-protox.png" },
    "full-face-rejuvenation-protocol": { title: "Full Face Rejuvenation Protocol", price: 342, lessons: 12, image: "assets/course-full-face-rejuvenation.jpg" },
    "temple-filler":                { title: "Temple Filler", price: 342, lessons: 14, image: "assets/course-temple-filler.webp" },
    "complications-management":     { title: "Complications Management", price: 450, lessons: 12, image: "assets/course-complications.jpg" },
    "safety-injection-essentials":  { title: "Safety & Injection Essentials", price: 294, lessons: 10, image: "assets/course-temple.png" },
    "lip-flip-with-toxin":          { title: "Lip Flip with Toxin", price: 150, lessons: 6, image: "assets/course-lip.png" },
    "consent-documentation":        { title: "Consent & Documentation", price: 150, lessons: 6, image: "assets/course-consultation.jpg" },
    "aftercare-review-visits":      { title: "Aftercare & Review Visits", price: 150, lessons: 6, image: "assets/course-skin-boosters.jpg" }
  };

  /* Mirror of PFLearnShared.INCLUDED — used only when that module isn't loaded. */
  var INCLUDED = {};
  INCLUDED.confidence = ["profinity-membership", "8d-lip-design", "temple-filler"];
  INCLUDED.mastery = INCLUDED.confidence.concat([
    "protox-course", "brow-lift-training", "full-face-rejuvenation-protocol", "cheek-midface-contouring",
    "non-surgical-rhinoplasty", "jawline-sculpting-masterclass", "tear-trough-correction",
    "skin-boosters-hydration-therapy", "complications-management", "consultation-patient-assessment"]);
  INCLUDED.freedom = INCLUDED.mastery;
  INCLUDED.inner = INCLUDED.mastery;

  /* ---------------------------------------------------------------- questions -- */
  /* source: "course" (lifted from that course's own quiz), "tim" (new, from
     Dr Tim), "alicia" (new, from Alicia). `topic` is the short hook the post
     body leads with; `lesson` is where the answer is taught. */
  var DEFAULT_QUESTIONS = [
    { key: "tt-danger-zone", source: "course", topic: "tear trough danger zones", course: "tear-trough-treatment", lesson: "Danger zones of the tear trough",
      question: "Which facial danger zone carries the highest risk of vascular occlusion during tear trough filler injection?",
      options: [
        { label: "Angular artery, medial canthus region", correct: true },
        { label: "Superficial temporal artery" },
        { label: "Facial artery, nasolabial fold" },
        { label: "Supratrochlear artery" }],
      likes: "980", comments: "64", shares: "22",
      chat: "Got it right first try — this danger zone comes up constantly in the masterclass Q&A!" },
    { key: "mental-nerve", source: "course", topic: "quick one on nerve anatomy", course: "jawline-sculpting", lesson: "Nerves of the lower face",
      question: "Which nerve exits at the mental foramen and must be avoided when injecting the chin and jawline?",
      options: [
        { label: "Mental nerve", correct: true },
        { label: "Marginal mandibular nerve" },
        { label: "Buccal nerve" },
        { label: "Zygomatic nerve" }],
      likes: "742", comments: "51", shares: "18",
      chat: "Mixed up the mental and marginal mandibular nerves for years — this one's a great reminder!" },
    { key: "vo-first-step", source: "course", topic: "safety first", course: "vascular-occlusion-protocol", lesson: "The first five minutes",
      question: "What is the recommended first step if you suspect a vascular occlusion during filler injection?",
      options: [
        { label: "Stop injecting immediately and assess", correct: true },
        { label: "Massage the area vigorously" },
        { label: "Apply ice only and continue" },
        { label: "Wait 24 hours to see if it resolves" }],
      likes: "1.1K", comments: "88", shares: "34",
      chat: "This is drilled into us every masterclass and it still saves lives — stop first, always." },
    { key: "toxin-mechanism", source: "course", topic: "toxin mechanism basics", course: "protox-course", lesson: "How botulinum toxin works",
      question: "Botulinum toxin type A works by blocking release of which neurotransmitter at the neuromuscular junction?",
      options: [
        { label: "Acetylcholine", correct: true },
        { label: "Dopamine" },
        { label: "Serotonin" },
        { label: "GABA" }],
      likes: "890", comments: "42", shares: "15",
      chat: "Good refresher — the mechanism question always comes up in patient consults too." },
    { key: "tt-cannula-plane", source: "course", topic: "cannula technique", course: "tear-trough-treatment", lesson: "Cannula planes under the eye",
      question: "Which layer should a cannula typically stay within to minimise risk when treating the tear trough?",
      options: [
        { label: "Supraperiosteal plane", correct: true },
        { label: "Intradermal layer" },
        { label: "Subdermal fat only" },
        { label: "Intramuscular plane" }],
      likes: "1.3K", comments: "76", shares: "29",
      chat: "Staying supraperiosteal changed my tear trough results overnight." },
    { key: "liquid-facelift", source: "course", topic: "full-face planning", course: "full-face-rejuvenation-protocol", lesson: "Planning the liquid facelift",
      question: "In the “liquid facelift” concept, which combination of areas is most commonly addressed?",
      options: [
        { label: "Cheek, jawline, chin and temples", correct: true },
        { label: "Only the lips" },
        { label: "Only the forehead" },
        { label: "Only under-eye" }],
      likes: "965", comments: "58", shares: "21",
      chat: "Treating all four together is what actually gives that natural lift." },
    { key: "toxin-onset", source: "course", topic: "patient expectations", course: "protox-course", lesson: "Setting expectations at consult",
      question: "What is the typical onset time for a visible botulinum toxin effect?",
      options: [
        { label: "3–14 days", correct: true },
        { label: "Immediately" },
        { label: "6 months" },
        { label: "24 hours guaranteed" }],
      likes: "1.5K", comments: "94", shares: "37",
      chat: "Setting this expectation upfront saves so many anxious follow-up messages!" },
    { key: "temple-danger", source: "course", topic: "temple danger zones", course: "temple-filler", lesson: "Temple anatomy and danger zones",
      question: "Which structure is the key danger zone when injecting the temporal region?",
      options: [
        { label: "Superficial temporal artery / frontal branch of facial nerve", correct: true },
        { label: "Angular artery" },
        { label: "Supratrochlear artery" },
        { label: "Facial vein only" }],
      likes: "812", comments: "47", shares: "16",
      chat: "The temple is so underestimated as a danger zone — great question." },
    { key: "hyaluronidase", source: "course", topic: "reversal agents", course: "complications-management", lesson: "Hyaluronidase: when and how much",
      question: "Hyaluronidase is used to?",
      options: [
        { label: "Dissolve hyaluronic acid filler", correct: true },
        { label: "Numb the skin" },
        { label: "Reverse botulinum toxin" },
        { label: "Increase filler longevity" }],
      likes: "1.2K", comments: "70", shares: "25",
      chat: "Every clinic should keep this stocked and know the dosing cold." },
    { key: "contraindication", source: "course", topic: "contraindications", course: "safety-injection-essentials", lesson: "Day-of-treatment screening",
      question: "Which patient factor is a contraindication to elective filler treatment on the day?",
      options: [
        { label: "Active infection at the injection site", correct: true },
        { label: "Being over 40" },
        { label: "Having had filler before" },
        { label: "Mild seasonal allergies" }],
      likes: "930", comments: "53", shares: "19",
      chat: "Always reschedule for active infection — not worth the risk." },
    { key: "labial-artery", source: "course", topic: "lip anatomy", course: "8d-lip-design", lesson: "Lip Anatomy · The labial arteries",
      question: "For lip filler, which vessel is the primary danger zone clinicians must map before injecting?",
      options: [
        { label: "Labial artery", correct: true },
        { label: "Facial vein" },
        { label: "Superficial temporal artery" },
        { label: "Supratrochlear artery" }],
      likes: "1.4K", comments: "81", shares: "30",
      chat: "Mapping the labial artery chairside before every lip case, no exceptions." },

    /* ---- new from Dr Tim ---- */
    { key: "tim-lip-ratio", source: "tim", topic: "lip proportions", course: "8d-lip-design", lesson: "Lip Anatomy · Assessing proportions",
      question: "When planning lip volume in 8D Lip Design, which upper-to-lower lip ratio is the usual starting point for a natural result?",
      options: [
        { label: "1 : 1.6 (upper smaller than lower)", correct: true },
        { label: "1 : 1 (equal)" },
        { label: "2 : 1 (upper larger)" },
        { label: "Whatever the patient asks for" }],
      likes: "1.7K", comments: "112", shares: "44",
      chat: "The 1:1.6 starting point stops so many over-filled upper lips. Great one, Tim." },
    { key: "tim-aspiration", source: "tim", topic: "aspiration", course: "safety-injection-essentials", lesson: "Aspiration: what the bench tests showed",
      question: "From my aspiration bench tests — roughly how long should you hold the plunger back before a negative aspirate means anything?",
      options: [
        { label: "5–10 seconds", correct: true },
        { label: "Under 1 second" },
        { label: "30 seconds or more" },
        { label: "Aspiration isn't needed with a needle" }],
      likes: "1.9K", comments: "134", shares: "61",
      chat: "I used to pull back for a split second and call it clear. Never again." },
    { key: "tim-lip-flip", source: "tim", topic: "the lip flip", course: "lip-flip-with-toxin", lesson: "Placing the micro-doses",
      question: "In a toxin lip flip, where do the micro-doses go?",
      options: [
        { label: "Superficially into orbicularis oris along the vermilion border", correct: true },
        { label: "Deep into the philtral columns" },
        { label: "Into the depressor anguli oris only" },
        { label: "Intradermally across the whole upper lip" }],
      likes: "1.3K", comments: "79", shares: "35",
      chat: "Superficial and along the border — deeper than that and you've got a straw problem." },

    /* ---- new from Alicia ---- */
    { key: "alicia-cooling-off", source: "alicia", topic: "consent and cooling-off", course: "consent-documentation", lesson: "Cooling-off periods",
      question: "For a new patient, what should sit between the consultation and their first filler treatment?",
      options: [
        { label: "A documented cooling-off period", correct: true },
        { label: "Nothing — treat on the day if they're keen" },
        { label: "A deposit only" },
        { label: "A social media follow" }],
      likes: "860", comments: "49", shares: "20",
      chat: "The cooling-off conversation is also where the best patients decide to trust you." },
    { key: "alicia-consent-content", source: "alicia", topic: "what consent must cover", course: "consent-documentation", lesson: "What a valid consent records",
      question: "Which of these must always be recorded in the consent process before filler?",
      options: [
        { label: "Risks, alternatives and the option not to treat", correct: true },
        { label: "The patient's Instagram handle" },
        { label: "Only the product batch number" },
        { label: "The price they were quoted" }],
      likes: "790", comments: "38", shares: "17",
      chat: "\"The option not to treat\" is the line most consent forms forget." },
    { key: "alicia-review-visit", source: "alicia", topic: "review visits", course: "aftercare-review-visits", lesson: "Timing the review",
      question: "When should the first review visit after lip filler usually be booked?",
      options: [
        { label: "Around 2 weeks after treatment", correct: true },
        { label: "The next morning" },
        { label: "6 months later" },
        { label: "Only if the patient complains" }],
      likes: "910", comments: "57", shares: "23",
      chat: "Two weeks — swelling's down and you can actually see what you made." }
  ];

  /* ---------------------------------------------------------------- pool -- */
  /* QUESTIONS is mutated in place (never reassigned) so anything holding the
     array — app.jsx's planFeedQuizzes, the admin editor — always sees the
     current pool; BY_KEY is rebuilt alongside it. */
  var POOL_KEY = "pf-feed-quiz-pool";
  var QUESTIONS = [];
  var BY_KEY = {};
  function cloneQ(q) { return JSON.parse(JSON.stringify(q)); }
  function readPool() {
    try {
      var o = JSON.parse(localStorage.getItem(POOL_KEY));
      return o && Array.isArray(o.questions) ? o.questions : null;
    } catch (e) { return null; }
  }
  function loadPool(list) {
    QUESTIONS.length = 0;
    BY_KEY = {};
    (list || []).forEach(function (q) {
      if (!q || !q.key) return;
      if (!Array.isArray(q.options)) q.options = [];
      QUESTIONS.push(q); BY_KEY[q.key] = q;
    });
    return QUESTIONS;
  }
  loadPool(readPool() || DEFAULT_QUESTIONS.map(cloneQ));
  function emitPool() {
    try { window.dispatchEvent(new CustomEvent("pf:feed-quiz-pool", { detail: { count: QUESTIONS.length } })); } catch (e) {}
  }
  function writePool(list) {
    try { localStorage.setItem(POOL_KEY, JSON.stringify({ questions: list, savedAt: Date.now() })); } catch (e) {}
    loadPool(list);
    emitPool();
    return getQuestions();
  }
  function getQuestions() { return QUESTIONS.map(cloneQ); }
  function setQuestions(list) { return writePool((list || []).map(cloneQ)); }
  /* Merge `patch` into the question with that key, or append it as new. */
  function upsertQuestion(patch) {
    if (!patch || !patch.key) return getQuestions();
    var list = getQuestions();
    var found = false;
    list = list.map(function (q) {
      if (q.key !== patch.key) return q;
      found = true;
      var merged = {};
      Object.keys(q).forEach(function (k) { merged[k] = q[k]; });
      Object.keys(patch).forEach(function (k) { merged[k] = patch[k]; });
      return merged;
    });
    if (!found) list.push(cloneQ(patch));
    return writePool(list);
  }
  function deleteQuestion(key) {
    return writePool(getQuestions().filter(function (q) { return q.key !== key; }));
  }
  function resetQuestions() {
    try { localStorage.removeItem(POOL_KEY); } catch (e) {}
    loadPool(DEFAULT_QUESTIONS.map(cloneQ));
    emitPool();
    return getQuestions();
  }
  function isCustomPool() { return readPool() !== null; }
  /* Per-question override of the global POINTS. */
  function pointsFor(q) {
    var p = Number(q && q.points);
    return p > 0 ? Math.round(p) : POINTS;
  }

  /* ---------------------------------------------------------------- survey -- */
  /* The Business Survey: the 10-step "Let's personalise your experience"
     onboarding wizard (survey.jsx reads the same key directly, so its shells
     don't need this file). No right or wrong answers — every option is a
     self-report. */
  var SURVEY_KEY = "pf-business-survey";
  var DEFAULT_SURVEY = {
    title: "Let's personalise your experience",
    sub: "Help us tailor content and connections that matter most to you.",
    questions: [
      { q: "Which stage are you currently at in aesthetics?",
        opts: ["Just exploring aesthetics", "Training / beginner injector", "Building part-time", "Full-time injector", "Clinic owner"] },
      { q: "How long have you worked in aesthetics?",
        opts: ["Less than 6 months", "6–12 months", "1–2 years", "2–3 years", "3–5 years"] },
      { q: "What best describes your current work situation?",
        opts: ["Aesthetics is my full-time career", "I balance aesthetics alongside another job", "I'm transitioning into full-time aesthetics", "I'm still training and not earning yet"] },
      { q: "Approximately how many hours per week do you spend working in aesthetics?",
        opts: ["Less than 5 hours", "5–10 hours", "10–20 hours", "20–30 hours", "30+ hours"] },
      { q: "Roughly how many patients do you currently treat per week?",
        opts: ["0–5", "6–10", "11–20", "21–40", "40+"] },
      { q: "Roughly what stage is your aesthetics income currently at?",
        opts: ["Not earning yet", "Under £1k/month", "£1k–£5k/month", "£5k–£10k/month", "£10k–£25k/month"] },
      { q: "What's your MAIN goal right now?",
        opts: ["Get my first paying clients", "Become more confident clinically", "Build consistent bookings", "Replace employed income", "Become fully booked"] },
      { q: "What currently feels like your BIGGEST blocker?",
        opts: ["Confidence", "Finding clients", "Social media", "Pricing", "Consultations"] },
      { q: "Which area currently makes you feel LEAST confident?",
        opts: ["Complications", "Finding clients", "Consultations", "Pricing conversations", "Social media / marketing"] },
      { q: "Which type of content helps you MOST?",
        opts: ["Short tutorials", "Full masterclasses", "Live Q&As", "Case breakdowns", "Business training"] }
    ]
  };
  function validSurvey(sv) {
    return !!(sv && Array.isArray(sv.questions) && sv.questions.length &&
      sv.questions.every(function (x) { return x && typeof x.q === "string" && Array.isArray(x.opts); }));
  }
  function getSurvey() {
    try {
      var sv = JSON.parse(localStorage.getItem(SURVEY_KEY));
      if (validSurvey(sv)) return sv;
    } catch (e) {}
    return cloneQ(DEFAULT_SURVEY);
  }
  function setSurvey(sv) {
    sv = cloneQ(sv || DEFAULT_SURVEY);
    try { localStorage.setItem(SURVEY_KEY, JSON.stringify(sv)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent("pf:business-survey", { detail: { count: (sv.questions || []).length } })); } catch (e) {}
    return getSurvey();
  }
  function resetSurvey() {
    try { localStorage.removeItem(SURVEY_KEY); } catch (e) {}
    return getSurvey();
  }
  function isCustomSurvey() {
    try { return validSurvey(JSON.parse(localStorage.getItem(SURVEY_KEY))); } catch (e) { return false; }
  }

  /* ---------------------------------------------------------------- store -- */
  function readAnswered() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY));
      return o && typeof o === "object" ? o : {};
    } catch (e) { return {}; }
  }
  function writeAnswered(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  /* "Known" = answered correctly before: that's the case that earns nothing
     the second time round. A question answered wrong stays worth points. */
  function isKnown(key) {
    var e = readAnswered()[key];
    return !!(e && e.correct);
  }
  function markAnswered(key, correct) {
    var o = readAnswered();
    var prev = o[key] || {};
    o[key] = { correct: !!(prev.correct || correct), last: correct ? "correct" : "wrong", at: Date.now(), tries: (prev.tries || 0) + 1 };
    writeAnswered(o);
    try { window.dispatchEvent(new CustomEvent("pf:feed-quiz-answered", { detail: { key: key, correct: !!correct } })); } catch (e) {}
    return o[key];
  }

  /* ---------------------------------------------------------------- picking -- */
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  /* `n` distinct questions, unanswered ones first so a member keeps seeing
     fresh material; already-known questions back-fill once the pool runs dry. */
  function pick(n, exclude) {
    n = n || 2;
    exclude = exclude || [];
    var fresh = [], known = [];
    QUESTIONS.forEach(function (q) {
      if (q.active === false) return;
      if (exclude.indexOf(q.key) !== -1) return;
      if (!q.options || q.options.length < 2 || !q.options.some(function (o) { return o && o.correct; })) return;
      (isKnown(q.key) ? known : fresh).push(q);
    });
    return shuffle(fresh).concat(shuffle(known)).slice(0, n);
  }

  /* ---------------------------------------------------------------- courses -- */
  function readTier() {
    try { return localStorage.getItem("pf-subscription-tier") || "free"; } catch (e) { return "free"; }
  }
  function readPurchased() {
    try {
      var arr = JSON.parse(localStorage.getItem("pf-purchased-courses"));
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function ownsCourse(slug) {
    var L = window.PFLearnShared;
    if (L && L.isOwned) { try { return !!L.isOwned(slug); } catch (e) {} }
    var tier = readTier();
    if (tier !== "free" && (INCLUDED[tier] || []).indexOf(slug) !== -1) return true;
    return readPurchased().indexOf(slug) !== -1;
  }
  function priceFor(slug) {
    var L = window.PFLearnShared;
    var c = COURSES[slug] || {};
    if (L && L.PRICES && L.PRICES[slug]) return L.PRICES[slug];
    return c.price || 0;
  }
  function courseFor(q) {
    var c = COURSES[q.course] || { title: "the course", price: 0 };
    return { slug: q.course, title: c.title, price: priceFor(q.course), curriculum: !!c.curriculum, owned: ownsCourse(q.course),
      lesson: q.lesson, image: c.image || null, lessons: c.lessons || 0 };
  }
  /* Where each CTA lands. `surface` is "mobile" (the PF_EMBED shells) or
     "web". Owned courses open straight into the course page (its quiz sits at
     the end of the success path); unowned ones open the same page in its
     paywalled state, which carries the Buy flow into checkout. */
  function courseUrl(q, surface, intent) {
    var c = courseFor(q);
    var web = surface === "web";
    var page = web ? "CourseWeb.html" : "CourseDetail.html";
    var p = new URLSearchParams();
    if (c.curriculum || web) p.set("course", c.slug);
    if (!c.curriculum) {
      p.set("title", c.title);
      p.set("instr", "Dr Tim Pearce");
      p.set("pct", "0");
      if (!c.owned) p.set("price", String(c.price));
    }
    if (intent) p.set("from", "feed-quiz-" + intent);
    return page + "?" + p.toString();
  }

  /* ---------------------------------------------------------------- scenarios -- */
  function money(n) { return "£" + Number(n || 0).toLocaleString("en-GB"); }
  /* The four designed post-answer states (+ the "known" variant of the
     correct ones, which pays nothing). Returns { kind, tone, title, chip,
     body, course, cta: { label, href }, points } — `course` is the tile the
     card shows (thumbnail, title, lesson, eyebrow + meta line). */
  function scenario(q, correct, opts) {
    opts = opts || {};
    var c = courseFor(q);
    var known = opts.known != null ? !!opts.known : isKnown(q.key);
    var surface = opts.surface || (window.PF_EMBED ? "mobile" : "web");
    var pts = pointsFor(q);
    var points = correct && !known ? pts : 0;
    var lessonsTxt = c.lessons ? c.lessons + " lessons" : "";
    var tile = {
      title: c.title, lesson: q.lesson || "", image: c.image, owned: c.owned, price: c.price,
      eyebrow: c.owned ? "In your library" : "From the course",
      meta: c.owned ? lessonsTxt : [money(c.price), lessonsTxt].filter(Boolean).join(" · ")
    };
    var chip = correct ? (known ? { kind: "known", label: "No extra points" } : { kind: "points", label: "+" + pts + " pts" }) : null;
    if (c.owned && correct) {
      return {
        kind: "owned-correct", tone: "success", points: points, chip: chip, course: tile,
        title: known ? "Correct — you knew this one" : "Correct!",
        body: known ? "Solid recall. Finish the course quiz to lock it in and earn your certificate."
                    : "You're clearly getting through this course. Finish its quiz to lock it in and earn your certificate.",
        cta: { label: "Complete the course quiz", href: courseUrl(q, surface, "quiz") }
      };
    }
    if (c.owned && !correct) {
      return {
        kind: "owned-wrong", tone: "error", points: 0, chip: null, course: tile,
        title: "Not quite",
        body: "The correct answer is highlighted above. It's taught in the lesson below — worth a five-minute revisit before the final quiz.",
        cta: { label: "Revisit the lesson", href: courseUrl(q, surface, "revisit") }
      };
    }
    if (correct) {
      return {
        kind: "upsell-correct", tone: "success", points: points, chip: chip, course: tile,
        title: known ? "Correct — you knew this one" : "Correct!",
        body: (known ? "Nice recall. " : "Good instinct. ") + "This course turns it into a repeatable technique, with the full success path quiz at the end.",
        cta: { label: "Get the course · " + money(c.price), href: courseUrl(q, surface, "buy") }
      };
    }
    return {
      kind: "upsell-wrong", tone: "error", points: 0, chip: null, course: tile,
      title: "Not quite",
      body: "The correct answer is highlighted above. This course covers exactly this, so you'll never second-guess it chairside.",
      cta: { label: "Get the course · " + money(c.price), href: courseUrl(q, surface, "buy") }
    };
  }

  window.PFQuizEngine = {
    KEY: KEY, POOL_KEY: POOL_KEY, SURVEY_KEY: SURVEY_KEY, POINTS: POINTS,
    QUESTIONS: QUESTIONS, DEFAULT_QUESTIONS: DEFAULT_QUESTIONS, COURSES: COURSES,
    pick: pick, byKey: function (k) { return BY_KEY[k] || null; }, pointsFor: pointsFor,
    ownsCourse: ownsCourse, courseFor: courseFor, courseUrl: courseUrl,
    isKnown: isKnown, markAnswered: markAnswered, readAnswered: readAnswered,
    scenario: scenario,
    getQuestions: getQuestions, setQuestions: setQuestions, upsertQuestion: upsertQuestion,
    deleteQuestion: deleteQuestion, resetQuestions: resetQuestions, isCustomPool: isCustomPool,
    DEFAULT_SURVEY: DEFAULT_SURVEY, getSurvey: getSurvey, setSurvey: setSurvey,
    resetSurvey: resetSurvey, isCustomSurvey: isCustomSurvey
  };
})();
