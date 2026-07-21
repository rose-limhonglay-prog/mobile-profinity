/* ===========================================================================
   PROfinity — Shared mobile chrome (top bar + side menu + notifications)
   Self-contained; loaded on Learning/Profile/Community/Events mobile pages so
   they get the same header as the Newsfeed. Suffixed -C to avoid scope clashes;
   does NOT depend on window.PFApp. Exposes window.MobileChromeC.
   =========================================================================== */
(function () {
  const { useState: useStateC, useEffect: useEffectC } = React;
  const DSC = window.ProfinityDesignSystem_c2b5cc;
  function goC(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

  const ME_C = { name: "Katy Wilson", avatar: "assets/avatar-katy.jpg" };

  function MTopBarC({ onMenu, onBell, onMessages, dark }) {
    return (
      <header className="m-top">
        <button className="m-burger" aria-label="Menu" onClick={onMenu}><DSC.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
        <img src={dark ? "assets/profinity-logo-dark.jpg" : "assets/profinity-academy-logo-full.png"} alt="PROfinity Academy" />
        <span className="grow" />
        <button className="m-iconbtn" aria-label="Search"><DSC.Icon name="search" size={20} color="var(--brand-navy)" /></button>
        <button className="m-iconbtn" aria-label="Notifications" onClick={() => onBell && onBell()}>
          <DSC.IconifyIcon name="lucide:bell" size={20} color="var(--brand-navy)" />
          <span className="dot">12</span>
        </button>
        <button className="m-iconbtn" aria-label="Messages" onClick={() => onMessages && onMessages()}>
          <DSC.IconifyIcon name="lucide:message-circle" size={20} color="var(--brand-navy)" />
          <span className="dot">12</span>
        </button>
      </header>);
  }

  const SM_RESOURCES_C = [
    { label: "Videos", icon: "lucide:square-play", n: 8 },
    { label: "Articles", icon: "lucide:feather", n: 4 },
    { label: "Webinars", icon: "lucide:calendar" }];
  const SM_COURSES_C = [
    { label: "Face Anatomy Masterclass", pct: 72 },
    { label: "Lip Filler Techniques", pct: 45 },
    { label: "Advanced Botox Training", pct: 20 }];
  const SM_EVENTS_C = [
    { d: "30", m: "JUN", label: "Technique Tuesday Webinar", t: "8:00 PM", tag: "NEW" },
    { d: "5", m: "JUL", label: "Confidence Masterclass", t: "6:00 PM" },
    { d: "12", m: "JUL", label: "Business Growth Workshop", t: "7:00 PM" }];
  const SM_PROFILE_C = [
    { label: "Edit Profile", icon: "lucide:book-open", href: "ProfileMobile.html" },
    { label: "Account Settings", icon: "lucide:graduation-cap", href: null },
    { label: "Notifications", icon: "lucide:calendar", href: "NotificationSettings.html" },
    { label: "Display Settings", icon: "lucide:cpu", href: "DisplaySettings.html" },
    { label: "Privacy & Security", icon: "lucide:book-open", href: null }];

  const NOTIFS_C = {
    "New": [
      { who: "PROfinity Academy", avatar: "assets/profinity-icon.jpg", action: "Weekly Rewards are here! 🎉", detail: "Your weekly rewards have been calculated — claim your bonuses before they expire this Sunday.", t: "Just now", type: "reward", cta: "Claim Rewards" },
      { who: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", action: "commented on your post", detail: "“This is a nice article Katy!”", t: "Just now", type: "comment" },
      { who: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", action: "liked on your comment", detail: "“Full-Face Rejuvenation Increased Patient Satisfaction +64%”", t: "2h", type: "love" }],
    "Yesterday": [
      { who: "Jane Harries", avatar: null, action: "booked new appointment", detail: "February 12, 2026, 6:00 PM", t: "1d", rsvp: true, type: "appointment" }],
    "Older": [
      { who: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", action: "commented on your post", detail: "“This is a nice article Katy!”", t: "3w", type: "comment" },
      { who: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", action: "liked on your comment", detail: "“Full-Face Rejuvenation Increased Patient Satisfaction +64%”", t: "4w", type: "love" }]
  };
  const NT_BADGE_C = {
    comment: { icon: "fluent:chat-16-filled", bg: "var(--brand-navy)" },
    love: { icon: "fluent:heart-16-filled", bg: "var(--reaction-love)" },
    like: { icon: "fluent:thumb-like-16-filled", bg: "var(--reaction-like)" },
    follow: { icon: "fluent:person-add-16-filled", bg: "var(--ai-purple)" },
    appointment: { icon: "fluent:calendar-checkmark-16-filled", bg: "var(--success)" },
    reward: { icon: "fluent:gift-16-filled", bg: "var(--premium-orange)" }
  };
  const NT_MENU_C = [
    { label: "Turn off notifications like this", icon: "lucide:bell-off" },
    { label: "Mute this notification", icon: "lucide:volume-x" },
    { label: "Hide this notification", icon: "lucide:eye-off" },
    { label: "Report a problem", icon: "lucide:flag" },
    { label: "Notification settings", icon: "lucide:settings" }];

  function NotifRowC({ n }) {
    const b = NT_BADGE_C[n.type];
    const [menu, setMenu] = useStateC(false);
    useEffectC(() => {
      if (!menu) return;
      const close = () => setMenu(false);
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }, [menu]);
    return (
      <div className="nt-row">
        <span className="nt-av">
          <DSC.Avatar name={n.who} src={n.avatar} size={58} />
          {b && <span className="nt-badge" style={{ background: b.bg }}>
            <DSC.IconifyIcon name={b.icon} size={15} color="#fff" />
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
            onClick={(e) => { e.stopPropagation(); setMenu((m) => !m); }}>
            <DSC.IconifyIcon name="lucide:more-vertical" size={20} color="var(--gray-450)" />
          </button>
          {menu &&
            <div className="nt-menu" role="menu" onClick={(e) => e.stopPropagation()}>
              {NT_MENU_C.map((m) =>
                <button key={m.label} className="nt-menu-item" role="menuitem" onClick={() => setMenu(false)}>
                  <DSC.IconifyIcon name={m.icon} size={19} color="var(--gray-700)" />
                  {m.label}
                </button>
              )}
            </div>
          }
        </div>
      </div>);
  }

  function NotificationsPanelC({ open, onClose }) {
    return (
      <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="m-drawer-scrim" onClick={onClose} />
        <aside className="m-drawer nt-panel" role="dialog" aria-modal="true" aria-label="Notifications">
          <header className="nt-head">
            <button className="nt-back" aria-label="Back" onClick={onClose}>
              <DSC.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
            </button>
            <h2 style={{ fontSize: "26px", fontWeight: "700" }}>Notifications</h2>
          </header>
          <div className="nt-search">
            <DSC.Icon name="search" size={20} color="var(--gray-450)" />
            <input type="text" placeholder="Search notifications" aria-label="Search notifications" />
          </div>
          <div className="nt-body">
            {Object.keys(NOTIFS_C).map((sec) =>
              <div key={sec} className="nt-group">
                <div className="nt-sec-h">{sec.toUpperCase()}{sec === "New" && <span className="nt-sec-dot" />}</div>
                {NOTIFS_C[sec].map((n, i) => <NotifRowC key={i} n={n} />)}
              </div>
            )}
          </div>
        </aside>
      </div>);
  }

  const DM_THREADS_SEED_C = [
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

  const VOICE_CONFS_SEED_C = [
    { id: "vc1", name: "Clinical Case Review", who: "Dr Tim Pearce, Dr Sarah Kim +3", t: "Today, 4:00 PM", live: true },
    { id: "vc2", name: "Business Growth Sync", who: "Miranda Pearce, Dr Alex Chen", t: "Tomorrow, 10:00 AM", live: false }];

  const PF_GROUPS_KEY = "pf-dm-groups";

  function readDmGroupsC() {
    try { return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || []; } catch (e) { return []; }
  }

  function groupDisplayNameC(members) {
    const names = members.map((m) => m.name.replace(/^Dr\s+/, ""));
    return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
  }

  function createDmGroupC(members, customName) {
    const hasCustomName = !!(customName || "").trim();
    const group = { id: "group-" + Date.now(), isGroup: true, customName: hasCustomName,
      name: hasCustomName ? customName.trim() : groupDisplayNameC(members), members, messages: [] };
    const groups = readDmGroupsC();
    groups.unshift(group);
    try { localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups)); } catch (e) {}
    return group;
  }

  function GroupAvatarStackC({ members, size }) {
    const s = size || 52;
    return (
      <span className="mp-group-av" style={{ width: s, height: s }}>
        {members.slice(0, 2).map((m, i) =>
          <span className="mp-group-av-item" key={m.id || i}>
            <DSC.Avatar name={m.name} src={m.avatar} size={Math.round(s * 0.68)} />
          </span>
        )}
      </span>);
  }

  function MessagesRowC({ c, onOpen }) {
    const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
    return (
      <button className="mp-row" onClick={onOpen}>
        <span className="mp-av">
          {c.isGroup ?
            <GroupAvatarStackC members={c.members} /> :
            <>
              <DSC.Avatar name={c.name} src={c.avatar} size={52} />
              {c.online && <span className="dm-online-dot" />}
            </>
          }
        </span>
        <span className="mp-main">
          <span className="mp-row-top">
            <span className="mp-name">{c.name}</span>
            <span className="mp-time">{last ? last.t : ""}</span>
          </span>
          <span className="mp-row-bottom">
            <span className="mp-preview">{last ? last.text : c.isGroup ? c.members.length + " members" : ""}</span>
            {c.muted ?
              <DSC.IconifyIcon name="lucide:bell-off" size={16} color="var(--gray-450)" /> :
              c.unread > 0 &&
              <span className="mp-badge">{c.unread}</span>
            }
          </span>
        </span>
      </button>);
  }

  function NewConversationScreenC({ contacts, picked, onToggle, query, onQuery, groupName, onGroupName, onBack, onCreate }) {
    const filtered = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    const count = picked.length;
    return (
      <div className="mp-new" data-screen-label="New Conversation">
        <header className="nt-head">
          <button className="nt-back" aria-label="Back to messages" onClick={onBack}>
            <DSC.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
          </button>
          <h2 style={{ fontSize: "20px", fontWeight: "700" }}>New Conversation</h2>
        </header>
        <div className="nt-search mp-search">
          <DSC.Icon name="search" size={20} color="var(--gray-450)" />
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
                <span className="mp-av"><DSC.Avatar name={c.name} src={c.avatar} size={44} /></span>
                <span className="mp-new-name">{c.name}</span>
                <span className={"mp-new-check" + (on ? " on" : "")}>
                  {on && <DSC.IconifyIcon name="lucide:check" size={13} color="#fff" />}
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

  function VoiceConfRowC({ v }) {
    return (
      <div className="mp-row mp-vc-row">
        <span className="mp-av mp-vc-icon">
          <DSC.IconifyIcon name="lucide:phone-call" size={22} color="var(--brand-navy)" />
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

  function MessagesPanelC({ open, onClose }) {
    const [tab, setTab] = useStateC("messages");
    const [query, setQuery] = useStateC("");
    const [screen, setScreen] = useStateC("list");
    const [groups, setGroups] = useStateC([]);
    const [picked, setPicked] = useStateC([]);
    const [ncQuery, setNcQuery] = useStateC("");
    const [groupName, setGroupName] = useStateC("");
    useEffectC(() => {
      if (!open) { setQuery(""); setScreen("list"); setPicked([]); setNcQuery(""); setGroupName(""); }
      else { setGroups(readDmGroupsC()); }
    }, [open]);
    const allThreads = [...groups, ...DM_THREADS_SEED_C];
    const filtered = allThreads.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
    const unreadTotal = DM_THREADS_SEED_C.reduce((n, t) => n + (t.unread || 0), 0);

    function openThread(id) {
      goC("DirectMessage.html?id=" + id + "&from=LearningMobile.html");
    }

    function togglePick(id) {
      setPicked((all) => all.includes(id) ? all.filter((x) => x !== id) : [...all, id]);
    }

    function handleCreate() {
      if (picked.length === 0) return;
      if (picked.length === 1) { openThread(picked[0]); return; }
      const members = DM_THREADS_SEED_C
        .filter((c) => picked.includes(c.id))
        .map((c) => ({ id: c.id, name: c.name, avatar: c.avatar }));
      const group = createDmGroupC(members, groupName);
      openThread(group.id);
    }

    if (screen === "new") {
      return (
        <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
          <div className="m-drawer-scrim" onClick={onClose} />
          <aside className="m-drawer nt-panel mp-panel" role="dialog" aria-modal="true" aria-label="New Conversation">
            <NewConversationScreenC contacts={DM_THREADS_SEED_C} picked={picked} onToggle={togglePick}
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
              <DSC.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
            </button>
            <h2 style={{ fontSize: "26px", fontWeight: "700" }}>Messages</h2>
            <button className="mp-compose" aria-label="New message" onClick={() => setScreen("new")}>
              <DSC.IconifyIcon name="lucide:square-pen" size={20} color="var(--gray-900)" />
            </button>
          </header>
          <div className="mp-tabs" role="tablist" aria-label="Messages or voice conference">
            <button role="tab" aria-selected={tab === "messages"} className={"mp-tab" + (tab === "messages" ? " on" : "")} onClick={() => setTab("messages")}>
              <DSC.IconifyIcon name="lucide:message-circle" size={16} color={tab === "messages" ? "var(--brand-navy)" : "var(--gray-450)"} />
              Messages
              {unreadTotal > 0 && <span className="mp-tab-badge">{unreadTotal}</span>}
            </button>
            <button role="tab" aria-selected={tab === "voice"} className={"mp-tab" + (tab === "voice" ? " on" : "")} onClick={() => setTab("voice")}>
              <DSC.IconifyIcon name="lucide:phone" size={16} color={tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"} />
              Voice Conference
              <span className="mp-tab-badge">{VOICE_CONFS_SEED_C.length}</span>
            </button>
          </div>
          <div className="nt-search mp-search">
            <DSC.Icon name="search" size={20} color="var(--gray-450)" />
            <input type="text" placeholder="Search messages" aria-label="Search messages" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="nt-body mp-body">
            {tab === "messages" ?
              filtered.map((c) => <MessagesRowC key={c.id} c={c} onOpen={() => openThread(c.id)} />) :
              VOICE_CONFS_SEED_C.map((v) => <VoiceConfRowC key={v.id} v={v} />)
            }
          </div>
        </aside>
      </div>);
  }

  function SmSectionC({ title }) { return <div className="sm-sec-h">{title}</div>; }

  function DisplayToggleC({ dark, onToggle }) {
    return (
      <div className="sm-display">
        <div className="sm-display-main">
          <span className="sm-display-title">Display</span>
          <span className="sm-display-sub">Adjust the appearance of the app to reduce glare and give your eyes a break</span>
        </div>
        <button className={"sm-display-toggle" + (dark ? " on" : "")} role="switch" aria-checked={dark} aria-label="Toggle dark mode" onClick={onToggle}>
          <span className="knob"><DSC.IconifyIcon name={dark ? "lucide:moon" : "lucide:sun"} size={13} color={dark ? "var(--brand-navy)" : "var(--premium-orange)"} /></span>
        </button>
      </div>
    );
  }

  function SideMenuC({ open, onClose, dark, onToggleDark }) {
    return (
      <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="m-drawer-scrim" onClick={onClose} />
        <aside className={"m-drawer" + (dark ? " sm-dark" : "")} role="dialog" aria-modal="true" aria-label="Menu">
          <button className="m-drawer-profile" onClick={() => goC("ProfileMobile.html")}>
            <DSC.Avatar name={ME_C.name} src={ME_C.avatar} size={56} />
            <span className="m-dp-main">
              <span className="m-dp-name">Katy Wilson
                <DSC.IconifyIcon name="lucide:badge-check" size={18} color="var(--reaction-like)" />
              </span>
              <span className="m-dp-role">Registered Nurse</span>
            </span>
            <DSC.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-800)" />
          </button>
          <div className="sm-body">
            <button className="sm-upgrade" onClick={() => goC("MembershipTier.html")}>
              <span className="sm-upgrade-icon">
                <DSC.IconifyIcon name="lucide:gem" size={20} color="#fff" />
              </span>
              <span className="sm-upgrade-main">
                <span className="sm-upgrade-title">Upgrade to Confidence</span>
                <span className="sm-upgrade-sub">Unlock premium channels &amp; courses</span>
              </span>
              <DSC.IconifyIcon name="lucide:chevron-right" size={20} color="#fff" />
            </button>

            <SmSectionC title="Communities" />
            <button className="sm-tier" onClick={() => goC("CommunityMobile.html")}>
              <span className="sm-tier-top">
                <span className="sm-tier-name">Confidence Path</span>
                <span className="sm-tier-pill" style={{ color: "rgb(206, 153, 87)" }}>YOUR TIER</span>
              </span>
              <span className="sm-tier-sub">Exclusive tier content</span>
              <span className="sm-tier-new" style={{ color: "rgb(206, 153, 87)" }}>3 new posts</span>
            </button>
            <SmSectionC title="Membership Resources" />
            <nav className="sm-list">
              {SM_RESOURCES_C.map((c) =>
                <button key={c.label} className="sm-row" onClick={() => goC("LearningMobile.html")}>
                  <DSC.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                  <span className="sm-row-label" style={{ color: "rgb(0, 0, 0)" }}>{c.label}</span>
                </button>
              )}
            </nav>
            <SmSectionC title="My Courses" />
            <div className="sm-courses">
              {SM_COURSES_C.map((c) =>
                <button key={c.label} className="sm-course" onClick={() => goC("LearningMobile.html")}>
                  <span className="sm-course-top">
                    <span className="sm-course-thumb"><DSC.IconifyIcon name="lucide:image" size={20} color="var(--gray-400)" /></span>
                    <span className="sm-course-name" style={{ color: "rgb(0, 0, 0)" }}>{c.label}</span>
                  </span>
                  <span className="sm-progress"><span className="sm-progress-fill" style={{ width: c.pct + "%", backgroundColor: "rgb(206, 153, 87)" }} /></span>
                  <span className="sm-course-pct">{c.pct}% complete</span>
                </button>
              )}
            </div>
            <SmSectionC title="Upcoming Events" />
            <div className="sm-events">
              {SM_EVENTS_C.map((e) =>
                <button key={e.label} className="sm-event" onClick={() => goC("EventsMobile.html")}>
                  <span className="sm-date"><b>{e.d}</b><i>{e.m}</i></span>
                  <span className="sm-event-main">
                    <span className="sm-event-name" style={{ color: "rgb(0, 0, 0)" }}>{e.label}</span>
                    <span className="sm-event-time">{e.t}</span>
                  </span>
                  {e.tag && <span className="sm-event-tag" style={{ borderColor: "rgb(206, 153, 87)", color: "rgb(206, 153, 87)" }}>{e.tag}</span>}
                </button>
              )}
            </div>
            <SmSectionC title="My Profile" />
            <button className="sm-row sm-verify" onClick={() => goC("ProfileMobile.html")}>
              <DSC.IconifyIcon name="lucide:book-open" size={23} color="var(--premium-orange)" />
              <span className="sm-row-label">Verify Profile</span>
              <span className="sm-verify-pill" style={{ backgroundColor: "rgb(206, 153, 87)" }}>Not Verified</span>
            </button>
            <nav className="sm-list">
              {SM_PROFILE_C.map((c) =>
                c.label === "Display Settings"
                  ? <DisplayToggleC key={c.label} dark={dark} onToggle={onToggleDark} />
                  : <button key={c.label} className="sm-row" onClick={() => goC(c.href)}>
                    <DSC.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                    <span className="sm-row-label">{c.label}</span>
                    <DSC.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
                  </button>
              )}
            </nav>
            <button className="m-drawer-logout" onClick={onClose}>
              <DSC.IconifyIcon name="lucide:log-out" size={22} color="var(--error)" />
              Logout
            </button>
          </div>
        </aside>
      </div>);
  }

  function MobileChromeC() {
    const [menuOpen, setMenuOpen] = useStateC(false);
    const [notifOpen, setNotifOpen] = useStateC(false);
    const [msgOpen, setMsgOpen] = useStateC(false);
    const [dark, setDark] = useStateC(() => {
      try { return localStorage.getItem("pf-mobile-dark") === "1"; } catch (e) { return false; }
    });
    useEffectC(() => {
      try { localStorage.setItem("pf-mobile-dark", dark ? "1" : "0"); } catch (e) {}
    }, [dark]);
    return (
      <React.Fragment>
        <MTopBarC onMenu={() => setMenuOpen(true)} onBell={() => setNotifOpen(true)} onMessages={() => setMsgOpen(true)} dark={dark} />
        <SideMenuC open={menuOpen} onClose={() => setMenuOpen(false)} dark={dark} onToggleDark={() => setDark((v) => !v)} />
        <NotificationsPanelC open={notifOpen} onClose={() => setNotifOpen(false)} />
        <MessagesPanelC open={msgOpen} onClose={() => setMsgOpen(false)} />
      </React.Fragment>);
  }

  window.MobileChromeC = MobileChromeC;
})();
