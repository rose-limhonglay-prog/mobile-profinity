/* ===========================================================================
   PROfinity — Course Checkout (web)
   Desktop twin of CourseCheckout.html (course-checkout.jsx). Reached from a
   "Buy course" CTA on the desktop My Learning pages via PFLearn.checkoutUrl():

     CourseCheckoutWeb.html?course=<slug>&title=<title>&price=<number>
                           &instr=<name>[&img=<asset path>]
                           [&ret=<same-folder page to return to after paying>]

   Two-column layout: payment form (left) + sticky order summary (right).
   A reward discount redeemed in the Rewards Store (pf-course-discounts) is
   applied exactly like the mobile page. Paying is a prototype — any card
   input is accepted — then PFLearn.addPurchased(slug) unlocks the course and
   "Start learning" returns to ?ret (relative same-folder .html only) or the
   course page. Suffixed -CCW to avoid clashing with other page globals.
   =========================================================================== */
const {
  useState: useStateCCW,
  useEffect: useEffectCCW,
  useRef: useRefCCW
} = React;
const DSCCW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavCCW,
  IconifyIcon: IconCCW
} = DSCCW;
const LearnCCW = window.PFLearn;
const ME_CCW = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const VAT_RATE_CCW = 0.2;
function goCCW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateCCW(label) {
  const u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": LearnCCW.myLearningUrl,
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goCCW(u);
}
const gbpCCW = n => "£" + Math.round(n).toLocaleString("en-GB");

/* course art for slugs that don't pass ?img= (same assets the My Learning tiles use) */
const COURSE_ART_CCW = {
  "temple-filler": "assets/course-temple-filler.webp",
  "8d-lip-design": "assets/course-8d-lip-design.jpg",
  "8d-lips": "assets/course-8d-lip-design.jpg",
  "advanced-lip-techniques": "assets/course-advanced-lip-techniques.jpg",
  "complications-management": "assets/course-complications.jpg",
  "cheek-contouring": "assets/course-cheek-contouring.jpg",
  "cheek-midface-contouring": "assets/course-cheek-contouring.jpg",
  "jawline-sculpting": "assets/course-jawline-sculpting.jpg",
  "jawline-sculpting-masterclass": "assets/course-jawline-sculpting.jpg",
  "tear-trough-treatment": "assets/course-tear-trough.jpg",
  "tear-trough-correction": "assets/course-tear-trough.jpg",
  "brow-lift-training": "assets/course-brow-lift.jpg",
  "full-face-rejuvenation-protocol": "assets/course-full-face-rejuvenation.jpg",
  "non-surgical-rhinoplasty": "assets/course-rhinoplasty.jpg",
  "skin-boosters-hydration-therapy": "assets/course-skin-boosters.jpg",
  "consultation-patient-assessment": "assets/course-consultation.jpg",
  "protox-course": "assets/course-protox.png",
  "profinity-membership": "assets/course-membership-banner.jpg"
};

/* only a relative, same-folder .html page (optionally with a query) may be a return target */
const SAFE_RET_CCW = /^[A-Za-z0-9_-]+\.html(\?[^#\s]*)?$/;
function safeRetCCW(raw) {
  return raw && SAFE_RET_CCW.test(raw) ? raw : "";
}
function getCourseFromQueryCCW() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "Course";
  const slug = params.get("course") || LearnCCW.slugify(title);
  const img = params.get("img") || COURSE_ART_CCW[slug] || "";
  const ret = safeRetCCW(params.get("ret") || "");
  return {
    slug,
    title,
    instr: params.get("instr") || "Dr. Tim Pearce",
    price: Math.max(0, Number(params.get("price") || LearnCCW.PRICES[slug] || 0)),
    img: /^assets\//.test(img) ? img : "",
    ret: ret || LearnCCW.courseUrl(slug, {
      title
    })
  };
}

/* ---------------------------------------------------------------- field formatters -- */
const digitsCCW = (s, max) => String(s || "").replace(/\D/g, "").slice(0, max);
function fmtCardCCW(v) {
  return digitsCCW(v, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function fmtExpiryCCW(v) {
  const d = digitsCCW(v, 4);
  return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
}
function cardBrandCCW(num) {
  const d = digitsCCW(num, 2);
  if (/^4/.test(d)) return "Visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  return "";
}

/* ---------------------------------------------------------------- confetti (one shot, light) -- */
const CONFETTI_COLORS_CCW = ["#CE9957", "#F4AD3D", "#3B3592", "#6172F3", "#137A5B", "#E7820A"];
function ConfettiCCW() {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null;
  const pieces = Array.from({
    length: 22
  }, (_, i) => ({
    left: 8 + i * 37 % 84,
    delay: i % 6 * 60,
    dur: 1400 + i % 5 * 180,
    color: CONFETTI_COLORS_CCW[i % CONFETTI_COLORS_CCW.length],
    rot: i * 53 % 360,
    round: i % 3 === 0
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "ccw-confetti",
    "aria-hidden": "true"
  }, pieces.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "ccw-confetti-piece" + (p.round ? " round" : ""),
    style: {
      left: p.left + "%",
      background: p.color,
      animationDelay: p.delay + "ms",
      animationDuration: p.dur + "ms",
      "--rot": p.rot + "deg"
    }
  })));
}

/* ---------------------------------------------------------------- crumb -- */
function CCWCrumb({
  course,
  done
}) {
  const backTarget = done ? LearnCCW.myLearningUrl : course.ret;
  const backLabel = done ? "Back to My Learning" : "Back";
  return /*#__PURE__*/React.createElement("div", {
    className: "ccw-crumb-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ccw-back-btn",
    "aria-label": backLabel,
    onClick: () => goCCW(backTarget)
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:arrow-left",
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ccw-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goCCW(LearnCCW.myLearningUrl)
  }, "My Learning"), " \xA0/\xA0", /*#__PURE__*/React.createElement("a", {
    onClick: () => goCCW(course.ret)
  }, course.title), " \xA0/\xA0 ", /*#__PURE__*/React.createElement("span", null, "Checkout")));
}

/* ---------------------------------------------------------------- order summary (right column) -- */
function CCWSummary({
  course,
  reward,
  rewardOff,
  subtotal,
  vat,
  total,
  done,
  alreadyOwned
}) {
  const [artFailed, setArtFailed] = useStateCCW(false);
  const showArt = course.img && !artFailed;
  return /*#__PURE__*/React.createElement("aside", {
    className: "ccw-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccw-card ccw-summary-card",
    "data-testid": "ccw-summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccw-course"
  }, showArt ? /*#__PURE__*/React.createElement("img", {
    className: "ccw-course-art",
    src: course.img,
    alt: "",
    onError: () => setArtFailed(true)
  }) : /*#__PURE__*/React.createElement("span", {
    className: "ccw-course-art ccw-course-art-fallback"
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:play-circle",
    size: 26,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ccw-course-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccw-course-kicker"
  }, "Course"), /*#__PURE__*/React.createElement("h3", {
    className: "ccw-course-title"
  }, course.title), /*#__PURE__*/React.createElement("p", {
    className: "ccw-course-instr"
  }, "with ", course.instr)), /*#__PURE__*/React.createElement("div", {
    className: "ccw-course-price"
  }, gbpCCW(course.price))), /*#__PURE__*/React.createElement("div", {
    className: "ccw-lines"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccw-line"
  }, /*#__PURE__*/React.createElement("span", null, "Course price"), /*#__PURE__*/React.createElement("span", null, gbpCCW(course.price))), reward && /*#__PURE__*/React.createElement("div", {
    className: "ccw-line ccw-line-reward",
    "data-testid": "ccw-reward"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:gift",
    size: 14,
    color: "currentColor"
  }), "Reward discount · ", reward.pct, "% off", /*#__PURE__*/React.createElement("small", null, reward.code)), /*#__PURE__*/React.createElement("span", null, "−", gbpCCW(rewardOff))), reward && /*#__PURE__*/React.createElement("div", {
    className: "ccw-line"
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, gbpCCW(subtotal))), /*#__PURE__*/React.createElement("div", {
    className: "ccw-line"
  }, /*#__PURE__*/React.createElement("span", null, "VAT (20%)"), /*#__PURE__*/React.createElement("span", null, gbpCCW(vat))), /*#__PURE__*/React.createElement("div", {
    className: "ccw-line ccw-line-total"
  }, /*#__PURE__*/React.createElement("span", null, done ? alreadyOwned ? "Course total" : "Paid today" : "Total due today"), /*#__PURE__*/React.createElement("span", {
    "data-testid": "ccw-total"
  }, gbpCCW(total)))), /*#__PURE__*/React.createElement("ul", {
    className: "ccw-perks"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:infinity",
    size: 16,
    color: "var(--brand-navy)"
  }), "Lifetime access once paid"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:award",
    size: 16,
    color: "var(--brand-navy)"
  }), "Certificate on completion"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:refresh-cw",
    size: 16,
    color: "var(--brand-navy)"
  }), "All future course updates"))), /*#__PURE__*/React.createElement("p", {
    className: "ccw-secure"
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:shield-check",
    size: 14,
    color: "var(--gray-400)"
  }), "Secured by Stripe · 256-bit encryption · Prototype checkout, no card is charged"));
}

/* ---------------------------------------------------------------- payment form (left column) -- */
function CCWField({
  id,
  label,
  hint,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ccw-field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: id
  }, label, hint && /*#__PURE__*/React.createElement("span", {
    className: "ccw-field-hint"
  }, hint)), children);
}
function CCWPaymentForm({
  course,
  total,
  paying,
  onPay
}) {
  const [email, setEmail] = useStateCCW("katy.wilson@example.com");
  const [name, setName] = useStateCCW("");
  const [number, setNumber] = useStateCCW("");
  const [expiry, setExpiry] = useStateCCW("");
  const [cvc, setCvc] = useStateCCW("");
  const [postcode, setPostcode] = useStateCCW("");
  const [country, setCountry] = useStateCCW("United Kingdom");
  const [save, setSave] = useStateCCW(true);
  const brand = cardBrandCCW(number);
  const free = total === 0;
  function submit(e) {
    e.preventDefault();
    if (!paying) onPay();
  }
  return /*#__PURE__*/React.createElement("form", {
    className: "ccw-card ccw-form",
    onSubmit: submit,
    noValidate: true,
    "data-testid": "ccw-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccw-form-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Payment details"), /*#__PURE__*/React.createElement("p", null, free ? "No payment is needed — confirm below to add this course to My Learning." : "Complete your purchase to unlock the full course instantly.")), /*#__PURE__*/React.createElement("div", {
    className: "ccw-section-label"
  }, "Contact"), /*#__PURE__*/React.createElement(CCWField, {
    id: "ccw-email",
    label: "Email for your receipt"
  }, /*#__PURE__*/React.createElement("input", {
    id: "ccw-email",
    className: "ccw-input",
    type: "email",
    autoComplete: "email",
    value: email,
    onChange: e => setEmail(e.target.value)
  })), !free && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ccw-section-label"
  }, "Card"), /*#__PURE__*/React.createElement("div", {
    className: "ccw-method",
    role: "radiogroup",
    "aria-label": "Payment method"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ccw-method-btn selected",
    "aria-checked": "true",
    role: "radio"
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:credit-card",
    size: 18,
    color: "var(--brand-navy)"
  }), "Card"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ccw-method-btn",
    "aria-checked": "false",
    role: "radio",
    disabled: true,
    title: "Coming soon"
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:smartphone",
    size: 18,
    color: "var(--gray-400)"
  }), "Apple Pay"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ccw-method-btn",
    "aria-checked": "false",
    role: "radio",
    disabled: true,
    title: "Coming soon"
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:landmark",
    size: 18,
    color: "var(--gray-400)"
  }), "Bank transfer")), /*#__PURE__*/React.createElement(CCWField, {
    id: "ccw-name",
    label: "Name on card"
  }, /*#__PURE__*/React.createElement("input", {
    id: "ccw-name",
    className: "ccw-input",
    type: "text",
    autoComplete: "cc-name",
    placeholder: "Katy Wilson",
    value: name,
    onChange: e => setName(e.target.value)
  })), /*#__PURE__*/React.createElement(CCWField, {
    id: "ccw-number",
    label: "Card number",
    hint: brand
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccw-input-wrap"
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:credit-card",
    size: 18,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("input", {
    id: "ccw-number",
    className: "ccw-input ccw-input-bare",
    inputMode: "numeric",
    autoComplete: "cc-number",
    placeholder: "1234 1234 1234 1234",
    value: number,
    onChange: e => setNumber(fmtCardCCW(e.target.value))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ccw-row-2"
  }, /*#__PURE__*/React.createElement(CCWField, {
    id: "ccw-expiry",
    label: "Expiry"
  }, /*#__PURE__*/React.createElement("input", {
    id: "ccw-expiry",
    className: "ccw-input",
    inputMode: "numeric",
    autoComplete: "cc-exp",
    placeholder: "MM / YY",
    value: expiry,
    onChange: e => setExpiry(fmtExpiryCCW(e.target.value))
  })), /*#__PURE__*/React.createElement(CCWField, {
    id: "ccw-cvc",
    label: "Security code"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccw-input-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    id: "ccw-cvc",
    className: "ccw-input ccw-input-bare",
    inputMode: "numeric",
    autoComplete: "cc-csc",
    placeholder: "CVC",
    value: cvc,
    onChange: e => setCvc(digitsCCW(e.target.value, 4))
  }), /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:lock",
    size: 16,
    color: "var(--gray-400)"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ccw-section-label"
  }, "Billing address"), /*#__PURE__*/React.createElement("div", {
    className: "ccw-row-2"
  }, /*#__PURE__*/React.createElement(CCWField, {
    id: "ccw-country",
    label: "Country"
  }, /*#__PURE__*/React.createElement("select", {
    id: "ccw-country",
    className: "ccw-input",
    value: country,
    onChange: e => setCountry(e.target.value)
  }, ["United Kingdom", "Ireland", "United States", "Australia", "Canada", "United Arab Emirates", "Other"].map(c => /*#__PURE__*/React.createElement("option", {
    key: c
  }, c)))), /*#__PURE__*/React.createElement(CCWField, {
    id: "ccw-postcode",
    label: "Postcode"
  }, /*#__PURE__*/React.createElement("input", {
    id: "ccw-postcode",
    className: "ccw-input",
    type: "text",
    autoComplete: "postal-code",
    placeholder: "SW1A 1AA",
    value: postcode,
    onChange: e => setPostcode(e.target.value)
  }))), /*#__PURE__*/React.createElement("label", {
    className: "ccw-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: save,
    onChange: e => setSave(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Save this card for faster checkout next time"))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "ccw-pay",
    disabled: paying,
    "data-testid": "ccw-pay"
  }, paying ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "ccw-spinner",
    "aria-hidden": "true"
  }), "Processing…") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:lock",
    size: 16,
    color: "#fff"
  }), free ? "Add to My Learning" : "Pay " + gbpCCW(total) + " & enroll")), /*#__PURE__*/React.createElement("p", {
    className: "ccw-terms"
  }, "One-time payment. By enrolling you agree to the PROfinity terms of purchase and privacy policy."));
}

/* ---------------------------------------------------------------- success state -- */
function CCWSuccess({
  course,
  total,
  alreadyOwned
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ccw-card ccw-success",
    "data-testid": "ccw-success"
  }, !alreadyOwned && /*#__PURE__*/React.createElement(ConfettiCCW, null), /*#__PURE__*/React.createElement("div", {
    className: "ccw-success-badge"
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:check",
    size: 30,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h2", null, alreadyOwned ? "You already own this course" : "You're enrolled!"), /*#__PURE__*/React.createElement("p", null, alreadyOwned ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, course.title), " is already in your library — jump straight back in.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, course.title), " has been added to My Learning", total > 0 ? " and a receipt is on its way to your inbox" : "", ". Lifetime access starts now.")), /*#__PURE__*/React.createElement("div", {
    className: "ccw-success-actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "ccw-start",
    href: course.ret,
    "data-testid": "ccw-start",
    onClick: e => {
      e.preventDefault();
      goCCW(course.ret);
    }
  }, /*#__PURE__*/React.createElement(IconCCW, {
    name: "lucide:play",
    size: 16,
    color: "#fff"
  }), "Start learning"), /*#__PURE__*/React.createElement("a", {
    className: "ccw-back-link",
    href: LearnCCW.myLearningUrl,
    onClick: e => {
      e.preventDefault();
      goCCW(LearnCCW.myLearningUrl);
    }
  }, "Back to My Learning")));
}

/* ---------------------------------------------------------------- app -- */
function CourseCheckoutWebApp() {
  const [course] = useStateCCW(getCourseFromQueryCCW);
  const [reward] = useStateCCW(() => LearnCCW.readDiscounts()[course.slug] || null);
  const [alreadyOwned] = useStateCCW(() => LearnCCW.readPurchased().indexOf(course.slug) !== -1);
  const [paying, setPaying] = useStateCCW(false);
  const [done, setDone] = useStateCCW(alreadyOwned);
  const timerRef = useRefCCW(null);
  const rewardOff = reward ? Math.round(course.price * reward.pct / 100) : 0;
  const subtotal = Math.max(0, course.price - rewardOff);
  const vat = Math.round(subtotal * VAT_RATE_CCW);
  const total = subtotal + vat;
  useEffectCCW(() => {
    document.title = "PROfinity — Checkout · " + course.title;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  function handlePay() {
    setPaying(true);
    timerRef.current = setTimeout(() => {
      LearnCCW.addPurchased(course.slug);
      setPaying(false);
      setDone(true);
      try {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } catch (e) {}
    }, 900);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavCCW, {
    active: "My Learning",
    user: ME_CCW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateCCW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ccw-page",
    "data-screen-label": "Course Checkout (web)"
  }, /*#__PURE__*/React.createElement(CCWCrumb, {
    course: course,
    done: done
  }), /*#__PURE__*/React.createElement("div", {
    className: "ccw-head"
  }, /*#__PURE__*/React.createElement("h1", null, done ? alreadyOwned ? "Already enrolled" : "Order complete" : "Checkout"), !done && /*#__PURE__*/React.createElement("p", null, "You're one step away from unlocking this course.")), /*#__PURE__*/React.createElement("div", {
    className: "ccw-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccw-main"
  }, done ? /*#__PURE__*/React.createElement(CCWSuccess, {
    course: course,
    total: total,
    alreadyOwned: alreadyOwned
  }) : /*#__PURE__*/React.createElement(CCWPaymentForm, {
    course: course,
    total: total,
    paying: paying,
    onPay: handlePay
  })), /*#__PURE__*/React.createElement(CCWSummary, {
    course: course,
    reward: reward,
    rewardOff: rewardOff,
    subtotal: subtotal,
    vat: vat,
    total: total,
    done: done,
    alreadyOwned: alreadyOwned
  }))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CourseCheckoutWebApp, null));
