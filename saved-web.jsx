/* ===========================================================================
   PROfinity — My Saved (web)
   Desktop counterpart to MySaved.html (my-saved.jsx): same Collections/Courses/
   Posts/Resources tabs and lm-col-style collection tiles (image + gradient
   veil + name/count + lock badge), on the web page shell (TopNav + centered
   column) instead of the phone frame. Reached from MyLearning.html.
   Suffixed -SW to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateSW, useEffect: useEffectSW } = React;
const DSSW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavSW, IconifyIcon: IconifySW, Icon: IconSW } = DSSW;

const ME_SW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goSW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateSW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goSW(u);
}

/* Same collections shown on the mobile My Saved screen (my-saved.jsx's
   MS_COLLECTIONS) — kept in sync by hand since each page loads its own copy. */
const SW_COLLECTIONS = [
  { name: "Lip protocols", n: 14, img: "assets/post5-img10.png" },
  { name: "Toxin techniques", n: 22, img: "assets/post1-img4.png" },
  { name: "Watch later", n: 8, img: null, icon: "clock" },
  { name: "Complication cases", n: 11, img: "assets/course-complications.jpg" },
  { name: "Full-face assessment", n: 6, img: "assets/post5-img1.png" },
  { name: "Business growth", n: 9, img: "assets/course-marketing.webp" },
  { name: "Temple & midface", n: 5, img: "assets/course-temple-filler.webp" },
  { name: "Chairside handouts", n: 17, img: "assets/post3-img3.png" },
];

const SW_TABS = [
  { k: "Collections", n: 8 },
  { k: "Courses", n: 26 },
  { k: "Posts", n: 112 },
  { k: "Resources", n: 34 },
];

/* ---- Collection detail (2026-10-21), desktop twin of MSCollectionDetail in
   my-saved.jsx: SavedWeb.html?collection=<name> → title, "N posts 🔒",
   Manage (select + Remove) and a tight thumbnail grid with play + views. */
const SW_POST_POOL = [
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
function swCollectionPosts(c) {
  const start = SW_COLLECTIONS.findIndex((x) => x.name === c.name) * 3;
  return Array.from({ length: Math.min(c.n, SW_POST_POOL.length) }, (_, i) => ({ id: c.name + "-" + i, ...SW_POST_POOL[(start + i) % SW_POST_POOL.length] }));
}
function swParam(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }
function SWCollectionDetail({ c }) {
  const [posts, setPosts] = useStateSW(() => swCollectionPosts(c));
  const [manage, setManage] = useStateSW(false);
  const [sel, setSel] = useStateSW(() => new Set());
  const toggle = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const remove = () => { setPosts((p) => p.filter((x) => !sel.has(x.id))); setSel(new Set()); setManage(false); };
  return (
    <div className="sw-page swc-page" data-screen-label="Collection">
      <button type="button" className="sw-back" onClick={() => goSW("SavedWeb.html" + (swParam("from") ? "?from=" + encodeURIComponent(swParam("from")) : ""))}>
        <IconifySW name="lucide:arrow-left" size={18} color="var(--brand-navy)" />Back to My Saved
      </button>
      <div className="swc-head">
        <div className="swc-head-tx">
          <h1 className="swc-title">{c.name}</h1>
          <p className="swc-sub">{posts.length} {posts.length === 1 ? "post" : "posts"} <IconifySW name="lucide:lock" size={16} color="var(--gray-400)" /></p>
        </div>
        <div className="swc-actions">
          {manage && <button type="button" className="swc-remove" disabled={!sel.size} onClick={remove}>Remove{sel.size ? " (" + sel.size + ")" : ""}</button>}
          <button type="button" className={"swc-manage" + (manage ? " on" : "")} onClick={() => { setManage((m) => !m); setSel(new Set()); }}>{manage ? "Done" : "Manage"}</button>
          <button type="button" className="swc-share" aria-label="Share collection" title="Share"><IconifySW name="lucide:share" size={18} color="var(--brand-navy)" /></button>
        </div>
      </div>
      {posts.length === 0 ?
        <div className="sw-saved-empty"><IconifySW name="lucide:bookmark" size={38} color="var(--gray-400)" /><h3>Nothing in this collection</h3><p>Save a post here from the bookmark on any post.</p></div> :
        <div className={"swc-grid" + (manage ? " is-manage" : "")} role="list">
          {posts.map((p) => (
            <button key={p.id} type="button" role="listitem" className={"swc-tile" + (sel.has(p.id) ? " sel" : "")}
              aria-label={(manage ? (sel.has(p.id) ? "Deselect" : "Select") : "Open") + " post, " + p.views + " views"}
              onClick={() => manage ? toggle(p.id) : goSW("SocialStream.html")}>
              <img src={p.img} alt="" loading="lazy" />
              <span className="swc-views"><IconifySW name="lucide:play" size={14} color="#fff" />{p.views}</span>
              {manage && <span className={"swc-check" + (sel.has(p.id) ? " on" : "")} aria-hidden="true">{sel.has(p.id) && <IconifySW name="lucide:check" size={14} color="#fff" />}</span>}
            </button>
          ))}
        </div>}
    </div>
  );
}

function SWCollectionTile({ c }) {
  return (
    <button className={"sw-col" + (c.img ? "" : " empty")} onClick={() => goSW("SavedWeb.html?collection=" + encodeURIComponent(c.name) + (swParam("from") ? "&from=" + encodeURIComponent(swParam("from")) : ""))}>
      {c.img ?
        <img src={c.img} alt="" /> :
        <span className="sw-col-blank" aria-hidden="true" />}
      <span className="sw-col-veil" aria-hidden="true" />
      <span className="sw-col-meta">
        <IconifySW name={c.icon === "clock" ? "lucide:clock" : "lucide:bookmark"} size={20} color="#fff" />
        <span className="sw-col-name">{c.name}</span>
        <span className="sw-col-n">{c.n} saved</span>
      </span>
      <span className="sw-col-lock" aria-label="Private collection">
        <IconifySW name="lucide:lock" size={15} color="#fff" />
      </span>
    </button>
  );
}

function SWNewCollectionModal({ onClose }) {
  const [name, setName] = useStateSW("");
  const [makePublic, setMakePublic] = useStateSW(false);

  useEffectSW(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sw-modal-overlay" onClick={onClose}>
      <div className="sw-modal" role="dialog" aria-modal="true" aria-label="Create new collection" onClick={e => e.stopPropagation()}>
        <div className="sw-modal-hd">
          <h2>Create new collection</h2>
          <button className="sw-modal-close" onClick={onClose} aria-label="Close">
            <IconifySW name="lucide:x" size={20} color="var(--gray-600)" />
          </button>
        </div>

        <div className="sw-modal-body">
          <div className="sw-modal-card">
            <div className="sw-modal-field">
              <label htmlFor="sw-cn-name">Name</label>
              <input id="sw-cn-name" type="text" placeholder="Enter collection name"
                value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
          </div>

          <div className="sw-modal-card">
            <button className="sw-modal-row" type="button">
              <span className="sw-modal-row-copy">
                <span className="sw-modal-row-title">Share with a friend</span>
                <span className="sw-modal-row-sub">They will be able to add their favorite posts.</span>
              </span>
              <IconifySW name="lucide:chevron-right" size={20} color="var(--gray-450)" />
            </button>
            <div className="sw-modal-row">
              <span className="sw-modal-row-copy">
                <span className="sw-modal-row-title">Make public</span>
                <span className="sw-modal-row-sub">The collection will be shown on your profile.</span>
              </span>
              <button className={"sw-switch" + (makePublic ? " on" : "")} role="switch"
                aria-checked={makePublic} aria-label="Make public" onClick={() => setMakePublic(v => !v)}>
                <span className="sw-knob" />
              </button>
            </div>
          </div>

          <button className="sw-modal-cta" disabled={!name.trim()} onClick={onClose}>Create collection</button>
        </div>
      </div>
    </div>
  );
}

function SavedWebApp() {
  const [tab, setTab] = useStateSW("Collections");
  const [query, setQuery] = useStateSW("");
  const [newCollectionOpen, setNewCollectionOpen] = useStateSW(false);

  const collections = SW_COLLECTIONS.filter(c =>
    !query.trim() || c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const swColName = swParam("collection");
  const swCol = swColName ? SW_COLLECTIONS.find((c) => c.name === swColName) : null;

  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavSW active="My Learning" user={ME_SW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateSW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      {swCol ? <SWCollectionDetail c={swCol} /> :
      <div className="sw-page" data-screen-label="My Saved">
        <button type="button" className="sw-back" onClick={() => goSW(swParam("from") === "profile" ? "Profile.html" : "MyLearning.html")}>
          <IconifySW name="lucide:arrow-left" size={18} color="var(--brand-navy)" />{swParam("from") === "profile" ? "Back to Profile" : "Back to My Learning"}
        </button>

        <div className="sw-head">
          <h1>My Saved</h1>
          <p>Everything you&rsquo;ve bookmarked &mdash; organised into collections for quick access.</p>
        </div>

        <div className="sw-toolbar">
          <label className="sw-search">
            <IconSW name="search" size={20} color="var(--gray-450)" />
            <input placeholder="Search saved items…" aria-label="Search saved items" value={query}
              onChange={(e) => setQuery(e.target.value)} />
          </label>
          <div className="sw-tabs" role="tablist" aria-label="Saved content">
            {SW_TABS.map(t =>
              <button key={t.k} role="tab" aria-selected={tab === t.k}
                className={"sw-tab" + (tab === t.k ? " on" : "")} onClick={() => setTab(t.k)}>
                {t.k} <span className="n">{t.n}</span>
              </button>
            )}
          </div>
        </div>

        {tab === "Collections" ? (
          collections.length === 0 ? (
            <p className="sw-empty">No collections match your search.</p>
          ) : (
            <div className="sw-colgrid">
              <button className="sw-col sw-col-new" aria-label="Create a new collection" onClick={() => setNewCollectionOpen(true)}>
                <span className="sw-col-plus"><IconifySW name="lucide:plus" size={28} color="var(--brand-navy)" /></span>
                <span className="sw-col-newtx">New collection</span>
              </button>
              {collections.map(c => <SWCollectionTile key={c.name} c={c} />)}
            </div>
          )
        ) : (
          <div className="sw-saved-empty">
            <IconifySW name="lucide:bookmark" size={38} color="var(--gray-400)" />
            <h3>Nothing saved here yet</h3>
            <p>Tap the bookmark on any {tab.toLowerCase().replace(/s$/, "")} to keep it for later.</p>
          </div>
        )}
      </div>}

      {newCollectionOpen && <SWNewCollectionModal onClose={() => setNewCollectionOpen(false)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<SavedWebApp />);
