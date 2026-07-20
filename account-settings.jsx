/* ===========================================================================
   PROfinity — Account Settings (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -AS to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateAS, useEffect: useEffectAS } = React;
const DSAS = window.ProfinityDesignSystem_c2b5cc;

function goAS(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleAS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateAS(calc);
  useEffectAS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileAS() {
  const [mobile, setMobile] = useStateAS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectAS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function useDarkModeAS() {
  const [dark, setDark] = useStateAS(() => {
    try { return localStorage.getItem('pf-theme') === 'dark'; } catch(e) { return false; }
  });
  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('pf-theme', next ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    } catch(e) {}
  }
  return [dark, toggle];
}

const AS_PROFILE_ITEMS_BEFORE = [
  { label: "Edit Profile",       icon: "lucide:book-open",       href: "ProfileMobile.html" },
  { label: "Account Settings",   icon: "lucide:graduation-cap",  href: null },
  { label: "My Saved",           icon: "lucide:bookmark",        href: "MySaved.html" },
  { label: "Notifications",      icon: "lucide:calendar",        href: "NotificationSettings.html" },
];

const AS_PROFILE_ITEMS_AFTER = [
  { label: "Privacy & Security", icon: "lucide:shield",          href: null },
];

function ASRow({ icon, label, href }) {
  return (
    <button className="as-row" onClick={() => href && goAS(href)}>
      <DSAS.IconifyIcon name={icon} size={22} color="var(--gray-900)" />
      <span className="as-row-label">{label}</span>
      <DSAS.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
    </button>
  );
}

function DarkSwitch({ on, onToggle }) {
  return (
    <button
      className={"as-switch" + (on ? " on" : "")}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={on ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="as-knob">
        {on && <DSAS.IconifyIcon name="lucide:moon" size={13} color="#1A1736" />}
      </span>
    </button>
  );
}

function DisplayCard({ dark, onToggle }) {
  return (
    <div className="as-display-card">
      <div className="as-display-top">
        <span className="as-display-label">Display</span>
        <DarkSwitch on={dark} onToggle={onToggle} />
      </div>
      <p className="as-display-desc">
        Adjust the appearance of the app to reduce glare and give your eyes a break
      </p>
    </div>
  );
}

function AccountSettings() {
  const [dark, toggleDark] = useDarkModeAS();
  return (
    <div className="as-screen" data-screen-label="Account Settings (mobile)">
      <header className="as-top">
        <button className="as-back" aria-label="Back" onClick={() => goAS("ProfileMobile.html")}>
          <DSAS.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>Settings</h1>
      </header>

      <div className="as-scroll">
        <div className="as-sec-h">My Profile</div>

        <button className="as-row as-verify" onClick={() => goAS("ProfileMobile.html")}>
          <DSAS.IconifyIcon name="lucide:book-open" size={22} color="var(--premium-orange)" />
          <span className="as-row-label">Verify Profile</span>
          <span className="as-verify-pill">Not Verified</span>
        </button>

        <nav className="as-list">
          {AS_PROFILE_ITEMS_BEFORE.map(item =>
            <ASRow key={item.label} icon={item.icon} label={item.label} href={item.href} />
          )}
        </nav>

        <DisplayCard dark={dark} onToggle={toggleDark} />

        <nav className="as-list">
          {AS_PROFILE_ITEMS_AFTER.map(item =>
            <ASRow key={item.label} icon={item.icon} label={item.label} href={item.href} />
          )}
        </nav>

        <button className="as-logout" onClick={() => goAS("NewsfeedMobile.html")}>
          Logout
          <DSAS.IconifyIcon name="lucide:log-out" size={20} color="var(--text-heading)" />
        </button>

        <div className="as-footer">
          <a className="as-footer-link" href="#" onClick={e => e.preventDefault()}>Terms</a>
          <a className="as-footer-link" href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

function AccountSettingsApp() {
  const mobile = useIsMobileAS();
  const scale = useDeviceScaleAS();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}><AccountSettings /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><AccountSettings /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AccountSettingsApp />);
