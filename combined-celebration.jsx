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
const { useState: useStateCC, useEffect: useEffectCC, useRef: useRefCC, useMemo: useMemoCC } = React;
const DSCC = window.ProfinityDesignSystem_c2b5cc;
const PF_CC = window.PFLoyalty;

const CC_LOTTIE = "assets/lottie/checkin-welcome.json?v=20260917d";
const CC_CONFETTI = "https://lottie.host/1b8bdd21-9711-48bb-873f-3889b01b43c8/jrTeYYuQqi.json";
const CC_MARKS = (window.PFDailyGoal && window.PFDailyGoal.marks) || window.PF_DAILY_GOAL_MARKS || [280, 500, 750, 1000];
const CC_GOAL = CC_MARKS[0];

function goCC(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

function returnUrlCC() {
  const raw = new URLSearchParams(location.search).get("ret") || "";
  if (/^[A-Za-z0-9_\-]+\.html(\?[^#]*)?$/.test(raw)) return raw;
  try {
    const r = new URL(document.referrer);
    const page = r.pathname.split("/").pop();
    if (r.origin === location.origin && /^[A-Za-z0-9_\-]+\.html$/.test(page) && !/CombinedCelebration|MilestoneSplash|DailyGoal/.test(page)) return page + r.search;
  } catch (e) { /* no referrer */ }
  return "NewsfeedMobile.html";
}

/* The router's payload, or a sample set for ?demo=1 / a direct open */
function readPayloadCC() {
  let p = null;
  try { p = JSON.parse(sessionStorage.getItem("pf-celebration") || "null"); } catch (e) { /* ignore */ }
  const demo = new URLSearchParams(location.search).get("demo");
  if (p && p.items && p.items.length && !demo) return p;
  const cfg = PF_CC ? PF_CC.getConfig() : { levelBadges: [], achievementBadges: [] };
  const lvl = (cfg.levelBadges || [])[1] || { key: "silver", name: "Silver", threshold: 5000, color: "#8a94a6" };
  const ach = (cfg.achievementBadges || [])[0] || { key: "first_blood", name: "First Blood", description: "Complete your very first point-earning action.", reward: "50 bonus credits", icon: "lucide:zap" };
  const st = PF_CC ? PF_CC.getState() : null;
  return {
    kind: "combined", demo: true,
    items: [
      { type: "dailyGoal", key: String(CC_GOAL), mark: CC_GOAL },
      { type: "level", key: lvl.key, title: lvl.splashTitle || (lvl.name + " unlocked"), sub: PF_CC ? PF_CC.formatNumber(lvl.threshold) + " lifetime points" : "", color: lvl.color, badge: lvl },
      { type: "achievement", key: ach.key, title: ach.name, sub: ach.description, reward: ach.reward, icon: ach.icon, badge: ach }
    ],
    todayPoints: CC_GOAL + 15, streak: (st && st.streak && st.streak.current) || 3
  };
}

/* One reward → card copy, icon and colour */
function describeCC(m) {
  if (m.type === "dailyGoal") {
    const mark = m.mark || CC_GOAL;
    const idx = CC_MARKS.indexOf(mark);
    return { tag: "Daily goal", title: mark > CC_GOAL ? mark.toLocaleString("en-GB") + "-point mark reached" : "Daily goal reached",
      sub: mark.toLocaleString("en-GB") + " points banked today" + (idx > 0 ? " · mark " + (idx + 1) + " of " + CC_MARKS.length : ""), icon: "lucide:target", tone: "amber" };
  }
  if (m.type === "level") {
    const b = m.badge || {};
    return { tag: "Level up", title: m.title || (b.name + " unlocked"), sub: b.threshold ? (PF_CC ? PF_CC.formatNumber(b.threshold) : b.threshold) + " lifetime points" : (m.sub || ""), icon: "lucide:gem", tone: "level", color: m.color || b.color };
  }
  if (m.type === "achievement") {
    const b = m.badge || {};
    return { tag: "Badge", title: m.title || b.name, sub: m.reward || b.reward || m.sub || b.description || "", icon: m.icon || b.icon || "lucide:award", tone: "gold" };
  }
  if (m.type === "league") {
    const lg = m.league || {};
    return { tag: "League", title: m.title || ("Promoted to the " + (lg.name || "next") + " League"), sub: "A new leaderboard, new rivals, new prizes", icon: "lucide:trophy", tone: "league", color: m.color || lg.accent };
  }
  return { tag: "Reward", title: m.title || "Reward unlocked", sub: m.sub || "", icon: "lucide:sparkles", tone: "gold" };
}

function CcLottie() {
  const host = useRefCC(null);
  useEffectCC(() => {
    let anim, dead = false;
    const start = () => {
      if (dead || !window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: true, path: CC_LOTTIE });
    };
    if (window.lottie) start();
    else {
      const iv = setInterval(() => { if (window.lottie) { clearInterval(iv); start(); } }, 120);
      setTimeout(() => clearInterval(iv), 8000);
    }
    return () => { dead = true; if (anim) anim.destroy(); };
  }, []);
  return <span ref={host} className="cc-lottie" aria-hidden="true" />;
}

/* Full-frame confetti: plays twice, then fades and frees the animation */
function CcConfetti() {
  const host = useRefCC(null);
  useEffectCC(() => {
    let anim, dead = false;
    const start = () => {
      if (dead || !window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: 1, autoplay: true, path: CC_CONFETTI,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" } });
      anim.addEventListener("complete", () => {
        const el = host.current;
        if (el) el.classList.add("is-done");
        const a = anim; anim = null;
        setTimeout(() => { if (a) a.destroy(); if (el && el.classList.contains("is-done")) el.innerHTML = ""; }, 700);
      });
    };
    if (window.lottie) start();
    else {
      const iv = setInterval(() => { if (window.lottie) { clearInterval(iv); start(); } }, 120);
      setTimeout(() => clearInterval(iv), 8000);
    }
    return () => { dead = true; if (anim) anim.destroy(); };
  }, []);
  return <div ref={host} className="cc-confetti" aria-hidden="true" />;
}

/* Count-up for the headline number */
function useCountUpCC(target, ms, delay) {
  const [v, setV] = useStateCC(0);
  useEffectCC(() => {
    let raf, t0 = null;
    const step = (t) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / (ms || 900));
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const d = setTimeout(() => { raf = requestAnimationFrame(step); }, delay == null ? 350 : delay);
    return () => { clearTimeout(d); if (raf) cancelAnimationFrame(raf); };
  }, [target, ms]);
  return v;
}

function CombinedCelebrationScreen() {
  const payload = useMemoCC(readPayloadCC, []);
  const items = payload.items || [];
  const n = items.length;
  const state = PF_CC ? PF_CC.getState() : null;
  const first = state && state.user && state.user.name ? state.user.name.split(" ")[0] : "";
  const streak = payload.streak || (state && state.streak && state.streak.current) || 0;
  const today = Math.max(payload.todayPoints || 0, (window.PFDailyGoal && window.PFDailyGoal.today && window.PFDailyGoal.today()) || 0);
  const shownToday = useCountUpCC(today, 900, 500);
  const ret = returnUrlCC();

  /* the combined fanfare, the moment the screen appears */
  useEffectCC(() => {
    try { window.dispatchEvent(new CustomEvent("pf:celebration", { detail: { count: n, types: items.map((m) => m.type) } })); } catch (e) { /* older WebView */ }
    if (!payload.demo) { try { sessionStorage.removeItem("pf-celebration"); } catch (e) { /* ignore */ } }
  }, []);

  const words = { 2: "Double", 3: "Triple", 4: "Quadruple" };
  const headline = (words[n] || n + "-way") + " celebration" + (first ? ", " + first : "") + "!";

  return (
    <div className="cc-screen" data-screen-label="Combined Celebration">
      <div className="cc-glow" aria-hidden="true" />
      <CcConfetti />
      <button className="cc-close" type="button" aria-label="Close" onClick={() => goCC(ret)}>
        <DSCC.IconifyIcon name="lucide:x" size={20} color="#fff" />
      </button>

      <div className="cc-body">
        <div className="cc-hero"><CcLottie /></div>
        <div className="cc-kicker"><DSCC.IconifyIcon name="lucide:party-popper" size={13} color="currentColor" />{n} rewards · one move</div>
        <h1 className="cc-title">{headline}</h1>
        <p className="cc-sub">That one action set off <b>{n} celebrations</b> at once. Here's everything you just unlocked.</p>

        <ol className="cc-stack" aria-label="Rewards unlocked">
          {items.map((m, i) => {
            const d = describeCC(m);
            const style = d.color ? { "--cc-tile": d.color } : undefined;
            return (
              <li key={m.type + ":" + (m.key || i)} className={"cc-card is-" + d.tone} style={{ ...(style || {}), animationDelay: (0.55 + i * 0.22) + "s" }}>
                <span className="cc-tile" aria-hidden="true"><DSCC.IconifyIcon name={d.icon} size={22} color="#fff" /></span>
                <span className="cc-card-txt">
                  <span className="cc-card-title">{d.title}</span>
                  {d.sub ? <span className="cc-card-sub">{d.sub}</span> : null}
                </span>
                <span className="cc-tag">{d.tag}</span>
              </li>
            );
          })}
        </ol>

        <div className="cc-strip" aria-label="Today">
          <span className="cc-strip-item"><DSCC.IconifyIcon name="lucide:coins" size={15} color="#fdc35d" /><span><b>{shownToday}</b> pts today</span></span>
          <span className="cc-strip-dot" aria-hidden="true" />
          <span className="cc-strip-item"><DSCC.IconifyIcon name="lucide:flame" size={15} color="#f4894a" /><span><b>{streak}</b>-day streak</span></span>
        </div>
      </div>

      <div className="cc-foot">
        <button className="ml-btn ml-btn-gold cc-btn" type="button" onClick={() => goCC(ret)}>Keep earning <DSCC.IconifyIcon name="lucide:arrow-right" size={18} color="currentColor" /></button>
        <button className="ml-btn ml-btn-ghost cc-btn cc-btn-ghost" type="button" onClick={() => goCC("RewardsDashboard.html")}>View my rewards</button>
      </div>
    </div>
  );
}

function useDeviceScaleCC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateCC(calc);
  useEffectCC(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileCC() {
  const [mobile, setMobile] = useStateCC(() => window.matchMedia("(max-width:768px)").matches);
  useEffectCC(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function CombinedCelebrationApp() {
  const mobile = useIsMobileCC();
  const scale = useDeviceScaleCC();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "#1b1848" }}><CombinedCelebrationScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><CombinedCelebrationScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CombinedCelebrationApp />);
