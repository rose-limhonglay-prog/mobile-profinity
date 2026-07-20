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
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Learning", label: "My Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: null },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "AgentMobile.html" }];


function CMTopBar({ onMessages }) {
  return (
    <header className="cm-top">
      <button className="cm-burger" aria-label="Menu"><DSCM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img className="m-logo-light" src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      <img className="m-logo-dark" src="assets/profinity-academy-logo-dark.jpg" alt="PROfinity Academy" />
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

const CM_CHANNELS = ["Confidence", "Clinical Chat", "Freedom Path", "Tech Team", "Business & Mindset"];

function CMHeader({ channel, setChannel }) {
  const [following, setFollowing] = React.useState(false);
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
          <DSCM.IconifyIcon name="lucide:chevron-down" size={20} color="var(--brand-navy)"
            className={"cm-chchev" + (open ? " open" : "")} />
        </button>
        {open &&
        <div className="cm-chmenu" role="listbox" onClick={(e) => e.stopPropagation()}>
            {CM_CHANNELS.map((c) =>
          <button key={c} role="option" aria-selected={c === channel}
          className={"cm-chitem" + (c === channel ? " on" : "")}
          onClick={() => { setChannel(c); setOpen(false); }}>
                {c}
                {c === channel && <DSCM.IconifyIcon name="lucide:check" size={17} color="var(--brand-navy)" />}
              </button>
          )}
          </div>
        }
      </div>
      <button type="button" className={"cm-follow" + (following ? " on" : "")}
      onClick={() => setFollowing((f) => !f)}>
        {following ? "Following" : "Follow"}
        {following && <DSCM.IconifyIcon name="lucide:check" size={16} color="var(--gray-450)" />}
      </button>
    </div>);

}

function CMComposer({ channel }) {
  const nav = () => {
    try { sessionStorage.setItem("pf_post_channels", JSON.stringify([channel])); } catch (e) {}
    goCM("CreatePostMobile.html");
  };
  return (
    <div className="cm-compose">
      <DSCM.Avatar name={PFACM.ME.name} src={PFACM.ME.avatar} size={40} />
      <button className="pill" onClick={nav}>Share something…</button>
      <button className="imgbtn" aria-label="Add photo" onClick={nav}>
        <DSCM.IconifyIcon name="lucide:image" size={21} color="var(--brand-navy)" />
      </button>
    </div>);
}

function CMTabBar() {
  return (
    <nav className="cm-tabs" aria-label="Primary">
      {CM_TABS.map((t) =>
      <button key={t.key} className={"cm-tab" + (t.key === "Community" ? " on" : "")}
      aria-current={t.key === "Community" ? "page" : undefined}
      onClick={() => t.href && goCM(t.href)}>
          <span className="ic">
            <DSCM.IconifyIcon name={t.icon} size={23} color={t.key === "Community" ? "var(--brand-navy)" : "var(--gray-450)"} />
          </span>
          {t.label}
        </button>
      )}
    </nav>);

}

function CMScreen({ scrollRef, newPosts, dismiss }) {
  const [channel, setChannel] = React.useState("Confidence");
  const [msgOpen, setMsgOpen] = React.useState(false);
  return (
    <div className="cm-screen" data-screen-label="Community (mobile)">
      <CMTopBar onMessages={() => setMsgOpen(true)} />
      <CMHeader channel={channel} setChannel={setChannel} />
      <CMComposer channel={channel} />
      <div className="cm-scroll" ref={scrollRef}>
        {newPosts > 0 &&
        <button type="button" className="cm-newposts" onClick={dismiss}
        aria-label={newPosts + " new posts, tap to see them"}>
            <DSCM.IconifyIcon name="lucide:arrow-up" size={18} color="var(--white)" />
            {newPosts} New Posts
          </button>
        }
        <PFACM.Feed />
        <div className="cm-end">End of newsfeed</div>
      </div>
      <button type="button" className="cm-clindir-fab" aria-label="Clinician Directory"
        onClick={() => goCM("ClinicianDirectory.html")}>
        <DSCM.IconifyIcon name="lucide:book-open" size={18} color="var(--white)" />
        Clinician Directory
      </button>
      <CMTabBar />
      <MessagesPanelCM open={msgOpen} onClose={() => setMsgOpen(false)} />
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
