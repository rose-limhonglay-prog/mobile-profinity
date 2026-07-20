/* ===========================================================================
   PROfinity — Create Post · iPhone 17 Pro Max mobile
   Reached from CommunityMobile after selecting channels. Reads selected
   channels from sessionStorage key "pf_post_channels" (JSON string[]).
   Suffixed -CP to avoid global-scope clashes.
   =========================================================================== */
const DSCP = window.ProfinityDesignSystem_c2b5cc;
const PFACP = window.PFApp;

function goCP(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

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

const CP_AUDIENCE_OPTS = [
  { label: "Everyone",       icon: "lucide:globe",       badge: null },
  { label: "Members Only",   icon: "lucide:users",       badge: "fluent:ribbon-star-16-filled" },
  { label: "Patients Only",  icon: "lucide:user",        badge: null },
  { label: "Clinicians Only",icon: "lucide:stethoscope", badge: null },
  { label: "Only Me",        icon: "lucide:lock",        badge: null },
];

function CPAudiencePicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  const current = CP_AUDIENCE_OPTS.find((o) => o.label === value) || CP_AUDIENCE_OPTS[0];
  return (
    <div className="cp-audience-wrap" onClick={(e) => e.stopPropagation()}>
      <button className="cp-audience-btn" onClick={() => setOpen((o) => !o)}>
        <DSCP.IconifyIcon name={current.icon} size={13} color="var(--brand-navy)" />
        {current.label}
        <DSCP.IconifyIcon name="lucide:chevron-down" size={12} color="var(--brand-navy)"
          style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div className="cp-audience-menu" role="listbox" aria-label="Audience">
          {CP_AUDIENCE_OPTS.map((opt) => (
            <button key={opt.label} role="option" aria-selected={opt.label === value}
              className={"cp-audience-opt" + (opt.label === value ? " on" : "")}
              onClick={() => { onChange(opt.label); setOpen(false); }}>
              <span className="cp-aopt-ic">
                <DSCP.IconifyIcon name={opt.icon} size={22} color="var(--gray-700)" />
              </span>
              <span className="cp-aopt-lbl">{opt.label}</span>
              {opt.badge && (
                <DSCP.IconifyIcon name={opt.badge} size={20} color="#ce9957" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>);
}

const CP_ATTACH = [
  { icon: "lucide:image", label: "Photo", color: "#2d9d5a" },
  { icon: "lucide:video", label: "Video", color: "#e56c1b" },
  { icon: "lucide:at-sign", label: "Tag people", color: "#1d7fc4" },
  { icon: "lucide:map-pin", label: "Location", color: "#d03b3b" },
  { icon: "lucide:smile", label: "Feeling", color: "#d4a017" },
];

function CPTopBar({ canPost, onPost, onCancel }) {
  return (
    <header className="cp-top">
      <button className="cp-cancel" onClick={onCancel}>Cancel</button>
      <span className="cp-title">Create Post</span>
      <button className="cp-post-btn" disabled={!canPost} onClick={onPost}>Post</button>
    </header>);
}

function CPTagPicker({ tags, selected, onToggle }) {
  return (
    <div className="cp-tags">
      <span className="cp-attach-label">Add hashtags</span>
      <div className="pf-tagbar">
        {tags.map((t) => (
          <button key={t.slug} type="button"
            className={"pf-tagchip" + (selected.includes(t.slug) ? " on" : "")}
            onClick={() => onToggle(t.slug)}>
            #{t.label}
          </button>
        ))}
      </div>
    </div>);
}

function CPScreen() {
  const [text, setText] = React.useState("");
  const [channels, setChannels] = React.useState(() => {
    try {
      const raw = sessionStorage.getItem("pf_post_channels");
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  });
  const [images, setImages] = React.useState([]);
  const [audience, setAudience] = React.useState("Everyone");
  const [allTags] = React.useState(() => (window.PFHashtags ? window.PFHashtags.getAll() : []));
  const [selectedTags, setSelectedTags] = React.useState(["update"]);
  const textareaRef = React.useRef(null);
  const backTo = channels.length > 0 ? "CommunityMobile.html" : "NewsfeedMobile.html";

  const toggleTag = (slug) => {
    setSelectedTags((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  React.useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  const handlePost = () => {
    const body = text.trim();
    if (!body) return;
    if (channels.length === 0) {
      const post = {
        id: "u" + Date.now(),
        author: { name: PFACP.ME.name, avatar: PFACP.ME.avatar, seals: ["gb", "verified"] },
        time: "Just now", hashtags: selectedTags,
        media: images, body, likes: "0", comments: "0", shares: "0", commentList: []
      };
      try {
        const existing = JSON.parse(localStorage.getItem("pf-newsfeed-user-posts")) || [];
        localStorage.setItem("pf-newsfeed-user-posts", JSON.stringify([post, ...existing]));
      } catch (e) {}
    }
    try { sessionStorage.removeItem("pf_post_channels"); } catch (e) {}
    goCP(backTo);
  };

  const handleImagePick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files || []).slice(0, Math.max(0, 4 - images.length));
      files.forEach((f) => {
        const reader = new FileReader();
        reader.onload = () => setImages((prev) => [...prev, reader.result].slice(0, 4));
        reader.readAsDataURL(f);
      });
    };
    input.click();
  };

  return (
    <div className="cp-screen" data-screen-label="Create Post (mobile)">
      <CPTopBar canPost={text.trim().length > 0} onPost={handlePost} onCancel={() => goCP(backTo)} />

      <div className="cp-scroll">
        {/* ---- Author row ---- */}
        <div className="cp-author">
          <DSCP.Avatar name={PFACP.ME.name} src={PFACP.ME.avatar} size={46} />
          <div className="cp-author-meta">
            <div className="cp-author-name-row">
              <span className="cp-author-name">{PFACP.ME.name}</span>
              <CPAudiencePicker value={audience} onChange={setAudience} />
            </div>
            {channels.length > 0 && (
              <div className="cp-channels">
                <DSCP.IconifyIcon name="lucide:users" size={13} color="var(--gray-500)" />
                {channels.map((ch) => (
                  <span key={ch} className="cp-ch-chip">{ch}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---- Text input ---- */}
        <textarea
          ref={textareaRef}
          className="cp-textarea"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)} />

        {/* ---- Image previews ---- */}
        {images.length > 0 && (
          <div className={"cp-images cp-images-" + images.length}>
            {images.map((src, i) => (
              <div key={i} className="cp-img-wrap">
                <img src={src} alt="" className="cp-img" />
                <button className="cp-img-rm" aria-label="Remove"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}>
                  <DSCP.IconifyIcon name="lucide:x" size={14} color="var(--white)" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---- Hashtag picker ---- */}
        <CPTagPicker tags={allTags} selected={selectedTags} onToggle={toggleTag} />

      </div>

      {/* ---- Attachment toolbar ---- */}
      <div className="cp-attach-bar">
        <span className="cp-attach-label">Add to your post</span>
        <div className="cp-attach-row">
          {CP_ATTACH.map((a) => (
            <button key={a.label} className="cp-attach-btn" aria-label={a.label}
              onClick={a.label === "Photo" ? handleImagePick : undefined}>
              <DSCP.IconifyIcon name={a.icon} size={24} color={a.color} />
            </button>
          ))}
        </div>
      </div>
    </div>);
}

function CreatePostApp() {
  const mobile = useIsMobileCP();
  const scale = useDeviceScaleCP();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  const screen = <CPScreen />;
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}>{screen}</div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(216, 218, 226)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}>{screen}</IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CreatePostApp />);
