/* ===========================================================================
   PROfinity — Minute Taker · Patient Context & Profile
   Pre-session priming: demographics, clinical snapshot alerts, editable AI
   session primer. PRD Screen 2 (Sec. 3.2 / MT-K02). New patients are created
   through the "New patient" modal (user, 2026-10-01), never inline.
   Classes prefixed mtp- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateMTP,
  useEffect: useEffectMTP,
  useRef: useRefMTP
} = React;
function goMTP(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function getParamMTP(name) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch (e) {
    return null;
  }
}
const MTP_PATIENTS = {
  "Sarah Jenkins": {
    id: "MT-84729",
    gender: "Female",
    age: 38,
    dob: "1985-04-12",
    phone: "(555) 123-4567",
    email: "s.jenkins@example.com",
    allergies: [{
      label: "Penicillin (Severe)",
      severe: true
    }, {
      label: "Latex (Mild)",
      severe: false
    }],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    primer: "Patient is following up on a recent knee arthroscopy (3 weeks post-op). Focus on pain levels, mobility improvements, and any signs of infection. Note any adjustments to physical therapy routine."
  },
  "Eleanor Vance": {
    id: "MT-77213",
    gender: "Female",
    age: 61,
    dob: "1965-03-02",
    phone: "(555) 234-8890",
    email: "e.vance@example.com",
    allergies: [{
      label: "NKDA",
      severe: false
    }],
    conditions: ["Osteoarthritis", "Hypothyroidism"],
    primer: "Follow-up on cosmetic injectable series. Assess symmetry, bruising, and overall patient satisfaction versus prior session."
  },
  "Marcus Thorne": {
    id: "MT-77198",
    gender: "Male",
    age: 45,
    dob: "1980-11-19",
    phone: "(555) 345-1122",
    email: "m.thorne@example.com",
    allergies: [{
      label: "Sulfa drugs (Moderate)",
      severe: true
    }],
    conditions: ["None on file"],
    primer: "New patient consultation for laser resurfacing. Discuss downtime expectations and post-procedure care."
  },
  "David Cho": {
    id: "MT-77042",
    gender: "Male",
    age: 29,
    dob: "1996-06-30",
    phone: "(555) 456-7788",
    email: "d.cho@example.com",
    allergies: [{
      label: "NKDA",
      severe: false
    }],
    conditions: ["Mild acne (ongoing)"],
    primer: "Second session of acne treatment protocol. Check for irritation and compare against progress photos."
  }
};
const MTP_PATIENT_NAMES = Object.keys(MTP_PATIENTS);
const MTP_NEW_KEY = "__new__";
const MTP_BLANK_PATIENT = {
  id: null,
  gender: "-",
  age: "-",
  dob: "",
  phone: "",
  email: "",
  allergies: [],
  conditions: [],
  primer: ""
};
const MTP_BLANK_DRAFT = {
  firstName: "",
  lastName: "",
  dob: "",
  phone: "",
  email: "",
  allergies: [],
  conditions: []
};
const MTP_SEVERITIES = ["Mild", "Moderate", "Severe"];
function mtpSaveContext(data) {
  try {
    sessionStorage.setItem("mtSession", JSON.stringify(data));
  } catch (e) {}
}
function mtpLoadContext() {
  try {
    return JSON.parse(sessionStorage.getItem("mtSession") || "{}");
  } catch (e) {
    return {};
  }
}

/* ------------------------------------------------------------- sidebar */
const MT_NAV = [{
  icon: "lucide:layout-grid",
  label: "Dashboard"
}, {
  icon: "lucide:users",
  label: "Patients"
}, {
  icon: "lucide:archive",
  label: "Archive"
}];
const MT_NAV_LINKS = {
  "Dashboard": "MinuteTakerDashboard.html",
  "Patients": "MinuteTakerPatientContext.html",
  "Archive": "MinuteTakerArchive.html"
};
function MTPSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "mtp-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-logo"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic",
    class: "mtp-logo-icon"
  }), /*#__PURE__*/React.createElement("span", null, "Minute Taker")), MT_NAV.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "mtp-navitem" + (item.label === "Patients" ? " is-active" : ""),
    type: "button",
    onClick: item.label !== "Patients" ? () => goMTP(MT_NAV_LINKS[item.label]) : undefined
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label))));
}
function MTPHeader() {
  return /*#__PURE__*/React.createElement("header", {
    className: "mtp-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtp-header-title"
  }, "Minute Taker"), /*#__PURE__*/React.createElement("div", {
    className: "mtp-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtp-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-user-name"
  }, "Dr. Katie Smith"), /*#__PURE__*/React.createElement("div", {
    className: "mtp-user-role"
  }, "Clinician")), /*#__PURE__*/React.createElement("img", {
    className: "mtp-user-avatar",
    src: "assets/avatar-katy.jpg",
    alt: "Dr. Katie Smith"
  }));
}

/* ---------------------------------------------------------------- toast */
function MTPToast({
  text
}) {
  if (!text) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "mtp-toast"
  }, text);
}

/* ----------------------------------------------------------------- view */
function mtpSplitName(name) {
  return name.split(" ").length > 1 ? [name.split(" ")[0], name.split(" ").slice(1).join(" ")] : [name, ""];
}
function MTPView() {
  const initialPatient = getParamMTP("patient") || "Sarah Jenkins";
  const [selectedPatient, setSelectedPatient] = useStateMTP(initialPatient);
  const isNewPatient = selectedPatient === MTP_NEW_KEY;
  const base = isNewPatient ? MTP_BLANK_PATIENT : MTP_PATIENTS[selectedPatient] || MTP_PATIENTS["Sarah Jenkins"];
  const [firstName, lastName] = mtpSplitName(isNewPatient ? "" : selectedPatient);
  const [form, setForm] = useStateMTP({
    firstName,
    lastName,
    dob: base.dob,
    phone: base.phone,
    email: base.email
  });
  const [primer, setPrimer] = useStateMTP(base.primer);
  const [useContext, setUseContext] = useStateMTP(true);
  const [consentGiven, setConsentGiven] = useStateMTP(false);
  const [toast, setToast] = useStateMTP(null);
  // "New patient" modal — null = closed, otherwise the draft being typed.
  // ?patient=__new__ (dashboard "New patient" row) opens it straight away.
  const [draft, setDraft] = useStateMTP(() => isNewPatient ? {
    ...MTP_BLANK_DRAFT,
    target: MTP_NEW_KEY
  } : null);
  // per-patient edits made through the details modal this visit (keyed by patient / __new__):
  // demographics live in `form`, the clinical snapshot lives here (user, 2026-10-02)
  const [edits, setEdits] = useStateMTP({});
  const snap = edits[selectedPatient] || base;
  const hasTypedName = !!(form.firstName.trim() || form.lastName.trim());
  const patientName = isNewPatient ? form.firstName.trim() || form.lastName.trim() ? (form.firstName + " " + form.lastName).trim() : "New Patient" : (form.firstName + " " + form.lastName).trim() || selectedPatient;

  /* details modal — "new" starts a blank record; "edit" opens the selected patient (new or on file) prefilled */
  function openNewPatient(prefill) {
    setDraft({
      ...MTP_BLANK_DRAFT,
      target: MTP_NEW_KEY,
      ...(prefill || {})
    });
  }
  function openEditPatient() {
    setDraft({
      ...MTP_BLANK_DRAFT,
      target: selectedPatient,
      ...form,
      allergies: snap.allergies.slice(),
      conditions: snap.conditions.slice()
    });
  }
  function cancelNewPatient() {
    setDraft(null);
    // backed out of a brand-new record with nothing typed → fall back to the first patient on file
    if (isNewPatient && !hasTypedName) handlePatientPick(MTP_PATIENT_NAMES[0]);
  }
  function confirmNewPatient() {
    if (!draft || !draft.firstName.trim()) return;
    const clean = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      dob: draft.dob.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim()
    };
    const editingExisting = draft.target !== MTP_NEW_KEY;
    const editingNew = !editingExisting && isNewPatient && hasTypedName;
    if (!editingExisting) setSelectedPatient(MTP_NEW_KEY);
    setForm(clean);
    setEdits(m => ({
      ...m,
      [draft.target]: {
        allergies: draft.allergies.slice(),
        conditions: draft.conditions.slice()
      }
    }));
    if (!editingExisting && !editingNew) {
      setPrimer("");
      setConsentGiven(false);
    }
    setDraft(null);
    flashToast(editingExisting || editingNew ? "Details updated." : (clean.firstName + " " + clean.lastName).trim() + " added as a new patient.");
  }
  function handlePatientPick(value) {
    if (value === MTP_NEW_KEY) {
      if (isNewPatient) openEditPatient();else openNewPatient();
      return;
    }
    setSelectedPatient(value);
    const next = value === MTP_NEW_KEY ? MTP_BLANK_PATIENT : MTP_PATIENTS[value] || MTP_BLANK_PATIENT;
    const [fn, ln] = mtpSplitName(value === MTP_NEW_KEY ? "" : value);
    setForm({
      firstName: fn,
      lastName: ln,
      dob: next.dob,
      phone: next.phone,
      email: next.email
    });
    setPrimer(next.primer);
    setConsentGiven(false);
  }
  function flashToast(msg) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }
  function saveDraft() {
    mtpSaveContext({
      patient: patientName,
      id: base.id,
      primer,
      useContext,
      isNewPatient
    });
    flashToast("Draft saved.");
  }
  function startSession() {
    if (!consentGiven) {
      flashToast("Please confirm patient consent before starting the session.");
      return;
    }
    mtpSaveContext({
      patient: patientName,
      id: base.id,
      primer,
      useContext,
      isNewPatient,
      consentGiven: true
    });
    goMTP("MinuteTakerSession.html?patient=" + encodeURIComponent(patientName));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mtp-view"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtp-back",
    onClick: () => goMTP("MinuteTakerDashboard.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), "Back"), /*#__PURE__*/React.createElement("div", {
    className: "mtp-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mtp-patient-idtag"
  }, isNewPatient ? "New Patient" : "ID: " + base.id), /*#__PURE__*/React.createElement("h1", null, "Start Session")), /*#__PURE__*/React.createElement("div", {
    className: "mtp-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mtp-btn mtp-btn-ghost",
    type: "button",
    onClick: saveDraft
  }, "Save Draft"), /*#__PURE__*/React.createElement("button", {
    className: "mtp-btn mtp-btn-primary",
    type: "button",
    disabled: !consentGiven,
    onClick: startSession
  }, "Start Session", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-right"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mtp-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-section-label"
  }, "Select Patient"), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "Patient"), /*#__PURE__*/React.createElement("select", {
    className: "mtp-select",
    value: selectedPatient,
    onChange: e => handlePatientPick(e.target.value)
  }, MTP_PATIENT_NAMES.map(name => /*#__PURE__*/React.createElement("option", {
    key: name,
    value: name
  }, name)), /*#__PURE__*/React.createElement("option", {
    value: MTP_NEW_KEY
  }, "+ New Patient"))), /*#__PURE__*/React.createElement("div", {
    className: "mtp-patient-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-patient-avatar"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: isNewPatient ? "lucide:user-plus" : "lucide:user"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mtp-patient-header-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-patient-name"
  }, patientName || "New Patient"), /*#__PURE__*/React.createElement("div", {
    className: "mtp-patient-meta"
  }, isNewPatient ? "No prior visits on file" : base.gender + ", " + base.age + " yrs")), /*#__PURE__*/React.createElement("button", {
    className: "mtp-btn mtp-btn-ghost mtp-btn-sm",
    type: "button",
    onClick: openEditPatient
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Edit")), /*#__PURE__*/React.createElement("div", {
    className: "mtp-section-label"
  }, "Demographics"), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "First Name"), /*#__PURE__*/React.createElement("input", {
    value: form.firstName,
    onChange: e => setForm({
      ...form,
      firstName: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "Last Name"), /*#__PURE__*/React.createElement("input", {
    value: form.lastName,
    onChange: e => setForm({
      ...form,
      lastName: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "Date of Birth"), /*#__PURE__*/React.createElement("input", {
    value: form.dob,
    onChange: e => setForm({
      ...form,
      dob: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "Phone"), /*#__PURE__*/React.createElement("input", {
    value: form.phone,
    onChange: e => setForm({
      ...form,
      phone: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "Email"), /*#__PURE__*/React.createElement("input", {
    value: form.email,
    onChange: e => setForm({
      ...form,
      email: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtp-side-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtp-card-title-text"
  }, "Clinical Snapshot"), /*#__PURE__*/React.createElement("div", {
    className: "mtp-card-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mtp-btn mtp-btn-ghost mtp-btn-sm",
    type: "button",
    onClick: openEditPatient
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Edit"), !isNewPatient && /*#__PURE__*/React.createElement("button", {
    className: "mtp-btn mtp-btn-ghost mtp-btn-sm",
    type: "button",
    onClick: () => flashToast("EHR sync requested.")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  }), "Sync EHR"))), /*#__PURE__*/React.createElement("div", {
    className: "mtp-snapshot-cols"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mtp-snapshot-label"
  }, "Alerts & Allergies"), /*#__PURE__*/React.createElement("div", {
    className: "mtp-pill-row"
  }, snap.allergies.length === 0 && /*#__PURE__*/React.createElement("span", {
    className: "mtp-pill mtp-pill-neutral"
  }, isNewPatient ? "Not recorded yet" : "No records on file"), snap.allergies.map(a => /*#__PURE__*/React.createElement("span", {
    key: a.label,
    className: "mtp-pill" + (a.severe || a.severity ? " mtp-pill-danger" : " mtp-pill-neutral")
  }, a.label, a.severity ? " (" + a.severity + ")" : "")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mtp-snapshot-label"
  }, "Active Conditions"), /*#__PURE__*/React.createElement("div", {
    className: "mtp-pill-row"
  }, snap.conditions.length === 0 && /*#__PURE__*/React.createElement("span", {
    className: "mtp-pill mtp-pill-neutral"
  }, isNewPatient ? "Not recorded yet" : "No records on file"), snap.conditions.map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    className: "mtp-pill mtp-pill-success"
  }, c)))))), /*#__PURE__*/React.createElement("div", {
    className: "mtp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtp-card-title-text"
  }, "AI Session Primer")), /*#__PURE__*/React.createElement("p", {
    className: "mtp-primer-hint"
  }, "Provide specific instructions or context for the AI before recording starts."), /*#__PURE__*/React.createElement("textarea", {
    className: "mtp-primer-box",
    rows: 5,
    value: primer,
    placeholder: isNewPatient ? "Add any context for the AI ahead of this first visit…" : "",
    onChange: e => setPrimer(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    className: "mtp-checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: useContext,
    onChange: e => setUseContext(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Use this context for the upcoming session"))), /*#__PURE__*/React.createElement("div", {
    className: "mtp-card mtp-consent-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtp-card-title-text"
  }, "Recording Consent")), /*#__PURE__*/React.createElement("p", {
    className: "mtp-primer-hint"
  }, "Minute Taker will listen in and transcribe this consultation to generate the clinical note. Confirm the patient has been informed and consents before starting."), /*#__PURE__*/React.createElement("label", {
    className: "mtp-checkbox mtp-consent-checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: consentGiven,
    onChange: e => setConsentGiven(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Patient has been informed and consents to this session being recorded and transcribed"))))), draft && /*#__PURE__*/React.createElement(MTPNewPatientModal, {
    draft: draft,
    setDraft: setDraft,
    mode: draft.target !== MTP_NEW_KEY ? "existing" : isNewPatient && hasTypedName ? "new-edit" : "new",
    onCancel: cancelNewPatient,
    onConfirm: confirmNewPatient
  }), /*#__PURE__*/React.createElement(MTPToast, {
    text: toast
  }));
}

/* chip-style list input used for the new-record clinical snapshot (user, 2026-10-02) */
function MTPTagInput({
  label,
  placeholder,
  tone,
  withSeverity,
  items,
  onChange,
  quick
}) {
  const [text, setText] = useStateMTP("");
  const [severity, setSeverity] = useStateMTP("Severe");
  const isObj = !!withSeverity;
  const keyOf = it => isObj ? it.label : it;
  const has = k => items.some(it => keyOf(it).toLowerCase() === k.toLowerCase());
  function add() {
    const v = text.trim();
    if (!v || has(v)) {
      setText("");
      return;
    }
    onChange(items.filter(it => !(isObj && it.label === "NKDA")).concat(isObj ? [{
      label: v,
      severity
    }] : [v]));
    setText("");
  }
  function remove(k) {
    onChange(items.filter(it => keyOf(it) !== k));
  }
  const quickOn = quick && has(keyOf(quick.value));
  return /*#__PURE__*/React.createElement("div", {
    className: "mtp-tags"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-tags-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "mtp-tags-row"
  }, /*#__PURE__*/React.createElement("input", {
    value: text,
    placeholder: placeholder,
    autoComplete: "off",
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") {
        e.preventDefault();
        add();
      }
    }
  }), withSeverity && /*#__PURE__*/React.createElement("select", {
    value: severity,
    onChange: e => setSeverity(e.target.value),
    "aria-label": "Severity"
  }, MTP_SEVERITIES.map(sv => /*#__PURE__*/React.createElement("option", {
    key: sv,
    value: sv
  }, sv))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtp-tags-add",
    onClick: add,
    disabled: !text.trim(),
    "aria-label": "Add " + label
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }))), (items.length > 0 || quick) && /*#__PURE__*/React.createElement("div", {
    className: "mtp-pill-row mtp-tags-pills"
  }, items.map(it => {
    const k = keyOf(it);
    const cls = isObj ? it.severity || it.severe ? "mtp-pill-danger" : "mtp-pill-neutral" : "mtp-pill-" + tone;
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      className: "mtp-pill " + cls
    }, k, isObj && it.severity ? " (" + it.severity + ")" : "", /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mtp-tag-x",
      onClick: () => remove(k),
      "aria-label": "Remove " + k
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:x"
    })));
  }), quick && !quickOn && items.length === 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtp-pill mtp-pill-neutral mtp-tag-quick",
    onClick: () => onChange([quick.value])
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), quick.label)));
}

/* "New patient" modal — the only place a new record gets created (user, 2026-10-01) */
function MTPNewPatientModal({
  draft,
  setDraft,
  mode,
  onCancel,
  onConfirm
}) {
  const editing = mode !== "new";
  const existing = mode === "existing";
  const firstRef = useRefMTP(null);
  useEffectMTP(() => {
    const t = setTimeout(() => {
      if (firstRef.current) firstRef.current.focus();
    }, 40);
    const onKey = e => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  const canSave = !!draft.firstName.trim();
  const set = key => e => setDraft({
    ...draft,
    [key]: e.target.value
  });
  const submit = e => {
    e.preventDefault();
    if (canSave) onConfirm();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mtp-modal-scrim",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("form", {
    className: "mtp-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "mtp-new-title",
    onClick: e => e.stopPropagation(),
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-modal-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtp-patient-avatar mtp-modal-avatar"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: existing ? "lucide:user" : "lucide:user-plus"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mtp-modal-head-text"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "mtp-new-title"
  }, editing ? "Edit patient details" : "New patient"), /*#__PURE__*/React.createElement("p", null, existing ? "Changes apply to " + draft.target.split(" ")[0] + "'s record for this session." : editing ? "Update the record for this first visit." : "Start a blank record for someone not yet on file.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtp-modal-x",
    onClick: onCancel,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtp-modal-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "First Name"), /*#__PURE__*/React.createElement("input", {
    ref: firstRef,
    value: draft.firstName,
    placeholder: "First",
    autoComplete: "off",
    onChange: set("firstName")
  })), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "Last Name"), /*#__PURE__*/React.createElement("input", {
    value: draft.lastName,
    placeholder: "Last",
    autoComplete: "off",
    onChange: set("lastName")
  })), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "Date of Birth"), /*#__PURE__*/React.createElement("input", {
    value: draft.dob,
    placeholder: "YYYY-MM-DD",
    autoComplete: "off",
    onChange: set("dob")
  })), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field"
  }, /*#__PURE__*/React.createElement("span", null, "Phone"), /*#__PURE__*/React.createElement("input", {
    value: draft.phone,
    placeholder: "(555) 000-0000",
    inputMode: "tel",
    autoComplete: "off",
    onChange: set("phone")
  })), /*#__PURE__*/React.createElement("label", {
    className: "mtp-field mtp-modal-span"
  }, /*#__PURE__*/React.createElement("span", null, "Email"), /*#__PURE__*/React.createElement("input", {
    value: draft.email,
    placeholder: "name@example.com",
    inputMode: "email",
    autoComplete: "off",
    onChange: set("email")
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtp-modal-sub"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:heart-pulse"
  }), "Clinical snapshot", /*#__PURE__*/React.createElement("span", null, "Optional")), /*#__PURE__*/React.createElement(MTPTagInput, {
    label: "Alerts & Allergies",
    placeholder: "e.g. Penicillin",
    tone: "danger",
    withSeverity: true,
    items: draft.allergies,
    onChange: allergies => setDraft({
      ...draft,
      allergies
    }),
    quick: {
      label: "No known allergies",
      value: {
        label: "NKDA"
      }
    }
  }), /*#__PURE__*/React.createElement(MTPTagInput, {
    label: "Active Conditions",
    placeholder: "e.g. Hypertension",
    tone: "success",
    items: draft.conditions,
    onChange: conditions => setDraft({
      ...draft,
      conditions
    })
  }), /*#__PURE__*/React.createElement("p", {
    className: "mtp-modal-note"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:info"
  }), "Anything you add here is shown as an alert during the session and in the note."), /*#__PURE__*/React.createElement("div", {
    className: "mtp-modal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtp-btn mtp-btn-ghost",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "mtp-btn mtp-btn-primary",
    disabled: !canSave
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: editing ? "lucide:check" : "lucide:user-plus"
  }), editing ? "Save details" : "Add patient"))));
}
function MTPApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mtp-shell"
  }, /*#__PURE__*/React.createElement(MTPSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "mtp-main"
  }, /*#__PURE__*/React.createElement(MTPHeader, null), /*#__PURE__*/React.createElement(MTPView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTPApp, null));
