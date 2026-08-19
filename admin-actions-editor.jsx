/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Actions Editor (Screen 1)
   Desktop admin console. Manages the catalog of scoreable events: general
   settings, conditions & filters, caps & velocity, guardrails & security,
   and linked reward configuration. Backed by window.PFLoyalty (see
   loyalty-engine.js) so edits are reflected immediately in Ways to Earn,
   Tier Multipliers overrides, and the Audit Ledger on the Katy side.
   Classes prefixed act- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateACT, useMemo: useMemoACT } = React;
const PF_ACT = window.PFLoyalty;

function goACT(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const CATEGORIES_ACT = ["Onboarding", "Profile", "Reviews", "Community", "Social", "Learning", "Habit", "Purchases"];
const PLATFORMS_ACT = [
  { key: "web", label: "Web UI" },
  { key: "ios", label: "iOS App" },
  { key: "android", label: "Android App" },
  { key: "pos", label: "In-Store POS" }
];

/* ---------------------------------------------------------- shared chrome */
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
        <button key={item.label} className="adl-navitem" type="button" onClick={() => goACT(item.href)}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
          {item.chevron && (<><span className="adl-spacer" /><iconify-icon icon="lucide:chevron-down" class="adl-chev"></iconify-icon></>)}
        </button>
      ))}
      <div className="adl-navgroup-label">Loyalty &amp; Gamification</div>
      <button className={"adl-navitem" + (activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goACT("AdminActionsEditor.html")}>
        <iconify-icon icon="lucide:trophy"></iconify-icon>
        <span>Loyalty &amp; Gamification</span>
      </button>
      <div className="adl-subnav">
        {ADL_LOYALTY_SUBNAV.map((s) => (
          <button key={s.key} className={"adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goACT(s.href)}>
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

/* -------------------------------------------------------------- ACT view */
function ActList({ actions, selectedId, onSelect, search, setSearch }) {
  return (
    <div className="act-list-col">
      <div className="act-search-wrap"><iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Search actions..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="act-list">
        {actions.map((a) => (
          <button key={a.id} type="button" className={"act-list-row" + (a.id === selectedId ? " is-active" : "")} onClick={() => onSelect(a.id)}>
            <span className="act-list-row-main">
              <span className="act-list-row-name">{a.label}</span>
              <span className="act-list-row-meta">{a.category} · {a.basePoints} pts</span>
            </span>
            <span className={"act-dot" + (a.active ? " on" : "")} title={a.active ? "Active" : "Disabled"} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ActEditor({ action, achievementBadges, onChange, onSave, onNew }) {
  if (!action) return (
    <div className="adl-card act-empty"><iconify-icon icon="lucide:mouse-pointer-click"></iconify-icon><p>Select an action on the left to edit it, or create a new one.</p></div>
  );
  const set = (patch) => onChange({ ...action, ...patch });
  const togglePlatform = (key) => {
    const has = action.platforms.includes(key);
    set({ platforms: has ? action.platforms.filter((p) => p !== key) : action.platforms.concat([key]) });
  };
  return (
    <div className="act-editor">
      <div className="act-editor-head">
        <div>
          <h1>Edit Action: {action.label || "Untitled Action"}</h1>
          <p className="act-editor-key">Internal Key / Event ID: <code>{action.id}</code>{!action.isNew && " (immutable)"}</p>
        </div>
        <div className="adl-page-head-actions">
          <button className="adl-btn adl-btn-ghost" type="button" onClick={onNew}><iconify-icon icon="lucide:plus"></iconify-icon>New Action</button>
          <button className="adl-btn adl-btn-navy" type="button" onClick={onSave}><iconify-icon icon="lucide:save"></iconify-icon>Save Changes</button>
        </div>
      </div>

      <div className="adl-card">
        <div className="adl-card-head"><span className="adl-card-title-text">General Settings</span></div>
        <div className="adl-field-row">
          <div className="adl-field"><label>Action Name</label><input type="text" value={action.label} onChange={(e) => set({ label: e.target.value })} /></div>
          <div className="adl-field"><label>Category</label>
            <select value={action.category} onChange={(e) => set({ category: e.target.value })}>
              {CATEGORIES_ACT.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="adl-field-row" style={{ marginTop: 16 }}>
          <div className="adl-field"><label>Base Points Granted</label><input type="number" value={action.basePoints} onChange={(e) => set({ basePoints: Number(e.target.value) || 0 })} /></div>
          <div className="adl-toggle-row" style={{ borderBottom: "none", paddingTop: 28 }}>
            <div><div className="adl-toggle-row-label">Active</div><div className="adl-toggle-row-sub">Toggle this action on/off across the platform</div></div>
            <AdlToggle on={action.active} onToggle={() => set({ active: !action.active })} label="Active" />
          </div>
        </div>
      </div>

      <div className="adl-card">
        <div className="adl-card-head"><span className="adl-card-title-text">Conditions &amp; Filters</span></div>
        <div className="act-platform-row">
          {PLATFORMS_ACT.map((p) => (
            <label key={p.key} className={"act-platform-chip" + (action.platforms.includes(p.key) ? " is-on" : "")}>
              <input type="checkbox" checked={action.platforms.includes(p.key)} onChange={() => togglePlatform(p.key)} />
              {p.label}
            </label>
          ))}
        </div>
        <div className="adl-field-row" style={{ marginTop: 16 }}>
          <div className="adl-field"><label>Minimum Character Length</label><input type="number" value={action.minCharacters} onChange={(e) => set({ minCharacters: Number(e.target.value) || 0 })} />
            <span className="adl-field-hint">Filters short spam comments/bios.</span></div>
          <div className="adl-toggle-row" style={{ borderBottom: "none", paddingTop: 28 }}>
            <div><div className="adl-toggle-row-label">Requires Media Upload</div></div>
            <AdlToggle on={action.requiresMedia} onToggle={() => set({ requiresMedia: !action.requiresMedia })} label="Requires media" />
          </div>
        </div>
      </div>

      <div className="adl-card">
        <div className="adl-card-head"><span className="adl-card-title-text">Caps &amp; Velocity</span></div>
        <div className="adl-field-row-3">
          <div className="adl-field"><label>Daily Cap</label><input type="number" placeholder="Unlimited" value={action.dailyCap ?? ""} onChange={(e) => set({ dailyCap: e.target.value === "" ? null : Number(e.target.value) })} /></div>
          <div className="adl-field"><label>Weekly Cap</label><input type="number" placeholder="Unlimited" value={action.weeklyCap ?? ""} onChange={(e) => set({ weeklyCap: e.target.value === "" ? null : Number(e.target.value) })} /></div>
          <div className="adl-field"><label>Lifetime Cap</label><input type="number" placeholder="Unlimited" value={action.lifetimeCap ?? ""} onChange={(e) => set({ lifetimeCap: e.target.value === "" ? null : Number(e.target.value) })} /></div>
        </div>
        <div className="adl-field-row" style={{ marginTop: 16 }}>
          <div className="adl-field"><label>Velocity Rule (seconds between completions)</label><input type="number" value={action.velocitySeconds} onChange={(e) => set({ velocitySeconds: Number(e.target.value) || 0 })} />
            <span className="adl-field-hint">e.g. 3 = max 1 per 3 seconds, 120 = 2-minute cooldown.</span></div>
          <div className="adl-toggle-row" style={{ borderBottom: "none", paddingTop: 28 }}>
            <div><div className="adl-toggle-row-label">One-Time Lifetime Lock</div><div className="adl-toggle-row-sub">Repeat edits record a 0-point delta.</div></div>
            <AdlToggle on={action.oneTimeLock} onToggle={() => set({ oneTimeLock: !action.oneTimeLock })} label="One-time lock" />
          </div>
        </div>
      </div>

      <div className="adl-card">
        <div className="adl-card-head"><span className="adl-card-title-text">Guardrails &amp; Security</span></div>
        <div className="adl-toggle-row">
          <div><div className="adl-toggle-row-label">Require Manual Approval</div><div className="adl-toggle-row-sub">Holds points until an admin authorizes the transaction.</div></div>
          <AdlToggle on={action.requiresApproval} onToggle={() => set({ requiresApproval: !action.requiresApproval })} label="Requires approval" />
        </div>
        <div className="adl-field" style={{ marginTop: 16, maxWidth: 260 }}>
          <label>Points Hold Buffer (days)</label>
          <input type="number" value={action.holdDays} onChange={(e) => set({ holdDays: Number(e.target.value) || 0 })} />
        </div>
        <div className="adl-field" style={{ marginTop: 16 }}>
          <label>Guardrail Note (internal)</label>
          <textarea value={action.guardrail} onChange={(e) => set({ guardrail: e.target.value })} />
        </div>
      </div>

      <div className="adl-card">
        <div className="adl-card-head"><span className="adl-card-title-text">Linked Reward Configuration</span></div>
        <div className="adl-field" style={{ maxWidth: 380 }}>
          <label>Auto-trigger badge on completion (optional)</label>
          <select value={action.linkedReward || ""} onChange={(e) => set({ linkedReward: e.target.value || null })}>
            <option value="">No linked reward</option>
            {achievementBadges.map((b) => <option key={b.key} value={"badge:" + b.key}>{b.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function ActionsEditorView() {
  const [config, setConfig] = useStateACT(() => PF_ACT.getConfig());
  const [selectedId, setSelectedId] = useStateACT(() => config.actions[0].id);
  const [draft, setDraft] = useStateACT(() => ({ ...config.actions[0] }));
  const [search, setSearch] = useStateACT("");
  const [toast, setToast] = useStateACT(null);

  const filtered = useMemoACT(() => {
    const q = search.trim().toLowerCase();
    if (!q) return config.actions;
    return config.actions.filter((a) => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [config, search]);

  const select = (id) => { setSelectedId(id); setDraft({ ...config.actions.find((a) => a.id === id) }); };
  const save = () => {
    const next = PF_ACT.upsertAction(draft);
    setConfig(next);
    setToast("Saved “" + draft.label + "”.");
    setTimeout(() => setToast(null), 2400);
  };
  const createNew = () => {
    const id = "evt_new_" + Math.random().toString(36).slice(2, 7);
    const blank = { id, label: "New Action", category: "Community", basePoints: 50, dailyCap: null, weeklyCap: null, lifetimeCap: null, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "", linkedReward: null, isNew: true };
    setSelectedId(id); setDraft(blank);
  };

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>Actions Editor</h1><p>Create and edit the catalog of trackable, point-earning events.</p></div>
      </div>
      {toast && <div className="adl-banner adl-banner-info"><iconify-icon icon="lucide:check-circle"></iconify-icon><span>{toast}</span></div>}
      <div className="act-grid">
        <ActList actions={filtered} selectedId={selectedId} onSelect={select} search={search} setSearch={setSearch} />
        <ActEditor action={draft} achievementBadges={config.achievementBadges} onChange={setDraft} onSave={save} onNew={createNew} />
      </div>
    </div>
  );
}

function ActionsEditorApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey="actions" />
      <main className="adl-main">
        <AdlHeader title="Loyalty &amp; Gamification — Actions Editor" />
        <ActionsEditorView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ActionsEditorApp />);
