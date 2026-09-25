/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Ways to Earn (Screen 1)
   Desktop admin console. Manages the catalog of point-earning actions that
   members see on their own "Ways to Earn" page — the same name is used here
   so admins know exactly what they are editing. Basics (name, category,
   points, on/off, platforms) are always visible; Limits, Quality checks,
   Approval & safety and Badge reward live in collapsible sections that show
   a one-line summary while closed. Basics also holds the Reward UI picker
   (action.celebration → reward-router.js surface) and a third column runs
   ActPhoneSim, a phone mock that replays the chosen payout experience.
   Every section and field carries an "i"
   tip. Backed by window.PFLoyalty (see loyalty-engine.js) so edits show up
   immediately in Ways to Earn, Tier Multipliers and the Audit Ledger.
   Classes prefixed act- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateACT, useMemo: useMemoACT, useEffect: useEffectACT, useRef: useRefACT } = React;
const PF_ACT = window.PFLoyalty;

function goACT(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const CATEGORIES_ACT = ["Onboarding", "Profile", "Credentials", "Feed (Admin Posts)", "Community", "Learning", "Events", "Cross-Platform", "Social Growth & Referral", "Streaks", "Follower Milestones", "Reviews", "Purchases"];
/* The Reward UI a way to earn fires when it pays out — the reward router's
   surfaces (reward-router.js KINDS). Stored as action.celebration. */
const CELEBRATIONS_ACT = [
  { key: "indicator", label: "Points indicator", icon: "lucide:plus-circle", desc: "A small “+N” floats up from the button, the header pill counts up and a coin chime plays. For everyday actions." },
  { key: "streak", label: "Streak screen", icon: "lucide:flame", desc: "The full-screen “Welcome back · Day N in a row” takeover with the week’s dots. For daily-consistency rewards." },
  { key: "goalReached", label: "Goal reached", icon: "lucide:target", desc: "The Goal Reached page: today’s total and the next mark on the daily ladder." },
  { key: "rewardSplash", label: "Reward splash", icon: "lucide:sparkles", desc: "A purple overlay with the points that fades out by itself after 2.5 seconds. For one meaningful milestone." },
  { key: "major", label: "Major celebration", icon: "lucide:party-popper", desc: "A full-page celebration with confetti for one big reward, with a “Keep earning” button." },
  { key: "combined", label: "Combined celebration", icon: "lucide:layers", desc: "The full-page celebration listing several rewards unlocked by the same move." }
];
const celebACT = (key) => CELEBRATIONS_ACT.find((c) => c.key === key) || CELEBRATIONS_ACT[0];
const STATUS_ACT = { live: { label: "Live in prototype", cls: "live" }, partial: { label: "Partially live", cls: "partial" }, planned: { label: "Not yet built", cls: "planned" } };
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
const ACT_CATEGORY_ICONS = {
  Onboarding: "lucide:rocket", Profile: "lucide:user-round", Credentials: "lucide:badge-check", "Feed (Admin Posts)": "lucide:newspaper",
  Community: "lucide:users", Learning: "lucide:graduation-cap", Events: "lucide:calendar-days", "Cross-Platform": "lucide:smartphone",
  "Social Growth & Referral": "lucide:user-plus", Streaks: "lucide:flame", "Follower Milestones": "lucide:trending-up",
  Reviews: "lucide:star", Purchases: "lucide:shopping-bag", Social: "lucide:heart", Habit: "lucide:calendar-check"
};
const ACT_TIPS = {
  basics: "The essentials: what this way to earn is called, where it sits on the member's Ways to Earn list, and how many points it pays.",
  name: "Shown to members on their Ways to Earn list and in their points history.",
  category: "Groups this with similar ways to earn on the member's Ways to Earn page.",
  points: "Points paid each time a member completes this. Tier multipliers are added on top automatically.",
  active: "Switch off to hide this from members and stop points, without deleting it.",
  platforms: "Only completions made on the ticked platforms earn points.",
  celebration: "What the member sees the moment this pays out. Everyday actions keep the small points indicator; milestones get a splash or a full-page celebration. Badge unlocks and level-ups always add their own splash on top.",
  limits: "Stops members earning unlimited points by repeating the same thing.",
  dailyCap: "Most times this pays points per member each day. Leave empty for no limit.",
  weeklyCap: "Most times this pays points per member each week. Leave empty for no limit.",
  lifetimeCap: "Most times this pays points per member, ever. Leave empty for no limit.",
  cooldown: "Minimum wait between two paid completions. Anything inside the wait earns 0 points.",
  once: "Members can earn this only once. Doing it again records a 0-point entry.",
  quality: "Simple checks that filter out low-effort or spam completions before points are paid.",
  minChars: "Text shorter than this earns nothing. Useful for comments and bios.",
  media: "A photo, video or file must be attached before points are paid.",
  safety: "Extra protection for high-value ways to earn that could be abused.",
  approval: "Points stay pending until an admin approves the completion in the Audit Ledger.",
  hold: "Days points stay pending before they are released. 0 pays instantly.",
  note: "Only admins see this. Use it to explain the rule or record fraud checks.",
  badge: "Optionally unlock a collectible badge the moment a member completes this.",
  badgePick: "Badges come from the Reward Editor. Leave as none if this shouldn't unlock a badge."
};

function AdlInfo({ text, left }) {
  return (
    <span className={"adl-info" + (left ? " is-left" : "")} tabIndex={0} role="img" aria-label={text}>
      <iconify-icon icon="lucide:info"></iconify-icon>
      <span className="adl-info-tip" aria-hidden="true">{text}</span>
    </span>
  );
}

function ActField({ label, tip, hint, children, className }) {
  return (
    <div className={"adl-field act-field" + (className ? " " + className : "")}>
      <label><span>{label}</span>{tip && <AdlInfo text={tip} />}</label>
      {children}
      {hint && <span className="adl-field-hint">{hint}</span>}
    </div>
  );
}

function ActSwitch({ label, tip, sub, on, onToggle }) {
  return (
    <div className="act-switch">
      <div className="act-switch-text">
        <div className="act-switch-label"><span>{label}</span>{tip && <AdlInfo text={tip} />}</div>
        {sub && <div className="act-switch-sub">{sub}</div>}
      </div>
      <AdlToggle on={on} onToggle={onToggle} label={label} />
    </div>
  );
}

/* collapsible section: closed by default, shows a one-line summary */
function ActSection({ icon, title, tip, summary, open, onToggle, children }) {
  return (
    <div className={"adl-card act-section" + (open ? " is-open" : "")}>
      <button type="button" className="act-section-head" onClick={onToggle} aria-expanded={open}>
        <span className="act-section-icon"><iconify-icon icon={icon}></iconify-icon></span>
        <span className="act-section-text">
          <span className="act-section-title"><span>{title}</span>{tip && <AdlInfo text={tip} left />}</span>
          {!open && <span className="act-section-summary">{summary}</span>}
        </span>
        <iconify-icon icon="lucide:chevron-down" class="act-section-chev"></iconify-icon>
      </button>
      {open && <div className="act-section-body">{children}</div>}
    </div>
  );
}

function actDuration(sec) {
  if (!sec) return null;
  if (sec < 60) return sec + " sec";
  if (sec < 3600) return Math.round(sec / 60) + " min";
  return (Math.round((sec / 3600) * 10) / 10) + " hr";
}
function actPlatformNames(list) {
  const names = PLATFORMS_ACT.filter((p) => list.includes(p.key)).map((p) => p.label.replace(" UI", "").replace(" App", ""));
  if (!names.length) return "no platforms";
  if (names.length === 1) return names[0];
  return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
}
function actLimitsSummary(a) {
  if (a.oneTimeLock) return "Once only";
  const bits = [];
  if (a.dailyCap != null) bits.push(a.dailyCap + "/day");
  if (a.weeklyCap != null) bits.push(a.weeklyCap + "/week");
  if (a.lifetimeCap != null) bits.push(a.lifetimeCap + " total");
  if (a.velocitySeconds) bits.push(actDuration(a.velocitySeconds) + " cooldown");
  return bits.length ? bits.join(" · ") : "No limits";
}
function actQualitySummary(a) {
  const bits = [];
  if (a.minCharacters) bits.push("Min " + a.minCharacters + " characters");
  if (a.requiresMedia) bits.push("Photo or file required");
  return bits.length ? bits.join(" · ") : "No checks";
}
function actSafetySummary(a) {
  const bits = [];
  if (a.requiresApproval) bits.push("Admin approval");
  if (a.holdDays) bits.push("Held " + a.holdDays + " day" + (a.holdDays === 1 ? "" : "s"));
  if (a.guardrail) bits.push("Has internal note");
  return bits.length ? bits.join(" · ") : "Points paid instantly";
}

/* one plain-English sentence describing the rule as configured */
function ActPlainSummary({ a, badgeName }) {
  const limits = [];
  if (a.oneTimeLock) limits.push("only once ever");
  else {
    if (a.dailyCap != null) limits.push("up to " + a.dailyCap + "× a day");
    if (a.weeklyCap != null) limits.push(a.weeklyCap + "× a week");
    if (a.lifetimeCap != null) limits.push(a.lifetimeCap + "× in total");
  }
  const cool = !a.oneTimeLock && a.velocitySeconds ? "with at least " + actDuration(a.velocitySeconds) + " between completions" : null;
  return (
    <div className={"act-plain" + (a.active ? "" : " is-off")}>
      <span className="act-plain-icon"><iconify-icon icon={a.active ? "lucide:sparkles" : "lucide:pause-circle"}></iconify-icon></span>
      <p>
        {a.active ? "Members earn " : "When switched on, members would earn "}
        <b>{a.basePoints} pts</b> each time they <b>{a.label || "complete this"}</b>
        {limits.length ? ", " + limits.join(", ") : ""}
        {cool ? ", " + cool : ""}
        {". Available on " + actPlatformNames(a.platforms) + "."}
        {a.requiresApproval ? " Points wait for admin approval." : a.holdDays ? " Points are released after " + a.holdDays + " day" + (a.holdDays === 1 ? "" : "s") + "." : ""}
        {badgeName ? " Also unlocks the " + badgeName + " badge." : ""}
        {" Shown as a " + celebACT(a.celebration).label.toLowerCase() + "."}
        {!a.active && <span className="act-plain-off"> Currently switched off.</span>}
      </p>
    </div>
  );
}

function ActList({ actions, selectedId, onSelect, search, setSearch, total }) {
  const groups = useMemoACT(() => {
    const map = new Map();
    actions.forEach((a) => { if (!map.has(a.category)) map.set(a.category, []); map.get(a.category).push(a); });
    return CATEGORIES_ACT.filter((c) => map.has(c)).map((c) => ({ category: c, items: map.get(c) }))
      .concat([...map.keys()].filter((c) => !CATEGORIES_ACT.includes(c)).map((c) => ({ category: c, items: map.get(c) })));
  }, [actions]);
  return (
    <div className="act-list-col">
      <div className="act-search-wrap"><iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Search ways to earn…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="act-list-count">{actions.length === total ? total + " ways to earn" : actions.length + " of " + total}</div>
      <div className="act-list">
        {groups.map((g) => (
          <div key={g.category} className="act-group">
            <div className="act-group-head"><iconify-icon icon={ACT_CATEGORY_ICONS[g.category] || "lucide:tag"}></iconify-icon>{g.category}</div>
            {g.items.map((a) => (
              <button key={a.id} type="button" className={"act-list-row" + (a.id === selectedId ? " is-active" : "") + (a.active ? "" : " is-off")} onClick={() => onSelect(a.id)}>
                <span className="act-list-row-name">{a.label}</span>
                <span className="act-pts-pill">{a.basePoints} pts</span>
              </button>
            ))}
          </div>
        ))}
        {actions.length === 0 && <p className="act-list-empty">Nothing matches “{search}”.</p>}
      </div>
    </div>
  );
}

function ActEditor({ action, stored, achievementBadges, onChange, onSave, onNew, dirty }) {
  const [open, setOpen] = useStateACT({});
  if (!action) return (
    <div className="adl-card act-empty"><iconify-icon icon="lucide:mouse-pointer-click"></iconify-icon><p>Pick a way to earn on the left, or add a new one.</p></div>
  );
  const set = (patch) => onChange({ ...action, ...patch });
  const toggleOpen = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const togglePlatform = (key) => {
    const has = action.platforms.includes(key);
    set({ platforms: has ? action.platforms.filter((p) => p !== key) : action.platforms.concat([key]) });
  };
  const numOrNull = (v) => (v === "" ? null : Math.max(0, Number(v) || 0));
  const badge = achievementBadges.find((b) => "badge:" + b.key === action.linkedReward);

  return (
    <div className="act-editor">
      <div className="act-editor-head">
        <div className="act-editor-title">
          <h1>{action.label || "Untitled"}</h1>
          <span className={"act-status" + (action.active ? " on" : "")}>{action.active ? "On" : "Off"}</span>
          {action.isNew && <span className="act-status new">Not saved yet</span>}
          {!action.isNew && STATUS_ACT[action.status] && <span className={"act-status build-" + STATUS_ACT[action.status].cls}>{STATUS_ACT[action.status].label}</span>}
        </div>
        <div className="adl-page-head-actions">
          <button className="adl-btn adl-btn-ghost" type="button" onClick={onNew}><iconify-icon icon="lucide:plus"></iconify-icon>Add new</button>
          <button className="adl-btn adl-btn-navy" type="button" onClick={onSave} disabled={!dirty}><iconify-icon icon="lucide:check"></iconify-icon>{dirty ? "Save changes" : "Saved"}</button>
        </div>
      </div>

      <ActPlainSummary a={action} badgeName={badge && badge.name} />

      <div className="adl-card act-basics">
        <div className="act-card-title"><iconify-icon icon="lucide:pencil-line"></iconify-icon><span>Basics</span><AdlInfo text={ACT_TIPS.basics} left /></div>
        <div className="act-basics-grid">
          <ActField label="Name" tip={ACT_TIPS.name} className="act-span-2">
            <input type="text" value={action.label} placeholder="e.g. Write a Product Review" onChange={(e) => set({ label: e.target.value })} />
          </ActField>
          <ActField label="Category" tip={ACT_TIPS.category}>
            <select value={action.category} onChange={(e) => set({ category: e.target.value })}>
              {CATEGORIES_ACT.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </ActField>
          <ActField label="Points per completion" tip={ACT_TIPS.points}>
            <div className="act-points-input"><input type="number" min="0" value={action.basePoints} onChange={(e) => set({ basePoints: Math.max(0, Number(e.target.value) || 0) })} /><span>pts</span></div>
          </ActField>
          <div className="act-span-2">
            <ActSwitch label="Switched on" tip={ACT_TIPS.active} sub={action.active ? "Members can see and earn this." : "Hidden from members. Nothing is deleted."} on={action.active} onToggle={() => set({ active: !action.active })} />
          </div>
          <ActField label="What members see when they earn it" tip={ACT_TIPS.celebration} className="act-span-2">
            <div className="act-celeb-grid" role="radiogroup">
              {CELEBRATIONS_ACT.map((c) => {
                const on = (action.celebration || "indicator") === c.key;
                return (
                  <label key={c.key} className={"act-celeb-card" + (on ? " is-on" : "")}>
                    <input type="radio" name="act-celebration" value={c.key} checked={on} onChange={() => set({ celebration: c.key })} />
                    <span className="act-celeb-icon"><iconify-icon icon={c.icon}></iconify-icon></span>
                    <span className="act-celeb-text"><b>{c.label}</b><small>{c.desc}</small></span>
                    {on && <iconify-icon icon="lucide:check-circle-2" class="act-celeb-check"></iconify-icon>}
                  </label>
                );
              })}
            </div>
          </ActField>
          <ActField label="Where members can do this" tip={ACT_TIPS.platforms} className="act-span-2">
            <div className="act-platform-row">
              {PLATFORMS_ACT.map((p) => (
                <label key={p.key} className={"act-platform-chip" + (action.platforms.includes(p.key) ? " is-on" : "")}>
                  <input type="checkbox" checked={action.platforms.includes(p.key)} onChange={() => togglePlatform(p.key)} />
                  <iconify-icon icon={action.platforms.includes(p.key) ? "lucide:check" : "lucide:plus"}></iconify-icon>
                  {p.label}
                </label>
              ))}
            </div>
          </ActField>
        </div>
        <div className="act-key">ID <code>{action.id}</code>{!action.isNew && <span> · can't be changed</span>}</div>
      </div>

      <div className="act-more-label">More settings <span>optional</span></div>

      <ActSection icon="lucide:gauge" title="Limits" tip={ACT_TIPS.limits} summary={actLimitsSummary(action)} open={!!open.limits} onToggle={() => toggleOpen("limits")}>
        <div className="act-grid-3">
          <ActField label="Per day" tip={ACT_TIPS.dailyCap}><input type="number" min="0" placeholder="No limit" value={action.dailyCap ?? ""} onChange={(e) => set({ dailyCap: numOrNull(e.target.value) })} /></ActField>
          <ActField label="Per week" tip={ACT_TIPS.weeklyCap}><input type="number" min="0" placeholder="No limit" value={action.weeklyCap ?? ""} onChange={(e) => set({ weeklyCap: numOrNull(e.target.value) })} /></ActField>
          <ActField label="Lifetime" tip={ACT_TIPS.lifetimeCap}><input type="number" min="0" placeholder="No limit" value={action.lifetimeCap ?? ""} onChange={(e) => set({ lifetimeCap: numOrNull(e.target.value) })} /></ActField>
        </div>
        <div className="act-grid-2">
          <ActField label="Cooldown between completions" tip={ACT_TIPS.cooldown} hint={action.velocitySeconds ? "= " + actDuration(action.velocitySeconds) : "0 = no cooldown"}>
            <div className="act-points-input"><input type="number" min="0" value={action.velocitySeconds} onChange={(e) => set({ velocitySeconds: Math.max(0, Number(e.target.value) || 0) })} /><span>seconds</span></div>
          </ActField>
          <ActSwitch label="Can only be earned once" tip={ACT_TIPS.once} sub="Ignores the limits above." on={action.oneTimeLock} onToggle={() => set({ oneTimeLock: !action.oneTimeLock })} />
        </div>
      </ActSection>

      <ActSection icon="lucide:badge-check" title="Quality checks" tip={ACT_TIPS.quality} summary={actQualitySummary(action)} open={!!open.quality} onToggle={() => toggleOpen("quality")}>
        <div className="act-grid-2">
          <ActField label="Minimum text length" tip={ACT_TIPS.minChars} hint="0 = no minimum">
            <div className="act-points-input"><input type="number" min="0" value={action.minCharacters} onChange={(e) => set({ minCharacters: Math.max(0, Number(e.target.value) || 0) })} /><span>characters</span></div>
          </ActField>
          <ActSwitch label="Must include a photo or file" tip={ACT_TIPS.media} on={action.requiresMedia} onToggle={() => set({ requiresMedia: !action.requiresMedia })} />
        </div>
      </ActSection>

      <ActSection icon="lucide:shield-check" title="Approval & safety" tip={ACT_TIPS.safety} summary={actSafetySummary(action)} open={!!open.safety} onToggle={() => toggleOpen("safety")}>
        <div className="act-grid-2">
          <ActSwitch label="Admin approves before points are paid" tip={ACT_TIPS.approval} on={action.requiresApproval} onToggle={() => set({ requiresApproval: !action.requiresApproval })} />
          <ActField label="Hold points for" tip={ACT_TIPS.hold} hint="0 = paid instantly">
            <div className="act-points-input"><input type="number" min="0" value={action.holdDays} onChange={(e) => set({ holdDays: Math.max(0, Number(e.target.value) || 0) })} /><span>days</span></div>
          </ActField>
        </div>
        <ActField label="Internal note" tip={ACT_TIPS.note}>
          <textarea value={action.guardrail} placeholder="Only admins see this." onChange={(e) => set({ guardrail: e.target.value })} />
        </ActField>
      </ActSection>

      <ActSection icon="lucide:award" title="Badge reward" tip={ACT_TIPS.badge} summary={badge ? "Unlocks " + badge.name : "None"} open={!!open.badge} onToggle={() => toggleOpen("badge")}>
        <ActField label="Badge unlocked on completion" tip={ACT_TIPS.badgePick} className="act-narrow">
          <select value={action.linkedReward || ""} onChange={(e) => set({ linkedReward: e.target.value || null })}>
            <option value="">None</option>
            {achievementBadges.map((b) => <option key={b.key} value={"badge:" + b.key}>{b.name}</option>)}
          </select>
        </ActField>
      </ActSection>
    </div>
  );
}

/* ============================================================ simulator ==
   Phone preview of how a member experiences the payout: the earn button is
   tapped, then the Reward UI picked in Basics plays — the "+N" float and pill
   count-up (indicator), the Welcome-back streak takeover, the Goal Reached
   page, the 2.5s Reward Splash, or the full-page Major / Combined
   celebration. Copy and colours mirror the real surfaces (app.jsx
   floatPoints, daily-checkin.js, daily-goal.jsx, reward-router.js showSplash,
   combined-celebration.jsx). Lottie mascots are the same JSON files. */
const SIM_LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
const SIM_LOTTIE = { wink: "assets/lottie/checkin-wink.json?v=20260918a", welcome: "assets/lottie/checkin-welcome.json?v=20260917c", wave: "assets/lottie/goal-reached.json?v=20260918a" };
let simLottieLib = null;
function simLoadLottie() {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (simLottieLib) return simLottieLib;
  simLottieLib = new Promise((resolve, reject) => {
    const sc = document.createElement("script"); sc.src = SIM_LOTTIE_LIB; sc.async = true;
    sc.onload = () => resolve(window.lottie); sc.onerror = reject; document.head.appendChild(sc);
  });
  return simLottieLib;
}
function SimLottie({ src, loop }) {
  const ref = useRefACT(null);
  useEffectACT(() => {
    let anim = null, dead = false;
    simLoadLottie().then((lottie) => {
      if (dead || !ref.current || !lottie) return;
      anim = lottie.loadAnimation({ container: ref.current, renderer: "svg", loop: loop !== false, autoplay: true, path: SIM_LOTTIE[src] || SIM_LOTTIE.wink });
    }).catch(() => {});
    return () => { dead = true; try { anim && anim.destroy(); } catch (e) {} };
  }, [src]);
  return <span className="act-ph-lottie" ref={ref} aria-hidden="true" />;
}
function useSimCountUp(target, from, ms, delay, runKey) {
  const [v, setV] = useStateACT(from);
  useEffectACT(() => {
    setV(from);
    if (target === from) return;
    let raf = 0; const t0 = performance.now() + (delay || 0);
    const step = (t) => {
      const p = Math.min(1, Math.max(0, (t - t0) / (ms || 800)));
      setV(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, from, runKey]);
  return v;
}
const SIM_PILL_BASE = 1240, SIM_TODAY_BASE = 130, SIM_STREAK = 4;
function ActPhoneSim({ action, badge }) {
  const [run, setRun] = useStateACT(0);           /* bumps on every replay */
  const [stage, setStage] = useStateACT("idle");  /* idle → tap → show → done */
  const kind = action ? (action.celebration || "indicator") : "indicator";
  const pts = action ? Number(action.basePoints) || 0 : 0;
  const first = "Katy";

  useEffectACT(() => { if (action) setRun((r) => r + 1); }, [action && action.id, kind, pts]);
  useEffectACT(() => {
    if (!run) return;
    setStage("tap");
    const t1 = setTimeout(() => setStage("show"), 450);
    const t2 = kind === "rewardSplash" ? setTimeout(() => setStage("done"), 450 + 2500) : null;
    return () => { clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, [run]);

  const paid = stage === "show" || stage === "done";
  const pill = useSimCountUp(paid ? SIM_PILL_BASE + pts : SIM_PILL_BASE, SIM_PILL_BASE, 900, 150, run);
  const splashPts = useSimCountUp(stage === "show" ? pts : 0, 0, 800, 250, run + ":" + stage);
  const goalMarks = [280, 500, 750, 1000];
  /* the Goal Reached mock always shows a mark being hit: today's total is
     lifted to the first ladder mark when the demo base + payout falls short */
  const todayPts = Math.max(SIM_TODAY_BASE + pts, kind === "goalReached" ? goalMarks[0] : 0);
  const reachedMark = goalMarks.filter((m) => m <= todayPts).pop() || goalMarks[0];
  const nextMark = goalMarks.find((m) => m > todayPts) || null;

  if (!action) return <aside className="act-sim-col"><div className="act-sim-empty">Pick a way to earn to preview the payout here.</div></aside>;
  const c = celebACT(kind);
  const overlay = stage === "show" && kind !== "indicator";
  const floatOn = stage === "show" || stage === "done";

  const rewardCard = (title, sub, icon, tag, tone) => (
    <li className={"act-ph-cc-card is-" + tone}>
      <span className="act-ph-cc-tile"><iconify-icon icon={icon}></iconify-icon></span>
      <span className="act-ph-cc-txt"><b>{title}</b>{sub && <small>{sub}</small>}</span>
      <span className="act-ph-cc-tag">{tag}</span>
    </li>
  );
  const foot = (primary, ghost) => (
    <div className="act-ph-ov-foot">
      <button type="button" className="act-ph-btn-gold" onClick={() => setStage("done")}>{primary}</button>
      {ghost && <button type="button" className="act-ph-btn-ghost" onClick={() => setStage("done")}>{ghost}</button>}
    </div>
  );

  return (
    <aside className="act-sim-col">
      <div className="act-sim-toolbar">
        <span className="act-sim-eyebrow">Member preview</span>
        <button type="button" className="act-sim-replay" onClick={() => setRun((r) => r + 1)}><iconify-icon icon="lucide:rotate-ccw"></iconify-icon>Play again</button>
      </div>
      <div className="act-phone">
        <div className="act-ph-screen">
          <div className="act-ph-status"><span>9:41</span><span className="act-ph-status-r"><i /><i /><i /></span></div>
          <div className="act-ph-appbar">
            <img src="assets/profinity-icon-purple-gold.png" alt="" /><span>Newsfeed</span>
            <span className={"act-ph-pill" + (paid && pill > SIM_PILL_BASE ? " is-bump" : "")}><iconify-icon icon="lucide:coins"></iconify-icon>{pill.toLocaleString("en-GB")}</span>
          </div>
          <div className="act-ph-feed">
            <div className="act-ph-ghost"><span /><span style={{ width: "70%" }} /></div>
            <div className="act-ph-earn">
              <div className="act-ph-earn-head">
                <span className="act-ph-earn-icon"><iconify-icon icon={ACT_CATEGORY_ICONS[action.category] || "lucide:sparkles"}></iconify-icon></span>
                <div><div className="act-ph-earn-cat">{action.category}</div><div className="act-ph-earn-title">{action.label || "Untitled way to earn"}</div></div>
              </div>
              <p className="act-ph-earn-sub">{action.guardrail || "Complete this to earn points."}</p>
              <div className="act-ph-earn-row">
                <button type="button" className={"act-ph-earn-btn" + (stage === "tap" ? " is-pressed" : "") + (paid ? " is-done" : "")} onClick={() => setRun((r) => r + 1)}>
                  <iconify-icon icon={paid ? "lucide:check" : "lucide:zap"}></iconify-icon>{paid ? "Earned" : "Complete"}
                </button>
                <span className="act-ph-earn-pts">+{pts} pts</span>
                {floatOn && <span key={run} className="act-ph-float" aria-hidden="true"><iconify-icon icon="lucide:coins"></iconify-icon>+{pts}</span>}
              </div>
            </div>
            <div className="act-ph-ghost"><span /><span style={{ width: "55%" }} /></div>
            <div className="act-ph-ghost"><span /><span style={{ width: "80%" }} /></div>
          </div>
          <div className="act-ph-tabbar">{["lucide:home", "lucide:compass", "lucide:plus-circle", "lucide:graduation-cap", "lucide:user"].map((ic, i) => <iconify-icon key={ic} icon={ic} class={i === 0 ? "is-active" : ""}></iconify-icon>)}</div>

          {overlay && kind === "rewardSplash" && (
            <div className="act-ph-ov is-splash" onClick={() => setStage("done")}>
              <span className="act-ph-glow" />
              <div className="act-ph-hero"><SimLottie src="wink" /><span className="act-ph-medal"><iconify-icon icon="lucide:sparkles"></iconify-icon></span></div>
              <div className="act-ph-k">Reward earned</div>
              <div className="act-ph-pts"><b>+{splashPts}</b><i>points</i></div>
              <h3 className="act-ph-t">{action.label || "Nice work"}</h3>
              {badge && <p className="act-ph-s">Also unlocks the {badge.name} badge</p>}
              <div className="act-ph-timer" key={run} />
            </div>
          )}

          {overlay && kind === "streak" && (
            <div className="act-ph-ov is-streak">
              <button type="button" className="act-ph-close" onClick={() => setStage("done")}>×</button>
              <span className="act-ph-glow" />
              <div className="act-ph-hero is-tall"><SimLottie src="welcome" /></div>
              <div className="act-ph-k">Daily check-in</div>
              <h3 className="act-ph-t is-big">Welcome back!</h3>
              <div className="act-ph-pts-chip">+{splashPts} pts</div>
              <p className="act-ph-s">Day {SIM_STREAK} in a row — keep it going.</p>
              <div className="act-ph-dots">{[0, 1, 2, 3, 4, 5, 6].map((i) => <span key={i} className={i < SIM_STREAK ? "is-on" : ""}>{i < SIM_STREAK ? <iconify-icon icon="lucide:check"></iconify-icon> : "SMTWTFS"[i]}</span>)}</div>
              {foot("Keep going", "View my streak")}
            </div>
          )}

          {overlay && kind === "goalReached" && (
            <div className="act-ph-ov is-goal">
              <button type="button" className="act-ph-close" onClick={() => setStage("done")}>×</button>
              <span className="act-ph-glow" />
              <div className="act-ph-hero"><SimLottie src="wave" /></div>
              <div className="act-ph-k"><iconify-icon icon="lucide:target"></iconify-icon>Daily goal</div>
              <h3 className="act-ph-t is-gold">Goal reached, {first}!</h3>
              <p className="act-ph-s">You've earned <b>{todayPts} pts</b> today.</p>
              <div className="act-ph-stats">
                <div className="act-ph-stat"><b>{reachedMark}</b><span>Goal hit</span></div>
                <div className="act-ph-stat is-ghost"><b>{nextMark ? nextMark : "Max"}</b><span>{nextMark ? "Next goal" : "Ladder done"}</span></div>
              </div>
              {foot("Keep earning", null)}
            </div>
          )}

          {overlay && (kind === "major" || kind === "combined") && (
            <div className={"act-ph-ov is-cc" + (kind === "major" ? " is-major" : "")}>
              <button type="button" className="act-ph-close" onClick={() => setStage("done")}>×</button>
              <span className="act-ph-glow" />
              <div className="act-ph-hero is-small"><SimLottie src="wink" /></div>
              <div className="act-ph-k"><iconify-icon icon="lucide:party-popper"></iconify-icon>{kind === "major" ? "Major celebration" : "2 rewards · one move"}</div>
              <h3 className="act-ph-t is-gold">{kind === "major" ? "Huge win, " + first + "!" : "Double celebration, " + first + "!"}</h3>
              <p className="act-ph-s">{kind === "major" ? "That was a big one. Here's what you just unlocked." : "That one action set off 2 celebrations at once."}</p>
              <ol className="act-ph-cc-stack">
                {rewardCard("+" + pts.toLocaleString("en-GB") + " pts", action.label, "lucide:coins", "Reward", "gold")}
                {kind === "combined" && (badge
                  ? rewardCard(badge.name, badge.reward || badge.description || "Badge unlocked", badge.icon || "lucide:award", "Badge", "gold")
                  : rewardCard("Silver unlocked", "5,000 lifetime points", "lucide:gem", "Level up", "level"))}
              </ol>
              <div className="act-ph-strip"><span><iconify-icon icon="lucide:coins"></iconify-icon><b>{todayPts}</b> pts today</span><i /><span><iconify-icon icon="lucide:flame"></iconify-icon><b>{SIM_STREAK}</b>-day streak</span></div>
              {foot("Keep earning", "View my rewards")}
            </div>
          )}
        </div>
      </div>
      <p className="act-sim-note"><b>{c.label}.</b> {c.desc}</p>
    </aside>
  );
}

function ActionsEditorView() {
  const [config, setConfig] = useStateACT(() => PF_ACT.getConfig());
  const [selectedId, setSelectedId] = useStateACT(() => config.actions[0].id);
  const [draft, setDraft] = useStateACT(() => ({ ...config.actions[0] }));
  const [search, setSearch] = useStateACT("");
  const [toast, setToast] = useStateACT(null);

  const stored = config.actions.find((a) => a.id === selectedId) || null;
  const dirty = draft ? (draft.isNew || JSON.stringify({ ...draft, isNew: undefined }) !== JSON.stringify({ ...stored, isNew: undefined })) : false;

  const filtered = useMemoACT(() => {
    const q = search.trim().toLowerCase();
    if (!q) return config.actions;
    return config.actions.filter((a) => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [config, search]);

  const select = (id) => {
    if (id === selectedId) return;
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    setSelectedId(id); setDraft({ ...config.actions.find((a) => a.id === id) });
  };
  const save = () => {
    const clean = { ...draft }; delete clean.isNew;
    const next = PF_ACT.upsertAction(clean);
    setConfig(next); setDraft(clean);
    setToast("Saved “" + clean.label + "”. Members see the change on Ways to Earn straight away.");
    setTimeout(() => setToast(null), 3000);
  };
  const createNew = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    const id = "evt_new_" + Math.random().toString(36).slice(2, 7);
    const blank = { id, label: "", category: "Community", basePoints: 50, dailyCap: null, weeklyCap: null, lifetimeCap: null, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "", linkedReward: null, celebration: "indicator", status: "planned", isNew: true };
    setSelectedId(id); setDraft(blank);
  };

  return (
    <div className="adl-view">
      <div className="adl-page-head">
        <div><h1>Ways to Earn</h1><p>Decide what members get points for, how many, and how often. This is the list members see on their Ways to Earn page.</p></div>
      </div>
      {toast && <div className="adl-banner adl-banner-info"><iconify-icon icon="lucide:check-circle"></iconify-icon><span>{toast}</span></div>}
      <div className="act-grid">
        <ActList actions={filtered} total={config.actions.length} selectedId={selectedId} onSelect={select} search={search} setSearch={setSearch} />
        <ActEditor action={draft} stored={stored} achievementBadges={config.achievementBadges} onChange={setDraft} onSave={save} onNew={createNew} dirty={dirty} />
        <ActPhoneSim action={draft} badge={draft ? config.achievementBadges.find((b) => "badge:" + b.key === draft.linkedReward) : null} />
      </div>
    </div>
  );
}

function ActionsEditorApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey="actions" />
      <main className="adl-main">
        <AdlHeader title="Loyalty &amp; Gamification — Ways to Earn" />
        <ActionsEditorView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ActionsEditorApp />);
