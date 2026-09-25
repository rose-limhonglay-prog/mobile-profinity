/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Member Rewards Board.
   Read-only view of one member's rewards, opened from a user name on the
   Points Ledger or User Directory & Diagnostics. ?user=<email> picks the
   member, ?ret=<page> drives the back link. Katy Moore is live (PFLoyalty
   state); directory profiles get a deterministic sample board.
   Classes prefixed amr- to avoid clashes.
   =========================================================================== */
const {
  useState: useStateAMR,
  useMemo: useMemoAMR
} = React;
const PF_AMR = window.PFLoyalty;
const LEAGUE_AMR = window.PFLeague || null;
function goAMR(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const ADL_NAV_TOP = [{
  icon: "lucide:layout-grid",
  label: "Dashboard",
  href: "AdminDashboard.html"
}, {
  icon: "lucide:user",
  label: "Users",
  href: "AdminUsers.html"
}, {
  icon: "lucide:file-text",
  label: "Posts Management",
  href: "AdminPostsManagement.html"
}, {
  icon: "lucide:layout-dashboard",
  label: "Content Moderation",
  href: "AdminModeration.html"
}, {
  icon: "lucide:life-buoy",
  label: "Service Requests",
  href: "AdminServiceRequests.html"
}, {
  icon: "lucide:shield-check",
  label: "Verification",
  href: "AdminVerification.html"
}, {
  icon: "lucide:users-round",
  label: "Agents",
  href: "AdminAgents.html"
}, {
  icon: "lucide:calendar",
  label: "Events",
  href: "AdminEvents.html"
}, {
  icon: "lucide:map",
  label: "Product Mapping",
  href: "AdminProductMapping.html"
}, {
  icon: "lucide:bar-chart-3",
  label: "Analytics",
  href: "AdminAnalytics.html"
}, {
  icon: "lucide:smartphone",
  label: "App Versions",
  href: "AdminAppVersions.html"
}, {
  icon: "lucide:bell",
  label: "Push Notification",
  href: "AdminPushNotifications.html"
}, {
  icon: "lucide:badge-check",
  label: "Badges",
  href: "AdminBadges.html"
}, {
  icon: "lucide:clipboard-list",
  label: "Quizzes & Surveys",
  href: "AdminQuizEditor.html"
}, {
  icon: "lucide:receipt-text",
  label: "Transactions",
  href: "AdminTransactions.html",
  chevron: true
}, {
  icon: "lucide:table-2",
  label: "Courses",
  href: "AdminCourses.html",
  chevron: true
}, {
  icon: "lucide:users",
  label: "Community",
  href: "AdminCommunity.html",
  chevron: true
}];
const ADL_LOYALTY_SUBNAV = [{
  key: "actions",
  label: "Ways to Earn",
  href: "AdminActionsEditor.html"
}, {
  key: "tiers",
  label: "Tier Multipliers",
  href: "AdminTierMultipliers.html"
}, {
  key: "rewards",
  label: "Reward Editor",
  href: "AdminRewardEditor.html"
}, {
  key: "ledger",
  label: "Points Ledger",
  href: "AdminAuditLedger.html"
}, {
  key: "users",
  label: "User Diagnostics",
  href: "AdminUserDiagnostics.html"
}, {
  key: "overview",
  label: "System Overview",
  href: "AdminLoyaltyOverview.html"
}];
function AdlSidebar({
  activeLoyaltyKey
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "adl-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  })), ADL_NAV_TOP.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "adl-navitem",
    type: "button",
    onClick: () => goAMR(item.href)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "adl-spacer"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down",
    class: "adl-chev"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-navgroup-label"
  }, "Loyalty & Gamification"), /*#__PURE__*/React.createElement("button", {
    className: "adl-navitem" + (activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goAMR("AdminActionsEditor.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), /*#__PURE__*/React.createElement("span", null, "Loyalty & Gamification")), /*#__PURE__*/React.createElement("div", {
    className: "adl-subnav"
  }, ADL_LOYALTY_SUBNAV.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goAMR(s.href)
  }, /*#__PURE__*/React.createElement("span", null, s.label)))));
}
function AdlHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "adl-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "adl-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "adl-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "adl-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "adl-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "adl-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}
function fmtDateAMR(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + " " + d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function initialsAMR(name) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

/* deterministic pseudo-random per email so a mock board looks the same every visit */
function seededAMR(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ h >>> 15, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
const RET_LABELS_AMR = {
  "AdminAuditLedger.html": "Points Ledger",
  "AdminUserDiagnostics.html": "User Directory & Diagnostics",
  "AdminUsers.html": "Users"
};
function buildBoardAMR(email) {
  const config = PF_AMR.getConfig();
  const live = PF_AMR.getState();
  const liveEmail = live.user.email;
  if (!email || email === liveEmail) {
    return {
      live: true,
      name: live.user.name + " Moore",
      email: liveEmail,
      tier: live.user.membershipTier,
      lifetimePoints: live.lifetimePoints,
      spendableCredits: live.spendableCredits,
      expiringCredits: live.expiringCredits || 0,
      weekPoints: PF_AMR.getWeekPoints(live),
      rolling30: live.rollingPoints30 || 0,
      streak: live.streak,
      unlockedAchievements: live.unlockedAchievements || [],
      redeemedVouchers: live.redeemedVouchers || [],
      ledger: live.ledger.slice(),
      badge: PF_AMR.getBadgeProgress(live),
      milestone: PF_AMR.getMilestoneProgress(live),
      league: LEAGUE_AMR ? LEAGUE_AMR.getCurrent() : null,
      config
    };
  }
  const p = PF_AMR.MOCK_DIRECTORY.find(u => u.email === email);
  if (!p) return null;
  const rnd = seededAMR(email);
  const actions = config.actions.filter(a => a.active && !a.requiresApproval);
  const ledger = [];
  let cursor = Date.now() - rnd() * 6 * 3600000;
  for (let i = 0; i < 12; i++) {
    const a = actions[Math.floor(rnd() * actions.length)];
    const mult = PF_AMR.tierMultiplierFor(a, p.membershipTier);
    const capped = rnd() < 0.1;
    const pts = capped ? 0 : Math.round(a.basePoints * mult);
    ledger.push({
      id: "txn_" + email.slice(0, 3) + i,
      ts: new Date(cursor).toISOString(),
      actionId: a.id,
      label: a.label,
      pointsDelta: pts,
      creditsDelta: capped ? 0 : Math.round(pts * config.creditConversionRate),
      guardrailFlags: capped ? "CAP_REACHED" : null
    });
    cursor -= (6 + rnd() * 30) * 3600000;
  }
  const fake = {
    lifetimePoints: p.lifetimePoints
  };
  const ach = (config.achievementBadges || []).filter(b => {
    if (b.criteria && b.criteria.type === "streak") return p.streakLongest >= b.criteria.count;
    if (b.criteria && b.criteria.type === "redeemCount") return p.lifetimePoints > 20000;
    return p.lifetimePoints > 500;
  }).map(b => b.key);
  const weekPoints = ledger.filter(t => Date.now() - new Date(t.ts).getTime() < 7 * 86400000).reduce((s, t) => s + t.pointsDelta, 0);
  const leagues = LEAGUE_AMR ? LEAGUE_AMR.getLeagues() : [];
  const league = leagues.length ? leagues[Math.min(leagues.length - 1, Math.floor(p.lifetimePoints / 9000))] : null;
  return {
    live: false,
    name: p.name,
    email: p.email,
    tier: p.membershipTier,
    lifetimePoints: p.lifetimePoints,
    spendableCredits: p.spendableCredits,
    expiringCredits: p.expiringCredits || 0,
    weekPoints,
    rolling30: Math.round(p.lifetimePoints * 0.12),
    streak: {
      current: p.streakCurrent,
      longest: p.streakLongest,
      frozen: false
    },
    unlockedAchievements: ach,
    redeemedVouchers: [],
    ledger,
    badge: PF_AMR.getBadgeProgress(fake),
    milestone: PF_AMR.getMilestoneProgress(fake),
    league,
    config
  };
}

/* ------------------------------------------------------------------ UI */
function AmrStat({
  label,
  value,
  sub,
  tone,
  icon
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-card amr-stat"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "amr-stat-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-value",
    style: tone ? {
      color: tone
    } : undefined
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    className: "amr-stat-sub"
  }, sub)));
}
function AmrBar({
  pct,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "amr-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "amr-bar-fill",
    style: {
      width: pct + "%",
      background: color || "linear-gradient(90deg, var(--brand-gold), var(--brand-gold-soft))"
    }
  }));
}
function MemberRewardsView() {
  const params = new URLSearchParams(location.search);
  const email = params.get("user") || "";
  const ret = params.get("ret") || "AdminUserDiagnostics.html";
  const board = useMemoAMR(() => buildBoardAMR(email), [email]);
  if (!board) {
    return /*#__PURE__*/React.createElement("div", {
      className: "adl-view"
    }, /*#__PURE__*/React.createElement("button", {
      className: "amr-back",
      type: "button",
      onClick: () => goAMR(ret)
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:arrow-left"
    }), "Back to ", RET_LABELS_AMR[ret] || "previous page"), /*#__PURE__*/React.createElement("div", {
      className: "adl-banner adl-banner-error"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:alert-triangle"
    }), /*#__PURE__*/React.createElement("span", null, "No member found for “", email, "”. Open a rewards board from a user name on the Points Ledger or User Directory.")));
  }
  const levels = board.config.levelBadges.slice().sort((a, b) => a.threshold - b.threshold);
  const achievements = board.config.achievementBadges || [];
  const storeItems = (board.config.storeItems || []).filter(i => i && i.inventory !== 0).sort((a, b) => a.cost - b.cost);
  const nextReward = storeItems.find(i => i.cost > board.spendableCredits) || storeItems[storeItems.length - 1];
  const affordable = storeItems.filter(i => i.cost <= board.spendableCredits).length;
  const ledger = board.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 12);
  const mult = PF_AMR.tierMultiplierFor(null, board.tier);
  const nextLevelHint = board.badge.next ? PF_AMR.formatNumber(board.badge.remaining) + " pts to " + board.badge.next.name : "Top level reached";
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view"
  }, /*#__PURE__*/React.createElement("button", {
    className: "amr-back",
    type: "button",
    onClick: () => goAMR(ret)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), "Back to ", RET_LABELS_AMR[ret] || "previous page"), /*#__PURE__*/React.createElement("div", {
    className: "amr-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "amr-avatar"
  }, initialsAMR(board.name)), /*#__PURE__*/React.createElement("div", {
    className: "amr-head-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "amr-name"
  }, board.name, board.live && /*#__PURE__*/React.createElement("span", {
    className: "ldg-live-pill"
  }, "live in this demo")), /*#__PURE__*/React.createElement("div", {
    className: "amr-email"
  }, board.email), /*#__PURE__*/React.createElement("div", {
    className: "amr-pills"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--brand-gold-100)",
      color: "var(--brand-navy)"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:crown"
  }), board.tier, " membership · ", mult, "× points"), board.league && /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: board.league.soft,
      color: board.league.deep
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill-dot",
    style: {
      background: board.league.accent
    }
  }), board.league.name, " league"), board.badge.current && /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--gray-100)",
      color: "var(--gray-800)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill-dot",
    style: {
      background: board.badge.current.color
    }
  }), board.badge.current.name, " level"))), /*#__PURE__*/React.createElement("div", {
    className: "amr-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost",
    type: "button",
    onClick: () => goAMR("AdminUserDiagnostics.html?user=" + encodeURIComponent(board.email))
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:stethoscope"
  }), "Diagnostics"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy",
    type: "button",
    onClick: () => goAMR("AdminAuditLedger.html?adjust=" + encodeURIComponent(board.email))
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sliders-horizontal"
  }), "Manual Adjustment"))), /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-grid"
  }, /*#__PURE__*/React.createElement(AmrStat, {
    icon: "lucide:star",
    label: "Lifetime Points",
    value: PF_AMR.formatNumber(board.lifetimePoints),
    sub: "+" + PF_AMR.formatNumber(board.weekPoints) + " this week"
  }), /*#__PURE__*/React.createElement(AmrStat, {
    icon: "lucide:wallet",
    label: "Spendable Credits",
    value: PF_AMR.formatNumber(board.spendableCredits),
    sub: board.expiringCredits ? PF_AMR.formatNumber(board.expiringCredits) + " expiring soon" : "Nothing expiring",
    tone: board.expiringCredits ? undefined : undefined
  }), /*#__PURE__*/React.createElement(AmrStat, {
    icon: "lucide:flame",
    label: "Active Streak",
    value: board.streak.current + " days",
    sub: "Longest " + board.streak.longest + " days" + (board.streak.frozen ? " · frozen" : "")
  }), /*#__PURE__*/React.createElement(AmrStat, {
    icon: "lucide:trending-up",
    label: "Points, last 30 days",
    value: PF_AMR.formatNumber(board.rolling30),
    sub: nextLevelHint
  })), /*#__PURE__*/React.createElement("div", {
    className: "amr-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "amr-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Level progress"), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, board.badge.pct, "%")), /*#__PURE__*/React.createElement(AmrBar, {
    pct: board.badge.pct
  }), /*#__PURE__*/React.createElement("div", {
    className: "amr-ladder"
  }, levels.map(l => {
    const reached = board.lifetimePoints >= l.threshold;
    return /*#__PURE__*/React.createElement("div", {
      key: l.key,
      className: "amr-ladder-step" + (reached ? " is-reached" : "") + (board.badge.current && board.badge.current.key === l.key ? " is-current" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "amr-ladder-dot",
      style: {
        background: reached ? l.color : "var(--gray-200)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "amr-ladder-name"
    }, l.name), /*#__PURE__*/React.createElement("span", {
      className: "amr-ladder-pts"
    }, PF_AMR.formatNumber(l.threshold), " pts"));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Achievements"), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, board.unlockedAchievements.length, " of ", achievements.length, " unlocked")), /*#__PURE__*/React.createElement("div", {
    className: "amr-ach-grid"
  }, achievements.map(b => {
    const on = board.unlockedAchievements.includes(b.key);
    return /*#__PURE__*/React.createElement("div", {
      key: b.key,
      className: "amr-ach" + (on ? " is-on" : ""),
      title: b.description
    }, /*#__PURE__*/React.createElement("span", {
      className: "amr-ach-icon"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: b.icon
    })), /*#__PURE__*/React.createElement("span", {
      className: "amr-ach-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "amr-ach-name"
    }, b.name), /*#__PURE__*/React.createElement("span", {
      className: "amr-ach-desc"
    }, on ? b.reward || "Unlocked" : b.description)), on ? /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:check-circle-2",
      class: "amr-ach-check"
    }) : /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:lock",
      class: "amr-ach-lock"
    }));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Milestone Path"), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, board.milestone.passed.length, " of ", board.milestone.path.length, " reached")), /*#__PURE__*/React.createElement(AmrBar, {
    pct: board.milestone.pct,
    color: "linear-gradient(90deg, var(--ai-purple), #B69CFF)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "amr-ms-list"
  }, board.milestone.path.map(m => {
    const passed = board.lifetimePoints >= m.threshold;
    const isNext = board.milestone.next && board.milestone.next.key === m.key;
    return /*#__PURE__*/React.createElement("div", {
      key: m.key,
      className: "amr-ms" + (passed ? " is-passed" : "") + (isNext ? " is-next" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "amr-ms-icon"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: passed ? "lucide:check" : isNext ? "lucide:milestone" : "lucide:lock"
    })), /*#__PURE__*/React.createElement("span", {
      className: "amr-ms-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "amr-ms-name"
    }, m.name, " ", /*#__PURE__*/React.createElement("small", null, PF_AMR.formatNumber(m.threshold), " pts")), /*#__PURE__*/React.createElement("span", {
      className: "amr-ms-benefit"
    }, (m.benefits || []).map(b => b.title).join(" · ") || "Benefit bundle")), isNext && /*#__PURE__*/React.createElement("span", {
      className: "adl-pill",
      style: {
        background: "var(--ai-purple-100)",
        color: "var(--ai-purple)"
      }
    }, PF_AMR.formatNumber(board.milestone.remaining), " pts to go"));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "amr-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Wallet")), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Spendable credits"), /*#__PURE__*/React.createElement("b", null, PF_AMR.formatNumber(board.spendableCredits))), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Lifetime points"), /*#__PURE__*/React.createElement("b", null, PF_AMR.formatNumber(board.lifetimePoints))), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Points this week"), /*#__PURE__*/React.createElement("b", null, PF_AMR.formatNumber(board.weekPoints))), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Expiring soon"), /*#__PURE__*/React.createElement("b", {
    style: {
      color: board.expiringCredits ? "var(--warning)" : undefined
    }
  }, PF_AMR.formatNumber(board.expiringCredits), " cr")), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, board.tier, " tier multiplier"), /*#__PURE__*/React.createElement("b", null, mult, "×")), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Rewards affordable now"), /*#__PURE__*/React.createElement("b", null, affordable, " of ", storeItems.length))), nextReward && /*#__PURE__*/React.createElement("div", {
    className: "adl-card amr-next"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Next available reward")), /*#__PURE__*/React.createElement("div", {
    className: "amr-next-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "amr-next-img"
  }, nextReward.image ? /*#__PURE__*/React.createElement("img", {
    src: nextReward.image,
    alt: ""
  }) : /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:gift"
  })), /*#__PURE__*/React.createElement("div", {
    className: "amr-next-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "amr-next-name"
  }, nextReward.course && nextReward.course.discountPct ? nextReward.course.discountPct + "% off " : "", nextReward.name), /*#__PURE__*/React.createElement("div", {
    className: "amr-next-sub"
  }, PF_AMR.formatNumber(nextReward.cost), " credits · ", nextReward.cost <= board.spendableCredits ? "ready to redeem" : PF_AMR.formatNumber(nextReward.cost - board.spendableCredits) + " more to go"), /*#__PURE__*/React.createElement(AmrBar, {
    pct: Math.min(100, Math.round(board.spendableCredits / Math.max(1, nextReward.cost) * 100))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Redeemed rewards"), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, board.redeemedVouchers.length)), board.redeemedVouchers.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "amr-empty"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:ticket"
  }), "Nothing redeemed yet.") : board.redeemedVouchers.slice(0, 5).map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: v.code || i,
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, v.name || v.itemName || "Reward", /*#__PURE__*/React.createElement("small", {
    className: "amr-code"
  }, " ", v.code)), /*#__PURE__*/React.createElement("b", null, v.used || v.status === "Used" ? "Used" : "Ready")))))), /*#__PURE__*/React.createElement("div", {
    className: "adl-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head",
    style: {
      padding: "18px 20px 0",
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Recent activity"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: () => goAMR("AdminAuditLedger.html")
  }, "Open Points Ledger")), /*#__PURE__*/React.createElement("div", {
    className: "adl-row-grid adl-thead amr-row-grid",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Action"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Date"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Points"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Credits"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Status")), ledger.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "adl-row-grid adl-trow amr-row-grid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-cell"
  }, t.label, t.adminId && /*#__PURE__*/React.createElement("span", {
    className: "ldg-admin-tag"
  }, " · by ", t.adminId)), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, fmtDateAMR(t.ts)), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell",
    style: {
      fontWeight: 700,
      color: t.pointsDelta > 0 ? "var(--success)" : t.pointsDelta < 0 ? "var(--error)" : "var(--gray-400)"
    }
  }, t.pointsDelta > 0 ? "+" : "", t.pointsDelta), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell",
    style: {
      fontWeight: 700,
      color: t.creditsDelta > 0 ? "var(--success)" : t.creditsDelta < 0 ? "var(--error)" : "var(--gray-400)"
    }
  }, t.creditsDelta > 0 ? "+" : "", t.creditsDelta), /*#__PURE__*/React.createElement("span", null, t.guardrailFlags ? /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--warning-bg)",
      color: "#96690a"
    },
    title: "The member had already hit this action's limit, so it was logged but paid 0 points."
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill-dot",
    style: {
      background: "#96690a"
    }
  }), "Limit reached") : t.adjustmentReason ? /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--info-bg)",
      color: "var(--info)"
    },
    title: t.adjustmentReason
  }, "Manual") : t.creditsDelta < 0 ? /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--gray-100)",
      color: "var(--gray-700)"
    }
  }, "Spent") : /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--success-bg)",
      color: "var(--success)"
    }
  }, "Earned")))), ledger.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "amr-empty",
    style: {
      padding: 20
    }
  }, "No activity recorded for this member yet.")));
}
function MemberRewardsApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-shell"
  }, /*#__PURE__*/React.createElement(AdlSidebar, {
    activeLoyaltyKey: "users"
  }), /*#__PURE__*/React.createElement("main", {
    className: "adl-main"
  }, /*#__PURE__*/React.createElement(AdlHeader, {
    title: "Loyalty & Gamification — Member Rewards Board"
  }), /*#__PURE__*/React.createElement(MemberRewardsView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MemberRewardsApp, null));
