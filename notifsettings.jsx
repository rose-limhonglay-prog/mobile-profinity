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
  const [security, setSecurity] = useStateNS(true);
  const [activity, setActivity] = useStateNS(true);
  const [toasts, setToasts] = useStateNS(true);
  const [sound, setSound] = useStateNS(true);
  const [tone, setTone] = useStateNS(0.65);

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
        <p className="ns-sec-desc">Manage how and when you receive updates from the platform.</p>

        <div className="ns-card">
          <div className="ns-card-h">Push Notifications</div>
          <p className="ns-card-desc">Real-time alerts sent to your browser or mobile app.</p>
          <ToggleNS label="Security alerts" desc="Instant notifications for new logins or password changes."
          on={security} onToggle={() => setSecurity((v) => !v)} />
        </div>

        <div className="ns-card">
          <div className="ns-card-h">In-App Notifications</div>
          <p className="ns-card-desc">Notifications that appear while you are using the platform.</p>
          <ToggleNS label="Activity Feed" desc="Show minor updates and non-critical activity in the sidebar feed."
          on={activity} onToggle={() => setActivity((v) => !v)} />
          <div className="ns-divider" />
          <ToggleNS label="Pop-up toasts" desc="Show brief success or error messages for system actions."
          on={toasts} onToggle={() => setToasts((v) => !v)} />
        </div>

        <div className="ns-card">
          <div className="ns-card-h">Sound &amp; Vibration</div>
          <p className="ns-card-desc">Control how notifications make noise and vibrate.</p>
          <ToggleNS label="Notification sound" desc="Play a sound when you receive a notification."
          on={sound} onToggle={() => setSound((v) => !v)} />
          <div className="ns-divider" />
          <div className="ns-tone-row">
            <span className="ns-toggle-label">Notification tone</span>
            <div className="ns-slider" role="slider" aria-label="Notification tone" aria-valuenow={Math.round(tone * 100)}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setTone(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
            }}>
              <span className="ns-slider-fill" style={{ width: (tone * 100) + "%" }} />
              <span className="ns-slider-thumb" style={{ left: (tone * 100) + "%" }} />
            </div>
          </div>
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
