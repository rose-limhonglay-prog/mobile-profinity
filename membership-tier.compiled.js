/* ===========================================================================
   PROfinity — Membership Tier (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -MT to avoid global-scope clashes.
   Reached from the "See Membership Plans" upgrade paywall (app.jsx UpgradeModal).
   =========================================================================== */
const {
  useState: useStateMT,
  useEffect: useEffectMT
} = React;
const DSMT = window.ProfinityDesignSystem_c2b5cc;
function goMT(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
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
const TIERS_MT = [{
  key: "confidence",
  name: "Confidence",
  tagline: "Build your skills as an injector",
  price: 97,
  yearly: 970,
  dark: false,
  highlight: false,
  icon: null,
  badge: null,
  features: ["Full access to membership library", "Expert complications support", "Live Technique Tuesday training", "Clinician directory listing"],
  cta: "Subscribe Now"
}, {
  key: "mastery",
  name: "Mastery",
  tagline: "Become a recognised member",
  price: 397,
  yearly: 3970,
  dark: false,
  highlight: true,
  icon: "crown",
  badge: "MOST POPULAR",
  includesPrev: "Confidence",
  features: ["Entire e-learning catalogue", "All six flagship courses included", "Master injector credential", "Premium directory listing", "In-person shadowing bookings"],
  cta: "Subscribe Now"
}, {
  key: "builder",
  name: "Builder",
  tagline: null,
  price: 747,
  yearly: null,
  dark: true,
  highlight: false,
  icon: null,
  badge: null,
  includesPrev: "Mastery",
  features: ["Profinity Hub CRM access", "Funnels & automations setup", "Live business group coaching", "Mentoring from Dr Tim & Miranda"],
  cta: "Apply Now"
}, {
  key: "sovereign",
  name: "Sovereign",
  tagline: null,
  price: 1497,
  yearly: null,
  dark: true,
  highlight: false,
  icon: "crown",
  badge: null,
  includesPrev: "Builder",
  features: ["Done-for-you growth engine", "One-on-one scaling membership", "Annual Profinity Retreat seat", "VIP Conference access"],
  cta: "Apply Now"
}];
const COMPARE_MT = [{
  group: "Foundation",
  rows: [{
    label: "Membership library & resources",
    stars: 4
  }, {
    label: "Live Technique Tuesday coaching",
    stars: 4
  }, {
    label: "Complication support",
    stars: 4
  }, {
    label: "Standard clinician directory listing",
    stars: 3
  }, {
    label: "Fresh content delivered weekly",
    stars: 4
  }]
}, {
  group: "Credentials & E-learning",
  rows: [{
    label: "All 6 flagship courses in full",
    stars: 3
  }, {
    label: "Master injector credential",
    stars: 3
  }, {
    label: "Premium Master Injector listing",
    stars: 3
  }, {
    label: "In-person shadowing days",
    stars: 3
  }, {
    label: "Earn from your status",
    stars: 3
  }]
}, {
  group: "Business & Automation",
  rows: [{
    label: "Profinity Hub access",
    stars: 2
  }, {
    label: "ProfinityHub platform (CRM, funnels & automations)",
    stars: 2
  }, {
    label: "Full business e-learning track",
    stars: 2
  }, {
    label: "Live group coaching",
    stars: 2
  }, {
    label: "Close-access mentoring",
    stars: 2
  }]
}, {
  group: "Elite & Done-for-You",
  rows: [{
    label: "Done-for-you Growth Engine",
    stars: 1
  }, {
    label: "Ongoing business mentorship",
    stars: 1
  }, {
    label: "Profinity Conference ticket",
    stars: 1
  }, {
    label: "Annual Profinity Retreat",
    stars: 1
  }]
}, {
  group: "Billing",
  rows: [{
    label: "2 months free — annual billing",
    stars: 4
  }, {
    label: "Loyalty pricing for existing course owners",
    stars: 4
  }, {
    label: "Rate set by courses already owned — then frozen for life",
    stars: 4
  }]
}];
const OWNERSHIP_MT = [{
  label: "You own 5–6 of the 6",
  desc: "Upgrade cost today",
  price: "£0"
}, {
  label: "You own 2–4 of the 6",
  desc: "We'll credit what you already own",
  price: "£197"
}, {
  label: "You own 1 of the 6",
  desc: "Lowest door rate available",
  price: "£297"
}];
function StatChip({
  icon,
  value,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-stat-icon"
  }, /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    name: icon,
    size: 22,
    color: "var(--brand-gold-soft)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mt-stat-value"
  }, value), /*#__PURE__*/React.createElement("span", {
    className: "mt-stat-label"
  }, label));
}
function TierCard({
  tier,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-tier" + (tier.dark ? " dark" : "") + (tier.highlight ? " highlight" : "")
  }, tier.badge && /*#__PURE__*/React.createElement("span", {
    className: "mt-tier-badge"
  }, /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    name: "lucide:star",
    size: 13,
    color: "#fff"
  }), " ", tier.badge), /*#__PURE__*/React.createElement("div", {
    className: "mt-tier-head"
  }, tier.icon && /*#__PURE__*/React.createElement("span", {
    className: "mt-tier-icon"
  }, /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    name: "lucide:" + tier.icon,
    size: 20,
    color: "var(--brand-gold-soft)"
  })), /*#__PURE__*/React.createElement("h3", null, tier.name)), tier.tagline && /*#__PURE__*/React.createElement("p", {
    className: "mt-tier-tagline"
  }, tier.tagline), /*#__PURE__*/React.createElement("div", {
    className: "mt-tier-price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-tier-amount"
  }, "£", tier.price.toLocaleString()), /*#__PURE__*/React.createElement("span", {
    className: "mt-tier-period"
  }, "/monthly")), tier.yearly ? /*#__PURE__*/React.createElement("p", {
    className: "mt-tier-sub"
  }, "£", tier.yearly.toLocaleString(), " per year ", /*#__PURE__*/React.createElement("span", {
    className: "mt-tier-free"
  }, "2 MONTHS FREE")) : /*#__PURE__*/React.createElement("p", {
    className: "mt-tier-sub mt-tier-sub-muted"
  }, "Everything in ", tier.includesPrev, ", plus:"), tier.yearly && tier.includesPrev && /*#__PURE__*/React.createElement("p", {
    className: "mt-tier-sub mt-tier-sub-muted"
  }, "Everything in ", tier.includesPrev, ", plus:"), /*#__PURE__*/React.createElement("ul", {
    className: "mt-tier-features"
  }, tier.features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: tier.dark ? "var(--brand-gold-soft)" : "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", null, f)))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-tier-cta" + (tier.dark ? " on-dark" : ""),
    onClick: () => onSelect(tier)
  }, tier.cta, " ", /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 16,
    color: tier.dark ? "var(--brand-navy-900)" : "#fff"
  })));
}
function CompareStars({
  filled
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mt-compare-stars"
  }, [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    key: i,
    name: i <= filled ? "lucide:star" : "lucide:star",
    size: 13,
    color: i <= filled ? "var(--premium-orange)" : "var(--gray-200)"
  })));
}
function MembershipTier() {
  const onSelect = tier => goMT("SubscribeCheckout.html?tier=" + tier.key);
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-screen",
    "data-screen-label": "Membership Tier (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mt-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mt-back",
    "aria-label": "Back",
    onClick: () => goMT("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h1", null, "Membership Tier")), /*#__PURE__*/React.createElement("div", {
    className: "mt-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "mt-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-eyebrow"
  }, "Your path to your dream clinic"), /*#__PURE__*/React.createElement("h2", {
    className: "mt-hero-title"
  }, "From injector to ", /*#__PURE__*/React.createElement("span", null, "business owner.")), /*#__PURE__*/React.createElement("p", {
    className: "mt-hero-sub"
  }, "Profinity provides the roadmap, the credentials, and the systems to get you there — whether you're finding your feet or scaling to a sovereign clinic."), /*#__PURE__*/React.createElement("div", {
    className: "mt-hero-ctas"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn-fill",
    onClick: () => goMT("SubscribeCheckout.html")
  }, "Subscribe Now"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn-outline",
    onClick: () => goMT("SubscribeCheckout.html")
  }, "Subscribe Now")), /*#__PURE__*/React.createElement("div", {
    className: "mt-stats"
  }, /*#__PURE__*/React.createElement(StatChip, {
    icon: "lucide:trending-up",
    value: "4",
    label: "Growth tiers"
  }), /*#__PURE__*/React.createElement(StatChip, {
    icon: "lucide:book-open",
    value: "6",
    label: "Flagship courses"
  }), /*#__PURE__*/React.createElement(StatChip, {
    icon: "lucide:infinity",
    value: "∞",
    label: "Price freeze"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-trial-banner"
  }, /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    name: "lucide:sparkles",
    size: 16,
    color: "var(--brand-navy-900)"
  }), "Start your 2 months free trial"), /*#__PURE__*/React.createElement("section", {
    className: "mt-section"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-eyebrow dark"
  }, "Programme structure"), /*#__PURE__*/React.createElement("h2", {
    className: "mt-section-title"
  }, "Choose your growth tier"), /*#__PURE__*/React.createElement("p", {
    className: "mt-section-sub"
  }, "Each tier is a stage in your career journey. Join at the level that meets you where you are — and grow from there."), /*#__PURE__*/React.createElement(TierCard, {
    tier: TIERS_MT[0],
    onSelect: onSelect
  }), /*#__PURE__*/React.createElement(TierCard, {
    tier: TIERS_MT[1],
    onSelect: onSelect
  })), /*#__PURE__*/React.createElement("section", {
    className: "mt-freedom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-eyebrow gold"
  }, "The Freedom Path"), /*#__PURE__*/React.createElement("p", {
    className: "mt-freedom-sub"
  }, "For the injector ready to build a business — not just a skill set."), /*#__PURE__*/React.createElement(TierCard, {
    tier: TIERS_MT[2],
    onSelect: onSelect
  }), /*#__PURE__*/React.createElement(TierCard, {
    tier: TIERS_MT[3],
    onSelect: onSelect
  })), /*#__PURE__*/React.createElement("section", {
    className: "mt-section"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-eyebrow dark"
  }, "Feature breakdown"), /*#__PURE__*/React.createElement("h2", {
    className: "mt-section-title"
  }, "Compare all tiers"), /*#__PURE__*/React.createElement("div", {
    className: "mt-compare"
  }, COMPARE_MT.map(grp => /*#__PURE__*/React.createElement("div", {
    className: "mt-compare-group",
    key: grp.group
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-compare-group-h"
  }, grp.group), grp.rows.map(row => /*#__PURE__*/React.createElement("div", {
    className: "mt-compare-row",
    key: row.label
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-compare-label"
  }, row.label), /*#__PURE__*/React.createElement(CompareStars, {
    filled: row.stars
  }))))))), /*#__PURE__*/React.createElement("section", {
    className: "mt-owners"
  }, /*#__PURE__*/React.createElement("h2", null, "Already own our previous courses?"), /*#__PURE__*/React.createElement("p", null, "Your Mastery rate is set by how many flagship courses you already own — then frozen for life."), /*#__PURE__*/React.createElement("div", {
    className: "mt-owners-list"
  }, OWNERSHIP_MT.map(o => /*#__PURE__*/React.createElement("div", {
    className: "mt-owners-row",
    key: o.label
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mt-owners-label"
  }, o.label), /*#__PURE__*/React.createElement("div", {
    className: "mt-owners-desc"
  }, o.desc)), /*#__PURE__*/React.createElement("span", {
    className: "mt-owners-price"
  }, o.price))))), /*#__PURE__*/React.createElement("section", {
    className: "mt-footer"
  }, /*#__PURE__*/React.createElement("h2", null, "Your dream clinic starts here."), /*#__PURE__*/React.createElement("p", null, "Choose your tier, lock in your price, and begin."), /*#__PURE__*/React.createElement("div", {
    className: "mt-hero-ctas"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn-fill",
    onClick: () => goMT("SubscribeCheckout.html")
  }, "Subscribe Now"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mt-btn-outline",
    onClick: () => goMT("SubscribeCheckout.html")
  }, "Subscribe Now ", /*#__PURE__*/React.createElement(DSMT.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 14,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "mt-footer-note"
  }, "Subscriptions are managed through our web app."), /*#__PURE__*/React.createElement("div", {
    className: "mt-footer-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-footer-logo"
  }, "P"), " Profinity Design"), /*#__PURE__*/React.createElement("p", {
    className: "mt-footer-copy"
  }, "© 2026 Profinity Academy. All rights reserved."))));
}
function MembershipTierApp() {
  const mobile = useIsMobileMT();
  const scale = useDeviceScaleMT();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)",
    backgroundColor: "rgb(217, 218, 225)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(MembershipTier, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(MembershipTier, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MembershipTierApp, null));
