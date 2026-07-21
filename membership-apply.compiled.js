/* ===========================================================================
   PROfinity — Membership Application (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -MA to avoid global-scope clashes.
   Reached from "Apply Now" on MembershipTier.html via ?tier=<key>.
   =========================================================================== */
const {
  useState: useStateMA,
  useEffect: useEffectMA
} = React;
const DSMA = window.ProfinityDesignSystem_c2b5cc;
function goMA(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
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
const TIERS_MA = [{
  key: "sovereign",
  name: "Sovereign Pathway",
  desc: "Done-for-you engine & scaling",
  price: 2417
}, {
  key: "builder",
  name: "Builder Pathway",
  desc: "Hub CRM & business group coaching",
  price: 1500
}];
function getTierFromQueryMA() {
  const key = new URLSearchParams(window.location.search).get("tier");
  return TIERS_MA.some(t => t.key === key) ? key : "builder";
}
function MembershipApply() {
  const [tierKey, setTierKey] = useStateMA(getTierFromQueryMA);
  const [fullName, setFullName] = useStateMA("");
  const [email, setEmail] = useStateMA("");
  const [phone, setPhone] = useStateMA("");
  const [message, setMessage] = useStateMA("");
  const [submitted, setSubmitted] = useStateMA(false);
  const selectedTier = TIERS_MA.find(t => t.key === tierKey);
  const canSubmit = fullName.trim() && email.trim() && phone.trim();
  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };
  if (submitted) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ma-screen",
      "data-screen-label": "Membership Application (mobile)"
    }, /*#__PURE__*/React.createElement("header", {
      className: "ma-top"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ma-back",
      "aria-label": "Back",
      onClick: () => goMA("MembershipTier.html")
    }, /*#__PURE__*/React.createElement(DSMA.IconifyIcon, {
      name: "lucide:chevron-left",
      size: 22,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("h1", null, "Membership Tier")), /*#__PURE__*/React.createElement("div", {
      className: "ma-scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ma-confirm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ma-confirm-icon"
    }, /*#__PURE__*/React.createElement(DSMA.IconifyIcon, {
      name: "lucide:check",
      size: 30,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("h2", null, "Application received"), /*#__PURE__*/React.createElement("p", null, "Thanks for applying. Your interest in the ", /*#__PURE__*/React.createElement("strong", null, selectedTier.name), " has been logged. Our admissions team will reach out within 24 hours to help you finalise your application."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "ma-confirm-cta",
      onClick: () => goMA("MembershipTier.html")
    }, "Back to Membership Tier"))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ma-screen",
    "data-screen-label": "Membership Application (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ma-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ma-back",
    "aria-label": "Back",
    onClick: () => goMA("MembershipTier.html")
  }, /*#__PURE__*/React.createElement(DSMA.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h1", null, "Membership Tier")), /*#__PURE__*/React.createElement("div", {
    className: "ma-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "ma-intro"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-eyebrow"
  }, "Express your interest"), /*#__PURE__*/React.createElement("h2", {
    className: "ma-intro-title"
  }, "Your path to ownership starts here"), /*#__PURE__*/React.createElement("p", {
    className: "ma-intro-sub"
  }, "Complete this brief application form to secure your initial consultation and express interest in the exclusive Freedom Path.")), /*#__PURE__*/React.createElement("div", {
    className: "ma-card"
  }, /*#__PURE__*/React.createElement("label", {
    className: "ma-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-label"
  }, "Full name"), /*#__PURE__*/React.createElement("input", {
    className: "ma-input",
    type: "text",
    placeholder: "e.g. Dr. Jane Doe",
    value: fullName,
    onChange: e => setFullName(e.target.value)
  })), /*#__PURE__*/React.createElement("label", {
    className: "ma-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-label"
  }, "Email address"), /*#__PURE__*/React.createElement("input", {
    className: "ma-input",
    type: "email",
    placeholder: "e.g. jane@clinic.com",
    value: email,
    onChange: e => setEmail(e.target.value)
  })), /*#__PURE__*/React.createElement("label", {
    className: "ma-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-label"
  }, "Phone number"), /*#__PURE__*/React.createElement("input", {
    className: "ma-input",
    type: "tel",
    placeholder: "e.g. +44 7123 456789",
    value: phone,
    onChange: e => setPhone(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "ma-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-label"
  }, "Select tier of interest"), /*#__PURE__*/React.createElement("div", {
    className: "ma-tier-options"
  }, TIERS_MA.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t.key,
    className: "ma-tier-opt" + (tierKey === t.key ? " selected" : ""),
    onClick: () => setTierKey(t.key)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-tier-radio"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ma-tier-opt-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-tier-opt-name"
  }, t.name), /*#__PURE__*/React.createElement("span", {
    className: "ma-tier-opt-desc"
  }, t.desc)), /*#__PURE__*/React.createElement("span", {
    className: "ma-tier-opt-price"
  }, "£", t.price.toLocaleString()))))), /*#__PURE__*/React.createElement("label", {
    className: "ma-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-label"
  }, "Message & notes (optional)"), /*#__PURE__*/React.createElement("textarea", {
    className: "ma-textarea",
    rows: 4,
    placeholder: "Any specific questions or details about your clinic goals...",
    value: message,
    onChange: e => setMessage(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ma-submit",
    disabled: !canSubmit,
    onClick: handleSubmit
  }, "Submit")), /*#__PURE__*/React.createElement("p", {
    className: "ma-notice"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ma-notice-dot"
  }), "Our admissions team will reach out within 24 hours to help you finalise your application.")));
}
function MembershipApplyApp() {
  const mobile = useIsMobileMA();
  const scale = useDeviceScaleMA();
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
    }, /*#__PURE__*/React.createElement(MembershipApply, null));
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
  }, /*#__PURE__*/React.createElement(MembershipApply, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MembershipApplyApp, null));
