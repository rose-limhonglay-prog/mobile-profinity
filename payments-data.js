/* ===========================================================================
   PROfinity — shared payments mock data (plain JS, no compile step).
   Loaded by PaymentsMobile.html and InvoicesMobile.html so both pages read
   the same member tier, saved cards and invoice history. Cards persist in
   localStorage (pf-payment-methods) so "Add payment method" survives reloads;
   invoices are generated from the tier so subscription rows follow the plan.
   =========================================================================== */
(function () {
  var TIER_KEY = "pf-subscription-tier";
  var METHODS_KEY = "pf-payment-methods";
  var DISPLAY = { confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", inner: "Inner Circle" };
  var PRICE = { Confidence: 97, Mastery: 397, Freedom: 747, "Inner Circle": 1497 };
  var MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var DEFAULT_METHODS = [
    { id: "visa-4242", brand: "Visa", last4: "4242", exp: "08/28", name: "Katy Wilson", primary: true },
    { id: "mc-8810", brand: "Mastercard", last4: "8810", exp: "11/27", name: "Katy Wilson", primary: false }];

  function getTier() {
    var key = "free";
    try { key = localStorage.getItem(TIER_KEY) || "free"; } catch (e) {}
    return DISPLAY[key] || null;
  }
  function getMethods() {
    try {
      var v = JSON.parse(localStorage.getItem(METHODS_KEY));
      if (Array.isArray(v) && v.length) return v;
    } catch (e) {}
    return DEFAULT_METHODS.map(function (m) { return Object.assign({}, m); });
  }
  function saveMethods(list) {
    try { localStorage.setItem(METHODS_KEY, JSON.stringify(list)); } catch (e) {}
  }
  /* Subscription lifecycle — active by default; "cancelled" keeps access until
     the current period ends (renewal date) and can be renewed any time. */
  var SUB_KEY = "pf-subscription-status";
  var RENEWAL = { iso: "2026-10-01", long: "01 Oct 2026", short: "01 Oct" };
  function getSubscription() {
    try {
      var v = JSON.parse(localStorage.getItem(SUB_KEY));
      if (v && (v.status === "active" || v.status === "cancelled")) return v;
    } catch (e) {}
    return { status: "active" };
  }
  function saveSubscription(v) {
    try { localStorage.setItem(SUB_KEY, JSON.stringify(v)); } catch (e) {}
  }
  function brandFor(digits) {
    if (/^4/.test(digits)) return "Visa";
    if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "Amex";
    if (/^6/.test(digits)) return "Discover";
    return "Card";
  }
  function fmt(n) { return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }

  /* Invoice history: 12 monthly subscription charges on the 1st (Sep 2026
     back to Oct 2025) plus fixed one-off course / event purchases. */
  function invoicesFor(tier) {
    var planTier = tier || "Confidence";
    var planAmt = PRICE[planTier];
    var list = [];
    var y = 2026, m = 8; /* September 2026 */
    for (var i = 0; i < 12; i++) {
      list.push(mk(y, m, 1, planTier + " Path — monthly", "Subscription", planAmt, "Paid", "visa-4242",
        [{ name: planTier + " Path membership", detail: MONTHS_LONG[m] + " " + y, amount: planAmt }]));
      m--; if (m < 0) { m = 11; y--; }
    }
    list.push(mk(2026, 7, 18, "Lip Filler Techniques", "Course", 249, "Paid", "visa-4242",
      [{ name: "Lip Filler Techniques", detail: "Self-paced course · lifetime access", amount: 249 }]));
    list.push(mk(2026, 6, 22, "Confidence Masterclass ticket", "Event", 49, "Refunded", "mc-8810",
      [{ name: "Confidence Masterclass", detail: "Live event · 5 Jul 2026, 6:00 PM", amount: 49 }]));
    list.push(mk(2026, 4, 5, "Advanced Botox Masterclass", "Course", 299, "Paid", "visa-4242",
      [{ name: "Advanced Botox Masterclass", detail: "Self-paced course · lifetime access", amount: 299 }]));
    list.push(mk(2026, 2, 12, "Business Growth Workshop ticket", "Event", 29, "Paid", "mc-8810",
      [{ name: "Business Growth Workshop", detail: "Live event · 12 Mar 2026, 7:00 PM", amount: 29 }]));
    list.push(mk(2025, 11, 3, "Consultation Confidence Toolkit", "Course", 149, "Paid", "visa-4242",
      [{ name: "Consultation Confidence Toolkit", detail: "Self-paced course · lifetime access", amount: 149 }]));
    list.sort(function (a, b) { return b.ts - a.ts; });
    return list;
  }
  function mk(y, m, d, label, kind, amount, status, methodId, items) {
    var method = DEFAULT_METHODS.filter(function (x) { return x.id === methodId; })[0] || DEFAULT_METHODS[0];
    var mm = String(m + 1).padStart(2, "0"), dd = String(d).padStart(2, "0");
    return {
      id: "INV-" + y + mm + dd + "-" + (kind === "Subscription" ? "S" : kind === "Course" ? "C" : "E") + String(amount).padStart(4, "0"),
      ts: new Date(y, m, d).getTime(),
      y: y, m: MONTHS[m], mLong: MONTHS_LONG[m], d: dd,
      dateLong: dd + " " + MONTHS_LONG[m] + " " + y,
      label: label, kind: kind, amount: amount, status: status,
      sub: (kind === "Subscription" ? "" : kind + " · ") + method.brand + " •• " + method.last4,
      method: method,
      items: items
    };
  }
  function findInvoice(tier, id) {
    return invoicesFor(tier).filter(function (x) { return x.id === id; })[0] || null;
  }

  window.PFPayments = { PRICE: PRICE, RENEWAL: RENEWAL, getTier: getTier, getMethods: getMethods, saveMethods: saveMethods,
    getSubscription: getSubscription, saveSubscription: saveSubscription,
    brandFor: brandFor, fmt: fmt, invoicesFor: invoicesFor, findInvoice: findInvoice,
    BILL_TO: { name: "Katy Wilson", clinic: "Allcare Medical", address: "132 My Street, Kingston", city: "London, United Kingdom", email: "katy.wilson@allcaremedical.co.uk" } };
})();
