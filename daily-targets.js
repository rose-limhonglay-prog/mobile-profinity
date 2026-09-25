/* ===========================================================================
   PROfinity — Today's Targets daily picks + funnel tracking
   Plain script (no React) exposing window.PFDailyTargets. Loaded on the
   Profile pages (where the Today's Targets card renders), both course
   checkouts (purchase attribution) and Admin Analytics (funnel readout).

   Product rule (user, 2026-09-22): every day's targets must include exactly
   one FREE item (a downloadable PDF from the free library) and one PAID CTA
   (buy a course). Both refresh daily and the feature tracks the usage funnel
   (shown → tapped → completed) and the revenue it drives.

   Storage
     pf-daily-picks        {date, free:{...,done}, paid:{...,purchased}}
                           — today's pair; a new date rebuilds it
     pf-targets-analytics  {days:{"YYYY-MM-DD":{free:{impressions,taps,downloads},
                                                 paid:{impressions,taps,checkouts,purchases,revenue}}},
                            events:[{ts,date,kind,stage,id,amount}], (last 300)}
     pf-targets-attrib     {slug,id,date,ts} last-touch attribution written when
                           the paid CTA is tapped; a purchase of that slug in
                           the next 24h counts as target-driven revenue

   Selection is deterministic per calendar day (day index mod pool size), so
   every device shows the same pair on a given date. Paid picks skip courses
   the member already owns (purchased or included in their tier).
   =========================================================================== */
(function () {
  var T = window.PFDailyTargets = window.PFDailyTargets || {};
  var PICKS_KEY = "pf-daily-picks";
  var ANALYTICS_KEY = "pf-targets-analytics";
  var ATTRIB_KEY = "pf-targets-attrib";
  var ATTRIB_TTL_MS = 24 * 60 * 60 * 1000;
  var EVENT_CAP = 300;

  T.POINTS = { free: 50, paid: 150 };

  /* ---------------------------------------------------------------- pools -- */
  /* Free PDFs — the downloadable subset of the Free Resources library
     (learning-shared.js P.FREE_RESOURCES, kind Guide/Checklist/Protocol). */
  T.FREE_ITEMS = [
    { id: "diagnosing-complications", title: "Diagnosing Complications: 7 Steps to Get Great Advice Fast", pages: 6, blurb: "Write a short, high-impact case summary that gets you useful advice quickly." },
    { id: "aspirating-results", title: "Aspirating Experiment Test Results", pages: 4, blurb: "How long a positive aspirate really takes, by needle and product." },
    { id: "prepare-botox", title: "Prepare BOTOX: Step-by-Step Guide", pages: 8, blurb: "A beautifully presented step-by-step preparation guide." },
    { id: "five-steps-business", title: "5 Steps to Create a Successful Aesthetics Business", pages: 10, blurb: "Thinking about your own aesthetics business? Start with these five steps." },
    { id: "bruising-checklist", title: "Bruising Checklist: Prevent & Minimise Bruises", pages: 3, blurb: "Most bruises from dermal filler can be prevented — run this checklist." },
    { id: "medical-model", title: "Guide to the Medical Model for Cosmetic Procedures", pages: 7, blurb: "What practising the medical model means for safe cosmetic practice." },
    { id: "instagram-locations", title: "7 Locations on Instagram to Get Followers", pages: 5, blurb: "Miranda Pearce's inside secrets for clinicians who want to grow." },
    { id: "needle-control", title: "How to Improve Needle Control when Injecting", pages: 4, blurb: "If your patient sees the needle shake, confidence goes with it." },
    { id: "worth-more-1ml", title: "You're Worth More Than the Price of 1ml", pages: 5, blurb: "How to answer 'how much is 1ml?' without undervaluing yourself." },
    { id: "contraindication-checklist", title: "Is It Safe to Treat? 5-Step Contraindication Checklist", pages: 3, blurb: "Run these five checks before every treatment." },
    { id: "emergency-reversal", title: "Emergency Reversal Protocol", pages: 4, blurb: "When an emergency reversal is needed, follow this sheet." },
    { id: "delayed-nodules", title: "Delayed Onset Nodules: Diagnosis, Treatment & Prevention", pages: 6, blurb: "Diagnose, treat and avoid delayed onset nodules from filler." },
    { id: "social-time-hacks", title: "3 Time-Saving Hacks for Social Media", pages: 4, blurb: "If you want to grow, you need a system. Three hacks to start." },
    { id: "needle-cannula-lips", title: "Common Needle & Cannula Choices for Lips", pages: 3, blurb: "Which instrument to choose based on filler viscosity." },
    { id: "reels-ideas", title: "15 Easy Instagram Reels Ideas", pages: 5, blurb: "Fifteen Reels ideas you can film today." },
    { id: "hashtag-sins", title: "The 7 Deadly Hashtag Sins", pages: 4, blurb: "Seven Instagram mistakes that stall a clinic's growth." },
    { id: "social-cheatsheet", title: "The Injector's Social Media Cheatsheet: 7 Post Types", pages: 6, blurb: "The seven post types that get clinicians booked." },
    { id: "risky-areas-map", title: "The 13 Extra Risky Injection Areas: Facial Vessel Map", pages: 2, blurb: "Thirteen areas of the face that hold more risk of a complication." }
  ];

  /* Paid courses — mirrors learning-shared.js P.PRICES (prices read from
     there when it is loaded, so the two never drift). The membership isn't a
     course, so it's not in this pool. */
  T.PAID_ITEMS = [
    { slug: "advanced-lip-techniques", title: "Advanced Lip Techniques", price: 342, image: "assets/course-advanced-lip-techniques.jpg", blurb: "Layered volume, borders and perioral balance built on 8D." },
    { slug: "temple-filler", title: "Temple Filler Masterclass", price: 342, image: "assets/course-temple-filler.webp", blurb: "Safe temple volumising with cannula and needle." },
    { slug: "cheek-contouring", title: "Cheek Contouring", price: 246, image: "assets/course-cheek-contouring.jpg", blurb: "Fat pads, ligaments and support for volumising." },
    { slug: "jawline-sculpting", title: "Jawline Sculpting", price: 294, image: "assets/course-jawline-sculpting.jpg", blurb: "Definition along the mandible without heaviness." },
    { slug: "tear-trough-treatment", title: "Tear Trough Treatment", price: 342, image: "assets/course-tear-trough.jpg", blurb: "Assess, treat and manage the highest-risk under-eye area." },
    { slug: "complications-management", title: "Complications Management", price: 450, image: "assets/course-complications.jpg", blurb: "Recognise, prevent and manage vascular and other complications." },
    { slug: "functional-anatomy", title: "Functional Facial Anatomy", price: 198, image: "assets/course-cheek-contouring.jpg", blurb: "Layers, planes and danger zones every injector needs." },
    { slug: "safety-injection-essentials", title: "Safety & Injection Essentials", price: 294, image: "assets/course-temple-filler.webp", blurb: "Aseptic technique, aspiration and needle versus cannula." },
    { slug: "perioral-rejuvenation", title: "Perioral Rejuvenation", price: 246, image: "assets/course-full-face-rejuvenation.jpg", blurb: "Marionette lines, chin support and smoker's lines." },
    { slug: "vascular-occlusion-protocol", title: "Vascular Occlusion Protocol", price: 198, image: "assets/course-skin-boosters.jpg", blurb: "Spot the signs early and act on a rehearsed hyaluronidase plan." },
    { slug: "treatment-approaches", title: "Treatment Approaches", price: 246, image: "assets/course-full-face-rejuvenation.jpg", blurb: "Match technique to the patient in front of you." },
    { slug: "consent-documentation", title: "Consent & Documentation", price: 150, image: "assets/course-membership-banner.jpg", blurb: "Consent forms, cooling-off periods and record keeping." }
  ];

  /* ---------------------------------------------------------------- utils -- */
  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dayIndex(stamp) {
    var p = stamp.split("-").map(Number);
    return Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000);
  }
  function emit(name, detail) {
    try { window.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (e) {}
  }
  T.today = today;

  function readTier() {
    var S = window.PFLearnShared;
    if (S && S.readTier) return S.readTier();
    if (window.PF_TIER) return window.PF_TIER;
    try { return localStorage.getItem("pf-subscription-tier") || "free"; } catch (e) { return "free"; }
  }
  function purchasedSlugs() { return read("pf-purchased-courses", []); }
  function ownsCourse(slug) {
    if (purchasedSlugs().indexOf(slug) !== -1) return true;
    var S = window.PFLearnShared;
    if (S && S.includedIn) return S.includedIn(slug, readTier());
    return false;
  }
  function priceFor(item) {
    var S = window.PFLearnShared;
    if (S && S.PRICES && S.PRICES[item.slug]) return S.PRICES[item.slug];
    return item.price;
  }

  /* ---------------------------------------------------------------- picks -- */
  function buildPicks(stamp) {
    var idx = dayIndex(stamp);
    var free = T.FREE_ITEMS[idx % T.FREE_ITEMS.length];
    var paid = null;
    for (var i = 0; i < T.PAID_ITEMS.length; i++) {
      var cand = T.PAID_ITEMS[(idx + i) % T.PAID_ITEMS.length];
      if (!ownsCourse(cand.slug)) { paid = cand; break; }
    }
    if (!paid) paid = T.PAID_ITEMS[idx % T.PAID_ITEMS.length];
    return {
      date: stamp,
      free: { kind: "free", id: free.id, title: free.title, pages: free.pages, blurb: free.blurb, pts: T.POINTS.free, done: false },
      paid: { kind: "paid", id: paid.slug, slug: paid.slug, title: paid.title, price: priceFor(paid), image: paid.image, blurb: paid.blurb, pts: T.POINTS.paid, purchased: false }
    };
  }

  /* Today's pair — rebuilt (and announced) when the stored one is stale. */
  T.get = function () {
    var stamp = today();
    var saved = read(PICKS_KEY, null);
    if (saved && saved.date === stamp && saved.free && saved.paid) {
      /* a purchase made outside the target flow still completes the paid row */
      if (!saved.paid.purchased && purchasedSlugs().indexOf(saved.paid.slug) !== -1) { saved.paid.purchased = true; write(PICKS_KEY, saved); }
      flushAwards(saved);
      return saved;
    }
    if (saved && saved.pendingAwards && saved.pendingAwards.length) flushAwards(saved);
    var fresh = buildPicks(stamp);
    write(PICKS_KEY, fresh);
    emit("pf:daily-targets", { reason: "refresh", picks: fresh });
    return fresh;
  };
  function save(picks) { write(PICKS_KEY, picks); emit("pf:daily-targets", { reason: "update", picks: picks }); }

  /* ------------------------------------------------------------ analytics -- */
  function emptyDay() {
    return { free: { impressions: 0, taps: 0, downloads: 0 }, paid: { impressions: 0, taps: 0, checkouts: 0, purchases: 0, revenue: 0 } };
  }
  function readAnalytics() {
    var a = read(ANALYTICS_KEY, null);
    if (!a || typeof a !== "object") a = {};
    if (!a.days) a.days = {};
    if (!Array.isArray(a.events)) a.events = [];
    return a;
  }
  function track(kind, stage, extra) {
    var a = readAnalytics();
    var stamp = today();
    var day = a.days[stamp] || (a.days[stamp] = emptyDay());
    var bucket = day[kind] || (day[kind] = {});
    bucket[stage] = (bucket[stage] || 0) + 1;
    if (extra && extra.amount) bucket.revenue = Math.round(((bucket.revenue || 0) + Number(extra.amount)) * 100) / 100;
    var ev = { ts: Date.now(), date: stamp, kind: kind, stage: stage };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) ev[k] = extra[k];
    a.events.push(ev);
    if (a.events.length > EVENT_CAP) a.events = a.events.slice(a.events.length - EVENT_CAP);
    write(ANALYTICS_KEY, a);
    emit("pf:daily-targets-analytics", ev);
    return ev;
  }
  T.track = track;

  /* One impression per pair per day per device — call when the card renders. */
  T.view = function () {
    var picks = T.get();
    if (picks.viewed === picks.date) return picks;
    picks.viewed = picks.date;
    write(PICKS_KEY, picks);
    track("free", "impressions", { id: picks.free.id });
    track("paid", "impressions", { id: picks.paid.slug });
    return picks;
  };

  /* -------------------------------------------------------------- points -- */
  /* Books points into the loyalty engine when it's on the page; otherwise
     (the checkouts don't load loyalty-engine.js) the award is parked on the
     picks record and flushed by the next page that has the engine. */
  function award(pts, label, actionId) {
    var engine = window.PFLoyalty;
    if (!(engine && engine.awardPoints)) {
      var picks = read(PICKS_KEY, null);
      if (picks) { (picks.pendingAwards = picks.pendingAwards || []).push({ pts: pts, label: label, actionId: actionId }); write(PICKS_KEY, picks); }
      return;
    }
    var booked = false;
    try { engine.awardPoints(pts, label, actionId); booked = true; } catch (e) {}
    emit("pf:points-earned", { amount: pts, label: label, actionId: actionId, booked: booked });
  }
  function flushAwards(picks) {
    var engine = window.PFLoyalty;
    if (!picks || !picks.pendingAwards || !picks.pendingAwards.length || !(engine && engine.awardPoints)) return false;
    var list = picks.pendingAwards; picks.pendingAwards = []; write(PICKS_KEY, picks);
    list.forEach(function (a) { award(a.pts, a.label, a.actionId); });
    return true;
  }

  /* ---------------------------------------------------------------- free -- */
  T.tapFree = function () { var p = T.get(); track("free", "taps", { id: p.free.id }); return p; };

  /* Completes the free target: generates the PDF, triggers the download,
     pays its points once and records the funnel step. */
  T.downloadFree = function () {
    var picks = T.get();
    var item = picks.free;
    T.downloadPdf(item);
    if (!item.done) {
      item.done = true; item.doneAt = Date.now();
      save(picks);
      track("free", "downloads", { id: item.id });
      award(item.pts, "Today's target: downloaded " + item.title, "evt_daily_target_free");
    }
    return picks;
  };

  /* ---------------------------------------------------------------- paid -- */
  /* `via` is "detail" (row tap → course page) or "buy" (CTA → checkout). */
  T.tapPaid = function (via) {
    var picks = T.get();
    track("paid", "taps", { id: picks.paid.slug, via: via || "buy" });
    write(ATTRIB_KEY, { slug: picks.paid.slug, id: picks.paid.slug, date: picks.date, ts: Date.now(), via: via || "buy" });
    return picks;
  };
  function attributionFor(slug) {
    var a = read(ATTRIB_KEY, null);
    if (!a || a.slug !== slug) return null;
    if (Date.now() - a.ts > ATTRIB_TTL_MS) return null;
    return a;
  }
  T.isAttributed = function (slug) { return !!attributionFor(slug); };

  /* Checkout pages call this on mount: a target-driven checkout is counted
     once per attribution. */
  T.checkoutStarted = function (slug) {
    var a = attributionFor(slug);
    if (!a || a.checkout) return false;
    a.checkout = Date.now(); write(ATTRIB_KEY, a);
    track("paid", "checkouts", { id: slug });
    return true;
  };

  /* Checkout pages call this when payment completes. `amount` is what the
     member paid (after any reward discount, incl. VAT). Only attributed
     purchases count toward the target's revenue. */
  T.recordPurchase = function (slug, amount) {
    var a = attributionFor(slug);
    if (!a || a.purchased) return false;
    a.purchased = Date.now(); write(ATTRIB_KEY, a);
    track("paid", "purchases", { id: slug, amount: Number(amount) || 0 });
    var picks = read(PICKS_KEY, null);
    if (picks && picks.paid && picks.paid.slug === slug && !picks.paid.purchased) {
      picks.paid.purchased = true; picks.paid.purchasedAt = Date.now();
      save(picks);
      award(picks.paid.pts, "Today's target: bought " + picks.paid.title, "evt_daily_target_paid");
    }
    return true;
  };

  /* ---------------------------------------------------------------- urls -- */
  function qs(o) { var p = new URLSearchParams(); Object.keys(o).forEach(function (k) { if (o[k] != null && o[k] !== "") p.set(k, o[k]); }); return p.toString(); }
  T.freeLibraryUrl = function (web) { return (web ? "AllCoursesWeb.html" : "AllCoursesMobile.html") + "?free=1"; };
  T.paidDetailUrl = function (web) {
    var c = T.get().paid;
    return (web ? "CourseWeb.html?" : "CourseDetail.html?") + qs({ course: c.slug, title: c.title, price: c.price });
  };
  T.paidCheckoutUrl = function (web, ret) {
    var c = T.get().paid;
    if (web) return "CourseCheckoutWeb.html?" + qs({ course: c.slug, title: c.title, price: c.price, instr: "Dr. Tim Pearce", img: c.image, ret: ret || "Profile.html" });
    /* the mobile checkout only returns to CourseDetail*/ /* shells, so land on this course's page */
    return "CourseCheckout.html?" + qs({ course: c.slug, title: c.title, price: c.price, instr: "Dr. Tim Pearce", ret: "CourseDetail.html?" + qs({ course: c.slug, title: c.title, price: c.price }) });
  };

  /* -------------------------------------------------------------- funnel -- */
  /* Aggregated read-out for Admin Analytics. `days` limits the window (all
     time when omitted). Rates are 0–100 percentages, null when undefined. */
  T.getFunnel = function (days) {
    var a = readAnalytics();
    var stamps = Object.keys(a.days).sort();
    if (days > 0) {
      var cutoff = dayIndex(today()) - (days - 1);
      stamps = stamps.filter(function (s) { return dayIndex(s) >= cutoff; });
    }
    var t = { impressions: 0, freeTaps: 0, freeDownloads: 0, paidTaps: 0, checkouts: 0, purchases: 0, revenue: 0, days: stamps.length };
    var perDay = stamps.map(function (s) {
      var d = a.days[s], f = d.free || {}, p = d.paid || {};
      var imp = Math.max(f.impressions || 0, p.impressions || 0);
      t.impressions += imp; t.freeTaps += f.taps || 0; t.freeDownloads += f.downloads || 0;
      t.paidTaps += p.taps || 0; t.checkouts += p.checkouts || 0; t.purchases += p.purchases || 0; t.revenue += p.revenue || 0;
      return { date: s, impressions: imp, freeTaps: f.taps || 0, freeDownloads: f.downloads || 0, paidTaps: p.taps || 0, checkouts: p.checkouts || 0, purchases: p.purchases || 0, revenue: p.revenue || 0 };
    }).reverse();
    var rate = function (n, d) { return d ? Math.round((n / d) * 1000) / 10 : null; };
    t.revenue = Math.round(t.revenue * 100) / 100;
    t.rates = {
      freeTap: rate(t.freeTaps, t.impressions), freeDownload: rate(t.freeDownloads, t.impressions),
      paidTap: rate(t.paidTaps, t.impressions), checkout: rate(t.checkouts, t.paidTaps), purchase: rate(t.purchases, t.paidTaps),
      overallConversion: rate(t.purchases, t.impressions)
    };
    t.revenuePerImpression = t.impressions ? Math.round((t.revenue / t.impressions) * 100) / 100 : 0;
    t.avgOrder = t.purchases ? Math.round((t.revenue / t.purchases) * 100) / 100 : 0;
    t.perDay = perDay;
    t.events = a.events.slice().reverse();
    return t;
  };
  T.reset = function () { try { localStorage.removeItem(ANALYTICS_KEY); localStorage.removeItem(ATTRIB_KEY); } catch (e) {} emit("pf:daily-targets-analytics", { stage: "reset" }); };

  /* ----------------------------------------------------------------- pdf -- */
  /* Builds a small valid single-page PDF (Helvetica) for the free item and
     triggers a download — a real file lands in Downloads rather than a
     placeholder navigation. */
  function pdfEscape(s) { return String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7E]/g, function (c) { return ({ "\u2019": "'", "\u2018": "'", "\u201C": '"', "\u201D": '"', "\u2014": "-", "\u2013": "-", "\u00A3": "GBP " })[c] || ""; }); }
  function wrap(text, max) {
    var words = String(text).split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) { if ((cur + " " + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += " " + w; });
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }
  T.buildPdf = function (item) {
    var lines = [];
    lines.push({ f: "F2", s: 10, y: 790, t: "PROFINITY  |  FREE RESOURCE  |  TODAY'S TARGET" });
    var titleLines = wrap(item.title, 40), y = 740;
    titleLines.forEach(function (l) { lines.push({ f: "F2", s: 22, y: y, t: l }); y -= 28; });
    y -= 6;
    lines.push({ f: "F1", s: 11, y: y, t: "By Dr Tim Pearce  |  " + (item.pages || 1) + " pages  |  " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) }); y -= 30;
    wrap(item.blurb || "", 80).forEach(function (l) { lines.push({ f: "F1", s: 12, y: y, t: l }); y -= 17; });
    y -= 20;
    ["This guide is part of the PROfinity free library. Open the app to explore",
     "the full collection of guides, checklists and protocols, or ask Ava which",
     "resource fits the patient in front of you today."].forEach(function (l) { lines.push({ f: "F1", s: 11, y: y, t: l }); y -= 16; });
    lines.push({ f: "F1", s: 9, y: 40, t: "(c) Dr Tim Pearce Aesthetics. For clinician education only." });
    var content = "BT\n" + lines.map(function (l) { return "/" + l.f + " " + l.s + " Tf 1 0 0 1 56 " + l.y + " Tm (" + pdfEscape(l.t) + ") Tj"; }).join("\n") + "\nET";
    var objs = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
      "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream"
    ];
    var out = "%PDF-1.4\n", offsets = [];
    objs.forEach(function (o, i) { offsets.push(out.length); out += (i + 1) + " 0 obj\n" + o + "\nendobj\n"; });
    var xref = out.length;
    out += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
    offsets.forEach(function (o) { out += String(o).padStart(10, "0") + " 00000 n \n"; });
    out += "trailer\n<< /Size " + (objs.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF";
    return out;
  };
  T.downloadPdf = function (item) {
    try {
      var blob = new Blob([T.buildPdf(item)], { type: "application/pdf" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = (item.id || "profinity-guide") + ".pdf"; a.rel = "noopener";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      return true;
    } catch (e) { return false; }
  };

  /* Cross-tab: another tab's tick or purchase refreshes this one's card. */
  try {
    window.addEventListener("storage", function (e) {
      if (e.key === PICKS_KEY || e.key === "pf-purchased-courses") emit("pf:daily-targets", { reason: "storage" });
    });
  } catch (e) {}
})();
