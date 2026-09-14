/* ===========================================================================
   PROfinity — Katy · Ways to Earn (Screen 17) · iPhone 17 Pro Max
   Simple list of every point-earning action grouped by category with a tinted icon medallion and
   a navy 12px "+N pts" button that calls window.PFLoyalty.completeAction —
   a live run-through of the caps/velocity/silent-cap anti-cheat pipeline.
   Suffixed -WTE.
   =========================================================================== */
const { useState: useStateWTE, useMemo: useMemoWTE, useEffect: useEffectWTE, useRef: useRefWTE } = React;
const DSWTE = window.ProfinityDesignSystem_c2b5cc;
const PF_WTE = window.PFLoyalty;

function goWTE(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* one icon + pastel per action category (same tones the Rewards Store uses) */
const WTE_CATEGORIES = {
  Habit:      { icon: "lucide:flame",          a: "#FFE3A3", b: "#FFC65C", ink: "#8A5303", blurb: "Small daily habits, big streaks" },
  Social:     { icon: "lucide:heart",          a: "#FFD6E0", b: "#FFA3BC", ink: "#B0335A", blurb: "Show the community some love" },
  Community:  { icon: "lucide:users",          a: "#D2F5EA", b: "#8FE0C8", ink: "#137A5B", blurb: "Share what you know" },
  Learning:   { icon: "lucide:graduation-cap", a: "#D9EAFF", b: "#A6CCFF", ink: "#1F5AA8", blurb: "Level up your skills" },
  Reviews:    { icon: "lucide:star",           a: "#FFF0C2", b: "#FFD666", ink: "#8A5303", blurb: "Help others choose well" },
  Profile:    { icon: "lucide:user-pen",       a: "#E7DFFF", b: "#C5B3FF", ink: "#5B3FBF", blurb: "Tell your story" },
  Onboarding: { icon: "lucide:id-card",        a: "#DDF3FF", b: "#9FDCFF", ink: "#0F6B9A", blurb: "One-time set-up wins" },
  Purchases:  { icon: "lucide:shopping-bag",   a: "#FFE2CF", b: "#FFB98A", ink: "#9A4A12", blurb: "Points back on every order" },
};
const WTE_CAT_ORDER = ["Habit", "Social", "Community", "Learning", "Reviews", "Profile", "Onboarding", "Purchases"];
const WTE_DEFAULT = { icon: "lucide:sparkles", a: "#FFE3A3", b: "#FFC65C", ink: "#8A5303", blurb: "" };
const WTE_ACTION_ICONS = {
  evt_mobile_checkin: "lucide:calendar-check", evt_react_post: "lucide:heart", evt_comment_post: "lucide:message-circle", evt_refer_colleague: "lucide:user-plus",
  evt_case_study_share: "lucide:file-heart", evt_course_complete: "lucide:graduation-cap", evt_webinar_attend: "lucide:video", evt_prod_review_submit: "lucide:star",
  evt_bio_write: "lucide:pen-line", evt_license_verify: "lucide:badge-check", evt_profile_complete: "lucide:user-check", evt_purchase_item: "lucide:shopping-bag",
};
function catWTE(name) { return WTE_CATEGORIES[name] || WTE_DEFAULT; }
function iconWTE(a) { return WTE_ACTION_ICONS[a.id] || catWTE(a.category).icon; }

/* Actions that can never pay again (one-time lock / lifetime cap reached) read
   as completed instead of offering a button that only toasts a cap message. */
function isExhaustedWTE(action, state) {
  const c = (state.actionCounts || {})[action.id];
  if (!c) return false;
  if (action.oneTimeLock && c.lifetimeCount >= 1) return true;
  return action.lifetimeCap != null && c.lifetimeCount >= action.lifetimeCap;
}

/* little coin burst from the button that just paid out */
function burstWTE(root, el) {
  if (!root || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#F4AD3D", "#FFD76A", "#FF8FAE", "#5ED3B1", "#8DC5FF"];
  const rr = root.getBoundingClientRect(), r = el.getBoundingClientRect();
  const x = r.left + r.width / 2 - rr.left, y = r.top + r.height / 2 - rr.top;
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    p.className = "wte-confetti";
    const size = 6 + Math.random() * 7;
    p.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + size + "px;height:" + size + "px;background:" + colors[i % colors.length] + ";border-radius:" + (Math.random() > .4 ? "50%" : "2px");
    root.appendChild(p);
    const ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.3, dist = 60 + Math.random() * 90;
    const a = p.animate([
      { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
      { transform: "translate(calc(-50% + " + (Math.cos(ang) * dist).toFixed(0) + "px), calc(-50% + " + (Math.sin(ang) * dist + 60).toFixed(0) + "px)) scale(.5)", opacity: 0 }
    ], { duration: 700 + Math.random() * 400, easing: "cubic-bezier(.15,.7,.3,1)", fill: "forwards" });
    a.onfinish = () => p.remove();
  }
}

function WaysToEarnScreen() {
  const [config] = useStateWTE(() => PF_WTE.getConfig());
  const [state, setState] = useStateWTE(() => PF_WTE.getState());
  const [toast, setToast] = useStateWTE(null);
  const screenRef = useRefWTE(null);

  /* Stay in step with the rest of the prototype (Profile targets, Rewards
     Dashboard demo buttons, a second tab) — the engine lives in localStorage. */
  useEffectWTE(() => {
    const refresh = () => setState(PF_WTE.getState());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const tier = state.user.membershipTier;
  const actions = useMemoWTE(() => config.actions.filter((a) => a.active), [config]);

  const grouped = useMemoWTE(() => {
    const byCat = {};
    actions.forEach((a) => { (byCat[a.category] = byCat[a.category] || []).push(a); });
    const order = WTE_CAT_ORDER.filter((c) => byCat[c]).concat(Object.keys(byCat).filter((c) => !WTE_CAT_ORDER.includes(c)));
    return order.map((c) => ({ name: c, items: byCat[c] }));
  }, [actions]);

  const earn = (action, el) => {
    const res = PF_WTE.completeAction(action.id);
    setState(PF_WTE.getState());
    if (res.capped) setToast({ kind: "cap", text: action.label + ": " + res.capReason });
    else {
      burstWTE(screenRef.current, el);
      setToast({ kind: "win", text: "+" + res.pointsAwarded + " pts · +" + res.creditsAwarded + " credits" });
      /* same event popPoints (app.jsx) fires so any header points pill / tally listening on the page bumps */
      try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: res.pointsAwarded, label: action.label, actionId: action.id, booked: true } })); } catch (e) { /* older WebView */ }
    }
    setTimeout(() => setToast(null), 2600);
    /* crossing the next threshold hands off to the Milestone Splash */
    if (res.leveledUp) setTimeout(() => goWTE("MilestoneSplash.html"), 900);
  };

  return (
    <div className="ml-screen wte-screen" data-screen-label="Ways to Earn" ref={screenRef}>
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goWTE("RewardsDashboard.html")}><DSWTE.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Ways to Earn</h1>
        <span />
      </div>
      <div className="ml-scroll wte-scroll">

        {grouped.map((g, gi) => {
          const c = catWTE(g.name);
          return (
            <div key={g.name} className="wte-group" style={{ "--wte-a": c.a, "--wte-b": c.b, "--wte-ink": c.ink, "--wte-i": gi }}>
              <div className="wte-group-h">
                <span className="wte-group-ic"><DSWTE.IconifyIcon name={c.icon} size={16} color={c.ink} /></span>
                <h2>{g.name}</h2>
                {c.blurb && <span className="wte-group-blurb">{c.blurb}</span>}
              </div>
              <div className="wte-list">
                {g.items.map((a) => {
                  const projected = Math.round(a.basePoints * PF_WTE.tierMultiplierFor(a, tier));
                  const done = isExhaustedWTE(a, state);
                  return (
                    <div key={a.id} className={"wte-row" + (done ? " is-done" : "")}>
                      <span className="wte-row-ic"><DSWTE.IconifyIcon name={done ? "lucide:check" : iconWTE(a)} size={19} color={c.ink} /></span>
                      <div className="wte-row-main">
                        <span className="ti">{a.label}</span>
                        <span className="su">{a.guardrail}</span>
                      </div>
                      {done
                        ? <span className="wte-done" aria-label="Completed"><DSWTE.IconifyIcon name="lucide:check" size={14} color="currentColor" /> Done</span>
                        : <button className="wte-earn" type="button" aria-label={"Earn " + projected + " points: " + a.label} onClick={(e) => earn(a, e.currentTarget)}>+{projected} <span className="wte-pts-label">pts</span></button>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{ height: 8 }} />
      </div>
      {toast && <div className={"ml-toast wte-toast " + toast.kind} role="status"><DSWTE.IconifyIcon name={toast.kind === "win" ? "lucide:zap" : "lucide:clock"} size={16} color={toast.kind === "win" ? "#FDBF38" : "#fff"} />{toast.text}</div>}
    </div>
  );
}

function useDeviceScaleWTE() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateWTE(calc);
  useEffectWTE(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileWTE() {
  const [mobile, setMobile] = useStateWTE(() => window.matchMedia("(max-width:768px)").matches);
  useEffectWTE(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}
/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkWTE() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateWTE(read);
  useEffectWTE(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

function WaysToEarnApp() {
  const mobile = useIsMobileWTE();
  const scale = useDeviceScaleWTE();
  const dark = useIsDarkWTE();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><WaysToEarnScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><WaysToEarnScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<WaysToEarnApp />);
