/* ===========================================================================
   PROfinity — Rewards Dashboard (web)
   Desktop counterpart to RewardsDashboard.html (rewards-dashboard.jsx): the
   Loyalty & Gamification hub — greeting, league badge progress card (PFLeague
   gems, milestone-based), streak-at-risk banner, Lifetime Points / Spendable
   Credits / Active Streak stat tiles (streak → CheckInStreak), "Your league"
   card, "Jump back in" quick nav (Store / My Rewards / Leaderboard / Ways to
   Earn), Next Available Reward (course discount) and Recent Activity — on the
   web page shell (TopNav + centered two-column layout)
   instead of the phone frame. Reads/writes the same localStorage-backed
   window.PFLoyalty engine, so the numbers match the mobile screens. Reached from
   the account menu (account-menu.js). Suffixed -RW to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateRW,
  useEffect: useEffectRW,
  useRef: useRefRW
} = React;
const DSRW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavRW,
  IconifyIcon: IconifyRW
} = DSRW;
const PF_RW = window.PFLoyalty;
const ME_RW = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function goRW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateRW(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goRW(u);
}
function fmtClockRW(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000),
    m = Math.floor(ms % 3600000 / 60000),
    s = Math.floor(ms % 60000 / 1000);
  return [h, m, s].map(n => String(n).padStart(2, "0")).join(":");
}
function fmtRelDateRW(iso) {
  const diffH = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (diffH < 1) return "just now";
  if (diffH < 24) return Math.round(diffH) + "h ago";
  return Math.round(diffH / 24) + "d ago";
}
function fmtFullDateRW(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short"
  }) + " · " + d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* --------------------------------------------------------- risk banner */
/* Same rule as the mobile page: the streak lapses 24h after the last check-in,
   so warn from 12h+ without a check-in (or an explicit riskDeadline). */
const RW_STREAK_WINDOW_MS = 24 * 3600000;
const RW_STREAK_WARN_MS = 12 * 3600000;
function rwStreakDeadline(streak) {
  if (!streak || !streak.current || streak.frozen) return null;
  if (streak.riskDeadline) return new Date(streak.riskDeadline).getTime();
  const last = streak.lastCheckIn ? new Date(streak.lastCheckIn).getTime() : 0;
  if (!last || Date.now() - last < RW_STREAK_WARN_MS) return null;
  return last + RW_STREAK_WINDOW_MS;
}
function NotificationPreviewRW({
  hoursLabel,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rw-notif-preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-notif-icon"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:bell-ring",
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rw-notif-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-notif-title"
  }, "PROfinity ", /*#__PURE__*/React.createElement("span", null, hoursLabel)), /*#__PURE__*/React.createElement("div", {
    className: "rw-notif-text"
  }, body)));
}
function StreakRiskBannerRW({
  state,
  onCheckIn
}) {
  const [now, setNow] = useStateRW(() => Date.now());
  useEffectRW(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const deadline = rwStreakDeadline(state.streak);
  if (!deadline) return null;
  const remaining = deadline - now;
  const days = state.streak.current;
  return /*#__PURE__*/React.createElement("section", {
    className: "rw-risk-banner",
    "aria-label": "Your " + days + "-day streak is at risk"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-risk-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-risk-head"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:flame",
    size: 24,
    color: "#3D2A00"
  }), /*#__PURE__*/React.createElement("span", null, "Your ", days, "-Day Streak is at Risk!")), /*#__PURE__*/React.createElement("div", {
    className: "rw-risk-clock",
    "aria-live": "off"
  }, "Expires in ", fmtClockRW(remaining)), /*#__PURE__*/React.createElement("button", {
    className: "rw-btn rw-btn-white",
    type: "button",
    onClick: onCheckIn
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:check",
    size: 16,
    color: "#9C6A0E"
  }), "Check in now")), /*#__PURE__*/React.createElement("div", {
    className: "rw-notif-stack"
  }, /*#__PURE__*/React.createElement(NotificationPreviewRW, {
    hoursLabel: "· 6h before",
    body: "Don't lose your " + days + "-day streak — check in before it expires!"
  }), /*#__PURE__*/React.createElement(NotificationPreviewRW, {
    hoursLabel: "· 2h before",
    body: "Last call! Your streak expires in 2 hours."
  })));
}

/* ------------------------------------------------------------ league */
/* The member's league gem (window.PFLeague, league-engine.js) rendered via
   lottie-web from the engine's hosted JSON — same as the mobile dashboard and
   the leaderboard. Milestone-based, not points-based. */
const RW_LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
function rwEnsureLottieLib() {
  if (window.lottie || document.querySelector("script[data-pf-lottie]")) return;
  const sc = document.createElement("script");
  sc.src = RW_LOTTIE_LIB;
  sc.async = true;
  sc.setAttribute("data-pf-lottie", "1");
  document.head.appendChild(sc);
}
function rwReduceMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function LeagueLottieRW({
  src,
  size
}) {
  const host = useRefRW(null);
  useEffectRW(() => {
    let anim, t;
    const still = rwReduceMotion();
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: !still,
        autoplay: !still,
        path: src
      });
      if (still) anim.addEventListener("DOMLoaded", () => anim.goToAndStop(0, true));
    };
    rwEnsureLottieLib();
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
  }, [src]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "rw-gem-anim",
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  });
}
function rwLeagueProgress() {
  const LG = window.PFLeague;
  if (!LG) return null;
  try {
    return LG.getProgress();
  } catch (e) {
    return null;
  }
}
function rwPlural(n, word) {
  return n + " " + word + (n === 1 ? "" : "s");
}

/* League badge progress: current gem left, next gem (locked) right, milestone
   progress between them; the whole card opens the leaderboard. */
function LeagueProgressCardRW({
  league
}) {
  const p = league;
  const cur = p ? p.current : null,
    next = p ? p.next : null;
  const pct = p ? p.pct : 0;
  const vars = cur ? {
    "--lg-accent": cur.accent,
    "--lg-deep": cur.deep,
    "--lg-soft": cur.soft,
    "--nx-accent": (next || cur).accent,
    "--nx-deep": (next || cur).deep
  } : null;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rw-card rw-league-progress",
    onClick: () => goRW("Leaderboard.html"),
    style: vars,
    "aria-label": cur ? cur.name + " League, " + (next ? rwPlural(p.need, "more milestone") + " to " + next.name : "highest badge") + ". Open the leaderboard" : "Open the leaderboard"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-gem cur"
  }, cur && /*#__PURE__*/React.createElement(LeagueLottieRW, {
    src: cur.lottie,
    size: 96
  })), /*#__PURE__*/React.createElement("span", {
    className: "rw-league-progress-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-kicker"
  }, "League badge progress"), /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-top"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--lg-deep)"
    }
  }, cur ? cur.name + " League" : "League"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--nx-deep)"
    }
  }, next ? next.name + " League" : "Top badge")), /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-track rw-league-track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-fill",
    style: {
      width: pct + "%",
      background: "linear-gradient(90deg, var(--lg-accent), var(--nx-accent))"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-scale"
  }, /*#__PURE__*/React.createElement("span", null, p ? p.done + " of " + (next ? next.requires : p.total) + " milestones" : ""), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--nx-deep)"
    }
  }, next ? "Unlocks at " + next.requires : "Complete")), /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-note"
  }, next ? rwPlural(p.need, "more milestone") + " to " + next.name + " League" : "You've earned the highest badge!"), /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-link"
  }, "Open the leaderboard", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:chevron-right",
    size: 16,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "rw-gem next" + (next ? " locked" : "")
  }, (next || cur) && /*#__PURE__*/React.createElement(LeagueLottieRW, {
    src: (next || cur).lottie,
    size: 96
  }), next && /*#__PURE__*/React.createElement("span", {
    className: "rw-gem-lock"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:lock",
    size: 13,
    color: "#fff"
  }))));
}

/* "Your league" card (aside) → leaderboard. */
function LeagueCardRW({
  league
}) {
  const p = league;
  if (!p) return null;
  const cur = p.current,
    next = p.next;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rw-card rw-league",
    style: {
      "--lg-accent": cur.accent,
      "--lg-deep": cur.deep,
      "--lg-soft": cur.soft
    },
    onClick: () => goRW("Leaderboard.html"),
    "aria-label": cur.name + " League. Open the leaderboard"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-league-gem"
  }, /*#__PURE__*/React.createElement(LeagueLottieRW, {
    src: cur.lottie,
    size: 64
  })), /*#__PURE__*/React.createElement("span", {
    className: "rw-league-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-league-eyebrow"
  }, "Your league"), /*#__PURE__*/React.createElement("b", null, cur.name, " League"), /*#__PURE__*/React.createElement("i", null, next ? rwPlural(p.need, "more milestone") + " to " + next.name : "Highest badge earned")), /*#__PURE__*/React.createElement("span", {
    className: "rw-league-cta"
  }, "Leaderboard", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:chevron-right",
    size: 16,
    color: "var(--lg-deep)"
  })));
}

/* ------------------------------------------------------------ stat tiles */
function EngagementCardsRW({
  state
}) {
  const week = PF_RW.getWeekPoints(state);
  const tiles = [{
    value: PF_RW.formatNumber(state.lifetimePoints),
    label: "Lifetime Points",
    sub: "+" + PF_RW.formatNumber(week) + " this week",
    lottie: "https://lottie.host/embed/c7c98875-fe8d-4de8-95c1-3e12acf7ad0a/fpeaeGfS64.json",
    size: 40
  }, {
    value: PF_RW.formatNumber(state.spendableCredits),
    label: "Spendable Credits",
    sub: state.expiringCredits ? PF_RW.formatNumber(state.expiringCredits) + " expiring soon" : "Ready to redeem",
    lottie: "https://lottie.host/embed/1470432e-8f5e-4eb4-a73c-75e6b6972d46/qk3KaEmMpz.json",
    size: 60
  }, {
    value: state.streak.current + " Days",
    label: "Active Streak",
    sub: "Longest " + state.streak.longest + " days",
    lottie: "https://lottie.host/embed/d7ce0087-b4ad-4b7a-b657-558f841da6e5/pSvC2r0DRZ.json",
    size: 60,
    href: "CheckInStreak.html",
    aria: "Active streak: " + state.streak.current + " days. Open check-in streak"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rw-eng-grid"
  }, tiles.map(t => {
    const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "rw-eng-lottie",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("iframe", {
      src: t.lottie,
      title: "",
      scrolling: "no",
      style: {
        width: t.size + "px",
        height: t.size + "px",
        border: "none",
        background: "transparent"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "rw-eng-value"
    }, t.value), /*#__PURE__*/React.createElement("div", {
      className: "rw-eng-label"
    }, t.label, t.href ? /*#__PURE__*/React.createElement(IconifyRW, {
      name: "lucide:chevron-right",
      size: 14,
      color: "var(--gray-400)"
    }) : null), /*#__PURE__*/React.createElement("div", {
      className: "rw-eng-sub"
    }, t.sub));
    return t.href ? /*#__PURE__*/React.createElement("button", {
      key: t.label,
      className: "rw-card rw-eng-card rw-eng-link",
      type: "button",
      onClick: () => goRW(t.href),
      "aria-label": t.aria
    }, inner) : /*#__PURE__*/React.createElement("div", {
      key: t.label,
      className: "rw-card rw-eng-card"
    }, inner);
  }));
}

/* -------------------------------------------------------------- quicknav */
function QuickNavRW({
  state,
  league
}) {
  const redeemed = (state.redeemedVouchers || []).length;
  const items = [{
    label: "Rewards Store",
    desc: "Spend credits on course discounts",
    icon: "lucide:shopping-bag",
    href: "RewardsStore.html",
    dot: true
  }, {
    label: "My Rewards",
    desc: redeemed > 0 ? "Your redeemed discount codes" : "Nothing redeemed yet",
    icon: "lucide:ticket",
    href: "MyRewards.html",
    note: redeemed > 0 ? String(redeemed) : null
  }, {
    label: "Leaderboard",
    desc: "See where you rank",
    icon: "lucide:bar-chart-3",
    href: "Leaderboard.html",
    note: league ? league.current.name : null
  }, {
    label: "Ways to Earn",
    desc: "Boost your points",
    icon: "lucide:sparkles",
    href: "WaysToEarn.html"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rw-quicknav"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.label,
    className: "rw-quicknav-item",
    type: "button",
    onClick: () => goRW(it.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-quicknav-icon"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: it.icon,
    size: 22,
    color: "#fff"
  }), it.dot ? /*#__PURE__*/React.createElement("span", {
    className: "rw-quicknav-dot",
    "aria-hidden": "true"
  }) : null), /*#__PURE__*/React.createElement("span", {
    className: "rw-quicknav-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-quicknav-label"
  }, it.label, it.note ? /*#__PURE__*/React.createElement("i", {
    className: "rw-quicknav-note"
  }, it.note) : null, it.dot ? /*#__PURE__*/React.createElement("span", {
    className: "rw-sr-only"
  }, " — new rewards available") : null), /*#__PURE__*/React.createElement("span", {
    className: "rw-quicknav-desc"
  }, it.desc)), /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  }))));
}

/* -------------------------------------------------------------- activity */
function RecentActivityRW({
  state
}) {
  const rows = state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 8);
  return /*#__PURE__*/React.createElement("div", {
    className: "rw-card rw-activity"
  }, rows.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "rw-activity-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-activity-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: t.pointsDelta > 0 ? "lucide:plus" : t.creditsDelta < 0 ? "lucide:shopping-bag" : "lucide:minus",
    size: 14,
    color: t.pointsDelta > 0 ? "#9C6A0E" : "var(--gray-500)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "rw-activity-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-activity-label"
  }, t.label), /*#__PURE__*/React.createElement("span", {
    className: "rw-activity-time",
    title: fmtFullDateRW(t.ts)
  }, fmtRelDateRW(t.ts))), /*#__PURE__*/React.createElement("span", {
    className: "rw-activity-cr" + (t.creditsDelta >= 0 ? "" : " is-spend")
  }, t.creditsDelta >= 0 ? "+" : "", t.creditsDelta, " cr"), /*#__PURE__*/React.createElement("span", {
    className: "rw-activity-amt" + (t.pointsDelta > 0 ? "" : " is-spend")
  }, t.pointsDelta > 0 ? "+" + PF_RW.formatNumber(t.pointsDelta) + " pts" : "—"))), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "rw-empty"
  }, "No activity yet — complete an action to start earning.") : null);
}

/* ----------------------------------------------------------- next reward */
function NextRewardRW({
  state,
  config
}) {
  const items = (config.storeItems || []).filter(i => i && i.inventory !== 0);
  const affordable = items.filter(i => i.cost <= state.spendableCredits + 500).sort((a, b) => a.cost - b.cost)[0] || items[0];
  if (!affordable) return null;
  const canAfford = affordable.cost <= state.spendableCredits;
  const pct = Math.max(0, Math.min(100, Math.round(state.spendableCredits / Math.max(1, affordable.cost) * 100)));
  const course = affordable.course || null;
  return /*#__PURE__*/React.createElement("button", {
    className: "rw-card rw-next-reward",
    type: "button",
    onClick: () => goRW("RewardsStore.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-next-reward-tag"
  }, "NEXT UP"), /*#__PURE__*/React.createElement("span", {
    className: "rw-next-reward-icon" + (affordable.image ? " has-img" : "")
  }, affordable.image ? /*#__PURE__*/React.createElement("img", {
    src: affordable.image,
    alt: ""
  }) : /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:gift",
    size: 26,
    color: "#3D2A00"
  }), course && course.discountPct ? /*#__PURE__*/React.createElement("span", {
    className: "rw-next-reward-off"
  }, course.discountPct, "% off") : null), /*#__PURE__*/React.createElement("span", {
    className: "rw-next-reward-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, "Next Available Reward"), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, course && course.discountPct ? course.discountPct + "% off " + affordable.name : affordable.name), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, PF_RW.formatNumber(affordable.cost), " credits", canAfford ? " · ready to redeem" : " · " + PF_RW.formatNumber(affordable.cost - state.spendableCredits) + " more to go"), /*#__PURE__*/React.createElement("span", {
    className: "rw-next-reward-track",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + "%"
    }
  }))));
}

/* ---------------------------------------------------------- side summary */
function WalletCardRW({
  state
}) {
  const week = PF_RW.getWeekPoints(state);
  const tier = state.user && state.user.membershipTier ? String(state.user.membershipTier) : null;
  const mult = tier ? PF_RW.tierMultiplierFor(null, tier) : null;
  return /*#__PURE__*/React.createElement("section", {
    className: "rw-card rw-side-card",
    "aria-label": "Wallet summary"
  }, /*#__PURE__*/React.createElement("h3", null, "Your wallet"), /*#__PURE__*/React.createElement("dl", {
    className: "rw-kv"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Spendable credits"), /*#__PURE__*/React.createElement("dd", null, PF_RW.formatNumber(state.spendableCredits))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Lifetime points"), /*#__PURE__*/React.createElement("dd", null, PF_RW.formatNumber(state.lifetimePoints))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Points this week"), /*#__PURE__*/React.createElement("dd", null, PF_RW.formatNumber(week))), state.expiringCredits ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Expiring soon"), /*#__PURE__*/React.createElement("dd", {
    className: "warn"
  }, PF_RW.formatNumber(state.expiringCredits), " cr")) : null, mult ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, tier, " tier multiplier"), /*#__PURE__*/React.createElement("dd", null, mult, "×")) : null), /*#__PURE__*/React.createElement("button", {
    className: "rw-btn rw-btn-coral",
    type: "button",
    onClick: () => goRW("RewardsStore.html")
  }, "Go to Rewards Store", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:arrow-right",
    size: 16,
    color: "#3D2A00"
  })));
}
function DemoCardRW({
  onRisk,
  onMilestone,
  onGoal,
  onReset
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "rw-card rw-side-card rw-demo",
    "aria-label": "Demo controls"
  }, /*#__PURE__*/React.createElement("h3", null, "Demo controls"), /*#__PURE__*/React.createElement("div", {
    className: "rw-demo-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "rw-demo-btn",
    type: "button",
    onClick: onRisk
  }, "Simulate streak at risk"), /*#__PURE__*/React.createElement("button", {
    className: "rw-demo-btn",
    type: "button",
    onClick: onMilestone
  }, "Simulate 50k milestone"), /*#__PURE__*/React.createElement("button", {
    className: "rw-demo-btn",
    type: "button",
    onClick: onGoal
  }, "Daily goal reached"), /*#__PURE__*/React.createElement("button", {
    className: "rw-demo-btn",
    type: "button",
    onClick: onReset
  }, "Reset demo data")));
}

/* ------------------------------------------------------------------ page */
function RewardsWebApp() {
  const [state, setState] = useStateRW(() => PF_RW.getState());
  const [config, setConfig] = useStateRW(() => PF_RW.getConfig());
  const [league, setLeague] = useStateRW(rwLeagueProgress);
  const [toast, setToast] = useStateRW(null);
  const refresh = () => {
    setState(PF_RW.getState());
    setConfig(PF_RW.getConfig());
    setLeague(rwLeagueProgress());
  };
  const flash = m => {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  };

  /* Stay in sync when another tab (or the mobile preview) earns points. */
  useEffectRW(() => {
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    document.addEventListener("pf:league-changed", refresh);
    return () => {
      window.removeEventListener("pf:points-earned", refresh);
      window.removeEventListener("storage", refresh);
      document.removeEventListener("pf:league-changed", refresh);
    };
  }, []);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = (state.user && state.user.name ? state.user.name : ME_RW.name).split(" ")[0];
  const checkIn = () => {
    PF_RW.checkIn();
    refresh();
    flash("Checked in — your streak is safe!");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavRW, {
    active: "Rewards",
    user: ME_RW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateRW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "rw-page",
    "data-screen-label": "Rewards Dashboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-head-copy"
  }, /*#__PURE__*/React.createElement("h1", null, greet, ", ", firstName, "!"), /*#__PURE__*/React.createElement("p", null, "Your points, credits, streak and league progress — all in one place."))), /*#__PURE__*/React.createElement("div", {
    className: "rw-grid"
  }, /*#__PURE__*/React.createElement("main", {
    className: "rw-main"
  }, /*#__PURE__*/React.createElement(LeagueProgressCardRW, {
    league: league
  }), /*#__PURE__*/React.createElement(StreakRiskBannerRW, {
    state: state,
    onCheckIn: checkIn
  }), /*#__PURE__*/React.createElement(EngagementCardsRW, {
    state: state
  }), /*#__PURE__*/React.createElement("section", {
    className: "rw-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Jump back in")), /*#__PURE__*/React.createElement(QuickNavRW, {
    state: state,
    league: league
  })), /*#__PURE__*/React.createElement("section", {
    className: "rw-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Recent Activity"), /*#__PURE__*/React.createElement("button", {
    className: "rw-sec-link",
    type: "button",
    onClick: () => goRW("WaysToEarn.html")
  }, "Ways to earn", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:arrow-right",
    size: 14,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement(RecentActivityRW, {
    state: state
  }))), /*#__PURE__*/React.createElement("aside", {
    className: "rw-side"
  }, /*#__PURE__*/React.createElement(LeagueCardRW, {
    league: league
  }), /*#__PURE__*/React.createElement(NextRewardRW, {
    state: state,
    config: config
  }), /*#__PURE__*/React.createElement(WalletCardRW, {
    state: state
  }), /*#__PURE__*/React.createElement(DemoCardRW, {
    onRisk: () => {
      PF_RW.setStreakAtRisk(6);
      refresh();
    },
    onMilestone: () => {
      PF_RW.setState({
        lifetimePoints: 49700
      });
      goRW("MilestoneSplash.html");
    },
    onGoal: () => {
      if (window.PFDailyGoal) window.PFDailyGoal.reset();
      goRW("DailyGoal.html?ret=RewardsWeb.html");
    },
    onReset: () => {
      PF_RW.resetDemo();
      refresh();
      flash("Demo data reset.");
    }
  })))), toast && /*#__PURE__*/React.createElement("div", {
    className: "rw-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:check-circle",
    size: 16,
    color: "#fff"
  }), toast));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(RewardsWebApp, null));
