/* ===========================================================================
   PROfinity — Katy · Redemption Success (Screen 14) · iPhone 17 Pro Max
   Confirmation after a Rewards Store redemption: voucher code, next
   instructions based on the item's delivery method, print/email tools.
   Reads the most recent voucher from window.PFLoyalty state. Suffixed -RSC.
   =========================================================================== */
const { useState: useStateRSC } = React;
const DSRSC = window.ProfinityDesignSystem_c2b5cc;
const PF_RSC = window.PFLoyalty;

function goRSC(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

function RedemptionSuccessScreen() {
  const [state] = useStateRSC(() => PF_RSC.getState());
  const [copied, setCopied] = useStateRSC(false);
  const voucher = state.redeemedVouchers[state.redeemedVouchers.length - 1];

  const copyCode = () => {
    if (!voucher) return;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };

  if (!voucher) {
    return (
      <div className="ml-screen rsc-screen" data-screen-label="Redemption Success (empty)">
        <div className="ml-top"><button className="ml-back" aria-label="Back" onClick={() => goRSC("RewardsStore.html")}><DSRSC.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button><h1>Redemption</h1><span /></div>
        <div className="ml-empty"><DSRSC.IconifyIcon name="lucide:gift" size={28} color="var(--gray-400)" /><p>No redemption yet — visit the Rewards Store to redeem your first item.</p>
          <button className="ml-btn ml-btn-navy ml-btn-sm" type="button" onClick={() => goRSC("RewardsStore.html")}>Go to Rewards Store</button>
        </div>
      </div>
    );
  }

  const item = PF_RSC.getConfig().storeItems.find((i) => i.id === voucher.itemId);

  return (
    <div className="ml-screen rsc-screen" data-screen-label="Redemption Success">
      <div className="rsc-hero">
        <div className="rsc-check"><DSRSC.IconifyIcon name="lucide:check" size={30} color="#fff" /></div>
        <h1>Reward Claimed!</h1>
        <p>{voucher.itemName}</p>
      </div>
      <div className="ml-scroll">
        <div className="ml-card rsc-code-card">
          <div className="rsc-code-label">Your Voucher Code</div>
          <div className="rsc-code">{voucher.code}</div>
          <button className="ml-btn ml-btn-ghost ml-btn-sm" type="button" onClick={copyCode}><DSRSC.IconifyIcon name={copied ? "lucide:check" : "lucide:copy"} size={14} color="var(--gray-700)" />{copied ? "Copied" : "Copy Code"}</button>
        </div>

        <div className="ml-sec-h"><h2>What happens next</h2></div>
        <div className="ml-card rsc-next-row"><DSRSC.IconifyIcon name="lucide:truck" size={18} color="var(--brand-navy)" /><span>Delivery method: {item ? item.delivery : "Email code"}</span></div>
        <div className="ml-card rsc-next-row"><DSRSC.IconifyIcon name="lucide:mail" size={18} color="var(--brand-navy)" /><span>A confirmation has been sent to {state.user.email}</span></div>
        <div className="ml-card rsc-next-row"><DSRSC.IconifyIcon name="lucide:clock" size={18} color="var(--brand-navy)" /><span>Redeemed {new Date(voucher.redeemedAt).toLocaleString("en-GB")}</span></div>

        <div className="rsc-tool-row">
          <button className="ml-btn ml-btn-ghost" type="button" onClick={() => window.print && window.print()}><DSRSC.IconifyIcon name="lucide:printer" size={16} color="var(--gray-700)" />Print</button>
          <button className="ml-btn ml-btn-ghost" type="button" onClick={copyCode}><DSRSC.IconifyIcon name="lucide:send" size={16} color="var(--gray-700)" />Email Me</button>
        </div>
        <button className="ml-btn ml-btn-navy" type="button" style={{ marginTop: 14 }} onClick={() => goRSC("RewardsDashboard.html")}>Back to Dashboard</button>
      </div>
    </div>
  );
}

function useDeviceScaleRSC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRSC(calc);
  React.useEffect(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileRSC() {
  const [mobile, setMobile] = useStateRSC(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function RedemptionSuccessApp() {
  const mobile = useIsMobileRSC();
  const scale = useDeviceScaleRSC();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><RedemptionSuccessScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><RedemptionSuccessScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<RedemptionSuccessApp />);
