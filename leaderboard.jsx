/* ===========================================================================
   PROfinity — Katy · Leaderboard (Screen 13) · iPhone 17 Pro Max
   Six gem leagues (Jade → Sapphire, window.PFLeague) sit in a swipeable
   rail at the top; the member's badge is earned through milestones, higher
   badges are locked. Every league has its own board: podium for its top
   three (Lottie medals, photo avatars) then a table, with the member's own
   row pinned in view on her league. Katy's live rolling points
   (window.PFLoyalty) are merged into her league's mock field. Suffixed -LB.
   =========================================================================== */
const { useState: useStateLB, useMemo: useMemoLB, useRef: useRefLB, useEffect: useEffectLB } = React;
const DSLB = window.ProfinityDesignSystem_c2b5cc;
const PF_LB = window.PFLoyalty;

function goLB(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const PF_LG = window.PFLeague;

/* per-league mock fields live in league-engine.js (shared with Profile + Dashboard) */
const LB_LEAGUE_FIELD = PF_LG.FIELDS;

const LB_TREND = {
  up: { icon: "lucide:arrow-up", color: "var(--success)", label: "moving up" },
  down: { icon: "lucide:arrow-down", color: "var(--error)", label: "moving down" },
  flat: { icon: "lucide:minus", color: "var(--gray-450)", label: "no change" },
};

const LB_RANK_AV = {
  1: "linear-gradient(135deg,#E0A968,#A26301)",
  2: "linear-gradient(135deg,#F3A0BF,#D9527F)",
  3: "linear-gradient(135deg,#4FC79A,#1E7A5C)",
};

const LB_MEDAL = {
  1: "https://lottie.host/0be82390-65c3-4b3f-9178-0f7d50a4e3eb/vzysweXhDd.json",
  2: "https://lottie.host/61695d13-bfb4-44ca-b7c8-4294c5da276f/jqYjY8niTd.json",
  3: "https://lottie.host/983acca2-10f7-4703-96b8-171eb8935c48/hzKqpq06Qi.json",
};

/* Render a Lottie from its raw JSON (bypasses the /embed iframe cache).
   play=false parks it on a mid frame so a rail of six badges only animates
   the one in focus. */
function LBLottie({ src, size, play = true }) {
  const host = useRefLB(null);
  const animRef = useRefLB(null);
  useEffectLB(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current, renderer: "svg", loop: true, autoplay: false, path: src,
      });
      animRef.current = anim;
      anim.addEventListener("DOMLoaded", () => {
        if (!animRef.current) return;
        if (play) anim.play(); else anim.goToAndStop(Math.floor(anim.totalFrames * 0.4), true);
      });
    };
    if (window.lottie) start();
    else {
      t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120);
      setTimeout(() => clearInterval(t), 8000);
    }
    return () => { clearInterval(t); animRef.current = null; if (anim) anim.destroy(); };
  }, [src]);
  useEffectLB(() => {
    const a = animRef.current;
    if (!a || !a.isLoaded) return;
    if (play) a.play(); else a.goToAndStop(Math.floor(a.totalFrames * 0.4), true);
  }, [play]);
  return <span ref={host} style={{ display: "block", width: size, height: size }} />;
}

/* Swipeable rail of the six gem badges. The member's own badge and the ones
   below it are earned; everything above is greyed and locked. Tapping a badge
   shows that league's board. */
function LBLeagueRail({ leagues, myIndex, selected, onSelect }) {
  const railRef = useRefLB(null);
  useEffectLB(() => {
    const rail = railRef.current;
    if (!rail) return;
    const el = rail.querySelector('[data-idx="' + selected + '"]');
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const left = el.offsetLeft - (rail.clientWidth / 2) + (el.offsetWidth / 2);
    rail.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
  }, [selected]);
  return (
    <div className="lb-rail" ref={railRef} role="tablist" aria-label="Leagues">
      {leagues.map((l, i) => {
        const locked = i > myIndex, mine = i === myIndex, sel = i === selected;
        return (
          <button type="button" key={l.key} data-idx={i} role="tab" aria-selected={sel}
            className={"lb-rail-item" + (sel ? " sel" : "") + (locked ? " locked" : "") + (mine ? " mine" : "")}
            style={{ "--lg-accent": l.accent, "--lg-soft": l.soft }}
            aria-label={l.name + " League" + (locked ? ", locked" : mine ? ", your league" : "")}
            onClick={() => onSelect(i)}>
            <span className="lb-rail-gem">
              <LBLottie src={l.lottie} size={sel ? 96 : 66} play={sel} />
              {locked && <span className="lb-rail-lock"><DSLB.IconifyIcon name="lucide:lock" size={16} color="#fff" /></span>}
            </span>
            {mine && <span className="lb-rail-you">You</span>}
          </button>
        );
      })}
    </div>
  );
}

/* Badge milestones: what earns the next gem. */
function LBMilestones({ progress, milestones }) {
  const { current, next, done, need, pct } = progress;
  const pending = milestones.filter((m) => !m.done);
  const finished = milestones.filter((m) => m.done);
  const list = pending.slice(0, 4).concat(finished.slice(-2));
  return (
    <div className="lb-ms" data-screen-label="Badge milestones">
      <div className="lb-ms-head">
        <span className="lb-ms-gem"><LBLottie src={(next || current).lottie} size={54} play={false} /></span>
        <span className="tx">
          <b>{next ? "Next badge: " + next.name : "Highest badge earned"}</b>
          <i>{next ? need + " more milestone" + (need === 1 ? "" : "s") + " to unlock · " + done + " of " + milestones.length + " done"
                   : "You've completed every league milestone."}</i>
        </span>
        <span className="lb-ms-pct" style={{ color: (next || current).deep }}>{pct}%</span>
      </div>
      <div className="lb-ms-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: pct + "%", background: (next || current).accent }} />
      </div>
      <ul className="lb-ms-list">
        {list.map((m) => (
          <li key={m.id} className={m.done ? "done" : ""}>
            <span className="ic" style={m.done ? { background: (next || current).soft, color: (next || current).deep } : null}>
              <DSLB.IconifyIcon name={m.done ? "lucide:check" : m.icon} size={17} color={m.done ? (next || current).deep : "var(--brand-navy)"} />
            </span>
            <span className="lb">{m.label}</span>
            <span className="ct" style={m.done ? { color: (next || current).deep } : null}>{m.done ? "Done" : Math.min(m.have, m.target) + "/" + m.target}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function prizeForLB(config, rank) {
  const p = config.leaderboardPrizes.find((pr) => {
    if (pr.rank.includes("–") || pr.rank.includes("-")) {
      const parts = pr.rank.split(/[–-]/).map((n) => parseInt(n, 10));
      return rank >= parts[0] && rank <= (parts[1] || parts[0]);
    }
    return parseInt(pr.rank, 10) === rank;
  });
  return p ? p.prize : null;
}

function LBPodium({ rows, prizeFor }) {
  const order = [rows[1], rows[0], rows[2]];
  return (
    <div className="lb-podium">
      {order.map((r) => (
        <div className={"lb-pod" + (r.rank === 1 ? " first" : "") + (r.rank === 2 ? " second" : "") + (r.rank === 3 ? " third" : "")} key={r.name}>
          <span className="lb-pod-crown">
            <LBLottie src={LB_MEDAL[r.rank]} size={r.rank === 1 ? 70 : 56} />
          </span>
          <DSLB.Avatar name={r.name} src={r.avatar} size={r.rank === 1 ? 62 : 52}
            style={LB_RANK_AV[r.rank] ? { flex: "none", background: LB_RANK_AV[r.rank] } : { flex: "none" }} />
          <span className="lb-pod-rank">#{r.rank}</span>
          <span className="lb-pod-name">{r.name}{r.isKaty ? " (You)" : ""}</span>
          <span className="lb-pod-pts">{PF_LB.formatNumber(r.points)} pts</span>
          {prizeFor(r.rank) && <span className="lb-pod-prize">{prizeFor(r.rank)}</span>}
        </div>
      ))}
    </div>
  );
}

function LBRow({ r, meRef, prizeFor }) {
  const t = LB_TREND[r.trend];
  return (
    <div className={"lb-row" + (r.isKaty ? " me" : "")} ref={r.isKaty ? meRef : null}>
      {!LB_MEDAL[r.rank] && <span className="rk">#{r.rank}</span>}
      {LB_MEDAL[r.rank] &&
        <span className={"lb-row-medal r" + r.rank} aria-hidden="true">
          <LBLottie src={LB_MEDAL[r.rank]} size={44} />
        </span>}
      <DSLB.Avatar name={r.name} src={r.avatar} size={38}
        style={r.isKaty ? { flex: "none", background: "linear-gradient(135deg,#FDBF38,#F39E3D)" } : { flex: "none" }} />
      <span className="tx">
        <b>{r.name}{r.isKaty ? " (You)" : ""}</b>
        {prizeFor(r.rank) && <i>{prizeFor(r.rank)}</i>}
      </span>
      <span className="pts">{PF_LB.formatNumber(r.points)}</span>
      <span className="tr" role="img" aria-label={t.label}>
        <DSLB.IconifyIcon name={t.icon} size={18} color={t.color} />
      </span>
    </div>
  );
}

function LeaderboardScreen() {
  const [config] = useStateLB(() => PF_LB.getConfig());
  const [state] = useStateLB(() => PF_LB.getState());
  const leagues = useMemoLB(() => PF_LG.getLeagues(), []);
  const [progress, setProgress] = useStateLB(() => PF_LG.getProgress());
  const milestones = useMemoLB(() => PF_LG.getMilestones(), [progress]);
  const myIndex = progress.index;
  const [selected, setSelected] = useStateLB(myIndex);
  const [toast, setToast] = useStateLB(null);
  const scrollRef = useRefLB(null);
  const meRef = useRefLB(null);
  const msRef = useRefLB(null);

  /* another tab / demo API changed the counters */
  useEffectLB(() => {
    const onChange = (e) => {
      const p = PF_LG.getProgress();
      setProgress(p);
      setSelected(p.index);
      if (e && e.detail && e.detail.up) { setToast("Promoted to " + p.current.name + " League!"); setTimeout(() => setToast(null), 2600); }
    };
    document.addEventListener("pf:league-changed", onChange);
    return () => document.removeEventListener("pf:league-changed", onChange);
  }, []);

  const league = leagues[selected];
  const isMine = selected === myIndex;
  const locked = selected > myIndex;

  const ranked = useMemoLB(() => {
    const rows = (LB_LEAGUE_FIELD[league.key] || []).map((r) => ({ ...r, isKaty: false }));
    if (isMine) rows.push({ name: state.user.name, points: state.rollingPoints30, trend: "up", avatar: "assets/avatar-katy.jpg", isKaty: true });
    return rows.sort((a, b) => b.points - a.points).map((r, i) => ({ ...r, rank: i + 1 }));
  }, [state, league, isMine]);

  useEffectLB(() => {
    const sc = scrollRef.current, row = meRef.current;
    if (!sc) return;
    if (!isMine || !row) { sc.scrollTo({ top: 0, behavior: "auto" }); return; }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      // centre the member's row without scrollIntoView
      const top = row.offsetTop - (sc.clientHeight / 2) + (row.offsetHeight / 2);
      sc.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
      if (!reduce) {
        row.classList.add("pop");
        setTimeout(() => row.classList.remove("pop"), 3500);
      }
    }, 650);
    return () => clearTimeout(t);
  }, [isMine, league]);

  const prizeFor = (rank) => prizeForLB(config, rank);
  const top3 = ranked.slice(0, 3);
  const me = ranked.find((r) => r.isKaty);
  const ahead = me ? ranked.find((r) => r.rank === me.rank - 1) : null;
  const needFor = (idx) => Math.max(0, leagues[idx].requires - progress.done);
  const goMilestones = () => {
    const sc = scrollRef.current, el = msRef.current;
    if (!sc || !el) return;
    const top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 12;
    sc.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const vars = { "--lg-accent": league.accent, "--lg-deep": league.deep, "--lg-soft": league.soft };

  return (
    <div className="ml-screen lb-screen" data-screen-label="Leaderboard" style={vars}>
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goLB("RewardsDashboard.html")}><DSLB.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Leaderboard</h1>
        <span />
      </div>
      <div className="ml-scroll lb-scroll" ref={scrollRef}>
        <div className="lb-league-head" data-screen-label="League title">
          <h2 className="lb-league-title" style={{ color: league.deep }}>{league.name} League</h2>
          <p className="lb-sub">
            {isMine ? (progress.preview ? "Preview · " : "Your league · ") + "rolling 30-day points"
              : locked ? "Locked · " + needFor(selected) + " more milestone" + (needFor(selected) === 1 ? "" : "s") + " to unlock"
              : "Earned · you've moved up from here"}
          </p>
        </div>

        <LBLeagueRail leagues={leagues} myIndex={myIndex} selected={selected} onSelect={setSelected} />

        <LBPodium rows={top3} prizeFor={prizeFor} />

        {isMine && me && (
          <div className="lb-you" data-screen-label="Your standing">
            <span className="ic"><DSLB.IconifyIcon name="lucide:flag" size={20} color="var(--brand-navy)" /></span>
            <span className="tx">
              <b>You're #{me.rank} with {PF_LB.formatNumber(me.points)} pts</b>
              <i>{ahead ? PF_LB.formatNumber(ahead.points - me.points) + " pts behind " + ahead.name : "You're leading the board!"}</i>
            </span>
            <button type="button" className="lb-you-cta" onClick={() => goLB("RewardsDashboard.html")}>Earn points</button>
          </div>
        )}
        {locked && (
          <div className="lb-you lb-you-locked" data-screen-label="Locked league">
            <span className="ic"><DSLB.IconifyIcon name="lucide:lock" size={20} color="var(--brand-navy)" /></span>
            <span className="tx">
              <b>Unlock {league.name} League</b>
              <i>Complete {needFor(selected)} more milestone{needFor(selected) === 1 ? "" : "s"} to earn this badge</i>
            </span>
            <button type="button" className="lb-you-cta" onClick={goMilestones}>See milestones</button>
          </div>
        )}
        {!isMine && !locked && (
          <div className="lb-you lb-you-earned" data-screen-label="Earned league">
            <span className="ic"><DSLB.IconifyIcon name="lucide:badge-check" size={20} color="var(--brand-navy)" /></span>
            <span className="tx">
              <b>{league.name} badge earned</b>
              <i>You now compete in {leagues[myIndex].name} League</i>
            </span>
            <button type="button" className="lb-you-cta" onClick={() => setSelected(myIndex)}>My league</button>
          </div>
        )}

        <div className="ml-sec-h">
          <h2>Top {ranked.length}</h2>
        </div>
        <div className="lb-table">
          {ranked.map((r) => <LBRow key={r.name} r={r} meRef={meRef} prizeFor={prizeFor} />)}
        </div>

        <div className="lb-ms-wrap" ref={msRef}>
          <div className="ml-sec-h"><h2>Badge milestones</h2></div>
          <LBMilestones progress={progress} milestones={milestones} />
        </div>

        <p className="lb-foot">Points shown are earned in the last 30 days, so the board reflects
          recent activity rather than your lifetime total of {PF_LB.formatNumber(state.lifetimePoints)} pts.
          Badges are earned through milestones, not points.</p>

        <div style={{ height: 24 }} />
      </div>
      {toast && <div className="ml-toast lb-toast" role="status">{toast}</div>}
    </div>
  );
}

function useDeviceScaleLB() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateLB(calc);
  useEffectLB(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileLB() {
  const [mobile, setMobile] = useStateLB(() => window.matchMedia("(max-width:768px)").matches);
  useEffectLB(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function LeaderboardApp() {
  const mobile = useIsMobileLB();
  const scale = useDeviceScaleLB();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><LeaderboardScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><LeaderboardScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<LeaderboardApp />);
