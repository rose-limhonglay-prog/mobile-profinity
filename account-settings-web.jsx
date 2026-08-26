/* ===========================================================================
   PROfinity — Account Settings (web)
   Desktop settings surface at /settings. Ports the mobile Account Settings
   screen (account-settings.jsx) — profile shortcuts + the Display/dark-mode
   card — onto the same TopNav shell used by NotificationSettingsWeb.
   Suffixed -ASW to avoid clashing with the mobile Account Settings (-AS).
   =========================================================================== */
const { useState: useStateASW } = React;
const DSASW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavASW, IconifyIcon: IconASW } = DSASW;

const ME_ASW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goASW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateASW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goASW(u);
}

function useDarkModeASW() {
  const [dark, setDark] = useStateASW(() => {
    try { return localStorage.getItem("pf-theme") === "dark"; } catch (e) { return false; }
  });
  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem("pf-theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    } catch (e) {}
  }
  return [dark, toggle];
}

const ASW_ITEMS_BEFORE = [
  { label: "Edit Profile", icon: "lucide:user", desc: "Update your photo, bio and credentials.", href: "Profile.html" },
  { label: "My Saved", icon: "lucide:bookmark", desc: "Posts, lessons and events you've bookmarked.", href: null },
  { label: "Notifications", icon: "lucide:bell", desc: "Choose what updates you receive and how.", href: "NotificationSettingsWeb.html" }
];

const ASW_ITEMS_AFTER = [
  { label: "Privacy & Security", icon: "lucide:shield", desc: "Manage password, sign-in and data sharing.", href: null }
];

function AswRow({ icon, label, desc, href }) {
  return (
    <button type="button" className={"asw-row" + (href ? "" : " asw-row-disabled")} onClick={() => href && goASW(href)} disabled={!href}>
      <span className="asw-row-icon"><IconASW name={icon} size={19} color="var(--brand-navy)" /></span>
      <span className="asw-row-copy">
        <span className="asw-row-label">{label}</span>
        <span className="asw-row-desc">{desc}</span>
      </span>
      {href && <IconASW name="lucide:chevron-right" size={18} color="var(--gray-450)" />}
    </button>
  );
}

function AswDarkSwitch({ on, onToggle }) {
  return (
    <button type="button" className={"asw-switch" + (on ? " on" : "")} onClick={onToggle} role="switch"
      aria-checked={on} aria-label={on ? "Switch to light mode" : "Switch to dark mode"}>
      <span className="asw-knob">
        {on && <IconASW name="lucide:moon" size={13} color="#1A1736" />}
      </span>
    </button>
  );
}

function AccountSettingsWeb() {
  const [dark, toggleDark] = useDarkModeASW();

  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavASW user={ME_ASW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateASW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="nsw-page" data-screen-label="Account Settings (web)">
        <div className="nsw-head-row">
          <button type="button" className="nsw-back" aria-label="Back" onClick={() => goASW("NewsfeedWeb.html")}>
            <IconASW name="lucide:arrow-left" size={18} color="var(--text-primary)" />
          </button>
          <div className="nsw-head-titles">
            <h1>Settings</h1>
            <p>Manage your profile, notifications and how PROfinity looks.</p>
          </div>
        </div>
        <div className="nsw-crumb">
          <a onClick={() => goASW("NewsfeedWeb.html")}>Home</a> / Settings
        </div>

        <button type="button" className="asw-verify" onClick={() => goASW("Profile.html")}>
          <IconASW name="lucide:badge-check" size={20} color="var(--premium-orange)" />
          <span className="asw-verify-copy">
            <span className="asw-row-label">Verify your medical credentials</span>
            <span className="asw-row-desc">Adding more credentials helps people know you're the real deal.</span>
          </span>
          <span className="asw-verify-pill">Not Verified</span>
        </button>

        <div className="nsw-grid">
          <section className="nsw-card">
            <header className="nsw-card-head"><h2>My Profile</h2></header>
            <div className="asw-list">
              {ASW_ITEMS_BEFORE.map((item) => <AswRow key={item.label} {...item} />)}
            </div>
          </section>

          <section className="nsw-card">
            <header className="nsw-card-head"><h2>Appearance</h2></header>
            <div className="nsw-card-body">
              <div className="asw-display-row">
                <span className="asw-row-copy">
                  <span className="asw-row-label">Dark mode</span>
                  <span className="asw-row-desc">Adjust the appearance of the app to reduce glare and give your eyes a break.</span>
                </span>
                <AswDarkSwitch on={dark} onToggle={toggleDark} />
              </div>
            </div>
          </section>

          <section className="nsw-card">
            <header className="nsw-card-head"><h2>Privacy</h2></header>
            <div className="asw-list">
              {ASW_ITEMS_AFTER.map((item) => <AswRow key={item.label} {...item} />)}
            </div>
          </section>
        </div>

        <button type="button" className="asw-logout" onClick={() => goASW("AuthWeb.html?view=loggedout")}>
          <IconASW name="lucide:log-out" size={18} color="var(--brand-navy)" />
          Log out
        </button>

        <div className="asw-footer">
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AccountSettingsWeb />);
