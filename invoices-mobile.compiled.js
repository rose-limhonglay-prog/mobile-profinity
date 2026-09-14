/* ===========================================================================
   PROfinity — Invoices (mobile) · iPhone 17 Pro Max
   Two views in one page, driven by the URL:
     InvoicesMobile.html           → full invoice history, filter chips,
                                     grouped by month
     InvoicesMobile.html?id=INV-…  → a single invoice (line items, totals,
                                     billed-to, payment method, download)
   Data comes from payments-data.js (window.PFPayments) so the list matches
   the "Recent payments" on PaymentsMobile.html. Suffixed -IV.
   =========================================================================== */
const {
  useState: useStateIV,
  useEffect: useEffectIV,
  useRef: useRefIV,
  useMemo: useMemoIV
} = React;
const DSIV = window.ProfinityDesignSystem_c2b5cc;
const PFI = window.PFPayments;
function goIV(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleIV() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateIV(calc);
  useEffectIV(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileIV() {
  const [mobile, setMobile] = useStateIV(() => window.matchMedia('(max-width:768px)').matches);
  useEffectIV(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function useToastIV() {
  const [toast, setToast] = useStateIV(null);
  const timer = useRefIV(null);
  function show(msg) {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }
  useEffectIV(() => () => clearTimeout(timer.current), []);
  return [toast, show];
}
const fmtIV = PFI.fmt;
const IV_FILTERS = [{
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
function readInvoiceIdIV() {
  try {
    return new URLSearchParams(window.location.search).get("id");
  } catch (e) {
    return null;
  }
}

/* ---- list view --------------------------------------------------------- */
function InvoiceRowIV({
  r,
  onOpen
}) {
  const refund = r.status === "Refunded";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "iv-row",
    onClick: () => onOpen(r)
  }, /*#__PURE__*/React.createElement("span", {
    className: "iv-date"
  }, /*#__PURE__*/React.createElement("b", null, r.d), /*#__PURE__*/React.createElement("small", null, r.m)), /*#__PURE__*/React.createElement("div", {
    className: "iv-row-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, r.label), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, r.sub)), /*#__PURE__*/React.createElement("div", {
    className: "iv-amt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n" + (refund ? " refund" : "")
  }, refund ? "−" : "", fmtIV(r.amount)), /*#__PURE__*/React.createElement("span", {
    className: "st" + (refund ? " refund" : "")
  }, r.status)), /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  }));
}
function InvoiceListIV({
  tier
}) {
  const [filter, setFilter] = useStateIV("all");
  const all = useMemoIV(() => PFI.invoicesFor(tier), [tier]);
  const rows = filter === "all" ? all : filter === "Refunded" ? all.filter(r => r.status === "Refunded") : all.filter(r => r.kind === filter);

  /* group by month heading */
  const groups = [];
  rows.forEach(r => {
    const key = r.mLong + " " + r.y;
    const g = groups[groups.length - 1];
    if (g && g.key === key) g.rows.push(r);else groups.push({
      key,
      rows: [r]
    });
  });
  function open(r) {
    goIV("InvoicesMobile.html?id=" + r.id);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "iv-screen",
    "data-screen-label": "Invoices (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "iv-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "iv-back",
    "aria-label": "Back",
    onClick: () => goIV("PaymentsMobile.html")
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Invoices")), /*#__PURE__*/React.createElement("div", {
    className: "iv-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iv-chips",
    role: "tablist",
    "aria-label": "Filter invoices"
  }, IV_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: f.key,
    role: "tab",
    "aria-selected": filter === f.key,
    className: "iv-chip" + (filter === f.key ? " on" : ""),
    onClick: () => setFilter(f.key)
  }, f.label))), groups.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "iv-empty"
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:file-text",
    size: 28,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("p", null, "No invoices match this filter.")), groups.map(g => /*#__PURE__*/React.createElement("section", {
    className: "iv-group",
    key: g.key
  }, /*#__PURE__*/React.createElement("h4", {
    className: "iv-group-h"
  }, g.key), /*#__PURE__*/React.createElement("div", {
    className: "iv-list"
  }, g.rows.map(r => /*#__PURE__*/React.createElement(InvoiceRowIV, {
    key: r.id,
    r: r,
    onOpen: open
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "iv-foot-note"
  }, "Need a VAT invoice or a correction? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goIV("Messages.html");
    }
  }, "Message support"), ".")));
}

/* ---- detail view ------------------------------------------------------- */
function InvoiceDetailIV({
  tier,
  inv
}) {
  const [toast, showToast] = useToastIV();
  const refund = inv.status === "Refunded";
  const subtotal = inv.items.reduce((s, it) => s + it.amount, 0);
  const vat = Math.round(subtotal / 6 * 100) / 100; /* prices are VAT-inclusive at 20% */
  const net = Math.round((subtotal - vat) * 100) / 100;
  const bill = PFI.BILL_TO;
  return /*#__PURE__*/React.createElement("div", {
    className: "iv-screen",
    "data-screen-label": "Invoice detail (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "iv-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "iv-back",
    "aria-label": "Back to invoices",
    onClick: () => goIV("InvoicesMobile.html")
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Invoice"), /*#__PURE__*/React.createElement("button", {
    className: "iv-share",
    "aria-label": "Share invoice",
    onClick: () => showToast("Share link copied")
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:share-2",
    size: 22,
    color: "var(--gray-900)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "iv-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iv-hero" + (refund ? " refund" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "iv-hero-ic"
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: inv.kind === "Subscription" ? "lucide:gem" : inv.kind === "Course" ? "lucide:graduation-cap" : "lucide:calendar",
    size: 22,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "iv-status" + (refund ? " refund" : "")
  }, inv.status), /*#__PURE__*/React.createElement("span", {
    className: "iv-hero-amt"
  }, refund ? "−" : "", fmtIV(inv.amount)), /*#__PURE__*/React.createElement("span", {
    className: "iv-hero-label"
  }, inv.label), /*#__PURE__*/React.createElement("span", {
    className: "iv-hero-date"
  }, inv.dateLong)), /*#__PURE__*/React.createElement("div", {
    className: "iv-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iv-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Invoice number"), /*#__PURE__*/React.createElement("span", {
    className: "v mono"
  }, inv.id)), /*#__PURE__*/React.createElement("div", {
    className: "iv-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Date"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, inv.dateLong)), /*#__PURE__*/React.createElement("div", {
    className: "iv-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Type"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, inv.kind)), /*#__PURE__*/React.createElement("div", {
    className: "iv-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Payment method"), /*#__PURE__*/React.createElement("span", {
    className: "v iv-pm"
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:credit-card",
    size: 16,
    color: "var(--brand-navy)"
  }), inv.method.brand, " •• ", inv.method.last4)), refund && /*#__PURE__*/React.createElement("div", {
    className: "iv-meta-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Refunded to"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, inv.method.brand, " •• ", inv.method.last4, " · 3–5 working days"))), /*#__PURE__*/React.createElement("h4", {
    className: "iv-h"
  }, "Items"), /*#__PURE__*/React.createElement("div", {
    className: "iv-items"
  }, inv.items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "iv-item",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "iv-item-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, it.name), /*#__PURE__*/React.createElement("span", {
    className: "su"
  }, it.detail)), /*#__PURE__*/React.createElement("span", {
    className: "iv-item-amt"
  }, fmtIV(it.amount)))), /*#__PURE__*/React.createElement("div", {
    className: "iv-totals"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iv-tot"
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal (ex. VAT)"), /*#__PURE__*/React.createElement("span", null, fmtIV(net))), /*#__PURE__*/React.createElement("div", {
    className: "iv-tot"
  }, /*#__PURE__*/React.createElement("span", null, "VAT (20%)"), /*#__PURE__*/React.createElement("span", null, fmtIV(vat))), /*#__PURE__*/React.createElement("div", {
    className: "iv-tot grand"
  }, /*#__PURE__*/React.createElement("span", null, refund ? "Refunded" : "Total paid"), /*#__PURE__*/React.createElement("span", null, refund ? "−" : "", fmtIV(subtotal))))), /*#__PURE__*/React.createElement("h4", {
    className: "iv-h"
  }, "Billed to"), /*#__PURE__*/React.createElement("div", {
    className: "iv-billto"
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
  }, bill.email)), /*#__PURE__*/React.createElement("div", {
    className: "iv-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "iv-btn-fill",
    onClick: () => showToast("Invoice " + inv.id + " saved to Files")
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:download",
    size: 18,
    color: "#fff"
  }), "Download PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "iv-btn-ghost",
    onClick: () => showToast("Receipt emailed to " + bill.email)
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:send",
    size: 18,
    color: "var(--brand-navy)"
  }), "Email receipt")), /*#__PURE__*/React.createElement("p", {
    className: "iv-foot-note"
  }, "Something wrong with this invoice? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      goIV("Messages.html");
    }
  }, "Message support"), ".")), toast && /*#__PURE__*/React.createElement("div", {
    className: "iv-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "#fff"
  }), toast));
}
function InvoiceMissingIV() {
  return /*#__PURE__*/React.createElement("div", {
    className: "iv-screen",
    "data-screen-label": "Invoice not found (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "iv-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "iv-back",
    "aria-label": "Back to invoices",
    onClick: () => goIV("InvoicesMobile.html")
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Invoice")), /*#__PURE__*/React.createElement("div", {
    className: "iv-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "iv-empty tall"
  }, /*#__PURE__*/React.createElement(DSIV.IconifyIcon, {
    name: "lucide:file-text",
    size: 32,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("p", null, "We couldn't find that invoice."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "iv-btn-ghost",
    onClick: () => goIV("InvoicesMobile.html")
  }, "Back to all invoices"))));
}
function InvoicesScreen() {
  const tier = PFI.getTier();
  const id = readInvoiceIdIV();
  if (!id) return /*#__PURE__*/React.createElement(InvoiceListIV, {
    tier: tier
  });
  const inv = PFI.findInvoice(tier, id);
  return inv ? /*#__PURE__*/React.createElement(InvoiceDetailIV, {
    tier: tier,
    inv: inv
  }) : /*#__PURE__*/React.createElement(InvoiceMissingIV, null);
}
function InvoicesMobileApp() {
  const mobile = useIsMobileIV();
  const scale = useDeviceScaleIV();
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
    }, /*#__PURE__*/React.createElement(InvoicesScreen, null));
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
  }, /*#__PURE__*/React.createElement(InvoicesScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(InvoicesMobileApp, null));
