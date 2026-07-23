/* ===========================================================================
   PROfinity — Admin · Dashboard (desktop console)
   Landing overview: stat grid, recent activity feed, quick actions.
   Suffixed -dash to avoid global-scope clashes.
   =========================================================================== */

function goDash(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const DASH_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard", active: true },
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
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const DASH_NAV_LINKS = {
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

function DashSidebar() {
  return (
    <aside className="dash-sidebar">
      <div className="dash-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {DASH_NAV.map((item) => {
        const href = DASH_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"dash-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goDash(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="dash-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="dash-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function DashHeader({ title }) {
  return (
    <header className="dash-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="dash-header-title">{title}</span>
      <div className="dash-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="dash-spacer" />
      <div className="dash-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="dash-bell-badge">4</span>
      </div>
      <div className="dash-user">
        <div className="dash-user-name">Dr Tim Pearce</div>
        <div className="dash-user-role">Admin</div>
      </div>
      <img className="dash-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ---------------------------------------------------------------- data */
const DASH_STATS = [
  { label: "Total Users", value: "0", icon: "lucide:users", color: "var(--info)", bg: "var(--info-bg)" },
  { label: "Active Subscriptions", value: "0", icon: "lucide:star", color: "var(--warning)", bg: "var(--warning-bg)" },
  { label: "Patient Profiles", value: "0", icon: "lucide:contact", color: "var(--success)", bg: "var(--success-bg)" },
  { label: "Total Clinicians", value: "0", icon: "lucide:briefcase-medical", color: "var(--success)", bg: "var(--success-bg)" },
  { label: "Total Posts", value: "338", icon: "lucide:file-text", color: "var(--ai-purple)", bg: "var(--ai-purple-100)" },
  { label: "Flagged Posts", value: "0", icon: "lucide:flag", color: "var(--error)", bg: "var(--error-bg)" },
  { label: "Flagged Comments", value: "0", icon: "lucide:message-square", color: "var(--warning)", bg: "var(--warning-bg)" },
];

const DASH_QUICK_ACTIONS = [
  { label: "Moderate Content", icon: "lucide:shield", href: "AdminModeration.html" },
  { label: "Manage Users", icon: "lucide:users", href: "AdminUsers.html" },
  { label: "View Invoices", icon: "lucide:receipt-text", href: "AdminTransactions.html" },
];

/* ---------------------------------------------------------------- view */
function DashStatCard({ stat }) {
  return (
    <div className="dash-stat-card">
      <span className="dash-stat-icon" style={{ background: stat.bg, color: stat.color }}>
        <iconify-icon icon={stat.icon}></iconify-icon>
      </span>
      <div className="dash-stat-body">
        <div className="dash-stat-label">{stat.label}</div>
        <div className="dash-stat-value">{stat.value}</div>
      </div>
    </div>
  );
}

function DashView() {
  return (
    <div className="dash-view">
      <div className="dash-page-head">
        <h1>Admin Dashboard</h1>
        <button className="dash-btn dash-btn-navy" type="button">
          <iconify-icon icon="lucide:refresh-cw"></iconify-icon>Refresh
        </button>
      </div>

      <div className="dash-stat-grid">
        {DASH_STATS.map((stat) => (
          <DashStatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="dash-bottom-grid">
        <div className="dash-card">
          <div className="dash-card-head">
            <span className="dash-card-title-text">Recent Activity</span>
            <button className="dash-icon-btn" type="button" aria-label="Refresh recent activity">
              <iconify-icon icon="lucide:refresh-cw"></iconify-icon>
            </button>
          </div>
          <div className="dash-empty">
            <span className="dash-empty-icon">
              <iconify-icon icon="lucide:inbox"></iconify-icon>
            </span>
            <p>No recent activity yet</p>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <span className="dash-card-title-text">Quick Actions</span>
          </div>
          <div className="dash-quick-actions">
            {DASH_QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="dash-quick-btn"
                type="button"
                onClick={() => goDash(action.href)}
              >
                <iconify-icon icon={action.icon}></iconify-icon>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashRoot() {
  return (
    <div className="dash-shell">
      <DashSidebar />
      <div className="dash-main">
        <DashHeader title="Admin Dashboard" />
        <DashView />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<DashRoot />);
