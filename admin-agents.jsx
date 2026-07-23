/* ===========================================================================
   PROfinity — Admin · Agents (Agent Interest Tracker)
   Tracks "Notify me" votes from users on locked agents. Currently an empty
   queue — no votes have been recorded yet, so the list renders a header row
   plus an empty state.
   Suffixed -AGT to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateAGT } = React;

function goAGT(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const AGT_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents", active: true },
  { icon: "lucide:calendar", label: "Events" },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const AGT_NAV_LINKS = {
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

function AGTSidebar() {
  return (
    <aside className="agt-sidebar">
      <div className="agt-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {AGT_NAV.map((item) => {
        const href = AGT_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"agt-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goAGT(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="agt-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="agt-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function AGTHeader({ title }) {
  return (
    <header className="agt-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="agt-header-title">{title}</span>
      <div className="agt-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="agt-spacer" />
      <div className="agt-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="agt-bell-badge">4</span>
      </div>
      <div className="agt-user">
        <div className="agt-user-name">Dr Tim Pearce</div>
        <div className="agt-user-role">Admin</div>
      </div>
      <img className="agt-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* --------------------------------------------------------------- view */
function AGTInterestTracker() {
  const [refreshing, setRefreshing] = useStateAGT(false);
  const [lastRefreshed, setLastRefreshed] = useStateAGT(null);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed(new Date());
    }, 900);
  };

  return (
    <div className="agt-view">
      <div className="agt-page-head">
        <div>
          <h1>Agent Interest Tracker</h1>
          <p>Tracks &quot;Notify me&quot; votes from users on locked agents.</p>
        </div>
        <div className="agt-page-head-actions">
          <button
            className={"agt-btn agt-btn-outline-navy" + (refreshing ? " is-refreshing" : "")}
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <iconify-icon icon="lucide:refresh-cw" class="agt-refresh-icon"></iconify-icon>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {lastRefreshed && (
        <div className="agt-refreshed-note">
          <iconify-icon icon="lucide:check"></iconify-icon>
          Last refreshed at {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      )}

      <div className="agt-table">
        <div className="agt-row-grid agt-thead">
          <span className="agt-th">AGENT</span>
          <span className="agt-th">TOTAL VOTES</span>
          <span className="agt-th">LAST ACTIVITY</span>
        </div>

        <div className="agt-empty">
          <span className="agt-empty-icon">
            <iconify-icon icon="lucide:bell-off"></iconify-icon>
          </span>
          <p className="agt-empty-text">No interest votes recorded yet.</p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- root */
function AGTRoot() {
  return (
    <div className="agt-shell">
      <AGTSidebar />
      <main className="agt-main">
        <AGTHeader title="Agents" />
        <div className="agt-content">
          <AGTInterestTracker />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AGTRoot />);
