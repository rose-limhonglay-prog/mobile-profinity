/* ===========================================================================
   PROfinity — Clinician Directory · iPhone 17 Pro Max mobile
   Map view with clinician pins and a selected-clinician card popup.
   Suffixed -CD to avoid global-scope clashes.
   =========================================================================== */
const DSCD = window.ProfinityDesignSystem_c2b5cc;

function goCD(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

function useDeviceScaleCD() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = React.useState(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileCD() {
  const [mobile, setMobile] = React.useState(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const CD_TABS = [
  { key: "Home",      label: "Home",        icon: "lucide:home",      href: "NewsfeedMobile.html" },
  { key: "Profile",   label: "Profile",     icon: "lucide:user",      href: "ProfileMobile.html" },
  { key: "Learning",  label: "My Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
  { key: "Community", label: "Community",   icon: "lucide:users",     href: "CommunityMobile.html" },
  { key: "Agent",     label: "Agent",       icon: "lucide:sparkles",  href: "Agent.html" },
];

const CD_CLINICIANS = [
  {
    id: 1,
    name: "Dr. Sarah Collins",
    specialty: "Cosmetic Medicine",
    distance: "0.8 miles away",
    avatar: null,
    pinX: "25%",
    pinY: "30%",
  },
  {
    id: 2,
    name: "Priya Shah",
    specialty: "Advanced Injectables",
    distance: "1.5 miles away",
    avatar: null,
    pinX: "55%",
    pinY: "25%",
  },
  {
    id: 3,
    name: "Dr Amir Khan",
    specialty: "Aesthetic Dermatology",
    distance: "2.2 miles away",
    avatar: null,
    pinX: "70%",
    pinY: "50%",
  },
  {
    id: 4,
    name: "Nurse Beth",
    specialty: "Nurse Prescriber, Dermal Fillers",
    distance: "3.0 miles away",
    avatar: null,
    pinX: "40%",
    pinY: "65%",
  },
  {
    id: 5,
    name: "Mark Ellis",
    specialty: "Clinic Director & Practitioner",
    distance: "4.1 miles away",
    avatar: null,
    pinX: "60%",
    pinY: "80%",
  },
];

/* ===== Inline SVG map background (OpenStreetMap-style street grid) ===== */
function CDMapSVG() {
  return (
    <svg
      className="cd-map-bg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 440 680"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* base land */}
      <rect width="440" height="680" fill="#f0ebe3" />

      {/* park / green areas */}
      <rect x="0" y="0" width="140" height="120" fill="#c8dbb0" />
      <rect x="0" y="0" width="60" height="60" rx="8" fill="#b8cf9e" />
      <rect x="180" y="260" width="100" height="80" rx="6" fill="#c8dbb0" />
      <rect x="260" y="400" width="80" height="60" rx="6" fill="#c8dbb0" />

      {/* river */}
      <path d="M120 280 C160 290 200 270 240 285 C280 300 320 285 360 295 C390 302 420 298 440 300 L440 340 C420 338 390 342 360 335 C320 325 280 340 240 325 C200 310 160 330 120 320 Z" fill="#a8c8e8" opacity="0.8" />

      {/* major roads */}
      <rect x="0" y="150" width="440" height="14" fill="#fff" />
      <rect x="0" y="152" width="440" height="10" fill="#f8f5f0" />
      <rect x="110" y="0" width="14" height="680" fill="#fff" />
      <rect x="112" y="0" width="10" height="680" fill="#f8f5f0" />
      <rect x="240" y="0" width="12" height="680" fill="#fff" />
      <rect x="242" y="0" width="8" height="680" fill="#f8f5f0" />
      <rect x="0" y="380" width="440" height="12" fill="#fff" />
      <rect x="0" y="382" width="440" height="8" fill="#f8f5f0" />

      {/* minor streets */}
      <rect x="0" y="80" width="440" height="5" fill="#ede9e2" />
      <rect x="0" y="220" width="440" height="5" fill="#ede9e2" />
      <rect x="0" y="320" width="110" height="5" fill="#ede9e2" />
      <rect x="124" y="320" width="116" height="5" fill="#ede9e2" />
      <rect x="252" y="320" width="188" height="5" fill="#ede9e2" />
      <rect x="0" y="440" width="440" height="5" fill="#ede9e2" />
      <rect x="0" y="520" width="440" height="5" fill="#ede9e2" />
      <rect x="0" y="600" width="440" height="5" fill="#ede9e2" />
      <rect x="55" y="0" width="5" height="680" fill="#ede9e2" />
      <rect x="175" y="0" width="5" height="680" fill="#ede9e2" />
      <rect x="310" y="0" width="5" height="680" fill="#ede9e2" />
      <rect x="380" y="0" width="5" height="680" fill="#ede9e2" />

      {/* city blocks — light rectangles */}
      <rect x="15" y="165" width="38" height="48" rx="3" fill="#e6e0d6" />
      <rect x="58" y="165" width="48" height="48" rx="3" fill="#e6e0d6" />
      <rect x="124" y="165" width="44" height="48" rx="3" fill="#e6e0d6" />
      <rect x="180" y="165" width="56" height="48" rx="3" fill="#e6e0d6" />
      <rect x="252" y="165" width="52" height="48" rx="3" fill="#e6e0d6" />
      <rect x="316" y="165" width="58" height="48" rx="3" fill="#e6e0d6" />
      <rect x="15" y="230" width="38" height="82" rx="3" fill="#e6e0d6" />
      <rect x="58" y="230" width="48" height="82" rx="3" fill="#e6e0d6" />
      <rect x="124" y="230" width="44" height="82" rx="3" fill="#e6e0d6" />
      <rect x="180" y="230" width="56" height="82" rx="3" fill="#e6e0d6" />
      <rect x="252" y="230" width="52" height="82" rx="3" fill="#e6e0d6" />
      <rect x="316" y="230" width="58" height="82" rx="3" fill="#e6e0d6" />
      <rect x="15" y="395" width="38" height="38" rx="3" fill="#e6e0d6" />
      <rect x="58" y="395" width="48" height="38" rx="3" fill="#e6e0d6" />
      <rect x="124" y="395" width="44" height="38" rx="3" fill="#e6e0d6" />
      <rect x="180" y="395" width="56" height="38" rx="3" fill="#e6e0d6" />
      <rect x="252" y="395" width="52" height="38" rx="3" fill="#e6e0d6" />
      <rect x="316" y="395" width="58" height="38" rx="3" fill="#e6e0d6" />
      <rect x="15" y="455" width="88" height="58" rx="3" fill="#e6e0d6" />
      <rect x="124" y="455" width="100" height="58" rx="3" fill="#e6e0d6" />
      <rect x="252" y="455" width="110" height="58" rx="3" fill="#e6e0d6" />
      <rect x="15" y="530" width="88" height="62" rx="3" fill="#e6e0d6" />
      <rect x="124" y="530" width="100" height="62" rx="3" fill="#e6e0d6" />
      <rect x="252" y="530" width="110" height="62" rx="3" fill="#e6e0d6" />
      <rect x="15" y="610" width="88" height="60" rx="3" fill="#e6e0d6" />
      <rect x="124" y="610" width="100" height="60" rx="3" fill="#e6e0d6" />
      <rect x="252" y="610" width="110" height="60" rx="3" fill="#e6e0d6" />

      {/* road labels */}
      <text x="220" y="148" textAnchor="middle" fontSize="9" fill="#888" fontFamily="sans-serif">High Street</text>
      <text x="108" y="200" textAnchor="middle" fontSize="9" fill="#888" fontFamily="sans-serif" transform="rotate(-90 108 200)">Park Rd</text>
    </svg>
  );
}

function CDPin({ clinician, active, onClick }) {
  return (
    <button
      className={"cd-pin" + (active ? " active" : "")}
      style={{ left: clinician.pinX, top: clinician.pinY }}
      aria-label={clinician.name}
      onClick={onClick}
    >
      <div className="cd-pin-dot" />
      <div className="cd-pin-tail" />
    </button>
  );
}

function CDCard({ clinician }) {
  return (
    <div className="cd-card">
      <div className="cd-card-row">
        {clinician.avatar
          ? <img className="cd-card-avatar" src={clinician.avatar} alt={clinician.name} />
          : <DSCD.Avatar name={clinician.name} size={62} style={{ borderRadius: "50%", flex: "none" }} />
        }
        <div className="cd-card-info">
          <p className="cd-card-name">{clinician.name}</p>
          <p className="cd-card-spec">{clinician.specialty}</p>
          <div className="cd-card-dist">
            <DSCD.IconifyIcon name="lucide:map-pin" size={13} color="var(--gray-450)" />
            {clinician.distance}
          </div>
        </div>
      </div>
      <button className="cd-card-btn">View Profile</button>
    </div>
  );
}

function CDTabBar() {
  return (
    <nav className="cd-tabs" aria-label="Primary">
      {CD_TABS.map((t) => (
        <button
          key={t.key}
          className={"cd-tab" + (t.key === "Community" ? " on" : "")}
          aria-current={t.key === "Community" ? "page" : undefined}
          onClick={() => t.href && goCD(t.href)}
        >
          <span className="ic">
            <DSCD.IconifyIcon
              name={t.icon}
              size={23}
              color={t.key === "Community" ? "var(--brand-navy)" : "var(--gray-450)"}
            />
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

function CDScreen() {
  const [activeId, setActiveId] = React.useState(1);
  const [query, setQuery] = React.useState("");

  const activeClinician = CD_CLINICIANS.find((c) => c.id === activeId);

  return (
    <div className="cd-screen" data-screen-label="Clinician Directory">
      {/* Header */}
      <header className="cd-head">
        <button className="cd-back" aria-label="Back" onClick={() => goCD("CommunityMobile.html")}>
          <DSCD.IconifyIcon name="lucide:arrow-left" size={22} color="var(--text-heading)" />
        </button>
        <h1 className="cd-title">Clinician Directory</h1>
        <div className="cd-head-spacer" />
      </header>

      {/* Search */}
      <div className="cd-search-wrap">
        <div className="cd-search-pill">
          <DSCD.IconifyIcon name="lucide:search" size={17} color="var(--gray-450)" />
          <input
            type="text"
            placeholder="Search by specialty or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Map */}
      <div className="cd-map-wrap">
        <CDMapSVG />
        {CD_CLINICIANS.map((c) => (
          <CDPin
            key={c.id}
            clinician={c}
            active={c.id === activeId}
            onClick={() => setActiveId(c.id)}
          />
        ))}
        {activeClinician && <CDCard clinician={activeClinician} />}
      </div>

      <CDTabBar />
    </div>
  );
}

function ClinicianDirectoryApp() {
  const mobile = useIsMobileCD();
  const scale = useDeviceScaleCD();
  const screen = <CDScreen />;
  if (mobile) {
    return <div className="app" style={{ background: "var(--surface-card)" }}>{screen}</div>;
  }
  return (
    <div className="app device-stage" style={{ backgroundColor: "rgb(216,218,226)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}>{screen}</IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ClinicianDirectoryApp />);
