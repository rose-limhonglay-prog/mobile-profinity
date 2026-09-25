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
  icon: "lucide:badge-check",
  label: "Badges"
}, {
  icon: "lucide:clipboard-list",
  label: "Quizzes & Surveys"
}, {
  icon: "lucide:trophy",
  label: "Loyalty & Gamification",
  chevron: true
}, {
  icon: "lucide:scroll-text",
  label: "Points Ledger"
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
  "Badges": "AdminBadges.html",
  "Quizzes & Surveys": "AdminQuizEditor.html",
  "Loyalty & Gamification": "AdminActionsEditor.html",
  "Points Ledger": "AdminAuditLedger.html",
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
    src: "assets/profinity-icon-purple-gold.png",
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

/* ------------------------------------------------ Today's Targets funnel */
/* Reads the local funnel that daily-targets.js keeps (pf-targets-analytics):
   impressions → free taps / downloads, paid taps → checkouts → purchases and
   the revenue those purchases brought in. Prototype scope: this device's
   data; the production read would come from the events pipeline. */
const ANA_FUNNEL_RANGES = [{
  label: "7 days",
  days: 7
}, {
  label: "30 days",
  days: 30
}, {
  label: "All time",
  days: 0
}];
const anaGBP = n => "£" + Number(n || 0).toLocaleString("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const anaPct = v => v == null ? "—" : v + "%";
function ANATargetsFunnel() {
  const T = window.PFDailyTargets;
  const [range, setRange] = React.useState(7);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const bump = () => setTick(n => n + 1);
    window.addEventListener("pf:daily-targets-analytics", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("pf:daily-targets-analytics", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
  if (!T) return null;
  const f = T.getFunnel(range);
  const picks = T.get();
  const stages = [{
    label: "Targets shown (daily pairs)",
    value: f.impressions,
    rate: null,
    note: "one per member per day"
  }, {
    label: "Free item tapped",
    value: f.freeTaps,
    rate: f.rates.freeTap,
    note: "of shown"
  }, {
    label: "Free PDF downloaded",
    value: f.freeDownloads,
    rate: f.rates.freeDownload,
    note: "of shown"
  }, {
    label: "Paid CTA tapped",
    value: f.paidTaps,
    rate: f.rates.paidTap,
    note: "of shown"
  }, {
    label: "Checkout started",
    value: f.checkouts,
    rate: f.rates.checkout,
    note: "of paid taps"
  }, {
    label: "Course purchased",
    value: f.purchases,
    rate: f.rates.purchase,
    note: "of paid taps",
    bold: true
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "ana-funnel",
    "data-tick": tick
  }, /*#__PURE__*/React.createElement("div", {
    className: "ana-funnel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Today's Targets — usage funnel & revenue"), /*#__PURE__*/React.createElement("p", null, "Daily free download + paid course pick. Today: ", /*#__PURE__*/React.createElement("b", null, picks.free.title), " · ", /*#__PURE__*/React.createElement("b", null, picks.paid.title), " (", anaGBP(picks.paid.price).replace(".00", ""), ")")), /*#__PURE__*/React.createElement("div", {
    className: "ana-funnel-ranges",
    role: "tablist",
    "aria-label": "Date range"
  }, ANA_FUNNEL_RANGES.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.days,
    type: "button",
    role: "tab",
    "aria-selected": range === r.days,
    className: "ana-range" + (range === r.days ? " is-active" : ""),
    onClick: () => setRange(r.days)
  }, r.label)))), /*#__PURE__*/React.createElement("div", {
    className: "ana-kpis"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ana-kpi is-revenue"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-l"
  }, "Attributed revenue"), /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-v"
  }, anaGBP(f.revenue)), /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-s"
  }, f.purchases, " purchase", f.purchases === 1 ? "" : "s", " · avg order ", anaGBP(f.avgOrder))), /*#__PURE__*/React.createElement("div", {
    className: "ana-kpi"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-l"
  }, "Revenue per target shown"), /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-v"
  }, anaGBP(f.revenuePerImpression)), /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-s"
  }, f.impressions, " daily pairs shown")), /*#__PURE__*/React.createElement("div", {
    className: "ana-kpi"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-l"
  }, "Shown → purchase"), /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-v"
  }, anaPct(f.rates.overallConversion)), /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-s"
  }, "overall conversion")), /*#__PURE__*/React.createElement("div", {
    className: "ana-kpi"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-l"
  }, "Free download rate"), /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-v"
  }, anaPct(f.rates.freeDownload)), /*#__PURE__*/React.createElement("span", {
    className: "ana-kpi-s"
  }, f.freeDownloads, " PDFs downloaded"))), /*#__PURE__*/React.createElement("div", {
    className: "ana-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ana-row-grid ana-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-th"
  }, "FUNNEL STAGE"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "COUNT"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "RATE")), stages.map((st, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "ana-row-grid ana-trow" + (st.bold ? " is-bold" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-metric-cell"
  }, st.label), /*#__PURE__*/React.createElement("span", {
    className: "ana-count-cell"
  }, anaFormatCount(st.value)), /*#__PURE__*/React.createElement("span", {
    className: "ana-revenue-cell"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-funnel-rate"
  }, anaPct(st.rate)), st.rate != null && /*#__PURE__*/React.createElement("span", {
    className: "ana-funnel-note"
  }, " ", st.note))))), /*#__PURE__*/React.createElement("div", {
    className: "ana-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ana-row-grid ana-row-grid-days ana-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-th"
  }, "DAY"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "SHOWN"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "FREE DL"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "PAID TAPS"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "PURCHASES"), /*#__PURE__*/React.createElement("span", {
    className: "ana-th ana-th-right"
  }, "REVENUE")), f.perDay.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "ana-row-grid ana-trow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-metric-cell ana-empty"
  }, "No target activity recorded yet in this range.")), f.perDay.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.date,
    className: "ana-row-grid ana-row-grid-days ana-trow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ana-metric-cell"
  }, new Date(d.date + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ana-count-cell"
  }, d.impressions), /*#__PURE__*/React.createElement("span", {
    className: "ana-count-cell"
  }, d.freeDownloads, /*#__PURE__*/React.createElement("span", {
    className: "ana-funnel-note"
  }, " / ", d.freeTaps)), /*#__PURE__*/React.createElement("span", {
    className: "ana-count-cell"
  }, d.paidTaps, /*#__PURE__*/React.createElement("span", {
    className: "ana-funnel-note"
  }, " → ", d.checkouts, " co")), /*#__PURE__*/React.createElement("span", {
    className: "ana-count-cell"
  }, d.purchases), /*#__PURE__*/React.createElement("span", {
    className: "ana-revenue-cell"
  }, anaGBP(d.revenue))))), /*#__PURE__*/React.createElement("p", {
    className: "ana-funnel-foot"
  }, "Attribution: a purchase counts when the same course was tapped from Today's Targets within the previous 24 hours (last touch). Revenue is the amount paid at checkout, after reward discounts, including VAT."));
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
  }), /*#__PURE__*/React.createElement(ANATargetsFunnel, null));
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
