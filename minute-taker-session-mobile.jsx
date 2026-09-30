/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Live Session
   Step 2 of 2: a ready screen with a big pulsing mic (recording only starts
   on tap), then a live diarised transcript with an animated waveform,
   pause/resume and End session → note generation overlay → Note Review.
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
const MTSEM_STEPS = ["Finalising transcript", "Structuring the note", "Checking clinical terms"];

function mtsemTime(startedAt, offsetSec) {
  try {
    return new Date(startedAt + offsetSec * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  } catch (e) { return ""; }
}

function MTSEMWave({ paused }) {
  return (
    <div className={"mtsem-wave" + (paused ? " is-paused" : "")} aria-hidden="true">
      {Array.from({ length: 26 }).map((_, i) => (
        <i key={i} style={{ height: 8 + Math.round(20 * Math.abs(Math.sin(i * 0.8 + 1))), animationDelay: (i * -0.08) + "s", animationDuration: (1.1 + (i % 5) * 0.12) + "s" }} />
      ))}
    </div>
  );
}

function MTSEMView() {
  const ctx = MTE.loadCtx();
  const patient = MTE.getParam("patient") || ctx.patient || "Sarah Jenkins";
  const p = MTE.PATIENTS[patient];
  const id = p ? p.id : (ctx.id || "New patient");
  const consent = ctx.consentGiven !== undefined ? ctx.consentGiven : true;
  const primer = ctx.useContext === false ? "" : (ctx.primer || (p && p.primer) || "");
  const first = patient.split(" ")[0];

  const [started, setStarted] = useStateMTSEM(false);
  const [startedAt, setStartedAt] = useStateMTSEM(null);
  const [seconds, setSeconds] = useStateMTSEM(0);
  const [paused, setPaused] = useStateMTSEM(false);
  const [lineCount, setLineCount] = useStateMTSEM(0);
  const [ending, setEnding] = useStateMTSEM(false);
  const [step, setStep] = useStateMTSEM(0);
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
  }, [lineCount, paused]);

  useEffectMTSEM(() => {
    if (!ending) return undefined;
    if (step >= MTSEM_STEPS.length) {
      const t = window.setTimeout(() => {
        MTE.mergeCtx({ patient, id, consentGiven: consent, durationSeconds: seconds, transcriptLines: lineCount, endedAt: Date.now() });
        MTE.go(MTE.routes.review + "?patient=" + encodeURIComponent(patient) + "&id=" + encodeURIComponent(id) + "&generated=1");
      }, 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 750);
    return () => window.clearTimeout(t);
  }, [ending, step]);

  function begin() { setStarted(true); setStartedAt(Date.now()); }
  function endSession() { setEnding(true); setStep(0); }

  const title = !started ? "Ready to record" : ending ? "Wrapping up" : paused ? "Paused" : "Recording";

  return (
    <div className="mt-screen mtsem-screen">
      <TopBarE
        left={<TextBtnE onClick={() => MTE.go(MTE.routes.dashboard)} disabled={ending}>Cancel</TextBtnE>}
        title={title}
        sub={started ? "Step 2 of 2 · Live transcript" : "Step 2 of 2 · Recording"}
        right={started && (
          <span className={"mtsem-rec" + (paused ? " is-paused" : "")}><span className="mtsem-rec-dot" />{MTE.fmtClock(seconds)}</span>
        )}
      />

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
        <>
          <div className="mtsem-wave-card">
            <MTSEMWave paused={paused} />
            <div className="mtsem-wave-label">
              {paused ? <><IcE name="lucide:pause" size={13} />Paused · audio isn't being captured</> : <><span className="mtsem-live" />Listening · diarising clinician and patient</>}
            </div>
          </div>

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
        </>
      )}

      {!started ? (
        <div className="mt-bottom">
          <button type="button" className="mt-btn mt-btn-primary mt-btn-block" onClick={begin}><IcE name="lucide:mic" size={18} />Start recording</button>
          <p className="mt-bottom-note">Recording only starts when you tap.</p>
        </div>
      ) : (
        <div className="mt-bottom mtsem-controls">
          <button type="button" className="mt-btn mt-btn-ghost mtsem-pause" onClick={() => setPaused((v) => !v)} disabled={ending} aria-label={paused ? "Resume" : "Pause"}>
            <IcE name={paused ? "lucide:play" : "lucide:pause"} size={18} />{paused ? "Resume" : "Pause"}
          </button>
          <button type="button" className="mt-btn mt-btn-danger mt-grow" onClick={endSession} disabled={ending}>
            <IcE name="lucide:square" size={16} />End session
          </button>
        </div>
      )}

      {ending && (
        <div className="mtsem-overlay" role="dialog" aria-live="polite" aria-label="Writing your note">
          <div className="mtsem-overlay-card">
            <div className="mtsem-spinner"><IcE name="lucide:sparkles" size={20} /></div>
            <h3>Writing your note</h3>
            <p>{MTE.fmtClock(seconds, "words")} of conversation · {lineCount} {lineCount === 1 ? "turn" : "turns"}</p>
            <ol className="mtsem-steps">
              {MTSEM_STEPS.map((s, i) => (
                <li key={s} className={i < step ? "is-done" : i === step ? "is-active" : ""}>
                  <span className="mtsem-step-dot">{i < step ? <IcE name="lucide:check" size={11} /> : null}</span>{s}
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
