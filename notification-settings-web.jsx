/* ===========================================================================
   PROfinity — Notification Settings (web)
   Full desktop settings surface at /settings/notifications. Reached from the
   notification centre's footer link (see notifications.js). Reads/writes the
   same window.PFNotify settings store the toasts and centre gate against, so
   a change here takes effect immediately elsewhere in the app.
   Suffixed -NSW to avoid clashing with the mobile Notification Settings (-NS).
   =========================================================================== */
const { useState: useStateNSW, useEffect: useEffectNSW } = React;
const DSNSW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavNSW, IconifyIcon: IconNSW } = DSNSW;

const ME_NSW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goNSW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateNSW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goNSW(u);
}

function getPathNSW(settings, path) {
  return path.split(".").reduce(function (o, k) { return o ? o[k] : undefined; }, settings);
}
function setPathNSW(settings, path, value) {
  var next = JSON.parse(JSON.stringify(settings));
  var keys = path.split(".");
  var cur = next;
  for (var i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
  cur[keys[keys.length - 1]] = value;
  return next;
}

function ToggleNSW({ path, settings, onChange, label, desc }) {
  const on = !!getPathNSW(settings, path);
  return (
    <div className="nsw-row">
      <span className="nsw-row-copy">
        <span className="nsw-row-label">{label}</span>
        {desc && <span className="nsw-row-desc">{desc}</span>}
      </span>
      <button
        type="button"
        className={"pf-toggle" + (on ? " on" : "")}
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(setPathNSW(settings, path, !on))}
      >
        <span className="pf-toggle-knob" />
      </button>
    </div>
  );
}

const TONE_OPTIONS_NSW = ["Default", "Chime", "Bell", "Ping", "Whistle", "None"];

function ToneRowNSW({ settings, onChange }) {
  const [open, setOpen] = useStateNSW(false);
  const current = getPathNSW(settings, "sound.tone");
  return (
    <div className="nsw-row nsw-row-tone">
      <span className="nsw-row-copy">
        <span className="nsw-row-label">Notification tone</span>
        <span className="nsw-row-desc">Choose the sound played for incoming notifications.</span>
      </span>
      <button type="button" className="nsw-tone-current" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {current}
        <IconNSW name={open ? "lucide:chevron-up" : "lucide:chevron-down"} size={16} color="var(--gray-500)" />
      </button>
      {open && (
        <div className="nsw-tone-list" role="radiogroup" aria-label="Notification tone">
          {TONE_OPTIONS_NSW.map((tone) => (
            <button
              key={tone}
              type="button"
              className="nsw-tone-option"
              role="radio"
              aria-checked={current === tone}
              onClick={() => { onChange(setPathNSW(settings, "sound.tone", tone)); setOpen(false); }}
            >
              <span className={"nsw-radio-dot" + (current === tone ? " on" : "")} />
              {tone}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionNSW({ title, desc, children }) {
  return (
    <section className="nsw-card">
      <header className="nsw-card-head">
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </header>
      <div className="nsw-card-body">{children}</div>
    </section>
  );
}

function NotificationSettingsWeb() {
  const [settings, setSettings] = useStateNSW(() => (window.PFNotify ? window.PFNotify.getSettings() : null));
  const [saved, setSaved] = useStateNSW(true);

  useEffectNSW(() => {
    if (settings === null && window.PFNotify) setSettings(window.PFNotify.getSettings());
  }, [settings]);

  function update(next) {
    setSettings(next);
    setSaved(false);
  }

  function handleSave() {
    if (!settings || !window.PFNotify) return;
    window.PFNotify.setSettings(settings);
    setSaved(true);
    window.PFNotify.showConfirm("Notification settings saved");
  }
  function handleCancel() {
    if (window.PFNotify) setSettings(window.PFNotify.getSettings());
    setSaved(true);
  }
  function handlePreview() {
    if (window.PFNotify) window.PFNotify.previewPush();
  }

  if (!settings) return null;

  return (
    <div className="app" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavNSW user={ME_NSW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateNSW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="nsw-page" data-screen-label="Notification Settings (web)">
        <div className="nsw-head-row">
          <button type="button" className="nsw-back" aria-label="Back" onClick={() => goNSW("NewsfeedWeb.html")}>
            <IconNSW name="lucide:arrow-left" size={18} color="var(--text-primary)" />
          </button>
          <div className="nsw-head-titles">
            <h1>Notification Settings</h1>
            <p>Manage how and when you receive updates from the platform.</p>
          </div>
          <div className="nsw-head-actions">
            <button type="button" className="nsw-btn-secondary" onClick={handlePreview}>Preview push</button>
            <button type="button" className="nsw-btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
        <div className="nsw-crumb">
          <a onClick={() => goNSW("NewsfeedWeb.html")}>Home</a> / <a onClick={() => goNSW("NewsfeedWeb.html")}>Settings</a> / Notifications
        </div>

        <div className="nsw-grid">
          <SectionNSW title="In-App Notifications" desc="Controls what appears inside PROfinity while you're using it.">
            <ToggleNSW path="inApp.activityFeed" settings={settings} onChange={update} label="Activity Feed" desc="Show new activity as it happens in your feed." />
            <div className="nsw-divider" />
            <ToggleNSW path="inApp.popupToasts" settings={settings} onChange={update} label="Pop-up toasts" desc="Show a pop-up card in the corner for real-time updates." />
          </SectionNSW>

          <SectionNSW title="Push Notifications" desc="Alerts sent to you even when PROfinity isn't open.">
            <ToggleNSW path="push.reminders" settings={settings} onChange={update} label="Reminders" desc="Nudges for courses, events and outstanding tasks." />
            <div className="nsw-divider" />
            <ToggleNSW path="push.securityAlerts" settings={settings} onChange={update} label="Security alerts" desc="Sign-ins, verification and account changes." />
          </SectionNSW>

          <SectionNSW title="Sound & Vibration" desc="Choose how notifications sound and feel.">
            <ToggleNSW path="sound.notificationSound" settings={settings} onChange={update} label="Notification sound" desc="Play a sound when a notification arrives." />
            <div className="nsw-divider" />
            <ToneRowNSW settings={settings} onChange={update} />
            <div className="nsw-divider" />
            <ToggleNSW path="sound.vibration" settings={settings} onChange={update} label="Vibration" desc="Vibrate on supported devices." />
            <div className="nsw-divider" />
            <ToggleNSW path="sound.dnd" settings={settings} onChange={update} label="Do Not Disturb" desc="Silence toasts and sound. Notifications still land in your notification centre." />
          </SectionNSW>

          <SectionNSW title="Social & Activity" desc="Comments and reactions on your posts.">
            <ToggleNSW path="social.commentsOnPost" settings={settings} onChange={update} label="Comments on your post" />
            <div className="nsw-divider" />
            <ToggleNSW path="social.postLikes" settings={settings} onChange={update} label="Post likes" />
            <div className="nsw-divider" />
            <ToggleNSW path="social.commentLikes" settings={settings} onChange={update} label="Comment likes" />
          </SectionNSW>

          <SectionNSW title="Newsfeed & Community" desc="Updates from channels and the wider community.">
            <ToggleNSW path="newsfeed.newsUpdates" settings={settings} onChange={update} label="News updates" />
            <div className="nsw-divider" />
            <ToggleNSW path="newsfeed.communityPosts" settings={settings} onChange={update} label="Community channel posts" />
          </SectionNSW>

          <SectionNSW title="Learning & Courses" desc="Stay on top of your learning progress.">
            <ToggleNSW path="learning.courseReminder" settings={settings} onChange={update} label="Course reminder" />
            <div className="nsw-divider" />
            <ToggleNSW path="learning.newCourseAvailable" settings={settings} onChange={update} label="New course available" />
          </SectionNSW>
        </div>

        <div className="nsw-footer-row">
          <button type="button" className="nsw-btn-secondary" onClick={handleCancel}>Cancel</button>
          <button type="button" className="nsw-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>

        <div className="nsw-help">
          <IconNSW name="lucide:life-buoy" size={20} color="#fff" />
          <span className="nsw-help-text">Need help with notifications?</span>
          <a className="nsw-help-link" href="#" onClick={(e) => e.preventDefault()}>Visit Help Center</a>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<NotificationSettingsWeb />);
