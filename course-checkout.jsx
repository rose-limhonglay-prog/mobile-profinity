/* ===========================================================================
   PROfinity — Course Checkout / Payment Summary (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -CC to avoid global-scope clashes.
   Reached from "Enroll" on LearningMobile.html or "Buy Now" on CourseDetail.html
   via ?course=<slug> or ?title=&instr=&grad=&price=.
   =========================================================================== */
const { useState: useStateCC, useEffect: useEffectCC } = React;
const DSCC = window.ProfinityDesignSystem_c2b5cc;

function goCC(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleCC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateCC(calc);
  useEffectCC(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileCC() {
  const [mobile, setMobile] = useStateCC(() => window.matchMedia('(max-width:768px)').matches);
  useEffectCC(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const VAT_RATE_CC = 0.2;
const PF_PURCHASED_KEY_CC = "pf-purchased-courses";

function slugifyCC(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getPurchasedCC() {
  try { return JSON.parse(localStorage.getItem(PF_PURCHASED_KEY_CC)) || []; } catch (e) { return []; }
}

function markPurchasedCC(slug) {
  try {
    const list = getPurchasedCC();
    if (!list.includes(slug)) localStorage.setItem(PF_PURCHASED_KEY_CC, JSON.stringify([...list, slug]));
  } catch (e) {}
}

function getCourseFromQueryCC() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "Course";
  const courseParam = params.get("course") || "";
  const slug = courseParam || slugifyCC(title);
  return {
    slug,
    courseParam,
    title,
    instr: params.get("instr") || "Dr. Tim Pearce",
    grad: params.get("grad") || "linear-gradient(140deg,#6172f3 0%,#3b82f6 100%)",
    price: Number(params.get("price") || 0)
  };
}

function buildCourseDetailUrlCC(course) {
  if (course.courseParam) return "CourseDetail.html?course=" + course.courseParam;
  const p = new URLSearchParams({ title: course.title, instr: course.instr, grad: course.grad });
  return "CourseDetail.html?" + p.toString();
}

function CourseCheckout() {
  const [course] = useStateCC(getCourseFromQueryCC);
  const [promo, setPromo] = useStateCC("");
  const [paying, setPaying] = useStateCC(false);

  const vat = Math.round(course.price * VAT_RATE_CC);
  const total = course.price + vat;
  const detailUrl = buildCourseDetailUrlCC(course);

  function handlePay() {
    setPaying(true);
    markPurchasedCC(course.slug);
    goCC(detailUrl);
  }

  return (
    <div className="cc-screen" data-screen-label="Course Checkout (mobile)">
      <header className="cc-top">
        <button className="cc-back" aria-label="Back" onClick={() => goCC(detailUrl)}>
          <DSCC.IconifyIcon name="lucide:chevron-left" size={22} color="var(--brand-navy)" />
        </button>
        <h1>Payment Summary</h1>
      </header>

      <div className="cc-scroll">
        <section className="cc-intro">
          <h2>Review &amp; confirm</h2>
          <p>You're one step away from unlocking this course.</p>
        </section>

        <div className="cc-plan-card">
          <span className="cc-plan-icon" style={{ background: course.grad }}>
            <DSCC.IconifyIcon name="lucide:play-circle" size={22} color="#fff" />
          </span>
          <div className="cc-plan-info">
            <h3>{course.title}</h3>
            <p>with {course.instr}</p>
          </div>
        </div>

        <section className="cc-section">
          <h4>Order summary</h4>
          <div className="cc-summary-card">
            <div className="cc-summary-row">
              <span>Course price</span>
              <span>£{course.price.toLocaleString()}</span>
            </div>
            <div className="cc-summary-row">
              <span>VAT (20%)</span>
              <span>£{vat.toLocaleString()}</span>
            </div>
            <div className="cc-summary-row cc-summary-total">
              <span>Total due today</span>
              <span>£{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="cc-promo-row">
            <DSCC.IconifyIcon name="lucide:tag" size={15} color="var(--gray-400)" />
            <input
              className="cc-promo-input"
              type="text"
              placeholder="Add promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button type="button" className="cc-promo-apply">Apply</button>
          </div>
        </section>

        <section className="cc-section">
          <h4>Payment method</h4>
          <div className="cc-payment-card selected">
            <span className="cc-payment-icon">
              <DSCC.IconifyIcon name="lucide:credit-card" size={18} color="var(--brand-navy)" />
            </span>
            <div className="cc-payment-info">
              <h3>Visa ending 4242</h3>
              <p>Expires 08/28</p>
            </div>
            <DSCC.IconifyIcon name="lucide:check-circle-2" size={20} color="var(--brand-navy)" />
          </div>
          <button type="button" className="cc-add-payment">
            <DSCC.IconifyIcon name="lucide:plus" size={14} color="var(--brand-navy)" /> Add another payment method
          </button>

          <p className="cc-lifetime-note">
            <DSCC.IconifyIcon name="lucide:info" size={14} color="var(--gray-400)" />
            One-time payment. Lifetime access to this course once paid.
          </p>
        </section>
      </div>

      <div className="cc-footer">
        <div className="cc-footer-row">
          <span>Total due today</span>
          <span>£{total.toLocaleString()}</span>
        </div>
        <button type="button" className="cc-cta" disabled={paying} onClick={handlePay}>
          <DSCC.IconifyIcon name="lucide:lock" size={15} color="#fff" /> {paying ? "Processing…" : "Pay & Enroll"}
        </button>
        <p className="cc-footer-secure">
          <DSCC.IconifyIcon name="lucide:shield-check" size={13} color="var(--gray-400)" />
          Secured by Stripe · 256-bit encryption
        </p>
      </div>
    </div>);
}

function CourseCheckoutApp() {
  const mobile = useIsMobileCC();
  const scale = useDeviceScaleCC();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(217, 218, 225)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><CourseCheckout /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><CourseCheckout /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CourseCheckoutApp />);
