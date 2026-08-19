/* ===========================================================================
   PROfinity — Katy · Leaderboard (Screen 13) · iPhone 17 Pro Max
   Rolling 30-day leaderboard: top 3 with avatars + reward targets, top 15
   table with rank-trend arrows. Katy's live rolling points (window.PFLoyalty)
   are merged into a mock clinician field so her real position is reflected.
   Suffixed -LB.
   =========================================================================== */
const {
  useState: useStateLB,
  useMemo: useMemoLB
} = React;
const DSLB = window.ProfinityDesignSystem_c2b5cc;
const PF_LB = window.PFLoyalty;
function goLB(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const LB_FIELD = [{
  name: "Marcus Webb",
  points: 9840,
  trend: "up"
}, {
  name: "Eleanor Pena",
  points: 8120,
  trend: "same"
}, {
  name: "Sofia Alarcón",
  points: 6790,
  trend: "up"
}, {
  name: "Jonas Adeyemi",
  points: 5310,
  trend: "down"
}, {
  name: "Grace Lindqvist",
  points: 4980,
  trend: "up"
}, {
  name: "Hana Kobayashi",
  points: 4400,
  trend: "same"
}, {
  name: "Ravi Chandran",
  points: 3920,
  trend: "down"
}, {
  name: "Olivia Marsh",
  points: 3510,
  trend: "up"
}, {
  name: "Deniz Aydın",
  points: 3105,
  trend: "same"
}, {
  name: "Priya Nandwani",
  points: 2640,
  trend: "down"
}, {
  name: "Liam O'Connor",
  points: 2210,
  trend: "up"
}, {
  name: "Amara Okafor",
  points: 1890,
  trend: "same"
}, {
  name: "Ben Fischer",
  points: 1420,
  trend: "down"
}, {
  name: "Nadia Petrova",
  points: 990,
  trend: "up"
}];
function initials(name) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("");
}
function LeaderboardScreen() {
  const [config] = useStateLB(() => PF_LB.getConfig());
  const [state] = useStateLB(() => PF_LB.getState());
  const ranked = useMemoLB(() => {
    const rows = LB_FIELD.map(r => ({
      ...r,
      isKaty: false
    })).concat([{
      name: state.user.name + " Moore",
      points: state.rollingPoints30,
      trend: "up",
      isKaty: true
    }]);
    return rows.sort((a, b) => b.points - a.points).map((r, i) => ({
      ...r,
      rank: i + 1
    }));
  }, [state]);
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3, 15);
  const prizeFor = rank => {
    const p = config.leaderboardPrizes.find(pr => {
      if (pr.rank.includes("–") || pr.rank.includes("-")) {
        const parts = pr.rank.split(/[–-]/).map(n => parseInt(n, 10));
        return rank >= parts[0] && rank <= (parts[1] || parts[0]);
      }
      return parseInt(pr.rank, 10) === rank;
    });
    return p ? p.prize : null;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen lb-screen",
    "data-screen-label": "Leaderboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goLB("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Leaderboard"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lb-window-note"
  }, "Rolling 30-day points · resets continuously"), /*#__PURE__*/React.createElement("div", {
    className: "lb-podium"
  }, [top3[1], top3[0], top3[2]].map((r, idx) => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    className: "lb-podium-item rank-" + r.rank + (r.isKaty ? " is-katy" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "lb-podium-avatar"
  }, initials(r.name)), /*#__PURE__*/React.createElement("span", {
    className: "lb-podium-rank"
  }, "#", r.rank), /*#__PURE__*/React.createElement("span", {
    className: "lb-podium-name"
  }, r.name), /*#__PURE__*/React.createElement("span", {
    className: "lb-podium-pts"
  }, PF_LB.formatNumber(r.points), " pts")))), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Top 15")), /*#__PURE__*/React.createElement("div", {
    className: "ml-card",
    style: {
      padding: 0
    }
  }, rest.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    className: "lb-row" + (r.isKaty ? " is-katy" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "lb-row-rank"
  }, "#", r.rank), /*#__PURE__*/React.createElement("span", {
    className: "lb-row-avatar"
  }, initials(r.name)), /*#__PURE__*/React.createElement("span", {
    className: "lb-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, r.name, r.isKaty && " (You)"), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, prizeFor(r.rank) || "—")), /*#__PURE__*/React.createElement("span", {
    className: "lb-row-pts"
  }, PF_LB.formatNumber(r.points)), /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
    name: r.trend === "up" ? "lucide:trending-up" : r.trend === "down" ? "lucide:trending-down" : "lucide:minus",
    size: 16,
    color: r.trend === "up" ? "var(--success)" : r.trend === "down" ? "var(--error)" : "var(--gray-400)"
  }))))));
}
function useDeviceScaleLB() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateLB(calc);
  React.useEffect(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileLB() {
  const [mobile, setMobile] = useStateLB(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function LeaderboardApp() {
  const mobile = useIsMobileLB();
  const scale = useDeviceScaleLB();
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
  }, /*#__PURE__*/React.createElement(LeaderboardScreen, null));
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
  }, /*#__PURE__*/React.createElement(LeaderboardScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(LeaderboardApp, null));
