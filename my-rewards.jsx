/* ===========================================================================
   PROfinity — Katy · Redeemed rewards · iPhone 17 Pro Max
   Sub page of My Rewards (MilestonePath.html, user 2026-10-14): every league
   perk the member has redeemed on its landing page, newest first — league
   gem, perk title, league · redeemed date, the voucher code with one-tap copy
   and a Ready / Used status. Tapping a row opens the perk's landing page
   (RewardLanding.html?reward=<key>). Legacy course-discount vouchers from the
   old store still list with their thumbnail. Reads window.PFLoyalty state.
   Suffixed -MR, classes mr-.
   =========================================================================== */
const { useState: useStateMR, useMemo: useMemoMR, useEffect: useEffectMR } = React;
const DSMR = window.ProfinityDesignSystem_c2b5cc;
const PF_MR = window.PFLoyalty;
const LG_MR = window.PFLeague || null;

function goMR(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function retMR() {
  try { const r = new URLSearchParams(location.search).get("ret"); if (r && /^[A-Za-z0-9_./?=&-]+$/.test(r)) return r; } catch (e) {}
  return "MilestonePath.html";
}
function poundsMR(n) { return "£" + Math.round(n).toLocaleString("en-GB"); }
function purchasedMR() { try { return JSON.parse(localStorage.getItem("pf-purchased-courses")) || []; } catch (e) { return []; } }
function whenMR(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function leagueMR(key) { try { return LG_MR && LG_MR.getLeague ? LG_MR.getLeague(key) : null; } catch (e) { return null; } }

/* league gem (raw JSON via lottie-web), parked on a mid frame */
function GemMR({ src, size }) {
  const host = React.useRef(null);
  useEffectMR(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: false, autoplay: false, path: src });
      anim.addEventListener("DOMLoaded", () => anim.goToAndStop(Math.floor(anim.totalFrames * 0.4), true));
    };
    if (window.lottie) start();
    else { t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120); setTimeout(() => clearInterval(t), 8000); }
    return () => { clearInterval(t); if (anim) anim.destroy(); };
  }, [src]);
  return <span ref={host} className="mr-gem" style={{ width: size, height: size }} aria-hidden="true" />;
}

/* join a voucher with its perk (league gem, delivery) or legacy store item */
function enrichMR(voucher, items, purchased) {
  const perkKey = voucher.perkKey || (/^perk:/.test(voucher.itemId || "") ? voucher.itemId.slice(5) : null);
  const perk = perkKey && PF_MR.getPerk ? PF_MR.getPerk(perkKey) : null;
  const league = perkKey ? leagueMR(perkKey) : null;
  const item = !perkKey ? (items.find((i) => i.id === voucher.itemId) || null) : null;
  const course = voucher.course || (item && item.course) || null;
  const saving = course ? Math.round(course.price * course.discountPct / 100) : 0;
  const used = !!(course && purchased.includes(course.slug));
  return { voucher, perkKey, perk, league, item, course, saving, used,
    image: item && item.image ? item.image : null,
    title: perk && perk.benefit ? perk.benefit.title : (course ? course.title : voucher.itemName),
    sub: perk ? (perk.milestone.name + (league ? " League" : "")) : (course ? "Save " + poundsMR(saving) + " · " + poundsMR(course.price - saving) + " instead of " + poundsMR(course.price) : voucher.itemName),
    href: perkKey ? "RewardLanding.html?reward=" + encodeURIComponent(perkKey) + "&ret=" + encodeURIComponent("MyRewards.html?ret=" + retMR()) : (course ? "CourseCheckout.html?course=" + encodeURIComponent(course.slug) + "&title=" + encodeURIComponent(course.title) + "&price=" + course.price : null) };
}

function useCopyMR() {
  const [copiedCode, setCopied] = useStateMR(null);
  const copy = (code) => {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code); setTimeout(() => setCopied(null), 1600);
  };
  return [copiedCode, copy];
}

function RewardRow({ r, copiedCode, onCopy }) {
  const vars = r.league ? { "--lg-accent": r.league.accent, "--lg-deep": r.league.deep, "--lg-soft": r.league.soft } : null;
  return (
    <div className={"mr-row" + (r.used ? " used" : "") + (r.league ? " mr-row-league" : "")} style={vars}>
      <button type="button" className="mr-row-main" onClick={() => r.href && goMR(r.href)} aria-label={"Details for " + r.title}>
        <span className="mr-thumb">
          {r.league ? <GemMR src={r.league.lottie} size={44} /> : r.image ? <img src={r.image} alt="" /> : <DSMR.IconifyIcon name="lucide:gift" size={20} color="var(--brand-navy)" />}
          {r.course && <span className="mr-off">{r.course.discountPct}% OFF</span>}
        </span>
        <span className="mr-tx">
          <b>{r.title}</b>
          <i>{r.sub}</i>
          <span className="mr-meta"><span className={"mr-status " + (r.used ? "used" : "ready")}>{r.used ? "Used" : "Ready to use"}</span>{whenMR(r.voucher.redeemedAt)}</span>
        </span>
        <DSMR.IconifyIcon name="lucide:chevron-right" size={18} color="var(--gray-400)" />
      </button>
      <div className="mr-code-row">
        <code className="mr-code">{r.voucher.code}</code>
        <button type="button" className="mr-copy" onClick={() => onCopy(r.voucher.code)} aria-label={"Copy code " + r.voucher.code}>
          <DSMR.IconifyIcon name={copiedCode === r.voucher.code ? "lucide:check" : "lucide:copy"} size={14} color="var(--brand-navy)" />{copiedCode === r.voucher.code ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/* every league perk with its live status (unlocked / redeemed / locked) */
function perksMR(state) {
  try {
    const path = (PF_MR.getConfig().milestonePath || []).slice().sort((a, b) => a.threshold - b.threshold);
    return path.map((m) => PF_MR.getPerk(m.key, state)).filter((p) => p && p.benefit);
  } catch (e) { return []; }
}
function landingMR(key) { return "RewardLanding.html?reward=" + encodeURIComponent(key) + "&ret=" + encodeURIComponent("MyRewards.html?ret=" + retMR()); }

/* "Ready to redeem" prize card (2026-10-19, user: "make this page fun and
   exciting, add the redeemable rewards") — league-tinted, gem, big title,
   one-line description, pulsing dot; tap → the perk's landing page */
function ReadyCardMR({ perk, index }) {
  const league = leagueMR(perk.key);
  const vars = league ? { "--lg-accent": league.accent, "--lg-deep": league.deep, "--lg-soft": league.soft, "--i": index } : { "--i": index };
  return (
    <button type="button" className="mr-ready" style={vars} onClick={() => goMR(landingMR(perk.key))} aria-label={perk.benefit.title + ", ready to redeem. Open reward"}>
      {league ? <span className="mr-ready-gem"><GemMR src={league.lottie} size={52} /></span> : null}
      <span className="mr-ready-tx">
        <b>{perk.benefit.title}</b>
        <i>{perk.benefit.description}</i>
      </span>
      <span className="mr-ready-go" aria-hidden="true">Redeem<DSMR.IconifyIcon name="lucide:chevron-right" size={16} color="currentColor" /></span>
    </button>
  );
}

function MyRewardsScreen() {
  const [state, setState] = useStateMR(() => PF_MR.getState());
  const [config] = useStateMR(() => PF_MR.getConfig());
  const [copiedCode, copy] = useCopyMR();
  useEffectMR(() => {
    const refresh = () => setState(PF_MR.getState());
    window.addEventListener("storage", refresh); window.addEventListener("pf:perk-redeemed", refresh); window.addEventListener("pf:points-earned", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("pf:perk-redeemed", refresh); window.removeEventListener("pf:points-earned", refresh); };
  }, []);
  const rows = useMemoMR(() => {
    const purchased = purchasedMR();
    return (state.redeemedVouchers || []).slice().reverse().map((v) => enrichMR(v, config.storeItems || [], purchased));
  }, [state, config]);
  const perks = useMemoMR(() => perksMR(state), [state]);
  const readyPerks = perks.filter((p) => p.status === "unlocked");
  const nextPerk = perks.find((p) => p.status === "locked") || null;
  const nextLeague = nextPerk ? leagueMR(nextPerk.key) : null;
  const nothing = readyPerks.length === 0 && rows.length === 0;

  return (
    <div className="ml-screen mr-screen" data-screen-label="Redeemed rewards">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goMR(retMR())}><DSMR.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Your rewards</h1>
        <span />
      </div>
      <div className="ml-scroll mr-scroll">
        {/* hero: how many are waiting (2026-10-19) */}
        <div className={"mr-hero" + (readyPerks.length ? " is-ready" : "")}>
          <span className="mr-hero-ic" aria-hidden="true"><DSMR.IconifyIcon name={readyPerks.length ? "lucide:gift" : rows.length ? "lucide:party-popper" : "lucide:sparkles"} size={34} color="#fff" /></span>
          <span className="mr-hero-tx">
            {readyPerks.length
              ? <React.Fragment><b>{readyPerks.length === 1 ? "1 reward" : readyPerks.length + " rewards"} waiting!</b><i>Tap one to redeem it.</i></React.Fragment>
              : rows.length
                ? <React.Fragment><b>All redeemed!</b><i>Your codes are below.</i></React.Fragment>
                : <React.Fragment><b>No rewards yet</b><i>Earn points to unlock your first one.</i></React.Fragment>}
          </span>
        </div>

        {readyPerks.length > 0 && (
          <section className="mr-sec" aria-label="Ready to redeem">
            <h2 className="mr-sec-h">Ready to redeem</h2>
            <div className="mr-ready-list">
              {readyPerks.map((p, i) => <ReadyCardMR key={p.key} perk={p} index={i} />)}
            </div>
          </section>
        )}

        {rows.length > 0 && (
          <section className="mr-sec" aria-label="Redeemed">
            <h2 className="mr-sec-h">Redeemed</h2>
            <div className="mr-list">
              {rows.map((r) => <RewardRow key={r.voucher.code} r={r} copiedCode={copiedCode} onCopy={copy} />)}
            </div>
            <p className="mr-foot"><DSMR.IconifyIcon name="lucide:shield-check" size={14} color="var(--gray-500)" />Tap a reward to use its code.</p>
          </section>
        )}

        {nextPerk && (
          <section className="mr-sec" aria-label="Next up">
            <h2 className="mr-sec-h">Next up</h2>
            <button type="button" className="mr-next" style={nextLeague ? { "--lg-accent": nextLeague.accent, "--lg-deep": nextLeague.deep, "--lg-soft": nextLeague.soft } : null}
              onClick={() => goMR(landingMR(nextPerk.key))} aria-label={nextPerk.benefit.title + ", " + PF_MR.formatNumber(nextPerk.remaining) + " points to go. Open reward"}>
              {nextLeague ? <span className="mr-next-gem"><GemMR src={nextLeague.lottie} size={44} /></span> : null}
              <span className="mr-next-tx">
                <b>{nextPerk.benefit.title}</b>
                <i><strong>{PF_MR.formatNumber(nextPerk.remaining)} pts</strong> to go</i>
                <span className="mr-next-track" aria-hidden="true"><span style={{ width: nextPerk.pct + "%" }} /></span>
              </span>
              <DSMR.IconifyIcon name="lucide:lock" size={18} color="var(--gray-400)" />
            </button>
          </section>
        )}

        {nothing && (
          <button className="ml-btn mr-btn mr-btn-primary mr-earn-btn" type="button" onClick={() => goMR("WaysToEarn.html?ret=MyRewards.html")}>See ways to earn</button>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function useDeviceScaleMR() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateMR(calc);
  React.useEffect(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileMR() {
  const [mobile, setMobile] = useStateMR(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}
function useIsDarkMR() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateMR(read);
  React.useEffect(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

function MyRewardsApp() {
  const mobile = useIsMobileMR();
  const scale = useDeviceScaleMR();
  const dark = useIsDarkMR();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><MyRewardsScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><MyRewardsScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MyRewardsApp />);
