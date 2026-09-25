/* ===========================================================================
   PROfinity — Payments + Invoices (web)
   Desktop twin of PaymentsMobile.html / InvoicesMobile.html, reached from the
   header account menu (click your name → Payments) and from Settings.
   One bundle, two pages, picked by the shell:
     PaymentsWeb.html                      window.PF_PAY_PAGE = "payments"
     InvoicesWeb.html  (+ ?id=INV-…)       window.PF_PAY_PAGE = "invoices"
   Same TopNav + .nsw-* shell as AccountSettingsWeb; data + persistence come
   from payments-data.js (window.PFPayments) so numbers match mobile exactly.
   Suffixed -PYW / classes .pyw-* and .ivw-*.
   =========================================================================== */
const {
  useState: useStatePYW,
  useEffect: useEffectPYW,
  useRef: useRefPYW,
  useMemo: useMemoPYW
} = React;
const DSPYW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavPYW,
  IconifyIcon: IconPYW
} = DSPYW;
const PFPW = window.PFPayments;
const ME_PYW = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const PYW_TIER_CLASS = {
  Confidence: "confidence",
  Mastery: "mastery",
  Freedom: "freedom",
  "Inner Circle": "inner"
};
const fmtPYW = PFPW.fmt;
function goPYW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigatePYW(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goPYW(u);
}

/* ---- shared bits ------------------------------------------------------- */
function usePYWToast() {
  const [toast, setToast] = useStatePYW(null);
  const timer = useRefPYW(null);
  function show(msg) {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }
  useEffectPYW(() => () => clearTimeout(timer.current), []);
  return [toast, show];
}
function PYWToast({
  msg
}) {
  if (!msg) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pyw-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:check",
    size: 16,
    color: "#fff"
  }), msg);
}

/* Centered dialog — the desktop stand-in for the mobile bottom sheet. */
function PYWModal({
  open,
  onClose,
  title,
  children,
  width
}) {
  useEffectPYW(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pyw-modal-wrap",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "pyw-modal",
    style: width ? {
      maxWidth: width
    } : null
  }, /*#__PURE__*/React.createElement("header", {
    className: "pyw-modal-head"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-modal-x",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:x",
    size: 18,
    color: "var(--gray-500)"
  }))), children));
}
function PYWShell({
  label,
  title,
  lede,
  crumbs,
  back,
  children,
  wide
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavPYW, {
    user: ME_PYW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigatePYW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-page pyw-page" + (wide ? " wide" : ""),
    "data-screen-label": label
  }, /*#__PURE__*/React.createElement("div", {
    className: "nsw-head-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-back",
    "aria-label": "Back",
    onClick: () => goPYW(back)
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:arrow-left",
    size: 18,
    color: "var(--text-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nsw-head-titles"
  }, /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("p", null, lede))), /*#__PURE__*/React.createElement("div", {
    className: "nsw-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goPYW("NewsfeedWeb.html")
  }, "Home"), " / ", /*#__PURE__*/React.createElement("a", {
    onClick: () => goPYW("AccountSettingsWeb.html")
  }, "Settings"), crumbs.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, " / ", c.href ? /*#__PURE__*/React.createElement("a", {
    onClick: () => goPYW(c.href)
  }, c.label) : c.label))), children));
}

/* ---- add-card modal ---------------------------------------------------- */
function formatCardNumberPYW(v) {
  const d = v.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiryPYW(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}
function expiryValidPYW(exp) {
  const m = /^(\d{2})\/(\d{2})$/.exec(exp);
  if (!m) return false;
  const mm = +m[1],
    yy = 2000 + +m[2];
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  return yy > now.getFullYear() || yy === now.getFullYear() && mm >= now.getMonth() + 1;
}
function PYWAddCardModal({
  open,
  onClose,
  onSave,
  hasCards
}) {
  const [number, setNumber] = useStatePYW("");
  const [exp, setExp] = useStatePYW("");
  const [cvc, setCvc] = useStatePYW("");
  const [name, setName] = useStatePYW("");
  const [makeDefault, setMakeDefault] = useStatePYW(!hasCards);
  const [touched, setTouched] = useStatePYW(false);
  useEffectPYW(() => {
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
  const brand = PFPW.brandFor(digits);
  const errs = {
    number: digits.length < 15 ? "Enter a valid card number" : "",
    exp: expiryValidPYW(exp) ? "" : "Enter a valid expiry",
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
  return /*#__PURE__*/React.createElement(PYWModal, {
    open: open,
    onClose: onClose,
    title: "Add payment method"
  }, /*#__PURE__*/React.createElement("form", {
    className: "pyw-form",
    onSubmit: submit,
    noValidate: true
  }, /*#__PURE__*/React.createElement("label", {
    className: "pyw-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-label"
  }, "Card number"), /*#__PURE__*/React.createElement("span", {
    className: "pyw-input-wrap"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:credit-card",
    size: 18,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("input", {
    className: "pyw-input",
    inputMode: "numeric",
    autoComplete: "cc-number",
    placeholder: "1234 5678 9012 3456",
    value: number,
    onChange: e => setNumber(formatCardNumberPYW(e.target.value)),
    autoFocus: true
  }), digits.length >= 1 && /*#__PURE__*/React.createElement("span", {
    className: "pyw-brand"
  }, brand)), touched && errs.number && /*#__PURE__*/React.createElement("span", {
    className: "pyw-err"
  }, errs.number)), /*#__PURE__*/React.createElement("div", {
    className: "pyw-field-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "pyw-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-label"
  }, "Expiry"), /*#__PURE__*/React.createElement("span", {
    className: "pyw-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    className: "pyw-input",
    inputMode: "numeric",
    autoComplete: "cc-exp",
    placeholder: "MM/YY",
    value: exp,
    onChange: e => setExp(formatExpiryPYW(e.target.value))
  })), touched && errs.exp && /*#__PURE__*/React.createElement("span", {
    className: "pyw-err"
  }, errs.exp)), /*#__PURE__*/React.createElement("label", {
    className: "pyw-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-label"
  }, "CVC"), /*#__PURE__*/React.createElement("span", {
    className: "pyw-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    className: "pyw-input",
    inputMode: "numeric",
    autoComplete: "cc-csc",
    placeholder: "123",
    maxLength: 4,
    value: cvc,
    onChange: e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
  }), /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:lock",
    size: 16,
    color: "var(--gray-450)"
  })), touched && errs.cvc && /*#__PURE__*/React.createElement("span", {
    className: "pyw-err"
  }, errs.cvc))), /*#__PURE__*/React.createElement("label", {
    className: "pyw-field"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-label"
  }, "Name on card"), /*#__PURE__*/React.createElement("span", {
    className: "pyw-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    className: "pyw-input",
    autoComplete: "cc-name",
    placeholder: "Katy Wilson",
    value: name,
    onChange: e => setName(e.target.value)
  })), touched && errs.name && /*#__PURE__*/React.createElement("span", {
    className: "pyw-err"
  }, errs.name)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-check" + (makeDefault ? " on" : ""),
    onClick: () => setMakeDefault(!makeDefault),
    role: "checkbox",
    "aria-checked": makeDefault
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-check-box"
  }, makeDefault && /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:check",
    size: 14,
    color: "#fff"
  })), "Use as default payment method"), /*#__PURE__*/React.createElement("p", {
    className: "pyw-secure"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:lock",
    size: 13,
    color: "var(--gray-500)"
  }), "Card details are encrypted and stored securely."), /*#__PURE__*/React.createElement("div", {
    className: "pyw-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "nsw-btn-primary" + (valid ? "" : " dim")
  }, "Save card"))));
}

/* ---- card options modal ------------------------------------------------ */
function PYWCardOptionsModal({
  card,
  onClose,
  onDefault,
  onRemove
}) {
  if (!card) return null;
  return /*#__PURE__*/React.createElement(PYWModal, {
    open: true,
    onClose: onClose,
    title: card.brand + " ending " + card.last4,
    width: 400
  }, /*#__PURE__*/React.createElement("p", {
    className: "pyw-modal-p"
  }, "Expires ", card.exp, card.name ? " · " + card.name : ""), /*#__PURE__*/React.createElement("div", {
    className: "pyw-opts"
  }, !card.primary && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-opt",
    onClick: onDefault
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:star",
    size: 20,
    color: "var(--brand-navy)"
  }), "Set as default"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-opt danger" + (card.primary ? " dim" : ""),
    onClick: onRemove,
    disabled: card.primary
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:trash-2",
    size: 20,
    color: card.primary ? "var(--gray-450)" : "var(--error)"
  }), card.primary ? "Default card can't be removed" : "Remove card")), /*#__PURE__*/React.createElement("div", {
    className: "pyw-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary",
    onClick: onClose
  }, "Close")));
}

/* ---- subscription: manage / cancel / renew ----------------------------- */
function PYWManageModal({
  open,
  onClose,
  tier,
  price,
  sub,
  onCancel,
  onRenew
}) {
  const cancelled = sub.status === "cancelled";
  return /*#__PURE__*/React.createElement(PYWModal, {
    open: open,
    onClose: onClose,
    title: "Manage subscription",
    width: 420
  }, /*#__PURE__*/React.createElement("p", {
    className: "pyw-modal-p"
  }, /*#__PURE__*/React.createElement("b", null, tier, " Path"), " · ", fmtPYW(price), " / month.", " ", cancelled ? "Cancelled — your access ends on " + PFPW.RENEWAL.long + "." : "Renews automatically on " + PFPW.RENEWAL.long + "."), /*#__PURE__*/React.createElement("div", {
    className: "pyw-opts"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-opt",
    onClick: () => goPYW("MembershipTier.html")
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:gem",
    size: 20,
    color: "var(--brand-navy)"
  }), "Change plan"), cancelled ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-opt",
    onClick: onRenew
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:rotate-ccw",
    size: 20,
    color: "var(--success)"
  }), "Renew subscription") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-opt danger",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:x-circle",
    size: 20,
    color: "var(--error)"
  }), "Cancel subscription")), /*#__PURE__*/React.createElement("div", {
    className: "pyw-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary",
    onClick: onClose
  }, "Close")));
}
function PYWCancelConfirmModal({
  open,
  onClose,
  tier,
  onConfirm
}) {
  return /*#__PURE__*/React.createElement(PYWModal, {
    open: open,
    onClose: onClose,
    title: "Cancel subscription?",
    width: 440
  }, /*#__PURE__*/React.createElement("p", {
    className: "pyw-modal-p"
  }, "You'll keep full ", /*#__PURE__*/React.createElement("b", null, tier, " Path"), " access until ", /*#__PURE__*/React.createElement("b", null, PFPW.RENEWAL.long), ". After that your channels, courses and community perks lock, and you won't be charged again. You can renew any time before then and nothing changes."), /*#__PURE__*/React.createElement("ul", {
    className: "pyw-lose"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:x",
    size: 16,
    color: "var(--error)"
  }), tier, " channel & community feed"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:x",
    size: 16,
    color: "var(--error)"
  }), "Included courses & live sessions"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:x",
    size: 16,
    color: "var(--error)"
  }), "Member points & rewards progress")), /*#__PURE__*/React.createElement("div", {
    className: "pyw-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-btn-danger",
    onClick: onConfirm
  }, "Cancel subscription"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-primary",
    onClick: onClose
  }, "Keep my subscription")));
}

/* ---- invoice row (shared by Payments "Recent" + Invoices list) --------- */
function PYWInvoiceRow({
  r,
  onOpen,
  chevron
}) {
  const refund = r.status === "Refunded";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-row",
    onClick: () => onOpen(r)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-date"
  }, /*#__PURE__*/React.createElement("b", null, r.d), /*#__PURE__*/React.createElement("small", null, r.m)), /*#__PURE__*/React.createElement("div", {
    className: "pyw-row-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, r.label), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, r.sub)), /*#__PURE__*/React.createElement("div", {
    className: "pyw-amt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n" + (refund ? " refund" : "")
  }, refund ? "−" : "", fmtPYW(r.amount)), /*#__PURE__*/React.createElement("span", {
    className: "st" + (refund ? " refund" : "")
  }, r.status)), chevron && /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  }));
}

/* =========================================================================
   PAYMENTS PAGE
   ========================================================================= */
function PaymentsWeb() {
  const tier = PFPW.getTier();
  const price = tier ? PFPW.PRICE[tier] : null;
  const [methods, setMethods] = useStatePYW(() => PFPW.getMethods());
  const [sub, setSub] = useStatePYW(() => PFPW.getSubscription());
  const [addOpen, setAddOpen] = useStatePYW(false);
  const [optCard, setOptCard] = useStatePYW(null);
  const [manageOpen, setManageOpen] = useStatePYW(false);
  const [confirmOpen, setConfirmOpen] = useStatePYW(false);
  const [toast, showToast] = usePYWToast();
  const invoices = PFPW.invoicesFor(tier).slice(0, 5);
  const cancelled = tier && sub.status === "cancelled";
  function persist(list) {
    setMethods(list);
    PFPW.saveMethods(list);
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
    PFPW.saveSubscription(next);
    setConfirmOpen(false);
    setManageOpen(false);
    showToast("Subscription cancelled · access until " + PFPW.RENEWAL.short);
  }
  function renewSub() {
    const next = {
      status: "active",
      renewedAt: new Date().toISOString()
    };
    setSub(next);
    PFPW.saveSubscription(next);
    setManageOpen(false);
    showToast(tier + " Path renewed · next charge " + PFPW.RENEWAL.short);
  }
  const primary = methods.find(m => m.primary) || methods[0];
  return /*#__PURE__*/React.createElement(PYWShell, {
    label: "Payments (web)",
    title: "Payments",
    lede: "Manage your subscription, saved cards and invoices.",
    crumbs: [{
      label: "Payments"
    }],
    back: "AccountSettingsWeb.html"
  }, /*#__PURE__*/React.createElement("section", {
    className: "nsw-card pyw-sub-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Subscription")), /*#__PURE__*/React.createElement("div", {
    className: "pyw-sub"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pyw-plan" + (tier ? " tier-" + PYW_TIER_CLASS[tier] : " none") + (cancelled ? " cancelled" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "pyw-plan-top"
  }, /*#__PURE__*/React.createElement("img", {
    className: "pyw-plan-logo",
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy",
    draggable: "false"
  }), tier && /*#__PURE__*/React.createElement("span", {
    className: "pyw-plan-status" + (cancelled ? " cancelled" : "")
  }, cancelled ? "Cancelled" : "Active")), /*#__PURE__*/React.createElement("div", {
    className: "pyw-plan-mid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-plan-name"
  }, tier ? tier + " Path" : "No active plan"), /*#__PURE__*/React.createElement("span", {
    className: "pyw-plan-member"
  }, tier ? PFPW.BILL_TO.name + " · Member since Oct 2025" : "Subscribe to unlock a channel")), /*#__PURE__*/React.createElement("div", {
    className: "pyw-plan-bot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-plan-sub"
  }, !tier ? "From " + fmtPYW(PFPW.PRICE.Confidence) + " / month" : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, fmtPYW(price)), " / month", /*#__PURE__*/React.createElement("i", null, "·"), cancelled ? "access until " : "renews ", PFPW.RENEWAL.long)))), /*#__PURE__*/React.createElement("div", {
    className: "pyw-sub-side"
  }, tier ? cancelled ? /*#__PURE__*/React.createElement("div", {
    className: "pyw-substate cancelled"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:alert-circle",
    size: 18,
    color: "var(--error)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pyw-substate-tx"
  }, /*#__PURE__*/React.createElement("b", null, "Cancelled."), " You keep access until ", PFPW.RENEWAL.long, ", then your plan ends.")) : /*#__PURE__*/React.createElement("div", {
    className: "pyw-substate"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:check-circle-2",
    size: 18,
    color: "var(--success)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pyw-substate-tx"
  }, /*#__PURE__*/React.createElement("b", null, "Active."), " Next charge ", fmtPYW(price), " on ", PFPW.RENEWAL.short, primary ? " to " + primary.brand + " •• " + primary.last4 : "", ".")) : /*#__PURE__*/React.createElement("div", {
    className: "pyw-substate"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:info",
    size: 18,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pyw-substate-tx"
  }, /*#__PURE__*/React.createElement("b", null, "No active plan."), " Pick a path to unlock channels, courses and member rewards.")), /*#__PURE__*/React.createElement("dl", {
    className: "pyw-facts"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Plan"), /*#__PURE__*/React.createElement("dd", null, tier ? tier + " Path" : "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Billing"), /*#__PURE__*/React.createElement("dd", null, tier ? fmtPYW(price) + " / month" : "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, cancelled ? "Access until" : "Next renewal"), /*#__PURE__*/React.createElement("dd", null, tier ? PFPW.RENEWAL.long : "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Payment method"), /*#__PURE__*/React.createElement("dd", null, primary ? primary.brand + " •• " + primary.last4 : "—"))), /*#__PURE__*/React.createElement("div", {
    className: "pyw-sub-actions"
  }, tier ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-primary",
    onClick: () => setManageOpen(true)
  }, "Manage subscription"), cancelled ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary",
    onClick: renewSub
  }, "Renew now") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary",
    onClick: () => goPYW("MembershipTier.html")
  }, "Change plan")) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-primary",
    onClick: () => goPYW("MembershipTier.html")
  }, "Subscribe"))))), /*#__PURE__*/React.createElement("div", {
    className: "pyw-two"
  }, /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head pyw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Payment methods"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-link-btn",
    onClick: () => setAddOpen(true)
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:plus",
    size: 15,
    color: "var(--brand-navy)"
  }), "Add card")), /*#__PURE__*/React.createElement("div", {
    className: "pyw-cards"
  }, methods.map(c => /*#__PURE__*/React.createElement("div", {
    className: "pyw-card" + (c.primary ? " primary" : ""),
    key: c.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "pyw-cardic"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:credit-card",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pyw-card-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, c.brand, " ending ", c.last4), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, "Expires ", c.exp, c.name ? " · " + c.name : "")), c.primary && /*#__PURE__*/React.createElement("span", {
    className: "pyw-pill"
  }, "DEFAULT"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-more",
    "aria-label": "Card options",
    onClick: () => setOptCard(c)
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:more-horizontal",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-add",
    onClick: () => setAddOpen(true)
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:plus",
    size: 16,
    color: "var(--brand-navy)"
  }), "Add payment method"))), /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head pyw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Recent payments"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-link-btn",
    onClick: () => goPYW("InvoicesWeb.html")
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    className: "pyw-list"
  }, invoices.map(r => /*#__PURE__*/React.createElement(PYWInvoiceRow, {
    key: r.id,
    r: r,
    onOpen: x => goPYW("InvoicesWeb.html?id=" + x.id)
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pyw-showall",
    onClick: () => goPYW("InvoicesWeb.html")
  }, "View all invoices"))), /*#__PURE__*/React.createElement(PYWAddCardModal, {
    open: addOpen,
    onClose: () => setAddOpen(false),
    onSave: addCard,
    hasCards: methods.length > 0
  }), /*#__PURE__*/React.createElement(PYWCardOptionsModal, {
    card: optCard,
    onClose: () => setOptCard(null),
    onDefault: () => setDefault(optCard),
    onRemove: () => removeCard(optCard)
  }), tier && /*#__PURE__*/React.createElement(PYWManageModal, {
    open: manageOpen && !confirmOpen,
    onClose: () => setManageOpen(false),
    tier: tier,
    price: price,
    sub: sub,
    onCancel: () => setConfirmOpen(true),
    onRenew: renewSub
  }), tier && /*#__PURE__*/React.createElement(PYWCancelConfirmModal, {
    open: confirmOpen,
    onClose: () => setConfirmOpen(false),
    tier: tier,
    onConfirm: cancelSub
  }), /*#__PURE__*/React.createElement(PYWToast, {
    msg: toast
  }));
}

/* =========================================================================
   INVOICES PAGE (list + ?id= detail)
   ========================================================================= */
const IVW_FILTERS = [{
  key: "all",
  label: "All"
}, {
  key: "Subscription",
  label: "Subscription"
}, {
  key: "Course",
  label: "Courses"
}, {
  key: "Event",
  label: "Events"
}, {
  key: "Refunded",
  label: "Refunded"
}];
function readInvoiceIdPYW() {
  try {
    return new URLSearchParams(window.location.search).get("id");
  } catch (e) {
    return null;
  }
}
function InvoiceListWeb({
  tier
}) {
  const [filter, setFilter] = useStatePYW("all");
  const all = useMemoPYW(() => PFPW.invoicesFor(tier), [tier]);
  const rows = filter === "all" ? all : filter === "Refunded" ? all.filter(r => r.status === "Refunded") : all.filter(r => r.kind === filter);
  const groups = [];
  rows.forEach(r => {
    const key = r.mLong + " " + r.y;
    const g = groups[groups.length - 1];
    if (g && g.key === key) g.rows.push(r);else groups.push({
      key,
      rows: [r]
    });
  });
  return /*#__PURE__*/React.createElement(PYWShell, {
    label: "Invoices (web)",
    title: "Invoices",
    lede: "Every subscription charge, course and event purchase on your account.",
    crumbs: [{
      label: "Payments",
      href: "PaymentsWeb.html"
    }, {
      label: "Invoices"
    }],
    back: "PaymentsWeb.html"
  }, /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-chips",
    role: "tablist",
    "aria-label": "Filter invoices"
  }, IVW_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: f.key,
    role: "tab",
    "aria-selected": filter === f.key,
    className: "ivw-chip" + (filter === f.key ? " on" : ""),
    onClick: () => setFilter(f.key)
  }, f.label))), groups.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "ivw-empty"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:file-text",
    size: 28,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("p", null, "No invoices match this filter.")), groups.map(g => /*#__PURE__*/React.createElement("section", {
    className: "ivw-group",
    key: g.key
  }, /*#__PURE__*/React.createElement("h4", {
    className: "ivw-group-h"
  }, g.key), /*#__PURE__*/React.createElement("div", {
    className: "pyw-list"
  }, g.rows.map(r => /*#__PURE__*/React.createElement(PYWInvoiceRow, {
    key: r.id,
    r: r,
    chevron: true,
    onOpen: x => goPYW("InvoicesWeb.html?id=" + x.id)
  })))))), /*#__PURE__*/React.createElement("p", {
    className: "ivw-foot-note"
  }, "Need a VAT invoice or a correction? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goPYW("ChatSupportWeb.html");
    }
  }, "Message support"), "."));
}
function InvoiceDetailWeb({
  inv
}) {
  const [toast, showToast] = usePYWToast();
  const refund = inv.status === "Refunded";
  const subtotal = inv.items.reduce((s, it) => s + it.amount, 0);
  const vat = Math.round(subtotal / 6 * 100) / 100; /* prices are VAT-inclusive at 20% */
  const net = Math.round((subtotal - vat) * 100) / 100;
  const bill = PFPW.BILL_TO;
  const icon = inv.kind === "Subscription" ? "lucide:gem" : inv.kind === "Course" ? "lucide:graduation-cap" : "lucide:calendar";
  return /*#__PURE__*/React.createElement(PYWShell, {
    label: "Invoice detail (web)",
    title: "Invoice " + inv.id,
    lede: inv.label + " · " + inv.dateLong,
    crumbs: [{
      label: "Payments",
      href: "PaymentsWeb.html"
    }, {
      label: "Invoices",
      href: "InvoicesWeb.html"
    }, {
      label: inv.id
    }],
    back: "InvoicesWeb.html",
    wide: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-main"
  }, /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-hero" + (refund ? " refund" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ivw-hero-ic"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: icon,
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ivw-hero-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ivw-hero-label"
  }, inv.label), /*#__PURE__*/React.createElement("span", {
    className: "ivw-hero-date"
  }, inv.dateLong, " · ", inv.kind)), /*#__PURE__*/React.createElement("div", {
    className: "ivw-hero-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ivw-status" + (refund ? " refund" : "")
  }, inv.status), /*#__PURE__*/React.createElement("span", {
    className: "ivw-hero-amt"
  }, refund ? "−" : "", fmtPYW(inv.amount)))), /*#__PURE__*/React.createElement("div", {
    className: "ivw-items"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-item head"
  }, /*#__PURE__*/React.createElement("span", null, "Item"), /*#__PURE__*/React.createElement("span", null, "Amount")), inv.items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "ivw-item",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-item-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, it.name), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, it.detail)), /*#__PURE__*/React.createElement("span", {
    className: "ivw-item-amt"
  }, fmtPYW(it.amount)))), /*#__PURE__*/React.createElement("div", {
    className: "ivw-totals"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-tot"
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal (ex. VAT)"), /*#__PURE__*/React.createElement("span", null, fmtPYW(net))), /*#__PURE__*/React.createElement("div", {
    className: "ivw-tot"
  }, /*#__PURE__*/React.createElement("span", null, "VAT (20%)"), /*#__PURE__*/React.createElement("span", null, fmtPYW(vat))), /*#__PURE__*/React.createElement("div", {
    className: "ivw-tot grand"
  }, /*#__PURE__*/React.createElement("span", null, refund ? "Refunded" : "Total paid"), /*#__PURE__*/React.createElement("span", null, refund ? "−" : "", fmtPYW(subtotal)))))), /*#__PURE__*/React.createElement("p", {
    className: "ivw-foot-note left"
  }, "Something wrong with this invoice? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goPYW("ChatSupportWeb.html");
    }
  }, "Message support"), ".")), /*#__PURE__*/React.createElement("aside", {
    className: "ivw-aside"
  }, /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Details")), /*#__PURE__*/React.createElement("div", {
    className: "ivw-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Invoice number"), /*#__PURE__*/React.createElement("span", {
    className: "v mono"
  }, inv.id)), /*#__PURE__*/React.createElement("div", {
    className: "ivw-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Date"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, inv.dateLong)), /*#__PURE__*/React.createElement("div", {
    className: "ivw-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Type"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, inv.kind)), /*#__PURE__*/React.createElement("div", {
    className: "ivw-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Payment method"), /*#__PURE__*/React.createElement("span", {
    className: "v ivw-pm"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:credit-card",
    size: 16,
    color: "var(--brand-navy)"
  }), inv.method.brand, " •• ", inv.method.last4)), refund && /*#__PURE__*/React.createElement("div", {
    className: "ivw-meta-row wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Refunded to"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, inv.method.brand, " •• ", inv.method.last4, " · 3–5 working days")))), /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Billed to")), /*#__PURE__*/React.createElement("div", {
    className: "ivw-billto"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, bill.name), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, bill.clinic), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, bill.address), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, bill.city), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, bill.email))), /*#__PURE__*/React.createElement("div", {
    className: "ivw-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-primary ivw-btn",
    onClick: () => showToast("Invoice " + inv.id + " downloaded")
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:download",
    size: 17,
    color: "#fff"
  }), "Download PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary ivw-btn",
    onClick: () => showToast("Receipt emailed to " + bill.email)
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:send",
    size: 17,
    color: "var(--brand-navy)"
  }), "Email receipt")))), /*#__PURE__*/React.createElement(PYWToast, {
    msg: toast
  }));
}
function InvoiceMissingWeb() {
  return /*#__PURE__*/React.createElement(PYWShell, {
    label: "Invoice not found (web)",
    title: "Invoice",
    lede: "We couldn't find that invoice.",
    crumbs: [{
      label: "Payments",
      href: "PaymentsWeb.html"
    }, {
      label: "Invoices",
      href: "InvoicesWeb.html"
    }],
    back: "InvoicesWeb.html"
  }, /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ivw-empty tall"
  }, /*#__PURE__*/React.createElement(IconPYW, {
    name: "lucide:file-text",
    size: 32,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("p", null, "We couldn't find that invoice."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary",
    onClick: () => goPYW("InvoicesWeb.html")
  }, "Back to all invoices"))));
}
function InvoicesWeb() {
  const tier = PFPW.getTier();
  const id = readInvoiceIdPYW();
  if (!id) return /*#__PURE__*/React.createElement(InvoiceListWeb, {
    tier: tier
  });
  const inv = PFPW.findInvoice(tier, id);
  return inv ? /*#__PURE__*/React.createElement(InvoiceDetailWeb, {
    inv: inv
  }) : /*#__PURE__*/React.createElement(InvoiceMissingWeb, null);
}

/* ---- mount ------------------------------------------------------------- */
const PYW_PAGE = window.PF_PAY_PAGE === "invoices" ? InvoicesWeb : PaymentsWeb;
ReactDOM.createRoot(document.getElementById("pf-root")).render(React.createElement(PYW_PAGE));
