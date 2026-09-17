/* ===========================================================================
   PROfinity — Rewards Dashboard (web)
   Desktop counterpart to RewardsDashboard.html (rewards-dashboard.jsx): the
   Loyalty & Gamification hub — greeting, league badge progress card (PFLeague
   gems, milestone-based), streak-at-risk banner, Lifetime Points / Spendable
   Credits / Active Streak stat tiles (streak → CheckInStreak), "Your league"
   card, "Jump back in" quick nav (Store / My Rewards / Leaderboard / Ways to
   Earn), Next Available Reward (course discount) and Recent Activity — on the
   web page shell (TopNav + centered two-column layout)
   instead of the phone frame. Reads/writes the same localStorage-backed
   window.PFLoyalty engine, so the numbers match the mobile screens. Reached from
   the account menu (account-menu.js). Suffixed -RW to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateRW, useEffect: useEffectRW, useRef: useRefRW } = React;
const DSRW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavRW, IconifyIcon: IconifyRW } = DSRW;
const PF_RW = window.PFLoyalty;

const ME_RW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goRW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateRW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goRW(u);
}

function fmtClockRW(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
function fmtRelDateRW(iso) {
  const diffH = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (diffH < 1) return "just now";
  if (diffH < 24) return Math.round(diffH) + "h ago";
  return Math.round(diffH / 24) + "d ago";
}
function fmtFullDateRW(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + " · " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/* --------------------------------------------------------- risk banner */
/* Same rule as the mobile page: the streak lapses 24h after the last check-in,
   so warn from 12h+ without a check-in (or an explicit riskDeadline). */
const RW_STREAK_WINDOW_MS = 24 * 3600000;
const RW_STREAK_WARN_MS = 12 * 3600000;
function rwStreakDeadline(streak) {
  if (!streak || !streak.current || streak.frozen) return null;
  if (streak.riskDeadline) return new Date(streak.riskDeadline).getTime();
  const last = streak.lastCheckIn ? new Date(streak.lastCheckIn).getTime() : 0;
  if (!last || Date.now() - last < RW_STREAK_WARN_MS) return null;
  return last + RW_STREAK_WINDOW_MS;
}
function NotificationPreviewRW({ hoursLabel, body }) {
  return (
    <div className="rw-notif-preview">
      <div className="rw-notif-icon"><IconifyRW name="lucide:bell-ring" size={16} color="var(--brand-navy)" /></div>
      <div className="rw-notif-body"><div className="rw-notif-title">PROfinity <span>{hoursLabel}</span></div><div className="rw-notif-text">{body}</div></div>
    </div>
  );
}
function StreakRiskBannerRW({ state, onCheckIn }) {
  const [now, setNow] = useStateRW(() => Date.now());
  useEffectRW(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const deadline = rwStreakDeadline(state.streak);
  if (!deadline) return null;
  const remaining = deadline - now;
  const days = state.streak.current;
  return (
    <section className="rw-risk-banner" aria-label={"Your " + days + "-day streak is at risk"}>
      <div className="rw-risk-main">
        <div className="rw-risk-head"><IconifyRW name="lucide:flame" size={24} color="#3D2A00" /><span>Your {days}-Day Streak is at Risk!</span></div>
        <div className="rw-risk-clock" aria-live="off">Expires in {fmtClockRW(remaining)}</div>
        <button className="rw-btn rw-btn-white" type="button" onClick={onCheckIn}><IconifyRW name="lucide:check" size={16} color="#9C6A0E" />Check in now</button>
      </div>
      <div className="rw-notif-stack">
        <NotificationPreviewRW hoursLabel="· 6h before" body={"Don't lose your " + days + "-day streak — check in before it expires!"} />
        <NotificationPreviewRW hoursLabel="· 2h before" body={"Last call! Your streak expires in 2 hours."} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ league */
/* The member's league gem (window.PFLeague, league-engine.js) rendered via
   lottie-web from the engine's hosted JSON — same as the mobile dashboard and
   the leaderboard. Milestone-based, not points-based. */
const RW_LOTTIE_LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
function rwEnsureLottieLib() {
  if (window.lottie || document.querySelector("script[data-pf-lottie]")) return;
  const sc = document.createElement("script");
  sc.src = RW_LOTTIE_LIB;
  sc.async = true;
  sc.setAttribute("data-pf-lottie", "1");
  document.head.appendChild(sc);
}
function rwReduceMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function LeagueLottieRW({ src, size }) {
  const host = useRefRW(null);
  useEffectRW(() => {
    let anim, t;
    const still = rwReduceMotion();
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: !still, autoplay: !still, path: src });
      if (still) anim.addEventListener("DOMLoaded", () => anim.goToAndStop(0, true));
    };
    rwEnsureLottieLib();
    if (window.lottie) start();
    else { t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120); setTimeout(() => clearInterval(t), 8000); }
    return () => { clearInterval(t); if (anim) anim.destroy(); };
  }, [src]);
  return <span ref={host} className="rw-gem-anim" style={{ width: size, height: size }} aria-hidden="true" />;
}
function rwLeagueProgress() {
  const LG = window.PFLeague;
  if (!LG) return null;
  try { return LG.getProgress(); } catch (e) { return null; }
}
function rwPlural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

/* League badge progress: current gem left, next gem (locked) right, milestone
   progress between them; the whole card opens the leaderboard. */
function LeagueProgressCardRW({ league }) {
  const p = league;
  const cur = p ? p.current : null, next = p ? p.next : null;
  const pct = p ? p.pct : 0;
  const vars = cur ? { "--lg-accent": cur.accent, "--lg-deep": cur.deep, "--lg-soft": cur.soft, "--nx-accent": (next || cur).accent, "--nx-deep": (next || cur).deep } : null;
  return (
    <button type="button" className="rw-card rw-league-progress" onClick={() => goRW("Leaderboard.html")} style={vars}
      aria-label={cur ? cur.name + " League, " + (next ? rwPlural(p.need, "more milestone") + " to " + next.name : "highest badge") + ". Open the leaderboard" : "Open the leaderboard"}>
      <span className="rw-gem cur">{cur && <LeagueLottieRW src={cur.lottie} size={96} />}</span>
      <span className="rw-league-progress-body">
        <span className="rw-progress-kicker">League badge progress</span>
        <span className="rw-progress-top">
          <span style={{ color: "var(--lg-deep)" }}>{cur ? cur.name + " League" : "League"}</span>
          <span style={{ color: "var(--nx-deep)" }}>{next ? next.name + " League" : "Top badge"}</span>
        </span>
        <span className="rw-progress-track rw-league-track">
          <span className="rw-progress-fill" style={{ width: pct + "%", background: "linear-gradient(90deg, var(--lg-accent), var(--nx-accent))" }} />
        </span>
        <span className="rw-progress-scale">
          <span>{p ? p.done + " of " + (next ? next.requires : p.total) + " milestones" : ""}</span>
          <span style={{ color: "var(--nx-deep)" }}>{next ? "Unlocks at " + next.requires : "Complete"}</span>
        </span>
        <span className="rw-progress-note">{next ? rwPlural(p.need, "more milestone") + " to " + next.name + " League" : "You've earned the highest badge!"}</span>
        <span className="rw-progress-link">Open the leaderboard<IconifyRW name="lucide:chevron-right" size={16} color="var(--brand-navy)" /></span>
      </span>
      <span className={"rw-gem next" + (next ? " locked" : "")}>
        {(next || cur) && <LeagueLottieRW src={(next || cur).lottie} size={96} />}
        {next && <span className="rw-gem-lock"><IconifyRW name="lucide:lock" size={13} color="#fff" /></span>}
      </span>
    </button>
  );
}

/* "Your league" card (aside) → leaderboard. */
function LeagueCardRW({ league }) {
  const p = league;
  if (!p) return null;
  const cur = p.current, next = p.next;
  return (
    <button type="button" className="rw-card rw-league" style={{ "--lg-accent": cur.accent, "--lg-deep": cur.deep, "--lg-soft": cur.soft }}
      onClick={() => goRW("Leaderboard.html")} aria-label={cur.name + " League. Open the leaderboard"}>
      <span className="rw-league-gem"><LeagueLottieRW src={cur.lottie} size={64} /></span>
      <span className="rw-league-tx">
        <span className="rw-league-eyebrow">Your league</span>
        <b>{cur.name} League</b>
        <i>{next ? rwPlural(p.need, "more milestone") + " to " + next.name : "Highest badge earned"}</i>
      </span>
      <span className="rw-league-cta">Leaderboard<IconifyRW name="lucide:chevron-right" size={16} color="var(--lg-deep)" /></span>
    </button>
  );
}

/* ------------------------------------------------------------ stat tiles */
function EngagementCardsRW({ state }) {
  const week = PF_RW.getWeekPoints(state);
  const tiles = [
    { value: PF_RW.formatNumber(state.lifetimePoints), label: "Lifetime Points", sub: "+" + PF_RW.formatNumber(week) + " this week", lottie: "https://lottie.host/embed/c7c98875-fe8d-4de8-95c1-3e12acf7ad0a/fpeaeGfS64.json", size: 40 },
    { value: PF_RW.formatNumber(state.spendableCredits), label: "Spendable Credits", sub: state.expiringCredits ? PF_RW.formatNumber(state.expiringCredits) + " expiring soon" : "Ready to redeem", lottie: "https://lottie.host/embed/1470432e-8f5e-4eb4-a73c-75e6b6972d46/qk3KaEmMpz.json", size: 60 },
    { value: state.streak.current + " Days", label: "Active Streak", sub: "Longest " + state.streak.longest + " days", lottie: "https://lottie.host/embed/d7ce0087-b4ad-4b7a-b657-558f841da6e5/pSvC2r0DRZ.json", size: 60,
      href: "CheckInStreak.html", aria: "Active streak: " + state.streak.current + " days. Open check-in streak" }
  ];
  return (
    <div className="rw-eng-grid">
      {tiles.map((t) => {
        const inner = (
          <React.Fragment>
            <span className="rw-eng-lottie" aria-hidden="true"><iframe src={t.lottie} title="" scrolling="no" style={{ width: t.size + "px", height: t.size + "px", border: "none", background: "transparent" }} /></span>
            <div className="rw-eng-value">{t.value}</div>
            <div className="rw-eng-label">{t.label}{t.href ? <IconifyRW name="lucide:chevron-right" size={14} color="var(--gray-400)" /> : null}</div>
            <div className="rw-eng-sub">{t.sub}</div>
          </React.Fragment>
        );
        return t.href
          ? <button key={t.label} className="rw-card rw-eng-card rw-eng-link" type="button" onClick={() => goRW(t.href)} aria-label={t.aria}>{inner}</button>
          : <div key={t.label} className="rw-card rw-eng-card">{inner}</div>;
      })}
    </div>
  );
}

/* -------------------------------------------------------------- quicknav */
function QuickNavRW({ state, league }) {
  const redeemed = (state.redeemedVouchers || []).length;
  const items = [
    { label: "Rewards Store", desc: "Spend credits on course discounts", icon: "lucide:shopping-bag", href: "RewardsStore.html", dot: true },
    { label: "My Rewards", desc: redeemed > 0 ? "Your redeemed discount codes" : "Nothing redeemed yet", icon: "lucide:ticket", href: "MyRewards.html", note: redeemed > 0 ? String(redeemed) : null },
    { label: "Leaderboard", desc: "See where you rank", icon: "lucide:bar-chart-3", href: "Leaderboard.html", note: league ? league.current.name : null },
    { label: "Ways to Earn", desc: "Boost your points", icon: "lucide:sparkles", href: "WaysToEarn.html" }
  ];
  return (
    <div className="rw-quicknav">
      {items.map((it) => (
        <button key={it.label} className="rw-quicknav-item" type="button" onClick={() => goRW(it.href)}>
          <span className="rw-quicknav-icon">
            <IconifyRW name={it.icon} size={22} color="#fff" />
            {it.dot ? <span className="rw-quicknav-dot" aria-hidden="true" /> : null}
          </span>
          <span className="rw-quicknav-copy">
            <span className="rw-quicknav-label">
              {it.label}
              {it.note ? <i className="rw-quicknav-note">{it.note}</i> : null}
              {it.dot ? <span className="rw-sr-only"> — new rewards available</span> : null}
            </span>
            <span className="rw-quicknav-desc">{it.desc}</span>
          </span>
          <IconifyRW name="lucide:chevron-right" size={18} color="var(--gray-400)" />
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- activity */
function RecentActivityRW({ state }) {
  const rows = state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 8);
  return (
    <div className="rw-card rw-activity">
      {rows.map((t) => (
        <div key={t.id} className="rw-activity-row">
          <span className="rw-activity-ic" aria-hidden="true">
            <IconifyRW name={t.pointsDelta > 0 ? "lucide:plus" : t.creditsDelta < 0 ? "lucide:shopping-bag" : "lucide:minus"} size={14} color={t.pointsDelta > 0 ? "#9C6A0E" : "var(--gray-500)"} />
          </span>
          <span className="rw-activity-main">
            <span className="rw-activity-label">{t.label}</span>
            <span className="rw-activity-time" title={fmtFullDateRW(t.ts)}>{fmtRelDateRW(t.ts)}</span>
          </span>
          <span className={"rw-activity-cr" + (t.creditsDelta >= 0 ? "" : " is-spend")}>{t.creditsDelta >= 0 ? "+" : ""}{t.creditsDelta} cr</span>
          <span className={"rw-activity-amt" + (t.pointsDelta > 0 ? "" : " is-spend")}>{t.pointsDelta > 0 ? "+" + PF_RW.formatNumber(t.pointsDelta) + " pts" : "—"}</span>
        </div>
      ))}
      {rows.length === 0 ? <div className="rw-empty">No activity yet — complete an action to start earning.</div> : null}
    </div>
  );
}

/* ----------------------------------------------------------- next reward */
function NextRewardRW({ state, config }) {
  const items = (config.storeItems || []).filter((i) => i && i.inventory !== 0);
  const affordable = items.filter((i) => i.cost <= state.spendableCredits + 500).sort((a, b) => a.cost - b.cost)[0] || items[0];
  if (!affordable) return null;
  const canAfford = affordable.cost <= state.spendableCredits;
  const pct = Math.max(0, Math.min(100, Math.round((state.spendableCredits / Math.max(1, affordable.cost)) * 100)));
  const course = affordable.course || null;
  return (
    <button className="rw-card rw-next-reward" type="button" onClick={() => goRW("RewardsStore.html")}>
      <span className="rw-next-reward-tag">NEXT UP</span>
      <span className={"rw-next-reward-icon" + (affordable.image ? " has-img" : "")}>
        {affordable.image ? <img src={affordable.image} alt="" /> : <IconifyRW name="lucide:gift" size={26} color="#3D2A00" />}
        {course && course.discountPct ? <span className="rw-next-reward-off">{course.discountPct}% off</span> : null}
      </span>
      <span className="rw-next-reward-main">
        <span className="ti">Next Available Reward</span>
        <span className="nm">{course && course.discountPct ? course.discountPct + "% off " + affordable.name : affordable.name}</span>
        <span className="su">{PF_RW.formatNumber(affordable.cost)} credits{canAfford ? " · ready to redeem" : " · " + PF_RW.formatNumber(affordable.cost - state.spendableCredits) + " more to go"}</span>
        <span className="rw-next-reward-track" aria-hidden="true"><span style={{ width: pct + "%" }} /></span>
      </span>
    </button>
  );
}

/* ---------------------------------------------------------- side summary */
function WalletCardRW({ state }) {
  const week = PF_RW.getWeekPoints(state);
  const tier = state.user && state.user.membershipTier ? String(state.user.membershipTier) : null;
  const mult = tier ? PF_RW.tierMultiplierFor(null, tier) : null;
  return (
    <section className="rw-card rw-side-card" aria-label="Wallet summary">
      <h3>Your wallet</h3>
      <dl className="rw-kv">
        <div><dt>Spendable credits</dt><dd>{PF_RW.formatNumber(state.spendableCredits)}</dd></div>
        <div><dt>Lifetime points</dt><dd>{PF_RW.formatNumber(state.lifetimePoints)}</dd></div>
        <div><dt>Points this week</dt><dd>{PF_RW.formatNumber(week)}</dd></div>
        {state.expiringCredits ? <div><dt>Expiring soon</dt><dd className="warn">{PF_RW.formatNumber(state.expiringCredits)} cr</dd></div> : null}
        {mult ? <div><dt>{tier} tier multiplier</dt><dd>{mult}×</dd></div> : null}
      </dl>
      <button className="rw-btn rw-btn-coral" type="button" onClick={() => goRW("RewardsStore.html")}>Go to Rewards Store<IconifyRW name="lucide:arrow-right" size={16} color="#3D2A00" /></button>
    </section>
  );
}

function DemoCardRW({ onRisk, onMilestone, onGoal, onReset }) {
  return (
    <section className="rw-card rw-side-card rw-demo" aria-label="Demo controls">
      <h3>Demo controls</h3>
      <div className="rw-demo-bar">
        <button className="rw-demo-btn" type="button" onClick={onRisk}>Simulate streak at risk</button>
        <button className="rw-demo-btn" type="button" onClick={onMilestone}>Simulate 50k milestone</button>
        <button className="rw-demo-btn" type="button" onClick={onGoal}>Daily goal reached</button>
        <button className="rw-demo-btn" type="button" onClick={onReset}>Reset demo data</button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ page */
function RewardsWebApp() {
  const [state, setState] = useStateRW(() => PF_RW.getState());
  const [config, setConfig] = useStateRW(() => PF_RW.getConfig());
  const [league, setLeague] = useStateRW(rwLeagueProgress);
  const [toast, setToast] = useStateRW(null);
  const refresh = () => { setState(PF_RW.getState()); setConfig(PF_RW.getConfig()); setLeague(rwLeagueProgress()); };
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2400); };

  /* Stay in sync when another tab (or the mobile preview) earns points. */
  useEffectRW(() => {
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    document.addEventListener("pf:league-changed", refresh);
    return () => { window.removeEventListener("pf:points-earned", refresh); window.removeEventListener("storage", refresh); document.removeEventListener("pf:league-changed", refresh); };
  }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = (state.user && state.user.name ? state.user.name : ME_RW.name).split(" ")[0];

  const checkIn = () => {
    PF_RW.checkIn();
    refresh();
    flash("Checked in — your streak is safe!");
  };

  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavRW active="Rewards" user={ME_RW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateRW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="rw-page" data-screen-label="Rewards Dashboard">
        <div className="rw-head">
          <div className="rw-head-copy">
            <h1>{greet}, {firstName}!</h1>
            <p>Your points, credits, streak and league progress &mdash; all in one place.</p>
          </div>
        </div>

        <div className="rw-grid">
          <main className="rw-main">
            <LeagueProgressCardRW league={league} />
            <StreakRiskBannerRW state={state} onCheckIn={checkIn} />
            <EngagementCardsRW state={state} />

            <section className="rw-sec">
              <div className="rw-sec-h"><h2>Jump back in</h2></div>
              <QuickNavRW state={state} league={league} />
            </section>

            <section className="rw-sec">
              <div className="rw-sec-h">
                <h2>Recent Activity</h2>
                <button className="rw-sec-link" type="button" onClick={() => goRW("WaysToEarn.html")}>Ways to earn<IconifyRW name="lucide:arrow-right" size={14} color="var(--brand-navy)" /></button>
              </div>
              <RecentActivityRW state={state} />
            </section>
          </main>

          <aside className="rw-side">
            <LeagueCardRW league={league} />
            <NextRewardRW state={state} config={config} />
            <WalletCardRW state={state} />
            <DemoCardRW
              onRisk={() => { PF_RW.setStreakAtRisk(6); refresh(); }}
              onMilestone={() => { PF_RW.setState({ lifetimePoints: 49700 }); goRW("MilestoneSplash.html"); }}
              onGoal={() => { if (window.PFDailyGoal) window.PFDailyGoal.reset(); goRW("DailyGoal.html?ret=RewardsWeb.html"); }}
              onReset={() => { PF_RW.resetDemo(); refresh(); flash("Demo data reset."); }} />
          </aside>
        </div>
      </div>

      {toast && <div className="rw-toast" role="status"><IconifyRW name="lucide:check-circle" size={16} color="#fff" />{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<RewardsWebApp />);
