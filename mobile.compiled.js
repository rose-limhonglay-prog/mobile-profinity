/* ===========================================================================
   PROfinity — Home (Newsfeed) · iPhone 17 Pro Max mobile
   Reuses the desktop Feed (window.PFApp.Feed — full reaction/comment/animation
   stack) inside the IOSDevice frame, with a mobile top bar + bottom tab bar.
   Shares one global scope with app.jsx, so names here are suffixed -M.
   =========================================================================== */
const {
  useState: useStateM,
  useEffect: useEffectM,
  useRef: useRefM,
  useLayoutEffect: useLayoutEffectM,
  forwardRef: forwardRefM
} = React;
const DSM = window.ProfinityDesignSystem_c2b5cc;
const PFAM = window.PFApp;
function go(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const M_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: null
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Learning",
  label: "Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Agent",
  label: "Agent",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}];
const PUSH_NOTIF = {
  app: "PROfinity Academy",
  icon: "assets/profinity-icon.jpg",
  title: "Weekly Rewards are here!",
  body: "Your weekly rewards have been calculated. Open the app to claim your bonuses before they expire this Sunday.",
  cta: "Claim Rewards"
};
function PushNotifBanner() {
  const [open, setOpen] = useStateM(true);
  const [expanded, setExpanded] = useStateM(false);
  useEffectM(() => {
    if (expanded) return;
    const t = setTimeout(() => setOpen(false), 7000);
    return () => clearTimeout(t);
  }, [expanded]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "m-push" + (expanded ? " expanded" : ""),
    role: "alert",
    "aria-label": PUSH_NOTIF.title,
    onClick: () => setExpanded(e => !e)
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-push-row"
  }, /*#__PURE__*/React.createElement("img", {
    className: "m-push-icon",
    src: PUSH_NOTIF.icon,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-push-app"
  }, PUSH_NOTIF.app), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-push-time"
  }, "now")), /*#__PURE__*/React.createElement("div", {
    className: "m-push-title"
  }, PUSH_NOTIF.title), /*#__PURE__*/React.createElement("p", {
    className: "m-push-body"
  }, PUSH_NOTIF.body), expanded && /*#__PURE__*/React.createElement("div", {
    className: "m-push-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-push-cta",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
    }
  }, PUSH_NOTIF.cta), /*#__PURE__*/React.createElement("button", {
    className: "m-push-dismiss",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
    }
  }, "Dismiss")), /*#__PURE__*/React.createElement("span", {
    className: "m-push-handle",
    role: "button",
    "aria-label": "Dismiss notification",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
    }
  }));
}
const MTopBar = forwardRefM(function MTopBar({
  onMenu,
  onBell,
  onMessages,
  hidden
}, ref) {
  const [showNotif, setShowNotif] = useStateM(true);
  useEffectM(() => {
    const t = setTimeout(() => setShowNotif(false), 5000);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    ref: ref,
    className: "m-top" + (hidden ? " m-top-hidden" : "")
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-burger",
    "aria-label": "Menu",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
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
    className: "m-iconbtn",
    "aria-label": "Search",
    onClick: () => go("SearchMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.Icon, {
    name: "search",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Notifications",
    onClick: () => {
      setShowNotif(false);
      onBell && onBell();
    }
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:bell",
    size: 20,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Messages",
    onClick: () => {
      setShowNotif(false);
      onMessages && onMessages();
    }
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 20,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")), showNotif && /*#__PURE__*/React.createElement("div", {
    className: "m-notif",
    role: "status",
    onClick: () => setShowNotif(false)
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-notif-item"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 17,
    color: "var(--white)"
  }), "71"), /*#__PURE__*/React.createElement("span", {
    className: "m-notif-sep"
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-notif-item"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:heart",
    size: 17,
    color: "var(--white)"
  }), "179"), /*#__PURE__*/React.createElement("span", {
    className: "m-notif-sep"
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-notif-item"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:user-plus",
    size: 17,
    color: "var(--white)"
  }), "48")));
});
const SM_RESOURCES = [{
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
const SM_COURSES = [{
  label: "Face Anatomy Masterclass",
  pct: 72
}, {
  label: "Lip Filler Techniques",
  pct: 45
}, {
  label: "Advanced Botox Training",
  pct: 20
}];
const SM_EVENTS = [{
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
const SM_PROFILE_BEFORE = [{
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
const SM_PROFILE_AFTER = [{
  label: "Privacy & Security",
  icon: "lucide:book-open",
  href: null
}, {
  label: "Admin Panel",
  icon: "lucide:shield",
  href: "AdminPanel.html"
}];
const NOTIFS = {
  "New": [{
    who: "PROfinity Academy",
    avatar: "assets/profinity-icon.jpg",
    action: "Weekly Rewards are here! 🎉",
    detail: "Your weekly rewards have been calculated — claim your bonuses before they expire this Sunday.",
    t: "Just now",
    type: "reward",
    cta: "Claim Rewards"
  }, {
    who: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    action: "commented on your post",
    detail: "\"This is a nice article Katy!\"",
    t: "Just now",
    type: "comment"
  }, {
    who: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    action: "liked on your comment",
    detail: "\"Full-Face Rejuvenation Increased Patient Satisfaction +64%\"",
    t: "2h",
    type: "love"
  }],
  "Yesterday": [{
    who: "Jane Harries",
    avatar: null,
    action: "booked new appointment",
    detail: "February 12, 2026, 6:00 PM",
    t: "1d",
    rsvp: true,
    type: "appointment"
  }],
  "Older": [{
    who: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    action: "commented on your post",
    detail: "\"This is a nice article Katy!\"",
    t: "3w",
    type: "comment"
  }, {
    who: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    action: "liked on your comment",
    detail: "\"Full-Face Rejuvenation Increased Patient Satisfaction +64%\"",
    t: "4w",
    type: "love"
  }]
};
const SUGGESTED_POSTS = [{
  who: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  t: "1h",
  text: "The 3 biggest mistakes injectors make with lip filler — and how to fix them fast.",
  img: "assets/post1-img1.png",
  likes: 142,
  comments: 38,
  tag: "Technique"
}, {
  who: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  t: "3h",
  text: "Patient confidence scores went up 64% after full-face rejuvenation. Here's what changed.",
  img: null,
  likes: 89,
  comments: 22,
  tag: "Case Study"
}, {
  who: "Jane Harries",
  avatar: null,
  t: "5h",
  text: "Just finished the Advanced Botox Training module. The dosing charts are absolute game-changers.",
  img: "assets/post2-img1.png",
  likes: 54,
  comments: 11,
  tag: "Learning"
}];
const NT_BADGE = {
  comment: {
    icon: "fluent:chat-16-filled",
    bg: "var(--brand-navy)"
  },
  love: {
    icon: "fluent:heart-16-filled",
    bg: "var(--reaction-love)"
  },
  like: {
    icon: "fluent:thumb-like-16-filled",
    bg: "var(--reaction-like)"
  },
  follow: {
    icon: "fluent:person-add-16-filled",
    bg: "var(--ai-purple)"
  },
  appointment: {
    icon: "fluent:calendar-checkmark-16-filled",
    bg: "var(--success)"
  },
  reward: {
    icon: "fluent:gift-16-filled",
    bg: "var(--premium-orange)"
  }
};
const NT_MENU = [{
  label: "Turn off notifications like this",
  icon: "lucide:bell-off"
}, {
  label: "Mute this notification",
  icon: "lucide:volume-x"
}, {
  label: "Hide this notification",
  icon: "lucide:eye-off"
}, {
  label: "Report a problem",
  icon: "lucide:flag"
}, {
  label: "Notification settings",
  icon: "lucide:settings"
}];
function NotifRow({
  n
}) {
  const b = NT_BADGE[n.type];
  const [menu, setMenu] = useStateM(false);
  useEffectM(() => {
    if (!menu) return;
    const close = () => setMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menu]);
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-av"
  }, /*#__PURE__*/React.createElement(DSM.Avatar, {
    name: n.who,
    src: n.avatar,
    size: 58
  }), b && /*#__PURE__*/React.createElement("span", {
    className: "nt-badge",
    style: {
      background: b.bg
    }
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: b.icon,
    size: 15,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nt-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-text"
  }, /*#__PURE__*/React.createElement("b", null, n.who), " ", /*#__PURE__*/React.createElement("span", {
    className: "nt-action"
  }, n.action), " ", n.detail && /*#__PURE__*/React.createElement("span", {
    className: "nt-q"
  }, n.detail)), /*#__PURE__*/React.createElement("div", {
    className: "nt-time"
  }, n.t), n.rsvp && /*#__PURE__*/React.createElement("div", {
    className: "nt-rsvp"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-reject"
  }, "Reject"), /*#__PURE__*/React.createElement("button", {
    className: "nt-accept"
  }, "Accept")), n.cta && /*#__PURE__*/React.createElement("div", {
    className: "nt-rsvp"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-accept"
  }, n.cta))), /*#__PURE__*/React.createElement("div", {
    className: "nt-more-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-more",
    "aria-label": "More options",
    "aria-haspopup": "menu",
    "aria-expanded": menu,
    onClick: e => {
      e.stopPropagation();
      setMenu(m => !m);
    }
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:more-vertical",
    size: 20,
    color: "var(--gray-450)"
  })), menu && /*#__PURE__*/React.createElement("div", {
    className: "nt-menu",
    role: "menu",
    onClick: e => e.stopPropagation()
  }, NT_MENU.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.label,
    className: "nt-menu-item",
    role: "menuitem",
    onClick: () => setMenu(false)
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: m.icon,
    size: 19,
    color: "var(--gray-700)"
  }), m.label)))));
}
function SuggestedPostCard({
  p
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-sp-card"
  }, p.img && /*#__PURE__*/React.createElement("div", {
    className: "nt-sp-thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-sp-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-sp-author"
  }, /*#__PURE__*/React.createElement(DSM.Avatar, {
    name: p.who,
    src: p.avatar,
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    className: "nt-sp-name"
  }, p.who), /*#__PURE__*/React.createElement("span", {
    className: "nt-sp-time"
  }, p.t)), /*#__PURE__*/React.createElement("p", {
    className: "nt-sp-text"
  }, p.text), /*#__PURE__*/React.createElement("div", {
    className: "nt-sp-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-sp-tag"
  }, p.tag), /*#__PURE__*/React.createElement("span", {
    className: "nt-sp-stats"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "fluent:heart-16-filled",
    size: 13,
    color: "var(--reaction-love)"
  }), p.likes, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "fluent:chat-16-filled",
    size: 13,
    color: "var(--gray-400)"
  }), p.comments))));
}
function NotificationsPanel({
  open,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer nt-panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nt-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-back",
    "aria-label": "Back",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "26px",
      fontWeight: "700"
    }
  }, "Notifications")), /*#__PURE__*/React.createElement("div", {
    className: "nt-search"
  }, /*#__PURE__*/React.createElement(DSM.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search notifications",
    "aria-label": "Search notifications"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-body"
  }, Object.keys(NOTIFS).map(sec => /*#__PURE__*/React.createElement("div", {
    key: sec,
    className: "nt-group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-sec-h"
  }, sec.toUpperCase(), sec === "New" && /*#__PURE__*/React.createElement("span", {
    className: "nt-sec-dot"
  })), NOTIFS[sec].map((n, i) => /*#__PURE__*/React.createElement(NotifRow, {
    key: i,
    n: n
  })))), /*#__PURE__*/React.createElement("div", {
    className: "nt-suggested"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-suggested-head"
  }, /*#__PURE__*/React.createElement("span", null, "SUGGESTED FOR YOU"), /*#__PURE__*/React.createElement("button", {
    className: "nt-suggested-see"
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    className: "nt-sp-scroll"
  }, SUGGESTED_POSTS.map((p, i) => /*#__PURE__*/React.createElement(SuggestedPostCard, {
    key: i,
    p: p
  })))))));
}
const DM_THREADS_SEED = [{
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
const VOICE_CONFS_SEED = [{
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
function readDmGroupsM() {
  try {
    return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function groupDisplayNameM(members) {
  const names = members.map(m => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}
function createDmGroupM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = {
    id: "group-" + Date.now(),
    isGroup: true,
    customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNameM(members),
    members,
    messages: []
  };
  const groups = readDmGroupsM();
  groups.unshift(group);
  try {
    localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {}
  return group;
}
function GroupAvatarStackM({
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
  }, /*#__PURE__*/React.createElement(DSM.Avatar, {
    name: m.name,
    src: m.avatar,
    size: Math.round(s * 0.68)
  }))));
}
function MessagesRow({
  c,
  onOpen
}) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return /*#__PURE__*/React.createElement("button", {
    className: "mp-row",
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av"
  }, c.isGroup ? /*#__PURE__*/React.createElement(GroupAvatarStackM, {
    members: c.members
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSM.Avatar, {
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
  }, last ? last.text : c.isGroup ? c.members.length + " members" : ""), c.muted ? /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:bell-off",
    size: 16,
    color: "var(--gray-450)"
  }) : c.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "mp-badge"
  }, c.unread))));
}
function NewConversationScreenM({
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
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
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
  }, /*#__PURE__*/React.createElement(DSM.Icon, {
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
    }, /*#__PURE__*/React.createElement(DSM.Avatar, {
      name: c.name,
      src: c.avatar,
      size: 44
    })), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-name"
    }, c.name), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-check" + (on ? " on" : "")
    }, on && /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
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
function VoiceConfRow({
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-row mp-vc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av mp-vc-icon"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
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
function MessagesPanel({
  open,
  onClose
}) {
  const [tab, setTab] = useStateM("messages");
  const [query, setQuery] = useStateM("");
  const [screen, setScreen] = useStateM("list");
  const [groups, setGroups] = useStateM([]);
  const [picked, setPicked] = useStateM([]);
  const [ncQuery, setNcQuery] = useStateM("");
  const [groupName, setGroupName] = useStateM("");
  useEffectM(() => {
    if (!open) {
      setQuery("");
      setScreen("list");
      setPicked([]);
      setNcQuery("");
      setGroupName("");
    } else {
      setGroups(readDmGroupsM());
    }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED];
  const filtered = allThreads.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED.reduce((n, t) => n + (t.unread || 0), 0);
  function openThread(id) {
    go("DirectMessage.html?id=" + id + "&from=NewsfeedMobile.html");
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
    const members = DM_THREADS_SEED.filter(c => picked.includes(c.id)).map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar
    }));
    const group = createDmGroupM(members, groupName);
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
    }, /*#__PURE__*/React.createElement(NewConversationScreenM, {
      contacts: DM_THREADS_SEED,
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
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
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
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
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
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
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
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:phone",
    size: 16,
    color: tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"
  }), "Voice Conference", /*#__PURE__*/React.createElement("span", {
    className: "mp-tab-badge"
  }, VOICE_CONFS_SEED.length))), /*#__PURE__*/React.createElement("div", {
    className: "nt-search mp-search"
  }, /*#__PURE__*/React.createElement(DSM.Icon, {
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
  }, tab === "messages" ? filtered.map(c => /*#__PURE__*/React.createElement(MessagesRow, {
    key: c.id,
    c: c,
    onOpen: () => openThread(c.id)
  })) : VOICE_CONFS_SEED.map(v => /*#__PURE__*/React.createElement(VoiceConfRow, {
    key: v.id,
    v: v
  })))));
}
function useDarkModeM() {
  const [dark, setDark] = useStateM(() => {
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
function SmDarkSwitch({
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
  }, on && /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:moon",
    size: 13,
    color: "#1A1736"
  })));
}
function SmDisplayCard({
  dark,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-display-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-display-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-display-label"
  }, "Display"), /*#__PURE__*/React.createElement(SmDarkSwitch, {
    on: dark,
    onToggle: onToggle
  })), /*#__PURE__*/React.createElement("p", {
    className: "sm-display-desc"
  }, "Adjust the appearance of the app to reduce glare and give your eyes a break"));
}
function SmSection({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, title);
}
function SideMenu({
  open,
  onClose
}) {
  const [dark, toggleDark] = useDarkModeM();
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
    onClick: () => go("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.Avatar, {
    name: PFAM.ME.name,
    src: PFAM.ME.avatar,
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-dp-name"
  }, "Katy Wilson", /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:badge-check",
    size: 18,
    color: "var(--reaction-like)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-role"
  }, "Registered Nurse")), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-800)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-body"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sm-upgrade",
    onClick: () => go("MembershipTier.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-icon"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:gem",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-title"
  }, "Upgrade to Confidence"), /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-sub"
  }, "Unlock premium channels & courses")), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement(SmSection, {
    title: "Communities"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-tier",
    onClick: () => go("CommunityMobile.html")
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
  }, "3 new posts")), /*#__PURE__*/React.createElement(SmSection, {
    title: "Membership Resources"
  }), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_RESOURCES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => go("MyLearning.html")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label)))), /*#__PURE__*/React.createElement(SmSection, {
    title: "My Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-courses"
  }, SM_COURSES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-course",
    onClick: () => go("MyLearning.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-course-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-course-thumb"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
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
  }, c.pct, "% complete")))), /*#__PURE__*/React.createElement(SmSection, {
    title: "Upcoming Events"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-events"
  }, SM_EVENTS.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.label,
    className: "sm-event",
    onClick: () => go("EventsMobile.html")
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
  }, e.tag)))), /*#__PURE__*/React.createElement(SmSection, {
    title: "My Profile"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-row sm-verify",
    onClick: () => go("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:book-open",
    size: 23,
    color: "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, "Verify Profile"), /*#__PURE__*/React.createElement("span", {
    className: "sm-verify-pill"
  }, "Not Verified")), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE_BEFORE.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => c.href && go(c.href)
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement(SmDisplayCard, {
    dark: dark,
    onToggle: toggleDark
  }), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE_AFTER.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => c.href && go(c.href)
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-logout",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:log-out",
    size: 22,
    color: "var(--error)"
  }), "Logout"))));
}
const MTabBar = forwardRefM(function MTabBar({
  hidden
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "m-tabs" + (hidden ? " m-tabs-hidden" : ""),
    "aria-label": "Primary"
  }, M_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "m-tab" + (t.key === "Home" ? " on" : ""),
    "aria-current": t.key === "Home" ? "page" : undefined,
    onClick: () => t.href && go(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: t.icon,
    size: 24,
    color: t.key === "Home" ? "var(--brand-navy)" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), t.label)));
});
function useHeaderHideM(scrollRef) {
  const [hidden, setHidden] = useStateM(false);
  useEffectM(() => {
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
function MobileHome() {
  const [menuOpen, setMenuOpen] = useStateM(false);
  const [notifOpen, setNotifOpen] = useStateM(false);
  const [msgOpen, setMsgOpen] = useStateM(false);
  const scrollRefM = useRefM(null);
  const headerRefM = useRefM(null);
  const tabsRefM = useRefM(null);
  const [headerH, setHeaderH] = useStateM(0);
  const [tabsH, setTabsH] = useStateM(0);
  const chromeHidden = useHeaderHideM(scrollRefM);
  useLayoutEffectM(() => {
    const el = headerRefM.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffectM(() => {
    const el = tabsRefM.current;
    if (!el) return;
    const measure = () => setTabsH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "m-screen",
    "data-screen-label": "Home (mobile)"
  }, /*#__PURE__*/React.createElement(PushNotifBanner, null), /*#__PURE__*/React.createElement(MTopBar, {
    ref: headerRefM,
    hidden: chromeHidden,
    onMenu: () => setMenuOpen(true),
    onBell: () => setNotifOpen(true),
    onMessages: () => setMsgOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "m-scroll",
    ref: scrollRefM,
    style: {
      paddingTop: chromeHidden ? 0 : headerH,
      paddingBottom: chromeHidden ? 0 : tabsH
    }
  }, /*#__PURE__*/React.createElement(PFAM.Feed, null)), /*#__PURE__*/React.createElement(MTabBar, {
    ref: tabsRefM,
    hidden: chromeHidden
  }), /*#__PURE__*/React.createElement("button", {
    className: "m-fab" + (chromeHidden ? " m-fab-hidden" : ""),
    "aria-label": "Share a Post",
    onClick: () => go("CreatePostMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:plus",
    size: 22,
    color: "#fff"
  }), "Share a Post"), /*#__PURE__*/React.createElement(SideMenu, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }), /*#__PURE__*/React.createElement(NotificationsPanel, {
    open: notifOpen,
    onClose: () => setNotifOpen(false)
  }), /*#__PURE__*/React.createElement(MessagesPanel, {
    open: msgOpen,
    onClose: () => setMsgOpen(false)
  }));
}
function useDeviceScaleM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateM(calc);
  useEffectM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileM() {
  const [mobile, setMobile] = useStateM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function MobileApp() {
  const mobile = useIsMobileM();
  const scale = useDeviceScaleM();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(MobileHome, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(MobileHome, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MobileApp, null));
