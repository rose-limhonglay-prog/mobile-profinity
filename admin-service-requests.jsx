/* ===========================================================================
   PROfinity — Admin · Service Requests (desktop console)
   Review of clinician-suggested services: filter pills (Pending / Approved /
   Rejected / All), refresh action, and an approve/reject review table.
   Suffixed -SVC to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateSVC, useMemo: useMemoSVC } = React;

function goSVC(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- mock data */
const SVC_FILTERS = ["Pending", "Approved", "Rejected", "All"];

const serviceRows = [
  { name: "Regenerative Injectables – Profhilo,…", by: "Alexandra Clark", submitted: "10 Jul 2026 09:06", status: "Pending" },
  { name: "Regerative Injections- Skin Booster…", by: "Alexandra Clark", submitted: "10 Jul 2026 09:00", status: "Pending" },
];

const SVC_STATUS_META = {
  Pending: { color: "var(--warning)", bg: "var(--warning-bg)" },
  Approved: { color: "var(--success)", bg: "var(--success-bg)" },
  Rejected: { color: "var(--error)", bg: "var(--error-bg)" },
};

/* ------------------------------------------------------------- sidebar */
const SVC_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests", active: true },
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

const SVC_NAV_LINKS = {
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

function SVCSidebar() {
  return (
    <aside className="svc-sidebar">
      <div className="svc-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {SVC_NAV.map((item) => {
        const href = SVC_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"svc-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goSVC(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="svc-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="svc-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function SVCHeader({ title }) {
  return (
    <header className="svc-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="svc-header-title">{title}</span>
      <div className="svc-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="svc-spacer" />
      <div className="svc-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="svc-bell-badge">4</span>
      </div>
      <div className="svc-user">
        <div className="svc-user-name">Dr Tim Pearce</div>
        <div className="svc-user-role">Admin</div>
      </div>
      <img className="svc-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* -------------------------------------------------------------- filters */
function SVCFilterTabs({ filter, setFilter, onRefresh, refreshing }) {
  return (
    <div className="svc-filterbar">
      {SVC_FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          className={"svc-filter-pill" + (filter === f ? " is-active" : "")}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
      <span className="svc-spacer" />
      <button type="button" className={"svc-refresh-btn" + (refreshing ? " is-spinning" : "")} onClick={onRefresh} aria-label="Refresh">
        <iconify-icon icon="lucide:refresh-cw"></iconify-icon>
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- table */
function SVCTable({ rows, onApprove, onReject }) {
  if (rows.length === 0) {
    return (
      <div className="svc-table">
        <div className="svc-row-grid svc-thead">
          <span className="svc-th">SERVICE NAME</span>
          <span className="svc-th">USER TYPE</span>
          <span className="svc-th">SUBMITTED BY</span>
          <span className="svc-th">SUBMITTED</span>
          <span className="svc-th">STATUS</span>
          <span className="svc-th">ACTION</span>
        </div>
        <div className="svc-empty">
          <iconify-icon icon="lucide:inbox"></iconify-icon>
          <div className="svc-empty-title">No service requests</div>
          <div className="svc-empty-sub">There's nothing in this filter right now.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="svc-table">
      <div className="svc-row-grid svc-thead">
        <span className="svc-th">SERVICE NAME</span>
        <span className="svc-th">USER TYPE</span>
        <span className="svc-th">SUBMITTED BY</span>
        <span className="svc-th">SUBMITTED</span>
        <span className="svc-th">STATUS</span>
        <span className="svc-th">ACTION</span>
      </div>
      {rows.map((r, i) => {
        const s = SVC_STATUS_META[r.status] || SVC_STATUS_META.Pending;
        return (
          <div key={i} className="svc-row-grid svc-trow">
            <div className="svc-trow-name">{r.name}</div>
            <span className="svc-cell">-</span>
            <span className="svc-cell">{r.by}</span>
            <span className="svc-cell">{r.submitted}</span>
            <div className="svc-status-pill" style={{ background: s.bg }}>
              <span className="svc-status-dot" style={{ background: s.color }} />
              <span className="svc-status-label" style={{ color: s.color }}>{r.status}</span>
            </div>
            <div className="svc-actions">
              <button type="button" className="svc-action svc-action-approve" onClick={() => onApprove(i)}>
                <iconify-icon icon="lucide:check"></iconify-icon>Approve
              </button>
              <button type="button" className="svc-action svc-action-reject" onClick={() => onReject(i)} aria-label="Reject">
                <iconify-icon icon="lucide:x"></iconify-icon>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- root */
function SVCApp() {
  const [filter, setFilter] = useStateSVC("Pending");
  const [refreshing, setRefreshing] = useStateSVC(false);

  const filteredRows = useMemoSVC(() => {
    if (filter === "All") return serviceRows;
    return serviceRows.filter((r) => r.status === filter);
  }, [filter]);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="svc-shell">
      <SVCSidebar />
      <main className="svc-main">
        <SVCHeader title="Service Requests" />
        <div className="svc-content">
          <div className="svc-view">
            <div className="svc-page-head">
              <div>
                <h1>Service Requests</h1>
                <p>Review services suggested by clinicians.</p>
              </div>
            </div>

            <SVCFilterTabs filter={filter} setFilter={setFilter} onRefresh={handleRefresh} refreshing={refreshing} />

            <SVCTable
              rows={filteredRows}
              onApprove={() => {}}
              onReject={() => {}}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<SVCApp />);
