/* ===========================================================================
   PROfinity — Minute Taker (web) · Archive & Search with AI Copilot
   Web twin of MinuteTakerArchiveMobile (minute-taker-archive-mobile.jsx):
   search + period / type filters over every past session grouped by day,
   each row opening the note review, plus an AI Copilot card that answers
   across the sessions in view. Runs on window.PFMTW. Classes prefixed mta-.
   =========================================================================== */
const { useState: useStateMTA, useMemo: useMemoMTA } = React;
const MTA = window.PFMTW;
const { Avatar: AvatarA, StatusPill: StatusPillA, Seg: SegA, Shell: ShellA } = MTA;

/* same sessions as the mobile archive; daysAgo keeps the groups correct whatever today's date is */
const MTA_SESSIONS = [
  { patient: "Eleanor Vance", id: "MT-77213", daysAgo: 0, time: "09:30", duration: "45 min", status: "Note Ready", type: "Injectables follow-up", kind: "Follow-up" },
  { patient: "Marcus Thorne", id: "MT-77198", daysAgo: 0, time: "08:00", duration: "30 min", status: "Processing", type: "New patient consult", kind: "Consult" },
  { patient: "Sarah Jenkins", id: "MT-84729", daysAgo: 1, time: "16:15", duration: "55 min", status: "Saved", type: "Post-op review", kind: "Review" },
  { patient: "David Cho", id: "MT-77042", daysAgo: 1, time: "14:00", duration: "20 min", status: "Saved", type: "Acne protocol · S2", kind: "Treatment" },
  { patient: "Priya Natarajan", id: "MT-77310", daysAgo: 5, time: "10:45", duration: "35 min", status: "Saved", type: "Skin consult", kind: "Consult" },
  { patient: "Eleanor Vance", id: "MT-77213", daysAgo: 13, time: "11:00", duration: "40 min", status: "Saved", type: "Injectables · session 1", kind: "Treatment" },
  { patient: "Sarah Jenkins", id: "MT-84729", daysAgo: 22, time: "09:00", duration: "50 min", status: "Saved", type: "Knee arthroscopy review", kind: "Review" },
  { patient: "David Cho", id: "MT-77042", daysAgo: 29, time: "15:30", duration: "25 min", status: "Saved", type: "Acne protocol · S1", kind: "Treatment" },
  { patient: "Priya Natarajan", id: "MT-77310", daysAgo: 41, time: "13:15", duration: "45 min", status: "Saved", type: "New patient consult", kind: "Consult" },
  { patient: "Marcus Thorne", id: "MT-77198", daysAgo: 50, time: "11:30", duration: "35 min", status: "Saved", type: "Rosacea follow-up", kind: "Follow-up" },
  { patient: "Amir Khan", id: "MT-76980", daysAgo: 63, time: "10:00", duration: "30 min", status: "Saved", type: "Rosacea review", kind: "Review" },
  { patient: "Eleanor Vance", id: "MT-77213", daysAgo: 75, time: "09:15", duration: "30 min", status: "Saved", type: "Skin consult", kind: "Consult" },
];
const MTA_PERIODS = [
  { key: "all", label: "All time", max: Infinity },
  { key: "7", label: "7 days", max: 7 },
  { key: "30", label: "30 days", max: 30 },
];
const MTA_KINDS = ["All types", "Consult", "Follow-up", "Review", "Treatment"];
const MTA_COPILOT = [
  { match: /rosacea|amir/i, text: "Amir Khan's rosacea review (2 months ago) recorded fewer flares on the current regimen, with good tolerance and no new triggers. The plan was to continue unchanged and review again in 3 months." },
  { match: /acne|david/i, text: "David Cho has had 2 acne protocol sessions. Session 1 noted mild dryness that settled within a week; session 2 (yesterday) documented clear improvement against the progress photos, with the protocol continuing as planned." },
  { match: /inject|eleanor|bruis/i, text: "Eleanor Vance's injectable series: session 1 (2 weeks ago) noted minor bruising that resolved. Today's follow-up recorded good symmetry and high satisfaction, with no top-up required before the next review." },
  { match: /knee|post-op|sarah/i, text: "Sarah Jenkins' post-op reviews show steady progress since the knee arthroscopy: pain scores dropped from 5 to 2, mobility is improving, and there have been no signs of infection at either visit." },
  { match: /.*/, text: "Across the sessions in view, most visits were routine follow-ups with stable findings and no urgent flags. Ask about a patient, condition or treatment to narrow this down." },
];

function mtaDateLabel(daysAgo) {
  const d = new Date(); d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
function mtaGroup(daysAgo) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return "This week";
  if (daysAgo < 30) return "This month";
  return "Older";
}

function MTARow({ row, onOpen }) {
  const processing = row.status === "Processing";
  const meta = MTA.STATUS[row.status];
  return (
    <div className={"mta-row" + (processing ? " is-processing" : "")}>
      <div className="mta-cell-patient">
        <AvatarA name={row.patient} size={42} />
        <div className="mtw-grow">
          <div className="mta-row-name">{row.patient}</div>
          <div className="mta-row-meta">{row.type}{!processing && <span className="mta-audio" title="Recording kept"><iconify-icon icon="lucide:mic"></iconify-icon>Audio</span>}</div>
        </div>
      </div>
      <span className="mta-row-when"><strong>{mtaDateLabel(row.daysAgo)}</strong><span>{row.time} · {row.duration}</span></span>
      <span className="mtw-pill mtw-pill-muted mta-kind">{row.kind}</span>
      <StatusPillA status={row.status} />
      <button type="button" className={"mta-row-btn" + (processing ? " is-disabled" : "")} disabled={processing} onClick={processing ? undefined : () => onOpen(row)} aria-label={(meta ? meta.cta : "Open") + " for " + row.patient}>
        {meta ? meta.cta : "Open"}<iconify-icon icon="lucide:chevron-right"></iconify-icon>
      </button>
    </div>
  );
}

function MTACopilot({ count }) {
  const [q, setQ] = useStateMTA("");
  const [busy, setBusy] = useStateMTA(false);
  const [answer, setAnswer] = useStateMTA(null);
  function ask() {
    if (!q.trim() || busy) return;
    setBusy(true); setAnswer(null);
    window.setTimeout(() => { setAnswer(MTA_COPILOT.find((a) => a.match.test(q)).text); setBusy(false); }, 1100);
  }
  return (
    <section className="mtw-card mta-copilot mtw-sticky">
      <div className="mtw-card-head">
        <span className="mtw-card-title"><span className="mtw-ti"><iconify-icon icon="lucide:sparkles"></iconify-icon></span>AI Copilot</span>
      </div>
      <p className="mtw-hint">Ask a question across the {count} session{count === 1 ? "" : "s"} in view, e.g. "How has David's acne responded?"</p>
      <label className="mtw-field mta-copilot-field">
        <textarea rows={4} placeholder="Summarise every rosacea plan from the last 3 months…" value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ask(); }} />
      </label>
      {busy && <div className="mta-copilot-loading"><span className="mta-spinner" />Reading sessions…</div>}
      {answer && !busy && <div className="mta-copilot-answer mtw-fade-in"><iconify-icon icon="lucide:sparkles"></iconify-icon><span>{answer}</span></div>}
      <button type="button" className="mtw-btn mtw-btn-soft mtw-btn-block" onClick={ask} disabled={busy || !q.trim()}>
        <iconify-icon icon="lucide:wand-sparkles"></iconify-icon>Generate insight
      </button>
    </section>
  );
}

function MTAView() {
  const [search, setSearch] = useStateMTA("");
  const [period, setPeriod] = useStateMTA("all");
  const [kind, setKind] = useStateMTA("All types");
  const max = MTA_PERIODS.find((p) => p.key === period).max;

  const filtered = useMemoMTA(() => {
    const q = search.trim().toLowerCase();
    return MTA_SESSIONS.filter((s) => {
      if (s.daysAgo > max) return false;
      if (kind !== "All types" && s.kind !== kind) return false;
      if (q && !(s.patient.toLowerCase().includes(q) || s.type.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, max, kind]);

  const groups = useMemoMTA(() => {
    const out = [];
    filtered.forEach((s) => {
      const g = mtaGroup(s.daysAgo);
      const last = out[out.length - 1];
      if (last && last.label === g) last.rows.push(s); else out.push({ label: g, rows: [s] });
    });
    return out;
  }, [filtered]);

  const toReview = MTA_SESSIONS.filter((s) => s.status === "Note Ready").length;
  function openSession(row) {
    MTA.go(MTA.routes.review + "?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
  }
  function clear() { setSearch(""); setPeriod("all"); setKind("All types"); }

  return (
    <div className="mtw-view">
      <div className="mtw-page-head">
        <div>
          <h1>Archive</h1>
          <p>{MTA_SESSIONS.length} sessions · {toReview} to review</p>
        </div>
        <div className="mtw-page-head-actions">
          <button type="button" className="mtw-btn mtw-btn-primary" onClick={() => MTA.go(MTA.routes.start)}><iconify-icon icon="lucide:mic"></iconify-icon>Start session</button>
        </div>
      </div>

      <div className="mtw-grid">
        <div className="mtw-col">
          <div className="mta-filters">
            <div className="mtw-search mta-search">
              <iconify-icon icon="lucide:search"></iconify-icon>
              <input className="mtw-input" placeholder="Search patient, note or ID…" value={search} onChange={(e) => setSearch(e.target.value)} autoComplete="off" />
              {search && <button type="button" className="mtw-search-clear" aria-label="Clear search" onClick={() => setSearch("")}><iconify-icon icon="lucide:x"></iconify-icon></button>}
            </div>
            <SegA items={MTA_PERIODS} value={period} onChange={setPeriod} label="Period" className="mta-period" />
          </div>
          <div className="mta-chips" role="list">
            {MTA_KINDS.map((k) => (
              <button key={k} type="button" role="listitem" className={"mta-chip" + (kind === k ? " is-on" : "")} onClick={() => setKind(k)}>{k}</button>
            ))}
          </div>

          {groups.map((g) => (
            <section key={g.label} className="mta-group mtw-fade-in">
              <div className="mtw-section-label mta-label-row"><span>{g.label}</span><span className="mta-count">{g.rows.length}</span></div>
              <div className="mtw-card mta-list">
                {g.rows.map((row, i) => <MTARow key={row.id + "-" + row.daysAgo + "-" + i} row={row} onOpen={openSession} />)}
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <div className="mta-empty mtw-fade-in">
              <span className="mta-empty-ic"><iconify-icon icon="lucide:archive-x"></iconify-icon></span>
              <strong>No sessions match</strong>
              <span>Try another name, a wider period or a different type.</span>
              <button type="button" className="mtw-btn mtw-btn-ghost mtw-btn-sm" onClick={clear}>Clear filters</button>
            </div>
          )}

          <div className="mtw-trust">
            <span className="mtw-ti"><iconify-icon icon="lucide:shield-check"></iconify-icon></span>
            <span>Notes stay in your EMR. The archive lists the sessions you approved, each with its recording kept for 30 days.</span>
          </div>
        </div>

        <div className="mtw-col">
          <MTACopilot count={filtered.length} />
        </div>
      </div>
    </div>
  );
}

function MTAApp() {
  return <ShellA active="Archive" title="Archive"><MTAView /></ShellA>;
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTAApp />);
