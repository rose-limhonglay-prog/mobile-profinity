/* ===========================================================================
   PROfinity — My Saved (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -MS to avoid global-scope clashes.
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

const MS_ITEMS = [
  {
    id: 1, type: "post", category: "Post",
    title: "Temple Filler Techniques",
    subtitle: "Katy Wilson · London, United Kingdom",
    meta: "Saved today",
    icon: "lucide:file-text",
    color: "var(--brand-navy)"
  },
  {
    id: 2, type: "course", category: "Course",
    title: "The Ultimate Toxin Eye Complications Masterclass",
    subtitle: "PROfinity Academy",
    meta: "Saved 3 days ago",
    icon: "lucide:graduation-cap",
    color: "var(--ai-purple)"
  },
  {
    id: 3, type: "post", category: "Post",
    title: "Advanced Lip Anatomy for Aesthetic Practitioners",
    subtitle: "Dr. Tim Pearce · Career Academy",
    meta: "Saved last week",
    icon: "lucide:file-text",
    color: "var(--brand-navy)"
  },
  {
    id: 4, type: "course", category: "Course",
    title: "8D Lips Course",
    subtitle: "PROfinity Academy",
    meta: "Saved last week",
    icon: "lucide:graduation-cap",
    color: "var(--ai-purple)"
  },
  {
    id: 5, type: "event", category: "Event",
    title: "Aesthetics Summit London 2026",
    subtitle: "ExCeL London · 14 Aug 2026",
    meta: "Saved 2 weeks ago",
    icon: "lucide:calendar",
    color: "var(--premium-orange)"
  },
  {
    id: 6, type: "course", category: "Course",
    title: "Pro Tox Course",
    subtitle: "PROfinity Academy",
    meta: "Saved 3 weeks ago",
    icon: "lucide:graduation-cap",
    color: "var(--ai-purple)"
  },
  {
    id: 7, type: "post", category: "Post",
    title: "Emerging Technologies in Aesthetic Medicine",
    subtitle: "Linda Garcia · Toronto, Canada",
    meta: "Saved last month",
    icon: "lucide:file-text",
    color: "var(--brand-navy)"
  },
  {
    id: 8, type: "event", category: "Event",
    title: "Injectable Masterclass Workshop",
    subtitle: "Harley Street, London · 22 Sep 2026",
    meta: "Saved last month",
    icon: "lucide:calendar",
    color: "var(--premium-orange)"
  },
];

const MS_TABS = ["All", "Posts", "Courses", "Events"];

function MSTab({ label, active, onClick }) {
  return (
    <button className={"ms-tab" + (active ? " on" : "")} onClick={onClick}>
      {label}
    </button>
  );
}

function MSSavedCard({ item, onUnsave }) {
  return (
    <div className="ms-card">
      <div className="ms-card-icon" style={{ background: item.color + "18" }}>
        <DSMS.IconifyIcon name={item.icon} size={22} color={item.color} />
      </div>
      <div className="ms-card-body">
        <span className="ms-card-cat" style={{ color: item.color }}>{item.category}</span>
        <h3 className="ms-card-title">{item.title}</h3>
        <p className="ms-card-sub">{item.subtitle}</p>
        <p className="ms-card-meta">{item.meta}</p>
      </div>
      <button className="ms-card-unsave" aria-label="Remove from saved" onClick={() => onUnsave(item.id)}>
        <DSMS.IconifyIcon name="lucide:bookmark" size={20} color="var(--brand-navy)" />
      </button>
    </div>
  );
}

function MSEmpty() {
  return (
    <div className="ms-empty">
      <div className="ms-empty-icon">
        <DSMS.IconifyIcon name="lucide:bookmark" size={36} color="var(--gray-400)" />
      </div>
      <h3 className="ms-empty-h">Nothing saved yet</h3>
      <p className="ms-empty-sub">Bookmark posts, courses, and events to find them here.</p>
    </div>
  );
}

function MySaved() {
  const [activeTab, setActiveTab] = useStateMS("All");
  const [items, setItems] = useStateMS(MS_ITEMS);

  const typeMap = { Posts: "post", Courses: "course", Events: "event" };
  const filtered = activeTab === "All" ? items : items.filter(i => i.type === typeMap[activeTab]);

  function unsave(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="ms-screen" data-screen-label="My Saved (mobile)">
      <header className="ms-top">
        <button className="ms-back" aria-label="Back" onClick={() => goMS(msBackTarget())}>
          <DSMS.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>My Saved</h1>
      </header>

      <div className="ms-tabs-row">
        {MS_TABS.map(t =>
          <MSTab key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} />
        )}
      </div>

      <div className="ms-scroll">
        {filtered.length === 0
          ? <MSEmpty />
          : filtered.map(item => <MSSavedCard key={item.id} item={item} onUnsave={unsave} />)
        }
      </div>
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
