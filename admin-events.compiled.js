/* ===========================================================================
   PROfinity — Admin · Events
   List view: Events / Webinars sub-nav toggle, search + create controls,
   events data table (date, time, location, invite/open metrics, status).
   Classes prefixed evt- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateEVT
} = React;
function goEVT(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- nav data */
const EVT_NAV = [{
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
  label: "Events",
  active: true
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
const EVT_NAV_LINKS = {
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

/* ------------------------------------------------------------- sidebar */
function EVTSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "evt-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), EVT_NAV.map(item => {
    const href = EVT_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "evt-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goEVT(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "evt-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "evt-chev"
    })));
  }));
}
function EVTHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "evt-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "evt-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "evt-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "evt-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "evt-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "evt-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "evt-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "evt-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "evt-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* --------------------------------------------------------------- data */
const EVT_ROWS = [{
  name: "Profinity Clinic Growth Summit",
  date: "June 4-5, 2026",
  time: "9:30 AM - 5:30 PM",
  location: "Acquario Romano, Rome, Italy",
  users: "133",
  invited: "41",
  opened: "87"
}, {
  name: "VIP Training: How To Build a THRIVING Clinic That Serve…",
  date: "18th June 2026",
  time: "8pm UK 3pm ET",
  location: "https://us02web.zoom.us/j/…",
  users: "0",
  invited: "0",
  opened: "0"
}];

/* ---------------------------------------------------------------- view */
function EVTListView() {
  const [subTab, setSubTab] = useStateEVT("events");
  const [query, setQuery] = useStateEVT("");
  const rows = EVT_ROWS.filter(r => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "evt-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Events"), /*#__PURE__*/React.createElement("p", null, "Manage conferences, in-person events, and webinars from one place."))), /*#__PURE__*/React.createElement("div", {
    className: "evt-subnav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "evt-subnav-btn" + (subTab === "events" ? " is-active" : ""),
    onClick: () => setSubTab("events")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar"
  }), "Events"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "evt-subnav-btn" + (subTab === "webinars" ? " is-active" : ""),
    onClick: () => setSubTab("webinars")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:video"
  }), "Webinars")), /*#__PURE__*/React.createElement("div", {
    className: "evt-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-search-input-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search title, location, slug...",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    className: "evt-btn evt-btn-navy",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Create Event")), /*#__PURE__*/React.createElement("div", {
    className: "evt-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-row-grid evt-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "EVENT"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "DATE"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "TIME"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "LOCATION"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "USERS"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "INVITED"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "OPENED"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "STATUS"), /*#__PURE__*/React.createElement("span", null)), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "evt-row-grid evt-trow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-trow-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-trow-title-main"
  }, r.name)), /*#__PURE__*/React.createElement("span", {
    className: "evt-cell"
  }, r.date), /*#__PURE__*/React.createElement("span", {
    className: "evt-cell"
  }, r.time), /*#__PURE__*/React.createElement("span", {
    className: "evt-cell evt-cell-location"
  }, r.location), /*#__PURE__*/React.createElement("span", {
    className: "evt-metric"
  }, r.users), /*#__PURE__*/React.createElement("span", {
    className: "evt-metric"
  }, r.invited), /*#__PURE__*/React.createElement("span", {
    className: "evt-metric"
  }, r.opened), /*#__PURE__*/React.createElement("div", {
    className: "evt-status-pill"
  }, /*#__PURE__*/React.createElement("span", {
    className: "evt-status-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "evt-status-label"
  }, "Inactive")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:more-vertical",
    class: "evt-row-more"
  }))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "evt-empty"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar-x"
  }), /*#__PURE__*/React.createElement("span", null, "No events match your search."))));
}

/* ------------------------------------------------------------- root */
function EVTRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "evt-shell"
  }, /*#__PURE__*/React.createElement(EVTSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "evt-main"
  }, /*#__PURE__*/React.createElement(EVTHeader, {
    title: "Events"
  }), /*#__PURE__*/React.createElement("div", {
    className: "evt-content"
  }, /*#__PURE__*/React.createElement(EVTListView, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(EVTRoot, null));
