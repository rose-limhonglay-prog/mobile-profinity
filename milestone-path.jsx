/* ===========================================================================
   PROfinity — Katy · Milestone Path · iPhone 17 Pro Max
   A single vertical journey whose milestones ARE the six league badges
   (Jade → Topaz → Ruby → Emerald → Amethyst → Sapphire, window.PFLeague):
   each one unlocks a single one-time perk automatically and permanently the
   moment Lifetime Points cross its threshold (points are lifetime — never
   spent, never expired), and crossing it is also what moves the member up a
   league. No choices, no CTA to tap — this screen is a
   status view of a path the member is already walking.
   Reads window.PFLoyalty.getMilestoneProgress() (thresholds) and decorates
   each node with its league gem Lottie + accent. Classes prefixed mp-.
   Reached from the Rewards dashboard quick nav (mobile + web). Suffixed -MP.
   =========================================================================== */
const { useState: useStateMP, useEffect: useEffectMP, useMemo: useMemoMP } = React;
const DSMP = window.ProfinityDesignSystem_c2b5cc;
const PF_MP = window.PFLoyalty;
const LG_MP = window.PFLeague || null;

/* league gem (raw JSON via lottie-web); parked on a mid frame unless `play` */
function GemMP({ src, size, play }) {
  const host = React.useRef(null);
  useEffectMP(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: false, path: src });
      anim.addEventListener("DOMLoaded", () => { if (play) anim.play(); else anim.goToAndStop(Math.floor(anim.totalFrames * 0.4), true); });
    };
    if (window.lottie) start();
    else { t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120); setTimeout(() => clearInterval(t), 8000); }
    return () => { clearInterval(t); if (anim) anim.destroy(); };
  }, [src, play]);
  return <span ref={host} className="mp-gem" style={{ width: size, height: size }} aria-hidden="true" />;
}
function leagueMP(key) { try { return LG_MP && LG_MP.getLeague ? LG_MP.getLeague(key) : null; } catch (e) { return null; } }

function goMP(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
/* each perk's landing page (2026-10-13); desktop members (ret=…Web.html) get the web twin */
function landingMP(key) {
  const web = /Web\.html/i.test(retMP());
  return (web ? "RewardLandingWeb.html" : "RewardLanding.html") + "?reward=" + encodeURIComponent(key) + "&ret=" + encodeURIComponent("MilestonePath.html" + (web ? "?ret=" + retMP() : ""));
}
function retMP() {
  try { const r = new URLSearchParams(location.search).get("ret"); if (r && /^[A-Za-z0-9_./?=&-]+$/.test(r)) return r; } catch (e) {}
  return "RewardsDashboard.html";
}
function whenMP(iso) {
  if (!iso) return null;
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return null; }
}

function MilestoneNodeMP({ milestone, status, isLast, reachedAt }) {
  // status: "passed" | "current" | "locked"; redeemed = the perk's voucher has been minted on its landing page
  const reached = status === "passed" ? whenMP(reachedAt) : null;
  const redeemed = (() => { try { const pk = PF_MP.getPerk ? PF_MP.getPerk(milestone.key) : null; return !!(pk && pk.status === "redeemed"); } catch (e) { return false; } })();
  const league = leagueMP(milestone.key);
  const vars = league ? { "--lg-accent": league.accent, "--lg-deep": league.deep, "--lg-soft": league.soft } : null;
  return (
    <div className={"mp-node mp-node-" + status + (league ? " mp-node-league" : "")} style={vars}>
      <div className="mp-node-rail">
        <span className={"mp-node-dot mp-node-dot-" + status} aria-hidden="true">
          {status === "passed" ?
            <DSMP.IconifyIcon name="lucide:check" size={14} color="#fff" /> :
            status === "current" ?
              <DSMP.IconifyIcon name="lucide:map-pin" size={14} color="#fff" /> :
              <DSMP.IconifyIcon name="lucide:lock" size={13} color="#fff" />}
        </span>
        {!isLast && <span className={"mp-node-line mp-node-line-" + status} aria-hidden="true" />}
      </div>
      <div className="mp-node-body">
        <div className="mp-node-head">
          <span className="mp-node-title">
            {league ? <GemMP src={league.lottie} size={40} play={status === "current"} /> : null}
            <span className="mp-node-name">{milestone.name}{league ? <small> League</small> : null}</span>
          </span>
          <span className="mp-node-pts"><DSMP.IconifyIcon name="lucide:star" size={12} color="currentColor" />{milestone.threshold > 0 ? PF_MP.formatNumber(milestone.threshold) + " pts" : "Start"}</span>
        </div>
        <div className="mp-node-benefits">
          {milestone.benefits.map((b, i) => (
            <button key={i} type="button" className="mp-benefit-row" onClick={() => goMP(landingMP(milestone.key))}
              aria-label={b.title + (status === "passed" ? ", unlocked" : ", locked") + ". View reward"}>
              <span className="mp-benefit-ic" aria-hidden="true">
                <DSMP.IconifyIcon name={redeemed ? "lucide:ticket" : status === "locked" ? "lucide:lock" : "lucide:gift"} size={15} color={status === "locked" ? "var(--gray-400)" : "var(--brand-gold)"} />
              </span>
              <span className="mp-benefit-copy">
                <span className="mp-benefit-title">{b.title}</span>
                <span className="mp-benefit-desc">{b.description}</span>
                {b.delivery ? <span className="mp-benefit-delivery">{b.delivery}</span> : null}
                <span className={"mp-benefit-cta" + (status === "passed" && !redeemed ? " is-redeem" : "")}>{redeemed ? "Redeemed · view your reward" : status === "passed" ? "Redeem this perk" : "See this reward"}</span>
              </span>
              <span className="mp-benefit-chev" aria-hidden="true"><DSMP.IconifyIcon name="lucide:chevron-right" size={16} color="var(--gray-400)" /></span>
            </button>
          ))}
        </div>
        {status === "passed" && <div className="mp-node-tag mp-node-tag-passed"><DSMP.IconifyIcon name="lucide:check-circle" size={12} color="currentColor" />{milestone.threshold > 0 ? "Badge earned — yours for good" : "Your starting league"}{reached && milestone.threshold > 0 ? <span className="mp-node-when"> · {reached}</span> : null}</div>}
        {status === "current" && <div className="mp-node-tag mp-node-tag-current">Next league — unlocks automatically</div>}
        {status === "locked" && <div className="mp-node-tag mp-node-tag-locked">Locked</div>}
      </div>
    </div>
  );
}

/* Tapping a benefit row opens the reward's own landing page
   (RewardLanding.html?reward=<key>, 2026-10-13); the in-page reward sheet it
   replaced lived here until then. */

/* Header "?" opens this — the how-it-works copy used to sit in an always-on
   intro card above the progress; the user asked for it behind a help button. */
function MilestoneHelpSheetMP({ open, onClose }) {
  useEffectMP(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="mp-scrim" onClick={onClose}>
      <div className="mp-help-sheet" role="dialog" aria-modal="true" aria-labelledby="mp-help-title" onClick={(e) => e.stopPropagation()}>
        <span className="mp-help-handle" aria-hidden="true" />
        <div className="mp-help-head">
          <span className="mp-help-ic" aria-hidden="true"><DSMP.IconifyIcon name="lucide:milestone" size={20} color="var(--brand-navy)" /></span>
          <h2 id="mp-help-title">How the path works</h2>
          <button type="button" className="mp-help-close" aria-label="Close" onClick={onClose}><DSMP.IconifyIcon name="lucide:x" size={18} color="var(--gray-600)" /></button>
        </div>
        <p className="mp-help-p">Six levels, one journey — from Jade at 0 pts to Sapphire at 60,000 pts. The moment your Lifetime Points reach a league you move up and its single one-time perk unlocks.</p>
        <p className="mp-help-p">Points are lifetime: they are never spent and never expire, so every perk you unlock stays yours for good.</p>
        <button type="button" className="mp-help-ok" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

/* League progress card (moved here from the Rewards dashboard header,
   2026-09-24): current gem left, next gem greyed + locked right, points bar
   between them, "N of M pts" scale and "N more pts to X League" note.
   Reads PFLeague.getProgress() (thresholds = this very path); taps through to
   the Leaderboard. */
function LeagueProgressMP() {
  const [p, setP] = useStateMP(() => { try { return LG_MP ? LG_MP.getProgress() : null; } catch (e) { return null; } });
  useEffectMP(() => {
    const refresh = () => { try { setP(LG_MP ? LG_MP.getProgress() : null); } catch (e) {} };
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("pf:points-earned", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  if (!p || !p.current) return null;
  const cur = p.current, next = p.next, edge = next || cur;
  const vars = { "--lg-accent": cur.accent, "--lg-deep": cur.deep, "--nx-accent": edge.accent, "--nx-deep": edge.deep };
  return (
    <button type="button" className="mp-lg" style={vars} onClick={() => goMP("Leaderboard.html")}
      aria-label={cur.name + " League, " + (next ? PF_MP.formatNumber(p.need) + " more points to " + next.name : "highest badge") + ". Open the leaderboard"}>
      <span className="mp-lg-gem cur"><GemMP src={cur.lottie} size={60} play={true} /></span>
      <span className="mp-lg-body">
        <span className="mp-lg-top">
          <span style={{ color: "var(--lg-deep)" }}>{cur.name}</span>
          <span style={{ color: "var(--nx-deep)" }}>{next ? next.name : "Top badge"}</span>
        </span>
        <span className="ml-progress-track mp-lg-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.pct}>
          <span className="ml-progress-fill" style={{ width: p.pct + "%", background: "linear-gradient(90deg, var(--lg-accent), var(--nx-accent))" }} />
        </span>
        <span className="mp-lg-scale">
          <span>{PF_MP.formatNumber(p.points)}{next ? " of " + PF_MP.formatNumber(next.requires) : ""} pts</span>
          <span style={{ color: "var(--nx-deep)" }}>{next ? "Unlocks at " + PF_MP.formatNumber(next.requires) + " pts" : "Complete"}</span>
        </span>
        <span className="mp-lg-note">{next ? PF_MP.formatNumber(p.need) + " more pts to " + next.name + " League" : "You've reached Sapphire — the whole path, every benefit, is yours."}</span>
      </span>
      <span className={"mp-lg-gem next" + (next ? " locked" : "")}>
        <GemMP src={edge.lottie} size={60} play={false} />
        {next ? <span className="mp-lg-lock"><DSMP.IconifyIcon name="lucide:lock" size={12} color="#fff" /></span> : null}
      </span>
    </button>
  );
}

function MilestonePathScreen() {
  const [state, setState] = useStateMP(() => PF_MP.getState());
  const [helpOpen, setHelpOpen] = useStateMP(false);
  // ?reward=<milestoneKey> → that perk's landing page (the in-page sheet went 2026-10-13)
  useEffectMP(() => {
    try {
      const raw = new URLSearchParams(location.search).get("reward");
      if (raw) goMP(landingMP(raw.split(":")[0]));
    } catch (e) {}
  }, []);
  // other tabs / the points pill may book points while this is open
  useEffectMP(() => {
    const refresh = () => setState(PF_MP.getState());
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("pf:points-earned", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const progress = useMemoMP(() => PF_MP.getMilestoneProgress(state), [state]);
  const path = progress.path;
  const passedKeys = new Set(progress.passed.map((m) => m.key));
  const currentKey = progress.next ? progress.next.key : null;
  const reachedAt = state.milestonesReachedAt || {};
  const allDone = !progress.next;
  const redeemedCount = (state.redeemedVouchers || []).filter((v) => /^perk:/.test(v.itemId || "")).length;

  return (
    <div className="ml-screen mp-screen" data-screen-label="Milestone Path">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goMP(retMP())}><DSMP.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>My Rewards</h1>
        {/* Redeemed rewards sub page lives top-right (user, 2026-10-14; replaced the "?" help button) */}
        <button type="button" className="ml-top-action mp-redeemed-btn" aria-label={"Redeemed rewards, " + redeemedCount + " redeemed"} onClick={() => goMP("MyRewards.html?ret=MilestonePath.html")}>
          <DSMP.IconifyIcon name="lucide:ticket" size={20} color="var(--gray-900)" />
          {redeemedCount > 0 ? <span className="mp-redeemed-badge">{redeemedCount}</span> : null}
        </button>
      </div>
      <div className="ml-scroll mp-scroll">
        <LeagueProgressMP />
        <div className="mp-path">
          {path.map((m, i) => {
            const status = passedKeys.has(m.key) ? "passed" : m.key === currentKey ? "current" : "locked";
            return <MilestoneNodeMP key={m.key} milestone={m} status={status} isLast={i === path.length - 1} reachedAt={reachedAt[m.key]} />;
          })}
        </div>
        <div style={{ height: 24 }} />
      </div>
      <MilestoneHelpSheetMP open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

function useDeviceScaleMP() {
  const [scale, setScale] = useStateMP(() => Math.min(1, (window.innerHeight - 40) / 956));
  useEffectMP(() => { const u = () => setScale(Math.min(1, (window.innerHeight - 40) / 956)); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileMP() {
  const [mobile, setMobile] = useStateMP(() => window.matchMedia("(max-width:768px)").matches);
  useEffectMP(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}
/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkMP() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateMP(read);
  useEffectMP(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

function MilestonePathApp() {
  const mobile = useIsMobileMP();
  const scale = useDeviceScaleMP();
  const dark = useIsDarkMP();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><MilestonePathScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><MilestonePathScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MilestonePathApp />);
