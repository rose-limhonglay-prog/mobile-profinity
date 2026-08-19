/* ===========================================================================
   PROfinity — Katy · Ways to Earn (Screen 17) · iPhone 17 Pro Max
   Active multiplier banner plus point-earning actions organised by category
   with "Earn Now" buttons that call window.PFLoyalty.completeAction — a
   live run-through of the caps/velocity/silent-cap anti-cheat pipeline.
   Suffixed -WTE.
   =========================================================================== */
const {
  useState: useStateWTE,
  useMemo: useMemoWTE
} = React;
const DSWTE = window.ProfinityDesignSystem_c2b5cc;
const PF_WTE = window.PFLoyalty;
function goWTE(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function WaysToEarnScreen() {
  const [config] = useStateWTE(() => PF_WTE.getConfig());
  const [state, setState] = useStateWTE(() => PF_WTE.getState());
  const [toast, setToast] = useStateWTE(null);
  const multiplier = PF_WTE.getConfig().tierMultipliers[state.user.membershipTier] || 1;
  const grouped = useMemoWTE(() => {
    const byCat = {};
    config.actions.filter(a => a.active).forEach(a => {
      (byCat[a.category] = byCat[a.category] || []).push(a);
    });
    return byCat;
  }, [config]);
  const earn = action => {
    const res = PF_WTE.completeAction(action.id);
    setState(PF_WTE.getState());
    if (res.capped) setToast(action.label + ": " + res.capReason);else setToast("+" + res.pointsAwarded + " pts · +" + res.creditsAwarded + " credits");
    setTimeout(() => setToast(null), 2600);
    if (res.leveledUp) setTimeout(() => goWTE("MilestoneSplash.html"), 900);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen wte-screen",
    "data-screen-label": "Ways to Earn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goWTE("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Ways to Earn"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wte-multiplier-banner"
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:crown",
    size: 18,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", null, state.user.membershipTier, " Tier Active — ", multiplier, "x Multiplier")), Object.keys(grouped).map(cat => /*#__PURE__*/React.createElement("div", {
    key: cat
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, cat)), grouped[cat].map(a => {
    const projected = Math.round(a.basePoints * PF_WTE.tierMultiplierFor(a, state.user.membershipTier));
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      className: "ml-card wte-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "wte-row-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ti"
    }, a.label), /*#__PURE__*/React.createElement("span", {
      className: "su"
    }, a.guardrail)), /*#__PURE__*/React.createElement("button", {
      className: "ml-btn ml-btn-sm ml-btn-navy",
      type: "button",
      onClick: () => earn(a)
    }, "+", projected, " ", /*#__PURE__*/React.createElement("span", {
      className: "wte-pts-label"
    }, "pts")));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8
    }
  })), toast && /*#__PURE__*/React.createElement("div", {
    className: "ml-toast"
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:zap",
    size: 16,
    color: "#fff"
  }), toast));
}
function useDeviceScaleWTE() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateWTE(calc);
  React.useEffect(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileWTE() {
  const [mobile, setMobile] = useStateWTE(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function WaysToEarnApp() {
  const mobile = useIsMobileWTE();
  const scale = useDeviceScaleWTE();
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
  }, /*#__PURE__*/React.createElement(WaysToEarnScreen, null));
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
  }, /*#__PURE__*/React.createElement(WaysToEarnScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(WaysToEarnApp, null));
