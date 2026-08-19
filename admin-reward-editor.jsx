/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Reward Editor (Screen 3)
   Three tabs: Badges (Lifetime), Store Items (Spendable Credits), and
   Leaderboard Prizes. Backed by window.PFLoyalty so edits are immediately
   reflected in Badge Gallery / Rewards Store / Leaderboard on the Katy side.
   Classes prefixed rwd- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateRWD } = React;
const PF_RWD = window.PFLoyalty;

function goRWD(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

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
        <button key={item.label} className="adl-navitem" type="button" onClick={() => goRWD(item.href)}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
          {item.chevron && (<><span className="adl-spacer" /><iconify-icon icon="lucide:chevron-down" class="adl-chev"></iconify-icon></>)}
        </button>
      ))}
      <div className="adl-navgroup-label">Loyalty &amp; Gamification</div>
      <button className={"adl-navitem" + (activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goRWD("AdminActionsEditor.html")}>
        <iconify-icon icon="lucide:trophy"></iconify-icon>
        <span>Loyalty &amp; Gamification</span>
      </button>
      <div className="adl-subnav">
        {ADL_LOYALTY_SUBNAV.map((s) => (
          <button key={s.key} className={"adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goRWD(s.href)}>
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

/* ------------------------------------------------------------- RWD tabs */
const RWD_TABS = [
  { key: "badges", label: "Badges (Lifetime)" },
  { key: "store", label: "Store Items (Spendable Credits)" },
  { key: "leaderboard", label: "Leaderboard Prizes" }
];

function BadgesTab({ config, onUpdateLevel, onUpdateAchievement }) {
  return (
    <div className="rwd-stack">
      <div className="adl-card">
        <div className="adl-card-head"><span className="adl-card-title-text">Level Badges — Lifetime Points milestones</span></div>
        <div className="rwd-level-grid">
          {config.levelBadges.map((b) => (
            <div key={b.key} className="rwd-level-card">
              <span className="rwd-level-swatch" style={{ background: b.color }} />
              <input className="rwd-level-name" value={b.name} onChange={(e) => onUpdateLevel(b.key, { name: e.target.value })} />
              <div className="rwd-level-threshold"><input type="number" value={b.threshold} onChange={(e) => onUpdateLevel(b.key, { threshold: Number(e.target.value) || 0 })} /><span>pts</span></div>
              {b.splashTitle != null && <div className="adl-field-hint">Milestone splash: “{b.splashTitle}”</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="adl-card">
        <div className="adl-card-head"><span className="adl-card-title-text">Collectible Achievement Badges</span></div>
        <div className="rwd-achievement-list">
          {config.achievementBadges.map((b) => (
            <div key={b.key} className="rwd-achievement-row">
              <span className="rwd-achievement-icon"><iconify-icon icon={b.icon}></iconify-icon></span>
              <div className="rwd-achievement-main">
                <input className="rwd-achievement-name" value={b.name} onChange={(e) => onUpdateAchievement(b.key, { name: e.target.value })} />
                <textarea className="rwd-achievement-desc" value={b.description} onChange={(e) => onUpdateAchievement(b.key, { description: e.target.value })} />
                <div className="rwd-achievement-reward-row">
                  <label>Linked reward / perk</label>
                  <input value={b.reward} onChange={(e) => onUpdateAchievement(b.key, { reward: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoreTab({ items, onUpdate, onAdd, onRemove }) {
  return (
    <div className="adl-card" style={{ padding: 0 }}>
      <div className="adl-card-head" style={{ padding: "24px 24px 0", border: "none" }}>
        <div><span className="adl-card-title-text">Store Items</span><div className="adl-card-sub">Special redeemable items priced in Spendable Credits.</div></div>
        <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={onAdd}><iconify-icon icon="lucide:plus"></iconify-icon>Add Item</button>
      </div>
      <div className="rwd-store-list">
        {items.map((it) => (
          <div key={it.id} className="rwd-store-row">
            <div className="adl-field"><label>Name</label><input value={it.name} onChange={(e) => onUpdate(it.id, { name: e.target.value })} /></div>
            <div className="adl-field"><label>Category</label><input value={it.category} onChange={(e) => onUpdate(it.id, { category: e.target.value })} /></div>
            <div className="adl-field"><label>Credit Cost</label><input type="number" value={it.cost} onChange={(e) => onUpdate(it.id, { cost: Number(e.target.value) || 0 })} /></div>
            <div className="adl-field"><label>Inventory</label><input type="number" placeholder="Unlimited" value={it.inventory ?? ""} onChange={(e) => onUpdate(it.id, { inventory: e.target.value === "" ? null : Number(e.target.value) })} /></div>
            <div className="adl-field"><label>Delivery Method</label><input value={it.delivery} onChange={(e) => onUpdate(it.id, { delivery: e.target.value })} /></div>
            <button className="adl-btn adl-btn-danger adl-btn-sm rwd-remove-btn" type="button" onClick={() => onRemove(it.id)}><iconify-icon icon="lucide:trash-2"></iconify-icon></button>
            <div className="adl-field rwd-desc-field"><label>Description</label><textarea value={it.description} onChange={(e) => onUpdate(it.id, { description: e.target.value })} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardTab({ prizes, onUpdate, onAdd, onRemove }) {
  return (
    <div className="adl-card">
      <div className="adl-card-head">
        <div><span className="adl-card-title-text">Rolling 30-Day Leaderboard Prizes</span></div>
        <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={onAdd}><iconify-icon icon="lucide:plus"></iconify-icon>Add Prize Tier</button>
      </div>
      <div className="rwd-prize-list">
        {prizes.map((p, i) => (
          <div key={i} className="rwd-prize-row">
            <div className="adl-field" style={{ maxWidth: 120 }}><label>Rank</label><input value={p.rank} onChange={(e) => onUpdate(i, { rank: e.target.value })} /></div>
            <div className="adl-field" style={{ flex: 1 }}><label>Prize</label><input value={p.prize} onChange={(e) => onUpdate(i, { prize: e.target.value })} /></div>
            <button className="adl-btn adl-btn-danger adl-btn-sm" type="button" onClick={() => onRemove(i)}><iconify-icon icon="lucide:trash-2"></iconify-icon></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardEditorView() {
  const [config, setConfig] = useStateRWD(() => PF_RWD.getConfig());
  const [tab, setTab] = useStateRWD("badges");

  const updateLevel = (key, patch) => {
    const list = config.levelBadges.map((b) => (b.key === key ? { ...b, ...patch } : b));
    setConfig(PF_RWD.setLevelBadges(list));
  };
  const updateAchievement = (key, patch) => {
    const list = config.achievementBadges.map((b) => (b.key === key ? { ...b, ...patch } : b));
    setConfig(PF_RWD.setAchievementBadges(list));
  };
  const updateItem = (id, patch) => setConfig(PF_RWD.upsertStoreItem({ id, ...patch }));
  const addItem = () => {
    const id = "item_" + Math.random().toString(36).slice(2, 7);
    setConfig(PF_RWD.upsertStoreItem({ id, name: "New Reward Item", description: "", category: "Vouchers", cost: 500, inventory: null, delivery: "Email code" }));
  };
  const removeItem = (id) => setConfig(PF_RWD.setStoreItems(config.storeItems.filter((i) => i.id !== id)));

  const updatePrize = (idx, patch) => {
    const list = config.leaderboardPrizes.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    setConfig(PF_RWD.setLeaderboardPrizes(list));
  };
  const addPrize = () => setConfig(PF_RWD.setLeaderboardPrizes(config.leaderboardPrizes.concat([{ rank: "16–30", prize: "New prize tier" }])));
  const removePrize = (idx) => setConfig(PF_RWD.setLeaderboardPrizes(config.leaderboardPrizes.filter((_, i) => i !== idx)));

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>Reward Editor</h1><p>Configure Badges, Store Items and Leaderboard Prizes.</p></div>
      </div>
      <div className="adl-tabs">
        {RWD_TABS.map((t) => (
          <button key={t.key} type="button" className={"adl-tab-btn" + (tab === t.key ? " is-active" : "")} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>
      {tab === "badges" && <BadgesTab config={config} onUpdateLevel={updateLevel} onUpdateAchievement={updateAchievement} />}
      {tab === "store" && <StoreTab items={config.storeItems} onUpdate={updateItem} onAdd={addItem} onRemove={removeItem} />}
      {tab === "leaderboard" && <LeaderboardTab prizes={config.leaderboardPrizes} onUpdate={updatePrize} onAdd={addPrize} onRemove={removePrize} />}
    </div>
  );
}

function RewardEditorApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey="rewards" />
      <main className="adl-main">
        <AdlHeader title="Loyalty &amp; Gamification — Reward Editor" />
        <RewardEditorView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<RewardEditorApp />);
