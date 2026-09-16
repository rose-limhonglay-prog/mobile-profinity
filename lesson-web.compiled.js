/* ===========================================================================
   PROfinity — Lesson (web)
   Desktop port of the mobile lesson player (LXPlayer in lesson-confidence.jsx):
   real <video> playback with our own chrome + theatre mode, the paged PDF
   reader, the inline success-path quiz (80% pass gate), the collapsible
   course-progress strip, Details / Resources tabs, lesson meta chips, "In this
   lesson", "Up next", Share lesson modal, comments, Ava card, and the sticky
   state-aware CTA (Mark complete & continue / Next lesson / Finish course /
   Course complete) — plus the web-only outline sidebar and module-boundary
   toast. Reached from CourseWeb.html (course-web.jsx).

   URL contract (PFLearn.lessonUrl builds these):
     ?course=<slug>&level=&module=&lesson=[&sub=]   mobile shape (CourseDetail / Module / SubModule / LearningMobile)
     ?course=<slug>&lesson=<flatIdx>               legacy web shape (no level/module on the URL)
     ?course=<slug>&title=&price=&dur=             generic course (same tail CourseWeb takes)
     &share=1                                      open the Share lesson modal
   Selecting another lesson pushes a history entry with the mobile shape, so
   back/forward walk the lessons; 8d-lips is an alias for 8d-lip-design.

   Completion writes BOTH the shared name-keyed pf-lessons-done store
   (PFLearn.markDone — the phone reads the same key) and the web resume pointer
   pf-lesson-progress-<slug> ({completed:[flatIdx], activeIdx}). Data + helpers
   from course-data-web.js (window.PFCourseData). Suffixed -LW.
   =========================================================================== */
const {
  useState: useStateLW,
  useEffect: useEffectLW,
  useRef: useRefLW,
  useMemo: useMemoLW
} = React;
const DSLW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavLW,
  IconifyIcon: IconLW,
  Avatar: AvatarLW
} = DSLW;
const CDL = window.PFCourseData;
const PFLW = window.PFLearn;
const ME_LW = {
  name: CDL.ME.fullName,
  role: CDL.ME.role,
  avatar: CDL.ME.avatar
};
const LW_PARAMS = new URLSearchParams(window.location.search);
const INK_LW = {
  gold: "var(--cd-gold)",
  text: "var(--cd-text)",
  muted: "var(--cd-text-3)",
  success: "var(--cd-success)",
  onNavy: "#FFFFFF",
  onGold: "var(--cd-on-gold)",
  heading: "var(--cd-heading)"
};
function goLW(url) {
  CDL.go(url);
}
/* Member → profile links (profile-link.js); inert pass-through if the script is absent. */
const ProfileLinkLW = window.PFProfileLink && window.PFProfileLink.Link || function ({
  children
}) {
  return children;
};
function openProfileLW(a) {
  return !!(window.PFProfileLink && window.PFProfileLink.open(a));
}
function navigateLW(label) {
  const u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": PFLW.myLearningUrl,
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goLW(u);
}
const LW_COURSE = CDL.resolveCourse(LW_PARAMS);

/* ---------------------------------------------------------------- crumb -- */
function LWCrumb({
  course,
  item,
  outlineVisible,
  onToggleOutline,
  onShare,
  locked
}) {
  const back = CDL.courseUrlAt(course, item);
  return /*#__PURE__*/React.createElement("div", {
    className: "lw-crumb-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lw-back-btn",
    "aria-label": "Back to course",
    onClick: () => goLW(back)
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:arrow-left",
    size: 19,
    color: INK_LW.heading
  })), /*#__PURE__*/React.createElement("span", {
    className: "lw-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goLW(PFLW.myLearningUrl)
  }, "My Learning"), " \xA0/\xA0", " ", /*#__PURE__*/React.createElement("a", {
    onClick: () => goLW(back)
  }, course.title), " \xA0/\xA0", " ", /*#__PURE__*/React.createElement("span", {
    className: "current"
  }, item.name)), /*#__PURE__*/React.createElement("div", {
    className: "lw-spacer"
  }), !locked && /*#__PURE__*/React.createElement("div", {
    className: "lw-tools"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lw-tool",
    onClick: onShare
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:share-2",
    size: 16,
    color: INK_LW.heading
  }), "Share lesson"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lw-tool",
    onClick: onToggleOutline,
    "aria-pressed": outlineVisible
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:list",
    size: 17,
    color: INK_LW.heading
  }), outlineVisible ? "Hide outline" : "Course outline")));
}

/* ---------------------------------------------------------------- video -- */
function LWVideo({
  item,
  course,
  onComplete,
  onPrev,
  onNext,
  theatre,
  onTheatre
}) {
  const ref = useRefLW(null);
  const [v, setV] = useStateLW({
    playing: false,
    started: false,
    ended: false,
    muted: false,
    cur: 0,
    dur: 0
  });
  const [chrome, setChrome] = useStateLW(true);
  const hideTimer = useRefLW(null);
  const doneRef = useRefLW(false);
  useEffectLW(() => {
    doneRef.current = false;
    setV({
      playing: false,
      started: false,
      ended: false,
      muted: false,
      cur: 0,
      dur: 0
    });
    setChrome(true);
    const el = ref.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
      el.muted = false;
      el.load();
    }
    return () => clearTimeout(hideTimer.current);
  }, [item.name]);
  useEffectLW(() => {
    if (!theatre) return;
    const onKey = e => {
      if (e.key === "Escape") onTheatre(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theatre]);
  const poke = () => {
    setChrome(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChrome(false), 2800);
  };
  const el = () => ref.current;
  const toggle = () => {
    const e = el();
    if (!e) return;
    if (e.paused) e.play().catch(() => {});else e.pause();
    poke();
  };
  const skip = d => {
    const e = el();
    if (!e) return;
    e.currentTime = Math.max(0, Math.min(e.duration || 0, e.currentTime + d));
    poke();
  };
  const seek = ev => {
    const e = el();
    if (!e || !e.duration) return;
    e.currentTime = Number(ev.target.value) / 1000 * e.duration;
    poke();
  };
  const mute = () => {
    const e = el();
    if (!e) return;
    e.muted = !e.muted;
    setV(s => ({
      ...s,
      muted: e.muted
    }));
    poke();
  };
  const stop = e => e.stopPropagation();
  const onTime = () => {
    const e = el();
    if (!e) return;
    setV(s => ({
      ...s,
      cur: e.currentTime,
      dur: e.duration || 0
    }));
    if (!doneRef.current && e.duration && e.currentTime / e.duration >= 0.9) {
      doneRef.current = true;
      onComplete();
    }
  };
  const onEnded = () => {
    setV(s => ({
      ...s,
      playing: false,
      ended: true
    }));
    setChrome(true);
    if (!doneRef.current) {
      doneRef.current = true;
      onComplete();
    }
  };
  const pct = v.dur ? v.cur / v.dur * 100 : 0;
  const showChrome = chrome || !v.playing;
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-media cd-video" + (showChrome ? " chrome" : "") + (theatre ? " theatre" : ""),
    "data-screen-label": theatre ? "Video · theatre" : "Video",
    onClick: toggle,
    onMouseMove: poke,
    onMouseLeave: () => {
      if (v.playing) setChrome(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-vstage"
  }, /*#__PURE__*/React.createElement("video", {
    ref: ref,
    src: CDL.VIDEO_SRC,
    poster: course.still,
    playsInline: true,
    preload: "metadata",
    onPlay: () => setV(s => ({
      ...s,
      playing: true,
      started: true,
      ended: false
    })),
    onPause: () => setV(s => ({
      ...s,
      playing: false
    })),
    onTimeUpdate: onTime,
    onLoadedMetadata: onTime,
    onEnded: onEnded
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-vshade",
    "aria-hidden": "true"
  }), !v.started && /*#__PURE__*/React.createElement("span", {
    className: "cd-vdur",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:clock",
    size: 12,
    color: "#fff"
  }), item.dur), /*#__PURE__*/React.createElement("div", {
    className: "cd-vtop",
    onClick: stop
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-vtop-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-vtop-eyebrow"
  }, CDL.eyebrow(item, course)), /*#__PURE__*/React.createElement("br", null), item.name), theatre && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vplain",
    "aria-label": "Exit theatre mode",
    onClick: () => onTheatre(false)
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:minimize",
    size: 20,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cd-vcenter",
    onClick: stop
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vplain",
    "aria-label": "Previous lesson",
    disabled: !onPrev,
    onClick: () => onPrev && onPrev()
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:skip-back",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vskip",
    "aria-label": "Back 10 seconds",
    onClick: () => skip(-10)
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:rotate-ccw",
    size: 22,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", null, "10")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vbig" + (v.playing ? " paused" : ""),
    "aria-label": v.ended ? "Replay" : v.playing ? "Pause" : "Play",
    onClick: toggle
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: v.ended ? "lucide:rotate-ccw" : v.playing ? "lucide:pause" : "fluent:play-16-filled",
    size: 28,
    color: "#0B1024"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vskip",
    "aria-label": "Forward 10 seconds",
    onClick: () => skip(10)
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:rotate-cw",
    size: 22,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", null, "10")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vplain",
    "aria-label": "Next lesson",
    disabled: !onNext,
    onClick: () => onNext && onNext()
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:skip-forward",
    size: 22,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cd-vbar",
    onClick: stop
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-vtime"
  }, CDL.fmtTime(v.cur)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "cd-vrange",
    min: 0,
    max: 1000,
    value: Math.round(pct * 10),
    onChange: seek,
    "aria-label": "Seek",
    style: {
      "--fill": pct + "%"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "cd-vtime end"
  }, v.dur ? CDL.fmtTime(v.dur) : item.dur), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vic",
    "aria-label": v.muted ? "Unmute" : "Mute",
    onClick: mute
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: v.muted ? "lucide:volume-x" : "lucide:volume-2",
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vic",
    "aria-label": theatre ? "Exit theatre mode" : "Theatre mode",
    onClick: () => onTheatre(!theatre)
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: theatre ? "lucide:minimize" : "lucide:maximize",
    size: 17,
    color: "#fff"
  })))));
}

/* ---------------------------------------------------------------- PDF reader -- */
function LWDoc({
  item,
  course,
  onComplete,
  onToast
}) {
  const pages = useMemoLW(() => CDL.pdfPages(item, course), [item.name]);
  const [p, setP] = useStateLW(0);
  useEffectLW(() => {
    setP(0);
  }, [item.name]);
  useEffectLW(() => {
    if (p === pages.length - 1) onComplete();
  }, [p, pages.length]);
  const pg = pages[p];
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-media cd-doc",
    "data-screen-label": "PDF"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-doc-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-doc-name"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:file-text",
    size: 15,
    color: "#fff"
  }), item.name), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-vic",
    "aria-label": "Download PDF",
    onClick: () => onToast("Downloading " + item.name)
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:download",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cd-page",
    key: p
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-page-hd"
  }, /*#__PURE__*/React.createElement("span", null, "PROfinity Academy"), /*#__PURE__*/React.createElement("span", null, course.title)), /*#__PURE__*/React.createElement("h3", null, pg.heading), pg.sub && /*#__PURE__*/React.createElement("p", {
    className: "cd-page-sub"
  }, pg.sub), pg.body && /*#__PURE__*/React.createElement("p", {
    className: "cd-page-body"
  }, pg.body), pg.rows && /*#__PURE__*/React.createElement("dl", {
    className: "cd-page-rows"
  }, pg.rows.map(([k, val]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("dt", null, k), /*#__PURE__*/React.createElement("dd", null, val)))), pg.checks && /*#__PURE__*/React.createElement("ul", {
    className: "cd-page-checks"
  }, pg.checks.map(c => /*#__PURE__*/React.createElement("li", {
    key: c
  }, /*#__PURE__*/React.createElement("span", {
    className: "bx",
    "aria-hidden": "true"
  }), c))), pg.fields && /*#__PURE__*/React.createElement("div", {
    className: "cd-page-fields"
  }, pg.fields.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: f + i
  }, /*#__PURE__*/React.createElement("span", null, f), /*#__PURE__*/React.createElement("i", null)))), /*#__PURE__*/React.createElement("div", {
    className: "cd-page-ft"
  }, "Page ", p + 1, " of ", pages.length)), /*#__PURE__*/React.createElement("div", {
    className: "cd-doc-nav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-doc-btn",
    disabled: p === 0,
    onClick: () => setP(p - 1),
    "aria-label": "Previous page"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:chevron-left",
    size: 20,
    color: INK_LW.text
  })), /*#__PURE__*/React.createElement("span", {
    className: "cd-doc-pg"
  }, p + 1, " / ", pages.length), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-doc-btn",
    disabled: p === pages.length - 1,
    onClick: () => setP(p + 1),
    "aria-label": "Next page"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:chevron-right",
    size: 20,
    color: INK_LW.text
  }))));
}

/* ---------------------------------------------------------------- quiz -- */
function LWQuiz({
  item,
  onComplete
}) {
  const QUIZ = CDL.QUIZ;
  const [i, setI] = useStateLW(0);
  const [pick, setPick] = useStateLW(null);
  const [checked, setChecked] = useStateLW(false);
  const [score, setScore] = useStateLW(0);
  const [finished, setFinished] = useStateLW(false);
  const reset = () => {
    setI(0);
    setPick(null);
    setChecked(false);
    setScore(0);
    setFinished(false);
  };
  useEffectLW(() => {
    reset();
  }, [item.name]);
  const total = QUIZ.length;
  const passed = score / total >= 0.8;
  useEffectLW(() => {
    if (finished && passed) onComplete();
  }, [finished]);
  const q = QUIZ[i];
  const check = () => {
    if (pick == null) return;
    setChecked(true);
    if (pick === q.a) setScore(s => s + 1);
  };
  const nextQ = () => {
    if (i + 1 < total) {
      setI(i + 1);
      setPick(null);
      setChecked(false);
    } else setFinished(true);
  };
  if (finished) {
    return /*#__PURE__*/React.createElement("div", {
      className: "cd-media cd-quiz",
      "data-screen-label": "Quiz result"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cd-qresult"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cd-qring" + (passed ? " pass" : "")
    }, Math.round(score / total * 100), "%"), /*#__PURE__*/React.createElement("h3", null, passed ? "You passed" : "Not quite yet"), /*#__PURE__*/React.createElement("p", null, passed ? score + " of " + total + " correct — your " + item.section.name.toLowerCase() + " is complete." : score + " of " + total + " correct. You need 80% to pass — review the lessons and try again."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cd-btn cd-btn-outline",
      onClick: reset
    }, /*#__PURE__*/React.createElement(IconLW, {
      name: "lucide:rotate-ccw",
      size: 16,
      color: INK_LW.heading
    }), "Retake quiz")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-media cd-quiz",
    "data-screen-label": "Quiz"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-qhead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-qn"
  }, "Question ", i + 1, " of ", total), /*#__PURE__*/React.createElement("span", {
    className: "cd-qscore"
  }, score, " correct")), /*#__PURE__*/React.createElement("div", {
    className: "cd-track",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: i / total * 100 + "%"
    }
  })), /*#__PURE__*/React.createElement("h3", {
    className: "cd-qq"
  }, q.q), /*#__PURE__*/React.createElement("div", {
    className: "cd-qopts",
    role: "radiogroup",
    "aria-label": "Answers"
  }, q.opts.map((o, k) => {
    const st = !checked ? pick === k ? " picked" : "" : k === q.a ? " right" : pick === k ? " wrong" : "";
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      role: "radio",
      "aria-checked": pick === k,
      key: o,
      className: "cd-qopt" + st,
      disabled: checked,
      onClick: () => setPick(k)
    }, /*#__PURE__*/React.createElement("span", {
      className: "cd-qkey"
    }, String.fromCharCode(65 + k)), /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, o), checked && k === q.a && /*#__PURE__*/React.createElement(IconLW, {
      name: "lucide:check",
      size: 18,
      color: INK_LW.success,
      strokeWidth: 2.5
    }), checked && pick === k && k !== q.a && /*#__PURE__*/React.createElement(IconLW, {
      name: "lucide:x",
      size: 18,
      color: "#E5484D",
      strokeWidth: 2.5
    }));
  })), checked && /*#__PURE__*/React.createElement("p", {
    className: "cd-qwhy" + (pick === q.a ? " ok" : "")
  }, pick === q.a ? "Correct. " : "Not quite. ", q.why), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-fill cd-qcta",
    disabled: !checked && pick == null,
    onClick: checked ? nextQ : check
  }, checked ? i + 1 < total ? "Next question" : "See result" : "Check answer"));
}

/* ---------------------------------------------------------------- resources -- */
function LWResources({
  onToast
}) {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Resources"
  }, /*#__PURE__*/React.createElement("p", {
    className: "cd-body cd-res-intro"
  }, "Downloads for this lesson — click to save a copy."), /*#__PURE__*/React.createElement("div", {
    className: "cd-res-list"
  }, CDL.RESOURCES.map(r => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-res",
    key: r.name,
    onClick: () => onToast("Downloading " + r.name)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-res-ic"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:file-text",
    size: 20,
    color: INK_LW.gold
  })), /*#__PURE__*/React.createElement("span", {
    className: "cd-res-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-res-name"
  }, r.name), /*#__PURE__*/React.createElement("span", {
    className: "cd-res-meta"
  }, "PDF · ", r.size)), /*#__PURE__*/React.createElement("span", {
    className: "cd-res-dl"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:download",
    size: 16,
    color: INK_LW.text
  }))))));
}

/* ---------------------------------------------------------------- comments -- */
function LWCommentText({
  text
}) {
  const parts = text.split(/(@[A-Za-z.]+(?: [A-Z][A-Za-z.]+)?)/g);
  return /*#__PURE__*/React.createElement("p", {
    className: "cd-cmt-text"
  }, parts.map((p, i) => p.charAt(0) === "@" ? /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "cd-cmt-mention"
  }, p) : p));
}
function LWComment({
  c,
  onLike,
  onReply
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-cmt"
  }, /*#__PURE__*/React.createElement(ProfileLinkLW, {
    author: c.author,
    className: "pf-prof-av"
  }, /*#__PURE__*/React.createElement(AvatarLW, {
    name: c.author.name,
    src: c.author.avatar,
    size: 38
  })), /*#__PURE__*/React.createElement("div", {
    className: "cd-cmt-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-cmt-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-cmt-name"
  }, /*#__PURE__*/React.createElement(ProfileLinkLW, {
    author: c.author,
    className: "pf-prof-nm"
  }, c.author.name)), /*#__PURE__*/React.createElement("span", {
    className: "cd-cmt-time"
  }, c.time)), /*#__PURE__*/React.createElement(LWCommentText, {
    text: c.text
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-cmt-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-cmt-act" + (c.liked ? " on" : ""),
    "aria-pressed": !!c.liked,
    onClick: onLike
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:heart",
    size: 15,
    color: c.liked ? INK_LW.gold : INK_LW.muted
  }), "Like", c.likes ? ` · ${c.likes}` : ""), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-cmt-act",
    onClick: onReply
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:message-circle",
    size: 15,
    color: INK_LW.muted
  }), "Reply"))));
}
let _lwseq = 0;
function LWComments({
  lessonName,
  courseSlug
}) {
  const [comments, setComments] = useStateLW(() => CDL.DEFAULT_COMMENTS.map(c => ({
    ...c,
    _id: "lw" + _lwseq++
  })));
  const [draft, setDraft] = useStateLW("");
  const inputRef = useRefLW(null);
  const me = {
    name: CDL.ME.name,
    avatar: CDL.ME.avatar
  };
  /* First comment asks "Share this comment?" (shared prompt, window.PFCommentShare);
     after "Remember my decision" the saved choice is applied silently. */
  const prompt = window.PFCommentShare.useSharePrompt((text, share) => {
    setComments(all => [{
      author: me,
      time: "Just now",
      text,
      likes: 0,
      liked: false,
      sharedToNewsfeed: share,
      _id: "lw" + _lwseq++
    }, ...all]);
    if (share) window.PFCommentShare.shareToNewsfeed({
      author: me,
      courseSlug,
      text
    });
  }, {
    variant: "dialog"
  });
  const like = id => setComments(all => all.map(c => c._id === id ? {
    ...c,
    liked: !c.liked,
    likes: (c.likes || 0) + (c.liked ? -1 : 1)
  } : c));
  const reply = c => {
    setDraft("@" + c.author.name + " ");
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
    }
  };
  const post = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    prompt.submit(text);
  };
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Comments"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec"
  }, /*#__PURE__*/React.createElement("h2", null, comments.length, " Comment", comments.length === 1 ? "" : "s")), /*#__PURE__*/React.createElement("form", {
    className: "cd-composer",
    onSubmit: e => {
      e.preventDefault();
      post();
    }
  }, /*#__PURE__*/React.createElement(AvatarLW, {
    name: CDL.ME.name,
    src: CDL.ME.avatar,
    size: 34
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: draft,
    onChange: e => setDraft(e.target.value),
    placeholder: "Comment on " + lessonName + "…",
    "aria-label": "Write a comment"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "cd-send",
    "aria-label": "Post comment",
    disabled: !draft.trim()
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:send",
    size: 17,
    color: INK_LW.onNavy
  }))), /*#__PURE__*/React.createElement(window.PFCommentShare.Note, {
    className: "cd-composer-note"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-cmts"
  }, comments.map(c => /*#__PURE__*/React.createElement(LWComment, {
    key: c._id,
    c: c,
    onLike: () => like(c._id),
    onReply: () => reply(c)
  }))), prompt.modal);
}
function LWAvaCard({
  lessonName,
  courseTitle
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cd-ava",
    "data-screen-label": "Talk this through with Ava"
  }, /*#__PURE__*/React.createElement("span", {
    className: "orb"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:sparkles",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "Talk this through with Ava"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Stuck on a landmark or unsure how this applies to your patients? Ava knows where you are in the course."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-coach-link",
    "data-coach": `I'm on the lesson "${lessonName}" in ${courseTitle}. Quiz me on the key points and tell me what to practise next.`
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:sparkles",
    size: 14,
    color: "#fff"
  }), "Ask Ava")));
}

/* ---------------------------------------------------------------- share modal -- */
function LWShareModal({
  item,
  course,
  url,
  onClose,
  onDone
}) {
  useEffectLW(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const title = item.name + " · " + course.title;
  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: "Take a look at this lesson on PROfinity",
        url
      }).catch(() => {});
      onDone("");
      return;
    }
    CDL.copyText(url);
    onDone("Lesson link copied");
  };
  const tiles = [{
    k: "copy",
    label: "Copy link",
    icon: "lucide:link",
    run: () => {
      CDL.copyText(url);
      onDone("Lesson link copied");
    }
  }, {
    k: "feed",
    label: "Newsfeed",
    icon: "lucide:newspaper",
    run: () => onDone("Shared to your newsfeed")
  }, {
    k: "dm",
    label: "Messages",
    icon: "lucide:message-circle",
    run: () => goLW("Messages.html")
  }, {
    k: "more",
    label: "More",
    icon: "lucide:more-horizontal",
    run: shareNative
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-share",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Share lesson",
    "data-screen-label": "Share lesson"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-share-hd"
  }, /*#__PURE__*/React.createElement("h3", null, "Share lesson"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:x",
    size: 18,
    color: INK_LW.text
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-prev"
  }, /*#__PURE__*/React.createElement("img", {
    src: course.still,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-prev-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-share-prev-eyebrow"
  }, CDL.eyebrow(item, course)), /*#__PURE__*/React.createElement("span", {
    className: "cd-share-prev-name"
  }, item.name), /*#__PURE__*/React.createElement("span", {
    className: "cd-share-prev-course"
  }, course.title))), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-sec"
  }, "Send in Messages"), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-rail"
  }, CDL.SHARE_CONTACTS.map(c => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-person",
    key: c.id,
    onClick: () => onDone("Lesson sent to " + c.name)
  }, /*#__PURE__*/React.createElement(AvatarLW, {
    name: c.name,
    src: c.avatar,
    size: 52
  }), /*#__PURE__*/React.createElement("span", null, c.name)))), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-sec"
  }, "Share to"), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-tiles"
  }, tiles.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-tile",
    key: t.k,
    onClick: t.run
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-share-tile-ic"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: t.icon,
    size: 22,
    color: INK_LW.text
  })), /*#__PURE__*/React.createElement("span", null, t.label)))), /*#__PURE__*/React.createElement("div", {
    className: "cd-share-link"
  }, /*#__PURE__*/React.createElement("code", null, url), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-fill",
    onClick: () => {
      CDL.copyText(url);
      onDone("Lesson link copied");
    }
  }, "Copy"))));
}

/* ---------------------------------------------------------------- outline sidebar -- */
function LWOutlineRow({
  lesson,
  current,
  done,
  sub,
  onSelect
}) {
  const icon = done ? "lucide:check" : lesson.kind === "pdf" ? "lucide:file-text" : lesson.kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lw-orow" + (sub ? " sub" : "") + (current ? " current" : "") + (done ? " done" : ""),
    "aria-current": current ? "true" : undefined,
    onClick: onSelect
  }, /*#__PURE__*/React.createElement("span", {
    className: "lw-omark" + (done ? " done" : "")
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: icon,
    size: 12,
    color: done ? INK_LW.success : INK_LW.gold,
    strokeWidth: done ? 2.5 : undefined
  })), /*#__PURE__*/React.createElement("span", {
    className: "lw-orow-name"
  }, lesson.name), /*#__PURE__*/React.createElement("span", {
    className: "lw-orow-dur"
  }, lesson.dur));
}
function LWOutlineLevel({
  level,
  done,
  currentName,
  onSelect,
  openInit
}) {
  const [open, setOpen] = useStateLW(openInit);
  const pct = CDL.pct(CDL.levelLessonNames(level), done);
  const empty = !level.sections || level.sections.length === 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "lw-olevel"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lw-olevel-hd",
    "aria-expanded": open,
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("span", {
    className: "lw-olevel-name"
  }, level.quiz || !level.name ? level.title : level.title + " · " + level.name), !empty && /*#__PURE__*/React.createElement("span", {
    className: "lw-olevel-pct"
  }, pct, "%"), empty && /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:lock",
    size: 13,
    color: INK_LW.muted
  }), /*#__PURE__*/React.createElement(IconLW, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 16,
    color: INK_LW.muted
  })), open && (empty ? /*#__PURE__*/React.createElement("div", {
    className: "lw-ounlock"
  }, level.unlock || "Unlocks when you complete the previous level.") : level.sections.map(sec => /*#__PURE__*/React.createElement("div", {
    className: "lw-osection",
    key: sec.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-osection-name"
  }, sec.name), sec.lessons.map(l => /*#__PURE__*/React.createElement(LWOutlineRow, {
    key: l.name,
    lesson: l,
    current: currentName === l.name,
    done: done.indexOf(l.name) !== -1,
    onSelect: () => onSelect(l.name)
  })), (sec.subs || []).map(sub => /*#__PURE__*/React.createElement("div", {
    key: sub.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-ofolder"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:folder",
    size: 15,
    color: INK_LW.gold
  }), sub.name, /*#__PURE__*/React.createElement("span", {
    className: "lw-ofolder-n"
  }, sub.lessons.length)), sub.lessons.map(l => /*#__PURE__*/React.createElement(LWOutlineRow, {
    key: l.name,
    lesson: l,
    sub: true,
    current: currentName === l.name,
    done: done.indexOf(l.name) !== -1,
    onSelect: () => onSelect(l.name)
  }))))))));
}
function LWOutline({
  course,
  flat,
  item,
  done,
  onSelect,
  onOpenCourse
}) {
  const doneCount = flat.filter(l => done.indexOf(l.name) !== -1).length;
  const pct = Math.round(doneCount / flat.length * 100);
  return /*#__PURE__*/React.createElement("aside", {
    className: "lw-outline",
    "data-screen-label": "Course outline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-outline-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-outline-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-outline-head-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lw-outline-title"
  }, "Course outline"), /*#__PURE__*/React.createElement("span", {
    className: "lw-outline-pos"
  }, doneCount, " of ", flat.length, " completed")), /*#__PURE__*/React.createElement("div", {
    className: "cd-track",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lw-outline-open",
    onClick: onOpenCourse
  }, "Open course page", /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:arrow-up-right",
    size: 14,
    color: INK_LW.heading
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lw-outline-list"
  }, course.levels.map((lvl, i) => /*#__PURE__*/React.createElement(LWOutlineLevel, {
    key: lvl.title,
    level: lvl,
    done: done,
    currentName: item.name,
    onSelect: onSelect,
    openInit: i === item.li || !!lvl.open
  })))));
}

/* ---------------------------------------------------------------- locked course -- */
function LWLocked({
  course,
  total
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lw-page",
    "data-screen-label": "Lesson (web) · locked"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-crumb-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lw-back-btn",
    "aria-label": "Back to course",
    onClick: () => goLW(CDL.courseUrl(course))
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:arrow-left",
    size: 19,
    color: INK_LW.heading
  })), /*#__PURE__*/React.createElement("span", {
    className: "lw-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goLW(PFLW.myLearningUrl)
  }, "My Learning"), " \xA0/\xA0 ", /*#__PURE__*/React.createElement("a", {
    onClick: () => goLW(CDL.courseUrl(course))
  }, course.title))), /*#__PURE__*/React.createElement("section", {
    className: "lw-card lw-locked"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-paywall"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-paywall-ic"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:lock",
    size: 20,
    color: INK_LW.gold
  })), /*#__PURE__*/React.createElement("div", {
    className: "cd-paywall-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-eyebrow"
  }, "Paid course"), /*#__PURE__*/React.createElement("h3", {
    className: "cd-paywall-title"
  }, "Buy this course to start its lessons"), /*#__PURE__*/React.createElement("p", {
    className: "cd-paywall-body"
  }, course.title, " is a paid course. Buy it once for lifetime access to every level, module and lesson, the resources and the success path quiz."), /*#__PURE__*/React.createElement("ul", {
    className: "cd-paywall-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:check",
    size: 14,
    color: INK_LW.gold,
    strokeWidth: 2.5
  }), total, " lessons across ", course.levels.filter(l => !l.quiz).length, " levels"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:check",
    size: 14,
    color: INK_LW.gold,
    strokeWidth: 2.5
  }), "One-time payment · lifetime access"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:check",
    size: 14,
    color: INK_LW.gold,
    strokeWidth: 2.5
  }), "Certificate on completion")), /*#__PURE__*/React.createElement("div", {
    className: "cd-paywall-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-paywall-price"
  }, /*#__PURE__*/React.createElement("small", null, "One-time"), "£", course.price), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-outline",
    onClick: () => goLW(CDL.courseUrl(course))
  }, "Browse the course"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-gold",
    onClick: () => goLW(CDL.checkoutUrl(course))
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:shopping-bag",
    size: 16,
    color: INK_LW.onGold
  }), "Buy course")))))));
}

/* ---------------------------------------------------------------- app -- */
function LessonWebApp() {
  const course = LW_COURSE;
  const flat = useMemoLW(() => CDL.flatten(course), []);
  const [done, markDone] = PFLW.useLessonsDone();
  const purchased = PFLW.usePurchased();
  const locked = course.price > 0 && purchased.indexOf(course.slug) === -1;

  /* lesson = URL position (mobile or legacy flat shape) → web resume pointer → first not done */
  const [idx, setIdx] = useStateLW(() => {
    const fromUrl = CDL.lessonIdxFromParams(flat, LW_PARAMS);
    if (fromUrl != null) return fromUrl;
    const saved = PFLW.readProgress(course.slug);
    if (typeof saved.activeIdx === "number" && flat[saved.activeIdx]) return saved.activeIdx;
    const doneNow = PFLW.readDone();
    const i = flat.findIndex(l => doneNow.indexOf(l.name) === -1);
    return i === -1 ? 0 : i;
  });
  const item = flat[idx];
  const next = flat[idx + 1] || null;
  const isDone = done.indexOf(item.name) !== -1;
  const kind = item.kind || "video";
  const content = CDL.genericContent(item);
  const [tab, setTab] = useStateLW("details");
  const [theatre, setTheatre] = useStateLW(false);
  const [outline, setOutline] = useStateLW(() => {
    try {
      return localStorage.getItem("pf-lesson-outline") !== "0";
    } catch (e) {
      return true;
    }
  });
  const [shareOpen, setShareOpen] = useStateLW(() => LW_PARAMS.get("share") === "1");
  const [celebrate, setCelebrate] = useStateLW(false);
  const [toast, setToast] = useStateLW(null);
  const toastTimer = useRefLW(null);
  const showToast = msg => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };
  const toggleOutline = () => setOutline(o => {
    try {
      localStorage.setItem("pf-lesson-outline", o ? "0" : "1");
    } catch (e) {}
    return !o;
  });
  useEffectLW(() => {
    document.title = "PROfinity — My Learning · " + item.name;
  }, [idx]);
  useEffectLW(() => () => clearTimeout(toastTimer.current), []);

  /* URL ↔ lesson: selecting pushes the mobile-shape URL; back/forward follow it */
  const urlFor = i => {
    try {
      const u = new URL(window.location.href);
      const it = flat[i];
      /* rebuilt so the query reads course → title/price/dur → position */
      const rest = new URLSearchParams(u.search);
      ["course", "level", "module", "lesson", "sub", "share", "play"].forEach(k => rest.delete(k));
      const q = new URLSearchParams({
        course: course.slug
      });
      rest.forEach((v, k) => q.set(k, v));
      q.set("level", it.li);
      q.set("module", it.si);
      q.set("lesson", it.ni);
      if (it.subIdx != null) q.set("sub", it.subIdx);
      u.search = q.toString();
      return u;
    } catch (e) {
      return null;
    }
  };
  useEffectLW(() => {
    const u = urlFor(idx);
    if (u) history.replaceState({
      lwIdx: idx
    }, "", u);
    const onPop = () => {
      const i = CDL.lessonIdxFromParams(flat, new URLSearchParams(window.location.search));
      if (i != null) {
        setIdx(i);
        setTab("details");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* web resume pointer: completed = flat indices of the shared name-keyed store */
  const writeProgress = (doneNames, active) => {
    PFLW.writeProgress(course.slug, {
      completed: flat.map((l, i) => doneNames.indexOf(l.name) !== -1 ? i : -1).filter(i => i !== -1),
      activeIdx: active
    });
  };
  useEffectLW(() => {
    writeProgress(done, idx);
  }, [idx, done]);
  const select = i => {
    if (i === idx || !flat[i]) return;
    setIdx(i);
    setTab("details");
    setTheatre(false);
    const u = urlFor(i);
    if (u) history.pushState({
      lwIdx: i
    }, "", u);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const selectByName = name => {
    const i = flat.findIndex(l => l.name === name);
    if (i !== -1) select(i);
  };
  const onMarkDone = name => {
    markDone(name);
    writeProgress(PFLW.readDone(), idx);
  };
  const complete = () => {
    if (isDone) return;
    onMarkDone(item.name);
    /* the last lesson (the success path quiz) completing IS finishing the course */
    if (!next) {
      showToast("Course complete — certificate on its way 🎓");
      setCelebrate(true);
      return;
    }
    showToast(kind === "quiz" ? "Quiz passed — lesson complete" : kind === "pdf" ? "Document reviewed ✓" : "Lesson complete ✓");
  };
  const advance = () => {
    onMarkDone(item.name);
    if (next) {
      const groupKey = l => l.li + ":" + l.si + ":" + (l.subIdx == null ? "" : l.subIdx);
      const moving = groupKey(next) !== groupKey(item);
      select(idx + 1);
      if (moving) showToast("Module complete — opening " + (next.sub ? next.sub.name : next.section.name));
    } else {
      showToast("Course complete — certificate on its way 🎓");
      setCelebrate(true);
    }
  };
  const quizLocked = kind === "quiz" && !isDone;
  const cta = quizLocked ? "Pass the quiz to finish" : next ? isDone ? "Next lesson" : "Mark complete & continue" : isDone ? "Course complete" : "Finish course";
  const kindIcon = kind === "pdf" ? "lucide:file-text" : kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled";

  /* Up next: the next module (first group after this lesson's group) */
  const groupKeyLW = l => l.li + ":" + l.si + ":" + (l.subIdx == null ? "" : l.subIdx);
  const nextModIdx = flat.findIndex((l, i) => i > idx && groupKeyLW(l) !== groupKeyLW(item));
  const nextMod = nextModIdx === -1 ? null : flat[nextModIdx];
  const nextModCount = nextMod ? flat.filter(l => groupKeyLW(l) === groupKeyLW(nextMod)).length : 0;
  const nextModName = nextMod ? nextMod.sub ? nextMod.sub.name : nextMod.section.name : "";
  const shareUrl = (() => {
    const u = urlFor(idx);
    return u ? u.href : window.location.href;
  })();
  const shareDone = msg => {
    setShareOpen(false);
    if (msg) showToast(msg);
  };
  const courseHref = CDL.courseUrlAt(course, item);
  const rootStyle = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  const topNav = /*#__PURE__*/React.createElement(TopNavLW, {
    active: "My Learning",
    user: ME_LW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateLW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  });
  if (locked) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app wa-screen cd-root",
      style: rootStyle
    }, topNav, /*#__PURE__*/React.createElement(LWLocked, {
      course: course,
      total: flat.length
    }));
  }
  const showOutline = outline && !theatre;
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen cd-root" + (theatre ? " lw-theatre" : ""),
    style: rootStyle
  }, topNav, /*#__PURE__*/React.createElement("div", {
    className: "lw-page",
    "data-screen-label": "Lesson (web) · " + kind
  }, /*#__PURE__*/React.createElement(LWCrumb, {
    course: course,
    item: item,
    outlineVisible: outline,
    onToggleOutline: toggleOutline,
    onShare: () => setShareOpen(true),
    locked: locked
  }), /*#__PURE__*/React.createElement("div", {
    className: "lw-grid" + (showOutline ? " with-outline" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-main"
  }, /*#__PURE__*/React.createElement("section", {
    className: "lw-card"
  }, kind === "pdf" ? /*#__PURE__*/React.createElement(LWDoc, {
    item: item,
    course: course,
    onComplete: complete,
    onToast: showToast
  }) : kind === "quiz" ? /*#__PURE__*/React.createElement(LWQuiz, {
    item: item,
    onComplete: complete
  }) : /*#__PURE__*/React.createElement(LWVideo, {
    item: item,
    course: course,
    onComplete: complete,
    theatre: theatre,
    onTheatre: setTheatre,
    onPrev: idx > 0 ? () => select(idx - 1) : null,
    onNext: next ? () => select(idx + 1) : null
  }), /*#__PURE__*/React.createElement("div", {
    className: "lw-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-head-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-eyebrow"
  }, CDL.eyebrow(item, course)), /*#__PURE__*/React.createElement("h1", {
    className: "lw-h1"
  }, item.name), /*#__PURE__*/React.createElement("div", {
    className: "lw-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-chip"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: kindIcon,
    size: 13,
    color: INK_LW.gold
  }), kind === "pdf" ? "PDF" : item.dur), /*#__PURE__*/React.createElement("span", {
    className: "cd-chip"
  }, "Lesson ", item.groupPos, " of ", item.groupTotal), isDone && /*#__PURE__*/React.createElement("span", {
    className: "cd-chip done"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:check",
    size: 13,
    color: INK_LW.success,
    strokeWidth: 2.5
  }), "Completed"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-outline lw-share-btn",
    onClick: () => setShareOpen(true)
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:share-2",
    size: 16,
    color: INK_LW.heading
  }), "Share lesson")), /*#__PURE__*/React.createElement("div", {
    className: "lw-tabs",
    role: "tablist",
    "aria-label": "Lesson sections"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    className: "lw-tab" + (tab === "details" ? " on" : ""),
    "aria-selected": tab === "details",
    onClick: () => setTab("details")
  }, "Details"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    className: "lw-tab" + (tab === "resources" ? " on" : ""),
    "aria-selected": tab === "resources",
    onClick: () => setTab("resources")
  }, "Resources ", /*#__PURE__*/React.createElement("span", {
    className: "lw-tab-n"
  }, "(", CDL.RESOURCES.length, ")"))), tab === "resources" && /*#__PURE__*/React.createElement("div", {
    role: "tabpanel",
    className: "lw-panel"
  }, /*#__PURE__*/React.createElement(LWResources, {
    onToast: showToast
  })), tab === "details" && /*#__PURE__*/React.createElement("div", {
    role: "tabpanel",
    className: "lw-panel"
  }, /*#__PURE__*/React.createElement("p", {
    className: "cd-body lw-intro"
  }, content.intro), /*#__PURE__*/React.createElement("section", {
    className: "lw-block",
    "data-screen-label": "In this lesson"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec"
  }, /*#__PURE__*/React.createElement("h2", null, "In this lesson")), /*#__PURE__*/React.createElement("p", {
    className: "cd-body"
  }, content.body), /*#__PURE__*/React.createElement("ul", {
    className: "cd-points"
  }, content.points.map((p, i) => /*#__PURE__*/React.createElement("li", {
    className: "cd-point",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:check",
    size: 14,
    color: INK_LW.gold,
    strokeWidth: 2.5
  })), /*#__PURE__*/React.createElement("span", null, p))))), nextMod && /*#__PURE__*/React.createElement("section", {
    className: "lw-block",
    "data-screen-label": "Up next"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-sec"
  }, /*#__PURE__*/React.createElement("h2", null, "Up next")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-uptile",
    onClick: () => select(nextModIdx),
    "aria-label": "Open " + nextModName + ", " + nextModCount + (nextModCount === 1 ? " lesson" : " lessons")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-uptile-go",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:arrow-up-right",
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cd-uptile-dur"
  }, nextModCount, " ", nextModCount === 1 ? "lesson" : "lessons"), /*#__PURE__*/React.createElement("span", {
    className: "cd-uptile-name"
  }, nextModName))), /*#__PURE__*/React.createElement("div", {
    className: "lw-block"
  }, /*#__PURE__*/React.createElement(LWComments, {
    lessonName: item.name,
    courseSlug: course.slug
  })), /*#__PURE__*/React.createElement("div", {
    className: "lw-block"
  }, /*#__PURE__*/React.createElement(LWAvaCard, {
    lessonName: item.name,
    courseTitle: course.title
  })))), /*#__PURE__*/React.createElement("div", {
    className: "lw-footer",
    "data-screen-label": "Lesson CTA"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-outline",
    disabled: idx === 0,
    onClick: () => select(idx - 1)
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:chevron-left",
    size: 16,
    color: INK_LW.heading
  }), "Previous"), /*#__PURE__*/React.createElement("div", {
    className: "lw-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-fill lw-cta",
    disabled: quizLocked || !next && isDone,
    onClick: advance
  }, /*#__PURE__*/React.createElement(IconLW, {
    name: isDone && next ? "fluent:play-16-filled" : "lucide:check",
    size: 16,
    color: INK_LW.onNavy
  }), cta))), showOutline && /*#__PURE__*/React.createElement(LWOutline, {
    course: course,
    flat: flat,
    item: item,
    done: done,
    onSelect: selectByName,
    onOpenCourse: () => goLW(courseHref)
  }))), shareOpen && /*#__PURE__*/React.createElement(LWShareModal, {
    item: item,
    course: course,
    url: shareUrl,
    onClose: () => setShareOpen(false),
    onDone: shareDone
  }), celebrate && /*#__PURE__*/React.createElement("div", {
    className: "cd-celebrate",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Course complete",
    "data-screen-label": "Course complete"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-share-scrim",
    "aria-label": "Close",
    onClick: () => setCelebrate(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-celebrate-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-celebrate-emoji",
    "aria-hidden": "true"
  }, "🎓"), /*#__PURE__*/React.createElement("h3", null, "Course complete"), /*#__PURE__*/React.createElement("p", null, "You've finished every lesson in ", course.title, ". Your certificate is on its way — check your email and your profile's Achievements."), /*#__PURE__*/React.createElement("div", {
    className: "cd-celebrate-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-outline",
    onClick: () => setCelebrate(false)
  }, "Stay here"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cd-btn cd-btn-fill",
    onClick: () => goLW(courseHref)
  }, "Back to course", /*#__PURE__*/React.createElement(IconLW, {
    name: "lucide:arrow-right",
    size: 16,
    color: INK_LW.onNavy
  }))))), toast && /*#__PURE__*/React.createElement("div", {
    className: "cd-toast",
    role: "status"
  }, toast));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(LessonWebApp, null));
