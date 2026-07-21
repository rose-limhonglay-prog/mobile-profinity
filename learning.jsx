/* ===========================================================================
   PROfinity Academy — My Learning
   Composed from the bound Profinity Design System bundle. The course rows use
   the DS CourseTile / Tabs / LevelBadge / ProgressBar; bespoke rail cards
   (locked resource, price, success-path, brand intro) are built from tokens.
   =========================================================================== */
const { useState } = React;
const { useEffect: useEffectL } = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const { TopNav, CourseTile, Tabs, LevelBadge, IconifyIcon, Icon } = DS;

const ME = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const TUTOR = "Dr Tim Pearce";

const IMG = {
  lip: "assets/clinic-lip-design.png",
  protox: "assets/clinic-toxin-guide.png",
  temple: "assets/clinic-treatment-collage.png",
  gold: "assets/texture-gold.png",
  logo: "assets/profinity-academy-logo-full.png",
  advancedLip: "assets/course-advanced-lip-techniques.jpg",
};

const TABS = ["All Courses", "Free Resources", "New Courses", "Recommended Courses", "Upcoming Webinars", "Certification Programs"];

const MY_COURSES = [
  { image: IMG.lip, level: "Beginner", title: "8D Lip Design", description: "Discover a complete view of human anatomy for deeper learning.", progress: 20, cta: "Continue learning", active: true },
  { image: IMG.temple, level: "Intermediate", title: "Temple Filler", description: "Confidently Inject Temples & add YOUTH back into your patients.", progress: 0, cta: "Start learning" },
  { image: IMG.protox, level: "Advance", title: "Protox Course", description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.", progress: 0, cta: "Start learning" },
  { image: IMG.temple, level: "Advance", title: "Temple Filler", description: "Confidently Inject Temples & add YOUTH back into your patients.", progress: 0, cta: "Start learning" },
];

const RESOURCES = [
  { image: IMG.temple, title: "13 Risky Injection Areas", lines: ["Facial Vein Mapping", "Navigating Risky Zones"] },
  { image: IMG.protox, title: "Aspirating Experiment", lines: ["Sample Analysis", "Essential Lab Techniques"] },
  { image: IMG.lip, title: "Bruising Checklist", lines: ["Injection Site Prep", "Minimize Post-Injection Bruising"] },
  { image: IMG.temple, title: "Botox Lesson Hook", lines: ["Delve into the nuances of", "assessment & treatment"] },
];

const PATHS = [
  { image: IMG.protox, title: "Botox", description: "Discover a complete view of human anatomy for deeper learning.", price: "£1,998" },
  { image: IMG.temple, title: "Filler", description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.", price: "£794" },
  { image: IMG.lip, title: "Lips", description: "Confidently Inject Temples & add YOUTH back into your patients.", price: "£1,234" },
];

const RECOMMENDED = [
  { image: IMG.lip, level: "Beginner", title: "Dynamic Facial Structures", description: "Explore intricate facial anatomy to enhance artistry and understanding.", by: "Dr Emily Carter", price: "£1,245" },
  { image: IMG.advancedLip, level: "Intermediate", title: "Advanced Lip Techniques", description: "Master the nuances of lip anatomy for precise techniques.", by: "Prof. Jonah Lee", price: "£1,300" },
  { image: IMG.temple, level: "Intermediate", title: "Comprehensive Facial Anatomy", description: "A thorough exploration of facial structures for artists and medics.", by: "Dr Lisa Huang", price: "£1,550" },
  { image: IMG.protox, level: "Intermediate", title: "Expert Lip Modelling", description: "Gain insights into the craft of lip modelling with expert guidance.", by: "Dr James Smith", price: "£1,250" },
];

const NEW_COURSES = [
  { image: IMG.lip, level: "Intermediate", title: "8D Lip Design", description: "Discover a complete view of human anatomy for deeper learning.", by: TUTOR, price: "£112" },
  { image: IMG.protox, level: "Intermediate", title: "Protox Course", description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.", by: TUTOR, price: "£99" },
  { image: IMG.temple, level: "Intermediate", title: "Temple Filler", description: "Confidently Inject Temples & add YOUTH back into your patients.", by: TUTOR, price: "£100" },
  { image: IMG.temple, level: "Intermediate", title: "Brow Lift Training", description: "Learn expert techniques for achieving flawless brow lifts.", by: TUTOR, price: "£99" },
];

const POPULAR = [
  { image: IMG.lip, level: "Advance", title: "8D Lip Design", description: "Discover a complete view of human anatomy for deeper learning.", by: TUTOR, price: "£112" },
  { image: IMG.protox, level: "Advance", title: "Protox Course", description: "Elevate Your Botulinum Toxin Skills, 10x Your Confidence, and more.", by: TUTOR, price: "£99" },
  { image: IMG.temple, level: "Advance", title: "Temple Filler", description: "Confidently Inject Temples & add YOUTH back into your patients.", by: TUTOR, price: "£100" },
  { image: IMG.temple, level: "Advance", title: "Brow Lift Training", description: "Learn expert techniques for achieving flawless brow lifts.", by: TUTOR, price: "£99" },
];

/* ---------------------------------------------------------------- pieces -- */
function SectionHead({ title, pill, viewAll = true, big }) {
  return (
    <div className="sec-h">
      <span className="t" style={big ? null : null}>{title}</span>
      {pill}
      <span className="grow" />
      {viewAll && <a className="viewall" tabIndex={0}>View All</a>}
    </div>
  );
}

function ResourceCard({ r }) {
  return (
    <div className="rcard w-card">
      <div className="thumb" style={{ backgroundImage: "url(" + r.image + ")" }}>
        <LevelBadge level="Intermediate" className="lvl" />
        <span className="lock"><IconifyIcon name="lucide:lock" size={20} color="var(--white)" /></span>
      </div>
      <div className="body">
        <div className="ti">{r.title}</div>
        {r.lines.map((l, i) => <div className="ds" key={i}>{l}</div>)}
        <div className="by">{TUTOR}</div>
        <button type="button" className="ghost" style={{ marginTop: 14 }}>Learn More</button>
      </div>
    </div>
  );
}

function PriceCard({ c }) {
  return (
    <div className="pcard w-card">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        {c.level && <LevelBadge level={c.level} className="lvl" />}
        <span className="play"><IconifyIcon name="fluent:play-16-filled" size={20} color="var(--ai-purple)" /></span>
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="ds">{c.description}</div>
        <div className="by">{c.by}</div>
        <div className="foot">
          <span className="price">{c.price}</span>
          <button type="button" className="ghost">Learn More</button>
        </div>
      </div>
    </div>
  );
}

function PathCard({ c }) {
  return (
    <div className="pcard w-card">
      <div className="thumb" style={{ backgroundImage: "url(" + c.image + ")" }}>
        <span className="badge-path">Success Path</span>
      </div>
      <div className="body">
        <div className="ti">{c.title}</div>
        <div className="ds">{c.description}</div>
        <div className="by">{TUTOR}</div>
        <div className="foot">
          <span className="price">{c.price}</span>
          <button type="button" className="ghost">Learn More</button>
        </div>
      </div>
    </div>
  );
}

function PathIntro() {
  return (
    <div className="intro w-intro">
      <img src={IMG.logo} alt="PROfinity Academy" />
      <div className="ti">Profinity Success Paths Certificates</div>
      <div className="ds">Learn more about success paths, and build your journey towards achieving your goals with tailored strategies and resources.</div>
      <button type="button" className="out">Learn More</button>
    </div>
  );
}

/* ---------------------------------------------------------------- skeletons -- */
function SkeletonCourseCard() {
  return (
    <div className="skel-card w-course">
      <div className="skel" style={{ height: 150 }} />
      <div className="sk-body">
        <div className="skel sk-line" style={{ width: "30%", height: 10 }} />
        <div className="skel sk-line" style={{ width: "80%" }} />
        <div className="skel sk-line" style={{ width: "90%", height: 10 }} />
        <div className="skel" style={{ height: 8, width: "100%", borderRadius: "var(--r-pill)", marginTop: 4 }} />
        <div className="skel sk-btn" />
      </div>
    </div>
  );
}
function SkeletonResourceCard() {
  return (
    <div className="skel-card w-card">
      <div className="skel" style={{ height: 150 }} />
      <div className="sk-body">
        <div className="skel sk-line" style={{ width: "75%" }} />
        <div className="skel sk-line" style={{ width: "90%" }} />
        <div className="skel sk-line" style={{ width: "90%" }} />
        <div className="skel sk-line" style={{ width: "45%" }} />
        <div className="skel sk-btn" />
      </div>
    </div>
  );
}
function SkeletonPriceCard() {
  return (
    <div className="skel-card w-card">
      <div className="skel" style={{ height: 158 }} />
      <div className="sk-body">
        <div className="skel sk-line" style={{ width: "70%" }} />
        <div className="skel sk-line" style={{ width: "90%" }} />
        <div className="skel sk-line" style={{ width: "90%" }} />
        <div className="skel sk-line" style={{ width: "50%" }} />
        <div className="sk-foot">
          <div className="skel sk-line" style={{ width: 64, height: 22 }} />
          <div className="skel" style={{ height: 42, width: 110, borderRadius: "var(--r-sm)" }} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- app ----- */
function pfTagActiveNav(activeLabel) {
  document.querySelectorAll("#pf-root nav > button").forEach((b) => {
    const label = b.textContent.replace(/[0-9]/g, "").trim();
    const active = label === activeLabel;
    b.style.setProperty("-webkit-appearance", "none", "important");
    b.style.setProperty("appearance", "none", "important");
    b.style.setProperty("background", active ? "rgb(225, 223, 242)" : "none", "important");
    b.style.setProperty("transition", "background .18s ease", "important");
    const path = b.querySelector("svg path");
    if (path) path.style.setProperty("fill", active ? "currentColor" : "", "important");
  });
}

function navigate(label) {
  var u = { Home: "Newsfeed.html", Profile: "Profile.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) (window.pfGo || function (x) { window.location.href = x; })(u);
}

function MyLearningApp() {
  const [tab, setTab] = useState("All Courses");
  const [loading, setLoading] = useState(true);
  useEffectL(() => pfTagActiveNav("My Learning"));
  useEffectL(() => { const t = setTimeout(() => setLoading(false), 1800); return () => clearTimeout(t); }, []);

  return (
    <div className="app" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNav active="My Learning" user={ME} logoSrc="assets/profinity-academy-logo-full.png"
        onNavigate={navigate}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="page" data-screen-label="My Learning">
        <h1 className="welcome">Welcome, Katy!</h1>
        <p className="welcome-sub">Your goal is to grow in <u>aesthetics or medical school</u></p>

        <div className="lrn-tabs">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>

        <label className="search">
          <Icon name="search" size={20} color="var(--gray-450)" />
          <input placeholder="Search course…" aria-label="Search course" />
        </label>

        {/* My Courses (sunken panel) */}
        <section className="panel" data-screen-label="My Courses">
          <SectionHead title="My Courses" />
          <div className="row">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCourseCard key={i} />)
              : MY_COURSES.map((c, i) => <CourseTile key={i} {...c} className="w-course" style={{ width: 264 }} />)}
          </div>
        </section>

        {/* Free Resources */}
        <section className="sec" data-screen-label="Free Resources">
          <SectionHead title="Free Resources"
            pill={<button type="button" className="pill navy"><Icon name="bookmark" size={16} color="var(--white)" />Complete Survey To Unlock Resources Archive <IconifyIcon name="lucide:arrow-right" size={16} color="var(--white)" /></button>} />
          <div className="row">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonResourceCard key={i} />)
              : RESOURCES.map((r, i) => <ResourceCard key={i} r={r} />)}
          </div>
          <div className="sec-divider" />
        </section>

        {/* Success Path (cream panel) */}
        <section className="sec" data-screen-label="Success Path">
          <div className="sec-h"><span className="t">Success Path</span></div>
          <div className="panel cream">
            <div className="row">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonPriceCard key={i} />)
                : [<PathIntro key="intro" />, ...PATHS.map((c, i) => <PathCard key={i} c={c} />)]}
            </div>
          </div>
        </section>

        {/* Recommended */}
        <section className="sec" data-screen-label="Recommended Course">
          <SectionHead title="Recommended Course"
            pill={<button type="button" className="pill gold"><IconifyIcon name="fluent:crown-16-filled" size={16} color="var(--white)" />Upgrade to Premium for 15% OFF all products <IconifyIcon name="lucide:arrow-right" size={16} color="var(--white)" /></button>} />
          <div className="row">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonPriceCard key={i} />)
              : RECOMMENDED.map((c, i) => <PriceCard key={i} c={c} />)}
          </div>
          <div className="sec-divider" />
        </section>

        {/* New Courses */}
        <section className="sec" data-screen-label="New Courses">
          <SectionHead title="New Courses" />
          <div className="row">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonPriceCard key={i} />)
              : NEW_COURSES.map((c, i) => <PriceCard key={i} c={c} />)}
          </div>
          <div className="sec-divider" />
        </section>

        {/* Popular Courses */}
        <section className="sec" data-screen-label="Popular Courses">
          <SectionHead title="Popular Courses" />
          <div className="row">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonPriceCard key={i} />)
              : POPULAR.map((c, i) => <PriceCard key={i} c={c} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MyLearningApp />);
