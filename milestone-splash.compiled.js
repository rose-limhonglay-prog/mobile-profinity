/* ===========================================================================
   PROfinity — Katy · Milestone Splash (Screens 9 & 10) · iPhone 17 Pro Max
   Full-screen congratulatory splash triggered when Katy crosses a major
   lifetime-points threshold (e.g. 50,000 → "Sapphire Collector"). Lists the
   perks unlocked at that level. Backed by window.PFLoyalty.
   Suffixed -SPL to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateSPL,
  useEffect: useEffectSPL
} = React;
const DSSPL = window.ProfinityDesignSystem_c2b5cc;
function goSPL(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function MilestoneSplashScreen() {
  const PF = window.PFLoyalty;
  const state = PF.getState();
  const progress = PF.getBadgeProgress(state);
  const level = progress.current || PF.getConfig().levelBadges[0];
  const title = level.splashTitle || level.name + " Unlocked!";
  const perks = level.splashPerks || [(PF.getConfig().tierMultipliers[state.user.membershipTier] || 1) + "x tier multiplier active", "New badge added to your gallery", "Featured in this month's Community spotlight"];
  return /*#__PURE__*/React.createElement("div", {
    className: "spl-screen",
    "data-screen-label": "Milestone Splash"
  }, /*#__PURE__*/React.createElement("button", {
    className: "spl-close",
    type: "button",
    "aria-label": "Close",
    onClick: () => goSPL("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(DSSPL.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "spl-confetti",
    "aria-hidden": "true"
  }, Array.from({
    length: 18
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "spl-confetti-piece p" + i % 6,
    style: {
      left: i * 5.6 + "%",
      animationDelay: i * 0.12 + "s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "spl-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spl-medal",
    style: {
      background: level.color || "var(--brand-gold)"
    }
  }, /*#__PURE__*/React.createElement(DSSPL.IconifyIcon, {
    name: "lucide:gem",
    size: 44,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "spl-kicker"
  }, "Milestone Reached"), /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("p", {
    className: "spl-sub"
  }, "You've crossed ", PF.formatNumber(level.threshold), " Lifetime Points as a PROfinity clinician."), /*#__PURE__*/React.createElement("div", {
    className: "spl-perks"
  }, perks.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "spl-perk-row"
  }, /*#__PURE__*/React.createElement(DSSPL.IconifyIcon, {
    name: "lucide:check-circle",
    size: 18,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", null, p))))), /*#__PURE__*/React.createElement("div", {
    className: "spl-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-gold",
    type: "button",
    onClick: () => goSPL("BadgeGallery.html")
  }, "View My Badges"), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-ghost",
    style: {
      background: "rgba(255,255,255,.14)",
      color: "#fff"
    },
    type: "button",
    onClick: () => goSPL("RewardsDashboard.html")
  }, "Continue")));
}
function useDeviceScaleSPL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSPL(calc);
  useEffectSPL(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileSPL() {
  const [mobile, setMobile] = useStateSPL(() => window.matchMedia("(max-width:768px)").matches);
  useEffectSPL(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function MilestoneSplashApp() {
  const mobile = useIsMobileSPL();
  const scale = useDeviceScaleSPL();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "var(--brand-navy)"
    }
  }, /*#__PURE__*/React.createElement(MilestoneSplashScreen, null));
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
  }, /*#__PURE__*/React.createElement(MilestoneSplashScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MilestoneSplashApp, null));
