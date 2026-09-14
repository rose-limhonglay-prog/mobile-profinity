/* ===========================================================================
   PROfinity — Rewards Dashboard (web)
   Desktop counterpart to RewardsDashboard.html (rewards-dashboard.jsx): the
   Loyalty & Gamification hub — greeting + wallet, badge-tier progress card with
   the beaker mascot, streak-at-risk banner, Lifetime Points / Spendable Credits /
   Active Streak stat tiles, "Jump back in" quick nav, Next Available Reward and
   Recent Activity — on the web page shell (TopNav + centered two-column layout)
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

/* ------------------------------------------------------------- wallet */
/* Anchored popover under the header chip (the mobile page uses a scrim + centred sheet). */
function WalletPopoverRW({
  state,
  onClose
}) {
  const ref = useRefRW(null);
  useEffectRW(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    const onDown = e => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);
  const recent = state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 5);
  return /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-pop",
    ref: ref,
    role: "dialog",
    "aria-label": "Wallet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-pop-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-pop-label"
  }, "Spendable Credits"), /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-pop-value"
  }, PF_RW.formatNumber(state.spendableCredits))), /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-pop-divider"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-pop-label"
  }, "Lifetime Earned"), /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-pop-value rw-wallet-pop-value-sm"
  }, PF_RW.formatNumber(state.lifetimePoints)))), /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-pop-list"
  }, recent.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "rw-wallet-pop-row"
  }, /*#__PURE__*/React.createElement("span", null, t.label), /*#__PURE__*/React.createElement("span", {
    className: "rw-wallet-pop-amt",
    style: {
      color: t.creditsDelta >= 0 ? "var(--success)" : "var(--error)"
    }
  }, t.creditsDelta >= 0 ? "+" : "", t.creditsDelta, " cr")))), /*#__PURE__*/React.createElement("button", {
    className: "rw-btn rw-btn-coral",
    type: "button",
    onClick: () => goRW("RewardsStore.html")
  }, "Go to Rewards Store", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:arrow-right",
    size: 16,
    color: "#3D2A00"
  })));
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

/* -------------------------------------------------------- beaker mascot */
/* Same looping smiling-face Lottie as the mobile progress card (lottie.host ArWGbXL6R3),
   fetched as raw JSON and played through lottie-web. */
const RW_MASCOT_SRC = "https://lottie.host/f5203bff-edd1-4727-a629-2a619bbe4edc/ArWGbXL6R3.json";
const RW_LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
let rwMascotPromise = null;
function rwMascotData() {
  if (!rwMascotPromise) {
    rwMascotPromise = fetch(RW_MASCOT_SRC).then(r => r.ok ? r.json() : null).catch(() => {
      rwMascotPromise = null;
      return null;
    });
  }
  return rwMascotPromise;
}
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
function rwBeakerFull() {
  try {
    return Math.max(1, +PF_RW.getConfig().beakerFullPoints || 20000);
  } catch (e) {
    return 20000;
  }
}
function BeakerRW({
  lifetimePoints
}) {
  const host = useRefRW(null);
  const [ready, setReady] = useStateRW(false);
  useEffectRW(() => {
    let anim,
      iv,
      cancelled = false;
    const still = rwReduceMotion();
    function start() {
      if (cancelled || !window.lottie || !host.current) return;
      rwMascotData().then(data => {
        if (!data || cancelled || !host.current) return;
        anim = window.lottie.loadAnimation({
          container: host.current,
          renderer: "svg",
          loop: !still,
          autoplay: !still,
          animationData: data,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: false
          }
        });
        anim.addEventListener("DOMLoaded", () => {
          if (cancelled) return;
          if (still) anim.goToAndStop(0, true);
          setReady(true);
        });
      });
    }
    rwEnsureLottieLib();
    if (window.lottie) start();else {
      iv = setInterval(() => {
        if (window.lottie) {
          clearInterval(iv);
          iv = null;
          start();
        }
      }, 120);
      setTimeout(() => {
        if (iv) clearInterval(iv);
      }, 8000);
    }
    return () => {
      cancelled = true;
      if (anim) anim.destroy();
      if (iv) clearInterval(iv);
    };
  }, []);
  return /*#__PURE__*/React.createElement("span", {
    className: "rw-beaker",
    "aria-hidden": "true",
    title: PF_RW.formatNumber(lifetimePoints) + " / " + PF_RW.formatNumber(rwBeakerFull()) + " pts"
  }, !ready && /*#__PURE__*/React.createElement("span", {
    className: "rw-beaker-fb"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:smile",
    size: 72,
    color: "#FCC25D"
  })), /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "rw-beaker-anim" + (ready ? " on" : "")
  }));
}

/* --------------------------------------------------------- progress card */
function ProgressCardRW({
  state
}) {
  const progress = PF_RW.getBadgeProgress(state);
  return /*#__PURE__*/React.createElement("section", {
    className: "rw-card rw-progress-card",
    "aria-label": "Badge tier progress"
  }, /*#__PURE__*/React.createElement(BeakerRW, {
    lifetimePoints: state.lifetimePoints
  }), /*#__PURE__*/React.createElement("div", {
    className: "rw-progress-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-progress-kicker"
  }, "Badge tier progress"), /*#__PURE__*/React.createElement("div", {
    className: "rw-progress-top"
  }, /*#__PURE__*/React.createElement("span", null, progress.current ? progress.current.name : "Unranked"), /*#__PURE__*/React.createElement("span", null, progress.next ? progress.next.name : "Top tier")), /*#__PURE__*/React.createElement("div", {
    className: "rw-progress-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-progress-fill",
    style: {
      width: progress.pct + "%"
    }
  }), progress.next ? /*#__PURE__*/React.createElement("span", {
    className: "rw-progress-marker",
    title: PF_RW.formatNumber(progress.next.threshold || 0) + " pts"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:star",
    size: 12,
    color: "#3D2A00"
  })) : null), progress.next ? /*#__PURE__*/React.createElement("div", {
    className: "rw-progress-scale"
  }, /*#__PURE__*/React.createElement("span", null, PF_RW.formatNumber(state.lifetimePoints), " pts"), /*#__PURE__*/React.createElement("span", null, PF_RW.formatNumber((state.lifetimePoints || 0) + (progress.remaining || 0)), " pts")) : null, /*#__PURE__*/React.createElement("div", {
    className: "rw-progress-note"
  }, progress.next ? PF_RW.formatNumber(progress.remaining) + " pts away from " + progress.next.name : "You've reached the top badge tier!")), /*#__PURE__*/React.createElement("button", {
    className: "rw-progress-link",
    type: "button",
    onClick: () => goRW("BadgeProgress.html")
  }, "View badge progress", /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:chevron-right",
    size: 16,
    color: "var(--brand-navy)"
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
    size: 60
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rw-eng-grid"
  }, tiles.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.label,
    className: "rw-card rw-eng-card"
  }, /*#__PURE__*/React.createElement("span", {
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
  }, t.label), /*#__PURE__*/React.createElement("div", {
    className: "rw-eng-sub"
  }, t.sub))));
}

/* -------------------------------------------------------------- quicknav */
function QuickNavRW() {
  const items = [{
    label: "Badge Progress",
    desc: "Track your next tier",
    icon: "lucide:target",
    href: "BadgeProgress.html"
  }, {
    label: "Rewards Store",
    desc: "Spend your credits",
    icon: "lucide:shopping-bag",
    href: "RewardsStore.html",
    dot: true
  }, {
    label: "Leaderboard",
    desc: "See where you rank",
    icon: "lucide:bar-chart-3",
    href: "Leaderboard.html",
    note: "#12"
  }, {
    label: "Badge Gallery",
    desc: "All badges & achievements",
    icon: "lucide:award",
    href: "BadgeGallery.html"
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
  const affordable = config.storeItems.filter(i => i.cost <= state.spendableCredits + 500).sort((a, b) => a.cost - b.cost)[0] || config.storeItems[0];
  if (!affordable) return null;
  const canAfford = affordable.cost <= state.spendableCredits;
  const pct = Math.max(0, Math.min(100, Math.round(state.spendableCredits / Math.max(1, affordable.cost) * 100)));
  return /*#__PURE__*/React.createElement("button", {
    className: "rw-card rw-next-reward",
    type: "button",
    onClick: () => goRW("RewardsStore.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "rw-next-reward-tag"
  }, "NEXT UP"), /*#__PURE__*/React.createElement("span", {
    className: "rw-next-reward-icon"
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:gift",
    size: 26,
    color: "#561F22"
  })), /*#__PURE__*/React.createElement("span", {
    className: "rw-next-reward-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, "Next Available Reward"), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, affordable.name), /*#__PURE__*/React.createElement("span", {
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
    onClick: onReset
  }, "Reset demo data")));
}

/* ------------------------------------------------------------------ page */
function RewardsWebApp() {
  const [state, setState] = useStateRW(() => PF_RW.getState());
  const [config, setConfig] = useStateRW(() => PF_RW.getConfig());
  const [walletOpen, setWalletOpen] = useStateRW(false);
  const [toast, setToast] = useStateRW(null);
  const refresh = () => {
    setState(PF_RW.getState());
    setConfig(PF_RW.getConfig());
  };
  const flash = m => {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  };

  /* Stay in sync when another tab (or the mobile preview) earns points. */
  useEffectRW(() => {
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("pf:points-earned", refresh);
      window.removeEventListener("storage", refresh);
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
  }, /*#__PURE__*/React.createElement("h1", null, greet, ", ", firstName, "!"), /*#__PURE__*/React.createElement("p", null, "Your points, credits, streak and badge progress — all in one place.")), /*#__PURE__*/React.createElement("div", {
    className: "rw-wallet-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    className: "rw-wallet-chip",
    type: "button",
    "aria-haspopup": "dialog",
    "aria-expanded": walletOpen,
    onClick: () => setWalletOpen(v => !v)
  }, /*#__PURE__*/React.createElement(IconifyRW, {
    name: "lucide:wallet",
    size: 16,
    color: "#3D2A00"
  }), PF_RW.formatNumber(state.spendableCredits), /*#__PURE__*/React.createElement("span", {
    className: "rw-wallet-chip-unit"
  }, "credits")), walletOpen && /*#__PURE__*/React.createElement(WalletPopoverRW, {
    state: state,
    onClose: () => setWalletOpen(false)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rw-grid"
  }, /*#__PURE__*/React.createElement("main", {
    className: "rw-main"
  }, /*#__PURE__*/React.createElement(ProgressCardRW, {
    state: state
  }), /*#__PURE__*/React.createElement(StreakRiskBannerRW, {
    state: state,
    onCheckIn: checkIn
  }), /*#__PURE__*/React.createElement(EngagementCardsRW, {
    state: state
  }), /*#__PURE__*/React.createElement("section", {
    className: "rw-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rw-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Jump back in")), /*#__PURE__*/React.createElement(QuickNavRW, null)), /*#__PURE__*/React.createElement("section", {
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
  }, /*#__PURE__*/React.createElement(NextRewardRW, {
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
