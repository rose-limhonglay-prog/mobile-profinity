/* ===========================================================================
   PROfinity — Minute Taker (web) · Clinical Note Review
   Web twin of MinuteTakerNoteReviewMobile (minute-taker-note-review-mobile.jsx):
   the AI-written note (Assessment [SOAP] / Data [DAP] / Summary) as editable
   lettered sections, the kept session recording + raw transcript beside it,
   Share (email / text / apps). The note saves automatically (user,
   2026-10-14): no Save / Discard, the recording leads the note column.
   Runs on window.PFMTW. Classes prefixed mtn-.
   =========================================================================== */
const {
  useState: useStateMTN,
  useEffect: useEffectMTN,
  useMemo: useMemoMTN
} = React;
const MTR = window.PFMTW;
const {
  Avatar: AvatarR,
  Seg: SegR,
  Shell: ShellR
} = MTR;
const MTN_NOTES = {
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
const MTN_TRANSCRIPTS = {
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
const MTN_FORMATS = [{
  key: "soap",
  label: "Assessment"
}, {
  key: "dap",
  label: "Data"
}, {
  key: "summary",
  label: "Summary"
}];
const MTN_FIELDS = {
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

/* lettered section with an auto-fitting textarea (twin of the mobile MTNRMField) */
function MTNField({
  meta,
  value,
  onChange,
  edited
}) {
  const ref = React.useRef(null);
  useEffectMTN(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };
    fit();
    const raf = requestAnimationFrame(fit);
    const late = window.setTimeout(fit, 350);
    window.addEventListener("resize", fit);
    window.addEventListener("load", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", fit);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
      window.removeEventListener("resize", fit);
      window.removeEventListener("load", fit);
      if (document.fonts && document.fonts.removeEventListener) document.fonts.removeEventListener("loadingdone", fit);
    };
  }, [value]);
  return /*#__PURE__*/React.createElement("div", {
    className: "mtn-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtn-sec-rail",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtn-letter mtw-tone-" + meta.tone
  }, meta.letter), /*#__PURE__*/React.createElement("i", {
    className: "mtn-sec-line"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mtn-sec-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtn-sec-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtn-field-label"
  }, meta.label), edited && /*#__PURE__*/React.createElement("span", {
    className: "mtw-pill mtw-pill-warn"
  }, "Edited")), /*#__PURE__*/React.createElement("textarea", {
    ref: ref,
    rows: 2,
    value: value,
    onChange: onChange,
    "aria-label": meta.label
  })));
}
function MTNView() {
  const toast = MTR.useToast();
  const ctx = MTR.loadCtx();
  const param = MTR.getParam("patient");
  const patient = param || ctx.patient || "Sarah Jenkins";
  const first = patient.split(" ")[0];
  const generated = MTR.getParam("generated") === "1";
  const p = MTR.PATIENTS[patient];
  const id = MTR.getParam("id") || p && p.id || ctx.id || "MT-00000";
  const record = MTN_NOTES[patient] || MTN_NOTES["_default"];
  const transcript = MTN_TRANSCRIPTS[patient] || MTN_TRANSCRIPTS["_default"];
  const duration = generated && ctx.durationSeconds ? MTR.fmtClock(ctx.durationSeconds, "words") : record.duration;
  const date = generated ? "Just now" : record.date;
  const original = {
    soap: {
      ...record.soap
    },
    dap: {
      ...record.dap
    },
    summary: {
      summary: record.summary
    }
  };
  const [format, setFormat] = useStateMTN("soap");
  const [note, setNote] = useStateMTN(() => ({
    soap: {
      ...record.soap
    },
    dap: {
      ...record.dap
    },
    summary: {
      summary: record.summary
    }
  }));
  const [search, setSearch] = useStateMTN("");
  /* ?share=1 opens the share modal straight away (demo / screenshots) */
  const [sharing, setSharing] = useStateMTN(MTR.getParam("share") === "1");
  const filtered = useMemoMTN(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transcript;
    return transcript.filter(l => l.text.toLowerCase().includes(q) || (l.who === "clinician" ? "you" : first.toLowerCase()).includes(q));
  }, [search, transcript, first]);
  function update(key, value) {
    setNote(n => ({
      ...n,
      [format]: {
        ...n[format],
        [key]: value
      }
    }));
  }
  const fields = MTN_FIELDS[format];
  const formatLabel = MTN_FORMATS.find(f => f.key === format).label;
  const formatEdited = JSON.stringify(note[format]) !== JSON.stringify(original[format]);
  return /*#__PURE__*/React.createElement("div", {
    className: "mtw-view mtn-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtn-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-crumb",
    onClick: () => MTR.go(MTR.routes.dashboard)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), "Dashboard"), /*#__PURE__*/React.createElement("div", {
    className: "mtn-head-row"
  }, /*#__PURE__*/React.createElement(AvatarR, {
    name: patient,
    size: 52
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtw-grow"
  }, /*#__PURE__*/React.createElement("h1", null, patient), /*#__PURE__*/React.createElement("p", null, id, " · ", duration, " · ", date)))), /*#__PURE__*/React.createElement("div", {
    className: "mtw-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-btn mtw-btn-ghost",
    onClick: () => setSharing(true),
    "aria-haspopup": "dialog"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:share-2"
  }), "Share"), /*#__PURE__*/React.createElement("span", {
    className: "mtn-autosave"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), "Saved automatically"))), /*#__PURE__*/React.createElement("div", {
    className: "mtw-grid mtn-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtn-ai"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sparkles"
  }), "AI-written from the live transcript. Edit anything — changes save automatically."), /*#__PURE__*/React.createElement(MTNRecording, {
    seconds: generated && ctx.durationSeconds ? ctx.durationSeconds : mtnSeconds(record.duration),
    patient: patient,
    date: date,
    onToast: m => toast.show(m)
  }), /*#__PURE__*/React.createElement(SegR, {
    items: MTN_FORMATS,
    value: format,
    onChange: setFormat,
    label: "Note format"
  }), /*#__PURE__*/React.createElement("section", {
    className: "mtw-card mtn-note mtw-fade-in",
    key: format,
    "aria-label": "Clinical note sections"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtn-note-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtn-note-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sparkles"
  }), formatLabel, " note"), formatEdited && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-link",
    onClick: () => setNote(n => ({
      ...n,
      [format]: {
        ...original[format]
      }
    }))
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:rotate-ccw"
  }), "Reset to the AI draft")), fields.map(meta => /*#__PURE__*/React.createElement(MTNField, {
    key: meta.key,
    meta: meta,
    value: note[format][meta.key],
    edited: note[format][meta.key] !== original[format][meta.key],
    onChange: e => update(meta.key, e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtw-trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:shield-check"
  })), /*#__PURE__*/React.createElement("span", null, "This note saves automatically to the patient's EMR record. The transcript and recording stay with it for 30 days."))), /*#__PURE__*/React.createElement("div", {
    className: "mtw-col"
  }, /*#__PURE__*/React.createElement("section", {
    className: "mtw-card mtn-transcript mtw-sticky"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:file-text"
  })), "Raw transcript"), /*#__PURE__*/React.createElement("span", {
    className: "mtn-transcript-meta"
  }, transcript.length, " turns · verbatim")), /*#__PURE__*/React.createElement("div", {
    className: "mtw-search mtn-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    className: "mtw-input",
    placeholder: "Search the transcript…",
    value: search,
    onChange: e => setSearch(e.target.value)
  }), search && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-search-clear",
    "aria-label": "Clear search",
    onClick: () => setSearch("")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtn-turns"
  }, filtered.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mtn-turn " + l.who
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtn-turn-t"
  }, l.t), /*#__PURE__*/React.createElement("div", {
    className: "mtw-grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtn-turn-who"
  }, l.who === "clinician" ? "You" : first), /*#__PURE__*/React.createElement("div", {
    className: "mtn-turn-text"
  }, l.text)))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mtn-transcript-empty"
  }, "No matches in the transcript."))))), sharing && window.PFMTShare && /*#__PURE__*/React.createElement(window.PFMTShare.Share, {
    variant: "modal",
    patient: patient,
    id: id,
    hasRecording: true,
    note: {
      type: record.type || "Clinical note",
      date,
      duration
    },
    onClose: () => setSharing(false),
    onToast: (m, t) => toast.show(m, t)
  }), toast.node);
}

/* session recording, kept with the note (user, 2026-10-14): simulated player with play/pause, scrubbable bar and a download */
function mtnSeconds(label) {
  const m = /(\d+)m/.exec(label || ""),
    sec = /(\d+)s/.exec(label || "");
  return (m ? +m[1] * 60 : 0) + (sec ? +sec[1] : 0) || 754;
}
function mtnClock(s) {
  s = Math.max(0, Math.round(s));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}
const MTN_BARS = Array.from({
  length: 56
}, (_, i) => 22 + Math.round(60 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23))));
function MTNRecording({
  seconds,
  patient,
  date,
  onToast
}) {
  const [playing, setPlaying] = useStateMTN(false);
  const [pos, setPos] = useStateMTN(0);
  useEffectMTN(() => {
    if (!playing) return undefined;
    const t = window.setInterval(() => setPos(p => {
      if (p + 1 >= seconds) {
        setPlaying(false);
        return seconds;
      }
      return p + 1;
    }), 1000);
    return () => window.clearInterval(t);
  }, [playing, seconds]);
  const pct = seconds ? Math.min(100, pos / seconds * 100) : 0;
  function seek(e) {
    const r = e.currentTarget.getBoundingClientRect();
    setPos(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * seconds));
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "mtw-card mtn-rec",
    "aria-label": "Session recording"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  })), "Session recording"), /*#__PURE__*/React.createElement("span", {
    className: "mtw-pill mtw-pill-ok"
  }, "Kept 30 days")), /*#__PURE__*/React.createElement("div", {
    className: "mtn-rec-player"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtn-rec-play" + (playing ? " is-on" : ""),
    onClick: () => {
      if (pos >= seconds) setPos(0);
      setPlaying(v => !v);
    },
    "aria-label": playing ? "Pause" : "Play"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: playing ? "lucide:pause" : "lucide:play"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mtn-rec-track",
    role: "slider",
    "aria-label": "Position",
    "aria-valuemin": 0,
    "aria-valuemax": seconds,
    "aria-valuenow": pos,
    tabIndex: 0,
    onClick: seek,
    onKeyDown: e => {
      if (e.key === "ArrowRight") setPos(p => Math.min(seconds, p + 15));
      if (e.key === "ArrowLeft") setPos(p => Math.max(0, p - 15));
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtn-rec-bars",
    "aria-hidden": "true",
    style: {
      "--pct": pct + "%"
    }
  }, MTN_BARS.map((h, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: h + "%"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtn-rec-times"
  }, /*#__PURE__*/React.createElement("span", null, mtnClock(pos)), /*#__PURE__*/React.createElement("span", null, mtnClock(seconds))))), /*#__PURE__*/React.createElement("div", {
    className: "mtn-rec-foot"
  }, /*#__PURE__*/React.createElement("span", null, patient.split(" ")[0], " · ", date), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-link",
    onClick: () => onToast("Downloading the recording…")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:download"
  }), "Download audio")));
}
function MTNApp() {
  return /*#__PURE__*/React.createElement(ShellR, {
    active: "Dashboard",
    title: "Clinical note",
    sub: "Minute Taker"
  }, /*#__PURE__*/React.createElement(MTNView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTNApp, null));
