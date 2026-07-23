/* ===========================================================================
   PROfinity — Admin · Content Moderation (desktop console)
   Reported-content queue. Presently an empty-queue state: search + status/type
   filters, a warning summary banner, and a large centered empty state — no
   table (nothing has been reported yet). Shares the sidebar/header shell
   pattern with admin-push-notifications.jsx / admin-posts-management.jsx.
   Suffixed -MOD to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateMOD } = React;

function goMOD(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const MOD_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation", active: true },
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

const MOD_NAV_LINKS = {
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

function MODSidebar() {
  return (
    <aside className="mod-sidebar">
      <div className="mod-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {MOD_NAV.map((item) => {
        const href = MOD_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"mod-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goMOD(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="mod-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="mod-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function MODHeader() {
  return (
    <header className="mod-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="mod-header-title">Content Moderation</span>
      <div className="mod-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="mod-spacer" />
      <div className="mod-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="mod-bell-badge">4</span>
      </div>
      <div className="mod-user">
        <div className="mod-user-name">Dr Tim Pearce</div>
        <div className="mod-user-role">Admin</div>
      </div>
      <img className="mod-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ------------------------------------------------------------------- app */
function ModerationApp() {
  const [query, setQuery] = useStateMOD("");
  const [statusFilter, setStatusFilter] = useStateMOD("all");
  const [typeFilter, setTypeFilter] = useStateMOD("all");
  const [spinning, setSpinning] = useStateMOD(false);

  const handleRefresh = () => {
    setQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSpinning(true);
    setTimeout(() => setSpinning(false), 600);
  };

  return (
    <div className="mod-shell">
      <MODSidebar />
      <main className="mod-main">
        <MODHeader />
        <div className="mod-view">
          <div className="mod-page-head">
            <h1>Content Moderation</h1>
            <div className="mod-page-head-actions">
              <button className="mod-btn mod-btn-outline" type="button" onClick={handleRefresh}>
                <iconify-icon icon="lucide:refresh-cw" style={spinning ? { animation: "modSpin .6s linear" } : undefined}></iconify-icon>
                Refresh
              </button>
            </div>
          </div>

          <div className="mod-filters">
            <div className="mod-search-input-wrap">
              <iconify-icon icon="lucide:search"></iconify-icon>
              <input
                placeholder="Search by content, reason, or type..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="mod-filter-select">
              <span className="mod-filter-select-label">Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
              </select>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </div>
            <div className="mod-filter-select">
              <span className="mod-filter-select-label">Type</span>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                <option value="Post">Post</option>
                <option value="Comment">Comment</option>
                <option value="Profile">Profile</option>
              </select>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </div>
          </div>

          <div className="mod-warning-banner">
            <iconify-icon icon="lucide:alert-circle"></iconify-icon>
            <span>Showing <strong>0</strong> of <strong>0</strong> reported items</span>
          </div>

          <div className="mod-empty">
            <iconify-icon icon="lucide:shield-check" class="mod-empty-icon"></iconify-icon>
            <div className="mod-empty-title">No reported content found</div>
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ModerationApp />);
