/* ===========================================================================
   PROfinity — AI Coach focus engine ("find Katie's constraint")
   Plain script (no React) exposing window.PFCoachFocus. Loaded on both
   Profile pages (ProfileMobile.html + Profile.html) before the page bundle
   and before coach-focus-ui.compiled.js.

   Concept (APP Workstream 30/09/2026 + AI Coach research, Oct 2026):
     • "The goal doesn't dictate the content, the constraint dictates
       content" (Tim). The coach turns Katie's answers into ONE focus
       domain (a Prosperity Spiral pillar), explains why, and puts her at
       "the door": the course / free resource that opens that domain.
     • Rules pick, AI explains — the focus is a deterministic, testable rule
       (computeFocus below); Ava only explains it and coaches around it.
     • Layered "Get to know you": Layer A "Where you are now" is FREE for
       every member (Basic included) and is enough to find the focus. The 4
       pillar deep-dives, Dream & Vision and Personal Goals are Confidence+
       (Basic sees a preview + upgrade).

   Works with the Progression / Success Path (success-path.js): the coach is
   the entry point, the path is the track — see C.track().

   Storage — everything lives in the existing "pf-self-assessment" store
   (shared mobile ↔ web), under two new keys:
     whereNow       { answers:[idx…], status, completedAt }
     personalGoals  { answers:[text…], status, completedAt }
   Tier comes from the same "pf-subscription-tier" key every page reads;
   "free" (or unset) = Basic.
   =========================================================================== */
(function () {
  "use strict";
  var C = window.PFCoachFocus = window.PFCoachFocus || {};

  /* ------------------------------------------------------------- tiers --- */
  var TIER_KEY = "pf-subscription-tier";
  var TIER_LABEL = { free: "Basic", confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", inner: "Inner Circle" };
  var TIER_RANK = { free: 0, confidence: 1, mastery: 2, freedom: 3, inner: 4 };
  C.CONFIDENCE_PRICE = 97;

  /* ?tier=free|confidence|mastery on a Profile URL switches the preview tier
     (demo / design review convenience — same key the Membership pages set). */
  try {
    var qp = new URLSearchParams(window.location.search).get("tier");
    if (qp && TIER_RANK[qp] != null) {
      if (qp === "free") localStorage.removeItem(TIER_KEY); else localStorage.setItem(TIER_KEY, qp);
    }
  } catch (e) {}

  C.tier = function () {
    try { var t = localStorage.getItem(TIER_KEY); return t && TIER_RANK[t] != null ? t : "free"; } catch (e) { return "free"; }
  };
  C.tierLabel = function (t) { return TIER_LABEL[t || C.tier()] || "Basic"; };
  C.isPaid = function (t) { return (TIER_RANK[t || C.tier()] || 0) >= 1; };
  C.setPreviewTier = function (t) {
    try { if (t === "free") localStorage.removeItem(TIER_KEY); else localStorage.setItem(TIER_KEY, t); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent("pf:tier-changed", { detail: { tier: t } })); } catch (e) {}
  };
  C.upgradeUrl = function (web, from) {
    return "MembershipTier.html?highlight=confidence&from=" + encodeURIComponent(from || (web ? "Profile.html" : "ProfileMobile.html"));
  };

  /* ----------------------------------------------------- questionnaires --- */
  /* Layer A — "Where you are now". Ported from the live app's AI Coach
     onboarding (coach_profiles: stage, experience, patients/week, income
     stage, main goal, biggest blocker, least confident) so prototype and
     codebase share one knowledge base. ~2 minutes, every option written for
     an early-stage injector as much as an established owner. */
  C.LAYER_A = {
    key: "whereNow", label: "Where you are now", timeMin: 2, kind: "profile", free: true,
    sub: "Seven quick taps. Ava uses them to find what's holding you back right now — and the one place to start.",
    questions: [
      { id: "stage", q: "Which stage are you at in aesthetics?", opts: [
        "Just exploring aesthetics",
        "Training / a beginner injector",
        "Building it part-time",
        "Aesthetics is my full-time career"] },
      { id: "experience", q: "How long have you been injecting?", opts: [
        "Less than 6 months", "6–12 months", "1–2 years", "2–3 years", "3–5 years", "More than 5 years"] },
      { id: "patients", q: "Roughly how many patients do you treat a week?", opts: [
        "0–5", "6–10", "11–20", "21–40", "40+"] },
      { id: "income", q: "Roughly where is your aesthetics income today?", opts: [
        "Not earning yet", "Under £1k / month", "£1k–£5k / month", "£5k–£10k / month", "£10k–£25k / month", "£25k+ / month"] },
      { id: "goal", q: "What's your main goal right now?", opts: [
        "Get my first paying patients",
        "Feel more confident clinically",
        "Build consistent bookings",
        "Replace my employed income",
        "Become fully booked",
        "Scale my clinic / business"] },
      { id: "blocker", q: "What feels like your BIGGEST blocker right now?", opts: [
        "My confidence injecting",
        "Fear of complications",
        "Finding patients",
        "Social media",
        "Consultations",
        "Pricing",
        "Time management",
        "Growing the business"] },
      { id: "leastConfident", q: "Which area makes you feel LEAST confident?", opts: [
        "Complications",
        "Treatment planning",
        "Consultations",
        "Pricing conversations",
        "Social media / marketing",
        "Managing difficult patients"] }
    ]
  };

  /* Personal Goals — the five open reflections that used to sit in Edit
     Profile. Now their own questionnaire inside Get to know you
     (Confidence+). Non-scored; Ava reads them to personalise tone and plan. */
  C.PERSONAL_GOALS = {
    key: "personalGoals", label: "Personal Goals", timeMin: 4, kind: "text",
    sub: "A few honest reflections. There are no wrong answers — Ava uses them to shape your plan around what matters to you.",
    questions: [
      { q: "Why did you choose to become an aesthetic practitioner, and what's the impact you dream of making for your clients?" },
      { q: "What's the one thing in your business that keeps you up at night, and how would solving it change your life?" },
      { q: "Who or what inspires you to keep pushing forward in your business, even on the toughest days?" },
      { q: "If you could wave a magic wand and change one thing about running your practice, what would it be?" },
      { q: "What does success as an aesthetic practitioner look like for you?" }
    ]
  };

  /* Hub order — Layer A first (free, finds the focus), then the four pillar
     deep-dives, Dream & Vision, Personal Goals. Each is its own
     questionnaire. */
  C.ORDER = ["whereNow", "Marketing", "Sales", "Clinical Skills", "Business Systems", "dreamVision", "personalGoals"];
  C.PILLARS = ["Sales", "Marketing", "Clinical Skills", "Business Systems"];

  C.META = {
    whereNow: { blurb: "Your stage, goal and biggest blocker — Ava finds your focus", icon: "lucide:map-pin",
      unlocks: [] },
    Marketing: { blurb: "How you attract and convert new patients", icon: "lucide:megaphone",
      unlocks: ["A scored Marketing baseline on your Prosperity Spiral", "Ava compares it with your other pillars before choosing your focus", "Marketing targets matched to where you really are"] },
    Sales: { blurb: "Consultations, follow-up and closing the plan", icon: "lucide:handshake",
      unlocks: ["A scored Sales baseline on your Prosperity Spiral", "Ava spots whether consultations or follow-up is the real leak", "Sales targets and scripts matched to your answers"] },
    "Clinical Skills": { blurb: "Technique, safety and your treatment range", icon: "lucide:syringe",
      unlocks: ["A scored Clinical Skills baseline on your Prosperity Spiral", "Ava matches technique courses to your actual range", "Safety and confidence targets for your next cases"] },
    "Business Systems": { blurb: "Pricing, operations and financial tracking", icon: "lucide:settings-2",
      unlocks: ["A scored Business Systems baseline on your Prosperity Spiral", "Ava finds the system that frees the most time", "Pricing and operations targets that fit your clinic"] },
    dreamVision: { blurb: "Where you want your clinic to go — not scored", icon: "lucide:telescope",
      unlocks: ["Your Vision Profile archetype", "Ava keeps every recommendation pointed at your dream clinic", "A realistic first milestone towards it"] },
    personalGoals: { blurb: "Why you do this and what success means to you", icon: "lucide:heart-handshake",
      unlocks: ["Ava coaches in your words, not generic advice", "Your 'why' shows up in check-ins on tough weeks", "Your mentor sees what matters most to you"] }
  };

  /* Basic can open Layer A only. */
  C.isLocked = function (key, tier) { return key !== "whereNow" && !C.isPaid(tier); };

  /* ------------------------------------------------------ focus domains --- */
  C.DOMAINS = {
    "Clinical Skills": { icon: "lucide:syringe", color: "#0088de", soft: "#E6F3FC", text: "#00609E",
      line: "Confident, safe technique is what everything else is built on." },
    "Marketing": { icon: "lucide:megaphone", color: "#e7820a", soft: "#FDEEDD", text: "#9A4B00",
      line: "Your skills are ready — more of the right people need to see them." },
    "Sales": { icon: "lucide:handshake", color: "#C8362F", soft: "#FCE8E6", text: "#A8231D",
      line: "Patients are reaching you — the leak is in how enquiries become bookings." },
    "Business Systems": { icon: "lucide:settings-2", color: "#8A5303", soft: "#FCF4E4", text: "#8A5303",
      line: "You're busy — now the clinic needs to run on systems, not on you." }
  };

  var MILESTONES = {
    "Clinical Skills": {
      early: "Treat your first 10 patients confidently with one core technique",
      growing: "Add one new treatment area — safely and confidently",
      established: "Handle any complication calmly with a rehearsed protocol" },
    "Marketing": {
      early: "Book your first 5 paying patients from people who already know you",
      growing: "Fill 2 extra clinic days a month from consistent posting",
      established: "Build a predictable flow of new enquiries every week" },
    "Sales": {
      early: "Run your first 5 consultations with a simple, confident structure",
      growing: "Turn more consultations into booked treatment plans",
      established: "Lift your average treatment value with phased plans" },
    "Business Systems": {
      early: "Set your prices and track what you earn per treatment",
      growing: "Free up 4 hours a week with three simple systems",
      established: "Run the clinic on numbers, not guesswork" }
  };

  /* ------------------------------------------------------------- doors --- */
  /* The "door" Ava puts Katie in front of: one course (purchasable directly,
     even on Basic) + one free resource she can open today. Free items reuse
     daily-targets.js's free PDF library (same ids → same generated PDF).
     Course prices mirror learning-shared.js P.PRICES; the three marked
     (mock) are prototype placeholders until the catalogue is tagged. */
  var FREE = {
    "contraindication-checklist": { id: "contraindication-checklist", title: "Is It Safe to Treat? 5-Step Contraindication Checklist", pages: 3, blurb: "Run these five checks before every treatment." },
    "risky-areas-map": { id: "risky-areas-map", title: "The 13 Extra Risky Injection Areas: Facial Vessel Map", pages: 2, blurb: "Thirteen areas of the face that hold more risk of a complication." },
    "social-cheatsheet": { id: "social-cheatsheet", title: "The Injector's Social Media Cheatsheet: 7 Post Types", pages: 6, blurb: "The seven post types that get clinicians booked." },
    "reels-ideas": { id: "reels-ideas", title: "15 Easy Instagram Reels Ideas", pages: 5, blurb: "Fifteen Reels ideas you can film today." },
    "worth-more-1ml": { id: "worth-more-1ml", title: "You're Worth More Than the Price of 1ml", pages: 5, blurb: "How to answer 'how much is 1ml?' without undervaluing yourself." },
    "five-steps-business": { id: "five-steps-business", title: "5 Steps to Create a Successful Aesthetics Business", pages: 10, blurb: "Thinking about your own aesthetics business? Start with these five steps." }
  };
  var COURSES = {
    "safety-injection-essentials": { slug: "safety-injection-essentials", title: "Safety & Injection Essentials", price: 294, image: "assets/course-temple-filler.webp", blurb: "Aseptic technique, aspiration and needle versus cannula — the foundations every new injector needs.", lessons: 10 },
    "complications-management": { slug: "complications-management", title: "Complications Management", price: 450, image: "assets/course-complications.jpg", blurb: "Recognise, prevent and manage vascular and other complications.", lessons: 12, includedFrom: "mastery" },
    "dcam-2": { slug: "dcam-2", title: "DCAM 2.0 — Dream Customer Attraction Method", price: 497, mock: true, image: "assets/course-membership-banner.jpg", blurb: "Dr Tim's system for attracting the patients you actually want to treat.", lessons: 24 },
    "consultation-patient-assessment": { slug: "consultation-patient-assessment", title: "Consultation & Patient Assessment", price: 246, mock: true, image: "assets/course-consultation.jpg", blurb: "Build trust and plan safe, effective treatments from the first visit.", lessons: 9, includedFrom: "mastery" },
    "pricing-treatment-packages": { slug: "pricing-treatment-packages", title: "Pricing & Treatment Packages", price: 198, mock: true, image: "assets/course-membership-banner.jpg", blurb: "Package, price and present your treatments with confidence.", lessons: 6 }
  };
  var DOOR_MAP = {
    "Clinical Skills": { early: ["safety-injection-essentials", "contraindication-checklist"], growing: ["complications-management", "risky-areas-map"], established: ["complications-management", "risky-areas-map"] },
    "Marketing": { early: ["dcam-2", "social-cheatsheet"], growing: ["dcam-2", "reels-ideas"], established: ["dcam-2", "reels-ideas"] },
    "Sales": { early: ["consultation-patient-assessment", "worth-more-1ml"], growing: ["consultation-patient-assessment", "worth-more-1ml"], established: ["consultation-patient-assessment", "worth-more-1ml"] },
    "Business Systems": { early: ["pricing-treatment-packages", "five-steps-business"], growing: ["pricing-treatment-packages", "five-steps-business"], established: ["pricing-treatment-packages", "five-steps-business"] }
  };

  function readJSON(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  /* Owned = bought (pf-purchased-courses) or included in the tier. */
  function courseState(course, tier) {
    var bought = readJSON("pf-purchased-courses", []).indexOf(course.slug) !== -1;
    var S = window.PFLearnShared;
    var included = S && S.includedIn ? S.includedIn(course.slug, tier) :
      !!(course.includedFrom && (TIER_RANK[tier] || 0) >= (TIER_RANK[course.includedFrom] || 9));
    return { owned: bought || included, included: included, bought: bought };
  }

  function qs(o) { var p = new URLSearchParams(); Object.keys(o).forEach(function (k) { if (o[k] != null && o[k] !== "") p.set(k, o[k]); }); return p.toString(); }
  C.courseUrl = function (course, web) {
    return (web ? "CourseWeb.html?" : "CourseDetail.html?") + qs({ course: course.slug, title: course.title, price: course.price, from: "coach" });
  };
  C.checkoutUrl = function (course, web) {
    var base = { course: course.slug, title: course.title, price: course.price, instr: "Dr. Tim Pearce" };
    if (web) return "CourseCheckoutWeb.html?" + qs(Object.assign({}, base, { img: course.image, ret: "Profile.html" }));
    return "CourseCheckout.html?" + qs(Object.assign({}, base, { ret: "CourseDetail.html?" + qs({ course: course.slug, title: course.title, price: course.price }) }));
  };
  /* Free resource → generated PDF via daily-targets.js (falls back to the
     free library page when that script isn't loaded). */
  C.openFree = function (item, web) {
    var T = window.PFDailyTargets;
    if (T && T.downloadPdf) { T.downloadPdf(item); markFreeOpened(item.id); return true; }
    (window.pfGo || function (u) { window.location.href = u; })((web ? "AllCoursesWeb.html" : "AllCoursesMobile.html") + "?free=1");
    return false;
  };
  var FREE_OPENED_KEY = "pf-coach-free-opened";
  function markFreeOpened(id) {
    var list = readJSON(FREE_OPENED_KEY, []);
    if (list.indexOf(id) === -1) { list.push(id); try { localStorage.setItem(FREE_OPENED_KEY, JSON.stringify(list)); } catch (e) {} }
    try { window.dispatchEvent(new CustomEvent("pf:coach-focus", { detail: { reason: "free-opened", id: id } })); } catch (e) {}
  }
  C.freeOpened = function (id) { return readJSON(FREE_OPENED_KEY, []).indexOf(id) !== -1; };

  /* ------------------------------------------------------- the rules ---- */
  function ans(entry, id) {
    if (!entry || !entry.answers) return null;
    var idx = -1;
    C.LAYER_A.questions.forEach(function (q, i) { if (q.id === id) idx = i; });
    var a = idx === -1 ? null : entry.answers[idx];
    return a == null ? null : a;
  }
  function optText(id, i) {
    var q = C.LAYER_A.questions.filter(function (x) { return x.id === id; })[0];
    return q && i != null ? q.opts[i] : null;
  }

  /* Stage band: early (exploring / training / < 6 months), growing
     (part-time or under £5k a month), established (everything else). */
  function stageBand(a) {
    if (a.stage != null && a.stage <= 1) return "early";
    if (a.experience === 0) return "early";
    if (a.stage === 2 || (a.income != null && a.income <= 2)) return "growing";
    return "established";
  }

  var BLOCKER_DOMAIN = ["Clinical Skills", "Clinical Skills", "Marketing", "Marketing", "Sales", "Sales", "Business Systems", "Business Systems"];
  var LEAST_DOMAIN = ["Clinical Skills", "Clinical Skills", "Sales", "Sales", "Marketing", "Sales"];

  /* computeFocus(assessState) → null until Layer A is complete, else
     { domain, rule, reason, signals[], band, milestone, reframe, confirm,
       door:{course, free}, completedAt, checkInDue }.
     Rule order (documented for QA — "rules pick, AI explains"):
       1. Clinical gate — exploring/training, < 6 months injecting, or a
          clinical blocker (confidence injecting / fear of complications) or
          least-confident area (complications / treatment planning) → Clinical.
       2. Biggest blocker → its domain.
       3. (Confidence+ with pillar scores) if an assessed pillar scores ≥15
          points below the chosen focus, Ava asks ONE question before
          switching (confirm.alt). She never switches silently. */
  C.computeFocus = function (assessState, opts) {
    var entry = assessState && assessState.whereNow;
    if (!entry || entry.status !== "completed") return null;
    var a = {};
    C.LAYER_A.questions.forEach(function (q) { a[q.id] = ans(entry, q.id); });
    var band = stageBand(a);
    var domain, rule, signals = [];

    var clinicalBlocker = a.blocker === 0 || a.blocker === 1;
    var clinicalLeast = a.leastConfident === 0 || a.leastConfident === 1;
    if ((a.stage != null && a.stage <= 1) || a.experience === 0 || clinicalBlocker || clinicalLeast) {
      domain = "Clinical Skills"; rule = "clinical-gate";
      if (a.stage != null && a.stage <= 1) signals.push("you're " + (a.stage === 0 ? "just exploring aesthetics" : "still training as an injector"));
      else if (a.experience === 0) signals.push("you've been injecting for less than 6 months");
      if (clinicalBlocker) signals.push("your biggest blocker is " + (a.blocker === 0 ? "confidence injecting" : "fear of complications"));
      if (clinicalLeast) signals.push("you feel least confident with " + optText("leastConfident", a.leastConfident).toLowerCase());
    } else if (a.blocker != null) {
      domain = BLOCKER_DOMAIN[a.blocker]; rule = "blocker";
      signals.push("your biggest blocker is " + optText("blocker", a.blocker).toLowerCase());
      if (LEAST_DOMAIN[a.leastConfident] === domain) signals.push("you feel least confident with " + optText("leastConfident", a.leastConfident).toLowerCase());
    } else {
      domain = LEAST_DOMAIN[a.leastConfident] || "Clinical Skills"; rule = "least-confident";
      signals.push("you feel least confident with " + (optText("leastConfident", a.leastConfident) || "your technique").toLowerCase());
    }

    var reason = "You told Ava " + joinList(signals) + ". " + C.DOMAINS[domain].line;

    /* Realism (Ben's "day-2 injector, £2M clinic" concern): big goals are
       never rejected — Ava reframes them into the next 90-day milestone. */
    var milestone = MILESTONES[domain][band];
    var bigGoal = a.goal === 3 || a.goal === 4 || a.goal === 5;
    var reframe = bigGoal && band !== "established" ?
      "“" + optText("goal", a.goal) + "” is a brilliant destination. The fastest route there starts with one milestone: " + lowerFirst(milestone) + "." :
      "Your goal is where you're heading. Your focus is what's holding you back right now — fix that first and the goal gets closer.";

    /* Step 3 — only meaningful once pillar deep-dives exist (Confidence+). */
    var confirm = null;
    var scoreFn = opts && opts.pillarScore;
    if (scoreFn && C.isPaid(opts.tier)) {
      var focusScore = assessState[domain] && assessState[domain].status === "completed" ? scoreFn(domain, assessState) : null;
      var lowest = null;
      C.PILLARS.forEach(function (p) {
        if (p === domain || !(assessState[p] && assessState[p].status === "completed")) return;
        var s = scoreFn(p, assessState);
        if (!lowest || s < lowest.score) lowest = { key: p, score: s };
      });
      if (lowest && focusScore != null && focusScore - lowest.score >= 15) confirm = { alt: lowest.key, altScore: lowest.score, focusScore: focusScore };
    }

    var pick = DOOR_MAP[domain][band];
    var course = COURSES[pick[0]], free = FREE[pick[1]];
    var tier = (opts && opts.tier) || C.tier();
    var cs = courseState(course, tier);
    var completedAt = entry.completedAt || Date.now();
    return {
      domain: domain, rule: rule, reason: reason, signals: signals, band: band,
      milestone: milestone, reframe: reframe, confirm: confirm,
      goalText: optText("goal", a.goal), stageText: optText("stage", a.stage),
      door: { course: Object.assign({}, course, cs), free: Object.assign({}, free, { opened: C.freeOpened(free.id) }) },
      completedAt: completedAt,
      checkInDue: completedAt + 30 * 86400000
    };
  };

  /* ---------------------------------------------------- progression track -- */
  /* The AI Coach is the entry point (finds the focus, opens the door); the
     Progression / Success Path is where Katie then tracks her own growth.
     Only the Clinical Skills path exists today (8D Lip Design, success-path.js);
     other focuses show "coming soon" and the door course is the track.
     Tier rule (Oct 2026): Basic sees a locked preview of the Free Starter
     Path, Confidence+ track it for real. */
  C.PATHS = {
    "Clinical Skills": { slug: "8d-lip-design", title: "8D Lip Design", levels: 5, skills: 19,
      starterTitle: "Free Starter Path · Safe Lips", starterSkills: 5 }
  };
  C.pathHubUrl = function (path, web, extra) {
    return (web ? "SuccessPathWeb.html" : "SuccessPath.html") + "?course=" + path.slug + (extra ? "&" + extra : "");
  };
  C.track = function (focus, tier) {
    if (!focus) return null;
    var path = C.PATHS[focus.domain];
    if (!path) return { domain: focus.domain, comingSoon: true };
    var paid = C.isPaid(tier);
    var P = window.PFSuccessPath, prog = null;
    try {
      var s = P && P.compute ? P.compute(path.slug) : null;
      if (s) prog = { done: s.done, total: s.total, earned: s.earned, level: s.current ? s.current.level : path.levels, levelTitle: s.current ? s.current.title : "Path complete", ready: s.ready || 0 };
    } catch (e) {}
    return { domain: focus.domain, path: path, locked: !paid, progress: paid ? prog : null };
  };

  /* Reassessment loop (Phase 1, no auto-detection): check in with Ava 30
     days after the last answers, or sooner from the focus card. */
  C.checkInLabel = function (focus) {
    if (!focus) return "";
    var days = Math.ceil((focus.checkInDue - Date.now()) / 86400000);
    return days <= 0 ? "Check-in due — has your blocker changed?" : "Next check-in with Ava in " + days + " day" + (days === 1 ? "" : "s");
  };

  /* Prompt handed to Ava (paid) — carries the focus so the chat starts in
     context instead of from scratch. */
  C.avaPrompt = function (focus) {
    if (!focus) return "Help me work out what to focus on first.";
    return "My coach focus is " + focus.domain + " (" + focus.signals.join("; ") + "). My next milestone is: " + focus.milestone + ". Build me a plan for this week.";
  };

  function joinList(xs) {
    if (xs.length <= 1) return xs[0] || "";
    return xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
  }
  function lowerFirst(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
})();
