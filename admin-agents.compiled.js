/* ===========================================================================
   PROfinity — Admin · Agents (Agent Interest Tracker)
   Tracks "Notify me" votes from users on locked agents. Currently an empty
   queue — no votes have been recorded yet, so the list renders a header row
   plus an empty state.
   Suffixed -AGT to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateAGT
} = React;
function goAGT(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const AGT_NAV = [{
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
  label: "Agents",
  active: true
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
const AGT_NAV_LINKS = {
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
function AGTSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "agt-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), AGT_NAV.map(item => {
    const href = AGT_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "agt-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goAGT(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "agt-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "agt-chev"
    })));
  }));
}
function AGTHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "agt-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "agt-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "agt-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "agt-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "agt-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "agt-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "agt-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "agt-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "agt-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* --------------------------------------------------------------- view */
function AGTInterestTracker() {
  const [refreshing, setRefreshing] = useStateAGT(false);
  const [lastRefreshed, setLastRefreshed] = useStateAGT(null);
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed(new Date());
    }, 900);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "agt-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Agent Interest Tracker"), /*#__PURE__*/React.createElement("p", null, "Tracks \"Notify me\" votes from users on locked agents.")), /*#__PURE__*/React.createElement("div", {
    className: "agt-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "agt-btn agt-btn-outline-navy" + (refreshing ? " is-refreshing" : ""),
    type: "button",
    onClick: handleRefresh,
    disabled: refreshing
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw",
    class: "agt-refresh-icon"
  }), refreshing ? "Refreshing..." : "Refresh"))), lastRefreshed && /*#__PURE__*/React.createElement("div", {
    className: "agt-refreshed-note"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "Last refreshed at ", lastRefreshed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })), /*#__PURE__*/React.createElement("div", {
    className: "agt-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-row-grid agt-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "AGENT"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "TOTAL VOTES"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "LAST ACTIVITY")), /*#__PURE__*/React.createElement("div", {
    className: "agt-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-empty-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell-off"
  })), /*#__PURE__*/React.createElement("p", {
    className: "agt-empty-text"
  }, "No interest votes recorded yet."))));
}

/* --------------------------------------------------------------- root */
function AGTRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "agt-shell"
  }, /*#__PURE__*/React.createElement(AGTSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "agt-main"
  }, /*#__PURE__*/React.createElement(AGTHeader, {
    title: "Agents"
  }), /*#__PURE__*/React.createElement("div", {
    className: "agt-content"
  }, /*#__PURE__*/React.createElement(AGTInterestTracker, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AGTRoot, null));
