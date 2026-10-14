/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Start Session
   Step 1 of 2, simplified 2026-10-14 for older clinicians: big name fields
   for a new patient (the usual case), allergies/conditions behind one Add/Edit
   sheet, "Seen this patient before?" finder BELOW the form (recent list no
   longer on top), a short "what is this visit about?" box, one consent tick
   and a big Continue button. Runs on window.PFMT.
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
  /* Simplified 2026-10-14 (user): most sessions are for someone new, so the page opens on
     big name fields. Previous patients live behind one "Find a previous patient" row
     below the form instead of a list on top. Large type + big targets for older clinicians. */
  const initial = MTS.PATIENTS[param] ? param : MTSSM_NEW;
  const [selected, setSelected] = useStateMTSSM(initial);
  const isNew = selected === MTSSM_NEW;
  const base = isNew ? MTS.BLANK_PATIENT : MTS.PATIENTS[selected];

  const [form, setForm] = useStateMTSSM(() => {
    /* One "Patient name" field since 2026-10-14 (user): first + last were two boxes before. */
    const name = isNew ? (param && param !== MTSSM_NEW ? param : "") : selected;
    return { name, dob: base.dob, phone: base.phone, email: base.email || "" };
  });
  const [primer, setPrimer] = useStateMTSSM(base.primer);
  const [consent, setConsent] = useStateMTSSM(false);
  const [finding, setFinding] = useStateMTSSM(false);
  const [query, setQuery] = useStateMTSSM("");
  const [draft, setDraft] = useStateMTSSM(null);
  const [edits, setEdits] = useStateMTSSM({});
  const snap = edits[selected] || base;
  const searchRef = useRefMTSSM(null);

  const q = query.trim().toLowerCase();
  const recent = MTS.PATIENT_NAMES.slice().sort((a, b) => mtssmRecency(MTS.PATIENTS[a].lastVisit) - mtssmRecency(MTS.PATIENTS[b].lastVisit));
  const shown = q
    ? recent.filter((n) => n.toLowerCase().includes(q) || String(MTS.PATIENTS[n].id).toLowerCase().includes(q))
    : recent.slice(0, MTSSM_RECENT_MAX);

  const typedName = String(form.name || "").trim().replace(/\s+/g, " ");
  const patientName = isNew ? (typedName || "New patient") : (typedName || selected);
  const firstName = mtssmSplit(typedName)[0] || (isNew ? "the patient" : selected.split(" ")[0]);
  const hasSnapshot = snap.allergies.length > 0 || snap.conditions.length > 0;
  const canStart = consent && !!typedName;

  function pick(value) {
    setSelected(value);
    const next = value === MTSSM_NEW ? MTS.BLANK_PATIENT : MTS.PATIENTS[value];
    setForm({ name: value === MTSSM_NEW ? "" : value, dob: next.dob, phone: next.phone, email: next.email || "" });
    setPrimer(next.primer);
    setConsent(false);
    setFinding(false);
    setQuery("");
  }
  function clearPatient() { pick(MTSSM_NEW); }
  function openFind() {
    setFinding(true);
    window.setTimeout(() => { if (searchRef.current) searchRef.current.focus(); }, 80);
  }
  function openEdit() {
    setDraft({ target: selected, ...form, allergies: snap.allergies.slice(), conditions: snap.conditions.slice() });
  }
  function cancelAdd() { setDraft(null); }
  function confirmAdd() {
    if (!draft || !String(draft.name || "").trim()) return;
    const clean = { name: String(draft.name || "").trim(), dob: draft.dob.trim(), phone: draft.phone.trim(), email: String(draft.email || "").trim() };
    setForm(clean);
    setEdits((m) => ({ ...m, [draft.target]: { allergies: draft.allergies.slice(), conditions: draft.conditions.slice() } }));
    setDraft(null);
    toast.show("Details updated.", "ok");
  }

  function start() {
    if (!typedName) { toast.show("Type the patient's name first."); return; }
    if (!consent) { toast.show("Confirm the patient's consent first."); return; }
    MTS.saveCtx({ patient: patientName, id: base.id, phone: form.phone.trim(), email: form.email.trim(), primer, useContext: true, isNewPatient: isNew, consentGiven: true, startedAt: Date.now() });
    MTS.go(MTS.routes.session + "?patient=" + encodeURIComponent(patientName));
  }

  const field = (key, label, extra) => (
    <label className="mt-field mtssm-big-field">
      <span>{label}</span>
      <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} autoComplete="off" {...extra} />
    </label>
  );

  return (
    <div className="mt-screen mtssm-screen">
      <TopBarS
        left={<TextBtnS onClick={() => MTS.go(MTS.routes.dashboard)}>Cancel</TextBtnS>}
        title="New session"
        sub="Step 1 of 2 · Patient & consent"
      />

      <div className="mt-scroll">
        <h2 className="mtssm-q">Who is this session for?</h2>

        <section className="mt-card mtssm-details mt-fade-in" key={selected}>
          {!isNew ? (
            <div className="mtssm-patient">
              <AvatarS name={selected} size={56} />
              <div className="mt-grow">
                <div className="mtssm-patient-name">{selected}</div>
                <div className="mtssm-patient-meta">{base.gender} · {base.age} yrs · Last visit {String(base.lastVisit).toLowerCase()}</div>
              </div>
              <button type="button" className="mtssm-clear" onClick={clearPatient} aria-label="Choose someone else"><IcS name="lucide:x" size={18} /></button>
            </div>
          ) : (
            <div className="mtssm-new-head">
              <AvatarS isNew size={48} />
              <span className="mt-grow">New patient</span>
            </div>
          )}

          <div className="mtssm-fields">
            {field("name", "Patient name", { placeholder: "First and last name", autoCapitalize: "words" })}
            {field("dob", "Date of birth", { placeholder: "e.g. 12 Apr 1960" })}
            {field("phone", "Mobile number", { placeholder: "07700 …", inputMode: "tel" })}
            {field("email", "Email", { placeholder: "name@example.com", inputMode: "email", type: "email", autoCapitalize: "none" })}
          </div>

          <div className="mtssm-snap">
            <div className="mtssm-snap-head">
              <span className="mtssm-snap-title"><IcS name="lucide:heart-pulse" size={16} />Allergies & conditions</span>
              <button type="button" className="mtssm-snap-edit" onClick={openEdit}><IcS name={hasSnapshot ? "lucide:pencil" : "lucide:plus"} size={14} />{hasSnapshot ? "Edit" : "Add"}</button>
            </div>
            <div className="mtssm-pills">
              {!hasSnapshot && <span className="mt-pill mt-pill-muted">{isNew ? "Nothing added yet" : "Nothing on file"}</span>}
              {snap.allergies.map((a) => a.severity
                ? <span key={a.label} className="mt-pill mt-pill-danger"><IcS name="lucide:triangle-alert" size={12} />{a.label} · {a.severity}</span>
                : <span key={a.label} className="mt-pill mt-pill-muted"><IcS name="lucide:check" size={12} />{a.label}</span>)}
              {snap.conditions.map((c) => <span key={c} className="mt-pill mt-pill-ok">{c}</span>)}
            </div>
          </div>
        </section>

        {isNew && !finding && (
          <button type="button" className="mtssm-find" onClick={openFind}>
            <span className="mt-ti"><IcS name="lucide:search" size={18} /></span>
            <span className="mt-grow">Seen this patient before?<small>Find their record instead of typing</small></span>
            <IcS name="lucide:chevron-right" size={20} />
          </button>
        )}
        {isNew && finding && (
          <section className="mt-card mtssm-finder mt-fade-in">
            <div className="mtssm-finder-head">
              <span>Find a previous patient</span>
              <button type="button" className="mtssm-snap-edit" onClick={() => { setFinding(false); setQuery(""); }}>Close</button>
            </div>
            <label className="mtssm-search">
              <IcS name="lucide:search" size={18} />
              <input ref={searchRef} type="search" value={query} placeholder="Type a name" onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
              {query && <button type="button" className="mtssm-search-clear" onClick={() => setQuery("")} aria-label="Clear search"><IcS name="lucide:x" size={14} /></button>}
            </label>
            <div className="mtssm-list" role="list">
              {shown.map((name) => {
                const p = MTS.PATIENTS[name];
                return (
                  <button key={name} type="button" role="listitem" className="mtssm-row" onClick={() => pick(name)}>
                    <AvatarS name={name} size={44} />
                    <span className="mtssm-row-text">
                      <span className="mtssm-row-name">{name}</span>
                      <span className="mtssm-row-meta">Last visit {String(p.lastVisit).toLowerCase()}</span>
                    </span>
                    <IcS name="lucide:chevron-right" size={18} />
                  </button>
                );
              })}
              {q && !shown.length && <div className="mtssm-empty"><span>No patient named “{query.trim()}”. Type their details above instead.</span></div>}
            </div>
          </section>
        )}

        <section className="mt-card mtssm-primer">
          <div className="mt-card-head">
            <span className="mt-card-title"><span className="mt-ti"><IcS name="lucide:sparkles" size={15} /></span>What is this visit about?</span>
            <span className="mtssm-optional">Optional</span>
          </div>
          <label className="mt-field mtssm-primer-field">
            <textarea rows={3} value={primer} placeholder="e.g. Follow-up after lip filler. Check healing and talk about the next step." onChange={(e) => setPrimer(e.target.value)} />
          </label>
        </section>

        <section className={"mt-card mtssm-consent" + (consent ? " is-on" : "")}>
          <button type="button" className="mtssm-consent-btn" onClick={() => setConsent((v) => !v)} aria-pressed={consent}>
            <span className={"mt-check" + (consent ? " is-on" : "")}>{consent && <IcS name="lucide:check" size={18} />}</span>
            <span className="mt-grow">
              <span className="mtssm-consent-title">{firstName === "the patient" ? "The patient" : firstName} agrees to be recorded</span>
              <span className="mtssm-consent-text">You have told them this visit is recorded and written up as a note.</span>
            </span>
          </button>
        </section>
        <div className="mt-spacer" />
      </div>

      <div className="mt-bottom">
        <button type="button" className="mt-btn mt-btn-primary mt-btn-block mtssm-start" disabled={!canStart} onClick={start}>
          Continue to recording<IcS name="lucide:arrow-right" size={20} />
        </button>
        <p className="mt-bottom-note">{!typedName ? "Type the patient's name to continue." : !consent ? "Tick the consent box to continue." : "Recording starts when you tap the mic on the next screen."}</p>
      </div>
      {draft && <MTSSMAddSheet draft={draft} setDraft={setDraft} mode={draft.target !== MTSSM_NEW ? "existing" : "new-edit"} onCancel={cancelAdd} onConfirm={confirmAdd} />}
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
  const canSave = !!String(draft.name || "").trim();
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
          <label className="mt-field mtssm-span"><span>Patient name</span><input ref={firstRef} value={draft.name} placeholder="First and last name" autoCapitalize="words" autoComplete="off" onChange={set("name")} /></label>
          <label className="mt-field"><span>Date of birth</span><input value={draft.dob} placeholder="DD Mon YYYY" autoComplete="off" onChange={set("dob")} /></label>
          <label className="mt-field"><span>Phone</span><input value={draft.phone} placeholder="07700 …" inputMode="tel" autoComplete="off" onChange={set("phone")} /></label>
          <label className="mt-field mtssm-span"><span>Email</span><input value={draft.email || ""} type="email" placeholder="name@example.com" inputMode="email" autoCapitalize="none" autoComplete="off" onChange={set("email")} /></label>
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
