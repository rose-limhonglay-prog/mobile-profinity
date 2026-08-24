/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Tier Multipliers (Screen 2)
   Global tier default multipliers (applied to Base Points) plus a per-action
   override table so specific actions can bypass the global default for a
   given membership tier (e.g. Purchase Item forced to 1.2x for Confidence
   instead of the 1.5x global default). Backed by window.PFLoyalty.
   Classes prefixed tier- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateTIER, useMemo: useMemoTIER } = React;
const PF_TIER = window.PFLoyalty;

function goTIER(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

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
        <button key={item.label} className="adl-navitem" type="button" onClick={() => goTIER(item.href)}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
          {item.chevron && (<><span className="adl-spacer" /><iconify-icon icon="lucide:chevron-down" class="adl-chev"></iconify-icon></>)}
        </button>
      ))}
      <div className="adl-navgroup-label">Loyalty &amp; Gamification</div>
      <button className={"adl-navitem" + (activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goTIER("AdminActionsEditor.html")}>
        <iconify-icon icon="lucide:trophy"></iconify-icon>
        <span>Loyalty &amp; Gamification</span>
      </button>
      <div className="adl-subnav">
        {ADL_LOYALTY_SUBNAV.map((s) => (
          <button key={s.key} className={"adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goTIER(s.href)}>
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

function AdlToggle({ on, onToggle, label }) {
  return (
    <button type="button" className={"adl-toggle" + (on ? " is-on" : "")} role="switch" aria-checked={on} aria-label={label} onClick={onToggle}>
      <span className="adl-toggle-knob" />
    </button>
  );
}

/* ------------------------------------------------------------- TIER view */
function TierGlobalCard({ multipliers, onChange }) {
  return (
    <div className="adl-card">
      <div className="adl-card-head">
        <div><span className="adl-card-title-text">Global Tier Defaults</span><div className="adl-card-sub">Applied to Base Points before anti-cheat validation. Membership tiers are billing-only — this is their sole effect on gamification.</div></div>
      </div>
      <div className="tier-global-grid">
        {PF_TIER.TIER_KEYS.map((tier) => (
          <div key={tier} className="tier-global-cell">
            <div className="tier-global-name">{tier}</div>
            <div className="tier-global-input-wrap">
              <input type="number" step="0.1" min="0" value={multipliers[tier]} onChange={(e) => onChange(tier, Number(e.target.value) || 0)} />
              <span>x</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TierOverridesTable({ actions, onToggleOverride, onSetOverride }) {
  return (
    <div className="adl-card" style={{ padding: 0 }}>
      <div className="adl-card-head" style={{ padding: "24px 24px 0", border: "none", marginBottom: 0 }}>
        <div><span className="adl-card-title-text">Per-Action Overrides</span><div className="adl-card-sub">Bypass the global default for a specific action + tier combination.</div></div>
      </div>
      <div className="adl-table" style={{ border: "none", borderRadius: 0, marginTop: 18 }}>
        <div className="adl-row-grid adl-thead" style={{ gridTemplateColumns: "1.6fr repeat(4, 1fr)" }}>
          <span className="adl-th">Action</span>
          {PF_TIER.TIER_KEYS.map((t) => <span key={t} className="adl-th">{t}</span>)}
        </div>
        {actions.map((a) => {
          const overrides = a.overrides || {};
          const hasAny = Object.keys(overrides).length > 0;
          return (
            <div key={a.id} className="adl-row-grid adl-trow" style={{ gridTemplateColumns: "1.6fr repeat(4, 1fr)" }}>
              <span className="adl-cell" style={{ fontWeight: 600 }}>{a.label}</span>
              {PF_TIER.TIER_KEYS.map((t) => (
                <span key={t} className="tier-override-cell">
                  {overrides[t] != null ? (
                    <input type="number" step="0.1" className="tier-override-input" value={overrides[t]}
                      onChange={(e) => onSetOverride(a.id, t, Number(e.target.value) || 0)} />
                  ) : (
                    <button type="button" className="tier-override-add" onClick={() => onToggleOverride(a.id, t, true)}>+ override</button>
                  )}
                  {overrides[t] != null && <button type="button" className="tier-override-remove" title="Remove override" onClick={() => onToggleOverride(a.id, t, false)}><iconify-icon icon="lucide:x"></iconify-icon></button>}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TierMultipliersView() {
  const [config, setConfig] = useStateTIER(() => PF_TIER.getConfig());
  const [toast, setToast] = useStateTIER(null);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const setGlobal = (tier, value) => {
    const next = PF_TIER.setTierMultipliers({ [tier]: value });
    setConfig(next);
  };

  const setOverride = (actionId, tier, on) => {
    const action = config.actions.find((a) => a.id === actionId);
    const overrides = { ...(action.overrides || {}) };
    if (on) overrides[tier] = config.tierMultipliers[tier];
    else delete overrides[tier];
    const next = PF_TIER.upsertAction({ id: actionId, overrides });
    setConfig(next);
  };

  const setOverrideValue = (actionId, tier, value) => {
    const action = config.actions.find((a) => a.id === actionId);
    const overrides = { ...(action.overrides || {}), [tier]: value };
    const next = PF_TIER.upsertAction({ id: actionId, overrides });
    setConfig(next);
  };

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>Tier Multipliers</h1><p>Configure the multipliers applied to Base Points by purchased membership tier.</p></div>
        <div className="adl-page-head-actions"><button className="adl-btn adl-btn-navy" type="button" onClick={() => flash("All changes save instantly.")}><iconify-icon icon="lucide:check"></iconify-icon>Changes save automatically</button></div>
      </div>
      {toast && <div className="adl-banner adl-banner-info"><iconify-icon icon="lucide:info"></iconify-icon><span>{toast}</span></div>}
      <TierGlobalCard multipliers={config.tierMultipliers} onChange={setGlobal} />
      <TierOverridesTable actions={config.actions} onToggleOverride={setOverride} onSetOverride={setOverrideValue} />
    </div>
  );
}

function TierMultipliersApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey="tiers" />
      <main className="adl-main">
        <AdlHeader title="Loyalty &amp; Gamification — Tier Multipliers" />
        <TierMultipliersView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<TierMultipliersApp />);
