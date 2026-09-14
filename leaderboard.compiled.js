/* ===========================================================================
   PROfinity — Katy · Leaderboard (Screen 13) · iPhone 17 Pro Max
   Six gem leagues (Jade → Sapphire, window.PFLeague) sit in a swipeable
   rail at the top; the member's badge is earned through milestones, higher
   badges are locked. Every league has its own board: podium for its top
   three (Lottie medals, photo avatars) then a table, with the member's own
   row pinned in view on her league. Katy's live rolling points
   (window.PFLoyalty) are merged into her league's mock field. Suffixed -LB.
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
const PF_LG = window.PFLeague;

/* per-league mock fields live in league-engine.js (shared with Profile + Dashboard) */
const LB_LEAGUE_FIELD = PF_LG.FIELDS;
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
  1: "https://lottie.host/0be82390-65c3-4b3f-9178-0f7d50a4e3eb/vzysweXhDd.json",
  2: "https://lottie.host/61695d13-bfb4-44ca-b7c8-4294c5da276f/jqYjY8niTd.json",
  3: "https://lottie.host/983acca2-10f7-4703-96b8-171eb8935c48/hzKqpq06Qi.json"
};

/* Render a Lottie from its raw JSON (bypasses the /embed iframe cache).
   play=false parks it on a mid frame so a rail of six badges only animates
   the one in focus. */
function LBLottie({
  src,
  size,
  play = true
}) {
  const host = useRefLB(null);
  const animRef = useRefLB(null);
  useEffectLB(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: src
      });
      animRef.current = anim;
      anim.addEventListener("DOMLoaded", () => {
        if (!animRef.current) return;
        if (play) anim.play();else anim.goToAndStop(Math.floor(anim.totalFrames * 0.4), true);
      });
    };
    if (window.lottie) start();else {
      t = setInterval(() => {
        if (window.lottie) {
          clearInterval(t);
          start();
        }
      }, 120);
      setTimeout(() => clearInterval(t), 8000);
    }
    return () => {
      clearInterval(t);
      animRef.current = null;
      if (anim) anim.destroy();
    };
  }, [src]);
  useEffectLB(() => {
    const a = animRef.current;
    if (!a || !a.isLoaded) return;
    if (play) a.play();else a.goToAndStop(Math.floor(a.totalFrames * 0.4), true);
  }, [play]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    style: {
      display: "block",
      width: size,
      height: size
    }
  });
}

/* Swipeable rail of the six gem badges. The member's own badge and the ones
   below it are earned; everything above is greyed and locked. Tapping a badge
   shows that league's board. */
function LBLeagueRail({
  leagues,
  myIndex,
  selected,
  onSelect
}) {
  const railRef = useRefLB(null);
  useEffectLB(() => {
    const rail = railRef.current;
    if (!rail) return;
    const el = rail.querySelector('[data-idx="' + selected + '"]');
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const left = el.offsetLeft - rail.clientWidth / 2 + el.offsetWidth / 2;
    rail.scrollTo({
      left: Math.max(0, left),
      behavior: reduce ? "auto" : "smooth"
    });
  }, [selected]);
  return /*#__PURE__*/React.createElement("div", {
    className: "lb-rail",
    ref: railRef,
    role: "tablist",
    "aria-label": "Leagues"
  }, leagues.map((l, i) => {
    const locked = i > myIndex,
      mine = i === myIndex,
      sel = i === selected;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: l.key,
      "data-idx": i,
      role: "tab",
      "aria-selected": sel,
      className: "lb-rail-item" + (sel ? " sel" : "") + (locked ? " locked" : "") + (mine ? " mine" : ""),
      style: {
        "--lg-accent": l.accent,
        "--lg-soft": l.soft
      },
      "aria-label": l.name + " League" + (locked ? ", locked" : mine ? ", your league" : ""),
      onClick: () => onSelect(i)
    }, /*#__PURE__*/React.createElement("span", {
      className: "lb-rail-gem"
    }, /*#__PURE__*/React.createElement(LBLottie, {
      src: l.lottie,
      size: sel ? 96 : 66,
      play: sel
    }), locked && /*#__PURE__*/React.createElement("span", {
      className: "lb-rail-lock"
    }, /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
      name: "lucide:lock",
      size: 16,
      color: "#fff"
    }))), mine && /*#__PURE__*/React.createElement("span", {
      className: "lb-rail-you"
    }, "You"));
  }));
}

/* Badge milestones: what earns the next gem. */
function LBMilestones({
  progress,
  milestones
}) {
  const {
    current,
    next,
    done,
    need,
    pct
  } = progress;
  const pending = milestones.filter(m => !m.done);
  const finished = milestones.filter(m => m.done);
  const list = pending.slice(0, 4).concat(finished.slice(-2));
  return /*#__PURE__*/React.createElement("div", {
    className: "lb-ms",
    "data-screen-label": "Badge milestones"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lb-ms-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lb-ms-gem"
  }, /*#__PURE__*/React.createElement(LBLottie, {
    src: (next || current).lottie,
    size: 54,
    play: false
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, next ? "Next badge: " + next.name : "Highest badge earned"), /*#__PURE__*/React.createElement("i", null, next ? need + " more milestone" + (need === 1 ? "" : "s") + " to unlock · " + done + " of " + milestones.length + " done" : "You've completed every league milestone.")), /*#__PURE__*/React.createElement("span", {
    className: "lb-ms-pct",
    style: {
      color: (next || current).deep
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "lb-ms-bar",
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + "%",
      background: (next || current).accent
    }
  })), /*#__PURE__*/React.createElement("ul", {
    className: "lb-ms-list"
  }, list.map(m => /*#__PURE__*/React.createElement("li", {
    key: m.id,
    className: m.done ? "done" : ""
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: m.done ? {
      background: (next || current).soft,
      color: (next || current).deep
    } : null
  }, /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
    name: m.done ? "lucide:check" : m.icon,
    size: 17,
    color: m.done ? (next || current).deep : "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lb"
  }, m.label), /*#__PURE__*/React.createElement("span", {
    className: "ct",
    style: m.done ? {
      color: (next || current).deep
    } : null
  }, m.done ? "Done" : Math.min(m.have, m.target) + "/" + m.target)))));
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
      background: "linear-gradient(135deg,#FDBF38,#F39E3D)"
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
  const leagues = useMemoLB(() => PF_LG.getLeagues(), []);
  const [progress, setProgress] = useStateLB(() => PF_LG.getProgress());
  const milestones = useMemoLB(() => PF_LG.getMilestones(), [progress]);
  const myIndex = progress.index;
  const [selected, setSelected] = useStateLB(myIndex);
  const [toast, setToast] = useStateLB(null);
  const scrollRef = useRefLB(null);
  const meRef = useRefLB(null);
  const msRef = useRefLB(null);

  /* another tab / demo API changed the counters */
  useEffectLB(() => {
    const onChange = e => {
      const p = PF_LG.getProgress();
      setProgress(p);
      setSelected(p.index);
      if (e && e.detail && e.detail.up) {
        setToast("Promoted to " + p.current.name + " League!");
        setTimeout(() => setToast(null), 2600);
      }
    };
    document.addEventListener("pf:league-changed", onChange);
    return () => document.removeEventListener("pf:league-changed", onChange);
  }, []);
  const league = leagues[selected];
  const isMine = selected === myIndex;
  const locked = selected > myIndex;
  const ranked = useMemoLB(() => {
    const rows = (LB_LEAGUE_FIELD[league.key] || []).map(r => ({
      ...r,
      isKaty: false
    }));
    if (isMine) rows.push({
      name: state.user.name,
      points: state.rollingPoints30,
      trend: "up",
      avatar: "assets/avatar-katy.jpg",
      isKaty: true
    });
    return rows.sort((a, b) => b.points - a.points).map((r, i) => ({
      ...r,
      rank: i + 1
    }));
  }, [state, league, isMine]);
  useEffectLB(() => {
    const sc = scrollRef.current,
      row = meRef.current;
    if (!sc) return;
    if (!isMine || !row) {
      sc.scrollTo({
        top: 0,
        behavior: "auto"
      });
      return;
    }
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
  }, [isMine, league]);
  const prizeFor = rank => prizeForLB(config, rank);
  const top3 = ranked.slice(0, 3);
  const me = ranked.find(r => r.isKaty);
  const ahead = me ? ranked.find(r => r.rank === me.rank - 1) : null;
  const needFor = idx => Math.max(0, leagues[idx].requires - progress.done);
  const goMilestones = () => {
    const sc = scrollRef.current,
      el = msRef.current;
    if (!sc || !el) return;
    const top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 12;
    sc.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth"
    });
  };
  const vars = {
    "--lg-accent": league.accent,
    "--lg-deep": league.deep,
    "--lg-soft": league.soft
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen lb-screen",
    "data-screen-label": "Leaderboard",
    style: vars
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "lb-league-head",
    "data-screen-label": "League title"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "lb-league-title",
    style: {
      color: league.deep
    }
  }, league.name, " League"), /*#__PURE__*/React.createElement("p", {
    className: "lb-sub"
  }, isMine ? (progress.preview ? "Preview · " : "Your league · ") + "rolling 30-day points" : locked ? "Locked · " + needFor(selected) + " more milestone" + (needFor(selected) === 1 ? "" : "s") + " to unlock" : "Earned · you've moved up from here")), /*#__PURE__*/React.createElement(LBLeagueRail, {
    leagues: leagues,
    myIndex: myIndex,
    selected: selected,
    onSelect: setSelected
  }), /*#__PURE__*/React.createElement(LBPodium, {
    rows: top3,
    prizeFor: prizeFor
  }), isMine && me && /*#__PURE__*/React.createElement("div", {
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
  }, "Earn points")), locked && /*#__PURE__*/React.createElement("div", {
    className: "lb-you lb-you-locked",
    "data-screen-label": "Locked league"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
    name: "lucide:lock",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Unlock ", league.name, " League"), /*#__PURE__*/React.createElement("i", null, "Complete ", needFor(selected), " more milestone", needFor(selected) === 1 ? "" : "s", " to earn this badge")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lb-you-cta",
    onClick: goMilestones
  }, "See milestones")), !isMine && !locked && /*#__PURE__*/React.createElement("div", {
    className: "lb-you lb-you-earned",
    "data-screen-label": "Earned league"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSLB.IconifyIcon, {
    name: "lucide:badge-check",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, league.name, " badge earned"), /*#__PURE__*/React.createElement("i", null, "You now compete in ", leagues[myIndex].name, " League")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lb-you-cta",
    onClick: () => setSelected(myIndex)
  }, "My league")), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Top ", ranked.length)), /*#__PURE__*/React.createElement("div", {
    className: "lb-table"
  }, ranked.map(r => /*#__PURE__*/React.createElement(LBRow, {
    key: r.name,
    r: r,
    meRef: meRef,
    prizeFor: prizeFor
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lb-ms-wrap",
    ref: msRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Badge milestones")), /*#__PURE__*/React.createElement(LBMilestones, {
    progress: progress,
    milestones: milestones
  })), /*#__PURE__*/React.createElement("p", {
    className: "lb-foot"
  }, "Points shown are earned in the last 30 days, so the board reflects recent activity rather than your lifetime total of ", PF_LB.formatNumber(state.lifetimePoints), " pts. Badges are earned through milestones, not points."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), toast && /*#__PURE__*/React.createElement("div", {
    className: "ml-toast lb-toast",
    role: "status"
  }, toast));
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
