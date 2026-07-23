/* ===========================================================================
   PROfinity — Admin · Community (All Channels)
   Channel management list: search/filter/export/add, channel table with
   type/status pills, pagination footer.
   Suffixed -COM to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateCOM } = React;

function goCOM(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const COM_NAV = [
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
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true, active: true },
];

const COM_NAV_LINKS = {
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

function COMSidebar() {
  return (
    <aside className="com-sidebar">
      <div className="com-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {COM_NAV.map((item) => {
        const href = COM_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"com-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goCOM(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="com-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="com-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function COMHeader({ title }) {
  return (
    <header className="com-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="com-header-title">{title}</span>
      <div className="com-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="com-spacer" />
      <div className="com-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="com-bell-badge">4</span>
      </div>
      <div className="com-user">
        <div className="com-user-name">Dr Tim Pearce</div>
        <div className="com-user-role">Admin</div>
      </div>
      <img className="com-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ---------------------------------------------------------------- data */
const COM_CHANNEL_ROWS = [
  { n: "1", icon: "🚨", title: "Complications Help!", creator: "Sarah Adefehinti", private: true, plan: true, members: "6", created: "3/7/2026" },
  { n: "2", icon: "🏆", title: "Confidence Chat", creator: "Debby Admin", private: true, plan: true, members: "1261", created: "30/6/2026" },
  { n: "3", icon: "🎗️", title: "Freedom Chat", creator: "Debby Admin", private: true, plan: true, members: "25", created: "5/6/2026" },
  { n: "4", icon: "🎖️", title: "Mastery Chat", creator: "Debby Admin", private: true, plan: true, members: "21", created: "5/6/2026" },
  { n: "5", icon: "👥", title: "Profinity Clinic Grow…", creator: "Debby Admin", private: true, plan: false, members: "133", created: "3/6/2026" },
  { n: "6", icon: "🏆", title: "Skinfluencers", creator: "Sarah Adefehinti", private: true, plan: true, members: "16", created: "11/5/2026" },
  { n: "7", icon: "💡", title: "Tech Team", creator: "Debby Admin", private: true, plan: false, members: "12", created: "9/5/2026" },
];

/* ---------------------------------------------------------------- list */
function COMChannelTable({ rows }) {
  return (
    <div className="com-table">
      <div className="com-row-grid com-thead">
        <span className="com-th">#</span>
        <span className="com-th">CHANNEL TITLE</span>
        <span className="com-th">CREATOR</span>
        <span className="com-th">TYPE</span>
        <span className="com-th">STATUS</span>
        <span className="com-th">MEMBERS</span>
        <span className="com-th">CREATED</span>
        <span />
      </div>

      {rows.map((c) => (
        <div key={c.n} className="com-row-grid com-trow">
          <span className="com-cell-n">{c.n}</span>
          <div className="com-trow-title">
            <span className="com-trow-icon">{c.icon}</span>
            <span className="com-trow-title-main">{c.title}</span>
          </div>
          <span className="com-audience-cell">{c.creator}</span>
          <div className="com-type-cell">
            {c.private && (
              <span className="com-pill com-pill-purple">Private</span>
            )}
            {c.plan && (
              <span className="com-pill com-pill-warning">Membership Plan</span>
            )}
          </div>
          <div className="com-status-pill">
            <span className="com-status-dot" />
            <span className="com-status-label">Active</span>
          </div>
          <span className="com-metric">{c.members}</span>
          <span className="com-audience-cell">{c.created}</span>
          <iconify-icon icon="lucide:more-vertical" class="com-row-more"></iconify-icon>
        </div>
      ))}
    </div>
  );
}

function COMView() {
  const [perPage, setPerPage] = useStateCOM("10");
  const rows = COM_CHANNEL_ROWS;

  return (
    <div className="com-view">
      <div className="com-page-head">
        <div>
          <h1>Channel Management</h1>
        </div>
      </div>

      <div className="com-filters">
        <div className="com-search-input-wrap">
          <iconify-icon icon="lucide:search"></iconify-icon>
          <input placeholder="Search channels..." />
        </div>
        <button className="com-btn com-btn-ghost" type="button"><iconify-icon icon="lucide:sliders-horizontal"></iconify-icon>Filter</button>
        <button className="com-btn com-btn-ghost" type="button"><iconify-icon icon="lucide:download"></iconify-icon>Export</button>
        <button className="com-btn com-btn-navy" type="button"><iconify-icon icon="lucide:plus"></iconify-icon>Add New</button>
      </div>

      <COMChannelTable rows={rows} />

      <div className="com-pagination">
        <div className="com-pagebtn-group">
          <button className="com-pagebtn" disabled type="button"><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>
          <button className="com-pagebtn is-active" type="button">1</button>
          <button className="com-pagebtn" type="button"><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
        </div>
        <span className="com-showing">Showing 1–7 of 7</span>
        <div className="com-pageinfo">
          <span>Rows per page:</span>
          <div className="com-pp-select-wrap">
            <select className="com-pp-select" value={perPage} onChange={(e) => setPerPage(e.target.value)}>
              <option>10</option><option>25</option><option>50</option>
            </select>
            <iconify-icon icon="lucide:chevron-down"></iconify-icon>
          </div>
        </div>
      </div>
    </div>
  );
}

function COMRoot() {
  return (
    <div className="com-shell">
      <COMSidebar />
      <main className="com-main">
        <COMHeader title="Community" />
        <div className="com-content">
          <COMView />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<COMRoot />);
