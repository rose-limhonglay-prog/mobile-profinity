/* ===========================================================================
   PROfinity — Admin · Push Notifications (desktop console)
   List / create wizard (audience → details → review) / schedule / live
   dispatch tracking / scheduled·draft·completed detail / resend modal.
   Suffixed -APN to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateAPN,
  useMemo: useMemoAPN
} = React;
const APN_IOS = "mdi:apple",
  APN_ANDROID = "mdi:android",
  APN_WEB = "mdi:web";
const APN_PLATFORMS = [{
  key: "ios",
  label: "iOS"
}, {
  key: "android",
  label: "Android"
}, {
  key: "web",
  label: "Web Browser"
}];
const APN_CHANNELS = [["Confidence", 342], ["Mastery", 218], ["Freedom Path", 156]];
const APN_TIERS = [["Basic", 428], ["Confidence", 387], ["Mastery", 542], ["Sovereign and Builder", 298]];
const APN_COURSES = [{
  id: "c1",
  name: "Facial Aesthetics Masterclass",
  cat: "Injectables",
  enrolled: 1240
}, {
  id: "c2",
  name: "Advanced Dermal Fillers",
  cat: "Injectables",
  enrolled: 864
}, {
  id: "c3",
  name: "Botulinum Toxin Fundamentals",
  cat: "Injectables",
  enrolled: 1980
}, {
  id: "c4",
  name: "Lip Enhancement Techniques",
  cat: "Injectables",
  enrolled: 512
}, {
  id: "c5",
  name: "Chemical Peels & Skin Health",
  cat: "Skin",
  enrolled: 738
}, {
  id: "c6",
  name: "Microneedling Certification",
  cat: "Skin",
  enrolled: 623
}, {
  id: "c7",
  name: "Laser & Energy Devices",
  cat: "Devices",
  enrolled: 401
}, {
  id: "c8",
  name: "Thread Lifting Advanced",
  cat: "Surgical",
  enrolled: 289
}, {
  id: "c9",
  name: "Complications & Emergency Management",
  cat: "Safety",
  enrolled: 1104
}, {
  id: "c10",
  name: "Business of Aesthetics",
  cat: "Practice",
  enrolled: 956
}, {
  id: "c11",
  name: "Consultation & Consent Mastery",
  cat: "Practice",
  enrolled: 677
}, {
  id: "c12",
  name: "Anatomy for Injectors",
  cat: "Foundations",
  enrolled: 1533
}];
const APN_STATUS_META = {
  Sent: {
    color: "var(--success)",
    bg: "var(--success-bg)"
  },
  Scheduled: {
    color: "var(--info)",
    bg: "var(--info-bg)"
  },
  Draft: {
    color: "var(--gray-500)",
    bg: "var(--gray-100)"
  },
  Stopped: {
    color: "var(--error)",
    bg: "var(--error-bg)"
  },
  Completed: {
    color: "var(--brand-navy)",
    bg: "var(--ai-purple-100)"
  }
};
const APN_BASE_ROWS = [{
  id: 1,
  title: "Welcome to Version 2.0!",
  desc: "Explore our latest features and improvements.",
  platforms: [APN_IOS, APN_ANDROID],
  audience: "All Users",
  status: "Completed",
  scheduled: "Oct 24, 10:30 AM",
  delivered: "98%",
  opened: "22%"
}, {
  id: 2,
  title: "Limited Time Offer",
  desc: "Get 20% off on your next subscription renewal.",
  platforms: [APN_IOS, APN_ANDROID, APN_WEB],
  audience: "Free Tier",
  status: "Scheduled",
  scheduled: "Oct 30, 09:00 AM",
  delivered: "–",
  opened: "–"
}, {
  id: 3,
  title: "Password Changed",
  desc: "Your account password was successfully updated.",
  platforms: [APN_WEB],
  audience: "US Only",
  status: "Sent",
  scheduled: "Oct 23, 04:15 PM",
  delivered: "100%",
  opened: "65%"
}, {
  id: 4,
  title: "Abandoned Cart Reminder",
  desc: "You left items in your cart! Complete your order.",
  platforms: [APN_IOS, APN_ANDROID],
  audience: "Premium",
  status: "Draft",
  scheduled: "Not set",
  delivered: "–",
  opened: "–"
}, {
  id: 5,
  title: "Weekly Newsletter",
  desc: "Catch up on the latest trends in aesthetics.",
  platforms: [APN_WEB],
  audience: "All Users",
  status: "Stopped",
  scheduled: "Oct 22, 11:00 AM",
  delivered: "45%",
  opened: "12%"
}, {
  id: 6,
  title: "New Feature Alert: Dark Mode",
  desc: "You can now switch to dark mode in settings.",
  platforms: [APN_ANDROID],
  audience: "Beta Group",
  status: "Sent",
  scheduled: "Oct 21, 08:45 AM",
  delivered: "99%",
  opened: "31%"
}, {
  id: 7,
  title: "Maintenance Update",
  desc: "Our servers will be undergoing scheduled maintenance.",
  platforms: [APN_IOS, APN_ANDROID, APN_WEB],
  audience: "All Users",
  status: "Scheduled",
  scheduled: "Nov 1, 12:00 AM",
  delivered: "–",
  opened: "–"
}, {
  id: 8,
  title: "System Update Complete",
  desc: "Your system has been successfully updated.",
  platforms: [APN_IOS],
  audience: "Premium",
  status: "Sent",
  scheduled: "Oct 20, 02:20 PM",
  delivered: "97%",
  opened: "18%"
}];
const APN_SCHEDULE_ROWS = [{
  date: "Mon, Oct 28 2024",
  time: "10:00 AM PST",
  next: true
}, {
  date: "Wed, Oct 30 2024",
  time: "10:00 AM PST"
}, {
  date: "Fri, Nov 1 2024",
  time: "10:00 AM PST"
}, {
  date: "Wed, Nov 6 2024",
  time: "10:00 AM PST"
}, {
  date: "Fri, Nov 8 2024",
  time: "10:00 AM PST"
}];
const APN_REACH_BARS = [22, 34, 46, 40, 66, 100, 78, 52, 44, 36, 26, 20];
const APN_SEGMENT_REACH = {
  "All Users": "124,500",
  "Power Users": "38,200",
  "Premium members": "21,800",
  "Free Tier": "86,400",
  "Beta Group": "4,120"
};
const APN_LOG_LINES = [{
  ok: true,
  time: "2:14:30",
  text: "Batch chunk 12/14 delivered — 45 devices"
}, {
  ok: true,
  time: "2:14:28",
  text: "Batch chunk 11/14 delivered — 45 devices"
}, {
  ok: false,
  time: "2:14:26",
  text: "Failed: 3 invalid tokens (Android) — retrying"
}, {
  ok: true,
  time: "2:14:24",
  text: "Batch chunk 10/14 delivered — 45 devices"
}, {
  ok: true,
  time: "2:14:22",
  text: "Batch chunk 9/14 delivered — 44 devices"
}];
function apnParseDate(s) {
  const d = new Date(s + " 2024");
  return isNaN(d) ? 0 : d.getTime();
}
function apnToggleMap(setter, key) {
  setter(st => ({
    ...st,
    [key]: !st[key]
  }));
}

/* ------------------------------------------------------------- sidebar */
const APN_NAV = [{
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
  icon: "lucide:book-open",
  label: "Science Articles"
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
  label: "Push Notification",
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
function APNSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "apn-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), APN_NAV.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "apn-navitem" + (item.active ? " is-active" : ""),
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "apn-spacer"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down",
    class: "apn-chev"
  })))));
}
function APNHeader() {
  return /*#__PURE__*/React.createElement("header", {
    className: "apn-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-header-title"
  }, "Push Notification"), /*#__PURE__*/React.createElement("div", {
    className: "apn-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "apn-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "apn-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "apn-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ------------------------------------------------------------ previews */
function APNPhoneMock({
  title,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-notch"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-time"
  }, "9:41"), /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-status"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:signal"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:wifi"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:battery-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-clock"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-date"
  }, "Monday, October 28"), /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-big-time"
  }, "9:41")), /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-notif-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-notif"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-notif-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-phone-notif-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  })), /*#__PURE__*/React.createElement("span", {
    className: "apn-phone-notif-app"
  }, "PROFINITY"), /*#__PURE__*/React.createElement("span", {
    className: "apn-phone-notif-now"
  }, "now")), /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-notif-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-notif-body"
  }, body))), /*#__PURE__*/React.createElement("div", {
    className: "apn-phone-home"
  }))));
}
function APNWebMock({
  title,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-web"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-web-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-web-dot",
    style: {
      background: "#ff5f57"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-web-dot",
    style: {
      background: "#febc2e"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-web-dot",
    style: {
      background: "#28c840"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-web-url"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:lock"
  }), /*#__PURE__*/React.createElement("span", null, "app.profinity.academy"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-web-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-web-skel"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-web-skel2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-web-skel3"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-web-toast"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-web-toast-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-web-toast-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  })), /*#__PURE__*/React.createElement("span", {
    className: "apn-web-toast-app"
  }, "PROfinity Academy"), /*#__PURE__*/React.createElement("span", {
    className: "apn-web-toast-now"
  }, "now"), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x",
    class: "apn-web-toast-close"
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-web-toast-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "apn-web-toast-body"
  }, body))));
}
function APNLivePreviewCard({
  title,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title",
    style: {
      marginBottom: 20
    }
  }, "Live Preview"), /*#__PURE__*/React.createElement("div", {
    className: "apn-preview-label"
  }, "Mobile Preview"), /*#__PURE__*/React.createElement(APNPhoneMock, {
    title: title,
    body: body
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-preview-label",
    style: {
      margin: "20px 0 12px"
    }
  }, "Web Preview"), /*#__PURE__*/React.createElement(APNWebMock, {
    title: title,
    body: body
  }));
}
function APNSimplePreviewCard({
  title,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-card",
    style: {
      borderRadius: 20,
      position: "sticky",
      top: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title",
    style: {
      marginBottom: 20
    }
  }, "Preview"), /*#__PURE__*/React.createElement(APNPhoneMock, {
    title: title,
    body: body
  }));
}

/* ------------------------------------------------------------- checkbox */
function APNCheck({
  on,
  onClick,
  large
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-check" + (large ? " apn-check-lg" : "") + (on ? " is-on" : ""),
    onClick: onClick
  }, on && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }));
}
function APNRadio({
  on,
  onClick,
  large
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-radio" + (large ? " apn-radio-lg" : "") + (on ? " is-on" : ""),
    onClick: onClick
  }, on && /*#__PURE__*/React.createElement("span", {
    className: "apn-radio-dot"
  }));
}
function APNToggle({
  on,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-toggle" + (on ? " is-on" : ""),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-toggle-knob"
  }));
}
function APNIconLocked() {
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-icon-locked"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-icon-locked-thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-twist.png",
    alt: "Profinity app icon"
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-icon-locked-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-icon-locked-title"
  }, "Profinity app icon"), /*#__PURE__*/React.createElement("div", {
    className: "apn-icon-locked-sub"
  }, "Used as the notification icon on all platforms (default).")), /*#__PURE__*/React.createElement("span", {
    className: "apn-icon-locked-badge"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "Default"));
}

/* ------------------------------------------------------ automated rules */
const APN_RULE_COLORS = {
  purple: {
    bg: "var(--ai-purple-100)",
    fg: "var(--ai-purple)"
  },
  blue: {
    bg: "var(--info-bg)",
    fg: "var(--info)"
  },
  indigo: {
    bg: "#eef0fd",
    fg: "#4f5bd5"
  }
};
const APN_RULES = [{
  id: 1,
  icon: "lucide:user-plus",
  color: "purple",
  title: "Welcome Series",
  desc: "Greets new members and points them to onboarding and their first course.",
  trigger: "New user signup",
  timing: "Immediately",
  audience: "New members",
  sent: "1,204"
}, {
  id: 2,
  icon: "lucide:graduation-cap",
  color: "blue",
  title: "Course Completion",
  desc: "Congratulates learners and suggests the next course in their pathway.",
  trigger: "Course marked complete",
  timing: "Immediately",
  audience: "Enrolled learners",
  sent: "842"
}, {
  id: 3,
  icon: "lucide:bed",
  color: "indigo",
  title: "Inactivity Win-back",
  desc: "Re-engages members who haven't logged in for two weeks.",
  trigger: "No login for 14 days",
  timing: "Day 14, 10:00 local",
  audience: "Dormant members",
  sent: "376"
}, {
  id: 4,
  icon: "lucide:calendar-clock",
  color: "blue",
  title: "Appointment Reminder",
  desc: "Reminds patients of an upcoming appointment with the clinic.",
  trigger: "Booking 24h away",
  timing: "24 hours before",
  audience: "Patients with bookings",
  sent: "2,918"
}];
function APNTabs({
  tab,
  setTab,
  ruleCount
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-tabs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-tab" + (tab === "all" ? " is-active" : ""),
    onClick: () => setTab("all")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:list"
  }), "All Notifications"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-tab" + (tab === "rules" ? " is-active" : ""),
    onClick: () => setTab("rules")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:zap"
  }), "Automated Rules", /*#__PURE__*/React.createElement("span", {
    className: "apn-tab-badge"
  }, ruleCount)));
}
function APNRuleCard({
  rule,
  active,
  onToggle
}) {
  const c = APN_RULE_COLORS[rule.color];
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-rule-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-rule-icon",
    style: {
      background: c.bg,
      color: c.fg
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: rule.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-rule-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-rule-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-rule-title"
  }, rule.title), /*#__PURE__*/React.createElement("span", {
    className: "apn-rule-active"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-rule-active-dot"
  }), "Active")), /*#__PURE__*/React.createElement("p", {
    className: "apn-rule-desc"
  }, rule.desc), /*#__PURE__*/React.createElement("div", {
    className: "apn-rule-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:key-round"
  }), "Trigger: ", /*#__PURE__*/React.createElement("strong", null, rule.trigger)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock"
  }), rule.timing), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  }), rule.audience), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:send"
  }), /*#__PURE__*/React.createElement("strong", null, rule.sent), " sent (30d)"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-rule-actions"
  }, /*#__PURE__*/React.createElement(APNToggle, {
    on: active,
    onClick: onToggle
  }), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-sq",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sliders-horizontal"
  }))));
}
function APNRulesView({
  ruleStates,
  toggleRule
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-rule-banner"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:zap"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Automated notifications"), " send themselves when a trigger event fires — no manual sending required. Configure the trigger, timing, audience and message once; Profinity handles the rest.")), /*#__PURE__*/React.createElement("div", {
    className: "apn-rule-list"
  }, APN_RULES.map(rule => /*#__PURE__*/React.createElement(APNRuleCard, {
    key: rule.id,
    rule: rule,
    active: ruleStates[rule.id],
    onToggle: () => toggleRule(rule.id)
  }))));
}

/* ---------------------------------------------------------------- list */
function APNListView({
  rows,
  sortBy,
  setSortBy,
  selected,
  setSelected,
  perPage,
  setPerPage,
  goCreate,
  openRow,
  openResend,
  goSchedule,
  tab,
  setTab,
  ruleStates,
  toggleRule
}) {
  const count = Object.values(selected).filter(Boolean).length;
  const allChecked = rows.length > 0 && count === rows.length;
  const toggleAll = () => {
    if (allChecked) {
      setSelected({});
      return;
    }
    const sel = {};
    rows.forEach(r => sel[r.id] = true);
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
    className: "apn-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Push Notifications"), /*#__PURE__*/React.createElement("p", null, "Manage and track all push notifications across your platforms.")), /*#__PURE__*/React.createElement("div", {
    className: "apn-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:download"
  }), "Export CSV"), tab === "rules" ? /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "New Rule") : /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy",
    type: "button",
    onClick: goCreate
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Create Notification"))), /*#__PURE__*/React.createElement(APNTabs, {
    tab: tab,
    setTab: setTab,
    ruleCount: APN_RULES.length
  }), tab === "rules" ? /*#__PURE__*/React.createElement(APNRulesView, {
    ruleStates: ruleStates,
    toggleRule: toggleRule
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "apn-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-search-input-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search notifications..."
  })), /*#__PURE__*/React.createElement("button", {
    className: "apn-filter-btn",
    type: "button"
  }, /*#__PURE__*/React.createElement("span", null, "Status:"), /*#__PURE__*/React.createElement("span", {
    className: "apn-filter-val"
  }, "All"), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("button", {
    className: "apn-filter-btn",
    type: "button"
  }, /*#__PURE__*/React.createElement("span", null, "Platform:"), /*#__PURE__*/React.createElement("span", {
    className: "apn-filter-val"
  }, "All"), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("button", {
    className: "apn-filter-btn",
    type: "button"
  }, /*#__PURE__*/React.createElement("span", null, "Date Range:"), /*#__PURE__*/React.createElement("span", {
    className: "apn-filter-val"
  }, "Last 30 Days"), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap apn-select-icon apn-sort-select-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-up-down"
  }), /*#__PURE__*/React.createElement("select", {
    className: "apn-select apn-sort-select",
    value: sortBy,
    onChange: e => setSortBy(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "recent"
  }, "Sort: Most Recent"), /*#__PURE__*/React.createElement("option", {
    value: "oldest"
  }, "Sort: Oldest First"), /*#__PURE__*/React.createElement("option", {
    value: "az"
  }, "Sort: Name (A–Z)"), /*#__PURE__*/React.createElement("option", {
    value: "za"
  }, "Sort: Name (Z–A)"), /*#__PURE__*/React.createElement("option", {
    value: "status"
  }, "Sort: Status")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "apn-clear-filters",
    onClick: e => e.preventDefault()
  }, "Clear Filters")), count > 0 && /*#__PURE__*/React.createElement("div", {
    className: "apn-bulkbar"
  }, /*#__PURE__*/React.createElement("strong", null, count, " notification", count === 1 ? "" : "s", " selected"), /*#__PURE__*/React.createElement("span", {
    className: "apn-divider"
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-link",
    onClick: openResend
  }, "Resend"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Duplicate"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Archive"), /*#__PURE__*/React.createElement("span", {
    className: "apn-spacer"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "apn-danger",
    onClick: e => e.preventDefault()
  }, "Delete")), /*#__PURE__*/React.createElement("div", {
    className: "apn-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-row-grid apn-thead"
  }, /*#__PURE__*/React.createElement(APNCheck, {
    on: allChecked,
    onClick: toggleAll
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-th"
  }, "NOTIFICATION"), /*#__PURE__*/React.createElement("span", {
    className: "apn-th"
  }, "PLATFORM"), /*#__PURE__*/React.createElement("span", {
    className: "apn-th"
  }, "AUDIENCE"), /*#__PURE__*/React.createElement("span", {
    className: "apn-th"
  }, "STATUS"), /*#__PURE__*/React.createElement("span", {
    className: "apn-th"
  }, "SCHEDULED/SENT"), /*#__PURE__*/React.createElement("span", {
    className: "apn-th"
  }, "DELIVERED"), /*#__PURE__*/React.createElement("span", {
    className: "apn-th"
  }, "OPENED"), /*#__PURE__*/React.createElement("span", null)), rows.map(r => {
    const checked = !!selected[r.id];
    const s = APN_STATUS_META[r.status];
    return /*#__PURE__*/React.createElement("div", {
      key: r.id,
      className: "apn-row-grid apn-trow",
      style: {
        background: checked ? "var(--brand-gold-100)" : "var(--white)"
      }
    }, /*#__PURE__*/React.createElement(APNCheck, {
      on: checked,
      onClick: () => toggleOne(r.id)
    }), /*#__PURE__*/React.createElement("div", {
      className: "apn-trow-title",
      onClick: () => openRow(r)
    }, /*#__PURE__*/React.createElement("div", {
      className: "apn-trow-title-main"
    }, r.title), /*#__PURE__*/React.createElement("div", {
      className: "apn-trow-title-sub"
    }, r.desc)), /*#__PURE__*/React.createElement("div", {
      className: "apn-plat-icons"
    }, r.platforms.map((p, i) => /*#__PURE__*/React.createElement("iconify-icon", {
      key: i,
      icon: p
    }))), /*#__PURE__*/React.createElement("span", {
      className: "apn-audience-cell"
    }, r.audience), /*#__PURE__*/React.createElement("div", {
      className: "apn-status-pill",
      style: {
        background: s.bg
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "apn-status-dot",
      style: {
        background: s.color
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "apn-status-label",
      style: {
        color: s.color
      }
    }, r.status)), /*#__PURE__*/React.createElement("span", {
      className: "apn-audience-cell"
    }, r.scheduled), /*#__PURE__*/React.createElement("span", {
      className: "apn-metric",
      style: {
        color: r.delivered === "–" ? "var(--gray-400)" : "var(--gray-800)"
      }
    }, r.delivered), /*#__PURE__*/React.createElement("span", {
      className: "apn-metric",
      style: {
        color: r.opened === "–" ? "var(--gray-400)" : "var(--gray-800)"
      }
    }, r.opened), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:more-vertical",
      class: "apn-row-more",
      onClick: goSchedule
    }));
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-pagination"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-pageinfo"
  }, /*#__PURE__*/React.createElement("span", null, "Show"), /*#__PURE__*/React.createElement("div", {
    className: "apn-pp-select-wrap"
  }, /*#__PURE__*/React.createElement("select", {
    className: "apn-pp-select",
    value: perPage,
    onChange: e => setPerPage(e.target.value)
  }, /*#__PURE__*/React.createElement("option", null, "10"), /*#__PURE__*/React.createElement("option", null, "20"), /*#__PURE__*/React.createElement("option", null, "50")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("span", null, "notifications per page")), /*#__PURE__*/React.createElement("div", {
    className: "apn-pagebtns"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--gray-600)"
    }
  }, "Showing 1–", perPage, " of 48 notifications"), /*#__PURE__*/React.createElement("div", {
    className: "apn-pagebtn-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-pagebtn",
    disabled: true,
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-left"
  })), /*#__PURE__*/React.createElement("button", {
    className: "apn-pagebtn is-active",
    type: "button"
  }, "1"), /*#__PURE__*/React.createElement("button", {
    className: "apn-pagebtn",
    type: "button"
  }, "2"), /*#__PURE__*/React.createElement("button", {
    className: "apn-pagebtn",
    type: "button"
  }, "3"), /*#__PURE__*/React.createElement("span", {
    className: "apn-pagedots"
  }, "..."), /*#__PURE__*/React.createElement("button", {
    className: "apn-pagebtn",
    type: "button"
  }, "5"), /*#__PURE__*/React.createElement("button", {
    className: "apn-pagebtn",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  }))))))));
}

/* ------------------------------------------------------------- wizard */
function APNStepper({
  step
}) {
  const labels = ["Select Audience", "Notification Details", "Review & Send"];
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-steps"
  }, labels.map((label, i) => {
    const n = i + 1,
      active = n === step,
      done = n < step,
      last = i === labels.length - 1;
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      className: "apn-step",
      style: {
        flex: last ? "0 0 auto" : "1"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "apn-step-circle " + (active || done ? "is-done" : "is-todo")
    }, n), /*#__PURE__*/React.createElement("span", {
      className: "apn-step-label " + (active ? "is-active" : done ? "is-done" : "is-todo")
    }, label), !last && /*#__PURE__*/React.createElement("span", {
      className: "apn-step-line"
    }));
  }));
}
function APNStepAudience({
  audience,
  setAudience,
  goList,
  next
}) {
  const {
    allUsers,
    channels,
    tiers,
    courses,
    courseQuery
  } = audience;
  const setAllUsers = v => setAudience(st => ({
    ...st,
    allUsers: v
  }));
  const toggleChannel = name => {
    if (!allUsers) setAudience(st => ({
      ...st,
      channels: {
        ...st.channels,
        [name]: !st.channels[name]
      }
    }));
  };
  const toggleTier = name => {
    if (!allUsers) setAudience(st => ({
      ...st,
      tiers: {
        ...st.tiers,
        [name]: !st.tiers[name]
      }
    }));
  };
  const toggleCourse = id => setAudience(st => ({
    ...st,
    courses: {
      ...st.courses,
      [id]: !st.courses[id]
    }
  }));
  const setCourseQuery = v => setAudience(st => ({
    ...st,
    courseQuery: v
  }));
  const selectedCourseCount = Object.values(courses).filter(Boolean).length;
  const filteredCourses = APN_COURSES.filter(c => c.name.toLowerCase().includes(courseQuery.trim().toLowerCase()));
  const recipCount = useMemoAPN(() => {
    if (allUsers) return "12,480";
    const chSum = APN_CHANNELS.filter(([n]) => channels[n]).reduce((a, [, f]) => a + f, 0);
    const trSum = APN_TIERS.filter(([n]) => tiers[n]).reduce((a, [, f]) => a + f, 0);
    const crSum = APN_COURSES.filter(c => courses[c.id]).reduce((a, c) => a + c.enrolled, 0);
    return (chSum + trSum + crSum).toLocaleString();
  }, [allUsers, channels, tiers, courses]);
  const recipCaption = useMemoAPN(() => {
    if (allUsers) return "All registered users";
    const ch = APN_CHANNELS.filter(([n]) => channels[n]).length;
    const tr = APN_TIERS.filter(([n]) => tiers[n]).length;
    const parts = [];
    if (ch) parts.push(ch + " channel" + (ch === 1 ? "" : "s"));
    if (tr) parts.push(tr + " tier" + (tr === 1 ? "" : "s"));
    if (selectedCourseCount) parts.push(selectedCourseCount + " course" + (selectedCourseCount === 1 ? "" : "s"));
    return parts.length ? parts.join(" + ") + " (duplicate users removed)" : "No audience selected";
  }, [allUsers, channels, tiers, selectedCourseCount]);
  const channelCount = allUsers ? "All" : Object.values(channels).filter(Boolean).length;
  const tierCount = allUsers ? "—" : Object.values(tiers).filter(Boolean).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card apn-card-lg"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "apn-wizard-h2"
  }, "Select your audience"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-alluser-row" + (allUsers ? " is-on" : ""),
    onClick: () => setAllUsers(!allUsers)
  }, /*#__PURE__*/React.createElement(APNCheck, {
    on: allUsers,
    large: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flex: 1,
      minWidth: 0,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:globe"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-alluser-title"
  }, "All Users"), /*#__PURE__*/React.createElement("span", {
    className: "apn-alluser-sub"
  }, "Send to every registered user, ignoring filters below"))), /*#__PURE__*/React.createElement("span", {
    className: "apn-alluser-count"
  }, "12,480 total")), /*#__PURE__*/React.createElement("div", {
    className: "apn-sec-title"
  }, "Channels"), /*#__PURE__*/React.createElement("div", {
    className: "apn-sec-sub"
  }, "Select one or more channels to target"), APN_CHANNELS.map(([name, followers]) => {
    const on = allUsers || !!channels[name];
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: name,
      className: "apn-opt-row",
      onClick: () => toggleChannel(name)
    }, /*#__PURE__*/React.createElement(APNCheck, {
      on: on
    }), /*#__PURE__*/React.createElement("span", {
      className: "apn-opt-name"
    }, name), /*#__PURE__*/React.createElement("span", {
      className: "apn-opt-count"
    }, "(", followers, " followers)"));
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-hr"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-sec-title"
  }, "Membership Tiers"), /*#__PURE__*/React.createElement("div", {
    className: "apn-sec-sub"
  }, "Optionally filter by membership tier"), APN_TIERS.map(([name, followers]) => {
    const on = allUsers || !!tiers[name];
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: name,
      className: "apn-opt-row",
      onClick: () => toggleTier(name)
    }, /*#__PURE__*/React.createElement(APNCheck, {
      on: on
    }), /*#__PURE__*/React.createElement("span", {
      className: "apn-opt-name"
    }, name), /*#__PURE__*/React.createElement("span", {
      className: "apn-opt-count"
    }, "(", followers, " followers)"));
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-hr"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-locked",
    style: {
      opacity: allUsers ? 0.5 : 1,
      pointerEvents: allUsers ? "none" : "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-sec-title"
  }, "Course Enrollment"), /*#__PURE__*/React.createElement("div", {
    className: "apn-sec-sub",
    style: {
      marginBottom: 0
    }
  }, "Target users enrolled in specific courses")), selectedCourseCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "apn-audience-badge"
  }, selectedCourseCount, " selected")), /*#__PURE__*/React.createElement("div", {
    className: "apn-search-input-wrap",
    style: {
      margin: "14px 0 10px"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search courses...",
    value: courseQuery,
    onChange: e => setCourseQuery(e.target.value),
    style: {
      height: 48,
      paddingLeft: 44
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-course-list"
  }, filteredCourses.map(c => {
    const on = !!courses[c.id];
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: c.id,
      className: "apn-course-row" + (on ? " is-on" : ""),
      onClick: () => toggleCourse(c.id)
    }, /*#__PURE__*/React.createElement(APNCheck, {
      on: on
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flex: 1,
        minWidth: 0,
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:graduation-cap"
    }), /*#__PURE__*/React.createElement("span", {
      className: "apn-course-name"
    }, c.name), /*#__PURE__*/React.createElement("span", {
      className: "apn-course-cat"
    }, c.cat)), /*#__PURE__*/React.createElement("span", {
      className: "apn-course-enrolled"
    }, c.enrolled.toLocaleString(), " enrolled"));
  })), allUsers && /*#__PURE__*/React.createElement("div", {
    className: "apn-locked-hint"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:lock"
  }), "Disabled while All Users is selected.")), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark apn-btn-lg",
    type: "button",
    onClick: goList
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy apn-btn-lg",
    type: "button",
    onClick: next
  }, "Next: Notification Details", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-right"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col apn-wizard-col-sticky"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-est-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-est-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-est-kicker"
  }, "ESTIMATED AUDIENCE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-est-num"
  }, recipCount), /*#__PURE__*/React.createElement("div", {
    className: "apn-est-caption"
  }, recipCaption)), /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title",
    style: {
      marginBottom: 18
    }
  }, "Selection Summary"), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-label"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:radio"
  }), "Channels"), /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-val"
  }, channelCount)), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-label"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:layers"
  }), "Membership Tiers"), /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-val"
  }, tierCount)), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-label"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:graduation-cap"
  }), "Courses"), /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-val"
  }, selectedCourseCount))), /*#__PURE__*/React.createElement("div", {
    className: "apn-hint-box"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:info"
  }), /*#__PURE__*/React.createElement("span", null, "Overlapping members across channels, tiers, and courses are counted once. Selecting ", /*#__PURE__*/React.createElement("strong", null, "All Users"), " overrides every filter."))));
}
function APNStepDetails({
  draft,
  setDraft,
  back,
  next
}) {
  const {
    title,
    body,
    deepLink,
    btnLabel,
    btnUrl,
    platforms,
    sendNow,
    schedDate,
    schedTime
  } = draft;
  const set = patch => setDraft(st => ({
    ...st,
    ...patch
  }));
  const togglePlatform = key => setDraft(st => ({
    ...st,
    platforms: {
      ...st.platforms,
      [key]: !st.platforms[key]
    }
  }));
  const previewTitle = title || "Notification title";
  const previewBody = body || "Your notification message will appear here.";
  const schedSummary = useMemoAPN(() => {
    if (!schedDate || !schedTime) return "";
    const dt = new Date(schedDate + "T" + schedTime);
    if (isNaN(dt)) return "";
    return dt.toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }, [schedDate, schedTime]);
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title"
  }, "Notification Details"), /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Notification Title *"), /*#__PURE__*/React.createElement("input", {
    className: "apn-input",
    style: {
      marginBottom: 22
    },
    value: title,
    onChange: e => set({
      title: e.target.value
    }),
    placeholder: "Enter a short, punchy title"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-field-head"
  }, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label",
    style: {
      marginBottom: 0
    }
  }, "Message Body *"), /*#__PURE__*/React.createElement("span", {
    className: "apn-charcount"
  }, body.length, "/160")), /*#__PURE__*/React.createElement("textarea", {
    className: "apn-textarea",
    style: {
      marginBottom: 22
    },
    maxLength: 160,
    value: body,
    onChange: e => set({
      body: e.target.value
    })
  }), /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Notification Icon"), /*#__PURE__*/React.createElement(APNIconLocked, null), /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label",
    style: {
      marginTop: 22
    }
  }, "Deep Link URL"), /*#__PURE__*/React.createElement("input", {
    className: "apn-input",
    style: {
      marginBottom: 22
    },
    value: deepLink,
    onChange: e => set({
      deepLink: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "apn-form-row2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Button Label (Optional)"), /*#__PURE__*/React.createElement("input", {
    className: "apn-input",
    value: btnLabel,
    onChange: e => set({
      btnLabel: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Button URL"), /*#__PURE__*/React.createElement("input", {
    className: "apn-input",
    value: btnUrl,
    onChange: e => set({
      btnUrl: e.target.value
    })
  })))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title"
  }, "Targeting"), /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label",
    style: {
      marginBottom: 12
    }
  }, "Platform"), /*#__PURE__*/React.createElement("div", {
    className: "apn-platform-row"
  }, APN_PLATFORMS.map(p => {
    const on = !!platforms[p.key];
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: p.key,
      className: "apn-platform-opt",
      onClick: () => togglePlatform(p.key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "apn-check",
      style: {
        borderColor: "#CE9957",
        background: on ? "var(--brand-gold)" : "var(--white)"
      }
    }, on && /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:check"
    })), /*#__PURE__*/React.createElement("span", {
      className: "apn-opt-label"
    }, p.label));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title"
  }, "Scheduling"), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-title"
  }, "Send Immediately"), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-sub"
  }, "Notification will be sent to all users as soon as you hit send.")), /*#__PURE__*/React.createElement(APNToggle, {
    on: sendNow,
    onClick: () => set({
      sendNow: !sendNow
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-sched-body",
    style: {
      opacity: sendNow ? 0.45 : 1
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Schedule for later"), /*#__PURE__*/React.createElement("div", {
    className: "apn-form-row2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap apn-select-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar"
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "apn-input",
    style: {
      paddingLeft: 44
    },
    value: schedDate,
    onChange: e => set({
      schedDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap apn-select-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock"
  }), /*#__PURE__*/React.createElement("input", {
    type: "time",
    className: "apn-input",
    style: {
      paddingLeft: 44
    },
    value: schedTime,
    onChange: e => set({
      schedTime: e.target.value
    })
  }))), schedSummary && !sendNow && /*#__PURE__*/React.createElement("div", {
    className: "apn-sched-summary"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar-check"
  }), "Scheduled for ", schedSummary)))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col apn-wizard-col-sticky"
  }, /*#__PURE__*/React.createElement(APNLivePreviewCard, {
    title: previewTitle,
    body: previewBody
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-nav",
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark apn-btn-lg",
    type: "button",
    onClick: back
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), "Back: Select Audience"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy apn-btn-lg",
    type: "button",
    onClick: next
  }, "Next: Review & Send", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-right"
  }))));
}
function APNStepReview({
  draft,
  audience,
  back,
  send
}) {
  const previewTitle = draft.title || "Notification title";
  const previewBody = draft.body || "Your notification message will appear here.";
  const recipCount = useMemoAPN(() => {
    if (audience.allUsers) return "12,480";
    const chSum = APN_CHANNELS.filter(([n]) => audience.channels[n]).reduce((a, [, f]) => a + f, 0);
    const trSum = APN_TIERS.filter(([n]) => audience.tiers[n]).reduce((a, [, f]) => a + f, 0);
    const crSum = APN_COURSES.filter(c => audience.courses[c.id]).reduce((a, c) => a + c.enrolled, 0);
    return (chSum + trSum + crSum).toLocaleString();
  }, [audience]);
  const recipCaption = useMemoAPN(() => {
    if (audience.allUsers) return "All registered users";
    const ch = APN_CHANNELS.filter(([n]) => audience.channels[n]).length;
    const tr = APN_TIERS.filter(([n]) => audience.tiers[n]).length;
    const cr = Object.values(audience.courses).filter(Boolean).length;
    const parts = [];
    if (ch) parts.push(ch + " channel" + (ch === 1 ? "" : "s"));
    if (tr) parts.push(tr + " tier" + (tr === 1 ? "" : "s"));
    if (cr) parts.push(cr + " course" + (cr === 1 ? "" : "s"));
    return parts.length ? parts.join(" + ") + " (duplicate users removed)" : "No audience selected";
  }, [audience]);
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card apn-card-lg"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "apn-wizard-h2",
    style: {
      marginBottom: 6
    }
  }, "Review & Send"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 28px",
      fontSize: 15,
      color: "var(--gray-500)"
    }
  }, "Confirm everything looks right before sending your notification."), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner",
    style: {
      background: "var(--success-bg)",
      border: "1px solid #b8e6c8",
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:circle-check-big",
    style: {
      fontSize: 24,
      color: "var(--success)"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: "var(--gray-900)"
    }
  }, "Ready to send"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--gray-600)"
    }
  }, "All required fields are complete and validated."))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-default)",
      borderRadius: 16,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16,
      padding: "20px 24px",
      borderBottom: "1px solid var(--gray-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "MESSAGE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: "var(--gray-900)",
      marginBottom: 3
    }
  }, previewTitle), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--gray-600)",
      lineHeight: 1.5
    }
  }, previewBody)), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      back();
    },
    style: {
      fontSize: 14,
      fontWeight: 600,
      whiteSpace: "nowrap",
      flexShrink: 0
    }
  }, "Edit")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "AUDIENCE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val",
    style: {
      color: "var(--brand-navy)"
    }
  }, recipCount, " recipients"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--gray-500)",
      marginTop: 2
    }
  }, recipCaption)), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "PLATFORM"), /*#__PURE__*/React.createElement("div", {
    className: "apn-pill-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-pill"
  }, "iOS"), /*#__PURE__*/React.createElement("span", {
    className: "apn-pill"
  }, "Android"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "DELIVERY"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "Send immediately")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "EST. OPENS"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "~40,000 opens")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark apn-btn-lg",
    type: "button",
    onClick: back
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), "Back: Notification Details"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy apn-btn-lg",
    type: "button",
    onClick: send
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:send"
  }), "Send Notification"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col apn-wizard-col-sticky"
  }, /*#__PURE__*/React.createElement(APNLivePreviewCard, {
    title: previewTitle,
    body: previewBody
  })));
}
const APN_EMPTY_DRAFT = () => ({
  title: "Weekly Rewards are here!",
  body: "Your weekly rewards have been calculated. Open the app to claim your bonuses before they expire.",
  deepLink: "profinity://rewards/claim",
  btnLabel: "Claim Now",
  btnUrl: "profinity://rewards/claim",
  platforms: {
    ios: true,
    android: true,
    web: false
  },
  sendNow: false,
  schedDate: "2024-10-24",
  schedTime: "10:00"
});
const APN_EMPTY_AUDIENCE = () => ({
  allUsers: false,
  channels: {
    Confidence: true,
    Mastery: true,
    "Freedom Path": true
  },
  tiers: {},
  courses: {},
  courseQuery: ""
});
function APNCreateView({
  createStep,
  setCreateStep,
  draft,
  setDraft,
  audience,
  setAudience,
  goList,
  commit
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-page-head-sm"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-sq",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left",
    style: {
      color: "var(--brand-navy)"
    }
  })), /*#__PURE__*/React.createElement("h1", null, "Create Push Notification")), /*#__PURE__*/React.createElement("div", {
    className: "apn-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark",
    type: "button",
    onClick: () => commit("Draft")
  }, "Save Draft"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn",
    type: "button",
    disabled: createStep !== 3,
    onClick: () => createStep === 3 && commit("Sent"),
    style: {
      background: createStep === 3 ? "var(--brand-navy)" : "var(--gray-200)",
      color: createStep === 3 ? "#fff" : "var(--gray-400)",
      cursor: createStep === 3 ? "pointer" : "not-allowed"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:send"
  }), "Send Now"))), /*#__PURE__*/React.createElement(APNStepper, {
    step: createStep
  }), createStep === 1 && /*#__PURE__*/React.createElement(APNStepAudience, {
    audience: audience,
    setAudience: setAudience,
    goList: goList,
    next: () => setCreateStep(2)
  }), createStep === 2 && /*#__PURE__*/React.createElement(APNStepDetails, {
    draft: draft,
    setDraft: setDraft,
    back: () => setCreateStep(1),
    next: () => setCreateStep(3)
  }), createStep === 3 && /*#__PURE__*/React.createElement(APNStepReview, {
    draft: draft,
    audience: audience,
    back: () => setCreateStep(2),
    send: () => commit("Sent")
  }));
}

/* ------------------------------------------------------------- schedule */
function APNScheduleView({
  goList,
  goCreate
}) {
  const [deliveryMode, setDeliveryMode] = useStateAPN("once");
  const [days, setDays] = useStateAPN({
    Wed: true,
    Fri: true
  });
  const [endCondition, setEndCondition] = useStateAPN("after");
  const [smartDelivery, setSmartDelivery] = useStateAPN(true);
  const [rateLimiting, setRateLimiting] = useStateAPN(false);
  const [quietHours, setQuietHours] = useStateAPN(true);
  const [respectTz, setRespectTz] = useStateAPN(true);
  const onceActive = deliveryMode === "once";
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-page-head-sm"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-sq",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left",
    style: {
      color: "var(--brand-navy)"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Schedule Push Notification"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      fontSize: 15,
      color: "var(--gray-500)"
    }
  }, "Set up your notification delivery time and recurrence"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark",
    type: "button",
    onClick: goList
  }, "Save Draft"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy",
    type: "button",
    onClick: goList
  }, "Save Schedule"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-banner-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-kicker"
  }, "NOTIFICATION SUMMARY"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "apn-summary-edit",
    onClick: e => {
      e.preventDefault();
      goCreate();
    }
  }, "Edit Notification")), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-title"
  }, "Flash Sale Alert"), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-desc"
  }, "Don't miss our biggest sale of the year! Up to 70% off selected items."), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-meta"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-meta-label"
  }, "Platform"), /*#__PURE__*/React.createElement("div", {
    className: "apn-pill-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-pill"
  }, "iOS"), /*#__PURE__*/React.createElement("span", {
    className: "apn-pill"
  }, "Android"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-meta-label"
  }, "Audience"), /*#__PURE__*/React.createElement("div", {
    className: "apn-meta-value"
  }, "All Users")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title",
    style: {
      marginBottom: 18,
      border: "none",
      paddingBottom: 0
    }
  }, "Delivery Schedule"), /*#__PURE__*/React.createElement("div", {
    className: "apn-delivery-cards"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-delivery-card" + (onceActive ? " is-active" : ""),
    onClick: () => setDeliveryMode("once")
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-delivery-icon" + (onceActive ? " is-active" : "")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar"
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-delivery-title"
  }, "Send Once"), /*#__PURE__*/React.createElement("div", {
    className: "apn-delivery-sub"
  }, "One-time delivery")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-delivery-card" + (!onceActive ? " is-active" : ""),
    onClick: () => setDeliveryMode("recurring")
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-delivery-icon" + (!onceActive ? " is-active" : "")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-delivery-title"
  }, "Recurring"), /*#__PURE__*/React.createElement("div", {
    className: "apn-delivery-sub"
  }, "Repeating delivery"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-form-row2",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Scheduled Date"), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap apn-select-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar",
    style: {
      color: "var(--gray-500)"
    }
  }), /*#__PURE__*/React.createElement("select", {
    className: "apn-select",
    style: {
      paddingLeft: 42,
      fontWeight: 400,
      color: "var(--gray-800)"
    }
  }, /*#__PURE__*/React.createElement("option", null, "Oct 28, 2024"), /*#__PURE__*/React.createElement("option", null, "Oct 29, 2024"), /*#__PURE__*/React.createElement("option", null, "Oct 30, 2024")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Scheduled Time"), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap apn-select-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock",
    style: {
      color: "var(--gray-500)"
    }
  }), /*#__PURE__*/React.createElement("select", {
    className: "apn-select",
    style: {
      paddingLeft: 42,
      fontWeight: 400,
      color: "var(--gray-800)"
    }
  }, /*#__PURE__*/React.createElement("option", null, "10:00 AM"), /*#__PURE__*/React.createElement("option", null, "11:00 AM"), /*#__PURE__*/React.createElement("option", null, "12:00 PM")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Timezone"), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap"
  }, /*#__PURE__*/React.createElement("select", {
    className: "apn-select",
    style: {
      fontWeight: 400,
      color: "var(--gray-800)"
    }
  }, /*#__PURE__*/React.createElement("option", null, "Pacific Standard Time (PST)"), /*#__PURE__*/React.createElement("option", null, "Eastern Standard Time (EST)"), /*#__PURE__*/React.createElement("option", null, "Greenwich Mean Time (GMT)")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card",
    style: {
      opacity: onceActive ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-recurrence-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title",
    style: {
      margin: 0,
      border: "none",
      padding: 0
    }
  }, "Recurrence Settings"), onceActive && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:lock"
  })), /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Repeat"), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap",
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("select", {
    className: "apn-select",
    style: {
      fontWeight: 400,
      color: "var(--gray-800)"
    }
  }, /*#__PURE__*/React.createElement("option", null, "Daily"), /*#__PURE__*/React.createElement("option", null, "Weekly"), /*#__PURE__*/React.createElement("option", null, "Monthly")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label",
    style: {
      marginBottom: 12
    }
  }, "End Condition"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-endcond-row",
    onClick: () => setEndCondition("never")
  }, /*#__PURE__*/React.createElement(APNRadio, {
    on: endCondition === "never",
    large: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-endcond-label"
  }, "Never")), /*#__PURE__*/React.createElement("div", {
    className: "apn-endcond-row",
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(APNRadio, {
    on: endCondition === "after",
    large: true,
    onClick: () => setEndCondition("after")
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-endcond-label"
  }, "After"), /*#__PURE__*/React.createElement("input", {
    className: "apn-endcond-input",
    defaultValue: "10"
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-endcond-label"
  }, "occurrences")), /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label",
    style: {
      marginBottom: 12
    }
  }, "Days of Week"), /*#__PURE__*/React.createElement("div", {
    className: "apn-days-row"
  }, DAYS.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    type: "button",
    className: "apn-daypill" + (days[d] ? " is-on" : ""),
    onClick: () => apnToggleMap(setDays, d)
  }, d)))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title",
    style: {
      marginBottom: 20,
      border: "none",
      padding: 0
    }
  }, "Delivery Optimization"), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row",
    style: {
      paddingBottom: 20,
      borderBottom: "1px solid var(--gray-100)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-title"
  }, "Smart Delivery"), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-sub"
  }, "Send at the optimal time based on each user's activity pattern")), /*#__PURE__*/React.createElement(APNToggle, {
    on: smartDelivery,
    onClick: () => setSmartDelivery(v => !v)
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row",
    style: {
      padding: "20px 0",
      borderBottom: "1px solid var(--gray-100)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-title"
  }, "Rate Limiting"), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-sub"
  }, "Limit to 1 notification per user per day")), /*#__PURE__*/React.createElement(APNToggle, {
    on: rateLimiting,
    onClick: () => setRateLimiting(v => !v)
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row",
    style: {
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-title"
  }, "Throttle Rate"), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-sub"
  }, "Max notifications per hour")), /*#__PURE__*/React.createElement("input", {
    className: "apn-endcond-input",
    style: {
      width: 120,
      height: 46,
      fontWeight: 700,
      color: "var(--gray-900)"
    },
    defaultValue: "5,000"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card-title",
    style: {
      marginBottom: 20,
      border: "none",
      padding: 0
    }
  }, "Quiet Hours"), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row",
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-title"
  }, "Enable Quiet Hours"), /*#__PURE__*/React.createElement("div", {
    className: "apn-toggle-row-sub"
  }, "Prevent notifications from sending during specified times")), /*#__PURE__*/React.createElement(APNToggle, {
    on: quietHours,
    onClick: () => setQuietHours(v => !v)
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-form-row2",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "From"), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap apn-select-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock",
    style: {
      color: "var(--gray-500)"
    }
  }), /*#__PURE__*/React.createElement("select", {
    className: "apn-select",
    style: {
      paddingLeft: 42,
      fontWeight: 400,
      color: "var(--gray-800)"
    }
  }, /*#__PURE__*/React.createElement("option", null, "10:00 PM"), /*#__PURE__*/React.createElement("option", null, "11:00 PM"), /*#__PURE__*/React.createElement("option", null, "09:00 PM")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "To"), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap apn-select-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock",
    style: {
      color: "var(--gray-500)"
    }
  }), /*#__PURE__*/React.createElement("select", {
    className: "apn-select",
    style: {
      paddingLeft: 42,
      fontWeight: 400,
      color: "var(--gray-800)"
    }
  }, /*#__PURE__*/React.createElement("option", null, "08:00 AM"), /*#__PURE__*/React.createElement("option", null, "07:00 AM"), /*#__PURE__*/React.createElement("option", null, "09:00 AM")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-endcond-row",
    style: {
      marginBottom: 0
    },
    onClick: () => setRespectTz(v => !v)
  }, /*#__PURE__*/React.createElement(APNCheck, {
    on: respectTz
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-endcond-label"
  }, "Respect user's local timezone")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: "var(--brand-navy)",
      marginBottom: 8
    }
  }, "Schedule Preview"), APN_SCHEDULE_ROWS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "apn-schedprev-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-schedprev-dot",
    style: {
      background: i === 0 ? "var(--ai-purple)" : "var(--white)",
      border: i === 0 ? "none" : "2px solid var(--gray-300)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-schedprev-date"
  }, s.date), /*#__PURE__*/React.createElement("div", {
    className: "apn-schedprev-time"
  }, s.time)), s.next && /*#__PURE__*/React.createElement("span", {
    className: "apn-schedprev-next"
  }, "NEXT")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: "var(--brand-navy)",
      marginBottom: 2
    }
  }, "Estimated Reach"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--gray-500)",
      marginBottom: 16
    }
  }, "Based on current audience segment"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-reach-num"
  }, "124,500"), /*#__PURE__*/React.createElement("span", {
    className: "apn-reach-unit"
  }, "users")), /*#__PURE__*/React.createElement("div", {
    className: "apn-reach-stats"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-reach-stat-label"
  }, "AVG OPEN RATE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-reach-stat-val",
    style: {
      color: "var(--success)"
    }
  }, "22.7%")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-reach-stat-label"
  }, "BEST SEND TIME"), /*#__PURE__*/React.createElement("div", {
    className: "apn-reach-stat-val"
  }, "10:00–11:00 AM"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-reach-stat-label",
    style: {
      marginBottom: 10
    }
  }, "OPEN RATE BY HOUR"), /*#__PURE__*/React.createElement("div", {
    className: "apn-reach-bars"
  }, APN_REACH_BARS.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "apn-reach-bar" + (h === 100 ? " is-peak" : ""),
    style: {
      height: h + "%",
      animationDelay: (0.04 + i * 0.05).toFixed(2) + "s"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:triangle-alert",
    style: {
      fontSize: 20,
      color: "var(--warning)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: "var(--gray-900)"
    }
  }, "Scheduling Conflicts")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--gray-600)",
      lineHeight: 1.5,
      marginBottom: 18
    }
  }, "2 other notifications scheduled within 24 hours of your selected time"), /*#__PURE__*/React.createElement("div", {
    className: "apn-conflict-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: "var(--gray-900)"
    }
  }, "App Maintenance"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--gray-500)",
      marginTop: 2
    }
  }, "Oct 28, 12:00 AM")), /*#__PURE__*/React.createElement("span", {
    className: "apn-conflict-tag"
  }, "CONFLICT")), /*#__PURE__*/React.createElement("div", {
    className: "apn-conflict-row",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: "var(--gray-900)"
    }
  }, "Weekly Rewards"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--gray-500)",
      marginTop: 2
    }
  }, "Oct 28, 9:00 AM")), /*#__PURE__*/React.createElement("span", {
    className: "apn-conflict-tag"
  }, "CONFLICT")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "View all scheduled")))));
}

/* ------------------------------------------------------------- tracking */
function APNTrackingView({
  goList,
  goCreate
}) {
  const [dispatch, setDispatch] = useStateAPN("running");
  const meta = {
    running: {
      label: "Sending now...",
      dot: "var(--ai-purple)",
      anim: "apnPulse 1.4s ease-in-out infinite",
      icon: "lucide:rocket",
      badge: "LIVE TRACKING",
      badgeColor: "var(--ai-purple)",
      badgeBg: "var(--ai-purple-100)"
    },
    stopped: {
      label: "Dispatch stopped",
      dot: "var(--error)",
      anim: "none",
      icon: "lucide:octagon-x",
      badge: "STOPPED",
      badgeColor: "var(--error)",
      badgeBg: "var(--error-bg)"
    }
  }[dispatch];
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-view apn-view-narrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-sq",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left",
    style: {
      color: "var(--brand-navy)"
    }
  })), /*#__PURE__*/React.createElement("h1", null, "Dispatch Progress Tracking")), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-banner-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-kicker"
  }, "NOTIFICATION SUMMARY"), /*#__PURE__*/React.createElement("span", {
    className: "apn-summary-edit",
    onClick: goCreate
  }, "Edit Notification")), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-title"
  }, "Flash Sale Alert"), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-desc"
  }, "Don't miss our biggest sale of the year! Up to 70% off selected items."), /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-meta"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-meta-label"
  }, "Platform"), /*#__PURE__*/React.createElement("div", {
    className: "apn-pill-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-pill"
  }, "iOS"), /*#__PURE__*/React.createElement("span", {
    className: "apn-pill"
  }, "Android"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apn-summary-meta-label"
  }, "Audience"), /*#__PURE__*/React.createElement("div", {
    className: "apn-meta-value"
  }, "All Users")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-tracking-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-dispatch-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-dispatch-dot",
    style: {
      background: meta.dot,
      animation: meta.anim
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-dispatch-title"
  }, meta.label), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: meta.icon,
    style: {
      fontSize: 24,
      color: meta.dot
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-dispatch-sub"
  }, "BATCH ID: batch_8b2d1f\xA0\xA0\xA0\xA0Started at 2:14:08 PM PST")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-stop-btn",
    type: "button",
    disabled: dispatch === "stopped",
    onClick: () => setDispatch("stopped")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:square"
  }), "Stop"), /*#__PURE__*/React.createElement("span", {
    className: "apn-dispatch-badge",
    style: {
      color: meta.badgeColor,
      background: meta.badgeBg
    }
  }, meta.badge))), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-kicker"
  }, "TOTAL RECIPIENTS"), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-num",
    style: {
      color: "var(--gray-900)"
    }
  }, "628")), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-kicker"
  }, "DELIVERY RATE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-num",
    style: {
      color: "var(--brand-navy)",
      marginBottom: 14
    }
  }, "89%"), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-bar-fill",
    style: {
      width: "89%"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-kicker"
  }, "SENT"), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-num",
    style: {
      color: "var(--gray-900)"
    }
  }, "559"), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-sub"
  }, "~500/sec")), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-kicker"
  }, "FAILED"), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-num",
    style: {
      color: "var(--error)"
    }
  }, "14"), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-sub"
  }, "Retrying...")), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-tile span2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-head-flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-kicker"
  }, "CLICKS"), /*#__PURE__*/React.createElement("span", {
    className: "apn-ctr-tag"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mouse-pointer-click"
  }), "21.4% CTR")), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-num",
    style: {
      color: "var(--brand-navy)"
    }
  }, "120"), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-sub"
  }, "Taps on the notification so far"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-eta-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-eta-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-eta-label"
  }, "Estimated completion"), /*#__PURE__*/React.createElement("span", {
    className: "apn-eta-val"
  }, "~45 seconds")), /*#__PURE__*/React.createElement("div", {
    className: "apn-eta-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-bar-fill",
    style: {
      width: "55%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-eta-sub"
  }, "22 seconds elapsed • ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "var(--gray-800)"
    }
  }, "55 queued"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-provider-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-provider-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-provider-kicker"
  }, "FIREBASE (ANDROID)"), /*#__PURE__*/React.createElement("div", {
    className: "apn-provider-val"
  }, "289 sent")), /*#__PURE__*/React.createElement("div", {
    className: "apn-provider-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-provider-kicker"
  }, "APNS (IOS)"), /*#__PURE__*/React.createElement("div", {
    className: "apn-provider-val"
  }, "270 sent")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-log"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-log-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-log-title"
  }, "RECENT DELIVERY LOG"), /*#__PURE__*/React.createElement("span", {
    className: "apn-log-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-log-status-dot"
  }), "CONNECTED")), /*#__PURE__*/React.createElement("div", {
    className: "apn-log-lines"
  }, APN_LOG_LINES.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "apn-log-line" + (l.ok ? "" : " is-fail")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: l.ok ? "lucide:check" : "lucide:circle-x",
    style: {
      color: l.ok ? "#34d399" : "#f87171"
    }
  }), /*#__PURE__*/React.createElement("span", null, "[", l.time, "]\xA0\xA0", l.text))))), /*#__PURE__*/React.createElement("div", {
    className: "apn-tracking-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-ghost",
    type: "button"
  }, "View Notification Details"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy",
    type: "button",
    onClick: goList
  }, "Go to Notification List")));
}

/* --------------------------------------------------------------- detail */
function APNScheduledDetailView({
  row,
  goList,
  goCreate
}) {
  const r = row || {
    title: "Limited Time Offer",
    desc: "Get 20% off on your next subscription renewal.",
    audience: "Free Tier",
    scheduled: "Oct 30, 09:00 AM"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-view apn-view-narrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-sq",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left",
    style: {
      color: "var(--brand-navy)"
    }
  })), /*#__PURE__*/React.createElement("h1", null, "Notification Details"), /*#__PURE__*/React.createElement("span", {
    className: "apn-detail-badge",
    style: {
      background: "var(--info-bg)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-detail-badge-dot",
    style: {
      background: "var(--info)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-badge-text",
    style: {
      color: "var(--info)"
    }
  }, "Scheduled"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner",
    style: {
      background: "var(--info-bg)",
      border: "1.5px solid #b9d4f2"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-detail-banner-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock",
    style: {
      color: "var(--info)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner-kicker"
  }, "SCHEDULED TO SEND"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner-title"
  }, r.scheduled)), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner-side",
    style: {
      color: "var(--info)"
    }
  }, "Not sent yet")), /*#__PURE__*/React.createElement("div", {
    className: "apn-card apn-card-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-kicker"
  }, "MESSAGE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-title"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-body"
  }, r.desc), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "AUDIENCE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, r.audience)), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "PLATFORM"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "iOS & Android")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "EST. RECIPIENTS"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "86,400")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "TIME ZONE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "Recipient local time")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark",
    type: "button",
    onClick: goCreate
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Edit Schedule"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:send"
  }), "Send Now Instead"), /*#__PURE__*/React.createElement("div", {
    className: "apn-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-danger",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar-x"
  }), "Cancel Schedule"))), /*#__PURE__*/React.createElement(APNSimplePreviewCard, {
    title: r.title,
    body: r.desc
  })));
}
function APNDraftDetailView({
  row,
  goCreate,
  goSchedule,
  goList
}) {
  const r = row || {
    title: "Abandoned Cart Reminder",
    desc: "You left items in your cart! Complete your order.",
    audience: "Premium"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-view apn-view-narrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-sq",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left",
    style: {
      color: "var(--brand-navy)"
    }
  })), /*#__PURE__*/React.createElement("h1", null, "Notification Details"), /*#__PURE__*/React.createElement("span", {
    className: "apn-detail-badge",
    style: {
      background: "var(--gray-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-detail-badge-dot",
    style: {
      background: "var(--gray-500)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-badge-text",
    style: {
      color: "var(--gray-500)"
    }
  }, "Draft"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner",
    style: {
      background: "var(--gray-50)",
      border: "1.5px dashed var(--border-strong)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-detail-banner-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:file-pen-line",
    style: {
      color: "var(--gray-500)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner-kicker"
  }, "DRAFT — NOT SCHEDULED"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner-title"
  }, "This notification hasn't been scheduled or sent"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card apn-card-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-kicker"
  }, "MESSAGE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-title"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-body"
  }, r.desc), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "AUDIENCE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, r.audience)), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "PLATFORM"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "iOS & Android")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "SCHEDULE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val",
    style: {
      color: "var(--gray-500)"
    }
  }, "Not set")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "LAST EDITED"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "Oct 22, 3:42 PM")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy",
    type: "button",
    onClick: goCreate
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Continue Editing"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark",
    type: "button",
    onClick: goSchedule
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar-clock"
  }), "Schedule"), /*#__PURE__*/React.createElement("div", {
    className: "apn-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-danger",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trash-2"
  }), "Delete Draft"))), /*#__PURE__*/React.createElement(APNSimplePreviewCard, {
    title: r.title,
    body: r.desc
  })));
}
function APNCompletedDetailView({
  row,
  openResend,
  goCreate,
  goList
}) {
  const r = row || {
    title: "Welcome to Version 2.0!",
    desc: "Explore our latest features and improvements.",
    audience: "All Users",
    scheduled: "Oct 24, 10:30 AM",
    delivered: "98%",
    opened: "22%"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-view apn-view-narrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-sq",
    type: "button",
    onClick: goList
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left",
    style: {
      color: "var(--brand-navy)"
    }
  })), /*#__PURE__*/React.createElement("h1", null, "Notification Details"), /*#__PURE__*/React.createElement("span", {
    className: "apn-detail-badge",
    style: {
      background: "var(--ai-purple-100)"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle-2",
    style: {
      fontSize: 15,
      color: "var(--brand-navy)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-badge-text",
    style: {
      color: "var(--brand-navy)"
    }
  }, "Completed"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-wizard-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner",
    style: {
      background: "var(--success-bg)",
      border: "1.5px solid #b8e6c8"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apn-detail-banner-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle-2",
    style: {
      color: "var(--success)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner-kicker"
  }, "DELIVERY COMPLETED"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner-title"
  }, "Sent ", r.scheduled)), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-banner-side",
    style: {
      color: "var(--success)"
    }
  }, "All batches delivered")), /*#__PURE__*/React.createElement("div", {
    className: "apn-stat-grid apn-detail-grid-3",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-kicker"
  }, "TOTAL SENT"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-val",
    style: {
      color: "var(--gray-900)"
    }
  }, "124,500")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-kicker"
  }, "DELIVERED"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-val",
    style: {
      color: "var(--success)"
    }
  }, r.delivered)), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-kicker"
  }, "OPEN RATE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-stat-val",
    style: {
      color: "var(--brand-navy)"
    }
  }, r.opened))), /*#__PURE__*/React.createElement("div", {
    className: "apn-card apn-card-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-kicker"
  }, "MESSAGE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-title"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-msg-body"
  }, r.desc), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "AUDIENCE"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, r.audience)), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "PLATFORM"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "iOS & Android")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "CLICKS"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "5,229")), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-kicker"
  }, "FAILED"), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-cell-val"
  }, "1,240")))), /*#__PURE__*/React.createElement("div", {
    className: "apn-detail-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy",
    type: "button",
    onClick: openResend
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  }), "Resend"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark",
    type: "button",
    onClick: goCreate
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:copy"
  }), "Duplicate"), /*#__PURE__*/React.createElement("div", {
    className: "apn-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:download"
  }), "Export Report"))), /*#__PURE__*/React.createElement(APNSimplePreviewCard, {
    title: r.title,
    body: r.desc
  })));
}

/* --------------------------------------------------------------- modal */
function APNResendModal({
  onClose
}) {
  const [audienceMode, setAudienceMode] = useStateAPN("same");
  const [segment, setSegment] = useStateAPN("Power Users");
  const [plat, setPlat] = useStateAPN({
    ios: true,
    android: true,
    web: false
  });
  const isNew = audienceMode === "new";
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-modal-badge"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  })), /*#__PURE__*/React.createElement("button", {
    className: "apn-modal-close",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  })), /*#__PURE__*/React.createElement("h2", null, "Resend Notification?"), /*#__PURE__*/React.createElement("p", {
    className: "apn-modal-sub"
  }, "You are about to resend this notification to the original audience."), /*#__PURE__*/React.createElement("div", {
    className: "apn-modal-preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apn-modal-preview-title"
  }, "Flash Sale Alert"), /*#__PURE__*/React.createElement("div", {
    className: "apn-modal-preview-body"
  }, "Your weekly rewards have been calculated. Open the app to claim your bonuses before they expire."), /*#__PURE__*/React.createElement("div", {
    className: "apn-modal-preview-meta"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  }), "All Users • iOS & Android")), /*#__PURE__*/React.createElement("div", {
    className: "apn-modal-h3"
  }, "Target Audience"), /*#__PURE__*/React.createElement("div", {
    className: "apn-audience-cards"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-audience-card" + (audienceMode === "same" ? " is-on" : ""),
    onClick: () => setAudienceMode("same")
  }, /*#__PURE__*/React.createElement(APNRadio, {
    on: audienceMode === "same",
    large: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-audience-card-label"
  }, "Same audience as original")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apn-audience-card" + (isNew ? " is-on" : ""),
    onClick: () => setAudienceMode("new")
  }, /*#__PURE__*/React.createElement(APNRadio, {
    on: isNew,
    large: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "apn-audience-card-label"
  }, "Select new audience"))), isNew && /*#__PURE__*/React.createElement("div", {
    className: "apn-resend-detail"
  }, /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label"
  }, "Audience Segment"), /*#__PURE__*/React.createElement("div", {
    className: "apn-select-wrap",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("select", {
    className: "apn-select",
    style: {
      fontWeight: 400,
      color: "var(--gray-800)"
    },
    value: segment,
    onChange: e => setSegment(e.target.value)
  }, /*#__PURE__*/React.createElement("option", null, "All Users"), /*#__PURE__*/React.createElement("option", null, "Power Users"), /*#__PURE__*/React.createElement("option", null, "Premium members"), /*#__PURE__*/React.createElement("option", null, "Free Tier"), /*#__PURE__*/React.createElement("option", null, "Beta Group")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("label", {
    className: "apn-field-label",
    style: {
      marginBottom: 12
    }
  }, "Platform"), /*#__PURE__*/React.createElement("div", {
    className: "apn-platform-row",
    style: {
      gap: 26,
      marginBottom: 20
    }
  }, APN_PLATFORMS.map(p => {
    const on = !!plat[p.key];
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: p.key,
      className: "apn-platform-opt",
      onClick: () => apnToggleMap(setPlat, p.key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "apn-check",
      style: {
        background: on ? "var(--ai-purple)" : "var(--white)",
        borderColor: on ? "var(--ai-purple)" : "var(--border-strong)"
      }
    }, on && /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:check"
    })), /*#__PURE__*/React.createElement("span", {
      className: "apn-opt-label"
    }, p.label));
  })), /*#__PURE__*/React.createElement("div", {
    className: "apn-resend-reach"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: "var(--gray-600)"
    }
  }, "Estimated reach"), /*#__PURE__*/React.createElement("span", {
    className: "apn-resend-reach-val"
  }, APN_SEGMENT_REACH[segment] || "—", " users"))), /*#__PURE__*/React.createElement("div", {
    className: "apn-modal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-dark apn-btn-lg",
    type: "button",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "apn-btn apn-btn-navy apn-btn-lg",
    type: "button",
    onClick: onClose
  }, "Resend Now"))));
}

/* ---------------------------------------------------------------- root */
function AdminPushNotifications() {
  const [view, setView] = useStateAPN("list");
  const [notifTab, setNotifTab] = useStateAPN("all");
  const [ruleStates, setRuleStates] = useStateAPN({
    1: true,
    2: true,
    3: true,
    4: true
  });
  const [selected, setSelected] = useStateAPN({});
  const [perPage, setPerPage] = useStateAPN("10");
  const [sortBy, setSortBy] = useStateAPN("recent");
  const [sentRows, setSentRows] = useStateAPN([]);
  const [openRowData, setOpenRowData] = useStateAPN(null);
  const [showResend, setShowResend] = useStateAPN(false);
  const [createStep, setCreateStep] = useStateAPN(1);
  const [draft, setDraft] = useStateAPN(APN_EMPTY_DRAFT);
  const [audience, setAudience] = useStateAPN(APN_EMPTY_AUDIENCE);
  const rows = useMemoAPN(() => {
    const raw = [...sentRows, ...APN_BASE_ROWS];
    const sorted = [...raw];
    if (sortBy === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));else if (sortBy === "za") sorted.sort((a, b) => b.title.localeCompare(a.title));else if (sortBy === "status") sorted.sort((a, b) => a.status.localeCompare(b.status));else if (sortBy === "oldest") sorted.sort((a, b) => apnParseDate(a.scheduled) - apnParseDate(b.scheduled));else sorted.sort((a, b) => apnParseDate(b.scheduled) - apnParseDate(a.scheduled));
    return sorted;
  }, [sentRows, sortBy]);
  const goList = () => setView("list");
  const goCreate = () => {
    setCreateStep(1);
    setView("create");
  };
  const goSchedule = () => setView("schedule");
  const openResend = () => setShowResend(true);
  const closeResend = () => setShowResend(false);
  const toggleRule = id => setRuleStates(st => ({
    ...st,
    [id]: !st[id]
  }));
  const openRow = r => {
    setOpenRowData(r);
    if (r.status === "Scheduled") setView("scheduledDetail");else if (r.status === "Draft") setView("draftDetail");else if (r.status === "Completed") setView("completedDetail");else setView("tracking");
  };
  const commit = status => {
    const plats = [];
    if (draft.platforms.ios) plats.push(APN_IOS);
    if (draft.platforms.android) plats.push(APN_ANDROID);
    if (draft.platforms.web) plats.push(APN_WEB);
    if (!plats.length) plats.push(APN_IOS, APN_ANDROID);
    const now = new Date();
    const stamp = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    const row = {
      id: "new-" + APN_BASE_ROWS.length + "-" + sentRows.length,
      title: draft.title || "Untitled notification",
      desc: draft.body || "No message body.",
      platforms: plats,
      audience: audience.allUsers ? "All Users" : "Selected Audience",
      status,
      scheduled: status === "Draft" ? "Not set" : stamp,
      delivered: status === "Sent" ? "100%" : "–",
      opened: status === "Sent" ? "0%" : "–"
    };
    setSentRows(st => [row, ...st]);
    setDraft(APN_EMPTY_DRAFT());
    setAudience(APN_EMPTY_AUDIENCE());
    setCreateStep(1);
    setView("list");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "apn-shell"
  }, /*#__PURE__*/React.createElement(APNSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "apn-main"
  }, /*#__PURE__*/React.createElement(APNHeader, null), view === "list" && /*#__PURE__*/React.createElement(APNListView, {
    rows: rows,
    sortBy: sortBy,
    setSortBy: setSortBy,
    selected: selected,
    setSelected: setSelected,
    perPage: perPage,
    setPerPage: setPerPage,
    goCreate: goCreate,
    openRow: openRow,
    openResend: openResend,
    goSchedule: goSchedule,
    tab: notifTab,
    setTab: setNotifTab,
    ruleStates: ruleStates,
    toggleRule: toggleRule
  }), view === "create" && /*#__PURE__*/React.createElement(APNCreateView, {
    createStep: createStep,
    setCreateStep: setCreateStep,
    draft: draft,
    setDraft: setDraft,
    audience: audience,
    setAudience: setAudience,
    goList: goList,
    commit: commit
  }), view === "schedule" && /*#__PURE__*/React.createElement(APNScheduleView, {
    goList: goList,
    goCreate: goCreate
  }), view === "tracking" && /*#__PURE__*/React.createElement(APNTrackingView, {
    goList: goList,
    goCreate: goCreate
  }), view === "scheduledDetail" && /*#__PURE__*/React.createElement(APNScheduledDetailView, {
    row: openRowData,
    goList: goList,
    goCreate: goCreate
  }), view === "draftDetail" && /*#__PURE__*/React.createElement(APNDraftDetailView, {
    row: openRowData,
    goList: goList,
    goCreate: goCreate,
    goSchedule: goSchedule
  }), view === "completedDetail" && /*#__PURE__*/React.createElement(APNCompletedDetailView, {
    row: openRowData,
    goList: goList,
    goCreate: goCreate,
    openResend: openResend
  })), showResend && /*#__PURE__*/React.createElement(APNResendModal, {
    onClose: closeResend
  }));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AdminPushNotifications, null));