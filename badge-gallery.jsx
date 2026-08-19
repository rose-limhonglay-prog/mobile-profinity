/* ===========================================================================
   PROfinity — Katy · Badge Gallery (Screen 15) · iPhone 17 Pro Max
   Grid of all collectible achievement badges plus the Bronze→Diamond level
   ladder, highlighting earned vs locked with completion indicators. Tapping
   a badge opens Badge Detail. Backed by window.PFLoyalty. Suffixed -BGL.
   =========================================================================== */
const { useState: useStateBGL, useMemo: useMemoBGL } = React;
const DSBGL = window.ProfinityDesignSystem_c2b5cc;
const PF_BGL = window.PFLoyalty;

function goBGL(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

function achievementCount(state, badge) {
  const c = badge.criteria;
  if (c.type === "actionCount") return state.ledger.filter((t) => t.pointsDelta > 0 && (c.actionId ? t.actionId === c.actionId : true)).length;
  if (c.type === "redeemCount") return state.redeemedVouchers.length;
  if (c.type === "streak") return Math.max(state.streak.current, state.streak.longest);
  return 0;
}

function BadgeGalleryScreen() {
  const [config] = useStateBGL(() => PF_BGL.getConfig());
  const [state] = useStateBGL(() => PF_BGL.getState());
  const progress = useMemoBGL(() => PF_BGL.getBadgeProgress(state), [state]);

  return (
    <div className="ml-screen bgl-screen" data-screen-label="Badge Gallery">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goBGL("RewardsDashboard.html")}><DSBGL.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Badge Gallery</h1>
        <span />
      </div>
      <div className="ml-scroll">
        <div className="ml-sec-h"><h2>Level Ladder</h2></div>
        <div className="bgl-ladder">
          {config.levelBadges.map((b) => {
            const earned = state.lifetimePoints >= b.threshold;
            const isCurrent = progress.current && progress.current.key === b.key;
            return (
              <div key={b.key} className={"bgl-ladder-item" + (earned ? " is-earned" : "")}>
                <span className="bgl-ladder-dot" style={{ background: earned ? b.color : "var(--gray-200)" }}>
                  {earned ? <DSBGL.IconifyIcon name="lucide:check" size={14} color="#fff" /> : <DSBGL.IconifyIcon name="lucide:lock" size={12} color="var(--gray-400)" />}
                </span>
                <span className="bgl-ladder-name">{b.name}</span>
                {isCurrent && <span className="bgl-ladder-current">You</span>}
              </div>
            );
          })}
        </div>

        <div className="ml-sec-h"><h2>Collectible Badges</h2></div>
        <div className="bgl-grid">
          {config.achievementBadges.map((b) => {
            const unlocked = state.unlockedAchievements.includes(b.key);
            const count = achievementCount(state, b);
            const target = b.criteria.count;
            const pct = Math.min(100, Math.round((count / target) * 100));
            return (
              <button key={b.key} type="button" className={"bgl-tile" + (unlocked ? " is-unlocked" : "")} onClick={() => goBGL("BadgeDetail.html?badge=" + b.key)}>
                <span className="bgl-tile-icon"><DSBGL.IconifyIcon name={b.icon} size={24} color={unlocked ? "var(--brand-navy)" : "var(--gray-400)"} /></span>
                <span className="bgl-tile-name">{b.name}</span>
                {!unlocked && <div className="ml-progress-track" style={{ width: "80%", margin: "6px auto 0" }}><div className="ml-progress-fill" style={{ width: pct + "%" }} /></div>}
                {!unlocked && <span className="bgl-tile-progress">{Math.min(count, target)}/{target}</span>}
                {unlocked && <span className="bgl-tile-earned"><DSBGL.IconifyIcon name="lucide:check-circle" size={13} color="var(--success)" />Earned</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function useDeviceScaleBGL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateBGL(calc);
  React.useEffect(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileBGL() {
  const [mobile, setMobile] = useStateBGL(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function BadgeGalleryApp() {
  const mobile = useIsMobileBGL();
  const scale = useDeviceScaleBGL();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><BadgeGalleryScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><BadgeGalleryScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<BadgeGalleryApp />);
