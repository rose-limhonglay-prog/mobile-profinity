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

const MTA_SESSIONS = [
  { date: "2024-07-20", patient: "Elara Vance", type: "Initial Consult", duration: "45 min", status: "Completed" },
  { date: "2024-07-19", patient: "Marcus Thorne", type: "Follow-up", duration: "30 min", status: "Completed" },
  { date: "2024-07-19", patient: "Sophia Chen", type: "Therapy", duration: "60 min", status: "Completed" },
  { date: "2024-07-18", patient: "Liam O'Connell", type: "Med Review", duration: "20 min", status: "Completed" },
  { date: "2024-07-18", patient: "Olivia Hayes", type: "Initial Consult", duration: "60 min", status: "Pending" },
];

const MTA_TYPES = ["All Types", "Initial Consult", "Follow-up", "Therapy", "Med Review"];
const MTA_RANGES = ["All Time", "Last 7 Days", "Last 30 Days"];

function mtaDaysAgo(dateStr) {
  const ref = new Date("2024-07-21T00:00:00");
  const d = new Date(dateStr + "T00:00:00");
  return Math.round((ref - d) / 86400000);
}

const MTA_COPILOT_ANSWERS = [
  { match: /hypertension/i, text: "Across the last 3 months, 4 sessions referenced hypertension management. All patients remained on their existing antihypertensive regimen with no dosage escalations. Blood pressure was documented as stable or improving in every case, and follow-up intervals ranged from 3 to 6 months." },
  { match: /headache/i, text: "2 recent sessions (Sarah Jenkins, Robert Fox) noted headaches as a secondary complaint. Both were characterized as tension-type without red-flag features, and neither required escalation beyond monitoring." },
  { match: /.*/, text: "Based on the selected sessions, most visits were routine follow-ups with stable findings. No urgent flags were identified across this set — let me know if you'd like this narrowed to a specific patient, condition, or date range." },
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
      if (q && !s.patient.toLowerCase().includes(q) && !s.type.toLowerCase().includes(q)) return false;
      if (type !== "All Types" && s.type !== type) return false;
      if (range === "Last 7 Days" && mtaDaysAgo(s.date) > 7) return false;
      if (range === "Last 30 Days" && mtaDaysAgo(s.date) > 30) return false;
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
                    <span>{s.type}</span>
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
