/* ===========================================================================
   PROfinity — Katy · Rewards Store (Screen 12) · iPhone 17 Pro Max
   Spendable Credits buy discounts on specific courses. Every card carries
   the course's own thumbnail, a "% OFF" sticker and a navy Redeem button that
   is simply disabled when Katy can't afford it yet. Gold hero with the smiley mascot and the
   balance, a bottom-sheet confirm with a coin animation and a confetti burst
   on redeem. Redeeming deducts credits via window.PFLoyalty (which also
   stores the discount for CourseCheckout) and routes to Redemption Success.
   Suffixed -STR.
   =========================================================================== */
const { useState: useStateSTR, useMemo: useMemoSTR, useRef: useRefSTR, useEffect: useEffectSTR } = React;
const DSSTR = window.ProfinityDesignSystem_c2b5cc;
const PF_STR = window.PFLoyalty;

function goSTR(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* hero mascot + the coin animation the Rewards Dashboard stat card uses */
const STR_LOTTIE = {
  /* the smiling-face mascot shared with the header points pill and Rewards card */
  smiley: "https://lottie.host/f5203bff-edd1-4727-a629-2a619bbe4edc/ArWGbXL6R3.json",
  coin: "https://lottie.host/c7c98875-fe8d-4de8-95c1-3e12acf7ad0a/fpeaeGfS64.json",
};

/* category chips + a fallback tone for any item without a thumbnail */
const STR_CATEGORY_ICONS = { Filler: "lucide:syringe", Lips: "lucide:smile", Safety: "lucide:shield-check", Masterclass: "lucide:graduation-cap", Membership: "lucide:crown", Anatomy: "lucide:scan-face" };
const STR_TONE_DEFAULT = { a: "#FFE3A3", b: "#FFC65C", ink: "#8A5303" };
function iconForSTR(item) { return item.icon || STR_CATEGORY_ICONS[item.category] || "lucide:book-open"; }
function toneForSTR() { return STR_TONE_DEFAULT; }
function poundsSTR(n) { return "£" + Math.round(n).toLocaleString("en-GB"); }
function savingSTR(item) { return item.course ? Math.round(item.course.price * item.course.discountPct / 100) : 0; }

/* sticker rules: the discount always shows; scarcity joins it when stock is low */
function stickerForSTR(item) {
  if (item.inventory != null && item.inventory <= 0) return { text: "Sold out", tone: "grey" };
  if (item.inventory != null && item.inventory <= 5) return { text: "Only " + item.inventory + " left", tone: "rose" };
  return null;
}

/* Lottie from raw JSON via lottie-web (no /embed iframe) */
function STRLottie({ src, size, play = true }) {
  const host = useRefSTR(null);
  useEffectSTR(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: play, path: src });
    };
    if (window.lottie) start();
    else { t = setInterval(() => { if (window.lottie) { clearInterval(t); start(); } }, 120); setTimeout(() => clearInterval(t), 8000); }
    return () => { clearInterval(t); if (anim) anim.destroy(); };
  }, [src]);
  return <span ref={host} style={{ display: "block", width: size, height: size }} aria-hidden="true" />;
}

/* confetti burst from a point, inside the screen so the device frame clips it */
function burstSTR(root, x, y) {
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#F4AD3D", "#FF6B9A", "#5ED3B1", "#8E6BFF", "#4A9BFF", "#FFD76A"];
  const rect = root.getBoundingClientRect();
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("span");
    p.className = "str-confetti";
    const size = 9 + Math.random() * 9;
    p.style.cssText = "left:" + (x - rect.left) + "px;top:" + (y - rect.top) + "px;width:" + size + "px;height:" + (size * (Math.random() > .5 ? 1 : .55)) + "px;background:" + colors[i % colors.length] + ";border-radius:" + (Math.random() > .5 ? "50%" : "2px");
    root.appendChild(p);
    const ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.4;
    const dist = 120 + Math.random() * 220;
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
    const anim = p.animate([
      { transform: "translate(-50%,-50%) rotate(0deg) scale(1)", opacity: 1 },
      { transform: "translate(calc(-50% + " + dx.toFixed(0) + "px), calc(-50% + " + (dy + 140).toFixed(0) + "px)) rotate(" + (Math.random() * 720 - 360) + "deg) scale(.6)", opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.15,.7,.3,1)", fill: "forwards" });
    anim.onfinish = () => p.remove();
  }
}

function StoreHero({ credits, items }) {
  const affordable = items.filter((i) => credits >= i.cost && !(i.inventory != null && i.inventory <= 0)).length;
  return (
    <div className="str-hero" data-screen-label="Balance hero">
      <span className="str-hero-spark s1" /><span className="str-hero-spark s2" /><span className="str-hero-spark s3" />
      <div className="str-hero-row">
        <span className="str-hero-lottie"><STRLottie src={STR_LOTTIE.smiley} size={78} /></span>
        <div className="str-hero-tx">
          <span className="str-hero-eyebrow">Spendable Credits</span>
          <span className="str-hero-num">{PF_STR.formatNumber(credits)}</span>
          <span className="str-hero-sub">{affordable > 0
            ? "Unlock " + affordable + " course discount" + (affordable === 1 ? "" : "s") + " right now"
            : "Keep earning — your first course discount is close"}</span>
        </div>
      </div>
    </div>
  );
}

function StoreConfirm({ item, credits, onCancel, onConfirm }) {
  if (!item) return null;
  return (
    <div className="str-scrim" onClick={onCancel}>
      <div className="str-sheet" role="dialog" aria-modal="true" aria-labelledby="str-sheet-title" onClick={(e) => e.stopPropagation()}>
        <span className="str-sheet-handle" />
        <span className="str-sheet-lottie"><STRLottie src={STR_LOTTIE.coin} size={84} /></span>
        <h2 id="str-sheet-title">Treat yourself!</h2>
        <p className="str-sheet-item">{item.course ? item.course.discountPct + "% off " + item.course.title : item.name}</p>
        {item.course && <p className="str-sheet-save">Save {poundsSTR(savingSTR(item))} · {poundsSTR(item.course.price)} → {poundsSTR(item.course.price - savingSTR(item))}</p>}
        <div className="str-sheet-math">
          <span className="now">{PF_STR.formatNumber(credits)}</span>
          <DSSTR.IconifyIcon name="lucide:arrow-right" size={16} color="var(--gray-450)" />
          <span className="after">{PF_STR.formatNumber(credits - item.cost)}</span>
          <span className="unit">credits</span>
        </div>
        <p className="str-sheet-note">{item.delivery ? item.delivery : "Applied automatically at checkout"}</p>
        <div className="str-confirm-ctas">
          <button className="ml-btn ml-btn-ghost" type="button" onClick={onCancel}>Not now</button>
          <button className="ml-btn str-btn-navy" type="button" onClick={(e) => onConfirm(e)}>Yes, redeem!</button>
        </div>
      </div>
    </div>
  );
}

function StoreCard({ item, credits, index, onRedeem }) {
  const outOfStock = item.inventory != null && item.inventory <= 0;
  const locked = credits < item.cost || outOfStock;
  const tone = toneForSTR(item);
  const sticker = stickerForSTR(item);
  const style = { "--str-a": tone.a, "--str-b": tone.b, "--str-ink": tone.ink, "--str-i": index };
  return (
    <div className={"str-card" + (locked ? " is-locked" : "")} style={style}>
      <div className="str-card-media">
        {item.image
          ? <img src={item.image} alt="" />
          : <span className="str-card-ic"><DSSTR.IconifyIcon name={iconForSTR(item)} size={28} color={tone.ink} /></span>}
        {item.course && <span className="str-sticker off">{item.course.discountPct}% OFF</span>}
        {sticker && <span className={"str-sticker right " + sticker.tone}>{sticker.text}</span>}
      </div>
      <div className="str-card-body">
        <div className="str-card-name">{item.name}</div>
        {item.course
          ? <div className="str-card-desc">Save {poundsSTR(savingSTR(item))} on the {poundsSTR(item.course.price)} course</div>
          : <div className="str-card-desc">{item.description}</div>}
        <span className="str-card-cost"><span className="coin"><DSSTR.IconifyIcon name="lucide:coins" size={12} color="#8A5303" /></span>{PF_STR.formatNumber(item.cost)}</span>
        <button className="str-card-cta" type="button" disabled={locked} onClick={() => onRedeem(item)}>
          {outOfStock ? "Sold out" : "Redeem"}
        </button>
      </div>
    </div>
  );
}

function RewardsStoreScreen() {
  const [config] = useStateSTR(() => PF_STR.getConfig());
  const [state] = useStateSTR(() => PF_STR.getState());
  const [category, setCategory] = useStateSTR("All");
  const [confirmItem, setConfirmItem] = useStateSTR(null);
  const [toast, setToast] = useStateSTR(null);
  const [redeeming, setRedeeming] = useStateSTR(false);
  const screenRef = useRefSTR(null);

  const categories = useMemoSTR(() => ["All"].concat(Array.from(new Set(config.storeItems.map((i) => i.category)))), [config]);
  const items = useMemoSTR(() => category === "All" ? config.storeItems : config.storeItems.filter((i) => i.category === category), [config, category]);
  const credits = state.spendableCredits;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const confirmRedeem = (e) => {
    if (redeeming) return;
    const res = PF_STR.redeemItem(confirmItem.id);
    if (!res.ok) { setConfirmItem(null); showToast(res.reason); return; }
    setRedeeming(true);
    const r = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null;
    const root = screenRef.current;
    const rr = root ? root.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    burstSTR(root, r ? r.left + r.width / 2 : rr.left + rr.width / 2, r ? r.top + r.height / 2 : rr.top + rr.height / 2);
    setTimeout(() => goSTR("RedemptionSuccess.html"), 950);
  };

  return (
    <div className="ml-screen str-screen" data-screen-label="Rewards Store" ref={screenRef}>
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goSTR("RewardsDashboard.html")}><DSSTR.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Rewards Store</h1>
        <span />
      </div>
      <div className="ml-scroll">
        <StoreHero credits={credits} items={config.storeItems} />
        <div className="str-tabs" role="tablist" aria-label="Categories">
          {categories.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={c === category} className={"str-tab" + (c === category ? " is-active" : "")} onClick={() => setCategory(c)}>
              <DSSTR.IconifyIcon name={c === "All" ? "lucide:sparkles" : (STR_CATEGORY_ICONS[c] || "lucide:tag")} size={14} color={c === category ? "#fff" : "var(--gray-500)"} />{c}
            </button>
          ))}
        </div>
        <div className="str-grid" key={category}>
          {items.map((it, i) => <StoreCard key={it.id} item={it} index={i} credits={credits} onRedeem={setConfirmItem} />)}
        </div>
      </div>
      {!redeeming && <StoreConfirm item={confirmItem} credits={credits} onCancel={() => setConfirmItem(null)} onConfirm={confirmRedeem} />}
      {redeeming && <div className="str-redeemed" role="status"><DSSTR.IconifyIcon name="lucide:party-popper" size={18} color="#fff" />Redeemed!</div>}
      {toast && <div className="ml-toast"><DSSTR.IconifyIcon name="lucide:coins" size={16} color="#FDBF38" />{toast}</div>}
    </div>
  );
}

function useDeviceScaleSTR() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSTR(calc);
  React.useEffect(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileSTR() {
  const [mobile, setMobile] = useStateSTR(() => window.matchMedia("(max-width:768px)").matches);
  React.useEffect(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function RewardsStoreApp() {
  const mobile = useIsMobileSTR();
  const scale = useDeviceScaleSTR();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><RewardsStoreScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><RewardsStoreScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<RewardsStoreApp />);
