/* ===========================================================================
   PROfinity — Profile (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -PM to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStatePM, useEffect: useEffectPM } = React;
const DSPM = window.ProfinityDesignSystem_c2b5cc;

function goPM(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

/* Standalone badge image with a hover/tap tooltip explaining what it means
   (mastery + skinfluencer badges aren't part of DSPM.VerificationSeals). */
function PMSealBadge({ src, alt, label, width, height, style }) {
  const [hover, setHover] = useStatePM(false);
  const [pinned, setPinned] = useStatePM(false);
  useEffectPM(() => {
    if (!pinned) return;
    const close = () => { setPinned(false); setHover(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [pinned]);
  const open = hover || pinned;
  return (
    <span className={"pm-seal-badge" + (open ? " is-open" : "")} tabIndex={0} role="button" aria-label={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); setPinned((p) => !p); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPinned((p) => !p); } }}
      style={style}>
      <img src={src} alt={alt} width={width} height={height} style={{ display: "block" }} />
      <span className="pm-seal-tip">{label}</span>
    </span>
  );
}

const PM_ME = {
  name: "Katy Wilson", role: "Registered Nurse", avatar: "assets/avatar-katy.jpg",
  seals: ["gb", "verified", "crown", "gold"],
  bio: "Enhance patient satisfaction scores by 15% over the next 6 months through improved communication and personalized care planning.",
  followers: "1,546", following: "880", posts: "57", location: "London, United Kingdom", clinic: "Allcare Medical"
};

const PM_SERVICES = [
{ ti: "Botox (Anti-Wrinkle Injections)", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Dermal Fillers", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Lip Enhancement", su: "Career Academy: Dr Tim Pearce" },
{ ti: "Cheek & Jawline Contouring", su: "Career Academy: Dr Tim Pearce" }];


const PM_EXPERIENCE = [
{ ti: "Registered Nurse", yrs: "12 years", org: "Generations Wellness Center", loc: "London, United Kingdom" },
{ ti: "Assistant Nurse", yrs: "12 years", org: "Generations Wellness Center", loc: "London, United Kingdom" }];


const PM_LICENSES = [
"The Ultimate Toxin Eye Complications Masterclass",
"Anatomy360",
"Pro Tox Course",
"8D Lips Course",
"Botox Foundations"];


const PM_ACTIVITY = [
{
  name: "Katy Wilson", loc: "London, United Kingdom", time: "Today", avatar: "assets/avatar-katy.jpg",
  title: "Temple Filler Techniques",
  body: "One of the biggest challenges in clinical practice? Paperwork. Since switching to PROfinity, consent forms, treatment records, and post-consult notes are now digital, organized, and secure — saving me time and giving patients a clearer, more confident experience.\n#DigitalHealth #PatientCare #ClinicianTools #PROfinity",
  likes: "1.2K", comments: "150", shares: "150"
},
{
  name: "James Lee", loc: "Sydney, Australia", time: "Yesterday", avatar: null,
  title: "Advanced Suturing Techniques",
  body: "In my surgical practice, time is precious. That's why I was thrilled to discover the ease of digital record-keeping with PROfinity. Documentation has never been simpler — everything I need is just a few taps away.\n#Surgery #PatientSafety #MedicalTech #PROfinity",
  likes: "850", comments: "200", shares: "180"
},
{
  name: "Linda Garcia", loc: "Toronto, Canada", time: "Last Week", avatar: null,
  title: "Emerging Technologies in Dentistry",
  body: "The dental field is evolving rapidly, and so should our approach to documentation. From treatment plans to follow-up notes, everything is handled digitally — less clutter, more focus on patient interactions.\n#DentalCare #TechInDentistry #PROfinity #FutureOfHealthcare",
  likes: "1.5K", comments: "120", shares: "200"
}];


const PM_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: null },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "AgentMobile.html" }];


const SM_RESOURCES_PM = [
{ label: "Videos", icon: "lucide:square-play" },
{ label: "Articles", icon: "lucide:feather" },
{ label: "Webinars", icon: "lucide:calendar" }];

const SM_COURSES_PM = [
{ label: "Face Anatomy Masterclass", pct: 72 },
{ label: "Lip Filler Techniques", pct: 45 },
{ label: "Advanced Botox Training", pct: 20 }];

const SM_EVENTS_PM = [
{ d: "30", m: "JUN", label: "Technique Tuesday Webinar", t: "8:00 PM", tag: "NEW" },
{ d: "5", m: "JUL", label: "Confidence Masterclass", t: "6:00 PM" },
{ d: "12", m: "JUL", label: "Business Growth Workshop", t: "7:00 PM" }];

const SM_PROFILE_BEFORE_PM = [
{ label: "Edit Profile",       icon: "lucide:book-open",       href: "ProfileMobile.html" },
{ label: "Account Settings",   icon: "lucide:graduation-cap",  href: "AccountSettings.html" },
{ label: "Notifications",      icon: "lucide:calendar",        href: "NotificationSettings.html" }];

const SM_PROFILE_AFTER_PM = [
{ label: "Privacy & Security", icon: "lucide:book-open",       href: null },
{ label: "Admin Panel",        icon: "lucide:shield",          href: "AdminPanel.html" }];

function useDarkModePM() {
  const [dark, setDark] = useStatePM(() => {
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

function SmDarkSwitchPM({ on, onToggle }) {
  return (
    <button className={"sm-switch" + (on ? " on" : "")} onClick={onToggle} role="switch"
      aria-checked={on} aria-label={on ? "Switch to light mode" : "Switch to dark mode"}>
      <span className="sm-knob">
        {on && <DSPM.IconifyIcon name="lucide:moon" size={13} color="#1A1736" />}
      </span>
    </button>);
}

function SmDisplayCardPM({ dark, onToggle }) {
  return (
    <div className="sm-display-card">
      <div className="sm-display-top">
        <span className="sm-display-label">Display</span>
        <SmDarkSwitchPM on={dark} onToggle={onToggle} />
      </div>
      <p className="sm-display-desc">
        Adjust the appearance of the app to reduce glare and give your eyes a break
      </p>
    </div>);
}

function SmSectionPM({ title }) {
  return <div className="sm-sec-h">{title}</div>;
}

function SideMenuPM({ open, onClose }) {
  const [dark, toggleDark] = useDarkModePM();
  return (
    <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="m-drawer-scrim" onClick={onClose} />
      <aside className="m-drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <button className="m-drawer-profile" onClick={() => goPM("ProfileMobile.html")}>
          <DSPM.Avatar name={PM_ME.name} src={PM_ME.avatar} size={56} />
          <span className="m-dp-main">
            <span className="m-dp-name">{PM_ME.name}
              <DSPM.IconifyIcon name="lucide:badge-check" size={18} color="var(--reaction-like)" />
            </span>
            <span className="m-dp-role">{PM_ME.role}</span>
          </span>
          <DSPM.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-800)" />
        </button>

        <div className="sm-body">
          <button className="sm-upgrade" onClick={() => goPM("MembershipTier.html")}>
            <span className="sm-upgrade-icon">
              <DSPM.IconifyIcon name="lucide:gem" size={20} color="#fff" />
            </span>
            <span className="sm-upgrade-main">
              <span className="sm-upgrade-title">Upgrade to Confidence</span>
              <span className="sm-upgrade-sub">Unlock premium channels &amp; courses</span>
            </span>
            <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="#fff" />
          </button>

          <SmSectionPM title="Communities" />
          <button className="sm-tier" onClick={() => goPM("CommunityMobile.html")}>
            <span className="sm-tier-top">
              <span className="sm-tier-name">Confidence Path</span>
              <span className="sm-tier-pill">YOUR TIER</span>
            </span>
            <span className="sm-tier-sub">Exclusive tier content</span>
            <span className="sm-tier-new">3 new posts</span>
          </button>

          <SmSectionPM title="Membership Resources" />
          <nav className="sm-list">
            {SM_RESOURCES_PM.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => goPM("LearningMobile.html")}>
                <DSPM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
              </button>
            )}
          </nav>

          <SmSectionPM title="My Courses" />
          <div className="sm-courses">
            {SM_COURSES_PM.map((c) =>
            <button key={c.label} className="sm-course" onClick={() => goPM("LearningMobile.html")}>
                <span className="sm-course-top">
                  <span className="sm-course-thumb">
                    <DSPM.IconifyIcon name="lucide:image" size={20} color="var(--gray-400)" />
                  </span>
                  <span className="sm-course-name">{c.label}</span>
                </span>
                <span className="sm-progress"><span className="sm-progress-fill" style={{ width: c.pct + "%" }} /></span>
                <span className="sm-course-pct">{c.pct}% complete</span>
              </button>
            )}
          </div>

          <SmSectionPM title="Upcoming Events" />
          <div className="sm-events">
            {SM_EVENTS_PM.map((e) =>
            <button key={e.label} className="sm-event" onClick={() => goPM("EventsMobile.html")}>
                <span className="sm-date"><b>{e.d}</b><i>{e.m}</i></span>
                <span className="sm-event-main">
                  <span className="sm-event-name">{e.label}</span>
                  <span className="sm-event-time">{e.t}</span>
                </span>
                {e.tag && <span className="sm-event-tag">{e.tag}</span>}
              </button>
            )}
          </div>

          <SmSectionPM title="My Profile" />
          <button className="sm-row sm-verify" onClick={() => goPM("ProfileMobile.html")}>
            <DSPM.IconifyIcon name="lucide:book-open" size={23} color="var(--premium-orange)" />
            <span className="sm-row-label">Verify Profile</span>
            <span className="sm-verify-pill">Not Verified</span>
          </button>
          <nav className="sm-list">
            {SM_PROFILE_BEFORE_PM.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => c.href && goPM(c.href)}>
                <DSPM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
                <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </button>
            )}
          </nav>

          <SmDisplayCardPM dark={dark} onToggle={toggleDark} />

          <nav className="sm-list">
            {SM_PROFILE_AFTER_PM.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => c.href && goPM(c.href)}>
                <DSPM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
                <DSPM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </button>
            )}
          </nav>

          <button className="m-drawer-logout" onClick={onClose}>
            <DSPM.IconifyIcon name="lucide:log-out" size={22} color="var(--error)" />
            Logout
          </button>
        </div>
      </aside>
    </div>);
}

function PMTopBar({ onMenu, onMessages }) {
  return (
    <header className="pm-top">
      <button className="pm-burger" aria-label="Menu" onClick={onMenu}><DSPM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img className="m-logo-light" src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      <img className="m-logo-dark" src="assets/profinity-academy-logo-dark.jpg" alt="PROfinity Academy" />
      <span className="grow" />
      <button className="pm-iconbtn" aria-label="Search"><DSPM.Icon name="search" size={21} color="var(--brand-navy)" /></button>
      <button className="pm-iconbtn" aria-label="Notifications">
        <DSPM.IconifyIcon name="lucide:bell" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
      <button className="pm-iconbtn" aria-label="Messages" onClick={() => onMessages && onMessages()}>
        <DSPM.IconifyIcon name="lucide:message-circle" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
    </header>);

}

const DM_THREADS_SEED_PM = [
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


const VOICE_CONFS_SEED_PM = [
{ id: "vc1", name: "Clinical Case Review", who: "Dr Tim Pearce, Dr Sarah Kim +3", t: "Today, 4:00 PM", live: true },
{ id: "vc2", name: "Business Growth Sync", who: "Miranda Pearce, Dr Alex Chen", t: "Tomorrow, 10:00 AM", live: false }];

const PF_GROUPS_KEY = "pf-dm-groups";

function readDmGroupsPM() {
  try { return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || []; } catch (e) { return []; }
}

function groupDisplayNamePM(members) {
  const names = members.map((m) => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}

function createDmGroupPM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = { id: "group-" + Date.now(), isGroup: true, customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNamePM(members), members, messages: [] };
  const groups = readDmGroupsPM();
  groups.unshift(group);
  try { localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups)); } catch (e) {}
  return group;
}

function GroupAvatarStackPM({ members, size }) {
  const s = size || 52;
  return (
    <span className="mp-group-av" style={{ width: s, height: s }}>
      {members.slice(0, 2).map((m, i) =>
        <span className="mp-group-av-item" key={m.id || i}>
          <DSPM.Avatar name={m.name} src={m.avatar} size={Math.round(s * 0.68)} />
        </span>
      )}
    </span>);
}

function MessagesRowPM({ c, onOpen }) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return (
    <button className="mp-row" onClick={onOpen}>
      <span className="mp-av">
        {c.isGroup ?
        <GroupAvatarStackPM members={c.members} /> :

        <>
            <DSPM.Avatar name={c.name} src={c.avatar} size={52} />
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
          <DSPM.IconifyIcon name="lucide:bell-off" size={16} color="var(--gray-450)" /> :
          c.unread > 0 &&
          <span className="mp-badge">{c.unread}</span>
          }
        </span>
      </span>
    </button>);

}

function NewConversationScreenPM({ contacts, picked, onToggle, query, onQuery, groupName, onGroupName, onBack, onCreate }) {
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const count = picked.length;
  return (
    <div className="mp-new" data-screen-label="New Conversation">
      <header className="nt-head">
        <button className="nt-back" aria-label="Back to messages" onClick={onBack}>
          <DSPM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>New Conversation</h2>
      </header>
      <div className="nt-search mp-search">
        <DSPM.Icon name="search" size={20} color="var(--gray-450)" />
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
              <span className="mp-av"><DSPM.Avatar name={c.name} src={c.avatar} size={44} /></span>
              <span className="mp-new-name">{c.name}</span>
              <span className={"mp-new-check" + (on ? " on" : "")}>
                {on && <DSPM.IconifyIcon name="lucide:check" size={13} color="#fff" />}
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

function VoiceConfRowPM({ v }) {
  return (
    <div className="mp-row mp-vc-row">
      <span className="mp-av mp-vc-icon">
        <DSPM.IconifyIcon name="lucide:phone-call" size={22} color="var(--brand-navy)" />
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

function MessagesPanelPM({ open, onClose }) {
  const [tab, setTab] = useStatePM("messages");
  const [query, setQuery] = useStatePM("");
  const [screen, setScreen] = useStatePM("list");
  const [groups, setGroups] = useStatePM([]);
  const [picked, setPicked] = useStatePM([]);
  const [ncQuery, setNcQuery] = useStatePM("");
  const [groupName, setGroupName] = useStatePM("");
  useEffectPM(() => {
    if (!open) { setQuery(""); setScreen("list"); setPicked([]); setNcQuery(""); setGroupName(""); } else
    { setGroups(readDmGroupsPM()); }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED_PM];
  const filtered = allThreads.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED_PM.reduce((n, t) => n + (t.unread || 0), 0);

  function openThread(id) {
    goPM("DirectMessage.html?id=" + id + "&from=ProfileMobile.html");
  }

  function togglePick(id) {
    setPicked((all) => all.includes(id) ? all.filter((x) => x !== id) : [...all, id]);
  }

  function handleCreate() {
    if (picked.length === 0) return;
    if (picked.length === 1) { openThread(picked[0]); return; }
    const members = DM_THREADS_SEED_PM.
    filter((c) => picked.includes(c.id)).
    map((c) => ({ id: c.id, name: c.name, avatar: c.avatar }));
    const group = createDmGroupPM(members, groupName);
    openThread(group.id);
  }

  if (screen === "new") {
    return (
      <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="m-drawer-scrim" onClick={onClose} />
        <aside className="m-drawer nt-panel mp-panel" role="dialog" aria-modal="true" aria-label="New Conversation">
          <NewConversationScreenPM contacts={DM_THREADS_SEED_PM} picked={picked} onToggle={togglePick}
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
            <DSPM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
          </button>
          <h2 style={{ fontSize: "26px", fontWeight: "700" }}>Messages</h2>
          <button className="mp-compose" aria-label="New message" onClick={() => setScreen("new")}>
            <DSPM.IconifyIcon name="lucide:square-pen" size={20} color="var(--gray-900)" />
          </button>
        </header>
        <div className="mp-tabs" role="tablist" aria-label="Messages or voice conference">
          <button role="tab" aria-selected={tab === "messages"} className={"mp-tab" + (tab === "messages" ? " on" : "")} onClick={() => setTab("messages")}>
            <DSPM.IconifyIcon name="lucide:message-circle" size={16} color={tab === "messages" ? "var(--brand-navy)" : "var(--gray-450)"} />
            Messages
            {unreadTotal > 0 && <span className="mp-tab-badge">{unreadTotal}</span>}
          </button>
          <button role="tab" aria-selected={tab === "voice"} className={"mp-tab" + (tab === "voice" ? " on" : "")} onClick={() => setTab("voice")}>
            <DSPM.IconifyIcon name="lucide:phone" size={16} color={tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"} />
            Voice Conference
            <span className="mp-tab-badge">{VOICE_CONFS_SEED_PM.length}</span>
          </button>
        </div>
        <div className="nt-search mp-search">
          <DSPM.Icon name="search" size={20} color="var(--gray-450)" />
          <input type="text" placeholder="Search messages" aria-label="Search messages" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="nt-body mp-body">
          {tab === "messages" ?
          filtered.map((c) => <MessagesRowPM key={c.id} c={c} onOpen={() => openThread(c.id)} />) :
          VOICE_CONFS_SEED_PM.map((v) => <VoiceConfRowPM key={v.id} v={v} />)
          }
        </div>
      </aside>
    </div>);

}

function PMTabBar() {
  return (
    <nav className="pm-tabs" aria-label="Primary">
      {PM_TABS.map((t) =>
      <button key={t.key} className={"pm-tab" + (t.key === "Profile" ? " on" : "")}
      aria-current={t.key === "Profile" ? "page" : undefined}
      onClick={() => t.href && goPM(t.href)}>
          <span className="ic">
            <DSPM.IconifyIcon name={t.icon} size={23} color={t.key === "Profile" ? "var(--brand-navy)" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          {t.label}
        </button>
      )}
    </nav>);

}

const PM_STEPS_INIT = [
  { ti: "Add a profile photo", su: "Priority action", state: "priority" },
  { ti: "Write your bio", su: "Complete", state: "done" },
  { ti: "Add your location", su: "Complete", state: "done" },
  { ti: "Verify your credentials", su: "Incomplete", state: "todo" },
  { ti: "Connect your social profiles", su: "Incomplete", state: "todo" },
];

/* ---- Step sheet: Photo ---- */
function PhotoStep({ onComplete, isDone }) {
  const [chosen, setChosen] = useStatePM(null);
  return (
    <div className="pm-sheet-step">
      <div className="pm-sheet-av">
        <DSPM.Avatar name="Katy Wilson" src="assets/avatar-katy.jpg" size={88} />
        <span className="pm-sheet-av-edit"><DSPM.IconifyIcon name="lucide:camera" size={15} color="#fff" /></span>
      </div>
      {isDone && <p className="pm-sheet-note">Your profile photo is set. You can update it anytime.</p>}
      <div className="pm-sheet-opts">
        <button className={"pm-sheet-opt" + (chosen === "camera" ? " sel" : "")} onClick={() => setChosen("camera")}>
          <DSPM.IconifyIcon name="lucide:camera" size={22} color="var(--brand-navy)" /><span>Take a photo</span>
        </button>
        <button className={"pm-sheet-opt" + (chosen === "library" ? " sel" : "")} onClick={() => setChosen("library")}>
          <DSPM.IconifyIcon name="lucide:image" size={22} color="var(--brand-navy)" /><span>Choose from library</span>
        </button>
      </div>
      {chosen && <button className="pm-sheet-cta" onClick={onComplete}>Upload & Save Photo</button>}
    </div>
  );
}

/* ---- Step sheet: Bio ---- */
function BioStep({ onComplete }) {
  const [bio, setBio] = useStatePM(PM_ME.bio);
  const max = 300;
  return (
    <div className="pm-sheet-step">
      <p className="pm-sheet-desc">Write a short bio that tells people about your professional background and specialisations.</p>
      <div className="pm-sheet-field">
        <textarea className="pm-sheet-ta" value={bio} maxLength={max} rows={5}
          onChange={e => setBio(e.target.value)}
          placeholder="e.g. Aesthetic nurse with 10+ years experience in botox and dermal fillers…" />
        <span className="pm-sheet-count">{bio.length}/{max}</span>
      </div>
      <button className="pm-sheet-cta" onClick={onComplete} disabled={bio.trim().length < 10}>Save Bio</button>
    </div>
  );
}

/* ---- Step sheet: Location ---- */
function LocationStep({ onComplete }) {
  const [loc, setLoc] = useStatePM("London, United Kingdom");
  const [detecting, setDetecting] = useStatePM(false);
  function detect() {
    setDetecting(true);
    setTimeout(() => { setLoc("London, United Kingdom"); setDetecting(false); }, 1200);
  }
  return (
    <div className="pm-sheet-step">
      <p className="pm-sheet-desc">Add your location so patients and peers can find you.</p>
      <div className="pm-sheet-field">
        <input className="pm-sheet-inp" value={loc} onChange={e => setLoc(e.target.value)} placeholder="City, Country" />
      </div>
      <button className="pm-sheet-ghost" onClick={detect} disabled={detecting}>
        <DSPM.IconifyIcon name="lucide:map-pin" size={18} color="var(--brand-navy)" />
        {detecting ? "Detecting…" : "Use my current location"}
      </button>
      <button className="pm-sheet-cta" onClick={onComplete} disabled={loc.trim().length < 2}>Save Location</button>
    </div>
  );
}

/* ---- Step sheet: Credentials ---- */
function CredentialsStep({ onComplete }) {
  const [nmcNum, setNmcNum] = useStatePM("");
  const [submitted, setSubmitted] = useStatePM(false);
  if (submitted) {
    return (
      <div className="pm-sheet-step pm-sheet-center">
        <div className="pm-sheet-icon-wrap success"><DSPM.IconifyIcon name="lucide:clock" size={32} color="var(--success)" /></div>
        <h4>Verification Submitted</h4>
        <p className="pm-sheet-desc">Your credentials are under review. We'll notify you within 1–2 business days.</p>
        <button className="pm-sheet-cta" onClick={onComplete}>Got it</button>
      </div>
    );
  }
  return (
    <div className="pm-sheet-step">
      <p className="pm-sheet-desc">Enter your NMC or GMC registration number to verify your professional credentials.</p>
      <div className="pm-sheet-field">
        <label className="pm-sheet-label">NMC / GMC Number</label>
        <input className="pm-sheet-inp" value={nmcNum} onChange={e => setNmcNum(e.target.value)} placeholder="e.g. 12A3456B" />
      </div>
      <button className="pm-sheet-ghost">
        <DSPM.IconifyIcon name="lucide:upload" size={18} color="var(--brand-navy)" />Upload supporting documents
      </button>
      <button className="pm-sheet-cta" onClick={() => setSubmitted(true)} disabled={nmcNum.trim().length < 5}>Submit for Verification</button>
    </div>
  );
}

/* ---- Step sheet: Social profiles ---- */
const PM_SOCIALS = [
  { key: "linkedin", icon: "mdi:linkedin", color: "#0A66C2", label: "LinkedIn" },
  { key: "instagram", icon: "mdi:instagram", color: "#E1306C", label: "Instagram" },
  { key: "twitter", icon: "mdi:twitter", color: "#1DA1F2", label: "X / Twitter" },
  { key: "facebook", icon: "mdi:facebook", color: "#1877F2", label: "Facebook" },
];

function SocialStep({ onComplete }) {
  const [connected, setConnected] = useStatePM([]);
  function toggle(key) {
    setConnected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }
  return (
    <div className="pm-sheet-step">
      <p className="pm-sheet-desc">Link your social profiles to build trust and grow your network.</p>
      <div className="pm-sheet-socials">
        {PM_SOCIALS.map(s => {
          const on = connected.includes(s.key);
          return (
            <div key={s.key} className="pm-sheet-social">
              <DSPM.IconifyIcon name={s.icon} size={28} color={s.color} />
              <span className="pm-sheet-social-nm">{s.label}</span>
              <button className={"pm-sheet-social-btn" + (on ? " connected" : "")} onClick={() => toggle(s.key)}>
                {on ? "Connected" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
      {connected.length > 0 && <button className="pm-sheet-cta" onClick={onComplete}>Save Connections</button>}
    </div>
  );
}

/* ---- Bottom sheet wrapper ---- */
function StepSheet({ step, idx, onComplete, onClose }) {
  return (
    <div className="pm-sheet-overlay" onClick={onClose}>
      <div className="pm-sheet" onClick={e => e.stopPropagation()}>
        <div className="pm-sheet-drag" />
        <div className="pm-sheet-hd">
          <h3>{step.ti}</h3>
          <button className="pm-sheet-close" onClick={onClose} aria-label="Close">
            <DSPM.IconifyIcon name="lucide:x" size={20} color="var(--gray-600)" />
          </button>
        </div>
        <div className="pm-sheet-body">
          {idx === 0 && <PhotoStep onComplete={onComplete} isDone={step.state === "done"} />}
          {idx === 1 && <BioStep onComplete={onComplete} isDone={step.state === "done"} />}
          {idx === 2 && <LocationStep onComplete={onComplete} isDone={step.state === "done"} />}
          {idx === 3 && <CredentialsStep onComplete={onComplete} isDone={step.state === "done"} />}
          {idx === 4 && <SocialStep onComplete={onComplete} isDone={step.state === "done"} />}
        </div>
      </div>
    </div>
  );
}

/* ---- Profile complete success banner ---- */
function ProfileCompleteCard({ onDismiss }) {
  useEffectPM(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="pm-steps-success" aria-live="polite">
      <div className="pm-steps-success-icon">
        <DSPM.IconifyIcon name="lucide:check" size={36} color="#fff" />
      </div>
      <h3 className="pm-steps-success-h">Profile Complete!</h3>
      <p className="pm-steps-success-sub">Your profile is fully set up. You're ready to connect with the community.</p>
      <button className="pm-steps-success-btn" onClick={onDismiss}>Got it</button>
    </div>
  );
}

/* ---- Profile steps card ---- */
function ProfileSteps() {
  const [steps, setSteps] = useStatePM(() => PM_STEPS_INIT.map(s => ({ ...s })));
  const [activeIdx, setActiveIdx] = useStatePM(null);
  const [dismissed, setDismissed] = useStatePM(false);
  const [exiting, setExiting] = useStatePM(false);

  const total = steps.length;
  const done = steps.filter(s => s.state === "done").length;
  const allDone = done === total;
  const pct = Math.round((done / total) * 100);

  function markDone(idx) {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, state: "done", su: "Complete" } : s));
    setActiveIdx(null);
  }

  function handleDismiss() {
    setExiting(true);
    setTimeout(() => setDismissed(true), 400);
  }

  if (dismissed) return null;

  if (allDone) {
    return (
      <div className={"pm-steps-wrap" + (exiting ? " pm-steps-exit" : "")}>
        <ProfileCompleteCard onDismiss={handleDismiss} />
      </div>
    );
  }

  return (
    <>
      <section className="pm-steps" aria-label="Complete your profile">
        <h3 className="pm-steps-h">Complete your profile</h3>
        <p className="pm-steps-sub">{done} of {total} steps complete</p>
        <div className="pm-steps-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <span className="pm-steps-fill" style={{ width: pct + "%" }}></span>
        </div>
        <p className="pm-steps-pct">{pct}% complete</p>
        <div className="pm-steps-list">
          {steps.map((s, i) => (
            <button className={"pm-step " + s.state} key={i} onClick={() => setActiveIdx(i)}>
              <span className="pm-step-mark" aria-hidden="true">
                {s.state === "done"
                  ? <DSPM.IconifyIcon name="lucide:check" size={18} color="#fff" />
                  : <span className="dot"></span>}
              </span>
              <span className="pm-step-txt">
                <span className="ti">{s.ti}</span>
                <span className="su">{s.su}</span>
              </span>
              <DSPM.IconifyIcon name="lucide:chevron-right" size={18} color="var(--gray-400)" />
            </button>
          ))}
        </div>
      </section>
      {activeIdx !== null && (
        <StepSheet
          step={steps[activeIdx]}
          idx={activeIdx}
          onComplete={() => markDone(activeIdx)}
          onClose={() => setActiveIdx(null)}
        />
      )}
    </>
  );
}

function PMSection({ title, children }) {
  return (
    <section className="pm-sec">
      <div className="pm-sec-h">
        <h2>{title}</h2>
        <span className="pm-sec-tools">
          <button className="pm-tool" aria-label={"Add to " + title}><DSPM.IconifyIcon name="lucide:plus" size={19} color="var(--brand-navy)" /></button>
          <button className="pm-tool" aria-label={"Edit " + title}><DSPM.Icon name="edit" size={17} color="var(--brand-navy)" /></button>
        </span>
      </div>
      {children}
    </section>);

}

function PMMentor() {
  const [done, setDone] = useStatePM(false);
  if (done) return null;
  return (
    <div className="pm-mentor">
      <div className="pm-mentor-hd">
        <DSPM.IconifyIcon name="fluent:people-team-16-filled" size={22} color="var(--ai-purple)" />
        <span className="t">Find a mentor</span>
      </div>
      <p className="s">Connecting with a mentor can accelerate your professional growth.</p>
      <div className="pm-mentor-act">
        <button className="no" onClick={() => setDone(true)}><DSPM.IconifyIcon name="lucide:x" size={18} color="var(--error)" />No</button>
        <button className="yes" onClick={() => setDone(true)}><DSPM.IconifyIcon name="lucide:check" size={18} color="var(--success)" />Yes</button>
      </div>
    </div>);

}

function PMPost({ p }) {
  const lines = p.body.split("\n");
  return (
    <article className="pm-post">
      <div className="pm-post-hd">
        <DSPM.Avatar name={p.name} src={p.avatar} size={42} />
        <div className="pm-post-by">
          <span className="nm">{p.name}<span className="loc">{p.loc}</span></span>
          <span className="tm">{p.time}</span>
        </div>
        <button className="pm-post-more" aria-label="More options"><DSPM.IconifyIcon name="lucide:more-horizontal" size={20} color="var(--gray-450)" /></button>
      </div>
      <h3 className="pm-post-ttl">{p.title}</h3>
      <p className="pm-post-body">{lines[0]}{lines[1] && <span className="tags"> {lines[1]}</span>}</p>
      <div className="pm-post-eng">
        <span><DSPM.IconifyIcon name="lucide:thumbs-up" size={17} color="var(--gray-500)" />{p.likes}</span>
        <span><DSPM.IconifyIcon name="lucide:message-circle" size={17} color="var(--gray-500)" />{p.comments}</span>
        <span><DSPM.IconifyIcon name="lucide:share-2" size={17} color="var(--gray-500)" />{p.shares}</span>
      </div>
    </article>);

}

function PMActivity() {
  return (
    <section className="pm-sec">
      <div className="pm-sec-h"><h2 style={{ fontSize: "20px" }}>Activity</h2></div>
      <div className="pm-activity">
        {PM_ACTIVITY.map((p, i) => <PMPost key={i} p={p} />)}
      </div>
      <button className="pm-showall" onClick={() => goPM("NewsfeedMobile.html")}>Show all posts</button>
    </section>);

}

function useDeviceScalePM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStatePM(calc);
  useEffectPM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobilePM() {
  const [mobile, setMobile] = useStatePM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectPM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function PMScreen() {
  const m = PM_ME;
  const [msgOpen, setMsgOpen] = useStatePM(false);
  const [menuOpen, setMenuOpen] = useStatePM(false);
  return (
    <div className="pm-screen" data-screen-label="Profile (mobile)">
          <PMTopBar onMenu={() => setMenuOpen(true)} onMessages={() => setMsgOpen(true)} />
          <div className="pm-scroll">
            <div className="pm-ig">
              <div className="pm-ig-top">
                <div className="pm-ig-avwrap">
                  <DSPM.Avatar name={m.name} src={m.avatar} size={92} className="pm-ig-av" />
                </div>
                <div className="pm-ig-stats">
                  <div className="pm-ig-stat"><span className="n">{m.posts}</span><span className="l">posts</span></div>
                  <div className="pm-ig-stat"><span className="n">{m.followers}</span><span className="l">followers</span></div>
                  <div className="pm-ig-stat"><span className="n">{m.following}</span><span className="l">following</span></div>
                </div>
              </div>

              <div className="pm-ig-name">
                <span className="nm">{m.name}</span>
                <span className="pn">{m.role}</span>
                <DSPM.VerificationSeals seals={["verified", "crown", "gold"]} size={20} />
                <PMSealBadge src="assets/badge-m.svg" alt="Mastery badge" label="Mastery Badge" width={20} height={20} style={{ marginLeft: -5 }} />
                <PMSealBadge src="assets/badge-skinfluencer.png" alt="PROfinity Skinfluencer badge" label="Skinfluencer" width={20} height={22} style={{ marginLeft: -5 }} />
              </div>

              <div className="pm-ig-bio">
                <p><span className="bi">🇬🇧</span> Aesthetic Nurse Practitioner</p>
                <p><span className="bi">💉</span> Botox · Fillers · Lip Enhancement</p>
                <p>{m.bio}</p>
              </div>
              <a className="pm-ig-link" href="#" onClick={(e) => e.preventDefault()}>
                <DSPM.IconifyIcon name="lucide:link" size={17} color="var(--ai-purple)" />allcaremedical.co.uk
              </a>

              <div className="pm-ig-chips">
                <span className="pm-chip"><DSPM.IconifyIcon name="lucide:map-pin" size={16} color="var(--brand-navy)" />{m.location}</span>
                <span className="pm-chip"><DSPM.IconifyIcon name="lucide:building-2" size={16} color="var(--brand-navy)" />{m.clinic}</span>
                <span className="pm-chip add"><DSPM.IconifyIcon name="lucide:plus" size={16} color="var(--gray-500)" />Add</span>
              </div>

              <div className="pm-ig-actions">
                <button className="pm-ig-btn" onClick={() => goPM("ProfileMobile.html")}>Edit Profile</button>
                <button className="pm-ig-btn navy">Share Profile</button>
                <button className="pm-ig-btn icon" aria-label="Settings" onClick={() => goPM("AccountSettings.html")}>
                  <DSPM.IconifyIcon name="lucide:settings" size={20} color="var(--text-heading)" />
                </button>
              </div>
            </div>
            <ProfileSteps />
            <PMMentor />
            <PMActivity />

            <PMSection title="Services">
              {PM_SERVICES.map((s, i) =>
              <div className="pm-lrow" key={i}>
                  <div className="ti">{s.ti}</div>
                  <div className="su">{s.su}</div>
                </div>
              )}
            </PMSection>

            <PMSection title="Experience">
              {PM_EXPERIENCE.map((e, i) =>
              <div className="pm-lrow" key={i}>
                  <div className="ti">{e.ti}</div>
                  <div className="su">{e.yrs}</div>
                  <div className="su">{e.org}</div>
                  <div className="su flag"><span className="fl">🇬🇧</span>{e.loc}</div>
                </div>
              )}
            </PMSection>

            <PMSection title="Education">
              <div className="pm-lrow media">
                <div className="pm-logo">JH</div>
                <div className="meta">
                  <div className="ti">Johns Hopkins University of USA</div>
                  <div className="su">Clinical Foundations of Medicine</div>
                  <div className="su">1990 - 2020</div>
                </div>
              </div>
            </PMSection>

            <PMSection title="Licenses & Certifications">
              {PM_LICENSES.map((l, i) =>
              <div className="pm-lrow media" key={i}>
                  <div className="pm-logo cert">P</div>
                  <div className="meta">
                    <div className="ti">{l}</div>
                    <div className="su">Profinity Academy</div>
                    <div className="su muted">Issued January 2008</div>
                  </div>
                </div>
              )}
            </PMSection>

            <PMSection title="Language">
              <div className="pm-lrow">
                <div className="pm-lang"><span className="fl">🇬🇧</span><div><div className="ti">English (UK)</div><div className="su">Primary</div></div></div>
              </div>
              <div className="pm-lrow">
                <div className="pm-lang"><span className="fl">🇮🇹</span><div><div className="ti">Italian</div><div className="su">Secondary</div></div></div>
              </div>
            </PMSection>

            <button className="pm-logout" onClick={() => goPM("NewsfeedMobile.html")}>
              <DSPM.IconifyIcon name="lucide:log-out" size={20} color="var(--error)" />Logout
            </button>
          </div>
          <PMTabBar />
          <MessagesPanelPM open={msgOpen} onClose={() => setMsgOpen(false)} />
          <SideMenuPM open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>);

}

function ProfileMobileApp() {
  const mobile = useIsMobilePM();
  const scale = useDeviceScalePM();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}><PMScreen /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><PMScreen /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ProfileMobileApp />);
