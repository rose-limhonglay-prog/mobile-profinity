/* ===========================================================================
   PROfinity — Minute Taker · Active Session
   Live diarized recording interface: consent banner, running timer, streaming
   transcript, pause/resume, end-session → note generation.
   PRD Screen 4 (Sec. 3.4 / MT-K03, MT-K04, MT-K05).
   Classes prefixed mts- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateMTS,
  useEffect: useEffectMTS,
  useRef: useRefMTS
} = React;
function goMTS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function getParamMTS(name) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch (e) {
    return null;
  }
}
function mtsLoadContext() {
  try {
    return JSON.parse(sessionStorage.getItem("mtSession") || "{}");
  } catch (e) {
    return {};
  }
}
function mtsSaveContext(data) {
  try {
    sessionStorage.setItem("mtSession", JSON.stringify(data));
  } catch (e) {}
}
const MTS_PATIENT_META = {
  "Sarah Jenkins": {
    id: "MT-84729",
    dob: "12/05/1988"
  },
  "Eleanor Vance": {
    id: "MT-77213",
    dob: "03/02/1965"
  },
  "Marcus Thorne": {
    id: "MT-77198",
    dob: "11/19/1980"
  },
  "David Cho": {
    id: "MT-77042",
    dob: "06/30/1996"
  }
};
const MTS_META_FALLBACK = {
  id: "New Patient",
  dob: "\u2014"
};
const MTS_SCRIPT = [{
  who: "clinician",
  t: "10:01 AM",
  text: "Good morning, Sarah. I have the consent form marked as accepted. Before we begin, how have you been feeling since our last adjustment?"
}, {
  who: "patient",
  t: "10:01 AM",
  text: "Morning, Dr. Smith. Honestly, it's been a mixed bag. The lower back pain has definitely improved, but I've been getting these tension headaches in the afternoon."
}, {
  who: "clinician",
  t: "10:02 AM",
  edited: true,
  text: "I see. Tension headaches can sometimes be related to neck posture, especially if you've been compensating for the back pain. Let's make a note of that. Are the headaches accompanied by visual disturbances?"
}, {
  who: "patient",
  t: "10:03 AM",
  text: "No, nothing like that. Just a dull ache right across my forehead."
}];
function fmtClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return m + ":" + s;
}
function MTSView() {
  const ctx = mtsLoadContext();
  const patient = getParamMTS("patient") || ctx.patient || "Sarah Jenkins";
  const consentGiven = getParamMTS("consent") ? true : ctx.consentGiven !== undefined ? ctx.consentGiven : true;
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
    const id = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [started, paused, ending]);
  useEffectMTS(() => {
    if (!started || paused || ending || lineCount >= MTS_SCRIPT.length) return undefined;
    const id = window.setTimeout(() => setLineCount(c => c + 1), lineCount === 0 ? 1200 : 3400);
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
      mtsSaveContext({
        ...savedCtx,
        patient,
        consentGiven,
        durationSeconds: seconds,
        transcriptLines: lineCount
      });
      goMTS("MinuteTakerNoteReview.html?patient=" + encodeURIComponent(patient) + "&id=" + meta.id + "&generated=1");
    }, 1100);
  }
  function cancelSession() {
    goMTS("MinuteTakerDashboard.html");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mts-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-consent-banner"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle-2"
  }), consentGiven ? "Patient Consent Confirmed" : "Consent not on record — verify before recording"), /*#__PURE__*/React.createElement("div", {
    className: "mts-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-topline"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, started ? "Active Session" : "Ready to Start"), /*#__PURE__*/React.createElement("p", null, "Patient: ", patient, " \xA0·\xA0 ", meta.id === "New Patient" ? "New Patient" : "ID: " + meta.id, " \xA0·\xA0 DOB: ", meta.dob)), started && /*#__PURE__*/React.createElement("div", {
    className: "mts-rec-badge" + (paused ? " is-paused" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "mts-rec-dot"
  }), paused ? "PAUSED" : "REC", " ", fmtClock(seconds))), !started ? /*#__PURE__*/React.createElement("div", {
    className: "mts-ready-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-ready-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  })), /*#__PURE__*/React.createElement("h2", null, "Start recording when you're ready"), /*#__PURE__*/React.createElement("p", null, "Minute Taker will listen in, separate clinician from patient speech, and stream a live transcript below as you talk."), /*#__PURE__*/React.createElement("button", {
    className: "mts-btn mts-btn-primary mts-btn-start",
    type: "button",
    onClick: () => setStarted(true)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:circle"
  }), "Start Recording Session")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mts-live-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-orb" + (paused ? " is-paused" : ""),
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
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mts-live-caption"
  }, paused ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pause"
  }), "Paused · audio isn't being captured") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mts-live-dot"
  }), "Listening · diarising clinician and patient"))), /*#__PURE__*/React.createElement("div", {
    className: "mts-transcript",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-transcript-meta"
  }, "10:00 AM · Session started. Consent verified."), MTS_SCRIPT.slice(0, lineCount).map((line, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mts-bubble-row " + line.who
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-bubble " + line.who
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-bubble-head"
  }, line.who === "clinician" ? "Clinician" : "Patient", " (", line.t, ")", line.edited && /*#__PURE__*/React.createElement("span", {
    className: "mts-edited-tag"
  }, "[EDITED]")), /*#__PURE__*/React.createElement("div", {
    className: "mts-bubble-text"
  }, line.text)))), !paused && !ending && lineCount < MTS_SCRIPT.length && /*#__PURE__*/React.createElement("div", {
    className: "mts-transcript-meta mts-listening"
  }, "Transcribing…"))), /*#__PURE__*/React.createElement("div", {
    className: "mts-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mts-model-tag"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:cpu"
  }), "Transcribing with Medical Model v2.4"), /*#__PURE__*/React.createElement("div", {
    className: "mts-spacer"
  }), started && /*#__PURE__*/React.createElement("button", {
    className: "mts-btn mts-btn-ghost",
    type: "button",
    onClick: () => setPaused(p => !p),
    disabled: ending
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: paused ? "lucide:play" : "lucide:pause"
  }), paused ? "Resume" : "Pause"), started && /*#__PURE__*/React.createElement("button", {
    className: "mts-btn mts-btn-danger",
    type: "button",
    onClick: () => setConfirmEnd(true),
    disabled: ending
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:square"
  }), "End Session"), /*#__PURE__*/React.createElement("button", {
    className: "mts-cancel-link",
    type: "button",
    onClick: cancelSession,
    disabled: ending
  }, "Cancel Session"))), ending && /*#__PURE__*/React.createElement("div", {
    className: "mts-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-spinner"
  }), /*#__PURE__*/React.createElement("p", null, "Generating your structured note…")), started && confirmEnd && !ending && /*#__PURE__*/React.createElement("div", {
    className: "mts-confirm-scrim",
    onClick: () => setConfirmEnd(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mts-confirm",
    role: "alertdialog",
    "aria-modal": "true",
    "aria-labelledby": "mts-confirm-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mts-confirm-ic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:circle-stop"
  })), /*#__PURE__*/React.createElement("h3", {
    id: "mts-confirm-title"
  }, "End the Minute Taker session?"), /*#__PURE__*/React.createElement("p", null, "Minute Taker will stop listening and write up the note from the ", fmtClock(seconds), " recorded so far. You can review and edit it before anything is saved."), /*#__PURE__*/React.createElement("div", {
    className: "mts-confirm-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mts-btn mts-btn-ghost",
    type: "button",
    onClick: () => setConfirmEnd(false)
  }, "Keep recording"), /*#__PURE__*/React.createElement("button", {
    className: "mts-btn mts-btn-danger",
    type: "button",
    onClick: endSession
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "End and write note")))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTSView, null));
