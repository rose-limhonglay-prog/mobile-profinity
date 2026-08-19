/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · User Directory & Diagnostics
   (Screen 5). Diagnostic view for a selected clinician: account balances,
   streak status (freeze / restore), badge progress & entitlements, and
   recent ledger activity. Katy Moore is the live-simulated profile in this
   prototype; other directory rows are static reference data.
   Classes prefixed diag- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateDIAG, useMemo: useMemoDIAG } = React;
const PF_DIAG = window.PFLoyalty;

function goDIAG(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

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
        <button key={item.label} className="adl-navitem" type="button" onClick={() => goDIAG(item.href)}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
          {item.chevron && (<><span className="adl-spacer" /><iconify-icon icon="lucide:chevron-down" class="adl-chev"></iconify-icon></>)}
        </button>
      ))}
      <div className="adl-navgroup-label">Loyalty &amp; Gamification</div>
      <button className={"adl-navitem" + (activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goDIAG("AdminActionsEditor.html")}>
        <iconify-icon icon="lucide:trophy"></iconify-icon>
        <span>Loyalty &amp; Gamification</span>
      </button>
      <div className="adl-subnav">
        {ADL_LOYALTY_SUBNAV.map((s) => (
          <button key={s.key} className={"adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goDIAG(s.href)}>
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

function fmtDate(iso) { const d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }); }

function DiagUsersRail({ profiles, selected, onSelect }) {
  return (
    <div className="diag-rail">
      {profiles.map((p) => (
        <button key={p.email} type="button" className={"diag-rail-row" + (p.email === selected.email ? " is-active" : "")} onClick={() => onSelect(p)}>
          <span className="diag-rail-avatar">{p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
          <span className="diag-rail-main"><span className="diag-rail-name">{p.name}{p.live && <span className="ldg-live-pill" style={{ marginLeft: 6 }}>live</span>}</span><span className="diag-rail-email">{p.email}</span></span>
        </button>
      ))}
    </div>
  );
}

function DiagQuickAdjust({ onSubmit, disabled }) {
  const [open, setOpen] = useStateDIAG(false);
  const [type, setType] = useStateDIAG("add_points");
  const [amount, setAmount] = useStateDIAG("");
  const [reason, setReason] = useStateDIAG("");
  const [error, setError] = useStateDIAG(null);
  if (!open) return <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => setOpen(true)}><iconify-icon icon="lucide:pencil"></iconify-icon>Add/Deduct</button>;
  return (
    <div className="diag-quick-adjust">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="add_points">Add Points</option>
        <option value="deduct_points">Deduct Points</option>
        <option value="add_credits">Add Credits</option>
        <option value="deduct_credits">Deduct Credits</option>
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input placeholder="Reason (required)" value={reason} onChange={(e) => setReason(e.target.value)} />
      <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={() => {
        if (disabled) { onSubmit({ mock: true }); setOpen(false); return; }
        const res = PF_DIAG.manualAdjust({ type, amount, reason, adminId: "admin_drtim" });
        if (!res.ok) { setError(res.reason); return; }
        onSubmit({ mock: false }); setOpen(false); setAmount(""); setReason("");
      }}>Apply</button>
      <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => setOpen(false)}>Cancel</button>
      {error && <div className="diag-quick-error">{error}</div>}
    </div>
  );
}

function UserDiagnosticsView() {
  const [config, setConfig] = useStateDIAG(() => PF_DIAG.getConfig());
  const katy = PF_DIAG.getState().user;
  const profiles = useMemoDIAG(() => [{ name: katy.name + " Moore", email: katy.email, live: true }].concat(PF_DIAG.MOCK_DIRECTORY.map((u) => ({ ...u, live: false }))), []);
  const [selected, setSelected] = useStateDIAG(profiles[0]);
  const [state, setState] = useStateDIAG(() => PF_DIAG.getState());
  const [toast, setToast] = useStateDIAG(null);

  const isLive = selected.live;
  const balances = isLive ? { lifetimePoints: state.lifetimePoints, spendableCredits: state.spendableCredits, expiringCredits: state.expiringCredits } : selected;
  const streak = isLive ? state.streak : { current: selected.streakCurrent, longest: selected.streakLongest, frozen: false };
  const badgeProgress = isLive ? PF_DIAG.getBadgeProgress(state) : PF_DIAG.getBadgeProgress({ lifetimePoints: selected.lifetimePoints });
  const ledger = isLive ? state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 8) : [];

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const refresh = () => setState(PF_DIAG.getState());

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>User Directory &amp; Diagnostics</h1><p>Deep diagnostic view for one clinician — balances, streak status, badge entitlements and recent ledger activity.</p></div>
      </div>
      {toast && <div className="adl-banner adl-banner-info"><iconify-icon icon="lucide:check-circle"></iconify-icon><span>{toast}</span></div>}

      <div className="diag-grid">
        <DiagUsersRail profiles={profiles} selected={selected} onSelect={setSelected} />

        <div className="diag-main">
          <div className="diag-profile-head">
            <span className="diag-profile-avatar">{selected.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
            <div><div className="diag-profile-name">{selected.name}</div><div className="diag-profile-email">{selected.email}</div></div>
            <span className="adl-pill" style={{ background: "var(--brand-gold-100)", color: "var(--brand-navy)", marginLeft: "auto" }}>{isLive ? katy.membershipTier : selected.membershipTier} Membership</span>
          </div>

          <div className="diag-card-row">
            <div className="adl-card diag-card">
              <div className="adl-card-head"><span className="adl-card-title-text">Account Balances</span><DiagQuickAdjust disabled={!isLive} onSubmit={(r) => { refresh(); flash(r.mock ? "Adjustment recorded (mock profile)." : "Adjustment applied to " + selected.name + "."); }} /></div>
              <div className="diag-balance-row"><span>Lifetime Points</span><b>{PF_DIAG.formatNumber(balances.lifetimePoints)}</b></div>
              <div className="diag-balance-row"><span>Spendable Credits</span><b>{PF_DIAG.formatNumber(balances.spendableCredits)}</b></div>
              <div className="diag-balance-row"><span>Expiring Credits</span><b style={{ color: "var(--warning)" }}>{PF_DIAG.formatNumber(balances.expiringCredits || 0)}</b></div>
            </div>

            <div className="adl-card diag-card">
              <div className="adl-card-head"><span className="adl-card-title-text">Streak Status</span></div>
              <div className="diag-balance-row"><span>Current Streak</span><b>{streak.current} days</b></div>
              <div className="diag-balance-row"><span>Longest Streak</span><b>{streak.longest} days</b></div>
              <div className="diag-streak-actions">
                <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => { if (!isLive) { flash("Mock profile — freeze not persisted."); return; } PF_DIAG.freezeStreak(2); refresh(); flash("Streak frozen for 2 days."); }}><iconify-icon icon="lucide:snowflake"></iconify-icon>Freeze Streak</button>
                <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => { if (!isLive) { flash("Mock profile — restore not persisted."); return; } PF_DIAG.restoreBrokenStreak(); refresh(); flash("Streak restored to longest (" + PF_DIAG.getState().streak.longest + " days)."); }}><iconify-icon icon="lucide:rotate-ccw"></iconify-icon>Restore Broken Streak</button>
              </div>
            </div>
          </div>

          <div className="adl-card">
            <div className="adl-card-head"><span className="adl-card-title-text">Badge Progress &amp; Entitlements</span></div>
            <div className="diag-badge-progress">
              <span>{badgeProgress.current ? badgeProgress.current.name : "Unranked"} → {badgeProgress.next ? badgeProgress.next.name : "Max level"}</span>
              <div className="adl-field" style={{ margin: 0 }}><div style={{ height: 8, background: "var(--gray-200)", borderRadius: 999, overflow: "hidden" }}><div style={{ height: "100%", width: badgeProgress.pct + "%", background: "linear-gradient(90deg, var(--brand-gold), var(--brand-gold-soft))" }} /></div></div>
              <span className="adl-cell-muted">{badgeProgress.pct}% to {badgeProgress.next ? badgeProgress.next.name : "top tier"}</span>
            </div>
            {isLive && (
              <div className="diag-achievement-grid">
                {config.achievementBadges.map((b) => {
                  const unlocked = state.unlockedAchievements.includes(b.key);
                  return (
                    <div key={b.key} className={"diag-achievement-chip" + (unlocked ? " is-unlocked" : "")}>
                      <iconify-icon icon={b.icon}></iconify-icon>
                      <span>{b.name}</span>
                      <button className="diag-achievement-toggle" type="button" onClick={() => {
                        const list = unlocked ? state.unlockedAchievements.filter((k) => k !== b.key) : state.unlockedAchievements.concat([b.key]);
                        PF_DIAG.setState({ unlockedAchievements: list }); refresh();
                        flash((unlocked ? "Revoked " : "Granted ") + b.name + ".");
                      }}>{unlocked ? "Revoke" : "Grant"}</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {isLive && (
            <div className="adl-table">
              <div className="adl-card-head" style={{ padding: "18px 20px 0", border: "none" }}><span className="adl-card-title-text">Recent Ledger Activity</span></div>
              <div className="adl-row-grid adl-thead" style={{ gridTemplateColumns: "1.6fr 1fr 0.7fr 0.7fr", marginTop: 8 }}>
                <span className="adl-th">Action</span><span className="adl-th">Date</span><span className="adl-th">Points</span><span className="adl-th">Credits</span>
              </div>
              {ledger.map((t) => (
                <div key={t.id} className="adl-row-grid adl-trow" style={{ gridTemplateColumns: "1.6fr 1fr 0.7fr 0.7fr" }}>
                  <span className="adl-cell">{t.label}</span>
                  <span className="adl-cell-muted">{fmtDate(t.ts)}</span>
                  <span className="adl-cell" style={{ fontWeight: 700, color: t.pointsDelta > 0 ? "var(--success)" : "var(--gray-400)" }}>{t.pointsDelta > 0 ? "+" + t.pointsDelta : t.pointsDelta}</span>
                  <span className="adl-cell" style={{ fontWeight: 700, color: t.creditsDelta > 0 ? "var(--success)" : t.creditsDelta < 0 ? "var(--error)" : "var(--gray-400)" }}>{t.creditsDelta > 0 ? "+" + t.creditsDelta : t.creditsDelta}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserDiagnosticsApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey="users" />
      <main className="adl-main">
        <AdlHeader title="Loyalty &amp; Gamification — User Diagnostics" />
        <UserDiagnosticsView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<UserDiagnosticsApp />);
