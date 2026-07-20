/* ===========================================================================
   PROfinity — Shared mobile chrome (top bar + side menu + notifications)
   Self-contained; loaded on Learning/Profile/Community/Events mobile pages so
   they get the same header as the Newsfeed. Suffixed -C to avoid scope clashes;
   does NOT depend on window.PFApp. Exposes window.MobileChromeC.
   =========================================================================== */
(function () {
  const {
    useState: useStateC,
    useEffect: useEffectC
  } = React;
  const DSC = window.ProfinityDesignSystem_c2b5cc;
  function goC(url) {
    (window.pfGo || function (u) {
      window.location.href = u;
    })(url);
  }
  const ME_C = {
    name: "Katy Wilson",
    avatar: "assets/avatar-katy.jpg"
  };
  function MTopBarC({
    onMenu,
    onBell,
    onMessages,
    dark
  }) {
    return /*#__PURE__*/React.createElement("header", {
      className: "m-top"
    }, /*#__PURE__*/React.createElement("button", {
      className: "m-burger",
      "aria-label": "Menu",
      onClick: onMenu
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:menu",
      size: 24,
      color: "var(--gray-700)"
    })), /*#__PURE__*/React.createElement("img", {
      src: dark ? "assets/profinity-logo-dark.jpg" : "assets/profinity-academy-logo-full.png",
      alt: "PROfinity Academy"
    }), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn",
      "aria-label": "Search"
    }, /*#__PURE__*/React.createElement(DSC.Icon, {
      name: "search",
      size: 20,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn",
      "aria-label": "Notifications",
      onClick: () => onBell && onBell()
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:bell",
      size: 20,
      color: "var(--brand-navy)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, "12")), /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn",
      "aria-label": "Messages",
      onClick: () => onMessages && onMessages()
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:message-circle",
      size: 20,
      color: "var(--brand-navy)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, "12")));
  }
  const SM_CHANNELS_C = [{
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
  const SM_RESOURCES_C = [{
    label: "Videos",
    icon: "lucide:square-play",
    n: 8
  }, {
    label: "Articles",
    icon: "lucide:feather",
    n: 4
  }, {
    label: "Webinars",
    icon: "lucide:calendar"
  }];
  const SM_COURSES_C = [{
    label: "Face Anatomy Masterclass",
    pct: 72
  }, {
    label: "Lip Filler Techniques",
    pct: 45
  }, {
    label: "Advanced Botox Training",
    pct: 20
  }];
  const SM_EVENTS_C = [{
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
  const SM_PROFILE_C = [{
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
  }, {
    label: "Display Settings",
    icon: "lucide:cpu",
    href: "DisplaySettings.html"
  }, {
    label: "Privacy & Security",
    icon: "lucide:book-open",
    href: null
  }];
  const NOTIFS_C = {
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
  const NT_BADGE_C = {
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
  const NT_MENU_C = [{
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
  function NotifRowC({
    n
  }) {
    const b = NT_BADGE_C[n.type];
    const [menu, setMenu] = useStateC(false);
    useEffectC(() => {
      if (!menu) return;
      const close = () => setMenu(false);
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }, [menu]);
    return /*#__PURE__*/React.createElement("div", {
      className: "nt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "nt-av"
    }, /*#__PURE__*/React.createElement(DSC.Avatar, {
      name: n.who,
      src: n.avatar,
      size: 58
    }), b && /*#__PURE__*/React.createElement("span", {
      className: "nt-badge",
      style: {
        background: b.bg
      }
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:more-vertical",
      size: 20,
      color: "var(--gray-450)"
    })), menu && /*#__PURE__*/React.createElement("div", {
      className: "nt-menu",
      role: "menu",
      onClick: e => e.stopPropagation()
    }, NT_MENU_C.map(m => /*#__PURE__*/React.createElement("button", {
      key: m.label,
      className: "nt-menu-item",
      role: "menuitem",
      onClick: () => setMenu(false)
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: m.icon,
      size: 19,
      color: "var(--gray-700)"
    }), m.label)))));
  }
  function NotificationsPanelC({
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.Icon, {
      name: "search",
      size: 20,
      color: "var(--gray-450)"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Search notifications",
      "aria-label": "Search notifications"
    })), /*#__PURE__*/React.createElement("div", {
      className: "nt-body"
    }, Object.keys(NOTIFS_C).map(sec => /*#__PURE__*/React.createElement("div", {
      key: sec,
      className: "nt-group"
    }, /*#__PURE__*/React.createElement("div", {
      className: "nt-sec-h"
    }, sec.toUpperCase(), sec === "New" && /*#__PURE__*/React.createElement("span", {
      className: "nt-sec-dot"
    })), NOTIFS_C[sec].map((n, i) => /*#__PURE__*/React.createElement(NotifRowC, {
      key: i,
      n: n
    })))))));
  }
  const DM_THREADS_SEED_C = [{
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
  const VOICE_CONFS_SEED_C = [{
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
  function readDmGroupsC() {
    try {
      return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function groupDisplayNameC(members) {
    const names = members.map(m => m.name.replace(/^Dr\s+/, ""));
    return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
  }
  function createDmGroupC(members, customName) {
    const hasCustomName = !!(customName || "").trim();
    const group = {
      id: "group-" + Date.now(),
      isGroup: true,
      customName: hasCustomName,
      name: hasCustomName ? customName.trim() : groupDisplayNameC(members),
      members,
      messages: []
    };
    const groups = readDmGroupsC();
    groups.unshift(group);
    try {
      localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups));
    } catch (e) {}
    return group;
  }
  function GroupAvatarStackC({
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
    }, /*#__PURE__*/React.createElement(DSC.Avatar, {
      name: m.name,
      src: m.avatar,
      size: Math.round(s * 0.68)
    }))));
  }
  function MessagesRowC({
    c,
    onOpen
  }) {
    const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
    return /*#__PURE__*/React.createElement("button", {
      className: "mp-row",
      onClick: onOpen
    }, /*#__PURE__*/React.createElement("span", {
      className: "mp-av"
    }, c.isGroup ? /*#__PURE__*/React.createElement(GroupAvatarStackC, {
      members: c.members
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSC.Avatar, {
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
    }, last ? last.text : c.isGroup ? c.members.length + " members" : ""), c.muted ? /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:bell-off",
      size: 16,
      color: "var(--gray-450)"
    }) : c.unread > 0 && /*#__PURE__*/React.createElement("span", {
      className: "mp-badge"
    }, c.unread))));
  }
  function NewConversationScreenC({
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.Icon, {
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
      }, /*#__PURE__*/React.createElement(DSC.Avatar, {
        name: c.name,
        src: c.avatar,
        size: 44
      })), /*#__PURE__*/React.createElement("span", {
        className: "mp-new-name"
      }, c.name), /*#__PURE__*/React.createElement("span", {
        className: "mp-new-check" + (on ? " on" : "")
      }, on && /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
  function VoiceConfRowC({
    v
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "mp-row mp-vc-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mp-av mp-vc-icon"
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
  function MessagesPanelC({
    open,
    onClose
  }) {
    const [tab, setTab] = useStateC("messages");
    const [query, setQuery] = useStateC("");
    const [screen, setScreen] = useStateC("list");
    const [groups, setGroups] = useStateC([]);
    const [picked, setPicked] = useStateC([]);
    const [ncQuery, setNcQuery] = useStateC("");
    const [groupName, setGroupName] = useStateC("");
    useEffectC(() => {
      if (!open) {
        setQuery("");
        setScreen("list");
        setPicked([]);
        setNcQuery("");
        setGroupName("");
      } else {
        setGroups(readDmGroupsC());
      }
    }, [open]);
    const allThreads = [...groups, ...DM_THREADS_SEED_C];
    const filtered = allThreads.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
    const unreadTotal = DM_THREADS_SEED_C.reduce((n, t) => n + (t.unread || 0), 0);
    function openThread(id) {
      goC("DirectMessage.html?id=" + id + "&from=LearningMobile.html");
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
      const members = DM_THREADS_SEED_C.filter(c => picked.includes(c.id)).map(c => ({
        id: c.id,
        name: c.name,
        avatar: c.avatar
      }));
      const group = createDmGroupC(members, groupName);
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
      }, /*#__PURE__*/React.createElement(NewConversationScreenC, {
        contacts: DM_THREADS_SEED_C,
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:phone",
      size: 16,
      color: tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"
    }), "Voice Conference", /*#__PURE__*/React.createElement("span", {
      className: "mp-tab-badge"
    }, VOICE_CONFS_SEED_C.length))), /*#__PURE__*/React.createElement("div", {
      className: "nt-search mp-search"
    }, /*#__PURE__*/React.createElement(DSC.Icon, {
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
    }, tab === "messages" ? filtered.map(c => /*#__PURE__*/React.createElement(MessagesRowC, {
      key: c.id,
      c: c,
      onOpen: () => openThread(c.id)
    })) : VOICE_CONFS_SEED_C.map(v => /*#__PURE__*/React.createElement(VoiceConfRowC, {
      key: v.id,
      v: v
    })))));
  }
  function SmSectionC({
    title
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sm-sec-h"
    }, title);
  }
  function DisplayToggleC({
    dark,
    onToggle
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sm-display"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sm-display-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-display-title"
    }, "Display"), /*#__PURE__*/React.createElement("span", {
      className: "sm-display-sub"
    }, "Adjust the appearance of the app to reduce glare and give your eyes a break")), /*#__PURE__*/React.createElement("button", {
      className: "sm-display-toggle" + (dark ? " on" : ""),
      role: "switch",
      "aria-checked": dark,
      "aria-label": "Toggle dark mode",
      onClick: onToggle
    }, /*#__PURE__*/React.createElement("span", {
      className: "knob"
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: dark ? "lucide:moon" : "lucide:sun",
      size: 13,
      color: dark ? "var(--brand-navy)" : "var(--premium-orange)"
    }))));
  }
  function SideMenuC({
    open,
    onClose,
    dark,
    onToggleDark
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-wrap" + (open ? " open" : ""),
      "aria-hidden": !open
    }, /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("aside", {
      className: "m-drawer" + (dark ? " sm-dark" : ""),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Menu"
    }, /*#__PURE__*/React.createElement("button", {
      className: "m-drawer-profile",
      onClick: () => goC("ProfileMobile.html")
    }, /*#__PURE__*/React.createElement(DSC.Avatar, {
      name: ME_C.name,
      src: ME_C.avatar,
      size: 56
    }), /*#__PURE__*/React.createElement("span", {
      className: "m-dp-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "m-dp-name"
    }, "Katy Wilson", /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:badge-check",
      size: 18,
      color: "var(--reaction-like)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "m-dp-role"
    }, "Registered Nurse")), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 22,
      color: "var(--gray-800)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sm-body"
    }, /*#__PURE__*/React.createElement(SmSectionC, {
      title: "Communities"
    }), /*#__PURE__*/React.createElement("button", {
      className: "sm-tier",
      onClick: () => goC("CommunityMobile.html")
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
    }, SM_CHANNELS_C.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.label,
      className: "sm-row",
      onClick: () => goC("CommunityMobile.html")
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, c.n)))), /*#__PURE__*/React.createElement(SmSectionC, {
      title: "Membership Resources"
    }), /*#__PURE__*/React.createElement("nav", {
      className: "sm-list"
    }, SM_RESOURCES_C.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.label,
      className: "sm-row",
      onClick: () => goC("LearningMobile.html")
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: c.icon,
      size: 23,
      color: "var(--gray-900)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-row-label",
      style: {
        color: "rgb(0, 0, 0)"
      }
    }, c.label), c.n != null && /*#__PURE__*/React.createElement("span", {
      className: "sm-badge sm-badge-gray"
    }, c.n)))), /*#__PURE__*/React.createElement(SmSectionC, {
      title: "My Courses"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sm-courses"
    }, SM_COURSES_C.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.label,
      className: "sm-course",
      onClick: () => goC("LearningMobile.html")
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-course-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-course-thumb"
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, c.pct, "% complete")))), /*#__PURE__*/React.createElement(SmSectionC, {
      title: "Upcoming Events"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sm-events"
    }, SM_EVENTS_C.map(e => /*#__PURE__*/React.createElement("button", {
      key: e.label,
      className: "sm-event",
      onClick: () => goC("EventsMobile.html")
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
    }, e.tag)))), /*#__PURE__*/React.createElement(SmSectionC, {
      title: "My Profile"
    }), /*#__PURE__*/React.createElement("button", {
      className: "sm-row sm-verify",
      onClick: () => goC("ProfileMobile.html")
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, SM_PROFILE_C.map(c => c.label === "Display Settings" ? /*#__PURE__*/React.createElement(DisplayToggleC, {
      key: c.label,
      dark: dark,
      onToggle: onToggleDark
    }) : /*#__PURE__*/React.createElement("button", {
      key: c.label,
      className: "sm-row",
      onClick: () => goC(c.href)
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: c.icon,
      size: 23,
      color: "var(--gray-900)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-row-label"
    }, c.label), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 20,
      color: "var(--gray-450)"
    })))), /*#__PURE__*/React.createElement("button", {
      className: "m-drawer-logout",
      onClick: onClose
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:log-out",
      size: 22,
      color: "var(--error)"
    }), "Logout"))));
  }
  function MobileChromeC() {
    const [menuOpen, setMenuOpen] = useStateC(false);
    const [notifOpen, setNotifOpen] = useStateC(false);
    const [msgOpen, setMsgOpen] = useStateC(false);
    const [dark, setDark] = useStateC(() => {
      try {
        return localStorage.getItem("pf-mobile-dark") === "1";
      } catch (e) {
        return false;
      }
    });
    useEffectC(() => {
      try {
        localStorage.setItem("pf-mobile-dark", dark ? "1" : "0");
      } catch (e) {}
    }, [dark]);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MTopBarC, {
      onMenu: () => setMenuOpen(true),
      onBell: () => setNotifOpen(true),
      onMessages: () => setMsgOpen(true),
      dark: dark
    }), /*#__PURE__*/React.createElement(SideMenuC, {
      open: menuOpen,
      onClose: () => setMenuOpen(false),
      dark: dark,
      onToggleDark: () => setDark(v => !v)
    }), /*#__PURE__*/React.createElement(NotificationsPanelC, {
      open: notifOpen,
      onClose: () => setNotifOpen(false)
    }), /*#__PURE__*/React.createElement(MessagesPanelC, {
      open: msgOpen,
      onClose: () => setMsgOpen(false)
    }));
  }
  window.MobileChromeC = MobileChromeC;
})();