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
const { useState: useStateIV, useEffect: useEffectIV, useRef: useRefIV, useMemo: useMemoIV } = React;
const DSIV = window.ProfinityDesignSystem_c2b5cc;
const PFI = window.PFPayments;

function goIV(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

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
  function show(msg) { setToast(msg); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 2600); }
  useEffectIV(() => () => clearTimeout(timer.current), []);
  return [toast, show];
}

const fmtIV = PFI.fmt;
const IV_FILTERS = [
{ key: "all", label: "All" },
{ key: "Subscription", label: "Subscription" },
{ key: "Course", label: "Courses" },
{ key: "Event", label: "Events" },
{ key: "Refunded", label: "Refunded" }];

function readInvoiceIdIV() {
  try { return new URLSearchParams(window.location.search).get("id"); } catch (e) { return null; }
}

/* ---- list view --------------------------------------------------------- */
function InvoiceRowIV({ r, onOpen }) {
  const refund = r.status === "Refunded";
  return (
    <button type="button" className="iv-row" onClick={() => onOpen(r)}>
      <span className="iv-date"><b>{r.d}</b><small>{r.m}</small></span>
      <div className="iv-row-info">
        <span className="ti">{r.label}</span>
        <span className="su">{r.sub}</span>
      </div>
      <div className="iv-amt">
        <span className={"n" + (refund ? " refund" : "")}>{refund ? "−" : ""}{fmtIV(r.amount)}</span>
        <span className={"st" + (refund ? " refund" : "")}>{r.status}</span>
      </div>
      <DSIV.IconifyIcon name="lucide:chevron-right" size={18} color="var(--gray-400)" />
    </button>);
}

function InvoiceListIV({ tier }) {
  const [filter, setFilter] = useStateIV("all");
  const all = useMemoIV(() => PFI.invoicesFor(tier), [tier]);
  const rows = filter === "all" ? all : filter === "Refunded" ? all.filter((r) => r.status === "Refunded") : all.filter((r) => r.kind === filter);

  /* group by month heading */
  const groups = [];
  rows.forEach((r) => {
    const key = r.mLong + " " + r.y;
    const g = groups[groups.length - 1];
    if (g && g.key === key) g.rows.push(r); else groups.push({ key, rows: [r] });
  });

  function open(r) { goIV("InvoicesMobile.html?id=" + r.id); }

  return (
    <div className="iv-screen" data-screen-label="Invoices (mobile)">
      <header className="iv-top">
        <button className="iv-back" aria-label="Back" onClick={() => goIV("PaymentsMobile.html")}>
          <DSIV.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>Invoices</h1>
      </header>

      <div className="iv-scroll">
        <div className="iv-chips" role="tablist" aria-label="Filter invoices">
          {IV_FILTERS.map((f) =>
          <button type="button" key={f.key} role="tab" aria-selected={filter === f.key} className={"iv-chip" + (filter === f.key ? " on" : "")} onClick={() => setFilter(f.key)}>{f.label}</button>
          )}
        </div>

        {groups.length === 0 &&
        <div className="iv-empty">
          <DSIV.IconifyIcon name="lucide:file-text" size={28} color="var(--gray-400)" />
          <p>No invoices match this filter.</p>
        </div>}

        {groups.map((g) =>
        <section className="iv-group" key={g.key}>
          <h4 className="iv-group-h">{g.key}</h4>
          <div className="iv-list">
            {g.rows.map((r) => <InvoiceRowIV key={r.id} r={r} onOpen={open} />)}
          </div>
        </section>
        )}

        <p className="iv-foot-note">Need a VAT invoice or a correction? <a href="#" onClick={(e) => { e.preventDefault(); goIV("Messages.html"); }}>Message support</a>.</p>
      </div>
    </div>);
}

/* ---- detail view ------------------------------------------------------- */
function InvoiceDetailIV({ tier, inv }) {
  const [toast, showToast] = useToastIV();
  const refund = inv.status === "Refunded";
  const subtotal = inv.items.reduce((s, it) => s + it.amount, 0);
  const vat = Math.round(subtotal / 6 * 100) / 100; /* prices are VAT-inclusive at 20% */
  const net = Math.round((subtotal - vat) * 100) / 100;
  const bill = PFI.BILL_TO;

  return (
    <div className="iv-screen" data-screen-label="Invoice detail (mobile)">
      <header className="iv-top">
        <button className="iv-back" aria-label="Back to invoices" onClick={() => goIV("InvoicesMobile.html")}>
          <DSIV.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>Invoice</h1>
        <button className="iv-share" aria-label="Share invoice" onClick={() => showToast("Share link copied")}>
          <DSIV.IconifyIcon name="lucide:share-2" size={22} color="var(--gray-900)" />
        </button>
      </header>

      <div className="iv-scroll">
        <div className={"iv-hero" + (refund ? " refund" : "")}>
          <span className="iv-hero-ic"><DSIV.IconifyIcon name={inv.kind === "Subscription" ? "lucide:gem" : inv.kind === "Course" ? "lucide:graduation-cap" : "lucide:calendar"} size={22} color="#fff" /></span>
          <span className={"iv-status" + (refund ? " refund" : "")}>{inv.status}</span>
          <span className="iv-hero-amt">{refund ? "−" : ""}{fmtIV(inv.amount)}</span>
          <span className="iv-hero-label">{inv.label}</span>
          <span className="iv-hero-date">{inv.dateLong}</span>
        </div>

        <div className="iv-meta">
          <div className="iv-meta-row"><span className="l">Invoice number</span><span className="v mono">{inv.id}</span></div>
          <div className="iv-meta-row"><span className="l">Date</span><span className="v">{inv.dateLong}</span></div>
          <div className="iv-meta-row"><span className="l">Type</span><span className="v">{inv.kind}</span></div>
          <div className="iv-meta-row">
            <span className="l">Payment method</span>
            <span className="v iv-pm"><DSIV.IconifyIcon name="lucide:credit-card" size={16} color="var(--brand-navy)" />{inv.method.brand} •• {inv.method.last4}</span>
          </div>
          {refund && <div className="iv-meta-row"><span className="l">Refunded to</span><span className="v">{inv.method.brand} •• {inv.method.last4} · 3–5 working days</span></div>}
        </div>

        <h4 className="iv-h">Items</h4>
        <div className="iv-items">
          {inv.items.map((it, i) =>
          <div className="iv-item" key={i}>
            <div className="iv-item-info">
              <span className="ti">{it.name}</span>
              <span className="su">{it.detail}</span>
            </div>
            <span className="iv-item-amt">{fmtIV(it.amount)}</span>
          </div>
          )}
          <div className="iv-totals">
            <div className="iv-tot"><span>Subtotal (ex. VAT)</span><span>{fmtIV(net)}</span></div>
            <div className="iv-tot"><span>VAT (20%)</span><span>{fmtIV(vat)}</span></div>
            <div className="iv-tot grand"><span>{refund ? "Refunded" : "Total paid"}</span><span>{refund ? "−" : ""}{fmtIV(subtotal)}</span></div>
          </div>
        </div>

        <h4 className="iv-h">Billed to</h4>
        <div className="iv-billto">
          <span className="ti">{bill.name}</span>
          <span className="su">{bill.clinic}</span>
          <span className="su">{bill.address}</span>
          <span className="su">{bill.city}</span>
          <span className="su">{bill.email}</span>
        </div>

        <div className="iv-actions">
          <button type="button" className="iv-btn-fill" onClick={() => showToast("Invoice " + inv.id + " saved to Files")}>
            <DSIV.IconifyIcon name="lucide:download" size={18} color="#fff" />Download PDF
          </button>
          <button type="button" className="iv-btn-ghost" onClick={() => showToast("Receipt emailed to " + bill.email)}>
            <DSIV.IconifyIcon name="lucide:send" size={18} color="var(--brand-navy)" />Email receipt
          </button>
        </div>
        <p className="iv-foot-note">Something wrong with this invoice? <a href="#" onClick={(e) => { e.preventDefault(); goIV("Messages.html"); }}>Message support</a>.</p>
      </div>
      {toast && <div className="iv-toast" role="status"><DSIV.IconifyIcon name="lucide:check" size={16} color="#fff" />{toast}</div>}
    </div>);
}

function InvoiceMissingIV() {
  return (
    <div className="iv-screen" data-screen-label="Invoice not found (mobile)">
      <header className="iv-top">
        <button className="iv-back" aria-label="Back to invoices" onClick={() => goIV("InvoicesMobile.html")}>
          <DSIV.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>Invoice</h1>
      </header>
      <div className="iv-scroll">
        <div className="iv-empty tall">
          <DSIV.IconifyIcon name="lucide:file-text" size={32} color="var(--gray-400)" />
          <p>We couldn't find that invoice.</p>
          <button type="button" className="iv-btn-ghost" onClick={() => goIV("InvoicesMobile.html")}>Back to all invoices</button>
        </div>
      </div>
    </div>);
}

function InvoicesScreen() {
  const tier = PFI.getTier();
  const id = readInvoiceIdIV();
  if (!id) return <InvoiceListIV tier={tier} />;
  const inv = PFI.findInvoice(tier, id);
  return inv ? <InvoiceDetailIV tier={tier} inv={inv} /> : <InvoiceMissingIV />;
}

function InvoicesMobileApp() {
  const mobile = useIsMobileIV();
  const scale = useDeviceScaleIV();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}><InvoicesScreen /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><InvoicesScreen /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<InvoicesMobileApp />);
