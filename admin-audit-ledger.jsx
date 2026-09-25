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

/* Sample transactions awaiting admin approval. These belong to mock directory
   members (only Katy Moore is live-simulated), so approve/reject decisions are
   kept in localStorage rather than written to the live ledger. */
const LDG_REVIEWS_KEY = "pf-ledger-reviews";
const LDG_PENDING_SAMPLES = [
  { id: "txn_rev_7k2m9p", user: "Eleanor Pena", actionId: "evt_license_verify", label: "Verify Medical License", pointsDelta: 200, creditsDelta: 20, hoursAgo: 3,
    source: "system", detector: "Action rule: requires approval", note: "GMC certificate uploaded, awaiting manual check." },
  { id: "txn_rev_q4x8ns", user: "Marcus Webb", actionId: "evt_refer_colleague", label: "Refer a Colleague", pointsDelta: 200, creditsDelta: 20, hoursAgo: 9,
    source: "system", detector: "Fraud screen: device fingerprint match", note: "Referred account shares a device with an existing member." },
  { id: "txn_rev_m2h5tw", user: "Sofia Alarcón", actionId: "evt_prod_review_submit", label: "Write a Product Review", pointsDelta: 225, creditsDelta: 23, hoursAgo: 14,
    source: "member", detector: "Flagged by 2 members in the app", note: "Review text appears copied from a manufacturer listing." },
  { id: "txn_rev_c1v6bd", user: "Priya Nandwani", actionId: "evt_license_verify", label: "Verify Medical License", pointsDelta: 200, creditsDelta: 20, hoursAgo: 26,
    source: "system", detector: "Media check: image quality too low", note: "Licence photo is blurred, may need a re-upload." }
];
function ldgLoadReviews() { try { return JSON.parse(localStorage.getItem(LDG_REVIEWS_KEY) || "{}"); } catch (e) { return {}; } }
function ldgSaveReviews(map) { try { localStorage.setItem(LDG_REVIEWS_KEY, JSON.stringify(map)); } catch (e) {} }

/* Guardrail codes written by the engine, shown in plain English */
const LDG_FLAG_LABELS = {
  CAP_REACHED: { label: "Limit reached", tip: "The member had already hit this action's limit (daily, weekly, lifetime, one-time or cooldown), so the action was logged but paid 0 points." },
  VELOCITY: { label: "Too fast", tip: "Repeated the action sooner than the cooldown allows, so no points were paid." },
  MIN_CHARS: { label: "Too short", tip: "The text was under the minimum length for this action, so no points were paid." }
};
function ldgFlag(code) { return LDG_FLAG_LABELS[code] || { label: code.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase()), tip: "Guardrail " + code }; }

function ldgEmailFor(name) {
  const live = PF_LDG.getState().user;
  if (name === live.name + " Moore") return live.email;
  const hit = PF_LDG.MOCK_DIRECTORY.find((u) => u.name === name);
  return hit ? hit.email : null;
}
function LdgUserLink({ name }) {
  const email = ldgEmailFor(name);
  if (!email) return <span className="adl-cell">{name}</span>;
  return <button type="button" className="adl-cell ldg-user-link" title={"Open " + name + "'s rewards board"} onClick={() => goLDG("AdminMemberRewards.html?user=" + encodeURIComponent(email) + "&ret=AdminAuditLedger.html")}>{name}</button>;
}

function fmtDate(iso) { const d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }

/* ------------------------------------------------------------- LDG view */
const LDG_TIPS = {
  id: "Unique reference for this ledger entry. Quote it when a member queries a points change.",
  user: "The member whose points or credit balance changed. Click a name to open their rewards board.",
  action: "What the member did to earn or spend, or the manual adjustment that was made and which admin made it.",
  date: "When the transaction was recorded, shown in your local time.",
  points: "Points added (green) or removed (red) by this transaction. Amber 'held' points are waiting for approval. A grey 0 means the action counted but earned nothing, usually because a cap was reached.",
  credits: "Store credits earned alongside points. Members get about 1 credit for every 10 points.",
  flags: "Status of the transaction. Pending review rows say who held them: Auto-detected means an action rule or fraud check fired; Reported by member means someone flagged it in the app. Approve or reject here. Also shows Approved, Rejected, guardrail warnings such as Limit reached, or Manual for an admin adjustment.",
  stat24h: "Ledger entries recorded in the last 24 hours across all members.",
  statFraud: "Transactions currently flagged by the guardrails for suspicious, repeated or capped activity.",
  statPending: "Transactions for actions that need admin approval before the points are released to the member."
};

function LdgDelta({ value, review }) {
  if (review === "pending") return <span className="adl-cell ldg-held" title="Held until an admin approves this transaction">+{value}<small>held</small></span>;
  if (review === "rejected") return <span className="adl-cell" style={{ color: "var(--gray-400)", fontWeight: 700, textDecoration: "line-through" }}>+{value}</span>;
  return <span className="adl-cell" style={{ color: value > 0 ? "var(--success)" : value < 0 ? "var(--error)" : "var(--gray-400)", fontWeight: 700 }}>{value > 0 ? "+" : ""}{value}</span>;
}

function LdgInfo({ text, left }) {
  return (
    <span className={"adl-info" + (left ? " is-left" : "")} tabIndex={0} role="img" aria-label={text}>
      <iconify-icon icon="lucide:info"></iconify-icon>
      <span className="adl-info-tip" aria-hidden="true">{text}</span>
    </span>
  );
}

function LdgStat({ label, value, tone, tip }) {
  return (
    <div className="adl-stat-card">
      <div className="adl-stat-body">
        <div className="adl-stat-label">{label}{tip && <LdgInfo text={tip} left />}</div>
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

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
    <div className="adl-scrim is-center" onClick={onClose}>
      <div className="adl-panel adl-modal ldg-modal" role="dialog" aria-modal="true" aria-labelledby="ldg-adjust-title" onClick={(e) => e.stopPropagation()}>
        <div className="adl-panel-head"><h2 id="ldg-adjust-title">Manual Point / Credit Adjustment</h2>
          <button className="adl-panel-close" type="button" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>
        <div className="adl-panel-body">
          <div className="adl-field">
            <label>Search User by Email or ID</label>
            <input type="text" placeholder="Search directory..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="ldg-user-results">
            {filtered.map((u) => (
              <button key={u.email} type="button" className={"ldg-user-result" + (selected && selected.email === u.email ? " is-active" : "")} onClick={() => setSelected(u)}>
                <span className="ldg-user-result-name">{u.name}{u.live && <span className="ldg-live-pill">live in this demo</span>}</span>
                <span className="ldg-user-result-email">{u.email}</span>
              </button>
            ))}
          </div>

          <div className="ldg-modal-row">
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
  const [panelOpen, setPanelOpen] = useStateLDG(() => new URLSearchParams(location.search).has("adjust"));
  const [toast, setToast] = useStateLDG(null);

  const [reviews, setReviews] = useStateLDG(ldgLoadReviews);

  const rows = useMemoLDG(() => {
    const liveName = state.user.name + " Moore";
    const live = state.ledger.map((t) => Object.assign({ user: liveName, review: PF_LDG.getActionById(t.actionId)?.requiresApproval && !t.adminId ? "pending" : null, source: "system", detector: "Action rule: requires approval" }, t));
    const samples = LDG_PENDING_SAMPLES.map((p) => Object.assign({}, p, {
      ts: new Date(Date.now() - p.hoursAgo * 3600000).toISOString(),
      guardrailFlags: null, adminId: null, adjustmentReason: null, sample: true,
      review: reviews[p.id] || "pending"
    }));
    return live.concat(samples).sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }, [state, reviews]);
  const last24h = useMemoLDG(() => rows.filter((t) => Date.now() - new Date(t.ts).getTime() < 86400000).length, [rows]);
  const fraudFlags = useMemoLDG(() => rows.filter((t) => t.guardrailFlags).length, [rows]);
  const pendingCount = useMemoLDG(() => rows.filter((t) => t.review === "pending").length, [rows]);

  const decide = (t, verdict) => {
    setReviews((prev) => { const next = Object.assign({}, prev, { [t.id]: verdict }); ldgSaveReviews(next); return next; });
    setToast((verdict === "approved" ? "Approved: " : "Rejected: ") + t.label + " for " + t.user + (verdict === "approved" ? " · +" + t.pointsDelta + " pts released." : " · no points awarded."));
    setTimeout(() => setToast(null), 2800);
  };

  const onExecute = (res) => {
    if (!res.mock) setState(PF_LDG.getState());
    setPanelOpen(false);
    setToast("Adjustment executed for " + res.user.name + ".");
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>Points Ledger</h1><p>Every point and credit movement, recorded permanently. Step in with a manual correction when support needs it.</p></div>
        <div className="adl-page-head-actions">
          <button className="adl-btn adl-btn-navy" type="button" onClick={() => setPanelOpen(true)}><iconify-icon icon="lucide:sliders-horizontal"></iconify-icon>Manual Adjustment</button>
        </div>
      </div>
      {toast && <div className="adl-banner adl-banner-info"><iconify-icon icon="lucide:check-circle"></iconify-icon><span>{toast}</span></div>}

      <div className="adl-stat-grid ldg-stats-3">
        <LdgStat label="Total 24h Transactions" value={last24h} tip={LDG_TIPS.stat24h} />
        <LdgStat label="Active Fraud Flags" value={fraudFlags} tone={fraudFlags ? "var(--error)" : undefined} tip={LDG_TIPS.statFraud} />
        <LdgStat label="Pending Reviews" value={pendingCount} tone={pendingCount ? "var(--warning)" : undefined} tip={LDG_TIPS.statPending} />
      </div>

      <div className="adl-table">
        <div className="adl-row-grid adl-thead ldg-row-grid">
          <span className="adl-th ldg-th">Transaction ID<LdgInfo text={LDG_TIPS.id} left /></span>
          <span className="adl-th ldg-th">User<LdgInfo text={LDG_TIPS.user} /></span>
          <span className="adl-th ldg-th">Action<LdgInfo text={LDG_TIPS.action} /></span>
          <span className="adl-th ldg-th">Date<LdgInfo text={LDG_TIPS.date} /></span>
          <span className="adl-th ldg-th">Points<LdgInfo text={LDG_TIPS.points} /></span>
          <span className="adl-th ldg-th">Credits<LdgInfo text={LDG_TIPS.credits} /></span>
          <span className="adl-th ldg-th">Flags<LdgInfo text={LDG_TIPS.flags} /></span>
        </div>
        {rows.slice(0, 40).map((t) => (
          <div key={t.id} className="adl-row-grid adl-trow ldg-row-grid">
            <span className="adl-cell adl-cell-mono">{t.id}</span>
            <LdgUserLink name={t.user} />
            <span className="adl-cell">{t.label}{t.adminId && <span className="ldg-admin-tag"> · by {t.adminId}</span>}{t.review === "pending" && t.note && <span className="ldg-admin-tag ldg-note"> · {t.note}</span>}</span>
            <span className="adl-cell-muted">{fmtDate(t.ts)}</span>
            <LdgDelta value={t.pointsDelta} review={t.review} />
            <LdgDelta value={t.creditsDelta} review={t.review} />
            <span className="ldg-flags-cell">{t.review === "pending"
              ? <><span className="adl-pill ldg-pill-pending"><span className="adl-pill-dot" />Pending review</span>
                  <span className={"ldg-source" + (t.source === "member" ? " is-member" : "")} title={t.source === "member" ? "A member reported this transaction from the app" : "The system held this automatically"}>
                    <iconify-icon icon={t.source === "member" ? "lucide:flag" : "lucide:scan-search"}></iconify-icon>
                    <span className="ldg-source-label">{t.source === "member" ? "Member report" : "Auto-detected"}</span>
                    <span className="ldg-source-detail">{t.detector}</span>
                  </span>
                  <span className="ldg-review-actions">
                    <button type="button" className="ldg-review-btn is-approve" title="Approve and release points" onClick={() => decide(t, "approved")}><iconify-icon icon="lucide:check"></iconify-icon>Approve</button>
                    <button type="button" className="ldg-review-btn is-reject" title="Reject, no points awarded" onClick={() => decide(t, "rejected")}><iconify-icon icon="lucide:x"></iconify-icon>Reject</button>
                  </span></>
              : t.review === "approved" ? <span className="adl-pill" style={{ background: "var(--success-bg)", color: "var(--success)" }}><span className="adl-pill-dot" style={{ background: "var(--success)" }} />Approved</span>
              : t.review === "rejected" ? <span className="adl-pill" style={{ background: "var(--error-bg)", color: "var(--error)" }}><span className="adl-pill-dot" style={{ background: "var(--error)" }} />Rejected</span>
              : t.guardrailFlags ? <span className="adl-pill" style={{ background: "var(--warning-bg)", color: "#96690a" }} title={ldgFlag(t.guardrailFlags).tip}><span className="adl-pill-dot" style={{ background: "#96690a" }} />{ldgFlag(t.guardrailFlags).label}</span>
              : t.adjustmentReason ? <span className="adl-pill" style={{ background: "var(--info-bg)", color: "var(--info)" }} title={t.adjustmentReason}>Manual</span> : "—"}</span>
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
        <AdlHeader title="Loyalty &amp; Gamification — Points Ledger" />
        <AuditLedgerView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AuditLedgerApp />);
