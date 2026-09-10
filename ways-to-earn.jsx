/* ===========================================================================
   PROfinity — Katy · Ways to Earn (Screen 17) · iPhone 17 Pro Max
   Active multiplier banner plus point-earning actions organised by category
   with "Earn Now" buttons that call window.PFLoyalty.completeAction — a
   live run-through of the caps/velocity/silent-cap anti-cheat pipeline.
   Suffixed -WTE.
   =========================================================================== */
const { useState: useStateWTE, useMemo: useMemoWTE, useEffect: useEffectWTE } = React;
const DSWTE = window.ProfinityDesignSystem_c2b5cc;
const PF_WTE = window.PFLoyalty;

function goWTE(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* Actions that can never pay again (one-time lock / lifetime cap reached) read
   as completed instead of offering a button that only toasts a cap message. */
function isExhaustedWTE(action, state) {
  const c = (state.actionCounts || {})[action.id];
  if (!c) return false;
  if (action.oneTimeLock && c.lifetimeCount >= 1) return true;
  return action.lifetimeCap != null && c.lifetimeCount >= action.lifetimeCap;
}

function WaysToEarnScreen() {
  const [config] = useStateWTE(() => PF_WTE.getConfig());
  const [state, setState] = useStateWTE(() => PF_WTE.getState());
  const [toast, setToast] = useStateWTE(null);

  /* Stay in step with the rest of the prototype (Profile targets, Rewards
     Dashboard demo buttons, a second tab) — the engine lives in localStorage. */
  useEffectWTE(() => {
    const refresh = () => setState(PF_WTE.getState());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const tier = state.user.membershipTier;
  const multiplier = config.tierMultipliers[tier] || 1;

  const grouped = useMemoWTE(() => {
    const byCat = {};
    config.actions.filter((a) => a.active).forEach((a) => { (byCat[a.category] = byCat[a.category] || []).push(a); });
    return byCat;
  }, [config]);

  const earn = (action) => {
    const res = PF_WTE.completeAction(action.id);
    setState(PF_WTE.getState());
    if (res.capped) setToast(action.label + ": " + res.capReason);
    else {
      setToast("+" + res.pointsAwarded + " pts · +" + res.creditsAwarded + " credits");
      /* same event popPoints (app.jsx) fires so any header points pill / tally listening on the page bumps */
      try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: res.pointsAwarded, label: action.label, actionId: action.id, booked: true } })); } catch (e) { /* older WebView */ }
    }
    setTimeout(() => setToast(null), 2600);
    /* crossing the next threshold hands off to the Milestone Splash */
    if (res.leveledUp) setTimeout(() => goWTE("MilestoneSplash.html"), 900);
  };

  return (
    <div className="ml-screen wte-screen" data-screen-label="Ways to Earn">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goWTE("RewardsDashboard.html")}><DSWTE.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Ways to Earn</h1>
        <span />
      </div>
      <div className="ml-scroll wte-scroll">
        <div className="wte-multiplier-banner">
          <DSWTE.IconifyIcon name="lucide:crown" size={18} color="currentColor" />
          <span>{tier} Tier Active — {multiplier}x Multiplier</span>
        </div>

        {Object.keys(grouped).map((cat) => (
          <div key={cat}>
            <div className="ml-sec-h"><h2>{cat}</h2></div>
            {grouped[cat].map((a) => {
              const projected = Math.round(a.basePoints * PF_WTE.tierMultiplierFor(a, tier));
              const done = isExhaustedWTE(a, state);
              return (
                <div key={a.id} className={"ml-card wte-row" + (done ? " is-done" : "")}>
                  <div className="wte-row-main">
                    <span className="ti">{a.label}</span>
                    <span className="su">{a.guardrail}</span>
                  </div>
                  {done
                    ? <span className="wte-done" aria-label="Completed"><DSWTE.IconifyIcon name="lucide:check" size={14} color="currentColor" /> Done</span>
                    : <button className="ml-btn ml-btn-sm ml-btn-navy" type="button" aria-label={"Earn " + projected + " points: " + a.label} onClick={() => earn(a)}>+{projected} <span className="wte-pts-label">pts</span></button>}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ height: 8 }} />
      </div>
      {toast && <div className="ml-toast" role="status"><DSWTE.IconifyIcon name="lucide:zap" size={16} color="#fff" />{toast}</div>}
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
