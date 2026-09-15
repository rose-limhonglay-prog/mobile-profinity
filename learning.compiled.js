/* ===========================================================================
   PROfinity Academy — My Learning (web)
   Desktop port of the mobile My Learning experience (learning-mobile.jsx +
   learning-confidence.jsx + survey.jsx): time-of-day greeting + tier pill →
   goal card (with "How this page works" help) → tabs/search → Confidence
   dashboard (course progress · current lesson · lesson modules · related) →
   Continue Learning → tier-scoped My Courses rail (wide first in-progress
   card) → Explore related content (paid pool) → Free Resources survey gate →
   Discover your journey → Unlock with next tier.

   State + URLs come from learning-store-web.js (window.PFLearn); course data
   from learning-courses-web.js (window.PFLearnCourses); the survey wizard is
   the shared survey.compiled.js (window.SurveyMobile) restyled as a web modal.
   Composed from the bound Profinity Design System bundle.
   =========================================================================== */
const {
  useState,
  useEffect: useEffectL,
  useMemo: useMemoL,
  useRef: useRefL
} = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav,
  LevelBadge,
  IconifyIcon,
  Icon,
  Spark,
  Tabs
} = DS;
const PFL = window.PFLearn;
const PFC = window.PFLearnCourses;
const SurveyWeb = window.SurveyMobile;
const ME = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const TUTOR = PFC.TUTOR;
const TIER = PFL.readTier();
const FREE_TIER = TIER === "free";
const CONFIDENCE_TIER = TIER === "confidence";
const NEXT_TIER = PFL.nextTier(TIER);
const go = url => (window.pfGo || function (u) {
  window.location.href = u;
})(url);
const GOAL = {
  title: "My Goal & Dream Clinic",
  vision: "Boutique clinic with lips + skin treatments, £80k/month revenue, team of 3 professionals",
  clarifier: "Where you're heading — not where you are today."
};
const TABS = ["All Courses", "In Progress", "Completed", "Saved"];

/* ---------------------------------------------------------------- links --- */
/* Resume deep link: level/module/lesson of the course's saved resume point
   (lesson is 1-based in the data, 0-based in the URL). */
/* When learning-shared.js knows the curriculum, resume lands on the first lesson
   not yet completed (pf-lessons-done) — the same place mobile "Continue" opens. */
const PFS = window.PFLearnShared || null;
function resumePoint(c) {
  if (PFS && PFS.CURRICULA && PFS.CURRICULA[c.slug] && PFS.resume) {
    try {
      return PFS.resume(c.slug);
    } catch (e) {}
  }
  return null;
}
function resumeLessonNumber(c) {
  const r = resumePoint(c);
  return r ? r.lessonNumber : c.lesson;
}
function resumeUrl(c) {
  const rp = resumePoint(c);
  if (rp && rp.item) return PFL.lessonUrl(c.slug, {
    level: rp.item.li,
    module: rp.item.si,
    lesson: rp.item.ni,
    sub: rp.item.subIdx == null ? undefined : rp.item.subIdx
  });
  const r = c.resume || {
    level: 0,
    module: 0
  };
  return PFL.lessonUrl(c.slug, {
    level: r.level,
    module: r.module,
    lesson: Math.max(0, (c.lesson || 1) - 1)
  });
}
function certificateUrl(c) {
  return "CertificateWeb.html?" + new URLSearchParams({
    title: c.title,
    instr: TUTOR,
    student: ME.name,
    issued: c.certificate.issuedDate,
    id: c.certificate.id
  });
}
/* Card CTA rules: completed → View Certificate; in progress → filled
   "Continue · n%" to the resume point; otherwise "Start learning". */
function courseCta(c) {
  if (c.completed) return {
    label: "View Certificate",
    fill: true,
    go: () => go(certificateUrl(c))
  };
  if (c.inProgress) return {
    label: "Continue · " + c.progress + "%",
    fill: true,
    go: () => go(resumeUrl(c))
  };
  return {
    label: "Start learning",
    fill: false,
    go: () => go(PFL.courseUrl(c.slug, {
      title: c.title
    }))
  };
}

/* ---------------------------------------------------------------- header -- */
/* Time-of-day greeting: sun before noon, sun-and-clouds until 6pm, moon after. */
function greet(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return {
    text: "Good morning",
    icon: "lucide:sun"
  };
  if (h < 18) return {
    text: "Good afternoon",
    icon: "lucide:cloud-sun"
  };
  return {
    text: "Good evening",
    icon: "lucide:moon"
  };
}
function setPreviewTierAndReload(tier) {
  try {
    if (tier === "free") localStorage.removeItem("pf-subscription-tier");else localStorage.setItem("pf-subscription-tier", tier);
  } catch (e) {}
  window.location.reload();
}

/* Dev preview: cycles free → Confidence → Mastery → free by writing the same
   "pf-subscription-tier" key every other page reads, then reloads. */
const PREVIEW_CYCLE = ["free", "confidence", "mastery"];
function PreviewTierToggle() {
  const i = PREVIEW_CYCLE.indexOf(TIER);
  const next = PREVIEW_CYCLE[(i + 1) % PREVIEW_CYCLE.length];
  const nextLabel = next === "free" ? "View as free" : "View as " + PFL.TIER_NAME[next];
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-toggle-switch",
    onClick: () => setPreviewTierAndReload(next),
    title: "Preview this page as another membership tier"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:eye",
    size: 16,
    color: "var(--brand-navy)"
  }), nextLabel);
}
function Header() {
  /* learning-shared.js greeting re-evaluates by the viewer's time zone every minute */
  const g = PFS && PFS.useGreeting ? PFS.useGreeting() : greet();
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-top",
    "data-screen-label": "Header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "welcome"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: g.icon,
    size: 30,
    color: "var(--brand-gold)"
  }), g.text, ", Katy!"), FREE_TIER && /*#__PURE__*/React.createElement("p", {
    className: "welcome-sub"
  }, "Your goal is to grow in aesthetics or medical school")), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-tiertoggle"
  }, /*#__PURE__*/React.createElement(PreviewTierToggle, null), FREE_TIER ? /*#__PURE__*/React.createElement("span", {
    className: "lrn2-toggle-status free"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:user",
    size: 16,
    color: "var(--brand-navy)"
  }), "Free account") : /*#__PURE__*/React.createElement("span", {
    className: "lrn2-tierpill"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:crown",
    size: 15,
    color: "#fff"
  }), PFL.TIER_NAME[TIER], " Path")));
}

/* ---------------------------------------------------------------- goal ---- */
function GoalCard({
  onHelp
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lrn2-goal",
    "data-screen-label": GOAL.title
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-goal-icon"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:target",
    size: 22,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-goal-body"
  }, /*#__PURE__*/React.createElement("h2", null, GOAL.title), /*#__PURE__*/React.createElement("p", {
    className: "vision"
  }, GOAL.vision), /*#__PURE__*/React.createElement("p", {
    className: "clarifier"
  }, GOAL.clarifier)), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-goal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-coach-link lrn2-goal-coach",
    "data-coach": "Help me get closer to my £80k/month clinic goal — what should I focus on next?"
  }, /*#__PURE__*/React.createElement(Spark, {
    size: 17,
    color: "currentColor"
  }), "Discuss with Ava"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-goal-help",
    "aria-label": "How this page works",
    title: "How this page works",
    onClick: onHelp
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:help-circle",
    size: 22,
    color: "#fff"
  }))));
}

/* Generic centred web modal: scrim, Escape to close, focus to the close
   button and back to the opener. */
function WebModal({
  open,
  onClose,
  label,
  className,
  children
}) {
  const closeRef = useRefL(null);
  const lastFocused = useRefL(null);
  useEffectL(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current && closeRef.current.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (lastFocused.current && lastFocused.current.focus) {
        try {
          lastFocused.current.focus();
        } catch (e) {}
      }
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-modal-wrap" + (className ? " " + className : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-modal-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": label
  }, /*#__PURE__*/React.createElement("header", {
    className: "lrn2-modal-head"
  }, /*#__PURE__*/React.createElement("h2", null, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    ref: closeRef,
    className: "lrn2-modal-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-700)"
  }))), children));
}
function HelpModal({
  open,
  onClose
}) {
  return /*#__PURE__*/React.createElement(WebModal, {
    open: open,
    onClose: onClose,
    label: "How this page works"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-help-body"
  }, PFC.HOW_IT_WORKS.map((h, i) => /*#__PURE__*/React.createElement("div", {
    className: "lrn2-help-item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: h.icon,
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("b", null, h.title), /*#__PURE__*/React.createElement("p", null, h.body))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-help-gotit",
    onClick: onClose
  }, "Got it"));
}

/* ---------------------------------------------------------------- pieces -- */
function SectionHead({
  title,
  big,
  viewAll,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: big ? "t big" : "t"
  }, title), sub && /*#__PURE__*/React.createElement("span", {
    className: "sec-sub"
  }, sub), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), viewAll && /*#__PURE__*/React.createElement("a", {
    className: "viewall",
    href: viewAll,
    onClick: e => {
      e.preventDefault();
      go(viewAll);
    }
  }, "View All"));
}
function SaveButton({
  title,
  saved,
  className
}) {
  const on = saved.indexOf(title) !== -1;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-save" + (on ? " on" : "") + (className ? " " + className : ""),
    "aria-label": on ? "Remove from saved" : "Save course",
    "aria-pressed": on,
    onClick: e => {
      e.stopPropagation();
      PFL.toggleSaved(title);
    }
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: on ? "lucide:bookmark-check" : "lucide:bookmark",
    size: 18,
    color: on ? "var(--brand-gold)" : "var(--brand-navy)"
  }));
}
function LockedCoursesPanel() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-locked"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-locked-icon"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:lock",
    size: 28,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h3", null, "Unlock My Courses"), /*#__PURE__*/React.createElement("p", null, "Upgrade to purchase courses and they’ll live here for easy access."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-locked-upgrade-btn",
    onClick: () => go(PFL.membershipUrl)
  }, "Upgrade", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 19,
    color: "#fff"
  })));
}

/* Continue Learning — the first in-progress course of the member's list,
   deep-linked to its resume lesson. */
function ContinueLearning({
  c
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "lrn2-continue",
    "data-screen-label": "Continue Learning"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Continue Learning",
    big: true
  }), /*#__PURE__*/React.createElement("article", {
    className: "lrn2-continuecard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thumb",
    style: {
      backgroundImage: "url(" + (c.slug === "8d-lip-design" ? PFC.IMG.lip : c.image) + ")"
    }
  }, /*#__PURE__*/React.createElement(LevelBadge, {
    level: c.level,
    className: "lvl"
  })), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "progrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: c.progress + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "pct"
  }, c.progress, "% Complete")), /*#__PURE__*/React.createElement("p", {
    className: "note"
  }, "Only ", c.modulesLeft, " more modules until you get your certificate"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-resume-btn",
    onClick: () => go(resumeUrl(c))
  }, "Resume Lesson ", resumeLessonNumber(c), /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 18,
    color: "#fff"
  })))));
}

/* ---------------------------------------------------------------- My Courses cards -- */
/* Redesigned (user, 2026-09-16) to sit alongside the Explore related content
   cards: 16:9 cover with level badge, bookmark and status pill, serif title,
   two-line blurb, thin gold progress bar and a tutor / CTA footer. One
   component covers not-started, in-progress and completed (certificate)
   courses; the first in-progress card in the grid is `featured` (gold rule). */
const TUTOR_AVATAR = "assets/avatar-drtim.png";
function courseStatus(c, featured) {
  if (c.completed) return {
    key: "done",
    eyebrow: "Completed",
    pill: c.certificate ? "Certificate earned" : "Completed"
  };
  if (c.inProgress) return {
    key: "live",
    eyebrow: featured ? "Continue where you left off" : "In progress · Lesson " + resumeLessonNumber(c),
    pill: c.progress + "% complete"
  };
  return {
    key: "new",
    eyebrow: c.level ? c.level + " level" : "Not started",
    pill: "Not started"
  };
}
function MyCourseCard({
  c,
  saved,
  featured
}) {
  const st = courseStatus(c, featured);
  const cta = courseCta(c);
  const label = c.completed ? "View certificate" : c.inProgress ? "Resume lesson " + resumeLessonNumber(c) : "Start learning";
  return /*#__PURE__*/React.createElement("article", {
    className: "lrn2-mc lrn2-mc-" + st.key + (featured ? " lrn2-mc-featured" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-mc-cover",
    onClick: cta.go,
    "aria-label": "Open " + c.title
  }, /*#__PURE__*/React.createElement("img", {
    src: c.image,
    alt: ""
  }), /*#__PURE__*/React.createElement(LevelBadge, {
    level: c.level,
    className: "lrn2-mc-lvl"
  }), c.completed ? /*#__PURE__*/React.createElement("span", {
    className: "lrn2-mc-ribbon",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:award",
    size: 22,
    color: "#fff"
  })) : /*#__PURE__*/React.createElement("span", {
    className: "lrn2-mc-play",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "fluent:play-16-filled",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-mc-pill" + (c.completed ? " done" : "")
  }, st.pill)), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-mc-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-eyebrow lrn2-mc-eyebrow " + st.key
  }, st.eyebrow), /*#__PURE__*/React.createElement("h3", {
    className: "lrn2-mc-title"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: cta.go
  }, c.title)), c.completed && c.certificate ? /*#__PURE__*/React.createElement("p", {
    className: "lrn2-mc-blurb"
  }, "Issued ", c.certificate.issuedDate, " · ", c.certificate.id) : /*#__PURE__*/React.createElement("p", {
    className: "lrn2-mc-blurb"
  }, c.description), c.inProgress && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-mc-prog",
    role: "progressbar",
    "aria-valuenow": c.progress,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-label": c.title + " progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-mc-bar"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: c.progress + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-mc-pct"
  }, c.progress, "%")), c.modulesLeft != null && /*#__PURE__*/React.createElement("p", {
    className: "lrn2-mc-note"
  }, "Only ", c.modulesLeft, " more ", c.modulesLeft === 1 ? "module" : "modules", " until your certificate")), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-mc-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-mc-tutor"
  }, /*#__PURE__*/React.createElement("img", {
    src: TUTOR_AVATAR,
    alt: ""
  }), TUTOR), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-mc-cta " + (c.completed ? "gold" : c.inProgress ? "filled" : "ghost"),
    onClick: cta.go
  }, label, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 15,
    color: "currentColor"
  })))));
}
function SkeletonCourseCard() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-mc skel-card",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel lrn2-mc-skcover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "32%",
      height: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "72%",
      height: 18
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "96%",
      height: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-line",
    style: {
      width: "58%",
      height: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skel sk-btn",
    style: {
      width: "44%",
      height: 38,
      alignSelf: "flex-end",
      borderRadius: 999
    }
  })));
}
const MC_EMPTY_ICON = {
  "In Progress": "lucide:play-circle",
  "Completed": "lucide:award",
  "Saved": "lucide:bookmark"
};

/* ---------------------------------------------------------------- related -- */
/* Three paid courses from the pool; bought ones drop out and the next
   backfills (PFLearn.usePurchased re-reads when the tab regains focus). */
function RelatedContent() {
  const purchased = PFL.usePurchased();
  const related = PFC.relatedFor(purchased);
  if (!related.length) return null;
  const tierName = PFL.TIER_NAME[PFL.readTier()] || "your membership";
  return /*#__PURE__*/React.createElement("section", {
    className: "lrn2-related",
    "data-screen-label": "Explore related content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-rel-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-rel-head-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-eyebrow gold"
  }, "Recommended for you"), /*#__PURE__*/React.createElement("h2", {
    className: "lrn2-rel-title"
  }, "Explore related content"), /*#__PURE__*/React.createElement("p", {
    className: "lrn2-rel-sub"
  }, "Paid courses hand-picked to build on 8D Lip Design.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-rel-browse",
    onClick: () => go(PFL.allCoursesUrl())
  }, "Browse all courses", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-right",
    size: 16,
    color: "currentColor"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-related-list"
  }, related.map((r, i) => {
    const price = PFL.price(r.slug, r.price);
    const href = PFL.courseUrl(r.slug, {
      title: r.title,
      price: r.price
    });
    return /*#__PURE__*/React.createElement("article", {
      className: "lrn2-rcard" + (i === 0 ? " lrn2-rcard-first" : ""),
      key: r.slug
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "lrn2-rcard-cover",
      onClick: () => go(href),
      "aria-label": "Open " + r.title
    }, /*#__PURE__*/React.createElement("img", {
      src: r.image,
      alt: ""
    }), r.level && /*#__PURE__*/React.createElement(LevelBadge, {
      level: r.level,
      className: "lrn2-rcard-lvl"
    }), price > 0 && /*#__PURE__*/React.createElement("span", {
      className: "lrn2-rcard-lock",
      "aria-label": "Paid course"
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:lock",
      size: 13,
      color: "#fff"
    })), (r.lessons || r.dur) && /*#__PURE__*/React.createElement("span", {
      className: "lrn2-rcard-meta"
    }, r.lessons ? r.lessons + " lessons" : "", r.lessons && r.dur ? " · " : "", r.dur || "")), /*#__PURE__*/React.createElement("div", {
      className: "lrn2-rcard-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lrn2-eyebrow gold lrn2-rcard-eyebrow"
    }, [r.level, r.category].filter(Boolean).join(" · ")), /*#__PURE__*/React.createElement("h3", {
      className: "lrn2-rcard-title"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => go(href)
    }, r.title)), /*#__PURE__*/React.createElement("p", {
      className: "lrn2-rcard-blurb"
    }, r.blurb), /*#__PURE__*/React.createElement("div", {
      className: "lrn2-rcard-foot"
    }, price > 0 ? /*#__PURE__*/React.createElement("span", {
      className: "lrn2-rcard-price"
    }, /*#__PURE__*/React.createElement("b", null, "£", price), /*#__PURE__*/React.createElement("small", null, "one-time")) : /*#__PURE__*/React.createElement("span", {
      className: "lrn2-rcard-incl"
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:badge-check",
      size: 14,
      color: "currentColor"
    }), "Included in ", tierName), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "lrn2-rcard-go",
      onClick: () => go(href),
      "aria-label": "Open " + r.title
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:arrow-up-right",
      size: 18,
      color: "#fff"
    })))));
  })));
}

/* ---------------------------------------------------------------- Confidence dashboard -- */
function Ring({
  pct,
  size = 96,
  stroke = 9
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return /*#__PURE__*/React.createElement("svg", {
    className: "lrn2-ring",
    width: size,
    height: size,
    viewBox: "0 0 " + size + " " + size,
    role: "img",
    "aria-label": pct + "% complete"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--lrn2-ring-track)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--lrn2-ring)",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - pct / 100),
    transform: "rotate(-90 " + size / 2 + " " + size / 2 + ")"
  }), /*#__PURE__*/React.createElement("text", {
    x: "50%",
    y: "50%",
    dy: ".36em",
    textAnchor: "middle",
    className: "lrn2-ring-n"
  }, pct, "%"));
}

/* Before / after compare (user, 2026-09-16 mock): two panes split by a draggable
   divider. A transparent full-size range input drives the split so pointer drag
   and keyboard arrows both work; labels and the handle are pointer-events:none. */
function BeforeAfterCompare({
  before,
  after,
  onOpen
}) {
  const [pos, setPos] = useState(50);
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-ba",
    style: {
      "--ba": pos + "%"
    },
    "data-screen-label": "Before / after"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-ba-pane before"
  }, /*#__PURE__*/React.createElement("img", {
    src: before,
    alt: "Before treatment",
    draggable: "false"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-ba-tag"
  }, "Before")), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-ba-pane after"
  }, /*#__PURE__*/React.createElement("img", {
    src: after,
    alt: "After treatment",
    draggable: "false"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-ba-tag"
  }, "After")), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-ba-line",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-ba-handle",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:chevrons-left-right",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "lrn2-ba-range",
    min: "8",
    max: "92",
    step: "0.5",
    value: pos,
    onChange: e => setPos(Number(e.target.value)),
    "aria-label": "Compare before and after",
    "aria-valuetext": Math.round(pos) + "% before"
  }), onOpen && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-ba-open",
    onClick: onOpen,
    "aria-label": "Open the current lesson"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:maximize-2",
    size: 16,
    color: "#fff"
  })));
}
function ConfidenceDashboard({
  saved
}) {
  const COURSE = PFC.CONFIDENCE_COURSE,
    MOD = PFC.CONFIDENCE_MODULE,
    lessons = MOD.lessons;
  const [done] = PFL.useLessonsDone();
  const currentIdx = useMemoL(() => {
    const i = lessons.findIndex(l => !PFC.lessonDone(l, done));
    return i === -1 ? lessons.length - 1 : i;
  }, [done]);
  const lessonUrl = i => PFL.lessonUrl(COURSE.slug, {
    level: MOD.level,
    module: MOD.section,
    lesson: i
  });
  const cur = lessons[currentIdx];
  /* Course progress for the bar (user, 2026-09-15): live from the shared
     curriculum when learning-shared.js knows this course, else the static totals. */
  const doneInModule = lessons.filter(l => PFC.lessonDone(l, done)).length;
  const rp = resumePoint(COURSE);
  const courseDone = rp ? rp.doneCount : Math.min(COURSE.totalLessons, COURSE.doneBeforeThisModule + doneInModule);
  const courseTotal = rp ? rp.total : COURSE.totalLessons;
  const pct = courseTotal ? Math.round(courseDone / courseTotal * 100) : 0;
  /* Resume button (user, 2026-09-15): opens the COURSE DETAIL page with the
     current lesson pre-selected (no play=1) — the member presses Continue there. */
  const allDone = rp ? rp.allDone : doneInModule === lessons.length;
  const resumeNo = rp ? rp.lessonNumber : currentIdx + 1;
  const resumeHref = allDone ? PFL.courseUrl(COURSE.slug) : rp && rp.item ? PFL.courseUrl(COURSE.slug, {
    level: rp.item.li,
    module: rp.item.si,
    lesson: rp.item.ni,
    sub: rp.item.subIdx == null ? undefined : rp.item.subIdx
  }) : PFL.courseUrl(COURSE.slug, {
    level: MOD.level,
    module: MOD.section,
    lesson: currentIdx
  });
  /* label (user, 2026-09-16): "Continue Lesson" from the first lesson on; "Review course" once done */
  const resumeLabel = allDone ? "Review course" : "Continue Lesson";
  /* hero copy (user, 2026-09-16): group (section/sub-module) as the eyebrow, the
     current lesson's name as the title and its intro as the description */
  const heroGroup = rp && rp.groupName ? rp.groupName : MOD.name;
  const heroTitle = rp && rp.item ? rp.item.name : cur.name;
  const heroDesc = rp && rp.item && (rp.item.intro || rp.item.body) || "";
  /* Share Lesson (user, 2026-09-16): CourseWeb opens its share modal on ?share=1 */
  const shareHref = rp && rp.item ? PFL.courseUrl(COURSE.slug, {
    level: rp.item.li,
    module: rp.item.si,
    lesson: rp.item.ni,
    sub: rp.item.subIdx == null ? undefined : rp.item.subIdx,
    share: 1
  }) : PFL.courseUrl(COURSE.slug, {
    level: MOD.level,
    module: MOD.section,
    lesson: currentIdx,
    share: 1
  });
  const courseBlurb = rp && rp.course && rp.course.blurb || COURSE.description || ((PFC.MY_COURSES || []).find(c => c.title === COURSE.title) || {}).description || "";
  /* Up next (user, 2026-09-16): the current lesson (what Resume opens) and the
     one after it — shared curriculum when available, else this module's rows. */
  const upNext = useMemoL(() => {
    const rowAt = l => ({
      key: l.name,
      name: l.name,
      dur: l.dur || (l.mins ? l.mins + " min" : ""),
      mod: PFS.moduleLabel(rp.course, l),
      href: PFL.courseUrl(COURSE.slug, {
        level: l.li,
        module: l.si,
        lesson: l.ni,
        sub: l.subIdx == null ? undefined : l.subIdx
      })
    });
    if (rp && rp.flat) {
      if (rp.allDone) return {
        label: "",
        rows: []
      };
      const rows = [rowAt(rp.item)];
      const nxt = rp.flat[rp.idx + 1];
      if (nxt) rows.push(rowAt(nxt));
      return {
        label: rp.moduleLabel,
        rows
      };
    }
    const rows = [];
    for (let i = currentIdx; i < lessons.length && rows.length < 2; i++) {
      if (PFC.lessonDone(lessons[i], done) && i !== currentIdx) continue;
      rows.push({
        key: lessons[i].key,
        name: lessons[i].name,
        dur: lessons[i].mins + " min",
        mod: MOD.eyebrow,
        href: lessonUrl(i)
      });
    }
    return {
      label: MOD.eyebrow,
      rows: allDone ? [] : rows
    };
  }, [done]);
  return /*#__PURE__*/React.createElement("section", {
    className: "lrn2-dash",
    "data-screen-label": "Confidence dashboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-dcard lrn2-dash-one"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-dash-grid"
  }, /*#__PURE__*/React.createElement("article", {
    className: "lrn2-dcard lrn2-cur",
    "data-screen-label": "Current lesson"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-hero-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-hero-eyebrow"
  }, "Continue Learning", /*#__PURE__*/React.createElement("i", {
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "lrn2-hero-title"
  }, heroTitle), heroDesc && /*#__PURE__*/React.createElement("p", {
    className: "lrn2-hero-desc"
  }, heroDesc), /*#__PURE__*/React.createElement("div", {
    className: "lrn2-hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-resume-btn lrn2-hero-continue",
    onClick: () => go(resumeHref),
    "aria-label": resumeLabel + " — open course page"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:play",
    size: 16,
    color: "#fff"
  }), resumeLabel), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-cur-share",
    onClick: () => go(shareHref),
    "aria-label": "Share the current lesson"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:share-2",
    size: 18,
    color: "var(--brand-navy)"
  }), "Share Lesson"))), /*#__PURE__*/React.createElement(BeforeAfterCompare, {
    before: COURSE.before || "assets/ba-cheek-before.jpg",
    after: COURSE.after || "assets/ba-cheek-after.jpg",
    onOpen: () => go(lessonUrl(currentIdx))
  })), /*#__PURE__*/React.createElement("nav", {
    className: "lrn2-modstrip",
    "aria-label": "Current module and next lessons"
  }, upNext.rows.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "lrn2-next-empty"
  }, "Course complete — ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-next-link",
    onClick: () => go(PFL.courseUrl(COURSE.slug))
  }, "review course")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-modstrip-mod"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:layers",
    size: 16,
    color: "var(--lrn2-gold-ink)"
  }), upNext.label), /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-modstrip-count"
  }, upNext.rows.length === 1 ? "1 lesson next" : upNext.rows.length + " lessons next"), /*#__PURE__*/React.createElement("ol", {
    className: "lrn2-modstrip-list"
  }, upNext.rows.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: r.key
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-modstrip-lesson" + (i === 0 ? " on" : ""),
    onClick: () => go(r.href),
    "aria-current": i === 0 ? "step" : undefined,
    title: i > 0 && r.mod !== upNext.label ? r.mod : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, r.name), r.dur && /*#__PURE__*/React.createElement("span", {
    className: "d"
  }, r.dur)))))))))));
}

/* ---------------------------------------------------------------- promos --- */
/* Free Resources: locked until the personalisation survey is finished
   (pf-resources-unlocked), then links to the saved resources page. */
function PromoFreeResources({
  unlocked,
  onStartSurvey
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-promo card lrn2-promo-row" + (unlocked ? "" : " locked"),
    "data-screen-label": "Free Resources"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic gold"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: unlocked ? "lucide:folder-open" : "lucide:lock",
    size: 24,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h3", null, "Free Resources"), unlocked ? /*#__PURE__*/React.createElement("p", null, "Your free resources are unlocked — guides, checklists and vein maps tailored to your clinic goals.") : /*#__PURE__*/React.createElement("p", null, "Complete a quick survey to unlock free resources tailored to your clinic goals")), unlocked ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-outline-btn lrn2-promo-cta",
    onClick: () => go(PFL.allCoursesUrl ? PFL.allCoursesUrl({
      free: 1
    }) : "AllCoursesWeb.html?free=1")
  }, "View free resources", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 17,
    color: "var(--brand-navy)"
  })) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-outline-btn filled lrn2-promo-cta",
    onClick: onStartSurvey
  }, "Unlock free resources", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-right",
    size: 17,
    color: "#fff"
  })));
}
function PromoLearningPath() {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-promo navy",
    "data-screen-label": "Discover your journey",
    onClick: () => go(PFL.allCoursesUrl())
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:route",
    size: 24,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h3", null, "Discover your journey"), /*#__PURE__*/React.createElement("p", null, "We sequence your next-best courses from Recommended, New & Popular — one clear step at a time toward your goal.")), /*#__PURE__*/React.createElement("span", {
    className: "lrn2-navy-btn"
  }, "Explore learning path", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-right",
    size: 17,
    color: "var(--brand-navy)"
  })));
}
function PromoUpgrade() {
  if (!NEXT_TIER) return null;
  const nextName = PFL.TIER_NAME[NEXT_TIER];
  return /*#__PURE__*/React.createElement("div", {
    className: "lrn2-promo navy big",
    "data-screen-label": "Unlock more with " + nextName
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic circle"
  }, /*#__PURE__*/React.createElement(Spark, {
    size: 28,
    color: "var(--premium-orange)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("h3", null, "Unlock more with ", nextName), /*#__PURE__*/React.createElement("p", null, "More courses, live events & community perks.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-upgrade-btn",
    onClick: () => go(PFL.membershipUrl)
  }, FREE_TIER ? "Subscribe" : "Upgrade", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 19,
    color: "#fff"
  })));
}

/* ---------------------------------------------------------------- app ----- */
function pfTagActiveNav(activeLabel) {
  document.querySelectorAll("#pf-root nav > button").forEach(b => {
    const label = b.textContent.replace(/[0-9]/g, "").trim();
    const active = label === activeLabel;
    b.style.setProperty("-webkit-appearance", "none", "important");
    b.style.setProperty("appearance", "none", "important");
    b.style.setProperty("background", active ? "var(--pf-nav-active-bg, rgb(225, 223, 242))" : "none", "important");
    b.style.setProperty("transition", "background .18s ease", "important");
    const path = b.querySelector("svg path");
    if (path) path.style.setProperty("fill", active ? "currentColor" : "", "important");
  });
}
function navigate(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) go(u);
}
const EMPTY = {
  "In Progress": "No courses in progress yet.",
  "Completed": "Complete a course to earn your first certificate.",
  "Saved": "Tap the bookmark on a course to keep it here."
};
function MyLearningApp() {
  const [tab, setTab] = useState("All Courses");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [resourcesUnlocked, setResourcesUnlocked] = useState(PFL.resourcesUnlocked);
  const saved = PFL.useSaved();
  useEffectL(() => pfTagActiveNav("My Learning"));
  useEffectL(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);
  const myCourses = PFC.coursesForTier(TIER);
  const q = query.trim().toLowerCase();
  const filters = {
    "In Progress": c => c.inProgress,
    "Completed": c => c.completed,
    "Saved": c => saved.indexOf(c.title) !== -1
  };
  const visibleCourses = myCourses.filter(filters[tab] || (() => true)).filter(c => !q || c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q));
  const continueCourse = myCourses.find(c => c.inProgress);
  /* My Courses grid: the first in-progress course leads (All Courses / In
     Progress) and is the featured card; All Courses shows six, the rest live
     on My Courses (user, 2026-09-16). */
  const leadTab = tab === "All Courses" || tab === "In Progress";
  const leadIdx = leadTab ? visibleCourses.findIndex(c => c.inProgress) : -1;
  const orderedCourses = leadIdx > 0 ? [visibleCourses[leadIdx]].concat(visibleCourses.filter((_, j) => j !== leadIdx)) : visibleCourses;
  const shownCourses = tab === "All Courses" && !q ? orderedCourses.slice(0, 6) : orderedCourses;
  const hiddenCount = orderedCourses.length - shownCourses.length;
  const inProgressN = myCourses.filter(c => c.inProgress).length;
  const certN = myCourses.filter(c => c.completed).length;
  const mcSummary = [myCourses.length + (myCourses.length === 1 ? " course" : " courses"), inProgressN ? inProgressN + " in progress" : null, certN ? certN + (certN === 1 ? " certificate" : " certificates") : null].filter(Boolean).join(" · ");
  const showContinue = !FREE_TIER && !CONFIDENCE_TIER && continueCourse && !q && (tab === "All Courses" || tab === "In Progress");
  const unlockResources = () => {
    PFL.unlockResources();
    setResourcesUnlocked(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNav, {
    active: "My Learning",
    user: ME,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigate,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "page",
    "data-screen-label": "My Learning"
  }, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(GoalCard, {
    onHelp: () => setHelpOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "lrn-tabs"
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: TABS,
    active: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("label", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search course…",
    "aria-label": "Search course",
    value: query,
    onChange: e => setQuery(e.target.value)
  }), query && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "search-clear",
    "aria-label": "Clear search",
    onClick: () => setQuery("")
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:x",
    size: 16,
    color: "var(--gray-500)"
  }))), CONFIDENCE_TIER && !q && (tab === "All Courses" || tab === "In Progress") && /*#__PURE__*/React.createElement(ConfidenceDashboard, {
    saved: saved
  }), showContinue && /*#__PURE__*/React.createElement(ContinueLearning, {
    c: continueCourse
  }), /*#__PURE__*/React.createElement("section", {
    className: "panel" + (FREE_TIER ? "" : " lrn2-mc-panel"),
    "data-screen-label": "My Courses"
  }, FREE_TIER ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHead, {
    title: "My Courses"
  }), /*#__PURE__*/React.createElement(LockedCoursesPanel, null)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-mc-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lrn2-mc-head-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lrn2-eyebrow gold"
  }, "Your library"), /*#__PURE__*/React.createElement("h2", {
    className: "lrn2-mc-h"
  }, "My Courses"), /*#__PURE__*/React.createElement("p", {
    className: "lrn2-mc-sub"
  }, mcSummary)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-rel-browse",
    onClick: () => go("MyCoursesWeb.html")
  }, "View all courses", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-right",
    size: 16,
    color: "currentColor"
  }))), (loading || shownCourses.length > 0) && /*#__PURE__*/React.createElement("div", {
    className: "lrn2-mc-grid"
  }, loading ? Array.from({
    length: 3
  }).map((_, i) => /*#__PURE__*/React.createElement(SkeletonCourseCard, {
    key: i
  })) : shownCourses.map((c, i) => /*#__PURE__*/React.createElement(MyCourseCard, {
    key: c.slug,
    c: c,
    saved: saved,
    featured: leadTab && i === 0 && !!c.inProgress
  }))), !loading && visibleCourses.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "lrn2-mc-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: q ? "lucide:search" : MC_EMPTY_ICON[tab] || "lucide:book-open",
    size: 24,
    color: "var(--lrn2-gold-ink)"
  })), /*#__PURE__*/React.createElement("p", null, q ? "No courses match your search." : EMPTY[tab] || "No courses here yet.")), !loading && hiddenCount > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lrn2-mc-more",
    onClick: () => go("MyCoursesWeb.html")
  }, "View all ", orderedCourses.length, " courses", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-right",
    size: 16,
    color: "currentColor"
  })))), !FREE_TIER && /*#__PURE__*/React.createElement(RelatedContent, null), /*#__PURE__*/React.createElement("section", {
    className: "lrn2-promos"
  }, /*#__PURE__*/React.createElement(PromoFreeResources, {
    unlocked: resourcesUnlocked,
    onStartSurvey: () => setSurveyOpen(true)
  }), !FREE_TIER && /*#__PURE__*/React.createElement(PromoLearningPath, null), /*#__PURE__*/React.createElement(PromoUpgrade, null))), /*#__PURE__*/React.createElement(HelpModal, {
    open: helpOpen,
    onClose: () => setHelpOpen(false)
  }), SurveyWeb && surveyOpen && /*#__PURE__*/React.createElement("div", {
    className: "lrn2-survey"
  }, /*#__PURE__*/React.createElement(SurveyWeb, {
    open: surveyOpen,
    onClose: () => setSurveyOpen(false),
    onComplete: unlockResources
  })));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MyLearningApp, null));
