/* ===========================================================================
   PROfinity — Admin · User Management (desktop console)
   Clinicians / Patients / Admin segmented list with a static mock data table.
   Classes prefixed usr- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateUSR, useMemo: useMemoUSR } = React;

function goUSR(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- mock data */
const RAW_USERS = [
  { email: "gemmaarchbold38@hotmail.com" },
  { email: "drmonikaomfs@gmail.com" },
  { email: "tommi.marquardt@gmail.com" },
  { email: "lutchman.nereshni@gmail.com" },
  { email: "thepowderroomkent@gmail.com" },
  { email: "aesthetics.by.jo@gmail.com" },
  { email: "dr.sarah.chen@outlook.com" },
];
const userRows = RAW_USERS.map((u) => ({ ...u, emailShort: u.email.length > 22 ? u.email.slice(0, 20) + "…" : u.email }));

const USR_SEGMENTS = [
  { key: "clinicians", label: "Clinicians", icon: "lucide:briefcase-medical", count: "23907" },
  { key: "patients", label: "Patients", icon: "lucide:user", count: "50" },
  { key: "admin", label: "Admin", icon: "lucide:shield-check", count: "19" },
];

/* ------------------------------------------------------------- sidebar */
const USR_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users", active: true },
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
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const USR_NAV_LINKS = {
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

function USRSidebar() {
  return (
    <aside className="usr-sidebar">
      <div className="usr-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {USR_NAV.map((item) => {
        const href = USR_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"usr-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goUSR(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="usr-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="usr-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function USRHeader({ title }) {
  return (
    <header className="usr-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="usr-header-title">{title}</span>
      <div className="usr-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="usr-spacer" />
      <div className="usr-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="usr-bell-badge">4</span>
      </div>
      <div className="usr-user">
        <div className="usr-user-name">Dr Tim Pearce</div>
        <div className="usr-user-role">Admin</div>
      </div>
      <img className="usr-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* --------------------------------------------------------------- toggle */
function USRToggle({ on }) {
  return (
    <button type="button" className={"usr-toggle" + (on ? " is-on" : "")} tabIndex={-1}>
      <span className="usr-toggle-knob" />
    </button>
  );
}

/* ---------------------------------------------------------------- table */
function USRTable({ rows }) {
  const [copiedIdx, setCopiedIdx] = useStateUSR(null);

  const copyEmail = (email, idx) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx((cur) => (cur === idx ? null : cur)), 1200);
  };

  return (
    <div className="usr-table">
      <div className="usr-row-grid usr-thead">
        <span className="usr-th">Name</span>
        <span className="usr-th">Email</span>
        <span className="usr-th">Type</span>
        <span className="usr-th">Method</span>
        <span className="usr-th">Verified</span>
        <span className="usr-th">Active</span>
        <span className="usr-th">Premium</span>
        <span className="usr-th">Directory</span>
        <span className="usr-th usr-th-sort">Joined<iconify-icon icon="lucide:arrow-down"></iconify-icon></span>
        <span />
      </div>

      {rows.map((u, idx) => (
        <div key={u.email} className="usr-row-grid usr-trow">
          <div className="usr-name-cell" title={u.email}>{u.email}</div>

          <div className="usr-email-cell">
            <span className="usr-email-text" title={u.email}>{u.emailShort}</span>
            <button type="button" className="usr-copy-btn" onClick={() => copyEmail(u.email, idx)} title="Copy email">
              <iconify-icon icon={copiedIdx === idx ? "lucide:check" : "lucide:copy"}></iconify-icon>
            </button>
          </div>

          <span className="usr-type-pill">clinician</span>

          <span className="usr-method-cell"><iconify-icon icon="lucide:mail"></iconify-icon>free_claim</span>

          <span className="usr-verified-pill">Verified</span>

          <span className="usr-toggle-cell"><USRToggle on={false} /></span>
          <span className="usr-toggle-cell"><USRToggle on={false} /></span>

          <span className="usr-directory-cell">23/07/2026</span>
          <span className="usr-joined-cell">23/07/2026</span>

          <button type="button" className="usr-row-more"><iconify-icon icon="lucide:more-vertical"></iconify-icon></button>
        </div>
      ))}

      <div className="usr-pagination">
        <div className="usr-pageinfo">Showing 1 to 10 of 23907 entries</div>
        <div className="usr-pagebtns">
          <div className="usr-pageinfo">
            <span>Rows per page</span>
            <div className="usr-pp-select-wrap">
              <select className="usr-pp-select" defaultValue="10">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </div>
          </div>
          <div className="usr-pagebtn-group">
            <button className="usr-pagebtn" type="button"><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>
            <span className="usr-pageindicator">1 / 2391</span>
            <button className="usr-pagebtn" type="button"><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- view */
function USRUsersView() {
  const [segment, setSegment] = useStateUSR("clinicians");
  const [search, setSearch] = useStateUSR("");
  const [refreshKey, setRefreshKey] = useStateUSR(0);

  const filteredRows = useMemoUSR(() => {
    const q = search.trim().toLowerCase();
    if (!q) return userRows;
    return userRows.filter((u) => u.email.toLowerCase().includes(q));
  }, [search, refreshKey]);

  return (
    <div className="usr-view">
      <div className="usr-page-head">
        <h1>User Management</h1>
        <div className="usr-page-head-actions">
          <button className="usr-btn usr-btn-navy" type="button"><iconify-icon icon="lucide:plus"></iconify-icon>Add New User</button>
          <button className="usr-btn usr-btn-ghost" type="button"><iconify-icon icon="lucide:download"></iconify-icon>Export CSV</button>
          <button className="usr-btn usr-btn-navy" type="button" onClick={() => setRefreshKey((k) => k + 1)}><iconify-icon icon="lucide:refresh-cw"></iconify-icon>Refresh</button>
        </div>
      </div>

      <div className="usr-search-input-wrap">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Search users by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="usr-info-banner">
        <iconify-icon icon="lucide:info"></iconify-icon>
        <span>Showing 10 of 23907 clinicians</span>
      </div>

      <div className="usr-segmented">
        {USR_SEGMENTS.map((s) => (
          <button
            key={s.key}
            type="button"
            className={"usr-seg-btn" + (segment === s.key ? " is-active" : "")}
            onClick={() => setSegment(s.key)}
          >
            <iconify-icon icon={s.icon}></iconify-icon>
            <span>{s.label}</span>
            <span className="usr-seg-count">{s.count}</span>
          </button>
        ))}
      </div>

      <USRTable rows={filteredRows} />
    </div>
  );
}

function USRApp() {
  return (
    <div className="usr-shell">
      <USRSidebar />
      <main className="usr-main">
        <USRHeader title="User Management" />
        <div className="usr-content">
          <USRUsersView />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<USRApp />);
