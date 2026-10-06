/* ===========================================================================
   PROfinity — Success Path engine (plain JS, no JSX / build step)
   POC: the 8D Lip Design course success path (PRD · Success Path POC).

   Model
     Path       one per course (+ the Tier 1 "Free Starter Path", a view onto
                8D Milestone 1 so starter progress carries into the full path)
     Milestone  a proficiency level (M1 · Level 1 … M5 · Level 5). Achieved
                automatically when all of its activities are ticked.
     Activity   a self-declared "I can …" competency. LOCKED until every linked
                lesson is complete (pf-lessons-done, the same store the course
                pages use), then READY; Katie ticks it herself → DONE.
     Points     booked in the existing loyalty ledger (PFLoyalty.awardPoints):
                once per activity, once per milestone (one-time lock — an
                untick never claws back, a re-tick never re-awards).

   Storage (client-only simulation of the Supabase tables in the PRD)
     pf-sp-content-v1   admin overrides from AdminSuccessPaths.html
     pf-sp-state-v1     { [slug]: { ticks, ever, achieved, goal, seen } }
     pf-sp-view         "starter" → view 8D as a Tier 1 member without the
                        course (?sp=starter sets it, ?sp=full clears it)
   Events
     window "pf-sp-change" after every write (and cross-tab via storage).
   API: window.PFSuccessPath (see bottom).
   =========================================================================== */
(function () {
  "use strict";
  var CONTENT_KEY = "pf-sp-content-v1";
  var STATE_KEY = "pf-sp-state-v1";
  var VIEW_KEY = "pf-sp-view";
  var DONE_KEY = "pf-lessons-done";
  var EVT = "pf-sp-change";

  /* ------------------------------------------------------------- content -- */
  /* Sub-course = the live 8D module title (Staging: 20 modules, 34 lessons).
     lessons = the prototype's lesson names (completion keys) for the demo. */
  var EIGHT_D = {
    slug: "8d-lip-design",
    title: "8D Lip Design",
    kicker: "Success Path",
    domain: "Clinical Skills",
    blurb: "Five levels from reading the lip to delivering a full 8D case. Tick each skill the first time it's true in your clinic.",
    milestones: [
      { id: "M1", level: 1, title: "Read the lips", statement: "I assess the lip, its vessels and my patient's goals before I pick up a needle.", subStream: "Consultation", points: 150, starter: true },
      { id: "M2", level: 2, title: "Inject with a plan", statement: "I choose the technique for each zone and inject it safely.", subStream: "Injecting", points: 200 },
      { id: "M3", level: 3, title: "Perioral balance", statement: "I treat the lip in the context of the whole perioral area.", subStream: "Injecting", points: 250 },
      { id: "M4", level: 4, title: "Handle the unexpected", statement: "I screen, consent and choose product so complications rarely surprise me.", subStream: "Complications", points: 300 },
      { id: "M5", level: 5, title: "The 8D practitioner", statement: "I plan and deliver a full 8D case, and know when to say no.", subStream: "Injecting", points: 400 }
    ],
    activities: [
      { id: "A1.1", milestone: "M1", text: "I can map the five zones of the lip and explain how each responds to filler", subCourse: "Chapter 4: Lip Anatomy", points: 40, lessons: ["Lip anatomy essentials"] },
      { id: "A1.2", milestone: "M1", text: "I can trace the labial arteries and name my safe injection planes", subCourse: "Chapter 4: Lip Anatomy", points: 50, lessons: ["Vascular landmarks of the lip"] },
      { id: "A1.3", milestone: "M1", text: "I can assess proportions and projection, and spot existing over-fill", subCourse: "Chapter 3: Aesthetic Analysis", points: 40, lessons: ["Assessing lip proportions"] },
      { id: "A1.4", milestone: "M1", text: "I capture a standard lip photo set for every patient", subCourse: "Consultation Success Blueprint", points: 30, lessons: ["Photographing the lips for assessment"] },
      { id: "A1.5", milestone: "M1", text: "I establish my patient's goals before I plan any volume", subCourse: "Chapter 1: Establishing the Patient Goals", points: 40, lessons: ["Assessment checklist walkthrough"] },
      { id: "A2.1", milestone: "M2", text: "I follow the technical core (aspirate, slow flow, low volume) every time", subCourse: "Chapter 5: The Technical Core of Lip Injection", points: 50, lessons: ["Welcome & how to use this module", "Safety essentials (watch first)"] },
      { id: "A2.2", milestone: "M2", text: "I can shape the lip body at the right depth and plane", subCourse: "Sculpting", points: 40, lessons: ["Linear threading technique"] },
      { id: "A2.3", milestone: "M2", text: "I can lift and define the vermilion border with tenting", subCourse: "Tenting", points: 40, lessons: ["Tenting technique"] },
      { id: "A2.4", milestone: "M2", text: "I choose needle or cannula for each zone and can justify it", subCourse: "Cannula", points: 40, lessons: ["Cannula approach"] },
      { id: "A2.5", milestone: "M2", text: "I can plan a first treatment for thin lips and correct migrated filler", subCourse: "8D Lips Case Studies", points: 50, lessons: ["Case 1: thin lips, first treatment", "Case 2: correction of migrated filler"] },
      { id: "A3.1", milestone: "M3", text: "I can use toxin for a lip flip or gummy smile safely", subCourse: "Botulinum Toxin", points: 40, lessons: ["Botulinum Toxin Analysis", "3D Model – Botox Technique"] },
      { id: "A3.2", milestone: "M3", text: "I can restore an ageing lip without over-filling", subCourse: "Restoration", points: 40, lessons: ["Restoration Analysis", "3D Model – Restoration Technique"] },
      { id: "A3.3", milestone: "M3", text: "I can critique a lip result and say what I'd change", subCourse: "Chapter 6: Technique Critique", points: 40, lessons: ["Introduction – Technique Critique"] },
      { id: "A4.1", milestone: "M4", text: "I screen every patient for risk before I book them", subCourse: "Chapter 2: Establishing the Patient Risks", points: 40, lessons: ["Establishing the Patient Risks"] },
      { id: "A4.2", milestone: "M4", text: "I choose the right product and tools for the lip in front of me", subCourse: "Chapter 7: Material Science and Tools", points: 40, lessons: ["Material Science and Tools"] },
      { id: "A4.3", milestone: "M4", text: "I take consent that covers occlusion and what's normal after filler", subCourse: "Chapter 8: Decision Making and Consent", points: 50, lessons: ["Decision Making and Consent"] },
      { id: "A5.1", milestone: "M5", text: "I can build precise definition with the 4mm technique", subCourse: "4mm", points: 50, lessons: ["4mm Analysis"] },
      { id: "A5.2", milestone: "M5", text: "I can deliver a Russian lip when it's right, and say no when it isn't", subCourse: "Russian Lips", points: 50, lessons: ["Russian Lips Analysis"] },
      { id: "A5.3", milestone: "M5", text: "I can plan a full 8D case from proportion to volume", subCourse: "8D Lips Case Studies", points: 60, lessons: ["Patient 1 – Proportion & Symmetry", "Patient 2 – Volume & Projection", "Patient 4 – Proportion & Symmetry"] }
    ]
  };
  var DEFAULTS = { "8d-lip-design": EIGHT_D };

  /* Tier 1 "Most Incredible Free Gift" — a view onto 8D Milestone 1. */
  var STARTER = { slug: "starter-lips", title: "Free Starter Path · Safe Lips", source: "8d-lip-design", milestones: ["M1"],
    blurb: "Included with your Confidence membership. Five skills every lip injector needs — your progress carries into the full 8D path." };

  /* Coach suggestions may exceed entitlements — shown, but locked. */
  var SUGGESTED = [
    { slug: "complications-management", title: "Complications Management", why: "Level 4 is your quietest level — this path builds your complication reflexes.", tier: "Mastery", milestones: 4, activities: 14 }
  ];

  /* ---------------------------------------------------------- storage -- */
  function readJSON(k, fb) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? fb : v; } catch (e) { return fb; } }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function emit(detail) { try { window.dispatchEvent(new CustomEvent(EVT, { detail: detail || {} })); } catch (e) {} }
  function nowIso() { return new Date().toISOString(); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  (function viewFromUrl() {
    try {
      var q = new URLSearchParams(location.search).get("sp");
      if (q === "starter") sessionStorage.setItem(VIEW_KEY, "starter");
      if (q === "full") sessionStorage.removeItem(VIEW_KEY);
    } catch (e) {}
  })();

  function getContent(slug) {
    var base = DEFAULTS[slug];
    if (!base) return null;
    var o = readJSON(CONTENT_KEY, {}) || {};
    var c = clone(base);
    if (o[slug]) {
      if (Array.isArray(o[slug].milestones) && o[slug].milestones.length) c.milestones = o[slug].milestones;
      if (Array.isArray(o[slug].activities) && o[slug].activities.length) c.activities = o[slug].activities;
      c.updatedAt = o[slug].updatedAt || null;
      c.customised = true;
    }
    return c;
  }
  function setContent(slug, data) {
    var o = readJSON(CONTENT_KEY, {}) || {};
    o[slug] = { milestones: data.milestones, activities: data.activities, updatedAt: nowIso() };
    writeJSON(CONTENT_KEY, o); emit({ type: "content", slug: slug });
  }
  function resetContent(slug) { var o = readJSON(CONTENT_KEY, {}) || {}; delete o[slug]; writeJSON(CONTENT_KEY, o); emit({ type: "content", slug: slug }); }
  function getDefaults(slug) { return DEFAULTS[slug] ? clone(DEFAULTS[slug]) : null; }

  function allState() { return readJSON(STATE_KEY, {}) || {}; }
  function pathState(slug) {
    var s = allState()[slug] || {};
    return { ticks: s.ticks || {}, ever: s.ever || {}, achieved: s.achieved || {}, goal: s.goal || null, seen: s.seen || {}, unticked: s.unticked || {} };
  }
  function savePathState(slug, ps) { var a = allState(); a[slug] = ps; writeJSON(STATE_KEY, a); }
  function readDone() { var a = readJSON(DONE_KEY, []); return Array.isArray(a) ? a : []; }

  /* --------------------------------------------------------- entitlement -- */
  function view() { try { return sessionStorage.getItem(VIEW_KEY) === "starter" ? "starter" : "full"; } catch (e) { return "full"; } }
  function setView(v) { try { if (v === "starter") sessionStorage.setItem(VIEW_KEY, "starter"); else sessionStorage.removeItem(VIEW_KEY); } catch (e) {} emit({ type: "view" }); }
  function tier() { try { return window.PF_TIER || localStorage.getItem("pf-subscription-tier") || "free"; } catch (e) { return "free"; } }
  function entitled(slug, milestone) {
    if (view() !== "starter") return true;
    return !!(milestone && milestone.starter);
  }

  /* ------------------------------------------------------------ compute -- */
  function compute(slug, doneArg) {
    var c = getContent(slug);
    if (!c) return null;
    var done = doneArg || readDone();
    var ps = pathState(slug);
    var byM = {};
    c.milestones.forEach(function (m) { byM[m.id] = []; });
    var acts = c.activities.map(function (a) {
      var m = c.milestones.filter(function (x) { return x.id === a.milestone; })[0];
      var lessonsDone = (a.lessons || []).filter(function (n) { return done.indexOf(n) !== -1; }).length;
      var lessonsTotal = (a.lessons || []).length;
      var status = ps.ticks[a.id] ? "done" : !entitled(slug, m) ? "upgrade" : lessonsDone >= lessonsTotal ? "ready" : "locked";
      var r = Object.assign({}, a, { status: status, lessonsDone: lessonsDone, lessonsTotal: lessonsTotal, tickedAt: ps.ticks[a.id] || null, level: m ? m.level : null });
      if (byM[a.milestone]) byM[a.milestone].push(r);
      return r;
    });
    var ms = c.milestones.map(function (m) {
      var list = byM[m.id] || [];
      var d = list.filter(function (a) { return a.status === "done"; }).length;
      var ready = list.filter(function (a) { return a.status === "ready"; }).length;
      var achievedAt = ps.achieved[m.id] || null;
      var status = achievedAt ? "achieved" : !entitled(slug, m) ? "upgrade" : d > 0 ? "progress" : "open";
      return Object.assign({}, m, { activities: list, done: d, ready: ready, total: list.length, pct: list.length ? Math.round(d / list.length * 100) : 0, achievedAt: achievedAt, status: status });
    });
    var total = acts.length, doneN = acts.filter(function (a) { return a.status === "done"; }).length;
    var readyN = acts.filter(function (a) { return a.status === "ready"; }).length;
    var earned = 0;
    Object.keys(ps.ever).forEach(function (id) { var a = c.activities.filter(function (x) { return x.id === id; })[0]; if (a) earned += +a.points || 0; });
    Object.keys(ps.achieved).forEach(function (id) { var m = c.milestones.filter(function (x) { return x.id === id; })[0]; if (m) earned += +m.points || 0; });
    var possible = c.activities.reduce(function (s, a) { return s + (+a.points || 0); }, 0) + c.milestones.reduce(function (s, m) { return s + (+m.points || 0); }, 0);
    var current = ms.filter(function (m) { return m.status !== "achieved" && m.status !== "upgrade"; })[0] || null;
    var achievedN = ms.filter(function (m) { return m.status === "achieved"; }).length;
    var nextReady = acts.filter(function (a) { return a.status === "ready"; })[0] || null;
    var nextLocked = acts.filter(function (a) { return a.status === "locked"; })[0] || null;
    var goalM = ps.goal ? ms.filter(function (m) { return m.id === ps.goal.milestone; })[0] : null;
    return {
      slug: slug, title: c.title, kicker: c.kicker, blurb: c.blurb, domain: c.domain,
      milestones: ms, activities: acts, total: total, done: doneN, ready: readyN,
      pct: total ? Math.round(doneN / total * 100) : 0, earned: earned, possible: possible,
      achieved: achievedN, current: current, nextReady: nextReady, nextLocked: nextLocked,
      goal: ps.goal, goalMilestone: goalM, view: view(), seen: ps.seen
    };
  }
  function activitiesForLesson(slug, lessonName) {
    var s = compute(slug); if (!s) return [];
    return s.activities.filter(function (a) { return (a.lessons || []).indexOf(lessonName) !== -1; });
  }

  /* --------------------------------------------------------------- points -- */
  function book(amount, label, actionId) {
    if (!amount) return;
    try { if (window.PFLoyalty && window.PFLoyalty.awardPoints) window.PFLoyalty.awardPoints(amount, label, actionId); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: amount, label: label, actionId: actionId, booked: true, sound: actionId === "evt_sp_milestone" ? "none" : "correct" } })); } catch (e) {}
  }

  /* ----------------------------------------------------------------- tick -- */
  function tick(slug, actId, opts) {
    opts = opts || {};
    var s = compute(slug); if (!s) return { ok: false, reason: "No path" };
    var a = s.activities.filter(function (x) { return x.id === actId; })[0];
    if (!a) return { ok: false, reason: "Unknown activity" };
    if (a.status === "done") return { ok: true, already: true };
    if (a.status === "upgrade") return { ok: false, reason: "Upgrade to unlock this skill" };
    /* opts.force (journey card tick, 2026-10-07): the member's own call, no lesson gate */
    if (a.status !== "ready" && !opts.force) return { ok: false, reason: "Finish the linked lessons first" };
    var ps = pathState(slug);
    ps.ticks[actId] = nowIso();
    delete ps.unticked[actId];
    var first = !ps.ever[actId];
    if (first) ps.ever[actId] = ps.ticks[actId];
    var res = { ok: true, activity: a, points: first ? +a.points || 0 : 0, milestone: null };
    /* milestone achieved? */
    var m = s.milestones.filter(function (x) { return x.id === a.milestone; })[0];
    if (m && !ps.achieved[m.id]) {
      var all = m.activities.every(function (x) { return x.id === actId || !!ps.ticks[x.id]; });
      if (all) { ps.achieved[m.id] = nowIso(); res.milestone = m; }
    }
    savePathState(slug, ps);
    if (res.points) book(res.points, "Success Path · " + a.id + " ticked", "evt_sp_activity");
    if (res.milestone) {
      book(+res.milestone.points || 0, "Success Path · Level " + res.milestone.level + " achieved", "evt_sp_milestone");
      var after = compute(slug);
      if (!opts.deferCelebrate) setTimeout(function () { celebrate(slug, res.milestone, after); }, 450);
    }
    emit({ type: "tick", slug: slug, id: actId, milestone: res.milestone ? res.milestone.id : null });
    return res;
  }
  function untick(slug, actId) {
    var ps = pathState(slug);
    if (!ps.ticks[actId]) return { ok: false };
    delete ps.ticks[actId];      /* ever + achieved stay: immutable ledger, one-time lock */
    ps.unticked[actId] = nowIso(); /* member's choice: autoComplete leaves it alone */
    savePathState(slug, ps); emit({ type: "untick", slug: slug, id: actId });
    return { ok: true };
  }

  /* ----------------------------------------------------------------- goal -- */
  function setGoal(slug, milestoneId, date) {
    var ps = pathState(slug);
    ps.goal = { milestone: milestoneId, date: date || null, setAt: nowIso() };
    savePathState(slug, ps); emit({ type: "goal", slug: slug });
  }
  function clearGoal(slug) { var ps = pathState(slug); ps.goal = null; savePathState(slug, ps); emit({ type: "goal", slug: slug }); }
  function markSeen(slug, key) { var ps = pathState(slug); ps.seen[key] = nowIso(); savePathState(slug, ps); }

  /* AI Coach first (Oct 2026): the coach is the entry point. No focus yet →
     "find your focus"; a focus outside this path's domain → point at the
     door Ava picked rather than pushing an unrelated path. */
  function profileUrl(q) {
    var web = /Web\.html|MyLearning\.html|Profile\.html/.test(location.pathname) && !/ProfileMobile/.test(location.pathname);
    return (web ? "Profile.html" : "ProfileMobile.html") + "?assess=" + q;
  }
  function coachNudge(slug) {
    var as = readJSON("pf-self-assessment", {}) || {};
    var CF = window.PFCoachFocus;
    if (!as.whereNow || as.whereNow.status !== "completed")
      return { kind: "coach", title: "Let Ava find your focus", body: "2 minutes, free: tell Ava where you are now and she'll show you exactly where to start.", cta: "Find my focus", url: profileUrl("whereNow") };
    var c = getContent(slug);
    var f = CF && CF.computeFocus ? CF.computeFocus(as) : null;
    /* Basic can't track a path (Confidence feature) — keep pointing at the door. */
    if (f && (tier() === "free" || (c && c.domain && f.domain !== c.domain)))
      return { kind: "coach", title: "Your focus: " + f.domain, body: "Next 90 days: " + f.milestone + ". Ava has your first course and a free guide ready.", cta: "See my door", url: profileUrl("focus") };
    return null;
  }

  /* --------------------------------------------------------------- nudges -- */
  /* One source of copy for the banner, the push mock and the hub. Benefit-
     framed, never guilt. Activation → retention → ascension. */
  function nudge(slug) {
    slug = slug || "8d-lip-design";
    var s = compute(slug); if (!s) return null;
    var cn = coachNudge(slug); if (cn) return cn;
    var url = "SuccessPath.html?course=" + slug;
    if (s.view === "starter" && s.achieved >= 1)
      return { kind: "ascension", title: "Level 1 done — your next four levels are waiting", body: "Unlock the full 8D Lip Design path with Mastery. Your starter progress carries over.", cta: "See what's next", url: url };
    if (!s.goal)
      return { kind: "goal", title: "You're 50% more likely to succeed once you've set your goals", body: "Pick the 8D level you want to reach and when — it takes 10 seconds.", cta: "Set my goal", url: url + "&goal=1" };
    if (s.ready > 0)
      return { kind: "ready", title: s.ready === 1 ? "1 skill is ready to tick" : s.ready + " skills are ready to tick", body: "You've watched the lessons. Is it true in your clinic now?", cta: "Review skills", url: url };
    if (s.current && s.current.total - s.current.done === 1)
      return { kind: "near", title: "One skill from Level " + s.current.level, body: "Finish “" + s.current.title + "” to unlock your Level " + s.current.level + " badge (+" + s.current.points + " pts).", cta: "Keep going", url: url };
    if (s.current)
      return { kind: "progress", title: "Level " + s.current.level + " · " + s.current.title, body: s.current.done + " of " + s.current.total + " skills ticked. Your next lesson moves you forward.", cta: "Continue", url: url };
    return null;
  }

  /* --------------------------------------------------------- celebration -- */
  var CEL_CSS = ".sp-cel{position:absolute;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(9,12,30,.62);opacity:0;transition:opacity .28s ease;font-family:var(--font-sans,system-ui)}" +
    "body>.sp-cel{position:fixed}.sp-cel.in{opacity:1}" +
    ".sp-cel-card{position:relative;width:100%;max-width:360px;border-radius:28px;padding:30px 24px 22px;text-align:center;color:#fff;overflow:hidden;" +
      "background:radial-gradient(120% 90% at 50% 0%,#3a3480 0%,#292569 55%,#1b1848 100%);box-shadow:0 30px 80px rgba(0,0,0,.45);transform:translateY(24px) scale(.96);transition:transform .45s cubic-bezier(.2,1.3,.4,1)}" +
    ".sp-cel.in .sp-cel-card{transform:none}" +
    ".sp-cel-medal{width:108px;height:108px;margin:4px auto 14px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;" +
      "background:radial-gradient(circle at 35% 30%,#ffe3a3,#d9a21b 60%,#9c6c0c);box-shadow:0 0 0 6px rgba(253,195,93,.18),0 12px 30px rgba(0,0,0,.35);color:#2a1d04;animation:sp-pop .7s cubic-bezier(.2,1.5,.4,1) both}" +
    ".sp-cel-medal small{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.sp-cel-medal b{font-size:40px;line-height:1;font-weight:900}" +
    "@keyframes sp-pop{0%{transform:scale(.3) rotate(-20deg);opacity:0}100%{transform:none;opacity:1}}" +
    ".sp-cel-k{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#f0c98a;margin:0 0 6px}" +
    ".sp-cel-t{font-size:24px;line-height:1.15;font-weight:800;margin:0 0 8px}" +
    ".sp-cel-s{font-size:14px;line-height:1.45;color:rgba(255,255,255,.82);margin:0 auto 14px;max-width:290px;font-style:italic}" +
    ".sp-cel-pts{display:inline-flex;align-items:baseline;gap:6px;padding:8px 16px;border-radius:999px;background:rgba(253,195,93,.14);color:#fdc35d;margin-bottom:10px}" +
    ".sp-cel-pts b{font-size:22px;font-weight:800;font-variant-numeric:tabular-nums}.sp-cel-pts i{font-style:normal;font-size:13px;font-weight:700}" +
    ".sp-cel-n{font-size:13px;color:rgba(255,255,255,.72);margin:0 0 18px}" +
    ".sp-cel-row{display:flex;gap:10px}.sp-cel-btn{flex:1;height:46px;border-radius:14px;border:0;font:inherit;font-size:15px;font-weight:700;cursor:pointer}" +
    ".sp-cel-btn.pri{background:#fdc35d;color:#1b1848}.sp-cel-btn.sec{background:rgba(255,255,255,.12);color:#fff}" +
    ".sp-conf{position:absolute;inset:0;pointer-events:none;overflow:hidden}.sp-conf i{position:absolute;top:-12px;width:8px;height:14px;border-radius:2px;opacity:.95;animation:sp-fall 2.4s cubic-bezier(.3,.6,.5,1) forwards}" +
    "@keyframes sp-fall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(560px) rotate(540deg);opacity:0}}" +
    "@media (prefers-reduced-motion:reduce){.sp-cel,.sp-cel *{animation:none!important;transition:none!important}.sp-conf{display:none}}";
  function ensureCss() {
    if (document.getElementById("sp-cel-css")) return;
    var st = document.createElement("style"); st.id = "sp-cel-css"; st.textContent = CEL_CSS; document.head.appendChild(st);
  }
  function host() {
    /* inside the phone frame, mount on the screen itself (the frame root sits
       beneath the screen layer); querySelector with a list returns the first
       match in document order, so the screens must be asked for separately */
    return document.querySelector("[data-ios-device] .sp-screen") || document.querySelector("[data-ios-device] .lc-screen") ||
      document.querySelector("[data-ios-device] .m-screen") || document.querySelector("[data-ios-device]") || document.body;
  }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function celebrate(slug, m, after) {
    ensureCss();
    after = after || compute(slug);
    var nextM = after ? after.milestones.filter(function (x) { return x.status !== "achieved"; })[0] : null;
    var h = host();
    var el = document.createElement("div");
    el.className = "sp-cel"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Level " + m.level + " achieved");
    var conf = "";
    var cols = ["#fdc35d", "#f0c98a", "#8fd3c1", "#b7a9ff", "#ffffff", "#ff9fb2"];
    for (var i = 0; i < 36; i++) conf += '<i style="left:' + (Math.random() * 100).toFixed(1) + "%;background:" + cols[i % cols.length] + ";animation-delay:" + (Math.random() * .6).toFixed(2) + "s;animation-duration:" + (1.8 + Math.random() * 1.2).toFixed(2) + 's"></i>';
    el.innerHTML = '<div class="sp-cel-card"><div class="sp-conf" aria-hidden="true">' + conf + "</div>" +
      '<div class="sp-cel-medal" aria-hidden="true"><small>Level</small><b>' + esc(m.level) + "</b></div>" +
      '<p class="sp-cel-k">Milestone achieved</p>' +
      '<h2 class="sp-cel-t">Level ' + esc(m.level) + " · " + esc(m.title) + "</h2>" +
      '<p class="sp-cel-s">“' + esc(m.statement) + "”</p>" +
      '<div class="sp-cel-pts"><b>+' + esc(m.points) + "</b><i>points</i></div>" +
      '<p class="sp-cel-n">' + (after ? after.achieved + " of " + after.milestones.length + " levels achieved" : "") + (nextM ? " · Next: Level " + nextM.level + " · " + esc(nextM.title) : " · Path complete") + "</p>" +
      '<div class="sp-cel-row"><button type="button" class="sp-cel-btn sec" data-a="share">Share</button><button type="button" class="sp-cel-btn pri" data-a="go">Keep going</button></div></div>';
    if (h !== document.body && getComputedStyle(h).position === "static") h.style.position = "relative";
    h.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("in"); }); });
    try { window.dispatchEvent(new CustomEvent("pf:milestone", { detail: { kind: "successPath", key: slug + ":" + m.id } })); } catch (e) {}
    var close = function () { el.classList.remove("in"); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300); };
    el.addEventListener("click", function (e) {
      var a = e.target && e.target.getAttribute && e.target.getAttribute("data-a");
      if (a === "share") { var b = e.target; b.textContent = "Shared to Community ✓"; setTimeout(close, 900); return; }
      if (a === "go" || e.target === el) close();
    });
  }

  /* ------------------------------------------------------ auto-complete -- */
  /* A skill completes on its own the moment its last linked lesson is done
     (user, 2026-10-05): there is no self-declared tick any more. Dr Tim's
     splash confirms the skill and leads to the next one; if the skill closed a
     level, that celebration follows once the splash is dismissed. Steps on the
     path always send the member into the course to watch the lesson. */
  var SS_CSS = ".sp-ss{position:absolute;inset:0;z-index:96;display:flex;flex-direction:column;background:#fff;color:#101828;font-family:var(--font-sans,system-ui);opacity:0;transition:opacity .28s ease;overflow:hidden}" +
    "body>.sp-ss{position:fixed}.sp-ss.in{opacity:1}" +
    ".sp-ss::before{content:\"\";position:absolute;inset:0;background:radial-gradient(ellipse 70% 45% at 50% 32%,rgba(253,195,93,.42),rgba(253,195,93,0) 100%);pointer-events:none}" +
    "[data-theme=dark] .sp-ss,.lc-screen:not(.lc-light) .sp-ss{background:#0F1430;color:#fff}" +
    ".sp-ss-x{position:absolute;right:18px;top:18px;width:38px;height:38px;border-radius:50%;border:0;background:rgba(16,24,40,.08);color:inherit;font-size:20px;line-height:1;cursor:pointer;z-index:2}" +
    "[data-ios-device] .sp-ss-x{top:62px}[data-theme=dark] .sp-ss-x{background:rgba(255,255,255,.12)}" +
    ".sp-ss-body{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 28px 60px;max-width:460px;margin:0 auto;width:100%;box-sizing:border-box}" +
    ".sp-ss-avatar{position:relative;width:136px;height:136px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff2d6,#f2d9ae 70%);display:flex;align-items:center;justify-content:center;margin-bottom:22px;box-shadow:0 18px 40px rgba(206,153,87,.3);overflow:hidden;animation:sp-ss-pop .6s cubic-bezier(.2,1.4,.4,1) both}" +
    ".sp-ss-lottie{position:absolute;inset:-6%}.sp-ss-lottie svg{width:100%!important;height:100%!important}" +
    ".sp-ss-img{width:100%;height:100%;object-fit:cover;border-radius:50%}.sp-ss-avatar.has-lottie .sp-ss-img{display:none}" +
    "@keyframes sp-ss-pop{0%{transform:scale(.4);opacity:0}100%{transform:none;opacity:1}}" +
    ".sp-ss-k{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#8A5303;margin:0 0 8px}[data-theme=dark] .sp-ss-k{color:#F0C98A}" +
    ".sp-ss-t{font-family:var(--font-title,\"Times New Roman\",Times,serif);font-size:32px;font-weight:700;line-height:1.1;margin:0 0 12px}" +
    ".sp-ss-q{font-family:Georgia,\"Times New Roman\",serif;font-style:italic;font-size:16px;line-height:1.45;margin:0 0 10px}" +
    ".sp-ss-s{font-size:14px;line-height:1.5;color:#475467;margin:0 0 16px}[data-theme=dark] .sp-ss-s{color:rgba(255,255,255,.75)}" +
    ".sp-ss-pts{display:inline-flex;align-items:baseline;gap:6px;padding:8px 18px;border-radius:999px;background:#FDC35D;color:#1b1848;margin-bottom:18px;box-shadow:0 10px 24px rgba(253,195,93,.45)}" +
    ".sp-ss-pts b{font-size:22px;font-weight:800}.sp-ss-pts i{font-style:normal;font-size:13px;font-weight:700}" +
    ".sp-ss-next{width:100%;text-align:left;padding:14px 16px;border-radius:16px;background:rgba(16,24,40,.05);display:flex;flex-direction:column;gap:4px;box-sizing:border-box}[data-theme=dark] .sp-ss-next{background:rgba(255,255,255,.08)}" +
    ".sp-ss-next small{font-size:11.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#8A5303}[data-theme=dark] .sp-ss-next small{color:#F0C98A}" +
    ".sp-ss-next b{font-family:Georgia,\"Times New Roman\",serif;font-style:italic;font-weight:600;font-size:15px;line-height:1.4}" +
    ".sp-ss-next span{font-size:12.5px;color:#667085}[data-theme=dark] .sp-ss-next span{color:rgba(255,255,255,.6)}" +
    ".sp-ss-foot{position:relative;display:flex;flex-direction:column;gap:10px;padding:0 24px calc(28px + env(safe-area-inset-bottom,0px));max-width:460px;margin:0 auto;width:100%;box-sizing:border-box}[data-ios-device] .sp-ss-foot{padding-bottom:44px}" +
    ".sp-ss-btn{height:50px;border-radius:14px;border:0;font:inherit;font-size:15px;font-weight:700;cursor:pointer}" +
    ".sp-ss-btn.pri{background:#0C1928;color:#fff}[data-theme=dark] .sp-ss-btn.pri{background:#FDC35D;color:#1b1848}" +
    ".sp-ss-btn.sec{background:rgba(16,24,40,.06);color:inherit}[data-theme=dark] .sp-ss-btn.sec{background:rgba(255,255,255,.1)}" +
    "@media (prefers-reduced-motion:reduce){.sp-ss,.sp-ss-avatar{animation:none!important;transition:none!important}}";
  var SS_MS = 2600;
  function ensureSsCss() {
    if (document.getElementById("sp-ss-css")) return;
    var st = document.createElement("style"); st.id = "sp-ss-css"; st.textContent = SS_CSS; document.head.appendChild(st);
  }
  function ensureLottie() {
    if (window.lottie) return Promise.resolve(window.lottie);
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
      s.onload = function () { resolve(window.lottie); }; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  function isWebPage() { return /Web\.html/i.test(location.pathname) || !document.querySelector("[data-ios-device]"); }
  function hubUrl(slug, skillId) { return (isWebPage() ? "SuccessPathWeb.html" : "SuccessPath.html") + "?course=" + slug + (skillId ? "&skill=" + encodeURIComponent(skillId) : ""); }
  function memberName() { try { return (window.PFLearnShared && window.PFLearnShared.ME && window.PFLearnShared.ME.name) || "Katy"; } catch (e) { return "Katy"; } }
  function skillSplash(slug, a, onClose) {
    ensureSsCss();
    var s = compute(slug); if (!s) { if (onClose) onClose(); return; }
    var idx = -1, next = null;
    s.activities.forEach(function (x, i) { if (x.id === a.id) idx = i; });
    for (var i = idx + 1; i < s.activities.length; i++) { if (s.activities[i].status !== "done") { next = s.activities[i]; break; } }
    var nextN = next ? s.activities.indexOf(next) + 1 : 0;
    var toWatch = next ? next.lessonsTotal - next.lessonsDone : 0;
    var onHub = !!document.querySelector(".sp-j");
    var h = host();
    var el = document.createElement("div");
    el.className = "sp-ss"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Skill " + (idx + 1) + " complete");
    el.setAttribute("data-screen-label", "Skill complete splash");
    /* short, wordless moment (user, 2026-10-05): avatar, skill count, name,
       points — no quote, no next-up card, no buttons; it closes itself */
    el.innerHTML =
      '<div class="sp-ss-body">' +
        '<div class="sp-ss-avatar"><span class="sp-ss-lottie" aria-hidden="true"></span><img class="sp-ss-img" src="assets/avatar-drtim.png" alt="Dr Tim Pearce"></div>' +
        '<p class="sp-ss-k">Skill ' + (idx + 1) + ' of ' + s.activities.length + ' complete</p>' +
        '<h2 class="sp-ss-t">Well done, ' + esc(memberName()) + '!</h2>' +
        (a.points ? '<div class="sp-ss-pts"><b>+' + esc(a.points) + '</b><i>points</i></div>' : '') +
      '</div>';
    if (h !== document.body && getComputedStyle(h).position === "static") h.style.position = "relative";
    h.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("in"); }); });
    var mount = el.querySelector(".sp-ss-lottie");
    ensureLottie().then(function (lottie) {
      if (!el.parentNode || !lottie) return;
      try {
        lottie.loadAnimation({ container: mount, renderer: "svg", loop: true, autoplay: true, path: "assets/lottie/checkin-welcome.json" });
        el.querySelector(".sp-ss-avatar").classList.add("has-lottie");
      } catch (e) {}
    }).catch(function () {});
    try { window.dispatchEvent(new CustomEvent("pf-sp-skill-complete", { detail: { slug: slug, id: a.id, next: next ? next.id : null } })); } catch (e) {}
    var closed = false;
    var close = function () {
      if (closed) return; closed = true;
      el.classList.remove("in");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); if (onClose) onClose(); }, 300);
    };
    var proceed = function () {
      if (!next) return;
      if (onHub) emit({ type: "go-skill", slug: slug, id: next.id });
    };
    var finish = function () { close(); proceed(); };
    el.addEventListener("click", finish);
    setTimeout(finish, SS_MS);
    return close;
  }
  var autoBusy = false;
  /* the hub pages only — the course pages now render the same journey UI,
     so the DOM is no longer a safe tell */
  function onHubPage() { return /SuccessPath/i.test(location.pathname); }
  /* Skills only ever complete on the Success Path page (user, 2026-10-05):
     finishing the lessons elsewhere sends the member back here first. */
  function autoComplete(slug) {
    slug = slug || "8d-lip-design";
    if (autoBusy || window.PF_SP_NO_AUTO || /Admin/i.test(location.pathname) || !onHubPage()) return [];
    var s = compute(slug); if (!s) return [];
    var un = pathState(slug).unticked;
    var ready = s.activities.filter(function (a) { return a.status === "ready" && !un[a.id]; });
    if (!ready.length) return [];
    autoBusy = true;
    var completed = [], milestone = null;
    ready.forEach(function (a) {
      var r = tick(slug, a.id, { deferCelebrate: true });
      if (r && r.ok && !r.already) { completed.push(a); if (r.milestone) milestone = r.milestone; }
    });
    emit({ type: "auto", slug: slug, ids: completed.map(function (a) { return a.id; }) });
    var i = 0;
    (function nextSplash() {
      if (i < completed.length) { var a = completed[i++]; setTimeout(function () { skillSplash(slug, a, nextSplash); }, i === 1 ? 350 : 150); return; }
      autoBusy = false;
      if (milestone) setTimeout(function () { celebrate(slug, milestone, compute(slug)); }, 300);
    })();
    return completed;
  }
  function autoCompleteSoon() { setTimeout(function () { autoComplete(); }, 800); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoCompleteSoon); else autoCompleteSoon();

  /* ----------------------------------------------------------- demo aids -- */
  function watchLessons(slug, actId) {
    var c = getContent(slug); if (!c) return;
    var a = c.activities.filter(function (x) { return x.id === actId; })[0]; if (!a) return;
    var d = readDone();
    (a.lessons || []).forEach(function (n) { if (d.indexOf(n) === -1) d.push(n); });
    writeJSON(DONE_KEY, d);
    try { window.dispatchEvent(new CustomEvent(DONE_KEY)); } catch (e) {}
    emit({ type: "lessons", slug: slug });
  }
  function reset(slug) {
    var a = allState(); delete a[slug || "8d-lip-design"]; writeJSON(STATE_KEY, a);
    emit({ type: "reset", slug: slug });
  }
  function resetLessons(slug) {
    var c = getContent(slug || "8d-lip-design"); if (!c) return;
    var names = []; c.activities.forEach(function (a) { names = names.concat(a.lessons || []); });
    writeJSON(DONE_KEY, readDone().filter(function (n) { return names.indexOf(n) === -1; }));
    try { window.dispatchEvent(new CustomEvent(DONE_KEY)); } catch (e) {}
    emit({ type: "lessons", slug: slug });
  }

  window.addEventListener("storage", function (e) { if (!e.key || e.key === STATE_KEY || e.key === CONTENT_KEY || e.key === DONE_KEY) { emit({ type: "storage" }); if (!e.key || e.key === DONE_KEY) setTimeout(function () { autoComplete(); }, 250); } });
  window.addEventListener(DONE_KEY, function () {
    emit({ type: "lessons" });
    setTimeout(function () {
      if (onHubPage()) { autoComplete(); return; }
      /* on a course / lesson page: the lesson that just finished completed a
         skill's steps → back to the Success Path, which completes the skill
         and shows Dr Tim's splash */
      var s = compute("8d-lip-design"); if (!s) return;
      var ready = s.activities.filter(function (a) { return a.status === "ready"; });
      if (!ready.length) return;
      setTimeout(function () { (window.pfGo || function (u) { location.href = u; })(hubUrl("8d-lip-design", ready[0].id)); }, 900);
    }, 250);
  });

  window.PFSuccessPath = {
    EVT: EVT, STARTER: STARTER, SUGGESTED: SUGGESTED,
    has: function (slug) { return !!DEFAULTS[slug]; },
    getContent: getContent, setContent: setContent, resetContent: resetContent, getDefaults: getDefaults,
    compute: compute, activitiesForLesson: activitiesForLesson,
    tick: tick, untick: untick, setGoal: setGoal, clearGoal: clearGoal, markSeen: markSeen,
    nudge: nudge, celebrate: celebrate, skillSplash: skillSplash, autoComplete: autoComplete, hubUrl: hubUrl, view: view, setView: setView, tier: tier,
    watchLessons: watchLessons, reset: reset, resetLessons: resetLessons, readDone: readDone
  };
})();
