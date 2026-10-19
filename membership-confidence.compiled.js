/* ===========================================================================
   PROfinity — Confidence membership journey (mobile + web)
   One bundle, three screens, picked by the shell before this script loads:
     window.PF_MC_PAGE = "hub"      MembershipConfidence.html   My Membership dashboard
                        "map"      MembershipMap.html          Membership Learning Map
                        "tuesdays" TechniqueTuesdays.html      Technique Tuesday library
     window.PF_MC_WEB  = true      *Web.html twins — same screens inside the
                                   desktop TopNav shell (.mc-web layout)

   Journey: My Learning → My Membership (hub) → Learning Map → Technique
   Tuesdays / membership modules → lesson details (CourseDetail.html, the
   existing Confidence reader) → video player (its LXPlayer, ?play=1).
   Every lesson link carries ?ret= so the reader's back button returns here.

   Data: membership-data.js (window.PFMembership) — the real PROfinity
   Membership course (25 modules / 266 lessons) with pf-lessons-done
   completion and the pf-membership-watch Continue Watching store. Suffixed
   -MC because every page script shares one global scope.
   =========================================================================== */
const {
  useState: useStateMC,
  useEffect: useEffectMC,
  useRef: useRefMC,
  useMemo: useMemoMC
} = React;
const DSMC = window.ProfinityDesignSystem_c2b5cc;
const M_MC = window.PFMembership;
const PFLS_MC = window.PFLearnShared || {};
const MC_WEB = !!window.PF_MC_WEB;
const MC_PAGE = window.PF_MC_PAGE || "hub";
const MC_ME = PFLS_MC.ME || {
  name: "Katy",
  avatar: "assets/avatar-katy.jpg"
};
const MC_NAVY = "#0C1928";
const MC_GOLD = "#CE9957";
const MC_GOLD_INK = "#8A5303";
function goMC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const IcMC = DSMC.IconifyIcon;

/* page URLs by surface (mobile shells vs the web twins) */
function pageMC(key) {
  const P = M_MC.PAGES;
  if (MC_WEB) return {
    hub: P.hubWeb,
    map: P.mapWeb,
    tuesdays: P.tuesdaysWeb,
    learning: P.learningWeb,
    events: M_MC.LIVE.eventsWebUrl,
    chat: "Community.html",
    dm: "MessagesWeb.html",
    directory: "ClinicianDirectory.html",
    tiers: "MembershipTier.html"
  }[key];
  return {
    hub: P.hub,
    map: P.map,
    tuesdays: P.tuesdays,
    learning: P.learning,
    events: M_MC.LIVE.eventsUrl,
    chat: "CommunityMobile.html",
    dm: "DirectMessage.html",
    directory: "ClinicianDirectory.html",
    tiers: "MembershipTier.html"
  }[key];
}
/* lesson details (course page) / straight into the player */
function lessonUrlMC(l, play) {
  if (MC_WEB) {
    const p = new URLSearchParams({
      course: M_MC.SLUG,
      level: l.li,
      module: l.si,
      lesson: l.ni
    });
    return (play ? M_MC.PAGES.lessonWeb : M_MC.PAGES.courseWeb) + "?" + p.toString();
  }
  return M_MC.lessonUrl(l, {
    play: !!play
  });
}
function courseUrlMC() {
  return MC_WEB ? M_MC.PAGES.courseWeb + "?course=" + M_MC.SLUG : M_MC.courseUrl();
}
function moduleUrlMC(m, done) {
  const l = M_MC.moduleResume(m, done);
  return l ? lessonUrlMC(l, false) : courseUrlMC();
}

/* ---------------------------------------------------------------- atoms -- */
/* Confidence = silver (user rule); Mastery would be gold. */
function MCBadge({
  small
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mc-badge" + (small ? " mc-badge-sm" : ""),
    "aria-label": "Confidence membership"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:shield-check",
    size: small ? 13 : 15,
    color: "#2B3440"
  }), "Confidence");
}
function MCRing({
  pct,
  size = 84,
  stroke = 8,
  label
}) {
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r;
  return /*#__PURE__*/React.createElement("svg", {
    className: "mc-ring",
    width: size,
    height: size,
    viewBox: "0 0 " + size + " " + size,
    role: "img",
    "aria-label": (label || "Membership progress") + " " + pct + "%"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--mc-ring-track)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--mc-ring)",
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
    className: "mc-ring-n"
  }, pct, "%"));
}

/* Video thumbnail. The membership CDN posters are not public, so every card
   draws a numbered tile and says so — real artwork drops in via l.poster. */
function MCThumb({
  lesson,
  className,
  play,
  onPlay
}) {
  const tt = !!lesson.n;
  const mod = M_MC.module(lesson.module);
  return /*#__PURE__*/React.createElement("span", {
    className: "mc-thumb" + (tt ? " mc-thumb-tt" : "") + (className ? " " + className : "")
  }, lesson.poster ? /*#__PURE__*/React.createElement("img", {
    src: lesson.poster,
    alt: "",
    loading: "lazy"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "mc-thumb-art",
    "aria-hidden": "true"
  }, !tt && /*#__PURE__*/React.createElement(IcMC, {
    name: mod ? mod.icon : "lucide:play",
    size: 26,
    color: "rgba(255,255,255,.9)"
  })), !lesson.poster && /*#__PURE__*/React.createElement("span", {
    className: "mc-thumb-ph",
    title: "Thumbnail not provided yet — placeholder"
  }, "Placeholder"), play && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-thumb-play",
    "aria-label": "Play " + M_MC.shortTitle(lesson),
    onClick: e => {
      e.stopPropagation();
      onPlay && onPlay();
    }
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "fluent:play-16-filled",
    size: 16,
    color: MC_NAVY
  })));
}
function MCStatusChip({
  status,
  pct
}) {
  if (status === "done") return /*#__PURE__*/React.createElement("span", {
    className: "mc-chip mc-chip-done"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:check",
    size: 11,
    color: "currentColor",
    strokeWidth: 3
  }), "Completed");
  if (status === "live") return /*#__PURE__*/React.createElement("span", {
    className: "mc-chip mc-chip-live"
  }, pct, "% · In progress");
  if (status === "new") return /*#__PURE__*/React.createElement("span", {
    className: "mc-chip mc-chip-new"
  }, "New this week");
  return /*#__PURE__*/React.createElement("span", {
    className: "mc-chip"
  }, "Not started");
}
function MCBar({
  pct,
  className
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mc-bar" + (className ? " " + className : ""),
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + "%"
    }
  }));
}

/* ---------------------------------------------------------------- chrome -- */
function MCHeader({
  title,
  back,
  right,
  eyebrow
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "mc-top",
    "data-screen-label": "Header"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-back",
    "aria-label": "Back",
    onClick: () => goMC(back)
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:chevron-left",
    size: 22,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mc-top-tx"
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "mc-top-eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("span", {
    className: "mc-top-title"
  }, title)), right || /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-avatar",
    "aria-label": "Your profile",
    onClick: () => goMC(MC_WEB ? "Profile.html" : "ProfileMobile.html")
  }, /*#__PURE__*/React.createElement("img", {
    src: MC_ME.avatar,
    alt: ""
  })));
}
const MC_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: "NewsfeedMobile.html"
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Learning",
  label: "Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Agent",
  label: "Agents",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}, {
  key: "Rewards",
  label: "Rewards",
  icon: "lucide:gift",
  href: "RewardsDashboard.html"
}];
function MCTabBar({
  compact
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "lm-tabs" + (compact ? " lm-tabs-compact" : ""),
    "aria-label": "Primary"
  }, MC_TABS.map(t => {
    const on = t.key === "Learning";
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      className: "lm-tab" + (on ? " on" : ""),
      "aria-current": on ? "page" : undefined,
      onClick: () => goMC(t.href)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(IcMC, {
      name: t.icon,
      size: 24,
      color: on ? "#fff" : "#000"
    }), t.dot && /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, t.dot)), /*#__PURE__*/React.createElement("span", {
      className: "lbl"
    }, t.label));
  }));
}
function useScrollChromeMC(ref) {
  const [state, setState] = useStateMC({
    hidden: false,
    floating: false
  });
  useEffectMC(() => {
    const el = ref.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop,
        d = y - lastY;
      setState(p => {
        let hidden = p.hidden;
        if (y < 40) hidden = false;else if (d > 6) hidden = true;else if (d < -6) hidden = false;
        return {
          hidden,
          floating: y > 40
        };
      });
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}

/* ---------------------------------------------------------------- shared cards -- */
/* "Up next" — the one thing to do now: resume a half-watched video, the next
   Start-here step, or the newest Technique Tuesday. */
function MCNextUp({
  done,
  watch,
  compact
}) {
  const nu = useMemoMC(() => M_MC.nextUp(done, watch), [done, watch]);
  const l = nu.lesson;
  const mod = M_MC.module(l.module);
  const resume = nu.kind === "resume";
  return /*#__PURE__*/React.createElement("section", {
    className: "mc-sec" + (compact ? " mc-sec-tight" : ""),
    "data-screen-label": "Continue learning"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-eyebrow"
  }, "Continue learning")), /*#__PURE__*/React.createElement("article", {
    className: "mc-card mc-next"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-next-media",
    onClick: () => goMC(lessonUrlMC(l, true)),
    "aria-label": "Play " + M_MC.shortTitle(l)
  }, /*#__PURE__*/React.createElement(MCThumb, {
    lesson: l
  }), /*#__PURE__*/React.createElement("span", {
    className: "mc-next-play",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "fluent:play-16-filled",
    size: 18,
    color: MC_NAVY
  })), resume && /*#__PURE__*/React.createElement(MCBar, {
    pct: nu.pct,
    className: "mc-bar-overlay"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mc-next-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-kicker"
  }, nu.reason), /*#__PURE__*/React.createElement("h3", {
    className: "mc-next-title"
  }, M_MC.shortTitle(l)), /*#__PURE__*/React.createElement("p", {
    className: "mc-next-meta"
  }, l.n ? "Technique Tuesday · Lesson " + l.n : mod ? mod.name : "", l.secs ? " · " + M_MC.fmtSecs(l.secs) : "", resume ? " · " + nu.pct + "% watched" : ""), /*#__PURE__*/React.createElement("div", {
    className: "mc-next-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-btn mc-btn-navy",
    onClick: () => goMC(lessonUrlMC(l, true))
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:play",
    size: 15,
    color: "#fff"
  }), resume ? "Resume" : "Start"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-btn mc-btn-ghost",
    onClick: () => goMC(lessonUrlMC(l, false))
  }, "Lesson details")))));
}

/* Technique Tuesday live strip — real schedule from the TT artwork */
function MCLiveStrip({
  withArt
}) {
  const live = M_MC.nextLive();
  return /*#__PURE__*/React.createElement("section", {
    className: "mc-sec",
    "data-screen-label": "Next Technique Tuesday"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-card mc-live" + (withArt ? " mc-live-art" : "")
  }, withArt && /*#__PURE__*/React.createElement("img", {
    className: "mc-live-img",
    src: M_MC.TT_ART,
    alt: "Technique Tuesday — every week, 8 PM UK / 3 PM ET"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-live-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-live-dot",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-live-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-kicker"
  }, "Next live session · ", live.when), /*#__PURE__*/React.createElement("b", {
    className: "mc-live-when"
  }, live.label, " · ", live.time), /*#__PURE__*/React.createElement("span", {
    className: "mc-live-sub"
  }, M_MC.LIVE.label, " with ", M_MC.HOST.name, ". The replay lands in the library the next morning."))), /*#__PURE__*/React.createElement("div", {
    className: "mc-live-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-btn mc-btn-gold",
    onClick: () => goMC(pageMC("events"))
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:calendar-plus",
    size: 15,
    color: MC_NAVY
  }), "Add to calendar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-btn mc-btn-ghost",
    onClick: () => goMC(pageMC("tuesdays"))
  }, "Watch replays"))));
}

/* ================================================================ HUB ===== */
function MCHubHero({
  prog
}) {
  const hours = M_MC.fmtHours(prog.secs);
  return /*#__PURE__*/React.createElement("section", {
    className: "mc-hero",
    "data-screen-label": "My Membership · Confidence"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-hero-head"
  }, /*#__PURE__*/React.createElement(MCBadge, null), /*#__PURE__*/React.createElement("span", {
    className: "mc-hero-since"
  }, "Member library · ", M_MC.MODULES.length, " modules · ", prog.total, " lessons")), /*#__PURE__*/React.createElement("h1", {
    className: "mc-hero-title"
  }, "Welcome back, ", MC_ME.name), /*#__PURE__*/React.createElement("div", {
    className: "mc-hero-prog"
  }, /*#__PURE__*/React.createElement(MCRing, {
    pct: prog.pct,
    size: 88,
    stroke: 9
  }), /*#__PURE__*/React.createElement("ul", {
    className: "mc-stats",
    "aria-label": "Membership learning progress"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, prog.done), /*#__PURE__*/React.createElement("span", null, "of ", prog.total, " lessons")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, hours), /*#__PURE__*/React.createElement("span", null, "watched")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, prog.tt.done), /*#__PURE__*/React.createElement("span", null, "of ", prog.tt.total, " Tuesdays")))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-hero-map",
    onClick: () => goMC(pageMC("map"))
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:map",
    size: 16,
    color: MC_GOLD
  }), "View Learning Map", /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:arrow-right",
    size: 16,
    color: MC_GOLD
  })));
}
function MCQuickAccess({
  prog
}) {
  const latest = M_MC.ttLatest(1)[0];
  const items = [{
    key: "tuesdays",
    icon: "lucide:video",
    title: "Technique Tuesdays",
    sub: prog.tt.total + " sessions · " + M_MC.fmtHours(M_MC.ttTotalSecs()),
    chip: latest ? "New · Lesson " + latest.n : null,
    href: pageMC("tuesdays")
  }, {
    key: "map",
    icon: "lucide:map",
    title: "Learning Map",
    sub: "What's included, what's next",
    href: pageMC("map")
  }, {
    key: "content",
    icon: "lucide:library",
    title: "Membership content",
    sub: M_MC.MODULES.length + " modules, full course view",
    href: courseUrlMC()
  }, {
    key: "help",
    icon: "lucide:shield-alert",
    title: "Complications help",
    sub: "Message the clinical team",
    href: pageMC("dm")
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "mc-sec",
    "data-screen-label": "Quick access"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-eyebrow"
  }, "Quick access")), /*#__PURE__*/React.createElement("div", {
    className: "mc-grid"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.key,
    type: "button",
    className: "mc-card mc-tile mc-tile-" + it.key,
    onClick: () => goMC(it.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-tile-ic"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: it.icon,
    size: 20,
    color: MC_GOLD_INK
  })), it.chip && /*#__PURE__*/React.createElement("span", {
    className: "mc-chip mc-chip-new mc-tile-chip"
  }, it.chip), /*#__PURE__*/React.createElement("span", {
    className: "mc-tile-title"
  }, it.title), /*#__PURE__*/React.createElement("span", {
    className: "mc-tile-sub"
  }, it.sub), /*#__PURE__*/React.createElement("span", {
    className: "mc-tile-arrow",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:arrow-up-right",
    size: 16,
    color: "currentColor"
  }))))));
}
function MCIncluded() {
  const hrefFor = h => h === "map" ? pageMC("map") : h === "tuesdays" ? pageMC("tuesdays") : h === "DirectMessage.html" ? pageMC("dm") : h;
  return /*#__PURE__*/React.createElement("section", {
    className: "mc-sec",
    "data-screen-label": "What's included"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-eyebrow"
  }, "What's included in Confidence")), /*#__PURE__*/React.createElement("ul", {
    className: "mc-card mc-list"
  }, M_MC.INCLUDED.map(it => /*#__PURE__*/React.createElement("li", {
    key: it.text
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-row",
    onClick: () => goMC(hrefFor(it.href))
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-row-ic"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: it.icon,
    size: 18,
    color: MC_GOLD_INK
  })), /*#__PURE__*/React.createElement("span", {
    className: "mc-row-tx"
  }, it.text), /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--mc-muted)"
  }))))));
}
function MCUpgrade() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mc-sec",
    "data-screen-label": "Unlock more with Mastery"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-ramp",
    onClick: () => goMC(pageMC("tiers"))
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-ramp-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-ramp-title"
  }, "Unlock more with Mastery"), /*#__PURE__*/React.createElement("span", {
    className: "mc-ramp-body"
  }, "Every course in the catalogue, live case reviews and the Mastery community channels."), /*#__PURE__*/React.createElement("span", {
    className: "mc-ramp-cta"
  }, "See what's included")), /*#__PURE__*/React.createElement("span", {
    className: "mc-ramp-arrow",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:arrow-right",
    size: 18,
    color: "#7A4A03"
  }))));
}
function MembershipHub() {
  const done = M_MC.useDone();
  const watch = M_MC.useWatch();
  const prog = useMemoMC(() => M_MC.progress(done), [done]);
  const scrollRef = useRefMC(null);
  const {
    hidden
  } = useScrollChromeMC(scrollRef);
  const back = M_MC.ret(pageMC("learning"));
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-screen",
    "data-screen-label": "My Membership · Confidence"
  }, !MC_WEB && /*#__PURE__*/React.createElement(MCHeader, {
    title: "My Membership",
    back: back
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-scroll",
    ref: scrollRef
  }, MC_WEB && /*#__PURE__*/React.createElement(MCCrumb, {
    items: [{
      label: "My Learning",
      href: pageMC("learning")
    }, {
      label: "My Membership"
    }]
  }), /*#__PURE__*/React.createElement(MCHubHero, {
    prog: prog
  }), /*#__PURE__*/React.createElement(MCNextUp, {
    done: done,
    watch: watch
  }), /*#__PURE__*/React.createElement(MCQuickAccess, {
    prog: prog
  }), /*#__PURE__*/React.createElement(MCLiveStrip, {
    withArt: true
  }), /*#__PURE__*/React.createElement(MCUpgrade, null), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), !MC_WEB && /*#__PURE__*/React.createElement(MCTabBar, {
    compact: hidden
  }));
}

/* ================================================================ MAP ===== */
function moduleMetaMC(m, mp) {
  const secs = m.lessons.reduce((s, l) => s + (l.secs || 0), 0);
  const vids = m.lessons.filter(l => l.kind === "video").length;
  const parts = [m.lessons.length + (m.lessons.length === 1 ? " lesson" : " lessons")];
  if (vids && vids !== m.lessons.length) parts.push(vids + " videos");
  if (secs) parts.push(M_MC.fmtHours(secs));
  return parts.join(" · ");
}
function MCModuleRow({
  m,
  mp,
  done,
  latestNo
}) {
  const isTT = m.key === "technique-tuesday";
  const cta = mp.status === "done" ? "Review" : mp.status === "live" ? "Continue" : "Start";
  const open = () => goMC(isTT ? pageMC("tuesdays") : moduleUrlMC(m, done));
  return /*#__PURE__*/React.createElement("li", {
    className: "mc-mod mc-mod-" + mp.status
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-mod-main",
    onClick: open,
    "aria-label": m.name + ", " + mp.done + " of " + mp.total + " completed"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-mod-ic"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: m.icon,
    size: 19,
    color: mp.status === "done" ? "#fff" : MC_GOLD_INK
  })), /*#__PURE__*/React.createElement("span", {
    className: "mc-mod-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-mod-name"
  }, m.name, isTT && latestNo && /*#__PURE__*/React.createElement("span", {
    className: "mc-chip mc-chip-new"
  }, "New · Lesson ", latestNo)), /*#__PURE__*/React.createElement("span", {
    className: "mc-mod-meta"
  }, moduleMetaMC(m, mp)), m.blurb && /*#__PURE__*/React.createElement("span", {
    className: "mc-mod-blurb"
  }, m.blurb), /*#__PURE__*/React.createElement("span", {
    className: "mc-mod-prog"
  }, /*#__PURE__*/React.createElement(MCBar, {
    pct: mp.pct
  }), /*#__PURE__*/React.createElement("span", {
    className: "mc-mod-count"
  }, mp.done, "/", mp.total)))), /*#__PURE__*/React.createElement("div", {
    className: "mc-mod-foot"
  }, /*#__PURE__*/React.createElement(MCStatusChip, {
    status: isTT && mp.done === 0 ? "new" : mp.status === "new" ? "idle" : mp.status,
    pct: mp.pct
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-btn mc-btn-sm mc-btn-navy",
    onClick: open
  }, isTT ? "Open library" : cta, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:arrow-right",
    size: 13,
    color: "#fff"
  }))));
}
function MCStage({
  stage,
  index,
  prog,
  done,
  open,
  onToggle,
  latestNo
}) {
  const mods = M_MC.stageModules(stage);
  const sp = prog.stages[stage.key] || {
    done: 0,
    total: 0,
    pct: 0
  };
  const status = sp.done === 0 ? "new" : sp.done === sp.total ? "done" : "live";
  return /*#__PURE__*/React.createElement("li", {
    className: "mc-stage mc-stage-" + status + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-stage-node",
    "aria-hidden": "true"
  }, status === "done" ? /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:check",
    size: 14,
    color: "#fff",
    strokeWidth: 3
  }) : index + 1), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-stage-hd",
    "aria-expanded": open,
    onClick: onToggle
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-stage-ic"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: stage.icon,
    size: 18,
    color: MC_GOLD_INK
  })), /*#__PURE__*/React.createElement("span", {
    className: "mc-stage-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-stage-name"
  }, stage.name), /*#__PURE__*/React.createElement("span", {
    className: "mc-stage-sub"
  }, stage.blurb), /*#__PURE__*/React.createElement("span", {
    className: "mc-stage-prog"
  }, /*#__PURE__*/React.createElement(MCBar, {
    pct: sp.pct
  }), /*#__PURE__*/React.createElement("span", null, sp.done, " of ", sp.total))), /*#__PURE__*/React.createElement(IcMC, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 20,
    color: "var(--mc-muted)"
  })), open && /*#__PURE__*/React.createElement("ul", {
    className: "mc-mods"
  }, mods.map(m => /*#__PURE__*/React.createElement(MCModuleRow, {
    key: m.key,
    m: m,
    mp: prog.modules[m.key],
    done: done,
    latestNo: latestNo
  }))));
}
function MCLegendSheet({
  open,
  onClose
}) {
  if (!open) return null;
  const rows = [{
    chip: /*#__PURE__*/React.createElement(MCStatusChip, {
      status: "new"
    }),
    text: "A new Technique Tuesday replay has landed this week."
  }, {
    chip: /*#__PURE__*/React.createElement(MCStatusChip, {
      status: "live",
      pct: 40
    }),
    text: "You've started this module — Continue picks up at the next lesson."
  }, {
    chip: /*#__PURE__*/React.createElement(MCStatusChip, {
      status: "done"
    }),
    text: "Every lesson completed. Review re-opens the module."
  }, {
    chip: /*#__PURE__*/React.createElement(MCStatusChip, {
      status: "idle"
    }),
    text: "Included in Confidence, not started yet."
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-sheet-wrap",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "How the Learning Map works"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-sheet-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-sheet"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-sheet-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("header", {
    className: "mc-sheet-head"
  }, /*#__PURE__*/React.createElement("h2", null, "How the Learning Map works"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-sheet-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:x",
    size: 20,
    color: "currentColor"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "mc-sheet-p"
  }, "Every module below is included in your Confidence membership. Stages run top to bottom — start with ", /*#__PURE__*/React.createElement("b", null, "Start here"), ", then follow Technique Tuesday weekly and dip into the other stages as your clinic needs them."), /*#__PURE__*/React.createElement("ul", {
    className: "mc-legend"
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, r.chip, /*#__PURE__*/React.createElement("span", null, r.text)))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-btn mc-btn-navy mc-sheet-ok",
    onClick: onClose
  }, "Got it")));
}
function MembershipMap() {
  const done = M_MC.useDone();
  const watch = M_MC.useWatch();
  const prog = useMemoMC(() => M_MC.progress(done), [done]);
  const latest = M_MC.ttLatest(1)[0];
  const [help, setHelp] = useStateMC(false);
  /* Start here + Technique Tuesday open by default, plus any stage in progress */
  const [openKeys, setOpenKeys] = useStateMC(() => {
    const s = {
      start: true,
      tuesday: true
    };
    M_MC.STAGES.forEach(st => {
      const sp = prog.stages[st.key];
      if (sp && sp.done > 0 && sp.done < sp.total) s[st.key] = true;
    });
    return s;
  });
  const toggle = k => setOpenKeys(o => ({
    ...o,
    [k]: !o[k]
  }));
  const scrollRef = useRefMC(null);
  const {
    hidden
  } = useScrollChromeMC(scrollRef);
  const counts = useMemoMC(() => {
    const c = {
      done: 0,
      live: 0,
      new: 0
    };
    M_MC.MODULES.forEach(m => {
      c[prog.modules[m.key].status] += 1;
    });
    return c;
  }, [prog]);
  const help_btn = /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-top-ic",
    "aria-label": "How the Learning Map works",
    onClick: () => setHelp(true)
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:help-circle",
    size: 22,
    color: "currentColor"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-screen",
    "data-screen-label": "Membership Learning Map"
  }, !MC_WEB && /*#__PURE__*/React.createElement(MCHeader, {
    title: "Learning Map",
    eyebrow: "Confidence membership",
    back: M_MC.ret(pageMC("hub")),
    right: help_btn
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-scroll",
    ref: scrollRef
  }, MC_WEB && /*#__PURE__*/React.createElement(MCCrumb, {
    items: [{
      label: "My Learning",
      href: pageMC("learning")
    }, {
      label: "My Membership",
      href: pageMC("hub")
    }, {
      label: "Learning Map"
    }],
    right: help_btn
  }), /*#__PURE__*/React.createElement("section", {
    className: "mc-mapsum",
    "data-screen-label": "Map summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-mapsum-row"
  }, /*#__PURE__*/React.createElement(MCBadge, {
    small: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "mc-mapsum-n"
  }, /*#__PURE__*/React.createElement("b", null, prog.done), " of ", prog.total, " lessons · ", prog.pct, "%")), /*#__PURE__*/React.createElement(MCBar, {
    pct: prog.pct,
    className: "mc-bar-lg"
  }), /*#__PURE__*/React.createElement("ul", {
    className: "mc-mapsum-pills",
    "aria-label": "Module status"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", {
    className: "done"
  }), counts.done, " completed"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", {
    className: "live"
  }), counts.live, " in progress"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", {
    className: "new"
  }), counts.new, " to start"))), /*#__PURE__*/React.createElement(MCNextUp, {
    done: done,
    watch: watch,
    compact: true
  }), /*#__PURE__*/React.createElement("section", {
    className: "mc-sec",
    "data-screen-label": "Learning Map"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-eyebrow"
  }, "Your membership, stage by stage"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-link",
    onClick: () => goMC(courseUrlMC())
  }, "Full course view")), /*#__PURE__*/React.createElement("ol", {
    className: "mc-stages"
  }, M_MC.STAGES.map((st, i) => /*#__PURE__*/React.createElement(MCStage, {
    key: st.key,
    stage: st,
    index: i,
    prog: prog,
    done: done,
    open: !!openKeys[st.key],
    onToggle: () => toggle(st.key),
    latestNo: latest && latest.n
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), !MC_WEB && /*#__PURE__*/React.createElement(MCTabBar, {
    compact: hidden
  }), /*#__PURE__*/React.createElement(MCLegendSheet, {
    open: help,
    onClose: () => setHelp(false)
  }));
}

/* ================================================================ TUESDAYS === */
function MCVideoCard({
  l,
  done,
  w,
  isNew,
  wide
}) {
  const isDone = done.indexOf(l.name) !== -1;
  const pct = w ? M_MC.watchPct(w) : 0;
  return /*#__PURE__*/React.createElement("article", {
    className: "mc-card mc-vcard" + (wide ? " mc-vcard-wide" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-vcard-media",
    onClick: () => goMC(lessonUrlMC(l, false)),
    "aria-label": "Open " + M_MC.shortTitle(l)
  }, /*#__PURE__*/React.createElement(MCThumb, {
    lesson: l,
    play: true,
    onPlay: () => goMC(lessonUrlMC(l, true))
  }), isNew && /*#__PURE__*/React.createElement("span", {
    className: "mc-chip mc-chip-new mc-vcard-new"
  }, "New"), pct > 0 && !isDone && /*#__PURE__*/React.createElement(MCBar, {
    pct: pct,
    className: "mc-bar-overlay"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mc-vcard-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-kicker"
  }, "Lesson ", l.n, l.vault ? " · Vault" : ""), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-vcard-title",
    onClick: () => goMC(lessonUrlMC(l, false))
  }, M_MC.shortTitle(l)), /*#__PURE__*/React.createElement("span", {
    className: "mc-vcard-meta"
  }, l.secs ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:clock",
    size: 12,
    color: "currentColor"
  }), M_MC.fmtSecs(l.secs)) : /*#__PURE__*/React.createElement("span", {
    className: "mc-ph-tag"
  }, "Duration pending"), pct > 0 && !isDone && /*#__PURE__*/React.createElement("span", {
    className: "mc-vcard-left"
  }, "· ", M_MC.fmtSecs(Math.round((l.secs || 0) * (100 - pct) / 100)), " left"), isDone && /*#__PURE__*/React.createElement("span", {
    className: "mc-vcard-done"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:check",
    size: 12,
    color: "currentColor",
    strokeWidth: 3
  }), "Watched"))));
}
function MCVideoRow({
  l,
  done,
  w
}) {
  const isDone = done.indexOf(l.name) !== -1;
  const pct = w ? M_MC.watchPct(w) : 0;
  const topics = (l.topics || []).map(k => (M_MC.TOPICS.find(t => t.key === k) || {}).name).filter(Boolean).slice(0, 2).join(" · ");
  return /*#__PURE__*/React.createElement("li", {
    className: "mc-vrow" + (isDone ? " done" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-vrow-main",
    onClick: () => goMC(lessonUrlMC(l, false))
  }, /*#__PURE__*/React.createElement(MCThumb, {
    lesson: l,
    className: "mc-thumb-sm"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mc-vrow-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-kicker"
  }, "Lesson ", l.n, l.vault ? " · Vault" : "", isDone && /*#__PURE__*/React.createElement("span", {
    className: "mc-vrow-watched"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:check",
    size: 11,
    color: "currentColor",
    strokeWidth: 3
  }), "Watched")), /*#__PURE__*/React.createElement("span", {
    className: "mc-vrow-title"
  }, M_MC.shortTitle(l)), /*#__PURE__*/React.createElement("span", {
    className: "mc-vrow-meta"
  }, l.secs ? M_MC.fmtSecs(l.secs) : /*#__PURE__*/React.createElement("span", {
    className: "mc-ph-tag"
  }, "Duration pending"), topics ? " · " + topics : ""), pct > 0 && !isDone && /*#__PURE__*/React.createElement(MCBar, {
    pct: pct,
    className: "mc-bar-thin"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-vrow-play",
    "aria-label": "Play " + M_MC.shortTitle(l),
    onClick: () => goMC(lessonUrlMC(l, true))
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "fluent:play-16-filled",
    size: 14,
    color: "currentColor"
  })));
}
const MC_PAGE_SIZE = 20;
/* ---------------------------------------------------------------- upcoming live sessions + calendar -- */
/* Technique Tuesday is live every Tuesday 8 PM UK (3 PM ET). The next three
   dates come from PFMembership.nextLive(); the UTC instant is derived from
   Europe/London so BST/GMT switches are right. Add to calendar mirrors the
   Events page picker (Google / Apple / Outlook / .ics). */
const MC_LIVE_MINS = 90;
function mcLondonUTC(y, m, d, h) {
  const guess = Date.UTC(y, m, d, h);
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      hour12: false
    }).formatToParts(new Date(guess));
    const lh = parseInt((parts.find(x => x.type === "hour") || {}).value, 10) % 24;
    return new Date(guess - (lh - h) * 3600000);
  } catch (e) {
    return new Date(guess);
  }
}
function mcUpcomingSessions(n) {
  const first = M_MC.nextLive().date;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out = [];
  for (let i = 0; i < (n || 3); i++) {
    const d = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i * 7);
    const start = mcLondonUTC(d.getFullYear(), d.getMonth(), d.getDate(), 20);
    const inDays = Math.round((d - today) / 864e5);
    out.push({
      id: "technique-tuesday-" + d.toISOString().slice(0, 10),
      title: "Technique Tuesday · Live with " + M_MC.HOST.name,
      day: d.getDate(),
      mon: months[d.getMonth()],
      weekday: days[d.getDay()],
      label: days[d.getDay()] + " " + d.getDate() + " " + months[d.getMonth()],
      when: inDays === 0 ? "Today" : inDays === 1 ? "Tomorrow" : "In " + inDays + " days",
      time: M_MC.LIVE.time,
      start,
      end: new Date(start.getTime() + MC_LIVE_MINS * 60000)
    });
  }
  return out;
}
function mcCalZ(x) {
  return x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
function mcCalDetails(ev) {
  return "Dr Tim Pearce's weekly live injection demonstration for PROfinity members. Bring your questions — the replay lands in Technique Tuesdays the next morning.\n\nOpen in the app: " + window.location.href.split("#")[0];
}
function mcGoogleUrl(ev) {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    details: mcCalDetails(ev),
    location: "PROfinity Academy — live in the app",
    dates: mcCalZ(ev.start) + "/" + mcCalZ(ev.end)
  });
  return "https://calendar.google.com/calendar/render?" + q.toString();
}
function mcOutlookUrl(ev) {
  const q = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.title,
    body: mcCalDetails(ev),
    location: "PROfinity Academy — live in the app",
    startdt: ev.start.toISOString(),
    enddt: ev.end.toISOString()
  });
  return "https://outlook.live.com/calendar/0/action/compose?" + q.toString();
}
function mcDownloadIcs(ev) {
  const esc = t => String(t).replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PROfinity Academy//Technique Tuesday//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT", "UID:" + ev.id + "@profinity.app", "DTSTAMP:" + mcCalZ(new Date()), "DTSTART:" + mcCalZ(ev.start), "DTEND:" + mcCalZ(ev.end), "SUMMARY:" + esc(ev.title), "DESCRIPTION:" + esc(mcCalDetails(ev)), "LOCATION:" + esc("PROfinity Academy — live in the app"), "END:VEVENT", "END:VCALENDAR"];
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = ev.id + ".ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
const MC_CAL_APPS = [{
  k: "google",
  l: "Google Calendar",
  s: "Opens calendar.google.com with the session filled in",
  i: "logos:google-calendar"
}, {
  k: "apple",
  l: "Apple Calendar",
  s: "Downloads a .ics you can open on iPhone or Mac",
  i: "lucide:calendar-days"
}, {
  k: "outlook",
  l: "Outlook",
  s: "Opens Outlook on the web with the session filled in",
  i: "logos:microsoft-icon"
}, {
  k: "ics",
  l: "Other calendar (.ics)",
  s: "Works with any calendar app",
  i: "lucide:download"
}];
function MCCalendarSheet({
  ev,
  onClose
}) {
  const [picked, setPicked] = useStateMC(null);
  useEffectMC(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  const pick = k => {
    try {
      if (k === "google") window.open(mcGoogleUrl(ev), "_blank", "noopener");else if (k === "outlook") window.open(mcOutlookUrl(ev), "_blank", "noopener");else mcDownloadIcs(ev);
    } catch (e) {}
    setPicked(k);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-sheet-wrap",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Add to calendar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-sheet-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-sheet"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-sheet-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("header", {
    className: "mc-sheet-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Add to calendar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-sheet-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:x",
    size: 20,
    color: "currentColor"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mc-cal-ev"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-upc-date"
  }, /*#__PURE__*/React.createElement("b", null, ev.day), /*#__PURE__*/React.createElement("i", null, ev.mon)), /*#__PURE__*/React.createElement("span", {
    className: "mc-cal-ev-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, ev.title), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, ev.weekday, " · ", ev.time, " · ", MC_LIVE_MINS, " min"))), /*#__PURE__*/React.createElement("div", {
    className: "mc-cal-apps"
  }, MC_CAL_APPS.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.k,
    type: "button",
    className: "mc-cal-app" + (picked === a.k ? " done" : ""),
    onClick: () => pick(a.k)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: picked === a.k ? "lucide:check" : a.i,
    size: 22,
    color: picked === a.k ? "#2E9E6B" : MC_NAVY
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, a.l), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, picked === a.k ? "Added — check your calendar app" : a.s)), /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--mc-muted)"
  }))))));
}
function TechniqueTuesdays() {
  const done = M_MC.useDone();
  const watch = M_MC.useWatch();
  const all = useMemoMC(() => M_MC.ttLessons(), []);
  const cont = useMemoMC(() => M_MC.continueWatching(done, watch), [done, watch]);
  const latest = all.slice(0, 3);
  const [q, setQ] = useStateMC("");
  const [topic, setTopic] = useStateMC("all");
  const [showN, setShowN] = useStateMC(MC_PAGE_SIZE);
  const [searchOpen, setSearchOpen] = useStateMC(false);
  const searchRef = useRefMC(null);
  const live = M_MC.nextLive();
  const scrollRef = useRefMC(null);
  const {
    hidden
  } = useScrollChromeMC(scrollRef);
  const chips = [{
    key: "all",
    name: "All"
  }].concat(M_MC.TOPICS).concat([{
    key: "vault",
    name: "Vault · 1–30"
  }, {
    key: "unwatched",
    name: "Unwatched"
  }]);
  const qq = q.trim().toLowerCase();
  const list = all.filter(l => {
    if (topic === "vault" && !l.vault) return false;
    if (topic === "unwatched" && done.indexOf(l.name) !== -1) return false;
    if (topic !== "all" && topic !== "vault" && topic !== "unwatched" && (l.topics || []).indexOf(topic) === -1) return false;
    if (qq && M_MC.shortTitle(l).toLowerCase().indexOf(qq) === -1 && ("lesson " + l.n).indexOf(qq) === -1) return false;
    return true;
  });
  const shown = list.slice(0, showN);
  const watched = all.filter(l => done.indexOf(l.name) !== -1).length;
  useEffectMC(() => {
    setShowN(MC_PAGE_SIZE);
  }, [topic, qq]);
  useEffectMC(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);
  const scrollToLib = () => {
    const el = document.getElementById("mc-library");
    if (el) el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const [cal, setCal] = useStateMC(null);
  const upcoming = useMemoMC(() => mcUpcomingSessions(3), []);
  const searchBtn = /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-top-ic",
    "aria-label": "Search sessions",
    onClick: () => {
      setSearchOpen(true);
      scrollToLib();
    }
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:search",
    size: 21,
    color: "currentColor"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-screen mc-screen-tt",
    "data-screen-label": "Technique Tuesday"
  }, !MC_WEB && /*#__PURE__*/React.createElement(MCHeader, {
    title: "Technique Tuesday",
    eyebrow: "Confidence membership",
    back: M_MC.ret(pageMC("hub")),
    right: searchBtn
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-scroll",
    ref: scrollRef
  }, MC_WEB && /*#__PURE__*/React.createElement(MCCrumb, {
    items: [{
      label: "My Learning",
      href: pageMC("learning")
    }, {
      label: "My Membership",
      href: pageMC("hub")
    }, {
      label: "Technique Tuesday"
    }],
    right: searchBtn
  }), /*#__PURE__*/React.createElement("section", {
    className: "mc-tthero",
    "data-screen-label": "Upcoming events"
  }, /*#__PURE__*/React.createElement("img", {
    className: "mc-tthero-img",
    src: M_MC.TT_ART,
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "mc-tthero-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-kicker mc-kicker-gold"
  }, "Upcoming events · Live every Tuesday"), /*#__PURE__*/React.createElement("h1", {
    className: "mc-tthero-title"
  }, "Technique Tuesday"), /*#__PURE__*/React.createElement("p", {
    className: "mc-tthero-sub"
  }, "Live injection demonstrations with ", M_MC.HOST.name, ". Next live ", /*#__PURE__*/React.createElement("b", null, upcoming[0].label), " · ", M_MC.LIVE.time, " · ", upcoming[0].when.toLowerCase(), "."), /*#__PURE__*/React.createElement("div", {
    className: "mc-tthero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-btn mc-btn-gold",
    onClick: () => setCal(upcoming[0])
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:calendar-plus",
    size: 15,
    color: MC_NAVY
  }), "Add to calendar")))), /*#__PURE__*/React.createElement("section", {
    className: "mc-sec",
    id: "mc-library",
    "data-screen-label": "Video library"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-eyebrow"
  }, "Video library"), /*#__PURE__*/React.createElement("span", {
    className: "mc-sec-count"
  }, list.length, " of ", all.length)), (searchOpen || q || MC_WEB) && /*#__PURE__*/React.createElement("label", {
    className: "mc-search"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:search",
    size: 18,
    color: "var(--mc-muted)"
  }), /*#__PURE__*/React.createElement("input", {
    ref: searchRef,
    placeholder: "Search sessions or “Lesson 84”",
    "aria-label": "Search Technique Tuesday sessions",
    value: q,
    onChange: e => setQ(e.target.value)
  }), q && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-search-clear",
    "aria-label": "Clear",
    onClick: () => setQ("")
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:x",
    size: 16,
    color: "currentColor"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mc-chips",
    role: "tablist",
    "aria-label": "Filter by topic"
  }, chips.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.key,
    type: "button",
    role: "tab",
    "aria-selected": topic === c.key,
    className: "mc-chipbtn" + (topic === c.key ? " on" : ""),
    onClick: () => setTopic(c.key)
  }, c.name))), shown.length ? /*#__PURE__*/React.createElement("ul", {
    className: "mc-vlist"
  }, shown.map(l => /*#__PURE__*/React.createElement(MCVideoRow, {
    key: l.name,
    l: l,
    done: done,
    w: watch[l.name]
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "mc-empty"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:search",
    size: 22,
    color: MC_GOLD_INK
  }), /*#__PURE__*/React.createElement("p", null, "No sessions match", q ? " “" + q.trim() + "”" : "", "."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-link",
    onClick: () => {
      setQ("");
      setTopic("all");
    }
  }, "Clear filters")), list.length > shown.length && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mc-btn mc-btn-ghost mc-more",
    onClick: () => setShowN(n => n + MC_PAGE_SIZE)
  }, "Show ", Math.min(MC_PAGE_SIZE, list.length - shown.length), " more", /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:chevron-down",
    size: 16,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("p", {
    className: "mc-foot-note"
  }, /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:info",
    size: 13,
    color: "currentColor"
  }), "Titles, lesson numbers and durations are the live membership content. Thumbnails are placeholders until the posters are supplied.")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), cal && /*#__PURE__*/React.createElement(MCCalendarSheet, {
    ev: cal,
    onClose: () => setCal(null)
  }), !MC_WEB && /*#__PURE__*/React.createElement(MCTabBar, {
    compact: hidden
  }));
}

/* ================================================================ WEB shell === */
function MCCrumb({
  items,
  right
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "mc-crumb",
    "aria-label": "Breadcrumb"
  }, /*#__PURE__*/React.createElement("ol", null, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, it.href ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => goMC(it.href)
  }, it.label) : /*#__PURE__*/React.createElement("span", {
    "aria-current": "page"
  }, it.label), i < items.length - 1 && /*#__PURE__*/React.createElement(IcMC, {
    name: "lucide:chevron-right",
    size: 14,
    color: "var(--mc-muted)"
  })))), right);
}
const MC_SCREENS = {
  hub: MembershipHub,
  map: MembershipMap,
  tuesdays: TechniqueTuesdays
};
function useDeviceScaleMC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateMC(calc);
  useEffectMC(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileMC() {
  const [mobile, setMobile] = useStateMC(() => window.matchMedia("(max-width:768px)").matches);
  useEffectMC(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function MembershipApp() {
  const Screen = MC_SCREENS[MC_PAGE] || MembershipHub;
  const mobile = useIsMobileMC();
  const scale = useDeviceScaleMC();
  const vars = {
    "--action-primary": MC_NAVY,
    "--action-primary-hover": "#081120"
  };
  if (MC_WEB) {
    const {
      TopNav
    } = DSMC;
    const navigate = label => {
      const u = {
        Home: "NewsfeedWeb.html",
        Profile: "Profile.html",
        "My Learning": "MyLearning.html",
        Community: "Community.html",
        Agent: "Agent.html",
        Rewards: "RewardsWeb.html"
      }[label];
      if (u) goMC(u);
    };
    useEffectMC(() => {
      document.querySelectorAll("#pf-root nav > button").forEach(b => {
        if (b.textContent.trim() === "My Learning") b.setAttribute("data-pf-active", "1");
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "app mc-web",
      style: vars
    }, /*#__PURE__*/React.createElement(TopNav, {
      active: "My Learning",
      user: MC_ME,
      logoSrc: "assets/profinity-icon-purple-gold.png",
      onNavigate: navigate,
      style: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-default)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "mc-web-page"
    }, /*#__PURE__*/React.createElement(Screen, null)));
  }
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "#F6F3EF"
    }
  }, /*#__PURE__*/React.createElement(Screen, null));
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
  }, /*#__PURE__*/React.createElement(Screen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MembershipApp, null));
