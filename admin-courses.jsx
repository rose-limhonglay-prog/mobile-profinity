/* ===========================================================================
   PROfinity — Admin · Courses (All Courses list)
   Shares the sidebar/header shell pattern with admin-push-notifications.jsx
   and admin-posts-management.jsx. Suffixed -CRS to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateCRS } = React;

function goCrs(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const CRS_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events" },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true, active: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const CRS_NAV_LINKS = {
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

function CrsSidebar() {
  return (
    <aside className="crs-sidebar">
      <div className="crs-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {CRS_NAV.map((item) => {
        const href = CRS_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"crs-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goCrs(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="crs-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="crs-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function CrsHeader({ title }) {
  return (
    <header className="crs-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="crs-header-title">{title}</span>
      <div className="crs-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="crs-spacer" />
      <div className="crs-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="crs-bell-badge">4</span>
      </div>
      <div className="crs-user">
        <div className="crs-user-name">Dr Tim Pearce</div>
        <div className="crs-user-role">Admin</div>
      </div>
      <img className="crs-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ----------------------------------------------------------------- data */
const CRS_ROWS = [
  { id: 1, sku: "000", title: "Needle or Cannula Trade Off …", subtitle: "Choosing your instru…", cat: "Botox", level: "Intermediate", full: "€ 57", plan: "-" },
  { id: 2, sku: "1234689", title: "HTML Testing", subtitle: "HTML Testing", cat: "Fillers", level: "Beginner", full: "€ 999", plan: "-" },
  { id: 3, sku: "000", title: "The Dream Clinic Playbook", subtitle: "8 Laws for Building a …", cat: "Business", level: "Beginner", full: "-", plan: "-" },
  { id: 4, sku: "000", title: "Technique Tuesday Case Stu…", subtitle: "Full-face correction a…", cat: "Consultation", level: "Beginner", full: "€ 0", plan: "-" },
  { id: 5, sku: "020", title: "Dermal Filler Complications …", subtitle: "", cat: "Aesthetics", level: "Intermediate", full: "€ 1000", plan: "€ 267" },
  { id: 6, sku: "020", title: "Botulinum Toxin Complicatio…", subtitle: "", cat: "Aesthetics", level: "Intermediate", full: "€ 697", plan: "€ 267" },
  { id: 7, sku: "021", title: "Dermal Fillers Foundation Co…", subtitle: "", cat: "Aesthetics", level: "Intermediate", full: "€ 249", plan: "-" },
];

/* --------------------------------------------------------------- checkbox */
function CrsCheck({ on, onClick }) {
  return (
    <button type="button" className={"crs-check" + (on ? " is-on" : "")} onClick={onClick}>
      {on && <iconify-icon icon="lucide:check"></iconify-icon>}
    </button>
  );
}

/* ---------------------------------------------------------------- table */
function CrsRow({ row, checked, onToggle }) {
  return (
    <div className="crs-row-grid crs-trow" style={{ background: checked ? "var(--brand-gold-100)" : "var(--white)" }}>
      <CrsCheck on={checked} onClick={onToggle} />
      <span className="crs-sku-cell">{row.sku}</span>
      <div className="crs-trow-title">{row.title}</div>
      <span className="crs-subtitle-cell">{row.subtitle || "—"}</span>
      <span className="crs-cat-pill">{row.cat}</span>
      <span className="crs-level-cell">{row.level}</span>
      <span className="crs-price-cell" style={{ color: row.full === "-" ? "var(--gray-400)" : "var(--gray-800)" }}>{row.full}</span>
      <span className="crs-price-cell" style={{ color: row.plan === "-" ? "var(--gray-400)" : "var(--gray-800)" }}>{row.plan}</span>
      <div className="crs-status-cell">
        <span className="crs-toggle is-on"><span className="crs-toggle-knob" /></span>
        <span className="crs-status-label">Active</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- view */
function CrsView() {
  const [selected, setSelected] = useStateCRS({});
  const count = Object.values(selected).filter(Boolean).length;
  const allChecked = CRS_ROWS.length > 0 && count === CRS_ROWS.length;

  const toggleAll = () => {
    if (allChecked) { setSelected({}); return; }
    const sel = {};
    CRS_ROWS.forEach((r) => (sel[r.id] = true));
    setSelected(sel);
  };
  const toggleOne = (id) => setSelected((st) => {
    const sel = { ...st };
    if (sel[id]) delete sel[id]; else sel[id] = true;
    return sel;
  });

  return (
    <div className="crs-view">
      <div className="crs-utilitybar">
        <span className="crs-utility-label">
          <iconify-icon icon="lucide:book-open"></iconify-icon>
          Courses
        </span>
        <div className="crs-utility-search">
          <iconify-icon icon="lucide:search"></iconify-icon>
          <input placeholder="Search courses..." />
        </div>
        <button className="crs-refresh-btn" type="button" aria-label="Refresh">
          <iconify-icon icon="lucide:refresh-cw"></iconify-icon>
        </button>
      </div>

      <div className="crs-page-head">
        <h2>Courses</h2>
        <button className="crs-btn crs-btn-navy" type="button"><iconify-icon icon="lucide:plus"></iconify-icon>New Course</button>
      </div>

      <div className="crs-card">
        <div className="crs-card-head">
          <span className="crs-card-title">Course List</span>
          <div className="crs-card-actions">
            <button className="crs-text-btn" type="button">Filter</button>
            <button className="crs-text-btn" type="button">Export</button>
          </div>
        </div>

        <div className="crs-table">
          <div className="crs-row-grid crs-thead">
            <CrsCheck on={allChecked} onClick={toggleAll} />
            <span className="crs-th">SKU ID</span>
            <span className="crs-th">TITLE OF THE COURSE</span>
            <span className="crs-th">SUBTITLE</span>
            <span className="crs-th">CATEGORY</span>
            <span className="crs-th">LEVEL</span>
            <span className="crs-th">FULL PAYMENT</span>
            <span className="crs-th">PLAN PRICE</span>
            <span className="crs-th">STATUS</span>
          </div>

          {CRS_ROWS.map((row) => (
            <CrsRow key={row.id} row={row} checked={!!selected[row.id]} onToggle={() => toggleOne(row.id)} />
          ))}

          <div className="crs-pagination">
            <span className="crs-pageinfo">Page 1 of 10</span>
            <div className="crs-pagelinks">
              <a href="#" className="crs-page-prev" onClick={(e) => e.preventDefault()}>Previous</a>
              <a href="#" className="crs-page-next" onClick={(e) => e.preventDefault()}>Next</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ root */
function AdminCoursesApp() {
  return (
    <div className="crs-shell">
      <CrsSidebar />
      <main className="crs-main">
        <CrsHeader title="Courses" />
        <div className="crs-content">
          <CrsView />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AdminCoursesApp />);
