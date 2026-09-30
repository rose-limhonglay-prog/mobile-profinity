/* ===========================================================================
   PROfinity — Minute Taker · Admin Dashboard
   Practice-level admin: global kill-switch, per-clinician subscriber access,
   real-time audit trail. PRD Screen 7 (Sec. 3.7 / MT-A01, MT-A02, MT-A05).
   Classes prefixed mtad- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateMTAD
} = React;
function goMTAD(url) {
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
function MTADSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "mtad-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtad-logo"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic",
    class: "mtad-logo-icon"
  }), /*#__PURE__*/React.createElement("span", null, "Minute Taker")), /*#__PURE__*/React.createElement("div", {
    className: "mtad-nav-scope"
  }, "Admin Console"), /*#__PURE__*/React.createElement("button", {
    className: "mtad-navitem mtad-navitem-back",
    type: "button",
    onClick: () => goMTAD("AdminAgents.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), /*#__PURE__*/React.createElement("span", null, "Back to Admin Dashboard")), MTAD_ADMIN_NAV.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "mtad-navitem" + (item.label === "Admin Users" ? " is-active" : ""),
    type: "button",
    onClick: item.label !== "Admin Users" ? () => goMTAD(item.href) : undefined
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label))));
}
function MTADHeader() {
  return /*#__PURE__*/React.createElement("header", {
    className: "mtad-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtad-header-title"
  }, "Minute Taker"), /*#__PURE__*/React.createElement("div", {
    className: "mtad-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtad-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtad-user-name"
  }, "Dr. Katie Smith"), /*#__PURE__*/React.createElement("div", {
    className: "mtad-user-role"
  }, "Clinician")), /*#__PURE__*/React.createElement("img", {
    className: "mtad-user-avatar",
    src: "assets/avatar-katy.jpg",
    alt: "Dr. Katie Smith"
  }));
}
const MTAD_SUBSCRIBERS_INIT = [{
  name: "Dr. Sarah Jenkins",
  status: "Active",
  sessions: 142,
  joined: "Nov 12, 2023"
}, {
  name: "Dr. Michael Chen",
  status: "Active",
  sessions: 89,
  joined: "Dec 5, 2023"
}, {
  name: "Dr. Emily Carter",
  status: "Suspended",
  sessions: 45,
  joined: "Jan 20, 2024"
}, {
  name: "Dr. Robert Steele",
  status: "Active",
  sessions: 215,
  joined: "Sep 1, 2023"
}, {
  name: "Dr. Amina Patel",
  status: "Active",
  sessions: 12,
  joined: "Mar 10, 2024"
}];
const MTAD_AUDIT_INIT = [{
  title: "User access revoked",
  detail: "Dr. David Kim · by Admin",
  when: "10 mins ago"
}, {
  title: "Exported subscriber list",
  detail: "All Users · by Admin",
  when: "1 hour ago"
}, {
  title: "User access granted",
  detail: "Dr. Amina Patel · by Admin",
  when: "2 days ago"
}, {
  title: "Platform suspension toggle",
  detail: "Global System · by Admin",
  when: "5 days ago"
}];
function MTADToggle({
  on,
  disabled,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtad-toggle" + (on ? " is-on" : "") + (disabled ? " is-disabled" : ""),
    onClick: disabled ? undefined : onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtad-toggle-knob"
  }));
}
function MTADView() {
  const [platformActive, setPlatformActive] = useStateMTAD(true);
  const [subscribers, setSubscribers] = useStateMTAD(MTAD_SUBSCRIBERS_INIT);
  const [audit, setAudit] = useStateMTAD(MTAD_AUDIT_INIT);
  function pushAudit(title, detail) {
    setAudit(a => [{
      title,
      detail,
      when: "Just now"
    }, ...a]);
  }
  function togglePlatform() {
    const next = !platformActive;
    setPlatformActive(next);
    pushAudit("Platform suspension toggle", "Global System · by Dr. Katie Smith → " + (next ? "Active" : "Halted"));
  }
  function toggleSubscriber(idx) {
    setSubscribers(rows => rows.map((r, i) => {
      if (i !== idx) return r;
      const nextStatus = r.status === "Active" ? "Suspended" : "Active";
      pushAudit(nextStatus === "Suspended" ? "User access revoked" : "User access granted", r.name + " · by Dr. Katie Smith");
      return {
        ...r,
        status: nextStatus
      };
    }));
  }
  const activeCount = subscribers.filter(s => s.status === "Active").length;
  return /*#__PURE__*/React.createElement("div", {
    className: "mtad-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtad-page-head"
  }, /*#__PURE__*/React.createElement("h1", null, "Admin Dashboard"), /*#__PURE__*/React.createElement("p", null, "Manage platform access, active subscribers, and review administrative actions.")), /*#__PURE__*/React.createElement("div", {
    className: "mtad-status-banner" + (platformActive ? "" : " is-halted")
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mtad-status-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: platformActive ? "lucide:check-circle-2" : "lucide:alert-triangle"
  }), platformActive ? "Platform is Active" : "Platform is Halted"), /*#__PURE__*/React.createElement("p", null, platformActive ? "All clinical sessions and platform features are operating normally. Disabling will halt new sessions." : "New ambient sessions are blocked platform-wide. Re-enable to resume normal Minute Taker operation.")), /*#__PURE__*/React.createElement("label", {
    className: "mtad-global-toggle"
  }, /*#__PURE__*/React.createElement("span", null, "Global Access"), /*#__PURE__*/React.createElement(MTADToggle, {
    on: platformActive,
    onClick: togglePlatform
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtad-content-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtad-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtad-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtad-card-title-text"
  }, "Subscriber Management"), /*#__PURE__*/React.createElement("span", {
    className: "mtad-count-tag"
  }, activeCount, " Active \xA0|\xA0 ", subscribers.length, " Total")), /*#__PURE__*/React.createElement("div", {
    className: "mtad-row-grid mtad-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtad-th"
  }, "Clinician"), /*#__PURE__*/React.createElement("span", {
    className: "mtad-th"
  }, "Status"), /*#__PURE__*/React.createElement("span", {
    className: "mtad-th"
  }, "Sessions"), /*#__PURE__*/React.createElement("span", {
    className: "mtad-th"
  }, "Join Date"), /*#__PURE__*/React.createElement("span", {
    className: "mtad-th"
  }, "Toggle")), subscribers.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    className: "mtad-row-grid mtad-trow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtad-name-cell"
  }, s.name), /*#__PURE__*/React.createElement("span", {
    className: "mtad-status-pill " + (s.status === "Active" ? "success" : "danger")
  }, s.status), /*#__PURE__*/React.createElement("span", null, s.sessions), /*#__PURE__*/React.createElement("span", {
    className: "mtad-muted"
  }, s.joined), /*#__PURE__*/React.createElement(MTADToggle, {
    on: s.status === "Active",
    disabled: !platformActive,
    onClick: () => toggleSubscriber(i)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mtad-card mtad-audit-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtad-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtad-card-title-text"
  }, "Audit Trail")), /*#__PURE__*/React.createElement("div", {
    className: "mtad-audit-list"
  }, audit.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mtad-audit-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtad-audit-title"
  }, a.title), /*#__PURE__*/React.createElement("div", {
    className: "mtad-audit-detail"
  }, a.detail), /*#__PURE__*/React.createElement("div", {
    className: "mtad-audit-when"
  }, a.when)))))));
}
function MTADApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mtad-shell"
  }, /*#__PURE__*/React.createElement(MTADSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "mtad-main"
  }, /*#__PURE__*/React.createElement(MTADHeader, null), /*#__PURE__*/React.createElement(MTADView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTADApp, null));
