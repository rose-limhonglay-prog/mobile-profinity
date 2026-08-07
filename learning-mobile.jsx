/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Ported from the bound claude.ai/design source (Clinic Growth dashboard:
   stats + On Track ring, Continue Learning, Next Best Action, Clinic Growth
   Score, Today's Target, My Courses, action cards) onto the DS bundle.
   Suffixed -L to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateL } = React;
const DSL = window.ProfinityDesignSystem_c2b5cc;
const { LevelBadge: LevelBadgeL, IconifyIcon: IconifyL } = DSL;
const MobileChromeC = window.MobileChromeC;
const SurveyMobile = window.SurveyMobile;

function goL(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

const TUTOR_L = "Dr Tim Pearce";
const IMG_L = {
  lip: "assets/clinic-lip-design.png"
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

const LM2_PROGRESS_SPOTLIGHT = {
  pillar: "Marketing",
  progress: 52,
  note: "You need visibility. You aren't known yet.",
  cta: "Work on your goal",
  href: "CourseDetail.html"
};

const LM2_REASONING = "Based on your goal of building an £80k/month boutique clinic, Marketing has been chosen as today's focus — better visibility is the fastest lever to fill your books.";

/* The Prosperity Spiral — exactly these four pillars, no abbreviation, no "Patient Care" */
const LM2_PILLARS = [
{ key: "Sales", pct: 31, color: "var(--error)" },
{ key: "Marketing", pct: 52, color: "linear-gradient(90deg, #f4ad3d, #e7820a)" },
{ key: "Clinical Skills", pct: 62, color: "var(--info)" },
{ key: "Business Systems", pct: 41, color: "var(--premium-orange)" }];


const LM2_TARGET_TAGS = {
  MKT: { label: "MKT", color: "#e7820a" },
  CLIN: { label: "CLIN", color: "#0088de" },
  SALE: { label: "SALE", color: "var(--error)" },
  SYS: { label: "SYS", color: "var(--premium-orange)" }
};

const LM2_TARGETS = [
{ text: "Complete Lesson 4: Lip Anatomy", tag: "CLIN" },
{ text: "Post 2 before/after case studies", tag: "MKT" },
{ text: "Follow up with 3 lapsed patients", tag: "SALE" },
{ text: "Log this week's expenses in your tracker", tag: "SYS" }];


const LM2_MY_COURSES = [
{ image: IMG_L.lip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of lip anatomy for deeper learning.", price: "£112" },
{ image: IMG_L.lip, level: "Advanced", title: "Temple Filler", description: "Master safe injection techniques with anatomical precision.", price: "£89" }];


const LM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: null },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" }];


function LM2Header() {
  return (
    <div className="lm2-head" data-screen-label="Header">
      <div className="lm2-head-row">
        <div className="lm2-head-greet">Good morning, Katy! <span className="lm2-sun" role="img" aria-label="sun">☀️</span></div>
        <span className="lm2-tierpill"><IconifyL name="lucide:crown" size={12} color="#fff" /> Confidence Path</span>
      </div>
    </div>);

}

function LM2GoalBanner({ data }) {
  return (
    <section className="lm2-goalcard" data-screen-label={data.title}>
      <div className="lm2-goal-head">
        <span className="lm2-goal-icon"><IconifyL name="lucide:target" size={18} color="#fff" /></span>
        {data.title}
      </div>
      <p className="lm2-goal-vision">{data.vision}</p>
      <p className="lm2-goal-clarifier">{data.clarifier}</p>
    </section>);

}

function LM2ProgressSpotlight({ data, reasoning }) {
  return (
    <section className="lm2-hero" data-screen-label="Your Progress">
      <div className="lm2-card lm2-progress-card">
        <div className="lm2-progress-top">
          <div className="lm2-progress-main">
            <span className="eyebrow">Your Progress</span>
            <div className="ti">{data.pillar}</div>
            <p className="note">{data.note}</p>
          </div>
          <div className="lm2-progress-ring" style={{ "--pct": data.progress }} role="img" aria-label={data.progress + " progress"}>
            <span className="n">{data.progress}</span>
            <span className="lbl">Progress</span>
          </div>
        </div>
        {reasoning && <p className="lm2-reasoning">{reasoning}</p>}
        <button type="button" className="lm2-cta" onClick={() => goL(data.href)}>
          {data.cta}<IconifyL name="lucide:arrow-up-right" size={17} color="#fff" />
        </button>
      </div>
    </section>);

}

function LM2HeroCard({ title, data, reasoning }) {
  return (
    <section className="lm2-hero" data-screen-label={title}>
      <div className="lm2-sec-h"><h2>{title}</h2></div>
      {reasoning && <p className="lm2-reasoning">{reasoning}</p>}
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

function LM2GrowthCard() {
  return (
    <section className="lm2-card" data-screen-label="The Prosperity Spiral">
      <div className="lm2-card-hd">
        <h2>The Prosperity Spiral</h2>
        <button type="button" className="pf-coach-link" data-coach="Discuss my Prosperity Spiral — Sales, Marketing, Clinical Skills and Business Systems — and tell me what to prioritise.">
          <IconifyL name="lucide:sparkles" size={14} color="var(--ai-purple)" />Discuss with Ava
        </button>
      </div>
      <div className="lm2-pillar-grid">
        {LM2_PILLARS.map((g) =>
        <button key={g.key} type="button" className="lm2-pillar-card" onClick={() => goL("MyLearning.html")}>
            <span className="top">
              <span className="k">{g.key}</span>
              <span className="v">{g.pct}</span>
            </span>
            <span className="bar"><span style={{ width: g.pct + "%", background: g.color }} /></span>
          </button>
        )}
      </div>
    </section>);

}

function LM2TargetsCard() {
  const [extra, setExtra] = useStateL([]);
  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("pf-coach-targets")) || [];
      setExtra(stored.map((t) => ({ text: t.text, tag: null })));
    } catch (e) {}
  }, []);
  const all = LM2_TARGETS.concat(extra);
  const [done, setDone] = useStateL([]);
  const toggle = (i) => setDone((s) => {
    const next = s.slice();
    while (next.length <= i) next.push(false);
    next[i] = !next[i];
    return next;
  });
  return (
    <section className="lm2-card" data-screen-label="Today's Targets">
      <div className="lm2-card-hd">
        <h2>Today's Targets</h2>
        <button type="button" className="pf-coach-link" data-coach="Help me plan today's targets to make progress on my clinic goal.">
          <IconifyL name="lucide:sparkles" size={14} color="var(--ai-purple)" />Discuss with Ava
        </button>
      </div>
      <div className="lm2-target-rows">
        {all.map((t, i) =>
        <button key={i} type="button" className={"lm2-target-row" + (done[i] ? " done" : "")} onClick={() => toggle(i)} role="checkbox" aria-checked={!!done[i]}>
            <span className="circle">{done[i] && <IconifyL name="lucide:check" size={12} color="#fff" />}</span>
            {t.tag && <span className="lm2-target-tag" style={{ background: LM2_TARGET_TAGS[t.tag].color }}>{LM2_TARGET_TAGS[t.tag].label}</span>}
            <span className="tx">{t.text}</span>
          </button>
        )}
      </div>
      <p className="lm2-target-note">Completing these will move your Prosperity Spiral forward</p>
    </section>);

}

function SecHead({ title, viewAll = true }) {
  return (
    <div className="lm2-sec-h">
      <h2>{title}</h2>
      {viewAll && <a href="#" onClick={(e) => { e.preventDefault(); goL("MyLearning.html"); }}>See All</a>}
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
          <span className="price">{c.price}</span>
          <button type="button" className="lm-ghost" onClick={() => goL("CourseDetail.html")}>Learn More</button>
        </div>
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
          {t.label}
        </button>
      )}
    </nav>);

});

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

function LearningHome() {
  const [surveyOpen, setSurveyOpen] = useStateL(false);
  const scrollRef = React.useRef(null);
  const { hidden: chromeHidden, floating: chromeFloat } = useScrollChromeL(scrollRef);

  return (
    <div className={"lm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : "")} data-screen-label="My Learning (mobile)">
      <MobileChromeC />
      <div className="lm-scroll" ref={scrollRef}>

        <LM2Header />

        <LM2GoalBanner data={LM2_GOAL} />

        <LM2HeroCard title="Continue Learning" data={LM2_CONTINUE} />

        <LM2ProgressSpotlight data={LM2_PROGRESS_SPOTLIGHT} reasoning={LM2_REASONING} />

        <LM2GrowthCard />

        <LM2TargetsCard />

        <section data-screen-label="My Courses">
          <SecHead title="My Courses" />
          <div className="lm2-coursegrid">
            {LM2_MY_COURSES.map((c, i) => <LM2CourseCard key={i} c={c} />)}
          </div>
        </section>

        <div className="lm2-actions">
          <LM2ActionCard icon="lucide:lock" title="Free Resources" sub="Complete a quick survey to unlock free resources tailored to your clinic goals" onClick={() => setSurveyOpen(true)} />
          <LM2ActionCard title="Your Success Path" sub="A personalised learning journey designed to help you reach your £80k/month clinic goal" onClick={() => goL("MyLearning.html")} />
          <LM2ActionCard title="Browse All Courses" sub="Recommended, New & Popular courses" onClick={() => goL("MyLearning.html")} />
        </div>

        <div style={{ height: 20 }} />
      </div>
      <LMTabBar />
      <SurveyMobile open={surveyOpen} onClose={() => setSurveyOpen(false)} onComplete={() => setSurveyOpen(false)} />
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
