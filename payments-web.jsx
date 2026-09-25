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
const { useState: useStatePYW, useEffect: useEffectPYW, useRef: useRefPYW, useMemo: useMemoPYW } = React;
const DSPYW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavPYW, IconifyIcon: IconPYW } = DSPYW;
const PFPW = window.PFPayments;

const ME_PYW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const PYW_TIER_CLASS = { Confidence: "confidence", Mastery: "mastery", Freedom: "freedom", "Inner Circle": "inner" };
const fmtPYW = PFPW.fmt;

function goPYW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigatePYW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
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

function PYWToast({ msg }) {
  if (!msg) return null;
  return <div className="pyw-toast" role="status"><IconPYW name="lucide:check" size={16} color="#fff" />{msg}</div>;
}

/* Centered dialog — the desktop stand-in for the mobile bottom sheet. */
function PYWModal({ open, onClose, title, children, width }) {
  useEffectPYW(() => {
    if (!open) return;
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="pyw-modal-wrap" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="pyw-scrim" aria-label="Close" onClick={onClose} />
      <div className="pyw-modal" style={width ? { maxWidth: width } : null}>
        <header className="pyw-modal-head">
          <h3>{title}</h3>
          <button type="button" className="pyw-modal-x" aria-label="Close" onClick={onClose}>
            <IconPYW name="lucide:x" size={18} color="var(--gray-500)" />
          </button>
        </header>
        {children}
      </div>
    </div>);
}

function PYWShell({ label, title, lede, crumbs, back, children, wide }) {
  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavPYW user={ME_PYW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigatePYW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      <div className={"nsw-page pyw-page" + (wide ? " wide" : "")} data-screen-label={label}>
        <div className="nsw-head-row">
          <button type="button" className="nsw-back" aria-label="Back" onClick={() => goPYW(back)}>
            <IconPYW name="lucide:arrow-left" size={18} color="var(--text-primary)" />
          </button>
          <div className="nsw-head-titles">
            <h1>{title}</h1>
            <p>{lede}</p>
          </div>
        </div>
        <div className="nsw-crumb">
          <a onClick={() => goPYW("NewsfeedWeb.html")}>Home</a> / <a onClick={() => goPYW("AccountSettingsWeb.html")}>Settings</a>
          {crumbs.map((c, i) => <React.Fragment key={i}> / {c.href ? <a onClick={() => goPYW(c.href)}>{c.label}</a> : c.label}</React.Fragment>)}
        </div>
        {children}
      </div>
    </div>);
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
  const mm = +m[1], yy = 2000 + +m[2];
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  return yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1);
}

function PYWAddCardModal({ open, onClose, onSave, hasCards }) {
  const [number, setNumber] = useStatePYW("");
  const [exp, setExp] = useStatePYW("");
  const [cvc, setCvc] = useStatePYW("");
  const [name, setName] = useStatePYW("");
  const [makeDefault, setMakeDefault] = useStatePYW(!hasCards);
  const [touched, setTouched] = useStatePYW(false);

  useEffectPYW(() => {
    if (open) { setNumber(""); setExp(""); setCvc(""); setName(""); setMakeDefault(!hasCards); setTouched(false); }
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
    onSave({ id: "card-" + Date.now(), brand, last4: digits.slice(-4), exp, name: name.trim(), primary: makeDefault });
  }

  return (
    <PYWModal open={open} onClose={onClose} title="Add payment method">
      <form className="pyw-form" onSubmit={submit} noValidate>
        <label className="pyw-field">
          <span className="pyw-label">Card number</span>
          <span className="pyw-input-wrap">
            <IconPYW name="lucide:credit-card" size={18} color="var(--gray-500)" />
            <input className="pyw-input" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456"
              value={number} onChange={(e) => setNumber(formatCardNumberPYW(e.target.value))} autoFocus />
            {digits.length >= 1 && <span className="pyw-brand">{brand}</span>}
          </span>
          {touched && errs.number && <span className="pyw-err">{errs.number}</span>}
        </label>
        <div className="pyw-field-row">
          <label className="pyw-field">
            <span className="pyw-label">Expiry</span>
            <span className="pyw-input-wrap">
              <input className="pyw-input" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY"
                value={exp} onChange={(e) => setExp(formatExpiryPYW(e.target.value))} />
            </span>
            {touched && errs.exp && <span className="pyw-err">{errs.exp}</span>}
          </label>
          <label className="pyw-field">
            <span className="pyw-label">CVC</span>
            <span className="pyw-input-wrap">
              <input className="pyw-input" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4}
                value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} />
              <IconPYW name="lucide:lock" size={16} color="var(--gray-450)" />
            </span>
            {touched && errs.cvc && <span className="pyw-err">{errs.cvc}</span>}
          </label>
        </div>
        <label className="pyw-field">
          <span className="pyw-label">Name on card</span>
          <span className="pyw-input-wrap">
            <input className="pyw-input" autoComplete="cc-name" placeholder="Katy Wilson"
              value={name} onChange={(e) => setName(e.target.value)} />
          </span>
          {touched && errs.name && <span className="pyw-err">{errs.name}</span>}
        </label>
        <button type="button" className={"pyw-check" + (makeDefault ? " on" : "")} onClick={() => setMakeDefault(!makeDefault)} role="checkbox" aria-checked={makeDefault}>
          <span className="pyw-check-box">{makeDefault && <IconPYW name="lucide:check" size={14} color="#fff" />}</span>
          Use as default payment method
        </button>
        <p className="pyw-secure"><IconPYW name="lucide:lock" size={13} color="var(--gray-500)" />Card details are encrypted and stored securely.</p>
        <div className="pyw-modal-foot">
          <button type="button" className="nsw-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className={"nsw-btn-primary" + (valid ? "" : " dim")}>Save card</button>
        </div>
      </form>
    </PYWModal>);
}

/* ---- card options modal ------------------------------------------------ */
function PYWCardOptionsModal({ card, onClose, onDefault, onRemove }) {
  if (!card) return null;
  return (
    <PYWModal open onClose={onClose} title={card.brand + " ending " + card.last4} width={400}>
      <p className="pyw-modal-p">Expires {card.exp}{card.name ? " · " + card.name : ""}</p>
      <div className="pyw-opts">
        {!card.primary &&
        <button type="button" className="pyw-opt" onClick={onDefault}>
          <IconPYW name="lucide:star" size={20} color="var(--brand-navy)" />Set as default
        </button>}
        <button type="button" className={"pyw-opt danger" + (card.primary ? " dim" : "")} onClick={onRemove} disabled={card.primary}>
          <IconPYW name="lucide:trash-2" size={20} color={card.primary ? "var(--gray-450)" : "var(--error)"} />
          {card.primary ? "Default card can't be removed" : "Remove card"}
        </button>
      </div>
      <div className="pyw-modal-foot">
        <button type="button" className="nsw-btn-secondary" onClick={onClose}>Close</button>
      </div>
    </PYWModal>);
}

/* ---- subscription: manage / cancel / renew ----------------------------- */
function PYWManageModal({ open, onClose, tier, price, sub, onCancel, onRenew }) {
  const cancelled = sub.status === "cancelled";
  return (
    <PYWModal open={open} onClose={onClose} title="Manage subscription" width={420}>
      <p className="pyw-modal-p">
        <b>{tier} Path</b> · {fmtPYW(price)} / month.{" "}
        {cancelled ? "Cancelled — your access ends on " + PFPW.RENEWAL.long + "." : "Renews automatically on " + PFPW.RENEWAL.long + "."}
      </p>
      <div className="pyw-opts">
        <button type="button" className="pyw-opt" onClick={() => goPYW("MembershipTier.html")}>
          <IconPYW name="lucide:gem" size={20} color="var(--brand-navy)" />Change plan
        </button>
        {cancelled ?
        <button type="button" className="pyw-opt" onClick={onRenew}>
          <IconPYW name="lucide:rotate-ccw" size={20} color="var(--success)" />Renew subscription
        </button> :
        <button type="button" className="pyw-opt danger" onClick={onCancel}>
          <IconPYW name="lucide:x-circle" size={20} color="var(--error)" />Cancel subscription
        </button>}
      </div>
      <div className="pyw-modal-foot">
        <button type="button" className="nsw-btn-secondary" onClick={onClose}>Close</button>
      </div>
    </PYWModal>);
}

function PYWCancelConfirmModal({ open, onClose, tier, onConfirm }) {
  return (
    <PYWModal open={open} onClose={onClose} title="Cancel subscription?" width={440}>
      <p className="pyw-modal-p">
        You'll keep full <b>{tier} Path</b> access until <b>{PFPW.RENEWAL.long}</b>. After that your channels, courses and community
        perks lock, and you won't be charged again. You can renew any time before then and nothing changes.
      </p>
      <ul className="pyw-lose">
        <li><IconPYW name="lucide:x" size={16} color="var(--error)" />{tier} channel &amp; community feed</li>
        <li><IconPYW name="lucide:x" size={16} color="var(--error)" />Included courses &amp; live sessions</li>
        <li><IconPYW name="lucide:x" size={16} color="var(--error)" />Member points &amp; rewards progress</li>
      </ul>
      <div className="pyw-modal-foot">
        <button type="button" className="pyw-btn-danger" onClick={onConfirm}>Cancel subscription</button>
        <button type="button" className="nsw-btn-primary" onClick={onClose}>Keep my subscription</button>
      </div>
    </PYWModal>);
}

/* ---- invoice row (shared by Payments "Recent" + Invoices list) --------- */
function PYWInvoiceRow({ r, onOpen, chevron }) {
  const refund = r.status === "Refunded";
  return (
    <button type="button" className="pyw-row" onClick={() => onOpen(r)}>
      <span className="pyw-date"><b>{r.d}</b><small>{r.m}</small></span>
      <div className="pyw-row-info">
        <span className="ti">{r.label}</span>
        <span className="su">{r.sub}</span>
      </div>
      <div className="pyw-amt">
        <span className={"n" + (refund ? " refund" : "")}>{refund ? "−" : ""}{fmtPYW(r.amount)}</span>
        <span className={"st" + (refund ? " refund" : "")}>{r.status}</span>
      </div>
      {chevron && <IconPYW name="lucide:chevron-right" size={18} color="var(--gray-400)" />}
    </button>);
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

  function persist(list) { setMethods(list); PFPW.saveMethods(list); }

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
    setSub(next); PFPW.saveSubscription(next);
    setConfirmOpen(false); setManageOpen(false);
    showToast("Subscription cancelled · access until " + PFPW.RENEWAL.short);
  }
  function renewSub() {
    const next = { status: "active", renewedAt: new Date().toISOString() };
    setSub(next); PFPW.saveSubscription(next);
    setManageOpen(false);
    showToast(tier + " Path renewed · next charge " + PFPW.RENEWAL.short);
  }

  const primary = methods.find((m) => m.primary) || methods[0];

  return (
    <PYWShell label="Payments (web)" title="Payments" lede="Manage your subscription, saved cards and invoices."
      crumbs={[{ label: "Payments" }]} back="AccountSettingsWeb.html">

      {/* ---- subscription ---- */}
      <section className="nsw-card pyw-sub-card">
        <header className="nsw-card-head"><h2>Subscription</h2></header>
        <div className="pyw-sub">
          <div className={"pyw-plan" + (tier ? " tier-" + PYW_TIER_CLASS[tier] : " none") + (cancelled ? " cancelled" : "")}>
            <div className="pyw-plan-top">
              <img className="pyw-plan-logo" src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" draggable="false" />
              {tier && <span className={"pyw-plan-status" + (cancelled ? " cancelled" : "")}>{cancelled ? "Cancelled" : "Active"}</span>}
            </div>
            <div className="pyw-plan-mid">
              <span className="pyw-plan-name">{tier ? tier + " Path" : "No active plan"}</span>
              <span className="pyw-plan-member">{tier ? PFPW.BILL_TO.name + " · Member since Oct 2025" : "Subscribe to unlock a channel"}</span>
            </div>
            <div className="pyw-plan-bot">
              <span className="pyw-plan-sub">
                {!tier ? "From " + fmtPYW(PFPW.PRICE.Confidence) + " / month" :
                 <React.Fragment><b>{fmtPYW(price)}</b> / month<i>·</i>{cancelled ? "access until " : "renews "}{PFPW.RENEWAL.long}</React.Fragment>}
              </span>
            </div>
          </div>

          <div className="pyw-sub-side">
            {tier ? (cancelled ?
            <div className="pyw-substate cancelled">
              <IconPYW name="lucide:alert-circle" size={18} color="var(--error)" />
              <span className="pyw-substate-tx"><b>Cancelled.</b> You keep access until {PFPW.RENEWAL.long}, then your plan ends.</span>
            </div> :
            <div className="pyw-substate">
              <IconPYW name="lucide:check-circle-2" size={18} color="var(--success)" />
              <span className="pyw-substate-tx"><b>Active.</b> Next charge {fmtPYW(price)} on {PFPW.RENEWAL.short}{primary ? " to " + primary.brand + " •• " + primary.last4 : ""}.</span>
            </div>) :
            <div className="pyw-substate">
              <IconPYW name="lucide:info" size={18} color="var(--brand-navy)" />
              <span className="pyw-substate-tx"><b>No active plan.</b> Pick a path to unlock channels, courses and member rewards.</span>
            </div>}

            <dl className="pyw-facts">
              <div><dt>Plan</dt><dd>{tier ? tier + " Path" : "—"}</dd></div>
              <div><dt>Billing</dt><dd>{tier ? fmtPYW(price) + " / month" : "—"}</dd></div>
              <div><dt>{cancelled ? "Access until" : "Next renewal"}</dt><dd>{tier ? PFPW.RENEWAL.long : "—"}</dd></div>
              <div><dt>Payment method</dt><dd>{primary ? primary.brand + " •• " + primary.last4 : "—"}</dd></div>
            </dl>

            <div className="pyw-sub-actions">
              {tier ? (
                <React.Fragment>
                  <button type="button" className="nsw-btn-primary" onClick={() => setManageOpen(true)}>Manage subscription</button>
                  {cancelled ?
                    <button type="button" className="nsw-btn-secondary" onClick={renewSub}>Renew now</button> :
                    <button type="button" className="nsw-btn-secondary" onClick={() => goPYW("MembershipTier.html")}>Change plan</button>}
                </React.Fragment>
              ) : (
                <button type="button" className="nsw-btn-primary" onClick={() => goPYW("MembershipTier.html")}>Subscribe</button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="pyw-two">
        {/* ---- payment methods ---- */}
        <section className="nsw-card">
          <header className="nsw-card-head pyw-card-head">
            <h2>Payment methods</h2>
            <button type="button" className="pyw-link-btn" onClick={() => setAddOpen(true)}>
              <IconPYW name="lucide:plus" size={15} color="var(--brand-navy)" />Add card
            </button>
          </header>
          <div className="pyw-cards">
            {methods.map((c) =>
            <div className={"pyw-card" + (c.primary ? " primary" : "")} key={c.id}>
              <span className="pyw-cardic"><IconPYW name="lucide:credit-card" size={18} color="var(--brand-navy)" /></span>
              <div className="pyw-card-info">
                <span className="ti">{c.brand} ending {c.last4}</span>
                <span className="su">Expires {c.exp}{c.name ? " · " + c.name : ""}</span>
              </div>
              {c.primary && <span className="pyw-pill">DEFAULT</span>}
              <button type="button" className="pyw-more" aria-label="Card options" onClick={() => setOptCard(c)}>
                <IconPYW name="lucide:more-horizontal" size={20} color="var(--gray-450)" />
              </button>
            </div>
            )}
            <button type="button" className="pyw-add" onClick={() => setAddOpen(true)}>
              <IconPYW name="lucide:plus" size={16} color="var(--brand-navy)" />Add payment method
            </button>
          </div>
        </section>

        {/* ---- recent payments ---- */}
        <section className="nsw-card">
          <header className="nsw-card-head pyw-card-head">
            <h2>Recent payments</h2>
            <button type="button" className="pyw-link-btn" onClick={() => goPYW("InvoicesWeb.html")}>View all</button>
          </header>
          <div className="pyw-list">
            {invoices.map((r) => <PYWInvoiceRow key={r.id} r={r} onOpen={(x) => goPYW("InvoicesWeb.html?id=" + x.id)} />)}
          </div>
          <button type="button" className="pyw-showall" onClick={() => goPYW("InvoicesWeb.html")}>View all invoices</button>
        </section>
      </div>

      <PYWAddCardModal open={addOpen} onClose={() => setAddOpen(false)} onSave={addCard} hasCards={methods.length > 0} />
      <PYWCardOptionsModal card={optCard} onClose={() => setOptCard(null)} onDefault={() => setDefault(optCard)} onRemove={() => removeCard(optCard)} />
      {tier && <PYWManageModal open={manageOpen && !confirmOpen} onClose={() => setManageOpen(false)} tier={tier} price={price} sub={sub}
        onCancel={() => setConfirmOpen(true)} onRenew={renewSub} />}
      {tier && <PYWCancelConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} tier={tier} onConfirm={cancelSub} />}
      <PYWToast msg={toast} />
    </PYWShell>);
}

/* =========================================================================
   INVOICES PAGE (list + ?id= detail)
   ========================================================================= */
const IVW_FILTERS = [
  { key: "all", label: "All" },
  { key: "Subscription", label: "Subscription" },
  { key: "Course", label: "Courses" },
  { key: "Event", label: "Events" },
  { key: "Refunded", label: "Refunded" }];

function readInvoiceIdPYW() {
  try { return new URLSearchParams(window.location.search).get("id"); } catch (e) { return null; }
}

function InvoiceListWeb({ tier }) {
  const [filter, setFilter] = useStatePYW("all");
  const all = useMemoPYW(() => PFPW.invoicesFor(tier), [tier]);
  const rows = filter === "all" ? all : filter === "Refunded" ? all.filter((r) => r.status === "Refunded") : all.filter((r) => r.kind === filter);

  const groups = [];
  rows.forEach((r) => {
    const key = r.mLong + " " + r.y;
    const g = groups[groups.length - 1];
    if (g && g.key === key) g.rows.push(r); else groups.push({ key, rows: [r] });
  });

  return (
    <PYWShell label="Invoices (web)" title="Invoices" lede="Every subscription charge, course and event purchase on your account."
      crumbs={[{ label: "Payments", href: "PaymentsWeb.html" }, { label: "Invoices" }]} back="PaymentsWeb.html">
      <section className="nsw-card">
        <div className="ivw-chips" role="tablist" aria-label="Filter invoices">
          {IVW_FILTERS.map((f) =>
          <button type="button" key={f.key} role="tab" aria-selected={filter === f.key} className={"ivw-chip" + (filter === f.key ? " on" : "")} onClick={() => setFilter(f.key)}>{f.label}</button>
          )}
        </div>

        {groups.length === 0 &&
        <div className="ivw-empty">
          <IconPYW name="lucide:file-text" size={28} color="var(--gray-400)" />
          <p>No invoices match this filter.</p>
        </div>}

        {groups.map((g) =>
        <section className="ivw-group" key={g.key}>
          <h4 className="ivw-group-h">{g.key}</h4>
          <div className="pyw-list">
            {g.rows.map((r) => <PYWInvoiceRow key={r.id} r={r} chevron onOpen={(x) => goPYW("InvoicesWeb.html?id=" + x.id)} />)}
          </div>
        </section>
        )}
      </section>
      <p className="ivw-foot-note">Need a VAT invoice or a correction? <a href="#" onClick={(e) => { e.preventDefault(); goPYW("ChatSupportWeb.html"); }}>Message support</a>.</p>
    </PYWShell>);
}

function InvoiceDetailWeb({ inv }) {
  const [toast, showToast] = usePYWToast();
  const refund = inv.status === "Refunded";
  const subtotal = inv.items.reduce((s, it) => s + it.amount, 0);
  const vat = Math.round(subtotal / 6 * 100) / 100; /* prices are VAT-inclusive at 20% */
  const net = Math.round((subtotal - vat) * 100) / 100;
  const bill = PFPW.BILL_TO;
  const icon = inv.kind === "Subscription" ? "lucide:gem" : inv.kind === "Course" ? "lucide:graduation-cap" : "lucide:calendar";

  return (
    <PYWShell label="Invoice detail (web)" title={"Invoice " + inv.id} lede={inv.label + " · " + inv.dateLong}
      crumbs={[{ label: "Payments", href: "PaymentsWeb.html" }, { label: "Invoices", href: "InvoicesWeb.html" }, { label: inv.id }]} back="InvoicesWeb.html" wide>
      <div className="ivw-detail">
        <div className="ivw-main">
          <section className="nsw-card">
            <div className={"ivw-hero" + (refund ? " refund" : "")}>
              <span className="ivw-hero-ic"><IconPYW name={icon} size={22} color="#fff" /></span>
              <div className="ivw-hero-copy">
                <span className="ivw-hero-label">{inv.label}</span>
                <span className="ivw-hero-date">{inv.dateLong} · {inv.kind}</span>
              </div>
              <div className="ivw-hero-right">
                <span className={"ivw-status" + (refund ? " refund" : "")}>{inv.status}</span>
                <span className="ivw-hero-amt">{refund ? "−" : ""}{fmtPYW(inv.amount)}</span>
              </div>
            </div>

            <div className="ivw-items">
              <div className="ivw-item head"><span>Item</span><span>Amount</span></div>
              {inv.items.map((it, i) =>
              <div className="ivw-item" key={i}>
                <div className="ivw-item-info">
                  <span className="ti">{it.name}</span>
                  <span className="su">{it.detail}</span>
                </div>
                <span className="ivw-item-amt">{fmtPYW(it.amount)}</span>
              </div>
              )}
              <div className="ivw-totals">
                <div className="ivw-tot"><span>Subtotal (ex. VAT)</span><span>{fmtPYW(net)}</span></div>
                <div className="ivw-tot"><span>VAT (20%)</span><span>{fmtPYW(vat)}</span></div>
                <div className="ivw-tot grand"><span>{refund ? "Refunded" : "Total paid"}</span><span>{refund ? "−" : ""}{fmtPYW(subtotal)}</span></div>
              </div>
            </div>
          </section>
          <p className="ivw-foot-note left">Something wrong with this invoice? <a href="#" onClick={(e) => { e.preventDefault(); goPYW("ChatSupportWeb.html"); }}>Message support</a>.</p>
        </div>

        <aside className="ivw-aside">
          <section className="nsw-card">
            <header className="nsw-card-head"><h2>Details</h2></header>
            <div className="ivw-meta">
              <div className="ivw-meta-row"><span className="l">Invoice number</span><span className="v mono">{inv.id}</span></div>
              <div className="ivw-meta-row"><span className="l">Date</span><span className="v">{inv.dateLong}</span></div>
              <div className="ivw-meta-row"><span className="l">Type</span><span className="v">{inv.kind}</span></div>
              <div className="ivw-meta-row">
                <span className="l">Payment method</span>
                <span className="v ivw-pm"><IconPYW name="lucide:credit-card" size={16} color="var(--brand-navy)" />{inv.method.brand} •• {inv.method.last4}</span>
              </div>
              {refund && <div className="ivw-meta-row wrap"><span className="l">Refunded to</span><span className="v">{inv.method.brand} •• {inv.method.last4} · 3–5 working days</span></div>}
            </div>
          </section>

          <section className="nsw-card">
            <header className="nsw-card-head"><h2>Billed to</h2></header>
            <div className="ivw-billto">
              <span className="ti">{bill.name}</span>
              <span className="su">{bill.clinic}</span>
              <span className="su">{bill.address}</span>
              <span className="su">{bill.city}</span>
              <span className="su">{bill.email}</span>
            </div>
          </section>

          <div className="ivw-actions">
            <button type="button" className="nsw-btn-primary ivw-btn" onClick={() => showToast("Invoice " + inv.id + " downloaded")}>
              <IconPYW name="lucide:download" size={17} color="#fff" />Download PDF
            </button>
            <button type="button" className="nsw-btn-secondary ivw-btn" onClick={() => showToast("Receipt emailed to " + bill.email)}>
              <IconPYW name="lucide:send" size={17} color="var(--brand-navy)" />Email receipt
            </button>
          </div>
        </aside>
      </div>
      <PYWToast msg={toast} />
    </PYWShell>);
}

function InvoiceMissingWeb() {
  return (
    <PYWShell label="Invoice not found (web)" title="Invoice" lede="We couldn't find that invoice."
      crumbs={[{ label: "Payments", href: "PaymentsWeb.html" }, { label: "Invoices", href: "InvoicesWeb.html" }]} back="InvoicesWeb.html">
      <section className="nsw-card">
        <div className="ivw-empty tall">
          <IconPYW name="lucide:file-text" size={32} color="var(--gray-400)" />
          <p>We couldn't find that invoice.</p>
          <button type="button" className="nsw-btn-secondary" onClick={() => goPYW("InvoicesWeb.html")}>Back to all invoices</button>
        </div>
      </section>
    </PYWShell>);
}

function InvoicesWeb() {
  const tier = PFPW.getTier();
  const id = readInvoiceIdPYW();
  if (!id) return <InvoiceListWeb tier={tier} />;
  const inv = PFPW.findInvoice(tier, id);
  return inv ? <InvoiceDetailWeb inv={inv} /> : <InvoiceMissingWeb />;
}

/* ---- mount ------------------------------------------------------------- */
const PYW_PAGE = window.PF_PAY_PAGE === "invoices" ? InvoicesWeb : PaymentsWeb;
ReactDOM.createRoot(document.getElementById("pf-root")).render(React.createElement(PYW_PAGE));
