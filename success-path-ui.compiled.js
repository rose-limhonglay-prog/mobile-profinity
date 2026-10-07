/* ===========================================================================
   PROfinity — Success Path UI (shared by mobile + web)
   Components over window.PFSuccessPath (success-path.js). Exposed as
   window.PFSuccessPathUI so host pages drop them in with one line:
     CourseCard   course-landing summary (placement option A, compact)
     PathView     milestones + activities (placement option A, full)
     PathSheet    full-screen PathView over the mobile course page
     LessonCard   "Builds towards…" activity card in a lesson (option B)
     Hub          the SuccessPath.html / SuccessPathWeb.html screen body
   Inline SVG icons only (no iconify preload needed). Classes prefixed sp-.
   Hooks suffixed SP because every page script shares one global scope.
   =========================================================================== */
const {
  useState: useStateSP,
  useEffect: useEffectSP,
  useRef: useRefSP
} = React;
const SPE = window.PFSuccessPath;

/* ------------------------------------------------------------ icons -- */
const SP_PATHS = {
  check: "M20 6 9 17l-5-5",
  lock: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z",
  chevR: "m9 18 6-6-6-6",
  chevD: "m6 9 6 6 6-6",
  chevL: "m15 18-6-6 6-6",
  x: "M18 6 6 18M6 6l12 12",
  play: "M8 5v14l11-7z",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
  spark: "M12 3l1.8 4.9L19 9.7l-4.9 1.8L12 16.5l-1.8-5L5 9.7l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15V9a4 4 0 0 1 4-4h4M18 9v6a4 4 0 0 1-4 4h-4",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  undo: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3",
  arrowR: "M5 12h14M13 5l7 7-7 7",
  cal: "M3 5h18v16H3zM16 3v4M8 3v4M3 10h18",
  bot: "M12 8V4H8M4 12h16v8H4zM2 14v2M22 14v2M9 16h.01M15 16h.01"
};
function IcSP({
  n,
  s = 16,
  c = "currentColor",
  w = 2
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "sp-ic",
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: w,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: SP_PATHS[n]
  }));
}

/* ------------------------------------------------------------ state -- */
function useSP(slug) {
  const read = () => SPE ? SPE.compute(slug) : null;
  const [s, setS] = useStateSP(read);
  useEffectSP(() => {
    if (!SPE) return;
    const sync = () => setS(read());
    window.addEventListener(SPE.EVT, sync);
    window.addEventListener("pf-lessons-done", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(SPE.EVT, sync);
      window.removeEventListener("pf-lessons-done", sync);
      window.removeEventListener("focus", sync);
    };
  }, [slug]);
  return s;
}
/* level numbers in circles read as Roman numerals (user, 2026-10-07) */
function romanSP(n) {
  const R = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return R[n] || String(n);
}
function fmtDateSP(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short"
    });
  } catch (e) {
    return "";
  }
}
function fmtN(n) {
  return (+n || 0).toLocaleString("en-GB");
}
function RingSP({
  pct,
  size = 64,
  stroke = 6,
  label
}) {
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r;
  return /*#__PURE__*/React.createElement("svg", {
    className: "sp-ring",
    width: size,
    height: size,
    viewBox: "0 0 " + size + " " + size,
    role: "img",
    "aria-label": pct + "% of skills ticked"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--sp-track)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--sp-gold-strong)",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - pct / 100),
    transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")",
    style: {
      transition: "stroke-dashoffset .6s ease"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: "50%",
    y: "50%",
    dy: ".35em",
    textAnchor: "middle",
    className: "sp-ring-n"
  }, label != null ? label : pct + "%"));
}
function LevelPipsSP({
  milestones
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-pips",
    "aria-hidden": "true"
  }, milestones.map(m => /*#__PURE__*/React.createElement("span", {
    key: m.id,
    className: "sp-pip sp-pip-" + m.status,
    title: "Level " + m.level + " · " + m.title
  }, m.status === "achieved" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "check",
    s: 11,
    w: 3
  }) : romanSP(m.level))));
}

/* float "+N" from an element */
function floatPtsSP(anchor, amount) {
  if (!anchor || !amount) return;
  try {
    const r = anchor.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "sp-float";
    el.textContent = "+" + amount + " pts";
    el.style.left = r.left + r.width / 2 + "px";
    el.style.top = r.top - 6 + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  } catch (e) {}
}

/* ------------------------------------------------------ tick confirm -- */
function TickSheetSP({
  slug,
  activity,
  variant,
  onClose
}) {
  const btn = useRefSP(null);
  if (!activity) return null;
  const yes = () => {
    const res = SPE.tick(slug, activity.id);
    if (res && res.points) floatPtsSP(btn.current, res.points);
    onClose(res);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-overlay sp-overlay-" + variant,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Confirm skill",
    onClick: e => {
      if (e.target === e.currentTarget) onClose(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-sheet"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, "Level ", activity.level, " · ", activity.id), /*#__PURE__*/React.createElement("h3", {
    className: "sp-sheet-t"
  }, "Is this true in your clinic now?"), /*#__PURE__*/React.createElement("p", {
    className: "sp-quote"
  }, "“", activity.text, "”"), /*#__PURE__*/React.createElement("p", {
    className: "sp-sheet-s"
  }, "Only tick it once you've done it with a real patient. You can untick it later if it stops feeling true."), /*#__PURE__*/React.createElement("div", {
    className: "sp-sheet-pts"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "spark",
    s: 16
  }), " +", activity.points, " points"), /*#__PURE__*/React.createElement("div", {
    className: "sp-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-btn sp-btn-ghost",
    onClick: () => onClose(null)
  }, "Not yet"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    ref: btn,
    className: "sp-btn sp-btn-gold",
    onClick: yes
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "check",
    s: 16,
    w: 2.6
  }), "Yes, tick it"))));
}

/* ------------------------------------------------------------- goal -- */
function GoalSheetSP({
  slug,
  variant,
  onClose
}) {
  const s = useSP(slug);
  const [m, setM] = useStateSP(() => s && s.goal ? s.goal.milestone : s && s.current ? s.current.id : "M1");
  const [d, setD] = useStateSP(30);
  if (!s) return null;
  const save = () => {
    const date = new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
    SPE.setGoal(slug, m, date);
    onClose(true);
  };
  const skip = () => {
    SPE.markSeen(slug, "goalSkipped");
    onClose(false);
  };
  const avail = s.milestones.filter(x => x.status !== "upgrade");
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-overlay sp-overlay-" + variant,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Set your goal",
    onClick: e => {
      if (e.target === e.currentTarget) skip();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-sheet"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sp-goal-ic"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "target",
    s: 22
  })), /*#__PURE__*/React.createElement("h3", {
    className: "sp-sheet-t"
  }, "Set your 8D goal"), /*#__PURE__*/React.createElement("p", {
    className: "sp-sheet-s"
  }, "Members who set a goal are ", /*#__PURE__*/React.createElement("b", null, "50% more likely"), " to reach it. Optional — takes 10 seconds."), /*#__PURE__*/React.createElement("p", {
    className: "sp-label"
  }, "I want to reach"), /*#__PURE__*/React.createElement("div", {
    className: "sp-chips"
  }, avail.map(x => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: x.id,
    className: "sp-chip" + (m === x.id ? " on" : ""),
    "aria-pressed": m === x.id,
    onClick: () => setM(x.id)
  }, "Level ", x.level, " · ", x.title))), /*#__PURE__*/React.createElement("p", {
    className: "sp-label"
  }, "By"), /*#__PURE__*/React.createElement("div", {
    className: "sp-chips"
  }, [[14, "2 weeks"], [30, "1 month"], [90, "3 months"]].map(([n, l]) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: n,
    className: "sp-chip" + (d === n ? " on" : ""),
    "aria-pressed": d === n,
    onClick: () => setD(n)
  }, l))), /*#__PURE__*/React.createElement("div", {
    className: "sp-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-btn sp-btn-ghost",
    onClick: skip
  }, "Skip for now"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-btn sp-btn-navy",
    onClick: save
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "target",
    s: 16
  }), "Set goal"))));
}

/* ------------------------------------------------------- activity row -- */
function ActivityRowSP({
  a,
  onTick,
  onOpenLesson,
  onUpgrade,
  slug
}) {
  const lessonsLeft = a.lessonsTotal - a.lessonsDone;
  const firstLeft = (a.lessons || []).filter(n => SPE.readDone().indexOf(n) === -1)[0];
  return /*#__PURE__*/React.createElement("li", {
    className: "sp-act sp-act-" + a.status
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-act-mk",
    "aria-hidden": "true"
  }, a.status === "done" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "check",
    s: 14,
    w: 3
  }) : a.status === "ready" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "spark",
    s: 13
  }) : /*#__PURE__*/React.createElement(IcSP, {
    n: "lock",
    s: 12
  })), /*#__PURE__*/React.createElement("div", {
    className: "sp-act-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-act-t"
  }, a.text), /*#__PURE__*/React.createElement("p", {
    className: "sp-act-meta"
  }, /*#__PURE__*/React.createElement("span", null, a.subCourse), /*#__PURE__*/React.createElement("span", {
    className: "sp-dot"
  }, "·"), /*#__PURE__*/React.createElement("span", {
    className: "sp-act-pts"
  }, "+", a.points, " pts")), a.status === "locked" && /*#__PURE__*/React.createElement("p", {
    className: "sp-act-hint"
  }, "Watch ", lessonsLeft === 1 ? "1 more lesson" : lessonsLeft + " more lessons", " to unlock", firstLeft && onOpenLesson && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-link",
    onClick: () => onOpenLesson(firstLeft)
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "play",
    s: 11
  }), firstLeft), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-link sp-demo",
    onClick: () => SPE.watchLessons(slug, a.id),
    title: "Prototype only"
  }, "Demo: mark watched")), a.status === "upgrade" && /*#__PURE__*/React.createElement("p", {
    className: "sp-act-hint"
  }, "Part of the full 8D Lip Design path. ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-link",
    onClick: onUpgrade
  }, "Unlock with Mastery")), a.status === "done" && /*#__PURE__*/React.createElement("p", {
    className: "sp-act-hint sp-ok"
  }, "Ticked ", fmtDateSP(a.tickedAt), " ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-link sp-quiet",
    onClick: () => SPE.untick(slug, a.id),
    "aria-label": "Untick " + a.id
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "undo",
    s: 11
  }), "Untick"))), a.status === "ready" && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-tick",
    onClick: () => onTick(a),
    "aria-label": "Tick: " + a.text
  }, "Tick"));
}

/* ------------------------------------------------------------ path -- */
function MilestoneSP({
  m,
  open,
  onToggle,
  children,
  isGoal
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "sp-ms sp-ms-" + m.status + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-ms-hd",
    "aria-expanded": open,
    onClick: onToggle
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-medal",
    "aria-hidden": "true"
  }, m.status === "achieved" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "trophy",
    s: 20
  }) : m.status === "upgrade" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "lock",
    s: 16
  }) : /*#__PURE__*/React.createElement("b", null, romanSP(m.level))), /*#__PURE__*/React.createElement("span", {
    className: "sp-ms-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-ms-k"
  }, "Level ", m.level, " · ", m.subStream, isGoal && /*#__PURE__*/React.createElement("em", {
    className: "sp-goal-tag"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "target",
    s: 11
  }), "Your goal")), /*#__PURE__*/React.createElement("span", {
    className: "sp-ms-t"
  }, m.title), /*#__PURE__*/React.createElement("span", {
    className: "sp-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: m.pct + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "sp-ms-sub"
  }, m.status === "achieved" ? "Achieved " + fmtDateSP(m.achievedAt) + " · +" + m.points + " pts" : m.status === "upgrade" ? m.total + " skills · locked" : m.done + " of " + m.total + " skills" + "" + " · " + m.points + " pts")), /*#__PURE__*/React.createElement(IcSP, {
    n: open ? "chevD" : "chevR",
    s: 18
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "sp-ms-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-quote sp-quote-sm"
  }, "“", m.statement, "”"), children));
}
function PathView({
  slug,
  variant = "mobile",
  onOpenLesson,
  onUpgrade,
  only,
  header = true
}) {
  const s = useSP(slug);
  const [openId, setOpenId] = useStateSP(null);
  const [ticking, setTicking] = useStateSP(null);
  const [goalOpen, setGoalOpen] = useStateSP(false);
  useEffectSP(() => {
    if (!s || openId) return;
    const first = s.milestones.filter(m => (!only || only.indexOf(m.id) !== -1) && (m.ready || m.status === "progress" || m.status === "open"))[0];
    setOpenId(first ? first.id : s.milestones[0].id);
  }, [!!s]);
  if (!s) return null;
  const upgrade = onUpgrade || (() => {
    window.location.href = "MembershipTier.html";
  });
  const list = s.milestones.filter(m => !only || only.indexOf(m.id) !== -1);
  const shown = only ? list.reduce((t, m) => t + m.total, 0) : s.total;
  const shownDone = only ? list.reduce((t, m) => t + m.done, 0) : s.done;
  const pct = shown ? Math.round(shownDone / shown * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-root sp-path sp-" + variant
  }, header && /*#__PURE__*/React.createElement("div", {
    className: "sp-sum"
  }, /*#__PURE__*/React.createElement(RingSP, {
    pct: pct
  }), /*#__PURE__*/React.createElement("div", {
    className: "sp-sum-tx"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, only ? "Free Starter Path" : "Success Path · " + s.title), /*#__PURE__*/React.createElement("p", {
    className: "sp-sum-t"
  }, s.current ? "Level " + s.current.level + " · " + s.current.title : "Path complete"), /*#__PURE__*/React.createElement("p", {
    className: "sp-sum-s"
  }, shownDone, " of ", shown, " skills · ", /*#__PURE__*/React.createElement("b", null, fmtN(s.earned)), " pts earned"))), header && !only && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-goal" + (s.goal ? " set" : ""),
    onClick: () => setGoalOpen(true)
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "target",
    s: 16
  }), s.goal && s.goalMilestone ? /*#__PURE__*/React.createElement("span", null, "Goal: ", /*#__PURE__*/React.createElement("b", null, "Level ", s.goalMilestone.level), " by ", fmtDateSP(s.goal.date), " ", s.goalMilestone.status === "achieved" ? "· met 🎉" : "· " + (s.goalMilestone.total - s.goalMilestone.done) + " skills to go") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Set a goal"), " — you're 50% more likely to get there"), /*#__PURE__*/React.createElement(IcSP, {
    n: "chevR",
    s: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "sp-ms-list"
  }, list.map(m => /*#__PURE__*/React.createElement(MilestoneSP, {
    key: m.id,
    m: m,
    open: openId === m.id,
    onToggle: () => setOpenId(openId === m.id ? null : m.id),
    isGoal: s.goal && s.goal.milestone === m.id
  }, /*#__PURE__*/React.createElement("ul", {
    className: "sp-acts"
  }, m.activities.map(a => /*#__PURE__*/React.createElement(ActivityRowSP, {
    key: a.id,
    a: a,
    slug: slug,
    onTick: setTicking,
    onOpenLesson: onOpenLesson,
    onUpgrade: upgrade
  })))))), ticking && /*#__PURE__*/React.createElement(TickSheetSP, {
    slug: slug,
    activity: ticking,
    variant: variant,
    onClose: () => setTicking(null)
  }), goalOpen && /*#__PURE__*/React.createElement(GoalSheetSP, {
    slug: slug,
    variant: variant,
    onClose: () => setGoalOpen(false)
  }));
}

/* ------------------------------------------------ course card (opt A) -- */
function CourseCard({
  slug,
  variant = "mobile",
  onOpen
}) {
  const s = useSP(slug);
  if (!s) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "sp-root sp-card sp-coursecard sp-" + variant,
    "data-screen-label": "Success Path card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-cc-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-cc-ic"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "route",
    s: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "sp-cc-tx"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, "Success Path"), /*#__PURE__*/React.createElement("p", {
    className: "sp-cc-t"
  }, s.current ? "Level " + s.current.level + " · " + s.current.title : "All 5 levels achieved")), /*#__PURE__*/React.createElement(RingSP, {
    pct: s.pct,
    size: 48,
    stroke: 5
  })), /*#__PURE__*/React.createElement(LevelPipsSP, {
    milestones: s.milestones
  }), /*#__PURE__*/React.createElement("p", {
    className: "sp-cc-s"
  }, s.done, " of ", s.total, " skills · ", s.achieved, " of ", s.milestones.length, " levels · ", /*#__PURE__*/React.createElement("b", null, fmtN(s.earned)), " pts"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-btn sp-btn-navy sp-btn-block",
    onClick: onOpen
  }, "View my Success Path", /*#__PURE__*/React.createElement(IcSP, {
    n: "arrowR",
    s: 16
  })));
}

/* ------------------------------------------ full-screen sheet (mobile) -- */
function PathSheet({
  slug,
  onClose,
  onOpenLesson
}) {
  const sheetS = useSP(slug);
  const s = useSP(slug);
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-root sp-fullsheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Success Path",
    "data-screen-label": "Success Path (course)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sp-fs-top"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-iconbtn",
    "aria-label": "Back to course",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "chevL",
    s: 22
  })), /*#__PURE__*/React.createElement("h2", null, "Success Path", /*#__PURE__*/React.createElement("small", {
    className: "sp-fs-sub"
  }, sheetS ? sheetS.shortTitle : "")), /*#__PURE__*/React.createElement("span", {
    className: "sp-iconbtn sp-iconbtn-spacer",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sp-fs-scroll"
  }, s && /*#__PURE__*/React.createElement("div", {
    className: "sp-hub2 sp-mobile sp-fs-hero"
  }, /*#__PURE__*/React.createElement(HeroStatsSP, {
    s: s,
    only: null
  })), /*#__PURE__*/React.createElement(PathJourney, {
    slug: slug,
    variant: "mobile",
    onOpenLesson: onOpenLesson ? n => {
      onClose();
      onOpenLesson(n);
    } : null
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })));
}

/* ---------------------------------------------- lesson card (opt B) -- */
function LessonCard({
  slug,
  lessonName,
  variant = "mobile",
  onOpenPath
}) {
  const s = useSP(slug);
  const [ticking, setTicking] = useStateSP(null);
  if (!s) return null;
  const acts = s.activities.filter(a => (a.lessons || []).indexOf(lessonName) !== -1);
  if (!acts.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "sp-root sp-card sp-lessoncard sp-" + variant,
    "data-screen-label": "Success Path · lesson skill"
  }, acts.map(a => {
    const m = s.milestones.filter(x => x.id === a.milestone)[0];
    const left = a.lessonsTotal - a.lessonsDone;
    const thisDone = SPE.readDone().indexOf(lessonName) !== -1;
    const n = s.activities.indexOf(a) + 1;
    return /*#__PURE__*/React.createElement("div", {
      key: a.id,
      className: "sp-lc sp-lc-" + a.status
    }, /*#__PURE__*/React.createElement("p", {
      className: "sp-eyebrow"
    }, /*#__PURE__*/React.createElement(IcSP, {
      n: "route",
      s: 12
    }), " Builds towards Level ", m.level, " · ", m.title), /*#__PURE__*/React.createElement("p", {
      className: "sp-lc-t2"
    }, "Skill ", n, " of ", s.activities.length, " · ", a.subCourse), a.status === "ready" && /*#__PURE__*/React.createElement("p", {
      className: "sp-lc-s"
    }, /*#__PURE__*/React.createElement(IcSP, {
      n: "spark",
      s: 13
    }), "Completing… · +", a.points, " pts"), a.status === "done" && /*#__PURE__*/React.createElement("p", {
      className: "sp-lc-s sp-ok"
    }, /*#__PURE__*/React.createElement(IcSP, {
      n: "check",
      s: 14,
      w: 3
    }), "Completed ", fmtDateSP(a.tickedAt), " · +", a.points, " pts banked"), a.status === "locked" && /*#__PURE__*/React.createElement("p", {
      className: "sp-lc-s"
    }, /*#__PURE__*/React.createElement(IcSP, {
      n: "lock",
      s: 13
    }), !thisDone ? left === 1 ? "Complete this lesson to complete the skill" : "Complete this lesson and " + (left - 1) + " more to complete the skill" : "Complete " + left + " more linked " + (left === 1 ? "lesson" : "lessons") + " to complete the skill"), a.status === "upgrade" && /*#__PURE__*/React.createElement("p", {
      className: "sp-lc-s"
    }, /*#__PURE__*/React.createElement(IcSP, {
      n: "lock",
      s: 13
    }), "Unlock the full 8D path to complete this skill"), /*#__PURE__*/React.createElement("div", {
      className: "sp-lc-foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sp-mini-bar"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: m.pct + "%"
      }
    })), /*#__PURE__*/React.createElement("span", null, m.done, "/", m.total, " skills in Level ", m.level), onOpenPath && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sp-link",
      onClick: onOpenPath
    }, "View path", /*#__PURE__*/React.createElement(IcSP, {
      n: "chevR",
      s: 12
    }))));
  }), ticking && /*#__PURE__*/React.createElement(TickSheetSP, {
    slug: slug,
    activity: ticking,
    variant: variant,
    onClose: () => setTicking(null)
  }));
}

/* ---------------------------------------------------------- coach -- */
function CoachCard({
  slug,
  variant
}) {
  const ask = () => {
    const prompt = "Help me set a realistic 8D Lip Design goal and tell me which skill to work on first.";
    if (window.PFAva && window.PFAva.open) window.PFAva.open(prompt);else window.location.href = variant === "web" ? "Agent.html" : "AgentMobile.html";
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "sp-root sp-card sp-coach"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-coach-ic"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "bot",
    s: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, "Ava · your AI coach"), /*#__PURE__*/React.createElement("p", {
    className: "sp-coach-t"
  }, "Your biggest constraint right now: ", /*#__PURE__*/React.createElement("b", null, "clinical confidence with lips"), "."), /*#__PURE__*/React.createElement("p", {
    className: "sp-coach-s"
  }, "From your onboarding answers (least confident: lip filler). I've routed you into the 8D Lip Design path — start with Level 1."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-link",
    onClick: ask
  }, "Ask Ava about my plan", /*#__PURE__*/React.createElement(IcSP, {
    n: "chevR",
    s: 12
  }))));
}
function SuggestedSP({
  variant
}) {
  const list = SPE && SPE.SUGGESTED || [];
  return list.map(p => /*#__PURE__*/React.createElement("section", {
    key: p.slug,
    className: "sp-root sp-card sp-suggest"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-sg-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-sg-lock"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "lock",
    s: 14
  })), /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, "Suggested by Ava · ", p.tier)), /*#__PURE__*/React.createElement("p", {
    className: "sp-sg-t"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "sp-sg-s"
  }, p.why), /*#__PURE__*/React.createElement("p", {
    className: "sp-sg-m"
  }, p.milestones, " levels · ", p.activities, " skills · content locked"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-btn sp-btn-ghost sp-btn-block",
    onClick: () => {
      window.location.href = "MembershipTier.html";
    }
  }, "Upgrade to ", p.tier, " to unlock")));
}

/* ------------------------------------------------------------- map -- */
/* Milestone-map view (user reference, 2026-10-05): one winding trail. Each
   level is a section; the lessons linked to a skill are the stones that lead
   to it; the skill card carries the "I can…" statement, step pips and the
   "This is true for me now" tick, which only unlocks once every linked
   lesson is complete. Same engine + state as the list view (PathView). */
const {
  useLayoutEffect: useLayoutEffectSP
} = React;
function lessonMetaSP(slug) {
  const L = window.PFLearnShared;
  const cur = L && L.curriculum ? L.curriculum(slug) : null;
  const flat = cur && L.flatten ? L.flatten(cur) : [];
  const m = {};
  flat.forEach(l => {
    m[l.name] = l;
  });
  return m;
}
function waypointsSP(s, only, done) {
  const wp = [];
  const seen = {};
  let n = 0;
  wp.push({
    k: "start",
    id: "start",
    done: true
  });
  s.milestones.filter(m => !only || only.indexOf(m.id) !== -1).forEach(m => {
    wp.push({
      k: "section",
      id: "sec-" + m.id,
      m: m,
      done: m.status === "achieved"
    });
    m.activities.forEach(a => {
      (a.lessons || []).forEach(name => {
        if (seen[name]) return;
        seen[name] = true;
        wp.push({
          k: "lesson",
          id: "l-" + name,
          name: name,
          done: done.indexOf(name) !== -1,
          act: a
        });
      });
      n += 1;
      wp.push({
        k: "act",
        id: "a-" + a.id,
        a: a,
        m: m,
        n: n,
        done: a.status === "done"
      });
    });
  });
  wp.push({
    k: "finish",
    id: "finish",
    done: wp.every(w => w.k === "section" || w.done),
    total: n
  });
  return wp;
}
function ActStatusSP({
  a
}) {
  const left = a.lessonsTotal - a.lessonsDone;
  return /*#__PURE__*/React.createElement("p", {
    className: "sp-m-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-m-pips",
    "aria-hidden": "true"
  }, (a.lessons || []).map((n, i) => /*#__PURE__*/React.createElement("i", {
    key: n,
    className: i < a.lessonsDone ? "on" : ""
  }))), a.status === "done" ? "Ticked " + fmtDateSP(a.tickedAt) + " · +" + a.points + " pts" : a.status === "ready" ? "Every step done — tick it when it's true in clinic" : a.status === "upgrade" ? "Part of the full path" : left === 1 ? "1 step to go" : left + " steps to go");
}
function PathMap({
  slug,
  variant = "mobile",
  onOpenLesson,
  onUpgrade,
  only,
  nextRef
}) {
  const s = useSP(slug);
  const [tickDone, setTickDone] = useStateSP(() => SPE.readDone());
  const trail = useRefSP(null);
  const svgRef = useRefSP(null);
  const pinRef = useRefSP(null);
  const [geom, setGeom] = useStateSP({
    w: 0,
    h: 0,
    segs: [],
    pin: null
  });
  /* skill details live in a popover: hover on a pointer device, tap on touch
     (user, 2026-10-05 — "keep the map, show the details on hover") */
  const [open, setOpen] = useStateSP(null);
  const canHover = useRefSP(typeof matchMedia === "function" && matchMedia("(hover: hover)").matches);
  useEffectSP(() => {
    if (!open) return;
    const away = e => {
      if (!e.target.closest || !e.target.closest(".sp-m")) setOpen(null);
    };
    const key = e => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  useEffectSP(() => {
    const sync = () => setTickDone(SPE.readDone());
    window.addEventListener("pf-lessons-done", sync);
    window.addEventListener(SPE.EVT, sync);
    return () => {
      window.removeEventListener("pf-lessons-done", sync);
      window.removeEventListener(SPE.EVT, sync);
    };
  }, []);
  const done = tickDone;
  const wp = s ? waypointsSP(s, only, done) : [];
  const anchors = wp.filter(w => w.k !== "section");
  const nextIdx = anchors.findIndex((w, i) => i > 0 && !w.done);
  const next = nextIdx > 0 ? anchors[nextIdx] : null;
  if (nextRef) nextRef.current = next;

  /* zigzag offsets + bezier connectors, re-measured on resize and state change */
  const layout = () => {
    const el = trail.current;
    if (!el) return;
    const W = el.clientWidth,
      narrow = W < 600;
    const rows = Array.from(el.querySelectorAll("[data-wp]"));
    rows.forEach(r => {
      const idx = +r.dataset.wp,
        w = Math.min(+r.dataset.w, W),
        isAct = r.dataset.k === "act";
      const x = 0.5 + 0.45 * Math.sin(idx * 0.78);
      let pad = narrow ? isAct ? 0 : x * 0.3 * (W - w) : x * (W - w);
      if (isAct && !narrow) pad = (+r.dataset.n % 2 ? 0.08 : 0.5) * (W - w);
      r.style.paddingLeft = Math.max(0, pad) + "px";
      /* which side the details popover opens on: away from the nearer edge */
      if (isAct) r.dataset.side = narrow ? "below" : pad > (W - w) / 2 ? "left" : "right";
    });
    const tr = el.getBoundingClientRect();
    const pts = Array.from(el.querySelectorAll(".sp-anchor")).map(a => {
      const r = a.getBoundingClientRect();
      return [r.left - tr.left + r.width / 2, r.top - tr.top + r.height / 2];
    });
    const segs = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i],
        b = pts[i + 1],
        dy = (b[1] - a[1]) / 2;
      segs.push({
        d: "M" + a[0] + " " + a[1] + " C" + a[0] + " " + (a[1] + dy) + " " + b[0] + " " + (b[1] - dy) + " " + b[0] + " " + b[1],
        on: !!(anchors[i + 1] && anchors[i + 1].done)
      });
    }
    /* "You are here" floats above the next lesson stone. A ready skill needs
       no pin: its node pulses gold and its label already says "Ready to tick",
       and on the compact map a pin would sit on the neighbouring row. */
    const isActNext = !!(anchors[nextIdx] && anchors[nextIdx].k === "act");
    const pin = nextIdx > 0 && pts[nextIdx] && !isActNext ? {
      x: pts[nextIdx][0],
      y: pts[nextIdx][1] - 28,
      below: false
    } : null;
    setGeom({
      w: W,
      h: el.scrollHeight,
      segs,
      pin
    });
  };
  /* observers registered once must call the latest layout (fresh anchors /
     next waypoint), not the closure from the first render */
  const layoutRef = useRefSP(layout);
  layoutRef.current = layout;
  useLayoutEffectSP(layout, [wp.length, done.length, s && s.done, s && s.ready, only ? only.join() : ""]);
  useEffectSP(() => {
    const run = () => layoutRef.current();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(run) : null;
    if (ro && trail.current) ro.observe(trail.current);
    window.addEventListener("resize", run);
    const t = setTimeout(run, 300);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", run);
      clearTimeout(t);
    };
  }, []);
  if (!s) return null;
  const meta = lessonMetaSP(slug);
  const upgrade = onUpgrade || (() => {
    window.location.href = "MembershipTier.html";
  });
  const toggle = (a, box) => {
    if (a.status === "done") {
      SPE.untick(slug, a.id);
      return;
    }
    if (a.status === "upgrade") {
      upgrade();
      return;
    }
    if (a.status !== "ready") return;
    const res = SPE.tick(slug, a.id);
    if (res && res.points) floatPtsSP(box, res.points);
  };
  const stepLabel = w => {
    const l = meta[w.name];
    return l && l.dur ? /^\d/.test(l.dur) ? l.dur.replace(/:\d\d$/, "") + " min lesson" : l.dur : "Lesson";
  };
  let idx = -1;
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-root sp-map sp-" + variant,
    ref: trail
  }, /*#__PURE__*/React.createElement("svg", {
    className: "sp-map-svg",
    width: geom.w,
    height: geom.h,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "spTrailGrad",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "var(--sp-gold-strong)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#FDC35D"
  }))), geom.segs.map((sg, i) => /*#__PURE__*/React.createElement("path", {
    key: "b" + i,
    className: "sp-seg-base",
    d: sg.d
  })), geom.segs.map((sg, i) => /*#__PURE__*/React.createElement("path", {
    key: "f" + i,
    className: "sp-seg-fill" + (sg.on ? " on" : ""),
    d: sg.d
  }))), geom.pin && /*#__PURE__*/React.createElement("span", {
    className: "sp-map-pin" + (geom.pin.below ? " below" : ""),
    ref: pinRef,
    style: {
      left: geom.pin.x,
      top: geom.pin.y
    }
  }, next && next.k === "act" && next.a.status === "ready" ? "Tick me" : "You are here"), wp.map(w => {
    if (w.k === "section") {
      return /*#__PURE__*/React.createElement("div", {
        key: w.id,
        id: "sp-" + w.id,
        className: "sp-map-sec sp-map-sec-" + w.m.status
      }, /*#__PURE__*/React.createElement("p", {
        className: "sp-eyebrow"
      }, "Level ", w.m.level, " · ", w.m.subStream, w.m.status === "achieved" && /*#__PURE__*/React.createElement("em", {
        className: "sp-goal-tag"
      }, /*#__PURE__*/React.createElement(IcSP, {
        n: "trophy",
        s: 11
      }), "Achieved")), /*#__PURE__*/React.createElement("h2", null, w.m.title), /*#__PURE__*/React.createElement("p", {
        className: "sp-map-sec-s"
      }, "“", w.m.statement, "”"), /*#__PURE__*/React.createElement("p", {
        className: "sp-map-sec-m"
      }, w.m.done, " of ", w.m.total, " skills · ", w.m.points, " pts when all are ticked"));
    }
    idx += 1;
    if (w.k === "start") return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      className: "sp-map-row",
      "data-wp": idx,
      "data-w": "200",
      "data-k": "start"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-map-node sp-map-start"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sp-anchor sp-map-dot"
    }, /*#__PURE__*/React.createElement(IcSP, {
      n: "route",
      s: 20
    })), /*#__PURE__*/React.createElement("span", null, "Start here")));
    if (w.k === "finish") return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      className: "sp-map-row",
      "data-wp": idx,
      "data-w": "280",
      "data-k": "finish"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-map-node sp-map-finish" + (w.done ? " done" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "sp-anchor sp-map-dot"
    }, /*#__PURE__*/React.createElement(IcSP, {
      n: "trophy",
      s: 24
    })), /*#__PURE__*/React.createElement("span", null, s.title, " path complete", /*#__PURE__*/React.createElement("small", null, w.done ? "All " + w.total + " skills ticked" : "Tick all " + w.total + " skills"))));
    if (w.k === "lesson") return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      id: "sp-" + w.id,
      className: "sp-map-row",
      "data-wp": idx,
      "data-w": "320",
      "data-k": "lesson"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sp-step" + (w.done ? " done" : ""),
      onClick: () => onOpenLesson && onOpenLesson(w.name),
      "aria-label": w.name + (w.done ? ", completed" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "sp-anchor sp-stone"
    }, w.done ? /*#__PURE__*/React.createElement(IcSP, {
      n: "check",
      s: 16,
      w: 3
    }) : /*#__PURE__*/React.createElement(IcSP, {
      n: "play",
      s: 14
    })), /*#__PURE__*/React.createElement("span", {
      className: "sp-step-tx"
    }, /*#__PURE__*/React.createElement("b", null, w.name), /*#__PURE__*/React.createElement("i", null, w.done ? "Completed" : stepLabel(w)))));
    const a = w.a;
    const isOpen = open === a.id;
    const left = a.lessonsTotal - a.lessonsDone;
    const brief = a.status === "done" ? "Ticked · +" + a.points + " pts" : a.status === "ready" ? "Ready to tick" : a.status === "upgrade" ? "Locked · full path" : left === 1 ? "1 step to go" : left + " steps to go";
    const hoverProps = canHover.current ? {
      onMouseEnter: () => setOpen(a.id),
      onMouseLeave: () => setOpen(o => o === a.id ? null : o)
    } : {};
    return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      id: "sp-" + w.id,
      className: "sp-map-row" + (isOpen ? " sp-row-open" : ""),
      "data-wp": idx,
      "data-w": "330",
      "data-k": "act",
      "data-n": w.n
    }, /*#__PURE__*/React.createElement("div", {
      className: "sp-m sp-m-" + a.status + (isOpen ? " open" : ""),
      ...hoverProps
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sp-m-head",
      "aria-expanded": isOpen,
      "aria-controls": "sp-pop-" + a.id,
      onClick: () => setOpen(isOpen ? null : a.id),
      onFocus: () => setOpen(a.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "sp-anchor sp-mnode",
      "aria-hidden": "true"
    }, a.status === "done" ? /*#__PURE__*/React.createElement(IcSP, {
      n: "check",
      s: 24,
      w: 3
    }) : a.status === "upgrade" ? /*#__PURE__*/React.createElement(IcSP, {
      n: "lock",
      s: 18
    }) : /*#__PURE__*/React.createElement("b", null, w.n)), /*#__PURE__*/React.createElement("span", {
      className: "sp-m-label"
    }, /*#__PURE__*/React.createElement("b", null, "“", a.text, "”"), /*#__PURE__*/React.createElement("i", null, "Skill ", w.n, " of ", s.total, " · ", brief))), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "sp-mcard sp-mpop",
      id: "sp-pop-" + a.id,
      role: "dialog",
      "aria-label": "Skill " + w.n
    }, /*#__PURE__*/React.createElement("p", {
      className: "sp-m-meta"
    }, "Skill ", w.n, " of ", s.total, /*#__PURE__*/React.createElement("span", {
      className: "sp-chip"
    }, a.subCourse)), /*#__PURE__*/React.createElement("p", {
      className: "sp-m-ican"
    }, "“", a.text, "”"), /*#__PURE__*/React.createElement(ActStatusSP, {
      a: a
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sp-m-tick",
      role: "checkbox",
      "aria-checked": a.status === "done",
      disabled: a.status === "locked",
      onClick: e => toggle(a, e.currentTarget.querySelector(".sp-m-box"))
    }, /*#__PURE__*/React.createElement("span", {
      className: "sp-m-box"
    }, /*#__PURE__*/React.createElement(IcSP, {
      n: "check",
      s: 20,
      w: 3
    })), /*#__PURE__*/React.createElement("span", {
      className: "sp-m-tick-tx"
    }, /*#__PURE__*/React.createElement("strong", null, "This is true for me now"), /*#__PURE__*/React.createElement("small", null, a.status === "done" ? "Ticked — tap to untick" : a.status === "ready" ? "+" + a.points + " points" : a.status === "upgrade" ? "Unlock the full path to tick this skill" : "Unlocks when you finish the steps above"))), a.status === "locked" && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sp-link sp-demo sp-m-demo",
      onClick: () => SPE.watchLessons(slug, a.id),
      title: "Prototype only"
    }, "Demo: mark the steps watched"))));
  }));
}

/* sticky "Your progress" panel beside the map (web) / above it (mobile) */
/* ------------------------------------------------------- journey -- */
/* Straight vertical journey (user, 2026-10-05 — "the map is still
   confusing"): one spine, Level markers on it, each skill a station card
   that lists the lessons that unlock it and carries the tick. The current
   station (ready, or the next locked one) is open; ticked and future ones
   collapse to a single line. Same engine, same ids as the map, so the
   Up next card and level links scroll to the same places. */
function statusPillSP(a) {
  const left = a.lessonsTotal - a.lessonsDone;
  if (a.status === "done") return {
    cls: "done",
    text: "Completed"
  };
  if (a.status === "ready") return {
    cls: "ready",
    text: "Ready to tick · +" + a.points + " pts"
  };
  if (a.status === "upgrade") return {
    cls: "lock",
    text: "Locked"
  };
  return {
    cls: "todo",
    text: left === 1 ? "1 lesson to watch" : left + " lessons to watch"
  };
}
/* No self-declared tick (user, 2026-10-05): the skill completes on its own
   once its lessons are watched in the course, and Dr Tim's splash takes over. */
/* 2026-10-07 (user): the card IS the task — eyebrow (chapter = link to the
   lesson), the "I can…" statement, then state: LOCKED (lock box, "Watch n
   more lessons to unlock", lesson link + demo chip) until every linked lesson
   is complete; READY (gold box, tap to tick); DONE (green box, tap to untick).
   Finishing the lesson in the course completes the skill on its own with the
   3s reward splash, then the page reopens the path at the next skill. */
function JourneySkill({
  a,
  n,
  total,
  slug,
  onUpgrade,
  onOpenLesson
}) {
  const firstLesson = (a.lessons || [])[0];
  const pill = statusPillSP(a);
  const isDone = a.status === "done";
  const left = a.lessonsTotal - a.lessonsDone;
  const firstLeft = (a.lessons || []).filter(x => SPE.readDone().indexOf(x) === -1)[0];
  const tickToggle = e => {
    if (isDone) {
      SPE.untick(slug, a.id);
      return;
    }
    if (a.status === "upgrade") {
      onUpgrade && onUpgrade();
      return;
    }
    if (a.status === "locked") {
      if (onOpenLesson && firstLeft) onOpenLesson(firstLeft);
      return;
    }
    const box = e.currentTarget;
    const res = SPE.tick(slug, a.id);
    if (res && res.points) floatPtsSP(box, res.points);
  };
  const boxIcon = isDone || a.status === "ready" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "check",
    s: 14,
    w: 3.2
  }) : /*#__PURE__*/React.createElement(IcSP, {
    n: "lock",
    s: 12
  });
  const pillEl = a.status === "ready" || isDone ? /*#__PURE__*/React.createElement("span", {
    className: "sp-j-pill sp-j-pill-" + pill.cls
  }, pill.cls === "done" && /*#__PURE__*/React.createElement(IcSP, {
    n: "check",
    s: 11,
    w: 3
  }), pill.text) : null;
  return /*#__PURE__*/React.createElement("div", {
    id: "sp-a-" + a.id,
    className: "sp-j-item sp-j-skill sp-j-" + a.status + (isDone ? " done sp-m-done" : a.status === "ready" ? " sp-m-ready" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-j-node",
    "aria-hidden": "true"
  }, isDone ? /*#__PURE__*/React.createElement(IcSP, {
    n: "check",
    s: 18,
    w: 3
  }) : a.status === "upgrade" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "lock",
    s: 14
  }) : /*#__PURE__*/React.createElement("b", null, n)), /*#__PURE__*/React.createElement("div", {
    className: "sp-j-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-j-head sp-j-head-tick"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-j-toprow"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-m-box sp-j-box" + (isDone || a.status === "ready" ? "" : " sp-j-box-locked"),
    role: "checkbox",
    "aria-checked": isDone,
    "aria-disabled": a.status === "locked" || a.status === "upgrade",
    "aria-label": isDone ? "Untick: " + a.text : a.status === "ready" ? "Tick: " + a.text : "Locked: " + a.text,
    onClick: tickToggle
  }, boxIcon), pillEl), /*#__PURE__*/React.createElement("span", {
    className: "sp-j-head-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-j-meta"
  }, "Skill ", n, " of ", total, " · ", onOpenLesson && firstLesson ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-j-metalink",
    onClick: () => onOpenLesson(firstLesson),
    "aria-label": "Open " + firstLesson + " in the course"
  }, a.subCourse) : a.subCourse), /*#__PURE__*/React.createElement("span", {
    className: "sp-j-title"
  }, a.text), a.status === "locked" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "sp-j-lock-hint"
  }, "Watch ", left === 1 ? "1 more lesson" : left + " more lessons", " to unlock · +", a.points, " pts"), onOpenLesson && firstLeft && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-j-lessonbtn",
    onClick: () => onOpenLesson(firstLeft),
    "aria-label": "Watch the lesson " + firstLeft + " in the course"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-j-lessonbtn-ic"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "play",
    s: 13
  })), /*#__PURE__*/React.createElement("span", {
    className: "sp-j-lessonbtn-tx"
  }, /*#__PURE__*/React.createElement("b", null, firstLeft)), /*#__PURE__*/React.createElement(IcSP, {
    n: "arrowR",
    s: 16
  }))), a.status === "upgrade" && /*#__PURE__*/React.createElement("span", {
    className: "sp-j-lock-hint"
  }, "Part of the full 8D Lip Design path. ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-link",
    onClick: onUpgrade
  }, "Unlock with Mastery"))))));
}
function PathJourney({
  slug,
  variant = "mobile",
  onOpenLesson,
  onUpgrade,
  only
}) {
  const s = useSP(slug);
  const [openIds, setOpenIds] = useStateSP(null);
  const [, bump] = useStateSP(0);
  /* ?skill=<id> (from the splash's "Proceed" on another page) and the
     splash's go-skill event on this page open that station and scroll to it */
  const focusSkill = id => {
    if (!id) return;
    setOpenIds(o => (o || []).concat([id]));
    setTimeout(() => {
      const el = document.getElementById("sp-a-" + id);
      if (el) el.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 80);
  };
  useEffectSP(() => {
    const sync = () => bump(x => x + 1);
    const onEvt = e => {
      sync();
      if (e && e.detail && e.detail.type === "go-skill") focusSkill(e.detail.id);
    };
    window.addEventListener("pf-lessons-done", sync);
    window.addEventListener(SPE.EVT, onEvt);
    let want = new URLSearchParams(window.location.search).get("skill");
    try {
      const f = sessionStorage.getItem("pf-sp-focus");
      if (f) {
        want = f;
        sessionStorage.removeItem("pf-sp-focus");
      }
    } catch (e) {}
    if (want) setTimeout(() => focusSkill(want), 400);
    return () => {
      window.removeEventListener("pf-lessons-done", sync);
      window.removeEventListener(SPE.EVT, onEvt);
    };
  }, []);
  if (!s) return null;
  const meta = lessonMetaSP(slug);
  const upgrade = onUpgrade || (() => {
    window.location.href = "MembershipTier.html";
  });
  const levels = levelListSP(s, only);
  const acts = [].concat.apply([], levels.map(m => m.activities));
  const nextAct = acts.filter(a => a.status === "ready")[0] || acts.filter(a => a.status === "locked")[0] || null;
  /* open = the next skill to work on (plus anything the member or the splash opened) */
  const defaults = acts.filter(a => a.status === "ready" || nextAct && a.id === nextAct.id).map(a => a.id);
  const open = openIds ? defaults.concat(openIds.filter(id => defaults.indexOf(id) === -1)).filter(id => openIds.indexOf(id) !== -1 || !openIds.length || defaults.indexOf(id) !== -1) : defaults;
  const toggle = id => setOpenIds(open.indexOf(id) !== -1 ? open.filter(x => x !== id) : open.concat([id]));
  const total = acts.length,
    doneN = acts.filter(a => a.status === "done").length;
  let n = 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-root sp-j sp-" + variant
  }, levels.map(m => /*#__PURE__*/React.createElement(React.Fragment, {
    key: m.id
  }, /*#__PURE__*/React.createElement("div", {
    id: "sp-sec-" + m.id,
    className: "sp-j-item sp-j-level sp-j-level-" + m.status + (m.status === "achieved" ? " done" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-j-node sp-j-medal",
    "aria-hidden": "true"
  }, m.status === "achieved" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "trophy",
    s: 18
  }) : m.status === "upgrade" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "lock",
    s: 14
  }) : /*#__PURE__*/React.createElement("b", null, romanSP(m.level))), /*#__PURE__*/React.createElement("div", {
    className: "sp-j-level-tx"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, "Level ", m.level, " · ", m.subStream), /*#__PURE__*/React.createElement("h2", null, m.title), /*#__PURE__*/React.createElement("p", {
    className: "sp-j-level-s"
  }, "“", m.statement, "”"), /*#__PURE__*/React.createElement("p", {
    className: "sp-j-level-m"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: m.pct + "%"
    }
  })), m.status === "achieved" ? "Achieved " + fmtDateSP(m.achievedAt) + " · +" + m.points + " pts" : m.done + " of " + m.total + " skills · +" + m.points + " pts when all are ticked"))), m.activities.map(a => {
    n += 1;
    return /*#__PURE__*/React.createElement(JourneySkill, {
      key: a.id,
      a: a,
      n: n,
      total: total,
      slug: slug,
      onUpgrade: upgrade,
      onOpenLesson: onOpenLesson
    });
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sp-j-item sp-j-finish" + (doneN === total ? " done" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-j-node sp-j-node-finish",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "trophy",
    s: 20
  })), /*#__PURE__*/React.createElement("p", {
    className: "sp-j-startline"
  }, /*#__PURE__*/React.createElement("b", null, doneN === total ? "Path complete" : s.title + " path complete"), /*#__PURE__*/React.createElement("br", null), doneN === total ? "All " + total + " skills ticked." : "Tick all " + total + " skills · " + doneN + " done so far")));
}

/* hub redesign (user, 2026-10-05): the numbers live in the hero, the levels
   in an overview strip, and this card is purely "what do I do next" */
function levelListSP(s, only) {
  return s.milestones.filter(m => !only || only.indexOf(m.id) !== -1);
}
function scrollToSP(id, block) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({
    behavior: "smooth",
    block: block || "center"
  });
}
function HeroStatsSP({
  s,
  only
}) {
  const list = levelListSP(s, only);
  const total = list.reduce((t, m) => t + m.total, 0),
    done = list.reduce((t, m) => t + m.done, 0);
  const pct = total ? Math.round(done / total * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-hero-stats",
    "data-screen-label": "Your progress"
  }, /*#__PURE__*/React.createElement(RingSP, {
    pct: pct,
    size: 72,
    stroke: 7
  }), /*#__PURE__*/React.createElement("p", {
    className: "sp-stat"
  }, /*#__PURE__*/React.createElement("b", null, done, /*#__PURE__*/React.createElement("span", {
    className: "sp-of"
  }, "/", total)), /*#__PURE__*/React.createElement("span", null, "skills completed")), /*#__PURE__*/React.createElement("p", {
    className: "sp-stat"
  }, /*#__PURE__*/React.createElement("b", null, list.filter(m => m.status === "achieved").length, /*#__PURE__*/React.createElement("span", {
    className: "sp-of"
  }, "/", list.length)), /*#__PURE__*/React.createElement("span", null, "levels achieved")), /*#__PURE__*/React.createElement("p", {
    className: "sp-stat sp-stat-pts"
  }, /*#__PURE__*/React.createElement("b", null, fmtN(s.earned)), /*#__PURE__*/React.createElement("span", null, "points earned")));
}
function LevelStrip({
  s,
  only
}) {
  const list = levelListSP(s, only);
  const current = s.current;
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-levels",
    role: "list",
    "aria-label": "Levels"
  }, list.map(m => /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "listitem",
    key: m.id,
    className: "sp-lv sp-lv-" + m.status + (current && current.id === m.id ? " is-current" : ""),
    onClick: () => scrollToSP("sp-sec-" + m.id, "start"),
    "aria-label": "Level " + m.level + " · " + m.title + " · " + m.done + " of " + m.total + " skills"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-lv-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sp-lv-medal",
    "aria-hidden": "true"
  }, m.status === "achieved" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "check",
    s: 13,
    w: 3
  }) : m.status === "upgrade" ? /*#__PURE__*/React.createElement(IcSP, {
    n: "lock",
    s: 11
  }) : romanSP(m.level)), /*#__PURE__*/React.createElement("span", {
    className: "sp-lv-k"
  }, "Level ", m.level)), /*#__PURE__*/React.createElement("span", {
    className: "sp-lv-t"
  }, m.title), /*#__PURE__*/React.createElement("span", {
    className: "sp-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: m.pct + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "sp-lv-m"
  }, m.status === "achieved" ? "Achieved · +" + m.points + " pts" : m.status === "upgrade" ? "Locked" : m.done + " of " + m.total + " skills"))));
}
function ProgressPanel({
  slug,
  only,
  nextRef,
  variant,
  onGoal
}) {
  const s = useSP(slug);
  if (!s) return null;
  const list = levelListSP(s, only);
  const total = list.reduce((t, m) => t + m.total, 0),
    done = list.reduce((t, m) => t + m.done, 0);
  /* computed from state (not the map's ref): on mobile this card renders
     above the map, before the ref is filled */
  const anchors = waypointsSP(s, only, SPE.readDone()).filter(w => w.k !== "section");
  const next = anchors.find((w, i) => i > 0 && !w.done) || null;
  return /*#__PURE__*/React.createElement("section", {
    className: "sp-root sp-card sp-nextcard",
    "data-screen-label": "Up next"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, "Up next"), next ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-next",
    onClick: () => scrollToSP("sp-" + next.id)
  }, /*#__PURE__*/React.createElement("small", null, next.k === "act" ? next.a.status === "ready" ? "Ready to tick · +" + next.a.points + " pts" : "Next skill" : next.k === "finish" ? "Almost there" : "Watch next"), /*#__PURE__*/React.createElement("b", null, next.k === "lesson" ? next.name : next.k === "act" ? "“" + next.a.text + "”" : "Finish the path")) : /*#__PURE__*/React.createElement("p", {
    className: "sp-progress-done"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "trophy",
    s: 16
  }), "Every skill on this path is ticked."), !only && onGoal && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-goal" + (s.goal ? " set" : ""),
    onClick: onGoal
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "target",
    s: 16
  }), s.goal && s.goalMilestone ? /*#__PURE__*/React.createElement("span", null, "Goal: ", /*#__PURE__*/React.createElement("b", null, "Level ", s.goalMilestone.level), " by ", fmtDateSP(s.goal.date), " ", s.goalMilestone.status === "achieved" ? "· met 🎉" : "· " + (s.goalMilestone.total - s.goalMilestone.done) + " skills to go") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Set a goal"), " — you're 50% more likely to get there"), /*#__PURE__*/React.createElement(IcSP, {
    n: "chevR",
    s: 16
  })), /*#__PURE__*/React.createElement("p", {
    className: "sp-nextcard-m"
  }, done, " of ", total, " skills ticked · ", /*#__PURE__*/React.createElement("b", null, fmtN(s.earned)), " pts earned"));
}

/* ------------------------------------------------------------- hub -- */
function Hub({
  slug = "8d-lip-design",
  variant = "mobile",
  onBack
}) {
  const s = useSP(slug);
  const q = new URLSearchParams(window.location.search);
  const [tab, setTab] = useStateSP(() => SPE && SPE.view() === "starter" || q.get("tab") === "starter" ? "starter" : "full");
  const [goalOpen, setGoalOpen] = useStateSP(() => q.get("goal") === "1");
  /* Map (default) or List; ?view=list opens the list. The map's "next up"
     waypoint is shared with the progress panel through a ref. */
  const [view, setView] = useStateSP(() => q.get("view") === "list" ? "list" : "map");
  const nextRef = useRefSP(null);
  if (!s) return null;
  const starter = s.view === "starter";
  const openLesson = name => {
    const cur = window.PFLearnShared && window.PFLearnShared.curriculum(slug);
    const flat = cur ? window.PFLearnShared.flatten(cur) : [];
    const l = flat.filter(x => x.name === name)[0];
    const qs = l ? "&level=" + l.li + "&module=" + l.si + "&lesson=" + l.ni + (l.subIdx != null ? "&sub=" + l.subIdx : "") : "";
    /* from=path: the course page sends the member back here after the skill splash */
    window.location.href = (variant === "web" ? "LessonWeb.html?course=" : "CourseDetail.html?play=1&course=") + slug + qs + "&from=path";
  };
  const courseUrl = (variant === "web" ? "CourseWeb.html?course=" : "CourseDetail.html?course=") + slug;
  const only = tab === "starter" ? ["M1"] : null;
  const skillsN = levelListSP(s, only).reduce((t, m) => t + m.total, 0);
  const levelsN = levelListSP(s, only).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "sp-root sp-hub sp-hub2 sp-" + variant
  }, /*#__PURE__*/React.createElement("header", {
    className: "sp-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-hero-tx"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, "Success Path · Clinical skills"), /*#__PURE__*/React.createElement("h1", {
    className: "sp-hub-t"
  }, tab === "starter" ? "Free Starter Path" : s.title), /*#__PURE__*/React.createElement("p", {
    className: "sp-hub-s"
  }, tab === "starter" ? "Five skills every lip injector needs, included with your Confidence membership. Your progress carries straight into the full 8D path." : skillsN + " skills across " + levelsN + " levels. Watch each skill's lessons in the course and it completes on its own — every skill and every level earns points."), /*#__PURE__*/React.createElement("div", {
    className: "sp-paths",
    role: "tablist",
    "aria-label": "Path"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": tab === "full",
    className: "sp-path-pill" + (tab === "full" ? " on" : ""),
    onClick: () => setTab("full")
  }, "8D Lip Design"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": tab === "starter",
    className: "sp-path-pill" + (tab === "starter" ? " on" : ""),
    onClick: () => setTab("starter")
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "gift",
    s: 13
  }), "Free Starter Path"))), /*#__PURE__*/React.createElement(HeroStatsSP, {
    s: s,
    only: only
  })), tab === "full" && starter && /*#__PURE__*/React.createElement("div", {
    className: "sp-card sp-starter-note warn"
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "lock",
    s: 18
  }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Viewing as a Tier 1 member without 8D Lip Design."), " Level 1 is free; Levels 2–5 unlock with the course or Mastery.")), variant === "web" && /*#__PURE__*/React.createElement("div", {
    className: "sp-hub-row"
  }, /*#__PURE__*/React.createElement(CoachCard, {
    slug: slug,
    variant: variant
  }), /*#__PURE__*/React.createElement(SuggestedSP, {
    variant: variant
  })), /*#__PURE__*/React.createElement("div", {
    className: "sp-hub-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-hub-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sp-map-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "sp-h2"
  }, "Your path"), /*#__PURE__*/React.createElement("p", null, "Each skill lists the lessons that unlock it. Watch them in the course and the skill completes on its own."))), /*#__PURE__*/React.createElement(PathJourney, {
    key: "journey-" + tab,
    slug: slug,
    variant: variant,
    only: only,
    onOpenLesson: openLesson
  }), /*#__PURE__*/React.createElement("div", {
    className: "sp-hub-links"
  }, /*#__PURE__*/React.createElement("a", {
    className: "sp-link",
    href: courseUrl
  }, "Open the 8D Lip Design course", /*#__PURE__*/React.createElement(IcSP, {
    n: "chevR",
    s: 12
  }))), /*#__PURE__*/React.createElement("section", {
    className: "sp-root sp-demo-card",
    "data-screen-label": "Dev only"
  }, /*#__PURE__*/React.createElement("p", {
    className: "sp-eyebrow"
  }, "Dev only"), /*#__PURE__*/React.createElement("div", {
    className: "sp-demo-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-chip",
    onClick: () => {
      SPE.reset(slug);
      SPE.resetLessons(slug);
    }
  }, /*#__PURE__*/React.createElement(IcSP, {
    n: "undo",
    s: 12
  }), "Reset path"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-chip",
    onClick: () => {
      const n = (s.activities || []).filter(a => a.status === "locked")[0];
      if (n) SPE.watchLessons(slug, n.id);
    }
  }, "Complete next skill's lessons"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-chip",
    onClick: () => SPE.setView(starter ? "full" : "starter")
  }, starter ? "View as 8D owner" : "View as Tier 1 (no 8D)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sp-chip",
    onClick: () => setGoalOpen(true)
  }, "Goal sheet")))), variant !== "web" && /*#__PURE__*/React.createElement("aside", {
    className: "sp-hub-side"
  }, /*#__PURE__*/React.createElement(CoachCard, {
    slug: slug,
    variant: variant
  }), /*#__PURE__*/React.createElement(SuggestedSP, {
    variant: variant
  }))), goalOpen && /*#__PURE__*/React.createElement(GoalSheetSP, {
    slug: slug,
    variant: variant,
    onClose: () => setGoalOpen(false)
  }));
}
window.PFSuccessPathUI = {
  CourseCard,
  PathView,
  PathMap,
  PathJourney,
  ProgressPanel,
  PathSheet,
  LessonCard,
  Hub,
  CoachCard,
  GoalSheet: GoalSheetSP,
  useSP,
  Icon: IcSP
};
