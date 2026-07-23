/* ===========================================================================
   PROfinity — Admin · Events
   List view: Events / Webinars sub-nav toggle, search + create controls,
   events data table (date, time, location, invite/open metrics, status).
   Classes prefixed evt- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateEVT } = React;

function goEVT(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- nav data */
const EVT_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events", active: true },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const EVT_NAV_LINKS = {
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

/* ------------------------------------------------------------- sidebar */
function EVTSidebar() {
  return (
    <aside className="evt-sidebar">
      <div className="evt-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {EVT_NAV.map((item) => {
        const href = EVT_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"evt-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goEVT(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="evt-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="evt-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function EVTHeader({ title }) {
  return (
    <header className="evt-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="evt-header-title">{title}</span>
      <div className="evt-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="evt-spacer" />
      <div className="evt-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="evt-bell-badge">4</span>
      </div>
      <div className="evt-user">
        <div className="evt-user-name">Dr Tim Pearce</div>
        <div className="evt-user-role">Admin</div>
      </div>
      <img className="evt-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* --------------------------------------------------------------- data */
const EVT_ROWS = [
  { name: "Profinity Clinic Growth Summit", date: "June 4-5, 2026", time: "9:30 AM - 5:30 PM", location: "Acquario Romano, Rome, Italy", users: "133", invited: "41", opened: "87" },
  { name: "VIP Training: How To Build a THRIVING Clinic That Serve…", date: "18th June 2026", time: "8pm UK 3pm ET", location: "https://us02web.zoom.us/j/…", users: "0", invited: "0", opened: "0" },
];

/* ---------------------------------------------------------------- view */
function EVTListView() {
  const [subTab, setSubTab] = useStateEVT("events");
  const [query, setQuery] = useStateEVT("");

  const rows = EVT_ROWS.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="evt-page-head">
        <div>
          <h1>Events</h1>
          <p>Manage conferences, in-person events, and webinars from one place.</p>
        </div>
      </div>

      <div className="evt-subnav">
        <button
          type="button"
          className={"evt-subnav-btn" + (subTab === "events" ? " is-active" : "")}
          onClick={() => setSubTab("events")}
        >
          <iconify-icon icon="lucide:calendar"></iconify-icon>Events
        </button>
        <button
          type="button"
          className={"evt-subnav-btn" + (subTab === "webinars" ? " is-active" : "")}
          onClick={() => setSubTab("webinars")}
        >
          <iconify-icon icon="lucide:video"></iconify-icon>Webinars
        </button>
      </div>

      <div className="evt-controls">
        <div className="evt-search-input-wrap">
          <iconify-icon icon="lucide:search"></iconify-icon>
          <input placeholder="Search title, location, slug..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="evt-btn evt-btn-navy" type="button">
          <iconify-icon icon="lucide:plus"></iconify-icon>Create Event
        </button>
      </div>

      <div className="evt-table">
        <div className="evt-row-grid evt-thead">
          <span className="evt-th">EVENT</span>
          <span className="evt-th">DATE</span>
          <span className="evt-th">TIME</span>
          <span className="evt-th">LOCATION</span>
          <span className="evt-th">USERS</span>
          <span className="evt-th">INVITED</span>
          <span className="evt-th">OPENED</span>
          <span className="evt-th">STATUS</span>
          <span />
        </div>

        {rows.map((r, i) => (
          <div key={i} className="evt-row-grid evt-trow">
            <div className="evt-trow-title">
              <div className="evt-trow-title-main">{r.name}</div>
            </div>
            <span className="evt-cell">{r.date}</span>
            <span className="evt-cell">{r.time}</span>
            <span className="evt-cell evt-cell-location">{r.location}</span>
            <span className="evt-metric">{r.users}</span>
            <span className="evt-metric">{r.invited}</span>
            <span className="evt-metric">{r.opened}</span>
            <div className="evt-status-pill">
              <span className="evt-status-dot" />
              <span className="evt-status-label">Inactive</span>
            </div>
            <iconify-icon icon="lucide:more-vertical" class="evt-row-more"></iconify-icon>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="evt-empty">
            <iconify-icon icon="lucide:calendar-x"></iconify-icon>
            <span>No events match your search.</span>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------- root */
function EVTRoot() {
  return (
    <div className="evt-shell">
      <EVTSidebar />
      <main className="evt-main">
        <EVTHeader title="Events" />
        <div className="evt-content">
          <EVTListView />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<EVTRoot />);
