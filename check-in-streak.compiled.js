/* ===========================================================================
   PROfinity — Katy · Check-In Streak ("5 in a row") · iPhone 17 Pro Max
   Celebrates the consecutive daily check-in streak the Mobile Check-In
   guardrail asks for: five day-slots in a row, each one playing the
   lemon-in-shades Lottie once the day is banked. Check-in, streak freeze and
   the Streak Master milestone all run through window.PFLoyalty.
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
const CIS_LOTTIE = "https://lottie.host/82113f83-6260-46ed-b045-3fdc9092198f/lGsCEPPU0v.json";
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
          animationData: JSON.parse(JSON.stringify(data))
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
function CheckInStreakScreen() {
  const [config] = useStateCIS(() => PF_CIS.getConfig());
  const [state, setState] = useStateCIS(() => PF_CIS.getState());
  const [toast, setToast] = useStateCIS(null);
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
    if (res.leveledUp) setTimeout(() => goCIS("MilestoneSplash.html"), 900);
  };
  const freeze = () => {
    const res = PF_CIS.spendCreditsToFreezeStreak();
    refresh();
    flash(res.ok ? "Streak frozen for 2 days" : res.reason);
  };
  const headline = current === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, "Start your ", /*#__PURE__*/React.createElement("b", null, "streak")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, current), " in a row!");
  const sub = current === 0 ? "Check in today to plant your first lemon. Five days running clears the Mobile Check-In guardrail." : rowComplete ? checkedInToday ? "Five days running and the Mobile Check-In guardrail is cleared. Come back tomorrow to keep the row alive." : "Five days running. Check in today to make it " + (current + 1) + " and keep the row alive." : CIS_SLOTS - current + " more " + (CIS_SLOTS - current === 1 ? "day" : "days") + " to make it five in a row.";
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen cis-screen",
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
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-hero-glow",
    "aria-hidden": "true"
  }), rowComplete && /*#__PURE__*/React.createElement("div", {
    className: "cis-confetti",
    "aria-hidden": "true"
  }, Array.from({
    length: 14
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "cis-confetti-piece p" + i % 6,
    style: {
      left: 4 + i * 6.8 + "%",
      animationDelay: i * 0.17 + "s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cis-kicker"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:flame",
    size: 14,
    color: "currentColor"
  }), " Daily check-in"), /*#__PURE__*/React.createElement("h2", null, headline), /*#__PURE__*/React.createElement("p", {
    className: "cis-hero-sub"
  }, sub), /*#__PURE__*/React.createElement("div", {
    className: "cis-row",
    role: "list",
    "aria-label": "Last five check-in days"
  }, slots.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.i,
    role: "listitem",
    className: "cis-slot" + (s.done ? " is-done" : "") + (s.today ? " is-today" : ""),
    style: {
      "--d": s.i * 110 + "ms"
    },
    "aria-label": s.label + (s.done ? ": checked in" : ": not yet")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-slot-art"
  }, s.done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CisLottie, {
    size: 58,
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
  }, s.label))))), checkedInToday ? /*#__PURE__*/React.createElement("button", {
    className: "ml-btn cis-cta is-done",
    type: "button",
    disabled: true,
    "aria-disabled": "true"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:check",
    size: 18,
    color: "currentColor"
  }), " Checked in today") : /*#__PURE__*/React.createElement("button", {
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
  }, checkedInToday ? "Your streak is safe until tomorrow." : "Check in once a day to keep the row growing."), /*#__PURE__*/React.createElement("div", {
    className: "cis-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-card cis-stat"
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
    className: "ml-card cis-stat"
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
    className: "ml-card cis-stat"
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
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "Protect your streak")), /*#__PURE__*/React.createElement("div", {
    className: "ml-card cis-freeze" + (streak.frozen ? " is-frozen" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "cis-freeze-ico"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:snowflake",
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "cis-freeze-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, streak.frozen ? "Streak frozen" : "Streak freeze"), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, streak.frozen && streak.frozenUntil ? "Safe until " + new Date(streak.frozenUntil).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }) : "Miss a day without losing your lemons · " + PF_CIS.formatNumber(config.streakFreezeCost) + " credits")), streak.frozen ? /*#__PURE__*/React.createElement("span", {
    className: "cis-freeze-on"
  }, /*#__PURE__*/React.createElement(DSCIS.IconifyIcon, {
    name: "lucide:lock",
    size: 16,
    color: "var(--gray-400)"
  })) : /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-sm ml-btn-ghost",
    type: "button",
    onClick: freeze,
    disabled: state.spendableCredits < config.streakFreezeCost
  }, "Freeze")), /*#__PURE__*/React.createElement("div", {
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
      PF_CIS.resetDemo();
      refresh();
      flash("Demo data reset.");
    }
  }, "Reset demo data")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8
    }
  })), toast && /*#__PURE__*/React.createElement("div", {
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
