/* ===========================================================================
   PROfinity — Payments (mobile) · iPhone 17 Pro Max
   Standalone drill-in reached from the sidebar drawer ("My Profile →
   Payments") and Account Settings. Holds the subscription (manage / cancel /
   renew), saved payment methods (add / set default / remove) and the five
   most recent invoices; "View all invoices" opens InvoicesMobile.html.
   Data + persistence live in payments-data.js (window.PFPayments).
   Composed on the bound DS bundle. Suffixed -PY to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStatePY, useEffect: useEffectPY, useRef: useRefPY } = React;
const DSPY = window.ProfinityDesignSystem_c2b5cc;
const PFP = window.PFPayments;

function goPY(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

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
const PY_TIER_CLASS = { Confidence: "confidence", Mastery: "mastery", Freedom: "freedom", "Inner Circle": "inner" };

const fmtPY = PFP.fmt;

/* ---- small shared bits ------------------------------------------------- */
function PYSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="py-sheet-wrap" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="py-scrim" aria-label="Close" onClick={onClose} />
      <div className="py-sheet">
        <span className="py-sheet-handle" />
        {title && <h3 className="py-sheet-ttl">{title}</h3>}
        {children}
      </div>
    </div>);
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
  const mm = +m[1], yy = 2000 + +m[2];
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  return yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1);
}

function PYAddCardSheet({ open, onClose, onSave, hasCards }) {
  const [number, setNumber] = useStatePY("");
  const [exp, setExp] = useStatePY("");
  const [cvc, setCvc] = useStatePY("");
  const [name, setName] = useStatePY("");
  const [makeDefault, setMakeDefault] = useStatePY(!hasCards);
  const [touched, setTouched] = useStatePY(false);

  useEffectPY(() => {
    if (open) { setNumber(""); setExp(""); setCvc(""); setName(""); setMakeDefault(!hasCards); setTouched(false); }
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
    onSave({ id: "card-" + Date.now(), brand, last4: digits.slice(-4), exp, name: name.trim(), primary: makeDefault });
  }

  return (
    <PYSheet open={open} onClose={onClose} title="Add payment method">
      <form className="py-form" onSubmit={submit} noValidate>
        <label className="py-field">
          <span className="py-label">Card number</span>
          <span className="py-input-wrap">
            <DSPY.IconifyIcon name="lucide:credit-card" size={18} color="var(--gray-500)" />
            <input className="py-input" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456"
              value={number} onChange={(e) => setNumber(formatCardNumberPY(e.target.value))} />
            {digits.length >= 1 && <span className="py-brand">{brand}</span>}
          </span>
          {touched && errs.number && <span className="py-err">{errs.number}</span>}
        </label>
        <div className="py-field-row">
          <label className="py-field">
            <span className="py-label">Expiry</span>
            <span className="py-input-wrap">
              <input className="py-input" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY"
                value={exp} onChange={(e) => setExp(formatExpiryPY(e.target.value))} />
            </span>
            {touched && errs.exp && <span className="py-err">{errs.exp}</span>}
          </label>
          <label className="py-field">
            <span className="py-label">CVC</span>
            <span className="py-input-wrap">
              <input className="py-input" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4}
                value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} />
              <DSPY.IconifyIcon name="lucide:lock" size={16} color="var(--gray-450)" />
            </span>
            {touched && errs.cvc && <span className="py-err">{errs.cvc}</span>}
          </label>
        </div>
        <label className="py-field">
          <span className="py-label">Name on card</span>
          <span className="py-input-wrap">
            <input className="py-input" autoComplete="cc-name" placeholder="Katy Wilson"
              value={name} onChange={(e) => setName(e.target.value)} />
          </span>
          {touched && errs.name && <span className="py-err">{errs.name}</span>}
        </label>
        <button type="button" className={"py-check" + (makeDefault ? " on" : "")} onClick={() => setMakeDefault(!makeDefault)} role="checkbox" aria-checked={makeDefault}>
          <span className="py-check-box">{makeDefault && <DSPY.IconifyIcon name="lucide:check" size={14} color="#fff" />}</span>
          Use as default payment method
        </button>
        <p className="py-secure"><DSPY.IconifyIcon name="lucide:lock" size={13} color="var(--gray-500)" />Card details are encrypted and stored securely.</p>
        <div className="py-sheet-foot">
          <button type="button" className="py-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className={"py-btn-fill" + (valid ? "" : " dim")}>Save card</button>
        </div>
      </form>
    </PYSheet>);
}

/* ---- card options sheet ------------------------------------------------ */
function PYCardOptionsSheet({ card, onClose, onDefault, onRemove }) {
  if (!card) return null;
  return (
    <PYSheet open onClose={onClose} title={card.brand + " ending " + card.last4}>
      <p className="py-sheet-p">Expires {card.exp}{card.name ? " · " + card.name : ""}</p>
      <div className="py-opts">
        {!card.primary &&
        <button type="button" className="py-opt" onClick={onDefault}>
          <DSPY.IconifyIcon name="lucide:star" size={20} color="var(--brand-navy)" />Set as default
        </button>}
        <button type="button" className={"py-opt danger" + (card.primary ? " dim" : "")} onClick={onRemove} disabled={card.primary}>
          <DSPY.IconifyIcon name="lucide:trash-2" size={20} color={card.primary ? "var(--gray-450)" : "var(--error)"} />
          {card.primary ? "Default card can't be removed" : "Remove card"}
        </button>
      </div>
      <div className="py-sheet-foot">
        <button type="button" className="py-btn-ghost" onClick={onClose}>Close</button>
      </div>
    </PYSheet>);
}

/* ---- subscription: manage / cancel / renew ----------------------------- */
function PYManageSheet({ open, onClose, tier, price, sub, onCancel, onRenew }) {
  const cancelled = sub.status === "cancelled";
  return (
    <PYSheet open={open} onClose={onClose} title="Manage subscription">
      <p className="py-sheet-p">
        <b>{tier} Path</b> · {fmtPY(price)} / month.{" "}
        {cancelled ? "Cancelled — your access ends on " + PFP.RENEWAL.long + "." : "Renews automatically on " + PFP.RENEWAL.long + "."}
      </p>
      <div className="py-opts">
        <button type="button" className="py-opt" onClick={() => goPY("MembershipTier.html")}>
          <DSPY.IconifyIcon name="lucide:gem" size={20} color="var(--brand-navy)" />Change plan
        </button>
        {cancelled ?
        <button type="button" className="py-opt" onClick={onRenew}>
          <DSPY.IconifyIcon name="lucide:rotate-ccw" size={20} color="var(--success)" />Renew subscription
        </button> :
        <button type="button" className="py-opt danger" onClick={onCancel}>
          <DSPY.IconifyIcon name="lucide:x-circle" size={20} color="var(--error)" />Cancel subscription
        </button>}
      </div>
      <div className="py-sheet-foot">
        <button type="button" className="py-btn-ghost" onClick={onClose}>Close</button>
      </div>
    </PYSheet>);
}

function PYCancelConfirmSheet({ open, onClose, tier, onConfirm }) {
  return (
    <PYSheet open={open} onClose={onClose} title="Cancel subscription?">
      <p className="py-sheet-p">
        You'll keep full <b>{tier} Path</b> access until <b>{PFP.RENEWAL.long}</b>. After that your channels, courses and community
        perks lock, and you won't be charged again. You can renew any time before then and nothing changes.
      </p>
      <ul className="py-lose">
        <li><DSPY.IconifyIcon name="lucide:x" size={16} color="var(--error)" />{tier} channel &amp; community feed</li>
        <li><DSPY.IconifyIcon name="lucide:x" size={16} color="var(--error)" />Included courses &amp; live sessions</li>
        <li><DSPY.IconifyIcon name="lucide:x" size={16} color="var(--error)" />Member points &amp; rewards progress</li>
      </ul>
      <div className="py-sheet-foot col">
        <button type="button" className="py-btn-fill" onClick={onClose}>Keep my subscription</button>
        <button type="button" className="py-btn-danger" onClick={onConfirm}>Cancel subscription</button>
      </div>
    </PYSheet>);
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

  function persist(list) { setMethods(list); PFP.saveMethods(list); }

  function addCard(card) {
    const list = card.primary ? methods.map((m) => ({ ...m, primary: false })) : methods.slice();
    list.push(card);
    persist(list);
    setAddOpen(false);
    showToast(card.brand + " •• " + card.last4 + " added" + (card.primary ? " and set as default" : ""));
  }
  function setDefault(card) {
    persist(methods.map((m) => ({ ...m, primary: m.id === card.id })));
    setOptCard(null);
    showToast(card.brand + " •• " + card.last4 + " is now your default");
  }
  function removeCard(card) {
    persist(methods.filter((m) => m.id !== card.id));
    setOptCard(null);
    showToast(card.brand + " •• " + card.last4 + " removed");
  }
  function cancelSub() {
    const next = { status: "cancelled", cancelledAt: new Date().toISOString() };
    setSub(next); PFP.saveSubscription(next);
    setConfirmOpen(false); setManageOpen(false);
    showToast("Subscription cancelled · access until " + PFP.RENEWAL.short);
  }
  function renewSub() {
    const next = { status: "active", renewedAt: new Date().toISOString() };
    setSub(next); PFP.saveSubscription(next);
    setManageOpen(false);
    showToast(tier + " Path renewed · next charge " + PFP.RENEWAL.short);
  }

  const primary = methods.find((m) => m.primary) || methods[0];

  return (
    <div className="py-screen" data-screen-label="Payments (mobile)">
      <header className="py-top">
        <button className="py-back" aria-label="Back" onClick={() => goPY("ProfileMobile.html")}>
          <DSPY.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>Payments</h1>
      </header>

      <div className="py-scroll">
        <h4 className="py-h first">Subscription</h4>
        <div className={"py-plan" + (tier ? " tier-" + PY_TIER_CLASS[tier] : " none") + (cancelled ? " cancelled" : "")}>
          <div className="py-plan-top">
            <img className="py-plan-logo" src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" draggable="false" />
            {tier && <span className={"py-plan-status" + (cancelled ? " cancelled" : "")}>{cancelled ? "Cancelled" : "Active"}</span>}
          </div>
          <div className="py-plan-mid">
            <span className="py-plan-name">{tier ? tier + " Path" : "No active plan"}</span>
            <span className="py-plan-member">{tier ? PFP.BILL_TO.name + " · Member since Oct 2025" : "Subscribe to unlock a channel"}</span>
          </div>
          <div className="py-plan-bot">
            <span className="py-plan-sub">
              {!tier ? "From " + fmtPY(PFP.PRICE.Confidence) + " / month" :
               <React.Fragment><b>{fmtPY(price)}</b> / month<i>·</i>{cancelled ? "access until " : "renews "}{PFP.RENEWAL.long}</React.Fragment>}
            </span>
            {tier ?
            <button type="button" className="py-plan-btn" onClick={() => setManageOpen(true)}>Manage</button> :
            <button type="button" className="py-plan-btn" onClick={() => goPY("MembershipTier.html")}>Subscribe</button>}
          </div>
        </div>

        {tier && (cancelled ?
        <div className="py-substate cancelled">
          <DSPY.IconifyIcon name="lucide:alert-circle" size={18} color="var(--error)" />
          <span className="py-substate-tx"><b>Cancelled.</b> You keep access until {PFP.RENEWAL.long}, then your plan ends.</span>
          <button type="button" className="py-substate-btn" onClick={renewSub}>Renew</button>
        </div> :
        <div className="py-substate">
          <DSPY.IconifyIcon name="lucide:check-circle-2" size={18} color="var(--success)" />
          <span className="py-substate-tx"><b>Active.</b> Next charge {fmtPY(price)} on {PFP.RENEWAL.short}{primary ? " to " + primary.brand + " •• " + primary.last4 : ""}.</span>
        </div>)}

        <h4 className="py-h">Payment methods</h4>
        <div className="py-cards">
          {methods.map((c) =>
          <div className={"py-card" + (c.primary ? " primary" : "")} key={c.id}>
              <span className="py-cardic"><DSPY.IconifyIcon name="lucide:credit-card" size={18} color="var(--brand-navy)" /></span>
              <div className="py-card-info">
                <span className="ti">{c.brand} ending {c.last4}</span>
                <span className="su">Expires {c.exp}</span>
              </div>
              {c.primary && <span className="py-pill">DEFAULT</span>}
              <button type="button" className="py-more" aria-label="Card options" onClick={() => setOptCard(c)}>
                <DSPY.IconifyIcon name="lucide:more-horizontal" size={20} color="var(--gray-450)" />
              </button>
            </div>
          )}
          <button type="button" className="py-add" onClick={() => setAddOpen(true)}>
            <DSPY.IconifyIcon name="lucide:plus" size={16} color="var(--brand-navy)" />Add payment method
          </button>
        </div>

        <h4 className="py-h">Recent payments</h4>
        <div className="py-list">
          {invoices.map((r) =>
          <button type="button" className="py-row" key={r.id} onClick={() => goPY("InvoicesMobile.html?id=" + r.id)}>
              <span className="py-date"><b>{r.d}</b><small>{r.m}</small></span>
              <div className="py-row-info">
                <span className="ti">{r.label}</span>
                <span className="su">{r.sub}</span>
              </div>
              <div className="py-amt">
                <span className={"n" + (r.status === "Refunded" ? " refund" : "")}>{r.status === "Refunded" ? "−" : ""}{fmtPY(r.amount)}</span>
                <span className={"st" + (r.status === "Refunded" ? " refund" : "")}>{r.status}</span>
              </div>
            </button>
          )}
        </div>
        <button className="py-showall" onClick={() => goPY("InvoicesMobile.html")}>View all invoices</button>
      </div>

      <PYAddCardSheet open={addOpen} onClose={() => setAddOpen(false)} onSave={addCard} hasCards={methods.length > 0} />
      <PYCardOptionsSheet card={optCard} onClose={() => setOptCard(null)} onDefault={() => setDefault(optCard)} onRemove={() => removeCard(optCard)} />
      {tier && <PYManageSheet open={manageOpen && !confirmOpen} onClose={() => setManageOpen(false)} tier={tier} price={price} sub={sub}
        onCancel={() => setConfirmOpen(true)} onRenew={renewSub} />}
      {tier && <PYCancelConfirmSheet open={confirmOpen} onClose={() => setConfirmOpen(false)} tier={tier} onConfirm={cancelSub} />}
      {toast && <div className="py-toast" role="status"><DSPY.IconifyIcon name="lucide:check" size={16} color="#fff" />{toast}</div>}
    </div>);
}

function PaymentsMobileApp() {
  const mobile = useIsMobilePY();
  const scale = useDeviceScalePY();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}><PaymentsScreen /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><PaymentsScreen /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<PaymentsMobileApp />);
