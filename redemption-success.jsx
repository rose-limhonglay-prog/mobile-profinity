/* ===========================================================================
   PROfinity — Katy · Redemption Success (Screen 14) · iPhone 17 Pro Max
   Confirmation after a Rewards Store redemption. Blush hero with the
   aesthetic-treatment face Lottie and a small check badge, the course card
   with its thumbnail and discounted price (deep link into CourseCheckout so
   the discount is used straight away), a ticket-style voucher code and a
   compact "what happens next" list. Reads the most recent voucher from
   window.PFLoyalty state. Suffixed -RSC.
   =========================================================================== */
const { useState: useStateRSC, useRef: useRefRSC, useEffect: useEffectRSC } = React;
const DSRSC = window.ProfinityDesignSystem_c2b5cc;
const PF_RSC = window.PFLoyalty;
const RSC_LOTTIE = "https://lottie.host/abe8a05d-2743-4457-81d7-be96b381e980/R2WjoRmwVj.json";

function goRSC(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function poundsRSC(n) { return "£" + Math.round(n).toLocaleString("en-GB"); }

function RSCLottie({ src, size }) {
  const host = useRefRSC(null);
  useEffectRSC(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: true, path: src });
    };
    if (window.lottie) start();
    else { t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120); setTimeout(() => clearInterval(t), 8000); }
    return () => { clearInterval(t); if (anim) anim.destroy(); };
  }, [src]);
  return <span ref={host} style={{ display: "block", width: size, height: size }} aria-hidden="true" />;
}

/* a soft confetti drift from the top of the screen when the page lands */
function driftRSC(root) {
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#F4AD3D", "#FF8FAE", "#5ED3B1", "#8E6BFF", "#8DC5FF", "#FFD76A"];
  const w = root.clientWidth;
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("span");
    p.className = "rsc-confetti";
    const size = 7 + Math.random() * 8;
    p.style.cssText = "left:" + (Math.random() * w) + "px;top:-20px;width:" + size + "px;height:" + (size * (Math.random() > .5 ? 1 : .55)) + "px;background:" + colors[i % colors.length] + ";border-radius:" + (Math.random() > .5 ? "50%" : "2px");
    root.appendChild(p);
    const a = p.animate([
      { transform: "translate(0,0) rotate(0deg)", opacity: 0 },
      { opacity: 1, offset: .1 },
      { transform: "translate(" + ((Math.random() - .5) * 120).toFixed(0) + "px, " + (260 + Math.random() * 260).toFixed(0) + "px) rotate(" + (Math.random() * 540 - 270).toFixed(0) + "deg)", opacity: 0 }
    ], { duration: 1800 + Math.random() * 1200, delay: Math.random() * 500, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" });
    a.onfinish = () => p.remove();
  }
}

function RedemptionSuccessScreen() {
  const [state] = useStateRSC(() => PF_RSC.getState());
  const [copied, setCopied] = useStateRSC(false);
  const [mailed, setMailed] = useStateRSC(false);
  const screenRef = useRefRSC(null);
  const voucher = state.redeemedVouchers[state.redeemedVouchers.length - 1];

  useEffectRSC(() => { if (voucher) { const t = setTimeout(() => driftRSC(screenRef.current), 350); return () => clearTimeout(t); } }, []);

  const copyCode = () => {
    if (!voucher) return;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };
  const emailMe = () => { setMailed(true); setTimeout(() => setMailed(false), 1800); };

  if (!voucher) {
    return (
      <div className="ml-screen rsc-screen" data-screen-label="Redemption Success (empty)">
        <div className="ml-top"><button className="ml-back" aria-label="Back" onClick={() => goRSC("RewardsStore.html")}><DSRSC.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button><h1>Redemption</h1><span /></div>
        <div className="ml-empty"><DSRSC.IconifyIcon name="lucide:gift" size={28} color="var(--gray-400)" /><p>No redemption yet — visit the Rewards Store to redeem your first course discount.</p>
          <button className="ml-btn ml-btn-navy ml-btn-sm" type="button" onClick={() => goRSC("RewardsStore.html")}>Go to Rewards Store</button>
        </div>
      </div>
    );
  }

  const item = PF_RSC.getConfig().storeItems.find((i) => i.id === voucher.itemId) || null;
  const course = voucher.course || (item && item.course) || null;
  const saving = course ? Math.round(course.price * course.discountPct / 100) : 0;
  const checkoutUrl = course
    ? "CourseCheckout.html?course=" + encodeURIComponent(course.slug) + "&title=" + encodeURIComponent(course.title) + "&price=" + course.price
    : "RewardsDashboard.html";
  const when = new Date(voucher.redeemedAt);
  const whenLabel = when.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " · " + when.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="ml-screen rsc-screen" data-screen-label="Redemption Success" ref={screenRef}>
      <button className="ml-back rsc-close" aria-label="Close" onClick={() => goRSC("RewardsStore.html")}><DSRSC.IconifyIcon name="lucide:x" size={20} color="var(--gray-900)" /></button>
      <div className="ml-scroll rsc-scroll">
        <div className="rsc-hero">
          <span className="rsc-glow" aria-hidden="true" />
          <div className="rsc-art">
            <RSCLottie src={RSC_LOTTIE} size={200} />
            <span className="rsc-check"><DSRSC.IconifyIcon name="lucide:check" size={22} color="#fff" /></span>
          </div>
          <span className="rsc-eyebrow">Reward claimed</span>
          <h1>{course ? course.discountPct + "% off unlocked!" : "You're all set!"}</h1>
          <p>{course ? "Your discount on " + course.title + " is ready to use." : voucher.itemName}</p>
        </div>

        {course && (
          <div className="rsc-course" style={{ "--rsc-i": 0 }} data-screen-label="Discounted course">
            <div className="rsc-course-media">{item && item.image ? <img src={item.image} alt="" /> : <DSRSC.IconifyIcon name="lucide:book-open" size={24} color="var(--brand-navy)" />}
              <span className="rsc-course-off">{course.discountPct}% OFF</span></div>
            <div className="rsc-course-tx">
              <b>{course.title}</b>
              <span className="rsc-course-price"><s>{poundsRSC(course.price)}</s> {poundsRSC(course.price - saving)} <i>save {poundsRSC(saving)}</i></span>
            </div>
          </div>
        )}

        <div className="rsc-ticket" style={{ "--rsc-i": 1 }}>
          <span className="rsc-ticket-label">Your voucher code</span>
          <div className="rsc-code">{voucher.code}</div>
          <div className="rsc-ticket-tools">
            <button className="rsc-chip" type="button" onClick={copyCode}><DSRSC.IconifyIcon name={copied ? "lucide:check" : "lucide:copy"} size={14} color="var(--brand-navy)" />{copied ? "Copied" : "Copy code"}</button>
            <button className="rsc-chip" type="button" onClick={emailMe}><DSRSC.IconifyIcon name={mailed ? "lucide:check" : "lucide:mail"} size={14} color="var(--brand-navy)" />{mailed ? "Sent" : "Email me"}</button>
          </div>
        </div>

        <div className="rsc-next" style={{ "--rsc-i": 2 }}>
          <div className="rsc-next-h">What happens next</div>
          <ul>
            <li><span className="ic"><DSRSC.IconifyIcon name="lucide:badge-percent" size={17} color="var(--brand-navy)" /></span><span>{item && item.delivery ? item.delivery : "Applied automatically at checkout"}</span></li>
            <li><span className="ic"><DSRSC.IconifyIcon name="lucide:mail" size={17} color="var(--brand-navy)" /></span><span>Confirmation sent to <b>{state.user.email}</b></span></li>
            <li><span className="ic"><DSRSC.IconifyIcon name="lucide:clock" size={17} color="var(--brand-navy)" /></span><span>Redeemed {whenLabel}</span></li>
          </ul>
        </div>

        <div className="rsc-ctas" style={{ "--rsc-i": 3 }}>
          <button className="ml-btn rsc-btn-primary" type="button" onClick={() => goRSC(checkoutUrl)}>{course ? "Use it now" : "Back to Dashboard"}<DSRSC.IconifyIcon name="lucide:arrow-right" size={16} color="#fff" /></button>
          <button className="ml-btn ml-btn-ghost rsc-btn-ghost" type="button" onClick={() => goRSC("RewardsDashboard.html")}>Back to Dashboard</button>
          <button className="rsc-link" type="button" onClick={() => goRSC("MyRewards.html")}>View all my rewards<DSRSC.IconifyIcon name="lucide:chevron-right" size={14} color="var(--brand-navy)" /></button>
        </div>
      </div>
    </div>
  );
}

function useDeviceScaleRSC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRSC(calc);
  React.useEffect(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileRSC() {
  const [mobile, setMobile] = useStateRSC(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function RedemptionSuccessApp() {
  const mobile = useIsMobileRSC();
  const scale = useDeviceScaleRSC();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><RedemptionSuccessScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><RedemptionSuccessScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<RedemptionSuccessApp />);
