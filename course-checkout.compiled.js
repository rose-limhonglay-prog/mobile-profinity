/* ===========================================================================
   PROfinity — Course Checkout / Payment Summary (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -CC to avoid global-scope clashes.
   Reached from "Enroll" on LearningMobile.html or "Buy Now" on CourseDetail.html
   via ?course=<slug> or ?title=&instr=&grad=&price=.
   =========================================================================== */
const {
  useState: useStateCC,
  useEffect: useEffectCC
} = React;
const DSCC = window.ProfinityDesignSystem_c2b5cc;
function goCC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleCC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateCC(calc);
  useEffectCC(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileCC() {
  const [mobile, setMobile] = useStateCC(() => window.matchMedia('(max-width:768px)').matches);
  useEffectCC(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
const VAT_RATE_CC = 0.2;
const PF_PURCHASED_KEY_CC = "pf-purchased-courses";
function slugifyCC(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function getPurchasedCC() {
  try {
    return JSON.parse(localStorage.getItem(PF_PURCHASED_KEY_CC)) || [];
  } catch (e) {
    return [];
  }
}
function markPurchasedCC(slug) {
  try {
    const list = getPurchasedCC();
    if (!list.includes(slug)) localStorage.setItem(PF_PURCHASED_KEY_CC, JSON.stringify([...list, slug]));
  } catch (e) {}
}
function getCourseFromQueryCC() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "Course";
  const slug = params.get("course") || slugifyCC(title);
  return {
    slug,
    title,
    instr: params.get("instr") || "Dr. Tim Pearce",
    grad: params.get("grad") || "linear-gradient(140deg,#6172f3 0%,#3b82f6 100%)",
    price: Number(params.get("price") || 0),
    returnTo: params.get("returnTo") || ""
  };
}
function buildCourseDetailUrlCC(course) {
  const p = new URLSearchParams({
    title: course.title,
    instr: course.instr,
    grad: course.grad
  });
  return "CourseDetail.html?" + p.toString();
}
function CourseCheckout() {
  const [course] = useStateCC(getCourseFromQueryCC);
  const [promo, setPromo] = useStateCC("");
  const [paying, setPaying] = useStateCC(false);
  const vat = Math.round(course.price * VAT_RATE_CC);
  const total = course.price + vat;
  const detailUrl = course.returnTo || buildCourseDetailUrlCC(course);
  function handlePay() {
    setPaying(true);
    markPurchasedCC(course.slug);
    goCC(detailUrl);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-screen",
    "data-screen-label": "Course Checkout (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "cc-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cc-back",
    "aria-label": "Back",
    onClick: () => goCC(detailUrl)
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h1", null, "Payment Summary")), /*#__PURE__*/React.createElement("div", {
    className: "cc-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "cc-intro"
  }, /*#__PURE__*/React.createElement("h2", null, "Review & confirm"), /*#__PURE__*/React.createElement("p", null, "You're one step away from unlocking this course.")), /*#__PURE__*/React.createElement("div", {
    className: "cc-plan-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-plan-icon",
    style: {
      background: course.grad
    }
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:play-circle",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cc-plan-info"
  }, /*#__PURE__*/React.createElement("h3", null, course.title), /*#__PURE__*/React.createElement("p", null, "with ", course.instr))), /*#__PURE__*/React.createElement("section", {
    className: "cc-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Order summary"), /*#__PURE__*/React.createElement("div", {
    className: "cc-summary-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-summary-row"
  }, /*#__PURE__*/React.createElement("span", null, "Course price"), /*#__PURE__*/React.createElement("span", null, "£", course.price.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "cc-summary-row"
  }, /*#__PURE__*/React.createElement("span", null, "VAT (20%)"), /*#__PURE__*/React.createElement("span", null, "£", vat.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "cc-summary-row cc-summary-total"
  }, /*#__PURE__*/React.createElement("span", null, "Total due today"), /*#__PURE__*/React.createElement("span", null, "£", total.toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    className: "cc-promo-row"
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:tag",
    size: 15,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("input", {
    className: "cc-promo-input",
    type: "text",
    placeholder: "Add promo code",
    value: promo,
    onChange: e => setPromo(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cc-promo-apply"
  }, "Apply"))), /*#__PURE__*/React.createElement("section", {
    className: "cc-section"
  }, /*#__PURE__*/React.createElement("h4", null, "Payment method"), /*#__PURE__*/React.createElement("div", {
    className: "cc-payment-card selected"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cc-payment-icon"
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:credit-card",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cc-payment-info"
  }, /*#__PURE__*/React.createElement("h3", null, "Visa ending 4242"), /*#__PURE__*/React.createElement("p", null, "Expires 08/28")), /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cc-add-payment"
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:plus",
    size: 14,
    color: "var(--brand-navy)"
  }), " Add another payment method"), /*#__PURE__*/React.createElement("p", {
    className: "cc-lifetime-note"
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:info",
    size: 14,
    color: "var(--gray-400)"
  }), "One-time payment. Lifetime access to this course once paid."))), /*#__PURE__*/React.createElement("div", {
    className: "cc-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-footer-row"
  }, /*#__PURE__*/React.createElement("span", null, "Total due today"), /*#__PURE__*/React.createElement("span", null, "£", total.toLocaleString())), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cc-cta",
    disabled: paying,
    onClick: handlePay
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:lock",
    size: 15,
    color: "#fff"
  }), " ", paying ? "Processing…" : "Pay & Enroll"), /*#__PURE__*/React.createElement("p", {
    className: "cc-footer-secure"
  }, /*#__PURE__*/React.createElement(DSCC.IconifyIcon, {
    name: "lucide:shield-check",
    size: 13,
    color: "var(--gray-400)"
  }), "Secured by Stripe · 256-bit encryption")));
}
function CourseCheckoutApp() {
  const mobile = useIsMobileCC();
  const scale = useDeviceScaleCC();
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
    }, /*#__PURE__*/React.createElement(CourseCheckout, null));
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
  }, /*#__PURE__*/React.createElement(CourseCheckout, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CourseCheckoutApp, null));
