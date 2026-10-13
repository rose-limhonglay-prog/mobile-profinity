/* ===========================================================================
   PROfinity — Minute Taker · Archive & Search with AI Copilot
   Searchable session history + natural-language cross-session AI Copilot.
   PRD Screen 6 (Sec. 3.6 / MT-K08, MT-K09).
   Classes prefixed mta- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMTA, useMemo: useMemoMTA } = React;

function goMTA(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

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

function MTASidebar() {
  return (
    <aside className="mta-sidebar">
      <div className="mta-logo"><iconify-icon icon="lucide:mic" class="mta-logo-icon"></iconify-icon><span>Minute Taker</span></div>
      {MT_NAV.map((item) => (
        <button
          key={item.label}
          className={"mta-navitem" + (item.label === "Archive" ? " is-active" : "")}
          type="button"
          onClick={item.label !== "Archive" ? () => goMTA(MT_NAV_LINKS[item.label]) : undefined}
        >
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

function MTAHeader() {
  return (
    <header className="mta-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="mta-header-title">Minute Taker</span>
      <div className="mta-spacer" />
      <div className="mta-user">
        <div className="mta-user-name">Dr. Katie Smith</div>
        <div className="mta-user-role">Clinician</div>
      </div>
      <img className="mta-user-avatar" src="assets/avatar-katy.jpg" alt="Dr. Katie Smith" />
    </header>
  );
}

/* same sessions as the mobile archive (minute-taker-archive-mobile.jsx); daysAgo keeps dates current */
function mtaIso(daysAgo) { const d = new Date(); d.setDate(d.getDate() - daysAgo); return d.toISOString().slice(0, 10); }
const MTA_SESSIONS = [
  { daysAgo: 0, patient: "Eleanor Vance", type: "Follow-up", detail: "Injectables follow-up", duration: "45 min", status: "Completed" },
  { daysAgo: 0, patient: "Marcus Thorne", type: "Initial Consult", detail: "New patient consult", duration: "30 min", status: "Pending" },
  { daysAgo: 1, patient: "Sarah Jenkins", type: "Review", detail: "Post-op review", duration: "55 min", status: "Completed" },
  { daysAgo: 1, patient: "David Cho", type: "Treatment", detail: "Acne protocol · S2", duration: "20 min", status: "Completed" },
  { daysAgo: 5, patient: "Priya Natarajan", type: "Initial Consult", detail: "Skin consult", duration: "35 min", status: "Completed" },
  { daysAgo: 13, patient: "Eleanor Vance", type: "Treatment", detail: "Injectables · session 1", duration: "40 min", status: "Completed" },
  { daysAgo: 22, patient: "Sarah Jenkins", type: "Review", detail: "Knee arthroscopy review", duration: "50 min", status: "Completed" },
  { daysAgo: 29, patient: "David Cho", type: "Treatment", detail: "Acne protocol · S1", duration: "25 min", status: "Completed" },
  { daysAgo: 41, patient: "Priya Natarajan", type: "Initial Consult", detail: "New patient consult", duration: "45 min", status: "Completed" },
  { daysAgo: 63, patient: "Amir Khan", type: "Review", detail: "Rosacea review", duration: "30 min", status: "Completed" },
].map((s) => ({ ...s, date: mtaIso(s.daysAgo) }));

const MTA_TYPES = ["All Types", "Initial Consult", "Follow-up", "Review", "Treatment"];
const MTA_RANGES = ["All Time", "Last 7 Days", "Last 30 Days"];

function mtaDaysAgo(s) { return s.daysAgo; }

const MTA_COPILOT_ANSWERS = [
  { match: /rosacea|amir/i, text: "Amir Khan's rosacea review (2 months ago) recorded fewer flares on the current regimen, with good tolerance and no new triggers. The plan was to continue unchanged and review again in 3 months." },
  { match: /acne|david/i, text: "David Cho has had 2 acne protocol sessions. Session 1 noted mild dryness that settled within a week; session 2 (yesterday) documented clear improvement against the progress photos, with the protocol continuing as planned." },
  { match: /inject|eleanor|bruis/i, text: "Eleanor Vance's injectable series: session 1 (2 weeks ago) noted minor bruising that resolved. Today's follow-up recorded good symmetry and high satisfaction, with no top-up required before the next review." },
  { match: /knee|post-op|sarah/i, text: "Sarah Jenkins' post-op reviews show steady progress since the knee arthroscopy: pain scores dropped from 5 to 2, mobility is improving, and there have been no signs of infection at either visit." },
  { match: /.*/, text: "Across the sessions in view, most visits were routine follow-ups with stable findings and no urgent flags. Ask about a patient, condition or treatment to narrow this down." },
];

function mtaAnswerFor(q) {
  const found = MTA_COPILOT_ANSWERS.find((a) => a.match.test(q));
  return found.text;
}

function MTAView() {
  const [search, setSearch] = useStateMTA("");
  const [range, setRange] = useStateMTA("All Time");
  const [type, setType] = useStateMTA("All Types");
  const [question, setQuestion] = useStateMTA("");
  const [generating, setGenerating] = useStateMTA(false);
  const [insight, setInsight] = useStateMTA(null);

  const filtered = useMemoMTA(() => {
    return MTA_SESSIONS.filter((s) => {
      const q = search.trim().toLowerCase();
      if (q && !s.patient.toLowerCase().includes(q) && !s.type.toLowerCase().includes(q) && !s.detail.toLowerCase().includes(q)) return false;
      if (type !== "All Types" && s.type !== type) return false;
      if (range === "Last 7 Days" && mtaDaysAgo(s) > 7) return false;
      if (range === "Last 30 Days" && mtaDaysAgo(s) > 30) return false;
      return true;
    });
  }, [search, range, type]);

  function generateInsight() {
    if (!question.trim()) return;
    setGenerating(true);
    setInsight(null);
    window.setTimeout(() => {
      setInsight(mtaAnswerFor(question));
      setGenerating(false);
    }, 1100);
  }

  return (
    <div className="mta-shell">
      <MTASidebar />
      <div className="mta-main">
        <MTAHeader />
        <div className="mta-view">
          <div className="mta-page-head">
            <div>
              <h1>Archive &amp; Search</h1>
              <p>Review and manage past clinical sessions and notes.</p>
            </div>
            <button className="mta-btn mta-btn-primary" type="button" onClick={() => goMTA("MinuteTakerPatientContext.html")}>
              <iconify-icon icon="lucide:plus"></iconify-icon>Start New Session
            </button>
          </div>

          <div className="mta-content-grid">
            <div className="mta-list-col">
              <div className="mta-filter-bar">
                <div className="mta-search-wrap">
                  <iconify-icon icon="lucide:search"></iconify-icon>
                  <input placeholder="Search patient/keyword…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select value={range} onChange={(e) => setRange(e.target.value)}>
                  {MTA_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {MTA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="mta-card">
                <div className="mta-row-grid mta-thead">
                  <span className="mta-th">Date</span>
                  <span className="mta-th">Patient</span>
                  <span className="mta-th">Type</span>
                  <span className="mta-th">Duration</span>
                  <span className="mta-th">Status</span>
                  <span className="mta-th">Action</span>
                </div>
                {filtered.map((s, i) => (
                  <div key={i} className="mta-row-grid mta-trow">
                    <span>{s.date}</span>
                    <span className="mta-patient-cell">{s.patient}</span>
                    <span title={s.detail}>{s.type}</span>
                    <span>{s.duration}</span>
                    <span className={"mta-status-pill " + (s.status === "Completed" ? "success" : "warning")}>{s.status}</span>
                    <button type="button" className="mta-view-link" onClick={() => goMTA("MinuteTakerNoteReview.html?patient=" + encodeURIComponent(s.patient))}>
                      View Note
                    </button>
                  </div>
                ))}
                {filtered.length === 0 && <div className="mta-empty">No sessions match your filters.</div>}
              </div>
            </div>

            <div className="mta-copilot-col">
              <div className="mta-card mta-copilot-card">
                <div className="mta-card-head">
                  <span className="mta-card-title-text"><iconify-icon icon="lucide:sparkles"></iconify-icon>AI Copilot</span>
                </div>
                <p className="mta-copilot-hint">Generate insights across selected sessions.</p>
                <textarea
                  rows={5}
                  placeholder="Ask the AI a question about these sessions: e.g. 'Summarise all treatment plans for patients with hypertension over the last 3 months.'"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                {generating && (
                  <div className="mta-copilot-loading"><span className="mta-copilot-spinner" />Analyzing sessions…</div>
                )}
                {insight && !generating && (
                  <div className="mta-copilot-answer">{insight}</div>
                )}
                <button className="mta-btn mta-btn-primary mta-copilot-btn" type="button" onClick={generateInsight} disabled={generating || !question.trim()}>
                  Generate Insight
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTAView />);
