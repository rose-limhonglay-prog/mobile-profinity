/* ===========================================================================
   PROfinity — Admin · Verification (desktop console)
   Single ID-document review card: clinician identity + license details,
   front-ID document preview, and approve/reject actions.
   Suffixed -VER to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateVer
} = React;
function goVer(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const VER_NAV = [{
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
  label: "Verification",
  active: true
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
const VER_NAV_LINKS = {
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
function VerSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "ver-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ver-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), VER_NAV.map(item => {
    const href = VER_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "ver-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goVer(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "ver-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "ver-chev"
    })));
  }));
}
function VerHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "ver-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ver-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "ver-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "ver-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ver-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ver-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "ver-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ver-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "ver-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "ver-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ------------------------------------------------------------- mock data */
const VER_RECORD = {
  name: "Helena Halliwell",
  subtitle: "helena.halliwell@profinity.academy · Clinician",
  status: "DRAFT",
  frontIdPath: "a1b2c3d4-e5f6-47a8-9b0c-d1e2f3a4b5c6.jpg",
  backIdPath: ""
};
const VER_FIELDS = [{
  key: "idFullName",
  label: "ID Full Name",
  value: ""
}, {
  key: "dob",
  label: "Date of Birth",
  value: ""
}, {
  key: "nationality",
  label: "Nationality",
  value: ""
}, {
  key: "placeOfBirth",
  label: "Place of Birth",
  value: ""
}, {
  key: "dateOfIssue",
  label: "Date of Issue",
  value: ""
}, {
  key: "dateOfExpiry",
  label: "Date of Expiry",
  value: ""
}, {
  key: "license",
  label: "License",
  value: ""
}, {
  key: "licensedCountry",
  label: "Licensed Country",
  value: ""
}, {
  key: "frontIdPath",
  label: "Front ID Path",
  value: VER_RECORD.frontIdPath,
  mono: true
}, {
  key: "backIdPath",
  label: "Back ID Path",
  value: VER_RECORD.backIdPath
}, {
  key: "submitted",
  label: "Submitted",
  value: ""
}, {
  key: "updated",
  label: "Updated",
  value: "23/7/2026 05:29"
}];
const VER_STATUS_META = {
  DRAFT: {
    color: "var(--gray-500)",
    bg: "var(--gray-100)"
  }
};

/* ------------------------------------------------------------- copy hook */
function verCopy(text, setFlag) {
  if (!text) return;
  const done = () => {
    setFlag(true);
    setTimeout(() => setFlag(false), 1600);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, done);
  } else {
    done();
  }
}

/* ------------------------------------------------------------- detail card */
function VerDetailCard() {
  const [copiedFront, setCopiedFront] = useStateVer(false);
  const [copiedBack, setCopiedBack] = useStateVer(false);
  const statusMeta = VER_STATUS_META[VER_RECORD.status] || VER_STATUS_META.DRAFT;
  const hasBackPath = !!VER_RECORD.backIdPath;
  return /*#__PURE__*/React.createElement("div", {
    className: "ver-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ver-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ver-card-head-id"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ver-card-name"
  }, VER_RECORD.name), /*#__PURE__*/React.createElement("div", {
    className: "ver-card-sub"
  }, VER_RECORD.subtitle)), /*#__PURE__*/React.createElement("span", {
    className: "ver-status-pill",
    style: {
      background: statusMeta.bg,
      color: statusMeta.color
    }
  }, VER_RECORD.status)), /*#__PURE__*/React.createElement("div", {
    className: "ver-field-grid"
  }, VER_FIELDS.map(f => {
    const empty = !f.value;
    return /*#__PURE__*/React.createElement("div", {
      className: "ver-field",
      key: f.key
    }, /*#__PURE__*/React.createElement("div", {
      className: "ver-field-label"
    }, f.label), /*#__PURE__*/React.createElement("div", {
      className: "ver-field-value" + (f.mono ? " ver-mono" : "") + (empty ? " is-empty" : "")
    }, empty ? "—" : f.value));
  })), /*#__PURE__*/React.createElement("div", {
    className: "ver-doc-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ver-doc-label"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:image"
  }), "Front ID"), /*#__PURE__*/React.createElement("div", {
    className: "ver-doc-preview"
  }, /*#__PURE__*/React.createElement("span", null, "Document preview"))), /*#__PURE__*/React.createElement("div", {
    className: "ver-card-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ver-btn ver-btn-outline",
    type: "button",
    onClick: () => verCopy(VER_RECORD.frontIdPath, setCopiedFront)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: copiedFront ? "lucide:check" : "lucide:copy"
  }), copiedFront ? "Copied!" : "Copy front path"), /*#__PURE__*/React.createElement("button", {
    className: "ver-btn ver-btn-outline",
    type: "button",
    disabled: !hasBackPath,
    onClick: () => hasBackPath && verCopy(VER_RECORD.backIdPath, setCopiedBack)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: copiedBack ? "lucide:check" : "lucide:copy"
  }), copiedBack ? "Copied!" : "Copy back path"), /*#__PURE__*/React.createElement("div", {
    className: "ver-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ver-btn ver-btn-danger-outline",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }), "Reject"), /*#__PURE__*/React.createElement("button", {
    className: "ver-btn ver-btn-navy",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "Approve")));
}

/* ------------------------------------------------------------- root view */
function VerView() {
  const [refreshing, setRefreshing] = useStateVer(false);
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ver-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ver-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Verification"), /*#__PURE__*/React.createElement("p", null, "Review clinician-submitted ID documents before granting verified status.")), /*#__PURE__*/React.createElement("div", {
    className: "ver-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ver-btn ver-btn-navy",
    type: "button",
    onClick: handleRefresh
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw",
    class: refreshing ? "ver-spin" : ""
  }), "Refresh"))), /*#__PURE__*/React.createElement(VerDetailCard, null));
}
function VerRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ver-shell"
  }, /*#__PURE__*/React.createElement(VerSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "ver-main"
  }, /*#__PURE__*/React.createElement(VerHeader, {
    title: "Verification"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ver-content"
  }, /*#__PURE__*/React.createElement(VerView, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(VerRoot, null));
