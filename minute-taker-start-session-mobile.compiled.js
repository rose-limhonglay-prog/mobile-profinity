/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Start Session
   Step 1 of 2: pick the patient (vertical list, or a new patient), check the
   demographics + clinical snapshot, add an optional AI primer, confirm
   recording consent, then continue to the live session. Runs on window.PFMT.
   Classes prefixed mtssm-.
   =========================================================================== */
const {
  useState: useStateMTSSM
} = React;
const MTS = window.PFMT;
const {
  Ic: IcS,
  Avatar: AvatarS,
  TopBar: TopBarS,
  TextBtn: TextBtnS,
  Shell: ShellS
} = MTS;
const MTSSM_NEW = "__new__";

/* recency rank from the free-text lastVisit label — lower = more recent */
function mtssmRecency(label) {
  const s = String(label || "").toLowerCase();
  if (!s) return 9999;
  if (s === "today") return 0;
  if (s === "yesterday") return 1;
  const m = s.match(/(\d+)\s*(day|week|month|year)/);
  if (!m) return 9998;
  const n = +m[1];
  const u = m[2];
  return u === "day" ? n : u === "week" ? n * 7 : u === "month" ? n * 30 : n * 365;
}
const MTSSM_RECENT_MAX = 5;
function mtssmSplit(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return parts.length > 1 ? [parts[0], parts.slice(1).join(" ")] : [parts[0] || "", ""];
}
function MTSSMView() {
  const toast = MTS.useToast();
  const param = MTS.getParam("patient");
  const initial = param === MTSSM_NEW ? MTSSM_NEW : MTS.PATIENTS[param] ? param : param ? MTSSM_NEW : "Sarah Jenkins";
  const [selected, setSelected] = useStateMTSSM(initial);
  const isNew = selected === MTSSM_NEW;
  const base = isNew ? MTS.BLANK_PATIENT : MTS.PATIENTS[selected];
  const [form, setForm] = useStateMTSSM(() => {
    const [fn, ln] = mtssmSplit(isNew ? param && param !== MTSSM_NEW ? param : "" : selected);
    return {
      firstName: fn,
      lastName: ln,
      dob: base.dob,
      phone: base.phone
    };
  });
  const [primer, setPrimer] = useStateMTSSM(base.primer);
  const [useContext, setUseContext] = useStateMTSSM(true);
  const [consent, setConsent] = useStateMTSSM(false);
  const [query, setQuery] = useStateMTSSM("");

  // previous-meeting patients, most recent first; search widens to every patient on file
  const q = query.trim().toLowerCase();
  const recent = MTS.PATIENT_NAMES.slice().sort((a, b) => mtssmRecency(MTS.PATIENTS[a].lastVisit) - mtssmRecency(MTS.PATIENTS[b].lastVisit));
  const shown = q ? recent.filter(n => n.toLowerCase().includes(q) || String(MTS.PATIENTS[n].id).toLowerCase().includes(q)) : recent.slice(0, MTSSM_RECENT_MAX);
  const typedName = (form.firstName + " " + form.lastName).trim();
  const patientName = isNew ? typedName || "New patient" : selected;
  const firstName = isNew ? form.firstName.trim() || "the patient" : selected.split(" ")[0];
  function pick(value) {
    setSelected(value);
    const next = value === MTSSM_NEW ? MTS.BLANK_PATIENT : MTS.PATIENTS[value];
    const [fn, ln] = mtssmSplit(value === MTSSM_NEW ? "" : value);
    setForm({
      firstName: fn,
      lastName: ln,
      dob: next.dob,
      phone: next.phone
    });
    setPrimer(next.primer);
    setConsent(false);
  }
  function start() {
    if (!consent) {
      toast.show("Confirm the patient's consent first.");
      return;
    }
    MTS.saveCtx({
      patient: patientName,
      id: base.id,
      primer,
      useContext,
      isNewPatient: isNew,
      consentGiven: true,
      startedAt: Date.now()
    });
    MTS.go(MTS.routes.session + "?patient=" + encodeURIComponent(patientName));
  }
  const field = (key, label, extra) => /*#__PURE__*/React.createElement("label", {
    className: "mt-field"
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("input", {
    value: form[key],
    onChange: e => setForm({
      ...form,
      [key]: e.target.value
    }),
    ...extra
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-screen mtssm-screen"
  }, /*#__PURE__*/React.createElement(TopBarS, {
    left: /*#__PURE__*/React.createElement(TextBtnS, {
      onClick: () => MTS.go(MTS.routes.dashboard)
    }, "Cancel"),
    title: "New session",
    sub: "Step 1 of 2 · Patient & consent",
    right: /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mtssm-add" + (isNew ? " is-on" : ""),
      onClick: () => pick(MTSSM_NEW),
      "aria-pressed": isNew
    }, /*#__PURE__*/React.createElement(IcS, {
      name: "lucide:user-plus",
      size: 15
    }), "Add patient")
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-section-label"
  }, "Who is this session for?"), /*#__PURE__*/React.createElement("label", {
    className: "mtssm-search"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:search",
    size: 16
  }), /*#__PURE__*/React.createElement("input", {
    type: "search",
    value: query,
    placeholder: "Search patients by name or ID",
    onChange: e => setQuery(e.target.value),
    autoComplete: "off"
  }), query && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtssm-search-clear",
    onClick: () => setQuery(""),
    "aria-label": "Clear search"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:x",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-list-head"
  }, /*#__PURE__*/React.createElement("span", null, q ? shown.length ? shown.length + (shown.length === 1 ? " match" : " matches") : "No matches" : "Recent patients"), !q && /*#__PURE__*/React.createElement("span", {
    className: "mtssm-list-hint"
  }, "From previous meetings")), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-list",
    role: "list"
  }, isNew && /*#__PURE__*/React.createElement("div", {
    className: "mtssm-row mtssm-row-new is-on",
    role: "listitem",
    "aria-current": "true"
  }, /*#__PURE__*/React.createElement(AvatarS, {
    isNew: true,
    size: 40
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtssm-row-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtssm-row-name"
  }, typedName || "New patient"), /*#__PURE__*/React.createElement("span", {
    className: "mtssm-row-meta"
  }, "New record · fill in the details below")), /*#__PURE__*/React.createElement("span", {
    className: "mtssm-row-check",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:check",
    size: 13
  }))), shown.map(name => {
    const on = selected === name;
    const p = MTS.PATIENTS[name];
    return /*#__PURE__*/React.createElement("button", {
      key: name,
      type: "button",
      role: "listitem",
      className: "mtssm-row" + (on ? " is-on" : ""),
      onClick: () => pick(name),
      "aria-pressed": on
    }, /*#__PURE__*/React.createElement(AvatarS, {
      name: name,
      size: 40
    }), /*#__PURE__*/React.createElement("span", {
      className: "mtssm-row-text"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtssm-row-name"
    }, name), /*#__PURE__*/React.createElement("span", {
      className: "mtssm-row-meta"
    }, p.gender, " · ", p.age, " yrs · Last visit ", String(p.lastVisit).toLowerCase())), /*#__PURE__*/React.createElement("span", {
      className: "mtssm-row-check",
      "aria-hidden": "true"
    }, on && /*#__PURE__*/React.createElement(IcS, {
      name: "lucide:check",
      size: 13
    })));
  }), q && !shown.length && /*#__PURE__*/React.createElement("div", {
    className: "mtssm-empty"
  }, /*#__PURE__*/React.createElement("span", null, "No patient named “", query.trim(), "”."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-ghost",
    onClick: () => {
      pick(MTSSM_NEW);
      const [fn, ln] = mtssmSplit(query);
      setForm(f => ({
        ...f,
        firstName: fn,
        lastName: ln
      }));
      setQuery("");
    }
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:user-plus",
    size: 16
  }), "Add “", query.trim(), "”"))), /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtssm-details mt-fade-in",
    key: selected
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtssm-patient"
  }, /*#__PURE__*/React.createElement(AvatarS, {
    name: patientName,
    isNew: isNew && !typedName,
    tone: isNew ? "new" : undefined,
    size: 56
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtssm-patient-name"
  }, patientName), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-patient-meta"
  }, isNew ? "No prior visits on file" : base.gender + " · " + base.age + " yrs · " + base.id), !isNew && /*#__PURE__*/React.createElement("div", {
    className: "mtssm-patient-chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-pill mt-pill-muted"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:clock",
    size: 12
  }), "Last visit ", base.lastVisit), /*#__PURE__*/React.createElement("span", {
    className: "mt-pill mt-pill-muted"
  }, base.visits, " visits")))), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-part"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:id-card",
    size: 15
  })), "Demographics")), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-grid"
  }, field("firstName", "First name", {
    placeholder: "First"
  }), field("lastName", "Last name", {
    placeholder: "Last"
  }), field("dob", "Date of birth", {
    placeholder: "DD Mon YYYY"
  }), field("phone", "Phone", {
    placeholder: "07700 …",
    inputMode: "tel"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-part"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:heart-pulse",
    size: 15
  })), "Clinical snapshot")), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-snap-label"
  }, "Alerts & allergies"), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-pills"
  }, base.allergies.length === 0 && /*#__PURE__*/React.createElement("span", {
    className: "mt-pill mt-pill-muted"
  }, "Nothing on file"), base.allergies.map(a => a.severity ? /*#__PURE__*/React.createElement("span", {
    key: a.label,
    className: "mt-pill mt-pill-danger"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:triangle-alert",
    size: 12
  }), a.label, " · ", a.severity) : /*#__PURE__*/React.createElement("span", {
    key: a.label,
    className: "mt-pill mt-pill-muted"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:check",
    size: 12
  }), a.label))), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-snap-label"
  }, "Active conditions"), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-pills"
  }, base.conditions.length === 0 && /*#__PURE__*/React.createElement("span", {
    className: "mt-pill mt-pill-muted"
  }, "None on file"), base.conditions.map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    className: "mt-pill mt-pill-ok"
  }, c))))), /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtssm-primer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:sparkles",
    size: 15
  })), "AI session primer"), /*#__PURE__*/React.createElement("span", {
    className: "mtssm-optional"
  }, "Optional")), /*#__PURE__*/React.createElement("p", {
    className: "mt-hint"
  }, "Tell Minute Taker what this visit is about. It shapes what the note focuses on."), /*#__PURE__*/React.createElement("label", {
    className: "mt-field mtssm-primer-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    value: primer,
    placeholder: isNew ? "e.g. First consultation for skin concerns. Cover history, goals and expectations." : "",
    onChange: e => setPrimer(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-switch-row",
    onClick: () => setUseContext(v => !v),
    role: "switch",
    "aria-checked": useContext,
    tabIndex: 0,
    onKeyDown: e => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setUseContext(v => !v);
      }
    }
  }, /*#__PURE__*/React.createElement("span", null, "Use this context for the session"), /*#__PURE__*/React.createElement("span", {
    className: "mt-switch" + (useContext ? " is-on" : "")
  }))), /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtssm-consent" + (consent ? " is-on" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtssm-consent-btn",
    onClick: () => setConsent(v => !v),
    "aria-pressed": consent
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-check" + (consent ? " is-on" : "")
  }, consent && /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:check",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "mt-grow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtssm-consent-title"
  }, "Recording consent"), /*#__PURE__*/React.createElement("span", {
    className: "mtssm-consent-text"
  }, isNew ? "The patient" : firstName, " has been told this consultation will be recorded and transcribed, and agrees."))), /*#__PURE__*/React.createElement("div", {
    className: "mtssm-consent-foot"
  }, /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:shield-check",
    size: 14
  }), "Required before Minute Taker can listen. Audio is never stored.")), /*#__PURE__*/React.createElement("div", {
    className: "mt-spacer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-bottom"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-primary mt-btn-block",
    disabled: !consent,
    onClick: start
  }, "Continue to recording", /*#__PURE__*/React.createElement(IcS, {
    name: "lucide:arrow-right",
    size: 18
  })), /*#__PURE__*/React.createElement("p", {
    className: "mt-bottom-note"
  }, consent ? "Recording only starts when you tap the mic on the next screen." : "Confirm consent to continue.")), toast.node);
}
function MTSSMApp() {
  return /*#__PURE__*/React.createElement(ShellS, {
    label: "Start Session (mobile)"
  }, /*#__PURE__*/React.createElement(MTSSMView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTSSMApp, null));
