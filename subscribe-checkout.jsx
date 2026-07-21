/* ===========================================================================
   PROfinity — Subscribe Checkout / Payment Summary (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -SC to avoid global-scope clashes.
   Reached from "Subscribe Now" on MembershipTier.html via ?tier=<key>.
   =========================================================================== */
const { useState: useStateSC, useEffect: useEffectSC } = React;
const DSSC = window.ProfinityDesignSystem_c2b5cc;

function goSC(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleSC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSC(calc);
  useEffectSC(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileSC() {
  const [mobile, setMobile] = useStateSC(() => window.matchMedia('(max-width:768px)').matches);
  useEffectSC(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const VAT_RATE_SC = 0.2;

const TIERS_SC = {
  confidence: { name: "Confidence", desc: "Full portal access", icon: "shield-check", monthly: 97, yearly: 970 },
  mastery: { name: "Mastery", desc: "Full portal access", icon: "crown", monthly: 397, yearly: 3970 },
};

function getTierFromQuerySC() {
  const key = new URLSearchParams(window.location.search).get("tier");
  return TIERS_SC[key] || TIERS_SC.confidence;
}

function SubscribeCheckout() {
  const [tier] = useStateSC(getTierFromQuerySC);
  const [cycle, setCycle] = useStateSC("monthly");
  const [promo, setPromo] = useStateSC("");

  const price = cycle === "monthly" ? tier.monthly : tier.yearly;
  const vat = Math.round(price * VAT_RATE_SC);
  const dueToday = vat;
  const cycleLabel = cycle === "monthly" ? "Monthly" : "Yearly";

  return (
    <div className="sc-screen" data-screen-label="Subscribe Checkout (mobile)">
      <header className="sc-top">
        <button className="sc-back" aria-label="Back" onClick={() => goSC("MembershipTier.html")}>
          <DSSC.IconifyIcon name="lucide:chevron-left" size={22} color="var(--brand-navy)" />
        </button>
        <h1>Payment Summary</h1>
      </header>

      <div className="sc-scroll">
        <section className="sc-intro">
          <h2>Review &amp; confirm</h2>
          <p>You're one step away from unlocking your membership.</p>
        </section>

        <div className="sc-plan-card">
          <span className="sc-plan-icon">
            <DSSC.IconifyIcon name={"lucide:" + tier.icon} size={22} color="var(--brand-gold-soft)" />
          </span>
          <div className="sc-plan-info">
            <h3>{tier.name} Membership</h3>
            <p>{tier.desc}</p>
          </div>
          <button type="button" className="sc-change" onClick={() => goSC("MembershipTier.html")}>Change</button>
        </div>

        <section className="sc-section">
          <h4>Billing cycle</h4>
          <div className="sc-cycle-row">
            <button
              type="button"
              className={"sc-cycle" + (cycle === "monthly" ? " selected" : "")}
              onClick={() => setCycle("monthly")}
            >
              <span className="sc-cycle-name">Monthly</span>
              <span className="sc-cycle-price">£{tier.monthly.toLocaleString()} / month</span>
            </button>
            <button
              type="button"
              className={"sc-cycle" + (cycle === "yearly" ? " selected" : "")}
              onClick={() => setCycle("yearly")}
            >
              <span className="sc-cycle-badge">Best value</span>
              <span className="sc-cycle-name">Yearly</span>
              <span className="sc-cycle-price">£{tier.yearly.toLocaleString()} / year</span>
            </button>
          </div>
        </section>

        <section className="sc-section">
          <h4>Order summary</h4>
          <div className="sc-summary-card">
            <div className="sc-summary-row">
              <span>{tier.name} · {cycleLabel}</span>
              <span>£{price.toLocaleString()}</span>
            </div>
            <div className="sc-summary-row">
              <span>30-day free trial</span>
              <span className="sc-negative">-£{price.toLocaleString()}</span>
            </div>
            <div className="sc-summary-row">
              <span>VAT (20%)</span>
              <span>£{vat.toLocaleString()}</span>
            </div>
            <div className="sc-summary-row sc-summary-total">
              <span>Due today</span>
              <span>£{dueToday.toLocaleString()}</span>
            </div>
          </div>

          <div className="sc-promo-row">
            <DSSC.IconifyIcon name="lucide:tag" size={15} color="var(--gray-400)" />
            <input
              className="sc-promo-input"
              type="text"
              placeholder="Add promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button type="button" className="sc-promo-apply">Apply</button>
          </div>
        </section>

        <section className="sc-section">
          <h4>Payment method</h4>
          <div className="sc-payment-card selected">
            <span className="sc-payment-icon">
              <DSSC.IconifyIcon name="lucide:credit-card" size={18} color="var(--brand-navy)" />
            </span>
            <div className="sc-payment-info">
              <h3>Visa ending 4242</h3>
              <p>Expires 08/28</p>
            </div>
            <DSSC.IconifyIcon name="lucide:check-circle-2" size={20} color="var(--brand-navy)" />
          </div>
          <button type="button" className="sc-add-payment">
            <DSSC.IconifyIcon name="lucide:plus" size={14} color="var(--brand-navy)" /> Add another payment method
          </button>

          <p className="sc-trial-note">
            <DSSC.IconifyIcon name="lucide:info" size={14} color="var(--gray-400)" />
            Your free trial starts today. You'll be charged £{price.toLocaleString()} when it ends, unless you cancel.
          </p>
        </section>
      </div>

      <div className="sc-footer">
        <div className="sc-footer-row">
          <span>Due today</span>
          <span>£{dueToday.toLocaleString()}</span>
        </div>
        <button type="button" className="sc-cta" onClick={() => goSC("NewsfeedMobile.html")}>
          <DSSC.IconifyIcon name="lucide:lock" size={15} color="#fff" /> Start free trial
        </button>
        <p className="sc-footer-secure">
          <DSSC.IconifyIcon name="lucide:shield-check" size={13} color="var(--gray-400)" />
          Secured by Stripe · 256-bit encryption
        </p>
      </div>
    </div>);
}

function SubscribeCheckoutApp() {
  const mobile = useIsMobileSC();
  const scale = useDeviceScaleSC();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(217, 218, 225)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><SubscribeCheckout /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><SubscribeCheckout /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<SubscribeCheckoutApp />);
