/* ===========================================================================
   PROfinity — Admin · App Versions (desktop console)
   Per-platform release list: current/mandatory update tracking for iOS and
   Android. Classes prefixed apv- to avoid clashes with other pages.
   =========================================================================== */

function goAPV(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- mock data */
const APV_IOS_VERSIONS = [{
  v: "v1.9.1",
  current: true,
  mandatory: true,
  notes: "This staging update includes improvements to membership claim access, including smoother WooCommerce membership takeover and card reuse handling, fixes for web verification date formatting, better image loading for agent cards on mobile, and enhanced interactive HTML course previews so course content displays more reliably across devices."
}, {
  v: "v1.8.5",
  current: false,
  mandatory: false,
  notes: "This update improves the learning experience by adding support for migrated LearnDash course access, better handling for claimed and mylearning courses, and fixes around course identifiers to prevent access or content mismatches. We also refined course detail, quiz, certificate, and web learning screens for a more reliable experience, plus included platform dependency updates for better overall app stability."
}, {
  v: "v1.8.0",
  current: false,
  mandatory: false,
  notes: "This update adds richer post formatting, clickable images in comments and replies, auto-play videos, improved verification banners, better saved post handling, and fixes for likes, comments, shares, and community post interactions."
}, {
  v: "v1.7.3",
  current: false,
  mandatory: false,
  notes: "This update introduces interactive community polls, pinned posts, improved mentions and notifications, enhanced premium content access, and profile completion reminders. We've also improved course performance, membership and trial management, clinician discovery, video experiences, and overall app reliability."
}, {
  v: "v1.6.1",
  current: false,
  mandatory: false,
  notes: "Discover a smoother Profinity experience with a new mobile onboarding tour, improved reactions for posts, comments, and replies with haptic feedback, selectable post and comment text, better reply threading, comment photo support, enhanced post sharing, improved course PDF and video playback, clearer video thumbnails, membership trial updates, refreshed colors, profile improvements, and general performance and stability fixes."
}, {
  v: "v1.6.0",
  current: false,
  mandatory: false,
  notes: ""
}];
const APV_ANDROID_VERSIONS = [];

/* ------------------------------------------------------------- sidebar */
const APV_NAV = [{
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
  label: "App Versions",
  active: true
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
const APV_NAV_LINKS = {
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
function APVSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "apv-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apv-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), APV_NAV.map(item => {
    const href = APV_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "apv-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goAPV(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "apv-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "apv-chev"
    })));
  }));
}
function APVHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "apv-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apv-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "apv-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "apv-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apv-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "apv-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "apv-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apv-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "apv-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "apv-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* --------------------------------------------------------- version card */
function APVVersionCard({
  item
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apv-version-card" + (item.current ? " is-current" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "apv-version-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apv-version-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apv-version-num"
  }, item.v), item.current && /*#__PURE__*/React.createElement("span", {
    className: "apv-badge apv-badge-current"
  }, "CURRENT"), item.mandatory && /*#__PURE__*/React.createElement("span", {
    className: "apv-badge apv-badge-mandatory"
  }, "MANDATORY")), item.notes && /*#__PURE__*/React.createElement("p", {
    className: "apv-version-notes"
  }, item.notes)), /*#__PURE__*/React.createElement("button", {
    className: "apv-version-more",
    type: "button",
    "aria-label": "Version actions"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:more-horizontal"
  })));
}

/* --------------------------------------------------------- platform section */
function APVPlatformSection({
  icon,
  iconColor,
  iconBg,
  label,
  versions,
  emptyText
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apv-platform-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apv-section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apv-section-icon",
    style: {
      color: iconColor,
      background: iconBg
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "apv-section-label"
  }, label), versions.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "apv-section-count"
  }, versions.length, " version", versions.length === 1 ? "" : "s")), versions.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "apv-version-list"
  }, versions.map(item => /*#__PURE__*/React.createElement(APVVersionCard, {
    key: item.v,
    item: item
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "apv-section-empty"
  }, emptyText));
}

/* ----------------------------------------------------------------- root */
function AppVersionsRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "apv-shell"
  }, /*#__PURE__*/React.createElement(APVSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "apv-main"
  }, /*#__PURE__*/React.createElement(APVHeader, {
    title: "App Versions"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apv-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apv-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "App Versions"), /*#__PURE__*/React.createElement("p", null, "Track the current release for each platform, and control whether members are shown a mandatory update prompt (blocking, must update to continue) or an advisory one (dismissible, update recommended). Only one version per platform is marked current at a time.")), /*#__PURE__*/React.createElement("div", {
    className: "apv-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apv-btn apv-btn-navy",
    type: "button",
    onClick: () => {}
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Add version"))), /*#__PURE__*/React.createElement(APVPlatformSection, {
    icon: "mdi:apple",
    iconColor: "var(--gray-700)",
    iconBg: "var(--gray-100)",
    label: "iOS",
    versions: APV_IOS_VERSIONS,
    emptyText: "No iOS versions added yet."
  }), /*#__PURE__*/React.createElement(APVPlatformSection, {
    icon: "mdi:android",
    iconColor: "var(--success)",
    iconBg: "var(--success-bg)",
    label: "Android",
    versions: APV_ANDROID_VERSIONS,
    emptyText: "No Android versions added yet."
  }))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AppVersionsRoot, null));
