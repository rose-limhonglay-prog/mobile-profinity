/* ===========================================================================
   PROfinity — Events (mobile)
   Upcoming Events list → Event Detail → live video call (with Live Chat).
   Composed on the bound DS bundle. Suffixed -EV to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateEV, useEffect: useEffectEV } = React;
const DSEV = window.ProfinityDesignSystem_c2b5cc;
const PFAEV = window.PFApp;

function goEV(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const EVENTS_LIST = [
  { id: "tt", title: "Technique Tuesday", host: "Dr Tim Pearce", banner: "assets/event-technique-tuesday.png",
    date: "March 17, 2026", time: "20:00 GMT", primary: true },
  { id: "ac", title: "Art Codes Live Webinar", host: "Dr Tim Pearce", banner: "assets/event-art-codes.png",
    date: "March 24, 2026", time: "19:00 GMT", primary: false },
  { id: "ch", title: "Chew the FATPAD", host: "Dr Tim Pearce", banner: "assets/event-art-codes.png",
    date: "June 12, 2026", time: "21:00 BST", primary: false },
];

const EV_DETAIL = {
  title: "Chew the FATPAD", host: "Dr Tim Pearce", banner: "assets/event-technique-tuesday.png",
  date: "June 12, 2026", time: "9:00 PM", attendees: "380",
  about: "Join Dr. Tim Pearce every week for Technique Tuesday, a live, interactive session where he shares his expert knowledge, answers your burning questions, and demonstrates the latest techniques in aesthetic medicine. Don't miss this opportunity to enhance your skills and stay ahead of the curve!",
  learn: ["Step-by-Step Technique demonstration", "Interactive Group Exercise", "Individual Feedback Sessions", "Real-world Case Studies", "Q&A Panel Discussion"],
  stats: [{ n: "342", l: "Attendees", s: "Joined" }, { n: "45", l: "Pending", s: "Awaiting" }, { n: "12", l: "Cancelled", s: "Withdrawn" }],
  status: [
    { icon: "lucide:calendar", t: "17 August 2026" },
    { icon: "lucide:clock", t: "20:00 GMT | 16:00 ET" },
    { icon: "lucide:timer", t: "60 minutes" },
    { icon: "lucide:video", t: "Live Webinar" },
    { icon: "lucide:star", t: "Premium Event" },
  ],
  attend: ["Aesthetic Practitioners", "Holistic Health Coaches", "Fitness Instructors", "Nutritional Therapists", "Wellness Consultants"],
};

const EV_TABS = [
  { key: "Home", label: "Home", icon: "lucide:home", href: "NewsfeedMobile.html" },
  { key: "Profile", label: "Profile", icon: "lucide:user", href: "ProfileMobile.html" },
  { key: "Learning", label: "My Learning", icon: "lucide:book-open", href: "LearningMobile.html" },
  { key: "Community", label: "Community", icon: "lucide:users", href: "CommunityMobile.html", dot: "12" },
  { key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "Agent.html" },
];

const CALL_PEOPLE = [
  { name: "Sarah", avatar: "assets/avatar-katy.jpg" },
  { name: "Jordan", avatar: "assets/avatar-drtim.png" },
  { name: "Priya", avatar: "assets/avatar-katy.jpg" },
  { name: "Marcus", avatar: "assets/avatar-drtim.png" },
];

const CHAT_SEED = [
  { who: "Dr Marcus", me: false, text: "Hi Katy, I hope you're doing well! I wanted to share a new case study." },
  { who: "Katy Wilson", me: true, text: "Hi Dr Marcus, I trust you're having a productive day! That sounds great." },
  { who: "Dr Marcus", me: false, text: "Yes, I typically use a 22G 70mm cannula with a fanning technique." },
];

function useDeviceScaleEV() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateEV(calc);
  useEffectEV(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileEV() {
  const [mobile, setMobile] = useStateEV(() => window.matchMedia('(max-width:768px)').matches);
  useEffectEV(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

function EvTabBar({ active }) {
  return (
    <nav className="ev-tabs" aria-label="Primary">
      {EV_TABS.map((t) => (
        <button key={t.key} className={"ev-tab" + (t.key === active ? " on" : "")} onClick={() => goEV(t.href)}>
          <span className="ic">
            <DSEV.IconifyIcon name={t.icon} size={23} color={t.key === active ? "var(--brand-navy)" : "var(--gray-450)"} />
            {t.dot && <span className="dot">{t.dot}</span>}
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

/* ---- screen 1: events list ---- */
function EventsList({ onBack, onOpen }) {
  return (
    <div className="ev-screen" data-screen-label="Upcoming Events">
      <header className="ev-head">
        <button className="ev-back" aria-label="Back" onClick={onBack}><DSEV.IconifyIcon name="lucide:arrow-left" size={22} color="var(--brand-navy)" /></button>
        <span className="ev-title">Upcoming Events</span>
        <span className="spacer" />
      </header>
      <div className="ev-scroll">
        <label className="ev-search"><DSEV.Icon name="search" size={20} color="var(--gray-450)" />
          <input placeholder="Search events…" aria-label="Search events" />
        </label>
        {EVENTS_LIST.map((e) => (
          <div className="ev-card" key={e.id} onClick={() => onOpen(e)}>
            <img className="banner" src={e.banner} alt={e.title} />
            <div className="body">
              <h3 className="ttl">{e.title}</h3>
              <div className="host">Hosted by <b>{e.host}</b></div>
              <div className="meta">
                <span><DSEV.IconifyIcon name="lucide:calendar" size={18} color="var(--brand-navy)" />{e.date}</span>
                <span><DSEV.IconifyIcon name="lucide:clock" size={18} color="var(--brand-navy)" />{e.time}</span>
              </div>
              <button className={"ev-cta" + (e.primary ? "" : " ghost")} onClick={(ev) => { ev.stopPropagation(); onOpen(e); }}>
                View Event
              </button>
            </div>
          </div>
        ))}
      </div>
      <EvTabBar active="Home" />
    </div>
  );
}

/* ---- screen 2: event detail ---- */
function EventDetail({ onBack, onJoin }) {
  const d = EV_DETAIL;
  const [tab, setTab] = useStateEV("Overview");
  return (
    <div className="ev-screen" data-screen-label="Event Details">
      <header className="ev-head">
        <button className="ev-back" aria-label="Back" onClick={onBack}><DSEV.IconifyIcon name="lucide:arrow-left" size={22} color="var(--brand-navy)" /></button>
        <span className="ev-title">Event Details</span>
        <span className="spacer" />
      </header>
      <div className="ev-scroll">
        <div className="ev-hero" style={{ backgroundImage: "url(" + d.banner + ")" }} />
        <div className="ev-detail-body">
          <span className="ev-live-badge">Live Event</span>
          <h1 className="ttl">{d.title}</h1>
          <div className="ev-by">Event By: <b>{d.host}</b></div>
          <div className="ev-detail-meta">
            <span><DSEV.IconifyIcon name="lucide:calendar" size={20} color="var(--brand-navy)" />{d.date}</span>
            <span><DSEV.IconifyIcon name="lucide:clock" size={20} color="var(--brand-navy)" />{d.time}</span>
          </div>
          <div className="ev-attend">
            <span className="ev-faces">
              {CALL_PEOPLE.concat(CALL_PEOPLE.slice(0, 3)).map((p, i) => <DSEV.Avatar key={i} name={p.name} src={p.avatar} size={32} />)}
            </span>
            <span className="n">{d.attendees} other attendees</span>
          </div>
          <div className="ev-detail-actions">
            <button className="ev-detail-cta" onClick={onJoin}>Join Now!</button>
            <button className="ev-detail-cta ghost">Share Event</button>
          </div>

          <div className="ev-dtabs" role="tablist">
            {["Overview", "About the Host", "Agenda"].map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} className={"ev-dtab" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          <h2 className="ev-sec-h">About this event</h2>
          <p className="ev-sec-p">{d.about}</p>

          <h2 className="ev-sec-h">You'll learn:</h2>
          <ul className="ev-checklist">
            {d.learn.map((l, i) => <li key={i}><DSEV.IconifyIcon name="lucide:check" size={19} color="var(--brand-navy)" />{l}</li>)}
          </ul>

          <div className="ev-stats">
            {d.stats.map((s, i) => (
              <div className="ev-stat" key={i}><span className="l">{s.l}</span><span className="n">{s.n}</span><span className="s">{s.s}</span></div>
            ))}
          </div>

          <h2 className="ev-sec-h">Event Status</h2>
          <div className="ev-status">
            {d.status.map((s, i) => (
              <div className="ev-status-row" key={i}><DSEV.IconifyIcon name={s.icon} size={20} color="var(--brand-navy)" />{s.t}</div>
            ))}
          </div>

          <h2 className="ev-sec-h">Who Should Attend</h2>
          <ul className="ev-checklist">
            {d.attend.map((l, i) => <li key={i}><DSEV.IconifyIcon name="lucide:check" size={19} color="var(--brand-navy)" />{l}</li>)}
          </ul>

          <h2 className="ev-sec-h">Need Help?</h2>
          <button className="ev-help">
            <span>Contact Support - We are here to help if you have any questions about this event.</span>
            <DSEV.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-450)" />
          </button>
        </div>
      </div>
      <EvTabBar active="Home" />
    </div>
  );
}

/* ---- live chat overlay ---- */
function LiveChat({ open, onClose }) {
  const [msgs, setMsgs] = useStateEV(CHAT_SEED);
  const [v, setV] = useStateEV("");
  const send = () => { const t = v.trim(); if (!t) return; setMsgs((m) => [...m, { who: "Katy Wilson", me: true, text: t }]); setV(""); };
  return (
    <div className={"ev-chat-wrap" + (open ? " open" : "")} aria-hidden={!open}>
      <div className="ev-chat-scrim" onClick={onClose} />
      <aside className="ev-chat" role="dialog" aria-modal="true" aria-label="Live Chat">
        <div className="ev-chat-head">
          <span className="t">Live Chat</span>
          <button aria-label="Close chat" onClick={onClose}><DSEV.IconifyIcon name="lucide:x" size={22} color="var(--text-primary)" /></button>
        </div>
        <div className="ev-chat-body">
          {msgs.map((m, i) => (
            <div className={"ev-msg " + (m.me ? "me" : "them")} key={i}>
              <div className="who">{m.who}</div>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="ev-chat-foot">
          <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Type a message…" />
          <button className="ev-chat-send" aria-label="Send" onClick={send}><DSEV.IconifyIcon name="lucide:send" size={20} color="var(--white)" /></button>
        </div>
      </aside>
    </div>
  );
}

/* ---- screen 3: video call ---- */
function VideoCall({ onLeave }) {
  const [chat, setChat] = useStateEV(false);
  const [muted, setMuted] = useStateEV(true);
  const [cam, setCam] = useStateEV(true);
  return (
    <div className="ev-call" data-screen-label="Live Call">
      <div className="ev-call-top">
        <img src="assets/profinity-icon-twist.png" alt="PROfinity" />
        <span className="ev-call-timer"><DSEV.IconifyIcon name="lucide:clock" size={17} color="var(--white)" />00:32:54</span>
      </div>
      <div className="ev-stage">
        <img src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
        <div className="ev-pip"><img src="assets/avatar-katy.jpg" alt="You" /><span>You</span></div>
        <span className="ev-name-tag">Dr Tim Pearce <DSEV.IconifyIcon name="lucide:mic" size={15} color="var(--white)" /></span>
        <span className="ev-mic-off"><DSEV.IconifyIcon name="lucide:mic-off" size={14} color="var(--white)" />Mic off</span>
      </div>
      <div className="ev-thumbs">
        {CALL_PEOPLE.map((p, i) => (
          <div className="ev-thumb" key={i}><img src={p.avatar} alt={p.name} /><span>{p.name}</span></div>
        ))}
      </div>
      <div className="ev-controls">
        <button className={"ev-ctl" + (muted ? "" : " on")} onClick={() => setMuted((m) => !m)}>
          <span className="cbtn"><DSEV.IconifyIcon name={muted ? "lucide:mic-off" : "lucide:mic"} size={22} color="var(--white)" /></span>Mute
        </button>
        <button className={"ev-ctl" + (cam ? " on" : "")} onClick={() => setCam((c) => !c)}>
          <span className="cbtn"><DSEV.IconifyIcon name={cam ? "lucide:video" : "lucide:video-off"} size={22} color="var(--white)" /></span>Camera
        </button>
        <button className="ev-ctl">
          <span className="cbtn"><DSEV.IconifyIcon name="lucide:users" size={22} color="var(--white)" /></span>People
        </button>
        <button className="ev-ctl" onClick={() => setChat(true)}>
          <span className="cbtn"><DSEV.IconifyIcon name="lucide:message-circle" size={22} color="var(--white)" /></span>Chat
        </button>
        <button className="ev-ctl leave" onClick={onLeave}>
          <span className="cbtn"><DSEV.IconifyIcon name="lucide:phone-off" size={22} color="var(--white)" /></span>Leave
        </button>
      </div>
      <LiveChat open={chat} onClose={() => setChat(false)} />
    </div>
  );
}

/* ---- waiting room (between Join Now and the live call) ---- */
function WaitingRoom({ onBack, onAdmit }) {
  const d = EV_DETAIL;
  const [muted, setMuted] = useStateEV(false);
  const [cam, setCam] = useStateEV(true);
  return (
    <div className="ev-screen" data-screen-label="Waiting Room">
      <header className="ev-head">
        <button className="ev-back" aria-label="Back" onClick={onBack}><DSEV.IconifyIcon name="lucide:arrow-left" size={22} color="var(--brand-navy)" /></button>
        <span className="ev-title">Waiting Room</span>
        <span className="spacer" />
      </header>
      <div className="ev-scroll">
        <div className="ev-wait-banner">
          <DSEV.IconifyIcon name="lucide:circle-check" size={26} color="var(--success)" />
          <div>
            <div className="t">You're in the waiting room</div>
            <div className="s">The host will let you in shortly. Thank you for your patience.</div>
          </div>
        </div>
        <div className="ev-wait-card">
          <span className="ev-live-badge">Live Event</span>
          <h1 className="ttl">Technique Tuesday</h1>
          <p className="ev-wait-sub">Weekly live techniques, Q&amp;A and expert insights to elevate your skills</p>
          <div className="ev-wait-host"><DSEV.Avatar name="Dr Tim Pearce" src="assets/avatar-katy.jpg" size={36} />Hosted by <b>Dr Tim Pearce</b></div>
          <div className="ev-wait-meta">
            <span><DSEV.IconifyIcon name="lucide:calendar" size={19} color="var(--brand-navy)" />17 August 2026</span>
            <span className="dotsep">•</span>
            <span><DSEV.IconifyIcon name="lucide:clock" size={19} color="var(--brand-navy)" />20:00 GMT | 16:00 ET</span>
          </div>
          <div className="ev-wait-meta"><span><DSEV.IconifyIcon name="lucide:timer" size={19} color="var(--brand-navy)" />60 minutes</span></div>
          <button className="ev-wait-cal"><u>Add to calendar</u></button>
        </div>
        <div className="ev-wait-video">
          <img src="assets/waiting-self-preview.png" alt="You" />
          <span className="ev-wait-you">You</span>
          <div className="ev-wait-vctl">
            <button className={"vbtn" + (muted ? " off" : "")} aria-label="Mic" onClick={() => setMuted((m) => !m)}>
              <DSEV.IconifyIcon name={muted ? "lucide:mic-off" : "lucide:mic"} size={20} color="var(--white)" />
            </button>
            <button className={"vbtn" + (cam ? "" : " off")} aria-label="Camera" onClick={() => setCam((c) => !c)}>
              <DSEV.IconifyIcon name={cam ? "lucide:video" : "lucide:video-off"} size={20} color="var(--white)" />
            </button>
          </div>
        </div>
        <div className="ev-detail-actions ev-wait-actions">
          <button className="ev-detail-cta" onClick={onAdmit}>Join Now!</button>
          <button className="ev-detail-cta ghost">Share Event</button>
        </div>
        <p className="ev-wait-note">You'll automatically join the live session when the host admits you.</p>
        <h2 className="ev-sec-h">Need Help?</h2>
        <button className="ev-help">
          <DSEV.IconifyIcon name="lucide:circle-help" size={22} color="var(--brand-navy)" />
          <span>Contact Support - We are here to help if you have any questions about this event.</span>
          <DSEV.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-450)" />
        </button>
      </div>
      <EvTabBar active="Home" />
    </div>
  );
}

function EventsContent() {
  const [screen, setScreen] = useStateEV("list"); // list | detail | waiting | call
  return (
    <>
      {screen === "list" && <EventsList onBack={() => goEV("NewsfeedMobile.html")} onOpen={() => setScreen("detail")} />}
      {screen === "detail" && <EventDetail onBack={() => setScreen("list")} onJoin={() => setScreen("waiting")} />}
      {screen === "waiting" && <WaitingRoom onBack={() => setScreen("detail")} onAdmit={() => setScreen("call")} />}
      {screen === "call" && <VideoCall onLeave={() => setScreen("detail")} />}
    </>
  );
}

function EventsApp() {
  const mobile = useIsMobileEV();
  const scale = useDeviceScaleEV();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><EventsContent /></div>;
  }
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><EventsContent /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<EventsApp />);
