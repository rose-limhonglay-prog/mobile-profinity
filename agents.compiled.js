function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ===========================================================================
   PROfinity Academy — Agents page
   Composed from the bound Profinity Design System bundle (AgentHero + AgentCard).
   =========================================================================== */
const {
  useState: useStateA,
  useEffect: useEffectA
} = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav,
  AgentHero,
  AgentCard
} = DS;
const ME = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const AGENTS = [{
  icon: "assets/agent-assesspro.png",
  badge: "Included in Artcodes",
  title: "Assess Pro",
  locked: true,
  description: "A cutting-edge tool for detailed facial analysis, emotion recognition, and identity verification. Perfect for security, healthcare, and personalised marketing applications.",
  status: "",
  cta: "Learn More",
  ctaIcon: "lucide:arrow-right",
  available: true
}, {
  icon: "assets/avatar-drtim.png",
  badge: "Included in Premium",
  title: "Profinity Coach Agent",
  description: "A versatile baseline assistant for general inquiries, scheduling, and basic data retrieval tasks. Perfect for getting started with automation."
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
function AgentTile({
  a
}) {
  const [waitlisted, setWaitlisted] = useStateA(!!a.waitlisted);
  if (a.available) {
    return /*#__PURE__*/React.createElement(AgentCard, _extends({}, a, {
      onCta: () => {}
    }));
  }
  return /*#__PURE__*/React.createElement(AgentCard, {
    icon: a.icon,
    badge: a.badge,
    title: a.title,
    description: a.description,
    status: "Coming Soon",
    cta: waitlisted ? "You're On The Waitlist" : "Notify Me",
    ctaIcon: waitlisted ? "lucide:check" : "lucide:bell",
    ctaDisabled: waitlisted,
    onCta: () => setWaitlisted(true)
  });
}
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
    Home: "Newsfeed.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html"
  }[label];
  if (u) (window.pfGo || function (x) {
    window.location.href = x;
  })(u);
}
function AgentsApp() {
  useEffectA(() => pfTagActiveNav("Agent"));
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      "--action-primary": "var(--ai-purple)",
      "--action-primary-hover": "var(--ai-purple-hover)"
    }
  }, /*#__PURE__*/React.createElement(TopNav, {
    active: "Agent",
    user: ME,
    logoSrc: "assets/profinity-academy-logo-full.png",
    onNavigate: navigate,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "agent-hero-wrap"
  }, /*#__PURE__*/React.createElement(AgentHero, null)), /*#__PURE__*/React.createElement("div", {
    className: "agents-grid",
    "data-screen-label": "Agents catalogue"
  }, AGENTS.map((a, i) => /*#__PURE__*/React.createElement(AgentTile, {
    key: i,
    a: a
  }))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AgentsApp, null));