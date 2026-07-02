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
  href: "Agent.html"
}];
function CMTopBar() {
  return /*#__PURE__*/React.createElement("header", {
    className: "cm-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cm-burger",
    "aria-label": "Menu"
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
    "aria-label": "Messages"
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")));
}
const CM_CHANNELS = ["Confidence", "Clinical Chat", "Freedom Path", "Tech Team", "Business & Mindset"];
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
  }, c, c === channel && /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
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
  }, "Share something\u2026"), /*#__PURE__*/React.createElement("button", {
    className: "imgbtn",
    "aria-label": "Add photo",
    onClick: nav
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:image",
    size: 21,
    color: "var(--brand-navy)"
  })));
}
function CMTabBar() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "cm-tabs",
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
}
function CMScreen({
  scrollRef,
  newPosts,
  dismiss
}) {
  const [channel, setChannel] = React.useState("Confidence");
  return /*#__PURE__*/React.createElement("div", {
    className: "cm-screen",
    "data-screen-label": "Community (mobile)"
  }, /*#__PURE__*/React.createElement(CMTopBar, null), /*#__PURE__*/React.createElement(CMHeader, {
    channel: channel,
    setChannel: setChannel
  }), /*#__PURE__*/React.createElement(CMComposer, {
    channel: channel
  }), /*#__PURE__*/React.createElement("div", {
    className: "cm-scroll",
    ref: scrollRef
  }, newPosts > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cm-newposts",
    onClick: dismiss,
    "aria-label": newPosts + " new posts, tap to see them"
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:arrow-up",
    size: 18,
    color: "var(--white)"
  }), newPosts, " New Posts"), /*#__PURE__*/React.createElement(PFACM.Feed, null), /*#__PURE__*/React.createElement("div", {
    className: "cm-end"
  }, "End of newsfeed")), /*#__PURE__*/React.createElement(CMTabBar, null));
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