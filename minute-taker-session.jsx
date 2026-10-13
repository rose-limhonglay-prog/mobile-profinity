/* ===========================================================================
   PROfinity — Minute Taker · Active Session
   Live diarized recording interface: consent banner, running timer, streaming
   transcript, pause/resume, end-session → note generation.
   PRD Screen 4 (Sec. 3.4 / MT-K03, MT-K04, MT-K05).
   Classes prefixed mts- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateMTS, useEffect: useEffectMTS, useRef: useRefMTS } = React;

function goMTS(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function getParamMTS(name) {
  try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
}
function mtsLoadContext() {
  try { return JSON.parse(sessionStorage.getItem("mtSession") || "{}"); } catch (e) { return {}; }
}
function mtsSaveContext(data) {
  try { sessionStorage.setItem("mtSession", JSON.stringify(data)); } catch (e) {}
}

const MTS_PATIENT_META = {
  "Sarah Jenkins": { id: "MT-84729", dob: "12/05/1988" },
  "Eleanor Vance": { id: "MT-77213", dob: "03/02/1965" },
  "Marcus Thorne": { id: "MT-77198", dob: "11/19/1980" },
  "David Cho": { id: "MT-77042", dob: "06/30/1996" },
};
const MTS_META_FALLBACK = { id: "New Patient", dob: "\u2014" };

const MTS_SCRIPT = [
  { who: "clinician", t: "10:01 AM", text: "Good morning, Sarah. I have the consent form marked as accepted. Before we begin, how have you been feeling since our last adjustment?" },
  { who: "patient", t: "10:01 AM", text: "Morning, Dr. Smith. Honestly, it's been a mixed bag. The lower back pain has definitely improved, but I've been getting these tension headaches in the afternoon." },
  { who: "clinician", t: "10:02 AM", edited: true, text: "I see. Tension headaches can sometimes be related to neck posture, especially if you've been compensating for the back pain. Let's make a note of that. Are the headaches accompanied by visual disturbances?" },
  { who: "patient", t: "10:03 AM", text: "No, nothing like that. Just a dull ache right across my forehead." },
];

function fmtClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return m + ":" + s;
}

function MTSView() {
  const ctx = mtsLoadContext();
  const patient = getParamMTS("patient") || ctx.patient || "Sarah Jenkins";
  const consentGiven = getParamMTS("consent") ? true : (ctx.consentGiven !== undefined ? ctx.consentGiven : true);
  const meta = MTS_PATIENT_META[patient] || (ctx.isNewPatient ? MTS_META_FALLBACK : MTS_PATIENT_META["Sarah Jenkins"]);

  const [started, setStarted] = useStateMTS(getParamMTS("autostart") === "1"); /* ?autostart=1 for demos / screenshots */
  const [seconds, setSeconds] = useStateMTS(0);
  const [paused, setPaused] = useStateMTS(false);
  const [lineCount, setLineCount] = useStateMTS(0);
  const [ending, setEnding] = useStateMTS(false);
  const [confirmEnd, setConfirmEnd] = useStateMTS(getParamMTS("confirm") === "1");
  const scrollRef = useRefMTS(null);

  useEffectMTS(() => {
    if (!started || paused || ending) return undefined;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [started, paused, ending]);

  useEffectMTS(() => {
    if (!started || paused || ending || lineCount >= MTS_SCRIPT.length) return undefined;
    const id = window.setTimeout(() => setLineCount((c) => c + 1), lineCount === 0 ? 1200 : 3400);
    return () => window.clearTimeout(id);
  }, [started, paused, ending, lineCount]);

  useEffectMTS(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lineCount]);

  function endSession() {
    setConfirmEnd(false);
    setEnding(true);
    window.setTimeout(() => {
      const savedCtx = mtsLoadContext();
      mtsSaveContext({ ...savedCtx, patient, consentGiven, durationSeconds: seconds, transcriptLines: lineCount });
      goMTS("MinuteTakerNoteReview.html?patient=" + encodeURIComponent(patient) + "&id=" + meta.id + "&generated=1");
    }, 1100);
  }

  function cancelSession() {
    goMTS("MinuteTakerDashboard.html");
  }

  return (
    <div className="mts-screen">
      <div className="mts-consent-banner">
        <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
        {consentGiven ? "Patient Consent Confirmed" : "Consent not on record — verify before recording"}
      </div>

      <div className="mts-body">
        <div className="mts-topline">
          <div>
            <h1>{started ? "Active Session" : "Ready to Start"}</h1>
            <p>Patient: {patient} &nbsp;·&nbsp; {meta.id === "New Patient" ? "New Patient" : "ID: " + meta.id} &nbsp;·&nbsp; DOB: {meta.dob}</p>
          </div>
          {started && (
            <div className={"mts-rec-badge" + (paused ? " is-paused" : "")}>
              <span className="mts-rec-dot" />
              {paused ? "PAUSED" : "REC"} {fmtClock(seconds)}
            </div>
          )}
        </div>

        {!started ? (
          <div className="mts-ready-panel">
            <div className="mts-ready-icon"><iconify-icon icon="lucide:mic"></iconify-icon></div>
            <h2>Start recording when you're ready</h2>
            <p>Minute Taker will listen in, separate clinician from patient speech, and stream a live transcript below as you talk.</p>
            <button className="mts-btn mts-btn-primary mts-btn-start" type="button" onClick={() => setStarted(true)}>
              <iconify-icon icon="lucide:circle"></iconify-icon>Start Recording Session
            </button>
          </div>
        ) : (
          <>
          <div className="mts-live-strip">
            <div className={"mts-orb" + (paused ? " is-paused" : "")} role="img" aria-label={paused ? "Paused" : "Listening"}>
              <span className="mts-orb-halo" aria-hidden="true" />
              <span className="mts-orb-body" aria-hidden="true"><i className="c1" /><i className="c2" /><i className="c3" /></span>
            </div>
            <div className="mts-live-caption">
              {paused ? <><iconify-icon icon="lucide:pause"></iconify-icon>Paused · audio isn't being captured</> : <><span className="mts-live-dot" />Listening · diarising clinician and patient</>}
            </div>
          </div>
          <div className="mts-transcript" ref={scrollRef}>
            <div className="mts-transcript-meta">10:00 AM · Session started. Consent verified.</div>
            {MTS_SCRIPT.slice(0, lineCount).map((line, i) => (
              <div key={i} className={"mts-bubble-row " + line.who}>
                <div className={"mts-bubble " + line.who}>
                  <div className="mts-bubble-head">
                    {line.who === "clinician" ? "Clinician" : "Patient"} ({line.t}){line.edited && <span className="mts-edited-tag">[EDITED]</span>}
                  </div>
                  <div className="mts-bubble-text">{line.text}</div>
                </div>
              </div>
            ))}
            {!paused && !ending && lineCount < MTS_SCRIPT.length && (
              <div className="mts-transcript-meta mts-listening">Transcribing…</div>
            )}
          </div>
          </>
        )}

        <div className="mts-footer">
          <span className="mts-model-tag"><iconify-icon icon="lucide:cpu"></iconify-icon>Transcribing with Medical Model v2.4</span>
          <div className="mts-spacer" />
          {started && (
            <button className="mts-btn mts-btn-ghost" type="button" onClick={() => setPaused((p) => !p)} disabled={ending}>
              <iconify-icon icon={paused ? "lucide:play" : "lucide:pause"}></iconify-icon>{paused ? "Resume" : "Pause"}
            </button>
          )}
          {started && (
            <button className="mts-btn mts-btn-danger" type="button" onClick={() => setConfirmEnd(true)} disabled={ending}>
              <iconify-icon icon="lucide:square"></iconify-icon>End Session
            </button>
          )}
          <button className="mts-cancel-link" type="button" onClick={cancelSession} disabled={ending}>Cancel Session</button>
        </div>
      </div>

      {ending && (
        <div className="mts-overlay">
          <div className="mts-spinner" />
          <p>Generating your structured note…</p>
        </div>
      )}
      {started && confirmEnd && !ending && (
        <div className="mts-confirm-scrim" onClick={() => setConfirmEnd(false)}>
          <div className="mts-confirm" role="alertdialog" aria-modal="true" aria-labelledby="mts-confirm-title" onClick={(e) => e.stopPropagation()}>
            <span className="mts-confirm-ic"><iconify-icon icon="lucide:circle-stop"></iconify-icon></span>
            <h3 id="mts-confirm-title">End the Minute Taker session?</h3>
            <p>Minute Taker will stop listening and write up the note from the {fmtClock(seconds)} recorded so far. You can review and edit it before anything is saved.</p>
            <div className="mts-confirm-actions">
              <button className="mts-btn mts-btn-ghost" type="button" onClick={() => setConfirmEnd(false)}>Keep recording</button>
              <button className="mts-btn mts-btn-danger" type="button" onClick={endSession}><iconify-icon icon="lucide:check"></iconify-icon>End and write note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTSView />);
