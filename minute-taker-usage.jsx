/* ===========================================================================
   PROfinity — Minute Taker · Pricing & Usage Dashboard
   Telemetry cards, 7-day usage trend, usage health donut, subscriber caps.
   PRD Screen 8 (Sec. 3.8 / MT-A03, MT-A04, MT-A06).
   Classes prefixed mtu- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMTU } = React;

function goMTU(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const MTAD_ADMIN_NAV = [
  { icon: "lucide:shield-check", label: "Admin Users", href: "MinuteTakerAdmin.html" },
  { icon: "lucide:credit-card", label: "Usage & Billing", href: "MinuteTakerUsage.html" },
];

function MTUSidebar() {
  return (
    <aside className="mtu-sidebar">
      <div className="mtu-logo"><iconify-icon icon="lucide:mic" class="mtu-logo-icon"></iconify-icon><span>Minute Taker</span></div>
      <div className="mtu-nav-scope">Admin Console</div>
      <button
        className="mtu-navitem mtu-navitem-back"
        type="button"
        onClick={() => goMTU("AdminAgents.html")}
      >
        <iconify-icon icon="lucide:arrow-left"></iconify-icon>
        <span>Back to Admin Dashboard</span>
      </button>
      {MTAD_ADMIN_NAV.map((item) => (
        <button
          key={item.label}
          className={"mtu-navitem" + (item.label === "Usage & Billing" ? " is-active" : "")}
          type="button"
          onClick={item.label !== "Usage & Billing" ? () => goMTU(item.href) : undefined}
        >
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

function MTUHeader() {
  return (
    <header className="mtu-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="mtu-header-title">Minute Taker</span>
      <div className="mtu-spacer" />
      <div className="mtu-user">
        <div className="mtu-user-name">Dr. Katie Smith</div>
        <div className="mtu-user-role">Clinician</div>
      </div>
      <img className="mtu-user-avatar" src="assets/avatar-katy.jpg" alt="Dr. Katie Smith" />
    </header>
  );
}

const MTU_CARDS = [
  { label: "Active Subscribers", value: "142", sub: "+12 this month" },
  { label: "Sessions Consumed", value: "3,240", sub: "Current billing cycle" },
  { label: "Cost to Date", value: "$486.00", sub: "Based on $0.15 / session" },
  { label: "Projected End Cost", value: "$650.00", sub: "Estimated for period end" },
];

const MTU_TREND = [
  { d: "Mon", v: 120 }, { d: "Tue", v: 150 }, { d: "Wed", v: 175 }, { d: "Thu", v: 140 },
  { d: "Fri", v: 200 }, { d: "Sat", v: 80 }, { d: "Sun", v: 60 },
];

const MTU_LIMITS = [
  { name: "Dr. Sarah Jenkins", status: "Warning", used: 450, cap: 500, cost: "$67.50" },
  { name: "Dr. Marcus Webb", status: "Blocked", used: 200, cap: 200, cost: "$30.00" },
];

function mtuExportCsv(rows) {
  const header = "Subscriber,Status,Usage,Cap,Cost To Date\n";
  const body = rows.map((r) => [r.name, r.status, r.used, r.cap, r.cost].join(",")).join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "minute-taker-usage-report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function MTUDonut() {
  return (
    <div className="mtu-donut-wrap">
      <div className="mtu-donut" style={{ background: "conic-gradient(var(--gray-900) 0% 85%, var(--warning) 85% 95%, var(--error) 95% 100%)" }}>
        <div className="mtu-donut-hole" />
      </div>
      <div className="mtu-donut-legend">
        <span><i style={{ background: "var(--gray-900)" }} />Healthy (&lt;80%)</span>
        <span><i style={{ background: "var(--warning)" }} />Warning</span>
        <span><i style={{ background: "var(--error)" }} />Blocked</span>
      </div>
    </div>
  );
}

function MTUView() {
  const [toast, setToast] = useStateMTU(null);

  function handleExport() {
    mtuExportCsv(MTU_LIMITS);
    setToast("Usage report exported.");
    window.setTimeout(() => setToast(null), 2200);
  }

  const maxV = Math.max(...MTU_TREND.map((t) => t.v));

  return (
    <div className="mtu-view">
      <div className="mtu-page-head">
        <div>
          <h1>Pricing &amp; Usage</h1>
          <p>Monitor platform usage, track costs, and manage subscriber limits.</p>
        </div>
        <button className="mtu-btn mtu-btn-ghost" type="button" onClick={handleExport}>
          <iconify-icon icon="lucide:download"></iconify-icon>Export CSV
        </button>
      </div>

      <div className="mtu-stat-grid">
        {MTU_CARDS.map((c) => (
          <div className="mtu-stat-card" key={c.label}>
            <div className="mtu-stat-label">{c.label}</div>
            <div className="mtu-stat-value">{c.value}</div>
            <div className="mtu-stat-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="mtu-chart-grid">
        <div className="mtu-card">
          <div className="mtu-card-head"><span className="mtu-card-title-text">Usage Trends (Past 7 Days)</span></div>
          <div className="mtu-bar-chart">
            {MTU_TREND.map((t) => (
              <div className="mtu-bar-col" key={t.d} title={t.d + ": " + t.v + " sessions"}>
                <div className="mtu-bar" style={{ height: (t.v / maxV * 100) + "%" }}>
                  <span className="mtu-bar-value">{t.v}</span>
                </div>
                <span className="mtu-bar-label">{t.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mtu-card">
          <div className="mtu-card-head"><span className="mtu-card-title-text">Usage Health</span></div>
          <MTUDonut />
        </div>
      </div>

      <div className="mtu-card">
        <div className="mtu-card-head">
          <span className="mtu-card-title-text">Subscriber Limits &amp; Usage</span>
          <span className="mtu-cap-note">Warnings triggered at 80%</span>
        </div>
        <div className="mtu-row-grid mtu-thead">
          <span className="mtu-th">Subscriber</span>
          <span className="mtu-th">Status</span>
          <span className="mtu-th">Usage vs Cap</span>
          <span className="mtu-th">Cost to Date</span>
          <span className="mtu-th">Cap Limit</span>
        </div>
        {MTU_LIMITS.map((r) => {
          const pct = Math.min(100, Math.round((r.used / r.cap) * 100));
          return (
            <div key={r.name} className="mtu-row-grid mtu-trow">
              <span className="mtu-name-cell">{r.name}</span>
              <span className={"mtu-status-pill " + (r.status === "Blocked" ? "danger" : "warning")}>{r.status}</span>
              <span className="mtu-usage-cell">
                <span className="mtu-usage-bar"><span className={"mtu-usage-fill " + (r.status === "Blocked" ? "danger" : "warning")} style={{ width: pct + "%" }} /></span>
                <span className="mtu-usage-text">{r.used} / {r.cap}</span>
              </span>
              <span>{r.cost}</span>
              <span className="mtu-cap-tag">[{r.cap}]</span>
            </div>
          );
        })}
      </div>

      {toast && <div className="mtu-toast">{toast}</div>}
    </div>
  );
}

function MTUApp() {
  return (
    <div className="mtu-shell">
      <MTUSidebar />
      <div className="mtu-main">
        <MTUHeader />
        <MTUView />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTUApp />);
