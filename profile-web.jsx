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
  bio: "Enhance patient satisfaction scores by 15% over the next 6 months through improved communication and personalized care planning.",
  followers: "1,546", following: "880", posts: "57", location: "London, United Kingdom", clinic: "Allcare Medical"
};

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

/* Assessment-complete celebration — raw JSON through lottie-web
   (loadAnimation), never the lottie.host /embed iframe: the iframe caches
   hard and ignores re-publishes, and ?v= cache-busters break its route. */
function PWResultLottie({ size }) {
  const host = React.useRef(null);
  useEffectPW(() => {
    let anim, iv;
    function start() {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current, renderer: "svg", loop: false, autoplay: true,
        path: "https://lottie.host/d343b01e-a214-4708-97e8-51a7f92d98bf/HFXvByPBoo.json"
      });
    }
    if (window.lottie) start();
    else iv = setInterval(() => { if (window.lottie) { clearInterval(iv); start(); } }, 120);
    return () => { if (anim) anim.destroy(); if (iv) clearInterval(iv); };
  }, []);
  return <div ref={host} className="pw-wiz-result-lottie" style={{ width: size, height: size }} aria-hidden="true" />;
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
        <PWResultLottie size={150} />
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
      <PWResultLottie size={150} />
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
    b.style.setProperty("background", active ? "rgb(225, 223, 242)" : "none", "important");
    b.style.setProperty("transition", "background .18s ease", "important");
    const path = b.querySelector("svg path");
    if (path) path.style.setProperty("fill", active ? "currentColor" : "", "important");
  });
}

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
function PWCoverHeader() {
  return (
    <div className="pw-cover">
      <div className="pw-cover-inner">
        <div className="pw-cover-avatarwrap">
          <img className="pw-cover-avatar" src={PW_ME.avatar} alt={PW_ME.name} />
        </div>
      </div>
    </div>);

}

function PWHeaderBand() {
  return (
    <div className="pw-headerband">
      <div className="pw-headerband-spacer" aria-hidden="true" />
      <div className="pw-headerband-info">
        <span className="pw-headerband-namerow">
          <h1>{PW_ME.name}</h1>
          <VerificationSealsPW seals={PW_ME.seals} size={19} />
        </span>
        <div className="pw-headerband-stats">{PW_ME.followers} followers · {PW_ME.following} following</div>
        <ul className="pw-headerband-facts">
          <li><IconifyIconPW name="lucide:stethoscope" size={15} color="var(--gray-500)" /><span>{PW_ME.role} at {PW_ME.clinic}</span></li>
          <li><IconifyIconPW name="lucide:map-pin" size={15} color="var(--gray-500)" /><span>Based in {PW_ME.location}</span></li>
          <li><IconifyIconPW name="lucide:target" size={15} color="var(--gray-500)" /><span>{PW_ME.bio}</span></li>
          <li><IconifyIconPW name="lucide:award" size={15} color="var(--gray-500)" /><span>PROfinity Gold Member</span></li>
        </ul>
      </div>
      <div className="pw-headerband-actions">
        <ButtonPW variant="brand" iconLeading={<IconPW name="edit" size={18} color="var(--white)" />}>Edit Page</ButtonPW>
        <button type="button" className="pw-btn-outline">Edit</button>
        <button type="button" className="pw-btn-iconsq" aria-label="More profile options">
          <IconifyIconPW name="lucide:chevron-down" size={18} color="var(--gray-600)" />
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
function PWComposerCard() {
  const firstName = PW_ME.name.split(" ")[0];
  return (
    <section className="pw-composer-card">
      <div className="pw-composer-top">
        <img className="pw-composer-avatar" src={PW_ME.avatar} alt={PW_ME.name} />
        <button type="button" className="pw-composer-pill" onClick={() => goPW("NewsfeedWeb.html")}>
          {"What's on your mind, " + firstName + "?"}
        </button>
      </div>
      <div className="pw-composer-actions">
        <button type="button" className="pw-composer-action" onClick={() => goPW("NewsfeedWeb.html")}>
          <IconifyIconPW name="lucide:video" size={20} color="var(--error)" />Live video
        </button>
        <button type="button" className="pw-composer-action" onClick={() => goPW("NewsfeedWeb.html")}>
          <IconifyIconPW name="lucide:image" size={20} color="var(--success)" />Photo/video
        </button>
        <button type="button" className="pw-composer-action" onClick={() => goPW("NewsfeedWeb.html")}>
          <IconifyIconPW name="lucide:clapperboard" size={20} color="var(--info)" />Reel
        </button>
      </div>
    </section>);

}

function PWPostCard({ p, pinned }) {
  const lines = p.body.split("\n");
  return (
    <article className={"pw-post-card" + (pinned ? " pinned" : "")}>
      <div className="pw-post-hd">
        <AvatarPW name={p.name} src={p.avatar} size={44} />
        <div className="pw-post-by">
          <span className="nm">{p.name}{pinned && <span className="ctx">is in <b>{p.loc}</b></span>}</span>
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

function ProfileMain({ assessState, onOpenHub }) {
  const D = window.APP_DATA;
  const p = D.profile;
  return (
    <>
      <PWCoverHeader />
      <div className="pw-page">
        <PWHeaderBand />
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
            <PWComposerCard />
            <PWGoalsSection assessState={assessState} onOpenHub={onOpenHub} />
            <PWPostsCard />
          </div>
        </div>
      </div>
    </>);

}

function ProfileWebApp() {
  useEffectPW(() => pfTagActiveNavPW("Profile"));
  const [assessState, setAssessState] = useStatePW(() => pwLoadAssessState());
  const [hubOpen, setHubOpen] = useStatePW(false);
  const [openAssessKey, setOpenAssessKey] = useStatePW(null);

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

  return (
    <div className="app wa-screen">
      <TopNavPW active="Profile" user={PW_ME} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigatePW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      <ProfileMain assessState={assessState} onOpenHub={() => setHubOpen(true)} />
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
