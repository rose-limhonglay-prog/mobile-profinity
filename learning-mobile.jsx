/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Ported from the bound claude.ai/design source (Confidence Engine dashboard:
   Vision, weekly focus ring, domain confidence, daily targets) onto the DS
   bundle. Suffixed -L to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateL } = React;
const DSL = window.ProfinityDesignSystem_c2b5cc;
const { CourseTile: CourseTileL, LevelBadge: LevelBadgeL, IconifyIcon: IconifyL, Icon: IconL } = DSL;
const MobileChromeC = window.MobileChromeC;
const SurveyMobile = window.SurveyMobile;

function goL(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

const TUTOR_L = "Dr Tim Pearce";
const IMG_L = {
  lip: "assets/clinic-lip-design.png",
  protox: "assets/clinic-toxin-guide.png",
  temple: "assets/clinic-treatment-collage.png",
  logo: "assets/profinity-academy-logo-full.png"
};

const LM_VISION = "Boutique clinic with lips + skin treatments, £80k/month revenue, team of 3 professionals";

const LM_DOMAINS = [
{ key: "Clinical", pct: 62, color: "#2E86FF" },
{ key: "Marketing", pct: 52, color: "#CE9957" },
{ key: "Sales", pct: 31, color: "#BE1E2D" },
{ key: "Business", pct: 41, color: "#E58F0C" }];


const LM_FOCUS = { domain: "Marketing", line: "You need visibility. You aren't known yet.", pct: 52 };

const LM_TARGETS = [
{ t: "Write 3 LinkedIn posts about treatments", tag: "MKT", rung: "DO", pts: 15, done: true },
{ t: "Record 30-second TikTok intro to clinic", tag: "MKT", rung: "DO", pts: 15 },
{ t: "Engage on 5 local business Instagram posts", tag: "MKT", rung: "LEARN", pts: 5 },
{ t: "Document 3 common side effects and care", tag: "CLIN", rung: "LEARN", pts: 15 },
{ t: "Follow up with 3 warm enquiries within 24h", tag: "SALE", rung: "DO", pts: 15 }];


const LM_TABS_TOP = ["All Courses", "Free Resources", "New Courses", "Recommended", "Upcoming Webinars", "Certification"];

const MY_COURSES_L = [
{ image: IMG_L.lip, level: "Beginner", title: "8D Lip Design", description: "Discover a complete view of human anatomy for deeper learning.", progress: 20, cta: "Continue learning", active: true },
{ image: IMG_L.temple, level: "Intermediate", title: "Temple Filler", description: "Confidently Inject Temples & add YOUTH back into your patients.", progress: 0, cta: "Start learning" },
{ image: IMG_L.protox, level: "Advance", title: "Protox Course", description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.", progress: 0, cta: "Start learning" }];


const RESOURCES_L = [
{ image: IMG_L.temple, title: "13 Risky Injection Areas", lines: ["Facial Vein Mapping", "Navigating Risky Zones"] },
{ image: IMG_L.protox, title: "Aspirating Experiment", lines: ["Sample Analysis", "Essential Lab Techniques"] },
{ image: IMG_L.lip, title: "Bruising Checklist", lines: ["Injection Site Prep", "Minimize Bruising"] }];


const PATHS_L = [
{ image: IMG_L.protox, title: "Botox", description: "Discover a complete view of human anatomy for deeper learning.", price: "£1,998" },
{ image: IMG_L.temple, title: "Filler", description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.", price: "£794" },
{ image: IMG_L.lip, title: "Lips", description: "Confidently Inject Temples & add YOUTH back into your patients.", price: "£1,234" }];


const RECOMMENDED_L = [
{ image: IMG_L.lip, level: "Beginner", title: "Dynamic Facial Structures", description: "Explore intricate facial anatomy to enhance artistry.", by: "Dr Emily Carter", price: "£1,245" },
{ image: IMG_L.protox, level: "Intermediate", title: "Advanced Lip Techniques", description: "Master the nuances of lip anatomy for precise techniques.", by: "Prof. Jonah Lee", price: "£1,300" },
{ image: IMG_L.temple, level: "Intermediate", title: "Comprehensive Facial Anatomy", description: "A thorough exploration of facial structures.", by: "Dr Lisa Huang", price: "£1,550" }];


const NEW_COURSES_L = [
{ image: IMG_L.lip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of human anatomy for deeper learning.", by: TUTOR_L, price: "£112" },
{ image: IMG_L.protox, level: "Intermediate", title: "Protox Course", description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence.", by: TUTOR_L, price: "£99" },
{ image: IMG_L.temple, level: "Intermediate", title: "Temple Filler", description: "Confidently Inject Temples & add YOUTH back into your patients.", by: TUTOR_L, price: "£100" }];


const POPULAR_L = [
{ image: IMG_L.lip, level: "Advance", title: "8D Lip Design", description: "Discover a complete view of human anatomy for deeper learning.", by: TUTOR_L, price: "£112" },
{ image: IMG_L.protox, level: "Advance", title: "Protox Course", description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence.", by: TUTOR_L, price: "£99" },
{ image: IMG_L.temple, level: "Advance", title: "Brow Lift Training", description: "Learn expert techniques for achieving flawless brow lifts.", by: TUTOR_L, price: "£99" }];


const LM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: null },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "AgentMobile.html" }];


function LMSearch() {
  return (
    <div className="lm-search">
      <DSL.Icon name="search" size={21} color="var(--gray-450)" />
      <input type="text" placeholder="Search course…" aria-label="Search course" />
      <DSL.IconifyIcon name="lucide:sliders-horizontal" size={21} color="var(--gray-500)" />
    </div>);

}

function LMSaveFab() {
  return (
    <button className="lm-savefab" aria-label="Saved" onClick={() => goL("MySaved.html?from=learning")}>
      <IconifyL name="lucide:bookmark" size={20} color="var(--brand-navy)" />
    </button>);

}

const LM_TIER_CONTENT = [
{ label: "Foundation Courses", n: "8 courses", icon: "lucide:graduation-cap", tint: "#2A9568", href: "MyLearning.html" },
{ label: "Live Masterclasses", n: "5 replays", icon: "lucide:play-circle", tint: "#6C63FF", href: "MyLearning.html" },
{ label: "Protocols & Guides", n: "12 files", icon: "lucide:file-text", tint: "#CE9957", href: "MyLearning.html" },
{ label: "Confidence Channel", n: "Community", icon: "lucide:users", tint: "#2E86FF", href: "CommunityMobile.html" }];


function MembershipTier() {
  const [open, setOpen] = useStateL(false);
  return (
    <section className="lm-tier" data-screen-label="Your Membership">
      <button className="lm-tier-mini" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="lm-tier-badge"><IconifyL name="lucide:crown" size={16} color="#fff" /> Confidence Path</span>
        <span className="lm-tier-mini-tx">Your Membership · <b>Active</b></span>
        <IconifyL name="lucide:chevron-right" size={20} color="var(--gray-450)" />
      </button>

      {open &&
      <div className="lm-tier-overlay" role="dialog" aria-modal="true" aria-labelledby="lm-tier-h" onClick={() => setOpen(false)}>
          <div className="lm-tier-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="lm-tier-sheet-hd">
              <h2 id="lm-tier-h">Your Membership</h2>
              <button className="lm-tier-close" aria-label="Close" onClick={() => setOpen(false)}><IconifyL name="lucide:x" size={22} color="var(--gray-600)" /></button>
            </div>
            <div className="lm-tier-head">
              <span className="lm-tier-badge"><IconifyL name="lucide:crown" size={16} color="#fff" /> Confidence Path</span>
              <span className="lm-tier-note">Active</span>
            </div>
            <p className="lm-tier-sub">Jump straight into everything included in your plan.</p>
            <div className="lm-tier-grid">
              {LM_TIER_CONTENT.map((c, i) =>
            <button className="lm-tier-item" key={i} onClick={() => goL(c.href)}>
                  <span className="ic" style={{ background: c.tint + "1f" }}>
                    <IconifyL name={c.icon} size={22} color={c.tint} />
                  </span>
                  <span className="tx">
                    <span className="ti">{c.label}</span>
                    <span className="su">{c.n}</span>
                  </span>
                  <IconifyL name="lucide:chevron-right" size={20} color="var(--gray-450)" />
                </button>
            )}
            </div>
            <button className="lm-tier-manage" onClick={() => goL("MyLearning.html")}>Manage membership</button>
          </div>
        </div>
      }
    </section>);

}

function ConfidenceEngine() {
  const [targets, setTargets] = useStateL(LM_TARGETS.map((t) => !!t.done));
  const toggle = (i) => setTargets((s) => s.map((v, j) => j === i ? !v : v));
  return (
    <section className="lm-engine" data-screen-label="Confidence Engine">
      <div className="lm-vision">
        <span className="lm-vision-k"><IconifyL name="lucide:target" size={16} color="var(--brand-gold)" /> Your Vision</span>
        <span className="lm-vision-tx">{LM_VISION}</span>
      </div>

      <div className="lm-focus">
        <div className="lm-focus-tx">
          <span className="lm-focus-eyebrow">Your focus this week</span>
          <span className="lm-focus-domain">{LM_FOCUS.domain}</span>
          <span className="lm-focus-line">{LM_FOCUS.line}</span>
        </div>
        <div className="lm-focus-ring" style={{ "--pct": LM_FOCUS.pct }} role="img" aria-label={LM_FOCUS.pct + "% confident in " + LM_FOCUS.domain}>
          <span className="n">{LM_FOCUS.pct}<i>%</i></span>
        </div>
      </div>

      <div className="lm-sec-h"><h2>Your Domain Confidence</h2></div>
      <div className="lm-domains">
        {LM_DOMAINS.map((d) =>
        <div className="lm-domain" key={d.key}>
            <div className="lm-domain-top"><span className="k">{d.key.toUpperCase()}</span><span className="v">{d.pct}%</span></div>
            <span className="lm-domain-track"><span className="lm-domain-fill" style={{ width: d.pct + "%", background: d.color }} /></span>
          </div>
        )}
      </div>

      <div className="lm-sec-h"><h2>Today's Targets</h2></div>
      <div className="lm-targets">
        {LM_TARGETS.map((t, i) =>
        <button key={i} type="button" className={"lm-target" + (targets[i] ? " done" : "")} onClick={() => toggle(i)} role="checkbox" aria-checked={targets[i]}>
            <span className="lm-target-box">{targets[i] && <IconifyL name="lucide:check" size={15} color="#fff" />}</span>
            <span className="lm-target-main">
              <span className="lm-target-t">{t.t}</span>
              <span className="lm-target-meta"><span className="lm-target-tag">{t.tag}</span> Rung: {t.rung}</span>
            </span>
            <span className="lm-target-pts">+{t.pts} pts</span>
          </button>
        )}
      </div>
    </section>);

}

function LMTopTabs({ active, onPick }) {
  return (
    <div className="lm-toptabs" role="tablist" aria-label="Course categories">
      {LM_TABS_TOP.map((c) =>
      <button key={c} role="tab" aria-selected={active === c} className={"lm-tt" + (active === c ? " on" : "")} onClick={() => onPick(c)}>{c}</button>
      )}
    </div>);

}

function SecHead({ title, viewAll = true }) {
  return (
    <div className="lm-sec-h">
      <h2>{title}</h2>
      {viewAll && <a href="#" onClick={(e) => { e.preventDefault(); goL("MyLearning.html"); }}>View All</a>}
    </div>);

}

function ResourceCardL({ r, locked = true }) {
  return (
    <article className="lm-res">
      <div className="thumb" style={{ backgroundImage: "url(" + r.image + ")" }}>
        <LevelBadgeL level="Intermediate" className="lvl" />
        {locked && <span className="lock"><IconifyL name="lucide:lock" size={18} color="#fff" /></span>}
      </div>
      <div className="body">
        <div className="ti">{r.title}</div>
        {r.lines.map((l, i) => <div className="ds" key={i}>{l}</div>)}
        <div className="by">{TUTOR_L}</div>
        <button type="button" className="lm-ghost" onClick={() => goL("CourseDetail.html")}>{locked ? "Learn More" : "Start course"}</button>
      </div>
    </article>);

}

function PriceCardL({ c }) {
  return (
    <article className="lm-price">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        {c.level && <LevelBadgeL level={c.level} className="lvl" />}
        <span className="play"><IconifyL name="fluent:play-16-filled" size={18} color="var(--ai-purple)" /></span>
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="ds">{c.description}</div>
        <div className="by">{c.by}</div>
        <div className="foot">
          <span className="price">{c.price}</span>
          <button type="button" className="lm-ghost" onClick={() => goL("CourseDetail.html")}>Learn More</button>
        </div>
      </div>
    </article>);

}

function PathCardL({ c }) {
  return (
    <article className="lm-price">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <span className="badge-path">Success Path</span>
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

function PathIntroL() {
  return (
    <article className="lm-intro">
      <img src={IMG_L.logo} alt="PROfinity Academy" />
      <div className="ti">Profinity Success Paths Certificates</div>
      <div className="ds">Learn more about success paths, and build your journey towards achieving your goals with tailored strategies and resources.</div>
      <button type="button" className="lm-out" onClick={() => goL("MyLearning.html")}>Learn More</button>
    </article>);

}

function FreeResourcesL({ unlocked, onStart }) {
  return (
    <section data-screen-label="Free Resources">
      <SecHead title="Free Resources" viewAll={unlocked} />
      {unlocked ?
      <div className="lm-rail">
          {RESOURCES_L.map((r, i) => <ResourceCardL key={i} r={r} locked={false} />)}
        </div> :

      <div className="lm-locked">
          <div className="lm-locked-rail" aria-hidden="true">
            <div className="lm-rail">
              {RESOURCES_L.map((r, i) => <ResourceCardL key={i} r={r} />)}
            </div>
          </div>
          <div className="lm-locked-veil">
            <div className="lm-locked-card" role="group" aria-label="Free Resources locked">
              <span className="lm-locked-ic"><IconifyL name="lucide:lock" size={26} color="var(--brand-navy)" /></span>
              <div className="lm-locked-ti">Resources archive is locked</div>
              <div className="lm-locked-sub">Complete a short onboarding survey to unlock the full free resources archive.</div>
              <button type="button" className="lm-locked-btn" onClick={onStart}>
                Complete survey to unlock
                <IconifyL name="lucide:arrow-right" size={17} color="#fff" />
              </button>
            </div>
          </div>
        </div>
      }
    </section>);

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

function AICoachFab() {
  const [open, setOpen] = useStateL(false);
  return (
    <React.Fragment>
      <button className={"lm-coach-fab" + (open ? " on" : "")} onClick={() => setOpen((v) => !v)}
        aria-label="AI Coach" aria-expanded={open}>
        <DSL.Spark size={22} color="#fff" />
        <span className="lm-coach-fab-tx">AI Coach</span>
      </button>
      {open &&
      <div className="lm-coach-sheet" role="dialog" aria-modal="true" aria-label="AI Coach">
          <button className="lm-coach-scrim" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="lm-coach-card">
            <div className="lm-coach-hd">
              <span className="lm-coach-av"><DSL.Spark size={20} /></span>
              <div className="lm-coach-hd-tx">
                <span className="ti">Profinity Coach</span>
                <span className="su">Your learning companion</span>
              </div>
              <button className="lm-coach-x" aria-label="Close" onClick={() => setOpen(false)}>
                <IconifyL name="lucide:x" size={20} color="var(--gray-500)" />
              </button>
            </div>
            <div className="lm-coach-msg">
              Hi Katy! 👋 Based on your <b>Marketing</b> focus, I'd suggest starting with today's targets. Want me to build a study plan for this week?
            </div>
            <div className="lm-coach-chips">
              <button className="lm-coach-chip">Build my study plan</button>
              <button className="lm-coach-chip">What should I learn next?</button>
              <button className="lm-coach-chip">Explain my confidence score</button>
            </div>
            <div className="lm-coach-input">
              <input placeholder="Ask your coach anything…" aria-label="Message" />
              <button className="lm-coach-send" aria-label="Send"><IconifyL name="lucide:arrow-up" size={18} color="#fff" /></button>
            </div>
            <p className="lm-coach-disc">AI can make mistakes. Verify important outputs.</p>
          </div>
        </div>
      }
    </React.Fragment>);

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

function LearningHome() {
  const [unlocked, setUnlocked] = useStateL(() => {
    try { return localStorage.getItem("pf-free-unlocked") === "1"; } catch (e) { return false; }
  });
  const [surveyOpen, setSurveyOpen] = useStateL(false);
  const [topTab, setTopTab] = useStateL("All Courses");
  const scrollRef = React.useRef(null);
  const { hidden: chromeHidden, floating: chromeFloat } = useScrollChromeL(scrollRef);

  function completeSurvey() {
    setUnlocked(true);
    try { localStorage.setItem("pf-free-unlocked", "1"); } catch (e) {}
  }

  return (
    <div className={"lm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : "")} data-screen-label="My Learning (mobile)">
      <MobileChromeC />
      <LMSaveFab />
      <LMSearch />
      <div className="lm-scroll" ref={scrollRef}>

        <ConfidenceEngine />

        <LMTopTabs active={topTab} onPick={setTopTab} />

        <section data-screen-label="My Courses">
          <SecHead title="My Courses" viewAll={false} />
          <div className="lm-rail">
            {MY_COURSES_L.map((c, i) =>
            <CourseTileL key={i} {...c} style={{ width: 268, flex: "none", scrollSnapAlign: "start" }} />
            )}
          </div>
        </section>

        <MembershipTier />

        <FreeResourcesL unlocked={unlocked} onStart={() => setSurveyOpen(true)} />

        <section data-screen-label="Success Path">
          <div className="lm-sec-h"><h2>Success Path</h2></div>
          <div className="lm-cream">
            <div className="lm-rail">
              <PathIntroL />
              {PATHS_L.map((c, i) => <PathCardL key={i} c={c} />)}
            </div>
          </div>
        </section>

        <section data-screen-label="Recommended Course">
          <SecHead title="Recommended Course" />
          <button type="button" className="lm-pill gold" onClick={() => goL("MyLearning.html")}>
            <IconifyL name="fluent:crown-16-filled" size={15} color="#fff" />
            Upgrade to Premium for 15% OFF all products
            <IconifyL name="lucide:arrow-right" size={15} color="#fff" />
          </button>
          <div className="lm-rail">
            {RECOMMENDED_L.map((c, i) => <PriceCardL key={i} c={c} />)}
          </div>
        </section>

        <section data-screen-label="New Courses">
          <SecHead title="New Courses" />
          <div className="lm-rail">
            {NEW_COURSES_L.map((c, i) => <PriceCardL key={i} c={c} />)}
          </div>
        </section>

        <section data-screen-label="Popular Courses">
          <SecHead title="Popular Courses" />
          <div className="lm-rail">
            {POPULAR_L.map((c, i) => <PriceCardL key={i} c={c} />)}
          </div>
        </section>

        <div style={{ height: 20 }} />
      </div>
      <LMTabBar />
      <AICoachFab />
      <SurveyMobile open={surveyOpen} onClose={() => setSurveyOpen(false)} onComplete={completeSurvey} />
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
