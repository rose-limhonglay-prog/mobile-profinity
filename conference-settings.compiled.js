/* ===========================================================================
   PROfinity — Conference Settings (voice conference)
   Reached from the gear on the Voice Conference tab in Messages (mobile +
   web). Eight sections — Audience & Access · Participant Permission ·
   Speaking Permission · Chat & Interaction · Recording & Media · Security ·
   Notification · Advanced — each a list of fields (radio cards, toggles,
   steppers, text). One data-driven field renderer serves both layouts:

     · ConferenceSettingsWeb.html (window.PF_VS_WEB) — DS TopNav, then two
       cards: a sticky section nav on the left ("Back to voice conference",
       title, blurb, 8 rows) and the active section on the right with a
       Save Changes button. Edits are a draft until saved.
     · ConferenceSettings.html — iPhone frame. A settings list of the 8
       sections, tap one to drill in; changes apply the moment you flip
       them (device preferences, like Notification Settings on mobile).

   Store: localStorage "pf-voice-settings" — the same key the Messages
   bundle reads for noise / joinMuted / chime (kept under those names so the
   room stage keeps honouring them). ?section=<key> deep-links a section,
   ?ret=<page> is where Back goes. Suffixed -VS to avoid global clashes.
   =========================================================================== */
const {
  useState: useStateVS,
  useEffect: useEffectVS,
  useRef: useRefVS,
  useMemo: useMemoVS
} = React;
const DSVS = window.ProfinityDesignSystem_c2b5cc;
const VS_WEB = !!window.PF_VS_WEB;
const VS_KEY = "pf-voice-settings";
const VS_PLAN_LIMIT = 500;
const ME_VS = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function goVS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function queryVS(k) {
  try {
    return new URLSearchParams(window.location.search).get(k);
  } catch (e) {
    return null;
  }
}
function navigateVS(label) {
  const u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goVS(u);
}
/* Back: ?ret= when given, else the Messages page that opened us, else the
   Voice Conference tab of Messages for this layout. */
function backTargetVS() {
  const r = queryVS("ret");
  if (r) return r;
  try {
    const ref = document.referrer;
    if (ref) {
      const u = new URL(ref);
      if (u.origin === window.location.origin && !/ConferenceSettings/.test(u.pathname)) return u.pathname.split("/").pop() + u.search;
    }
  } catch (e) {}
  return (VS_WEB ? "MessagesWeb.html" : "Messages.html") + "?tab=conference";
}

/* ---- sections + fields --------------------------------------------------- */
const VS_SECTIONS = [{
  key: "audience",
  label: "Audience & Access",
  icon: "lucide:users",
  desc: "Control who can join your conference and how they access it.",
  fields: [{
    key: "whoCanJoin",
    type: "radio",
    label: "Who can join",
    desc: "Choose who is allowed to join the conference.",
    options: [{
      v: "link",
      t: "Anyone with the link",
      s: "Anyone who has the link can join instantly"
    }, {
      v: "invited",
      t: "Invited users only",
      s: "Only people you invited can join"
    }, {
      v: "approved",
      t: "Approved users",
      s: "Users must request to join and be approved by a host."
    }, {
      v: "followers",
      t: "Followers only",
      s: "Only users from your followers can join"
    }]
  }, {
    key: "joinType",
    type: "radio",
    label: "Join Type",
    desc: "Choose how participants join the conference",
    options: [{
      v: "listenSpeak",
      t: "Listen & Speak",
      s: "Participants can listen and speak"
    }, {
      v: "listen",
      t: "Listen Only",
      s: "Pariticipants can only listen"
    }, {
      v: "request",
      t: "Request to speak",
      s: "Participants can request to speak. Hosts approve."
    }]
  }, {
    key: "maxParticipants",
    type: "stepper",
    label: "Maximum participants",
    desc: "Set the maximum of participants",
    min: 10,
    max: VS_PLAN_LIMIT,
    step: 10,
    note: "Current plan limit: " + VS_PLAN_LIMIT + " Participants"
  }, {
    key: "waitingRoom",
    type: "toggle",
    label: "Waiting room",
    desc: "Enable a waiting room for host approval"
  }]
}, {
  key: "participants",
  label: "Participant Permission",
  icon: "lucide:shield-check",
  desc: "Decide what participants are allowed to do once they're in the room.",
  fields: [{
    key: "defaultRole",
    type: "radio",
    label: "Default role",
    desc: "The role people get when they join.",
    options: [{
      v: "listener",
      t: "Listener",
      s: "Joins muted in the audience"
    }, {
      v: "speaker",
      t: "Speaker",
      s: "Joins on stage and can talk straight away"
    }]
  }, {
    key: "canInvite",
    type: "toggle",
    label: "Invite others",
    desc: "Participants can invite people from their contacts"
  }, {
    key: "canShareLink",
    type: "toggle",
    label: "Share the room link",
    desc: "Participants can copy and share the conference link"
  }, {
    key: "canSeeList",
    type: "toggle",
    label: "See the participant list",
    desc: "Everyone can see who is in the room"
  }, {
    key: "canRaiseHand",
    type: "toggle",
    label: "Raise hand",
    desc: "Participants can raise a hand to get the host's attention"
  }, {
    key: "canReact",
    type: "toggle",
    label: "Emoji reactions",
    desc: "Participants can react with emoji while someone speaks"
  }]
}, {
  key: "speaking",
  label: "Speaking Permission",
  icon: "lucide:mic",
  desc: "Manage who can speak and how microphones behave in your rooms.",
  fields: [{
    key: "whoCanSpeak",
    type: "radio",
    label: "Who can speak",
    desc: "Choose who is allowed to take the stage.",
    options: [{
      v: "everyone",
      t: "Everyone",
      s: "Anyone in the room can unmute and speak"
    }, {
      v: "hosts",
      t: "Hosts & co-hosts only",
      s: "The audience listens; hosts speak"
    }, {
      v: "approved",
      t: "Approved speakers",
      s: "People you bring on stage can speak"
    }]
  }, {
    key: "muteOnEntry",
    type: "toggle",
    label: "Mute participants on entry",
    desc: "Everyone joins muted; hosts can unmute them"
  }, {
    key: "canUnmute",
    type: "toggle",
    label: "Participants can unmute themselves",
    desc: "Turn off to keep speaking to hosts and approved speakers"
  }, {
    key: "joinMuted",
    type: "toggle",
    label: "Join rooms muted",
    desc: "Your own mic stays off until you're ready to speak"
  }, {
    key: "noise",
    type: "toggle",
    label: "Noise suppression",
    desc: "Filter clinic background noise from your mic"
  }, {
    key: "speakerLimit",
    type: "stepper",
    label: "Speakers on stage",
    desc: "How many people can be on stage at once",
    min: 1,
    max: 20,
    step: 1,
    note: "Includes you and any co-hosts"
  }]
}, {
  key: "chat",
  label: "Chat & Interaction",
  icon: "lucide:message-square-text",
  desc: "Control the text chat and the ways people interact during a conference.",
  fields: [{
    key: "chatEnabled",
    type: "toggle",
    label: "In-room chat",
    desc: "Show a text chat alongside the conversation"
  }, {
    key: "whoCanChat",
    type: "radio",
    label: "Who can send messages",
    desc: "Choose who can post in the chat.",
    options: [{
      v: "everyone",
      t: "Everyone",
      s: "All participants can post in the chat"
    }, {
      v: "speakers",
      t: "Speakers only",
      s: "People on stage can post; the audience reads"
    }, {
      v: "hosts",
      t: "Hosts only",
      s: "Use the chat for announcements"
    }]
  }, {
    key: "polls",
    type: "toggle",
    label: "Polls",
    desc: "Hosts can run quick polls during the conference"
  }, {
    key: "questions",
    type: "toggle",
    label: "Questions",
    desc: "Participants can submit questions for the host to answer"
  }, {
    key: "profanityFilter",
    type: "toggle",
    label: "Profanity filter",
    desc: "Hide messages that contain offensive language"
  }, {
    key: "slowMode",
    type: "radio",
    label: "Slow mode",
    desc: "Limit how often each person can post.",
    options: [{
      v: "off",
      t: "Off",
      s: "No limit"
    }, {
      v: "10",
      t: "10 seconds",
      s: "One message every 10 seconds"
    }, {
      v: "30",
      t: "30 seconds",
      s: "One message every 30 seconds"
    }]
  }]
}, {
  key: "recording",
  label: "Recording & Media",
  icon: "lucide:disc",
  desc: "Choose whether conferences are recorded and what happens to the recordings.",
  fields: [{
    key: "autoRecord",
    type: "toggle",
    label: "Record automatically",
    desc: "Start recording as soon as the room goes live"
  }, {
    key: "recordQuality",
    type: "radio",
    label: "Recording quality",
    desc: "Higher quality uses more storage.",
    options: [{
      v: "standard",
      t: "Standard",
      s: "Clear voice, smaller files"
    }, {
      v: "high",
      t: "High",
      s: "Studio quality for replays and podcasts"
    }]
  }, {
    key: "transcript",
    type: "toggle",
    label: "Live transcript",
    desc: "Generate captions and a searchable transcript"
  }, {
    key: "saveToLibrary",
    type: "toggle",
    label: "Save to My Library",
    desc: "Keep recordings in your library after the room ends"
  }, {
    key: "canDownload",
    type: "toggle",
    label: "Participants can download",
    desc: "Let participants download the recording"
  }, {
    key: "audioClips",
    type: "toggle",
    label: "Audio clips",
    desc: "Participants can share 30-second clips from the conference"
  }]
}, {
  key: "security",
  label: "Security",
  icon: "lucide:lock",
  desc: "Keep your rooms safe with sign-in, passcodes and host controls.",
  fields: [{
    key: "requireSignIn",
    type: "toggle",
    label: "Require sign-in",
    desc: "Only signed-in PROfinity members can join"
  }, {
    key: "passcode",
    type: "toggle",
    label: "Room passcode",
    desc: "Ask for a passcode before joining"
  }, {
    key: "passcodeValue",
    type: "text",
    label: "Passcode",
    desc: "4–8 characters. Share it with the people you invite.",
    placeholder: "e.g. clinic24",
    maxLength: 8,
    showWhen: "passcode"
  }, {
    key: "lockAfterStart",
    type: "toggle",
    label: "Lock room after start",
    desc: "Nobody new can join once the conference has begun"
  }, {
    key: "hideNames",
    type: "toggle",
    label: "Hide audience names",
    desc: "Listeners see counts, not names"
  }, {
    key: "reportAbuse",
    type: "toggle",
    label: "Report & block",
    desc: "Participants can report or block others in the room"
  }, {
    key: "endToEnd",
    type: "toggle",
    label: "Encrypted audio",
    desc: "Audio is encrypted between participants"
  }]
}, {
  key: "notification",
  label: "Notification",
  icon: "lucide:bell",
  desc: "Choose the alerts you and your audience get around your conferences.",
  fields: [{
    key: "notifyFollowers",
    type: "toggle",
    label: "Notify followers when I go live",
    desc: "Send a push to your followers when you start a room"
  }, {
    key: "reminder",
    type: "radio",
    label: "Remind me before scheduled conferences",
    desc: "A nudge before a room you host or follow starts.",
    options: [{
      v: "5",
      t: "5 minutes before",
      s: "Just in time"
    }, {
      v: "15",
      t: "15 minutes before",
      s: "Time to get set up"
    }, {
      v: "60",
      t: "1 hour before",
      s: "Plenty of notice"
    }, {
      v: "off",
      t: "No reminder",
      s: "You'll only see it in the Conference tab"
    }]
  }, {
    key: "requestAlerts",
    type: "toggle",
    label: "Request to speak alerts",
    desc: "Ping when someone asks to come on stage"
  }, {
    key: "chime",
    type: "toggle",
    label: "Join & leave chimes",
    desc: "A soft tone when people come and go"
  }, {
    key: "emailSummary",
    type: "toggle",
    label: "Email summary",
    desc: "Send a recap with attendance and the recording link after each room"
  }]
}, {
  key: "advanced",
  label: "Advanced",
  icon: "lucide:sliders-horizontal",
  desc: "Room lifecycle, quality and defaults for people who like the fine print.",
  fields: [{
    key: "endWhenHostLeaves",
    type: "toggle",
    label: "End room when host leaves",
    desc: "Turn off to hand the room to a co-host when you go"
  }, {
    key: "idleTimeout",
    type: "radio",
    label: "Idle timeout",
    desc: "Close the room when nobody has spoken for a while.",
    options: [{
      v: "15",
      t: "15 minutes",
      s: "Tidy up quiet rooms quickly"
    }, {
      v: "30",
      t: "30 minutes",
      s: "Recommended"
    }, {
      v: "60",
      t: "1 hour",
      s: "For long open-mic sessions"
    }, {
      v: "never",
      t: "Never",
      s: "Rooms stay open until you end them"
    }]
  }, {
    key: "audioQuality",
    type: "radio",
    label: "Audio quality",
    desc: "Trade a little bandwidth for clearer voices.",
    options: [{
      v: "auto",
      t: "Auto",
      s: "Adapts to your connection"
    }, {
      v: "high",
      t: "High",
      s: "Best for a stable Wi-Fi connection"
    }, {
      v: "low",
      t: "Data saver",
      s: "Lower quality, less mobile data"
    }]
  }, {
    key: "autoCoHost",
    type: "toggle",
    label: "Auto-assign a co-host",
    desc: "The first person you bring on stage becomes a co-host"
  }, {
    key: "defaultRoomName",
    type: "text",
    label: "Default room name",
    desc: "Pre-filled when you host a room.",
    placeholder: "e.g. Katy's clinic chat",
    maxLength: 60
  }, {
    key: "reset",
    type: "reset",
    label: "Reset to defaults",
    desc: "Put every conference setting back to how it started."
  }]
}];
const VS_DEFAULTS = {
  whoCanJoin: "link",
  joinType: "listenSpeak",
  maxParticipants: 100,
  waitingRoom: true,
  defaultRole: "listener",
  canInvite: true,
  canShareLink: true,
  canSeeList: true,
  canRaiseHand: true,
  canReact: true,
  whoCanSpeak: "everyone",
  muteOnEntry: true,
  canUnmute: true,
  joinMuted: true,
  noise: true,
  speakerLimit: 8,
  chatEnabled: true,
  whoCanChat: "everyone",
  polls: true,
  questions: true,
  profanityFilter: true,
  slowMode: "off",
  autoRecord: false,
  recordQuality: "standard",
  transcript: true,
  saveToLibrary: true,
  canDownload: false,
  audioClips: true,
  requireSignIn: true,
  passcode: false,
  passcodeValue: "",
  lockAfterStart: false,
  hideNames: false,
  reportAbuse: true,
  endToEnd: true,
  notifyFollowers: true,
  reminder: "15",
  requestAlerts: true,
  chime: true,
  emailSummary: false,
  endWhenHostLeaves: true,
  idleTimeout: "30",
  audioQuality: "auto",
  autoCoHost: false,
  defaultRoomName: ""
};
function readVS() {
  try {
    return {
      ...VS_DEFAULTS,
      ...(JSON.parse(localStorage.getItem(VS_KEY)) || {})
    };
  } catch (e) {
    return {
      ...VS_DEFAULTS
    };
  }
}
function writeVS(s) {
  try {
    localStorage.setItem(VS_KEY, JSON.stringify(s));
  } catch (e) {}
}
function optLabelVS(field, v) {
  const o = (field.options || []).find(x => x.v === v);
  return o ? o.t : "";
}
/* one-line summary of a section for the mobile list */
function summaryVS(section, s) {
  const f = section.fields;
  switch (section.key) {
    case "audience":
      return optLabelVS(f[0], s.whoCanJoin) + " · " + optLabelVS(f[1], s.joinType) + " · up to " + s.maxParticipants;
    case "participants":
      return optLabelVS(f[0], s.defaultRole) + " by default · " + [s.canInvite && "invite", s.canRaiseHand && "raise hand", s.canReact && "react"].filter(Boolean).join(", ");
    case "speaking":
      return optLabelVS(f[0], s.whoCanSpeak) + (s.muteOnEntry ? " · muted on entry" : "") + " · " + s.speakerLimit + " on stage";
    case "chat":
      return s.chatEnabled ? optLabelVS(f[1], s.whoCanChat) + " can chat" + (s.polls ? " · polls" : "") : "Chat off";
    case "recording":
      return (s.autoRecord ? "Records automatically" : "Manual recording") + (s.transcript ? " · transcript" : "");
    case "security":
      return [s.requireSignIn && "Sign-in", s.passcode && "passcode", s.lockAfterStart && "locked after start", s.endToEnd && "encrypted"].filter(Boolean).join(" · ") || "Open";
    case "notification":
      return (s.notifyFollowers ? "Followers notified" : "Quiet start") + " · " + optLabelVS(f[1], s.reminder).toLowerCase();
    case "advanced":
      return "Idle " + optLabelVS(f[1], s.idleTimeout).toLowerCase() + " · " + optLabelVS(f[2], s.audioQuality).toLowerCase() + " audio";
    default:
      return "";
  }
}

/* ---- controls -------------------------------------------------------------- */
function RadioCardsVS({
  field,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "vs-radios",
    role: "radiogroup",
    "aria-label": field.label
  }, field.options.map(o => {
    const on = value === o.v;
    return /*#__PURE__*/React.createElement("button", {
      key: o.v,
      type: "button",
      role: "radio",
      "aria-checked": on,
      className: "vs-radio" + (on ? " on" : ""),
      onClick: () => onChange(o.v)
    }, /*#__PURE__*/React.createElement("span", {
      className: "vs-radio-dot",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "vs-radio-copy"
    }, /*#__PURE__*/React.createElement("b", null, o.t), /*#__PURE__*/React.createElement("span", null, o.s)));
  }));
}
function StepperVS({
  field,
  value,
  onChange
}) {
  const step = field.step || 1;
  const clamp = n => Math.max(field.min, Math.min(field.max, n));
  return /*#__PURE__*/React.createElement("div", {
    className: "vs-stepper-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vs-stepper",
    role: "group",
    "aria-label": field.label
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Decrease",
    disabled: value <= field.min,
    onClick: () => onChange(clamp(value - step))
  }, /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: "lucide:minus",
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("input", {
    type: "number",
    inputMode: "numeric",
    value: value,
    min: field.min,
    max: field.max,
    "aria-label": field.label,
    onChange: e => {
      const n = parseInt(e.target.value, 10);
      if (!isNaN(n)) onChange(n);
    },
    onBlur: e => onChange(clamp(parseInt(e.target.value, 10) || field.min))
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Increase",
    disabled: value >= field.max,
    onClick: () => onChange(clamp(value + step))
  }, /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: "lucide:plus",
    size: 20,
    color: "currentColor"
  }))), field.note && /*#__PURE__*/React.createElement("p", {
    className: "vs-stepper-note"
  }, field.note));
}
function SwitchVS({
  label,
  on,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    "aria-label": label,
    className: "vs-switch" + (on ? " on" : ""),
    onClick: () => onChange(!on)
  }, /*#__PURE__*/React.createElement("i", null));
}
function TextVS({
  field,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "vs-text",
    value: value || "",
    placeholder: field.placeholder,
    maxLength: field.maxLength,
    "aria-label": field.label,
    onChange: e => onChange(e.target.value)
  });
}

/* One field row: label + description on the left, the control on the right
   (stacked on the phone). `mobile` moves toggles beside the label. */
function FieldVS({
  field,
  settings,
  onChange,
  onReset,
  mobile
}) {
  if (field.showWhen && !settings[field.showWhen]) return null;
  const value = settings[field.key];
  const set = v => onChange(prev => ({
    ...prev,
    [field.key]: v
  })); // updater form: two quick taps never clobber each other
  const inline = field.type === "toggle";
  return /*#__PURE__*/React.createElement("div", {
    className: "vs-field vs-field-" + field.type + (inline ? " inline" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "vs-field-copy"
  }, /*#__PURE__*/React.createElement("h3", null, field.label), /*#__PURE__*/React.createElement("p", null, field.desc)), /*#__PURE__*/React.createElement("div", {
    className: "vs-field-ctl"
  }, field.type === "radio" && /*#__PURE__*/React.createElement(RadioCardsVS, {
    field: field,
    value: value,
    onChange: set
  }), field.type === "stepper" && /*#__PURE__*/React.createElement(StepperVS, {
    field: field,
    value: value,
    onChange: set
  }), field.type === "toggle" && /*#__PURE__*/React.createElement(SwitchVS, {
    label: field.label,
    on: !!value,
    onChange: set
  }), field.type === "text" && /*#__PURE__*/React.createElement(TextVS, {
    field: field,
    value: value,
    onChange: set
  }), field.type === "reset" && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vs-btn-ghost",
    onClick: onReset
  }, /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: "lucide:rotate-ccw",
    size: 16,
    color: "currentColor"
  }), "Reset all settings")));
}
function ToastVS({
  toast
}) {
  if (!toast) return null;
  return /*#__PURE__*/React.createElement("div", {
    key: toast.key,
    className: "vs-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: "lucide:check-circle-2",
    size: 16,
    color: "currentColor"
  }), toast.msg);
}
function useToastVS() {
  const [toast, setToast] = useStateVS(null);
  const timer = useRefVS(null);
  useEffectVS(() => () => clearTimeout(timer.current), []);
  return [toast, msg => {
    setToast({
      msg,
      key: Date.now()
    });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }];
}
function initialSectionVS() {
  const q = queryVS("section");
  return VS_SECTIONS.some(s => s.key === q) ? q : null;
}
function pushSectionVS(key) {
  try {
    const u = new URL(window.location.href);
    if (key) u.searchParams.set("section", key);else u.searchParams.delete("section");
    window.history.replaceState(null, "", u.toString());
  } catch (e) {}
}

/* ---- web ------------------------------------------------------------------- */
function ConferenceSettingsWebVS() {
  const [saved, setSaved] = useStateVS(readVS);
  const [draft, setDraft] = useStateVS(saved);
  const [section, setSection] = useStateVS(() => initialSectionVS() || VS_SECTIONS[0].key);
  const [toast, showToast] = useToastVS();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const cur = VS_SECTIONS.find(s => s.key === section);
  const mainRef = useRefVS(null);
  const pick = k => {
    setSection(k);
    pushSectionVS(k);
    if (mainRef.current) mainRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth"
    });
  };
  const save = () => {
    writeVS(draft);
    setSaved(draft);
    showToast("Conference settings saved");
  };
  const cancel = () => setDraft(saved);
  const reset = () => {
    setDraft({
      ...VS_DEFAULTS
    });
    showToast("Defaults restored — save to keep them");
  };
  useEffectVS(() => {
    const h = e => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
  const changedIn = s => s.fields.some(f => f.type !== "reset" && draft[f.key] !== saved[f.key]);
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen vs-web",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(DSVS.TopNav, {
    active: "Profile",
    user: ME_VS,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateVS,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "vs-web-page",
    "data-screen-label": "Conference Settings (web) · " + cur.label
  }, /*#__PURE__*/React.createElement("aside", {
    className: "vs-web-side"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vs-web-back",
    onClick: () => goVS(backTargetVS())
  }, /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 20,
    color: "currentColor"
  }), "Back to voice conference"), /*#__PURE__*/React.createElement("h2", null, "Conference Settings"), /*#__PURE__*/React.createElement("p", null, "Manage how your voice conferences work and who can participate"), /*#__PURE__*/React.createElement("nav", {
    className: "vs-web-nav",
    "aria-label": "Settings sections"
  }, VS_SECTIONS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    type: "button",
    className: "vs-web-navrow" + (s.key === section ? " on" : ""),
    "aria-current": s.key === section ? "page" : undefined,
    onClick: () => pick(s.key)
  }, /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: s.icon,
    size: 22,
    color: "currentColor"
  }), /*#__PURE__*/React.createElement("span", null, s.label), changedIn(s) && s.key !== section && /*#__PURE__*/React.createElement("i", {
    className: "vs-web-navdot",
    "aria-label": "Unsaved changes"
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "vs-web-main",
    ref: mainRef,
    "aria-label": cur.label
  }, /*#__PURE__*/React.createElement("h1", null, cur.label), /*#__PURE__*/React.createElement("p", {
    className: "vs-web-lead"
  }, cur.desc), /*#__PURE__*/React.createElement("div", {
    className: "vs-fields"
  }, cur.fields.map(f => /*#__PURE__*/React.createElement(FieldVS, {
    key: f.key,
    field: f,
    settings: draft,
    onChange: setDraft,
    onReset: reset
  }))), /*#__PURE__*/React.createElement("div", {
    className: "vs-web-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vs-btn-primary" + (dirty ? " is-dirty" : ""),
    onClick: save
  }, "Save Changes"), dirty && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vs-btn-secondary",
    onClick: cancel
  }, "Discard"), dirty && /*#__PURE__*/React.createElement("span", {
    className: "vs-unsaved"
  }, /*#__PURE__*/React.createElement("i", null), "Unsaved changes")))), /*#__PURE__*/React.createElement(ToastVS, {
    toast: toast
  }));
}

/* ---- mobile ------------------------------------------------------------------ */
function useDeviceScaleVS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateVS(calc);
  useEffectVS(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
/* dark-mode-init.js stamps data-theme on <html>; follow it so the phone
   frame's status bar flips with the page */
function useIsDarkVS() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateVS(read);
  useEffectVS(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => mo.disconnect();
  }, []);
  return dark;
}
function useIsMobileVS() {
  const [mobile, setMobile] = useStateVS(() => window.matchMedia("(max-width:768px)").matches);
  useEffectVS(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function ConferenceSettingsMobileVS() {
  const [settings, setSettings] = useStateVS(readVS);
  const [section, setSection] = useStateVS(initialSectionVS);
  const [toast, showToast] = useToastVS();
  const scrollRef = useRefVS(null);
  const cur = section ? VS_SECTIONS.find(s => s.key === section) : null;
  const change = up => {
    setSettings(prev => {
      const next = typeof up === "function" ? up(prev) : up;
      writeVS(next);
      return next;
    });
    showToast("Saved");
  };
  const reset = () => {
    const d = {
      ...VS_DEFAULTS
    };
    setSettings(d);
    writeVS(d);
    showToast("Defaults restored");
  };
  const open = k => {
    setSection(k);
    pushSectionVS(k);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };
  const back = () => {
    if (section) {
      setSection(null);
      pushSectionVS(null);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    } else goVS(backTargetVS());
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "vs-m-screen",
    "data-screen-label": "Conference Settings (mobile)" + (cur ? " · " + cur.label : "")
  }, /*#__PURE__*/React.createElement("header", {
    className: "vs-m-top"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vs-m-back",
    "aria-label": "Back",
    onClick: back
  }, /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, cur ? cur.label : "Conference Settings")), /*#__PURE__*/React.createElement("div", {
    className: "vs-m-scroll",
    ref: scrollRef
  }, !cur ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "vs-m-lead"
  }, "Manage how your voice conferences work and who can participate."), /*#__PURE__*/React.createElement("div", {
    className: "vs-m-list"
  }, VS_SECTIONS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    type: "button",
    className: "vs-m-row",
    onClick: () => open(s.key)
  }, /*#__PURE__*/React.createElement("span", {
    className: "vs-m-rowic"
  }, /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: s.icon,
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "vs-m-rowcopy"
  }, /*#__PURE__*/React.createElement("b", null, s.label), /*#__PURE__*/React.createElement("span", null, summaryVS(s, settings))), /*#__PURE__*/React.createElement(DSVS.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })))), /*#__PURE__*/React.createElement("p", {
    className: "vs-m-foot"
  }, "Changes apply the next time you host or join a room.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "vs-m-lead"
  }, cur.desc), /*#__PURE__*/React.createElement("div", {
    className: "vs-fields vs-m-fields"
  }, cur.fields.map(f => /*#__PURE__*/React.createElement(FieldVS, {
    key: f.key,
    field: f,
    settings: settings,
    onChange: change,
    onReset: reset,
    mobile: true
  }))))), /*#__PURE__*/React.createElement(ToastVS, {
    toast: toast
  }));
}
function ConferenceSettingsAppVS() {
  const mobile = useIsMobileVS();
  const scale = useDeviceScaleVS();
  const dark = useIsDarkVS();
  if (VS_WEB) return /*#__PURE__*/React.createElement(ConferenceSettingsWebVS, null);
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(ConferenceSettingsMobileVS, null));
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956,
    dark: dark
  }, /*#__PURE__*/React.createElement(ConferenceSettingsMobileVS, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ConferenceSettingsAppVS, null));
