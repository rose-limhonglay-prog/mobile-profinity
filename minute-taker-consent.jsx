/* ===========================================================================
   PROfinity — Minute Taker · Patient Consent Form
   Focused, chrome-free screen presented before ambient recording begins.
   PRD Screen 3 (Sec. 3.3 / MT-J01, MT-J02).
   Classes prefixed mtc- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMTC } = React;

function goMTC(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function getParamMTC(name) {
  try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
}
function mtcLoadContext() {
  try { return JSON.parse(sessionStorage.getItem("mtSession") || "{}"); } catch (e) { return {}; }
}
function mtcSaveContext(data) {
  try { sessionStorage.setItem("mtSession", JSON.stringify(data)); } catch (e) {}
}
function mtcMakeConsentId() {
  return "C-" + Math.floor(10000 + Math.random() * 90000);
}

const MTC_SECTIONS = [
  { icon: "lucide:file-text", title: "Purpose of Recording",
    body: "This session may be recorded to automatically generate accurate clinical notes. This allows your clinician to focus entirely on you and your care, rather than taking manual notes." },
  { icon: "lucide:lock", title: "Privacy & Security",
    body: "All audio recordings are strictly confidential, heavily encrypted, and processed in compliance with healthcare data regulations. Recordings are deleted after note generation." },
  { icon: "lucide:hand", title: "Your Right to Choose",
    body: "Recording is entirely optional. Choosing not to be recorded is your right and will absolutely not affect the quality of care or the consultation you receive today." },
];

function MTCView() {
  const patient = getParamMTC("patient") || mtcLoadContext().patient || "Sarah Jenkins";
  const [stage, setStage] = useStateMTC("form"); // form | verifying | accepted | optedOut

  function handleOptOut() {
    setStage("optedOut");
    const ctx = mtcLoadContext();
    mtcSaveContext({ ...ctx, patient, consentId: null, optedOut: true });
    window.setTimeout(() => goMTC("MinuteTakerDashboard.html"), 1700);
  }

  function handleAccept() {
    setStage("verifying");
    window.setTimeout(() => {
      const consentId = mtcMakeConsentId();
      const ctx = mtcLoadContext();
      mtcSaveContext({ ...ctx, patient, consentId, optedOut: false });
      setStage("accepted");
      window.setTimeout(() => goMTC("MinuteTakerSession.html?patient=" + encodeURIComponent(patient) + "&consent=" + consentId), 550);
    }, 700);
  }

  return (
    <div className="mtc-screen">
      <div className="mtc-card">
        <span className="mtc-secure-badge"><iconify-icon icon="lucide:shield-check"></iconify-icon>SECURE</span>
        <h1>Patient Consent Form</h1>
        <p className="mtc-sub">Please review the following information regarding the use of Minute Taker during {patient}'s clinical session today.</p>

        {stage === "form" && (
          <>
            <div className="mtc-sections">
              {MTC_SECTIONS.map((s) => (
                <div className="mtc-section" key={s.title}>
                  <div className="mtc-section-icon"><iconify-icon icon={s.icon}></iconify-icon></div>
                  <div>
                    <div className="mtc-section-title">{s.title}</div>
                    <div className="mtc-section-body">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mtc-actions">
              <button className="mtc-btn mtc-btn-ghost" type="button" onClick={handleOptOut}>Opt-Out of Recording</button>
              <button className="mtc-btn mtc-btn-primary" type="button" onClick={handleAccept}>
                Accept &amp; Continue<iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </button>
            </div>
          </>
        )}

        {stage === "verifying" && (
          <div className="mtc-status">
            <div className="mtc-spinner" />
            <p>Verifying consent…</p>
          </div>
        )}

        {stage === "accepted" && (
          <div className="mtc-status mtc-status-success">
            <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
            <p>Consent verified. Opening session…</p>
          </div>
        )}

        {stage === "optedOut" && (
          <div className="mtc-status">
            <iconify-icon icon="lucide:mic-off"></iconify-icon>
            <p>Recording disabled. Continuing the consultation without ambient capture.</p>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTCView />);
