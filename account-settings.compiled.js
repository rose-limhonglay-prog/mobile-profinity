/* ===========================================================================
   PROfinity — Account Settings (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -AS to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateAS,
  useEffect: useEffectAS
} = React;
const DSAS = window.ProfinityDesignSystem_c2b5cc;
function goAS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleAS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateAS(calc);
  useEffectAS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileAS() {
  const [mobile, setMobile] = useStateAS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectAS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function useDarkModeAS() {
  const [dark, setDark] = useStateAS(() => {
    try {
      return localStorage.getItem('pf-theme') === 'dark';
    } catch (e) {
      return false;
    }
  });
  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('pf-theme', next ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    } catch (e) {}
  }
  return [dark, toggle];
}
const AS_PROFILE_ITEMS_BEFORE = [{
  label: "Edit Profile",
  icon: "lucide:book-open",
  href: "ProfileMobile.html"
}, {
  label: "Account Settings",
  icon: "lucide:graduation-cap",
  href: null
}, {
  label: "My Saved",
  icon: "lucide:bookmark",
  href: "MySaved.html"
}, {
  label: "Notifications",
  icon: "lucide:calendar",
  href: null
}];
const AS_PROFILE_ITEMS_AFTER = [{
  label: "Privacy & Security",
  icon: "lucide:shield",
  href: null
}];
function ASRow({
  icon,
  label,
  href
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "as-row",
    onClick: () => href && goAS(href)
  }, /*#__PURE__*/React.createElement(DSAS.IconifyIcon, {
    name: icon,
    size: 22,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "as-row-label"
  }, label), /*#__PURE__*/React.createElement(DSAS.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  }));
}
function DarkSwitch({
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "as-switch" + (on ? " on" : ""),
    onClick: onToggle,
    role: "switch",
    "aria-checked": on,
    "aria-label": on ? "Switch to light mode" : "Switch to dark mode"
  }, /*#__PURE__*/React.createElement("span", {
    className: "as-knob"
  }, on && /*#__PURE__*/React.createElement(DSAS.IconifyIcon, {
    name: "lucide:moon",
    size: 13,
    color: "#1A1736"
  })));
}
function DisplayCard({
  dark,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "as-display-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "as-display-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "as-display-label"
  }, "Display"), /*#__PURE__*/React.createElement(DarkSwitch, {
    on: dark,
    onToggle: onToggle
  })), /*#__PURE__*/React.createElement("p", {
    className: "as-display-desc"
  }, "Adjust the appearance of the app to reduce glare and give your eyes a break"));
}
function AccountSettings() {
  const [dark, toggleDark] = useDarkModeAS();
  return /*#__PURE__*/React.createElement("div", {
    className: "as-screen",
    "data-screen-label": "Account Settings (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "as-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "as-back",
    "aria-label": "Back",
    onClick: () => goAS("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSAS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Settings")), /*#__PURE__*/React.createElement("div", {
    className: "as-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "as-sec-h"
  }, "My Profile"), /*#__PURE__*/React.createElement("button", {
    className: "as-row as-verify",
    onClick: () => goAS("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSAS.IconifyIcon, {
    name: "lucide:book-open",
    size: 22,
    color: "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "as-row-label"
  }, "Verify Profile"), /*#__PURE__*/React.createElement("span", {
    className: "as-verify-pill"
  }, "Not Verified")), /*#__PURE__*/React.createElement("nav", {
    className: "as-list"
  }, AS_PROFILE_ITEMS_BEFORE.map(item => /*#__PURE__*/React.createElement(ASRow, {
    key: item.label,
    icon: item.icon,
    label: item.label,
    href: item.href
  }))), /*#__PURE__*/React.createElement(DisplayCard, {
    dark: dark,
    onToggle: toggleDark
  }), /*#__PURE__*/React.createElement("nav", {
    className: "as-list"
  }, AS_PROFILE_ITEMS_AFTER.map(item => /*#__PURE__*/React.createElement(ASRow, {
    key: item.label,
    icon: item.icon,
    label: item.label,
    href: item.href
  }))), /*#__PURE__*/React.createElement("button", {
    className: "as-logout",
    onClick: () => goAS("NewsfeedMobile.html")
  }, "Logout", /*#__PURE__*/React.createElement(DSAS.IconifyIcon, {
    name: "lucide:log-out",
    size: 20,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "as-footer"
  }, /*#__PURE__*/React.createElement("a", {
    className: "as-footer-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    className: "as-footer-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, "Privacy Policy"))));
}
function AccountSettingsApp() {
  const mobile = useIsMobileAS();
  const scale = useDeviceScaleAS();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement(AccountSettings, null));
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
  }, /*#__PURE__*/React.createElement(AccountSettings, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AccountSettingsApp, null));
