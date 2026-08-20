/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Goal-first flow: goal header → goal banner → Continue Learning → progress
   spotlight → My Courses → Free Resources → Your Learning Path.
   Suffixed -L to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateL } = React;
const DSL = window.ProfinityDesignSystem_c2b5cc;
const { LevelBadge: LevelBadgeL, IconifyIcon: IconifyL } = DSL;
const MobileChromeC = window.MobileChromeC;
const SurveyMobile = window.SurveyMobile;

function goL(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

/* Same "pf-subscription-tier" key the newsfeed/community/membership pages
   read and write — this file doesn't load app.jsx, so it keeps its own tiny
   copy rather than depending on window.PFApp. */
function lmReadTierL() {
  if (window.PF_TIER) return window.PF_TIER;
  try { return localStorage.getItem("pf-subscription-tier") || "free"; } catch (e) { return "free"; }
}
const LM_TIER = lmReadTierL();
const LM_FREE = LM_TIER === "free";

/* Membership ladder — mirrors mobilechrome.jsx's SM_TIER_LADDER_C /
   profile-mobile.jsx's SM_TIER_LADDER_PM, so a Confidence/Mastery/Freedom
   member sees their actual tier here instead of this page's old hardcoded
   "Confidence Path" for every paid viewer. */
const LM_TIER_LADDER = ["confidence", "mastery", "freedom", "inner"];
const LM_TIER_DISPLAY_NAME = { confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", inner: "Inner Circle" };
function lmNextTierL(tier) {
  const i = LM_TIER_LADDER.indexOf(tier);
  if (i === -1) return LM_TIER_LADDER[0];
  if (i === LM_TIER_LADDER.length - 1) return null;
  return LM_TIER_LADDER[i + 1];
}

const TUTOR_L = "Dr Tim Pearce";
const IMG_L = {
  lip: "assets/clinic-lip-design.png",
  protox: "assets/course-protox.png",
  eightDLip: "assets/course-8d-lip-design.jpg",
  templeFiller: "assets/course-temple-filler.webp",
  browLift: "assets/course-brow-lift.jpg",
  fullFace: "assets/course-full-face-rejuvenation.jpg",
  cheekContouring: "assets/course-cheek-contouring.jpg",
  rhinoplasty: "assets/course-rhinoplasty.jpg",
  jawlineSculpting: "assets/course-jawline-sculpting.jpg",
  tearTrough: "assets/course-tear-trough.jpg",
  skinBoosters: "assets/course-skin-boosters.jpg",
  complications: "assets/course-complications.jpg",
  consultation: "assets/course-consultation.jpg",
  membership: "https://prncpjnraanretzdeuou.supabase.co/storage/v1/object/public/course-content/courses/profinity-membership/poster.jpg",
};

const LM2_GOAL = {
  title: "My Goal & Dream Clinic",
  vision: "Boutique clinic with lips + skin treatments, £80k/month revenue, team of 3 professionals",
  clarifier: "Where you're heading — not where you are today."
};

const LM2_CONTINUE = {
  image: IMG_L.lip,
  level: "Intermediate",
  title: "8D Lip Design",
  progress: 20,
  note: "Only 6 more modules until you get your certificate",
  cta: "Resume Lesson 4",
  href: "Lesson.html"
};

const LM2_MY_COURSES = [
{ image: IMG_L.eightDLip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of lip anatomy for deeper learning.", progress: 20, lesson: 4, modulesLeft: 6 },
{ image: IMG_L.templeFiller, level: "Advanced", title: "Temple Filler", description: "Master safe injection techniques with anatomical precision." },
{ image: IMG_L.protox, level: "Advanced", title: "Protox Course", description: "Elevate your botulinum toxin skills and refine your technique." },
{ image: IMG_L.browLift, level: "Intermediate", title: "Brow Lift Training", description: "Learn expert techniques for achieving flawless, natural brow lifts." },
{ image: IMG_L.fullFace, level: "Advanced", title: "Full-Face Rejuvenation Protocol", description: "A complete framework for combination treatments across the face." },
{ image: IMG_L.cheekContouring, level: "Intermediate", title: "Cheek & Midface Contouring", description: "Master volumising techniques for natural-looking cheek definition." },
{ image: IMG_L.rhinoplasty, level: "Advanced", title: "Non-Surgical Rhinoplasty", description: "Reshape and refine the nose using dermal filler with confidence." },
{ image: IMG_L.jawlineSculpting, level: "Advanced", title: "Jawline Sculpting Masterclass", description: "Define and balance the lower face with precision filler technique." },
{ image: IMG_L.tearTrough, level: "Advanced", title: "Tear Trough Correction", description: "Safely treat under-eye hollowing with anatomically-guided technique." },
{ image: IMG_L.skinBoosters, level: "Beginner", title: "Skin Boosters & Hydration Therapy", description: "Introduce biorevitalisation treatments to improve skin quality." },
{ image: IMG_L.complications, level: "Advanced", title: "Complications Management", description: "Recognise, prevent and manage vascular and other complications." },
{ image: IMG_L.consultation, level: "Beginner", title: "Consultation & Patient Assessment", description: "Build trust and plan safe, effective treatments from the first visit." }];


/* Confidence tier only sees the courses included in that membership —
   the full catalogue above is for higher tiers. */
const LM2_MY_COURSES_CONFIDENCE = [
{ image: IMG_L.membership, level: "Beginner", title: "Profinity Membership", description: "Your welcome course — get the most out of your Confidence membership." },
{ image: IMG_L.eightDLip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of lip anatomy for deeper learning.", progress: 20, lesson: 4, modulesLeft: 6 },
{ image: IMG_L.templeFiller, level: "Advanced", title: "Temple Filler", description: "Master safe injection techniques with anatomical precision." }];


const LM2_HOWITWORKS = [
{ icon: "lucide:target", title: "Your goal", body: "This is the clinic and income you're building towards — not where you are today. Everything on this page is chosen to move you closer to it." },
{ icon: "lucide:trophy", title: "Progress", body: "A single 0–100 score for the one area we think matters most for your goal right now." },
{ icon: "lucide:list-checks", title: "Today's targets", body: "A short daily checklist of small actions. Tick them off as you go — they're picked to build momentum on your goal." },
{ icon: "lucide:route", title: "Next best courses", body: "Your courses in the order that gets you to your goal fastest, not just the order you enrolled in them." },
{ icon: "lucide:sparkles", title: "Ava", body: "Your AI coach. Ask her anything about your goal, your targets, or what to do next — she knows your progress." }];


const LM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: null },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" },
{ key: "Rewards", label: "Rewards", icon: "lucide:gift", href: "RewardsDashboard.html" }];


function LM2Header({ freeTier, tier }) {
  return (
    <div className={"lm2-head" + (freeTier ? " has-sub" : "")} data-screen-label="Header">
      <div className="lm2-head-row">
        <div className="lm2-head-greet">Good morning, Katy! <span className="lm2-sun" role="img" aria-label="sun">☀️</span></div>
        {freeTier ?
        <img className="lm2-head-avatar" src="assets/avatar-katy.jpg" alt="Katy" /> :

        <span className="lm2-tierpill"><IconifyL name="lucide:crown" size={12} color="#fff" /> {LM_TIER_DISPLAY_NAME[tier]} Path</span>
        }
      </div>
      {freeTier && <p className="lm2-head-sub">Your goal is to grow in aesthetics or medical school</p>}
    </div>);

}

function LM2GoalBanner({ data, onHelp }) {
  return (
    <section className="lm2-goalcard" data-screen-label={data.title}>
      <div className="lm2-goal-head">
        <span className="lm2-goal-icon"><IconifyL name="lucide:target" size={18} color="#fff" /></span>
        <span className="lm2-goal-title">{data.title}</span>
        <button type="button" className="lm2-goal-help" aria-label="How this page works" onClick={onHelp}>
          <IconifyL name="lucide:help-circle" size={19} color="rgba(255,255,255,.85)" />
        </button>
      </div>
      <p className="lm2-goal-vision">{data.vision}</p>
      <p className="lm2-goal-clarifier">{data.clarifier}</p>
      <button type="button" className="pf-coach-link lm2-goal-coach" data-coach="Help me get closer to my £80k/month clinic goal — what should I focus on next?">
        <IconifyL name="lucide:sparkles" size={14} color="#fff" />Discuss with Ava
      </button>
    </section>);

}

function LM2ContinueCard({ data }) {
  return (
    <section className="lm2-hero" data-screen-label="Continue Learning">
      <div className="lm2-sec-h"><h2>Continue Learning</h2></div>
      <article className="lm2-herocard">
        <div className="thumb" style={{ backgroundImage: "url(" + data.image + ")" }}>
          <LevelBadgeL level={data.level} className="lvl" />
        </div>
        <div className="body">
          <div className="ti">{data.title}</div>
          <div className="lm2-progrow">
            <span className="bar"><span style={{ width: data.progress + "%" }} /></span>
            <span className="pct">{data.progress}% Complete</span>
          </div>
          <p className="note">{data.note}</p>
          <button type="button" className="lm2-cta" onClick={() => goL(data.href)}>
            {data.cta}<IconifyL name="lucide:arrow-up-right" size={17} color="#fff" />
          </button>
        </div>
      </article>
    </section>);

}

function SecHead({ title, viewAll = true, linkLabel = "See All" }) {
  return (
    <div className="lm2-sec-h">
      <h2>{title}</h2>
      {viewAll && <a href="#" onClick={(e) => { e.preventDefault(); goL("MyLearning.html"); }}>{linkLabel}</a>}
    </div>);

}

function LM2SubscribeCard({ isFree, nextTier, onSubscribe }) {
  const nextName = LM_TIER_DISPLAY_NAME[nextTier];
  return (
    <section className="lm2-subscribe" data-screen-label={"Unlock more with " + nextName}>
      <span className="ic"><IconifyL name="lucide:sparkles" size={22} color="var(--premium-orange)" /></span>
      <div className="tx">
        <h3>Unlock more with {nextName}</h3>
        <p>More courses, live events &amp; community perks.</p>
      </div>
      <button type="button" className="lm2-subscribe-btn" onClick={onSubscribe}>
        {isFree ? "Subscribe" : "Upgrade"}<IconifyL name="lucide:arrow-up-right" size={15} color="#fff" />
      </button>
    </section>);

}

function LM2LockedCard({ title, body, onUpgrade }) {
  return (
    <div className="lm2-locked">
      <span className="ic"><IconifyL name="lucide:lock" size={20} color="#fff" /></span>
      <h3>{title}</h3>
      <p>{body}</p>
      <button type="button" className="lm2-upgrade-btn" onClick={onUpgrade}>
        Upgrade<IconifyL name="lucide:arrow-up-right" size={16} color="#fff" />
      </button>
    </div>);

}

function LM2CourseCard({ c }) {
  return (
    <article className="lm2-coursecard">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <LevelBadgeL level={c.level} className="lvl" />
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="ds">{c.description}</div>
        <div className="by">{TUTOR_L}</div>
        <div className="foot">
          <button type="button" className="lm-ghost" onClick={() => goL("CourseDetail.html")}>Learn More</button>
        </div>
      </div>
    </article>);

}

function LM2CourseCardWide({ c }) {
  const inProgress = typeof c.progress === "number";
  return (
    <article className="lm2-coursecard-wide">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <LevelBadgeL level={c.level} className="lvl" />
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        {inProgress ?
        <React.Fragment>
            <div className="prog">
              <span className="bar"><span style={{ width: c.progress + "%" }} /></span>
              <span className="pct">{c.progress}% Complete</span>
            </div>
            <div className="ds">Only {c.modulesLeft} more modules until you get your certificate</div>
            <button type="button" className="lm2-resume-btn" onClick={() => goL("Lesson.html")}>
              Resume Lesson {c.lesson}<IconifyL name="lucide:arrow-up-right" size={16} color="#fff" />
            </button>
          </React.Fragment> :

        <React.Fragment>
            <div className="ds">{c.description}</div>
            <div className="by">{TUTOR_L}</div>
            <div className="foot">
              <button type="button" className="lm-ghost" onClick={() => goL("CourseDetail.html")}>Learn More</button>
            </div>
          </React.Fragment>
        }
      </div>
    </article>);

}

function LM2ActionCard({ icon, title, sub, onClick }) {
  return (
    <div className="lm-unlock" data-screen-label={title}>
      <div className="lm-unlock-tx">
        <span className="ti">{icon && <IconifyL name={icon} size={15} color="var(--brand-navy)" style={{ marginRight: 6, verticalAlign: -2 }} />}{title}</span>
        <span className="su">{sub}</span>
      </div>
      <button type="button" className="lm-unlock-btn" aria-label={title} onClick={onClick}>
        <IconifyL name="lucide:arrow-right" size={20} color="#fff" />
      </button>
    </div>);

}

function LM2FreeResources({ unlocked, onStartSurvey }) {
  return (
    <section className="lm2-freeres" data-screen-label="Free Resources">
      <SecHead title="Free Resources" linkLabel="View All" />
      {unlocked ?
      <div className="lm2-freeres-open">
          <p>Your free resources are unlocked — guides, checklists and vein maps tailored to your clinic goals.</p>
          <button type="button" className="lm2-outline-btn" onClick={() => goL("MySaved.html")}>
            View free resources<IconifyL name="lucide:arrow-up-right" size={16} color="var(--brand-navy)" />
          </button>
        </div> :

      <div className="lm2-actions">
          <LM2ActionCard icon="lucide:lock" title="Free Resources" sub="Complete a quick survey to unlock free resources tailored to your clinic goals" onClick={onStartSurvey} />
        </div>
      }
    </section>);

}

function LM2LearningPathCard() {
  return (
    <section className="lm2-pathsec" data-screen-label="Discover your journey">
      <button type="button" className="lm2-pathcard" onClick={() => goL("AllCoursesMobile.html")}>
        <span className="chip"><IconifyL name="lucide:route" size={22} color="#fff" /></span>
        <span className="tx">
          <span className="ti">Discover your journey</span>
          <span className="body">We sequence your next-best courses from Recommended, New &amp; Popular — one clear step at a time toward your goal.</span>
        </span>
        <span className="arrow" aria-hidden="true">
          <IconifyL name="lucide:arrow-right" size={19} color="#fff" />
        </span>
      </button>
    </section>);

}

function LM2HelpSheet({ open, onClose }) {
  const closeRef = React.useRef(null);
  const lastFocused = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    closeRef.current && closeRef.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      if (lastFocused.current && lastFocused.current.focus) { try { lastFocused.current.focus(); } catch (e) {} }
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="lm2-help-wrap">
      <div className="lm2-help-scrim" onClick={onClose} />
      <div className="lm2-help-sheet" role="dialog" aria-modal="true" aria-label="How this page works">
        <span className="lm2-help-handle" aria-hidden="true" />
        <header className="lm2-help-head">
          <h2>How this page works</h2>
          <button type="button" ref={closeRef} className="lm2-help-close" aria-label="Close" onClick={onClose}>
            <IconifyL name="lucide:x" size={20} color="var(--gray-700)" />
          </button>
        </header>
        <div className="lm2-help-body">
          {LM2_HOWITWORKS.map((h, i) =>
          <div className="lm2-help-item" key={i}>
              <span className="ic"><IconifyL name={h.icon} size={17} color="var(--brand-navy)" /></span>
              <div className="tx">
                <b>{h.title}</b>
                <p>{h.body}</p>
              </div>
            </div>
          )}
        </div>
        <button type="button" className="lm2-help-gotit" onClick={onClose}>Got it</button>
      </div>
    </div>);

}

const LMTabBar = React.forwardRef(function LMTabBar(_props, ref) {
  return (
    <nav ref={ref} className="lm-tabs" aria-label="Primary">
      {LM_TABS.map((t) =>
      <button key={t.key} className={"lm-tab" + (t.key === "Learning" ? " on" : "")}
      aria-current={t.key === "Learning" ? "page" : undefined} onClick={() => t.href && goL(t.href)}>
          <span className="ic">
            <DSL.IconifyIcon name={t.icon} size={24} color={t.key === "Learning" ? "#fff" : "#000"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          <span className="lbl">{t.label}</span>
        </button>
      )}
    </nav>);

});

function LM2FloatChrome() {
  return (
    <div className="lm2-float-icons">
      <button type="button" className="fi" aria-label="Search">
        <IconifyL name="lucide:search" size={18} color="var(--brand-navy)" />
      </button>
      <button type="button" className="fi" aria-label="Saved" onClick={() => goL("MySaved.html")}>
        <IconifyL name="lucide:bookmark" size={18} color="var(--brand-navy)" />
      </button>
    </div>);

}

function useScrollChromeL(scrollRef) {
  const [state, setState] = useStateL({ hidden: false, floating: false });
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY;
      setState((prev) => {
        let hidden = prev.hidden;
        if (y < 40) hidden = false;
        else if (delta > 6) hidden = true;
        else if (delta < -6) hidden = false;
        return { hidden, floating: y > 40 };
      });
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}

function lmReadResourcesUnlockedL() {
  try { return localStorage.getItem("pf-resources-unlocked") === "1"; } catch (e) { return false; }
}

function LearningHome() {
  const [surveyOpen, setSurveyOpen] = useStateL(false);
  const [helpOpen, setHelpOpen] = useStateL(false);
  const [resourcesUnlocked, setResourcesUnlocked] = useStateL(lmReadResourcesUnlockedL);
  const scrollRef = React.useRef(null);
  const { hidden: chromeHidden, floating: chromeFloat } = useScrollChromeL(scrollRef);
  const nextTier = lmNextTierL(LM_TIER);
  const myCourses = LM_TIER === "confidence" ? LM2_MY_COURSES_CONFIDENCE : LM2_MY_COURSES;

  const unlockResources = () => {
    setResourcesUnlocked(true);
    try { localStorage.setItem("pf-resources-unlocked", "1"); } catch (e) {}
  };

  return (
    <div className={"lm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : "")} data-screen-label="My Learning (mobile)">
      <MobileChromeC />
      <LM2FloatChrome />
      <div className="lm-scroll" ref={scrollRef}>

        <LM2Header freeTier={LM_FREE} tier={LM_TIER} />

        <LM2GoalBanner data={LM2_GOAL} onHelp={() => setHelpOpen(true)} />

        {!LM_FREE && <LM2ContinueCard data={LM2_CONTINUE} />}

        <section className="lm2-courseband" data-screen-label="My Courses">
          <SecHead title="My Courses" />
          {LM_FREE ?
          <LM2LockedCard title="Unlock My Courses" body="Upgrade to purchase courses and they'll live here for easy access." onUpgrade={() => goL("MembershipTier.html")} /> :

          <div className="lm2-coursegrid">
              <span className="lm2-coursegrid-pad" aria-hidden="true" />
              <LM2CourseCardWide c={myCourses[0]} />
              {myCourses.slice(1).map((c, i) => <LM2CourseCard key={i} c={c} />)}
              <span className="lm2-coursegrid-pad" aria-hidden="true" />
            </div>
          }
        </section>

        <LM2FreeResources unlocked={resourcesUnlocked} onStartSurvey={() => setSurveyOpen(true)} />

        <LM2LearningPathCard />

        {nextTier && <LM2SubscribeCard isFree={LM_FREE} nextTier={nextTier} onSubscribe={() => goL("MembershipTier.html")} />}

        <div style={{ height: 20 }} />
      </div>
      <LMTabBar />
      <SurveyMobile open={surveyOpen} onClose={() => setSurveyOpen(false)} onComplete={unlockResources} />
      <LM2HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>);

}

function useDeviceScaleL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateL(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileL() {
  const [mobile, setMobile] = useStateL(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function LearningMobileApp() {
  const mobile = useIsMobileL();
  const scale = useDeviceScaleL();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><LearningHome /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><LearningHome /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<LearningMobileApp />);
