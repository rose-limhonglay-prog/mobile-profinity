/* ===========================================================================
   PROfinity — Profile (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -PM to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStatePM, useEffect: useEffectPM } = React;
const DSPM = window.ProfinityDesignSystem_c2b5cc;

function goPM(url) {(window.pfGo || function (u) {window.location.href = u;})(url);}

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
{ key: "Agent", label: "Agent", icon: "lucide:sparkles", href: "Agent.html" }];


function PMTopBar() {
  return (
    <header className="pm-top">
      <button className="pm-burger" aria-label="Menu"><DSPM.IconifyIcon name="lucide:menu" size={24} color="var(--gray-700)" /></button>
      <img className="m-logo-light" src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      <img className="m-logo-dark" src="assets/profinity-academy-logo-dark.jpg" alt="PROfinity Academy" />
      <span className="grow" />
      <button className="pm-iconbtn" aria-label="Search"><DSPM.Icon name="search" size={21} color="var(--brand-navy)" /></button>
      <button className="pm-iconbtn" aria-label="Notifications">
        <DSPM.IconifyIcon name="lucide:bell" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
      <button className="pm-iconbtn" aria-label="Messages">
        <DSPM.IconifyIcon name="lucide:message-circle" size={21} color="var(--brand-navy)" /><span className="dot">12</span>
      </button>
    </header>);

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
  return (
    <div className="pm-screen" data-screen-label="Profile (mobile)">
          <PMTopBar />
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
                <img src="assets/badge-m.svg" alt="Member badge" width="20" height="20" style={{ marginLeft: -5 }} />
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
