/* ===========================================================================
   PROfinity — Membership Tier (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -MT to avoid global-scope clashes.
   Reached from the "See Membership Plans" upgrade paywall (app.jsx UpgradeModal).
   =========================================================================== */
const { useState: useStateMT, useEffect: useEffectMT } = React;
const DSMT = window.ProfinityDesignSystem_c2b5cc;

function goMT(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleMT() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateMT(calc);
  useEffectMT(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileMT() {
  const [mobile, setMobile] = useStateMT(() => window.matchMedia('(max-width:768px)').matches);
  useEffectMT(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const TIERS_MT = [
  {
    key: "confidence", name: "Confidence", tagline: "Build your skills as an injector",
    price: 97, yearly: 970, dark: false, highlight: false, icon: null, badge: null,
    features: [
      "Full access to membership library",
      "Expert complications support",
      "Live Technique Tuesday training",
      "Clinician directory listing",
    ],
    cta: "Subscribe Now",
  },
  {
    key: "mastery", name: "Mastery", tagline: "Become a recognised member",
    price: 397, yearly: 3970, dark: false, highlight: true, icon: "crown", badge: "MOST POPULAR",
    includesPrev: "Confidence",
    features: [
      "Entire e-learning catalogue",
      "All six flagship courses included",
      "Master injector credential",
      "Premium directory listing",
      "In-person shadowing bookings",
    ],
    cta: "Subscribe Now",
  },
  {
    key: "builder", name: "Builder", tagline: null,
    price: 747, yearly: null, dark: true, highlight: false, icon: null, badge: null,
    includesPrev: "Mastery",
    features: [
      "Profinity Hub CRM access",
      "Funnels & automations setup",
      "Live business group coaching",
      "Mentoring from Dr Tim & Miranda",
    ],
    cta: "Apply Now",
  },
  {
    key: "sovereign", name: "Sovereign", tagline: null,
    price: 1497, yearly: null, dark: true, highlight: false, icon: "crown", badge: null,
    includesPrev: "Builder",
    features: [
      "Done-for-you growth engine",
      "One-on-one scaling membership",
      "Annual Profinity Retreat seat",
      "VIP Conference access",
    ],
    cta: "Apply Now",
  },
];

const COMPARE_MT = [
  { group: "Foundation", rows: [
    { label: "Membership library & resources", stars: 4 },
    { label: "Live Technique Tuesday coaching", stars: 4 },
    { label: "Complication support", stars: 4 },
    { label: "Standard clinician directory listing", stars: 3 },
    { label: "Fresh content delivered weekly", stars: 4 },
  ] },
  { group: "Credentials & E-learning", rows: [
    { label: "All 6 flagship courses in full", stars: 3 },
    { label: "Master injector credential", stars: 3 },
    { label: "Premium Master Injector listing", stars: 3 },
    { label: "In-person shadowing days", stars: 3 },
    { label: "Earn from your status", stars: 3 },
  ] },
  { group: "Business & Automation", rows: [
    { label: "Profinity Hub access", stars: 2 },
    { label: "ProfinityHub platform (CRM, funnels & automations)", stars: 2 },
    { label: "Full business e-learning track", stars: 2 },
    { label: "Live group coaching", stars: 2 },
    { label: "Close-access mentoring", stars: 2 },
  ] },
  { group: "Elite & Done-for-You", rows: [
    { label: "Done-for-you Growth Engine", stars: 1 },
    { label: "Ongoing business mentorship", stars: 1 },
    { label: "Profinity Conference ticket", stars: 1 },
    { label: "Annual Profinity Retreat", stars: 1 },
  ] },
  { group: "Billing", rows: [
    { label: "2 months free — annual billing", stars: 4 },
    { label: "Loyalty pricing for existing course owners", stars: 4 },
    { label: "Rate set by courses already owned — then frozen for life", stars: 4 },
  ] },
];

const OWNERSHIP_MT = [
  { label: "You own 5–6 of the 6", desc: "Upgrade cost today", price: "£0" },
  { label: "You own 2–4 of the 6", desc: "We'll credit what you already own", price: "£197" },
  { label: "You own 1 of the 6", desc: "Lowest door rate available", price: "£297" },
];

function StatChip({ icon, value, label }) {
  return (
    <div className="mt-stat">
      <span className="mt-stat-icon">
        <DSMT.IconifyIcon name={icon} size={22} color="var(--brand-gold-soft)" />
      </span>
      <span className="mt-stat-value">{value}</span>
      <span className="mt-stat-label">{label}</span>
    </div>);
}

function TierCard({ tier, onSelect }) {
  return (
    <div className={"mt-tier" + (tier.dark ? " dark" : "") + (tier.highlight ? " highlight" : "")}>
      {tier.badge &&
      <span className="mt-tier-badge">
          <DSMT.IconifyIcon name="lucide:star" size={13} color="#fff" /> {tier.badge}
        </span>
      }
      <div className="mt-tier-head">
        {tier.icon &&
        <span className="mt-tier-icon">
            <DSMT.IconifyIcon name={"lucide:" + tier.icon} size={20} color="var(--brand-gold-soft)" />
          </span>
        }
        <h3>{tier.name}</h3>
      </div>
      {tier.tagline && <p className="mt-tier-tagline">{tier.tagline}</p>}
      <div className="mt-tier-price">
        <span className="mt-tier-amount">£{tier.price.toLocaleString()}</span>
        <span className="mt-tier-period">/monthly</span>
      </div>
      {tier.yearly ?
      <p className="mt-tier-sub">£{tier.yearly.toLocaleString()} per year <span className="mt-tier-free">2 MONTHS FREE</span></p> :
      <p className="mt-tier-sub mt-tier-sub-muted">Everything in {tier.includesPrev}, plus:</p>}
      {tier.yearly && tier.includesPrev &&
      <p className="mt-tier-sub mt-tier-sub-muted">Everything in {tier.includesPrev}, plus:</p>
      }
      <ul className="mt-tier-features">
        {tier.features.map((f, i) =>
        <li key={i}>
            <DSMT.IconifyIcon name="lucide:check" size={16} color={tier.dark ? "var(--brand-gold-soft)" : "var(--premium-orange)"} />
            <span>{f}</span>
          </li>
        )}
      </ul>
      <button type="button" className={"mt-tier-cta" + (tier.dark ? " on-dark" : "")} onClick={() => onSelect(tier)}>
        {tier.cta} <DSMT.IconifyIcon name="lucide:arrow-right" size={16} color={tier.dark ? "var(--brand-navy-900)" : "#fff"} />
      </button>
    </div>);
}

function CompareStars({ filled }) {
  return (
    <span className="mt-compare-stars">
      {[1, 2, 3, 4].map((i) =>
      <DSMT.IconifyIcon key={i} name={i <= filled ? "lucide:star" : "lucide:star"} size={13}
      color={i <= filled ? "var(--premium-orange)" : "var(--gray-200)"} />
      )}
    </span>);
}

function MembershipTier() {
  const onSelect = (tier) => goMT("SubscribeCheckout.html?tier=" + tier.key);

  return (
    <div className="mt-screen" data-screen-label="Membership Tier (mobile)">
      <header className="mt-top">
        <button className="mt-back" aria-label="Back" onClick={() => goMT("NewsfeedMobile.html")}>
          <DSMT.IconifyIcon name="lucide:chevron-left" size={26} color="#fff" />
        </button>
        <h1>Membership Tier</h1>
      </header>

      <div className="mt-scroll">
        {/* Hero */}
        <section className="mt-hero">
          <span className="mt-eyebrow">Your path to your dream clinic</span>
          <h2 className="mt-hero-title">From injector to <span>business owner.</span></h2>
          <p className="mt-hero-sub">Profinity provides the roadmap, the credentials, and the systems to get you there — whether you're finding your feet or scaling to a sovereign clinic.</p>
          <div className="mt-hero-ctas">
            <button type="button" className="mt-btn-fill" onClick={() => goMT("SubscribeCheckout.html")}>Subscribe Now</button>
            <button type="button" className="mt-btn-outline" onClick={() => goMT("SubscribeCheckout.html")}>Subscribe Now</button>
          </div>
          <div className="mt-stats">
            <StatChip icon="lucide:trending-up" value="4" label="Growth tiers" />
            <StatChip icon="lucide:book-open" value="6" label="Flagship courses" />
            <StatChip icon="lucide:infinity" value="∞" label="Price freeze" />
          </div>
        </section>

        <div className="mt-trial-banner">
          <DSMT.IconifyIcon name="lucide:sparkles" size={16} color="var(--brand-navy-900)" />
          Start your 2 months free trial
        </div>

        {/* Programme structure */}
        <section className="mt-section">
          <span className="mt-eyebrow dark">Programme structure</span>
          <h2 className="mt-section-title">Choose your growth tier</h2>
          <p className="mt-section-sub">Each tier is a stage in your career journey. Join at the level that meets you where you are — and grow from there.</p>

          <TierCard tier={TIERS_MT[0]} onSelect={onSelect} />
          <TierCard tier={TIERS_MT[1]} onSelect={onSelect} />
        </section>

        {/* Freedom path */}
        <section className="mt-freedom">
          <span className="mt-eyebrow gold">The Freedom Path</span>
          <p className="mt-freedom-sub">For the injector ready to build a business — not just a skill set.</p>

          <TierCard tier={TIERS_MT[2]} onSelect={onSelect} />
          <TierCard tier={TIERS_MT[3]} onSelect={onSelect} />
        </section>

        {/* Comparison table */}
        <section className="mt-section">
          <span className="mt-eyebrow dark">Feature breakdown</span>
          <h2 className="mt-section-title">Compare all tiers</h2>

          <div className="mt-compare">
            {COMPARE_MT.map((grp) =>
            <div className="mt-compare-group" key={grp.group}>
                <div className="mt-compare-group-h">{grp.group}</div>
                {grp.rows.map((row) =>
              <div className="mt-compare-row" key={row.label}>
                    <span className="mt-compare-label">{row.label}</span>
                    <CompareStars filled={row.stars} />
                  </div>
              )}
              </div>
            )}
          </div>
        </section>

        {/* Existing course owners */}
        <section className="mt-owners">
          <h2>Already own our previous courses?</h2>
          <p>Your Mastery rate is set by how many flagship courses you already own — then frozen for life.</p>
          <div className="mt-owners-list">
            {OWNERSHIP_MT.map((o) =>
            <div className="mt-owners-row" key={o.label}>
                <div>
                  <div className="mt-owners-label">{o.label}</div>
                  <div className="mt-owners-desc">{o.desc}</div>
                </div>
                <span className="mt-owners-price">{o.price}</span>
              </div>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-footer">
          <h2>Your dream clinic starts here.</h2>
          <p>Choose your tier, lock in your price, and begin.</p>
          <div className="mt-hero-ctas">
            <button type="button" className="mt-btn-fill" onClick={() => goMT("SubscribeCheckout.html")}>Subscribe Now</button>
            <button type="button" className="mt-btn-outline" onClick={() => goMT("SubscribeCheckout.html")}>Subscribe Now <DSMT.IconifyIcon name="lucide:arrow-right" size={14} color="#fff" /></button>
          </div>
          <p className="mt-footer-note">Subscriptions are managed through our web app.</p>
          <div className="mt-footer-brand">
            <span className="mt-footer-logo">P</span> Profinity Design
          </div>
          <p className="mt-footer-copy">© 2026 Profinity Academy. All rights reserved.</p>
        </section>
      </div>
    </div>);
}

function MembershipTierApp() {
  const mobile = useIsMobileMT();
  const scale = useDeviceScaleMT();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(217, 218, 225)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><MembershipTier /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><MembershipTier /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MembershipTierApp />);
