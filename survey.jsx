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
  const { useState: useStateS } = React;
  const DSS = window.ProfinityDesignSystem_c2b5cc;

  const QUESTIONS = [
    { q: "Which stage are you currently at in aesthetics?",
      opts: ["Just exploring aesthetics", "Training / beginner injector", "Building part-time", "Full-time injector", "Clinic owner"] },
    { q: "How long have you worked in aesthetics?",
      opts: ["Less than 6 months", "6–12 months", "1–2 years", "2–3 years", "3–5 years"] },
    { q: "What best describes your current work situation?",
      opts: ["Aesthetics is my full-time career", "I balance aesthetics alongside another job", "I'm transitioning into full-time aesthetics", "I'm still training and not earning yet"] },
    { q: "Approximately how many hours per week do you spend working in aesthetics?",
      opts: ["Less than 5 hours", "5–10 hours", "10–20 hours", "20–30 hours", "30+ hours"] },
    { q: "Roughly how many patients do you currently treat per week?",
      opts: ["0–5", "6–10", "11–20", "21–40", "40+"] },
    { q: "Roughly what stage is your aesthetics income currently at?",
      opts: ["Not earning yet", "Under £1k/month", "£1k–£5k/month", "£5k–£10k/month", "£10k–£25k/month"] },
    { q: "What's your MAIN goal right now?",
      opts: ["Get my first paying clients", "Become more confident clinically", "Build consistent bookings", "Replace employed income", "Become fully booked"] },
    { q: "What currently feels like your BIGGEST blocker?",
      opts: ["Confidence", "Finding clients", "Social media", "Pricing", "Consultations"] },
    { q: "Which area currently makes you feel LEAST confident?",
      opts: ["Complications", "Finding clients", "Consultations", "Pricing conversations", "Social media / marketing"] },
    { q: "Which type of content helps you MOST?",
      opts: ["Short tutorials", "Full masterclasses", "Live Q&As", "Case breakdowns", "Business training"] },
  ];
  const TOTAL = QUESTIONS.length;
  const pad2 = (n) => (n < 10 ? "0" + n : String(n));

  function SurveyMobile({ open, onClose, onComplete }) {
    const [step, setStep] = useStateS(0);
    const [answers, setAnswers] = useStateS(() => QUESTIONS.map(() => null));
    if (!open) return null;

    const done = step >= TOTAL;
    const pct = Math.round(((step + 1) / TOTAL) * 100);
    const cur = QUESTIONS[step];
    const pick = (i) => setAnswers((a) => { const n = a.slice(); n[step] = i; return n; });
    const next = () => setStep((s) => s + 1);
    const back = () => setStep((s) => Math.max(0, s - 1));
    /* hand the option labels to the caller and keep them (pf-survey-answers) so the
       Free Resources page can put the best-fitting downloads first */
    const finish = () => {
      const labels = answers.map((a, i) => (a == null ? null : QUESTIONS[i].opts[a]));
      try { localStorage.setItem("pf-survey-answers", JSON.stringify(labels)); } catch (e) {}
      onComplete && onComplete(labels); onClose && onClose();
    };
    const answered = answers.filter((a) => a != null).length;

    return (
      <div className="sv-overlay" role="dialog" aria-modal="true" aria-label="Personalize your experience">
        <div className={"sv-card" + (done ? " sv-card-done" : "")}>
          <header className="sv-head">
            <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" />
            <div className="sv-head-r">
              {!done && <span className="sv-step" aria-label={"Question " + (step + 1) + " of " + TOTAL}>{step + 1}<i>/</i>{TOTAL}</span>}
              <button className="sv-x" aria-label="Close" onClick={onClose}>
                <DSS.IconifyIcon name="lucide:x" size={20} color="currentColor" />
              </button>
            </div>
          </header>

          {done ? (
            <div className="sv-body">
              <div className="sv-done-hero">
                <span className="sv-done-ic" aria-hidden="true"><DSS.IconifyIcon name="lucide:check" size={30} color="#fff" /></span>
                <span className="sv-eyebrow"><i /> Personalised</span>
                <h2 className="sv-title">You're all set</h2>
                <p className="sv-sub">Thanks for sharing. Your free resources are now tailored to where you are and where you're heading.</p>
              </div>
              <div className="sv-summary">
                <div className="sv-summary-h">Your answers <span>{answered} of {TOTAL}</span></div>
                {QUESTIONS.map((Q, i) => answers[i] != null && (
                  <div className="sv-sum-item" key={i}>
                    <div className="sv-sum-q"><span className="sv-sum-n">{pad2(i + 1)}</span>{Q.q}</div>
                    <div className="sv-sum-a">
                      <span className="sv-check"><DSS.IconifyIcon name="lucide:check" size={13} color="#fff" /></span>
                      {Q.opts[answers[i]]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="sv-actions">
                <button className="sv-continue" onClick={finish}>
                  Continue to My Learning <DSS.IconifyIcon name="lucide:arrow-right" size={18} color="currentColor" />
                </button>
              </div>
            </div>
          ) : (
            <div className="sv-body">
              <span className="sv-eyebrow"><i /> Personalise</span>
              <h2 className="sv-title">Let's personalise your experience</h2>
              <p className="sv-sub">Help us tailor content and connections that matter most to you.</p>

              <div className="sv-progress" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={step + 1} aria-label={"Question " + (step + 1) + " of " + TOTAL}>
                <div className="sv-bar" aria-hidden="true">
                  {QUESTIONS.map((_, i) => (
                    <span key={i} className={"sv-seg" + (i < step ? " done" : i === step ? " cur" : "")} />
                  ))}
                </div>
                <span className="sv-pct">{pct}%</span>
              </div>

              <div className="sv-stepwrap" key={step}>
                <div className="sv-q">
                  <span className="sv-qn" aria-hidden="true">{pad2(step + 1)}</span>
                  <span className="sv-qt">{cur.q}</span>
                </div>
                <div className="sv-opts" role="radiogroup" aria-label={cur.q}>
                  {cur.opts.map((o, i) => (
                    <button key={i} className={"sv-opt" + (answers[step] === i ? " on" : "")}
                      role="radio" aria-checked={answers[step] === i} onClick={() => pick(i)}>
                      <span className="sv-radio" aria-hidden="true" />
                      <span className="sv-opt-tx">{o}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sv-actions">
                {step > 0 && (
                  <button className="sv-back" aria-label="Previous question" onClick={back}>
                    <DSS.IconifyIcon name="lucide:chevron-left" size={22} color="currentColor" />
                  </button>
                )}
                <button className="sv-continue" disabled={answers[step] == null} onClick={next}>
                  {step === TOTAL - 1 ? "See my summary" : "Continue"} <DSS.IconifyIcon name="lucide:arrow-right" size={18} color="currentColor" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  window.SurveyMobile = SurveyMobile;
})();
