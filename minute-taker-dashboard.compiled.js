/* ===========================================================================
   PROfinity — Minute Taker · Clinician Dashboard (web)
   Landing hub for the Minute Taker ambient documentation agent: gradient
   hero with today's numbers + Start session, today's / earlier sessions
   with patient avatars, voice-profile ring, recent patients. Web twin of
   MinuteTakerDashboardMobile (minute-taker-dashboard-mobile.jsx).
   PRD: Minute Taker Assistant Agent v1.0 — Screen 1 (Sec. 3.1 / MT-K02, MT-K03).
   Classes prefixed mtd- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateMTD
} = React;
function goMTD(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
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
function MTDSidebar({
  active
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "mtd-sidebar"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtd-back",
    onClick: () => goMTD("Agent.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-left"
  }), "All agents"), /*#__PURE__*/React.createElement("div", {
    className: "mtd-logo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-logo-mark"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  })), /*#__PURE__*/React.createElement("span", null, "Minute Taker")), MT_NAV.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "mtd-navitem" + (item.label === active ? " is-active" : ""),
    type: "button",
    onClick: item.label !== active ? () => goMTD(MT_NAV_LINKS[item.label]) : undefined
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label))), /*#__PURE__*/React.createElement("div", {
    className: "mtd-side-foot"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:shield-check"
  }), /*#__PURE__*/React.createElement("span", null, "Audio is transcribed live and never stored. Notes reach the EMR only after you approve them.")));
}
function MTDHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "mtd-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtd-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "mtd-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtd-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtd-bell-badge"
  }, "2")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-user-name"
  }, "Dr. Katie Smith"), /*#__PURE__*/React.createElement("div", {
    className: "mtd-user-role"
  }, "Clinician")), /*#__PURE__*/React.createElement("img", {
    className: "mtd-user-avatar",
    src: "assets/avatar-katy.jpg",
    alt: "Dr. Katie Smith"
  }));
}

/* ---------------------------------------------------------------- data */
const MTD_SESSIONS = [{
  patient: "Eleanor Vance",
  id: "MT-77213",
  day: "today",
  time: "09:30",
  duration: "45 min",
  status: "Note Ready",
  type: "Injectables follow-up"
}, {
  patient: "Marcus Thorne",
  id: "MT-77198",
  day: "today",
  time: "08:00",
  duration: "30 min",
  status: "Processing",
  type: "New patient consult"
}, {
  patient: "Sarah Jenkins",
  id: "MT-84729",
  day: "yesterday",
  time: "16:15",
  duration: "55 min",
  status: "Saved",
  type: "Post-op review"
}, {
  patient: "David Cho",
  id: "MT-77042",
  day: "yesterday",
  time: "14:00",
  duration: "20 min",
  status: "Saved",
  type: "Acne protocol · S2"
}];
const MTD_UPCOMING = {
  patient: "Priya Natarajan",
  time: "11:15",
  type: "Skin consult"
};
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
function MTDSessionRow({
  row
}) {
  const meta = MTD_STATUS[row.status];
  const disabled = row.status === "Processing";
  const open = () => goMTD("MinuteTakerNoteReview.html?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
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
  }, /*#__PURE__*/React.createElement("strong", null, row.time), " · ", row.duration), /*#__PURE__*/React.createElement("span", {
    className: "mtd-status-pill mtd-status-" + meta.cls + (disabled ? " is-spin" : "")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: meta.icon
  }), meta.label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtd-row-btn" + (disabled ? " is-disabled" : ""),
    disabled: disabled,
    onClick: disabled ? undefined : open
  }, meta.cta, !disabled && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  })));
}
function MTDView() {
  const [search, setSearch] = useStateMTD("");
  const [showProfile, setShowProfile] = useStateMTD(false);
  const today = MTD_SESSIONS.filter(s => s.day === "today");
  const earlier = MTD_SESSIONS.filter(s => s.day !== "today");
  const ready = MTD_SESSIONS.filter(s => s.status === "Note Ready").length;
  const pct = 98,
    r = 30,
    c = 2 * Math.PI * r;
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
  }, mtdToday()), /*#__PURE__*/React.createElement("h1", null, mtdGreeting(), ", Dr Smith"), /*#__PURE__*/React.createElement("p", null, today.length + 1, " consultations today · ", ready, " note ready to review"), /*#__PURE__*/React.createElement("div", {
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
  })), "Start session"))), /*#__PURE__*/React.createElement("div", {
    className: "mtd-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-stat"
  }, /*#__PURE__*/React.createElement("strong", null, today.length + 1), /*#__PURE__*/React.createElement("span", null, "Today")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-stat"
  }, /*#__PURE__*/React.createElement("strong", null, ready), /*#__PURE__*/React.createElement("span", null, "To review")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-stat"
  }, /*#__PURE__*/React.createElement("strong", null, "2", /*#__PURE__*/React.createElement("em", null, "m")), /*#__PURE__*/React.createElement("span", null, "Avg. write-up")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-stat"
  }, /*#__PURE__*/React.createElement("strong", null, "98", /*#__PURE__*/React.createElement("em", null, "%")), /*#__PURE__*/React.createElement("span", null, "Voice match")))), /*#__PURE__*/React.createElement("div", {
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
  })), "Today")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-th"
  }, "Patient"), /*#__PURE__*/React.createElement("span", {
    className: "mtd-th"
  }, "Time"), /*#__PURE__*/React.createElement("span", {
    className: "mtd-th"
  }, "Status"), /*#__PURE__*/React.createElement("span", {
    className: "mtd-th"
  }, "Action")), today.map(row => /*#__PURE__*/React.createElement(MTDSessionRow, {
    key: row.id,
    row: row
  })), /*#__PURE__*/React.createElement("div", {
    className: "mtd-trow mtd-trow-upcoming"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-cell-patient"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-upcoming-time"
  }, /*#__PURE__*/React.createElement("strong", null, MTD_UPCOMING.time), /*#__PURE__*/React.createElement("span", null, "next")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mtd-patient-cell"
  }, MTD_UPCOMING.patient), /*#__PURE__*/React.createElement("div", {
    className: "mtd-when-cell"
  }, MTD_UPCOMING.type))), /*#__PURE__*/React.createElement("span", {
    className: "mtd-when-cell mtd-cell-time"
  }, "Not started"), /*#__PURE__*/React.createElement("span", {
    className: "mtd-status-pill mtd-status-muted"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar"
  }), "Scheduled"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtd-row-btn mtd-row-btn-primary",
    onClick: () => goMTD("MinuteTakerPatientContext.html?patient=" + encodeURIComponent(MTD_UPCOMING.patient))
  }, "Prepare", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mtd-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-card-title-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:history"
  })), "Earlier"), /*#__PURE__*/React.createElement("a", {
    href: "MinuteTakerArchive.html",
    onClick: e => {
      e.preventDefault();
      goMTD("MinuteTakerArchive.html");
    }
  }, "View archive ", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-up-right"
  }))), earlier.map(row => /*#__PURE__*/React.createElement(MTDSessionRow, {
    key: row.id,
    row: row
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mtd-side-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-card mtd-enrol-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-card-title-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-ti"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:audio-lines"
  })), "Voice profile"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtd-link",
    onClick: () => setShowProfile(v => !v)
  }, showProfile ? "Hide" : "Manage")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-voice-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-ring",
    role: "img",
    "aria-label": pct + "% voice match"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 72 72",
    width: "72",
    height: "72"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "36",
    r: r,
    className: "mtd-ring-track"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "36",
    r: r,
    className: "mtd-ring-fill",
    style: {
      strokeDasharray: c,
      strokeDashoffset: c * (1 - pct / 100)
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mtd-ring-val"
  }, pct, /*#__PURE__*/React.createElement("em", null, "%"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mtd-voice-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtd-live-dot"
  }), "Profile active"), /*#__PURE__*/React.createElement("div", {
    className: "mtd-voice-sub"
  }, "Minute Taker recognises your voice, so clinician and patient speech stay separated."))), showProfile && /*#__PURE__*/React.createElement("div", {
    className: "mtd-enrol-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtd-enrol-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Match confidence"), /*#__PURE__*/React.createElement("strong", null, "98%")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-enrol-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Sample length"), /*#__PURE__*/React.createElement("strong", null, "32 s")), /*#__PURE__*/React.createElement("div", {
    className: "mtd-enrol-detail-row"
  }, /*#__PURE__*/React.createElement("span", null, "Last recalibrated"), /*#__PURE__*/React.createElement("strong", null, "2 weeks ago")), /*#__PURE__*/React.createElement("button", {
    className: "mtd-btn mtd-btn-soft",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  }), "Re-record sample"))), /*#__PURE__*/React.createElement("div", {
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
  })))))));
}
function MTDApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mtd-shell"
  }, /*#__PURE__*/React.createElement(MTDSidebar, {
    active: "Dashboard"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtd-main"
  }, /*#__PURE__*/React.createElement(MTDHeader, {
    title: "Minute Taker"
  }), /*#__PURE__*/React.createElement(MTDView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTDApp, null));
