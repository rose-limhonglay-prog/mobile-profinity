/* ===========================================================================
   PROfinity — Admin Panel (mobile) · iPhone 17 Pro Max
   Manages the fixed, admin-curated hashtag ("bucket") list every post picks
   from — the only place new hashtags can be created. Composed on the bound
   DS bundle. Suffixed -AP to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateAP } = React;
const DSAP = window.ProfinityDesignSystem_c2b5cc;

function goAP(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleAP() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateAP(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileAP() {
  const [mobile, setMobile] = useStateAP(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function APRow({ tag, onRemove }) {
  return (
    <div className="ap-row">
      <span className="ap-row-icon">
        <DSAP.IconifyIcon name={tag.icon || "lucide:hash"} size={20} color="var(--brand-navy)" />
      </span>
      <span className="ap-row-main">
        <span className="ap-row-label">{tag.label}</span>
        <span className="ap-row-slug">#{tag.slug}</span>
      </span>
      <button className="ap-row-del" aria-label={"Remove " + tag.label} onClick={() => onRemove(tag.slug)}>
        <DSAP.IconifyIcon name="lucide:trash-2" size={18} color="var(--error)" />
      </button>
    </div>
  );
}

function AdminPanel() {
  const [tags, setTags] = useStateAP(() => window.PFHashtags.getAll());
  const [label, setLabel] = useStateAP("");

  const slug = window.PFHashtags.slugify(label);
  const isDuplicate = slug && tags.some((t) => t.slug === slug);
  const canAdd = slug.length > 0 && !isDuplicate;

  const handleAdd = () => {
    if (!canAdd) return;
    setTags(window.PFHashtags.add({ label: label.trim() }));
    setLabel("");
  };

  const handleRemove = (s) => {
    setTags(window.PFHashtags.remove(s));
  };

  return (
    <div className="ap-screen" data-screen-label="Admin Panel (mobile)">
      <header className="ap-top">
        <button className="ap-back" aria-label="Back" onClick={() => goAP("NewsfeedMobile.html")}>
          <DSAP.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>Admin Panel</h1>
      </header>

      <div className="ap-scroll">
        <div className="ap-sec-h">Hashtag Buckets</div>
        <p className="ap-sec-desc">
          Manage the hashtags available across the app. Members pick from this list when posting —
          they can't create their own. Each hashtag acts as a bucket for filtering, search and
          recommendations throughout the Newsfeed.
        </p>

        <div className="ap-add-row">
          <input
            type="text"
            className="ap-add-input"
            placeholder="New hashtag, e.g. Skincare"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            aria-label="New hashtag label"
          />
          <button className="ap-add-btn" disabled={!canAdd} onClick={handleAdd}>Add</button>
        </div>
        {isDuplicate && <p className="ap-add-warn">#{slug} already exists.</p>}

        <div className="ap-list">
          {tags.map((t) => <APRow key={t.slug} tag={t} onRemove={handleRemove} />)}
          {tags.length === 0 && <p className="ap-empty">No hashtags yet — add one above.</p>}
        </div>
      </div>
    </div>
  );
}

function AdminPanelApp() {
  const mobile = useIsMobileAP();
  const scale = useDeviceScaleAP();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}><AdminPanel /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><AdminPanel /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AdminPanelApp />);
