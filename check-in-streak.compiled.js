/* ===========================================================================
   PROfinity — Katy · Check-In Streak ("5 in a row") · iPhone 17 Pro Max
   Celebrates the consecutive daily check-in streak the Mobile Check-In
   guardrail asks for: five day-slots on a connected track, each one playing
   the cheering Dr Tim Lottie once the day is banked, presented by the
   coffee-break Dr Tim (assets/lottie/drtim-coffee.json, same ring crop as the
   header points pill). Redesigned 2026-10-13 as a light cream + gold hero
   with the check-in action inside it (navy hero kept for dark mode). Check-in and
   the Streak Master milestone both run through window.PFLoyalty.
   Suffixed -CIS to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateCIS,
  useEffect: useEffectCIS,
  useRef: useRefCIS,
  useMemo: useMemoCIS
} = React;
const DSCIS = window.ProfinityDesignSystem_c2b5cc;
const PF_CIS = window.PFLoyalty;

/* on-brand slot character: the cheering Dr Tim avatar (assets/lottie, same
   file family as daily-checkin.js / the Rewards welcome modal) */
const CIS_LOTTIE = "assets/lottie/checkin-happy.json";
const CIS_SLOTS = 5;
const CIS_DAY = 86400000;
function goCIS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* Fetch the raw JSON once and hand every slot its own copy (lottie-web mutates
   animationData, so five instances can't share one object). */
let cisLottieData = null;
function loadCisLottie() {
  if (!cisLottieData) cisLottieData = fetch(CIS_LOTTIE).then(r => r.json());
  return cisLottieData;
}
function CisLottie({
  size,
  delay
}) {
  const host = useRefCIS(null);
  useEffectCIS(() => {
    let anim,
      timer,
      dead = false;
    loadCisLottie().then(data => {
      const start = () => {
        if (dead || !window.lottie || !host.current) return;
        anim = window.lottie.loadAnimation({
          container: host.current,
          renderer: "svg",
          loop: true,
          autoplay: false,
          animationData: JSON.parse(JSON.stringify(data)),
          /* the avatar is a 4:3 scene — fill the round slot by height and crop the sides */
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
          }
        });
        timer = setTimeout(() => {
          if (!dead && anim) anim.play();
        }, delay || 0);
      };
      if (window.lottie) start();else {
        const iv = setInterval(() => {
          if (window.lottie) {
            clearInterval(iv);
            start();
          }
        }, 120);
        setTimeout(() => clearInterval(iv), 8000);
      }
    }).catch(() => {/* offline: the slot keeps its gold ring */});
    return () => {
      dead = true;
      if (timer) clearTimeout(timer);
      if (anim) anim.destroy();
    };
  }, [delay]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "cis-lottie",
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  });
}

/* (the coffee-break Dr Tim presenter that sat beside the headline was removed 2026-10-14 at the user's request) */

function sameDayCIS(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayLabelCIS(d, today) {
  if (sameDayCIS(d, today)) return "Today";
  return d.toLocaleDateString("en-GB", {
    weekday: "short"
  });
}

/* Build the five slots: the streak's most recent days fill from the left,
   anything still to come is an empty ring with its weekday initial. */
function buildSlotsCIS(streak) {
  const today = new Date();
  const last = streak.lastCheckIn ? new Date(streak.lastCheckIn) : today;
  const filled = Math.min(streak.current || 0, CIS_SLOTS);
  const slots = [];
  for (let i = 0; i < CIS_SLOTS; i++) {
    const done = i < filled;
    const d = done ? new Date(last.getTime() - (filled - 1 - i) * CIS_DAY) : new Date(last.getTime() + (i - filled + 1) * CIS_DAY);
    slots.push({
      i,
      done,
      date: d,
      label: dayLabelCIS(d, today),
      today: sameDayCIS(d, today)
    });
  }
  return slots;
}

/* Streak-at-risk banner — same card as the Rewards dashboard's StreakRiskBanner
   (rewards-dashboard.jsx). The streak lapses 24h after the last check-in, so it
   shows once the member hasn't checked in for 12h+ and counts down live; an
   explicit riskDeadline (demo button / server nudge) wins. Checking in or
   freezing clears riskDeadline in the engine, which hides it. */
const CIS_STREAK_WINDOW_MS = 24 * 3600000;
const CIS_STREAK_WARN_MS = 12 * 3600000;
function cisStreakDeadline(streak) {
  if (!streak || !streak.current || streak.frozen) return null;
  if (streak.riskDeadline) return new Date(streak.riskDeadline).getTime();
  const last = streak.lastCheckIn ? new Date(streak.lastCheckIn).getTime() : 0;
  if (!last || Date.now() - last < CIS_STREAK_WARN_MS) return null;
  return last + CIS_STREAK_WINDOW_MS;
}
function fmtClockCIS(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000),
    m = Math.floor(ms % 3600000 / 60000),
    s = Math.floor(ms % 60000 / 1000);
  return [h, m, s].map(n => String(n).padStart(2, "0")).join(":");
}
function CisNotifPreview({
  hoursLabel,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cis-notif-preview",
    role: "note"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cis-notif-icon"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:bell-ring",
    size: 16,
    color: "#292569"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cis-notif-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cis-notif-title"
  }, "PROfinity ", /*#__PURE__*/React.createElement("span", null, hoursLabel)), /*#__PURE__*/React.createElement("div", {
    className: "cis-notif-text"
  }, body)));
}
function CisStreakRiskBanner({
  streak
}) {
  const [now, setNow] = useStateCIS(() => Date.now());
  useEffectCIS(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const deadline = cisStreakDeadline(streak);
  if (!deadline) return null;
  const days = streak.current;
  return /*#__PURE__*/React.createElement("section", {
    className: "cis-risk-banner",
    "aria-label": "Your " + days + "-day streak is at risk"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cis-risk-head"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:flame",
    size: 22,
    color: "#3D2A00"
  }), /*#__PURE__*/React.createElement("span", null, "Your ", days, "-Day Streak is at Risk!")), /*#__PURE__*/React.createElement("div", {
    className: "cis-risk-clock",
    "aria-live": "off"
  }, "Expires in ", fmtClockCIS(deadline - now)), /*#__PURE__*/React.createElement("div", {
    className: "cis-notif-stack"
  }, /*#__PURE__*/React.createElement(CisNotifPreview, {
    hoursLabel: "· 6h before",
    body: "Don't lose your " + days + "-day streak — check in before it expires!"
  }), /*#__PURE__*/React.createElement(CisNotifPreview, {
    hoursLabel: "· 2h before",
    body: "Last call! Your streak expires in 2 hours."
  })));
}

/* ---- streak calendar (user, 2026-10-14): tapping the five-day track opens a
   month view of every check-in day. Days come from the ledger's
   evt_mobile_checkin entries plus the current consecutive run ending at
   streak.lastCheckIn (the engine keeps no per-day history beyond that). */
function cisKey(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function cisCheckedDays(state) {
  const set = new Set();
  (state.ledger || []).forEach(t => {
    if (t.actionId === "evt_mobile_checkin" && t.ts) set.add(cisKey(new Date(t.ts)));
  });
  const streak = state.streak || {};
  if (streak.current && streak.lastCheckIn) {
    const last = new Date(streak.lastCheckIn);
    for (let i = 0; i < streak.current; i++) {
      const d = new Date(last);
      d.setDate(last.getDate() - i);
      set.add(cisKey(d));
    }
  }
  return set;
}
function CisCalendarSheet({
  open,
  onClose,
  state
}) {
  const today = new Date();
  const [cursor, setCursor] = useStateCIS(() => new Date(today.getFullYear(), today.getMonth(), 1));
  useEffectCIS(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const checked = cisCheckedDays(state);
  const streak = state.streak || {
    current: 0,
    longest: 0
  };
  const y = cursor.getFullYear(),
    m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; /* Monday-first grid */
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);
  const inMonth = cells.filter(d => d && checked.has(cisKey(d))).length;
  const monthLabel = cursor.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric"
  });
  const isFutureMonth = y > today.getFullYear() || y === today.getFullYear() && m >= today.getMonth();
  return /*#__PURE__*/React.createElement("div", {
    className: "cis-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cis-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "cis-cal-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-sheet-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cis-cal-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cis-cal-nav",
    "aria-label": "Previous month",
    onClick: () => setCursor(new Date(y, m - 1, 1))
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 18,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("h3", {
    id: "cis-cal-title"
  }, monthLabel), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cis-cal-nav",
    "aria-label": "Next month",
    disabled: isFutureMonth,
    onClick: () => setCursor(new Date(y, m + 1, 1))
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "currentColor"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cis-cal-dow",
    "aria-hidden": "true"
  }, ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, d))), /*#__PURE__*/React.createElement("div", {
    className: "cis-cal-grid",
    role: "grid",
    "aria-label": "Check-ins in " + monthLabel
  }, cells.map((d, i) => {
    if (!d) return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "cis-cal-cell is-blank",
      "aria-hidden": "true"
    });
    const k = cisKey(d);
    const done = checked.has(k);
    const isToday = sameDayCIS(d, today);
    const future = d > today && !isToday;
    const prevDone = checked.has(cisKey(new Date(y, m, d.getDate() - 1))) && d.getDay() !== 1;
    const nextDone = checked.has(cisKey(new Date(y, m, d.getDate() + 1))) && d.getDay() !== 0;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      role: "gridcell",
      className: "cis-cal-cell" + (done ? " is-done" : "") + (isToday ? " is-today" : "") + (future ? " is-future" : "") + (done && prevDone ? " link-l" : "") + (done && nextDone ? " link-r" : ""),
      "aria-label": d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }) + (done ? ": checked in" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "cis-cal-day"
    }, done ? /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
      name: "lucide:check",
      size: 14,
      color: "currentColor"
    }) : d.getDate()));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cis-cal-stats"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, inMonth), /*#__PURE__*/React.createElement("span", null, "check-ins this month")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, streak.current || 0), /*#__PURE__*/React.createElement("span", null, "current streak")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, streak.longest || streak.current || 0), /*#__PURE__*/React.createElement("span", null, "longest streak"))), /*#__PURE__*/React.createElement("p", {
    className: "cis-cal-note"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:flame",
    size: 13,
    color: "currentColor"
  }), "Gold days are check-ins. Keep them touching to grow the streak."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ml-btn ml-btn-navy cis-cal-ok",
    onClick: onClose
  }, "Done")));
}
function CheckInStreakScreen() {
  const [config] = useStateCIS(() => PF_CIS.getConfig());
  const [state, setState] = useStateCIS(() => PF_CIS.getState());
  const [toast, setToast] = useStateCIS(null);
  /* ?calendar=1 opens the streak calendar straight away (demo / screenshots) */
  const [calOpen, setCalOpen] = useStateCIS(() => {
    try {
      return new URLSearchParams(location.search).get("calendar") === "1";
    } catch (e) {
      return false;
    }
  });
  const refresh = () => setState(PF_CIS.getState());

  /* Stay in step with the rest of the prototype — the engine lives in localStorage. */
  useEffectCIS(() => {
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  const streak = state.streak || {
    current: 0,
    longest: 0
  };
  const current = streak.current || 0;
  const slots = useMemoCIS(() => buildSlotsCIS(streak), [streak.current, streak.lastCheckIn]);
  const rowComplete = current >= CIS_SLOTS;
  const checkedInToday = !!streak.lastCheckIn && sameDayCIS(new Date(streak.lastCheckIn), new Date());
  const action = config.actions.find(a => a.id === "evt_mobile_checkin");
  const tier = state.user.membershipTier;
  const projected = action ? Math.round(action.basePoints * PF_CIS.tierMultiplierFor(action, tier)) : 0;
  const master = (config.achievementBadges || config.achievements || []).find(a => a.key === "streak_master") || {
    name: "Streak Master",
    criteria: {
      count: 30
    },
    reward: ""
  };
  const target = master.criteria.count;
  const toGo = Math.max(0, target - current);
  const pct = Math.min(100, Math.round(current / target * 100));
  const flash = m => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };
  const checkIn = () => {
    if (!action || checkedInToday) return;
    const res = PF_CIS.completeAction(action.id);
    refresh();
    if (res.capped) {
      flash(action.label + ": " + res.capReason);
      return;
    }
    flash("Checked in · +" + res.pointsAwarded + " pts");
    try {
      window.dispatchEvent(new CustomEvent("pf:points-earned", {
        detail: {
          amount: res.pointsAwarded,
          label: action.label,
          actionId: action.id,
          booked: true
        }
      }));
    } catch (e) {/* older WebView */}
    if (window.PFRewards) window.PFRewards.fromAction(res);else if (res.leveledUp) setTimeout(() => goCIS("MilestoneSplash.html"), 900);
  };
  const headline = current === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, "Start your ", /*#__PURE__*/React.createElement("b", null, "streak")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, current), " in a row!");
  const sub = current === 0 ? "Check in today to start your streak. Five days running clears the Mobile Check-In guardrail." : rowComplete ? checkedInToday ? "Five days running and the Mobile Check-In guardrail is cleared. Come back tomorrow to keep the row alive." : "Five days running. Check in today to make it " + (current + 1) + " and keep the row alive." : CIS_SLOTS - current + " more " + (CIS_SLOTS - current === 1 ? "day" : "days") + " to make it five in a row.";
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen cis-screen pf-funbg",
    "data-screen-label": "Check-In Streak"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goCIS("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Check-In Streak"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll cis-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "cis-hero",
    "aria-label": current + " day check-in streak"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cis-hero-top"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cis-cal-btn",
    "aria-label": "View streak calendar",
    "aria-haspopup": "dialog",
    "aria-expanded": calOpen,
    onClick: () => setCalOpen(true)
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:calendar-days",
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cis-hero-tx"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cis-kicker"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:flame",
    size: 12,
    color: "currentColor"
  }), " Daily check-in"), /*#__PURE__*/React.createElement("h2", null, headline), /*#__PURE__*/React.createElement("p", {
    className: "cis-hero-sub"
  }, sub))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cis-row",
    "aria-label": "Last five check-in days. Open the streak calendar",
    "aria-haspopup": "dialog",
    "aria-expanded": calOpen,
    onClick: () => setCalOpen(true)
  }, slots.map(s => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s.i
  }, s.i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "cis-link" + (s.done ? " on" : ""),
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cis-slot" + (s.done ? " is-done" : "") + (s.today ? " is-today" : ""),
    style: {
      "--d": s.i * 110 + "ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-slot-art"
  }, s.done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CisLottie, {
    size: 50,
    delay: s.i * 180
  }), /*#__PURE__*/React.createElement("span", {
    className: "cis-slot-tick"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:check",
    size: 11,
    color: "#fff"
  }))) : /*#__PURE__*/React.createElement("span", {
    className: "cis-slot-empty"
  }, s.label === "Today" ? /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:calendar-check",
    size: 20,
    color: "currentColor"
  }) : s.date.toLocaleDateString("en-GB", {
    weekday: "narrow"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "cis-slot-day"
  }, s.label))))), /*#__PURE__*/React.createElement("div", {
    className: "cis-act"
  }, !checkedInToday && /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-navy cis-cta",
    type: "button",
    onClick: checkIn,
    "aria-label": "Check in today for " + projected + " points"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:zap",
    size: 18,
    color: "currentColor"
  }), " Check in today ", /*#__PURE__*/React.createElement("span", {
    className: "cis-cta-pts"
  }, "· +", projected, " pts")), /*#__PURE__*/React.createElement("p", {
    className: "cis-cta-note"
  }, checkedInToday ? "Your streak is safe until tomorrow." : "Check in once a day to keep the row growing."))), /*#__PURE__*/React.createElement(CisStreakRiskBanner, {
    streak: streak
  }), /*#__PURE__*/React.createElement("div", {
    className: "ml-card cis-stats",
    "aria-label": "Streak stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cis-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-ico"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:flame",
    size: 16,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-value"
  }, current, " ", current === 1 ? "day" : "days"), /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-label"
  }, "Current streak")), /*#__PURE__*/React.createElement("div", {
    className: "cis-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-ico"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:trophy",
    size: 16,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-value"
  }, streak.longest || current, " days"), /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-label"
  }, "Longest streak")), /*#__PURE__*/React.createElement("div", {
    className: "cis-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-ico"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:zap",
    size: 16,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-value"
  }, "+", projected), /*#__PURE__*/React.createElement("span", {
    className: "cis-stat-label"
  }, "Pts per check-in"))), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Next milestone")), /*#__PURE__*/React.createElement("div", {
    className: "ml-card cis-milestone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cis-milestone-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-milestone-ico"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: master.icon || "lucide:flame",
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cis-milestone-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, master.name, " badge"), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, master.description || "Reach a " + target + "-day check-in streak.")), /*#__PURE__*/React.createElement("span", {
    className: "cis-milestone-count"
  }, Math.min(current, target), /*#__PURE__*/React.createElement("small", null, "/", target))), /*#__PURE__*/React.createElement("div", {
    className: "ml-progress-track",
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": target,
    "aria-valuenow": Math.min(current, target)
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-progress-fill",
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cis-milestone-foot"
  }, toGo > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, toGo, " more ", toGo === 1 ? "day" : "days"), master.reward ? " unlocks " + master.reward : "") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, "Unlocked"), master.reward ? " — " + master.reward : ""))), /*#__PURE__*/React.createElement("div", {
    className: "ml-demo-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-demo-btn",
    type: "button",
    onClick: () => {
      PF_CIS.setState({
        streak: Object.assign({}, streak, {
          current: 3,
          lastCheckIn: new Date(Date.now() - 20 * 3600000).toISOString(),
          frozen: false
        })
      });
      refresh();
    }
  }, "Demo: 3 of 5"), /*#__PURE__*/React.createElement("button", {
    className: "ml-demo-btn",
    type: "button",
    onClick: () => {
      PF_CIS.setState({
        streak: Object.assign({}, streak, {
          current: 5,
          lastCheckIn: new Date(Date.now() - 20 * 3600000).toISOString(),
          frozen: false
        })
      });
      refresh();
    }
  }, "Demo: 5 in a row"), /*#__PURE__*/React.createElement("button", {
    className: "ml-demo-btn",
    type: "button",
    onClick: () => {
      PF_CIS.setStreakAtRisk(6);
      refresh();
    }
  }, "Demo: streak at risk"), /*#__PURE__*/React.createElement("button", {
    className: "ml-demo-btn",
    type: "button",
    onClick: () => {
      PF_CIS.resetDemo();
      refresh();
      flash("Demo data reset.");
    }
  }, "Reset demo data")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8
    }
  })), /*#__PURE__*/React.createElement(CisCalendarSheet, {
    open: calOpen,
    onClose: () => setCalOpen(false),
    state: state
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "ml-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:zap",
    size: 16,
    color: "#fff"
  }), toast));
}
function useDeviceScaleCIS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateCIS(calc);
  useEffectCIS(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileCIS() {
  const [mobile, setMobile] = useStateCIS(() => window.matchMedia("(max-width:768px)").matches);
  useEffectCIS(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkCIS() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateCIS(read);
  useEffectCIS(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => mo.disconnect();
  }, []);
  return dark;
}
function CheckInStreakApp() {
  const mobile = useIsMobileCIS();
  const scale = useDeviceScaleCIS();
  const dark = useIsDarkCIS();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(CheckInStreakScreen, null));
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
    height: 956,
    dark: dark
  }, /*#__PURE__*/React.createElement(CheckInStreakScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CheckInStreakApp, null));
