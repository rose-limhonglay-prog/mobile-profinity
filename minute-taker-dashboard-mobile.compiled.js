/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Clinician Dashboard
   Entry point reached from the Agents catalogue ("Open Minute Taker").
   Hero greeting with today's numbers + Start session, today's consultations,
   recent patients rail (voice profile card removed 2026-10-12). Runs on window.PFMT
   (minute-taker-mobile-shell.jsx). Classes prefixed mtdm-.
   =========================================================================== */
const {
  useState: useStateMTDM
} = React;
const MT = window.PFMT;
const {
  Ic: IcD,
  Avatar: AvatarD,
  TopBar: TopBarD,
  IconBtn: IconBtnD,
  StatusPill: StatusPillD,
  Shell: ShellD
} = MT;
const MTDM_SESSIONS = [{
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
  sid: "s9",
  patient: "Amir Khan",
  id: "MT-76980",
  day: "earlier",
  when: "2 months ago",
  time: "10:00",
  duration: "30 min",
  status: "Saved",
  type: "Rosacea review"
}];
const MTDM_UPCOMING = [{
  patient: "Priya Natarajan",
  time: "11:15",
  type: "Skin consult"
}, {
  patient: "Amir Khan",
  time: "14:30",
  type: "Rosacea follow-up"
}, {
  patient: "Sarah Jenkins",
  time: "16:00",
  type: "Post-op check"
}];
const MTDM_RECENT = ["Eleanor Vance", "Sarah Jenkins", "David Cho", "Marcus Thorne"];
function MTDMHero({
  counts
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "mtdm-hero mt-fade-in",
    "aria-label": "Today"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-hero-orb o1",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtdm-hero-orb o2",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-hero-wave",
    "aria-hidden": "true"
  }, Array.from({
    length: 28
  }).map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: 6 + Math.round(18 * Math.abs(Math.sin(i * 0.9))),
      animationDelay: i * -0.09 + "s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-hero-eyebrow"
  }, MT.todayLabel()), /*#__PURE__*/React.createElement("h1", {
    className: "mtdm-hero-title"
  }, MT.greeting(), ",", /*#__PURE__*/React.createElement("br", null), "Dr Smith"), /*#__PURE__*/React.createElement("p", {
    className: "mtdm-hero-sub"
  }, counts.today, " consultations today · ", counts.ready, " note ready to review"), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtdm-stat"
  }, /*#__PURE__*/React.createElement("strong", null, counts.today), /*#__PURE__*/React.createElement("span", null, "Today")), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-stat"
  }, /*#__PURE__*/React.createElement("strong", null, counts.ready), /*#__PURE__*/React.createElement("span", null, "To review")), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-stat"
  }, /*#__PURE__*/React.createElement("strong", null, "2", /*#__PURE__*/React.createElement("em", null, "m")), /*#__PURE__*/React.createElement("span", null, "Avg. write-up"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-light mt-btn-block mtdm-start",
    onClick: () => MT.go(MT.routes.start)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-start-mic"
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:mic",
    size: 18
  })), "Start session", /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:arrow-right",
    size: 18
  })));
}
function MTDMSessionRow({
  row,
  onOpen,
  onMenu
}) {
  const processing = row.status === "Processing";
  return /*#__PURE__*/React.createElement("div", {
    className: "mtdm-row" + (processing ? " is-processing" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtdm-row-tap",
    onClick: () => onOpen(row),
    disabled: processing,
    "aria-label": row.patient + ", " + row.status
  }, /*#__PURE__*/React.createElement(AvatarD, {
    name: row.patient,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-row-name"
  }, row.patient), /*#__PURE__*/React.createElement("span", {
    className: "mtdm-row-meta"
  }, row.when ? row.when + " " + row.time : row.time + " · " + row.duration, " · ", row.type)), /*#__PURE__*/React.createElement(StatusPillD, {
    status: row.status,
    compact: true
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtdm-row-kebab",
    "aria-label": "More options for " + row.patient,
    "aria-haspopup": "dialog",
    onClick: () => onMenu(row)
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:ellipsis-vertical",
    size: 18
  })));
}

/* kebab bottom sheet: Clinical note · Archive · Download */
const MTDM_MENU = [{
  key: "note",
  icon: "lucide:file-text",
  label: "Clinical note",
  sub: "Open and review the note",
  busy: "Still being written"
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
function MTDMRowMenu({
  row,
  onClose,
  onAction
}) {
  if (!row) return null;
  const processing = row.status === "Processing";
  return /*#__PURE__*/React.createElement("div", {
    className: "mtdm-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtdm-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Options for " + row.patient,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-sheet-grab",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-sheet-head"
  }, /*#__PURE__*/React.createElement(AvatarD, {
    name: row.patient,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-sheet-title"
  }, /*#__PURE__*/React.createElement("strong", null, row.patient), /*#__PURE__*/React.createElement("span", null, row.when ? row.when + " " + row.time : row.time + " · " + row.duration, " · ", row.type)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtdm-sheet-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:x",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-menu"
  }, MTDM_MENU.map(it => {
    const off = processing && !!it.busy;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      type: "button",
      className: "mtdm-menu-item",
      disabled: off,
      onClick: () => onAction(it.key, row)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtdm-menu-ic"
    }, /*#__PURE__*/React.createElement(IcD, {
      name: it.icon,
      size: 18
    })), /*#__PURE__*/React.createElement("span", {
      className: "mtdm-menu-text"
    }, /*#__PURE__*/React.createElement("strong", null, it.label), /*#__PURE__*/React.createElement("span", null, off ? it.busy : it.sub)), /*#__PURE__*/React.createElement(IcD, {
      name: "lucide:chevron-right",
      size: 16
    }));
  }))));
}
function MTDMView() {
  const toast = MT.useToast();
  const [archived, setArchived] = useStateMTDM([]);
  /* ?menu=<session id> opens a row's sheet straight away (demo / screenshots) */
  const [menuRow, setMenuRow] = useStateMTDM(() => MTDM_SESSIONS.find(s => s.id === MT.getParam("menu") || s.sid === MT.getParam("menu")) || null);
  const [view, setView] = useStateMTDM(MT.getParam("view") === "saved" ? "saved" : "upcoming");
  const sessions = MTDM_SESSIONS.filter(s => !archived.includes(s.sid));
  const today = sessions.filter(s => s.day === "today");
  const counts = {
    today: today.length + MTDM_UPCOMING.length,
    ready: sessions.filter(s => s.status === "Note Ready").length
  };
  function openSession(row) {
    MT.go(MT.routes.review + "?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
  }
  function menuAction(key, row) {
    if (key === "note") {
      openSession(row);
      return;
    }
    setMenuRow(null);
    if (key === "archive") {
      setArchived(a => a.concat(row.sid));
      toast.show("Moved to the archive", "ok");
    }
    if (key === "download") toast.show("Downloading the note as a PDF…");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-screen mtdm-screen"
  }, /*#__PURE__*/React.createElement(TopBarD, {
    left: /*#__PURE__*/React.createElement(IconBtnD, {
      icon: "lucide:arrow-left",
      label: "Back to Agents",
      onClick: () => MT.go(MT.routes.agents)
    }),
    title: "Minute Taker",
    sub: "Ambient clinical scribe",
    right: /*#__PURE__*/React.createElement("img", {
      className: "mtdm-me",
      src: "assets/avatar-katy.jpg",
      alt: "Dr Katie Smith"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-scroll"
  }, /*#__PURE__*/React.createElement(MTDMHero, {
    counts: counts
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-section-label"
  }, "Recent patients"), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-rail",
    role: "list"
  }, MTDM_RECENT.map(name => {
    const p = MT.PATIENTS[name];
    return /*#__PURE__*/React.createElement("button", {
      key: name,
      type: "button",
      role: "listitem",
      className: "mtdm-chip",
      onClick: () => MT.go(MT.routes.start + "?patient=" + encodeURIComponent(name))
    }, /*#__PURE__*/React.createElement(AvatarD, {
      name: name,
      size: 48
    }), /*#__PURE__*/React.createElement("span", {
      className: "mtdm-chip-name"
    }, name.split(" ")[0]), /*#__PURE__*/React.createElement("span", {
      className: "mtdm-chip-sub"
    }, p ? p.lastVisit : "New"));
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "listitem",
    className: "mtdm-chip",
    onClick: () => MT.go(MT.routes.start + "?patient=__new__")
  }, /*#__PURE__*/React.createElement(AvatarD, {
    isNew: true,
    size: 48
  }), /*#__PURE__*/React.createElement("span", {
    className: "mtdm-chip-name"
  }, "New"), /*#__PURE__*/React.createElement("span", {
    className: "mtdm-chip-sub"
  }, "patient"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-section-label mtdm-label-row"
  }, /*#__PURE__*/React.createElement("span", null, "Sessions"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-link",
    onClick: () => MT.go(MT.routes.archive)
  }, "View archive", /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:arrow-up-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtdm-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtdm-seg",
    role: "tablist",
    "aria-label": "Sessions view"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": view === "upcoming",
    className: "mtdm-seg-btn" + (view === "upcoming" ? " is-on" : ""),
    onClick: () => setView("upcoming")
  }, "Upcoming", /*#__PURE__*/React.createElement("em", null, MTDM_UPCOMING.length)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": view === "saved",
    className: "mtdm-seg-btn" + (view === "saved" ? " is-on" : ""),
    onClick: () => setView("saved")
  }, "Saved", /*#__PURE__*/React.createElement("em", null, sessions.length))), view === "upcoming" ? /*#__PURE__*/React.createElement("div", {
    className: "mtdm-view mt-fade-in",
    key: "upcoming"
  }, MTDM_UPCOMING.map((u, i) => /*#__PURE__*/React.createElement("div", {
    key: u.patient + u.time,
    className: "mtdm-row is-upcoming"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtdm-row-tap",
    onClick: () => MT.go(MT.routes.start + "?patient=" + encodeURIComponent(u.patient))
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-upcoming-time"
  }, /*#__PURE__*/React.createElement("strong", null, u.time), /*#__PURE__*/React.createElement("span", null, i === 0 ? "next" : "today")), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-row-name"
  }, u.patient), /*#__PURE__*/React.createElement("span", {
    className: "mtdm-row-meta"
  }, u.type, " · not started")), /*#__PURE__*/React.createElement("span", {
    className: "mt-pill mt-pill-muted"
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:calendar",
    size: 12
  }), "Scheduled"))))) : /*#__PURE__*/React.createElement("div", {
    className: "mtdm-view mt-fade-in",
    key: "saved"
  }, sessions.map(row => /*#__PURE__*/React.createElement(MTDMSessionRow, {
    key: row.sid,
    row: row,
    onOpen: openSession,
    onMenu: setMenuRow
  })), sessions.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mtdm-empty"
  }, "Everything has been archived."))), /*#__PURE__*/React.createElement("div", {
    className: "mt-trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:shield-check",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, "Notes are written to your EMR after you approve them. Audio is transcribed live and never stored.")), /*#__PURE__*/React.createElement("div", {
    className: "mt-spacer"
  })), /*#__PURE__*/React.createElement(MTDMRowMenu, {
    row: menuRow,
    onClose: () => setMenuRow(null),
    onAction: menuAction
  }), toast.node);
}
function MTDMApp() {
  return /*#__PURE__*/React.createElement(ShellD, {
    label: "Minute Taker Dashboard (mobile)"
  }, /*#__PURE__*/React.createElement(MTDMView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTDMApp, null));
