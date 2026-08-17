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
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Agent", label: "Ava", icon: "lucide:sparkles", href: "AgentMobile.html" }];


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

const MTopBar = forwardRefM(function MTopBar({ onMenu, onBell, onMessages }, ref) {
  const [showNotif, setShowNotif] = useStateM(true);
  useEffectM(() => {
    const t = setTimeout(() => setShowNotif(false), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <header ref={ref} className="m-top">
      <button className="m-burger" aria-label="Menu" onClick={onMenu}><DSM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" />
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

/* Paid tier ladder, low → high. A viewer's own tier unlocks every rung below
   it too. "sovereign" aligns with the pricing-tier naming used by
   membership-tier.jsx (its "sovereign" plan maps to this same top rung). */
const SM_TIER_LADDER_M = ["confidence", "mastery", "freedom", "sovereign"];
const SM_TIER_META_M = {
  confidence: { name: "Confidence" },
  mastery:    { name: "Mastery" },
  freedom:    { name: "Freedom" },
  sovereign:  { name: "Sovereign" }
};

/* Tiers that get the single "My Membership" summary card + dedicated chat
   card in the drawer, as opposed to sovereign's stacked tier-card ladder
   (SmTierCard), which shows every tier a sovereign viewer has unlocked. */
const SM_MEMBERSHIP_TIERS_M = ["confidence", "mastery", "freedom"];

/* Rows inside the "My Membership" card — identical across confidence/mastery/
   freedom; freedom appends one extra row (SM_FREEDOM_LECTURE_ROW_M). */
const SM_MEMBERSHIP_ROWS_M = [
{ label: "Membership Training", icon: "lucide:graduation-cap", href: "LearningMobile.html" },
{ label: "Technique Tuesday",   icon: "lucide:calendar-check", href: "EventsMobile.html" },
{ label: "Complications Help",  icon: "lucide:shield-alert",   href: "DirectMessage.html" },
{ label: "AI Coach",            icon: "lucide:sparkles",       href: "LearningMobile.html" }];
const SM_FREEDOM_LECTURE_ROW_M = { label: "Freedom Path Lectures", icon: "lucide:presentation", href: "LearningMobile.html" };

/* Upgrade-CTA label keyed by the viewer's CURRENT tier — not derivable from
   the next tier's own display name, since mastery's target reads "Freedom
   Path" while freedom's target reads plain "Sovereign". */
const SM_UPGRADE_LABEL_M = { free: "Confidence", confidence: "Mastery", mastery: "Freedom Path", freedom: "Sovereign" };

/* Metal keyed by the viewer's CURRENT tier — which metal the upgrade CTA
   (next rung up) renders in. Bronze by default; silver once the next rung
   is Mastery; gold for Freedom Path / Sovereign. */
const SM_UPGRADE_METAL_M = { free: "bronze", confidence: "silver", mastery: "gold", freedom: "gold" };
/* Metal keyed by a viewer's OWN tier — drives the "My Membership" ribbon. */
const SM_TIER_METAL_M = { confidence: "bronze", mastery: "silver", freedom: "gold" };
const SM_METAL_ICON_COLOR_M = { bronze: "#fff", silver: "#3F4650", gold: "#5A3A00" };

/* Accent color per tier, used for the tier-card "YOUR TIER" pill. */
const SM_TIER_COLOR_M = { confidence: "var(--info)", mastery: "var(--level-intermediate)", freedom: "var(--ai-purple)", sovereign: "var(--premium-gold-deep)" };

/* Chat-card label per tier — always routes to CommunityMobile.html. Rendered
   as the first row inside SmMembershipCard, not a separate card. */
const SM_CHAT_LABEL_M = { confidence: "Community Chat", mastery: "Mastery Chat", freedom: "Freedom Path Chat" };
/* Unread-count badge for that same chat row. Mastery/freedom reuse the counts
   already spec'd for their SM_TIER_RESOURCES_M lounge/circle equivalents. */
const SM_CHAT_BADGE_M = { confidence: "10+", mastery: 6, freedom: "10+" };

const SM_TIER_RESOURCES_M = {
  confidence: SM_MEMBERSHIP_ROWS_M,

  mastery: [
  { label: "Mastery lounge",          icon: "lucide:message-circle", n: 6,  href: "CommunityMobile.html" },
  { label: "Advanced masterclasses",  icon: "lucide:graduation-cap", n: 9,  href: "LearningMobile.html" },
  { label: "Complication library",    icon: "lucide:file-text",      n: 18, href: "LearningMobile.html" },
  { label: "Live case reviews",       icon: "lucide:calendar",       n: 3,  href: "EventsMobile.html" }],

  freedom: [
  { label: "Freedom circle",       icon: "lucide:message-circle", n: 2, href: "CommunityMobile.html" },
  { label: "Business playbooks",   icon: "lucide:graduation-cap", n: 7, href: "LearningMobile.html" },
  { label: "1:1 mentor sessions",  icon: "lucide:calendar",       n: 1, href: "EventsMobile.html" }],

  sovereign: [
  { label: "Sovereign roundtable",   icon: "lucide:message-circle", n: 4, href: "CommunityMobile.html" },
  { label: "Executive mentorship",   icon: "lucide:calendar",       n: 1, href: "EventsMobile.html" },
  { label: "Legacy case archive",    icon: "lucide:file-text",      n: 9, href: "LearningMobile.html" },
  { label: "Founder office hours",   icon: "lucide:calendar",       n: 2, href: "EventsMobile.html" }]

};

/* Tiers unlocked by a viewer on `tier`, highest first. Free (no match) unlocks none. */
function smUnlockedTiersM(tier) {
  const i = SM_TIER_LADDER_M.indexOf(tier);
  if (i === -1) return [];
  return SM_TIER_LADDER_M.slice(0, i + 1).reverse();
}
/* The next rung up from `tier` — null once at the top of the ladder. A free
   viewer (tier not on the ladder, i === -1) points at the first rung. */
function smNextTierM(tier) {
  const i = SM_TIER_LADDER_M.indexOf(tier);
  if (i === SM_TIER_LADDER_M.length - 1) return null;
  return SM_TIER_LADDER_M[i + 1];
}
/* window.PF_TIER is set per newsfeed variant page to preview a given tier.
   Falls back to the shared subscription-tier localStorage key from app.jsx
   so today's single NewsfeedMobile.html keeps working unset. */
function smReadTierM() {
  if (window.PF_TIER) return window.PF_TIER;
  try {
    const t = PFAM.getUserTier ? PFAM.getUserTier() : "free";
    return t === "inner" ? "sovereign" : t;
  } catch (e) {return "free";}
}

const SM_EVENTS = [
{ d: "30", m: "JUN", label: "Technique Tuesday Webinar", t: "8:00 PM", access: "open",
  hosts: [{ name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png" }, { name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg" }] },
{ d: "5", m: "JUL", label: "Confidence Masterclass", t: "6:00 PM", access: "members" }];

const SM_PROFILE_BEFORE_M = [
{ label: "Edit Profile",       icon: "lucide:book-open",       href: "ProfileMobile.html" },
{ label: "Account Settings",   icon: "lucide:graduation-cap",  href: null },
{ label: "My Saved",           icon: "lucide:bookmark",        href: "MySaved.html" },
{ label: "Notifications",      icon: "lucide:calendar",        href: "NotificationSettings.html" },
{ label: "Privacy & Security", icon: "lucide:book-open",       href: null },
{ label: "Display Settings",   icon: "lucide:cpu",             href: "DisplaySettings.html" }];

const NT_BADGE = {
  comment: { icon: "fluent:chat-16-filled", bg: "var(--brand-navy)" },
  reply: { icon: "fluent:arrow-reply-16-filled", bg: "var(--ai-purple)" },
  pinned: { icon: "fluent:pin-16-filled", bg: "var(--brand-gold)" },
  love: { icon: "fluent:heart-16-filled", bg: "var(--reaction-love)" },
  like: { icon: "fluent:thumb-like-16-filled", bg: "var(--reaction-like)" },
  follow: { icon: "fluent:person-add-16-filled", bg: "var(--ai-purple)" },
  appointment: { icon: "fluent:calendar-checkmark-16-filled", bg: "var(--success)" }
};

const NT_CATEGORIES = [
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
        <DSM.Avatar name={n.who} src={n.avatar} size={56} />
        {b && <span className="nt-badge" style={{ background: b.bg }}>
          <DSM.IconifyIcon name={b.icon} size={14} color="#fff" />
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

function NotifCategory({ cat, open, onToggle }) {
  return (
    <div className="nt-cat-wrap">
      <button className="nt-cat" aria-expanded={open} onClick={onToggle}>
        <span className="nt-cat-label">{cat.label} <span className="nt-cat-count">{cat.count}</span></span>
        <DSM.IconifyIcon name={open ? "lucide:chevron-down" : "lucide:chevron-right"} size={20} color="var(--gray-700)" />
      </button>
      {open &&
      <div className="nt-cat-items">
          {cat.items.map((n, i) => <NotifRow key={i} n={n} />)}
        </div>
      }
    </div>);
}

function NotificationsPanel({ open, onClose }) {
  const [openCats, setOpenCats] = useStateM(() => {
    const all = {};
    NT_CATEGORIES.forEach((cat) => { all[cat.key] = true; });
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
            <DSM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
          </button>
          <h2>Notifications</h2>
        </header>
        <div className="nt-body">
          {NT_CATEGORIES.map((cat) =>
            <NotifCategory key={cat.key} cat={cat} open={!!openCats[cat.key]} onToggle={() => toggleCat(cat.key)} />
          )}
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
        <DSM.IconifyIcon name={on ? "lucide:moon" : "lucide:sun"} size={13} color={on ? "#1A1736" : "var(--gray-450)"} />
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

function SmTierResourceRow({ r }) {
  return (
    <button className="smt-resource" onClick={() => go(r.href)}>
      <DSM.IconifyIcon name={r.icon} size={20} color="var(--gray-900)" />
      <span className="smt-resource-label">{r.label}</span>
      {r.n != null && <span className="smt-badge">{r.n}</span>}
      <DSM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
    </button>);

}

function SmTierCard({ tierKey, isOwn }) {
  const resources = SM_TIER_RESOURCES_M[tierKey];
  const color = SM_TIER_COLOR_M[tierKey];
  return (
    <div className="smt-card">
      <div className="smt-head">
        <span className="smt-top">
          <span className="smt-name">{SM_TIER_META_M[tierKey].name} Path</span>
        </span>
        {isOwn ?
        <span className="smt-pill smt-pill-yours" style={{ color, borderColor: color }}>YOUR TIER</span> :
        <span className="smt-pill">INCLUDED</span>
        }
      </div>
      <div className="smt-resources">
        {resources.map((r) => <SmTierResourceRow key={r.label} r={r} />)}
      </div>
    </div>);

}

function SmMembershipCard({ tier }) {
  const chatRow = { label: SM_CHAT_LABEL_M[tier], icon: "lucide:message-circle", href: "CommunityMobile.html", n: SM_CHAT_BADGE_M[tier] };
  const rows = tier === "freedom" ?
  [SM_FREEDOM_LECTURE_ROW_M, chatRow, ...SM_MEMBERSHIP_ROWS_M] :
  [chatRow, ...SM_MEMBERSHIP_ROWS_M];
  const metal = SM_TIER_METAL_M[tier];
  return (
    <div className="smt-card sm-membership-card">
      <div className="smt-head sm-membership-head">
        <span className="sm-membership-title">MY MEMBERSHIP</span>
        <span className={"sm-memb-ribbon sm-memb-ribbon-" + metal}>
          <span className="sm-memb-ribbon-text">{SM_TIER_META_M[tier].name} Path</span>
        </span>
      </div>
      <div className="smt-resources">
        {rows.map((r) => <SmTierResourceRow key={r.label} r={r} />)}
      </div>
    </div>);

}

function SideMenu({ open, onClose }) {
  const [dark, toggleDark] = useDarkModeM();
  const tier = smReadTierM();
  const unlockedTiers = smUnlockedTiersM(tier);
  const nextTier = smNextTierM(tier);
  const showMyMembership = SM_MEMBERSHIP_TIERS_M.includes(tier);
  const showTierCards = !showMyMembership && unlockedTiers.length > 0;
  const burgerRefM = useRefM(null);

  useEffectM(() => {
    if (!open) return;
    burgerRefM.current = document.querySelector('.m-burger');
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      burgerRefM.current && burgerRefM.current.focus();
    };
  }, [open]);

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
          {nextTier &&
          (() => {
            const upgradeMetal = SM_UPGRADE_METAL_M[tier] || "bronze";
            const upgradeIconColor = SM_METAL_ICON_COLOR_M[upgradeMetal];
            return (
              <button className={"sm-upgrade metal-" + upgradeMetal} onClick={() => go("MembershipTier.html")}>
                <span className="sm-upgrade-icon">
                  <DSM.IconifyIcon name="lucide:gem" size={20} color={upgradeIconColor} />
                </span>
                <span className="sm-upgrade-main">
                  <span className="sm-upgrade-title">Upgrade to {SM_UPGRADE_LABEL_M[tier]}</span>
                  <span className="sm-upgrade-sub">Unlock more premium channels &amp; courses</span>
                </span>
                <DSM.IconifyIcon name="lucide:chevron-right" size={20} color={upgradeIconColor} />
              </button>);

          })()
          }

          {showMyMembership &&
          <SmMembershipCard tier={tier} />
          }

          {showTierCards &&
          <>
            <SmSection title="My Membership" />
            <div className="smt-list">
              {unlockedTiers.map((tKey) =>
              <SmTierCard key={tKey} tierKey={tKey} isOwn={tKey === tier} />
              )}
            </div>
          </>
          }

          <button className="sm-primary-card" onClick={() => go("LearningMobile.html")}>
            <span className="sm-primary-icon">
              <DSM.IconifyIcon name="lucide:graduation-cap" size={22} color="var(--brand-navy)" />
            </span>
            <span className="sm-primary-main">
              <span className="sm-primary-title">My Learning</span>
              <span className="sm-primary-sub">Courses, protocols &amp; certificates</span>
            </span>
            <DSM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-450)" />
          </button>

          <SmSection title="Upcoming Events" />
          <div className="sm-events">
            {SM_EVENTS.map((e) =>
            <button key={e.label} className="sm-event" onClick={() => go("EventsMobile.html")}>
                <span className="sm-date"><b>{e.d}</b><i>{e.m}</i></span>
                <span className="sm-event-main">
                  <span className="sm-event-name">{e.label}</span>
                  <span className="sm-event-time">{e.t}</span>
                  {e.hosts &&
                  <span className="sm-event-hosts">
                    <GroupAvatarStackM members={e.hosts} size={26} />
                    <span className="sm-event-hosts-label">Dr Tim Pearce &amp; Miranda Pearce</span>
                  </span>
                  }
                </span>
                <span className={"sm-event-access" + (e.access === "members" ? " sm-event-access-members" : " sm-event-access-open")}>
                  {e.access === "members" ? "Members only" : "Open to all"}
                </span>
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
            {SM_PROFILE_BEFORE_M.map((c) =>
            c.label === "Display Settings" ?
            <SmDisplayCard key={c.label} dark={dark} onToggle={toggleDark} /> :
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

const MTabBar = forwardRefM(function MTabBar({ compact }, ref) {
  return (
    <nav ref={ref} className={"m-tabs" + (compact ? " m-tabs-compact" : "")} aria-label="Primary">
      {M_TABS.map((t) =>
      <button key={t.key} className={"m-tab" + (t.key === "Home" ? " on" : "")}
      aria-current={t.key === "Home" ? "page" : undefined}
      onClick={() => t.href && go(t.href)}>
          <span className="ic">
            <DSM.IconifyIcon name={t.icon} size={20} color={t.key === "Home" ? "#fff" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          <span className="lbl">{t.label}</span>
        </button>
      )}
    </nav>);

});

function useHeaderHideM(scrollRef) {
  const [state, setState] = useStateM({ hidden: false, floating: false });
  useEffectM(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const dy = y - lastY;
      setState((prev) => {
        let hidden = prev.hidden;
        if (y < 40) hidden = false;
        else if (dy > 6) hidden = true;
        else if (dy < -6) hidden = false;
        return { hidden, floating: y > 40 };
      });
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return state;
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
  const { hidden: chromeHidden, floating: chromeFloat } = useHeaderHideM(scrollRefM);
  useEffectM(() => {
    const el = scrollRefM.current;
    if (!el || !window.pfRestoreScroll) return;
    window.pfRestoreScroll(el);
  }, []);
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
    <div className={"m-screen" + (chromeHidden ? " chrome-hidden" : "") + (chromeFloat ? " chrome-float" : "")} data-screen-label="Home (mobile)">
      <PushNotifBanner />
      <MTopBar ref={headerRefM} onMenu={() => setMenuOpen(true)} onBell={() => setNotifOpen(true)} onMessages={() => setMsgOpen(true)} />
      <div className="m-scroll" ref={scrollRefM} style={{ paddingTop: chromeHidden ? 0 : headerH, paddingBottom: tabsH + 34 }}>
        <PFAM.Feed />
      </div>
      <MTabBar ref={tabsRefM} compact={chromeHidden} />
      <button className={"m-fab" + (chromeHidden ? " m-fab-compact" : "")} aria-label="Share a Post" onClick={() => go("CreatePostMobile.html")}>
        <DSM.IconifyIcon name="lucide:plus" size={16} color="#fff" />
        <span className="lbl">Share a Post</span>
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
