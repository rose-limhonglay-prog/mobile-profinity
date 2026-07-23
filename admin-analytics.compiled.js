/* ===========================================================================
   PROfinity — Admin · Analytics (desktop console)
   Subscription user counts and recurring revenue summary table.
   Classes prefixed ana- to avoid clashes with other pages.
   =========================================================================== */

function goAna(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const ANA_NAV = [{
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
  label: "Analytics",
  active: true
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
const ANA_NAV_LINKS = {
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
function ANASidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "ana-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ana-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), ANA_NAV.map(item => {
    const href = ANA_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "ana-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goAna(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "ana-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "ana-chev"
    })));
  }));
}
function ANAHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "ana-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ana-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "ana-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "ana-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ana-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ana-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "ana-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ana-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "ana-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "ana-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ------------------------------------------------------------- data */
const analyticsRows = [{
  metric: "Total Users",
  count: "23958",
  revenue: "£38,915.00",
  bold: true
}, {
  metric: "Basic Users (No Trial, No Subscription)",
  count: "23561",
  revenue: "£0.00",
  bold: false
}, {
  metric: "Trial Users (On Trial With CC, No Payment Started)",
  count: "2",
  revenue: "£0.00",
  bold: false
}, {
  metric: "Paying £97/mo User (Confidence)",
  count: "393",
  revenue: "£38,121.00",
  bold: true
}, {
  metric: "Paying £397/mo User (Mastery)",
  count: "2",
  revenue: "£794.00",
  bold: true
}];
function anaFormatCount(n) {
  const num = Number(n);
  return isNaN(num) ? n : num.toLocaleString();
}

/* ------------------------------------------------------------- table */
function ANATable({
  rows
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ana-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ana-row-grid ana-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-th"
  }, "METRIC"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "COUNT"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "RECURRING REVENUE")), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "ana-row-grid ana-trow" + (r.bold ? " is-bold" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-metric-cell"
  }, r.metric), /*#__PURE__*/React.createElement("span", {
    className: "ana-count-cell"
  }, anaFormatCount(r.count)), /*#__PURE__*/React.createElement("span", {
    className: "ana-revenue-cell"
  }, r.revenue))));
}

/* ------------------------------------------------------------- view */
function ANAView() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ana-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ana-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Analytics"), /*#__PURE__*/React.createElement("p", null, "Subscription user counts and recurring revenue")), /*#__PURE__*/React.createElement("div", {
    className: "ana-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ana-btn ana-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar"
  }), "Select date range"), /*#__PURE__*/React.createElement("button", {
    className: "ana-btn ana-btn-navy-outline",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  }), "Refresh"))), /*#__PURE__*/React.createElement(ANATable, {
    rows: analyticsRows
  }));
}

/* ------------------------------------------------------------- root */
function ANAApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ana-shell"
  }, /*#__PURE__*/React.createElement(ANASidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "ana-main"
  }, /*#__PURE__*/React.createElement(ANAHeader, {
    title: "Analytics"
  }), /*#__PURE__*/React.createElement(ANAView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ANAApp, null));
