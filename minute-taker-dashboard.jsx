/* ===========================================================================
   PROfinity — Minute Taker · Clinician Dashboard (web)
   Landing hub for the Minute Taker ambient documentation agent: gradient
   hero with today's numbers + Start session, today's / earlier sessions
   with patient avatars, voice-profile ring, recent patients. Web twin of
   MinuteTakerDashboardMobile (minute-taker-dashboard-mobile.jsx).
   PRD: Minute Taker Assistant Agent v1.0 — Screen 1 (Sec. 3.1 / MT-K02, MT-K03).
   Classes prefixed mtd- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMTD } = React;

function goMTD(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const MT_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:users", label: "Patients" },
  { icon: "lucide:archive", label: "Archive" },
];
const MT_NAV_LINKS = {
  "Dashboard": "MinuteTakerDashboard.html",
  "Patients": "MinuteTakerPatientContext.html",
  "Archive": "MinuteTakerArchive.html",
};

function MTDSidebar({ active }) {
  return (
    <aside className="mtd-sidebar">
      <button type="button" className="mtd-back" onClick={() => goMTD("Agent.html")}>
        <iconify-icon icon="lucide:arrow-left"></iconify-icon>All agents
      </button>
      <div className="mtd-logo">
        <span className="mtd-logo-mark"><iconify-icon icon="lucide:mic"></iconify-icon></span>
        <span>Minute Taker</span>
      </div>
      {MT_NAV.map((item) => (
        <button key={item.label} className={"mtd-navitem" + (item.label === active ? " is-active" : "")} type="button"
          onClick={item.label !== active ? () => goMTD(MT_NAV_LINKS[item.label]) : undefined}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
        </button>
      ))}
      <div className="mtd-side-foot">
        <iconify-icon icon="lucide:shield-check"></iconify-icon>
        <span>Audio is transcribed live and never stored. Notes reach the EMR only after you approve them.</span>
      </div>
    </aside>
  );
}

function MTDHeader({ title }) {
  return (
    <header className="mtd-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="mtd-header-title">{title}</span>
      <div className="mtd-spacer" />
      <div className="mtd-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="mtd-bell-badge">2</span>
      </div>
      <div className="mtd-user">
        <div className="mtd-user-name">Dr. Katie Smith</div>
        <div className="mtd-user-role">Clinician</div>
      </div>
      <img className="mtd-user-avatar" src="assets/avatar-katy.jpg" alt="Dr. Katie Smith" />
    </header>
  );
}

/* ---------------------------------------------------------------- data */
const MTD_SESSIONS = [
  { patient: "Eleanor Vance", id: "MT-77213", day: "today", time: "09:30", duration: "45 min", status: "Note Ready", type: "Injectables follow-up" },
  { patient: "Marcus Thorne", id: "MT-77198", day: "today", time: "08:00", duration: "30 min", status: "Processing", type: "New patient consult" },
  { patient: "Sarah Jenkins", id: "MT-84729", day: "yesterday", time: "16:15", duration: "55 min", status: "Saved", type: "Post-op review" },
  { patient: "David Cho", id: "MT-77042", day: "yesterday", time: "14:00", duration: "20 min", status: "Saved", type: "Acne protocol · S2" },
];
const MTD_UPCOMING = { patient: "Priya Natarajan", time: "11:15", type: "Skin consult" };
const MTD_RECENT = [
  { name: "Eleanor Vance", sub: "Today", tone: "teal" },
  { name: "Sarah Jenkins", sub: "3 weeks ago", tone: "violet" },
  { name: "David Cho", sub: "Yesterday", tone: "rose" },
  { name: "Marcus Thorne", sub: "Today", tone: "amber" },
];
const MTD_TONES = { "Eleanor Vance": "teal", "Sarah Jenkins": "violet", "David Cho": "rose", "Marcus Thorne": "amber" };
const MTD_STATUS = {
  "Note Ready": { cls: "info", icon: "lucide:sparkles", label: "Ready to review", cta: "Review note" },
  "Processing": { cls: "warn", icon: "lucide:loader-circle", label: "Writing note", cta: "Please wait" },
  "Saved": { cls: "ok", icon: "lucide:check", label: "Saved to EMR", cta: "View note" },
};

function mtdInitials(name) { return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase(); }
function mtdGreeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }
function mtdToday() { try { return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }); } catch (e) { return ""; } }

function MTDAvatar({ name, size = 40, tone }) {
  return <span className={"mtd-avatar mtd-tone-" + (tone || MTD_TONES[name] || "slate")} style={{ width: size, height: size, fontSize: Math.round(size * .36) }} aria-hidden="true">{mtdInitials(name)}</span>;
}

/* ---------------------------------------------------------------- view */
function MTDSessionRow({ row }) {
  const meta = MTD_STATUS[row.status];
  const disabled = row.status === "Processing";
  const open = () => goMTD("MinuteTakerNoteReview.html?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
  return (
    <div className={"mtd-trow" + (disabled ? " is-processing" : "")}>
      <div className="mtd-cell-patient">
        <MTDAvatar name={row.patient} size={42} />
        <div>
          <div className="mtd-patient-cell">{row.patient}</div>
          <div className="mtd-when-cell">{row.type}</div>
        </div>
      </div>
      <span className="mtd-when-cell mtd-cell-time"><strong>{row.time}</strong> · {row.duration}</span>
      <span className={"mtd-status-pill mtd-status-" + meta.cls + (disabled ? " is-spin" : "")}>
        <iconify-icon icon={meta.icon}></iconify-icon>{meta.label}
      </span>
      <button type="button" className={"mtd-row-btn" + (disabled ? " is-disabled" : "")} disabled={disabled} onClick={disabled ? undefined : open}>
        {meta.cta}{!disabled && <iconify-icon icon="lucide:chevron-right"></iconify-icon>}
      </button>
    </div>
  );
}

function MTDView() {
  const [search, setSearch] = useStateMTD("");
  const [showProfile, setShowProfile] = useStateMTD(false);
  const today = MTD_SESSIONS.filter((s) => s.day === "today");
  const earlier = MTD_SESSIONS.filter((s) => s.day !== "today");
  const ready = MTD_SESSIONS.filter((s) => s.status === "Note Ready").length;
  const pct = 98, r = 30, c = 2 * Math.PI * r;

  function startSession() {
    const target = search.trim() || "Sarah Jenkins";
    goMTD("MinuteTakerPatientContext.html?patient=" + encodeURIComponent(target));
  }

  return (
    <div className="mtd-view">
      <section className="mtd-hero" aria-label="Today">
        <span className="mtd-hero-orb o1" aria-hidden="true" /><span className="mtd-hero-orb o2" aria-hidden="true" />
        <div className="mtd-hero-wave" aria-hidden="true">
          {Array.from({ length: 34 }).map((_, i) => <i key={i} style={{ height: 8 + Math.round(24 * Math.abs(Math.sin(i * 0.9))), animationDelay: (i * -0.09) + "s" }} />)}
        </div>
        <div className="mtd-hero-main">
          <div className="mtd-hero-eyebrow">{mtdToday()}</div>
          <h1>{mtdGreeting()}, Dr Smith</h1>
          <p>{today.length + 1} consultations today · {ready} note ready to review</p>
          <div className="mtd-search-wrap">
            <iconify-icon icon="lucide:search"></iconify-icon>
            <input placeholder="Search patients by name, ID or DOB to start a session…" value={search}
              onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") startSession(); }} />
            <button className="mtd-btn mtd-btn-light" type="button" onClick={startSession}>
              <span className="mtd-start-mic"><iconify-icon icon="lucide:mic"></iconify-icon></span>Start session
            </button>
          </div>
        </div>
        <div className="mtd-stats">
          <div className="mtd-stat"><strong>{today.length + 1}</strong><span>Today</span></div>
          <div className="mtd-stat"><strong>{ready}</strong><span>To review</span></div>
          <div className="mtd-stat"><strong>2<em>m</em></strong><span>Avg. write-up</span></div>
          <div className="mtd-stat"><strong>98<em>%</em></strong><span>Voice match</span></div>
        </div>
      </section>

      <div className="mtd-grid">
        <div className="mtd-main-col">
          <div className="mtd-card">
            <div className="mtd-card-head">
              <span className="mtd-card-title-text"><span className="mtd-ti"><iconify-icon icon="lucide:calendar-days"></iconify-icon></span>Today</span>
            </div>
            <div className="mtd-thead">
              <span className="mtd-th">Patient</span><span className="mtd-th">Time</span><span className="mtd-th">Status</span><span className="mtd-th">Action</span>
            </div>
            {today.map((row) => <MTDSessionRow key={row.id} row={row} />)}
            <div className="mtd-trow mtd-trow-upcoming">
              <div className="mtd-cell-patient">
                <span className="mtd-upcoming-time"><strong>{MTD_UPCOMING.time}</strong><span>next</span></span>
                <div>
                  <div className="mtd-patient-cell">{MTD_UPCOMING.patient}</div>
                  <div className="mtd-when-cell">{MTD_UPCOMING.type}</div>
                </div>
              </div>
              <span className="mtd-when-cell mtd-cell-time">Not started</span>
              <span className="mtd-status-pill mtd-status-muted"><iconify-icon icon="lucide:calendar"></iconify-icon>Scheduled</span>
              <button type="button" className="mtd-row-btn mtd-row-btn-primary" onClick={() => goMTD("MinuteTakerPatientContext.html?patient=" + encodeURIComponent(MTD_UPCOMING.patient))}>
                Prepare<iconify-icon icon="lucide:chevron-right"></iconify-icon>
              </button>
            </div>
          </div>

          <div className="mtd-card">
            <div className="mtd-card-head">
              <span className="mtd-card-title-text"><span className="mtd-ti"><iconify-icon icon="lucide:history"></iconify-icon></span>Earlier</span>
              <a href="MinuteTakerArchive.html" onClick={(e) => { e.preventDefault(); goMTD("MinuteTakerArchive.html"); }}>View archive <iconify-icon icon="lucide:arrow-up-right"></iconify-icon></a>
            </div>
            {earlier.map((row) => <MTDSessionRow key={row.id} row={row} />)}
          </div>
        </div>

        <div className="mtd-side-col">
          <div className="mtd-card mtd-enrol-card">
            <div className="mtd-card-head">
              <span className="mtd-card-title-text"><span className="mtd-ti"><iconify-icon icon="lucide:audio-lines"></iconify-icon></span>Voice profile</span>
              <button type="button" className="mtd-link" onClick={() => setShowProfile((v) => !v)}>{showProfile ? "Hide" : "Manage"}</button>
            </div>
            <div className="mtd-voice-row">
              <div className="mtd-ring" role="img" aria-label={pct + "% voice match"}>
                <svg viewBox="0 0 72 72" width="72" height="72">
                  <circle cx="36" cy="36" r={r} className="mtd-ring-track" />
                  <circle cx="36" cy="36" r={r} className="mtd-ring-fill" style={{ strokeDasharray: c, strokeDashoffset: c * (1 - pct / 100) }} />
                </svg>
                <span className="mtd-ring-val">{pct}<em>%</em></span>
              </div>
              <div>
                <div className="mtd-voice-title"><span className="mtd-live-dot" />Profile active</div>
                <div className="mtd-voice-sub">Minute Taker recognises your voice, so clinician and patient speech stay separated.</div>
              </div>
            </div>
            {showProfile && (
              <div className="mtd-enrol-detail">
                <div className="mtd-enrol-detail-row"><span>Match confidence</span><strong>98%</strong></div>
                <div className="mtd-enrol-detail-row"><span>Sample length</span><strong>32 s</strong></div>
                <div className="mtd-enrol-detail-row"><span>Last recalibrated</span><strong>2 weeks ago</strong></div>
                <button className="mtd-btn mtd-btn-soft" type="button"><iconify-icon icon="lucide:mic"></iconify-icon>Re-record sample</button>
              </div>
            )}
          </div>

          <div className="mtd-card">
            <div className="mtd-card-head">
              <span className="mtd-card-title-text"><span className="mtd-ti"><iconify-icon icon="lucide:users"></iconify-icon></span>Recent patients</span>
            </div>
            <div className="mtd-recent-list">
              {MTD_RECENT.map((p) => (
                <button key={p.name} type="button" className="mtd-recent-item" onClick={() => goMTD("MinuteTakerPatientContext.html?patient=" + encodeURIComponent(p.name))}>
                  <MTDAvatar name={p.name} size={36} tone={p.tone} />
                  <span className="mtd-recent-main"><span>{p.name}</span><small>Last visit {p.sub}</small></span>
                  <iconify-icon icon="lucide:chevron-right"></iconify-icon>
                </button>
              ))}
              <button type="button" className="mtd-recent-item mtd-recent-new" onClick={() => goMTD("MinuteTakerPatientContext.html?patient=__new__")}>
                <span className="mtd-avatar mtd-tone-new" style={{ width: 36, height: 36 }}><iconify-icon icon="lucide:user-plus"></iconify-icon></span>
                <span className="mtd-recent-main"><span>New patient</span><small>Start with a blank record</small></span>
                <iconify-icon icon="lucide:chevron-right"></iconify-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MTDApp() {
  return (
    <div className="mtd-shell">
      <MTDSidebar active="Dashboard" />
      <div className="mtd-main">
        <MTDHeader title="Minute Taker" />
        <MTDView />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTDApp />);
