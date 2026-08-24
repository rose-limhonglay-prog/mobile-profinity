/* ===========================================================================
   PROfinity — Sign in / Sign up / Onboarding (web)
   Desktop counterpart to auth-mobile.jsx. Split-screen sign-in, single-column
   sign-up wizard (User type → Details → Goals), done + logged-out states.
   Views are linkable via ?view= so other pages can deep-link (e.g. a
   session-expiry redirect to AuthWeb.html?view=loggedout).
   Names suffixed -AW so this file can share the global Babel scope.
   =========================================================================== */
const DSAW = window.ProfinityDesignSystem_c2b5cc;
const {
  useState: useStateAW,
  useEffect: useEffectAW,
  useRef: useRefAW
} = React;
const IcoAW = ({
  n,
  s = 20,
  c = "var(--gray-500)"
}) => /*#__PURE__*/React.createElement(DSAW.IconifyIcon, {
  name: n,
  size: s,
  color: c
});
function goAW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function getParamAW(name) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch (e) {
    return null;
  }
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
const AW_QUESTIONS = ["Why did you choose to become an aesthetic practitioner, and what's the impact you dream of making for your clients?", "What's the one thing in your business that keeps you up at night, and how would solving it change your life?", "What does success as an aesthetic practitioner look like for you?"];
const AW_TYPES = [{
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

/* Raw-JSON Lottie (the /embed iframe caches aggressively). */
function AWLottie({
  src,
  size
}) {
  const host = useRefAW(null);
  useEffectAW(() => {
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
function Brand({
  solo
}) {
  return /*#__PURE__*/React.createElement("img", {
    className: solo ? "auw-logo-solo" : "auw-logo",
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  });
}
function Stepper({
  step
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-steps",
    role: "list",
    "aria-label": "Sign-up progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auw-steps-track",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "auw-steps-fill",
    "aria-hidden": "true",
    style: {
      width: step === 0 ? "0%" : step === 1 ? "33.3%" : "66.6%"
    }
  }), AW_STEPS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "auw-step" + (i <= step ? " on" : ""),
    key: s,
    role: "listitem",
    "aria-current": i === step ? "step" : undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "auw-step-dot"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "auw-step-lbl"
  }, s))));
}
function PwField({
  label,
  value,
  onChange,
  placeholder = "***********"
}) {
  const [show, setShow] = useStateAW(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "auw-field-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "auw-input"
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: "lucide:lock",
    s: 19,
    c: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("input", {
    type: show ? "text" : "password",
    placeholder: placeholder,
    value: value,
    onChange: e => onChange(e.target.value),
    "aria-label": label
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-eye",
    onClick: () => setShow(v => !v),
    "aria-label": show ? "Hide password" : "Show password"
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: show ? "lucide:eye-off" : "lucide:eye",
    s: 18
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
    className: "auw-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "auw-field-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "auw-input"
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: icon,
    s: 19
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
    className: "auw-or"
  }, "Or sign ", mode, " with"), /*#__PURE__*/React.createElement("div", {
    className: "auw-socials"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-social"
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: "logos:google-icon",
    s: 20,
    c: "currentColor"
  }), "Continue with Google"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-social"
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: "lucide:apple",
    s: 20,
    c: "var(--text-primary)"
  }), "Continue with Apple")));
}

/* ---------------------------------- SIGN IN ------------------------------- */
function SignIn({
  onSignUp,
  onDone,
  onForgot
}) {
  const [email, setEmail] = useStateAW("");
  const [pw, setPw] = useStateAW("");
  const [remember, setRemember] = useStateAW(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-view",
    "data-screen-label": "Sign in (web)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auw-head"
  }, /*#__PURE__*/React.createElement(Brand, null), /*#__PURE__*/React.createElement("a", {
    className: "auw-help",
    href: "#",
    onClick: e => e.preventDefault()
  }, "Need Help?")), /*#__PURE__*/React.createElement("h1", {
    className: "auw-h1"
  }, "Welcome Back!"), /*#__PURE__*/React.createElement("span", {
    className: "auw-accent"
  }), /*#__PURE__*/React.createElement("p", {
    className: "auw-sub"
  }, "Hello, you must login first to be able to use the application and enjoy all the features on this app."), /*#__PURE__*/React.createElement("div", {
    className: "auw-fields"
  }, /*#__PURE__*/React.createElement(TextField, {
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
  })), /*#__PURE__*/React.createElement("div", {
    className: "auw-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-check" + (remember ? " on" : ""),
    role: "checkbox",
    "aria-checked": remember,
    onClick: () => setRemember(v => !v)
  }, /*#__PURE__*/React.createElement("span", {
    className: "auw-check-box"
  }, remember && /*#__PURE__*/React.createElement(IcoAW, {
    n: "lucide:check",
    s: 13,
    c: "#fff"
  })), "Remember Me"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-link",
    onClick: onForgot
  }, "Forgot Password")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-cta",
    onClick: onDone
  }, "Sign In"), /*#__PURE__*/React.createElement(Social, {
    mode: "in"
  }), /*#__PURE__*/React.createElement("p", {
    className: "auw-foot"
  }, "Don't have an account? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSignUp
  }, "Sign up")), /*#__PURE__*/React.createElement("div", {
    className: "auw-legal"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Terms and Condition")));
}

/* ------------------------------ STEP 1 · TYPE ----------------------------- */
function StepType({
  type,
  setType,
  onBack,
  onNext
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-view",
    "data-screen-label": "Sign up · user type"
  }, /*#__PURE__*/React.createElement(Brand, {
    solo: true
  }), /*#__PURE__*/React.createElement(Stepper, {
    step: 0
  }), /*#__PURE__*/React.createElement("h1", {
    className: "auw-sec-h1"
  }, "Choose your user type"), /*#__PURE__*/React.createElement("p", {
    className: "auw-sec-sub"
  }, "Tell us who you are to get started."), /*#__PURE__*/React.createElement("div", {
    className: "auw-types",
    role: "radiogroup",
    "aria-label": "User type"
  }, AW_TYPES.map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t.k,
    role: "radio",
    "aria-checked": type === t.k,
    className: "auw-type" + (type === t.k ? " on" : ""),
    onClick: () => setType(t.k)
  }, /*#__PURE__*/React.createElement("span", {
    className: "auw-type-ic"
  }, /*#__PURE__*/React.createElement(AWLottie, {
    src: t.lottie,
    size: 72
  })), /*#__PURE__*/React.createElement("span", {
    className: "auw-type-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, t.t), /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, t.s))))), /*#__PURE__*/React.createElement("p", {
    className: "auw-foot"
  }, "Already have an account? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onBack
  }, "Sign in")), /*#__PURE__*/React.createElement("div", {
    className: "auw-stepnav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-back",
    onClick: onBack
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-next",
    onClick: onNext,
    disabled: !type
  }, "Next")));
}

/* ---------------------------- STEP 2 · DETAILS ---------------------------- */
function StepDetails({
  type,
  onBack,
  onNext
}) {
  const [name, setName] = useStateAW("");
  const [email, setEmail] = useStateAW("");
  const [pw, setPw] = useStateAW("");
  const [pw2, setPw2] = useStateAW("");
  const [agree, setAgree] = useStateAW(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-view",
    "data-screen-label": "Sign up · personal details"
  }, /*#__PURE__*/React.createElement(Brand, {
    solo: true
  }), /*#__PURE__*/React.createElement(Stepper, {
    step: 1
  }), /*#__PURE__*/React.createElement("h1", {
    className: "auw-sec-h1"
  }, "Personal Details"), /*#__PURE__*/React.createElement("p", {
    className: "auw-sec-sub"
  }, "Create your ", type === "patient" ? "patient" : "clinician", " account to start your journey."), /*#__PURE__*/React.createElement("div", {
    className: "auw-fields"
  }, /*#__PURE__*/React.createElement(TextField, {
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
  })), /*#__PURE__*/React.createElement("div", {
    className: "auw-terms"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-check" + (agree ? " on" : ""),
    role: "checkbox",
    "aria-checked": agree,
    onClick: () => setAgree(v => !v)
  }, /*#__PURE__*/React.createElement("span", {
    className: "auw-check-box"
  }, agree && /*#__PURE__*/React.createElement(IcoAW, {
    n: "lucide:check",
    s: 13,
    c: "#fff"
  })), /*#__PURE__*/React.createElement("span", null, "By creating an account, you agree to our ", /*#__PURE__*/React.createElement("b", null, "Terms and Condition")))), /*#__PURE__*/React.createElement(Social, {
    mode: "up"
  }), /*#__PURE__*/React.createElement("div", {
    className: "auw-stepnav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-back",
    onClick: onBack
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-next",
    onClick: onNext,
    disabled: !agree
  }, "Next")));
}

/* ----------------------------- STEP 3 · GOALS ----------------------------- */
function StepGoals({
  onBack,
  onDone
}) {
  const [about, setAbout] = useStateAW("");
  const [answers, setAnswers] = useStateAW(AW_QUESTIONS.map(() => ""));
  const set = (i, v) => setAnswers(a => a.map((x, j) => j === i ? v : x));
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-view",
    "data-screen-label": "Sign up · personal goals"
  }, /*#__PURE__*/React.createElement(Brand, {
    solo: true
  }), /*#__PURE__*/React.createElement(Stepper, {
    step: 2
  }), /*#__PURE__*/React.createElement("h1", {
    className: "auw-sec-h1"
  }, "Personal Goals"), /*#__PURE__*/React.createElement("p", {
    className: "auw-sec-sub"
  }, "Define what you want to achieve and track your progress."), /*#__PURE__*/React.createElement("div", {
    className: "auw-goal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "auw-q",
    htmlFor: "auw-about"
  }, "Tell us about yourself"), /*#__PURE__*/React.createElement("textarea", {
    id: "auw-about",
    className: "auw-area",
    placeholder: "Tell us about yourself",
    rows: 2,
    value: about,
    onChange: e => setAbout(e.target.value)
  })), AW_QUESTIONS.map((q, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("p", {
    className: "auw-q"
  }, q), /*#__PURE__*/React.createElement("textarea", {
    className: "auw-area",
    rows: 2,
    "aria-label": q,
    value: answers[i],
    onChange: e => set(i, e.target.value)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "auw-stepnav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-back",
    onClick: onBack
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-next",
    onClick: onDone
  }, "Complete")));
}

/* --------------------------- FORGOT PASSWORD ------------------------------ */
function ForgotModal({
  onClose,
  onSent,
  sent
}) {
  const [email, setEmail] = useStateAW("");
  const ref = useRefAW(null);
  useEffectAW(() => {
    if (ref.current) ref.current.focus();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Forgot password",
    onKeyDown: e => {
      if (e.key === "Escape") onClose();
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-modal-scrim",
    "aria-label": "Close",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "auw-modal-card"
  }, /*#__PURE__*/React.createElement("h2", null, "Forgot Password"), /*#__PURE__*/React.createElement("p", null, "Enter your email address below and we'll send you a link to reset your password."), /*#__PURE__*/React.createElement("div", {
    className: "auw-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "auw-field-label"
  }, "Email address"), /*#__PURE__*/React.createElement("div", {
    className: "auw-input"
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: "lucide:mail",
    s: 19
  }), /*#__PURE__*/React.createElement("input", {
    ref: ref,
    type: "email",
    placeholder: "Enter email address",
    value: email,
    onChange: e => setEmail(e.target.value),
    "aria-label": "Email address"
  }))), sent && /*#__PURE__*/React.createElement("p", {
    className: "auw-modal-sent"
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: "lucide:check-circle",
    s: 16,
    c: "var(--success)"
  }), "Reset link sent — check your inbox."), /*#__PURE__*/React.createElement("div", {
    className: "auw-modal-nav"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-cta",
    onClick: () => onSent(email)
  }, "Send the Link")), /*#__PURE__*/React.createElement("p", {
    className: "auw-modal-foot"
  }, "Remember your password? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose
  }, "Sign in"))));
}

/* -------------------------------- COMPLETE -------------------------------- */
function Complete() {
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-view",
    "data-screen-label": "Sign up · complete"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auw-done"
  }, /*#__PURE__*/React.createElement(Brand, {
    solo: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "auw-done-ic success",
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: "lucide:check",
    s: 44,
    c: "#fff"
  })), /*#__PURE__*/React.createElement("h1", null, "You're all set!"), /*#__PURE__*/React.createElement("p", null, "Your Prosperity Spiral is ready. Let's get you to your dream clinic."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-cta",
    onClick: startTourAW
  }, "Take the tour"), /*#__PURE__*/React.createElement("a", {
    className: "auw-skip",
    href: "NewsfeedWeb.html"
  }, "Skip to Home")));
}

/* ------------------------------- LOGGED OUT -------------------------------- */
function LoggedOut({
  onSignIn
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-view",
    "data-screen-label": "Logged out"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auw-done"
  }, /*#__PURE__*/React.createElement(Brand, {
    solo: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "auw-done-ic out",
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(IcoAW, {
    n: "lucide:log-out",
    s: 40,
    c: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("h1", null, "You've been logged out"), /*#__PURE__*/React.createElement("p", null, "Thanks for spending time with the community, Katy. Your progress is saved — sign back in whenever you're ready."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "auw-cta",
    onClick: onSignIn
  }, "Sign back in")));
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
  const goSignUp = () => {
    setStep(0);
    setView("signup");
  };
  const goSignIn = () => {
    setForgot(false);
    setSent(false);
    setView("signin");
  };
  const back = () => step === 0 ? goSignIn() : setStep(s => s - 1);
  const next = () => step === 2 ? setView("done") : setStep(s => s + 1);
  const isSignIn = view === "signin";
  const wide = view === "signup" || view === "done" || view === "loggedout";
  return /*#__PURE__*/React.createElement("div", {
    className: "auw-shell",
    style: {
      gridTemplateColumns: isSignIn ? "440px minmax(0,1fr)" : "minmax(0,1fr)"
    }
  }, isSignIn && /*#__PURE__*/React.createElement("aside", {
    className: "auw-aside"
  }, /*#__PURE__*/React.createElement("span", {
    className: "auw-aside-orb a",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "auw-aside-orb b",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "auw-aside-in"
  }, /*#__PURE__*/React.createElement("img", {
    className: "auw-aside-mark",
    src: "assets/profinity-diamond.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("h2", null, "The path to your dream clinic."), /*#__PURE__*/React.createElement("p", null, "Connect, learn, and grow with a community of expert clinicians."), /*#__PURE__*/React.createElement("div", {
    className: "auw-aside-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auw-aside-stat"
  }, /*#__PURE__*/React.createElement("b", null, "12k+"), /*#__PURE__*/React.createElement("i", null, "Clinicians")), /*#__PURE__*/React.createElement("div", {
    className: "auw-aside-stat"
  }, /*#__PURE__*/React.createElement("b", null, "240+"), /*#__PURE__*/React.createElement("i", null, "Courses")), /*#__PURE__*/React.createElement("div", {
    className: "auw-aside-stat"
  }, /*#__PURE__*/React.createElement("b", null, "98%"), /*#__PURE__*/React.createElement("i", null, "Recommend"))))), /*#__PURE__*/React.createElement("div", {
    className: "auw-main"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: wide ? 640 : 520
    }
  }, view === "signin" && /*#__PURE__*/React.createElement(SignIn, {
    onSignUp: goSignUp,
    onForgot: () => {
      setSent(false);
      setForgot(true);
    },
    onDone: () => goAW("NewsfeedWeb.html")
  }), view === "signup" && step === 0 && /*#__PURE__*/React.createElement(StepType, {
    type: type,
    setType: setType,
    onBack: goSignIn,
    onNext: next
  }), view === "signup" && step === 1 && /*#__PURE__*/React.createElement(StepDetails, {
    type: type,
    onBack: back,
    onNext: next
  }), view === "signup" && step === 2 && /*#__PURE__*/React.createElement(StepGoals, {
    onBack: back,
    onDone: next
  }), view === "done" && /*#__PURE__*/React.createElement(Complete, null), view === "loggedout" && /*#__PURE__*/React.createElement(LoggedOut, {
    onSignIn: goSignIn
  }))), forgot && /*#__PURE__*/React.createElement(ForgotModal, {
    onClose: () => setForgot(false),
    sent: sent,
    onSent: () => setSent(true)
  }));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AuthWebApp, null));
