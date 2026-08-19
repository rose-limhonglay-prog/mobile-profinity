/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · User Directory & Diagnostics
   (Screen 5). Diagnostic view for a selected clinician: account balances,
   streak status (freeze / restore), badge progress & entitlements, and
   recent ledger activity. Katy Moore is the live-simulated profile in this
   prototype; other directory rows are static reference data.
   Classes prefixed diag- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateDIAG,
  useMemo: useMemoDIAG
} = React;
const PF_DIAG = window.PFLoyalty;
function goDIAG(url) {
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
  label: "Actions Editor",
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
  label: "Audit Ledger",
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
    onClick: () => goDIAG(item.href)
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
    onClick: () => goDIAG("AdminActionsEditor.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), /*#__PURE__*/React.createElement("span", null, "Loyalty & Gamification")), /*#__PURE__*/React.createElement("div", {
    className: "adl-subnav"
  }, ADL_LOYALTY_SUBNAV.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goDIAG(s.href)
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
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  });
}
function DiagUsersRail({
  profiles,
  selected,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-rail"
  }, profiles.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.email,
    type: "button",
    className: "diag-rail-row" + (p.email === selected.email ? " is-active" : ""),
    onClick: () => onSelect(p)
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-rail-avatar"
  }, p.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("span", {
    className: "diag-rail-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-rail-name"
  }, p.name, p.live && /*#__PURE__*/React.createElement("span", {
    className: "ldg-live-pill",
    style: {
      marginLeft: 6
    }
  }, "live")), /*#__PURE__*/React.createElement("span", {
    className: "diag-rail-email"
  }, p.email)))));
}
function DiagQuickAdjust({
  onSubmit,
  disabled
}) {
  const [open, setOpen] = useStateDIAG(false);
  const [type, setType] = useStateDIAG("add_points");
  const [amount, setAmount] = useStateDIAG("");
  const [reason, setReason] = useStateDIAG("");
  const [error, setError] = useStateDIAG(null);
  if (!open) return /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: () => setOpen(true)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Add/Deduct");
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-quick-adjust"
  }, /*#__PURE__*/React.createElement("select", {
    value: type,
    onChange: e => setType(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "add_points"
  }, "Add Points"), /*#__PURE__*/React.createElement("option", {
    value: "deduct_points"
  }, "Deduct Points"), /*#__PURE__*/React.createElement("option", {
    value: "add_credits"
  }, "Add Credits"), /*#__PURE__*/React.createElement("option", {
    value: "deduct_credits"
  }, "Deduct Credits")), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Amount",
    value: amount,
    onChange: e => setAmount(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Reason (required)",
    value: reason,
    onChange: e => setReason(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy adl-btn-sm",
    type: "button",
    onClick: () => {
      if (disabled) {
        onSubmit({
          mock: true
        });
        setOpen(false);
        return;
      }
      const res = PF_DIAG.manualAdjust({
        type,
        amount,
        reason,
        adminId: "admin_drtim"
      });
      if (!res.ok) {
        setError(res.reason);
        return;
      }
      onSubmit({
        mock: false
      });
      setOpen(false);
      setAmount("");
      setReason("");
    }
  }, "Apply"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: () => setOpen(false)
  }, "Cancel"), error && /*#__PURE__*/React.createElement("div", {
    className: "diag-quick-error"
  }, error));
}
function UserDiagnosticsView() {
  const [config, setConfig] = useStateDIAG(() => PF_DIAG.getConfig());
  const katy = PF_DIAG.getState().user;
  const profiles = useMemoDIAG(() => [{
    name: katy.name + " Moore",
    email: katy.email,
    live: true
  }].concat(PF_DIAG.MOCK_DIRECTORY.map(u => ({
    ...u,
    live: false
  }))), []);
  const [selected, setSelected] = useStateDIAG(profiles[0]);
  const [state, setState] = useStateDIAG(() => PF_DIAG.getState());
  const [toast, setToast] = useStateDIAG(null);
  const isLive = selected.live;
  const balances = isLive ? {
    lifetimePoints: state.lifetimePoints,
    spendableCredits: state.spendableCredits,
    expiringCredits: state.expiringCredits
  } : selected;
  const streak = isLive ? state.streak : {
    current: selected.streakCurrent,
    longest: selected.streakLongest,
    frozen: false
  };
  const badgeProgress = isLive ? PF_DIAG.getBadgeProgress(state) : PF_DIAG.getBadgeProgress({
    lifetimePoints: selected.lifetimePoints
  });
  const ledger = isLive ? state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 8) : [];
  const flash = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };
  const refresh = () => setState(PF_DIAG.getState());
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "User Directory & Diagnostics"), /*#__PURE__*/React.createElement("p", null, "Deep diagnostic view for one clinician — balances, streak status, badge entitlements and recent ledger activity."))), toast && /*#__PURE__*/React.createElement("div", {
    className: "adl-banner adl-banner-info"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle"
  }), /*#__PURE__*/React.createElement("span", null, toast)), /*#__PURE__*/React.createElement("div", {
    className: "diag-grid"
  }, /*#__PURE__*/React.createElement(DiagUsersRail, {
    profiles: profiles,
    selected: selected,
    onSelect: setSelected
  }), /*#__PURE__*/React.createElement("div", {
    className: "diag-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-profile-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-profile-avatar"
  }, selected.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "diag-profile-name"
  }, selected.name), /*#__PURE__*/React.createElement("div", {
    className: "diag-profile-email"
  }, selected.email)), /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--brand-gold-100)",
      color: "var(--brand-navy)",
      marginLeft: "auto"
    }
  }, isLive ? katy.membershipTier : selected.membershipTier, " Membership")), /*#__PURE__*/React.createElement("div", {
    className: "diag-card-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card diag-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Account Balances"), /*#__PURE__*/React.createElement(DiagQuickAdjust, {
    disabled: !isLive,
    onSubmit: r => {
      refresh();
      flash(r.mock ? "Adjustment recorded (mock profile)." : "Adjustment applied to " + selected.name + ".");
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Lifetime Points"), /*#__PURE__*/React.createElement("b", null, PF_DIAG.formatNumber(balances.lifetimePoints))), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Spendable Credits"), /*#__PURE__*/React.createElement("b", null, PF_DIAG.formatNumber(balances.spendableCredits))), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Expiring Credits"), /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--warning)"
    }
  }, PF_DIAG.formatNumber(balances.expiringCredits || 0)))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card diag-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Streak Status")), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Current Streak"), /*#__PURE__*/React.createElement("b", null, streak.current, " days")), /*#__PURE__*/React.createElement("div", {
    className: "diag-balance-row"
  }, /*#__PURE__*/React.createElement("span", null, "Longest Streak"), /*#__PURE__*/React.createElement("b", null, streak.longest, " days")), /*#__PURE__*/React.createElement("div", {
    className: "diag-streak-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: () => {
      if (!isLive) {
        flash("Mock profile — freeze not persisted.");
        return;
      }
      PF_DIAG.freezeStreak(2);
      refresh();
      flash("Streak frozen for 2 days.");
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:snowflake"
  }), "Freeze Streak"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: () => {
      if (!isLive) {
        flash("Mock profile — restore not persisted.");
        return;
      }
      PF_DIAG.restoreBrokenStreak();
      refresh();
      flash("Streak restored to longest (" + PF_DIAG.getState().streak.longest + " days).");
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:rotate-ccw"
  }), "Restore Broken Streak")))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Badge Progress & Entitlements")), /*#__PURE__*/React.createElement("div", {
    className: "diag-badge-progress"
  }, /*#__PURE__*/React.createElement("span", null, badgeProgress.current ? badgeProgress.current.name : "Unranked", " → ", badgeProgress.next ? badgeProgress.next.name : "Max level"), /*#__PURE__*/React.createElement("div", {
    className: "adl-field",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: "var(--gray-200)",
      borderRadius: 999,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: badgeProgress.pct + "%",
      background: "linear-gradient(90deg, var(--brand-gold), var(--brand-gold-soft))"
    }
  }))), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, badgeProgress.pct, "% to ", badgeProgress.next ? badgeProgress.next.name : "top tier")), isLive && /*#__PURE__*/React.createElement("div", {
    className: "diag-achievement-grid"
  }, config.achievementBadges.map(b => {
    const unlocked = state.unlockedAchievements.includes(b.key);
    return /*#__PURE__*/React.createElement("div", {
      key: b.key,
      className: "diag-achievement-chip" + (unlocked ? " is-unlocked" : "")
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: b.icon
    }), /*#__PURE__*/React.createElement("span", null, b.name), /*#__PURE__*/React.createElement("button", {
      className: "diag-achievement-toggle",
      type: "button",
      onClick: () => {
        const list = unlocked ? state.unlockedAchievements.filter(k => k !== b.key) : state.unlockedAchievements.concat([b.key]);
        PF_DIAG.setState({
          unlockedAchievements: list
        });
        refresh();
        flash((unlocked ? "Revoked " : "Granted ") + b.name + ".");
      }
    }, unlocked ? "Revoke" : "Grant"));
  }))), isLive && /*#__PURE__*/React.createElement("div", {
    className: "adl-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head",
    style: {
      padding: "18px 20px 0",
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Recent Ledger Activity")), /*#__PURE__*/React.createElement("div", {
    className: "adl-row-grid adl-thead",
    style: {
      gridTemplateColumns: "1.6fr 1fr 0.7fr 0.7fr",
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
  }, "Credits")), ledger.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "adl-row-grid adl-trow",
    style: {
      gridTemplateColumns: "1.6fr 1fr 0.7fr 0.7fr"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-cell"
  }, t.label), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, fmtDate(t.ts)), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell",
    style: {
      fontWeight: 700,
      color: t.pointsDelta > 0 ? "var(--success)" : "var(--gray-400)"
    }
  }, t.pointsDelta > 0 ? "+" + t.pointsDelta : t.pointsDelta), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell",
    style: {
      fontWeight: 700,
      color: t.creditsDelta > 0 ? "var(--success)" : t.creditsDelta < 0 ? "var(--error)" : "var(--gray-400)"
    }
  }, t.creditsDelta > 0 ? "+" + t.creditsDelta : t.creditsDelta)))))));
}
function UserDiagnosticsApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-shell"
  }, /*#__PURE__*/React.createElement(AdlSidebar, {
    activeLoyaltyKey: "users"
  }), /*#__PURE__*/React.createElement("main", {
    className: "adl-main"
  }, /*#__PURE__*/React.createElement(AdlHeader, {
    title: "Loyalty & Gamification — User Diagnostics"
  }), /*#__PURE__*/React.createElement(UserDiagnosticsView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(UserDiagnosticsApp, null));
