/* ===========================================================================
   PROfinity — Free Course onboarding questionnaire (mobile)
   A 10-step "Let's Personalize Your Experience" wizard + summary. Self-contained
   IIFE; exposes window.SurveyMobile({ open, onClose, onComplete }). Suffixed -S.
   Styling lives in learning-mobile.css (sv-*) for the phone and is re-skinned by
   learning.css (.lrn2-survey .sv-*) on the web My Learning page.
   Redesign (user, 2026-09-16): editorial look — gold eyebrow + serif title,
   segmented progress bar, lettered option chips, Back/Continue footer, per-step
   slide animation, "all set" summary hero.
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
  const pad2 = n => n < 10 ? "0" + n : String(n);
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
    const back = () => setStep(s => Math.max(0, s - 1));
    /* hand the option labels to the caller and keep them (pf-survey-answers) so the
       Free Resources page can put the best-fitting downloads first */
    const finish = () => {
      const labels = answers.map((a, i) => a == null ? null : QUESTIONS[i].opts[a]);
      try {
        localStorage.setItem("pf-survey-answers", JSON.stringify(labels));
      } catch (e) {}
      onComplete && onComplete(labels);
      onClose && onClose();
    };
    const answered = answers.filter(a => a != null).length;
    return /*#__PURE__*/React.createElement("div", {
      className: "sv-overlay",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Personalize your experience"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-card" + (done ? " sv-card-done" : "")
    }, /*#__PURE__*/React.createElement("header", {
      className: "sv-head"
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/profinity-icon-purple-gold.png",
      alt: "PROfinity Academy"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sv-head-r"
    }, !done && /*#__PURE__*/React.createElement("span", {
      className: "sv-step",
      "aria-label": "Question " + (step + 1) + " of " + TOTAL
    }, step + 1, /*#__PURE__*/React.createElement("i", null, "/"), TOTAL), /*#__PURE__*/React.createElement("button", {
      className: "sv-x",
      "aria-label": "Close",
      onClick: onClose
    }, /*#__PURE__*/React.createElement(DSS.IconifyIcon, {
      name: "lucide:x",
      size: 20,
      color: "currentColor"
    })))), done ? /*#__PURE__*/React.createElement("div", {
      className: "sv-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-done-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sv-done-ic",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(DSS.IconifyIcon, {
      name: "lucide:check",
      size: 30,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sv-eyebrow"
    }, /*#__PURE__*/React.createElement("i", null), " Personalised"), /*#__PURE__*/React.createElement("h2", {
      className: "sv-title"
    }, "You're all set"), /*#__PURE__*/React.createElement("p", {
      className: "sv-sub"
    }, "Thanks for sharing. Your free resources are now tailored to where you are and where you're heading.")), /*#__PURE__*/React.createElement("div", {
      className: "sv-summary"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-summary-h"
    }, "Your answers ", /*#__PURE__*/React.createElement("span", null, answered, " of ", TOTAL)), QUESTIONS.map((Q, i) => answers[i] != null && /*#__PURE__*/React.createElement("div", {
      className: "sv-sum-item",
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-sum-q"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sv-sum-n"
    }, pad2(i + 1)), Q.q), /*#__PURE__*/React.createElement("div", {
      className: "sv-sum-a"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sv-check"
    }, /*#__PURE__*/React.createElement(DSS.IconifyIcon, {
      name: "lucide:check",
      size: 13,
      color: "#fff"
    })), Q.opts[answers[i]])))), /*#__PURE__*/React.createElement("div", {
      className: "sv-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "sv-continue",
      onClick: finish
    }, "Continue to My Learning ", /*#__PURE__*/React.createElement(DSS.IconifyIcon, {
      name: "lucide:arrow-right",
      size: 18,
      color: "currentColor"
    })))) : /*#__PURE__*/React.createElement("div", {
      className: "sv-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sv-eyebrow"
    }, /*#__PURE__*/React.createElement("i", null), " Personalise"), /*#__PURE__*/React.createElement("h2", {
      className: "sv-title"
    }, "Let's personalise your experience"), /*#__PURE__*/React.createElement("p", {
      className: "sv-sub"
    }, "Help us tailor content and connections that matter most to you."), /*#__PURE__*/React.createElement("div", {
      className: "sv-progress",
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": TOTAL,
      "aria-valuenow": step + 1,
      "aria-label": "Question " + (step + 1) + " of " + TOTAL
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-bar",
      "aria-hidden": "true"
    }, QUESTIONS.map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "sv-seg" + (i < step ? " done" : i === step ? " cur" : "")
    }))), /*#__PURE__*/React.createElement("span", {
      className: "sv-pct"
    }, pct, "%")), /*#__PURE__*/React.createElement("div", {
      className: "sv-stepwrap",
      key: step
    }, /*#__PURE__*/React.createElement("div", {
      className: "sv-q"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sv-qn",
      "aria-hidden": "true"
    }, pad2(step + 1)), /*#__PURE__*/React.createElement("span", {
      className: "sv-qt"
    }, cur.q)), /*#__PURE__*/React.createElement("div", {
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
    }, o))))), /*#__PURE__*/React.createElement("div", {
      className: "sv-actions"
    }, step > 0 && /*#__PURE__*/React.createElement("button", {
      className: "sv-back",
      "aria-label": "Previous question",
      onClick: back
    }, /*#__PURE__*/React.createElement(DSS.IconifyIcon, {
      name: "lucide:chevron-left",
      size: 22,
      color: "currentColor"
    })), /*#__PURE__*/React.createElement("button", {
      className: "sv-continue",
      disabled: answers[step] == null,
      onClick: next
    }, step === TOTAL - 1 ? "See my summary" : "Continue", " ", /*#__PURE__*/React.createElement(DSS.IconifyIcon, {
      name: "lucide:arrow-right",
      size: 18,
      color: "currentColor"
    }))))));
  }
  window.SurveyMobile = SurveyMobile;
})();
