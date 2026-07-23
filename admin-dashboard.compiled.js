/* ===========================================================================
   PROfinity — Admin · Dashboard (desktop console)
   Landing overview: stat grid, recent activity feed, quick actions.
   Suffixed -dash to avoid global-scope clashes.
   =========================================================================== */

function goDash(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const DASH_NAV = [{
  icon: "lucide:layout-grid",
  label: "Dashboard",
  active: true
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
const DASH_NAV_LINKS = {
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
function DashSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "dash-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), DASH_NAV.map(item => {
    const href = DASH_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "dash-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goDash(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "dash-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "dash-chev"
    })));
  }));
}
function DashHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "dash-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dash-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "dash-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "dash-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dash-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dash-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "dash-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "dash-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "dash-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ---------------------------------------------------------------- data */
const DASH_STATS = [{
  label: "Total Users",
  value: "0",
  icon: "lucide:users",
  color: "var(--info)",
  bg: "var(--info-bg)"
}, {
  label: "Active Subscriptions",
  value: "0",
  icon: "lucide:star",
  color: "var(--warning)",
  bg: "var(--warning-bg)"
}, {
  label: "Patient Profiles",
  value: "0",
  icon: "lucide:contact",
  color: "var(--success)",
  bg: "var(--success-bg)"
}, {
  label: "Total Clinicians",
  value: "0",
  icon: "lucide:briefcase-medical",
  color: "var(--success)",
  bg: "var(--success-bg)"
}, {
  label: "Total Posts",
  value: "338",
  icon: "lucide:file-text",
  color: "var(--ai-purple)",
  bg: "var(--ai-purple-100)"
}, {
  label: "Flagged Posts",
  value: "0",
  icon: "lucide:flag",
  color: "var(--error)",
  bg: "var(--error-bg)"
}, {
  label: "Flagged Comments",
  value: "0",
  icon: "lucide:message-square",
  color: "var(--warning)",
  bg: "var(--warning-bg)"
}];
const DASH_QUICK_ACTIONS = [{
  label: "Moderate Content",
  icon: "lucide:shield",
  href: "AdminModeration.html"
}, {
  label: "Manage Users",
  icon: "lucide:users",
  href: "AdminUsers.html"
}, {
  label: "View Invoices",
  icon: "lucide:receipt-text",
  href: "AdminTransactions.html"
}];

/* ---------------------------------------------------------------- view */
function DashStatCard({
  stat
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dash-stat-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dash-stat-icon",
    style: {
      background: stat.bg,
      color: stat.color
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: stat.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "dash-stat-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-stat-label"
  }, stat.label), /*#__PURE__*/React.createElement("div", {
    className: "dash-stat-value"
  }, stat.value)));
}
function DashView() {
  return /*#__PURE__*/React.createElement("div", {
    className: "dash-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-page-head"
  }, /*#__PURE__*/React.createElement("h1", null, "Admin Dashboard"), /*#__PURE__*/React.createElement("button", {
    className: "dash-btn dash-btn-navy",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  }), "Refresh")), /*#__PURE__*/React.createElement("div", {
    className: "dash-stat-grid"
  }, DASH_STATS.map(stat => /*#__PURE__*/React.createElement(DashStatCard, {
    key: stat.label,
    stat: stat
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dash-bottom-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dash-card-title-text"
  }, "Recent Activity"), /*#__PURE__*/React.createElement("button", {
    className: "dash-icon-btn",
    type: "button",
    "aria-label": "Refresh recent activity"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dash-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dash-empty-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:inbox"
  })), /*#__PURE__*/React.createElement("p", null, "No recent activity yet"))), /*#__PURE__*/React.createElement("div", {
    className: "dash-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dash-card-title-text"
  }, "Quick Actions")), /*#__PURE__*/React.createElement("div", {
    className: "dash-quick-actions"
  }, DASH_QUICK_ACTIONS.map(action => /*#__PURE__*/React.createElement("button", {
    key: action.label,
    className: "dash-quick-btn",
    type: "button",
    onClick: () => goDash(action.href)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: action.icon
  }), /*#__PURE__*/React.createElement("span", null, action.label)))))));
}
function DashRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "dash-shell"
  }, /*#__PURE__*/React.createElement(DashSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "dash-main"
  }, /*#__PURE__*/React.createElement(DashHeader, {
    title: "Admin Dashboard"
  }), /*#__PURE__*/React.createElement(DashView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(DashRoot, null));
