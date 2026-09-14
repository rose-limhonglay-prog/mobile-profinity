/* ===========================================================================
   PROfinity — Profile (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -PM to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStatePM,
  useEffect: useEffectPM
} = React;
const DSPM = window.ProfinityDesignSystem_c2b5cc;
function goPM(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* Standalone badge image with a hover/tap tooltip explaining what it means
   (mastery + skinfluencer badges aren't part of DSPM.VerificationSeals). */
function PMSealBadge({
  src,
  alt,
  label,
  width,
  height,
  style
}) {
  const [hover, setHover] = useStatePM(false);
  const [pinned, setPinned] = useStatePM(false);
  useEffectPM(() => {
    if (!pinned) return;
    const close = () => {
      setPinned(false);
      setHover(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [pinned]);
  const open = hover || pinned;
  return /*#__PURE__*/React.createElement("span", {
    className: "pm-seal-badge" + (open ? " is-open" : ""),
    tabIndex: 0,
    role: "button",
    "aria-label": label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: e => {
      e.stopPropagation();
      setPinned(p => !p);
    },
    onKeyDown: e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setPinned(p => !p);
      }
    },
    style: style
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    width: width,
    height: height,
    style: {
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-seal-tip"
  }, label));
}

/* Same "pf-subscription-tier" key the newsfeed/community/membership pages
   read and write — this file doesn't load app.jsx, so it keeps its own tiny
   copy rather than depending on window.PFApp. */
const PF_TIER_KEY_PM = "pf-subscription-tier";
function getUserTierPM() {
  try {
    return localStorage.getItem(PF_TIER_KEY_PM) || "free";
  } catch (e) {
    return "free";
  }
}

/* Shared with admin-verification.jsx — the only bridge between "user
   submits credentials" and "admin approves them" in this localStorage-only
   demo, since the two run in separate page loads with no real backend. */
const PF_CRED_KEY_PM = "pf-credential-verification";
function getCredVerificationPM() {
  try {
    return JSON.parse(localStorage.getItem(PF_CRED_KEY_PM));
  } catch (e) {
    return null;
  }
}
function setCredVerificationPM(record) {
  try {
    localStorage.setItem(PF_CRED_KEY_PM, JSON.stringify(record));
  } catch (e) {}
}

/* ===========================================================================
   The Prosperity Spiral + Today's Targets — moved here from LearningMobile
   (Aug 2026 prototype pass, Profile placement not yet signed off by Tim).
   Framework: the Prosperity Spiral, exactly four pillars — Sales · Marketing ·
   Clinical Skills · Business Systems.
   =========================================================================== */
const PM_PILLARS = [{
  key: "Sales",
  short: "SALE",
  icon: "fluent-emoji-flat:money-bag"
}, {
  key: "Marketing",
  short: "MKT",
  icon: "fluent-emoji-flat:megaphone"
}, {
  key: "Clinical Skills",
  short: "CLIN",
  icon: "fluent-emoji-flat:syringe"
}, {
  key: "Business Systems",
  short: "SYS",
  icon: "fluent-emoji-flat:gear"
}];

/* Score bands. The four pillars are meant to land in different bands so one
   is visibly the pillar to lift; every band's `text` is ≥4.5:1 on its `soft`
   tint and on white. `color` is the bar / dial fill. */
const PM_BANDS = [{
  key: "expert",
  label: "Expert",
  min: 80,
  color: "#2A9568",
  text: "#1E7A5C",
  soft: "#EAF6F0"
}, {
  key: "improving",
  label: "Growing strong",
  min: 60,
  color: "#CE9957",
  text: "#8A5303",
  soft: "#FCF4E4"
}, {
  key: "practice",
  label: "Building momentum",
  min: 40,
  color: "#E7820A",
  text: "#9A4B00",
  soft: "#FDEEDD"
}, {
  key: "study",
  label: "Just getting started",
  min: 0,
  color: "#C8362F",
  text: "#A8231D",
  soft: "#FCE8E6"
}];
function pmBand(score) {
  return PM_BANDS.find(b => score >= b.min) || PM_BANDS[PM_BANDS.length - 1];
}

/* Tapping any pillar (Spiral row, target row, Goal Focus CTA) opens that
   pillar's goal page. */
function pmGoalUrl(pillarKey) {
  return "LearningMobile.html?goal=" + encodeURIComponent(pillarKey);
}

/* Today's Targets — one live task per pillar, drawn in order from that
   pillar's pool. Priority follows the pillar's rank in the Spiral (weakest =
   high), so the day always leads with the pillar to lift. */
const PM_TARGET_POOL = {
  "Sales": ["Follow up with 3 lapsed patients", "Rehearse your consultation close with Ava", "Send the 2 treatment-plan quotes you've left open", "Call back every enquiry from the last 48 hours"],
  "Marketing": ["Post 2 before/after case studies", "Reply to every comment on your last post", "Draft next week's Instagram story sequence", "Ask 1 happy patient for a Google review"],
  "Clinical Skills": ["Complete Lesson 4: Lip Anatomy", "Review the toxin complications checklist", "Watch: mid-face volumising (12 min)", "Photograph today's cases with the 5-angle protocol"],
  "Business Systems": ["Log this week's expenses in your tracker", "Update your price list for Q4", "Book 15 minutes to review your booking flow", "Reconcile last week's card takings"]
};
const PM_PRIORITY = {
  high: {
    label: "High priority",
    pts: 150,
    icon: "lucide:chevrons-up",
    color: "#C8362F"
  },
  medium: {
    label: "Medium priority",
    pts: 100,
    icon: "lucide:chevron-up",
    color: "#CE9957"
  },
  low: {
    label: "Low priority",
    pts: 50,
    icon: "lucide:minus",
    color: "#8B8FA3"
  }
};
const PM_PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2
};
const PM_TARGETS_KEY = "pf-today-targets";
function pmTodayStamp() {
  return new Date().toISOString().slice(0, 10);
}

/* ===========================================================================
   Self-Assessment scoring engine (PRD: Prosperity Spiral & Self-Assessment
   Experience Updates, Aug 2026). Pillar Score = min(100, Seval*0.6 + Scourse):
   Seval is the self-assessment's raw score (0-100%, capped at 60% weight),
   Scourse is course-completion progress, which alone can carry a pillar to
   100% regardless of assessment performance.
   =========================================================================== */

/* Course-completion baseline (Scourse) per pillar — "how far courses alone
   have carried this pillar". Deliberately staggered so that, with a typical
   mid-range assessment (+30), the four pillars land one per band:
   Sales ~38 (study) · Systems ~52 (practice) · Marketing ~68 (improving) ·
   Clinical ~85 (expert). */
const PM_SCOURSE = {
  "Sales": 8,
  "Marketing": 38,
  "Clinical Skills": 55,
  "Business Systems": 22
};
const PM_ASSESS_KEY = "pf-self-assessment";
function pmLoadAssessState() {
  try {
    return JSON.parse(localStorage.getItem(PM_ASSESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function pmSaveAssessState(state) {
  try {
    localStorage.setItem(PM_ASSESS_KEY, JSON.stringify(state));
  } catch (e) {}
}
function pmPillarScore(pillarKey, assessState) {
  const scourse = PM_SCOURSE[pillarKey] || 0;
  const entry = assessState[pillarKey];
  const seval = entry && entry.status === "completed" ? entry.rawPoints / 28 * 100 : 0;
  return Math.min(100, Math.round(seval * 0.6 + scourse));
}

/* "Track your goals" is gated behind the 4 scored pillar assessments (not
   Dream & Vision, which never touches a pillar score) — the forecast has
   nothing to show until every pillar has a real baseline. */
const PM_FORECAST_PILLARS = PM_PILLARS.map(p => p.key);
function pmForecastDone(assessState) {
  return PM_FORECAST_PILLARS.filter(k => assessState[k] && assessState[k].status === "completed").length;
}

/* Pillars scored and ranked weakest → strongest (tie-break order below is
   the Goal Focus rule from PRD 3.3). */
const PM_GOAL_TIEBREAK = ["Clinical Skills", "Business Systems", "Sales", "Marketing"];
function pmRankedPillars(assessState) {
  return PM_PILLARS.map(p => ({
    ...p,
    score: pmPillarScore(p.key, assessState)
  })).sort((a, b) => a.score - b.score || PM_GOAL_TIEBREAK.indexOf(a.key) - PM_GOAL_TIEBREAK.indexOf(b.key)).map(p => ({
    ...p,
    band: pmBand(p.score)
  }));
}
function pmLowestPillar(assessState) {
  return pmRankedPillars(assessState)[0].key;
}
const PM_GOAL_REASONING = {
  "Sales": "Your consultations and follow-up are the fastest lever right now — tightening how you convert the patients already reaching out will move this pillar quickest.",
  "Marketing": "You need visibility. Better, more consistent lead generation is the fastest way to fill your books.",
  "Clinical Skills": "Sharpening your clinical technique and confidence unlocks higher-value treatments and safer, more advanced procedures.",
  "Business Systems": "Tightening your operations, pricing and financial tracking is what turns bookings into a sustainable, scalable business."
};

/* Esc closes any role="dialog" overlay (wizard, hub, help sheets) — `active`
   lets a component call this unconditionally (Rules of Hooks) while only
   listening once it's actually showing. */
function usePMEscClose(active, onClose) {
  useEffectPM(() => {
    if (!active) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

/* Overlays rendered from inside the "Track your goals" slider need to escape
   it: .pm-goals-slider is transformed (translateX), so it becomes the
   containing block for position:absolute children and its overflow:hidden
   viewport clips them. Portal to the screen root (same host pattern as the
   share sheet in app.jsx). */
function pmScreenPortal(node) {
  const host = typeof document !== "undefined" && document.querySelector(".pm-screen");
  return host ? ReactDOM.createPortal(node, host) : node;
}

/* Shared ⓘ explainer sheet — title, an icon, body copy and an optional
   "Ask Ava" hand-off. role=dialog + aria-modal + Esc via usePMEscClose. */
function PMInfoModal({
  open,
  onClose,
  title,
  icon,
  children,
  coach,
  coachLabel
}) {
  usePMEscClose(open, onClose);
  if (!open) return null;
  return pmScreenPortal(/*#__PURE__*/React.createElement("div", {
    className: "pm-help-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-help-card",
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-help-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-help-icon"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: icon || "lucide:info",
    size: 18,
    color: "var(--ai-purple)"
  })), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-help-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-help-body"
  }, children, coach && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-coach-link pm-help-coach",
    "data-coach": coach,
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:sparkles",
    size: 14,
    color: "var(--ai-purple)"
  }), coachLabel || "Ask Ava")))));
}

/* Card shell for the three pane cards: bordered card, a collapse toggle
   pinned to the top-right corner, and an ⓘ button 12px after the title. */
function PMPaneCard({
  id,
  title,
  sub,
  infoLabel,
  onInfo,
  className,
  children,
  defaultOpen = true,
  stacked = false
}) {
  const [open, setOpen] = useStatePM(defaultOpen);
  const bodyId = React.useId ? React.useId() : undefined;
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    className: "pm-sec pm-card pm-pane-card" + (open ? "" : " is-collapsed") + (stacked ? " pm-pane-card--stacked" : "") + (className ? " " + className : ""),
    "data-screen-label": title
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-pane-hd"
  }, /*#__PURE__*/React.createElement("h2", null, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-pane-info",
    "aria-label": infoLabel || "About " + title,
    onClick: onInfo
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:info",
    size: 17,
    color: "var(--gray-500)"
  }))), sub && open && /*#__PURE__*/React.createElement("p", {
    className: "pm-pane-sub"
  }, sub), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-pane-toggle",
    "aria-expanded": open,
    "aria-controls": bodyId,
    "aria-label": (open ? "Collapse " : "Expand ") + title,
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-up",
    size: 20,
    color: "var(--gray-500)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "pm-pane-body",
    id: bodyId
  }, children));
}

/* "Let's work on your goal" — a band-coloured conic dial with the percentage
   inside, naming the weakest pillar. */
function PMGoalFocusCard({
  assessState
}) {
  const [info, setInfo] = useStatePM(false);
  const weakest = pmRankedPillars(assessState)[0];
  const band = weakest.band;
  return /*#__PURE__*/React.createElement(PMPaneCard, {
    title: "Let's work on your goal",
    infoLabel: "How your goal is chosen",
    onInfo: () => setInfo(true),
    className: "pm-goal-card",
    defaultOpen: false
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-goal-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-goal-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: band.text
    }
  }, band.label), /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, weakest.key), /*#__PURE__*/React.createElement("p", {
    className: "note"
  }, "Your weakest pillar right now — Ava recommends starting here.")), /*#__PURE__*/React.createElement("div", {
    className: "pm-goal-ring",
    style: {
      "--pct": weakest.score,
      "--band": band.color,
      "--band-text": band.text
    },
    role: "img",
    "aria-label": weakest.key + " " + weakest.score + " percent — " + band.label
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, weakest.score, "%"))), /*#__PURE__*/React.createElement("p", {
    className: "pm-goal-reasoning"
  }, PM_GOAL_REASONING[weakest.key]), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-goal-cta",
    onClick: () => goPM(pmGoalUrl(weakest.key))
  }, "Work on ", weakest.key, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 17,
    color: "#fff"
  })), /*#__PURE__*/React.createElement(PMInfoModal, {
    open: info,
    onClose: () => setInfo(false),
    title: "How your goal is chosen",
    icon: "lucide:trophy",
    coach: "Why is " + weakest.key + " my goal focus right now, and what should I do first?",
    coachLabel: "Ask Ava about this goal"
  }, /*#__PURE__*/React.createElement("p", null, "Your goal is always your ", /*#__PURE__*/React.createElement("b", null, "lowest-scoring pillar"), ". Each pillar's score is your ", /*#__PURE__*/React.createElement("b", null, "Get to know you"), " baseline (worth up to 60%) plus the course progress you've made in that area."), /*#__PURE__*/React.createElement("p", null, "The dial's colour is its band: ", /*#__PURE__*/React.createElement("b", null, "Expert"), ", ", /*#__PURE__*/React.createElement("b", null, "Growing strong"), ", ", /*#__PURE__*/React.createElement("b", null, "Building momentum"), " or ", /*#__PURE__*/React.createElement("b", null, "Just getting started"), ". When this pillar overtakes another, your goal switches automatically.")));
}

/* The Prosperity Spiral — a 2×2 grid of pillar tiles ordered weakest →
   strongest: a band-coloured ring with the score inside, the pillar name, a
   band chip (the weakest reads "Start here") and the gap to the community
   average. The sub-line sits under the title, with the ⓘ and collapse
   controls side by side on the right. */
const PM_PILLAR_AVERAGE = 56; // community average per pillar (mock)
const PM_BAND_CHIP = {
  expert: "Strong",
  improving: "Growing",
  practice: "Building",
  study: "Starting out"
};
function PMSpiralCard({
  assessState
}) {
  const [info, setInfo] = useStatePM(false);
  const [tim, setTim] = useStatePM(false);
  const ranked = pmRankedPillars(assessState);
  const weakest = ranked[0];
  return /*#__PURE__*/React.createElement(PMPaneCard, {
    id: "prosperity-spiral",
    title: "The Prosperity Spiral",
    stacked: true,
    sub: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, weakest.key), " is carrying the least weight. Lift it and the whole spiral rises."),
    infoLabel: "How the Prosperity Spiral works",
    onInfo: () => setInfo(true),
    defaultOpen: window.location.hash === "#prosperity-spiral"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-spiral-grid"
  }, ranked.map(p => {
    const lowest = p.key === weakest.key;
    const diff = p.score - PM_PILLAR_AVERAGE;
    const chip = lowest ? "Start here" : PM_BAND_CHIP[p.band.key];
    return /*#__PURE__*/React.createElement("button", {
      key: p.key,
      type: "button",
      className: "pm-spiral-tile" + (lowest ? " lowest" : ""),
      style: {
        "--band": p.band.color,
        "--band-soft": p.band.soft,
        "--band-text": p.band.text
      },
      "aria-label": p.key + " " + p.score + " — " + chip + ", " + (diff >= 0 ? "+" : "") + diff + " versus average",
      onClick: () => goPM(pmGoalUrl(p.key))
    }, /*#__PURE__*/React.createElement("span", {
      className: "pm-spiral-ring",
      style: {
        "--pct": p.score
      },
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "n"
    }, p.score)), /*#__PURE__*/React.createElement("span", {
      className: "pm-spiral-tile-name"
    }, p.key), /*#__PURE__*/React.createElement("span", {
      className: "pm-spiral-tile-chip" + (lowest ? " start" : "")
    }, chip), /*#__PURE__*/React.createElement("span", {
      className: "pm-spiral-tile-avg"
    }, diff >= 0 ? "+" : "−", Math.abs(diff), " vs average"));
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-spiral-tim",
    onClick: () => setTim(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-spiral-tim-av"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar-drtim.png",
    alt: "",
    width: 44,
    height: 44
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-spiral-tim-play",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:play",
    size: 11,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "pm-spiral-tim-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, "Dr Tim on the Spiral"), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, "2 min · why balance beats brilliance in one pillar")), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement(PMInfoModal, {
    open: info,
    onClose: () => setInfo(false),
    title: "How the Prosperity Spiral works",
    icon: "lucide:sparkles",
    coach: "Explain how my Spiral Score is calculated and what I can do this week to raise it.",
    coachLabel: "Ask Ava to explain mine"
  }, /*#__PURE__*/React.createElement("p", null, "Your Spiral is a snapshot of how balanced your business is across the four areas every successful clinic needs: ", /*#__PURE__*/React.createElement("b", null, "Sales"), ", ", /*#__PURE__*/React.createElement("b", null, "Marketing"), ", ", /*#__PURE__*/React.createElement("b", null, "Clinical Skills"), " and ", /*#__PURE__*/React.createElement("b", null, "Business Systems"), "."), /*#__PURE__*/React.createElement("p", null, "Each ring is coloured by its band — green ", /*#__PURE__*/React.createElement("b", null, "Strong"), ", gold ", /*#__PURE__*/React.createElement("b", null, "Growing"), ", orange ", /*#__PURE__*/React.createElement("b", null, "Building"), ", red ", /*#__PURE__*/React.createElement("b", null, "Starting out"), " — and “vs average” compares you with other PROfinity clinics. A pillar climbs when you act on it: finishing a lesson, completing a target, posting a case study, following up with a patient."), /*#__PURE__*/React.createElement("p", null, "A weak pillar isn't a bad grade — it's where Ava recommends you start, because the fastest way to grow a clinic is usually to lift its lowest pillar first.")), /*#__PURE__*/React.createElement(PMInfoModal, {
    open: tim,
    onClose: () => setTim(false),
    title: "Why balance beats brilliance",
    icon: "lucide:play"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-tim-poster",
    role: "img",
    "aria-label": "Dr Tim Pearce — 2 minute explainer"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar-drtim.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-tim-poster-play"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:play",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-tim-poster-dur"
  }, "2:04")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Dr Tim Pearce"), " · “A clinic that's brilliant at one thing and average at the other three grows slowly. Every patient you win in Marketing leaks out through weak Sales follow-up; every great result you deliver goes unseen without Systems to capture it.”"), /*#__PURE__*/React.createElement("p", null, "“That's why the Spiral rewards balance. Lift your lowest pillar and the other three suddenly work harder for you — that's the spiral effect.”")));
}

/* Builds the day's set: one task per pillar, weakest first, priority by rank
   (high / medium / low / low), plus any Ava-suggested extras from the coach. */
function pmBuildTargets(ranked, rounds, extras) {
  const prio = ["high", "medium", "low", "low"];
  const list = ranked.map((p, i) => {
    const pool = PM_TARGET_POOL[p.key];
    const idx = (rounds[p.key] || 0) % pool.length;
    return {
      id: p.key + ":" + idx,
      text: pool[idx],
      pillar: p.key,
      priority: prio[i] || "low",
      done: false
    };
  });
  (extras || []).forEach((t, i) => list.push({
    id: "ava:" + i,
    text: t.text,
    pillar: null,
    priority: "low",
    done: false
  }));
  return list;
}

/* Today's saved set, or a fresh one for a new day. Shared by the Targets
   card and the collapsed "Track your goals" preview so both read the same
   list. */
function pmLoadTodayTargets(ranked) {
  let extras = [];
  try {
    extras = (JSON.parse(localStorage.getItem("pf-coach-targets")) || []).map(t => ({
      text: t.text
    }));
  } catch (e) {}
  try {
    const saved = JSON.parse(localStorage.getItem(PM_TARGETS_KEY));
    if (saved && saved.date === pmTodayStamp() && Array.isArray(saved.targets)) return saved;
  } catch (e) {}
  return {
    date: pmTodayStamp(),
    rounds: {},
    targets: pmBuildTargets(ranked, {}, extras)
  };
}
function PMTargetsCard({
  assessState
}) {
  const [info, setInfo] = useStatePM(false);
  const ranked = pmRankedPillars(assessState);
  const weakest = ranked[0];

  /* Persisted per day: tick state, per-pillar pool cursors and any task that
     arrived after the set was finished. A new date starts a fresh set. */
  const [state, setState] = useStatePM(() => pmLoadTodayTargets(ranked));
  useEffectPM(() => {
    try {
      localStorage.setItem(PM_TARGETS_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);
  const [fresh, setFresh] = useStatePM(null); // id of the row animating in
  const [settling, setSettling] = useStatePM(null); // id of the row just ticked

  /* Ticking a target pays its priority points once: booked straight into the
     loyalty engine (so Rewards' ledger, lifetime total and beaker move) and
     announced on pf:points-earned so the header pill pops. `awarded` on the
     target stops an untick → re-tick paying twice. */
  function awardTargetPoints(t) {
    const pts = PM_PRIORITY[t.priority].pts;
    const label = "Today's target: " + t.text;
    const engine = window.PFLoyalty;
    let booked = false;
    if (engine && engine.awardPoints) {
      try {
        engine.awardPoints(pts, label, "evt_daily_target");
        booked = true;
      } catch (e) {}
    }
    try {
      window.dispatchEvent(new CustomEvent("pf:points-earned", {
        detail: {
          amount: pts,
          label,
          actionId: "evt_daily_target",
          booked
        }
      }));
    } catch (e) {}
  }
  function toggle(id) {
    const cur = state.targets.find(t => t.id === id);
    const paying = !!(cur && !cur.done && !cur.awarded);
    if (paying) awardTargetPoints(cur);
    setState(s => {
      const targets = s.targets.map(t => t.id === id ? {
        ...t,
        done: !t.done,
        awarded: t.awarded || paying
      } : t);
      const justDone = targets.find(t => t.id === id).done;
      if (!justDone || !targets.every(t => t.done)) return {
        ...s,
        targets
      };
      /* Day's set finished — surface the next task from the weakest pillar.
         It arrives as a fresh high-priority row; completed ones stay put. */
      const rounds = {
        ...s.rounds,
        [weakest.key]: (s.rounds[weakest.key] || 0) + 1
      };
      const pool = PM_TARGET_POOL[weakest.key];
      const idx = rounds[weakest.key] % pool.length;
      const next = {
        id: weakest.key + ":" + idx + ":" + Date.now(),
        text: pool[idx],
        pillar: weakest.key,
        priority: "high",
        done: false,
        added: true
      };
      setFresh(next.id);
      return {
        ...s,
        rounds,
        targets: targets.concat(next)
      };
    });
    setSettling(id);
  }
  useEffectPM(() => {
    if (!fresh && !settling) return;
    const t = setTimeout(() => {
      setFresh(null);
      setSettling(null);
    }, 700);
    return () => clearTimeout(t);
  }, [fresh, settling]);

  /* Render order: high → low priority (stable within a priority), so the
     weakest pillar's work always leads. Done rows keep their slot. */
  const rows = state.targets.map((t, i) => ({
    ...t,
    i
  })).sort((a, b) => PM_PRIORITY_ORDER[a.priority] - PM_PRIORITY_ORDER[b.priority] || a.i - b.i);
  const doneCount = rows.filter(t => t.done).length;
  return /*#__PURE__*/React.createElement(PMPaneCard, {
    title: "Today's Targets",
    sub: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "pm-target-date"
    }, new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long"
    })), "Completing these will move your Prosperity Spiral forward"),
    infoLabel: "How targets and points work",
    onInfo: () => setInfo(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-target-rows"
  }, rows.map(t => {
    const pr = PM_PRIORITY[t.priority];
    const caption = (t.pillar || "Suggested by Ava") + " · " + pr.label;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      className: "pm-target-row" + (t.done ? " done" : "") + (fresh === t.id ? " is-entering" : "") + (settling === t.id && t.done ? " is-settling" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "pm-target-check",
      role: "checkbox",
      tabIndex: 0,
      "aria-checked": t.done,
      "aria-label": (t.done ? "Mark not done: " : "Mark done: ") + t.text,
      onClick: () => toggle(t.id),
      onKeyDown: e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(t.id);
        }
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "circle"
    }, t.done && /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:check",
      size: 13,
      color: "#fff"
    }))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-target-main",
      "aria-label": t.text + ". " + caption + ". Opens " + (t.pillar || "your") + " goal page",
      onClick: () => goPM(t.pillar ? pmGoalUrl(t.pillar) : "LearningMobile.html")
    }, /*#__PURE__*/React.createElement("span", {
      className: "pm-target-prio",
      style: {
        color: pr.color
      },
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: pr.icon,
      size: 18,
      color: pr.color
    })), /*#__PURE__*/React.createElement("span", {
      className: "pm-target-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tx"
    }, t.text), /*#__PURE__*/React.createElement("span", {
      className: "cap"
    }, caption)), /*#__PURE__*/React.createElement("span", {
      className: "pm-target-pts" + (t.done ? " earned" : "")
    }, t.done && /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:check",
      size: 11,
      color: "#1E7A5C"
    }), "+", pr.pts, " pts")));
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-target-foot"
  }, doneCount, " of ", rows.length, " done", doneCount === rows.length && rows.length ? " — a new target has been added" : ""), /*#__PURE__*/React.createElement(PMInfoModal, {
    open: info,
    onClose: () => setInfo(false),
    title: "How targets and points work",
    icon: "lucide:list-checks",
    coach: "What should I tackle first from today's targets, and why?",
    coachLabel: "Ask Ava where to start"
  }, /*#__PURE__*/React.createElement("p", null, "Ava picks one small action per pillar each day and orders them by priority — ", /*#__PURE__*/React.createElement("b", null, "red double chevron"), " for your weakest pillar, ", /*#__PURE__*/React.createElement("b", null, "gold single"), " for the next, ", /*#__PURE__*/React.createElement("b", null, "grey dash"), " for the rest."), /*#__PURE__*/React.createElement("p", null, "Ticking a target earns its points (", /*#__PURE__*/React.createElement("b", null, "+150 / +100 / +50"), ") and nudges that pillar's score. Tap the row itself to open the pillar's goal page; the circle is just the tick."), /*#__PURE__*/React.createElement("p", null, "Finish the set and a new target appears — completed ones stay where they are so you can see the day's work.")));
}

/* Gate card shown in place of Goal Focus / Prosperity Spiral / Today's
   Targets until all four scored pillar assessments are done — those three
   have nothing real to show before that, so they don't render at all
   (never as empty or zeroed states). The CTA opens "Get to know you", which
   lives inside ProfileSteps — not a prop we have here — so it's reached by
   dispatching a DOM event ProfileSteps listens for. */
function pmOpenAssessHub() {
  window.dispatchEvent(new CustomEvent("pf-open-assess-hub"));
}
function PMGoalsGateCard({
  doneCount
}) {
  const heading = doneCount === 0 ? "Start with ‘Get to know you’" : `Keep going — ${doneCount} of 4 done`;
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec pm-card pm-goals-gate"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-goals-gate-icon",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:compass",
    size: 26,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h3", null, heading), /*#__PURE__*/React.createElement("p", null, "Your forecast unlocks once all four pillar assessments — Marketing, Sales, Clinical Skills and Business Systems — are complete."), /*#__PURE__*/React.createElement("div", {
    className: "pm-goals-gate-dots",
    "aria-label": doneCount + " of 4 assessments done"
  }, PM_FORECAST_PILLARS.map((k, i) => /*#__PURE__*/React.createElement("span", {
    key: k,
    className: i < doneCount ? "on" : ""
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-goals-gate-cta",
    onClick: pmOpenAssessHub
  }, doneCount === 0 ? "Get to know you" : "Continue ‘Get to know you’", /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 17,
    color: "#fff"
  })));
}

/* "Track your goals" — a collapsed summary card that slides into a pane of
   Goal Focus + the Prosperity Spiral + Today's Targets.

   Layout: the two panes sit in a 200%-wide slider. Whichever pane is showing
   is the in-flow one, so the viewport's height:auto follows it; the other
   goes position:absolute (.is-offstage) and rides off-screen. No measured
   heights — these screens grow after first layout (icon web components
   upgrade, chips wrap, Poppins loads), so any single measurement is stale. */
/* League standing: the member's board in her current gem league
   (window.PFLeague — same data as the Leaderboard page). Falls back to a
   flat field if the engine isn't on the page. */
const PM_LEAGUE_FALLBACK = [{
  name: "Grace Lindqvist",
  points: 4980
}, {
  name: "Hana Kobayashi",
  points: 4400
}, {
  name: "Ravi Chandran",
  points: 3920
}];
function pmLeagueStandings() {
  const engine = window.PFLoyalty;
  let mine = 2100;
  try {
    if (engine && engine.getState) mine = engine.getState().rollingPoints30 || 0;
  } catch (e) {}
  const me = {
    name: PM_ME.name + " (You)",
    avatar: PM_ME.avatar,
    points: mine
  };
  if (window.PFLeague && window.PFLeague.getStandings) return window.PFLeague.getStandings(me);
  const rows = PM_LEAGUE_FALLBACK.map(r => ({
    ...r,
    isMe: false
  })).concat([{
    ...me,
    isMe: true
  }]).sort((a, b) => b.points - a.points).map((r, i) => ({
    ...r,
    rank: i + 1
  }));
  const meIdx = rows.findIndex(r => r.isMe);
  return {
    league: null,
    rows,
    me: rows[meIdx],
    above: rows[meIdx - 1] || null,
    below: rows[meIdx + 1] || null
  };
}
/* small gem Lottie for the league card header */
function PMLeagueGem({
  src,
  size
}) {
  const host = React.useRef(null);
  useEffectPM(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: src
      });
    };
    if (window.lottie) start();else {
      t = setInterval(() => {
        if (window.lottie) {
          clearInterval(t);
          start();
        }
      }, 120);
      setTimeout(() => clearInterval(t), 8000);
    }
    return () => {
      clearInterval(t);
      if (anim) anim.destroy();
    };
  }, [src]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    style: {
      display: "block",
      width: size,
      height: size
    },
    "aria-hidden": "true"
  });
}
/* "Your league" — the member's standing in the rolling 30-day league with the
   clinician one place above and one below, so the gap to close is concrete.
   Same data as the Leaderboard page; "See the full leaderboard" opens it. */
function PMLeagueCard() {
  const [open, setOpen] = useStatePM(true);
  const [standings, setStandings] = useStatePM(() => pmLeagueStandings());
  useEffectPM(() => {
    const sync = () => setStandings(pmLeagueStandings());
    window.addEventListener("pf:points-earned", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pf:points-earned", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const {
    me,
    above,
    below,
    league
  } = standings;
  const fmt = n => n.toLocaleString("en-GB");
  const bodyId = React.useId ? React.useId() : undefined;
  const firstName = above ? above.name.replace(/^Dr\s+/, "").split(" ")[0] : "";
  const gap = above ? above.points - me.points : 0;
  const rows = [above, me, below].filter(Boolean);
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec pm-card pm-league-card" + (open ? "" : " is-collapsed"),
    "data-screen-label": "Your league"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-league-hd",
    style: league ? {
      "--pm-lg-accent": league.accent,
      "--pm-lg-deep": league.deep
    } : null
  }, league && /*#__PURE__*/React.createElement("span", {
    className: "pm-league-gem"
  }, /*#__PURE__*/React.createElement(PMLeagueGem, {
    src: league.lottie,
    size: 46
  })), /*#__PURE__*/React.createElement("h2", null, league ? league.name + " League" : "Your league"), /*#__PURE__*/React.createElement("span", {
    className: "pm-goals-rank pm-league-rank",
    "aria-label": "Ranked number " + me.rank
  }, "#", me.rank), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-league-toggle",
    "aria-expanded": open,
    "aria-controls": bodyId,
    "aria-label": (open ? "Collapse" : "Expand") + " Your league",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-up",
    size: 20,
    color: "var(--text-heading)"
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "pm-league-body",
    id: bodyId
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-league-sub"
  }, above ? /*#__PURE__*/React.createElement(React.Fragment, null, league ? "Your league · last 30 days" : "Last 30 days", " · ", /*#__PURE__*/React.createElement("b", null, fmt(gap), " pts"), " behind ", firstName, " — finish today's targets to close it.") : /*#__PURE__*/React.createElement(React.Fragment, null, league ? "Your league · last 30 days" : "Last 30 days", " · you're leading ", league ? league.name + " League" : "the league", " — finish today's targets to stay there.")), /*#__PURE__*/React.createElement("div", {
    className: "pm-league-rows"
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.rank,
    className: "pm-league-row" + (r.isMe ? " me" : ""),
    "aria-current": r.isMe ? "true" : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "rk"
  }, r.rank), /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: r.isMe ? PM_ME.name : r.name,
    src: r.avatar,
    size: 38,
    style: {
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, r.name), /*#__PURE__*/React.createElement("span", {
    className: "pts"
  }, fmt(r.points))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-league-cta",
    onClick: () => goPM("Leaderboard.html")
  }, "See the full leaderboard", /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: "currentColor"
  }))));
}
function PMGoalsMenu({
  assessState
}) {
  const [expanded, setExpanded] = useStatePM(false);

  /* Deep link from LearningMobile's "See your full Prosperity Spiral" points
     at #prosperity-spiral, which lives inside the collapsed-by-default menu —
     auto-expand so the link actually reveals the Spiral. */
  useEffectPM(() => {
    if (window.location.hash === "#prosperity-spiral") setExpanded(true);
  }, []);
  const doneCount = pmForecastDone(assessState);
  const unlocked = doneCount === PM_FORECAST_PILLARS.length;
  const ranked = unlocked ? pmRankedPillars(assessState) : [];

  /* Collapsed preview: the day's open targets in priority order, first two
     shown, the rest counted. Re-read on every render so ticks made in the
     expanded pane show once the user slides back. */
  const openTargets = unlocked ? pmLoadTodayTargets(ranked).targets.map((t, i) => ({
    ...t,
    i
  })).filter(t => !t.done).sort((a, b) => PM_PRIORITY_ORDER[a.priority] - PM_PRIORITY_ORDER[b.priority] || a.i - b.i) : [];
  const previewTargets = openTargets.slice(0, 2);
  const moreCount = openTargets.length - previewTargets.length;
  function tapCollapsed() {
    setExpanded(true);
    if (!unlocked) pmOpenAssessHub();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-goals-viewport"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-goals-slider" + (expanded ? " expanded" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-goals-pane pm-goals-collapsed" + (expanded ? " is-offstage" : ""),
    "aria-hidden": expanded,
    tabIndex: expanded ? -1 : 0,
    "aria-label": unlocked ? "Track your goals — tap to view" : "Track your goals — assessment required, tap to start",
    onClick: tapCollapsed
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-goals-collapsed-top"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "pm-steps-h pm-goals-title"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:target",
    size: 22,
    color: "var(--brand-gold)"
  }), "Track your goals"), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-sub"
  }, "Goal Focus, Prosperity Spiral & Today's Targets"), /*#__PURE__*/React.createElement("div", {
    className: "pm-goals-preview"
  }, unlocked ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "pm-goals-preview-h"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:list-checks",
    size: 16,
    color: "var(--brand-gold)"
  }), "Today's Targets"), previewTargets.length ? /*#__PURE__*/React.createElement("ul", {
    className: "pm-goals-preview-list"
  }, previewTargets.map(t => /*#__PURE__*/React.createElement("li", {
    key: t.id
  }, t.text))) : /*#__PURE__*/React.createElement("p", {
    className: "pm-goals-preview-empty"
  }, "All done for today — nice work"), moreCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "pm-goals-preview-more"
  }, "+", moreCount, " more")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "pm-goals-preview-h"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:lock",
    size: 16,
    color: "var(--brand-gold)"
  }), "Assessment required"), /*#__PURE__*/React.createElement("p", {
    className: "pm-goals-preview-empty"
  }, "Complete ‘Get to know you’ to unlock your forecast — tap to start")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-goals-pane pm-goals-expanded" + (expanded ? "" : " is-offstage"),
    "aria-hidden": !expanded
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-goals-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-goals-back",
    tabIndex: expanded ? 0 : -1,
    onClick: () => setExpanded(false)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 20,
    color: "var(--text-heading)"
  }), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:target",
    size: 22,
    color: "var(--brand-gold)"
  }), "Track your goals")), unlocked ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PMTargetsCard, {
    assessState: assessState
  }), /*#__PURE__*/React.createElement(PMGoalFocusCard, {
    assessState: assessState
  }), /*#__PURE__*/React.createElement(PMLeagueCard, null), /*#__PURE__*/React.createElement(PMSpiralCard, {
    assessState: assessState
  })) : /*#__PURE__*/React.createElement(PMGoalsGateCard, {
    doneCount: doneCount
  }))));
}
const TIER_DISPLAY_NAME_PM = {
  confidence: "Confidence",
  mastery: "Mastery",
  freedom: "Freedom",
  inner: "Inner Circle"
};
const PM_ME = {
  name: "Katy Wilson",
  role: "Registered Nurse",
  avatar: "assets/avatar-katy.jpg",
  seals: ["gb", "verified", "crown", "gold"],
  title: "Doctor",
  specialty: "Nurse Practitioner",
  bio: "",
  followers: "1,546",
  following: "880",
  posts: "57",
  location: "London, United Kingdom",
  clinic: "Allcare Medical",
  clinicNumber: "+02 309 3928",
  clinicAddress: "Mr. John Smith, 132 My Street, Kingston, New York 12401.",
  yearsExperience: "12",
  instagram: "@katywilson",
  tier: TIER_DISPLAY_NAME_PM[getUserTierPM()] || null
};
const PM_TITLE_OPTIONS = ["Doctor", "Nurse Practitioner", "Registered Nurse", "Aesthetic Practitioner", "Dentist", "Physician Associate"];
const PM_PERSONAL_GOAL_QUESTIONS = ["Why did you choose to become an aesthetic practitioner, and what's the impact you dream of making for your clients?", "What's the one thing in your business that keeps you up at night, and how would solving it change your life?", "Who or what inspires you to keep pushing forward in your business, even on the toughest days?", "If you could wave a magic wand and change one thing about running your practice, what would it be?", "What does success as an aesthetic practitioner look like for you"];

/* Membership ladder — the upgrade banner should point at the next rung up,
   not repeat the tier the viewer already holds. A free viewer (no tier,
   indexOf === -1) points at the first rung rather than reading as "top". */
const SM_TIER_LADDER_PM = ["Confidence", "Mastery", "Freedom", "Inner Circle"];
function smNextTierPM(tier) {
  const i = SM_TIER_LADDER_PM.indexOf(tier);
  if (i === SM_TIER_LADDER_PM.length - 1) return null;
  return SM_TIER_LADDER_PM[i + 1];
}
/* A viewer's paid tier unlocks every rung below it too. Returns the viewer's
   tier first (current, highlighted "YOUR TIER") followed by the rungs it
   includes, lowest last. */
function smIncludedTiersPM(tier) {
  const i = SM_TIER_LADDER_PM.indexOf(tier);
  if (i === -1) return [];
  return SM_TIER_LADDER_PM.slice(0, i + 1).reverse();
}
const PM_SERVICES = [{
  ti: "Botox (Anti-Wrinkle Injections)",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Dermal Fillers",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Lip Enhancement",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Cheek & Jawline Contouring",
  su: "Career Academy: Dr Tim Pearce"
}];
const PM_EXPERIENCE = [{
  ti: "Registered Nurse",
  yrs: "12 years",
  org: "Generations Wellness Center",
  loc: "London, United Kingdom"
}, {
  ti: "Assistant Nurse",
  yrs: "12 years",
  org: "Generations Wellness Center",
  loc: "London, United Kingdom"
}];
const PM_LICENSES = ["The Ultimate Toxin Eye Complications Masterclass", "Anatomy360", "Pro Tox Course", "8D Lips Course", "Botox Foundations"];

/* Education + Language — pulled out of inline markup into data so the
   "Professional Information" menu (below) can render the same rows for
   either the owner's profile or another member's, from props. */
const PM_EDUCATION = [{
  logo: "JH",
  school: "Johns Hopkins University of USA",
  program: "Clinical Foundations of Medicine",
  years: "1990 - 2020"
}];
const PM_LANGUAGES = [{
  flag: "🇬🇧",
  name: "English (UK)",
  level: "Primary"
}, {
  flag: "🇮🇹",
  name: "Italian",
  level: "Secondary"
}];
const PM_ACTIVITY = [{
  name: "Katy Wilson",
  loc: "London, United Kingdom",
  time: "Today",
  avatar: "assets/avatar-katy.jpg",
  title: "Temple Filler Techniques",
  body: "One of the biggest challenges in clinical practice? Paperwork. Since switching to PROfinity, consent forms, treatment records, and post-consult notes are now digital, organized, and secure — saving me time and giving patients a clearer, more confident experience.\n#DigitalHealth #PatientCare #ClinicianTools #PROfinity",
  likes: "1.2K",
  comments: "150",
  shares: "150"
}, {
  name: "James Lee",
  loc: "Sydney, Australia",
  time: "Yesterday",
  avatar: null,
  /* "id" links a post's author to their profile — see PMPost + ProfileMobile's
     "?id=" viewer mode (PM_OTHER_USERS) below. Katy is the profile owner, so
     her own posts don't need a link back to this same page. */
  id: "james-lee",
  title: "Advanced Suturing Techniques",
  body: "In my surgical practice, time is precious. That's why I was thrilled to discover the ease of digital record-keeping with PROfinity. Documentation has never been simpler — everything I need is just a few taps away.\n#Surgery #PatientSafety #MedicalTech #PROfinity",
  likes: "850",
  comments: "200",
  shares: "180"
}, {
  name: "Linda Garcia",
  loc: "Toronto, Canada",
  time: "Last Week",
  avatar: null,
  id: "linda-garcia",
  title: "Emerging Technologies in Dentistry",
  body: "The dental field is evolving rapidly, and so should our approach to documentation. From treatment plans to follow-up notes, everything is handled digitally — less clutter, more focus on patient interactions.\n#DentalCare #TechInDentistry #PROfinity #FutureOfHealthcare",
  likes: "1.5K",
  comments: "120",
  shares: "200"
}];

/* ===========================================================================
   Viewing someone else's profile (ProfileMobile.html?id=<key>) — a lighter,
   read-only take on the same page: shared context + a summarised activity
   feed instead of the owner-only "Complete your profile" / "Track your
   goals" checklists. Keyed by the same ids PMPost links out to. Mock data
   only — a real build would fetch this by id.
   =========================================================================== */
const PM_OTHER_USERS = {
  "james-lee": {
    name: "James Lee",
    role: "Surgical Nurse Practitioner",
    avatar: null,
    seals: ["verified"],
    bio: "Surgical nurse practitioner specialising in advanced suturing and post-operative care. Sharing what I learn, one case at a time.",
    location: "Sydney, Australia",
    clinic: "Sydney Aesthetic Group",
    posts: "34",
    followers: "612",
    following: "205",
    shared: {
      mutualConnections: 8,
      community: "Confidence Path",
      courses: ["8D Lip Design"]
    },
    activity: {
      lastActive: "1h ago",
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted “Advanced Suturing Techniques”",
        time: "Yesterday"
      }, {
        icon: "lucide:message-circle",
        text: "Commented on 3 posts this week",
        time: "2d"
      }, {
        icon: "lucide:thumbs-up",
        text: "Liked your “Temple Filler Techniques” post",
        time: "3d"
      }]
    },
    services: [{
      ti: "Advanced Suturing",
      su: "Career Academy: Dr Tim Pearce"
    }, {
      ti: "Post-Operative Wound Care",
      su: "Career Academy: Dr Tim Pearce"
    }],
    experience: [{
      ti: "Surgical Nurse Practitioner",
      yrs: "9 years",
      org: "Sydney Aesthetic Group",
      loc: "Sydney, Australia"
    }],
    education: [{
      logo: "UoS",
      school: "University of Sydney",
      program: "Bachelor of Nursing",
      years: "2011 - 2015"
    }],
    licenses: ["Advanced Suturing Certification", "Anatomy360"],
    languages: [{
      flag: "🇦🇺",
      name: "English (AU)",
      level: "Primary"
    }]
  },
  "linda-garcia": {
    name: "Linda Garcia",
    role: "Dental Practitioner",
    avatar: null,
    seals: ["verified"],
    bio: "Dentist exploring emerging technologies in digital dentistry and paperless patient care.",
    location: "Toronto, Canada",
    clinic: "Garcia Dental Studio",
    posts: "21",
    followers: "398",
    following: "150",
    shared: {
      mutualConnections: 5,
      community: "Confidence Path",
      courses: []
    },
    activity: {
      lastActive: "5h ago",
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted “Emerging Technologies in Dentistry”",
        time: "Last week"
      }, {
        icon: "lucide:thumbs-up",
        text: "Liked 2 of your posts",
        time: "1w"
      }]
    },
    services: [{
      ti: "Digital Treatment Planning",
      su: "Career Academy: Dr Tim Pearce"
    }],
    experience: [{
      ti: "Dental Practitioner",
      yrs: "7 years",
      org: "Garcia Dental Studio",
      loc: "Toronto, Canada"
    }],
    education: [{
      logo: "UoT",
      school: "University of Toronto",
      program: "Doctor of Dental Surgery",
      years: "2013 - 2017"
    }],
    licenses: ["Botox Foundations"],
    languages: [{
      flag: "🇨🇦",
      name: "English (CA)",
      level: "Primary"
    }, {
      flag: "🇪🇸",
      name: "Spanish",
      level: "Secondary"
    }]
  },
  "dr-tim-pearce": {
    name: "Dr Tim Pearce",
    role: "Founder & Lead Trainer, PROfinity Academy",
    avatar: "assets/avatar-drtim.png",
    seals: ["verified", "crown", "gold"],
    bio: "Founder of PROfinity Academy — training the next generation of aesthetic practitioners in safe, confident injectable technique.",
    location: "London, United Kingdom",
    clinic: "PROfinity Academy",
    posts: "212",
    followers: "18.4K",
    following: "310",
    shared: {
      mutualConnections: 24,
      community: "Confidence Path",
      courses: ["8D Lip Design", "Protox Course", "Temple Filler"]
    },
    activity: {
      lastActive: "Just now",
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted a new Technique Tuesday recap",
        time: "Today"
      }, {
        icon: "lucide:message-circle",
        text: "Commented on your “Temple Filler Techniques” post",
        time: "Today"
      }, {
        icon: "lucide:calendar-check",
        text: "Hosting Technique Tuesday Webinar",
        time: "30 Jun"
      }]
    },
    services: [{
      ti: "Botox (Anti-Wrinkle Injections)",
      su: "Career Academy: Dr Tim Pearce"
    }, {
      ti: "Dermal Fillers",
      su: "Career Academy: Dr Tim Pearce"
    }, {
      ti: "Full-Face Rejuvenation",
      su: "Career Academy: Dr Tim Pearce"
    }],
    experience: [{
      ti: "Founder & Lead Trainer",
      yrs: "15 years",
      org: "PROfinity Academy",
      loc: "London, United Kingdom"
    }, {
      ti: "Consultant Aesthetic Practitioner",
      yrs: "20 years",
      org: "Allcare Medical",
      loc: "London, United Kingdom"
    }],
    education: [{
      logo: "UCL",
      school: "University College London",
      program: "MBBS Medicine",
      years: "1998 - 2004"
    }],
    licenses: ["Anatomy360", "Pro Tox Course", "8D Lips Course", "Botox Foundations", "The Ultimate Toxin Eye Complications Masterclass"],
    languages: [{
      flag: "🇬🇧",
      name: "English (UK)",
      level: "Primary"
    }]
  }
};
const PM_TABS = [{
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
  href: null
}, {
  key: "Agent",
  label: "Ava",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}, {
  key: "Rewards",
  label: "Rewards",
  icon: "lucide:gift",
  href: "RewardsDashboard.html"
}];
const SM_TIER_RESOURCES_PM = {
  Confidence: [{
    label: "Community Chat",
    icon: "lucide:message-circle",
    href: "CommunityMobile.html"
  }, {
    label: "Membership Training",
    icon: "lucide:graduation-cap",
    href: "LearningMobile.html"
  }, {
    label: "Technique Tuesday",
    icon: "lucide:calendar-check",
    href: "EventsMobile.html"
  }, {
    label: "Complications Help",
    icon: "lucide:shield-alert",
    href: "DirectMessage.html"
  }, {
    label: "AI Coach",
    icon: "lucide:sparkles",
    href: "LearningMobile.html"
  }],
  Mastery: [{
    label: "Mastery lounge",
    icon: "lucide:message-circle",
    href: "CommunityMobile.html"
  }, {
    label: "Advanced masterclasses",
    icon: "lucide:graduation-cap",
    href: "LearningMobile.html"
  }, {
    label: "Complication library",
    icon: "lucide:file-text",
    href: "LearningMobile.html"
  }, {
    label: "Live case reviews",
    icon: "lucide:calendar",
    href: "EventsMobile.html"
  }],
  Freedom: [{
    label: "Freedom circle",
    icon: "lucide:message-circle",
    href: "CommunityMobile.html"
  }, {
    label: "Business playbooks",
    icon: "lucide:graduation-cap",
    href: "LearningMobile.html"
  }, {
    label: "1:1 mentor sessions",
    icon: "lucide:calendar",
    href: "EventsMobile.html"
  }],
  "Inner Circle": [{
    label: "Inner Circle roundtable",
    icon: "lucide:message-circle",
    href: "CommunityMobile.html"
  }, {
    label: "Executive mentorship",
    icon: "lucide:calendar",
    href: "EventsMobile.html"
  }, {
    label: "Legacy case archive",
    icon: "lucide:file-text",
    href: "LearningMobile.html"
  }, {
    label: "Founder office hours",
    icon: "lucide:calendar",
    href: "EventsMobile.html"
  }]
};
const SM_COURSES_PM = [{
  label: "Face Anatomy Masterclass",
  pct: 72
}, {
  label: "Lip Filler Techniques",
  pct: 45
}, {
  label: "Advanced Botox Training",
  pct: 20
}];
const SM_EVENTS_PM = [{
  d: "30",
  m: "JUN",
  label: "Technique Tuesday Webinar",
  t: "8:00 PM",
  tag: "NEW"
}, {
  d: "5",
  m: "JUL",
  label: "Confidence Masterclass",
  t: "6:00 PM"
}, {
  d: "12",
  m: "JUL",
  label: "Business Growth Workshop",
  t: "7:00 PM"
}];
const SM_PROFILE_BEFORE_PM = [{
  label: "Edit Profile",
  icon: "lucide:book-open",
  href: "ProfileMobile.html"
}, {
  label: "Account Settings",
  icon: "lucide:graduation-cap",
  href: "AccountSettings.html"
}, {
  label: "Payments",
  icon: "lucide:credit-card",
  href: "PaymentsMobile.html"
}, {
  label: "My Saved",
  icon: "lucide:bookmark",
  href: "MySaved.html"
}, {
  label: "Notifications",
  icon: "lucide:calendar",
  href: "NotificationSettings.html"
}, {
  label: "Privacy & Security",
  icon: "lucide:book-open",
  href: null
}];
function useDarkModePM() {
  const [dark, setDark] = useStatePM(() => {
    try {
      return localStorage.getItem('pf-theme') === 'dark';
    } catch (e) {
      return false;
    }
  });
  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('pf-theme', next ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    } catch (e) {}
  }
  return [dark, toggle];
}
function SmDarkSwitchPM({
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "sm-switch" + (on ? " on" : ""),
    onClick: onToggle,
    role: "switch",
    "aria-checked": on,
    "aria-label": on ? "Switch to light mode" : "Switch to dark mode"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-knob"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: on ? "lucide:moon" : "lucide:sun",
    size: 13,
    color: on ? "#1A1736" : "var(--gray-450)"
  })));
}
function SmDisplayCardPM({
  dark,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-display-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-display-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-display-label"
  }, "Display"), /*#__PURE__*/React.createElement(SmDarkSwitchPM, {
    on: dark,
    onToggle: onToggle
  })), /*#__PURE__*/React.createElement("p", {
    className: "sm-display-desc"
  }, "Adjust the appearance of the app to reduce glare and give your eyes a break"));
}
function SmSectionPM({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, title);
}
function SmTierResourceRowPM({
  r
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "smt-resource",
    onClick: () => r.href && goPM(r.href)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: r.icon,
    size: 20,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "smt-resource-label"
  }, r.label), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  }));
}
function SmTierCardPM({
  tierName,
  isOwn
}) {
  const resources = SM_TIER_RESOURCES_PM[tierName] || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "smt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "smt-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "smt-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "smt-name"
  }, tierName, " Path"), !isOwn && /*#__PURE__*/React.createElement("span", {
    className: "smt-pill"
  }, "INCLUDED"))), /*#__PURE__*/React.createElement("div", {
    className: "smt-resources"
  }, resources.map(r => /*#__PURE__*/React.createElement(SmTierResourceRowPM, {
    key: r.label,
    r: r
  }))));
}
function SideMenuPM({
  open,
  onClose
}) {
  const [dark, toggleDark] = useDarkModePM();
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-profile",
    onClick: () => goPM("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: PM_ME.name,
    src: PM_ME.avatar,
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-dp-name"
  }, PM_ME.name, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:badge-check",
    size: 18,
    color: "var(--reaction-like)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-role"
  }, PM_ME.role)), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-800)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-body"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sm-upgrade",
    onClick: () => goPM("MembershipTier.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-icon"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:gem",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-title"
  }, smNextTierPM(PM_ME.tier) ? "Upgrade to " + smNextTierPM(PM_ME.tier) : "You're at the top tier"), /*#__PURE__*/React.createElement("span", {
    className: "sm-upgrade-sub"
  }, "Unlock premium channels & courses")), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "My Membership"
  }), PM_ME.tier ? /*#__PURE__*/React.createElement("div", {
    className: "smt-list"
  }, smIncludedTiersPM(PM_ME.tier).map((t, i) => /*#__PURE__*/React.createElement(SmTierCardPM, {
    key: t,
    tierName: t,
    isOwn: i === 0
  }))) : /*#__PURE__*/React.createElement("button", {
    className: "sm-tier",
    onClick: () => goPM("CommunityMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-name"
  }, "No active plan"), /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-pill"
  }, "FREE")), /*#__PURE__*/React.createElement("span", {
    className: "sm-tier-sub"
  }, "Subscribe to unlock a channel")), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "My Courses"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-courses"
  }, SM_COURSES_PM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-course",
    onClick: () => goPM("LearningMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-course-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-course-thumb"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:image",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-course-name"
  }, c.label)), /*#__PURE__*/React.createElement("span", {
    className: "sm-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-progress-fill",
    style: {
      width: c.pct + "%"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-course-pct"
  }, c.pct, "% complete")))), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "Upcoming Events"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-events"
  }, SM_EVENTS_PM.slice(0, 2).map(e => /*#__PURE__*/React.createElement("button", {
    key: e.label,
    className: "sm-event",
    onClick: () => goPM("EventsMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-date"
  }, /*#__PURE__*/React.createElement("b", null, e.d), /*#__PURE__*/React.createElement("i", null, e.m)), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-event-name"
  }, e.label), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-time"
  }, e.t)), e.tag && /*#__PURE__*/React.createElement("span", {
    className: "sm-event-tag"
  }, e.tag)))), /*#__PURE__*/React.createElement(SmSectionPM, {
    title: "My Profile"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-row sm-verify",
    onClick: () => goPM("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:book-open",
    size: 23,
    color: "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, "Verify Profile"), /*#__PURE__*/React.createElement("span", {
    className: "sm-verify-pill"
  }, "Not Verified")), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE_BEFORE_PM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => c.href && goPM(c.href)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement(SmDisplayCardPM, {
    dark: dark,
    onToggle: toggleDark
  }), /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-logout",
    onClick: () => goPM("AuthMobile.html?view=signin")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:log-out",
    size: 22,
    color: "var(--error)"
  }), "Logout"))));
}
function PMTopBar({
  onMenu,
  onMessages
}) {
  /* Shared header points pill from mobilechrome.jsx (lifetime points, taps
     through to Rewards). Resolved at render so script order doesn't matter. */
  const PointsPill = window.PFPointsPillC;
  return /*#__PURE__*/React.createElement("header", {
    className: "pm-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-burger",
    "aria-label": "Menu",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:menu",
    size: 24,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), PointsPill && /*#__PURE__*/React.createElement(PointsPill, null), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
    name: "search",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:bell",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Messages",
    onClick: () => onMessages && onMessages()
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")));
}
const DM_THREADS_SEED_PM = [{
  id: "tim",
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  online: true,
  unread: 2,
  messages: [{
    me: false,
    text: "Hey Katy! I saw your post about the full-face rejuvenation case.",
    t: "10:12 AM"
  }, {
    me: true,
    text: "Thank you! It was a great result, patient was thrilled.",
    t: "10:20 AM"
  }, {
    me: false,
    text: "Do you mind if I share it with my team as a reference?",
    t: "10:25 AM"
  }, {
    me: true,
    text: "Of course, go ahead — sharing the write-up now.",
    t: "10:28 AM"
  }, {
    me: false,
    text: "Thanks for sharing the case study. Really helpful!",
    t: "10:30 AM"
  }]
}, {
  id: "sarah",
  name: "Dr Sarah Kim",
  avatar: null,
  online: true,
  unread: 1,
  messages: [{
    me: false,
    text: "Are you free to go over the Q3 protocol updates this week?",
    t: "9:40 AM"
  }, {
    me: true,
    text: "Yes, Thursday afternoon works for me.",
    t: "9:52 AM"
  }, {
    me: false,
    text: "Looking forward to our next meeting!",
    t: "11:00 AM"
  }]
}, {
  id: "emily",
  name: "Dr Emily Tran",
  avatar: null,
  online: false,
  unread: 3,
  messages: [{
    me: false,
    text: "Just finished reviewing the patient satisfaction data.",
    t: "10:50 AM"
  }, {
    me: false,
    text: "There's a trend worth flagging in the 45+ age group.",
    t: "11:05 AM"
  }, {
    me: false,
    text: "I have some additional insights to share.",
    t: "11:15 AM"
  }]
}, {
  id: "james",
  name: "Dr James Brown",
  avatar: null,
  online: false,
  unread: 0,
  muted: true,
  messages: [{
    me: true,
    text: "Sent over the full results deck this morning.",
    t: "11:05 AM"
  }, {
    me: false,
    text: "Can we discuss the implications of the results?",
    t: "11:30 AM"
  }]
}, {
  id: "alex",
  name: "Dr Alex Chen",
  avatar: null,
  online: true,
  unread: 0,
  messages: [{
    me: false,
    text: "The dosing charts you put together are excellent.",
    t: "11:40 AM"
  }, {
    me: false,
    text: "Great work on the data analysis!",
    t: "11:45 AM"
  }]
}, {
  id: "miranda",
  name: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  online: false,
  unread: 0,
  messages: [{
    me: true,
    text: "Sharing the confidence-score writeup with you now.",
    t: "11:50 AM"
  }, {
    me: false,
    text: "Perfect, thank you — this is exactly what I needed.",
    t: "12:00 PM"
  }]
}];
const VOICE_CONFS_SEED_PM = [{
  id: "vc1",
  name: "Clinical Case Review",
  who: "Dr Tim Pearce, Dr Sarah Kim +3",
  t: "Today, 4:00 PM",
  live: true
}, {
  id: "vc2",
  name: "Business Growth Sync",
  who: "Miranda Pearce, Dr Alex Chen",
  t: "Tomorrow, 10:00 AM",
  live: false
}];
const PF_GROUPS_KEY = "pf-dm-groups";
function readDmGroupsPM() {
  try {
    return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function groupDisplayNamePM(members) {
  const names = members.map(m => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}
function createDmGroupPM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = {
    id: "group-" + Date.now(),
    isGroup: true,
    customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNamePM(members),
    members,
    messages: []
  };
  const groups = readDmGroupsPM();
  groups.unshift(group);
  try {
    localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {}
  return group;
}
function GroupAvatarStackPM({
  members,
  size
}) {
  const s = size || 52;
  return /*#__PURE__*/React.createElement("span", {
    className: "mp-group-av",
    style: {
      width: s,
      height: s
    }
  }, members.slice(0, 2).map((m, i) => /*#__PURE__*/React.createElement("span", {
    className: "mp-group-av-item",
    key: m.id || i
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: m.name,
    src: m.avatar,
    size: Math.round(s * 0.68)
  }))));
}
function MessagesRowPM({
  c,
  onOpen
}) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return /*#__PURE__*/React.createElement("button", {
    className: "mp-row",
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av"
  }, c.isGroup ? /*#__PURE__*/React.createElement(GroupAvatarStackPM, {
    members: c.members
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: c.name,
    src: c.avatar,
    size: 52
  }), c.online && /*#__PURE__*/React.createElement("span", {
    className: "dm-online-dot"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "mp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "mp-time"
  }, last ? last.t : "")), /*#__PURE__*/React.createElement("span", {
    className: "mp-row-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-preview"
  }, last ? last.text : c.isGroup ? c.members.length + " members" : ""), c.muted ? /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:bell-off",
    size: 16,
    color: "var(--gray-450)"
  }) : c.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "mp-badge"
  }, c.unread))));
}
function NewConversationScreenPM({
  contacts,
  picked,
  onToggle,
  query,
  onQuery,
  groupName,
  onGroupName,
  onBack,
  onCreate
}) {
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  const count = picked.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-new",
    "data-screen-label": "New Conversation"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nt-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-back",
    "aria-label": "Back to messages",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "20px",
      fontWeight: "700"
    }
  }, "New Conversation")), /*#__PURE__*/React.createElement("div", {
    className: "nt-search mp-search"
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search people",
    "aria-label": "Search people",
    value: query,
    onChange: e => onQuery(e.target.value)
  })), count > 1 && /*#__PURE__*/React.createElement("div", {
    className: "mp-new-namewrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "mp-new-nameinput",
    placeholder: "Name this group (optional)",
    "aria-label": "Group name",
    value: groupName,
    onChange: e => onGroupName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mp-new-list"
  }, filtered.map(c => {
    const on = picked.includes(c.id);
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: "mp-new-row" + (on ? " on" : ""),
      onClick: () => onToggle(c.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mp-av"
    }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
      name: c.name,
      src: c.avatar,
      size: 44
    })), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-name"
    }, c.name), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-check" + (on ? " on" : "")
    }, on && /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:check",
      size: 13,
      color: "#fff"
    })));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mp-new-empty"
  }, "No people found.")), /*#__PURE__*/React.createElement("div", {
    className: "mp-new-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-new-count"
  }, count, " selected"), /*#__PURE__*/React.createElement("button", {
    className: "mp-new-create",
    disabled: count === 0,
    onClick: onCreate
  }, count > 1 ? "Create Group" : "Start Chat")));
}
function VoiceConfRowPM({
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-row mp-vc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av mp-vc-icon"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:phone-call",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-name"
  }, v.name), v.live && /*#__PURE__*/React.createElement("span", {
    className: "mp-vc-live"
  }, "LIVE")), /*#__PURE__*/React.createElement("span", {
    className: "mp-row-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-preview"
  }, v.who)), /*#__PURE__*/React.createElement("span", {
    className: "mp-vc-time"
  }, v.t)));
}
function MessagesPanelPM({
  open,
  onClose
}) {
  const [tab, setTab] = useStatePM("messages");
  const [query, setQuery] = useStatePM("");
  const [screen, setScreen] = useStatePM("list");
  const [groups, setGroups] = useStatePM([]);
  const [picked, setPicked] = useStatePM([]);
  const [ncQuery, setNcQuery] = useStatePM("");
  const [groupName, setGroupName] = useStatePM("");
  useEffectPM(() => {
    if (!open) {
      setQuery("");
      setScreen("list");
      setPicked([]);
      setNcQuery("");
      setGroupName("");
    } else {
      setGroups(readDmGroupsPM());
    }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED_PM];
  const filtered = allThreads.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED_PM.reduce((n, t) => n + (t.unread || 0), 0);
  function openThread(id) {
    goPM("DirectMessage.html?id=" + id + "&from=ProfileMobile.html");
  }
  function togglePick(id) {
    setPicked(all => all.includes(id) ? all.filter(x => x !== id) : [...all, id]);
  }
  function handleCreate() {
    if (picked.length === 0) return;
    if (picked.length === 1) {
      openThread(picked[0]);
      return;
    }
    const members = DM_THREADS_SEED_PM.filter(c => picked.includes(c.id)).map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar
    }));
    const group = createDmGroupPM(members, groupName);
    openThread(group.id);
  }
  if (screen === "new") {
    return /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-wrap" + (open ? " open" : ""),
      "aria-hidden": !open
    }, /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("aside", {
      className: "m-drawer nt-panel mp-panel",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "New Conversation"
    }, /*#__PURE__*/React.createElement(NewConversationScreenPM, {
      contacts: DM_THREADS_SEED_PM,
      picked: picked,
      onToggle: togglePick,
      query: ncQuery,
      onQuery: setNcQuery,
      groupName: groupName,
      onGroupName: setGroupName,
      onBack: () => setScreen("list"),
      onCreate: handleCreate
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer nt-panel mp-panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Messages"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nt-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-back",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "26px",
      fontWeight: "700"
    }
  }, "Messages"), /*#__PURE__*/React.createElement("button", {
    className: "mp-compose",
    "aria-label": "New message",
    onClick: () => setScreen("new")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:square-pen",
    size: 20,
    color: "var(--gray-900)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mp-tabs",
    role: "tablist",
    "aria-label": "Messages or voice conference"
  }, /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": tab === "messages",
    className: "mp-tab" + (tab === "messages" ? " on" : ""),
    onClick: () => setTab("messages")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 16,
    color: tab === "messages" ? "var(--brand-navy)" : "var(--gray-450)"
  }), "Messages", unreadTotal > 0 && /*#__PURE__*/React.createElement("span", {
    className: "mp-tab-badge"
  }, unreadTotal)), /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": tab === "voice",
    className: "mp-tab" + (tab === "voice" ? " on" : ""),
    onClick: () => setTab("voice")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:phone",
    size: 16,
    color: tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"
  }), "Voice Conference", /*#__PURE__*/React.createElement("span", {
    className: "mp-tab-badge"
  }, VOICE_CONFS_SEED_PM.length))), /*#__PURE__*/React.createElement("div", {
    className: "nt-search mp-search"
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search messages",
    "aria-label": "Search messages",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-body mp-body"
  }, tab === "messages" ? filtered.map(c => /*#__PURE__*/React.createElement(MessagesRowPM, {
    key: c.id,
    c: c,
    onOpen: () => openThread(c.id)
  })) : VOICE_CONFS_SEED_PM.map(v => /*#__PURE__*/React.createElement(VoiceConfRowPM, {
    key: v.id,
    v: v
  })))));
}
const PMTabBar = React.forwardRef(function PMTabBar({
  compact
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "pm-tabs" + (compact ? " pm-tabs-compact" : ""),
    "aria-label": "Primary"
  }, PM_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "pm-tab" + (t.key === "Profile" ? " on" : ""),
    "aria-current": t.key === "Profile" ? "page" : undefined,
    onClick: () => t.href && goPM(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: t.icon,
    size: 20,
    color: t.key === "Profile" ? "#fff" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
});

/* Hide-on-scroll header (matches the newsfeed): scroll down → the bar slides
   away; scroll back up a little → it floats transparent over the content with
   frosted chip icons + logo. Returns { hidden, floating }. */
function useHeaderHidePM(scrollRef) {
  const [state, setState] = useStatePM({
    hidden: false,
    floating: false
  });
  useEffectPM(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY;
      setState(prev => {
        let hidden = prev.hidden;
        if (y < 40) hidden = false;else if (delta > 6) hidden = true;else if (delta < -6) hidden = false;
        const floating = y > 40;
        return hidden === prev.hidden && floating === prev.floating ? prev : {
          hidden,
          floating
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
const PM_STEPS_INIT = [{
  ti: "Add a profile photo",
  su: "Priority action",
  state: "priority"
}, {
  ti: "Write your bio",
  su: "Incomplete",
  state: "todo"
}, {
  ti: "Add your location",
  su: "Complete",
  state: "done"
}, {
  ti: "Verify your credentials",
  su: "Incomplete",
  state: "todo"
}, {
  ti: "Connect your social profiles",
  su: "Incomplete",
  state: "todo"
}];

/* ===========================================================================
   "Get to know you" — self-assessment hub (renamed from "Self-Assessment"
   per Tim's request). Five assessments: the 4 scored Prosperity Spiral
   pillars (content ported from the Facial Aesthetic Practice Diagnostic &
   Clinical Maturity Assessment) plus a 5th, non-scored "Dream & Vision"
   assessment (content ported from the Aesthetic Clinician Dream & Vision
   Assessment V2) that exists purely to help build the clinician's vision —
   it never touches a pillar score.
   =========================================================================== */

const PM_ARCHETYPE_LETTERS = ["A", "B", "C", "D"];

/* ---- Pillar assessments (scored) — 7 questions each, A-D = 1-4 pts, max 28 ---- */
const PM_PILLAR_ASSESSMENTS = {
  "Marketing": {
    label: "Marketing",
    timeMin: 3,
    questions: [{
      q: "How do most of your new patients currently find out about your clinic?",
      opts: ["Almost entirely word-of-mouth or walk-ins; I rarely advertise.", "Organic social media posts (Instagram/TikTok), but results are inconsistent.", "A structured mix of organic social media, targeted paid ads, and active patient referral programs.", "Multi-channel digital campaigns (omnichannel) with predictable Customer Acquisition Cost (CAC) tracking."]
    }, {
      q: "How would you describe your presence on platforms like Instagram/TikTok?",
      opts: ["I post occasionally without a strategy, mainly generic before-and-after photos or stock images.", "I post regularly, showing face treatments, but I struggle to convert followers into booked appointments.", "I consistently post educational content, patient transformations, and video reels showing my expertise.", "I have a strategic content calendar featuring personal branding, procedure deep-dives, and clear CTAs linked directly to a booking funnel."]
    }, {
      q: "How do you approach paid digital advertising (Meta Ads, Google Search, etc.)?",
      opts: ["I don't run paid ads at all.", "I occasionally hit “Boost Post” on Instagram when bookings slow down.", "I run dedicated ad campaigns targeting local demographics specifically for high-margin face procedures.", "I work with/manage an ads agency to run optimized lead-generation campaigns with a known Cost Per Lead (CPL)."]
    }, {
      q: "What happens when a prospective patient sees your content or website?",
      opts: ["They have to DM or call during business hours to ask for info.", "There is a link to my contact page or Instagram DM, but response times vary.", "They can instantly book a consultation via an online calendar or fill out a dedicated lead form.", "They enter an automated funnel (instant WhatsApp/SMS follow-up, landing page, self-scheduling tool)."]
    }, {
      q: "How optimized is your local digital footprint (Google Business Profile, local search)?",
      opts: ["I'm not sure if my Google profile is claimed or up to date.", "My Google listing exists, but I rarely request reviews or update photos.", "My profile is fully optimized with weekly photos, clear treatment descriptions, and regular patient reviews.", "I rank in the top 3 locally for keywords like “fillers,” “botox,” or “facial rejuvenation” and actively manage multi-platform review flows."]
    }, {
      q: "How clearly defined is your ideal patient persona for high-ticket face treatments?",
      opts: ["I welcome anyone who wants any facial treatment.", "I know generally who my best patients are, but my marketing targets everyone equally.", "I tailor content specifically to key age segments (e.g., preventative anti-aging vs. full facial harmonization).", "I have hyper-specific patient avatars and position myself as a premium niche authority."]
    }, {
      q: "How accurately do you track where your incoming queries originate?",
      opts: ["I don't ask or record how patients hear about us.", "I ask during the in-person consultation, but it isn't systematically logged.", "My receptionist or practice management software logs the source for every new booking.", "I use full attribution tracking linking ad campaigns directly to consultation conversion rates and lifetime value."]
    }]
  },
  "Sales": {
    label: "Sales",
    timeMin: 3,
    questions: [{
      q: "When a prospective patient submits an inquiry online or on social media, how quickly do they receive a response?",
      opts: ["Within 24–48 hours, depending on staff availability.", "Within 4–8 hours during regular clinic operating hours.", "Within 15–30 minutes via trained administrative staff.", "Instantly (< 5 minutes) via automated multi-channel messaging followed by personal contact."]
    }, {
      q: "How is your facial aesthetic consultation structured?",
      opts: ["The patient tells me what they want, and I quote them a price.", "I examine their face, discuss their main complaint, and suggest a couple of treatment options.", "I conduct a standardized full-face assessment and present a tailored plan.", "I use a structured 5-step consultation framework (Discovery, Full-Face Diagnostics, Solution Mapping, Handling Objections, Treatment Plan Presentation)."]
    }, {
      q: "How often do you sell comprehensive treatment plans instead of single syringes or single zones?",
      opts: ["Rarely; most patients buy single treatments/zones.", "Occasionally, if the patient brings up multiple concerns during the visit.", "Frequently; I consistently educate patients on why full-face rejuvenation yields better, more natural results.", "Almost always; my baseline consultation output is a phased 6–12 month facial treatment roadmap."]
    }, {
      q: "When a patient says, “That’s too expensive,” how do you or your team respond?",
      opts: ["I feel uncomfortable, reduce the price, or let them walk away without follow-up.", "I explain that our products/services are high quality, but I don't have a structured framework to navigate it.", "I reframe the value around safety, artistic expertise, and long-term results rather than product volume.", "I confidently isolate the concern, articulate our unique value proposition, and offer structured payment options."]
    }, {
      q: "What happens when a patient attends a consultation but leaves without booking a treatment?",
      opts: ["Nothing; we wait for them to contact us when they are ready.", "Staff sends a single follow-up message or call a few days later.", "We execute a 3-step follow-up protocol over 14 days across email, phone, and messaging.", "They are placed into an automated lead-nurturing sequence."]
    }, {
      q: "How trained is your front-desk/reception staff in closing sales and booking consultations over the phone?",
      opts: ["They handle scheduling only; they do not sell or pitch.", "They answer basic pricing questions when asked, but lack formal sales training.", "They follow basic scripts to qualify callers and emphasize clinic value before discussing prices.", "They undergo monthly sales call coaching, handle objections fluently, and hit targets for consultation-booking conversion rates."]
    }, {
      q: "When is a patient's next appointment booked after completing a facial procedure?",
      opts: ["They are told to call us when they feel they need a touch-up.", "We send a reminder email/SMS several months after their treatment.", "We request they book their follow-up/maintenance appointment at the checkout desk before leaving.", "Every patient leaves with a long-term maintenance calendar already integrated into their digital profile."]
    }]
  },
  "Clinical Skills": {
    label: "Clinical Skills",
    timeMin: 3,
    questions: [{
      q: "How comfortable are you with detailed facial vascular anatomy and ultrasound/mapping techniques?",
      opts: ["I rely on basic anatomical knowledge from initial training courses.", "I know major arterial pathways well, but I feel anxious treating high-risk areas (e.g., glabella, nose, temples).", "I have advanced knowledge of facial layers, fat pads, and vascular danger zones, using strict aspiration/cannula protocols.", "I am fully confident in multi-layer facial anatomy, actively use/understand Doppler ultrasound, and can teach anatomical mapping."]
    }, {
      q: "How prepared are you to identify and treat severe clinical complications (e.g., vascular occlusion, delayed-type hypersensitivity)?",
      opts: ["I have a basic emergency kit, but I would feel extremely panicked if a vascular occlusion occurred.", "I know the hyaluronidase protocol conceptually, but have rarely or never practiced emergency protocols hands-on.", "I have a written, accessible emergency protocol and emergency kit, and I am trained to dissolve or treat complications immediately.", "I regularly audit our emergency protocols, train my team on mock complications, and feel 100% confident managing complex cases."]
    }, {
      q: "Which range of facial injectables do you routinely and confidently perform?",
      opts: ["Basic neurotoxins and simple hyaluronic acid (HA) filler in low-risk zones (lips, nasolabial folds).", "Standard HA fillers across mid-face, lips, and chin, plus basic tox treatments.", "Advanced HA techniques, structural bio-stimulators (e.g., Sculptra, Radiesse), and pan-facial toxin placement.", "Comprehensive combination therapy: biostimulators, high-G' fillers, polynucleotides, skin boosters, and precision toxin micro-dosing."]
    }, {
      q: "How experienced are you with advanced facial procedures (e.g., non-surgical rhinoplasty, temple restoration, jawline contouring, tear troughs)?",
      opts: ["I do not offer these procedures due to lack of confidence or training.", "I perform 1 or 2 of these, but only on carefully selected “easy” anatomical candidates.", "I perform all these procedures regularly using both needle and blunt-tip cannula techniques.", "I specialize in high-complexity facial harmonizations and treat difficult or revision cases regularly."]
    }, {
      q: "How well do you combine injectables with skin rejuvenation modalities (lasers, microneedling RF, chemical peels)?",
      opts: ["I only perform injectables; skin treatments are outside my scope/interest.", "I refer patients out for skin treatments or suggest basic facials occasionally.", "I build combined treatment plans integrating EBDs/topicals to improve skin quality alongside structural injectables.", "I master multi-layer tissue rejuvenation, combining regenerative medicine (PRP/PRF/Exosomes), energy devices, and structural injectables."]
    }, {
      q: "How do you approach aesthetic harmonisation and proportions during facial evaluation?",
      opts: ["I focus solely on fixing the line or fold the patient points out to me.", "I look at individual features (e.g., cheeks, lips) and suggest treatments for those specific areas.", "I evaluate dynamic facial expressions, profile balance, golden ratios, and structural volume loss across all facial thirds.", "I assess facial kinetics, bone resorption patterns, superficial/deep fat compartments, and skin laxity to deliver undetectable, natural rejuvenation."]
    }, {
      q: "How frequently do you invest in hands-on clinical training, cadaver dissections, or masterclasses?",
      opts: ["Only when required for mandatory license/certification renewal.", "Once every year or two via vendor-sponsored webinar workshops.", "At least once a year through paid, independent hands-on masterclasses or conferences.", "Multiple times a year, including cadaver lab training, 1-on-1 expert mentorship, and peer shadowing."]
    }]
  },
  "Business Systems": {
    label: "Business Systems",
    timeMin: 3,
    questions: [{
      q: "How closely do you monitor your clinic's financial health and operational KPIs?",
      opts: ["I check my overall bank balance at the end of the month to see if we made money.", "I track monthly revenue, but I don't calculate precise net profits, margins, or overhead costs.", "I regularly monitor Revenue, Gross Profit Margin, Average Order Value (AOV), and Rebooking Rate.", "I use a full financial dashboard tracking CAC, Lifetime Value (LTV), Treatment Profitability per Minute, and Fixed vs. Variable Overhead."]
    }, {
      q: "How did you determine the pricing for your facial aesthetic treatments?",
      opts: ["I copied what other local clinics down the street are charging.", "I added a basic markup over product cost (e.g., tox unit cost or filler syringe cost).", "I calculated product costs plus hourly practitioner labor and basic overhead to set margins.", "I price based on clinical value and outcome, factor in exact hourly chair-cost metrics, and maintain >70% gross margins on treatments."]
    }, {
      q: "How reliant is the clinic's daily operations on your personal physical presence?",
      opts: ["Completely; if I don't open the door and treat patients, nothing happens and no income is generated.", "I have basic staff (receptionist/assistant), but I handle almost all clinical and administrative decisions myself.", "I have documented Standard Operating Procedures (SOPs) for front-desk, inventory, intake, and follow-ups.", "The clinic operates smoothly under clinical/administrative SOPs; I can step away for weeks without operations stalling."]
    }, {
      q: "How do you manage product stock (neurotoxins, fillers, consumables)?",
      opts: ["We order products when we realize mid-day that we have run out.", "We reorder manually whenever stock looks low on the shelf.", "We use practice management software to track stock levels and reorder at set inventory thresholds.", "We maintain a strict Just-In-Time (JIT) inventory protocol with automated reordering, stock audits, and zero-waste tracking."]
    }, {
      q: "What is your clinical delegation and staff compensation structure?",
      opts: ["I work as a solo practitioner with no clinical or administrative support staff.", "I employ administrative support, but pay hourly flat rates without performance incentives.", "I employ injectors/aesthetic nurses and offer tier-based commission or bonus structures tied to revenue targets.", "I run an empowered team of providers and administrative staff driven by clear KPIs, career growth plans, and culture alignment."]
    }, {
      q: "How effectively do you utilize medical software / CRM systems?",
      opts: ["Paper charts, manual scheduling books, or basic digital calendars.", "Standard medical software used primarily for scheduling and basic clinical notes.", "Integrated practice management software handling e-charts, automated photo storage, online booking, and SMS reminders.", "Fully integrated CRM and EHR automating patient intake, photography, treatment mapping, marketing campaigns, and review requests."]
    }, {
      q: "What is your 1- to 3-year vision for your aesthetic practice?",
      opts: ["To keep working hard and hopefully increase my monthly treatment volume.", "To add a new treatment machine or hire an extra assistant within the next year.", "To systematically increase high-ticket treatment revenue, reduce working hours, and expand provider staff.", "A clear, multi-year plan focused on enterprise valuation, opening secondary locations, or transitioning to owner-operator/board level."]
    }]
  }
};

/* ---- Dream & Vision (non-scored) — 10 questions, tallied by letter to
   surface a "Vision Profile" archetype; never affects a pillar score. ---- */
const PM_DREAM_VISION = {
  label: "Dream & Vision",
  timeMin: 4,
  questions: [{
    q: "What is your ideal target for annual personal take-home income / net profit from your practice within the next 2–3 years?",
    opts: ["£100,000–£250,000/year — a comfortable, sustainable practitioner lifestyle.", "£250,000–£500,000/year — a high-earner solo provider or small boutique clinic.", "£500,000–£1,000,000/year — a top-tier aesthetic business owner with multiple revenue streams.", "£1,000,000+/year — a seven-figure net enterprise / multi-location business owner."]
  }, {
    q: "When you imagine your ultimate business structure, what does it look like?",
    opts: ["High-end boutique solo practice — I stay the main/only injector, treating fewer patients at ultra-premium prices.", "Collaborative team clinic — a single-location clinic with 2–4 associate injectors and aesthetic therapists.", "Multi-location brand — expanding to 2+ clinic sites with standardized operating procedures and delegation.", "Passive/owner-operator model — a clinic that runs without my physical clinical presence, freeing me for strategy, training, or other ventures."]
  }, {
    q: "How do you want to be recognized within the aesthetic community and by prospective patients?",
    opts: ["The local go-to expert — the most trusted, safe, and natural-looking injector in my city/neighbourhood.", "The niche master practitioner — recognized regionally or nationally for a specialized signature technique.", "Key Opinion Leader (KOL) & international trainer — teaching on global stages, training for brands, mentoring other clinicians.", "Aesthetic brand innovator — building a proprietary skincare line, training academy, or franchisable aesthetic concept."]
  }, {
    q: "Which clinical mastery focus aligns best with your dream daily practice?",
    opts: ["Core facial injectable mastery — perfecting high-end dermal filler and neurotoxin techniques with flawless natural outcomes.", "Advanced regenerative & biostimulatory specialist — mastering polynucleotides, Sculptra, Radiesse, exosomes, and cellular rejuvenation.", "High-tech energy & combination therapy leader — combining advanced injectables with high-tier lasers, RF microneedling, and ultrasound devices.", "Precision anatomy & ultrasound pioneer — becoming a leader in ultrasound-guided facial mapping and complex complication correction."]
  }, {
    q: "In your ideal week, how many hours do you personally want to spend treating patients at the chair?",
    opts: ["Full-time clinical (32–40 hours/week) — I love treating patients above all else.", "Balanced hybrid (16–24 hours/week) — part-time clinical, with the rest on business, marketing, or personal life.", "Minimal clinical presence (8–12 hours/week) — seeing only VIP/high-ticket patients while running the business behind the scenes.", "Zero chair time (0 hours/week) — fully retired from injecting to focus on business leadership, investments, or teaching."]
  }, {
    q: "What style of patient experience do you dream of delivering in your practice?",
    opts: ["Concierge / ultra-luxury white-glove service — low volume, long appointments, extreme high-ticket pricing.", "High-efficiency modern aesthetics — seamless digital experience, fast turnaround, competitive premium packages.", "Holistic / wellness-integrated rejuvenation — combining facial aesthetics with longevity, hormones, and skin health.", "Express / accessible membership model — predictable recurring revenue through membership tiers and high retention."]
  }, {
    q: "How would you feel most fulfilled and comfortable attracting your ideal patients?",
    opts: ["100% organic authority & personal brand — a strong social media presence with educational content and personal branding.", "Systematized digital ads & paid funnels — running automated campaigns and funnel systems behind the scenes.", "Referral-only & VIP network — operating quietly through word-of-mouth, cross-referrals, and exclusive VIP events.", "Media & public relations (PR) — being featured in magazines, podcasts, news, and celebrity aesthetics."]
  }, {
    q: "What role do you want to play in managing and developing your team?",
    opts: ["Solo operator — no desire to manage employees; minimal virtual administrative support.", "Supportive mentor & boss — leading a tight-knit team of 2–5 in a family-style, high-trust workplace.", "Executive leader (CEO) — managing managers, setting high-level strategy, driving KPIs, scaling culture.", "Clinical director / master trainer — focusing on clinical quality and training providers while a Practice Manager runs operations."]
  }, {
    q: "What is your ultimate 5- to 10-year exit or legacy objective for your practice?",
    opts: ["Lifestyle career — a flexible, lucrative practice enjoyed year over year until retirement.", "Sellable asset / practice buyout — a scalable clinic with recurring revenue that could be acquired.", "Family business / partnership legacy — passing down the clinic or bringing in clinical partners long-term.", "Franchise or brand equity — licensing or franchising your brand, protocol, or product line internationally."]
  }, {
    q: "At this exact stage of your career, what is the single biggest driver behind your ambition?",
    opts: ["Financial freedom & security — building wealth, paying off debts, generating significant personal revenue.", "Time freedom & flexibility — gaining control over my calendar for family, travel, and personal passions.", "Artistic mastery & passion for aesthetics — deep love for the craft, facial harmony, and perfecting technical skill.", "Entrepreneurial impact & scaling — the excitement of building something big and leading a team."]
  }]
};
const PM_ARCHETYPES = {
  A: {
    name: "The Boutique Craftsman",
    desc: "Ultra-premium pricing, personal branding, concierge service, and high-ticket full-face packages — without expanding team complexity."
  },
  B: {
    name: "The Balanced Practice Owner",
    desc: "Delegation, associate injector onboarding, predictable digital marketing funnels, and reducing chair-time to achieve work-life balance."
  },
  C: {
    name: "The Authority & Educator",
    desc: "Advanced anatomical mastery, speaker/KOL development, specialised signature techniques, training academies, and media PR."
  },
  D: {
    name: "The Enterprise Scaling CEO",
    desc: "Multi-location SOPs, financial dashboards, team leadership/compensation models, and build-to-sell valuation strategies."
  }
};

/* Order the hub renders tiles in — Dream & Vision always last since it's the
   "bonus" non-scoring assessment. */
const PM_ASSESS_ORDER = ["Marketing", "Sales", "Clinical Skills", "Business Systems", "dreamVision"];
function pmAssessDef(key) {
  return key === "dreamVision" ? PM_DREAM_VISION : PM_PILLAR_ASSESSMENTS[key];
}
const PM_ASSESS_STATUS_LABEL = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed"
};
function pmAssessStatus(entry) {
  if (!entry) return "not_started";
  if (entry.status === "completed") return "completed";
  if (entry.answers && entry.answers.some(a => a != null)) return "in_progress";
  return "not_started";
}

/* ---- Question wizard — shared by all 5 assessments. One question per
   screen, gold selection accents, a segmented progress bar. Pillar
   assessments score on finish (rawPoints out of 28); Dream & Vision tallies
   a dominant letter and reveals an archetype instead of a score. ---- */
function PMAssessWizard({
  assessKey,
  def,
  initialAnswers,
  onProgress,
  onComplete,
  onClose
}) {
  usePMEscClose(true, onClose);
  const questions = def.questions;
  const total = questions.length;
  const scored = assessKey !== "dreamVision";
  const [step, setStep] = useStatePM(() => {
    const init = initialAnswers || questions.map(() => null);
    const firstUnanswered = init.findIndex(a => a == null);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [answers, setAnswers] = useStatePM(() => initialAnswers || questions.map(() => null));
  const [finished, setFinished] = useStatePM(false);
  useEffectPM(() => {
    if (!finished) onProgress(answers);
  }, [answers]);
  const cur = questions[step];
  function pick(i) {
    const next = answers.slice();
    next[step] = i;
    setAnswers(next);
  }
  function goNext() {
    if (step === total - 1) {
      onComplete(answers);
      setFinished(true);
    } else setStep(s => s + 1);
  }
  function goBack() {
    setStep(s => Math.max(0, s - 1));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-overlay",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": def.label
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-hd-spacer"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-hd-ti"
  }, def.label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-wiz-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "var(--gray-700)"
  }))), !finished ? /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-wiz-sub"
  }, scored ? "Answer honestly — this sets your baseline. Course progress can still carry this pillar all the way to 100%." : "Non-scored — this just helps us understand your goals so we can build your vision with you."), /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-seg",
    role: "progressbar",
    "aria-label": "Question progress",
    "aria-valuenow": step + 1,
    "aria-valuemin": 1,
    "aria-valuemax": total,
    "aria-valuetext": "Question " + (step + 1) + " of " + total
  }, questions.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: i < step ? "done" : i === step ? "on" : ""
  }))), /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-count"
  }, step + 1, " of ", total)), /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-q",
    key: "q" + step
  }, cur.q), /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-opts",
    role: "radiogroup",
    "aria-label": cur.q
  }, cur.opts.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "pm-wiz-opt" + (answers[step] === i ? " on" : ""),
    role: "radio",
    "aria-checked": answers[step] === i,
    onClick: () => pick(i)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-opt-letter"
  }, PM_ARCHETYPE_LETTERS[i]), /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-opt-tx"
  }, o)))), /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-nav"
  }, step > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-wiz-back",
    onClick: goBack
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-wiz-next",
    disabled: answers[step] == null,
    onClick: goNext
  }, step === total - 1 ? "See results" : "Continue"))) : /*#__PURE__*/React.createElement(PMAssessResult, {
    scored: scored,
    answers: answers,
    onClose: onClose
  })));
}
function pmResultInterpretation(band) {
  switch (band.key) {
    case "expert":
      return "This is already a real strength for your practice — keep leaning into what's working.";
    case "improving":
      return "You're solidly ahead of where most clinics start in this area.";
    case "practice":
      return "You've got the basics in place, with clear room to grow here.";
    default:
      return "You're just getting started here — plenty of room to build fast.";
  }
}

/* Result — the same band-coloured dial as Goal Focus: percentage in the
   ring, "19 of 28" beneath, band name as a tinted chip. Each fact once. */
function PMAssessResult({
  scored,
  answers,
  onClose
}) {
  if (scored) {
    const raw = answers.reduce((sum, a) => sum + (a + 1), 0);
    const max = answers.length * 4;
    const pct = Math.round(raw / max * 100);
    const band = pmBand(pct);
    return /*#__PURE__*/React.createElement("div", {
      className: "pm-wiz-body pm-wiz-result"
    }, /*#__PURE__*/React.createElement("h3", null, "Assessment complete"), /*#__PURE__*/React.createElement("div", {
      className: "pm-wiz-result-ring",
      style: {
        "--pct": pct,
        "--band": band.color,
        "--band-text": band.text
      },
      role: "img",
      "aria-label": pct + " percent — " + raw + " of " + max + " points — " + band.label
    }, /*#__PURE__*/React.createElement("span", {
      className: "n"
    }, pct, "%")), /*#__PURE__*/React.createElement("p", {
      className: "pm-wiz-result-raw"
    }, raw, " of ", max), /*#__PURE__*/React.createElement("span", {
      className: "pm-wiz-result-band",
      style: {
        background: band.soft,
        color: band.text
      }
    }, band.label), /*#__PURE__*/React.createElement("p", {
      className: "pm-wiz-result-note"
    }, pmResultInterpretation(band)), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-wiz-done-btn",
      onClick: onClose
    }, "Back to assessments"));
  }
  const counts = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  answers.forEach(a => {
    counts[PM_ARCHETYPE_LETTERS[a]]++;
  });
  const dominant = PM_ARCHETYPE_LETTERS.reduce((best, l) => counts[l] > counts[best] ? l : best, "A");
  const arch = PM_ARCHETYPES[dominant];
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-body pm-wiz-result"
  }, /*#__PURE__*/React.createElement("h3", null, "Your Vision Profile"), /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-result-band pm-wiz-result-band--arch"
  }, arch.name), /*#__PURE__*/React.createElement("p", {
    className: "pm-wiz-result-note"
  }, arch.desc), /*#__PURE__*/React.createElement("p", {
    className: "pm-wiz-result-note pm-wiz-result-note--muted"
  }, "This doesn't change your Prosperity Spiral — it just helps us (and your mentor) understand where you want your clinic to go."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-wiz-done-btn",
    onClick: onClose
  }, "Back to assessments"));
}

/* Per-tile presentation: a large emoji icon (fluent-emoji-flat — every name
   below verified against the Iconify collection index) and a pastel wash
   with a matching hairline. */
const PM_HUB_META = {
  "Marketing": {
    icon: "fluent-emoji-flat:megaphone",
    blurb: "How you attract and convert new patients",
    wash: "#FFF1E8",
    line: "#F3CDB3"
  },
  "Sales": {
    icon: "fluent-emoji-flat:money-bag",
    blurb: "Consultations, follow-up and closing the plan",
    wash: "#EAF7EF",
    line: "#B9E2C8"
  },
  "Clinical Skills": {
    icon: "fluent-emoji-flat:syringe",
    blurb: "Technique, safety and your treatment range",
    wash: "#F1EEFF",
    line: "#D2CBF7"
  },
  "Business Systems": {
    icon: "fluent-emoji-flat:gear",
    blurb: "Pricing, operations and financial tracking",
    wash: "#EAF3FF",
    line: "#BFD8F7"
  },
  "dreamVision": {
    icon: "fluent-emoji-flat:crystal-ball",
    blurb: "Where you want your clinic to go — not scored",
    wash: "#FFEDF3",
    line: "#F5C3D3"
  }
};
function PMAssessHubTile({
  assessKey,
  def,
  entry,
  onOpen
}) {
  const status = pmAssessStatus(entry);
  const scored = assessKey !== "dreamVision";
  const meta = PM_HUB_META[assessKey];
  const scorePct = status === "completed" && scored ? Math.round(entry.rawPoints / (def.questions.length * 4) * 100) : null;
  const done = status === "completed";
  const style = done ? {
    "--wash": "#EAF6F0",
    "--line": "#B9E2C8"
  } : {
    "--wash": meta.wash,
    "--line": meta.line
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-hub-tile pm-hub-tile--" + status,
    style: style,
    onClick: () => onOpen(assessKey),
    "aria-label": def.label + " — " + PM_ASSESS_STATUS_LABEL[status] + (scorePct != null ? ", " + scorePct + " percent" : "") + ". About " + def.timeMin + " minutes"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-hub-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: meta.icon,
    size: 34
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-hub-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, def.label), /*#__PURE__*/React.createElement("span", {
    className: "bl"
  }, meta.blurb), /*#__PURE__*/React.createElement("span", {
    className: "tm"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:clock",
    size: 12,
    color: "var(--gray-500)"
  }), "~", def.timeMin, " mins", scorePct != null && /*#__PURE__*/React.createElement("b", {
    className: "pm-hub-score"
  }, "· ", scorePct, "%"), done && !scored && /*#__PURE__*/React.createElement("b", {
    className: "pm-hub-score"
  }, "· ", PM_ARCHETYPES[entry.archetype] ? PM_ARCHETYPES[entry.archetype].name : "Done"))), /*#__PURE__*/React.createElement("span", {
    className: "pm-hub-badge pm-hub-badge--" + status
  }, done && /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 11,
    color: "#1E7A5C"
  }), PM_ASSESS_STATUS_LABEL[status]), /*#__PURE__*/React.createElement("span", {
    className: "pm-hub-chev",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--brand-navy)"
  })));
}

/* Assessment Selection Screen (PRD 3.1) — 4 pillar tiles + Dream & Vision,
   opened from the "Get to know you" entry point in Complete Your Profile. */
function PMAssessHelpModal({
  open,
  onClose
}) {
  usePMEscClose(open, onClose);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-help-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-help-card",
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "How self-assessments work"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-help-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-help-icon"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:compass",
    size: 18,
    color: "var(--ai-purple)"
  })), /*#__PURE__*/React.createElement("h3", null, "How self-assessments work"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-help-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-help-body"
  }, /*#__PURE__*/React.createElement("p", null, "Each pillar assessment gives you a score based on your real-world experience and honest self-evaluation — there are no wrong answers, just an honest snapshot of where your clinic is today."), /*#__PURE__*/React.createElement("p", null, "That score becomes the starting point for your personalised journey plan — it's how Ava (and your mentor) know where to focus your coaching first."), /*#__PURE__*/React.createElement("p", null, "It also feeds directly into your Prosperity Spiral: your self-assessment sets the baseline for each pillar, and completing courses can carry it the rest of the way to 100%."), /*#__PURE__*/React.createElement("p", null, "Dream & Vision works differently — it's never scored. It simply helps us understand your goals so we can build your journey around them."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-help-coach pf-coach-link",
    "data-coach": "Explain how my self-assessment scores work and how they feed my Prosperity Spiral.",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:sparkles",
    size: 14,
    color: "var(--ai-purple)"
  }), "Ask Ava"))));
}
function PMAssessHub({
  assessState,
  onOpenAssess,
  onClose
}) {
  const [helpOpen, setHelpOpen] = useStatePM(false);
  /* Esc closes the topmost sheet only — while the ? explainer is open, the
     hub's own Esc handler stands down so one keypress doesn't shut both. */
  usePMEscClose(!helpOpen, onClose);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-overlay",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Get to know you"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-hd-spacer"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-wiz-hd-ti pm-wiz-hd-ti--with-help"
  }, "Get to know you", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-wiz-help",
    "aria-label": "How self-assessments work",
    onClick: () => setHelpOpen(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:circle-help",
    size: 18,
    color: "var(--gray-500)"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-wiz-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "var(--gray-700)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-wiz-body pm-hub-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-hub-intro"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-hub-intro-ic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:sparkles",
    size: 18,
    color: "var(--ai-purple)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-hub-intro-copy"
  }, /*#__PURE__*/React.createElement("b", null, "Why Ava asks"), /*#__PURE__*/React.createElement("p", null, "Your answers set your Prosperity Spiral and shape every target Ava suggests. Four short assessments — about 3 minutes each."), /*#__PURE__*/React.createElement("div", {
    className: "pm-hub-intro-chips"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:lock",
    size: 12,
    color: "var(--ai-purple)"
  }), "Private to you"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:refresh-cw",
    size: 12,
    color: "var(--ai-purple)"
  }), "Retake anytime")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-hub-grid"
  }, PM_ASSESS_ORDER.map(key => /*#__PURE__*/React.createElement(PMAssessHubTile, {
    key: key,
    assessKey: key,
    def: pmAssessDef(key),
    entry: assessState[key],
    onOpen: onOpenAssess
  }))))), /*#__PURE__*/React.createElement(PMAssessHelpModal, {
    open: helpOpen,
    onClose: () => setHelpOpen(false)
  }));
}

/* ---- Step sheet: Photo ---- */
function PhotoStep({
  onComplete,
  isDone
}) {
  const [chosen, setChosen] = useStatePM(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-av"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: "Katy Wilson",
    src: "assets/avatar-katy.jpg",
    size: 88
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-sheet-av-edit"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:camera",
    size: 15,
    color: "#fff"
  }))), isDone && /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-note"
  }, "Your profile photo is set. You can update it anytime."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-opts"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-opt" + (chosen === "camera" ? " sel" : ""),
    onClick: () => setChosen("camera")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:camera",
    size: 22,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Take a photo")), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-opt" + (chosen === "library" ? " sel" : ""),
    onClick: () => setChosen("library")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:image",
    size: 22,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Choose from library"))), chosen && /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: onComplete
  }, "Upload & Save Photo"));
}

/* ---- Step sheet: Bio ---- */
function BioStep({
  onComplete
}) {
  const [bio, setBio] = useStatePM(PM_ME.bio);
  const max = 300;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Write a short bio that tells people about your professional background and specialisations."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "pm-sheet-ta",
    value: bio,
    maxLength: max,
    rows: 5,
    onChange: e => setBio(e.target.value),
    placeholder: "e.g. Aesthetic nurse with 10+ years experience in botox and dermal fillers…"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-sheet-count"
  }, bio.length, "/", max)), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: onComplete,
    disabled: bio.trim().length < 10
  }, "Save Bio"));
}

/* ---- Step sheet: Location ---- */
function LocationStep({
  onComplete
}) {
  const [loc, setLoc] = useStatePM("London, United Kingdom");
  const [detecting, setDetecting] = useStatePM(false);
  function detect() {
    setDetecting(true);
    setTimeout(() => {
      setLoc("London, United Kingdom");
      setDetecting(false);
    }, 1200);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Add your location so patients and peers can find you."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-field"
  }, /*#__PURE__*/React.createElement("input", {
    className: "pm-sheet-inp",
    value: loc,
    onChange: e => setLoc(e.target.value),
    placeholder: "City, Country"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-ghost",
    onClick: detect,
    disabled: detecting
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:map-pin",
    size: 18,
    color: "var(--brand-navy)"
  }), detecting ? "Detecting…" : "Use my current location"), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: onComplete,
    disabled: loc.trim().length < 2
  }, "Save Location"));
}

/* ---- Step sheet: Credentials ----
   Submitting doesn't mark this step done — it only flips to "done" (and
   awards evt_license_verify points) once admin-verification.jsx approves
   the same pf-credential-verification record, so "Got it" here just
   closes the sheet rather than calling onComplete/markDone. */
/* Dev-only affordance: on localhost the "under review" screen also offers a
   one-tap approve so the flow can be exercised without opening
   AdminVerification.html. Never shown on a deployed origin. */
const PM_IS_DEV = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
function CredentialsStep({
  onClose,
  onPending,
  onComplete
}) {
  const rec = getCredVerificationPM();
  const [nmcNum, setNmcNum] = useStatePM(rec?.nmcNumber || "");
  const [submitted, setSubmitted] = useStatePM(rec?.status === "pending");
  function submit() {
    setCredVerificationPM({
      nmcNumber: nmcNum.trim(),
      status: "pending",
      submittedAt: new Date().toISOString()
    });
    onPending();
    setSubmitted(true);
  }

  /* Mirrors admin-verification.jsx approve(): same record shape, same
     evt_license_verify award, so the rest of the app can't tell the
     difference. */
  function devApprove() {
    const current = getCredVerificationPM() || {
      nmcNumber: nmcNum.trim(),
      submittedAt: new Date().toISOString()
    };
    /* The evt_license_verify award (and its "+N points" toast) happens in
       ProfileSteps.markDone(3), so it isn't completed twice here; rewardShown
       keeps the mount-time sync from toasting it again on the next load. */
    setCredVerificationPM({
      ...current,
      status: "approved",
      approvedAt: new Date().toISOString(),
      rewardShown: true
    });
    onComplete();
  }
  if (submitted) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pm-sheet-step pm-sheet-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pm-sheet-icon-wrap success"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:clock",
      size: 32,
      color: "var(--success)"
    })), /*#__PURE__*/React.createElement("h4", null, "Verification Submitted"), /*#__PURE__*/React.createElement("p", {
      className: "pm-sheet-desc"
    }, "Your credentials are under review. We'll notify you within 1–2 business days."), /*#__PURE__*/React.createElement("button", {
      className: "pm-sheet-cta",
      onClick: onClose
    }, "Got it"), PM_IS_DEV && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-sheet-dev",
      onClick: devApprove
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:wrench",
      size: 14,
      color: "currentColor"
    }), "Dev only · Approve verification now"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, rec?.status === "rejected" && /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-alert"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:alert-circle",
    size: 16,
    color: "var(--error)"
  }), "Your last submission was rejected. Please check your details and resubmit."), /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Enter your NMC or GMC registration number to verify your professional credentials."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "pm-sheet-label"
  }, "NMC / GMC Number"), /*#__PURE__*/React.createElement("input", {
    className: "pm-sheet-inp",
    value: nmcNum,
    onChange: e => setNmcNum(e.target.value),
    placeholder: "e.g. 12A3456B"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-ghost"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:upload",
    size: 18,
    color: "var(--brand-navy)"
  }), "Upload supporting documents"), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: submit,
    disabled: nmcNum.trim().length < 5
  }, "Submit for Verification"));
}

/* ---- Step sheet: Social profiles ---- */
const PM_SOCIALS = [{
  key: "linkedin",
  icon: "mdi:linkedin",
  color: "#0A66C2",
  label: "LinkedIn"
}, {
  key: "instagram",
  icon: "mdi:instagram",
  color: "#E1306C",
  label: "Instagram"
}, {
  key: "twitter",
  icon: "mdi:twitter",
  color: "#1DA1F2",
  label: "X / Twitter"
}, {
  key: "facebook",
  icon: "mdi:facebook",
  color: "#1877F2",
  label: "Facebook"
}];
function SocialStep({
  onComplete
}) {
  const [connected, setConnected] = useStatePM([]);
  function toggle(key) {
    setConnected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Link your social profiles to build trust and grow your network."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-socials"
  }, PM_SOCIALS.map(s => {
    const on = connected.includes(s.key);
    return /*#__PURE__*/React.createElement("div", {
      key: s.key,
      className: "pm-sheet-social"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: s.icon,
      size: 28,
      color: s.color
    }), /*#__PURE__*/React.createElement("span", {
      className: "pm-sheet-social-nm"
    }, s.label), /*#__PURE__*/React.createElement("button", {
      className: "pm-sheet-social-btn" + (on ? " connected" : ""),
      onClick: () => toggle(s.key)
    }, on ? "Connected" : "Connect"));
  })), connected.length > 0 && /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    onClick: onComplete
  }, "Save Connections"));
}

/* ---- Bottom sheet wrapper ---- */
function StepSheet({
  step,
  idx,
  onComplete,
  onClose,
  onPending
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-drag"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-hd"
  }, /*#__PURE__*/React.createElement("h3", null, step.ti), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-body"
  }, idx === 0 && /*#__PURE__*/React.createElement(PhotoStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }), idx === 1 && /*#__PURE__*/React.createElement(BioStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }), idx === 2 && /*#__PURE__*/React.createElement(LocationStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }), idx === 3 && /*#__PURE__*/React.createElement(CredentialsStep, {
    onClose: onClose,
    onPending: onPending,
    onComplete: onComplete
  }), idx === 4 && /*#__PURE__*/React.createElement(SocialStep, {
    onComplete: onComplete,
    isDone: step.state === "done"
  }))));
}

/* Raw-JSON Lottie (the /embed iframe caches aggressively). Mirrors AULottie in auth-mobile.jsx. */
function PMLottie({
  src,
  size
}) {
  const host = React.useRef(null);
  React.useEffect(() => {
    let anim, iv;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: src
      });
    };
    if (window.lottie) start();else {
      iv = setInterval(() => {
        if (window.lottie) {
          clearInterval(iv);
          start();
        }
      }, 120);
      setTimeout(() => clearInterval(iv), 8000);
    }
    return () => {
      if (iv) clearInterval(iv);
      if (anim) anim.destroy();
    };
  }, [src]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    style: {
      display: "block",
      width: size,
      height: size
    }
  });
}

/* ---- Profile complete success banner ---- */
function ProfileCompleteCard({
  onDismiss,
  pointsAwarded,
  exiting
}) {
  useEffectPM(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-modal-overlay" + (exiting ? " pm-steps-exit" : ""),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Profile complete"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-steps-scrim",
    "aria-label": "Close",
    onClick: onDismiss
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-success",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-success-icon"
  }, /*#__PURE__*/React.createElement(PMLottie, {
    src: "https://lottie.host/cc6c5973-9f61-481c-85ed-0fe2089a9176/CwHL9yTPJJ.json",
    size: 84
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-success-kicker"
  }, "Milestone unlocked"), pointsAwarded > 0 && /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-success-pts"
  }, /*#__PURE__*/React.createElement("b", null, "+", pointsAwarded), /*#__PURE__*/React.createElement("i", null, "points")), /*#__PURE__*/React.createElement("h1", {
    className: "pm-steps-success-h"
  }, "Profile Complete!"), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-success-sub"
  }, "Your profile is fully set up. You're ready to connect with the community."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-steps-success-btn",
    onClick: onDismiss
  }, "Got it")));
}

/* Shared by every "collapse to a summary row / expand to a two-pane slide-
   over" section (Complete Your Profile, Track Your Goals): measures
   whichever pane is currently visible and returns a height to drive the
   outer viewport, so the hidden pane's (often taller) content never forces
   extra blank space. A ResizeObserver — rather than a one-shot measurement
   — keeps this correct even as icon web components finish
   upgrading/rendering after first paint, or list content changes length. */
function usePMSlidePaneHeight(expanded, deps) {
  const collapsedRef = React.useRef(null);
  const expandedRef = React.useRef(null);
  const [height, setHeight] = useStatePM(null);
  React.useLayoutEffect(() => {
    const el = expanded ? expandedRef.current : collapsedRef.current;
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [expanded, ...(deps || [])]);
  return {
    collapsedRef,
    expandedRef,
    height
  };
}

/* ---- Profile steps card ---- */
function ProfileSteps({
  assessState,
  onAssessPatch
}) {
  const [steps, setSteps] = useStatePM(() => PM_STEPS_INIT.map(s => ({
    ...s
  })));
  const [activeIdx, setActiveIdx] = useStatePM(null);
  const [dismissed, setDismissed] = useStatePM(false);
  const [exiting, setExiting] = useStatePM(false);
  const [hubOpen, setHubOpen] = useStatePM(false);
  const [openAssessKey, setOpenAssessKey] = useStatePM(null);
  const [expanded, setExpanded] = useStatePM(false);
  const {
    collapsedRef,
    expandedRef,
    height: viewportH
  } = usePMSlidePaneHeight(expanded, [assessState, steps]);

  /* "Track your goals"' gate card lives in a sibling component with no
     shared parent state, so it reaches the hub here via a DOM event rather
     than a prop. */
  useEffectPM(() => {
    function openHub() {
      setExpanded(true);
      setHubOpen(true);
    }
    window.addEventListener("pf-open-assess-hub", openHub);
    return () => window.removeEventListener("pf-open-assess-hub", openHub);
  }, []);

  /* The full-page Edit Profile screen (opened from "Edit Profile" at the top
     of the profile) saves its own bio field directly — it has no shared
     state with this component, so it announces a completed bio the same way
     "Track your goals" announces the assessment hub: a DOM event. */
  useEffectPM(() => {
    function onBioSaved() {
      setSteps(prev => prev[1].state === "done" ? prev : prev.map((s, i) => i === 1 ? {
        ...s,
        state: "done",
        su: "Complete"
      } : s));
      awardStepPoints("evt_bio_write", pts => showStepReward(pts, 1));
    }
    window.addEventListener("pf-bio-saved", onBioSaved);
    return () => window.removeEventListener("pf-bio-saved", onBioSaved);
  }, []);
  const total = steps.length;
  const done = steps.filter(s => s.state === "done").length;

  /* Self-Assessment is a 6th, weighted slice of the overall percentage —
     5 sub-assessments (4 pillars + Dream & Vision) x 20% each — rather than
     a single binary step, so completing each one nudges the bar forward
     (PRD 3.1: "Profile Percentage... updates sequentially after each
     individual pillar assessment is submitted"). */
  const assessDone = PM_ASSESS_ORDER.filter(k => assessState[k] && assessState[k].status === "completed").length;
  const assessFraction = assessDone / PM_ASSESS_ORDER.length;
  const totalSlices = total + 1;
  const allDone = done === total && assessDone === PM_ASSESS_ORDER.length;
  const pct = Math.round((done + assessFraction) / totalSlices * 100);
  const [profilePoints, setProfilePoints] = useStatePM(0);
  useEffectPM(() => {
    if (!allDone) return;
    awardStepPoints("evt_profile_complete", setProfilePoints);
  }, [allDone]);

  /* Picks up whatever admin-verification.jsx last wrote to the shared
     pf-credential-verification record — approved there flips this step to
     done (and, the first time, awards evt_license_verify points) without
     the user having to do anything else in this tab. */
  useEffectPM(() => {
    function syncCredStep() {
      const rec = getCredVerificationPM();
      if (!rec) return;
      if (rec.status === "approved") {
        setSteps(prev => prev.map((s, i) => i === 3 ? {
          ...s,
          state: "done",
          su: "Complete"
        } : s));
        /* Toast the payout exactly once per approval. admin-verification.jsx
           usually books evt_license_verify before this tab hears about it, so
           fall back to the ledger entry for the amount; rewardShown on the
           shared record stops a repeat "+N points" on every profile load. */
        const engine = window.PFLoyalty;
        if (engine && !rec.rewardShown) {
          const res = engine.completeAction("evt_license_verify");
          let pts = res && res.ok && !res.capped ? res.pointsAwarded : 0;
          if (!pts) {
            const txn = (engine.getState().ledger || []).filter(t => t.actionId === "evt_license_verify" && t.pointsDelta > 0).pop();
            pts = txn ? txn.pointsDelta : 0;
          }
          setCredVerificationPM({
            ...rec,
            rewardShown: true
          });
          if (pts > 0) showStepReward(pts, 3);
        }
      } else if (rec.status === "rejected") {
        setSteps(prev => prev.map((s, i) => i === 3 ? {
          ...s,
          state: "todo",
          su: "Rejected — resubmit"
        } : s));
      } else if (rec.status === "pending") {
        setSteps(prev => prev.map((s, i) => i === 3 ? {
          ...s,
          state: "pending",
          su: "Under review"
        } : s));
      }
    }
    syncCredStep();
    /* Approve/reject in the AdminVerification tab writes the same key, so a
       storage event lets this tab flip the step (and toast) without a reload. */
    function onStorage(e) {
      if (e.key === PF_CRED_KEY_PM) syncCredStep();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Points earned by an individual step ("Write your bio", "Verify your
     credentials") surface as a small owl pill overlaid on the checklist,
     floating over the top edge of the step that earned them — a fixed toast
     at the top of the screen was easy to miss. { pts, idx } so the list knows
     which row to anchor to; the checklist expands so the pill is on screen. */
  const [stepReward, setStepReward] = useStatePM(null);
  function showStepReward(pts, idx) {
    setStepReward({
      pts,
      idx
    });
    setExpanded(true);
  }
  const PM_STEP_ACTIONS = {
    1: "evt_bio_write",
    3: "evt_license_verify"
  };
  function markDone(idx) {
    setSteps(prev => prev.map((s, i) => i === idx ? {
      ...s,
      state: "done",
      su: "Complete"
    } : s));
    setActiveIdx(null);
    if (PM_STEP_ACTIONS[idx]) awardStepPoints(PM_STEP_ACTIONS[idx], pts => showStepReward(pts, idx));
  }
  function awardStepPoints(actionId, setReward) {
    const engine = window.PFLoyalty;
    if (!engine) return;
    const res = engine.completeAction(actionId);
    let pts = 0;
    if (res.ok && !res.capped) {
      pts = res.pointsAwarded;
    } else {
      const action = engine.getActionById(actionId);
      if (action) {
        const mult = engine.tierMultiplierFor(action, engine.getState().user.membershipTier);
        pts = Math.round(action.basePoints * mult);
      }
    }
    if (pts > 0) setReward(pts);
  }
  function markPending(idx) {
    setSteps(prev => prev.map((s, i) => i === idx ? {
      ...s,
      state: "pending",
      su: "Under review"
    } : s));
  }
  function handleDismiss() {
    setExiting(true);
    setTimeout(() => setDismissed(true), 400);
  }
  function handleAssessProgress(answers) {
    const prevStatus = assessState[openAssessKey] && assessState[openAssessKey].status;
    onAssessPatch(openAssessKey, {
      answers,
      status: prevStatus === "completed" ? "completed" : "in_progress"
    });
  }
  function handleAssessComplete(answers) {
    if (openAssessKey === "dreamVision") {
      const counts = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
      };
      answers.forEach(a => {
        counts[PM_ARCHETYPE_LETTERS[a]]++;
      });
      const dominant = PM_ARCHETYPE_LETTERS.reduce((best, l) => counts[l] > counts[best] ? l : best, "A");
      onAssessPatch(openAssessKey, {
        answers,
        status: "completed",
        archetype: dominant
      });
    } else {
      const rawPoints = answers.reduce((sum, a) => sum + (a + 1), 0);
      onAssessPatch(openAssessKey, {
        answers,
        status: "completed",
        rawPoints
      });
    }
  }
  if (dismissed) return null;
  if (allDone) {
    return /*#__PURE__*/React.createElement(ProfileCompleteCard, {
      onDismiss: handleDismiss,
      pointsAwarded: profilePoints,
      exiting: exiting
    });
  }
  const assessAllDone = assessDone === PM_ASSESS_ORDER.length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-viewport",
    style: viewportH != null ? {
      height: viewportH + "px"
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-slider" + (expanded ? " expanded" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    ref: collapsedRef,
    className: "pm-steps pm-steps-pane pm-steps-collapsed",
    "aria-label": "Complete your profile — tap to view checklist",
    onClick: () => setExpanded(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-collapsed-top"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "pm-steps-h"
  }, "Complete your profile"), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-sub"
  }, done + assessDone, " of ", totalSlices, " complete"), /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-track",
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-steps-fill",
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-pct"
  }, pct, "% complete — tap to view checklist")), /*#__PURE__*/React.createElement("div", {
    ref: expandedRef,
    className: "pm-steps pm-steps-pane pm-steps-expanded",
    "aria-label": "Complete your profile checklist"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-steps-back",
    onClick: () => setExpanded(false)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 20,
    color: "var(--text-heading)"
  }), "Complete your profile"), /*#__PURE__*/React.createElement("div", {
    className: "pm-steps-list"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-step " + (assessAllDone ? "done" : "priority"),
    onClick: () => setHubOpen(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-step-mark",
    "aria-hidden": "true"
  }, assessAllDone ? /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 18,
    color: "#fff"
  }) : /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:compass",
    size: 16,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-step-txt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, "Get to know you"), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, assessDone, " of ", PM_ASSESS_ORDER.length, " assessments complete")), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  })), steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-step-slot",
    key: i
  }, stepReward != null && stepReward.idx === i && /*#__PURE__*/React.createElement(PMPointsToast, {
    key: "reward-" + stepReward.pts,
    points: stepReward.pts,
    onDone: () => setStepReward(null)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-step " + s.state,
    onClick: () => setActiveIdx(i)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-step-mark",
    "aria-hidden": "true"
  }, s.state === "done" ? /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 18,
    color: "#fff"
  }) : s.state === "pending" ? /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:clock",
    size: 16,
    color: "var(--premium-orange)"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "dot"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-step-txt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, s.ti), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, s.su)), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  })))))))), activeIdx !== null && /*#__PURE__*/React.createElement(StepSheet, {
    step: steps[activeIdx],
    idx: activeIdx,
    onComplete: () => markDone(activeIdx),
    onClose: () => setActiveIdx(null),
    onPending: () => markPending(activeIdx)
  }), hubOpen && /*#__PURE__*/React.createElement(PMAssessHub, {
    assessState: assessState,
    onOpenAssess: key => {
      setHubOpen(false);
      setOpenAssessKey(key);
    },
    onClose: () => setHubOpen(false)
  }), openAssessKey && /*#__PURE__*/React.createElement(PMAssessWizard, {
    assessKey: openAssessKey,
    def: pmAssessDef(openAssessKey),
    initialAnswers: assessState[openAssessKey] && assessState[openAssessKey].answers,
    onProgress: handleAssessProgress,
    onComplete: handleAssessComplete,
    onClose: () => {
      setOpenAssessKey(null);
      setHubOpen(true);
    }
  }));
}

/* ---- Small "just earned points" pill (owl animation), overlaid on the
   checklist above the step that earned it (no layout shift), for individual
   profile steps like Bio/About rather than the full profile-complete modal ---- */
function PMPointsToast({
  points,
  onDone
}) {
  const [exiting, setExiting] = useStatePM(false);
  useEffectPM(() => {
    const t = setTimeout(() => setExiting(true), 2200);
    return () => clearTimeout(t);
  }, []);
  useEffectPM(() => {
    if (!exiting) return;
    const t = setTimeout(onDone, 300);
    return () => clearTimeout(t);
  }, [exiting]);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-pts-toast-row" + (exiting ? " pm-pts-toast-exit" : ""),
    role: "status",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-pts-toast"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-pts-toast-ic"
  }, /*#__PURE__*/React.createElement(PMLottie, {
    src: "https://lottie.host/cc6c5973-9f61-481c-85ed-0fe2089a9176/CwHL9yTPJJ.json",
    size: 40
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-pts-toast-txt"
  }, "+", points, " points")));
}
function PMSection({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title), /*#__PURE__*/React.createElement("span", {
    className: "pm-sec-tools"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-tool",
    "aria-label": "Add to " + title
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:plus",
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-tool",
    "aria-label": "Edit " + title
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
    name: "edit",
    size: 17,
    color: "var(--brand-navy)"
  })))), children);
}

/* ---- Upcoming lives ----
   Lives the member scheduled from Create Post → Live → Schedule (mobile) or
   the web composer's Go Live → Schedule. Read from the shared
   "pf-scheduled-lives" localStorage list (the two flows run as separate
   page loads with no backend). Shown on the member's own profile only; the
   card hides entirely when there's nothing booked and the viewer isn't a
   Super User (the only role that can go live). */
const PM_SCHED_KEY = "pf-scheduled-lives";
function pmLoadScheduledLives() {
  try {
    return JSON.parse(localStorage.getItem(PM_SCHED_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function pmSaveScheduledLives(list) {
  try {
    localStorage.setItem(PM_SCHED_KEY, JSON.stringify(list));
  } catch (e) {}
}
/* Super User = the Admin persona. Mobile Create Post persists it under
   "pf-preview-tier"; the web newsfeed's "Previewing as" panel under
   "pf-subscription-tier" — accept either so both surfaces agree. */
function pmIsSuperUser() {
  try {
    return localStorage.getItem("pf-preview-tier") === "admin" || localStorage.getItem("pf-subscription-tier") === "admin";
  } catch (e) {
    return false;
  }
}
function pmFormatLiveWhen(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
  }) + " · " + d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
}
/* "in 3 days" / "in 2 hrs" / "Starting soon" / "Started 10 min ago" */
function pmLiveCountdown(iso) {
  const ms = new Date(iso) - Date.now();
  if (isNaN(ms)) return "";
  const abs = Math.abs(ms),
    m = Math.round(abs / 60000),
    h = Math.round(abs / 3600000),
    d = Math.round(abs / 86400000);
  if (ms < 0) return m < 60 ? "Started " + m + " min ago" : "Started " + h + " hr" + (h === 1 ? "" : "s") + " ago";
  if (m < 15) return "Starting soon";
  if (m < 60) return "in " + m + " min";
  if (h < 24) return "in " + h + " hr" + (h === 1 ? "" : "s");
  return "in " + d + " day" + (d === 1 ? "" : "s");
}

/* Temporarily hidden (2026-09-10) — flip to true to bring the card back. */
const PM_SHOW_UPCOMING_LIVES = false;
function PMUpcomingLivesCard() {
  const [lives, setLives] = useStatePM(pmLoadScheduledLives);
  const [confirmId, setConfirmId] = useStatePM(null);
  const superUser = pmIsSuperUser();
  useEffectPM(() => {
    const sync = () => setLives(pmLoadScheduledLives());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);
  /* Deep link from the "Live scheduled" confirmation — land on this card. */
  useEffectPM(() => {
    if (window.location.hash !== "#upcoming-lives") return;
    const t = setTimeout(() => {
      const el = document.getElementById("upcoming-lives");
      if (el) el.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 300);
    return () => clearTimeout(t);
  }, []);
  const cancelLive = id => {
    const next = lives.filter(x => x.id !== id);
    pmSaveScheduledLives(next);
    setLives(next);
    setConfirmId(null);
  };
  const goLive = item => goPM("CreatePostMobile.html?mode=live&sched=" + encodeURIComponent(item.id));
  if (lives.length === 0 && !superUser) return null;
  const now = Date.now();
  return /*#__PURE__*/React.createElement("section", {
    id: "upcoming-lives",
    className: "pm-card pm-lives-card",
    "data-screen-label": "Upcoming lives"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-card-hd-ti"
  }, /*#__PURE__*/React.createElement("h2", null, "Upcoming lives")), lives.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "pm-lives-count"
  }, lives.length, " scheduled")), lives.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "pm-lives-empty"
  }, /*#__PURE__*/React.createElement("p", null, "No lives scheduled yet. Plan one ahead so your followers know when to tune in."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-lives-schedule",
    onClick: () => goPM("CreatePostMobile.html?mode=live")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:calendar-clock",
    size: 17,
    color: "#fff"
  }), "Schedule a live")) : /*#__PURE__*/React.createElement("ul", {
    className: "pm-lives-list"
  }, lives.map(item => {
    const due = new Date(item.startIso).getTime() - now < 15 * 60 * 1000;
    return /*#__PURE__*/React.createElement("li", {
      key: item.id,
      className: "pm-live-row" + (due ? " due" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "pm-live-date",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "d"
    }, new Date(item.startIso).getDate()), /*#__PURE__*/React.createElement("span", {
      className: "m"
    }, new Date(item.startIso).toLocaleDateString(undefined, {
      month: "short"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "pm-live-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pm-live-status"
    }, due ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }), "Live soon") : "Scheduled"), /*#__PURE__*/React.createElement("span", {
      className: "pm-live-ti"
    }, item.title), /*#__PURE__*/React.createElement("span", {
      className: "pm-live-meta"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:clock",
      size: 13,
      color: "var(--gray-500)"
    }), pmFormatLiveWhen(item.startIso), /*#__PURE__*/React.createElement("span", {
      className: "sep"
    }, "·"), pmLiveCountdown(item.startIso), /*#__PURE__*/React.createElement("span", {
      className: "sep"
    }, "·"), item.dest), superUser && (confirmId === item.id ? /*#__PURE__*/React.createElement("div", {
      className: "pm-live-confirm"
    }, /*#__PURE__*/React.createElement("span", null, "Cancel this live?"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "yes",
      onClick: () => cancelLive(item.id)
    }, "Yes, cancel"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "no",
      onClick: () => setConfirmId(null)
    }, "Keep")) : /*#__PURE__*/React.createElement("div", {
      className: "pm-live-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-live-go",
      onClick: () => goLive(item)
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:radio",
      size: 15,
      color: "#fff"
    }), "Go live now"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-live-cancel",
      onClick: () => setConfirmId(item.id)
    }, "Cancel")))));
  })), lives.length > 0 && superUser && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-lives-add",
    onClick: () => goPM("CreatePostMobile.html?mode=live")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:plus",
    size: 16,
    color: "var(--brand-navy)"
  }), "Schedule another live"));
}
function PMMentor() {
  const [done, setDone] = useStatePM(false);
  if (done) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor-hd"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "fluent:people-team-16-filled",
    size: 22,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "Find a mentor")), /*#__PURE__*/React.createElement("p", {
    className: "s"
  }, "Connecting with a mentor can accelerate your professional growth."), /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor-act"
  }, /*#__PURE__*/React.createElement("button", {
    className: "no",
    onClick: () => setDone(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--error)"
  }), "No"), /*#__PURE__*/React.createElement("button", {
    className: "yes",
    onClick: () => setDone(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 18,
    color: "var(--success)"
  }), "Yes")));
}
function PMPost({
  p
}) {
  const lines = p.body.split("\n");
  const openAuthor = () => p.id && goPM("ProfileMobile.html?id=" + p.id);
  return /*#__PURE__*/React.createElement("article", {
    className: "pm-post"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-post-hd"
  }, p.id ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-post-avbtn",
    "aria-label": "View " + p.name + "'s profile",
    onClick: openAuthor
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: p.name,
    src: p.avatar,
    size: 42
  })) : /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: p.name,
    src: p.avatar,
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-post-by"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, p.id ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-post-namebtn",
    onClick: openAuthor
  }, p.name) : p.name, /*#__PURE__*/React.createElement("span", {
    className: "loc"
  }, p.loc)), /*#__PURE__*/React.createElement("span", {
    className: "tm"
  }, p.time)), /*#__PURE__*/React.createElement("button", {
    className: "pm-post-more",
    "aria-label": "More options"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 20,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "pm-post-ttl"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "pm-post-body"
  }, lines[0], lines[1] && /*#__PURE__*/React.createElement("span", {
    className: "tags"
  }, " ", lines[1])), /*#__PURE__*/React.createElement("div", {
    className: "pm-post-eng"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:thumbs-up",
    size: 17,
    color: "var(--gray-500)"
  }), p.likes), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 17,
    color: "var(--gray-500)"
  }), p.comments), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:share-2",
    size: 17,
    color: "var(--gray-500)"
  }), p.shares)));
}

/* "Activity" — encloses the post feed behind the same collapse/expand
   slide-over used by "Complete your profile" / "Track your goals" (shared
   .pm-menu-* classes; see profile-mobile.css). */
function PMActivityMenu() {
  const [expanded, setExpanded] = useStatePM(false);
  const {
    collapsedRef,
    expandedRef,
    height: viewportH
  } = usePMSlidePaneHeight(expanded, []);
  const latest = PM_ACTIVITY[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-viewport",
    style: viewportH != null ? {
      height: viewportH + "px"
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-slider" + (expanded ? " expanded" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    ref: collapsedRef,
    className: "pm-menu-pane pm-menu-collapsed",
    "aria-label": "Activity — tap to view",
    onClick: () => setExpanded(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-collapsed-top"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "pm-steps-h"
  }, "Activity"), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-sub"
  }, PM_ACTIVITY.length, " recent posts & updates"), latest && /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-preview"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: latest.name,
    src: latest.avatar,
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-preview-tx"
  }, /*#__PURE__*/React.createElement("b", null, latest.name), " · ", latest.title), /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-preview-time"
  }, latest.time))), /*#__PURE__*/React.createElement("div", {
    ref: expandedRef,
    className: "pm-menu-pane pm-menu-expanded"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-menu-back",
    onClick: () => setExpanded(false)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 20,
    color: "var(--text-heading)"
  }), "Activity"), /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-activity"
  }, PM_ACTIVITY.map((p, i) => /*#__PURE__*/React.createElement(PMPost, {
    key: i,
    p: p
  }))), /*#__PURE__*/React.createElement("button", {
    className: "pm-showall",
    onClick: () => goPM("NewsfeedMobile.html")
  }, "Show all posts")))));
}

/* "Professional Information" — encloses Services, Experience, Education,
   Licenses & Certifications and Language behind the same collapse/expand
   pattern. Accepts data via props so the exact same component renders a
   member's own info (defaults) or another member's (OtherProfileScreen). */
function PMProfessionalInfoMenu({
  services = PM_SERVICES,
  experience = PM_EXPERIENCE,
  education = PM_EDUCATION,
  licenses = PM_LICENSES,
  languages = PM_LANGUAGES
}) {
  const [expanded, setExpanded] = useStatePM(false);
  const {
    collapsedRef,
    expandedRef,
    height: viewportH
  } = usePMSlidePaneHeight(expanded, [services, experience, education, licenses, languages]);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-viewport",
    style: viewportH != null ? {
      height: viewportH + "px"
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-slider" + (expanded ? " expanded" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    ref: collapsedRef,
    className: "pm-menu-pane pm-menu-collapsed",
    "aria-label": "Professional Information — tap to view",
    onClick: () => setExpanded(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-collapsed-top"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "pm-steps-h"
  }, "Professional Information"), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-sub"
  }, "Services, Experience, Education, Licenses & Languages"), /*#__PURE__*/React.createElement("div", {
    className: "pm-menu-tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-tag"
  }, services.length, " Services"), /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-tag"
  }, experience.length, " Experience"), /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-tag"
  }, licenses.length, " Certifications"), /*#__PURE__*/React.createElement("span", {
    className: "pm-menu-tag"
  }, languages.length, " Languages"))), /*#__PURE__*/React.createElement("div", {
    ref: expandedRef,
    className: "pm-menu-pane pm-menu-expanded"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-menu-back",
    onClick: () => setExpanded(false)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 20,
    color: "var(--text-heading)"
  }), "Professional Information"), /*#__PURE__*/React.createElement(PMSection, {
    title: "Services"
  }, services.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, s.ti), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, s.su)))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Experience"
  }, experience.map((e, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, e.ti), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, e.yrs), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, e.org), /*#__PURE__*/React.createElement("div", {
    className: "su flag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, "🇬🇧"), e.loc)))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Education"
  }, education.map((ed, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow media",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-logo"
  }, ed.logo), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, ed.school), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, ed.program), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, ed.years))))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Licenses & Certifications"
  }, licenses.map((l, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow media",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-logo cert"
  }, "P"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, l), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Profinity Academy"), /*#__PURE__*/React.createElement("div", {
    className: "su muted"
  }, "Issued January 2008"))))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Language"
  }, languages.map((lg, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lang"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, lg.flag), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, lg.name), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, lg.level)))))))));
}

/* ===========================================================================
   Viewing someone else's profile — ProfileMobile.html?id=<key>. A shorter,
   read-only take on the same page: identity header with Follow/Message
   (instead of Edit/Share), then everything laid out as scannable cards —
   what you share with them, a summarised recent-activity card, and their
   Professional Information behind the same enclosed menu used above.
   =========================================================================== */
function OtherProfileTopBar({
  name,
  onBack,
  onMessage
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "pm-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-burger",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-top-other-name"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Message",
    onClick: onMessage
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 21,
    color: "var(--brand-navy)"
  })));
}
function PMSharedInfoCard({
  user
}) {
  const shared = user.shared || {};
  const courses = shared.courses || [];
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec pm-card",
    "data-screen-label": "Shared with you"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-card-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-card-hd-ti"
  }, /*#__PURE__*/React.createElement("h2", null, "Shared with you"))), /*#__PURE__*/React.createElement("div", {
    className: "pm-shared-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-shared-item"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:users",
    size: 18,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, shared.mutualConnections != null ? shared.mutualConnections : "—"), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Mutual connections")), /*#__PURE__*/React.createElement("div", {
    className: "pm-shared-item"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:crown",
    size: 18,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, shared.community || "—"), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Shared community")), /*#__PURE__*/React.createElement("div", {
    className: "pm-shared-item"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:book-open",
    size: 18,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, courses.length), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Shared courses"))), courses.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pm-shared-courses"
  }, courses.map((c, i) => /*#__PURE__*/React.createElement("span", {
    className: "pm-shared-course-chip",
    key: i
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:book-open",
    size: 13,
    color: "var(--brand-navy)"
  }), c))));
}
function PMActivitySummaryCard({
  user
}) {
  const activity = user.activity || {};
  const highlights = activity.highlights || [];
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec pm-card",
    "data-screen-label": "Recent activity"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-card-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-card-hd-ti"
  }, /*#__PURE__*/React.createElement("h2", null, "Recent Activity")), activity.lastActive && /*#__PURE__*/React.createElement("span", {
    className: "pm-activity-lastactive"
  }, "Active ", activity.lastActive)), /*#__PURE__*/React.createElement("div", {
    className: "pm-activity-summary-rows"
  }, highlights.map((h, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-activity-summary-row",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: h.icon,
    size: 16,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, h.text), /*#__PURE__*/React.createElement("span", {
    className: "tm"
  }, h.time))), highlights.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "pm-steps-sub"
  }, "No recent activity to show yet.")), /*#__PURE__*/React.createElement("button", {
    className: "pm-showall",
    onClick: () => goPM("NewsfeedMobile.html")
  }, "View full activity"));
}
function OtherProfileScreen({
  user
}) {
  const [msgOpen, setMsgOpen] = useStatePM(false);
  const [following, setFollowing] = useStatePM(false);
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden
  } = useHeaderHidePM(scrollRef);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-screen",
    "data-screen-label": "Profile — " + user.name
  }, /*#__PURE__*/React.createElement(OtherProfileTopBar, {
    name: user.name,
    onBack: () => goPM("NewsfeedMobile.html"),
    onMessage: () => setMsgOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-avwrap"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: user.name,
    src: user.avatar,
    size: 92,
    className: "pm-ig-av"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, user.posts), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "posts")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, user.followers), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "followers")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, user.following), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "following")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, user.name), /*#__PURE__*/React.createElement("span", {
    className: "pn"
  }, user.role), user.seals && /*#__PURE__*/React.createElement(DSPM.VerificationSeals, {
    seals: user.seals,
    size: 20
  })), user.bio && /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-bio"
  }, /*#__PURE__*/React.createElement("p", null, user.bio)), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-chips"
  }, user.location && /*#__PURE__*/React.createElement("span", {
    className: "pm-chip"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:map-pin",
    size: 16,
    color: "var(--brand-navy)"
  }), user.location), user.clinic && /*#__PURE__*/React.createElement("span", {
    className: "pm-chip"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:building-2",
    size: 16,
    color: "var(--brand-navy)"
  }), user.clinic)), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn" + (following ? "" : " navy"),
    onClick: () => setFollowing(f => !f)
  }, following ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "var(--text-heading)"
  }), "Following") : "Follow"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn",
    onClick: () => setMsgOpen(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 16,
    color: "var(--text-heading)"
  }), "Message"))), /*#__PURE__*/React.createElement(PMSharedInfoCard, {
    user: user
  }), /*#__PURE__*/React.createElement(PMActivitySummaryCard, {
    user: user
  }), /*#__PURE__*/React.createElement(PMProfessionalInfoMenu, {
    services: user.services,
    experience: user.experience,
    education: user.education,
    licenses: user.licenses,
    languages: user.languages
  })), /*#__PURE__*/React.createElement(PMTabBar, {
    compact: chromeHidden
  }), /*#__PURE__*/React.createElement(MessagesPanelPM, {
    open: msgOpen,
    onClose: () => setMsgOpen(false)
  }));
}
function ProfileNotFoundScreen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-screen",
    "data-screen-label": "Profile not found"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pm-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-burger",
    "aria-label": "Back",
    onClick: () => goPM("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-700)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-empty-state"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:user-x",
    size: 40,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("h2", null, "Profile not found"), /*#__PURE__*/React.createElement("p", null, "This profile may have been removed, or the link is out of date."), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn navy",
    onClick: () => goPM("NewsfeedMobile.html")
  }, "Back to Home")));
}
function readProfileIdParamPM() {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      id: params.get("id"),
      name: params.get("name"),
      avatar: params.get("avatar")
    };
  } catch (e) {
    return {
      id: null,
      name: null,
      avatar: null
    };
  }
}

/* Fallback profile for the seeded post/comment authors across the Newsfeed
   and Community that don't have a curated PM_OTHER_USERS entry — every post
   author is clickable, so anyone not on the curated list still lands
   somewhere real rather than a dead-end "not found" page. Deliberately
   light: explicit empty arrays (not undefined) for services/experience/
   education/licenses/languages, so PMProfessionalInfoMenu's own defaults —
   which fall back to the signed-in member's own info — never leak onto a
   stranger's profile. */
function buildMinimalProfilePM(name, avatar) {
  return {
    name,
    avatar: avatar || undefined,
    role: "Profinity Community Member",
    posts: "—",
    followers: "—",
    following: "—",
    shared: {},
    activity: {},
    services: [],
    experience: [],
    education: [],
    licenses: [],
    languages: []
  };
}
function useDeviceScalePM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStatePM(calc);
  useEffectPM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobilePM() {
  const [mobile, setMobile] = useStatePM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectPM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

/* ---- Full-page profile editor (opened from "Edit Profile") ---- */
function PMEditField({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "pm-edit-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-input-wrap"
  }, icon && /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: icon,
    size: 18,
    color: "var(--gray-450)"
  }), options ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("select", {
    className: "pm-edit-select",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-down",
    size: 16,
    color: "var(--gray-450)"
  })) : /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "pm-edit-input",
    value: value,
    placeholder: placeholder || label,
    onChange: e => onChange(e.target.value)
  })));
}
function PMEditProfileScreen({
  profile,
  onCancel,
  onSave
}) {
  const [form, setForm] = useStatePM(() => ({
    title: profile.title || PM_TITLE_OPTIONS[0],
    fullName: profile.name || "",
    bio: profile.bio || "",
    specialty: profile.specialty || "",
    clinic: profile.clinic || "",
    clinicNumber: profile.clinicNumber || "",
    clinicAddress: profile.clinicAddress || "",
    yearsExperience: profile.yearsExperience || "",
    instagram: profile.instagram || ""
  }));
  const [goals, setGoals] = useStatePM(() => profile.personalGoal || PM_PERSONAL_GOAL_QUESTIONS.map(() => ""));
  function setField(key) {
    return value => setForm(f => ({
      ...f,
      [key]: value
    }));
  }
  function setGoalAt(i, value) {
    setGoals(g => g.map((v, gi) => gi === i ? value : v));
  }
  function handleSave() {
    onSave({
      name: form.fullName,
      bio: form.bio,
      title: form.title,
      specialty: form.specialty,
      clinic: form.clinic,
      clinicNumber: form.clinicNumber,
      clinicAddress: form.clinicAddress,
      yearsExperience: form.yearsExperience,
      instagram: form.instagram,
      personalGoal: goals
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-screen",
    "data-screen-label": "Edit profile"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pm-edit-hd"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-edit-back",
    "aria-label": "Back",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h1", null, "Edit Profile"), /*#__PURE__*/React.createElement("span", {
    className: "pm-edit-hd-spacer",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-avwrap"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: profile.name,
    src: profile.avatar,
    size: 96
  })), /*#__PURE__*/React.createElement("section", {
    className: "pm-edit-card"
  }, /*#__PURE__*/React.createElement("h2", null, "Public Profile Information"), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Title",
    icon: "lucide:contact",
    value: form.title,
    onChange: setField("title"),
    options: PM_TITLE_OPTIONS
  }), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Full Name",
    icon: "lucide:user",
    value: form.fullName,
    onChange: setField("fullName")
  }), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Tell us about yourself",
    value: form.bio,
    onChange: setField("bio"),
    placeholder: "Tell us about yourself"
  }), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Primary Specialty",
    icon: "lucide:stethoscope",
    value: form.specialty,
    onChange: setField("specialty")
  }), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Clinic Name",
    icon: "lucide:image",
    value: form.clinic,
    onChange: setField("clinic")
  }), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Clinic Number",
    icon: "lucide:phone",
    value: form.clinicNumber,
    onChange: setField("clinicNumber")
  }), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Clinic Address",
    icon: "lucide:map-pin",
    value: form.clinicAddress,
    onChange: setField("clinicAddress")
  }), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Years of Experience",
    icon: "lucide:hash",
    value: form.yearsExperience,
    onChange: setField("yearsExperience")
  }), /*#__PURE__*/React.createElement(PMEditField, {
    label: "Instagram Account",
    icon: "lucide:instagram",
    value: form.instagram,
    onChange: setField("instagram")
  })), /*#__PURE__*/React.createElement("section", {
    className: "pm-edit-card"
  }, /*#__PURE__*/React.createElement("h2", null, "Personal Goal"), PM_PERSONAL_GOAL_QUESTIONS.map((q, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-field",
    key: i
  }, /*#__PURE__*/React.createElement("label", {
    className: "pm-edit-label"
  }, q), /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "pm-edit-input",
    value: goals[i],
    onChange: e => setGoalAt(i, e.target.value)
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-edit-cancel",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-edit-save",
    onClick: handleSave
  }, "Save")));
}
function PMScreen() {
  const [profile, setProfile] = useStatePM(() => ({
    ...PM_ME
  }));
  const m = profile;
  const [msgOpen, setMsgOpen] = useStatePM(false);
  const [menuOpen, setMenuOpen] = useStatePM(false);
  const [editOpen, setEditOpen] = useStatePM(false);
  const [assessState, setAssessState] = useStatePM(() => pmLoadAssessState());
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useHeaderHidePM(scrollRef);
  function saveProfileEdits(updated) {
    const bioJustAdded = !profile.bio && updated.bio && updated.bio.trim().length > 0;
    setProfile(prev => ({
      ...prev,
      ...updated
    }));
    setEditOpen(false);
    if (bioJustAdded) window.dispatchEvent(new CustomEvent("pf-bio-saved"));
  }
  function patchAssessState(key, patch) {
    setAssessState(prev => {
      const next = {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          ...patch
        }
      };
      pmSaveAssessState(next);
      return next;
    });
  }
  /* Deep link from LearningMobile's "See your full Prosperity Spiral" —
     full page navigation (not an SPA route), so scroll to the anchor once
     the layout has settled instead of relying on default hash scrolling
     (which can land above the fixed top bar). */
  useEffectPM(() => {
    if (window.location.hash !== "#prosperity-spiral") return;
    /* Track your goals auto-expands on this same hash (see PMGoalsMenu);
       wait out its slide/height transition (~380ms) before scrolling so the
       page doesn't jump mid-animation. */
    const t = setTimeout(() => {
      const el = document.getElementById("prosperity-spiral");
      if (el) el.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 420);
    return () => clearTimeout(t);
  }, []);
  if (editOpen) {
    return /*#__PURE__*/React.createElement(PMEditProfileScreen, {
      profile: profile,
      onCancel: () => setEditOpen(false),
      onSave: saveProfileEdits
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "Profile (mobile)"
  }, /*#__PURE__*/React.createElement(PMTopBar, {
    onMenu: () => setMenuOpen(true),
    onMessages: () => setMsgOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-avwrap"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: m.name,
    src: m.avatar,
    size: 92,
    className: "pm-ig-av"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.posts), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "posts")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.followers), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "followers")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.following), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "following")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, m.name), /*#__PURE__*/React.createElement("span", {
    className: "pn"
  }, m.role), /*#__PURE__*/React.createElement(DSPM.VerificationSeals, {
    seals: ["verified", "crown", "gold"],
    size: 20
  }), /*#__PURE__*/React.createElement(PMSealBadge, {
    src: "assets/badge-m.svg",
    alt: "Mastery badge",
    label: "Mastery Badge",
    width: 20,
    height: 20,
    style: {
      marginLeft: -5
    }
  }), /*#__PURE__*/React.createElement(PMSealBadge, {
    src: "assets/badge-skinfluencer.png",
    alt: "PROfinity Skinfluencer badge",
    label: "Skinfluencer",
    width: 20,
    height: 22,
    style: {
      marginLeft: -5
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-bio"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "🇬🇧"), " Aesthetic Nurse Practitioner"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "💉"), " Botox · Fillers · Lip Enhancement"), /*#__PURE__*/React.createElement("p", {
    className: "pm-ig-live"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:calendar",
    size: 14,
    color: "var(--text-primary)"
  })), "Upcoming Live: ", /*#__PURE__*/React.createElement("b", null, "September 17, 2026")), m.bio && /*#__PURE__*/React.createElement("p", null, m.bio)), /*#__PURE__*/React.createElement("a", {
    className: "pm-ig-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:link",
    size: 17,
    color: "var(--ai-purple)"
  }), "allcaremedical.co.uk"), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-chip"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:map-pin",
    size: 16,
    color: "var(--brand-navy)"
  }), m.location), /*#__PURE__*/React.createElement("span", {
    className: "pm-chip"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:building-2",
    size: 16,
    color: "var(--brand-navy)"
  }), m.clinic), /*#__PURE__*/React.createElement("span", {
    className: "pm-chip add"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:plus",
    size: 16,
    color: "var(--gray-500)"
  }), "Add")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn",
    onClick: () => setEditOpen(true)
  }, "Edit Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn navy"
  }, "Share Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn icon",
    "aria-label": "Settings",
    onClick: () => goPM("AccountSettings.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:settings",
    size: 20,
    color: "var(--text-heading)"
  })))), PM_SHOW_UPCOMING_LIVES && /*#__PURE__*/React.createElement(PMUpcomingLivesCard, null), /*#__PURE__*/React.createElement(ProfileSteps, {
    assessState: assessState,
    onAssessPatch: patchAssessState
  }), /*#__PURE__*/React.createElement(PMGoalsMenu, {
    assessState: assessState
  }), /*#__PURE__*/React.createElement(PMMentor, null), /*#__PURE__*/React.createElement(PMActivityMenu, null), /*#__PURE__*/React.createElement(PMProfessionalInfoMenu, null), /*#__PURE__*/React.createElement("button", {
    className: "pm-logout",
    onClick: () => goPM("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:log-out",
    size: 20,
    color: "var(--error)"
  }), "Logout")), /*#__PURE__*/React.createElement(PMTabBar, {
    compact: chromeHidden
  }), /*#__PURE__*/React.createElement(MessagesPanelPM, {
    open: msgOpen,
    onClose: () => setMsgOpen(false)
  }), /*#__PURE__*/React.createElement(SideMenuPM, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }));
}
function ProfileMobileApp() {
  const mobile = useIsMobilePM();
  const scale = useDeviceScalePM();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  const {
    id: idParam,
    name: nameParam,
    avatar: avatarParam
  } = readProfileIdParamPM();
  const otherUser = idParam ? PM_OTHER_USERS[idParam] || (nameParam ? buildMinimalProfilePM(nameParam, avatarParam) : null) : null;
  const content = idParam ? otherUser ? /*#__PURE__*/React.createElement(OtherProfileScreen, {
    user: otherUser
  }) : /*#__PURE__*/React.createElement(ProfileNotFoundScreen, null) : /*#__PURE__*/React.createElement(PMScreen, null);
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-card)"
      }
    }, content);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, content)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ProfileMobileApp, null));
