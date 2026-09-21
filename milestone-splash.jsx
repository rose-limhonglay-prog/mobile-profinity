/* ===========================================================================
   PROfinity — Katy · Reward Splash Screen (Milestone Splash) · iPhone 17 Pro Max
   Full-screen congratulatory splash for ONE major reward — the "Reward Splash
   Screen" rung of the celebration ladder (see reward-router.js):
     • level     — crossing a lifetime-points threshold (Bronze → Silver …,
                   50,000 → "Sapphire Collector"), lists the perks unlocked
     • achievement — an achievement badge unlocking (First Blood, Streak Master …)
     • league    — a promotion to the next leaderboard league
     • signup    — the 100-point welcome bonus once sign-up completes (books
                   the points itself, once, under evt_signup)
     • login     — the daily login reward after signing in: books today's
                   check-in (evt_mobile_checkin, daily cap 1 — so the feed's
                   own "Welcome back" takeover won't award it again) and rolls
                   the points up big, like sign-up
   What to show comes from the router's sessionStorage payload
   ("pf-celebration") or ?kind=&key=; with neither it falls back to the
   current level badge (the original behaviour). ?ret= is where Continue goes.
   Plays the "milestone" fanfare (points-sound.js) as it appears.
   Suffixed -SPL to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateSPL, useEffect: useEffectSPL, useMemo: useMemoSPL } = React;
const DSSPL = window.ProfinityDesignSystem_c2b5cc;

function goSPL(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* Hero + confetti borrowed from the Goal Reached screen (daily-goal.jsx):
   the check-in doctor — here the winking cut (assets/lottie/checkin-wink.json,
   one eye squeezes shut on the smile) — and the lottie.host confetti burst
   that plays twice then fades. */
const SPL_LOTTIE = "assets/lottie/checkin-wink.json?v=20260918a";
/* sign-up: the same waving character as the Goal Reached screen (user-supplied, 1:1) */
const SPL_SIGNUP_LOTTIE = "assets/lottie/goal-reached.json?v=20260918a";
const SPL_CONFETTI = "https://lottie.host/1b8bdd21-9711-48bb-873f-3889b01b43c8/jrTeYYuQqi.json";
function useLottieSPL(host, opts) {
  useEffectSPL(() => {
    let anim, dead = false;
    const start = () => {
      if (dead || !window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation(Object.assign({ container: host.current, renderer: "svg", autoplay: true }, opts));
      if (opts.onComplete) anim.addEventListener("complete", () => { const a = anim; anim = null; opts.onComplete(host.current, a); });
    };
    if (window.lottie) start();
    else {
      const iv = setInterval(() => { if (window.lottie) { clearInterval(iv); start(); } }, 120);
      setTimeout(() => clearInterval(iv), 8000);
    }
    return () => { dead = true; if (anim) anim.destroy(); };
  }, []);
}
/* Count-up for the big "+100" (sign-up): eases out over ~1s after a short beat */
function useCountUpSPL(target, ms, delay) {
  const [v, setV] = useStateSPL(0);
  useEffectSPL(() => {
    if (!target) return undefined;
    let raf, t0 = null;
    const step = (t) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / (ms || 1000));
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const d = setTimeout(() => { raf = requestAnimationFrame(step); }, delay == null ? 400 : delay);
    return () => { clearTimeout(d); if (raf) cancelAnimationFrame(raf); };
  }, [target, ms]);
  return v;
}
function SplLottie({ src }) {
  const host = React.useRef(null);
  useLottieSPL(host, { loop: true, path: src || SPL_LOTTIE });
  return <span ref={host} className="spl-lottie" aria-hidden="true" />;
}
function SplConfetti() {
  const host = React.useRef(null);
  useLottieSPL(host, { loop: 1, path: SPL_CONFETTI, rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
    onComplete: (el, a) => { if (el) el.classList.add("is-done"); setTimeout(() => { if (a) a.destroy(); if (el && el.classList.contains("is-done")) el.innerHTML = ""; }, 700); } });
  return <div ref={host} className="spl-confetti" aria-hidden="true" />;
}

function returnUrlSPL(fallback) {
  const raw = new URLSearchParams(location.search).get("ret") || "";
  if (/^[A-Za-z0-9_\-]+\.html(\?[^#]*)?$/.test(raw)) return raw;
  return fallback || "RewardsDashboard.html";
}

const SIGNUP_POINTS_SPL = 100;
const SIGNUP_KEY_SPL = "pf-signup-bonus";
/* Book the welcome bonus exactly once per browser (the engine has no
   sign-up action, so it goes through awardPoints like the feed rewards) and
   tell the rest of the page family about it. */
function bookSignupBonusSPL() {
  const PF = window.PFLoyalty;
  let done = false;
  try { done = !!localStorage.getItem(SIGNUP_KEY_SPL); } catch (e) { /* ignore */ }
  if (done) return false;
  try { localStorage.setItem(SIGNUP_KEY_SPL, String(Date.now())); } catch (e) { /* ignore */ }
  try { PF && PF.awardPoints && PF.awardPoints(SIGNUP_POINTS_SPL, "Welcome bonus", "evt_signup"); } catch (e) { /* ignore */ }
  try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: SIGNUP_POINTS_SPL, label: "Welcome bonus", actionId: "evt_signup", booked: true, sound: "none" } })); } catch (e) { /* older WebView */ }
  return true;
}

/* Daily login reward: today's check-in through the engine (50 × tier
   multiplier, daily cap 1). Already checked in today → nothing is booked
   again, but the splash still shows the day's amount so the moment reads the
   same on every login. */
function bookLoginRewardSPL() {
  const PF = window.PFLoyalty;
  const fallback = 50;
  if (!PF || !PF.completeAction) return { points: fallback, booked: false };
  let res = null;
  try { res = PF.completeAction("evt_mobile_checkin"); } catch (e) { res = null; }
  if (res && res.ok && !res.capped && res.pointsAwarded > 0) {
    try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: res.pointsAwarded, label: "Mobile Check-In", actionId: "evt_mobile_checkin", booked: true, sound: "none" } })); } catch (e) { /* older WebView */ }
    return { points: res.pointsAwarded, booked: true, res };
  }
  let pts = fallback;
  try {
    const action = PF.getActionById("evt_mobile_checkin");
    const st = PF.getState();
    pts = Math.round(action.basePoints * PF.tierMultiplierFor(action, st.user.membershipTier));
  } catch (e) { /* keep fallback */ }
  return { points: pts, booked: false, res };
}

/* Which reward are we celebrating? Router payload first, then URL, then the
   current level badge. */
function pickRewardSPL() {
  const PF = window.PFLoyalty;
  const cfg = PF.getConfig();
  const q = new URLSearchParams(location.search);
  const kind = q.get("kind") || "";
  const key = q.get("key") || "";
  const first = (() => { try { const n = PF.getState().user.name || ""; return n.split(" ")[0]; } catch (e) { return ""; } })();
  if (kind === "login") {
    const st = PF.getState();
    const streak = (st.streak && st.streak.current) || 0;
    return { type: "login", key: "daily", title: "Welcome back" + (first ? ", " + first : "") + "!",
      sub: "Your daily login bonus is in" + (streak > 1 ? " — that's " + streak + " days in a row." : " — come back tomorrow to keep the streak going.") };
  }
  if (kind === "signup") {
    return { type: "signup", key: "welcome", title: "Welcome to PROfinity" + (first ? ", " + first : "") + "!",
      sub: "You've earned " + SIGNUP_POINTS_SPL + " points just for joining — your Prosperity Spiral starts here." };
  }
  let payload = null;
  try { payload = JSON.parse(sessionStorage.getItem("pf-celebration") || "null"); } catch (e) { /* ignore */ }
  const items = (payload && payload.items) || [];
  let item = items.find((m) => (!kind || m.type === kind) && (!key || m.key === key)) || null;
  if (!item && kind === "achievement") {
    const b = (cfg.achievementBadges || []).find((x) => x.key === key);
    if (b) item = { type: "achievement", key: b.key, title: b.name, sub: b.description, reward: b.reward, icon: b.icon, badge: b };
  }
  if (!item && kind === "league" && window.PFLeague) {
    const lg = window.PFLeague.getLeague ? window.PFLeague.getLeague(key) : null;
    if (lg) item = { type: "league", key: lg.key, title: "Welcome to the " + lg.name + " League", sub: "You've been promoted — a new leaderboard, new rivals, new prizes.", color: lg.accent, league: lg };
  }
  if (!item) {
    const state = PF.getState();
    const progress = PF.getBadgeProgress(state);
    let level = progress.current || cfg.levelBadges[0];
    if (kind === "level" && key) level = (cfg.levelBadges || []).find((x) => x.key === key) || level;
    item = { type: "level", key: level.key, badge: level, color: level.color,
      title: level.splashTitle || (level.name + " Unlocked!"),
      sub: "You've crossed " + PF.formatNumber(level.threshold) + " Lifetime Points as a PROfinity clinician." };
  }
  return item;
}

function MilestoneSplashScreen() {
  const PF = window.PFLoyalty;
  const state = PF.getState();
  const item = useMemoSPL(pickRewardSPL, []);
  const ret = returnUrlSPL(item.type === "signup" || item.type === "login" ? "NewsfeedMobile.html" : "RewardsDashboard.html");
  const wantsTour = new URLSearchParams(location.search).get("tour") === "1";

  /* sign-up: book the welcome bonus once; login: book today's check-in */
  const [loginPts] = useStateSPL(() => (item.type === "login" ? bookLoginRewardSPL().points : 0));
  useEffectSPL(() => { if (item.type === "signup") bookSignupBonusSPL(); }, []);
  /* the Reward Splash fanfare, the moment the screen appears */
  useEffectSPL(() => {
    try { window.dispatchEvent(new CustomEvent("pf:milestone", { detail: { kind: item.type, key: item.key } })); } catch (e) { /* older WebView */ }
  }, []);

  let kicker, title, sub, perks, icon, color, primary, primaryTo, onPrimary = null, bigPoints = 0, ghost = "Continue";
  const startTour = () => { try { localStorage.setItem("pf-tour", "1"); localStorage.setItem("pf-tour-step", "welcome"); if (/Web\.html/.test(ret)) localStorage.setItem("pf-tour-flavor", "web"); } catch (e) { /* ignore */ } goSPL(ret); };
  if (item.type === "login") {
    kicker = null;
    bigPoints = loginPts;
    title = item.title;
    sub = item.sub;
    perks = [];
    icon = null;
    color = "#d9a21b";
    primary = "Collect & continue"; primaryTo = ret;
    onPrimary = wantsTour ? startTour : null;
    ghost = null;
  } else if (item.type === "signup") {
    /* no kicker / perk list here — the rolling "+100" is the message */
    kicker = null;
    bigPoints = SIGNUP_POINTS_SPL;
    title = item.title;
    sub = item.sub;
    perks = [];
    icon = null;   /* no medal chip — the doctor and the "+100" carry it */
    color = "#d9a21b";
    primary = "Take the tour"; primaryTo = ret;
    /* same flags the auth pages' "Take the tour" set (web adds its flavour) */
    onPrimary = () => { try { localStorage.setItem("pf-tour", "1"); localStorage.setItem("pf-tour-step", "welcome"); if (/Web\.html/.test(ret)) localStorage.setItem("pf-tour-flavor", "web"); } catch (e) { /* ignore */ } goSPL(ret); };
  } else if (item.type === "achievement") {
    const b = item.badge || {};
    kicker = "Achievement Unlocked";
    title = item.title || b.name;
    sub = item.sub || b.description || "";
    perks = [item.reward || b.reward, "Badge added to your gallery", "Shown on your public profile"].filter(Boolean);
    icon = item.icon || b.icon || "lucide:award";
    color = "#d9a21b";
    primary = "View My Badges"; primaryTo = "BadgeGallery.html";
  } else if (item.type === "league") {
    const lg = item.league || {};
    kicker = "League Promotion";
    title = item.title || ("Welcome to the " + (lg.name || "next") + " League");
    sub = item.sub || "You've been promoted — a new leaderboard, new rivals, new prizes.";
    perks = ["A fresh leaderboard against " + (lg.name || "your new") + " rivals", "Bigger weekly league prizes", "League gem shown on your profile"];
    icon = "lucide:trophy";
    color = item.color || lg.accent || "var(--brand-gold)";
    primary = "See the Leaderboard"; primaryTo = "Leaderboard.html";
  } else {
    const level = item.badge || {};
    kicker = "Milestone Reached";
    title = item.title || (level.name + " Unlocked!");
    sub = item.sub || ("You've crossed " + PF.formatNumber(level.threshold || 0) + " Lifetime Points as a PROfinity clinician.");
    perks = level.splashPerks || [
      (PF.getConfig().tierMultipliers[state.user.membershipTier] || 1) + "x tier multiplier active",
      "New badge added to your gallery",
      "Featured in this month's Community spotlight"
    ];
    icon = "lucide:gem";
    color = item.color || level.color || "var(--brand-gold)";
    primary = "View My Badges"; primaryTo = "BadgeGallery.html";
  }

  const shownPoints = useCountUpSPL(bigPoints, 1100, 450);

  return (
    <div className="spl-screen" data-screen-label="Reward Splash">
      <button className="spl-close" type="button" aria-label="Close" onClick={() => goSPL(ret)}>
        <DSSPL.IconifyIcon name="lucide:x" size={20} color="#fff" />
      </button>
      <span className="spl-glow" aria-hidden="true" />
      <SplConfetti />
      <div className="spl-body">
        <div className={"spl-hero" + (item.type === "signup" || item.type === "login" ? " is-square" : "")}>
          <SplLottie src={item.type === "signup" || item.type === "login" ? SPL_SIGNUP_LOTTIE : SPL_LOTTIE} />
          {icon && (
            <span className="spl-medal" style={{ background: color }}>
              <DSSPL.IconifyIcon name={icon} size={26} color="#fff" />
            </span>
          )}
        </div>
        {kicker && <div className="spl-kicker">{kicker}</div>}
        {bigPoints > 0 && (
          <p className="spl-points" aria-live="polite" aria-label={"+" + bigPoints + " points"}>
            <b>+{shownPoints}</b><i>points</i>
          </p>
        )}
        <h1>{title}</h1>
        <p className="spl-sub">{sub}</p>

        {perks.length > 0 && (
          <div className="spl-perks">
            {perks.map((p, i) => (
              <div key={i} className="spl-perk-row"><DSSPL.IconifyIcon name="lucide:check-circle" size={18} color="var(--brand-gold)" /><span>{p}</span></div>
            ))}
          </div>
        )}
      </div>
      <div className="spl-foot">
        <button className="ml-btn ml-btn-gold" type="button" onClick={onPrimary || (() => goSPL(primaryTo))}>{primary}</button>
        {ghost && <button className="ml-btn ml-btn-ghost" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }} type="button" onClick={() => goSPL(ret)}>{ghost}</button>}
      </div>
    </div>
  );
}

function useDeviceScaleSPL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSPL(calc);
  useEffectSPL(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileSPL() {
  const [mobile, setMobile] = useStateSPL(() => window.matchMedia("(max-width:768px)").matches);
  useEffectSPL(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function MilestoneSplashApp() {
  const mobile = useIsMobileSPL();
  const scale = useDeviceScaleSPL();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--brand-navy)" }}><MilestoneSplashScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><MilestoneSplashScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MilestoneSplashApp />);
