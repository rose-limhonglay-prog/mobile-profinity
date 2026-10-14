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
const {
  useState: useStateMTS,
  useEffect: useEffectMTS,
  useRef: useRefMTS
} = React;
const MTE = window.PFMTW;
const {
  Avatar: AvatarE,
  Shell: ShellE
} = MTE;
const MTS_SCRIPT = [{
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
const MTS_STEPS = ["Saving the recording", "Finalising transcript", "Structuring the note", "Checking clinical terms"];
function mtsTime(startedAt, offsetSec) {
  try {
    return new Date(startedAt + offsetSec * 1000).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return "";
  }
}
function MTSOrb({
  paused,
  mini,
  badge
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mts-orb" + (paused ? " is-paused" : "") + (mini ? " mts-orb-mini" : ""),
    role: "img",
    "aria-label": paused ? "Paused" : "Listening"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mts-orb-halo",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mts-orb-body",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", {
    className: "c1"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c2"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c3"
  })), badge && /*#__PURE__*/React.createElement("span", {
    className: "mts-orb-badge"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sparkles"
  })));
}
function MTSView() {
  const ctx = MTE.loadCtx();
  const patient = MTE.getParam("patient") || ctx.patient || "Sarah Jenkins";
  const p = MTE.PATIENTS[patient];
  const id = p ? p.id : ctx.id || "New patient";
  const consent = MTE.getParam("consent") ? true : ctx.consentGiven !== undefined ? ctx.consentGiven : true;
  const primer = ctx.useContext === false ? "" : ctx.primer || p && p.primer || "";
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
    const t = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [started, paused, ending]);
  useEffectMTS(() => {
    if (!started || paused || ending || lineCount >= MTS_SCRIPT.length) return undefined;
    const t = window.setTimeout(() => setLineCount(c => c + 1), lineCount === 0 ? 1400 : 3200);
    return () => window.clearTimeout(t);
  }, [started, paused, ending, lineCount]);
  useEffectMTS(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth"
    });
  }, [lineCount, paused]);
  useEffectMTS(() => {
    if (!ending) return undefined;
    if (step >= MTS_STEPS.length) {
      const t = window.setTimeout(() => {
        MTE.mergeCtx({
          patient,
          id,
          consentGiven: consent,
          durationSeconds: seconds,
          transcriptLines: lineCount,
          endedAt: Date.now(),
          recordingKept: true
        });
        MTE.go(MTE.routes.review + "?patient=" + encodeURIComponent(patient) + "&id=" + encodeURIComponent(id) + "&generated=1");
      }, 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep(s => s + 1), 750);
    return () => window.clearTimeout(t);
  }, [ending, step]);
  useEffectMTS(() => {
    if (!confirmEnd) return undefined;
    const esc = e => {
      if (e.key === "Escape") setConfirmEnd(false);
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [confirmEnd]);
  function begin() {
    setStarted(true);
    setStartedAt(Date.now());
  }
  function endSession() {
    setConfirmEnd(false);
    setEnding(true);
    setStep(0);
  }
  const title = !started ? "Ready to record" : ending ? "Wrapping up" : paused ? "Paused" : "Recording";
  const patientCard = /*#__PURE__*/React.createElement("div", {
    className: "mts-patient"
  }, /*#__PURE__*/React.createElement(AvatarE, {
    name: patient,
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtw-grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-pname"
  }, patient), /*#__PURE__*/React.createElement("div", {
    className: "mts-pmeta"
  }, id, p ? " · DOB " + p.dob : "")), /*#__PURE__*/React.createElement("span", {
    className: "mtw-pill " + (consent ? "mtw-pill-ok" : "mtw-pill-danger")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: consent ? "lucide:shield-check" : "lucide:shield-alert"
  }), consent ? "Consent on file" : "No consent"));
  return /*#__PURE__*/React.createElement("div", {
    className: "mts-screen" + (started ? " is-live" : "")
  }, /*#__PURE__*/React.createElement("header", {
    className: "mts-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-top-l"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mts-cancel",
    onClick: () => MTE.go(MTE.routes.dashboard),
    disabled: ending
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }), "Cancel")), /*#__PURE__*/React.createElement("div", {
    className: "mts-top-c"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mts-top-title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "mts-top-sub"
  }, started ? "Minute Taker · " + patient : "Step 2 of 2 · Recording")), /*#__PURE__*/React.createElement("div", {
    className: "mts-top-r"
  }, started && /*#__PURE__*/React.createElement("span", {
    className: "mts-rec" + (paused ? " is-paused" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "mts-rec-dot"
  }), MTE.fmtClock(seconds)))), !started ? /*#__PURE__*/React.createElement("div", {
    className: "mts-ready mtw-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-ready-card"
  }, patientCard, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mts-mic",
    onClick: begin,
    "aria-label": "Start recording"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mts-ring r1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mts-ring r2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mts-ring r3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mts-mic-core"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "mts-ready-title"
  }, "Click to start listening"), /*#__PURE__*/React.createElement("p", {
    className: "mts-ready-sub"
  }, "Minute Taker transcribes live and keeps your voice separate from ", first, "'s. Nothing reaches the chart until you approve the note."), /*#__PURE__*/React.createElement("ul", {
    className: "mts-tips"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:message-square-quote"
  })), "Speak naturally. There's no need to dictate."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:list-checks"
  })), "Say the plan out loud so it lands in the note."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pause"
  })), "Pause any time for an off-record chat.")), primer && /*#__PURE__*/React.createElement("div", {
    className: "mts-primer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-eyebrow"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sparkles"
  }), " Session primer"), /*#__PURE__*/React.createElement("p", null, primer)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-btn mtw-btn-primary mtw-btn-block mts-start",
    onClick: begin
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  }), "Start recording"), /*#__PURE__*/React.createElement("p", {
    className: "mts-bottom-note"
  }, "Recording only starts when you click."))) : /*#__PURE__*/React.createElement("div", {
    className: "mts-live mtw-fade-in"
  }, /*#__PURE__*/React.createElement("section", {
    className: "mts-stage",
    "aria-label": "Session"
  }, /*#__PURE__*/React.createElement(MTSOrb, {
    paused: paused
  }), /*#__PURE__*/React.createElement("div", {
    className: "mts-orb-caption"
  }, paused ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pause"
  }), /*#__PURE__*/React.createElement("span", null, "Paused · audio isn't being captured")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mts-live-dot"
  }), /*#__PURE__*/React.createElement("span", null, "Listening · diarising you and ", first))), /*#__PURE__*/React.createElement("div", {
    className: "mts-dock"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mts-circ mts-circ-lg" + (paused ? " is-accent" : ""),
    onClick: () => setPaused(v => !v),
    disabled: ending,
    "aria-label": paused ? "Resume" : "Pause"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: paused ? "lucide:play" : "lucide:pause"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mts-circ mts-circ-lg mts-circ-dark",
    onClick: () => setConfirmEnd(true),
    disabled: ending,
    "aria-label": "End session"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mts-dock-labels"
  }, /*#__PURE__*/React.createElement("span", null, paused ? "Resume" : "Pause"), /*#__PURE__*/React.createElement("span", null, "End session"))), /*#__PURE__*/React.createElement("aside", {
    className: "mts-side"
  }, patientCard, primer && /*#__PURE__*/React.createElement("div", {
    className: "mts-primer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-eyebrow"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sparkles"
  }), " Session primer"), /*#__PURE__*/React.createElement("p", null, primer)), /*#__PURE__*/React.createElement("div", {
    className: "mts-transcript-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-transcript-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:captions"
  })), "Live transcript"), /*#__PURE__*/React.createElement("span", {
    className: "mts-transcript-meta"
  }, lineCount, " ", lineCount === 1 ? "turn" : "turns", " · ", MTE.fmtClock(seconds))), /*#__PURE__*/React.createElement("div", {
    className: "mts-transcript",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-meta"
  }, "Session started ", startedAt ? mtsTime(startedAt, 0) : "", " · consent verified"), MTS_SCRIPT.slice(0, lineCount).map((line, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mts-line mtw-fade-in " + line.who
  }, line.who === "clinician" ? /*#__PURE__*/React.createElement("img", {
    className: "mts-line-avatar",
    src: "assets/avatar-katy.jpg",
    alt: ""
  }) : /*#__PURE__*/React.createElement(AvatarE, {
    name: patient,
    size: 30,
    className: "mts-line-avatar"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mts-bubble"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-bubble-head"
  }, line.who === "clinician" ? "You" : first, " · ", startedAt ? mtsTime(startedAt, i * 38) : ""), /*#__PURE__*/React.createElement("div", {
    className: "mts-bubble-text"
  }, line.text)))), !paused && !ending && lineCount < MTS_SCRIPT.length && /*#__PURE__*/React.createElement("div", {
    className: "mts-typing",
    "aria-label": "Transcribing"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), lineCount >= MTS_SCRIPT.length && !paused && /*#__PURE__*/React.createElement("div", {
    className: "mts-meta"
  }, "Still listening…"), lineCount === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mts-meta mts-meta-empty"
  }, "Live transcript appears here"))))), started && confirmEnd && !ending && /*#__PURE__*/React.createElement("div", {
    className: "mtw-scrim",
    onClick: () => setConfirmEnd(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-modal mtw-modal-center",
    role: "alertdialog",
    "aria-modal": "true",
    "aria-labelledby": "mts-confirm-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-modal-ic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:circle-stop"
  })), /*#__PURE__*/React.createElement("h3", {
    id: "mts-confirm-title"
  }, "End the Minute Taker session?"), /*#__PURE__*/React.createElement("p", null, "Minute Taker will stop listening to ", first, " and write up the note from the ", MTE.fmtClock(seconds), " recorded so far. You can review and edit it before anything is saved."), /*#__PURE__*/React.createElement("div", {
    className: "mtw-modal-actions mts-confirm-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-btn mtw-btn-ghost",
    onClick: () => setConfirmEnd(false)
  }, "Keep recording"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-btn mtw-btn-primary",
    onClick: endSession
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "Yes, end and write the note")))), ending && /*#__PURE__*/React.createElement("div", {
    className: "mts-overlay",
    role: "dialog",
    "aria-live": "polite",
    "aria-label": "Writing your note"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-overlay-card"
  }, /*#__PURE__*/React.createElement(MTSOrb, {
    mini: true,
    badge: true
  }), /*#__PURE__*/React.createElement("h3", null, "Writing your note"), /*#__PURE__*/React.createElement("p", null, MTE.fmtClock(seconds, "words"), " of conversation · ", lineCount, " ", lineCount === 1 ? "turn" : "turns"), /*#__PURE__*/React.createElement("div", {
    className: "mts-progress",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: Math.round(100 * Math.min(step, MTS_STEPS.length) / MTS_STEPS.length) + "%"
    }
  })), /*#__PURE__*/React.createElement("ol", {
    className: "mts-steps"
  }, MTS_STEPS.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s,
    className: i < step ? "is-done" : i === step ? "is-active" : ""
  }, /*#__PURE__*/React.createElement("span", {
    className: "mts-step-dot"
  }, i < step ? /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }) : null), /*#__PURE__*/React.createElement("span", {
    className: "mts-step-text"
  }, s), /*#__PURE__*/React.createElement("span", {
    className: "mts-step-state"
  }, i < step ? "Done" : i === step ? "Working" : "")))))));
}
function MTSApp() {
  return /*#__PURE__*/React.createElement(ShellE, {
    solo: true,
    className: "mts-shell"
  }, /*#__PURE__*/React.createElement(MTSView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTSApp, null));
