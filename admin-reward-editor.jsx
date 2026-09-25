/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Reward Editor (Screen 3)
   Four tabs: Badges (Lifetime), Store Items (Spendable Credits), Leaderboard
   Prizes and the Milestone Path. Backed by window.PFLoyalty so edits are
   immediately reflected in Badge Gallery / Rewards Store / Leaderboard /
   Milestone Path on the Katy side.
   Classes prefixed rwd- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateRWD, useRef: useRefRWD, useEffect: useEffectRWD } = React;
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
  { icon: "lucide:badge-check", label: "Badges", href: "AdminBadges.html" },
  { icon: "lucide:clipboard-list", label: "Quizzes & Surveys", href: "AdminQuizEditor.html" },
  { icon: "lucide:receipt-text", label: "Transactions", href: "AdminTransactions.html", chevron: true },
  { icon: "lucide:table-2", label: "Courses", href: "AdminCourses.html", chevron: true },
  { icon: "lucide:users", label: "Community", href: "AdminCommunity.html", chevron: true }
];
const ADL_LOYALTY_SUBNAV = [
  { key: "actions", label: "Ways to Earn", href: "AdminActionsEditor.html" },
  { key: "tiers", label: "Tier Multipliers", href: "AdminTierMultipliers.html" },
  { key: "rewards", label: "Reward Editor", href: "AdminRewardEditor.html" },
  { key: "ledger", label: "Points Ledger", href: "AdminAuditLedger.html" },
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
  { key: "badges", label: "Badges" },
  { key: "store", label: "Store Items (Spendable Credits)" },
  { key: "leaderboard", label: "Leaderboard Prizes" },
  { key: "milestones", label: "Milestone Path" }
];
function rwdInitialTab() {
  try {
    const t = new URLSearchParams(window.location.search).get("tab");
    return RWD_TABS.some((x) => x.key === t) ? t : "badges";
  } catch (e) { return "badges"; }
}


/* ------------------------------------------------------ League badges
   The six gem badges members earn on mobile (league-engine.js, lowest →
   highest: Jade, Topaz, Ruby, Emerald, Amethyst, Sapphire). Same animated
   Lottie files as the Leaderboard rail; every gem plays so the admin can see
   exactly what the member sees. */
const RWD_LEAGUES = (window.PFLeague && window.PFLeague.getLeagues()) || [];

function RWDLottie({ src, size, play = true }) {
  const host = useRefRWD(null);
  const animRef = useRefRWD(null);
  useEffectRWD(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: false, path: src });
      animRef.current = anim;
      anim.addEventListener("DOMLoaded", () => {
        if (!animRef.current) return;
        if (play) anim.play(); else anim.goToAndStop(Math.floor(anim.totalFrames * 0.4), true);
      });
    };
    if (window.lottie) start();
    else {
      t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120);
      setTimeout(() => clearInterval(t), 8000);
    }
    return () => { clearInterval(t); animRef.current = null; if (anim) anim.destroy(); };
  }, [src]);
  return <span ref={host} style={{ display: "block", width: size, height: size }} />;
}

function rwdRankLabel(i, n) {
  if (i === 0) return "Lowest";
  if (i === n - 1) return "Highest";
  return "Rank " + (i + 1);
}

function LeagueBadgesCard() {
  if (!RWD_LEAGUES.length) return null;
  return (
    <div className="adl-card">
      <div className="adl-card-head">
        <div>
          <span className="adl-card-title-text">League Badges — earned with Lifetime Points</span>
          <div className="adl-card-sub">The six animated gem badges members see on the Leaderboard and Rewards pages, lowest to highest. Each league is a stop on the Milestone Path: it unlocks the moment a member’s Lifetime Points reach that milestone’s threshold, and the benefits listed there unlock with it. Edit the thresholds in the Milestone Path tab.</div>
        </div>
      </div>
      <div className="rwd-league-grid">
        {RWD_LEAGUES.map((l, i) => (
          <div key={l.key} className="rwd-league-card" style={{ "--lg-accent": l.accent, "--lg-deep": l.deep, "--lg-soft": l.soft }}>
            <span className="rwd-league-rank">{rwdRankLabel(i, RWD_LEAGUES.length)}</span>
            <span className="rwd-league-gem"><RWDLottie src={l.lottie} size={96} /></span>
            <span className="rwd-league-name">{l.name}</span>
            <span className="rwd-league-req">{l.requires === 0 ? "Starting league" : rwdFormat(l.requires) + " pts"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BadgesTab({ config, onUpdateAchievement }) {
  return (
    <div className="rwd-stack">
      <LeagueBadgesCard />
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

const RWD_CATEGORY_ICONS = {
  Signature: "lucide:sparkles",
  Experiences: "lucide:calendar",
  Clinical: "lucide:stethoscope",
  Vouchers: "lucide:ticket",
  Merch: "lucide:shirt"
};
function rwdCategoryIcon(category) { return RWD_CATEGORY_ICONS[category] || "lucide:gift"; }

function StoreTab({ items, onUpdate, onAdd, onRemove }) {
  return (
    <div className="adl-card" style={{ padding: 0 }}>
      <div className="adl-card-head" style={{ padding: "24px 24px 0", border: "none" }}>
        <div><span className="adl-card-title-text">Store Items</span><div className="adl-card-sub">Special redeemable items priced in Spendable Credits.</div></div>
        <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={onAdd}><iconify-icon icon="lucide:plus"></iconify-icon>Add Item</button>
      </div>
      <div className="rwd-store-list">
        {items.map((it) => (
          <div key={it.id} className="rwd-store-card">
            <div className="rwd-store-card-head">
              <span className="rwd-store-icon"><iconify-icon icon={rwdCategoryIcon(it.category)}></iconify-icon></span>
              <input className="rwd-store-name" value={it.name} placeholder="Item name" onChange={(e) => onUpdate(it.id, { name: e.target.value })} />
              <span className="rwd-store-cost-pill">
                <iconify-icon icon="lucide:coins"></iconify-icon>
                <input type="number" value={it.cost} onChange={(e) => onUpdate(it.id, { cost: Number(e.target.value) || 0 })} />
                <span>credits</span>
              </span>
              <button className="adl-btn adl-btn-danger adl-btn-sm rwd-remove-btn" type="button" onClick={() => onRemove(it.id)} aria-label={"Remove " + it.name}><iconify-icon icon="lucide:trash-2"></iconify-icon></button>
            </div>
            <div className="rwd-store-fields">
              <div className="adl-field">
                <label>Category</label>
                <div className="rwd-input-icon">
                  <iconify-icon icon="lucide:tag"></iconify-icon>
                  <input value={it.category} onChange={(e) => onUpdate(it.id, { category: e.target.value })} />
                </div>
              </div>
              <div className="adl-field">
                <label>Inventory</label>
                <div className="rwd-input-icon">
                  <iconify-icon icon="lucide:package"></iconify-icon>
                  <input type="number" placeholder="Unlimited" value={it.inventory ?? ""} onChange={(e) => onUpdate(it.id, { inventory: e.target.value === "" ? null : Number(e.target.value) })} />
                </div>
              </div>
              <div className="adl-field">
                <label>Delivery Method</label>
                <div className="rwd-input-icon">
                  <iconify-icon icon="lucide:truck"></iconify-icon>
                  <input value={it.delivery} onChange={(e) => onUpdate(it.id, { delivery: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="adl-field"><label>Description</label><textarea value={it.description} onChange={(e) => onUpdate(it.id, { description: e.target.value })} /></div>
          </div>
        ))}
        {items.length === 0 && <p className="adl-cell-muted rwd-empty">No store items yet — add one above.</p>}
      </div>
    </div>
  );
}

const RWD_MEDAL_STYLES = [
  { background: "linear-gradient(135deg, #f7d774, #c9962b)", color: "#5b3d00" },
  { background: "linear-gradient(135deg, #e2e6ea, #adb5bd)", color: "#3a3f44" },
  { background: "linear-gradient(135deg, #e3ac7b, #a9673a)", color: "#4a2a10" }
];

function LeaderboardTab({ prizes, onUpdate, onAdd, onRemove }) {
  return (
    <div className="adl-card" style={{ padding: 0 }}>
      <div className="adl-card-head" style={{ padding: "24px 24px 0", border: "none" }}>
        <div><span className="adl-card-title-text">Rolling 30-Day Leaderboard Prizes</span><div className="adl-card-sub">Prize tiers awarded to the top point-earners each rolling 30-day period.</div></div>
        <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={onAdd}><iconify-icon icon="lucide:plus"></iconify-icon>Add Prize Tier</button>
      </div>
      <div className="rwd-prize-list">
        {prizes.map((p, i) => (
          <div key={i} className="rwd-prize-row">
            <span className="rwd-prize-medal" style={RWD_MEDAL_STYLES[i]}>
              <iconify-icon icon={i < 3 ? "lucide:trophy" : "lucide:award"}></iconify-icon>
            </span>
            <div className="adl-field rwd-prize-rank">
              <label>Rank</label>
              <div className="rwd-input-icon">
                <iconify-icon icon="lucide:hash"></iconify-icon>
                <input value={p.rank} placeholder="e.g. 4–15" onChange={(e) => onUpdate(i, { rank: e.target.value })} />
              </div>
            </div>
            <div className="adl-field rwd-prize-prize">
              <label>Prize</label>
              <div className="rwd-input-icon">
                <iconify-icon icon="lucide:gift"></iconify-icon>
                <input value={p.prize} placeholder="Prize description" onChange={(e) => onUpdate(i, { prize: e.target.value })} />
              </div>
            </div>
            <button className="adl-btn adl-btn-danger adl-btn-sm" type="button" onClick={() => onRemove(i)} aria-label={"Remove rank " + p.rank}><iconify-icon icon="lucide:trash-2"></iconify-icon></button>
          </div>
        ))}
        {prizes.length === 0 && <p className="adl-cell-muted rwd-empty">No prize tiers yet — add one above.</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ Milestone Path tab
   One linear ladder walked along the same Lifetime Points balance as the
   Level Badges. Each milestone carries a bundle of benefits that unlock
   automatically and permanently when the threshold is crossed — so there is
   no cost/inventory here, only title / description / delivery per benefit. */
function rwdFormat(n) { return (Number(n) || 0).toLocaleString("en-GB"); }

function MilestoneBenefitRow({ benefit, index, onUpdate, onRemove, canRemove }) {
  return (
    <div className="rwd-mp-benefit">
      <span className="rwd-mp-benefit-idx"><iconify-icon icon="lucide:gift"></iconify-icon></span>
      <div className="rwd-mp-benefit-fields">
        <div className="adl-field">
          <label>Benefit title</label>
          <input value={benefit.title} placeholder="e.g. Course Credit — up to £250" onChange={(e) => onUpdate({ title: e.target.value })} />
        </div>
        <div className="adl-field">
          <label>Delivery</label>
          <div className="rwd-input-icon">
            <iconify-icon icon="lucide:truck"></iconify-icon>
            <input value={benefit.delivery || ""} placeholder="e.g. Voucher code, redeemable at checkout" onChange={(e) => onUpdate({ delivery: e.target.value })} />
          </div>
        </div>
        <div className="adl-field rwd-mp-benefit-desc">
          <label>Description</label>
          <textarea value={benefit.description || ""} placeholder="What the member gets, in one or two sentences." onChange={(e) => onUpdate({ description: e.target.value })} />
        </div>
      </div>
      <button className="adl-btn adl-btn-danger adl-btn-sm rwd-remove-btn" type="button" disabled={!canRemove} title={canRemove ? "Remove benefit" : "A milestone needs at least one benefit"} onClick={onRemove} aria-label={"Remove benefit " + (index + 1)}>
        <iconify-icon icon="lucide:trash-2"></iconify-icon>
      </button>
    </div>
  );
}

function MilestoneTab({ path, levelBadges, onUpdate, onAdd, onRemove }) {
  const sorted = path.slice().sort((a, b) => a.threshold - b.threshold);
  const maxLevel = levelBadges.reduce((m, b) => Math.max(m, b.threshold || 0), 0);
  const updateBenefit = (m, idx, patch) => onUpdate(m.key, { benefits: m.benefits.map((b, i) => (i === idx ? { ...b, ...patch } : b)) });
  const addBenefit = (m) => onUpdate(m.key, { benefits: (m.benefits || []).concat([{ title: "", description: "", delivery: "" }]) });
  const removeBenefit = (m, idx) => onUpdate(m.key, { benefits: m.benefits.filter((_, i) => i !== idx) });

  return (
    <div className="rwd-stack">
      <div className="adl-card rwd-mp-ladder-card">
        <div className="adl-card-head" style={{ border: "none", padding: 0, marginBottom: 14 }}>
          <div><span className="adl-card-title-text">Ladder preview</span><div className="adl-card-sub">Same Lifetime Points balance as Level Badges (top Level Badge sits at {rwdFormat(maxLevel)} pts). Points are never spent, so a reached milestone never locks again.</div></div>
        </div>
        <div className="rwd-mp-ladder">
          {sorted.map((m, i) => (
            <div key={m.key} className="rwd-mp-ladder-node">
              <span className="rwd-mp-ladder-dot">{i + 1}</span>
              <span className="rwd-mp-ladder-name">{m.name || "Untitled"}</span>
              <span className="rwd-mp-ladder-pts">{rwdFormat(m.threshold)} pts</span>
              <span className="rwd-mp-ladder-count">{(m.benefits || []).length} benefit{(m.benefits || []).length === 1 ? "" : "s"}</span>
            </div>
          ))}
          {sorted.length === 0 && <p className="adl-cell-muted rwd-empty">No milestones yet.</p>}
        </div>
      </div>

      <div className="adl-card" style={{ padding: 0 }}>
        <div className="adl-card-head" style={{ padding: "24px 24px 0", border: "none" }}>
          <div><span className="adl-card-title-text">Milestones</span><div className="adl-card-sub">Every benefit in a bundle unlocks automatically the instant a member’s Lifetime Points reach the threshold. Milestones are listed in threshold order on the member’s Milestone Path page.</div></div>
          <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={onAdd}><iconify-icon icon="lucide:plus"></iconify-icon>Add Milestone</button>
        </div>
        <div className="rwd-store-list">
          {sorted.map((m, i) => {
            const prev = sorted[i - 1];
            const outOfOrder = prev && prev.threshold === m.threshold;
            return (
              <div key={m.key} className="rwd-store-card rwd-mp-card">
                <div className="rwd-store-card-head">
                  <span className="rwd-mp-step">{i + 1}</span>
                  <input className="rwd-store-name" value={m.name} placeholder="Milestone name" onChange={(e) => onUpdate(m.key, { name: e.target.value })} />
                  <span className="rwd-store-cost-pill rwd-mp-pill">
                    <iconify-icon icon="lucide:star"></iconify-icon>
                    <input type="number" min="0" step="100" value={m.threshold} onChange={(e) => onUpdate(m.key, { threshold: Math.max(0, Number(e.target.value) || 0) })} />
                    <span>pts</span>
                  </span>
                  <button className="adl-btn adl-btn-danger adl-btn-sm rwd-remove-btn" type="button" onClick={() => onRemove(m.key)} aria-label={"Remove " + m.name}><iconify-icon icon="lucide:trash-2"></iconify-icon></button>
                </div>
                <div className="rwd-mp-meta">
                  <span className="adl-field-hint">Key: <code>{m.key}</code> (immutable)</span>
                  {outOfOrder && <span className="rwd-mp-warn"><iconify-icon icon="lucide:triangle-alert"></iconify-icon>Same threshold as “{prev.name}” — members would unlock both at once.</span>}
                </div>
                <div className="rwd-mp-benefits">
                  <div className="rwd-mp-benefits-head">
                    <span>Benefit bundle</span>
                    <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => addBenefit(m)}><iconify-icon icon="lucide:plus"></iconify-icon>Add Benefit</button>
                  </div>
                  {(m.benefits || []).map((b, bi) => (
                    <MilestoneBenefitRow key={bi} benefit={b} index={bi} canRemove={m.benefits.length > 1}
                      onUpdate={(patch) => updateBenefit(m, bi, patch)} onRemove={() => removeBenefit(m, bi)} />
                  ))}
                  {(m.benefits || []).length === 0 && <p className="adl-cell-muted rwd-empty">No benefits — add at least one so the milestone has something to unlock.</p>}
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && <p className="adl-cell-muted rwd-empty">No milestones yet — add one above.</p>}
        </div>
      </div>
    </div>
  );
}

function RewardEditorView() {
  const [config, setConfig] = useStateRWD(() => PF_RWD.getConfig());
  const [tab, setTab] = useStateRWD(rwdInitialTab);

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

  const milestonePath = config.milestonePath || [];
  const updateMilestone = (key, patch) => setConfig(PF_RWD.upsertMilestone({ key, ...patch }));
  const addMilestone = () => {
    const key = "ms_" + Math.random().toString(36).slice(2, 7);
    const top = milestonePath.reduce((m, x) => Math.max(m, x.threshold || 0), 0);
    setConfig(PF_RWD.upsertMilestone({ key, name: "New Milestone", threshold: top + 10000, benefits: [{ title: "", description: "", delivery: "" }] }));
  };
  const removeMilestone = (key) => setConfig(PF_RWD.setMilestonePath(milestonePath.filter((m) => m.key !== key)));

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>Reward Editor</h1><p>Configure Badges, Store Items, Leaderboard Prizes and the Milestone Path.</p></div>
      </div>
      <div className="adl-tabs">
        {RWD_TABS.map((t) => (
          <button key={t.key} type="button" className={"adl-tab-btn" + (tab === t.key ? " is-active" : "")} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>
      {tab === "badges" && <BadgesTab config={config} onUpdateAchievement={updateAchievement} />}
      {tab === "store" && <StoreTab items={config.storeItems} onUpdate={updateItem} onAdd={addItem} onRemove={removeItem} />}
      {tab === "leaderboard" && <LeaderboardTab prizes={config.leaderboardPrizes} onUpdate={updatePrize} onAdd={addPrize} onRemove={removePrize} />}
      {tab === "milestones" && <MilestoneTab path={milestonePath} levelBadges={config.levelBadges} onUpdate={updateMilestone} onAdd={addMilestone} onRemove={removeMilestone} />}
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
