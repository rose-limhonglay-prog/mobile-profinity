/* ===========================================================================
   PROfinity — Katy · Rewards Dashboard · iPhone 17 Pro Max
   Primary hub for the Loyalty & Gamification feature — 6th tab alongside
   Home / Profile / My Learning / Community / Agent. Reuses the same
   .app/.lm-screen/.lm-scroll/.lm-tabs device-frame conventions as the other
   primary tab screens (see learning-mobile.css) so the tab bar and status
   bar look identical. Classes prefixed rdb- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateRDB, useEffect: useEffectRDB, useRef: useRefRDB } = React;
const DSRDB = window.ProfinityDesignSystem_c2b5cc;
const MobileChromeC = window.MobileChromeC;
const PF_RDB = window.PFLoyalty;

function goRDB(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const RDB_TABS = [
  { key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
  { key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
  { key: "Learning", label: "Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
  { key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
  { key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "AgentMobile.html" },
  { key: "Rewards", label: "Rewards", icon: "lucide:gift", href: null }
];

function fmtClock(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
function fmtRelDate(iso) {
  const diffH = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (diffH < 1) return "just now";
  if (diffH < 24) return Math.round(diffH) + "h ago";
  return Math.round(diffH / 24) + "d ago";
}

function RdbTabBar({ compact }) {
  return (
    <nav className={"lm-tabs rdb-tabs" + (compact ? " lm-tabs-compact" : "")} aria-label="Primary">
      {RDB_TABS.map((t) => (
        <button key={t.key} className={"lm-tab" + (t.key === "Rewards" ? " on" : "")} aria-current={t.key === "Rewards" ? "page" : undefined} onClick={() => t.href && goRDB(t.href)}>
          <span className="ic"><DSRDB.IconifyIcon name={t.icon} size={24} color={t.key === "Rewards" ? "#fff" : "#000"} />{t.dot && <span className="dot">{t.dot}</span>}</span>
          <span className="lbl">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

function WalletDropdown({ state, open, onClose }) {
  if (!open) return null;
  const recent = state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 5);
  return (
    <div className="rdb-wallet-scrim" onClick={onClose}>
      <div className="rdb-wallet-dd" onClick={(e) => e.stopPropagation()}>
        <div className="rdb-wallet-dd-head">
          <div><div className="rdb-wallet-dd-label">Spendable Credits</div><div className="rdb-wallet-dd-value">{PF_RDB.formatNumber(state.spendableCredits)}</div></div>
          <div className="rdb-wallet-dd-divider" />
          <div><div className="rdb-wallet-dd-label">Lifetime Earned</div><div className="rdb-wallet-dd-value rdb-wallet-dd-value-sm">{PF_RDB.formatNumber(state.lifetimePoints)}</div></div>
        </div>
        <div className="rdb-wallet-dd-list">
          {recent.map((t) => (
            <div key={t.id} className="rdb-wallet-dd-row">
              <span>{t.label}</span>
              <span className="rdb-wallet-dd-amt" style={{ color: t.creditsDelta >= 0 ? "var(--success)" : "var(--error)" }}>{t.creditsDelta >= 0 ? "+" : ""}{t.creditsDelta} cr</span>
            </div>
          ))}
        </div>
        <button className="ml-btn ml-btn-gold" type="button" onClick={() => goRDB("RewardsStore.html")}>Go to Rewards Store<DSRDB.IconifyIcon name="lucide:arrow-right" size={16} color="#3D2A00" /></button>
      </div>
    </div>
  );
}

function NotificationPreview({ hoursLabel, body }) {
  return (
    <div className="rdb-notif-preview">
      <div className="rdb-notif-icon"><DSRDB.IconifyIcon name="lucide:bell-ring" size={16} color="var(--brand-navy)" /></div>
      <div className="rdb-notif-body"><div className="rdb-notif-title">PROfinity <span>{hoursLabel}</span></div><div className="rdb-notif-text">{body}</div></div>
    </div>
  );
}

/* Streak-at-risk banner (sits between the tier progress card and the stat
   tiles). The streak lapses 24h after the last check-in, so the banner shows
   whenever the member hasn't checked in for 12h+ (the engine's own same-day
   threshold) and counts down live to that moment; an explicit riskDeadline
   (demo button / server nudge) takes precedence. Checking in clears it. */
const RDB_STREAK_WINDOW_MS = 24 * 3600000;
const RDB_STREAK_WARN_MS = 12 * 3600000;
function rdbStreakDeadline(streak) {
  if (!streak || !streak.current || streak.frozen) return null;
  if (streak.riskDeadline) return new Date(streak.riskDeadline).getTime();
  const last = streak.lastCheckIn ? new Date(streak.lastCheckIn).getTime() : 0;
  if (!last || Date.now() - last < RDB_STREAK_WARN_MS) return null;
  return last + RDB_STREAK_WINDOW_MS;
}
function StreakRiskBanner({ state }) {
  const [now, setNow] = useStateRDB(() => Date.now());
  useEffectRDB(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const deadline = rdbStreakDeadline(state.streak);
  if (!deadline) return null;
  const remaining = deadline - now;
  const days = state.streak.current;
  return (
    <section className="rdb-risk-banner" aria-label={"Your " + days + "-day streak is at risk"}>
      <div className="rdb-risk-head"><DSRDB.IconifyIcon name="lucide:flame" size={22} color="#3D2A00" /><span>Your {days}-Day Streak is at Risk!</span></div>
      <div className="rdb-risk-clock" aria-live="off">Expires in {fmtClock(remaining)}</div>
      <div className="rdb-notif-stack">
        <NotificationPreview hoursLabel="· 6h before" body={"Don't lose your " + days + "-day streak — check in before it expires!"} />
        <NotificationPreview hoursLabel="· 2h before" body={"Last call! Your streak expires in 2 hours."} />
      </div>
    </section>
  );
}

/* Progress-card mascot: a looping smiling-face Lottie (lottie.host ArWGbXL6R3) fed as raw
   JSON through lottie-web — never the /embed iframe, which caches hard and
   ignores re-publishes. Replaced the shared smiling-beaker (PointsIconC) on
   2026-09-08; the header points pill (mobile.jsx / mobilechrome.jsx) has its
   same smiling-face Lottie, number in gold #D9A21B. The tooltip still
   reports lifetime points against the engine's beakerFullPoints scale. */
const RDB_MASCOT_SRC = "https://lottie.host/f5203bff-edd1-4727-a629-2a619bbe4edc/ArWGbXL6R3.json";
const RDB_LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
let rdbMascotPromise = null;
function rdbMascotData() {
  if (!rdbMascotPromise) {
    rdbMascotPromise = fetch(RDB_MASCOT_SRC).then((r) => r.ok ? r.json() : null).catch(() => { rdbMascotPromise = null; return null; });
  }
  return rdbMascotPromise;
}
/* Same data-pf-lottie marker as mobilechrome.jsx / app.jsx so the lib is injected once. */
function rdbEnsureLottieLib() {
  if (window.lottie || document.querySelector("script[data-pf-lottie]")) return;
  const sc = document.createElement("script");
  sc.src = RDB_LOTTIE_LIB;
  sc.async = true;
  sc.setAttribute("data-pf-lottie", "1");
  document.head.appendChild(sc);
}
function rdbReduceMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function rdbBeakerFull() {
  try { return Math.max(1, +PF_RDB.getConfig().beakerFullPoints || 20000); } catch (e) { return 20000; }
}
function rdbReadLifetime() {
  try { return Math.max(0, Math.round(PF_RDB.getState().lifetimePoints || 0)); } catch (e) { return 0; }
}
function RdbBeaker() {
  const host = React.useRef(null);
  const [ready, setReady] = useStateRDB(false);
  const [pts, setPts] = useStateRDB(rdbReadLifetime);
  useEffectRDB(() => {
    const refresh = () => setPts(rdbReadLifetime());
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("pf:points-earned", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  useEffectRDB(() => {
    let anim, iv, cancelled = false;
    const still = rdbReduceMotion();
    function start() {
      if (cancelled || !window.lottie || !host.current) return;
      rdbMascotData().then((data) => {
        if (!data || cancelled || !host.current) return;
        anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: !still, autoplay: !still, animationData: data,
          rendererSettings: { preserveAspectRatio: "xMidYMid meet", progressiveLoad: false } });
        anim.addEventListener("DOMLoaded", () => {
          if (cancelled) return;
          if (still) anim.goToAndStop(0, true);
          setReady(true);
        });
      });
    }
    rdbEnsureLottieLib();
    if (window.lottie) start();
    else { iv = setInterval(() => { if (window.lottie) { clearInterval(iv); iv = null; start(); } }, 120); setTimeout(() => { if (iv) clearInterval(iv); }, 8000); }
    return () => { cancelled = true; if (anim) anim.destroy(); if (iv) clearInterval(iv); };
  }, []);
  return (
    <span className="rdb-lottie rdb-beaker" aria-hidden="true" title={PF_RDB.formatNumber(pts) + " / " + PF_RDB.formatNumber(rdbBeakerFull()) + " pts"}>
      {!ready && <span className="rdb-beaker-fb"><DSRDB.IconifyIcon name="lucide:smile" size={56} color="#FCC25D" /></span>}
      <span ref={host} className={"rdb-beaker-anim" + (ready ? " on" : "")} />
    </span>
  );
}

function RdbHeader({ state, tier, onOpenWallet }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const LG = window.PFLeague;
  const p = LG ? LG.getProgress() : null;
  const cur = p ? p.current : null, next = p ? p.next : null;
  const pct = p ? p.pct : 0;
  return (
    <div className="rdb-head">
      <div className="rdb-head-row">
        <div className="rdb-head-greet">{greet}, {state.user.name}!</div>
      </div>
      {/* league badge progress: current gem on the left, the next gem and its
          milestone requirement on the right; tapping opens the leaderboard */}
      <button type="button" className="rdb-progress-card rdb-progress-league" onClick={() => goRDB("Leaderboard.html")}
        aria-label={cur ? cur.name + " League, " + (next ? p.need + " more milestones to " + next.name : "highest badge") + ". Open the leaderboard" : "Open the leaderboard"}
        style={cur ? { "--lg-accent": cur.accent, "--lg-deep": cur.deep, "--nx-accent": (next || cur).accent, "--nx-deep": (next || cur).deep } : null}>
        <span className="rdb-progress-gem cur">{cur && <RdbLeagueLottie src={cur.lottie} size={60} />}</span>
        <div className="rdb-progress-body">
          <div className="rdb-progress-top">
            <span style={{ color: "var(--lg-deep)" }}>{cur ? cur.name : "League"}</span>
            <span style={{ color: "var(--nx-deep)" }}>{next ? next.name : "Top badge"}</span>
          </div>
          <div className="ml-progress-track rdb-progress-track">
            <div className="ml-progress-fill" style={{ width: pct + "%", background: "linear-gradient(90deg, var(--lg-accent), var(--nx-accent))" }} />
          </div>
          <div className="rdb-progress-scale">
            <span>{p ? p.done + " of " + (next ? next.requires : p.total) + " milestones" : ""}</span>
            <span style={{ color: "var(--nx-deep)" }}>{next ? "Unlocks at " + next.requires : "Complete"}</span>
          </div>
          <div className="rdb-progress-note">{next ? p.need + " more milestone" + (p.need === 1 ? "" : "s") + " to " + next.name + " League" : "You've earned the highest badge!"}</div>
        </div>
        <span className={"rdb-progress-gem next" + (next ? " locked" : "")}>{(next || cur) && <RdbLeagueLottie src={(next || cur).lottie} size={60} />}
          {next && <span className="rdb-progress-lock"><DSRDB.IconifyIcon name="lucide:lock" size={12} color="#fff" /></span>}</span>
      </button>
    </div>
  );
}

function RdbEngagementCards({ state }) {
  return (
    <div className="rdb-eng-grid">
      <div className="ml-card rdb-eng-card">
        <span className="rdb-eng-lottie" aria-hidden="true"><iframe src="https://lottie.host/embed/c7c98875-fe8d-4de8-95c1-3e12acf7ad0a/fpeaeGfS64.json" title="" scrolling="no" style={{ width: "34px", height: "34px", border: "none", background: "transparent" }} /></span>
        <div className="rdb-eng-value">{PF_RDB.formatNumber(state.lifetimePoints)}</div>
        <div className="rdb-eng-label">Lifetime Points</div>
      </div>
      <div className="ml-card rdb-eng-card">
        <span className="rdb-eng-lottie" aria-hidden="true"><iframe src="https://lottie.host/embed/1470432e-8f5e-4eb4-a73c-75e6b6972d46/qk3KaEmMpz.json" title="" scrolling="no" style={{ width: "52px", height: "52px", border: "none", background: "transparent" }} /></span>
        <div className="rdb-eng-value">{PF_RDB.formatNumber(state.spendableCredits)}</div>
        <div className="rdb-eng-label">Spendable Credits</div>
      </div>
      <button className="ml-card rdb-eng-card rdb-eng-link" type="button" onClick={() => goRDB("CheckInStreak.html")} aria-label={"Active streak: " + state.streak.current + " days. Open check-in streak"}>
        <span className="rdb-eng-lottie" aria-hidden="true"><iframe src="https://lottie.host/embed/d7ce0087-b4ad-4b7a-b657-558f841da6e5/pSvC2r0DRZ.json" title="" scrolling="no" style={{ width: "52px", height: "52px", border: "none", background: "transparent" }} /></span>
        <div className="rdb-eng-value">{state.streak.current} Days</div>
        <div className="rdb-eng-label">Active Streak <DSRDB.IconifyIcon name="lucide:chevron-right" size={12} color="var(--gray-400)" /></div>
      </button>
    </div>
  );
}

/* The member's league badge (window.PFLeague) — tapping opens the leaderboard.
   Renders the gem as a Lottie via lottie-web (raw JSON, same as the leaderboard). */
function RdbLeagueLottie({ src, size }) {
  const host = useRefRDB(null);
  useEffectRDB(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: true, path: src });
    };
    if (window.lottie) start();
    else { t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120); setTimeout(() => clearInterval(t), 8000); }
    return () => { clearInterval(t); if (anim) anim.destroy(); };
  }, [src]);
  return <span ref={host} style={{ display: "block", width: size, height: size }} aria-hidden="true" />;
}
function RdbLeagueCard() {
  const LG = window.PFLeague;
  if (!LG) return null;
  const p = LG.getProgress();
  const cur = p.current, next = p.next;
  return (
    <button type="button" className="rdb-league" style={{ "--lg-accent": cur.accent, "--lg-deep": cur.deep, "--lg-soft": cur.soft }}
      onClick={() => goRDB("Leaderboard.html")} aria-label={cur.name + " League. Open the leaderboard"} data-screen-label="Your league">
      <span className="rdb-league-gem"><RdbLeagueLottie src={cur.lottie} size={64} /></span>
      <span className="rdb-league-tx">
        <span className="rdb-league-eyebrow">Your league</span>
        <b>{cur.name} League</b>
        <i>{next ? p.need + " more milestone" + (p.need === 1 ? "" : "s") + " to " + next.name : "Highest badge earned"}</i>
      </span>
      <span className="rdb-league-cta">Leaderboard<DSRDB.IconifyIcon name="lucide:chevron-right" size={16} color="var(--lg-deep)" /></span>
    </button>
  );
}

function RdbQuickNav() {
  let redeemed = 0;
  try { redeemed = (PF_RDB.getState().redeemedVouchers || []).length; } catch (e) {}
  const items = [
    { label: "Rewards Store", icon: "lucide:shopping-bag", href: "RewardsStore.html", dot: true },
    { label: "My Rewards", icon: "lucide:ticket", href: "MyRewards.html", note: redeemed > 0 ? String(redeemed) : null },
    { label: "Leaderboard", icon: "lucide:bar-chart-3", href: "Leaderboard.html", note: (window.PFLeague ? window.PFLeague.getCurrent().name : null) },
    { label: "Ways to Earn", icon: "lucide:sparkles", href: "WaysToEarn.html" }
  ];
  return (
    <div className="rdb-quicknav">
      {items.map((it) => (
        <button key={it.label} className="rdb-quicknav-item" type="button" onClick={() => goRDB(it.href)}>
          <span className="rdb-quicknav-icon">
            <DSRDB.IconifyIcon name={it.icon} size={20} color="#fff" />
            {it.dot ? <span className="rdb-quicknav-dot" aria-hidden="true" /> : null}
          </span>
          <span>
            {it.label}
            {it.note ? <i className="rdb-quicknav-note">{it.note}</i> : null}
            {it.dot ? <span className="sr-only"> — new rewards available</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}

function RdbRecentActivity({ state }) {
  const rows = state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 6);
  return (
    <div className="ml-card">
      {rows.map((t) => (
        <div key={t.id} className="rdb-activity-row">
          <span className="rdb-activity-label">{t.label}</span>
          <span className="rdb-activity-time">{fmtRelDate(t.ts)}</span>
          <span className={"rdb-activity-amt" + (t.pointsDelta > 0 ? "" : " is-spend")}>{t.pointsDelta > 0 ? "+" + t.pointsDelta + " pts" : "—"}</span>
        </div>
      ))}
    </div>
  );
}

function RdbNextReward({ state, config }) {
  const affordable = config.storeItems.filter((i) => i.cost <= state.spendableCredits + 500).sort((a, b) => a.cost - b.cost)[0] || config.storeItems[0];
  return (
    <button className="ml-card rdb-next-reward" type="button" onClick={() => goRDB("RewardsStore.html")}>
      <span className="rdb-next-reward-icon"><DSRDB.IconifyIcon name="lucide:gift" size={22} color="#561F22" /></span>
      <span className="rdb-next-reward-main"><span className="ti">Next Available Reward</span><span className="su">{affordable.name} · {PF_RDB.formatNumber(affordable.cost)} credits</span></span>
      <DSRDB.IconifyIcon name="lucide:chevron-right" size={18} color="var(--gray-400)" />
    </button>
  );
}

function RewardsDashboardHome() {
  const [state, setState] = useStateRDB(() => PF_RDB.getState());
  const [config, setConfig] = useStateRDB(() => PF_RDB.getConfig());
  const [walletOpen, setWalletOpen] = useStateRDB(false);
  const [toast, setToast] = useStateRDB(null);
  const refresh = () => { setState(PF_RDB.getState()); setConfig(PF_RDB.getConfig()); };
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2400); };
  const scrollRef = useRefRDB(null);
  const { hidden: chromeHidden, floating: chromeFloat } = window.PFUseHeaderHideC(scrollRef);

  return (
    <div className={"lm-screen rdb-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : "")} data-screen-label="Rewards Dashboard">
      <MobileChromeC />
      <div className="lm-scroll" ref={scrollRef}>
        <RdbHeader state={state} tier={state.user.membershipTier} onOpenWallet={() => setWalletOpen(true)} />
        <StreakRiskBanner state={state} />
        <div style={{ padding: "0 20px" }}>
          <RdbEngagementCards state={state} />
          <RdbLeagueCard />
          <div className="ml-sec-h"><h2>Jump back in</h2></div>
          <RdbQuickNav />
          <RdbNextReward state={state} config={config} />
          <div className="ml-sec-h"><h2>Recent Activity</h2></div>
          <RdbRecentActivity state={state} />
        </div>

        <div className="ml-demo-bar">
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.setStreakAtRisk(6); refresh(); }}>Demo: simulate streak at risk</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.setState({ lifetimePoints: 49700 }); goRDB("MilestoneSplash.html"); }}>Demo: simulate 50k milestone</button>
          <button className="ml-demo-btn" type="button" onClick={() => { if (window.PFEarnStreak) window.PFEarnStreak.show(375); }}>Demo: 5 in a row</button>
          <button className="ml-demo-btn" type="button" onClick={() => { if (window.PFDailyGoal) window.PFDailyGoal.reset(); goRDB("DailyGoal.html?ret=RewardsDashboard.html"); }}>Demo: daily goal reached</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.resetDemo(); refresh(); flash("Demo data reset."); }}>Reset demo data</button>
        </div>
        <div style={{ height: 90 }} />
      </div>
      <RdbTabBar compact={chromeHidden} />
      <WalletDropdown state={state} open={walletOpen} onClose={() => setWalletOpen(false)} />
      {toast && <div className="ml-toast"><DSRDB.IconifyIcon name="lucide:check-circle" size={16} color="#fff" />{toast}</div>}
    </div>
  );
}

function useDeviceScaleRDB() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRDB(calc);
  useEffectRDB(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileRDB() {
  const [mobile, setMobile] = useStateRDB(() => window.matchMedia("(max-width:768px)").matches);
  useEffectRDB(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function RewardsDashboardApp() {
  const mobile = useIsMobileRDB();
  const scale = useDeviceScaleRDB();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><RewardsDashboardHome /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><RewardsDashboardHome /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<RewardsDashboardApp />);
