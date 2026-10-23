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
  if (from === "profile") return "ProfileMobile.html";
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
  { name: "Lip protocols", n: 14, img: "assets/post5-img10.png" },
  { name: "Toxin techniques", n: 22, img: "assets/post1-img4.png" },
  { name: "Watch later", n: 8, img: null, icon: "clock" },
  { name: "Complication cases", n: 11, img: "assets/course-complications.jpg" },
  { name: "Full-face assessment", n: 6, img: "assets/post5-img1.png" },
  { name: "Business growth", n: 9, img: "assets/course-marketing.webp" },
  { name: "Temple & midface", n: 5, img: "assets/course-temple-filler.webp" },
  { name: "Chairside handouts", n: 17, img: "assets/post3-img3.png" },
];

const MS_TABS = [
  { k: "Collections", n: 8 },
  { k: "Courses", n: 26 },
  { k: "Posts", n: 112 },
  { k: "Resources", n: 34 },
];

/* ---- Collection detail (user, 2026-10-21 "make the collection same on this",
   after a TikTok collection screen): back + share, big title, "N posts 🔒",
   a Manage pill and a tight 3-column grid of post thumbnails with a play
   glyph and view count. MySaved.html?collection=<name>. Manage = select
   mode with a Remove bar. The posts are a seeded sample per collection. */
const MS_POST_POOL = [
  { img: "assets/post1-img1.png", views: "535.1K" }, { img: "assets/post2-img1.png", views: "65.7K" },
  { img: "assets/post3-img1.png", views: "128K" },   { img: "assets/post4-img1.png", views: "42.3K" },
  { img: "assets/post5-img1.png", views: "88.9K" },  { img: "assets/post-case-p1-img1.jpg", views: "211K" },
  { img: "assets/post1-img2.png", views: "19.4K" },  { img: "assets/post2-img2.png", views: "73.5K" },
  { img: "assets/post3-img2.png", views: "9,812" },  { img: "assets/post4-img2.png", views: "154K" },
  { img: "assets/post1-img3.png", views: "31.7K" },  { img: "assets/post2-img3.png", views: "47.2K" },
  { img: "assets/clinic-lip-design.png", views: "96.1K" }, { img: "assets/clinic-treatment-collage.png", views: "22.8K" },
  { img: "assets/course-cheek-contouring.jpg", views: "61.3K" }, { img: "assets/course-tear-trough.jpg", views: "12.6K" },
  { img: "assets/post3-img3.png", views: "7,204" }, { img: "assets/post4-img3.png", views: "58.9K" },
  { img: "assets/course-jawline-sculpting.jpg", views: "105K" }, { img: "assets/course-skin-boosters.jpg", views: "33.4K" },
  { img: "assets/post1-img4.png", views: "15.2K" }, { img: "assets/course-brow-lift.jpg", views: "84.6K" }
];
function msCollectionPosts(c) {
  const start = MS_COLLECTIONS.findIndex((x) => x.name === c.name) * 3;
  return Array.from({ length: Math.min(c.n, MS_POST_POOL.length) }, (_, i) => ({ id: c.name + "-" + i, ...MS_POST_POOL[(start + i) % MS_POST_POOL.length] }));
}
function msParam(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }
function MSCollectionDetail({ c }) {
  const [posts, setPosts] = useStateMS(() => msCollectionPosts(c));
  const [manage, setManage] = useStateMS(false);
  const [sel, setSel] = useStateMS(() => new Set());
  const toggle = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const remove = () => { setPosts((p) => p.filter((x) => !sel.has(x.id))); setSel(new Set()); setManage(false); };
  const share = () => { try { if (navigator.share) navigator.share({ title: c.name, url: location.href }); } catch (e) {} };
  return (
    <div className="ms-screen msc-screen" data-screen-label="Collection">
      <header className="msc-top">
        <button className="ms-back" aria-label="Back" onClick={() => goMS("MySaved.html" + (msParam("from") ? "?from=" + encodeURIComponent(msParam("from")) : ""))}>
          <DSMS.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <span className="grow" />
        <button className="ms-back" aria-label="Share collection" onClick={share}>
          <DSMS.IconifyIcon name="lucide:share" size={22} color="var(--gray-900)" />
        </button>
      </header>
      <div className="ms-scroll msc-scroll">
        <div className="msc-head">
          <div className="msc-head-tx">
            <h1 className="msc-title">{c.name}</h1>
            <p className="msc-sub">{posts.length} {posts.length === 1 ? "post" : "posts"} <DSMS.IconifyIcon name="lucide:lock" size={16} color="var(--gray-400)" /></p>
          </div>
          <button type="button" className={"msc-manage" + (manage ? " on" : "")} onClick={() => { setManage((m) => !m); setSel(new Set()); }}>{manage ? "Done" : "Manage"}</button>
        </div>
        {posts.length === 0 ?
          <div className="lm-saved-empty">
            <DSMS.IconifyIcon name="lucide:bookmark" size={34} color="var(--gray-400)" />
            <p><b>Nothing in this collection</b>Save a post here from the bookmark on any post.</p>
          </div> :
          <div className={"msc-grid" + (manage ? " is-manage" : "")} role="list">
            {posts.map((p) => (
              <button key={p.id} type="button" role="listitem" className={"msc-tile" + (sel.has(p.id) ? " sel" : "")}
                aria-label={(manage ? (sel.has(p.id) ? "Deselect" : "Select") : "Open") + " post, " + p.views + " views"}
                onClick={() => manage ? toggle(p.id) : goMS("ReelMobile.html")}>
                <img src={p.img} alt="" loading="lazy" />
                <span className="msc-views"><DSMS.IconifyIcon name="lucide:play" size={14} color="#fff" />{p.views}</span>
                {manage && <span className={"msc-check" + (sel.has(p.id) ? " on" : "")} aria-hidden="true">{sel.has(p.id) && <DSMS.IconifyIcon name="lucide:check" size={14} color="#fff" />}</span>}
              </button>
            ))}
          </div>}
        <div style={{ height: manage ? 96 : 24 }} />
      </div>
      {manage && (
        <div className="msc-bar">
          <span className="msc-bar-n">{sel.size ? sel.size + " selected" : "Select posts"}</span>
          <button type="button" className="msc-bar-remove" disabled={!sel.size} onClick={remove}>Remove</button>
        </div>
      )}
    </div>
  );
}

function MSCollectionTile({ c }) {
  return (
    <button className={"lm-col" + (c.img ? "" : " empty")} onClick={() => goMS("MySaved.html?collection=" + encodeURIComponent(c.name) + (msParam("from") ? "&from=" + encodeURIComponent(msParam("from")) : ""))}>
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
  const colName = msParam("collection");
  const col = colName ? MS_COLLECTIONS.find((c) => c.name === colName) : null;
  const screen = col ? <MSCollectionDetail c={col} /> : <MySaved />;
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}>{screen}</div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}>{screen}</IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MySavedApp />);
