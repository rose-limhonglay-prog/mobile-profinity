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

function RdbTabBar() {
  return (
    <nav className="lm-tabs rdb-tabs" aria-label="Primary">
      {RDB_TABS.map((t) => (
        <button key={t.key} className={"lm-tab" + (t.key === "Rewards" ? " on" : "")} aria-current={t.key === "Rewards" ? "page" : undefined} onClick={() => t.href && goRDB(t.href)}>
          <span className="ic"><DSRDB.IconifyIcon name={t.icon} size={24} color={t.key === "Rewards" ? "#fff" : "#000"} />{t.dot && <span className="dot">{t.dot}</span>}</span>
          {t.label}
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
        <button className="ml-btn ml-btn-gold" type="button" onClick={() => goRDB("RewardsStore.html")}>Go to Rewards Store<DSRDB.IconifyIcon name="lucide:arrow-right" size={16} color="#fff" /></button>
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

function StreakRiskBanner({ state, onSimResolve }) {
  const [now, setNow] = useStateRDB(() => Date.now());
  useEffectRDB(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (!state.streak.riskDeadline) return null;
  const remaining = new Date(state.streak.riskDeadline).getTime() - now;
  return (
    <div className="rdb-risk-banner">
      <div className="rdb-risk-head"><DSRDB.IconifyIcon name="lucide:flame" size={20} color="#fff" /><span>Your {state.streak.current}-Day Streak is at Risk!</span></div>
      <div className="rdb-risk-clock">Expires in {fmtClock(remaining)}</div>
      <div className="rdb-risk-ctas">
        <button className="ml-btn ml-btn-sm" type="button" onClick={() => { PF_RDB.completeAction("evt_webinar_attend"); onSimResolve(); }}>Read daily article</button>
        <button className="ml-btn ml-btn-sm" style={{ background: "rgba(255,255,255,.22)", color: "#fff" }} type="button" onClick={() => goRDB("RewardsStore.html")}>Share a reward</button>
      </div>
      <div className="rdb-notif-stack">
        <NotificationPreview hoursLabel="· 6h before" body={"Don't lose your " + state.streak.current + "-day streak — check in before it expires!"} />
        <NotificationPreview hoursLabel="· 2h before" body={"Last call! Your streak expires in 2 hours."} />
      </div>
    </div>
  );
}

function RdbHeader({ state, tier, onOpenWallet }) {
  const progress = PF_RDB.getBadgeProgress(state);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="rdb-head">
      <div className="rdb-head-row">
        <div className="rdb-head-greet">{greet}, {state.user.name}!</div>
        <button className="rdb-wallet-chip" type="button" onClick={onOpenWallet}>
          <DSRDB.IconifyIcon name="lucide:wallet" size={15} color="#fff" />{PF_RDB.formatNumber(state.spendableCredits)}
        </button>
      </div>
      <span className="rdb-tierpill"><DSRDB.IconifyIcon name="lucide:crown" size={12} color="#fff" /> {tier} Membership</span>
      <div className="rdb-progress-card">
        <span className="rdb-lottie" aria-hidden="true">
          <iframe src="https://lottie.host/embed/6f0e55a1-dc57-49d4-b476-c3bf42c31413/GbttNIK744.json" title="" scrolling="no" style={{ width: "88px", height: "88px", border: "none", background: "transparent" }} />
        </span>
        <div className="rdb-progress-body">
          <div className="rdb-progress-top">
            <span>{progress.current ? progress.current.name : "Unranked"}</span>
            <span>{progress.next ? progress.next.name : "Top tier"}</span>
          </div>
          <div className="ml-progress-track rdb-progress-track">
            <div className="ml-progress-fill" style={{ width: progress.pct + "%" }} />
            {progress.next ? <span className="rdb-progress-marker" title={PF_RDB.formatNumber(progress.next.threshold || 0) + " pts"}><DSRDB.IconifyIcon name="lucide:star" size={11} color="#fff" /></span> : null}
          </div>
          {progress.next ? (
            <div className="rdb-progress-scale">
              <span>{PF_RDB.formatNumber(state.lifetimePoints)} pts</span>
              <span>{PF_RDB.formatNumber((state.lifetimePoints || 0) + (progress.remaining || 0))} pts</span>
            </div>
          ) : null}
          <div className="rdb-progress-note">{progress.next ? PF_RDB.formatNumber(progress.remaining) + " pts away from " + progress.next.name : "You've reached the top badge tier!"}</div>
        </div>
      </div>
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
      <div className="ml-card rdb-eng-card">
        <span className="rdb-eng-lottie" aria-hidden="true"><iframe src="https://lottie.host/embed/d7ce0087-b4ad-4b7a-b657-558f841da6e5/pSvC2r0DRZ.json" title="" scrolling="no" style={{ width: "52px", height: "52px", border: "none", background: "transparent" }} /></span>
        <div className="rdb-eng-value">{state.streak.current} Days</div>
        <div className="rdb-eng-label">Active Streak</div>
      </div>
    </div>
  );
}

function RdbQuickNav() {
  const items = [
    { label: "Badge Progress", icon: "lucide:target", href: "BadgeProgress.html" },
    { label: "Rewards Store", icon: "lucide:shopping-bag", href: "RewardsStore.html", dot: true },
    { label: "Leaderboard", icon: "lucide:bar-chart-3", href: "Leaderboard.html", note: "#12" },
    { label: "Badge Gallery", icon: "lucide:award", href: "BadgeGallery.html" },
    { label: "Ways to Earn", icon: "lucide:sparkles", href: "WaysToEarn.html" }
  ];
  return (
    <div className="rdb-quicknav">
      {items.map((it) => (
        <button key={it.label} className="rdb-quicknav-item" type="button" onClick={() => goRDB(it.href)}>
          <span className="rdb-quicknav-icon">
            <DSRDB.IconifyIcon name={it.icon} size={20} color="var(--brand-navy)" />
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
      <span className="rdb-next-reward-icon"><DSRDB.IconifyIcon name="lucide:gift" size={22} color="#fff" /></span>
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

  return (
    <div className="lm-screen rdb-screen" data-screen-label="Rewards Dashboard">
      <MobileChromeC />
      <div className="lm-scroll">
        <RdbHeader state={state} tier={state.user.membershipTier} onOpenWallet={() => setWalletOpen(true)} />
        <StreakRiskBanner state={state} onSimResolve={() => { refresh(); flash("Nice — streak saved!"); }} />
        <div style={{ padding: "0 20px" }}>
          <RdbEngagementCards state={state} />
          <div className="ml-sec-h"><h2>Jump back in</h2></div>
          <RdbQuickNav />
          <RdbNextReward state={state} config={config} />
          <div className="ml-sec-h"><h2>Recent Activity</h2></div>
          <RdbRecentActivity state={state} />
        </div>

        <div className="ml-demo-bar">
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.setStreakAtRisk(6); refresh(); }}>Demo: simulate streak at risk</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.setState({ lifetimePoints: 49700 }); goRDB("MilestoneSplash.html"); }}>Demo: simulate 50k milestone</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.resetDemo(); refresh(); flash("Demo data reset."); }}>Reset demo data</button>
        </div>
        <div style={{ height: 90 }} />
      </div>
      <RdbTabBar />
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
