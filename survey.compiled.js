/* ===========================================================================
   PROfinity — Free Course onboarding questionnaire (mobile)
   A 10-step "Let's Personalize Your Experience" wizard + summary. Self-contained
   IIFE; exposes window.SurveyMobile({ open, onClose, onComplete }). Suffixed -S.
   =========================================================================== */
(function () {
  const {
    useState: useStateS
  } = React;
  const DSS = window.ProfinityDesignSystem_c2b5cc;
  const QUESTIONS = [{
    q: "Which stage are you currently at in aesthetics?",
    opts: ["Just exploring aesthetics", "Training / beginner injector", "Building part-time", "Full-time injector", "Clinic owner"]
  }, {
    q: "How long have you worked in aesthetics?",
    opts: ["Less than 6 months", "6–12 months", "1–2 years", "2–3 years", "3–5 years"]
  }, {
    q: "What best describes your current work situation?",
    opts: ["Aesthetics is my full-time career", "I balance aesthetics alongside another job", "I'm transitioning into full-time aesthetics", "I'm still training and not earning yet"]
  }, {
    q: "Approximately how many hours per week do you spend working in aesthetics?",
    opts: ["Less than 5 hours", "5–10 hours", "10–20 hours", "20–30 hours", "30+ hours"]
  }, {
    q: "Roughly how many patients do you currently treat per week?",
    opts: ["0–5", "6–10", "11–20", "21–40", "40+"]
  }, {
    q: "Roughly what stage is your aesthetics income currently at?",
    opts: ["Not earning yet", "Under £1k/month", "£1k–£5k/month", "£5k–£10k/month", "£10k–£25k/month"]
  }, {
    q: "What's your MAIN goal right now?",
    opts: ["Get my first paying clients", "Become more confident clinically", "Build consistent bookings", "Replace employed income", "Become fully booked"]
  }, {
    q: "What currently feels like your BIGGEST blocker?",
    opts: ["Confidence", "Finding clients", "Social media", "Pricing", "Consultations"]
  }, {
    q: "Which area currently makes you feel LEAST confident?",
    opts: ["Complications", "Finding clients", "Consultations", "Pricing conversations", "Social media / marketing"]
  }, {
    q: "Which type of content helps you MOST?",
    opts: ["Short tutorials", "Full masterclasses", "Live Q&As", "Case breakdowns", "Business training"]
  }];
  const TOTAL = QUESTIONS.length;
  function SurveyMobile({
    open,
    onClose,
    onComplete
  }) {
    const [step, setStep] = useStateS(0);
    const [answers, setAnswers] = useStateS(() => QUESTIONS.map(() => null));
    if (!open) return null;
    const done = step >= TOTAL;
    const pct = Math.round((step + 1) / TOTAL * 100);
    const cur = QUESTIONS[step];
    const pick = i => setAnswers(a => {
      const n = a.slice();
      n[step] = i;
      return n;
    });
    const next = () => setStep(s => s + 1);
    const finish = () => {
      onComplete && onComplete();
      onClose && onClose();
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "sv-overlay",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Personalize your experience"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-card"
    }, /*#__PURE__*/React.createElement("header", {
      className: "sv-head"
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/profinity-academy-logo-full.png",
      alt: "PROfinity Academy"
    }), /*#__PURE__*/React.createElement("button", {
      className: "sv-x",
      "aria-label": "Close",
      onClick: onClose
    }, /*#__PURE__*/React.createElement(DSS.IconifyIcon, {
      name: "lucide:x",
      size: 24,
      color: "var(--gray-700)"
    }))), done ? /*#__PURE__*/React.createElement("div", {
      className: "sv-body"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "sv-title"
    }, "All Set 🎉"), /*#__PURE__*/React.createElement("p", {
      className: "sv-sub"
    }, "Thanks for sharing! We've personalized your experience based on your preferences."), /*#__PURE__*/React.createElement("div", {
      className: "sv-summary"
    }, QUESTIONS.map((Q, i) => answers[i] != null && /*#__PURE__*/React.createElement("div", {
      className: "sv-sum-item",
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-sum-q"
    }, i + 1, ". ", Q.q), /*#__PURE__*/React.createElement("div", {
      className: "sv-sum-a"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sv-check"
    }, /*#__PURE__*/React.createElement(DSS.IconifyIcon, {
      name: "lucide:check",
      size: 14,
      color: "#fff"
    })), Q.opts[answers[i]])))), /*#__PURE__*/React.createElement("button", {
      className: "sv-continue",
      onClick: finish
    }, "Continue to My Learning")) : /*#__PURE__*/React.createElement("div", {
      className: "sv-body"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "sv-title"
    }, "Let's Personalize Your Experience"), /*#__PURE__*/React.createElement("p", {
      className: "sv-sub"
    }, "Help us tailor content and connections that matter most to you."), /*#__PURE__*/React.createElement("div", {
      className: "sv-progress"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-dots"
    }, QUESTIONS.map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "sv-dot" + (i <= step ? " on" : "")
    }, i + 1))), /*#__PURE__*/React.createElement("span", {
      className: "sv-pct"
    }, pct, "%")), /*#__PURE__*/React.createElement("div", {
      className: "sv-q"
    }, step + 1, ". ", cur.q), /*#__PURE__*/React.createElement("div", {
      className: "sv-opts",
      role: "radiogroup",
      "aria-label": cur.q
    }, cur.opts.map((o, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      className: "sv-opt" + (answers[step] === i ? " on" : ""),
      role: "radio",
      "aria-checked": answers[step] === i,
      onClick: () => pick(i)
    }, /*#__PURE__*/React.createElement("span", {
      className: "sv-radio",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "sv-opt-tx"
    }, o)))), /*#__PURE__*/React.createElement("button", {
      className: "sv-continue",
      disabled: answers[step] == null,
      onClick: next
    }, "Continue"))));
  }
  window.SurveyMobile = SurveyMobile;
})();
