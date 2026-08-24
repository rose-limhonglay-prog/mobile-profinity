/* ===========================================================================
   PROfinity — Admin · Badge Management (desktop console)
   Dashboard / All Badges library / Automation Rules tabs, Create·Edit modal,
   Assign-to-members modal, Create Rule modal, and a badge detail drill-in
   with a revocable holders list. Static mock data, all client-side state.
   Suffixed -BDG to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateBDG, useMemo: useMemoBDG } = React;

function goBDG(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const BDG_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events" },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:badge-check", label: "Badges", active: true },
  { icon: "lucide:trophy", label: "Loyalty & Gamification", chevron: true },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const BDG_NAV_LINKS = {
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
  "Loyalty & Gamification": "AdminActionsEditor.html",
  "Transactions": "AdminTransactions.html",
  "Courses": "AdminCourses.html",
  "Community": "AdminCommunity.html",
};

function BDGSidebar() {
  return (
    <aside className="bdg-sidebar">
      <div className="bdg-logo">
        <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" />
      </div>
      {BDG_NAV.map((item) => {
        const href = BDG_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"bdg-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goBDG(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="bdg-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="bdg-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function BDGHeader() {
  return (
    <header className="bdg-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="bdg-header-title">Badge Management</span>
      <div className="bdg-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="bdg-spacer" />
      <div className="bdg-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="bdg-bell-badge">4</span>
      </div>
      <div className="bdg-user">
        <div className="bdg-user-name">Dr Tim Pearce</div>
        <div className="bdg-user-role">Admin</div>
      </div>
      <img className="bdg-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ------------------------------------------------------------------ data */
const BDG_ICON_OPTIONS = [
  "lucide:trophy", "lucide:medal", "lucide:crown", "lucide:sparkles",
  "lucide:stethoscope", "lucide:rocket", "lucide:star", "lucide:shield-check",
  "lucide:graduation-cap", "lucide:award", "lucide:flame", "lucide:gem",
  "lucide:heart", "lucide:badge-check", "lucide:target", "lucide:zap",
];

const BDG_CATEGORIES = ["Achievement", "Membership Tier", "Community Participation", "Faculty & Credentials"];

const BDG_CATEGORY_TONE = {
  "Achievement": { bg: "var(--brand-gold-100)", fg: "var(--brand-gold)" },
  "Membership Tier": { bg: "var(--info-bg)", fg: "var(--info)" },
  "Community Participation": { bg: "var(--success-bg)", fg: "var(--success)" },
  "Faculty & Credentials": { bg: "var(--ai-purple-100)", fg: "var(--ai-purple)" },
};

const BDG_TIERS = ["Basic", "Confidence", "Mastery", "Sovereign and Builder"];
function bdgTierRank(tier) { return BDG_TIERS.indexOf(tier); }

const BDG_MEMBERS = [
  { id: "m1", name: "Miranda Pearce", email: "miranda.pearce@gmail.com", tier: "Mastery", avatar: "assets/avatar-miranda.jpg" },
  { id: "m2", name: "Amir Khan", email: "amir.khan@gmail.com", tier: "Confidence", avatar: "assets/avatar-amir-khan.jpg" },
  { id: "m3", name: "Priya Shah", email: "priya.shah@gmail.com", tier: "Sovereign and Builder", avatar: "assets/avatar-priya-shah.jpg" },
  { id: "m4", name: "Mark Ellis", email: "mark.ellis@gmail.com", tier: "Basic", avatar: "assets/avatar-mark-ellis.jpg" },
  { id: "m5", name: "Sarah Collins", email: "sarah.collins@gmail.com", tier: "Mastery", avatar: "assets/avatar-sarah-collins.jpg" },
  { id: "m6", name: "Beth Turner", email: "beth.turner@gmail.com", tier: "Confidence", avatar: "assets/avatar-nurse-beth.jpg" },
  { id: "m7", name: "Katy Nguyen", email: "katy.nguyen@gmail.com", tier: "Sovereign and Builder", avatar: "assets/avatar-katy.jpg" },
  { id: "m8", name: "Dr Tim Pearce", email: "tim.pearce@drtimpearce.com", tier: "Sovereign and Builder", avatar: "assets/avatar-drtim.png" },
  { id: "m9", name: "Jo Bennett", email: "jo.bennett@gmail.com", tier: "Confidence", avatar: null },
  { id: "m10", name: "Leah Osei", email: "leah.osei@gmail.com", tier: "Mastery", avatar: null },
  { id: "m11", name: "Connor Reid", email: "connor.reid@gmail.com", tier: "Basic", avatar: null },
  { id: "m12", name: "Farah Hussain", email: "farah.hussain@gmail.com", tier: "Mastery", avatar: null },
];
const bdgMemberById = (id) => BDG_MEMBERS.find((m) => m.id === id);

const BDG_INITIAL_BADGES = [
  { id: "b1", name: "Founding Badge", description: "Awarded to members who joined during Profinity's founding year.", icon: "lucide:rocket", category: "Achievement", notify: true, status: "Active" },
  { id: "b2", name: "Skinfluencers", description: "Recognises members who actively share content that grows the community.", icon: "lucide:sparkles", category: "Community Participation", notify: true, status: "Active" },
  { id: "b3", name: "Faculty Clinical Complications", description: "Confirms faculty-verified expertise in managing clinical complications.", icon: "lucide:stethoscope", category: "Faculty & Credentials", notify: true, status: "Active" },
  { id: "b4", name: "Gold Tier Member", description: "Awarded automatically when a member reaches Mastery tier.", icon: "lucide:crown", category: "Membership Tier", notify: true, status: "Active" },
  { id: "b5", name: "First Case Study", description: "Celebrates a member's first published case study.", icon: "lucide:medal", category: "Achievement", notify: true, status: "Active" },
  { id: "b6", name: "Community Champion", description: "Recognises members who consistently support and uplift the community.", icon: "lucide:trophy", category: "Community Participation", notify: false, status: "Active" },
  { id: "b7", name: "Verified Clinician", description: "Confirms an approved clinician verification on the platform.", icon: "lucide:shield-check", category: "Faculty & Credentials", notify: true, status: "Archived" },
];

const BDG_INITIAL_ASSIGNMENTS = [
  { id: "a1", badgeId: "b1", memberId: "m3", type: "Manual", date: "12 Jan 2026", dateSort: "2026-01-12", status: "Active" },
  { id: "a2", badgeId: "b1", memberId: "m8", type: "Manual", date: "14 Jan 2026", dateSort: "2026-01-14", status: "Active" },
  { id: "a3", badgeId: "b1", memberId: "m7", type: "Manual", date: "15 Jan 2026", dateSort: "2026-01-15", status: "Active" },
  { id: "a4", badgeId: "b7", memberId: "m8", type: "Manual", date: "01 Feb 2026", dateSort: "2026-02-01", status: "Active" },
  { id: "a5", badgeId: "b7", memberId: "m3", type: "Manual", date: "03 Feb 2026", dateSort: "2026-02-03", status: "Active" },
  { id: "a6", badgeId: "b2", memberId: "m1", type: "Manual", date: "02 Jul 2026", dateSort: "2026-07-02", status: "Active" },
  { id: "a7", badgeId: "b2", memberId: "m9", type: "Manual", date: "10 Jul 2026", dateSort: "2026-07-10", status: "Revoked" },
  { id: "a8", badgeId: "b4", memberId: "m1", type: "Automated", ruleId: "r1", date: "20 Jul 2026", dateSort: "2026-07-20", status: "Active" },
  { id: "a9", badgeId: "b4", memberId: "m5", type: "Automated", ruleId: "r1", date: "22 Jul 2026", dateSort: "2026-07-22", status: "Active" },
  { id: "a10", badgeId: "b4", memberId: "m7", type: "Automated", ruleId: "r1", date: "24 Jul 2026", dateSort: "2026-07-24", status: "Active" },
  { id: "a11", badgeId: "b4", memberId: "m8", type: "Automated", ruleId: "r1", date: "25 Jul 2026", dateSort: "2026-07-25", status: "Active" },
  { id: "a12", badgeId: "b4", memberId: "m3", type: "Automated", ruleId: "r1", date: "26 Jul 2026", dateSort: "2026-07-26", status: "Active" },
  { id: "a13", badgeId: "b4", memberId: "m10", type: "Automated", ruleId: "r1", date: "27 Jul 2026", dateSort: "2026-07-27", status: "Active" },
  { id: "a14", badgeId: "b6", memberId: "m11", type: "Automated", ruleId: "r2", date: "29 Jul 2026", dateSort: "2026-07-29", status: "Active" },
  { id: "a15", badgeId: "b6", memberId: "m6", type: "Automated", ruleId: "r2", date: "30 Jul 2026", dateSort: "2026-07-30", status: "Active" },
  { id: "a16", badgeId: "b3", memberId: "m5", type: "Automated", ruleId: "r3", date: "28 Jul 2026", dateSort: "2026-07-28", status: "Active" },
  { id: "a17", badgeId: "b3", memberId: "m12", type: "Automated", ruleId: "r3", date: "30 Jul 2026", dateSort: "2026-07-30", status: "Active" },
  { id: "a18", badgeId: "b5", memberId: "m4", type: "Manual", date: "03 Aug 2026", dateSort: "2026-08-03", status: "Active" },
  { id: "a19", badgeId: "b5", memberId: "m2", type: "Manual", date: "05 Aug 2026", dateSort: "2026-08-05", status: "Active" },
  { id: "a20", badgeId: "b6", memberId: "m9", type: "Manual", date: "06 Aug 2026", dateSort: "2026-08-06", status: "Active" },
];

const BDG_CRITERIA_TYPES = [
  { key: "tier", label: "Membership tier reached", icon: "lucide:layers", valueType: "tier" },
  { key: "course", label: "Course completed", icon: "lucide:graduation-cap", valueType: "text", placeholder: "e.g. Advanced Dermal Fillers" },
  { key: "postCount", label: "Post count", icon: "lucide:file-text", valueType: "number", placeholder: "e.g. 50" },
  { key: "commentCount", label: "Comment count", icon: "lucide:message-square", valueType: "number", placeholder: "e.g. 200" },
  { key: "eventAttended", label: "Event attended", icon: "lucide:calendar", valueType: "text", placeholder: "e.g. Clinic Growth Summit" },
  { key: "verificationApproved", label: "Verification approved", icon: "lucide:shield-check", valueType: "none" },
];
const bdgCriteriaMeta = (key) => BDG_CRITERIA_TYPES.find((c) => c.key === key) || BDG_CRITERIA_TYPES[0];

const BDG_INITIAL_RULES = [
  { id: "r1", name: "Mastery Tier Achievers", badgeId: "b4", criteriaType: "tier", threshold: "Mastery", active: true },
  { id: "r2", name: "Prolific Contributors", badgeId: "b6", criteriaType: "postCount", threshold: "50", active: true },
  { id: "r3", name: "Faculty Verification", badgeId: "b3", criteriaType: "verificationApproved", threshold: "", active: true },
  { id: "r4", name: "Super Commenters", badgeId: "b2", criteriaType: "commentCount", threshold: "200", active: false },
];

function bdgCriteriaSummary(rule) {
  switch (rule.criteriaType) {
    case "tier": return "Reach " + rule.threshold + " tier";
    case "course": return 'Complete "' + rule.threshold + '"';
    case "postCount": return "Post " + rule.threshold + "+ times";
    case "commentCount": return "Leave " + rule.threshold + "+ comments";
    case "eventAttended": return 'Attend "' + rule.threshold + '"';
    case "verificationApproved": return "Verification approved";
    default: return "";
  }
}

function bdgEstimateQualifying(criteriaType, threshold) {
  if (criteriaType === "tier") {
    const rank = bdgTierRank(threshold);
    if (rank < 0) return 0;
    return BDG_MEMBERS.filter((m) => bdgTierRank(m.tier) >= rank).length;
  }
  if (criteriaType === "verificationApproved") return 8;
  if (criteriaType === "postCount" || criteriaType === "commentCount") {
    const n = Number(threshold);
    if (!n || n <= 0) return 0;
    return Math.max(1, Math.round(320 / n));
  }
  if (!threshold || !threshold.trim()) return 0;
  return Math.max(3, 24 - Math.min(18, threshold.trim().length));
}

/* --------------------------------------------------------------- shared UI */
function BDGAvatar({ name, avatar, size }) {
  const s = size || 38;
  if (avatar) return <img className="bdg-avatar" style={{ width: s, height: s }} src={avatar} alt={name} />;
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return <span className="bdg-avatar bdg-avatar-fallback" style={{ width: s, height: s, fontSize: s * 0.36 }}>{initials}</span>;
}

function bdgIsCustomIcon(icon) {
  return typeof icon === "string" && icon.startsWith("data:");
}

function BDGBadgeIcon({ badge, size }) {
  const tone = BDG_CATEGORY_TONE[badge.category] || { bg: "var(--gray-100)", fg: "var(--gray-500)" };
  const s = size || 40;
  if (bdgIsCustomIcon(badge.icon)) {
    return (
      <span className="bdg-badge-icon bdg-badge-icon-custom" style={{ width: s, height: s, background: tone.bg }}>
        <img src={badge.icon} alt="" style={{ width: s, height: s }} />
      </span>
    );
  }
  return (
    <span className="bdg-badge-icon" style={{ width: s, height: s, background: tone.bg, color: tone.fg, fontSize: s * 0.5 }}>
      <iconify-icon icon={badge.icon}></iconify-icon>
    </span>
  );
}

function BDGCategoryPill({ category }) {
  const tone = BDG_CATEGORY_TONE[category] || { bg: "var(--gray-100)", fg: "var(--gray-500)" };
  return <span className="bdg-cat-pill" style={{ background: tone.bg, color: tone.fg }}>{category}</span>;
}

function BDGTypePill({ type }) {
  const isManual = type === "Manual";
  return (
    <span className="bdg-type-pill" style={{ background: isManual ? "var(--brand-gold-100)" : "var(--ai-purple-100)", color: isManual ? "var(--brand-gold)" : "var(--ai-purple)" }}>
      <iconify-icon icon={isManual ? "lucide:hand" : "lucide:zap"}></iconify-icon>
      {type}
    </span>
  );
}

function BDGStatusPill({ status }) {
  const meta = status === "Active"
    ? { bg: "var(--success-bg)", fg: "var(--success)" }
    : status === "Revoked"
      ? { bg: "var(--error-bg)", fg: "var(--error)" }
      : { bg: "var(--gray-100)", fg: "var(--gray-500)" };
  return (
    <span className="bdg-status-pill" style={{ background: meta.bg }}>
      <span className="bdg-status-dot" style={{ background: meta.fg }} />
      <span style={{ color: meta.fg }}>{status}</span>
    </span>
  );
}

function BDGToggle({ on, onClick }) {
  return (
    <button type="button" className={"bdg-toggle" + (on ? " is-on" : "")} onClick={onClick}>
      <span className="bdg-toggle-knob" />
    </button>
  );
}

function BDGCheck({ on, onClick, disabled }) {
  return (
    <button type="button" className={"bdg-check" + (on ? " is-on" : "")} onClick={onClick} disabled={disabled}>
      {on && <iconify-icon icon="lucide:check"></iconify-icon>}
    </button>
  );
}

function BDGToast({ message }) {
  if (!message) return null;
  return (
    <div className="bdg-toast">
      <iconify-icon icon="lucide:circle-check-big"></iconify-icon>
      <span>{message}</span>
    </div>
  );
}

/* ------------------------------------------------------------- dashboard */
function BDGDashboardView({ badges, assignments, rules, openCreate, openDetail, goLibrary }) {
  const stats = [
    { label: "Total Badges", value: badges.length, icon: "lucide:award", color: "var(--brand-navy)", bg: "var(--gray-100)" },
    { label: "Active Rules", value: rules.filter((r) => r.active).length, icon: "lucide:zap", color: "var(--success)", bg: "var(--success-bg)" },
    { label: "Total Assignments", value: assignments.filter((a) => a.status === "Active").length, icon: "lucide:users", color: "var(--ai-purple)", bg: "var(--ai-purple-100)" },
  ];

  const recent = useMemoBDG(() => {
    return [...assignments].sort((a, b) => b.dateSort.localeCompare(a.dateSort)).slice(0, 6);
  }, [assignments]);

  return (
    <div className="bdg-view">
      <div className="bdg-page-head">
        <div>
          <h1>Badge Management</h1>
          <p>Recognise member milestones with manual awards and automated, criteria-based rules.</p>
        </div>
        <button className="bdg-btn bdg-btn-navy" type="button" onClick={openCreate}>
          <iconify-icon icon="lucide:plus"></iconify-icon>Create Badge
        </button>
      </div>

      <div className="bdg-stat-grid">
        {stats.map((s) => (
          <div className="bdg-stat-card" key={s.label}>
            <span className="bdg-stat-icon" style={{ background: s.bg, color: s.color }}>
              <iconify-icon icon={s.icon}></iconify-icon>
            </span>
            <div className="bdg-stat-body">
              <div className="bdg-stat-label">{s.label}</div>
              <div className="bdg-stat-value" style={s.label === "Active Rules" ? { color: "var(--success)" } : undefined}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bdg-card">
        <div className="bdg-card-head">
          <span className="bdg-card-title-text">Recent Badge Assignments</span>
          <a href="#" onClick={(e) => { e.preventDefault(); goLibrary(); }}>View all badges</a>
        </div>

        <div className="bdg-table">
          <div className="bdg-row-grid bdg-thead">
            <span className="bdg-th">BADGE</span>
            <span className="bdg-th">USER</span>
            <span className="bdg-th">TYPE</span>
            <span className="bdg-th">DATE</span>
            <span className="bdg-th">STATUS</span>
          </div>
          {recent.map((a) => {
            const badge = badges.find((b) => b.id === a.badgeId);
            const member = bdgMemberById(a.memberId);
            if (!badge || !member) return null;
            return (
              <div key={a.id} className="bdg-row-grid bdg-trow" onClick={() => openDetail(badge)}>
                <div className="bdg-trow-badge">
                  <BDGBadgeIcon badge={badge} size={34} />
                  <span className="bdg-trow-badge-name">{badge.name}</span>
                </div>
                <div className="bdg-trow-user">
                  <BDGAvatar name={member.name} avatar={member.avatar} size={30} />
                  <span>{member.name}</span>
                </div>
                <BDGTypePill type={a.type} />
                <span className="bdg-meta-cell">{a.date}</span>
                <BDGStatusPill status={a.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- library */
function BDGLibraryView({ badges, assignments, openCreate, openEdit, openAssign, openDetail, onToggleArchive }) {
  const [query, setQuery] = useStateBDG("");
  const [category, setCategory] = useStateBDG("all");
  const [statusFilter, setStatusFilter] = useStateBDG("all");
  const [openMenuId, setOpenMenuId] = useStateBDG(null);

  const counts = useMemoBDG(() => {
    const m = {};
    assignments.forEach((a) => { if (a.status === "Active") m[a.badgeId] = (m[a.badgeId] || 0) + 1; });
    return m;
  }, [assignments]);

  const filtered = useMemoBDG(() => {
    const q = query.trim().toLowerCase();
    return badges.filter((b) => {
      if (category !== "all" && b.category !== category) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (q && !(b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [badges, query, category, statusFilter]);

  return (
    <div className="bdg-view">
      <div className="bdg-page-head">
        <div>
          <h1>All Badges</h1>
          <p>Browse, edit, assign and archive every badge in the library.</p>
        </div>
        <button className="bdg-btn bdg-btn-navy" type="button" onClick={openCreate}>
          <iconify-icon icon="lucide:plus"></iconify-icon>Create Badge
        </button>
      </div>

      <div className="bdg-filters">
        <div className="bdg-search-input-wrap">
          <iconify-icon icon="lucide:search"></iconify-icon>
          <input placeholder="Search badges by name or description..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="bdg-filter-select">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {BDG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <iconify-icon icon="lucide:chevron-down"></iconify-icon>
        </div>
        <div className="bdg-filter-select">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
          <iconify-icon icon="lucide:chevron-down"></iconify-icon>
        </div>
      </div>

      <div className="bdg-badge-grid">
        {filtered.map((b) => {
          const archived = b.status === "Archived";
          return (
            <div key={b.id} className={"bdg-badge-card" + (archived ? " is-archived" : "")}>
              <div className="bdg-badge-card-head">
                <BDGBadgeIcon badge={b} size={48} />
                <button type="button" className="bdg-card-more" onClick={() => setOpenMenuId(openMenuId === b.id ? null : b.id)}>
                  <iconify-icon icon="lucide:more-vertical"></iconify-icon>
                </button>
                {openMenuId === b.id && (
                  <div className="bdg-card-menu" onMouseLeave={() => setOpenMenuId(null)}>
                    <button type="button" onClick={() => { openEdit(b); setOpenMenuId(null); }}><iconify-icon icon="lucide:pencil"></iconify-icon>Edit</button>
                    <button type="button" disabled={archived} onClick={() => { openAssign(b); setOpenMenuId(null); }}><iconify-icon icon="lucide:user-plus"></iconify-icon>Assign to members</button>
                    <button type="button" onClick={() => { onToggleArchive(b); setOpenMenuId(null); }}>
                      <iconify-icon icon={archived ? "lucide:archive-restore" : "lucide:archive"}></iconify-icon>{archived ? "Unarchive" : "Archive"}
                    </button>
                  </div>
                )}
              </div>
              <button type="button" className="bdg-badge-card-name" onClick={() => openDetail(b)}>{b.name}</button>
              <p className="bdg-badge-card-desc">{b.description}</p>
              <div className="bdg-badge-card-foot">
                <BDGCategoryPill category={b.category} />
                <span className="bdg-badge-card-count"><iconify-icon icon="lucide:users"></iconify-icon>{counts[b.id] || 0}</span>
              </div>
              {archived && <span className="bdg-archived-tag">Archived</span>}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bdg-empty-row">No badges match your filters.</div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- rules */
function BDGRulesView({ rules, badges, assignments, toggleRule, openCreateRule, openDetail }) {
  const awardedFor = (ruleId) => assignments.filter((a) => a.ruleId === ruleId && a.status === "Active").length;

  return (
    <div className="bdg-view">
      <div className="bdg-page-head">
        <div>
          <h1>Automation Rules</h1>
          <p>Award badges automatically when a member meets criteria — no manual work required.</p>
        </div>
        <button className="bdg-btn bdg-btn-navy" type="button" onClick={openCreateRule}>
          <iconify-icon icon="lucide:plus"></iconify-icon>Create Rule
        </button>
      </div>

      <div className="bdg-rule-banner">
        <iconify-icon icon="lucide:zap"></iconify-icon>
        <span><strong>Automated rules</strong> run continuously and award badges the moment a member meets the criteria. Profinity never revokes automatically — only admins can revoke.</span>
      </div>

      <div className="bdg-rule-list">
        {rules.map((rule) => {
          const badge = badges.find((b) => b.id === rule.badgeId);
          if (!badge) return null;
          return (
            <div className="bdg-rule-card" key={rule.id}>
              <BDGBadgeIcon badge={badge} size={48} />
              <div className="bdg-rule-body">
                <div className="bdg-rule-head">
                  <button type="button" className="bdg-rule-title" onClick={() => openDetail(badge)}>{rule.name}</button>
                  <span className={"bdg-rule-active" + (rule.active ? "" : " is-off")}>
                    <span className="bdg-rule-active-dot" />{rule.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="bdg-rule-meta">
                  <span><iconify-icon icon="lucide:award"></iconify-icon>Awards <strong>{badge.name}</strong></span>
                  <span><iconify-icon icon="lucide:key-round"></iconify-icon>{bdgCriteriaSummary(rule)}</span>
                  <span><iconify-icon icon="lucide:users"></iconify-icon><strong>{awardedFor(rule.id)}</strong> members awarded</span>
                </div>
              </div>
              <BDGToggle on={rule.active} onClick={() => toggleRule(rule.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- tabs shell */
function BDGTabs({ tab, setTab }) {
  const TABS = [
    { key: "dashboard", label: "Dashboard", icon: "lucide:layout-grid" },
    { key: "library", label: "All Badges", icon: "lucide:award" },
    { key: "rules", label: "Automation Rules", icon: "lucide:zap" },
  ];
  return (
    <div className="bdg-tabs">
      {TABS.map((t) => (
        <button key={t.key} type="button" className={"bdg-tab" + (tab === t.key ? " is-active" : "")} onClick={() => setTab(t.key)}>
          <iconify-icon icon={t.icon}></iconify-icon>{t.label}
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- detail view */
function BDGDetailView({ badge, assignments, rules, onBack, onRevoke, onEdit }) {
  const [page, setPage] = useStateBDG(1);
  const perPage = 5;

  const holders = useMemoBDG(() => assignments.filter((a) => a.badgeId === badge.id).sort((a, b) => b.dateSort.localeCompare(a.dateSort)), [assignments, badge.id]);
  const active = holders.filter((h) => h.status === "Active");
  const manualCount = active.filter((h) => h.type === "Manual").length;
  const autoCount = active.filter((h) => h.type === "Automated").length;
  const linkedRules = rules.filter((r) => r.badgeId === badge.id);

  const pageCount = Math.max(1, Math.ceil(holders.length / perPage));
  const safePage = Math.min(page, pageCount);
  const pageRows = holders.slice((safePage - 1) * perPage, (safePage - 1) * perPage + perPage);

  return (
    <div className="bdg-view">
      <button type="button" className="bdg-back-btn" onClick={onBack}><iconify-icon icon="lucide:arrow-left"></iconify-icon>Back</button>

      <div className="bdg-detail-head">
        <BDGBadgeIcon badge={badge} size={72} />
        <div className="bdg-detail-head-body">
          <div className="bdg-detail-head-top">
            <h1>{badge.name}</h1>
            {badge.status === "Archived" && <span className="bdg-archived-tag">Archived</span>}
          </div>
          <BDGCategoryPill category={badge.category} />
          <p>{badge.description}</p>
        </div>
        <button className="bdg-btn bdg-btn-ghost" type="button" onClick={() => onEdit(badge)}><iconify-icon icon="lucide:pencil"></iconify-icon>Edit Badge</button>
      </div>

      <div className="bdg-stat-grid bdg-stat-grid-3">
        <div className="bdg-stat-card">
          <span className="bdg-stat-icon" style={{ background: "var(--gray-100)", color: "var(--brand-navy)" }}><iconify-icon icon="lucide:users"></iconify-icon></span>
          <div className="bdg-stat-body"><div className="bdg-stat-label">Total Awarded</div><div className="bdg-stat-value">{active.length}</div></div>
        </div>
        <div className="bdg-stat-card">
          <span className="bdg-stat-icon" style={{ background: "var(--brand-gold-100)", color: "var(--brand-gold)" }}><iconify-icon icon="lucide:hand"></iconify-icon></span>
          <div className="bdg-stat-body"><div className="bdg-stat-label">Manual</div><div className="bdg-stat-value">{manualCount}</div></div>
        </div>
        <div className="bdg-stat-card">
          <span className="bdg-stat-icon" style={{ background: "var(--ai-purple-100)", color: "var(--ai-purple)" }}><iconify-icon icon="lucide:zap"></iconify-icon></span>
          <div className="bdg-stat-body"><div className="bdg-stat-label">Automated</div><div className="bdg-stat-value">{autoCount}</div></div>
        </div>
      </div>

      {linkedRules.length > 0 && (
        <div className="bdg-card">
          <div className="bdg-card-head"><span className="bdg-card-title-text">Linked Rules</span></div>
          <div className="bdg-linked-rules">
            {linkedRules.map((r) => (
              <div className="bdg-linked-rule" key={r.id}>
                <span className={"bdg-rule-active" + (r.active ? "" : " is-off")}><span className="bdg-rule-active-dot" />{r.active ? "Active" : "Inactive"}</span>
                <span className="bdg-linked-rule-name">{r.name}</span>
                <span className="bdg-linked-rule-crit">{bdgCriteriaSummary(r)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bdg-card">
        <div className="bdg-card-head"><span className="bdg-card-title-text">Holders</span></div>
        <div className="bdg-table">
          <div className="bdg-row-grid bdg-thead bdg-thead-holders">
            <span className="bdg-th">MEMBER</span>
            <span className="bdg-th">TYPE</span>
            <span className="bdg-th">DATE</span>
            <span className="bdg-th">STATUS</span>
            <span />
          </div>
          {pageRows.map((h) => {
            const member = bdgMemberById(h.memberId);
            if (!member) return null;
            return (
              <div key={h.id} className="bdg-row-grid bdg-trow bdg-trow-holders">
                <div className="bdg-trow-user">
                  <BDGAvatar name={member.name} avatar={member.avatar} size={32} />
                  <div>
                    <div className="bdg-holder-name">{member.name}</div>
                    <div className="bdg-holder-email">{member.email}</div>
                  </div>
                </div>
                <BDGTypePill type={h.type} />
                <span className="bdg-meta-cell">{h.date}</span>
                <BDGStatusPill status={h.status} />
                <button
                  type="button"
                  className="bdg-link bdg-danger"
                  disabled={h.status === "Revoked"}
                  onClick={() => onRevoke(h.id)}
                >
                  Revoke
                </button>
              </div>
            );
          })}
          {holders.length === 0 && <div className="bdg-empty-row">No one has earned this badge yet.</div>}
        </div>
        {pageCount > 1 && (
          <div className="bdg-pagebtn-group" style={{ marginTop: 16, justifyContent: "flex-end" }}>
            <button className="bdg-pagebtn" disabled={safePage <= 1} type="button" onClick={() => setPage(safePage - 1)}><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>
            <span className="bdg-pageindicator">{safePage} / {pageCount}</span>
            <button className="bdg-pagebtn" disabled={safePage >= pageCount} type="button" onClick={() => setPage(safePage + 1)}><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------- create/edit modal */
function BDGCreateModal({ editing, onClose, onSave }) {
  const [name, setName] = useStateBDG(editing ? editing.name : "");
  const [description, setDescription] = useStateBDG(editing ? editing.description : "");
  const [icon, setIcon] = useStateBDG(editing ? editing.icon : null);
  const [category, setCategory] = useStateBDG(editing ? editing.category : BDG_CATEGORIES[0]);
  const [notify, setNotify] = useStateBDG(editing ? editing.notify : true);

  const canSubmit = name.trim().length > 0 && description.trim().length > 0 && !!icon;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({ name: name.trim(), description: description.trim(), icon, category, notify });
  };

  const handleUploadIcon = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target.files || [])[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setIcon(reader.result);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="bdg-modal-overlay" onClick={onClose}>
      <div className="bdg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bdg-modal-head">
          <h2>{editing ? "Edit Badge" : "Create Badge"}</h2>
          <button className="bdg-modal-close" type="button" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>

        <label className="bdg-field-label">Badge Icon <span className="bdg-req">*</span></label>
        <div className="bdg-icon-upload-row">
          <span className="bdg-icon-upload-preview">
            {bdgIsCustomIcon(icon) ? <img src={icon} alt="" /> : <iconify-icon icon="lucide:image"></iconify-icon>}
          </span>
          <div className="bdg-icon-upload-actions">
            <button className="bdg-btn bdg-btn-outline bdg-btn-sm" type="button" onClick={handleUploadIcon}>
              <iconify-icon icon="lucide:upload"></iconify-icon>Upload custom icon
            </button>
            {bdgIsCustomIcon(icon) && (
              <button className="bdg-icon-upload-clear" type="button" onClick={() => setIcon(null)}>Remove</button>
            )}
            <span className="bdg-icon-upload-hint">PNG, JPG or SVG</span>
          </div>
        </div>
        <div className="bdg-icon-grid">
          {BDG_ICON_OPTIONS.map((ic) => (
            <button key={ic} type="button" className={"bdg-icon-opt" + (icon === ic ? " is-selected" : "")} onClick={() => setIcon(ic)}>
              <iconify-icon icon={ic}></iconify-icon>
            </button>
          ))}
        </div>

        <label className="bdg-field-label">Badge Name <span className="bdg-req">*</span></label>
        <input className="bdg-input" placeholder="e.g. Gold Tier Member" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="bdg-field-label">Description <span className="bdg-req">*</span></label>
        <textarea className="bdg-textarea" placeholder="What does this badge represent?" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="bdg-field-label">Category</label>
        <div className="bdg-select-wrap">
          <select className="bdg-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {BDG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <iconify-icon icon="lucide:chevron-down"></iconify-icon>
        </div>

        <div className="bdg-notify-row">
          <label className="bdg-topic-check">
            <input type="checkbox" checked={notify} onChange={() => setNotify((n) => !n)} />
            <span className="bdg-topic-box"><iconify-icon icon="lucide:check"></iconify-icon></span>
            <span>Enable User Notifications</span>
          </label>
        </div>

        <div className="bdg-modal-actions">
          <button className="bdg-btn bdg-btn-outline" type="button" onClick={onClose}>Cancel</button>
          <button className="bdg-btn bdg-btn-navy" type="button" disabled={!canSubmit} onClick={handleSubmit}>{editing ? "Save Changes" : "Create Badge"}</button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- assign modal */
function BDGAssignModal({ badge, assignments, onClose, onAssign }) {
  const [query, setQuery] = useStateBDG("");
  const [selected, setSelected] = useStateBDG({});
  const [note, setNote] = useStateBDG("");

  const holderIds = useMemoBDG(() => new Set(assignments.filter((a) => a.badgeId === badge.id && a.status === "Active").map((a) => a.memberId)), [assignments, badge.id]);

  const filtered = useMemoBDG(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BDG_MEMBERS;
    return BDG_MEMBERS.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [query]);

  const toggle = (id) => setSelected((st) => ({ ...st, [id]: !st[id] }));
  const count = Object.values(selected).filter(Boolean).length;

  const handleSubmit = () => {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    if (!ids.length) return;
    onAssign(ids, note.trim());
  };

  return (
    <div className="bdg-modal-overlay" onClick={onClose}>
      <div className="bdg-modal bdg-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="bdg-modal-head">
          <div className="bdg-modal-head-badge">
            <BDGBadgeIcon badge={badge} size={40} />
            <div>
              <h2>Assign badge</h2>
              <div className="bdg-modal-head-sub">{badge.name}</div>
            </div>
          </div>
          <button className="bdg-modal-close" type="button" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>

        <div className="bdg-search-input-wrap" style={{ marginBottom: 14 }}>
          <iconify-icon icon="lucide:search"></iconify-icon>
          <input placeholder="Search members by name or email..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="bdg-member-list">
          {filtered.map((m) => {
            const already = holderIds.has(m.id);
            const on = !!selected[m.id];
            return (
              <button type="button" key={m.id} className={"bdg-member-row" + (already ? " is-disabled" : "")} onClick={() => !already && toggle(m.id)} disabled={already}>
                <BDGCheck on={on || already} disabled={already} />
                <BDGAvatar name={m.name} avatar={m.avatar} size={36} />
                <span className="bdg-member-info">
                  <span className="bdg-member-name">{m.name}</span>
                  <span className="bdg-member-email">{m.email}</span>
                </span>
                <span className="bdg-member-tier">{m.tier}</span>
                {already && <span className="bdg-already-tag">Already earned</span>}
              </button>
            );
          })}
        </div>

        <label className="bdg-field-label" style={{ marginTop: 18 }}>Note <span className="bdg-optional">(optional)</span></label>
        <textarea className="bdg-textarea" style={{ minHeight: 64 }} placeholder="Add a note for the audit log..." value={note} onChange={(e) => setNote(e.target.value)} />

        <div className="bdg-modal-actions bdg-modal-actions-assign">
          <span className="bdg-selected-count">{count} member{count === 1 ? "" : "s"} selected</span>
          <div className="bdg-modal-actions-btns">
            <button className="bdg-btn bdg-btn-outline" type="button" onClick={onClose}>Cancel</button>
            <button className="bdg-btn bdg-btn-navy" type="button" disabled={count === 0} onClick={handleSubmit}>Assign badge</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- create rule modal */
function BDGRuleModal({ badges, onClose, onCreate }) {
  const activeBadges = badges.filter((b) => b.status === "Active");
  const [badgeId, setBadgeId] = useStateBDG(activeBadges[0] ? activeBadges[0].id : "");
  const [name, setName] = useStateBDG("");
  const [criteriaType, setCriteriaType] = useStateBDG("tier");
  const [threshold, setThreshold] = useStateBDG(BDG_TIERS[2]);

  const meta = bdgCriteriaMeta(criteriaType);
  const estimate = useMemoBDG(() => bdgEstimateQualifying(criteriaType, threshold), [criteriaType, threshold]);
  const canSubmit = name.trim().length > 0 && !!badgeId && (meta.valueType === "none" || threshold.trim().length > 0);

  const handleCriteriaChange = (key) => {
    setCriteriaType(key);
    const m = bdgCriteriaMeta(key);
    setThreshold(m.valueType === "tier" ? BDG_TIERS[2] : m.valueType === "none" ? "" : "");
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({ name: name.trim(), badgeId, criteriaType, threshold: threshold.trim() });
  };

  return (
    <div className="bdg-modal-overlay" onClick={onClose}>
      <div className="bdg-modal bdg-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="bdg-modal-head">
          <h2>Create Rule</h2>
          <button className="bdg-modal-close" type="button" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>

        <label className="bdg-field-label">Rule Name <span className="bdg-req">*</span></label>
        <input className="bdg-input" placeholder="e.g. Mastery Tier Achievers" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="bdg-field-label">Badge to award <span className="bdg-req">*</span></label>
        <div className="bdg-select-wrap">
          <select className="bdg-select" value={badgeId} onChange={(e) => setBadgeId(e.target.value)}>
            {activeBadges.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <iconify-icon icon="lucide:chevron-down"></iconify-icon>
        </div>

        <label className="bdg-field-label">Criteria</label>
        <div className="bdg-criteria-grid">
          {BDG_CRITERIA_TYPES.map((c) => (
            <button key={c.key} type="button" className={"bdg-criteria-opt" + (criteriaType === c.key ? " is-active" : "")} onClick={() => handleCriteriaChange(c.key)}>
              <iconify-icon icon={c.icon}></iconify-icon>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {meta.valueType === "tier" && (
          <>
            <label className="bdg-field-label">Threshold</label>
            <div className="bdg-select-wrap">
              <select className="bdg-select" value={threshold} onChange={(e) => setThreshold(e.target.value)}>
                {BDG_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </div>
          </>
        )}
        {(meta.valueType === "text" || meta.valueType === "number") && (
          <>
            <label className="bdg-field-label">Threshold</label>
            <input className="bdg-input" type={meta.valueType === "number" ? "number" : "text"} placeholder={meta.placeholder} value={threshold} onChange={(e) => setThreshold(e.target.value)} />
          </>
        )}

        <div className="bdg-estimate-card">
          <iconify-icon icon="lucide:users"></iconify-icon>
          <div>
            <div className="bdg-estimate-num">{estimate} member{estimate === 1 ? "" : "s"}</div>
            <div className="bdg-estimate-sub">estimated to qualify right now</div>
          </div>
        </div>

        <div className="bdg-modal-actions">
          <button className="bdg-btn bdg-btn-outline" type="button" onClick={onClose}>Cancel</button>
          <button className="bdg-btn bdg-btn-navy" type="button" disabled={!canSubmit} onClick={handleSubmit}>Activate Rule</button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- root */
function BDGApp() {
  const [badges, setBadges] = useStateBDG(BDG_INITIAL_BADGES);
  const [assignments, setAssignments] = useStateBDG(BDG_INITIAL_ASSIGNMENTS);
  const [rules, setRules] = useStateBDG(BDG_INITIAL_RULES);

  const [tab, setTab] = useStateBDG("dashboard");
  const [detailBadge, setDetailBadge] = useStateBDG(null);

  const [createModal, setCreateModal] = useStateBDG(null); // { editing: badge|null } | null
  const [assignModal, setAssignModal] = useStateBDG(null); // badge | null
  const [ruleModal, setRuleModal] = useStateBDG(false);
  const [toast, setToast] = useStateBDG("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast((cur) => (cur === msg ? "" : cur)), 3200); };

  const openDetail = (badge) => setDetailBadge(badge);
  const closeDetail = () => setDetailBadge(null);

  const openCreate = () => setCreateModal({ editing: null });
  const openEdit = (badge) => setCreateModal({ editing: badge });

  const handleSaveBadge = (draft) => {
    if (createModal.editing) {
      setBadges((st) => st.map((b) => (b.id === createModal.editing.id ? { ...b, ...draft } : b)));
      if (detailBadge && detailBadge.id === createModal.editing.id) setDetailBadge((d) => ({ ...d, ...draft }));
      showToast("Badge updated.");
    } else {
      const id = "b" + Math.random().toString(16).slice(2, 8);
      setBadges((st) => [...st, { id, status: "Active", ...draft }]);
      showToast("Badge created.");
    }
    setCreateModal(null);
  };

  const handleToggleArchive = (badge) => {
    setBadges((st) => st.map((b) => (b.id === badge.id ? { ...b, status: b.status === "Archived" ? "Active" : "Archived" } : b)));
  };

  const handleAssign = (memberIds, note) => {
    const badge = assignModal;
    const today = "07 Aug 2026";
    const newRecords = memberIds.map((memberId) => ({
      id: "a" + Math.random().toString(16).slice(2, 8),
      badgeId: badge.id,
      memberId,
      type: "Manual",
      date: today,
      dateSort: "2026-08-07",
      status: "Active",
      note: note || undefined,
    }));
    setAssignments((st) => [...st, ...newRecords]);
    setAssignModal(null);
    showToast("Assigned to " + memberIds.length + " member" + (memberIds.length === 1 ? "" : "s") + (badge.notify ? " — notifications sent." : "."));
  };

  const handleRevoke = (assignmentId) => {
    setAssignments((st) => st.map((a) => (a.id === assignmentId ? { ...a, status: "Revoked" } : a)));
    showToast("Assignment revoked.");
  };

  const toggleRule = (ruleId) => setRules((st) => st.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r)));

  const handleCreateRule = (draft) => {
    const id = "r" + Math.random().toString(16).slice(2, 8);
    setRules((st) => [...st, { id, active: true, ...draft }]);
    setRuleModal(false);
    showToast("Rule activated.");
  };

  return (
    <div className="bdg-shell">
      <BDGSidebar />
      <main className="bdg-main">
        <BDGHeader />
        <div className="bdg-content">
          {detailBadge ? (
            <BDGDetailView badge={detailBadge} assignments={assignments} rules={rules} onBack={closeDetail} onRevoke={handleRevoke} onEdit={openEdit} />
          ) : (
            <>
              <BDGTabs tab={tab} setTab={setTab} />
              {tab === "dashboard" && (
                <BDGDashboardView badges={badges} assignments={assignments} rules={rules} openCreate={openCreate} openDetail={openDetail} goLibrary={() => setTab("library")} />
              )}
              {tab === "library" && (
                <BDGLibraryView badges={badges} assignments={assignments} openCreate={openCreate} openEdit={openEdit} openAssign={setAssignModal} openDetail={openDetail} onToggleArchive={handleToggleArchive} />
              )}
              {tab === "rules" && (
                <BDGRulesView rules={rules} badges={badges} assignments={assignments} toggleRule={toggleRule} openCreateRule={() => setRuleModal(true)} openDetail={openDetail} />
              )}
            </>
          )}
        </div>
      </main>

      {createModal && <BDGCreateModal editing={createModal.editing} onClose={() => setCreateModal(null)} onSave={handleSaveBadge} />}
      {assignModal && <BDGAssignModal badge={assignModal} assignments={assignments} onClose={() => setAssignModal(null)} onAssign={handleAssign} />}
      {ruleModal && <BDGRuleModal badges={badges} onClose={() => setRuleModal(false)} onCreate={handleCreateRule} />}
      <BDGToast message={toast} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<BDGApp />);
