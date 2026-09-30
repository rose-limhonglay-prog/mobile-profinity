/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Clinical Note Review
   The AI-written note (SOAP / DAP / Summary) as editable lettered sections,
   the raw transcript behind a toggle, Discard (in-page sheet) and Save to
   EMR. Runs on window.PFMT. Classes prefixed mtnrm-.
   =========================================================================== */
const {
  useState: useStateMTNRM,
  useEffect: useEffectMTNRM
} = React;
const MTR = window.PFMT;
const {
  Ic: IcR,
  Avatar: AvatarR,
  TopBar: TopBarR,
  TextBtn: TextBtnR,
  Shell: ShellR
} = MTR;
const MTNRM_NOTES = {
  "Sarah Jenkins": {
    date: "Today",
    duration: "12m 40s",
    soap: {
      subjective: "Lower back pain has improved since the last adjustment. New complaint of afternoon tension headaches: dull ache across the forehead, no visual disturbances. Possible link with compensatory neck posture discussed.",
      objective: "Alert, cooperative, in no acute distress. Discussion focused on symptom history; no new examination findings recorded this visit.",
      assessment: "1. Low back pain: improving, responding to the current plan.\n2. New tension-type headaches: likely postural compensation; no red-flag features reported.",
      plan: "• Continue the current back-pain treatment plan.\n• Monitor headache frequency; ergonomic and postural assessment if persistent.\n• Follow up in 3 weeks, or sooner if symptoms worsen."
    },
    dap: {
      data: "Lower back pain improved since last adjustment. New afternoon tension headaches, dull frontal ache, no visual disturbances.",
      assessment: "Improving low back pain; new likely tension-type headache without red-flag features.",
      plan: "Continue back-pain plan; monitor headaches; postural review if persistent; follow up in 3 weeks."
    },
    summary: "Sarah's lower back pain continues to improve. She has noticed new afternoon tension headaches, likely linked to neck posture, with no visual disturbances. The plan is to continue the current treatment and monitor, with a follow-up in three weeks."
  },
  "Eleanor Vance": {
    date: "Today, 09:30",
    duration: "45m 10s",
    soap: {
      subjective: "Returns for review two weeks after the second session of the injectable series. Reports mild bruising over the left cheek that settled within five days. Very pleased with the softening of the nasolabial folds; asks about the marionette lines next.",
      objective: "Symmetry good at rest and on animation. No residual bruising or nodules on palpation. Photographs taken and compared with the baseline set.",
      assessment: "Expected post-treatment course, no complications. Result in line with the agreed plan.",
      plan: "• No further treatment today.\n• Discuss marionette-line options at the next visit with updated photographs.\n• Review in 6 weeks; contact the clinic sooner for swelling, asymmetry or pain."
    },
    dap: {
      data: "Two weeks post second injectable session. Mild bruising resolved in five days. Pleased with nasolabial result. Symmetry good; no nodules.",
      assessment: "Uncomplicated recovery; result as planned.",
      plan: "Review in 6 weeks; discuss marionette lines then; safety-net advice given."
    },
    summary: "Eleanor is recovering well after her second injectable session. Bruising settled quickly and she is happy with the result. No treatment today; marionette lines to be discussed at the six-week review."
  },
  "David Cho": {
    date: "Yesterday, 14:00",
    duration: "20m 05s",
    soap: {
      subjective: "Second session of the acne protocol. Reports less irritation than after session one and fewer new lesions over the past fortnight. Using the prescribed cleanser twice daily.",
      objective: "Reduced inflammatory lesions across the forehead and cheeks compared with the progress photographs. Mild dryness at the jawline, no post-inflammatory marks.",
      assessment: "Acne responding to the protocol; mild dryness from the topical regime.",
      plan: "• Continue the protocol; add a bland moisturiser at night.\n• Session three in 4 weeks with updated photographs."
    },
    dap: {
      data: "Session two of acne protocol. Less irritation, fewer new lesions. Mild jawline dryness.",
      assessment: "Responding well; mild dryness.",
      plan: "Continue; add night moisturiser; session three in 4 weeks."
    },
    summary: "David's acne is responding to the protocol with fewer new lesions and less irritation. Mild dryness at the jawline is being managed with a night moisturiser. Session three is booked in four weeks."
  },
  "_default": {
    date: "Today",
    duration: "14m 22s",
    soap: {
      subjective: "Presents for routine follow-up. Reports feeling generally well over the past three months. Denies chest pain or shortness of breath. Mentions occasional morning headaches.",
      objective: "BP 134/84 mmHg, HR 72 bpm, RR 16, Temp 36.9 °C. Alert and oriented. Regular heart rate and rhythm. Chest clear to auscultation.",
      assessment: "1. Essential hypertension: stable and reasonably well controlled.\n2. Occasional headaches: likely tension-type or mild caffeine withdrawal.",
      plan: "• Continue current medication, low-sodium diet and regular aerobic exercise.\n• Return to clinic in 6 months."
    },
    dap: {
      data: "BP 134/84, HR 72. Feeling well, no chest pain or SOB. Occasional morning headaches.",
      assessment: "Hypertension stable and well controlled. Headaches likely tension-type.",
      plan: "Continue current regimen with lifestyle measures. Return in 6 months."
    },
    summary: "Routine follow-up. Feeling well overall with occasional morning headaches. Blood pressure stable on the current regimen. Continue medication and lifestyle measures; recheck in six months."
  }
};
const MTNRM_TRANSCRIPTS = {
  "Sarah Jenkins": [{
    who: "clinician",
    t: "10:01",
    text: "Good morning, Sarah. How have you been feeling since our last adjustment?"
  }, {
    who: "patient",
    t: "10:01",
    text: "The lower back pain has improved, but I've been getting tension headaches in the afternoon."
  }, {
    who: "clinician",
    t: "10:02",
    text: "Tension headaches can relate to neck posture. Any visual disturbances?"
  }, {
    who: "patient",
    t: "10:03",
    text: "No, just a dull ache right across my forehead."
  }, {
    who: "clinician",
    t: "10:04",
    text: "Okay. Let's keep the current plan for your back and I'll add a posture check."
  }],
  "_default": [{
    who: "clinician",
    t: "00:15",
    text: "Good to see you again. How have you been?"
  }, {
    who: "patient",
    t: "00:22",
    text: "Doing pretty well, Dr Smith. Can't complain."
  }, {
    who: "clinician",
    t: "02:10",
    text: "Any chest pain, shortness of breath, or swelling in your legs?"
  }, {
    who: "patient",
    t: "02:18",
    text: "No, none of that."
  }]
};
const MTNRM_FORMATS = [{
  key: "soap",
  label: "SOAP"
}, {
  key: "dap",
  label: "DAP"
}, {
  key: "summary",
  label: "Summary"
}];
const MTNRM_FIELDS = {
  soap: [{
    key: "subjective",
    letter: "S",
    label: "Subjective",
    tone: "violet"
  }, {
    key: "objective",
    letter: "O",
    label: "Objective",
    tone: "teal"
  }, {
    key: "assessment",
    letter: "A",
    label: "Assessment",
    tone: "amber"
  }, {
    key: "plan",
    letter: "P",
    label: "Plan",
    tone: "green"
  }],
  dap: [{
    key: "data",
    letter: "D",
    label: "Data",
    tone: "violet"
  }, {
    key: "assessment",
    letter: "A",
    label: "Assessment",
    tone: "amber"
  }, {
    key: "plan",
    letter: "P",
    label: "Plan",
    tone: "green"
  }],
  summary: [{
    key: "summary",
    letter: "S",
    label: "Visit summary",
    tone: "violet"
  }]
};
function mtnrmWords(s) {
  return String(s || "").trim().split(/\s+/).filter(Boolean).length;
}
function MTNRMField({
  meta,
  value,
  onChange
}) {
  const ref = React.useRef(null);
  useEffectMTNRM(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };
    fit();
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);
  return /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtnrm-field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-field-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtnrm-letter mt-tone-" + meta.tone
  }, meta.letter), /*#__PURE__*/React.createElement("span", {
    className: "mtnrm-field-label"
  }, meta.label), /*#__PURE__*/React.createElement("span", {
    className: "mtnrm-count"
  }, mtnrmWords(value), " words")), /*#__PURE__*/React.createElement("textarea", {
    ref: ref,
    rows: 3,
    value: value,
    onChange: onChange,
    "aria-label": meta.label
  }));
}
function MTNRMView() {
  const toast = MTR.useToast();
  const ctx = MTR.loadCtx();
  const param = MTR.getParam("patient");
  const patient = param || ctx.patient || "Sarah Jenkins";
  const generated = MTR.getParam("generated") === "1";
  const p = MTR.PATIENTS[patient];
  const id = MTR.getParam("id") || p && p.id || ctx.id || "MT-00000";
  const record = MTNRM_NOTES[patient] || MTNRM_NOTES["_default"];
  const transcript = MTNRM_TRANSCRIPTS[patient] || MTNRM_TRANSCRIPTS["_default"];
  const duration = generated && ctx.durationSeconds ? MTR.fmtClock(ctx.durationSeconds, "words") : record.duration;
  const date = generated ? "Just now" : record.date;
  const [format, setFormat] = useStateMTNRM("soap");
  const [note, setNote] = useStateMTNRM({
    soap: {
      ...record.soap
    },
    dap: {
      ...record.dap
    },
    summary: {
      summary: record.summary
    }
  });
  const [showTranscript, setShowTranscript] = useStateMTNRM(false);
  const [confirmDiscard, setConfirmDiscard] = useStateMTNRM(false);
  const [saving, setSaving] = useStateMTNRM(false);
  function update(key, value) {
    setNote(n => ({
      ...n,
      [format]: {
        ...n[format],
        [key]: value
      }
    }));
  }
  function save() {
    if (saving) return;
    setSaving(true);
    toast.show("Saved to EMR", "ok");
    window.setTimeout(() => MTR.go(MTR.routes.dashboard), 1200);
  }
  const fields = MTNRM_FIELDS[format];
  const activeIndex = MTNRM_FORMATS.findIndex(f => f.key === format);
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-screen mtnrm-screen"
  }, /*#__PURE__*/React.createElement(TopBarR, {
    left: /*#__PURE__*/React.createElement(TextBtnR, {
      tone: "danger",
      onClick: () => setConfirmDiscard(true),
      disabled: saving
    }, "Discard"),
    title: "Clinical note",
    sub: generated ? "Review before saving" : date,
    right: /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mt-btn mt-btn-primary mt-btn-sm",
      onClick: save,
      disabled: saving
    }, /*#__PURE__*/React.createElement(IcR, {
      name: "lucide:check",
      size: 15
    }), "Save")
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "mtnrm-head mt-fade-in"
  }, /*#__PURE__*/React.createElement(AvatarR, {
    name: patient,
    size: 46
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-name"
  }, patient), /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-meta"
  }, id, " · ", duration, " · ", date))), /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-ai"
  }, /*#__PURE__*/React.createElement(IcR, {
    name: "lucide:sparkles",
    size: 13
  }), "AI-written from the live transcript. Edit anything before it reaches the chart."), /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-seg",
    role: "tablist",
    "aria-label": "Note format",
    style: {
      "--n": MTNRM_FORMATS.length,
      "--i": activeIndex
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtnrm-seg-thumb",
    "aria-hidden": "true"
  }), MTNRM_FORMATS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.key,
    type: "button",
    role: "tab",
    "aria-selected": format === f.key,
    className: "mtnrm-seg-btn" + (format === f.key ? " is-on" : ""),
    onClick: () => setFormat(f.key)
  }, f.label))), /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-fields",
    key: format
  }, fields.map(meta => /*#__PURE__*/React.createElement(MTNRMField, {
    key: meta.key,
    meta: meta,
    value: note[format][meta.key],
    onChange: e => update(meta.key, e.target.value)
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtnrm-transcript-toggle" + (showTranscript ? " is-open" : ""),
    onClick: () => setShowTranscript(v => !v),
    "aria-expanded": showTranscript
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcR, {
    name: "lucide:file-text",
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    className: "mt-grow"
  }, showTranscript ? "Hide transcript" : "View raw transcript", /*#__PURE__*/React.createElement("small", null, transcript.length, " turns · verbatim")), /*#__PURE__*/React.createElement(IcR, {
    name: showTranscript ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 18
  })), showTranscript && /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtnrm-transcript mt-fade-in"
  }, transcript.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mtnrm-turn " + l.who
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtnrm-turn-t"
  }, l.t), /*#__PURE__*/React.createElement("div", {
    className: "mt-grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-turn-who"
  }, l.who === "clinician" ? "You" : patient.split(" ")[0]), /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-turn-text"
  }, l.text))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcR, {
    name: "lucide:shield-check",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, "Saving writes this note to the patient's EMR record and clears the transcript from Minute Taker.")), /*#__PURE__*/React.createElement("div", {
    className: "mt-spacer"
  })), confirmDiscard && /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-scrim",
    onClick: () => setConfirmDiscard(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "mtnrm-discard-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtnrm-sheet-grab",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtnrm-sheet-icon"
  }, /*#__PURE__*/React.createElement(IcR, {
    name: "lucide:trash-2",
    size: 22
  })), /*#__PURE__*/React.createElement("h3", {
    id: "mtnrm-discard-title"
  }, "Discard this note?"), /*#__PURE__*/React.createElement("p", null, "The AI-written note and transcript for ", patient.split(" ")[0], " will be deleted. This can't be undone."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-danger mt-btn-block",
    onClick: () => MTR.go(MTR.routes.dashboard)
  }, "Discard note"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-ghost mt-btn-block",
    onClick: () => setConfirmDiscard(false)
  }, "Keep editing"))), toast.node);
}
function MTNRMApp() {
  return /*#__PURE__*/React.createElement(ShellR, {
    label: "Clinical Note Review (mobile)"
  }, /*#__PURE__*/React.createElement(MTNRMView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTNRMApp, null));
