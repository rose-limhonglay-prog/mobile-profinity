/* ===========================================================================
   PROfinity — Lesson (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -LS to avoid global-scope clashes.
   Reached by tapping a lesson row on CourseDetail.html via
   ?course=<slug>&level=<i>&module=<i>&lesson=<i>.
   =========================================================================== */
const {
  useState: useStateLS,
  useEffect: useEffectLS,
  useRef: useRefLS
} = React;
const DSLS = window.ProfinityDesignSystem_c2b5cc;
const PFALS = window.PFApp;
function goLS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleLS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateLS(calc);
  useEffectLS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileLS() {
  const [mobile, setMobile] = useStateLS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectLS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

/* ---------------------------------------------------------------- shared content -- */
const LS_SUCCESS_BULLETS = ["Take a comprehensive medical history (bleeding disorders, neuromuscular diseases, medications).", "Screen for contraindications (pregnancy, active infections, known hypersensitivities).", "Assess psychological readiness and set realistic expectations."];
const LS_DEFAULT_RESOURCES = [{
  name: "Lesson Slide Deck.pdf",
  size: "1.4 MB",
  ext: "pdf"
}, {
  name: "Consultation Script.pdf",
  size: "310 KB",
  ext: "pdf"
}, {
  name: "Patient Consent Template.docx",
  size: "88 KB",
  ext: "doc"
}, {
  name: "Post-Treatment Care Sheet.pdf",
  size: "245 KB",
  ext: "pdf"
}];
const LS_DEFAULT_COMMENTS = [{
  author: {
    name: "Dr. Maya Chen"
  },
  time: "2h ago",
  text: "Great breakdown of the anatomy. I've found that a quick review of the patient's history before the procedure makes all the difference."
}, {
  author: {
    name: "Dr. Jordan Lee"
  },
  time: "5h ago",
  text: "The contraindication checklist is super helpful. Does anyone have tips for spotting subtle ptosis in patients with heavier brow tissue?"
}, {
  author: {
    name: "Nurse Beth",
    avatar: "assets/avatar-nurse-beth.jpg"
  },
  time: "1d ago",
  text: "Bookmarking this for our next team training session — clear and concise!"
}];
let _lscseq = 0;
function withIdsLS(list) {
  return (list || []).map(c => ({
    ...c,
    _id: "lsc" + _lscseq++,
    replies: (c.replies || []).map(r => ({
      ...r
    }))
  }));
}
const LS_COMPLETED_KEY = "pf_ls_completed_lessons";
function readCompletedSetLS() {
  try {
    const raw = window.localStorage.getItem(LS_COMPLETED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
}
function writeCompletedSetLS(set) {
  try {
    window.localStorage.setItem(LS_COMPLETED_KEY, JSON.stringify([...set]));
  } catch (e) {}
}
function lessonKeyLS(course, li, mi, ni) {
  return `${course.slug}|${li}|${mi}|${ni}`;
}

/* ---------------------------------------------------------------- course/lesson data -- */
const LS_COURSES = {
  "toxin-battle": {
    slug: "toxin-battle",
    title: "Botox Complications",
    levels: [{
      title: "Level 1",
      modules: [{
        title: "Diagnosis",
        heading: "How to diagnose, treat and most of all understand how to avoid Eyelid Ptosis from Botox treatment. Ptosis is one of the most common cosmetic side effects of upper-face injections.",
        bullets: LS_SUCCESS_BULLETS,
        battle: {
          faces: true,
          flags: ["🇬🇧", "🇺🇸"],
          vs: "BATTLE\nUK vs USA",
          tag: "TECHNIQUE FACE OFF"
        },
        pips: ["assets/avatar-mark-ellis.jpg", "assets/avatar-priya-shah.jpg"],
        lessons: [{
          name: "Identifying & Treating Ptosis",
          dur: "18:36",
          resources: [{
            name: "Eyelid Ptosis Diagnostic Checklist.pdf",
            size: "412 KB",
            ext: "pdf"
          }, {
            name: "Contraindications Screening Form.pdf",
            size: "268 KB",
            ext: "pdf"
          }, {
            name: "Patient Consent Template.docx",
            size: "88 KB",
            ext: "doc"
          }, {
            name: "Anatomy Reference Chart.pdf",
            size: "1.8 MB",
            ext: "pdf"
          }, {
            name: "Complication Management Flowchart.pdf",
            size: "540 KB",
            ext: "pdf"
          }, {
            name: "Consultation Script.pdf",
            size: "310 KB",
            ext: "pdf"
          }, {
            name: "Medical History Intake Form.pdf",
            size: "195 KB",
            ext: "pdf"
          }, {
            name: "Emergency Protocol Card.pdf",
            size: "150 KB",
            ext: "pdf"
          }, {
            name: "Before & After Photo Consent.pdf",
            size: "120 KB",
            ext: "pdf"
          }, {
            name: "Post-Treatment Care Sheet.pdf",
            size: "245 KB",
            ext: "pdf"
          }, {
            name: "Lesson Video Transcript.pdf",
            size: "96 KB",
            ext: "pdf"
          }, {
            name: "Slide Deck – Diagnosis Overview.pdf",
            size: "2.1 MB",
            ext: "pdf"
          }]
        }, {
          name: "Brow & Forehead Assessment",
          dur: "12:10"
        }, {
          name: "Contraindication Screening",
          dur: "9:45"
        }, {
          name: "Patient Consultation Scripts",
          dur: "7:52"
        }]
      }, {
        title: "Brow Ptosis",
        heading: "How to select patients and conduct a thorough medical screening before treatment.",
        bullets: ["Consult on patient goals and prior treatment history.", "Assess brow position, asymmetry, and forehead muscle strength.", "Explain realistic outcomes and set expectations."],
        battle: null,
        lessons: [{
          name: "Consultation",
          dur: "3:04"
        }, {
          name: "Avoiding Forehead Paralysis",
          dur: "2:14"
        }, {
          name: "Managing Asymmetries",
          dur: "5:24"
        }]
      }]
    }, {
      title: "Level 2",
      modules: [{
        title: "Upper Eyelid Lift",
        heading: "Indications and surgical techniques for upper eyelid lift.",
        bullets: ["Evaluate eyelid skin laxity and excess fat.", "Discuss surgical options (traditional vs. minimally invasive techniques).", "Ensure patient understands post-operative care and recovery."],
        battle: null,
        lessons: [{
          name: "Preparation",
          dur: "1:42"
        }, {
          name: "Glabellar Region Injections",
          dur: "3:22"
        }, {
          name: "Treating Marionette Lines",
          dur: "4:39"
        }]
      }]
    }]
  }
};
function parseDurLS(dur) {
  const [m, s] = String(dur || "0:00").split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}
function formatDurLS(sec) {
  sec = Math.max(0, Math.round(sec));
  return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
}
function getLessonLS() {
  const params = new URLSearchParams(window.location.search);
  const course = LS_COURSES[params.get("course")] || LS_COURSES["toxin-battle"];
  const li = Math.min(Math.max(Number(params.get("level") || 0), 0), course.levels.length - 1);
  const level = course.levels[li];
  const mi = Math.min(Math.max(Number(params.get("module") || 0), 0), level.modules.length - 1);
  const mod = level.modules[mi];
  const ni = Math.min(Math.max(Number(params.get("lesson") || 0), 0), mod.lessons.length - 1);
  const lesson = mod.lessons[ni];
  return {
    course,
    levelIdx: li,
    level,
    moduleIdx: mi,
    module: mod,
    lessonIdx: ni,
    lesson,
    resources: lesson.resources || LS_DEFAULT_RESOURCES
  };
}
function lessonUrlLS(course, li, mi, ni) {
  return `Lesson.html?course=${course.slug}&level=${li}&module=${mi}&lesson=${ni}`;
}

/* ---------------------------------------------------------------- pieces -- */
function LSPicker({
  ctx
}) {
  const [open, setOpen] = useStateLS(false);
  const total = ctx.module.lessons.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-picker"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-picker-btn",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open
  }, ctx.lessonIdx + 1, " of ", total, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 15,
    color: "#fff"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "ls-picker-menu"
  }, ctx.module.lessons.map((l, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "ls-picker-item" + (i === ctx.lessonIdx ? " on" : ""),
    onClick: () => goLS(lessonUrlLS(ctx.course, ctx.levelIdx, ctx.moduleIdx, i))
  }, /*#__PURE__*/React.createElement("span", {
    className: "ls-picker-item-idx"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "ls-picker-item-name"
  }, l.name), /*#__PURE__*/React.createElement("span", {
    className: "ls-picker-item-dur"
  }, l.dur)))));
}
function LSVideo({
  ctx
}) {
  const durationSec = parseDurLS(ctx.lesson.dur);
  const [playing, setPlaying] = useStateLS(false);
  const [progress, setProgress] = useStateLS(0.62);
  const timerRef = useRefLS(null);
  useEffectLS(() => {
    setPlaying(false);
    setProgress(0.62);
  }, [ctx.course.slug, ctx.levelIdx, ctx.moduleIdx, ctx.lessonIdx]);
  useEffectLS(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + 1 / durationSec;
        if (next >= 1) {
          clearInterval(timerRef.current);
          setPlaying(false);
          return 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [playing, durationSec]);
  const toggle = () => {
    if (progress >= 1) setProgress(0);
    setPlaying(p => !p);
  };
  const replay = () => {
    setProgress(0);
    setPlaying(true);
  };
  const seek = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    setProgress(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
  };
  const battle = ctx.module.battle;
  const currentSec = progress * durationSec;
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-video",
    "data-screen-label": "Lesson video"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ls-video-eyebrow"
  }, "Lesson Video"), /*#__PURE__*/React.createElement("span", {
    className: "ls-video-title"
  }, ctx.lesson.name), battle && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ls-video-battle"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ls-video-flag"
  }, battle.flags[0]), /*#__PURE__*/React.createElement("span", {
    className: "ls-video-vs"
  }, battle.vs.split("\n").map((l, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("br", null), l))), /*#__PURE__*/React.createElement("span", {
    className: "ls-video-flag"
  }, battle.flags[1])), /*#__PURE__*/React.createElement("span", {
    className: "ls-video-tag"
  }, battle.tag)), ctx.module.pips && /*#__PURE__*/React.createElement("div", {
    className: "ls-video-pips"
  }, ctx.module.pips.map((p, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: p,
    alt: "",
    className: "ls-video-pip"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-video-center",
    "aria-label": playing ? "Pause" : "Play",
    onClick: toggle
  }, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: playing ? "fluent:pause-16-filled" : "fluent:play-16-filled",
    size: 24,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ls-video-controls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-replay",
    onClick: replay
  }, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: "lucide:rotate-ccw",
    size: 14,
    color: "var(--brand-navy)"
  }), "REPLAY"), /*#__PURE__*/React.createElement("div", {
    className: "ls-video-bar-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-video-btn",
    "aria-label": playing ? "Pause" : "Play",
    onClick: toggle
  }, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: playing ? "fluent:pause-16-filled" : "fluent:play-16-filled",
    size: 16,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ls-video-time"
  }, formatDurLS(currentSec)), /*#__PURE__*/React.createElement("span", {
    className: "ls-video-track",
    onClick: seek
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: progress * 100 + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "ls-video-time end"
  }, ctx.lesson.dur), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-video-btn",
    "aria-label": "Next lesson",
    onClick: () => {
      const list = ctx.module.lessons;
      if (ctx.lessonIdx < list.length - 1) goLS(lessonUrlLS(ctx.course, ctx.levelIdx, ctx.moduleIdx, ctx.lessonIdx + 1));
    }
  }, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: "lucide:skip-forward",
    size: 16,
    color: "#fff"
  })))));
}
function LSCommentRow({
  c,
  onAddReply
}) {
  const [replying, setReplying] = useStateLS(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-row"
  }, /*#__PURE__*/React.createElement(DSLS.Avatar, {
    name: c.author.name,
    src: c.author.avatar,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-name"
  }, c.author.name), /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-time"
  }, c.time), /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-text"
  }, c.text), /*#__PURE__*/React.createElement("div", {
    className: "cmt-actions"
  }, /*#__PURE__*/React.createElement(PFALS.ReactTrigger, null), /*#__PURE__*/React.createElement("span", {
    className: "cmt-dot"
  }, "·"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cmt-link",
    onClick: () => setReplying(r => !r)
  }, "Reply")), c.replies && c.replies.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cmt-replies"
  }, c.replies.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "ls-cmt-reply"
  }, /*#__PURE__*/React.createElement(DSLS.Avatar, {
    name: r.author.name,
    src: r.author.avatar,
    size: 28
  }), /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-name"
  }, r.author.name), /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-time"
  }, r.time), /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-text"
  }, r.text), /*#__PURE__*/React.createElement("div", {
    className: "cmt-actions"
  }, /*#__PURE__*/React.createElement(PFALS.ReactTrigger, null)))))), replying && /*#__PURE__*/React.createElement(PFALS.CommentComposer, {
    small: true,
    autoFocus: true,
    placeholder: "Reply to " + c.author.name + "…",
    onSubmit: t => {
      onAddReply(c._id, t);
      setReplying(false);
    }
  })));
}
const LS_SHARE_PREF_KEY = "pf_ls_comment_share_pref";
function readSharePrefLS() {
  try {
    const raw = window.localStorage.getItem(LS_SHARE_PREF_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function writeSharePrefLS(share) {
  try {
    window.localStorage.setItem(LS_SHARE_PREF_KEY, JSON.stringify({
      share
    }));
  } catch (e) {}
}
function LSShareCommentModal({
  onCancel,
  onConfirm
}) {
  const [share, setShare] = useStateLS(true);
  const [remember, setRemember] = useStateLS(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-share-overlay",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("div", {
    className: "ls-share-sheet",
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Share this comment?"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ls-share-icon-wrap"
  }, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: "lucide:megaphone",
    size: 26,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "ls-share-title"
  }, "Share this comment?"), /*#__PURE__*/React.createElement("p", {
    className: "ls-share-desc"
  }, "Comments on lessons can also appear in the community newsfeed so others can learn from the discussion."), /*#__PURE__*/React.createElement("label", {
    className: "ls-share-toggle-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ls-share-toggle-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ls-share-toggle-label"
  }, "Also share to newsfeed"), /*#__PURE__*/React.createElement("span", {
    className: "ls-share-toggle-sub"
  }, "Visible to the community")), /*#__PURE__*/React.createElement("span", {
    className: "pf-pt-switch" + (share ? " on" : "")
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: share,
    onChange: e => setShare(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", {
    className: "pf-pt-knob"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "ls-share-remember"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: remember,
    onChange: e => setRemember(e.target.checked)
  }), "Remember my decision"), /*#__PURE__*/React.createElement("div", {
    className: "ls-share-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-share-btn cancel",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-share-btn primary",
    onClick: () => onConfirm(share, remember)
  }, "Post comment"))));
}
function LSComments({
  comments,
  onAddComment,
  onAddReply
}) {
  const [pendingText, setPendingText] = useStateLS(null);
  function handleSubmit(text) {
    const pref = readSharePrefLS();
    if (pref) {
      onAddComment(text, pref.share);
      return;
    }
    setPendingText(text);
  }
  function confirmShare(share, remember) {
    if (remember) writeSharePrefLS(share);
    onAddComment(pendingText, share);
    setPendingText(null);
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "ls-comments"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "ls-ov-steps-title"
  }, comments.length, " Comment", comments.length === 1 ? "" : "s"), /*#__PURE__*/React.createElement(PFALS.CommentComposer, {
    placeholder: "Leave a comment…",
    onSubmit: handleSubmit
  }), /*#__PURE__*/React.createElement("div", {
    className: "ls-cmt-list"
  }, comments.map(c => /*#__PURE__*/React.createElement(LSCommentRow, {
    c: c,
    onAddReply: onAddReply,
    key: c._id
  }))), pendingText !== null && /*#__PURE__*/React.createElement(LSShareCommentModal, {
    onCancel: () => setPendingText(null),
    onConfirm: confirmShare
  }));
}
function LSOverview({
  ctx,
  comments,
  onAddComment,
  onAddReply
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-panel"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ls-ov-heading"
  }, ctx.module.title), /*#__PURE__*/React.createElement("p", {
    className: "ls-ov-desc"
  }, ctx.module.heading), /*#__PURE__*/React.createElement("h3", {
    className: "ls-ov-steps-title"
  }, ctx.module.title, " Success Steps"), /*#__PURE__*/React.createElement("div", {
    className: "ls-steps"
  }, ctx.module.bullets.map((b, i) => /*#__PURE__*/React.createElement("div", {
    className: "ls-step",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ls-step-num"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    className: "ls-step-text"
  }, b)))), /*#__PURE__*/React.createElement("div", {
    className: "ls-divider"
  }), /*#__PURE__*/React.createElement(LSComments, {
    comments: comments,
    onAddComment: onAddComment,
    onAddReply: onAddReply
  }));
}
function LSResourceIcon({
  ext
}) {
  const map = {
    pdf: "lucide:file-text",
    doc: "lucide:file-type-2",
    ppt: "lucide:presentation"
  };
  return /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: map[ext] || "lucide:file",
    size: 18,
    color: "var(--brand-gold)"
  });
}
function LSResources({
  ctx
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ls-res-list"
  }, ctx.resources.map((r, i) => /*#__PURE__*/React.createElement("div", {
    className: "ls-res",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ls-res-icon"
  }, /*#__PURE__*/React.createElement(LSResourceIcon, {
    ext: r.ext
  })), /*#__PURE__*/React.createElement("div", {
    className: "ls-res-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ls-res-name"
  }, r.name), /*#__PURE__*/React.createElement("div", {
    className: "ls-res-meta"
  }, r.size)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-res-dl",
    "aria-label": `Download ${r.name}`,
    onClick: () => {}
  }, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: "lucide:download",
    size: 16,
    color: "var(--brand-navy)"
  }))))));
}
function Lesson() {
  const ctx = getLessonLS();
  const [tab, setTab] = useStateLS("Overview");
  const list = ctx.module.lessons;
  const atFirst = ctx.lessonIdx === 0;
  const atLast = ctx.lessonIdx === list.length - 1;
  const [noted, setNoted] = useStateLS(false);
  const [comments, setComments] = useStateLS(() => withIdsLS(LS_DEFAULT_COMMENTS));
  useEffectLS(() => {
    setComments(withIdsLS(LS_DEFAULT_COMMENTS));
  }, [ctx.course.slug, ctx.levelIdx, ctx.moduleIdx, ctx.lessonIdx]);
  const lessonKey = lessonKeyLS(ctx.course, ctx.levelIdx, ctx.moduleIdx, ctx.lessonIdx);
  const [completed, setCompleted] = useStateLS(() => readCompletedSetLS().has(lessonKey));
  useEffectLS(() => {
    setCompleted(readCompletedSetLS().has(lessonKey));
  }, [lessonKey]);
  function markLessonComplete() {
    const set = readCompletedSetLS();
    set.add(lessonKey);
    writeCompletedSetLS(set);
    setCompleted(true);
  }
  function addComment(text, sharedToNewsfeed) {
    setComments(all => [...all, {
      author: {
        name: PFALS.ME.name,
        avatar: PFALS.ME.avatar
      },
      time: "now",
      text,
      sharedToNewsfeed,
      _id: "lsc" + _lscseq++,
      replies: []
    }]);
  }
  function addReply(commentId, text) {
    setComments(all => all.map(c => c._id === commentId ? {
      ...c,
      replies: [...(c.replies || []), {
        author: {
          name: PFALS.ME.name,
          avatar: PFALS.ME.avatar
        },
        time: "now",
        text
      }]
    } : c));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ls-screen",
    "data-screen-label": "Lesson (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ls-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ls-back",
    "aria-label": "Back",
    onClick: () => goLS(`CourseDetail.html?course=${ctx.course.slug}`)
  }, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ls-top-titles"
  }, /*#__PURE__*/React.createElement("p", {
    className: "ls-top-eyebrow"
  }, "Module ", ctx.moduleIdx + 1, ": ", ctx.module.title), /*#__PURE__*/React.createElement("h1", {
    className: "ls-top-title"
  }, ctx.course.title)), /*#__PURE__*/React.createElement(LSPicker, {
    ctx: ctx
  })), /*#__PURE__*/React.createElement("div", {
    className: "ls-scroll"
  }, /*#__PURE__*/React.createElement(LSVideo, {
    ctx: ctx
  }), /*#__PURE__*/React.createElement("div", {
    className: "ls-tabs",
    role: "tablist"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": tab === "Overview",
    className: "ls-tab" + (tab === "Overview" ? " on" : ""),
    onClick: () => setTab("Overview")
  }, "Overview"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": tab === "Resources",
    className: "ls-tab" + (tab === "Resources" ? " on" : ""),
    onClick: () => setTab("Resources")
  }, "Resources (", ctx.resources.length, ")")), tab === "Overview" ? /*#__PURE__*/React.createElement(LSOverview, {
    ctx: ctx,
    comments: comments,
    onAddComment: addComment,
    onAddReply: addReply
  }) : /*#__PURE__*/React.createElement(LSResources, {
    ctx: ctx
  })), /*#__PURE__*/React.createElement("div", {
    className: "ls-bottom"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-nav-btn",
    disabled: atFirst,
    onClick: () => !atFirst && goLS(lessonUrlLS(ctx.course, ctx.levelIdx, ctx.moduleIdx, ctx.lessonIdx - 1))
  }, "Previous"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-note-btn" + (noted ? " on" : ""),
    "aria-label": noted ? "Remove bookmark" : "Bookmark lesson",
    onClick: () => setNoted(n => !n)
  }, /*#__PURE__*/React.createElement(DSLS.IconifyIcon, {
    name: "lucide:book-open",
    size: 19,
    color: noted ? "var(--brand-gold)" : "var(--brand-navy)"
  })), completed ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-nav-btn primary",
    disabled: atLast,
    onClick: () => !atLast && goLS(lessonUrlLS(ctx.course, ctx.levelIdx, ctx.moduleIdx, ctx.lessonIdx + 1))
  }, atLast ? "Completed" : "Next") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ls-nav-btn primary",
    onClick: markLessonComplete
  }, "Complete")));
}
function LessonApp() {
  const mobile = useIsMobileLS();
  const scale = useDeviceScaleLS();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(Lesson, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(Lesson, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(LessonApp, null));
