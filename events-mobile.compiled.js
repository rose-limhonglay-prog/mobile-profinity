/* ===========================================================================
   PROfinity — Events (mobile)
   Upcoming Events list → Event Detail → live video call (with Live Chat).
   Composed on the bound DS bundle. Suffixed -EV to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateEV,
  useEffect: useEffectEV
} = React;
const DSEV = window.ProfinityDesignSystem_c2b5cc;
const PFAEV = window.PFApp;
function goEV(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const EVENTS_LIST = [{
  id: "tt",
  title: "Technique Tuesday",
  host: "Dr Tim Pearce",
  banner: "assets/event-technique-tuesday.png",
  date: "March 17, 2026",
  time: "20:00 GMT",
  primary: true
}, {
  id: "ac",
  title: "Art Codes Live Webinar",
  host: "Dr Tim Pearce",
  banner: "assets/event-art-codes.png",
  date: "March 24, 2026",
  time: "19:00 GMT",
  primary: false
}, {
  id: "ch",
  title: "Chew the FATPAD",
  host: "Dr Tim Pearce",
  banner: "assets/event-art-codes.png",
  date: "June 12, 2026",
  time: "21:00 BST",
  primary: false
}];
const EV_DETAIL = {
  title: "Chew the FATPAD",
  host: "Dr Tim Pearce",
  banner: "assets/event-technique-tuesday.png",
  date: "June 12, 2026",
  time: "9:00 PM",
  attendees: "380",
  about: "Join Dr. Tim Pearce every week for Technique Tuesday, a live, interactive session where he shares his expert knowledge, answers your burning questions, and demonstrates the latest techniques in aesthetic medicine. Don't miss this opportunity to enhance your skills and stay ahead of the curve!",
  learn: ["Step-by-Step Technique demonstration", "Interactive Group Exercise", "Individual Feedback Sessions", "Real-world Case Studies", "Q&A Panel Discussion"],
  stats: [{
    n: "342",
    l: "Attendees",
    s: "Joined"
  }, {
    n: "45",
    l: "Pending",
    s: "Awaiting"
  }, {
    n: "12",
    l: "Cancelled",
    s: "Withdrawn"
  }],
  status: [{
    icon: "lucide:calendar",
    t: "17 August 2026"
  }, {
    icon: "lucide:clock",
    t: "20:00 GMT | 16:00 ET"
  }, {
    icon: "lucide:timer",
    t: "60 minutes"
  }, {
    icon: "lucide:video",
    t: "Live Webinar"
  }, {
    icon: "lucide:star",
    t: "Premium Event"
  }],
  attend: ["Aesthetic Practitioners", "Holistic Health Coaches", "Fitness Instructors", "Nutritional Therapists", "Wellness Consultants"]
};
const EV_TABS = [{
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
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Agent",
  label: "Agent",
  icon: "lucide:sparkles",
  href: "Agent.html"
}];
const CALL_PEOPLE = [{
  name: "Sarah",
  avatar: "assets/avatar-katy.jpg"
}, {
  name: "Jordan",
  avatar: "assets/avatar-drtim.png"
}, {
  name: "Priya",
  avatar: "assets/avatar-katy.jpg"
}, {
  name: "Marcus",
  avatar: "assets/avatar-drtim.png"
}];
const CHAT_SEED = [{
  who: "Dr Marcus",
  me: false,
  text: "Hi Katy, I hope you're doing well! I wanted to share a new case study."
}, {
  who: "Katy Wilson",
  me: true,
  text: "Hi Dr Marcus, I trust you're having a productive day! That sounds great."
}, {
  who: "Dr Marcus",
  me: false,
  text: "Yes, I typically use a 22G 70mm cannula with a fanning technique."
}];
function useDeviceScaleEV() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateEV(calc);
  useEffectEV(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileEV() {
  const [mobile, setMobile] = useStateEV(() => window.matchMedia('(max-width:768px)').matches);
  useEffectEV(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function EvTabBar({
  active
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "ev-tabs",
    "aria-label": "Primary"
  }, EV_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "ev-tab" + (t.key === active ? " on" : ""),
    onClick: () => goEV(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: t.icon,
    size: 23,
    color: t.key === active ? "var(--brand-navy)" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), t.label)));
}

/* ---- screen 1: events list ---- */
function EventsList({
  onBack,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-screen",
    "data-screen-label": "Upcoming Events"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ev-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-back",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ev-title"
  }, "Upcoming Events"), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ev-scroll"
  }, /*#__PURE__*/React.createElement("label", {
    className: "ev-search"
  }, /*#__PURE__*/React.createElement(DSEV.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search events\u2026",
    "aria-label": "Search events"
  })), EVENTS_LIST.map(e => /*#__PURE__*/React.createElement("div", {
    className: "ev-card",
    key: e.id,
    onClick: () => onOpen(e)
  }, /*#__PURE__*/React.createElement("img", {
    className: "banner",
    src: e.banner,
    alt: e.title
  }), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "ttl"
  }, e.title), /*#__PURE__*/React.createElement("div", {
    className: "host"
  }, "Hosted by ", /*#__PURE__*/React.createElement("b", null, e.host)), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:calendar",
    size: 18,
    color: "var(--brand-navy)"
  }), e.date), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:clock",
    size: 18,
    color: "var(--brand-navy)"
  }), e.time)), /*#__PURE__*/React.createElement("button", {
    className: "ev-cta" + (e.primary ? "" : " ghost"),
    onClick: ev => {
      ev.stopPropagation();
      onOpen(e);
    }
  }, "View Event"))))), /*#__PURE__*/React.createElement(EvTabBar, {
    active: "Home"
  }));
}

/* ---- screen 2: event detail ---- */
function EventDetail({
  onBack,
  onJoin
}) {
  const d = EV_DETAIL;
  const [tab, setTab] = useStateEV("Overview");
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-screen",
    "data-screen-label": "Event Details"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ev-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-back",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ev-title"
  }, "Event Details"), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ev-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-hero",
    style: {
      backgroundImage: "url(" + d.banner + ")"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-detail-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-live-badge"
  }, "Live Event"), /*#__PURE__*/React.createElement("h1", {
    className: "ttl"
  }, d.title), /*#__PURE__*/React.createElement("div", {
    className: "ev-by"
  }, "Event By: ", /*#__PURE__*/React.createElement("b", null, d.host)), /*#__PURE__*/React.createElement("div", {
    className: "ev-detail-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:calendar",
    size: 20,
    color: "var(--brand-navy)"
  }), d.date), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:clock",
    size: 20,
    color: "var(--brand-navy)"
  }), d.time)), /*#__PURE__*/React.createElement("div", {
    className: "ev-attend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-faces"
  }, CALL_PEOPLE.concat(CALL_PEOPLE.slice(0, 3)).map((p, i) => /*#__PURE__*/React.createElement(DSEV.Avatar, {
    key: i,
    name: p.name,
    src: p.avatar,
    size: 32
  }))), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, d.attendees, " other attendees")), /*#__PURE__*/React.createElement("div", {
    className: "ev-detail-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta",
    onClick: onJoin
  }, "Join Now!"), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta ghost"
  }, "Share Event")), /*#__PURE__*/React.createElement("div", {
    className: "ev-dtabs",
    role: "tablist"
  }, ["Overview", "About the Host", "Agenda"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    role: "tab",
    "aria-selected": tab === t,
    className: "ev-dtab" + (tab === t ? " on" : ""),
    onClick: () => setTab(t)
  }, t))), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "About this event"), /*#__PURE__*/React.createElement("p", {
    className: "ev-sec-p"
  }, d.about), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "You'll learn:"), /*#__PURE__*/React.createElement("ul", {
    className: "ev-checklist"
  }, d.learn.map((l, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check",
    size: 19,
    color: "var(--brand-navy)"
  }), l))), /*#__PURE__*/React.createElement("div", {
    className: "ev-stats"
  }, d.stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "ev-stat",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, s.l), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, s.n), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, s.s)))), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "Event Status"), /*#__PURE__*/React.createElement("div", {
    className: "ev-status"
  }, d.status.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "ev-status-row",
    key: i
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: s.icon,
    size: 20,
    color: "var(--brand-navy)"
  }), s.t))), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "Who Should Attend"), /*#__PURE__*/React.createElement("ul", {
    className: "ev-checklist"
  }, d.attend.map((l, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:check",
    size: 19,
    color: "var(--brand-navy)"
  }), l))), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "Need Help?"), /*#__PURE__*/React.createElement("button", {
    className: "ev-help"
  }, /*#__PURE__*/React.createElement("span", null, "Contact Support - We are here to help if you have any questions about this event."), /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement(EvTabBar, {
    active: "Home"
  }));
}

/* ---- live chat overlay ---- */
function LiveChat({
  open,
  onClose
}) {
  const [msgs, setMsgs] = useStateEV(CHAT_SEED);
  const [v, setV] = useStateEV("");
  const send = () => {
    const t = v.trim();
    if (!t) return;
    setMsgs(m => [...m, {
      who: "Katy Wilson",
      me: true,
      text: t
    }]);
    setV("");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-chat-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-chat-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "ev-chat",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Live Chat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-chat-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "Live Chat"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Close chat",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "var(--text-primary)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ev-chat-body"
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    className: "ev-msg " + (m.me ? "me" : "them"),
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "who"
  }, m.who), /*#__PURE__*/React.createElement("div", {
    className: "bubble"
  }, m.text)))), /*#__PURE__*/React.createElement("div", {
    className: "ev-chat-foot"
  }, /*#__PURE__*/React.createElement("input", {
    value: v,
    onChange: e => setV(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") send();
    },
    placeholder: "Type a message\u2026"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ev-chat-send",
    "aria-label": "Send",
    onClick: send
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:send",
    size: 20,
    color: "var(--white)"
  })))));
}

/* ---- screen 3: video call ---- */
function VideoCall({
  onLeave
}) {
  const [chat, setChat] = useStateEV(false);
  const [muted, setMuted] = useStateEV(true);
  const [cam, setCam] = useStateEV(true);
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-call",
    "data-screen-label": "Live Call"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-call-top"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-twist.png",
    alt: "PROfinity"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ev-call-timer"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:clock",
    size: 17,
    color: "var(--white)"
  }), "00:32:54")), /*#__PURE__*/React.createElement("div", {
    className: "ev-stage"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ev-pip"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar-katy.jpg",
    alt: "You"
  }), /*#__PURE__*/React.createElement("span", null, "You")), /*#__PURE__*/React.createElement("span", {
    className: "ev-name-tag"
  }, "Dr Tim Pearce ", /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:mic",
    size: 15,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ev-mic-off"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:mic-off",
    size: 14,
    color: "var(--white)"
  }), "Mic off")), /*#__PURE__*/React.createElement("div", {
    className: "ev-thumbs"
  }, CALL_PEOPLE.map((p, i) => /*#__PURE__*/React.createElement("div", {
    className: "ev-thumb",
    key: i
  }, /*#__PURE__*/React.createElement("img", {
    src: p.avatar,
    alt: p.name
  }), /*#__PURE__*/React.createElement("span", null, p.name)))), /*#__PURE__*/React.createElement("div", {
    className: "ev-controls"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-ctl" + (muted ? "" : " on"),
    onClick: () => setMuted(m => !m)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cbtn"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: muted ? "lucide:mic-off" : "lucide:mic",
    size: 22,
    color: "var(--white)"
  })), "Mute"), /*#__PURE__*/React.createElement("button", {
    className: "ev-ctl" + (cam ? " on" : ""),
    onClick: () => setCam(c => !c)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cbtn"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: cam ? "lucide:video" : "lucide:video-off",
    size: 22,
    color: "var(--white)"
  })), "Camera"), /*#__PURE__*/React.createElement("button", {
    className: "ev-ctl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cbtn"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:users",
    size: 22,
    color: "var(--white)"
  })), "People"), /*#__PURE__*/React.createElement("button", {
    className: "ev-ctl",
    onClick: () => setChat(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cbtn"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:message-circle",
    size: 22,
    color: "var(--white)"
  })), "Chat"), /*#__PURE__*/React.createElement("button", {
    className: "ev-ctl leave",
    onClick: onLeave
  }, /*#__PURE__*/React.createElement("span", {
    className: "cbtn"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:phone-off",
    size: 22,
    color: "var(--white)"
  })), "Leave")), /*#__PURE__*/React.createElement(LiveChat, {
    open: chat,
    onClose: () => setChat(false)
  }));
}

/* ---- waiting room (between Join Now and the live call) ---- */
function WaitingRoom({
  onBack,
  onAdmit
}) {
  const d = EV_DETAIL;
  const [muted, setMuted] = useStateEV(false);
  const [cam, setCam] = useStateEV(true);
  return /*#__PURE__*/React.createElement("div", {
    className: "ev-screen",
    "data-screen-label": "Waiting Room"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ev-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-back",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ev-title"
  }, "Waiting Room"), /*#__PURE__*/React.createElement("span", {
    className: "spacer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ev-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-wait-banner"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:circle-check",
    size: 26,
    color: "var(--success)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "You're in the waiting room"), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, "The host will let you in shortly. Thank you for your patience."))), /*#__PURE__*/React.createElement("div", {
    className: "ev-wait-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ev-live-badge"
  }, "Live Event"), /*#__PURE__*/React.createElement("h1", {
    className: "ttl"
  }, "Technique Tuesday"), /*#__PURE__*/React.createElement("p", {
    className: "ev-wait-sub"
  }, "Weekly live techniques, Q&A and expert insights to elevate your skills"), /*#__PURE__*/React.createElement("div", {
    className: "ev-wait-host"
  }, /*#__PURE__*/React.createElement(DSEV.Avatar, {
    name: "Dr Tim Pearce",
    src: "assets/avatar-katy.jpg",
    size: 36
  }), "Hosted by ", /*#__PURE__*/React.createElement("b", null, "Dr Tim Pearce")), /*#__PURE__*/React.createElement("div", {
    className: "ev-wait-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:calendar",
    size: 19,
    color: "var(--brand-navy)"
  }), "17 August 2026"), /*#__PURE__*/React.createElement("span", {
    className: "dotsep"
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:clock",
    size: 19,
    color: "var(--brand-navy)"
  }), "20:00 GMT | 16:00 ET")), /*#__PURE__*/React.createElement("div", {
    className: "ev-wait-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:timer",
    size: 19,
    color: "var(--brand-navy)"
  }), "60 minutes")), /*#__PURE__*/React.createElement("button", {
    className: "ev-wait-cal"
  }, /*#__PURE__*/React.createElement("u", null, "Add to calendar"))), /*#__PURE__*/React.createElement("div", {
    className: "ev-wait-video"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/waiting-self-preview.png",
    alt: "You"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ev-wait-you"
  }, "You"), /*#__PURE__*/React.createElement("div", {
    className: "ev-wait-vctl"
  }, /*#__PURE__*/React.createElement("button", {
    className: "vbtn" + (muted ? " off" : ""),
    "aria-label": "Mic",
    onClick: () => setMuted(m => !m)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: muted ? "lucide:mic-off" : "lucide:mic",
    size: 20,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "vbtn" + (cam ? "" : " off"),
    "aria-label": "Camera",
    onClick: () => setCam(c => !c)
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: cam ? "lucide:video" : "lucide:video-off",
    size: 20,
    color: "var(--white)"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ev-detail-actions ev-wait-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta",
    onClick: onAdmit
  }, "Join Now!"), /*#__PURE__*/React.createElement("button", {
    className: "ev-detail-cta ghost"
  }, "Share Event")), /*#__PURE__*/React.createElement("p", {
    className: "ev-wait-note"
  }, "You'll automatically join the live session when the host admits you."), /*#__PURE__*/React.createElement("h2", {
    className: "ev-sec-h"
  }, "Need Help?"), /*#__PURE__*/React.createElement("button", {
    className: "ev-help"
  }, /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:circle-help",
    size: 22,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Contact Support - We are here to help if you have any questions about this event."), /*#__PURE__*/React.createElement(DSEV.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement(EvTabBar, {
    active: "Home"
  }));
}
function EventsContent() {
  const [screen, setScreen] = useStateEV("list"); // list | detail | waiting | call
  return /*#__PURE__*/React.createElement(React.Fragment, null, screen === "list" && /*#__PURE__*/React.createElement(EventsList, {
    onBack: () => goEV("NewsfeedMobile.html"),
    onOpen: () => setScreen("detail")
  }), screen === "detail" && /*#__PURE__*/React.createElement(EventDetail, {
    onBack: () => setScreen("list"),
    onJoin: () => setScreen("waiting")
  }), screen === "waiting" && /*#__PURE__*/React.createElement(WaitingRoom, {
    onBack: () => setScreen("detail"),
    onAdmit: () => setScreen("call")
  }), screen === "call" && /*#__PURE__*/React.createElement(VideoCall, {
    onLeave: () => setScreen("detail")
  }));
}
function EventsApp() {
  const mobile = useIsMobileEV();
  const scale = useDeviceScaleEV();
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
    }, /*#__PURE__*/React.createElement(EventsContent, null));
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
  }, /*#__PURE__*/React.createElement(EventsContent, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(EventsApp, null));