/* ===========================================================================
   PROfinity — Admin · Badge Management (desktop console)
   Dashboard / All Badges library / Automation Rules tabs, Create·Edit modal,
   Assign-to-members modal, Create Rule modal, and a badge detail drill-in
   with a revocable holders list. Static mock data, all client-side state.
   Suffixed -BDG to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateBDG,
  useMemo: useMemoBDG
} = React;
function goBDG(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const BDG_NAV = [{
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
  icon: "lucide:badge-check",
  label: "Badges",
  active: true
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
const BDG_NAV_LINKS = {
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
  "Transactions": "AdminTransactions.html",
  "Courses": "AdminCourses.html",
  "Community": "AdminCommunity.html"
};
function BDGSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "bdg-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  })), BDG_NAV.map(item => {
    const href = BDG_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "bdg-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goBDG(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "bdg-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "bdg-chev"
    })));
  }));
}
function BDGHeader() {
  return /*#__PURE__*/React.createElement("header", {
    className: "bdg-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "bdg-header-title"
  }, "Badge Management"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdg-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "bdg-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "bdg-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ------------------------------------------------------------------ data */
const BDG_ICON_OPTIONS = ["lucide:trophy", "lucide:medal", "lucide:crown", "lucide:sparkles", "lucide:stethoscope", "lucide:rocket", "lucide:star", "lucide:shield-check", "lucide:graduation-cap", "lucide:award", "lucide:flame", "lucide:gem", "lucide:heart", "lucide:badge-check", "lucide:target", "lucide:zap"];
const BDG_CATEGORIES = ["Achievement", "Membership Tier", "Community Participation", "Faculty & Credentials"];
const BDG_CATEGORY_TONE = {
  "Achievement": {
    bg: "var(--brand-gold-100)",
    fg: "var(--brand-gold)"
  },
  "Membership Tier": {
    bg: "var(--info-bg)",
    fg: "var(--info)"
  },
  "Community Participation": {
    bg: "var(--success-bg)",
    fg: "var(--success)"
  },
  "Faculty & Credentials": {
    bg: "var(--ai-purple-100)",
    fg: "var(--ai-purple)"
  }
};
const BDG_TIERS = ["Basic", "Confidence", "Mastery", "Sovereign and Builder"];
function bdgTierRank(tier) {
  return BDG_TIERS.indexOf(tier);
}
const BDG_MEMBERS = [{
  id: "m1",
  name: "Miranda Pearce",
  email: "miranda.pearce@gmail.com",
  tier: "Mastery",
  avatar: "assets/avatar-miranda.jpg"
}, {
  id: "m2",
  name: "Amir Khan",
  email: "amir.khan@gmail.com",
  tier: "Confidence",
  avatar: "assets/avatar-amir-khan.jpg"
}, {
  id: "m3",
  name: "Priya Shah",
  email: "priya.shah@gmail.com",
  tier: "Sovereign and Builder",
  avatar: "assets/avatar-priya-shah.jpg"
}, {
  id: "m4",
  name: "Mark Ellis",
  email: "mark.ellis@gmail.com",
  tier: "Basic",
  avatar: "assets/avatar-mark-ellis.jpg"
}, {
  id: "m5",
  name: "Sarah Collins",
  email: "sarah.collins@gmail.com",
  tier: "Mastery",
  avatar: "assets/avatar-sarah-collins.jpg"
}, {
  id: "m6",
  name: "Beth Turner",
  email: "beth.turner@gmail.com",
  tier: "Confidence",
  avatar: "assets/avatar-nurse-beth.jpg"
}, {
  id: "m7",
  name: "Katy Nguyen",
  email: "katy.nguyen@gmail.com",
  tier: "Sovereign and Builder",
  avatar: "assets/avatar-katy.jpg"
}, {
  id: "m8",
  name: "Dr Tim Pearce",
  email: "tim.pearce@drtimpearce.com",
  tier: "Sovereign and Builder",
  avatar: "assets/avatar-drtim.png"
}, {
  id: "m9",
  name: "Jo Bennett",
  email: "jo.bennett@gmail.com",
  tier: "Confidence",
  avatar: null
}, {
  id: "m10",
  name: "Leah Osei",
  email: "leah.osei@gmail.com",
  tier: "Mastery",
  avatar: null
}, {
  id: "m11",
  name: "Connor Reid",
  email: "connor.reid@gmail.com",
  tier: "Basic",
  avatar: null
}, {
  id: "m12",
  name: "Farah Hussain",
  email: "farah.hussain@gmail.com",
  tier: "Mastery",
  avatar: null
}];
const bdgMemberById = id => BDG_MEMBERS.find(m => m.id === id);
const BDG_INITIAL_BADGES = [{
  id: "b1",
  name: "Founding Badge",
  description: "Awarded to members who joined during Profinity's founding year.",
  icon: "lucide:rocket",
  category: "Achievement",
  notify: true,
  status: "Active"
}, {
  id: "b2",
  name: "Skinfluencers",
  description: "Recognises members who actively share content that grows the community.",
  icon: "lucide:sparkles",
  category: "Community Participation",
  notify: true,
  status: "Active"
}, {
  id: "b3",
  name: "Faculty Clinical Complications",
  description: "Confirms faculty-verified expertise in managing clinical complications.",
  icon: "lucide:stethoscope",
  category: "Faculty & Credentials",
  notify: true,
  status: "Active"
}, {
  id: "b4",
  name: "Gold Tier Member",
  description: "Awarded automatically when a member reaches Mastery tier.",
  icon: "lucide:crown",
  category: "Membership Tier",
  notify: true,
  status: "Active"
}, {
  id: "b5",
  name: "First Case Study",
  description: "Celebrates a member's first published case study.",
  icon: "lucide:medal",
  category: "Achievement",
  notify: true,
  status: "Active"
}, {
  id: "b6",
  name: "Community Champion",
  description: "Recognises members who consistently support and uplift the community.",
  icon: "lucide:trophy",
  category: "Community Participation",
  notify: false,
  status: "Active"
}, {
  id: "b7",
  name: "Verified Clinician",
  description: "Confirms an approved clinician verification on the platform.",
  icon: "lucide:shield-check",
  category: "Faculty & Credentials",
  notify: true,
  status: "Archived"
}];
const BDG_INITIAL_ASSIGNMENTS = [{
  id: "a1",
  badgeId: "b1",
  memberId: "m3",
  type: "Manual",
  date: "12 Jan 2026",
  dateSort: "2026-01-12",
  status: "Active"
}, {
  id: "a2",
  badgeId: "b1",
  memberId: "m8",
  type: "Manual",
  date: "14 Jan 2026",
  dateSort: "2026-01-14",
  status: "Active"
}, {
  id: "a3",
  badgeId: "b1",
  memberId: "m7",
  type: "Manual",
  date: "15 Jan 2026",
  dateSort: "2026-01-15",
  status: "Active"
}, {
  id: "a4",
  badgeId: "b7",
  memberId: "m8",
  type: "Manual",
  date: "01 Feb 2026",
  dateSort: "2026-02-01",
  status: "Active"
}, {
  id: "a5",
  badgeId: "b7",
  memberId: "m3",
  type: "Manual",
  date: "03 Feb 2026",
  dateSort: "2026-02-03",
  status: "Active"
}, {
  id: "a6",
  badgeId: "b2",
  memberId: "m1",
  type: "Manual",
  date: "02 Jul 2026",
  dateSort: "2026-07-02",
  status: "Active"
}, {
  id: "a7",
  badgeId: "b2",
  memberId: "m9",
  type: "Manual",
  date: "10 Jul 2026",
  dateSort: "2026-07-10",
  status: "Revoked"
}, {
  id: "a8",
  badgeId: "b4",
  memberId: "m1",
  type: "Automated",
  ruleId: "r1",
  date: "20 Jul 2026",
  dateSort: "2026-07-20",
  status: "Active"
}, {
  id: "a9",
  badgeId: "b4",
  memberId: "m5",
  type: "Automated",
  ruleId: "r1",
  date: "22 Jul 2026",
  dateSort: "2026-07-22",
  status: "Active"
}, {
  id: "a10",
  badgeId: "b4",
  memberId: "m7",
  type: "Automated",
  ruleId: "r1",
  date: "24 Jul 2026",
  dateSort: "2026-07-24",
  status: "Active"
}, {
  id: "a11",
  badgeId: "b4",
  memberId: "m8",
  type: "Automated",
  ruleId: "r1",
  date: "25 Jul 2026",
  dateSort: "2026-07-25",
  status: "Active"
}, {
  id: "a12",
  badgeId: "b4",
  memberId: "m3",
  type: "Automated",
  ruleId: "r1",
  date: "26 Jul 2026",
  dateSort: "2026-07-26",
  status: "Active"
}, {
  id: "a13",
  badgeId: "b4",
  memberId: "m10",
  type: "Automated",
  ruleId: "r1",
  date: "27 Jul 2026",
  dateSort: "2026-07-27",
  status: "Active"
}, {
  id: "a14",
  badgeId: "b6",
  memberId: "m11",
  type: "Automated",
  ruleId: "r2",
  date: "29 Jul 2026",
  dateSort: "2026-07-29",
  status: "Active"
}, {
  id: "a15",
  badgeId: "b6",
  memberId: "m6",
  type: "Automated",
  ruleId: "r2",
  date: "30 Jul 2026",
  dateSort: "2026-07-30",
  status: "Active"
}, {
  id: "a16",
  badgeId: "b3",
  memberId: "m5",
  type: "Automated",
  ruleId: "r3",
  date: "28 Jul 2026",
  dateSort: "2026-07-28",
  status: "Active"
}, {
  id: "a17",
  badgeId: "b3",
  memberId: "m12",
  type: "Automated",
  ruleId: "r3",
  date: "30 Jul 2026",
  dateSort: "2026-07-30",
  status: "Active"
}, {
  id: "a18",
  badgeId: "b5",
  memberId: "m4",
  type: "Manual",
  date: "03 Aug 2026",
  dateSort: "2026-08-03",
  status: "Active"
}, {
  id: "a19",
  badgeId: "b5",
  memberId: "m2",
  type: "Manual",
  date: "05 Aug 2026",
  dateSort: "2026-08-05",
  status: "Active"
}, {
  id: "a20",
  badgeId: "b6",
  memberId: "m9",
  type: "Manual",
  date: "06 Aug 2026",
  dateSort: "2026-08-06",
  status: "Active"
}];
const BDG_CRITERIA_TYPES = [{
  key: "tier",
  label: "Membership tier reached",
  icon: "lucide:layers",
  valueType: "tier"
}, {
  key: "course",
  label: "Course completed",
  icon: "lucide:graduation-cap",
  valueType: "text",
  placeholder: "e.g. Advanced Dermal Fillers"
}, {
  key: "postCount",
  label: "Post count",
  icon: "lucide:file-text",
  valueType: "number",
  placeholder: "e.g. 50"
}, {
  key: "commentCount",
  label: "Comment count",
  icon: "lucide:message-square",
  valueType: "number",
  placeholder: "e.g. 200"
}, {
  key: "eventAttended",
  label: "Event attended",
  icon: "lucide:calendar",
  valueType: "text",
  placeholder: "e.g. Clinic Growth Summit"
}, {
  key: "verificationApproved",
  label: "Verification approved",
  icon: "lucide:shield-check",
  valueType: "none"
}];
const bdgCriteriaMeta = key => BDG_CRITERIA_TYPES.find(c => c.key === key) || BDG_CRITERIA_TYPES[0];
const BDG_INITIAL_RULES = [{
  id: "r1",
  name: "Mastery Tier Achievers",
  badgeId: "b4",
  criteriaType: "tier",
  threshold: "Mastery",
  active: true
}, {
  id: "r2",
  name: "Prolific Contributors",
  badgeId: "b6",
  criteriaType: "postCount",
  threshold: "50",
  active: true
}, {
  id: "r3",
  name: "Faculty Verification",
  badgeId: "b3",
  criteriaType: "verificationApproved",
  threshold: "",
  active: true
}, {
  id: "r4",
  name: "Super Commenters",
  badgeId: "b2",
  criteriaType: "commentCount",
  threshold: "200",
  active: false
}];
function bdgCriteriaSummary(rule) {
  switch (rule.criteriaType) {
    case "tier":
      return "Reach " + rule.threshold + " tier";
    case "course":
      return 'Complete "' + rule.threshold + '"';
    case "postCount":
      return "Post " + rule.threshold + "+ times";
    case "commentCount":
      return "Leave " + rule.threshold + "+ comments";
    case "eventAttended":
      return 'Attend "' + rule.threshold + '"';
    case "verificationApproved":
      return "Verification approved";
    default:
      return "";
  }
}
function bdgEstimateQualifying(criteriaType, threshold) {
  if (criteriaType === "tier") {
    const rank = bdgTierRank(threshold);
    if (rank < 0) return 0;
    return BDG_MEMBERS.filter(m => bdgTierRank(m.tier) >= rank).length;
  }
  if (criteriaType === "verificationApproved") return 8;
  if (criteriaType === "postCount" || criteriaType === "commentCount") {
    const n = Number(threshold);
    if (!n || n <= 0) return 0;
    return Math.max(1, Math.round(320 / n));
  }
  if (!threshold || !threshold.trim()) return 0;
  return Math.max(3, 24 - Math.min(18, threshold.trim().length));
}

/* --------------------------------------------------------------- shared UI */
function BDGAvatar({
  name,
  avatar,
  size
}) {
  const s = size || 38;
  if (avatar) return /*#__PURE__*/React.createElement("img", {
    className: "bdg-avatar",
    style: {
      width: s,
      height: s
    },
    src: avatar,
    alt: name
  });
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    className: "bdg-avatar bdg-avatar-fallback",
    style: {
      width: s,
      height: s,
      fontSize: s * 0.36
    }
  }, initials);
}
function bdgIsCustomIcon(icon) {
  return typeof icon === "string" && icon.startsWith("data:");
}
function BDGBadgeIcon({
  badge,
  size
}) {
  const tone = BDG_CATEGORY_TONE[badge.category] || {
    bg: "var(--gray-100)",
    fg: "var(--gray-500)"
  };
  const s = size || 40;
  if (bdgIsCustomIcon(badge.icon)) {
    return /*#__PURE__*/React.createElement("span", {
      className: "bdg-badge-icon bdg-badge-icon-custom",
      style: {
        width: s,
        height: s,
        background: tone.bg
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: badge.icon,
      alt: "",
      style: {
        width: s,
        height: s
      }
    }));
  }
  return /*#__PURE__*/React.createElement("span", {
    className: "bdg-badge-icon",
    style: {
      width: s,
      height: s,
      background: tone.bg,
      color: tone.fg,
      fontSize: s * 0.5
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: badge.icon
  }));
}
function BDGCategoryPill({
  category
}) {
  const tone = BDG_CATEGORY_TONE[category] || {
    bg: "var(--gray-100)",
    fg: "var(--gray-500)"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "bdg-cat-pill",
    style: {
      background: tone.bg,
      color: tone.fg
    }
  }, category);
}
function BDGTypePill({
  type
}) {
  const isManual = type === "Manual";
  return /*#__PURE__*/React.createElement("span", {
    className: "bdg-type-pill",
    style: {
      background: isManual ? "var(--brand-gold-100)" : "var(--ai-purple-100)",
      color: isManual ? "var(--brand-gold)" : "var(--ai-purple)"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: isManual ? "lucide:hand" : "lucide:zap"
  }), type);
}
function BDGStatusPill({
  status
}) {
  const meta = status === "Active" ? {
    bg: "var(--success-bg)",
    fg: "var(--success)"
  } : status === "Revoked" ? {
    bg: "var(--error-bg)",
    fg: "var(--error)"
  } : {
    bg: "var(--gray-100)",
    fg: "var(--gray-500)"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "bdg-status-pill",
    style: {
      background: meta.bg
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-status-dot",
    style: {
      background: meta.fg
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: meta.fg
    }
  }, status));
}
function BDGToggle({
  on,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "bdg-toggle" + (on ? " is-on" : ""),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-toggle-knob"
  }));
}
function BDGCheck({
  on,
  onClick,
  disabled
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "bdg-check" + (on ? " is-on" : ""),
    onClick: onClick,
    disabled: disabled
  }, on && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }));
}
function BDGToast({
  message
}) {
  if (!message) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-toast"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:circle-check-big"
  }), /*#__PURE__*/React.createElement("span", null, message));
}

/* ------------------------------------------------------------- dashboard */
function BDGDashboardView({
  badges,
  assignments,
  rules,
  openCreate,
  openDetail,
  goLibrary
}) {
  const stats = [{
    label: "Total Badges",
    value: badges.length,
    icon: "lucide:award",
    color: "var(--brand-navy)",
    bg: "var(--gray-100)"
  }, {
    label: "Active Rules",
    value: rules.filter(r => r.active).length,
    icon: "lucide:zap",
    color: "var(--success)",
    bg: "var(--success-bg)"
  }, {
    label: "Total Assignments",
    value: assignments.filter(a => a.status === "Active").length,
    icon: "lucide:users",
    color: "var(--ai-purple)",
    bg: "var(--ai-purple-100)"
  }];
  const recent = useMemoBDG(() => {
    return [...assignments].sort((a, b) => b.dateSort.localeCompare(a.dateSort)).slice(0, 6);
  }, [assignments]);
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Badge Management"), /*#__PURE__*/React.createElement("p", null, "Recognise member milestones with manual awards and automated, criteria-based rules.")), /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-navy",
    type: "button",
    onClick: openCreate
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Create Badge")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-grid"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-card",
    key: s.label
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-stat-icon",
    style: {
      background: s.bg,
      color: s.color
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: s.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-label"
  }, s.label), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-value",
    style: s.label === "Active Rules" ? {
      color: "var(--success)"
    } : undefined
  }, s.value))))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-card-title-text"
  }, "Recent Badge Assignments"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goLibrary();
    }
  }, "View all badges")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-row-grid bdg-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "BADGE"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "USER"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "TYPE"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "DATE"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "STATUS")), recent.map(a => {
    const badge = badges.find(b => b.id === a.badgeId);
    const member = bdgMemberById(a.memberId);
    if (!badge || !member) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      className: "bdg-row-grid bdg-trow",
      onClick: () => openDetail(badge)
    }, /*#__PURE__*/React.createElement("div", {
      className: "bdg-trow-badge"
    }, /*#__PURE__*/React.createElement(BDGBadgeIcon, {
      badge: badge,
      size: 34
    }), /*#__PURE__*/React.createElement("span", {
      className: "bdg-trow-badge-name"
    }, badge.name)), /*#__PURE__*/React.createElement("div", {
      className: "bdg-trow-user"
    }, /*#__PURE__*/React.createElement(BDGAvatar, {
      name: member.name,
      avatar: member.avatar,
      size: 30
    }), /*#__PURE__*/React.createElement("span", null, member.name)), /*#__PURE__*/React.createElement(BDGTypePill, {
      type: a.type
    }), /*#__PURE__*/React.createElement("span", {
      className: "bdg-meta-cell"
    }, a.date), /*#__PURE__*/React.createElement(BDGStatusPill, {
      status: a.status
    }));
  }))));
}

/* ----------------------------------------------------------------- library */
function BDGLibraryView({
  badges,
  assignments,
  openCreate,
  openEdit,
  openAssign,
  openDetail,
  onToggleArchive
}) {
  const [query, setQuery] = useStateBDG("");
  const [category, setCategory] = useStateBDG("all");
  const [statusFilter, setStatusFilter] = useStateBDG("all");
  const [openMenuId, setOpenMenuId] = useStateBDG(null);
  const counts = useMemoBDG(() => {
    const m = {};
    assignments.forEach(a => {
      if (a.status === "Active") m[a.badgeId] = (m[a.badgeId] || 0) + 1;
    });
    return m;
  }, [assignments]);
  const filtered = useMemoBDG(() => {
    const q = query.trim().toLowerCase();
    return badges.filter(b => {
      if (category !== "all" && b.category !== category) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (q && !(b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [badges, query, category, statusFilter]);
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "All Badges"), /*#__PURE__*/React.createElement("p", null, "Browse, edit, assign and archive every badge in the library.")), /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-navy",
    type: "button",
    onClick: openCreate
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Create Badge")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-search-input-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search badges by name or description...",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-filter-select"
  }, /*#__PURE__*/React.createElement("select", {
    value: category,
    onChange: e => setCategory(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All categories"), BDG_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-filter-select"
  }, /*#__PURE__*/React.createElement("select", {
    value: statusFilter,
    onChange: e => setStatusFilter(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All statuses"), /*#__PURE__*/React.createElement("option", {
    value: "Active"
  }, "Active"), /*#__PURE__*/React.createElement("option", {
    value: "Archived"
  }, "Archived")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-badge-grid"
  }, filtered.map(b => {
    const archived = b.status === "Archived";
    return /*#__PURE__*/React.createElement("div", {
      key: b.id,
      className: "bdg-badge-card" + (archived ? " is-archived" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "bdg-badge-card-head"
    }, /*#__PURE__*/React.createElement(BDGBadgeIcon, {
      badge: b,
      size: 48
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "bdg-card-more",
      onClick: () => setOpenMenuId(openMenuId === b.id ? null : b.id)
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:more-vertical"
    })), openMenuId === b.id && /*#__PURE__*/React.createElement("div", {
      className: "bdg-card-menu",
      onMouseLeave: () => setOpenMenuId(null)
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        openEdit(b);
        setOpenMenuId(null);
      }
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:pencil"
    }), "Edit"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: archived,
      onClick: () => {
        openAssign(b);
        setOpenMenuId(null);
      }
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:user-plus"
    }), "Assign to members"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        onToggleArchive(b);
        setOpenMenuId(null);
      }
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: archived ? "lucide:archive-restore" : "lucide:archive"
    }), archived ? "Unarchive" : "Archive"))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "bdg-badge-card-name",
      onClick: () => openDetail(b)
    }, b.name), /*#__PURE__*/React.createElement("p", {
      className: "bdg-badge-card-desc"
    }, b.description), /*#__PURE__*/React.createElement("div", {
      className: "bdg-badge-card-foot"
    }, /*#__PURE__*/React.createElement(BDGCategoryPill, {
      category: b.category
    }), /*#__PURE__*/React.createElement("span", {
      className: "bdg-badge-card-count"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:users"
    }), counts[b.id] || 0)), archived && /*#__PURE__*/React.createElement("span", {
      className: "bdg-archived-tag"
    }, "Archived"));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "bdg-empty-row"
  }, "No badges match your filters.")));
}

/* ------------------------------------------------------------------- rules */
function BDGRulesView({
  rules,
  badges,
  assignments,
  toggleRule,
  openCreateRule,
  openDetail
}) {
  const awardedFor = ruleId => assignments.filter(a => a.ruleId === ruleId && a.status === "Active").length;
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Automation Rules"), /*#__PURE__*/React.createElement("p", null, "Award badges automatically when a member meets criteria — no manual work required.")), /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-navy",
    type: "button",
    onClick: openCreateRule
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Create Rule")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-rule-banner"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:zap"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Automated rules"), " run continuously and award badges the moment a member meets the criteria. Profinity never revokes automatically — only admins can revoke.")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-rule-list"
  }, rules.map(rule => {
    const badge = badges.find(b => b.id === rule.badgeId);
    if (!badge) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "bdg-rule-card",
      key: rule.id
    }, /*#__PURE__*/React.createElement(BDGBadgeIcon, {
      badge: badge,
      size: 48
    }), /*#__PURE__*/React.createElement("div", {
      className: "bdg-rule-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bdg-rule-head"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "bdg-rule-title",
      onClick: () => openDetail(badge)
    }, rule.name), /*#__PURE__*/React.createElement("span", {
      className: "bdg-rule-active" + (rule.active ? "" : " is-off")
    }, /*#__PURE__*/React.createElement("span", {
      className: "bdg-rule-active-dot"
    }), rule.active ? "Active" : "Inactive")), /*#__PURE__*/React.createElement("div", {
      className: "bdg-rule-meta"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:award"
    }), "Awards ", /*#__PURE__*/React.createElement("strong", null, badge.name)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:key-round"
    }), bdgCriteriaSummary(rule)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:users"
    }), /*#__PURE__*/React.createElement("strong", null, awardedFor(rule.id)), " members awarded"))), /*#__PURE__*/React.createElement(BDGToggle, {
      on: rule.active,
      onClick: () => toggleRule(rule.id)
    }));
  })));
}

/* -------------------------------------------------------------- tabs shell */
function BDGTabs({
  tab,
  setTab
}) {
  const TABS = [{
    key: "dashboard",
    label: "Dashboard",
    icon: "lucide:layout-grid"
  }, {
    key: "library",
    label: "All Badges",
    icon: "lucide:award"
  }, {
    key: "rules",
    label: "Automation Rules",
    icon: "lucide:zap"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-tabs"
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    className: "bdg-tab" + (tab === t.key ? " is-active" : ""),
    onClick: () => setTab(t.key)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: t.icon
  }), t.label)));
}

/* -------------------------------------------------------------- detail view */
function BDGDetailView({
  badge,
  assignments,
  rules,
  onBack,
  onRevoke,
  onEdit
}) {
  const [page, setPage] = useStateBDG(1);
  const perPage = 5;
  const holders = useMemoBDG(() => assignments.filter(a => a.badgeId === badge.id).sort((a, b) => b.dateSort.localeCompare(a.dateSort)), [assignments, badge.id]);
  const active = holders.filter(h => h.status === "Active");
  const manualCount = active.filter(h => h.type === "Manual").length;
  const autoCount = active.filter(h => h.type === "Automated").length;
  const linkedRules = rules.filter(r => r.badgeId === badge.id);
  const pageCount = Math.max(1, Math.ceil(holders.length / perPage));
  const safePage = Math.min(page, pageCount);
  const pageRows = holders.slice((safePage - 1) * perPage, (safePage - 1) * perPage + perPage);
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-view"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "bdg-back-btn",
    onClick: onBack
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), "Back"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-detail-head"
  }, /*#__PURE__*/React.createElement(BDGBadgeIcon, {
    badge: badge,
    size: 72
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdg-detail-head-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-detail-head-top"
  }, /*#__PURE__*/React.createElement("h1", null, badge.name), badge.status === "Archived" && /*#__PURE__*/React.createElement("span", {
    className: "bdg-archived-tag"
  }, "Archived")), /*#__PURE__*/React.createElement(BDGCategoryPill, {
    category: badge.category
  }), /*#__PURE__*/React.createElement("p", null, badge.description)), /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-ghost",
    type: "button",
    onClick: () => onEdit(badge)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Edit Badge")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-grid bdg-stat-grid-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-stat-icon",
    style: {
      background: "var(--gray-100)",
      color: "var(--brand-navy)"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-label"
  }, "Total Awarded"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-value"
  }, active.length))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-stat-icon",
    style: {
      background: "var(--brand-gold-100)",
      color: "var(--brand-gold)"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:hand"
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-label"
  }, "Manual"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-value"
  }, manualCount))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-stat-icon",
    style: {
      background: "var(--ai-purple-100)",
      color: "var(--ai-purple)"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:zap"
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-label"
  }, "Automated"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-stat-value"
  }, autoCount)))), linkedRules.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "bdg-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-card-title-text"
  }, "Linked Rules")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-linked-rules"
  }, linkedRules.map(r => /*#__PURE__*/React.createElement("div", {
    className: "bdg-linked-rule",
    key: r.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-rule-active" + (r.active ? "" : " is-off")
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-rule-active-dot"
  }), r.active ? "Active" : "Inactive"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-linked-rule-name"
  }, r.name), /*#__PURE__*/React.createElement("span", {
    className: "bdg-linked-rule-crit"
  }, bdgCriteriaSummary(r)))))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-card-title-text"
  }, "Holders")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-row-grid bdg-thead bdg-thead-holders"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "MEMBER"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "TYPE"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "DATE"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-th"
  }, "STATUS"), /*#__PURE__*/React.createElement("span", null)), pageRows.map(h => {
    const member = bdgMemberById(h.memberId);
    if (!member) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: h.id,
      className: "bdg-row-grid bdg-trow bdg-trow-holders"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bdg-trow-user"
    }, /*#__PURE__*/React.createElement(BDGAvatar, {
      name: member.name,
      avatar: member.avatar,
      size: 32
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "bdg-holder-name"
    }, member.name), /*#__PURE__*/React.createElement("div", {
      className: "bdg-holder-email"
    }, member.email))), /*#__PURE__*/React.createElement(BDGTypePill, {
      type: h.type
    }), /*#__PURE__*/React.createElement("span", {
      className: "bdg-meta-cell"
    }, h.date), /*#__PURE__*/React.createElement(BDGStatusPill, {
      status: h.status
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "bdg-link bdg-danger",
      disabled: h.status === "Revoked",
      onClick: () => onRevoke(h.id)
    }, "Revoke"));
  }), holders.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "bdg-empty-row"
  }, "No one has earned this badge yet.")), pageCount > 1 && /*#__PURE__*/React.createElement("div", {
    className: "bdg-pagebtn-group",
    style: {
      marginTop: 16,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "bdg-pagebtn",
    disabled: safePage <= 1,
    type: "button",
    onClick: () => setPage(safePage - 1)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-left"
  })), /*#__PURE__*/React.createElement("span", {
    className: "bdg-pageindicator"
  }, safePage, " / ", pageCount), /*#__PURE__*/React.createElement("button", {
    className: "bdg-pagebtn",
    disabled: safePage >= pageCount,
    type: "button",
    onClick: () => setPage(safePage + 1)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  })))));
}

/* -------------------------------------------------------- create/edit modal */
function BDGCreateModal({
  editing,
  onClose,
  onSave
}) {
  const [name, setName] = useStateBDG(editing ? editing.name : "");
  const [description, setDescription] = useStateBDG(editing ? editing.description : "");
  const [icon, setIcon] = useStateBDG(editing ? editing.icon : null);
  const [category, setCategory] = useStateBDG(editing ? editing.category : BDG_CATEGORIES[0]);
  const [notify, setNotify] = useStateBDG(editing ? editing.notify : true);
  const canSubmit = name.trim().length > 0 && description.trim().length > 0 && !!icon;
  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      icon,
      category,
      notify
    });
  };
  const handleUploadIcon = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const file = (e.target.files || [])[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setIcon(reader.result);
      reader.readAsDataURL(file);
    };
    input.click();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-head"
  }, /*#__PURE__*/React.createElement("h2", null, editing ? "Edit Badge" : "Create Badge"), /*#__PURE__*/React.createElement("button", {
    className: "bdg-modal-close",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Badge Icon ", /*#__PURE__*/React.createElement("span", {
    className: "bdg-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-icon-upload-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-icon-upload-preview"
  }, bdgIsCustomIcon(icon) ? /*#__PURE__*/React.createElement("img", {
    src: icon,
    alt: ""
  }) : /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:image"
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-icon-upload-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-outline bdg-btn-sm",
    type: "button",
    onClick: handleUploadIcon
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:upload"
  }), "Upload custom icon"), bdgIsCustomIcon(icon) && /*#__PURE__*/React.createElement("button", {
    className: "bdg-icon-upload-clear",
    type: "button",
    onClick: () => setIcon(null)
  }, "Remove"), /*#__PURE__*/React.createElement("span", {
    className: "bdg-icon-upload-hint"
  }, "PNG, JPG or SVG"))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-icon-grid"
  }, BDG_ICON_OPTIONS.map(ic => /*#__PURE__*/React.createElement("button", {
    key: ic,
    type: "button",
    className: "bdg-icon-opt" + (icon === ic ? " is-selected" : ""),
    onClick: () => setIcon(ic)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: ic
  })))), /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Badge Name ", /*#__PURE__*/React.createElement("span", {
    className: "bdg-req"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    className: "bdg-input",
    placeholder: "e.g. Gold Tier Member",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Description ", /*#__PURE__*/React.createElement("span", {
    className: "bdg-req"
  }, "*")), /*#__PURE__*/React.createElement("textarea", {
    className: "bdg-textarea",
    placeholder: "What does this badge represent?",
    value: description,
    onChange: e => setDescription(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Category"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-select-wrap"
  }, /*#__PURE__*/React.createElement("select", {
    className: "bdg-select",
    value: category,
    onChange: e => setCategory(e.target.value)
  }, BDG_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-notify-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "bdg-topic-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: notify,
    onChange: () => setNotify(n => !n)
  }), /*#__PURE__*/React.createElement("span", {
    className: "bdg-topic-box"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  })), /*#__PURE__*/React.createElement("span", null, "Enable User Notifications"))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-outline",
    type: "button",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-navy",
    type: "button",
    disabled: !canSubmit,
    onClick: handleSubmit
  }, editing ? "Save Changes" : "Create Badge"))));
}

/* -------------------------------------------------------------- assign modal */
function BDGAssignModal({
  badge,
  assignments,
  onClose,
  onAssign
}) {
  const [query, setQuery] = useStateBDG("");
  const [selected, setSelected] = useStateBDG({});
  const [note, setNote] = useStateBDG("");
  const holderIds = useMemoBDG(() => new Set(assignments.filter(a => a.badgeId === badge.id && a.status === "Active").map(a => a.memberId)), [assignments, badge.id]);
  const filtered = useMemoBDG(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BDG_MEMBERS;
    return BDG_MEMBERS.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [query]);
  const toggle = id => setSelected(st => ({
    ...st,
    [id]: !st[id]
  }));
  const count = Object.values(selected).filter(Boolean).length;
  const handleSubmit = () => {
    const ids = Object.keys(selected).filter(id => selected[id]);
    if (!ids.length) return;
    onAssign(ids, note.trim());
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal bdg-modal-lg",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-head-badge"
  }, /*#__PURE__*/React.createElement(BDGBadgeIcon, {
    badge: badge,
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Assign badge"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-head-sub"
  }, badge.name))), /*#__PURE__*/React.createElement("button", {
    className: "bdg-modal-close",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-search-input-wrap",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search members by name or email...",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-member-list"
  }, filtered.map(m => {
    const already = holderIds.has(m.id);
    const on = !!selected[m.id];
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: m.id,
      className: "bdg-member-row" + (already ? " is-disabled" : ""),
      onClick: () => !already && toggle(m.id),
      disabled: already
    }, /*#__PURE__*/React.createElement(BDGCheck, {
      on: on || already,
      disabled: already
    }), /*#__PURE__*/React.createElement(BDGAvatar, {
      name: m.name,
      avatar: m.avatar,
      size: 36
    }), /*#__PURE__*/React.createElement("span", {
      className: "bdg-member-info"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bdg-member-name"
    }, m.name), /*#__PURE__*/React.createElement("span", {
      className: "bdg-member-email"
    }, m.email)), /*#__PURE__*/React.createElement("span", {
      className: "bdg-member-tier"
    }, m.tier), already && /*#__PURE__*/React.createElement("span", {
      className: "bdg-already-tag"
    }, "Already earned"));
  })), /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label",
    style: {
      marginTop: 18
    }
  }, "Note ", /*#__PURE__*/React.createElement("span", {
    className: "bdg-optional"
  }, "(optional)")), /*#__PURE__*/React.createElement("textarea", {
    className: "bdg-textarea",
    style: {
      minHeight: 64
    },
    placeholder: "Add a note for the audit log...",
    value: note,
    onChange: e => setNote(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-actions bdg-modal-actions-assign"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdg-selected-count"
  }, count, " member", count === 1 ? "" : "s", " selected"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-actions-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-outline",
    type: "button",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-navy",
    type: "button",
    disabled: count === 0,
    onClick: handleSubmit
  }, "Assign badge")))));
}

/* ---------------------------------------------------------- create rule modal */
function BDGRuleModal({
  badges,
  onClose,
  onCreate
}) {
  const activeBadges = badges.filter(b => b.status === "Active");
  const [badgeId, setBadgeId] = useStateBDG(activeBadges[0] ? activeBadges[0].id : "");
  const [name, setName] = useStateBDG("");
  const [criteriaType, setCriteriaType] = useStateBDG("tier");
  const [threshold, setThreshold] = useStateBDG(BDG_TIERS[2]);
  const meta = bdgCriteriaMeta(criteriaType);
  const estimate = useMemoBDG(() => bdgEstimateQualifying(criteriaType, threshold), [criteriaType, threshold]);
  const canSubmit = name.trim().length > 0 && !!badgeId && (meta.valueType === "none" || threshold.trim().length > 0);
  const handleCriteriaChange = key => {
    setCriteriaType(key);
    const m = bdgCriteriaMeta(key);
    setThreshold(m.valueType === "tier" ? BDG_TIERS[2] : m.valueType === "none" ? "" : "");
  };
  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      name: name.trim(),
      badgeId,
      criteriaType,
      threshold: threshold.trim()
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal bdg-modal-lg",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Create Rule"), /*#__PURE__*/React.createElement("button", {
    className: "bdg-modal-close",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Rule Name ", /*#__PURE__*/React.createElement("span", {
    className: "bdg-req"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    className: "bdg-input",
    placeholder: "e.g. Mastery Tier Achievers",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Badge to award ", /*#__PURE__*/React.createElement("span", {
    className: "bdg-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "bdg-select-wrap"
  }, /*#__PURE__*/React.createElement("select", {
    className: "bdg-select",
    value: badgeId,
    onChange: e => setBadgeId(e.target.value)
  }, activeBadges.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.id,
    value: b.id
  }, b.name))), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Criteria"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-criteria-grid"
  }, BDG_CRITERIA_TYPES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.key,
    type: "button",
    className: "bdg-criteria-opt" + (criteriaType === c.key ? " is-active" : ""),
    onClick: () => handleCriteriaChange(c.key)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: c.icon
  }), /*#__PURE__*/React.createElement("span", null, c.label)))), meta.valueType === "tier" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Threshold"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-select-wrap"
  }, /*#__PURE__*/React.createElement("select", {
    className: "bdg-select",
    value: threshold,
    onChange: e => setThreshold(e.target.value)
  }, BDG_TIERS.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t))), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }))), (meta.valueType === "text" || meta.valueType === "number") && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    className: "bdg-field-label"
  }, "Threshold"), /*#__PURE__*/React.createElement("input", {
    className: "bdg-input",
    type: meta.valueType === "number" ? "number" : "text",
    placeholder: meta.placeholder,
    value: threshold,
    onChange: e => setThreshold(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdg-estimate-card"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bdg-estimate-num"
  }, estimate, " member", estimate === 1 ? "" : "s"), /*#__PURE__*/React.createElement("div", {
    className: "bdg-estimate-sub"
  }, "estimated to qualify right now"))), /*#__PURE__*/React.createElement("div", {
    className: "bdg-modal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-outline",
    type: "button",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "bdg-btn bdg-btn-navy",
    type: "button",
    disabled: !canSubmit,
    onClick: handleSubmit
  }, "Activate Rule"))));
}

/* ----------------------------------------------------------------- root */
function BDGApp() {
  const [badges, setBadges] = useStateBDG(BDG_INITIAL_BADGES);
  const [assignments, setAssignments] = useStateBDG(BDG_INITIAL_ASSIGNMENTS);
  const [rules, setRules] = useStateBDG(BDG_INITIAL_RULES);
  const [tab, setTab] = useStateBDG("dashboard");
  const [detailBadge, setDetailBadge] = useStateBDG(null);
  const [createModal, setCreateModal] = useStateBDG(null); // { editing: badge|null } | null
  const [assignModal, setAssignModal] = useStateBDG(null); // badge | null
  const [ruleModal, setRuleModal] = useStateBDG(false);
  const [toast, setToast] = useStateBDG("");
  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(cur => cur === msg ? "" : cur), 3200);
  };
  const openDetail = badge => setDetailBadge(badge);
  const closeDetail = () => setDetailBadge(null);
  const openCreate = () => setCreateModal({
    editing: null
  });
  const openEdit = badge => setCreateModal({
    editing: badge
  });
  const handleSaveBadge = draft => {
    if (createModal.editing) {
      setBadges(st => st.map(b => b.id === createModal.editing.id ? {
        ...b,
        ...draft
      } : b));
      if (detailBadge && detailBadge.id === createModal.editing.id) setDetailBadge(d => ({
        ...d,
        ...draft
      }));
      showToast("Badge updated.");
    } else {
      const id = "b" + Math.random().toString(16).slice(2, 8);
      setBadges(st => [...st, {
        id,
        status: "Active",
        ...draft
      }]);
      showToast("Badge created.");
    }
    setCreateModal(null);
  };
  const handleToggleArchive = badge => {
    setBadges(st => st.map(b => b.id === badge.id ? {
      ...b,
      status: b.status === "Archived" ? "Active" : "Archived"
    } : b));
  };
  const handleAssign = (memberIds, note) => {
    const badge = assignModal;
    const today = "07 Aug 2026";
    const newRecords = memberIds.map(memberId => ({
      id: "a" + Math.random().toString(16).slice(2, 8),
      badgeId: badge.id,
      memberId,
      type: "Manual",
      date: today,
      dateSort: "2026-08-07",
      status: "Active",
      note: note || undefined
    }));
    setAssignments(st => [...st, ...newRecords]);
    setAssignModal(null);
    showToast("Assigned to " + memberIds.length + " member" + (memberIds.length === 1 ? "" : "s") + (badge.notify ? " — notifications sent." : "."));
  };
  const handleRevoke = assignmentId => {
    setAssignments(st => st.map(a => a.id === assignmentId ? {
      ...a,
      status: "Revoked"
    } : a));
    showToast("Assignment revoked.");
  };
  const toggleRule = ruleId => setRules(st => st.map(r => r.id === ruleId ? {
    ...r,
    active: !r.active
  } : r));
  const handleCreateRule = draft => {
    const id = "r" + Math.random().toString(16).slice(2, 8);
    setRules(st => [...st, {
      id,
      active: true,
      ...draft
    }]);
    setRuleModal(false);
    showToast("Rule activated.");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bdg-shell"
  }, /*#__PURE__*/React.createElement(BDGSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "bdg-main"
  }, /*#__PURE__*/React.createElement(BDGHeader, null), /*#__PURE__*/React.createElement("div", {
    className: "bdg-content"
  }, detailBadge ? /*#__PURE__*/React.createElement(BDGDetailView, {
    badge: detailBadge,
    assignments: assignments,
    rules: rules,
    onBack: closeDetail,
    onRevoke: handleRevoke,
    onEdit: openEdit
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BDGTabs, {
    tab: tab,
    setTab: setTab
  }), tab === "dashboard" && /*#__PURE__*/React.createElement(BDGDashboardView, {
    badges: badges,
    assignments: assignments,
    rules: rules,
    openCreate: openCreate,
    openDetail: openDetail,
    goLibrary: () => setTab("library")
  }), tab === "library" && /*#__PURE__*/React.createElement(BDGLibraryView, {
    badges: badges,
    assignments: assignments,
    openCreate: openCreate,
    openEdit: openEdit,
    openAssign: setAssignModal,
    openDetail: openDetail,
    onToggleArchive: handleToggleArchive
  }), tab === "rules" && /*#__PURE__*/React.createElement(BDGRulesView, {
    rules: rules,
    badges: badges,
    assignments: assignments,
    toggleRule: toggleRule,
    openCreateRule: () => setRuleModal(true),
    openDetail: openDetail
  })))), createModal && /*#__PURE__*/React.createElement(BDGCreateModal, {
    editing: createModal.editing,
    onClose: () => setCreateModal(null),
    onSave: handleSaveBadge
  }), assignModal && /*#__PURE__*/React.createElement(BDGAssignModal, {
    badge: assignModal,
    assignments: assignments,
    onClose: () => setAssignModal(null),
    onAssign: handleAssign
  }), ruleModal && /*#__PURE__*/React.createElement(BDGRuleModal, {
    badges: badges,
    onClose: () => setRuleModal(false),
    onCreate: handleCreateRule
  }), /*#__PURE__*/React.createElement(BDGToast, {
    message: toast
  }));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(BDGApp, null));
