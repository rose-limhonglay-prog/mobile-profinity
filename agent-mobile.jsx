/* ===========================================================================
   PROfinity — Agents (mobile) · iPhone 17 Pro Max
   Shares the MobileChromeC header/drawer/notifications/messages with the rest
   of the mobile app. Content = the same editorial catalogue as Agent.html
   (agents-ui.jsx + agents-data.js) laid out as a single column: header,
   two "available now" spotlights, filter chips, card list, how-it-works,
   suggest-an-agent. Suffixed -AG to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateAG, useEffect: useEffectAG, useRef: useRefAG, useMemo: useMemoAG } = React;
const DSAG = window.ProfinityDesignSystem_c2b5cc;
const MobileChromeC = window.MobileChromeC;
const PFA_M = window.PFAgents;
const UIM = window.PFAgentsUI;

function goAG(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

const AG_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Agents", icon: "lucide:sparkles", href: null },
{ key: "Rewards", label: "Rewards", icon: "lucide:gift", href: "RewardsDashboard.html" }];

function AgTabBar({ compact }) {
  return (
    <nav className={"ag-tabs" + (compact ? " ag-tabs-compact" : "")} aria-label="Primary">
      {AG_TABS.map((t) =>
      <button key={t.key} className={"ag-tab" + (t.key === "Agent" ? " on" : "")}
      aria-current={t.key === "Agent" ? "page" : undefined} onClick={() => t.href && goAG(t.href)}>
          <span className="ic">
            <DSAG.IconifyIcon name={t.icon} size={20} color={t.key === "Agent" ? "#fff" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          <span className="lbl">{t.label}</span>
        </button>
      )}
    </nav>);
}

/* Order: Ava, Minute Taker, Assess Pro, then the rest (user, 2026-09-29) */
function orderAgentsAG(agents) {
  const FIRST = ["coach", "minutes", "assess-pro"];
  const head = FIRST.map((id) => agents.find((a) => a.id === id)).filter(Boolean);
  return head.concat(agents.filter((a) => FIRST.indexOf(a.id) === -1));
}

function AgentHome() {
  const scrollRef = useRefAG(null);
  const { hidden: chromeHidden, floating: chromeFloat } = window.PFUseHeaderHideC(scrollRef);
  const wl = UIM.useWaitlistAX();
  const toast = UIM.useToastAX();
  const [detail, setDetail] = useStateAG(null);

  const agents = PFA_M.AGENTS;
  const list = orderAgentsAG(agents);
  const open = (agent, mode) => setDetail({ agent, mode: mode || "info" });

  useEffectAG(() => {
    const h = (e) => {
      const ids = (e.detail && e.detail.ids) || [];
      const last = ids[ids.length - 1];
      if (last && wl.ids.indexOf(last) === -1) { const a = PFA_M.byId(last); if (a) toast.show("We'll email you the day " + a.name + " goes live."); }
    };
    window.addEventListener("pf:agent-waitlist", h);
    return () => window.removeEventListener("pf:agent-waitlist", h);
  }, [wl.ids]);

  return (
    <div className={"ag-screen agx" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : "")} data-screen-label="Profinity Agents (mobile)">
      <MobileChromeC />
      <div className="ag-scroll" ref={scrollRef}>
        <header className="ag-head">
          <span className="agx-eyebrow">Profinity Agents</span>
          <h1 className="agx-h1">Your clinic's <em>AI team.</em></h1>
          <p className="agx-lede">Assistants that answer the phone, reply to patients, write the plans and read the numbers. Three are live today.</p>
        </header>

        <section className="ag-cat" aria-label="All agents">
          <div className="ag-list">
            {list.map((a) => <UIM.AgentCardAX key={a.id} agent={a} wl={wl} onOpen={open} mobile />)}
          </div>
        </section>

        <div className="ag-how"><UIM.HowItWorks mobile /></div>
        <div className="ag-request"><UIM.RequestCard mobile /></div>
        <div style={{ height: 24 }} />
      </div>
      <AgTabBar compact={chromeHidden} />
      <UIM.AgentDetail agent={detail && detail.agent} mode={detail && detail.mode} wl={wl} onClose={() => setDetail(null)} mobile />
      {toast.node}
    </div>);
}

function useDeviceScaleAG() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateAG(calc);
  useEffectAG(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileAG() {
  const [mobile, setMobile] = useStateAG(() => window.matchMedia('(max-width:768px)').matches);
  useEffectAG(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function AgentMobileApp() {
  const mobile = useIsMobileAG();
  const scale = useDeviceScaleAG();
  const vars = { "--action-primary": "var(--ai-purple)", "--action-primary-hover": "var(--ai-purple-600)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><AgentHome /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><AgentHome /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AgentMobileApp />);
