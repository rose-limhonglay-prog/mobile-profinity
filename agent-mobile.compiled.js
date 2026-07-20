/* ===========================================================================
   PROfinity — Agents (mobile) · iPhone 17 Pro Max
   Shares the MobileChromeC header/drawer/notifications/messages with the rest
   of the mobile app, adds the AI-purple gradient hero + agent catalogue cards.
   Suffixed -AG to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateAG,
  useEffect: useEffectAG
} = React;
const DSAG = window.ProfinityDesignSystem_c2b5cc;
const MobileChromeC = window.MobileChromeC;
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
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Learning",
  label: "My Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Agent",
  label: "Agent",
  icon: "lucide:sparkles",
  href: null
}];
const AG_AGENTS = [{
  icon: "assets/agent-assesspro.png",
  badge: "Included in Artcodes",
  title: "Assess Pro",
  media: true,
  description: "A cutting-edge tool for detailed facial analysis, emotion recognition, and identity verification. Perfect for security and healthcare."
}, {
  icon: "assets/avatar-drtim.png",
  badge: "Included in Premium",
  title: "Profinity Coach Agent",
  description: "A versatile baseline assistant for general inquiries, scheduling, and basic data retrieval tasks. Perfect for automation."
}, {
  badge: "Included in Premium",
  title: "Lumina Patients Receptionist",
  description: "An intelligent assistant specialised in data visualisation, statistical analysis, and generating insightful reports. Ideal for making informed decisions based on data."
}, {
  badge: "Included in Premium",
  title: "Treatment Plan Generator",
  description: "An advanced tool for optimising schedules, meetings, and reminders. Ideal for users looking to enhance their organisational skills."
}, {
  badge: "Included in Premium",
  title: "Minute Taker",
  description: "An advanced tool for optimising schedules, meetings, and reminders. Ideal for users looking to enhance their organisational skills."
}, {
  icon: "assets/avatar-katy.jpg",
  badge: "Included in Premium",
  title: "Profinity Marketing Assistant",
  description: "An advanced AI tool focused on enhancing creativity for design projects, offering suggestions for layouts, colour palettes, and typography."
}, {
  badge: "Included in Premium",
  title: "AI Phone Receptionist",
  description: "An advanced AI tool designed for comprehensive data interpretation, insightful research, and proactive strategy development. Ideal for seasoned experts seeking data-driven results.",
  waitlisted: true
}, {
  badge: "Included in Premium",
  title: "Finance",
  description: "An intelligent chatbot designed to handle customer inquiries, complaints, and feedback efficiently. Perfect for businesses seeking to improve their customer service."
}];
function AgHero() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ag-hero"
  }, /*#__PURE__*/React.createElement("h1", null, "Profinity Agents"), /*#__PURE__*/React.createElement("p", null, "Manage and activate agents for your profile. Enhance your workflow with specialised AI assistants tailored to your needs."));
}
function AgentCardM({
  a
}) {
  const [waitlisted, setWaitlisted] = useStateAG(!!a.waitlisted);
  return /*#__PURE__*/React.createElement("article", {
    className: "ag-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ag-card-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ag-icon",
    style: {
      background: a.icon ? `center/cover no-repeat url(${a.icon})` : "var(--spark-gradient)"
    }
  }, !a.icon && /*#__PURE__*/React.createElement(DSAG.IconifyIcon, {
    name: "lucide:sparkles",
    size: 22,
    color: "#fff"
  })), a.badge && /*#__PURE__*/React.createElement("span", {
    className: "ag-badge"
  }, /*#__PURE__*/React.createElement(DSAG.IconifyIcon, {
    name: "fluent:crown-16-filled",
    size: 13,
    color: "#fff"
  }), a.badge)), /*#__PURE__*/React.createElement("div", {
    className: "ag-title-row"
  }, /*#__PURE__*/React.createElement("h3", null, a.title), a.media && /*#__PURE__*/React.createElement("span", {
    className: "ag-media",
    "aria-label": "Watch demo"
  }, /*#__PURE__*/React.createElement(DSAG.IconifyIcon, {
    name: "fluent:play-12-filled",
    size: 12,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "ag-desc"
  }, a.description), /*#__PURE__*/React.createElement("div", {
    className: "ag-card-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ag-notify",
    disabled: waitlisted,
    onClick: () => setWaitlisted(true)
  }, /*#__PURE__*/React.createElement(DSAG.IconifyIcon, {
    name: waitlisted ? "lucide:check" : "lucide:bell",
    size: 17,
    color: waitlisted ? "var(--ai-purple)" : "#fff"
  }), waitlisted ? "On The Waitlist" : "Notify Me"), /*#__PURE__*/React.createElement("span", {
    className: "ag-soon"
  }, /*#__PURE__*/React.createElement(DSAG.IconifyIcon, {
    name: "lucide:clock",
    size: 17,
    color: "var(--gray-450)"
  }), "Coming Soon")));
}
function AgTabBar() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "ag-tabs",
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
    size: 24,
    color: t.key === "Agent" ? "var(--brand-navy)" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), t.label)));
}
function AgentHome() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ag-screen",
    "data-screen-label": "Profinity Agents (mobile)"
  }, /*#__PURE__*/React.createElement(MobileChromeC, null), /*#__PURE__*/React.createElement("div", {
    className: "ag-scroll"
  }, /*#__PURE__*/React.createElement(AgHero, null), /*#__PURE__*/React.createElement("div", {
    className: "ag-list"
  }, AG_AGENTS.map((a, i) => /*#__PURE__*/React.createElement(AgentCardM, {
    key: i,
    a: a
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  })), /*#__PURE__*/React.createElement(AgTabBar, null));
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