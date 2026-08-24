/* ===========================================================================
   PROfinity — Sign in / Sign up / Onboarding (web)
   Desktop counterpart to auth-mobile.jsx. Split-screen sign-in, single-column
   sign-up wizard (User type → Details → Goals), done + logged-out states.
   Views are linkable via ?view= so other pages can deep-link (e.g. a
   session-expiry redirect to AuthWeb.html?view=loggedout).
   Names suffixed -AW so this file can share the global Babel scope.
   =========================================================================== */
const DSAW = window.ProfinityDesignSystem_c2b5cc;
const { useState: useStateAW, useEffect: useEffectAW, useRef: useRefAW } = React;
const IcoAW = ({ n, s = 20, c = "var(--gray-500)" }) => <DSAW.IconifyIcon name={n} size={s} color={c} />;

function goAW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function getParamAW(name) {
  try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
}
function startTourAW() {
  try {
    localStorage.setItem("pf-tour", "1");
    localStorage.setItem("pf-tour-step", "welcome");
    localStorage.setItem("pf-tour-flavor", "web");
  } catch (e) {}
  goAW("NewsfeedWeb.html");
}

const AW_STEPS = ["User type", "Details", "Goal"];

const AW_QUESTIONS = [
  "Why did you choose to become an aesthetic practitioner, and what's the impact you dream of making for your clients?",
  "What's the one thing in your business that keeps you up at night, and how would solving it change your life?",
  "What does success as an aesthetic practitioner look like for you?",
];

const AW_TYPES = [
  { k: "clinician", lottie: "https://lottie.host/302e0f00-99b9-4be7-92cd-7318c6b76559/N7Cv2xlAcn.json", t: "Clinician", s: "Delivering expert care with confidence." },
  { k: "patient", lottie: "https://lottie.host/6d606005-0f87-454f-8093-a754defbb877/32xh9U5eNK.json", t: "Patient", s: "Your journey to better health starts here." },
];

/* Raw-JSON Lottie (the /embed iframe caches aggressively). */
function AWLottie({ src, size }) {
  const host = useRefAW(null);
  useEffectAW(() => {
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

function Brand({ solo }) {
  return <img className={solo ? "auw-logo-solo" : "auw-logo"} src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />;
}

function Stepper({ step }) {
  return (
    <div className="auw-steps" role="list" aria-label="Sign-up progress">
      <span className="auw-steps-track" aria-hidden="true" />
      <span className="auw-steps-fill" aria-hidden="true" style={{ width: step === 0 ? "0%" : step === 1 ? "33.3%" : "66.6%" }} />
      {AW_STEPS.map((s, i) => (
        <div className={"auw-step" + (i <= step ? " on" : "")} key={s} role="listitem" aria-current={i === step ? "step" : undefined}>
          <span className="auw-step-dot">{i + 1}</span>
          <span className="auw-step-lbl">{s}</span>
        </div>
      ))}
    </div>
  );
}

function PwField({ label, value, onChange, placeholder = "***********" }) {
  const [show, setShow] = useStateAW(false);
  return (
    <div className="auw-field">
      <label className="auw-field-label">{label}</label>
      <div className="auw-input">
        <IcoAW n="lucide:lock" s={19} c="var(--gray-500)" />
        <input type={show ? "text" : "password"} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} aria-label={label} />
        <button type="button" className="auw-eye" onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}>
          <IcoAW n={show ? "lucide:eye-off" : "lucide:eye"} s={18} />
        </button>
      </div>
    </div>
  );
}

function TextField({ label, icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="auw-field">
      <label className="auw-field-label">{label}</label>
      <div className="auw-input">
        <IcoAW n={icon} s={19} />
        <input type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} aria-label={label} />
      </div>
    </div>
  );
}

function Social({ mode }) {
  return (
    <React.Fragment>
      <div className="auw-or">Or sign {mode} with</div>
      <div className="auw-socials">
        <button type="button" className="auw-social">
          <IcoAW n="logos:google-icon" s={20} c="currentColor" />Continue with Google
        </button>
        <button type="button" className="auw-social">
          <IcoAW n="lucide:apple" s={20} c="var(--text-primary)" />Continue with Apple
        </button>
      </div>
    </React.Fragment>
  );
}

/* ---------------------------------- SIGN IN ------------------------------- */
function SignIn({ onSignUp, onDone, onForgot }) {
  const [email, setEmail] = useStateAW("");
  const [pw, setPw] = useStateAW("");
  const [remember, setRemember] = useStateAW(false);
  return (
    <div className="auw-view" data-screen-label="Sign in (web)">
      <div className="auw-head">
        <Brand />
        <a className="auw-help" href="#" onClick={(e) => e.preventDefault()}>Need Help?</a>
      </div>
      <h1 className="auw-h1">Welcome Back!</h1>
      <span className="auw-accent" />
      <p className="auw-sub">Hello, you must login first to be able to use the application and enjoy all the features on this app.</p>

      <div className="auw-fields">
        <TextField label="Email" icon="lucide:mail" type="email" placeholder="Enter Email" value={email} onChange={setEmail} />
        <PwField label="Password" value={pw} onChange={setPw} />
      </div>

      <div className="auw-row">
        <button type="button" className={"auw-check" + (remember ? " on" : "")} role="checkbox"
          aria-checked={remember} onClick={() => setRemember((v) => !v)}>
          <span className="auw-check-box">{remember && <IcoAW n="lucide:check" s={13} c="#fff" />}</span>
          Remember Me
        </button>
        <button type="button" className="auw-link" onClick={onForgot}>Forgot Password</button>
      </div>

      <button type="button" className="auw-cta" onClick={onDone}>Sign In</button>
      <Social mode="in" />

      <p className="auw-foot">Don't have an account? <button type="button" onClick={onSignUp}>Sign up</button></p>
      <div className="auw-legal">
        <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a><span>|</span>
        <a href="#" onClick={(e) => e.preventDefault()}>Terms and Condition</a>
      </div>
    </div>
  );
}

/* ------------------------------ STEP 1 · TYPE ----------------------------- */
function StepType({ type, setType, onBack, onNext }) {
  return (
    <div className="auw-view" data-screen-label="Sign up · user type">
      <Brand solo />
      <Stepper step={0} />
      <h1 className="auw-sec-h1">Choose your user type</h1>
      <p className="auw-sec-sub">Tell us who you are to get started.</p>
      <div className="auw-types" role="radiogroup" aria-label="User type">
        {AW_TYPES.map((t) => (
          <button type="button" key={t.k} role="radio" aria-checked={type === t.k}
            className={"auw-type" + (type === t.k ? " on" : "")} onClick={() => setType(t.k)}>
            <span className="auw-type-ic"><AWLottie src={t.lottie} size={72} /></span>
            <span className="auw-type-tx"><span className="t">{t.t}</span><span className="s">{t.s}</span></span>
          </button>
        ))}
      </div>
      <p className="auw-foot">Already have an account? <button type="button" onClick={onBack}>Sign in</button></p>
      <div className="auw-stepnav">
        <button type="button" className="auw-back" onClick={onBack}>Back</button>
        <button type="button" className="auw-next" onClick={onNext} disabled={!type}>Next</button>
      </div>
    </div>
  );
}

/* ---------------------------- STEP 2 · DETAILS ---------------------------- */
function StepDetails({ type, onBack, onNext }) {
  const [name, setName] = useStateAW("");
  const [email, setEmail] = useStateAW("");
  const [pw, setPw] = useStateAW("");
  const [pw2, setPw2] = useStateAW("");
  const [agree, setAgree] = useStateAW(false);
  return (
    <div className="auw-view" data-screen-label="Sign up · personal details">
      <Brand solo />
      <Stepper step={1} />
      <h1 className="auw-sec-h1">Personal Details</h1>
      <p className="auw-sec-sub">Create your {type === "patient" ? "patient" : "clinician"} account to start your journey.</p>

      <div className="auw-fields">
        <TextField label="Name" icon="lucide:user" placeholder="Full Name" value={name} onChange={setName} />
        <TextField label="Email" icon="lucide:mail" type="email" placeholder="Enter Email" value={email} onChange={setEmail} />
        <PwField label="Create Password" value={pw} onChange={setPw} />
        <PwField label="Confirm Password" value={pw2} onChange={setPw2} />
      </div>

      <div className="auw-terms">
        <button type="button" className={"auw-check" + (agree ? " on" : "")} role="checkbox"
          aria-checked={agree} onClick={() => setAgree((v) => !v)}>
          <span className="auw-check-box">{agree && <IcoAW n="lucide:check" s={13} c="#fff" />}</span>
          <span>By creating an account, you agree to our <b>Terms and Condition</b></span>
        </button>
      </div>

      <Social mode="up" />

      <div className="auw-stepnav">
        <button type="button" className="auw-back" onClick={onBack}>Back</button>
        <button type="button" className="auw-next" onClick={onNext} disabled={!agree}>Next</button>
      </div>
    </div>
  );
}

/* ----------------------------- STEP 3 · GOALS ----------------------------- */
function StepGoals({ onBack, onDone }) {
  const [about, setAbout] = useStateAW("");
  const [answers, setAnswers] = useStateAW(AW_QUESTIONS.map(() => ""));
  const set = (i, v) => setAnswers((a) => a.map((x, j) => (j === i ? v : x)));
  return (
    <div className="auw-view" data-screen-label="Sign up · personal goals">
      <Brand solo />
      <Stepper step={2} />
      <h1 className="auw-sec-h1">Personal Goals</h1>
      <p className="auw-sec-sub">Define what you want to achieve and track your progress.</p>

      <div className="auw-goal">
        <div>
          <label className="auw-q" htmlFor="auw-about">Tell us about yourself</label>
          <textarea id="auw-about" className="auw-area" placeholder="Tell us about yourself" rows={2}
            value={about} onChange={(e) => setAbout(e.target.value)} />
        </div>
        {AW_QUESTIONS.map((q, i) => (
          <div key={i}>
            <p className="auw-q">{q}</p>
            <textarea className="auw-area" rows={2} aria-label={q} value={answers[i]} onChange={(e) => set(i, e.target.value)} />
          </div>
        ))}
      </div>

      <div className="auw-stepnav">
        <button type="button" className="auw-back" onClick={onBack}>Back</button>
        <button type="button" className="auw-next" onClick={onDone}>Complete</button>
      </div>
    </div>
  );
}

/* --------------------------- FORGOT PASSWORD ------------------------------ */
function ForgotModal({ onClose, onSent, sent }) {
  const [email, setEmail] = useStateAW("");
  const ref = useRefAW(null);
  useEffectAW(() => { if (ref.current) ref.current.focus(); }, []);
  return (
    <div className="auw-modal" role="dialog" aria-modal="true" aria-label="Forgot password"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <button type="button" className="auw-modal-scrim" aria-label="Close" onClick={onClose} />
      <div className="auw-modal-card">
        <h2>Forgot Password</h2>
        <p>Enter your email address below and we'll send you a link to reset your password.</p>
        <div className="auw-field">
          <label className="auw-field-label">Email address</label>
          <div className="auw-input">
            <IcoAW n="lucide:mail" s={19} />
            <input ref={ref} type="email" placeholder="Enter email address" value={email}
              onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
          </div>
        </div>
        {sent && (
          <p className="auw-modal-sent"><IcoAW n="lucide:check-circle" s={16} c="var(--success)" />Reset link sent — check your inbox.</p>
        )}
        <div className="auw-modal-nav">
          <button type="button" className="auw-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="auw-cta" onClick={() => onSent(email)}>Send the Link</button>
        </div>
        <p className="auw-modal-foot">Remember your password? <button type="button" onClick={onClose}>Sign in</button></p>
      </div>
    </div>
  );
}

/* -------------------------------- COMPLETE -------------------------------- */
function Complete() {
  return (
    <div className="auw-view" data-screen-label="Sign up · complete">
      <div className="auw-done">
        <Brand solo />
        <span className="auw-done-ic success" style={{ marginTop: 48 }}><IcoAW n="lucide:check" s={44} c="#fff" /></span>
        <h1>You're all set!</h1>
        <p>Your Prosperity Spiral is ready. Let's get you to your dream clinic.</p>
        <button type="button" className="auw-cta" onClick={startTourAW}>Take the tour</button>
        <a className="auw-skip" href="NewsfeedWeb.html">Skip to Home</a>
      </div>
    </div>
  );
}

/* ------------------------------- LOGGED OUT -------------------------------- */
function LoggedOut({ onSignIn }) {
  return (
    <div className="auw-view" data-screen-label="Logged out">
      <div className="auw-done">
        <Brand solo />
        <span className="auw-done-ic out" style={{ marginTop: 48 }}><IcoAW n="lucide:log-out" s={40} c="var(--brand-navy)" /></span>
        <h1>You've been logged out</h1>
        <p>Thanks for spending time with the community, Katy. Your progress is saved — sign back in whenever you're ready.</p>
        <button type="button" className="auw-cta" onClick={onSignIn}>Sign back in</button>
      </div>
    </div>
  );
}

/* ---------------------------------- APP ----------------------------------- */
const AW_LINKABLE_VIEWS = ["signin", "signup", "done", "loggedout"];

function AuthWebApp() {
  const requested = getParamAW("view");
  const [view, setView] = useStateAW(AW_LINKABLE_VIEWS.includes(requested) ? requested : "signin");
  const [step, setStep] = useStateAW(0);
  const [type, setType] = useStateAW("clinician");
  const [forgot, setForgot] = useStateAW(false);
  const [sent, setSent] = useStateAW(false);

  const goSignUp = () => { setStep(0); setView("signup"); };
  const goSignIn = () => { setForgot(false); setSent(false); setView("signin"); };
  const back = () => (step === 0 ? goSignIn() : setStep((s) => s - 1));
  const next = () => (step === 2 ? setView("done") : setStep((s) => s + 1));

  const isSignIn = view === "signin";
  const wide = view === "signup" || view === "done" || view === "loggedout";

  return (
    <div className="auw-shell" style={{ gridTemplateColumns: isSignIn ? "440px minmax(0,1fr)" : "minmax(0,1fr)" }}>
      {isSignIn && (
        <aside className="auw-aside">
          <span className="auw-aside-orb a" aria-hidden="true" />
          <span className="auw-aside-orb b" aria-hidden="true" />
          <div className="auw-aside-in">
            <img className="auw-aside-mark" src="assets/profinity-diamond.png" alt="" />
            <h2>The path to your dream clinic.</h2>
            <p>Connect, learn, and grow with a community of expert clinicians.</p>
            <div className="auw-aside-stats">
              <div className="auw-aside-stat"><b>12k+</b><i>Clinicians</i></div>
              <div className="auw-aside-stat"><b>240+</b><i>Courses</i></div>
              <div className="auw-aside-stat"><b>98%</b><i>Recommend</i></div>
            </div>
          </div>
        </aside>
      )}
      <div className="auw-main">
        <div style={{ width: "100%", maxWidth: wide ? 640 : 520 }}>
          {view === "signin" && (
            <SignIn onSignUp={goSignUp} onForgot={() => { setSent(false); setForgot(true); }} onDone={() => goAW("NewsfeedWeb.html")} />
          )}
          {view === "signup" && step === 0 && <StepType type={type} setType={setType} onBack={goSignIn} onNext={next} />}
          {view === "signup" && step === 1 && <StepDetails type={type} onBack={back} onNext={next} />}
          {view === "signup" && step === 2 && <StepGoals onBack={back} onDone={next} />}
          {view === "done" && <Complete />}
          {view === "loggedout" && <LoggedOut onSignIn={goSignIn} />}
        </div>
      </div>
      {forgot && (
        <ForgotModal onClose={() => setForgot(false)} sent={sent}
          onSent={() => setSent(true)} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AuthWebApp />);
