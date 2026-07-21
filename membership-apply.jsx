/* ===========================================================================
   PROfinity — Membership Application (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -MA to avoid global-scope clashes.
   Reached from "Apply Now" on MembershipTier.html via ?tier=<key>.
   =========================================================================== */
const { useState: useStateMA, useEffect: useEffectMA } = React;
const DSMA = window.ProfinityDesignSystem_c2b5cc;

function goMA(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleMA() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateMA(calc);
  useEffectMA(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileMA() {
  const [mobile, setMobile] = useStateMA(() => window.matchMedia('(max-width:768px)').matches);
  useEffectMA(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const TIERS_MA = [
  { key: "sovereign", name: "Sovereign Pathway", desc: "Done-for-you engine & scaling", price: 2417 },
  { key: "builder", name: "Builder Pathway", desc: "Hub CRM & business group coaching", price: 1500 },
];

function getTierFromQueryMA() {
  const key = new URLSearchParams(window.location.search).get("tier");
  return TIERS_MA.some((t) => t.key === key) ? key : "builder";
}

function MembershipApply() {
  const [tierKey, setTierKey] = useStateMA(getTierFromQueryMA);
  const [fullName, setFullName] = useStateMA("");
  const [email, setEmail] = useStateMA("");
  const [phone, setPhone] = useStateMA("");
  const [message, setMessage] = useStateMA("");
  const [submitted, setSubmitted] = useStateMA(false);

  const selectedTier = TIERS_MA.find((t) => t.key === tierKey);
  const canSubmit = fullName.trim() && email.trim() && phone.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="ma-screen" data-screen-label="Membership Application (mobile)">
        <header className="ma-top">
          <button className="ma-back" aria-label="Back" onClick={() => goMA("MembershipTier.html")}>
            <DSMA.IconifyIcon name="lucide:chevron-left" size={22} color="var(--brand-navy)" />
          </button>
          <h1>Membership Tier</h1>
        </header>

        <div className="ma-scroll">
          <div className="ma-confirm">
            <span className="ma-confirm-icon">
              <DSMA.IconifyIcon name="lucide:check" size={30} color="#fff" />
            </span>
            <h2>Application received</h2>
            <p>Thanks for applying. Your interest in the <strong>{selectedTier.name}</strong> has been logged. Our admissions team will reach out within 24 hours to help you finalise your application.</p>
            <button type="button" className="ma-confirm-cta" onClick={() => goMA("MembershipTier.html")}>Back to Membership Tier</button>
          </div>
        </div>
      </div>);
  }

  return (
    <div className="ma-screen" data-screen-label="Membership Application (mobile)">
      <header className="ma-top">
        <button className="ma-back" aria-label="Back" onClick={() => goMA("MembershipTier.html")}>
          <DSMA.IconifyIcon name="lucide:chevron-left" size={22} color="var(--brand-navy)" />
        </button>
        <h1>Membership Tier</h1>
      </header>

      <div className="ma-scroll">
        <section className="ma-intro">
          <span className="ma-eyebrow">Express your interest</span>
          <h2 className="ma-intro-title">Your path to ownership starts here</h2>
          <p className="ma-intro-sub">Complete this brief application form to secure your initial consultation and express interest in the exclusive Freedom Path.</p>
        </section>

        <div className="ma-card">
          <label className="ma-field">
            <span className="ma-label">Full name</span>
            <input className="ma-input" type="text" placeholder="e.g. Dr. Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </label>

          <label className="ma-field">
            <span className="ma-label">Email address</span>
            <input className="ma-input" type="email" placeholder="e.g. jane@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="ma-field">
            <span className="ma-label">Phone number</span>
            <input className="ma-input" type="tel" placeholder="e.g. +44 7123 456789" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>

          <div className="ma-field">
            <span className="ma-label">Select tier of interest</span>
            <div className="ma-tier-options">
              {TIERS_MA.map((t) =>
              <button
                type="button"
                key={t.key}
                className={"ma-tier-opt" + (tierKey === t.key ? " selected" : "")}
                onClick={() => setTierKey(t.key)}
              >
                  <span className="ma-tier-radio" />
                  <span className="ma-tier-opt-info">
                    <span className="ma-tier-opt-name">{t.name}</span>
                    <span className="ma-tier-opt-desc">{t.desc}</span>
                  </span>
                  <span className="ma-tier-opt-price">£{t.price.toLocaleString()}</span>
                </button>
              )}
            </div>
          </div>

          <label className="ma-field">
            <span className="ma-label">Message &amp; notes (optional)</span>
            <textarea className="ma-textarea" rows={4} placeholder="Any specific questions or details about your clinic goals..." value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>

          <button type="button" className="ma-submit" disabled={!canSubmit} onClick={handleSubmit}>Submit</button>
        </div>

        <p className="ma-notice">
          <span className="ma-notice-dot" />
          Our admissions team will reach out within 24 hours to help you finalise your application.
        </p>
      </div>
    </div>);
}

function MembershipApplyApp() {
  const mobile = useIsMobileMA();
  const scale = useDeviceScaleMA();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(217, 218, 225)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><MembershipApply /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><MembershipApply /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MembershipApplyApp />);
