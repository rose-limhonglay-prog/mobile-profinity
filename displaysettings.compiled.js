/* ===========================================================================
   PROfinity — Display Settings (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -DS to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateDS,
  useEffect: useEffectDS
} = React;
const DSDS = window.ProfinityDesignSystem_c2b5cc;
function goDS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleDS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateDS(calc);
  useEffectDS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileDS() {
  const [mobile, setMobile] = useStateDS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectDS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function ThemeCard({
  kind,
  theme,
  accent,
  accentColor,
  on,
  onPick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "ds-themecard ds-" + kind + (on ? " on" : ""),
    onClick: onPick,
    role: "radio",
    "aria-checked": on
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-preview"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-prow"
  }, /*#__PURE__*/React.createElement("b", null, "Theme"), /*#__PURE__*/React.createElement("i", null, theme)), /*#__PURE__*/React.createElement("span", {
    className: "ds-prow"
  }, /*#__PURE__*/React.createElement("b", null, "Accent"), /*#__PURE__*/React.createElement("i", {
    style: {
      color: accentColor
    }
  }, accent)), /*#__PURE__*/React.createElement("span", {
    className: "ds-prow"
  }, /*#__PURE__*/React.createElement("b", null, "Size"), /*#__PURE__*/React.createElement("i", null, "Medium"))), /*#__PURE__*/React.createElement("span", {
    className: "ds-themelabel"
  }, kind === "dark" ? "Dark" : "Light"), /*#__PURE__*/React.createElement("span", {
    className: "ds-themeradio",
    "aria-hidden": "true",
    style: {
      backgroundColor: on ? "#CE9957" : "rgb(255, 255, 255)",
      borderColor: on ? "#CE9957" : "rgb(208, 213, 221)"
    }
  }, on && /*#__PURE__*/React.createElement(DSDS.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "#fff"
  })));
}
function Toggle({
  label,
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "ds-toggle-row" + (on ? " on" : ""),
    onClick: onToggle,
    role: "switch",
    "aria-checked": on
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-toggle-label",
    style: {
      fontSize: "18px"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "ds-switch",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-knob"
  })));
}
function DisplaySettings() {
  const [theme, setTheme] = useStateDS("dark");
  const [hc, setHc] = useStateDS(false);
  const [rm, setRm] = useStateDS(false);
  const [bold, setBold] = useStateDS(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-screen",
    "data-screen-label": "Display Settings (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ds-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ds-back",
    "aria-label": "Back",
    onClick: () => goDS("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSDS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Display Settings")), /*#__PURE__*/React.createElement("div", {
    className: "ds-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-sec-h"
  }, "Appearance"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-themes",
    role: "radiogroup",
    "aria-label": "Theme"
  }, /*#__PURE__*/React.createElement(ThemeCard, {
    kind: "dark",
    theme: "Dark",
    accent: "Purple",
    accentColor: "#9D8DFF",
    on: theme === "dark",
    onPick: () => setTheme("dark")
  }), /*#__PURE__*/React.createElement(ThemeCard, {
    kind: "light",
    theme: "Light",
    accent: "Blue",
    accentColor: "var(--reaction-like)",
    on: theme === "light",
    onPick: () => setTheme("light")
  })), /*#__PURE__*/React.createElement("button", {
    className: "ds-fontrow",
    onClick: () => {}
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-fontlabel",
    style: {
      fontSize: "18px"
    }
  }, "Font Size"), /*#__PURE__*/React.createElement("span", {
    className: "ds-fontval",
    style: {
      fontSize: "16px",
      color: "rgb(0, 0, 0)"
    }
  }, "Medium"), /*#__PURE__*/React.createElement(DSDS.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ds-sec-h"
  }, "Accessibility"), /*#__PURE__*/React.createElement("div", {
    className: "ds-card ds-card-list"
  }, /*#__PURE__*/React.createElement(Toggle, {
    label: "High Contrast",
    on: hc,
    onToggle: () => setHc(v => !v)
  }), /*#__PURE__*/React.createElement(Toggle, {
    label: "Reduce Motion",
    on: rm,
    onToggle: () => setRm(v => !v)
  }), /*#__PURE__*/React.createElement(Toggle, {
    label: "Bold Text",
    on: bold,
    onToggle: () => setBold(v => !v)
  }))));
}
function DisplaySettingsApp() {
  const mobile = useIsMobileDS();
  const scale = useDeviceScaleDS();
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
    }, /*#__PURE__*/React.createElement(DisplaySettings, null));
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
  }, /*#__PURE__*/React.createElement(DisplaySettings, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(DisplaySettingsApp, null));