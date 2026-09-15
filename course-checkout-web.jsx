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
const { useState: useStateCCW, useEffect: useEffectCCW, useRef: useRefCCW } = React;
const DSCCW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavCCW, IconifyIcon: IconCCW } = DSCCW;
const LearnCCW = window.PFLearn;

const ME_CCW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const VAT_RATE_CCW = 0.2;

function goCCW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateCCW(label) {
  const u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": LearnCCW.myLearningUrl, Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goCCW(u);
}
const gbpCCW = (n) => "£" + Math.round(n).toLocaleString("en-GB");

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
function safeRetCCW(raw) { return raw && SAFE_RET_CCW.test(raw) ? raw : ""; }

function getCourseFromQueryCCW() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "Course";
  const slug = params.get("course") || LearnCCW.slugify(title);
  const img = params.get("img") || COURSE_ART_CCW[slug] || "";
  const ret = safeRetCCW(params.get("ret") || "");
  return {
    slug, title,
    instr: params.get("instr") || "Dr. Tim Pearce",
    price: Math.max(0, Number(params.get("price") || LearnCCW.PRICES[slug] || 0)),
    img: /^assets\//.test(img) ? img : "",
    ret: ret || LearnCCW.courseUrl(slug, { title })
  };
}

/* ---------------------------------------------------------------- field formatters -- */
const digitsCCW = (s, max) => String(s || "").replace(/\D/g, "").slice(0, max);
function fmtCardCCW(v) { return digitsCCW(v, 19).replace(/(\d{4})(?=\d)/g, "$1 "); }
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
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    left: 8 + ((i * 37) % 84),
    delay: (i % 6) * 60,
    dur: 1400 + (i % 5) * 180,
    color: CONFETTI_COLORS_CCW[i % CONFETTI_COLORS_CCW.length],
    rot: (i * 53) % 360,
    round: i % 3 === 0
  }));
  return (
    <div className="ccw-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} className={"ccw-confetti-piece" + (p.round ? " round" : "")}
          style={{ left: p.left + "%", background: p.color, animationDelay: p.delay + "ms", animationDuration: p.dur + "ms", "--rot": p.rot + "deg" }} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- crumb -- */
function CCWCrumb({ course, done }) {
  const backTarget = done ? LearnCCW.myLearningUrl : course.ret;
  const backLabel = done ? "Back to My Learning" : "Back";
  return (
    <div className="ccw-crumb-row">
      <button type="button" className="ccw-back-btn" aria-label={backLabel} onClick={() => goCCW(backTarget)}>
        <IconCCW name="lucide:arrow-left" size={19} color="var(--brand-navy)" />
      </button>
      <span className="ccw-crumb">
        <a onClick={() => goCCW(LearnCCW.myLearningUrl)}>My Learning</a> &nbsp;/&nbsp;
        <a onClick={() => goCCW(course.ret)}>{course.title}</a> &nbsp;/&nbsp; <span>Checkout</span>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- order summary (right column) -- */
function CCWSummary({ course, reward, rewardOff, subtotal, vat, total, done, alreadyOwned }) {
  const [artFailed, setArtFailed] = useStateCCW(false);
  const showArt = course.img && !artFailed;
  return (
    <aside className="ccw-side">
      <div className="ccw-card ccw-summary-card" data-testid="ccw-summary">
        <div className="ccw-course">
          {showArt
            ? <img className="ccw-course-art" src={course.img} alt="" onError={() => setArtFailed(true)} />
            : <span className="ccw-course-art ccw-course-art-fallback"><IconCCW name="lucide:play-circle" size={26} color="#fff" /></span>}
          <div className="ccw-course-info">
            <div className="ccw-course-kicker">Course</div>
            <h3 className="ccw-course-title">{course.title}</h3>
            <p className="ccw-course-instr">with {course.instr}</p>
          </div>
          <div className="ccw-course-price">{gbpCCW(course.price)}</div>
        </div>

        <div className="ccw-lines">
          <div className="ccw-line"><span>Course price</span><span>{gbpCCW(course.price)}</span></div>
          {reward && (
            <div className="ccw-line ccw-line-reward" data-testid="ccw-reward">
              <span>
                <IconCCW name="lucide:gift" size={14} color="currentColor" />
                Reward discount · {reward.pct}% off
                <small>{reward.code}</small>
              </span>
              <span>−{gbpCCW(rewardOff)}</span>
            </div>
          )}
          {reward && <div className="ccw-line"><span>Subtotal</span><span>{gbpCCW(subtotal)}</span></div>}
          <div className="ccw-line"><span>VAT (20%)</span><span>{gbpCCW(vat)}</span></div>
          <div className="ccw-line ccw-line-total"><span>{done ? (alreadyOwned ? "Course total" : "Paid today") : "Total due today"}</span><span data-testid="ccw-total">{gbpCCW(total)}</span></div>
        </div>

        <ul className="ccw-perks">
          <li><IconCCW name="lucide:infinity" size={16} color="var(--brand-navy)" />Lifetime access once paid</li>
          <li><IconCCW name="lucide:award" size={16} color="var(--brand-navy)" />Certificate on completion</li>
          <li><IconCCW name="lucide:refresh-cw" size={16} color="var(--brand-navy)" />All future course updates</li>
        </ul>
      </div>

      <p className="ccw-secure">
        <IconCCW name="lucide:shield-check" size={14} color="var(--gray-400)" />
        Secured by Stripe · 256-bit encryption · Prototype checkout, no card is charged
      </p>
    </aside>
  );
}

/* ---------------------------------------------------------------- payment form (left column) -- */
function CCWField({ id, label, hint, children }) {
  return (
    <div className="ccw-field">
      <label htmlFor={id}>{label}{hint && <span className="ccw-field-hint">{hint}</span>}</label>
      {children}
    </div>
  );
}

function CCWPaymentForm({ course, total, paying, onPay }) {
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

  return (
    <form className="ccw-card ccw-form" onSubmit={submit} noValidate data-testid="ccw-form">
      <div className="ccw-form-head">
        <h2>Payment details</h2>
        <p>{free ? "No payment is needed — confirm below to add this course to My Learning." : "Complete your purchase to unlock the full course instantly."}</p>
      </div>

      <div className="ccw-section-label">Contact</div>
      <CCWField id="ccw-email" label="Email for your receipt">
        <input id="ccw-email" className="ccw-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </CCWField>

      {!free && (
        <React.Fragment>
          <div className="ccw-section-label">Card</div>
          <div className="ccw-method" role="radiogroup" aria-label="Payment method">
            <button type="button" className="ccw-method-btn selected" aria-checked="true" role="radio">
              <IconCCW name="lucide:credit-card" size={18} color="var(--brand-navy)" />Card
            </button>
            <button type="button" className="ccw-method-btn" aria-checked="false" role="radio" disabled title="Coming soon">
              <IconCCW name="lucide:smartphone" size={18} color="var(--gray-400)" />Apple Pay
            </button>
            <button type="button" className="ccw-method-btn" aria-checked="false" role="radio" disabled title="Coming soon">
              <IconCCW name="lucide:landmark" size={18} color="var(--gray-400)" />Bank transfer
            </button>
          </div>

          <CCWField id="ccw-name" label="Name on card">
            <input id="ccw-name" className="ccw-input" type="text" autoComplete="cc-name" placeholder="Katy Wilson" value={name} onChange={(e) => setName(e.target.value)} />
          </CCWField>

          <CCWField id="ccw-number" label="Card number" hint={brand}>
            <div className="ccw-input-wrap">
              <IconCCW name="lucide:credit-card" size={18} color="var(--gray-400)" />
              <input id="ccw-number" className="ccw-input ccw-input-bare" inputMode="numeric" autoComplete="cc-number"
                placeholder="1234 1234 1234 1234" value={number} onChange={(e) => setNumber(fmtCardCCW(e.target.value))} />
            </div>
          </CCWField>

          <div className="ccw-row-2">
            <CCWField id="ccw-expiry" label="Expiry">
              <input id="ccw-expiry" className="ccw-input" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY"
                value={expiry} onChange={(e) => setExpiry(fmtExpiryCCW(e.target.value))} />
            </CCWField>
            <CCWField id="ccw-cvc" label="Security code">
              <div className="ccw-input-wrap">
                <input id="ccw-cvc" className="ccw-input ccw-input-bare" inputMode="numeric" autoComplete="cc-csc" placeholder="CVC"
                  value={cvc} onChange={(e) => setCvc(digitsCCW(e.target.value, 4))} />
                <IconCCW name="lucide:lock" size={16} color="var(--gray-400)" />
              </div>
            </CCWField>
          </div>

          <div className="ccw-section-label">Billing address</div>
          <div className="ccw-row-2">
            <CCWField id="ccw-country" label="Country">
              <select id="ccw-country" className="ccw-input" value={country} onChange={(e) => setCountry(e.target.value)}>
                {["United Kingdom", "Ireland", "United States", "Australia", "Canada", "United Arab Emirates", "Other"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </CCWField>
            <CCWField id="ccw-postcode" label="Postcode">
              <input id="ccw-postcode" className="ccw-input" type="text" autoComplete="postal-code" placeholder="SW1A 1AA"
                value={postcode} onChange={(e) => setPostcode(e.target.value)} />
            </CCWField>
          </div>

          <label className="ccw-check">
            <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} />
            <span>Save this card for faster checkout next time</span>
          </label>
        </React.Fragment>
      )}

      <button type="submit" className="ccw-pay" disabled={paying} data-testid="ccw-pay">
        {paying
          ? <React.Fragment><span className="ccw-spinner" aria-hidden="true" />Processing…</React.Fragment>
          : <React.Fragment><IconCCW name="lucide:lock" size={16} color="#fff" />{free ? "Add to My Learning" : "Pay " + gbpCCW(total) + " & enroll"}</React.Fragment>}
      </button>
      <p className="ccw-terms">
        One-time payment. By enrolling you agree to the PROfinity terms of purchase and privacy policy.
      </p>
    </form>
  );
}

/* ---------------------------------------------------------------- success state -- */
function CCWSuccess({ course, total, alreadyOwned }) {
  return (
    <div className="ccw-card ccw-success" data-testid="ccw-success">
      {!alreadyOwned && <ConfettiCCW />}
      <div className="ccw-success-badge">
        <IconCCW name="lucide:check" size={30} color="#fff" />
      </div>
      <h2>{alreadyOwned ? "You already own this course" : "You're enrolled!"}</h2>
      <p>
        {alreadyOwned
          ? <React.Fragment><strong>{course.title}</strong> is already in your library — jump straight back in.</React.Fragment>
          : <React.Fragment><strong>{course.title}</strong> has been added to My Learning{total > 0 ? " and a receipt is on its way to your inbox" : ""}. Lifetime access starts now.</React.Fragment>}
      </p>
      <div className="ccw-success-actions">
        <a className="ccw-start" href={course.ret} data-testid="ccw-start" onClick={(e) => { e.preventDefault(); goCCW(course.ret); }}>
          <IconCCW name="lucide:play" size={16} color="#fff" />Start learning
        </a>
        <a className="ccw-back-link" href={LearnCCW.myLearningUrl} onClick={(e) => { e.preventDefault(); goCCW(LearnCCW.myLearningUrl); }}>
          Back to My Learning
        </a>
      </div>
    </div>
  );
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
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function handlePay() {
    setPaying(true);
    timerRef.current = setTimeout(() => {
      LearnCCW.addPurchased(course.slug);
      setPaying(false);
      setDone(true);
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
    }, 900);
  }

  return (
    <div className="app" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavCCW active="My Learning" user={ME_CCW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateCCW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="ccw-page" data-screen-label="Course Checkout (web)">
        <CCWCrumb course={course} done={done} />

        <div className="ccw-head">
          <h1>{done ? (alreadyOwned ? "Already enrolled" : "Order complete") : "Checkout"}</h1>
          {!done && <p>You're one step away from unlocking this course.</p>}
        </div>

        <div className="ccw-grid">
          <div className="ccw-main">
            {done
              ? <CCWSuccess course={course} total={total} alreadyOwned={alreadyOwned} />
              : <CCWPaymentForm course={course} total={total} paying={paying} onPay={handlePay} />}
          </div>
          <CCWSummary course={course} reward={reward} rewardOff={rewardOff} subtotal={subtotal} vat={vat} total={total} done={done} alreadyOwned={alreadyOwned} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CourseCheckoutWebApp />);
