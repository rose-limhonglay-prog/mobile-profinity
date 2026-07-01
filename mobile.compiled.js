/* ===========================================================================
   PROfinity — Home (Newsfeed) · iPhone 17 Pro Max mobile
   Reuses the desktop Feed (window.PFApp.Feed — full reaction/comment/animation
   stack) inside the IOSDevice frame, with a mobile top bar + bottom tab bar.
   Shares one global scope with app.jsx, so names here are suffixed -M.
   =========================================================================== */
const {
  useState: useStateM,
  useEffect: useEffectM
} = React;
const DSM = window.ProfinityDesignSystem_c2b5cc;
const PFAM = window.PFApp;
function go(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const M_CHIPS = ["For You", "Following", "Case Studies", "Protocols", "Discussions"];
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
  href: "Agent.html"
}];
function MTopBar({
  onMenu,
  onBell
}) {
  const [showNotif, setShowNotif] = useStateM(true);
  useEffectM(() => {
    const t = setTimeout(() => setShowNotif(false), 5000);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    className: "m-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-burger",
    "aria-label": "Menu",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:menu",
    size: 24,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Search"
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
    "aria-label": "Messages"
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
}
const SM_CHANNELS = [{
  label: "Clinical Chat",
  icon: "lucide:stethoscope",
  n: 10
}, {
  label: "Freedom Path",
  icon: "lucide:feather",
  n: 2
}, {
  label: "Tech Team",
  icon: "lucide:cpu",
  n: 1
}, {
  label: "Business & Mindset",
  icon: "lucide:briefcase",
  n: 5
}];
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
const SM_PROFILE = [{
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
  href: null
}, {
  label: "Display Settings",
  icon: "lucide:cpu",
  href: "DisplaySettings.html"
}, {
  label: "Privacy & Security",
  icon: "lucide:book-open",
  href: null
}];
const NOTIFS = {
  "New": [{
    who: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    action: "commented on your post",
    detail: "“This is a nice article Katy!”",
    t: "Just now",
    type: "comment"
  }, {
    who: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    action: "liked on your comment",
    detail: "“Full-Face Rejuvenation Increased Patient Satisfaction +64%”",
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
    detail: "“This is a nice article Katy!”",
    t: "3w",
    type: "comment"
  }, {
    who: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    action: "liked on your comment",
    detail: "“Full-Face Rejuvenation Increased Patient Satisfaction +64%”",
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
  }, "Accept"))), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(SmSection, {
    title: "Communities"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-tier",
    onClick: () => go("CommunityMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-name"
  }, "Confidence Path"), /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-pill",
    style: {
      color: "rgb(206, 153, 87)"
    }
  }, "YOUR TIER")), /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-sub"
  }, "Exclusive tier content"), /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-new",
    style: {
      color: "rgb(206, 153, 87)"
    }
  }, "3 new posts")), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_CHANNELS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => go("CommunityMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label",
    style: {
      color: "rgb(0, 0, 0)"
    }
  }, c.label), /*#__PURE__*/React.createElement("span", {
    className: "sm-badge sm-badge-red"
  }, c.n)))), /*#__PURE__*/React.createElement(SmSection, {
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
    className: "sm-row-label",
    style: {
      color: "rgb(0, 0, 0)"
    }
  }, c.label), /*#__PURE__*/React.createElement("span", {
    className: "sm-badge sm-badge-gray"
  }, c.n)))), /*#__PURE__*/React.createElement(SmSection, {
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
    className: "sm-course-name",
    style: {
      color: "rgb(0, 0, 0)"
    }
  }, c.label)), /*#__PURE__*/React.createElement("span", {
    className: "sm-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-progress-fill",
    style: {
      width: c.pct + "%",
      backgroundColor: "rgb(206, 153, 87)"
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
    className: "sm-event-name",
    style: {
      color: "rgb(0, 0, 0)"
    }
  }, e.label), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-time"
  }, e.t)), e.tag && /*#__PURE__*/React.createElement("span", {
    className: "sm-event-tag",
    style: {
      borderColor: "rgb(206, 153, 87)",
      color: "rgb(206, 153, 87)"
    }
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
    className: "sm-verify-pill",
    style: {
      backgroundColor: "rgb(206, 153, 87)"
    }
  }, "Not Verified")), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => go(c.href)
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
function MChips() {
  const [active, setActive] = useStateM("For You");
  return /*#__PURE__*/React.createElement("div", {
    className: "m-chips",
    role: "tablist",
    "aria-label": "Feed filters"
  }, M_CHIPS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    role: "tab",
    "aria-selected": active === c,
    className: "m-chip" + (active === c ? " on" : ""),
    onClick: () => setActive(c)
  }, c)));
}
function MTabBar() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "m-tabs",
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
}
const SHARE_CHANNELS = [{
  name: "Confidence",
  desc: "Share your success stories and find inspiration from others' journeys."
}, {
  name: "Clinical Support",
  desc: "Discuss complex cases and get advice from medical experts."
}, {
  name: "Community Chat",
  desc: "Casual conversations and networking with fellow professionals."
}, {
  name: "Business & Growth",
  desc: "Strategies and tips for building your medical practice."
}];
function SelectChannelModal({
  open,
  onClose
}) {
  const [sel, setSel] = useStateM(null);
  useEffectM(() => {
    if (!open) {
      setSel(null);
      return;
    }
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "sc-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "sc-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("header", {
    className: "sc-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    id: "sc-title"
  }, "Select a Channel"), /*#__PURE__*/React.createElement("p", null, "Choose which community channel you'd like to post in")), /*#__PURE__*/React.createElement("button", {
    className: "sc-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:x",
    size: 26,
    color: "var(--gray-900)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sc-sec"
  }, "Following"), /*#__PURE__*/React.createElement("div", {
    className: "sc-list",
    role: "radiogroup",
    "aria-label": "Community channels"
  }, SHARE_CHANNELS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.name,
    className: "sc-item" + (sel === c.name ? " on" : ""),
    role: "radio",
    "aria-checked": sel === c.name,
    onClick: () => setSel(c.name)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-hash"
  }, "#"), /*#__PURE__*/React.createElement("span", {
    className: "sc-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "sc-desc"
  }, c.desc)), /*#__PURE__*/React.createElement("span", {
    className: "sc-radio",
    "aria-hidden": "true"
  })))), /*#__PURE__*/React.createElement("footer", {
    className: "sc-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sc-cancel",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "sc-continue",
    disabled: !sel,
    onClick: () => {
      try {
        sessionStorage.setItem("pf_post_channels", JSON.stringify(sel ? [sel] : []));
      } catch (e) {}
      onClose();
      go("CreatePostMobile.html");
    }
  }, "Continue to Post"))));
}
function MobileHome() {
  const [menuOpen, setMenuOpen] = useStateM(false);
  const [notifOpen, setNotifOpen] = useStateM(false);
  const [shareOpen, setShareOpen] = useStateM(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "m-screen",
    "data-screen-label": "Home (mobile)"
  }, /*#__PURE__*/React.createElement(MTopBar, {
    onMenu: () => setMenuOpen(true),
    onBell: () => setNotifOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "m-scroll"
  }, /*#__PURE__*/React.createElement(PFAM.Feed, null)), /*#__PURE__*/React.createElement(MTabBar, null), /*#__PURE__*/React.createElement("button", {
    className: "m-fab",
    "aria-label": "Share a Post",
    onClick: () => setShareOpen(true)
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
  }), /*#__PURE__*/React.createElement(SelectChannelModal, {
    open: shareOpen,
    onClose: () => setShareOpen(false)
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