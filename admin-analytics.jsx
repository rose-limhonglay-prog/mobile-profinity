/* ===========================================================================
   PROfinity — Admin · Analytics (desktop console)
   Subscription user counts and recurring revenue summary table.
   Classes prefixed ana- to avoid clashes with other pages.
   =========================================================================== */

function goAna(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const ANA_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events" },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics", active: true },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const ANA_NAV_LINKS = {
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

function ANASidebar() {
  return (
    <aside className="ana-sidebar">
      <div className="ana-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {ANA_NAV.map((item) => {
        const href = ANA_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"ana-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goAna(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="ana-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="ana-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function ANAHeader({ title }) {
  return (
    <header className="ana-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="ana-header-title">{title}</span>
      <div className="ana-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="ana-spacer" />
      <div className="ana-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="ana-bell-badge">4</span>
      </div>
      <div className="ana-user">
        <div className="ana-user-name">Dr Tim Pearce</div>
        <div className="ana-user-role">Admin</div>
      </div>
      <img className="ana-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ------------------------------------------------------------- data */
const analyticsRows = [
  { metric: "Total Users", count: "23958", revenue: "£38,915.00", bold: true },
  { metric: "Basic Users (No Trial, No Subscription)", count: "23561", revenue: "£0.00", bold: false },
  { metric: "Trial Users (On Trial With CC, No Payment Started)", count: "2", revenue: "£0.00", bold: false },
  { metric: "Paying £97/mo User (Confidence)", count: "393", revenue: "£38,121.00", bold: true },
  { metric: "Paying £397/mo User (Mastery)", count: "2", revenue: "£794.00", bold: true },
];

function anaFormatCount(n) {
  const num = Number(n);
  return isNaN(num) ? n : num.toLocaleString();
}

/* ------------------------------------------------------------- table */
function ANATable({ rows }) {
  return (
    <div className="ana-table">
      <div className="ana-row-grid ana-thead">
        <span className="ana-th">METRIC</span>
        <span className="ana-th ana-th-right">COUNT</span>
        <span className="ana-th ana-th-right">RECURRING REVENUE</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className={"ana-row-grid ana-trow" + (r.bold ? " is-bold" : "")}>
          <span className="ana-metric-cell">{r.metric}</span>
          <span className="ana-count-cell">{anaFormatCount(r.count)}</span>
          <span className="ana-revenue-cell">{r.revenue}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- view */
function ANAView() {
  return (
    <div className="ana-view">
      <div className="ana-page-head">
        <div>
          <h1>Analytics</h1>
          <p>Subscription user counts and recurring revenue</p>
        </div>
        <div className="ana-page-head-actions">
          <button className="ana-btn ana-btn-ghost" type="button">
            <iconify-icon icon="lucide:calendar"></iconify-icon>Select date range
          </button>
          <button className="ana-btn ana-btn-navy-outline" type="button">
            <iconify-icon icon="lucide:refresh-cw"></iconify-icon>Refresh
          </button>
        </div>
      </div>

      <ANATable rows={analyticsRows} />
    </div>
  );
}

/* ------------------------------------------------------------- root */
function ANAApp() {
  return (
    <div className="ana-shell">
      <ANASidebar />
      <div className="ana-main">
        <ANAHeader title="Analytics" />
        <ANAView />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ANAApp />);
