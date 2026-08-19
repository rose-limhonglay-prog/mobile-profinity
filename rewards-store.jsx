/* ===========================================================================
   PROfinity — Katy · Rewards Store (Screen 12) · iPhone 17 Pro Max
   Redemption sink for Spendable Credits: card grid with image, name,
   description, credit cost and Redeem button; locked/padlock state when the
   balance is insufficient. Redeeming deducts credits via window.PFLoyalty
   and routes to Redemption Success. Suffixed -STR.
   =========================================================================== */
const { useState: useStateSTR, useMemo: useMemoSTR } = React;
const DSSTR = window.ProfinityDesignSystem_c2b5cc;
const PF_STR = window.PFLoyalty;

function goSTR(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

function StoreConfirm({ item, onCancel, onConfirm }) {
  if (!item) return null;
  return (
    <div className="str-scrim" onClick={onCancel}>
      <div className="str-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="str-confirm-icon"><DSSTR.IconifyIcon name="lucide:gift" size={26} color="var(--brand-navy)" /></div>
        <h2>Redeem {item.name}?</h2>
        <p>{PF_STR.formatNumber(item.cost)} Spendable Credits will be deducted from your balance.</p>
        <div className="str-confirm-ctas">
          <button className="ml-btn ml-btn-ghost" type="button" onClick={onCancel}>Cancel</button>
          <button className="ml-btn ml-btn-gold" type="button" onClick={onConfirm}>Confirm Redeem</button>
        </div>
      </div>
    </div>
  );
}

function StoreCard({ item, credits, onRedeem }) {
  const locked = credits < item.cost || (item.inventory != null && item.inventory <= 0);
  const outOfStock = item.inventory != null && item.inventory <= 0;
  return (
    <div className={"str-card" + (locked ? " is-locked" : "")}>
      <div className="str-card-media">
        {item.image ? <img src={item.image} alt="" /> : <DSSTR.IconifyIcon name="lucide:sparkles" size={30} color="var(--brand-gold)" />}
        {locked && <span className="str-lock-badge"><DSSTR.IconifyIcon name="lucide:lock" size={14} color="#fff" /></span>}
      </div>
      <div className="str-card-body">
        <div className="str-card-name">{item.name}</div>
        <div className="str-card-desc">{item.description}</div>
        <div className="str-card-foot">
          <span className="str-card-cost"><DSSTR.IconifyIcon name="lucide:wallet" size={13} color="var(--brand-navy)" />{PF_STR.formatNumber(item.cost)}</span>
          <button className="ml-btn ml-btn-sm ml-btn-navy" type="button" disabled={locked} onClick={() => onRedeem(item)}>{outOfStock ? "Sold Out" : "Redeem"}</button>
        </div>
      </div>
    </div>
  );
}

function RewardsStoreScreen() {
  const [config, setConfig] = useStateSTR(() => PF_STR.getConfig());
  const [state, setState] = useStateSTR(() => PF_STR.getState());
  const [category, setCategory] = useStateSTR("All");
  const [confirmItem, setConfirmItem] = useStateSTR(null);
  const [toast, setToast] = useStateSTR(null);

  const categories = useMemoSTR(() => ["All"].concat(Array.from(new Set(config.storeItems.map((i) => i.category)))), [config]);
  const items = useMemoSTR(() => category === "All" ? config.storeItems : config.storeItems.filter((i) => i.category === category), [config, category]);

  const confirmRedeem = () => {
    const res = PF_STR.redeemItem(confirmItem.id);
    setConfirmItem(null);
    if (!res.ok) { setToast(res.reason); setTimeout(() => setToast(null), 2600); return; }
    goSTR("RedemptionSuccess.html");
  };

  return (
    <div className="ml-screen str-screen" data-screen-label="Rewards Store">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goSTR("RewardsDashboard.html")}><DSSTR.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Rewards Store</h1>
        <span className="str-balance-chip"><DSSTR.IconifyIcon name="lucide:wallet" size={13} color="#fff" />{PF_STR.formatNumber(state.spendableCredits)}</span>
      </div>
      <div className="str-tabs">
        {categories.map((c) => <button key={c} type="button" className={"str-tab" + (c === category ? " is-active" : "")} onClick={() => setCategory(c)}>{c}</button>)}
      </div>
      <div className="ml-scroll">
        <div className="str-grid">
          {items.map((it) => <StoreCard key={it.id} item={it} credits={state.spendableCredits} onRedeem={setConfirmItem} />)}
        </div>
      </div>
      <StoreConfirm item={confirmItem} onCancel={() => setConfirmItem(null)} onConfirm={confirmRedeem} />
      {toast && <div className="ml-toast"><DSSTR.IconifyIcon name="lucide:alert-triangle" size={16} color="#fff" />{toast}</div>}
    </div>
  );
}

function useDeviceScaleSTR() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSTR(calc);
  React.useEffect(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileSTR() {
  const [mobile, setMobile] = useStateSTR(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function RewardsStoreApp() {
  const mobile = useIsMobileSTR();
  const scale = useDeviceScaleSTR();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><RewardsStoreScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><RewardsStoreScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<RewardsStoreApp />);
