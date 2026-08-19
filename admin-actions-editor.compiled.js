/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Actions Editor (Screen 1)
   Desktop admin console. Manages the catalog of scoreable events: general
   settings, conditions & filters, caps & velocity, guardrails & security,
   and linked reward configuration. Backed by window.PFLoyalty (see
   loyalty-engine.js) so edits are reflected immediately in Ways to Earn,
   Tier Multipliers overrides, and the Audit Ledger on the Katy side.
   Classes prefixed act- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateACT,
  useMemo: useMemoACT
} = React;
const PF_ACT = window.PFLoyalty;
function goACT(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const CATEGORIES_ACT = ["Onboarding", "Profile", "Reviews", "Community", "Social", "Learning", "Habit", "Purchases"];
const PLATFORMS_ACT = [{
  key: "web",
  label: "Web UI"
}, {
  key: "ios",
  label: "iOS App"
}, {
  key: "android",
  label: "Android App"
}, {
  key: "pos",
  label: "In-Store POS"
}];

/* ---------------------------------------------------------- shared chrome */
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
    onClick: () => goACT(item.href)
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
    onClick: () => goACT("AdminActionsEditor.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), /*#__PURE__*/React.createElement("span", null, "Loyalty & Gamification")), /*#__PURE__*/React.createElement("div", {
    className: "adl-subnav"
  }, ADL_LOYALTY_SUBNAV.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goACT(s.href)
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

/* -------------------------------------------------------------- ACT view */
function ActList({
  actions,
  selectedId,
  onSelect,
  search,
  setSearch
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "act-list-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-search-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search actions...",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "act-list"
  }, actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    type: "button",
    className: "act-list-row" + (a.id === selectedId ? " is-active" : ""),
    onClick: () => onSelect(a.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "act-list-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "act-list-row-name"
  }, a.label), /*#__PURE__*/React.createElement("span", {
    className: "act-list-row-meta"
  }, a.category, " · ", a.basePoints, " pts")), /*#__PURE__*/React.createElement("span", {
    className: "act-dot" + (a.active ? " on" : ""),
    title: a.active ? "Active" : "Disabled"
  })))));
}
function ActEditor({
  action,
  achievementBadges,
  onChange,
  onSave,
  onNew
}) {
  if (!action) return /*#__PURE__*/React.createElement("div", {
    className: "adl-card act-empty"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mouse-pointer-click"
  }), /*#__PURE__*/React.createElement("p", null, "Select an action on the left to edit it, or create a new one."));
  const set = patch => onChange({
    ...action,
    ...patch
  });
  const togglePlatform = key => {
    const has = action.platforms.includes(key);
    set({
      platforms: has ? action.platforms.filter(p => p !== key) : action.platforms.concat([key])
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "act-editor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-editor-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Edit Action: ", action.label || "Untitled Action"), /*#__PURE__*/React.createElement("p", {
    className: "act-editor-key"
  }, "Internal Key / Event ID: ", /*#__PURE__*/React.createElement("code", null, action.id), !action.isNew && " (immutable)")), /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost",
    type: "button",
    onClick: onNew
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "New Action"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy",
    type: "button",
    onClick: onSave
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:save"
  }), "Save Changes"))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "General Settings")), /*#__PURE__*/React.createElement("div", {
    className: "adl-field-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Action Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: action.label,
    onChange: e => set({
      label: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Category"), /*#__PURE__*/React.createElement("select", {
    value: action.category,
    onChange: e => set({
      category: e.target.value
    })
  }, CATEGORIES_ACT.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field-row",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Base Points Granted"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: action.basePoints,
    onChange: e => set({
      basePoints: Number(e.target.value) || 0
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row",
    style: {
      borderBottom: "none",
      paddingTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row-label"
  }, "Active"), /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row-sub"
  }, "Toggle this action on/off across the platform")), /*#__PURE__*/React.createElement(AdlToggle, {
    on: action.active,
    onToggle: () => set({
      active: !action.active
    }),
    label: "Active"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Conditions & Filters")), /*#__PURE__*/React.createElement("div", {
    className: "act-platform-row"
  }, PLATFORMS_ACT.map(p => /*#__PURE__*/React.createElement("label", {
    key: p.key,
    className: "act-platform-chip" + (action.platforms.includes(p.key) ? " is-on" : "")
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: action.platforms.includes(p.key),
    onChange: () => togglePlatform(p.key)
  }), p.label))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field-row",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Minimum Character Length"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: action.minCharacters,
    onChange: e => set({
      minCharacters: Number(e.target.value) || 0
    })
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-field-hint"
  }, "Filters short spam comments/bios.")), /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row",
    style: {
      borderBottom: "none",
      paddingTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row-label"
  }, "Requires Media Upload")), /*#__PURE__*/React.createElement(AdlToggle, {
    on: action.requiresMedia,
    onToggle: () => set({
      requiresMedia: !action.requiresMedia
    }),
    label: "Requires media"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Caps & Velocity")), /*#__PURE__*/React.createElement("div", {
    className: "adl-field-row-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Daily Cap"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Unlimited",
    value: action.dailyCap ?? "",
    onChange: e => set({
      dailyCap: e.target.value === "" ? null : Number(e.target.value)
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Weekly Cap"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Unlimited",
    value: action.weeklyCap ?? "",
    onChange: e => set({
      weeklyCap: e.target.value === "" ? null : Number(e.target.value)
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Lifetime Cap"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Unlimited",
    value: action.lifetimeCap ?? "",
    onChange: e => set({
      lifetimeCap: e.target.value === "" ? null : Number(e.target.value)
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field-row",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Velocity Rule (seconds between completions)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: action.velocitySeconds,
    onChange: e => set({
      velocitySeconds: Number(e.target.value) || 0
    })
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-field-hint"
  }, "e.g. 3 = max 1 per 3 seconds, 120 = 2-minute cooldown.")), /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row",
    style: {
      borderBottom: "none",
      paddingTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row-label"
  }, "One-Time Lifetime Lock"), /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row-sub"
  }, "Repeat edits record a 0-point delta.")), /*#__PURE__*/React.createElement(AdlToggle, {
    on: action.oneTimeLock,
    onToggle: () => set({
      oneTimeLock: !action.oneTimeLock
    }),
    label: "One-time lock"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Guardrails & Security")), /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row-label"
  }, "Require Manual Approval"), /*#__PURE__*/React.createElement("div", {
    className: "adl-toggle-row-sub"
  }, "Holds points until an admin authorizes the transaction.")), /*#__PURE__*/React.createElement(AdlToggle, {
    on: action.requiresApproval,
    onToggle: () => set({
      requiresApproval: !action.requiresApproval
    }),
    label: "Requires approval"
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field",
    style: {
      marginTop: 16,
      maxWidth: 260
    }
  }, /*#__PURE__*/React.createElement("label", null, "Points Hold Buffer (days)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: action.holdDays,
    onChange: e => set({
      holdDays: Number(e.target.value) || 0
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("label", null, "Guardrail Note (internal)"), /*#__PURE__*/React.createElement("textarea", {
    value: action.guardrail,
    onChange: e => set({
      guardrail: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Linked Reward Configuration")), /*#__PURE__*/React.createElement("div", {
    className: "adl-field",
    style: {
      maxWidth: 380
    }
  }, /*#__PURE__*/React.createElement("label", null, "Auto-trigger badge on completion (optional)"), /*#__PURE__*/React.createElement("select", {
    value: action.linkedReward || "",
    onChange: e => set({
      linkedReward: e.target.value || null
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "No linked reward"), achievementBadges.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.key,
    value: "badge:" + b.key
  }, b.name))))));
}
function ActionsEditorView() {
  const [config, setConfig] = useStateACT(() => PF_ACT.getConfig());
  const [selectedId, setSelectedId] = useStateACT(() => config.actions[0].id);
  const [draft, setDraft] = useStateACT(() => ({
    ...config.actions[0]
  }));
  const [search, setSearch] = useStateACT("");
  const [toast, setToast] = useStateACT(null);
  const filtered = useMemoACT(() => {
    const q = search.trim().toLowerCase();
    if (!q) return config.actions;
    return config.actions.filter(a => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [config, search]);
  const select = id => {
    setSelectedId(id);
    setDraft({
      ...config.actions.find(a => a.id === id)
    });
  };
  const save = () => {
    const next = PF_ACT.upsertAction(draft);
    setConfig(next);
    setToast("Saved “" + draft.label + "”.");
    setTimeout(() => setToast(null), 2400);
  };
  const createNew = () => {
    const id = "evt_new_" + Math.random().toString(36).slice(2, 7);
    const blank = {
      id,
      label: "New Action",
      category: "Community",
      basePoints: 50,
      dailyCap: null,
      weeklyCap: null,
      lifetimeCap: null,
      velocitySeconds: 0,
      minCharacters: 0,
      requiresMedia: false,
      requiresApproval: false,
      holdDays: 0,
      platforms: ["web", "ios", "android"],
      active: true,
      oneTimeLock: false,
      guardrail: "",
      linkedReward: null,
      isNew: true
    };
    setSelectedId(id);
    setDraft(blank);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Actions Editor"), /*#__PURE__*/React.createElement("p", null, "Create and edit the catalog of trackable, point-earning events."))), toast && /*#__PURE__*/React.createElement("div", {
    className: "adl-banner adl-banner-info"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle"
  }), /*#__PURE__*/React.createElement("span", null, toast)), /*#__PURE__*/React.createElement("div", {
    className: "act-grid"
  }, /*#__PURE__*/React.createElement(ActList, {
    actions: filtered,
    selectedId: selectedId,
    onSelect: select,
    search: search,
    setSearch: setSearch
  }), /*#__PURE__*/React.createElement(ActEditor, {
    action: draft,
    achievementBadges: config.achievementBadges,
    onChange: setDraft,
    onSave: save,
    onNew: createNew
  })));
}
function ActionsEditorApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-shell"
  }, /*#__PURE__*/React.createElement(AdlSidebar, {
    activeLoyaltyKey: "actions"
  }), /*#__PURE__*/React.createElement("main", {
    className: "adl-main"
  }, /*#__PURE__*/React.createElement(AdlHeader, {
    title: "Loyalty & Gamification — Actions Editor"
  }), /*#__PURE__*/React.createElement(ActionsEditorView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ActionsEditorApp, null));
