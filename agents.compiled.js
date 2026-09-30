/* ===========================================================================
   PROfinity Academy — Agents page (web)
   Editorial catalogue of Profinity's AI agents: serif header, two "available
   now" spotlights (Assess Pro + Ava), filterable card grid, how-it-works and a
   suggest-an-agent card. Shared pieces come from agents-ui.jsx (PFAgentsUI)
   and the catalogue from agents-data.js (PFAgents).
   =========================================================================== */
const {
  useState: useStateA,
  useEffect: useEffectA,
  useMemo: useMemoA
} = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav
} = DS;
const PFA_W = window.PFAgents;
const UI = window.PFAgentsUI;
const ME = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function pfTagActiveNav(activeLabel) {
  document.querySelectorAll("#pf-root nav > button").forEach(b => {
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
function navigate(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html"
  }[label];
  if (u) (window.pfGo || function (x) {
    window.location.href = x;
  })(u);
}

/* Order: Ava, Minute Taker, Assess Pro, then the rest (user, 2026-09-29) */
function orderAgents(agents) {
  const FIRST = ["coach", "minutes", "assess-pro"];
  const head = FIRST.map(id => agents.find(a => a.id === id)).filter(Boolean);
  return head.concat(agents.filter(a => FIRST.indexOf(a.id) === -1));
}
function AgentsApp() {
  useEffectA(() => pfTagActiveNav("Agent"));
  const wl = UI.useWaitlistAX();
  const toast = UI.useToastAX();
  const [detail, setDetail] = useStateA(null); // { agent, mode }

  const agents = PFA_W.AGENTS;
  const list = orderAgents(agents);
  const open = (agent, mode) => setDetail({
    agent,
    mode: mode || "info"
  });
  const onJoin = a => toast.show("We'll email you the day " + a.name + " goes live.");

  // waitlist joins anywhere on the page surface a toast
  useEffectA(() => {
    const h = e => {
      const ids = e.detail && e.detail.ids || [];
      const last = ids[ids.length - 1];
      if (last && wl.ids.indexOf(last) === -1) {
        const a = PFA_W.byId(last);
        if (a) onJoin(a);
      }
    };
    window.addEventListener("pf:agent-waitlist", h);
    return () => window.removeEventListener("pf:agent-waitlist", h);
  }, [wl.ids]);
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen agx",
    style: {
      "--action-primary": "var(--ai-purple)",
      "--action-primary-hover": "var(--ai-purple-600)"
    }
  }, /*#__PURE__*/React.createElement(TopNav, {
    active: "Agent",
    user: ME,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigate,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("main", {
    className: "agw-wrap",
    "data-screen-label": "Agents catalogue"
  }, /*#__PURE__*/React.createElement("header", {
    className: "agw-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agw-head-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agx-eyebrow"
  }, "Profinity Agents"), /*#__PURE__*/React.createElement("h1", {
    className: "agx-h1"
  }, "Your clinic's ", /*#__PURE__*/React.createElement("em", null, "AI team.")), /*#__PURE__*/React.createElement("p", {
    className: "agx-lede"
  }, "Specialised assistants that answer the phone, reply to patients, write the plans and read the numbers, so you can stay in the treatment room. Three are live today. The rest are on their way."))), /*#__PURE__*/React.createElement("section", {
    className: "agw-cat",
    "aria-label": "All agents"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agw-grid"
  }, list.map(a => /*#__PURE__*/React.createElement(UI.AgentCardAX, {
    key: a.id,
    agent: a,
    wl: wl,
    onOpen: open
  })))), /*#__PURE__*/React.createElement("div", {
    className: "agw-how"
  }, /*#__PURE__*/React.createElement(UI.HowItWorks, null)), /*#__PURE__*/React.createElement("div", {
    className: "agw-request"
  }, /*#__PURE__*/React.createElement(UI.RequestCard, null))), /*#__PURE__*/React.createElement(UI.AgentDetail, {
    agent: detail && detail.agent,
    mode: detail && detail.mode,
    wl: wl,
    onClose: () => setDetail(null)
  }), toast.node);
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AgentsApp, null));
