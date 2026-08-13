/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Goal-first flow: goal header → focus card → Continue Learning → Today's
   Targets → My Courses → Free Resources → Your next best courses.
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
const LM_FREE = lmReadTierL() === "free";

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
  title: "8D Lip Design",
  moduleText: "Module 4 · Lesson 2 — Landmark mapping",
  progress: 62,
  total: 100,
  href: "Lesson.html"
};

const LM2_PROGRESS_SPOTLIGHT = {
  pillar: "Marketing",
  progress: 52,
  note: "You need visibility. You aren't known yet."
};

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
{ image: IMG_L.lip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of lip anatomy for deeper learning." },
{ image: IMG_L.lip, level: "Advanced", title: "Temple Filler", description: "Master safe injection techniques with anatomical precision." }];


const LM2_NEXT_BEST = [
{ status: "in-progress", title: "8D Lip Design", reason: "Sharpens the technique you use most", href: "CourseDetail.html" },
{ status: "next", title: "Pro Tox Masterclass", reason: "Builds the safety framework for your next tier", href: "CourseDetail.html" },
{ status: "later", title: "Marketing Your Clinic", reason: "Directly serves your £80k/month goal", href: "CourseDetail.html" }];


const LM2_HOWITWORKS = [
{ icon: "lucide:target", title: "Your goal", body: "This is the clinic and income you're building towards — not where you are today. Everything on this page is chosen to move you closer to it." },
{ icon: "lucide:trophy", title: "Progress", body: "A single 0–100 score for the one area we think matters most for your goal right now." },
{ icon: "lucide:list-checks", title: "Today's targets", body: "A short daily checklist of small actions. Tick them off as you go — they're picked to build momentum on your goal." },
{ icon: "lucide:route", title: "Next best courses", body: "Your courses in the order that gets you to your goal fastest, not just the order you enrolled in them." },
{ icon: "lucide:sparkles", title: "Ava", body: "Your AI coach. Ask her anything about your goal, your targets, or what to do next — she knows your progress." }];


const LM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: null },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" }];


function LM2Header({ freeTier }) {
  return (
    <div className={"lm2-head" + (freeTier ? " has-sub" : "")} data-screen-label="Header">
      <div className="lm2-head-row">
        <div className="lm2-head-greet">Good morning, Katy! {!freeTier && <span className="lm2-sun" role="img" aria-label="sun">☀️</span>}</div>
        {freeTier ?
        <img className="lm2-head-avatar" src="assets/avatar-katy.jpg" alt="Katy" /> :

        <span className="lm2-tierpill"><IconifyL name="lucide:crown" size={12} color="#fff" /> Confidence Path</span>
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
    </section>);

}

function LM2ProgressSpotlight({ data }) {
  const [saved, setSaved] = useStateL(false);
  return (
    <section className="lm2-hero" data-screen-label="Let's work on your goal">
      <div className="lm2-card lm2-progress-card">
        <div className="lm2-progress-top">
          <div className="lm2-progress-main">
            <span className="eyebrow"><IconifyL name="lucide:trophy" size={13} color="var(--brand-gold)" />Let's work on your goal</span>
            <div className="ti">{data.pillar}</div>
            <p className="note">{data.note}</p>
            <a href="#" className="lm2-spiral-link" onClick={(e) => { e.preventDefault(); goL("MyLearning.html"); }}>
              See my full Prosperity Spiral<IconifyL name="lucide:arrow-up-right" size={14} color="var(--ai-purple)" />
            </a>
          </div>
          <div className="lm2-progress-side">
            <button type="button" className={"lm2-save-btn" + (saved ? " saved" : "")}
            aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save this recommendation"}
            onClick={() => setSaved((s) => !s)}>
              <IconifyL name={saved ? "lucide:bookmark-check" : "lucide:bookmark"} size={16} color="var(--brand-navy)" />
            </button>
            <div className="lm2-progress-ring" style={{ "--pct": data.progress }} role="img" aria-label={data.progress + " progress"}>
              <span className="n">{data.progress}</span>
              <span className="lbl">Progress</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

function LM2ContinueCard({ data }) {
  const pct = Math.round(data.progress / data.total * 100);
  return (
    <section className="lm2-continue" data-screen-label="Continue Learning">
      <button type="button" className="lm2-continue-card" onClick={() => goL(data.href)}
      aria-label={"Resume " + data.title + ", " + data.moduleText}>
        <span className="thumb" style={{ backgroundImage: "url(" + data.image + ")" }}>
          <span className="play" aria-hidden="true"><IconifyL name="lucide:play" size={16} color="#fff" /></span>
        </span>
        <span className="body">
          <span className="ti">{data.title}</span>
          <span className="mod">{data.moduleText}</span>
          <span className="bar"><span style={{ width: pct + "%" }} /></span>
          <span className="pct">{data.progress} of {data.total} complete</span>
        </span>
      </button>
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
  const nextIdx = all.findIndex((_, i) => !done[i]);
  const nextUp = nextIdx !== -1 ? all[nextIdx] : null;
  return (
    <section className="lm2-targets-sec" data-screen-label="Today's Targets">
      {nextUp && <p className="lm2-nextup">Next up: <b>{nextUp.text}</b></p>}
      <div className="lm2-card">
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
        <p className="lm2-target-note">Completing these will move you closer to your goal</p>
      </div>
    </section>);

}

function SecHead({ title, viewAll = true, linkLabel = "See All" }) {
  return (
    <div className="lm2-sec-h">
      <h2>{title}</h2>
      {viewAll && <a href="#" onClick={(e) => { e.preventDefault(); goL("MyLearning.html"); }}>{linkLabel}</a>}
    </div>);

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

function LM2NextBestSection({ freeTier }) {
  return (
    <section className="lm2-nextsec" data-screen-label="Your next best courses">
      <div className="lm2-sec-h">
        <h2>Your next best courses</h2>
        <button type="button" className="pf-coach-link" data-coach="Explain why these are my next best courses for reaching my clinic goal.">
          <IconifyL name="lucide:sparkles" size={14} color="var(--ai-purple)" />Ask Ava why
        </button>
      </div>
      <p className="lm2-nextsec-sub">Sequenced for your goal — work through them in order</p>
      <ol className="lm2-nextlist">
        {LM2_NEXT_BEST.map((c, i) =>
        <li key={i}>
            <button type="button" className={"lm2-nextrow " + c.status} onClick={() => goL(c.href)}>
              <span className="num" aria-hidden="true">
                {c.status === "in-progress" ? <IconifyL name="lucide:play" size={13} color="#fff" /> : i + 1}
              </span>
              <span className="tx">
                <span className="ti">{c.title}</span>
                <span className="reason">{c.reason}</span>
              </span>
            </button>
          </li>
        )}
      </ol>
      <button type="button" className="lm2-outline-btn" onClick={() => goL("MyLearning.html")}>
        {freeTier ? "See what's included" : "Browse the full library"}
      </button>
      <div className="lm2-actions lm2-nextsec-actions">
        <LM2ActionCard title="Your Success Path" sub="A personalised learning journey designed to help you reach your £80k/month clinic goal" onClick={() => goL("MyLearning.html")} />
        <LM2ActionCard title="Browse All Courses" sub="Recommended, New & Popular courses" onClick={() => goL("MyLearning.html")} />
      </div>
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

  const unlockResources = () => {
    setResourcesUnlocked(true);
    try { localStorage.setItem("pf-resources-unlocked", "1"); } catch (e) {}
  };

  return (
    <div className={"lm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : "")} data-screen-label="My Learning (mobile)">
      <MobileChromeC />
      <LM2FloatChrome />
      <div className="lm-scroll" ref={scrollRef}>

        <LM2Header freeTier={LM_FREE} />

        <LM2GoalBanner data={LM2_GOAL} onHelp={() => setHelpOpen(true)} />

        <LM2ProgressSpotlight data={LM2_PROGRESS_SPOTLIGHT} />

        <section className="lm2-continue-sec" data-screen-label="Continue Learning">
          {LM_FREE ?
          <React.Fragment>
              <div className="lm2-sec-h"><h2>Continue Learning</h2></div>
              <LM2LockedCard title="Unlock Continue Learning" body="Upgrade to start a course and track your progress toward your goal." onUpgrade={() => goL("MembershipTier.html")} />
            </React.Fragment> :

          <LM2ContinueCard data={LM2_CONTINUE} />
          }
        </section>

        <LM2TargetsCard />

        <section className="lm2-courseband" data-screen-label="My Courses">
          <SecHead title="My Courses" />
          {LM_FREE ?
          <LM2LockedCard title="Unlock My Courses" body="Upgrade to purchase courses and they'll live here for easy access." onUpgrade={() => goL("MembershipTier.html")} /> :

          <div className="lm2-coursegrid">
              {LM2_MY_COURSES.map((c, i) => <LM2CourseCard key={i} c={c} />)}
            </div>
          }
        </section>

        <LM2FreeResources unlocked={resourcesUnlocked} onStartSurvey={() => setSurveyOpen(true)} />

        <LM2NextBestSection freeTier={LM_FREE} />

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
