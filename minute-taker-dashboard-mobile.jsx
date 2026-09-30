/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Clinician Dashboard
   Entry point reached from the Agents catalogue ("Open Minute Taker").
   Hero greeting with today's numbers + Start session, today's consultations,
   voice profile ring, recent patients rail. Runs on window.PFMT
   (minute-taker-mobile-shell.jsx). Classes prefixed mtdm-.
   =========================================================================== */
const { useState: useStateMTDM } = React;
const MT = window.PFMT;
const { Ic: IcD, Avatar: AvatarD, TopBar: TopBarD, IconBtn: IconBtnD, StatusPill: StatusPillD, Shell: ShellD } = MT;

const MTDM_SESSIONS = [
  { patient: "Eleanor Vance", id: "MT-77213", day: "today", time: "09:30", duration: "45 min", status: "Note Ready", type: "Injectables follow-up" },
  { patient: "Marcus Thorne", id: "MT-77198", day: "today", time: "08:00", duration: "30 min", status: "Processing", type: "New patient consult" },
  { patient: "Sarah Jenkins", id: "MT-84729", day: "yesterday", time: "16:15", duration: "55 min", status: "Saved", type: "Post-op review" },
  { patient: "David Cho", id: "MT-77042", day: "yesterday", time: "14:00", duration: "20 min", status: "Saved", type: "Acne protocol · S2" },
];
const MTDM_UPCOMING = { patient: "Priya Natarajan", time: "11:15", type: "Skin consult" };
const MTDM_RECENT = ["Eleanor Vance", "Sarah Jenkins", "David Cho", "Marcus Thorne"];

function MTDMHero({ counts }) {
  return (
    <section className="mtdm-hero mt-fade-in" aria-label="Today">
      <span className="mtdm-hero-orb o1" aria-hidden="true" /><span className="mtdm-hero-orb o2" aria-hidden="true" />
      <div className="mtdm-hero-wave" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ height: 6 + Math.round(18 * Math.abs(Math.sin(i * 0.9))), animationDelay: (i * -0.09) + "s" }} />)}
      </div>
      <div className="mtdm-hero-eyebrow">{MT.todayLabel()}</div>
      <h1 className="mtdm-hero-title">{MT.greeting()},<br />Dr Smith</h1>
      <p className="mtdm-hero-sub">{counts.today} consultations today · {counts.ready} note ready to review</p>
      <div className="mtdm-stats">
        <div className="mtdm-stat"><strong>{counts.today}</strong><span>Today</span></div>
        <div className="mtdm-stat"><strong>{counts.ready}</strong><span>To review</span></div>
        <div className="mtdm-stat"><strong>2<em>m</em></strong><span>Avg. write-up</span></div>
      </div>
      <button type="button" className="mt-btn mt-btn-light mt-btn-block mtdm-start" onClick={() => MT.go(MT.routes.start)}>
        <span className="mtdm-start-mic"><IcD name="lucide:mic" size={18} /></span>
        Start session
        <IcD name="lucide:arrow-right" size={18} />
      </button>
    </section>
  );
}

function MTDMSessionRow({ row, onOpen }) {
  const processing = row.status === "Processing";
  return (
    <button type="button" className={"mtdm-row" + (processing ? " is-processing" : "")} onClick={() => onOpen(row)} disabled={processing}
      aria-label={row.patient + ", " + row.status}>
      <AvatarD name={row.patient} size={44} />
      <div className="mtdm-row-main">
        <span className="mtdm-row-name">{row.patient}</span>
        <span className="mtdm-row-meta">{row.time} · {row.duration} · {row.type}</span>
      </div>
      <div className="mtdm-row-side">
        <StatusPillD status={row.status} compact />
        <IcD name="lucide:chevron-right" size={16} />
      </div>
    </button>
  );
}

function MTDMVoiceCard({ toast }) {
  const [open, setOpen] = useStateMTDM(false);
  const pct = 98;
  const r = 26, c = 2 * Math.PI * r;
  return (
    <section className="mt-card mtdm-voice">
      <div className="mt-card-head">
        <span className="mt-card-title"><span className="mt-ti"><IcD name="lucide:audio-lines" size={15} /></span>Voice profile</span>
        <button type="button" className="mt-link" onClick={() => setOpen((v) => !v)}>{open ? "Hide" : "Manage"}<IcD name={open ? "lucide:chevron-up" : "lucide:chevron-right"} size={14} /></button>
      </div>
      <div className="mtdm-voice-row">
        <div className="mtdm-ring" role="img" aria-label={pct + "% voice match"}>
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r={r} className="mtdm-ring-track" />
            <circle cx="32" cy="32" r={r} className="mtdm-ring-fill" style={{ strokeDasharray: c, strokeDashoffset: c * (1 - pct / 100) }} />
          </svg>
          <span className="mtdm-ring-val">{pct}<em>%</em></span>
        </div>
        <div className="mtdm-voice-text">
          <div className="mtdm-voice-title"><span className="mtdm-live-dot" />Profile active</div>
          <div className="mtdm-voice-sub">Minute Taker recognises your voice, so clinician and patient speech stay separated.</div>
        </div>
      </div>
      {open && (
        <div className="mtdm-voice-detail mt-fade-in">
          <div className="mtdm-kv"><span>Match confidence</span><strong>98%</strong></div>
          <div className="mtdm-kv"><span>Sample length</span><strong>32 s</strong></div>
          <div className="mtdm-kv"><span>Last recalibrated</span><strong>2 weeks ago</strong></div>
          <button type="button" className="mt-btn mt-btn-soft mt-btn-block" onClick={() => toast.show("Re-recording opens on your next session.")}>
            <IcD name="lucide:mic" size={16} />Re-record sample
          </button>
        </div>
      )}
    </section>
  );
}

function MTDMView() {
  const toast = MT.useToast();
  const today = MTDM_SESSIONS.filter((s) => s.day === "today");
  const earlier = MTDM_SESSIONS.filter((s) => s.day !== "today");
  const counts = { today: today.length + 1, ready: MTDM_SESSIONS.filter((s) => s.status === "Note Ready").length };

  function openSession(row) {
    MT.go(MT.routes.review + "?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
  }

  return (
    <div className="mt-screen mtdm-screen">
      <TopBarD
        left={<IconBtnD icon="lucide:arrow-left" label="Back to Agents" onClick={() => MT.go(MT.routes.agents)} />}
        title="Minute Taker"
        sub="Ambient clinical scribe"
        right={<img className="mtdm-me" src="assets/avatar-katy.jpg" alt="Dr Katie Smith" />}
      />

      <div className="mt-scroll">
        <MTDMHero counts={counts} />

        <div className="mt-section-label">Today</div>
        <section className="mt-card mtdm-list">
          {today.map((row) => <MTDMSessionRow key={row.id} row={row} onOpen={openSession} />)}
          <button type="button" className="mtdm-row mtdm-row-upcoming" onClick={() => MT.go(MT.routes.start + "?patient=" + encodeURIComponent(MTDM_UPCOMING.patient))}>
            <span className="mtdm-upcoming-time"><strong>{MTDM_UPCOMING.time}</strong><span>next</span></span>
            <div className="mtdm-row-main">
              <span className="mtdm-row-name">{MTDM_UPCOMING.patient}</span>
              <span className="mtdm-row-meta">{MTDM_UPCOMING.type} · not started</span>
            </div>
            <span className="mt-pill mt-pill-muted"><IcD name="lucide:calendar" size={12} />Scheduled</span>
          </button>
        </section>

        <div className="mt-section-label mtdm-label-row">
          <span>Earlier</span>
          <button type="button" className="mt-link" onClick={() => MT.go(MT.routes.archive)}>View archive<IcD name="lucide:arrow-up-right" size={14} /></button>
        </div>
        <section className="mt-card mtdm-list">
          {earlier.map((row) => <MTDMSessionRow key={row.id} row={row} onOpen={openSession} />)}
        </section>

        <div className="mt-section-label">Recent patients</div>
        <div className="mtdm-rail" role="list">
          {MTDM_RECENT.map((name) => {
            const p = MT.PATIENTS[name];
            return (
              <button key={name} type="button" role="listitem" className="mtdm-chip" onClick={() => MT.go(MT.routes.start + "?patient=" + encodeURIComponent(name))}>
                <AvatarD name={name} size={48} />
                <span className="mtdm-chip-name">{name.split(" ")[0]}</span>
                <span className="mtdm-chip-sub">{p ? p.lastVisit : "New"}</span>
              </button>
            );
          })}
          <button type="button" role="listitem" className="mtdm-chip" onClick={() => MT.go(MT.routes.start + "?patient=__new__")}>
            <AvatarD isNew size={48} />
            <span className="mtdm-chip-name">New</span>
            <span className="mtdm-chip-sub">patient</span>
          </button>
        </div>

        <div className="mt-section-label">Your setup</div>
        <MTDMVoiceCard toast={toast} />

        <div className="mt-trust">
          <span className="mt-ti"><IcD name="lucide:shield-check" size={15} /></span>
          <span>Notes are written to your EMR after you approve them. Audio is transcribed live and never stored.</span>
        </div>
        <div className="mt-spacer" />
      </div>
      {toast.node}
    </div>
  );
}

function MTDMApp() {
  return <ShellD label="Minute Taker Dashboard (mobile)"><MTDMView /></ShellD>;
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTDMApp />);
