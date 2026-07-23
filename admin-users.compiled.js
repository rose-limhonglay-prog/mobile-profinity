/* ===========================================================================
   PROfinity — Admin · User Management (desktop console)
   Clinicians / Patients / Admin segmented list with a static mock data table.
   Classes prefixed usr- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateUSR,
  useMemo: useMemoUSR
} = React;
function goUSR(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- mock data */
const RAW_USERS = [{
  email: "gemmaarchbold38@hotmail.com"
}, {
  email: "drmonikaomfs@gmail.com"
}, {
  email: "tommi.marquardt@gmail.com"
}, {
  email: "lutchman.nereshni@gmail.com"
}, {
  email: "thepowderroomkent@gmail.com"
}, {
  email: "aesthetics.by.jo@gmail.com"
}, {
  email: "dr.sarah.chen@outlook.com"
}];
const userRows = RAW_USERS.map(u => ({
  ...u,
  emailShort: u.email.length > 22 ? u.email.slice(0, 20) + "…" : u.email
}));
const USR_SEGMENTS = [{
  key: "clinicians",
  label: "Clinicians",
  icon: "lucide:briefcase-medical",
  count: "23907"
}, {
  key: "patients",
  label: "Patients",
  icon: "lucide:user",
  count: "50"
}, {
  key: "admin",
  label: "Admin",
  icon: "lucide:shield-check",
  count: "19"
}];

/* ------------------------------------------------------------- sidebar */
const USR_NAV = [{
  icon: "lucide:layout-grid",
  label: "Dashboard"
}, {
  icon: "lucide:user",
  label: "Users",
  active: true
}, {
  icon: "lucide:file-text",
  label: "Posts Management"
}, {
  icon: "lucide:layout-dashboard",
  label: "Content Moderation"
}, {
  icon: "lucide:life-buoy",
  label: "Service Requests"
}, {
  icon: "lucide:shield-check",
  label: "Verification"
}, {
  icon: "lucide:users-round",
  label: "Agents"
}, {
  icon: "lucide:calendar",
  label: "Events"
}, {
  icon: "lucide:map",
  label: "Product Mapping"
}, {
  icon: "lucide:bar-chart-3",
  label: "Analytics"
}, {
  icon: "lucide:smartphone",
  label: "App Versions"
}, {
  icon: "lucide:bell",
  label: "Push Notification"
}, {
  icon: "lucide:receipt-text",
  label: "Transactions",
  chevron: true
}, {
  icon: "lucide:table-2",
  label: "Courses",
  chevron: true
}, {
  icon: "lucide:users",
  label: "Community",
  chevron: true
}];
const USR_NAV_LINKS = {
  "Dashboard": "AdminDashboard.html",
  "Users": "AdminUsers.html",
  "Posts Management": "AdminPostsManagement.html",
  "Content Moderation": "AdminModeration.html",
  "Service Requests": "AdminServiceRequests.html",
  "Verification": "AdminVerification.html",
  "Agents": "AdminAgents.html",
  "Events": "AdminEvents.html",
  "Product Mapping": "AdminProductMapping.html",
  "Analytics": "AdminAnalytics.html",
  "App Versions": "AdminAppVersions.html",
  "Push Notification": "AdminPushNotifications.html",
  "Transactions": "AdminTransactions.html",
  "Courses": "AdminCourses.html",
  "Community": "AdminCommunity.html"
};
function USRSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "usr-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "usr-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), USR_NAV.map(item => {
    const href = USR_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "usr-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goUSR(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "usr-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "usr-chev"
    })));
  }));
}
function USRHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "usr-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "usr-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "usr-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "usr-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "usr-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "usr-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "usr-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "usr-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "usr-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "usr-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* --------------------------------------------------------------- toggle */
function USRToggle({
  on
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "usr-toggle" + (on ? " is-on" : ""),
    tabIndex: -1
  }, /*#__PURE__*/React.createElement("span", {
    className: "usr-toggle-knob"
  }));
}

/* ---------------------------------------------------------------- table */
function USRTable({
  rows
}) {
  const [copiedIdx, setCopiedIdx] = useStateUSR(null);
  const copyEmail = (email, idx) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(cur => cur === idx ? null : cur), 1200);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "usr-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "usr-row-grid usr-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "usr-th"
  }, "Name"), /*#__PURE__*/React.createElement("span", {
    className: "usr-th"
  }, "Email"), /*#__PURE__*/React.createElement("span", {
    className: "usr-th"
  }, "Type"), /*#__PURE__*/React.createElement("span", {
    className: "usr-th"
  }, "Method"), /*#__PURE__*/React.createElement("span", {
    className: "usr-th"
  }, "Verified"), /*#__PURE__*/React.createElement("span", {
    className: "usr-th"
  }, "Active"), /*#__PURE__*/React.createElement("span", {
    className: "usr-th"
  }, "Premium"), /*#__PURE__*/React.createElement("span", {
    className: "usr-th"
  }, "Directory"), /*#__PURE__*/React.createElement("span", {
    className: "usr-th usr-th-sort"
  }, "Joined", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-down"
  })), /*#__PURE__*/React.createElement("span", null)), rows.map((u, idx) => /*#__PURE__*/React.createElement("div", {
    key: u.email,
    className: "usr-row-grid usr-trow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "usr-name-cell",
    title: u.email
  }, u.email), /*#__PURE__*/React.createElement("div", {
    className: "usr-email-cell"
  }, /*#__PURE__*/React.createElement("span", {
    className: "usr-email-text",
    title: u.email
  }, u.emailShort), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "usr-copy-btn",
    onClick: () => copyEmail(u.email, idx),
    title: "Copy email"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: copiedIdx === idx ? "lucide:check" : "lucide:copy"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "usr-type-pill"
  }, "clinician"), /*#__PURE__*/React.createElement("span", {
    className: "usr-method-cell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mail"
  }), "free_claim"), /*#__PURE__*/React.createElement("span", {
    className: "usr-verified-pill"
  }, "Verified"), /*#__PURE__*/React.createElement("span", {
    className: "usr-toggle-cell"
  }, /*#__PURE__*/React.createElement(USRToggle, {
    on: false
  })), /*#__PURE__*/React.createElement("span", {
    className: "usr-toggle-cell"
  }, /*#__PURE__*/React.createElement(USRToggle, {
    on: false
  })), /*#__PURE__*/React.createElement("span", {
    className: "usr-directory-cell"
  }, "23/07/2026"), /*#__PURE__*/React.createElement("span", {
    className: "usr-joined-cell"
  }, "23/07/2026"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "usr-row-more"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:more-vertical"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "usr-pagination"
  }, /*#__PURE__*/React.createElement("div", {
    className: "usr-pageinfo"
  }, "Showing 1 to 10 of 23907 entries"), /*#__PURE__*/React.createElement("div", {
    className: "usr-pagebtns"
  }, /*#__PURE__*/React.createElement("div", {
    className: "usr-pageinfo"
  }, /*#__PURE__*/React.createElement("span", null, "Rows per page"), /*#__PURE__*/React.createElement("div", {
    className: "usr-pp-select-wrap"
  }, /*#__PURE__*/React.createElement("select", {
    className: "usr-pp-select",
    defaultValue: "10"
  }, /*#__PURE__*/React.createElement("option", {
    value: "10"
  }, "10"), /*#__PURE__*/React.createElement("option", {
    value: "20"
  }, "20"), /*#__PURE__*/React.createElement("option", {
    value: "50"
  }, "50")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "usr-pagebtn-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: "usr-pagebtn",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-left"
  })), /*#__PURE__*/React.createElement("span", {
    className: "usr-pageindicator"
  }, "1 / 2391"), /*#__PURE__*/React.createElement("button", {
    className: "usr-pagebtn",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  }))))));
}

/* ----------------------------------------------------------------- view */
function USRUsersView() {
  const [segment, setSegment] = useStateUSR("clinicians");
  const [search, setSearch] = useStateUSR("");
  const [refreshKey, setRefreshKey] = useStateUSR(0);
  const filteredRows = useMemoUSR(() => {
    const q = search.trim().toLowerCase();
    if (!q) return userRows;
    return userRows.filter(u => u.email.toLowerCase().includes(q));
  }, [search, refreshKey]);
  return /*#__PURE__*/React.createElement("div", {
    className: "usr-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "usr-page-head"
  }, /*#__PURE__*/React.createElement("h1", null, "User Management"), /*#__PURE__*/React.createElement("div", {
    className: "usr-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "usr-btn usr-btn-navy",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Add New User"), /*#__PURE__*/React.createElement("button", {
    className: "usr-btn usr-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:download"
  }), "Export CSV"), /*#__PURE__*/React.createElement("button", {
    className: "usr-btn usr-btn-navy",
    type: "button",
    onClick: () => setRefreshKey(k => k + 1)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  }), "Refresh"))), /*#__PURE__*/React.createElement("div", {
    className: "usr-search-input-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search users by name or email...",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "usr-info-banner"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:info"
  }), /*#__PURE__*/React.createElement("span", null, "Showing 10 of 23907 clinicians")), /*#__PURE__*/React.createElement("div", {
    className: "usr-segmented"
  }, USR_SEGMENTS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    type: "button",
    className: "usr-seg-btn" + (segment === s.key ? " is-active" : ""),
    onClick: () => setSegment(s.key)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: s.icon
  }), /*#__PURE__*/React.createElement("span", null, s.label), /*#__PURE__*/React.createElement("span", {
    className: "usr-seg-count"
  }, s.count)))), /*#__PURE__*/React.createElement(USRTable, {
    rows: filteredRows
  }));
}
function USRApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "usr-shell"
  }, /*#__PURE__*/React.createElement(USRSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "usr-main"
  }, /*#__PURE__*/React.createElement(USRHeader, {
    title: "User Management"
  }), /*#__PURE__*/React.createElement("div", {
    className: "usr-content"
  }, /*#__PURE__*/React.createElement(USRUsersView, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(USRApp, null));
