/* ===========================================================================
   PROfinity — Minute Taker · Admin Dashboard
   Practice-level admin: global kill-switch, per-clinician subscriber access,
   real-time audit trail. PRD Screen 7 (Sec. 3.7 / MT-A01, MT-A02, MT-A05).
   Classes prefixed mtad- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMTAD } = React;

function goMTAD(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const MTAD_ADMIN_NAV = [
  { icon: "lucide:shield-check", label: "Admin Users", href: "MinuteTakerAdmin.html" },
  { icon: "lucide:credit-card", label: "Usage & Billing", href: "MinuteTakerUsage.html" },
];

function MTADSidebar() {
  return (
    <aside className="mtad-sidebar">
      <div className="mtad-logo"><iconify-icon icon="lucide:mic" class="mtad-logo-icon"></iconify-icon><span>Minute Taker</span></div>
      <div className="mtad-nav-scope">Admin Console</div>
      <button
        className="mtad-navitem mtad-navitem-back"
        type="button"
        onClick={() => goMTAD("AdminAgents.html")}
      >
        <iconify-icon icon="lucide:arrow-left"></iconify-icon>
        <span>Back to Admin Dashboard</span>
      </button>
      {MTAD_ADMIN_NAV.map((item) => (
        <button
          key={item.label}
          className={"mtad-navitem" + (item.label === "Admin Users" ? " is-active" : "")}
          type="button"
          onClick={item.label !== "Admin Users" ? () => goMTAD(item.href) : undefined}
        >
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

function MTADHeader() {
  return (
    <header className="mtad-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="mtad-header-title">Minute Taker</span>
      <div className="mtad-spacer" />
      <div className="mtad-user">
        <div className="mtad-user-name">Dr. Katie Smith</div>
        <div className="mtad-user-role">Clinician</div>
      </div>
      <img className="mtad-user-avatar" src="assets/avatar-katy.jpg" alt="Dr. Katie Smith" />
    </header>
  );
}

const MTAD_SUBSCRIBERS_INIT = [
  { name: "Dr. Sarah Jenkins", status: "Active", sessions: 142, joined: "Nov 12, 2023" },
  { name: "Dr. Michael Chen", status: "Active", sessions: 89, joined: "Dec 5, 2023" },
  { name: "Dr. Emily Carter", status: "Suspended", sessions: 45, joined: "Jan 20, 2024" },
  { name: "Dr. Robert Steele", status: "Active", sessions: 215, joined: "Sep 1, 2023" },
  { name: "Dr. Amina Patel", status: "Active", sessions: 12, joined: "Mar 10, 2024" },
];

const MTAD_AUDIT_INIT = [
  { title: "User access revoked", detail: "Dr. David Kim · by Admin", when: "10 mins ago" },
  { title: "Exported subscriber list", detail: "All Users · by Admin", when: "1 hour ago" },
  { title: "User access granted", detail: "Dr. Amina Patel · by Admin", when: "2 days ago" },
  { title: "Platform suspension toggle", detail: "Global System · by Admin", when: "5 days ago" },
];

function MTADToggle({ on, disabled, onClick }) {
  return (
    <button type="button" className={"mtad-toggle" + (on ? " is-on" : "") + (disabled ? " is-disabled" : "")}
      onClick={disabled ? undefined : onClick}>
      <span className="mtad-toggle-knob" />
    </button>
  );
}

function MTADView() {
  const [platformActive, setPlatformActive] = useStateMTAD(true);
  const [subscribers, setSubscribers] = useStateMTAD(MTAD_SUBSCRIBERS_INIT);
  const [audit, setAudit] = useStateMTAD(MTAD_AUDIT_INIT);

  function pushAudit(title, detail) {
    setAudit((a) => [{ title, detail, when: "Just now" }, ...a]);
  }

  function togglePlatform() {
    const next = !platformActive;
    setPlatformActive(next);
    pushAudit("Platform suspension toggle", "Global System · by Dr. Katie Smith → " + (next ? "Active" : "Halted"));
  }

  function toggleSubscriber(idx) {
    setSubscribers((rows) => rows.map((r, i) => {
      if (i !== idx) return r;
      const nextStatus = r.status === "Active" ? "Suspended" : "Active";
      pushAudit(nextStatus === "Suspended" ? "User access revoked" : "User access granted", r.name + " · by Dr. Katie Smith");
      return { ...r, status: nextStatus };
    }));
  }

  const activeCount = subscribers.filter((s) => s.status === "Active").length;

  return (
    <div className="mtad-view">
      <div className="mtad-page-head">
        <h1>Admin Dashboard</h1>
        <p>Manage platform access, active subscribers, and review administrative actions.</p>
      </div>

      <div className={"mtad-status-banner" + (platformActive ? "" : " is-halted")}>
        <div>
          <div className="mtad-status-title">
            <iconify-icon icon={platformActive ? "lucide:check-circle-2" : "lucide:alert-triangle"}></iconify-icon>
            {platformActive ? "Platform is Active" : "Platform is Halted"}
          </div>
          <p>{platformActive
            ? "All clinical sessions and platform features are operating normally. Disabling will halt new sessions."
            : "New ambient sessions are blocked platform-wide. Re-enable to resume normal Minute Taker operation."}</p>
        </div>
        <label className="mtad-global-toggle">
          <span>Global Access</span>
          <MTADToggle on={platformActive} onClick={togglePlatform} />
        </label>
      </div>

      <div className="mtad-content-grid">
        <div className="mtad-card">
          <div className="mtad-card-head">
            <span className="mtad-card-title-text">Subscriber Management</span>
            <span className="mtad-count-tag">{activeCount} Active &nbsp;|&nbsp; {subscribers.length} Total</span>
          </div>
          <div className="mtad-row-grid mtad-thead">
            <span className="mtad-th">Clinician</span>
            <span className="mtad-th">Status</span>
            <span className="mtad-th">Sessions</span>
            <span className="mtad-th">Join Date</span>
            <span className="mtad-th">Toggle</span>
          </div>
          {subscribers.map((s, i) => (
            <div key={s.name} className="mtad-row-grid mtad-trow">
              <span className="mtad-name-cell">{s.name}</span>
              <span className={"mtad-status-pill " + (s.status === "Active" ? "success" : "danger")}>{s.status}</span>
              <span>{s.sessions}</span>
              <span className="mtad-muted">{s.joined}</span>
              <MTADToggle on={s.status === "Active"} disabled={!platformActive} onClick={() => toggleSubscriber(i)} />
            </div>
          ))}
        </div>

        <div className="mtad-card mtad-audit-card">
          <div className="mtad-card-head"><span className="mtad-card-title-text">Audit Trail</span></div>
          <div className="mtad-audit-list">
            {audit.map((a, i) => (
              <div key={i} className="mtad-audit-item">
                <div className="mtad-audit-title">{a.title}</div>
                <div className="mtad-audit-detail">{a.detail}</div>
                <div className="mtad-audit-when">{a.when}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MTADApp() {
  return (
    <div className="mtad-shell">
      <MTADSidebar />
      <div className="mtad-main">
        <MTADHeader />
        <MTADView />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTADApp />);
