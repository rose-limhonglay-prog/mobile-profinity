/* ===========================================================================
   PROfinity — Rewards page embeds (mobile RewardsDashboard + web RewardsWeb)
   Two sections that used to live behind buttons and now sit directly on the
   Rewards page (user request 2026-09-24 "put it outside"):
     · LeagueRail  — "<X> League · Your league · rolling 30-day points" title
                     over the six gem badges (locked ones greyed), tap → Leaderboard
     · MilestonePath — the vertical league/milestone journey with each badge's
                     one-time perk; the member's next league is expanded, the
                     rest collapse to a one-line summary and toggle on tap; a
                     "?" opens the how-it-works sheet.
     · PointsWeek  — "Last 7 days" card (2026-10-13, Ben's idea, replaced the
                     Recent Activity ledger rows): points earned in the rolling
                     last 7 × 24h on a half-ring gauge against the member's
                     weekly goal, a per-day mini strip and the pace to the next
                     league. Reads PFLoyalty.getRollingPoints / getDailyPoints.
     · Tour        — first-visit coach-mark tour of every section (2026-10-13):
                     spotlight + card per [data-tour] element, Next/Back/Skip,
                     once per member (pf-rewards-tour-seen), ?tour=1 replays.
   Exposed on window.PFRewardsEmbed so both page bundles can render them.
   Classes prefixed rme-. Needs lottie-web, PFLeague and PFLoyalty on the page.
   =========================================================================== */
(function () {
  const { useState, useEffect, useRef, useMemo } = React;
  const DS = window.ProfinityDesignSystem_c2b5cc;
  const Icon = DS.IconifyIcon;
  const PF = window.PFLoyalty;
  const LG = window.PFLeague || null;
  const go = (url) => (window.pfGo || function (u) { window.location.href = u; })(url);
  const fmt = (n) => (PF && PF.formatNumber ? PF.formatNumber(n) : String(n));

  /* league gem from its raw Lottie JSON; parked on a mid frame unless `play` */
  function Gem({ src, size, play, className }) {
    const host = useRef(null);
    const animRef = useRef(null);
    useEffect(() => {
      let anim, t;
      const start = () => {
        if (!window.lottie || !host.current) return;
        anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: false, path: src });
        animRef.current = anim;
        anim.addEventListener("DOMLoaded", () => { if (!animRef.current) return; if (play) anim.play(); else anim.goToAndStop(Math.floor(anim.totalFrames * 0.4), true); });
      };
      if (window.lottie) start();
      else { t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120); setTimeout(() => clearInterval(t), 8000); }
      return () => { clearInterval(t); animRef.current = null; if (anim) anim.destroy(); };
    }, [src]);
    useEffect(() => {
      const a = animRef.current;
      if (!a || !a.isLoaded) return;
      if (play) a.play(); else a.goToAndStop(Math.floor(a.totalFrames * 0.4), true);
    }, [play]);
    return <span ref={host} className={"rme-gem" + (className ? " " + className : "")} style={{ width: size, height: size }} aria-hidden="true" />;
  }

  function useLeagueProgress() {
    const read = () => { try { return LG ? LG.getProgress() : null; } catch (e) { return null; } };
    const [p, setP] = useState(read);
    useEffect(() => {
      const refresh = () => setP(read());
      window.addEventListener("pf:points-earned", refresh);
      window.addEventListener("storage", refresh);
      document.addEventListener("pf:league-changed", refresh);
      return () => { window.removeEventListener("pf:points-earned", refresh); window.removeEventListener("storage", refresh); document.removeEventListener("pf:league-changed", refresh); };
    }, []);
    return p;
  }

  /* ------------------------------------------------------------ league rail */
  function LeagueRail({ href }) {
    const p = useLeagueProgress();
    const railRef = useRef(null);
    useEffect(() => {
      const rail = railRef.current;
      if (!rail || !p) return;
      const el = rail.querySelector('[data-idx="' + p.index + '"]');
      if (!el) return;
      const left = el.offsetLeft - (rail.clientWidth / 2) + (el.offsetWidth / 2);
      rail.scrollTo({ left: Math.max(0, left) });
    }, [p && p.index]);
    if (!p || !p.current) return null;
    const cur = p.current, leagues = p.leagues, mine = p.index;
    const target = href || "Leaderboard.html";
    return (
      <section className="rme-league" style={{ "--lg-accent": cur.accent, "--lg-deep": cur.deep, "--lg-soft": cur.soft }} aria-label={cur.name + " League"} data-screen-label="League badges" data-tour="league">
        <div className="rme-league-head">
          <h2 className="rme-league-title" style={{ color: cur.deep }}>{cur.name} League</h2>
          <p className="rme-league-sub">{(p.preview ? "Preview · " : "Your league · ") + "rolling 30-day points"}</p>
        </div>
        <div className="rme-rail" ref={railRef}>
          {leagues.map((l, i) => {
            const locked = i > mine, isMine = i === mine;
            return (
              <button type="button" key={l.key} data-idx={i}
                className={"rme-rail-item" + (isMine ? " mine" : "") + (locked ? " locked" : "")}
                style={{ "--lg-accent": l.accent, "--lg-soft": l.soft }}
                aria-label={l.name + " League" + (locked ? ", locked · unlocks at " + fmt(l.requires) + " pts" : isMine ? ", your league" : ", earned") + ". Open the leaderboard"}
                onClick={() => go(target)}>
                <span className="rme-rail-gem">
                  <Gem src={l.lottie} size={isMine ? 96 : 66} play={isMine} />
                  {locked && <span className="rme-rail-lock"><Icon name="lucide:lock" size={16} color="#fff" /></span>}
                </span>
                {isMine && <span className="rme-rail-you">You</span>}
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------- help sheet ("?") */
  function HelpSheet({ open, onClose }) {
    useEffect(() => {
      if (!open) return;
      const onKey = (e) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open) return null;
    return (
      <div className="rme-scrim" onClick={onClose}>
        <div className="rme-help" role="dialog" aria-modal="true" aria-labelledby="rme-help-title" onClick={(e) => e.stopPropagation()}>
          <span className="rme-help-handle" aria-hidden="true" />
          <div className="rme-help-head">
            <span className="rme-help-ic" aria-hidden="true"><Icon name="lucide:milestone" size={20} color="var(--brand-navy)" /></span>
            <h2 id="rme-help-title">How the path works</h2>
            <button type="button" className="rme-help-close" aria-label="Close" onClick={onClose}><Icon name="lucide:x" size={18} color="var(--gray-600)" /></button>
          </div>
          <p className="rme-help-p">Six levels, one journey — from Jade at 0 pts to Sapphire at 60,000 pts. Each league badge unlocks a single one-time perk the moment your Lifetime Points reach it.</p>
          <p className="rme-help-p">Points are lifetime: they are never spent and never expire, so every perk you unlock stays yours for good.</p>
          <button type="button" className="rme-help-ok" onClick={onClose}>Got it</button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------- path nodes */
  function whenLabel(iso) {
    if (!iso) return null;
    try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return null; }
  }
  function leagueFor(key) { try { return LG && LG.getLeague ? LG.getLeague(key) : null; } catch (e) { return null; } }

  /* every perk has its own landing page (2026-10-13): RewardLanding.html on
     the phone, RewardLandingWeb.html on the desktop Rewards page */
  const RME_WEB = /Web\.html$/i.test(location.pathname);
  function openReward(key) {
    const ret = location.pathname.split("/").pop() || (RME_WEB ? "RewardsWeb.html" : "RewardsDashboard.html");
    go((RME_WEB ? "RewardLandingWeb.html" : "RewardLanding.html") + "?reward=" + encodeURIComponent(key) + "&ret=" + encodeURIComponent(ret));
  }
  function Node({ milestone, status, isLast, reachedAt, open, onToggle }) {
    const league = leagueFor(milestone.key);
    const redeemed = (() => { try { const pk = PF.getPerk ? PF.getPerk(milestone.key) : null; return !!(pk && pk.status === "redeemed"); } catch (e) { return false; } })();
    const vars = league ? { "--lg-accent": league.accent, "--lg-deep": league.deep, "--lg-soft": league.soft } : null;
    const reached = status === "passed" ? whenLabel(reachedAt) : null;
    const n = milestone.benefits.length;
    /* the model: one one-time perk per league (an admin can still list more) */
    const summary = n ? "One-time perk · " + milestone.benefits[0].title + (n > 1 ? " +" + (n - 1) : "") : "No perk listed";
    const tag = status === "passed"
      ? (milestone.threshold > 0 ? "Badge earned — yours for good" : "Your starting league") + (reached && milestone.threshold > 0 ? " · " + reached : "")
      : status === "current" ? "Next league — unlocks automatically" : "Locked";
    return (
      <div className={"rme-node rme-node-" + status + (league ? " rme-node-league" : "") + (open ? " is-open" : "")} style={vars}>
        <div className="rme-node-rail">
          <span className={"rme-node-dot rme-node-dot-" + status} aria-hidden="true">
            {status === "passed" ? <Icon name="lucide:check" size={14} color="#fff" /> : status === "current" ? <Icon name="lucide:map-pin" size={14} color="#fff" /> : <Icon name="lucide:lock" size={13} color="#fff" />}
          </span>
          {!isLast && <span className={"rme-node-line rme-node-line-" + status} aria-hidden="true" />}
        </div>
        <div className="rme-node-body">
          <button type="button" className="rme-node-head" aria-expanded={open} onClick={onToggle}
            aria-label={milestone.name + (league ? " League" : "") + ", " + (milestone.threshold > 0 ? fmt(milestone.threshold) + " points" : "start") + ". " + tag + ". " + (open ? "Hide" : "Show") + " perk"}>
            {league ? <Gem src={league.lottie} size={40} play={status === "current"} /> : null}
            <span className="rme-node-tx">
              <span className="rme-node-name">{milestone.name}{league ? <small> League</small> : null}</span>
              <span className={"rme-node-tag rme-node-tag-" + status}>{tag}</span>
              {!open && <span className="rme-node-summary">{summary}</span>}
            </span>
            <span className="rme-node-side">
              <span className="rme-node-pts"><Icon name="lucide:star" size={12} color="currentColor" />{milestone.threshold > 0 ? fmt(milestone.threshold) + " pts" : "Start"}</span>
              <span className="rme-node-chev" aria-hidden="true"><Icon name="lucide:chevron-down" size={16} color="var(--gray-400)" /></span>
            </span>
          </button>
          {open && (
            <div className="rme-benefits">
              <span className="rme-benefit-kicker">{status === "passed" ? "Your one-time perk — unlocked" : "One-time perk at " + (milestone.threshold > 0 ? fmt(milestone.threshold) + " pts" : "the start")}</span>
              {milestone.benefits.map((b, i) => (
                <button key={i} type="button" className="rme-benefit rme-benefit-link" onClick={() => openReward(milestone.key)} aria-label={"Open " + b.title}>
                  <span className="rme-benefit-ic" aria-hidden="true"><Icon name={redeemed ? "lucide:ticket" : status === "locked" ? "lucide:lock" : "lucide:gift"} size={15} color={status === "locked" ? "var(--gray-400)" : "var(--brand-gold)"} /></span>
                  <div className="rme-benefit-copy">
                    <div className="rme-benefit-title">{b.title}</div>
                    <div className="rme-benefit-desc">{b.description}</div>
                    {b.delivery ? <div className="rme-benefit-delivery">{b.delivery}</div> : null}
                    <span className={"rme-benefit-cta" + (status === "passed" && !redeemed ? " is-redeem" : "")}>{redeemed ? "Redeemed · view your reward" : status === "passed" ? "Redeem this perk" : "See this reward"}<Icon name="lucide:chevron-right" size={14} color="currentColor" /></span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------- the path */
  function MilestonePath({ state: stateProp, title }) {
    const [own, setOwn] = useState(() => PF.getState());
    useEffect(() => {
      if (stateProp) return;
      const refresh = () => setOwn(PF.getState());
      window.addEventListener("pf:points-earned", refresh);
      window.addEventListener("storage", refresh);
      return () => { window.removeEventListener("pf:points-earned", refresh); window.removeEventListener("storage", refresh); };
    }, [stateProp]);
    const state = stateProp || own;
    const progress = useMemo(() => PF.getMilestoneProgress(state), [state]);
    const currentKey = progress.next ? progress.next.key : null;
    const [openKeys, setOpenKeys] = useState(null); // null = default (current only)
    const [helpOpen, setHelpOpen] = useState(false);
    const isOpen = (key) => openKeys ? openKeys.has(key) : key === currentKey;
    const toggle = (key) => setOpenKeys((prev) => {
      const next = new Set(prev || (currentKey ? [currentKey] : []));
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    const passed = new Set(progress.passed.map((m) => m.key));
    const reachedAt = state.milestonesReachedAt || {};
    const nextLg = progress.next ? leagueFor(progress.next.key) : null;
    return (
      <section className="rme-path" aria-label={title || "Milestone Path"} data-screen-label="Milestone Path">
        <div className="rme-path-head">
          <h2>{title || "Milestone Path"}</h2>
          <button type="button" className="rme-help-btn" aria-label="How the Milestone Path works" aria-haspopup="dialog" aria-expanded={helpOpen} onClick={() => setHelpOpen(true)}>
            <Icon name="lucide:circle-help" size={20} color="var(--gray-900)" />
          </button>
        </div>
        {progress.next ? (
          <div className="rme-next" style={nextLg ? { "--lg-accent": nextLg.accent, "--lg-deep": nextLg.deep } : null}>
            <div className="rme-next-top"><span>{fmt(state.lifetimePoints)} pts</span><span>{fmt(progress.next.threshold)} pts</span></div>
            <div className="rme-next-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.pct}><div className="rme-next-fill" style={{ width: progress.pct + "%" }} /></div>
            <div className="rme-next-note">{fmt(progress.remaining)} pts to unlock <b>{progress.next.name}{nextLg ? " League" : ""}</b></div>
          </div>
        ) : (
          <div className="rme-next rme-next-done"><Icon name="lucide:check-circle" size={18} color="var(--success)" /><div className="rme-next-note">You've walked the whole path — <b>every perk is yours for good</b>.</div></div>
        )}
        <div className="rme-nodes">
          {progress.path.map((m, i) => {
            const status = passed.has(m.key) ? "passed" : m.key === currentKey ? "current" : "locked";
            return <Node key={m.key} milestone={m} status={status} isLast={i === progress.path.length - 1} reachedAt={reachedAt[m.key]} open={isOpen(m.key)} onToggle={() => toggle(m.key)} />;
          })}
        </div>
        <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
      </section>
    );
  }

  /* ------------------------------------------------------- last 7 days */
  const WK_R = 80, WK_LEN = Math.PI * WK_R;            /* half-ring radius / arc length */
  const WK_ARC = "M20 100 A80 80 0 0 1 180 100";
  function wkReduceMotion() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function PointsWeek({ state: stateProp, title }) {
    const [own, setOwn] = useState(() => PF.getState());
    useEffect(() => {
      if (stateProp) return;
      const refresh = () => setOwn(PF.getState());
      window.addEventListener("pf:points-earned", refresh);
      window.addEventListener("storage", refresh);
      return () => { window.removeEventListener("pf:points-earned", refresh); window.removeEventListener("storage", refresh); };
    }, [stateProp]);
    const state = stateProp || own;
    const pts = useMemo(() => (PF.getRollingPoints ? PF.getRollingPoints(state, 7) : 0), [state]);
    const days = useMemo(() => (PF.getDailyPoints ? PF.getDailyPoints(state, 7) : []), [state]);
    const tier = state.user && state.user.membershipTier;
    let mult = 1; try { mult = PF.tierMultiplierFor(null, tier) || 1; } catch (e) {}
    let goal = 500; try { goal = Math.max(1, Math.round((PF.getConfig().weeklyPointsTarget || 500) * mult)); } catch (e) {}
    const pct = Math.max(0, Math.min(100, Math.round(pts / goal * 100)));
    const reached = pts >= goal;
    /* pace to the next league at this week's rate */
    let pace = null;
    try {
      const p = LG ? LG.getProgress() : null;
      if (p && p.next && pts > 0) pace = { league: p.next.name, need: p.need, days: Math.max(1, Math.ceil(p.need / (pts / 7))) };
      else if (p && !p.next) pace = { top: true };
    } catch (e) {}
    /* the ring fills on mount (one CSS transition); still under reduced motion */
    const [on, setOn] = useState(() => wkReduceMotion());
    useEffect(() => { if (on) return; const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []);
    const offset = WK_LEN * (1 - (on ? pct : 0) / 100);
    const maxDay = Math.max(1, ...days.map((d) => d.points));
    const dayLabel = (d) => d.date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    return (
      <section className={"rme-wk" + (reached ? " is-reached" : "")} aria-label={title || "Last 7 days"} data-screen-label="Last 7 days" data-tour="week">
        <div className="rme-wk-gauge" role="meter" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(pts, goal)}
          aria-label={fmt(pts) + " points earned in the last 7 days, weekly goal " + fmt(goal)}>
          <svg viewBox="0 0 200 110" aria-hidden="true" focusable="false">
            <path className="rme-wk-track" d={WK_ARC} />
            <path className="rme-wk-fill" d={WK_ARC} style={{ strokeDasharray: WK_LEN, strokeDashoffset: offset }} />
          </svg>
          <div className="rme-wk-val"><b>{fmt(pts)}</b><span>pts</span><i>earned in the last 7 days</i></div>
        </div>
        <div className="rme-wk-scale" aria-hidden="true"><span>0</span><span>{fmt(goal)} goal</span></div>
        <div className="rme-wk-note">
          {reached
            ? <React.Fragment><Icon name="lucide:check-circle" size={15} color="var(--success, #2a9568)" /><span>Weekly goal reached · <b>{fmt(pts - goal)} pts</b> over</span></React.Fragment>
            : <React.Fragment><Icon name="lucide:target" size={15} color="#9C6A0E" /><span><b>{fmt(goal - pts)} pts</b> to your weekly goal</span></React.Fragment>}
        </div>
        <div className="rme-wk-days" role="list" aria-label="Points per day">
          {days.map((d) => (
            <div key={d.key} role="listitem" className={"rme-wk-day" + (d.today ? " is-today" : "") + (d.points ? "" : " is-empty")}
              title={dayLabel(d) + " · " + fmt(d.points) + " pts"} aria-label={dayLabel(d) + ": " + fmt(d.points) + " points"}>
              <span className="rme-wk-bar"><i style={{ height: (d.points ? Math.max(3, Math.round(d.points / maxDay * 34)) : 0) + "px" }} /></span>
              <span className="rme-wk-lb">{d.today ? "Today" : d.date.toLocaleDateString("en-GB", { weekday: "narrow" })}</span>
            </div>
          ))}
        </div>
        {pace && !pace.top ? <div className="rme-wk-pace"><Icon name="lucide:trending-up" size={14} color="currentColor" /><span>At this pace, <b>{pace.league} League</b> in about {pace.days} {pace.days === 1 ? "day" : "days"} · {fmt(pace.need)} pts to go</span></div> : null}
        {pace && pace.top ? <div className="rme-wk-pace"><Icon name="lucide:trophy" size={14} color="currentColor" /><span>Top of the path — every perk is yours for good</span></div> : null}
      </section>
    );
  }

  /* ---------------------------------------------------------------- tour */
  const TOUR_SEEN = "pf-rewards-tour-seen";
  const TOUR_STEPS = [
    { key: "league",      title: "Your league badge",    body: "Six gem leagues, Jade to Sapphire. Your lifetime points decide which one you hold — tap a gem to open the leaderboard." },
    { key: "leaderboard", title: "Where you rank",       body: "Your place in this league on rolling 30-day points, and who's just ahead of you." },
    { key: "stats",       title: "Points and streak",    body: "Points are lifetime — never spent, never expired. Check in daily to keep the streak alive." },
    { key: "earn",        title: "Ways to Earn",         body: "Every point-earning action in one list. Tap any row to see how it works." },
    { key: "path",        title: "My Rewards",           body: "Each of the six leagues unlocks one one-time perk the moment you reach it — redeem them here." },
    { key: "week",        title: "Last 7 days",          body: "Points earned this week against your weekly goal, and your pace to the next league." }
  ];
  function rwReduce() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function tourSeen() { try { return localStorage.getItem(TOUR_SEEN) === "1"; } catch (e) { return true; } }
  function markTourSeen() { try { localStorage.setItem(TOUR_SEEN, "1"); } catch (e) {} }
  function tourForced() { try { return new URLSearchParams(location.search).get("tour") === "1"; } catch (e) { return false; } }
  /* the page decides when it's quiet (welcome modal closed, no check-in
     takeover) and renders <Tour host={screenEl|null} onDone/> */
  function Tour({ host, onDone }) {
    const steps = useMemo(() => TOUR_STEPS.filter((st) => document.querySelector('[data-tour="' + st.key + '"]')), []);
    const [i, setI] = useState(0);
    const [rect, setRect] = useState(null);
    const cardRef = useRef(null);
    const step = steps[i];
    const finish = () => { markTourSeen(); onDone(); };
    const measure = () => {
      if (!step) return;
      const el = document.querySelector('[data-tour="' + step.key + '"]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const h = host ? host.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      const sx = host ? (h.width / host.offsetWidth || 1) : 1; /* device frame is CSS-scaled */
      setRect({ left: (r.left - h.left) / sx, top: (r.top - h.top) / sx, width: r.width / sx, height: r.height / sx, hostH: h.height / sx, hostW: h.width / sx });
    };
    useEffect(() => {
      if (!step) return;
      const el = document.querySelector('[data-tour="' + step.key + '"]');
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
      const t1 = setTimeout(measure, 380), t2 = setTimeout(measure, 700);
      const onR = () => measure();
      window.addEventListener("resize", onR);
      const sc = host ? host.querySelector(".lm-scroll") : null;
      if (sc) sc.addEventListener("scroll", onR); else window.addEventListener("scroll", onR, true);
      return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", onR); if (sc) sc.removeEventListener("scroll", onR); else window.removeEventListener("scroll", onR, true); };
    }, [i]);
    useEffect(() => {
      const onKey = (e) => { if (e.key === "Escape") finish(); if (e.key === "ArrowRight") setI((x) => Math.min(steps.length - 1, x + 1)); if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1)); };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [steps.length]);
    if (!step) return null;
    const last = i === steps.length - 1;
    const pad = 8;
    const cardH = cardRef.current ? cardRef.current.offsetHeight : 170;
    const below = rect ? rect.top + rect.height + pad + 12 + cardH < rect.hostH : true;
    const cardTop = rect ? (below ? rect.top + rect.height + pad + 12 : Math.max(12, rect.top - pad - 12 - cardH)) : 80;
    const cardLeft = rect ? Math.max(12, Math.min(rect.left, rect.hostW - 12 - 320)) : 12;
    return (
      <div className={"rme-tour" + (host ? " in-host" : "")} role="dialog" aria-modal="true" aria-label={"Rewards tour, step " + (i + 1) + " of " + steps.length}>
        <div className="rme-tour-scrim" onClick={finish} />
        {rect && <div className="rme-tour-spot" style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} />}
        <div ref={cardRef} className={"rme-tour-card" + (rect && !below ? " above" : "")} style={{ top: cardTop, left: cardLeft }} key={step.key}>
          <div className="rme-tour-top">
            {/* Dr Tim presenter: the waving-doctor Lottie recoloured to his avatar palette (assets/lottie/drtim-wave.json, 2026-10-13) */}
            <span className="rme-tour-doc" aria-hidden="true"><Gem src="assets/lottie/drtim-wave.json?v=20261013b" size={96} play={!rwReduce()} className="rme-tour-doc-anim" /></span>
            <div className="rme-tour-tx">
              <span className="rme-tour-n">{i + 1} of {steps.length}</span>
              <b>{step.title}</b>
              <p>{step.body}</p>
            </div>
          </div>
          <div className="rme-tour-row">
            <button type="button" className="rme-tour-skip" onClick={finish}>{last ? "" : "Skip tour"}</button>
            <span className="rme-tour-dots" aria-hidden="true">{steps.map((st, k) => <i key={st.key} className={k === i ? "on" : ""} />)}</span>
            <span className="rme-tour-btns">
              {i > 0 && <button type="button" className="rme-tour-back" aria-label="Back" onClick={() => setI(i - 1)}><Icon name="lucide:chevron-left" size={16} color="currentColor" /></button>}
              <button type="button" className="rme-tour-next" onClick={() => last ? finish() : setI(i + 1)}>{last ? "Done" : "Next"}{!last && <Icon name="lucide:chevron-right" size={14} color="currentColor" />}</button>
            </span>
          </div>
        </div>
      </div>
    );
  }
  /* page helper: true when the tour should run (first visit or ?tour=1) */
  function shouldTour() { return tourForced() || !tourSeen(); }
  function quietForTour() { return !document.querySelector(".pf-dci-root.is-open, .pf-dci-screen, .rdb-welcome-scrim, .rw-welcome-scrim"); }

  window.PFRewardsEmbed = { LeagueRail, MilestonePath, HelpSheet, PointsWeek, Tour, shouldTour, quietForTour, markTourSeen };
})();
