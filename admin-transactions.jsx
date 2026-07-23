/* ===========================================================================
   PROfinity — Admin · Transactions (Invoices)
   Desktop admin console: fixed sidebar + sticky header + invoice list.
   Classes prefixed txn- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateTXN } = React;

function goTXN(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const TXN_NAV = [
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
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true, active: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const TXN_NAV_LINKS = {
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

function TXNSidebar() {
  return (
    <aside className="txn-sidebar">
      <div className="txn-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {TXN_NAV.map((item) => {
        const href = TXN_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"txn-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goTXN(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="txn-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="txn-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function TXNHeader({ title }) {
  return (
    <header className="txn-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="txn-header-title">{title}</span>
      <div className="txn-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="txn-spacer" />
      <div className="txn-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="txn-bell-badge">4</span>
      </div>
      <div className="txn-user">
        <div className="txn-user-name">Dr Tim Pearce</div>
        <div className="txn-user-role">Admin</div>
      </div>
      <img className="txn-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* --------------------------------------------------------------- checkbox */
function TXNCheck({ on, onClick }) {
  return (
    <button type="button" className={"txn-check" + (on ? " is-on" : "")} onClick={onClick}>
      {on && <iconify-icon icon="lucide:check"></iconify-icon>}
    </button>
  );
}

/* ------------------------------------------------------------------ data */
const TXN_STATS = [
  { label: "Overdue", value: "£ 0.00", labelColor: "var(--error)" },
  { label: "Due within next 30 days", value: "0", labelColor: "var(--gray-500)" },
  { label: "Upcoming Payout", value: "£ 301,614.31", labelColor: "var(--gray-500)" },
  { label: "No. of Transaction", value: "1000", labelColor: "var(--gray-500)" },
];

const TXN_ROWS = [
  { id: 1, no: "0000016215", name: "Christoph Yves Malik", email: "c.y.malik@mkg-im-…", amount: "£97.00", created: "Jul 23, 2026", due: "Jul 23, 2026" },
  { id: 2, no: "0000016214", name: "Nikita nirwan", email: "n_roddah123@hotm…", amount: "£97.00", created: "Jul 23, 2026", due: "Jul 23, 2026" },
  { id: 3, no: "0000016213", name: "Gillian Bruce", email: "gillian@ardcroftme…", amount: "£1.00", created: "Jul 23, 2026", due: "Jul 23, 2026" },
  { id: 4, no: "0000016211", name: "Temilola Mariam Sanni", email: "mariamsanni92@ya…", amount: "£1.00", created: "Jul 23, 2026", due: "Jul 23, 2026" },
  { id: 5, no: "0000016209", name: "Marissa Valdez", email: "marissavaldez2019…", amount: "£1.34", created: "Jul 23, 2026", due: "Jul 23, 2026" },
];

/* ------------------------------------------------------------ stat card */
function TXNStatCard({ stat }) {
  return (
    <div className="txn-stat-card">
      <div className="txn-stat-label" style={{ color: stat.labelColor }}>{stat.label}</div>
      <div className="txn-stat-value">{stat.value}</div>
    </div>
  );
}

/* -------------------------------------------------------------- view */
function TXNView() {
  const [segment, setSegment] = useStateTXN("invoices");
  const [selected, setSelected] = useStateTXN({});

  const count = Object.values(selected).filter(Boolean).length;
  const allChecked = TXN_ROWS.length > 0 && count === TXN_ROWS.length;

  const toggleAll = () => {
    if (allChecked) { setSelected({}); return; }
    const sel = {};
    TXN_ROWS.forEach((r) => (sel[r.id] = true));
    setSelected(sel);
  };
  const toggleOne = (id) => setSelected((st) => {
    const sel = { ...st };
    if (sel[id]) delete sel[id]; else sel[id] = true;
    return sel;
  });

  return (
    <div className="txn-view">
      <div className="txn-page-head">
        <div>
          <h1>Transactions</h1>
          <p>Your most recent transactions list</p>
        </div>
        <div className="txn-page-head-actions">
          <button className="txn-btn txn-btn-ghost" type="button"><iconify-icon icon="lucide:calendar"></iconify-icon>Select date range</button>
          <button className="txn-btn txn-btn-ghost" type="button"><iconify-icon icon="lucide:filter"></iconify-icon>Filter</button>
          <button className="txn-btn txn-btn-ghost" type="button"><iconify-icon icon="lucide:upload"></iconify-icon>Export</button>
        </div>
      </div>

      <div className="txn-segment">
        <button
          type="button"
          className={"txn-segment-btn" + (segment === "invoices" ? " is-active" : "")}
          onClick={() => setSegment("invoices")}
        >
          Invoices
        </button>
        <button
          type="button"
          className={"txn-segment-btn" + (segment === "transaction" ? " is-active" : "")}
          onClick={() => setSegment("transaction")}
        >
          Transaction
        </button>
      </div>

      <div className="txn-stat-grid">
        {TXN_STATS.map((stat) => (
          <TXNStatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="txn-table">
        <div className="txn-row-grid txn-thead">
          <TXNCheck on={allChecked} onClick={toggleAll} />
          <span className="txn-th">INVOICE NO.</span>
          <span className="txn-th">NAME</span>
          <span className="txn-th">EMAIL</span>
          <span className="txn-th">PAYMENT STATUS</span>
          <span className="txn-th">AMOUNT</span>
          <span className="txn-th">CREATION DATE</span>
          <span className="txn-th">DUE DATE</span>
          <span />
        </div>

        {TXN_ROWS.map((r) => {
          const checked = !!selected[r.id];
          return (
            <div key={r.id} className="txn-row-grid txn-trow" style={{ background: checked ? "var(--brand-gold-100)" : "var(--white)" }}>
              <TXNCheck on={checked} onClick={() => toggleOne(r.id)} />
              <span className="txn-cell txn-cell-mono">{r.no}</span>
              <span className="txn-cell txn-cell-name">{r.name}</span>
              <span className="txn-cell txn-cell-email">{r.email}</span>
              <div className="txn-status-pill">
                <span className="txn-status-dot" />
                <span className="txn-status-label">Paid</span>
              </div>
              <span className="txn-cell txn-cell-amount">{r.amount}</span>
              <span className="txn-cell">{r.created}</span>
              <span className="txn-cell">{r.due}</span>
              <iconify-icon icon="lucide:more-vertical" class="txn-row-more"></iconify-icon>
            </div>
          );
        })}

        <div className="txn-pagination">
          <button className="txn-pagebtn" type="button"><iconify-icon icon="lucide:chevron-left"></iconify-icon>Previous</button>
          <span className="txn-pageinfo">Page 1 of 100</span>
          <button className="txn-pagebtn" type="button">Next<iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
        </div>
      </div>
    </div>
  );
}

function TXNRoot() {
  return (
    <div className="txn-shell">
      <TXNSidebar />
      <div className="txn-main">
        <TXNHeader title="Transactions" />
        <TXNView />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<TXNRoot />);
