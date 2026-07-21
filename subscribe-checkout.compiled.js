/* ===========================================================================
   PROfinity — Subscribe Checkout / Payment Summary (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -SC to avoid global-scope clashes.
   Reached from "Subscribe Now" on MembershipTier.html via ?tier=<key>.
   =========================================================================== */
const {
  useState: useStateSC,
  useEffect: useEffectSC
} = React;
const DSSC = window.ProfinityDesignSystem_c2b5cc;
function goSC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
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
  confidence: {
    name: "Confidence",
    desc: "Full portal access",
    icon: "shield-check",
    monthly: 97,
    yearly: 970
  },
  mastery: {
    name: "Mastery",
    desc: "Full portal access",
    icon: "crown",
    monthly: 397,
    yearly: 3970
  }
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
  return /*#__PURE__*/React.createElement("div", {
    className: "sc-screen",
    "data-screen-label": "Subscribe Checkout (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sc-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sc-back",
    "aria-label": "Back",
    onClick: () => goSC("MembershipTier.html")
  }, /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h1", null, "Payment Summary")), /*#__PURE__*/React.createElement("div", {
    className: "sc-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "sc-intro"
  }, /*#__PURE__*/React.createElement("h2", null, "Review & confirm"), /*#__PURE__*/React.createElement("p", null, "You're one step away from unlocking your membership.")), /*#__PURE__*/React.createElement("div", {
    className: "sc-plan-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-plan-icon"
  }, /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:" + tier.icon,
    size: 22,
    color: "var(--brand-gold-soft)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sc-plan-info"
  }, /*#__PURE__*/React.createElement("h3", null, tier.name, " Membership"), /*#__PURE__*/React.createElement("p", null, tier.desc)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sc-change",
    onClick: () => goSC("MembershipTier.html")
  }, "Change")), /*#__PURE__*/React.createElement("section", {
    className: "sc-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Billing cycle"), /*#__PURE__*/React.createElement("div", {
    className: "sc-cycle-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sc-cycle" + (cycle === "monthly" ? " selected" : ""),
    onClick: () => setCycle("monthly")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-cycle-name"
  }, "Monthly"), /*#__PURE__*/React.createElement("span", {
    className: "sc-cycle-price"
  }, "£", tier.monthly.toLocaleString(), " / month")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sc-cycle" + (cycle === "yearly" ? " selected" : ""),
    onClick: () => setCycle("yearly")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-cycle-badge"
  }, "Best value"), /*#__PURE__*/React.createElement("span", {
    className: "sc-cycle-name"
  }, "Yearly"), /*#__PURE__*/React.createElement("span", {
    className: "sc-cycle-price"
  }, "£", tier.yearly.toLocaleString(), " / year")))), /*#__PURE__*/React.createElement("section", {
    className: "sc-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Order summary"), /*#__PURE__*/React.createElement("div", {
    className: "sc-summary-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-summary-row"
  }, /*#__PURE__*/React.createElement("span", null, tier.name, " · ", cycleLabel), /*#__PURE__*/React.createElement("span", null, "£", price.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "sc-summary-row"
  }, /*#__PURE__*/React.createElement("span", null, "30-day free trial"), /*#__PURE__*/React.createElement("span", {
    className: "sc-negative"
  }, "-£", price.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "sc-summary-row"
  }, /*#__PURE__*/React.createElement("span", null, "VAT (20%)"), /*#__PURE__*/React.createElement("span", null, "£", vat.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "sc-summary-row sc-summary-total"
  }, /*#__PURE__*/React.createElement("span", null, "Due today"), /*#__PURE__*/React.createElement("span", null, "£", dueToday.toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    className: "sc-promo-row"
  }, /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:tag",
    size: 15,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("input", {
    className: "sc-promo-input",
    type: "text",
    placeholder: "Add promo code",
    value: promo,
    onChange: e => setPromo(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sc-promo-apply"
  }, "Apply"))), /*#__PURE__*/React.createElement("section", {
    className: "sc-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Payment method"), /*#__PURE__*/React.createElement("div", {
    className: "sc-payment-card selected"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sc-payment-icon"
  }, /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:credit-card",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sc-payment-info"
  }, /*#__PURE__*/React.createElement("h3", null, "Visa ending 4242"), /*#__PURE__*/React.createElement("p", null, "Expires 08/28")), /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sc-add-payment"
  }, /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:plus",
    size: 14,
    color: "var(--brand-navy)"
  }), " Add another payment method"), /*#__PURE__*/React.createElement("p", {
    className: "sc-trial-note"
  }, /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:info",
    size: 14,
    color: "var(--gray-400)"
  }), "Your free trial starts today. You'll be charged £", price.toLocaleString(), " when it ends, unless you cancel."))), /*#__PURE__*/React.createElement("div", {
    className: "sc-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sc-footer-row"
  }, /*#__PURE__*/React.createElement("span", null, "Due today"), /*#__PURE__*/React.createElement("span", null, "£", dueToday.toLocaleString())), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sc-cta",
    onClick: () => goSC("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:lock",
    size: 15,
    color: "#fff"
  }), " Start free trial"), /*#__PURE__*/React.createElement("p", {
    className: "sc-footer-secure"
  }, /*#__PURE__*/React.createElement(DSSC.IconifyIcon, {
    name: "lucide:shield-check",
    size: 13,
    color: "var(--gray-400)"
  }), "Secured by Stripe · 256-bit encryption")));
}
function SubscribeCheckoutApp() {
  const mobile = useIsMobileSC();
  const scale = useDeviceScaleSC();
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
    }, /*#__PURE__*/React.createElement(SubscribeCheckout, null));
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
  }, /*#__PURE__*/React.createElement(SubscribeCheckout, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(SubscribeCheckoutApp, null));
