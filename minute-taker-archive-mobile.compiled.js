/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Archive
   Reached from "View archive" on the mobile dashboard. Search + period chips
   over every past session grouped by day, each row opening the note review,
   plus an AI Copilot card that answers across the sessions in view.
   Runs on window.PFMT (minute-taker-mobile-shell.jsx). Classes prefixed mtam-.
   Web twin: MinuteTakerArchive.html (minute-taker-archive.jsx).
   =========================================================================== */
const {
  useState: useStateMTAM,
  useMemo: useMemoMTAM
} = React;
const MTA = window.PFMT;
const {
  Ic: IcA,
  Avatar: AvatarA,
  TopBar: TopBarA,
  IconBtn: IconBtnA,
  StatusPill: StatusPillA,
  Shell: ShellA
} = MTA;

/* daysAgo keeps the groups correct whatever today's date is */
const MTAM_SESSIONS = [{
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
  patient: "Amir Khan",
  id: "MT-76980",
  daysAgo: 63,
  time: "10:00",
  duration: "30 min",
  status: "Saved",
  type: "Rosacea review",
  kind: "Review"
}];
const MTAM_PERIODS = [{
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
const MTAM_KINDS = ["All types", "Consult", "Follow-up", "Review", "Treatment"];
const MTAM_COPILOT = [{
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
function mtamDateLabel(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function mtamGroup(daysAgo) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return "This week";
  if (daysAgo < 30) return "This month";
  return "Older";
}
function MTAMRow({
  row,
  onOpen
}) {
  const processing = row.status === "Processing";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtam-row" + (processing ? " is-processing" : ""),
    onClick: () => onOpen(row),
    disabled: processing,
    "aria-label": row.patient + ", " + row.type + ", " + row.status
  }, /*#__PURE__*/React.createElement(AvatarA, {
    name: row.patient,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtam-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtam-row-name"
  }, row.patient), /*#__PURE__*/React.createElement("span", {
    className: "mtam-row-meta"
  }, row.type), /*#__PURE__*/React.createElement("span", {
    className: "mtam-row-when"
  }, mtamDateLabel(row.daysAgo), " · ", row.time, " · ", row.duration)), /*#__PURE__*/React.createElement("div", {
    className: "mtam-row-side"
  }, /*#__PURE__*/React.createElement(StatusPillA, {
    status: row.status,
    compact: true
  }), /*#__PURE__*/React.createElement(IcA, {
    name: "lucide:chevron-right",
    size: 16
  })));
}
function MTAMCopilot({
  count
}) {
  const [q, setQ] = useStateMTAM("");
  const [busy, setBusy] = useStateMTAM(false);
  const [answer, setAnswer] = useStateMTAM(null);
  const [open, setOpen] = useStateMTAM(false);
  function ask() {
    if (!q.trim() || busy) return;
    setBusy(true);
    setAnswer(null);
    window.setTimeout(() => {
      setAnswer(MTAM_COPILOT.find(a => a.match.test(q)).text);
      setBusy(false);
    }, 1100);
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtam-copilot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcA, {
    name: "lucide:sparkles",
    size: 15
  })), "AI Copilot"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-link",
    onClick: () => setOpen(v => !v)
  }, open ? "Hide" : "Ask", /*#__PURE__*/React.createElement(IcA, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("p", {
    className: "mtam-copilot-hint"
  }, "Ask a question across the ", count, " session", count === 1 ? "" : "s", " in view, e.g. \"How has David's acne responded?\""), open && /*#__PURE__*/React.createElement("div", {
    className: "mtam-copilot-body mt-fade-in"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mt-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    placeholder: "Summarise every rosacea plan from the last 3 months…",
    value: q,
    onChange: e => setQ(e.target.value)
  })), busy && /*#__PURE__*/React.createElement("div", {
    className: "mtam-copilot-loading"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtam-spinner"
  }), "Reading sessions…"), answer && !busy && /*#__PURE__*/React.createElement("div", {
    className: "mtam-copilot-answer"
  }, /*#__PURE__*/React.createElement(IcA, {
    name: "lucide:sparkles",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, answer)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-soft mt-btn-block",
    onClick: ask,
    disabled: busy || !q.trim()
  }, /*#__PURE__*/React.createElement(IcA, {
    name: "lucide:wand-sparkles",
    size: 16
  }), "Generate insight")));
}
function MTAMView() {
  const [search, setSearch] = useStateMTAM("");
  const [period, setPeriod] = useStateMTAM("all");
  const [kind, setKind] = useStateMTAM("All types");
  const max = MTAM_PERIODS.find(p => p.key === period).max;
  const filtered = useMemoMTAM(() => {
    const q = search.trim().toLowerCase();
    return MTAM_SESSIONS.filter(s => {
      if (s.daysAgo > max) return false;
      if (kind !== "All types" && s.kind !== kind) return false;
      if (q && !(s.patient.toLowerCase().includes(q) || s.type.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, max, kind]);
  const groups = useMemoMTAM(() => {
    const out = [];
    filtered.forEach(s => {
      const g = mtamGroup(s.daysAgo);
      const last = out[out.length - 1];
      if (last && last.label === g) last.rows.push(s);else out.push({
        label: g,
        rows: [s]
      });
    });
    return out;
  }, [filtered]);
  const toReview = MTAM_SESSIONS.filter(s => s.status === "Note Ready").length;
  function openSession(row) {
    MTA.go(MTA.routes.review + "?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-screen mtam-screen"
  }, /*#__PURE__*/React.createElement(TopBarA, {
    left: /*#__PURE__*/React.createElement(IconBtnA, {
      icon: "lucide:arrow-left",
      label: "Back to dashboard",
      onClick: () => MTA.go(MTA.routes.dashboard)
    }),
    title: "Archive",
    sub: MTAM_SESSIONS.length + " sessions · " + toReview + " to review",
    right: /*#__PURE__*/React.createElement(IconBtnA, {
      icon: "lucide:mic",
      label: "Start session",
      tone: "accent",
      onClick: () => MTA.go(MTA.routes.start)
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtam-search"
  }, /*#__PURE__*/React.createElement(IcA, {
    name: "lucide:search",
    size: 18
  }), /*#__PURE__*/React.createElement("input", {
    className: "mt-input",
    placeholder: "Search patient, note or ID…",
    value: search,
    onChange: e => setSearch(e.target.value),
    autoComplete: "off"
  }), search && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtam-clear",
    "aria-label": "Clear search",
    onClick: () => setSearch("")
  }, /*#__PURE__*/React.createElement(IcA, {
    name: "lucide:x",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtam-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtam-seg",
    role: "tablist",
    "aria-label": "Period"
  }, MTAM_PERIODS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.key,
    type: "button",
    role: "tab",
    "aria-selected": period === p.key,
    className: "mtam-seg-btn" + (period === p.key ? " is-on" : ""),
    onClick: () => setPeriod(p.key)
  }, p.label))), /*#__PURE__*/React.createElement("div", {
    className: "mtam-chips",
    role: "list"
  }, MTAM_KINDS.map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    role: "listitem",
    className: "mtam-chip" + (kind === k ? " is-on" : ""),
    onClick: () => setKind(k)
  }, k)))), /*#__PURE__*/React.createElement(MTAMCopilot, {
    count: filtered.length
  }), groups.map(g => /*#__PURE__*/React.createElement(React.Fragment, {
    key: g.label
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-section-label mtam-label-row"
  }, /*#__PURE__*/React.createElement("span", null, g.label), /*#__PURE__*/React.createElement("span", {
    className: "mtam-count"
  }, g.rows.length)), /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtam-list"
  }, g.rows.map((row, i) => /*#__PURE__*/React.createElement(MTAMRow, {
    key: row.id + "-" + row.daysAgo + "-" + i,
    row: row,
    onOpen: openSession
  }))))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mtam-empty mt-fade-in"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtam-empty-ic"
  }, /*#__PURE__*/React.createElement(IcA, {
    name: "lucide:archive-x",
    size: 22
  })), /*#__PURE__*/React.createElement("strong", null, "No sessions match"), /*#__PURE__*/React.createElement("span", null, "Try another name, a wider period or a different type."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-ghost mt-btn-sm",
    onClick: () => {
      setSearch("");
      setPeriod("all");
      setKind("All types");
    }
  }, "Clear filters")), /*#__PURE__*/React.createElement("div", {
    className: "mt-trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcA, {
    name: "lucide:shield-check",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, "Notes stay in your EMR. The archive only lists sessions you approved, and audio is never stored.")), /*#__PURE__*/React.createElement("div", {
    className: "mt-spacer"
  })));
}
function MTAMApp() {
  return /*#__PURE__*/React.createElement(ShellA, {
    label: "Archive (mobile)"
  }, /*#__PURE__*/React.createElement(MTAMView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTAMApp, null));
