/* ===========================================================================
   PROfinity — Notification Settings (web)
   Full desktop settings surface at /settings/notifications. Reached from the
   notification centre's footer link (see notifications.js). Reads/writes the
   same window.PFNotify settings store the toasts and centre gate against, so
   a change here takes effect immediately elsewhere in the app.
   Suffixed -NSW to avoid clashing with the mobile Notification Settings (-NS).
   =========================================================================== */
const {
  useState: useStateNSW,
  useEffect: useEffectNSW
} = React;
const DSNSW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavNSW,
  IconifyIcon: IconNSW
} = DSNSW;
const ME_NSW = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function goNSW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateNSW(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goNSW(u);
}
function getPathNSW(settings, path) {
  return path.split(".").reduce(function (o, k) {
    return o ? o[k] : undefined;
  }, settings);
}
function setPathNSW(settings, path, value) {
  var next = JSON.parse(JSON.stringify(settings));
  var keys = path.split(".");
  var cur = next;
  for (var i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
  cur[keys[keys.length - 1]] = value;
  return next;
}
function ToggleNSW({
  path,
  settings,
  onChange,
  label,
  desc
}) {
  const on = !!getPathNSW(settings, path);
  return /*#__PURE__*/React.createElement("div", {
    className: "nsw-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nsw-row-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nsw-row-label"
  }, label), desc && /*#__PURE__*/React.createElement("span", {
    className: "nsw-row-desc"
  }, desc)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-toggle" + (on ? " on" : ""),
    role: "switch",
    "aria-checked": on,
    "aria-label": label,
    onClick: () => onChange(setPathNSW(settings, path, !on))
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-toggle-knob"
  })));
}
const TONE_OPTIONS_NSW = ["Default", "Chime", "Bell", "Ping", "Whistle", "None"];
function ToneRowNSW({
  settings,
  onChange
}) {
  const [open, setOpen] = useStateNSW(false);
  const current = getPathNSW(settings, "sound.tone");
  return /*#__PURE__*/React.createElement("div", {
    className: "nsw-row nsw-row-tone"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nsw-row-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nsw-row-label"
  }, "Notification tone"), /*#__PURE__*/React.createElement("span", {
    className: "nsw-row-desc"
  }, "Choose the sound played for incoming notifications.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-tone-current",
    onClick: () => setOpen(v => !v),
    "aria-expanded": open
  }, current, /*#__PURE__*/React.createElement(IconNSW, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 16,
    color: "var(--gray-500)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "nsw-tone-list",
    role: "radiogroup",
    "aria-label": "Notification tone"
  }, TONE_OPTIONS_NSW.map(tone => /*#__PURE__*/React.createElement("button", {
    key: tone,
    type: "button",
    className: "nsw-tone-option",
    role: "radio",
    "aria-checked": current === tone,
    onClick: () => {
      onChange(setPathNSW(settings, "sound.tone", tone));
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nsw-radio-dot" + (current === tone ? " on" : "")
  }), tone))));
}
function SectionNSW({
  title,
  desc,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, title), desc && /*#__PURE__*/React.createElement("p", null, desc)), /*#__PURE__*/React.createElement("div", {
    className: "nsw-card-body"
  }, children));
}
function NotificationSettingsWeb() {
  const [settings, setSettings] = useStateNSW(() => window.PFNotify ? window.PFNotify.getSettings() : null);
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
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavNSW, {
    user: ME_NSW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateNSW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-page",
    "data-screen-label": "Notification Settings (web)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nsw-head-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-back",
    "aria-label": "Back",
    onClick: () => goNSW("NewsfeedWeb.html")
  }, /*#__PURE__*/React.createElement(IconNSW, {
    name: "lucide:arrow-left",
    size: 18,
    color: "var(--text-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nsw-head-titles"
  }, /*#__PURE__*/React.createElement("h1", null, "Notification Settings"), /*#__PURE__*/React.createElement("p", null, "Manage how and when you receive updates from the platform.")), /*#__PURE__*/React.createElement("div", {
    className: "nsw-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary",
    onClick: handlePreview
  }, "Preview push"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-primary",
    onClick: handleSave
  }, "Save Changes"))), /*#__PURE__*/React.createElement("div", {
    className: "nsw-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goNSW("NewsfeedWeb.html")
  }, "Home"), " / ", /*#__PURE__*/React.createElement("a", {
    onClick: () => goNSW("NewsfeedWeb.html")
  }, "Settings"), " / Notifications"), /*#__PURE__*/React.createElement("div", {
    className: "nsw-grid"
  }, /*#__PURE__*/React.createElement(SectionNSW, {
    title: "In-App Notifications",
    desc: "Controls what appears inside PROfinity while you're using it."
  }, /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "inApp.activityFeed",
    settings: settings,
    onChange: update,
    label: "Activity Feed",
    desc: "Show new activity as it happens in your feed."
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "inApp.popupToasts",
    settings: settings,
    onChange: update,
    label: "Pop-up toasts",
    desc: "Show a pop-up card in the corner for real-time updates."
  })), /*#__PURE__*/React.createElement(SectionNSW, {
    title: "Push Notifications",
    desc: "Alerts sent to you even when PROfinity isn't open."
  }, /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "push.reminders",
    settings: settings,
    onChange: update,
    label: "Reminders",
    desc: "Nudges for courses, events and outstanding tasks."
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "push.securityAlerts",
    settings: settings,
    onChange: update,
    label: "Security alerts",
    desc: "Sign-ins, verification and account changes."
  })), /*#__PURE__*/React.createElement(SectionNSW, {
    title: "Sound & Vibration",
    desc: "Choose how notifications sound and feel."
  }, /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "sound.notificationSound",
    settings: settings,
    onChange: update,
    label: "Notification sound",
    desc: "Play a sound when a notification arrives."
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToneRowNSW, {
    settings: settings,
    onChange: update
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "sound.vibration",
    settings: settings,
    onChange: update,
    label: "Vibration",
    desc: "Vibrate on supported devices."
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "sound.dnd",
    settings: settings,
    onChange: update,
    label: "Do Not Disturb",
    desc: "Silence toasts and sound. Notifications still land in your notification centre."
  })), /*#__PURE__*/React.createElement(SectionNSW, {
    title: "Social & Activity",
    desc: "Comments and reactions on your posts."
  }, /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "social.commentsOnPost",
    settings: settings,
    onChange: update,
    label: "Comments on your post"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "social.postLikes",
    settings: settings,
    onChange: update,
    label: "Post likes"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "social.commentLikes",
    settings: settings,
    onChange: update,
    label: "Comment likes"
  })), /*#__PURE__*/React.createElement(SectionNSW, {
    title: "Newsfeed & Community",
    desc: "Updates from channels and the wider community."
  }, /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "newsfeed.newsUpdates",
    settings: settings,
    onChange: update,
    label: "News updates"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "newsfeed.communityPosts",
    settings: settings,
    onChange: update,
    label: "Community channel posts"
  })), /*#__PURE__*/React.createElement(SectionNSW, {
    title: "Learning & Courses",
    desc: "Stay on top of your learning progress."
  }, /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "learning.courseReminder",
    settings: settings,
    onChange: update,
    label: "Course reminder"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-divider"
  }), /*#__PURE__*/React.createElement(ToggleNSW, {
    path: "learning.newCourseAvailable",
    settings: settings,
    onChange: update,
    label: "New course available"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nsw-footer-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-secondary",
    onClick: handleCancel
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-btn-primary",
    onClick: handleSave
  }, "Save Changes")), /*#__PURE__*/React.createElement("div", {
    className: "nsw-help"
  }, /*#__PURE__*/React.createElement(IconNSW, {
    name: "lucide:life-buoy",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    className: "nsw-help-text"
  }, "Need help with notifications?"), /*#__PURE__*/React.createElement("a", {
    className: "nsw-help-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, "Visit Help Center"))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(NotificationSettingsWeb, null));
