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

/* Sample transactions awaiting admin approval. These belong to mock directory
   members (only Katy Moore is live-simulated), so approve/reject decisions are
   kept in localStorage rather than written to the live ledger. */
const LDG_REVIEWS_KEY = "pf-ledger-reviews";
const LDG_PENDING_SAMPLES = [{
  id: "txn_rev_7k2m9p",
  user: "Eleanor Pena",
  actionId: "evt_license_verify",
  label: "Verify Medical License",
  pointsDelta: 200,
  creditsDelta: 20,
  hoursAgo: 3,
  source: "system",
  detector: "Action rule: requires approval",
  note: "GMC certificate uploaded, awaiting manual check."
}, {
  id: "txn_rev_q4x8ns",
  user: "Marcus Webb",
  actionId: "evt_refer_colleague",
  label: "Refer a Colleague",
  pointsDelta: 200,
  creditsDelta: 20,
  hoursAgo: 9,
  source: "system",
  detector: "Fraud screen: device fingerprint match",
  note: "Referred account shares a device with an existing member."
}, {
  id: "txn_rev_m2h5tw",
  user: "Sofia Alarcón",
  actionId: "evt_prod_review_submit",
  label: "Write a Product Review",
  pointsDelta: 225,
  creditsDelta: 23,
  hoursAgo: 14,
  source: "member",
  detector: "Flagged by 2 members in the app",
  note: "Review text appears copied from a manufacturer listing."
}, {
  id: "txn_rev_c1v6bd",
  user: "Priya Nandwani",
  actionId: "evt_license_verify",
  label: "Verify Medical License",
  pointsDelta: 200,
  creditsDelta: 20,
  hoursAgo: 26,
  source: "system",
  detector: "Media check: image quality too low",
  note: "Licence photo is blurred, may need a re-upload."
}];
function ldgLoadReviews() {
  try {
    return JSON.parse(localStorage.getItem(LDG_REVIEWS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function ldgSaveReviews(map) {
  try {
    localStorage.setItem(LDG_REVIEWS_KEY, JSON.stringify(map));
  } catch (e) {}
}

/* Guardrail codes written by the engine, shown in plain English */
const LDG_FLAG_LABELS = {
  CAP_REACHED: {
    label: "Limit reached",
    tip: "The member had already hit this action's limit (daily, weekly, lifetime, one-time or cooldown), so the action was logged but paid 0 points."
  },
  VELOCITY: {
    label: "Too fast",
    tip: "Repeated the action sooner than the cooldown allows, so no points were paid."
  },
  MIN_CHARS: {
    label: "Too short",
    tip: "The text was under the minimum length for this action, so no points were paid."
  }
};
function ldgFlag(code) {
  return LDG_FLAG_LABELS[code] || {
    label: code.replace(/_/g, " ").toLowerCase().replace(/^./, c => c.toUpperCase()),
    tip: "Guardrail " + code
  };
}
function ldgEmailFor(name) {
  const live = PF_LDG.getState().user;
  if (name === live.name + " Moore") return live.email;
  const hit = PF_LDG.MOCK_DIRECTORY.find(u => u.name === name);
  return hit ? hit.email : null;
}
function LdgUserLink({
  name
}) {
  const email = ldgEmailFor(name);
  if (!email) return /*#__PURE__*/React.createElement("span", {
    className: "adl-cell"
  }, name);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "adl-cell ldg-user-link",
    title: "Open " + name + "'s rewards board",
    onClick: () => goLDG("AdminMemberRewards.html?user=" + encodeURIComponent(email) + "&ret=AdminAuditLedger.html")
  }, name);
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
const LDG_TIPS = {
  id: "Unique reference for this ledger entry. Quote it when a member queries a points change.",
  user: "The member whose points or credit balance changed. Click a name to open their rewards board.",
  action: "What the member did to earn or spend, or the manual adjustment that was made and which admin made it.",
  date: "When the transaction was recorded, shown in your local time.",
  points: "Points added (green) or removed (red) by this transaction. Amber 'held' points are waiting for approval. A grey 0 means the action counted but earned nothing, usually because a cap was reached.",
  credits: "Store credits earned alongside points. Members get about 1 credit for every 10 points.",
  flags: "Status of the transaction. Pending review rows say who held them: Auto-detected means an action rule or fraud check fired; Reported by member means someone flagged it in the app. Approve or reject here. Also shows Approved, Rejected, guardrail warnings such as Limit reached, or Manual for an admin adjustment.",
  stat24h: "Ledger entries recorded in the last 24 hours across all members.",
  statFraud: "Transactions currently flagged by the guardrails for suspicious, repeated or capped activity.",
  statPending: "Transactions for actions that need admin approval before the points are released to the member."
};
function LdgDelta({
  value,
  review
}) {
  if (review === "pending") return /*#__PURE__*/React.createElement("span", {
    className: "adl-cell ldg-held",
    title: "Held until an admin approves this transaction"
  }, "+", value, /*#__PURE__*/React.createElement("small", null, "held"));
  if (review === "rejected") return /*#__PURE__*/React.createElement("span", {
    className: "adl-cell",
    style: {
      color: "var(--gray-400)",
      fontWeight: 700,
      textDecoration: "line-through"
    }
  }, "+", value);
  return /*#__PURE__*/React.createElement("span", {
    className: "adl-cell",
    style: {
      color: value > 0 ? "var(--success)" : value < 0 ? "var(--error)" : "var(--gray-400)",
      fontWeight: 700
    }
  }, value > 0 ? "+" : "", value);
}
function LdgInfo({
  text,
  left
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "adl-info" + (left ? " is-left" : ""),
    tabIndex: 0,
    role: "img",
    "aria-label": text
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:info"
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-info-tip",
    "aria-hidden": "true"
  }, text));
}
function LdgStat({
  label,
  value,
  tone,
  tip
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-stat-label"
  }, label, tip && /*#__PURE__*/React.createElement(LdgInfo, {
    text: tip,
    left: true
  })), /*#__PURE__*/React.createElement("div", {
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
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
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
    className: "adl-scrim is-center",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-panel adl-modal ldg-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "ldg-adjust-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-panel-head"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "ldg-adjust-title"
  }, "Manual Point / Credit Adjustment"), /*#__PURE__*/React.createElement("button", {
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
    type: "text",
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
    className: "ldg-modal-row"
  }, /*#__PURE__*/React.createElement("div", {
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
  }))), /*#__PURE__*/React.createElement("div", {
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
  const [panelOpen, setPanelOpen] = useStateLDG(() => new URLSearchParams(location.search).has("adjust"));
  const [toast, setToast] = useStateLDG(null);
  const [reviews, setReviews] = useStateLDG(ldgLoadReviews);
  const rows = useMemoLDG(() => {
    const liveName = state.user.name + " Moore";
    const live = state.ledger.map(t => Object.assign({
      user: liveName,
      review: PF_LDG.getActionById(t.actionId)?.requiresApproval && !t.adminId ? "pending" : null,
      source: "system",
      detector: "Action rule: requires approval"
    }, t));
    const samples = LDG_PENDING_SAMPLES.map(p => Object.assign({}, p, {
      ts: new Date(Date.now() - p.hoursAgo * 3600000).toISOString(),
      guardrailFlags: null,
      adminId: null,
      adjustmentReason: null,
      sample: true,
      review: reviews[p.id] || "pending"
    }));
    return live.concat(samples).sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }, [state, reviews]);
  const last24h = useMemoLDG(() => rows.filter(t => Date.now() - new Date(t.ts).getTime() < 86400000).length, [rows]);
  const fraudFlags = useMemoLDG(() => rows.filter(t => t.guardrailFlags).length, [rows]);
  const pendingCount = useMemoLDG(() => rows.filter(t => t.review === "pending").length, [rows]);
  const decide = (t, verdict) => {
    setReviews(prev => {
      const next = Object.assign({}, prev, {
        [t.id]: verdict
      });
      ldgSaveReviews(next);
      return next;
    });
    setToast((verdict === "approved" ? "Approved: " : "Rejected: ") + t.label + " for " + t.user + (verdict === "approved" ? " · +" + t.pointsDelta + " pts released." : " · no points awarded."));
    setTimeout(() => setToast(null), 2800);
  };
  const onExecute = res => {
    if (!res.mock) setState(PF_LDG.getState());
    setPanelOpen(false);
    setToast("Adjustment executed for " + res.user.name + ".");
    setTimeout(() => setToast(null), 2800);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Points Ledger"), /*#__PURE__*/React.createElement("p", null, "Every point and credit movement, recorded permanently. Step in with a manual correction when support needs it.")), /*#__PURE__*/React.createElement("div", {
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
    className: "adl-stat-grid ldg-stats-3"
  }, /*#__PURE__*/React.createElement(LdgStat, {
    label: "Total 24h Transactions",
    value: last24h,
    tip: LDG_TIPS.stat24h
  }), /*#__PURE__*/React.createElement(LdgStat, {
    label: "Active Fraud Flags",
    value: fraudFlags,
    tone: fraudFlags ? "var(--error)" : undefined,
    tip: LDG_TIPS.statFraud
  }), /*#__PURE__*/React.createElement(LdgStat, {
    label: "Pending Reviews",
    value: pendingCount,
    tone: pendingCount ? "var(--warning)" : undefined,
    tip: LDG_TIPS.statPending
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-row-grid adl-thead ldg-row-grid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-th ldg-th"
  }, "Transaction ID", /*#__PURE__*/React.createElement(LdgInfo, {
    text: LDG_TIPS.id,
    left: true
  })), /*#__PURE__*/React.createElement("span", {
    className: "adl-th ldg-th"
  }, "User", /*#__PURE__*/React.createElement(LdgInfo, {
    text: LDG_TIPS.user
  })), /*#__PURE__*/React.createElement("span", {
    className: "adl-th ldg-th"
  }, "Action", /*#__PURE__*/React.createElement(LdgInfo, {
    text: LDG_TIPS.action
  })), /*#__PURE__*/React.createElement("span", {
    className: "adl-th ldg-th"
  }, "Date", /*#__PURE__*/React.createElement(LdgInfo, {
    text: LDG_TIPS.date
  })), /*#__PURE__*/React.createElement("span", {
    className: "adl-th ldg-th"
  }, "Points", /*#__PURE__*/React.createElement(LdgInfo, {
    text: LDG_TIPS.points
  })), /*#__PURE__*/React.createElement("span", {
    className: "adl-th ldg-th"
  }, "Credits", /*#__PURE__*/React.createElement(LdgInfo, {
    text: LDG_TIPS.credits
  })), /*#__PURE__*/React.createElement("span", {
    className: "adl-th ldg-th"
  }, "Flags", /*#__PURE__*/React.createElement(LdgInfo, {
    text: LDG_TIPS.flags
  }))), rows.slice(0, 40).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "adl-row-grid adl-trow ldg-row-grid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-cell adl-cell-mono"
  }, t.id), /*#__PURE__*/React.createElement(LdgUserLink, {
    name: t.user
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell"
  }, t.label, t.adminId && /*#__PURE__*/React.createElement("span", {
    className: "ldg-admin-tag"
  }, " · by ", t.adminId), t.review === "pending" && t.note && /*#__PURE__*/React.createElement("span", {
    className: "ldg-admin-tag ldg-note"
  }, " · ", t.note)), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, fmtDate(t.ts)), /*#__PURE__*/React.createElement(LdgDelta, {
    value: t.pointsDelta,
    review: t.review
  }), /*#__PURE__*/React.createElement(LdgDelta, {
    value: t.creditsDelta,
    review: t.review
  }), /*#__PURE__*/React.createElement("span", {
    className: "ldg-flags-cell"
  }, t.review === "pending" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill ldg-pill-pending"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill-dot"
  }), "Pending review"), /*#__PURE__*/React.createElement("span", {
    className: "ldg-source" + (t.source === "member" ? " is-member" : ""),
    title: t.source === "member" ? "A member reported this transaction from the app" : "The system held this automatically"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: t.source === "member" ? "lucide:flag" : "lucide:scan-search"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ldg-source-label"
  }, t.source === "member" ? "Member report" : "Auto-detected"), /*#__PURE__*/React.createElement("span", {
    className: "ldg-source-detail"
  }, t.detector)), /*#__PURE__*/React.createElement("span", {
    className: "ldg-review-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ldg-review-btn is-approve",
    title: "Approve and release points",
    onClick: () => decide(t, "approved")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "Approve"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ldg-review-btn is-reject",
    title: "Reject, no points awarded",
    onClick: () => decide(t, "rejected")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }), "Reject"))) : t.review === "approved" ? /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--success-bg)",
      color: "var(--success)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill-dot",
    style: {
      background: "var(--success)"
    }
  }), "Approved") : t.review === "rejected" ? /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--error-bg)",
      color: "var(--error)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill-dot",
    style: {
      background: "var(--error)"
    }
  }), "Rejected") : t.guardrailFlags ? /*#__PURE__*/React.createElement("span", {
    className: "adl-pill",
    style: {
      background: "var(--warning-bg)",
      color: "#96690a"
    },
    title: ldgFlag(t.guardrailFlags).tip
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-pill-dot",
    style: {
      background: "#96690a"
    }
  }), ldgFlag(t.guardrailFlags).label) : t.adjustmentReason ? /*#__PURE__*/React.createElement("span", {
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
    title: "Loyalty & Gamification — Points Ledger"
  }), /*#__PURE__*/React.createElement(AuditLedgerView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AuditLedgerApp, null));
