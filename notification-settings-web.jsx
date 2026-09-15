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

/* ---- Gamification (points pop-ups, streak celebrations, sounds) ----
   Backed by the shared stores the popups already read — "pf-gamification"
   (PFGamification in points-sound.js), "pf-sound" (mute) and "pf-sound-theme"
   (sound style) — but edited here as a draft and written on Save Changes, so
   the whole page keeps one Save/Cancel model. */
const GAMI_KEY_NSW = "pf-gamification";
const THEMES_FALLBACK_NSW = [
  { id: "coin", label: "Coin", desc: "Bright two-note chime" }, { id: "bell", label: "Bell", desc: "Glassy, long ring" },
  { id: "arcade", label: "Arcade", desc: "Retro 8-bit blips" }, { id: "soft", label: "Soft", desc: "Warm, low and gentle" },
  { id: "bubble", label: "Bubble", desc: "Playful rising pops" }];
function themesNSW() { return window.PFPointsSound && window.PFPointsSound.themes ? window.PFPointsSound.themes() : THEMES_FALLBACK_NSW; }
function readGamiNSW() {
  var g = { pointsPopup: true, streakPopup: true, dailyGoalPopup: true };
  if (window.PFGamification) g = window.PFGamification.get();
  else { try { var s = JSON.parse(localStorage.getItem(GAMI_KEY_NSW)) || {}; g = { pointsPopup: s.pointsPopup !== false, streakPopup: s.streakPopup !== false, dailyGoalPopup: s.dailyGoalPopup !== false }; } catch (e) {} }
  var ps = window.PFPointsSound;
  var sound = ps ? ps.enabled() : (function () { try { return localStorage.getItem("pf-sound") !== "off"; } catch (e) { return true; } })();
  var theme = ps && ps.getTheme ? ps.getTheme() : "coin";
  return { pointsPopup: g.pointsPopup, streakPopup: g.streakPopup, dailyGoalPopup: g.dailyGoalPopup, sound: sound, theme: theme };
}
function writeGamiNSW(d) {
  var g = { pointsPopup: d.pointsPopup, streakPopup: d.streakPopup, dailyGoalPopup: d.dailyGoalPopup };
  if (window.PFGamification) window.PFGamification.set(g); else { try { localStorage.setItem(GAMI_KEY_NSW, JSON.stringify(g)); } catch (e) {} }
  var ps = window.PFPointsSound;
  if (ps) { d.sound ? ps.unmute() : ps.mute(); if (ps.setTheme) ps.setTheme(d.theme); }
  else { try { d.sound ? localStorage.removeItem("pf-sound") : localStorage.setItem("pf-sound", "off"); localStorage.setItem("pf-sound-theme", d.theme); } catch (e) {} }
}
function previewNSW(kind, theme) { if (window.PFPointsSound && window.PFPointsSound.preview) window.PFPointsSound.preview(kind, theme); }

function GamiToggleNSW({ on, onChange, label, desc }) {
  return (
    <div className="nsw-row">
      <span className="nsw-row-copy">
        <span className="nsw-row-label">{label}</span>
        {desc && <span className="nsw-row-desc">{desc}</span>}
      </span>
      <button type="button" className={"pf-toggle" + (on ? " on" : "")} role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}>
        <span className="pf-toggle-knob" />
      </button>
    </div>
  );
}

const PREVIEWS_NSW = [
  { kind: "points", label: "Points", icon: "lucide:coins" },
  { kind: "checkin", label: "Check-in", icon: "lucide:sun" },
  { kind: "streak", label: "Streak", icon: "lucide:flame" }];

function SoundStyleRowNSW({ gami, onChange }) {
  const [open, setOpen] = useStateNSW(false);
  const themes = themesNSW();
  const current = themes.filter((t) => t.id === gami.theme)[0] || themes[0];
  const off = !gami.sound;
  return (
    <div className="nsw-row nsw-row-tone">
      <span className="nsw-row-copy">
        <span className="nsw-row-label">Sound style</span>
        <span className="nsw-row-desc">Pick how the coin chime, welcome chime and streak fanfare sound, then Save Changes.{off ? " Sound effects are off — picking a style turns them back on." : ""}</span>
      </span>
      <button type="button" className="nsw-tone-current" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {current.label}
        <IconNSW name={open ? "lucide:chevron-up" : "lucide:chevron-down"} size={16} color="var(--gray-500)" />
      </button>
      {open && (
        <div className="nsw-tone-list" role="radiogroup" aria-label="Sound style">
          {themes.map((t) => (
            <button key={t.id} type="button" className="nsw-tone-option nsw-style-option" role="radio" aria-checked={gami.theme === t.id}
              onClick={() => { onChange({ ...gami, theme: t.id, sound: true }); previewNSW("points", t.id); setOpen(false); }}>
              <span className={"nsw-radio-dot" + (gami.theme === t.id ? " on" : "")} />
              <span className="nsw-style-copy"><b>{t.label}</b><span>{t.desc}</span></span>
              <IconNSW name="lucide:volume-2" size={15} color="var(--gray-450)" />
            </button>
          ))}
        </div>
      )}
      <div className="nsw-previews">
        <span className="nsw-previews-label">Try it</span>
        {PREVIEWS_NSW.map((p) => (
          <button key={p.kind} type="button" className="nsw-preview" onClick={() => previewNSW(p.kind, gami.theme)}>
            <IconNSW name={p.icon} size={14} color="currentColor" />{p.label}
          </button>
        ))}
      </div>
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
  const [gami, setGami] = useStateNSW(readGamiNSW);
  const [saved, setSaved] = useStateNSW(true);

  useEffectNSW(() => {
    if (settings === null && window.PFNotify) setSettings(window.PFNotify.getSettings());
  }, [settings]);

  function update(next) {
    setSettings(next);
    setSaved(false);
  }

  function updateGami(next) {
    setGami(next);
    setSaved(false);
  }

  function handleSave() {
    if (!settings || !window.PFNotify) return;
    window.PFNotify.setSettings(settings);
    writeGamiNSW(gami);
    setSaved(true);
    window.PFNotify.showConfirm("Notification settings saved");
  }
  function handleCancel() {
    if (window.PFNotify) setSettings(window.PFNotify.getSettings());
    setGami(readGamiNSW());
    setSaved(true);
  }
  function handlePreview() {
    if (window.PFNotify) window.PFNotify.previewPush();
  }

  if (!settings) return null;

  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
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
            {!saved && <span className="nsw-unsaved"><span className="nsw-unsaved-dot" />Unsaved changes</span>}
            <button type="button" className="nsw-btn-secondary" onClick={handlePreview}>Preview push</button>
            <button type="button" className={"nsw-btn-primary" + (saved ? "" : " is-dirty")} onClick={handleSave}>Save Changes</button>
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

          <SectionNSW title="Gamification" desc="Points, streaks and celebrations — turn the fanfare up or down.">
            <GamiToggleNSW on={gami.pointsPopup} onChange={(v) => updateGami({ ...gami, pointsPopup: v })} label="Points pop-ups" desc="Flash the “+pts” on the header points pill when you earn points." />
            <div className="nsw-divider" />
            <GamiToggleNSW on={gami.streakPopup} onChange={(v) => updateGami({ ...gami, streakPopup: v })} label="Streak celebrations" desc="The “5 in a row” splash and the daily check-in welcome card. Points are still earned." />
            <div className="nsw-divider" />
            <GamiToggleNSW on={gami.dailyGoalPopup} onChange={(v) => updateGami({ ...gami, dailyGoalPopup: v })} label="Daily goal celebration" desc="Full-screen celebration each time you pass another 50 points in a day." />
            <div className="nsw-divider" />
            <GamiToggleNSW on={gami.sound} onChange={(v) => { updateGami({ ...gami, sound: v }); if (v) previewNSW("points", gami.theme); }} label="Sound effects" desc="The coin chime, welcome chime and streak fanfare." />
            <div className="nsw-divider" />
            <SoundStyleRowNSW gami={gami} onChange={updateGami} />
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
          {!saved && <span className="nsw-unsaved"><span className="nsw-unsaved-dot" />Unsaved changes</span>}
          <button type="button" className="nsw-btn-secondary" onClick={handleCancel}>Cancel</button>
          <button type="button" className={"nsw-btn-primary" + (saved ? "" : " is-dirty")} onClick={handleSave}>Save Changes</button>
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
