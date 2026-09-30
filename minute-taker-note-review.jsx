/* ===========================================================================
   PROfinity — Minute Taker · Post-Session Clinical Note Review
   AI-generated structured note (SOAP/DAP/Summary), editable fields, raw
   transcript sidebar with search. PRD Screen 5 (Sec. 3.5 / MT-K06, MT-K07).
   Classes prefixed mtn- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMTN, useMemo: useMemoMTN } = React;

function goMTN(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function getParamMTN(name) {
  try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
}
function mtnLoadContext() {
  try { return JSON.parse(sessionStorage.getItem("mtSession") || "{}"); } catch (e) { return {}; }
}
function mtnFmtClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return m + "m " + s + "s";
}

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

function MTNSidebar() {
  return (
    <aside className="mtn-sidebar">
      <div className="mtn-logo"><iconify-icon icon="lucide:mic" class="mtn-logo-icon"></iconify-icon><span>Minute Taker</span></div>
      {MT_NAV.map((item) => (
        <button
          key={item.label}
          className={"mtn-navitem" + (item.label === "Dashboard" ? " is-active" : "")}
          type="button"
          onClick={item.label !== "Dashboard" ? () => goMTN(MT_NAV_LINKS[item.label]) : undefined}
        >
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

function MTNHeader() {
  return (
    <header className="mtn-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="mtn-header-title">Minute Taker</span>
      <div className="mtn-spacer" />
      <div className="mtn-user">
        <div className="mtn-user-name">Dr. Katie Smith</div>
        <div className="mtn-user-role">Clinician</div>
      </div>
      <img className="mtn-user-avatar" src="assets/avatar-katy.jpg" alt="Dr. Katie Smith" />
    </header>
  );
}

/* ---------------------------------------------------------------- data */
const MTN_NOTES = {
  "Sarah Jenkins": {
    ptId: "MT-84729", date: "Today", transcriptSource: "session",
    soap: {
      subjective: "Patient reports lower back pain has improved since last adjustment. New complaint of afternoon tension headaches, described as a dull ache across the forehead, no associated visual disturbances. Possible correlation with compensatory neck posture noted.",
      objective: "Alert, cooperative, in no acute distress. Discussion focused on symptom history; no new exam findings recorded this visit.",
      assessment: "1. Low back pain — improving, responding to current treatment plan.\n2. New tension-type headaches — likely related to postural compensation for back pain; no red-flag features reported.",
      plan: "- Continue current back pain treatment plan.\n- Monitor headache frequency; consider postural/ergonomic assessment if persistent.\n- Follow up in 3 weeks or sooner if visual disturbances or worsening symptoms occur.",
    },
    dap: {
      data: "Lower back pain improved since last adjustment. New afternoon tension headaches, dull frontal ache, no visual disturbances. Possible link to neck posture compensating for back pain.",
      assessment: "Improving low back pain; new likely tension-type headache without red-flag features.",
      plan: "Continue back pain plan; monitor headaches; postural review if persistent; follow up in 3 weeks.",
    },
    summary: "Sarah's lower back pain continues to improve. She's noticed new afternoon tension headaches, likely linked to neck posture while compensating for the back pain — no visual disturbances reported. Plan is to continue the current treatment and monitor the headaches, with follow-up in three weeks.",
  },
  "_default": {
    ptId: "PT-88321", date: "Oct 24, 2023", durationLabel: "14m 22s", transcriptSource: "generic",
    soap: {
      subjective: "Patient presents for routine follow-up regarding essential hypertension. Reports feeling generally well over past 3 months. Denies chest pain or shortness of breath. Mentions occasional morning headaches.",
      objective: "Vitals: BP 134/84 mmHg, HR 72 bpm, RR 16, Temp 98.4F. General: Alert, oriented x3. CV: Regular rate and rhythm. Lungs: Clear to auscultation. Extremities: No edema.",
      assessment: "1. Essential hypertension, primary: Currently stable and reasonably well-controlled.\n2. Occasional headaches: Likely tension-type or related to mild caffeine withdrawal.",
      plan: "- Continue Lisinopril 10mg PO daily. Adhere to low-sodium diet and regular aerobic exercise.\n- Return to clinic in 6 months for follow-up.",
    },
    dap: {
      data: "BP 134/84, HR 72, RR 16, Temp 98.4F. Feeling well, no chest pain or SOB. Occasional morning headaches.",
      assessment: "Hypertension stable and well-controlled. Headaches likely tension-type or caffeine-withdrawal related.",
      plan: "Continue Lisinopril 10mg daily, low-sodium diet, regular exercise. Return in 6 months.",
    },
    summary: "Routine hypertension follow-up. Patient feels well overall with occasional morning headaches, likely benign. Blood pressure stable on current regimen. Continue Lisinopril 10mg daily with lifestyle measures; recheck in 6 months.",
  },
};

const MTN_TRANSCRIPTS = {
  "Sarah Jenkins": [
    { who: "Clinician", t: "10:01", text: "Good morning, Sarah. I have the consent form marked as accepted. Before we begin, how have you been feeling since our last adjustment?" },
    { who: "Patient", t: "10:01", text: "Morning, Dr. Smith. Honestly, it's been a mixed bag. The lower back pain has definitely improved, but I've been getting these tension headaches in the afternoon." },
    { who: "Clinician", t: "10:02", text: "I see. Tension headaches can sometimes be related to neck posture, especially if you've been compensating for the back pain. Let's make a note of that. Are the headaches accompanied by visual disturbances?" },
    { who: "Patient", t: "10:03", text: "No, nothing like that. Just a dull ache right across my forehead." },
  ],
  "_default": [
    { who: "Clinician", t: "00:15", text: "Hi Robert, good to see you again. How have you been?" },
    { who: "Patient", t: "00:22", text: "I've been doing pretty well, Dr. Smith. Can't complain." },
    { who: "Clinician", t: "01:04", text: "Good to hear. Let's check your blood pressure and go through how the last few months have been." },
    { who: "Patient", t: "01:20", text: "Sure — I've had the odd morning headache, but nothing serious." },
    { who: "Clinician", t: "02:10", text: "Noted. We'll keep an eye on that. Any chest pain, shortness of breath, or swelling in your legs?" },
    { who: "Patient", t: "02:18", text: "No, none of that." },
  ],
};

const MTN_TABS = [
  { key: "soap", label: "SOAP" },
  { key: "dap", label: "DAP" },
  { key: "summary", label: "Summary" },
];

function MTNField({ label, value, onChange, edited }) {
  return (
    <div className="mtn-field">
      <div className="mtn-field-label">{label}{edited && <span className="mtn-edited-badge">Edited</span>}</div>
      <textarea value={value} onChange={onChange} rows={label === "PLAN" || label === "OBJECTIVE" ? 4 : 3} />
    </div>
  );
}

function MTNView() {
  const patientName = getParamMTN("patient") || mtnLoadContext().patient || "_default";
  const isGenerated = getParamMTN("generated") === "1";
  const record = MTN_NOTES[patientName] || MTN_NOTES["_default"];
  const transcript = MTN_TRANSCRIPTS[patientName] || MTN_TRANSCRIPTS["_default"];
  const ptId = getParamMTN("id") || record.ptId;
  const ctx = mtnLoadContext();
  const dateLabel = record.date === "Today" ? "Today" : record.date;
  const durationLabel = record.transcriptSource === "session" && ctx.durationSeconds
    ? mtnFmtClock(ctx.durationSeconds)
    : (record.durationLabel || "12m 40s");

  const [format, setFormat] = useStateMTN("soap");
  const [soap, setSoap] = useStateMTN(record.soap);
  const [dap, setDap] = useStateMTN(record.dap);
  const [summary, setSummary] = useStateMTN(record.summary);
  const [search, setSearch] = useStateMTN("");
  const [toast, setToast] = useStateMTN(null);

  const filteredTranscript = useMemoMTN(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transcript;
    return transcript.filter((l) => l.text.toLowerCase().includes(q) || l.who.toLowerCase().includes(q));
  }, [search, transcript]);

  function flashToast(msg) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  function saveToEMR() {
    flashToast("Note finalized and marked clinician-confirmed. Ready for EMR sync.");
    window.setTimeout(() => goMTN("MinuteTakerDashboard.html"), 1400);
  }

  function discard() {
    if (window.confirm("Discard this AI-generated note? This cannot be undone.")) {
      goMTN("MinuteTakerDashboard.html");
    }
  }

  const soapEdited = JSON.stringify(soap) !== JSON.stringify(record.soap);

  return (
    <div className="mtn-shell">
      <MTNSidebar />
      <div className="mtn-main">
        <MTNHeader />
        <div className="mtn-view">
          <div className="mtn-page-head">
            <div>
              <div className="mtn-title-row">
                <h1>Clinical Note Review</h1>
                <span className="mtn-ai-badge"><iconify-icon icon="lucide:sparkles"></iconify-icon>AI Generated</span>
              </div>
              <p>{patientName === "_default" ? "Robert Fox" : patientName} · {ptId} · {dateLabel} ({durationLabel}){isGenerated && " · just generated"}</p>
            </div>
            <div className="mtn-page-head-actions">
              <button className="mtn-btn mtn-btn-ghost" type="button" onClick={discard}>Discard</button>
              <button className="mtn-btn mtn-btn-primary" type="button" onClick={saveToEMR}>Save to EMR</button>
            </div>
          </div>

          <div className="mtn-content-grid">
            <div className="mtn-notes-col">
              <div className="mtn-tabs">
                {MTN_TABS.map((t) => (
                  <button key={t.key} type="button" className={"mtn-tab" + (format === t.key ? " is-active" : "")} onClick={() => setFormat(t.key)}>
                    {t.label}
                  </button>
                ))}
              </div>

              {format === "soap" && (
                <div className="mtn-card">
                  <MTNField label="SUBJECTIVE" value={soap.subjective} onChange={(e) => setSoap({ ...soap, subjective: e.target.value })} />
                  <MTNField label="OBJECTIVE" value={soap.objective} onChange={(e) => setSoap({ ...soap, objective: e.target.value })} />
                  <MTNField label="ASSESSMENT" value={soap.assessment} onChange={(e) => setSoap({ ...soap, assessment: e.target.value })} />
                  <MTNField label="PLAN" value={soap.plan} onChange={(e) => setSoap({ ...soap, plan: e.target.value })} />
                  {soapEdited && <div className="mtn-original-link" onClick={() => setSoap(record.soap)}>↺ Reset to original AI draft</div>}
                </div>
              )}

              {format === "dap" && (
                <div className="mtn-card">
                  <MTNField label="DATA" value={dap.data} onChange={(e) => setDap({ ...dap, data: e.target.value })} />
                  <MTNField label="ASSESSMENT" value={dap.assessment} onChange={(e) => setDap({ ...dap, assessment: e.target.value })} />
                  <MTNField label="PLAN" value={dap.plan} onChange={(e) => setDap({ ...dap, plan: e.target.value })} />
                </div>
              )}

              {format === "summary" && (
                <div className="mtn-card">
                  <MTNField label="SUMMARY" value={summary} onChange={(e) => setSummary(e.target.value)} />
                </div>
              )}
            </div>

            <div className="mtn-transcript-col">
              <div className="mtn-card mtn-transcript-card">
                <div className="mtn-card-head"><span className="mtn-card-title-text">Raw Transcript</span></div>
                <div className="mtn-transcript-search">
                  <iconify-icon icon="lucide:search"></iconify-icon>
                  <input placeholder="Search transcript…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="mtn-transcript-list">
                  {filteredTranscript.map((l, i) => (
                    <div key={i} className={"mtn-transcript-line " + (l.who === "Clinician" ? "clin" : "pat")}>
                      <div className="mtn-transcript-line-head">{l.who} {l.t}</div>
                      <div className="mtn-transcript-line-text">{l.text}</div>
                    </div>
                  ))}
                  {filteredTranscript.length === 0 && <div className="mtn-transcript-empty">No matches found.</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="mtn-toast">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTNView />);
