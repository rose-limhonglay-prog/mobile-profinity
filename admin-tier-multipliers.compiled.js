/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Tier Multipliers (Screen 2)
   Global tier default multipliers (applied to Base Points) plus a per-action
   override table so specific actions can bypass the global default for a
   given membership tier (e.g. Purchase Item forced to 1.2x for Confidence
   instead of the 1.5x global default). Backed by window.PFLoyalty.
   Classes prefixed tier- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateTIER,
  useMemo: useMemoTIER
} = React;
const PF_TIER = window.PFLoyalty;
function goTIER(url) {
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
    onClick: () => goTIER(item.href)
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
    onClick: () => goTIER("AdminActionsEditor.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), /*#__PURE__*/React.createElement("span", null, "Loyalty & Gamification")), /*#__PURE__*/React.createElement("div", {
    className: "adl-subnav"
  }, ADL_LOYALTY_SUBNAV.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goTIER(s.href)
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
function AdlToggle({
  on,
  onToggle,
  label
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "adl-toggle" + (on ? " is-on" : ""),
    role: "switch",
    "aria-checked": on,
    "aria-label": label,
    onClick: onToggle
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-toggle-knob"
  }));
}

/* ------------------------------------------------------------- TIER view */
function TierGlobalCard({
  multipliers,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Global Tier Defaults"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Applied to Base Points before anti-cheat validation. Membership tiers are billing-only — this is their sole effect on gamification."))), /*#__PURE__*/React.createElement("div", {
    className: "tier-global-grid"
  }, PF_TIER.TIER_KEYS.map(tier => /*#__PURE__*/React.createElement("div", {
    key: tier,
    className: "tier-global-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tier-global-name"
  }, tier), /*#__PURE__*/React.createElement("div", {
    className: "tier-global-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.1",
    min: "0",
    value: multipliers[tier],
    onChange: e => onChange(tier, Number(e.target.value) || 0)
  }), /*#__PURE__*/React.createElement("span", null, "x"))))));
}
function TierOverridesTable({
  actions,
  onToggleOverride,
  onSetOverride
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-card",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head",
    style: {
      padding: "24px 24px 0",
      border: "none",
      marginBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Per-Action Overrides"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Bypass the global default for a specific action + tier combination."))), /*#__PURE__*/React.createElement("div", {
    className: "adl-table",
    style: {
      border: "none",
      borderRadius: 0,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-row-grid adl-thead",
    style: {
      gridTemplateColumns: "1.6fr repeat(4, 1fr)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Action"), PF_TIER.TIER_KEYS.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "adl-th"
  }, t))), actions.map(a => {
    const overrides = a.overrides || {};
    const hasAny = Object.keys(overrides).length > 0;
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      className: "adl-row-grid adl-trow",
      style: {
        gridTemplateColumns: "1.6fr repeat(4, 1fr)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "adl-cell",
      style: {
        fontWeight: 600
      }
    }, a.label), PF_TIER.TIER_KEYS.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "tier-override-cell"
    }, overrides[t] != null ? /*#__PURE__*/React.createElement("input", {
      type: "number",
      step: "0.1",
      className: "tier-override-input",
      value: overrides[t],
      onChange: e => onSetOverride(a.id, t, Number(e.target.value) || 0)
    }) : /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "tier-override-add",
      onClick: () => onToggleOverride(a.id, t, true)
    }, "+ override"), overrides[t] != null && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "tier-override-remove",
      title: "Remove override",
      onClick: () => onToggleOverride(a.id, t, false)
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:x"
    })))));
  })));
}
function TierMultipliersView() {
  const [config, setConfig] = useStateTIER(() => PF_TIER.getConfig());
  const [toast, setToast] = useStateTIER(null);
  const flash = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };
  const setGlobal = (tier, value) => {
    const next = PF_TIER.setTierMultipliers({
      [tier]: value
    });
    setConfig(next);
  };
  const setOverride = (actionId, tier, on) => {
    const action = config.actions.find(a => a.id === actionId);
    const overrides = {
      ...(action.overrides || {})
    };
    if (on) overrides[tier] = config.tierMultipliers[tier];else delete overrides[tier];
    const next = PF_TIER.upsertAction({
      id: actionId,
      overrides
    });
    setConfig(next);
  };
  const setOverrideValue = (actionId, tier, value) => {
    const action = config.actions.find(a => a.id === actionId);
    const overrides = {
      ...(action.overrides || {}),
      [tier]: value
    };
    const next = PF_TIER.upsertAction({
      id: actionId,
      overrides
    });
    setConfig(next);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Tier Multipliers"), /*#__PURE__*/React.createElement("p", null, "Configure the multipliers applied to Base Points by purchased membership tier.")), /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy",
    type: "button",
    onClick: () => flash("All changes save instantly.")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "Changes save automatically"))), toast && /*#__PURE__*/React.createElement("div", {
    className: "adl-banner adl-banner-info"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:info"
  }), /*#__PURE__*/React.createElement("span", null, toast)), /*#__PURE__*/React.createElement(TierGlobalCard, {
    multipliers: config.tierMultipliers,
    onChange: setGlobal
  }), /*#__PURE__*/React.createElement(TierOverridesTable, {
    actions: config.actions,
    onToggleOverride: setOverride,
    onSetOverride: setOverrideValue
  }));
}
function TierMultipliersApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-shell"
  }, /*#__PURE__*/React.createElement(AdlSidebar, {
    activeLoyaltyKey: "tiers"
  }), /*#__PURE__*/React.createElement("main", {
    className: "adl-main"
  }, /*#__PURE__*/React.createElement(AdlHeader, {
    title: "Loyalty & Gamification — Tier Multipliers"
  }), /*#__PURE__*/React.createElement(TierMultipliersView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(TierMultipliersApp, null));
