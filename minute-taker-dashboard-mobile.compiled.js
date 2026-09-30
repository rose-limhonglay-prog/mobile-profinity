/* ===========================================================================
   PROfinity — Minute Taker (mobile) · Clinician Dashboard
   Entry point reached from the Agents catalogue ("Open Minute Taker").
   Hero greeting with today's numbers + Start session, today's consultations,
   voice profile ring, recent patients rail. Runs on window.PFMT
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
const MTDM_UPCOMING = {
  patient: "Priya Natarajan",
  time: "11:15",
  type: "Skin consult"
};
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
  onOpen
}) {
  const processing = row.status === "Processing";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtdm-row" + (processing ? " is-processing" : ""),
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
  }, row.time, " · ", row.duration, " · ", row.type)), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-row-side"
  }, /*#__PURE__*/React.createElement(StatusPillD, {
    status: row.status,
    compact: true
  }), /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:chevron-right",
    size: 16
  })));
}
function MTDMVoiceCard({
  toast
}) {
  const [open, setOpen] = useStateMTDM(false);
  const pct = 98;
  const r = 26,
    c = 2 * Math.PI * r;
  return /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtdm-voice"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:audio-lines",
    size: 15
  })), "Voice profile"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-link",
    onClick: () => setOpen(v => !v)
  }, open ? "Hide" : "Manage", /*#__PURE__*/React.createElement(IcD, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-voice-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtdm-ring",
    role: "img",
    "aria-label": pct + "% voice match"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 64 64",
    width: "64",
    height: "64"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "32",
    r: r,
    className: "mtdm-ring-track"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "32",
    r: r,
    className: "mtdm-ring-fill",
    style: {
      strokeDasharray: c,
      strokeDashoffset: c * (1 - pct / 100)
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mtdm-ring-val"
  }, pct, /*#__PURE__*/React.createElement("em", null, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-voice-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtdm-voice-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-live-dot"
  }), "Profile active"), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-voice-sub"
  }, "Minute Taker recognises your voice, so clinician and patient speech stay separated."))), open && /*#__PURE__*/React.createElement("div", {
    className: "mtdm-voice-detail mt-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtdm-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Match confidence"), /*#__PURE__*/React.createElement("strong", null, "98%")), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Sample length"), /*#__PURE__*/React.createElement("strong", null, "32 s")), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Last recalibrated"), /*#__PURE__*/React.createElement("strong", null, "2 weeks ago")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn mt-btn-soft mt-btn-block",
    onClick: () => toast.show("Re-recording opens on your next session.")
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:mic",
    size: 16
  }), "Re-record sample")));
}
function MTDMView() {
  const toast = MT.useToast();
  const today = MTDM_SESSIONS.filter(s => s.day === "today");
  const earlier = MTDM_SESSIONS.filter(s => s.day !== "today");
  const counts = {
    today: today.length + 1,
    ready: MTDM_SESSIONS.filter(s => s.status === "Note Ready").length
  };
  function openSession(row) {
    MT.go(MT.routes.review + "?patient=" + encodeURIComponent(row.patient) + "&id=" + row.id);
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
  }, "Today"), /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtdm-list"
  }, today.map(row => /*#__PURE__*/React.createElement(MTDMSessionRow, {
    key: row.id,
    row: row,
    onOpen: openSession
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mtdm-row mtdm-row-upcoming",
    onClick: () => MT.go(MT.routes.start + "?patient=" + encodeURIComponent(MTDM_UPCOMING.patient))
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-upcoming-time"
  }, /*#__PURE__*/React.createElement("strong", null, MTDM_UPCOMING.time), /*#__PURE__*/React.createElement("span", null, "next")), /*#__PURE__*/React.createElement("div", {
    className: "mtdm-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtdm-row-name"
  }, MTDM_UPCOMING.patient), /*#__PURE__*/React.createElement("span", {
    className: "mtdm-row-meta"
  }, MTDM_UPCOMING.type, " · not started")), /*#__PURE__*/React.createElement("span", {
    className: "mt-pill mt-pill-muted"
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:calendar",
    size: 12
  }), "Scheduled"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-section-label mtdm-label-row"
  }, /*#__PURE__*/React.createElement("span", null, "Earlier"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-link",
    onClick: () => MT.go(MT.routes.archive)
  }, "View archive", /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:arrow-up-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("section", {
    className: "mt-card mtdm-list"
  }, earlier.map(row => /*#__PURE__*/React.createElement(MTDMSessionRow, {
    key: row.id,
    row: row,
    onOpen: openSession
  }))), /*#__PURE__*/React.createElement("div", {
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
    className: "mt-section-label"
  }, "Your setup"), /*#__PURE__*/React.createElement(MTDMVoiceCard, {
    toast: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-ti"
  }, /*#__PURE__*/React.createElement(IcD, {
    name: "lucide:shield-check",
    size: 15
  })), /*#__PURE__*/React.createElement("span", null, "Notes are written to your EMR after you approve them. Audio is transcribed live and never stored.")), /*#__PURE__*/React.createElement("div", {
    className: "mt-spacer"
  })), toast.node);
}
function MTDMApp() {
  return /*#__PURE__*/React.createElement(ShellD, {
    label: "Minute Taker Dashboard (mobile)"
  }, /*#__PURE__*/React.createElement(MTDMView, null));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTDMApp, null));
