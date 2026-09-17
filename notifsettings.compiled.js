/* ===========================================================================
   PROfinity — Notification Settings (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -NS to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateNS,
  useEffect: useEffectNS,
  useRef: useRefNS
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

/* ---- Gamification (points pop-ups, streak celebrations, sounds) ----
   Backed by the shared stores the popups already read: "pf-gamification"
   (PFGamification in points-sound.js), "pf-sound" (mute) and
   "pf-sound-theme" (sound style). Applied the moment a switch is flipped —
   these are device preferences, so no Save step. */
const GAMI_KEY_NS = "pf-gamification";
function gamiReadNS() {
  if (window.PFGamification) return window.PFGamification.get();
  try {
    const s = JSON.parse(localStorage.getItem(GAMI_KEY_NS)) || {};
    return {
      pointsPopup: s.pointsPopup !== false,
      streakPopup: s.streakPopup !== false,
      dailyGoalPopup: s.dailyGoalPopup !== false
    };
  } catch (e) {
    return {
      pointsPopup: true,
      streakPopup: true,
      dailyGoalPopup: true
    };
  }
}
function gamiWriteNS(next) {
  if (window.PFGamification) {
    window.PFGamification.set(next);
    return;
  }
  try {
    localStorage.setItem(GAMI_KEY_NS, JSON.stringify(next));
  } catch (e) {}
}
function soundOnNS() {
  return window.PFPointsSound ? window.PFPointsSound.enabled() : function () {
    try {
      return localStorage.getItem("pf-sound") !== "off";
    } catch (e) {
      return true;
    }
  }();
}
function setSoundOnNS(on) {
  if (window.PFPointsSound) {
    on ? window.PFPointsSound.unmute() : window.PFPointsSound.mute();
    return;
  }
  try {
    on ? localStorage.removeItem("pf-sound") : localStorage.setItem("pf-sound", "off");
  } catch (e) {}
}
const THEMES_FALLBACK_NS = [{
  id: "coin",
  label: "Coin",
  desc: "Bright two-note chime"
}, {
  id: "bell",
  label: "Bell",
  desc: "Glassy, long ring"
}, {
  id: "arcade",
  label: "Arcade",
  desc: "Retro 8-bit blips"
}, {
  id: "soft",
  label: "Soft",
  desc: "Warm, low and gentle"
}, {
  id: "bubble",
  label: "Bubble",
  desc: "Playful rising pops"
}];
function themesNS() {
  return window.PFPointsSound && window.PFPointsSound.themes ? window.PFPointsSound.themes() : THEMES_FALLBACK_NS;
}
function themeNS() {
  return window.PFPointsSound && window.PFPointsSound.getTheme ? window.PFPointsSound.getTheme() : "coin";
}
function previewNS(kind, theme) {
  if (window.PFPointsSound && window.PFPointsSound.preview) window.PFPointsSound.preview(kind, theme);
}
const PREVIEWS_NS = [{
  kind: "points",
  label: "Points",
  icon: "lucide:coins"
}, {
  kind: "checkin",
  label: "Check-in",
  icon: "lucide:sun"
}, {
  kind: "streak",
  label: "Streak",
  icon: "lucide:flame"
}];
function GamificationNS() {
  const [gami, setGami] = useStateNS(gamiReadNS);
  const [sound, setSound] = useStateNS(soundOnNS);
  const [theme, setTheme] = useStateNS(themeNS);
  const [playing, setPlaying] = useStateNS(null);
  /* every change is saved instantly — the toast is the confirmation */
  const [toast, setToast] = useStateNS(null);
  const toastTimer = useRefNS(null);
  const say = msg => {
    setToast({
      msg,
      key: Date.now()
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };
  useEffectNS(() => () => clearTimeout(toastTimer.current), []);
  const LABELS = {
    pointsPopup: "Points pop-ups",
    streakPopup: "Streak celebrations",
    dailyGoalPopup: "Daily goal celebration"
  };
  const flip = k => () => {
    const next = {
      ...gami,
      [k]: !gami[k]
    };
    setGami(next);
    gamiWriteNS(next);
    say(LABELS[k] + (next[k] ? " on" : " off") + " · Saved");
  };
  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    setSoundOnNS(on);
    if (on) previewNS("points", theme);
    say("Sound effects " + (on ? "on" : "off") + " · Saved");
  };
  const themeLabel = id => (themesNS().filter(t => t.id === id)[0] || {}).label || id;
  /* picking a style saves it — and switches sound effects back on if they were muted */
  const pick = id => {
    setTheme(id);
    if (window.PFPointsSound && window.PFPointsSound.setTheme) window.PFPointsSound.setTheme(id);
    if (!sound) {
      setSound(true);
      setSoundOnNS(true);
    }
    previewNS("points", id);
    say(themeLabel(id) + " sound saved" + (!sound ? " · Sound effects on" : ""));
  };
  const play = kind => {
    previewNS(kind, theme);
    setPlaying(kind);
    setTimeout(() => setPlaying(p => p === kind ? null : p), 900);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ns-sec-h"
  }, "Gamification"), /*#__PURE__*/React.createElement("p", {
    className: "ns-sec-desc"
  }, "Points, streaks and celebrations — turn the fanfare up or down."), /*#__PURE__*/React.createElement("div", {
    className: "ns-card"
  }, /*#__PURE__*/React.createElement(ToggleNS, {
    label: "Points pop-ups",
    desc: "Flash the “+pts” on the header pill and float a tally when you earn points.",
    on: gami.pointsPopup,
    onToggle: flip("pointsPopup")
  }), /*#__PURE__*/React.createElement("div", {
    className: "ns-divider"
  }), /*#__PURE__*/React.createElement(ToggleNS, {
    label: "Streak celebrations",
    desc: "The daily check-in welcome card. Points are still earned.",
    on: gami.streakPopup,
    onToggle: flip("streakPopup")
  }), /*#__PURE__*/React.createElement("div", {
    className: "ns-divider"
  }), /*#__PURE__*/React.createElement(ToggleNS, {
    label: "Daily goal celebration",
    desc: "Full-screen celebration each time you pass another 50 points in a day.",
    on: gami.dailyGoalPopup,
    onToggle: flip("dailyGoalPopup")
  })), /*#__PURE__*/React.createElement("div", {
    className: "ns-card"
  }, /*#__PURE__*/React.createElement(ToggleNS, {
    label: "Sound effects",
    desc: "The coin chime, welcome chime and streak fanfare.",
    on: sound,
    onToggle: toggleSound
  }), /*#__PURE__*/React.createElement("div", {
    className: "ns-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ns-sound"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-sub-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ns-sub-h"
  }, "Sound style"), /*#__PURE__*/React.createElement("span", {
    className: "ns-saved-pill"
  }, /*#__PURE__*/React.createElement(DSNS.IconifyIcon, {
    name: "lucide:check",
    size: 12,
    color: "currentColor"
  }), themeLabel(theme), " · Saved")), /*#__PURE__*/React.createElement("p", {
    className: "ns-hint"
  }, "Tap a style to hear it and save it", sound ? "" : ". Sound effects are off — picking a style turns them back on", "."), /*#__PURE__*/React.createElement("div", {
    className: "ns-styles",
    role: "radiogroup",
    "aria-label": "Sound style"
  }, themesNS().map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    type: "button",
    className: "ns-style" + (theme === t.id ? " on" : ""),
    role: "radio",
    "aria-checked": theme === t.id,
    onClick: () => pick(t.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ns-radio" + (theme === t.id ? " on" : ""),
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ns-style-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ns-style-label"
  }, t.label, theme === t.id && /*#__PURE__*/React.createElement("em", {
    className: "ns-style-current"
  }, "Selected")), /*#__PURE__*/React.createElement("span", {
    className: "ns-style-desc"
  }, t.desc)), /*#__PURE__*/React.createElement("span", {
    className: "ns-style-play",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSNS.IconifyIcon, {
    name: "lucide:volume-2",
    size: 16,
    color: "currentColor"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "ns-sub-h"
  }, "Try it"), /*#__PURE__*/React.createElement("div", {
    className: "ns-previews"
  }, PREVIEWS_NS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.kind,
    type: "button",
    className: "ns-preview" + (playing === p.kind ? " is-playing" : ""),
    onClick: () => play(p.kind)
  }, /*#__PURE__*/React.createElement(DSNS.IconifyIcon, {
    name: p.icon,
    size: 16,
    color: "currentColor"
  }), p.label))))), toast && /*#__PURE__*/React.createElement("div", {
    key: toast.key,
    className: "ns-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSNS.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 16,
    color: "currentColor"
  }), toast.msg));
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
  })), /*#__PURE__*/React.createElement(GamificationNS, null)));
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
