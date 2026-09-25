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
  { icon: "lucide:badge-check", label: "Badges" },
  { icon: "lucide:clipboard-list", label: "Quizzes & Surveys" },
  { icon: "lucide:trophy", label: "Loyalty & Gamification", chevron: true },
  { icon: "lucide:scroll-text", label: "Points Ledger" },
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
  "Badges": "AdminBadges.html",
  "Quizzes & Surveys": "AdminQuizEditor.html",
  "Loyalty & Gamification": "AdminActionsEditor.html",
  "Points Ledger": "AdminAuditLedger.html",
  "Transactions": "AdminTransactions.html",
  "Courses": "AdminCourses.html",
  "Community": "AdminCommunity.html",
};

function ANASidebar() {
  return (
    <aside className="ana-sidebar">
      <div className="ana-logo">
        <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" />
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

/* ------------------------------------------------ Today's Targets funnel */
/* Reads the local funnel that daily-targets.js keeps (pf-targets-analytics):
   impressions → free taps / downloads, paid taps → checkouts → purchases and
   the revenue those purchases brought in. Prototype scope: this device's
   data; the production read would come from the events pipeline. */
const ANA_FUNNEL_RANGES = [{ label: "7 days", days: 7 }, { label: "30 days", days: 30 }, { label: "All time", days: 0 }];
const anaGBP = (n) => "£" + Number(n || 0).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const anaPct = (v) => v == null ? "—" : v + "%";

function ANATargetsFunnel() {
  const T = window.PFDailyTargets;
  const [range, setRange] = React.useState(7);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    window.addEventListener("pf:daily-targets-analytics", bump);
    window.addEventListener("storage", bump);
    return () => { window.removeEventListener("pf:daily-targets-analytics", bump); window.removeEventListener("storage", bump); };
  }, []);
  if (!T) return null;
  const f = T.getFunnel(range);
  const picks = T.get();
  const stages = [
    { label: "Targets shown (daily pairs)", value: f.impressions, rate: null, note: "one per member per day" },
    { label: "Free item tapped", value: f.freeTaps, rate: f.rates.freeTap, note: "of shown" },
    { label: "Free PDF downloaded", value: f.freeDownloads, rate: f.rates.freeDownload, note: "of shown" },
    { label: "Paid CTA tapped", value: f.paidTaps, rate: f.rates.paidTap, note: "of shown" },
    { label: "Checkout started", value: f.checkouts, rate: f.rates.checkout, note: "of paid taps" },
    { label: "Course purchased", value: f.purchases, rate: f.rates.purchase, note: "of paid taps", bold: true }
  ];
  return (
    <section className="ana-funnel" data-tick={tick}>
      <div className="ana-funnel-head">
        <div>
          <h2>Today's Targets — usage funnel &amp; revenue</h2>
          <p>Daily free download + paid course pick. Today: <b>{picks.free.title}</b> · <b>{picks.paid.title}</b> ({anaGBP(picks.paid.price).replace(".00", "")})</p>
        </div>
        <div className="ana-funnel-ranges" role="tablist" aria-label="Date range">
          {ANA_FUNNEL_RANGES.map((r) =>
            <button key={r.days} type="button" role="tab" aria-selected={range === r.days} className={"ana-range" + (range === r.days ? " is-active" : "")} onClick={() => setRange(r.days)}>{r.label}</button>)}
        </div>
      </div>

      <div className="ana-kpis">
        <div className="ana-kpi is-revenue"><span className="ana-kpi-l">Attributed revenue</span><span className="ana-kpi-v">{anaGBP(f.revenue)}</span><span className="ana-kpi-s">{f.purchases} purchase{f.purchases === 1 ? "" : "s"} · avg order {anaGBP(f.avgOrder)}</span></div>
        <div className="ana-kpi"><span className="ana-kpi-l">Revenue per target shown</span><span className="ana-kpi-v">{anaGBP(f.revenuePerImpression)}</span><span className="ana-kpi-s">{f.impressions} daily pairs shown</span></div>
        <div className="ana-kpi"><span className="ana-kpi-l">Shown → purchase</span><span className="ana-kpi-v">{anaPct(f.rates.overallConversion)}</span><span className="ana-kpi-s">overall conversion</span></div>
        <div className="ana-kpi"><span className="ana-kpi-l">Free download rate</span><span className="ana-kpi-v">{anaPct(f.rates.freeDownload)}</span><span className="ana-kpi-s">{f.freeDownloads} PDFs downloaded</span></div>
      </div>

      <div className="ana-table">
        <div className="ana-row-grid ana-thead">
          <span className="ana-th">FUNNEL STAGE</span>
          <span className="ana-th ana-th-right">COUNT</span>
          <span className="ana-th ana-th-right">RATE</span>
        </div>
        {stages.map((st, i) =>
          <div key={i} className={"ana-row-grid ana-trow" + (st.bold ? " is-bold" : "")}>
            <span className="ana-metric-cell">{st.label}</span>
            <span className="ana-count-cell">{anaFormatCount(st.value)}</span>
            <span className="ana-revenue-cell"><span className="ana-funnel-rate">{anaPct(st.rate)}</span>{st.rate != null && <span className="ana-funnel-note"> {st.note}</span>}</span>
          </div>)}
      </div>

      <div className="ana-table">
        <div className="ana-row-grid ana-row-grid-days ana-thead">
          <span className="ana-th">DAY</span>
          <span className="ana-th ana-th-right">SHOWN</span>
          <span className="ana-th ana-th-right">FREE DL</span>
          <span className="ana-th ana-th-right">PAID TAPS</span>
          <span className="ana-th ana-th-right">PURCHASES</span>
          <span className="ana-th ana-th-right">REVENUE</span>
        </div>
        {f.perDay.length === 0 &&
          <div className="ana-row-grid ana-trow"><span className="ana-metric-cell ana-empty">No target activity recorded yet in this range.</span></div>}
        {f.perDay.map((d) =>
          <div key={d.date} className="ana-row-grid ana-row-grid-days ana-trow">
            <span className="ana-metric-cell">{new Date(d.date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
            <span className="ana-count-cell">{d.impressions}</span>
            <span className="ana-count-cell">{d.freeDownloads}<span className="ana-funnel-note"> / {d.freeTaps}</span></span>
            <span className="ana-count-cell">{d.paidTaps}<span className="ana-funnel-note"> → {d.checkouts} co</span></span>
            <span className="ana-count-cell">{d.purchases}</span>
            <span className="ana-revenue-cell">{anaGBP(d.revenue)}</span>
          </div>)}
      </div>
      <p className="ana-funnel-foot">Attribution: a purchase counts when the same course was tapped from Today's Targets within the previous 24 hours (last touch). Revenue is the amount paid at checkout, after reward discounts, including VAT.</p>
    </section>
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
      <ANATargetsFunnel />
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
