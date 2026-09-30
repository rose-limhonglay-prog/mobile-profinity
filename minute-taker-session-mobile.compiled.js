/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Live Session
   Step 2 of 2: a ready screen with a big pulsing mic (recording only starts
   on tap), then a live diarised transcript with an animated waveform,
   pause/resume and End session → note generation overlay → Note Review.
   Runs on window.PFMT. Classes prefixed mtsem-.
   =========================================================================== */
const {
  useState: useStateMTSEM,
  useEffect: useEffectMTSEM,
  useRef: useRefMTSEM
} = React;
const MTE = window.PFMT;
const {
  Ic: IcE,
  Avatar: AvatarE,
  TopBar: TopBarE,
  TextBtn: TextBtnE,
  Shell: ShellE
} = MTE;
const MTSEM_SCRIPT = [{
  who: "clinician",
  text: "Good morning. Before we begin, how have you been feeling since our last adjustment?"
}, {
  who: "patient",
  text: "Morning, Dr Smith. The lower back pain has improved, but I've been getting tension headaches in the afternoon."
}, {
  who: "clinician",
  text: "Tension headaches can relate to neck posture, especially when compensating for back pain. Any visual disturbances?"
}, {
  who: "patient",
  text: "No, nothing like that. Just a dull ache across my forehead."
}, {
  who: "clinician",
  text: "Okay. Let's keep the current plan for your back and I'll add a posture check. If the headaches persist, we'll look at an ergonomic assessment."
}];
const MTSEM_STEPS = ["Finalising transcript", "Structuring the note", "Checking clinical terms"];
function mtsemTime(startedAt, offsetSec) {
  try {
    return new Date(startedAt + offsetSec * 1000).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return "";
  }
}
function MTSEMWave({
  paused
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mtsem-wave" + (paused ? " is-paused" : ""),
    "aria-hidden": "true"
  }, Array.from({
    length: 26
  }).map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: 8 + Math.round(20 * Math.abs(Math.sin(i * 0.8 + 1))),
      animationDelay: i * -0.08 + "s",
      animationDuration: 1.1 + i % 5 * 0.12 + "s"
    }
  })));
}
function MTSEMView() {
  const ctx = MTE.loadCtx();
  const patient = MTE.getParam("patient") || ctx.patient || "Sarah Jenkins";
  const p = MTE.PATIENTS[patient];
  const id = p ? p.id : ctx.id || "New patient";
  const consent = ctx.consentGiven !== undefined ? ctx.consentGiven : true;
  const primer = ctx.useContext === false ? "" : ctx.primer || p && p.primer || "";
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
    const t = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [started, paused, ending]);
  useEffectMTSEM(() => {
    if (!started || paused || ending || lineCount >= MTSEM_SCRIPT.length) return undefined;
    const t = window.setTimeout(() => setLineCount(c => c + 1), lineCount === 0 ? 1400 : 3200);
    return () => window.clearTimeout(t);
  }, [started, paused, ending, lineCount]);
  useEffectMTSEM(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth"
    });
  }, [lineCount, paused]);
  useEffectMTSEM(() => {
    if (!ending) return undefined;
    if (step >= MTSEM_STEPS.length) {
      const t = window.setTimeout(() => {
        MTE.mergeCtx({
          patient,
          id,
          consentGiven: consent,
          durationSeconds: seconds,
          transcriptLines: lineCount,
          endedAt: Date.now()
        });
        MTE.go(MTE.routes.review + "?patient=" + encodeURIComponent(patient) + "&id=" + encodeURIComponent(id) + "&generated=1");
      }, 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep(s => s + 1), 750);
    return () => window.clearTimeout(t);
  }, [ending, step]);
  function begin() {
    setStarted(true);
    setStartedAt(Date.now());
  }
  function endSession() {
    setEnding(true);
    setStep(0);
  }
  const title = !started ? "Ready to record" : ending ? "Wrapping up" : paused ? "Paused" : "Recording";
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-screen mtsem-screen"
  }, /*#__PURE__*/React.createElement(TopBarE, {
    left: /*#__PURE__*/React.createElement(TextBtnE, {
      onClick: () => MTE.go(MTE.routes.dashboard),
      disabled: ending
    }, "Cancel"),
    title: title,
    sub: started ? "Step 2 of 2 · Live transcript" : "Step 2 of 2 · Recording",
    right: started && /*#__PURE__*/React.createElement("span", {
      className: "mtsem-rec" + (paused ? " is-paused" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtsem-rec-dot"
    }), MTE.fmtClock(seconds))
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-patient"
  }, /*#__PURE__*/React.createElement(AvatarE, {
    name: patient,
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-pname"
  }, patient), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-pmeta"
  }, id, p ? " · DOB " + p.dob : "")), /*#__PURE__*/React.createElement("span", {
    className: "mt-pill " + (consent ? "mt-pill-ok" : "mt-pill-danger")
  }, /*#__PURE__*/React.createElement(IcE, {
    name: consent ? "lucide:shield-check" : "lucide:shield-alert",
    size: 12
  }), consent ? "Consent on file" : "No consent")), !started ? /*#__PURE__*/React.createElement("div", {
    className: "mt-scroll mtsem-ready"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtsem-mic",
    onClick: begin,
    "aria-label": "Start recording"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-ring r1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-ring r2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-ring r3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-mic-core"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:mic",
    size: 36
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "mtsem-ready-title"
  }, "Tap to start listening"), /*#__PURE__*/React.createElement("p", {
    className: "mtsem-ready-sub"
  }, "Minute Taker transcribes live and keeps your voice separate from ", first, "'s. Nothing reaches the chart until you approve the note."), /*#__PURE__*/React.createElement("ul", {
    className: "mtsem-tips"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:message-square-quote",
    size: 14
  })), "Speak naturally. There's no need to dictate."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:list-checks",
    size: 14
  })), "Say the plan out loud so it lands in the note."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:pause",
    size: 14
  })), "Pause any time for an off-record chat.")), primer && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-primer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-eyebrow"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:sparkles",
    size: 12
  }), " Session primer"), /*#__PURE__*/React.createElement("p", null, primer)), /*#__PURE__*/React.createElement("div", {
    className: "mt-spacer"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-wave-card"
  }, /*#__PURE__*/React.createElement(MTSEMWave, {
    paused: paused
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-wave-label"
  }, paused ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:pause",
    size: 13
  }), "Paused · audio isn't being captured") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-live"
  }), "Listening · diarising clinician and patient"))), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-transcript",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-meta"
  }, "Session started ", startedAt ? mtsemTime(startedAt, 0) : "", " · consent verified"), MTSEM_SCRIPT.slice(0, lineCount).map((line, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mtsem-line mt-fade-in " + line.who
  }, line.who === "clinician" ? /*#__PURE__*/React.createElement("img", {
    className: "mtsem-line-avatar",
    src: "assets/avatar-katy.jpg",
    alt: ""
  }) : /*#__PURE__*/React.createElement(AvatarE, {
    name: patient,
    size: 30,
    className: "mtsem-line-avatar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-bubble"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-bubble-head"
  }, line.who === "clinician" ? "You" : first, " · ", startedAt ? mtsemTime(startedAt, i * 38) : ""), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-bubble-text"
  }, line.text)))), !paused && !ending && lineCount < MTSEM_SCRIPT.length && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-typing",
    "aria-label": "Transcribing"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), lineCount >= MTSEM_SCRIPT.length && !paused && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-meta"
  }, "Still listening…"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12
    }
  }))), !started ? /*#__PURE__*/React.createElement("div", {
    className: "mt-bottom"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-primary mt-btn-block",
    onClick: begin
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:mic",
    size: 18
  }), "Start recording"), /*#__PURE__*/React.createElement("p", {
    className: "mt-bottom-note"
  }, "Recording only starts when you tap.")) : /*#__PURE__*/React.createElement("div", {
    className: "mt-bottom mtsem-controls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-ghost mtsem-pause",
    onClick: () => setPaused(v => !v),
    disabled: ending,
    "aria-label": paused ? "Resume" : "Pause"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: paused ? "lucide:play" : "lucide:pause",
    size: 18
  }), paused ? "Resume" : "Pause"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-danger mt-grow",
    onClick: endSession,
    disabled: ending
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:square",
    size: 16
  }), "End session")), ending && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-overlay",
    role: "dialog",
    "aria-live": "polite",
    "aria-label": "Writing your note"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-overlay-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-spinner"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:sparkles",
    size: 20
  })), /*#__PURE__*/React.createElement("h3", null, "Writing your note"), /*#__PURE__*/React.createElement("p", null, MTE.fmtClock(seconds, "words"), " of conversation · ", lineCount, " ", lineCount === 1 ? "turn" : "turns"), /*#__PURE__*/React.createElement("ol", {
    className: "mtsem-steps"
  }, MTSEM_STEPS.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s,
    className: i < step ? "is-done" : i === step ? "is-active" : ""
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-step-dot"
  }, i < step ? /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:check",
    size: 11
  }) : null), s))))));
}
function MTSEMApp() {
  return /*#__PURE__*/React.createElement(ShellE, {
    label: "Live Session (mobile)"
  }, /*#__PURE__*/React.createElement(MTSEMView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTSEMApp, null));
