/* ===========================================================================
   PROfinity — Minute Taker · Patient Consent Form
   Focused, chrome-free screen presented before ambient recording begins.
   PRD Screen 3 (Sec. 3.3 / MT-J01, MT-J02).
   Classes prefixed mtc- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateMTC
} = React;
function goMTC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function getParamMTC(name) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch (e) {
    return null;
  }
}
function mtcLoadContext() {
  try {
    return JSON.parse(sessionStorage.getItem("mtSession") || "{}");
  } catch (e) {
    return {};
  }
}
function mtcSaveContext(data) {
  try {
    sessionStorage.setItem("mtSession", JSON.stringify(data));
  } catch (e) {}
}
function mtcMakeConsentId() {
  return "C-" + Math.floor(10000 + Math.random() * 90000);
}
const MTC_SECTIONS = [{
  icon: "lucide:file-text",
  title: "Purpose of Recording",
  body: "This session may be recorded to automatically generate accurate clinical notes. This allows your clinician to focus entirely on you and your care, rather than taking manual notes."
}, {
  icon: "lucide:lock",
  title: "Privacy & Security",
  body: "All audio recordings are strictly confidential, heavily encrypted, and processed in compliance with healthcare data regulations. Recordings are deleted after note generation."
}, {
  icon: "lucide:hand",
  title: "Your Right to Choose",
  body: "Recording is entirely optional. Choosing not to be recorded is your right and will absolutely not affect the quality of care or the consultation you receive today."
}];
function MTCView() {
  const patient = getParamMTC("patient") || mtcLoadContext().patient || "Sarah Jenkins";
  const [stage, setStage] = useStateMTC("form"); // form | verifying | accepted | optedOut

  function handleOptOut() {
    setStage("optedOut");
    const ctx = mtcLoadContext();
    mtcSaveContext({
      ...ctx,
      patient,
      consentId: null,
      optedOut: true
    });
    window.setTimeout(() => goMTC("MinuteTakerDashboard.html"), 1700);
  }
  function handleAccept() {
    setStage("verifying");
    window.setTimeout(() => {
      const consentId = mtcMakeConsentId();
      const ctx = mtcLoadContext();
      mtcSaveContext({
        ...ctx,
        patient,
        consentId,
        optedOut: false
      });
      setStage("accepted");
      window.setTimeout(() => goMTC("MinuteTakerSession.html?patient=" + encodeURIComponent(patient) + "&consent=" + consentId), 550);
    }, 700);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mtc-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtc-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mtc-secure-badge"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:shield-check"
  }), "SECURE"), /*#__PURE__*/React.createElement("h1", null, "Patient Consent Form"), /*#__PURE__*/React.createElement("p", {
    className: "mtc-sub"
  }, "Please review the following information regarding the use of Minute Taker during ", patient, "'s clinical session today."), stage === "form" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mtc-sections"
  }, MTC_SECTIONS.map(s => /*#__PURE__*/React.createElement("div", {
    className: "mtc-section",
    key: s.title
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtc-section-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: s.icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mtc-section-title"
  }, s.title), /*#__PURE__*/React.createElement("div", {
    className: "mtc-section-body"
  }, s.body))))), /*#__PURE__*/React.createElement("div", {
    className: "mtc-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mtc-btn mtc-btn-ghost",
    type: "button",
    onClick: handleOptOut
  }, "Opt-Out of Recording"), /*#__PURE__*/React.createElement("button", {
    className: "mtc-btn mtc-btn-primary",
    type: "button",
    onClick: handleAccept
  }, "Accept & Continue", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-right"
  })))), stage === "verifying" && /*#__PURE__*/React.createElement("div", {
    className: "mtc-status"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mtc-spinner"
  }), /*#__PURE__*/React.createElement("p", null, "Verifying consent…")), stage === "accepted" && /*#__PURE__*/React.createElement("div", {
    className: "mtc-status mtc-status-success"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle-2"
  }), /*#__PURE__*/React.createElement("p", null, "Consent verified. Opening session…")), stage === "optedOut" && /*#__PURE__*/React.createElement("div", {
    className: "mtc-status"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic-off"
  }), /*#__PURE__*/React.createElement("p", null, "Recording disabled. Continuing the consultation without ambient capture."))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MTCView, null));
