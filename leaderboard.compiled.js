/* ===========================================================================
   PROfinity — Katy · Leaderboard (Screen 13) · iPhone 17 Pro Max
   Rolling 30-day points: podium for the top three (Lottie medals, photo
   avatars), then a Top 15 table with the member's own row pinned in view.
   Katy's live rolling points (window.PFLoyalty) are merged into a mock
   clinician field so her real position is reflected. Suffixed -LB.
   =========================================================================== */
const {
  useState: useStateLB,
  useMemo: useMemoLB,
  useRef: useRefLB,
  useEffect: useEffectLB
} = React;
const DSLB = window.ProfinityDesignSystem_c2b5cc;
const PF_LB = window.PFLoyalty;
function goLB(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const LB_FIELD = [{
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  points: 9840,
  trend: "up"
}, {
  name: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  points: 8120,
  trend: "up"
}, {
  name: "Sofia Alarcón",
  points: 6790,
  trend: "down"
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
  trend: "flat"
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
  trend: "flat"
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
  trend: "flat"
}, {
  name: "Ben Fischer",
  points: 1655,
  trend: "down"
}, {
  name: "Noor Haddad",
  points: 1420,
  trend: "up"
}];
const LB_TREND = {
  up: {
    icon: "lucide:arrow-up",
    color: "var(--success)",
    label: "moving up"
  },
  down: {
    icon: "lucide:arrow-down",
    color: "var(--error)",
    label: "moving down"
  },
  flat: {
    icon: "lucide:minus",
    color: "var(--gray-450)",
    label: "no change"
  }
};
const LB_RANK_AV = {
  1: "linear-gradient(135deg,#E0A968,#A26301)",
  2: "linear-gradient(135deg,#F3A0BF,#D9527F)",
  3: "linear-gradient(135deg,#4FC79A,#1E7A5C)"
};
const LB_MEDAL = {
  1: "https://lottie.host/28720031-47b0-40e1-9ec8-9471d11aecdc/39snvCfRBi.json",
  2: "https://lottie.host/f0ba8458-035f-4791-8f7b-fe35b6966784/EJulNpjOy8.json",
  3: "https://lottie.host/05d7c119-9b5d-4691-93e7-db51e81f37db/0OzwmI4XlR.json"
};

/* Render a Lottie from its raw JSON (bypasses the /embed iframe cache). */
function LBLottie({
  src,
  size
}) {
  const host = useRefLB(null);
  useEffectLB(() => {
    let anim;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: src
      });
    };
    if (window.lottie) start();else {
      const t = setInterval(() => {
        if (window.lottie) {
          clearInterval(t);
          start();
        }
      }, 120);
      setTimeout(() => clearInterval(t), 8000);
      return () => {
        clearInterval(t);
        if (anim) anim.destroy();
      };
    }
    return () => {
      if (anim) anim.destroy();
    };
  }, [src]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    style: {
      display: "block",
      width: size,
      height: size
    }
  });
}
function prizeForLB(config, rank) {
  const p = config.leaderboardPrizes.find(pr => {
    if (pr.rank.includes("–") || pr.rank.includes("-")) {
      const parts = pr.rank.split(/[–-]/).map(n => parseInt(n, 10));
      return rank >= parts[0] && rank <= (parts[1] || parts[0]);
    }
    return parseInt(pr.rank, 10) === rank;
  });
  return p ? p.prize : null;
}
function LBPodium({
  rows,
  prizeFor
}) {
  const order = [rows[1], rows[0], rows[2]];
  return /*#__PURE__*/React.createElement("div", {
    className: "lb-podium"
  }, order.map(r => /*#__PURE__*/React.createElement("div", {
    className: "lb-pod" + (r.rank === 1 ? " first" : "") + (r.rank === 2 ? " second" : "") + (r.rank === 3 ? " third" : ""),
    key: r.name
  }, /*#__PURE__*/React.createElement("span", {
    className: "lb-pod-crown"
  }, /*#__PURE__*/React.createElement(LBLottie, {
    src: LB_MEDAL[r.rank],
    size: r.rank === 1 ? 70 : 56
  })), /*#__PURE__*/React.createElement(DSLB.Avatar, {
    name: r.name,
    src: r.avatar,
    size: r.rank === 1 ? 62 : 52,
    style: LB_RANK_AV[r.rank] ? {
      flex: "none",
      background: LB_RANK_AV[r.rank]
    } : {
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "lb-pod-rank"
  }, "#", r.rank), /*#__PURE__*/React.createElement("span", {
    className: "lb-pod-name"
  }, r.name, r.isKaty ? " (You)" : ""), /*#__PURE__*/React.createElement("span", {
    className: "lb-pod-pts"
  }, PF_LB.formatNumber(r.points), " pts"), prizeFor(r.rank) && /*#__PURE__*/React.createElement("span", {
    className: "lb-pod-prize"
  }, prizeFor(r.rank)))));
}
function LBRow({
  r,
  meRef,
  prizeFor
}) {
  const t = LB_TREND[r.trend];
  return /*#__PURE__*/React.createElement("div", {
    className: "lb-row" + (r.isKaty ? " me" : ""),
    ref: r.isKaty ? meRef : null
  }, !LB_MEDAL[r.rank] && /*#__PURE__*/React.createElement("span", {
    className: "rk"
  }, "#", r.rank), LB_MEDAL[r.rank] && /*#__PURE__*/React.createElement("span", {
    className: "lb-row-medal r" + r.rank,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(LBLottie, {
    src: LB_MEDAL[r.rank],
    size: 44
  })), /*#__PURE__*/React.createElement(DSLB.Avatar, {
    name: r.name,
    src: r.avatar,
    size: 38,
    style: r.isKaty ? {
      flex: "none",
      background: "linear-gradient(135deg,#63AEFF,#3F86D4)"
    } : {
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, r.name, r.isKaty ? " (You)" : ""), prizeFor(r.rank) && /*#__PURE__*/React.createElement("i", null, prizeFor(r.rank))), /*#__PURE__*/React.createElement("span", {
    className: "pts"
  }, PF_LB.formatNumber(r.points)), /*#__PURE__*/React.createElement("span", {
    className: "tr",
    role: "img",
    "aria-label": t.label
  }, /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
    name: t.icon,
    size: 18,
    color: t.color
  })));
}
function LeaderboardScreen() {
  const [config] = useStateLB(() => PF_LB.getConfig());
  const [state] = useStateLB(() => PF_LB.getState());
  const scrollRef = useRefLB(null);
  const meRef = useRefLB(null);
  const ranked = useMemoLB(() => {
    const rows = LB_FIELD.map(r => ({
      ...r,
      isKaty: false
    })).concat([{
      name: state.user.name,
      points: state.rollingPoints30,
      trend: "up",
      avatar: "assets/avatar-katy.jpg",
      isKaty: true
    }]);
    return rows.sort((a, b) => b.points - a.points).map((r, i) => ({
      ...r,
      rank: i + 1
    }));
  }, [state]);
  useEffectLB(() => {
    const sc = scrollRef.current,
      row = meRef.current;
    if (!sc || !row) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      // centre the member's row without scrollIntoView
      const top = row.offsetTop - sc.clientHeight / 2 + row.offsetHeight / 2;
      sc.scrollTo({
        top: Math.max(0, top),
        behavior: reduce ? "auto" : "smooth"
      });
      if (!reduce) {
        row.classList.add("pop");
        setTimeout(() => row.classList.remove("pop"), 3500);
      }
    }, 650);
    return () => clearTimeout(t);
  }, []);
  const prizeFor = rank => prizeForLB(config, rank);
  const top3 = ranked.slice(0, 3);
  const me = ranked.find(r => r.isKaty);
  const ahead = ranked.find(r => r.rank === me.rank - 1);
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
    className: "ml-scroll lb-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("p", {
    className: "lb-sub"
  }, "Rolling 30-day points · resets continuously"), /*#__PURE__*/React.createElement(LBPodium, {
    rows: top3,
    prizeFor: prizeFor
  }), /*#__PURE__*/React.createElement("div", {
    className: "lb-you",
    "data-screen-label": "Your standing"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
    name: "lucide:flag",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "You're #", me.rank, " with ", PF_LB.formatNumber(me.points), " pts"), /*#__PURE__*/React.createElement("i", null, ahead ? PF_LB.formatNumber(ahead.points - me.points) + " pts behind " + ahead.name : "You're leading the board!")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lb-you-cta",
    onClick: () => goLB("RewardsDashboard.html")
  }, "Earn points")), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Top 15"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-coach-link",
    "data-coach": "Give me tips to climb the leaderboard and close the gap to the person ahead of me."
  }, /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
    name: "lucide:sparkles",
    size: 14,
    color: "var(--ai-purple)"
  }), "Discuss with Ava")), /*#__PURE__*/React.createElement("div", {
    className: "lb-table"
  }, ranked.map(r => /*#__PURE__*/React.createElement(LBRow, {
    key: r.name,
    r: r,
    meRef: meRef,
    prizeFor: prizeFor
  }))), /*#__PURE__*/React.createElement("p", {
    className: "lb-foot"
  }, "Points shown are earned in the last 30 days, so the board reflects recent activity rather than your lifetime total of ", PF_LB.formatNumber(state.lifetimePoints), " pts."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })));
}
function useDeviceScaleLB() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateLB(calc);
  useEffectLB(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileLB() {
  const [mobile, setMobile] = useStateLB(() => window.matchMedia("(max-width:768px)").matches);
  useEffectLB(() => {
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
