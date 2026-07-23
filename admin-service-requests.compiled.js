/* ===========================================================================
   PROfinity — Admin · Service Requests (desktop console)
   Review of clinician-suggested services: filter pills (Pending / Approved /
   Rejected / All), refresh action, and an approve/reject review table.
   Suffixed -SVC to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateSVC,
  useMemo: useMemoSVC
} = React;
function goSVC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- mock data */
const SVC_FILTERS = ["Pending", "Approved", "Rejected", "All"];
const serviceRows = [{
  name: "Regenerative Injectables – Profhilo,…",
  by: "Alexandra Clark",
  submitted: "10 Jul 2026 09:06",
  status: "Pending"
}, {
  name: "Regerative Injections- Skin Booster…",
  by: "Alexandra Clark",
  submitted: "10 Jul 2026 09:00",
  status: "Pending"
}];
const SVC_STATUS_META = {
  Pending: {
    color: "var(--warning)",
    bg: "var(--warning-bg)"
  },
  Approved: {
    color: "var(--success)",
    bg: "var(--success-bg)"
  },
  Rejected: {
    color: "var(--error)",
    bg: "var(--error-bg)"
  }
};

/* ------------------------------------------------------------- sidebar */
const SVC_NAV = [{
  icon: "lucide:layout-grid",
  label: "Dashboard"
}, {
  icon: "lucide:user",
  label: "Users"
}, {
  icon: "lucide:file-text",
  label: "Posts Management"
}, {
  icon: "lucide:layout-dashboard",
  label: "Content Moderation"
}, {
  icon: "lucide:life-buoy",
  label: "Service Requests",
  active: true
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
const SVC_NAV_LINKS = {
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
function SVCSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "svc-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), SVC_NAV.map(item => {
    const href = SVC_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "svc-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goSVC(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "svc-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "svc-chev"
    })));
  }));
}
function SVCHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "svc-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "svc-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "svc-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "svc-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "svc-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "svc-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "svc-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "svc-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "svc-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* -------------------------------------------------------------- filters */
function SVCFilterTabs({
  filter,
  setFilter,
  onRefresh,
  refreshing
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "svc-filterbar"
  }, SVC_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    type: "button",
    className: "svc-filter-pill" + (filter === f ? " is-active" : ""),
    onClick: () => setFilter(f)
  }, f)), /*#__PURE__*/React.createElement("span", {
    className: "svc-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "svc-refresh-btn" + (refreshing ? " is-spinning" : ""),
    onClick: onRefresh,
    "aria-label": "Refresh"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  })));
}

/* ---------------------------------------------------------------- table */
function SVCTable({
  rows,
  onApprove,
  onReject
}) {
  if (rows.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "svc-table"
    }, /*#__PURE__*/React.createElement("div", {
      className: "svc-row-grid svc-thead"
    }, /*#__PURE__*/React.createElement("span", {
      className: "svc-th"
    }, "SERVICE NAME"), /*#__PURE__*/React.createElement("span", {
      className: "svc-th"
    }, "USER TYPE"), /*#__PURE__*/React.createElement("span", {
      className: "svc-th"
    }, "SUBMITTED BY"), /*#__PURE__*/React.createElement("span", {
      className: "svc-th"
    }, "SUBMITTED"), /*#__PURE__*/React.createElement("span", {
      className: "svc-th"
    }, "STATUS"), /*#__PURE__*/React.createElement("span", {
      className: "svc-th"
    }, "ACTION")), /*#__PURE__*/React.createElement("div", {
      className: "svc-empty"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:inbox"
    }), /*#__PURE__*/React.createElement("div", {
      className: "svc-empty-title"
    }, "No service requests"), /*#__PURE__*/React.createElement("div", {
      className: "svc-empty-sub"
    }, "There's nothing in this filter right now.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "svc-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-row-grid svc-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "svc-th"
  }, "SERVICE NAME"), /*#__PURE__*/React.createElement("span", {
    className: "svc-th"
  }, "USER TYPE"), /*#__PURE__*/React.createElement("span", {
    className: "svc-th"
  }, "SUBMITTED BY"), /*#__PURE__*/React.createElement("span", {
    className: "svc-th"
  }, "SUBMITTED"), /*#__PURE__*/React.createElement("span", {
    className: "svc-th"
  }, "STATUS"), /*#__PURE__*/React.createElement("span", {
    className: "svc-th"
  }, "ACTION")), rows.map((r, i) => {
    const s = SVC_STATUS_META[r.status] || SVC_STATUS_META.Pending;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "svc-row-grid svc-trow"
    }, /*#__PURE__*/React.createElement("div", {
      className: "svc-trow-name"
    }, r.name), /*#__PURE__*/React.createElement("span", {
      className: "svc-cell"
    }, "-"), /*#__PURE__*/React.createElement("span", {
      className: "svc-cell"
    }, r.by), /*#__PURE__*/React.createElement("span", {
      className: "svc-cell"
    }, r.submitted), /*#__PURE__*/React.createElement("div", {
      className: "svc-status-pill",
      style: {
        background: s.bg
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "svc-status-dot",
      style: {
        background: s.color
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "svc-status-label",
      style: {
        color: s.color
      }
    }, r.status)), /*#__PURE__*/React.createElement("div", {
      className: "svc-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "svc-action svc-action-approve",
      onClick: () => onApprove(i)
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:check"
    }), "Approve"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "svc-action svc-action-reject",
      onClick: () => onReject(i),
      "aria-label": "Reject"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:x"
    }))));
  }));
}

/* --------------------------------------------------------------- root */
function SVCApp() {
  const [filter, setFilter] = useStateSVC("Pending");
  const [refreshing, setRefreshing] = useStateSVC(false);
  const filteredRows = useMemoSVC(() => {
    if (filter === "All") return serviceRows;
    return serviceRows.filter(r => r.status === filter);
  }, [filter]);
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "svc-shell"
  }, /*#__PURE__*/React.createElement(SVCSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "svc-main"
  }, /*#__PURE__*/React.createElement(SVCHeader, {
    title: "Service Requests"
  }), /*#__PURE__*/React.createElement("div", {
    className: "svc-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Service Requests"), /*#__PURE__*/React.createElement("p", null, "Review services suggested by clinicians."))), /*#__PURE__*/React.createElement(SVCFilterTabs, {
    filter: filter,
    setFilter: setFilter,
    onRefresh: handleRefresh,
    refreshing: refreshing
  }), /*#__PURE__*/React.createElement(SVCTable, {
    rows: filteredRows,
    onApprove: () => {},
    onReject: () => {}
  })))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(SVCApp, null));
