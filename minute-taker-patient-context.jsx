/* ===========================================================================
   PROfinity — Minute Taker (web) · Start Session (patient & consent)
   Web twin of MinuteTakerStartSessionMobile (minute-taker-start-session-mobile.jsx).
   Step 1 of 2, simplified 2026-10-14 (big fields for a new patient, previous-patient
   finder below the form). Older notes: pick the patient (searchable recent-patient list, or add a new
   one through the "New patient" modal — user, 2026-10-01), check the
   demographics + clinical snapshot, add an optional AI primer, confirm
   recording consent, then continue to the live session.
   Runs on window.PFMTW. Classes prefixed mtp-.
   =========================================================================== */
const { useState: useStateMTP, useEffect: useEffectMTP, useRef: useRefMTP } = React;
const MTS = window.PFMTW;
const { Avatar: AvatarS, Shell: ShellS } = MTS;
const MTP_NEW = "__new__";

/* recency rank from the free-text lastVisit label — lower = more recent */
function mtpRecency(label) {
  const s = String(label || "").toLowerCase();
  if (!s) return 9999;
  if (s === "today") return 0;
  if (s === "yesterday") return 1;
  const m = s.match(/(\d+)\s*(day|week|month|year)/);
  if (!m) return 9998;
  const n = +m[1]; const u = m[2];
  return u === "day" ? n : u === "week" ? n * 7 : u === "month" ? n * 30 : n * 365;
}
const MTP_RECENT_MAX = 5;
function mtpSplit(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return parts.length > 1 ? [parts[0], parts.slice(1).join(" ")] : [parts[0] || "", ""];
}

function MTPView() {
  const toast = MTS.useToast();
  const param = MTS.getParam("patient");
  /* Simplified 2026-10-14 (user), web twin of minute-taker-start-session-mobile.jsx: big
     name fields for a new patient (the usual case), allergies/conditions behind one
     Add/Edit modal, "Seen this patient before?" finder BELOW the form, short visit box,
     one consent tick and a big Continue button. */
  const initial = MTS.PATIENTS[param] ? param : MTP_NEW;
  const [selected, setSelected] = useStateMTP(initial);
  const isNew = selected === MTP_NEW;
  const base = isNew ? MTS.BLANK_PATIENT : MTS.PATIENTS[selected];

  const [form, setForm] = useStateMTP(() => {
    /* One "Patient name" field since 2026-10-14 (user): first + last were two boxes before. */
    const name = isNew ? (param && param !== MTP_NEW ? param : "") : selected;
    return { name, dob: base.dob, phone: base.phone, email: base.email || "" };
  });
  const [primer, setPrimer] = useStateMTP(base.primer);
  const [consent, setConsent] = useStateMTP(false);
  const [finding, setFinding] = useStateMTP(false);
  const [query, setQuery] = useStateMTP("");
  const [draft, setDraft] = useStateMTP(null);
  const [edits, setEdits] = useStateMTP({});
  const snap = edits[selected] || base;
  const searchRef = useRefMTP(null);

  const q = query.trim().toLowerCase();
  const recent = MTS.PATIENT_NAMES.slice().sort((a, b) => mtpRecency(MTS.PATIENTS[a].lastVisit) - mtpRecency(MTS.PATIENTS[b].lastVisit));
  const shown = q
    ? recent.filter((n) => n.toLowerCase().includes(q) || String(MTS.PATIENTS[n].id).toLowerCase().includes(q))
    : recent.slice(0, MTP_RECENT_MAX);

  const typedName = String(form.name || "").trim().replace(/\s+/g, " ");
  const patientName = isNew ? (typedName || "New patient") : (typedName || selected);
  const firstName = mtpSplit(typedName)[0] || (isNew ? "the patient" : selected.split(" ")[0]);
  const hasSnapshot = snap.allergies.length > 0 || snap.conditions.length > 0;
  const canStart = consent && !!typedName;

  function pick(value) {
    setSelected(value);
    const next = value === MTP_NEW ? MTS.BLANK_PATIENT : MTS.PATIENTS[value];
    setForm({ name: value === MTP_NEW ? "" : value, dob: next.dob, phone: next.phone, email: next.email || "" });
    setPrimer(next.primer);
    setConsent(false);
    setFinding(false);
    setQuery("");
  }
  function clearPatient() { pick(MTP_NEW); }
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

  useEffectMTP(() => {
    if (!draft) return undefined;
    const esc = (e) => { if (e.key === "Escape") cancelAdd(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [draft]);

  function start() {
    if (!typedName) { toast.show("Type the patient's name first."); return; }
    if (!consent) { toast.show("Confirm the patient's consent first."); return; }
    MTS.saveCtx({ patient: patientName, id: base.id, phone: form.phone.trim(), email: form.email.trim(), primer, useContext: true, isNewPatient: isNew, consentGiven: true, startedAt: Date.now() });
    MTS.go(MTS.routes.session + "?patient=" + encodeURIComponent(patientName));
  }

  const field = (key, label, extra) => (
    <label className={"mtw-field mtp-big-field" + (extra && extra.className ? " " + extra.className : "")}>
      <span>{label}</span>
      <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} autoComplete="off" {...extra} className={undefined} />
    </label>
  );
  const continueBtn = (
    <button type="button" className="mtw-btn mtw-btn-primary mtp-start" disabled={!canStart} onClick={start}>
      Continue to recording<iconify-icon icon="lucide:arrow-right"></iconify-icon>
    </button>
  );

  return (
    <div className="mtw-view mtp-view">
      <div className="mtw-page-head">
        <div>
          <button type="button" className="mtw-crumb" onClick={() => MTS.go(MTS.routes.dashboard)}><iconify-icon icon="lucide:arrow-left"></iconify-icon>Dashboard</button>
          <h1>Who is this session for?</h1>
          <p>Step 1 of 2 · Type the patient's details, tick consent, then continue.</p>
        </div>
        <div className="mtw-page-head-actions">{continueBtn}</div>
      </div>

      <div className="mtp-grid">
        <div className="mtw-col">
          <section className="mtw-card mtp-details mtw-fade-in" key={selected}>
            {!isNew ? (
              <div className="mtp-patient">
                <AvatarS name={selected} size={56} />
                <div className="mtw-grow">
                  <div className="mtp-patient-name">{selected}</div>
                  <div className="mtp-patient-meta">{base.gender} · {base.age} yrs · Last visit {String(base.lastVisit).toLowerCase()}</div>
                </div>
                <button type="button" className="mtp-clear" onClick={clearPatient} aria-label="Choose someone else" title="Choose someone else"><iconify-icon icon="lucide:x"></iconify-icon></button>
              </div>
            ) : (
              <div className="mtp-new-head">
                <AvatarS isNew size={48} />
                <span className="mtw-grow">New patient</span>
              </div>
            )}

            <div className="mtp-fields">
              {field("name", "Patient name", { placeholder: "First and last name", autoCapitalize: "words", className: "mtp-span" })}
              {field("dob", "Date of birth", { placeholder: "e.g. 12 Apr 1960" })}
              {field("phone", "Mobile number", { placeholder: "07700 …", inputMode: "tel" })}
              {field("email", "Email", { placeholder: "name@example.com", inputMode: "email", type: "email", autoCapitalize: "none", className: "mtp-span" })}
            </div>

            <div className="mtp-snap">
              <div className="mtp-snap-head">
                <span className="mtp-snap-title"><iconify-icon icon="lucide:heart-pulse"></iconify-icon>Allergies & conditions</span>
                <button type="button" className="mtw-btn mtw-btn-ghost mtw-btn-sm" onClick={openEdit}><iconify-icon icon={hasSnapshot ? "lucide:pencil" : "lucide:plus"}></iconify-icon>{hasSnapshot ? "Edit" : "Add"}</button>
              </div>
              <div className="mtp-pills">
                {!hasSnapshot && <span className="mtw-pill mtw-pill-muted">{isNew ? "Nothing added yet" : "Nothing on file"}</span>}
                {snap.allergies.map((a) => a.severity
                  ? <span key={a.label} className="mtw-pill mtw-pill-danger"><iconify-icon icon="lucide:triangle-alert"></iconify-icon>{a.label} · {a.severity}</span>
                  : <span key={a.label} className="mtw-pill mtw-pill-muted"><iconify-icon icon="lucide:check"></iconify-icon>{a.label}</span>)}
                {snap.conditions.map((c) => <span key={c} className="mtw-pill mtw-pill-ok">{c}</span>)}
              </div>
            </div>
          </section>

          {isNew && !finding && (
            <button type="button" className="mtp-find" onClick={openFind}>
              <span className="mtw-ti"><iconify-icon icon="lucide:search"></iconify-icon></span>
              <span className="mtw-grow">Seen this patient before?<small>Find their record instead of typing</small></span>
              <iconify-icon icon="lucide:chevron-right"></iconify-icon>
            </button>
          )}
          {isNew && finding && (
            <section className="mtw-card mtp-finder mtw-fade-in">
              <div className="mtp-finder-head">
                <span>Find a previous patient</span>
                <button type="button" className="mtw-link" onClick={() => { setFinding(false); setQuery(""); }}>Close</button>
              </div>
              <div className="mtw-search">
                <iconify-icon icon="lucide:search"></iconify-icon>
                <input ref={searchRef} className="mtw-input mtp-find-input" type="search" value={query} placeholder="Type a name" onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
                {query && <button type="button" className="mtw-search-clear" onClick={() => setQuery("")} aria-label="Clear search"><iconify-icon icon="lucide:x"></iconify-icon></button>}
              </div>
              <div className="mtp-list" role="list">
                {shown.map((name) => {
                  const pt = MTS.PATIENTS[name];
                  return (
                    <button key={name} type="button" role="listitem" className="mtp-row" onClick={() => pick(name)}>
                      <AvatarS name={name} size={44} />
                      <span className="mtp-row-text">
                        <span className="mtp-row-name">{name}</span>
                        <span className="mtp-row-meta">Last visit {String(pt.lastVisit).toLowerCase()}</span>
                      </span>
                      <iconify-icon icon="lucide:chevron-right"></iconify-icon>
                    </button>
                  );
                })}
                {q && !shown.length && <div className="mtp-empty"><span>No patient named “{query.trim()}”. Type their details above instead.</span></div>}
              </div>
            </section>
          )}
        </div>

        <div className="mtw-col">
          <section className="mtw-card mtp-primer">
            <div className="mtw-card-head">
              <span className="mtw-card-title"><span className="mtw-ti"><iconify-icon icon="lucide:sparkles"></iconify-icon></span>What is this visit about?</span>
              <span className="mtp-optional">Optional</span>
            </div>
            <label className="mtw-field mtp-primer-field">
              <textarea rows={4} value={primer} placeholder="e.g. Follow-up after lip filler. Check healing and talk about the next step." onChange={(e) => setPrimer(e.target.value)} />
            </label>
          </section>

          <section className={"mtw-card mtp-consent" + (consent ? " is-on" : "")}>
            <button type="button" className="mtp-consent-btn" onClick={() => setConsent((v) => !v)} aria-pressed={consent}>
              <span className={"mtw-check" + (consent ? " is-on" : "")}>{consent && <iconify-icon icon="lucide:check"></iconify-icon>}</span>
              <span className="mtw-grow">
                <span className="mtp-consent-title">{firstName === "the patient" ? "The patient" : firstName} agrees to be recorded</span>
                <span className="mtp-consent-text">You have told them this visit is recorded and written up as a note. The recording is kept with the note for 30 days.</span>
              </span>
            </button>
            <div className="mtp-continue">
              {continueBtn}
              <span className="mtp-continue-note">{!typedName ? "Type the patient's name to continue." : !consent ? "Tick the consent box to continue." : "Recording starts when you click the mic on the next screen."}</span>
            </div>
          </section>
        </div>
      </div>

      {draft && <MTPNewPatientModal draft={draft} setDraft={setDraft} mode={draft.target !== MTP_NEW ? "existing" : "new-edit"} onCancel={cancelAdd} onConfirm={confirmAdd} />}
      {toast.node}
    </div>
  );
}

/* chip-style list input used for the new-record clinical snapshot (user, 2026-10-02) */
const MTP_SEVERITIES = ["Mild", "Moderate", "Severe"];
function MTPTagInput({ label, placeholder, tone, withSeverity, items, onChange, quick }) {
  const [text, setText] = useStateMTP("");
  const [severity, setSeverity] = useStateMTP("Severe");
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
    <div className="mtp-tags">
      <div className="mtp-tags-label">{label}</div>
      <div className="mtp-tags-row">
        <input className="mtw-input" value={text} placeholder={placeholder} autoComplete="off" onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        {withSeverity && (
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} aria-label="Severity">
            {MTP_SEVERITIES.map((sv) => <option key={sv} value={sv}>{sv}</option>)}
          </select>
        )}
        <button type="button" className="mtp-tags-add" onClick={add} disabled={!text.trim()} aria-label={"Add " + label}><iconify-icon icon="lucide:plus"></iconify-icon></button>
      </div>
      {(items.length > 0 || quick) && (
        <div className="mtp-pills mtp-tags-pills">
          {items.map((it) => {
            const k = keyOf(it);
            const cls = isObj ? (it.severity ? "mtw-pill-danger" : "mtw-pill-muted") : "mtw-pill-" + tone;
            return (
              <span key={k} className={"mtw-pill " + cls}>
                {isObj && it.severity && <iconify-icon icon="lucide:triangle-alert"></iconify-icon>}
                {k}{isObj && it.severity ? " · " + it.severity : ""}
                <button type="button" className="mtp-tag-x" onClick={() => remove(k)} aria-label={"Remove " + k}><iconify-icon icon="lucide:x"></iconify-icon></button>
              </span>
            );
          })}
          {quick && !quickOn && items.length === 0 && (
            <button type="button" className="mtw-pill mtw-pill-muted mtp-tag-quick" onClick={() => onChange([quick.value])}><iconify-icon icon="lucide:check"></iconify-icon>{quick.label}</button>
          )}
        </div>
      )}
    </div>
  );
}

/* "New patient" modal — the only place a new record gets created (user, 2026-10-01) */
function MTPNewPatientModal({ draft, setDraft, mode, onCancel, onConfirm }) {
  const editing = mode !== "new";
  const existing = mode === "existing";
  const firstRef = useRefMTP(null);
  useEffectMTP(() => {
    const t = setTimeout(() => { if (firstRef.current) firstRef.current.focus(); }, 40);
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, []);
  const canSave = !!String(draft.name || "").trim();
  const set = (key) => (e) => setDraft({ ...draft, [key]: e.target.value });
  const submit = (e) => { e.preventDefault(); if (canSave) onConfirm(); };
  return (
    <div className="mtw-scrim" onClick={onCancel}>
      <form className="mtw-modal mtp-modal" role="dialog" aria-modal="true" aria-labelledby="mtp-new-title" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="mtp-modal-head">
          <AvatarS name={existing ? draft.target : undefined} isNew={!existing} size={46} />
          <div className="mtw-grow">
            <h3 id="mtp-new-title">{editing ? "Edit patient details" : "New patient"}</h3>
            <p>{existing ? "Changes apply to " + draft.target.split(" ")[0] + "'s record for this session." : editing ? "Update the record for this first visit." : "Start a blank record for someone not yet on file."}</p>
          </div>
          <button type="button" className="mtp-modal-x" onClick={onCancel} aria-label="Close"><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>
        <div className="mtp-fields">
          <label className="mtw-field mtp-span"><span>Patient name</span><input ref={firstRef} value={draft.name} placeholder="First and last name" autoCapitalize="words" autoComplete="off" onChange={set("name")} /></label>
          <label className="mtw-field"><span>Date of birth</span><input value={draft.dob} placeholder="DD Mon YYYY" autoComplete="off" onChange={set("dob")} /></label>
          <label className="mtw-field"><span>Phone</span><input value={draft.phone} placeholder="07700 …" inputMode="tel" autoComplete="off" onChange={set("phone")} /></label>
          <label className="mtw-field mtp-span"><span>Email</span><input value={draft.email || ""} type="email" placeholder="name@example.com" inputMode="email" autoCapitalize="none" autoComplete="off" onChange={set("email")} /></label>
        </div>
        <div className="mtp-modal-sub"><iconify-icon icon="lucide:heart-pulse"></iconify-icon>Clinical snapshot<span>Optional</span></div>
        <MTPTagInput label="Alerts & allergies" placeholder="e.g. Penicillin" tone="danger" withSeverity
          items={draft.allergies} onChange={(allergies) => setDraft({ ...draft, allergies })}
          quick={{ label: "No known allergies", value: { label: "NKDA" } }} />
        <MTPTagInput label="Active conditions" placeholder="e.g. Hypertension" tone="ok"
          items={draft.conditions} onChange={(conditions) => setDraft({ ...draft, conditions })} />
        <p className="mtp-modal-note"><iconify-icon icon="lucide:info"></iconify-icon>Anything you add here is shown as an alert during the session and in the note.</p>
        <div className="mtw-modal-actions mtp-modal-actions">
          <button type="button" className="mtw-btn mtw-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="mtw-btn mtw-btn-primary" disabled={!canSave}>
            <iconify-icon icon={editing ? "lucide:check" : "lucide:user-plus"}></iconify-icon>{editing ? "Save details" : "Add patient"}
          </button>
        </div>
      </form>
    </div>
  );
}

function MTPApp() {
  return <ShellS active="Patients" title="New session" sub="Step 1 of 2 · Patient & consent"><MTPView /></ShellS>;
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MTPApp />);
