/* ===========================================================================
   PROfinity — Minute Taker · Archive & Search with AI Copilot
   Searchable session history + natural-language cross-session AI Copilot.
   PRD Screen 6 (Sec. 3.6 / MT-K08, MT-K09).
   Classes prefixed mta- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateMTA,
  useMemo: useMemoMTA
} = React;
function goMTA(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
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
function MTASidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "mta-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-logo"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic",
    class: "mta-logo-icon"
  }), /*#__PURE__*/React.createElement("span", null, "Minute Taker")), MT_NAV.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "mta-navitem" + (item.label === "Archive" ? " is-active" : ""),
    type: "button",
    onClick: item.label !== "Archive" ? () => goMTA(MT_NAV_LINKS[item.label]) : undefined
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label))));
}
function MTAHeader() {
  return /*#__PURE__*/React.createElement("header", {
    className: "mta-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mta-header-title"
  }, "Minute Taker"), /*#__PURE__*/React.createElement("div", {
    className: "mta-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mta-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-user-name"
  }, "Dr. Katie Smith"), /*#__PURE__*/React.createElement("div", {
    className: "mta-user-role"
  }, "Clinician")), /*#__PURE__*/React.createElement("img", {
    className: "mta-user-avatar",
    src: "assets/avatar-katy.jpg",
    alt: "Dr. Katie Smith"
  }));
}

/* same sessions as the mobile archive (minute-taker-archive-mobile.jsx); daysAgo keeps dates current */
function mtaIso(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}
const MTA_SESSIONS = [{
  daysAgo: 0,
  patient: "Eleanor Vance",
  type: "Follow-up",
  detail: "Injectables follow-up",
  duration: "45 min",
  status: "Completed"
}, {
  daysAgo: 0,
  patient: "Marcus Thorne",
  type: "Initial Consult",
  detail: "New patient consult",
  duration: "30 min",
  status: "Pending"
}, {
  daysAgo: 1,
  patient: "Sarah Jenkins",
  type: "Review",
  detail: "Post-op review",
  duration: "55 min",
  status: "Completed"
}, {
  daysAgo: 1,
  patient: "David Cho",
  type: "Treatment",
  detail: "Acne protocol · S2",
  duration: "20 min",
  status: "Completed"
}, {
  daysAgo: 5,
  patient: "Priya Natarajan",
  type: "Initial Consult",
  detail: "Skin consult",
  duration: "35 min",
  status: "Completed"
}, {
  daysAgo: 13,
  patient: "Eleanor Vance",
  type: "Treatment",
  detail: "Injectables · session 1",
  duration: "40 min",
  status: "Completed"
}, {
  daysAgo: 22,
  patient: "Sarah Jenkins",
  type: "Review",
  detail: "Knee arthroscopy review",
  duration: "50 min",
  status: "Completed"
}, {
  daysAgo: 29,
  patient: "David Cho",
  type: "Treatment",
  detail: "Acne protocol · S1",
  duration: "25 min",
  status: "Completed"
}, {
  daysAgo: 41,
  patient: "Priya Natarajan",
  type: "Initial Consult",
  detail: "New patient consult",
  duration: "45 min",
  status: "Completed"
}, {
  daysAgo: 63,
  patient: "Amir Khan",
  type: "Review",
  detail: "Rosacea review",
  duration: "30 min",
  status: "Completed"
}].map(s => ({
  ...s,
  date: mtaIso(s.daysAgo)
}));
const MTA_TYPES = ["All Types", "Initial Consult", "Follow-up", "Review", "Treatment"];
const MTA_RANGES = ["All Time", "Last 7 Days", "Last 30 Days"];
function mtaDaysAgo(s) {
  return s.daysAgo;
}
const MTA_COPILOT_ANSWERS = [{
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
function mtaAnswerFor(q) {
  const found = MTA_COPILOT_ANSWERS.find(a => a.match.test(q));
  return found.text;
}
function MTAView() {
  const [search, setSearch] = useStateMTA("");
  const [range, setRange] = useStateMTA("All Time");
  const [type, setType] = useStateMTA("All Types");
  const [question, setQuestion] = useStateMTA("");
  const [generating, setGenerating] = useStateMTA(false);
  const [insight, setInsight] = useStateMTA(null);
  const filtered = useMemoMTA(() => {
    return MTA_SESSIONS.filter(s => {
      const q = search.trim().toLowerCase();
      if (q && !s.patient.toLowerCase().includes(q) && !s.type.toLowerCase().includes(q) && !s.detail.toLowerCase().includes(q)) return false;
      if (type !== "All Types" && s.type !== type) return false;
      if (range === "Last 7 Days" && mtaDaysAgo(s) > 7) return false;
      if (range === "Last 30 Days" && mtaDaysAgo(s) > 30) return false;
      return true;
    });
  }, [search, range, type]);
  function generateInsight() {
    if (!question.trim()) return;
    setGenerating(true);
    setInsight(null);
    window.setTimeout(() => {
      setInsight(mtaAnswerFor(question));
      setGenerating(false);
    }, 1100);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mta-shell"
  }, /*#__PURE__*/React.createElement(MTASidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "mta-main"
  }, /*#__PURE__*/React.createElement(MTAHeader, null), /*#__PURE__*/React.createElement("div", {
    className: "mta-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Archive & Search"), /*#__PURE__*/React.createElement("p", null, "Review and manage past clinical sessions and notes.")), /*#__PURE__*/React.createElement("button", {
    className: "mta-btn mta-btn-primary",
    type: "button",
    onClick: () => goMTA("MinuteTakerPatientContext.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Start New Session")), /*#__PURE__*/React.createElement("div", {
    className: "mta-content-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-list-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-filter-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-search-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search patient/keyword…",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("select", {
    value: range,
    onChange: e => setRange(e.target.value)
  }, MTA_RANGES.map(r => /*#__PURE__*/React.createElement("option", {
    key: r,
    value: r
  }, r))), /*#__PURE__*/React.createElement("select", {
    value: type,
    onChange: e => setType(e.target.value)
  }, MTA_TYPES.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "mta-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-row-grid mta-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mta-th"
  }, "Date"), /*#__PURE__*/React.createElement("span", {
    className: "mta-th"
  }, "Patient"), /*#__PURE__*/React.createElement("span", {
    className: "mta-th"
  }, "Type"), /*#__PURE__*/React.createElement("span", {
    className: "mta-th"
  }, "Duration"), /*#__PURE__*/React.createElement("span", {
    className: "mta-th"
  }, "Status"), /*#__PURE__*/React.createElement("span", {
    className: "mta-th"
  }, "Action")), filtered.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mta-row-grid mta-trow"
  }, /*#__PURE__*/React.createElement("span", null, s.date), /*#__PURE__*/React.createElement("span", {
    className: "mta-patient-cell"
  }, s.patient), /*#__PURE__*/React.createElement("span", {
    title: s.detail
  }, s.type), /*#__PURE__*/React.createElement("span", null, s.duration), /*#__PURE__*/React.createElement("span", {
    className: "mta-status-pill " + (s.status === "Completed" ? "success" : "warning")
  }, s.status), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mta-view-link",
    onClick: () => goMTA("MinuteTakerNoteReview.html?patient=" + encodeURIComponent(s.patient))
  }, "View Note"))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mta-empty"
  }, "No sessions match your filters."))), /*#__PURE__*/React.createElement("div", {
    className: "mta-copilot-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-card mta-copilot-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mta-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mta-card-title-text"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sparkles"
  }), "AI Copilot")), /*#__PURE__*/React.createElement("p", {
    className: "mta-copilot-hint"
  }, "Generate insights across selected sessions."), /*#__PURE__*/React.createElement("textarea", {
    rows: 5,
    placeholder: "Ask the AI a question about these sessions: e.g. 'Summarise all treatment plans for patients with hypertension over the last 3 months.'",
    value: question,
    onChange: e => setQuestion(e.target.value)
  }), generating && /*#__PURE__*/React.createElement("div", {
    className: "mta-copilot-loading"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mta-copilot-spinner"
  }), "Analyzing sessions…"), insight && !generating && /*#__PURE__*/React.createElement("div", {
    className: "mta-copilot-answer"
  }, insight), /*#__PURE__*/React.createElement("button", {
    className: "mta-btn mta-btn-primary mta-copilot-btn",
    type: "button",
    onClick: generateInsight,
    disabled: generating || !question.trim()
  }, "Generate Insight")))))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTAView, null));
