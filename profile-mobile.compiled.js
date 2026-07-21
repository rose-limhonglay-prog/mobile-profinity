/* ===========================================================================
   PROfinity — Profile (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -PM to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStatePM,
  useEffect: useEffectPM
} = React;
const DSPM = window.ProfinityDesignSystem_c2b5cc;
function goPM(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* Standalone badge image with a hover/tap tooltip explaining what it means
   (mastery + skinfluencer badges aren't part of DSPM.VerificationSeals). */
function PMSealBadge({
  src,
  alt,
  label,
  width,
  height,
  style
}) {
  const [hover, setHover] = useStatePM(false);
  const [pinned, setPinned] = useStatePM(false);
  useEffectPM(() => {
    if (!pinned) return;
    const close = () => {
      setPinned(false);
      setHover(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [pinned]);
  const open = hover || pinned;
  return /*#__PURE__*/React.createElement("span", {
    className: "pm-seal-badge" + (open ? " is-open" : ""),
    tabIndex: 0,
    role: "button",
    "aria-label": label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: e => {
      e.stopPropagation();
      setPinned(p => !p);
    },
    onKeyDown: e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setPinned(p => !p);
      }
    },
    style: style
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    width: width,
    height: height,
    style: {
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-seal-tip"
  }, label));
}
const PM_ME = {
  name: "Katy Wilson",
  role: "Registered Nurse",
  avatar: "assets/avatar-katy.jpg",
  seals: ["gb", "verified", "crown", "gold"],
  bio: "Enhance patient satisfaction scores by 15% over the next 6 months through improved communication and personalized care planning.",
  followers: "1,546",
  following: "880",
  posts: "57",
  location: "London, United Kingdom",
  clinic: "Allcare Medical"
};
const PM_SERVICES = [{
  ti: "Botox (Anti-Wrinkle Injections)",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Dermal Fillers",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Lip Enhancement",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Cheek & Jawline Contouring",
  su: "Career Academy: Dr Tim Pearce"
}];
const PM_EXPERIENCE = [{
  ti: "Registered Nurse",
  yrs: "12 years",
  org: "Generations Wellness Center",
  loc: "London, United Kingdom"
}, {
  ti: "Assistant Nurse",
  yrs: "12 years",
  org: "Generations Wellness Center",
  loc: "London, United Kingdom"
}];
const PM_LICENSES = ["The Ultimate Toxin Eye Complications Masterclass", "Anatomy360", "Pro Tox Course", "8D Lips Course", "Botox Foundations"];
const PM_ACTIVITY = [{
  name: "Katy Wilson",
  loc: "London, United Kingdom",
  time: "Today",
  avatar: "assets/avatar-katy.jpg",
  title: "Temple Filler Techniques",
  body: "One of the biggest challenges in clinical practice? Paperwork. Since switching to PROfinity, consent forms, treatment records, and post-consult notes are now digital, organized, and secure — saving me time and giving patients a clearer, more confident experience.\n#DigitalHealth #PatientCare #ClinicianTools #PROfinity",
  likes: "1.2K",
  comments: "150",
  shares: "150"
}, {
  name: "James Lee",
  loc: "Sydney, Australia",
  time: "Yesterday",
  avatar: null,
  title: "Advanced Suturing Techniques",
  body: "In my surgical practice, time is precious. That's why I was thrilled to discover the ease of digital record-keeping with PROfinity. Documentation has never been simpler — everything I need is just a few taps away.\n#Surgery #PatientSafety #MedicalTech #PROfinity",
  likes: "850",
  comments: "200",
  shares: "180"
}, {
  name: "Linda Garcia",
  loc: "Toronto, Canada",
  time: "Last Week",
  avatar: null,
  title: "Emerging Technologies in Dentistry",
  body: "The dental field is evolving rapidly, and so should our approach to documentation. From treatment plans to follow-up notes, everything is handled digitally — less clutter, more focus on patient interactions.\n#DentalCare #TechInDentistry #PROfinity #FutureOfHealthcare",
  likes: "1.5K",
  comments: "120",
  shares: "200"
}];
const PM_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: "NewsfeedMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: null
}, {
  key: "Learning",
  label: "My Learning",
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
const SM_RESOURCES_PM = [{
  label: "Videos",
  icon: "lucide:square-play"
}, {
  label: "Articles",
  icon: "lucide:feather"
}, {
  label: "Webinars",
  icon: "lucide:calendar"
}];
const SM_COURSES_PM = [{
  label: "Face Anatomy Masterclass",
  pct: 72
}, {
  label: "Lip Filler Techniques",
  pct: 45
}, {
  label: "Advanced Botox Training",
  pct: 20
}];
const SM_EVENTS_PM = [{
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
const SM_PROFILE_BEFORE_PM = [{
  label: "Edit Profile",
  icon: "lucide:book-open",
  href: "ProfileMobile.html"
}, {
  label: "Account Settings",
  icon: "lucide:graduation-cap",
  href: "AccountSettings.html"
}, {
  label: "Notifications",
  icon: "lucide:calendar",
  href: "NotificationSettings.html"
}];
const SM_PROFILE_AFTER_PM = [{
  label: "Privacy & Security",
  icon: "lucide:book-open",
  href: null
}, {
  label: "Admin Panel",
  icon: "lucide:shield",
  href: "AdminPanel.html"
}];
function useDarkModePM() {
  const [dark, setDark] = useStatePM(() => {
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
function SmDarkSwitchPM({
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
  }, on && /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:moon",
    size: 13,
    color: "#1A1736"
  })));
}
function SmDisplayCardPM({
  dark,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-display-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-display-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-display-label"
  }, "Display"), /*#__PURE__*/React.createElement(SmDarkSwitchPM, {
    on: dark,
    onToggle: onToggle
  })), /*#__PURE__*/React.createElement("p", {
    className: "sm-display-desc"
  }, "Adjust the appearance of the app to reduce glare and give your eyes a break"));
}
function SmSectionPM({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, title);
}
function SideMenuPM({
  open,
  onClose
}) {
  const [dark, toggleDark] = useDarkModePM();
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
    onClick: () => goPM("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: PM_ME.name,
    src: PM_ME.avatar,
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-dp-name"
  }, PM_ME.name, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:badge-check",
    size: 18,
    color: "var(--reaction-like)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-role"
  }, PM_ME.role)), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-800)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-body"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sm-upgrade",
    onClick: () => goPM("MembershipTier.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-icon"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:gem",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-title"
  }, "Upgrade to Confidence"), /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-sub"
  }, "Unlock premium channels & courses")), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "Communities"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-tier",
    onClick: () => goPM("CommunityMobile.html")
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
  }, "3 new posts")), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "Membership Resources"
  }), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_RESOURCES_PM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => goPM("LearningMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label)))), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "My Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-courses"
  }, SM_COURSES_PM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-course",
    onClick: () => goPM("LearningMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-course-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-course-thumb"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
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
  }, c.pct, "% complete")))), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "Upcoming Events"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-events"
  }, SM_EVENTS_PM.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.label,
    className: "sm-event",
    onClick: () => goPM("EventsMobile.html")
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
  }, e.tag)))), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "My Profile"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-row sm-verify",
    onClick: () => goPM("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:book-open",
    size: 23,
    color: "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, "Verify Profile"), /*#__PURE__*/React.createElement("span", {
    className: "sm-verify-pill"
  }, "Not Verified")), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE_BEFORE_PM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => c.href && goPM(c.href)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement(SmDisplayCardPM, {
    dark: dark,
    onToggle: toggleDark
  }), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE_AFTER_PM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => c.href && goPM(c.href)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-logout",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:log-out",
    size: 22,
    color: "var(--error)"
  }), "Logout"))));
}
function PMTopBar({
  onMenu,
  onMessages
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "pm-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-burger",
    "aria-label": "Menu",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
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
    className: "pm-iconbtn",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
    name: "search",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:bell",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Messages",
    onClick: () => onMessages && onMessages()
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")));
}
const DM_THREADS_SEED_PM = [{
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
const VOICE_CONFS_SEED_PM = [{
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
function readDmGroupsPM() {
  try {
    return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function groupDisplayNamePM(members) {
  const names = members.map(m => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}
function createDmGroupPM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = {
    id: "group-" + Date.now(),
    isGroup: true,
    customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNamePM(members),
    members,
    messages: []
  };
  const groups = readDmGroupsPM();
  groups.unshift(group);
  try {
    localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {}
  return group;
}
function GroupAvatarStackPM({
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
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: m.name,
    src: m.avatar,
    size: Math.round(s * 0.68)
  }))));
}
function MessagesRowPM({
  c,
  onOpen
}) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return /*#__PURE__*/React.createElement("button", {
    className: "mp-row",
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av"
  }, c.isGroup ? /*#__PURE__*/React.createElement(GroupAvatarStackPM, {
    members: c.members
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSPM.Avatar, {
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
  }, last ? last.text : c.isGroup ? c.members.length + " members" : ""), c.muted ? /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:bell-off",
    size: 16,
    color: "var(--gray-450)"
  }) : c.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "mp-badge"
  }, c.unread))));
}
function NewConversationScreenPM({
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
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
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
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
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
    }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
      name: c.name,
      src: c.avatar,
      size: 44
    })), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-name"
    }, c.name), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-check" + (on ? " on" : "")
    }, on && /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
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
function VoiceConfRowPM({
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-row mp-vc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av mp-vc-icon"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
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
function MessagesPanelPM({
  open,
  onClose
}) {
  const [tab, setTab] = useStatePM("messages");
  const [query, setQuery] = useStatePM("");
  const [screen, setScreen] = useStatePM("list");
  const [groups, setGroups] = useStatePM([]);
  const [picked, setPicked] = useStatePM([]);
  const [ncQuery, setNcQuery] = useStatePM("");
  const [groupName, setGroupName] = useStatePM("");
  useEffectPM(() => {
    if (!open) {
      setQuery("");
      setScreen("list");
      setPicked([]);
      setNcQuery("");
      setGroupName("");
    } else {
      setGroups(readDmGroupsPM());
    }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED_PM];
  const filtered = allThreads.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED_PM.reduce((n, t) => n + (t.unread || 0), 0);
  function openThread(id) {
    goPM("DirectMessage.html?id=" + id + "&from=ProfileMobile.html");
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
    const members = DM_THREADS_SEED_PM.filter(c => picked.includes(c.id)).map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar
    }));
    const group = createDmGroupPM(members, groupName);
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
    }, /*#__PURE__*/React.createElement(NewConversationScreenPM, {
      contacts: DM_THREADS_SEED_PM,
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
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
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
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
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
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
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
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:phone",
    size: 16,
    color: tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"
  }), "Voice Conference", /*#__PURE__*/React.createElement("span", {
    className: "mp-tab-badge"
  }, VOICE_CONFS_SEED_PM.length))), /*#__PURE__*/React.createElement("div", {
    className: "nt-search mp-search"
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
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
  }, tab === "messages" ? filtered.map(c => /*#__PURE__*/React.createElement(MessagesRowPM, {
    key: c.id,
    c: c,
    onOpen: () => openThread(c.id)
  })) : VOICE_CONFS_SEED_PM.map(v => /*#__PURE__*/React.createElement(VoiceConfRowPM, {
    key: v.id,
    v: v
  })))));
}
function PMTabBar() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "pm-tabs",
    "aria-label": "Primary"
  }, PM_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "pm-tab" + (t.key === "Profile" ? " on" : ""),
    "aria-current": t.key === "Profile" ? "page" : undefined,
    onClick: () => t.href && goPM(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: t.icon,
    size: 23,
    color: t.key === "Profile" ? "var(--brand-navy)" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), t.label)));
}
const PM_STEPS_INIT = [{
  ti: "Add a profile photo",
  su: "Priority action",
  state: "priority"
}, {
  ti: "Write your bio",
  su: "Complete",
  state: "done"
}, {
  ti: "Add your location",
  su: "Complete",
  state: "done"
}, {
  ti: "Verify your credentials",
  su: "Incomplete",
  state: "todo"
}, {
  ti: "Connect your social profiles",
  su: "Incomplete",
  state: "todo"
}];

/* ---- Step sheet: Photo ---- */
function PhotoStep({
  onComplete,
  isDone
}) {
  const [chosen, setChosen] = useStatePM(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-av"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: "Katy Wilson",
    src: "assets/avatar-katy.jpg",
    size: 88
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-sheet-av-edit"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:camera",
    size: 15,
    color: "#fff"
  }))), isDone && /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-note"
  }, "Your profile photo is set. You can update it anytime."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-opts"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-opt" + (chosen === "camera" ? " sel" : ""),
    onClick: () => setChosen("camera")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:camera",
    size: 22,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Take a photo")), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-opt" + (chosen === "library" ? " sel" : ""),
    onClick: () => setChosen("library")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:image",
    size: 22,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Choose from library"))), chosen && /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: onComplete
  }, "Upload & Save Photo"));
}

/* ---- Step sheet: Bio ---- */
function BioStep({
  onComplete
}) {
  const [bio, setBio] = useStatePM(PM_ME.bio);
  const max = 300;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Write a short bio that tells people about your professional background and specialisations."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "pm-sheet-ta",
    value: bio,
    maxLength: max,
    rows: 5,
    onChange: e => setBio(e.target.value),
    placeholder: "e.g. Aesthetic nurse with 10+ years experience in botox and dermal fillers…"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-sheet-count"
  }, bio.length, "/", max)), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: onComplete,
    disabled: bio.trim().length < 10
  }, "Save Bio"));
}

/* ---- Step sheet: Location ---- */
function LocationStep({
  onComplete
}) {
  const [loc, setLoc] = useStatePM("London, United Kingdom");
  const [detecting, setDetecting] = useStatePM(false);
  function detect() {
    setDetecting(true);
    setTimeout(() => {
      setLoc("London, United Kingdom");
      setDetecting(false);
    }, 1200);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Add your location so patients and peers can find you."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-field"
  }, /*#__PURE__*/React.createElement("input", {
    className: "pm-sheet-inp",
    value: loc,
    onChange: e => setLoc(e.target.value),
    placeholder: "City, Country"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-ghost",
    onClick: detect,
    disabled: detecting
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:map-pin",
    size: 18,
    color: "var(--brand-navy)"
  }), detecting ? "Detecting…" : "Use my current location"), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: onComplete,
    disabled: loc.trim().length < 2
  }, "Save Location"));
}

/* ---- Step sheet: Credentials ---- */
function CredentialsStep({
  onComplete
}) {
  const [nmcNum, setNmcNum] = useStatePM("");
  const [submitted, setSubmitted] = useStatePM(false);
  if (submitted) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pm-sheet-step pm-sheet-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pm-sheet-icon-wrap success"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:clock",
      size: 32,
      color: "var(--success)"
    })), /*#__PURE__*/React.createElement("h4", null, "Verification Submitted"), /*#__PURE__*/React.createElement("p", {
      className: "pm-sheet-desc"
    }, "Your credentials are under review. We'll notify you within 1–2 business days."), /*#__PURE__*/React.createElement("button", {
      className: "pm-sheet-cta",
      onClick: onComplete
    }, "Got it"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Enter your NMC or GMC registration number to verify your professional credentials."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "pm-sheet-label"
  }, "NMC / GMC Number"), /*#__PURE__*/React.createElement("input", {
    className: "pm-sheet-inp",
    value: nmcNum,
    onChange: e => setNmcNum(e.target.value),
    placeholder: "e.g. 12A3456B"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-ghost"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:upload",
    size: 18,
    color: "var(--brand-navy)"
  }), "Upload supporting documents"), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: () => setSubmitted(true),
    disabled: nmcNum.trim().length < 5
  }, "Submit for Verification"));
}

/* ---- Step sheet: Social profiles ---- */
const PM_SOCIALS = [{
  key: "linkedin",
  icon: "mdi:linkedin",
  color: "#0A66C2",
  label: "LinkedIn"
}, {
  key: "instagram",
  icon: "mdi:instagram",
  color: "#E1306C",
  label: "Instagram"
}, {
  key: "twitter",
  icon: "mdi:twitter",
  color: "#1DA1F2",
  label: "X / Twitter"
}, {
  key: "facebook",
  icon: "mdi:facebook",
  color: "#1877F2",
  label: "Facebook"
}];
function SocialStep({
  onComplete
}) {
  const [connected, setConnected] = useStatePM([]);
  function toggle(key) {
    setConnected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Link your social profiles to build trust and grow your network."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-socials"
  }, PM_SOCIALS.map(s => {
    const on = connected.includes(s.key);
    return /*#__PURE__*/React.createElement("div", {
      key: s.key,
      className: "pm-sheet-social"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: s.icon,
      size: 28,
      color: s.color
    }), /*#__PURE__*/React.createElement("span", {
      className: "pm-sheet-social-nm"
    }, s.label), /*#__PURE__*/React.createElement("button", {
      className: "pm-sheet-social-btn" + (on ? " connected" : ""),
      onClick: () => toggle(s.key)
    }, on ? "Connected" : "Connect"));
  })), connected.length > 0 && /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: onComplete
  }, "Save Connections"));
}

/* ---- Bottom sheet wrapper ---- */
function StepSheet({
  step,
  idx,
  onComplete,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-drag"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-hd"
  }, /*#__PURE__*/React.createElement("h3", null, step.ti), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-body"
  }, idx === 0 && /*#__PURE__*/React.createElement(PhotoStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }), idx === 1 && /*#__PURE__*/React.createElement(BioStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }), idx === 2 && /*#__PURE__*/React.createElement(LocationStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }), idx === 3 && /*#__PURE__*/React.createElement(CredentialsStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }), idx === 4 && /*#__PURE__*/React.createElement(SocialStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }))));
}

/* ---- Profile complete success banner ---- */
function ProfileCompleteCard({
  onDismiss
}) {
  useEffectPM(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-success",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-success-icon"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 36,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "pm-steps-success-h"
  }, "Profile Complete!"), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-success-sub"
  }, "Your profile is fully set up. You're ready to connect with the community."), /*#__PURE__*/React.createElement("button", {
    className: "pm-steps-success-btn",
    onClick: onDismiss
  }, "Got it"));
}

/* ---- Profile steps card ---- */
function ProfileSteps() {
  const [steps, setSteps] = useStatePM(() => PM_STEPS_INIT.map(s => ({
    ...s
  })));
  const [activeIdx, setActiveIdx] = useStatePM(null);
  const [dismissed, setDismissed] = useStatePM(false);
  const [exiting, setExiting] = useStatePM(false);
  const total = steps.length;
  const done = steps.filter(s => s.state === "done").length;
  const allDone = done === total;
  const pct = Math.round(done / total * 100);
  function markDone(idx) {
    setSteps(prev => prev.map((s, i) => i === idx ? {
      ...s,
      state: "done",
      su: "Complete"
    } : s));
    setActiveIdx(null);
  }
  function handleDismiss() {
    setExiting(true);
    setTimeout(() => setDismissed(true), 400);
  }
  if (dismissed) return null;
  if (allDone) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pm-steps-wrap" + (exiting ? " pm-steps-exit" : "")
    }, /*#__PURE__*/React.createElement(ProfileCompleteCard, {
      onDismiss: handleDismiss
    }));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    className: "pm-steps",
    "aria-label": "Complete your profile"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "pm-steps-h"
  }, "Complete your profile"), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-sub"
  }, done, " of ", total, " steps complete"), /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-track",
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-steps-fill",
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-pct"
  }, pct, "% complete"), /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-list"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("button", {
    className: "pm-step " + s.state,
    key: i,
    onClick: () => setActiveIdx(i)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-step-mark",
    "aria-hidden": "true"
  }, s.state === "done" ? /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 18,
    color: "#fff"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "dot"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-step-txt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, s.ti), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, s.su)), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  }))))), activeIdx !== null && /*#__PURE__*/React.createElement(StepSheet, {
    step: steps[activeIdx],
    idx: activeIdx,
    onComplete: () => markDone(activeIdx),
    onClose: () => setActiveIdx(null)
  }));
}
function PMSection({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title), /*#__PURE__*/React.createElement("span", {
    className: "pm-sec-tools"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-tool",
    "aria-label": "Add to " + title
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:plus",
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-tool",
    "aria-label": "Edit " + title
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
    name: "edit",
    size: 17,
    color: "var(--brand-navy)"
  })))), children);
}
function PMMentor() {
  const [done, setDone] = useStatePM(false);
  if (done) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor-hd"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "fluent:people-team-16-filled",
    size: 22,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "Find a mentor")), /*#__PURE__*/React.createElement("p", {
    className: "s"
  }, "Connecting with a mentor can accelerate your professional growth."), /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor-act"
  }, /*#__PURE__*/React.createElement("button", {
    className: "no",
    onClick: () => setDone(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--error)"
  }), "No"), /*#__PURE__*/React.createElement("button", {
    className: "yes",
    onClick: () => setDone(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 18,
    color: "var(--success)"
  }), "Yes")));
}
function PMPost({
  p
}) {
  const lines = p.body.split("\n");
  return /*#__PURE__*/React.createElement("article", {
    className: "pm-post"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-post-hd"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: p.name,
    src: p.avatar,
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-post-by"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, p.name, /*#__PURE__*/React.createElement("span", {
    className: "loc"
  }, p.loc)), /*#__PURE__*/React.createElement("span", {
    className: "tm"
  }, p.time)), /*#__PURE__*/React.createElement("button", {
    className: "pm-post-more",
    "aria-label": "More options"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 20,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "pm-post-ttl"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "pm-post-body"
  }, lines[0], lines[1] && /*#__PURE__*/React.createElement("span", {
    className: "tags"
  }, " ", lines[1])), /*#__PURE__*/React.createElement("div", {
    className: "pm-post-eng"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:thumbs-up",
    size: 17,
    color: "var(--gray-500)"
  }), p.likes), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 17,
    color: "var(--gray-500)"
  }), p.comments), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:share-2",
    size: 17,
    color: "var(--gray-500)"
  }), p.shares)));
}
function PMActivity() {
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "20px"
    }
  }, "Activity")), /*#__PURE__*/React.createElement("div", {
    className: "pm-activity"
  }, PM_ACTIVITY.map((p, i) => /*#__PURE__*/React.createElement(PMPost, {
    key: i,
    p: p
  }))), /*#__PURE__*/React.createElement("button", {
    className: "pm-showall",
    onClick: () => goPM("NewsfeedMobile.html")
  }, "Show all posts"));
}
function useDeviceScalePM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStatePM(calc);
  useEffectPM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobilePM() {
  const [mobile, setMobile] = useStatePM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectPM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function PMScreen() {
  const m = PM_ME;
  const [msgOpen, setMsgOpen] = useStatePM(false);
  const [menuOpen, setMenuOpen] = useStatePM(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-screen",
    "data-screen-label": "Profile (mobile)"
  }, /*#__PURE__*/React.createElement(PMTopBar, {
    onMenu: () => setMenuOpen(true),
    onMessages: () => setMsgOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-avwrap"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: m.name,
    src: m.avatar,
    size: 92,
    className: "pm-ig-av"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.posts), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "posts")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.followers), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "followers")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.following), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "following")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, m.name), /*#__PURE__*/React.createElement("span", {
    className: "pn"
  }, m.role), /*#__PURE__*/React.createElement(DSPM.VerificationSeals, {
    seals: ["verified", "crown", "gold"],
    size: 20
  }), /*#__PURE__*/React.createElement(PMSealBadge, {
    src: "assets/badge-m.svg",
    alt: "Mastery badge",
    label: "Mastery Badge",
    width: 20,
    height: 20,
    style: {
      marginLeft: -5
    }
  }), /*#__PURE__*/React.createElement(PMSealBadge, {
    src: "assets/badge-skinfluencer.png",
    alt: "PROfinity Skinfluencer badge",
    label: "Skinfluencer",
    width: 20,
    height: 22,
    style: {
      marginLeft: -5
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-bio"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "🇬🇧"), " Aesthetic Nurse Practitioner"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "💉"), " Botox · Fillers · Lip Enhancement"), /*#__PURE__*/React.createElement("p", null, m.bio)), /*#__PURE__*/React.createElement("a", {
    className: "pm-ig-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:link",
    size: 17,
    color: "var(--ai-purple)"
  }), "allcaremedical.co.uk"), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-chip"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:map-pin",
    size: 16,
    color: "var(--brand-navy)"
  }), m.location), /*#__PURE__*/React.createElement("span", {
    className: "pm-chip"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:building-2",
    size: 16,
    color: "var(--brand-navy)"
  }), m.clinic), /*#__PURE__*/React.createElement("span", {
    className: "pm-chip add"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:plus",
    size: 16,
    color: "var(--gray-500)"
  }), "Add")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn",
    onClick: () => goPM("ProfileMobile.html")
  }, "Edit Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn navy"
  }, "Share Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn icon",
    "aria-label": "Settings",
    onClick: () => goPM("AccountSettings.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:settings",
    size: 20,
    color: "var(--text-heading)"
  })))), /*#__PURE__*/React.createElement(ProfileSteps, null), /*#__PURE__*/React.createElement(PMMentor, null), /*#__PURE__*/React.createElement(PMActivity, null), /*#__PURE__*/React.createElement(PMSection, {
    title: "Services"
  }, PM_SERVICES.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, s.ti), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, s.su)))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Experience"
  }, PM_EXPERIENCE.map((e, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, e.ti), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, e.yrs), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, e.org), /*#__PURE__*/React.createElement("div", {
    className: "su flag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, "🇬🇧"), e.loc)))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Education"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow media"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-logo"
  }, "JH"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "Johns Hopkins University of USA"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Clinical Foundations of Medicine"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "1990 - 2020")))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Licenses & Certifications"
  }, PM_LICENSES.map((l, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow media",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-logo cert"
  }, "P"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, l), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Profinity Academy"), /*#__PURE__*/React.createElement("div", {
    className: "su muted"
  }, "Issued January 2008"))))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Language"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lang"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, "🇬🇧"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "English (UK)"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Primary")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lang"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, "🇮🇹"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "Italian"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Secondary"))))), /*#__PURE__*/React.createElement("button", {
    className: "pm-logout",
    onClick: () => goPM("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:log-out",
    size: 20,
    color: "var(--error)"
  }), "Logout")), /*#__PURE__*/React.createElement(PMTabBar, null), /*#__PURE__*/React.createElement(MessagesPanelPM, {
    open: msgOpen,
    onClose: () => setMsgOpen(false)
  }), /*#__PURE__*/React.createElement(SideMenuPM, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }));
}
function ProfileMobileApp() {
  const mobile = useIsMobilePM();
  const scale = useDeviceScalePM();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement(PMScreen, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(PMScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ProfileMobileApp, null));
