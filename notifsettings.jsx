/* ===========================================================================
   PROfinity — Notification Settings (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -NS to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateNS, useEffect: useEffectNS } = React;
const DSNS = window.ProfinityDesignSystem_c2b5cc;

function goNS(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleNS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateNS(calc);
  useEffectNS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileNS() {
  const [mobile, setMobile] = useStateNS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectNS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function ToggleNS({ label, desc, on, onToggle }) {
  return (
    <div className="ns-toggle-row">
      <span className="ns-toggle-copy">
        <span className="ns-toggle-label">{label}</span>
        {desc && <span className="ns-toggle-desc">{desc}</span>}
      </span>
      <button className={"ns-switch" + (on ? " on" : "")} onClick={onToggle}
      role="switch" aria-checked={on} aria-label={label}>
        <span className="ns-knob" />
      </button>
    </div>);
}

function NotificationSettings() {
  const [push, setPush] = useStateNS(true);
  const [social, setSocial] = useStateNS(true);
  const [learning, setLearning] = useStateNS(true);

  return (
    <div className="ns-screen" data-screen-label="Notification Settings (mobile)">
      <header className="ns-top">
        <button className="ns-back" aria-label="Back" onClick={() => goNS("ProfileMobile.html")}>
          <DSNS.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>Notification Settings</h1>
      </header>

      <div className="ns-scroll">
        <div className="ns-sec-h">Updates &amp; Alerts</div>
        <p className="ns-sec-desc">Keep it simple — choose what you want to hear about.</p>

        <div className="ns-card">
          <ToggleNS label="Push notifications" desc="Real-time alerts sent to your device, including security and account activity."
          on={push} onToggle={() => setPush((v) => !v)} />
          <div className="ns-divider" />
          <ToggleNS label="Social & community" desc="Comments, likes, follows and new posts in channels you follow."
          on={social} onToggle={() => setSocial((v) => !v)} />
          <div className="ns-divider" />
          <ToggleNS label="Learning & courses" desc="Course reminders and new courses available in your topics."
          on={learning} onToggle={() => setLearning((v) => !v)} />
        </div>
      </div>
    </div>);
}

function NotificationSettingsApp() {
  const mobile = useIsMobileNS();
  const scale = useDeviceScaleNS();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(217, 218, 225)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><NotificationSettings /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><NotificationSettings /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<NotificationSettingsApp />);
