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

/* Simulated upload length for a media post (no real upload pipeline in this
   prototype): a base plus a share per photo scaled by its data-URL size, and
   a flat chunk for the sample reel — long enough to see the newsfeed's
   progress card, short enough not to feel stuck. */
function cpUploadDuration(images, video) {
  let ms = 3200;
  (images || []).forEach(src => {
    const mb = (typeof src === "string" ? src.length : 0) / (1024 * 1024);
    ms += 900 + Math.min(3500, mb * 1400);
  });
  if (video) ms += 6500;
  return Math.max(3500, Math.min(16000, Math.round(ms)));
}

/* Long-video "preparing" state shown inside the composer itself (before
   Post is even pressed). No real upload/transcode pipeline exists in this
   prototype, so attaching Video stands in a long clip's metadata and fakes a
   wall-clock upload → processing → cover-frame run; a real client would read
   file.size / duration and drive `prep` from the upload XHR + server events.
   ?longvideo=1 attaches one on load for demos/screenshots. */
const CP_SIM_VIDEO = {
  seconds: 272,
  mb: 186
};
const CP_LONG_VIDEO_SECS = 60;
const CP_VIDEO_READY_HOLD = 1800;
function cpVideoPrepDuration(meta) {
  const secs = meta && meta.seconds || 0;
  return Math.max(4000, Math.min(14000, 3000 + secs * 30));
}
function cpFmtClock(secs) {
  const m = Math.floor(secs / 60),
    s = Math.round(secs % 60);
  return m + ":" + String(s).padStart(2, "0");
}
function cpPrepStage(p) {
  if (p >= 1) return {
    key: "done",
    title: "Video ready",
    sub: "Choose a cover or post as is",
    icon: "lucide:check"
  };
  if (p < 0.5) return {
    key: "upload",
    title: "Uploading video…",
    sub: "Keep writing — this runs in the background",
    icon: "lucide:upload-cloud"
  };
  if (p < 0.88) return {
    key: "process",
    title: "Processing video…",
    sub: "Optimising for smooth playback",
    icon: "lucide:cpu"
  };
  return {
    key: "frames",
    title: "Almost done…",
    sub: "Generating cover frames",
    icon: "lucide:film"
  };
}

/* Wall-clock progress (ease-out) for a prep marker, ticking while it runs. */
function useCPPrepProgress(prep) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!prep) return undefined;
    const id = setInterval(() => setNow(Date.now()), 80);
    return () => clearInterval(id);
  }, [prep]);
  if (!prep) return {
    p: 1,
    leftMs: 0
  };
  const t = Math.max(0, Math.min(1, (now - prep.started) / prep.duration));
  return {
    p: 1 - Math.pow(1 - t, 2.2),
    leftMs: Math.max(0, prep.duration - (now - prep.started))
  };
}

/* Card that stands in for the video preview while a long clip is being
   uploaded + processed: blurred first frame behind, progress ring with a
   percentage, stage title/sub-line, metadata, ETA and a slim bar. Cancel (X)
   drops the clip. Once done the parent swaps the real preview back in and
   briefly shows a "Video ready" chip over it. */
function CPVideoProcessing({
  video,
  onCancel
}) {
  const {
    p,
    leftMs
  } = useCPPrepProgress(video.prep);
  const stage = cpPrepStage(p);
  const pct = Math.round(p * 100);
  const meta = video.prep.meta || CP_SIM_VIDEO;
  const isLong = meta.seconds >= CP_LONG_VIDEO_SECS;
  const R = 27,
    C = 2 * Math.PI * R;
  const secsLeft = Math.ceil(leftMs / 1000);
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-video-wrap cp-vproc is-" + stage.key,
    style: video.ratio ? {
      aspectRatio: video.ratio
    } : undefined,
    role: "status",
    "aria-live": "polite",
    "aria-label": stage.title + " " + pct + "%"
  }, /*#__PURE__*/React.createElement("video", {
    src: video.src,
    className: "cp-video-cover cp-vproc-bg",
    muted: true,
    playsInline: true,
    preload: "metadata",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-shade"
  }), /*#__PURE__*/React.createElement("button", {
    className: "cp-video-rm",
    "aria-label": "Cancel video",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:x",
    size: 14,
    color: "var(--white)"
  })), isLong && /*#__PURE__*/React.createElement("span", {
    className: "cp-vproc-tag"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:clock",
    size: 12,
    color: "#fff"
  }), "Long video · ", cpFmtClock(meta.seconds)), /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-ring",
    style: {
      "--cp-ring-c": C
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    width: "64",
    height: "64",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    className: "cp-vproc-track",
    cx: "32",
    cy: "32",
    r: R
  }), /*#__PURE__*/React.createElement("circle", {
    className: "cp-vproc-fill",
    cx: "32",
    cy: "32",
    r: R,
    style: {
      strokeDasharray: C,
      strokeDashoffset: C * (1 - p)
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "cp-vproc-pct"
  }, pct, /*#__PURE__*/React.createElement("small", null, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-title"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: stage.icon,
    size: 15,
    color: "#fff"
  }), stage.title), /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-sub"
  }, stage.sub)), /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-meta"
  }, /*#__PURE__*/React.createElement("span", null, meta.mb, " MB"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("span", null, cpFmtClock(meta.seconds)), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cp-vproc-eta"
  }, secsLeft > 0 ? "About " + secsLeft + "s left" : "Finishing…")), /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-vproc-bar-fill",
    style: {
      width: pct + "%"
    }
  }))));
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

/* "Where from?" sheet behind the Photo and Video toolbar buttons: pick from
   the device's library or capture right now. Both routes use the native
   file input — with `capture` set, iOS/Android open the camera (still or
   video) directly; without it they open the photo/video library. */
const CP_MEDIA_SOURCES = {
  photo: {
    title: "Add photos",
    rows: [{
      k: "library",
      icon: "lucide:images",
      label: "Photo library",
      sub: "Choose up to 5 photos"
    }, {
      k: "camera",
      icon: "lucide:camera",
      label: "Take a photo",
      sub: "Open the camera now"
    }]
  },
  video: {
    title: "Add a video",
    rows: [{
      k: "library",
      icon: "lucide:film",
      label: "Video library",
      sub: "Choose a clip from your gallery"
    }, {
      k: "camera",
      icon: "lucide:video",
      label: "Record a video",
      sub: "Capture one right now"
    }]
  }
};
function CPMediaSourceSheet({
  kind,
  onPick,
  onClose
}) {
  const cfg = CP_MEDIA_SOURCES[kind] || CP_MEDIA_SOURCES.photo;
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
    "aria-label": cfg.title,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-sheet-grip",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("h3", null, cfg.title), /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-list",
    role: "menu"
  }, cfg.rows.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.k,
    type: "button",
    role: "menuitem",
    className: "cp-opt",
    onClick: () => {
      onClose();
      onPick(r.k);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-ic"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: r.icon,
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-tx"
  }, /*#__PURE__*/React.createElement("b", null, r.label), /*#__PURE__*/React.createElement("i", null, r.sub)), /*#__PURE__*/React.createElement("span", {
    className: "cp-opt-chev"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
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

/* ---- Scheduled lives ----
   A Super User can schedule a live instead of going live right away. The
   booking is written to localStorage ("pf-scheduled-lives") so the member's
   profile page (ProfileMobile / Profile web) can list it under "Upcoming
   lives" — the two run as separate page loads with no backend, exactly like
   the credential-verification bridge. */
const CP_SCHED_KEY = "pf-scheduled-lives";
function cpLoadScheduled() {
  try {
    return JSON.parse(localStorage.getItem(CP_SCHED_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function cpSaveScheduled(list) {
  try {
    localStorage.setItem(CP_SCHED_KEY, JSON.stringify(list));
  } catch (e) {}
}
function cpAddScheduled(item) {
  const list = cpLoadScheduled().filter(x => x.id !== item.id);
  list.push(item);
  list.sort((a, b) => new Date(a.startIso) - new Date(b.startIso));
  cpSaveScheduled(list);
  return list;
}
function cpRemoveScheduled(id) {
  cpSaveScheduled(cpLoadScheduled().filter(x => x.id !== id));
}
/* Local-time value for <input type="datetime-local"> (YYYY-MM-DDTHH:MM). */
function cpToLocalInput(d) {
  const pad = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
}
function cpDefaultScheduleTime() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(19, 0, 0, 0);
  return cpToLocalInput(d);
}
function cpFormatWhen(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const day = d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
  return day + " · " + time;
}

/* Bottom sheet for picking a title + date/time — reuses the create-post
   .cp-sheet shell so it feels like the "Post to" picker. */
function CPScheduleLiveSheet({
  dest,
  defaultTitle,
  onConfirm,
  onClose
}) {
  const [title, setTitle] = React.useState(defaultTitle || "");
  const [when, setWhen] = React.useState(cpDefaultScheduleTime);
  const [err, setErr] = React.useState("");
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const submit = () => {
    const d = new Date(when);
    if (!when || isNaN(d)) {
      setErr("Pick a date and time.");
      return;
    }
    if (d.getTime() < Date.now() + 5 * 60 * 1000) {
      setErr("Choose a time at least 5 minutes from now.");
      return;
    }
    onConfirm({
      title: title.trim() || "Live with " + PFACP.ME.name,
      startIso: d.toISOString()
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet cp-sched-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Schedule live",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-sheet-grip",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-hd"
  }, /*#__PURE__*/React.createElement("h3", null, "Schedule live"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-sheet-done",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "cp-sched-sub"
  }, "Your followers will see it on your profile under ", /*#__PURE__*/React.createElement("b", null, "Upcoming lives"), " — you can go live from there when it's time."), /*#__PURE__*/React.createElement("label", {
    className: "cp-sched-field"
  }, /*#__PURE__*/React.createElement("span", null, "Title"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: title,
    maxLength: 80,
    placeholder: "e.g. Live Q&A: correcting migrated lip filler",
    onChange: e => setTitle(e.target.value)
  })), /*#__PURE__*/React.createElement("label", {
    className: "cp-sched-field"
  }, /*#__PURE__*/React.createElement("span", null, "Date & time"), /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    value: when,
    min: cpToLocalInput(new Date()),
    onChange: e => {
      setWhen(e.target.value);
      setErr("");
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cp-sched-dest"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: dest === "feed" ? "lucide:rss" : "lucide:users",
    size: 15,
    color: "var(--gray-500)"
  }), "Streaming to ", /*#__PURE__*/React.createElement("b", null, dest === "feed" ? "Newsfeed" : dest)), err && /*#__PURE__*/React.createElement("p", {
    className: "cp-sched-err",
    role: "alert"
  }, err), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-sched-go",
    onClick: submit
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:calendar-clock",
    size: 18,
    color: "#fff"
  }), "Schedule for ", cpFormatWhen(when) || "…")));
}

/* Confirmation after scheduling — a small centred card over the camera
   stage with a straight path to the profile listing. */
function CPScheduledConfirm({
  item,
  onViewProfile,
  onDone
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cp-sheet-overlay cp-sched-confirm-overlay",
    onClick: onDone
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-sched-confirm",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Live scheduled",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-sched-confirm-ic"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:calendar-check",
    size: 28,
    color: "var(--success)"
  })), /*#__PURE__*/React.createElement("h3", null, "Live scheduled"), /*#__PURE__*/React.createElement("p", {
    className: "ti"
  }, item.title), /*#__PURE__*/React.createElement("p", {
    className: "tm"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:clock",
    size: 14,
    color: "var(--gray-500)"
  }), cpFormatWhen(item.startIso), " · ", item.dest), /*#__PURE__*/React.createElement("p", {
    className: "note"
  }, "It's now listed under ", /*#__PURE__*/React.createElement("b", null, "Upcoming lives"), " on your profile."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-sched-confirm-primary",
    onClick: onViewProfile
  }, "View on my profile"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-sched-confirm-secondary",
    onClick: onDone
  }, "Done")));
}

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
  onGoLive,
  onSchedule
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
  }, description || "Tap to add a description..."), /*#__PURE__*/React.createElement("div", {
    className: "cp-live-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cp-live-go-btn",
    onClick: onGoLive
  }, "Go Live"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-live-sched-btn",
    "aria-label": "Schedule a live",
    onClick: onSchedule
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:calendar-clock",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", null, "Schedule")))));
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

/* Commenter avatars for the live chat — known members resolve to their
   photo, anyone else falls back to DS Avatar's initials. */
const CP_BCAST_AVATARS = {
  "Dr Tim Pearce": "assets/avatar-drtim.png",
  "Miranda Pearce": "assets/avatar-miranda.jpg",
  "Katy Wilson": "assets/avatar-katy.jpg",
  "Grace Lindqvist": "assets/avatar-sarah-collins.jpg",
  "Amir Khan": "assets/avatar-amir-khan.jpg",
  "Mark Ellis": "assets/avatar-mark-ellis.jpg",
  "Priya Nair": "assets/avatar-priya-shah.jpg",
  "Beth Okafor": "assets/avatar-nurse-beth.jpg"
};
/* Host-only clickable links: URLs in a host's message become anchors,
   everyone else's stay plain text (keeps the chat spam-safe). */
const CP_BCAST_URL_RE = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g;
function cpBcastLinkify(text, cls) {
  const out = [];
  let last = 0,
    m;
  CP_BCAST_URL_RE.lastIndex = 0;
  while (m = CP_BCAST_URL_RE.exec(text)) {
    let url = m[0];
    const trail = url.match(/[.,;:!?)]+$/);
    if (trail) url = url.slice(0, -trail[0].length);
    if (m.index > last) out.push(text.slice(last, m.index));
    const href = /^https?:/i.test(url) ? url : "https://" + url;
    out.push(/*#__PURE__*/React.createElement("a", {
      key: out.length,
      className: cls,
      href: href,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: e => e.stopPropagation()
    }, url.replace(/^https?:\/\//i, "").replace(/\/$/, "")));
    last = m.index + url.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/* Open a direct message with a commenter — the DM page seeds a fresh
   thread from name/avatar when they aren't already a contact. */
const cpBcastDmUrl = (c, av) => {
  const q = new URLSearchParams({
    name: c.n,
    from: location.pathname.split("/").pop() || "NewsfeedMobile.html"
  });
  if (av) q.set("avatar", av);
  return "DirectMessage.html?" + q.toString();
};
/* Long-press (≈450ms hold, cancelled by a 10px drag) opens a comment's
   options. Right-click / contextmenu does the same on desktop. `ref` is a
   shared per-list press state; `fire` receives nothing and should open the
   sheet for the row these handlers are attached to. The row's own onClick
   should bail when ref.current.fired is set (the tap that ends a long-press). */
function cpLongPress(ref, fire) {
  const end = e => {
    const s = ref.current;
    if (!s) return;
    if (s.t) {
      clearTimeout(s.t);
      s.t = null;
    }
    if (s.el) s.el.classList.remove("pressing");
  };
  return {
    onPointerDown: e => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      end();
      const el = e.currentTarget;
      ref.current = {
        x: e.clientX,
        y: e.clientY,
        fired: false,
        el: el,
        t: setTimeout(() => {
          ref.current.fired = true;
          ref.current.t = null;
          el.classList.remove("pressing");
          /* The tap that ends a long-press still produces a click — swallow it
             so it can't land on whatever the sheet just put under the finger. */
          const swallow = ev => {
            ev.stopPropagation();
            ev.preventDefault();
          };
          window.addEventListener("click", swallow, true);
          setTimeout(() => window.removeEventListener("click", swallow, true), 700);
          fire();
        }, 450)
      };
      el.classList.add("pressing");
    },
    onPointerMove: e => {
      const s = ref.current;
      if (!s || !s.t) return;
      if (Math.abs(e.clientX - s.x) > 10 || Math.abs(e.clientY - s.y) > 10) end();
    },
    onPointerUp: end,
    onPointerCancel: end,
    onPointerLeave: end,
    onContextMenu: e => {
      e.preventDefault();
      if (!ref.current || !ref.current.fired) fire();
    }
  };
}
const CP_REPORT_REASONS = ["Spam or scam", "Harassment or bullying", "Misinformation", "Inappropriate content", "Something else"];
const cpBcastAvatar = c => c.av || c.me && PFACP.ME.avatar || CP_BCAST_AVATARS[c.n] || null;
function CPBroadcastStage({
  dest,
  watch,
  social,
  onClose
}) {
  const [secs, setSecs] = React.useState(0);
  const [chat, setChat] = React.useState(() => [
  /* Host messages may carry links (viewers see Miranda hosting; when you
     broadcast, you're the host and your own links go live). */
  {
    n: "Miranda Pearce",
    t: watch ? "Welcome in! Tonight's checklist: https://profinity.app/lip-migration-checklist" : "Just joined — can't wait for this one 👀"
  }, {
    n: "Dr Tim Pearce",
    t: "Great topic. Are you covering cannula depth?"
  }].concat(watch ? [] : [{
    n: PFACP.ME.name,
    t: "Course + notes for tonight: https://profinity.app/8d-lip-design",
    me: true
  }]));
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
  const [who, setWho] = React.useState(null); // commenter sheet (tap a chat message)
  const [whoMode, setWhoMode] = React.useState("who"); // who | report
  const [reason, setReason] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(null);
  const showToast = t => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };
  React.useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);
  const openWho = c => {
    setWho(c);
    setWhoMode("who");
    setReason(null);
  };
  const pressRef = React.useRef(null);
  /* Moderation: the broadcaster (and co-hosts on stage) can delete; viewers can report. */
  const canDelete = !watch;
  const deleteMsg = c => {
    setChat(list => list.filter(x => x !== c));
    setWho(null);
    showToast("Comment deleted");
  };
  const submitReport = () => {
    setWho(null);
    showToast("Thanks — we'll review this comment");
  };
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
      if (who) setWho(null);else if (guestSheet) setGuestSheet(false);else if (confirmEnd) setConfirmEnd(false);
      /* While hosting, Escape asks first rather than dropping the broadcast. */else if (!watch) setConfirmEnd(true);else close();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [confirmEnd, guestSheet, watch, who]);

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

  /* Who counts as a host for link rendering: the broadcaster (you, or
     Miranda when watching) plus any guests brought on as co-hosts. */
  const hostNames = (watch ? ["Miranda Pearce"] : [PFACP.ME.name]).concat(guests.map(g => g.n));
  const isHostMsg = c => c.me && !watch || hostNames.indexOf(c.n) !== -1;
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
    className: "cp-bcast-msg" + (c.me ? " me" : "") + (c.fresh ? " in" : "") + (!c.me || canDelete ? " has-opts" : ""),
    key: i
    /* long-press (or right-click) opens the options sheet; keyboard users get Enter/Space */,
    ...(!c.me || canDelete ? cpLongPress(pressRef, () => openWho(c)) : {}),
    tabIndex: c.me && !canDelete ? undefined : 0,
    "aria-label": c.me && !canDelete ? undefined : "Hold for options on " + (c.me ? "your" : c.n + "'s") + " comment",
    onKeyDown: e => {
      if ((!c.me || canDelete) && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openWho(c);
      }
    }
  }, /*#__PURE__*/React.createElement(DSCP.Avatar, {
    className: "cp-bcast-msg-av",
    name: c.n,
    src: cpBcastAvatar(c),
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    className: "cp-bcast-msg-tx"
  }, /*#__PURE__*/React.createElement("b", null, c.n), " ", isHostMsg(c) ? cpBcastLinkify(c.t, "cp-bcast-link") : c.t)))), /*#__PURE__*/React.createElement("div", {
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
  }, e)))))), who && /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-guest cp-bcast-who",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": who.n,
    onClick: e => {
      if (e.target === e.currentTarget) setWho(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-guest-card cp-bcast-who-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-sheet-grip"
  }), whoMode === "who" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSCP.Avatar, {
    name: who.n,
    src: cpBcastAvatar(who),
    size: 64
  }), /*#__PURE__*/React.createElement("h3", null, who.me ? "Your comment" : who.n), /*#__PURE__*/React.createElement("p", {
    className: "cp-bcast-guest-p cp-bcast-who-quote"
  }, "“", who.t, "”"), !who.me && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-bcast-who-dm",
    onClick: () => goCP(cpBcastDmUrl(who, cpBcastAvatar(who)))
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:send",
    size: 17,
    color: "#fff"
  }), "Send a message"), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-who-row"
  }, !who.me && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-bcast-who-act",
    onClick: () => setWhoMode("report")
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:flag",
    size: 16,
    color: "var(--brand-navy)"
  }), "Report comment"), canDelete && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-bcast-who-act danger",
    onClick: () => deleteMsg(who)
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:trash-2",
    size: 16,
    color: "var(--error)"
  }), "Delete comment"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "cp-bcast-who-flag"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:flag",
    size: 26,
    color: "var(--error)"
  })), /*#__PURE__*/React.createElement("h3", null, "Report this comment?"), /*#__PURE__*/React.createElement("p", {
    className: "cp-bcast-guest-p cp-bcast-who-quote"
  }, /*#__PURE__*/React.createElement("b", null, who.n), ": “", who.t, "”"), /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-who-reasons",
    role: "radiogroup",
    "aria-label": "Reason"
  }, CP_REPORT_REASONS.map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    type: "button",
    role: "radio",
    "aria-checked": reason === r,
    className: "cp-bcast-who-reason" + (reason === r ? " on" : ""),
    onClick: () => setReason(r)
  }, r))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-bcast-who-dm danger",
    disabled: !reason,
    onClick: submitReport
  }, "Submit report")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cp-bcast-who-cancel",
    onClick: () => setWho(null)
  }, "Cancel"))), toast && /*#__PURE__*/React.createElement("div", {
    className: "cp-bcast-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 18,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", null, toast)), guestSheet && /*#__PURE__*/React.createElement("div", {
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
        /* cap the frame at 1280px on its long side — a real 4K clip's
           full-size cover would otherwise dominate the post's storage */
        const k = Math.min(1, 1280 / Math.max(v.videoWidth || 1, v.videoHeight || 1));
        canvas.width = Math.max(1, Math.round((v.videoWidth || 1) * k));
        canvas.height = Math.max(1, Math.round((v.videoHeight || 1) * k));
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
      const read = window.pfReadImageFile ? window.pfReadImageFile(file, 1280) : new Promise(res => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(file);
      });
      read.then(src => {
        if (src) setSelected({
          src,
          custom: true
        });
      });
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
  /* ?mode=live deep-links straight into the camera stage (used by the
     profile page's "Go live now" on a scheduled live); ?sched=<id> names
     the booking so its title prefills and it's cleared once you go live. */
  const schedParam = bcastParams.get("sched");
  const scheduledItem = React.useMemo(() => schedParam ? cpLoadScheduled().find(x => x.id === schedParam) || null : null, [schedParam]);
  const deepLive = bcastParams.get("mode") === "live" && cpIsSuperUser();
  const [mode, setMode] = React.useState(() => isSocial || watchMode ? "broadcast" : deepLive ? "live" : "post");
  const [schedSheet, setSchedSheet] = React.useState(false);
  const [scheduled, setScheduled] = React.useState(null);
  const [devSuperUser, setDevSuperUserRaw] = React.useState(cpIsSuperUser);
  const setDevSuperUser = next => {
    try {
      if (next) localStorage.setItem("pf-preview-tier", "admin");else localStorage.removeItem("pf-preview-tier");
    } catch (e) {}
    setDevSuperUserRaw(next);
  };
  const [liveDescription, setLiveDescription] = React.useState(() => scheduledItem ? scheduledItem.title : "");
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
  const [mediaSheet, setMediaSheet] = React.useState(null); // null | "photo" | "video"
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

  /* Finish the video prep on its wall-clock deadline: drop the marker, hold a
     "Video ready" chip over the preview, then open the cover picker so the
     member can pick a frame straight away. */
  const prep = video && video.prep;
  React.useEffect(() => {
    if (!prep) return undefined;
    const left = Math.max(0, prep.started + prep.duration - Date.now());
    const t1 = setTimeout(() => {
      setVideo(v => v && v.prep === prep ? {
        ...v,
        prep: null,
        readyAt: Date.now()
      } : v);
    }, left);
    return () => clearTimeout(t1);
  }, [prep]);
  const readyAt = video && video.readyAt;
  React.useEffect(() => {
    if (!readyAt) return undefined;
    const t2 = setTimeout(() => {
      setVideo(v => v && v.readyAt === readyAt ? {
        ...v,
        readyAt: null
      } : v);
    }, CP_VIDEO_READY_HOLD);
    return () => clearTimeout(t2);
  }, [readyAt]);

  /* ?longvideo=1 — attach the long sample clip on load (demo / screenshots). */
  React.useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get("longvideo") === "1") attachSampleVideo();
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const videoBusy = !!(video && (video.prep || video.probing || !video.storeSrc));
  const canPost = !videoBusy && (text.trim().length > 0 || !!video || images.length > 0);
  const handlePost = () => {
    const body = mode === "live" ? liveDescription.trim() : text.trim();
    if (mode !== "live" && !body && images.length === 0 && !video) return;
    const hasMedia = images.length > 0 || !!video;
    const reward = {
      amount: 75,
      label: mode === "live" ? "Went live" : "Shared a post",
      actionId: "evt_create_post"
    };
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
          src: video.storeSrc || video.src,
          cover: video.cover,
          ratio: video.ratio
        } : null,
        live: mode === "live",
        likes: "0",
        comments: "0",
        shares: "0",
        commentList: []
      };
      /* Posts with media don't block this screen while they upload: the
         post is handed to the feed straight away carrying an `uploading`
         marker (wall-clock start + estimated duration, so progress keeps
         running while the member browses other pages) and the newsfeed
         renders a progress card in its place until it's done — see
         uploadProgressOf / FeedUploadCard in app.jsx. The +75 "shared a
         post" reward rides along and is booked by the feed on completion. */
      if (hasMedia) post.uploading = {
        started: Date.now(),
        duration: cpUploadDuration(images, video),
        reward
      };
      try {
        const existing = JSON.parse(localStorage.getItem("pf-newsfeed-user-posts")) || [];
        localStorage.setItem("pf-newsfeed-user-posts", JSON.stringify([post, ...existing]));
      } catch (e) {}
    }
    try {
      sessionStorage.removeItem("pf_post_channels");
    } catch (e) {}
    /* +75 pts for sharing — the feed books it (with its sound) once it has
       loaded; media posts book it when their background upload finishes. */
    if (!(hasMedia && dest === "feed")) {
      try {
        sessionStorage.setItem("pf-post-reward", JSON.stringify({
          ...reward,
          ts: Date.now()
        }));
      } catch (e) {}
    }
    goCP(backTo);
  };

  /* Photos — from the library (multi-select) or straight from the camera.
     Each file is read via pfReadImageFile (app.compiled.js), which
     downscales camera-size shots so five of them still fit the post store. */
  const addImageFiles = files => {
    const list = Array.from(files || []).filter(f => !f.type || /^image\//.test(f.type)).slice(0, 5);
    if (!list.length) return;
    const read = f => window.pfReadImageFile ? window.pfReadImageFile(f) : new Promise(res => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = () => res(null);
      reader.readAsDataURL(f);
    });
    Promise.all(list.map(read)).then(srcs => {
      setImages(prev => [...prev, ...srcs.filter(Boolean)].slice(0, 5));
    });
  };
  const pickImages = source => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    if (source === "camera") input.setAttribute("capture", "environment");else input.multiple = true;
    input.onchange = e => addImageFiles(e.target.files);
    input.click();
  };

  /* Video — one clip per post, alongside up to five photos. A clip picked
     from the library or recorded on the spot is a real file: previewed via
     an object URL, parked in PFMediaStore (IndexedDB) so the feed can play
     it after this page is gone, and — if it's long — run through the
     in-composer preparing card (CPVideoProcessing). Short clips go straight
     to the cover picker. */
  const probeVideo = (src, onMeta) => {
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.muted = true;
    probe.src = src;
    probe.addEventListener("loadedmetadata", () => {
      const ratio = probe.videoWidth && probe.videoHeight ? probe.videoWidth / probe.videoHeight : null;
      onMeta({
        ratio,
        seconds: isFinite(probe.duration) ? probe.duration : 0
      });
    }, {
      once: true
    });
    probe.addEventListener("error", () => onMeta({
      ratio: null,
      seconds: 0
    }), {
      once: true
    });
  };
  const attachVideoFile = file => {
    if (!file) return;
    setBgId("none");
    const src = URL.createObjectURL(file);
    const token = {};
    setVideo({
      src,
      cover: null,
      coverIsCustom: false,
      ratio: null,
      storeSrc: null,
      probing: true,
      token,
      name: file.name
    });
    /* park the real bytes; the post references them as "pfmedia:<id>" */
    const store = window.PFMediaStore;
    (store ? store.put(file) : Promise.resolve(src)).catch(() => src).then(storeSrc => {
      setVideo(v => v && v.token === token ? {
        ...v,
        storeSrc
      } : v);
    });
    probeVideo(src, ({
      ratio,
      seconds
    }) => {
      const meta = {
        seconds: Math.round(seconds),
        mb: Math.max(1, Math.round(file.size / 1048576))
      };
      const long = seconds >= CP_LONG_VIDEO_SECS;
      setVideo(v => v && v.token === token ? {
        ...v,
        ratio,
        probing: false,
        prep: long ? {
          started: Date.now(),
          duration: cpVideoPrepDuration(meta),
          meta
        } : null
      } : v);
    });
  };
  const pickVideo = source => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    if (source === "camera") input.setAttribute("capture", "environment");
    input.onchange = e => attachVideoFile(e.target.files && e.target.files[0]);
    input.click();
  };
  /* ?longvideo=1 demo path: the bundled sample reel standing in for a long
     clip's upload → processing run (no file picker needed for screenshots). */
  const attachSampleVideo = () => {
    setBgId("none");
    const src = "assets/sample-reel.mp4";
    const meta = {
      ...CP_SIM_VIDEO
    };
    setVideo({
      src,
      cover: null,
      coverIsCustom: false,
      ratio: null,
      storeSrc: src,
      prep: {
        started: Date.now(),
        duration: cpVideoPrepDuration(meta),
        meta
      }
    });
    probeVideo(src, ({
      ratio
    }) => setVideo(v => v && v.src === src ? {
      ...v,
      ratio
    } : v));
  };
  const removeVideo = () => {
    setVideo(v => {
      if (v && v.src && /^blob:/.test(v.src)) {
        try {
          URL.revokeObjectURL(v.src);
        } catch (e) {}
      }
      return null;
    });
  };
  const onMediaSource = k => {
    if (mediaSheet === "video") pickVideo(k);else pickImages(k);
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
      onGoLive: () => {
        if (scheduledItem) cpRemoveScheduled(scheduledItem.id);
        setMode("broadcast");
      },
      onSchedule: () => setSchedSheet(true)
    }), chanSheet && /*#__PURE__*/React.createElement(CPChannelSheet, {
      dests: destOptions,
      value: dest,
      onPick: setDest,
      onClose: () => setChanSheet(false)
    }), schedSheet && /*#__PURE__*/React.createElement(CPScheduleLiveSheet, {
      dest: dest,
      defaultTitle: liveDescription,
      onClose: () => setSchedSheet(false),
      onConfirm: ({
        title,
        startIso
      }) => {
        const item = {
          id: "sl" + Date.now(),
          title,
          startIso,
          dest: dest === "feed" ? "Newsfeed" : dest,
          host: {
            name: PFACP.ME.name,
            avatar: PFACP.ME.avatar
          },
          createdAt: new Date().toISOString()
        };
        cpAddScheduled(item);
        setSchedSheet(false);
        setScheduled(item);
      }
    }), scheduled && /*#__PURE__*/React.createElement(CPScheduledConfirm, {
      item: scheduled,
      onViewProfile: () => goCP("ProfileMobile.html#upcoming-lives"),
      onDone: () => {
        setScheduled(null);
        goCP(backTo);
      }
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
  }, PFACP.ME.name)), /*#__PURE__*/React.createElement("button", {
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
  }, "Aa"))), video && video.prep && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CPVideoProcessing, {
    video: video,
    onCancel: removeVideo
  }), /*#__PURE__*/React.createElement("p", {
    className: "cp-vproc-note"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:info",
    size: 13,
    color: "var(--gray-500)"
  }), "You can keep writing — ", /*#__PURE__*/React.createElement("b", null, "Post"), " unlocks when your video is ready.")), video && !video.prep && /*#__PURE__*/React.createElement("div", {
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
    onClick: removeVideo
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:x",
    size: 14,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "cp-video-edit-cover",
    onClick: () => setCoverPickerOpen(true)
  }, "Edit cover"), video.readyAt && /*#__PURE__*/React.createElement("div", {
    className: "cp-vready",
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-vready-ic"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:check",
    size: 14,
    color: "#fff"
  })), "Video ready")), images.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cp-images cp-images-" + images.length + (video ? " cp-images-with-video" : "")
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
  }))))), (images.length > 0 || video) && /*#__PURE__*/React.createElement("p", {
    className: "cp-media-count"
  }, /*#__PURE__*/React.createElement(DSCP.IconifyIcon, {
    name: "lucide:paperclip",
    size: 12,
    color: "var(--gray-500)"
  }), [video ? "1 video" : null, images.length ? images.length + (images.length === 1 ? " photo" : " photos") : null].filter(Boolean).join(" · "), images.length < 5 ? " · add up to " + (5 - images.length) + " more photo" + (5 - images.length === 1 ? "" : "s") : " · photo limit reached"), /*#__PURE__*/React.createElement(CPTagPicker, {
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
    disabled: a.label === "Photo" && (!!bg.css || images.length >= 5) || a.label === "Video" && (!!bg.css || !!video),
    onClick: a.label === "Photo" ? () => setMediaSheet("photo") : a.label === "Video" ? () => setMediaSheet("video") : undefined
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
  }), mediaSheet && /*#__PURE__*/React.createElement(CPMediaSourceSheet, {
    kind: mediaSheet,
    onPick: onMediaSource,
    onClose: () => setMediaSheet(null)
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
