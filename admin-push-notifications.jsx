/* ===========================================================================
   PROfinity — Admin · Push Notifications (desktop console)
   List / create wizard (audience → details → review) / schedule / live
   dispatch tracking / scheduled·draft·completed detail / resend modal.
   Suffixed -APN to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateAPN, useMemo: useMemoAPN } = React;

function goAPN(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const APN_IOS = "mdi:apple", APN_ANDROID = "mdi:android", APN_WEB = "mdi:web";

const APN_PLATFORMS = [
  { key: "ios", label: "iOS" },
  { key: "android", label: "Android" },
  { key: "web", label: "Web Browser" },
];

const APN_CHANNELS = [["Confidence", 342], ["Mastery", 218], ["Freedom Path", 156]];
const APN_TIERS = [["Basic", 428], ["Confidence", 387], ["Mastery", 542], ["Sovereign and Builder", 298]];

const APN_COURSES = [
  { id: "c1", name: "Facial Aesthetics Masterclass", cat: "Injectables", enrolled: 1240 },
  { id: "c2", name: "Advanced Dermal Fillers", cat: "Injectables", enrolled: 864 },
  { id: "c3", name: "Botulinum Toxin Fundamentals", cat: "Injectables", enrolled: 1980 },
  { id: "c4", name: "Lip Enhancement Techniques", cat: "Injectables", enrolled: 512 },
  { id: "c5", name: "Chemical Peels & Skin Health", cat: "Skin", enrolled: 738 },
  { id: "c6", name: "Microneedling Certification", cat: "Skin", enrolled: 623 },
  { id: "c7", name: "Laser & Energy Devices", cat: "Devices", enrolled: 401 },
  { id: "c8", name: "Thread Lifting Advanced", cat: "Surgical", enrolled: 289 },
  { id: "c9", name: "Complications & Emergency Management", cat: "Safety", enrolled: 1104 },
  { id: "c10", name: "Business of Aesthetics", cat: "Practice", enrolled: 956 },
  { id: "c11", name: "Consultation & Consent Mastery", cat: "Practice", enrolled: 677 },
  { id: "c12", name: "Anatomy for Injectors", cat: "Foundations", enrolled: 1533 },
];

const APN_STATUS_META = {
  Sent: { color: "var(--success)", bg: "var(--success-bg)" },
  Scheduled: { color: "var(--info)", bg: "var(--info-bg)" },
  Draft: { color: "var(--gray-500)", bg: "var(--gray-100)" },
  Stopped: { color: "var(--error)", bg: "var(--error-bg)" },
  Completed: { color: "var(--brand-navy)", bg: "var(--ai-purple-100)" },
};

const APN_BASE_ROWS = [
  { id: 1, title: "Welcome to Version 2.0!", desc: "Explore our latest features and improvements.", platforms: [APN_IOS, APN_ANDROID], audience: "All Users", status: "Completed", scheduled: "Oct 24, 10:30 AM", delivered: "98%", opened: "22%" },
  { id: 2, title: "Limited Time Offer", desc: "Get 20% off on your next subscription renewal.", platforms: [APN_IOS, APN_ANDROID, APN_WEB], audience: "Free Tier", status: "Scheduled", scheduled: "Oct 30, 09:00 AM", delivered: "–", opened: "–" },
  { id: 3, title: "Password Changed", desc: "Your account password was successfully updated.", platforms: [APN_WEB], audience: "US Only", status: "Sent", scheduled: "Oct 23, 04:15 PM", delivered: "100%", opened: "65%" },
  { id: 4, title: "Abandoned Cart Reminder", desc: "You left items in your cart! Complete your order.", platforms: [APN_IOS, APN_ANDROID], audience: "Premium", status: "Draft", scheduled: "Not set", delivered: "–", opened: "–" },
  { id: 5, title: "Weekly Newsletter", desc: "Catch up on the latest trends in aesthetics.", platforms: [APN_WEB], audience: "All Users", status: "Stopped", scheduled: "Oct 22, 11:00 AM", delivered: "45%", opened: "12%" },
  { id: 6, title: "New Feature Alert: Dark Mode", desc: "You can now switch to dark mode in settings.", platforms: [APN_ANDROID], audience: "Beta Group", status: "Sent", scheduled: "Oct 21, 08:45 AM", delivered: "99%", opened: "31%" },
  { id: 7, title: "Maintenance Update", desc: "Our servers will be undergoing scheduled maintenance.", platforms: [APN_IOS, APN_ANDROID, APN_WEB], audience: "All Users", status: "Scheduled", scheduled: "Nov 1, 12:00 AM", delivered: "–", opened: "–" },
  { id: 8, title: "System Update Complete", desc: "Your system has been successfully updated.", platforms: [APN_IOS], audience: "Premium", status: "Sent", scheduled: "Oct 20, 02:20 PM", delivered: "97%", opened: "18%" },
];

const APN_SCHEDULE_ROWS = [
  { date: "Mon, Oct 28 2024", time: "10:00 AM PST", next: true },
  { date: "Wed, Oct 30 2024", time: "10:00 AM PST" },
  { date: "Fri, Nov 1 2024", time: "10:00 AM PST" },
  { date: "Wed, Nov 6 2024", time: "10:00 AM PST" },
  { date: "Fri, Nov 8 2024", time: "10:00 AM PST" },
];

const APN_REACH_BARS = [22, 34, 46, 40, 66, 100, 78, 52, 44, 36, 26, 20];

const APN_SEGMENT_REACH = { "All Users": "124,500", "Power Users": "38,200", "Premium members": "21,800", "Free Tier": "86,400", "Beta Group": "4,120" };

const APN_LOG_LINES = [
  { ok: true, time: "2:14:30", text: "Batch chunk 12/14 delivered — 45 devices" },
  { ok: true, time: "2:14:28", text: "Batch chunk 11/14 delivered — 45 devices" },
  { ok: false, time: "2:14:26", text: "Failed: 3 invalid tokens (Android) — retrying" },
  { ok: true, time: "2:14:24", text: "Batch chunk 10/14 delivered — 45 devices" },
  { ok: true, time: "2:14:22", text: "Batch chunk 9/14 delivered — 44 devices" },
];

function apnParseDate(s) {
  const d = new Date(s + " 2024");
  return isNaN(d) ? 0 : d.getTime();
}

function apnToggleMap(setter, key) {
  setter((st) => ({ ...st, [key]: !st[key] }));
}

/* ------------------------------------------------------------- sidebar */
const APN_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:book-open", label: "Science Articles" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events" },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification", active: true },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const APN_NAV_LINKS = {
  "Posts Management": "AdminPostsManagement.html",
  "Push Notification": "AdminPushNotifications.html",
};

function APNSidebar() {
  return (
    <aside className="apn-sidebar">
      <div className="apn-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {APN_NAV.map((item) => {
        const href = APN_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"apn-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goAPN(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="apn-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="apn-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function APNHeader() {
  return (
    <header className="apn-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="apn-header-title">Push Notification</span>
      <div className="apn-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="apn-spacer" />
      <div className="apn-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="apn-bell-badge">4</span>
      </div>
      <div className="apn-user">
        <div className="apn-user-name">Dr Tim Pearce</div>
        <div className="apn-user-role">Admin</div>
      </div>
      <img className="apn-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ------------------------------------------------------------ previews */
function APNPhoneMock({ title, body }) {
  return (
    <div className="apn-phone">
      <div className="apn-phone-shell">
        <div className="apn-phone-screen">
          <div className="apn-phone-notch" />
          <div className="apn-phone-time">9:41</div>
          <div className="apn-phone-status">
            <iconify-icon icon="lucide:signal"></iconify-icon>
            <iconify-icon icon="lucide:wifi"></iconify-icon>
            <iconify-icon icon="lucide:battery-full"></iconify-icon>
          </div>
          <div className="apn-phone-clock">
            <div className="apn-phone-date">Monday, October 28</div>
            <div className="apn-phone-big-time">9:41</div>
          </div>
          <div className="apn-phone-notif-wrap">
            <div className="apn-phone-notif">
              <div className="apn-phone-notif-head">
                <span className="apn-phone-notif-icon"><iconify-icon icon="lucide:bell"></iconify-icon></span>
                <span className="apn-phone-notif-app">PROFINITY</span>
                <span className="apn-phone-notif-now">now</span>
              </div>
              <div className="apn-phone-notif-title">{title}</div>
              <div className="apn-phone-notif-body">{body}</div>
            </div>
          </div>
          <div className="apn-phone-home" />
        </div>
      </div>
    </div>
  );
}

function APNWebMock({ title, body }) {
  return (
    <div className="apn-web">
      <div className="apn-web-bar">
        <span className="apn-web-dot" style={{ background: "#ff5f57" }} />
        <span className="apn-web-dot" style={{ background: "#febc2e" }} />
        <span className="apn-web-dot" style={{ background: "#28c840" }} />
        <div className="apn-web-url"><iconify-icon icon="lucide:lock"></iconify-icon><span>app.profinity.academy</span></div>
      </div>
      <div className="apn-web-body">
        <div className="apn-web-skel" />
        <div className="apn-web-skel2" />
        <div className="apn-web-skel3" />
        <div className="apn-web-toast">
          <div className="apn-web-toast-head">
            <span className="apn-web-toast-icon"><iconify-icon icon="lucide:bell"></iconify-icon></span>
            <span className="apn-web-toast-app">PROfinity Academy</span>
            <span className="apn-web-toast-now">now</span>
            <iconify-icon icon="lucide:x" class="apn-web-toast-close"></iconify-icon>
          </div>
          <div className="apn-web-toast-title">{title}</div>
          <div className="apn-web-toast-body">{body}</div>
        </div>
      </div>
    </div>
  );
}

function APNLivePreviewCard({ title, body }) {
  return (
    <div className="apn-card">
      <div className="apn-card-title" style={{ marginBottom: 20 }}>Live Preview</div>
      <div className="apn-preview-label">Mobile Preview</div>
      <APNPhoneMock title={title} body={body} />
      <div className="apn-preview-label" style={{ margin: "20px 0 12px" }}>Web Preview</div>
      <APNWebMock title={title} body={body} />
    </div>
  );
}

function APNSimplePreviewCard({ title, body }) {
  return (
    <div className="apn-card" style={{ borderRadius: 20, position: "sticky", top: 96 }}>
      <div className="apn-card-title" style={{ marginBottom: 20 }}>Preview</div>
      <APNPhoneMock title={title} body={body} />
    </div>
  );
}

/* ------------------------------------------------------------- checkbox */
function APNCheck({ on, onClick, large }) {
  return (
    <button type="button" className={"apn-check" + (large ? " apn-check-lg" : "") + (on ? " is-on" : "")} onClick={onClick}>
      {on && <iconify-icon icon="lucide:check"></iconify-icon>}
    </button>
  );
}

function APNRadio({ on, onClick, large }) {
  return (
    <button type="button" className={"apn-radio" + (large ? " apn-radio-lg" : "") + (on ? " is-on" : "")} onClick={onClick}>
      {on && <span className="apn-radio-dot" />}
    </button>
  );
}

function APNToggle({ on, onClick }) {
  return (
    <button type="button" className={"apn-toggle" + (on ? " is-on" : "")} onClick={onClick}>
      <span className="apn-toggle-knob" />
    </button>
  );
}

function APNIconLocked() {
  return (
    <div className="apn-icon-locked">
      <div className="apn-icon-locked-thumb">
        <img src="assets/profinity-icon-twist.png" alt="Profinity app icon" />
      </div>
      <div className="apn-icon-locked-body">
        <div className="apn-icon-locked-title">Profinity app icon</div>
        <div className="apn-icon-locked-sub">Used as the notification icon on all platforms (default).</div>
      </div>
      <span className="apn-icon-locked-badge"><iconify-icon icon="lucide:check"></iconify-icon>Default</span>
    </div>
  );
}

/* ------------------------------------------------------ automated rules */
const APN_RULE_COLORS = {
  purple: { bg: "var(--ai-purple-100)", fg: "var(--ai-purple)" },
  blue: { bg: "var(--info-bg)", fg: "var(--info)" },
  indigo: { bg: "#eef0fd", fg: "#4f5bd5" },
};

const APN_RULES = [
  { id: 1, icon: "lucide:user-plus", color: "purple", title: "Welcome Series", desc: "Greets new members and points them to onboarding and their first course.", trigger: "New user signup", timing: "Immediately", audience: "New members", sent: "1,204" },
  { id: 2, icon: "lucide:graduation-cap", color: "blue", title: "Course Completion", desc: "Congratulates learners and suggests the next course in their pathway.", trigger: "Course marked complete", timing: "Immediately", audience: "Enrolled learners", sent: "842" },
  { id: 3, icon: "lucide:bed", color: "indigo", title: "Inactivity Win-back", desc: "Re-engages members who haven't logged in for two weeks.", trigger: "No login for 14 days", timing: "Day 14, 10:00 local", audience: "Dormant members", sent: "376" },
  { id: 4, icon: "lucide:calendar-clock", color: "blue", title: "Appointment Reminder", desc: "Reminds patients of an upcoming appointment with the clinic.", trigger: "Booking 24h away", timing: "24 hours before", audience: "Patients with bookings", sent: "2,918" },
];

function APNTabs({ tab, setTab, ruleCount }) {
  return (
    <div className="apn-tabs">
      <button type="button" className={"apn-tab" + (tab === "all" ? " is-active" : "")} onClick={() => setTab("all")}>
        <iconify-icon icon="lucide:list"></iconify-icon>All Notifications
      </button>
      <button type="button" className={"apn-tab" + (tab === "rules" ? " is-active" : "")} onClick={() => setTab("rules")}>
        <iconify-icon icon="lucide:zap"></iconify-icon>Automated Rules
        <span className="apn-tab-badge">{ruleCount}</span>
      </button>
    </div>
  );
}

function APNRuleCard({ rule, active, onToggle }) {
  const c = APN_RULE_COLORS[rule.color];
  return (
    <div className="apn-rule-card">
      <span className="apn-rule-icon" style={{ background: c.bg, color: c.fg }}>
        <iconify-icon icon={rule.icon}></iconify-icon>
      </span>
      <div className="apn-rule-body">
        <div className="apn-rule-head">
          <span className="apn-rule-title">{rule.title}</span>
          <span className="apn-rule-active"><span className="apn-rule-active-dot" />Active</span>
        </div>
        <p className="apn-rule-desc">{rule.desc}</p>
        <div className="apn-rule-meta">
          <span><iconify-icon icon="lucide:key-round"></iconify-icon>Trigger: <strong>{rule.trigger}</strong></span>
          <span><iconify-icon icon="lucide:clock"></iconify-icon>{rule.timing}</span>
          <span><iconify-icon icon="lucide:users"></iconify-icon>{rule.audience}</span>
          <span><iconify-icon icon="lucide:send"></iconify-icon><strong>{rule.sent}</strong> sent (30d)</span>
        </div>
      </div>
      <div className="apn-rule-actions">
        <APNToggle on={active} onClick={onToggle} />
        <button className="apn-btn apn-btn-sq" type="button"><iconify-icon icon="lucide:sliders-horizontal"></iconify-icon></button>
      </div>
    </div>
  );
}

function APNRulesView({ ruleStates, toggleRule }) {
  return (
    <div>
      <div className="apn-rule-banner">
        <iconify-icon icon="lucide:zap"></iconify-icon>
        <span><strong>Automated notifications</strong> send themselves when a trigger event fires — no manual sending required. Configure the trigger, timing, audience and message once; Profinity handles the rest.</span>
      </div>
      <div className="apn-rule-list">
        {APN_RULES.map((rule) => (
          <APNRuleCard key={rule.id} rule={rule} active={ruleStates[rule.id]} onToggle={() => toggleRule(rule.id)} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- list */
function APNListView({ rows, sortBy, setSortBy, selected, setSelected, perPage, setPerPage, goCreate, openRow, openResend, goSchedule, tab, setTab, ruleStates, toggleRule }) {
  const count = Object.values(selected).filter(Boolean).length;
  const allChecked = rows.length > 0 && count === rows.length;

  const toggleAll = () => {
    if (allChecked) { setSelected({}); return; }
    const sel = {};
    rows.forEach((r) => (sel[r.id] = true));
    setSelected(sel);
  };
  const toggleOne = (id) => setSelected((st) => {
    const sel = { ...st };
    if (sel[id]) delete sel[id]; else sel[id] = true;
    return sel;
  });

  return (
    <div className="apn-view">
      <div className="apn-page-head">
        <div>
          <h1>Push Notifications</h1>
          <p>Manage and track all push notifications across your platforms.</p>
        </div>
        <div className="apn-page-head-actions">
          <button className="apn-btn apn-btn-ghost" type="button"><iconify-icon icon="lucide:download"></iconify-icon>Export CSV</button>
          {tab === "rules" ? (
            <button className="apn-btn apn-btn-navy" type="button"><iconify-icon icon="lucide:plus"></iconify-icon>New Rule</button>
          ) : (
            <button className="apn-btn apn-btn-navy" type="button" onClick={goCreate}><iconify-icon icon="lucide:plus"></iconify-icon>Create Notification</button>
          )}
        </div>
      </div>

      <APNTabs tab={tab} setTab={setTab} ruleCount={APN_RULES.length} />

      {tab === "rules" ? (
        <APNRulesView ruleStates={ruleStates} toggleRule={toggleRule} />
      ) : (
        <>
          <div className="apn-filters">
            <div className="apn-search-input-wrap">
              <iconify-icon icon="lucide:search"></iconify-icon>
              <input placeholder="Search notifications..." />
            </div>
            <button className="apn-filter-btn" type="button"><span>Status:</span><span className="apn-filter-val">All</span><iconify-icon icon="lucide:chevron-down"></iconify-icon></button>
            <button className="apn-filter-btn" type="button"><span>Platform:</span><span className="apn-filter-val">All</span><iconify-icon icon="lucide:chevron-down"></iconify-icon></button>
            <button className="apn-filter-btn" type="button"><span>Date Range:</span><span className="apn-filter-val">Last 30 Days</span><iconify-icon icon="lucide:chevron-down"></iconify-icon></button>
            <div className="apn-select-wrap apn-select-icon apn-sort-select-wrap">
              <iconify-icon icon="lucide:arrow-up-down"></iconify-icon>
              <select className="apn-select apn-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Sort: Most Recent</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="az">Sort: Name (A–Z)</option>
                <option value="za">Sort: Name (Z–A)</option>
                <option value="status">Sort: Status</option>
              </select>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </div>
            <a href="#" className="apn-clear-filters" onClick={(e) => e.preventDefault()}>Clear Filters</a>
          </div>

          {count > 0 && (
            <div className="apn-bulkbar">
              <strong>{count} notification{count === 1 ? "" : "s"} selected</strong>
              <span className="apn-divider" />
              <span className="apn-link" onClick={openResend}>Resend</span>
              <a href="#" onClick={(e) => e.preventDefault()}>Duplicate</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Archive</a>
              <span className="apn-spacer" />
              <a href="#" className="apn-danger" onClick={(e) => e.preventDefault()}>Delete</a>
            </div>
          )}

          <div className="apn-table">
            <div className="apn-row-grid apn-thead">
              <APNCheck on={allChecked} onClick={toggleAll} />
              <span className="apn-th">NOTIFICATION</span>
              <span className="apn-th">PLATFORM</span>
              <span className="apn-th">AUDIENCE</span>
              <span className="apn-th">STATUS</span>
              <span className="apn-th">SCHEDULED/SENT</span>
              <span className="apn-th">DELIVERED</span>
              <span className="apn-th">OPENED</span>
              <span />
            </div>

            {rows.map((r) => {
              const checked = !!selected[r.id];
              const s = APN_STATUS_META[r.status];
              return (
                <div key={r.id} className="apn-row-grid apn-trow" style={{ background: checked ? "var(--brand-gold-100)" : "var(--white)" }}>
                  <APNCheck on={checked} onClick={() => toggleOne(r.id)} />
                  <div className="apn-trow-title" onClick={() => openRow(r)}>
                    <div className="apn-trow-title-main">{r.title}</div>
                    <div className="apn-trow-title-sub">{r.desc}</div>
                  </div>
                  <div className="apn-plat-icons">
                    {r.platforms.map((p, i) => <iconify-icon key={i} icon={p}></iconify-icon>)}
                  </div>
                  <span className="apn-audience-cell">{r.audience}</span>
                  <div className="apn-status-pill" style={{ background: s.bg }}>
                    <span className="apn-status-dot" style={{ background: s.color }} />
                    <span className="apn-status-label" style={{ color: s.color }}>{r.status}</span>
                  </div>
                  <span className="apn-audience-cell">{r.scheduled}</span>
                  <span className="apn-metric" style={{ color: r.delivered === "–" ? "var(--gray-400)" : "var(--gray-800)" }}>{r.delivered}</span>
                  <span className="apn-metric" style={{ color: r.opened === "–" ? "var(--gray-400)" : "var(--gray-800)" }}>{r.opened}</span>
                  <iconify-icon icon="lucide:more-vertical" class="apn-row-more" onClick={goSchedule}></iconify-icon>
                </div>
              );
            })}

            <div className="apn-pagination">
              <div className="apn-pageinfo">
                <span>Show</span>
                <div className="apn-pp-select-wrap">
                  <select className="apn-pp-select" value={perPage} onChange={(e) => setPerPage(e.target.value)}>
                    <option>10</option><option>20</option><option>50</option>
                  </select>
                  <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                </div>
                <span>notifications per page</span>
              </div>
              <div className="apn-pagebtns">
                <span style={{ fontSize: 14, color: "var(--gray-600)" }}>Showing 1–{perPage} of 48 notifications</span>
                <div className="apn-pagebtn-group">
                  <button className="apn-pagebtn" disabled type="button"><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>
                  <button className="apn-pagebtn is-active" type="button">1</button>
                  <button className="apn-pagebtn" type="button">2</button>
                  <button className="apn-pagebtn" type="button">3</button>
                  <span className="apn-pagedots">...</span>
                  <button className="apn-pagebtn" type="button">5</button>
                  <button className="apn-pagebtn" type="button"><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- wizard */
function APNStepper({ step }) {
  const labels = ["Select Audience", "Notification Details", "Review & Send"];
  return (
    <div className="apn-steps">
      {labels.map((label, i) => {
        const n = i + 1, active = n === step, done = n < step, last = i === labels.length - 1;
        return (
          <div key={label} className="apn-step" style={{ flex: last ? "0 0 auto" : "1" }}>
            <span className={"apn-step-circle " + (active || done ? "is-done" : "is-todo")}>{n}</span>
            <span className={"apn-step-label " + (active ? "is-active" : done ? "is-done" : "is-todo")}>{label}</span>
            {!last && <span className="apn-step-line" />}
          </div>
        );
      })}
    </div>
  );
}

function APNStepAudience({ audience, setAudience, goList, next }) {
  const { allUsers, channels, tiers, courses, courseQuery } = audience;
  const setAllUsers = (v) => setAudience((st) => ({ ...st, allUsers: v }));
  const toggleChannel = (name) => { if (!allUsers) setAudience((st) => ({ ...st, channels: { ...st.channels, [name]: !st.channels[name] } })); };
  const toggleTier = (name) => { if (!allUsers) setAudience((st) => ({ ...st, tiers: { ...st.tiers, [name]: !st.tiers[name] } })); };
  const toggleCourse = (id) => setAudience((st) => ({ ...st, courses: { ...st.courses, [id]: !st.courses[id] } }));
  const setCourseQuery = (v) => setAudience((st) => ({ ...st, courseQuery: v }));

  const selectedCourseCount = Object.values(courses).filter(Boolean).length;
  const filteredCourses = APN_COURSES.filter((c) => c.name.toLowerCase().includes(courseQuery.trim().toLowerCase()));

  const recipCount = useMemoAPN(() => {
    if (allUsers) return "12,480";
    const chSum = APN_CHANNELS.filter(([n]) => channels[n]).reduce((a, [, f]) => a + f, 0);
    const trSum = APN_TIERS.filter(([n]) => tiers[n]).reduce((a, [, f]) => a + f, 0);
    const crSum = APN_COURSES.filter((c) => courses[c.id]).reduce((a, c) => a + c.enrolled, 0);
    return (chSum + trSum + crSum).toLocaleString();
  }, [allUsers, channels, tiers, courses]);

  const recipCaption = useMemoAPN(() => {
    if (allUsers) return "All registered users";
    const ch = APN_CHANNELS.filter(([n]) => channels[n]).length;
    const tr = APN_TIERS.filter(([n]) => tiers[n]).length;
    const parts = [];
    if (ch) parts.push(ch + " channel" + (ch === 1 ? "" : "s"));
    if (tr) parts.push(tr + " tier" + (tr === 1 ? "" : "s"));
    if (selectedCourseCount) parts.push(selectedCourseCount + " course" + (selectedCourseCount === 1 ? "" : "s"));
    return parts.length ? parts.join(" + ") + " (duplicate users removed)" : "No audience selected";
  }, [allUsers, channels, tiers, selectedCourseCount]);

  const channelCount = allUsers ? "All" : Object.values(channels).filter(Boolean).length;
  const tierCount = allUsers ? "—" : Object.values(tiers).filter(Boolean).length;

  return (
    <div className="apn-wizard-grid">
      <div className="apn-card apn-card-lg">
        <h2 className="apn-wizard-h2">Select your audience</h2>

        <button type="button" className={"apn-alluser-row" + (allUsers ? " is-on" : "")} onClick={() => setAllUsers(!allUsers)}>
          <APNCheck on={allUsers} large />
          <span style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, textAlign: "left" }}>
            <iconify-icon icon="lucide:globe"></iconify-icon>
            <span style={{ minWidth: 0 }}>
              <span className="apn-alluser-title">All Users</span>
              <span className="apn-alluser-sub">Send to every registered user, ignoring filters below</span>
            </span>
          </span>
          <span className="apn-alluser-count">12,480 total</span>
        </button>

        <div className="apn-sec-title">Channels</div>
        <div className="apn-sec-sub">Select one or more channels to target</div>
        {APN_CHANNELS.map(([name, followers]) => {
          const on = allUsers || !!channels[name];
          return (
            <button type="button" key={name} className="apn-opt-row" onClick={() => toggleChannel(name)}>
              <APNCheck on={on} />
              <span className="apn-opt-name">{name}</span>
              <span className="apn-opt-count">({followers} followers)</span>
            </button>
          );
        })}

        <div className="apn-hr" />

        <div className="apn-sec-title">Membership Tiers</div>
        <div className="apn-sec-sub">Optionally filter by membership tier</div>
        {APN_TIERS.map(([name, followers]) => {
          const on = allUsers || !!tiers[name];
          return (
            <button type="button" key={name} className="apn-opt-row" onClick={() => toggleTier(name)}>
              <APNCheck on={on} />
              <span className="apn-opt-name">{name}</span>
              <span className="apn-opt-count">({followers} followers)</span>
            </button>
          );
        })}

        <div className="apn-hr" />

        <div className="apn-locked" style={{ opacity: allUsers ? 0.5 : 1, pointerEvents: allUsers ? "none" : "auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div className="apn-sec-title">Course Enrollment</div>
              <div className="apn-sec-sub" style={{ marginBottom: 0 }}>Target users enrolled in specific courses</div>
            </div>
            {selectedCourseCount > 0 && <span className="apn-audience-badge">{selectedCourseCount} selected</span>}
          </div>
          <div className="apn-search-input-wrap" style={{ margin: "14px 0 10px" }}>
            <iconify-icon icon="lucide:search"></iconify-icon>
            <input placeholder="Search courses..." value={courseQuery} onChange={(e) => setCourseQuery(e.target.value)} style={{ height: 48, paddingLeft: 44 }} />
          </div>
          <div className="apn-course-list">
            {filteredCourses.map((c) => {
              const on = !!courses[c.id];
              return (
                <button type="button" key={c.id} className={"apn-course-row" + (on ? " is-on" : "")} onClick={() => toggleCourse(c.id)}>
                  <APNCheck on={on} />
                  <span style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0, textAlign: "left" }}>
                    <iconify-icon icon="lucide:graduation-cap"></iconify-icon>
                    <span className="apn-course-name">{c.name}</span>
                    <span className="apn-course-cat">{c.cat}</span>
                  </span>
                  <span className="apn-course-enrolled">{c.enrolled.toLocaleString()} enrolled</span>
                </button>
              );
            })}
          </div>
          {allUsers && (
            <div className="apn-locked-hint"><iconify-icon icon="lucide:lock"></iconify-icon>Disabled while All Users is selected.</div>
          )}
        </div>

        <div className="apn-wizard-nav">
          <button className="apn-btn apn-btn-dark apn-btn-lg" type="button" onClick={goList}>Cancel</button>
          <button className="apn-btn apn-btn-navy apn-btn-lg" type="button" onClick={next}>Next: Notification Details<iconify-icon icon="lucide:arrow-right"></iconify-icon></button>
        </div>
      </div>

      <div className="apn-wizard-col apn-wizard-col-sticky">
        <div className="apn-est-card">
          <span className="apn-est-icon"><iconify-icon icon="lucide:users"></iconify-icon></span>
          <div className="apn-est-kicker">ESTIMATED AUDIENCE</div>
          <div className="apn-est-num">{recipCount}</div>
          <div className="apn-est-caption">{recipCaption}</div>
        </div>

        <div className="apn-card">
          <div className="apn-card-title" style={{ marginBottom: 18 }}>Selection Summary</div>
          <div className="apn-summary-row">
            <span className="apn-summary-label"><iconify-icon icon="lucide:radio"></iconify-icon>Channels</span>
            <span className="apn-summary-val">{channelCount}</span>
          </div>
          <div className="apn-summary-row">
            <span className="apn-summary-label"><iconify-icon icon="lucide:layers"></iconify-icon>Membership Tiers</span>
            <span className="apn-summary-val">{tierCount}</span>
          </div>
          <div className="apn-summary-row">
            <span className="apn-summary-label"><iconify-icon icon="lucide:graduation-cap"></iconify-icon>Courses</span>
            <span className="apn-summary-val">{selectedCourseCount}</span>
          </div>
        </div>

        <div className="apn-hint-box">
          <iconify-icon icon="lucide:info"></iconify-icon>
          <span>Overlapping members across channels, tiers, and courses are counted once. Selecting <strong>All Users</strong> overrides every filter.</span>
        </div>
      </div>
    </div>
  );
}

function APNStepDetails({ draft, setDraft, back, next }) {
  const { title, body, deepLink, btnLabel, btnUrl, platforms, sendNow, schedDate, schedTime } = draft;
  const set = (patch) => setDraft((st) => ({ ...st, ...patch }));
  const togglePlatform = (key) => setDraft((st) => ({ ...st, platforms: { ...st.platforms, [key]: !st.platforms[key] } }));

  const previewTitle = title || "Notification title";
  const previewBody = body || "Your notification message will appear here.";

  const schedSummary = useMemoAPN(() => {
    if (!schedDate || !schedTime) return "";
    const dt = new Date(schedDate + "T" + schedTime);
    if (isNaN(dt)) return "";
    return dt.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }, [schedDate, schedTime]);

  return (
    <div className="apn-wizard-grid">
      <div className="apn-wizard-col">
        <div className="apn-card">
          <div className="apn-card-title">Notification Details</div>

          <label className="apn-field-label">Notification Title *</label>
          <input className="apn-input" style={{ marginBottom: 22 }} value={title} onChange={(e) => set({ title: e.target.value })} placeholder="Enter a short, punchy title" />

          <div className="apn-field-head">
            <label className="apn-field-label" style={{ marginBottom: 0 }}>Message Body *</label>
            <span className="apn-charcount">{body.length}/160</span>
          </div>
          <textarea className="apn-textarea" style={{ marginBottom: 22 }} maxLength={160} value={body} onChange={(e) => set({ body: e.target.value })} />

          <label className="apn-field-label">Notification Icon</label>
          <APNIconLocked />

          <label className="apn-field-label" style={{ marginTop: 22 }}>Deep Link URL</label>
          <input className="apn-input" style={{ marginBottom: 22 }} value={deepLink} onChange={(e) => set({ deepLink: e.target.value })} />

          <div className="apn-form-row2">
            <div>
              <label className="apn-field-label">Button Label (Optional)</label>
              <input className="apn-input" value={btnLabel} onChange={(e) => set({ btnLabel: e.target.value })} />
            </div>
            <div>
              <label className="apn-field-label">Button URL</label>
              <input className="apn-input" value={btnUrl} onChange={(e) => set({ btnUrl: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="apn-card">
          <div className="apn-card-title">Targeting</div>
          <label className="apn-field-label" style={{ marginBottom: 12 }}>Platform</label>
          <div className="apn-platform-row">
            {APN_PLATFORMS.map((p) => {
              const on = !!platforms[p.key];
              return (
                <button type="button" key={p.key} className="apn-platform-opt" onClick={() => togglePlatform(p.key)}>
                  <span className="apn-check" style={{ borderColor: "#CE9957", background: on ? "var(--brand-gold)" : "var(--white)" }}>
                    {on && <iconify-icon icon="lucide:check"></iconify-icon>}
                  </span>
                  <span className="apn-opt-label">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="apn-card">
          <div className="apn-card-title">Scheduling</div>
          <div className="apn-toggle-row">
            <div>
              <div className="apn-toggle-row-title">Send Immediately</div>
              <div className="apn-toggle-row-sub">Notification will be sent to all users as soon as you hit send.</div>
            </div>
            <APNToggle on={sendNow} onClick={() => set({ sendNow: !sendNow })} />
          </div>
          <div className="apn-sched-body" style={{ opacity: sendNow ? 0.45 : 1 }}>
            <label className="apn-field-label">Schedule for later</label>
            <div className="apn-form-row2">
              <div className="apn-select-wrap apn-select-icon">
                <iconify-icon icon="lucide:calendar"></iconify-icon>
                <input type="date" className="apn-input" style={{ paddingLeft: 44 }} value={schedDate} onChange={(e) => set({ schedDate: e.target.value })} />
              </div>
              <div className="apn-select-wrap apn-select-icon">
                <iconify-icon icon="lucide:clock"></iconify-icon>
                <input type="time" className="apn-input" style={{ paddingLeft: 44 }} value={schedTime} onChange={(e) => set({ schedTime: e.target.value })} />
              </div>
            </div>
            {schedSummary && !sendNow && (
              <div className="apn-sched-summary"><iconify-icon icon="lucide:calendar-check"></iconify-icon>Scheduled for {schedSummary}</div>
            )}
          </div>
        </div>
      </div>

      <div className="apn-wizard-col apn-wizard-col-sticky">
        <APNLivePreviewCard title={previewTitle} body={previewBody} />
      </div>

      <div className="apn-wizard-nav" style={{ gridColumn: "1 / -1" }}>
        <button className="apn-btn apn-btn-dark apn-btn-lg" type="button" onClick={back}><iconify-icon icon="lucide:arrow-left"></iconify-icon>Back: Select Audience</button>
        <button className="apn-btn apn-btn-navy apn-btn-lg" type="button" onClick={next}>Next: Review &amp; Send<iconify-icon icon="lucide:arrow-right"></iconify-icon></button>
      </div>
    </div>
  );
}

function APNStepReview({ draft, audience, back, send }) {
  const previewTitle = draft.title || "Notification title";
  const previewBody = draft.body || "Your notification message will appear here.";
  const recipCount = useMemoAPN(() => {
    if (audience.allUsers) return "12,480";
    const chSum = APN_CHANNELS.filter(([n]) => audience.channels[n]).reduce((a, [, f]) => a + f, 0);
    const trSum = APN_TIERS.filter(([n]) => audience.tiers[n]).reduce((a, [, f]) => a + f, 0);
    const crSum = APN_COURSES.filter((c) => audience.courses[c.id]).reduce((a, c) => a + c.enrolled, 0);
    return (chSum + trSum + crSum).toLocaleString();
  }, [audience]);
  const recipCaption = useMemoAPN(() => {
    if (audience.allUsers) return "All registered users";
    const ch = APN_CHANNELS.filter(([n]) => audience.channels[n]).length;
    const tr = APN_TIERS.filter(([n]) => audience.tiers[n]).length;
    const cr = Object.values(audience.courses).filter(Boolean).length;
    const parts = [];
    if (ch) parts.push(ch + " channel" + (ch === 1 ? "" : "s"));
    if (tr) parts.push(tr + " tier" + (tr === 1 ? "" : "s"));
    if (cr) parts.push(cr + " course" + (cr === 1 ? "" : "s"));
    return parts.length ? parts.join(" + ") + " (duplicate users removed)" : "No audience selected";
  }, [audience]);

  return (
    <div className="apn-wizard-grid">
      <div className="apn-card apn-card-lg">
        <h2 className="apn-wizard-h2" style={{ marginBottom: 6 }}>Review &amp; Send</h2>
        <p style={{ margin: "0 0 28px", fontSize: 15, color: "var(--gray-500)" }}>Confirm everything looks right before sending your notification.</p>

        <div className="apn-detail-banner" style={{ background: "var(--success-bg)", border: "1px solid #b8e6c8", marginBottom: 28 }}>
          <iconify-icon icon="lucide:circle-check-big" style={{ fontSize: 24, color: "var(--success)" }}></iconify-icon>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>Ready to send</div>
            <div style={{ fontSize: 14, color: "var(--gray-600)" }}>All required fields are complete and validated.</div>
          </div>
        </div>

        <div style={{ border: "1px solid var(--border-default)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "20px 24px", borderBottom: "1px solid var(--gray-100)" }}>
            <div style={{ minWidth: 0 }}>
              <div className="apn-detail-cell-kicker">MESSAGE</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)", marginBottom: 3 }}>{previewTitle}</div>
              <div style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.5 }}>{previewBody}</div>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); back(); }} style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>Edit</a>
          </div>
          <div className="apn-detail-grid">
            <div className="apn-detail-cell">
              <div className="apn-detail-cell-kicker">AUDIENCE</div>
              <div className="apn-detail-cell-val" style={{ color: "var(--brand-navy)" }}>{recipCount} recipients</div>
              <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 2 }}>{recipCaption}</div>
            </div>
            <div className="apn-detail-cell">
              <div className="apn-detail-cell-kicker">PLATFORM</div>
              <div className="apn-pill-group"><span className="apn-pill">iOS</span><span className="apn-pill">Android</span></div>
            </div>
            <div className="apn-detail-cell">
              <div className="apn-detail-cell-kicker">DELIVERY</div>
              <div className="apn-detail-cell-val">Send immediately</div>
            </div>
            <div className="apn-detail-cell">
              <div className="apn-detail-cell-kicker">EST. OPENS</div>
              <div className="apn-detail-cell-val">~40,000 opens</div>
            </div>
          </div>
        </div>

        <div className="apn-wizard-nav">
          <button className="apn-btn apn-btn-dark apn-btn-lg" type="button" onClick={back}><iconify-icon icon="lucide:arrow-left"></iconify-icon>Back: Notification Details</button>
          <button className="apn-btn apn-btn-navy apn-btn-lg" type="button" onClick={send}><iconify-icon icon="lucide:send"></iconify-icon>Send Notification</button>
        </div>
      </div>

      <div className="apn-wizard-col apn-wizard-col-sticky">
        <APNLivePreviewCard title={previewTitle} body={previewBody} />
      </div>
    </div>
  );
}

const APN_EMPTY_DRAFT = () => ({
  title: "Weekly Rewards are here!",
  body: "Your weekly rewards have been calculated. Open the app to claim your bonuses before they expire.",
  deepLink: "profinity://rewards/claim",
  btnLabel: "Claim Now",
  btnUrl: "profinity://rewards/claim",
  platforms: { ios: true, android: true, web: false },
  sendNow: false,
  schedDate: "2024-10-24",
  schedTime: "10:00",
});
const APN_EMPTY_AUDIENCE = () => ({
  allUsers: false,
  channels: { Confidence: true, Mastery: true, "Freedom Path": true },
  tiers: {},
  courses: {},
  courseQuery: "",
});

function APNCreateView({ createStep, setCreateStep, draft, setDraft, audience, setAudience, goList, commit }) {
  return (
    <div className="apn-view">
      <div className="apn-page-head">
        <div className="apn-page-head-sm">
          <button className="apn-btn apn-btn-sq" type="button" onClick={goList}><iconify-icon icon="lucide:arrow-left" style={{ color: "var(--brand-navy)" }}></iconify-icon></button>
          <h1>Create Push Notification</h1>
        </div>
        <div className="apn-page-head-actions">
          <button className="apn-btn apn-btn-dark" type="button" onClick={() => commit("Draft")}>Save Draft</button>
          <button
            className="apn-btn"
            type="button"
            disabled={createStep !== 3}
            onClick={() => createStep === 3 && commit("Sent")}
            style={{ background: createStep === 3 ? "var(--brand-navy)" : "var(--gray-200)", color: createStep === 3 ? "#fff" : "var(--gray-400)", cursor: createStep === 3 ? "pointer" : "not-allowed" }}
          >
            <iconify-icon icon="lucide:send"></iconify-icon>Send Now
          </button>
        </div>
      </div>

      <APNStepper step={createStep} />

      {createStep === 1 && <APNStepAudience audience={audience} setAudience={setAudience} goList={goList} next={() => setCreateStep(2)} />}
      {createStep === 2 && <APNStepDetails draft={draft} setDraft={setDraft} back={() => setCreateStep(1)} next={() => setCreateStep(3)} />}
      {createStep === 3 && <APNStepReview draft={draft} audience={audience} back={() => setCreateStep(2)} send={() => commit("Sent")} />}
    </div>
  );
}

/* ------------------------------------------------------------- schedule */
function APNScheduleView({ goList, goCreate }) {
  const [deliveryMode, setDeliveryMode] = useStateAPN("once");
  const [days, setDays] = useStateAPN({ Wed: true, Fri: true });
  const [endCondition, setEndCondition] = useStateAPN("after");
  const [smartDelivery, setSmartDelivery] = useStateAPN(true);
  const [rateLimiting, setRateLimiting] = useStateAPN(false);
  const [quietHours, setQuietHours] = useStateAPN(true);
  const [respectTz, setRespectTz] = useStateAPN(true);
  const onceActive = deliveryMode === "once";
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="apn-view">
      <div className="apn-page-head">
        <div className="apn-page-head-sm">
          <button className="apn-btn apn-btn-sq" type="button" onClick={goList}><iconify-icon icon="lucide:arrow-left" style={{ color: "var(--brand-navy)" }}></iconify-icon></button>
          <div>
            <h1>Schedule Push Notification</h1>
            <p style={{ margin: "6px 0 0", fontSize: 15, color: "var(--gray-500)" }}>Set up your notification delivery time and recurrence</p>
          </div>
        </div>
        <div className="apn-page-head-actions">
          <button className="apn-btn apn-btn-dark" type="button" onClick={goList}>Save Draft</button>
          <button className="apn-btn apn-btn-navy" type="button" onClick={goList}>Save Schedule</button>
        </div>
      </div>

      <div className="apn-wizard-grid">
        <div className="apn-wizard-col">
          <div className="apn-summary-banner">
            <div className="apn-summary-banner-head">
              <span className="apn-summary-kicker">NOTIFICATION SUMMARY</span>
              <a href="#" className="apn-summary-edit" onClick={(e) => { e.preventDefault(); goCreate(); }}>Edit Notification</a>
            </div>
            <div className="apn-summary-title">Flash Sale Alert</div>
            <div className="apn-summary-desc">Don't miss our biggest sale of the year! Up to 70% off selected items.</div>
            <div className="apn-summary-meta">
              <div>
                <div className="apn-summary-meta-label">Platform</div>
                <div className="apn-pill-group"><span className="apn-pill">iOS</span><span className="apn-pill">Android</span></div>
              </div>
              <div>
                <div className="apn-summary-meta-label">Audience</div>
                <div className="apn-meta-value">All Users</div>
              </div>
            </div>
          </div>

          <div className="apn-card">
            <div className="apn-card-title" style={{ marginBottom: 18, border: "none", paddingBottom: 0 }}>Delivery Schedule</div>
            <div className="apn-delivery-cards">
              <button type="button" className={"apn-delivery-card" + (onceActive ? " is-active" : "")} onClick={() => setDeliveryMode("once")}>
                <span className={"apn-delivery-icon" + (onceActive ? " is-active" : "")}><iconify-icon icon="lucide:calendar"></iconify-icon></span>
                <div className="apn-delivery-title">Send Once</div>
                <div className="apn-delivery-sub">One-time delivery</div>
              </button>
              <button type="button" className={"apn-delivery-card" + (!onceActive ? " is-active" : "")} onClick={() => setDeliveryMode("recurring")}>
                <span className={"apn-delivery-icon" + (!onceActive ? " is-active" : "")}><iconify-icon icon="lucide:refresh-cw"></iconify-icon></span>
                <div className="apn-delivery-title">Recurring</div>
                <div className="apn-delivery-sub">Repeating delivery</div>
              </button>
            </div>
            <div className="apn-form-row2" style={{ marginBottom: 20 }}>
              <div>
                <label className="apn-field-label">Scheduled Date</label>
                <div className="apn-select-wrap apn-select-icon">
                  <iconify-icon icon="lucide:calendar" style={{ color: "var(--gray-500)" }}></iconify-icon>
                  <select className="apn-select" style={{ paddingLeft: 42, fontWeight: 400, color: "var(--gray-800)" }}>
                    <option>Oct 28, 2024</option><option>Oct 29, 2024</option><option>Oct 30, 2024</option>
                  </select>
                  <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                </div>
              </div>
              <div>
                <label className="apn-field-label">Scheduled Time</label>
                <div className="apn-select-wrap apn-select-icon">
                  <iconify-icon icon="lucide:clock" style={{ color: "var(--gray-500)" }}></iconify-icon>
                  <select className="apn-select" style={{ paddingLeft: 42, fontWeight: 400, color: "var(--gray-800)" }}>
                    <option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option>
                  </select>
                  <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                </div>
              </div>
            </div>
            <div>
              <label className="apn-field-label">Timezone</label>
              <div className="apn-select-wrap">
                <select className="apn-select" style={{ fontWeight: 400, color: "var(--gray-800)" }}>
                  <option>Pacific Standard Time (PST)</option><option>Eastern Standard Time (EST)</option><option>Greenwich Mean Time (GMT)</option>
                </select>
                <iconify-icon icon="lucide:chevron-down"></iconify-icon>
              </div>
            </div>
          </div>

          <div className="apn-card" style={{ opacity: onceActive ? 0.55 : 1 }}>
            <div className="apn-recurrence-head">
              <div className="apn-card-title" style={{ margin: 0, border: "none", padding: 0 }}>Recurrence Settings</div>
              {onceActive && <iconify-icon icon="lucide:lock"></iconify-icon>}
            </div>
            <label className="apn-field-label">Repeat</label>
            <div className="apn-select-wrap" style={{ marginBottom: 22 }}>
              <select className="apn-select" style={{ fontWeight: 400, color: "var(--gray-800)" }}>
                <option>Daily</option><option>Weekly</option><option>Monthly</option>
              </select>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </div>
            <label className="apn-field-label" style={{ marginBottom: 12 }}>End Condition</label>
            <button type="button" className="apn-endcond-row" onClick={() => setEndCondition("never")}>
              <APNRadio on={endCondition === "never"} large />
              <span className="apn-endcond-label">Never</span>
            </button>
            <div className="apn-endcond-row" style={{ marginBottom: 22 }}>
              <APNRadio on={endCondition === "after"} large onClick={() => setEndCondition("after")} />
              <span className="apn-endcond-label">After</span>
              <input className="apn-endcond-input" defaultValue="10" />
              <span className="apn-endcond-label">occurrences</span>
            </div>
            <label className="apn-field-label" style={{ marginBottom: 12 }}>Days of Week</label>
            <div className="apn-days-row">
              {DAYS.map((d) => (
                <button key={d} type="button" className={"apn-daypill" + (days[d] ? " is-on" : "")} onClick={() => apnToggleMap(setDays, d)}>{d}</button>
              ))}
            </div>
          </div>

          <div className="apn-card">
            <div className="apn-card-title" style={{ marginBottom: 20, border: "none", padding: 0 }}>Delivery Optimization</div>
            <div className="apn-toggle-row" style={{ paddingBottom: 20, borderBottom: "1px solid var(--gray-100)" }}>
              <div>
                <div className="apn-toggle-row-title">Smart Delivery</div>
                <div className="apn-toggle-row-sub">Send at the optimal time based on each user's activity pattern</div>
              </div>
              <APNToggle on={smartDelivery} onClick={() => setSmartDelivery((v) => !v)} />
            </div>
            <div className="apn-toggle-row" style={{ padding: "20px 0", borderBottom: "1px solid var(--gray-100)" }}>
              <div>
                <div className="apn-toggle-row-title">Rate Limiting</div>
                <div className="apn-toggle-row-sub">Limit to 1 notification per user per day</div>
              </div>
              <APNToggle on={rateLimiting} onClick={() => setRateLimiting((v) => !v)} />
            </div>
            <div className="apn-toggle-row" style={{ paddingTop: 20 }}>
              <div>
                <div className="apn-toggle-row-title">Throttle Rate</div>
                <div className="apn-toggle-row-sub">Max notifications per hour</div>
              </div>
              <input className="apn-endcond-input" style={{ width: 120, height: 46, fontWeight: 700, color: "var(--gray-900)" }} defaultValue="5,000" />
            </div>
          </div>

          <div className="apn-card">
            <div className="apn-card-title" style={{ marginBottom: 20, border: "none", padding: 0 }}>Quiet Hours</div>
            <div className="apn-toggle-row" style={{ marginBottom: 22 }}>
              <div>
                <div className="apn-toggle-row-title">Enable Quiet Hours</div>
                <div className="apn-toggle-row-sub">Prevent notifications from sending during specified times</div>
              </div>
              <APNToggle on={quietHours} onClick={() => setQuietHours((v) => !v)} />
            </div>
            <div className="apn-form-row2" style={{ marginBottom: 18 }}>
              <div>
                <label className="apn-field-label">From</label>
                <div className="apn-select-wrap apn-select-icon">
                  <iconify-icon icon="lucide:clock" style={{ color: "var(--gray-500)" }}></iconify-icon>
                  <select className="apn-select" style={{ paddingLeft: 42, fontWeight: 400, color: "var(--gray-800)" }}>
                    <option>10:00 PM</option><option>11:00 PM</option><option>09:00 PM</option>
                  </select>
                  <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                </div>
              </div>
              <div>
                <label className="apn-field-label">To</label>
                <div className="apn-select-wrap apn-select-icon">
                  <iconify-icon icon="lucide:clock" style={{ color: "var(--gray-500)" }}></iconify-icon>
                  <select className="apn-select" style={{ paddingLeft: 42, fontWeight: 400, color: "var(--gray-800)" }}>
                    <option>08:00 AM</option><option>07:00 AM</option><option>09:00 AM</option>
                  </select>
                  <iconify-icon icon="lucide:chevron-down"></iconify-icon>
                </div>
              </div>
            </div>
            <button type="button" className="apn-endcond-row" style={{ marginBottom: 0 }} onClick={() => setRespectTz((v) => !v)}>
              <APNCheck on={respectTz} />
              <span className="apn-endcond-label">Respect user's local timezone</span>
            </button>
          </div>
        </div>

        <div className="apn-wizard-col">
          <div className="apn-card">
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-navy)", marginBottom: 8 }}>Schedule Preview</div>
            {APN_SCHEDULE_ROWS.map((s, i) => (
              <div key={i} className="apn-schedprev-row">
                <span className="apn-schedprev-dot" style={{ background: i === 0 ? "var(--ai-purple)" : "var(--white)", border: i === 0 ? "none" : "2px solid var(--gray-300)" }} />
                <div style={{ flex: 1 }}>
                  <div className="apn-schedprev-date">{s.date}</div>
                  <div className="apn-schedprev-time">{s.time}</div>
                </div>
                {s.next && <span className="apn-schedprev-next">NEXT</span>}
              </div>
            ))}
          </div>

          <div className="apn-card">
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-navy)", marginBottom: 2 }}>Estimated Reach</div>
            <div style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: 16 }}>Based on current audience segment</div>
            <div style={{ marginBottom: 22 }}><span className="apn-reach-num">124,500</span><span className="apn-reach-unit">users</span></div>
            <div className="apn-reach-stats">
              <div>
                <div className="apn-reach-stat-label">AVG OPEN RATE</div>
                <div className="apn-reach-stat-val" style={{ color: "var(--success)" }}>22.7%</div>
              </div>
              <div>
                <div className="apn-reach-stat-label">BEST SEND TIME</div>
                <div className="apn-reach-stat-val">10:00–11:00 AM</div>
              </div>
            </div>
            <div className="apn-reach-stat-label" style={{ marginBottom: 10 }}>OPEN RATE BY HOUR</div>
            <div className="apn-reach-bars">
              {APN_REACH_BARS.map((h, i) => (
                <div key={i} className={"apn-reach-bar" + (h === 100 ? " is-peak" : "")} style={{ height: h + "%", animationDelay: (0.04 + i * 0.05).toFixed(2) + "s" }} />
              ))}
            </div>
          </div>

          <div className="apn-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <iconify-icon icon="lucide:triangle-alert" style={{ fontSize: 20, color: "var(--warning)" }}></iconify-icon>
              <span style={{ fontSize: 17, fontWeight: 700, color: "var(--gray-900)" }}>Scheduling Conflicts</span>
            </div>
            <div style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.5, marginBottom: 18 }}>2 other notifications scheduled within 24 hours of your selected time</div>
            <div className="apn-conflict-row">
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>App Maintenance</div>
                <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 2 }}>Oct 28, 12:00 AM</div>
              </div>
              <span className="apn-conflict-tag">CONFLICT</span>
            </div>
            <div className="apn-conflict-row" style={{ marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-900)" }}>Weekly Rewards</div>
                <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 2 }}>Oct 28, 9:00 AM</div>
              </div>
              <span className="apn-conflict-tag">CONFLICT</span>
            </div>
            <a href="#" onClick={(e) => e.preventDefault()}>View all scheduled</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- tracking */
function APNTrackingView({ goList, goCreate }) {
  const [dispatch, setDispatch] = useStateAPN("running");
  const meta = {
    running: { label: "Sending now...", dot: "var(--ai-purple)", anim: "apnPulse 1.4s ease-in-out infinite", icon: "lucide:rocket", badge: "LIVE TRACKING", badgeColor: "var(--ai-purple)", badgeBg: "var(--ai-purple-100)" },
    stopped: { label: "Dispatch stopped", dot: "var(--error)", anim: "none", icon: "lucide:octagon-x", badge: "STOPPED", badgeColor: "var(--error)", badgeBg: "var(--error-bg)" },
  }[dispatch];

  return (
    <div className="apn-view apn-view-narrow">
      <div className="apn-detail-head">
        <button className="apn-btn apn-btn-sq" type="button" onClick={goList}><iconify-icon icon="lucide:arrow-left" style={{ color: "var(--brand-navy)" }}></iconify-icon></button>
        <h1>Dispatch Progress Tracking</h1>
      </div>

      <div className="apn-summary-banner">
        <div className="apn-summary-banner-head">
          <span className="apn-summary-kicker">NOTIFICATION SUMMARY</span>
          <span className="apn-summary-edit" onClick={goCreate}>Edit Notification</span>
        </div>
        <div className="apn-summary-title">Flash Sale Alert</div>
        <div className="apn-summary-desc">Don't miss our biggest sale of the year! Up to 70% off selected items.</div>
        <div className="apn-summary-meta">
          <div>
            <div className="apn-summary-meta-label">Platform</div>
            <div className="apn-pill-group"><span className="apn-pill">iOS</span><span className="apn-pill">Android</span></div>
          </div>
          <div>
            <div className="apn-summary-meta-label">Audience</div>
            <div className="apn-meta-value">All Users</div>
          </div>
        </div>
      </div>

      <div className="apn-tracking-card">
        <div className="apn-dispatch-head">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="apn-dispatch-dot" style={{ background: meta.dot, animation: meta.anim }} />
              <span className="apn-dispatch-title">{meta.label}</span>
              <iconify-icon icon={meta.icon} style={{ fontSize: 24, color: meta.dot }}></iconify-icon>
            </div>
            <div className="apn-dispatch-sub">BATCH ID: batch_8b2d1f&nbsp;&nbsp;&nbsp;&nbsp;Started at 2:14:08 PM PST</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button className="apn-stop-btn" type="button" disabled={dispatch === "stopped"} onClick={() => setDispatch("stopped")}>
              <iconify-icon icon="lucide:square"></iconify-icon>Stop
            </button>
            <span className="apn-dispatch-badge" style={{ color: meta.badgeColor, background: meta.badgeBg }}>{meta.badge}</span>
          </div>
        </div>

        <div className="apn-stat-grid">
          <div className="apn-stat-tile">
            <div className="apn-stat-kicker">TOTAL RECIPIENTS</div>
            <div className="apn-stat-num" style={{ color: "var(--gray-900)" }}>628</div>
          </div>
          <div className="apn-stat-tile">
            <div className="apn-stat-kicker">DELIVERY RATE</div>
            <div className="apn-stat-num" style={{ color: "var(--brand-navy)", marginBottom: 14 }}>89%</div>
            <div className="apn-stat-bar"><div className="apn-stat-bar-fill" style={{ width: "89%" }} /></div>
          </div>
          <div className="apn-stat-tile">
            <div className="apn-stat-kicker">SENT</div>
            <div className="apn-stat-num" style={{ color: "var(--gray-900)" }}>559</div>
            <div className="apn-stat-sub">~500/sec</div>
          </div>
          <div className="apn-stat-tile">
            <div className="apn-stat-kicker">FAILED</div>
            <div className="apn-stat-num" style={{ color: "var(--error)" }}>14</div>
            <div className="apn-stat-sub">Retrying...</div>
          </div>
          <div className="apn-stat-tile span2">
            <div className="apn-stat-head-flex">
              <div className="apn-stat-kicker">CLICKS</div>
              <span className="apn-ctr-tag"><iconify-icon icon="lucide:mouse-pointer-click"></iconify-icon>21.4% CTR</span>
            </div>
            <div className="apn-stat-num" style={{ color: "var(--brand-navy)" }}>120</div>
            <div className="apn-stat-sub">Taps on the notification so far</div>
          </div>
        </div>

        <div className="apn-eta-card">
          <div className="apn-eta-head">
            <span className="apn-eta-label">Estimated completion</span>
            <span className="apn-eta-val">~45 seconds</span>
          </div>
          <div className="apn-eta-bar"><div className="apn-stat-bar-fill" style={{ width: "55%" }} /></div>
          <div className="apn-eta-sub">22 seconds elapsed • <span style={{ fontWeight: 600, color: "var(--gray-800)" }}>55 queued</span></div>
        </div>

        <div className="apn-provider-grid">
          <div className="apn-provider-tile">
            <div className="apn-provider-kicker">FIREBASE (ANDROID)</div>
            <div className="apn-provider-val">289 sent</div>
          </div>
          <div className="apn-provider-tile">
            <div className="apn-provider-kicker">APNS (IOS)</div>
            <div className="apn-provider-val">270 sent</div>
          </div>
        </div>
      </div>

      <div className="apn-log">
        <div className="apn-log-head">
          <span className="apn-log-title">RECENT DELIVERY LOG</span>
          <span className="apn-log-status"><span className="apn-log-status-dot" />CONNECTED</span>
        </div>
        <div className="apn-log-lines">
          {APN_LOG_LINES.map((l, i) => (
            <div key={i} className={"apn-log-line" + (l.ok ? "" : " is-fail")}>
              <iconify-icon icon={l.ok ? "lucide:check" : "lucide:circle-x"} style={{ color: l.ok ? "#34d399" : "#f87171" }}></iconify-icon>
              <span>[{l.time}]&nbsp;&nbsp;{l.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="apn-tracking-actions">
        <button className="apn-btn apn-btn-ghost" type="button">View Notification Details</button>
        <button className="apn-btn apn-btn-navy" type="button" onClick={goList}>Go to Notification List</button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- detail */
function APNScheduledDetailView({ row, goList, goCreate }) {
  const r = row || { title: "Limited Time Offer", desc: "Get 20% off on your next subscription renewal.", audience: "Free Tier", scheduled: "Oct 30, 09:00 AM" };
  return (
    <div className="apn-view apn-view-narrow">
      <div className="apn-detail-head">
        <button className="apn-btn apn-btn-sq" type="button" onClick={goList}><iconify-icon icon="lucide:arrow-left" style={{ color: "var(--brand-navy)" }}></iconify-icon></button>
        <h1>Notification Details</h1>
        <span className="apn-detail-badge" style={{ background: "var(--info-bg)" }}>
          <span className="apn-detail-badge-dot" style={{ background: "var(--info)" }} />
          <span className="apn-badge-text" style={{ color: "var(--info)" }}>Scheduled</span>
        </span>
      </div>

      <div className="apn-wizard-grid">
        <div className="apn-wizard-col">
          <div className="apn-detail-banner" style={{ background: "var(--info-bg)", border: "1.5px solid #b9d4f2" }}>
            <span className="apn-detail-banner-icon"><iconify-icon icon="lucide:clock" style={{ color: "var(--info)" }}></iconify-icon></span>
            <div style={{ flex: 1 }}>
              <div className="apn-detail-banner-kicker">SCHEDULED TO SEND</div>
              <div className="apn-detail-banner-title">{r.scheduled}</div>
            </div>
            <div className="apn-detail-banner-side" style={{ color: "var(--info)" }}>Not sent yet</div>
          </div>

          <div className="apn-card apn-card-lg">
            <div className="apn-detail-msg-kicker">MESSAGE</div>
            <div className="apn-detail-msg-title">{r.title}</div>
            <div className="apn-detail-msg-body">{r.desc}</div>
            <div className="apn-detail-grid">
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">AUDIENCE</div><div className="apn-detail-cell-val">{r.audience}</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">PLATFORM</div><div className="apn-detail-cell-val">iOS &amp; Android</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">EST. RECIPIENTS</div><div className="apn-detail-cell-val">86,400</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">TIME ZONE</div><div className="apn-detail-cell-val">Recipient local time</div></div>
            </div>
          </div>

          <div className="apn-detail-actions">
            <button className="apn-btn apn-btn-dark" type="button" onClick={goCreate}><iconify-icon icon="lucide:pencil"></iconify-icon>Edit Schedule</button>
            <button className="apn-btn apn-btn-navy" type="button" onClick={goList}><iconify-icon icon="lucide:send"></iconify-icon>Send Now Instead</button>
            <div className="apn-spacer" />
            <button className="apn-btn apn-btn-danger" type="button" onClick={goList}><iconify-icon icon="lucide:calendar-x"></iconify-icon>Cancel Schedule</button>
          </div>
        </div>

        <APNSimplePreviewCard title={r.title} body={r.desc} />
      </div>
    </div>
  );
}

function APNDraftDetailView({ row, goCreate, goSchedule, goList }) {
  const r = row || { title: "Abandoned Cart Reminder", desc: "You left items in your cart! Complete your order.", audience: "Premium" };
  return (
    <div className="apn-view apn-view-narrow">
      <div className="apn-detail-head">
        <button className="apn-btn apn-btn-sq" type="button" onClick={goList}><iconify-icon icon="lucide:arrow-left" style={{ color: "var(--brand-navy)" }}></iconify-icon></button>
        <h1>Notification Details</h1>
        <span className="apn-detail-badge" style={{ background: "var(--gray-100)" }}>
          <span className="apn-detail-badge-dot" style={{ background: "var(--gray-500)" }} />
          <span className="apn-badge-text" style={{ color: "var(--gray-500)" }}>Draft</span>
        </span>
      </div>

      <div className="apn-wizard-grid">
        <div className="apn-wizard-col">
          <div className="apn-detail-banner" style={{ background: "var(--gray-50)", border: "1.5px dashed var(--border-strong)" }}>
            <span className="apn-detail-banner-icon"><iconify-icon icon="lucide:file-pen-line" style={{ color: "var(--gray-500)" }}></iconify-icon></span>
            <div style={{ flex: 1 }}>
              <div className="apn-detail-banner-kicker">DRAFT — NOT SCHEDULED</div>
              <div className="apn-detail-banner-title">This notification hasn't been scheduled or sent</div>
            </div>
          </div>

          <div className="apn-card apn-card-lg">
            <div className="apn-detail-msg-kicker">MESSAGE</div>
            <div className="apn-detail-msg-title">{r.title}</div>
            <div className="apn-detail-msg-body">{r.desc}</div>
            <div className="apn-detail-grid">
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">AUDIENCE</div><div className="apn-detail-cell-val">{r.audience}</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">PLATFORM</div><div className="apn-detail-cell-val">iOS &amp; Android</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">SCHEDULE</div><div className="apn-detail-cell-val" style={{ color: "var(--gray-500)" }}>Not set</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">LAST EDITED</div><div className="apn-detail-cell-val">Oct 22, 3:42 PM</div></div>
            </div>
          </div>

          <div className="apn-detail-actions">
            <button className="apn-btn apn-btn-navy" type="button" onClick={goCreate}><iconify-icon icon="lucide:pencil"></iconify-icon>Continue Editing</button>
            <button className="apn-btn apn-btn-dark" type="button" onClick={goSchedule}><iconify-icon icon="lucide:calendar-clock"></iconify-icon>Schedule</button>
            <div className="apn-spacer" />
            <button className="apn-btn apn-btn-danger" type="button" onClick={goList}><iconify-icon icon="lucide:trash-2"></iconify-icon>Delete Draft</button>
          </div>
        </div>

        <APNSimplePreviewCard title={r.title} body={r.desc} />
      </div>
    </div>
  );
}

function APNCompletedDetailView({ row, openResend, goCreate, goList }) {
  const r = row || { title: "Welcome to Version 2.0!", desc: "Explore our latest features and improvements.", audience: "All Users", scheduled: "Oct 24, 10:30 AM", delivered: "98%", opened: "22%" };
  return (
    <div className="apn-view apn-view-narrow">
      <div className="apn-detail-head">
        <button className="apn-btn apn-btn-sq" type="button" onClick={goList}><iconify-icon icon="lucide:arrow-left" style={{ color: "var(--brand-navy)" }}></iconify-icon></button>
        <h1>Notification Details</h1>
        <span className="apn-detail-badge" style={{ background: "var(--ai-purple-100)" }}>
          <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 15, color: "var(--brand-navy)" }}></iconify-icon>
          <span className="apn-badge-text" style={{ color: "var(--brand-navy)" }}>Completed</span>
        </span>
      </div>

      <div className="apn-wizard-grid">
        <div className="apn-wizard-col">
          <div className="apn-detail-banner" style={{ background: "var(--success-bg)", border: "1.5px solid #b8e6c8" }}>
            <span className="apn-detail-banner-icon"><iconify-icon icon="lucide:check-circle-2" style={{ color: "var(--success)" }}></iconify-icon></span>
            <div style={{ flex: 1 }}>
              <div className="apn-detail-banner-kicker">DELIVERY COMPLETED</div>
              <div className="apn-detail-banner-title">Sent {r.scheduled}</div>
            </div>
            <div className="apn-detail-banner-side" style={{ color: "var(--success)" }}>All batches delivered</div>
          </div>

          <div className="apn-stat-grid apn-detail-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="apn-detail-stat-tile">
              <div className="apn-detail-stat-kicker">TOTAL SENT</div>
              <div className="apn-detail-stat-val" style={{ color: "var(--gray-900)" }}>124,500</div>
            </div>
            <div className="apn-detail-stat-tile">
              <div className="apn-detail-stat-kicker">DELIVERED</div>
              <div className="apn-detail-stat-val" style={{ color: "var(--success)" }}>{r.delivered}</div>
            </div>
            <div className="apn-detail-stat-tile">
              <div className="apn-detail-stat-kicker">OPEN RATE</div>
              <div className="apn-detail-stat-val" style={{ color: "var(--brand-navy)" }}>{r.opened}</div>
            </div>
          </div>

          <div className="apn-card apn-card-lg">
            <div className="apn-detail-msg-kicker">MESSAGE</div>
            <div className="apn-detail-msg-title">{r.title}</div>
            <div className="apn-detail-msg-body">{r.desc}</div>
            <div className="apn-detail-grid">
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">AUDIENCE</div><div className="apn-detail-cell-val">{r.audience}</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">PLATFORM</div><div className="apn-detail-cell-val">iOS &amp; Android</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">CLICKS</div><div className="apn-detail-cell-val">5,229</div></div>
              <div className="apn-detail-cell"><div className="apn-detail-cell-kicker">FAILED</div><div className="apn-detail-cell-val">1,240</div></div>
            </div>
          </div>

          <div className="apn-detail-actions">
            <button className="apn-btn apn-btn-navy" type="button" onClick={openResend}><iconify-icon icon="lucide:refresh-cw"></iconify-icon>Resend</button>
            <button className="apn-btn apn-btn-dark" type="button" onClick={goCreate}><iconify-icon icon="lucide:copy"></iconify-icon>Duplicate</button>
            <div className="apn-spacer" />
            <button className="apn-btn apn-btn-dark" type="button"><iconify-icon icon="lucide:download"></iconify-icon>Export Report</button>
          </div>
        </div>

        <APNSimplePreviewCard title={r.title} body={r.desc} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- modal */
function APNResendModal({ onClose }) {
  const [audienceMode, setAudienceMode] = useStateAPN("same");
  const [segment, setSegment] = useStateAPN("Power Users");
  const [plat, setPlat] = useStateAPN({ ios: true, android: true, web: false });
  const isNew = audienceMode === "new";

  return (
    <div className="apn-modal-overlay">
      <div className="apn-modal">
        <div className="apn-modal-badge"><iconify-icon icon="lucide:bell"></iconify-icon></div>
        <button className="apn-modal-close" type="button" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>

        <h2>Resend Notification?</h2>
        <p className="apn-modal-sub">You are about to resend this notification to the original audience.</p>

        <div className="apn-modal-preview">
          <div className="apn-modal-preview-title">Flash Sale Alert</div>
          <div className="apn-modal-preview-body">Your weekly rewards have been calculated. Open the app to claim your bonuses before they expire.</div>
          <div className="apn-modal-preview-meta"><iconify-icon icon="lucide:users"></iconify-icon>All Users • iOS &amp; Android</div>
        </div>

        <div className="apn-modal-h3">Target Audience</div>
        <div className="apn-audience-cards">
          <button type="button" className={"apn-audience-card" + (audienceMode === "same" ? " is-on" : "")} onClick={() => setAudienceMode("same")}>
            <APNRadio on={audienceMode === "same"} large />
            <span className="apn-audience-card-label">Same audience as original</span>
          </button>
          <button type="button" className={"apn-audience-card" + (isNew ? " is-on" : "")} onClick={() => setAudienceMode("new")}>
            <APNRadio on={isNew} large />
            <span className="apn-audience-card-label">Select new audience</span>
          </button>
        </div>

        {isNew && (
          <div className="apn-resend-detail">
            <label className="apn-field-label">Audience Segment</label>
            <div className="apn-select-wrap" style={{ marginBottom: 20 }}>
              <select className="apn-select" style={{ fontWeight: 400, color: "var(--gray-800)" }} value={segment} onChange={(e) => setSegment(e.target.value)}>
                <option>All Users</option><option>Power Users</option><option>Premium members</option><option>Free Tier</option><option>Beta Group</option>
              </select>
              <iconify-icon icon="lucide:chevron-down"></iconify-icon>
            </div>
            <label className="apn-field-label" style={{ marginBottom: 12 }}>Platform</label>
            <div className="apn-platform-row" style={{ gap: 26, marginBottom: 20 }}>
              {APN_PLATFORMS.map((p) => {
                const on = !!plat[p.key];
                return (
                  <button type="button" key={p.key} className="apn-platform-opt" onClick={() => apnToggleMap(setPlat, p.key)}>
                    <span className="apn-check" style={{ background: on ? "var(--ai-purple)" : "var(--white)", borderColor: on ? "var(--ai-purple)" : "var(--border-strong)" }}>
                      {on && <iconify-icon icon="lucide:check"></iconify-icon>}
                    </span>
                    <span className="apn-opt-label">{p.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="apn-resend-reach">
              <iconify-icon icon="lucide:users"></iconify-icon>
              <span style={{ fontSize: 15, color: "var(--gray-600)" }}>Estimated reach</span>
              <span className="apn-resend-reach-val">{APN_SEGMENT_REACH[segment] || "—"} users</span>
            </div>
          </div>
        )}

        <div className="apn-modal-actions">
          <button className="apn-btn apn-btn-dark apn-btn-lg" type="button" onClick={onClose}>Cancel</button>
          <button className="apn-btn apn-btn-navy apn-btn-lg" type="button" onClick={onClose}>Resend Now</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- root */
function AdminPushNotifications() {
  const [view, setView] = useStateAPN("list");
  const [notifTab, setNotifTab] = useStateAPN("all");
  const [ruleStates, setRuleStates] = useStateAPN({ 1: true, 2: true, 3: true, 4: true });
  const [selected, setSelected] = useStateAPN({});
  const [perPage, setPerPage] = useStateAPN("10");
  const [sortBy, setSortBy] = useStateAPN("recent");
  const [sentRows, setSentRows] = useStateAPN([]);
  const [openRowData, setOpenRowData] = useStateAPN(null);
  const [showResend, setShowResend] = useStateAPN(false);

  const [createStep, setCreateStep] = useStateAPN(1);
  const [draft, setDraft] = useStateAPN(APN_EMPTY_DRAFT);
  const [audience, setAudience] = useStateAPN(APN_EMPTY_AUDIENCE);

  const rows = useMemoAPN(() => {
    const raw = [...sentRows, ...APN_BASE_ROWS];
    const sorted = [...raw];
    if (sortBy === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "za") sorted.sort((a, b) => b.title.localeCompare(a.title));
    else if (sortBy === "status") sorted.sort((a, b) => a.status.localeCompare(b.status));
    else if (sortBy === "oldest") sorted.sort((a, b) => apnParseDate(a.scheduled) - apnParseDate(b.scheduled));
    else sorted.sort((a, b) => apnParseDate(b.scheduled) - apnParseDate(a.scheduled));
    return sorted;
  }, [sentRows, sortBy]);

  const goList = () => setView("list");
  const goCreate = () => { setCreateStep(1); setView("create"); };
  const goSchedule = () => setView("schedule");
  const openResend = () => setShowResend(true);
  const closeResend = () => setShowResend(false);

  const toggleRule = (id) => setRuleStates((st) => ({ ...st, [id]: !st[id] }));

  const openRow = (r) => {
    setOpenRowData(r);
    if (r.status === "Scheduled") setView("scheduledDetail");
    else if (r.status === "Draft") setView("draftDetail");
    else if (r.status === "Completed") setView("completedDetail");
    else setView("tracking");
  };

  const commit = (status) => {
    const plats = [];
    if (draft.platforms.ios) plats.push(APN_IOS);
    if (draft.platforms.android) plats.push(APN_ANDROID);
    if (draft.platforms.web) plats.push(APN_WEB);
    if (!plats.length) plats.push(APN_IOS, APN_ANDROID);
    const now = new Date();
    const stamp = now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    const row = {
      id: "new-" + APN_BASE_ROWS.length + "-" + sentRows.length,
      title: draft.title || "Untitled notification",
      desc: draft.body || "No message body.",
      platforms: plats,
      audience: audience.allUsers ? "All Users" : "Selected Audience",
      status,
      scheduled: status === "Draft" ? "Not set" : stamp,
      delivered: status === "Sent" ? "100%" : "–",
      opened: status === "Sent" ? "0%" : "–",
    };
    setSentRows((st) => [row, ...st]);
    setDraft(APN_EMPTY_DRAFT());
    setAudience(APN_EMPTY_AUDIENCE());
    setCreateStep(1);
    setView("list");
  };

  return (
    <div className="apn-shell">
      <APNSidebar />
      <div className="apn-main">
        <APNHeader />
        {view === "list" && (
          <APNListView
            rows={rows} sortBy={sortBy} setSortBy={setSortBy}
            selected={selected} setSelected={setSelected}
            perPage={perPage} setPerPage={setPerPage}
            goCreate={goCreate} openRow={openRow} openResend={openResend} goSchedule={goSchedule}
            tab={notifTab} setTab={setNotifTab} ruleStates={ruleStates} toggleRule={toggleRule}
          />
        )}
        {view === "create" && (
          <APNCreateView
            createStep={createStep} setCreateStep={setCreateStep}
            draft={draft} setDraft={setDraft}
            audience={audience} setAudience={setAudience}
            goList={goList} commit={commit}
          />
        )}
        {view === "schedule" && <APNScheduleView goList={goList} goCreate={goCreate} />}
        {view === "tracking" && <APNTrackingView goList={goList} goCreate={goCreate} />}
        {view === "scheduledDetail" && <APNScheduledDetailView row={openRowData} goList={goList} goCreate={goCreate} />}
        {view === "draftDetail" && <APNDraftDetailView row={openRowData} goList={goList} goCreate={goCreate} goSchedule={goSchedule} />}
        {view === "completedDetail" && <APNCompletedDetailView row={openRowData} goList={goList} goCreate={goCreate} openResend={openResend} />}
      </div>
      {showResend && <APNResendModal onClose={closeResend} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AdminPushNotifications />);
