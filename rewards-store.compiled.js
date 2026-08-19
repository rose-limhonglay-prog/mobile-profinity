/* ===========================================================================
   PROfinity — Katy · Rewards Store (Screen 12) · iPhone 17 Pro Max
   Redemption sink for Spendable Credits: card grid with image, name,
   description, credit cost and Redeem button; locked/padlock state when the
   balance is insufficient. Redeeming deducts credits via window.PFLoyalty
   and routes to Redemption Success. Suffixed -STR.
   =========================================================================== */
const {
  useState: useStateSTR,
  useMemo: useMemoSTR
} = React;
const DSSTR = window.ProfinityDesignSystem_c2b5cc;
const PF_STR = window.PFLoyalty;
function goSTR(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function StoreConfirm({
  item,
  onCancel,
  onConfirm
}) {
  if (!item) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-scrim",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-confirm",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-confirm-icon"
  }, /*#__PURE__*/React.createElement(DSSTR.IconifyIcon, {
    name: "lucide:gift",
    size: 26,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h2", null, "Redeem ", item.name, "?"), /*#__PURE__*/React.createElement("p", null, PF_STR.formatNumber(item.cost), " Spendable Credits will be deducted from your balance."), /*#__PURE__*/React.createElement("div", {
    className: "str-confirm-ctas"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-ghost",
    type: "button",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-gold",
    type: "button",
    onClick: onConfirm
  }, "Confirm Redeem"))));
}
function StoreCard({
  item,
  credits,
  onRedeem
}) {
  const locked = credits < item.cost || item.inventory != null && item.inventory <= 0;
  const outOfStock = item.inventory != null && item.inventory <= 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "str-card" + (locked ? " is-locked" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-card-media"
  }, item.image ? /*#__PURE__*/React.createElement("img", {
    src: item.image,
    alt: ""
  }) : /*#__PURE__*/React.createElement(DSSTR.IconifyIcon, {
    name: "lucide:sparkles",
    size: 30,
    color: "var(--brand-gold)"
  }), locked && /*#__PURE__*/React.createElement("span", {
    className: "str-lock-badge"
  }, /*#__PURE__*/React.createElement(DSSTR.IconifyIcon, {
    name: "lucide:lock",
    size: 14,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "str-card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-card-name"
  }, item.name), /*#__PURE__*/React.createElement("div", {
    className: "str-card-desc"
  }, item.description), /*#__PURE__*/React.createElement("div", {
    className: "str-card-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "str-card-cost"
  }, /*#__PURE__*/React.createElement(DSSTR.IconifyIcon, {
    name: "lucide:wallet",
    size: 13,
    color: "var(--brand-navy)"
  }), PF_STR.formatNumber(item.cost)), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-sm ml-btn-navy",
    type: "button",
    disabled: locked,
    onClick: () => onRedeem(item)
  }, outOfStock ? "Sold Out" : "Redeem"))));
}
function RewardsStoreScreen() {
  const [config, setConfig] = useStateSTR(() => PF_STR.getConfig());
  const [state, setState] = useStateSTR(() => PF_STR.getState());
  const [category, setCategory] = useStateSTR("All");
  const [confirmItem, setConfirmItem] = useStateSTR(null);
  const [toast, setToast] = useStateSTR(null);
  const categories = useMemoSTR(() => ["All"].concat(Array.from(new Set(config.storeItems.map(i => i.category)))), [config]);
  const items = useMemoSTR(() => category === "All" ? config.storeItems : config.storeItems.filter(i => i.category === category), [config, category]);
  const confirmRedeem = () => {
    const res = PF_STR.redeemItem(confirmItem.id);
    setConfirmItem(null);
    if (!res.ok) {
      setToast(res.reason);
      setTimeout(() => setToast(null), 2600);
      return;
    }
    goSTR("RedemptionSuccess.html");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen str-screen",
    "data-screen-label": "Rewards Store"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goSTR("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(DSSTR.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Rewards Store"), /*#__PURE__*/React.createElement("span", {
    className: "str-balance-chip"
  }, /*#__PURE__*/React.createElement(DSSTR.IconifyIcon, {
    name: "lucide:wallet",
    size: 13,
    color: "#fff"
  }), PF_STR.formatNumber(state.spendableCredits))), /*#__PURE__*/React.createElement("div", {
    className: "str-tabs"
  }, categories.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    type: "button",
    className: "str-tab" + (c === category ? " is-active" : ""),
    onClick: () => setCategory(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "str-grid"
  }, items.map(it => /*#__PURE__*/React.createElement(StoreCard, {
    key: it.id,
    item: it,
    credits: state.spendableCredits,
    onRedeem: setConfirmItem
  })))), /*#__PURE__*/React.createElement(StoreConfirm, {
    item: confirmItem,
    onCancel: () => setConfirmItem(null),
    onConfirm: confirmRedeem
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "ml-toast"
  }, /*#__PURE__*/React.createElement(DSSTR.IconifyIcon, {
    name: "lucide:alert-triangle",
    size: 16,
    color: "#fff"
  }), toast));
}
function useDeviceScaleSTR() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSTR(calc);
  React.useEffect(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileSTR() {
  const [mobile, setMobile] = useStateSTR(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function RewardsStoreApp() {
  const mobile = useIsMobileSTR();
  const scale = useDeviceScaleSTR();
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
  }, /*#__PURE__*/React.createElement(RewardsStoreScreen, null));
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
  }, /*#__PURE__*/React.createElement(RewardsStoreScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(RewardsStoreApp, null));
