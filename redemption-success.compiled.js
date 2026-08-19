/* ===========================================================================
   PROfinity — Katy · Redemption Success (Screen 14) · iPhone 17 Pro Max
   Confirmation after a Rewards Store redemption: voucher code, next
   instructions based on the item's delivery method, print/email tools.
   Reads the most recent voucher from window.PFLoyalty state. Suffixed -RSC.
   =========================================================================== */
const {
  useState: useStateRSC
} = React;
const DSRSC = window.ProfinityDesignSystem_c2b5cc;
const PF_RSC = window.PFLoyalty;
function goRSC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function RedemptionSuccessScreen() {
  const [state] = useStateRSC(() => PF_RSC.getState());
  const [copied, setCopied] = useStateRSC(false);
  const voucher = state.redeemedVouchers[state.redeemedVouchers.length - 1];
  const copyCode = () => {
    if (!voucher) return;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  if (!voucher) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ml-screen rsc-screen",
      "data-screen-label": "Redemption Success (empty)"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ml-top"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ml-back",
      "aria-label": "Back",
      onClick: () => goRSC("RewardsStore.html")
    }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
      name: "lucide:chevron-left",
      size: 24,
      color: "var(--gray-900)"
    })), /*#__PURE__*/React.createElement("h1", null, "Redemption"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
      className: "ml-empty"
    }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
      name: "lucide:gift",
      size: 28,
      color: "var(--gray-400)"
    }), /*#__PURE__*/React.createElement("p", null, "No redemption yet — visit the Rewards Store to redeem your first item."), /*#__PURE__*/React.createElement("button", {
      className: "ml-btn ml-btn-navy ml-btn-sm",
      type: "button",
      onClick: () => goRSC("RewardsStore.html")
    }, "Go to Rewards Store")));
  }
  const item = PF_RSC.getConfig().storeItems.find(i => i.id === voucher.itemId);
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen rsc-screen",
    "data-screen-label": "Redemption Success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rsc-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rsc-check"
  }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
    name: "lucide:check",
    size: 30,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h1", null, "Reward Claimed!"), /*#__PURE__*/React.createElement("p", null, voucher.itemName)), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-card rsc-code-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rsc-code-label"
  }, "Your Voucher Code"), /*#__PURE__*/React.createElement("div", {
    className: "rsc-code"
  }, voucher.code), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-ghost ml-btn-sm",
    type: "button",
    onClick: copyCode
  }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
    name: copied ? "lucide:check" : "lucide:copy",
    size: 14,
    color: "var(--gray-700)"
  }), copied ? "Copied" : "Copy Code")), /*#__PURE__*/React.createElement("div", {
    className: "ml-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, "What happens next")), /*#__PURE__*/React.createElement("div", {
    className: "ml-card rsc-next-row"
  }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
    name: "lucide:truck",
    size: 18,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Delivery method: ", item ? item.delivery : "Email code")), /*#__PURE__*/React.createElement("div", {
    className: "ml-card rsc-next-row"
  }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
    name: "lucide:mail",
    size: 18,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "A confirmation has been sent to ", state.user.email)), /*#__PURE__*/React.createElement("div", {
    className: "ml-card rsc-next-row"
  }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
    name: "lucide:clock",
    size: 18,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Redeemed ", new Date(voucher.redeemedAt).toLocaleString("en-GB"))), /*#__PURE__*/React.createElement("div", {
    className: "rsc-tool-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-ghost",
    type: "button",
    onClick: () => window.print && window.print()
  }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
    name: "lucide:printer",
    size: 16,
    color: "var(--gray-700)"
  }), "Print"), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-ghost",
    type: "button",
    onClick: copyCode
  }, /*#__PURE__*/React.createElement(DSRSC.IconifyIcon, {
    name: "lucide:send",
    size: 16,
    color: "var(--gray-700)"
  }), "Email Me")), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-navy",
    type: "button",
    style: {
      marginTop: 14
    },
    onClick: () => goRSC("RewardsDashboard.html")
  }, "Back to Dashboard")));
}
function useDeviceScaleRSC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRSC(calc);
  React.useEffect(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileRSC() {
  const [mobile, setMobile] = useStateRSC(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function RedemptionSuccessApp() {
  const mobile = useIsMobileRSC();
  const scale = useDeviceScaleRSC();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(RedemptionSuccessScreen, null));
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(RedemptionSuccessScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(RedemptionSuccessApp, null));
