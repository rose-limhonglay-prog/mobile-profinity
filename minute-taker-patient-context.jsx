/* ===========================================================================
   PROfinity — Minute Taker · Patient Context & Profile
   Pre-session priming: demographics, clinical snapshot alerts, editable AI
   session primer. PRD Screen 2 (Sec. 3.2 / MT-K02).
   Classes prefixed mtp- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMTP } = React;

function goMTP(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function getParamMTP(name) {
  try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
}

const MTP_PATIENTS = {
  "Sarah Jenkins": { id: "MT-84729", gender: "Female", age: 38, dob: "1985-04-12", phone: "(555) 123-4567", email: "s.jenkins@example.com",
    allergies: [{ label: "Penicillin (Severe)", severe: true }, { label: "Latex (Mild)", severe: false }],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    primer: "Patient is following up on a recent knee arthroscopy (3 weeks post-op). Focus on pain levels, mobility improvements, and any signs of infection. Note any adjustments to physical therapy routine." },
  "Eleanor Vance": { id: "MT-77213", gender: "Female", age: 61, dob: "1965-03-02", phone: "(555) 234-8890", email: "e.vance@example.com",
    allergies: [{ label: "NKDA", severe: false }],
    conditions: ["Osteoarthritis", "Hypothyroidism"],
    primer: "Follow-up on cosmetic injectable series. Assess symmetry, bruising, and overall patient satisfaction versus prior session." },
  "Marcus Thorne": { id: "MT-77198", gender: "Male", age: 45, dob: "1980-11-19", phone: "(555) 345-1122", email: "m.thorne@example.com",
    allergies: [{ label: "Sulfa drugs (Moderate)", severe: true }],
    conditions: ["None on file"],
    primer: "New patient consultation for laser resurfacing. Discuss downtime expectations and post-procedure care." },
  "David Cho": { id: "MT-77042", gender: "Male", age: 29, dob: "1996-06-30", phone: "(555) 456-7788", email: "d.cho@example.com",
    allergies: [{ label: "NKDA", severe: false }],
    conditions: ["Mild acne (ongoing)"],
    primer: "Second session of acne treatment protocol. Check for irritation and compare against progress photos." },
};

const MTP_PATIENT_NAMES = Object.keys(MTP_PATIENTS);
const MTP_NEW_KEY = "__new__";
const MTP_BLANK_PATIENT = { id: null, gender: "-", age: "-", dob: "", phone: "", email: "", allergies: [], conditions: [], primer: "" };

function mtpSaveContext(data) {
  try { sessionStorage.setItem("mtSession", JSON.stringify(data)); } catch (e) {}
}
function mtpLoadContext() {
  try { return JSON.parse(sessionStorage.getItem("mtSession") || "{}"); } catch (e) { return {}; }
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

function MTPSidebar() {
  return (
    <aside className="mtp-sidebar">
      <div className="mtp-logo"><iconify-icon icon="lucide:mic" class="mtp-logo-icon"></iconify-icon><span>Minute Taker</span></div>
      {MT_NAV.map((item) => (
        <button
          key={item.label}
          className={"mtp-navitem" + (item.label === "Patients" ? " is-active" : "")}
          type="button"
          onClick={item.label !== "Patients" ? () => goMTP(MT_NAV_LINKS[item.label]) : undefined}
        >
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

function MTPHeader() {
  return (
    <header className="mtp-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="mtp-header-title">Minute Taker</span>
      <div className="mtp-spacer" />
      <div className="mtp-user">
        <div className="mtp-user-name">Dr. Katie Smith</div>
        <div className="mtp-user-role">Clinician</div>
      </div>
      <img className="mtp-user-avatar" src="assets/avatar-katy.jpg" alt="Dr. Katie Smith" />
    </header>
  );
}

/* ---------------------------------------------------------------- toast */
function MTPToast({ text }) {
  if (!text) return null;
  return <div className="mtp-toast">{text}</div>;
}

/* ----------------------------------------------------------------- view */
function mtpSplitName(name) {
  return name.split(" ").length > 1
    ? [name.split(" ")[0], name.split(" ").slice(1).join(" ")]
    : [name, ""];
}

function MTPView() {
  const initialPatient = getParamMTP("patient") || "Sarah Jenkins";
  const [selectedPatient, setSelectedPatient] = useStateMTP(initialPatient);
  const isNewPatient = selectedPatient === MTP_NEW_KEY;
  const base = isNewPatient ? MTP_BLANK_PATIENT : (MTP_PATIENTS[selectedPatient] || MTP_PATIENTS["Sarah Jenkins"]);

  const [firstName, lastName] = mtpSplitName(isNewPatient ? "" : selectedPatient);

  const [form, setForm] = useStateMTP({ firstName, lastName, dob: base.dob, phone: base.phone, email: base.email });
  const [primer, setPrimer] = useStateMTP(base.primer);
  const [useContext, setUseContext] = useStateMTP(true);
  const [consentGiven, setConsentGiven] = useStateMTP(false);
  const [toast, setToast] = useStateMTP(null);

  const patientName = isNewPatient
    ? (form.firstName.trim() || form.lastName.trim() ? (form.firstName + " " + form.lastName).trim() : "New Patient")
    : selectedPatient;

  function handlePatientPick(value) {
    setSelectedPatient(value);
    const next = value === MTP_NEW_KEY ? MTP_BLANK_PATIENT : (MTP_PATIENTS[value] || MTP_BLANK_PATIENT);
    const [fn, ln] = mtpSplitName(value === MTP_NEW_KEY ? "" : value);
    setForm({ firstName: fn, lastName: ln, dob: next.dob, phone: next.phone, email: next.email });
    setPrimer(next.primer);
    setConsentGiven(false);
  }

  function flashToast(msg) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  function saveDraft() {
    mtpSaveContext({ patient: patientName, id: base.id, primer, useContext, isNewPatient });
    flashToast("Draft saved.");
  }

  function startSession() {
    if (!consentGiven) {
      flashToast("Please confirm patient consent before starting the session.");
      return;
    }
    mtpSaveContext({ patient: patientName, id: base.id, primer, useContext, isNewPatient, consentGiven: true });
    goMTP("MinuteTakerSession.html?patient=" + encodeURIComponent(patientName));
  }

  return (
    <div className="mtp-view">
      <button type="button" className="mtp-back" onClick={() => goMTP("MinuteTakerDashboard.html")}>
        <iconify-icon icon="lucide:arrow-left"></iconify-icon>Back
      </button>

      <div className="mtp-page-head">
        <div>
          <span className="mtp-patient-idtag">{isNewPatient ? "New Patient" : "ID: " + base.id}</span>
          <h1>Start Session</h1>
        </div>
        <div className="mtp-page-head-actions">
          <button className="mtp-btn mtp-btn-ghost" type="button" onClick={saveDraft}>Save Draft</button>
          <button className="mtp-btn mtp-btn-primary" type="button" disabled={!consentGiven} onClick={startSession}>
            Start Session<iconify-icon icon="lucide:arrow-right"></iconify-icon>
          </button>
        </div>
      </div>

      <div className="mtp-grid">
        <div className="mtp-card">
          <div className="mtp-section-label">Select Patient</div>
          <label className="mtp-field">
            <span>Patient</span>
            <select className="mtp-select" value={selectedPatient} onChange={(e) => handlePatientPick(e.target.value)}>
              {MTP_PATIENT_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
              <option value={MTP_NEW_KEY}>+ New Patient</option>
            </select>
          </label>

          <div className="mtp-patient-header">
            <div className="mtp-patient-avatar"><iconify-icon icon={isNewPatient ? "lucide:user-plus" : "lucide:user"}></iconify-icon></div>
            <div>
              <div className="mtp-patient-name">{patientName || "New Patient"}</div>
              <div className="mtp-patient-meta">{isNewPatient ? "No prior visits on file" : base.gender + ", " + base.age + " yrs"}</div>
            </div>
          </div>
          <div className="mtp-section-label">Demographics</div>
          <label className="mtp-field">
            <span>First Name</span>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </label>
          <label className="mtp-field">
            <span>Last Name</span>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </label>
          <label className="mtp-field">
            <span>Date of Birth</span>
            <input value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
          </label>
          <label className="mtp-field">
            <span>Phone</span>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="mtp-field">
            <span>Email</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
        </div>

        <div className="mtp-side-col">
          <div className="mtp-card">
            <div className="mtp-card-head">
              <span className="mtp-card-title-text">Clinical Snapshot</span>
              <button className="mtp-btn mtp-btn-ghost mtp-btn-sm" type="button" onClick={() => flashToast("EHR sync requested.")}>
                <iconify-icon icon="lucide:refresh-cw"></iconify-icon>Sync EHR
              </button>
            </div>
            <div className="mtp-snapshot-cols">
              <div>
                <div className="mtp-snapshot-label">Alerts &amp; Allergies</div>
                <div className="mtp-pill-row">
                  {base.allergies.length === 0 && <span className="mtp-pill mtp-pill-neutral">No records on file</span>}
                  {base.allergies.map((a) => (
                    <span key={a.label} className={"mtp-pill" + (a.severe ? " mtp-pill-danger" : " mtp-pill-neutral")}>{a.label}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mtp-snapshot-label">Active Conditions</div>
                <div className="mtp-pill-row">
                  {base.conditions.length === 0 && <span className="mtp-pill mtp-pill-neutral">No records on file</span>}
                  {base.conditions.map((c) => <span key={c} className="mtp-pill mtp-pill-success">{c}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="mtp-card">
            <div className="mtp-card-head">
              <span className="mtp-card-title-text">AI Session Primer</span>
            </div>
            <p className="mtp-primer-hint">Provide specific instructions or context for the AI before recording starts.</p>
            <textarea className="mtp-primer-box" rows={5} value={primer}
              placeholder={isNewPatient ? "Add any context for the AI ahead of this first visit…" : ""}
              onChange={(e) => setPrimer(e.target.value)} />
            <label className="mtp-checkbox">
              <input type="checkbox" checked={useContext} onChange={(e) => setUseContext(e.target.checked)} />
              <span>Use this context for the upcoming session</span>
            </label>
          </div>

          <div className="mtp-card mtp-consent-card">
            <div className="mtp-card-head">
              <span className="mtp-card-title-text">Recording Consent</span>
            </div>
            <p className="mtp-primer-hint">Minute Taker will listen in and transcribe this consultation to generate the clinical note. Confirm the patient has been informed and consents before starting.</p>
            <label className="mtp-checkbox mtp-consent-checkbox">
              <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} />
              <span>Patient has been informed and consents to this session being recorded and transcribed</span>
            </label>
          </div>
        </div>
      </div>

      <MTPToast text={toast} />
    </div>
  );
}

function MTPApp() {
  return (
    <div className="mtp-shell">
      <MTPSidebar />
      <div className="mtp-main">
        <MTPHeader />
        <MTPView />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTPApp />);
