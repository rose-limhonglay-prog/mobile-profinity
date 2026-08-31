/* ===========================================================================
   PROfinity — Certificate (web)
   Full certificate view reached from the "Certificates" tab / "View
   Certificate" buttons on MyLearning.html, via ?title=&instr=&student=&
   issued=&id=. Ornate navy+gold certificate mirroring the certificate-thumb.svg
   motif used on the My Learning cards, plus print/download and share actions.
   Suffixed -CT to avoid clashing with other page globals.
   =========================================================================== */
const DSCT = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavCT, IconifyIcon: IconCT } = DSCT;

const ME_CT = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const TUTOR_CT = "Dr Tim Pearce";
const TUTOR_ROLE_CT = "Clinical Director · PROfinity Academy";

function goCT(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateCT(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goCT(u);
}

function getCertificateCT() {
  const params = new URLSearchParams(window.location.search);
  return {
    title: params.get("title") || "Protox Course",
    instructor: params.get("instr") || TUTOR_CT,
    student: params.get("student") || ME_CT.name,
    issuedDate: params.get("issued") || "12 Jun 2026",
    id: params.get("id") || "PF-CERT-0000",
  };
}

function CTCrumb({ cert }) {
  return (
    <div className="ct-crumb-row">
      <button type="button" className="ct-back-btn" aria-label="Back to My Learning" onClick={() => goCT("MyLearning.html")}>
        <IconCT name="lucide:arrow-left" size={19} color="var(--brand-navy)" />
      </button>
      <span className="ct-crumb">
        <a onClick={() => goCT("MyLearning.html")}>My Learning</a> &nbsp;/&nbsp; <span>{cert.title} Certificate</span>
      </span>
    </div>
  );
}

function CTSeal() {
  return (
    <svg className="ct-seal" viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
      <defs>
        <linearGradient id="ctGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e7a769" />
          <stop offset="100%" stopColor="#ce9957" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="34" fill="none" stroke="url(#ctGold)" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="27" fill="none" stroke="#e7a769" strokeWidth="1" opacity="0.7" />
      <path d="M40 20 L44.2 32.6 57.5 32.6 46.6 40.4 50.8 53 40 45.2 29.2 53 33.4 40.4 22.5 32.6 35.8 32.6 Z" fill="url(#ctGold)" />
    </svg>
  );
}

function CertificateSheet({ cert }) {
  return (
    <article className="ct-sheet" data-screen-label="Certificate">
      <div className="ct-corner tl" /><div className="ct-corner tr" /><div className="ct-corner bl" /><div className="ct-corner br" />
      <div className="ct-brand">
        <img src="assets/profinity-icon-purple-gold.png" alt="" className="ct-brand-mark" />
        <span>PROfinity Academy</span>
      </div>

      <p className="ct-kicker">Certificate of Completion</p>
      <CTSeal />

      <p className="ct-lede">This certifies that</p>
      <h1 className="ct-student">{cert.student}</h1>
      <p className="ct-lede">has successfully completed the course</p>
      <h2 className="ct-title">{cert.title}</h2>

      <div className="ct-meta">
        <div className="ct-meta-col">
          <span className="ct-meta-label">Issued</span>
          <span className="ct-meta-val">{cert.issuedDate}</span>
        </div>
        <div className="ct-meta-col">
          <span className="ct-meta-label">Certificate ID</span>
          <span className="ct-meta-val">{cert.id}</span>
        </div>
        <div className="ct-meta-col signature">
          <span className="ct-signature-name">{cert.instructor}</span>
          <span className="ct-meta-label">{TUTOR_ROLE_CT}</span>
        </div>
      </div>
    </article>
  );
}

function CTActions({ cert }) {
  const [copied, setCopied] = React.useState(false);
  function share() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
    }
  }
  return (
    <div className="ct-actions">
      <button type="button" className="ct-btn filled" onClick={() => window.print()}>
        <IconCT name="lucide:download" size={18} color="#fff" />Download / Print
      </button>
      <button type="button" className="ct-btn ghost" onClick={share}>
        <IconCT name={copied ? "lucide:check" : "lucide:share-2"} size={18} color="var(--brand-navy)" />
        {copied ? "Link copied" : "Share"}
      </button>
      <button type="button" className="ct-btn ghost" onClick={() => goCT(`CourseWeb.html?${new URLSearchParams({ title: cert.title, instr: cert.instructor, pct: 100 })}`)}>
        <IconCT name="lucide:book-open" size={18} color="var(--brand-navy)" />View Course
      </button>
    </div>
  );
}

function CertificateApp() {
  const cert = getCertificateCT();
  React.useEffect(() => { document.title = "PROfinity — " + cert.title + " Certificate"; }, []);

  return (
    <div className="app ct-app">
      <TopNavCT active="My Learning" user={ME_CT} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateCT}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="ct-page">
        <CTCrumb cert={cert} />
        <CertificateSheet cert={cert} />
        <CTActions cert={cert} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CertificateApp />);
