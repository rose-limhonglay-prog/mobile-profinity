/* ===========================================================================
   PROfinity — Community (Confidence channel) · iPhone 17 Pro Max mobile
   Reuses the shared Feed (window.PFApp.Feed) inside the IOSDevice frame, with
   the community top bar, channel header, composer and bottom tab bar. Tapping a
   post's comment opens the slide-up Comments sheet (PF_COMMENT_SHEET).
   Shares one global scope with app.jsx, so names here are suffixed -CM.
   =========================================================================== */
const DSCM = window.ProfinityDesignSystem_c2b5cc;
const PFACM = window.PFApp;

function goCM(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

function useDeviceScaleCM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setCMScale] = React.useState(calc);
  React.useEffect(() => {
    const update = () => setCMScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileCM() {
  const [mobile, setCM] = React.useState(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setCM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const CM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: null },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "AgentMobile.html" }];

/* Same tier keys as app.jsx's TIER_LADDER, with the resource lists the
   expandable Communities cards in the side menu need — app.jsx's ladder only
   carries upgrade-modal perks copy, not per-tier resource counts. */
const SM_TIER_LADDER_CM = ["confidence", "mastery", "freedom", "inner"];
const SM_TIER_META_CM = {
  confidence: { name: "Confidence" },
  mastery:    { name: "Mastery" },
  freedom:    { name: "Freedom" },
  inner:      { name: "Inner Circle" }
};
const SM_TIER_RESOURCES_CM = {
  confidence: [
  { label: "Community Chat",       icon: "lucide:message-circle", href: null },
  { label: "Membership Training",  icon: "lucide:graduation-cap", href: "MyLearning.html" },
  { label: "Technique Tuesday",    icon: "lucide:calendar-check", href: "EventsMobile.html" },
  { label: "Complications Help",   icon: "lucide:shield-alert",   href: "DirectMessage.html" },
  { label: "AI Coach",             icon: "lucide:sparkles",       href: "MyLearning.html" }],

  mastery: [
  { label: "Mastery lounge",          icon: "lucide:message-circle", n: 6,  href: null },
  { label: "Advanced masterclasses",  icon: "lucide:graduation-cap", n: 9,  href: "MyLearning.html" },
  { label: "Complication library",    icon: "lucide:file-text",      n: 18, href: "MyLearning.html" },
  { label: "Live case reviews",       icon: "lucide:calendar",       n: 3,  href: "EventsMobile.html" }],

  freedom: [
  { label: "Freedom circle",       icon: "lucide:message-circle", n: 2, href: null },
  { label: "Business playbooks",   icon: "lucide:graduation-cap", n: 7, href: "MyLearning.html" },
  { label: "1:1 mentor sessions",  icon: "lucide:calendar",       n: 1, href: "EventsMobile.html" }],

  inner: [
  { label: "Inner Circle roundtable", icon: "lucide:message-circle", n: 4, href: null },
  { label: "Executive mentorship",    icon: "lucide:calendar",       n: 1, href: "EventsMobile.html" },
  { label: "Legacy case archive",     icon: "lucide:file-text",      n: 9, href: "MyLearning.html" },
  { label: "Founder office hours",    icon: "lucide:calendar",       n: 2, href: "EventsMobile.html" }]

};
/* Tiers unlocked by a viewer on `tier`, highest first. Free (no match) unlocks none. */
function smUnlockedTiersCM(tier) {
  const i = SM_TIER_LADDER_CM.indexOf(tier);
  if (i === -1) return [];
  return SM_TIER_LADDER_CM.slice(0, i + 1).reverse();
}
/* The next rung up from `tier` — null once at the top of the ladder. */
function smNextTierCM(tier) {
  const i = SM_TIER_LADDER_CM.indexOf(tier);
  if (i === SM_TIER_LADDER_CM.length - 1) return null;
  return SM_TIER_LADDER_CM[i + 1];
}

const SM_EVENTS_CM = [
{ d: "30", m: "JUN", label: "Technique Tuesday Webinar", t: "8:00 PM", access: "open" },
{ d: "5", m: "JUL", label: "Confidence Masterclass", t: "6:00 PM", access: "members" },
{ d: "12", m: "JUL", label: "Business Growth Workshop", t: "7:00 PM", access: "members" }];

const SM_PROFILE_BEFORE_CM = [
{ label: "Edit Profile",       icon: "lucide:book-open",       href: "ProfileMobile.html" },
{ label: "Account Settings",   icon: "lucide:graduation-cap",  href: null },
{ label: "Notifications",      icon: "lucide:calendar",        href: "NotificationSettings.html" },
{ label: "Privacy & Security", icon: "lucide:book-open",       href: null }];

function useDarkModeCM() {
  const [dark, setDark] = React.useState(() => {
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

function SmDarkSwitchCM({ on, onToggle }) {
  return (
    <button className={"sm-switch" + (on ? " on" : "")} onClick={onToggle} role="switch"
      aria-checked={on} aria-label={on ? "Switch to light mode" : "Switch to dark mode"}>
      <span className="sm-knob">
        {on && <DSCM.IconifyIcon name="lucide:moon" size={13} color="#1A1736" />}
      </span>
    </button>);
}

function SmDisplayCardCM({ dark, onToggle }) {
  return (
    <div className="sm-display-card">
      <div className="sm-display-top">
        <span className="sm-display-label">Display</span>
        <SmDarkSwitchCM on={dark} onToggle={onToggle} />
      </div>
      <p className="sm-display-desc">
        Adjust the appearance of the app to reduce glare and give your eyes a break
      </p>
    </div>);
}

function SmSectionCM({ title }) {
  return <div className="sm-sec-h">{title}</div>;
}

function SmTierResourceRowCM({ r }) {
  return (
    <button className="smt-resource" onClick={() => r.href && goCM(r.href)}>
      <DSCM.IconifyIcon name={r.icon} size={20} color="var(--gray-900)" />
      <span className="smt-resource-label">{r.label}</span>
      <DSCM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
    </button>);

}

function SmTierCardCM({ tierKey, isOwn }) {
  const resources = SM_TIER_RESOURCES_CM[tierKey];
  return (
    <div className="smt-card">
      <div className="smt-head">
        <span className="smt-top">
          <span className="smt-name">{SM_TIER_META_CM[tierKey].name} Path</span>
          {!isOwn && <span className="smt-pill">INCLUDED</span>}
        </span>
      </div>
      <div className="smt-resources">
        {resources.map((r) => <SmTierResourceRowCM key={r.label} r={r} />)}
      </div>
    </div>);

}

function SideMenuCM({ open, onClose }) {
  const [dark, toggleDark] = useDarkModeCM();
  const tier = PFACM.getUserTier();
  const unlockedTiers = smUnlockedTiersCM(tier);
  const nextTier = smNextTierCM(tier);
  const showUpgrade = tier === "free" || tier === "confidence" || tier === "mastery";
  /* Bronze by default; silver once the next rung is Mastery; gold for
     Freedom / Inner Circle. */
  const upgradeMetal = nextTier === "mastery" ? "silver" : nextTier === "freedom" || nextTier === "inner" ? "gold" : "bronze";
  const upgradeIconColor = upgradeMetal === "silver" ? "#3F4650" : upgradeMetal === "gold" ? "#5A3A00" : "#fff";
  return (
    <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="m-drawer-scrim" onClick={onClose} />
      <aside className="m-drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <button className="m-drawer-profile" onClick={() => goCM("ProfileMobile.html")}>
          <DSCM.Avatar name={PFACM.ME.name} src={PFACM.ME.avatar} size={56} />
          <span className="m-dp-main">
            <span className="m-dp-name">{PFACM.ME.name}
              <DSCM.IconifyIcon name="lucide:badge-check" size={18} color="var(--reaction-like)" />
            </span>
            <span className="m-dp-role">{PFACM.ME.role}</span>
          </span>
          <DSCM.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-800)" />
        </button>

        <div className="sm-body">
          {showUpgrade && nextTier &&
          <button className={"sm-upgrade metal-" + upgradeMetal} onClick={() => goCM("MembershipTier.html")}>
              <span className="sm-upgrade-icon">
                <DSCM.IconifyIcon name="lucide:gem" size={20} color={upgradeIconColor} />
              </span>
              <span className="sm-upgrade-main">
                <span className="sm-upgrade-title">Upgrade to {SM_TIER_META_CM[nextTier].name}</span>
                <span className="sm-upgrade-sub">Unlock more premium channels &amp; courses</span>
              </span>
              <DSCM.IconifyIcon name="lucide:chevron-right" size={20} color={upgradeIconColor} />
            </button>
          }

          {unlockedTiers.length > 0 &&
          <>
            <SmSectionCM title="My Membership" />
            <div className="smt-list">
              {unlockedTiers.map((tKey) =>
            <SmTierCardCM key={tKey} tierKey={tKey} isOwn={tKey === tier} />
            )}
            </div>
          </>
          }

          <button className="sm-primary-card" onClick={() => goCM("MyLearning.html")}>
            <span className="sm-primary-icon">
              <DSCM.IconifyIcon name="lucide:graduation-cap" size={22} color="var(--brand-navy)" />
            </span>
            <span className="sm-primary-main">
              <span className="sm-primary-title">My Learning</span>
              <span className="sm-primary-sub">Courses, protocols &amp; certificates</span>
            </span>
            <DSCM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
          </button>

          {unlockedTiers.includes("freedom") &&
          <button className="sm-primary-card" onClick={() => goCM("FreedomPathChat.html")}>
              <span className="sm-primary-icon">
                <DSCM.IconifyIcon name="lucide:rocket" size={22} color="var(--brand-navy)" />
              </span>
              <span className="sm-primary-main">
                <span className="sm-primary-title">Freedom Path Chat</span>
                <span className="sm-primary-sub">Business, scaling &amp; mentorship</span>
              </span>
              <DSCM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
            </button>
          }

          <SmSectionCM title="Upcoming Events" />
          <div className="sm-events">
            {SM_EVENTS_CM.slice(0, 2).map((e) =>
            <button key={e.label} className="sm-event" onClick={() => goCM("EventsMobile.html")}>
                <span className="sm-date"><b>{e.d}</b><i>{e.m}</i></span>
                <span className="sm-event-main">
                  <span className="sm-event-name">{e.label}</span>
                  <span className="sm-event-time">{e.t}</span>
                </span>
                <span className={"sm-event-access" + (e.access === "members" ? " sm-event-access-members" : " sm-event-access-open")}>
                  {e.access === "members" ? "Members only" : "Open to all"}
                </span>
              </button>
            )}
          </div>

          <SmSectionCM title="My Profile" />
          <button className="sm-row sm-verify" onClick={() => goCM("ProfileMobile.html")}>
            <DSCM.IconifyIcon name="lucide:book-open" size={23} color="var(--premium-orange)" />
            <span className="sm-row-label">Verify Profile</span>
            <span className="sm-verify-pill">Not Verified</span>
          </button>
          <nav className="sm-list">
            {SM_PROFILE_BEFORE_CM.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => c.href && goCM(c.href)}>
                <DSCM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
                <DSCM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </button>
            )}
          </nav>

          <SmDisplayCardCM dark={dark} onToggle={toggleDark} />

          <button className="m-drawer-logout" onClick={onClose}>
            <DSCM.IconifyIcon name="lucide:log-out" size={22} color="var(--error)" />
            Logout
          </button>
        </div>
      </aside>
    </div>);
}

function CMTopBar({ onMenu, onMessages }) {
  return (
    <header className="cm-top">
      <button className="cm-burger" aria-label="Menu" onClick={onMenu}><DSCM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" />
      <span className="grow" />
      <button className="cm-iconbtn" aria-label="Search"><DSCM.Icon name="search" size={21} color="var(--brand-navy)" /></button>
      <button className="cm-iconbtn" aria-label="Notifications">
        <DSCM.IconifyIcon name="lucide:bell" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
      <button className="cm-iconbtn" aria-label="Messages" onClick={() => onMessages && onMessages()}>
        <DSCM.IconifyIcon name="lucide:message-circle" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
    </header>);

}

const DM_THREADS_SEED_CM = [
{ id: "tim", name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", online: true, unread: 2,
  messages: [
  { me: false, text: "Hey Katy! I saw your post about the full-face rejuvenation case.", t: "10:12 AM" },
  { me: true, text: "Thank you! It was a great result, patient was thrilled.", t: "10:20 AM" },
  { me: false, text: "Do you mind if I share it with my team as a reference?", t: "10:25 AM" },
  { me: true, text: "Of course, go ahead — sharing the write-up now.", t: "10:28 AM" },
  { me: false, text: "Thanks for sharing the case study. Really helpful!", t: "10:30 AM" }] },

{ id: "sarah", name: "Dr Sarah Kim", avatar: null, online: true, unread: 1,
  messages: [
  { me: false, text: "Are you free to go over the Q3 protocol updates this week?", t: "9:40 AM" },
  { me: true, text: "Yes, Thursday afternoon works for me.", t: "9:52 AM" },
  { me: false, text: "Looking forward to our next meeting!", t: "11:00 AM" }] },

{ id: "emily", name: "Dr Emily Tran", avatar: null, online: false, unread: 3,
  messages: [
  { me: false, text: "Just finished reviewing the patient satisfaction data.", t: "10:50 AM" },
  { me: false, text: "There's a trend worth flagging in the 45+ age group.", t: "11:05 AM" },
  { me: false, text: "I have some additional insights to share.", t: "11:15 AM" }] },

{ id: "james", name: "Dr James Brown", avatar: null, online: false, unread: 0, muted: true,
  messages: [
  { me: true, text: "Sent over the full results deck this morning.", t: "11:05 AM" },
  { me: false, text: "Can we discuss the implications of the results?", t: "11:30 AM" }] },

{ id: "alex", name: "Dr Alex Chen", avatar: null, online: true, unread: 0,
  messages: [
  { me: false, text: "The dosing charts you put together are excellent.", t: "11:40 AM" },
  { me: false, text: "Great work on the data analysis!", t: "11:45 AM" }] },

{ id: "miranda", name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", online: false, unread: 0,
  messages: [
  { me: true, text: "Sharing the confidence-score writeup with you now.", t: "11:50 AM" },
  { me: false, text: "Perfect, thank you — this is exactly what I needed.", t: "12:00 PM" }] }];


const VOICE_CONFS_SEED_CM = [
{ id: "vc1", name: "Clinical Case Review", who: "Dr Tim Pearce, Dr Sarah Kim +3", t: "Today, 4:00 PM", live: true },
{ id: "vc2", name: "Business Growth Sync", who: "Miranda Pearce, Dr Alex Chen", t: "Tomorrow, 10:00 AM", live: false }];

const PF_GROUPS_KEY = "pf-dm-groups";

function readDmGroupsCM() {
  try { return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || []; } catch (e) { return []; }
}

function groupDisplayNameCM(members) {
  const names = members.map((m) => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}

function createDmGroupCM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = { id: "group-" + Date.now(), isGroup: true, customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNameCM(members), members, messages: [] };
  const groups = readDmGroupsCM();
  groups.unshift(group);
  try { localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups)); } catch (e) {}
  return group;
}

function GroupAvatarStackCM({ members, size }) {
  const s = size || 52;
  return (
    <span className="mp-group-av" style={{ width: s, height: s }}>
      {members.slice(0, 2).map((m, i) =>
        <span className="mp-group-av-item" key={m.id || i}>
          <DSCM.Avatar name={m.name} src={m.avatar} size={Math.round(s * 0.68)} />
        </span>
      )}
    </span>);
}

function MessagesRowCM({ c, onOpen }) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return (
    <button className="mp-row" onClick={onOpen}>
      <span className="mp-av">
        {c.isGroup ?
        <GroupAvatarStackCM members={c.members} /> :

        <>
            <DSCM.Avatar name={c.name} src={c.avatar} size={52} />
            {c.online && <span className="dm-online-dot" />}
          </>}
      </span>
      <span className="mp-main">
        <span className="mp-row-top">
          <span className="mp-name">{c.name}</span>
          <span className="mp-time">{last ? last.t : ""}</span>
        </span>
        <span className="mp-row-bottom">
          <span className="mp-preview">{last ? last.text : c.isGroup ? c.members.length + " members" : ""}</span>
          {c.muted ?
          <DSCM.IconifyIcon name="lucide:bell-off" size={16} color="var(--gray-450)" /> :
          c.unread > 0 &&
          <span className="mp-badge">{c.unread}</span>
          }
        </span>
      </span>
    </button>);

}

function NewConversationScreenCM({ contacts, picked, onToggle, query, onQuery, groupName, onGroupName, onBack, onCreate }) {
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const count = picked.length;
  return (
    <div className="mp-new" data-screen-label="New Conversation">
      <header className="nt-head">
        <button className="nt-back" aria-label="Back to messages" onClick={onBack}>
          <DSCM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>New Conversation</h2>
      </header>
      <div className="nt-search mp-search">
        <DSCM.Icon name="search" size={20} color="var(--gray-450)" />
        <input type="text" placeholder="Search people" aria-label="Search people" value={query} onChange={(e) => onQuery(e.target.value)} />
      </div>
      {count > 1 &&
      <div className="mp-new-namewrap">
          <input type="text" className="mp-new-nameinput" placeholder="Name this group (optional)"
        aria-label="Group name" value={groupName} onChange={(e) => onGroupName(e.target.value)} />
        </div>}
      <div className="mp-new-list">
        {filtered.map((c) => {
          const on = picked.includes(c.id);
          return (
            <button key={c.id} className={"mp-new-row" + (on ? " on" : "")} onClick={() => onToggle(c.id)}>
              <span className="mp-av"><DSCM.Avatar name={c.name} src={c.avatar} size={44} /></span>
              <span className="mp-new-name">{c.name}</span>
              <span className={"mp-new-check" + (on ? " on" : "")}>
                {on && <DSCM.IconifyIcon name="lucide:check" size={13} color="#fff" />}
              </span>
            </button>);

        })}
        {filtered.length === 0 && <div className="mp-new-empty">No people found.</div>}
      </div>
      <div className="mp-new-footer">
        <span className="mp-new-count">{count} selected</span>
        <button className="mp-new-create" disabled={count === 0} onClick={onCreate}>
          {count > 1 ? "Create Group" : "Start Chat"}
        </button>
      </div>
    </div>);

}

function VoiceConfRowCM({ v }) {
  return (
    <div className="mp-row mp-vc-row">
      <span className="mp-av mp-vc-icon">
        <DSCM.IconifyIcon name="lucide:phone-call" size={22} color="var(--brand-navy)" />
      </span>
      <span className="mp-main">
        <span className="mp-row-top">
          <span className="mp-name">{v.name}</span>
          {v.live && <span className="mp-vc-live">LIVE</span>}
        </span>
        <span className="mp-row-bottom">
          <span className="mp-preview">{v.who}</span>
        </span>
        <span className="mp-vc-time">{v.t}</span>
      </span>
    </div>);

}

function MessagesPanelCM({ open, onClose }) {
  const [tab, setTab] = React.useState("messages");
  const [query, setQuery] = React.useState("");
  const [screen, setScreen] = React.useState("list");
  const [groups, setGroups] = React.useState([]);
  const [picked, setPicked] = React.useState([]);
  const [ncQuery, setNcQuery] = React.useState("");
  const [groupName, setGroupName] = React.useState("");
  React.useEffect(() => {
    if (!open) { setQuery(""); setScreen("list"); setPicked([]); setNcQuery(""); setGroupName(""); } else
    { setGroups(readDmGroupsCM()); }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED_CM];
  const filtered = allThreads.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED_CM.reduce((n, t) => n + (t.unread || 0), 0);

  function openThread(id) {
    goCM("DirectMessage.html?id=" + id + "&from=CommunityMobile.html");
  }

  function togglePick(id) {
    setPicked((all) => all.includes(id) ? all.filter((x) => x !== id) : [...all, id]);
  }

  function handleCreate() {
    if (picked.length === 0) return;
    if (picked.length === 1) { openThread(picked[0]); return; }
    const members = DM_THREADS_SEED_CM.
    filter((c) => picked.includes(c.id)).
    map((c) => ({ id: c.id, name: c.name, avatar: c.avatar }));
    const group = createDmGroupCM(members, groupName);
    openThread(group.id);
  }

  if (screen === "new") {
    return (
      <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="m-drawer-scrim" onClick={onClose} />
        <aside className="m-drawer nt-panel mp-panel" role="dialog" aria-modal="true" aria-label="New Conversation">
          <NewConversationScreenCM contacts={DM_THREADS_SEED_CM} picked={picked} onToggle={togglePick}
            query={ncQuery} onQuery={setNcQuery} groupName={groupName} onGroupName={setGroupName}
            onBack={() => setScreen("list")} onCreate={handleCreate} />
        </aside>
      </div>);

  }

  return (
    <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="m-drawer-scrim" onClick={onClose} />
      <aside className="m-drawer nt-panel mp-panel" role="dialog" aria-modal="true" aria-label="Messages">
        <header className="nt-head">
          <button className="nt-back" aria-label="Close" onClick={onClose}>
            <DSCM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
          </button>
          <h2 style={{ fontSize: "26px", fontWeight: "700" }}>Messages</h2>
          <button className="mp-compose" aria-label="New message" onClick={() => setScreen("new")}>
            <DSCM.IconifyIcon name="lucide:square-pen" size={20} color="var(--gray-900)" />
          </button>
        </header>
        <div className="mp-tabs" role="tablist" aria-label="Messages or voice conference">
          <button role="tab" aria-selected={tab === "messages"} className={"mp-tab" + (tab === "messages" ? " on" : "")} onClick={() => setTab("messages")}>
            <DSCM.IconifyIcon name="lucide:message-circle" size={16} color={tab === "messages" ? "var(--brand-navy)" : "var(--gray-450)"} />
            Messages
            {unreadTotal > 0 && <span className="mp-tab-badge">{unreadTotal}</span>}
          </button>
          <button role="tab" aria-selected={tab === "voice"} className={"mp-tab" + (tab === "voice" ? " on" : "")} onClick={() => setTab("voice")}>
            <DSCM.IconifyIcon name="lucide:phone" size={16} color={tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"} />
            Voice Conference
            <span className="mp-tab-badge">{VOICE_CONFS_SEED_CM.length}</span>
          </button>
        </div>
        <div className="nt-search mp-search">
          <DSCM.Icon name="search" size={20} color="var(--gray-450)" />
          <input type="text" placeholder="Search messages" aria-label="Search messages" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="nt-body mp-body">
          {tab === "messages" ?
          filtered.map((c) => <MessagesRowCM key={c.id} c={c} onOpen={() => openThread(c.id)} />) :
          VOICE_CONFS_SEED_CM.map((v) => <VoiceConfRowCM key={v.id} v={v} />)
          }
        </div>
      </aside>
    </div>);

}

const CM_CHANNELS = ["Confidence", "Mastery", "Freedom", "Inner Circle"];
const CM_PREMIUM_CHANNELS = new Set(["Confidence", "Freedom", "Mastery", "Inner Circle"]);
const CM_CHANNEL_BUCKET = { Confidence: "confidence", Mastery: "mastery", Freedom: "freedom", "Inner Circle": "inner" };

function CMHeader({ channel, setChannel }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return (
    <div className="cm-head">
      <div className="cm-chsel">
        <button type="button" className="ch cm-chbtn" aria-haspopup="listbox" aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
          {channel}
          <span className={"cm-chchev" + (open ? " open" : "")}>
            <DSCM.IconifyIcon name="lucide:chevron-down" size={18} color="#fff" />
          </span>
        </button>
        {open &&
        <div className="cm-chmenu" role="listbox" onClick={(e) => e.stopPropagation()}>
            {CM_CHANNELS.map((c) =>
          <button key={c} role="option" aria-selected={c === channel}
          className={"cm-chitem" + (c === channel ? " on" : "")}
          onClick={() => { setChannel(c); setOpen(false); }}>
                <span className="cm-chitem-name">
                  {c}
                  {CM_PREMIUM_CHANNELS.has(c) &&
                <DSCM.IconifyIcon name="fluent:crown-16-filled" size={14} color="var(--brand-gold)" />
                }
                </span>
                {c === channel && <DSCM.IconifyIcon name="lucide:check" size={17} color="var(--brand-navy)" />}
              </button>
          )}
          </div>
        }
      </div>
      <button type="button" className="cm-dir" aria-label="Clinician directory" title="Clinician directory"
        onClick={() => goCM("ClinicianDirectory.html")}>
        <DSCM.IconifyIcon name="lucide:map" size={22} color="var(--brand-navy)" />
      </button>
    </div>);

}

const CMTabBar = React.forwardRef(function CMTabBar({ compact }, ref) {
  return (
    <nav ref={ref} className={"cm-tabs" + (compact ? " cm-tabs-compact" : "")} aria-label="Primary">
      {CM_TABS.map((t) =>
      <button key={t.key} className={"cm-tab" + (t.key === "Community" ? " on" : "")}
      aria-current={t.key === "Community" ? "page" : undefined}
      onClick={() => t.href && goCM(t.href)}>
          <span className="ic">
            <DSCM.IconifyIcon name={t.icon} size={20} color={t.key === "Community" ? "#fff" : "var(--gray-450)"} />
          </span>
          <span className="lbl">{t.label}</span>
        </button>
      )}
    </nav>);

});

function useHeaderHideCM(scrollRef) {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY;
      if (y < 24) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

function CMScreen({ scrollRef, newPosts, dismiss }) {
  const [channel, setChannel] = React.useState("Confidence");
  const [msgOpen, setMsgOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const headerRef = React.useRef(null);
  const tabsRef = React.useRef(null);
  const [headerH, setHeaderH] = React.useState(0);
  const [tabsH, setTabsH] = React.useState(0);
  const chromeHidden = useHeaderHideCM(scrollRef);
  React.useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const measure = () => setTabsH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="cm-screen" data-screen-label="Community (mobile)">
      <div ref={headerRef} className={"cm-header-wrap" + (chromeHidden ? " cm-header-hidden" : "")}>
        <CMTopBar onMenu={() => setMenuOpen(true)} onMessages={() => setMsgOpen(true)} />
        <CMHeader channel={channel} setChannel={setChannel} />
      </div>
      <div className="cm-scroll" ref={scrollRef} style={{ paddingTop: headerH, paddingBottom: tabsH + 34 }}>
        {newPosts > 0 &&
        <button type="button" className="cm-newposts" onClick={dismiss}
        aria-label={newPosts + " new posts, tap to see them"}>
            <DSCM.IconifyIcon name="lucide:arrow-up" size={18} color="var(--white)" />
            {newPosts} New Posts
          </button>
        }
        <PFACM.Feed channel={CM_CHANNEL_BUCKET[channel]} />
        <div className="cm-end">End of newsfeed</div>
      </div>
      <button type="button" className={"m-fab" + (chromeHidden ? " m-fab-compact" : "")} aria-label="Share a Post" onClick={() => {
        try { sessionStorage.setItem("pf_post_channels", JSON.stringify([channel])); } catch (e) {}
        goCM("CreatePostMobile.html?from=community");
      }}>
        <DSCM.IconifyIcon name="lucide:plus" size={20} color="#fff" />
        <span className="lbl">Share a Post</span>
      </button>
      <CMTabBar ref={tabsRef} compact={chromeHidden} />
      <MessagesPanelCM open={msgOpen} onClose={() => setMsgOpen(false)} />
      <SideMenuCM open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>);
}

function CommunityMobileApp() {
  const mobile = useIsMobileCM();
  const [newPosts, setNewPosts] = React.useState(3);
  const scrollRef = React.useRef(null);
  const dismiss = () => {
    const s = scrollRef.current;
    if (s) s.scrollTo({ top: 0, behavior: "smooth" });
    setNewPosts(0);
  };
  const scale = useDeviceScaleCM();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  const screen = <CMScreen scrollRef={scrollRef} newPosts={newPosts} dismiss={dismiss} />;
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}>{screen}</div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(216, 218, 226)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}>{screen}</IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CommunityMobileApp />);
