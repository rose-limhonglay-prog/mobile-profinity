/* ===========================================================================
   PROfinity — Katy · Milestone Splash (Screens 9 & 10) · iPhone 17 Pro Max
   Full-screen congratulatory splash triggered when Katy crosses a major
   lifetime-points threshold (e.g. 50,000 → "Sapphire Collector"). Lists the
   perks unlocked at that level. Backed by window.PFLoyalty.
   Suffixed -SPL to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateSPL, useEffect: useEffectSPL } = React;
const DSSPL = window.ProfinityDesignSystem_c2b5cc;

function goSPL(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

function MilestoneSplashScreen() {
  const PF = window.PFLoyalty;
  const state = PF.getState();
  const progress = PF.getBadgeProgress(state);
  const level = progress.current || PF.getConfig().levelBadges[0];
  const title = level.splashTitle || (level.name + " Unlocked!");
  const perks = level.splashPerks || [
    (PF.getConfig().tierMultipliers[state.user.membershipTier] || 1) + "x tier multiplier active",
    "New badge added to your gallery",
    "Featured in this month's Community spotlight"
  ];

  return (
    <div className="spl-screen" data-screen-label="Milestone Splash">
      <button className="spl-close" type="button" aria-label="Close" onClick={() => goSPL("RewardsDashboard.html")}>
        <DSSPL.IconifyIcon name="lucide:x" size={20} color="#fff" />
      </button>
      <div className="spl-confetti" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => <span key={i} className={"spl-confetti-piece p" + (i % 6)} style={{ left: (i * 5.6) + "%", animationDelay: (i * 0.12) + "s" }} />)}
      </div>
      <div className="spl-body">
        <div className="spl-medal" style={{ background: level.color || "var(--brand-gold)" }}>
          <DSSPL.IconifyIcon name="lucide:gem" size={44} color="#fff" />
        </div>
        <div className="spl-kicker">Milestone Reached</div>
        <h1>{title}</h1>
        <p className="spl-sub">You've crossed {PF.formatNumber(level.threshold)} Lifetime Points as a PROfinity clinician.</p>

        <div className="spl-perks">
          {perks.map((p, i) => (
            <div key={i} className="spl-perk-row"><DSSPL.IconifyIcon name="lucide:check-circle" size={18} color="var(--brand-gold)" /><span>{p}</span></div>
          ))}
        </div>
      </div>
      <div className="spl-foot">
        <button className="ml-btn ml-btn-gold" type="button" onClick={() => goSPL("BadgeGallery.html")}>View My Badges</button>
        <button className="ml-btn ml-btn-ghost" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }} type="button" onClick={() => goSPL("RewardsDashboard.html")}>Continue</button>
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
