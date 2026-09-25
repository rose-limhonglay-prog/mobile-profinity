/* ===========================================================================
   PROfinity — Rewards Dashboard (web)
   Desktop counterpart to RewardsDashboard.html (rewards-dashboard.jsx): the
   Loyalty & Gamification hub — greeting, league badge progress card (PFLeague
   gems, points-based via the Milestone Path), streak-at-risk banner, Lifetime
   Points / Active Streak stat tiles (streak → CheckInStreak), "Your league"
   card (leaderboard snapshot: own league + rank) with a Milestone Path button
   beneath, "Jump back in" quick nav (My Rewards), Recent Activity and a "Your points" side card — on the
   web page shell (TopNav + centered two-column layout). Points-only since
   2026-09-24: no Spendable Credits, no Rewards Store.
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
   the leaderboard. Points-based: thresholds come from the Milestone Path. */
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
function rwPts(n) {
  return PF_RW.formatNumber(n) + " pts";
}

/* League badge progress: current gem left, next gem (locked) right, points
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
    "aria-label": cur ? cur.name + " League, " + (next ? rwPts(p.need) + " more to " + next.name : "highest badge") + ". Open the leaderboard" : "Open the leaderboard"
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
  }, /*#__PURE__*/React.createElement("span", null, p ? PF_RW.formatNumber(p.points) + (next ? " of " + PF_RW.formatNumber(next.requires) : "") + " lifetime pts" : ""), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--nx-deep)"
    }
  }, next ? "Unlocks at " + rwPts(next.requires) : "Complete")), /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-note"
  }, next ? rwPts(p.need) + " more to " + next.name + " League" : "You've earned the highest badge!"), /*#__PURE__*/React.createElement("span", {
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

/* Leaderboard snapshot (aside): only the member's own league — her gem, her
   rank on that board (same 30-day rolling points the Leaderboard page ranks
   on) and who's just ahead. Opens the full leaderboard. */
function rwStandings(state) {
  const LG = window.PFLeague;
  if (!LG || !LG.getStandings) return null;
  try {
    const me = {
      name: (state.user && state.user.name ? state.user.name : ME_RW.name) + " (You)",
      avatar: ME_RW.avatar,
      points: state.rollingPoints30 || 0
    };
    return LG.getStandings(me);
  } catch (e) {
    return null;
  }
}
function rwOrdinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function LeagueCardRW({
  state
}) {
  const st = rwStandings(state);
  if (!st || !st.me) return null;
  const cur = st.league,
    me = st.me,
    above = st.above;
  const total = st.rows.length;
  const gap = above ? above.points - me.points : 0;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rw-card rw-league",
    style: {
      "--lg-accent": cur.accent,
      "--lg-deep": cur.deep,
      "--lg-soft": cur.soft
    },
    onClick: () => goRW("Leaderboard.html"),
    "aria-label": "Leaderboard. You're " + rwOrdinal(me.rank) + " of " + total + " in the " + cur.name + " League with " + rwPts(me.points) + ". Open the leaderboard"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-league-gem"
  }, /*#__PURE__*/React.createElement(LeagueLottieRW, {
    src: cur.lottie,
    size: 64
  })), /*#__PURE__*/React.createElement("span", {
    className: "rw-league-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-league-eyebrow"
  }, "Leaderboard · ", cur.name, " League"), /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement("span", {
    className: "rw-league-rank"
  }, "#", me.rank), " of ", total), /*#__PURE__*/React.createElement("i", null, rwPts(me.points), above ? " · " + PF_RW.formatNumber(gap) + " behind " + above.name.split(" ")[0] : " · You lead the league!")), /*#__PURE__*/React.createElement("span", {
    className: "rw-league-cta"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--lg-deep)"
  })));
}

/* Two simple buttons (mirror of RdbFeatureTiles on mobile): navy icon,
   label, one-line note, chevron. */
function FeatureTilesRW({
  state
}) {
  let milestone = null;
  try {
    milestone = PF_RW.getMilestoneProgress ? PF_RW.getMilestoneProgress(state) : null;
  } catch (e) {}
  const mpNote = milestone ? milestone.next ? PF_RW.formatNumber(milestone.remaining) + " pts to go" : "Every badge earned" : "Badges & benefits";
  const vouchers = (state.redeemedVouchers || []).length;
  const mrNote = vouchers ? vouchers + " unlocked" : "Course discounts";
  const items = [{
    label: "Milestone Path",
    note: mpNote,
    icon: "lucide:milestone",
    href: "MilestonePath.html?ret=RewardsWeb.html"
  }, {
    label: "My Rewards",
    note: mrNote,
    icon: "lucide:ticket",
    href: "MyRewards.html"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rw-feats"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.label,
    type: "button",
    className: "rw-card rw-feat",
    onClick: () => goRW(it.href),
    "aria-label": it.label + ". " + it.note
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-feat-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: it.icon,
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "rw-feat-tx"
  }, /*#__PURE__*/React.createElement("b", null, it.label), /*#__PURE__*/React.createElement("i", null, it.note)), /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  }))));
}

/* ------------------------------------------------------------ stat tiles */
/* Lifetime Points tile: the header points pill's smiling-face Lottie (was a coin-stack iframe) */
const RW_MASCOT_SRC = "https://lottie.host/f5203bff-edd1-4727-a629-2a619bbe4edc/ArWGbXL6R3.json";
function EngagementCardsRW({
  state
}) {
  const week = PF_RW.getWeekPoints(state);
  const tiles = [{
    value: PF_RW.formatNumber(state.lifetimePoints),
    label: "Lifetime Points",
    sub: "+" + PF_RW.formatNumber(week) + " this week",
    json: RW_MASCOT_SRC,
    size: 48
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
      className: "rw-eng-lottie" + (t.json ? " rw-eng-lottie--face" : ""),
      "aria-hidden": "true"
    }, t.json ? /*#__PURE__*/React.createElement(LeagueLottieRW, {
      src: t.json,
      size: t.size
    }) : /*#__PURE__*/React.createElement("iframe", {
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
  // Leaderboard + Milestone Path live in the aside snapshot card
  const items = [{
    label: "My Rewards",
    desc: redeemed > 0 ? "Your unlocked discount codes" : "Nothing unlocked yet",
    icon: "lucide:ticket",
    href: "MyRewards.html",
    note: redeemed > 0 ? String(redeemed) : null
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

/* --------------------------------------------------------------- welcome */
/* ?new=1 → show the page as a brand-new member, then drop the flag */
function rwApplyNewMemberFlag() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("new") !== "1") return;
    PF_RW.resetNewMember();
    try {
      localStorage.removeItem(RW_WELCOME_SEEN);
    } catch (e) {}
    q.delete("new");
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q.toString() : "") + location.hash);
  } catch (e) {}
}
function rwIsNewMember(state) {
  return !state.lifetimePoints && !(state.ledger || []).length;
}
/* first-visit welcome modal: shown once over the page while the member has
   no points; dismissing remembers it (pf-rewards-welcome-seen). */
const RW_WELCOME_SEEN = "pf-rewards-welcome-seen";
function rwWelcomeSeen() {
  try {
    return localStorage.getItem(RW_WELCOME_SEEN) === "1";
  } catch (e) {
    return true;
  }
}
function rwMarkWelcomeSeen() {
  try {
    localStorage.setItem(RW_WELCOME_SEEN, "1");
  } catch (e) {}
}
const RW_STARTERS = [{
  id: "evt_mobile_checkin",
  label: "Check in every day",
  icon: "lucide:calendar-check"
}, {
  id: "evt_profile_complete",
  label: "Complete your profile",
  icon: "lucide:user-check"
}, {
  id: "evt_create_post",
  label: "Post in the community",
  icon: "lucide:pen-line"
}, {
  id: "evt_module_complete",
  label: "Finish a lesson module",
  icon: "lucide:book-open"
}, {
  id: "evt_follow_peer",
  label: "Connect with a peer",
  icon: "lucide:user-plus"
}];
function rwStarterRows(state) {
  let actions = [];
  try {
    actions = PF_RW.getConfig().actions || [];
  } catch (e) {}
  const tier = state.user && state.user.membershipTier;
  return RW_STARTERS.map(st => {
    const a = actions.find(x => x.id === st.id);
    let pts = a ? a.basePoints : 0;
    try {
      if (a && tier) pts = Math.round(a.basePoints * PF_RW.tierMultiplierFor(a, tier));
    } catch (e) {}
    return Object.assign({}, st, {
      pts
    });
  }).filter(r => r.pts > 0);
}
function rwWelcomeStep() {
  try {
    return new URLSearchParams(location.search).get("welcome") === "earn" ? 2 : 1;
  } catch (e) {
    return 1;
  }
}
function WelcomeModalRW({
  state,
  league,
  onClose,
  initialStep
}) {
  const [step, setStep] = useStateRW(initialStep || 1);
  const next = league ? league.next : null;
  const first = (state.user && state.user.name ? state.user.name : ME_RW.name).split(" ")[0];
  const tier = state.user && state.user.membershipTier;
  useEffectRW(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "rw-welcome-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-welcome" + (step === 2 ? " rw-welcome-earn" : ""),
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "rw-welcome-title",
    onClick: e => e.stopPropagation()
  }, step === 1 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "rw-welcome-doc",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(LeagueLottieRW, {
    src: "assets/lottie/checkin-welcome.json",
    size: 210
  })), /*#__PURE__*/React.createElement("b", {
    id: "rw-welcome-title"
  }, "Welcome to Rewards, ", first, "!"), /*#__PURE__*/React.createElement("p", null, "Every check-in, post and lesson earns points. ", next ? /*#__PURE__*/React.createElement(React.Fragment, null, "Reach ", /*#__PURE__*/React.createElement("strong", null, rwPts(next.requires)), " to move up to ", /*#__PURE__*/React.createElement("strong", null, next.name, " League"), " and unlock your first benefit bundle.") : null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rw-welcome-btn",
    onClick: () => setStep(2)
  }, "See ways to earn", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:arrow-right",
    size: 15,
    color: "#3D2A00"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rw-welcome-skip",
    onClick: onClose
  }, "Explore my Rewards")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rw-welcome-back",
    "aria-label": "Back",
    onClick: () => setStep(1)
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:chevron-left",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "rw-welcome-steps",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", {
    className: "on"
  })), /*#__PURE__*/React.createElement("b", {
    id: "rw-welcome-title"
  }, "Ways to earn points"), /*#__PURE__*/React.createElement("p", null, "Your quickest wins", tier ? " as a " + tier + " member" : "", " — points land the moment you do them."), /*#__PURE__*/React.createElement("ul", {
    className: "rw-welcome-list"
  }, rwStarterRows(state).map(r => /*#__PURE__*/React.createElement("li", {
    key: r.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: r.icon,
    size: 18,
    color: "#FCC25D"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lb"
  }, r.label), /*#__PURE__*/React.createElement("span", {
    className: "pt"
  }, "+", PF_RW.formatNumber(r.pts), " pts")))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rw-welcome-btn",
    onClick: onClose
  }, "Let's start", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:arrow-right",
    size: 15,
    color: "#3D2A00"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rw-welcome-skip",
    onClick: () => {
      onClose();
      goRW("WaysToEarn.html");
    }
  }, "See all ways to earn"))));
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
    name: t.pointsDelta > 0 ? "lucide:plus" : "lucide:minus",
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
    className: "rw-activity-amt" + (t.pointsDelta > 0 ? "" : " is-spend")
  }, t.pointsDelta > 0 ? "+" + PF_RW.formatNumber(t.pointsDelta) + " pts" : "—"))), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "rw-empty"
  }, "No activity yet — check in today to earn your first points.") : null);
}

/* ---------------------------------------------------------- side summary */
function PointsCardRW({
  state,
  league
}) {
  const week = PF_RW.getWeekPoints(state);
  const tier = state.user && state.user.membershipTier ? String(state.user.membershipTier) : null;
  const mult = tier ? PF_RW.tierMultiplierFor(null, tier) : null;
  const next = league ? league.next : null;
  return /*#__PURE__*/React.createElement("section", {
    className: "rw-card rw-side-card",
    "aria-label": "Points summary"
  }, /*#__PURE__*/React.createElement("h3", null, "Your points"), /*#__PURE__*/React.createElement("dl", {
    className: "rw-kv"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Lifetime points"), /*#__PURE__*/React.createElement("dd", null, PF_RW.formatNumber(state.lifetimePoints))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Points this week"), /*#__PURE__*/React.createElement("dd", null, PF_RW.formatNumber(week))), next ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "To ", next.name, " League"), /*#__PURE__*/React.createElement("dd", {
    className: "warn"
  }, rwPts(league.need))) : null, mult ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, tier, " tier multiplier"), /*#__PURE__*/React.createElement("dd", null, mult, "×")) : null), /*#__PURE__*/React.createElement("button", {
    className: "rw-btn rw-btn-coral",
    type: "button",
    onClick: () => goRW("MilestonePath.html?ret=RewardsWeb.html")
  }, "View Milestone Path", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:arrow-right",
    size: 16,
    color: "#3D2A00"
  })));
}
function DemoCardRW({
  onRisk,
  onMilestone,
  onGoal,
  onNew,
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
    onClick: onNew
  }, "New member view"), /*#__PURE__*/React.createElement("button", {
    className: "rw-demo-btn",
    type: "button",
    onClick: onReset
  }, "Reset demo data")));
}

/* ------------------------------------------------------------------ page */
function RewardsWebApp() {
  const [state, setState] = useStateRW(() => {
    rwApplyNewMemberFlag();
    return PF_RW.getState();
  });
  const [league, setLeague] = useStateRW(rwLeagueProgress);
  const [welcomeOpen, setWelcomeOpen] = useStateRW(() => rwIsNewMember(PF_RW.getState()) && !rwWelcomeSeen());
  const closeWelcome = React.useCallback(() => {
    rwMarkWelcomeSeen();
    setWelcomeOpen(false);
  }, []);
  const [toast, setToast] = useStateRW(null);
  const refresh = () => {
    setState(PF_RW.getState());
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
  }, /*#__PURE__*/React.createElement("h1", null, greet, ", ", firstName, "!"), /*#__PURE__*/React.createElement("p", null, "Your points, streak and league progress — all in one place."))), /*#__PURE__*/React.createElement("div", {
    className: "rw-grid"
  }, /*#__PURE__*/React.createElement("main", {
    className: "rw-main"
  }, window.PFRewardsEmbed ? /*#__PURE__*/React.createElement(window.PFRewardsEmbed.LeagueRail, {
    href: "Leaderboard.html"
  }) : null, /*#__PURE__*/React.createElement(EngagementCardsRW, {
    state: state
  }), /*#__PURE__*/React.createElement(FeatureTilesRW, {
    state: state
  }), /*#__PURE__*/React.createElement(StreakRiskBannerRW, {
    state: state,
    onCheckIn: checkIn
  }), /*#__PURE__*/React.createElement("section", {
    className: "rw-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Recent Activity")), /*#__PURE__*/React.createElement(RecentActivityRW, {
    state: state
  }))), /*#__PURE__*/React.createElement("aside", {
    className: "rw-side"
  }, /*#__PURE__*/React.createElement(LeagueCardRW, {
    state: state
  }), /*#__PURE__*/React.createElement(PointsCardRW, {
    state: state,
    league: league
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
    onNew: () => goRW("RewardsWeb.html?new=1"),
    onReset: () => {
      PF_RW.resetDemo();
      refresh();
      flash("Demo data reset.");
    }
  })))), welcomeOpen && /*#__PURE__*/React.createElement(WelcomeModalRW, {
    state: state,
    league: league,
    onClose: closeWelcome,
    initialStep: rwWelcomeStep()
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "rw-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:check-circle",
    size: 16,
    color: "#fff"
  }), toast));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(RewardsWebApp, null));
