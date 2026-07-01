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
function CPTopBar({
  canPost,
  onPost
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "cp-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-cancel",
    onClick: () => goCP("CommunityMobile.html")
  }, "Cancel"), /*#__PURE__*/React.createElement("span", {
    className: "cp-title"
  }, "Create Post"), /*#__PURE__*/React.createElement("button", {
    className: "cp-post-btn",
    disabled: !canPost,
    onClick: onPost
  }, "Post"));
}
function CPScreen() {
  const [text, setText] = React.useState("");
  const [channels, setChannels] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [audience, setAudience] = React.useState("Everyone");
  const textareaRef = React.useRef(null);
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pf_post_channels");
      if (raw) setChannels(JSON.parse(raw));
    } catch (e) {}
    if (textareaRef.current) textareaRef.current.focus();
  }, []);
  const handlePost = () => {
    try {
      sessionStorage.removeItem("pf_post_channels");
    } catch (e) {}
    goCP("CommunityMobile.html");
  };
  const handleImagePick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = e => {
      const files = Array.from(e.target.files || []);
      const urls = files.map(f => URL.createObjectURL(f));
      setImages(prev => [...prev, ...urls].slice(0, 4));
    };
    input.click();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-screen",
    "data-screen-label": "Create Post (mobile)"
  }, /*#__PURE__*/React.createElement(CPTopBar, {
    canPost: text.trim().length > 0,
    onPost: handlePost
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
  })), channels.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cp-channels"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:users",
    size: 13,
    color: "var(--gray-500)"
  }), channels.map(ch => /*#__PURE__*/React.createElement("span", {
    key: ch,
    className: "cp-ch-chip"
  }, ch))))), /*#__PURE__*/React.createElement("textarea", {
    ref: textareaRef,
    className: "cp-textarea",
    placeholder: "What's on your mind?",
    value: text,
    onChange: e => setText(e.target.value)
  }), images.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "cp-attach-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-attach-label"
  }, "Add to your post"), /*#__PURE__*/React.createElement("div", {
    className: "cp-attach-row"
  }, CP_ATTACH.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.label,
    className: "cp-attach-btn",
    "aria-label": a.label,
    onClick: a.label === "Photo" ? handleImagePick : undefined
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: a.icon,
    size: 24,
    color: a.color
  }))))));
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