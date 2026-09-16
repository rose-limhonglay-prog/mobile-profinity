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
  "miranda-pearce": {
    name: "Miranda Pearce",
    role: "Aesthetic Nurse Practitioner",
    avatar: "assets/avatar-miranda.jpg",
    seals: ["gb", "verified", "gold"],
    flag: "🇬🇧",
    headline: "Aesthetic Nurse Practitioner",
    specialties: ["Lip Enhancement", "Skin Boosters", "Profhilo"],
    upcomingLive: "September 24, 2026",
    link: "mirandapearce.co.uk",
    banners: {
      instagram: "mirandapearce",
      threads: "mirandapearce",
      facebook: "Miranda Pearce"
    },
    bio: "Aesthetic nurse and PROfinity mentor. Helping practitioners build calm, confident consultations.",
    location: "London, United Kingdom",
    clinic: "PROfinity Academy",
    posts: "148",
    followers: "9.2K",
    following: "412",
    shared: {
      mutualConnections: 19,
      community: "Confidence Path",
      courses: ["8D Lip Design", "Temple Filler"]
    },
    activity: {
      lastActive: "20m ago",
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted a lip mapping walkthrough",
        time: "Today"
      }, {
        icon: "lucide:message-circle",
        text: "Replied to your comment",
        time: "Yesterday"
      }, {
        icon: "lucide:calendar-check",
        text: "Hosting Lip Design Live Q&A",
        time: "24 Sep"
      }]
    },
    services: [{
      ti: "Lip Enhancement",
      su: "Career Academy: Dr Tim Pearce"
    }, {
      ti: "Skin Boosters",
      su: "Career Academy: Dr Tim Pearce"
    }],
    experience: [{
      ti: "Aesthetic Nurse Practitioner",
      yrs: "11 years",
      org: "PROfinity Academy",
      loc: "London, United Kingdom"
    }],
    education: [{
      logo: "KCL",
      school: "King's College London",
      program: "BSc Nursing",
      years: "2008 - 2011"
    }],
    licenses: ["8D Lips Course", "Anatomy360", "Botox Foundations"],
    languages: [{
      flag: "🇬🇧",
      name: "English (UK)",
      level: "Primary"
    }]
  },
  "dr-amir-khan": {
    name: "Dr Amir Khan",
    role: "Aesthetic Doctor",
    avatar: "assets/avatar-amir-khan.jpg",
    seals: ["verified", "gold"],
    flag: "🇬🇧",
    headline: "Aesthetic Medicine Doctor",
    specialties: ["Full-Face Filler", "Tear Trough", "Jawline"],
    upcomingLive: "October 8, 2026",
    link: "dramirkhan.co.uk",
    banners: {
      instagram: "dramirkhan",
      youtube: "Dr Amir Khan"
    },
    bio: "Full-face harmonisation with a safety-first approach. Sharing cases, complications and lessons learned.",
    location: "Manchester, United Kingdom",
    clinic: "Khan Aesthetics",
    posts: "96",
    followers: "4.8K",
    following: "233",
    shared: {
      mutualConnections: 12,
      community: "Mastery Path",
      courses: ["Temple Filler", "Protox Course"]
    },
    activity: {
      lastActive: "2h ago",
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted a tear trough case review",
        time: "Today"
      }, {
        icon: "lucide:thumbs-up",
        text: "Liked your latest post",
        time: "2d"
      }]
    },
    services: [{
      ti: "Dermal Fillers",
      su: "Career Academy: Dr Tim Pearce"
    }, {
      ti: "Full-Face Rejuvenation",
      su: "Career Academy: Dr Tim Pearce"
    }],
    experience: [{
      ti: "Aesthetic Doctor",
      yrs: "8 years",
      org: "Khan Aesthetics",
      loc: "Manchester, United Kingdom"
    }],
    education: [{
      logo: "UoM",
      school: "University of Manchester",
      program: "MBChB Medicine",
      years: "2009 - 2014"
    }],
    licenses: ["Anatomy360", "The Ultimate Toxin Eye Complications Masterclass"],
    languages: [{
      flag: "🇬🇧",
      name: "English (UK)",
      level: "Primary"
    }, {
      flag: "🇵🇰",
      name: "Urdu",
      level: "Secondary"
    }]
  },
  "priya-shah": {
    name: "Priya Shah",
    role: "Aesthetic Nurse",
    avatar: "assets/avatar-priya-shah.jpg",
    seals: ["verified"],
    flag: "🇬🇧",
    headline: "Aesthetic Nurse Prescriber",
    specialties: ["Anti-Wrinkle", "Skin Boosters", "Microneedling"],
    link: "priyashahaesthetics.com",
    banners: {
      instagram: "priyashah.aesthetics",
      facebook: "Priya Shah"
    },
    bio: "Nurse prescriber growing a home clinic one happy patient at a time.",
    location: "Leicester, United Kingdom",
    clinic: "Priya Shah Aesthetics",
    posts: "61",
    followers: "2.1K",
    following: "318",
    shared: {
      mutualConnections: 9,
      community: "Confidence Path",
      courses: ["Botox Foundations"]
    },
    activity: {
      lastActive: "45m ago",
      highlights: [{
        icon: "lucide:message-circle",
        text: "Asked a question in Confidence Path",
        time: "Today"
      }, {
        icon: "lucide:file-text",
        text: "Shared her first before & after",
        time: "3d"
      }]
    },
    services: [{
      ti: "Botox (Anti-Wrinkle Injections)",
      su: "Career Academy: Dr Tim Pearce"
    }],
    experience: [{
      ti: "Aesthetic Nurse",
      yrs: "4 years",
      org: "Priya Shah Aesthetics",
      loc: "Leicester, United Kingdom"
    }],
    education: [{
      logo: "DMU",
      school: "De Montfort University",
      program: "BSc Nursing",
      years: "2015 - 2018"
    }],
    licenses: ["Botox Foundations"],
    languages: [{
      flag: "🇬🇧",
      name: "English (UK)",
      level: "Primary"
    }, {
      flag: "🇮🇳",
      name: "Gujarati",
      level: "Secondary"
    }]
  },
  "nurse-beth": {
    name: "Nurse Beth",
    role: "Aesthetic Nurse",
    avatar: "assets/avatar-nurse-beth.jpg",
    seals: ["verified"],
    flag: "🇬🇧",
    headline: "Independent Aesthetic Nurse",
    specialties: ["Anti-Wrinkle", "Lip Enhancement"],
    upcomingLive: "October 15, 2026",
    link: "nursebeth.co.uk",
    banners: {
      instagram: "nursebeth",
      threads: "nursebeth"
    },
    bio: "Independent nurse, 2 years in. Documenting the messy middle of building a clinic.",
    location: "Bristol, United Kingdom",
    clinic: "Beth Aesthetics",
    posts: "43",
    followers: "1.4K",
    following: "290",
    shared: {
      mutualConnections: 6,
      community: "Confidence Path",
      courses: ["8D Lip Design"]
    },
    activity: {
      lastActive: "3h ago",
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted about consultation nerves",
        time: "Yesterday"
      }, {
        icon: "lucide:thumbs-up",
        text: "Liked 4 of your posts",
        time: "1w"
      }]
    },
    services: [{
      ti: "Lip Enhancement",
      su: "Career Academy: Dr Tim Pearce"
    }],
    experience: [{
      ti: "Aesthetic Nurse",
      yrs: "2 years",
      org: "Beth Aesthetics",
      loc: "Bristol, United Kingdom"
    }],
    education: [{
      logo: "UWE",
      school: "University of the West of England",
      program: "BSc Nursing",
      years: "2017 - 2020"
    }],
    licenses: ["8D Lips Course"],
    languages: [{
      flag: "🇬🇧",
      name: "English (UK)",
      level: "Primary"
    }]
  },
  "mark-ellis": {
    name: "Mark Ellis",
    role: "Clinic Owner",
    avatar: "assets/avatar-mark-ellis.jpg",
    seals: ["verified", "crown"],
    flag: "🇬🇧",
    headline: "Clinic Owner & Business Mentor",
    specialties: ["Clinic Growth", "Marketing", "Systems"],
    link: "ellisclinics.com",
    banners: {
      linkedin: "Mark Ellis",
      instagram: "markellis.clinics"
    },
    bio: "Three clinics, one team. Talking about the business side of aesthetics.",
    location: "Birmingham, United Kingdom",
    clinic: "Ellis Clinics",
    posts: "77",
    followers: "3.6K",
    following: "150",
    shared: {
      mutualConnections: 14,
      community: "Freedom Path",
      courses: []
    },
    activity: {
      lastActive: "1d ago",
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted a pricing breakdown",
        time: "2d"
      }, {
        icon: "lucide:calendar-check",
        text: "Attending Business Systems Workshop",
        time: "12 Oct"
      }]
    },
    services: [],
    experience: [{
      ti: "Founder & Director",
      yrs: "10 years",
      org: "Ellis Clinics",
      loc: "Birmingham, United Kingdom"
    }],
    education: [{
      logo: "AST",
      school: "Aston University",
      program: "BSc Business Management",
      years: "2005 - 2008"
    }],
    licenses: ["Business Systems Masterclass"],
    languages: [{
      flag: "🇬🇧",
      name: "English (UK)",
      level: "Primary"
    }]
  },
  "dr-sarah-collins": {
    name: "Dr. Sarah Collins",
    role: "Aesthetic Doctor",
    avatar: "assets/avatar-sarah-collins.jpg",
    seals: ["verified", "gold"],
    flag: "🇮🇪",
    headline: "Aesthetic Doctor & Educator",
    specialties: ["Complications", "Toxin", "Facial Anatomy"],
    upcomingLive: "September 29, 2026",
    link: "drsarahcollins.ie",
    banners: {
      instagram: "drsarahcollins",
      linkedin: "Dr Sarah Collins"
    },
    bio: "GP turned aesthetic doctor. Passionate about anatomy-led, complication-aware practice.",
    location: "Dublin, Ireland",
    clinic: "Collins Clinic",
    posts: "112",
    followers: "6.3K",
    following: "201",
    shared: {
      mutualConnections: 17,
      community: "Mastery Path",
      courses: ["Protox Course", "Temple Filler"]
    },
    activity: {
      lastActive: "Just now",
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted a vascular occlusion protocol",
        time: "Today"
      }, {
        icon: "lucide:message-circle",
        text: "Commented on your post",
        time: "Today"
      }]
    },
    services: [{
      ti: "Botox (Anti-Wrinkle Injections)",
      su: "Career Academy: Dr Tim Pearce"
    }, {
      ti: "Dermal Fillers",
      su: "Career Academy: Dr Tim Pearce"
    }],
    experience: [{
      ti: "Aesthetic Doctor",
      yrs: "9 years",
      org: "Collins Clinic",
      loc: "Dublin, Ireland"
    }],
    education: [{
      logo: "TCD",
      school: "Trinity College Dublin",
      program: "MB BCh BAO Medicine",
      years: "2004 - 2010"
    }],
    licenses: ["Anatomy360", "Pro Tox Course", "The Ultimate Toxin Eye Complications Masterclass"],
    languages: [{
      flag: "🇮🇪",
      name: "English (IE)",
      level: "Primary"
    }]
  },
  "james-lee": {
    name: "James Lee",
    role: "Surgical Nurse Practitioner",
    avatar: null,
    seals: ["verified"],
    flag: "🇦🇺",
    headline: "Surgical Nurse Practitioner",
    specialties: ["Suturing", "Wound Care", "Post-Op"],
    upcomingLive: "October 2, 2026",
    link: "sydneyaesthetic.com.au",
    banners: {
      instagram: "jameslee.np",
      linkedin: "James Lee"
    },
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
    flag: "🇨🇦",
    headline: "Dental Practitioner",
    specialties: ["Digital Dentistry", "Treatment Planning"],
    link: "garciadental.ca",
    banners: {
      instagram: "drlindagarcia",
      facebook: "Linda Garcia"
    },
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
    flag: "🇬🇧",
    headline: "Aesthetic Medicine Doctor & Trainer",
    specialties: ["Botox", "Fillers", "Full-Face Rejuvenation"],
    upcomingLive: "September 30, 2026",
    link: "drtimpearce.com",
    banners: {
      instagram: "drtimpearce",
      youtube: "Dr Tim Pearce",
      facebook: "Dr Tim Pearce"
    },
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
  icon: "lucide:settings",
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
}, {
  label: "Chat Support",
  icon: "lucide:headset",
  href: "ChatSupport.html"
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

/* `active` defaults to Profile (the owner's page). Viewing someone else's
   profile passes the tab of the page they came from — Home when tapped from
   the newsfeed, Community from a channel… — so the footer doesn't jump to
   Profile just because the URL is ProfileMobile.html. */
const PMTabBar = React.forwardRef(function PMTabBar({
  compact,
  active = "Profile"
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "pm-tabs" + (compact ? " pm-tabs-compact" : ""),
    "aria-label": "Primary"
  }, PM_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "pm-tab" + (t.key === active ? " on" : ""),
    "aria-current": t.key === active ? "page" : undefined,
    onClick: () => {
      if (t.href) goPM(t.href);else if (t.key === "Profile" && active !== "Profile") goPM("ProfileMobile.html");
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: t.icon,
    size: 20,
    color: t.key === active ? "#fff" : "var(--gray-450)"
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

/* ---- Connected socials + profile banners store ----
   "Connect your social profiles" (Complete your profile step) writes the
   connected accounts here; the Edit profile → Banners screen picks from
   them, and the chosen ones render as chips on the profile. */
const PM_SOCIAL_CONN_KEY = "pf-social-connections"; /* { key: handle } */
const PM_BANNERS_KEY = "pf-profile-banners"; /* [key, ...] in display order */
function pmLoadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}
function pmSaveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}
function pmLoadSocialConnections() {
  const v = pmLoadJSON(PM_SOCIAL_CONN_KEY, {});
  return v && typeof v === "object" ? v : {};
}
function pmLoadBanners() {
  const conn = pmLoadSocialConnections();
  const b = pmLoadJSON(PM_BANNERS_KEY, []);
  return Array.isArray(b) ? b.filter(k => {
    const it = pmBannerItem(k);
    return it && (!it.needsValue || conn[k]);
  }) : [];
}
function pmSaveBanners(list) {
  pmSaveJSON(PM_BANNERS_KEY, list);
  try {
    window.dispatchEvent(new CustomEvent("pf-banners-changed"));
  } catch (e) {}
}
function pmDefaultSocialHandle(key) {
  const name = PM_ME.name || "";
  const handle = "@" + name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return key === "facebook" || key === "linkedin" ? name : handle;
}
function pmSocialUrl(key, handle) {
  const h = String(handle || "").replace(/^@/, "").replace(/\s+/g, "");
  switch (key) {
    case "instagram":
      return "https://instagram.com/" + h;
    case "twitter":
      return "https://x.com/" + h;
    case "facebook":
      return "https://facebook.com/" + h;
    case "linkedin":
      return "https://linkedin.com/in/" + h;
    case "threads":
      return "https://threads.net/@" + h;
    case "youtube":
      return "https://youtube.com/@" + h;
    case "whatsapp":
      return "https://wa.me/" + h.replace(/[^0-9]/g, "");
    default:
      return "#";
  }
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

/* Everything the Banners screen can put under the bio. Socials reuse the
   handle saved by "Connect your social profiles"; the rest keep their own
   text in the same store. `needsValue` items ask for text before they are
   added; `editable` ones get a pencil so the text can be changed later. */
const PM_BANNER_ITEMS = [{
  key: "threads",
  icon: "simple-icons:threads",
  color: "#000000",
  label: "Threads",
  needsValue: true,
  prompt: "Threads username",
  placeholder: "username",
  value: h => String(h || "").replace(/^@/, "")
}, {
  key: "instagram",
  icon: "mdi:instagram",
  color: "#E1306C",
  label: "Instagram",
  needsValue: true,
  prompt: "Instagram username",
  placeholder: "username",
  value: h => String(h || "").replace(/^@/, "")
}, {
  key: "youtube",
  icon: "lucide:youtube",
  color: "#FF0000",
  label: "YouTube",
  needsValue: true,
  editable: true,
  prompt: "YouTube channel",
  placeholder: "Channel name"
}, {
  key: "facebook",
  icon: "mdi:facebook",
  color: "#1877F2",
  label: "Facebook",
  needsValue: true,
  prompt: "Facebook profile",
  placeholder: "Your name on Facebook"
}, {
  key: "linkedin",
  icon: "mdi:linkedin",
  color: "#0A66C2",
  label: "LinkedIn",
  needsValue: true,
  prompt: "LinkedIn profile",
  placeholder: "Your name on LinkedIn"
}, {
  key: "twitter",
  icon: "simple-icons:x",
  color: "#000000",
  label: "X",
  needsValue: true,
  prompt: "X username",
  placeholder: "username",
  value: h => String(h || "").replace(/^@/, "")
}, {
  key: "whatsapp",
  icon: "mdi:whatsapp",
  color: "#25D366",
  label: "WhatsApp",
  needsValue: true,
  editable: true,
  prompt: "WhatsApp number",
  placeholder: "+44 7700 900000",
  inputMode: "tel"
}, {
  key: "custom",
  icon: "lucide:user",
  color: "var(--brand-navy)",
  label: "Fill in the blank",
  needsValue: true,
  editable: true,
  prompt: "Fill in the blank",
  placeholder: "Say something about you",
  maxLength: 40
}, {
  key: "insights",
  icon: "lucide:bar-chart-3",
  color: "var(--brand-navy)",
  label: "Insights",
  needsValue: false
}];
function pmBannerItem(key) {
  return PM_BANNER_ITEMS.find(it => it.key === key);
}
/* What a banner row / chip shows for an item. Falls back to the item label
   for value-less banners such as Insights. */
function pmBannerText(key, conn) {
  const it = pmBannerItem(key);
  if (!it) return "";
  const raw = conn[key];
  if (!it.needsValue) return it.label;
  return it.value ? it.value(raw) : String(raw || "");
}

/* ---- Connect an account (Accounts Center–style) ----
   Adding a social banner hands off to the real network — a universal link
   opens the installed app (Instagram, Facebook, WhatsApp…) or its website —
   and when the user comes back the account is confirmed and saved to the
   profile as a connection + banner. `app` is the handoff URL, `login` what
   the second step says you did there, `def` the handle we pre-fill (a real
   OAuth return would supply it). */
const PM_CONNECT_NETWORKS = {
  instagram: {
    app: "https://www.instagram.com/",
    brand: "Instagram",
    login: "sign in to Instagram",
    what: "username",
    privacy: "Your Instagram messages and password stay private. Profinity only sees the username you choose to show.",
    def: () => pmDefaultSocialHandle("instagram")
  },
  threads: {
    app: "https://www.threads.net/",
    brand: "Threads",
    login: "sign in to Threads",
    what: "username",
    privacy: "Your Threads messages and password stay private. Profinity only sees the username you choose to show.",
    def: () => pmDefaultSocialHandle("threads")
  },
  facebook: {
    app: "https://www.facebook.com/",
    brand: "Facebook",
    login: "sign in to Facebook",
    what: "profile name",
    privacy: "Your Facebook messages, friends and password stay private. Profinity only sees your public profile name.",
    def: () => pmDefaultSocialHandle("facebook")
  },
  whatsapp: {
    app: "https://wa.me/",
    brand: "WhatsApp",
    login: "open WhatsApp",
    what: "number",
    privacy: "Your personal messages and calls on WhatsApp stay end-to-end encrypted. No one, not even Profinity, can read or listen to them.",
    contact: "Your WhatsApp number is never public without your permission and your contacts aren't shared with Profinity.",
    alert: "People who tap on your banner can message you. Your number won't show on Profinity until you confirm it in WhatsApp. Go to WhatsApp to add your banner.",
    def: () => (PM_ME.clinicNumber || "").trim() || "+44 7700 900000"
  },
  linkedin: {
    app: "https://www.linkedin.com/",
    brand: "LinkedIn",
    login: "sign in to LinkedIn",
    what: "profile name",
    privacy: "Your LinkedIn messages and connections stay private. Profinity only sees your public profile name.",
    def: () => pmDefaultSocialHandle("linkedin")
  },
  twitter: {
    app: "https://x.com/",
    brand: "X",
    login: "sign in to X",
    what: "username",
    privacy: "Your X messages and password stay private. Profinity only sees the username you choose to show.",
    def: () => pmDefaultSocialHandle("twitter")
  },
  youtube: {
    app: "https://www.youtube.com/",
    brand: "YouTube",
    login: "sign in to YouTube",
    what: "channel",
    privacy: "Your YouTube account and watch history stay private. Profinity only sees your public channel name.",
    def: () => PM_ME.name || ""
  }
};
function pmConnectNetwork(key) {
  return PM_CONNECT_NETWORKS[key] || null;
}
/* Socials already linked to this profile, for the "connected accounts" row. */
function pmConnectedSocialKeys(conn, except) {
  return Object.keys(PM_CONNECT_NETWORKS).filter(k => k !== except && conn[k]);
}
/* Resolves once the page has been backgrounded and comes back (the user
   returned from the network's app / tab). Falls back to the "I've signed in"
   button when the platform never hides the page. */
function usePMReturnFromApp(active, onReturn) {
  useEffectPM(() => {
    if (!active) return;
    let left = false;
    const startedAt = Date.now();
    const away = () => {
      left = true;
    };
    const back = () => {
      if ((left || Date.now() - startedAt > 1500) && !document.hidden) onReturn();
    };
    const vis = () => {
      if (document.hidden) away();else back();
    };
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("blur", away);
    window.addEventListener("focus", back);
    window.addEventListener("pageshow", back);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("blur", away);
      window.removeEventListener("focus", back);
      window.removeEventListener("pageshow", back);
    };
  }, [active]);
}

/* Full-screen sheet: 1) "Add an Instagram banner to this profile" with the
   Accounts Center card (new account · · · this profile + connected accounts),
   2) hand-off to the network's app, 3) confirm the account that came back. */
function PMConnectAccountScreen({
  item,
  conn,
  onDone,
  onClose
}) {
  const initialStep = (() => {
    try {
      return new URLSearchParams(window.location.search).get("step") === "confirm" ? "confirm" : "prompt";
    } catch (e) {
      return "prompt";
    }
  })();
  /* prompt  → iOS-style alert "Add Instagram to profile · Go to Instagram"
     waiting → the alert stays while the network's app is open
     confirm → Accounts Center-style screen; Confirm saves the connection */
  const net = pmConnectNetwork(item.key);
  const [step, setStep] = useStatePM(initialStep);
  const [handle, setHandle] = useStatePM(() => conn[item.key] || (net ? net.def() : ""));
  const [editing, setEditing] = useStatePM(false);
  const inputRef = React.useRef(null);
  usePMReturnFromApp(step === "waiting", () => setStep("confirm"));
  React.useEffect(() => {
    if (editing) {
      const t = setTimeout(() => {
        try {
          inputRef.current && inputRef.current.focus();
        } catch (e) {}
      }, 60);
      return () => clearTimeout(t);
    }
  }, [editing]);
  if (!net) return null;
  const others = pmConnectedSocialKeys(conn, item.key);
  const isAt = !!item.value;
  const clean = (isAt ? handle.replace(/^@+/, "") : handle).trim();
  const shown = clean ? isAt ? "@" + clean : clean : "";
  const an = /^[aeiou]/i.test(net.brand) ? "an" : "a";
  function Av({
    badgeKey,
    className
  }) {
    const bi = badgeKey ? pmBannerItem(badgeKey) : null;
    return /*#__PURE__*/React.createElement("span", {
      className: "pm-cac-av" + (className ? " " + className : "")
    }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
      name: PM_ME.name,
      src: PM_ME.avatar,
      size: 56
    }), /*#__PURE__*/React.createElement("span", {
      className: "pm-cac-badge"
    }, bi ? /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: bi.icon,
      size: 15,
      color: bi.color
    }) : /*#__PURE__*/React.createElement("b", null, "P")));
  }
  if (step !== "confirm") {
    const waiting = step === "waiting";
    return /*#__PURE__*/React.createElement("div", {
      className: "pm-cac-alert-overlay",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "pm-cac-alert",
      role: "alertdialog",
      "aria-modal": "true",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("h2", null, "Add ", net.brand, " to profile"), /*#__PURE__*/React.createElement("p", null, waiting ? /*#__PURE__*/React.createElement(React.Fragment, null, "Waiting for you to ", net.login, "… Once you've confirmed it's you, come back here to finish adding your banner.") : net.alert || /*#__PURE__*/React.createElement(React.Fragment, null, "People who see your banner can find you on ", net.brand, ". We'll open ", net.brand, " so you can confirm it's your account, then come back here to add your banner.")), waiting ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-cac-alert-go",
      onClick: () => setStep("confirm")
    }, "I've signed in to ", net.brand) : /*#__PURE__*/React.createElement("a", {
      className: "pm-cac-alert-go",
      href: net.app,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: () => setStep("waiting")
    }, "Go to ", net.brand), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-cac-alert-cancel",
      onClick: onClose
    }, "Cancel")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-cac",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Connect " + net.brand
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-cac-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 26,
    color: "var(--pm-bn-ink)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-cac-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-cac-eyebrow"
  }, "Add ", net.brand, " to Connected accounts"), /*#__PURE__*/React.createElement("h1", {
    className: "pm-cac-title"
  }, "Add ", an, " ", net.brand, " banner to this profile"), /*#__PURE__*/React.createElement("div", {
    className: "pm-cac-card"
  }, /*#__PURE__*/React.createElement("h2", null, "Connected accounts"), /*#__PURE__*/React.createElement("div", {
    className: "pm-cac-row"
  }, /*#__PURE__*/React.createElement(Av, {
    badgeKey: item.key,
    className: "new"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pm-cac-dots",
    "aria-hidden": "true"
  }, [0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("i", {
    key: i
  }))), /*#__PURE__*/React.createElement("span", {
    className: "pm-cac-stack"
  }, /*#__PURE__*/React.createElement(Av, {
    className: "me"
  }), others.map(k => /*#__PURE__*/React.createElement(Av, {
    key: k,
    badgeKey: k
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pm-cac-acct"
  }, editing ? /*#__PURE__*/React.createElement("span", {
    className: "pm-cac-input"
  }, isAt && /*#__PURE__*/React.createElement("i", {
    "aria-hidden": "true"
  }, "@"), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "text",
    value: isAt ? handle.replace(/^@+/, "") : handle,
    placeholder: item.placeholder || "",
    inputMode: item.inputMode || "text",
    autoCapitalize: isAt ? "none" : "words",
    autoCorrect: "off",
    spellCheck: false,
    onChange: e => setHandle(isAt ? e.target.value.replace(/^@+/, "") : e.target.value),
    onBlur: () => {
      if (clean) setEditing(false);
    }
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "pm-cac-acct-nm"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 14,
    color: "#25a244"
  }), shown || "Add your " + net.what), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-cac-acct-edit",
    onClick: () => setEditing(true)
  }, shown ? "Not you?" : "Add")))), /*#__PURE__*/React.createElement("ul", {
    className: "pm-cac-points"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:circle-user-round",
    size: 28,
    color: "var(--pm-bn-ink)"
  }), /*#__PURE__*/React.createElement("span", null, "Connected accounts show as banners under your bio, so people can find you on ", net.brand, " straight from your profile.")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: item.key === "whatsapp" ? "lucide:phone" : "lucide:at-sign",
    size: 28,
    color: "var(--pm-bn-ink)"
  }), /*#__PURE__*/React.createElement("span", null, net.contact || "Only the " + net.what + " you confirmed on " + net.brand + " is shown. Your " + net.brand + " password is never shared with Profinity.")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:lock",
    size: 28,
    color: "var(--pm-bn-ink)"
  }), /*#__PURE__*/React.createElement("span", null, net.privacy)))), /*#__PURE__*/React.createElement("div", {
    className: "pm-cac-foot"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-cac-fine"
  }, "We'll ", /*#__PURE__*/React.createElement("b", null, "show your ", net.brand, " ", net.what), " as a banner under your bio. You can remove it from Banners anytime."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-cac-confirm",
    disabled: !clean,
    onClick: () => onDone(clean)
  }, "Confirm"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-cac-cancel",
    onClick: onClose
  }, "Cancel")));
}
function SocialStep({
  onComplete
}) {
  /* One optional username field per network. Anything left blank simply
     isn't added; filled ones are saved as connections and appear as banners. */
  const [handles, setHandles] = useStatePM(() => {
    const conn = pmLoadSocialConnections();
    const h = {};
    PM_SOCIALS.forEach(s => {
      h[s.key] = conn[s.key] || "";
    });
    return h;
  });
  const filled = PM_SOCIALS.filter(s => (handles[s.key] || "").trim());
  function save() {
    const conn = pmLoadSocialConnections();
    PM_SOCIALS.forEach(s => {
      const v = (handles[s.key] || "").trim();
      if (v) conn[s.key] = v;else delete conn[s.key];
    });
    pmSaveJSON(PM_SOCIAL_CONN_KEY, conn);
    const banners = pmLoadBanners();
    filled.forEach(s => {
      if (!banners.includes(s.key)) banners.push(s.key);
    });
    pmSaveBanners(banners);
    onComplete();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-step"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pm-sheet-desc"
  }, "Add your username for the profiles you want to show. Leave any blank to skip it."), /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-socials"
  }, PM_SOCIALS.map(s => {
    const isName = s.key === "facebook" || s.key === "linkedin";
    const v = handles[s.key] || "";
    return /*#__PURE__*/React.createElement("label", {
      key: s.key,
      className: "pm-sheet-social" + (v.trim() ? " filled" : "")
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: s.icon,
      size: 28,
      color: s.color
    }), /*#__PURE__*/React.createElement("span", {
      className: "pm-sheet-social-nm"
    }, s.label, /*#__PURE__*/React.createElement("small", null, "Optional")), /*#__PURE__*/React.createElement("span", {
      className: "pm-sheet-social-field"
    }, !isName && /*#__PURE__*/React.createElement("span", {
      className: "pm-sheet-social-at",
      "aria-hidden": "true"
    }, "@"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: v,
      placeholder: isName ? "Profile name" : "username",
      autoCapitalize: isName ? "words" : "none",
      autoCorrect: "off",
      spellCheck: false,
      onChange: e => setHandles(prev => ({
        ...prev,
        [s.key]: e.target.value.replace(isName ? /^\s+/ : /^@+/, "")
      }))
    }), v && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-sheet-social-clear",
      "aria-label": "Clear " + s.label,
      onClick: () => setHandles(prev => ({
        ...prev,
        [s.key]: ""
      }))
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:x",
      size: 12,
      color: "#fff"
    }))));
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-sheet-cta",
    disabled: filled.length === 0,
    onClick: save
  }, filled.length === 0 ? "Add at least one profile" : "Save " + filled.length + (filled.length === 1 ? " profile" : " profiles")));
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

/* ---------------------------------------------------------------------------
   PMChipRows — location / clinic chips and social pills flow together in one
   wrapping strip, capped at `maxRows` lines. Whatever would spill onto a
   third line is folded behind a "+N" pill; tapping it shows everything.
   Measured from real layout (offsetTop per pill), so it adapts to any
   handle length or device width; `trailing` (the owner's "Add" button) is
   always kept visible after the pill.
   --------------------------------------------------------------------------- */

/* "London, United Kingdom" → "London, UK": the location chip shares its line
   with the clinic chip, so the country is always abbreviated. */
const PM_COUNTRY_ABBR = {
  "united kingdom": "UK",
  "great britain": "UK",
  "england": "UK",
  "scotland": "UK",
  "wales": "UK",
  "northern ireland": "UK",
  "united states": "USA",
  "united states of america": "USA",
  "australia": "AU",
  "canada": "CA",
  "ireland": "IE",
  "new zealand": "NZ",
  "united arab emirates": "UAE",
  "south africa": "ZA",
  "germany": "DE",
  "france": "FR",
  "spain": "ES",
  "italy": "IT",
  "netherlands": "NL",
  "singapore": "SG",
  "india": "IN",
  "pakistan": "PK",
  "philippines": "PH",
  "portugal": "PT"
};
function pmShortLocation(loc) {
  const parts = String(loc || "").split(",").map(x => x.trim()).filter(Boolean);
  if (parts.length < 2) return loc || "";
  const country = parts[parts.length - 1];
  const abbr = PM_COUNTRY_ABBR[country.toLowerCase()];
  return parts.slice(0, -1).join(", ") + ", " + (abbr || country);
}
/* Location + clinic chips pinned to one line (they shrink with an ellipsis
   instead of wrapping); rendered as a single PMChipRows item. */
function PMPlaceChips({
  location,
  clinic
}) {
  if (!location && !clinic) return null;
  return /*#__PURE__*/React.createElement("span", {
    className: "pm-chip-pair"
  }, location && /*#__PURE__*/React.createElement("span", {
    className: "pm-chip pin",
    title: location
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:map-pin",
    size: 16,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, pmShortLocation(location))), clinic && /*#__PURE__*/React.createElement("span", {
    className: "pm-chip pin",
    title: clinic
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:building-2",
    size: 16,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tx"
  }, clinic)));
}
function PMChipRows({
  children,
  maxRows = 2,
  trailing = null,
  className = ""
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  const ref = React.useRef(null);
  const [expanded, setExpanded] = useStatePM(false);
  const [visible, setVisible] = useStatePM(items.length);
  const key = items.length;
  useEffectPM(() => {
    setVisible(items.length);
  }, [key]);
  useEffectPM(() => {
    const onResize = () => {
      setVisible(items.length);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [key]);
  React.useLayoutEffect(() => {
    if (expanded) return;
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const kids = Array.from(el.children);
      // item wrappers are display:contents (no box) — measure the pill inside
      const tops = kids.map(k => (k.dataset.chipItem === "1" && k.firstElementChild ? k.firstElementChild : k).offsetTop);
      // bucket into rows with a tolerance: pills of different heights sit a
      // few px apart on the same centred line
      const rows = [];
      tops.slice().sort((a, b) => a - b).forEach(t => {
        if (!rows.length || t - rows[rows.length - 1] > 8) rows.push(t);
      });
      if (rows.length <= maxRows) return;
      const limit = rows[maxRows] - 8;
      const fitItems = kids.filter((k, i) => k.dataset.chipItem === "1" && tops[i] < limit).length;
      // leave one slot on the last allowed row for the "+N" pill
      setVisible(v => Math.min(v, Math.max(0, fitItems - 1)));
    };
    measure();
    // icons / fonts finish loading after first paint and widen the pills —
    // re-measure whenever the strip's box changes (visible only ever shrinks)
    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    }
    const t = setTimeout(measure, 400);
    return () => {
      if (ro) ro.disconnect();
      clearTimeout(t);
    };
  }, [visible, expanded, key, maxRows]);
  const shown = expanded ? items : items.slice(0, visible);
  const hidden = items.length - shown.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-chiprow " + className,
    ref: ref
  }, shown.map((it, i) => /*#__PURE__*/React.createElement("span", {
    className: "pm-chip-item",
    "data-chip-item": "1",
    key: it.key != null ? it.key : i
  }, it)), hidden > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-chip more",
    "aria-label": "Show " + hidden + " more",
    onClick: () => setExpanded(true)
  }, "+", hidden), trailing);
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

/* ---------------------------------------------------------------------------
   PMFollowedBy — Instagram-style social proof under the bio of someone
   else's profile: three overlapping avatars + "Followed by a, b and N
   others". The people are members Katy follows (mock pool below, minus the
   profile's owner), picked deterministically per profile; N comes from
   shared.mutualConnections. Names open that member's profile.
   --------------------------------------------------------------------------- */
const PM_FOLLOW_POOL = [{
  name: "Dr Tim Pearce",
  handle: "drtimpearce",
  avatar: "assets/avatar-drtim.png"
}, {
  name: "Miranda Pearce",
  handle: "mirandapearce",
  avatar: "assets/avatar-miranda.jpg"
}, {
  name: "Priya Shah",
  handle: "priyashah.aesthetics",
  avatar: "assets/avatar-priya-shah.jpg"
}, {
  name: "Nurse Beth",
  handle: "nursebeth",
  avatar: "assets/avatar-nurse-beth.jpg"
}, {
  name: "Dr Amir Khan",
  handle: "dramirkhan",
  avatar: "assets/avatar-amir-khan.jpg"
}, {
  name: "Dr. Sarah Collins",
  handle: "drsarahcollins",
  avatar: "assets/avatar-sarah-collins.jpg"
}, {
  name: "Mark Ellis",
  handle: "markellis.clinics",
  avatar: "assets/avatar-mark-ellis.jpg"
}];
function PMFollowedBy({
  user,
  from
}) {
  const total = user.shared && user.shared.mutualConnections;
  if (total == null || total < 1) return null;
  const pool = PM_FOLLOW_POOL.filter(m => m.name !== user.name);
  let h = 0;
  for (let i = 0; i < user.name.length; i++) h = h * 31 + user.name.charCodeAt(i) >>> 0;
  const start = h % pool.length;
  const picks = [0, 1, 2].map(i => pool[(start + i) % pool.length]).slice(0, Math.min(3, total));
  const named = picks.slice(0, 2);
  const others = total - named.length;
  const open = m => {
    const PL = window.PFProfileLink;
    const q = "?id=" + encodeURIComponent(PL ? PL.slug(m.name) : m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) + "&name=" + encodeURIComponent(m.name) + "&avatar=" + encodeURIComponent(m.avatar) + (from ? "&from=" + encodeURIComponent(from) : "");
    goPM("ProfileMobile.html" + q);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-followed"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-followed-avs",
    "aria-hidden": "true"
  }, picks.map(m => /*#__PURE__*/React.createElement("span", {
    className: "pm-followed-av",
    key: m.handle
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: m.name,
    src: m.avatar,
    size: 30
  })))), /*#__PURE__*/React.createElement("p", {
    className: "pm-followed-tx"
  }, "Followed by ", named.map((m, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: m.handle
  }, i > 0 && (others > 0 ? ", " : " and "), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-followed-nm",
    onClick: () => open(m)
  }, m.handle))), others > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, " and ", /*#__PURE__*/React.createElement("b", null, others, " ", others === 1 ? "other" : "others"))));
}
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

/* Tapping the message icon / Message button on someone else's profile opens
   their DM thread directly (DirectMessage.html) instead of the Messages
   overlay. Curated members (Dr Tim, Miranda…) resolve to their seeded thread
   by name; everyone else gets a fresh thread built from the name/avatar/role
   carried in the query. ?from= brings the DM's Back arrow home to this
   profile, query intact. */
function openDirectMessagePM(user) {
  const q = new URLSearchParams();
  const PL = window.PFProfileLink;
  q.set("id", user.id || (PL && PL.slug ? PL.slug(user.name) : String(user.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")));
  q.set("name", user.name);
  if (user.avatar) q.set("avatar", user.avatar);
  if (user.role) q.set("role", user.role);
  try {
    q.set("from", (window.location.pathname.split("/").pop() || "ProfileMobile.html") + (window.location.search || ""));
  } catch (e) {
    q.set("from", "ProfileMobile.html");
  }
  goPM("DirectMessage.html?" + q.toString());
}
function OtherProfileScreen({
  user,
  from
}) {
  const backTo = pmSafeReturnPM(from);
  const activeTab = pmTabForPage(from);
  const [following, setFollowing] = useStatePM(false);
  const [avatarOpen, setAvatarOpen] = useStatePM(() => {
    try {
      return new URLSearchParams(window.location.search).get("avatar") === "1";
    } catch (e) {
      return false;
    }
  });
  const [qrOpen, setQrOpen] = useStatePM(() => {
    try {
      return new URLSearchParams(window.location.search).get("qr") === "1";
    } catch (e) {
      return false;
    }
  });
  const [shareOpen, setShareOpen] = useStatePM(false);
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden
  } = useHeaderHidePM(scrollRef);
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-screen",
    "data-screen-label": "Profile — " + user.name
  }, /*#__PURE__*/React.createElement(OtherProfileTopBar, {
    name: user.name,
    onBack: () => goPM(backTo),
    onMessage: () => openDirectMessagePM(user)
  }), avatarOpen && /*#__PURE__*/React.createElement(PMAvatarViewer, {
    user: user,
    following: following,
    onToggleFollow: () => setFollowing(f => !f),
    onQr: () => {
      setAvatarOpen(false);
      setQrOpen(true);
    },
    onShare: () => {
      setAvatarOpen(false);
      setShareOpen(true);
    },
    onClose: () => setAvatarOpen(false)
  }), qrOpen && /*#__PURE__*/React.createElement(PMQrShareScreen, {
    user: user,
    link: pmProfileLinkPM(user),
    onClose: () => setQrOpen(false),
    onShare: () => setShareOpen(true)
  }), shareOpen && /*#__PURE__*/React.createElement(PMShareProfileSheet, {
    user: user,
    link: pmProfileLinkPM(user),
    onClose: () => setShareOpen(false),
    onQr: () => {
      setShareOpen(false);
      setQrOpen(true);
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-top"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-ig-avwrap pm-ig-avbtn",
    "aria-label": "View " + user.name + "'s profile picture",
    onClick: () => setAvatarOpen(true)
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
  }, user.name), user.seals && /*#__PURE__*/React.createElement(DSPM.VerificationSeals, {
    seals: user.seals,
    size: 20
  })), (user.headline || user.flag || user.role || user.specialties && user.specialties.length || user.upcomingLive || user.bio) && /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-bio"
  }, (user.headline || user.flag || user.role) && /*#__PURE__*/React.createElement("p", null, user.flag && /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, user.flag), " ", user.headline || user.role), user.specialties && user.specialties.length > 0 && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "💉"), " ", user.specialties.join(" · ")), user.upcomingLive && /*#__PURE__*/React.createElement("p", {
    className: "pm-ig-live"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:calendar",
    size: 14,
    color: "var(--text-primary)"
  })), "Upcoming Live: ", /*#__PURE__*/React.createElement("b", null, user.upcomingLive)), user.bio && /*#__PURE__*/React.createElement("p", null, user.bio)), user.link && /*#__PURE__*/React.createElement("a", {
    className: "pm-ig-link",
    href: /^https?:/.test(user.link) ? user.link : "https://" + user.link,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:link",
    size: 17,
    color: "var(--ai-purple)"
  }), user.link.replace(/^https?:\/\//, "")), /*#__PURE__*/React.createElement(PMFollowedBy, {
    user: user,
    from: from
  }), (user.location || user.clinic || user.banners && Object.keys(user.banners).length > 0) && /*#__PURE__*/React.createElement(PMChipRows, null, /*#__PURE__*/React.createElement(PMPlaceChips, {
    key: "place",
    location: user.location,
    clinic: user.clinic
  }), Object.keys(user.banners || {}).map(key => {
    const it = pmBannerItem(key);
    if (!it) return null;
    /* Static chip: the handle isn't a verified account, so it never links out. */
    return /*#__PURE__*/React.createElement("span", {
      key: key,
      className: "pm-banner static"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: it.icon,
      size: 17,
      color: it.color
    }), pmBannerText(key, user.banners));
  })), /*#__PURE__*/React.createElement("div", {
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
    onClick: () => openDirectMessagePM(user)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 16,
    color: "var(--text-heading)"
  }), "Message"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn icon",
    "aria-label": "Share profile",
    onClick: () => setShareOpen(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:share-2",
    size: 20,
    color: "var(--text-heading)"
  })))), /*#__PURE__*/React.createElement(PMActivitySummaryCard, {
    user: user
  }), /*#__PURE__*/React.createElement(PMProfessionalInfoMenu, {
    services: user.services,
    experience: user.experience,
    education: user.education,
    licenses: user.licenses,
    languages: user.languages
  })), /*#__PURE__*/React.createElement(PMTabBar, {
    compact: chromeHidden,
    active: activeTab
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
      avatar: params.get("avatar"),
      role: params.get("role"),
      from: params.get("from")
    };
  } catch (e) {
    return {
      id: null,
      name: null,
      avatar: null,
      role: null,
      from: null
    };
  }
}

/* Which footer tab the referring page (?from=<page.html?query>) belongs to. */
function pmTabForPage(from) {
  const page = String(from || "").split("?")[0].split("/").pop();
  if (!page) return "Home";
  if (/^CommunityMobile/i.test(page)) return "Community";
  if (/^(LearningMobile|Lesson|CourseDetail|MyCourses|AllCourses|Module|SubModule|CourseCheckout|MyLearning)/i.test(page)) return "Learning";
  if (/^Agent/i.test(page)) return "Agent";
  if (/^(Rewards|Leaderboard|WaysToEarn|Badge|CheckInStreak|MyRewards|RedemptionSuccess|DailyGoal)/i.test(page)) return "Rewards";
  if (/^Profile/i.test(page)) return "Profile";
  return "Home";
}
/* Only ever go back to a page inside this app (relative *.html), never to an
   arbitrary URL someone pasted into the query. */
function pmSafeReturnPM(from) {
  const f = String(from || "");
  return /^[A-Za-z0-9 _-]+\.html(\?[^\s#]*)?$/.test(f) ? f : "NewsfeedMobile.html";
}

/* Fallback profile for the seeded post/comment authors across the Newsfeed
   and Community that don't have a curated PM_OTHER_USERS entry — every post
   author is clickable, so anyone not on the curated list still lands
   somewhere real rather than a dead-end "not found" page. Deliberately
   light: explicit empty arrays (not undefined) for services/experience/
   education/licenses/languages, so PMProfessionalInfoMenu's own defaults —
   which fall back to the signed-in member's own info — never leak onto a
   stranger's profile. */
function buildMinimalProfilePM(name, avatar, role) {
  /* Deterministic per name so a member looks the same on every visit. */
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) >>> 0;
  const pick = (arr, n) => arr[(h >>> n) % arr.length];
  const place = pick([["London, United Kingdom", "Harley Street Clinic", "🇬🇧"], ["Manchester, United Kingdom", "Northern Aesthetics", "🇬🇧"], ["Leeds, United Kingdom", "Skin & Tonic Clinic", "🇬🇧"], ["Dublin, Ireland", "Liffey Aesthetics", "🇮🇪"], ["Sydney, Australia", "Harbour Skin Clinic", "🇦🇺"], ["Toronto, Canada", "Lakeside Aesthetics", "🇨🇦"], ["Edinburgh, United Kingdom", "Old Town Aesthetics", "🇬🇧"], ["Glasgow, United Kingdom", "Clyde Clinic", "🇬🇧"]], 4);
  const flag = place[2];
  const specialties = pick([["Botox", "Fillers", "Lip Enhancement"], ["Anti-Wrinkle", "Skin Boosters", "Profhilo"], ["Lip Enhancement", "Cheek Contouring"], ["Dermal Fillers", "Jawline", "Chin"], ["Toxin", "Microneedling", "Skincare"], ["Full-Face Filler", "Tear Trough"]], 7);
  const live = pick(["September 23, 2026", "October 1, 2026", "October 9, 2026", "October 21, 2026", null, null], 10);
  const handle = name.toLowerCase().replace(/^(dr|mr|mrs|ms|miss|prof)\.?\s+/, "").replace(/[^a-z0-9]/g, "");
  const first = name.split(" ").filter(w => !/^(dr|mr|mrs|ms|miss|prof)\.?$/i.test(w))[0] || name;
  const num = (base, n) => (base + (h >>> n) % base).toLocaleString("en-GB");
  return {
    name,
    avatar: avatar || undefined,
    role: role || "Aesthetic Practitioner",
    seals: ["verified"],
    flag,
    headline: role || "Aesthetic Practitioner",
    specialties,
    upcomingLive: live,
    link: handle + ".co.uk",
    banners: {
      instagram: handle,
      facebook: name
    },
    bio: first + " is a PROfinity community member sharing cases, questions and wins with fellow practitioners.",
    location: place[0],
    clinic: place[1],
    posts: num(40, 1),
    followers: num(900, 3),
    following: num(200, 5),
    shared: {
      mutualConnections: 3 + (h >>> 6) % 12,
      community: pick(["Confidence Path", "Mastery Path", "Freedom Path"], 8),
      courses: pick([[], ["Botox Foundations"], ["8D Lip Design"], ["Temple Filler", "Protox Course"]], 9)
    },
    activity: {
      lastActive: pick(["Just now", "1h ago", "3h ago", "Yesterday"], 11),
      highlights: [{
        icon: "lucide:file-text",
        text: "Posted in the community",
        time: "This week"
      }, {
        icon: "lucide:thumbs-up",
        text: "Liked one of your posts",
        time: "2d"
      }]
    },
    services: specialties.slice(0, 2).map(t => ({
      ti: t,
      su: "Career Academy: Dr Tim Pearce"
    })),
    experience: [{
      ti: role || "Aesthetic Practitioner",
      yrs: 3 + (h >>> 12) % 12 + " years",
      org: place[1],
      loc: place[0]
    }],
    education: [],
    licenses: pick([["Botox Foundations"], ["8D Lips Course"], ["Anatomy360", "Botox Foundations"], []], 13),
    languages: [{
      flag: "🇬🇧",
      name: "English",
      level: "Primary"
    }]
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

/* ---- Full-page profile editor (opened from "Edit Profile") ----
   Instagram-style settings sheet: centred avatar with an "Edit picture"
   link, then label | value rows whose hairline dividers run under the value
   column only, grouped under bold section titles. The field set is the
   finalised one from the earlier card layout — only the presentation moved.
   Save lives in the header (IG "Done" slot); the back chevron cancels. */
function useAutoGrowPM(ref, value) {
  useEffectPM(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.max(22, el.scrollHeight) + "px";
  }, [value]);
}
function PMEditRow({
  label,
  value,
  onChange,
  options,
  placeholder,
  multiline,
  stack,
  inputMode,
  className
}) {
  const taRef = React.useRef(null);
  useAutoGrowPM(taRef, multiline ? value : null);
  const cls = "pm-edit-row" + (options ? " pick" : "") + (multiline ? " multi" : "") + (stack ? " stack" : "") + (className ? " " + className : "");
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-edit-row-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-row-val"
  }, options ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "pm-edit-row-text"
  }, value), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("select", {
    className: "pm-edit-row-select",
    "aria-label": label,
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o)))) : multiline ? /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    rows: 1,
    className: "pm-edit-row-input",
    value: value,
    placeholder: placeholder || label,
    onChange: e => onChange(e.target.value)
  }) : /*#__PURE__*/React.createElement("input", {
    type: "text",
    inputMode: inputMode,
    className: "pm-edit-row-input",
    value: value,
    placeholder: placeholder || label,
    onChange: e => onChange(e.target.value)
  })));
}

/* ---- Banners (Edit profile → Banners) ----
   Instagram-style: "On your profile" lists the banners shown under the bio
   (drag handle to reorder, pencil on items with their own text, × to
   remove); "Add to profile" lists everything else. Items that need text
   (a handle, channel name, phone number) open a small sheet first. */
function PMBannerValueSheet({
  item,
  initial,
  onSave,
  onClose
}) {
  const [val, setVal] = useStatePM(initial || "");
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        inputRef.current && inputRef.current.focus();
      } catch (e) {}
    }, 120);
    return () => clearTimeout(t);
  }, []);
  const clean = val.trim();
  function submit(e) {
    e && e.preventDefault();
    if (!clean) return;
    onSave(clean);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-overlay pm-bnv-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("form", {
    className: "pm-sheet pm-bnv",
    onClick: e => e.stopPropagation(),
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-drag"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-bnv-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-bnv-ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: item.icon,
    size: 26,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("h2", null, item.prompt || item.label)), /*#__PURE__*/React.createElement("div", {
    className: "pm-bnv-field"
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "text",
    value: val,
    placeholder: item.placeholder || "",
    maxLength: item.maxLength || 80,
    inputMode: item.inputMode || "text",
    autoCapitalize: item.key === "custom" ? "sentences" : "none",
    autoCorrect: "off",
    spellCheck: false,
    onChange: e => setVal(e.target.value)
  }), val && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-bnv-clear",
    "aria-label": "Clear",
    onClick: () => setVal("")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 14,
    color: "#fff"
  }))), item.key === "custom" && /*#__PURE__*/React.createElement("p", {
    className: "pm-bnv-hint"
  }, "A short line that shows as a banner under your bio."), /*#__PURE__*/React.createElement("div", {
    className: "pm-bnv-acts"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-bnv-cancel",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "pm-bnv-save",
    disabled: !clean
  }, initial ? "Save" : "Add"))));
}
function PMBannersScreen({
  onBack
}) {
  const [banners, setBanners] = useStatePM(() => pmLoadBanners());
  const [conn, setConn] = useStatePM(() => pmLoadSocialConnections());
  const [dragKey, setDragKey] = useStatePM(null);
  const [sheet, setSheet] = useStatePM(null); /* { key, mode: "add" | "edit" } */
  const listRef = React.useRef(null);
  const dragRef = React.useRef(null);
  function commit(next) {
    setBanners(next);
    pmSaveBanners(next);
  }
  function remove(key) {
    commit(banners.filter(k => k !== key));
  }
  function saveValue(key, value) {
    const next = {
      ...pmLoadSocialConnections(),
      [key]: value
    };
    pmSaveJSON(PM_SOCIAL_CONN_KEY, next);
    setConn(next);
  }
  /* ?connect=instagram(&step=confirm) opens the connect flow straight away — demo / QA entry. */
  const [connect, setConnect] = useStatePM(() => {
    try {
      const k = new URLSearchParams(window.location.search).get("connect");
      return k && pmConnectNetwork(k) ? k : null;
    } catch (e) {
      return null;
    }
  }); /* banner key being connected via its app */
  function add(key) {
    const it = pmBannerItem(key);
    if (!it || banners.includes(key)) return;
    if (pmConnectNetwork(key)) {
      setConnect(key);
      return;
    }
    if (it.needsValue && !conn[key]) {
      setSheet({
        key,
        mode: "add"
      });
      return;
    }
    commit([...banners, key]);
  }
  function onSheetSave(value) {
    if (!sheet) return;
    saveValue(sheet.key, value);
    if (sheet.mode === "add" && !banners.includes(sheet.key)) commit([...banners, sheet.key]);else try {
      window.dispatchEvent(new CustomEvent("pf-banners-changed"));
    } catch (e) {}
    setSheet(null);
  }
  function onConnected(value) {
    if (!connect) return;
    saveValue(connect, value);
    if (!banners.includes(connect)) commit([...banners, connect]);else try {
      window.dispatchEvent(new CustomEvent("pf-banners-changed"));
    } catch (e) {}
    setConnect(null);
  }
  function onHandleDown(e, key) {
    const row = e.currentTarget.closest(".pm-bn-row");
    if (!row) return;
    e.preventDefault();
    const rowH = row.getBoundingClientRect().height || 56;
    dragRef.current = {
      key,
      startY: e.clientY,
      rowH,
      list: banners.slice()
    };
    setDragKey(key);
    const move = ev => {
      const d = dragRef.current;
      if (!d) return;
      const from = d.list.indexOf(d.key);
      const delta = Math.round((ev.clientY - d.startY) / d.rowH);
      const to = Math.max(0, Math.min(d.list.length - 1, from + delta));
      if (to !== from) {
        const next = d.list.slice();
        next.splice(from, 1);
        next.splice(to, 0, d.key);
        d.list = next;
        d.startY += (to - from) * d.rowH;
        setBanners(next);
      }
    };
    const up = () => {
      const d = dragRef.current;
      dragRef.current = null;
      setDragKey(null);
      if (d) pmSaveBanners(d.list);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }
  const addable = PM_BANNER_ITEMS.filter(it => !banners.includes(it.key));
  const sheetItem = sheet ? pmBannerItem(sheet.key) : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-screen pm-bn-screen",
    "data-screen-label": "Banners"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pm-edit-hd"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-edit-back",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--pm-bn-ink)"
  })), /*#__PURE__*/React.createElement("h1", null, "Banners"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-body"
  }, /*#__PURE__*/React.createElement("section", {
    className: "pm-bn-sec"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "pm-bn-title"
  }, "On your profile"), banners.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "pm-bn-empty"
  }, "Nothing on your profile yet. Add something below and it shows up under your bio."), /*#__PURE__*/React.createElement("div", {
    className: "pm-bn-list",
    ref: listRef
  }, banners.map(key => {
    const it = pmBannerItem(key);
    if (!it) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      className: "pm-bn-row" + (dragKey === key ? " dragging" : "")
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-bn-handle",
      "aria-label": "Reorder " + it.label,
      onPointerDown: e => onHandleDown(e, key)
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:menu",
      size: 24,
      color: "var(--pm-bn-ink)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "pm-bn-ic"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: it.icon,
      size: 26,
      color: "var(--pm-bn-ink)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "pm-bn-nm"
    }, pmBannerText(key, conn)), it.editable && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-bn-x pm-bn-edit",
      "aria-label": "Edit " + it.label,
      onClick: () => setSheet({
        key,
        mode: "edit"
      })
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:pencil",
      size: 22,
      color: "var(--pm-bn-ink)"
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-bn-x",
      "aria-label": "Remove " + it.label,
      onClick: () => remove(key)
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:x",
      size: 24,
      color: "var(--pm-bn-ink)"
    })));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-bn-band"
  }), /*#__PURE__*/React.createElement("section", {
    className: "pm-bn-sec"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "pm-bn-title"
  }, "Add to profile"), addable.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "pm-bn-empty"
  }, "Everything is already on your profile."), /*#__PURE__*/React.createElement("div", {
    className: "pm-bn-list"
  }, addable.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.key,
    type: "button",
    className: "pm-bn-row add",
    onClick: () => add(it.key)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-bn-handle"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:circle-plus",
    size: 24,
    color: "var(--pm-bn-ink)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-bn-ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: it.icon,
    size: 26,
    color: "var(--pm-bn-ink)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-bn-nm"
  }, it.label)))))), sheetItem && /*#__PURE__*/React.createElement(PMBannerValueSheet, {
    item: sheetItem,
    initial: sheet.mode === "edit" ? conn[sheet.key] || "" : conn[sheet.key] || "",
    onSave: onSheetSave,
    onClose: () => setSheet(null)
  }), connect && pmBannerItem(connect) && /*#__PURE__*/React.createElement(PMConnectAccountScreen, {
    item: pmBannerItem(connect),
    conn: conn,
    onDone: onConnected,
    onClose: () => setConnect(null)
  }));
}

/* One Personal Goal question: numbered badge (tick once answered), the
   question as a heading, and a soft rounded answer box that grows as you
   type. */
function PMGoalField({
  index,
  question,
  value,
  onChange
}) {
  const taRef = React.useRef(null);
  useAutoGrowPM(taRef, value);
  const answered = !!(value && value.trim());
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-goal-card" + (answered ? " answered" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-goal-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-goal-num",
    "aria-hidden": "true"
  }, answered ? /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 15,
    color: "#fff"
  }) : index + 1), /*#__PURE__*/React.createElement("label", {
    className: "pm-goal-q",
    htmlFor: "pm-goal-" + index
  }, question)), /*#__PURE__*/React.createElement("div", {
    className: "pm-goal-box"
  }, /*#__PURE__*/React.createElement("textarea", {
    id: "pm-goal-" + index,
    ref: taRef,
    rows: 2,
    className: "pm-goal-input",
    value: value,
    placeholder: "Write your answer…",
    onChange: e => onChange(e.target.value)
  })));
}
function PMEditProfileScreen({
  profile,
  onCancel,
  onSave,
  openBanners
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
  const [avatar, setAvatar] = useStatePM(profile.avatar || "");
  const [bannersOpen, setBannersOpen] = useStatePM(() => {
    if (openBanners) return true;
    try {
      return new URLSearchParams(window.location.search).get("banners") === "1";
    } catch (e) {
      return false;
    }
  });
  const [bannerCount, setBannerCount] = useStatePM(() => pmLoadBanners().length);
  const fileRef = React.useRef(null);
  function setField(key) {
    return value => setForm(f => ({
      ...f,
      [key]: value
    }));
  }
  function setGoalAt(i, value) {
    setGoals(g => g.map((v, gi) => gi === i ? value : v));
  }
  function pickAvatar(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      setAvatar(URL.createObjectURL(f));
    } catch (err) {}
    e.target.value = "";
  }
  function handleSave() {
    const patch = {
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
    };
    if (avatar && avatar !== profile.avatar) patch.avatar = avatar;
    onSave(patch);
  }
  if (bannersOpen) {
    return /*#__PURE__*/React.createElement(PMBannersScreen, {
      onBack: () => {
        setBannersOpen(false);
        setBannerCount(pmLoadBanners().length);
      }
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
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("h1", null, "Edit profile"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-edit-done",
    onClick: handleSave
  }, "Save")), /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-edit-avblock"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-edit-avbtn",
    "aria-label": "Edit profile picture",
    onClick: () => fileRef.current && fileRef.current.click()
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: form.fullName || profile.name,
    src: avatar,
    size: 96
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-edit-avlink",
    onClick: () => fileRef.current && fileRef.current.click()
  }, "Edit Profile"), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    hidden: true,
    onChange: pickAvatar
  })), /*#__PURE__*/React.createElement("section", {
    className: "pm-edit-group"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "pm-edit-group-title"
  }, "Public Profile Information"), /*#__PURE__*/React.createElement(PMEditRow, {
    label: "Title",
    value: form.title,
    onChange: setField("title"),
    options: PM_TITLE_OPTIONS
  }), /*#__PURE__*/React.createElement(PMEditRow, {
    label: "Full Name",
    value: form.fullName,
    onChange: setField("fullName")
  }), /*#__PURE__*/React.createElement(PMEditRow, {
    label: "Tell us about yourself",
    multiline: true,
    className: "pm-edit-row-bio",
    value: form.bio,
    onChange: setField("bio"),
    placeholder: "Tell us about yourself"
  }), /*#__PURE__*/React.createElement(PMEditRow, {
    label: "Primary Specialty",
    value: form.specialty,
    onChange: setField("specialty")
  }), /*#__PURE__*/React.createElement(PMEditRow, {
    label: "Clinic Name",
    value: form.clinic,
    onChange: setField("clinic")
  }), /*#__PURE__*/React.createElement(PMEditRow, {
    label: "Clinic Number",
    inputMode: "tel",
    value: form.clinicNumber,
    onChange: setField("clinicNumber")
  }), /*#__PURE__*/React.createElement(PMEditRow, {
    label: "Clinic Address",
    multiline: true,
    value: form.clinicAddress,
    onChange: setField("clinicAddress")
  }), /*#__PURE__*/React.createElement(PMEditRow, {
    label: "Years of Experience",
    inputMode: "numeric",
    value: form.yearsExperience,
    onChange: setField("yearsExperience")
  })), /*#__PURE__*/React.createElement("section", {
    className: "pm-edit-group"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-edit-navrow",
    onClick: () => setBannersOpen(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-edit-navrow-txt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-edit-navrow-lb"
  }, "Banners"), /*#__PURE__*/React.createElement("span", {
    className: "pm-edit-navrow-sub"
  }, "Show your connected social profiles.")), bannerCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "pm-edit-navrow-count"
  }, bannerCount), /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("section", {
    className: "pm-edit-group pm-goalsec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-goalsec-hd"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "pm-edit-group-title"
  }, "Personal Goal"), /*#__PURE__*/React.createElement("p", {
    className: "pm-goalsec-sub"
  }, "A few reflections so Ava can shape your goals around what matters to you.", /*#__PURE__*/React.createElement("span", {
    className: "pm-goalsec-count"
  }, goals.filter(g => g && g.trim()).length, " of ", PM_PERSONAL_GOAL_QUESTIONS.length, " answered"))), /*#__PURE__*/React.createElement("div", {
    className: "pm-goal-list"
  }, PM_PERSONAL_GOAL_QUESTIONS.map((q, i) => /*#__PURE__*/React.createElement(PMGoalField, {
    key: i,
    index: i,
    question: q,
    value: goals[i],
    onChange: v => setGoalAt(i, v)
  }))))));
}

/* ---- Share profile sheet (avatar viewer "Share" / ?share=1) ----
   Bottom sheet: profile preview, "Share to Newsfeed" composer that drops a
   post into the same pf-newsfeed-user-posts handoff CreatePostMobile uses,
   then a rail of outside destinations (Messages, WhatsApp, Facebook, X,
   LinkedIn, Email, Copy link, QR code, More = OS share sheet). */
const PM_SHARE_TARGETS = [{
  k: "messages",
  label: "Messages",
  icon: "lucide:message-circle",
  color: "var(--brand-navy)",
  bg: "var(--surface-sunken)"
}, {
  k: "copy",
  label: "Copy link",
  icon: "lucide:link",
  color: "var(--brand-navy)",
  bg: "var(--surface-sunken)"
}, {
  k: "whatsapp",
  label: "WhatsApp",
  icon: "mdi:whatsapp",
  color: "#fff",
  bg: "#25D366"
}, {
  k: "facebook",
  label: "Facebook",
  icon: "mdi:facebook",
  color: "#fff",
  bg: "#1877F2"
}, {
  k: "twitter",
  label: "X",
  icon: "mdi:twitter",
  color: "#fff",
  bg: "#111"
}, {
  k: "linkedin",
  label: "LinkedIn",
  icon: "mdi:linkedin",
  color: "#fff",
  bg: "#0A66C2"
}, {
  k: "email",
  label: "Email",
  icon: "lucide:mail",
  color: "var(--brand-navy)",
  bg: "var(--surface-sunken)"
}, {
  k: "qr",
  label: "QR code",
  icon: "lucide:qr-code",
  color: "var(--brand-navy)",
  bg: "var(--surface-sunken)"
}, {
  k: "more",
  label: "More",
  icon: "lucide:ellipsis",
  color: "var(--brand-navy)",
  bg: "var(--surface-sunken)"
}];
function PMShareProfileSheet({
  user,
  own,
  link,
  onClose,
  onQr
}) {
  const [caption, setCaption] = useStatePM(() => own ? "Find me on PROfinity — follow along for aesthetics tips, lives and course notes." : "Check out " + user.name + " on PROfinity.");
  const [toast, setToast] = useStatePM("");
  const [posted, setPosted] = useStatePM(false);
  const handle = pmHandleFor(user);
  const shareText = (own ? "Follow " + PM_ME.name : user.name) + " on PROfinity " + handle;
  useEffectPM(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffectPM(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);
  function copyLink() {
    const done = () => setToast("Link copied");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, done);else done();
  }
  function openOut(url) {
    try {
      window.open(url, "_blank", "noopener");
    } catch (e) {
      window.location.href = url;
    }
  }
  function go(k) {
    const u = encodeURIComponent(link),
      t = encodeURIComponent(shareText);
    switch (k) {
      case "messages":
        goPM("Messages.html?share=" + u);
        return;
      case "copy":
        copyLink();
        return;
      case "whatsapp":
        openOut("https://wa.me/?text=" + t + "%20" + u);
        return;
      case "facebook":
        openOut("https://www.facebook.com/sharer/sharer.php?u=" + u);
        return;
      case "twitter":
        openOut("https://twitter.com/intent/tweet?text=" + t + "&url=" + u);
        return;
      case "linkedin":
        openOut("https://www.linkedin.com/sharing/share-offsite/?url=" + u);
        return;
      case "email":
        window.location.href = "mailto:?subject=" + t + "&body=" + t + "%0A" + u;
        return;
      case "qr":
        onQr && onQr();
        return;
      case "more":
        if (navigator.share) {
          navigator.share({
            title: user.name,
            text: shareText,
            url: link
          }).catch(() => {});
        } else copyLink();
        return;
      default:
        return;
    }
  }
  function postToFeed() {
    if (posted) return;
    const body = caption.trim();
    const post = {
      id: "u" + Date.now(),
      author: {
        name: PM_ME.name,
        avatar: PM_ME.avatar,
        seals: ["gb", "verified"]
      },
      time: "Just now",
      hashtags: [],
      media: [],
      body,
      bg: null,
      video: null,
      live: false,
      sharedProfile: {
        name: user.name,
        role: user.role || "",
        avatar: user.avatar || "",
        handle,
        link
      },
      likes: "0",
      comments: "0",
      shares: "0",
      commentList: []
    };
    try {
      const existing = JSON.parse(localStorage.getItem("pf-newsfeed-user-posts")) || [];
      localStorage.setItem("pf-newsfeed-user-posts", JSON.stringify([post, ...existing]));
      sessionStorage.setItem("pf-post-reward", JSON.stringify({
        amount: 75,
        label: "Shared a profile",
        actionId: "evt_create_post",
        ts: Date.now()
      }));
    } catch (e) {}
    setPosted(true);
    setToast("Shared to your Newsfeed");
    setTimeout(() => goPM("NewsfeedMobile.html"), 700);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-overlay pm-shp-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet pm-shp",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Share profile",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sheet-drag"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-shp-hd"
  }, /*#__PURE__*/React.createElement("h3", null, "Share profile"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-shp-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--text-heading)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-shp-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-shp-card"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: user.name,
    src: user.avatar,
    size: 52
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-shp-card-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, user.name), /*#__PURE__*/React.createElement("span", {
    className: "rl"
  }, user.role || "PROfinity member"), /*#__PURE__*/React.createElement("span", {
    className: "hd"
  }, handle)), /*#__PURE__*/React.createElement("span", {
    className: "pm-shp-card-badge"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: ""
  }))), /*#__PURE__*/React.createElement("section", {
    className: "pm-shp-feed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-shp-feed-hd"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-shp-feed-ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:rss",
    size: 17,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Share to Newsfeed"), /*#__PURE__*/React.createElement("i", null, "Posts a link card to everyone who follows you"))), /*#__PURE__*/React.createElement("textarea", {
    className: "pm-shp-caption",
    rows: 2,
    value: caption,
    placeholder: "Say something about this profile…",
    onChange: e => setCaption(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-shp-post" + (posted ? " done" : ""),
    onClick: postToFeed,
    disabled: posted
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: posted ? "lucide:check" : "lucide:send",
    size: 17,
    color: "#fff"
  }), posted ? "Shared" : "Post to Newsfeed")), /*#__PURE__*/React.createElement("div", {
    className: "pm-shp-sec-lb"
  }, "Share to"), /*#__PURE__*/React.createElement("div", {
    className: "pm-shp-rail"
  }, PM_SHARE_TARGETS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    type: "button",
    className: "pm-shp-tile",
    onClick: () => go(t.k)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-shp-tile-ic",
    style: {
      background: t.bg
    }
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: t.icon,
    size: 24,
    color: t.color
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-shp-tile-lb"
  }, t.label))))), toast && /*#__PURE__*/React.createElement("div", {
    className: "pm-shp-toast",
    role: "status"
  }, toast)));
}

/* ---- Profile QR share screen (Share Profile / QR code action) ----
   IG-style QR card: dot-style modules, rounded finder corners, PROfinity P
   mark in the centre (error correction H so the covered modules recover),
   handle underneath, then Share profile / Copy link / Download tiles. */
const PM_QR_LOGO = "assets/profinity-icon-purple-gold.png";
function pmBuildQrSvg(text, logoHref) {
  if (typeof window.qrcode !== "function") return "";
  let qr;
  try {
    qr = window.qrcode(0, "H");
    qr.addData(text);
    qr.make();
  } catch (e) {
    return "";
  }
  const n = qr.getModuleCount(),
    cell = 10,
    size = n * cell;
  const logoCells = Math.max(7, Math.round(n * 0.26));
  const l0 = Math.floor((n - logoCells) / 2),
    l1 = l0 + logoCells;
  const inFinder = (r, c) => r < 7 && c < 7 || r < 7 && c >= n - 7 || r >= n - 7 && c < 7;
  const inLogo = (r, c) => r >= l0 && r < l1 && c >= l0 && c < l1;
  const dots = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!qr.isDark(r, c) || inFinder(r, c) || inLogo(r, c)) continue;
    dots.push(`<circle cx="${(c + .5) * cell}" cy="${(r + .5) * cell}" r="${cell * .45}"/>`);
  }
  const finder = (x, y) => {
    const o = cell * 0.5;
    return `<rect x="${x * cell + o}" y="${y * cell + o}" width="${6 * cell}" height="${6 * cell}" rx="${cell * 1.9}" fill="none" stroke="#111" stroke-width="${cell}"/>` + `<rect x="${(x + 2) * cell}" y="${(y + 2) * cell}" width="${3 * cell}" height="${3 * cell}" rx="${cell * .9}" fill="#111"/>`;
  };
  const lp = (l1 - l0) * cell,
    lx = l0 * cell,
    pad = cell * .6;
  const logo = `<rect x="${lx}" y="${lx}" width="${lp}" height="${lp}" rx="${cell * 1.6}" fill="#fff"/>` + `<image href="${logoHref}" x="${lx + pad}" y="${lx + pad}" width="${lp - pad * 2}" height="${lp - pad * 2}" preserveAspectRatio="xMidYMid meet"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="geometricPrecision"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#111">${dots.join("")}</g>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}${logo}</svg>`;
}
function pmHandleFor(user) {
  const ig = user && user.instagram && String(user.instagram).trim();
  if (ig) return ig.startsWith("@") ? ig : "@" + ig;
  return "@" + String(user && user.name || "profile").toLowerCase().replace(/[^a-z0-9]/g, "");
}
function PMQrShareScreen({
  user,
  link,
  onClose,
  onShare
}) {
  const [toast, setToast] = useStatePM("");
  const svg = React.useMemo(() => pmBuildQrSvg(link, PM_QR_LOGO), [link]);
  const handle = pmHandleFor(user);
  useEffectPM(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffectPM(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);
  function copyLink() {
    const done = () => setToast("Link copied");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, done);else done();
  }
  function share() {
    /* Opens the Share profile sheet (Newsfeed + social destinations) over the QR card. */
    if (onShare) {
      onShare();
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: user.name,
        url: link
      }).catch(() => {});
      return;
    }
    copyLink();
  }
  async function download() {
    if (!svg) {
      setToast("QR not ready");
      return;
    }
    try {
      /* Inline the logo so the SVG rasterises with it (external hrefs are
         dropped when an SVG is painted through <img> → canvas). */
      const blob = await fetch(PM_QR_LOGO).then(r => r.blob());
      const dataUrl = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = rej;
        fr.readAsDataURL(blob);
      });
      const inlined = svg.replace(PM_QR_LOGO, dataUrl);
      const img = new Image();
      const url = URL.createObjectURL(new Blob([inlined], {
        type: "image/svg+xml"
      }));
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = url;
      });
      const S = 1080,
        cv = document.createElement("canvas");
      cv.width = S;
      cv.height = S + 160;
      const ctx = cv.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 90, 60, S - 180, S - 180);
      ctx.fillStyle = "#111";
      ctx.font = "600 48px Poppins, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(handle.toUpperCase(), S / 2, S + 60);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = handle.replace(/^@/, "") + "-profinity-qr.png";
      a.href = cv.toDataURL("image/png");
      a.click();
      setToast("Saved");
    } catch (e) {
      const a = document.createElement("a");
      a.download = handle.replace(/^@/, "") + "-profinity-qr.svg";
      a.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      a.click();
    }
  }
  return pmScreenPortal(/*#__PURE__*/React.createElement("div", {
    className: "pm-qrs",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Profile QR code"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pm-qrs-hd"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-qrs-round",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 26,
    color: "var(--pm-qr-ink)"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "pm-qrs-title"
  }, "Share Profile"), /*#__PURE__*/React.createElement("span", {
    className: "pm-qrs-round pm-qrs-spacer",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-qrs-mid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-qrs-card"
  }, svg ? /*#__PURE__*/React.createElement("div", {
    className: "pm-qrs-code",
    dangerouslySetInnerHTML: {
      __html: svg
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "pm-qrs-code pm-qrs-code-fallback"
  }, link), /*#__PURE__*/React.createElement("div", {
    className: "pm-qrs-handle"
  }, handle)), /*#__PURE__*/React.createElement("div", {
    className: "pm-qrs-tiles"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-qrs-tile",
    onClick: share
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:share",
    size: 28,
    color: "var(--pm-qr-ink)"
  }), /*#__PURE__*/React.createElement("span", null, "Share profile")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-qrs-tile",
    onClick: copyLink
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:link",
    size: 28,
    color: "var(--pm-qr-ink)"
  }), /*#__PURE__*/React.createElement("span", null, "Copy link")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-qrs-tile",
    onClick: download
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:download",
    size: 28,
    color: "var(--pm-qr-ink)"
  }), /*#__PURE__*/React.createElement("span", null, "Download")))), toast && /*#__PURE__*/React.createElement("div", {
    className: "pm-avv-toast pm-qrs-toast",
    role: "status"
  }, toast)));
}

/* ---- Profile picture viewer (tap the avatar on a profile) ----
   IG-style: the profile stays underneath, heavily blurred; the photo sits
   large and round in the middle with a round action row pinned to the
   bottom. Own profile gets a pencil badge + "Edit avatar" (both open the
   file picker); someone else's profile gets Follow/Following instead. */
function pmProfileLinkPM(user) {
  try {
    const u = new URL(window.location.href);
    if (user && user.id) {
      u.searchParams.set("id", user.id);
    }
    return u.origin + u.pathname + (u.search || "");
  } catch (e) {
    return window.location.href;
  }
}
function PMAvatarViewer({
  user,
  own,
  following,
  onToggleFollow,
  onChangeAvatar,
  onQr,
  onShare,
  onClose
}) {
  const [toast, setToast] = useStatePM("");
  const fileRef = React.useRef(null);
  const link = pmProfileLinkPM(own ? null : user);
  useEffectPM(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffectPM(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);
  function copyLink() {
    const done = () => setToast("Link copied");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, done);else done();
  }
  function share() {
    if (onShare) {
      onShare();
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: user.name,
        url: link
      }).catch(() => {});
      return;
    }
    copyLink();
  }
  function pick(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      onChangeAvatar && onChangeAvatar(URL.createObjectURL(f));
    } catch (err) {}
    e.target.value = "";
  }
  const openPicker = () => fileRef.current && fileRef.current.click();
  const actions = own ? [{
    key: "share",
    label: "Share",
    icon: "lucide:circle-user-round",
    onClick: share
  }, {
    key: "copy",
    label: "Copy link",
    icon: "lucide:link",
    onClick: copyLink
  }, {
    key: "qr",
    label: "QR code",
    icon: "lucide:qr-code",
    onClick: () => onQr && onQr()
  }, {
    key: "edit",
    label: "Edit avatar",
    icon: "lucide:smile",
    onClick: openPicker
  }] : [{
    key: "follow",
    label: following ? "Following" : "Follow",
    icon: following ? "lucide:user-round-check" : "lucide:user-round-plus",
    onClick: onToggleFollow,
    active: following
  }, {
    key: "share",
    label: "Share",
    icon: "lucide:circle-user-round",
    onClick: share
  }, {
    key: "copy",
    label: "Copy link",
    icon: "lucide:link",
    onClick: copyLink
  }, {
    key: "qr",
    label: "QR code",
    icon: "lucide:qr-code",
    onClick: () => onQr && onQr()
  }];
  return pmScreenPortal(/*#__PURE__*/React.createElement("div", {
    className: "pm-avv",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": user.name + " profile picture",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-avv-photo",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: user.name,
    src: user.avatar,
    size: 300,
    className: "pm-avv-img"
  }), own && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-avv-pencil",
    "aria-label": "Change profile picture",
    onClick: openPicker
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:pencil",
    size: 22,
    color: "var(--text-heading)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pm-avv-actions",
    onClick: e => e.stopPropagation()
  }, actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.key,
    type: "button",
    className: "pm-avv-act" + (a.active ? " on" : ""),
    onClick: a.onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-avv-act-ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: a.icon,
    size: 28,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pm-avv-act-lb"
  }, a.label)))), own && /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    hidden: true,
    onChange: pick
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "pm-avv-toast",
    role: "status"
  }, toast)));
}
function PMScreen() {
  const [profile, setProfile] = useStatePM(() => ({
    ...PM_ME
  }));
  const m = profile;
  const [msgOpen, setMsgOpen] = useStatePM(false);
  const [menuOpen, setMenuOpen] = useStatePM(false);
  const [editOpen, setEditOpen] = useStatePM(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      return q.get("edit") === "1" || q.get("banners") === "1";
    } catch (e) {
      return false;
    }
  });
  const [editBanners, setEditBanners] = useStatePM(false);
  const [avatarOpen, setAvatarOpen] = useStatePM(() => {
    try {
      return new URLSearchParams(window.location.search).get("avatar") === "1";
    } catch (e) {
      return false;
    }
  });
  const [qrOpen, setQrOpen] = useStatePM(() => {
    try {
      return new URLSearchParams(window.location.search).get("qr") === "1";
    } catch (e) {
      return false;
    }
  });
  const [shareOpen, setShareOpen] = useStatePM(() => {
    try {
      return new URLSearchParams(window.location.search).get("share") === "1";
    } catch (e) {
      return false;
    }
  });
  const [assessState, setAssessState] = useStatePM(() => pmLoadAssessState());
  const scrollRef = React.useRef(null);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useHeaderHidePM(scrollRef);
  const [banners, setBanners] = useStatePM(() => pmLoadBanners());
  const socialConn = React.useMemo(() => pmLoadSocialConnections(), [banners, editOpen]);
  useEffectPM(() => {
    const sync = () => setBanners(pmLoadBanners());
    window.addEventListener("pf-banners-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pf-banners-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
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
      openBanners: editBanners,
      onCancel: () => {
        setEditOpen(false);
        setEditBanners(false);
      },
      onSave: u => {
        saveProfileEdits(u);
        setEditBanners(false);
      }
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : ""),
    "data-screen-label": "Profile (mobile)"
  }, /*#__PURE__*/React.createElement(PMTopBar, {
    onMenu: () => setMenuOpen(true),
    onMessages: () => setMsgOpen(true)
  }), avatarOpen && /*#__PURE__*/React.createElement(PMAvatarViewer, {
    user: m,
    own: true,
    onClose: () => setAvatarOpen(false),
    onQr: () => {
      setAvatarOpen(false);
      setQrOpen(true);
    },
    onShare: () => {
      setAvatarOpen(false);
      setShareOpen(true);
    },
    onChangeAvatar: src => {
      setProfile(prev => ({
        ...prev,
        avatar: src
      }));
    }
  }), qrOpen && /*#__PURE__*/React.createElement(PMQrShareScreen, {
    user: m,
    link: pmProfileLinkPM(null),
    onClose: () => setQrOpen(false),
    onShare: () => setShareOpen(true)
  }), shareOpen && /*#__PURE__*/React.createElement(PMShareProfileSheet, {
    user: m,
    own: true,
    link: pmProfileLinkPM(null),
    onClose: () => setShareOpen(false),
    onQr: () => {
      setShareOpen(false);
      setQrOpen(true);
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-scroll",
    ref: scrollRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-top"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pm-ig-avwrap pm-ig-avbtn",
    "aria-label": "View profile picture",
    onClick: () => setAvatarOpen(true)
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
  }), "allcaremedical.co.uk"), /*#__PURE__*/React.createElement(PMChipRows, {
    trailing: /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pm-chip add",
      onClick: () => {
        setEditBanners(true);
        setEditOpen(true);
      }
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: "lucide:plus",
      size: 16,
      color: "var(--gray-500)"
    }), "Add")
  }, /*#__PURE__*/React.createElement(PMPlaceChips, {
    key: "place",
    location: m.location,
    clinic: m.clinic
  }), banners.map(key => {
    const it = pmBannerItem(key);
    if (!it) return null;
    /* Static chip: the handle isn't a verified account, so it never links out. */
    return /*#__PURE__*/React.createElement("span", {
      key: key,
      className: "pm-banner static"
    }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
      name: it.icon,
      size: 17,
      color: it.color
    }), pmBannerText(key, socialConn));
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn",
    onClick: () => setEditOpen(true)
  }, "Edit Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn",
    onClick: () => setQrOpen(true)
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
    avatar: avatarParam,
    role: roleParam,
    from: fromParam
  } = readProfileIdParamPM();
  const otherUser = idParam ? PM_OTHER_USERS[idParam] || (nameParam ? buildMinimalProfilePM(nameParam, avatarParam, roleParam) : null) : null;
  const content = idParam ? otherUser ? /*#__PURE__*/React.createElement(OtherProfileScreen, {
    user: otherUser,
    from: fromParam
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
