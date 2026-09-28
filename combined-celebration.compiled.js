/* ===========================================================================
   PROfinity — Katy · Combined Celebration · iPhone 17 Pro Max
   Full page (not a modal) opened by the reward router (reward-router.js)
   when SEVERAL major rewards land from the same action — e.g. one earn tips
   the day's points goal AND unlocks a level badge AND an achievement. Instead
   of DailyGoal.html and MilestoneSplash.html fighting over the navigation,
   the member sees one screen: the check-in doctor, a headline, and the
   rewards stacked as cards that deal in one after another. Plays the
   "combined" fanfare (points-sound.js) — the biggest voice in the set.
   Reads the router's sessionStorage payload ("pf-celebration"); ?demo=1
   shows a sample set. ?ret= is where "Keep earning" goes back to.
   Fixed navy palette (same family as Daily Goal / check-in) in both themes.
   Suffixed -CC to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateCC,
  useEffect: useEffectCC,
  useRef: useRefCC,
  useMemo: useMemoCC
} = React;
const DSCC = window.ProfinityDesignSystem_c2b5cc;
const PF_CC = window.PFLoyalty;
const CC_LOTTIE = "assets/lottie/checkin-welcome.json?v=20260917d";
const CC_CONFETTI = "https://lottie.host/1b8bdd21-9711-48bb-873f-3889b01b43c8/jrTeYYuQqi.json";
const CC_MARKS = window.PFDailyGoal && window.PFDailyGoal.marks || window.PF_DAILY_GOAL_MARKS || [280, 500, 750, 1000];
const CC_GOAL = CC_MARKS[0];
function goCC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function returnUrlCC() {
  const raw = new URLSearchParams(location.search).get("ret") || "";
  if (/^[A-Za-z0-9_\-]+\.html(\?[^#]*)?$/.test(raw)) return raw;
  try {
    const r = new URL(document.referrer);
    const page = r.pathname.split("/").pop();
    if (r.origin === location.origin && /^[A-Za-z0-9_\-]+\.html$/.test(page) && !/CombinedCelebration|MilestoneSplash|DailyGoal/.test(page)) return page + r.search;
  } catch (e) {/* no referrer */}
  return "NewsfeedMobile.html";
}

/* The router's payload, or a sample set for ?demo=1 / a direct open */
function readPayloadCC() {
  let p = null;
  try {
    p = JSON.parse(sessionStorage.getItem("pf-celebration") || "null");
  } catch (e) {/* ignore */}
  const demo = new URLSearchParams(location.search).get("demo");
  if (p && p.items && p.items.length && !demo) return p;
  const cfg = PF_CC ? PF_CC.getConfig() : {
    levelBadges: [],
    achievementBadges: []
  };
  const lvl = (cfg.levelBadges || [])[1] || {
    key: "silver",
    name: "Silver",
    threshold: 5000,
    color: "#8a94a6"
  };
  const ach = (cfg.achievementBadges || [])[0] || {
    key: "first_blood",
    name: "First Blood",
    description: "Complete your very first point-earning action.",
    reward: "50 bonus credits",
    icon: "lucide:zap"
  };
  const st = PF_CC ? PF_CC.getState() : null;
  return {
    kind: "combined",
    demo: true,
    items: [{
      type: "dailyGoal",
      key: String(CC_GOAL),
      mark: CC_GOAL
    }, {
      type: "level",
      key: lvl.key,
      title: lvl.splashTitle || lvl.name + " unlocked",
      sub: PF_CC ? PF_CC.formatNumber(lvl.threshold) + " lifetime points" : "",
      color: lvl.color,
      badge: lvl
    }, {
      type: "achievement",
      key: ach.key,
      title: ach.name,
      sub: ach.description,
      reward: ach.reward,
      icon: ach.icon,
      badge: ach
    }],
    todayPoints: CC_GOAL + 15,
    streak: st && st.streak && st.streak.current || 3
  };
}

/* One reward → card copy, icon and colour */
function describeCC(m) {
  if (m.type === "dailyGoal") {
    const mark = m.mark || CC_GOAL;
    const idx = CC_MARKS.indexOf(mark);
    return {
      tag: "Daily goal",
      title: mark > CC_GOAL ? mark.toLocaleString("en-GB") + "-point mark reached" : "Daily goal reached",
      sub: mark.toLocaleString("en-GB") + " points banked today" + (idx > 0 ? " · mark " + (idx + 1) + " of " + CC_MARKS.length : ""),
      icon: "lucide:target",
      tone: "amber"
    };
  }
  if (m.type === "level") {
    const b = m.badge || {};
    return {
      tag: "Level up",
      title: m.title || b.name + " unlocked",
      sub: b.threshold ? (PF_CC ? PF_CC.formatNumber(b.threshold) : b.threshold) + " lifetime points" : m.sub || "",
      icon: "lucide:gem",
      tone: "level",
      color: m.color || b.color
    };
  }
  if (m.type === "achievement") {
    const b = m.badge || {};
    return {
      tag: "Badge",
      title: m.title || b.name,
      sub: m.reward || b.reward || m.sub || b.description || "",
      icon: m.icon || b.icon || "lucide:award",
      tone: "gold"
    };
  }
  if (m.type === "league") {
    const lg = m.league || {};
    return {
      tag: "League",
      title: m.title || "Promoted to the " + (lg.name || "next") + " League",
      sub: "A new leaderboard, new rivals, new prizes",
      icon: "lucide:trophy",
      tone: "league",
      color: m.color || lg.accent
    };
  }
  if (m.type === "action") {
    /* a way to earn whose admin-set Reward UI is Major / Combined */
    return {
      tag: "Reward",
      title: m.points ? "+" + Number(m.points).toLocaleString("en-GB") + " pts" : m.title || "Reward earned",
      sub: m.points ? m.title || "" : m.sub || "",
      icon: m.icon || "lucide:coins",
      tone: "gold"
    };
  }
  return {
    tag: "Reward",
    title: m.title || "Reward unlocked",
    sub: m.sub || "",
    icon: "lucide:sparkles",
    tone: "gold"
  };
}
function CcLottie() {
  const host = useRefCC(null);
  useEffectCC(() => {
    let anim,
      dead = false;
    const start = () => {
      if (dead || !window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: CC_LOTTIE
      });
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
    return () => {
      dead = true;
      if (anim) anim.destroy();
    };
  }, []);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "cc-lottie",
    "aria-hidden": "true"
  });
}

/* Full-frame confetti: plays twice, then fades and frees the animation */
function CcConfetti() {
  const host = useRefCC(null);
  useEffectCC(() => {
    let anim,
      dead = false;
    const start = () => {
      if (dead || !window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: 1,
        autoplay: true,
        path: CC_CONFETTI,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      });
      anim.addEventListener("complete", () => {
        const el = host.current;
        if (el) el.classList.add("is-done");
        const a = anim;
        anim = null;
        setTimeout(() => {
          if (a) a.destroy();
          if (el && el.classList.contains("is-done")) el.innerHTML = "";
        }, 700);
      });
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
    return () => {
      dead = true;
      if (anim) anim.destroy();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: host,
    className: "cc-confetti",
    "aria-hidden": "true"
  });
}

/* Count-up for the headline number */
function useCountUpCC(target, ms, delay) {
  const [v, setV] = useStateCC(0);
  useEffectCC(() => {
    let raf,
      t0 = null;
    const step = t => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / (ms || 900));
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const d = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay == null ? 350 : delay);
    return () => {
      clearTimeout(d);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, ms]);
  return v;
}
function CombinedCelebrationScreen() {
  const payload = useMemoCC(readPayloadCC, []);
  const items = payload.items || [];
  const n = items.length;
  const state = PF_CC ? PF_CC.getState() : null;
  const first = state && state.user && state.user.name ? state.user.name.split(" ")[0] : "";
  const streak = payload.streak || state && state.streak && state.streak.current || 0;
  const today = Math.max(payload.todayPoints || 0, window.PFDailyGoal && window.PFDailyGoal.today && window.PFDailyGoal.today() || 0);
  const shownToday = useCountUpCC(today, 900, 500);
  const ret = returnUrlCC();

  /* the combined fanfare, the moment the screen appears */
  useEffectCC(() => {
    try {
      window.dispatchEvent(new CustomEvent("pf:celebration", {
        detail: {
          count: n,
          types: items.map(m => m.type)
        }
      }));
    } catch (e) {/* older WebView */}
    if (!payload.demo) {
      try {
        sessionStorage.removeItem("pf-celebration");
      } catch (e) {/* ignore */}
    }
  }, []);
  const words = {
    2: "Double",
    3: "Triple",
    4: "Quadruple"
  };
  /* Major Celebration Splash: one big reward gets the full page to itself */
  const isMajor = payload.kind === "major" || n === 1;
  const headline = isMajor ? "Huge win" + (first ? ", " + first : "") + "!" : (words[n] || n + "-way") + " celebration" + (first ? ", " + first : "") + "!";
  const kicker = isMajor ? "Major celebration" : n + " rewards · one move";
  const sub = isMajor ? /*#__PURE__*/React.createElement(React.Fragment, null, "That was a ", /*#__PURE__*/React.createElement("b", null, "big one"), ". Here's what you just unlocked.") : /*#__PURE__*/React.createElement(React.Fragment, null, "That one action set off ", /*#__PURE__*/React.createElement("b", null, n, " celebrations"), " at once. Here's everything you just unlocked.");
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-screen" + (isMajor ? " is-major" : ""),
    "data-screen-label": isMajor ? "Major Celebration" : "Combined Celebration"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-glow",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement(CcConfetti, null), /*#__PURE__*/React.createElement("button", {
    className: "cc-close",
    type: "button",
    "aria-label": "Close",
    onClick: () => goCC(ret)
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:x",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "cc-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-hero"
  }, /*#__PURE__*/React.createElement(CcLottie, null)), /*#__PURE__*/React.createElement("div", {
    className: "cc-kicker"
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:party-popper",
    size: 13,
    color: "currentColor"
  }), kicker), /*#__PURE__*/React.createElement("h1", {
    className: "cc-title"
  }, headline), /*#__PURE__*/React.createElement("p", {
    className: "cc-sub"
  }, sub), /*#__PURE__*/React.createElement("ol", {
    className: "cc-stack",
    "aria-label": "Rewards unlocked"
  }, items.map((m, i) => {
    const d = describeCC(m);
    const style = d.color ? {
      "--cc-tile": d.color
    } : undefined;
    return /*#__PURE__*/React.createElement("li", {
      key: m.type + ":" + (m.key || i),
      className: "cc-card is-" + d.tone,
      style: {
        ...(style || {}),
        animationDelay: 0.55 + i * 0.22 + "s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cc-tile",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
      name: d.icon,
      size: 22,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cc-card-txt"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cc-card-title"
    }, d.title), d.sub ? /*#__PURE__*/React.createElement("span", {
      className: "cc-card-sub"
    }, d.sub) : null), /*#__PURE__*/React.createElement("span", {
      className: "cc-tag"
    }, d.tag));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cc-strip",
    "aria-label": "Today"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-strip-item"
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:coins",
    size: 15,
    color: "var(--cc-coin)"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, shownToday), " pts today")), /*#__PURE__*/React.createElement("span", {
    className: "cc-strip-dot",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cc-strip-item"
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:flame",
    size: 15,
    color: "#f4894a"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, streak), "-day streak")))), /*#__PURE__*/React.createElement("div", {
    className: "cc-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-gold cc-btn",
    type: "button",
    onClick: () => goCC(ret)
  }, "Keep earning ", /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-ghost cc-btn cc-btn-ghost",
    type: "button",
    onClick: () => goCC("RewardsDashboard.html")
  }, "View my rewards")));
}
function useDeviceScaleCC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateCC(calc);
  useEffectCC(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileCC() {
  const [mobile, setMobile] = useStateCC(() => window.matchMedia("(max-width:768px)").matches);
  useEffectCC(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkCC() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateCC(read);
  useEffectCC(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => mo.disconnect();
  }, []);
  return dark;
}
function CombinedCelebrationApp() {
  const mobile = useIsMobileCC();
  const dark = useIsDarkCC();
  const scale = useDeviceScaleCC();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "var(--cc-solid)"
    }
  }, /*#__PURE__*/React.createElement(CombinedCelebrationScreen, null));
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
  }, /*#__PURE__*/React.createElement(CombinedCelebrationScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CombinedCelebrationApp, null));
