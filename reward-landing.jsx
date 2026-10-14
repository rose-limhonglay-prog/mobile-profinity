/* ===========================================================================
   PROfinity — Reward landing page (one page per league perk, 2026-10-13)
   RewardLanding.html?reward=<leagueKey>&ret=<page>   (phone, IOSDevice stage)
   RewardLandingWeb.html?reward=<leagueKey>&ret=<page> (desktop, window.PF_RL_WEB)
   Shows ONE Milestone Path perk: league gem hero, what it is, how you get it,
   where you stand (locked → progress + Ways to Earn; unlocked → "Redeem this
   perk"; redeemed → ticket with the voucher code + the place it's used) and
   the other perks on the path. Redeeming calls PFLoyalty.redeemPerk and plays
   the celebration overlay (confetti burst + gem pop + fanfare via
   pf:perk-redeemed in points-sound.js). ?celebrate=1 replays the overlay for
   screenshots. Reached from the Milestone Path (embed + MilestonePath.html).
   Suffixed -RL, classes rl-.
   =========================================================================== */
const { useState: useStateRL, useEffect: useEffectRL, useRef: useRefRL, useMemo: useMemoRL } = React;
const DSRL = window.ProfinityDesignSystem_c2b5cc;
const PF_RL = window.PFLoyalty;
const LG_RL = window.PFLeague || null;
const RL_WEB = !!window.PF_RL_WEB;
const ME_RL = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goRL(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function paramRL(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }
function retRL() {
  const r = paramRL("ret");
  if (r && /^[A-Za-z0-9_./?=&-]+$/.test(r)) return r;
  return RL_WEB ? "RewardsWeb.html" : "RewardsDashboard.html";
}
function fmtRL(n) { return PF_RL.formatNumber(n); }
function whenRL(iso) { try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return null; } }
function leagueRL(key) { try { return LG_RL && LG_RL.getLeague ? LG_RL.getLeague(key) : null; } catch (e) { return null; } }
function useIsDarkRL() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateRL(read);
  useEffectRL(() => {
    const obs = new MutationObserver(() => setDark(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* league gem (raw JSON via lottie-web); loops when `play`, else parks on a mid frame */
function GemRL({ src, size, play, className }) {
  const host = useRefRL(null);
  useEffectRL(() => {
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
  return <span ref={host} className={"rl-gem" + (className ? " " + className : "")} style={{ width: size, height: size }} aria-hidden="true" />;
}

/* where a redeemed perk is used — keyed off its copy, same map the old
   Milestone Path sheet used */
function perkActionRL(b) {
  const t = ((b.title || "") + " " + (b.delivery || "")).toLowerCase();
  if (/mastery|membership|subscri/.test(t)) return { label: "Upgrade to Mastery", href: "MembershipTier.html", icon: "lucide:crown", next: ["Pick the Mastery tier on the membership page.", "Paste the code at checkout — 5% comes straight off.", "One use, no expiry; the code is saved here."] };
  if (/credit|discount|voucher|checkout/.test(t)) return { label: "Use it at checkout", href: RL_WEB ? "AllCoursesWeb.html" : "AllCoursesMobile.html", icon: "lucide:book-open", next: ["Paste the code at checkout for any course in the catalogue.", "It's applied once, to one order, and never expires.", "The code is saved here if you need it again."] };
  if (/mentorship|dinner|concierge|calendar/.test(t)) return { label: "Book via concierge", href: RL_WEB ? "ChatSupportWeb.html" : "ChatSupport.html", icon: "lucide:calendar", next: ["Our concierge will message you to find a date.", "Quote your code when they do.", "One session — pick a moment that counts."] };
  if (/leaderboard/.test(t)) return { label: "Open the leaderboard", href: "Leaderboard.html", icon: "lucide:bar-chart-3", next: ["Your board is live from your first check-in.", "Rolling 30-day points decide your place.", "Climb it to unlock the next league perk."] };
  if (/bundle|digital|tools/.test(t)) return { label: "Open My Learning", href: RL_WEB ? "MyLearning.html" : "LearningMobile.html", icon: "lucide:book-open", next: ["The bundle is added to your library straight away.", "Find it under My Learning → Resources.", "Yours to keep — download anything you like."] };
  return { label: "See the Milestone Path", href: RL_WEB ? "RewardsWeb.html" : "MilestonePath.html", icon: "lucide:milestone", next: ["We'll email you the details within a day.", "Your code is saved here if you need it again.", "Keep earning — the next league is waiting."] };
}

/* ---------------------------------------------------- celebration overlay */
function burstRL(root, colors) {
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const w = root.clientWidth, h = root.clientHeight;
  const cx = w / 2, cy = h * 0.36;
  for (let i = 0; i < 90; i++) {
    const p = document.createElement("span");
    p.className = "rl-confetti";
    const size = 6 + Math.random() * 9;
    const round = Math.random() > 0.5;
    p.style.cssText = "left:" + cx + "px;top:" + cy + "px;width:" + size + "px;height:" + (round ? size : size * 0.5) + "px;background:" + colors[i % colors.length] + ";border-radius:" + (round ? "50%" : "2px");
    root.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * Math.min(w, h) * 0.55;
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist * 0.8;
    const a = p.animate([
      { transform: "translate(0,0) rotate(0deg) scale(.4)", opacity: 0 },
      { opacity: 1, offset: 0.08 },
      { transform: "translate(" + dx.toFixed(0) + "px," + dy.toFixed(0) + "px) rotate(" + (Math.random() * 720 - 360).toFixed(0) + "deg) scale(1)", opacity: 1, offset: 0.55 },
      { transform: "translate(" + (dx * 1.1).toFixed(0) + "px," + (dy + 220 + Math.random() * 200).toFixed(0) + "px) rotate(" + (Math.random() * 900 - 450).toFixed(0) + "deg) scale(.9)", opacity: 0 }
    ], { duration: 1900 + Math.random() * 900, delay: Math.random() * 180, easing: "cubic-bezier(.15,.7,.3,1)", fill: "forwards" });
    a.onfinish = () => p.remove();
  }
}
function CelebrationRL({ perk, league, voucher, onDone }) {
  const root = useRefRL(null);
  const [copied, setCopied] = useStateRL(false);
  useEffectRL(() => {
    const colors = [league ? league.accent : "#FDBF38", league ? league.deep : "#292569", "#FDBF38", "#FF8FAE", "#5ED3B1", "#8DC5FF", "#FFD76A"];
    const t1 = setTimeout(() => burstRL(root.current, colors), 220);
    const t2 = setTimeout(() => burstRL(root.current, colors), 1100);
    const onKey = (e) => { if (e.key === "Escape") onDone(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t1); clearTimeout(t2); document.removeEventListener("keydown", onKey); };
  }, []);
  const copy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="rl-cele" ref={root} role="dialog" aria-modal="true" aria-labelledby="rl-cele-title" data-screen-label="Perk redeemed">
      <span className="rl-cele-glow" aria-hidden="true" />
      <div className="rl-cele-card">
        <div className="rl-cele-gem">
          <span className="rl-cele-ring r1" aria-hidden="true" /><span className="rl-cele-ring r2" aria-hidden="true" />
          {league ? <GemRL src={league.lottie} size={RL_WEB ? 150 : 132} play /> : <DSRL.IconifyIcon name="lucide:gift" size={64} color="var(--brand-gold)" />}
          <span className="rl-cele-check" aria-hidden="true"><DSRL.IconifyIcon name="lucide:check" size={18} color="#fff" /></span>
        </div>
        <span className="rl-cele-kicker"><DSRL.IconifyIcon name="lucide:party-popper" size={14} color="currentColor" />Perk redeemed</span>
        <h2 id="rl-cele-title">It's yours, Katy!</h2>
        <p className="rl-cele-sub">{perk.benefit.title}</p>
        <div className="rl-ticket rl-cele-ticket">
          <span className="rl-ticket-label">Your code</span>
          <code className="rl-ticket-code">{voucher.code}</code>
          <button type="button" className="rl-ticket-copy" onClick={copy} aria-label="Copy code"><DSRL.IconifyIcon name={copied ? "lucide:check" : "lucide:copy"} size={14} color="currentColor" />{copied ? "Copied" : "Copy"}</button>
        </div>
        <button type="button" className="ml-btn ml-btn-navy rl-cta rl-cele-cta" onClick={onDone}>Show my reward<DSRL.IconifyIcon name="lucide:arrow-right" size={16} color="#fff" /></button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- page */
function RewardLandingView() {
  const [state, setState] = useStateRL(() => PF_RL.getState());
  const key = paramRL("reward") || (() => { try { const p = PF_RL.getMilestoneProgress(); return (p.next || p.current || p.path[0]).key; } catch (e) { return "jade"; } })();
  const perk = useMemoRL(() => PF_RL.getPerk(key, state), [key, state]);
  const [celebrate, setCelebrate] = useStateRL(() => paramRL("celebrate") === "1");
  const [justRedeemed, setJustRedeemed] = useStateRL(null);
  const [toast, setToast] = useStateRL(null);
  const [copied, setCopied] = useStateRL(false);
  const toastRef = useRefRL(null);

  useEffectRL(() => {
    const refresh = () => setState(PF_RL.getState());
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("pf:points-earned", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const showToast = (text, icon) => { setToast({ text, icon: icon || "lucide:check" }); clearTimeout(toastRef.current); toastRef.current = setTimeout(() => setToast(null), 2000); };

  if (!perk || !perk.benefit) {
    return (
      <div className="rl-empty ml-empty">
        <DSRL.IconifyIcon name="lucide:gift" size={28} color="var(--gray-400)" />
        <p>That reward isn't on the Milestone Path any more.</p>
        <button className="ml-btn ml-btn-navy ml-btn-sm" type="button" onClick={() => goRL(retRL())}>Back to Rewards</button>
      </div>
    );
  }

  const m = perk.milestone, b = perk.benefit;
  const league = leagueRL(key);
  const vars = league ? { "--lg-accent": league.accent, "--lg-deep": league.deep, "--lg-soft": league.soft } : null;
  const locked = perk.status === "locked";
  const redeemed = perk.status === "redeemed";
  const voucher = perk.voucher || justRedeemed;
  const action = perkActionRL(b);
  const pts = state.lifetimePoints || 0;

  function redeem() {
    const res = PF_RL.redeemPerk(key);
    if (!res.ok) { showToast(res.reason, "lucide:lock"); return; }
    setJustRedeemed(res.voucher);
    setState(PF_RL.getState());
    setCelebrate(true);
  }
  const copy = () => {
    if (!voucher) return;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };
  const otherPerks = perk.path.filter((x) => x.key !== key);
  const statusOf = (x) => { try { return PF_RL.getPerk(x.key, state).status; } catch (e) { return "locked"; } };
  const landing = (k) => (RL_WEB ? "RewardLandingWeb.html" : "RewardLanding.html") + "?reward=" + encodeURIComponent(k) + "&ret=" + encodeURIComponent(retRL());

  const hero = (
    <section className={"rl-hero rl-hero-" + perk.status} style={vars} aria-label={b.title}>
      <span className="rl-hero-orb o1" aria-hidden="true" /><span className="rl-hero-orb o2" aria-hidden="true" />
      <div className="rl-hero-gem">
        {league ? <GemRL src={league.lottie} size={RL_WEB ? 128 : 112} play={!locked} /> : <DSRL.IconifyIcon name="lucide:gift" size={56} color="var(--brand-gold)" />}
        {locked ? <span className="rl-hero-lock" aria-hidden="true"><DSRL.IconifyIcon name="lucide:lock" size={14} color="#fff" /></span> : null}
      </div>
      <span className="rl-league-chip"><DSRL.IconifyIcon name="lucide:star" size={12} color="currentColor" />{m.name}{league ? " League" : ""} · {m.threshold > 0 ? fmtRL(m.threshold) + " pts" : "Start"}</span>
      <h1 className="rl-title">{b.title}</h1>
      <p className="rl-desc">{b.description}</p>
      <span className={"rl-status-pill is-" + perk.status}>
        <DSRL.IconifyIcon name={redeemed ? "lucide:ticket" : locked ? "lucide:lock" : "lucide:check-circle"} size={13} color="currentColor" />
        {redeemed ? "Redeemed · ready to use" : locked ? fmtRL(perk.remaining) + " pts to unlock" : "Unlocked — yours for good"}
      </span>
    </section>
  );

  const standing = (
    <section className={"ml-card rl-card rl-standing is-" + perk.status} style={vars}>
      {locked ? (
        <>
          <div className="rl-card-head"><span className="rl-card-ic"><DSRL.IconifyIcon name="lucide:lock" size={16} color="currentColor" /></span><div><b>Unlocks at {fmtRL(m.threshold)} pts</b><i>{fmtRL(pts)} lifetime pts · {fmtRL(perk.remaining)} to go</i></div></div>
          <div className="ml-progress-track rl-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={perk.pct}><div className="ml-progress-fill" style={{ width: perk.pct + "%" }} /></div>
          <div className="rl-track-ends"><span>{perk.prev ? perk.prev.name : "Start"}</span><span>{m.name}</span></div>
          <button type="button" className="ml-btn ml-btn-navy rl-cta" onClick={() => goRL((RL_WEB ? "WaysToEarn.html?ret=" : "WaysToEarn.html?ret=") + encodeURIComponent(landing(key)))}><DSRL.IconifyIcon name="lucide:sparkles" size={16} color="#fff" />Earn points faster</button>
          <p className="rl-note">Points are lifetime — never spent, never expired. The perk unlocks the moment you cross the line.</p>
        </>
      ) : redeemed ? (
        <>
          <div className="rl-card-head"><span className="rl-card-ic is-ok"><DSRL.IconifyIcon name="lucide:ticket" size={16} color="currentColor" /></span><div><b>Ready to use</b><i>Redeemed {whenRL(voucher.redeemedAt)}{perk.reachedAt ? " · earned " + whenRL(perk.reachedAt) : ""}</i></div></div>
          <div className="rl-ticket">
            <span className="rl-ticket-label">Your code</span>
            <code className="rl-ticket-code">{voucher.code}</code>
            <button type="button" className="rl-ticket-copy" onClick={copy} aria-label="Copy code"><DSRL.IconifyIcon name={copied ? "lucide:check" : "lucide:copy"} size={14} color="currentColor" />{copied ? "Copied" : "Copy"}</button>
          </div>
          <button type="button" className="ml-btn ml-btn-navy rl-cta" onClick={() => goRL(action.href)}><DSRL.IconifyIcon name={action.icon} size={16} color="#fff" />{action.label}</button>
          <button type="button" className="ml-btn ml-btn-ghost rl-cta rl-cta-ghost" onClick={() => showToast("Code sent to your inbox", "lucide:mail")}><DSRL.IconifyIcon name="lucide:mail" size={16} color="currentColor" />Email me the code</button>
        </>
      ) : (
        <>
          <div className="rl-card-head"><span className="rl-card-ic is-ok"><DSRL.IconifyIcon name="lucide:check-circle" size={16} color="currentColor" /></span><div><b>Unlocked — yours for good</b><i>{perk.reachedAt ? "Earned " + whenRL(perk.reachedAt) : "Earned with your " + m.name + " badge"}</i></div></div>
          <button type="button" className="ml-btn ml-btn-navy rl-cta rl-cta-redeem" onClick={redeem}><DSRL.IconifyIcon name="lucide:gift" size={18} color="#fff" />Redeem this perk</button>
          <p className="rl-note">One tap mints your code. Nothing is spent — your points stay exactly where they are.</p>
        </>
      )}
    </section>
  );

  const details = (
    <section className="ml-card rl-card rl-details">
      <div className="rl-row"><span className="rl-row-ic"><DSRL.IconifyIcon name="lucide:gift" size={15} color="var(--brand-gold)" /></span><span><b>How you get it</b><i>{b.delivery || "Unlocked in your account"}</i></span></div>
      <div className="rl-row"><span className="rl-row-ic"><DSRL.IconifyIcon name="lucide:trophy" size={15} color="var(--brand-gold)" /></span><span><b>Who unlocks it</b><i>{m.threshold > 0 ? "Every member who reaches " + fmtRL(m.threshold) + " lifetime points" : "Every member, from their first check-in"}</i></span></div>
      <div className="rl-row"><span className="rl-row-ic"><DSRL.IconifyIcon name="lucide:shield-check" size={15} color="var(--brand-gold)" /></span><span><b>One-time perk</b><i>Redeem it once, keep it for good. Nothing ever locks back up.</i></span></div>
    </section>
  );

  const next = (
    <section className="ml-card rl-card rl-next">
      <h3 className="rl-h3">What happens next</h3>
      <ol className="rl-steps">
        {action.next.map((t, i) => <li key={i}><span className="rl-step-n">{i + 1}</span><span>{t}</span></li>)}
      </ol>
    </section>
  );

  const more = (
    <section className="rl-more">
      <h3 className="rl-h3 rl-more-h">More on the path</h3>
      <div className="rl-more-list">
        {otherPerks.map((x) => {
          const lg = leagueRL(x.key); const st = statusOf(x); const xb = (x.benefits || [])[0];
          return (
            <button key={x.key} type="button" className={"rl-more-item is-" + st} style={lg ? { "--lg-accent": lg.accent, "--lg-deep": lg.deep, "--lg-soft": lg.soft } : null} onClick={() => goRL(landing(x.key))}>
              <span className="rl-more-gem">{lg ? <GemRL src={lg.lottie} size={40} play={false} /> : <DSRL.IconifyIcon name="lucide:gift" size={20} color="var(--brand-gold)" />}</span>
              <span className="rl-more-tx"><b>{xb ? xb.title : x.name}</b><i>{x.name}{lg ? " League" : ""} · {st === "redeemed" ? "Redeemed" : st === "unlocked" ? "Ready to redeem" : fmtRL(x.threshold) + " pts"}</i></span>
              <DSRL.IconifyIcon name="lucide:chevron-right" size={16} color="var(--gray-400)" />
            </button>
          );
        })}
      </div>
    </section>
  );

  const body = RL_WEB ? (
    <div className="rl-web-grid">
      <div className="rl-web-main">{hero}{standing}{more}</div>
      <aside className="rl-web-side">{details}{next}</aside>
    </div>
  ) : (
    <>{hero}{standing}{details}{next}{more}<div className="rl-spacer" /></>
  );

  return (
    <>
      {body}
      {celebrate && voucher && <CelebrationRL perk={perk} league={league} voucher={voucher} onDone={() => { setCelebrate(false); if (paramRL("celebrate")) { try { history.replaceState(null, "", location.pathname + "?reward=" + encodeURIComponent(key) + "&ret=" + encodeURIComponent(retRL())); } catch (e) {} } }} />}
      {celebrate && !voucher && <CelebrationRL perk={perk} league={league} voucher={{ code: "PF-" + key.slice(0, 3).toUpperCase() + "-DEMO-CODE", redeemedAt: new Date().toISOString() }} onDone={() => setCelebrate(false)} />}
      {toast && <div className="ml-toast rl-toast" role="status"><DSRL.IconifyIcon name={toast.icon} size={16} color="#fff" />{toast.text}</div>}
    </>
  );
}

function useIsMobileRL() {
  const [mobile, setMobile] = useStateRL(() => window.matchMedia("(max-width:768px)").matches);
  useEffectRL(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function useDeviceScaleRL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRL(calc);
  useEffectRL(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}
function RewardLandingScreen() {
  const title = (() => { try { const p = PF_RL.getPerk(paramRL("reward") || ""); return p && p.milestone ? p.milestone.name + " perk" : "Reward"; } catch (e) { return "Reward"; } })();
  return (
    <div className="ml-screen rl-screen" data-screen-label="Reward">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goRL(retRL())}><DSRL.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>{title}</h1>
        <span />
      </div>
      <div className="ml-scroll rl-scroll"><RewardLandingView /></div>
    </div>
  );
}
function RewardLandingMobile() {
  const mobile = useIsMobileRL();
  const scale = useDeviceScaleRL();
  const dark = useIsDarkRL();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><RewardLandingScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: "scale(" + scale + ")", transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><RewardLandingScreen /></IOSDevice>
      </div>
    </div>
  );
}
function RewardLandingWeb() {
  const { TopNav } = DSRL;
  const navigate = (label) => { const u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html", Rewards: "RewardsWeb.html" }[label]; if (u) goRL(u); };
  return (
    <>
      <TopNav active="Rewards" user={ME_RL} logoSrc="assets/profinity-icon-purple-gold.png" onNavigate={navigate} style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      <div className="rl-page" data-screen-label="Reward">
        <button type="button" className="rl-crumb" onClick={() => goRL(retRL())}><DSRL.IconifyIcon name="lucide:chevron-left" size={16} color="currentColor" />Back to Rewards</button>
        <RewardLandingView />
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(RL_WEB ? <RewardLandingWeb /> : <RewardLandingMobile />);
