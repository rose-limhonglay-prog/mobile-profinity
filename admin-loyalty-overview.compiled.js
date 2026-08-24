/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · System Overview & Analytics
   (Screen 6). Central health dashboard: DAU, Points Inflation Rate,
   Redemption Rate, global economy settings (credit conversion rate, credit
   expiry, streak-freeze cost) and open dispute tickets.
   Classes prefixed ovw- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateOVW,
  useMemo: useMemoOVW
} = React;
const PF_OVW = window.PFLoyalty;
function goOVW(url) {
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
    onClick: () => goOVW(item.href)
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
    onClick: () => goOVW("AdminActionsEditor.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), /*#__PURE__*/React.createElement("span", null, "Loyalty & Gamification")), /*#__PURE__*/React.createElement("div", {
    className: "adl-subnav"
  }, ADL_LOYALTY_SUBNAV.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goOVW(s.href)
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
const OVW_DISPUTES = [{
  id: "DT-2291",
  user: "Priya Nandwani",
  topic: "Review points not credited",
  status: "Open",
  opened: "2 days ago"
}, {
  id: "DT-2288",
  user: "Marcus Webb",
  topic: "Streak reset unexpectedly",
  status: "Investigating",
  opened: "3 days ago"
}, {
  id: "DT-2277",
  user: "Sofia Alarcón",
  topic: "Voucher code not working",
  status: "Resolved",
  opened: "6 days ago"
}];
function OvwStat({
  label,
  value,
  sub,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-value",
    style: tone ? {
      color: tone
    } : undefined
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    className: "ovw-stat-sub"
  }, sub)));
}
function OverviewView() {
  const [config, setConfig] = useStateOVW(() => PF_OVW.getConfig());
  const [state] = useStateOVW(() => PF_OVW.getState());
  const [toast, setToast] = useStateOVW(null);
  const flash = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };
  const totalEarned = useMemoOVW(() => state.ledger.reduce((s, t) => s + Math.max(0, t.creditsDelta), 0), [state]);
  const totalRedeemed = useMemoOVW(() => Math.abs(state.ledger.filter(t => t.creditsDelta < 0 && t.actionId && t.actionId.startsWith("redeem:")).reduce((s, t) => s + t.creditsDelta, 0)), [state]);
  const redemptionRate = totalEarned ? Math.round(totalRedeemed / totalEarned * 100) : 0;
  const cappedCount = state.ledger.filter(t => t.guardrailFlags === "CAP_REACHED").length;
  const inflationRate = state.ledger.length ? Math.round(cappedCount / state.ledger.length * 1000) / 10 : 0;
  const set = patch => setConfig(PF_OVW.setConfig(patch));
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "System Overview & Analytics"), /*#__PURE__*/React.createElement("p", null, "Health metrics for the loyalty economy plus global configuration."))), toast && /*#__PURE__*/React.createElement("div", {
    className: "adl-banner adl-banner-info"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle"
  }), /*#__PURE__*/React.createElement("span", null, toast)), /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-grid"
  }, /*#__PURE__*/React.createElement(OvwStat, {
    label: "Daily Active Users",
    value: "8,214",
    sub: "+3.2% vs. last week"
  }), /*#__PURE__*/React.createElement(OvwStat, {
    label: "Points Inflation Rate",
    value: inflationRate + "%",
    sub: "Share of attempts silently capped",
    tone: inflationRate > 15 ? "var(--error)" : undefined
  }), /*#__PURE__*/React.createElement(OvwStat, {
    label: "Overall Redemption Rate",
    value: redemptionRate + "%",
    sub: "Credits spent vs. credits earned"
  }), /*#__PURE__*/React.createElement(OvwStat, {
    label: "Open Dispute Tickets",
    value: OVW_DISPUTES.filter(d => d.status !== "Resolved").length
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Global Economy Settings"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "These apply platform-wide across every action and tier."))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field-row-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Credit Conversion Rate"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.01",
    value: config.creditConversionRate,
    onChange: e => set({
      creditConversionRate: Number(e.target.value) || 0
    })
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-field-hint"
  }, "Credits = Points × rate. Currently ", config.creditConversionRate, " → 500 pts earns ", Math.round(500 * config.creditConversionRate), " credits.")), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Credit Expiry (months)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: config.creditExpiryMonths,
    onChange: e => set({
      creditExpiryMonths: Number(e.target.value) || 0
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Streak Freeze Cost (credits)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: config.streakFreezeCost,
    onChange: e => set({
      streakFreezeCost: Number(e.target.value) || 0
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy adl-btn-sm",
    type: "button",
    onClick: () => flash("Global economy settings saved.")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:save"
  }), "Save Settings"))), /*#__PURE__*/React.createElement("div", {
    className: "adl-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head",
    style: {
      padding: "18px 20px 0",
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "User Dispute Tickets")), /*#__PURE__*/React.createElement("div", {
    className: "adl-row-grid adl-thead",
    style: {
      gridTemplateColumns: "0.8fr 1.2fr 1.6fr 0.9fr 0.9fr",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Ticket"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "User"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Topic"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Status"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Opened")), OVW_DISPUTES.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    className: "adl-row-grid adl-trow",
    style: {
      gridTemplateColumns: "0.8fr 1.2fr 1.6fr 0.9fr 0.9fr"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-cell adl-cell-mono"
  }, d.id), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell"
  }, d.user), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell"
  }, d.topic), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: d.status === "Resolved" ? "var(--success-bg)" : d.status === "Investigating" ? "var(--warning-bg)" : "var(--info-bg)",
      color: d.status === "Resolved" ? "var(--success)" : d.status === "Investigating" ? "#96690a" : "var(--info)"
    }
  }, d.status)), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, d.opened)))));
}
function OverviewApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-shell"
  }, /*#__PURE__*/React.createElement(AdlSidebar, {
    activeLoyaltyKey: "overview"
  }), /*#__PURE__*/React.createElement("main", {
    className: "adl-main"
  }, /*#__PURE__*/React.createElement(AdlHeader, {
    title: "Loyalty & Gamification — System Overview"
  }), /*#__PURE__*/React.createElement(OverviewView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(OverviewApp, null));
