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
const { useState: useStateVS, useEffect: useEffectVS, useRef: useRefVS, useMemo: useMemoVS } = React;
const DSVS = window.ProfinityDesignSystem_c2b5cc;
const VS_WEB = !!window.PF_VS_WEB;
const VS_KEY = "pf-voice-settings";
const VS_PLAN_LIMIT = 500;
const ME_VS = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goVS(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function queryVS(k) { try { return new URLSearchParams(window.location.search).get(k); } catch (e) { return null; } }
function navigateVS(label) {
  const u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goVS(u);
}
/* Back: ?ret= when given, else the Messages page that opened us, else the
   Voice Conference tab of Messages for this layout. */
function backTargetVS() {
  const r = queryVS("ret"); if (r) return r;
  try {
    const ref = document.referrer;
    if (ref) { const u = new URL(ref); if (u.origin === window.location.origin && !/ConferenceSettings/.test(u.pathname)) return u.pathname.split("/").pop() + u.search; }
  } catch (e) {}
  return (VS_WEB ? "MessagesWeb.html" : "Messages.html") + "?tab=conference";
}

/* ---- sections + fields --------------------------------------------------- */
const VS_SECTIONS = [
  { key: "audience", label: "Audience & Access", icon: "lucide:users",
    desc: "Control who can join your conference and how they access it.",
    fields: [
      { key: "whoCanJoin", type: "radio", label: "Who can join", desc: "Choose who is allowed to join the conference.", options: [
        { v: "link", t: "Anyone with the link", s: "Anyone who has the link can join instantly" },
        { v: "invited", t: "Invited users only", s: "Only people you invited can join" },
        { v: "approved", t: "Approved users", s: "Users must request to join and be approved by a host." },
        { v: "followers", t: "Followers only", s: "Only users from your followers can join" }] },
      { key: "joinType", type: "radio", label: "Join Type", desc: "Choose how participants join the conference", options: [
        { v: "listenSpeak", t: "Listen & Speak", s: "Participants can listen and speak" },
        { v: "listen", t: "Listen Only", s: "Pariticipants can only listen" },
        { v: "request", t: "Request to speak", s: "Participants can request to speak. Hosts approve." }] },
      { key: "maxParticipants", type: "stepper", label: "Maximum participants", desc: "Set the maximum of participants", min: 10, max: VS_PLAN_LIMIT, step: 10,
        note: "Current plan limit: " + VS_PLAN_LIMIT + " Participants" },
      { key: "waitingRoom", type: "toggle", label: "Waiting room", desc: "Enable a waiting room for host approval" }] },

  { key: "participants", label: "Participant Permission", icon: "lucide:shield-check",
    desc: "Decide what participants are allowed to do once they're in the room.",
    fields: [
      { key: "defaultRole", type: "radio", label: "Default role", desc: "The role people get when they join.", options: [
        { v: "listener", t: "Listener", s: "Joins muted in the audience" },
        { v: "speaker", t: "Speaker", s: "Joins on stage and can talk straight away" }] },
      { key: "canInvite", type: "toggle", label: "Invite others", desc: "Participants can invite people from their contacts" },
      { key: "canShareLink", type: "toggle", label: "Share the room link", desc: "Participants can copy and share the conference link" },
      { key: "canSeeList", type: "toggle", label: "See the participant list", desc: "Everyone can see who is in the room" },
      { key: "canRaiseHand", type: "toggle", label: "Raise hand", desc: "Participants can raise a hand to get the host's attention" },
      { key: "canReact", type: "toggle", label: "Emoji reactions", desc: "Participants can react with emoji while someone speaks" }] },

  { key: "speaking", label: "Speaking Permission", icon: "lucide:mic",
    desc: "Manage who can speak and how microphones behave in your rooms.",
    fields: [
      { key: "whoCanSpeak", type: "radio", label: "Who can speak", desc: "Choose who is allowed to take the stage.", options: [
        { v: "everyone", t: "Everyone", s: "Anyone in the room can unmute and speak" },
        { v: "hosts", t: "Hosts & co-hosts only", s: "The audience listens; hosts speak" },
        { v: "approved", t: "Approved speakers", s: "People you bring on stage can speak" }] },
      { key: "muteOnEntry", type: "toggle", label: "Mute participants on entry", desc: "Everyone joins muted; hosts can unmute them" },
      { key: "canUnmute", type: "toggle", label: "Participants can unmute themselves", desc: "Turn off to keep speaking to hosts and approved speakers" },
      { key: "joinMuted", type: "toggle", label: "Join rooms muted", desc: "Your own mic stays off until you're ready to speak" },
      { key: "noise", type: "toggle", label: "Noise suppression", desc: "Filter clinic background noise from your mic" },
      { key: "speakerLimit", type: "stepper", label: "Speakers on stage", desc: "How many people can be on stage at once", min: 1, max: 20, step: 1, note: "Includes you and any co-hosts" }] },

  { key: "chat", label: "Chat & Interaction", icon: "lucide:message-square-text",
    desc: "Control the text chat and the ways people interact during a conference.",
    fields: [
      { key: "chatEnabled", type: "toggle", label: "In-room chat", desc: "Show a text chat alongside the conversation" },
      { key: "whoCanChat", type: "radio", label: "Who can send messages", desc: "Choose who can post in the chat.", options: [
        { v: "everyone", t: "Everyone", s: "All participants can post in the chat" },
        { v: "speakers", t: "Speakers only", s: "People on stage can post; the audience reads" },
        { v: "hosts", t: "Hosts only", s: "Use the chat for announcements" }] },
      { key: "polls", type: "toggle", label: "Polls", desc: "Hosts can run quick polls during the conference" },
      { key: "questions", type: "toggle", label: "Questions", desc: "Participants can submit questions for the host to answer" },
      { key: "profanityFilter", type: "toggle", label: "Profanity filter", desc: "Hide messages that contain offensive language" },
      { key: "slowMode", type: "radio", label: "Slow mode", desc: "Limit how often each person can post.", options: [
        { v: "off", t: "Off", s: "No limit" },
        { v: "10", t: "10 seconds", s: "One message every 10 seconds" },
        { v: "30", t: "30 seconds", s: "One message every 30 seconds" }] }] },

  { key: "recording", label: "Recording & Media", icon: "lucide:disc",
    desc: "Choose whether conferences are recorded and what happens to the recordings.",
    fields: [
      { key: "autoRecord", type: "toggle", label: "Record automatically", desc: "Start recording as soon as the room goes live" },
      { key: "recordQuality", type: "radio", label: "Recording quality", desc: "Higher quality uses more storage.", options: [
        { v: "standard", t: "Standard", s: "Clear voice, smaller files" },
        { v: "high", t: "High", s: "Studio quality for replays and podcasts" }] },
      { key: "transcript", type: "toggle", label: "Live transcript", desc: "Generate captions and a searchable transcript" },
      { key: "saveToLibrary", type: "toggle", label: "Save to My Library", desc: "Keep recordings in your library after the room ends" },
      { key: "canDownload", type: "toggle", label: "Participants can download", desc: "Let participants download the recording" },
      { key: "audioClips", type: "toggle", label: "Audio clips", desc: "Participants can share 30-second clips from the conference" }] },

  { key: "security", label: "Security", icon: "lucide:lock",
    desc: "Keep your rooms safe with sign-in, passcodes and host controls.",
    fields: [
      { key: "requireSignIn", type: "toggle", label: "Require sign-in", desc: "Only signed-in PROfinity members can join" },
      { key: "passcode", type: "toggle", label: "Room passcode", desc: "Ask for a passcode before joining" },
      { key: "passcodeValue", type: "text", label: "Passcode", desc: "4–8 characters. Share it with the people you invite.", placeholder: "e.g. clinic24", maxLength: 8, showWhen: "passcode" },
      { key: "lockAfterStart", type: "toggle", label: "Lock room after start", desc: "Nobody new can join once the conference has begun" },
      { key: "hideNames", type: "toggle", label: "Hide audience names", desc: "Listeners see counts, not names" },
      { key: "reportAbuse", type: "toggle", label: "Report & block", desc: "Participants can report or block others in the room" },
      { key: "endToEnd", type: "toggle", label: "Encrypted audio", desc: "Audio is encrypted between participants" }] },

  { key: "notification", label: "Notification", icon: "lucide:bell",
    desc: "Choose the alerts you and your audience get around your conferences.",
    fields: [
      { key: "notifyFollowers", type: "toggle", label: "Notify followers when I go live", desc: "Send a push to your followers when you start a room" },
      { key: "reminder", type: "radio", label: "Remind me before scheduled conferences", desc: "A nudge before a room you host or follow starts.", options: [
        { v: "5", t: "5 minutes before", s: "Just in time" },
        { v: "15", t: "15 minutes before", s: "Time to get set up" },
        { v: "60", t: "1 hour before", s: "Plenty of notice" },
        { v: "off", t: "No reminder", s: "You'll only see it in the Conference tab" }] },
      { key: "requestAlerts", type: "toggle", label: "Request to speak alerts", desc: "Ping when someone asks to come on stage" },
      { key: "chime", type: "toggle", label: "Join & leave chimes", desc: "A soft tone when people come and go" },
      { key: "emailSummary", type: "toggle", label: "Email summary", desc: "Send a recap with attendance and the recording link after each room" }] },

  { key: "advanced", label: "Advanced", icon: "lucide:sliders-horizontal",
    desc: "Room lifecycle, quality and defaults for people who like the fine print.",
    fields: [
      { key: "endWhenHostLeaves", type: "toggle", label: "End room when host leaves", desc: "Turn off to hand the room to a co-host when you go" },
      { key: "idleTimeout", type: "radio", label: "Idle timeout", desc: "Close the room when nobody has spoken for a while.", options: [
        { v: "15", t: "15 minutes", s: "Tidy up quiet rooms quickly" },
        { v: "30", t: "30 minutes", s: "Recommended" },
        { v: "60", t: "1 hour", s: "For long open-mic sessions" },
        { v: "never", t: "Never", s: "Rooms stay open until you end them" }] },
      { key: "audioQuality", type: "radio", label: "Audio quality", desc: "Trade a little bandwidth for clearer voices.", options: [
        { v: "auto", t: "Auto", s: "Adapts to your connection" },
        { v: "high", t: "High", s: "Best for a stable Wi-Fi connection" },
        { v: "low", t: "Data saver", s: "Lower quality, less mobile data" }] },
      { key: "autoCoHost", type: "toggle", label: "Auto-assign a co-host", desc: "The first person you bring on stage becomes a co-host" },
      { key: "defaultRoomName", type: "text", label: "Default room name", desc: "Pre-filled when you host a room.", placeholder: "e.g. Katy's clinic chat", maxLength: 60 },
      { key: "reset", type: "reset", label: "Reset to defaults", desc: "Put every conference setting back to how it started." }] }];

const VS_DEFAULTS = {
  whoCanJoin: "link", joinType: "listenSpeak", maxParticipants: 100, waitingRoom: true,
  defaultRole: "listener", canInvite: true, canShareLink: true, canSeeList: true, canRaiseHand: true, canReact: true,
  whoCanSpeak: "everyone", muteOnEntry: true, canUnmute: true, joinMuted: true, noise: true, speakerLimit: 8,
  chatEnabled: true, whoCanChat: "everyone", polls: true, questions: true, profanityFilter: true, slowMode: "off",
  autoRecord: false, recordQuality: "standard", transcript: true, saveToLibrary: true, canDownload: false, audioClips: true,
  requireSignIn: true, passcode: false, passcodeValue: "", lockAfterStart: false, hideNames: false, reportAbuse: true, endToEnd: true,
  notifyFollowers: true, reminder: "15", requestAlerts: true, chime: true, emailSummary: false,
  endWhenHostLeaves: true, idleTimeout: "30", audioQuality: "auto", autoCoHost: false, defaultRoomName: "" };

function readVS() { try { return { ...VS_DEFAULTS, ...(JSON.parse(localStorage.getItem(VS_KEY)) || {}) }; } catch (e) { return { ...VS_DEFAULTS }; } }
function writeVS(s) { try { localStorage.setItem(VS_KEY, JSON.stringify(s)); } catch (e) {} }
function optLabelVS(field, v) { const o = (field.options || []).find((x) => x.v === v); return o ? o.t : ""; }
/* one-line summary of a section for the mobile list */
function summaryVS(section, s) {
  const f = section.fields;
  switch (section.key) {
    case "audience": return optLabelVS(f[0], s.whoCanJoin) + " · " + optLabelVS(f[1], s.joinType) + " · up to " + s.maxParticipants;
    case "participants": return optLabelVS(f[0], s.defaultRole) + " by default · " + [s.canInvite && "invite", s.canRaiseHand && "raise hand", s.canReact && "react"].filter(Boolean).join(", ");
    case "speaking": return optLabelVS(f[0], s.whoCanSpeak) + (s.muteOnEntry ? " · muted on entry" : "") + " · " + s.speakerLimit + " on stage";
    case "chat": return s.chatEnabled ? optLabelVS(f[1], s.whoCanChat) + " can chat" + (s.polls ? " · polls" : "") : "Chat off";
    case "recording": return (s.autoRecord ? "Records automatically" : "Manual recording") + (s.transcript ? " · transcript" : "");
    case "security": return [s.requireSignIn && "Sign-in", s.passcode && "passcode", s.lockAfterStart && "locked after start", s.endToEnd && "encrypted"].filter(Boolean).join(" · ") || "Open";
    case "notification": return (s.notifyFollowers ? "Followers notified" : "Quiet start") + " · " + optLabelVS(f[1], s.reminder).toLowerCase();
    case "advanced": return "Idle " + optLabelVS(f[1], s.idleTimeout).toLowerCase() + " · " + optLabelVS(f[2], s.audioQuality).toLowerCase() + " audio";
    default: return "";
  }
}

/* ---- controls -------------------------------------------------------------- */
function RadioCardsVS({ field, value, onChange }) {
  return (
    <div className="vs-radios" role="radiogroup" aria-label={field.label}>
      {field.options.map((o) => {
        const on = value === o.v;
        return (
          <button key={o.v} type="button" role="radio" aria-checked={on} className={"vs-radio" + (on ? " on" : "")} onClick={() => onChange(o.v)}>
            <span className="vs-radio-dot" aria-hidden="true" />
            <span className="vs-radio-copy"><b>{o.t}</b><span>{o.s}</span></span>
          </button>);
      })}
    </div>);
}
function StepperVS({ field, value, onChange }) {
  const step = field.step || 1;
  const clamp = (n) => Math.max(field.min, Math.min(field.max, n));
  return (
    <div className="vs-stepper-wrap">
      <div className="vs-stepper" role="group" aria-label={field.label}>
        <button type="button" aria-label="Decrease" disabled={value <= field.min} onClick={() => onChange(clamp(value - step))}><DSVS.IconifyIcon name="lucide:minus" size={20} color="currentColor" /></button>
        <input type="number" inputMode="numeric" value={value} min={field.min} max={field.max} aria-label={field.label}
          onChange={(e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) onChange(n); }} onBlur={(e) => onChange(clamp(parseInt(e.target.value, 10) || field.min))} />
        <button type="button" aria-label="Increase" disabled={value >= field.max} onClick={() => onChange(clamp(value + step))}><DSVS.IconifyIcon name="lucide:plus" size={20} color="currentColor" /></button>
      </div>
      {field.note && <p className="vs-stepper-note">{field.note}</p>}
    </div>);
}
function SwitchVS({ label, on, onChange }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={"vs-switch" + (on ? " on" : "")} onClick={() => onChange(!on)}><i /></button>;
}
function TextVS({ field, value, onChange }) {
  return <input type="text" className="vs-text" value={value || ""} placeholder={field.placeholder} maxLength={field.maxLength} aria-label={field.label} onChange={(e) => onChange(e.target.value)} />;
}

/* One field row: label + description on the left, the control on the right
   (stacked on the phone). `mobile` moves toggles beside the label. */
function FieldVS({ field, settings, onChange, onReset, mobile }) {
  if (field.showWhen && !settings[field.showWhen]) return null;
  const value = settings[field.key];
  const set = (v) => onChange((prev) => ({ ...prev, [field.key]: v })); // updater form: two quick taps never clobber each other
  const inline = field.type === "toggle";
  return (
    <div className={"vs-field vs-field-" + field.type + (inline ? " inline" : "")}>
      <div className="vs-field-copy">
        <h3>{field.label}</h3>
        <p>{field.desc}</p>
      </div>
      <div className="vs-field-ctl">
        {field.type === "radio" && <RadioCardsVS field={field} value={value} onChange={set} />}
        {field.type === "stepper" && <StepperVS field={field} value={value} onChange={set} />}
        {field.type === "toggle" && <SwitchVS label={field.label} on={!!value} onChange={set} />}
        {field.type === "text" && <TextVS field={field} value={value} onChange={set} />}
        {field.type === "reset" && <button type="button" className="vs-btn-ghost" onClick={onReset}><DSVS.IconifyIcon name="lucide:rotate-ccw" size={16} color="currentColor" />Reset all settings</button>}
      </div>
    </div>);
}

function ToastVS({ toast }) {
  if (!toast) return null;
  return <div key={toast.key} className="vs-toast" role="status"><DSVS.IconifyIcon name="lucide:check-circle-2" size={16} color="currentColor" />{toast.msg}</div>;
}
function useToastVS() {
  const [toast, setToast] = useStateVS(null);
  const timer = useRefVS(null);
  useEffectVS(() => () => clearTimeout(timer.current), []);
  return [toast, (msg) => { setToast({ msg, key: Date.now() }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 2200); }];
}
function initialSectionVS() { const q = queryVS("section"); return VS_SECTIONS.some((s) => s.key === q) ? q : null; }
function pushSectionVS(key) {
  try { const u = new URL(window.location.href); if (key) u.searchParams.set("section", key); else u.searchParams.delete("section"); window.history.replaceState(null, "", u.toString()); } catch (e) {}
}

/* ---- web ------------------------------------------------------------------- */
function ConferenceSettingsWebVS() {
  const [saved, setSaved] = useStateVS(readVS);
  const [draft, setDraft] = useStateVS(saved);
  const [section, setSection] = useStateVS(() => initialSectionVS() || VS_SECTIONS[0].key);
  const [toast, showToast] = useToastVS();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const cur = VS_SECTIONS.find((s) => s.key === section);
  const mainRef = useRefVS(null);
  const pick = (k) => { setSection(k); pushSectionVS(k); if (mainRef.current) mainRef.current.scrollIntoView({ block: "start", behavior: "smooth" }); };
  const save = () => { writeVS(draft); setSaved(draft); showToast("Conference settings saved"); };
  const cancel = () => setDraft(saved);
  const reset = () => { setDraft({ ...VS_DEFAULTS }); showToast("Defaults restored — save to keep them"); };
  useEffectVS(() => {
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h); return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
  const changedIn = (s) => s.fields.some((f) => f.type !== "reset" && draft[f.key] !== saved[f.key]);

  return (
    <div className="app wa-screen vs-web" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <DSVS.TopNav active="Profile" user={ME_VS} logoSrc="assets/profinity-icon-purple-gold.png" onNavigate={navigateVS}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      <div className="vs-web-page" data-screen-label={"Conference Settings (web) · " + cur.label}>
        <aside className="vs-web-side">
          <button type="button" className="vs-web-back" onClick={() => goVS(backTargetVS())}>
            <DSVS.IconifyIcon name="lucide:chevron-left" size={20} color="currentColor" />Back to voice conference
          </button>
          <h2>Conference Settings</h2>
          <p>Manage how your voice conferences work and who can participate</p>
          <nav className="vs-web-nav" aria-label="Settings sections">
            {VS_SECTIONS.map((s) =>
              <button key={s.key} type="button" className={"vs-web-navrow" + (s.key === section ? " on" : "")} aria-current={s.key === section ? "page" : undefined} onClick={() => pick(s.key)}>
                <DSVS.IconifyIcon name={s.icon} size={22} color="currentColor" />
                <span>{s.label}</span>
                {changedIn(s) && s.key !== section && <i className="vs-web-navdot" aria-label="Unsaved changes" />}
              </button>)}
          </nav>
        </aside>
        <section className="vs-web-main" ref={mainRef} aria-label={cur.label}>
          <h1>{cur.label}</h1>
          <p className="vs-web-lead">{cur.desc}</p>
          <div className="vs-fields">
            {cur.fields.map((f) => <FieldVS key={f.key} field={f} settings={draft} onChange={setDraft} onReset={reset} />)}
          </div>
          <div className="vs-web-actions">
            <button type="button" className={"vs-btn-primary" + (dirty ? " is-dirty" : "")} onClick={save}>Save Changes</button>
            {dirty && <button type="button" className="vs-btn-secondary" onClick={cancel}>Discard</button>}
            {dirty && <span className="vs-unsaved"><i />Unsaved changes</span>}
          </div>
        </section>
      </div>
      <ToastVS toast={toast} />
    </div>);
}

/* ---- mobile ------------------------------------------------------------------ */
function useDeviceScaleVS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateVS(calc);
  useEffectVS(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
/* dark-mode-init.js stamps data-theme on <html>; follow it so the phone
   frame's status bar flips with the page */
function useIsDarkVS() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateVS(read);
  useEffectVS(() => { const mo = new MutationObserver(() => setDark(read())); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] }); return () => mo.disconnect(); }, []);
  return dark;
}
function useIsMobileVS() {
  const [mobile, setMobile] = useStateVS(() => window.matchMedia("(max-width:768px)").matches);
  useEffectVS(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}

function ConferenceSettingsMobileVS() {
  const [settings, setSettings] = useStateVS(readVS);
  const [section, setSection] = useStateVS(initialSectionVS);
  const [toast, showToast] = useToastVS();
  const scrollRef = useRefVS(null);
  const cur = section ? VS_SECTIONS.find((s) => s.key === section) : null;
  const change = (up) => { setSettings((prev) => { const next = typeof up === "function" ? up(prev) : up; writeVS(next); return next; }); showToast("Saved"); };
  const reset = () => { const d = { ...VS_DEFAULTS }; setSettings(d); writeVS(d); showToast("Defaults restored"); };
  const open = (k) => { setSection(k); pushSectionVS(k); if (scrollRef.current) scrollRef.current.scrollTop = 0; };
  const back = () => { if (section) { setSection(null); pushSectionVS(null); if (scrollRef.current) scrollRef.current.scrollTop = 0; } else goVS(backTargetVS()); };

  return (
    <div className="vs-m-screen" data-screen-label={"Conference Settings (mobile)" + (cur ? " · " + cur.label : "")}>
      <header className="vs-m-top">
        <button type="button" className="vs-m-back" aria-label="Back" onClick={back}>
          <DSVS.IconifyIcon name="lucide:chevron-left" size={26} color="var(--gray-900)" />
        </button>
        <h1>{cur ? cur.label : "Conference Settings"}</h1>
      </header>
      <div className="vs-m-scroll" ref={scrollRef}>
        {!cur ?
          <>
            <p className="vs-m-lead">Manage how your voice conferences work and who can participate.</p>
            <div className="vs-m-list">
              {VS_SECTIONS.map((s) =>
                <button key={s.key} type="button" className="vs-m-row" onClick={() => open(s.key)}>
                  <span className="vs-m-rowic"><DSVS.IconifyIcon name={s.icon} size={20} color="currentColor" /></span>
                  <span className="vs-m-rowcopy"><b>{s.label}</b><span>{summaryVS(s, settings)}</span></span>
                  <DSVS.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
                </button>)}
            </div>
            <p className="vs-m-foot">Changes apply the next time you host or join a room.</p>
          </> :
          <>
            <p className="vs-m-lead">{cur.desc}</p>
            <div className="vs-fields vs-m-fields">
              {cur.fields.map((f) => <FieldVS key={f.key} field={f} settings={settings} onChange={change} onReset={reset} mobile />)}
            </div>
          </>}
      </div>
      <ToastVS toast={toast} />
    </div>);
}

function ConferenceSettingsAppVS() {
  const mobile = useIsMobileVS();
  const scale = useDeviceScaleVS();
  const dark = useIsDarkVS();
  if (VS_WEB) return <ConferenceSettingsWebVS />;
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><ConferenceSettingsMobileVS /></div>;
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><ConferenceSettingsMobileVS /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ConferenceSettingsAppVS />);
