/* ===========================================================================
   PROfinity — Katy · Milestone Path · iPhone 17 Pro Max
   A single vertical journey whose milestones ARE the six league badges
   (Jade → Topaz → Ruby → Emerald → Amethyst → Sapphire, window.PFLeague):
   each one unlocks its bundle of benefits automatically and permanently the
   moment Lifetime Points cross its threshold, and crossing it is also what
   moves the member up a league. No choices, no CTA to tap — this screen is a
   status view of a path the member is already walking.
   Reads window.PFLoyalty.getMilestoneProgress() (thresholds) and decorates
   each node with its league gem Lottie + accent. Classes prefixed mp-.
   Reached from the Rewards dashboard quick nav (mobile + web). Suffixed -MP.
   =========================================================================== */
const {
  useState: useStateMP,
  useEffect: useEffectMP,
  useMemo: useMemoMP
} = React;
const DSMP = window.ProfinityDesignSystem_c2b5cc;
const PF_MP = window.PFLoyalty;
const LG_MP = window.PFLeague || null;

/* league gem (raw JSON via lottie-web); parked on a mid frame unless `play` */
function GemMP({
  src,
  size,
  play
}) {
  const host = React.useRef(null);
  useEffectMP(() => {
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
      anim.addEventListener("DOMLoaded", () => {
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
      if (anim) anim.destroy();
    };
  }, [src, play]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "mp-gem",
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  });
}
function leagueMP(key) {
  try {
    return LG_MP && LG_MP.getLeague ? LG_MP.getLeague(key) : null;
  } catch (e) {
    return null;
  }
}
function goMP(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function retMP() {
  try {
    const r = new URLSearchParams(location.search).get("ret");
    if (r && /^[A-Za-z0-9_./?=&-]+$/.test(r)) return r;
  } catch (e) {}
  return "RewardsDashboard.html";
}
function whenMP(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return null;
  }
}
function MilestoneNodeMP({
  milestone,
  status,
  isLast,
  reachedAt,
  onOpen
}) {
  // status: "passed" | "current" | "locked"
  const reached = status === "passed" ? whenMP(reachedAt) : null;
  const league = leagueMP(milestone.key);
  const vars = league ? {
    "--lg-accent": league.accent,
    "--lg-deep": league.deep,
    "--lg-soft": league.soft
  } : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-node mp-node-" + status + (league ? " mp-node-league" : ""),
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    className: "mp-node-rail"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-node-dot mp-node-dot-" + status,
    "aria-hidden": "true"
  }, status === "passed" ? /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:check",
    size: 14,
    color: "#fff"
  }) : status === "current" ? /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:map-pin",
    size: 14,
    color: "#fff"
  }) : /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:lock",
    size: 13,
    color: "#fff"
  })), !isLast && /*#__PURE__*/React.createElement("span", {
    className: "mp-node-line mp-node-line-" + status,
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mp-node-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mp-node-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-node-title"
  }, league ? /*#__PURE__*/React.createElement(GemMP, {
    src: league.lottie,
    size: 40,
    play: status === "current"
  }) : null, /*#__PURE__*/React.createElement("span", {
    className: "mp-node-name"
  }, milestone.name, league ? /*#__PURE__*/React.createElement("small", null, " League") : null)), /*#__PURE__*/React.createElement("span", {
    className: "mp-node-pts"
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:star",
    size: 12,
    color: "currentColor"
  }), milestone.threshold > 0 ? PF_MP.formatNumber(milestone.threshold) + " pts" : "Start")), /*#__PURE__*/React.createElement("div", {
    className: "mp-node-benefits"
  }, milestone.benefits.map((b, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "mp-benefit-row",
    onClick: () => onOpen({
      benefit: b,
      index: i,
      milestone,
      status,
      reachedAt
    }),
    "aria-label": b.title + (status === "passed" ? ", unlocked" : ", locked") + ". View reward"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-benefit-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: status === "locked" ? "lucide:lock" : "lucide:gift",
    size: 15,
    color: status === "locked" ? "var(--gray-400)" : "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mp-benefit-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-benefit-title"
  }, b.title), /*#__PURE__*/React.createElement("span", {
    className: "mp-benefit-desc"
  }, b.description), b.delivery ? /*#__PURE__*/React.createElement("span", {
    className: "mp-benefit-delivery"
  }, b.delivery) : null), /*#__PURE__*/React.createElement("span", {
    className: "mp-benefit-chev",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 16,
    color: "var(--gray-400)"
  }))))), status === "passed" && /*#__PURE__*/React.createElement("div", {
    className: "mp-node-tag mp-node-tag-passed"
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:check-circle",
    size: 12,
    color: "currentColor"
  }), milestone.threshold > 0 ? "Badge earned — yours for good" : "Your starting league", reached && milestone.threshold > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "mp-node-when"
  }, " · ", reached) : null), status === "current" && /*#__PURE__*/React.createElement("div", {
    className: "mp-node-tag mp-node-tag-current"
  }, "Next league — unlocks automatically"), status === "locked" && /*#__PURE__*/React.createElement("div", {
    className: "mp-node-tag mp-node-tag-locked"
  }, "Locked")));
}

/* Tapping a benefit row opens this reward sheet (user, 2026-09-24): what the
   reward is, which league unlocks it, unlocked / N pts to go, and a CTA that
   takes the member where the reward is used. */
function rewardActionMP(b) {
  const t = ((b.title || "") + " " + (b.delivery || "")).toLowerCase();
  if (/credit|discount|voucher|checkout/.test(t)) return {
    label: "View my reward code",
    href: "MyRewards.html",
    icon: "lucide:ticket"
  };
  if (/directory|profile/.test(t)) return {
    label: "View your profile",
    href: "ProfileMobile.html",
    icon: "lucide:user"
  };
  if (/mentorship|dinner|concierge|calendar/.test(t)) return {
    label: "Book via concierge",
    href: "ChatSupport.html",
    icon: "lucide:calendar"
  };
  if (/event|seat|ticket/.test(t)) return {
    label: "See upcoming events",
    href: "EventsMobile.html",
    icon: "lucide:calendar"
  };
  if (/leaderboard/.test(t)) return {
    label: "Open the leaderboard",
    href: "Leaderboard.html",
    icon: "lucide:bar-chart-3"
  };
  if (/bundle|digital|tools/.test(t)) return {
    label: "Open My Learning",
    href: "LearningMobile.html",
    icon: "lucide:book-open"
  };
  return null;
}
function RewardSheetMP({
  item,
  state,
  onClose
}) {
  useEffectMP(() => {
    if (!item) return;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item, onClose]);
  if (!item) return null;
  const {
    benefit: b,
    milestone: m,
    status
  } = item;
  const league = leagueMP(m.key);
  const vars = league ? {
    "--lg-accent": league.accent,
    "--lg-deep": league.deep,
    "--lg-soft": league.soft
  } : null;
  const pts = state.lifetimePoints || 0;
  const remaining = Math.max(0, m.threshold - pts);
  const unlocked = status === "passed";
  const reached = unlocked ? whenMP(item.reachedAt) : null;
  const action = unlocked ? rewardActionMP(b) : null;
  const floor = (() => {
    try {
      const path = PF_MP.getMilestoneProgress(state).path;
      const i = path.findIndex(x => x.key === m.key);
      return i > 0 ? path[i - 1].threshold : 0;
    } catch (e) {
      return 0;
    }
  })();
  const pct = unlocked ? 100 : Math.max(0, Math.min(100, Math.round((pts - floor) / Math.max(1, m.threshold - floor) * 100)));
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "mp-help-sheet mp-rw-sheet" + (unlocked ? " is-unlocked" : " is-locked"),
    style: vars,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "mp-rw-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-help-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mp-rw-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-rw-gem",
    "aria-hidden": "true"
  }, league ? /*#__PURE__*/React.createElement(GemMP, {
    src: league.lottie,
    size: 56,
    play: unlocked
  }) : /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:gift",
    size: 26,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mp-rw-head-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-rw-league"
  }, m.name, league ? " League" : "", " · ", m.threshold > 0 ? PF_MP.formatNumber(m.threshold) + " pts" : "Start"), /*#__PURE__*/React.createElement("h2", {
    id: "mp-rw-title"
  }, b.title)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mp-help-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "mp-help-p"
  }, b.description), b.delivery ? /*#__PURE__*/React.createElement("div", {
    className: "mp-rw-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-rw-row-ic"
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:gift",
    size: 15,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "How you get it"), /*#__PURE__*/React.createElement("i", null, b.delivery))) : null, /*#__PURE__*/React.createElement("div", {
    className: "mp-rw-status" + (unlocked ? " on" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-rw-status-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: unlocked ? "lucide:check-circle" : "lucide:lock",
    size: 16,
    color: unlocked ? "var(--lg-deep, var(--success))" : "var(--gray-500)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mp-rw-status-tx"
  }, /*#__PURE__*/React.createElement("b", null, unlocked ? "Unlocked — yours for good" : status === "current" ? PF_MP.formatNumber(remaining) + " pts to unlock" : "Unlocks at " + PF_MP.formatNumber(m.threshold) + " pts"), /*#__PURE__*/React.createElement("i", null, unlocked ? reached ? "Earned " + reached : "Earned with your " + m.name + " badge" : PF_MP.formatNumber(pts) + " of " + PF_MP.formatNumber(m.threshold) + " lifetime pts · " + PF_MP.formatNumber(remaining) + " to go"))), !unlocked ? /*#__PURE__*/React.createElement("div", {
    className: "ml-progress-track mp-rw-track",
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": pct
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-progress-fill",
    style: {
      width: pct + "%"
    }
  })) : null, unlocked && action ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mp-help-ok mp-rw-cta",
    onClick: () => {
      onClose();
      goMP(action.href);
    }
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: action.icon,
    size: 16,
    color: "#fff"
  }), action.label) : unlocked ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mp-help-ok",
    onClick: onClose
  }, "Got it") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mp-help-ok mp-rw-cta",
    onClick: () => {
      onClose();
      goMP("WaysToEarn.html");
    }
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:sparkles",
    size: 16,
    color: "#fff"
  }), "Earn points faster"), !unlocked ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mp-rw-later",
    onClick: onClose
  }, "Maybe later") : null));
}

/* Header "?" opens this — the how-it-works copy used to sit in an always-on
   intro card above the progress; the user asked for it behind a help button. */
function MilestoneHelpSheetMP({
  open,
  onClose
}) {
  useEffectMP(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "mp-help-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "mp-help-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-help-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mp-help-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-help-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:milestone",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h2", {
    id: "mp-help-title"
  }, "How the path works"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mp-help-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "mp-help-p"
  }, "One journey, no choices to make — each milestone is a league badge. The moment your Lifetime Points reach it you move up a league and its full bundle of benefits unlocks, yours forever."), /*#__PURE__*/React.createElement("p", {
    className: "mp-help-p"
  }, "Points never get spent, so nothing here ever locks back up."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mp-help-ok",
    onClick: onClose
  }, "Got it")));
}

/* League progress card (moved here from the Rewards dashboard header,
   2026-09-24): current gem left, next gem greyed + locked right, points bar
   between them, "N of M pts" scale and "N more pts to X League" note.
   Reads PFLeague.getProgress() (thresholds = this very path); taps through to
   the Leaderboard. */
function LeagueProgressMP() {
  const [p, setP] = useStateMP(() => {
    try {
      return LG_MP ? LG_MP.getProgress() : null;
    } catch (e) {
      return null;
    }
  });
  useEffectMP(() => {
    const refresh = () => {
      try {
        setP(LG_MP ? LG_MP.getProgress() : null);
      } catch (e) {}
    };
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("pf:points-earned", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  if (!p || !p.current) return null;
  const cur = p.current,
    next = p.next,
    edge = next || cur;
  const vars = {
    "--lg-accent": cur.accent,
    "--lg-deep": cur.deep,
    "--nx-accent": edge.accent,
    "--nx-deep": edge.deep
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mp-lg",
    style: vars,
    onClick: () => goMP("Leaderboard.html"),
    "aria-label": cur.name + " League, " + (next ? PF_MP.formatNumber(p.need) + " more points to " + next.name : "highest badge") + ". Open the leaderboard"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-lg-gem cur"
  }, /*#__PURE__*/React.createElement(GemMP, {
    src: cur.lottie,
    size: 60,
    play: true
  })), /*#__PURE__*/React.createElement("span", {
    className: "mp-lg-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-lg-top"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--lg-deep)"
    }
  }, cur.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--nx-deep)"
    }
  }, next ? next.name : "Top badge")), /*#__PURE__*/React.createElement("span", {
    className: "ml-progress-track mp-lg-track",
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": p.pct
  }, /*#__PURE__*/React.createElement("span", {
    className: "ml-progress-fill",
    style: {
      width: p.pct + "%",
      background: "linear-gradient(90deg, var(--lg-accent), var(--nx-accent))"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mp-lg-scale"
  }, /*#__PURE__*/React.createElement("span", null, PF_MP.formatNumber(p.points), next ? " of " + PF_MP.formatNumber(next.requires) : "", " pts"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--nx-deep)"
    }
  }, next ? "Unlocks at " + PF_MP.formatNumber(next.requires) + " pts" : "Complete")), /*#__PURE__*/React.createElement("span", {
    className: "mp-lg-note"
  }, next ? PF_MP.formatNumber(p.need) + " more pts to " + next.name + " League" : "You've reached Sapphire — the whole path, every benefit, is yours.")), /*#__PURE__*/React.createElement("span", {
    className: "mp-lg-gem next" + (next ? " locked" : "")
  }, /*#__PURE__*/React.createElement(GemMP, {
    src: edge.lottie,
    size: 60,
    play: false
  }), next ? /*#__PURE__*/React.createElement("span", {
    className: "mp-lg-lock"
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:lock",
    size: 12,
    color: "#fff"
  })) : null));
}
function MilestonePathScreen() {
  const [state, setState] = useStateMP(() => PF_MP.getState());
  const [helpOpen, setHelpOpen] = useStateMP(false);
  // ?reward=<milestoneKey>:<benefitIndex> opens a reward sheet on load (demo / QA)
  const [reward, setReward] = useStateMP(null);
  useEffectMP(() => {
    try {
      const q = new URLSearchParams(location.search).get("reward");
      if (!q) return;
      const [key, idx] = q.split(":");
      const prog = PF_MP.getMilestoneProgress(PF_MP.getState());
      const m = prog.path.find(x => x.key === key);
      const b = m && m.benefits[Number(idx) || 0];
      if (!b) return;
      const st = prog.passed.some(x => x.key === key) ? "passed" : prog.next && prog.next.key === key ? "current" : "locked";
      setReward({
        benefit: b,
        index: Number(idx) || 0,
        milestone: m,
        status: st,
        reachedAt: (PF_MP.getState().milestonesReachedAt || {})[key]
      });
    } catch (e) {}
  }, []);
  // other tabs / the points pill may book points while this is open
  useEffectMP(() => {
    const refresh = () => setState(PF_MP.getState());
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("pf:points-earned", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const progress = useMemoMP(() => PF_MP.getMilestoneProgress(state), [state]);
  const path = progress.path;
  const passedKeys = new Set(progress.passed.map(m => m.key));
  const currentKey = progress.next ? progress.next.key : null;
  const reachedAt = state.milestonesReachedAt || {};
  const allDone = !progress.next;
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen mp-screen",
    "data-screen-label": "Milestone Path"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goMP(retMP())
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Milestone Path"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ml-top-action mp-help-btn",
    "aria-label": "How the Milestone Path works",
    "aria-haspopup": "dialog",
    "aria-expanded": helpOpen,
    onClick: () => setHelpOpen(true)
  }, /*#__PURE__*/React.createElement(DSMP.IconifyIcon, {
    name: "lucide:circle-help",
    size: 20,
    color: "var(--gray-900)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll mp-scroll"
  }, /*#__PURE__*/React.createElement(LeagueProgressMP, null), /*#__PURE__*/React.createElement("div", {
    className: "mp-path"
  }, path.map((m, i) => {
    const status = passedKeys.has(m.key) ? "passed" : m.key === currentKey ? "current" : "locked";
    return /*#__PURE__*/React.createElement(MilestoneNodeMP, {
      key: m.key,
      milestone: m,
      status: status,
      isLast: i === path.length - 1,
      reachedAt: reachedAt[m.key],
      onOpen: setReward
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), /*#__PURE__*/React.createElement(MilestoneHelpSheetMP, {
    open: helpOpen,
    onClose: () => setHelpOpen(false)
  }), /*#__PURE__*/React.createElement(RewardSheetMP, {
    item: reward,
    state: state,
    onClose: () => setReward(null)
  }));
}
function useDeviceScaleMP() {
  const [scale, setScale] = useStateMP(() => Math.min(1, (window.innerHeight - 40) / 956));
  useEffectMP(() => {
    const u = () => setScale(Math.min(1, (window.innerHeight - 40) / 956));
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileMP() {
  const [mobile, setMobile] = useStateMP(() => window.matchMedia("(max-width:768px)").matches);
  useEffectMP(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkMP() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateMP(read);
  useEffectMP(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => mo.disconnect();
  }, []);
  return dark;
}
function MilestonePathApp() {
  const mobile = useIsMobileMP();
  const scale = useDeviceScaleMP();
  const dark = useIsDarkMP();
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
  }, /*#__PURE__*/React.createElement(MilestonePathScreen, null));
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
  }, /*#__PURE__*/React.createElement(MilestonePathScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MilestonePathApp, null));
