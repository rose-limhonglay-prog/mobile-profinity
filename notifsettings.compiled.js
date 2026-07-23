/* ===========================================================================
   PROfinity — Notification Settings (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -NS to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateNS,
  useEffect: useEffectNS
} = React;
const DSNS = window.ProfinityDesignSystem_c2b5cc;
function goNS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleNS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateNS(calc);
  useEffectNS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileNS() {
  const [mobile, setMobile] = useStateNS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectNS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function ToggleNS({
  label,
  desc,
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ns-toggle-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ns-toggle-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ns-toggle-label"
  }, label), desc && /*#__PURE__*/React.createElement("span", {
    className: "ns-toggle-desc"
  }, desc)), /*#__PURE__*/React.createElement("button", {
    className: "ns-switch" + (on ? " on" : ""),
    onClick: onToggle,
    role: "switch",
    "aria-checked": on,
    "aria-label": label
  }, /*#__PURE__*/React.createElement("span", {
    className: "ns-knob"
  })));
}
function NotificationSettings() {
  const [push, setPush] = useStateNS(true);
  const [social, setSocial] = useStateNS(true);
  const [learning, setLearning] = useStateNS(true);
  return /*#__PURE__*/React.createElement("div", {
    className: "ns-screen",
    "data-screen-label": "Notification Settings (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ns-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ns-back",
    "aria-label": "Back",
    onClick: () => goNS("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSNS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Notification Settings")), /*#__PURE__*/React.createElement("div", {
    className: "ns-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-sec-h"
  }, "Updates & Alerts"), /*#__PURE__*/React.createElement("p", {
    className: "ns-sec-desc"
  }, "Keep it simple — choose what you want to hear about."), /*#__PURE__*/React.createElement("div", {
    className: "ns-card"
  }, /*#__PURE__*/React.createElement(ToggleNS, {
    label: "Push notifications",
    desc: "Real-time alerts sent to your device, including security and account activity.",
    on: push,
    onToggle: () => setPush(v => !v)
  }), /*#__PURE__*/React.createElement("div", {
    className: "ns-divider"
  }), /*#__PURE__*/React.createElement(ToggleNS, {
    label: "Social & community",
    desc: "Comments, likes, follows and new posts in channels you follow.",
    on: social,
    onToggle: () => setSocial(v => !v)
  }), /*#__PURE__*/React.createElement("div", {
    className: "ns-divider"
  }), /*#__PURE__*/React.createElement(ToggleNS, {
    label: "Learning & courses",
    desc: "Course reminders and new courses available in your topics.",
    on: learning,
    onToggle: () => setLearning(v => !v)
  }))));
}
function NotificationSettingsApp() {
  const mobile = useIsMobileNS();
  const scale = useDeviceScaleNS();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)",
    backgroundColor: "rgb(217, 218, 225)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(NotificationSettings, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(NotificationSettings, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(NotificationSettingsApp, null));
