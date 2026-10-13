/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Live Session
   Step 2 of 2: a ready screen with a big pulsing mic (recording only starts
   on tap), then a voice-mode stage (user, 2026-10-12): a drifting cloud orb
   in the middle, round Cancel / patient buttons up top, and a bottom dock
   with the live-transcript pill (opens a sheet), Pause and End session.
   End session → note generation overlay → Note Review.
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
function MTSEMView() {
  const ctx = MTE.loadCtx();
  const patient = MTE.getParam("patient") || ctx.patient || "Sarah Jenkins";
  const p = MTE.PATIENTS[patient];
  const id = p ? p.id : ctx.id || "New patient";
  const consent = ctx.consentGiven !== undefined ? ctx.consentGiven : true;
  const primer = ctx.useContext === false ? "" : ctx.primer || p && p.primer || "";
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
  }, [lineCount, paused, showTranscript]);
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
    setConfirmEnd(false);
    setShowTranscript(false);
    setShowPatient(false);
    setEnding(true);
    setStep(0);
  }
  const title = !started ? "Ready to record" : ending ? "Wrapping up" : paused ? "Paused" : "Recording";
  const latest = lineCount > 0 ? MTSEM_SCRIPT[lineCount - 1] : null;
  const patientCard = /*#__PURE__*/React.createElement("div", {
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
  }), consent ? "Consent on file" : "No consent"));
  const transcript = /*#__PURE__*/React.createElement("div", {
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
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-screen mtsem-screen" + (started ? " is-live" : "")
  }, !started ? /*#__PURE__*/React.createElement(TopBarE, {
    left: /*#__PURE__*/React.createElement(TextBtnE, {
      onClick: () => MTE.go(MTE.routes.dashboard)
    }, "Cancel"),
    title: title,
    sub: "Step 2 of 2 · Recording"
  }) : /*#__PURE__*/React.createElement("header", {
    className: "mtsem-vhead"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtsem-circ",
    "aria-label": "Cancel session",
    onClick: () => MTE.go(MTE.routes.dashboard),
    disabled: ending
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:x",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-rec" + (paused ? " is-paused" : ""),
    "aria-live": "off"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-rec-dot"
  }), MTE.fmtClock(seconds)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtsem-circ",
    "aria-label": "Patient details",
    onClick: () => setShowPatient(true),
    disabled: ending
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:user-round",
    size: 20
  }))), !started && patientCard, !started ? /*#__PURE__*/React.createElement("div", {
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
  })) : /*#__PURE__*/React.createElement("div", {
    className: "mtsem-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-orb" + (paused ? " is-paused" : ""),
    role: "img",
    "aria-label": paused ? "Paused" : "Listening"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-orb-halo",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-orb-body",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", {
    className: "c1"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c2"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c3"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-orb-caption"
  }, paused ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:pause",
    size: 13
  }), /*#__PURE__*/React.createElement("span", null, "Paused · audio isn't being captured")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-live"
  }), /*#__PURE__*/React.createElement("span", null, "Listening · diarising you and ", first)))), !started ? /*#__PURE__*/React.createElement("div", {
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
    className: "mtsem-dock"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtsem-dock-pill",
    onClick: () => setShowTranscript(true),
    disabled: ending,
    "aria-label": "Open live transcript"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:captions",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-dock-text"
  }, latest ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, latest.who === "clinician" ? "You" : first, ":"), " ", latest.text) : "Live transcript appears here")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtsem-circ mtsem-circ-lg" + (paused ? " is-accent" : ""),
    onClick: () => setPaused(v => !v),
    disabled: ending,
    "aria-label": paused ? "Resume" : "Pause"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: paused ? "lucide:play" : "lucide:pause",
    size: 22
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtsem-circ mtsem-circ-lg mtsem-circ-dark",
    onClick: () => setConfirmEnd(true),
    disabled: ending,
    "aria-label": "End session"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:x",
    size: 24
  }))), started && showTranscript && !ending && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-scrim",
    onClick: () => setShowTranscript(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-sheet mtsem-sheet-transcript",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Live transcript",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-sheet-grab",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-sheet-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-grow"
  }, /*#__PURE__*/React.createElement("h3", null, "Live transcript"), /*#__PURE__*/React.createElement("p", null, lineCount, " ", lineCount === 1 ? "turn" : "turns", " · ", MTE.fmtClock(seconds))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtsem-sheet-x",
    "aria-label": "Close",
    onClick: () => setShowTranscript(false)
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:x",
    size: 16
  }))), transcript)), started && showPatient && !ending && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-scrim",
    onClick: () => setShowPatient(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Patient details",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-sheet-grab",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-sheet-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-grow"
  }, /*#__PURE__*/React.createElement("h3", null, "In this session"), /*#__PURE__*/React.createElement("p", null, "Recording started ", startedAt ? mtsemTime(startedAt, 0) : "")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtsem-sheet-x",
    "aria-label": "Close",
    onClick: () => setShowPatient(false)
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:x",
    size: 16
  }))), patientCard, primer && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-primer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-eyebrow"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:sparkles",
    size: 12
  }), " Session primer"), /*#__PURE__*/React.createElement("p", null, primer)))), started && confirmEnd && !ending && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-scrim mtsem-scrim-center",
    onClick: () => setConfirmEnd(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-confirm",
    role: "alertdialog",
    "aria-modal": "true",
    "aria-labelledby": "mtsem-confirm-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-confirm-ic"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:circle-stop",
    size: 24
  })), /*#__PURE__*/React.createElement("h3", {
    id: "mtsem-confirm-title"
  }, "End the Minute Taker session?"), /*#__PURE__*/React.createElement("p", null, "Minute Taker will stop listening to ", first, " and write up the note from the ", MTE.fmtClock(seconds), " recorded so far. You can review and edit it before anything is saved."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-primary mt-btn-block",
    onClick: endSession
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:check",
    size: 18
  }), "Yes, end and write the note"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-ghost mt-btn-block",
    onClick: () => setConfirmEnd(false)
  }, "Keep recording"))), ending && /*#__PURE__*/React.createElement("div", {
    className: "mtsem-overlay",
    role: "dialog",
    "aria-live": "polite",
    "aria-label": "Writing your note"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-overlay-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtsem-orb mtsem-orb-mini",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-orb-halo"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-orb-body"
  }, /*#__PURE__*/React.createElement("i", {
    className: "c1"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c2"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c3"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-orb-badge"
  }, /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:sparkles",
    size: 14
  }))), /*#__PURE__*/React.createElement("h3", null, "Writing your note"), /*#__PURE__*/React.createElement("p", null, MTE.fmtClock(seconds, "words"), " of conversation · ", lineCount, " ", lineCount === 1 ? "turn" : "turns"), /*#__PURE__*/React.createElement("div", {
    className: "mtsem-progress",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: Math.round(100 * Math.min(step, MTSEM_STEPS.length) / MTSEM_STEPS.length) + "%"
    }
  })), /*#__PURE__*/React.createElement("ol", {
    className: "mtsem-steps"
  }, MTSEM_STEPS.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s,
    className: i < step ? "is-done" : i === step ? "is-active" : ""
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtsem-step-dot"
  }, i < step ? /*#__PURE__*/React.createElement(IcE, {
    name: "lucide:check",
    size: 12
  }) : null), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-step-text"
  }, s), /*#__PURE__*/React.createElement("span", {
    className: "mtsem-step-state"
  }, i < step ? "Done" : i === step ? "Working" : "")))))));
}
function MTSEMApp() {
  return /*#__PURE__*/React.createElement(ShellE, {
    label: "Live Session (mobile)"
  }, /*#__PURE__*/React.createElement(MTSEMView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTSEMApp, null));
