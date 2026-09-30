/* ===========================================================================
   PROfinity — Agents (mobile) · iPhone 17 Pro Max
   Shares the MobileChromeC header/drawer/notifications/messages with the rest
   of the mobile app. Content = the same editorial catalogue as Agent.html
   (agents-ui.jsx + agents-data.js) laid out as a single column: header,
   two "available now" spotlights, filter chips, card list, how-it-works,
   suggest-an-agent. Suffixed -AG to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateAG,
  useEffect: useEffectAG,
  useRef: useRefAG,
  useMemo: useMemoAG
} = React;
const DSAG = window.ProfinityDesignSystem_c2b5cc;
const MobileChromeC = window.MobileChromeC;
const PFA_M = window.PFAgents;
const UIM = window.PFAgentsUI;
function goAG(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const AG_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: "NewsfeedMobile.html"
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Learning",
  label: "Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Agent",
  label: "Agents",
  icon: "lucide:sparkles",
  href: null
}, {
  key: "Rewards",
  label: "Rewards",
  icon: "lucide:gift",
  href: "RewardsDashboard.html"
}];
function AgTabBar({
  compact
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "ag-tabs" + (compact ? " ag-tabs-compact" : ""),
    "aria-label": "Primary"
  }, AG_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "ag-tab" + (t.key === "Agent" ? " on" : ""),
    "aria-current": t.key === "Agent" ? "page" : undefined,
    onClick: () => t.href && goAG(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSAG.IconifyIcon, {
    name: t.icon,
    size: 20,
    color: t.key === "Agent" ? "#fff" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
}

/* Order: Ava, Minute Taker, Assess Pro, then the rest (user, 2026-09-29) */
function orderAgentsAG(agents) {
  const FIRST = ["coach", "minutes", "assess-pro"];
  const head = FIRST.map(id => agents.find(a => a.id === id)).filter(Boolean);
  return head.concat(agents.filter(a => FIRST.indexOf(a.id) === -1));
}
function AgentHome() {
  const scrollRef = useRefAG(null);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = window.PFUseHeaderHideC(scrollRef);
  const wl = UIM.useWaitlistAX();
  const toast = UIM.useToastAX();
  const [detail, setDetail] = useStateAG(null);
  const agents = PFA_M.AGENTS;
  const list = orderAgentsAG(agents);
  const open = (agent, mode) => setDetail({
    agent,
    mode: mode || "info"
  });
  useEffectAG(() => {
    const h = e => {
      const ids = e.detail && e.detail.ids || [];
      const last = ids[ids.length - 1];
      if (last && wl.ids.indexOf(last) === -1) {
        const a = PFA_M.byId(last);
        if (a) toast.show("We'll email you the day " + a.name + " goes live.");
      }
    };
    window.addEventListener("pf:agent-waitlist", h);
    return () => window.removeEventListener("pf:agent-waitlist", h);
  }, [wl.ids]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ag-screen agx" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "Profinity Agents (mobile)"
  }, /*#__PURE__*/React.createElement(MobileChromeC, null), /*#__PURE__*/React.createElement("div", {
    className: "ag-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("header", {
    className: "ag-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agx-eyebrow"
  }, "Profinity Agents"), /*#__PURE__*/React.createElement("h1", {
    className: "agx-h1"
  }, "Your clinic's ", /*#__PURE__*/React.createElement("em", null, "AI team.")), /*#__PURE__*/React.createElement("p", {
    className: "agx-lede"
  }, "Assistants that answer the phone, reply to patients, write the plans and read the numbers. Three are live today.")), /*#__PURE__*/React.createElement("section", {
    className: "ag-cat",
    "aria-label": "All agents"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ag-list"
  }, list.map(a => /*#__PURE__*/React.createElement(UIM.AgentCardAX, {
    key: a.id,
    agent: a,
    wl: wl,
    onOpen: open,
    mobile: true
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ag-how"
  }, /*#__PURE__*/React.createElement(UIM.HowItWorks, {
    mobile: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "ag-request"
  }, /*#__PURE__*/React.createElement(UIM.RequestCard, {
    mobile: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), /*#__PURE__*/React.createElement(AgTabBar, {
    compact: chromeHidden
  }), /*#__PURE__*/React.createElement(UIM.AgentDetail, {
    agent: detail && detail.agent,
    mode: detail && detail.mode,
    wl: wl,
    onClose: () => setDetail(null),
    mobile: true
  }), toast.node);
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
  const vars = {
    "--action-primary": "var(--ai-purple)",
    "--action-primary-hover": "var(--ai-purple-600)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(AgentHome, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(AgentHome, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AgentMobileApp, null));
