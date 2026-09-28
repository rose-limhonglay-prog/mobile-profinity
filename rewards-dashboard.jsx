/* ===========================================================================
   PROfinity — Katy · Rewards Dashboard · iPhone 17 Pro Max
   Primary hub for the Loyalty & Gamification feature — 6th tab alongside
   Home / Profile / My Learning / Community / Agent. Points-only since
   2026-09-24: no Spendable Credits, no Rewards Store — the league badge
   (PFLeague, points-based via the Milestone Path) is the headline. Reuses the same
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
  { key: "Agent", label: "Agents", icon: "lucide:sparkles", href: "AgentMobile.html" },
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

function RdbHeader({ state, tier }) {
  const LG = window.PFLeague;
  const p = LG ? LG.getProgress() : null;
  const cur = p ? p.current : null, next = p ? p.next : null;
  const pct = p ? p.pct : 0;
  return (
    <div className="rdb-head">
      {/* league badge progress: current gem on the left, the next gem and its
          Milestone Path points threshold on the right; tapping opens the leaderboard */}
      <button type="button" className="rdb-progress-card rdb-progress-league" onClick={() => goRDB("Leaderboard.html")}
        aria-label={cur ? cur.name + " League, " + (next ? PF_RDB.formatNumber(p.need) + " more points to " + next.name : "highest badge") + ". Open the leaderboard" : "Open the leaderboard"}
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
            <span>{p ? PF_RDB.formatNumber(p.points) + (next ? " of " + PF_RDB.formatNumber(next.requires) : "") + " pts" : ""}</span>
            <span style={{ color: "var(--nx-deep)" }}>{next ? "Unlocks at " + PF_RDB.formatNumber(next.requires) + " pts" : "Complete"}</span>
          </div>
          <div className="rdb-progress-note">{next ? PF_RDB.formatNumber(p.need) + " more pts to " + next.name + " League" : "You've earned the highest badge!"}</div>
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
        {/* same smiling-face Lottie as the header points pill (was the coin-stack iframe) */}
        <span className="rdb-eng-lottie rdb-eng-lottie--face" aria-hidden="true"><RdbLeagueLottie src={RDB_MASCOT_SRC} size={38} /></span>
        <div className="rdb-eng-value">{PF_RDB.formatNumber(state.lifetimePoints)}</div>
        <div className="rdb-eng-label">Lifetime Points</div>
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
/* Leaderboard snapshot: only the member's own league — her gem, her rank in
   that board (same 30-day rolling points the Leaderboard page ranks on) and
   who's just ahead. Tapping opens the full leaderboard. */
function rdbStandings(state) {
  const LG = window.PFLeague;
  if (!LG || !LG.getStandings) return null;
  try {
    const me = { name: (state.user && state.user.name ? state.user.name : "Katy") + " (You)", avatar: "assets/avatar-katy.jpg", points: state.rollingPoints30 || 0 };
    return LG.getStandings(me);
  } catch (e) { return null; }
}
function RdbLeagueCard({ state }) {
  const LG = window.PFLeague;
  if (!LG) return null;
  const st = rdbStandings(state);
  if (!st || !st.me) return null;
  const cur = st.league, me = st.me, above = st.above;
  const total = st.rows.length;
  const gap = above ? above.points - me.points : 0;
  const ordinal = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  return (
    <button type="button" className="rdb-league" style={{ "--lg-accent": cur.accent, "--lg-deep": cur.deep, "--lg-soft": cur.soft }}
      onClick={() => goRDB("Leaderboard.html")}
      aria-label={"Leaderboard. You're " + ordinal(me.rank) + " of " + total + " in the " + cur.name + " League with " + PF_RDB.formatNumber(me.points) + " points. Open the leaderboard"}
      data-screen-label="Leaderboard snapshot">
      <span className="rdb-league-gem"><RdbLeagueLottie src={cur.lottie} size={64} /></span>
      <span className="rdb-league-tx">
        <span className="rdb-league-eyebrow">Leaderboard · {cur.name} League</span>
        <b><span className="rdb-league-rank">#{me.rank}</span> of {total}</b>
        <i>{PF_RDB.formatNumber(me.points)} pts{above ? " · " + PF_RDB.formatNumber(gap) + " behind " + above.name.split(" ")[0] : " · You lead the league!"}</i>
      </span>
      <span className="rdb-league-cta"><DSRDB.IconifyIcon name="lucide:chevron-right" size={18} color="var(--lg-deep)" /></span>
    </button>
  );
}

/* Two simple buttons under the stat tiles (user, 2026-09-24 "make both
   buttons simple"): navy icon, label, one-line note, chevron. No league
   name, gem, tint or progress bar. */
function RdbFeatureTiles({ state }) {
  let milestone = null;
  try { milestone = PF_RDB.getMilestoneProgress ? PF_RDB.getMilestoneProgress(state) : null; } catch (e) {}
  const mpNote = milestone ? (milestone.next ? PF_RDB.formatNumber(milestone.remaining) + " pts to go" : "Every badge earned") : "Badges & benefits";
  const vouchers = (state.redeemedVouchers || []).length;
  const mrNote = vouchers ? vouchers + " unlocked" : "Course discounts";
  const items = [
    { label: "Milestone Path", note: mpNote, icon: "lucide:milestone", href: "MilestonePath.html" },
    { label: "My Rewards", note: mrNote, icon: "lucide:ticket", href: "MyRewards.html" }
  ];
  return (
    <div className="rdb-feats">
      {items.map((it) => (
        <button key={it.label} type="button" className="rdb-feat" onClick={() => goRDB(it.href)} aria-label={it.label + ". " + it.note}>
          <span className="rdb-feat-ic" aria-hidden="true"><DSRDB.IconifyIcon name={it.icon} size={20} color="#fff" /></span>
          <span className="rdb-feat-tx"><b>{it.label}</b><i>{it.note}</i></span>
          <DSRDB.IconifyIcon name="lucide:chevron-right" size={16} color="var(--gray-400)" />
        </button>
      ))}
    </div>
  );
}

/* ?new=1 → show the page as a brand-new member (PFLoyalty.resetNewMember),
   then drop the flag so a refresh keeps whatever they earn afterwards */
function rdbApplyNewMemberFlag() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("new") !== "1") return;
    PF_RDB.resetNewMember();
    try { localStorage.removeItem(RDB_WELCOME_SEEN); } catch (e) {}
    q.delete("new");
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q.toString() : "") + location.hash);
  } catch (e) {}
}
function rdbIsNewMember(state) { return !state.lifetimePoints && !(state.ledger || []).length; }

/* First-visit welcome modal (user, 2026-09-24): shown once, over the page,
   while the member has no points yet; dismissing remembers it in
   localStorage (pf-rewards-welcome-seen). ?new=1 clears the flag. */
const RDB_WELCOME_SEEN = "pf-rewards-welcome-seen";
/* ?welcome=earn opens the modal straight on step 2 (demo / QA) */
function rdbWelcomeStep() { try { return new URLSearchParams(location.search).get("welcome") === "earn" ? 2 : 1; } catch (e) { return 1; } }
function rdbWelcomeSeen() { try { return localStorage.getItem(RDB_WELCOME_SEEN) === "1"; } catch (e) { return true; } }
function rdbMarkWelcomeSeen() { try { localStorage.setItem(RDB_WELCOME_SEEN, "1"); } catch (e) {} }
/* step 2 of the welcome: the quickest starter wins, points shown at the
   member's tier multiplier */
const RDB_STARTERS = [
  { id: "evt_mobile_checkin", label: "Check in every day", icon: "lucide:calendar-check" },
  { id: "evt_profile_complete", label: "Complete your profile", icon: "lucide:user-check" },
  { id: "evt_create_post", label: "Post in the community", icon: "lucide:pen-line" },
  { id: "evt_module_complete", label: "Finish a lesson module", icon: "lucide:book-open" },
  { id: "evt_follow_peer", label: "Connect with a peer", icon: "lucide:user-plus" }
];
function rdbStarterRows(state) {
  let actions = [];
  try { actions = PF_RDB.getConfig().actions || []; } catch (e) {}
  const tier = state.user && state.user.membershipTier;
  return RDB_STARTERS.map((st) => {
    const a = actions.find((x) => x.id === st.id);
    let pts = a ? a.basePoints : 0;
    try { if (a && tier) pts = Math.round(a.basePoints * PF_RDB.tierMultiplierFor(a, tier)); } catch (e) {}
    return Object.assign({}, st, { pts });
  }).filter((r) => r.pts > 0);
}
function RdbWelcomeModal({ state, onClose, initialStep }) {
  const [step, setStep] = useStateRDB(initialStep || 1);
  let next = null;
  try { const p = window.PFLeague ? window.PFLeague.getProgress() : null; next = p ? p.next : null; } catch (e) {}
  const first = (state.user && state.user.name ? state.user.name : "there").split(" ")[0];
  const tier = state.user && state.user.membershipTier;
  useEffectRDB(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="rdb-welcome-scrim" onClick={onClose}>
      <div className={"rdb-welcome" + (step === 2 ? " rdb-welcome-earn" : "")} role="dialog" aria-modal="true" aria-labelledby="rdb-welcome-title" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? (
          <React.Fragment>
            {/* Dr Tim avatar Lottie — same file as the daily check-in "Welcome back" screen */}
            <span className="rdb-welcome-doc" aria-hidden="true"><RdbLeagueLottie src="assets/lottie/checkin-welcome.json" size={176} /></span>
            <b id="rdb-welcome-title">Welcome to Rewards, {first}!</b>
            <p>Every check-in, post and lesson earns points. {next ? <React.Fragment>Reach <strong>{PF_RDB.formatNumber(next.requires)} pts</strong> to move up to <strong>{next.name} League</strong> and unlock your first benefit bundle.</React.Fragment> : null}</p>
            <button type="button" className="rdb-welcome-btn" onClick={() => setStep(2)}>See ways to earn<DSRDB.IconifyIcon name="lucide:arrow-right" size={14} color="#3D2A00" /></button>
            <button type="button" className="rdb-welcome-skip" onClick={onClose}>Explore my Rewards</button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <button type="button" className="rdb-welcome-back" aria-label="Back" onClick={() => setStep(1)}><DSRDB.IconifyIcon name="lucide:chevron-left" size={20} color="#fff" /></button>
            <span className="rdb-welcome-steps" aria-hidden="true"><i /><i className="on" /></span>
            <b id="rdb-welcome-title">Ways to earn points</b>
            <p>Your quickest wins{tier ? " as a " + tier + " member" : ""} — points land the moment you do them.</p>
            <ul className="rdb-welcome-list">
              {rdbStarterRows(state).map((r) => (
                <li key={r.id}>
                  <span className="ic" aria-hidden="true"><DSRDB.IconifyIcon name={r.icon} size={17} color="#FCC25D" /></span>
                  <span className="lb">{r.label}</span>
                  <span className="pt">+{PF_RDB.formatNumber(r.pts)} pts</span>
                </li>
              ))}
            </ul>
            <button type="button" className="rdb-welcome-btn" onClick={onClose}>Let's start<DSRDB.IconifyIcon name="lucide:arrow-right" size={14} color="#3D2A00" /></button>
            <button type="button" className="rdb-welcome-skip" onClick={() => { onClose(); goRDB("WaysToEarn.html"); }}>See all ways to earn</button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function RdbRecentActivity({ state }) {
  const rows = state.ledger.slice().sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 6);
  if (!rows.length) {
    return (
      <div className="ml-card rdb-activity-empty">
        <DSRDB.IconifyIcon name="lucide:sparkles" size={22} color="var(--gray-400)" />
        <p>No activity yet — check in today to earn your first points.</p>
      </div>
    );
  }
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

function RewardsDashboardHome() {
  const [state, setState] = useStateRDB(() => { rdbApplyNewMemberFlag(); return PF_RDB.getState(); });
  const [toast, setToast] = useStateRDB(null);
  const refresh = () => setState(PF_RDB.getState());
  const [welcomeOpen, setWelcomeOpen] = useStateRDB(() => rdbIsNewMember(PF_RDB.getState()) && !rdbWelcomeSeen());
  const closeWelcome = React.useCallback(() => { rdbMarkWelcomeSeen(); setWelcomeOpen(false); }, []);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2400); };
  const scrollRef = useRefRDB(null);
  const { hidden: chromeHidden, floating: chromeFloat } = window.PFUseHeaderHideC(scrollRef);

  return (
    <div className={"lm-screen rdb-screen" + (chromeFloat ? " chrome-float" : "") + (chromeHidden ? " chrome-hidden" : "")} data-screen-label="Rewards Dashboard">
      <MobileChromeC />
      <div className="lm-scroll" ref={scrollRef}>
        {/* page order (user, 2026-09-24): league rail + leaderboard snapshot first,
            then the stat tiles, then a Milestone Path button (the full path
            lives on MilestonePath.html, not embedded here) */}
        <div style={{ padding: "0 20px" }}>
          {window.PFRewardsEmbed ? <window.PFRewardsEmbed.LeagueRail href="Leaderboard.html" /> : null}
          <RdbLeagueCard state={state} />
          <div style={{ marginTop: 12 }}><RdbEngagementCards state={state} /></div>
          <RdbFeatureTiles state={state} />
        </div>
        {/* the Ruby→Emerald league progress card moved to MilestonePath.html (user, 2026-09-24) */}
        <StreakRiskBanner state={state} />
        <div style={{ padding: "0 20px" }}>
          {/* "Jump back in" quick nav removed (user, 2026-09-24) — My Rewards is reachable from the Milestone Path */}
          <div className="ml-sec-h"><h2>Recent Activity</h2></div>
          <RdbRecentActivity state={state} />
        </div>

        <div className="ml-demo-bar">
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.setStreakAtRisk(6); refresh(); }}>Demo: simulate streak at risk</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.setState({ lifetimePoints: 49700 }); goRDB("MilestoneSplash.html"); }}>Demo: simulate 50k milestone</button>
          <button className="ml-demo-btn" type="button" onClick={() => { if (window.PFDailyGoal) window.PFDailyGoal.reset(); goRDB("DailyGoal.html?ret=RewardsDashboard.html"); }}>Demo: daily goal reached</button>
          <button className="ml-demo-btn" type="button" onClick={() => goRDB("RewardsDashboard.html?new=1&checkin=0")}>Demo: new member view</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_RDB.resetDemo(); refresh(); flash("Demo data reset."); }}>Reset demo data</button>
        </div>
        <div style={{ height: 90 }} />
      </div>
      <RdbTabBar compact={chromeHidden} />
      {welcomeOpen && <RdbWelcomeModal state={state} onClose={closeWelcome} initialStep={rdbWelcomeStep()} />}
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
