/* ===========================================================================
   PROfinity — Minute Taker · Clinician Dashboard (web)
   Landing hub for the Minute Taker ambient documentation agent: gradient
   hero with today's numbers + Start session, saved sessions list
   with patient avatars + row kebab (note / archive / download), recent
   patients (voice profile removed 2026-10-12). Web twin of
   MinuteTakerDashboardMobile (minute-taker-dashboard-mobile.jsx). Chrome
   (sidebar + header) comes from minute-taker-web-shell.jsx (window.PFMTW).
   PRD: Minute Taker Assistant Agent v1.0 — Screen 1 (Sec. 3.1 / MT-K02, MT-K03).
   Classes prefixed mtd- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateMTD
} = React;
function getParamMTD(name) {
  return window.PFMTW.getParam(name) || "";
}
function goMTD(url) {
  window.PFMTW.go(url);
}
const MTW = window.PFMTW;

/* ---------------------------------------------------------------- data */
const MTD_SESSIONS = [{
  sid: "s1",
  patient: "Eleanor Vance",
  id: "MT-77213",
  day: "today",
  time: "09:30",
  duration: "45 min",
  status: "Note Ready",
  type: "Injectables follow-up"
}, {
  sid: "s2",
  patient: "Marcus Thorne",
  id: "MT-77198",
  day: "today",
  time: "08:00",
  duration: "30 min",
  status: "Processing",
  type: "New patient consult"
}, {
  sid: "s3",
  patient: "Sarah Jenkins",
  id: "MT-84729",
  day: "yesterday",
  when: "Yesterday",
  time: "16:15",
  duration: "55 min",
  status: "Saved",
  type: "Post-op review"
}, {
  sid: "s4",
  patient: "David Cho",
  id: "MT-77042",
  day: "yesterday",
  when: "Yesterday",
  time: "14:00",
  duration: "20 min",
  status: "Saved",
  type: "Acne protocol · S2"
}, {
  sid: "s5",
  patient: "Priya Natarajan",
  id: "MT-77310",
  day: "earlier",
  when: "5 days ago",
  time: "10:45",
  duration: "35 min",
  status: "Saved",
  type: "Skin consult"
}, {
  sid: "s6",
  patient: "Eleanor Vance",
  id: "MT-77213",
  day: "earlier",
  when: "2 weeks ago",
  time: "11:00",
  duration: "40 min",
  status: "Saved",
  type: "Injectables · session 1"
}, {
  sid: "s7",
  patient: "Sarah Jenkins",
  id: "MT-84729",
  day: "earlier",
  when: "3 weeks ago",
  time: "09:00",
  duration: "50 min",
  status: "Saved",
  type: "Knee arthroscopy review"
}, {
  sid: "s8",
  patient: "David Cho",
  id: "MT-77042",
  day: "earlier",
  when: "4 weeks ago",
  time: "15:30",
  duration: "25 min",
  status: "Saved",
  type: "Acne protocol · S1"
}, {
  sid: "s10",
  patient: "Priya Natarajan",
  id: "MT-77310",
  day: "earlier",
  when: "6 weeks ago",
  time: "13:15",
  duration: "45 min",
  status: "Saved",
  type: "New patient consult"
}, {
  sid: "s11",
  patient: "Marcus Thorne",
  id: "MT-77198",
  day: "earlier",
  when: "7 weeks ago",
  time: "11:30",
  duration: "35 min",
  status: "Saved",
  type: "Rosacea follow-up"
}, {
  sid: "s9",
  patient: "Amir Khan",
  id: "MT-76980",
  day: "earlier",
  when: "2 months ago",
  time: "10:00",
  duration: "30 min",
  status: "Saved",
  type: "Rosacea review"
}, {
  sid: "s12",
  patient: "Eleanor Vance",
  id: "MT-77213",
  day: "earlier",
  when: "3 months ago",
  time: "09:15",
  duration: "30 min",
  status: "Saved",
  type: "Skin consult"
}];
/* the dashboard shows the 10 most recent sessions; "See all sessions" opens the archive (full list + search) */
const MTD_RECENT_MAX = 10;
const MTD_RECENT = [{
  name: "Eleanor Vance",
  sub: "Today",
  tone: "teal"
}, {
  name: "Sarah Jenkins",
  sub: "3 weeks ago",
  tone: "violet"
}, {
  name: "David Cho",
  sub: "Yesterday",
  tone: "rose"
}, {
  name: "Marcus Thorne",
  sub: "Today",
  tone: "amber"
}];
const MTD_TONES = {
  "Eleanor Vance": "teal",
  "Sarah Jenkins": "violet",
  "David Cho": "rose",
  "Marcus Thorne": "amber"
};
const MTD_STATUS = {
  "Note Ready": {
    cls: "info",
    icon: "lucide:sparkles",
    label: "Ready to review",
    cta: "Review note"
  },
  "Processing": {
    cls: "warn",
    icon: "lucide:loader-circle",
    label: "Writing note",
    cta: "Please wait"
  },
  "Saved": {
    cls: "ok",
    icon: "lucide:check",
    label: "Saved to EMR",
    cta: "View note"
  }
};
function mtdInitials(name) {
  return name.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}
function mtdGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
function mtdToday() {
  try {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  } catch (e) {
    return "";
  }
}
function MTDAvatar({
  name,
  size = 40,
  tone
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mtd-avatar mtd-tone-" + (tone || MTD_TONES[name] || "slate"),
    style: {
      width: size,
      height: size,
      fontSize: Math.round(size * .36)
    },
    "aria-hidden": "true"
  }, mtdInitials(name));
}

/* ---------------------------------------------------------------- view */
const MTD_MENU = [{
  key: "note",
  icon: "lucide:file-text",
  label: "Clinical note",
  sub: "Open and review the note",
  busy: "Still being written"
}, {
  key: "share",
  icon: "lucide:share-2",
  label: "Share",
  sub: "Email, text or apps",
  busy: "Available once the note is ready"
}, {
  key: "archive",
  icon: "lucide:archive",
  label: "Archive",
  sub: "Move this session to the archive"
}, {
  key: "download",
  icon: "lucide:download",
  label: "Download",
  sub: "Save the note as a PDF",
  busy: "Available once the note is ready"
}];
function MTDSessionRow({
  row,
  onArchive,
  onShare,
  onToast
}) {
  const meta = MTD_STATUS[row.status];
  const disabled = row.status === "Processing";
  const [menu, setMenu] = useStateMTD(() => {
    const m = getParamMTD("menu");
    return !!m && (m === row.sid || m === row.id);
  });
  const wrapRef = React.useRef(null);
  const open = () => goMTD("MinuteTakerNoteReview.html?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
  React.useEffect(() => {
    if (!menu) return undefined;
    const off = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenu(false);
    };
    const esc = e => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("mousedown", off);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", off);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);
  function act(key) {
    setMenu(false);
    if (key === "note") open();else if (key === "share") onShare(row);else if (key === "archive") onArchive(row);else if (key === "download") onToast("Downloading the note as a PDF…");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mtd-trow" + (disabled ? " is-processing" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-cell-patient"
  }, /*#__PURE__*/React.createElement(MTDAvatar, {
    name: row.patient,
    size: 42
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mtd-patient-cell"
  }, row.patient), /*#__PURE__*/React.createElement("div", {
    className: "mtd-when-cell"
  }, row.type))), /*#__PURE__*/React.createElement("span", {
    className: "mtd-when-cell mtd-cell-time"
  }, row.when ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, row.when), " · ", row.time) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, row.time), " · ", row.duration)), /*#__PURE__*/React.createElement("span", {
    className: "mtd-status-pill mtd-status-" + meta.cls + (disabled ? " is-spin" : "")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: meta.icon
  }), meta.label), /*#__PURE__*/React.createElement("div", {
    className: "mtd-cell-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtd-row-btn" + (disabled ? " is-disabled" : ""),
    disabled: disabled,
    onClick: disabled ? undefined : open
  }, meta.cta), /*#__PURE__*/React.createElement("div", {
    className: "mtd-kebab-wrap",
    ref: wrapRef
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtd-kebab" + (menu ? " is-on" : ""),
    "aria-label": "More options for " + row.patient,
    "aria-haspopup": "menu",
    "aria-expanded": menu,
    onClick: () => setMenu(v => !v)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:ellipsis-vertical"
  })), menu && /*#__PURE__*/React.createElement("div", {
    className: "mtd-menu",
    role: "menu"
  }, MTD_MENU.map(it => {
    const off = disabled && !!it.busy;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      type: "button",
      role: "menuitem",
      disabled: off,
      onClick: () => act(it.key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtd-menu-ic"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: it.icon
    })), /*#__PURE__*/React.createElement("span", {
      className: "mtd-menu-text"
    }, /*#__PURE__*/React.createElement("strong", null, it.label), /*#__PURE__*/React.createElement("span", null, off ? it.busy : it.sub)));
  })))));
}
function MTDView() {
  const [search, setSearch] = useStateMTD("");
  const [archived, setArchived] = useStateMTD([]);
  const [toast, setToast] = useStateMTD(null);
  const toastRef = React.useRef(null);
  const showToast = msg => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2200);
  };
  const sessions = MTD_SESSIONS.filter(s => !archived.includes(s.sid));
  const recent = sessions.slice(0, MTD_RECENT_MAX);
  const today = sessions.filter(s => s.day === "today");
  const archiveRow = row => {
    setArchived(a => a.concat(row.sid));
    showToast("Moved to the archive");
  };
  /* ?share=<session id> opens the share modal straight away (demo / screenshots) */
  const [shareRow, setShareRow] = useStateMTD(() => MTD_SESSIONS.find(s => s.id === getParamMTD("share") || s.sid === getParamMTD("share")) || null);
  function startSession() {
    const target = search.trim() || "Sarah Jenkins";
    goMTD("MinuteTakerPatientContext.html?patient=" + encodeURIComponent(target));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mtd-view"
  }, /*#__PURE__*/React.createElement("section", {
    className: "mtd-hero",
    "aria-label": "Today"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-hero-orb o1",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtd-hero-orb o2",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtd-hero-wave",
    "aria-hidden": "true"
  }, Array.from({
    length: 34
  }).map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: 8 + Math.round(24 * Math.abs(Math.sin(i * 0.9))),
      animationDelay: i * -0.09 + "s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtd-hero-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-hero-eyebrow"
  }, mtdToday()), /*#__PURE__*/React.createElement("h1", null, mtdGreeting(), ", Dr Smith"), /*#__PURE__*/React.createElement("div", {
    className: "mtd-search-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search patients by name, ID or DOB to start a session…",
    value: search,
    onChange: e => setSearch(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") startSession();
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "mtd-btn mtd-btn-light",
    type: "button",
    onClick: startSession
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-start-mic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  })), "Start session")))), /*#__PURE__*/React.createElement("div", {
    className: "mtd-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-main-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-card-title-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar-days"
  })), "Sessions")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-th"
  }, "Patient"), /*#__PURE__*/React.createElement("span", {
    className: "mtd-th"
  }, "Time"), /*#__PURE__*/React.createElement("span", {
    className: "mtd-th"
  }, "Status"), /*#__PURE__*/React.createElement("span", {
    className: "mtd-th"
  }, "Action")), recent.map(row => /*#__PURE__*/React.createElement(MTDSessionRow, {
    key: row.sid,
    row: row,
    onArchive: archiveRow,
    onShare: setShareRow,
    onToast: showToast
  })), sessions.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mtd-empty"
  }, "Everything has been archived."), sessions.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtd-seeall",
    onClick: () => goMTD("MinuteTakerArchive.html")
  }, "See all sessions", /*#__PURE__*/React.createElement("em", null, sessions.length), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mtd-side-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-card-title-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  })), "Recent patients")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-recent-list"
  }, MTD_RECENT.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.name,
    type: "button",
    className: "mtd-recent-item",
    onClick: () => goMTD("MinuteTakerPatientContext.html?patient=" + encodeURIComponent(p.name))
  }, /*#__PURE__*/React.createElement(MTDAvatar, {
    name: p.name,
    size: 36,
    tone: p.tone
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtd-recent-main"
  }, /*#__PURE__*/React.createElement("span", null, p.name), /*#__PURE__*/React.createElement("small", null, "Last visit ", p.sub)), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtd-recent-item mtd-recent-new",
    onClick: () => goMTD("MinuteTakerPatientContext.html?patient=__new__")
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-avatar mtd-tone-new",
    style: {
      width: 36,
      height: 36
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:user-plus"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mtd-recent-main"
  }, /*#__PURE__*/React.createElement("span", null, "New patient"), /*#__PURE__*/React.createElement("small", null, "Start with a blank record")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  })))))), shareRow && window.PFMTShare && /*#__PURE__*/React.createElement(window.PFMTShare.Share, {
    variant: "modal",
    patient: shareRow.patient,
    id: shareRow.id,
    hasRecording: shareRow.status !== "Processing",
    note: {
      type: shareRow.type,
      date: shareRow.when ? shareRow.when + " " + shareRow.time : "Today " + shareRow.time,
      duration: shareRow.duration
    },
    onClose: () => setShareRow(null),
    onToast: m => showToast(m)
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtd-toast" + (toast ? " is-on" : ""),
    role: "status",
    "aria-live": "polite"
  }, toast && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle-2"
  }), toast)));
}
function MTDApp() {
  return /*#__PURE__*/React.createElement(MTW.Shell, {
    active: "Dashboard",
    title: "Minute Taker",
    className: "mtd-shell"
  }, /*#__PURE__*/React.createElement(MTDView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTDApp, null));
