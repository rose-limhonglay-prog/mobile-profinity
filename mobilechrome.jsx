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

  function MTopBarC({ onMenu, onBell, dark }) {
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
        <button className="m-iconbtn" aria-label="Messages">
          <DSC.IconifyIcon name="lucide:message-circle" size={20} color="var(--brand-navy)" />
          <span className="dot">12</span>
        </button>
      </header>);
  }

  const SM_CHANNELS_C = [
    { label: "Clinical Chat", icon: "lucide:stethoscope", n: 10 },
    { label: "Freedom Path", icon: "lucide:feather", n: 2 },
    { label: "Tech Team", icon: "lucide:cpu", n: 1 },
    { label: "Business & Mindset", icon: "lucide:briefcase", n: 5 }];
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
    { label: "Notifications", icon: "lucide:calendar", href: null },
    { label: "Display Settings", icon: "lucide:cpu", href: "DisplaySettings.html" },
    { label: "Privacy & Security", icon: "lucide:book-open", href: null }];

  const NOTIFS_C = {
    "New": [
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
    appointment: { icon: "fluent:calendar-checkmark-16-filled", bg: "var(--success)" }
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
            <SmSectionC title="Communities" />
            <button className="sm-tier" onClick={() => goC("CommunityMobile.html")}>
              <span className="sm-tier-top">
                <span className="sm-tier-name">Confidence Path</span>
                <span className="sm-tier-pill" style={{ color: "rgb(206, 153, 87)" }}>YOUR TIER</span>
              </span>
              <span className="sm-tier-sub">Exclusive tier content</span>
              <span className="sm-tier-new" style={{ color: "rgb(206, 153, 87)" }}>3 new posts</span>
            </button>
            <nav className="sm-list">
              {SM_CHANNELS_C.map((c) =>
                <button key={c.label} className="sm-row" onClick={() => goC("CommunityMobile.html")}>
                  <DSC.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                  <span className="sm-row-label" style={{ color: "rgb(0, 0, 0)" }}>{c.label}</span>
                  <span className="sm-badge sm-badge-red">{c.n}</span>
                </button>
              )}
            </nav>
            <SmSectionC title="Membership Resources" />
            <nav className="sm-list">
              {SM_RESOURCES_C.map((c) =>
                <button key={c.label} className="sm-row" onClick={() => goC("LearningMobile.html")}>
                  <DSC.IconifyIcon name={c.icon} size={23} color="var(--gray-900)" />
                  <span className="sm-row-label" style={{ color: "rgb(0, 0, 0)" }}>{c.label}</span>
                  {c.n != null && <span className="sm-badge sm-badge-gray">{c.n}</span>}
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
    const [dark, setDark] = useStateC(() => {
      try { return localStorage.getItem("pf-mobile-dark") === "1"; } catch (e) { return false; }
    });
    useEffectC(() => {
      try { localStorage.setItem("pf-mobile-dark", dark ? "1" : "0"); } catch (e) {}
    }, [dark]);
    return (
      <React.Fragment>
        <MTopBarC onMenu={() => setMenuOpen(true)} onBell={() => setNotifOpen(true)} dark={dark} />
        <SideMenuC open={menuOpen} onClose={() => setMenuOpen(false)} dark={dark} onToggleDark={() => setDark((v) => !v)} />
        <NotificationsPanelC open={notifOpen} onClose={() => setNotifOpen(false)} />
      </React.Fragment>);
  }

  window.MobileChromeC = MobileChromeC;
})();
