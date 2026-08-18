/* ===========================================================================
   PROfinity — Profile (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -PM to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStatePM, useEffect: useEffectPM } = React;
const DSPM = window.ProfinityDesignSystem_c2b5cc;

function goPM(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

/* Standalone badge image with a hover/tap tooltip explaining what it means
   (mastery + skinfluencer badges aren't part of DSPM.VerificationSeals). */
function PMSealBadge({ src, alt, label, width, height, style }) {
  const [hover, setHover] = useStatePM(false);
  const [pinned, setPinned] = useStatePM(false);
  useEffectPM(() => {
    if (!pinned) return;
    const close = () => { setPinned(false); setHover(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [pinned]);
  const open = hover || pinned;
  return (
    <span className={"pm-seal-badge" + (open ? " is-open" : "")} tabIndex={0} role="button" aria-label={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); setPinned((p) => !p); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPinned((p) => !p); } }}
      style={style}>
      <img src={src} alt={alt} width={width} height={height} style={{ display: "block" }} />
      <span className="pm-seal-tip">{label}</span>
    </span>
  );
}

/* Same "pf-subscription-tier" key the newsfeed/community/membership pages
   read and write — this file doesn't load app.jsx, so it keeps its own tiny
   copy rather than depending on window.PFApp. */
const PF_TIER_KEY_PM = "pf-subscription-tier";
function getUserTierPM() {
  try { return localStorage.getItem(PF_TIER_KEY_PM) || "free"; } catch (e) { return "free"; }
}

/* ===========================================================================
   The Prosperity Spiral + Today's Targets — moved here from LearningMobile
   (Aug 2026 prototype pass, Profile placement not yet signed off by Tim).
   Same four pillars, same target tags/copy as before; the Learning page now
   just links across via #prosperity-spiral. =====================
   =========================================================================== */
const PM_PILLARS = [
{ key: "Sales", color: "var(--error)" },
{ key: "Marketing", color: "linear-gradient(90deg, #f4ad3d, #e7820a)" },
{ key: "Clinical Skills", color: "var(--info)" },
{ key: "Business Systems", color: "var(--premium-orange)" }];


const PM_TARGET_TAGS = {
  MKT: { label: "MKT", color: "#e7820a" },
  CLIN: { label: "CLIN", color: "#0088de" },
  SALE: { label: "SALE", color: "var(--error)" },
  SYS: { label: "SYS", color: "var(--premium-orange)" }
};

const PM_TARGETS = [
{ text: "Complete Lesson 4: Lip Anatomy", tag: "CLIN" },
{ text: "Post 2 before/after case studies", tag: "MKT" },
{ text: "Follow up with 3 lapsed patients", tag: "SALE" },
{ text: "Log this week's expenses in your tracker", tag: "SYS" }];


/* ===========================================================================
   Self-Assessment scoring engine (PRD: Prosperity Spiral & Self-Assessment
   Experience Updates, Aug 2026). Pillar Score = min(100, Seval*0.6 + Scourse):
   Seval is the self-assessment's raw score (0-100%, capped at 60% weight),
   Scourse is course-completion progress, which alone can carry a pillar to
   100% regardless of assessment performance.
   =========================================================================== */

/* Course-completion baseline (Scourse) per pillar. Reuses the Spiral's
   previous mock percentages as "how far courses alone have carried this
   pillar" — with no assessment taken (Seval = 0), pillarScore collapses to
   exactly Scourse, so nothing changes here until an assessment is completed. */
const PM_SCOURSE = { "Sales": 31, "Marketing": 52, "Clinical Skills": 62, "Business Systems": 41 };

const PM_ASSESS_KEY = "pf-self-assessment";
function pmLoadAssessState() {
  try { return JSON.parse(localStorage.getItem(PM_ASSESS_KEY)) || {}; } catch (e) { return {}; }
}
function pmSaveAssessState(state) {
  try { localStorage.setItem(PM_ASSESS_KEY, JSON.stringify(state)); } catch (e) {}
}

function pmPillarScore(pillarKey, assessState) {
  const scourse = PM_SCOURSE[pillarKey] || 0;
  const entry = assessState[pillarKey];
  const seval = entry && entry.status === "completed" ? (entry.rawPoints / 28) * 100 : 0;
  return Math.min(100, Math.round(seval * 0.6 + scourse));
}

/* Dynamic Goal Focus (3.3) — lowest-scoring pillar, tie-break in this order. */
const PM_GOAL_TIEBREAK = ["Clinical Skills", "Business Systems", "Sales", "Marketing"];
function pmLowestPillar(assessState) {
  const scored = PM_PILLARS.map((p) => ({ key: p.key, score: pmPillarScore(p.key, assessState) }));
  const lowest = Math.min(...scored.map((s) => s.score));
  const tied = scored.filter((s) => s.score === lowest).map((s) => s.key);
  return PM_GOAL_TIEBREAK.find((k) => tied.includes(k)) || tied[0];
}
const PM_GOAL_REASONING = {
  "Sales": "Your consultations and follow-up are the fastest lever right now — tightening how you convert the patients already reaching out will move this pillar quickest.",
  "Marketing": "You need visibility. Better, more consistent lead generation is the fastest way to fill your books.",
  "Clinical Skills": "Sharpening your clinical technique and confidence unlocks higher-value treatments and safer, more advanced procedures.",
  "Business Systems": "Tightening your operations, pricing and financial tracking is what turns bookings into a sustainable, scalable business."
};

/* "How it works" help — a plain-language explainer for the Spiral Score,
   reached via a link next to the heading (no new tab/nav item). */
function PMSpiralHelpModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="pm-help-overlay" onClick={onClose}>
      <div className="pm-help-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="How the Prosperity Spiral works">
        <div className="pm-help-hd">
          <span className="pm-help-icon"><DSPM.IconifyIcon name="lucide:sparkles" size={18} color="var(--ai-purple)" /></span>
          <h3>How the Prosperity Spiral works</h3>
          <button type="button" className="pm-help-x" aria-label="Close" onClick={onClose}>
            <DSPM.IconifyIcon name="lucide:x" size={20} color="var(--gray-500)" />
          </button>
        </div>
        <div className="pm-help-body">
          <p>Your Spiral Score is simply a snapshot of how balanced your business is across four areas every successful clinic needs: <b>Sales</b>, <b>Marketing</b>, <b>Clinical Skills</b> and <b>Business Systems</b>.</p>
          <p>Each pillar's number goes up when you take actions that build it — finishing a lesson, completing a Today's Target, posting a case study, following up with a patient. There's no trick to it: the more consistently you show up in a pillar, the faster it climbs.</p>
          <p>A weak pillar isn't a bad grade — it's just where Ava recommends you focus next, because the fastest way to grow your clinic is usually to strengthen your lowest pillar first.</p>
          <button type="button" className="pf-coach-link pm-help-coach" data-coach="Explain how my Spiral Score is calculated and what I can do this week to raise it." onClick={onClose}>
            <DSPM.IconifyIcon name="lucide:sparkles" size={14} color="var(--ai-purple)" />Ask Ava to explain mine
          </button>
        </div>
      </div>
    </div>);

}

function PMSpiralCard({ assessState }) {
  const [helpOpen, setHelpOpen] = useStatePM(false);
  return (
    <section className="pm-sec pm-card" id="prosperity-spiral" data-screen-label="The Prosperity Spiral">
      <div className="pm-card-hd">
        <span className="pm-card-hd-ti">
          <h2>The Prosperity Spiral</h2>
          <button type="button" className="pm-help-link" aria-label="How it works" onClick={() => setHelpOpen(true)}>
            <DSPM.IconifyIcon name="lucide:circle-help" size={16} color="var(--gray-500)" />How it works
          </button>
        </span>
        <button type="button" className="pf-coach-link" data-coach="Discuss my Prosperity Spiral — Sales, Marketing, Clinical Skills and Business Systems — and tell me what to prioritise.">
          <DSPM.IconifyIcon name="lucide:sparkles" size={14} color="var(--ai-purple)" />Discuss with Ava
        </button>
      </div>
      <div className="pm-pillar-grid">
        {PM_PILLARS.map((g) => {
          const pct = pmPillarScore(g.key, assessState);
          return (
            <button key={g.key} type="button" className="pm-pillar-card" onClick={() => goPM("MyLearning.html")}>
              <span className="top">
                <span className="k">{g.key}</span>
                <span className="v">{pct}</span>
              </span>
              <span className="bar"><span style={{ width: pct + "%", background: g.color }} /></span>
            </button>);

        })}
      </div>
      <PMSpiralHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </section>);

}

/* "Let's work on your goal" — relocated here from My Learning (PRD 3.2/3.3):
   sits above the Prosperity Spiral and auto-picks the lowest-scoring pillar. */
function PMGoalFocusCard({ assessState }) {
  const pillarKey = pmLowestPillar(assessState);
  const score = pmPillarScore(pillarKey, assessState);
  return (
    <section className="pm-sec pm-card pm-goal-card" data-screen-label="Let's work on your goal">
      <div className="pm-goal-top">
        <div className="pm-goal-main">
          <span className="eyebrow"><DSPM.IconifyIcon name="lucide:trophy" size={13} color="var(--premium-orange)" />Let's work on your goal</span>
          <div className="ti">{pillarKey}</div>
          <p className="note">Your lowest-scoring pillar right now — Ava recommends focusing here next.</p>
        </div>
        <div className="pm-goal-ring" style={{ "--pct": score }} role="img" aria-label={score + " progress"}>
          <span className="n">{score}</span>
          <span className="lbl">Progress</span>
        </div>
      </div>
      <p className="pm-goal-reasoning">{PM_GOAL_REASONING[pillarKey]}</p>
      <button type="button" className="pm-goal-cta" onClick={() => goPM("MyLearning.html")}>
        Work on your goal<DSPM.IconifyIcon name="lucide:arrow-up-right" size={17} color="#fff" />
      </button>
    </section>);

}

function PMTargetsCard() {
  const [extra, setExtra] = useStatePM([]);
  useEffectPM(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("pf-coach-targets")) || [];
      setExtra(stored.map((t) => ({ text: t.text, tag: null })));
    } catch (e) {}
  }, []);
  const all = PM_TARGETS.concat(extra);
  const [done, setDone] = useStatePM([]);
  const toggle = (i) => setDone((s) => {
    const next = s.slice();
    while (next.length <= i) next.push(false);
    next[i] = !next[i];
    return next;
  });
  return (
    <section className="pm-sec pm-card" data-screen-label="Today's Targets">
      <div className="pm-card-hd">
        <h2>Today's Targets</h2>
        <button type="button" className="pf-coach-link" data-coach="Help me plan today's targets to make progress on my clinic goal.">
          <DSPM.IconifyIcon name="lucide:sparkles" size={14} color="var(--ai-purple)" />Discuss with Ava
        </button>
      </div>
      <div className="pm-target-rows">
        {all.map((t, i) =>
        <button key={i} type="button" className={"pm-target-row" + (done[i] ? " done" : "")} onClick={() => toggle(i)} role="checkbox" aria-checked={!!done[i]}>
            <span className="circle">{done[i] && <DSPM.IconifyIcon name="lucide:check" size={12} color="#fff" />}</span>
            {t.tag && <span className="pm-target-tag" style={{ background: PM_TARGET_TAGS[t.tag].color }}>{PM_TARGET_TAGS[t.tag].label}</span>}
            <span className="tx">{t.text}</span>
          </button>
        )}
      </div>
      <p className="pm-target-note">Completing these will move your Prosperity Spiral forward</p>
    </section>);

}

/* "Track your goals" — encloses Goal Focus, the Prosperity Spiral and
   Today's Targets behind one collapsible summary row, the same
   collapse/expand slide-over pattern used for "Complete your profile". */
function PMGoalsMenu({ assessState }) {
  const [expanded, setExpanded] = useStatePM(false);
  const { collapsedRef, expandedRef, height: viewportH } = usePMSlidePaneHeight(expanded, [assessState]);

  /* Deep link from LearningMobile's "See your full Prosperity Spiral" points
     at #prosperity-spiral, which now lives inside the collapsed-by-default
     menu — auto-expand so the link actually reveals the Spiral, not just an
     off-canvas element PMScreen's scrollIntoView effect can't see. */
  useEffectPM(() => {
    if (window.location.hash === "#prosperity-spiral") setExpanded(true);
  }, []);

  const avgPct = Math.round(
    PM_PILLARS.reduce((sum, p) => sum + pmPillarScore(p.key, assessState), 0) / PM_PILLARS.length
  );

  return (
    <div className="pm-goals-viewport" style={viewportH != null ? { height: viewportH + "px" } : undefined}>
      <div className={"pm-goals-slider" + (expanded ? " expanded" : "")}>
        <button type="button" ref={collapsedRef} className="pm-goals-pane pm-goals-collapsed" aria-label="Track your goals — tap to view" onClick={() => setExpanded(true)}>
          <div className="pm-goals-collapsed-top">
            <h3 className="pm-steps-h">Track your goals</h3>
            <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
          </div>
          <p className="pm-steps-sub">Goal Focus, Prosperity Spiral &amp; Today's Targets</p>
          <div className="pm-steps-track" role="progressbar" aria-valuenow={avgPct} aria-valuemin={0} aria-valuemax={100}>
            <span className="pm-steps-fill" style={{ width: avgPct + "%" }}></span>
          </div>
          <p className="pm-steps-pct">{avgPct}% average progress — tap to view</p>
        </button>

        <div ref={expandedRef} className="pm-goals-pane pm-goals-expanded">
          <button type="button" className="pm-goals-back" onClick={() => setExpanded(false)}>
            <DSPM.IconifyIcon name="lucide:chevron-left" size={20} color="var(--text-heading)" />Track your goals
          </button>
          <PMGoalFocusCard assessState={assessState} />
          <PMSpiralCard assessState={assessState} />
          <PMTargetsCard />
        </div>
      </div>
    </div>
  );
}

const TIER_DISPLAY_NAME_PM = { confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", inner: "Inner Circle" };

const PM_ME = {
  name: "Katy Wilson", role: "Registered Nurse", avatar: "assets/avatar-katy.jpg",
  seals: ["gb", "verified", "crown", "gold"],
  bio: "Enhance patient satisfaction scores by 15% over the next 6 months through improved communication and personalized care planning.",
  followers: "1,546", following: "880", posts: "57", location: "London, United Kingdom", clinic: "Allcare Medical",
  tier: TIER_DISPLAY_NAME_PM[getUserTierPM()] || null
};

/* Membership ladder — the upgrade banner should point at the next rung up,
   not repeat the tier the viewer already holds. A free viewer (no tier,
   indexOf === -1) points at the first rung rather than reading as "top". */
const SM_TIER_LADDER_PM = ["Confidence", "Mastery", "Freedom", "Inner Circle"];
function smNextTierPM(tier) {
  const i = SM_TIER_LADDER_PM.indexOf(tier);
  if (i === SM_TIER_LADDER_PM.length - 1) return null;
  return SM_TIER_LADDER_PM[i + 1];
}
/* A viewer's paid tier unlocks every rung below it too. Returns the viewer's
   tier first (current, highlighted "YOUR TIER") followed by the rungs it
   includes, lowest last. */
function smIncludedTiersPM(tier) {
  const i = SM_TIER_LADDER_PM.indexOf(tier);
  if (i === -1) return [];
  return SM_TIER_LADDER_PM.slice(0, i + 1).reverse();
}

const PM_SERVICES = [
{ ti: "Botox (Anti-Wrinkle Injections)", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Dermal Fillers", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Lip Enhancement", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Cheek & Jawline Contouring", su: "Career Academy: Dr Tim Pearce" }];


const PM_EXPERIENCE = [
{ ti: "Registered Nurse", yrs: "12 years", org: "Generations Wellness Center", loc: "London, United Kingdom" },
{ ti: "Assistant Nurse", yrs: "12 years", org: "Generations Wellness Center", loc: "London, United Kingdom" }];


const PM_LICENSES = [
"The Ultimate Toxin Eye Complications Masterclass",
"Anatomy360",
"Pro Tox Course",
"8D Lips Course",
"Botox Foundations"];


/* Education + Language — pulled out of inline markup into data so the
   "Professional Information" menu (below) can render the same rows for
   either the owner's profile or another member's, from props. */
const PM_EDUCATION = [
{ logo: "JH", school: "Johns Hopkins University of USA", program: "Clinical Foundations of Medicine", years: "1990 - 2020" }];


const PM_LANGUAGES = [
{ flag: "🇬🇧", name: "English (UK)", level: "Primary" },
{ flag: "🇮🇹", name: "Italian", level: "Secondary" }];


const PM_ACTIVITY = [
{
  name: "Katy Wilson", loc: "London, United Kingdom", time: "Today", avatar: "assets/avatar-katy.jpg",
  title: "Temple Filler Techniques",
  body: "One of the biggest challenges in clinical practice? Paperwork. Since switching to PROfinity, consent forms, treatment records, and post-consult notes are now digital, organized, and secure — saving me time and giving patients a clearer, more confident experience.\n#DigitalHealth #PatientCare #ClinicianTools #PROfinity",
  likes: "1.2K", comments: "150", shares: "150"
},
{
  name: "James Lee", loc: "Sydney, Australia", time: "Yesterday", avatar: null,
  /* "id" links a post's author to their profile — see PMPost + ProfileMobile's
     "?id=" viewer mode (PM_OTHER_USERS) below. Katy is the profile owner, so
     her own posts don't need a link back to this same page. */
  id: "james-lee",
  title: "Advanced Suturing Techniques",
  body: "In my surgical practice, time is precious. That's why I was thrilled to discover the ease of digital record-keeping with PROfinity. Documentation has never been simpler — everything I need is just a few taps away.\n#Surgery #PatientSafety #MedicalTech #PROfinity",
  likes: "850", comments: "200", shares: "180"
},
{
  name: "Linda Garcia", loc: "Toronto, Canada", time: "Last Week", avatar: null,
  id: "linda-garcia",
  title: "Emerging Technologies in Dentistry",
  body: "The dental field is evolving rapidly, and so should our approach to documentation. From treatment plans to follow-up notes, everything is handled digitally — less clutter, more focus on patient interactions.\n#DentalCare #TechInDentistry #PROfinity #FutureOfHealthcare",
  likes: "1.5K", comments: "120", shares: "200"
}];

/* ===========================================================================
   Viewing someone else's profile (ProfileMobile.html?id=<key>) — a lighter,
   read-only take on the same page: shared context + a summarised activity
   feed instead of the owner-only "Complete your profile" / "Track your
   goals" checklists. Keyed by the same ids PMPost links out to. Mock data
   only — a real build would fetch this by id.
   =========================================================================== */
const PM_OTHER_USERS = {
  "james-lee": {
    name: "James Lee", role: "Surgical Nurse Practitioner", avatar: null, seals: ["verified"],
    bio: "Surgical nurse practitioner specialising in advanced suturing and post-operative care. Sharing what I learn, one case at a time.",
    location: "Sydney, Australia", clinic: "Sydney Aesthetic Group",
    posts: "34", followers: "612", following: "205",
    shared: { mutualConnections: 8, community: "Confidence Path", courses: ["8D Lip Design"] },
    activity: { lastActive: "1h ago", highlights: [
      { icon: "lucide:file-text", text: "Posted “Advanced Suturing Techniques”", time: "Yesterday" },
      { icon: "lucide:message-circle", text: "Commented on 3 posts this week", time: "2d" },
      { icon: "lucide:thumbs-up", text: "Liked your “Temple Filler Techniques” post", time: "3d" }] },
    services: [
      { ti: "Advanced Suturing", su: "Career Academy: Dr Tim Pearce" },
      { ti: "Post-Operative Wound Care", su: "Career Academy: Dr Tim Pearce" }],
    experience: [
      { ti: "Surgical Nurse Practitioner", yrs: "9 years", org: "Sydney Aesthetic Group", loc: "Sydney, Australia" }],
    education: [
      { logo: "UoS", school: "University of Sydney", program: "Bachelor of Nursing", years: "2011 - 2015" }],
    licenses: ["Advanced Suturing Certification", "Anatomy360"],
    languages: [{ flag: "🇦🇺", name: "English (AU)", level: "Primary" }]
  },
  "linda-garcia": {
    name: "Linda Garcia", role: "Dental Practitioner", avatar: null, seals: ["verified"],
    bio: "Dentist exploring emerging technologies in digital dentistry and paperless patient care.",
    location: "Toronto, Canada", clinic: "Garcia Dental Studio",
    posts: "21", followers: "398", following: "150",
    shared: { mutualConnections: 5, community: "Confidence Path", courses: [] },
    activity: { lastActive: "5h ago", highlights: [
      { icon: "lucide:file-text", text: "Posted “Emerging Technologies in Dentistry”", time: "Last week" },
      { icon: "lucide:thumbs-up", text: "Liked 2 of your posts", time: "1w" }] },
    services: [{ ti: "Digital Treatment Planning", su: "Career Academy: Dr Tim Pearce" }],
    experience: [{ ti: "Dental Practitioner", yrs: "7 years", org: "Garcia Dental Studio", loc: "Toronto, Canada" }],
    education: [{ logo: "UoT", school: "University of Toronto", program: "Doctor of Dental Surgery", years: "2013 - 2017" }],
    licenses: ["Botox Foundations"],
    languages: [
    { flag: "🇨🇦", name: "English (CA)", level: "Primary" },
    { flag: "🇪🇸", name: "Spanish", level: "Secondary" }]
  },
  "dr-tim-pearce": {
    name: "Dr Tim Pearce", role: "Founder & Lead Trainer, PROfinity Academy", avatar: "assets/avatar-drtim.png", seals: ["verified", "crown", "gold"],
    bio: "Founder of PROfinity Academy — training the next generation of aesthetic practitioners in safe, confident injectable technique.",
    location: "London, United Kingdom", clinic: "PROfinity Academy",
    posts: "212", followers: "18.4K", following: "310",
    shared: { mutualConnections: 24, community: "Confidence Path", courses: ["8D Lip Design", "Protox Course", "Temple Filler"] },
    activity: { lastActive: "Just now", highlights: [
      { icon: "lucide:file-text", text: "Posted a new Technique Tuesday recap", time: "Today" },
      { icon: "lucide:message-circle", text: "Commented on your “Temple Filler Techniques” post", time: "Today" },
      { icon: "lucide:calendar-check", text: "Hosting Technique Tuesday Webinar", time: "30 Jun" }] },
    services: [
      { ti: "Botox (Anti-Wrinkle Injections)", su: "Career Academy: Dr Tim Pearce" },
      { ti: "Dermal Fillers", su: "Career Academy: Dr Tim Pearce" },
      { ti: "Full-Face Rejuvenation", su: "Career Academy: Dr Tim Pearce" }],
    experience: [
      { ti: "Founder & Lead Trainer", yrs: "15 years", org: "PROfinity Academy", loc: "London, United Kingdom" },
      { ti: "Consultant Aesthetic Practitioner", yrs: "20 years", org: "Allcare Medical", loc: "London, United Kingdom" }],
    education: [{ logo: "UCL", school: "University College London", program: "MBBS Medicine", years: "1998 - 2004" }],
    licenses: ["Anatomy360", "Pro Tox Course", "8D Lips Course", "Botox Foundations", "The Ultimate Toxin Eye Complications Masterclass"],
    languages: [{ flag: "🇬🇧", name: "English (UK)", level: "Primary" }]
  }
};


const PM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: null },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" },
{ key: "Rewards", label: "Rewards", icon: "lucide:gift", href: null }];


const SM_TIER_RESOURCES_PM = {
  Confidence: [
  { label: "Community Chat",       icon: "lucide:message-circle", href: "CommunityMobile.html" },
  { label: "Membership Training",  icon: "lucide:graduation-cap", href: "LearningMobile.html" },
  { label: "Technique Tuesday",    icon: "lucide:calendar-check", href: "EventsMobile.html" },
  { label: "Complications Help",   icon: "lucide:shield-alert",   href: "DirectMessage.html" },
  { label: "AI Coach",             icon: "lucide:sparkles",       href: "LearningMobile.html" }],

  Mastery: [
  { label: "Mastery lounge",          icon: "lucide:message-circle", href: "CommunityMobile.html" },
  { label: "Advanced masterclasses",  icon: "lucide:graduation-cap", href: "LearningMobile.html" },
  { label: "Complication library",    icon: "lucide:file-text",      href: "LearningMobile.html" },
  { label: "Live case reviews",       icon: "lucide:calendar",       href: "EventsMobile.html" }],

  Freedom: [
  { label: "Freedom circle",       icon: "lucide:message-circle", href: "CommunityMobile.html" },
  { label: "Business playbooks",   icon: "lucide:graduation-cap", href: "LearningMobile.html" },
  { label: "1:1 mentor sessions",  icon: "lucide:calendar",       href: "EventsMobile.html" }],

  "Inner Circle": [
  { label: "Inner Circle roundtable", icon: "lucide:message-circle", href: "CommunityMobile.html" },
  { label: "Executive mentorship",    icon: "lucide:calendar",       href: "EventsMobile.html" },
  { label: "Legacy case archive",     icon: "lucide:file-text",      href: "LearningMobile.html" },
  { label: "Founder office hours",    icon: "lucide:calendar",       href: "EventsMobile.html" }]
};

const SM_COURSES_PM = [
{ label: "Face Anatomy Masterclass", pct: 72 },
{ label: "Lip Filler Techniques", pct: 45 },
{ label: "Advanced Botox Training", pct: 20 }];

const SM_EVENTS_PM = [
{ d: "30", m: "JUN", label: "Technique Tuesday Webinar", t: "8:00 PM", tag: "NEW" },
{ d: "5", m: "JUL", label: "Confidence Masterclass", t: "6:00 PM" },
{ d: "12", m: "JUL", label: "Business Growth Workshop", t: "7:00 PM" }];

const SM_PROFILE_BEFORE_PM = [
{ label: "Edit Profile",       icon: "lucide:book-open",       href: "ProfileMobile.html" },
{ label: "Account Settings",   icon: "lucide:graduation-cap",  href: "AccountSettings.html" },
{ label: "My Saved",           icon: "lucide:bookmark",        href: "MySaved.html" },
{ label: "Notifications",      icon: "lucide:calendar",        href: "NotificationSettings.html" },
{ label: "Privacy & Security", icon: "lucide:book-open",       href: null }];

function useDarkModePM() {
  const [dark, setDark] = useStatePM(() => {
    try { return localStorage.getItem('pf-theme') === 'dark'; } catch(e) { return false; }
  });
  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('pf-theme', next ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    } catch(e) {}
  }
  return [dark, toggle];
}

function SmDarkSwitchPM({ on, onToggle }) {
  return (
    <button className={"sm-switch" + (on ? " on" : "")} onClick={onToggle} role="switch"
      aria-checked={on} aria-label={on ? "Switch to light mode" : "Switch to dark mode"}>
      <span className="sm-knob">
        {on && <DSPM.IconifyIcon name="lucide:moon" size={13} color="#1A1736" />}
      </span>
    </button>);
}

function SmDisplayCardPM({ dark, onToggle }) {
  return (
    <div className="sm-display-card">
      <div className="sm-display-top">
        <span className="sm-display-label">Display</span>
        <SmDarkSwitchPM on={dark} onToggle={onToggle} />
      </div>
      <p className="sm-display-desc">
        Adjust the appearance of the app to reduce glare and give your eyes a break
      </p>
    </div>);
}

function SmSectionPM({ title }) {
  return <div className="sm-sec-h">{title}</div>;
}

function SmTierResourceRowPM({ r }) {
  return (
    <button className="smt-resource" onClick={() => r.href && goPM(r.href)}>
      <DSPM.IconifyIcon name={r.icon} size={20} color="var(--gray-900)" />
      <span className="smt-resource-label">{r.label}</span>
      <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
    </button>);
}

function SmTierCardPM({ tierName, isOwn }) {
  const resources = SM_TIER_RESOURCES_PM[tierName] || [];
  return (
    <div className="smt-card">
      <div className="smt-head">
        <span className="smt-top">
          <span className="smt-name">{tierName} Path</span>
          {!isOwn && <span className="smt-pill">INCLUDED</span>}
        </span>
      </div>
      <div className="smt-resources">
        {resources.map((r) => <SmTierResourceRowPM key={r.label} r={r} />)}
      </div>
    </div>);
}

function SideMenuPM({ open, onClose }) {
  const [dark, toggleDark] = useDarkModePM();
  return (
    <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="m-drawer-scrim" onClick={onClose} />
      <aside className="m-drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <button className="m-drawer-profile" onClick={() => goPM("ProfileMobile.html")}>
          <DSPM.Avatar name={PM_ME.name} src={PM_ME.avatar} size={56} />
          <span className="m-dp-main">
            <span className="m-dp-name">{PM_ME.name}
              <DSPM.IconifyIcon name="lucide:badge-check" size={18} color="var(--reaction-like)" />
            </span>
            <span className="m-dp-role">{PM_ME.role}</span>
          </span>
          <DSPM.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-800)" />
        </button>

        <div className="sm-body">
          <button className="sm-upgrade" onClick={() => goPM("MembershipTier.html")}>
            <span className="sm-upgrade-icon">
              <DSPM.IconifyIcon name="lucide:gem" size={20} color="#fff" />
            </span>
            <span className="sm-upgrade-main">
              <span className="sm-upgrade-title">{smNextTierPM(PM_ME.tier) ? "Upgrade to " + smNextTierPM(PM_ME.tier) : "You're at the top tier"}</span>
              <span className="sm-upgrade-sub">Unlock premium channels &amp; courses</span>
            </span>
            <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="#fff" />
          </button>

          <SmSectionPM title="My Membership" />
          {PM_ME.tier ?
            <div className="smt-list">
              {smIncludedTiersPM(PM_ME.tier).map((t, i) =>
                <SmTierCardPM key={t} tierName={t} isOwn={i === 0} />
              )}
            </div> :
            <button className="sm-tier" onClick={() => goPM("CommunityMobile.html")}>
              <span className="sm-tier-top">
                <span className="sm-tier-name">No active plan</span>
                <span className="sm-tier-pill">FREE</span>
              </span>
              <span className="sm-tier-sub">Subscribe to unlock a channel</span>
            </button>
          }

          <SmSectionPM title="My Courses" />
          <div className="sm-courses">
            {SM_COURSES_PM.map((c) =>
            <button key={c.label} className="sm-course" onClick={() => goPM("LearningMobile.html")}>
                <span className="sm-course-top">
                  <span className="sm-course-thumb">
                    <DSPM.IconifyIcon name="lucide:image" size={20} color="var(--gray-400)" />
                  </span>
                  <span className="sm-course-name">{c.label}</span>
                </span>
                <span className="sm-progress"><span className="sm-progress-fill" style={{ width: c.pct + "%" }} /></span>
                <span className="sm-course-pct">{c.pct}% complete</span>
              </button>
            )}
          </div>

          <SmSectionPM title="Upcoming Events" />
          <div className="sm-events">
            {SM_EVENTS_PM.slice(0, 2).map((e) =>
            <button key={e.label} className="sm-event" onClick={() => goPM("EventsMobile.html")}>
                <span className="sm-date"><b>{e.d}</b><i>{e.m}</i></span>
                <span className="sm-event-main">
                  <span className="sm-event-name">{e.label}</span>
                  <span className="sm-event-time">{e.t}</span>
                </span>
                {e.tag && <span className="sm-event-tag">{e.tag}</span>}
              </button>
            )}
          </div>

          <SmSectionPM title="My Profile" />
          <button className="sm-row sm-verify" onClick={() => goPM("ProfileMobile.html")}>
            <DSPM.IconifyIcon name="lucide:book-open" size={23} color="var(--premium-orange)" />
            <span className="sm-row-label">Verify Profile</span>
            <span className="sm-verify-pill">Not Verified</span>
          </button>
          <nav className="sm-list">
            {SM_PROFILE_BEFORE_PM.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => c.href && goPM(c.href)}>
                <DSPM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
                <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </button>
            )}
          </nav>

          <SmDisplayCardPM dark={dark} onToggle={toggleDark} />

          <button className="m-drawer-logout" onClick={() => goPM("AuthMobile.html?view=signin")}>
            <DSPM.IconifyIcon name="lucide:log-out" size={22} color="var(--error)" />
            Logout
          </button>
        </div>
      </aside>
    </div>);
}

function PMTopBar({ onMenu, onMessages }) {
  return (
    <header className="pm-top">
      <button className="pm-burger" aria-label="Menu" onClick={onMenu}><DSPM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" />
      <span className="grow" />
      <button className="pm-iconbtn" aria-label="Search"><DSPM.Icon name="search" size={21} color="var(--brand-navy)" /></button>
      <button className="pm-iconbtn" aria-label="Notifications">
        <DSPM.IconifyIcon name="lucide:bell" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
      <button className="pm-iconbtn" aria-label="Messages" onClick={() => onMessages && onMessages()}>
        <DSPM.IconifyIcon name="lucide:message-circle" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
    </header>);

}

const DM_THREADS_SEED_PM = [
{ id: "tim", name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", online: true, unread: 2,
  messages: [
  { me: false, text: "Hey Katy! I saw your post about the full-face rejuvenation case.", t: "10:12 AM" },
  { me: true, text: "Thank you! It was a great result, patient was thrilled.", t: "10:20 AM" },
  { me: false, text: "Do you mind if I share it with my team as a reference?", t: "10:25 AM" },
  { me: true, text: "Of course, go ahead — sharing the write-up now.", t: "10:28 AM" },
  { me: false, text: "Thanks for sharing the case study. Really helpful!", t: "10:30 AM" }] },

{ id: "sarah", name: "Dr Sarah Kim", avatar: null, online: true, unread: 1,
  messages: [
  { me: false, text: "Are you free to go over the Q3 protocol updates this week?", t: "9:40 AM" },
  { me: true, text: "Yes, Thursday afternoon works for me.", t: "9:52 AM" },
  { me: false, text: "Looking forward to our next meeting!", t: "11:00 AM" }] },

{ id: "emily", name: "Dr Emily Tran", avatar: null, online: false, unread: 3,
  messages: [
  { me: false, text: "Just finished reviewing the patient satisfaction data.", t: "10:50 AM" },
  { me: false, text: "There's a trend worth flagging in the 45+ age group.", t: "11:05 AM" },
  { me: false, text: "I have some additional insights to share.", t: "11:15 AM" }] },

{ id: "james", name: "Dr James Brown", avatar: null, online: false, unread: 0, muted: true,
  messages: [
  { me: true, text: "Sent over the full results deck this morning.", t: "11:05 AM" },
  { me: false, text: "Can we discuss the implications of the results?", t: "11:30 AM" }] },

{ id: "alex", name: "Dr Alex Chen", avatar: null, online: true, unread: 0,
  messages: [
  { me: false, text: "The dosing charts you put together are excellent.", t: "11:40 AM" },
  { me: false, text: "Great work on the data analysis!", t: "11:45 AM" }] },

{ id: "miranda", name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", online: false, unread: 0,
  messages: [
  { me: true, text: "Sharing the confidence-score writeup with you now.", t: "11:50 AM" },
  { me: false, text: "Perfect, thank you — this is exactly what I needed.", t: "12:00 PM" }] }];


const VOICE_CONFS_SEED_PM = [
{ id: "vc1", name: "Clinical Case Review", who: "Dr Tim Pearce, Dr Sarah Kim +3", t: "Today, 4:00 PM", live: true },
{ id: "vc2", name: "Business Growth Sync", who: "Miranda Pearce, Dr Alex Chen", t: "Tomorrow, 10:00 AM", live: false }];

const PF_GROUPS_KEY = "pf-dm-groups";

function readDmGroupsPM() {
  try { return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || []; } catch (e) { return []; }
}

function groupDisplayNamePM(members) {
  const names = members.map((m) => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}

function createDmGroupPM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = { id: "group-" + Date.now(), isGroup: true, customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNamePM(members), members, messages: [] };
  const groups = readDmGroupsPM();
  groups.unshift(group);
  try { localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups)); } catch (e) {}
  return group;
}

function GroupAvatarStackPM({ members, size }) {
  const s = size || 52;
  return (
    <span className="mp-group-av" style={{ width: s, height: s }}>
      {members.slice(0, 2).map((m, i) =>
        <span className="mp-group-av-item" key={m.id || i}>
          <DSPM.Avatar name={m.name} src={m.avatar} size={Math.round(s * 0.68)} />
        </span>
      )}
    </span>);
}

function MessagesRowPM({ c, onOpen }) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return (
    <button className="mp-row" onClick={onOpen}>
      <span className="mp-av">
        {c.isGroup ?
        <GroupAvatarStackPM members={c.members} /> :

        <>
            <DSPM.Avatar name={c.name} src={c.avatar} size={52} />
            {c.online && <span className="dm-online-dot" />}
          </>}
      </span>
      <span className="mp-main">
        <span className="mp-row-top">
          <span className="mp-name">{c.name}</span>
          <span className="mp-time">{last ? last.t : ""}</span>
        </span>
        <span className="mp-row-bottom">
          <span className="mp-preview">{last ? last.text : c.isGroup ? c.members.length + " members" : ""}</span>
          {c.muted ?
          <DSPM.IconifyIcon name="lucide:bell-off" size={16} color="var(--gray-450)" /> :
          c.unread > 0 &&
          <span className="mp-badge">{c.unread}</span>
          }
        </span>
      </span>
    </button>);

}

function NewConversationScreenPM({ contacts, picked, onToggle, query, onQuery, groupName, onGroupName, onBack, onCreate }) {
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const count = picked.length;
  return (
    <div className="mp-new" data-screen-label="New Conversation">
      <header className="nt-head">
        <button className="nt-back" aria-label="Back to messages" onClick={onBack}>
          <DSPM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>New Conversation</h2>
      </header>
      <div className="nt-search mp-search">
        <DSPM.Icon name="search" size={20} color="var(--gray-450)" />
        <input type="text" placeholder="Search people" aria-label="Search people" value={query} onChange={(e) => onQuery(e.target.value)} />
      </div>
      {count > 1 &&
      <div className="mp-new-namewrap">
          <input type="text" className="mp-new-nameinput" placeholder="Name this group (optional)"
        aria-label="Group name" value={groupName} onChange={(e) => onGroupName(e.target.value)} />
        </div>}
      <div className="mp-new-list">
        {filtered.map((c) => {
          const on = picked.includes(c.id);
          return (
            <button key={c.id} className={"mp-new-row" + (on ? " on" : "")} onClick={() => onToggle(c.id)}>
              <span className="mp-av"><DSPM.Avatar name={c.name} src={c.avatar} size={44} /></span>
              <span className="mp-new-name">{c.name}</span>
              <span className={"mp-new-check" + (on ? " on" : "")}>
                {on && <DSPM.IconifyIcon name="lucide:check" size={13} color="#fff" />}
              </span>
            </button>);

        })}
        {filtered.length === 0 && <div className="mp-new-empty">No people found.</div>}
      </div>
      <div className="mp-new-footer">
        <span className="mp-new-count">{count} selected</span>
        <button className="mp-new-create" disabled={count === 0} onClick={onCreate}>
          {count > 1 ? "Create Group" : "Start Chat"}
        </button>
      </div>
    </div>);

}

function VoiceConfRowPM({ v }) {
  return (
    <div className="mp-row mp-vc-row">
      <span className="mp-av mp-vc-icon">
        <DSPM.IconifyIcon name="lucide:phone-call" size={22} color="var(--brand-navy)" />
      </span>
      <span className="mp-main">
        <span className="mp-row-top">
          <span className="mp-name">{v.name}</span>
          {v.live && <span className="mp-vc-live">LIVE</span>}
        </span>
        <span className="mp-row-bottom">
          <span className="mp-preview">{v.who}</span>
        </span>
        <span className="mp-vc-time">{v.t}</span>
      </span>
    </div>);

}

function MessagesPanelPM({ open, onClose }) {
  const [tab, setTab] = useStatePM("messages");
  const [query, setQuery] = useStatePM("");
  const [screen, setScreen] = useStatePM("list");
  const [groups, setGroups] = useStatePM([]);
  const [picked, setPicked] = useStatePM([]);
  const [ncQuery, setNcQuery] = useStatePM("");
  const [groupName, setGroupName] = useStatePM("");
  useEffectPM(() => {
    if (!open) { setQuery(""); setScreen("list"); setPicked([]); setNcQuery(""); setGroupName(""); } else
    { setGroups(readDmGroupsPM()); }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED_PM];
  const filtered = allThreads.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED_PM.reduce((n, t) => n + (t.unread || 0), 0);

  function openThread(id) {
    goPM("DirectMessage.html?id=" + id + "&from=ProfileMobile.html");
  }

  function togglePick(id) {
    setPicked((all) => all.includes(id) ? all.filter((x) => x !== id) : [...all, id]);
  }

  function handleCreate() {
    if (picked.length === 0) return;
    if (picked.length === 1) { openThread(picked[0]); return; }
    const members = DM_THREADS_SEED_PM.
    filter((c) => picked.includes(c.id)).
    map((c) => ({ id: c.id, name: c.name, avatar: c.avatar }));
    const group = createDmGroupPM(members, groupName);
    openThread(group.id);
  }

  if (screen === "new") {
    return (
      <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="m-drawer-scrim" onClick={onClose} />
        <aside className="m-drawer nt-panel mp-panel" role="dialog" aria-modal="true" aria-label="New Conversation">
          <NewConversationScreenPM contacts={DM_THREADS_SEED_PM} picked={picked} onToggle={togglePick}
            query={ncQuery} onQuery={setNcQuery} groupName={groupName} onGroupName={setGroupName}
            onBack={() => setScreen("list")} onCreate={handleCreate} />
        </aside>
      </div>);

  }

  return (
    <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="m-drawer-scrim" onClick={onClose} />
      <aside className="m-drawer nt-panel mp-panel" role="dialog" aria-modal="true" aria-label="Messages">
        <header className="nt-head">
          <button className="nt-back" aria-label="Close" onClick={onClose}>
            <DSPM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
          </button>
          <h2 style={{ fontSize: "26px", fontWeight: "700" }}>Messages</h2>
          <button className="mp-compose" aria-label="New message" onClick={() => setScreen("new")}>
            <DSPM.IconifyIcon name="lucide:square-pen" size={20} color="var(--gray-900)" />
          </button>
        </header>
        <div className="mp-tabs" role="tablist" aria-label="Messages or voice conference">
          <button role="tab" aria-selected={tab === "messages"} className={"mp-tab" + (tab === "messages" ? " on" : "")} onClick={() => setTab("messages")}>
            <DSPM.IconifyIcon name="lucide:message-circle" size={16} color={tab === "messages" ? "var(--brand-navy)" : "var(--gray-450)"} />
            Messages
            {unreadTotal > 0 && <span className="mp-tab-badge">{unreadTotal}</span>}
          </button>
          <button role="tab" aria-selected={tab === "voice"} className={"mp-tab" + (tab === "voice" ? " on" : "")} onClick={() => setTab("voice")}>
            <DSPM.IconifyIcon name="lucide:phone" size={16} color={tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"} />
            Voice Conference
            <span className="mp-tab-badge">{VOICE_CONFS_SEED_PM.length}</span>
          </button>
        </div>
        <div className="nt-search mp-search">
          <DSPM.Icon name="search" size={20} color="var(--gray-450)" />
          <input type="text" placeholder="Search messages" aria-label="Search messages" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="nt-body mp-body">
          {tab === "messages" ?
          filtered.map((c) => <MessagesRowPM key={c.id} c={c} onOpen={() => openThread(c.id)} />) :
          VOICE_CONFS_SEED_PM.map((v) => <VoiceConfRowPM key={v.id} v={v} />)
          }
        </div>
      </aside>
    </div>);

}

const PMTabBar = React.forwardRef(function PMTabBar({ compact }, ref) {
  return (
    <nav ref={ref} className={"pm-tabs" + (compact ? " pm-tabs-compact" : "")} aria-label="Primary">
      {PM_TABS.map((t) =>
      <button key={t.key} className={"pm-tab" + (t.key === "Profile" ? " on" : "")}
      aria-current={t.key === "Profile" ? "page" : undefined}
      onClick={() => t.href && goPM(t.href)}>
          <span className="ic">
            <DSPM.IconifyIcon name={t.icon} size={20} color={t.key === "Profile" ? "#fff" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          <span className="lbl">{t.label}</span>
        </button>
      )}
    </nav>);

});

function useHeaderHidePM(scrollRef) {
  const [hidden, setHidden] = useStatePM(false);
  useEffectPM(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY;
      if (y < 24) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

const PM_STEPS_INIT = [
  { ti: "Add a profile photo", su: "Priority action", state: "priority" },
  { ti: "Write your bio", su: "Complete", state: "done" },
  { ti: "Add your location", su: "Complete", state: "done" },
  { ti: "Verify your credentials", su: "Incomplete", state: "todo" },
  { ti: "Connect your social profiles", su: "Incomplete", state: "todo" },
];

/* ===========================================================================
   "Get to know you" — self-assessment hub (renamed from "Self-Assessment"
   per Tim's request). Five assessments: the 4 scored Prosperity Spiral
   pillars (content ported from the Facial Aesthetic Practice Diagnostic &
   Clinical Maturity Assessment) plus a 5th, non-scored "Dream & Vision"
   assessment (content ported from the Aesthetic Clinician Dream & Vision
   Assessment V2) that exists purely to help build the clinician's vision —
   it never touches a pillar score.
   =========================================================================== */

const PM_ARCHETYPE_LETTERS = ["A", "B", "C", "D"];

/* ---- Pillar assessments (scored) — 7 questions each, A-D = 1-4 pts, max 28 ---- */
const PM_PILLAR_ASSESSMENTS = {
  "Marketing": {
    label: "Marketing", timeMin: 3,
    questions: [
      { q: "How do most of your new patients currently find out about your clinic?", opts: [
        "Almost entirely word-of-mouth or walk-ins; I rarely advertise.",
        "Organic social media posts (Instagram/TikTok), but results are inconsistent.",
        "A structured mix of organic social media, targeted paid ads, and active patient referral programs.",
        "Multi-channel digital campaigns (omnichannel) with predictable Customer Acquisition Cost (CAC) tracking." ] },
      { q: "How would you describe your presence on platforms like Instagram/TikTok?", opts: [
        "I post occasionally without a strategy, mainly generic before-and-after photos or stock images.",
        "I post regularly, showing face treatments, but I struggle to convert followers into booked appointments.",
        "I consistently post educational content, patient transformations, and video reels showing my expertise.",
        "I have a strategic content calendar featuring personal branding, procedure deep-dives, and clear CTAs linked directly to a booking funnel." ] },
      { q: "How do you approach paid digital advertising (Meta Ads, Google Search, etc.)?", opts: [
        "I don't run paid ads at all.",
        "I occasionally hit “Boost Post” on Instagram when bookings slow down.",
        "I run dedicated ad campaigns targeting local demographics specifically for high-margin face procedures.",
        "I work with/manage an ads agency to run optimized lead-generation campaigns with a known Cost Per Lead (CPL)." ] },
      { q: "What happens when a prospective patient sees your content or website?", opts: [
        "They have to DM or call during business hours to ask for info.",
        "There is a link to my contact page or Instagram DM, but response times vary.",
        "They can instantly book a consultation via an online calendar or fill out a dedicated lead form.",
        "They enter an automated funnel (instant WhatsApp/SMS follow-up, landing page, self-scheduling tool)." ] },
      { q: "How optimized is your local digital footprint (Google Business Profile, local search)?", opts: [
        "I'm not sure if my Google profile is claimed or up to date.",
        "My Google listing exists, but I rarely request reviews or update photos.",
        "My profile is fully optimized with weekly photos, clear treatment descriptions, and regular patient reviews.",
        "I rank in the top 3 locally for keywords like “fillers,” “botox,” or “facial rejuvenation” and actively manage multi-platform review flows." ] },
      { q: "How clearly defined is your ideal patient persona for high-ticket face treatments?", opts: [
        "I welcome anyone who wants any facial treatment.",
        "I know generally who my best patients are, but my marketing targets everyone equally.",
        "I tailor content specifically to key age segments (e.g., preventative anti-aging vs. full facial harmonization).",
        "I have hyper-specific patient avatars and position myself as a premium niche authority." ] },
      { q: "How accurately do you track where your incoming queries originate?", opts: [
        "I don't ask or record how patients hear about us.",
        "I ask during the in-person consultation, but it isn't systematically logged.",
        "My receptionist or practice management software logs the source for every new booking.",
        "I use full attribution tracking linking ad campaigns directly to consultation conversion rates and lifetime value." ] }
    ]
  },
  "Sales": {
    label: "Sales", timeMin: 3,
    questions: [
      { q: "When a prospective patient submits an inquiry online or on social media, how quickly do they receive a response?", opts: [
        "Within 24–48 hours, depending on staff availability.",
        "Within 4–8 hours during regular clinic operating hours.",
        "Within 15–30 minutes via trained administrative staff.",
        "Instantly (< 5 minutes) via automated multi-channel messaging followed by personal contact." ] },
      { q: "How is your facial aesthetic consultation structured?", opts: [
        "The patient tells me what they want, and I quote them a price.",
        "I examine their face, discuss their main complaint, and suggest a couple of treatment options.",
        "I conduct a standardized full-face assessment and present a tailored plan.",
        "I use a structured 5-step consultation framework (Discovery, Full-Face Diagnostics, Solution Mapping, Handling Objections, Treatment Plan Presentation)." ] },
      { q: "How often do you sell comprehensive treatment plans instead of single syringes or single zones?", opts: [
        "Rarely; most patients buy single treatments/zones.",
        "Occasionally, if the patient brings up multiple concerns during the visit.",
        "Frequently; I consistently educate patients on why full-face rejuvenation yields better, more natural results.",
        "Almost always; my baseline consultation output is a phased 6–12 month facial treatment roadmap." ] },
      { q: "When a patient says, “That’s too expensive,” how do you or your team respond?", opts: [
        "I feel uncomfortable, reduce the price, or let them walk away without follow-up.",
        "I explain that our products/services are high quality, but I don't have a structured framework to navigate it.",
        "I reframe the value around safety, artistic expertise, and long-term results rather than product volume.",
        "I confidently isolate the concern, articulate our unique value proposition, and offer structured payment options." ] },
      { q: "What happens when a patient attends a consultation but leaves without booking a treatment?", opts: [
        "Nothing; we wait for them to contact us when they are ready.",
        "Staff sends a single follow-up message or call a few days later.",
        "We execute a 3-step follow-up protocol over 14 days across email, phone, and messaging.",
        "They are placed into an automated lead-nurturing sequence." ] },
      { q: "How trained is your front-desk/reception staff in closing sales and booking consultations over the phone?", opts: [
        "They handle scheduling only; they do not sell or pitch.",
        "They answer basic pricing questions when asked, but lack formal sales training.",
        "They follow basic scripts to qualify callers and emphasize clinic value before discussing prices.",
        "They undergo monthly sales call coaching, handle objections fluently, and hit targets for consultation-booking conversion rates." ] },
      { q: "When is a patient's next appointment booked after completing a facial procedure?", opts: [
        "They are told to call us when they feel they need a touch-up.",
        "We send a reminder email/SMS several months after their treatment.",
        "We request they book their follow-up/maintenance appointment at the checkout desk before leaving.",
        "Every patient leaves with a long-term maintenance calendar already integrated into their digital profile." ] }
    ]
  },
  "Clinical Skills": {
    label: "Clinical Skills", timeMin: 3,
    questions: [
      { q: "How comfortable are you with detailed facial vascular anatomy and ultrasound/mapping techniques?", opts: [
        "I rely on basic anatomical knowledge from initial training courses.",
        "I know major arterial pathways well, but I feel anxious treating high-risk areas (e.g., glabella, nose, temples).",
        "I have advanced knowledge of facial layers, fat pads, and vascular danger zones, using strict aspiration/cannula protocols.",
        "I am fully confident in multi-layer facial anatomy, actively use/understand Doppler ultrasound, and can teach anatomical mapping." ] },
      { q: "How prepared are you to identify and treat severe clinical complications (e.g., vascular occlusion, delayed-type hypersensitivity)?", opts: [
        "I have a basic emergency kit, but I would feel extremely panicked if a vascular occlusion occurred.",
        "I know the hyaluronidase protocol conceptually, but have rarely or never practiced emergency protocols hands-on.",
        "I have a written, accessible emergency protocol and emergency kit, and I am trained to dissolve or treat complications immediately.",
        "I regularly audit our emergency protocols, train my team on mock complications, and feel 100% confident managing complex cases." ] },
      { q: "Which range of facial injectables do you routinely and confidently perform?", opts: [
        "Basic neurotoxins and simple hyaluronic acid (HA) filler in low-risk zones (lips, nasolabial folds).",
        "Standard HA fillers across mid-face, lips, and chin, plus basic tox treatments.",
        "Advanced HA techniques, structural bio-stimulators (e.g., Sculptra, Radiesse), and pan-facial toxin placement.",
        "Comprehensive combination therapy: biostimulators, high-G' fillers, polynucleotides, skin boosters, and precision toxin micro-dosing." ] },
      { q: "How experienced are you with advanced facial procedures (e.g., non-surgical rhinoplasty, temple restoration, jawline contouring, tear troughs)?", opts: [
        "I do not offer these procedures due to lack of confidence or training.",
        "I perform 1 or 2 of these, but only on carefully selected “easy” anatomical candidates.",
        "I perform all these procedures regularly using both needle and blunt-tip cannula techniques.",
        "I specialize in high-complexity facial harmonizations and treat difficult or revision cases regularly." ] },
      { q: "How well do you combine injectables with skin rejuvenation modalities (lasers, microneedling RF, chemical peels)?", opts: [
        "I only perform injectables; skin treatments are outside my scope/interest.",
        "I refer patients out for skin treatments or suggest basic facials occasionally.",
        "I build combined treatment plans integrating EBDs/topicals to improve skin quality alongside structural injectables.",
        "I master multi-layer tissue rejuvenation, combining regenerative medicine (PRP/PRF/Exosomes), energy devices, and structural injectables." ] },
      { q: "How do you approach aesthetic harmonisation and proportions during facial evaluation?", opts: [
        "I focus solely on fixing the line or fold the patient points out to me.",
        "I look at individual features (e.g., cheeks, lips) and suggest treatments for those specific areas.",
        "I evaluate dynamic facial expressions, profile balance, golden ratios, and structural volume loss across all facial thirds.",
        "I assess facial kinetics, bone resorption patterns, superficial/deep fat compartments, and skin laxity to deliver undetectable, natural rejuvenation." ] },
      { q: "How frequently do you invest in hands-on clinical training, cadaver dissections, or masterclasses?", opts: [
        "Only when required for mandatory license/certification renewal.",
        "Once every year or two via vendor-sponsored webinar workshops.",
        "At least once a year through paid, independent hands-on masterclasses or conferences.",
        "Multiple times a year, including cadaver lab training, 1-on-1 expert mentorship, and peer shadowing." ] }
    ]
  },
  "Business Systems": {
    label: "Business Systems", timeMin: 3,
    questions: [
      { q: "How closely do you monitor your clinic's financial health and operational KPIs?", opts: [
        "I check my overall bank balance at the end of the month to see if we made money.",
        "I track monthly revenue, but I don't calculate precise net profits, margins, or overhead costs.",
        "I regularly monitor Revenue, Gross Profit Margin, Average Order Value (AOV), and Rebooking Rate.",
        "I use a full financial dashboard tracking CAC, Lifetime Value (LTV), Treatment Profitability per Minute, and Fixed vs. Variable Overhead." ] },
      { q: "How did you determine the pricing for your facial aesthetic treatments?", opts: [
        "I copied what other local clinics down the street are charging.",
        "I added a basic markup over product cost (e.g., tox unit cost or filler syringe cost).",
        "I calculated product costs plus hourly practitioner labor and basic overhead to set margins.",
        "I price based on clinical value and outcome, factor in exact hourly chair-cost metrics, and maintain >70% gross margins on treatments." ] },
      { q: "How reliant is the clinic's daily operations on your personal physical presence?", opts: [
        "Completely; if I don't open the door and treat patients, nothing happens and no income is generated.",
        "I have basic staff (receptionist/assistant), but I handle almost all clinical and administrative decisions myself.",
        "I have documented Standard Operating Procedures (SOPs) for front-desk, inventory, intake, and follow-ups.",
        "The clinic operates smoothly under clinical/administrative SOPs; I can step away for weeks without operations stalling." ] },
      { q: "How do you manage product stock (neurotoxins, fillers, consumables)?", opts: [
        "We order products when we realize mid-day that we have run out.",
        "We reorder manually whenever stock looks low on the shelf.",
        "We use practice management software to track stock levels and reorder at set inventory thresholds.",
        "We maintain a strict Just-In-Time (JIT) inventory protocol with automated reordering, stock audits, and zero-waste tracking." ] },
      { q: "What is your clinical delegation and staff compensation structure?", opts: [
        "I work as a solo practitioner with no clinical or administrative support staff.",
        "I employ administrative support, but pay hourly flat rates without performance incentives.",
        "I employ injectors/aesthetic nurses and offer tier-based commission or bonus structures tied to revenue targets.",
        "I run an empowered team of providers and administrative staff driven by clear KPIs, career growth plans, and culture alignment." ] },
      { q: "How effectively do you utilize medical software / CRM systems?", opts: [
        "Paper charts, manual scheduling books, or basic digital calendars.",
        "Standard medical software used primarily for scheduling and basic clinical notes.",
        "Integrated practice management software handling e-charts, automated photo storage, online booking, and SMS reminders.",
        "Fully integrated CRM and EHR automating patient intake, photography, treatment mapping, marketing campaigns, and review requests." ] },
      { q: "What is your 1- to 3-year vision for your aesthetic practice?", opts: [
        "To keep working hard and hopefully increase my monthly treatment volume.",
        "To add a new treatment machine or hire an extra assistant within the next year.",
        "To systematically increase high-ticket treatment revenue, reduce working hours, and expand provider staff.",
        "A clear, multi-year plan focused on enterprise valuation, opening secondary locations, or transitioning to owner-operator/board level." ] }
    ]
  }
};

/* ---- Dream & Vision (non-scored) — 10 questions, tallied by letter to
   surface a "Vision Profile" archetype; never affects a pillar score. ---- */
const PM_DREAM_VISION = {
  label: "Dream & Vision", timeMin: 4,
  questions: [
    { q: "What is your ideal target for annual personal take-home income / net profit from your practice within the next 2–3 years?", opts: [
      "£100,000–£250,000/year — a comfortable, sustainable practitioner lifestyle.",
      "£250,000–£500,000/year — a high-earner solo provider or small boutique clinic.",
      "£500,000–£1,000,000/year — a top-tier aesthetic business owner with multiple revenue streams.",
      "£1,000,000+/year — a seven-figure net enterprise / multi-location business owner." ] },
    { q: "When you imagine your ultimate business structure, what does it look like?", opts: [
      "High-end boutique solo practice — I stay the main/only injector, treating fewer patients at ultra-premium prices.",
      "Collaborative team clinic — a single-location clinic with 2–4 associate injectors and aesthetic therapists.",
      "Multi-location brand — expanding to 2+ clinic sites with standardized operating procedures and delegation.",
      "Passive/owner-operator model — a clinic that runs without my physical clinical presence, freeing me for strategy, training, or other ventures." ] },
    { q: "How do you want to be recognized within the aesthetic community and by prospective patients?", opts: [
      "The local go-to expert — the most trusted, safe, and natural-looking injector in my city/neighbourhood.",
      "The niche master practitioner — recognized regionally or nationally for a specialized signature technique.",
      "Key Opinion Leader (KOL) & international trainer — teaching on global stages, training for brands, mentoring other clinicians.",
      "Aesthetic brand innovator — building a proprietary skincare line, training academy, or franchisable aesthetic concept." ] },
    { q: "Which clinical mastery focus aligns best with your dream daily practice?", opts: [
      "Core facial injectable mastery — perfecting high-end dermal filler and neurotoxin techniques with flawless natural outcomes.",
      "Advanced regenerative & biostimulatory specialist — mastering polynucleotides, Sculptra, Radiesse, exosomes, and cellular rejuvenation.",
      "High-tech energy & combination therapy leader — combining advanced injectables with high-tier lasers, RF microneedling, and ultrasound devices.",
      "Precision anatomy & ultrasound pioneer — becoming a leader in ultrasound-guided facial mapping and complex complication correction." ] },
    { q: "In your ideal week, how many hours do you personally want to spend treating patients at the chair?", opts: [
      "Full-time clinical (32–40 hours/week) — I love treating patients above all else.",
      "Balanced hybrid (16–24 hours/week) — part-time clinical, with the rest on business, marketing, or personal life.",
      "Minimal clinical presence (8–12 hours/week) — seeing only VIP/high-ticket patients while running the business behind the scenes.",
      "Zero chair time (0 hours/week) — fully retired from injecting to focus on business leadership, investments, or teaching." ] },
    { q: "What style of patient experience do you dream of delivering in your practice?", opts: [
      "Concierge / ultra-luxury white-glove service — low volume, long appointments, extreme high-ticket pricing.",
      "High-efficiency modern aesthetics — seamless digital experience, fast turnaround, competitive premium packages.",
      "Holistic / wellness-integrated rejuvenation — combining facial aesthetics with longevity, hormones, and skin health.",
      "Express / accessible membership model — predictable recurring revenue through membership tiers and high retention." ] },
    { q: "How would you feel most fulfilled and comfortable attracting your ideal patients?", opts: [
      "100% organic authority & personal brand — a strong social media presence with educational content and personal branding.",
      "Systematized digital ads & paid funnels — running automated campaigns and funnel systems behind the scenes.",
      "Referral-only & VIP network — operating quietly through word-of-mouth, cross-referrals, and exclusive VIP events.",
      "Media & public relations (PR) — being featured in magazines, podcasts, news, and celebrity aesthetics." ] },
    { q: "What role do you want to play in managing and developing your team?", opts: [
      "Solo operator — no desire to manage employees; minimal virtual administrative support.",
      "Supportive mentor & boss — leading a tight-knit team of 2–5 in a family-style, high-trust workplace.",
      "Executive leader (CEO) — managing managers, setting high-level strategy, driving KPIs, scaling culture.",
      "Clinical director / master trainer — focusing on clinical quality and training providers while a Practice Manager runs operations." ] },
    { q: "What is your ultimate 5- to 10-year exit or legacy objective for your practice?", opts: [
      "Lifestyle career — a flexible, lucrative practice enjoyed year over year until retirement.",
      "Sellable asset / practice buyout — a scalable clinic with recurring revenue that could be acquired.",
      "Family business / partnership legacy — passing down the clinic or bringing in clinical partners long-term.",
      "Franchise or brand equity — licensing or franchising your brand, protocol, or product line internationally." ] },
    { q: "At this exact stage of your career, what is the single biggest driver behind your ambition?", opts: [
      "Financial freedom & security — building wealth, paying off debts, generating significant personal revenue.",
      "Time freedom & flexibility — gaining control over my calendar for family, travel, and personal passions.",
      "Artistic mastery & passion for aesthetics — deep love for the craft, facial harmony, and perfecting technical skill.",
      "Entrepreneurial impact & scaling — the excitement of building something big and leading a team." ] }
  ]
};

const PM_ARCHETYPES = {
  A: { name: "The Boutique Craftsman", desc: "Ultra-premium pricing, personal branding, concierge service, and high-ticket full-face packages — without expanding team complexity." },
  B: { name: "The Balanced Practice Owner", desc: "Delegation, associate injector onboarding, predictable digital marketing funnels, and reducing chair-time to achieve work-life balance." },
  C: { name: "The Authority & Educator", desc: "Advanced anatomical mastery, speaker/KOL development, specialised signature techniques, training academies, and media PR." },
  D: { name: "The Enterprise Scaling CEO", desc: "Multi-location SOPs, financial dashboards, team leadership/compensation models, and build-to-sell valuation strategies." }
};

/* Order the hub renders tiles in — Dream & Vision always last since it's the
   "bonus" non-scoring assessment. */
const PM_ASSESS_ORDER = ["Marketing", "Sales", "Clinical Skills", "Business Systems", "dreamVision"];
function pmAssessDef(key) { return key === "dreamVision" ? PM_DREAM_VISION : PM_PILLAR_ASSESSMENTS[key]; }

const PM_ASSESS_STATUS_LABEL = { not_started: "Not started", in_progress: "In progress", completed: "Completed" };
function pmAssessStatus(entry) {
  if (!entry) return "not_started";
  if (entry.status === "completed") return "completed";
  if (entry.answers && entry.answers.some((a) => a != null)) return "in_progress";
  return "not_started";
}

/* ---- Question wizard — shared by all 5 assessments. Pillar assessments
   score on finish (rawPoints out of 28); Dream & Vision tallies a dominant
   letter and reveals an archetype instead of a score. ---- */
function PMAssessWizard({ assessKey, def, initialAnswers, onProgress, onComplete, onClose }) {
  const questions = def.questions;
  const total = questions.length;
  const scored = assessKey !== "dreamVision";
  const [step, setStep] = useStatePM(() => {
    const init = initialAnswers || questions.map(() => null);
    const firstUnanswered = init.findIndex((a) => a == null);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [answers, setAnswers] = useStatePM(() => initialAnswers || questions.map(() => null));
  const [finished, setFinished] = useStatePM(false);

  useEffectPM(() => { if (!finished) onProgress(answers); }, [answers]);

  const cur = questions[step];
  const pct = Math.round(((step + 1) / total) * 100);

  function pick(i) {
    const next = answers.slice();
    next[step] = i;
    setAnswers(next);
  }
  function goNext() {
    if (step === total - 1) { onComplete(answers); setFinished(true); }
    else setStep((s) => s + 1);
  }
  function goBack() { setStep((s) => Math.max(0, s - 1)); }

  return (
    <div className="pm-wiz-overlay" role="dialog" aria-modal="true" aria-label={def.label}>
      <div className="pm-wiz-card">
        <div className="pm-wiz-hd">
          <span style={{ width: 22 }} />
          <span className="pm-wiz-hd-ti">{def.label}</span>
          <button className="pm-wiz-close" aria-label="Close" onClick={onClose}>
            <DSPM.IconifyIcon name="lucide:x" size={22} color="var(--gray-700)" />
          </button>
        </div>

        {!finished ? (
          <div className="pm-wiz-body">
            <p className="pm-wiz-sub">
              {scored
                ? "Answer honestly — this sets your baseline. Course progress can still carry this pillar all the way to 100%."
                : "Non-scored — this just helps us understand your goals so we can build your vision with you."}
            </p>
            <div className="pm-wiz-progress">
              <span className="pm-wiz-track"><span style={{ width: pct + "%" }} /></span>
              <span className="pm-wiz-count">{step + 1} of {total}</span>
            </div>
            <div className="pm-wiz-q">{cur.q}</div>
            <div className="pm-wiz-opts" role="radiogroup" aria-label={cur.q}>
              {cur.opts.map((o, i) =>
              <button key={i} type="button" className={"pm-wiz-opt" + (answers[step] === i ? " on" : "")}
                role="radio" aria-checked={answers[step] === i} onClick={() => pick(i)}>
                  <span className="pm-wiz-opt-letter">{PM_ARCHETYPE_LETTERS[i]}</span>
                  <span className="pm-wiz-opt-tx">{o}</span>
                </button>
              )}
            </div>
            <div className="pm-wiz-nav">
              {step > 0 && <button type="button" className="pm-wiz-back" onClick={goBack}>Back</button>}
              <button type="button" className="pm-wiz-next" disabled={answers[step] == null} onClick={goNext}>
                {step === total - 1 ? "See results" : "Continue"}
              </button>
            </div>
          </div>
        ) : (
          <PMAssessResult scored={scored} answers={answers} onClose={onClose} />
        )}
      </div>
    </div>);

}

function PMAssessResult({ scored, answers, onClose }) {
  if (scored) {
    const raw = answers.reduce((sum, a) => sum + (a + 1), 0);
    const max = answers.length * 4;
    return (
      <div className="pm-wiz-body pm-wiz-result">
        <div className="pm-wiz-result-icon"><DSPM.IconifyIcon name="lucide:check" size={32} color="#fff" /></div>
        <h3>Assessment complete</h3>
        <p className="pm-wiz-result-score">{raw} / {max} points</p>
        <p className="pm-wiz-result-note">This sets your baseline for this pillar — course progress can still carry it all the way to 100%.</p>
        <button type="button" className="pm-wiz-done-btn" onClick={onClose}>Back to assessments</button>
      </div>);

  }
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  answers.forEach((a) => { counts[PM_ARCHETYPE_LETTERS[a]]++; });
  const dominant = PM_ARCHETYPE_LETTERS.reduce((best, l) => counts[l] > counts[best] ? l : best, "A");
  const arch = PM_ARCHETYPES[dominant];
  return (
    <div className="pm-wiz-body pm-wiz-result">
      <div className="pm-wiz-result-icon pm-wiz-result-icon--vision"><DSPM.IconifyIcon name="lucide:sparkles" size={32} color="#fff" /></div>
      <h3>Your Vision Profile</h3>
      <p className="pm-wiz-result-arch">{arch.name}</p>
      <p className="pm-wiz-result-note">{arch.desc}</p>
      <p className="pm-wiz-result-note pm-wiz-result-note--muted">This doesn't change your Prosperity Spiral — it just helps us (and your mentor) understand where you want your clinic to go.</p>
      <button type="button" className="pm-wiz-done-btn" onClick={onClose}>Back to assessments</button>
    </div>);

}

function PMAssessHubTile({ assessKey, def, entry, onOpen }) {
  const status = pmAssessStatus(entry);
  const scored = assessKey !== "dreamVision";
  const scoreChip = status === "completed" && scored
    ? Math.round((entry.rawPoints / (def.questions.length * 4)) * 100) + "%"
    : null;
  return (
    <button type="button" className={"pm-hub-tile pm-hub-tile--" + status} onClick={() => onOpen(assessKey)}>
      <div className="pm-hub-tile-top">
        <span className="ti">{def.label}</span>
        <span className={"pm-hub-badge pm-hub-badge--" + status}>{PM_ASSESS_STATUS_LABEL[status]}</span>
      </div>
      <div className="pm-hub-tile-bottom">
        <span className="su"><DSPM.IconifyIcon name="lucide:clock" size={13} color="var(--gray-500)" />~{def.timeMin} mins</span>
        {scoreChip && <span className="pm-hub-score">{scoreChip}</span>}
      </div>
    </button>);

}

/* Assessment Selection Screen (PRD 3.1) — 4 pillar tiles + Dream & Vision,
   opened from the "Get to know you" entry point in Complete Your Profile. */
function PMAssessHelpModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="pm-help-overlay" onClick={onClose}>
      <div className="pm-help-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="How self-assessments work">
        <div className="pm-help-hd">
          <span className="pm-help-icon"><DSPM.IconifyIcon name="lucide:compass" size={18} color="var(--ai-purple)" /></span>
          <h3>How self-assessments work</h3>
          <button className="pm-help-x" aria-label="Close" onClick={onClose}>
            <DSPM.IconifyIcon name="lucide:x" size={20} color="var(--gray-500)" />
          </button>
        </div>
        <div className="pm-help-body">
          <p>Each pillar assessment gives you a score based on your real-world experience and honest self-evaluation — there are no wrong answers, just an honest snapshot of where your clinic is today.</p>
          <p>That score becomes the starting point for your personalised journey plan — it's how Ava (and your mentor) know where to focus your coaching first.</p>
          <p>It also feeds directly into your Prosperity Spiral: your self-assessment sets the baseline for each pillar, and completing courses can carry it the rest of the way to 100%.</p>
          <p>Dream &amp; Vision works differently — it's never scored. It simply helps us understand your goals so we can build your journey around them.</p>
          <button type="button" className="pm-help-coach pf-coach-link" data-coach="Explain how my self-assessment scores work and how they feed my Prosperity Spiral." onClick={onClose}>
            <DSPM.IconifyIcon name="lucide:sparkles" size={14} color="var(--ai-purple)" />Ask Ava
          </button>
        </div>
      </div>
    </div>);

}

function PMAssessHub({ assessState, onOpenAssess, onClose }) {
  const [helpOpen, setHelpOpen] = useStatePM(false);
  return (
    <div className="pm-wiz-overlay" role="dialog" aria-modal="true" aria-label="Get to know you">
      <div className="pm-wiz-card">
        <div className="pm-wiz-hd">
          <span style={{ width: 22 }} />
          <span className="pm-wiz-hd-ti">Get to know you</span>
          <button className="pm-wiz-close" aria-label="Close" onClick={onClose}>
            <DSPM.IconifyIcon name="lucide:x" size={22} color="var(--gray-700)" />
          </button>
        </div>
        <div className="pm-wiz-body pm-hub-body">
          <div className="pm-hub-intro">
            <DSPM.IconifyIcon name="lucide:sparkles" size={18} color="var(--ai-purple)" />
            <p>We use these to get to know you — your strengths, your gaps, and your dreams for your clinic — so Ava can guide your journey and your Prosperity Spiral reflects where you really are.</p>
          </div>
          <button type="button" className="pm-hub-help" onClick={() => setHelpOpen(true)}>
            <DSPM.IconifyIcon name="lucide:circle-help" size={15} color="var(--gray-500)" />How it works
          </button>
          <div className="pm-hub-grid">
            {PM_ASSESS_ORDER.map((key) =>
            <PMAssessHubTile key={key} assessKey={key} def={pmAssessDef(key)} entry={assessState[key]} onOpen={onOpenAssess} />
            )}
          </div>
        </div>
      </div>
      <PMAssessHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>);

}

/* ---- Step sheet: Photo ---- */
function PhotoStep({ onComplete, isDone }) {
  const [chosen, setChosen] = useStatePM(null);
  return (
    <div className="pm-sheet-step">
      <div className="pm-sheet-av">
        <DSPM.Avatar name="Katy Wilson" src="assets/avatar-katy.jpg" size={88} />
        <span className="pm-sheet-av-edit"><DSPM.IconifyIcon name="lucide:camera" size={15} color="#fff" /></span>
      </div>
      {isDone && <p className="pm-sheet-note">Your profile photo is set. You can update it anytime.</p>}
      <div className="pm-sheet-opts">
        <button className={"pm-sheet-opt" + (chosen === "camera" ? " sel" : "")} onClick={() => setChosen("camera")}>
          <DSPM.IconifyIcon name="lucide:camera" size={22} color="var(--brand-navy)" /><span>Take a photo</span>
        </button>
        <button className={"pm-sheet-opt" + (chosen === "library" ? " sel" : "")} onClick={() => setChosen("library")}>
          <DSPM.IconifyIcon name="lucide:image" size={22} color="var(--brand-navy)" /><span>Choose from library</span>
        </button>
      </div>
      {chosen && <button className="pm-sheet-cta" onClick={onComplete}>Upload & Save Photo</button>}
    </div>
  );
}

/* ---- Step sheet: Bio ---- */
function BioStep({ onComplete }) {
  const [bio, setBio] = useStatePM(PM_ME.bio);
  const max = 300;
  return (
    <div className="pm-sheet-step">
      <p className="pm-sheet-desc">Write a short bio that tells people about your professional background and specialisations.</p>
      <div className="pm-sheet-field">
        <textarea className="pm-sheet-ta" value={bio} maxLength={max} rows={5}
          onChange={e => setBio(e.target.value)}
          placeholder="e.g. Aesthetic nurse with 10+ years experience in botox and dermal fillers…" />
        <span className="pm-sheet-count">{bio.length}/{max}</span>
      </div>
      <button className="pm-sheet-cta" onClick={onComplete} disabled={bio.trim().length < 10}>Save Bio</button>
    </div>
  );
}

/* ---- Step sheet: Location ---- */
function LocationStep({ onComplete }) {
  const [loc, setLoc] = useStatePM("London, United Kingdom");
  const [detecting, setDetecting] = useStatePM(false);
  function detect() {
    setDetecting(true);
    setTimeout(() => { setLoc("London, United Kingdom"); setDetecting(false); }, 1200);
  }
  return (
    <div className="pm-sheet-step">
      <p className="pm-sheet-desc">Add your location so patients and peers can find you.</p>
      <div className="pm-sheet-field">
        <input className="pm-sheet-inp" value={loc} onChange={e => setLoc(e.target.value)} placeholder="City, Country" />
      </div>
      <button className="pm-sheet-ghost" onClick={detect} disabled={detecting}>
        <DSPM.IconifyIcon name="lucide:map-pin" size={18} color="var(--brand-navy)" />
        {detecting ? "Detecting…" : "Use my current location"}
      </button>
      <button className="pm-sheet-cta" onClick={onComplete} disabled={loc.trim().length < 2}>Save Location</button>
    </div>
  );
}

/* ---- Step sheet: Credentials ---- */
function CredentialsStep({ onComplete }) {
  const [nmcNum, setNmcNum] = useStatePM("");
  const [submitted, setSubmitted] = useStatePM(false);
  if (submitted) {
    return (
      <div className="pm-sheet-step pm-sheet-center">
        <div className="pm-sheet-icon-wrap success"><DSPM.IconifyIcon name="lucide:clock" size={32} color="var(--success)" /></div>
        <h4>Verification Submitted</h4>
        <p className="pm-sheet-desc">Your credentials are under review. We'll notify you within 1–2 business days.</p>
        <button className="pm-sheet-cta" onClick={onComplete}>Got it</button>
      </div>
    );
  }
  return (
    <div className="pm-sheet-step">
      <p className="pm-sheet-desc">Enter your NMC or GMC registration number to verify your professional credentials.</p>
      <div className="pm-sheet-field">
        <label className="pm-sheet-label">NMC / GMC Number</label>
        <input className="pm-sheet-inp" value={nmcNum} onChange={e => setNmcNum(e.target.value)} placeholder="e.g. 12A3456B" />
      </div>
      <button className="pm-sheet-ghost">
        <DSPM.IconifyIcon name="lucide:upload" size={18} color="var(--brand-navy)" />Upload supporting documents
      </button>
      <button className="pm-sheet-cta" onClick={() => setSubmitted(true)} disabled={nmcNum.trim().length < 5}>Submit for Verification</button>
    </div>
  );
}

/* ---- Step sheet: Social profiles ---- */
const PM_SOCIALS = [
  { key: "linkedin", icon: "mdi:linkedin", color: "#0A66C2", label: "LinkedIn" },
  { key: "instagram", icon: "mdi:instagram", color: "#E1306C", label: "Instagram" },
  { key: "twitter", icon: "mdi:twitter", color: "#1DA1F2", label: "X / Twitter" },
  { key: "facebook", icon: "mdi:facebook", color: "#1877F2", label: "Facebook" },
];

function SocialStep({ onComplete }) {
  const [connected, setConnected] = useStatePM([]);
  function toggle(key) {
    setConnected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }
  return (
    <div className="pm-sheet-step">
      <p className="pm-sheet-desc">Link your social profiles to build trust and grow your network.</p>
      <div className="pm-sheet-socials">
        {PM_SOCIALS.map(s => {
          const on = connected.includes(s.key);
          return (
            <div key={s.key} className="pm-sheet-social">
              <DSPM.IconifyIcon name={s.icon} size={28} color={s.color} />
              <span className="pm-sheet-social-nm">{s.label}</span>
              <button className={"pm-sheet-social-btn" + (on ? " connected" : "")} onClick={() => toggle(s.key)}>
                {on ? "Connected" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
      {connected.length > 0 && <button className="pm-sheet-cta" onClick={onComplete}>Save Connections</button>}
    </div>
  );
}

/* ---- Bottom sheet wrapper ---- */
function StepSheet({ step, idx, onComplete, onClose }) {
  return (
    <div className="pm-sheet-overlay" onClick={onClose}>
      <div className="pm-sheet" onClick={e => e.stopPropagation()}>
        <div className="pm-sheet-drag" />
        <div className="pm-sheet-hd">
          <h3>{step.ti}</h3>
          <button className="pm-sheet-close" onClick={onClose} aria-label="Close">
            <DSPM.IconifyIcon name="lucide:x" size={20} color="var(--gray-600)" />
          </button>
        </div>
        <div className="pm-sheet-body">
          {idx === 0 && <PhotoStep onComplete={onComplete} isDone={step.state === "done"} />}
          {idx === 1 && <BioStep onComplete={onComplete} isDone={step.state === "done"} />}
          {idx === 2 && <LocationStep onComplete={onComplete} isDone={step.state === "done"} />}
          {idx === 3 && <CredentialsStep onComplete={onComplete} isDone={step.state === "done"} />}
          {idx === 4 && <SocialStep onComplete={onComplete} isDone={step.state === "done"} />}
        </div>
      </div>
    </div>
  );
}

/* ---- Profile complete success banner ---- */
function ProfileCompleteCard({ onDismiss }) {
  useEffectPM(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="pm-steps-success" aria-live="polite">
      <div className="pm-steps-success-icon">
        <DSPM.IconifyIcon name="lucide:check" size={36} color="#fff" />
      </div>
      <h3 className="pm-steps-success-h">Profile Complete!</h3>
      <p className="pm-steps-success-sub">Your profile is fully set up. You're ready to connect with the community.</p>
      <button className="pm-steps-success-btn" onClick={onDismiss}>Got it</button>
    </div>
  );
}

/* Shared by every "collapse to a summary row / expand to a two-pane slide-
   over" section (Complete Your Profile, Track Your Goals): measures
   whichever pane is currently visible and returns a height to drive the
   outer viewport, so the hidden pane's (often taller) content never forces
   extra blank space. A ResizeObserver — rather than a one-shot measurement
   — keeps this correct even as icon web components finish
   upgrading/rendering after first paint, or list content changes length. */
function usePMSlidePaneHeight(expanded, deps) {
  const collapsedRef = React.useRef(null);
  const expandedRef = React.useRef(null);
  const [height, setHeight] = useStatePM(null);
  React.useLayoutEffect(() => {
    const el = expanded ? expandedRef.current : collapsedRef.current;
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [expanded, ...(deps || [])]);
  return { collapsedRef, expandedRef, height };
}

/* ---- Profile steps card ---- */
function ProfileSteps({ assessState, onAssessPatch }) {
  const [steps, setSteps] = useStatePM(() => PM_STEPS_INIT.map(s => ({ ...s })));
  const [activeIdx, setActiveIdx] = useStatePM(null);
  const [dismissed, setDismissed] = useStatePM(false);
  const [exiting, setExiting] = useStatePM(false);
  const [hubOpen, setHubOpen] = useStatePM(false);
  const [openAssessKey, setOpenAssessKey] = useStatePM(null);
  const [expanded, setExpanded] = useStatePM(false);
  const { collapsedRef, expandedRef, height: viewportH } = usePMSlidePaneHeight(expanded, [assessState, steps]);

  const total = steps.length;
  const done = steps.filter(s => s.state === "done").length;

  /* Self-Assessment is a 6th, weighted slice of the overall percentage —
     5 sub-assessments (4 pillars + Dream & Vision) x 20% each — rather than
     a single binary step, so completing each one nudges the bar forward
     (PRD 3.1: "Profile Percentage... updates sequentially after each
     individual pillar assessment is submitted"). */
  const assessDone = PM_ASSESS_ORDER.filter((k) => assessState[k] && assessState[k].status === "completed").length;
  const assessFraction = assessDone / PM_ASSESS_ORDER.length;
  const totalSlices = total + 1;
  const allDone = done === total && assessDone === PM_ASSESS_ORDER.length;
  const pct = Math.round(((done + assessFraction) / totalSlices) * 100);

  function markDone(idx) {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, state: "done", su: "Complete" } : s));
    setActiveIdx(null);
  }

  function handleDismiss() {
    setExiting(true);
    setTimeout(() => setDismissed(true), 400);
  }

  function handleAssessProgress(answers) {
    const prevStatus = assessState[openAssessKey] && assessState[openAssessKey].status;
    onAssessPatch(openAssessKey, { answers, status: prevStatus === "completed" ? "completed" : "in_progress" });
  }
  function handleAssessComplete(answers) {
    if (openAssessKey === "dreamVision") {
      const counts = { A: 0, B: 0, C: 0, D: 0 };
      answers.forEach((a) => { counts[PM_ARCHETYPE_LETTERS[a]]++; });
      const dominant = PM_ARCHETYPE_LETTERS.reduce((best, l) => counts[l] > counts[best] ? l : best, "A");
      onAssessPatch(openAssessKey, { answers, status: "completed", archetype: dominant });
    } else {
      const rawPoints = answers.reduce((sum, a) => sum + (a + 1), 0);
      onAssessPatch(openAssessKey, { answers, status: "completed", rawPoints });
    }
  }

  if (dismissed) return null;

  if (allDone) {
    return (
      <div className={"pm-steps-wrap" + (exiting ? " pm-steps-exit" : "")}>
        <ProfileCompleteCard onDismiss={handleDismiss} />
      </div>
    );
  }

  const assessAllDone = assessDone === PM_ASSESS_ORDER.length;

  return (
    <>
      <div className="pm-steps-viewport" style={viewportH != null ? { height: viewportH + "px" } : undefined}>
        <div className={"pm-steps-slider" + (expanded ? " expanded" : "")}>
          <button type="button" ref={collapsedRef} className="pm-steps pm-steps-pane pm-steps-collapsed" aria-label="Complete your profile — tap to view checklist" onClick={() => setExpanded(true)}>
            <div className="pm-steps-collapsed-top">
              <h3 className="pm-steps-h">Complete your profile</h3>
              <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
            </div>
            <p className="pm-steps-sub">{done + assessDone} of {totalSlices} complete</p>
            <div className="pm-steps-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <span className="pm-steps-fill" style={{ width: pct + "%" }}></span>
            </div>
            <p className="pm-steps-pct">{pct}% complete — tap to view checklist</p>
          </button>

          <div ref={expandedRef} className="pm-steps pm-steps-pane pm-steps-expanded" aria-label="Complete your profile checklist">
            <button type="button" className="pm-steps-back" onClick={() => setExpanded(false)}>
              <DSPM.IconifyIcon name="lucide:chevron-left" size={20} color="var(--text-heading)" />Complete your profile
            </button>
            <div className="pm-steps-list">
              <button type="button" className={"pm-step " + (assessAllDone ? "done" : "priority")} onClick={() => setHubOpen(true)}>
                <span className="pm-step-mark" aria-hidden="true">
                  {assessAllDone
                    ? <DSPM.IconifyIcon name="lucide:check" size={18} color="#fff" />
                    : <DSPM.IconifyIcon name="lucide:compass" size={16} color="var(--brand-gold)" />}
                </span>
                <span className="pm-step-txt">
                  <span className="ti">Get to know you</span>
                  <span className="su">{assessDone} of {PM_ASSESS_ORDER.length} assessments complete</span>
                </span>
                <DSPM.IconifyIcon name="lucide:chevron-right" size={18} color="var(--gray-400)" />
              </button>
              {steps.map((s, i) => (
                <button type="button" className={"pm-step " + s.state} key={i} onClick={() => setActiveIdx(i)}>
                  <span className="pm-step-mark" aria-hidden="true">
                    {s.state === "done"
                      ? <DSPM.IconifyIcon name="lucide:check" size={18} color="#fff" />
                      : <span className="dot"></span>}
                  </span>
                  <span className="pm-step-txt">
                    <span className="ti">{s.ti}</span>
                    <span className="su">{s.su}</span>
                  </span>
                  <DSPM.IconifyIcon name="lucide:chevron-right" size={18} color="var(--gray-400)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {activeIdx !== null && (
        <StepSheet
          step={steps[activeIdx]}
          idx={activeIdx}
          onComplete={() => markDone(activeIdx)}
          onClose={() => setActiveIdx(null)}
        />
      )}
      {hubOpen && (
        <PMAssessHub
          assessState={assessState}
          onOpenAssess={(key) => { setHubOpen(false); setOpenAssessKey(key); }}
          onClose={() => setHubOpen(false)}
        />
      )}
      {openAssessKey && (
        <PMAssessWizard
          assessKey={openAssessKey}
          def={pmAssessDef(openAssessKey)}
          initialAnswers={assessState[openAssessKey] && assessState[openAssessKey].answers}
          onProgress={handleAssessProgress}
          onComplete={handleAssessComplete}
          onClose={() => { setOpenAssessKey(null); setHubOpen(true); }}
        />
      )}
    </>
  );
}

function PMSection({ title, children }) {
  return (
    <section className="pm-sec">
      <div className="pm-sec-h">
        <h2>{title}</h2>
        <span className="pm-sec-tools">
          <button className="pm-tool" aria-label={"Add to " + title}><DSPM.IconifyIcon name="lucide:plus" size={19} color="var(--brand-navy)" /></button>
          <button className="pm-tool" aria-label={"Edit " + title}><DSPM.Icon name="edit" size={17} color="var(--brand-navy)" /></button>
        </span>
      </div>
      {children}
    </section>);

}

function PMMentor() {
  const [done, setDone] = useStatePM(false);
  if (done) return null;
  return (
    <div className="pm-mentor">
      <div className="pm-mentor-hd">
        <DSPM.IconifyIcon name="fluent:people-team-16-filled" size={22} color="var(--ai-purple)" />
        <span className="t">Find a mentor</span>
      </div>
      <p className="s">Connecting with a mentor can accelerate your professional growth.</p>
      <div className="pm-mentor-act">
        <button className="no" onClick={() => setDone(true)}><DSPM.IconifyIcon name="lucide:x" size={18} color="var(--error)" />No</button>
        <button className="yes" onClick={() => setDone(true)}><DSPM.IconifyIcon name="lucide:check" size={18} color="var(--success)" />Yes</button>
      </div>
    </div>);

}

function PMPost({ p }) {
  const lines = p.body.split("\n");
  const openAuthor = () => p.id && goPM("ProfileMobile.html?id=" + p.id);
  return (
    <article className="pm-post">
      <div className="pm-post-hd">
        {p.id ?
        <button type="button" className="pm-post-avbtn" aria-label={"View " + p.name + "'s profile"} onClick={openAuthor}>
            <DSPM.Avatar name={p.name} src={p.avatar} size={42} />
          </button> :
        <DSPM.Avatar name={p.name} src={p.avatar} size={42} />
        }
        <div className="pm-post-by">
          <span className="nm">
            {p.id ?
            <button type="button" className="pm-post-namebtn" onClick={openAuthor}>{p.name}</button> :
            p.name}
            <span className="loc">{p.loc}</span>
          </span>
          <span className="tm">{p.time}</span>
        </div>
        <button className="pm-post-more" aria-label="More options"><DSPM.IconifyIcon name="lucide:more-horizontal" size={20} color="var(--gray-450)" /></button>
      </div>
      <h3 className="pm-post-ttl">{p.title}</h3>
      <p className="pm-post-body">{lines[0]}{lines[1] && <span className="tags"> {lines[1]}</span>}</p>
      <div className="pm-post-eng">
        <span><DSPM.IconifyIcon name="lucide:thumbs-up" size={17} color="var(--gray-500)" />{p.likes}</span>
        <span><DSPM.IconifyIcon name="lucide:message-circle" size={17} color="var(--gray-500)" />{p.comments}</span>
        <span><DSPM.IconifyIcon name="lucide:share-2" size={17} color="var(--gray-500)" />{p.shares}</span>
      </div>
    </article>);

}

/* "Activity" — encloses the post feed behind the same collapse/expand
   slide-over used by "Complete your profile" / "Track your goals" (shared
   .pm-menu-* classes; see profile-mobile.css). */
function PMActivityMenu() {
  const [expanded, setExpanded] = useStatePM(false);
  const { collapsedRef, expandedRef, height: viewportH } = usePMSlidePaneHeight(expanded, []);
  const latest = PM_ACTIVITY[0];
  return (
    <div className="pm-menu-viewport" style={viewportH != null ? { height: viewportH + "px" } : undefined}>
      <div className={"pm-menu-slider" + (expanded ? " expanded" : "")}>
        <button type="button" ref={collapsedRef} className="pm-menu-pane pm-menu-collapsed" aria-label="Activity — tap to view" onClick={() => setExpanded(true)}>
          <div className="pm-menu-collapsed-top">
            <h3 className="pm-steps-h">Activity</h3>
            <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
          </div>
          <p className="pm-steps-sub">{PM_ACTIVITY.length} recent posts &amp; updates</p>
          {latest &&
          <div className="pm-menu-preview">
              <DSPM.Avatar name={latest.name} src={latest.avatar} size={28} />
              <span className="pm-menu-preview-tx"><b>{latest.name}</b> · {latest.title}</span>
              <span className="pm-menu-preview-time">{latest.time}</span>
            </div>
          }
        </button>

        <div ref={expandedRef} className="pm-menu-pane pm-menu-expanded">
          <button type="button" className="pm-menu-back" onClick={() => setExpanded(false)}>
            <DSPM.IconifyIcon name="lucide:chevron-left" size={20} color="var(--text-heading)" />Activity
          </button>
          <div className="pm-menu-content">
            <div className="pm-activity">
              {PM_ACTIVITY.map((p, i) => <PMPost key={i} p={p} />)}
            </div>
            <button className="pm-showall" onClick={() => goPM("NewsfeedMobile.html")}>Show all posts</button>
          </div>
        </div>
      </div>
    </div>);

}

/* "Professional Information" — encloses Services, Experience, Education,
   Licenses & Certifications and Language behind the same collapse/expand
   pattern. Accepts data via props so the exact same component renders a
   member's own info (defaults) or another member's (OtherProfileScreen). */
function PMProfessionalInfoMenu({
  services = PM_SERVICES,
  experience = PM_EXPERIENCE,
  education = PM_EDUCATION,
  licenses = PM_LICENSES,
  languages = PM_LANGUAGES
}) {
  const [expanded, setExpanded] = useStatePM(false);
  const { collapsedRef, expandedRef, height: viewportH } = usePMSlidePaneHeight(expanded, [services, experience, education, licenses, languages]);
  return (
    <div className="pm-menu-viewport" style={viewportH != null ? { height: viewportH + "px" } : undefined}>
      <div className={"pm-menu-slider" + (expanded ? " expanded" : "")}>
        <button type="button" ref={collapsedRef} className="pm-menu-pane pm-menu-collapsed" aria-label="Professional Information — tap to view" onClick={() => setExpanded(true)}>
          <div className="pm-menu-collapsed-top">
            <h3 className="pm-steps-h">Professional Information</h3>
            <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
          </div>
          <p className="pm-steps-sub">Services, Experience, Education, Licenses &amp; Languages</p>
          <div className="pm-menu-tags">
            <span className="pm-menu-tag">{services.length} Services</span>
            <span className="pm-menu-tag">{experience.length} Experience</span>
            <span className="pm-menu-tag">{licenses.length} Certifications</span>
            <span className="pm-menu-tag">{languages.length} Languages</span>
          </div>
        </button>

        <div ref={expandedRef} className="pm-menu-pane pm-menu-expanded">
          <button type="button" className="pm-menu-back" onClick={() => setExpanded(false)}>
            <DSPM.IconifyIcon name="lucide:chevron-left" size={20} color="var(--text-heading)" />Professional Information
          </button>

          <PMSection title="Services">
            {services.map((s, i) =>
            <div className="pm-lrow" key={i}>
                <div className="ti">{s.ti}</div>
                <div className="su">{s.su}</div>
              </div>
            )}
          </PMSection>

          <PMSection title="Experience">
            {experience.map((e, i) =>
            <div className="pm-lrow" key={i}>
                <div className="ti">{e.ti}</div>
                <div className="su">{e.yrs}</div>
                <div className="su">{e.org}</div>
                <div className="su flag"><span className="fl">🇬🇧</span>{e.loc}</div>
              </div>
            )}
          </PMSection>

          <PMSection title="Education">
            {education.map((ed, i) =>
            <div className="pm-lrow media" key={i}>
                <div className="pm-logo">{ed.logo}</div>
                <div className="meta">
                  <div className="ti">{ed.school}</div>
                  <div className="su">{ed.program}</div>
                  <div className="su">{ed.years}</div>
                </div>
              </div>
            )}
          </PMSection>

          <PMSection title="Licenses & Certifications">
            {licenses.map((l, i) =>
            <div className="pm-lrow media" key={i}>
                <div className="pm-logo cert">P</div>
                <div className="meta">
                  <div className="ti">{l}</div>
                  <div className="su">Profinity Academy</div>
                  <div className="su muted">Issued January 2008</div>
                </div>
              </div>
            )}
          </PMSection>

          <PMSection title="Language">
            {languages.map((lg, i) =>
            <div className="pm-lrow" key={i}>
                <div className="pm-lang"><span className="fl">{lg.flag}</span><div><div className="ti">{lg.name}</div><div className="su">{lg.level}</div></div></div>
              </div>
            )}
          </PMSection>
        </div>
      </div>
    </div>);

}

/* ===========================================================================
   Viewing someone else's profile — ProfileMobile.html?id=<key>. A shorter,
   read-only take on the same page: identity header with Follow/Message
   (instead of Edit/Share), then everything laid out as scannable cards —
   what you share with them, a summarised recent-activity card, and their
   Professional Information behind the same enclosed menu used above.
   =========================================================================== */
function OtherProfileTopBar({ name, onBack, onMessage }) {
  return (
    <header className="pm-top">
      <button className="pm-burger" aria-label="Back" onClick={onBack}><DSPM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-700)" /></button>
      <span className="pm-top-other-name">{name}</span>
      <span className="grow" />
      <button className="pm-iconbtn" aria-label="Message" onClick={onMessage}>
        <DSPM.IconifyIcon name="lucide:message-circle" size={21} color="var(--brand-navy)" />
      </button>
    </header>);

}

function PMSharedInfoCard({ user }) {
  const shared = user.shared || {};
  const courses = shared.courses || [];
  return (
    <section className="pm-sec pm-card" data-screen-label="Shared with you">
      <div className="pm-card-hd">
        <span className="pm-card-hd-ti"><h2>Shared with you</h2></span>
      </div>
      <div className="pm-shared-grid">
        <div className="pm-shared-item">
          <DSPM.IconifyIcon name="lucide:users" size={18} color="var(--brand-navy)" />
          <span className="n">{shared.mutualConnections != null ? shared.mutualConnections : "—"}</span>
          <span className="l">Mutual connections</span>
        </div>
        <div className="pm-shared-item">
          <DSPM.IconifyIcon name="lucide:crown" size={18} color="var(--brand-gold)" />
          <span className="n">{shared.community || "—"}</span>
          <span className="l">Shared community</span>
        </div>
        <div className="pm-shared-item">
          <DSPM.IconifyIcon name="lucide:book-open" size={18} color="var(--ai-purple)" />
          <span className="n">{courses.length}</span>
          <span className="l">Shared courses</span>
        </div>
      </div>
      {courses.length > 0 &&
      <div className="pm-shared-courses">
          {courses.map((c, i) =>
          <span className="pm-shared-course-chip" key={i}>
              <DSPM.IconifyIcon name="lucide:book-open" size={13} color="var(--brand-navy)" />{c}
            </span>
          )}
        </div>
      }
    </section>);

}

function PMActivitySummaryCard({ user }) {
  const activity = user.activity || {};
  const highlights = activity.highlights || [];
  return (
    <section className="pm-sec pm-card" data-screen-label="Recent activity">
      <div className="pm-card-hd">
        <span className="pm-card-hd-ti"><h2>Recent Activity</h2></span>
        {activity.lastActive && <span className="pm-activity-lastactive">Active {activity.lastActive}</span>}
      </div>
      <div className="pm-activity-summary-rows">
        {highlights.map((h, i) =>
        <div className="pm-activity-summary-row" key={i}>
            <span className="ic"><DSPM.IconifyIcon name={h.icon} size={16} color="var(--brand-navy)" /></span>
            <span className="tx">{h.text}</span>
            <span className="tm">{h.time}</span>
          </div>
        )}
        {highlights.length === 0 && <p className="pm-steps-sub">No recent activity to show yet.</p>}
      </div>
      <button className="pm-showall" onClick={() => goPM("NewsfeedMobile.html")}>View full activity</button>
    </section>);

}

function OtherProfileScreen({ user }) {
  const [msgOpen, setMsgOpen] = useStatePM(false);
  const [following, setFollowing] = useStatePM(false);
  const scrollRef = React.useRef(null);
  const chromeHidden = useHeaderHidePM(scrollRef);
  return (
    <div className="pm-screen" data-screen-label={"Profile — " + user.name}>
      <OtherProfileTopBar name={user.name} onBack={() => goPM("NewsfeedMobile.html")} onMessage={() => setMsgOpen(true)} />
      <div className="pm-scroll" ref={scrollRef}>
        <div className="pm-ig">
          <div className="pm-ig-top">
            <div className="pm-ig-avwrap">
              <DSPM.Avatar name={user.name} src={user.avatar} size={92} className="pm-ig-av" />
            </div>
            <div className="pm-ig-stats">
              <div className="pm-ig-stat"><span className="n">{user.posts}</span><span className="l">posts</span></div>
              <div className="pm-ig-stat"><span className="n">{user.followers}</span><span className="l">followers</span></div>
              <div className="pm-ig-stat"><span className="n">{user.following}</span><span className="l">following</span></div>
            </div>
          </div>

          <div className="pm-ig-name">
            <span className="nm">{user.name}</span>
            <span className="pn">{user.role}</span>
            {user.seals && <DSPM.VerificationSeals seals={user.seals} size={20} />}
          </div>

          {user.bio && <div className="pm-ig-bio"><p>{user.bio}</p></div>}

          <div className="pm-ig-chips">
            {user.location && <span className="pm-chip"><DSPM.IconifyIcon name="lucide:map-pin" size={16} color="var(--brand-navy)" />{user.location}</span>}
            {user.clinic && <span className="pm-chip"><DSPM.IconifyIcon name="lucide:building-2" size={16} color="var(--brand-navy)" />{user.clinic}</span>}
          </div>

          <div className="pm-ig-actions">
            <button className={"pm-ig-btn" + (following ? "" : " navy")} onClick={() => setFollowing((f) => !f)}>
              {following ?
              <><DSPM.IconifyIcon name="lucide:check" size={16} color="var(--text-heading)" />Following</> :

              "Follow"}
            </button>
            <button className="pm-ig-btn" onClick={() => setMsgOpen(true)}>
              <DSPM.IconifyIcon name="lucide:message-circle" size={16} color="var(--text-heading)" />Message
            </button>
          </div>
        </div>

        <PMSharedInfoCard user={user} />
        <PMActivitySummaryCard user={user} />
        <PMProfessionalInfoMenu
          services={user.services} experience={user.experience} education={user.education}
          licenses={user.licenses} languages={user.languages} />

      </div>
      <PMTabBar compact={chromeHidden} />
      <MessagesPanelPM open={msgOpen} onClose={() => setMsgOpen(false)} />
    </div>);

}

function ProfileNotFoundScreen() {
  return (
    <div className="pm-screen" data-screen-label="Profile not found">
      <header className="pm-top">
        <button className="pm-burger" aria-label="Back" onClick={() => goPM("NewsfeedMobile.html")}>
          <DSPM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-700)" />
        </button>
      </header>
      <div className="pm-empty-state">
        <DSPM.IconifyIcon name="lucide:user-x" size={40} color="var(--gray-400)" />
        <h2>Profile not found</h2>
        <p>This profile may have been removed, or the link is out of date.</p>
        <button className="pm-ig-btn navy" onClick={() => goPM("NewsfeedMobile.html")}>Back to Home</button>
      </div>
    </div>);

}

function readProfileIdParamPM() {
  try {
    const params = new URLSearchParams(window.location.search);
    return { id: params.get("id"), name: params.get("name"), avatar: params.get("avatar") };
  } catch (e) { return { id: null, name: null, avatar: null }; }
}

/* Fallback profile for the seeded post/comment authors across the Newsfeed
   and Community that don't have a curated PM_OTHER_USERS entry — every post
   author is clickable, so anyone not on the curated list still lands
   somewhere real rather than a dead-end "not found" page. Deliberately
   light: explicit empty arrays (not undefined) for services/experience/
   education/licenses/languages, so PMProfessionalInfoMenu's own defaults —
   which fall back to the signed-in member's own info — never leak onto a
   stranger's profile. */
function buildMinimalProfilePM(name, avatar) {
  return {
    name,
    avatar: avatar || undefined,
    role: "Profinity Community Member",
    posts: "—",
    followers: "—",
    following: "—",
    shared: {},
    activity: {},
    services: [],
    experience: [],
    education: [],
    licenses: [],
    languages: []
  };
}

function useDeviceScalePM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStatePM(calc);
  useEffectPM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobilePM() {
  const [mobile, setMobile] = useStatePM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectPM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function PMScreen() {
  const m = PM_ME;
  const [msgOpen, setMsgOpen] = useStatePM(false);
  const [menuOpen, setMenuOpen] = useStatePM(false);
  const [assessState, setAssessState] = useStatePM(() => pmLoadAssessState());
  const scrollRef = React.useRef(null);
  const chromeHidden = useHeaderHidePM(scrollRef);

  function patchAssessState(key, patch) {
    setAssessState((prev) => {
      const next = { ...prev, [key]: { ...(prev[key] || {}), ...patch } };
      pmSaveAssessState(next);
      return next;
    });
  }
  /* Deep link from LearningMobile's "See your full Prosperity Spiral" —
     full page navigation (not an SPA route), so scroll to the anchor once
     the layout has settled instead of relying on default hash scrolling
     (which can land above the fixed top bar). */
  useEffectPM(() => {
    if (window.location.hash !== "#prosperity-spiral") return;
    /* Track your goals auto-expands on this same hash (see PMGoalsMenu);
       wait out its slide/height transition (~380ms) before scrolling so the
       page doesn't jump mid-animation. */
    const t = setTimeout(() => {
      const el = document.getElementById("prosperity-spiral");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 420);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="pm-screen" data-screen-label="Profile (mobile)">
          <PMTopBar onMenu={() => setMenuOpen(true)} onMessages={() => setMsgOpen(true)} />
          <div className="pm-scroll" ref={scrollRef}>
            <div className="pm-ig">
              <div className="pm-ig-top">
                <div className="pm-ig-avwrap">
                  <DSPM.Avatar name={m.name} src={m.avatar} size={92} className="pm-ig-av" />
                </div>
                <div className="pm-ig-stats">
                  <div className="pm-ig-stat"><span className="n">{m.posts}</span><span className="l">posts</span></div>
                  <div className="pm-ig-stat"><span className="n">{m.followers}</span><span className="l">followers</span></div>
                  <div className="pm-ig-stat"><span className="n">{m.following}</span><span className="l">following</span></div>
                </div>
              </div>

              <div className="pm-ig-name">
                <span className="nm">{m.name}</span>
                <span className="pn">{m.role}</span>
                <DSPM.VerificationSeals seals={["verified", "crown", "gold"]} size={20} />
                <PMSealBadge src="assets/badge-m.svg" alt="Mastery badge" label="Mastery Badge" width={20} height={20} style={{ marginLeft: -5 }} />
                <PMSealBadge src="assets/badge-skinfluencer.png" alt="PROfinity Skinfluencer badge" label="Skinfluencer" width={20} height={22} style={{ marginLeft: -5 }} />
              </div>

              <div className="pm-ig-bio">
                <p><span className="bi">🇬🇧</span> Aesthetic Nurse Practitioner</p>
                <p><span className="bi">💉</span> Botox · Fillers · Lip Enhancement</p>
                <p>{m.bio}</p>
              </div>
              <a className="pm-ig-link" href="#" onClick={(e) => e.preventDefault()}>
                <DSPM.IconifyIcon name="lucide:link" size={17} color="var(--ai-purple)" />allcaremedical.co.uk
              </a>

              <div className="pm-ig-chips">
                <span className="pm-chip"><DSPM.IconifyIcon name="lucide:map-pin" size={16} color="var(--brand-navy)" />{m.location}</span>
                <span className="pm-chip"><DSPM.IconifyIcon name="lucide:building-2" size={16} color="var(--brand-navy)" />{m.clinic}</span>
                <span className="pm-chip add"><DSPM.IconifyIcon name="lucide:plus" size={16} color="var(--gray-500)" />Add</span>
              </div>

              <div className="pm-ig-actions">
                <button className="pm-ig-btn" onClick={() => goPM("ProfileMobile.html")}>Edit Profile</button>
                <button className="pm-ig-btn navy">Share Profile</button>
                <button className="pm-ig-btn icon" aria-label="Settings" onClick={() => goPM("AccountSettings.html")}>
                  <DSPM.IconifyIcon name="lucide:settings" size={20} color="var(--text-heading)" />
                </button>
              </div>
            </div>
            <ProfileSteps assessState={assessState} onAssessPatch={patchAssessState} />
            <PMGoalsMenu assessState={assessState} />
            <PMMentor />
            <PMActivityMenu />
            <PMProfessionalInfoMenu />

            <button className="pm-logout" onClick={() => goPM("NewsfeedMobile.html")}>
              <DSPM.IconifyIcon name="lucide:log-out" size={20} color="var(--error)" />Logout
            </button>
          </div>
          <PMTabBar compact={chromeHidden} />
          <MessagesPanelPM open={msgOpen} onClose={() => setMsgOpen(false)} />
          <SideMenuPM open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>);

}

function ProfileMobileApp() {
  const mobile = useIsMobilePM();
  const scale = useDeviceScalePM();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  const { id: idParam, name: nameParam, avatar: avatarParam } = readProfileIdParamPM();
  const otherUser = idParam ?
  PM_OTHER_USERS[idParam] || (nameParam ? buildMinimalProfilePM(nameParam, avatarParam) : null) :
  null;
  const content = idParam ?
  otherUser ? <OtherProfileScreen user={otherUser} /> : <ProfileNotFoundScreen /> :

  <PMScreen />;

  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}>{content}</div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}>{content}</IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ProfileMobileApp />);
