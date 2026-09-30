/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Start Session
   Step 1 of 2: pick the patient (vertical list, or a new patient), check the
   demographics + clinical snapshot, add an optional AI primer, confirm
   recording consent, then continue to the live session. Runs on window.PFMT.
   Classes prefixed mtssm-.
   =========================================================================== */
const { useState: useStateMTSSM } = React;
const MTS = window.PFMT;
const { Ic: IcS, Avatar: AvatarS, TopBar: TopBarS, TextBtn: TextBtnS, Shell: ShellS } = MTS;
const MTSSM_NEW = "__new__";

/* recency rank from the free-text lastVisit label — lower = more recent */
function mtssmRecency(label) {
  const s = String(label || "").toLowerCase();
  if (!s) return 9999;
  if (s === "today") return 0;
  if (s === "yesterday") return 1;
  const m = s.match(/(\d+)\s*(day|week|month|year)/);
  if (!m) return 9998;
  const n = +m[1]; const u = m[2];
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
  const initial = param === MTSSM_NEW ? MTSSM_NEW : (MTS.PATIENTS[param] ? param : (param ? MTSSM_NEW : "Sarah Jenkins"));
  const [selected, setSelected] = useStateMTSSM(initial);
  const isNew = selected === MTSSM_NEW;
  const base = isNew ? MTS.BLANK_PATIENT : MTS.PATIENTS[selected];

  const [form, setForm] = useStateMTSSM(() => {
    const [fn, ln] = mtssmSplit(isNew ? (param && param !== MTSSM_NEW ? param : "") : selected);
    return { firstName: fn, lastName: ln, dob: base.dob, phone: base.phone };
  });
  const [primer, setPrimer] = useStateMTSSM(base.primer);
  const [useContext, setUseContext] = useStateMTSSM(true);
  const [consent, setConsent] = useStateMTSSM(false);
  const [query, setQuery] = useStateMTSSM("");

  // previous-meeting patients, most recent first; search widens to every patient on file
  const q = query.trim().toLowerCase();
  const recent = MTS.PATIENT_NAMES.slice().sort((a, b) => mtssmRecency(MTS.PATIENTS[a].lastVisit) - mtssmRecency(MTS.PATIENTS[b].lastVisit));
  const shown = q
    ? recent.filter((n) => n.toLowerCase().includes(q) || String(MTS.PATIENTS[n].id).toLowerCase().includes(q))
    : recent.slice(0, MTSSM_RECENT_MAX);

  const typedName = (form.firstName + " " + form.lastName).trim();
  const patientName = isNew ? (typedName || "New patient") : selected;
  const firstName = isNew ? (form.firstName.trim() || "the patient") : selected.split(" ")[0];

  function pick(value) {
    setSelected(value);
    const next = value === MTSSM_NEW ? MTS.BLANK_PATIENT : MTS.PATIENTS[value];
    const [fn, ln] = mtssmSplit(value === MTSSM_NEW ? "" : value);
    setForm({ firstName: fn, lastName: ln, dob: next.dob, phone: next.phone });
    setPrimer(next.primer);
    setConsent(false);
  }

  function start() {
    if (!consent) { toast.show("Confirm the patient's consent first."); return; }
    MTS.saveCtx({ patient: patientName, id: base.id, primer, useContext, isNewPatient: isNew, consentGiven: true, startedAt: Date.now() });
    MTS.go(MTS.routes.session + "?patient=" + encodeURIComponent(patientName));
  }

  const field = (key, label, extra) => (
    <label className="mt-field">
      <span>{label}</span>
      <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...extra} />
    </label>
  );

  return (
    <div className="mt-screen mtssm-screen">
      <TopBarS
        left={<TextBtnS onClick={() => MTS.go(MTS.routes.dashboard)}>Cancel</TextBtnS>}
        title="New session"
        sub="Step 1 of 2 · Patient & consent"
        right={
          <button type="button" className={"mtssm-add" + (isNew ? " is-on" : "")} onClick={() => pick(MTSSM_NEW)} aria-pressed={isNew}>
            <IcS name="lucide:user-plus" size={15} />Add patient
          </button>
        }
      />

      <div className="mt-scroll">
        <div className="mt-section-label">Who is this session for?</div>
        <label className="mtssm-search">
          <IcS name="lucide:search" size={16} />
          <input type="search" value={query} placeholder="Search patients by name or ID" onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
          {query && <button type="button" className="mtssm-search-clear" onClick={() => setQuery("")} aria-label="Clear search"><IcS name="lucide:x" size={14} /></button>}
        </label>
        <div className="mtssm-list-head">
          <span>{q ? (shown.length ? shown.length + (shown.length === 1 ? " match" : " matches") : "No matches") : "Recent patients"}</span>
          {!q && <span className="mtssm-list-hint">From previous meetings</span>}
        </div>
        <div className="mtssm-list" role="list">
          {isNew && (
            <div className="mtssm-row mtssm-row-new is-on" role="listitem" aria-current="true">
              <AvatarS isNew size={40} />
              <span className="mtssm-row-text">
                <span className="mtssm-row-name">{typedName || "New patient"}</span>
                <span className="mtssm-row-meta">New record · fill in the details below</span>
              </span>
              <span className="mtssm-row-check" aria-hidden="true"><IcS name="lucide:check" size={13} /></span>
            </div>
          )}
          {shown.map((name) => {
            const on = selected === name;
            const p = MTS.PATIENTS[name];
            return (
              <button key={name} type="button" role="listitem" className={"mtssm-row" + (on ? " is-on" : "")} onClick={() => pick(name)} aria-pressed={on}>
                <AvatarS name={name} size={40} />
                <span className="mtssm-row-text">
                  <span className="mtssm-row-name">{name}</span>
                  <span className="mtssm-row-meta">{p.gender} · {p.age} yrs · Last visit {String(p.lastVisit).toLowerCase()}</span>
                </span>
                <span className="mtssm-row-check" aria-hidden="true">{on && <IcS name="lucide:check" size={13} />}</span>
              </button>
            );
          })}
          {q && !shown.length && (
            <div className="mtssm-empty">
              <span>No patient named “{query.trim()}”.</span>
              <button type="button" className="mt-btn mt-btn-ghost" onClick={() => { pick(MTSSM_NEW); const [fn, ln] = mtssmSplit(query); setForm((f) => ({ ...f, firstName: fn, lastName: ln })); setQuery(""); }}>
                <IcS name="lucide:user-plus" size={16} />Add “{query.trim()}”
              </button>
            </div>
          )}
        </div>

        {/* selected patient — summary, demographics and clinical snapshot in one container (user, 2026-09-30) */}
        <section className="mt-card mtssm-details mt-fade-in" key={selected}>
          <div className="mtssm-patient">
            <AvatarS name={patientName} isNew={isNew && !typedName} tone={isNew ? "new" : undefined} size={56} />
            <div className="mt-grow">
              <div className="mtssm-patient-name">{patientName}</div>
              <div className="mtssm-patient-meta">{isNew ? "No prior visits on file" : base.gender + " · " + base.age + " yrs · " + base.id}</div>
              {!isNew && (
                <div className="mtssm-patient-chips">
                  <span className="mt-pill mt-pill-muted"><IcS name="lucide:clock" size={12} />Last visit {base.lastVisit}</span>
                  <span className="mt-pill mt-pill-muted">{base.visits} visits</span>
                </div>
              )}
            </div>
          </div>

          <div className="mtssm-part">
            <div className="mt-card-head">
              <span className="mt-card-title"><span className="mt-ti"><IcS name="lucide:id-card" size={15} /></span>Demographics</span>
            </div>
            <div className="mtssm-grid">
              {field("firstName", "First name", { placeholder: "First" })}
              {field("lastName", "Last name", { placeholder: "Last" })}
              {field("dob", "Date of birth", { placeholder: "DD Mon YYYY" })}
              {field("phone", "Phone", { placeholder: "07700 …", inputMode: "tel" })}
            </div>
          </div>

          <div className="mtssm-part">
            <div className="mt-card-head">
              <span className="mt-card-title"><span className="mt-ti"><IcS name="lucide:heart-pulse" size={15} /></span>Clinical snapshot</span>
            </div>
            <div className="mtssm-snap-label">Alerts & allergies</div>
            <div className="mtssm-pills">
              {base.allergies.length === 0 && <span className="mt-pill mt-pill-muted">Nothing on file</span>}
              {base.allergies.map((a) => a.severity
                ? <span key={a.label} className="mt-pill mt-pill-danger"><IcS name="lucide:triangle-alert" size={12} />{a.label} · {a.severity}</span>
                : <span key={a.label} className="mt-pill mt-pill-muted"><IcS name="lucide:check" size={12} />{a.label}</span>)}
            </div>
            <div className="mtssm-snap-label">Active conditions</div>
            <div className="mtssm-pills">
              {base.conditions.length === 0 && <span className="mt-pill mt-pill-muted">None on file</span>}
              {base.conditions.map((c) => <span key={c} className="mt-pill mt-pill-ok">{c}</span>)}
            </div>
          </div>
        </section>

        <section className="mt-card mtssm-primer">
          <div className="mt-card-head">
            <span className="mt-card-title"><span className="mt-ti"><IcS name="lucide:sparkles" size={15} /></span>AI session primer</span>
            <span className="mtssm-optional">Optional</span>
          </div>
          <p className="mt-hint">Tell Minute Taker what this visit is about. It shapes what the note focuses on.</p>
          <label className="mt-field mtssm-primer-field">
            <textarea rows={4} value={primer} placeholder={isNew ? "e.g. First consultation for skin concerns. Cover history, goals and expectations." : ""} onChange={(e) => setPrimer(e.target.value)} />
          </label>
          <div className="mt-switch-row" onClick={() => setUseContext((v) => !v)} role="switch" aria-checked={useContext} tabIndex={0}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setUseContext((v) => !v); } }}>
            <span>Use this context for the session</span>
            <span className={"mt-switch" + (useContext ? " is-on" : "")} />
          </div>
        </section>

        <section className={"mt-card mtssm-consent" + (consent ? " is-on" : "")}>
          <button type="button" className="mtssm-consent-btn" onClick={() => setConsent((v) => !v)} aria-pressed={consent}>
            <span className={"mt-check" + (consent ? " is-on" : "")}>{consent && <IcS name="lucide:check" size={16} />}</span>
            <span className="mt-grow">
              <span className="mtssm-consent-title">Recording consent</span>
              <span className="mtssm-consent-text">{isNew ? "The patient" : firstName} has been told this consultation will be recorded and transcribed, and agrees.</span>
            </span>
          </button>
          <div className="mtssm-consent-foot"><IcS name="lucide:shield-check" size={14} />Required before Minute Taker can listen. Audio is never stored.</div>
        </section>
        <div className="mt-spacer" />
      </div>

      <div className="mt-bottom">
        <button type="button" className="mt-btn mt-btn-primary mt-btn-block" disabled={!consent} onClick={start}>
          Continue to recording<IcS name="lucide:arrow-right" size={18} />
        </button>
        <p className="mt-bottom-note">{consent ? "Recording only starts when you tap the mic on the next screen." : "Confirm consent to continue."}</p>
      </div>
      {toast.node}
    </div>
  );
}

function MTSSMApp() {
  return <ShellS label="Start Session (mobile)"><MTSSMView /></ShellS>;
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTSSMApp />);
