/* ===========================================================================
   PROfinity — Minute Taker (web) · Archive & Search with AI Copilot
   Web twin of MinuteTakerArchiveMobile (minute-taker-archive-mobile.jsx):
   search + period / type filters over every past session grouped by day,
   each row opening the note review, plus an AI Copilot card that answers
   across the sessions in view. Runs on window.PFMTW. Classes prefixed mta-.
   =========================================================================== */
const {
  useState: useStateMTA,
  useMemo: useMemoMTA
} = React;
const MTA = window.PFMTW;
const {
  Avatar: AvatarA,
  StatusPill: StatusPillA,
  Seg: SegA,
  Shell: ShellA
} = MTA;

/* same sessions as the mobile archive; daysAgo keeps the groups correct whatever today's date is */
const MTA_SESSIONS = [{
  patient: "Eleanor Vance",
  id: "MT-77213",
  daysAgo: 0,
  time: "09:30",
  duration: "45 min",
  status: "Note Ready",
  type: "Injectables follow-up",
  kind: "Follow-up"
}, {
  patient: "Marcus Thorne",
  id: "MT-77198",
  daysAgo: 0,
  time: "08:00",
  duration: "30 min",
  status: "Processing",
  type: "New patient consult",
  kind: "Consult"
}, {
  patient: "Sarah Jenkins",
  id: "MT-84729",
  daysAgo: 1,
  time: "16:15",
  duration: "55 min",
  status: "Saved",
  type: "Post-op review",
  kind: "Review"
}, {
  patient: "David Cho",
  id: "MT-77042",
  daysAgo: 1,
  time: "14:00",
  duration: "20 min",
  status: "Saved",
  type: "Acne protocol · S2",
  kind: "Treatment"
}, {
  patient: "Priya Natarajan",
  id: "MT-77310",
  daysAgo: 5,
  time: "10:45",
  duration: "35 min",
  status: "Saved",
  type: "Skin consult",
  kind: "Consult"
}, {
  patient: "Eleanor Vance",
  id: "MT-77213",
  daysAgo: 13,
  time: "11:00",
  duration: "40 min",
  status: "Saved",
  type: "Injectables · session 1",
  kind: "Treatment"
}, {
  patient: "Sarah Jenkins",
  id: "MT-84729",
  daysAgo: 22,
  time: "09:00",
  duration: "50 min",
  status: "Saved",
  type: "Knee arthroscopy review",
  kind: "Review"
}, {
  patient: "David Cho",
  id: "MT-77042",
  daysAgo: 29,
  time: "15:30",
  duration: "25 min",
  status: "Saved",
  type: "Acne protocol · S1",
  kind: "Treatment"
}, {
  patient: "Priya Natarajan",
  id: "MT-77310",
  daysAgo: 41,
  time: "13:15",
  duration: "45 min",
  status: "Saved",
  type: "New patient consult",
  kind: "Consult"
}, {
  patient: "Marcus Thorne",
  id: "MT-77198",
  daysAgo: 50,
  time: "11:30",
  duration: "35 min",
  status: "Saved",
  type: "Rosacea follow-up",
  kind: "Follow-up"
}, {
  patient: "Amir Khan",
  id: "MT-76980",
  daysAgo: 63,
  time: "10:00",
  duration: "30 min",
  status: "Saved",
  type: "Rosacea review",
  kind: "Review"
}, {
  patient: "Eleanor Vance",
  id: "MT-77213",
  daysAgo: 75,
  time: "09:15",
  duration: "30 min",
  status: "Saved",
  type: "Skin consult",
  kind: "Consult"
}];
const MTA_PERIODS = [{
  key: "all",
  label: "All time",
  max: Infinity
}, {
  key: "7",
  label: "7 days",
  max: 7
}, {
  key: "30",
  label: "30 days",
  max: 30
}];
const MTA_KINDS = ["All types", "Consult", "Follow-up", "Review", "Treatment"];
const MTA_COPILOT = [{
  match: /rosacea|amir/i,
  text: "Amir Khan's rosacea review (2 months ago) recorded fewer flares on the current regimen, with good tolerance and no new triggers. The plan was to continue unchanged and review again in 3 months."
}, {
  match: /acne|david/i,
  text: "David Cho has had 2 acne protocol sessions. Session 1 noted mild dryness that settled within a week; session 2 (yesterday) documented clear improvement against the progress photos, with the protocol continuing as planned."
}, {
  match: /inject|eleanor|bruis/i,
  text: "Eleanor Vance's injectable series: session 1 (2 weeks ago) noted minor bruising that resolved. Today's follow-up recorded good symmetry and high satisfaction, with no top-up required before the next review."
}, {
  match: /knee|post-op|sarah/i,
  text: "Sarah Jenkins' post-op reviews show steady progress since the knee arthroscopy: pain scores dropped from 5 to 2, mobility is improving, and there have been no signs of infection at either visit."
}, {
  match: /.*/,
  text: "Across the sessions in view, most visits were routine follow-ups with stable findings and no urgent flags. Ask about a patient, condition or treatment to narrow this down."
}];
function mtaDateLabel(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function mtaGroup(daysAgo) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return "This week";
  if (daysAgo < 30) return "This month";
  return "Older";
}
function MTARow({
  row,
  onOpen
}) {
  const processing = row.status === "Processing";
  const meta = MTA.STATUS[row.status];
  return /*#__PURE__*/React.createElement("div", {
    className: "mta-row" + (processing ? " is-processing" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-cell-patient"
  }, /*#__PURE__*/React.createElement(AvatarA, {
    name: row.patient,
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtw-grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-row-name"
  }, row.patient), /*#__PURE__*/React.createElement("div", {
    className: "mta-row-meta"
  }, row.type, !processing && /*#__PURE__*/React.createElement("span", {
    className: "mta-audio",
    title: "Recording kept"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  }), "Audio")))), /*#__PURE__*/React.createElement("span", {
    className: "mta-row-when"
  }, /*#__PURE__*/React.createElement("strong", null, mtaDateLabel(row.daysAgo)), /*#__PURE__*/React.createElement("span", null, row.time, " · ", row.duration)), /*#__PURE__*/React.createElement("span", {
    className: "mtw-pill mtw-pill-muted mta-kind"
  }, row.kind), /*#__PURE__*/React.createElement(StatusPillA, {
    status: row.status
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mta-row-btn" + (processing ? " is-disabled" : ""),
    disabled: processing,
    onClick: processing ? undefined : () => onOpen(row),
    "aria-label": (meta ? meta.cta : "Open") + " for " + row.patient
  }, meta ? meta.cta : "Open", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  })));
}
function MTACopilot({
  count
}) {
  const [q, setQ] = useStateMTA("");
  const [busy, setBusy] = useStateMTA(false);
  const [answer, setAnswer] = useStateMTA(null);
  function ask() {
    if (!q.trim() || busy) return;
    setBusy(true);
    setAnswer(null);
    window.setTimeout(() => {
      setAnswer(MTA_COPILOT.find(a => a.match.test(q)).text);
      setBusy(false);
    }, 1100);
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "mtw-card mta-copilot mtw-sticky"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sparkles"
  })), "AI Copilot")), /*#__PURE__*/React.createElement("p", {
    className: "mtw-hint"
  }, "Ask a question across the ", count, " session", count === 1 ? "" : "s", " in view, e.g. \"How has David's acne responded?\""), /*#__PURE__*/React.createElement("label", {
    className: "mtw-field mta-copilot-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    placeholder: "Summarise every rosacea plan from the last 3 months…",
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ask();
    }
  })), busy && /*#__PURE__*/React.createElement("div", {
    className: "mta-copilot-loading"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mta-spinner"
  }), "Reading sessions…"), answer && !busy && /*#__PURE__*/React.createElement("div", {
    className: "mta-copilot-answer mtw-fade-in"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sparkles"
  }), /*#__PURE__*/React.createElement("span", null, answer)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-btn mtw-btn-soft mtw-btn-block",
    onClick: ask,
    disabled: busy || !q.trim()
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:wand-sparkles"
  }), "Generate insight"));
}
function MTAView() {
  const [search, setSearch] = useStateMTA("");
  const [period, setPeriod] = useStateMTA("all");
  const [kind, setKind] = useStateMTA("All types");
  const max = MTA_PERIODS.find(p => p.key === period).max;
  const filtered = useMemoMTA(() => {
    const q = search.trim().toLowerCase();
    return MTA_SESSIONS.filter(s => {
      if (s.daysAgo > max) return false;
      if (kind !== "All types" && s.kind !== kind) return false;
      if (q && !(s.patient.toLowerCase().includes(q) || s.type.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, max, kind]);
  const groups = useMemoMTA(() => {
    const out = [];
    filtered.forEach(s => {
      const g = mtaGroup(s.daysAgo);
      const last = out[out.length - 1];
      if (last && last.label === g) last.rows.push(s);else out.push({
        label: g,
        rows: [s]
      });
    });
    return out;
  }, [filtered]);
  const toReview = MTA_SESSIONS.filter(s => s.status === "Note Ready").length;
  function openSession(row) {
    MTA.go(MTA.routes.review + "?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
  }
  function clear() {
    setSearch("");
    setPeriod("all");
    setKind("All types");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mtw-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Archive"), /*#__PURE__*/React.createElement("p", null, MTA_SESSIONS.length, " sessions · ", toReview, " to review")), /*#__PURE__*/React.createElement("div", {
    className: "mtw-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-btn mtw-btn-primary",
    onClick: () => MTA.go(MTA.routes.start)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  }), "Start session"))), /*#__PURE__*/React.createElement("div", {
    className: "mtw-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-search mta-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    className: "mtw-input",
    placeholder: "Search patient, note or ID…",
    value: search,
    onChange: e => setSearch(e.target.value),
    autoComplete: "off"
  }), search && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-search-clear",
    "aria-label": "Clear search",
    onClick: () => setSearch("")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement(SegA, {
    items: MTA_PERIODS,
    value: period,
    onChange: setPeriod,
    label: "Period",
    className: "mta-period"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mta-chips",
    role: "list"
  }, MTA_KINDS.map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    role: "listitem",
    className: "mta-chip" + (kind === k ? " is-on" : ""),
    onClick: () => setKind(k)
  }, k))), groups.map(g => /*#__PURE__*/React.createElement("section", {
    key: g.label,
    className: "mta-group mtw-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtw-section-label mta-label-row"
  }, /*#__PURE__*/React.createElement("span", null, g.label), /*#__PURE__*/React.createElement("span", {
    className: "mta-count"
  }, g.rows.length)), /*#__PURE__*/React.createElement("div", {
    className: "mtw-card mta-list"
  }, g.rows.map((row, i) => /*#__PURE__*/React.createElement(MTARow, {
    key: row.id + "-" + row.daysAgo + "-" + i,
    row: row,
    onOpen: openSession
  }))))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mta-empty mtw-fade-in"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mta-empty-ic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:archive-x"
  })), /*#__PURE__*/React.createElement("strong", null, "No sessions match"), /*#__PURE__*/React.createElement("span", null, "Try another name, a wider period or a different type."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtw-btn mtw-btn-ghost mtw-btn-sm",
    onClick: clear
  }, "Clear filters")), /*#__PURE__*/React.createElement("div", {
    className: "mtw-trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtw-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:shield-check"
  })), /*#__PURE__*/React.createElement("span", null, "Notes stay in your EMR. The archive lists the sessions you approved, each with its recording kept for 30 days."))), /*#__PURE__*/React.createElement("div", {
    className: "mtw-col"
  }, /*#__PURE__*/React.createElement(MTACopilot, {
    count: filtered.length
  }))));
}
function MTAApp() {
  return /*#__PURE__*/React.createElement(ShellA, {
    active: "Archive",
    title: "Archive"
  }, /*#__PURE__*/React.createElement(MTAView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTAApp, null));
