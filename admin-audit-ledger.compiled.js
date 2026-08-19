/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Audit Ledger & Manual
   Adjustments (Screen 4). Key metrics, immutable transaction log, and the
   Manual Adjustment slide-out panel (critical capability): search a user,
   pick Add/Deduct Points or Credits, enter amount + mandatory audit reason.
   Backed by window.PFLoyalty — adjustments on Katy Moore write a real ledger
   transaction visible on her Dashboard / Wallet immediately.
   Classes prefixed ldg- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateLDG,
  useMemo: useMemoLDG
} = React;
const PF_LDG = window.PFLoyalty;
function goLDG(url) {
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
    onClick: () => goLDG(item.href)
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
    onClick: () => goLDG("AdminActionsEditor.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), /*#__PURE__*/React.createElement("span", null, "Loyalty & Gamification")), /*#__PURE__*/React.createElement("div", {
    className: "adl-subnav"
  }, ADL_LOYALTY_SUBNAV.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goLDG(s.href)
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
    month: "short",
    year: "numeric"
  }) + " " + d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ------------------------------------------------------------- LDG view */
function LdgStat({
  label,
  value,
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
  }, value)));
}
function LdgAdjustPanel({
  open,
  onClose,
  onExecute
}) {
  const directory = useMemoLDG(() => {
    const katy = PF_LDG.getState().user;
    return [{
      name: katy.name + " Moore",
      email: katy.email,
      live: true
    }].concat(PF_LDG.MOCK_DIRECTORY.map(u => ({
      name: u.name,
      email: u.email,
      live: false
    })));
  }, [open]);
  const [query, setQuery] = useStateLDG("");
  const [selected, setSelected] = useStateLDG(directory[0]);
  const [type, setType] = useStateLDG("add_points");
  const [amount, setAmount] = useStateLDG("");
  const [reason, setReason] = useStateLDG("");
  const [error, setError] = useStateLDG(null);
  if (!open) return null;
  const filtered = directory.filter(u => (u.name + u.email).toLowerCase().includes(query.toLowerCase()));
  const submit = () => {
    if (!selected) {
      setError("Search for and select a user first.");
      return;
    }
    if (!selected.live) {
      if (!amount || !reason.trim()) {
        setError("Amount and Adjustment Reason are both required.");
        return;
      }
      onExecute({
        ok: true,
        mock: true,
        user: selected
      });
      setAmount("");
      setReason("");
      setError(null);
      return;
    }
    const res = PF_LDG.manualAdjust({
      type,
      amount,
      reason,
      adminId: "admin_drtim"
    });
    if (!res.ok) {
      setError(res.reason);
      return;
    }
    setError(null);
    setAmount("");
    setReason("");
    onExecute({
      ok: true,
      mock: false,
      user: selected,
      txn: res.txn
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-panel",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-panel-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Manual Point / Credit Adjustment"), /*#__PURE__*/React.createElement("button", {
    className: "adl-panel-close",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-panel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Search User by Email or ID"), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search directory...",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "ldg-user-results"
  }, filtered.map(u => /*#__PURE__*/React.createElement("button", {
    key: u.email,
    type: "button",
    className: "ldg-user-result" + (selected && selected.email === u.email ? " is-active" : ""),
    onClick: () => setSelected(u)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ldg-user-result-name"
  }, u.name, u.live && /*#__PURE__*/React.createElement("span", {
    className: "ldg-live-pill"
  }, "live in this demo")), /*#__PURE__*/React.createElement("span", {
    className: "ldg-user-result-email"
  }, u.email)))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Adjustment Type"), /*#__PURE__*/React.createElement("select", {
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
  }, "Deduct Credits"))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Amount"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: amount,
    onChange: e => setAmount(e.target.value),
    placeholder: "e.g. 500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Adjustment Reason ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--error)"
    }
  }, "*")), /*#__PURE__*/React.createElement("textarea", {
    value: reason,
    onChange: e => setReason(e.target.value),
    placeholder: "Required for audit logging, e.g. “Goodwill credit for support ticket #4821.”"
  })), !selected?.live && /*#__PURE__*/React.createElement("div", {
    className: "adl-banner adl-banner-info"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:info"
  }), /*#__PURE__*/React.createElement("span", null, "Only Katy Moore's account is live-simulated in this prototype. Adjustments for other directory profiles are recorded as a confirmation only.")), error && /*#__PURE__*/React.createElement("div", {
    className: "adl-banner adl-banner-error"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:alert-triangle"
  }), /*#__PURE__*/React.createElement("span", null, error))), /*#__PURE__*/React.createElement("div", {
    className: "adl-panel-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost",
    type: "button",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy",
    type: "button",
    onClick: submit
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "Execute Adjustment"))));
}
function AuditLedgerView() {
  const [state, setState] = useStateLDG(() => PF_LDG.getState());
  const [panelOpen, setPanelOpen] = useStateLDG(false);
  const [toast, setToast] = useStateLDG(null);
  const [manualCount, setManualCount] = useStateLDG(() => PF_LDG.getState().ledger.filter(t => t.adminId).length);
  const rows = useMemoLDG(() => state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)), [state]);
  const last24h = useMemoLDG(() => rows.filter(t => Date.now() - new Date(t.ts).getTime() < 86400000).length, [rows]);
  const fraudFlags = useMemoLDG(() => rows.filter(t => t.guardrailFlags).length, [rows]);
  const onExecute = res => {
    if (!res.mock) setState(PF_LDG.getState());
    setManualCount(c => c + 1);
    setPanelOpen(false);
    setToast("Adjustment executed for " + res.user.name + ".");
    setTimeout(() => setToast(null), 2800);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Audit Ledger & Manual Adjustments"), /*#__PURE__*/React.createElement("p", null, "Immutable transaction history and support interventions.")), /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy",
    type: "button",
    onClick: () => setPanelOpen(true)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sliders-horizontal"
  }), "Manual Adjustment"))), toast && /*#__PURE__*/React.createElement("div", {
    className: "adl-banner adl-banner-info"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle"
  }), /*#__PURE__*/React.createElement("span", null, toast)), /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-grid"
  }, /*#__PURE__*/React.createElement(LdgStat, {
    label: "Total 24h Transactions",
    value: last24h
  }), /*#__PURE__*/React.createElement(LdgStat, {
    label: "Active Fraud Flags",
    value: fraudFlags,
    tone: fraudFlags ? "var(--error)" : undefined
  }), /*#__PURE__*/React.createElement(LdgStat, {
    label: "Pending Reviews",
    value: state.ledger.filter(t => t.actionId && PF_LDG.getActionById(t.actionId)?.requiresApproval).length
  }), /*#__PURE__*/React.createElement(LdgStat, {
    label: "Total Manual Adjustments",
    value: manualCount
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-row-grid adl-thead ldg-row-grid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Transaction ID"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "User"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Action"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Date"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Points"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Credits"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Flags")), rows.slice(0, 40).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "adl-row-grid adl-trow ldg-row-grid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-cell adl-cell-mono"
  }, t.id), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell"
  }, state.user.name, " Moore"), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell"
  }, t.label, t.adminId && /*#__PURE__*/React.createElement("span", {
    className: "ldg-admin-tag"
  }, " · by ", t.adminId)), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, fmtDate(t.ts)), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell",
    style: {
      color: t.pointsDelta > 0 ? "var(--success)" : t.pointsDelta < 0 ? "var(--error)" : "var(--gray-400)",
      fontWeight: 700
    }
  }, t.pointsDelta > 0 ? "+" : "", t.pointsDelta), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell",
    style: {
      color: t.creditsDelta > 0 ? "var(--success)" : t.creditsDelta < 0 ? "var(--error)" : "var(--gray-400)",
      fontWeight: 700
    }
  }, t.creditsDelta > 0 ? "+" : "", t.creditsDelta), /*#__PURE__*/React.createElement("span", null, t.guardrailFlags ? /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--warning-bg)",
      color: "#96690a"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill-dot",
    style: {
      background: "#96690a"
    }
  }), t.guardrailFlags) : t.adjustmentReason ? /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--info-bg)",
      color: "var(--info)"
    },
    title: t.adjustmentReason
  }, "Manual") : "—")))), /*#__PURE__*/React.createElement(LdgAdjustPanel, {
    open: panelOpen,
    onClose: () => setPanelOpen(false),
    onExecute: onExecute
  }));
}
function AuditLedgerApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-shell"
  }, /*#__PURE__*/React.createElement(AdlSidebar, {
    activeLoyaltyKey: "ledger"
  }), /*#__PURE__*/React.createElement("main", {
    className: "adl-main"
  }, /*#__PURE__*/React.createElement(AdlHeader, {
    title: "Loyalty & Gamification — Audit Ledger"
  }), /*#__PURE__*/React.createElement(AuditLedgerView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AuditLedgerApp, null));
