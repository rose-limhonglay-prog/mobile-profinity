/* ===========================================================================
   PROfinity — Minute Taker · Pricing & Usage Dashboard
   Telemetry cards, 7-day usage trend, usage health donut, subscriber caps.
   PRD Screen 8 (Sec. 3.8 / MT-A03, MT-A04, MT-A06).
   Classes prefixed mtu- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateMTU
} = React;
function goMTU(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const MTAD_ADMIN_NAV = [{
  icon: "lucide:shield-check",
  label: "Admin Users",
  href: "MinuteTakerAdmin.html"
}, {
  icon: "lucide:credit-card",
  label: "Usage & Billing",
  href: "MinuteTakerUsage.html"
}];
function MTUSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "mtu-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-logo"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic",
    class: "mtu-logo-icon"
  }), /*#__PURE__*/React.createElement("span", null, "Minute Taker")), /*#__PURE__*/React.createElement("div", {
    className: "mtu-nav-scope"
  }, "Admin Console"), /*#__PURE__*/React.createElement("button", {
    className: "mtu-navitem mtu-navitem-back",
    type: "button",
    onClick: () => goMTU("AdminAgents.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), /*#__PURE__*/React.createElement("span", null, "Back to Admin Dashboard")), MTAD_ADMIN_NAV.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "mtu-navitem" + (item.label === "Usage & Billing" ? " is-active" : ""),
    type: "button",
    onClick: item.label !== "Usage & Billing" ? () => goMTU(item.href) : undefined
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label))));
}
function MTUHeader() {
  return /*#__PURE__*/React.createElement("header", {
    className: "mtu-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtu-header-title"
  }, "Minute Taker"), /*#__PURE__*/React.createElement("div", {
    className: "mtu-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtu-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-user-name"
  }, "Dr. Katie Smith"), /*#__PURE__*/React.createElement("div", {
    className: "mtu-user-role"
  }, "Clinician")), /*#__PURE__*/React.createElement("img", {
    className: "mtu-user-avatar",
    src: "assets/avatar-katy.jpg",
    alt: "Dr. Katie Smith"
  }));
}
const MTU_CARDS = [{
  label: "Active Subscribers",
  value: "142",
  sub: "+12 this month"
}, {
  label: "Sessions Consumed",
  value: "3,240",
  sub: "Current billing cycle"
}, {
  label: "Cost to Date",
  value: "$486.00",
  sub: "Based on $0.15 / session"
}, {
  label: "Projected End Cost",
  value: "$650.00",
  sub: "Estimated for period end"
}];
const MTU_TREND = [{
  d: "Mon",
  v: 120
}, {
  d: "Tue",
  v: 150
}, {
  d: "Wed",
  v: 175
}, {
  d: "Thu",
  v: 140
}, {
  d: "Fri",
  v: 200
}, {
  d: "Sat",
  v: 80
}, {
  d: "Sun",
  v: 60
}];
const MTU_LIMITS = [{
  name: "Dr. Sarah Jenkins",
  status: "Warning",
  used: 450,
  cap: 500,
  cost: "$67.50"
}, {
  name: "Dr. Marcus Webb",
  status: "Blocked",
  used: 200,
  cap: 200,
  cost: "$30.00"
}];
function mtuExportCsv(rows) {
  const header = "Subscriber,Status,Usage,Cap,Cost To Date\n";
  const body = rows.map(r => [r.name, r.status, r.used, r.cap, r.cost].join(",")).join("\n");
  const blob = new Blob([header + body], {
    type: "text/csv"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "minute-taker-usage-report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function MTUDonut() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mtu-donut-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-donut",
    style: {
      background: "conic-gradient(var(--gray-900) 0% 85%, var(--warning) 85% 95%, var(--error) 95% 100%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-donut-hole"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mtu-donut-legend"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "var(--gray-900)"
    }
  }), "Healthy (<80%)"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "var(--warning)"
    }
  }), "Warning"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    style: {
      background: "var(--error)"
    }
  }), "Blocked")));
}
function MTUView() {
  const [toast, setToast] = useStateMTU(null);
  function handleExport() {
    mtuExportCsv(MTU_LIMITS);
    setToast("Usage report exported.");
    window.setTimeout(() => setToast(null), 2200);
  }
  const maxV = Math.max(...MTU_TREND.map(t => t.v));
  return /*#__PURE__*/React.createElement("div", {
    className: "mtu-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Pricing & Usage"), /*#__PURE__*/React.createElement("p", null, "Monitor platform usage, track costs, and manage subscriber limits.")), /*#__PURE__*/React.createElement("button", {
    className: "mtu-btn mtu-btn-ghost",
    type: "button",
    onClick: handleExport
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:download"
  }), "Export CSV")), /*#__PURE__*/React.createElement("div", {
    className: "mtu-stat-grid"
  }, MTU_CARDS.map(c => /*#__PURE__*/React.createElement("div", {
    className: "mtu-stat-card",
    key: c.label
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-stat-label"
  }, c.label), /*#__PURE__*/React.createElement("div", {
    className: "mtu-stat-value"
  }, c.value), /*#__PURE__*/React.createElement("div", {
    className: "mtu-stat-sub"
  }, c.sub)))), /*#__PURE__*/React.createElement("div", {
    className: "mtu-chart-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtu-card-title-text"
  }, "Usage Trends (Past 7 Days)")), /*#__PURE__*/React.createElement("div", {
    className: "mtu-bar-chart"
  }, MTU_TREND.map(t => /*#__PURE__*/React.createElement("div", {
    className: "mtu-bar-col",
    key: t.d,
    title: t.d + ": " + t.v + " sessions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-bar",
    style: {
      height: t.v / maxV * 100 + "%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtu-bar-value"
  }, t.v)), /*#__PURE__*/React.createElement("span", {
    className: "mtu-bar-label"
  }, t.d))))), /*#__PURE__*/React.createElement("div", {
    className: "mtu-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtu-card-title-text"
  }, "Usage Health")), /*#__PURE__*/React.createElement(MTUDonut, null))), /*#__PURE__*/React.createElement("div", {
    className: "mtu-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtu-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtu-card-title-text"
  }, "Subscriber Limits & Usage"), /*#__PURE__*/React.createElement("span", {
    className: "mtu-cap-note"
  }, "Warnings triggered at 80%")), /*#__PURE__*/React.createElement("div", {
    className: "mtu-row-grid mtu-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtu-th"
  }, "Subscriber"), /*#__PURE__*/React.createElement("span", {
    className: "mtu-th"
  }, "Status"), /*#__PURE__*/React.createElement("span", {
    className: "mtu-th"
  }, "Usage vs Cap"), /*#__PURE__*/React.createElement("span", {
    className: "mtu-th"
  }, "Cost to Date"), /*#__PURE__*/React.createElement("span", {
    className: "mtu-th"
  }, "Cap Limit")), MTU_LIMITS.map(r => {
    const pct = Math.min(100, Math.round(r.used / r.cap * 100));
    return /*#__PURE__*/React.createElement("div", {
      key: r.name,
      className: "mtu-row-grid mtu-trow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtu-name-cell"
    }, r.name), /*#__PURE__*/React.createElement("span", {
      className: "mtu-status-pill " + (r.status === "Blocked" ? "danger" : "warning")
    }, r.status), /*#__PURE__*/React.createElement("span", {
      className: "mtu-usage-cell"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtu-usage-bar"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtu-usage-fill " + (r.status === "Blocked" ? "danger" : "warning"),
      style: {
        width: pct + "%"
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "mtu-usage-text"
    }, r.used, " / ", r.cap)), /*#__PURE__*/React.createElement("span", null, r.cost), /*#__PURE__*/React.createElement("span", {
      className: "mtu-cap-tag"
    }, "[", r.cap, "]"));
  })), toast && /*#__PURE__*/React.createElement("div", {
    className: "mtu-toast"
  }, toast));
}
function MTUApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mtu-shell"
  }, /*#__PURE__*/React.createElement(MTUSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "mtu-main"
  }, /*#__PURE__*/React.createElement(MTUHeader, null), /*#__PURE__*/React.createElement(MTUView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTUApp, null));
