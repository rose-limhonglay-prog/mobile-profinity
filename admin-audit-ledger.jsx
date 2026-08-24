/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Audit Ledger & Manual
   Adjustments (Screen 4). Key metrics, immutable transaction log, and the
   Manual Adjustment slide-out panel (critical capability): search a user,
   pick Add/Deduct Points or Credits, enter amount + mandatory audit reason.
   Backed by window.PFLoyalty — adjustments on Katy Moore write a real ledger
   transaction visible on her Dashboard / Wallet immediately.
   Classes prefixed ldg- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateLDG, useMemo: useMemoLDG } = React;
const PF_LDG = window.PFLoyalty;

function goLDG(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

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
        <button key={item.label} className="adl-navitem" type="button" onClick={() => goLDG(item.href)}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
          {item.chevron && (<><span className="adl-spacer" /><iconify-icon icon="lucide:chevron-down" class="adl-chev"></iconify-icon></>)}
        </button>
      ))}
      <div className="adl-navgroup-label">Loyalty &amp; Gamification</div>
      <button className={"adl-navitem" + (activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goLDG("AdminActionsEditor.html")}>
        <iconify-icon icon="lucide:trophy"></iconify-icon>
        <span>Loyalty &amp; Gamification</span>
      </button>
      <div className="adl-subnav">
        {ADL_LOYALTY_SUBNAV.map((s) => (
          <button key={s.key} className={"adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goLDG(s.href)}>
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

function fmtDate(iso) { const d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }

/* ------------------------------------------------------------- LDG view */
function LdgStat({ label, value, tone }) {
  return (
    <div className="adl-stat-card">
      <div className="adl-stat-body">
        <div className="adl-stat-label">{label}</div>
        <div className="adl-stat-value" style={tone ? { color: tone } : undefined}>{value}</div>
      </div>
    </div>
  );
}

function LdgAdjustPanel({ open, onClose, onExecute }) {
  const directory = useMemoLDG(() => {
    const katy = PF_LDG.getState().user;
    return [{ name: katy.name + " Moore", email: katy.email, live: true }].concat(
      PF_LDG.MOCK_DIRECTORY.map((u) => ({ name: u.name, email: u.email, live: false }))
    );
  }, [open]);

  const [query, setQuery] = useStateLDG("");
  const [selected, setSelected] = useStateLDG(directory[0]);
  const [type, setType] = useStateLDG("add_points");
  const [amount, setAmount] = useStateLDG("");
  const [reason, setReason] = useStateLDG("");
  const [error, setError] = useStateLDG(null);

  if (!open) return null;

  const filtered = directory.filter((u) => (u.name + u.email).toLowerCase().includes(query.toLowerCase()));

  const submit = () => {
    if (!selected) { setError("Search for and select a user first."); return; }
    if (!selected.live) {
      if (!amount || !reason.trim()) { setError("Amount and Adjustment Reason are both required."); return; }
      onExecute({ ok: true, mock: true, user: selected });
      setAmount(""); setReason(""); setError(null);
      return;
    }
    const res = PF_LDG.manualAdjust({ type, amount, reason, adminId: "admin_drtim" });
    if (!res.ok) { setError(res.reason); return; }
    setError(null); setAmount(""); setReason("");
    onExecute({ ok: true, mock: false, user: selected, txn: res.txn });
  };

  return (
    <div className="adl-scrim" onClick={onClose}>
      <div className="adl-panel" onClick={(e) => e.stopPropagation()}>
        <div className="adl-panel-head"><h2>Manual Point / Credit Adjustment</h2>
          <button className="adl-panel-close" type="button" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>
        <div className="adl-panel-body">
          <div className="adl-field">
            <label>Search User by Email or ID</label>
            <input placeholder="Search directory..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="ldg-user-results">
            {filtered.map((u) => (
              <button key={u.email} type="button" className={"ldg-user-result" + (selected && selected.email === u.email ? " is-active" : "")} onClick={() => setSelected(u)}>
                <span className="ldg-user-result-name">{u.name}{u.live && <span className="ldg-live-pill">live in this demo</span>}</span>
                <span className="ldg-user-result-email">{u.email}</span>
              </button>
            ))}
          </div>

          <div className="adl-field">
            <label>Adjustment Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="add_points">Add Points</option>
              <option value="deduct_points">Deduct Points</option>
              <option value="add_credits">Add Credits</option>
              <option value="deduct_credits">Deduct Credits</option>
            </select>
          </div>
          <div className="adl-field">
            <label>Amount</label>
            <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" />
          </div>
          <div className="adl-field">
            <label>Adjustment Reason <span style={{ color: "var(--error)" }}>*</span></label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Required for audit logging, e.g. “Goodwill credit for support ticket #4821.”" />
          </div>
          {!selected?.live && <div className="adl-banner adl-banner-info"><iconify-icon icon="lucide:info"></iconify-icon><span>Only Katy Moore's account is live-simulated in this prototype. Adjustments for other directory profiles are recorded as a confirmation only.</span></div>}
          {error && <div className="adl-banner adl-banner-error"><iconify-icon icon="lucide:alert-triangle"></iconify-icon><span>{error}</span></div>}
        </div>
        <div className="adl-panel-foot">
          <button className="adl-btn adl-btn-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="adl-btn adl-btn-navy" type="button" onClick={submit}><iconify-icon icon="lucide:check"></iconify-icon>Execute Adjustment</button>
        </div>
      </div>
    </div>
  );
}

function AuditLedgerView() {
  const [state, setState] = useStateLDG(() => PF_LDG.getState());
  const [panelOpen, setPanelOpen] = useStateLDG(false);
  const [toast, setToast] = useStateLDG(null);
  const [manualCount, setManualCount] = useStateLDG(() => PF_LDG.getState().ledger.filter((t) => t.adminId).length);

  const rows = useMemoLDG(() => state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)), [state]);
  const last24h = useMemoLDG(() => rows.filter((t) => Date.now() - new Date(t.ts).getTime() < 86400000).length, [rows]);
  const fraudFlags = useMemoLDG(() => rows.filter((t) => t.guardrailFlags).length, [rows]);

  const onExecute = (res) => {
    if (!res.mock) setState(PF_LDG.getState());
    setManualCount((c) => c + 1);
    setPanelOpen(false);
    setToast("Adjustment executed for " + res.user.name + ".");
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>Audit Ledger &amp; Manual Adjustments</h1><p>Immutable transaction history and support interventions.</p></div>
        <div className="adl-page-head-actions">
          <button className="adl-btn adl-btn-navy" type="button" onClick={() => setPanelOpen(true)}><iconify-icon icon="lucide:sliders-horizontal"></iconify-icon>Manual Adjustment</button>
        </div>
      </div>
      {toast && <div className="adl-banner adl-banner-info"><iconify-icon icon="lucide:check-circle"></iconify-icon><span>{toast}</span></div>}

      <div className="adl-stat-grid">
        <LdgStat label="Total 24h Transactions" value={last24h} />
        <LdgStat label="Active Fraud Flags" value={fraudFlags} tone={fraudFlags ? "var(--error)" : undefined} />
        <LdgStat label="Pending Reviews" value={state.ledger.filter((t) => t.actionId && PF_LDG.getActionById(t.actionId)?.requiresApproval).length} />
        <LdgStat label="Total Manual Adjustments" value={manualCount} />
      </div>

      <div className="adl-table">
        <div className="adl-row-grid adl-thead ldg-row-grid">
          <span className="adl-th">Transaction ID</span>
          <span className="adl-th">User</span>
          <span className="adl-th">Action</span>
          <span className="adl-th">Date</span>
          <span className="adl-th">Points</span>
          <span className="adl-th">Credits</span>
          <span className="adl-th">Flags</span>
        </div>
        {rows.slice(0, 40).map((t) => (
          <div key={t.id} className="adl-row-grid adl-trow ldg-row-grid">
            <span className="adl-cell adl-cell-mono">{t.id}</span>
            <span className="adl-cell">{state.user.name} Moore</span>
            <span className="adl-cell">{t.label}{t.adminId && <span className="ldg-admin-tag"> · by {t.adminId}</span>}</span>
            <span className="adl-cell-muted">{fmtDate(t.ts)}</span>
            <span className="adl-cell" style={{ color: t.pointsDelta > 0 ? "var(--success)" : t.pointsDelta < 0 ? "var(--error)" : "var(--gray-400)", fontWeight: 700 }}>{t.pointsDelta > 0 ? "+" : ""}{t.pointsDelta}</span>
            <span className="adl-cell" style={{ color: t.creditsDelta > 0 ? "var(--success)" : t.creditsDelta < 0 ? "var(--error)" : "var(--gray-400)", fontWeight: 700 }}>{t.creditsDelta > 0 ? "+" : ""}{t.creditsDelta}</span>
            <span>{t.guardrailFlags ? <span className="adl-pill" style={{ background: "var(--warning-bg)", color: "#96690a" }}><span className="adl-pill-dot" style={{ background: "#96690a" }} />{t.guardrailFlags}</span> : t.adjustmentReason ? <span className="adl-pill" style={{ background: "var(--info-bg)", color: "var(--info)" }} title={t.adjustmentReason}>Manual</span> : "—"}</span>
          </div>
        ))}
      </div>

      <LdgAdjustPanel open={panelOpen} onClose={() => setPanelOpen(false)} onExecute={onExecute} />
    </div>
  );
}

function AuditLedgerApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey="ledger" />
      <main className="adl-main">
        <AdlHeader title="Loyalty &amp; Gamification — Audit Ledger" />
        <AuditLedgerView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AuditLedgerApp />);
