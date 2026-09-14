/* ===========================================================================
   PROfinity — Katy · My Rewards · iPhone 17 Pro Max
   Every reward Katy has redeemed in the Rewards Store, newest first: course
   thumbnail, discount, voucher code with one-tap copy, redeemed date and a
   Ready / Used status (Used once the course shows up in pf-purchased-courses).
   Tapping a row opens a detail sheet with the full code, copy, and "Use it
   now" into CourseCheckout. Reads window.PFLoyalty state. Suffixed -MR.
   =========================================================================== */
const {
  useState: useStateMR,
  useMemo: useMemoMR
} = React;
const DSMR = window.ProfinityDesignSystem_c2b5cc;
const PF_MR = window.PFLoyalty;
function goMR(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function poundsMR(n) {
  return "£" + Math.round(n).toLocaleString("en-GB");
}
function purchasedMR() {
  try {
    return JSON.parse(localStorage.getItem("pf-purchased-courses")) || [];
  } catch (e) {
    return [];
  }
}
function whenMR(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) + " · " + d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* join the voucher with its store item (thumbnail, delivery) and course */
function enrichMR(voucher, items, purchased) {
  const item = items.find(i => i.id === voucher.itemId) || null;
  const course = voucher.course || item && item.course || null;
  const saving = course ? Math.round(course.price * course.discountPct / 100) : 0;
  const used = !!(course && purchased.includes(course.slug));
  return {
    voucher,
    item,
    course,
    saving,
    used,
    image: item && item.image ? item.image : null,
    title: course ? course.title : voucher.itemName,
    checkoutUrl: course ? "CourseCheckout.html?course=" + encodeURIComponent(course.slug) + "&title=" + encodeURIComponent(course.title) + "&price=" + course.price : null
  };
}
function useCopyMR() {
  const [copiedCode, setCopied] = useStateMR(null);
  const copy = code => {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1600);
  };
  return [copiedCode, copy];
}
function RewardRow({
  r,
  copiedCode,
  onCopy,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mr-row" + (r.used ? " used" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mr-row-main",
    onClick: () => onOpen(r),
    "aria-label": "Details for " + r.title
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-thumb"
  }, r.image ? /*#__PURE__*/React.createElement("img", {
    src: r.image,
    alt: ""
  }) : /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: "lucide:gift",
    size: 20,
    color: "var(--brand-navy)"
  }), r.course && /*#__PURE__*/React.createElement("span", {
    className: "mr-off"
  }, r.course.discountPct, "% OFF")), /*#__PURE__*/React.createElement("span", {
    className: "mr-tx"
  }, /*#__PURE__*/React.createElement("b", null, r.title), /*#__PURE__*/React.createElement("i", null, r.course ? "Save " + poundsMR(r.saving) + " · " + poundsMR(r.course.price - r.saving) + " instead of " + poundsMR(r.course.price) : r.voucher.itemName), /*#__PURE__*/React.createElement("span", {
    className: "mr-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-status " + (r.used ? "used" : "ready")
  }, r.used ? "Used" : "Ready to use"), whenMR(r.voucher.redeemedAt))), /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mr-code-row"
  }, /*#__PURE__*/React.createElement("code", {
    className: "mr-code"
  }, r.voucher.code), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mr-copy",
    onClick: () => onCopy(r.voucher.code),
    "aria-label": "Copy code " + r.voucher.code
  }, /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: copiedCode === r.voucher.code ? "lucide:check" : "lucide:copy",
    size: 14,
    color: "var(--brand-navy)"
  }), copiedCode === r.voucher.code ? "Copied" : "Copy")));
}
function RewardSheet({
  r,
  copiedCode,
  onCopy,
  onClose
}) {
  if (!r) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "mr-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "mr-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "mr-sheet-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-sheet-handle"
  }), r.image && /*#__PURE__*/React.createElement("div", {
    className: "mr-sheet-media"
  }, /*#__PURE__*/React.createElement("img", {
    src: r.image,
    alt: ""
  }), r.course && /*#__PURE__*/React.createElement("span", {
    className: "mr-off lg"
  }, r.course.discountPct, "% OFF")), /*#__PURE__*/React.createElement("h2", {
    id: "mr-sheet-title"
  }, r.title), r.course && /*#__PURE__*/React.createElement("p", {
    className: "mr-sheet-price"
  }, /*#__PURE__*/React.createElement("s", null, poundsMR(r.course.price)), " ", poundsMR(r.course.price - r.saving), " ", /*#__PURE__*/React.createElement("em", null, "save ", poundsMR(r.saving))), /*#__PURE__*/React.createElement("span", {
    className: "mr-sheet-label"
  }, "Voucher code"), /*#__PURE__*/React.createElement("div", {
    className: "mr-sheet-code"
  }, r.voucher.code), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mr-chip",
    onClick: () => onCopy(r.voucher.code)
  }, /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: copiedCode === r.voucher.code ? "lucide:check" : "lucide:copy",
    size: 14,
    color: "var(--brand-navy)"
  }), copiedCode === r.voucher.code ? "Copied" : "Copy code"), /*#__PURE__*/React.createElement("ul", {
    className: "mr-sheet-facts"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: "lucide:badge-percent",
    size: 16,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, r.item && r.item.delivery ? r.item.delivery : "Applied automatically at checkout")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: "lucide:clock",
    size: 16,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Redeemed ", whenMR(r.voucher.redeemedAt))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: r.used ? "lucide:check-circle-2" : "lucide:sparkles",
    size: 16,
    color: r.used ? "var(--success)" : "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, r.used ? "Used — this course is in your library" : "Ready to use at checkout"))), /*#__PURE__*/React.createElement("div", {
    className: "mr-sheet-ctas"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-btn ml-btn-ghost mr-btn",
    type: "button",
    onClick: onClose
  }, "Close"), r.checkoutUrl && !r.used && /*#__PURE__*/React.createElement("button", {
    className: "ml-btn mr-btn mr-btn-primary",
    type: "button",
    onClick: () => goMR(r.checkoutUrl)
  }, "Use it now"), r.checkoutUrl && r.used && /*#__PURE__*/React.createElement("button", {
    className: "ml-btn mr-btn mr-btn-primary",
    type: "button",
    onClick: () => goMR("LearningMobile.html")
  }, "Open course"))));
}
function MyRewardsScreen() {
  const [state] = useStateMR(() => PF_MR.getState());
  const [config] = useStateMR(() => PF_MR.getConfig());
  const [open, setOpen] = useStateMR(null);
  const [copiedCode, copy] = useCopyMR();
  const rows = useMemoMR(() => {
    const purchased = purchasedMR();
    return state.redeemedVouchers.slice().reverse().map(v => enrichMR(v, config.storeItems, purchased));
  }, [state, config]);
  const ready = rows.filter(r => !r.used).length;
  const savedTotal = rows.reduce((s, r) => s + r.saving, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen mr-screen",
    "data-screen-label": "My Rewards"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goMR("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "My Rewards"), /*#__PURE__*/React.createElement("button", {
    className: "ml-top-action",
    "aria-label": "Rewards Store",
    onClick: () => goMR("RewardsStore.html")
  }, /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: "lucide:shopping-bag",
    size: 18,
    color: "var(--gray-900)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll mr-scroll"
  }, rows.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mr-summary"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, rows.length), /*#__PURE__*/React.createElement("span", null, "redeemed")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, ready), /*#__PURE__*/React.createElement("span", null, "ready to use")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, poundsMR(savedTotal)), /*#__PURE__*/React.createElement("span", null, "saved"))), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "mr-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-empty-ic"
  }, /*#__PURE__*/React.createElement(DSMR.IconifyIcon, {
    name: "lucide:ticket",
    size: 30,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h2", null, "No rewards yet"), /*#__PURE__*/React.createElement("p", null, "Redeem your Spendable Credits for course discounts and they'll show up here with their codes."), /*#__PURE__*/React.createElement("button", {
    className: "ml-btn mr-btn mr-btn-primary",
    type: "button",
    style: {
      width: "auto"
    },
    onClick: () => goMR("RewardsStore.html")
  }, "Browse the Rewards Store")) : /*#__PURE__*/React.createElement("div", {
    className: "mr-list"
  }, rows.map(r => /*#__PURE__*/React.createElement(RewardRow, {
    key: r.voucher.code,
    r: r,
    copiedCode: copiedCode,
    onCopy: copy,
    onOpen: setOpen
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), /*#__PURE__*/React.createElement(RewardSheet, {
    r: open,
    copiedCode: copiedCode,
    onCopy: copy,
    onClose: () => setOpen(null)
  }));
}
function useDeviceScaleMR() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateMR(calc);
  React.useEffect(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileMR() {
  const [mobile, setMobile] = useStateMR(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function MyRewardsApp() {
  const mobile = useIsMobileMR();
  const scale = useDeviceScaleMR();
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
  }, /*#__PURE__*/React.createElement(MyRewardsScreen, null));
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
  }, /*#__PURE__*/React.createElement(MyRewardsScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MyRewardsApp, null));
