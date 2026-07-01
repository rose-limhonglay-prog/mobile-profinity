/* ===========================================================================
   PROfinity — Display Settings (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -DS to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateDS, useEffect: useEffectDS } = React;
const DSDS = window.ProfinityDesignSystem_c2b5cc;

function goDS(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleDS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateDS(calc);
  useEffectDS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileDS() {
  const [mobile, setMobile] = useStateDS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectDS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function ThemeCard({ kind, theme, accent, accentColor, on, onPick }) {
  return (
    <button className={"ds-themecard ds-" + kind + (on ? " on" : "")} onClick={onPick}
    role="radio" aria-checked={on}>
      <span className="ds-preview">
        <span className="ds-prow"><b>Theme</b><i>{theme}</i></span>
        <span className="ds-prow"><b>Accent</b><i style={{ color: accentColor }}>{accent}</i></span>
        <span className="ds-prow"><b>Size</b><i>Medium</i></span>
      </span>
      <span className="ds-themelabel">{kind === "dark" ? "Dark" : "Light"}</span>
      <span className="ds-themeradio" aria-hidden="true" style={{
        backgroundColor: on ? "#CE9957" : "rgb(255, 255, 255)",
        borderColor: on ? "#CE9957" : "rgb(208, 213, 221)"
      }}>
        {on && <DSDS.IconifyIcon name="lucide:check" size={16} color="#fff" />}
      </span>
    </button>);
}

function Toggle({ label, on, onToggle }) {
  return (
    <button className={"ds-toggle-row" + (on ? " on" : "")} onClick={onToggle}
    role="switch" aria-checked={on}>
      <span className="ds-toggle-label" style={{ fontSize: "18px" }}>{label}</span>
      <span className="ds-switch" aria-hidden="true"><span className="ds-knob" /></span>
    </button>);
}

function DisplaySettings() {
  const [theme, setTheme] = useStateDS("dark");
  const [hc, setHc] = useStateDS(false);
  const [rm, setRm] = useStateDS(false);
  const [bold, setBold] = useStateDS(false);
  return (
    <div className="ds-screen" data-screen-label="Display Settings (mobile)">
      <header className="ds-top">
        <button className="ds-back" aria-label="Back" onClick={() => goDS("NewsfeedMobile.html")}>
          <DSDS.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>Display Settings</h1>
      </header>

      <div className="ds-scroll">
        <div className="ds-sec-h">Appearance</div>
        <div className="ds-card">
          <div className="ds-themes" role="radiogroup" aria-label="Theme">
            <ThemeCard kind="dark" theme="Dark" accent="Purple" accentColor="#9D8DFF"
            on={theme === "dark"} onPick={() => setTheme("dark")} />
            <ThemeCard kind="light" theme="Light" accent="Blue" accentColor="var(--reaction-like)"
            on={theme === "light"} onPick={() => setTheme("light")} />
          </div>
          <button className="ds-fontrow" onClick={() => {}}>
            <span className="ds-fontlabel" style={{ fontSize: "18px" }}>Font Size</span>
            <span className="ds-fontval" style={{ fontSize: "16px", color: "rgb(0, 0, 0)" }}>Medium</span>
            <DSDS.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-450)" />
          </button>
        </div>

        <div className="ds-sec-h">Accessibility</div>
        <div className="ds-card ds-card-list">
          <Toggle label="High Contrast" on={hc} onToggle={() => setHc((v) => !v)} />
          <Toggle label="Reduce Motion" on={rm} onToggle={() => setRm((v) => !v)} />
          <Toggle label="Bold Text" on={bold} onToggle={() => setBold((v) => !v)} />
        </div>
      </div>
    </div>);
}

function DisplaySettingsApp() {
  const mobile = useIsMobileDS();
  const scale = useDeviceScaleDS();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(217, 218, 225)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><DisplaySettings /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><DisplaySettings /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<DisplaySettingsApp />);
