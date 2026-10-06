/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Start Session
   Step 1 of 2: pick the patient (vertical list, or add a new one through the
   "New patient" sheet — user, 2026-10-01), check the demographics + clinical
   snapshot, add an optional AI primer, confirm recording consent, then
   continue to the live session. Runs on window.PFMT.
   Classes prefixed mtssm-.
   =========================================================================== */
const { useState: useStateMTSSM, useEffect: useEffectMTSSM, useRef: useRefMTSSM } = React;
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
  // "New patient" sheet — null = closed, otherwise the draft being typed. Deep links
  // (?patient=__new__ or an unknown name) open it straight away, prefilled.
  const [draft, setDraft] = useStateMTSSM(() => {
    if (!isNew) return null;
    const [fn, ln] = mtssmSplit(param && param !== MTSSM_NEW ? param : "");
    return { target: MTSSM_NEW, firstName: fn, lastName: ln, dob: "", phone: "", allergies: [], conditions: [] };
  });
  // per-patient edits made through the details sheet this visit (keyed by patient / __new__):
  // demographics live in `form`, the clinical snapshot lives here (user, 2026-10-02)
  const [edits, setEdits] = useStateMTSSM({});
  const snap = edits[selected] || base;

  // previous-meeting patients, most recent first; search widens to every patient on file
  const q = query.trim().toLowerCase();
  const recent = MTS.PATIENT_NAMES.slice().sort((a, b) => mtssmRecency(MTS.PATIENTS[a].lastVisit) - mtssmRecency(MTS.PATIENTS[b].lastVisit));
  const shown = q
    ? recent.filter((n) => n.toLowerCase().includes(q) || String(MTS.PATIENTS[n].id).toLowerCase().includes(q))
    : recent.slice(0, MTSSM_RECENT_MAX);

  const typedName = (form.firstName + " " + form.lastName).trim();
  const patientName = isNew ? (typedName || "New patient") : (typedName || selected);
  const firstName = form.firstName.trim() || (isNew ? "the patient" : selected.split(" ")[0]);

  function pick(value) {
    setSelected(value);
    const next = value === MTSSM_NEW ? MTS.BLANK_PATIENT : MTS.PATIENTS[value];
    const [fn, ln] = mtssmSplit(value === MTSSM_NEW ? "" : value);
    setForm({ firstName: fn, lastName: ln, dob: next.dob, phone: next.phone });
    setPrimer(next.primer);
    setConsent(false);
  }

  /* details sheet — "add" starts a blank record; "edit" opens the selected patient (new or on file) prefilled */
  function openAdd(prefill) {
    setDraft({ target: MTSSM_NEW, firstName: "", lastName: "", dob: "", phone: "", allergies: [], conditions: [], ...(prefill || {}) });
  }
  function openEdit() {
    setDraft({ target: selected, ...form, allergies: snap.allergies.slice(), conditions: snap.conditions.slice() });
  }
  function cancelAdd() {
    setDraft(null);
    // backed out of a brand-new record with nothing typed → fall back to the most recent patient
    if (isNew && !typedName) pick(recent[0]);
  }
  function confirmAdd() {
    if (!draft || !draft.firstName.trim()) return;
    const clean = { firstName: draft.firstName.trim(), lastName: draft.lastName.trim(), dob: draft.dob.trim(), phone: draft.phone.trim() };
    const snapshot = { allergies: draft.allergies.slice(), conditions: draft.conditions.slice() };
    const editingExisting = draft.target !== MTSSM_NEW;
    const editingNew = !editingExisting && isNew && !!typedName;
    if (!editingExisting) setSelected(MTSSM_NEW);
    setForm(clean);
    setEdits((m) => ({ ...m, [draft.target]: snapshot }));
    if (!editingExisting && !editingNew) { setPrimer(""); setConsent(false); }
    setQuery("");
    setDraft(null);
    toast.show(editingExisting || editingNew ? "Details updated." : (clean.firstName + " " + clean.lastName).trim() + " added as a new patient.", "ok");
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
          <button type="button" className={"mtssm-add" + (isNew ? " is-on" : "")} onClick={() => (isNew ? openEdit() : openAdd())} aria-haspopup="dialog" aria-expanded={!!draft}>
            <IcS name="lucide:user-plus" size={15} />{isNew && typedName ? "Edit patient" : "Add patient"}
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
            <button type="button" className="mtssm-row mtssm-row-new is-on" role="listitem" aria-current="true" onClick={openEdit}>
              <AvatarS isNew size={40} />
              <span className="mtssm-row-text">
                <span className="mtssm-row-name">{typedName || "New patient"}</span>
                <span className="mtssm-row-meta">New record · tap to edit details</span>
              </span>
              <span className="mtssm-row-check" aria-hidden="true"><IcS name="lucide:check" size={13} /></span>
            </button>
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
              <button type="button" className="mt-btn mt-btn-ghost" onClick={() => { const [fn, ln] = mtssmSplit(query); openAdd({ firstName: fn, lastName: ln }); }}>
                <IcS name="lucide:user-plus" size={16} />Add “{query.trim()}”
              </button>
            </div>
          )}
        </div>

        {/* selected patient — summary, demographics and clinical snapshot in one container (user, 2026-09-30) */}
        <section className="mt-card mtssm-details mt-fade-in" key={selected}>
          <div className="mtssm-patient">
            <AvatarS name={isNew ? patientName : selected} isNew={isNew && !typedName} tone={isNew ? "new" : undefined} size={56} />
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
              <button type="button" className="mt-link mtssm-edit-link" onClick={openEdit}><IcS name="lucide:pencil" size={13} />Edit</button>
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
              <button type="button" className="mt-link mtssm-edit-link" onClick={openEdit}><IcS name="lucide:pencil" size={13} />Edit</button>
            </div>
            <div className="mtssm-snap-label">Alerts & allergies</div>
            <div className="mtssm-pills">
              {snap.allergies.length === 0 && <span className="mt-pill mt-pill-muted">{isNew ? "Not recorded yet" : "Nothing on file"}</span>}
              {snap.allergies.map((a) => a.severity
                ? <span key={a.label} className="mt-pill mt-pill-danger"><IcS name="lucide:triangle-alert" size={12} />{a.label} · {a.severity}</span>
                : <span key={a.label} className="mt-pill mt-pill-muted"><IcS name="lucide:check" size={12} />{a.label}</span>)}
            </div>
            <div className="mtssm-snap-label">Active conditions</div>
            <div className="mtssm-pills">
              {snap.conditions.length === 0 && <span className="mt-pill mt-pill-muted">{isNew ? "Not recorded yet" : "None on file"}</span>}
              {snap.conditions.map((c) => <span key={c} className="mt-pill mt-pill-ok">{c}</span>)}
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
      {draft && <MTSSMAddSheet draft={draft} setDraft={setDraft} mode={draft.target !== MTSSM_NEW ? "existing" : (isNew && typedName ? "new-edit" : "new")} onCancel={cancelAdd} onConfirm={confirmAdd} />}
      {toast.node}
    </div>
  );
}

/* chip-style list input used for the new-record clinical snapshot (user, 2026-10-02) */
const MTSSM_SEVERITIES = ["Mild", "Moderate", "Severe"];
function MTSSMTagInput({ label, placeholder, tone, withSeverity, items, onChange, quick }) {
  const [text, setText] = useStateMTSSM("");
  const [severity, setSeverity] = useStateMTSSM("Severe");
  const isObj = !!withSeverity;
  const keyOf = (it) => (isObj ? it.label : it);
  const has = (k) => items.some((it) => keyOf(it).toLowerCase() === k.toLowerCase());
  function add() {
    const v = text.trim();
    if (!v || has(v)) { setText(""); return; }
    onChange(items.filter((it) => !(isObj && it.label === "NKDA")).concat(isObj ? [{ label: v, severity }] : [v]));
    setText("");
  }
  function remove(k) { onChange(items.filter((it) => keyOf(it) !== k)); }
  const quickOn = quick && has(keyOf(quick.value));
  return (
    <div className="mtssm-tags">
      <div className="mtssm-tags-label">{label}</div>
      <div className="mtssm-tags-row">
        <input value={text} placeholder={placeholder} autoComplete="off" onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        {withSeverity && (
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} aria-label="Severity">
            {MTSSM_SEVERITIES.map((sv) => <option key={sv} value={sv}>{sv}</option>)}
          </select>
        )}
        <button type="button" className="mtssm-tags-add" onClick={add} disabled={!text.trim()} aria-label={"Add " + label}><IcS name="lucide:plus" size={16} /></button>
      </div>
      {(items.length > 0 || quick) && (
        <div className="mtssm-pills mtssm-tags-pills">
          {items.map((it) => {
            const k = keyOf(it);
            const cls = isObj ? (it.severity ? "mt-pill-danger" : "mt-pill-muted") : "mt-pill-" + tone;
            return (
              <span key={k} className={"mt-pill " + cls}>
                {isObj && it.severity && <IcS name="lucide:triangle-alert" size={12} />}
                {k}{isObj && it.severity ? " · " + it.severity : ""}
                <button type="button" className="mtssm-tag-x" onClick={() => remove(k)} aria-label={"Remove " + k}><IcS name="lucide:x" size={11} /></button>
              </span>
            );
          })}
          {quick && !quickOn && items.length === 0 && (
            <button type="button" className="mt-pill mt-pill-muted mtssm-tag-quick" onClick={() => onChange([quick.value])}><IcS name="lucide:check" size={12} />{quick.label}</button>
          )}
        </div>
      )}
    </div>
  );
}

/* "New patient" sheet — the only place a new record gets created (user, 2026-10-01) */
function MTSSMAddSheet({ draft, setDraft, mode, onCancel, onConfirm }) {
  const editing = mode !== "new";
  const existing = mode === "existing";
  const firstRef = useRefMTSSM(null);
  useEffectMTSSM(() => {
    const t = setTimeout(() => { if (firstRef.current) firstRef.current.focus(); }, 60);
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, []);
  const canSave = !!draft.firstName.trim();
  const set = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });
  const submit = (e) => { e.preventDefault(); if (canSave) onConfirm(); };
  return (
    <div className="mtssm-scrim" onClick={onCancel}>
      <form className="mtssm-sheet mtssm-sheet-tall" role="dialog" aria-modal="true" aria-labelledby="mtssm-add-title" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <span className="mtssm-sheet-grab" aria-hidden="true" />
        <div className="mtssm-sheet-head">
          <AvatarS name={existing ? draft.target : undefined} isNew={!existing} size={44} />
          <div className="mt-grow">
            <h3 id="mtssm-add-title">{editing ? "Edit patient details" : "New patient"}</h3>
            <p>{existing ? "Changes apply to " + draft.target.split(" ")[0] + "'s record for this session." : editing ? "Update the record for this first visit." : "Start a blank record for someone not yet on file."}</p>
          </div>
          <button type="button" className="mtssm-sheet-x" onClick={onCancel} aria-label="Close"><IcS name="lucide:x" size={18} /></button>
        </div>
        <div className="mtssm-grid">
          <label className="mt-field"><span>First name</span><input ref={firstRef} value={draft.firstName} placeholder="First" autoComplete="off" onChange={set("firstName")} /></label>
          <label className="mt-field"><span>Last name</span><input value={draft.lastName} placeholder="Last" autoComplete="off" onChange={set("lastName")} /></label>
          <label className="mt-field"><span>Date of birth</span><input value={draft.dob} placeholder="DD Mon YYYY" autoComplete="off" onChange={set("dob")} /></label>
          <label className="mt-field"><span>Phone</span><input value={draft.phone} placeholder="07700 …" inputMode="tel" autoComplete="off" onChange={set("phone")} /></label>
        </div>
        <div className="mtssm-sheet-sub"><IcS name="lucide:heart-pulse" size={14} />Clinical snapshot<span>Optional</span></div>
        <MTSSMTagInput label="Alerts & allergies" placeholder="e.g. Penicillin" tone="danger" withSeverity
          items={draft.allergies} onChange={(allergies) => setDraft({ ...draft, allergies })}
          quick={{ label: "No known allergies", value: { label: "NKDA" } }} />
        <MTSSMTagInput label="Active conditions" placeholder="e.g. Hypertension" tone="ok"
          items={draft.conditions} onChange={(conditions) => setDraft({ ...draft, conditions })} />
        <p className="mtssm-sheet-note"><IcS name="lucide:info" size={13} />Anything you add here is shown as an alert during the session and in the note.</p>
        <button type="submit" className="mt-btn mt-btn-primary mt-btn-block" disabled={!canSave}>
          <IcS name={editing ? "lucide:check" : "lucide:user-plus"} size={18} />{editing ? "Save details" : "Add patient"}
        </button>
        <button type="button" className="mt-btn mt-btn-ghost mt-btn-block" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

function MTSSMApp() {
  return <ShellS label="Start Session (mobile)"><MTSSMView /></ShellS>;
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTSSMApp />);
