/* ===========================================================================
   PROfinity — Home (Newsfeed) · iPhone 17 Pro Max mobile
   Reuses the desktop Feed (window.PFApp.Feed — full reaction/comment/animation
   stack) inside the IOSDevice frame, with a mobile top bar + bottom tab bar.
   Shares one global scope with app.jsx, so names here are suffixed -M.
   =========================================================================== */
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM, useLayoutEffect: useLayoutEffectM, forwardRef: forwardRefM } = React;
const DSM = window.ProfinityDesignSystem_c2b5cc;
const PFAM = window.PFApp;

function go(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

const M_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: null },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "AgentMobile.html" }];


const PUSH_NOTIF = {
  app: "PROfinity Academy",
  icon: "assets/profinity-icon.jpg",
  title: "Weekly Rewards are here!",
  body: "Your weekly rewards have been calculated. Open the app to claim your bonuses before they expire this Sunday.",
  cta: "Claim Rewards"
};

function PushNotifBanner() {
  const [open, setOpen] = useStateM(true);
  const [expanded, setExpanded] = useStateM(false);
  useEffectM(() => {
    if (expanded) return;
    const t = setTimeout(() => setOpen(false), 7000);
    return () => clearTimeout(t);
  }, [expanded]);
  if (!open) return null;
  return (
    <div className={"m-push" + (expanded ? " expanded" : "")} role="alert"
      aria-label={PUSH_NOTIF.title} onClick={() => setExpanded((e) => !e)}>
      <div className="m-push-row">
        <img className="m-push-icon" src={PUSH_NOTIF.icon} alt="" />
        <span className="m-push-app">{PUSH_NOTIF.app}</span>
        <span style={{ flex: 1 }} />
        <span className="m-push-time">now</span>
      </div>
      <div className="m-push-title">{PUSH_NOTIF.title}</div>
      <p className="m-push-body">{PUSH_NOTIF.body}</p>
      {expanded &&
      <div className="m-push-actions">
          <button className="m-push-cta" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>{PUSH_NOTIF.cta}</button>
          <button className="m-push-dismiss" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>Dismiss</button>
        </div>
      }
      <span className="m-push-handle" role="button" aria-label="Dismiss notification"
        onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
    </div>);

}

const MTopBar = forwardRefM(function MTopBar({ onMenu, onBell, onMessages, hidden }, ref) {
  const [showNotif, setShowNotif] = useStateM(true);
  useEffectM(() => {
    const t = setTimeout(() => setShowNotif(false), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <header ref={ref} className={"m-top" + (hidden ? " m-top-hidden" : "")}>
      <button className="m-burger" aria-label="Menu" onClick={onMenu}><DSM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img className="m-logo-light" src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      <img className="m-logo-dark" src="assets/profinity-academy-logo-dark.jpg" alt="PROfinity Academy" />
      <span className="grow" />
      <button className="m-iconbtn" aria-label="Search" onClick={() => go("SearchMobile.html")}><DSM.Icon name="search" size={20} color="var(--brand-navy)" /></button>
      <button className="m-iconbtn" aria-label="Notifications" onClick={() => {setShowNotif(false);onBell && onBell();}}>
        <DSM.IconifyIcon name="lucide:bell" size={20} color="var(--brand-navy)" />
        <span className="dot">12</span>
      </button>
      <button className="m-iconbtn" aria-label="Messages" onClick={() => { setShowNotif(false); onMessages && onMessages(); }}>
        <DSM.IconifyIcon name="lucide:message-circle" size={20} color="var(--brand-navy)" />
        <span className="dot">12</span>
      </button>
      {showNotif &&
      <div className="m-notif" role="status" onClick={() => setShowNotif(false)}>
          <span className="m-notif-item"><DSM.IconifyIcon name="lucide:message-circle" size={17} color="var(--white)" />71</span>
          <span className="m-notif-sep" />
          <span className="m-notif-item"><DSM.IconifyIcon name="lucide:heart" size={17} color="var(--white)" />179</span>
          <span className="m-notif-sep" />
          <span className="m-notif-item"><DSM.IconifyIcon name="lucide:user-plus" size={17} color="var(--white)" />48</span>
        </div>
      }
    </header>);

});

const SM_CHANNELS = [
{ label: "Clinical Chat", icon: "lucide:stethoscope", n: 10 },
{ label: "Freedom Path", icon: "lucide:feather", n: 2 },
{ label: "Tech Team", icon: "lucide:cpu", n: 1 },
{ label: "Business & Mindset", icon: "lucide:briefcase", n: 5 }];

const SM_RESOURCES = [
{ label: "Videos", icon: "lucide:square-play", n: 8 },
{ label: "Articles", icon: "lucide:feather", n: 4 },
{ label: "Webinars", icon: "lucide:calendar", n: 3 }];

const SM_COURSES = [
{ label: "Face Anatomy Masterclass", pct: 72 },
{ label: "Lip Filler Techniques", pct: 45 },
{ label: "Advanced Botox Training", pct: 20 }];

const SM_EVENTS = [
{ d: "30", m: "JUN", label: "Technique Tuesday Webinar", t: "8:00 PM", tag: "NEW" },
{ d: "5", m: "JUL", label: "Confidence Masterclass", t: "6:00 PM" },
{ d: "12", m: "JUL", label: "Business Growth Workshop", t: "7:00 PM" }];

const SM_PROFILE_BEFORE = [
{ label: "Edit Profile",       icon: "lucide:book-open",       href: "ProfileMobile.html" },
{ label: "Account Settings",   icon: "lucide:graduation-cap",  href: null },
{ label: "Notifications",      icon: "lucide:calendar",        href: "NotificationSettings.html" }];

const SM_PROFILE_AFTER = [
{ label: "Privacy & Security", icon: "lucide:book-open",       href: null },
{ label: "Admin Panel",        icon: "lucide:shield",          href: "AdminPanel.html" }];

const NOTIFS = {
  "New": [
  { who: "PROfinity Academy", avatar: "assets/profinity-icon.jpg", action: "Weekly Rewards are here! 🎉", detail: "Your weekly rewards have been calculated — claim your bonuses before they expire this Sunday.", t: "Just now", type: "reward", cta: "Claim Rewards" },
  { who: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", action: "commented on your post", detail: "\"This is a nice article Katy!\"", t: "Just now", type: "comment" },
  { who: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", action: "liked on your comment", detail: "\"Full-Face Rejuvenation Increased Patient Satisfaction +64%\"", t: "2h", type: "love" }],
  "Yesterday": [
  { who: "Jane Harries", avatar: null, action: "booked new appointment", detail: "February 12, 2026, 6:00 PM", t: "1d", rsvp: true, type: "appointment" }],
  "Older": [
  { who: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", action: "commented on your post", detail: "\"This is a nice article Katy!\"", t: "3w", type: "comment" },
  { who: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", action: "liked on your comment", detail: "\"Full-Face Rejuvenation Increased Patient Satisfaction +64%\"", t: "4w", type: "love" }]
};

const SUGGESTED_POSTS = [
  { who: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", t: "1h", text: "The 3 biggest mistakes injectors make with lip filler — and how to fix them fast.", img: "assets/post1-img1.png", likes: 142, comments: 38, tag: "Technique" },
  { who: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", t: "3h", text: "Patient confidence scores went up 64% after full-face rejuvenation. Here's what changed.", img: null, likes: 89, comments: 22, tag: "Case Study" },
  { who: "Jane Harries", avatar: null, t: "5h", text: "Just finished the Advanced Botox Training module. The dosing charts are absolute game-changers.", img: "assets/post2-img1.png", likes: 54, comments: 11, tag: "Learning" }
];

const NT_BADGE = {
  comment: { icon: "fluent:chat-16-filled", bg: "var(--brand-navy)" },
  love: { icon: "fluent:heart-16-filled", bg: "var(--reaction-love)" },
  like: { icon: "fluent:thumb-like-16-filled", bg: "var(--reaction-like)" },
  follow: { icon: "fluent:person-add-16-filled", bg: "var(--ai-purple)" },
  appointment: { icon: "fluent:calendar-checkmark-16-filled", bg: "var(--success)" },
  reward: { icon: "fluent:gift-16-filled", bg: "var(--premium-orange)" }
};

const NT_MENU = [
{ label: "Turn off notifications like this", icon: "lucide:bell-off" },
{ label: "Mute this notification", icon: "lucide:volume-x" },
{ label: "Hide this notification", icon: "lucide:eye-off" },
{ label: "Report a problem", icon: "lucide:flag" },
{ label: "Notification settings", icon: "lucide:settings" }];

function NotifRow({ n }) {
  const b = NT_BADGE[n.type];
  const [menu, setMenu] = useStateM(false);
  useEffectM(() => {
    if (!menu) return;
    const close = () => setMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menu]);
  return (
    <div className="nt-row">
      <span className="nt-av">
        <DSM.Avatar name={n.who} src={n.avatar} size={58} />
        {b && <span className="nt-badge" style={{ background: b.bg }}>
          <DSM.IconifyIcon name={b.icon} size={15} color="#fff" />
        </span>}
      </span>
      <div className="nt-main">
        <div className="nt-text"><b>{n.who}</b> <span className="nt-action">{n.action}</span> {n.detail && <span className="nt-q">{n.detail}</span>}</div>
        <div className="nt-time">{n.t}</div>
        {n.rsvp &&
        <div className="nt-rsvp">
            <button className="nt-reject">Reject</button>
            <button className="nt-accept">Accept</button>
          </div>
        }
        {n.cta &&
        <div className="nt-rsvp">
            <button className="nt-accept">{n.cta}</button>
          </div>
        }
      </div>
      <div className="nt-more-wrap">
        <button className="nt-more" aria-label="More options" aria-haspopup="menu" aria-expanded={menu}
        onClick={(e) => {e.stopPropagation();setMenu((m) => !m);}}>
          <DSM.IconifyIcon name="lucide:more-vertical" size={20} color="var(--gray-450)" />
        </button>
        {menu &&
        <div className="nt-menu" role="menu" onClick={(e) => e.stopPropagation()}>
            {NT_MENU.map((m) =>
          <button key={m.label} className="nt-menu-item" role="menuitem" onClick={() => setMenu(false)}>
                <DSM.IconifyIcon name={m.icon} size={19} color="var(--gray-700)" />
                {m.label}
              </button>
          )}
          </div>
        }
      </div>
    </div>);

}

function SuggestedPostCard({ p }) {
  return (
    <div className="nt-sp-card">
      {p.img &&
      <div className="nt-sp-thumb">
        <img src={p.img} alt="" />
      </div>
      }
      <div className="nt-sp-body">
        <div className="nt-sp-author">
          <DSM.Avatar name={p.who} src={p.avatar} size={22} />
          <span className="nt-sp-name">{p.who}</span>
          <span className="nt-sp-time">{p.t}</span>
        </div>
        <p className="nt-sp-text">{p.text}</p>
        <div className="nt-sp-meta">
          <span className="nt-sp-tag">{p.tag}</span>
          <span className="nt-sp-stats">
            <DSM.IconifyIcon name="fluent:heart-16-filled" size={13} color="var(--reaction-love)" />
            {p.likes}
            <DSM.IconifyIcon name="fluent:chat-16-filled" size={13} color="var(--gray-400)" />
            {p.comments}
          </span>
        </div>
      </div>
    </div>);
}

function NotificationsPanel({ open, onClose }) {
  return (
    <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="m-drawer-scrim" onClick={onClose} />
      <aside className="m-drawer nt-panel" role="dialog" aria-modal="true" aria-label="Notifications">
        <header className="nt-head">
          <button className="nt-back" aria-label="Back" onClick={onClose}>
            <DSM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
          </button>
          <h2 style={{ fontSize: "26px", fontWeight: "700" }}>Notifications</h2>
        </header>
        <div className="nt-search">
          <DSM.Icon name="search" size={20} color="var(--gray-450)" />
          <input type="text" placeholder="Search notifications" aria-label="Search notifications" />
        </div>
        <div className="nt-body">
          {Object.keys(NOTIFS).map((sec) =>
          <div key={sec} className="nt-group">
              <div className="nt-sec-h">{sec.toUpperCase()}{sec === "New" && <span className="nt-sec-dot" />}</div>
              {NOTIFS[sec].map((n, i) => <NotifRow key={i} n={n} />)}
            </div>
          )}
          <div className="nt-suggested">
            <div className="nt-suggested-head">
              <span>SUGGESTED FOR YOU</span>
              <button className="nt-suggested-see">See all</button>
            </div>
            <div className="nt-sp-scroll">
              {SUGGESTED_POSTS.map((p, i) => <SuggestedPostCard key={i} p={p} />)}
            </div>
          </div>
        </div>
      </aside>
    </div>);

}

const DM_THREADS_SEED = [
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


const VOICE_CONFS_SEED = [
{ id: "vc1", name: "Clinical Case Review", who: "Dr Tim Pearce, Dr Sarah Kim +3", t: "Today, 4:00 PM", live: true },
{ id: "vc2", name: "Business Growth Sync", who: "Miranda Pearce, Dr Alex Chen", t: "Tomorrow, 10:00 AM", live: false }];

const PF_GROUPS_KEY = "pf-dm-groups";

function readDmGroupsM() {
  try { return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || []; } catch (e) { return []; }
}

function groupDisplayNameM(members) {
  const names = members.map((m) => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}

function createDmGroupM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = { id: "group-" + Date.now(), isGroup: true, customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNameM(members), members, messages: [] };
  const groups = readDmGroupsM();
  groups.unshift(group);
  try { localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups)); } catch (e) {}
  return group;
}

function GroupAvatarStackM({ members, size }) {
  const s = size || 52;
  return (
    <span className="mp-group-av" style={{ width: s, height: s }}>
      {members.slice(0, 2).map((m, i) =>
        <span className="mp-group-av-item" key={m.id || i}>
          <DSM.Avatar name={m.name} src={m.avatar} size={Math.round(s * 0.68)} />
        </span>
      )}
    </span>);
}

function MessagesRow({ c, onOpen }) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return (
    <button className="mp-row" onClick={onOpen}>
      <span className="mp-av">
        {c.isGroup ?
        <GroupAvatarStackM members={c.members} /> :

        <>
            <DSM.Avatar name={c.name} src={c.avatar} size={52} />
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
          <DSM.IconifyIcon name="lucide:bell-off" size={16} color="var(--gray-450)" /> :
          c.unread > 0 &&
          <span className="mp-badge">{c.unread}</span>
          }
        </span>
      </span>
    </button>);

}

function NewConversationScreenM({ contacts, picked, onToggle, query, onQuery, groupName, onGroupName, onBack, onCreate }) {
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const count = picked.length;
  return (
    <div className="mp-new" data-screen-label="New Conversation">
      <header className="nt-head">
        <button className="nt-back" aria-label="Back to messages" onClick={onBack}>
          <DSM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>New Conversation</h2>
      </header>
      <div className="nt-search mp-search">
        <DSM.Icon name="search" size={20} color="var(--gray-450)" />
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
              <span className="mp-av"><DSM.Avatar name={c.name} src={c.avatar} size={44} /></span>
              <span className="mp-new-name">{c.name}</span>
              <span className={"mp-new-check" + (on ? " on" : "")}>
                {on && <DSM.IconifyIcon name="lucide:check" size={13} color="#fff" />}
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

function VoiceConfRow({ v }) {
  return (
    <div className="mp-row mp-vc-row">
      <span className="mp-av mp-vc-icon">
        <DSM.IconifyIcon name="lucide:phone-call" size={22} color="var(--brand-navy)" />
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

function MessagesPanel({ open, onClose }) {
  const [tab, setTab] = useStateM("messages");
  const [query, setQuery] = useStateM("");
  const [screen, setScreen] = useStateM("list");
  const [groups, setGroups] = useStateM([]);
  const [picked, setPicked] = useStateM([]);
  const [ncQuery, setNcQuery] = useStateM("");
  const [groupName, setGroupName] = useStateM("");
  useEffectM(() => {
    if (!open) { setQuery(""); setScreen("list"); setPicked([]); setNcQuery(""); setGroupName(""); } else
    { setGroups(readDmGroupsM()); }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED];
  const filtered = allThreads.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED.reduce((n, t) => n + (t.unread || 0), 0);

  function openThread(id) {
    go("DirectMessage.html?id=" + id + "&from=NewsfeedMobile.html");
  }

  function togglePick(id) {
    setPicked((all) => all.includes(id) ? all.filter((x) => x !== id) : [...all, id]);
  }

  function handleCreate() {
    if (picked.length === 0) return;
    if (picked.length === 1) { openThread(picked[0]); return; }
    const members = DM_THREADS_SEED.
    filter((c) => picked.includes(c.id)).
    map((c) => ({ id: c.id, name: c.name, avatar: c.avatar }));
    const group = createDmGroupM(members, groupName);
    openThread(group.id);
  }

  if (screen === "new") {
    return (
      <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="m-drawer-scrim" onClick={onClose} />
        <aside className="m-drawer nt-panel mp-panel" role="dialog" aria-modal="true" aria-label="New Conversation">
          <NewConversationScreenM contacts={DM_THREADS_SEED} picked={picked} onToggle={togglePick}
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
            <DSM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
          </button>
          <h2 style={{ fontSize: "26px", fontWeight: "700" }}>Messages</h2>
          <button className="mp-compose" aria-label="New message" onClick={() => setScreen("new")}>
            <DSM.IconifyIcon name="lucide:square-pen" size={20} color="var(--gray-900)" />
          </button>
        </header>
        <div className="mp-tabs" role="tablist" aria-label="Messages or voice conference">
          <button role="tab" aria-selected={tab === "messages"} className={"mp-tab" + (tab === "messages" ? " on" : "")} onClick={() => setTab("messages")}>
            <DSM.IconifyIcon name="lucide:message-circle" size={16} color={tab === "messages" ? "var(--brand-navy)" : "var(--gray-450)"} />
            Messages
            {unreadTotal > 0 && <span className="mp-tab-badge">{unreadTotal}</span>}
          </button>
          <button role="tab" aria-selected={tab === "voice"} className={"mp-tab" + (tab === "voice" ? " on" : "")} onClick={() => setTab("voice")}>
            <DSM.IconifyIcon name="lucide:phone" size={16} color={tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"} />
            Voice Conference
            <span className="mp-tab-badge">{VOICE_CONFS_SEED.length}</span>
          </button>
        </div>
        <div className="nt-search mp-search">
          <DSM.Icon name="search" size={20} color="var(--gray-450)" />
          <input type="text" placeholder="Search messages" aria-label="Search messages" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="nt-body mp-body">
          {tab === "messages" ?
          filtered.map((c) => <MessagesRow key={c.id} c={c} onOpen={() => openThread(c.id)} />) :

          VOICE_CONFS_SEED.map((v) => <VoiceConfRow key={v.id} v={v} />)
          }
        </div>
      </aside>
    </div>);

}

function useDarkModeM() {
  const [dark, setDark] = useStateM(() => {
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

function SmDarkSwitch({ on, onToggle }) {
  return (
    <button
      className={"sm-switch" + (on ? " on" : "")}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={on ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sm-knob">
        {on && <DSM.IconifyIcon name="lucide:moon" size={13} color="#1A1736" />}
      </span>
    </button>
  );
}

function SmDisplayCard({ dark, onToggle }) {
  return (
    <div className="sm-display-card">
      <div className="sm-display-top">
        <span className="sm-display-label">Display</span>
        <SmDarkSwitch on={dark} onToggle={onToggle} />
      </div>
      <p className="sm-display-desc">
        Adjust the appearance of the app to reduce glare and give your eyes a break
      </p>
    </div>
  );
}

function SmSection({ title }) {
  return <div className="sm-sec-h">{title}</div>;
}

function SideMenu({ open, onClose }) {
  const [dark, toggleDark] = useDarkModeM();
  return (
    <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="m-drawer-scrim" onClick={onClose} />
      <aside className="m-drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <button className="m-drawer-profile" onClick={() => go("ProfileMobile.html")}>
          <DSM.Avatar name={PFAM.ME.name} src={PFAM.ME.avatar} size={56} />
          <span className="m-dp-main">
            <span className="m-dp-name">Katy Wilson
              <DSM.IconifyIcon name="lucide:badge-check" size={18} color="var(--reaction-like)" />
            </span>
            <span className="m-dp-role">Registered Nurse</span>
          </span>
          <DSM.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-800)" />
        </button>

        <div className="sm-body">
          <SmSection title="Communities" />
          <button className="sm-tier" onClick={() => go("CommunityMobile.html")}>
            <span className="sm-tier-top">
              <span className="sm-tier-name">Confidence Path</span>
              <span className="sm-tier-pill">YOUR TIER</span>
            </span>
            <span className="sm-tier-sub">Exclusive tier content</span>
            <span className="sm-tier-new">3 new posts</span>
          </button>
          <nav className="sm-list">
            {SM_CHANNELS.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => go("CommunityMobile.html")}>
                <DSM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
                <span className="sm-badge sm-badge-red">{c.n}</span>
              </button>
            )}
          </nav>

          <SmSection title="Membership Resources" />
          <nav className="sm-list">
            {SM_RESOURCES.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => go("MyLearning.html")}>
                <DSM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
                <span className="sm-badge sm-badge-gray">{c.n}</span>
              </button>
            )}
          </nav>

          <SmSection title="My Courses" />
          <div className="sm-courses">
            {SM_COURSES.map((c) =>
            <button key={c.label} className="sm-course" onClick={() => go("MyLearning.html")}>
                <span className="sm-course-top">
                  <span className="sm-course-thumb">
                    <DSM.IconifyIcon name="lucide:image" size={20} color="var(--gray-400)" />
                  </span>
                  <span className="sm-course-name">{c.label}</span>
                </span>
                <span className="sm-progress"><span className="sm-progress-fill" style={{ width: c.pct + "%" }} /></span>
                <span className="sm-course-pct">{c.pct}% complete</span>
              </button>
            )}
          </div>

          <SmSection title="Upcoming Events" />
          <div className="sm-events">
            {SM_EVENTS.map((e) =>
            <button key={e.label} className="sm-event" onClick={() => go("EventsMobile.html")}>
                <span className="sm-date"><b>{e.d}</b><i>{e.m}</i></span>
                <span className="sm-event-main">
                  <span className="sm-event-name">{e.label}</span>
                  <span className="sm-event-time">{e.t}</span>
                </span>
                {e.tag && <span className="sm-event-tag">{e.tag}</span>}
              </button>
            )}
          </div>

          <SmSection title="My Profile" />
          <button className="sm-row sm-verify" onClick={() => go("ProfileMobile.html")}>
            <DSM.IconifyIcon name="lucide:book-open" size={23} color="var(--premium-orange)" />
            <span className="sm-row-label">Verify Profile</span>
            <span className="sm-verify-pill">Not Verified</span>
          </button>
          <nav className="sm-list">
            {SM_PROFILE_BEFORE.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => c.href && go(c.href)}>
                <DSM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
                <DSM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </button>
            )}
          </nav>

          <SmDisplayCard dark={dark} onToggle={toggleDark} />

          <nav className="sm-list">
            {SM_PROFILE_AFTER.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => c.href && go(c.href)}>
                <DSM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label">{c.label}</span>
                <DSM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
              </button>
            )}
          </nav>

          <button className="m-drawer-logout" onClick={onClose}>
            <DSM.IconifyIcon name="lucide:log-out" size={22} color="var(--error)" />
            Logout
          </button>
        </div>
      </aside>
    </div>);

}

const MTabBar = forwardRefM(function MTabBar({ hidden }, ref) {
  return (
    <nav ref={ref} className={"m-tabs" + (hidden ? " m-tabs-hidden" : "")} aria-label="Primary">
      {M_TABS.map((t) =>
      <button key={t.key} className={"m-tab" + (t.key === "Home" ? " on" : "")}
      aria-current={t.key === "Home" ? "page" : undefined}
      onClick={() => t.href && go(t.href)}>
          <span className="ic">
            <DSM.IconifyIcon name={t.icon} size={24} color={t.key === "Home" ? "var(--brand-navy)" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          {t.label}
        </button>
      )}
    </nav>);

});

function useHeaderHideM(scrollRef) {
  const [hidden, setHidden] = useStateM(false);
  useEffectM(() => {
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

function MobileHome() {
  const [menuOpen, setMenuOpen] = useStateM(false);
  const [notifOpen, setNotifOpen] = useStateM(false);
  const [msgOpen, setMsgOpen] = useStateM(false);
  const scrollRefM = useRefM(null);
  const headerRefM = useRefM(null);
  const tabsRefM = useRefM(null);
  const [headerH, setHeaderH] = useStateM(0);
  const [tabsH, setTabsH] = useStateM(0);
  const chromeHidden = useHeaderHideM(scrollRefM);
  useLayoutEffectM(() => {
    const el = headerRefM.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffectM(() => {
    const el = tabsRefM.current;
    if (!el) return;
    const measure = () => setTabsH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="m-screen" data-screen-label="Home (mobile)">
      <PushNotifBanner />
      <MTopBar ref={headerRefM} hidden={chromeHidden} onMenu={() => setMenuOpen(true)} onBell={() => setNotifOpen(true)} onMessages={() => setMsgOpen(true)} />
      <div className="m-scroll" ref={scrollRefM} style={{ paddingTop: chromeHidden ? 0 : headerH, paddingBottom: chromeHidden ? 0 : tabsH }}>
        <PFAM.Feed />
      </div>
      <MTabBar ref={tabsRefM} hidden={chromeHidden} />
      <button className={"m-fab" + (chromeHidden ? " m-fab-hidden" : "")} aria-label="Share a Post" onClick={() => go("CreatePostMobile.html")}>
        <DSM.IconifyIcon name="lucide:plus" size={22} color="#fff" />
        Share a Post
      </button>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <MessagesPanel open={msgOpen} onClose={() => setMsgOpen(false)} />
    </div>);

}

function useDeviceScaleM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateM(calc);
  useEffectM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileM() {
  const [mobile, setMobile] = useStateM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function MobileApp() {
  const mobile = useIsMobileM();
  const scale = useDeviceScaleM();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><MobileHome /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><MobileHome /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MobileApp />);
