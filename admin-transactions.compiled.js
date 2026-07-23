/* ===========================================================================
   PROfinity — Admin · Transactions (Invoices)
   Desktop admin console: fixed sidebar + sticky header + invoice list.
   Classes prefixed txn- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateTXN
} = React;
function goTXN(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const TXN_NAV = [{
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
  chevron: true,
  active: true
}, {
  icon: "lucide:table-2",
  label: "Courses",
  chevron: true
}, {
  icon: "lucide:users",
  label: "Community",
  chevron: true
}];
const TXN_NAV_LINKS = {
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
function TXNSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "txn-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "txn-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), TXN_NAV.map(item => {
    const href = TXN_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "txn-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goTXN(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "txn-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "txn-chev"
    })));
  }));
}
function TXNHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "txn-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "txn-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "txn-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "txn-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "txn-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "txn-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "txn-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "txn-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "txn-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "txn-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* --------------------------------------------------------------- checkbox */
function TXNCheck({
  on,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "txn-check" + (on ? " is-on" : ""),
    onClick: onClick
  }, on && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }));
}

/* ------------------------------------------------------------------ data */
const TXN_STATS = [{
  label: "Overdue",
  value: "£ 0.00",
  labelColor: "var(--error)"
}, {
  label: "Due within next 30 days",
  value: "0",
  labelColor: "var(--gray-500)"
}, {
  label: "Upcoming Payout",
  value: "£ 301,614.31",
  labelColor: "var(--gray-500)"
}, {
  label: "No. of Transaction",
  value: "1000",
  labelColor: "var(--gray-500)"
}];
const TXN_ROWS = [{
  id: 1,
  no: "0000016215",
  name: "Christoph Yves Malik",
  email: "c.y.malik@mkg-im-…",
  amount: "£97.00",
  created: "Jul 23, 2026",
  due: "Jul 23, 2026"
}, {
  id: 2,
  no: "0000016214",
  name: "Nikita nirwan",
  email: "n_roddah123@hotm…",
  amount: "£97.00",
  created: "Jul 23, 2026",
  due: "Jul 23, 2026"
}, {
  id: 3,
  no: "0000016213",
  name: "Gillian Bruce",
  email: "gillian@ardcroftme…",
  amount: "£1.00",
  created: "Jul 23, 2026",
  due: "Jul 23, 2026"
}, {
  id: 4,
  no: "0000016211",
  name: "Temilola Mariam Sanni",
  email: "mariamsanni92@ya…",
  amount: "£1.00",
  created: "Jul 23, 2026",
  due: "Jul 23, 2026"
}, {
  id: 5,
  no: "0000016209",
  name: "Marissa Valdez",
  email: "marissavaldez2019…",
  amount: "£1.34",
  created: "Jul 23, 2026",
  due: "Jul 23, 2026"
}];

/* ------------------------------------------------------------ stat card */
function TXNStatCard({
  stat
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "txn-stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "txn-stat-label",
    style: {
      color: stat.labelColor
    }
  }, stat.label), /*#__PURE__*/React.createElement("div", {
    className: "txn-stat-value"
  }, stat.value));
}

/* -------------------------------------------------------------- view */
function TXNView() {
  const [segment, setSegment] = useStateTXN("invoices");
  const [selected, setSelected] = useStateTXN({});
  const count = Object.values(selected).filter(Boolean).length;
  const allChecked = TXN_ROWS.length > 0 && count === TXN_ROWS.length;
  const toggleAll = () => {
    if (allChecked) {
      setSelected({});
      return;
    }
    const sel = {};
    TXN_ROWS.forEach(r => sel[r.id] = true);
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
    className: "txn-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "txn-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Transactions"), /*#__PURE__*/React.createElement("p", null, "Your most recent transactions list")), /*#__PURE__*/React.createElement("div", {
    className: "txn-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "txn-btn txn-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar"
  }), "Select date range"), /*#__PURE__*/React.createElement("button", {
    className: "txn-btn txn-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:filter"
  }), "Filter"), /*#__PURE__*/React.createElement("button", {
    className: "txn-btn txn-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:upload"
  }), "Export"))), /*#__PURE__*/React.createElement("div", {
    className: "txn-segment"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "txn-segment-btn" + (segment === "invoices" ? " is-active" : ""),
    onClick: () => setSegment("invoices")
  }, "Invoices"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "txn-segment-btn" + (segment === "transaction" ? " is-active" : ""),
    onClick: () => setSegment("transaction")
  }, "Transaction")), /*#__PURE__*/React.createElement("div", {
    className: "txn-stat-grid"
  }, TXN_STATS.map(stat => /*#__PURE__*/React.createElement(TXNStatCard, {
    key: stat.label,
    stat: stat
  }))), /*#__PURE__*/React.createElement("div", {
    className: "txn-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "txn-row-grid txn-thead"
  }, /*#__PURE__*/React.createElement(TXNCheck, {
    on: allChecked,
    onClick: toggleAll
  }), /*#__PURE__*/React.createElement("span", {
    className: "txn-th"
  }, "INVOICE NO."), /*#__PURE__*/React.createElement("span", {
    className: "txn-th"
  }, "NAME"), /*#__PURE__*/React.createElement("span", {
    className: "txn-th"
  }, "EMAIL"), /*#__PURE__*/React.createElement("span", {
    className: "txn-th"
  }, "PAYMENT STATUS"), /*#__PURE__*/React.createElement("span", {
    className: "txn-th"
  }, "AMOUNT"), /*#__PURE__*/React.createElement("span", {
    className: "txn-th"
  }, "CREATION DATE"), /*#__PURE__*/React.createElement("span", {
    className: "txn-th"
  }, "DUE DATE"), /*#__PURE__*/React.createElement("span", null)), TXN_ROWS.map(r => {
    const checked = !!selected[r.id];
    return /*#__PURE__*/React.createElement("div", {
      key: r.id,
      className: "txn-row-grid txn-trow",
      style: {
        background: checked ? "var(--brand-gold-100)" : "var(--white)"
      }
    }, /*#__PURE__*/React.createElement(TXNCheck, {
      on: checked,
      onClick: () => toggleOne(r.id)
    }), /*#__PURE__*/React.createElement("span", {
      className: "txn-cell txn-cell-mono"
    }, r.no), /*#__PURE__*/React.createElement("span", {
      className: "txn-cell txn-cell-name"
    }, r.name), /*#__PURE__*/React.createElement("span", {
      className: "txn-cell txn-cell-email"
    }, r.email), /*#__PURE__*/React.createElement("div", {
      className: "txn-status-pill"
    }, /*#__PURE__*/React.createElement("span", {
      className: "txn-status-dot"
    }), /*#__PURE__*/React.createElement("span", {
      className: "txn-status-label"
    }, "Paid")), /*#__PURE__*/React.createElement("span", {
      className: "txn-cell txn-cell-amount"
    }, r.amount), /*#__PURE__*/React.createElement("span", {
      className: "txn-cell"
    }, r.created), /*#__PURE__*/React.createElement("span", {
      className: "txn-cell"
    }, r.due), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:more-vertical",
      class: "txn-row-more"
    }));
  }), /*#__PURE__*/React.createElement("div", {
    className: "txn-pagination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "txn-pagebtn",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-left"
  }), "Previous"), /*#__PURE__*/React.createElement("span", {
    className: "txn-pageinfo"
  }, "Page 1 of 100"), /*#__PURE__*/React.createElement("button", {
    className: "txn-pagebtn",
    type: "button"
  }, "Next", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  })))));
}
function TXNRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "txn-shell"
  }, /*#__PURE__*/React.createElement(TXNSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "txn-main"
  }, /*#__PURE__*/React.createElement(TXNHeader, {
    title: "Transactions"
  }), /*#__PURE__*/React.createElement(TXNView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(TXNRoot, null));
