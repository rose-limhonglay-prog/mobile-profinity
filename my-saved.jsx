/* ===========================================================================
   PROfinity — My Saved (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -MS to avoid global-scope clashes.
   Collection tiles reuse the lm-col / lm-savedtabs classes from learning-mobile.css.
   =========================================================================== */
const { useState: useStateMS, useEffect: useEffectMS } = React;
const DSMS = window.ProfinityDesignSystem_c2b5cc;

function goMS(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function msBackTarget() {
  const from = new URLSearchParams(window.location.search).get("from");
  if (from === "learning") return "LearningMobile.html";
  return /LearningMobile\.html/i.test(document.referrer) ? "LearningMobile.html" : "AccountSettings.html";
}

function useDeviceScaleMS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateMS(calc);
  useEffectMS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileMS() {
  const [mobile, setMobile] = useStateMS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectMS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const MS_COLLECTIONS = [
  { name: "Lip protocols", n: 14, img: "assets/course-lip.png" },
  { name: "Toxin techniques", n: 22, img: "assets/course-protox.png" },
  { name: "Watch later", n: 8, img: null, icon: "clock" },
  { name: "Complication cases", n: 11, img: "assets/chin-positions.png" },
  { name: "Full-face assessment", n: 6, img: "assets/post5-img1.png" },
  { name: "Business growth", n: 9, img: "assets/post3-img1.png" },
  { name: "Temple & midface", n: 5, img: "assets/course-temple.png" },
  { name: "Chairside handouts", n: 17, img: "assets/clinic-toxin-guide.png" },
];

const MS_TABS = [
  { k: "Collections", n: 8 },
  { k: "Courses", n: 26 },
  { k: "Posts", n: 112 },
  { k: "Resources", n: 34 },
];

function MSCollectionTile({ c }) {
  return (
    <button className={"lm-col" + (c.img ? "" : " empty")}>
      {c.img ?
        <img src={c.img} alt="" /> :
        <span className="lm-col-blank" aria-hidden="true" />}
      <span className="lm-col-veil" aria-hidden="true" />
      <span className="lm-col-meta">
        <DSMS.IconifyIcon name={c.icon === "clock" ? "lucide:clock" : "lucide:bookmark"} size={20} color="#fff" />
        <span className="lm-col-name">{c.name}</span>
        <span className="lm-col-n">{c.n} saved</span>
      </span>
      <span className="lm-col-lock" aria-label="Private collection">
        <DSMS.IconifyIcon name="lucide:lock" size={15} color="#fff" />
      </span>
    </button>
  );
}

function MSNewCollectionSheet({ onClose }) {
  const [name, setName] = useStateMS("");
  const [makePublic, setMakePublic] = useStateMS(false);

  useEffectMS(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="mcs-overlay" onClick={onClose}>
      <div className="mcs-sheet" role="dialog" aria-modal="true" aria-label="Create new collection" onClick={e => e.stopPropagation()}>
        <div className="mcs-hd">
          <button className="mcs-close" onClick={onClose} aria-label="Close">
            <DSMS.IconifyIcon name="lucide:x" size={22} color="var(--gray-900)" />
          </button>
          <h2>Create new collection</h2>
        </div>

        <div className="mcs-body">
          <div className="mcs-card">
            <div className="mcs-field">
              <label htmlFor="mcs-name">Name</label>
              <input id="mcs-name" type="text" placeholder="Enter collection name"
                value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
          </div>

          <div className="mcs-card">
            <button className="mcs-row" type="button">
              <span className="mcs-row-copy">
                <span className="mcs-row-title">Share with a friend</span>
                <span className="mcs-row-sub">They will be able to add their favorite posts.</span>
              </span>
              <span className="mcs-row-right">
                <DSMS.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </span>
            </button>
            <div className="mcs-row">
              <span className="mcs-row-copy">
                <span className="mcs-row-title">Make public</span>
                <span className="mcs-row-sub">The collection will be shown on your profile.</span>
              </span>
              <span className="mcs-row-right">
                <button className={"mcs-switch" + (makePublic ? " on" : "")} role="switch"
                  aria-checked={makePublic} aria-label="Make public" onClick={() => setMakePublic(v => !v)}>
                  <span className="mcs-knob" />
                </button>
              </span>
            </div>
          </div>

          <button className="mcs-cta" disabled={!name.trim()} onClick={onClose}>Next</button>
        </div>
      </div>
    </div>
  );
}

function MySaved() {
  const [tab, setTab] = useStateMS("Collections");
  const [newCollectionOpen, setNewCollectionOpen] = useStateMS(false);

  return (
    <div className="ms-screen" data-screen-label="My Saved (mobile)">
      <header className="ms-top">
        <button className="ms-back" aria-label="Back" onClick={() => goMS(msBackTarget())}>
          <DSMS.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>My Saved</h1>
        <button className="ms-back" aria-label="Search saved items">
          <DSMS.IconifyIcon name="lucide:search" size={22} color="var(--gray-900)" />
        </button>
      </header>

      <div className="ms-scroll">
        <div className="lm-savedtabs" role="tablist" aria-label="Saved content">
          {MS_TABS.map(t =>
            <button key={t.k} role="tab" aria-selected={tab === t.k}
              className={"lm-st" + (tab === t.k ? " on" : "")} onClick={() => setTab(t.k)}>
              {t.k} <span className="n">{t.n}</span>
            </button>
          )}
        </div>

        {tab === "Collections" ?
          <div className="lm-colgrid">
            <button className="lm-col lm-col-new" aria-label="Create a new collection" onClick={() => setNewCollectionOpen(true)}>
              <span className="lm-col-plus"><DSMS.IconifyIcon name="lucide:plus" size={26} color="var(--brand-navy)" /></span>
              <span className="lm-col-newtx">New collection</span>
            </button>
            {MS_COLLECTIONS.map(c => <MSCollectionTile key={c.name} c={c} />)}
          </div> :
          <div className="lm-saved-empty">
            <DSMS.IconifyIcon name="lucide:bookmark" size={34} color="var(--gray-400)" />
            <p><b>Nothing saved here yet</b>Tap the bookmark on any {tab.toLowerCase().replace(/s$/, "")} to keep it for later.</p>
          </div>}

        <div style={{ height: 24 }} />
      </div>

      {newCollectionOpen && <MSNewCollectionSheet onClose={() => setNewCollectionOpen(false)} />}
    </div>
  );
}

function MySavedApp() {
  const mobile = useIsMobileMS();
  const scale = useDeviceScaleMS();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}><MySaved /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><MySaved /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MySavedApp />);
