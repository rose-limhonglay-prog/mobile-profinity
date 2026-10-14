/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Live Session
   Step 2 of 2: a ready screen with a big pulsing mic (recording only starts
   on tap), then a voice-mode stage (user, 2026-10-12): a drifting cloud orb
   in the middle, round Cancel / patient buttons up top, and a bottom dock
   with the live-transcript pill (opens a sheet), Pause and End session.
   End session → note generation overlay → Note Review.
   Runs on window.PFMT. Classes prefixed mtsem-.
   =========================================================================== */
const { useState: useStateMTSEM, useEffect: useEffectMTSEM, useRef: useRefMTSEM } = React;
const MTE = window.PFMT;
const { Ic: IcE, Avatar: AvatarE, TopBar: TopBarE, TextBtn: TextBtnE, Shell: ShellE } = MTE;

const MTSEM_SCRIPT = [
  { who: "clinician", text: "Good morning. Before we begin, how have you been feeling since our last adjustment?" },
  { who: "patient", text: "Morning, Dr Smith. The lower back pain has improved, but I've been getting tension headaches in the afternoon." },
  { who: "clinician", text: "Tension headaches can relate to neck posture, especially when compensating for back pain. Any visual disturbances?" },
  { who: "patient", text: "No, nothing like that. Just a dull ache across my forehead." },
  { who: "clinician", text: "Okay. Let's keep the current plan for your back and I'll add a posture check. If the headaches persist, we'll look at an ergonomic assessment." },
];
const MTSEM_STEPS = ["Saving the recording", "Finalising transcript", "Structuring the note", "Checking clinical terms"];

function mtsemTime(startedAt, offsetSec) {
  try {
    return new Date(startedAt + offsetSec * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } catch (e) { return ""; }
}

function MTSEMView() {
  const ctx = MTE.loadCtx();
  const patient = MTE.getParam("patient") || ctx.patient || "Sarah Jenkins";
  const p = MTE.PATIENTS[patient];
  const id = p ? p.id : (ctx.id || "New patient");
  const consent = ctx.consentGiven !== undefined ? ctx.consentGiven : true;
  const primer = ctx.useContext === false ? "" : (ctx.primer || (p && p.primer) || "");
  const first = patient.split(" ")[0];

  /* ?autostart=1 skips the ready screen, ?end=1 jumps to the note-writing overlay (demo / screenshots) */
  const auto = MTE.getParam("autostart") === "1" || MTE.getParam("end") === "1";
  const [started, setStarted] = useStateMTSEM(auto);
  const [startedAt, setStartedAt] = useStateMTSEM(auto ? Date.now() : null);
  const [seconds, setSeconds] = useStateMTSEM(auto ? 7 : 0);
  const [paused, setPaused] = useStateMTSEM(MTE.getParam("paused") === "1");
  const [lineCount, setLineCount] = useStateMTSEM(auto ? 2 : 0);
  const [ending, setEnding] = useStateMTSEM(MTE.getParam("end") === "1");
  const [step, setStep] = useStateMTSEM(0);
  const [showTranscript, setShowTranscript] = useStateMTSEM(MTE.getParam("transcript") === "1");
  const [showPatient, setShowPatient] = useStateMTSEM(false);
  const [confirmEnd, setConfirmEnd] = useStateMTSEM(MTE.getParam("confirm") === "1");
  const scrollRef = useRefMTSEM(null);

  useEffectMTSEM(() => {
    if (!started || paused || ending) return undefined;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [started, paused, ending]);

  useEffectMTSEM(() => {
    if (!started || paused || ending || lineCount >= MTSEM_SCRIPT.length) return undefined;
    const t = window.setTimeout(() => setLineCount((c) => c + 1), lineCount === 0 ? 1400 : 3200);
    return () => window.clearTimeout(t);
  }, [started, paused, ending, lineCount]);

  useEffectMTSEM(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [lineCount, paused, showTranscript]);

  useEffectMTSEM(() => {
    if (!ending) return undefined;
    if (step >= MTSEM_STEPS.length) {
      const t = window.setTimeout(() => {
        MTE.mergeCtx({ patient, id, consentGiven: consent, durationSeconds: seconds, transcriptLines: lineCount, endedAt: Date.now(), recordingKept: true });
        MTE.go(MTE.routes.review + "?patient=" + encodeURIComponent(patient) + "&id=" + encodeURIComponent(id) + "&generated=1");
      }, 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 750);
    return () => window.clearTimeout(t);
  }, [ending, step]);

  function begin() { setStarted(true); setStartedAt(Date.now()); }
  function endSession() { setConfirmEnd(false); setShowTranscript(false); setShowPatient(false); setEnding(true); setStep(0); }

  const title = !started ? "Ready to record" : ending ? "Wrapping up" : paused ? "Paused" : "Recording";
  const latest = lineCount > 0 ? MTSEM_SCRIPT[lineCount - 1] : null;

  const patientCard = (
    <div className="mtsem-patient">
      <AvatarE name={patient} size={38} />
      <div className="mt-grow">
        <div className="mtsem-pname">{patient}</div>
        <div className="mtsem-pmeta">{id}{p ? " · DOB " + p.dob : ""}</div>
      </div>
      <span className={"mt-pill " + (consent ? "mt-pill-ok" : "mt-pill-danger")}>
        <IcE name={consent ? "lucide:shield-check" : "lucide:shield-alert"} size={12} />{consent ? "Consent on file" : "No consent"}
      </span>
    </div>
  );

  const transcript = (
    <div className="mtsem-transcript" ref={scrollRef}>
      <div className="mtsem-meta">Session started {startedAt ? mtsemTime(startedAt, 0) : ""} · consent verified</div>
      {MTSEM_SCRIPT.slice(0, lineCount).map((line, i) => (
        <div key={i} className={"mtsem-line mt-fade-in " + line.who}>
          {line.who === "clinician"
            ? <img className="mtsem-line-avatar" src="assets/avatar-katy.jpg" alt="" />
            : <AvatarE name={patient} size={30} className="mtsem-line-avatar" />}
          <div className="mtsem-bubble">
            <div className="mtsem-bubble-head">{line.who === "clinician" ? "You" : first} · {startedAt ? mtsemTime(startedAt, i * 38) : ""}</div>
            <div className="mtsem-bubble-text">{line.text}</div>
          </div>
        </div>
      ))}
      {!paused && !ending && lineCount < MTSEM_SCRIPT.length && (
        <div className="mtsem-typing" aria-label="Transcribing"><i /><i /><i /></div>
      )}
      {lineCount >= MTSEM_SCRIPT.length && !paused && <div className="mtsem-meta">Still listening…</div>}
      <div style={{ height: 12 }} />
    </div>
  );

  return (
    <div className={"mt-screen mtsem-screen" + (started ? " is-live" : "")}>
      {!started ? (
        <TopBarE
          left={<TextBtnE onClick={() => MTE.go(MTE.routes.dashboard)}>Cancel</TextBtnE>}
          title={title}
          sub="Step 2 of 2 · Recording"
        />
      ) : (
        <header className="mtsem-vhead">
          <button type="button" className="mtsem-circ" aria-label="Cancel session" onClick={() => MTE.go(MTE.routes.dashboard)} disabled={ending}><IcE name="lucide:x" size={20} /></button>
          <span className={"mtsem-rec" + (paused ? " is-paused" : "")} aria-live="off"><span className="mtsem-rec-dot" />{MTE.fmtClock(seconds)}</span>
          <button type="button" className="mtsem-circ" aria-label="Patient details" onClick={() => setShowPatient(true)} disabled={ending}><IcE name="lucide:user-round" size={20} /></button>
        </header>
      )}

      {!started && patientCard}

      {!started ? (
        <div className="mt-scroll mtsem-ready">
          <button type="button" className="mtsem-mic" onClick={begin} aria-label="Start recording">
            <span className="mtsem-ring r1" /><span className="mtsem-ring r2" /><span className="mtsem-ring r3" />
            <span className="mtsem-mic-core"><IcE name="lucide:mic" size={36} /></span>
          </button>
          <h2 className="mtsem-ready-title">Tap to start listening</h2>
          <p className="mtsem-ready-sub">Minute Taker transcribes live and keeps your voice separate from {first}'s. Nothing reaches the chart until you approve the note.</p>

          <ul className="mtsem-tips">
            <li><span className="mt-ti"><IcE name="lucide:message-square-quote" size={14} /></span>Speak naturally. There's no need to dictate.</li>
            <li><span className="mt-ti"><IcE name="lucide:list-checks" size={14} /></span>Say the plan out loud so it lands in the note.</li>
            <li><span className="mt-ti"><IcE name="lucide:pause" size={14} /></span>Pause any time for an off-record chat.</li>
          </ul>

          {primer && (
            <div className="mtsem-primer">
              <span className="mt-eyebrow"><IcE name="lucide:sparkles" size={12} /> Session primer</span>
              <p>{primer}</p>
            </div>
          )}
          <div className="mt-spacer" />
        </div>
      ) : (
        <div className="mtsem-stage">
          <div className={"mtsem-orb" + (paused ? " is-paused" : "")} role="img" aria-label={paused ? "Paused" : "Listening"}>
            <span className="mtsem-orb-halo" aria-hidden="true" />
            <span className="mtsem-orb-body" aria-hidden="true"><i className="c1" /><i className="c2" /><i className="c3" /></span>
          </div>
          <div className="mtsem-orb-caption">
            {paused
              ? <><IcE name="lucide:pause" size={13} /><span>Paused · audio isn't being captured</span></>
              : <><span className="mtsem-live" /><span>Listening · diarising you and {first}</span></>}
          </div>
        </div>
      )}

      {!started ? (
        <div className="mt-bottom">
          <button type="button" className="mt-btn mt-btn-primary mt-btn-block" onClick={begin}><IcE name="lucide:mic" size={18} />Start recording</button>
          <p className="mt-bottom-note">Recording only starts when you tap.</p>
        </div>
      ) : (
        <div className="mtsem-dock">
          <button type="button" className="mtsem-dock-pill" onClick={() => setShowTranscript(true)} disabled={ending} aria-label="Open live transcript">
            <IcE name="lucide:captions" size={20} />
            <span className="mtsem-dock-text">{latest ? <><b>{latest.who === "clinician" ? "You" : first}:</b> {latest.text}</> : "Live transcript appears here"}</span>
          </button>
          <button type="button" className={"mtsem-circ mtsem-circ-lg" + (paused ? " is-accent" : "")} onClick={() => setPaused((v) => !v)} disabled={ending} aria-label={paused ? "Resume" : "Pause"}>
            <IcE name={paused ? "lucide:play" : "lucide:pause"} size={22} />
          </button>
          <button type="button" className="mtsem-circ mtsem-circ-lg mtsem-circ-dark" onClick={() => setConfirmEnd(true)} disabled={ending} aria-label="End session">
            <IcE name="lucide:x" size={24} />
          </button>
        </div>
      )}

      {started && showTranscript && !ending && (
        <div className="mtsem-scrim" onClick={() => setShowTranscript(false)}>
          <div className="mtsem-sheet mtsem-sheet-transcript" role="dialog" aria-modal="true" aria-label="Live transcript" onClick={(e) => e.stopPropagation()}>
            <span className="mtsem-sheet-grab" aria-hidden="true" />
            <div className="mtsem-sheet-head">
              <div className="mt-grow">
                <h3>Live transcript</h3>
                <p>{lineCount} {lineCount === 1 ? "turn" : "turns"} · {MTE.fmtClock(seconds)}</p>
              </div>
              <button type="button" className="mtsem-sheet-x" aria-label="Close" onClick={() => setShowTranscript(false)}><IcE name="lucide:x" size={16} /></button>
            </div>
            {transcript}
          </div>
        </div>
      )}

      {started && showPatient && !ending && (
        <div className="mtsem-scrim" onClick={() => setShowPatient(false)}>
          <div className="mtsem-sheet" role="dialog" aria-modal="true" aria-label="Patient details" onClick={(e) => e.stopPropagation()}>
            <span className="mtsem-sheet-grab" aria-hidden="true" />
            <div className="mtsem-sheet-head">
              <div className="mt-grow"><h3>In this session</h3><p>Recording started {startedAt ? mtsemTime(startedAt, 0) : ""}</p></div>
              <button type="button" className="mtsem-sheet-x" aria-label="Close" onClick={() => setShowPatient(false)}><IcE name="lucide:x" size={16} /></button>
            </div>
            {patientCard}
            {primer && (
              <div className="mtsem-primer">
                <span className="mt-eyebrow"><IcE name="lucide:sparkles" size={12} /> Session primer</span>
                <p>{primer}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {started && confirmEnd && !ending && (
        <div className="mtsem-scrim mtsem-scrim-center" onClick={() => setConfirmEnd(false)}>
          <div className="mtsem-confirm" role="alertdialog" aria-modal="true" aria-labelledby="mtsem-confirm-title" onClick={(e) => e.stopPropagation()}>
            <span className="mtsem-confirm-ic"><IcE name="lucide:circle-stop" size={24} /></span>
            <h3 id="mtsem-confirm-title">End the Minute Taker session?</h3>
            <p>Minute Taker will stop listening to {first} and write up the note from the {MTE.fmtClock(seconds)} recorded so far. You can review and edit it before anything is saved.</p>
            <button type="button" className="mt-btn mt-btn-primary mt-btn-block" onClick={endSession}><IcE name="lucide:check" size={18} />Yes, end and write the note</button>
            <button type="button" className="mt-btn mt-btn-ghost mt-btn-block" onClick={() => setConfirmEnd(false)}>Keep recording</button>
          </div>
        </div>
      )}

      {ending && (
        <div className="mtsem-overlay" role="dialog" aria-live="polite" aria-label="Writing your note">
          <div className="mtsem-overlay-card">
            <div className="mtsem-orb mtsem-orb-mini" aria-hidden="true">
              <span className="mtsem-orb-halo" />
              <span className="mtsem-orb-body"><i className="c1" /><i className="c2" /><i className="c3" /></span>
              <span className="mtsem-orb-badge"><IcE name="lucide:sparkles" size={14} /></span>
            </div>
            <h3>Writing your note</h3>
            <p>{MTE.fmtClock(seconds, "words")} of conversation · {lineCount} {lineCount === 1 ? "turn" : "turns"}</p>
            <div className="mtsem-progress" aria-hidden="true"><i style={{ width: Math.round(100 * Math.min(step, MTSEM_STEPS.length) / MTSEM_STEPS.length) + "%" }} /></div>
            <ol className="mtsem-steps">
              {MTSEM_STEPS.map((s, i) => (
                <li key={s} className={i < step ? "is-done" : i === step ? "is-active" : ""}>
                  <span className="mtsem-step-dot">{i < step ? <IcE name="lucide:check" size={12} /> : null}</span>
                  <span className="mtsem-step-text">{s}</span>
                  <span className="mtsem-step-state">{i < step ? "Done" : i === step ? "Working" : ""}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function MTSEMApp() {
  return <ShellE label="Live Session (mobile)"><MTSEMView /></ShellE>;
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTSEMApp />);
