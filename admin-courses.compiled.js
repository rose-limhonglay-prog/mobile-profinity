/* ===========================================================================
   PROfinity — Admin · Courses (All Courses list)
   Shares the sidebar/header shell pattern with admin-push-notifications.jsx
   and admin-posts-management.jsx. Suffixed -CRS to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateCRS
} = React;
function goCrs(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const CRS_NAV = [{
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
  chevron: true,
  active: true
}, {
  icon: "lucide:users",
  label: "Community",
  chevron: true
}];
const CRS_NAV_LINKS = {
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
function CrsSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "crs-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crs-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), CRS_NAV.map(item => {
    const href = CRS_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "crs-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goCrs(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "crs-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "crs-chev"
    })));
  }));
}
function CrsHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "crs-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "crs-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "crs-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "crs-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "crs-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "crs-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "crs-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crs-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "crs-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "crs-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ----------------------------------------------------------------- data */
const CRS_ROWS = [{
  id: 1,
  sku: "000",
  title: "Needle or Cannula Trade Off …",
  subtitle: "Choosing your instru…",
  cat: "Botox",
  level: "Intermediate",
  full: "€ 57",
  plan: "-"
}, {
  id: 2,
  sku: "1234689",
  title: "HTML Testing",
  subtitle: "HTML Testing",
  cat: "Fillers",
  level: "Beginner",
  full: "€ 999",
  plan: "-"
}, {
  id: 3,
  sku: "000",
  title: "The Dream Clinic Playbook",
  subtitle: "8 Laws for Building a …",
  cat: "Business",
  level: "Beginner",
  full: "-",
  plan: "-"
}, {
  id: 4,
  sku: "000",
  title: "Technique Tuesday Case Stu…",
  subtitle: "Full-face correction a…",
  cat: "Consultation",
  level: "Beginner",
  full: "€ 0",
  plan: "-"
}, {
  id: 5,
  sku: "020",
  title: "Dermal Filler Complications …",
  subtitle: "",
  cat: "Aesthetics",
  level: "Intermediate",
  full: "€ 1000",
  plan: "€ 267"
}, {
  id: 6,
  sku: "020",
  title: "Botulinum Toxin Complicatio…",
  subtitle: "",
  cat: "Aesthetics",
  level: "Intermediate",
  full: "€ 697",
  plan: "€ 267"
}, {
  id: 7,
  sku: "021",
  title: "Dermal Fillers Foundation Co…",
  subtitle: "",
  cat: "Aesthetics",
  level: "Intermediate",
  full: "€ 249",
  plan: "-"
}];

/* --------------------------------------------------------------- checkbox */
function CrsCheck({
  on,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "crs-check" + (on ? " is-on" : ""),
    onClick: onClick
  }, on && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }));
}

/* ---------------------------------------------------------------- table */
function CrsRow({
  row,
  checked,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "crs-row-grid crs-trow",
    style: {
      background: checked ? "var(--brand-gold-100)" : "var(--white)"
    }
  }, /*#__PURE__*/React.createElement(CrsCheck, {
    on: checked,
    onClick: onToggle
  }), /*#__PURE__*/React.createElement("span", {
    className: "crs-sku-cell"
  }, row.sku), /*#__PURE__*/React.createElement("div", {
    className: "crs-trow-title"
  }, row.title), /*#__PURE__*/React.createElement("span", {
    className: "crs-subtitle-cell"
  }, row.subtitle || "—"), /*#__PURE__*/React.createElement("span", {
    className: "crs-cat-pill"
  }, row.cat), /*#__PURE__*/React.createElement("span", {
    className: "crs-level-cell"
  }, row.level), /*#__PURE__*/React.createElement("span", {
    className: "crs-price-cell",
    style: {
      color: row.full === "-" ? "var(--gray-400)" : "var(--gray-800)"
    }
  }, row.full), /*#__PURE__*/React.createElement("span", {
    className: "crs-price-cell",
    style: {
      color: row.plan === "-" ? "var(--gray-400)" : "var(--gray-800)"
    }
  }, row.plan), /*#__PURE__*/React.createElement("div", {
    className: "crs-status-cell"
  }, /*#__PURE__*/React.createElement("span", {
    className: "crs-toggle is-on"
  }, /*#__PURE__*/React.createElement("span", {
    className: "crs-toggle-knob"
  })), /*#__PURE__*/React.createElement("span", {
    className: "crs-status-label"
  }, "Active")));
}

/* ---------------------------------------------------------------- view */
function CrsView() {
  const [selected, setSelected] = useStateCRS({});
  const count = Object.values(selected).filter(Boolean).length;
  const allChecked = CRS_ROWS.length > 0 && count === CRS_ROWS.length;
  const toggleAll = () => {
    if (allChecked) {
      setSelected({});
      return;
    }
    const sel = {};
    CRS_ROWS.forEach(r => sel[r.id] = true);
    setSelected(sel);
  };
  const toggleOne = id => setSelected(st => {
    const sel = {
      ...st
    };
    if (sel[id]) delete sel[id];else sel[id] = true;
    return sel;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "crs-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crs-utilitybar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "crs-utility-label"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:book-open"
  }), "Courses"), /*#__PURE__*/React.createElement("div", {
    className: "crs-utility-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search courses..."
  })), /*#__PURE__*/React.createElement("button", {
    className: "crs-refresh-btn",
    type: "button",
    "aria-label": "Refresh"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "crs-page-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Courses"), /*#__PURE__*/React.createElement("button", {
    className: "crs-btn crs-btn-navy",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "New Course")), /*#__PURE__*/React.createElement("div", {
    className: "crs-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crs-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "crs-card-title"
  }, "Course List"), /*#__PURE__*/React.createElement("div", {
    className: "crs-card-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "crs-text-btn",
    type: "button"
  }, "Filter"), /*#__PURE__*/React.createElement("button", {
    className: "crs-text-btn",
    type: "button"
  }, "Export"))), /*#__PURE__*/React.createElement("div", {
    className: "crs-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crs-row-grid crs-thead"
  }, /*#__PURE__*/React.createElement(CrsCheck, {
    on: allChecked,
    onClick: toggleAll
  }), /*#__PURE__*/React.createElement("span", {
    className: "crs-th"
  }, "SKU ID"), /*#__PURE__*/React.createElement("span", {
    className: "crs-th"
  }, "TITLE OF THE COURSE"), /*#__PURE__*/React.createElement("span", {
    className: "crs-th"
  }, "SUBTITLE"), /*#__PURE__*/React.createElement("span", {
    className: "crs-th"
  }, "CATEGORY"), /*#__PURE__*/React.createElement("span", {
    className: "crs-th"
  }, "LEVEL"), /*#__PURE__*/React.createElement("span", {
    className: "crs-th"
  }, "FULL PAYMENT"), /*#__PURE__*/React.createElement("span", {
    className: "crs-th"
  }, "PLAN PRICE"), /*#__PURE__*/React.createElement("span", {
    className: "crs-th"
  }, "STATUS")), CRS_ROWS.map(row => /*#__PURE__*/React.createElement(CrsRow, {
    key: row.id,
    row: row,
    checked: !!selected[row.id],
    onToggle: () => toggleOne(row.id)
  })), /*#__PURE__*/React.createElement("div", {
    className: "crs-pagination"
  }, /*#__PURE__*/React.createElement("span", {
    className: "crs-pageinfo"
  }, "Page 1 of 10"), /*#__PURE__*/React.createElement("div", {
    className: "crs-pagelinks"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "crs-page-prev",
    onClick: e => e.preventDefault()
  }, "Previous"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "crs-page-next",
    onClick: e => e.preventDefault()
  }, "Next"))))));
}

/* ------------------------------------------------------------------ root */
function AdminCoursesApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "crs-shell"
  }, /*#__PURE__*/React.createElement(CrsSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "crs-main"
  }, /*#__PURE__*/React.createElement(CrsHeader, {
    title: "Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "crs-content"
  }, /*#__PURE__*/React.createElement(CrsView, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AdminCoursesApp, null));
