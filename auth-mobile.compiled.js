/* ===========================================================================
   PROfinity — Login / Sign-up / Onboarding (mobile) · iPhone 17 Pro Max
   Names suffixed -AU so this file can share the global Babel scope.
   =========================================================================== */
const DSAU = window.ProfinityDesignSystem_c2b5cc;
const {
  useState: useStateAU,
  useEffect: useEffectAU
} = React;
const IOSDeviceAU = window.IOSDevice;
const Ico = ({
  n,
  s = 20,
  c = "var(--gray-450)"
}) => /*#__PURE__*/React.createElement(DSAU.IconifyIcon, {
  name: n,
  size: s,
  color: c
});
function goAU(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function getParamAU(name) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch (e) {
    return null;
  }
}
const AU_STEPS = ["User type", "Details", "Goal"];
const AU_QUESTIONS = ["Why did you choose to become an aesthetic practitioner, and what's the impact you dream of making for your clients?", "What's the one thing in your business that keeps you up at night, and how would solving it change your life?", "Who or what inspires you to keep pushing forward in your business, even on the toughest days?", "If you could wave a magic wand and change one thing about running your practice, what would it be?", "What does success as an aesthetic practitioner look like for you?"];
function Brand() {
  return /*#__PURE__*/React.createElement("div", {
    className: "au-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  }));
}
function Stepper({
  step
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "au-steps",
    role: "list",
    "aria-label": "Sign-up progress"
  }, AU_STEPS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "au-step" + (i <= step ? " on" : ""),
    key: s,
    role: "listitem",
    "aria-current": i === step ? "step" : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-step-lbl"
  }, s), /*#__PURE__*/React.createElement("span", {
    className: "au-step-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "au-step-line"
  }))));
}
function PwField({
  label,
  value,
  onChange,
  placeholder = "***********"
}) {
  const [show, setShow] = useStateAU(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "au-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "au-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "au-input"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "lucide:lock"
  }), /*#__PURE__*/React.createElement("input", {
    type: show ? "text" : "password",
    placeholder: placeholder,
    value: value,
    onChange: e => onChange(e.target.value),
    "aria-label": label
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-eye",
    onClick: () => setShow(v => !v),
    "aria-label": show ? "Hide password" : "Show password"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: show ? "lucide:eye-off" : "lucide:eye",
    s: 19
  }))));
}
function TextField({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "au-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "au-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "au-input"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: icon
  }), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: e => onChange(e.target.value),
    "aria-label": label
  })));
}
function Social({
  mode
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "au-or"
  }, "Or sign ", mode, " with"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-social"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "logos:google-icon",
    s: 20,
    c: "currentColor"
  }), "Continue with Google"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-social"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "lucide:apple",
    s: 20,
    c: "var(--text-primary)"
  }), "Continue with Apple"));
}

/* ---------------------------------- SIGN IN ------------------------------- */
function SignIn({
  onSignUp,
  onDone,
  onForgot
}) {
  const [email, setEmail] = useStateAU("");
  const [pw, setPw] = useStateAU("");
  const [remember, setRemember] = useStateAU(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "au-screen",
    "data-screen-label": "Sign in (mobile)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-help"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Need Help?")), /*#__PURE__*/React.createElement("h1", {
    className: "au-h1"
  }, "Welcome Back!"), /*#__PURE__*/React.createElement("p", {
    className: "au-sub"
  }, "Hello, you must login first to be able to use the application and enjoy all the features on this app."), /*#__PURE__*/React.createElement(TextField, {
    label: "Email",
    icon: "lucide:mail",
    type: "email",
    placeholder: "Enter Email",
    value: email,
    onChange: setEmail
  }), /*#__PURE__*/React.createElement(PwField, {
    label: "Password",
    value: pw,
    onChange: setPw
  }), /*#__PURE__*/React.createElement("div", {
    className: "au-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-check" + (remember ? " on" : ""),
    role: "checkbox",
    "aria-checked": remember,
    onClick: () => setRemember(v => !v)
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-check-box"
  }, remember && /*#__PURE__*/React.createElement(Ico, {
    n: "lucide:check",
    s: 14,
    c: "#fff"
  })), "Remember Me"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-link",
    onClick: onForgot
  }, "Forgot Password")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-cta",
    onClick: onDone
  }, "Sign In"), /*#__PURE__*/React.createElement(Social, {
    mode: "in"
  }), /*#__PURE__*/React.createElement("p", {
    className: "au-foot"
  }, "Don't have an account? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSignUp
  }, "Sign up")), /*#__PURE__*/React.createElement("div", {
    className: "au-legal"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Terms and Condition"))));
}

/* ------------------------------ STEP 1 · TYPE ----------------------------- */
/* Raw-JSON Lottie (the /embed iframe caches aggressively). */
function AULottie({
  src,
  size
}) {
  const host = React.useRef(null);
  React.useEffect(() => {
    let anim, iv;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: src
      });
    };
    if (window.lottie) start();else {
      iv = setInterval(() => {
        if (window.lottie) {
          clearInterval(iv);
          start();
        }
      }, 120);
      setTimeout(() => clearInterval(iv), 8000);
    }
    return () => {
      if (iv) clearInterval(iv);
      if (anim) anim.destroy();
    };
  }, [src]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    style: {
      display: "block",
      width: size,
      height: size
    }
  });
}
const AU_TYPES = [{
  k: "clinician",
  lottie: "https://lottie.host/302e0f00-99b9-4be7-92cd-7318c6b76559/N7Cv2xlAcn.json",
  t: "Clinician",
  s: "Delivering expert care with confidence."
}, {
  k: "patient",
  lottie: "https://lottie.host/6d606005-0f87-454f-8093-a754defbb877/32xh9U5eNK.json",
  t: "Patient",
  s: "Your journey to better health starts here."
}];
function StepType({
  type,
  setType,
  onBack,
  onNext
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "au-screen",
    "data-screen-label": "Sign up · user type"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-scroll"
  }, /*#__PURE__*/React.createElement(Brand, null), /*#__PURE__*/React.createElement(Stepper, {
    step: 0
  }), /*#__PURE__*/React.createElement("div", {
    className: "au-sec"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "fluent-emoji-flat:busts-in-silhouette",
    s: 24,
    c: "currentColor"
  }), /*#__PURE__*/React.createElement("h2", null, "Choose your user type")), /*#__PURE__*/React.createElement("p", {
    className: "au-sec-sub"
  }, "Tell us who you are to get started."), /*#__PURE__*/React.createElement("div", {
    className: "au-types",
    role: "radiogroup",
    "aria-label": "User type"
  }, AU_TYPES.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t.k,
    role: "radio",
    "aria-checked": type === t.k,
    className: "au-type" + (type === t.k ? " on" : ""),
    onClick: () => setType(t.k)
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-type-ic"
  }, /*#__PURE__*/React.createElement(AULottie, {
    src: t.lottie,
    size: 68
  })), /*#__PURE__*/React.createElement("span", {
    className: "au-type-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, t.t), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, t.s)))))), /*#__PURE__*/React.createElement("div", {
    className: "au-nav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-back",
    onClick: onBack
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-next",
    onClick: onNext,
    disabled: !type
  }, "Next")));
}

/* ---------------------------- STEP 2 · DETAILS ---------------------------- */
function StepDetails({
  type,
  onBack,
  onNext,
  onEmail
}) {
  const [name, setName] = useStateAU("");
  const [email, setEmail] = useStateAU("");
  const [pw, setPw] = useStateAU("");
  const [pw2, setPw2] = useStateAU("");
  const [agree, setAgree] = useStateAU(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "au-screen",
    "data-screen-label": "Sign up · personal details"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-scroll"
  }, /*#__PURE__*/React.createElement(Brand, null), /*#__PURE__*/React.createElement(Stepper, {
    step: 1
  }), /*#__PURE__*/React.createElement("div", {
    className: "au-sec"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "fluent-emoji-flat:identification-card",
    s: 24,
    c: "currentColor"
  }), /*#__PURE__*/React.createElement("h2", null, "Personal Details")), /*#__PURE__*/React.createElement("p", {
    className: "au-sec-sub"
  }, "Create your ", type === "patient" ? "patient" : "clinician", " account to start your journey."), /*#__PURE__*/React.createElement(TextField, {
    label: "Name",
    icon: "lucide:user",
    placeholder: "Full Name",
    value: name,
    onChange: setName
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Email",
    icon: "lucide:mail",
    type: "email",
    placeholder: "Enter Email",
    value: email,
    onChange: setEmail
  }), /*#__PURE__*/React.createElement(PwField, {
    label: "Create Password",
    value: pw,
    onChange: setPw
  }), /*#__PURE__*/React.createElement(PwField, {
    label: "Confirm Password",
    value: pw2,
    onChange: setPw2
  }), /*#__PURE__*/React.createElement("div", {
    className: "au-terms"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-check" + (agree ? " on" : ""),
    role: "checkbox",
    "aria-checked": agree,
    onClick: () => setAgree(v => !v)
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-check-box"
  }, agree && /*#__PURE__*/React.createElement(Ico, {
    n: "lucide:check",
    s: 14,
    c: "#fff"
  })), /*#__PURE__*/React.createElement("span", null, "By creating an account, you agree to our ", /*#__PURE__*/React.createElement("b", null, "Terms and Condition")))), /*#__PURE__*/React.createElement(Social, {
    mode: "up"
  })), /*#__PURE__*/React.createElement("div", {
    className: "au-nav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-back",
    onClick: onBack
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-next",
    onClick: () => {
      if (onEmail) onEmail(email);
      onNext();
    },
    disabled: !agree
  }, "Next")));
}

/* ----------------------------- STEP 3 · GOALS ----------------------------- */
function StepGoals({
  onBack,
  onDone
}) {
  const [about, setAbout] = useStateAU("");
  const [answers, setAnswers] = useStateAU(AU_QUESTIONS.map(() => ""));
  const set = (i, v) => setAnswers(a => a.map((x, j) => j === i ? v : x));
  return /*#__PURE__*/React.createElement("div", {
    className: "au-screen",
    "data-screen-label": "Sign up · personal goals"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-scroll"
  }, /*#__PURE__*/React.createElement(Brand, null), /*#__PURE__*/React.createElement(Stepper, {
    step: 2
  }), /*#__PURE__*/React.createElement("div", {
    className: "au-sec"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "fluent-emoji-flat:direct-hit",
    s: 24,
    c: "currentColor"
  }), /*#__PURE__*/React.createElement("h2", null, "Personal Goals")), /*#__PURE__*/React.createElement("p", {
    className: "au-sec-sub"
  }, "Define what you want to achieve and track your progress."), /*#__PURE__*/React.createElement("label", {
    className: "au-label",
    htmlFor: "au-about"
  }, "Tell us about yourself"), /*#__PURE__*/React.createElement("textarea", {
    id: "au-about",
    className: "au-area",
    placeholder: "Tell us about yourself",
    rows: 2,
    value: about,
    onChange: e => setAbout(e.target.value)
  }), AU_QUESTIONS.map((q, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("p", {
    className: "au-q"
  }, q), /*#__PURE__*/React.createElement("textarea", {
    className: "au-area",
    rows: 2,
    "aria-label": q,
    value: answers[i],
    onChange: e => set(i, e.target.value)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "au-nav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-back",
    onClick: onBack
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-next",
    onClick: onDone
  }, "Complete")));
}

/* --------------------------------- SPLASH --------------------------------- */
function Splash({
  onGo
}) {
  React.useEffect(() => {
    const t = setTimeout(onGo, 2200);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-splash",
    "data-screen-label": "Splash",
    onClick: onGo,
    "aria-label": "Continue to sign in"
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-splash-mark"
  }, "PRO", /*#__PURE__*/React.createElement("i", null, "finity")), /*#__PURE__*/React.createElement("span", {
    className: "au-splash-foot"
  }, "Navigating healthcare doesn't have to be overwhelming. At PROfinity, we believe meaningful, clear communication between clinicians and patients is the foundation of better outcomes."));
}

/* ---------------------------- FORGOT PASSWORD ----------------------------- */
function ForgotSheet({
  onClose,
  onSent
}) {
  const [email, setEmail] = useStateAU("");
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.focus();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "au-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Forgot password",
    onKeyDown: e => {
      if (e.key === "Escape") onClose();
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-modal-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "au-modal-card"
  }, /*#__PURE__*/React.createElement("h2", null, "Forgot Password"), /*#__PURE__*/React.createElement("p", null, "Enter your email address below and we'll send you a link to reset your password."), /*#__PURE__*/React.createElement("div", {
    className: "au-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "au-label"
  }, "Email address"), /*#__PURE__*/React.createElement("div", {
    className: "au-input"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "lucide:mail"
  }), /*#__PURE__*/React.createElement("input", {
    ref: ref,
    type: "email",
    placeholder: "Enter email address",
    value: email,
    onChange: e => setEmail(e.target.value),
    "aria-label": "Email address"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "au-modal-nav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-cta compact",
    onClick: onSent
  }, "Send the Link")), /*#__PURE__*/React.createElement("p", {
    className: "au-modal-foot"
  }, "Remember your password? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose
  }, "Sign in"))));
}

/* --------------------------- RESET LINK SENT ------------------------------ */
function ResetSent({
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "au-screen",
    "data-screen-label": "Reset link sent"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-done-ic"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "lucide:check",
    s: 40,
    c: "#fff"
  })), /*#__PURE__*/React.createElement("h1", null, "Successfully"), /*#__PURE__*/React.createElement("p", null, "A password reset link has been sent to the email you provided. Please check your inbox and follow the instructions to reset your password. If you don't see the email, check your spam or junk folder."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-link strong",
    onClick: onBack
  }, "Back to Login")), /*#__PURE__*/React.createElement("p", {
    className: "au-support"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Need help"), "? Contact our support team."));
}

/* --------------------------- EMAIL VERIFICATION --------------------------- */
function OtpVerify({
  email,
  onBack,
  onVerified
}) {
  const [code, setCode] = useStateAU(["", "", "", ""]);
  const refs = [React.useRef(null), React.useRef(null), React.useRef(null), React.useRef(null)];
  React.useEffect(() => {
    if (refs[0].current) refs[0].current.focus();
  }, []);
  const set = (i, v) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setCode(c => c.map((x, j) => j === i ? d : x));
    if (d && i < 3 && refs[i + 1].current) refs[i + 1].current.focus();
  };
  const filled = code.every(c => c !== "");
  return /*#__PURE__*/React.createElement("div", {
    className: "au-screen",
    "data-screen-label": "Email verification"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-scroll"
  }, /*#__PURE__*/React.createElement(Brand, null), /*#__PURE__*/React.createElement("div", {
    className: "au-otp-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-otp-shield"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "fluent-emoji-flat:locked-with-key",
    s: 44,
    c: "currentColor"
  })), /*#__PURE__*/React.createElement("h1", {
    className: "au-otp-h1"
  }, "Email Verification"), /*#__PURE__*/React.createElement("p", {
    className: "au-otp-p"
  }, "Please check your email (", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, email || "mail@mail.com"), ") for the OTP code."), /*#__PURE__*/React.createElement("div", {
    className: "au-otp",
    role: "group",
    "aria-label": "One-time code"
  }, code.map((c, i) => /*#__PURE__*/React.createElement("input", {
    key: i,
    ref: refs[i],
    className: "au-otp-box",
    inputMode: "numeric",
    maxLength: 1,
    value: c,
    placeholder: "0",
    "aria-label": "Digit " + (i + 1),
    onChange: e => set(i, e.target.value),
    onKeyDown: e => {
      if (e.key === "Backspace" && !c && i > 0 && refs[i - 1].current) refs[i - 1].current.focus();
    }
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-link",
    onClick: () => setCode(["", "", "", ""])
  }, "Resend"))), /*#__PURE__*/React.createElement("div", {
    className: "au-nav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-back",
    onClick: onBack
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-next",
    onClick: onVerified,
    disabled: !filled
  }, "Verify")));
}
function VerifySuccess({
  onNext
}) {
  React.useEffect(() => {
    const t = setTimeout(onNext, 1600);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "au-screen",
    "data-screen-label": "Verification success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-done-ic"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "lucide:check",
    s: 40,
    c: "#fff"
  })), /*#__PURE__*/React.createElement("h1", null, "Verification Success!"), /*#__PURE__*/React.createElement("p", null, "Your email is confirmed. Let's set up your goals."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-cta",
    onClick: onNext
  }, "Continue")));
}

/* ------------------------------ DAILY REWARD ------------------------------ */
function DailyReward({
  onDone,
  points,
  kicker,
  title,
  sub
}) {
  const TOTAL = points || 1000;
  const [n, setN] = useStateAU(0);
  const [phase, setPhase] = useStateAU("in");
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(TOTAL);
      setPhase("done");
      return undefined;
    }
    let raf,
      t0 = null;
    const dur = 1300,
      delay = 620;
    const start = setTimeout(function tick() {
      raf = requestAnimationFrame(function step(ts) {
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(TOTAL * eased));
        if (p < 1) raf = requestAnimationFrame(step);else setPhase("done");
      });
    }, delay);
    return () => {
      clearTimeout(start);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const sparks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return /*#__PURE__*/React.createElement("div", {
    className: "au-reward " + phase,
    "data-screen-label": "Daily reward",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Daily login reward"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-rw-scrim",
    "aria-label": "Close",
    onClick: onDone
  }), /*#__PURE__*/React.createElement("div", {
    className: "au-rw-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "au-rw-burst",
    "aria-hidden": "true"
  }, sparks.map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "au-rw-spark",
    style: {
      "--i": i
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "au-rw-ring",
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "au-rw-ring d2",
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "au-rw-coin"
  }, /*#__PURE__*/React.createElement(AULottie, {
    src: "https://lottie.host/cc6c5973-9f61-481c-85ed-0fe2089a9176/CwHL9yTPJJ.json",
    size: 168
  }))), /*#__PURE__*/React.createElement("p", {
    className: "au-rw-kicker"
  }, kicker || "Daily login reward"), /*#__PURE__*/React.createElement("p", {
    className: "au-rw-points",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("b", null, "+", n.toLocaleString()), /*#__PURE__*/React.createElement("i", null, "points")), /*#__PURE__*/React.createElement("h1", {
    className: "au-rw-h1"
  }, title || "Nice work, Katy!"), /*#__PURE__*/React.createElement("p", {
    className: "au-rw-sub"
  }, sub || "You've earned today's points just for showing up. Keep your streak going to unlock bonus rewards."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-cta",
    onClick: onDone
  }, "Collect & continue")));
}

/* -------------------------------- COMPLETE -------------------------------- */
function Complete() {
  const [claimed, setClaimedAU] = useStateAU(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "au-screen",
    "data-screen-label": "Sign up · complete"
  }, !claimed && /*#__PURE__*/React.createElement(DailyReward, {
    points: 250,
    kicker: "Welcome bonus",
    title: "You're all set, Katy!",
    sub: "Here's 250 points just for joining — keep learning and connecting to earn more.",
    onDone: () => setClaimedAU(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "au-done"
  }, /*#__PURE__*/React.createElement("span", {
    className: "au-done-ic"
  }, /*#__PURE__*/React.createElement(Ico, {
    n: "lucide:check",
    s: 40,
    c: "var(--success)"
  })), /*#__PURE__*/React.createElement("h1", null, "You're all set!"), /*#__PURE__*/React.createElement("p", null, "Your Prosperity Spiral is ready. Let's get you to your dream clinic."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "au-cta",
    onClick: () => {
      try {
        localStorage.setItem("pf-tour", "1");
        localStorage.setItem("pf-tour-step", "welcome");
      } catch (e) {}
      goAU("NewsfeedMobile.html");
    }
  }, "Take the tour")));
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
  const go = v => setView(v);
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)",
      backgroundColor: "rgb(216, 218, 226)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDeviceAU, {
    width: 440,
    height: 956
  }, view === "splash" && /*#__PURE__*/React.createElement(Splash, {
    onGo: () => go("signin")
  }), view === "reward" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SignIn, {
    onSignUp: () => {},
    onForgot: () => {},
    onDone: () => {}
  }), /*#__PURE__*/React.createElement(DailyReward, {
    onDone: () => {
      try {
        localStorage.setItem("pf-tour", "1");
        localStorage.setItem("pf-tour-step", "welcome");
      } catch (e) {}
      goAU("NewsfeedMobile.html");
    }
  })), view === "signin" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SignIn, {
    onSignUp: () => go("type"),
    onForgot: () => setForgot(true),
    onDone: () => go("reward")
  }), forgot && /*#__PURE__*/React.createElement(ForgotSheet, {
    onClose: () => setForgot(false),
    onSent: () => {
      setForgot(false);
      go("sent");
    }
  })), view === "sent" && /*#__PURE__*/React.createElement(ResetSent, {
    onBack: () => go("signin")
  }), view === "type" && /*#__PURE__*/React.createElement(StepType, {
    type: type,
    setType: setType,
    onBack: () => go("signin"),
    onNext: () => go("details")
  }), view === "details" && /*#__PURE__*/React.createElement(StepDetails, {
    type: type,
    onEmail: setEmail,
    onBack: () => go("type"),
    onNext: () => go("otp")
  }), view === "otp" && /*#__PURE__*/React.createElement(OtpVerify, {
    email: email,
    onBack: () => go("details"),
    onVerified: () => go("verified")
  }), view === "verified" && /*#__PURE__*/React.createElement(VerifySuccess, {
    onNext: () => go("goals")
  }), view === "goals" && /*#__PURE__*/React.createElement(StepGoals, {
    onBack: () => go("details"),
    onDone: () => go("done")
  }), view === "done" && /*#__PURE__*/React.createElement(Complete, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AuthMobileApp, null));
