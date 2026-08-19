/* ===========================================================================
   PROfinity — Katy · Badge Detail (Screen 16) · iPhone 17 Pro Max
   Deep dive into a single achievement badge: progress ring, checklist of
   contributing actions, and the final reward granted. Badge key comes from
   ?badge=<key> in the URL, falling back to the first badge. Suffixed -BDT.
   =========================================================================== */
const {
  useState: useStateBDT
} = React;
const DSBDT = window.ProfinityDesignSystem_c2b5cc;
const PF_BDT = window.PFLoyalty;
function goBDT(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function getBadgeKeyFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get("badge");
  } catch (e) {
    return null;
  }
}
function BadgeDetailScreen() {
  const [config] = useStateBDT(() => PF_BDT.getConfig());
  const [state] = useStateBDT(() => PF_BDT.getState());
  const key = getBadgeKeyFromUrl() || config.achievementBadges[0].key;
  const badge = config.achievementBadges.find(b => b.key === key) || config.achievementBadges[0];
  const unlocked = state.unlockedAchievements.includes(badge.key);
  const c = badge.criteria;
  const contributing = c.type === "actionCount" ? state.ledger.filter(t => t.pointsDelta > 0 && (c.actionId ? t.actionId === c.actionId : true)) : [];
  const count = c.type === "actionCount" ? contributing.length : c.type === "redeemCount" ? state.redeemedVouchers.length : Math.max(state.streak.current, state.streak.longest);
  const target = c.count;
  const pct = Math.min(100, Math.round(count / target * 100));
  const deg = Math.round(pct / 100 * 360);
  const checklistLabel = c.type === "actionCount" ? PF_BDT.getActionById(c.actionId) ? PF_BDT.getActionById(c.actionId).label : "Any point-earning action" : c.type === "redeemCount" ? "Redeem a Rewards Store item" : "Reach a check-in streak";
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen bdt-screen",
    "data-screen-label": "Badge Detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goBDT("BadgeGallery.html")
  }, /*#__PURE__*/React.createElement(DSBDT.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, badge.name), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdt-ring-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdt-ring",
    style: {
      background: `conic-gradient(var(--brand-navy) ${deg}deg, var(--gray-200) 0deg)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdt-ring-inner"
  }, /*#__PURE__*/React.createElement(DSBDT.IconifyIcon, {
    name: badge.icon,
    size: 34,
    color: unlocked ? "var(--brand-navy)" : "var(--gray-400)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bdt-ring-pct"
  }, pct, "%"), /*#__PURE__*/React.createElement("div", {
    className: "bdt-desc"
  }, badge.description)), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Checklist")), /*#__PURE__*/React.createElement("div", {
    className: "ml-card"
  }, Array.from({
    length: target
  }).map((_, i) => {
    const done = i < count;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "bdt-checklist-row" + (done ? " is-done" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "bdt-checklist-check"
    }, done && /*#__PURE__*/React.createElement(DSBDT.IconifyIcon, {
      name: "lucide:check",
      size: 12,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", null, checklistLabel, " ", target > 1 ? "(" + (i + 1) + "/" + target + ")" : ""));
  })), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Reward Granted")), /*#__PURE__*/React.createElement("div", {
    className: "ml-card bdt-reward-row"
  }, /*#__PURE__*/React.createElement(DSBDT.IconifyIcon, {
    name: "lucide:gift",
    size: 22,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", null, badge.reward)), !unlocked && /*#__PURE__*/React.createElement("div", {
    className: "ml-card bdt-locked-note"
  }, /*#__PURE__*/React.createElement(DSBDT.IconifyIcon, {
    name: "lucide:lock",
    size: 16,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("span", null, "Keep going — ", Math.max(0, target - count), " more to unlock this badge."))));
}
function useDeviceScaleBDT() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateBDT(calc);
  React.useEffect(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileBDT() {
  const [mobile, setMobile] = useStateBDT(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function BadgeDetailApp() {
  const mobile = useIsMobileBDT();
  const scale = useDeviceScaleBDT();
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
  }, /*#__PURE__*/React.createElement(BadgeDetailScreen, null));
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
  }, /*#__PURE__*/React.createElement(BadgeDetailScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(BadgeDetailApp, null));
