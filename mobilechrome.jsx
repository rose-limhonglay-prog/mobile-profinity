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

  /* Same "pf-subscription-tier" key the newsfeed/community/membership pages
     read and write — this file doesn't load app.jsx, so it keeps its own
     tiny copy rather than depending on window.PFApp. */
  const PF_TIER_KEY_C = "pf-subscription-tier";
  function getUserTierC() {
    try { return localStorage.getItem(PF_TIER_KEY_C) || "free"; } catch (e) { return "free"; }
  }
  const ME_C = { name: "Katy Wilson", avatar: "assets/avatar-katy.jpg" };

  /* Membership ladder — the upgrade banner should point at the next rung up,
     not repeat the tier the viewer already holds. A free viewer (no tier,
     indexOf === -1) points at the first rung rather than reading as "top". */
  const SM_TIER_LADDER_C = ["confidence", "mastery", "freedom", "inner"];
  const SM_TIER_META_C = {
    confidence: { name: "Confidence" },
    mastery:    { name: "Mastery" },
    freedom:    { name: "Freedom" },
    inner:      { name: "Inner Circle" }
  };
  const SM_TIER_RESOURCES_C = {
    confidence: [
    { label: "Community Chat",       icon: "lucide:message-circle", href: "CommunityMobile.html" },
    { label: "Membership Training",  icon: "lucide:graduation-cap", href: "LearningMobile.html" },
    { label: "Technique Tuesday",    icon: "lucide:calendar-check", href: "EventsMobile.html" },
    { label: "Complications Help",   icon: "lucide:shield-alert",   href: "DirectMessage.html" },
    { label: "AI Coach",             icon: "lucide:sparkles",       href: "LearningMobile.html" }],

    mastery: [
    { label: "Mastery lounge",          icon: "lucide:message-circle", n: 6,  href: "CommunityMobile.html" },
    { label: "Advanced masterclasses",  icon: "lucide:graduation-cap", n: 9,  href: "LearningMobile.html" },
    { label: "Complication library",    icon: "lucide:file-text",      n: 18, href: "LearningMobile.html" },
    { label: "Live case reviews",       icon: "lucide:calendar",       n: 3,  href: "EventsMobile.html" }],

    freedom: [
    { label: "Freedom circle",       icon: "lucide:message-circle", n: 2, href: "CommunityMobile.html" },
    { label: "Business playbooks",   icon: "lucide:graduation-cap", n: 7, href: "LearningMobile.html" },
    { label: "1:1 mentor sessions",  icon: "lucide:calendar",       n: 1, href: "EventsMobile.html" }],

    inner: [
    { label: "Inner Circle roundtable", icon: "lucide:message-circle", n: 4, href: "CommunityMobile.html" },
    { label: "Executive mentorship",    icon: "lucide:calendar",       n: 1, href: "EventsMobile.html" },
    { label: "Legacy case archive",     icon: "lucide:file-text",      n: 9, href: "LearningMobile.html" },
    { label: "Founder office hours",    icon: "lucide:calendar",       n: 2, href: "EventsMobile.html" }]

  };
  /* Tiers unlocked by a viewer on `tier`, highest first. Free (no match) unlocks none. */
  function smUnlockedTiersC(tier) {
    const i = SM_TIER_LADDER_C.indexOf(tier);
    if (i === -1) return [];
    return SM_TIER_LADDER_C.slice(0, i + 1).reverse();
  }
  /* The next rung up from `tier` — null once at the top of the ladder. */
  function smNextTierC(tier) {
    const i = SM_TIER_LADDER_C.indexOf(tier);
    if (i === SM_TIER_LADDER_C.length - 1) return null;
    return SM_TIER_LADDER_C[i + 1];
  }

  function MTopBarC({ onMenu, onBell, onMessages, dark }) {
    return (
      <header className="m-top">
        <button className="m-burger" aria-label="Menu" onClick={onMenu}><DSC.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
        <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" />
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

  const SM_EVENTS_C = [
    { d: "30", m: "JUN", label: "Technique Tuesday Webinar", t: "8:00 PM", access: "open" },
    { d: "5", m: "JUL", label: "Confidence Masterclass", t: "6:00 PM", access: "members" },
    { d: "12", m: "JUL", label: "Business Growth Workshop", t: "7:00 PM", access: "members" }];
  const SM_PROFILE_C = [
    { label: "Edit Profile", icon: "lucide:book-open", href: "ProfileMobile.html" },
    { label: "Account Settings", icon: "lucide:graduation-cap", href: null },
    { label: "My Saved", icon: "lucide:bookmark", href: "MySaved.html" },
    { label: "Notifications", icon: "lucide:calendar", href: "NotificationSettings.html" },
    { label: "Privacy & Security", icon: "lucide:book-open", href: null },
    { label: "Display Settings", icon: "lucide:cpu", href: "DisplaySettings.html" }];

  const NT_BADGE_C = {
    comment: { icon: "fluent:chat-16-filled", bg: "var(--brand-navy)" },
    reply: { icon: "fluent:arrow-reply-16-filled", bg: "var(--ai-purple)" },
    pinned: { icon: "fluent:pin-16-filled", bg: "var(--brand-gold)" },
    love: { icon: "fluent:heart-16-filled", bg: "var(--reaction-love)" },
    like: { icon: "fluent:thumb-like-16-filled", bg: "var(--reaction-like)" },
    follow: { icon: "fluent:person-add-16-filled", bg: "var(--ai-purple)" },
    appointment: { icon: "fluent:calendar-checkmark-16-filled", bg: "var(--success)" }
  };
  const NT_CATEGORIES_C = [
    { key: "comments", label: "Comments", count: 3, items: [
      { who: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", action: "commented on your post", detail: "“This is a nice article Katy!”", t: "2d ago", type: "comment" },
      { who: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", action: "commented on your post", detail: "“This is exactly what we needed”", t: "3d ago", type: "comment" },
      { who: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", action: "commented on your post", detail: "“Love the new protocol direction”", t: "5d ago", type: "comment" }] },
    { key: "replies", label: "Replies", count: 3, items: [
      { who: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", action: "replied to your comment", detail: "“Agreed, the results speak for themselves”", t: "1d ago", type: "reply" },
      { who: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", action: "replied to your comment", detail: "“Thanks for clarifying the protocol!”", t: "4d ago", type: "reply" }] },
    { key: "pinned", label: "Pinned Posts", count: 2, items: [
      { who: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", action: "pinned your post", detail: "“Full-Face Rejuvenation Increased Patient Satisfaction +64%”", t: "1w ago", type: "pinned" }] },
    { key: "likes", label: "Likes", count: 12, items: [
      { who: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", action: "liked on your comment", detail: "“Full-Face Rejuvenation Increased Patient Satisfaction +64%”", t: "2h ago", type: "love" },
      { who: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", action: "liked your post", detail: null, t: "6h ago", type: "like" }] },
    { key: "appointments", label: "Appointments", count: 1, items: [
      { who: "Jane Harries", avatar: null, action: "booked new appointment", detail: "February 12, 2026, 6:00 PM", t: "1d ago", rsvp: true, type: "appointment" }] }
  ];
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
          <DSC.Avatar name={n.who} src={n.avatar} size={56} />
          {b && <span className="nt-badge" style={{ background: b.bg }}>
            <DSC.IconifyIcon name={b.icon} size={14} color="#fff" />
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

  function NotifCategoryC({ cat, open, onToggle }) {
    return (
      <div className="nt-cat-wrap">
        <button className="nt-cat" aria-expanded={open} onClick={onToggle}>
          <span className="nt-cat-label">{cat.label} <span className="nt-cat-count">{cat.count}</span></span>
          <DSC.IconifyIcon name={open ? "lucide:chevron-down" : "lucide:chevron-right"} size={20} color="var(--gray-700)" />
        </button>
        {open &&
          <div className="nt-cat-items">
            {cat.items.map((n, i) => <NotifRowC key={i} n={n} />)}
          </div>
        }
      </div>);
  }

  function NotificationsPanelC({ open, onClose }) {
    const [openCats, setOpenCats] = useStateC(() => {
      const all = {};
      NT_CATEGORIES_C.forEach((cat) => { all[cat.key] = true; });
      return all;
    });
    function toggleCat(key) {
      setOpenCats((s) => ({ ...s, [key]: !s[key] }));
    }
    return (
      <div className={"m-drawer-wrap" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="m-drawer-scrim" onClick={onClose} />
        <aside className="m-drawer nt-panel" role="dialog" aria-modal="true" aria-label="Notifications">
          <header className="nt-head">
            <button className="nt-back" aria-label="Back" onClick={onClose}>
              <DSC.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
            </button>
            <h2>Notifications</h2>
          </header>
          <div className="nt-body">
            {NT_CATEGORIES_C.map((cat) =>
              <NotifCategoryC key={cat.key} cat={cat} open={!!openCats[cat.key]} onToggle={() => toggleCat(cat.key)} />
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

  function SmTierResourceRowC({ r }) {
    return (
      <button className="smt-resource" onClick={() => goC(r.href)}>
        <DSC.IconifyIcon name={r.icon} size={20} color="var(--gray-900)" />
        <span className="smt-resource-label">{r.label}</span>
        <DSC.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
      </button>);
  }

  function SmTierCardC({ tierKey, isOwn }) {
    const resources = SM_TIER_RESOURCES_C[tierKey];
    return (
      <div className="smt-card">
        <div className="smt-head">
          <span className="smt-top">
            <span className="smt-name">{SM_TIER_META_C[tierKey].name} Path</span>
            {!isOwn && <span className="smt-pill">INCLUDED</span>}
          </span>
        </div>
        <div className="smt-resources">
          {resources.map((r) => <SmTierResourceRowC key={r.label} r={r} />)}
        </div>
      </div>);
  }

  function SideMenuC({ open, onClose, dark, onToggleDark }) {
    const tier = getUserTierC();
    const unlockedTiers = smUnlockedTiersC(tier);
    const nextTier = smNextTierC(tier);
    const showUpgrade = tier === "free" || tier === "confidence" || tier === "mastery";
    /* Bronze by default; silver once the next rung is Mastery; gold for
       Freedom / Inner Circle. */
    const upgradeMetal = nextTier === "mastery" ? "silver" : nextTier === "freedom" || nextTier === "inner" ? "gold" : "bronze";
    const upgradeIconColor = upgradeMetal === "silver" ? "#3F4650" : upgradeMetal === "gold" ? "#5A3A00" : "#fff";
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
            {showUpgrade && nextTier &&
            <button className={"sm-upgrade metal-" + upgradeMetal} onClick={() => goC("MembershipTier.html")}>
                <span className="sm-upgrade-icon">
                  <DSC.IconifyIcon name="lucide:gem" size={20} color={upgradeIconColor} />
                </span>
                <span className="sm-upgrade-main">
                  <span className="sm-upgrade-title">Upgrade to {SM_TIER_META_C[nextTier].name}</span>
                  <span className="sm-upgrade-sub">Unlock more premium channels &amp; courses</span>
                </span>
                <DSC.IconifyIcon name="lucide:chevron-right" size={20} color={upgradeIconColor} />
              </button>
            }

            {unlockedTiers.length > 0 &&
            <React.Fragment>
                <SmSectionC title="My Membership" />
                <div className="smt-list">
                  {unlockedTiers.map((tKey) =>
                <SmTierCardC key={tKey} tierKey={tKey} isOwn={tKey === tier} />
                )}
                </div>
              </React.Fragment>
            }

            <button className="sm-primary-card" onClick={() => goC("LearningMobile.html")}>
              <span className="sm-primary-icon">
                <DSC.IconifyIcon name="lucide:graduation-cap" size={22} color="var(--brand-navy)" />
              </span>
              <span className="sm-primary-main">
                <span className="sm-primary-title">My Learning</span>
                <span className="sm-primary-sub">Courses, protocols &amp; certificates</span>
              </span>
              <DSC.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
            </button>

            {unlockedTiers.includes("freedom") &&
            <button className="sm-primary-card" onClick={() => goC("FreedomPathChat.html")}>
              <span className="sm-primary-icon">
                <DSC.IconifyIcon name="lucide:rocket" size={22} color="var(--brand-navy)" />
              </span>
              <span className="sm-primary-main">
                <span className="sm-primary-title">Freedom Path Chat</span>
                <span className="sm-primary-sub">Business, scaling &amp; mentorship</span>
              </span>
              <DSC.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
            </button>
            }

            <SmSectionC title="Upcoming Events" />
            <div className="sm-events">
              {SM_EVENTS_C.slice(0, 2).map((e) =>
                <button key={e.label} className="sm-event" onClick={() => goC("EventsMobile.html")}>
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
            <button className="m-drawer-logout" onClick={() => goC("AuthMobile.html?view=signin")}>
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
