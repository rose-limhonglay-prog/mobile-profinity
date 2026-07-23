/* ===========================================================================
   PROfinity — Admin · Community (All Channels)
   Channel management list: search/filter/export/add, channel table with
   type/status pills, pagination footer.
   Suffixed -COM to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateCOM
} = React;
function goCOM(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const COM_NAV = [{
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
  chevron: true,
  active: true
}];
const COM_NAV_LINKS = {
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
function COMSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "com-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "com-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), COM_NAV.map(item => {
    const href = COM_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "com-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goCOM(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "com-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "com-chev"
    })));
  }));
}
function COMHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "com-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "com-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "com-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "com-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "com-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "com-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "com-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "com-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "com-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "com-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ---------------------------------------------------------------- data */
const COM_CHANNEL_ROWS = [{
  n: "1",
  icon: "🚨",
  title: "Complications Help!",
  creator: "Sarah Adefehinti",
  private: true,
  plan: true,
  members: "6",
  created: "3/7/2026"
}, {
  n: "2",
  icon: "🏆",
  title: "Confidence Chat",
  creator: "Debby Admin",
  private: true,
  plan: true,
  members: "1261",
  created: "30/6/2026"
}, {
  n: "3",
  icon: "🎗️",
  title: "Freedom Chat",
  creator: "Debby Admin",
  private: true,
  plan: true,
  members: "25",
  created: "5/6/2026"
}, {
  n: "4",
  icon: "🎖️",
  title: "Mastery Chat",
  creator: "Debby Admin",
  private: true,
  plan: true,
  members: "21",
  created: "5/6/2026"
}, {
  n: "5",
  icon: "👥",
  title: "Profinity Clinic Grow…",
  creator: "Debby Admin",
  private: true,
  plan: false,
  members: "133",
  created: "3/6/2026"
}, {
  n: "6",
  icon: "🏆",
  title: "Skinfluencers",
  creator: "Sarah Adefehinti",
  private: true,
  plan: true,
  members: "16",
  created: "11/5/2026"
}, {
  n: "7",
  icon: "💡",
  title: "Tech Team",
  creator: "Debby Admin",
  private: true,
  plan: false,
  members: "12",
  created: "9/5/2026"
}];

/* ---------------------------------------------------------------- list */
function COMChannelTable({
  rows
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "com-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "com-row-grid com-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "com-th"
  }, "#"), /*#__PURE__*/React.createElement("span", {
    className: "com-th"
  }, "CHANNEL TITLE"), /*#__PURE__*/React.createElement("span", {
    className: "com-th"
  }, "CREATOR"), /*#__PURE__*/React.createElement("span", {
    className: "com-th"
  }, "TYPE"), /*#__PURE__*/React.createElement("span", {
    className: "com-th"
  }, "STATUS"), /*#__PURE__*/React.createElement("span", {
    className: "com-th"
  }, "MEMBERS"), /*#__PURE__*/React.createElement("span", {
    className: "com-th"
  }, "CREATED"), /*#__PURE__*/React.createElement("span", null)), rows.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.n,
    className: "com-row-grid com-trow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "com-cell-n"
  }, c.n), /*#__PURE__*/React.createElement("div", {
    className: "com-trow-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "com-trow-icon"
  }, c.icon), /*#__PURE__*/React.createElement("span", {
    className: "com-trow-title-main"
  }, c.title)), /*#__PURE__*/React.createElement("span", {
    className: "com-audience-cell"
  }, c.creator), /*#__PURE__*/React.createElement("div", {
    className: "com-type-cell"
  }, c.private && /*#__PURE__*/React.createElement("span", {
    className: "com-pill com-pill-purple"
  }, "Private"), c.plan && /*#__PURE__*/React.createElement("span", {
    className: "com-pill com-pill-warning"
  }, "Membership Plan")), /*#__PURE__*/React.createElement("div", {
    className: "com-status-pill"
  }, /*#__PURE__*/React.createElement("span", {
    className: "com-status-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "com-status-label"
  }, "Active")), /*#__PURE__*/React.createElement("span", {
    className: "com-metric"
  }, c.members), /*#__PURE__*/React.createElement("span", {
    className: "com-audience-cell"
  }, c.created), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:more-vertical",
    class: "com-row-more"
  }))));
}
function COMView() {
  const [perPage, setPerPage] = useStateCOM("10");
  const rows = COM_CHANNEL_ROWS;
  return /*#__PURE__*/React.createElement("div", {
    className: "com-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "com-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Channel Management"))), /*#__PURE__*/React.createElement("div", {
    className: "com-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "com-search-input-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search channels..."
  })), /*#__PURE__*/React.createElement("button", {
    className: "com-btn com-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sliders-horizontal"
  }), "Filter"), /*#__PURE__*/React.createElement("button", {
    className: "com-btn com-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:download"
  }), "Export"), /*#__PURE__*/React.createElement("button", {
    className: "com-btn com-btn-navy",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Add New")), /*#__PURE__*/React.createElement(COMChannelTable, {
    rows: rows
  }), /*#__PURE__*/React.createElement("div", {
    className: "com-pagination"
  }, /*#__PURE__*/React.createElement("div", {
    className: "com-pagebtn-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: "com-pagebtn",
    disabled: true,
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-left"
  })), /*#__PURE__*/React.createElement("button", {
    className: "com-pagebtn is-active",
    type: "button"
  }, "1"), /*#__PURE__*/React.createElement("button", {
    className: "com-pagebtn",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "com-showing"
  }, "Showing 1–7 of 7"), /*#__PURE__*/React.createElement("div", {
    className: "com-pageinfo"
  }, /*#__PURE__*/React.createElement("span", null, "Rows per page:"), /*#__PURE__*/React.createElement("div", {
    className: "com-pp-select-wrap"
  }, /*#__PURE__*/React.createElement("select", {
    className: "com-pp-select",
    value: perPage,
    onChange: e => setPerPage(e.target.value)
  }, /*#__PURE__*/React.createElement("option", null, "10"), /*#__PURE__*/React.createElement("option", null, "25"), /*#__PURE__*/React.createElement("option", null, "50")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })))));
}
function COMRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "com-shell"
  }, /*#__PURE__*/React.createElement(COMSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "com-main"
  }, /*#__PURE__*/React.createElement(COMHeader, {
    title: "Community"
  }), /*#__PURE__*/React.createElement("div", {
    className: "com-content"
  }, /*#__PURE__*/React.createElement(COMView, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(COMRoot, null));
