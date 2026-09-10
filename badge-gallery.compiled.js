/* ===========================================================================
   PROfinity — Katy · Badge Gallery (Screen 15) · iPhone 17 Pro Max
   Grid of all collectible achievement badges plus the Bronze→Diamond level
   ladder, highlighting earned vs locked with completion indicators. Tapping
   a badge opens Badge Detail. Backed by window.PFLoyalty. Suffixed -BGL.
   =========================================================================== */
const {
  useState: useStateBGL,
  useMemo: useMemoBGL
} = React;
const DSBGL = window.ProfinityDesignSystem_c2b5cc;
const PF_BGL = window.PFLoyalty;
function goBGL(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function achievementCount(state, badge) {
  const c = badge.criteria;
  if (c.type === "actionCount") return state.ledger.filter(t => t.pointsDelta > 0 && (c.actionId ? t.actionId === c.actionId : true)).length;
  if (c.type === "redeemCount") return state.redeemedVouchers.length;
  if (c.type === "streak") return Math.max(state.streak.current, state.streak.longest);
  return 0;
}
function BadgeGalleryScreen() {
  const [config] = useStateBGL(() => PF_BGL.getConfig());
  // Achievements are only evaluated when an action/redeem/check-in runs, so a
  // badge whose criteria were already met (e.g. a 45-day longest streak vs a
  // 30-day Streak Master) could show 30/30 yet still locked. Settle that first.
  const [state] = useStateBGL(() => {
    PF_BGL.evaluateAchievements();
    return PF_BGL.getState();
  });
  const progress = useMemoBGL(() => PF_BGL.getBadgeProgress(state), [state]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen bgl-screen",
    "data-screen-label": "Badge Gallery"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goBGL("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(DSBGL.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Badge Gallery"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Level Ladder")), /*#__PURE__*/React.createElement("div", {
    className: "bgl-ladder"
  }, config.levelBadges.map(b => {
    const earned = state.lifetimePoints >= b.threshold;
    const isCurrent = progress.current && progress.current.key === b.key;
    return /*#__PURE__*/React.createElement("div", {
      key: b.key,
      className: "bgl-ladder-item" + (earned ? " is-earned" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "bgl-ladder-dot",
      style: {
        background: earned ? b.color : "var(--gray-200)"
      }
    }, earned ? /*#__PURE__*/React.createElement(DSBGL.IconifyIcon, {
      name: "lucide:check",
      size: 14,
      color: "#fff"
    }) : /*#__PURE__*/React.createElement(DSBGL.IconifyIcon, {
      name: "lucide:lock",
      size: 12,
      color: "var(--gray-400)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "bgl-ladder-name"
    }, b.name), isCurrent && /*#__PURE__*/React.createElement("span", {
      className: "bgl-ladder-current"
    }, "You"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Collectible Badges")), /*#__PURE__*/React.createElement("div", {
    className: "bgl-grid"
  }, config.achievementBadges.map(b => {
    const unlocked = state.unlockedAchievements.includes(b.key);
    const count = achievementCount(state, b);
    const target = b.criteria.count;
    const pct = Math.min(100, Math.round(count / target * 100));
    return /*#__PURE__*/React.createElement("button", {
      key: b.key,
      type: "button",
      className: "bgl-tile" + (unlocked ? " is-unlocked" : ""),
      onClick: () => goBGL("BadgeDetail.html?badge=" + b.key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "bgl-tile-icon"
    }, /*#__PURE__*/React.createElement(DSBGL.IconifyIcon, {
      name: b.icon,
      size: 24,
      color: unlocked ? "var(--brand-navy)" : "var(--gray-400)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "bgl-tile-name"
    }, b.name), !unlocked && /*#__PURE__*/React.createElement("div", {
      className: "ml-progress-track",
      style: {
        width: "80%",
        margin: "6px auto 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "ml-progress-fill",
      style: {
        width: pct + "%"
      }
    })), !unlocked && /*#__PURE__*/React.createElement("span", {
      className: "bgl-tile-progress"
    }, Math.min(count, target), "/", target), unlocked && /*#__PURE__*/React.createElement("span", {
      className: "bgl-tile-earned"
    }, /*#__PURE__*/React.createElement(DSBGL.IconifyIcon, {
      name: "lucide:check-circle",
      size: 13,
      color: "var(--success)"
    }), "Earned"));
  }))));
}
function useDeviceScaleBGL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateBGL(calc);
  React.useEffect(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileBGL() {
  const [mobile, setMobile] = useStateBGL(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkBGL() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateBGL(read);
  React.useEffect(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => mo.disconnect();
  }, []);
  return dark;
}
function BadgeGalleryApp() {
  const mobile = useIsMobileBGL();
  const scale = useDeviceScaleBGL();
  const dark = useIsDarkBGL();
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
  }, /*#__PURE__*/React.createElement(BadgeGalleryScreen, null));
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
    height: 956,
    dark: dark
  }, /*#__PURE__*/React.createElement(BadgeGalleryScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(BadgeGalleryApp, null));
