/* ===========================================================================
   PROfinity — My Learning (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -L to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateL, useEffect: useEffectL } = React;
const DSL = window.ProfinityDesignSystem_c2b5cc;
const MobileChromeC = window.MobileChromeC;
const SurveyMobile = window.SurveyMobile;

function goL(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

const LM_STATUS_BAR_H = 52; // matches .m-top's status-bar/notch clearance

const LM_MINE = [
{ title: "Advanced Lip Techniques", dur: "4h 12m", rating: "4.8", reviews: "1,240", instr: "Dr. Tim Pearce", pct: 68, grad: "linear-gradient(140deg,#6172f3 0%,#3b82f6 100%)" },
{ title: "Temple Filler", dur: "2h 45m", rating: "4.7", reviews: "820", instr: "Dr. Tim Pearce", pct: 45, grad: "linear-gradient(140deg,#f59e0b 0%,#f0617a 100%)" }];


const LM_REC = [
{ title: "Toxin Battle with Julie Bass Kaplan", slug: "toxin-battle", cat: "Masterclass", rating: "4.9", price: "REPLAY", enrolled: "2h 36m replay", grad: "linear-gradient(150deg,#1a1550 0%,#292569 45%,#7c2d3f 100%)" },
{ title: "Facial Anatomy for Artists", cat: "Design", rating: "4.9", price: "£ 129", enrolled: "12.4k enrolled", grad: "linear-gradient(140deg,#0fb6a3 0%,#28d3a0 100%)" },
{ title: "Marketing Strategy Foundations", cat: "Business", rating: "4.8", price: "£ 99", enrolled: "8.1k enrolled", grad: "linear-gradient(140deg,#a855f7 0%,#d946ef 100%)" }];


const LM_FREE = [
{ title: "13 Risky Injection Areas", dur: "1h 20m", instr: "Dr. Tim Pearce", grad: "linear-gradient(140deg,#0fb6a3 0%,#28d3a0 100%)" },
{ title: "Bruising Checklist", dur: "45m", instr: "Dr. Tim Pearce", grad: "linear-gradient(140deg,#f59e0b 0%,#f0617a 100%)" }];

function lmCourseUrl(c) {
  if (c.slug) return "CourseDetail.html?course=" + c.slug;
  const p = new URLSearchParams({ title: c.title, instr: c.instr || "Dr. Tim Pearce", dur: c.dur || "45m", grad: c.grad || "", pct: c.pct || 0 });
  return "CourseDetail.html?" + p.toString();
}

function lmPriceValue(price) {
  const n = parseInt(String(price || "").replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function lmCheckoutUrl(c) {
  const p = new URLSearchParams({ title: c.title, instr: c.instr || "Dr. Tim Pearce", grad: c.grad || "", price: lmPriceValue(c.price) });
  if (c.slug) p.set("course", c.slug);
  return "CourseCheckout.html?" + p.toString();
}

function lmEnrollUrl(c) {
  return c.price === "REPLAY" ? lmCourseUrl(c) : lmCheckoutUrl(c);
}

const LM_MEMBERSHIP = [
{ icon: "lucide:graduation-cap", iconBg: "#E8F5E9", iconColor: "#2E7D32", label: "Foundation Courses", sub: "8 courses", href: "MyLearning.html" },
{ icon: "lucide:play-circle",    iconBg: "#EDE7F6", iconColor: "#7B1FA2", label: "Live Masterclasses",  sub: "5 replays", href: "CourseDetail.html?course=toxin-battle" },
{ icon: "lucide:file-text",      iconBg: "#FFF3E0", iconColor: "#CE9957", label: "Protocols & Guides",  sub: "12 files", href: "MyLearning.html" },
{ icon: "lucide:users",          iconBg: "#E3F2FD", iconColor: "#1565C0", label: "Confidence Channel",  sub: "Community", href: "MyLearning.html" }];

const LM_COACH_ACTIONS = [
{ label: "Build my study plan", reply: "On it — I'll map out a study plan for this week around finishing 8D Lip Design and starting Facial Anatomy for Artists next." },
{ label: "What should I learn next?", reply: "You're 68% through 8D Lip Design, so I'd wrap that up first, then move into Facial Anatomy for Artists to round out your technique." },
{ label: "Explain my confidence score", reply: "Your confidence score blends quiz accuracy, course completion, and practical assessments. Finishing your current course is the fastest way to raise it." }];


const LM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: null },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "AgentMobile.html" }];


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

function useHeaderHideL(scrollRef) {
  const [hidden, setHidden] = useStateL(false);
  useEffectL(() => {
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

function LMGreeting() {
  return (
    <div className="lm-greeting">
      <div>
        <div className="lm-greeting-hi">Good morning,</div>
        <h1 className="lm-greeting-name">Katy!</h1>
      </div>
      <div className="lm-greeting-right">
        <button className="lm-mysave" onClick={() => goL("MySaved.html?from=learning")}>
          <DSL.IconifyIcon name="lucide:bookmark" size={18} color="var(--brand-navy)" />
          My Save
        </button>
      </div>
    </div>);
}

function LMSearch({ autoFocus, collapsible, onCollapse }) {
  const inputRef = React.useRef(null);
  useEffectL(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);
  return (
    <div className="lm-search">
      <DSL.Icon name="search" size={21} color="var(--gray-450)" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search courses, topics, instructors…"
        aria-label="Search courses"
        onBlur={(e) => { if (collapsible && !e.target.value) onCollapse && onCollapse(); }} />

      <DSL.IconifyIcon name="lucide:sliders-horizontal" size={21} color="var(--gray-500)" />
    </div>);

}

function LMSearchFab({ onClick }) {
  return (
    <button className="lm-search-fab" aria-label="Open search" onClick={onClick}>
      <DSL.Icon name="search" size={20} color="var(--gray-500)" />
    </button>);

}

function LMCurrent() {
  const url = lmCourseUrl({ title: "8D Lip Design", instr: "Dr. Tim Pearce", dur: "4h 30m", pct: 68 });
  return (
    <div className="lm-current" role="button" tabIndex={0} onClick={() => goL(url)} onKeyDown={(e) => { if (e.key === "Enter") goL(url); }} style={{ cursor: "pointer" }}>
      <div className="lbl">Current course</div>
      <div className="lm-current-row" style={{ gap: "65px" }}>
        <div>
          <div className="ttl">8D Lip Design</div>
          <div className="ins">with Dr. Tim Pearce</div>
        </div>
        <button className="lm-continue" onClick={(e) => { e.stopPropagation(); goL(url); }}>Continue<DSL.IconifyIcon name="lucide:arrow-right" size={18} color="#fff" /></button>
      </div>
      <div className="lm-current-meta"><span className="l">Lesson 6 of 12</span><span className="p">68%</span></div>
      <div className="lm-bar"><span style={{ width: "68%" }} /></div>
    </div>);

}

function YourMembership({ onOpen }) {
  return (
    <section className="lm-mem-section">
      <button className="lm-mem-simple" onClick={onOpen}>
        <span className="lm-mem-tier">
          <DSL.IconifyIcon name="fluent:crown-16-filled" size={15} color="#fff" />
          Confidence Path
        </span>
        <span className="lm-mem-simple-text">Your Membership <b>Active</b></span>
        <DSL.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
      </button>
    </section>);
}

function MembershipModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="lm-mem-overlay" role="dialog" aria-modal="true" aria-label="Your Membership" onClick={onClose}>
      <div className="lm-mem-card" onClick={(e) => e.stopPropagation()}>
        <div className="lm-mem-top">
          <span className="lm-mem-tier">
            <DSL.IconifyIcon name="fluent:crown-16-filled" size={15} color="#fff" />
            Confidence Path
          </span>
          <span className="lm-mem-active">
            <span className="lm-mem-dot" />
            Active
          </span>
        </div>
        <p className="lm-mem-desc">Jump straight into everything included in your plan.</p>
        <div className="lm-mem-rows">
          {LM_MEMBERSHIP.map((item, i) =>
            <button key={i} className="lm-mem-row" onClick={() => goL(item.href)}>
              <span className="lm-mem-icon" style={{ background: item.iconBg }}>
                <DSL.IconifyIcon name={item.icon} size={22} color={item.iconColor} />
              </span>
              <span className="lm-mem-info">
                <span className="lm-mem-label">{item.label}</span>
                <span className="lm-mem-sub">{item.sub}</span>
              </span>
              <DSL.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
            </button>
          )}
        </div>
      </div>
    </div>);
}

function AICoachFab({ onClick, bottom }) {
  return (
    <button className="lm-coach-fab" style={{ bottom }} onClick={onClick}>
      <span className="lm-coach-fab-ic"><DSL.IconifyIcon name="lucide:sparkles" size={15} color="var(--ai-purple)" /></span>
      AI Coach
    </button>);
}

function AICoachModal({ open, onClose }) {
  const [messages, setMessages] = useStateL([
  { role: "coach", text: "Hi Katy! \u{1F44B} Based on your progress in 8D Lip Design, want me to build a study plan for this week?" }]);

  const [input, setInput] = useStateL("");
  const bodyRef = React.useRef(null);
  const [rendered, setRendered] = useStateL(open);
  const [closing, setClosing] = useStateL(false);

  useEffectL(() => {
    if (open) {
      setMessages([{ role: "coach", text: "Hi Katy! \u{1F44B} Based on your progress in 8D Lip Design, want me to build a study plan for this week?" }]);
      setInput("");
      setClosing(false);
      setRendered(true);
    } else if (rendered) {
      setClosing(true);
      const t = setTimeout(() => { setRendered(false); setClosing(false); }, 260);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffectL(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function sendMessage(text, reply) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "me", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "coach", text: reply || "Thanks for asking! Try one of the quick actions above, or check back soon as I learn more." }]);
    }, 500);
  }

  if (!rendered) return null;
  return (
    <div className={"lm-coach-overlay" + (closing ? " lm-coach-overlay-closing" : "")} role="dialog" aria-modal="true" aria-label="Profinity Coach" onClick={onClose}>
      <div className={"lm-coach-card" + (closing ? " lm-coach-card-closing" : "")} onClick={(e) => e.stopPropagation()}>
        <div className="lm-coach-head">
          <span className="lm-coach-avatar"><DSL.IconifyIcon name="lucide:sparkles" size={22} color="var(--ai-purple)" /></span>
          <div className="lm-coach-title-wrap">
            <div className="lm-coach-title">Profinity Coach</div>
            <div className="lm-coach-sub">Your learning companion</div>
          </div>
          <button className="lm-coach-x" aria-label="Close" onClick={onClose}><DSL.IconifyIcon name="lucide:x" size={18} color="var(--gray-600)" /></button>
        </div>
        <div className="lm-coach-body" ref={bodyRef}>
          {messages.map((m, i) =>
          <div className={"lm-coach-msg" + (m.role === "me" ? " me" : "")} key={i}>{m.text}</div>
          )}
          {messages.length === 1 &&
          <div className="lm-coach-actions">
              {LM_COACH_ACTIONS.map((a, i) =>
            <button key={i} className="lm-coach-action" onClick={() => sendMessage(a.label, a.reply)}>{a.label}</button>
            )}
            </div>}
        </div>
        <div className="lm-coach-input-row">
          <input
            className="lm-coach-input"
            type="text"
            placeholder="Ask your coach anything…"
            aria-label="Ask your coach anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }} />

          <button className="lm-coach-send" aria-label="Send" disabled={!input.trim()} onClick={() => sendMessage(input)}>
            <DSL.IconifyIcon name="lucide:arrow-up" size={19} color="#fff" />
          </button>
        </div>
        <div className="lm-coach-disclaimer">AI can make mistakes. Verify important outputs.</div>
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
          <article className="lm-mc" key={i} role="button" tabIndex={0} onClick={() => goL(lmCourseUrl(c))} onKeyDown={(e) => { if (e.key === "Enter") goL(lmCourseUrl(c)); }} style={{ cursor: "pointer" }}>
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
          <article className="lm-rc" key={i} role="button" tabIndex={0} onClick={() => goL(lmCourseUrl(c))} onKeyDown={(e) => { if (e.key === "Enter") goL(lmCourseUrl(c)); }} style={{ cursor: "pointer" }}>
              <div className="lm-rc-img" style={{ background: c.grad }}><span className="lm-rc-cat">{c.cat}</span></div>
              <div className="lm-rc-body">
                <div className="lm-rc-ttl">{c.title}</div>
                <div className="lm-rc-row">
                  <div className="lm-rate"><DSL.IconifyIcon name="fluent:star-16-filled" size={17} color="var(--premium-gold)" />{c.rating}</div>
                  <div className="lm-rc-price">{c.price}</div>
                </div>
                <div className="lm-rc-enr"><DSL.IconifyIcon name="lucide:users" size={17} color="var(--gray-450)" />{c.enrolled}</div>
                <button className="lm-enroll" onClick={(e) => { e.stopPropagation(); goL(lmEnrollUrl(c)); }}>Enroll<DSL.IconifyIcon name="lucide:arrow-right" size={17} color="#fff" /></button>
              </div>
            </article>
          )}
      </div>
    </section>);
}

function FreeCourses({ onQuiz, unlocked }) {
  return (
    <section>
      <div className="lm-sec-h"><h2>Free Courses</h2><a className="muted" href="#" onClick={(e) => e.preventDefault()}>See all</a></div>
      {unlocked ? (
        <div className="lm-rail">
          {LM_FREE.map((c, i) =>
            <article className="lm-mc" key={i} role="button" tabIndex={0} onClick={() => goL(lmCourseUrl(c))} onKeyDown={(e) => { if (e.key === "Enter") goL(lmCourseUrl(c)); }} style={{ cursor: "pointer" }}>
              <div className="lm-mc-img" style={{ background: c.grad }}>
                <span className="lm-mc-dur">{c.dur}</span>
                <span className="lm-free-badge">Free</span>
              </div>
              <div className="lm-mc-body">
                <div className="lm-mc-ttl">{c.title}</div>
                <div className="ins">{c.instr}</div>
                <button className="lm-enroll" style={{ marginTop: 14 }} onClick={(e) => { e.stopPropagation(); goL(lmCourseUrl(c)); }}>
                  Start<DSL.IconifyIcon name="lucide:arrow-right" size={17} color="#fff" />
                </button>
              </div>
            </article>
          )}
        </div>
      ) : (
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
            <button className="lm-quiz" onClick={onQuiz} aria-label="Start Questionnaire" style={{ width: "24px", height: "24px" }}><DSL.IconifyIcon name="lucide:arrow-right" size={20} color="#fff" /></button>
          </div>
        </div>
      )}
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
const LMTabBar = React.forwardRef(function LMTabBar({ compact }, ref) {
  return (
    <nav ref={ref} className={"lm-tabs" + (compact ? " lm-tabs-compact" : "")} aria-label="Primary">
      {LM_TABS.map((t) =>
      <button key={t.key} className={"lm-tab" + (t.key === "Learning" ? " on" : "")}
      aria-current={t.key === "Learning" ? "page" : undefined} onClick={() => t.href && goL(t.href)}>
          <span className="ic">
            <DSL.IconifyIcon name={t.icon} size={20} color={t.key === "Learning" ? "#fff" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          <span className="lbl">{t.label}</span>
        </button>
      )}
    </nav>);

});

function LearningHome() {
  const [loading, setLoading] = useStateL(true);
  const [surveyOpen, setSurveyOpen] = useStateL(false);
  const [membershipOpen, setMembershipOpen] = useStateL(false);
  const [coachOpen, setCoachOpen] = useStateL(false);
  const [coursesUnlocked, setCoursesUnlocked] = useStateL(false);
  useEffectL(() => { const t = setTimeout(() => setLoading(false), 1800); return () => clearTimeout(t); }, []);

  const scrollRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const tabsRef = React.useRef(null);
  const [headerH, setHeaderH] = useStateL(0);
  const [searchH, setSearchH] = useStateL(0);
  const [tabsH, setTabsH] = useStateL(0);
  const chromeHidden = useHeaderHideL(scrollRef);
  const [searchOpen, setSearchOpen] = useStateL(false);
  React.useEffect(() => {
    if (!chromeHidden) setSearchOpen(false);
  }, [chromeHidden]);
  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const el = searchRef.current;
    if (!el) return;
    const measure = () => setSearchH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const measure = () => setTabsH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleSurveyComplete() {
    setCoursesUnlocked(true);
    setSurveyOpen(false);
  }

  return (
    <div className="lm-screen" data-screen-label="My Learning (mobile)">
      <div ref={headerRef} className={"lm-header-wrap" + (chromeHidden ? " lm-header-hidden" : "")}>
        <MobileChromeC />
        <LMGreeting />
      </div>
      <div ref={searchRef} className={"lm-search-wrap" + (chromeHidden && !searchOpen ? " lm-search-collapsed" : "")} style={{ top: chromeHidden ? LM_STATUS_BAR_H : headerH }}>
        {chromeHidden && !searchOpen ?
        <LMSearchFab onClick={() => setSearchOpen(true)} /> :

        <LMSearch autoFocus={chromeHidden && searchOpen} collapsible={chromeHidden} onCollapse={() => setSearchOpen(false)} />
        }
      </div>
      <div className="lm-scroll" ref={scrollRef} style={{ paddingTop: (chromeHidden ? LM_STATUS_BAR_H : headerH) + searchH, paddingBottom: tabsH + 34 }}>
        <LMCurrent />
        <MyCourses loading={loading} />
        <YourMembership onOpen={() => setMembershipOpen(true)} />
        <Recommended loading={loading} />
        <FreeCourses onQuiz={() => setSurveyOpen(true)} unlocked={coursesUnlocked} />
        <div style={{ height: 20 }} />
      </div>
      <AICoachFab bottom={tabsH + 34} onClick={() => setCoachOpen(true)} />
      <LMTabBar ref={tabsRef} compact={chromeHidden} />
      <SurveyMobile open={surveyOpen} onClose={() => setSurveyOpen(false)} onComplete={handleSurveyComplete} />
      <MembershipModal open={membershipOpen} onClose={() => setMembershipOpen(false)} />
      <AICoachModal open={coachOpen} onClose={() => setCoachOpen(false)} />
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
