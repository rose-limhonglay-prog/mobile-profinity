/* ===========================================================================
   PROfinity — Payments (mobile) · iPhone 17 Pro Max
   Standalone drill-in reached from the sidebar drawer ("My Profile →
   Payments") and Account Settings. Holds the subscription (manage / cancel /
   renew), saved payment methods (add / set default / remove) and the five
   most recent invoices; "View all invoices" opens InvoicesMobile.html.
   Data + persistence live in payments-data.js (window.PFPayments).
   Composed on the bound DS bundle. Suffixed -PY to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStatePY,
  useEffect: useEffectPY,
  useRef: useRefPY
} = React;
const DSPY = window.ProfinityDesignSystem_c2b5cc;
const PFP = window.PFPayments;
function goPY(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScalePY() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStatePY(calc);
  useEffectPY(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobilePY() {
  const [mobile, setMobile] = useStatePY(() => window.matchMedia('(max-width:768px)').matches);
  useEffectPY(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

/* Plan-card metal per tier — Confidence = silver, Mastery = gold (dark text and
   the navy/gold PROfinity logo on light metal; the logo knocks to white on the
   dark tiers); Freedom / Inner Circle keep their app accents. CSS in
   payments-mobile.css. */
const PY_TIER_CLASS = {
  Confidence: "confidence",
  Mastery: "mastery",
  Freedom: "freedom",
  "Inner Circle": "inner"
};
const fmtPY = PFP.fmt;

/* ---- small shared bits ------------------------------------------------- */
function PYSheet({
  open,
  onClose,
  title,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "py-sheet-wrap",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "py-sheet"
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-sheet-handle"
  }), title && /*#__PURE__*/React.createElement("h3", {
    className: "py-sheet-ttl"
  }, title), children));
}
function usePYToast() {
  const [toast, setToast] = useStatePY(null);
  const timer = useRefPY(null);
  function show(msg) {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }
  useEffectPY(() => () => clearTimeout(timer.current), []);
  return [toast, show];
}

/* ---- add-card sheet ---------------------------------------------------- */
function formatCardNumberPY(v) {
  const d = v.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiryPY(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}
function expiryValidPY(exp) {
  const m = /^(\d{2})\/(\d{2})$/.exec(exp);
  if (!m) return false;
  const mm = +m[1],
    yy = 2000 + +m[2];
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  return yy > now.getFullYear() || yy === now.getFullYear() && mm >= now.getMonth() + 1;
}
function PYAddCardSheet({
  open,
  onClose,
  onSave,
  hasCards
}) {
  const [number, setNumber] = useStatePY("");
  const [exp, setExp] = useStatePY("");
  const [cvc, setCvc] = useStatePY("");
  const [name, setName] = useStatePY("");
  const [makeDefault, setMakeDefault] = useStatePY(!hasCards);
  const [touched, setTouched] = useStatePY(false);
  useEffectPY(() => {
    if (open) {
      setNumber("");
      setExp("");
      setCvc("");
      setName("");
      setMakeDefault(!hasCards);
      setTouched(false);
    }
  }, [open]);
  const digits = number.replace(/\D/g, "");
  const brand = PFP.brandFor(digits);
  const errs = {
    number: digits.length < 15 ? "Enter a valid card number" : "",
    exp: expiryValidPY(exp) ? "" : "Enter a valid expiry",
    cvc: cvc.length < 3 ? "Enter the CVC" : "",
    name: name.trim().length < 2 ? "Enter the name on the card" : ""
  };
  const valid = !errs.number && !errs.exp && !errs.cvc && !errs.name;
  function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSave({
      id: "card-" + Date.now(),
      brand,
      last4: digits.slice(-4),
      exp,
      name: name.trim(),
      primary: makeDefault
    });
  }
  return /*#__PURE__*/React.createElement(PYSheet, {
    open: open,
    onClose: onClose,
    title: "Add payment method"
  }, /*#__PURE__*/React.createElement("form", {
    className: "py-form",
    onSubmit: submit,
    noValidate: true
  }, /*#__PURE__*/React.createElement("label", {
    className: "py-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-label"
  }, "Card number"), /*#__PURE__*/React.createElement("span", {
    className: "py-input-wrap"
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:credit-card",
    size: 18,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("input", {
    className: "py-input",
    inputMode: "numeric",
    autoComplete: "cc-number",
    placeholder: "1234 5678 9012 3456",
    value: number,
    onChange: e => setNumber(formatCardNumberPY(e.target.value))
  }), digits.length >= 1 && /*#__PURE__*/React.createElement("span", {
    className: "py-brand"
  }, brand)), touched && errs.number && /*#__PURE__*/React.createElement("span", {
    className: "py-err"
  }, errs.number)), /*#__PURE__*/React.createElement("div", {
    className: "py-field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "py-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-label"
  }, "Expiry"), /*#__PURE__*/React.createElement("span", {
    className: "py-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    className: "py-input",
    inputMode: "numeric",
    autoComplete: "cc-exp",
    placeholder: "MM/YY",
    value: exp,
    onChange: e => setExp(formatExpiryPY(e.target.value))
  })), touched && errs.exp && /*#__PURE__*/React.createElement("span", {
    className: "py-err"
  }, errs.exp)), /*#__PURE__*/React.createElement("label", {
    className: "py-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-label"
  }, "CVC"), /*#__PURE__*/React.createElement("span", {
    className: "py-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    className: "py-input",
    inputMode: "numeric",
    autoComplete: "cc-csc",
    placeholder: "123",
    maxLength: 4,
    value: cvc,
    onChange: e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
  }), /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:lock",
    size: 16,
    color: "var(--gray-450)"
  })), touched && errs.cvc && /*#__PURE__*/React.createElement("span", {
    className: "py-err"
  }, errs.cvc))), /*#__PURE__*/React.createElement("label", {
    className: "py-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-label"
  }, "Name on card"), /*#__PURE__*/React.createElement("span", {
    className: "py-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    className: "py-input",
    autoComplete: "cc-name",
    placeholder: "Katy Wilson",
    value: name,
    onChange: e => setName(e.target.value)
  })), touched && errs.name && /*#__PURE__*/React.createElement("span", {
    className: "py-err"
  }, errs.name)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-check" + (makeDefault ? " on" : ""),
    onClick: () => setMakeDefault(!makeDefault),
    role: "checkbox",
    "aria-checked": makeDefault
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-check-box"
  }, makeDefault && /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:check",
    size: 14,
    color: "#fff"
  })), "Use as default payment method"), /*#__PURE__*/React.createElement("p", {
    className: "py-secure"
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:lock",
    size: 13,
    color: "var(--gray-500)"
  }), "Card details are encrypted and stored securely."), /*#__PURE__*/React.createElement("div", {
    className: "py-sheet-foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-btn-ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "py-btn-fill" + (valid ? "" : " dim")
  }, "Save card"))));
}

/* ---- card options sheet ------------------------------------------------ */
function PYCardOptionsSheet({
  card,
  onClose,
  onDefault,
  onRemove
}) {
  if (!card) return null;
  return /*#__PURE__*/React.createElement(PYSheet, {
    open: true,
    onClose: onClose,
    title: card.brand + " ending " + card.last4
  }, /*#__PURE__*/React.createElement("p", {
    className: "py-sheet-p"
  }, "Expires ", card.exp, card.name ? " · " + card.name : ""), /*#__PURE__*/React.createElement("div", {
    className: "py-opts"
  }, !card.primary && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-opt",
    onClick: onDefault
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:star",
    size: 20,
    color: "var(--brand-navy)"
  }), "Set as default"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-opt danger" + (card.primary ? " dim" : ""),
    onClick: onRemove,
    disabled: card.primary
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:trash-2",
    size: 20,
    color: card.primary ? "var(--gray-450)" : "var(--error)"
  }), card.primary ? "Default card can't be removed" : "Remove card")), /*#__PURE__*/React.createElement("div", {
    className: "py-sheet-foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-btn-ghost",
    onClick: onClose
  }, "Close")));
}

/* ---- subscription: manage / cancel / renew ----------------------------- */
function PYManageSheet({
  open,
  onClose,
  tier,
  price,
  sub,
  onCancel,
  onRenew
}) {
  const cancelled = sub.status === "cancelled";
  return /*#__PURE__*/React.createElement(PYSheet, {
    open: open,
    onClose: onClose,
    title: "Manage subscription"
  }, /*#__PURE__*/React.createElement("p", {
    className: "py-sheet-p"
  }, /*#__PURE__*/React.createElement("b", null, tier, " Path"), " · ", fmtPY(price), " / month.", " ", cancelled ? "Cancelled — your access ends on " + PFP.RENEWAL.long + "." : "Renews automatically on " + PFP.RENEWAL.long + "."), /*#__PURE__*/React.createElement("div", {
    className: "py-opts"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-opt",
    onClick: () => goPY("MembershipTier.html")
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:gem",
    size: 20,
    color: "var(--brand-navy)"
  }), "Change plan"), cancelled ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-opt",
    onClick: onRenew
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:rotate-ccw",
    size: 20,
    color: "var(--success)"
  }), "Renew subscription") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-opt danger",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:x-circle",
    size: 20,
    color: "var(--error)"
  }), "Cancel subscription")), /*#__PURE__*/React.createElement("div", {
    className: "py-sheet-foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-btn-ghost",
    onClick: onClose
  }, "Close")));
}
function PYCancelConfirmSheet({
  open,
  onClose,
  tier,
  onConfirm
}) {
  return /*#__PURE__*/React.createElement(PYSheet, {
    open: open,
    onClose: onClose,
    title: "Cancel subscription?"
  }, /*#__PURE__*/React.createElement("p", {
    className: "py-sheet-p"
  }, "You'll keep full ", /*#__PURE__*/React.createElement("b", null, tier, " Path"), " access until ", /*#__PURE__*/React.createElement("b", null, PFP.RENEWAL.long), ". After that your channels, courses and community perks lock, and you won't be charged again. You can renew any time before then and nothing changes."), /*#__PURE__*/React.createElement("ul", {
    className: "py-lose"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:x",
    size: 16,
    color: "var(--error)"
  }), tier, " channel & community feed"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:x",
    size: 16,
    color: "var(--error)"
  }), "Included courses & live sessions"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:x",
    size: 16,
    color: "var(--error)"
  }), "Member points & rewards progress")), /*#__PURE__*/React.createElement("div", {
    className: "py-sheet-foot col"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-btn-fill",
    onClick: onClose
  }, "Keep my subscription"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-btn-danger",
    onClick: onConfirm
  }, "Cancel subscription")));
}

/* ---- screen ------------------------------------------------------------ */
function PaymentsScreen() {
  const tier = PFP.getTier();
  const price = tier ? PFP.PRICE[tier] : null;
  const [methods, setMethods] = useStatePY(() => PFP.getMethods());
  const [sub, setSub] = useStatePY(() => PFP.getSubscription());
  const [addOpen, setAddOpen] = useStatePY(false);
  const [optCard, setOptCard] = useStatePY(null);
  const [manageOpen, setManageOpen] = useStatePY(false);
  const [confirmOpen, setConfirmOpen] = useStatePY(false);
  const [toast, showToast] = usePYToast();
  const invoices = PFP.invoicesFor(tier).slice(0, 5);
  const cancelled = tier && sub.status === "cancelled";
  function persist(list) {
    setMethods(list);
    PFP.saveMethods(list);
  }
  function addCard(card) {
    const list = card.primary ? methods.map(m => ({
      ...m,
      primary: false
    })) : methods.slice();
    list.push(card);
    persist(list);
    setAddOpen(false);
    showToast(card.brand + " •• " + card.last4 + " added" + (card.primary ? " and set as default" : ""));
  }
  function setDefault(card) {
    persist(methods.map(m => ({
      ...m,
      primary: m.id === card.id
    })));
    setOptCard(null);
    showToast(card.brand + " •• " + card.last4 + " is now your default");
  }
  function removeCard(card) {
    persist(methods.filter(m => m.id !== card.id));
    setOptCard(null);
    showToast(card.brand + " •• " + card.last4 + " removed");
  }
  function cancelSub() {
    const next = {
      status: "cancelled",
      cancelledAt: new Date().toISOString()
    };
    setSub(next);
    PFP.saveSubscription(next);
    setConfirmOpen(false);
    setManageOpen(false);
    showToast("Subscription cancelled · access until " + PFP.RENEWAL.short);
  }
  function renewSub() {
    const next = {
      status: "active",
      renewedAt: new Date().toISOString()
    };
    setSub(next);
    PFP.saveSubscription(next);
    setManageOpen(false);
    showToast(tier + " Path renewed · next charge " + PFP.RENEWAL.short);
  }
  const primary = methods.find(m => m.primary) || methods[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "py-screen",
    "data-screen-label": "Payments (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "py-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "py-back",
    "aria-label": "Back",
    onClick: () => goPY("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Payments")), /*#__PURE__*/React.createElement("div", {
    className: "py-scroll"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "py-h first"
  }, "Subscription"), /*#__PURE__*/React.createElement("div", {
    className: "py-plan" + (tier ? " tier-" + PY_TIER_CLASS[tier] : " none") + (cancelled ? " cancelled" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "py-plan-top"
  }, /*#__PURE__*/React.createElement("img", {
    className: "py-plan-logo",
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy",
    draggable: "false"
  }), tier && /*#__PURE__*/React.createElement("span", {
    className: "py-plan-status" + (cancelled ? " cancelled" : "")
  }, cancelled ? "Cancelled" : "Active")), /*#__PURE__*/React.createElement("div", {
    className: "py-plan-mid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-plan-name"
  }, tier ? tier + " Path" : "No active plan"), /*#__PURE__*/React.createElement("span", {
    className: "py-plan-member"
  }, tier ? PFP.BILL_TO.name + " · Member since Oct 2025" : "Subscribe to unlock a channel")), /*#__PURE__*/React.createElement("div", {
    className: "py-plan-bot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-plan-sub"
  }, !tier ? "From " + fmtPY(PFP.PRICE.Confidence) + " / month" : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, fmtPY(price)), " / month", /*#__PURE__*/React.createElement("i", null, "·"), cancelled ? "access until " : "renews ", PFP.RENEWAL.long)), tier ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-plan-btn",
    onClick: () => setManageOpen(true)
  }, "Manage") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-plan-btn",
    onClick: () => goPY("MembershipTier.html")
  }, "Subscribe"))), tier && (cancelled ? /*#__PURE__*/React.createElement("div", {
    className: "py-substate cancelled"
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:alert-circle",
    size: 18,
    color: "var(--error)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "py-substate-tx"
  }, /*#__PURE__*/React.createElement("b", null, "Cancelled."), " You keep access until ", PFP.RENEWAL.long, ", then your plan ends."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-substate-btn",
    onClick: renewSub
  }, "Renew")) : /*#__PURE__*/React.createElement("div", {
    className: "py-substate"
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 18,
    color: "var(--success)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "py-substate-tx"
  }, /*#__PURE__*/React.createElement("b", null, "Active."), " Next charge ", fmtPY(price), " on ", PFP.RENEWAL.short, primary ? " to " + primary.brand + " •• " + primary.last4 : "", "."))), /*#__PURE__*/React.createElement("h4", {
    className: "py-h"
  }, "Payment methods"), /*#__PURE__*/React.createElement("div", {
    className: "py-cards"
  }, methods.map(c => /*#__PURE__*/React.createElement("div", {
    className: "py-card" + (c.primary ? " primary" : ""),
    key: c.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-cardic"
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:credit-card",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "py-card-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, c.brand, " ending ", c.last4), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, "Expires ", c.exp)), c.primary && /*#__PURE__*/React.createElement("span", {
    className: "py-pill"
  }, "DEFAULT"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-more",
    "aria-label": "Card options",
    onClick: () => setOptCard(c)
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-add",
    onClick: () => setAddOpen(true)
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:plus",
    size: 16,
    color: "var(--brand-navy)"
  }), "Add payment method")), /*#__PURE__*/React.createElement("h4", {
    className: "py-h"
  }, "Recent payments"), /*#__PURE__*/React.createElement("div", {
    className: "py-list"
  }, invoices.map(r => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "py-row",
    key: r.id,
    onClick: () => goPY("InvoicesMobile.html?id=" + r.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "py-date"
  }, /*#__PURE__*/React.createElement("b", null, r.d), /*#__PURE__*/React.createElement("small", null, r.m)), /*#__PURE__*/React.createElement("div", {
    className: "py-row-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, r.label), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, r.sub)), /*#__PURE__*/React.createElement("div", {
    className: "py-amt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n" + (r.status === "Refunded" ? " refund" : "")
  }, r.status === "Refunded" ? "−" : "", fmtPY(r.amount)), /*#__PURE__*/React.createElement("span", {
    className: "st" + (r.status === "Refunded" ? " refund" : "")
  }, r.status))))), /*#__PURE__*/React.createElement("button", {
    className: "py-showall",
    onClick: () => goPY("InvoicesMobile.html")
  }, "View all invoices")), /*#__PURE__*/React.createElement(PYAddCardSheet, {
    open: addOpen,
    onClose: () => setAddOpen(false),
    onSave: addCard,
    hasCards: methods.length > 0
  }), /*#__PURE__*/React.createElement(PYCardOptionsSheet, {
    card: optCard,
    onClose: () => setOptCard(null),
    onDefault: () => setDefault(optCard),
    onRemove: () => removeCard(optCard)
  }), tier && /*#__PURE__*/React.createElement(PYManageSheet, {
    open: manageOpen && !confirmOpen,
    onClose: () => setManageOpen(false),
    tier: tier,
    price: price,
    sub: sub,
    onCancel: () => setConfirmOpen(true),
    onRenew: renewSub
  }), tier && /*#__PURE__*/React.createElement(PYCancelConfirmSheet, {
    open: confirmOpen,
    onClose: () => setConfirmOpen(false),
    tier: tier,
    onConfirm: cancelSub
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "py-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSPY.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "#fff"
  }), toast));
}
function PaymentsMobileApp() {
  const mobile = useIsMobilePY();
  const scale = useDeviceScalePY();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement(PaymentsScreen, null));
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
  }, /*#__PURE__*/React.createElement(PaymentsScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(PaymentsMobileApp, null));
