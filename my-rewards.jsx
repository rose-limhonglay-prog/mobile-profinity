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
    sub: perk ? (perk.milestone.name + (league ? " League" : "") + " perk" + (voucher.delivery ? " · " + voucher.delivery : "")) : (course ? "Save " + poundsMR(saving) + " · " + poundsMR(course.price - saving) + " instead of " + poundsMR(course.price) : voucher.itemName),
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

function MyRewardsScreen() {
  const [state, setState] = useStateMR(() => PF_MR.getState());
  const [config] = useStateMR(() => PF_MR.getConfig());
  const [copiedCode, copy] = useCopyMR();
  useEffectMR(() => {
    const refresh = () => setState(PF_MR.getState());
    window.addEventListener("storage", refresh); window.addEventListener("pf:perk-redeemed", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("pf:perk-redeemed", refresh); };
  }, []);
  const rows = useMemoMR(() => {
    const purchased = purchasedMR();
    return (state.redeemedVouchers || []).slice().reverse().map((v) => enrichMR(v, config.storeItems || [], purchased));
  }, [state, config]);
  const ready = rows.filter((r) => !r.used).length;
  const total = (() => { try { return PF_MR.getMilestoneProgress(state).path.length; } catch (e) { return 6; } })();

  return (
    <div className="ml-screen mr-screen" data-screen-label="Redeemed rewards">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goMR(retMR())}><DSMR.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Redeemed rewards</h1>
        <span />
      </div>
      <div className="ml-scroll mr-scroll">
        {rows.length > 0 && (
          <div className="mr-summary">
            <div><b>{rows.length}</b><span>redeemed</span></div>
            <div><b>{ready}</b><span>ready to use</span></div>
            <div><b>{Math.max(0, total - rows.length)}</b><span>still to unlock</span></div>
          </div>
        )}
        {rows.length === 0 ? (
          <div className="mr-empty">
            <span className="mr-empty-ic"><DSMR.IconifyIcon name="lucide:ticket" size={30} color="var(--brand-navy)" /></span>
            <h2>Nothing redeemed yet</h2>
            <p>Each league on My Rewards unlocks one perk. Redeem it on the perk's page and its code will show up here.</p>
            <button className="ml-btn mr-btn mr-btn-primary" type="button" style={{ width: "auto" }} onClick={() => goMR(retMR())}>Back to My Rewards</button>
          </div>
        ) : (
          <div className="mr-list">
            {rows.map((r) => <RewardRow key={r.voucher.code} r={r} copiedCode={copiedCode} onCopy={copy} />)}
          </div>
        )}
        {rows.length > 0 && (
          <p className="mr-foot"><DSMR.IconifyIcon name="lucide:shield-check" size={14} color="var(--gray-500)" />Tap a reward to open its page, use the code or email it to yourself.</p>
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
