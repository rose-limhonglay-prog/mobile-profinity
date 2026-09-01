/* ===========================================================================
   PROfinity — Create Post · iPhone 17 Pro Max mobile
   Reached from CommunityMobile after selecting channels. Reads selected
   channels from sessionStorage key "pf_post_channels" (JSON string[]).
   Suffixed -CP to avoid global-scope clashes.
   =========================================================================== */
const DSCP = window.ProfinityDesignSystem_c2b5cc;
const PFACP = window.PFApp;
function goCP(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleCP() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScaleCP] = React.useState(calc);
  React.useEffect(() => {
    const update = () => setScaleCP(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileCP() {
  const [mobile, setCP] = React.useState(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setCP(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
const CP_AUDIENCE_OPTS = [{
  label: "Everyone",
  icon: "lucide:globe",
  badge: null
}, {
  label: "Members Only",
  icon: "lucide:users",
  badge: "fluent:ribbon-star-16-filled"
}, {
  label: "Patients Only",
  icon: "lucide:user",
  badge: null
}, {
  label: "Clinicians Only",
  icon: "lucide:stethoscope",
  badge: null
}, {
  label: "Only Me",
  icon: "lucide:lock",
  badge: null
}];
function CPAudiencePicker({
  value,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  const current = CP_AUDIENCE_OPTS.find(o => o.label === value) || CP_AUDIENCE_OPTS[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-audience-wrap",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-audience-btn",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: current.icon,
    size: 13,
    color: "var(--brand-navy)"
  }), current.label, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:chevron-down",
    size: 12,
    color: "var(--brand-navy)",
    style: {
      transition: "transform .2s",
      transform: open ? "rotate(180deg)" : "none"
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "cp-audience-menu",
    role: "listbox",
    "aria-label": "Audience"
  }, CP_AUDIENCE_OPTS.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.label,
    role: "option",
    "aria-selected": opt.label === value,
    className: "cp-audience-opt" + (opt.label === value ? " on" : ""),
    onClick: () => {
      onChange(opt.label);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-aopt-ic"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: opt.icon,
    size: 22,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cp-aopt-lbl"
  }, opt.label), opt.badge && /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: opt.badge,
    size: 20,
    color: "#ce9957"
  })))));
}
const CP_ATTACH = [{
  icon: "lucide:image",
  label: "Photo",
  color: "#2d9d5a"
}, {
  icon: "lucide:video",
  label: "Video",
  color: "#e56c1b"
}, {
  icon: "lucide:at-sign",
  label: "Tag people",
  color: "#1d7fc4"
}, {
  icon: "lucide:map-pin",
  label: "Location",
  color: "#d03b3b"
}, {
  icon: "lucide:smile",
  label: "Feeling",
  color: "#d4a017"
}];

/* Background styles for a text-only post, Facebook-style. Only meaningful
   when there are no photos attached — swapping to a style clears images. */
const CP_BACKGROUNDS = [{
  id: "none",
  label: "No background",
  css: "",
  fg: "var(--text-primary)"
}, {
  id: "navy",
  label: "Navy",
  css: "linear-gradient(150deg,#292569,#3d3688)",
  fg: "#fff"
}, {
  id: "gold",
  label: "Gold",
  css: "linear-gradient(150deg,#ce9957,#a26301)",
  fg: "#fff"
}, {
  id: "purple",
  label: "AI purple",
  css: "linear-gradient(150deg,#6c63ff,#4022a8)",
  fg: "#fff"
}, {
  id: "teal",
  label: "Clinical teal",
  css: "linear-gradient(150deg,#25515c,#173840)",
  fg: "#fff"
}, {
  id: "cream",
  label: "Cream",
  css: "linear-gradient(150deg,#fcf4e4,#f3e3c8)",
  fg: "var(--brand-navy)"
}, {
  id: "navygold",
  label: "Navy to gold",
  css: "linear-gradient(150deg,#292569 40%,#ce9957)",
  fg: "#fff"
}, {
  id: "sunrise",
  label: "Sunrise",
  css: "linear-gradient(150deg,#e58f0c,#be1e2d)",
  fg: "#fff"
}, {
  id: "mint",
  label: "Mint",
  css: "linear-gradient(150deg,#2a9568,#186b4a)",
  fg: "#fff"
}, {
  id: "slate",
  label: "Slate",
  css: "linear-gradient(150deg,#475467,#1f2937)",
  fg: "#fff"
}, {
  id: "blush",
  label: "Blush",
  css: "linear-gradient(150deg,#f7d6de,#e9afbe)",
  fg: "var(--brand-navy)"
}, {
  id: "ink",
  label: "Ink",
  css: "#101828",
  fg: "#fff"
}];
function CPStyleSheet({
  value,
  onPick,
  onClose
}) {
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Background style",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-sheet-grip",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-hd"
  }, /*#__PURE__*/React.createElement("h3", null, "Background"), /*#__PURE__*/React.createElement("button", {
    className: "cp-sheet-done",
    "aria-label": "Done",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:check",
    size: 22,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cp-swatches",
    role: "radiogroup",
    "aria-label": "Background style"
  }, CP_BACKGROUNDS.map(b => /*#__PURE__*/React.createElement("button", {
    key: b.id,
    role: "radio",
    "aria-checked": b.id === value,
    "aria-label": b.label,
    className: "cp-swatch" + (b.id === value ? " on" : "") + (b.id === "none" ? " none" : ""),
    style: b.css ? {
      background: b.css
    } : undefined,
    onClick: () => onPick(b.id)
  }, b.id === "none" && /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:ban",
    size: 20,
    color: "var(--gray-450)"
  }), b.id === value && b.id !== "none" && /*#__PURE__*/React.createElement("span", {
    className: "cp-swatch-ck"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:check",
    size: 15,
    color: "var(--brand-navy)"
  })))))));
}

/* Destinations unlock with the membership ladder: a viewer sees their own
   channel and every one below. Read from window.PF_TIER, falling back to
   the "pf-preview-tier" localStorage key used by the mobile preview pages,
   and finally to the poster's real subscription tier so a genuinely free
   member only ever sees "Post to Newsfeed". */
const CP_TIER_ORDER = ["free", "confidence", "mastery", "freedom", "sovereign", "inner"];
function cpTier() {
  if (typeof window === "undefined") return "free";
  if (window.PF_TIER) return window.PF_TIER;
  try {
    const v = localStorage.getItem("pf-preview-tier");
    if (v) return v;
  } catch (e) {}
  return PFACP && PFACP.getUserTier ? PFACP.getUserTier() : "free";
}

/* Going live is a Super User (admin-tier) capability — normal members never
   see the "Live" tab, so the create-post flow can't reach it at all. */
function cpIsSuperUser() {
  return cpTier() === "admin";
}
const CP_DESTS = [{
  k: "feed",
  label: "My feed",
  sub: "Everyone who follows you",
  icon: "lucide:rss",
  tier: 0
}, {
  k: "Confidence Chat",
  label: "Confidence Chat",
  sub: "Community channel",
  icon: "lucide:message-circle",
  tier: 1
}, {
  k: "Mastery Chat",
  label: "Mastery Chat",
  sub: "Community channel",
  icon: "lucide:crown",
  tier: 2
}, {
  k: "Complications Chat",
  label: "Complications Chat",
  sub: "Community channel",
  icon: "lucide:shield-alert",
  tier: 2
}, {
  k: "Freedom Path Chat",
  label: "Freedom Path Chat",
  sub: "Community channel",
  icon: "lucide:rocket",
  tier: 3
}];
function CPChannelSheet({
  dests,
  value,
  onPick,
  onClose
}) {
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Post to",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-sheet-grip",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("h3", null, "Post to"), /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-list",
    role: "radiogroup",
    "aria-label": "Destination"
  }, dests.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.k,
    type: "button",
    role: "radio",
    "aria-checked": value === d.k,
    className: "cp-opt" + (value === d.k ? " on" : ""),
    onClick: () => {
      onPick(d.k);
      onClose();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-ic"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: d.icon,
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-tx"
  }, /*#__PURE__*/React.createElement("b", null, d.label), /*#__PURE__*/React.createElement("i", null, d.sub)), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-rd"
  }, value === d.k && /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:check",
    size: 14,
    color: "#fff"
  })))))));
}
function CPTopBar({
  canPost,
  onPost,
  onCancel,
  actionLabel
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "cp-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-cancel",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement("span", {
    className: "cp-title"
  }, "Create Post"), /*#__PURE__*/React.createElement("button", {
    className: "cp-post-btn",
    disabled: !canPost,
    onClick: onPost
  }, actionLabel || "Post"));
}
const CP_MODES = [{
  id: "post",
  label: "Post",
  icon: "lucide:file-text"
}, {
  id: "live",
  label: "Live",
  icon: "lucide:radio"
}];
function CPModeTabs({
  mode,
  onChange,
  superUser
}) {
  const modes = CP_MODES.filter(m => m.id !== "live" || superUser);
  if (modes.length <= 1) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-mode-tabs",
    role: "tablist",
    "aria-label": "Post type"
  }, modes.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    type: "button",
    role: "tab",
    "aria-selected": mode === m.id,
    className: "cp-mode-tab" + (mode === m.id ? " on" : ""),
    onClick: () => onChange(m.id)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: m.icon,
    size: 15,
    color: mode === m.id ? "#fff" : "var(--brand-navy)"
  }), m.label)));
}

/* Dev-only affordance so the team can preview the Super User (admin-tier)
   Live tab without opening devtools — mirrors the "Previewing as" panel on
   the newsfeed, reusing its pf-preview-* styling. Writes the same
   "pf-preview-tier" override cpTier() already checks first. */
const CP_DEV_PERSONAS = [{
  key: "free",
  name: "Normal user",
  desc: "No Live tab in Create Post."
}, {
  key: "admin",
  name: "Super User",
  desc: "Sees the Live tab + Go Live."
}];
function CPDevSuperUserToggle({
  superUser,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "pf-preview"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-preview-bar",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-preview-label"
  }, "Dev — viewing as"), /*#__PURE__*/React.createElement("span", {
    className: "pf-preview-current"
  }, superUser ? "Super User" : "Normal user"), /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 16,
    color: "var(--gray-500)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "pf-preview-panel"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pf-preview-sec"
  }, "Who's looking?"), /*#__PURE__*/React.createElement("div", {
    className: "pf-preview-personas"
  }, CP_DEV_PERSONAS.map(p => {
    const isAdmin = p.key === "admin";
    return /*#__PURE__*/React.createElement("button", {
      key: p.key,
      type: "button",
      className: "pf-preview-persona" + (isAdmin === superUser ? " on" : ""),
      onClick: () => onChange(isAdmin)
    }, /*#__PURE__*/React.createElement("span", {
      className: "pf-pp-name"
    }, p.name), /*#__PURE__*/React.createElement("span", {
      className: "pf-pp-desc"
    }, p.desc));
  }))));
}
const CP_LIVE_TOOLS = [{
  label: "Flash Off",
  icon: "lucide:zap-off"
}, {
  label: "Rotate",
  icon: "lucide:refresh-cw"
}, {
  label: "Mute mic",
  icon: "lucide:mic-off"
}, {
  label: "Enhance off",
  icon: "lucide:sparkles"
}];

/* Full-screen "go live" camera stage — replaces the whole compose screen
   while mode === "live". Uses a static photo as a stand-in for a live
   camera feed since this prototype has no real capture pipeline. */
function CPLiveStage({
  onBack,
  dest,
  canPickChannel,
  onOpenChannelSheet,
  description,
  onDescriptionChange,
  onGoLive
}) {
  const [descOpen, setDescOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-live-stage",
    style: {
      backgroundImage: "url(assets/live-preview-camera.jpg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-live-scrim-top",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("button", {
    className: "cp-live-back",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cp-live-who"
  }, /*#__PURE__*/React.createElement(DSCP.Avatar, {
    name: PFACP.ME.name,
    src: PFACP.ME.avatar,
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    className: "cp-live-name"
  }, PFACP.ME.name)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-live-dest" + (canPickChannel ? "" : " static"),
    onClick: () => canPickChannel && onOpenChannelSheet()
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:globe",
    size: 13,
    color: "var(--brand-navy)"
  }), dest === "feed" ? "Newsfeed" : dest, canPickChannel && /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:chevron-down",
    size: 12,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cp-live-tools"
  }, CP_LIVE_TOOLS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.label,
    type: "button",
    className: "cp-live-tool"
  }, /*#__PURE__*/React.createElement("span", null, t.label), /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: t.icon,
    size: 20,
    color: "#fff"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "cp-live-scrim-bottom",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cp-live-bottom"
  }, descOpen ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    className: "cp-live-desc-input",
    placeholder: "Add a description...",
    value: description,
    onChange: e => onDescriptionChange(e.target.value),
    onBlur: () => setDescOpen(false)
  }) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-live-desc-btn",
    onClick: () => setDescOpen(true)
  }, description || "Tap to add a description..."), /*#__PURE__*/React.createElement("button", {
    className: "cp-live-go-btn",
    onClick: onGoLive
  }, "Go Live")));
}

/* Full-screen live broadcast — mounted once the host taps "Go Live" (no page
   navigation, a pure in-app stage change), or as SocialStream.html's whole
   page for an audience member (?watch=1) or a co-host arriving from an
   invite (?cohost=1). */
const CP_BCAST_GUESTS = [{
  u: "@mirandapearce",
  n: "Miranda Pearce",
  av: "assets/avatar-miranda.jpg",
  f: "15.6K followers"
}, {
  u: "@drtimpearce",
  n: "Dr Tim Pearce",
  av: "assets/avatar-drtim.png",
  f: "28.3K followers"
}, {
  u: "@katywilson",
  n: "Katy Wilson",
  av: "assets/avatar-katy.jpg",
  f: "9.1K followers"
}, {
  u: "@gracelindqvist",
  n: "Grace Lindqvist",
  av: "assets/waiting-self-preview.png",
  f: "47.5K followers"
}];
function CPBroadcastStage({
  dest,
  watch,
  social,
  onClose
}) {
  const [secs, setSecs] = React.useState(0);
  const [chat, setChat] = React.useState([{
    n: "Miranda Pearce",
    t: "Just joined — can't wait for this one 👀"
  }, {
    n: "Dr Tim Pearce",
    t: "Great topic. Are you covering cannula depth?"
  }]);
  const [msg, setMsg] = React.useState("");
  const [guestSheet, setGuestSheet] = React.useState(false);
  const [guests, setGuests] = React.useState(() => {
    try {
      return new URLSearchParams(location.search).get("cohost") === "1" ? [{
        u: "@mirandapearce",
        n: "Miranda Pearce",
        av: "assets/avatar-miranda.jpg",
        f: "15.6K followers"
      }] : [];
    } catch (e) {
      return [];
    }
  });
  const [invited, setInvited] = React.useState([]);
  const [liveMuted, setLiveMuted] = React.useState(false);
  const [liveCam, setLiveCam] = React.useState(true);
  const [front, setFront] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [hearts, setHearts] = React.useState([]);
  const [confirmEnd, setConfirmEnd] = React.useState(false);
  const [keepPost, setKeepPost] = React.useState(true);
  const liveRef = React.useRef(null);
  const chatRef = React.useRef(null);
  const chatAtBottom = React.useRef(true);
  const opener = React.useRef(typeof document !== "undefined" ? document.activeElement : null);
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (liveRef.current) liveRef.current.focus();
    }, 60);
    return () => clearTimeout(t);
  }, []);
  const close = () => {
    onClose();
    const o = opener.current;
    if (o && o.focus) setTimeout(() => o.focus(), 0);
  };
  React.useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    const k = e => {
      if (e.key !== "Escape") return;
      /* Topmost sheet closes first; only then does Escape reach the broadcast itself. */
      if (guestSheet) setGuestSheet(false);else if (confirmEnd) setConfirmEnd(false);
      /* While hosting, Escape asks first rather than dropping the broadcast. */else if (!watch) setConfirmEnd(true);else close();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [confirmEnd, guestSheet, watch]);

  /* Audience reactions drift up the right edge while the broadcast runs. */
  React.useEffect(() => {
    const emo = ["❤️", "❤️", "💜", "👏", "🔥"];
    let n = 0;
    const t = setInterval(() => {
      const id = ++n;
      const h = {
        id: id,
        x: 14 + Math.random() * 84,
        dur: 4.4 + Math.random() * 2,
        size: 20 + Math.random() * 12,
        rise: 460 + Math.random() * 160,
        e: emo[Math.floor(Math.random() * emo.length)]
      };
      setHearts(s => s.concat(h).slice(-14));
      setTimeout(() => setHearts(s => s.filter(x => x.id !== id)), h.dur * 1000);
    }, 620);
    return () => clearInterval(t);
  }, []);

  /* Audience chatter keeps arriving while the stream runs. */
  React.useEffect(() => {
    const feed = [{
      n: "Aisha Rahman",
      t: "Do you always aspirate on the wet-dry border?"
    }, {
      n: "Grace Lindqvist",
      t: "This is so much clearer than the textbook 🙌"
    }, {
      n: "Jonas Adeyemi",
      t: "What product are you using here?"
    }, {
      n: "Sofia Alarcón",
      t: "Joining from Madrid — thank you for doing these live"
    }, {
      n: "Dr Tim Pearce",
      t: "Good question in the chat about migration — cover that next?"
    }, {
      n: "Olivia Marsh",
      t: "Saved. Watching the replay again tomorrow."
    }, {
      n: "Ravi Chandran",
      t: "How long before you review the result?"
    }, {
      n: "Hana Kobayashi",
      t: "That cannula angle makes so much sense now 🔥"
    }];
    let i = 0;
    const t = setInterval(() => {
      const m = feed[i % feed.length];
      i++;
      setChat(c => c.concat({
        n: m.n,
        t: m.t,
        fresh: true
      }).slice(-60));
    }, 2600);
    return () => clearInterval(t);
  }, []);
  const sendReact = e => {
    const id = "me" + Date.now() + Math.random();
    const h = {
      id: id,
      x: 14 + Math.random() * 84,
      dur: 4.4,
      size: 30,
      rise: 520,
      e: e
    };
    setHearts(s => s.concat(h).slice(-16));
    setTimeout(() => setHearts(s => s.filter(x => x.id !== id)), 4400);
  };
  React.useEffect(() => {
    /* Only snap to the newest message if the reader was already at the bottom —
       otherwise arriving chatter would yank them away from history they scrolled up to read. */
    const el = chatRef.current;
    if (el && chatAtBottom.current) el.scrollTop = el.scrollHeight;
  }, [chat]);
  const onChatScroll = e => {
    const el = e.currentTarget;
    chatAtBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };
  const clock = String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
  const send = () => {
    const v = msg.trim();
    if (!v) return;
    setChat(c => c.concat({
      n: PFACP.ME.name,
      t: v,
      me: true
    }));
    setMsg("");
  };
  const onCam = [].concat([{
    n: "You",
    av: liveCam ? "assets/live-preview-camera.jpg" : PFACP.ME.avatar,
    me: true,
    off: !liveCam
  }], guests.map(g => ({
    n: g.n.split(" ")[0],
    av: g.av
  })));
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Live broadcast"
  }, onCam.length > 1 ? /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-grid n" + Math.min(onCam.length, 4)
  }, onCam.slice(0, 4).map(p => /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-cell" + (p.off ? " camoff" : ""),
    key: p.n
  }, /*#__PURE__*/React.createElement("img", {
    className: p.me && !front ? "rear" : undefined,
    src: p.av,
    alt: ""
  }), p.off && /*#__PURE__*/React.createElement("span", {
    className: "co"
  }, "Camera off"), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, p.n, p.me && liveMuted && /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:mic-off",
    size: 11,
    color: "#fff"
  }))))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
    className: "cp-bcast-cam" + (front ? "" : " rear") + (liveCam ? "" : " hidden"),
    src: "assets/live-preview-camera.jpg",
    alt: ""
  }), !liveCam && /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-camoff"
  }, /*#__PURE__*/React.createElement("img", {
    src: PFACP.ME.avatar,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", null, "Your camera is off"))), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-bcast-dot"
  }, "LIVE"), /*#__PURE__*/React.createElement("span", {
    className: "cp-bcast-clock"
  }, clock), /*#__PURE__*/React.createElement("span", {
    className: "cp-bcast-viewers"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:eye",
    size: 15,
    color: "#fff"
  }), "142"), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-guest-btn",
    "aria-label": "Add guest",
    onClick: () => setGuestSheet(true)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:user-plus",
    size: 17,
    color: "#fff"
  }), "Add guest"), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-x",
    "aria-label": watch ? "Leave live" : "End broadcast",
    ref: liveRef,
    onClick: () => watch ? close() : setConfirmEnd(true)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "#fff"
  }))), watch && /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-host"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar-miranda.jpg",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Miranda Pearce"), /*#__PURE__*/React.createElement("i", null, "Live Q&A: correcting migrated lip filler")), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-follow"
  }, "Follow")), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-chat",
    ref: chatRef,
    onScroll: onChatScroll
  }, chat.map((c, i) => /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-msg" + (c.me ? " me" : "") + (c.fresh ? " in" : ""),
    key: i
  }, /*#__PURE__*/React.createElement("b", null, c.n), " ", c.t))), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-hearts",
    "aria-hidden": "true"
  }, hearts.map(h => /*#__PURE__*/React.createElement("span", {
    className: "cp-bcast-heart",
    key: h.id,
    style: {
      right: h.x + "px",
      animationDuration: h.dur + "s",
      fontSize: h.size + "px",
      "--rise": h.rise + "px"
    }
  }, h.e))), !watch && /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-tools"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-tool" + (liveMuted ? " off" : ""),
    "aria-label": liveMuted ? "Unmute microphone" : "Mute microphone",
    "aria-pressed": liveMuted,
    onClick: () => setLiveMuted(!liveMuted)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: liveMuted ? "lucide:mic-off" : "lucide:mic",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-tool" + (liveCam ? "" : " off"),
    "aria-label": liveCam ? "Turn camera off" : "Turn camera on",
    "aria-pressed": !liveCam,
    onClick: () => setLiveCam(!liveCam)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: liveCam ? "lucide:video" : "lucide:video-off",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-tool",
    "aria-label": "Flip camera",
    onClick: () => setFront(!front)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:refresh-cw",
    size: 19,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-input"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Say something…",
    "aria-label": "Live chat message",
    value: msg,
    onChange: e => setMsg(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") send();
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-send",
    "aria-label": "Send",
    onClick: send
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:send",
    size: 18,
    color: "#fff"
  })), watch && /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-react"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-react-main",
    type: "button",
    "aria-label": "React with a heart",
    onClick: () => sendReact("❤️")
  }, "❤️"), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-react-more",
    role: "group",
    "aria-label": "More reactions"
  }, ["💜", "👏", "🔥", "🙌", "😮"].map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    type: "button",
    "aria-label": "React " + e,
    onClick: () => sendReact(e)
  }, e)))))), guestSheet && /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-guest",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Invite a guest",
    onClick: e => {
      if (e.target === e.currentTarget) setGuestSheet(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-guest-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-sheet-grip"
  }), /*#__PURE__*/React.createElement("h3", null, "Invite a guest"), /*#__PURE__*/React.createElement("p", {
    className: "cp-bcast-guest-p"
  }, "Guests you bring on become co-hosts — they can invite people too."), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-guest-search"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:search",
    size: 18,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search users",
    "aria-label": "Search users"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-guest-list"
  }, CP_BCAST_GUESTS.map(g => {
    const on = guests.some(x => x.u === g.u);
    const pending = !on && invited.indexOf(g.u) !== -1;
    return /*#__PURE__*/React.createElement("div", {
      className: "cp-bcast-guest-row",
      key: g.u
    }, /*#__PURE__*/React.createElement("img", {
      src: g.av,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, /*#__PURE__*/React.createElement("b", null, g.u), /*#__PURE__*/React.createElement("i", null, pending ? "Waiting to accept…" : g.f)), /*#__PURE__*/React.createElement("button", {
      className: "cp-bcast-guest-invite" + (on ? " on" : "") + (pending ? " pending" : ""),
      disabled: on || pending,
      onClick: () => {
        setInvited(s => s.concat(g.u));
        setTimeout(() => setGuests(s => s.some(x => x.u === g.u) ? s : s.concat(g)), 2200);
      }
    }, on ? "Co-host" : pending ? "Invited" : "Invite"));
  })), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-guest-link",
    onClick: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: copied ? "lucide:check" : "lucide:link",
    size: 20,
    color: copied ? "var(--success)" : "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, copied ? "Link copied" : "Copy invite link"), /*#__PURE__*/React.createElement("i", null, "Share the link to invite others")), /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 19,
    color: "var(--gray-450)"
  })))), confirmEnd && /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-endc",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "End live broadcast",
    onClick: e => {
      if (e.target === e.currentTarget) setConfirmEnd(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-endc-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-bcast-endc-ic"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:radio",
    size: 26,
    color: "var(--error)"
  })), /*#__PURE__*/React.createElement("h3", null, "End this live video?"), /*#__PURE__*/React.createElement("p", null, "You've been live for ", /*#__PURE__*/React.createElement("b", null, clock), " with ", /*#__PURE__*/React.createElement("b", null, "142 viewers"), ". Ending stops the broadcast for everyone — you can't resume it."), /*#__PURE__*/React.createElement("label", {
    className: "cp-bcast-endc-keep"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: keepPost,
    onChange: e => setKeepPost(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", {
    className: "bx"
  }, keepPost && /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:check",
    size: 13,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, "Post the replay to ", dest), /*#__PURE__*/React.createElement("i", null, "Members who missed it can still watch. Untick to discard the recording."))), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-endc-go",
    onClick: close
  }, keepPost ? "End live & post replay" : "End live & discard"), /*#__PURE__*/React.createElement("button", {
    className: "cp-bcast-endc-cancel",
    onClick: () => setConfirmEnd(false)
  }, "Keep streaming"))));
}

/* Full-screen cover picker for an attached reel — scrubs the actual sample
   video to real frames (via canvas capture) so the filmstrip is genuine,
   not faked. "Add from camera roll" lets a custom image override any frame. */
const CP_COVER_FRAME_COUNT = 6;
function CPCoverPicker({
  video,
  onConfirm,
  onClose
}) {
  const hiddenVideoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [frames, setFrames] = React.useState([]);
  const [building, setBuilding] = React.useState(true);
  const [selected, setSelected] = React.useState(video.cover ? {
    src: video.cover,
    custom: video.coverIsCustom || false
  } : null);
  React.useEffect(() => {
    const v = hiddenVideoRef.current;
    const canvas = canvasRef.current;
    if (!v || !canvas) return;
    let cancelled = false;
    const captureAt = t => new Promise(resolve => {
      const onSeeked = () => {
        v.removeEventListener("seeked", onSeeked);
        const ctx = canvas.getContext("2d");
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      v.addEventListener("seeked", onSeeked);
      v.currentTime = t;
    });
    const build = async () => {
      await new Promise(resolve => {
        if (v.readyState >= 1) resolve();else v.addEventListener("loadedmetadata", resolve, {
          once: true
        });
      });
      if (cancelled) return;
      const dur = v.duration || 1;
      const out = [];
      for (let i = 0; i < CP_COVER_FRAME_COUNT; i++) {
        const t = Math.min(dur - 0.05, dur * (i + 0.5) / CP_COVER_FRAME_COUNT);
        const src = await captureAt(Math.max(0, t));
        if (cancelled) return;
        out.push({
          time: t,
          src
        });
        setFrames(prev => [...prev, {
          time: t,
          src
        }]);
      }
      if (!cancelled && !selected) {
        setSelected({
          src: out[0].src,
          custom: false,
          time: out[0].time
        });
      }
      setBuilding(false);
    };
    build();
    return () => {
      cancelled = true;
    };
  }, []);
  const pickFromCameraRoll = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setSelected({
        src: reader.result,
        custom: true
      });
      reader.readAsDataURL(file);
    };
    input.click();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-cover-picker",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Edit cover"
  }, /*#__PURE__*/React.createElement("video", {
    ref: hiddenVideoRef,
    src: video.src,
    muted: true,
    playsInline: true,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("header", {
    className: "cp-cover-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-cover-x",
    "aria-label": "Cancel",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cp-cover-title"
  }, "Edit cover"), /*#__PURE__*/React.createElement("button", {
    className: "cp-cover-check",
    "aria-label": "Use this cover",
    disabled: !selected,
    onClick: () => selected && onConfirm(selected)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:check",
    size: 20,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "cp-cover-hint"
  }, "Select a cover image from your video or camera roll."), /*#__PURE__*/React.createElement("div", {
    className: "cp-cover-preview"
  }, selected ? /*#__PURE__*/React.createElement("img", {
    src: selected.src,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "cp-cover-loading"
  }, "Loading frames…")), /*#__PURE__*/React.createElement("div", {
    className: "cp-cover-filmstrip",
    role: "radiogroup",
    "aria-label": "Video frame"
  }, frames.map((f, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    role: "radio",
    "aria-checked": !!selected && !selected.custom && selected.src === f.src,
    className: "cp-cover-frame" + (selected && !selected.custom && selected.src === f.src ? " on" : ""),
    onClick: () => setSelected({
      src: f.src,
      custom: false,
      time: f.time
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: f.src,
    alt: ""
  }))), building && frames.length < CP_COVER_FRAME_COUNT && Array.from({
    length: CP_COVER_FRAME_COUNT - frames.length
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    className: "cp-cover-frame-skel",
    key: "s" + i,
    "aria-hidden": "true"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "cp-cover-roll-btn",
    onClick: pickFromCameraRoll
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:image",
    size: 17,
    color: "var(--brand-navy)"
  }), "Add from camera roll"));
}
function CPTagPicker({
  tags,
  selected,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-attach-label"
  }, "Add hashtags"), /*#__PURE__*/React.createElement("div", {
    className: "pf-tagbar"
  }, tags.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.slug,
    type: "button",
    className: "pf-tagchip" + (selected.includes(t.slug) ? " on" : ""),
    onClick: () => onToggle(t.slug)
  }, "#", t.label))));
}
function CPScreen() {
  const bcastParams = new URLSearchParams(window.location.search);
  const isSocial = typeof window !== "undefined" && !!window.PF_SOCIAL_STREAM;
  const watchMode = bcastParams.get("watch") === "1";
  const [mode, setMode] = React.useState(() => isSocial || watchMode ? "broadcast" : "post");
  const [devSuperUser, setDevSuperUserRaw] = React.useState(cpIsSuperUser);
  const setDevSuperUser = next => {
    try {
      if (next) localStorage.setItem("pf-preview-tier", "admin");else localStorage.removeItem("pf-preview-tier");
    } catch (e) {}
    setDevSuperUserRaw(next);
  };
  const [liveDescription, setLiveDescription] = React.useState("");
  const [text, setText] = React.useState("");
  const [channels, setChannels] = React.useState(() => {
    try {
      const raw = sessionStorage.getItem("pf_post_channels");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [images, setImages] = React.useState([]);
  const [video, setVideo] = React.useState(null);
  const [coverPickerOpen, setCoverPickerOpen] = React.useState(false);
  const [audience, setAudience] = React.useState("Everyone");
  const [allTags] = React.useState(() => window.PFHashtags ? window.PFHashtags.getAll() : []);
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [bgId, setBgId] = React.useState("none");
  const [styleSheetOpen, setStyleSheetOpen] = React.useState(false);
  const bg = CP_BACKGROUNDS.find(b => b.id === bgId) || CP_BACKGROUNDS[0];
  const textareaRef = React.useRef(null);
  const cpRank = Math.max(0, CP_TIER_ORDER.indexOf(cpTier()));
  const destOptions = CP_DESTS.filter(d => d.tier <= cpRank);
  const canPickChannel = destOptions.length > 1;
  const [chanSheet, setChanSheet] = React.useState(false);
  const [dest, setDest] = React.useState(() => {
    if (channels.length === 0) return "feed";
    const match = CP_DESTS.find(d => d.k !== "feed" && d.label.toLowerCase() === channels[0].toLowerCase());
    return match ? match.k : "feed";
  });
  const backTo = dest === "feed" ? "NewsfeedMobile.html" : "CommunityMobile.html";
  const pickBg = id => {
    setBgId(id);
    if (id !== "none") {
      setImages([]);
      setVideo(null);
    }
  };
  const toggleTag = slug => {
    setSelectedTags(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };
  React.useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);
  const canPost = text.trim().length > 0 || !!video;
  const handlePost = () => {
    const body = mode === "live" ? liveDescription.trim() : text.trim();
    if (mode !== "live" && !body) return;
    if (dest === "feed") {
      const post = {
        id: "u" + Date.now(),
        author: {
          name: PFACP.ME.name,
          avatar: PFACP.ME.avatar,
          seals: ["gb", "verified"]
        },
        time: "Just now",
        hashtags: selectedTags,
        media: images,
        body,
        bg: bg.id !== "none" ? {
          id: bg.id,
          css: bg.css,
          fg: bg.fg
        } : null,
        video: video ? {
          src: video.src,
          cover: video.cover
        } : null,
        live: mode === "live",
        likes: "0",
        comments: "0",
        shares: "0",
        commentList: []
      };
      try {
        const existing = JSON.parse(localStorage.getItem("pf-newsfeed-user-posts")) || [];
        localStorage.setItem("pf-newsfeed-user-posts", JSON.stringify([post, ...existing]));
      } catch (e) {}
    }
    try {
      sessionStorage.removeItem("pf_post_channels");
    } catch (e) {}
    goCP(backTo);
  };
  const handleImagePick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = e => {
      const files = Array.from(e.target.files || []).slice(0, Math.max(0, 5 - images.length));
      files.forEach(f => {
        const reader = new FileReader();
        reader.onload = () => setImages(prev => [...prev, reader.result].slice(0, 5));
        reader.readAsDataURL(f);
      });
    };
    input.click();
  };

  /* No real capture pipeline in this prototype, so attaching "Video" loads a
     bundled sample reel — matching the fake-camera pattern already used for
     Go Live — and immediately opens the real frame-based cover picker. */
  const handleVideoPick = () => {
    setImages([]);
    setBgId("none");
    const src = "assets/sample-reel.mp4";
    setVideo({
      src,
      cover: null,
      coverIsCustom: false,
      ratio: null
    });
    setCoverPickerOpen(true);

    /* Reads the clip's real dimensions so the preview box can take on its
       actual shape — vertical stays tall, horizontal stays wide, square
       stays square — instead of being force-cropped into one fixed box. */
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.muted = true;
    probe.src = src;
    probe.addEventListener("loadedmetadata", () => {
      const ratio = probe.videoWidth && probe.videoHeight ? probe.videoWidth / probe.videoHeight : null;
      setVideo(v => v && {
        ...v,
        ratio
      });
    }, {
      once: true
    });
  };
  const handleCoverConfirm = selected => {
    setVideo(v => v && {
      ...v,
      cover: selected.src,
      coverIsCustom: !!selected.custom,
      coverTime: selected.time
    });
    setCoverPickerOpen(false);
  };
  if (mode === "live") {
    return /*#__PURE__*/React.createElement("div", {
      className: "cp-screen",
      "data-screen-label": "Create Post (mobile) — live"
    }, /*#__PURE__*/React.createElement(CPLiveStage, {
      onBack: () => setMode("post"),
      dest: dest,
      canPickChannel: canPickChannel,
      onOpenChannelSheet: () => setChanSheet(true),
      description: liveDescription,
      onDescriptionChange: setLiveDescription,
      onGoLive: () => setMode("broadcast")
    }), chanSheet && /*#__PURE__*/React.createElement(CPChannelSheet, {
      dests: destOptions,
      value: dest,
      onPick: setDest,
      onClose: () => setChanSheet(false)
    }));
  }
  if (mode === "broadcast") {
    return /*#__PURE__*/React.createElement("div", {
      className: "cp-screen",
      "data-screen-label": "Create Post (mobile) — broadcast"
    }, /*#__PURE__*/React.createElement(CPBroadcastStage, {
      dest: dest === "feed" ? "Newsfeed" : dest,
      watch: watchMode,
      social: isSocial,
      onClose: () => {
        if (isSocial || watchMode) goCP("NewsfeedMobileConfidence.html");else setMode("post");
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-screen",
    "data-screen-label": "Create Post (mobile)"
  }, /*#__PURE__*/React.createElement(CPTopBar, {
    canPost: canPost,
    onPost: handlePost,
    onCancel: () => goCP(backTo)
  }), /*#__PURE__*/React.createElement(CPDevSuperUserToggle, {
    superUser: devSuperUser,
    onChange: setDevSuperUser
  }), /*#__PURE__*/React.createElement(CPModeTabs, {
    mode: mode,
    onChange: setMode,
    superUser: devSuperUser
  }), /*#__PURE__*/React.createElement("div", {
    className: "cp-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-author"
  }, /*#__PURE__*/React.createElement(DSCP.Avatar, {
    name: PFACP.ME.name,
    src: PFACP.ME.avatar,
    size: 46
  }), /*#__PURE__*/React.createElement("div", {
    className: "cp-author-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-author-name-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-author-name"
  }, PFACP.ME.name), /*#__PURE__*/React.createElement(CPAudiencePicker, {
    value: audience,
    onChange: setAudience
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-channel-btn" + (canPickChannel ? "" : " static"),
    onClick: () => canPickChannel && setChanSheet(true),
    "aria-haspopup": canPickChannel ? "dialog" : undefined,
    "aria-expanded": canPickChannel ? chanSheet : undefined,
    disabled: !canPickChannel
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: dest === "feed" ? "lucide:rss" : "lucide:users",
    size: 14,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("span", {
    className: dest === "feed" ? "cp-channel-feed" : "cp-channel-chip"
  }, dest === "feed" ? "Post to Newsfeed" : dest), canPickChannel && /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:chevron-down",
    size: 14,
    color: "var(--gray-500)"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "cp-compose" + (bg.css ? " cp-compose-bg" : ""),
    style: bg.css ? {
      background: bg.css
    } : undefined
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: textareaRef,
    className: "cp-textarea" + (bg.css ? " on-bg" : ""),
    placeholder: "What's on your mind?",
    value: text,
    style: bg.css ? {
      color: bg.fg
    } : undefined,
    onChange: e => setText(e.target.value)
  }), bg.css && /*#__PURE__*/React.createElement("button", {
    className: "cp-bg-fab",
    "aria-label": "Change background style",
    onClick: () => setStyleSheetOpen(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-bg-aa"
  }, "Aa"))), images.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cp-images cp-images-" + images.length
  }, images.map((src, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "cp-img-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    className: "cp-img"
  }), /*#__PURE__*/React.createElement("button", {
    className: "cp-img-rm",
    "aria-label": "Remove",
    onClick: () => setImages(prev => prev.filter((_, j) => j !== i))
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:x",
    size: 14,
    color: "var(--white)"
  }))))), video && /*#__PURE__*/React.createElement("div", {
    className: "cp-video-wrap",
    style: video.ratio ? {
      aspectRatio: video.ratio
    } : undefined
  }, video.cover ? /*#__PURE__*/React.createElement("img", {
    src: video.cover,
    alt: "",
    className: "cp-video-cover"
  }) : /*#__PURE__*/React.createElement("video", {
    src: video.src,
    className: "cp-video-cover",
    muted: true,
    playsInline: true,
    preload: "metadata"
  }), /*#__PURE__*/React.createElement("button", {
    className: "cp-video-rm",
    "aria-label": "Remove video",
    onClick: () => setVideo(null)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:x",
    size: 14,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cp-video-edit-cover",
    onClick: () => setCoverPickerOpen(true)
  }, "Edit cover")), /*#__PURE__*/React.createElement(CPTagPicker, {
    tags: allTags,
    selected: selectedTags,
    onToggle: toggleTag
  })), /*#__PURE__*/React.createElement("div", {
    className: "cp-attach-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-attach-label"
  }, "Add to your post"), /*#__PURE__*/React.createElement("div", {
    className: "cp-attach-row"
  }, CP_ATTACH.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.label,
    className: "cp-attach-btn",
    "aria-label": a.label,
    disabled: a.label === "Photo" && (!!bg.css || !!video) || a.label === "Video" && (!!bg.css || images.length > 0),
    onClick: a.label === "Photo" ? handleImagePick : a.label === "Video" ? handleVideoPick : undefined
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: a.icon,
    size: 24,
    color: a.color
  }))), /*#__PURE__*/React.createElement("button", {
    className: "cp-attach-btn",
    "aria-label": "Background",
    disabled: images.length > 0 || !!video,
    onClick: () => setStyleSheetOpen(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-bg-aa lg"
  }, "Aa")))), styleSheetOpen && /*#__PURE__*/React.createElement(CPStyleSheet, {
    value: bgId,
    onPick: pickBg,
    onClose: () => setStyleSheetOpen(false)
  }), chanSheet && /*#__PURE__*/React.createElement(CPChannelSheet, {
    dests: destOptions,
    value: dest,
    onPick: setDest,
    onClose: () => setChanSheet(false)
  }), coverPickerOpen && video && /*#__PURE__*/React.createElement(CPCoverPicker, {
    video: video,
    onConfirm: handleCoverConfirm,
    onClose: () => setCoverPickerOpen(false)
  }));
}
function CreatePostApp() {
  const mobile = useIsMobileCP();
  const scale = useDeviceScaleCP();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  const screen = /*#__PURE__*/React.createElement(CPScreen, null);
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
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CreatePostApp, null));
