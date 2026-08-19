/* ===========================================================================
   PROfinity — Katy · Badge Progress (Screen 11) · iPhone 17 Pro Max
   Circular completion chart toward the next badge level, next-tier perks,
   and "Fast Track" suggestions (highest-value actions still available
   today). Backed by window.PFLoyalty. Suffixed -BPR.
   =========================================================================== */
const {
  useState: useStateBPR,
  useMemo: useMemoBPR
} = React;
const DSBPR = window.ProfinityDesignSystem_c2b5cc;
const PF_BPR = window.PFLoyalty;
function goBPR(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function nextLevelPerks(next) {
  if (!next) return ["You're at the top badge tier — keep earning to stay there."];
  if (next.splashPerks) return next.splashPerks;
  return [next.name + " badge on your profile", "Priority queueing for live events", "Higher weekly action caps"];
}
function BadgeProgressScreen() {
  const [state, setState] = useStateBPR(() => PF_BPR.getState());
  const [config] = useStateBPR(() => PF_BPR.getConfig());
  const [toast, setToast] = useStateBPR(null);
  const progress = useMemoBPR(() => PF_BPR.getBadgeProgress(state), [state]);
  const fastTrack = useMemoBPR(() => {
    return config.actions.filter(a => a.active).map(a => ({
      ...a,
      projected: Math.round(a.basePoints * PF_BPR.tierMultiplierFor(a, state.user.membershipTier))
    })).sort((a, b) => b.projected - a.projected).slice(0, 3);
  }, [config, state]);
  const doAction = id => {
    const res = PF_BPR.completeAction(id);
    setState(PF_BPR.getState());
    if (res.capped) {
      setToast("That action has hit its cap for now — try again later.");
    } else {
      setToast("+" + res.pointsAwarded + " pts, +" + res.creditsAwarded + " credits earned!");
    }
    setTimeout(() => setToast(null), 2400);
  };
  const pct = progress.pct;
  const deg = Math.round(pct / 100 * 360);
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen bpr-screen",
    "data-screen-label": "Badge Progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goBPR("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(DSBPR.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Badge Progress"), /*#__PURE__*/React.createElement("button", {
    className: "ml-top-action",
    "aria-label": "Badge Gallery",
    onClick: () => goBPR("BadgeGallery.html")
  }, /*#__PURE__*/React.createElement(DSBPR.IconifyIcon, {
    name: "lucide:award",
    size: 19,
    color: "var(--gray-700)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bpr-ring-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bpr-ring",
    style: {
      background: `conic-gradient(var(--brand-gold) ${deg}deg, var(--gray-200) 0deg)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bpr-ring-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bpr-ring-pct"
  }, pct, "%"), /*#__PURE__*/React.createElement("div", {
    className: "bpr-ring-label"
  }, pct < 100 ? "Almost there!" : "Maxed out!"))), /*#__PURE__*/React.createElement("div", {
    className: "bpr-ring-caption"
  }, PF_BPR.formatNumber(state.lifetimePoints), " / ", progress.next ? PF_BPR.formatNumber(progress.next.threshold) : PF_BPR.formatNumber(progress.current.threshold), " pts"), /*#__PURE__*/React.createElement("div", {
    className: "bpr-ring-sub"
  }, progress.current ? progress.current.name : "Unranked", " → ", progress.next ? progress.next.name : "Top Tier")), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "What you'll unlock at ", progress.next ? progress.next.name : "the next tier")), /*#__PURE__*/React.createElement("div", {
    className: "ml-card"
  }, nextLevelPerks(progress.next).map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "bpr-perk-row"
  }, /*#__PURE__*/React.createElement(DSBPR.IconifyIcon, {
    name: "lucide:sparkle",
    size: 16,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", null, p)))), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Fast Track to ", progress.next ? progress.next.name : "the top")), fastTrack.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    className: "ml-card bpr-fast-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bpr-fast-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, a.label), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, a.category)), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-sm ml-btn-navy",
    type: "button",
    onClick: () => doAction(a.id)
  }, "+", a.projected, " pts")))), toast && /*#__PURE__*/React.createElement("div", {
    className: "ml-toast"
  }, /*#__PURE__*/React.createElement(DSBPR.IconifyIcon, {
    name: "lucide:check-circle",
    size: 16,
    color: "#fff"
  }), toast));
}
function useDeviceScaleBPR() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateBPR(calc);
  React.useEffect(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileBPR() {
  const [mobile, setMobile] = useStateBPR(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function BadgeProgressApp() {
  const mobile = useIsMobileBPR();
  const scale = useDeviceScaleBPR();
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
  }, /*#__PURE__*/React.createElement(BadgeProgressScreen, null));
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
  }, /*#__PURE__*/React.createElement(BadgeProgressScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(BadgeProgressApp, null));
