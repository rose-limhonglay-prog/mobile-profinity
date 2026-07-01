/* ===========================================================================
   PROfinity — Home (Newsfeed) · iPhone 17 Pro Max mobile
   Reuses the desktop Feed (window.PFApp.Feed — full reaction/comment/animation
   stack) inside the IOSDevice frame, with a mobile top bar + bottom tab bar.
   Shares one global scope with app.jsx, so names here are suffixed -M.
   =========================================================================== */
const { useState: useStateM, useEffect: useEffectM } = React;
const DSM = window.ProfinityDesignSystem_c2b5cc;
const PFAM = window.PFApp;

function go(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

const M_CHIPS = ["For You", "Following", "Case Studies", "Protocols", "Discussions"];

const M_TABS = [
{ key: "Home", label: "Home", icon: "lucide:home", href: null },
{ key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
{ key: "Learning", label: "Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
{ key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "Agent.html" }];


function MTopBar({ onMenu, onBell }) {
  const [showNotif, setShowNotif] = useStateM(true);
  useEffectM(() => {
    const t = setTimeout(() => setShowNotif(false), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <header className="m-top">
      <button className="m-burger" aria-label="Menu" onClick={onMenu}><DSM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      <span className="grow" />
      <button className="m-iconbtn" aria-label="Search"><DSM.Icon name="search" size={20} color="var(--brand-navy)" /></button>
      <button className="m-iconbtn" aria-label="Notifications" onClick={() => {setShowNotif(false);onBell && onBell();}}>
        <DSM.IconifyIcon name="lucide:bell" size={20} color="var(--brand-navy)" />
        <span className="dot">12</span>
      </button>
      <button className="m-iconbtn" aria-label="Messages">
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

}

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

const SM_PROFILE = [
{ label: "Edit Profile", icon: "lucide:book-open", href: "ProfileMobile.html" },
{ label: "Account Settings", icon: "lucide:graduation-cap", href: null },
{ label: "Notifications", icon: "lucide:calendar", href: null },
{ label: "Display Settings", icon: "lucide:cpu", href: "DisplaySettings.html" },
{ label: "Privacy & Security", icon: "lucide:book-open", href: null }];

const NOTIFS = {
  “New”: [
  { who: “Dr Tim Pearce”, avatar: “assets/avatar-drtim.png”, action: “commented on your post”, detail: ““This is a nice article Katy!””, t: “Just now”, type: “comment” },
  { who: “Miranda Pearce”, avatar: “assets/avatar-miranda.jpg”, action: “liked on your comment”, detail: ““Full-Face Rejuvenation Increased Patient Satisfaction +64%””, t: “2h”, type: “love” }],
  “Yesterday”: [
  { who: “Jane Harries”, avatar: null, action: “booked new appointment”, detail: “February 12, 2026, 6:00 PM”, t: “1d”, rsvp: true, type: “appointment” }],
  “Older”: [
  { who: “Dr Tim Pearce”, avatar: “assets/avatar-drtim.png”, action: “commented on your post”, detail: ““This is a nice article Katy!””, t: “3w”, type: “comment” },
  { who: “Miranda Pearce”, avatar: “assets/avatar-miranda.jpg”, action: “liked on your comment”, detail: ““Full-Face Rejuvenation Increased Patient Satisfaction +64%””, t: “4w”, type: “love” }]
};

const SUGGESTED_POSTS = [
  { who: “Dr Tim Pearce”, avatar: “assets/avatar-drtim.png”, t: “1h”, text: “The 3 biggest mistakes injectors make with lip filler — and how to fix them fast.”, img: “assets/post1-img1.png”, likes: 142, comments: 38, tag: “Technique” },
  { who: “Miranda Pearce”, avatar: “assets/avatar-miranda.jpg”, t: “3h”, text: “Patient confidence scores went up 64% after full-face rejuvenation. Here’s what changed.”, img: null, likes: 89, comments: 22, tag: “Case Study” },
  { who: “Jane Harries”, avatar: null, t: “5h”, text: “Just finished the Advanced Botox Training module. The dosing charts are absolute game-changers.”, img: “assets/post2-img1.png”, likes: 54, comments: 11, tag: “Learning” }
];

const NT_BADGE = {
  comment: { icon: "fluent:chat-16-filled", bg: "var(--brand-navy)" },
  love: { icon: "fluent:heart-16-filled", bg: "var(--reaction-love)" },
  like: { icon: "fluent:thumb-like-16-filled", bg: "var(--reaction-like)" },
  follow: { icon: "fluent:person-add-16-filled", bg: "var(--ai-purple)" },
  appointment: { icon: "fluent:calendar-checkmark-16-filled", bg: "var(--success)" }
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

function SmSection({ title }) {
  return <div className="sm-sec-h">{title}</div>;
}

function SideMenu({ open, onClose }) {
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
              <span className="sm-tier-pill" style={{ color: "rgb(206, 153, 87)" }}>YOUR TIER</span>
            </span>
            <span className="sm-tier-sub">Exclusive tier content</span>
            <span className="sm-tier-new" style={{ color: "rgb(206, 153, 87)" }}>3 new posts</span>
          </button>
          <nav className="sm-list">
            {SM_CHANNELS.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => go("CommunityMobile.html")}>
                <DSM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label" style={{ color: "rgb(0, 0, 0)" }}>{c.label}</span>
                <span className="sm-badge sm-badge-red">{c.n}</span>
              </button>
            )}
          </nav>

          <SmSection title="Membership Resources" />
          <nav className="sm-list">
            {SM_RESOURCES.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => go("MyLearning.html")}>
                <DSM.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                <span className="sm-row-label" style={{ color: "rgb(0, 0, 0)" }}>{c.label}</span>
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
                  <span className="sm-course-name" style={{ color: "rgb(0, 0, 0)" }}>{c.label}</span>
                </span>
                <span className="sm-progress"><span className="sm-progress-fill" style={{ width: c.pct + "%", backgroundColor: "rgb(206, 153, 87)" }} /></span>
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
                  <span className="sm-event-name" style={{ color: "rgb(0, 0, 0)" }}>{e.label}</span>
                  <span className="sm-event-time">{e.t}</span>
                </span>
                {e.tag && <span className="sm-event-tag" style={{ borderColor: "rgb(206, 153, 87)", color: "rgb(206, 153, 87)" }}>{e.tag}</span>}
              </button>
            )}
          </div>

          <SmSection title="My Profile" />
          <button className="sm-row sm-verify" onClick={() => go("ProfileMobile.html")}>
            <DSM.IconifyIcon name="lucide:book-open" size={23} color="var(--premium-orange)" />
            <span className="sm-row-label">Verify Profile</span>
            <span className="sm-verify-pill" style={{ backgroundColor: "rgb(206, 153, 87)" }}>Not Verified</span>
          </button>
          <nav className="sm-list">
            {SM_PROFILE.map((c) =>
            <button key={c.label} className="sm-row" onClick={() => go(c.href)}>
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

function MChips() {
  const [active, setActive] = useStateM("For You");
  return (
    <div className="m-chips" role="tablist" aria-label="Feed filters">
      {M_CHIPS.map((c) =>
      <button key={c} role="tab" aria-selected={active === c}
      className={"m-chip" + (active === c ? " on" : "")} onClick={() => setActive(c)}>{c}</button>
      )}
    </div>);

}

function MTabBar() {
  return (
    <nav className="m-tabs" aria-label="Primary">
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

}

const SHARE_CHANNELS = [
{ name: "Confidence", desc: "Share your success stories and find inspiration from others' journeys." },
{ name: "Clinical Support", desc: "Discuss complex cases and get advice from medical experts." },
{ name: "Community Chat", desc: "Casual conversations and networking with fellow professionals." },
{ name: "Business & Growth", desc: "Strategies and tips for building your medical practice." }];

function SelectChannelModal({ open, onClose }) {
  const [sel, setSel] = useStateM(null);
  useEffectM(() => {
    if (!open) {setSel(null);return;}
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div className="sc-overlay" onClick={onClose}>
      <div className="sc-modal" role="dialog" aria-modal="true" aria-labelledby="sc-title" onClick={(e) => e.stopPropagation()}>
        <header className="sc-head">
          <div>
            <h2 id="sc-title">Select a Channel</h2>
            <p>Choose which community channel you'd like to post in</p>
          </div>
          <button className="sc-x" aria-label="Close" onClick={onClose}>
            <DSM.IconifyIcon name="lucide:x" size={26} color="var(--gray-900)" />
          </button>
        </header>
        <div className="sc-sec">Following</div>
        <div className="sc-list" role="radiogroup" aria-label="Community channels">
          {SHARE_CHANNELS.map((c) =>
          <button key={c.name} className={"sc-item" + (sel === c.name ? " on" : "")}
          role="radio" aria-checked={sel === c.name} onClick={() => setSel(c.name)}>
              <span className="sc-hash">#</span>
              <span className="sc-main">
                <span className="sc-name">{c.name}</span>
                <span className="sc-desc">{c.desc}</span>
              </span>
              <span className="sc-radio" aria-hidden="true" />
            </button>
          )}
        </div>
        <footer className="sc-foot">
          <button className="sc-cancel" onClick={onClose}>Cancel</button>
          <button className="sc-continue" disabled={!sel} onClick={() => {
            try { sessionStorage.setItem("pf_post_channels", JSON.stringify(sel ? [sel] : [])); } catch (e) {}
            onClose();
            go("CreatePostMobile.html");
          }}>Continue to Post</button>
        </footer>
      </div>
    </div>);

}

function MobileHome() {
  const [menuOpen, setMenuOpen] = useStateM(false);
  const [notifOpen, setNotifOpen] = useStateM(false);
  const [shareOpen, setShareOpen] = useStateM(false);
  return (
    <div className="m-screen" data-screen-label="Home (mobile)">
      <MTopBar onMenu={() => setMenuOpen(true)} onBell={() => setNotifOpen(true)} />
      <div className="m-scroll">
        <PFAM.Feed />
      </div>
      <MTabBar />
      <button className="m-fab" aria-label="Share a Post" onClick={() => setShareOpen(true)}>
        <DSM.IconifyIcon name="lucide:plus" size={22} color="#fff" />
        Share a Post
      </button>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <SelectChannelModal open={shareOpen} onClose={() => setShareOpen(false)} />
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
