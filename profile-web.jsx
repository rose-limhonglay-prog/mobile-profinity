/* ===========================================================================
   PROfinity — Profile (desktop web)
   Facebook-style profile layout — full-bleed cover band + overlapping ring
   avatar, name/stats/facts header row with action buttons, a tab bar, and a
   two-column body (a stack of sidebar cards on the left; composer, the
   self-assessment "member dashboard" section, and a Posts feed on the
   right) — built with this app's own PW_/pw- markup and CSS classes in
   profile-web.css, still using the DS's MembershipCard/ChannelItem/Avatar/
   Button/Icon primitives and window.APP_DATA sample content where they fit.
   Not mounted via window.ProfileScreen directly — see community-web.jsx's
   header comment for why that function is broken as shipped (it destructures
   window.ProfinityDesignSystem_c2b5cc before the bundle finishes populating
   it). Destructuring here, in a separate script tag that runs after the
   whole bundle has loaded, doesn't have that problem.
   =========================================================================== */
const { useState: useStatePW, useEffect: useEffectPW } = React;
const DS_PW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavPW, MembershipCard, ChannelItem: ChannelItemPW, Avatar: AvatarPW, Button: ButtonPW, Icon: IconPW, IconifyIcon: IconifyIconPW, VerificationSeals: VerificationSealsPW } = DS_PW;

/* ===========================================================================
   Reused mobile profile content (PM_* in profile-mobile.jsx), copied in
   verbatim under a PW_ prefix per this app's convention — see that file's
   comments for why each fact is what it is. Katy Wilson is the same
   fictional member on both pages, so her bio/experience/education/etc.
   should read identically here.
   =========================================================================== */
const PW_ME = {
  name: "Katy Wilson", role: "Registered Nurse", avatar: "assets/avatar-katy.jpg",
  seals: ["gb", "verified", "crown", "gold"],
  title: "Doctor", specialty: "Nurse Practitioner",
  bio: "Enhance patient satisfaction scores by 15% over the next 6 months through improved communication and personalized care planning.",
  followers: "1,546", following: "880", posts: "57", location: "London, United Kingdom", clinic: "Allcare Medical",
  clinicNumber: "+02 309 3928", clinicAddress: "Mr. John Smith, 132 My Street, Kingston, New York 12401.",
  yearsExperience: "12", instagram: "@katywilson"
};
const PW_TITLE_OPTIONS = ["Doctor", "Nurse Practitioner", "Registered Nurse", "Aesthetic Practitioner", "Dentist", "Physician Associate"];
const PW_PERSONAL_GOAL_QUESTIONS = [
  "Why did you choose to become an aesthetic practitioner, and what's the impact you dream of making for your clients?",
  "What's the one thing in your business that keeps you up at night, and how would solving it change your life?",
  "Who or what inspires you to keep pushing forward in your business, even on the toughest days?",
  "If you could wave a magic wand and change one thing about running your practice, what would it be?",
  "What does success as an aesthetic practitioner look like for you"
];

const PW_SERVICES = [
{ ti: "Botox (Anti-Wrinkle Injections)", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Dermal Fillers", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Lip Enhancement", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Cheek & Jawline Contouring", su: "Career Academy: Dr Tim Pearce" }];


const PW_EXPERIENCE = [
{ ti: "Registered Nurse", yrs: "12 years", org: "Generations Wellness Center", loc: "London, United Kingdom" },
{ ti: "Assistant Nurse", yrs: "12 years", org: "Generations Wellness Center", loc: "London, United Kingdom" }];


const PW_LICENSES = [
"The Ultimate Toxin Eye Complications Masterclass",
"Anatomy360",
"Pro Tox Course",
"8D Lips Course",
"Botox Foundations"];


const PW_EDUCATION = [
{ logo: "JH", school: "Johns Hopkins University of USA", program: "Clinical Foundations of Medicine", years: "1990 - 2020" }];


const PW_LANGUAGES = [
{ flag: "🇬🇧", name: "English (UK)", level: "Primary" },
{ flag: "🇮🇹", name: "Italian", level: "Secondary" }];


/* Same 3 mock posts as profile-mobile.jsx's PM_ACTIVITY — the first (Katy's
   own) gets the extra "pinned post" dressing the Facebook reference shows
   (location context, a tag, a 2-up image grid); the other two render as
   plain feed items below it. */
const PW_ACTIVITY = [
{
  name: "Katy Wilson", loc: "London, United Kingdom", time: "Today", avatar: "assets/avatar-katy.jpg",
  title: "Temple Filler Techniques",
  body: "One of the biggest challenges in clinical practice? Paperwork. Since switching to PROfinity, consent forms, treatment records, and post-consult notes are now digital, organized, and secure — saving me time and giving patients a clearer, more confident experience.\n#DigitalHealth #PatientCare #ClinicianTools #PROfinity",
  likes: "1.2K", comments: "150", shares: "150",
  tag: "Career update",
  images: ["assets/clinic-lip-design.png", "assets/clinic-treatment-collage.png"]
},
{
  name: "James Lee", loc: "Sydney, Australia", time: "Yesterday", avatar: null,
  title: "Advanced Suturing Techniques",
  body: "In my surgical practice, time is precious. That's why I was thrilled to discover the ease of digital record-keeping with PROfinity. Documentation has never been simpler — everything I need is just a few taps away.\n#Surgery #PatientSafety #MedicalTech #PROfinity",
  likes: "850", comments: "200", shares: "180"
},
{
  name: "Linda Garcia", loc: "Toronto, Canada", time: "Last Week", avatar: null,
  title: "Emerging Technologies in Dentistry",
  body: "The dental field is evolving rapidly, and so should our approach to documentation. From treatment plans to follow-up notes, everything is handled digitally — less clutter, more focus on patient interactions.\n#DentalCare #TechInDentistry #PROfinity #FutureOfHealthcare",
  likes: "1.5K", comments: "120", shares: "200"
}];

/* Same asset-path fix as community-web.jsx — the kit's sample data assumes
   it's served from ui_kits/app/index.html, not the site root. */
(function fixKitAssetPaths() {
  var OLD_PREFIX = "../../assets/images/";
  var RENAMES = {
    "course-8d-lip.png": "course-8d-lip-design.jpg",
    "cover-gold-texture.png": "texture-gold.png",
    "post-beforeafter.png": "clinic-treatment-collage.png"
  };
  function fix(v) {
    if (v.indexOf(OLD_PREFIX) !== 0) return v;
    var file = v.slice(OLD_PREFIX.length);
    return "assets/" + (RENAMES[file] || file);
  }
  function walk(obj) {
    if (!obj || typeof obj !== "object") return;
    Object.keys(obj).forEach(function (k) {
      var v = obj[k];
      if (typeof v === "string") obj[k] = fix(v);
      else if (v && typeof v === "object") walk(v);
    });
  }
  if (window.APP_DATA) walk(window.APP_DATA);
})();

/* ===========================================================================
   The Prosperity Spiral, Goal Focus, Today's Targets and the "Get to know
   you" self-assessment hub/wizard — ported from profile-mobile.jsx (PM_* /
   PMxxx). Same math, same quiz copy, same localStorage key ("pf-self-
   assessment") so state is shared with the mobile page on the same browser/
   account — only the chrome is desktop-appropriate (centered modals instead
   of bottom sheets, no collapse/expand slide-over pane).
   =========================================================================== */
const PW_PILLARS = [
{ key: "Sales", color: "var(--error)" },
{ key: "Marketing", color: "linear-gradient(90deg, #f4ad3d, #e7820a)" },
{ key: "Clinical Skills", color: "var(--info)" },
{ key: "Business Systems", color: "var(--premium-orange)" }];


const PW_TARGET_TAGS = {
  MKT: { label: "MKT", color: "#e7820a" },
  CLIN: { label: "CLIN", color: "#0088de" },
  SALE: { label: "SALE", color: "var(--error)" },
  SYS: { label: "SYS", color: "var(--premium-orange)" }
};

const PW_TARGETS = [
{ text: "Complete Lesson 4: Lip Anatomy", tag: "CLIN" },
{ text: "Post 2 before/after case studies", tag: "MKT" },
{ text: "Follow up with 3 lapsed patients", tag: "SALE" },
{ text: "Log this week's expenses in your tracker", tag: "SYS" }];


/* Course-completion baseline (Scourse) per pillar — see profile-mobile.jsx's
   PM_SCOURSE comment for the full rationale. */
const PW_SCOURSE = { "Sales": 31, "Marketing": 52, "Clinical Skills": 62, "Business Systems": 41 };

const PW_ASSESS_KEY = "pf-self-assessment";
function pwLoadAssessState() {
  try { return JSON.parse(localStorage.getItem(PW_ASSESS_KEY)) || {}; } catch (e) { return {}; }
}
function pwSaveAssessState(state) {
  try { localStorage.setItem(PW_ASSESS_KEY, JSON.stringify(state)); } catch (e) {}
}

function pwPillarScore(pillarKey, assessState) {
  const scourse = PW_SCOURSE[pillarKey] || 0;
  const entry = assessState[pillarKey];
  const seval = entry && entry.status === "completed" ? (entry.rawPoints / 28) * 100 : 0;
  return Math.min(100, Math.round(seval * 0.6 + scourse));
}

/* "Track your goals" is gated behind the 4 scored pillar assessments (not
   Dream & Vision, which never touches a pillar score). */
const PW_FORECAST_PILLARS = PW_PILLARS.map((p) => p.key);
function pwForecastDone(assessState) {
  return PW_FORECAST_PILLARS.filter((k) => assessState[k] && assessState[k].status === "completed").length;
}

/* Dynamic Goal Focus — lowest-scoring pillar, tie-break in this order. */
const PW_GOAL_TIEBREAK = ["Clinical Skills", "Business Systems", "Sales", "Marketing"];
function pwLowestPillar(assessState) {
  const scored = PW_PILLARS.map((p) => ({ key: p.key, score: pwPillarScore(p.key, assessState) }));
  const lowest = Math.min(...scored.map((s) => s.score));
  const tied = scored.filter((s) => s.score === lowest).map((s) => s.key);
  return PW_GOAL_TIEBREAK.find((k) => tied.includes(k)) || tied[0];
}
const PW_GOAL_REASONING = {
  "Sales": "Your consultations and follow-up are the fastest lever right now — tightening how you convert the patients already reaching out will move this pillar quickest.",
  "Marketing": "You need visibility. Better, more consistent lead generation is the fastest way to fill your books.",
  "Clinical Skills": "Sharpening your clinical technique and confidence unlocks higher-value treatments and safer, more advanced procedures.",
  "Business Systems": "Tightening your operations, pricing and financial tracking is what turns bookings into a sustainable, scalable business."
};

/* Esc closes any role="dialog" overlay (wizard, hub, help modals) — `active`
   lets a component call this unconditionally (Rules of Hooks) while only
   listening once it's actually showing. */
function usePWEscClose(active, onClose) {
  useEffectPW(() => {
    if (!active) return;
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

/* "How it works" help — a plain-language explainer for the Spiral Score. */
function PWSpiralHelpModal({ open, onClose }) {
  usePWEscClose(open, onClose);
  if (!open) return null;
  return (
    <div className="pw-modal-overlay" onClick={onClose}>
      <div className="pw-modal-card pw-help-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="How the Prosperity Spiral works">
        <div className="pw-help-hd">
          <span className="pw-help-icon"><IconifyIconPW name="lucide:sparkles" size={18} color="var(--ai-purple)" /></span>
          <h3>How the Prosperity Spiral works</h3>
          <button type="button" className="pw-help-x" aria-label="Close" onClick={onClose}>
            <IconifyIconPW name="lucide:x" size={20} color="var(--gray-500)" />
          </button>
        </div>
        <div className="pw-help-body">
          <p>Your Spiral Score is simply a snapshot of how balanced your business is across four areas every successful clinic needs: <b>Sales</b>, <b>Marketing</b>, <b>Clinical Skills</b> and <b>Business Systems</b>.</p>
          <p>Each pillar's number goes up when you take actions that build it — finishing a lesson, completing a Today's Target, posting a case study, following up with a patient. There's no trick to it: the more consistently you show up in a pillar, the faster it climbs.</p>
          <p>A weak pillar isn't a bad grade — it's just where Ava recommends you focus next, because the fastest way to grow your clinic is usually to strengthen your lowest pillar first.</p>
          <button type="button" className="pf-coach-link pw-help-coach" data-coach="Explain how my Spiral Score is calculated and what I can do this week to raise it." onClick={onClose}>
            <IconifyIconPW name="lucide:sparkles" size={14} color="var(--ai-purple)" />Ask Ava to explain mine
          </button>
        </div>
      </div>
    </div>);

}

function PWSpiralCard({ assessState }) {
  const [helpOpen, setHelpOpen] = useStatePW(false);
  const scored = PW_PILLARS.map((g) => ({ ...g, score: pwPillarScore(g.key, assessState) }));
  const avg = Math.round(scored.reduce((sum, p) => sum + p.score, 0) / scored.length);
  const strongest = scored.reduce((a, b) => (b.score > a.score ? b : a));
  const weakest = scored.reduce((a, b) => (b.score < a.score ? b : a));
  return (
    <section className="pw-card" id="prosperity-spiral">
      <div className="pw-card-hd">
        <span className="pw-card-hd-ti">
          <h2>The Prosperity Spiral</h2>
          <button type="button" className="pw-help-link" aria-label="How it works" onClick={() => setHelpOpen(true)}>
            <IconifyIconPW name="lucide:circle-help" size={16} color="var(--gray-500)" />How it works
          </button>
        </span>
      </div>
      <div className="pw-spiral-overview">
        <div className="pw-spiral-ring" style={{ "--pct": avg }} role="img" aria-label={"Overall balance " + avg}>
          <span className="n">{avg}</span>
          <span className="lbl">balance</span>
        </div>
        <p className="pw-spiral-sentence">
          Your clinic is strongest in <b>{strongest.key}</b>. Lift <b>{weakest.key}</b> to bring the spiral into balance.
        </p>
      </div>
      <div className="pw-spiral-rows">
        {scored.map((g) =>
        <button key={g.key} type="button" className={"pw-spiral-row" + (g.key === weakest.key ? " lowest" : "")} onClick={() => goPW("MyLearning.html")}>
            <span className="dot" style={{ background: g.color }} aria-hidden="true" />
            <span className="label">{g.key}</span>
            <span className="bar" role="progressbar" aria-label={g.key} aria-valuenow={g.score} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: g.score + "%", background: g.color }} />
            </span>
            <span className="score">{g.score}</span>
          </button>
        )}
      </div>
      <PWSpiralHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </section>);

}

/* "Let's work on your goal" — auto-picks the lowest-scoring pillar. */
function PWGoalFocusCard({ assessState }) {
  const pillarKey = pwLowestPillar(assessState);
  const score = pwPillarScore(pillarKey, assessState);
  return (
    <section className="pw-card pw-goal-card">
      <div className="pw-goal-top">
        <div className="pw-goal-main">
          <span className="eyebrow"><IconifyIconPW name="lucide:trophy" size={13} color="var(--premium-orange)" />Let's work on your goal</span>
          <div className="ti">{pillarKey}</div>
          <p className="note">Your lowest-scoring pillar right now — Ava recommends focusing here next.</p>
        </div>
        <div className="pw-goal-ring" style={{ "--pct": score }} role="img" aria-label={score + " progress"}>
          <span className="n">{score}</span>
          <span className="lbl">Progress</span>
        </div>
      </div>
      <p className="pw-goal-reasoning">{PW_GOAL_REASONING[pillarKey]}</p>
      <button type="button" className="pw-goal-cta" onClick={() => goPW("MyLearning.html")}>
        Work on your goal<IconifyIconPW name="lucide:arrow-up-right" size={17} color="#fff" />
      </button>
    </section>);

}

function PWTargetsCard() {
  const [extra, setExtra] = useStatePW([]);
  useEffectPW(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("pf-coach-targets")) || [];
      setExtra(stored.map((t) => ({ text: t.text, tag: null })));
    } catch (e) {}
  }, []);
  const all = PW_TARGETS.concat(extra);
  const [done, setDone] = useStatePW([]);
  const toggle = (i) => setDone((s) => {
    const next = s.slice();
    while (next.length <= i) next.push(false);
    next[i] = !next[i];
    return next;
  });
  const doneCount = done.filter(Boolean).length;
  const pct = all.length ? Math.round((doneCount / all.length) * 100) : 0;
  return (
    <section className="pw-card">
      <div className="pw-card-hd">
        <span className="pw-card-hd-ti">
          <h2>Today's Targets</h2>
          <span className="pw-targets-pill">{doneCount}/{all.length}</span>
        </span>
      </div>
      <div className="pw-targets-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <span className="pw-targets-fill" style={{ width: pct + "%" }}></span>
      </div>
      <div className="pw-target-rows">
        {all.map((t, i) =>
        <button key={i} type="button" className={"pw-target-row" + (done[i] ? " done" : "")} onClick={() => toggle(i)} role="checkbox" aria-checked={!!done[i]}>
            <span className="circle">{done[i] && <IconifyIconPW name="lucide:check" size={12} color="#fff" />}</span>
            {t.tag && <span className="pw-target-tag" style={{ background: PW_TARGET_TAGS[t.tag].color }}>{PW_TARGET_TAGS[t.tag].label}</span>}
            <span className="tx">{t.text}</span>
          </button>
        )}
      </div>
      <div className="pw-target-divider" />
      <p className="pw-target-note">Completing these will move your Prosperity Spiral forward.</p>
    </section>);

}

/* Gate card shown in place of Goal Focus / Prosperity Spiral / Today's
   Targets until all four scored pillar assessments are done. Unlike the
   mobile version, the CTA is wired as a normal prop callback (onOpenHub)
   instead of a DOM CustomEvent — desktop owns both the gate and the hub in
   the same component tree, so there's no sibling-component workaround needed. */
function PWGoalsGateCard({ doneCount, onOpenHub }) {
  const heading = doneCount === 0 ? "Start with “Get to know you”" : `Keep going — ${doneCount} of 4 done`;
  return (
    <section className="pw-card pw-goals-gate">
      <span className="pw-goals-gate-icon" aria-hidden="true">
        <IconifyIconPW name="lucide:compass" size={28} color="#fff" />
      </span>
      <h3>{heading}</h3>
      <p>Your forecast unlocks once all four pillar assessments — Marketing, Sales, Clinical Skills and Business Systems — are complete.</p>
      <button type="button" className="pw-goals-gate-cta" onClick={onOpenHub}>
        Get to know you<IconifyIconPW name="lucide:arrow-up-right" size={17} color="#fff" />
      </button>
    </section>);

}

/* Renders Goal Focus + Spiral + Targets once unlocked, or the gate card
   until then — rendered inline (no mobile-style collapse/expand pane;
   desktop has the room to just show it). */
function PWGoalsSection({ assessState, onOpenHub }) {
  const doneCount = pwForecastDone(assessState);
  const unlocked = doneCount === PW_FORECAST_PILLARS.length;
  if (!unlocked) return <PWGoalsGateCard doneCount={doneCount} onOpenHub={onOpenHub} />;
  return (
    <>
      <PWGoalFocusCard assessState={assessState} />
      <PWSpiralCard assessState={assessState} />
      <PWTargetsCard />
    </>);

}

const PW_ARCHETYPE_LETTERS = ["A", "B", "C", "D"];

/* ---- Pillar assessments (scored) — 7 questions each, A-D = 1-4 pts, max 28 ----
   Copied verbatim from profile-mobile.jsx's PM_PILLAR_ASSESSMENTS. */
const PW_PILLAR_ASSESSMENTS = {
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
   surface a "Vision Profile" archetype; never affects a pillar score.
   Copied verbatim from profile-mobile.jsx's PM_DREAM_VISION. ---- */
const PW_DREAM_VISION = {
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

const PW_ARCHETYPES = {
  A: { name: "The Boutique Craftsman", desc: "Ultra-premium pricing, personal branding, concierge service, and high-ticket full-face packages — without expanding team complexity." },
  B: { name: "The Balanced Practice Owner", desc: "Delegation, associate injector onboarding, predictable digital marketing funnels, and reducing chair-time to achieve work-life balance." },
  C: { name: "The Authority & Educator", desc: "Advanced anatomical mastery, speaker/KOL development, specialised signature techniques, training academies, and media PR." },
  D: { name: "The Enterprise Scaling CEO", desc: "Multi-location SOPs, financial dashboards, team leadership/compensation models, and build-to-sell valuation strategies." }
};

/* Order the hub renders tiles in — Dream & Vision always last since it's the
   "bonus" non-scoring assessment. */
const PW_ASSESS_ORDER = ["Marketing", "Sales", "Clinical Skills", "Business Systems", "dreamVision"];
function pwAssessDef(key) { return key === "dreamVision" ? PW_DREAM_VISION : PW_PILLAR_ASSESSMENTS[key]; }

const PW_ASSESS_STATUS_LABEL = { not_started: "Not started", in_progress: "In progress", completed: "Completed" };
function pwAssessStatus(entry) {
  if (!entry) return "not_started";
  if (entry.status === "completed") return "completed";
  if (entry.answers && entry.answers.some((a) => a != null)) return "in_progress";
  return "not_started";
}

/* ---- Question wizard — shared by all 5 assessments. Pillar assessments
   score on finish (rawPoints out of 28); Dream & Vision tallies a dominant
   letter and reveals an archetype instead of a score. ---- */
function PWAssessWizard({ assessKey, def, initialAnswers, onProgress, onComplete, onClose }) {
  usePWEscClose(true, onClose);
  const questions = def.questions;
  const total = questions.length;
  const scored = assessKey !== "dreamVision";
  const [step, setStep] = useStatePW(() => {
    const init = initialAnswers || questions.map(() => null);
    const firstUnanswered = init.findIndex((a) => a == null);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [answers, setAnswers] = useStatePW(() => initialAnswers || questions.map(() => null));
  const [finished, setFinished] = useStatePW(false);

  useEffectPW(() => { if (!finished) onProgress(answers); }, [answers]);

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
    <div className="pw-modal-overlay" role="dialog" aria-modal="true" aria-label={def.label}>
      <div className="pw-modal-card pw-wiz-card">
        <div className="pw-wiz-hd">
          <span style={{ width: 22 }} />
          <span className="pw-wiz-hd-ti">{def.label}</span>
          <button className="pw-wiz-close" aria-label="Close" onClick={onClose}>
            <IconifyIconPW name="lucide:x" size={22} color="var(--gray-700)" />
          </button>
        </div>

        {!finished ? (
          <div className="pw-wiz-body">
            <p className="pw-wiz-sub">
              {scored
                ? "Answer honestly — this sets your baseline. Course progress can still carry this pillar all the way to 100%."
                : "Non-scored — this just helps us understand your goals so we can build your vision with you."}
            </p>
            <div className="pw-wiz-progress">
              <span className="pw-wiz-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: pct + "%" }} />
              </span>
              <span className="pw-wiz-count">{step + 1} of {total}</span>
            </div>
            <div className="pw-wiz-q">{cur.q}</div>
            <div className="pw-wiz-opts" role="radiogroup" aria-label={cur.q}>
              {cur.opts.map((o, i) =>
              <button key={i} type="button" className={"pw-wiz-opt" + (answers[step] === i ? " on" : "")}
                role="radio" aria-checked={answers[step] === i} onClick={() => pick(i)}>
                  <span className="pw-wiz-opt-letter">{PW_ARCHETYPE_LETTERS[i]}</span>
                  <span className="pw-wiz-opt-tx">{o}</span>
                </button>
              )}
            </div>
            <div className="pw-wiz-nav">
              {step > 0 && <button type="button" className="pw-wiz-back" onClick={goBack}>Back</button>}
              <button type="button" className="pw-wiz-next" disabled={answers[step] == null} onClick={goNext}>
                {step === total - 1 ? "See results" : "Continue"}
              </button>
            </div>
          </div>
        ) : (
          <PWAssessResult scored={scored} answers={answers} onClose={onClose} />
        )}
      </div>
    </div>);

}

function pwResultInterpretation(pct) {
  if (pct >= 75) return "This is already a real strength for your practice — keep leaning into what's working.";
  if (pct >= 50) return "You're solidly ahead of where most clinics start in this area.";
  if (pct >= 25) return "You've got the basics in place, with clear room to grow here.";
  return "You're just getting started here — plenty of room to build fast.";
}

function PWAssessResult({ scored, answers, onClose }) {
  if (scored) {
    const raw = answers.reduce((sum, a) => sum + (a + 1), 0);
    const max = answers.length * 4;
    const pct = Math.round((raw / max) * 100);
    return (
      <div className="pw-wiz-body pw-wiz-result">
        <h3>Assessment complete</h3>
        <div className="pw-wiz-result-ring" style={{ "--pct": pct }} role="img" aria-label={raw + " of " + max + " points"}>
          <span className="n">{raw}</span>
          <span className="lbl">of {max}</span>
        </div>
        <span className="pw-wiz-result-pill">{pct}% baseline for this pillar</span>
        <p className="pw-wiz-result-note">{pwResultInterpretation(pct)}</p>
        <button type="button" className="pw-wiz-done-btn" onClick={onClose}>Back to assessments</button>
      </div>);

  }
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  answers.forEach((a) => { counts[PW_ARCHETYPE_LETTERS[a]]++; });
  const dominant = PW_ARCHETYPE_LETTERS.reduce((best, l) => counts[l] > counts[best] ? l : best, "A");
  const arch = PW_ARCHETYPES[dominant];
  return (
    <div className="pw-wiz-body pw-wiz-result">
      <h3>Your Vision Profile</h3>
      <span className="pw-wiz-result-pill pw-wiz-result-pill--arch">{arch.name}</span>
      <p className="pw-wiz-result-note">{arch.desc}</p>
      <p className="pw-wiz-result-note pw-wiz-result-note--muted">This doesn't change your Prosperity Spiral — it just helps us (and your mentor) understand where you want your clinic to go.</p>
      <button type="button" className="pw-wiz-done-btn" onClick={onClose}>Back to assessments</button>
    </div>);

}

function PWAssessHubTile({ assessKey, def, entry, onOpen }) {
  const status = pwAssessStatus(entry);
  const scored = assessKey !== "dreamVision";
  const scoreChip = status === "completed" && scored
    ? Math.round((entry.rawPoints / (def.questions.length * 4)) * 100) + "%"
    : null;
  return (
    <button type="button" className={"pw-hub-tile pw-hub-tile--" + status} onClick={() => onOpen(assessKey)}>
      <div className="pw-hub-tile-top">
        <span className="ti">{def.label}</span>
        <span className={"pw-hub-badge pw-hub-badge--" + status}>{PW_ASSESS_STATUS_LABEL[status]}</span>
      </div>
      <div className="pw-hub-tile-bottom">
        <span className="su"><IconifyIconPW name="lucide:clock" size={13} color="var(--gray-500)" />~{def.timeMin} mins</span>
        {scoreChip && <span className="pw-hub-score">{scoreChip}</span>}
      </div>
    </button>);

}

function PWAssessHelpModal({ open, onClose }) {
  usePWEscClose(open, onClose);
  if (!open) return null;
  return (
    <div className="pw-modal-overlay" onClick={onClose}>
      <div className="pw-modal-card pw-help-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="How self-assessments work">
        <div className="pw-help-hd">
          <span className="pw-help-icon"><IconifyIconPW name="lucide:compass" size={18} color="var(--ai-purple)" /></span>
          <h3>How self-assessments work</h3>
          <button className="pw-help-x" aria-label="Close" onClick={onClose}>
            <IconifyIconPW name="lucide:x" size={20} color="var(--gray-500)" />
          </button>
        </div>
        <div className="pw-help-body">
          <p>Each pillar assessment gives you a score based on your real-world experience and honest self-evaluation — there are no wrong answers, just an honest snapshot of where your clinic is today.</p>
          <p>That score becomes the starting point for your personalised journey plan — it's how Ava (and your mentor) know where to focus your coaching first.</p>
          <p>It also feeds directly into your Prosperity Spiral: your self-assessment sets the baseline for each pillar, and completing courses can carry it the rest of the way to 100%.</p>
          <p>Dream &amp; Vision works differently — it's never scored. It simply helps us understand your goals so we can build your journey around them.</p>
          <button type="button" className="pw-help-coach pf-coach-link" data-coach="Explain how my self-assessment scores work and how they feed my Prosperity Spiral." onClick={onClose}>
            <IconifyIconPW name="lucide:sparkles" size={14} color="var(--ai-purple)" />Ask Ava
          </button>
        </div>
      </div>
    </div>);

}

function PWAssessHub({ assessState, onOpenAssess, onClose }) {
  usePWEscClose(true, onClose);
  const [helpOpen, setHelpOpen] = useStatePW(false);
  return (
    <div className="pw-modal-overlay" role="dialog" aria-modal="true" aria-label="Get to know you">
      <div className="pw-modal-card pw-hub-card">
        <div className="pw-wiz-hd">
          <span style={{ width: 22 }} />
          <span className="pw-wiz-hd-ti">Get to know you</span>
          <button className="pw-wiz-close" aria-label="Close" onClick={onClose}>
            <IconifyIconPW name="lucide:x" size={22} color="var(--gray-700)" />
          </button>
        </div>
        <div className="pw-wiz-body pw-hub-body">
          <div className="pw-hub-intro">
            <IconifyIconPW name="lucide:sparkles" size={18} color="var(--ai-purple)" />
            <p>We use these to get to know you — your strengths, your gaps, and your dreams for your clinic — so Ava can guide your journey and your Prosperity Spiral reflects where you really are.</p>
          </div>
          <button type="button" className="pw-hub-help" onClick={() => setHelpOpen(true)}>
            <IconifyIconPW name="lucide:circle-help" size={15} color="var(--gray-500)" />How it works
          </button>
          <div className="pw-hub-grid">
            {PW_ASSESS_ORDER.map((key) =>
            <PWAssessHubTile key={key} assessKey={key} def={pwAssessDef(key)} entry={assessState[key]} onOpen={onOpenAssess} />
            )}
          </div>
        </div>
      </div>
      <PWAssessHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>);

}

function goPW(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function pfTagActiveNavPW(activeLabel) {
  document.querySelectorAll("#pf-root nav > button").forEach((b) => {
    const label = b.textContent.replace(/[0-9]/g, "").trim();
    const active = label === activeLabel;
    b.style.setProperty("-webkit-appearance", "none", "important");
    b.style.setProperty("appearance", "none", "important");
    b.style.setProperty("background", active ? "var(--pf-nav-active-bg, rgb(225, 223, 242))" : "none", "important");
    b.style.setProperty("transition", "background .18s ease", "important");
    const path = b.querySelector("svg path");
    if (path) path.style.setProperty("fill", active ? "currentColor" : "", "important");
  });
}

/* Member → profile links (profile-link.js); inert pass-through if the script is absent. */
const ProfileLinkPW = (window.PFProfileLink && window.PFProfileLink.Link) || function ({ children }) { return children; };

function navigatePW(label) {
  var u = { Home: "NewsfeedWeb.html", Community: "Community.html", "My Learning": "MyLearning.html", Agent: "Agent.html" }[label];
  if (u) (window.pfGo || function (x) { window.location.href = x; })(u);
}

function SuggestionRow({ s }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <AvatarPW name={s.name} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body-lg)", color: "var(--text-primary)" }}>{s.name}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-caption)", color: "var(--gray-500)" }}>{s.place}</div>
      </div>
      <button type="button" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--brand-navy)", background: "var(--white)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <IconPW name="add" size={18} color="var(--brand-navy)" />
      </button>
    </div>
  );
}

/* ===========================================================================
   Facebook-style header — full-bleed cover band (edge-to-edge, outside the
   centered container) with a large ring-bordered avatar overlapping its
   bottom edge, then a centered name/stats/facts + action-button row roughly
   level with the avatar's lower half. See this file's header comment for the
   screenshot this was built from.
   =========================================================================== */
function PWCoverHeader({ profile, onAvatar }) {
  const m = profile || PW_ME;
  return (
    <div className="pw-cover">
      <div className="pw-cover-inner">
        <button type="button" className="pw-cover-avatarwrap pw-cover-avbtn" aria-label="View profile picture" onClick={onAvatar}>
          {m.avatar ?
          <img className="pw-cover-avatar" src={m.avatar} alt={m.name} /> :
          <AvatarPW name={m.name} size={156} className="pw-cover-avatar pw-other-avatar-initials" />}
        </button>
      </div>
    </div>);

}

/* Banners under the facts (same pf-profile-banners store as ProfileMobile) +
   the "Add" chip that jumps straight to Edit profile → Banners. */
function PWBannerChips({ banners, conn, onAdd }) {
  return (
    <div className="pw-banners">
      {banners.map((key) => {
        const it = pwBannerItem(key); if (!it) return null;
        /* Static chip: the handle isn't a verified account, so it never links out. */
        return (
          <span key={key} className="pw-banner static">
            <IconifyIconPW name={it.icon} size={16} color={it.color} />{pwBannerText(key, conn)}
          </span>);
      })}
      {onAdd &&
      <button type="button" className="pw-banner add" onClick={onAdd}>
        <IconifyIconPW name="lucide:plus" size={15} color="var(--gray-500)" />Add
      </button>}
    </div>);
}

function PWHeaderBand({ profile, banners, conn, onEdit, onShare, onAddBanner }) {
  const m = profile || PW_ME;
  return (
    <div className="pw-headerband">
      <div className="pw-headerband-spacer" aria-hidden="true" />
      <div className="pw-headerband-info">
        <span className="pw-headerband-namerow">
          <h1>{m.name}</h1>
          <VerificationSealsPW seals={m.seals} size={19} />
        </span>
        <div className="pw-headerband-stats">{m.followers} followers · {m.following} following</div>
        <ul className="pw-headerband-facts">
          <li><IconifyIconPW name="lucide:stethoscope" size={15} color="var(--gray-500)" /><span>{m.role} at {m.clinic}</span></li>
          <li><IconifyIconPW name="lucide:map-pin" size={15} color="var(--gray-500)" /><span>Based in {m.location}</span></li>
          {m.bio && <li><IconifyIconPW name="lucide:target" size={15} color="var(--gray-500)" /><span>{m.bio}</span></li>}
          <li><IconifyIconPW name="lucide:award" size={15} color="var(--gray-500)" /><span>PROfinity Gold Member</span></li>
        </ul>
        <PWBannerChips banners={banners || []} conn={conn || {}} onAdd={onAddBanner} />
      </div>
      <div className="pw-headerband-actions">
        <ButtonPW variant="brand" onClick={onEdit} iconLeading={<IconPW name="edit" size={18} color="var(--white)" />}>Edit Profile</ButtonPW>
        <button type="button" className="pw-btn-outline pw-btn-share" onClick={onShare}>
          <IconifyIconPW name="lucide:share" size={16} color="var(--text-heading)" />Share Profile
        </button>
        <button type="button" className="pw-btn-iconsq" aria-label="Settings" title="Settings" onClick={() => goPW("AccountSettingsWeb.html")}>
          <IconifyIconPW name="lucide:settings" size={18} color="var(--gray-600)" />
        </button>
      </div>
    </div>);

}

/* Tabs are cosmetic navigation within the same page — clicking one just
   smooth-scrolls to (and highlights) the matching sidebar card, the same
   fidelity level as this codebase's other static prototype pages. */
const PW_TABS = [
{ key: "all", label: "All" },
{ key: "about", label: "About" },
{ key: "services", label: "Services" },
{ key: "work", label: "Work" },
{ key: "education", label: "Education" }];


const PW_TAB_SECTION_ID = { about: "pw-sec-about", services: "pw-sec-services", work: "pw-sec-work", education: "pw-sec-education" };

function PWTabBar() {
  const [active, setActive] = useStatePW("all");
  function onTab(t) {
    setActive(t.key);
    const id = PW_TAB_SECTION_ID[t.key];
    const el = id && document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div className="pw-tabbar">
      {PW_TABS.map((t) =>
      <button key={t.key} type="button" className={"pw-tab" + (active === t.key ? " active" : "")} onClick={() => onTab(t)}>
          {t.label}
        </button>
      )}
      <button type="button" className="pw-tabbar-more" aria-label="More tab options">
        <IconifyIconPW name="lucide:more-horizontal" size={18} color="var(--gray-600)" />
      </button>
    </div>);

}

/* ---- left sidebar: a stack of white cards. The first four (Personal
   details / Links / Work / Education) mirror the Facebook reference; the
   rest (Services / Languages / Licenses / Membership / Community Channel /
   Add to your feed) are this app's own content, reusing PM_* data or the
   pre-existing right-rail pieces so nothing that worked before is lost. ---- */
function PWSectionEdit({ label }) {
  return (
    <button type="button" className="pw-side-edit" aria-label={"Edit " + label}>
      <IconifyIconPW name="lucide:pencil" size={14} color="var(--gray-500)" />
    </button>);

}

function PWSideCard({ id, title, editable, children }) {
  return (
    <section className="pw-side-card" id={id}>
      <div className="pw-side-card-hd">
        <h3>{title}</h3>
        {editable && <PWSectionEdit label={title} />}
      </div>
      {children}
    </section>);

}

function PWPersonalDetailsCard() {
  return (
    <PWSideCard id="pw-sec-about" title="Personal details" editable>
      <div className="pw-detail-rows">
        <div className="pw-detail-row">
          <IconifyIconPW name="lucide:map-pin" size={17} color="var(--gray-500)" />
          <span className="tx">Lives in <b>{PW_ME.location}</b></span>
          <IconifyIconPW name="lucide:lock" size={13} color="var(--gray-400)" />
        </div>
        <div className="pw-detail-row">
          <IconifyIconPW name="lucide:building-2" size={17} color="var(--gray-500)" />
          <span className="tx">Works at <b>{PW_ME.clinic}</b></span>
          <IconifyIconPW name="lucide:lock" size={13} color="var(--gray-400)" />
        </div>
        <div className="pw-detail-row">
          <IconifyIconPW name="lucide:graduation-cap" size={17} color="var(--gray-500)" />
          <span className="tx">Studied at <b>{PW_EDUCATION[0].school}</b></span>
          <IconifyIconPW name="lucide:lock" size={13} color="var(--gray-400)" />
        </div>
      </div>
      <button type="button" className="pw-side-seemore">See more personal details</button>
    </PWSideCard>);

}

function PWLinksCard() {
  return (
    <PWSideCard title="Links" editable>
      <div className="pw-link-row">
        <IconifyIconPW name="lucide:link" size={17} color="var(--gray-500)" />
        <span className="tx">profinity.com/katy-wilson</span>
      </div>
    </PWSideCard>);

}

function PWWorkCard() {
  return (
    <PWSideCard id="pw-sec-work" title="Work" editable>
      <div className="pw-detail-rows">
        {PW_EXPERIENCE.map((e, i) =>
        <div className="pw-work-row" key={i}>
            <span className="pw-work-icon"><IconifyIconPW name="lucide:briefcase" size={18} color="var(--brand-navy)" /></span>
            <div className="pw-work-info">
              <span className="org">{e.org}<IconifyIconPW name="lucide:lock" size={12} color="var(--gray-400)" /></span>
              <span className="role">{e.ti} · {e.yrs}</span>
            </div>
          </div>
        )}
      </div>
    </PWSideCard>);

}

function PWServicesCard() {
  return (
    <PWSideCard id="pw-sec-services" title="Services">
      <div className="pw-service-list">
        {PW_SERVICES.map((s, i) =>
        <div className="pw-service-row" key={i}>
            <span className="ti">{s.ti}</span>
            <span className="su">{s.su}</span>
          </div>
        )}
      </div>
    </PWSideCard>);

}

function PWEducationCard() {
  return (
    <PWSideCard id="pw-sec-education" title="Education" editable>
      <div className="pw-detail-rows">
        {PW_EDUCATION.map((ed, i) =>
        <div className="pw-edu-row" key={i}>
            <span className="pw-edu-logo">{ed.logo}</span>
            <div className="pw-edu-info">
              <span className="school">{ed.school}</span>
              <span className="program">{ed.program}</span>
              <span className="years">{ed.years}</span>
            </div>
          </div>
        )}
      </div>
      <button type="button" className="pw-side-seemore">See more education</button>
    </PWSideCard>);

}

function PWLanguagesCard() {
  return (
    <PWSideCard title="Languages">
      <div className="pw-lang-list">
        {PW_LANGUAGES.map((l, i) =>
        <div className="pw-lang-row" key={i}>
            <span className="flag">{l.flag}</span>
            <span className="nm">{l.name}</span>
            <span className="lvl">{l.level}</span>
          </div>
        )}
      </div>
    </PWSideCard>);

}

function PWLicensesCard() {
  return (
    <PWSideCard title="Licenses & courses">
      <div className="pw-license-list">
        {PW_LICENSES.map((l, i) =>
        <span className="pw-license-chip" key={i}>
            <IconifyIconPW name="lucide:badge-check" size={13} color="var(--brand-gold)" />{l}
          </span>
        )}
      </div>
    </PWSideCard>);

}

function PWMembershipSideCard() {
  return (
    <PWSideCard title="Membership">
      <MembershipCard style={{ border: "none", boxShadow: "none", padding: 0 }} />
    </PWSideCard>);

}

function PWChannelSideCard({ channels }) {
  return (
    <PWSideCard title="Community Channel">
      <div className="pw-channel-list">
        {channels.map((c, i) => <ChannelItemPW key={i} {...c} />)}
      </div>
    </PWSideCard>);

}

function PWSuggestionsSideCard({ suggestions }) {
  return (
    <PWSideCard title="Add to your feed">
      <div className="pw-suggestion-list">
        {suggestions.map((s, i) => <SuggestionRow key={i} s={s} />)}
      </div>
    </PWSideCard>);

}

/* ---- right column: composer, then the self-assessment / goals section
   (this page's main "member dashboard" content, so it gets the prominent
   slot), then the Posts feed. ---- */
function PWComposerCard({ profile }) {
  const m = profile || PW_ME;
  const firstName = m.name.split(" ")[0];
  return (
    <section className="pw-composer-card">
      <div className="pw-composer-top">
        {m.avatar ? <img className="pw-composer-avatar" src={m.avatar} alt={m.name} /> : <AvatarPW name={m.name} size={48} />}
        <button type="button" className="pw-composer-pill" onClick={() => goPW("NewsfeedWeb.html")}>
          {"What's on your mind, " + firstName + "?"}
        </button>
        <div className="pw-composer-actions">
          <button type="button" className="pw-composer-action" aria-label="Live video" title="Live video" onClick={() => goPW("NewsfeedWeb.html?golive=1")}>
            <IconifyIconPW name="fluent:video-24-filled" size={30} color="#E8455D" />
          </button>
          <button type="button" className="pw-composer-action" aria-label="Photo" title="Photo" onClick={() => goPW("NewsfeedWeb.html")}>
            <IconifyIconPW name="fluent:image-multiple-24-filled" size={30} color="#3DBE5B" />
          </button>
          <button type="button" className="pw-composer-action" aria-label="Reel" title="Reel" onClick={() => goPW("NewsfeedWeb.html")}>
            <IconifyIconPW name="fluent:movies-and-tv-24-filled" size={30} color="#E8455D" />
          </button>
        </div>
      </div>
    </section>);

}

/* ---- Upcoming lives ----
   Lives booked via the newsfeed composer's Go Live → Schedule (web) or
   Create Post → Live → Schedule (mobile). Read from the shared
   "pf-scheduled-lives" localStorage list; hidden when empty unless the
   viewer is a Super User (the only role that can go live). */
const PW_SCHED_KEY = "pf-scheduled-lives";
function pwLoadScheduledLives() {
  try { return JSON.parse(localStorage.getItem(PW_SCHED_KEY)) || []; } catch (e) { return []; }
}
function pwSaveScheduledLives(list) {
  try { localStorage.setItem(PW_SCHED_KEY, JSON.stringify(list)); } catch (e) {}
}
/* Super User = the Admin persona. Mobile Create Post persists it under
   "pf-preview-tier"; the web newsfeed's "Previewing as" panel under
   "pf-subscription-tier" — accept either so both surfaces agree. */
function pwIsSuperUser() {
  try {
    return localStorage.getItem("pf-preview-tier") === "admin" || localStorage.getItem("pf-subscription-tier") === "admin";
  } catch (e) { return false; }
}
function pwFormatLiveWhen(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }) + " · " +
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
function pwLiveCountdown(iso) {
  const ms = new Date(iso) - Date.now();
  if (isNaN(ms)) return "";
  const abs = Math.abs(ms), m = Math.round(abs / 60000), h = Math.round(abs / 3600000), d = Math.round(abs / 86400000);
  if (ms < 0) return m < 60 ? "Started " + m + " min ago" : "Started " + h + " hr" + (h === 1 ? "" : "s") + " ago";
  if (m < 15) return "Starting soon";
  if (m < 60) return "in " + m + " min";
  if (h < 24) return "in " + h + " hr" + (h === 1 ? "" : "s");
  return "in " + d + " day" + (d === 1 ? "" : "s");
}

/* Temporarily hidden (2026-09-10) — flip to true to bring the card back. */
const PW_SHOW_UPCOMING_LIVES = false;
function PWUpcomingLivesCard() {
  const [lives, setLives] = useStatePW(pwLoadScheduledLives);
  const [confirmId, setConfirmId] = useStatePW(null);
  const superUser = pwIsSuperUser();
  useEffectPW(() => {
    const sync = () => setLives(pwLoadScheduledLives());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("focus", sync); };
  }, []);
  useEffectPW(() => {
    if (window.location.hash !== "#upcoming-lives") return;
    const t = setTimeout(() => {
      const el = document.getElementById("upcoming-lives");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
    return () => clearTimeout(t);
  }, []);
  const cancelLive = (id) => {
    const next = lives.filter((x) => x.id !== id);
    pwSaveScheduledLives(next);
    setLives(next);
    setConfirmId(null);
  };
  const goLive = (item) => goPW("NewsfeedWeb.html?golive=1&sched=" + encodeURIComponent(item.id));
  if (lives.length === 0 && !superUser) return null;
  const now = Date.now();
  return (
    <section id="upcoming-lives" className="pw-card pw-lives-card">
      <div className="pw-card-hd">
        <div className="pw-card-hd-ti">
          <h2>Upcoming lives</h2>
          {lives.length > 0 && <span className="pw-lives-count">{lives.length} scheduled</span>}
        </div>
        {superUser && lives.length > 0 &&
        <button type="button" className="pw-lives-add" onClick={() => goPW("NewsfeedWeb.html?golive=1")}>
          <IconifyIconPW name="lucide:plus" size={15} color="var(--brand-navy)" />Schedule another
        </button>}
      </div>

      {lives.length === 0 ? (
        <div className="pw-lives-empty">
          <p>No lives scheduled yet. Plan one ahead so your followers know when to tune in.</p>
          <button type="button" className="pw-lives-schedule" onClick={() => goPW("NewsfeedWeb.html?golive=1")}>
            <IconifyIconPW name="lucide:calendar-clock" size={17} color="#fff" />Schedule a live
          </button>
        </div>
      ) : (
        <ul className="pw-lives-list">
          {lives.map((item) => {
            const due = new Date(item.startIso).getTime() - now < 15 * 60 * 1000;
            return (
              <li key={item.id} className={"pw-live-row" + (due ? " due" : "")}>
                <div className="pw-live-date" aria-hidden="true">
                  <span className="d">{new Date(item.startIso).getDate()}</span>
                  <span className="m">{new Date(item.startIso).toLocaleDateString(undefined, { month: "short" })}</span>
                </div>
                <div className="pw-live-main">
                  <span className="pw-live-status">{due ? <><span className="dot" />Live soon</> : "Scheduled"}</span>
                  <span className="pw-live-ti">{item.title}</span>
                  <span className="pw-live-meta">
                    <IconifyIconPW name="lucide:clock" size={13} color="var(--gray-500)" />{pwFormatLiveWhen(item.startIso)}
                    <span className="sep">·</span>{pwLiveCountdown(item.startIso)}
                    <span className="sep">·</span>{item.dest}
                  </span>
                </div>
                {superUser && (
                  confirmId === item.id ? (
                    <div className="pw-live-confirm">
                      <span>Cancel this live?</span>
                      <button type="button" className="yes" onClick={() => cancelLive(item.id)}>Yes, cancel</button>
                      <button type="button" className="no" onClick={() => setConfirmId(null)}>Keep</button>
                    </div>
                  ) : (
                    <div className="pw-live-actions">
                      <button type="button" className="pw-live-go" onClick={() => goLive(item)}>
                        <IconifyIconPW name="lucide:radio" size={15} color="#fff" />Go live now
                      </button>
                      <button type="button" className="pw-live-cancel" onClick={() => setConfirmId(item.id)}>Cancel</button>
                    </div>
                  )
                )}
              </li>);
          })}
        </ul>
      )}
    </section>);
}

function PWPostCard({ p, pinned }) {
  const lines = p.body.split("\n");
  return (
    <article className={"pw-post-card" + (pinned ? " pinned" : "")}>
      <div className="pw-post-hd">
        <ProfileLinkPW author={p} className="pf-prof-av"><AvatarPW name={p.name} src={p.avatar} size={44} /></ProfileLinkPW>
        <div className="pw-post-by">
          <span className="nm"><ProfileLinkPW author={p} className="pf-prof-nm">{p.name}</ProfileLinkPW>{pinned && <span className="ctx">is in <b>{p.loc}</b></span>}</span>
          <span className="meta">
            {pinned && p.tag && <span className="pw-post-tag">{p.tag}</span>}
            <span className="tm">{p.time}</span>
          </span>
        </div>
        <button type="button" className="pw-post-more" aria-label="More post options">
          <IconifyIconPW name="lucide:more-horizontal" size={20} color="var(--gray-450)" />
        </button>
      </div>
      <h4 className="pw-post-ttl">{p.title}</h4>
      <p className="pw-post-body">{lines[0]} <button type="button" className="pw-post-seemore">See more</button></p>
      {p.images &&
      <div className="pw-post-images">
          {p.images.map((src, i) => <img key={i} src={src} alt="" />)}
        </div>
      }
      <div className="pw-post-eng">
        <span><IconifyIconPW name="lucide:thumbs-up" size={16} color="var(--gray-500)" />{p.likes}</span>
        <span><IconifyIconPW name="lucide:message-circle" size={16} color="var(--gray-500)" />{p.comments}</span>
        <span><IconifyIconPW name="lucide:share-2" size={16} color="var(--gray-500)" />{p.shares}</span>
      </div>
    </article>);

}

function PWPostsCard() {
  const [view, setView] = useStatePW("list");
  return (
    <section className="pw-posts-card">
      <div className="pw-posts-hd">
        <h2>Posts</h2>
        <div className="pw-posts-hd-actions">
          <button type="button" className="pw-posts-toolbtn"><IconifyIconPW name="lucide:filter" size={15} color="var(--gray-600)" />Filters</button>
          <button type="button" className="pw-posts-toolbtn"><IconifyIconPW name="lucide:settings-2" size={15} color="var(--gray-600)" />Manage posts</button>
        </div>
      </div>
      <div className="pw-posts-subrow">
        <button type="button" className={"pw-view-toggle" + (view === "list" ? " active" : "")} onClick={() => setView("list")}>
          <IconifyIconPW name="lucide:list" size={16} color={view === "list" ? "var(--brand-navy)" : "var(--gray-500)"} />List view
        </button>
        <button type="button" className={"pw-view-toggle" + (view === "grid" ? " active" : "")} onClick={() => setView("grid")}>
          <IconifyIconPW name="lucide:grid-2x2" size={16} color={view === "grid" ? "var(--brand-navy)" : "var(--gray-500)"} />Grid view
        </button>
      </div>
      {view === "list" ?
      <div className="pw-posts-list">
          <span className="pw-pinned-label"><IconifyIconPW name="lucide:pin" size={13} color="var(--gray-500)" />Pinned post</span>
          {PW_ACTIVITY.map((p, i) => <PWPostCard key={i} p={p} pinned={i === 0} />)}
        </div> :

      <div className="pw-posts-grid">
          {PW_ACTIVITY.map((p, i) =>
        <div className="pw-posts-grid-tile" key={i}>
              {p.images ?
          <img src={p.images[0]} alt="" /> :

          <span className="pw-posts-grid-fallback"><IconifyIconPW name="lucide:file-text" size={26} color="var(--gray-400)" /></span>
          }
              <span className="ti">{p.title}</span>
              <span className="tm">{p.time}</span>
            </div>
        )}
        </div>
      }
    </section>);

}

function ProfileMain({ assessState, onOpenHub, profile, banners, conn, onEdit, onShare, onAvatar, onAddBanner }) {
  const D = window.APP_DATA;
  const p = D.profile;
  return (
    <>
      <PWCoverHeader profile={profile} onAvatar={onAvatar} />
      <div className="pw-page">
        <PWHeaderBand profile={profile} banners={banners} conn={conn} onEdit={onEdit} onShare={onShare} onAddBanner={onAddBanner} />
        <div className="pw-divider" />
        <PWTabBar />
        <div className="pw-body">
          <div className="pw-sidebar">
            <PWPersonalDetailsCard />
            <PWLinksCard />
            <PWWorkCard />
            <PWServicesCard />
            <PWEducationCard />
            <PWLanguagesCard />
            <PWLicensesCard />
            <PWMembershipSideCard />
            <PWChannelSideCard channels={p.feedChannels} />
            <PWSuggestionsSideCard suggestions={p.suggestions} />
          </div>
          <div className="pw-main">
            <PWComposerCard profile={profile} />
            {PW_SHOW_UPCOMING_LIVES && <PWUpcomingLivesCard />}
            <PWGoalsSection assessState={assessState} onOpenHub={onOpenHub} />
            <PWPostsCard />
          </div>
        </div>
      </div>
    </>);

}


/* ===========================================================================
   Viewing another member — Profile.html?id=<slug>[&name=&avatar=&role=].
   Desktop counterpart of ProfileMobile's "?id=" viewer mode: every avatar /
   author name on the web pages (feed, comments, course comments…) lands
   here via profile-link.js. Curated members below (same data as
   PM_OTHER_USERS in profile-mobile.jsx, copied per this file's PW_
   convention); anyone else gets a minimal profile built from the query so
   the link is never a dead end. Read-only: Follow / Message instead of
   Edit, no composer or goals, and every sidebar card is conditional on the
   member actually having that information.
   =========================================================================== */
const PW_OTHER_USERS = {
  "miranda-pearce": {
    name: "Miranda Pearce", role: "Aesthetic Nurse Practitioner", avatar: "assets/avatar-miranda.jpg", seals: ["gb", "verified", "gold"],
    flag: "🇬🇧", headline: "Aesthetic Nurse Practitioner", specialties: ["Lip Enhancement", "Skin Boosters", "Profhilo"],
    upcomingLive: "September 24, 2026", link: "mirandapearce.co.uk",
    banners: { instagram: "mirandapearce", threads: "mirandapearce", facebook: "Miranda Pearce" },
    bio: "Aesthetic nurse and PROfinity mentor. Helping practitioners build calm, confident consultations.",
    location: "London, United Kingdom", clinic: "PROfinity Academy",
    posts: "148", followers: "9.2K", following: "412",
    shared: { mutualConnections: 19, community: "Confidence Path", courses: ["8D Lip Design", "Temple Filler"] },
    activity: { lastActive: "20m ago", highlights: [
      { icon: "lucide:file-text", text: "Posted a lip mapping walkthrough", time: "Today" },
      { icon: "lucide:message-circle", text: "Replied to your comment", time: "Yesterday" },
      { icon: "lucide:calendar-check", text: "Hosting Lip Design Live Q&A", time: "24 Sep" }] },
    services: [
      { ti: "Lip Enhancement", su: "Career Academy: Dr Tim Pearce" },
      { ti: "Skin Boosters", su: "Career Academy: Dr Tim Pearce" }],
    experience: [{ ti: "Aesthetic Nurse Practitioner", yrs: "11 years", org: "PROfinity Academy", loc: "London, United Kingdom" }],
    education: [{ logo: "KCL", school: "King's College London", program: "BSc Nursing", years: "2008 - 2011" }],
    licenses: ["8D Lips Course", "Anatomy360", "Botox Foundations"],
    languages: [{ flag: "🇬🇧", name: "English (UK)", level: "Primary" }]
  },
  "dr-amir-khan": {
    name: "Dr Amir Khan", role: "Aesthetic Doctor", avatar: "assets/avatar-amir-khan.jpg", seals: ["verified", "gold"],
    flag: "🇬🇧", headline: "Aesthetic Medicine Doctor", specialties: ["Full-Face Filler", "Tear Trough", "Jawline"],
    upcomingLive: "October 8, 2026", link: "dramirkhan.co.uk",
    banners: { instagram: "dramirkhan", youtube: "Dr Amir Khan" },
    bio: "Full-face harmonisation with a safety-first approach. Sharing cases, complications and lessons learned.",
    location: "Manchester, United Kingdom", clinic: "Khan Aesthetics",
    posts: "96", followers: "4.8K", following: "233",
    shared: { mutualConnections: 12, community: "Mastery Path", courses: ["Temple Filler", "Protox Course"] },
    activity: { lastActive: "2h ago", highlights: [
      { icon: "lucide:file-text", text: "Posted a tear trough case review", time: "Today" },
      { icon: "lucide:thumbs-up", text: "Liked your latest post", time: "2d" }] },
    services: [{ ti: "Dermal Fillers", su: "Career Academy: Dr Tim Pearce" }, { ti: "Full-Face Rejuvenation", su: "Career Academy: Dr Tim Pearce" }],
    experience: [{ ti: "Aesthetic Doctor", yrs: "8 years", org: "Khan Aesthetics", loc: "Manchester, United Kingdom" }],
    education: [{ logo: "UoM", school: "University of Manchester", program: "MBChB Medicine", years: "2009 - 2014" }],
    licenses: ["Anatomy360", "The Ultimate Toxin Eye Complications Masterclass"],
    languages: [{ flag: "🇬🇧", name: "English (UK)", level: "Primary" }, { flag: "🇵🇰", name: "Urdu", level: "Secondary" }]
  },
  "priya-shah": {
    name: "Priya Shah", role: "Aesthetic Nurse", avatar: "assets/avatar-priya-shah.jpg", seals: ["verified"],
    flag: "🇬🇧", headline: "Aesthetic Nurse Prescriber", specialties: ["Anti-Wrinkle", "Skin Boosters", "Microneedling"],
    link: "priyashahaesthetics.com",
    banners: { instagram: "priyashah.aesthetics", facebook: "Priya Shah" },
    bio: "Nurse prescriber growing a home clinic one happy patient at a time.",
    location: "Leicester, United Kingdom", clinic: "Priya Shah Aesthetics",
    posts: "61", followers: "2.1K", following: "318",
    shared: { mutualConnections: 9, community: "Confidence Path", courses: ["Botox Foundations"] },
    activity: { lastActive: "45m ago", highlights: [
      { icon: "lucide:message-circle", text: "Asked a question in Confidence Path", time: "Today" },
      { icon: "lucide:file-text", text: "Shared her first before & after", time: "3d" }] },
    services: [{ ti: "Botox (Anti-Wrinkle Injections)", su: "Career Academy: Dr Tim Pearce" }],
    experience: [{ ti: "Aesthetic Nurse", yrs: "4 years", org: "Priya Shah Aesthetics", loc: "Leicester, United Kingdom" }],
    education: [{ logo: "DMU", school: "De Montfort University", program: "BSc Nursing", years: "2015 - 2018" }],
    licenses: ["Botox Foundations"],
    languages: [{ flag: "🇬🇧", name: "English (UK)", level: "Primary" }, { flag: "🇮🇳", name: "Gujarati", level: "Secondary" }]
  },
  "nurse-beth": {
    name: "Nurse Beth", role: "Aesthetic Nurse", avatar: "assets/avatar-nurse-beth.jpg", seals: ["verified"],
    flag: "🇬🇧", headline: "Independent Aesthetic Nurse", specialties: ["Anti-Wrinkle", "Lip Enhancement"],
    upcomingLive: "October 15, 2026", link: "nursebeth.co.uk",
    banners: { instagram: "nursebeth", threads: "nursebeth" },
    bio: "Independent nurse, 2 years in. Documenting the messy middle of building a clinic.",
    location: "Bristol, United Kingdom", clinic: "Beth Aesthetics",
    posts: "43", followers: "1.4K", following: "290",
    shared: { mutualConnections: 6, community: "Confidence Path", courses: ["8D Lip Design"] },
    activity: { lastActive: "3h ago", highlights: [
      { icon: "lucide:file-text", text: "Posted about consultation nerves", time: "Yesterday" },
      { icon: "lucide:thumbs-up", text: "Liked 4 of your posts", time: "1w" }] },
    services: [{ ti: "Lip Enhancement", su: "Career Academy: Dr Tim Pearce" }],
    experience: [{ ti: "Aesthetic Nurse", yrs: "2 years", org: "Beth Aesthetics", loc: "Bristol, United Kingdom" }],
    education: [{ logo: "UWE", school: "University of the West of England", program: "BSc Nursing", years: "2017 - 2020" }],
    licenses: ["8D Lips Course"],
    languages: [{ flag: "🇬🇧", name: "English (UK)", level: "Primary" }]
  },
  "mark-ellis": {
    name: "Mark Ellis", role: "Clinic Owner", avatar: "assets/avatar-mark-ellis.jpg", seals: ["verified", "crown"],
    flag: "🇬🇧", headline: "Clinic Owner & Business Mentor", specialties: ["Clinic Growth", "Marketing", "Systems"],
    link: "ellisclinics.com",
    banners: { linkedin: "Mark Ellis", instagram: "markellis.clinics" },
    bio: "Three clinics, one team. Talking about the business side of aesthetics.",
    location: "Birmingham, United Kingdom", clinic: "Ellis Clinics",
    posts: "77", followers: "3.6K", following: "150",
    shared: { mutualConnections: 14, community: "Freedom Path", courses: [] },
    activity: { lastActive: "1d ago", highlights: [
      { icon: "lucide:file-text", text: "Posted a pricing breakdown", time: "2d" },
      { icon: "lucide:calendar-check", text: "Attending Business Systems Workshop", time: "12 Oct" }] },
    services: [],
    experience: [{ ti: "Founder & Director", yrs: "10 years", org: "Ellis Clinics", loc: "Birmingham, United Kingdom" }],
    education: [{ logo: "AST", school: "Aston University", program: "BSc Business Management", years: "2005 - 2008" }],
    licenses: ["Business Systems Masterclass"],
    languages: [{ flag: "🇬🇧", name: "English (UK)", level: "Primary" }]
  },
  "dr-sarah-collins": {
    name: "Dr. Sarah Collins", role: "Aesthetic Doctor", avatar: "assets/avatar-sarah-collins.jpg", seals: ["verified", "gold"],
    flag: "🇮🇪", headline: "Aesthetic Doctor & Educator", specialties: ["Complications", "Toxin", "Facial Anatomy"],
    upcomingLive: "September 29, 2026", link: "drsarahcollins.ie",
    banners: { instagram: "drsarahcollins", linkedin: "Dr Sarah Collins" },
    bio: "GP turned aesthetic doctor. Passionate about anatomy-led, complication-aware practice.",
    location: "Dublin, Ireland", clinic: "Collins Clinic",
    posts: "112", followers: "6.3K", following: "201",
    shared: { mutualConnections: 17, community: "Mastery Path", courses: ["Protox Course", "Temple Filler"] },
    activity: { lastActive: "Just now", highlights: [
      { icon: "lucide:file-text", text: "Posted a vascular occlusion protocol", time: "Today" },
      { icon: "lucide:message-circle", text: "Commented on your post", time: "Today" }] },
    services: [{ ti: "Botox (Anti-Wrinkle Injections)", su: "Career Academy: Dr Tim Pearce" }, { ti: "Dermal Fillers", su: "Career Academy: Dr Tim Pearce" }],
    experience: [{ ti: "Aesthetic Doctor", yrs: "9 years", org: "Collins Clinic", loc: "Dublin, Ireland" }],
    education: [{ logo: "TCD", school: "Trinity College Dublin", program: "MB BCh BAO Medicine", years: "2004 - 2010" }],
    licenses: ["Anatomy360", "Pro Tox Course", "The Ultimate Toxin Eye Complications Masterclass"],
    languages: [{ flag: "🇮🇪", name: "English (IE)", level: "Primary" }]
  },
  "james-lee": {
    name: "James Lee", role: "Surgical Nurse Practitioner", avatar: null, seals: ["verified"],
    flag: "🇦🇺", headline: "Surgical Nurse Practitioner", specialties: ["Suturing", "Wound Care", "Post-Op"],
    upcomingLive: "October 2, 2026", link: "sydneyaesthetic.com.au",
    banners: { instagram: "jameslee.np", linkedin: "James Lee" },
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
    flag: "🇨🇦", headline: "Dental Practitioner", specialties: ["Digital Dentistry", "Treatment Planning"],
    link: "garciadental.ca",
    banners: { instagram: "drlindagarcia", facebook: "Linda Garcia" },
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
    flag: "🇬🇧", headline: "Aesthetic Medicine Doctor & Trainer", specialties: ["Botox", "Fillers", "Full-Face Rejuvenation"],
    upcomingLive: "September 30, 2026", link: "drtimpearce.com",
    banners: { instagram: "drtimpearce", youtube: "Dr Tim Pearce", facebook: "Dr Tim Pearce" },
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

function readProfileIdParamPW() {
  try {
    const params = new URLSearchParams(window.location.search);
    return { id: params.get("id"), name: params.get("name"), avatar: params.get("avatar"), role: params.get("role"), from: params.get("from") };
  } catch (e) { return { id: null, name: null, avatar: null, role: null, from: null }; }
}
/* Header tab of the page a member was opened from (?from=), so the top nav
   stays on Home / Community / My Learning instead of jumping to Profile. */
function pwTabForPage(from) {
  const page = String(from || "").split("?")[0].split("/").pop();
  if (/^Community/i.test(page)) return "Community";
  if (/^(MyLearning|LessonWeb|CourseWeb|MyCoursesWeb|AllCoursesWeb|SubModuleWeb|CourseLanding)/i.test(page)) return "My Learning";
  if (/^Agent/i.test(page)) return "Agent";
  if (/^Rewards/i.test(page)) return "Rewards";
  if (/^Profile/i.test(page) || !page) return "Profile";
  return "Home";
}

function buildMinimalProfilePW(name, avatar, role) {
  /* Deterministic per name so a member looks the same on every visit. */
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const pick = (arr, n) => arr[(h >>> n) % arr.length];
  const place = pick([
    ["London, United Kingdom", "Harley Street Clinic", "🇬🇧"], ["Manchester, United Kingdom", "Northern Aesthetics", "🇬🇧"],
    ["Leeds, United Kingdom", "Skin & Tonic Clinic", "🇬🇧"], ["Dublin, Ireland", "Liffey Aesthetics", "🇮🇪"],
    ["Sydney, Australia", "Harbour Skin Clinic", "🇦🇺"], ["Toronto, Canada", "Lakeside Aesthetics", "🇨🇦"],
    ["Edinburgh, United Kingdom", "Old Town Aesthetics", "🇬🇧"], ["Glasgow, United Kingdom", "Clyde Clinic", "🇬🇧"]], 4);
  const flag = place[2];
  const specialties = pick([
    ["Botox", "Fillers", "Lip Enhancement"], ["Anti-Wrinkle", "Skin Boosters", "Profhilo"],
    ["Lip Enhancement", "Cheek Contouring"], ["Dermal Fillers", "Jawline", "Chin"],
    ["Toxin", "Microneedling", "Skincare"], ["Full-Face Filler", "Tear Trough"]], 7);
  const live = pick(["September 23, 2026", "October 1, 2026", "October 9, 2026", "October 21, 2026", null, null], 10);
  const handle = name.toLowerCase().replace(/^(dr|mr|mrs|ms|miss|prof)\.?\s+/, "").replace(/[^a-z0-9]/g, "");
  const first = name.split(" ").filter((w) => !/^(dr|mr|mrs|ms|miss|prof)\.?$/i.test(w))[0] || name;
  const num = (base, n) => (base + ((h >>> n) % base)).toLocaleString("en-GB");
  return {
    name,
    avatar: avatar || undefined,
    role: role || "Aesthetic Practitioner",
    seals: ["verified"],
    flag, headline: role || "Aesthetic Practitioner", specialties, upcomingLive: live,
    link: handle + ".co.uk",
    banners: { instagram: handle, facebook: name },
    bio: first + " is a PROfinity community member sharing cases, questions and wins with fellow practitioners.",
    location: place[0], clinic: place[1],
    posts: num(40, 1), followers: num(900, 3), following: num(200, 5),
    shared: { mutualConnections: 3 + ((h >>> 6) % 12), community: pick(["Confidence Path", "Mastery Path", "Freedom Path"], 8), courses: pick([[], ["Botox Foundations"], ["8D Lip Design"], ["Temple Filler", "Protox Course"]], 9) },
    activity: { lastActive: pick(["Just now", "1h ago", "3h ago", "Yesterday"], 11), highlights: [
      { icon: "lucide:file-text", text: "Posted in the community", time: "This week" },
      { icon: "lucide:thumbs-up", text: "Liked one of your posts", time: "2d" }] },
    services: specialties.slice(0, 2).map((t) => ({ ti: t, su: "Career Academy: Dr Tim Pearce" })),
    experience: [{ ti: role || "Aesthetic Practitioner", yrs: (3 + ((h >>> 12) % 12)) + " years", org: place[1], loc: place[0] }],
    education: [],
    licenses: pick([["Botox Foundations"], ["8D Lips Course"], ["Anatomy360", "Botox Foundations"], []], 13),
    languages: [{ flag: "🇬🇧", name: "English", level: "Primary" }]
  };
}

function PWOtherCover({ user, onAvatar }) {
  return (
    <div className="pw-cover">
      <div className="pw-cover-inner">
        <button type="button" className="pw-cover-avatarwrap pw-other-avatarwrap pw-cover-avbtn" aria-label={"View " + user.name + "'s profile picture"} onClick={onAvatar}>
          {user.avatar ?
          <img className="pw-cover-avatar" src={user.avatar} alt={user.name} /> :
          <AvatarPW name={user.name} size={156} className="pw-cover-avatar pw-other-avatar-initials" />}
        </button>
      </div>
    </div>);
}

function PWOtherHeaderBand({ user, following, onFollow, onMessage }) {
  return (
    <div className="pw-headerband pw-other-headerband">
      <div className="pw-headerband-spacer" aria-hidden="true" />
      <div className="pw-headerband-info">
        <span className="pw-headerband-namerow">
          <h1>{user.name}</h1>
          {user.seals && <VerificationSealsPW seals={user.seals} size={19} />}
        </span>
        <div className="pw-headerband-stats">{user.followers} followers · {user.following} following · {user.posts} posts</div>
        <ul className="pw-headerband-facts">
          {user.role && <li><IconifyIconPW name="lucide:stethoscope" size={15} color="var(--gray-500)" /><span>{user.role}{user.clinic ? " at " + user.clinic : ""}</span></li>}
          {user.location && <li><IconifyIconPW name="lucide:map-pin" size={15} color="var(--gray-500)" /><span>Based in {user.location}</span></li>}
          {user.bio && <li><IconifyIconPW name="lucide:quote" size={15} color="var(--gray-500)" /><span>{user.bio}</span></li>}
          {user.shared && user.shared.community && <li><IconifyIconPW name="lucide:crown" size={15} color="var(--gray-500)" /><span>{user.shared.community} member</span></li>}
        </ul>
      </div>
      <div className="pw-headerband-actions">
        {following ?
        <button type="button" className="pw-btn-outline pw-other-following" onClick={onFollow}>
            <IconifyIconPW name="lucide:check" size={16} color="var(--text-heading)" />Following
          </button> :
        <ButtonPW variant="brand" onClick={onFollow} iconLeading={<IconifyIconPW name="lucide:user-plus" size={17} color="var(--white)" />}>Follow</ButtonPW>}
        <button type="button" className="pw-btn-outline" onClick={onMessage}>
          <IconifyIconPW name="lucide:message-circle" size={16} color="var(--text-heading)" />Message
        </button>
      </div>
    </div>);
}

function PWOtherSharedCard({ user }) {
  const shared = user.shared || {};
  const courses = shared.courses || [];
  const has = shared.mutualConnections != null || shared.community || courses.length;
  if (!has) return null;
  return (
    <PWSideCard title="Shared with you">
      <div className="pw-detail-rows">
        {shared.mutualConnections != null &&
        <div className="pw-detail-row"><IconifyIconPW name="lucide:users" size={17} color="var(--gray-500)" /><span className="tx"><b>{shared.mutualConnections}</b> mutual connections</span></div>}
        {shared.community &&
        <div className="pw-detail-row"><IconifyIconPW name="lucide:crown" size={17} color="var(--brand-gold)" /><span className="tx">Both in <b>{shared.community}</b></span></div>}
        {courses.length > 0 &&
        <div className="pw-detail-row"><IconifyIconPW name="lucide:book-open" size={17} color="var(--gray-500)" /><span className="tx"><b>{courses.length}</b> shared {courses.length === 1 ? "course" : "courses"}</span></div>}
      </div>
      {courses.length > 0 &&
      <div className="pw-license-list pw-other-courses">
          {courses.map((c, i) => <span className="pw-license-chip" key={i}><IconifyIconPW name="lucide:book-open" size={13} color="var(--brand-navy)" />{c}</span>)}
        </div>}
    </PWSideCard>);
}

function PWOtherActivityCard({ user }) {
  const activity = user.activity || {};
  const highlights = activity.highlights || [];
  return (
    <section className="pw-posts-card pw-other-activity">
      <div className="pw-posts-hd">
        <h2>Recent activity</h2>
        {activity.lastActive && <span className="pw-other-lastactive">Active {activity.lastActive}</span>}
      </div>
      {highlights.length ?
      <ul className="pw-other-activity-list">
          {highlights.map((h, i) =>
          <li key={i}>
              <span className="ic"><IconifyIconPW name={h.icon || "lucide:activity"} size={17} color="var(--brand-navy)" /></span>
              <span className="tx">{h.text}</span>
              <span className="tm">{h.time}</span>
            </li>)}
        </ul> :
      <div className="pw-other-empty">
          <IconifyIconPW name="lucide:sparkles" size={22} color="var(--gray-400)" />
          <p>{user.name.split(" ")[0]} hasn't shared anything with the community yet.</p>
        </div>}
    </section>);
}

function PWOtherProfileMain({ user }) {
  const [following, setFollowing] = useStatePW(false);
  const [avatarOpen, setAvatarOpen] = useStatePW(() => pwQuery("avatar") === "1");
  const [qrOpen, setQrOpen] = useStatePW(() => pwQuery("qr") === "1");
  const [shareOpen, setShareOpen] = useStatePW(() => pwQuery("share") === "1");
  /* Message → that member's DM thread (DirectMessage.html), not the inbox.
     Same query contract as the mobile twin: id/name/avatar/role build or
     resolve the thread, ?from= returns to this profile. */
  const openMessages = () => {
    const q = new URLSearchParams();
    const PL = window.PFProfileLink;
    q.set("id", user.id || (PL && PL.slug ? PL.slug(user.name) : String(user.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")));
    q.set("name", user.name);
    if (user.avatar) q.set("avatar", user.avatar);
    if (user.role) q.set("role", user.role);
    try { q.set("from", (window.location.pathname.split("/").pop() || "Profile.html") + (window.location.search || "")); } catch (e) { q.set("from", "Profile.html"); }
    goPW("DirectMessage.html?" + q.toString());
  };
  const services = user.services || [], experience = user.experience || [], education = user.education || [];
  const languages = user.languages || [], licenses = user.licenses || [];
  const link = pwProfileLink(user);
  return (
    <>
      <PWOtherCover user={user} onAvatar={() => setAvatarOpen(true)} />
      {avatarOpen &&
      <PWAvatarViewer user={user} following={following} onToggleFollow={() => setFollowing((f) => !f)}
        onQr={() => { setAvatarOpen(false); setQrOpen(true); }} onShare={() => { setAvatarOpen(false); setShareOpen(true); }}
        onClose={() => setAvatarOpen(false)} />}
      {qrOpen && <PWQrShareModal user={user} link={link} onClose={() => setQrOpen(false)} onShare={() => { setQrOpen(false); setShareOpen(true); }} />}
      {shareOpen && <PWShareProfileModal user={user} link={link} onClose={() => setShareOpen(false)} onQr={() => { setShareOpen(false); setQrOpen(true); }} />}
      <div className="pw-page">
        <PWOtherHeaderBand user={user} following={following} onFollow={() => setFollowing((f) => !f)} onMessage={openMessages} />
        <div className="pw-divider" />
        <div className="pw-body pw-other-body">
          <div className="pw-sidebar">
            {(user.location || user.clinic || education[0]) &&
            <PWSideCard title="About">
              <div className="pw-detail-rows">
                {user.location && <div className="pw-detail-row"><IconifyIconPW name="lucide:map-pin" size={17} color="var(--gray-500)" /><span className="tx">Lives in <b>{user.location}</b></span></div>}
                {user.clinic && <div className="pw-detail-row"><IconifyIconPW name="lucide:building-2" size={17} color="var(--gray-500)" /><span className="tx">Works at <b>{user.clinic}</b></span></div>}
                {education[0] && <div className="pw-detail-row"><IconifyIconPW name="lucide:graduation-cap" size={17} color="var(--gray-500)" /><span className="tx">Studied at <b>{education[0].school}</b></span></div>}
              </div>
            </PWSideCard>}
            <PWOtherSharedCard user={user} />
            {experience.length > 0 &&
            <PWSideCard title="Work">
              <div className="pw-detail-rows">
                {experience.map((e, i) =>
                <div className="pw-work-row" key={i}>
                    <span className="pw-work-icon"><IconifyIconPW name="lucide:briefcase" size={18} color="var(--brand-navy)" /></span>
                    <div className="pw-work-info"><span className="org">{e.org}</span><span className="role">{e.ti} · {e.yrs}</span></div>
                  </div>)}
              </div>
            </PWSideCard>}
            {services.length > 0 &&
            <PWSideCard title="Services">
              <div className="pw-service-list">
                {services.map((sv, i) => <div className="pw-service-row" key={i}><span className="ti">{sv.ti}</span><span className="su">{sv.su}</span></div>)}
              </div>
            </PWSideCard>}
            {education.length > 0 &&
            <PWSideCard title="Education">
              <div className="pw-detail-rows">
                {education.map((ed, i) =>
                <div className="pw-edu-row" key={i}>
                    <span className="pw-edu-logo">{ed.logo}</span>
                    <div className="pw-edu-info"><span className="school">{ed.school}</span><span className="program">{ed.program}</span><span className="years">{ed.years}</span></div>
                  </div>)}
              </div>
            </PWSideCard>}
            {languages.length > 0 &&
            <PWSideCard title="Languages">
              <div className="pw-lang-list">
                {languages.map((l, i) => <div className="pw-lang-row" key={i}><span className="flag">{l.flag}</span><span className="nm">{l.name}</span><span className="lvl">{l.level}</span></div>)}
              </div>
            </PWSideCard>}
            {licenses.length > 0 &&
            <PWSideCard title="Licenses & courses">
              <div className="pw-license-list">
                {licenses.map((l, i) => <span className="pw-license-chip" key={i}><IconifyIconPW name="lucide:badge-check" size={13} color="var(--brand-gold)" />{l}</span>)}
              </div>
            </PWSideCard>}
          </div>
          <div className="pw-main">
            <PWOtherActivityCard user={user} />
          </div>
        </div>
      </div>
    </>);
}

function PWOtherNotFound() {
  return (
    <div className="pw-page">
      <div className="pw-other-notfound">
        <IconifyIconPW name="lucide:user-x" size={40} color="var(--gray-400)" />
        <h2>Profile not found</h2>
        <p>This profile may have been removed, or the link is out of date.</p>
        <ButtonPW variant="brand" onClick={() => (window.pfGo || function (u) { window.location.href = u; })("NewsfeedWeb.html")}>Back to Home</ButtonPW>
      </div>
    </div>);
}

/* ===========================================================================
   Own-profile tools ported from profile-mobile.jsx (Sept 2026 pass) — the
   avatar viewer, QR share card, "Share profile" sheet, the Instagram-style
   Edit profile form and its Banners screen. Same localStorage stores as
   mobile (pf-social-connections / pf-profile-banners) so banners added on
   the phone show here and vice versa; only the chrome differs (centered
   .pw-modal-* dialogs instead of full screens / bottom sheets).
   =========================================================================== */
function pwQuery(k) { try { return new URLSearchParams(window.location.search).get(k); } catch (e) { return null; } }

/* ---- banners store ---- */
const PW_SOCIAL_CONN_KEY = "pf-social-connections";   /* { key: handle/text } */
const PW_BANNERS_KEY = "pf-profile-banners";           /* [key, ...] in display order */
function pwLoadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
}
function pwSaveJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
function pwLoadSocialConnections() { const v = pwLoadJSON(PW_SOCIAL_CONN_KEY, {}); return v && typeof v === "object" ? v : {}; }
function pwLoadBanners() {
  const conn = pwLoadSocialConnections();
  const b = pwLoadJSON(PW_BANNERS_KEY, []);
  return Array.isArray(b) ? b.filter((k) => { const it = pwBannerItem(k); return it && (!it.needsValue || conn[k]); }) : [];
}
function pwSaveBanners(list) { pwSaveJSON(PW_BANNERS_KEY, list); try { window.dispatchEvent(new CustomEvent("pf-banners-changed")); } catch (e) {} }
function pwSocialUrl(key, handle) {
  const h = String(handle || "").replace(/^@/, "").replace(/\s+/g, "");
  switch (key) {
    case "instagram": return "https://instagram.com/" + h;
    case "twitter": return "https://x.com/" + h;
    case "facebook": return "https://facebook.com/" + h;
    case "linkedin": return "https://linkedin.com/in/" + h;
    case "threads": return "https://threads.net/@" + h;
    case "youtube": return "https://youtube.com/@" + h;
    case "whatsapp": return "https://wa.me/" + h.replace(/[^0-9]/g, "");
    default: return "#";
  }
}
/* Everything the Banners screen can put under the bio (mirrors PM_BANNER_ITEMS). */
const PW_BANNER_ITEMS = [
  { key: "threads", icon: "simple-icons:threads", color: "#000000", label: "Threads", needsValue: true, prompt: "Threads username", placeholder: "username", value: (h) => String(h || "").replace(/^@/, "") },
  { key: "instagram", icon: "mdi:instagram", color: "#E1306C", label: "Instagram", needsValue: true, prompt: "Instagram username", placeholder: "username", value: (h) => String(h || "").replace(/^@/, "") },
  { key: "youtube", icon: "lucide:youtube", color: "#FF0000", label: "YouTube", needsValue: true, editable: true, prompt: "YouTube channel", placeholder: "Channel name" },
  { key: "facebook", icon: "mdi:facebook", color: "#1877F2", label: "Facebook", needsValue: true, prompt: "Facebook profile", placeholder: "Your name on Facebook" },
  { key: "linkedin", icon: "mdi:linkedin", color: "#0A66C2", label: "LinkedIn", needsValue: true, prompt: "LinkedIn profile", placeholder: "Your name on LinkedIn" },
  { key: "twitter", icon: "simple-icons:x", color: "#000000", label: "X", needsValue: true, prompt: "X username", placeholder: "username", value: (h) => String(h || "").replace(/^@/, "") },
  { key: "whatsapp", icon: "mdi:whatsapp", color: "#25D366", label: "WhatsApp", needsValue: true, editable: true, prompt: "WhatsApp number", placeholder: "+44 7700 900000", inputMode: "tel" },
  { key: "custom", icon: "lucide:user", color: "var(--brand-navy)", label: "Fill in the blank", needsValue: true, editable: true, prompt: "Fill in the blank", placeholder: "Say something about you", maxLength: 40 },
  { key: "insights", icon: "lucide:bar-chart-3", color: "var(--brand-navy)", label: "Insights", needsValue: false }
];
function pwBannerItem(key) { return PW_BANNER_ITEMS.find((it) => it.key === key); }
function pwBannerText(key, conn) {
  const it = pwBannerItem(key); if (!it) return "";
  const raw = conn[key];
  if (!it.needsValue) return it.label;
  return it.value ? it.value(raw) : String(raw || "");
}

/* ---- Connect an account (Accounts Center–style, mirrors PM_CONNECT_NETWORKS) ----
   Adding a social banner opens the real network in a new tab; when the user
   comes back to this tab the account is confirmed and saved as a connection
   + banner. */
function pwDefaultSocialHandle(key) {
  const name = PW_ME.name || "";
  const handle = "@" + name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (key === "facebook" || key === "linkedin") ? name : handle;
}
const PW_CONNECT_NETWORKS = {
  instagram: { app: "https://www.instagram.com/", brand: "Instagram", login: "sign in to Instagram", what: "username", privacy: "Your Instagram messages and password stay private. Profinity only sees the username you choose to show.", def: () => pwDefaultSocialHandle("instagram") },
  threads:   { app: "https://www.threads.net/", brand: "Threads", login: "sign in to Threads", what: "username", privacy: "Your Threads messages and password stay private. Profinity only sees the username you choose to show.", def: () => pwDefaultSocialHandle("threads") },
  facebook:  { app: "https://www.facebook.com/", brand: "Facebook", login: "sign in to Facebook", what: "profile name", privacy: "Your Facebook messages, friends and password stay private. Profinity only sees your public profile name.", def: () => pwDefaultSocialHandle("facebook") },
  whatsapp:  { app: "https://wa.me/", brand: "WhatsApp", login: "open WhatsApp", what: "number", privacy: "Your personal messages and calls on WhatsApp stay end-to-end encrypted. No one, not even Profinity, can read or listen to them.", contact: "Your WhatsApp number is never public without your permission and your contacts aren't shared with Profinity.", alert: "People who tap on your banner can message you. Your number won't show on Profinity until you confirm it in WhatsApp. Go to WhatsApp to add your banner.", def: () => (PW_ME.clinicNumber || "").trim() || "+44 7700 900000" },
  linkedin:  { app: "https://www.linkedin.com/", brand: "LinkedIn", login: "sign in to LinkedIn", what: "profile name", privacy: "Your LinkedIn messages and connections stay private. Profinity only sees your public profile name.", def: () => pwDefaultSocialHandle("linkedin") },
  twitter:   { app: "https://x.com/", brand: "X", login: "sign in to X", what: "username", privacy: "Your X messages and password stay private. Profinity only sees the username you choose to show.", def: () => pwDefaultSocialHandle("twitter") },
  youtube:   { app: "https://www.youtube.com/", brand: "YouTube", login: "sign in to YouTube", what: "channel", privacy: "Your YouTube account and watch history stay private. Profinity only sees your public channel name.", def: () => PW_ME.name || "" }
};
function pwConnectNetwork(key) { return PW_CONNECT_NETWORKS[key] || null; }
function pwConnectedSocialKeys(conn, except) {
  return Object.keys(PW_CONNECT_NETWORKS).filter((k) => k !== except && conn[k]);
}
function usePWReturnFromApp(active, onReturn) {
  useEffectPW(() => {
    if (!active) return;
    let left = false; const startedAt = Date.now();
    const away = () => { left = true; };
    const back = () => { if ((left || Date.now() - startedAt > 1500) && !document.hidden) onReturn(); };
    const vis = () => { if (document.hidden) away(); else back(); };
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("blur", away); window.addEventListener("focus", back); window.addEventListener("pageshow", back);
    return () => { document.removeEventListener("visibilitychange", vis); window.removeEventListener("blur", away); window.removeEventListener("focus", back); window.removeEventListener("pageshow", back); };
  }, [active]);
}

function PWConnectAccountModal({ item, conn, onDone, onClose }) {
  const initialStep = (() => { try { return new URLSearchParams(window.location.search).get("step") === "confirm" ? "confirm" : "prompt"; } catch (e) { return "prompt"; } })();
  /* prompt  → iOS-style alert "Add Instagram to profile · Go to Instagram"
     waiting → the alert stays while the network's app is open
     confirm → Accounts Center-style screen; Confirm saves the connection */
  const net = pwConnectNetwork(item.key);
  const [step, setStep] = useStatePW(initialStep);
  const [handle, setHandle] = useStatePW(() => conn[item.key] || (net ? net.def() : ""));
  const [editing, setEditing] = useStatePW(false);
  const inputRef = React.useRef(null);
  usePWReturnFromApp(step === "waiting", () => setStep("confirm"));
  useEffectPW(() => { if (editing) { const t = setTimeout(() => { try { inputRef.current && inputRef.current.focus(); } catch (e) {} }, 60); return () => clearTimeout(t); } }, [editing]);
  if (!net) return null;
  const others = pwConnectedSocialKeys(conn, item.key);
  const isAt = !!item.value;
  const clean = (isAt ? handle.replace(/^@+/, "") : handle).trim();
  const shown = clean ? (isAt ? "@" + clean : clean) : "";
  const an = /^[aeiou]/i.test(net.brand) ? "an" : "a";

  function Av({ badgeKey, className }) {
    const bi = badgeKey ? pwBannerItem(badgeKey) : null;
    return (
      <span className={"pw-cac-av" + (className ? " " + className : "")}>
        <AvatarPW name={PW_ME.name} src={PW_ME.avatar} size={56} />
        <span className="pw-cac-badge">{bi ? <IconifyIconPW name={bi.icon} size={15} color={bi.color} /> : <b>P</b>}</span>
      </span>
    );
  }

  if (step !== "confirm") {
    const waiting = step === "waiting";
    return (
      <div className="pw-modal-overlay pw-cac-alert-overlay" onClick={onClose}>
        <div className="pw-modal-card pw-cac-alert" role="alertdialog" aria-modal="true" onClick={e => e.stopPropagation()}>
          <h3>Add {net.brand} to profile</h3>
          <p>{waiting
            ? <>Waiting for you to {net.login}… Once you've confirmed it's you, come back here to finish adding your banner.</>
            : (net.alert || <>People who see your banner can find you on {net.brand}. We'll open {net.brand} so you can confirm it's your account, then come back here to add your banner.</>)}</p>
          {waiting
            ? <button type="button" className="pw-cac-alert-go" onClick={() => setStep("confirm")}>I've signed in to {net.brand}</button>
            : <a className="pw-cac-alert-go" href={net.app} target="_blank" rel="noopener noreferrer" onClick={() => setStep("waiting")}>Go to {net.brand}</a>}
          <button type="button" className="pw-cac-alert-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pw-modal-overlay pw-cac-overlay" onClick={onClose}>
    <div className="pw-modal-card pw-cac" role="dialog" aria-modal="true" aria-label={"Connect " + net.brand} onClick={e => e.stopPropagation()}>
      <button type="button" className="pw-cac-close" aria-label="Close" onClick={onClose}>
        <IconifyIconPW name="lucide:x" size={22} color="var(--text-heading)" />
      </button>
      <div className="pw-cac-body">
        <p className="pw-cac-eyebrow">Add {net.brand} to Connected accounts</p>
        <h2 className="pw-cac-title">Add {an} {net.brand} banner to this profile</h2>

        <div className="pw-cac-card">
          <h3>Connected accounts</h3>
          <div className="pw-cac-row">
            <Av badgeKey={item.key} className="new" />
            <span className="pw-cac-dots" aria-hidden="true">{[0,1,2,3,4,5].map(i => <i key={i} />)}</span>
            <span className="pw-cac-stack">
              <Av className="me" />
              {others.map(k => <Av key={k} badgeKey={k} />)}
            </span>
          </div>
          <div className="pw-cac-acct">
            {editing ? (
              <span className="pw-cac-input">
                {isAt && <i aria-hidden="true">@</i>}
                <input ref={inputRef} type="text" value={isAt ? handle.replace(/^@+/, "") : handle} placeholder={item.placeholder || ""}
                  inputMode={item.inputMode || "text"} autoCapitalize={isAt ? "none" : "words"} autoCorrect="off" spellCheck={false}
                  onChange={e => setHandle(isAt ? e.target.value.replace(/^@+/, "") : e.target.value)}
                  onBlur={() => { if (clean) setEditing(false); }} />
              </span>
            ) : (
              <>
                <span className="pw-cac-acct-nm"><IconifyIconPW name="lucide:check" size={14} color="#25a244" />{shown || ("Add your " + net.what)}</span>
                <button type="button" className="pw-cac-acct-edit" onClick={() => setEditing(true)}>{shown ? "Not you?" : "Add"}</button>
              </>
            )}
          </div>
        </div>

        <ul className="pw-cac-points">
          <li>
            <IconifyIconPW name="lucide:circle-user-round" size={28} color="var(--text-heading)" />
            <span>Connected accounts show as banners under your bio, so people can find you on {net.brand} straight from your profile.</span>
          </li>
          <li>
            <IconifyIconPW name={item.key === "whatsapp" ? "lucide:phone" : "lucide:at-sign"} size={28} color="var(--text-heading)" />
            <span>{net.contact || ("Only the " + net.what + " you confirmed on " + net.brand + " is shown. Your " + net.brand + " password is never shared with Profinity.")}</span>
          </li>
          <li>
            <IconifyIconPW name="lucide:lock" size={28} color="var(--text-heading)" />
            <span>{net.privacy}</span>
          </li>
        </ul>
      </div>
      <div className="pw-cac-foot">
        <p className="pw-cac-fine">We'll <b>show your {net.brand} {net.what}</b> as a banner under your bio. You can remove it from Banners anytime.</p>
        <button type="button" className="pw-cac-confirm" disabled={!clean} onClick={() => onDone(clean)}>Confirm</button>
        <button type="button" className="pw-cac-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
    </div>
  );
}

/* ---- share helpers ---- */
function pwProfileLink(user) {
  try {
    const u = new URL(window.location.href);
    const q = new URLSearchParams();
    if (user && user.id) q.set("id", user.id);
    else if (user && user.name && window.PFProfileLink && !window.PFProfileLink.isMe(user.name)) {
      q.set("id", window.PFProfileLink.slug(user.name)); q.set("name", user.name);
      if (user.avatar) q.set("avatar", user.avatar);
      if (user.role) q.set("role", user.role);
    }
    const qs = q.toString();
    return u.origin + u.pathname + (qs ? "?" + qs : "");
  } catch (e) { return window.location.href; }
}
function pwHandleFor(user) {
  const ig = user && user.instagram && String(user.instagram).trim();
  if (ig) return ig.startsWith("@") ? ig : "@" + ig;
  return "@" + String((user && user.name) || "profile").toLowerCase().replace(/[^a-z0-9]/g, "");
}
function pwCopyText(text, done) {
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
}
function usePWToast() {
  const [toast, setToast] = useStatePW("");
  useEffectPW(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);
  return [toast, setToast];
}

/* IG-style QR: dot modules, rounded finder corners, PROfinity P mark in the
   centre (error correction H so the covered modules recover). */
const PW_QR_LOGO = "assets/profinity-icon-purple-gold.png";
function pwBuildQrSvg(text, logoHref) {
  if (typeof window.qrcode !== "function") return "";
  let qr;
  try { qr = window.qrcode(0, "H"); qr.addData(text); qr.make(); } catch (e) { return ""; }
  const n = qr.getModuleCount(), cell = 10, size = n * cell;
  const logoCells = Math.max(7, Math.round(n * 0.26));
  const l0 = Math.floor((n - logoCells) / 2), l1 = l0 + logoCells;
  const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const inLogo = (r, c) => r >= l0 && r < l1 && c >= l0 && c < l1;
  const dots = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!qr.isDark(r, c) || inFinder(r, c) || inLogo(r, c)) continue;
    dots.push(`<circle cx="${(c + .5) * cell}" cy="${(r + .5) * cell}" r="${cell * .45}"/>`);
  }
  const finder = (x, y) => {
    const o = cell * 0.5;
    return `<rect x="${x * cell + o}" y="${y * cell + o}" width="${6 * cell}" height="${6 * cell}" rx="${cell * 1.9}" fill="none" stroke="#111" stroke-width="${cell}"/>` +
      `<rect x="${(x + 2) * cell}" y="${(y + 2) * cell}" width="${3 * cell}" height="${3 * cell}" rx="${cell * .9}" fill="#111"/>`;
  };
  const lp = (l1 - l0) * cell, lx = l0 * cell, pad = cell * .6;
  const logo = `<rect x="${lx}" y="${lx}" width="${lp}" height="${lp}" rx="${cell * 1.6}" fill="#fff"/>` +
    `<image href="${logoHref}" x="${lx + pad}" y="${lx + pad}" width="${lp - pad * 2}" height="${lp - pad * 2}" preserveAspectRatio="xMidYMid meet"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="geometricPrecision"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#111">${dots.join("")}</g>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}${logo}</svg>`;
}

/* ---- Profile picture viewer (click the cover avatar) ----
   Blurred page underneath, big round photo, round action buttons. Own
   profile: Share / Copy link / QR code / Edit avatar (+ pencil badge);
   someone else's: Follow / Share / Copy link / QR code. */
function PWAvatarViewer({ user, own, following, onToggleFollow, onChangeAvatar, onQr, onShare, onClose }) {
  const [toast, setToast] = usePWToast();
  const fileRef = React.useRef(null);
  const link = pwProfileLink(own ? null : user);
  usePWEscClose(true, onClose);
  function copyLink() { pwCopyText(link, () => setToast("Link copied")); }
  function share() {
    if (onShare) { onShare(); return; }
    if (navigator.share) { navigator.share({ title: user.name, url: link }).catch(() => {}); return; }
    copyLink();
  }
  function pick(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try { onChangeAvatar && onChangeAvatar(URL.createObjectURL(f)); } catch (err) {}
    e.target.value = "";
  }
  const openPicker = () => fileRef.current && fileRef.current.click();
  const actions = own ? [
    { key: "share", label: "Share", icon: "lucide:circle-user-round", onClick: share },
    { key: "copy", label: "Copy link", icon: "lucide:link", onClick: copyLink },
    { key: "qr", label: "QR code", icon: "lucide:qr-code", onClick: () => onQr && onQr() },
    { key: "edit", label: "Edit avatar", icon: "lucide:smile", onClick: openPicker }] : [
    { key: "follow", label: following ? "Following" : "Follow", icon: following ? "lucide:user-round-check" : "lucide:user-round-plus", onClick: onToggleFollow, active: following },
    { key: "share", label: "Share", icon: "lucide:circle-user-round", onClick: share },
    { key: "copy", label: "Copy link", icon: "lucide:link", onClick: copyLink },
    { key: "qr", label: "QR code", icon: "lucide:qr-code", onClick: () => onQr && onQr() }];
  return (
    <div className="pw-avv" role="dialog" aria-modal="true" aria-label={user.name + " profile picture"} onClick={onClose}>
      <button type="button" className="pw-avv-x" aria-label="Close" onClick={onClose}>
        <IconifyIconPW name="lucide:x" size={24} color="var(--text-heading)" />
      </button>
      <div className="pw-avv-stage" onClick={(e) => e.stopPropagation()}>
        <div className="pw-avv-photo">
          <AvatarPW name={user.name} src={user.avatar} size={320} className="pw-avv-img" />
          {own &&
          <button type="button" className="pw-avv-pencil" aria-label="Change profile picture" onClick={openPicker}>
            <IconifyIconPW name="lucide:pencil" size={22} color="var(--text-heading)" />
          </button>}
        </div>
        <div className="pw-avv-name">{user.name}</div>
        <div className="pw-avv-actions">
          {actions.map((a) =>
          <button key={a.key} type="button" className={"pw-avv-act" + (a.active ? " on" : "")} onClick={a.onClick}>
            <span className="pw-avv-act-ic"><IconifyIconPW name={a.icon} size={28} color="var(--text-heading)" /></span>
            <span className="pw-avv-act-lb">{a.label}</span>
          </button>)}
        </div>
      </div>
      {own && <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />}
      {toast && <div className="pw-avv-toast" role="status">{toast}</div>}
    </div>);
}

/* ---- Profile QR share card (Share Profile / QR code action) ---- */
function PWQrShareModal({ user, link, onClose, onShare }) {
  const [toast, setToast] = usePWToast();
  const svg = React.useMemo(() => pwBuildQrSvg(link, PW_QR_LOGO), [link]);
  const handle = pwHandleFor(user);
  usePWEscClose(true, onClose);
  function copyLink() { pwCopyText(link, () => setToast("Link copied")); }
  function share() {
    if (onShare) { onShare(); return; }
    if (navigator.share) { navigator.share({ title: user.name, url: link }).catch(() => {}); return; }
    copyLink();
  }
  async function download() {
    if (!svg) { setToast("QR not ready"); return; }
    try {
      const blob = await fetch(PW_QR_LOGO).then((r) => r.blob());
      const dataUrl = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(blob); });
      const inlined = svg.replace(PW_QR_LOGO, dataUrl);
      const img = new Image();
      const url = URL.createObjectURL(new Blob([inlined], { type: "image/svg+xml" }));
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
      const S = 1080, cv = document.createElement("canvas"); cv.width = S; cv.height = S + 160;
      const ctx = cv.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 90, 60, S - 180, S - 180);
      ctx.fillStyle = "#111"; ctx.font = "600 64px Poppins, system-ui, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(handle.toUpperCase(), S / 2, S + 60);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = handle.replace(/^@/, "") + "-profinity-qr.png";
      a.href = cv.toDataURL("image/png"); a.click();
      setToast("Saved");
    } catch (e) {
      const a = document.createElement("a");
      a.download = handle.replace(/^@/, "") + "-profinity-qr.svg";
      a.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); a.click();
    }
  }
  return (
    <div className="pw-modal-overlay" onClick={onClose}>
      <div className="pw-modal-card pw-qrs" role="dialog" aria-modal="true" aria-label="Profile QR code" onClick={(e) => e.stopPropagation()}>
        <header className="pw-qrs-hd">
          <h3>Share Profile</h3>
          <button type="button" className="pw-help-x" aria-label="Close" onClick={onClose}>
            <IconifyIconPW name="lucide:x" size={22} color="var(--gray-500)" />
          </button>
        </header>
        <div className="pw-qrs-mid">
          <div className="pw-qrs-card">
            {svg ? <div className="pw-qrs-code" dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="pw-qrs-code pw-qrs-code-fallback">{link}</div>}
            <div className="pw-qrs-handle">{handle}</div>
          </div>
          <div className="pw-qrs-tiles">
            <button type="button" className="pw-qrs-tile" onClick={share}>
              <IconifyIconPW name="lucide:share" size={26} color="var(--text-heading)" /><span>Share profile</span>
            </button>
            <button type="button" className="pw-qrs-tile" onClick={copyLink}>
              <IconifyIconPW name="lucide:link" size={26} color="var(--text-heading)" /><span>Copy link</span>
            </button>
            <button type="button" className="pw-qrs-tile" onClick={download}>
              <IconifyIconPW name="lucide:download" size={26} color="var(--text-heading)" /><span>Download</span>
            </button>
          </div>
        </div>
        {toast && <div className="pw-avv-toast pw-qrs-toast" role="status">{toast}</div>}
      </div>
    </div>);
}

/* ---- Share profile dialog ----
   Preview card, "Share to Newsfeed" composer (drops a sharedProfile link-card
   post into the shared pf-newsfeed-user-posts list app.jsx reads on both
   surfaces), then the outside destinations. */
const PW_SHARE_TARGETS = [
  { k: "messages", label: "Messages", icon: "lucide:message-circle", color: "var(--brand-navy)", bg: "var(--surface-sunken)" },
  { k: "copy", label: "Copy link", icon: "lucide:link", color: "var(--brand-navy)", bg: "var(--surface-sunken)" },
  { k: "whatsapp", label: "WhatsApp", icon: "mdi:whatsapp", color: "#fff", bg: "#25D366" },
  { k: "facebook", label: "Facebook", icon: "mdi:facebook", color: "#fff", bg: "#1877F2" },
  { k: "twitter", label: "X", icon: "mdi:twitter", color: "#fff", bg: "#111" },
  { k: "linkedin", label: "LinkedIn", icon: "mdi:linkedin", color: "#fff", bg: "#0A66C2" },
  { k: "email", label: "Email", icon: "lucide:mail", color: "var(--brand-navy)", bg: "var(--surface-sunken)" },
  { k: "qr", label: "QR code", icon: "lucide:qr-code", color: "var(--brand-navy)", bg: "var(--surface-sunken)" },
  { k: "more", label: "More", icon: "lucide:ellipsis", color: "var(--brand-navy)", bg: "var(--surface-sunken)" }
];
function PWShareProfileModal({ user, own, link, onClose, onQr }) {
  const [caption, setCaption] = useStatePW(() => own ?
    "Find me on PROfinity — follow along for aesthetics tips, lives and course notes." :
    "Check out " + user.name + " on PROfinity.");
  const [toast, setToast] = usePWToast();
  const [posted, setPosted] = useStatePW(false);
  const handle = pwHandleFor(user);
  const shareText = (own ? "Follow " + PW_ME.name : user.name) + " on PROfinity " + handle;
  usePWEscClose(true, onClose);
  function copyLink() { pwCopyText(link, () => setToast("Link copied")); }
  function openOut(url) { try { window.open(url, "_blank", "noopener"); } catch (e) { window.location.href = url; } }
  function go(k) {
    const u = encodeURIComponent(link), t = encodeURIComponent(shareText);
    switch (k) {
      case "messages": goPW("Messages.html?share=" + u); return;
      case "copy": copyLink(); return;
      case "whatsapp": openOut("https://wa.me/?text=" + t + "%20" + u); return;
      case "facebook": openOut("https://www.facebook.com/sharer/sharer.php?u=" + u); return;
      case "twitter": openOut("https://twitter.com/intent/tweet?text=" + t + "&url=" + u); return;
      case "linkedin": openOut("https://www.linkedin.com/sharing/share-offsite/?url=" + u); return;
      case "email": window.location.href = "mailto:?subject=" + t + "&body=" + t + "%0A" + u; return;
      case "qr": onQr && onQr(); return;
      case "more":
        if (navigator.share) navigator.share({ title: user.name, text: shareText, url: link }).catch(() => {});
        else copyLink();
        return;
      default: return;
    }
  }
  function postToFeed() {
    if (posted) return;
    const body = caption.trim();
    const post = {
      id: "u" + Date.now(),
      author: { name: PW_ME.name, avatar: PW_ME.avatar, seals: ["gb", "verified"] },
      time: "Just now", hashtags: [], media: [], body, bg: null, video: null, live: false,
      sharedProfile: { name: user.name, role: user.role || "", avatar: user.avatar || "", handle, link },
      likes: "0", comments: "0", shares: "0", commentList: []
    };
    try {
      const existing = JSON.parse(localStorage.getItem("pf-newsfeed-user-posts")) || [];
      localStorage.setItem("pf-newsfeed-user-posts", JSON.stringify([post, ...existing]));
      sessionStorage.setItem("pf-post-reward", JSON.stringify({ amount: 75, label: "Shared a profile", actionId: "evt_create_post", ts: Date.now() }));
    } catch (e) {}
    setPosted(true);
    setToast("Shared to your Newsfeed");
    setTimeout(() => goPW("NewsfeedWeb.html"), 700);
  }
  return (
    <div className="pw-modal-overlay" onClick={onClose}>
      <div className="pw-modal-card pw-shp" role="dialog" aria-modal="true" aria-label="Share profile" onClick={(e) => e.stopPropagation()}>
        <header className="pw-shp-hd">
          <h3>Share profile</h3>
          <button type="button" className="pw-help-x" aria-label="Close" onClick={onClose}>
            <IconifyIconPW name="lucide:x" size={22} color="var(--gray-500)" />
          </button>
        </header>
        <div className="pw-shp-body">
          <div className="pw-shp-card">
            <AvatarPW name={user.name} src={user.avatar} size={52} />
            <div className="pw-shp-card-tx">
              <span className="nm">{user.name}</span>
              <span className="rl">{user.role || "PROfinity member"}</span>
              <span className="hd">{handle}</span>
            </div>
            <span className="pw-shp-card-badge"><img src="assets/profinity-icon-purple-gold.png" alt="" /></span>
          </div>
          <section className="pw-shp-feed">
            <div className="pw-shp-feed-hd">
              <span className="pw-shp-feed-ic"><IconifyIconPW name="lucide:rss" size={17} color="#fff" /></span>
              <div>
                <b>Share to Newsfeed</b>
                <i>Posts a link card to everyone who follows you</i>
              </div>
            </div>
            <textarea className="pw-shp-caption" rows={2} value={caption} placeholder="Say something about this profile…"
              onChange={(e) => setCaption(e.target.value)} />
            <button type="button" className={"pw-shp-post" + (posted ? " done" : "")} onClick={postToFeed} disabled={posted}>
              <IconifyIconPW name={posted ? "lucide:check" : "lucide:send"} size={17} color="#fff" />
              {posted ? "Shared" : "Post to Newsfeed"}
            </button>
          </section>
          <div className="pw-shp-sec-lb">Share to</div>
          <div className="pw-shp-grid">
            {PW_SHARE_TARGETS.map((t) =>
            <button key={t.k} type="button" className="pw-shp-tile" onClick={() => go(t.k)}>
              <span className="pw-shp-tile-ic" style={{ background: t.bg }}>
                <IconifyIconPW name={t.icon} size={24} color={t.color} />
              </span>
              <span className="pw-shp-tile-lb">{t.label}</span>
            </button>)}
          </div>
        </div>
        {toast && <div className="pw-avv-toast pw-shp-toast" role="status">{toast}</div>}
      </div>
    </div>);
}

/* ---- Edit profile (Instagram-style settings form) ---- */
function usePWAutoGrow(ref, value) {
  useEffectPW(() => {
    const el = ref.current; if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.max(22, el.scrollHeight) + "px";
  }, [value]);
}
function PWEditRow({ label, value, onChange, options, placeholder, multiline, inputMode, className }) {
  const taRef = React.useRef(null);
  usePWAutoGrow(taRef, multiline ? value : null);
  const cls = "pw-edit-row" + (options ? " pick" : "") + (multiline ? " multi" : "") + (className ? " " + className : "");
  return (
    <div className={cls}>
      <span className="pw-edit-row-label">{label}</span>
      <div className="pw-edit-row-val">
        {options ?
        <>
          <span className="pw-edit-row-text">{value}</span>
          <IconifyIconPW name="lucide:chevron-down" size={18} color="var(--gray-450)" />
          <select className="pw-edit-row-select" aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </> :
        multiline ?
        <textarea ref={taRef} rows={1} className="pw-edit-row-input" value={value} placeholder={placeholder || label} onChange={(e) => onChange(e.target.value)} /> :
        <input type="text" inputMode={inputMode} className="pw-edit-row-input" value={value} placeholder={placeholder || label} onChange={(e) => onChange(e.target.value)} />}
      </div>
    </div>);
}

function PWBannerValueSheet({ item, initial, onSave, onClose }) {
  const [val, setVal] = useStatePW(initial || "");
  const inputRef = React.useRef(null);
  useEffectPW(() => { const t = setTimeout(() => { try { inputRef.current && inputRef.current.focus(); } catch (e) {} }, 80); return () => clearTimeout(t); }, []);
  const clean = val.trim();
  function submit(e) { e && e.preventDefault(); if (!clean) return; onSave(clean); }
  return (
    <div className="pw-modal-overlay pw-bnv-overlay" onClick={onClose}>
      <form className="pw-modal-card pw-bnv" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="pw-bnv-hd">
          <span className="pw-bnv-ic"><IconifyIconPW name={item.icon} size={24} color="var(--text-heading)" /></span>
          <h3>{item.prompt || item.label}</h3>
        </div>
        <div className="pw-bnv-field">
          <input ref={inputRef} type="text" value={val} placeholder={item.placeholder || ""} maxLength={item.maxLength || 80}
            inputMode={item.inputMode || "text"} autoCapitalize={item.key === "custom" ? "sentences" : "none"} autoCorrect="off" spellCheck={false}
            onChange={(e) => setVal(e.target.value)} />
          {val && <button type="button" className="pw-bnv-clear" aria-label="Clear" onClick={() => setVal("")}><IconifyIconPW name="lucide:x" size={13} color="#fff" /></button>}
        </div>
        {item.key === "custom" && <p className="pw-bnv-hint">A short line that shows as a banner under your bio.</p>}
        <div className="pw-bnv-acts">
          <button type="button" className="pw-bnv-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="pw-bnv-save" disabled={!clean}>{initial ? "Save" : "Add"}</button>
        </div>
      </form>
    </div>);
}

/* "On your profile" (drag to reorder, pencil on items with their own text,
   × to remove) and "Add to profile" — inside the Edit profile dialog. */
function PWBannersPanel({ onBack }) {
  const [banners, setBanners] = useStatePW(() => pwLoadBanners());
  const [conn, setConn] = useStatePW(() => pwLoadSocialConnections());
  const [dragKey, setDragKey] = useStatePW(null);
  const [sheet, setSheet] = useStatePW(null); /* { key, mode: "add" | "edit" } */
  const dragRef = React.useRef(null);
  function commit(next) { setBanners(next); pwSaveBanners(next); }
  function remove(key) { commit(banners.filter((k) => k !== key)); }
  function saveValue(key, value) {
    const next = { ...pwLoadSocialConnections(), [key]: value };
    pwSaveJSON(PW_SOCIAL_CONN_KEY, next); setConn(next);
  }
  /* ?connect=instagram(&step=confirm) opens the connect flow straight away — demo / QA entry. */
  const [connect, setConnect] = useStatePW(() => {
    try { const k = new URLSearchParams(window.location.search).get("connect"); return k && pwConnectNetwork(k) ? k : null; } catch (e) { return null; }
  }); /* banner key being connected via its network */
  function add(key) {
    const it = pwBannerItem(key); if (!it || banners.includes(key)) return;
    if (pwConnectNetwork(key)) { setConnect(key); return; }
    if (it.needsValue && !conn[key]) { setSheet({ key, mode: "add" }); return; }
    commit([...banners, key]);
  }
  function onSheetSave(value) {
    if (!sheet) return;
    saveValue(sheet.key, value);
    if (sheet.mode === "add" && !banners.includes(sheet.key)) commit([...banners, sheet.key]);
    else try { window.dispatchEvent(new CustomEvent("pf-banners-changed")); } catch (e) {}
    setSheet(null);
  }
  function onConnected(value) {
    if (!connect) return;
    saveValue(connect, value);
    if (!banners.includes(connect)) commit([...banners, connect]);
    else try { window.dispatchEvent(new CustomEvent("pf-banners-changed")); } catch (e) {}
    setConnect(null);
  }
  function onHandleDown(e, key) {
    const row = e.currentTarget.closest(".pw-bn-row");
    if (!row) return;
    e.preventDefault();
    const rowH = row.getBoundingClientRect().height || 56;
    dragRef.current = { key, startY: e.clientY, rowH, list: banners.slice() };
    setDragKey(key);
    const move = (ev) => {
      const d = dragRef.current; if (!d) return;
      const from = d.list.indexOf(d.key);
      const delta = Math.round((ev.clientY - d.startY) / d.rowH);
      const to = Math.max(0, Math.min(d.list.length - 1, from + delta));
      if (to !== from) {
        const next = d.list.slice(); next.splice(from, 1); next.splice(to, 0, d.key);
        d.list = next; d.startY += (to - from) * d.rowH;
        setBanners(next);
      }
    };
    const up = () => {
      const d = dragRef.current; dragRef.current = null; setDragKey(null);
      if (d) pwSaveBanners(d.list);
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  }
  const addable = PW_BANNER_ITEMS.filter((it) => !banners.includes(it.key));
  const sheetItem = sheet ? pwBannerItem(sheet.key) : null;
  return (
    <>
      <header className="pw-edit-hd">
        <button type="button" className="pw-edit-back" aria-label="Back" onClick={onBack}>
          <IconifyIconPW name="lucide:chevron-left" size={22} color="var(--text-heading)" />
        </button>
        <h2>Banners</h2>
        <span aria-hidden="true" />
      </header>
      <div className="pw-edit-body pw-bn-body">
        <section className="pw-bn-sec">
          <h4 className="pw-bn-title">On your profile</h4>
          {banners.length === 0 && <p className="pw-bn-empty">Nothing on your profile yet. Add something below and it shows up under your bio.</p>}
          <div className="pw-bn-list">
            {banners.map((key) => {
              const it = pwBannerItem(key); if (!it) return null;
              return (
                <div key={key} className={"pw-bn-row" + (dragKey === key ? " dragging" : "")}>
                  <button type="button" className="pw-bn-handle" aria-label={"Reorder " + it.label} onPointerDown={(e) => onHandleDown(e, key)}>
                    <IconifyIconPW name="lucide:menu" size={22} color="var(--gray-500)" />
                  </button>
                  <span className="pw-bn-ic"><IconifyIconPW name={it.icon} size={24} color={it.color} /></span>
                  <span className="pw-bn-nm">{pwBannerText(key, conn)}</span>
                  <span className="pw-bn-sub">{it.label}</span>
                  {it.editable &&
                  <button type="button" className="pw-bn-x" aria-label={"Edit " + it.label} onClick={() => setSheet({ key, mode: "edit" })}>
                    <IconifyIconPW name="lucide:pencil" size={19} color="var(--gray-600)" />
                  </button>}
                  <button type="button" className="pw-bn-x" aria-label={"Remove " + it.label} onClick={() => remove(key)}>
                    <IconifyIconPW name="lucide:x" size={21} color="var(--gray-600)" />
                  </button>
                </div>);
            })}
          </div>
        </section>
        <section className="pw-bn-sec">
          <h4 className="pw-bn-title">Add to profile</h4>
          {addable.length === 0 && <p className="pw-bn-empty">Everything is already on your profile.</p>}
          <div className="pw-bn-list">
            {addable.map((it) =>
            <button key={it.key} type="button" className="pw-bn-row add" onClick={() => add(it.key)}>
              <span className="pw-bn-handle"><IconifyIconPW name="lucide:circle-plus" size={22} color="var(--gray-500)" /></span>
              <span className="pw-bn-ic"><IconifyIconPW name={it.icon} size={24} color={it.color} /></span>
              <span className="pw-bn-nm">{it.label}</span>
            </button>)}
          </div>
        </section>
      </div>
      {sheetItem && <PWBannerValueSheet item={sheetItem} initial={conn[sheet.key] || ""} onSave={onSheetSave} onClose={() => setSheet(null)} />}
      {connect && pwBannerItem(connect) && <PWConnectAccountModal item={pwBannerItem(connect)} conn={conn} onDone={onConnected} onClose={() => setConnect(null)} />}
    </>);
}

/* One Personal Goal question: numbered badge (tick once answered), the
   question as a heading, a soft answer box that grows as you type. */
function PWGoalField({ index, question, value, onChange }) {
  const taRef = React.useRef(null);
  usePWAutoGrow(taRef, value);
  const answered = !!(value && value.trim());
  return (
    <div className={"pw-pg-card" + (answered ? " answered" : "")}>
      <div className="pw-pg-top">
        <span className="pw-pg-num" aria-hidden="true">
          {answered ? <IconifyIconPW name="lucide:check" size={14} color="#fff" /> : index + 1}
        </span>
        <label className="pw-pg-q" htmlFor={"pw-goal-" + index}>{question}</label>
      </div>
      <div className="pw-pg-box">
        <textarea id={"pw-goal-" + index} ref={taRef} rows={2} className="pw-pg-input" value={value}
          placeholder="Write your answer…" onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>);
}

function PWEditProfileModal({ profile, onCancel, onSave, openBanners }) {
  const [form, setForm] = useStatePW(() => ({
    title: profile.title || PW_TITLE_OPTIONS[0],
    fullName: profile.name || "",
    bio: profile.bio || "",
    specialty: profile.specialty || "",
    clinic: profile.clinic || "",
    clinicNumber: profile.clinicNumber || "",
    clinicAddress: profile.clinicAddress || "",
    yearsExperience: profile.yearsExperience || ""
  }));
  const [goals, setGoals] = useStatePW(() => profile.personalGoal || PW_PERSONAL_GOAL_QUESTIONS.map(() => ""));
  const [avatar, setAvatar] = useStatePW(profile.avatar || "");
  const [bannersOpen, setBannersOpen] = useStatePW(!!openBanners);
  const [bannerCount, setBannerCount] = useStatePW(() => pwLoadBanners().length);
  const fileRef = React.useRef(null);
  usePWEscClose(true, bannersOpen ? () => { setBannersOpen(false); setBannerCount(pwLoadBanners().length); } : onCancel);
  function setField(key) { return (value) => setForm((f) => ({ ...f, [key]: value })); }
  function setGoalAt(i, value) { setGoals((g) => g.map((v, gi) => gi === i ? value : v)); }
  function pickAvatar(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try { setAvatar(URL.createObjectURL(f)); } catch (err) {}
    e.target.value = "";
  }
  function handleSave() {
    const patch = {
      name: form.fullName, bio: form.bio, title: form.title, specialty: form.specialty,
      clinic: form.clinic, clinicNumber: form.clinicNumber, clinicAddress: form.clinicAddress,
      yearsExperience: form.yearsExperience, personalGoal: goals
    };
    if (avatar && avatar !== profile.avatar) patch.avatar = avatar;
    onSave(patch);
  }
  const answered = goals.filter((g) => g && g.trim()).length;
  return (
    <div className="pw-modal-overlay" onClick={onCancel}>
      <div className="pw-modal-card pw-edit" role="dialog" aria-modal="true" aria-label={bannersOpen ? "Banners" : "Edit profile"} onClick={(e) => e.stopPropagation()}>
        {bannersOpen ?
        <PWBannersPanel onBack={() => { setBannersOpen(false); setBannerCount(pwLoadBanners().length); }} /> :
        <>
          <header className="pw-edit-hd">
            <button type="button" className="pw-edit-back" aria-label="Cancel" onClick={onCancel}>
              <IconifyIconPW name="lucide:x" size={22} color="var(--text-heading)" />
            </button>
            <h2>Edit profile</h2>
            <button type="button" className="pw-edit-done" onClick={handleSave}>Save</button>
          </header>
          <div className="pw-edit-body">
            <div className="pw-edit-avblock">
              <button type="button" className="pw-edit-avbtn" aria-label="Edit profile picture" onClick={() => fileRef.current && fileRef.current.click()}>
                <AvatarPW name={form.fullName || profile.name} src={avatar} size={96} />
              </button>
              <button type="button" className="pw-edit-avlink" onClick={() => fileRef.current && fileRef.current.click()}>Edit picture</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickAvatar} />
            </div>
            <section className="pw-edit-group">
              <h4 className="pw-edit-group-title">Public Profile Information</h4>
              <PWEditRow label="Title" value={form.title} onChange={setField("title")} options={PW_TITLE_OPTIONS} />
              <PWEditRow label="Full Name" value={form.fullName} onChange={setField("fullName")} />
              <PWEditRow label="Tell us about yourself" multiline className="pw-edit-row-bio" value={form.bio} onChange={setField("bio")} placeholder="Tell us about yourself" />
              <PWEditRow label="Primary Specialty" value={form.specialty} onChange={setField("specialty")} />
              <PWEditRow label="Clinic Name" value={form.clinic} onChange={setField("clinic")} />
              <PWEditRow label="Clinic Number" inputMode="tel" value={form.clinicNumber} onChange={setField("clinicNumber")} />
              <PWEditRow label="Clinic Address" multiline value={form.clinicAddress} onChange={setField("clinicAddress")} />
              <PWEditRow label="Years of Experience" inputMode="numeric" value={form.yearsExperience} onChange={setField("yearsExperience")} />
            </section>
            <section className="pw-edit-group">
              <button type="button" className="pw-edit-navrow" onClick={() => setBannersOpen(true)}>
                <span className="pw-edit-navrow-txt">
                  <span className="pw-edit-navrow-lb">Banners</span>
                  <span className="pw-edit-navrow-sub">Show your connected social profiles.</span>
                </span>
                {bannerCount > 0 && <span className="pw-edit-navrow-count">{bannerCount}</span>}
                <IconifyIconPW name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </button>
            </section>
            <section className="pw-edit-group pw-pg-sec">
              <h4 className="pw-edit-group-title">Personal Goal</h4>
              <p className="pw-pg-sub">
                A few reflections so Ava can shape your goals around what matters to you.
                <span className="pw-pg-count">{answered} of {PW_PERSONAL_GOAL_QUESTIONS.length} answered</span>
              </p>
              <div className="pw-pg-list">
                {PW_PERSONAL_GOAL_QUESTIONS.map((q, i) => <PWGoalField key={i} index={i} question={q} value={goals[i]} onChange={(v) => setGoalAt(i, v)} />)}
              </div>
            </section>
          </div>
        </>}
      </div>
    </div>);
}

function ProfileWebApp() {
  useEffectPW(() => pfTagActiveNavPW("Profile"));
  const [assessState, setAssessState] = useStatePW(() => pwLoadAssessState());
  const [hubOpen, setHubOpen] = useStatePW(false);
  const [openAssessKey, setOpenAssessKey] = useStatePW(null);

  /* Own profile: editable copy of PW_ME (same in-memory lifetime as
     ProfileMobile's PMScreen state), the banners store, and the overlays —
     ?edit=1 / ?banners=1 / ?avatar=1 / ?qr=1 / ?share=1 deep-link each one. */
  const [profile, setProfile] = useStatePW(() => ({ ...PW_ME }));
  const [editOpen, setEditOpen] = useStatePW(() => pwQuery("edit") === "1" || pwQuery("banners") === "1");
  const [editBanners, setEditBanners] = useStatePW(() => pwQuery("banners") === "1");
  const [avatarOpen, setAvatarOpen] = useStatePW(() => pwQuery("avatar") === "1");
  const [qrOpen, setQrOpen] = useStatePW(() => pwQuery("qr") === "1");
  const [shareOpen, setShareOpen] = useStatePW(() => pwQuery("share") === "1");
  const [banners, setBanners] = useStatePW(() => pwLoadBanners());
  const [conn, setConn] = useStatePW(() => pwLoadSocialConnections());
  useEffectPW(() => {
    const sync = () => { setBanners(pwLoadBanners()); setConn(pwLoadSocialConnections()); };
    window.addEventListener("pf-banners-changed", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("pf-banners-changed", sync); window.removeEventListener("storage", sync); };
  }, []);
  const ownLink = pwProfileLink(null);
  function saveProfileEdits(patch) { setProfile((prev) => ({ ...prev, ...patch })); setEditOpen(false); setEditBanners(false); }
  const { id: idParam, name: nameParam, avatar: avatarParam, role: roleParam, from: fromParam } = readProfileIdParamPW();
  const otherUser = idParam ? PW_OTHER_USERS[idParam] || (nameParam ? buildMinimalProfilePW(nameParam, avatarParam, roleParam) : null) : null;

  function patchAssessState(key, patch) {
    setAssessState((prev) => {
      const next = { ...prev, [key]: { ...(prev[key] || {}), ...patch } };
      pwSaveAssessState(next);
      return next;
    });
  }
  function handleAssessProgress(answers) {
    const prevStatus = assessState[openAssessKey] && assessState[openAssessKey].status;
    patchAssessState(openAssessKey, { answers, status: prevStatus === "completed" ? "completed" : "in_progress" });
  }
  function handleAssessComplete(answers) {
    if (openAssessKey === "dreamVision") {
      const counts = { A: 0, B: 0, C: 0, D: 0 };
      answers.forEach((a) => { counts[PW_ARCHETYPE_LETTERS[a]]++; });
      const dominant = PW_ARCHETYPE_LETTERS.reduce((best, l) => counts[l] > counts[best] ? l : best, "A");
      patchAssessState(openAssessKey, { answers, status: "completed", archetype: dominant });
    } else {
      const rawPoints = answers.reduce((sum, a) => sum + (a + 1), 0);
      patchAssessState(openAssessKey, { answers, status: "completed", rawPoints });
    }
  }

  if (idParam) {
    return (
      <div className="app wa-screen" data-screen-label={"Profile — " + (otherUser ? otherUser.name : "not found")}>
        <TopNavPW active={pwTabForPage(fromParam)} user={PW_ME} logoSrc="assets/profinity-icon-purple-gold.png"
          onNavigate={navigatePW}
          style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
        {otherUser ? <PWOtherProfileMain user={otherUser} /> : <PWOtherNotFound />}
      </div>);
  }

  return (
    <div className="app wa-screen">
      <TopNavPW active="Profile" user={PW_ME} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigatePW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      <ProfileMain assessState={assessState} onOpenHub={() => setHubOpen(true)}
        profile={profile} banners={banners} conn={conn}
        onEdit={() => { setEditBanners(false); setEditOpen(true); }}
        onShare={() => setShareOpen(true)}
        onAvatar={() => setAvatarOpen(true)}
        onAddBanner={() => { setEditBanners(true); setEditOpen(true); }} />
      {editOpen &&
      <PWEditProfileModal profile={profile} openBanners={editBanners}
        onCancel={() => { setEditOpen(false); setEditBanners(false); }} onSave={saveProfileEdits} />}
      {avatarOpen &&
      <PWAvatarViewer user={profile} own onClose={() => setAvatarOpen(false)}
        onQr={() => { setAvatarOpen(false); setQrOpen(true); }}
        onShare={() => { setAvatarOpen(false); setShareOpen(true); }}
        onChangeAvatar={(src) => setProfile((prev) => ({ ...prev, avatar: src }))} />}
      {qrOpen && <PWQrShareModal user={profile} link={ownLink} onClose={() => setQrOpen(false)} onShare={() => { setQrOpen(false); setShareOpen(true); }} />}
      {shareOpen &&
      <PWShareProfileModal user={profile} own link={ownLink} onClose={() => setShareOpen(false)}
        onQr={() => { setShareOpen(false); setQrOpen(true); }} />}
      {hubOpen &&
      <PWAssessHub
        assessState={assessState}
        onOpenAssess={(key) => { setHubOpen(false); setOpenAssessKey(key); }}
        onClose={() => setHubOpen(false)} />
      }
      {openAssessKey &&
      <PWAssessWizard
        assessKey={openAssessKey}
        def={pwAssessDef(openAssessKey)}
        initialAnswers={assessState[openAssessKey] && assessState[openAssessKey].answers}
        onProgress={handleAssessProgress}
        onComplete={handleAssessComplete}
        onClose={() => { setOpenAssessKey(null); setHubOpen(true); }} />
      }
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ProfileWebApp />);
