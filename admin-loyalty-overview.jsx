/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · System Overview & Analytics
   (Screen 6). Central health dashboard: DAU, Points Inflation Rate,
   Redemption Rate, global economy settings (credit conversion rate, credit
   expiry, streak-freeze cost) and open dispute tickets.
   Classes prefixed ovw- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateOVW, useMemo: useMemoOVW } = React;
const PF_OVW = window.PFLoyalty;

function goOVW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const ADL_NAV_TOP = [
  { icon: "lucide:layout-grid", label: "Dashboard", href: "AdminDashboard.html" },
  { icon: "lucide:user", label: "Users", href: "AdminUsers.html" },
  { icon: "lucide:file-text", label: "Posts Management", href: "AdminPostsManagement.html" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation", href: "AdminModeration.html" },
  { icon: "lucide:life-buoy", label: "Service Requests", href: "AdminServiceRequests.html" },
  { icon: "lucide:shield-check", label: "Verification", href: "AdminVerification.html" },
  { icon: "lucide:users-round", label: "Agents", href: "AdminAgents.html" },
  { icon: "lucide:calendar", label: "Events", href: "AdminEvents.html" },
  { icon: "lucide:map", label: "Product Mapping", href: "AdminProductMapping.html" },
  { icon: "lucide:bar-chart-3", label: "Analytics", href: "AdminAnalytics.html" },
  { icon: "lucide:smartphone", label: "App Versions", href: "AdminAppVersions.html" },
  { icon: "lucide:bell", label: "Push Notification", href: "AdminPushNotifications.html" },
  { icon: "lucide:badge-check", label: "Badges", href: "AdminBadges.html" },
  { icon: "lucide:receipt-text", label: "Transactions", href: "AdminTransactions.html", chevron: true },
  { icon: "lucide:table-2", label: "Courses", href: "AdminCourses.html", chevron: true },
  { icon: "lucide:users", label: "Community", href: "AdminCommunity.html", chevron: true }
];
const ADL_LOYALTY_SUBNAV = [
  { key: "actions", label: "Actions Editor", href: "AdminActionsEditor.html" },
  { key: "tiers", label: "Tier Multipliers", href: "AdminTierMultipliers.html" },
  { key: "rewards", label: "Reward Editor", href: "AdminRewardEditor.html" },
  { key: "ledger", label: "Audit Ledger", href: "AdminAuditLedger.html" },
  { key: "users", label: "User Diagnostics", href: "AdminUserDiagnostics.html" },
  { key: "overview", label: "System Overview", href: "AdminLoyaltyOverview.html" }
];

function AdlSidebar({ activeLoyaltyKey }) {
  return (
    <aside className="adl-sidebar">
      <div className="adl-logo"><img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" /></div>
      {ADL_NAV_TOP.map((item) => (
        <button key={item.label} className="adl-navitem" type="button" onClick={() => goOVW(item.href)}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
          {item.chevron && (<><span className="adl-spacer" /><iconify-icon icon="lucide:chevron-down" class="adl-chev"></iconify-icon></>)}
        </button>
      ))}
      <div className="adl-navgroup-label">Loyalty &amp; Gamification</div>
      <button className={"adl-navitem" + (activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goOVW("AdminActionsEditor.html")}>
        <iconify-icon icon="lucide:trophy"></iconify-icon>
        <span>Loyalty &amp; Gamification</span>
      </button>
      <div className="adl-subnav">
        {ADL_LOYALTY_SUBNAV.map((s) => (
          <button key={s.key} className={"adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goOVW(s.href)}>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function AdlHeader({ title }) {
  return (
    <header className="adl-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="adl-header-title">{title}</span>
      <div className="adl-header-search"><iconify-icon icon="lucide:search"></iconify-icon><input placeholder="Type to search..." /></div>
      <div className="adl-spacer" />
      <div className="adl-bell"><iconify-icon icon="lucide:bell"></iconify-icon><span className="adl-bell-badge">4</span></div>
      <div className="adl-user"><div className="adl-user-name">Dr Tim Pearce</div><div className="adl-user-role">Admin</div></div>
      <img className="adl-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

const OVW_DISPUTES = [
  { id: "DT-2291", user: "Priya Nandwani", topic: "Review points not credited", status: "Open", opened: "2 days ago" },
  { id: "DT-2288", user: "Marcus Webb", topic: "Streak reset unexpectedly", status: "Investigating", opened: "3 days ago" },
  { id: "DT-2277", user: "Sofia Alarcón", topic: "Voucher code not working", status: "Resolved", opened: "6 days ago" }
];

function OvwStat({ label, value, sub, tone }) {
  return (
    <div className="adl-stat-card">
      <div className="adl-stat-body">
        <div className="adl-stat-label">{label}</div>
        <div className="adl-stat-value" style={tone ? { color: tone } : undefined}>{value}</div>
        {sub && <div className="ovw-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function OverviewView() {
  const [config, setConfig] = useStateOVW(() => PF_OVW.getConfig());
  const [state] = useStateOVW(() => PF_OVW.getState());
  const [toast, setToast] = useStateOVW(null);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const totalEarned = useMemoOVW(() => state.ledger.reduce((s, t) => s + Math.max(0, t.creditsDelta), 0), [state]);
  const totalRedeemed = useMemoOVW(() => Math.abs(state.ledger.filter((t) => t.creditsDelta < 0 && t.actionId && t.actionId.startsWith("redeem:")).reduce((s, t) => s + t.creditsDelta, 0)), [state]);
  const redemptionRate = totalEarned ? Math.round((totalRedeemed / totalEarned) * 100) : 0;
  const cappedCount = state.ledger.filter((t) => t.guardrailFlags === "CAP_REACHED").length;
  const inflationRate = state.ledger.length ? Math.round((cappedCount / state.ledger.length) * 1000) / 10 : 0;

  const set = (patch) => setConfig(PF_OVW.setConfig(patch));

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>System Overview &amp; Analytics</h1><p>Health metrics for the loyalty economy plus global configuration.</p></div>
      </div>
      {toast && <div className="adl-banner adl-banner-info"><iconify-icon icon="lucide:check-circle"></iconify-icon><span>{toast}</span></div>}

      <div className="adl-stat-grid">
        <OvwStat label="Daily Active Users" value="8,214" sub="+3.2% vs. last week" />
        <OvwStat label="Points Inflation Rate" value={inflationRate + "%"} sub="Share of attempts silently capped" tone={inflationRate > 15 ? "var(--error)" : undefined} />
        <OvwStat label="Overall Redemption Rate" value={redemptionRate + "%"} sub="Credits spent vs. credits earned" />
        <OvwStat label="Open Dispute Tickets" value={OVW_DISPUTES.filter((d) => d.status !== "Resolved").length} />
      </div>

      <div className="adl-card">
        <div className="adl-card-head"><div><span className="adl-card-title-text">Global Economy Settings</span><div className="adl-card-sub">These apply platform-wide across every action and tier.</div></div></div>
        <div className="adl-field-row-3">
          <div className="adl-field"><label>Credit Conversion Rate</label>
            <input type="number" step="0.01" value={config.creditConversionRate} onChange={(e) => set({ creditConversionRate: Number(e.target.value) || 0 })} />
            <span className="adl-field-hint">Credits = Points × rate. Currently {config.creditConversionRate} → 500 pts earns {Math.round(500 * config.creditConversionRate)} credits.</span>
          </div>
          <div className="adl-field"><label>Credit Expiry (months)</label>
            <input type="number" value={config.creditExpiryMonths} onChange={(e) => set({ creditExpiryMonths: Number(e.target.value) || 0 })} />
          </div>
          <div className="adl-field"><label>Streak Freeze Cost (credits)</label>
            <input type="number" value={config.streakFreezeCost} onChange={(e) => set({ streakFreezeCost: Number(e.target.value) || 0 })} />
          </div>
        </div>
        <div style={{ marginTop: 14 }}><button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={() => flash("Global economy settings saved.")}><iconify-icon icon="lucide:save"></iconify-icon>Save Settings</button></div>
      </div>

      <div className="adl-table">
        <div className="adl-card-head" style={{ padding: "18px 20px 0", border: "none" }}><span className="adl-card-title-text">User Dispute Tickets</span></div>
        <div className="adl-row-grid adl-thead" style={{ gridTemplateColumns: "0.8fr 1.2fr 1.6fr 0.9fr 0.9fr", marginTop: 8 }}>
          <span className="adl-th">Ticket</span><span className="adl-th">User</span><span className="adl-th">Topic</span><span className="adl-th">Status</span><span className="adl-th">Opened</span>
        </div>
        {OVW_DISPUTES.map((d) => (
          <div key={d.id} className="adl-row-grid adl-trow" style={{ gridTemplateColumns: "0.8fr 1.2fr 1.6fr 0.9fr 0.9fr" }}>
            <span className="adl-cell adl-cell-mono">{d.id}</span>
            <span className="adl-cell">{d.user}</span>
            <span className="adl-cell">{d.topic}</span>
            <span><span className="adl-pill" style={{
              background: d.status === "Resolved" ? "var(--success-bg)" : d.status === "Investigating" ? "var(--warning-bg)" : "var(--info-bg)",
              color: d.status === "Resolved" ? "var(--success)" : d.status === "Investigating" ? "#96690a" : "var(--info)"
            }}>{d.status}</span></span>
            <span className="adl-cell-muted">{d.opened}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey="overview" />
      <main className="adl-main">
        <AdlHeader title="Loyalty &amp; Gamification — System Overview" />
        <OverviewView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<OverviewApp />);
