/* PROfinity — Rewards settings (user, 2026-10-20: "create another settings
   that is related to the rewards… sound effects, sound background, the user
   can lower the volume or totally mute").
   RewardsSettings.html (mobile, PF loyalty shell) and RewardsSettingsWeb.html
   (desktop, window.PF_RS_WEB) run this one bundle. Opened from the gear on the
   Rewards header (mobilechrome.jsx / web-rewards-chrome.js).
   Everything applies immediately (sliders need live feedback):
     • Sound effects  → PFPointsSound enabled / getVolume / setVolume / preview / themes
     • Background music → PFRewardsMusic setOn / getVolume / setVolume (plays
       on this page too, so the slider is heard at once)
     • Pop-ups → PFGamification pointsPopup / streakPopup / dailyGoalPopup */
const {
  useState: useStateRS,
  useEffect: useEffectRS,
  useRef: useRefRS
} = React;
const DSRS = window.ProfinityDesignSystem_c2b5cc;
const RS_WEB = !!window.PF_RS_WEB;
const ME_RS = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function goRS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function paramRS(name) {
  try {
    return new URLSearchParams(location.search).get(name);
  } catch (e) {
    return null;
  }
}
function retRS() {
  const r = paramRS("ret");
  if (r && /^[A-Za-z0-9_./?=&-]+$/.test(r)) return r;
  return RS_WEB ? "RewardsWeb.html" : "RewardsDashboard.html";
}
const SND = () => window.PFPointsSound || null;
const MUS = () => window.PFRewardsMusic || null;
const GAMI = () => window.PFGamification || null;
function readRS() {
  const s = SND(),
    m = MUS(),
    g = GAMI();
  const gg = g ? g.get() : {
    pointsPopup: true,
    streakPopup: true,
    dailyGoalPopup: true
  };
  return {
    sfxOn: s ? s.enabled() : true,
    sfxVol: s ? s.getVolume() : 1,
    theme: s ? s.getTheme() : "coin",
    pointsPopup: gg.pointsPopup !== false,
    streakPopup: gg.streakPopup !== false,
    dailyGoalPopup: gg.dailyGoalPopup !== false
  };
}

/* ---- bits ---- */
/* cute switch (user, 2026-10-20 "make the toggle cute"): gold gradient track
   with tiny stars when on, a bouncy knob with a little face — smiling when
   on, dozing ("z") when off */
function SwitchRS({
  on,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    "aria-label": label,
    className: "rs-switch" + (on ? " on" : ""),
    onClick: () => onChange(!on)
  }, /*#__PURE__*/React.createElement("span", {
    className: "rs-switch-stars",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("span", {
    className: "rs-switch-knob",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    className: "rs-face"
  }, on ? /*#__PURE__*/React.createElement("g", {
    className: "rs-face-awake"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10",
    r: "1.6",
    fill: "#3D2A00"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15.5",
    cy: "10",
    r: "1.6",
    fill: "#3D2A00"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 14.5 Q12 18.5 16 14.5",
    stroke: "#3D2A00",
    strokeWidth: "1.8",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "5.6",
    cy: "13.4",
    r: "1.6",
    fill: "#FF9AB0",
    opacity: ".8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18.4",
    cy: "13.4",
    r: "1.6",
    fill: "#FF9AB0",
    opacity: ".8"
  })) : /*#__PURE__*/React.createElement("g", {
    className: "rs-face-asleep"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.5 10.5 Q8.5 12 10.5 10.5",
    stroke: "#8E8CA3",
    strokeWidth: "1.7",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.5 10.5 Q15.5 12 17.5 10.5",
    stroke: "#8E8CA3",
    strokeWidth: "1.7",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "15.6",
    r: "1.3",
    fill: "#8E8CA3"
  }), /*#__PURE__*/React.createElement("text", {
    x: "16",
    y: "7.5",
    fontSize: "6",
    fontWeight: "800",
    fill: "#B3B1C6",
    fontFamily: "var(--font-sans)"
  }, "z")))));
}
function SliderRS({
  value,
  onInput,
  onCommit,
  label,
  disabled,
  icon
}) {
  const pct = Math.round(value * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "rs-slider" + (disabled ? " is-disabled" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "rs-slider-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSRS.IconifyIcon, {
    name: pct === 0 ? "lucide:volume-x" : pct < 50 ? "lucide:volume-1" : "lucide:volume-2",
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "5",
    value: pct,
    disabled: disabled,
    "aria-label": label + " volume",
    "aria-valuetext": pct + "%",
    onChange: e => onInput(+e.target.value / 100),
    onPointerUp: e => onCommit && onCommit(+e.target.value / 100),
    onKeyUp: e => onCommit && onCommit(+e.target.value / 100)
  }), /*#__PURE__*/React.createElement("span", {
    className: "rs-slider-pct"
  }, pct, "%"));
}
function RowRS({
  icon,
  tone,
  title,
  sub,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rs-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rs-row-ic rs-row-ic-" + (tone || "gold"),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSRS.IconifyIcon, {
    name: icon,
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "rs-row-tx"
  }, /*#__PURE__*/React.createElement("b", null, title), sub ? /*#__PURE__*/React.createElement("i", null, sub) : null), right);
}
function RewardsSettingsView() {
  const [st, setSt] = useStateRS(readRS);
  const previewT = useRefRS(null);
  useEffectRS(() => {
    const t = setTimeout(() => setSt(readRS()), 200);
    return () => clearTimeout(t);
  }, []); // engines may mount after us
  const patch = p => setSt(prev => ({
    ...prev,
    ...p
  }));

  /* sound effects */
  const setSfxOn = on => {
    const s = SND();
    if (s) {
      on ? s.unmute() : s.mute();
    }
    patch({
      sfxOn: on
    });
    if (on && s && s.preview) setTimeout(() => s.preview("points"), 60);
  };
  const setSfxVol = v => {
    const s = SND();
    if (s) s.setVolume(v);
    patch({
      sfxVol: v
    });
  };
  const previewSfx = () => {
    const s = SND();
    if (!s || !st.sfxOn) return;
    clearTimeout(previewT.current);
    previewT.current = setTimeout(() => s.preview && s.preview("points"), 120);
  };
  const setTheme = id => {
    const s = SND();
    if (s) {
      s.setTheme(id);
      patch({
        theme: id
      });
      if (st.sfxOn && s.preview) s.preview("points", id);
    }
  };
  const themes = SND() && SND().themes ? SND().themes() : [];

  /* pop-ups */
  const setGami = (k, on) => {
    const g = GAMI();
    if (g) g.set({
      [k]: on
    });
    patch({
      [k]: on
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "rs-body"
  }, /*#__PURE__*/React.createElement("section", {
    className: "ml-card rs-card",
    "aria-label": "Sound effects"
  }, /*#__PURE__*/React.createElement(RowRS, {
    icon: "lucide:sparkles",
    tone: "gold",
    title: "Sound effects",
    sub: "Coin chimes, fanfares and the check-in welcome",
    right: /*#__PURE__*/React.createElement(SwitchRS, {
      on: st.sfxOn,
      onChange: setSfxOn,
      label: "Sound effects"
    })
  }), /*#__PURE__*/React.createElement(SliderRS, {
    value: st.sfxVol,
    onInput: setSfxVol,
    onCommit: previewSfx,
    label: "Sound effects",
    disabled: !st.sfxOn
  }), /*#__PURE__*/React.createElement("div", {
    className: "rs-sub"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rs-sub-h"
  }, "Chime style"), /*#__PURE__*/React.createElement("div", {
    className: "rs-chips",
    role: "radiogroup",
    "aria-label": "Chime style"
  }, themes.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    type: "button",
    role: "radio",
    "aria-checked": st.theme === t.id,
    className: "rs-chip" + (st.theme === t.id ? " on" : ""),
    disabled: !st.sfxOn,
    onClick: () => setTheme(t.id),
    title: t.desc
  }, t.label)))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rs-test",
    disabled: !st.sfxOn,
    onClick: () => {
      const s = SND();
      if (s && s.preview) s.preview("points");
    }
  }, /*#__PURE__*/React.createElement(DSRS.IconifyIcon, {
    name: "lucide:play",
    size: 16,
    color: "currentColor"
  }), "Play a test sound")), /*#__PURE__*/React.createElement("section", {
    className: "ml-card rs-card",
    "aria-label": "Pop-ups"
  }, /*#__PURE__*/React.createElement(RowRS, {
    icon: "lucide:party-popper",
    tone: "pink",
    title: "Pop-ups",
    sub: "Little celebrations when you earn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rs-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rs-item"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Points pop-up"), /*#__PURE__*/React.createElement("i", null, "\"+15\" when you earn points")), /*#__PURE__*/React.createElement(SwitchRS, {
    on: st.pointsPopup,
    onChange: v => setGami("pointsPopup", v),
    label: "Points pop-up"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rs-item"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Streak celebration"), /*#__PURE__*/React.createElement("i", null, "5 in a row and the daily welcome")), /*#__PURE__*/React.createElement(SwitchRS, {
    on: st.streakPopup,
    onChange: v => setGami("streakPopup", v),
    label: "Streak celebration"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rs-item"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Daily goal"), /*#__PURE__*/React.createElement("i", null, "When you reach the day's target")), /*#__PURE__*/React.createElement(SwitchRS, {
    on: st.dailyGoalPopup,
    onChange: v => setGami("dailyGoalPopup", v),
    label: "Daily goal pop-up"
  })))), /*#__PURE__*/React.createElement("p", {
    className: "rs-foot"
  }, /*#__PURE__*/React.createElement(DSRS.IconifyIcon, {
    name: "lucide:bell",
    size: 14,
    color: "currentColor"
  }), "Notification settings for everything else are under Account."));
}

/* ---- mobile shell ---- */
function useIsMobileRS() {
  const [mobile, setMobile] = useStateRS(() => window.matchMedia("(max-width:768px)").matches);
  useEffectRS(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function useDeviceScaleRS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRS(calc);
  useEffectRS(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}
function useIsDarkRS() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateRS(read);
  useEffectRS(() => {
    const obs = new MutationObserver(() => setDark(read()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}
function RewardsSettingsScreen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen rs-screen pf-funbg",
    "data-screen-label": "Rewards settings"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goRS(retRS())
  }, /*#__PURE__*/React.createElement(DSRS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Rewards settings"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll rs-scroll"
  }, /*#__PURE__*/React.createElement(RewardsSettingsView, null)));
}
function RewardsSettingsMobile() {
  const mobile = useIsMobileRS();
  const scale = useDeviceScaleRS();
  const dark = useIsDarkRS();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(RewardsSettingsScreen, null));
  const IOSDevice = window.IOSDevice; // ios-frame.compiled.js global, as on every loyalty drill-in
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "scale(" + scale + ")",
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956,
    dark: dark
  }, /*#__PURE__*/React.createElement(RewardsSettingsScreen, null))));
}
/* ---- web shell ---- */
function RewardsSettingsWeb() {
  const {
    TopNav
  } = DSRS;
  useEffectRS(() => {
    document.body.classList.add("pf-funbg");
    return () => document.body.classList.remove("pf-funbg");
  }, []);
  const navigate = label => {
    const u = {
      Home: "NewsfeedWeb.html",
      Profile: "Profile.html",
      "My Learning": "MyLearning.html",
      Community: "Community.html",
      Agent: "Agent.html",
      Rewards: "RewardsWeb.html"
    }[label];
    if (u) goRS(u);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopNav, {
    active: "Rewards",
    user: ME_RS,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigate,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "rs-page",
    "data-screen-label": "Rewards settings"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rs-crumb",
    onClick: () => goRS(retRS())
  }, /*#__PURE__*/React.createElement(DSRS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 16,
    color: "currentColor"
  }), "Back to Rewards"), /*#__PURE__*/React.createElement("h1", {
    className: "rs-page-title"
  }, "Rewards settings"), /*#__PURE__*/React.createElement("p", {
    className: "rs-page-sub"
  }, "Sounds and pop-ups for your points and rewards."), /*#__PURE__*/React.createElement(RewardsSettingsView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(RS_WEB ? /*#__PURE__*/React.createElement(RewardsSettingsWeb, null) : /*#__PURE__*/React.createElement(RewardsSettingsMobile, null));
