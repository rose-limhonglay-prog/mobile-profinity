/* ===========================================================================
   PROfinity — Community (Confidence channel) · iPhone 17 Pro Max mobile
   Reuses the shared Feed (window.PFApp.Feed) inside the IOSDevice frame, with
   the community top bar, channel header, composer and bottom tab bar. Tapping a
   post's comment opens the slide-up Comments sheet (PF_COMMENT_SHEET).
   Shares one global scope with app.jsx, so names here are suffixed -CM.
   =========================================================================== */
const DSCM = window.ProfinityDesignSystem_c2b5cc;
const PFACM = window.PFApp;

function goCM(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleCM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setCMScale] = React.useState(calc);
  React.useEffect(() => {
    const update = () => setCMScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileCM() {
  const [mobile, setCM] = React.useState(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setCM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const CM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: null },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "Agent.html" }];


function CMTopBar() {
  return (
    <header className="cm-top">
      <button className="cm-burger" aria-label="Menu"><DSCM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      <span className="grow" />
      <button className="cm-iconbtn" aria-label="Search"><DSCM.Icon name="search" size={21} color="var(--brand-navy)" /></button>
      <button className="cm-iconbtn" aria-label="Notifications">
        <DSCM.IconifyIcon name="lucide:bell" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
      <button className="cm-iconbtn" aria-label="Messages">
        <DSCM.IconifyIcon name="lucide:message-circle" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
    </header>);

}

const CM_CHANNELS = ["Confidence", "Clinical Chat", "Freedom Path", "Tech Team", "Business & Mindset"];

function CMHeader() {
  const [following, setFollowing] = React.useState(false);
  const [channel, setChannel] = React.useState("Confidence");
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return (
    <div className="cm-head">
      <div className="cm-chsel">
        <button type="button" className="ch cm-chbtn" aria-haspopup="listbox" aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
          {channel}
          <DSCM.IconifyIcon name="lucide:chevron-down" size={20} color="var(--brand-navy)"
            className={"cm-chchev" + (open ? " open" : "")} />
        </button>
        {open &&
        <div className="cm-chmenu" role="listbox" onClick={(e) => e.stopPropagation()}>
            {CM_CHANNELS.map((c) =>
          <button key={c} role="option" aria-selected={c === channel}
          className={"cm-chitem" + (c === channel ? " on" : "")}
          onClick={() => { setChannel(c); setOpen(false); }}>
                {c}
                {c === channel && <DSCM.IconifyIcon name="lucide:check" size={17} color="var(--brand-navy)" />}
              </button>
          )}
          </div>
        }
      </div>
      <button type="button" className={"cm-follow" + (following ? " on" : "")}
      onClick={() => setFollowing((f) => !f)}>
        {following ? "Following" : "Follow"}
        {following && <DSCM.IconifyIcon name="lucide:check" size={16} color="var(--gray-450)" />}
      </button>
    </div>);

}

function CMComposer() {
  return (
    <div className="cm-compose">
      <DSCM.Avatar name={PFACM.ME.name} src={PFACM.ME.avatar} size={40} />
      <div className="pill">Share something…</div>
      <button className="imgbtn" aria-label="Add photo"><DSCM.IconifyIcon name="lucide:image" size={21} color="var(--brand-navy)" /></button>
    </div>);

}

function CMTabBar() {
  return (
    <nav className="cm-tabs" aria-label="Primary">
      {CM_TABS.map((t) =>
      <button key={t.key} className={"cm-tab" + (t.key === "Community" ? " on" : "")}
      aria-current={t.key === "Community" ? "page" : undefined}
      onClick={() => t.href && goCM(t.href)}>
          <span className="ic">
            <DSCM.IconifyIcon name={t.icon} size={23} color={t.key === "Community" ? "var(--brand-navy)" : "var(--gray-450)"} />
          </span>
          {t.label}
        </button>
      )}
    </nav>);

}

function CMScreen({ scrollRef, newPosts, dismiss }) {
  return (
    <div className="cm-screen" data-screen-label="Community (mobile)">
      <CMTopBar />
      <CMHeader />
      <CMComposer />
      <div className="cm-scroll" ref={scrollRef}>
        {newPosts > 0 &&
        <button type="button" className="cm-newposts" onClick={dismiss}
        aria-label={newPosts + " new posts, tap to see them"}>
            <DSCM.IconifyIcon name="lucide:arrow-up" size={18} color="var(--white)" />
            {newPosts} New Posts
          </button>
        }
        <PFACM.Feed />
        <div className="cm-end">End of newsfeed</div>
      </div>
      <CMTabBar />
    </div>);
}

function CommunityMobileApp() {
  const mobile = useIsMobileCM();
  const [newPosts, setNewPosts] = React.useState(3);
  const scrollRef = React.useRef(null);
  const dismiss = () => {
    const s = scrollRef.current;
    if (s) s.scrollTo({ top: 0, behavior: "smooth" });
    setNewPosts(0);
  };
  const scale = useDeviceScaleCM();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  const screen = <CMScreen scrollRef={scrollRef} newPosts={newPosts} dismiss={dismiss} />;
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}>{screen}</div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(216, 218, 226)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}>{screen}</IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CommunityMobileApp />);
