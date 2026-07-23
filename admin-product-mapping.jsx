/* ===========================================================================
   PROfinity — Admin · Product Mapping (desktop console)
   GHL / WooCommerce product → course mapping for webhook automation.
   Search + sort controls, source tabs, mapping table with expandable rows.
   Classes prefixed map- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMAP, useMemo: useMemoMAP } = React;

function goMap(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- mock data */
const MAP_ROWS = [
  { id: "0101018201009010 2", course: "Brow Lift Training (Academy)", created: "2026-06-24" },
  { id: "0501018301009010 2", course: "Lip Filler Case Study (Academy)", created: "2026-06-24" },
  { id: "66966ad65a95c0af7b05b928", course: "Anatomy - Anatomy360 (FS) - July 2025 (Pay in Full) + Anatomy - Profinity Members…", created: "2026-05-12" },
  { id: "66966b0c5a95c00d0505b933", course: "Anatomy - Anatomy360 (FS) - July 2025 (Pay Monthly) + Anatomy - Profinity Membe…", created: "2026-05-12" },
  { id: "6744af1553dc515c29720d5c", course: "DCAM 2.0 (Academy)", created: "2026-05-12" },
  { id: "6780f514426d4971f83deb60", course: "Find Your Voice Video Training (Academy)", created: "2026-05-12" },
  { id: "6780f5f2426d49feae3ded56", course: "Canva Course (Academy) £", created: "2026-05-12" },
  { id: "6780f656426d4967413dee1e", course: "The Ultimate Toxin Eye Complications Masterclass (Academy)", created: "2026-05-12" },
];

const MAP_SORT_FIELDS = {
  id: { label: "Product id", get: (r) => r.id.toLowerCase() },
  course: { label: "Course", get: (r) => r.course.toLowerCase() },
  created: { label: "Created", get: (r) => r.created },
};

/* ------------------------------------------------------------- sidebar */
const MAP_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events" },
  { icon: "lucide:map", label: "Product Mapping", active: true },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const MAP_NAV_LINKS = {
  "Dashboard": "AdminDashboard.html",
  "Users": "AdminUsers.html",
  "Posts Management": "AdminPostsManagement.html",
  "Content Moderation": "AdminModeration.html",
  "Service Requests": "AdminServiceRequests.html",
  "Verification": "AdminVerification.html",
  "Agents": "AdminAgents.html",
  "Events": "AdminEvents.html",
  "Product Mapping": "AdminProductMapping.html",
  "Analytics": "AdminAnalytics.html",
  "App Versions": "AdminAppVersions.html",
  "Push Notification": "AdminPushNotifications.html",
  "Transactions": "AdminTransactions.html",
  "Courses": "AdminCourses.html",
  "Community": "AdminCommunity.html",
};

function MapSidebar() {
  return (
    <aside className="map-sidebar">
      <div className="map-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {MAP_NAV.map((item) => {
        const href = MAP_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"map-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goMap(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="map-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="map-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function MapHeader({ title }) {
  return (
    <header className="map-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="map-header-title">{title}</span>
      <div className="map-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="map-spacer" />
      <div className="map-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="map-bell-badge">4</span>
      </div>
      <div className="map-user">
        <div className="map-user-name">Dr Tim Pearce</div>
        <div className="map-user-role">Admin</div>
      </div>
      <img className="map-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ---------------------------------------------------------------- tabs */
const MAP_TABS = [
  { key: "ghl", label: "GHL Products" },
  { key: "woo", label: "WooCommerce Products" },
  { key: "history", label: "History" },
];

function MapTabs({ tab, setTab }) {
  return (
    <div className="map-tabs">
      {MAP_TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          className={"map-tab" + (tab === t.key ? " is-active" : "")}
          onClick={() => setTab(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- table */
function MapRow({ row, expanded, onToggle }) {
  return (
    <div className={"map-row-grid map-trow" + (expanded ? " is-expanded" : "")}>
      <div className="map-cell-product">
        <div className="map-product-id">
          <iconify-icon icon="lucide:share-2"></iconify-icon>
          <span>{row.id}</span>
        </div>
        <div className="map-product-course">{row.course}</div>
      </div>
      <span className="map-cell-courses">1</span>
      <span className="map-cell-created">{row.created}</span>
      <button type="button" className="map-row-expand" onClick={onToggle}>
        <iconify-icon icon="lucide:chevron-down" class={"map-row-chev" + (expanded ? " is-open" : "")}></iconify-icon>
      </button>
    </div>
  );
}

/* --------------------------------------------------------------- root */
function MapRootView() {
  const [tab, setTab] = useStateMAP("ghl");
  const [query, setQuery] = useStateMAP("");
  const [sortField, setSortField] = useStateMAP("id");
  const [sortDir, setSortDir] = useStateMAP("asc");
  const [expanded, setExpanded] = useStateMAP({});

  const toggleRow = (id) => setExpanded((st) => ({ ...st, [id]: !st[id] }));
  const toggleSortDir = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  const filteredSorted = useMemoMAP(() => {
    const q = query.trim().toLowerCase();
    let rows = MAP_ROWS;
    if (q) {
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.course.toLowerCase().includes(q)
      );
    }
    const getter = MAP_SORT_FIELDS[sortField].get;
    rows = [...rows].sort((a, b) => {
      const av = getter(a), bv = getter(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [query, sortField, sortDir]);

  const courseLinkCount = MAP_ROWS.length * 1 + 425; // total course links across all mapped products (mock)

  return (
    <div className="map-shell">
      <MapSidebar />
      <main className="map-main">
        <MapHeader title="Product Mapping" />
        <div className="map-content">
          <div className="map-page-head">
            <div>
              <h1>Product Mapping</h1>
              <p>Map GHL and WooCommerce products to courses so webhook automation can enrol members automatically.</p>
            </div>
            <button className="map-btn map-btn-sq" type="button">
              <iconify-icon icon="lucide:refresh-cw"></iconify-icon>
            </button>
          </div>

          <div className="map-controls-row">
            <div className="map-search-input-wrap">
              <iconify-icon icon="lucide:search"></iconify-icon>
              <input
                placeholder="Search by product id, name, or mapped course..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="map-select-wrap map-sort-select-wrap">
              <select
                className="map-select map-sort-select"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                {Object.keys(MAP_SORT_FIELDS).map((key) => (
                  <option key={key} value={key}>Sort: {MAP_SORT_FIELDS[key].label}</option>
                ))}
              </select>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </div>
            <button type="button" className="map-sortdir-btn" onClick={toggleSortDir} title={sortDir === "asc" ? "Ascending" : "Descending"}>
              <iconify-icon icon={sortDir === "asc" ? "lucide:arrow-up" : "lucide:arrow-down"}></iconify-icon>
            </button>
          </div>

          <MapTabs tab={tab} setTab={setTab} />

          <div className="map-summary-row">
            <span className="map-summary-text">{MAP_ROWS.length} product(s), {courseLinkCount} course link(s)</span>
            <div className="map-summary-actions">
              <button className="map-btn map-btn-outline" type="button">
                <iconify-icon icon="lucide:award"></iconify-icon>Add premium / trial
              </button>
              <button className="map-btn map-btn-navy" type="button">
                <iconify-icon icon="lucide:plus"></iconify-icon>Map GHL product
              </button>
            </div>
          </div>

          <div className="map-table">
            <div className="map-row-grid map-thead">
              <span className="map-th">PRODUCT</span>
              <span className="map-th">COURSES</span>
              <span className="map-th">CREATED</span>
              <span />
            </div>

            {filteredSorted.map((row) => (
              <MapRow key={row.id} row={row} expanded={!!expanded[row.id]} onToggle={() => toggleRow(row.id)} />
            ))}

            {filteredSorted.length === 0 && (
              <div className="map-empty">
                <iconify-icon icon="lucide:search-x"></iconify-icon>
                <span>No products match "{query}".</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MapRootView />);
