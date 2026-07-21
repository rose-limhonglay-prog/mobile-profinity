/* ===========================================================================
   PROfinity — Community (Confidence channel) · iPhone 17 Pro Max mobile
   Reuses the shared Feed (window.PFApp.Feed) inside the IOSDevice frame, with
   the community top bar, channel header, composer and bottom tab bar. Tapping a
   post's comment opens the slide-up Comments sheet (PF_COMMENT_SHEET).
   Shares one global scope with app.jsx, so names here are suffixed -CM.
   =========================================================================== */
const DSCM = window.ProfinityDesignSystem_c2b5cc;
const PFACM = window.PFApp;
function goCM(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleCM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setCMScale] = React.useState(calc);
  React.useEffect(() => {
    const update = () => setCMScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileCM() {
  const [mobile, setCM] = React.useState(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setCM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
const CM_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: "NewsfeedMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Learning",
  label: "My Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: null
}, {
  key: "Agent",
  label: "Agent",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}];
const SM_RESOURCES_CM = [{
  label: "Videos",
  icon: "lucide:square-play",
  n: 8
}, {
  label: "Articles",
  icon: "lucide:feather",
  n: 4
}, {
  label: "Webinars",
  icon: "lucide:calendar",
  n: 3
}];
const SM_COURSES_CM = [{
  label: "Face Anatomy Masterclass",
  pct: 72
}, {
  label: "Lip Filler Techniques",
  pct: 45
}, {
  label: "Advanced Botox Training",
  pct: 20
}];
const SM_EVENTS_CM = [{
  d: "30",
  m: "JUN",
  label: "Technique Tuesday Webinar",
  t: "8:00 PM",
  tag: "NEW"
}, {
  d: "5",
  m: "JUL",
  label: "Confidence Masterclass",
  t: "6:00 PM"
}, {
  d: "12",
  m: "JUL",
  label: "Business Growth Workshop",
  t: "7:00 PM"
}];
const SM_PROFILE_BEFORE_CM = [{
  label: "Edit Profile",
  icon: "lucide:book-open",
  href: "ProfileMobile.html"
}, {
  label: "Account Settings",
  icon: "lucide:graduation-cap",
  href: null
}, {
  label: "Notifications",
  icon: "lucide:calendar",
  href: "NotificationSettings.html"
}];
const SM_PROFILE_AFTER_CM = [{
  label: "Privacy & Security",
  icon: "lucide:book-open",
  href: null
}, {
  label: "Admin Panel",
  icon: "lucide:shield",
  href: "AdminPanel.html"
}];
function useDarkModeCM() {
  const [dark, setDark] = React.useState(() => {
    try {
      return localStorage.getItem('pf-theme') === 'dark';
    } catch (e) {
      return false;
    }
  });
  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('pf-theme', next ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    } catch (e) {}
  }
  return [dark, toggle];
}
function SmDarkSwitchCM({
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "sm-switch" + (on ? " on" : ""),
    onClick: onToggle,
    role: "switch",
    "aria-checked": on,
    "aria-label": on ? "Switch to light mode" : "Switch to dark mode"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-knob"
  }, on && /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:moon",
    size: 13,
    color: "#1A1736"
  })));
}
function SmDisplayCardCM({
  dark,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-display-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-display-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-display-label"
  }, "Display"), /*#__PURE__*/React.createElement(SmDarkSwitchCM, {
    on: dark,
    onToggle: onToggle
  })), /*#__PURE__*/React.createElement("p", {
    className: "sm-display-desc"
  }, "Adjust the appearance of the app to reduce glare and give your eyes a break"));
}
function SmSectionCM({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, title);
}
function SideMenuCM({
  open,
  onClose
}) {
  const [dark, toggleDark] = useDarkModeCM();
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-profile",
    onClick: () => goCM("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSCM.Avatar, {
    name: PFACM.ME.name,
    src: PFACM.ME.avatar,
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-dp-name"
  }, PFACM.ME.name, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:badge-check",
    size: 18,
    color: "var(--reaction-like)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-role"
  }, PFACM.ME.role)), /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-800)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-body"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sm-upgrade",
    onClick: () => goCM("MembershipTier.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-icon"
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:gem",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-title"
  }, "Upgrade to Confidence"), /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-sub"
  }, "Unlock premium channels & courses")), /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement(SmSectionCM, {
    title: "Communities"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-tier",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-name"
  }, "Confidence Path"), /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-pill"
  }, "YOUR TIER")), /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-sub"
  }, "Exclusive tier content"), /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-new"
  }, "3 new posts")), /*#__PURE__*/React.createElement(SmSectionCM, {
    title: "Membership Resources"
  }), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_RESOURCES_CM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => goCM("MyLearning.html")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label)))), /*#__PURE__*/React.createElement(SmSectionCM, {
    title: "My Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-courses"
  }, SM_COURSES_CM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-course",
    onClick: () => goCM("MyLearning.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-course-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-course-thumb"
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:image",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-course-name"
  }, c.label)), /*#__PURE__*/React.createElement("span", {
    className: "sm-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-progress-fill",
    style: {
      width: c.pct + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-course-pct"
  }, c.pct, "% complete")))), /*#__PURE__*/React.createElement(SmSectionCM, {
    title: "Upcoming Events"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-events"
  }, SM_EVENTS_CM.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.label,
    className: "sm-event",
    onClick: () => goCM("EventsMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-date"
  }, /*#__PURE__*/React.createElement("b", null, e.d), /*#__PURE__*/React.createElement("i", null, e.m)), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-event-name"
  }, e.label), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-time"
  }, e.t)), e.tag && /*#__PURE__*/React.createElement("span", {
    className: "sm-event-tag"
  }, e.tag)))), /*#__PURE__*/React.createElement(SmSectionCM, {
    title: "My Profile"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-row sm-verify",
    onClick: () => goCM("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:book-open",
    size: 23,
    color: "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, "Verify Profile"), /*#__PURE__*/React.createElement("span", {
    className: "sm-verify-pill"
  }, "Not Verified")), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE_BEFORE_CM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => c.href && goCM(c.href)
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label), /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement(SmDisplayCardCM, {
    dark: dark,
    onToggle: toggleDark
  }), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE_AFTER_CM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => c.href && goCM(c.href)
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label), /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-logout",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:log-out",
    size: 22,
    color: "var(--error)"
  }), "Logout"))));
}
function CMTopBar({
  onMenu,
  onMessages
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "cm-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cm-burger",
    "aria-label": "Menu",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:menu",
    size: 24,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("img", {
    className: "m-logo-light",
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("img", {
    className: "m-logo-dark",
    src: "assets/profinity-academy-logo-dark.jpg",
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "cm-iconbtn",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement(DSCM.Icon, {
    name: "search",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cm-iconbtn",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:bell",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")), /*#__PURE__*/React.createElement("button", {
    className: "cm-iconbtn",
    "aria-label": "Messages",
    onClick: () => onMessages && onMessages()
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")));
}
const DM_THREADS_SEED_CM = [{
  id: "tim",
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  online: true,
  unread: 2,
  messages: [{
    me: false,
    text: "Hey Katy! I saw your post about the full-face rejuvenation case.",
    t: "10:12 AM"
  }, {
    me: true,
    text: "Thank you! It was a great result, patient was thrilled.",
    t: "10:20 AM"
  }, {
    me: false,
    text: "Do you mind if I share it with my team as a reference?",
    t: "10:25 AM"
  }, {
    me: true,
    text: "Of course, go ahead — sharing the write-up now.",
    t: "10:28 AM"
  }, {
    me: false,
    text: "Thanks for sharing the case study. Really helpful!",
    t: "10:30 AM"
  }]
}, {
  id: "sarah",
  name: "Dr Sarah Kim",
  avatar: null,
  online: true,
  unread: 1,
  messages: [{
    me: false,
    text: "Are you free to go over the Q3 protocol updates this week?",
    t: "9:40 AM"
  }, {
    me: true,
    text: "Yes, Thursday afternoon works for me.",
    t: "9:52 AM"
  }, {
    me: false,
    text: "Looking forward to our next meeting!",
    t: "11:00 AM"
  }]
}, {
  id: "emily",
  name: "Dr Emily Tran",
  avatar: null,
  online: false,
  unread: 3,
  messages: [{
    me: false,
    text: "Just finished reviewing the patient satisfaction data.",
    t: "10:50 AM"
  }, {
    me: false,
    text: "There's a trend worth flagging in the 45+ age group.",
    t: "11:05 AM"
  }, {
    me: false,
    text: "I have some additional insights to share.",
    t: "11:15 AM"
  }]
}, {
  id: "james",
  name: "Dr James Brown",
  avatar: null,
  online: false,
  unread: 0,
  muted: true,
  messages: [{
    me: true,
    text: "Sent over the full results deck this morning.",
    t: "11:05 AM"
  }, {
    me: false,
    text: "Can we discuss the implications of the results?",
    t: "11:30 AM"
  }]
}, {
  id: "alex",
  name: "Dr Alex Chen",
  avatar: null,
  online: true,
  unread: 0,
  messages: [{
    me: false,
    text: "The dosing charts you put together are excellent.",
    t: "11:40 AM"
  }, {
    me: false,
    text: "Great work on the data analysis!",
    t: "11:45 AM"
  }]
}, {
  id: "miranda",
  name: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  online: false,
  unread: 0,
  messages: [{
    me: true,
    text: "Sharing the confidence-score writeup with you now.",
    t: "11:50 AM"
  }, {
    me: false,
    text: "Perfect, thank you — this is exactly what I needed.",
    t: "12:00 PM"
  }]
}];
const VOICE_CONFS_SEED_CM = [{
  id: "vc1",
  name: "Clinical Case Review",
  who: "Dr Tim Pearce, Dr Sarah Kim +3",
  t: "Today, 4:00 PM",
  live: true
}, {
  id: "vc2",
  name: "Business Growth Sync",
  who: "Miranda Pearce, Dr Alex Chen",
  t: "Tomorrow, 10:00 AM",
  live: false
}];
const PF_GROUPS_KEY = "pf-dm-groups";
function readDmGroupsCM() {
  try {
    return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function groupDisplayNameCM(members) {
  const names = members.map(m => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}
function createDmGroupCM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = {
    id: "group-" + Date.now(),
    isGroup: true,
    customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNameCM(members),
    members,
    messages: []
  };
  const groups = readDmGroupsCM();
  groups.unshift(group);
  try {
    localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {}
  return group;
}
function GroupAvatarStackCM({
  members,
  size
}) {
  const s = size || 52;
  return /*#__PURE__*/React.createElement("span", {
    className: "mp-group-av",
    style: {
      width: s,
      height: s
    }
  }, members.slice(0, 2).map((m, i) => /*#__PURE__*/React.createElement("span", {
    className: "mp-group-av-item",
    key: m.id || i
  }, /*#__PURE__*/React.createElement(DSCM.Avatar, {
    name: m.name,
    src: m.avatar,
    size: Math.round(s * 0.68)
  }))));
}
function MessagesRowCM({
  c,
  onOpen
}) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return /*#__PURE__*/React.createElement("button", {
    className: "mp-row",
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av"
  }, c.isGroup ? /*#__PURE__*/React.createElement(GroupAvatarStackCM, {
    members: c.members
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSCM.Avatar, {
    name: c.name,
    src: c.avatar,
    size: 52
  }), c.online && /*#__PURE__*/React.createElement("span", {
    className: "dm-online-dot"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "mp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "mp-time"
  }, last ? last.t : "")), /*#__PURE__*/React.createElement("span", {
    className: "mp-row-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-preview"
  }, last ? last.text : c.isGroup ? c.members.length + " members" : ""), c.muted ? /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:bell-off",
    size: 16,
    color: "var(--gray-450)"
  }) : c.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "mp-badge"
  }, c.unread))));
}
function NewConversationScreenCM({
  contacts,
  picked,
  onToggle,
  query,
  onQuery,
  groupName,
  onGroupName,
  onBack,
  onCreate
}) {
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  const count = picked.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-new",
    "data-screen-label": "New Conversation"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nt-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-back",
    "aria-label": "Back to messages",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "20px",
      fontWeight: "700"
    }
  }, "New Conversation")), /*#__PURE__*/React.createElement("div", {
    className: "nt-search mp-search"
  }, /*#__PURE__*/React.createElement(DSCM.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search people",
    "aria-label": "Search people",
    value: query,
    onChange: e => onQuery(e.target.value)
  })), count > 1 && /*#__PURE__*/React.createElement("div", {
    className: "mp-new-namewrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "mp-new-nameinput",
    placeholder: "Name this group (optional)",
    "aria-label": "Group name",
    value: groupName,
    onChange: e => onGroupName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mp-new-list"
  }, filtered.map(c => {
    const on = picked.includes(c.id);
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: "mp-new-row" + (on ? " on" : ""),
      onClick: () => onToggle(c.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mp-av"
    }, /*#__PURE__*/React.createElement(DSCM.Avatar, {
      name: c.name,
      src: c.avatar,
      size: 44
    })), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-name"
    }, c.name), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-check" + (on ? " on" : "")
    }, on && /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
      name: "lucide:check",
      size: 13,
      color: "#fff"
    })));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mp-new-empty"
  }, "No people found.")), /*#__PURE__*/React.createElement("div", {
    className: "mp-new-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-new-count"
  }, count, " selected"), /*#__PURE__*/React.createElement("button", {
    className: "mp-new-create",
    disabled: count === 0,
    onClick: onCreate
  }, count > 1 ? "Create Group" : "Start Chat")));
}
function VoiceConfRowCM({
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-row mp-vc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av mp-vc-icon"
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:phone-call",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-name"
  }, v.name), v.live && /*#__PURE__*/React.createElement("span", {
    className: "mp-vc-live"
  }, "LIVE")), /*#__PURE__*/React.createElement("span", {
    className: "mp-row-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-preview"
  }, v.who)), /*#__PURE__*/React.createElement("span", {
    className: "mp-vc-time"
  }, v.t)));
}
function MessagesPanelCM({
  open,
  onClose
}) {
  const [tab, setTab] = React.useState("messages");
  const [query, setQuery] = React.useState("");
  const [screen, setScreen] = React.useState("list");
  const [groups, setGroups] = React.useState([]);
  const [picked, setPicked] = React.useState([]);
  const [ncQuery, setNcQuery] = React.useState("");
  const [groupName, setGroupName] = React.useState("");
  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setScreen("list");
      setPicked([]);
      setNcQuery("");
      setGroupName("");
    } else {
      setGroups(readDmGroupsCM());
    }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED_CM];
  const filtered = allThreads.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED_CM.reduce((n, t) => n + (t.unread || 0), 0);
  function openThread(id) {
    goCM("DirectMessage.html?id=" + id + "&from=CommunityMobile.html");
  }
  function togglePick(id) {
    setPicked(all => all.includes(id) ? all.filter(x => x !== id) : [...all, id]);
  }
  function handleCreate() {
    if (picked.length === 0) return;
    if (picked.length === 1) {
      openThread(picked[0]);
      return;
    }
    const members = DM_THREADS_SEED_CM.filter(c => picked.includes(c.id)).map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar
    }));
    const group = createDmGroupCM(members, groupName);
    openThread(group.id);
  }
  if (screen === "new") {
    return /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-wrap" + (open ? " open" : ""),
      "aria-hidden": !open
    }, /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("aside", {
      className: "m-drawer nt-panel mp-panel",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "New Conversation"
    }, /*#__PURE__*/React.createElement(NewConversationScreenCM, {
      contacts: DM_THREADS_SEED_CM,
      picked: picked,
      onToggle: togglePick,
      query: ncQuery,
      onQuery: setNcQuery,
      groupName: groupName,
      onGroupName: setGroupName,
      onBack: () => setScreen("list"),
      onCreate: handleCreate
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer nt-panel mp-panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Messages"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nt-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-back",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "26px",
      fontWeight: "700"
    }
  }, "Messages"), /*#__PURE__*/React.createElement("button", {
    className: "mp-compose",
    "aria-label": "New message",
    onClick: () => setScreen("new")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:square-pen",
    size: 20,
    color: "var(--gray-900)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mp-tabs",
    role: "tablist",
    "aria-label": "Messages or voice conference"
  }, /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": tab === "messages",
    className: "mp-tab" + (tab === "messages" ? " on" : ""),
    onClick: () => setTab("messages")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 16,
    color: tab === "messages" ? "var(--brand-navy)" : "var(--gray-450)"
  }), "Messages", unreadTotal > 0 && /*#__PURE__*/React.createElement("span", {
    className: "mp-tab-badge"
  }, unreadTotal)), /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": tab === "voice",
    className: "mp-tab" + (tab === "voice" ? " on" : ""),
    onClick: () => setTab("voice")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:phone",
    size: 16,
    color: tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"
  }), "Voice Conference", /*#__PURE__*/React.createElement("span", {
    className: "mp-tab-badge"
  }, VOICE_CONFS_SEED_CM.length))), /*#__PURE__*/React.createElement("div", {
    className: "nt-search mp-search"
  }, /*#__PURE__*/React.createElement(DSCM.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search messages",
    "aria-label": "Search messages",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-body mp-body"
  }, tab === "messages" ? filtered.map(c => /*#__PURE__*/React.createElement(MessagesRowCM, {
    key: c.id,
    c: c,
    onOpen: () => openThread(c.id)
  })) : VOICE_CONFS_SEED_CM.map(v => /*#__PURE__*/React.createElement(VoiceConfRowCM, {
    key: v.id,
    v: v
  })))));
}
const CM_CHANNELS = ["Confidence", "Mastery", "Freedom", "Inner Circle"];
const CM_PREMIUM_CHANNELS = new Set(["Confidence", "Freedom", "Mastery", "Inner Circle"]);
const CM_CHANNEL_BUCKET = {
  Confidence: "confidence",
  Mastery: "mastery",
  Freedom: "freedom",
  "Inner Circle": "inner"
};
function CMHeader({
  channel,
  setChannel
}) {
  const [following, setFollowing] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    className: "cm-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cm-chsel"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ch cm-chbtn",
    "aria-haspopup": "listbox",
    "aria-expanded": open,
    onClick: e => {
      e.stopPropagation();
      setOpen(o => !o);
    }
  }, channel, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:chevron-down",
    size: 20,
    color: "var(--brand-navy)",
    className: "cm-chchev" + (open ? " open" : "")
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "cm-chmenu",
    role: "listbox",
    onClick: e => e.stopPropagation()
  }, CM_CHANNELS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    role: "option",
    "aria-selected": c === channel,
    className: "cm-chitem" + (c === channel ? " on" : ""),
    onClick: () => {
      setChannel(c);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cm-chitem-name"
  }, c, CM_PREMIUM_CHANNELS.has(c) && /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "fluent:crown-16-filled",
    size: 14,
    color: "var(--brand-gold)"
  })), c === channel && /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:check",
    size: 17,
    color: "var(--brand-navy)"
  }))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cm-follow" + (following ? " on" : ""),
    onClick: () => setFollowing(f => !f)
  }, following ? "Following" : "Follow", following && /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "var(--gray-450)"
  })));
}
function CMComposer({
  channel
}) {
  const nav = () => {
    try {
      sessionStorage.setItem("pf_post_channels", JSON.stringify([channel]));
    } catch (e) {}
    goCM("CreatePostMobile.html");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "cm-compose"
  }, /*#__PURE__*/React.createElement(DSCM.Avatar, {
    name: PFACM.ME.name,
    src: PFACM.ME.avatar,
    size: 40
  }), /*#__PURE__*/React.createElement("button", {
    className: "pill",
    onClick: nav
  }, "Share something…"), /*#__PURE__*/React.createElement("button", {
    className: "imgbtn",
    "aria-label": "Add photo",
    onClick: nav
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:image",
    size: 21,
    color: "var(--brand-navy)"
  })));
}
const CMTabBar = React.forwardRef(function CMTabBar({
  hidden
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "cm-tabs" + (hidden ? " cm-tabs-hidden" : ""),
    "aria-label": "Primary"
  }, CM_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "cm-tab" + (t.key === "Community" ? " on" : ""),
    "aria-current": t.key === "Community" ? "page" : undefined,
    onClick: () => t.href && goCM(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: t.icon,
    size: 23,
    color: t.key === "Community" ? "var(--brand-navy)" : "var(--gray-450)"
  })), t.label)));
});
function useHeaderHideCM(scrollRef) {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY;
      if (y < 24) setHidden(false);else if (delta > 6) setHidden(true);else if (delta < -6) setHidden(false);
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}
function CMScreen({
  scrollRef,
  newPosts,
  dismiss
}) {
  const [channel, setChannel] = React.useState("Confidence");
  const [msgOpen, setMsgOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const headerRef = React.useRef(null);
  const tabsRef = React.useRef(null);
  const [headerH, setHeaderH] = React.useState(0);
  const [tabsH, setTabsH] = React.useState(0);
  const chromeHidden = useHeaderHideCM(scrollRef);
  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const measure = () => setTabsH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "cm-screen",
    "data-screen-label": "Community (mobile)"
  }, /*#__PURE__*/React.createElement("div", {
    ref: headerRef,
    className: "cm-header-wrap" + (chromeHidden ? " cm-header-hidden" : "")
  }, /*#__PURE__*/React.createElement(CMTopBar, {
    onMenu: () => setMenuOpen(true),
    onMessages: () => setMsgOpen(true)
  }), /*#__PURE__*/React.createElement(CMHeader, {
    channel: channel,
    setChannel: setChannel
  }), /*#__PURE__*/React.createElement(CMComposer, {
    channel: channel
  })), /*#__PURE__*/React.createElement("div", {
    className: "cm-scroll",
    ref: scrollRef,
    style: {
      paddingTop: chromeHidden ? 0 : headerH,
      paddingBottom: chromeHidden ? 0 : tabsH
    }
  }, newPosts > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cm-newposts",
    onClick: dismiss,
    "aria-label": newPosts + " new posts, tap to see them"
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:arrow-up",
    size: 18,
    color: "var(--white)"
  }), newPosts, " New Posts"), /*#__PURE__*/React.createElement(PFACM.Feed, {
    channel: CM_CHANNEL_BUCKET[channel]
  }), /*#__PURE__*/React.createElement("div", {
    className: "cm-end"
  }, "End of newsfeed")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cm-clindir-fab" + (chromeHidden ? " cm-clindir-fab-hidden" : ""),
    "aria-label": "Clinician Directory",
    onClick: () => goCM("ClinicianDirectory.html")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:book-open",
    size: 18,
    color: "var(--white)"
  }), "Clinician Directory"), /*#__PURE__*/React.createElement(CMTabBar, {
    ref: tabsRef,
    hidden: chromeHidden
  }), /*#__PURE__*/React.createElement(MessagesPanelCM, {
    open: msgOpen,
    onClose: () => setMsgOpen(false)
  }), /*#__PURE__*/React.createElement(SideMenuCM, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }));
}
function CommunityMobileApp() {
  const mobile = useIsMobileCM();
  const [newPosts, setNewPosts] = React.useState(3);
  const scrollRef = React.useRef(null);
  const dismiss = () => {
    const s = scrollRef.current;
    if (s) s.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setNewPosts(0);
  };
  const scale = useDeviceScaleCM();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  const screen = /*#__PURE__*/React.createElement(CMScreen, {
    scrollRef: scrollRef,
    newPosts: newPosts,
    dismiss: dismiss
  });
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-card)"
      }
    }, screen);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(216, 218, 226)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, screen)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CommunityMobileApp, null));
