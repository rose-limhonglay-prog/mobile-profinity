/* ===========================================================================
   PROfinity — Admin · Content Moderation (desktop console)
   Reported-content queue. Presently an empty-queue state: search + status/type
   filters, a warning summary banner, and a large centered empty state — no
   table (nothing has been reported yet). Shares the sidebar/header shell
   pattern with admin-push-notifications.jsx / admin-posts-management.jsx.
   Suffixed -MOD to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateMOD
} = React;
function goMOD(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const MOD_NAV = [{
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
  label: "Content Moderation",
  active: true
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
const MOD_NAV_LINKS = {
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
function MODSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "mod-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mod-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), MOD_NAV.map(item => {
    const href = MOD_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "mod-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goMOD(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "mod-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "mod-chev"
    })));
  }));
}
function MODHeader() {
  return /*#__PURE__*/React.createElement("header", {
    className: "mod-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mod-header-title"
  }, "Content Moderation"), /*#__PURE__*/React.createElement("div", {
    className: "mod-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "mod-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mod-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mod-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "mod-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mod-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "mod-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "mod-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ------------------------------------------------------------------- app */
function ModerationApp() {
  const [query, setQuery] = useStateMOD("");
  const [statusFilter, setStatusFilter] = useStateMOD("all");
  const [typeFilter, setTypeFilter] = useStateMOD("all");
  const [spinning, setSpinning] = useStateMOD(false);
  const handleRefresh = () => {
    setQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSpinning(true);
    setTimeout(() => setSpinning(false), 600);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mod-shell"
  }, /*#__PURE__*/React.createElement(MODSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "mod-main"
  }, /*#__PURE__*/React.createElement(MODHeader, null), /*#__PURE__*/React.createElement("div", {
    className: "mod-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mod-page-head"
  }, /*#__PURE__*/React.createElement("h1", null, "Content Moderation"), /*#__PURE__*/React.createElement("div", {
    className: "mod-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mod-btn mod-btn-outline",
    type: "button",
    onClick: handleRefresh
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw",
    style: spinning ? {
      animation: "modSpin .6s linear"
    } : undefined
  }), "Refresh"))), /*#__PURE__*/React.createElement("div", {
    className: "mod-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mod-search-input-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search by content, reason, or type...",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mod-filter-select"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mod-filter-select-label"
  }, "Status"), /*#__PURE__*/React.createElement("select", {
    value: statusFilter,
    onChange: e => setStatusFilter(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Status"), /*#__PURE__*/React.createElement("option", {
    value: "Pending"
  }, "Pending"), /*#__PURE__*/React.createElement("option", {
    value: "Resolved"
  }, "Resolved"), /*#__PURE__*/React.createElement("option", {
    value: "Dismissed"
  }, "Dismissed")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mod-filter-select"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mod-filter-select-label"
  }, "Type"), /*#__PURE__*/React.createElement("select", {
    value: typeFilter,
    onChange: e => setTypeFilter(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Types"), /*#__PURE__*/React.createElement("option", {
    value: "Post"
  }, "Post"), /*#__PURE__*/React.createElement("option", {
    value: "Comment"
  }, "Comment"), /*#__PURE__*/React.createElement("option", {
    value: "Profile"
  }, "Profile")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mod-warning-banner"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:alert-circle"
  }), /*#__PURE__*/React.createElement("span", null, "Showing ", /*#__PURE__*/React.createElement("strong", null, "0"), " of ", /*#__PURE__*/React.createElement("strong", null, "0"), " reported items")), /*#__PURE__*/React.createElement("div", {
    className: "mod-empty"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:shield-check",
    class: "mod-empty-icon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mod-empty-title"
  }, "No reported content found")))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ModerationApp, null));
