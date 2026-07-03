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
      "aria-label": "Messages"
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
  const NOTIFS_C = {
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
      dark: dark
    }), /*#__PURE__*/React.createElement(SideMenuC, {
      open: menuOpen,
      onClose: () => setMenuOpen(false),
      dark: dark,
      onToggleDark: () => setDark(v => !v)
    }), /*#__PURE__*/React.createElement(NotificationsPanelC, {
      open: notifOpen,
      onClose: () => setNotifOpen(false)
    }));
  }
  window.MobileChromeC = MobileChromeC;
})();
