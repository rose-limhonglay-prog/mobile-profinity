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
      <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
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

function VerifyBanner() {
  const [open, setOpen] = useStatePM(true);
  if (!open) return null;
  return (
    <div className="pm-verify">
      <button className="x" aria-label="Dismiss" onClick={() => setOpen(false)}><DSPM.IconifyIcon name="lucide:x" size={22} color="var(--gray-700)" /></button>
      <div className="hd">
        <DSPM.IconifyIcon name="fluent:shield-checkmark-16-filled" size={30} color="var(--verify-check,#1f8ddb)" />
        <div>
          <div className="t">Verify your medical credentials</div>
          <div className="s">Adding more credentials helps people know you're the real deal.</div>
        </div>
      </div>
      <button className="full" type="button">Edit Page</button>
    </div>);

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
                <button className="pm-ig-btn">Share Profile</button>
                <button className="pm-ig-btn icon" aria-label="Add people"><DSPM.IconifyIcon name="lucide:user-plus" size={20} color="var(--brand-navy)" /></button>
              </div>
            </div>
            <VerifyBanner />
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
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-card)" }}><PMScreen /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <IOSDevice width={440} height={956}><PMScreen /></IOSDevice>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ProfileMobileApp />);
