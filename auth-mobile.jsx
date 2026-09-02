/* ===========================================================================
   PROfinity — Login / Sign-up / Onboarding (mobile) · iPhone 17 Pro Max
   Names suffixed -AU so this file can share the global Babel scope.
   =========================================================================== */
const DSAU = window.ProfinityDesignSystem_c2b5cc;
const { useState: useStateAU, useEffect: useEffectAU } = React;
const IOSDeviceAU = window.IOSDevice;
const Ico = ({ n, s = 20, c = "var(--gray-450)" }) => <DSAU.IconifyIcon name={n} size={s} color={c} />;
function goAU(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function getParamAU(name) {
  try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
}

const AU_STEPS = ["User type", "Details", "Goal"];

const AU_QUESTIONS = [
  "Why did you choose to become an aesthetic practitioner, and what's the impact you dream of making for your clients?",
  "What's the one thing in your business that keeps you up at night, and how would solving it change your life?",
  "Who or what inspires you to keep pushing forward in your business, even on the toughest days?",
  "If you could wave a magic wand and change one thing about running your practice, what would it be?",
  "What does success as an aesthetic practitioner look like for you?",
];

function Brand() {
  return (
    <div className="au-brand">
      <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div className="au-steps" role="list" aria-label="Sign-up progress">
      {AU_STEPS.map((s, i) => (
        <div className={"au-step" + (i <= step ? " on" : "")} key={s} role="listitem"
          aria-current={i === step ? "step" : undefined}>
          <span className="au-step-lbl">{s}</span>
          <span className="au-step-dot" />
          <span className="au-step-line" />
        </div>
      ))}
    </div>
  );
}

function PwField({ label, value, onChange, placeholder = "***********" }) {
  const [show, setShow] = useStateAU(false);
  return (
    <div className="au-field">
      <label className="au-label">{label}</label>
      <div className="au-input">
        <Ico n="lucide:lock" />
        <input type={show ? "text" : "password"} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} aria-label={label} />
        <button type="button" className="au-eye" onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}>
          <Ico n={show ? "lucide:eye-off" : "lucide:eye"} s={19} />
        </button>
      </div>
    </div>
  );
}

function TextField({ label, icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="au-field">
      <label className="au-label">{label}</label>
      <div className="au-input">
        <Ico n={icon} />
        <input type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} aria-label={label} />
      </div>
    </div>
  );
}

function Social({ mode }) {
  return (
    <React.Fragment>
      <div className="au-or">Or sign {mode} with</div>
      <button type="button" className="au-social">
        <Ico n="logos:google-icon" s={20} c="currentColor" />Continue with Google
      </button>
      <button type="button" className="au-social">
        <Ico n="lucide:apple" s={20} c="var(--text-primary)" />Continue with Apple
      </button>
    </React.Fragment>
  );
}

/* ---------------------------------- SIGN IN ------------------------------- */
function SignIn({ onSignUp, onDone, onForgot }) {
  const [email, setEmail] = useStateAU("");
  const [pw, setPw] = useStateAU("");
  const [remember, setRemember] = useStateAU(false);
  return (
    <div className="au-screen" data-screen-label="Sign in (mobile)">
      <div className="au-scroll">
        <div className="au-help"><a href="#" onClick={(e) => e.preventDefault()}>Need Help?</a></div>
        <h1 className="au-h1">Welcome Back!</h1>
        <p className="au-sub">Hello, you must login first to be able to use the application and enjoy all the features on this app.</p>

        <TextField label="Email" icon="lucide:mail" type="email" placeholder="Enter Email" value={email} onChange={setEmail} />
        <PwField label="Password" value={pw} onChange={setPw} />

        <div className="au-row">
          <button type="button" className={"au-check" + (remember ? " on" : "")} role="checkbox"
            aria-checked={remember} onClick={() => setRemember((v) => !v)}>
            <span className="au-check-box">{remember && <Ico n="lucide:check" s={14} c="#fff" />}</span>
            Remember Me
          </button>
          <button type="button" className="au-link" onClick={onForgot}>Forgot Password</button>
        </div>

        <button type="button" className="au-cta" onClick={onDone}>Sign In</button>
        <Social mode="in" />

        <p className="au-foot">Don't have an account? <button type="button" onClick={onSignUp}>Sign up</button></p>
        <div className="au-legal">
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a><span>|</span>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms and Condition</a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ STEP 1 · TYPE ----------------------------- */
/* Raw-JSON Lottie (the /embed iframe caches aggressively). */
function AULottie({ src, size }) {
  const host = React.useRef(null);
  React.useEffect(() => {
    let anim, iv;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: true, path: src });
    };
    if (window.lottie) start();
    else {
      iv = setInterval(() => { if (window.lottie) { clearInterval(iv); start(); } }, 120);
      setTimeout(() => clearInterval(iv), 8000);
    }
    return () => { if (iv) clearInterval(iv); if (anim) anim.destroy(); };
  }, [src]);
  return <span ref={host} style={{ display: "block", width: size, height: size }} />;
}

const AU_TYPES = [
  { k: "clinician", lottie: "https://lottie.host/302e0f00-99b9-4be7-92cd-7318c6b76559/N7Cv2xlAcn.json", t: "Clinician", s: "Delivering expert care with confidence." },
  { k: "patient", lottie: "https://lottie.host/6d606005-0f87-454f-8093-a754defbb877/32xh9U5eNK.json", t: "Patient", s: "Your journey to better health starts here." },
];

function StepType({ type, setType, onBack, onNext }) {
  return (
    <div className="au-screen" data-screen-label="Sign up · user type">
      <div className="au-scroll">
        <Brand />
        <Stepper step={0} />
        <div className="au-sec">
          <Ico n="fluent-emoji-flat:busts-in-silhouette" s={24} c="currentColor" />
          <h2>Choose your user type</h2>
        </div>
        <p className="au-sec-sub">Tell us who you are to get started.</p>
        <div className="au-types" role="radiogroup" aria-label="User type">
          {AU_TYPES.map((t) => (
            <button type="button" key={t.k} role="radio" aria-checked={type === t.k}
              className={"au-type" + (type === t.k ? " on" : "")} onClick={() => setType(t.k)}>
              <span className="au-type-ic"><AULottie src={t.lottie} size={68} /></span>
              <span className="au-type-tx"><span className="t">{t.t}</span><span className="s">{t.s}</span></span>
            </button>
          ))}
        </div>
      </div>
      <div className="au-nav">
        <button type="button" className="au-back" onClick={onBack}>Back</button>
        <button type="button" className="au-next" onClick={onNext} disabled={!type}>Next</button>
      </div>
    </div>
  );
}

/* ---------------------------- STEP 2 · DETAILS ---------------------------- */
function StepDetails({ type, onBack, onNext, onEmail }) {
  const [name, setName] = useStateAU("");
  const [email, setEmail] = useStateAU("");
  const [pw, setPw] = useStateAU("");
  const [pw2, setPw2] = useStateAU("");
  const [agree, setAgree] = useStateAU(false);
  return (
    <div className="au-screen" data-screen-label="Sign up · personal details">
      <div className="au-scroll">
        <Brand />
        <Stepper step={1} />
        <div className="au-sec">
          <Ico n="fluent-emoji-flat:identification-card" s={24} c="currentColor" />
          <h2>Personal Details</h2>
        </div>
        <p className="au-sec-sub">Create your {type === "patient" ? "patient" : "clinician"} account to start your journey.</p>

        <TextField label="Name" icon="lucide:user" placeholder="Full Name" value={name} onChange={setName} />
        <TextField label="Email" icon="lucide:mail" type="email" placeholder="Enter Email" value={email} onChange={setEmail} />
        <PwField label="Create Password" value={pw} onChange={setPw} />
        <PwField label="Confirm Password" value={pw2} onChange={setPw2} />

        <div className="au-terms">
          <button type="button" className={"au-check" + (agree ? " on" : "")} role="checkbox"
            aria-checked={agree} onClick={() => setAgree((v) => !v)}>
            <span className="au-check-box">{agree && <Ico n="lucide:check" s={14} c="#fff" />}</span>
            <span>By creating an account, you agree to our <b>Terms and Condition</b></span>
          </button>
        </div>

        <Social mode="up" />
      </div>
      <div className="au-nav">
        <button type="button" className="au-back" onClick={onBack}>Back</button>
        <button type="button" className="au-next" onClick={() => { if (onEmail) onEmail(email); onNext(); }} disabled={!agree}>Next</button>
      </div>
    </div>
  );
}

/* ----------------------------- STEP 3 · GOALS ----------------------------- */
function StepGoals({ onBack, onDone }) {
  const [about, setAbout] = useStateAU("");
  const [answers, setAnswers] = useStateAU(AU_QUESTIONS.map(() => ""));
  const set = (i, v) => setAnswers((a) => a.map((x, j) => (j === i ? v : x)));
  return (
    <div className="au-screen" data-screen-label="Sign up · personal goals">
      <div className="au-scroll">
        <Brand />
        <Stepper step={2} />
        <div className="au-sec">
          <Ico n="fluent-emoji-flat:direct-hit" s={24} c="currentColor" />
          <h2>Personal Goals</h2>
        </div>
        <p className="au-sec-sub">Define what you want to achieve and track your progress.</p>

        <label className="au-label" htmlFor="au-about">Tell us about yourself</label>
        <textarea id="au-about" className="au-area" placeholder="Tell us about yourself" rows={2}
          value={about} onChange={(e) => setAbout(e.target.value)} />

        {AU_QUESTIONS.map((q, i) => (
          <div key={i}>
            <p className="au-q">{q}</p>
            <textarea className="au-area" rows={2} aria-label={q} value={answers[i]} onChange={(e) => set(i, e.target.value)} />
          </div>
        ))}
      </div>
      <div className="au-nav">
        <button type="button" className="au-back" onClick={onBack}>Back</button>
        <button type="button" className="au-next" onClick={onDone}>Complete</button>
      </div>
    </div>
  );
}

/* --------------------------------- SPLASH --------------------------------- */
function Splash({ onGo }) {
  React.useEffect(() => {
    const t = setTimeout(onGo, 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <button type="button" className="au-splash" data-screen-label="Splash" onClick={onGo} aria-label="Continue to sign in">
      <span className="au-splash-mark">PRO<i>finity</i></span>
      <span className="au-splash-foot">Navigating healthcare doesn't have to be overwhelming. At PROfinity, we believe meaningful, clear communication between clinicians and patients is the foundation of better outcomes.</span>
    </button>
  );
}

/* ---------------------------- FORGOT PASSWORD ----------------------------- */
function ForgotSheet({ onClose, onSent }) {
  const [email, setEmail] = useStateAU("");
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.focus(); }, []);
  return (
    <div className="au-modal" role="dialog" aria-modal="true" aria-label="Forgot password"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <button type="button" className="au-modal-scrim" aria-label="Close" onClick={onClose} />
      <div className="au-modal-card">
        <h2>Forgot Password</h2>
        <p>Enter your email address below and we'll send you a link to reset your password.</p>
        <div className="au-field">
          <label className="au-label">Email address</label>
          <div className="au-input">
            <Ico n="lucide:mail" />
            <input ref={ref} type="email" placeholder="Enter email address" value={email}
              onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
          </div>
        </div>
        <div className="au-modal-nav">
          <button type="button" className="au-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="au-cta compact" onClick={onSent}>Send the Link</button>
        </div>
        <p className="au-modal-foot">Remember your password? <button type="button" onClick={onClose}>Sign in</button></p>
      </div>
    </div>
  );
}

/* --------------------------- RESET LINK SENT ------------------------------ */
function ResetSent({ onBack }) {
  return (
    <div className="au-screen" data-screen-label="Reset link sent">
      <div className="au-done">
        <span className="au-done-ic"><Ico n="lucide:check" s={40} c="#fff" /></span>
        <h1>Successfully</h1>
        <p>A password reset link has been sent to the email you provided. Please check your inbox and follow the instructions to reset your password. If you don't see the email, check your spam or junk folder.</p>
        <button type="button" className="au-link strong" onClick={onBack}>Back to Login</button>
      </div>
      <p className="au-support"><a href="#" onClick={(e) => e.preventDefault()}>Need help</a>? Contact our support team.</p>
    </div>
  );
}

/* --------------------------- EMAIL VERIFICATION --------------------------- */
function OtpVerify({ email, onBack, onVerified }) {
  const [code, setCode] = useStateAU(["", "", "", ""]);
  const refs = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)];
  React.useEffect(() => { if (refs[0].current) refs[0].current.focus(); }, []);
  const set = (i, v) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setCode((c) => c.map((x, j) => (j === i ? d : x)));
    if (d && i < 3 && refs[i + 1].current) refs[i + 1].current.focus();
  };
  const filled = code.every((c) => c !== "");
  return (
    <div className="au-screen" data-screen-label="Email verification">
      <div className="au-scroll">
        <Brand />
        <div className="au-otp-wrap">
          <span className="au-otp-shield"><Ico n="fluent-emoji-flat:locked-with-key" s={44} c="currentColor" /></span>
          <h1 className="au-otp-h1">Email Verification</h1>
          <p className="au-otp-p">Please check your email (<a href="#" onClick={(e) => e.preventDefault()}>{email || "mail@mail.com"}</a>) for the OTP code.</p>
          <div className="au-otp" role="group" aria-label="One-time code">
            {code.map((c, i) => (
              <input key={i} ref={refs[i]} className="au-otp-box" inputMode="numeric" maxLength={1}
                value={c} placeholder="0" aria-label={"Digit " + (i + 1)}
                onChange={(e) => set(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !c && i > 0 && refs[i - 1].current) refs[i - 1].current.focus(); }} />
            ))}
          </div>
          <button type="button" className="au-link" onClick={() => setCode(["", "", "", ""])}>Resend</button>
        </div>
      </div>
      <div className="au-nav">
        <button type="button" className="au-back" onClick={onBack}>Back</button>
        <button type="button" className="au-next" onClick={onVerified} disabled={!filled}>Verify</button>
      </div>
    </div>
  );
}

function VerifySuccess({ onNext }) {
  React.useEffect(() => {
    const t = setTimeout(onNext, 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="au-screen" data-screen-label="Verification success">
      <div className="au-done">
        <span className="au-done-ic"><Ico n="lucide:check" s={40} c="#fff" /></span>
        <h1>Verification Success!</h1>
        <p>Your email is confirmed. Let's set up your goals.</p>
        <button type="button" className="au-cta" onClick={onNext}>Continue</button>
      </div>
    </div>
  );
}

/* ------------------------------ DAILY REWARD ------------------------------ */
function DailyReward({ onDone, points, kicker, title, sub }) {
  const TOTAL = points || 1000;
  const [n, setN] = useStateAU(0);
  const [phase, setPhase] = useStateAU("in");
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(TOTAL); setPhase("done"); return undefined; }
    let raf, t0 = null;
    const dur = 1300, delay = 620;
    const start = setTimeout(function tick() {
      raf = requestAnimationFrame(function step(ts) {
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(TOTAL * eased));
        if (p < 1) raf = requestAnimationFrame(step);
        else setPhase("done");
      });
    }, delay);
    return () => { clearTimeout(start); if (raf) cancelAnimationFrame(raf); };
  }, []);
  const sparks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <div className={"au-reward " + phase} data-screen-label="Daily reward" role="dialog" aria-modal="true" aria-label="Daily login reward">
      <button type="button" className="au-rw-scrim" aria-label="Close" onClick={onDone} />
      <div className="au-rw-card">
      <div className="au-rw-burst" aria-hidden="true">
        {sparks.map((i) => <span key={i} className="au-rw-spark" style={{ "--i": i }} />)}
        <span className="au-rw-ring" style={{ display: "none" }} />
        <span className="au-rw-ring d2" style={{ display: "none" }} />
        <span className="au-rw-coin">
          <AULottie src="https://lottie.host/cc6c5973-9f61-481c-85ed-0fe2089a9176/CwHL9yTPJJ.json" size={168} />
        </span>
      </div>
      <p className="au-rw-kicker">{kicker || "Daily login reward"}</p>
      <p className="au-rw-points" aria-live="polite">
        <b>+{n.toLocaleString()}</b><i>points</i>
      </p>
      <h1 className="au-rw-h1">{title || "Nice work, Katy!"}</h1>
      <p className="au-rw-sub">{sub || "You've earned today's points just for showing up. Keep your streak going to unlock bonus rewards."}</p>
      <button type="button" className="au-cta" onClick={onDone}>Collect &amp; continue</button>
      </div>
    </div>
  );
}

/* -------------------------------- COMPLETE -------------------------------- */
function Complete() {
  const [claimed, setClaimedAU] = useStateAU(false);
  return (
    <div className="au-screen" data-screen-label="Sign up · complete">
      {!claimed &&
        <DailyReward points={250} kicker="Welcome bonus" title="You're all set, Katy!"
          sub="Here's 250 points just for joining — keep learning and connecting to earn more."
          onDone={() => setClaimedAU(true)} />}
      <div className="au-done">
        <span className="au-done-ic"><Ico n="lucide:check" s={40} c="var(--success)" /></span>
        <h1>You're all set!</h1>
        <p>Your Prosperity Spiral is ready. Let's get you to your dream clinic.</p>
        <button type="button" className="au-cta" onClick={() => {
          try { localStorage.setItem("pf-tour", "1"); localStorage.setItem("pf-tour-step", "welcome"); } catch (e) {}
          goAU("NewsfeedMobile.html");
        }}>
          Take the tour
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- APP ----------------------------------- */
const AU_LINKABLE_VIEWS = ["splash", "signin", "type", "details", "otp", "verified", "goals", "done"];

function useDeviceScaleAU() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateAU(calc);
  useEffectAU(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function AuthMobileApp() {
  const requested = getParamAU("view");
  const [view, setView] = useStateAU(AU_LINKABLE_VIEWS.includes(requested) ? requested : "splash");
  const [type, setType] = useStateAU("clinician");
  const [email, setEmail] = useStateAU("");
  const [forgot, setForgot] = useStateAU(false);
  const scale = useDeviceScaleAU();
  const go = (v) => setView(v);
  return (
    <div className="app device-stage" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(216, 218, 226)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
      <IOSDeviceAU width={440} height={956}>
        {view === "splash" && <Splash onGo={() => go("signin")} />}
        {view === "reward" &&
          <React.Fragment>
            <SignIn onSignUp={() => {}} onForgot={() => {}} onDone={() => {}} />
            <DailyReward onDone={() => {
              try { localStorage.setItem("pf-tour", "1"); localStorage.setItem("pf-tour-step", "welcome"); } catch (e) {}
              goAU("NewsfeedMobile.html");
            }} />
          </React.Fragment>}
        {view === "signin" &&
          <React.Fragment>
            <SignIn onSignUp={() => go("type")} onForgot={() => setForgot(true)}
              onDone={() => go("reward")} />
            {forgot && <ForgotSheet onClose={() => setForgot(false)} onSent={() => { setForgot(false); go("sent"); }} />}
          </React.Fragment>}
        {view === "sent" && <ResetSent onBack={() => go("signin")} />}
        {view === "type" && <StepType type={type} setType={setType} onBack={() => go("signin")} onNext={() => go("details")} />}
        {view === "details" && <StepDetails type={type} onEmail={setEmail} onBack={() => go("type")} onNext={() => go("otp")} />}
        {view === "otp" && <OtpVerify email={email} onBack={() => go("details")} onVerified={() => go("verified")} />}
        {view === "verified" && <VerifySuccess onNext={() => go("goals")} />}
        {view === "goals" && <StepGoals onBack={() => go("details")} onDone={() => go("done")} />}
        {view === "done" && <Complete />}
      </IOSDeviceAU>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AuthMobileApp />);
