/* ===========================================================================
   PROfinity — Certificate (web)
   Full certificate view reached from the "Certificates" tab / "View
   Certificate" buttons on MyLearning.html, via ?title=&instr=&student=&
   issued=&id=. Ornate navy+gold certificate mirroring the certificate-thumb.svg
   motif used on the My Learning cards, plus print/download and share actions.
   Suffixed -CT to avoid clashing with other page globals.
   =========================================================================== */
const DSCT = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavCT,
  IconifyIcon: IconCT
} = DSCT;
const ME_CT = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const TUTOR_CT = "Dr Tim Pearce";
const TUTOR_ROLE_CT = "Clinical Director · PROfinity Academy";
function goCT(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateCT(label) {
  var u = {
    Home: "Newsfeed.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goCT(u);
}
function getCertificateCT() {
  const params = new URLSearchParams(window.location.search);
  return {
    title: params.get("title") || "Protox Course",
    instructor: params.get("instr") || TUTOR_CT,
    student: params.get("student") || ME_CT.name,
    issuedDate: params.get("issued") || "12 Jun 2026",
    id: params.get("id") || "PF-CERT-0000"
  };
}
function CTCrumb({
  cert
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ct-crumb-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ct-back-btn",
    "aria-label": "Back to My Learning",
    onClick: () => goCT("MyLearning.html")
  }, /*#__PURE__*/React.createElement(IconCT, {
    name: "lucide:arrow-left",
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ct-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goCT("MyLearning.html")
  }, "My Learning"), " \xA0/\xA0 ", /*#__PURE__*/React.createElement("span", null, cert.title, " Certificate")));
}
function CTSeal() {
  return /*#__PURE__*/React.createElement("svg", {
    className: "ct-seal",
    viewBox: "0 0 80 80",
    width: "80",
    height: "80",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "ctGold",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#e7a769"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#ce9957"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "40",
    r: "34",
    fill: "none",
    stroke: "url(#ctGold)",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "40",
    r: "27",
    fill: "none",
    stroke: "#e7a769",
    strokeWidth: "1",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40 20 L44.2 32.6 57.5 32.6 46.6 40.4 50.8 53 40 45.2 29.2 53 33.4 40.4 22.5 32.6 35.8 32.6 Z",
    fill: "url(#ctGold)"
  }));
}
function CertificateSheet({
  cert
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "ct-sheet",
    "data-screen-label": "Certificate"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ct-corner tl"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ct-corner tr"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ct-corner bl"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ct-corner br"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ct-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "",
    className: "ct-brand-mark"
  }), /*#__PURE__*/React.createElement("span", null, "PROfinity Academy")), /*#__PURE__*/React.createElement("p", {
    className: "ct-kicker"
  }, "Certificate of Completion"), /*#__PURE__*/React.createElement(CTSeal, null), /*#__PURE__*/React.createElement("p", {
    className: "ct-lede"
  }, "This certifies that"), /*#__PURE__*/React.createElement("h1", {
    className: "ct-student"
  }, cert.student), /*#__PURE__*/React.createElement("p", {
    className: "ct-lede"
  }, "has successfully completed the course"), /*#__PURE__*/React.createElement("h2", {
    className: "ct-title"
  }, cert.title), /*#__PURE__*/React.createElement("div", {
    className: "ct-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ct-meta-col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ct-meta-label"
  }, "Issued"), /*#__PURE__*/React.createElement("span", {
    className: "ct-meta-val"
  }, cert.issuedDate)), /*#__PURE__*/React.createElement("div", {
    className: "ct-meta-col"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ct-meta-label"
  }, "Certificate ID"), /*#__PURE__*/React.createElement("span", {
    className: "ct-meta-val"
  }, cert.id)), /*#__PURE__*/React.createElement("div", {
    className: "ct-meta-col signature"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ct-signature-name"
  }, cert.instructor), /*#__PURE__*/React.createElement("span", {
    className: "ct-meta-label"
  }, TUTOR_ROLE_CT))));
}
function CTActions({
  cert
}) {
  const [copied, setCopied] = React.useState(false);
  function share() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "ct-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ct-btn filled",
    onClick: () => window.print()
  }, /*#__PURE__*/React.createElement(IconCT, {
    name: "lucide:download",
    size: 18,
    color: "#fff"
  }), "Download / Print"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ct-btn ghost",
    onClick: share
  }, /*#__PURE__*/React.createElement(IconCT, {
    name: copied ? "lucide:check" : "lucide:share-2",
    size: 18,
    color: "var(--brand-navy)"
  }), copied ? "Link copied" : "Share"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ct-btn ghost",
    onClick: () => goCT(`CourseWeb.html?${new URLSearchParams({
      title: cert.title,
      instr: cert.instructor,
      pct: 100
    })}`)
  }, /*#__PURE__*/React.createElement(IconCT, {
    name: "lucide:book-open",
    size: 18,
    color: "var(--brand-navy)"
  }), "View Course"));
}
function CertificateApp() {
  const cert = getCertificateCT();
  React.useEffect(() => {
    document.title = "PROfinity — " + cert.title + " Certificate";
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "app ct-app"
  }, /*#__PURE__*/React.createElement(TopNavCT, {
    active: "My Learning",
    user: ME_CT,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateCT,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ct-page"
  }, /*#__PURE__*/React.createElement(CTCrumb, {
    cert: cert
  }), /*#__PURE__*/React.createElement(CertificateSheet, {
    cert: cert
  }), /*#__PURE__*/React.createElement(CTActions, {
    cert: cert
  })));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(CertificateApp, null));
