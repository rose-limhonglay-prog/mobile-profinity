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
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: null
}, {
  key: "Learning",
  label: "Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Agent",
  label: "Agents",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}, {
  key: "Rewards",
  label: "Rewards",
  icon: "lucide:gift",
  href: "RewardsDashboard.html"
}];

/* Side menu, Notifications and Messages come from the shared mobile chrome
   (mobilechrome.jsx — a copy of the newsfeed's), so every page reads the same.
   Resolved at render so script order doesn't matter. */
function SideMenuCM(p) {
  const C = window.PFSideMenuC;
  return C ? /*#__PURE__*/React.createElement(C, p) : null;
}
function NotificationsPanelCM(p) {
  const C = window.PFNotificationsPanelC;
  return C ? /*#__PURE__*/React.createElement(C, p) : null;
}
function MessagesPanelCM(p) {
  const C = window.PFMessagesPanelC;
  return C ? /*#__PURE__*/React.createElement(C, p) : null;
}
function CMTopBar({
  onMenu,
  onBell,
  onMessages
}) {
  /* Shared header points pill from mobilechrome.jsx (lifetime points, taps
     through to Rewards). Resolved at render so script order doesn't matter. */
  const PointsPill = window.PFPointsPillC;
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
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), PointsPill && /*#__PURE__*/React.createElement(PointsPill, null), /*#__PURE__*/React.createElement("button", {
    className: "cm-iconbtn",
    "aria-label": "Search",
    onClick: () => goCM("SearchMobile.html")
  }, /*#__PURE__*/React.createElement(DSCM.Icon, {
    name: "search",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cm-iconbtn",
    "aria-label": "Notifications",
    onClick: () => onBell && onBell()
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
  }, channel, /*#__PURE__*/React.createElement("span", {
    className: "cm-chchev" + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:chevron-down",
    size: 18,
    color: "#fff"
  }))), open && /*#__PURE__*/React.createElement("div", {
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
    className: "cm-dir",
    "aria-label": "Clinician directory",
    title: "Clinician directory",
    onClick: () => goCM("ClinicianDirectory.html")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:map",
    size: 22,
    color: "var(--brand-navy)"
  })));
}

/* ===== "N new posts" pill =====
   Per channel, remember the newest post id the viewer has caught up to
   (pf-community-seen). On open, every post above that id in the channel
   counts as new; a channel never caught up on shows the designed "3 new posts".
   Tapping the pill scrolls to the top and marks the channel seen. Because
   the demo data is static the pill only comes back after a reset —
   `?newposts=1` on the URL (or window.PFCommunityNewPosts.reset()) clears
   the seen state so it reappears for every channel. */
const CM_SEEN_KEY = "pf-community-seen";
const CM_NEWPOSTS_DEFAULT = 3;
function readSeenCM() {
  try {
    return JSON.parse(localStorage.getItem(CM_SEEN_KEY) || "{}") || {};
  } catch (e) {
    return {};
  }
}
function writeSeenCM(bucket, id) {
  try {
    const m = readSeenCM();
    m[bucket] = id;
    localStorage.setItem(CM_SEEN_KEY, JSON.stringify(m));
  } catch (e) {}
}
function channelPostIdsCM(bucket) {
  /* getAllPosts lists the tier sequences before the bucket catalogue, so a
     channel post can appear twice; keeping each id's LAST occurrence yields
     the catalogue order — the same order the channel feed renders in. */
  try {
    const seen = new Set(),
      out = [];
    const all = PFACM.getAllPosts().filter(p => p.bucket === bucket);
    for (let i = all.length - 1; i >= 0; i--) {
      if (!seen.has(all[i].id)) {
        seen.add(all[i].id);
        out.unshift(all[i].id);
      }
    }
    return out;
  } catch (e) {
    return [];
  }
}
function countNewPostsCM(bucket) {
  const ids = channelPostIdsCM(bucket);
  if (!ids.length) return 0;
  const seen = readSeenCM()[bucket];
  const idx = seen ? ids.indexOf(seen) : -1;
  // never caught up (or the remembered post has left the channel) → +3; otherwise the posts above the last-seen one
  return Math.min(idx < 0 ? CM_NEWPOSTS_DEFAULT : idx, 9);
}
(function resetNewPostsFromUrl() {
  try {
    if (new URLSearchParams(location.search).has("newposts")) localStorage.removeItem(CM_SEEN_KEY);
  } catch (e) {}
})();
window.PFCommunityNewPosts = {
  reset() {
    try {
      localStorage.removeItem(CM_SEEN_KEY);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("pf:community-newposts-reset"));
  },
  count: countNewPostsCM
};
function NewPostsPillCM({
  count,
  top,
  onTap
}) {
  if (!count) return null;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cm-newposts",
    style: {
      top
    },
    onClick: onTap,
    "aria-label": count + " new " + (count === 1 ? "post" : "posts") + ", tap to see " + (count === 1 ? "it" : "them")
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:arrow-up",
    size: 16,
    color: "#fff"
  }), count, " new ", count === 1 ? "post" : "posts");
}
const CMTabBar = React.forwardRef(function CMTabBar({
  compact
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "cm-tabs" + (compact ? " cm-tabs-compact" : ""),
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
    size: 20,
    color: t.key === "Community" ? "#fff" : "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
});

/* Hide-on-scroll header (matches the newsfeed): scroll down → the top bar
   collapses away (the channel row stays pinned); scroll back up a little →
   it returns floating, with frosted chip icons + logo. Returns { hidden, floating }. */
function useHeaderHideCM(scrollRef) {
  const [state, setState] = React.useState({
    hidden: false,
    floating: false
  });
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY;
      setState(prev => {
        let hidden = prev.hidden;
        if (y < 40) hidden = false;else if (delta > 6) hidden = true;else if (delta < -6) hidden = false;
        const floating = y > 40;
        return hidden === prev.hidden && floating === prev.floating ? prev : {
          hidden,
          floating
        };
      });
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}
function CMScreen({
  scrollRef
}) {
  /* ?channel=<bucket> (e.g. from a share redirect) opens that channel first. */
  const [channel, setChannel] = React.useState(() => {
    try {
      const b = new URLSearchParams(location.search).get("channel");
      const name = Object.keys(CM_CHANNEL_BUCKET).find(k => CM_CHANNEL_BUCKET[k] === b);
      return name || "Confidence";
    } catch (e) {
      return "Confidence";
    }
  });
  const [msgOpen, setMsgOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const headerRef = React.useRef(null);
  const tabsRef = React.useRef(null);
  const [headerH, setHeaderH] = React.useState(0);
  const [tabsH, setTabsH] = React.useState(0);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useHeaderHideCM(scrollRef);
  const bucket = CM_CHANNEL_BUCKET[channel];
  const [newPosts, setNewPosts] = React.useState(() => countNewPostsCM(bucket));
  React.useEffect(() => {
    setNewPosts(countNewPostsCM(bucket));
  }, [bucket]);
  React.useEffect(() => {
    const onReset = () => setNewPosts(countNewPostsCM(bucket));
    window.addEventListener("pf:community-newposts-reset", onReset);
    return () => window.removeEventListener("pf:community-newposts-reset", onReset);
  }, [bucket]);
  const seeNewPosts = () => {
    const s = scrollRef.current;
    if (s) s.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    const ids = channelPostIdsCM(bucket);
    if (ids.length) writeSeenCM(bucket, ids[0]);
    setNewPosts(0);
  };
  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  /* The channel's pinned-posts accordion (app.jsx PinnedBox) sits at the
     very top of the feed, exactly where the "N new posts" pill floats — so
     push the pill below the accordion's closed header whenever one is
     rendered for this channel. */
  const [pinnedH, setPinnedH] = React.useState(0);
  React.useLayoutEffect(() => {
    const s = scrollRef.current;
    const box = s && s.querySelector(".pf-pinned-box");
    if (!box) {
      setPinnedH(0);
      return;
    }
    const head = box.querySelector(".pf-pinned-box-head") || box;
    const measure = () => setPinnedH(head.offsetHeight + 30);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(head);
    return () => ro.disconnect();
  }, [bucket]);
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
    className: "cm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "Community (mobile)"
  }, /*#__PURE__*/React.createElement("div", {
    ref: headerRef,
    className: "cm-header-wrap" + (chromeHidden ? " cm-header-hidden" : "")
  }, /*#__PURE__*/React.createElement(CMTopBar, {
    onMenu: () => setMenuOpen(true),
    onBell: () => setNotifOpen(true),
    onMessages: () => setMsgOpen(true)
  }), /*#__PURE__*/React.createElement(CMHeader, {
    channel: channel,
    setChannel: setChannel
  })), /*#__PURE__*/React.createElement(NewPostsPillCM, {
    count: newPosts,
    top: headerH + 12 + pinnedH,
    onTap: seeNewPosts
  }), /*#__PURE__*/React.createElement("div", {
    className: "cm-scroll",
    ref: scrollRef,
    style: {
      paddingTop: headerH,
      paddingBottom: tabsH + 34
    }
  }, /*#__PURE__*/React.createElement(PFACM.Feed, {
    channel: bucket
  }), /*#__PURE__*/React.createElement("div", {
    className: "cm-end"
  }, "End of newsfeed")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "m-fab" + (chromeHidden ? " m-fab-compact" : ""),
    "aria-label": "Share a Post",
    onClick: () => {
      try {
        sessionStorage.setItem("pf_post_channels", JSON.stringify([channel]));
      } catch (e) {}
      goCM("CreatePostMobile.html?from=community");
    }
  }, /*#__PURE__*/React.createElement(DSCM.IconifyIcon, {
    name: "lucide:plus",
    size: 24,
    color: "#fff"
  })), /*#__PURE__*/React.createElement(CMTabBar, {
    ref: tabsRef,
    compact: chromeHidden
  }), /*#__PURE__*/React.createElement(SideMenuCM, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }), /*#__PURE__*/React.createElement(NotificationsPanelCM, {
    open: notifOpen,
    onClose: () => setNotifOpen(false)
  }), /*#__PURE__*/React.createElement(MessagesPanelCM, {
    open: msgOpen,
    onClose: () => setMsgOpen(false)
  }));
}
function CommunityMobileApp() {
  const mobile = useIsMobileCM();
  const scrollRef = React.useRef(null);
  const scale = useDeviceScaleCM();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  const screen = /*#__PURE__*/React.createElement(CMScreen, {
    scrollRef: scrollRef
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
