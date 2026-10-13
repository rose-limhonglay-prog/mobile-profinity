/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Clinician Dashboard
   Entry point reached from the Agents catalogue ("Open Minute Taker").
   Hero greeting with today's numbers + Start session, today's consultations,
   recent patients rail (voice profile card removed 2026-10-12). Runs on window.PFMT
   (minute-taker-mobile-shell.jsx). Classes prefixed mtdm-.
   =========================================================================== */
const { useState: useStateMTDM } = React;
const MT = window.PFMT;
const { Ic: IcD, Avatar: AvatarD, TopBar: TopBarD, IconBtn: IconBtnD, StatusPill: StatusPillD, Shell: ShellD } = MT;

const MTDM_SESSIONS = [
  { sid: "s1", patient: "Eleanor Vance", id: "MT-77213", day: "today", time: "09:30", duration: "45 min", status: "Note Ready", type: "Injectables follow-up" },
  { sid: "s2", patient: "Marcus Thorne", id: "MT-77198", day: "today", time: "08:00", duration: "30 min", status: "Processing", type: "New patient consult" },
  { sid: "s3", patient: "Sarah Jenkins", id: "MT-84729", day: "yesterday", when: "Yesterday", time: "16:15", duration: "55 min", status: "Saved", type: "Post-op review" },
  { sid: "s4", patient: "David Cho", id: "MT-77042", day: "yesterday", when: "Yesterday", time: "14:00", duration: "20 min", status: "Saved", type: "Acne protocol · S2" },
  { sid: "s5", patient: "Priya Natarajan", id: "MT-77310", day: "earlier", when: "5 days ago", time: "10:45", duration: "35 min", status: "Saved", type: "Skin consult" },
  { sid: "s6", patient: "Eleanor Vance", id: "MT-77213", day: "earlier", when: "2 weeks ago", time: "11:00", duration: "40 min", status: "Saved", type: "Injectables · session 1" },
  { sid: "s7", patient: "Sarah Jenkins", id: "MT-84729", day: "earlier", when: "3 weeks ago", time: "09:00", duration: "50 min", status: "Saved", type: "Knee arthroscopy review" },
  { sid: "s8", patient: "David Cho", id: "MT-77042", day: "earlier", when: "4 weeks ago", time: "15:30", duration: "25 min", status: "Saved", type: "Acne protocol · S1" },
  { sid: "s9", patient: "Amir Khan", id: "MT-76980", day: "earlier", when: "2 months ago", time: "10:00", duration: "30 min", status: "Saved", type: "Rosacea review" },
];
const MTDM_UPCOMING = [
  { patient: "Priya Natarajan", time: "11:15", type: "Skin consult" },
  { patient: "Amir Khan", time: "14:30", type: "Rosacea follow-up" },
  { patient: "Sarah Jenkins", time: "16:00", type: "Post-op check" },
];
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

function MTDMSessionRow({ row, onOpen, onMenu }) {
  const processing = row.status === "Processing";
  return (
    <div className={"mtdm-row" + (processing ? " is-processing" : "")}>
      <button type="button" className="mtdm-row-tap" onClick={() => onOpen(row)} disabled={processing} aria-label={row.patient + ", " + row.status}>
        <AvatarD name={row.patient} size={44} />
        <div className="mtdm-row-main">
          <span className="mtdm-row-name">{row.patient}</span>
          <span className="mtdm-row-meta">{row.when ? row.when + " " + row.time : row.time + " · " + row.duration} · {row.type}</span>
        </div>
        <StatusPillD status={row.status} compact />
      </button>
      <button type="button" className="mtdm-row-kebab" aria-label={"More options for " + row.patient} aria-haspopup="dialog" onClick={() => onMenu(row)}>
        <IcD name="lucide:ellipsis-vertical" size={18} />
      </button>
    </div>
  );
}

/* kebab bottom sheet: Clinical note · Archive · Download */
const MTDM_MENU = [
  { key: "note", icon: "lucide:file-text", label: "Clinical note", sub: "Open and review the note", busy: "Still being written" },
  { key: "archive", icon: "lucide:archive", label: "Archive", sub: "Move this session to the archive" },
  { key: "download", icon: "lucide:download", label: "Download", sub: "Save the note as a PDF", busy: "Available once the note is ready" },
];
function MTDMRowMenu({ row, onClose, onAction }) {
  if (!row) return null;
  const processing = row.status === "Processing";
  return (
    <div className="mtdm-scrim" onClick={onClose}>
      <div className="mtdm-sheet" role="dialog" aria-modal="true" aria-label={"Options for " + row.patient} onClick={(e) => e.stopPropagation()}>
        <span className="mtdm-sheet-grab" aria-hidden="true" />
        <div className="mtdm-sheet-head">
          <AvatarD name={row.patient} size={40} />
          <div className="mtdm-sheet-title"><strong>{row.patient}</strong><span>{row.when ? row.when + " " + row.time : row.time + " · " + row.duration} · {row.type}</span></div>
          <button type="button" className="mtdm-sheet-x" aria-label="Close" onClick={onClose}><IcD name="lucide:x" size={16} /></button>
        </div>
        <div className="mtdm-menu">
          {MTDM_MENU.map((it) => {
            const off = processing && !!it.busy;
            return (
              <button key={it.key} type="button" className="mtdm-menu-item" disabled={off} onClick={() => onAction(it.key, row)}>
                <span className="mtdm-menu-ic"><IcD name={it.icon} size={18} /></span>
                <span className="mtdm-menu-text"><strong>{it.label}</strong><span>{off ? it.busy : it.sub}</span></span>
                <IcD name="lucide:chevron-right" size={16} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MTDMView() {
  const toast = MT.useToast();
  const [archived, setArchived] = useStateMTDM([]);
  /* ?menu=<session id> opens a row's sheet straight away (demo / screenshots) */
  const [menuRow, setMenuRow] = useStateMTDM(() => MTDM_SESSIONS.find((s) => s.id === MT.getParam("menu") || s.sid === MT.getParam("menu")) || null);
  const [view, setView] = useStateMTDM(MT.getParam("view") === "saved" ? "saved" : "upcoming");
  const sessions = MTDM_SESSIONS.filter((s) => !archived.includes(s.sid));
  const today = sessions.filter((s) => s.day === "today");
  const counts = { today: today.length + MTDM_UPCOMING.length, ready: sessions.filter((s) => s.status === "Note Ready").length };

  function openSession(row) {
    MT.go(MT.routes.review + "?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
  }
  function menuAction(key, row) {
    if (key === "note") { openSession(row); return; }
    setMenuRow(null);
    if (key === "archive") { setArchived((a) => a.concat(row.sid)); toast.show("Moved to the archive", "ok"); }
    if (key === "download") toast.show("Downloading the note as a PDF…");
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

        <div className="mt-section-label mtdm-label-row">
          <span>Sessions</span>
          <button type="button" className="mt-link" onClick={() => MT.go(MT.routes.archive)}>View archive<IcD name="lucide:arrow-up-right" size={14} /></button>
        </div>
        <section className="mt-card mtdm-list">
          <div className="mtdm-seg" role="tablist" aria-label="Sessions view">
            <button type="button" role="tab" aria-selected={view === "upcoming"} className={"mtdm-seg-btn" + (view === "upcoming" ? " is-on" : "")} onClick={() => setView("upcoming")}>
              Upcoming<em>{MTDM_UPCOMING.length}</em>
            </button>
            <button type="button" role="tab" aria-selected={view === "saved"} className={"mtdm-seg-btn" + (view === "saved" ? " is-on" : "")} onClick={() => setView("saved")}>
              Saved<em>{sessions.length}</em>
            </button>
          </div>
          {view === "upcoming" ? (
            <div className="mtdm-view mt-fade-in" key="upcoming">
              {MTDM_UPCOMING.map((u, i) => (
                <div key={u.patient + u.time} className="mtdm-row is-upcoming">
                  <button type="button" className="mtdm-row-tap" onClick={() => MT.go(MT.routes.start + "?patient=" + encodeURIComponent(u.patient))}>
                    <span className="mtdm-upcoming-time"><strong>{u.time}</strong><span>{i === 0 ? "next" : "today"}</span></span>
                    <div className="mtdm-row-main">
                      <span className="mtdm-row-name">{u.patient}</span>
                      <span className="mtdm-row-meta">{u.type} · not started</span>
                    </div>
                    <span className="mt-pill mt-pill-muted"><IcD name="lucide:calendar" size={12} />Scheduled</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mtdm-view mt-fade-in" key="saved">
              {sessions.map((row) => <MTDMSessionRow key={row.sid} row={row} onOpen={openSession} onMenu={setMenuRow} />)}
              {sessions.length === 0 && <div className="mtdm-empty">Everything has been archived.</div>}
            </div>
          )}
        </section>

        <div className="mt-trust">
          <span className="mt-ti"><IcD name="lucide:shield-check" size={15} /></span>
          <span>Notes are written to your EMR after you approve them. Audio is transcribed live and never stored.</span>
        </div>
        <div className="mt-spacer" />
      </div>
      <MTDMRowMenu row={menuRow} onClose={() => setMenuRow(null)} onAction={menuAction} />
      {toast.node}
    </div>
  );
}

function MTDMApp() {
  return <ShellD label="Minute Taker Dashboard (mobile)"><MTDMView /></ShellD>;
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTDMApp />);
