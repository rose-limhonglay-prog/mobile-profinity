/* ===========================================================================
   PROfinity — Search · iPhone 17 Pro Max mobile
   Suffixed -SR to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateSR, useEffect: useEffectSR } = React;
const DSSR = window.ProfinityDesignSystem_c2b5cc;

function goSR(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleSR() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSR(calc);
  useEffectSR(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileSR() {
  const [mobile, setMobile] = useStateSR(() => window.matchMedia('(max-width:768px)').matches);
  useEffectSR(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const SR_RECENT = [
  { id: 1, name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", dot: "1 new comment on the latest post", ring: true },
  { id: 2, name: "Facial Aesthetics Hub", avatar: null, dot: "9+ new", ring: true },
  { id: 3, name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", dot: null, ring: false },
  { id: 4, name: "PROfinity Business Academy", avatar: null, sub: "Business · 14K followers", dot: null, ring: false },
  { id: 5, name: "Katy Wilson", avatar: "assets/avatar-katy.jpg", dot: "1 new", ring: true },
  { id: 6, name: "Jane Harries", avatar: null, dot: "9+ new", ring: true },
];

const SR_PEOPLE = [
  { id: 1, name: "Dr Sarah Mitchell", avatar: "assets/avatar-miranda.jpg", mutual: 49, mutualAvatars: ["assets/avatar-drtim.png", "assets/avatar-katy.jpg"] },
  { id: 2, name: "Dr James Chen", avatar: null, mutual: 50, mutualAvatars: ["assets/avatar-miranda.jpg", "assets/avatar-drtim.png"] },
];

function SRRecentRow({ r }) {
  return (
    <button className="sr-row" onClick={() => {}}>
      <span className={"sr-av-wrap" + (r.ring ? " sr-av-ring" : "")}>
        <DSSR.Avatar name={r.name} src={r.avatar} size={44} />
      </span>
      <span className="sr-row-main">
        <span className="sr-row-name">{r.name}</span>
        {r.sub && <span className="sr-row-sub">{r.sub}</span>}
        {r.dot &&
          <span className="sr-dot-wrap">
            <span className="sr-live-dot" />
            <span className="sr-dot-text">{r.dot}</span>
          </span>
        }
      </span>
      <button className="sr-more" aria-label="More options" onClick={(e) => e.stopPropagation()}>
        <DSSR.IconifyIcon name="lucide:more-horizontal" size={20} color="var(--gray-500)" />
      </button>
    </button>
  );
}

function SRPostRow({ post, tag }) {
  return (
    <button className="sr-post-row" onClick={() => {}}>
      <DSSR.Avatar name={post.author?.name} src={post.author?.avatar} size={40} />
      <span className="sr-post-main">
        <span className="sr-post-top">
          <span className="sr-post-name">{post.author?.name}</span>
          {tag && ["confidence", "mastery", "freedom", "inner-circle"].includes(tag.slug) &&
            <span className="pf-hashtag-badge">#{tag.label}</span>}
        </span>
        <span className="sr-post-body">{post.body}</span>
      </span>
    </button>
  );
}

function SRPersonCard({ p }) {
  const [added, setAdded] = useStateSR(false);
  return (
    <div className="sr-person-card">
      {p.avatar
        ? <img className="sr-person-photo" src={p.avatar} alt={p.name} />
        : <div className="sr-person-photo-placeholder">
            <DSSR.Avatar name={p.name} size={56} />
          </div>
      }
      <div className="sr-person-body">
        <span className="sr-person-name">{p.name}</span>
        <span className="sr-mutual">
          <span className="sr-mutual-avs">
            {p.mutualAvatars.map((src, i) =>
              <span key={i} className="sr-mutual-av">
                <img src={src} alt="" />
              </span>
            )}
          </span>
          <span className="sr-mutual-text">{p.mutual} mutual friends</span>
        </span>
        <div className="sr-person-actions">
          <button className={"sr-btn-add" + (added ? " sr-btn-requested" : "")} onClick={() => setAdded(true)}>
            {added ? "Requested" : "Add friend"}
          </button>
          <button className="sr-btn-remove">Remove</button>
        </div>
      </div>
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useStateSR("");
  const [allTags] = useStateSR(() => (window.PFHashtags ? window.PFHashtags.getAll() : []));

  const q = query.trim().toLowerCase().replace(/^#/, "");
  const matchedTag = q ? allTags.find((t) => t.slug === t.slug && (t.label.toLowerCase() === q || t.slug === q || t.label.toLowerCase().includes(q))) : null;
  const matchedPosts = matchedTag && window.PFApp
    ? window.PFApp.getAllPosts().filter((p) => (p.hashtags || []).includes(matchedTag.slug)).slice(0, 8)
    : [];

  return (
    <div className="sr-screen" data-screen-label="Search (mobile)">
      <header className="sr-head">
        <button className="sr-back" aria-label="Back" onClick={() => goSR("NewsfeedMobile.html")}>
          <DSSR.IconifyIcon name="lucide:chevron-left" size={28} color="var(--gray-900)" />
        </button>
        <div className="sr-search-pill">
          <DSSR.Icon name="search" size={17} color="var(--gray-450)" />
          <input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            aria-label="Search"
          />
        </div>
      </header>

      <div className="sr-scroll">
        <div className="sr-sec">
          <span className="sr-sec-title">Browse hashtags</span>
        </div>
        <div className="pf-tagbar" style={{ padding: "0 20px 4px" }}>
          {allTags.map((t) => (
            <button key={t.slug} type="button"
              className={"pf-tagchip" + (matchedTag && matchedTag.slug === t.slug ? " on" : "")}
              onClick={() => setQuery(t.label)}>
              #{t.label}
            </button>
          ))}
        </div>

        {matchedTag ? (
          <React.Fragment>
            <div className="sr-sec">
              <span className="sr-sec-title">Posts tagged #{matchedTag.label}</span>
            </div>
            <div className="sr-list">
              {matchedPosts.length > 0
                ? matchedPosts.map((p) => <SRPostRow key={p.id} post={p} tag={matchedTag} />)
                : <div className="sr-empty">No posts tagged #{matchedTag.label} yet.</div>}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="sr-sec">
              <span className="sr-sec-title">Recent</span>
              <button className="sr-sec-link">See all</button>
            </div>
            <div className="sr-list">
              {SR_RECENT.map((r) => <SRRecentRow key={r.id} r={r} />)}
            </div>

            <div className="sr-sec">
              <span className="sr-sec-title">People you may know</span>
              <button className="sr-sec-link">See all</button>
            </div>
            <div className="sr-people-grid">
              {SR_PEOPLE.map((p) => <SRPersonCard key={p.id} p={p} />)}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function SearchApp() {
  const mobile = useIsMobileSR();
  const scale = useDeviceScaleSR();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(217, 218, 225)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><SearchPage /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><SearchPage /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<SearchApp />);
