/* ===========================================================================
   PROfinity — Minute Taker (web) · Live Session
   Web twin of MinuteTakerSessionMobile (minute-taker-session-mobile.jsx):
   a ready screen with a big pulsing mic (recording only starts on click),
   then the voice-mode stage: drifting cloud orb, rec timer, live transcript
   beside it, Pause and End session. End session → note-writing steps overlay
   → Note Review. Chrome-free (no sidebar) like the mobile page.
   Runs on window.PFMTW. Classes prefixed mts-.
   ?autostart=1 skips the ready screen, ?end=1 jumps to the writing overlay,
   ?paused=1 / ?confirm=1 for screenshots.
   =========================================================================== */
const { useState: useStateMTS, useEffect: useEffectMTS, useRef: useRefMTS } = React;
const MTE = window.PFMTW;
const { Avatar: AvatarE, Shell: ShellE } = MTE;

const MTS_SCRIPT = [
  { who: "clinician", text: "Good morning. Before we begin, how have you been feeling since our last adjustment?" },
  { who: "patient", text: "Morning, Dr Smith. The lower back pain has improved, but I've been getting tension headaches in the afternoon." },
  { who: "clinician", text: "Tension headaches can relate to neck posture, especially when compensating for back pain. Any visual disturbances?" },
  { who: "patient", text: "No, nothing like that. Just a dull ache across my forehead." },
  { who: "clinician", text: "Okay. Let's keep the current plan for your back and I'll add a posture check. If the headaches persist, we'll look at an ergonomic assessment." },
];
const MTS_STEPS = ["Saving the recording", "Finalising transcript", "Structuring the note", "Checking clinical terms"];

function mtsTime(startedAt, offsetSec) {
  try { return new Date(startedAt + offsetSec * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; }
}

function MTSOrb({ paused, mini, badge }) {
  return (
    <div className={"mts-orb" + (paused ? " is-paused" : "") + (mini ? " mts-orb-mini" : "")} role="img" aria-label={paused ? "Paused" : "Listening"}>
      <span className="mts-orb-halo" aria-hidden="true" />
      <span className="mts-orb-body" aria-hidden="true"><i className="c1" /><i className="c2" /><i className="c3" /></span>
      {badge && <span className="mts-orb-badge"><iconify-icon icon="lucide:sparkles"></iconify-icon></span>}
    </div>
  );
}

function MTSView() {
  const ctx = MTE.loadCtx();
  const patient = MTE.getParam("patient") || ctx.patient || "Sarah Jenkins";
  const p = MTE.PATIENTS[patient];
  const id = p ? p.id : (ctx.id || "New patient");
  const consent = MTE.getParam("consent") ? true : (ctx.consentGiven !== undefined ? ctx.consentGiven : true);
  const primer = ctx.useContext === false ? "" : (ctx.primer || (p && p.primer) || "");
  const first = patient.split(" ")[0];

  const auto = MTE.getParam("autostart") === "1" || MTE.getParam("end") === "1";
  const [started, setStarted] = useStateMTS(auto);
  const [startedAt, setStartedAt] = useStateMTS(auto ? Date.now() : null);
  const [seconds, setSeconds] = useStateMTS(auto ? 7 : 0);
  const [paused, setPaused] = useStateMTS(MTE.getParam("paused") === "1");
  const [lineCount, setLineCount] = useStateMTS(auto ? 2 : 0);
  const [ending, setEnding] = useStateMTS(MTE.getParam("end") === "1");
  const [step, setStep] = useStateMTS(0);
  const [confirmEnd, setConfirmEnd] = useStateMTS(MTE.getParam("confirm") === "1");
  const scrollRef = useRefMTS(null);

  useEffectMTS(() => {
    if (!started || paused || ending) return undefined;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [started, paused, ending]);

  useEffectMTS(() => {
    if (!started || paused || ending || lineCount >= MTS_SCRIPT.length) return undefined;
    const t = window.setTimeout(() => setLineCount((c) => c + 1), lineCount === 0 ? 1400 : 3200);
    return () => window.clearTimeout(t);
  }, [started, paused, ending, lineCount]);

  useEffectMTS(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [lineCount, paused]);

  useEffectMTS(() => {
    if (!ending) return undefined;
    if (step >= MTS_STEPS.length) {
      const t = window.setTimeout(() => {
        MTE.mergeCtx({ patient, id, consentGiven: consent, durationSeconds: seconds, transcriptLines: lineCount, endedAt: Date.now(), recordingKept: true });
        MTE.go(MTE.routes.review + "?patient=" + encodeURIComponent(patient) + "&id=" + encodeURIComponent(id) + "&generated=1");
      }, 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 750);
    return () => window.clearTimeout(t);
  }, [ending, step]);

  useEffectMTS(() => {
    if (!confirmEnd) return undefined;
    const esc = (e) => { if (e.key === "Escape") setConfirmEnd(false); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [confirmEnd]);

  function begin() { setStarted(true); setStartedAt(Date.now()); }
  function endSession() { setConfirmEnd(false); setEnding(true); setStep(0); }
  const title = !started ? "Ready to record" : ending ? "Wrapping up" : paused ? "Paused" : "Recording";

  const patientCard = (
    <div className="mts-patient">
      <AvatarE name={patient} size={38} />
      <div className="mtw-grow">
        <div className="mts-pname">{patient}</div>
        <div className="mts-pmeta">{id}{p ? " · DOB " + p.dob : ""}</div>
      </div>
      <span className={"mtw-pill " + (consent ? "mtw-pill-ok" : "mtw-pill-danger")}>
        <iconify-icon icon={consent ? "lucide:shield-check" : "lucide:shield-alert"}></iconify-icon>{consent ? "Consent on file" : "No consent"}
      </span>
    </div>
  );

  return (
    <div className={"mts-screen" + (started ? " is-live" : "")}>
      <header className="mts-top">
        <div className="mts-top-l">
          <button type="button" className="mts-cancel" onClick={() => MTE.go(MTE.routes.dashboard)} disabled={ending}><iconify-icon icon="lucide:x"></iconify-icon>Cancel</button>
        </div>
        <div className="mts-top-c">
          <span className="mts-top-title">{title}</span>
          <span className="mts-top-sub">{started ? "Minute Taker · " + patient : "Step 2 of 2 · Recording"}</span>
        </div>
        <div className="mts-top-r">
          {started && <span className={"mts-rec" + (paused ? " is-paused" : "")}><span className="mts-rec-dot" />{MTE.fmtClock(seconds)}</span>}
        </div>
      </header>

      {!started ? (
        <div className="mts-ready mtw-fade-in">
          <div className="mts-ready-card">
            {patientCard}
            <button type="button" className="mts-mic" onClick={begin} aria-label="Start recording">
              <span className="mts-ring r1" /><span className="mts-ring r2" /><span className="mts-ring r3" />
              <span className="mts-mic-core"><iconify-icon icon="lucide:mic"></iconify-icon></span>
            </button>
            <h2 className="mts-ready-title">Click to start listening</h2>
            <p className="mts-ready-sub">Minute Taker transcribes live and keeps your voice separate from {first}'s. Nothing reaches the chart until you approve the note.</p>
            <ul className="mts-tips">
              <li><span className="mtw-ti"><iconify-icon icon="lucide:message-square-quote"></iconify-icon></span>Speak naturally. There's no need to dictate.</li>
              <li><span className="mtw-ti"><iconify-icon icon="lucide:list-checks"></iconify-icon></span>Say the plan out loud so it lands in the note.</li>
              <li><span className="mtw-ti"><iconify-icon icon="lucide:pause"></iconify-icon></span>Pause any time for an off-record chat.</li>
            </ul>
            {primer && (
              <div className="mts-primer">
                <span className="mtw-eyebrow"><iconify-icon icon="lucide:sparkles"></iconify-icon> Session primer</span>
                <p>{primer}</p>
              </div>
            )}
            <button type="button" className="mtw-btn mtw-btn-primary mtw-btn-block mts-start" onClick={begin}><iconify-icon icon="lucide:mic"></iconify-icon>Start recording</button>
            <p className="mts-bottom-note">Recording only starts when you click.</p>
          </div>
        </div>
      ) : (
        <div className="mts-live mtw-fade-in">
          <section className="mts-stage" aria-label="Session">
            <MTSOrb paused={paused} />
            <div className="mts-orb-caption">
              {paused
                ? <><iconify-icon icon="lucide:pause"></iconify-icon><span>Paused · audio isn't being captured</span></>
                : <><span className="mts-live-dot" /><span>Listening · diarising you and {first}</span></>}
            </div>
            <div className="mts-dock">
              <button type="button" className={"mts-circ mts-circ-lg" + (paused ? " is-accent" : "")} onClick={() => setPaused((v) => !v)} disabled={ending} aria-label={paused ? "Resume" : "Pause"}>
                <iconify-icon icon={paused ? "lucide:play" : "lucide:pause"}></iconify-icon>
              </button>
              <button type="button" className="mts-circ mts-circ-lg mts-circ-dark" onClick={() => setConfirmEnd(true)} disabled={ending} aria-label="End session">
                <iconify-icon icon="lucide:x"></iconify-icon>
              </button>
            </div>
            <div className="mts-dock-labels"><span>{paused ? "Resume" : "Pause"}</span><span>End session</span></div>
          </section>

          <aside className="mts-side">
            {patientCard}
            {primer && (
              <div className="mts-primer">
                <span className="mtw-eyebrow"><iconify-icon icon="lucide:sparkles"></iconify-icon> Session primer</span>
                <p>{primer}</p>
              </div>
            )}
            <div className="mts-transcript-card">
              <div className="mts-transcript-head">
                <span className="mtw-card-title"><span className="mtw-ti"><iconify-icon icon="lucide:captions"></iconify-icon></span>Live transcript</span>
                <span className="mts-transcript-meta">{lineCount} {lineCount === 1 ? "turn" : "turns"} · {MTE.fmtClock(seconds)}</span>
              </div>
              <div className="mts-transcript" ref={scrollRef}>
                <div className="mts-meta">Session started {startedAt ? mtsTime(startedAt, 0) : ""} · consent verified</div>
                {MTS_SCRIPT.slice(0, lineCount).map((line, i) => (
                  <div key={i} className={"mts-line mtw-fade-in " + line.who}>
                    {line.who === "clinician"
                      ? <img className="mts-line-avatar" src="assets/avatar-katy.jpg" alt="" />
                      : <AvatarE name={patient} size={30} className="mts-line-avatar" />}
                    <div className="mts-bubble">
                      <div className="mts-bubble-head">{line.who === "clinician" ? "You" : first} · {startedAt ? mtsTime(startedAt, i * 38) : ""}</div>
                      <div className="mts-bubble-text">{line.text}</div>
                    </div>
                  </div>
                ))}
                {!paused && !ending && lineCount < MTS_SCRIPT.length && <div className="mts-typing" aria-label="Transcribing"><i /><i /><i /></div>}
                {lineCount >= MTS_SCRIPT.length && !paused && <div className="mts-meta">Still listening…</div>}
                {lineCount === 0 && <div className="mts-meta mts-meta-empty">Live transcript appears here</div>}
              </div>
            </div>
          </aside>
        </div>
      )}

      {started && confirmEnd && !ending && (
        <div className="mtw-scrim" onClick={() => setConfirmEnd(false)}>
          <div className="mtw-modal mtw-modal-center" role="alertdialog" aria-modal="true" aria-labelledby="mts-confirm-title" onClick={(e) => e.stopPropagation()}>
            <span className="mtw-modal-ic"><iconify-icon icon="lucide:circle-stop"></iconify-icon></span>
            <h3 id="mts-confirm-title">End the Minute Taker session?</h3>
            <p>Minute Taker will stop listening to {first} and write up the note from the {MTE.fmtClock(seconds)} recorded so far. You can review and edit it before anything is saved.</p>
            <div className="mtw-modal-actions mts-confirm-actions">
              <button type="button" className="mtw-btn mtw-btn-ghost" onClick={() => setConfirmEnd(false)}>Keep recording</button>
              <button type="button" className="mtw-btn mtw-btn-primary" onClick={endSession}><iconify-icon icon="lucide:check"></iconify-icon>Yes, end and write the note</button>
            </div>
          </div>
        </div>
      )}

      {ending && (
        <div className="mts-overlay" role="dialog" aria-live="polite" aria-label="Writing your note">
          <div className="mts-overlay-card">
            <MTSOrb mini badge />
            <h3>Writing your note</h3>
            <p>{MTE.fmtClock(seconds, "words")} of conversation · {lineCount} {lineCount === 1 ? "turn" : "turns"}</p>
            <div className="mts-progress" aria-hidden="true"><i style={{ width: Math.round(100 * Math.min(step, MTS_STEPS.length) / MTS_STEPS.length) + "%" }} /></div>
            <ol className="mts-steps">
              {MTS_STEPS.map((s, i) => (
                <li key={s} className={i < step ? "is-done" : i === step ? "is-active" : ""}>
                  <span className="mts-step-dot">{i < step ? <iconify-icon icon="lucide:check"></iconify-icon> : null}</span>
                  <span className="mts-step-text">{s}</span>
                  <span className="mts-step-state">{i < step ? "Done" : i === step ? "Working" : ""}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function MTSApp() {
  return <ShellE solo className="mts-shell"><MTSView /></ShellE>;
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTSApp />);
