/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -L to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateL, useEffect: useEffectL } = React;
const DSL = window.ProfinityDesignSystem_c2b5cc;

function goL(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

const LM_CATS = ["All", "Design", "Development", "Business", "Marketing"];

const LM_MINE = [
{ title: "Advanced Lip Techniques", dur: "4h 12m", rating: "4.8", reviews: "1,240", instr: "Dr. Tim Pearce", pct: 68, grad: "linear-gradient(140deg,#6172f3 0%,#3b82f6 100%)" },
{ title: "Temple Filler", dur: "2h 45m", rating: "4.7", reviews: "820", instr: "Dr. Tim Pearce", pct: 45, grad: "linear-gradient(140deg,#f59e0b 0%,#f0617a 100%)" }];


const LM_REC = [
{ title: "Facial Anatomy for Artists", cat: "Design", rating: "4.9", price: "£ 129", enrolled: "12.4k enrolled", grad: "linear-gradient(140deg,#0fb6a3 0%,#28d3a0 100%)" },
{ title: "Marketing Strategy Foundations", cat: "Business", rating: "4.8", price: "£ 99", enrolled: "8.1k enrolled", grad: "linear-gradient(140deg,#a855f7 0%,#d946ef 100%)" }];


const LM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: null },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "Agent.html" }];


function useDeviceScaleL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateL(calc);
  useEffectL(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileL() {
  const [mobile, setMobile] = useStateL(() => window.matchMedia('(max-width:768px)').matches);
  useEffectL(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function LMHeader() {
  return (
    <header className="lm-top">
      <button className="lm-burger" aria-label="Menu"><DSL.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img className="m-logo-light" src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      <img className="m-logo-dark" src="assets/profinity-academy-logo-dark.jpg" alt="PROfinity Academy" />
      <span className="grow" />
      <button className="lm-iconbtn" aria-label="Search" onClick={() => goL("SearchMobile.html")}><DSL.Icon name="search" size={20} color="var(--brand-navy)" /></button>
      <button className="lm-iconbtn" aria-label="Notifications">
        <DSL.IconifyIcon name="lucide:bell" size={20} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
      <button className="lm-iconbtn" aria-label="Messages">
        <DSL.IconifyIcon name="lucide:message-circle" size={20} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
    </header>);

}

function LMSearch() {
  return (
    <div className="lm-search">
      <DSL.Icon name="search" size={21} color="var(--gray-450)" />
      <input type="text" placeholder="Search courses, topics, instructors…" aria-label="Search courses" />
      <DSL.IconifyIcon name="lucide:sliders-horizontal" size={21} color="var(--gray-500)" />
    </div>);

}

function LMCurrent() {
  return (
    <div className="lm-current">
      <div className="lbl">Current course</div>
      <div className="lm-current-row" style={{ gap: "65px" }}>
        <div>
          <div className="ttl">8D Lip Design</div>
          <div className="ins">with Dr. Tim Pearce</div>
        </div>
        <button className="lm-continue" onClick={() => goL("MyLearning.html")}>Continue<DSL.IconifyIcon name="lucide:arrow-right" size={18} color="#fff" /></button>
      </div>
      <div className="lm-current-meta"><span className="l">Lesson 6 of 12</span><span className="p">68%</span></div>
      <div className="lm-bar"><span style={{ width: "68%" }} /></div>
    </div>);

}

function LMCats() {
  const [active, setActive] = useStateL("All");
  return (
    <div>
      <div className="lm-sec-h"><h2>Categories</h2></div>
      <div className="lm-cats" role="tablist" aria-label="Course categories">
        {LM_CATS.map((c) =>
        <button key={c} role="tab" aria-selected={active === c} className={"lm-cat" + (active === c ? " on" : "")} onClick={() => setActive(c)}>{c}</button>
        )}
      </div>
    </div>);

}

function MyCourses({ loading }) {
  return (
    <section>
      <div className="lm-sec-h"><h2>My Courses</h2><a href="#" onClick={(e) => {e.preventDefault();goL("MyLearning.html");}} style={{ color: "rgb(41, 37, 105)" }}>View all</a></div>
      <div className="lm-rail">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <LMSkeletonCourse key={i} />)
          : LM_MINE.map((c, i) =>
          <article className="lm-mc" key={i}>
              <div className="lm-mc-img" style={{ background: c.grad }}><span className="lm-mc-dur">{c.dur}</span></div>
              <div className="lm-mc-body">
                <div className="lm-mc-ttl">{c.title}</div>
                <div className="lm-rate"><DSL.IconifyIcon name="fluent:star-16-filled" size={17} color="var(--premium-gold)" />{c.rating} <span className="rv">({c.reviews})</span></div>
                <div className="ins">{c.instr}</div>
                <div className="lm-bar gold"><span style={{ width: c.pct + "%" }} /></div>
                <div className="pct">{c.pct}% complete</div>
              </div>
            </article>
          )}
      </div>
    </section>);
}

function Recommended({ loading }) {
  return (
    <section>
      <div className="lm-sec-h"><h2>Recommended For You</h2><a href="#" onClick={(e) => {e.preventDefault();goL("MyLearning.html");}} style={{ color: "rgb(41, 37, 105)" }}>See all</a></div>
      <div className="lm-rail" style={{ padding: "0px 24px", justifyContent: "flex-start" }}>
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <LMSkeletonRec key={i} />)
          : LM_REC.map((c, i) =>
          <article className="lm-rc" key={i}>
              <div className="lm-rc-img" style={{ background: c.grad }}><span className="lm-rc-cat">{c.cat}</span></div>
              <div className="lm-rc-body">
                <div className="lm-rc-ttl">{c.title}</div>
                <div className="lm-rc-row">
                  <div className="lm-rate"><DSL.IconifyIcon name="fluent:star-16-filled" size={17} color="var(--premium-gold)" />{c.rating}</div>
                  <div className="lm-rc-price">{c.price}</div>
                </div>
                <div className="lm-rc-enr"><DSL.IconifyIcon name="lucide:users" size={17} color="var(--gray-450)" />{c.enrolled}</div>
                <button className="lm-enroll" onClick={() => goL("MyLearning.html")}>Enroll<DSL.IconifyIcon name="lucide:arrow-right" size={17} color="#fff" /></button>
              </div>
            </article>
          )}
      </div>
    </section>);
}

function FreeCourses() {
  return (
    <section>
      <div className="lm-sec-h"><h2>Free Courses</h2><a className="muted" href="#" onClick={(e) => e.preventDefault()}>See all</a></div>
      <div className="lm-free">
        <div className="lm-free-ghosts">
          <div className="lm-ghost a"><span className="free">Free</span></div>
          <div className="lm-ghost b"><span className="free">Free</span></div>
        </div>
        <div className="lm-unlock" style={{ padding: "12px" }}>
          <span className="lock"><DSL.IconifyIcon name="lucide:lock" size={22} color="var(--brand-navy)" /></span>
          <div className="uc">
            <div className="ut" style={{ fontSize: "14px", fontWeight: "600" }}>Complete your profile to unlock</div>
            <div className="us" style={{ fontSize: "12px" }}>Take a quick onboarding quiz to get free access to all courses</div>
          </div>
          <button className="lm-quiz" onClick={() => goL("ProfileMobile.html")} aria-label="Start Questionnaire" style={{ width: "24px", height: "24px" }}><DSL.IconifyIcon name="lucide:arrow-right" size={20} color="#fff" /></button>
        </div>
      </div>
    </section>);

}

function LMSkeletonCourse() {
  return (
    <article className="lm-mc">
      <div className="lm-skel" style={{ height: 132 }} />
      <div className="lm-mc-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="lm-skel" style={{ height: 20, width: "85%", borderRadius: "var(--r-sm)" }} />
        <div className="lm-skel" style={{ height: 14, width: "50%", borderRadius: "var(--r-sm)" }} />
        <div className="lm-skel" style={{ height: 13, width: "60%", borderRadius: "var(--r-sm)" }} />
        <div className="lm-skel" style={{ height: 8, width: "100%", borderRadius: "var(--r-pill)", marginTop: 6 }} />
        <div className="lm-skel" style={{ height: 13, width: "40%", borderRadius: "var(--r-sm)" }} />
      </div>
    </article>
  );
}
function LMSkeletonRec() {
  return (
    <article className="lm-rc">
      <div className="lm-skel" style={{ height: 188 }} />
      <div className="lm-rc-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="lm-skel" style={{ height: 20, width: "85%", borderRadius: "var(--r-sm)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <div className="lm-skel" style={{ height: 16, width: 60, borderRadius: "var(--r-sm)" }} />
          <div className="lm-skel" style={{ height: 16, width: 60, borderRadius: "var(--r-sm)" }} />
        </div>
        <div className="lm-skel" style={{ height: 14, width: "60%", borderRadius: "var(--r-sm)" }} />
        <div className="lm-skel" style={{ height: 42, width: 110, borderRadius: "var(--r-md)", marginTop: 4 }} />
      </div>
    </article>
  );
}
function LMTabBar() {
  return (
    <nav className="lm-tabs" aria-label="Primary">
      {LM_TABS.map((t) =>
      <button key={t.key} className={"lm-tab" + (t.key === "Learning" ? " on" : "")}
      aria-current={t.key === "Learning" ? "page" : undefined} onClick={() => t.href && goL(t.href)}>
          <span className="ic">
            <DSL.IconifyIcon name={t.icon} size={24} color={t.key === "Learning" ? "var(--brand-navy)" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          {t.label}
        </button>
      )}
    </nav>);

}

function LearningHome() {
  const [loading, setLoading] = useStateL(true);
  useEffectL(() => { const t = setTimeout(() => setLoading(false), 1800); return () => clearTimeout(t); }, []);

  return (
    <div className="lm-screen" data-screen-label="My Learning (mobile)">
      <LMHeader />
      <LMSearch />
      <div className="lm-scroll">
        <LMCurrent />
        <LMCats />
        <MyCourses loading={loading} />
        <Recommended loading={loading} />
        <FreeCourses />
        <div style={{ height: 20 }} />
      </div>
      <LMTabBar />
    </div>);
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
