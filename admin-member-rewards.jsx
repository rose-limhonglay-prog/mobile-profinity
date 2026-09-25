/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Member Rewards Board.
   Read-only view of one member's rewards, opened from a user name on the
   Points Ledger or User Directory & Diagnostics. ?user=<email> picks the
   member, ?ret=<page> drives the back link. Katy Moore is live (PFLoyalty
   state); directory profiles get a deterministic sample board.
   Classes prefixed amr- to avoid clashes.
   =========================================================================== */
const { useState: useStateAMR, useMemo: useMemoAMR } = React;
const PF_AMR = window.PFLoyalty;
const LEAGUE_AMR = window.PFLeague || null;

function goAMR(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

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
        <button key={item.label} className="adl-navitem" type="button" onClick={() => goAMR(item.href)}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
          {item.chevron && (<><span className="adl-spacer" /><iconify-icon icon="lucide:chevron-down" class="adl-chev"></iconify-icon></>)}
        </button>
      ))}
      <div className="adl-navgroup-label">Loyalty &amp; Gamification</div>
      <button className={"adl-navitem" + (activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goAMR("AdminActionsEditor.html")}>
        <iconify-icon icon="lucide:trophy"></iconify-icon>
        <span>Loyalty &amp; Gamification</span>
      </button>
      <div className="adl-subnav">
        {ADL_LOYALTY_SUBNAV.map((s) => (
          <button key={s.key} className={"adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goAMR(s.href)}>
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


function fmtDateAMR(iso) { const d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
function initialsAMR(name) { return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(); }

/* deterministic pseudo-random per email so a mock board looks the same every visit */
function seededAMR(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }

const RET_LABELS_AMR = { "AdminAuditLedger.html": "Points Ledger", "AdminUserDiagnostics.html": "User Directory & Diagnostics", "AdminUsers.html": "Users" };

function buildBoardAMR(email) {
  const config = PF_AMR.getConfig();
  const live = PF_AMR.getState();
  const liveEmail = live.user.email;
  if (!email || email === liveEmail) {
    return {
      live: true, name: live.user.name + " Moore", email: liveEmail, tier: live.user.membershipTier,
      lifetimePoints: live.lifetimePoints, spendableCredits: live.spendableCredits, expiringCredits: live.expiringCredits || 0,
      weekPoints: PF_AMR.getWeekPoints(live), rolling30: live.rollingPoints30 || 0,
      streak: live.streak, unlockedAchievements: live.unlockedAchievements || [],
      redeemedVouchers: live.redeemedVouchers || [], ledger: live.ledger.slice(),
      badge: PF_AMR.getBadgeProgress(live), milestone: PF_AMR.getMilestoneProgress(live),
      league: LEAGUE_AMR ? LEAGUE_AMR.getCurrent() : null, config
    };
  }
  const p = PF_AMR.MOCK_DIRECTORY.find((u) => u.email === email);
  if (!p) return null;
  const rnd = seededAMR(email);
  const actions = config.actions.filter((a) => a.active && !a.requiresApproval);
  const ledger = [];
  let cursor = Date.now() - rnd() * 6 * 3600000;
  for (let i = 0; i < 12; i++) {
    const a = actions[Math.floor(rnd() * actions.length)];
    const mult = PF_AMR.tierMultiplierFor(a, p.membershipTier);
    const capped = rnd() < 0.1;
    const pts = capped ? 0 : Math.round(a.basePoints * mult);
    ledger.push({ id: "txn_" + email.slice(0, 3) + i, ts: new Date(cursor).toISOString(), actionId: a.id, label: a.label, pointsDelta: pts, creditsDelta: capped ? 0 : Math.round(pts * config.creditConversionRate), guardrailFlags: capped ? "CAP_REACHED" : null });
    cursor -= (6 + rnd() * 30) * 3600000;
  }
  const fake = { lifetimePoints: p.lifetimePoints };
  const ach = (config.achievementBadges || []).filter((b) => {
    if (b.criteria && b.criteria.type === "streak") return p.streakLongest >= b.criteria.count;
    if (b.criteria && b.criteria.type === "redeemCount") return p.lifetimePoints > 20000;
    return p.lifetimePoints > 500;
  }).map((b) => b.key);
  const weekPoints = ledger.filter((t) => Date.now() - new Date(t.ts).getTime() < 7 * 86400000).reduce((s, t) => s + t.pointsDelta, 0);
  const leagues = LEAGUE_AMR ? LEAGUE_AMR.getLeagues() : [];
  const league = leagues.length ? leagues[Math.min(leagues.length - 1, Math.floor(p.lifetimePoints / 9000))] : null;
  return {
    live: false, name: p.name, email: p.email, tier: p.membershipTier,
    lifetimePoints: p.lifetimePoints, spendableCredits: p.spendableCredits, expiringCredits: p.expiringCredits || 0,
    weekPoints, rolling30: Math.round(p.lifetimePoints * 0.12), streak: { current: p.streakCurrent, longest: p.streakLongest, frozen: false },
    unlockedAchievements: ach, redeemedVouchers: [], ledger,
    badge: PF_AMR.getBadgeProgress(fake), milestone: PF_AMR.getMilestoneProgress(fake), league, config
  };
}

/* ------------------------------------------------------------------ UI */
function AmrStat({ label, value, sub, tone, icon }) {
  return (
    <div className="adl-stat-card amr-stat">
      {icon && <span className="amr-stat-icon"><iconify-icon icon={icon}></iconify-icon></span>}
      <div className="adl-stat-body">
        <div className="adl-stat-label">{label}</div>
        <div className="adl-stat-value" style={tone ? { color: tone } : undefined}>{value}</div>
        {sub && <div className="amr-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function AmrBar({ pct, color }) {
  return <div className="amr-bar"><div className="amr-bar-fill" style={{ width: pct + "%", background: color || "linear-gradient(90deg, var(--brand-gold), var(--brand-gold-soft))" }} /></div>;
}

function MemberRewardsView() {
  const params = new URLSearchParams(location.search);
  const email = params.get("user") || "";
  const ret = params.get("ret") || "AdminUserDiagnostics.html";
  const board = useMemoAMR(() => buildBoardAMR(email), [email]);

  if (!board) {
    return (
      <div className="adl-view">
        <button className="amr-back" type="button" onClick={() => goAMR(ret)}><iconify-icon icon="lucide:arrow-left"></iconify-icon>Back to {RET_LABELS_AMR[ret] || "previous page"}</button>
        <div className="adl-banner adl-banner-error"><iconify-icon icon="lucide:alert-triangle"></iconify-icon><span>No member found for “{email}”. Open a rewards board from a user name on the Points Ledger or User Directory.</span></div>
      </div>
    );
  }

  const levels = board.config.levelBadges.slice().sort((a, b) => a.threshold - b.threshold);
  const achievements = board.config.achievementBadges || [];
  const storeItems = (board.config.storeItems || []).filter((i) => i && i.inventory !== 0).sort((a, b) => a.cost - b.cost);
  const nextReward = storeItems.find((i) => i.cost > board.spendableCredits) || storeItems[storeItems.length - 1];
  const affordable = storeItems.filter((i) => i.cost <= board.spendableCredits).length;
  const ledger = board.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 12);
  const mult = PF_AMR.tierMultiplierFor(null, board.tier);
  const nextLevelHint = board.badge.next ? PF_AMR.formatNumber(board.badge.remaining) + " pts to " + board.badge.next.name : "Top level reached";

  return (
    <div className="adl-view">
      <button className="amr-back" type="button" onClick={() => goAMR(ret)}><iconify-icon icon="lucide:arrow-left"></iconify-icon>Back to {RET_LABELS_AMR[ret] || "previous page"}</button>

      <div className="amr-head">
        <span className="amr-avatar">{initialsAMR(board.name)}</span>
        <div className="amr-head-main">
          <div className="amr-name">{board.name}{board.live && <span className="ldg-live-pill">live in this demo</span>}</div>
          <div className="amr-email">{board.email}</div>
          <div className="amr-pills">
            <span className="adl-pill" style={{ background: "var(--brand-gold-100)", color: "var(--brand-navy)" }}><iconify-icon icon="lucide:crown"></iconify-icon>{board.tier} membership · {mult}× points</span>
            {board.league && <span className="adl-pill" style={{ background: board.league.soft, color: board.league.deep }}><span className="adl-pill-dot" style={{ background: board.league.accent }} />{board.league.name} league</span>}
            {board.badge.current && <span className="adl-pill" style={{ background: "var(--gray-100)", color: "var(--gray-800)" }}><span className="adl-pill-dot" style={{ background: board.badge.current.color }} />{board.badge.current.name} level</span>}
          </div>
        </div>
        <div className="amr-head-actions">
          <button className="adl-btn adl-btn-ghost" type="button" onClick={() => goAMR("AdminUserDiagnostics.html?user=" + encodeURIComponent(board.email))}><iconify-icon icon="lucide:stethoscope"></iconify-icon>Diagnostics</button>
          <button className="adl-btn adl-btn-navy" type="button" onClick={() => goAMR("AdminAuditLedger.html?adjust=" + encodeURIComponent(board.email))}><iconify-icon icon="lucide:sliders-horizontal"></iconify-icon>Manual Adjustment</button>
        </div>
      </div>

      <div className="adl-stat-grid">
        <AmrStat icon="lucide:star" label="Lifetime Points" value={PF_AMR.formatNumber(board.lifetimePoints)} sub={"+" + PF_AMR.formatNumber(board.weekPoints) + " this week"} />
        <AmrStat icon="lucide:wallet" label="Spendable Credits" value={PF_AMR.formatNumber(board.spendableCredits)} sub={board.expiringCredits ? PF_AMR.formatNumber(board.expiringCredits) + " expiring soon" : "Nothing expiring"} tone={board.expiringCredits ? undefined : undefined} />
        <AmrStat icon="lucide:flame" label="Active Streak" value={board.streak.current + " days"} sub={"Longest " + board.streak.longest + " days" + (board.streak.frozen ? " · frozen" : "")} />
        <AmrStat icon="lucide:trending-up" label="Points, last 30 days" value={PF_AMR.formatNumber(board.rolling30)} sub={nextLevelHint} />
      </div>

      <div className="amr-grid">
        <div className="amr-col">
          <div className="adl-card">
            <div className="adl-card-head"><span className="adl-card-title-text">Level progress</span><span className="adl-cell-muted">{board.badge.pct}%</span></div>
            <AmrBar pct={board.badge.pct} />
            <div className="amr-ladder">
              {levels.map((l) => {
                const reached = board.lifetimePoints >= l.threshold;
                return (
                  <div key={l.key} className={"amr-ladder-step" + (reached ? " is-reached" : "") + (board.badge.current && board.badge.current.key === l.key ? " is-current" : "")}>
                    <span className="amr-ladder-dot" style={{ background: reached ? l.color : "var(--gray-200)" }} />
                    <span className="amr-ladder-name">{l.name}</span>
                    <span className="amr-ladder-pts">{PF_AMR.formatNumber(l.threshold)} pts</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="adl-card">
            <div className="adl-card-head"><span className="adl-card-title-text">Achievements</span><span className="adl-cell-muted">{board.unlockedAchievements.length} of {achievements.length} unlocked</span></div>
            <div className="amr-ach-grid">
              {achievements.map((b) => {
                const on = board.unlockedAchievements.includes(b.key);
                return (
                  <div key={b.key} className={"amr-ach" + (on ? " is-on" : "")} title={b.description}>
                    <span className="amr-ach-icon"><iconify-icon icon={b.icon}></iconify-icon></span>
                    <span className="amr-ach-main"><span className="amr-ach-name">{b.name}</span><span className="amr-ach-desc">{on ? (b.reward || "Unlocked") : b.description}</span></span>
                    {on ? <iconify-icon icon="lucide:check-circle-2" class="amr-ach-check"></iconify-icon> : <iconify-icon icon="lucide:lock" class="amr-ach-lock"></iconify-icon>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="adl-card">
            <div className="adl-card-head"><span className="adl-card-title-text">Milestone Path</span><span className="adl-cell-muted">{board.milestone.passed.length} of {board.milestone.path.length} reached</span></div>
            <AmrBar pct={board.milestone.pct} color="linear-gradient(90deg, var(--ai-purple), #B69CFF)" />
            <div className="amr-ms-list">
              {board.milestone.path.map((m) => {
                const passed = board.lifetimePoints >= m.threshold;
                const isNext = board.milestone.next && board.milestone.next.key === m.key;
                return (
                  <div key={m.key} className={"amr-ms" + (passed ? " is-passed" : "") + (isNext ? " is-next" : "")}>
                    <span className="amr-ms-icon"><iconify-icon icon={passed ? "lucide:check" : isNext ? "lucide:milestone" : "lucide:lock"}></iconify-icon></span>
                    <span className="amr-ms-main">
                      <span className="amr-ms-name">{m.name} <small>{PF_AMR.formatNumber(m.threshold)} pts</small></span>
                      <span className="amr-ms-benefit">{(m.benefits || []).map((b) => b.title).join(" · ") || "Benefit bundle"}</span>
                    </span>
                    {isNext && <span className="adl-pill" style={{ background: "var(--ai-purple-100)", color: "var(--ai-purple)" }}>{PF_AMR.formatNumber(board.milestone.remaining)} pts to go</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="amr-col">
          <div className="adl-card">
            <div className="adl-card-head"><span className="adl-card-title-text">Wallet</span></div>
            <div className="diag-balance-row"><span>Spendable credits</span><b>{PF_AMR.formatNumber(board.spendableCredits)}</b></div>
            <div className="diag-balance-row"><span>Lifetime points</span><b>{PF_AMR.formatNumber(board.lifetimePoints)}</b></div>
            <div className="diag-balance-row"><span>Points this week</span><b>{PF_AMR.formatNumber(board.weekPoints)}</b></div>
            <div className="diag-balance-row"><span>Expiring soon</span><b style={{ color: board.expiringCredits ? "var(--warning)" : undefined }}>{PF_AMR.formatNumber(board.expiringCredits)} cr</b></div>
            <div className="diag-balance-row"><span>{board.tier} tier multiplier</span><b>{mult}×</b></div>
            <div className="diag-balance-row"><span>Rewards affordable now</span><b>{affordable} of {storeItems.length}</b></div>
          </div>

          {nextReward && (
            <div className="adl-card amr-next">
              <div className="adl-card-head"><span className="adl-card-title-text">Next available reward</span></div>
              <div className="amr-next-body">
                <span className="amr-next-img">{nextReward.image ? <img src={nextReward.image} alt="" /> : <iconify-icon icon="lucide:gift"></iconify-icon>}</span>
                <div className="amr-next-main">
                  <div className="amr-next-name">{nextReward.course && nextReward.course.discountPct ? nextReward.course.discountPct + "% off " : ""}{nextReward.name}</div>
                  <div className="amr-next-sub">{PF_AMR.formatNumber(nextReward.cost)} credits · {nextReward.cost <= board.spendableCredits ? "ready to redeem" : PF_AMR.formatNumber(nextReward.cost - board.spendableCredits) + " more to go"}</div>
                  <AmrBar pct={Math.min(100, Math.round((board.spendableCredits / Math.max(1, nextReward.cost)) * 100))} />
                </div>
              </div>
            </div>
          )}

          <div className="adl-card">
            <div className="adl-card-head"><span className="adl-card-title-text">Redeemed rewards</span><span className="adl-cell-muted">{board.redeemedVouchers.length}</span></div>
            {board.redeemedVouchers.length === 0
              ? <div className="amr-empty"><iconify-icon icon="lucide:ticket"></iconify-icon>Nothing redeemed yet.</div>
              : board.redeemedVouchers.slice(0, 5).map((v, i) => (
                <div key={v.code || i} className="diag-balance-row"><span>{v.name || v.itemName || "Reward"}<small className="amr-code"> {v.code}</small></span><b>{v.used || v.status === "Used" ? "Used" : "Ready"}</b></div>
              ))}
          </div>
        </div>
      </div>

      <div className="adl-table">
        <div className="adl-card-head" style={{ padding: "18px 20px 0", border: "none" }}><span className="adl-card-title-text">Recent activity</span><button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => goAMR("AdminAuditLedger.html")}>Open Points Ledger</button></div>
        <div className="adl-row-grid adl-thead amr-row-grid" style={{ marginTop: 8 }}>
          <span className="adl-th">Action</span><span className="adl-th">Date</span><span className="adl-th">Points</span><span className="adl-th">Credits</span><span className="adl-th">Status</span>
        </div>
        {ledger.map((t) => (
          <div key={t.id} className="adl-row-grid adl-trow amr-row-grid">
            <span className="adl-cell">{t.label}{t.adminId && <span className="ldg-admin-tag"> · by {t.adminId}</span>}</span>
            <span className="adl-cell-muted">{fmtDateAMR(t.ts)}</span>
            <span className="adl-cell" style={{ fontWeight: 700, color: t.pointsDelta > 0 ? "var(--success)" : t.pointsDelta < 0 ? "var(--error)" : "var(--gray-400)" }}>{t.pointsDelta > 0 ? "+" : ""}{t.pointsDelta}</span>
            <span className="adl-cell" style={{ fontWeight: 700, color: t.creditsDelta > 0 ? "var(--success)" : t.creditsDelta < 0 ? "var(--error)" : "var(--gray-400)" }}>{t.creditsDelta > 0 ? "+" : ""}{t.creditsDelta}</span>
            <span>{t.guardrailFlags ? <span className="adl-pill" style={{ background: "var(--warning-bg)", color: "#96690a" }} title="The member had already hit this action's limit, so it was logged but paid 0 points."><span className="adl-pill-dot" style={{ background: "#96690a" }} />Limit reached</span>
              : t.adjustmentReason ? <span className="adl-pill" style={{ background: "var(--info-bg)", color: "var(--info)" }} title={t.adjustmentReason}>Manual</span>
              : t.creditsDelta < 0 ? <span className="adl-pill" style={{ background: "var(--gray-100)", color: "var(--gray-700)" }}>Spent</span>
              : <span className="adl-pill" style={{ background: "var(--success-bg)", color: "var(--success)" }}>Earned</span>}</span>
          </div>
        ))}
        {ledger.length === 0 && <div className="amr-empty" style={{ padding: 20 }}>No activity recorded for this member yet.</div>}
      </div>
    </div>
  );
}

function MemberRewardsApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey="users" />
      <main className="adl-main">
        <AdlHeader title="Loyalty &amp; Gamification — Member Rewards Board" />
        <MemberRewardsView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MemberRewardsApp />);
