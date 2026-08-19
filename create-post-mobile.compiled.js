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
  onCancel
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
  }, "Post"));
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
    if (id !== "none") setImages([]);
  };
  const toggleTag = slug => {
    setSelectedTags(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };
  React.useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);
  const handlePost = () => {
    const body = text.trim();
    if (!body) return;
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
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-screen",
    "data-screen-label": "Create Post (mobile)"
  }, /*#__PURE__*/React.createElement(CPTopBar, {
    canPost: text.trim().length > 0,
    onPost: handlePost,
    onCancel: () => goCP(backTo)
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
  }))))), /*#__PURE__*/React.createElement(CPTagPicker, {
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
    disabled: a.label === "Photo" && !!bg.css,
    onClick: a.label === "Photo" ? handleImagePick : undefined
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: a.icon,
    size: 24,
    color: a.color
  }))), /*#__PURE__*/React.createElement("button", {
    className: "cp-attach-btn",
    "aria-label": "Background",
    disabled: images.length > 0,
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
