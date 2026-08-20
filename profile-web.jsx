/* ===========================================================================
   PROfinity — Profile (desktop web)
   Layout ported from the design system's app UI kit (ui_kits/app/ProfileScreen.jsx
   inside _ds_bundle.js) — profile header, summit card, verify banner, membership
   + community-channel + suggestions rail — using the DS's own ProfileHeader/
   MembershipCard/ChannelItem/Avatar/Button/Icon primitives and its window.APP_DATA
   sample content. Not mounted via window.ProfileScreen directly — see
   community-web.jsx's header comment for why that function is broken as shipped
   (it destructures window.ProfinityDesignSystem_c2b5cc before the bundle finishes
   populating it). Destructuring here, in a separate script tag that runs after
   the whole bundle has loaded, doesn't have that problem.
   =========================================================================== */
const { useEffect: useEffectPW } = React;
const DS_PW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavPW, ProfileHeader, MembershipCard, ChannelItem: ChannelItemPW, Avatar: AvatarPW, Button: ButtonPW, Icon: IconPW, IconifyIcon: IconifyIconPW } = DS_PW;
const { Panel: PanelPW, Rail: RailPW } = window.Kit;

const ME_PW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

/* Same asset-path fix as community-web.jsx — the kit's sample data assumes
   it's served from ui_kits/app/index.html, not the site root. */
(function fixKitAssetPaths() {
  var OLD_PREFIX = "../../assets/images/";
  var RENAMES = {
    "course-8d-lip.png": "course-8d-lip-design.jpg",
    "cover-gold-texture.png": "texture-gold.png",
    "post-beforeafter.png": "clinic-treatment-collage.png"
  };
  function fix(v) {
    if (v.indexOf(OLD_PREFIX) !== 0) return v;
    var file = v.slice(OLD_PREFIX.length);
    return "assets/" + (RENAMES[file] || file);
  }
  function walk(obj) {
    if (!obj || typeof obj !== "object") return;
    Object.keys(obj).forEach(function (k) {
      var v = obj[k];
      if (typeof v === "string") obj[k] = fix(v);
      else if (v && typeof v === "object") walk(v);
    });
  }
  if (window.APP_DATA) walk(window.APP_DATA);
})();

function pfTagActiveNavPW(activeLabel) {
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

function navigatePW(label) {
  var u = { Home: "NewsfeedWeb.html", Community: "Community.html", "My Learning": "MyLearning.html", Agent: "Agent.html" }[label];
  if (u) (window.pfGo || function (x) { window.location.href = x; })(u);
}

function SummitCard({ s }) {
  const Meta = ({ glyph, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: "var(--fs-body-lg)", color: "var(--text-primary)" }}>
      <IconPW name={glyph} size={20} color="var(--brand-navy)" />
      {children}
    </div>
  );
  return (
    <div style={{ background: "var(--ai-purple-100)", borderRadius: "var(--r-md)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-h1)", color: "var(--brand-navy)" }}>{s.title}</h2>
      <Meta glyph="calendar">{s.date}</Meta>
      <Meta glyph="clock">{s.time}</Meta>
      <Meta glyph="protocol">{s.location}</Meta>
      <ButtonPW variant="brand" fullWidth>View Event Details</ButtonPW>
    </div>
  );
}

function VerifyBanner() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--gray-50)", border: "1px solid var(--border-default)", borderRadius: "var(--r-md)", padding: 18 }}>
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--verify-check)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <IconifyIconPW name="fluent:checkmark-12-filled" size={15} color="var(--white)" />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body-lg)", color: "var(--text-primary)" }}>
          Verify your medical credentials
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--gray-500)", marginTop: 2 }}>
          Adding more credentials helps people know you're the real deal.
        </div>
      </div>
      <IconPW name="close" size={20} color="var(--gray-400)" />
    </div>
  );
}

function SuggestionRow({ s }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <AvatarPW name={s.name} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body-lg)", color: "var(--text-primary)" }}>{s.name}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-caption)", color: "var(--gray-500)" }}>{s.place}</div>
      </div>
      <button type="button" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--ai-purple)", background: "var(--white)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <IconPW name="add" size={18} color="var(--ai-purple)" />
      </button>
    </div>
  );
}

function ProfileMain() {
  const D = window.APP_DATA;
  const p = D.profile;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 24, maxWidth: 1320, margin: "0 auto", padding: 24, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
        <ProfileHeader name={p.name} seals={p.seals} bio={p.bio} stats={p.stats} contacts={p.contacts} achievements={p.achievements} />
        <PanelPW padding={20}>
          <SummitCard s={p.summit} />
        </PanelPW>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <ButtonPW variant="primary" fullWidth iconLeading={<IconPW name="edit" size={18} color="var(--white)" />}>Edit Page</ButtonPW>
          <ButtonPW variant="secondary" fullWidth iconLeading={<IconPW name="card" size={18} color="var(--gray-600)" />}>Payments</ButtonPW>
        </div>
        <VerifyBanner />
      </div>
      <RailPW>
        <MembershipCard />
        <PanelPW title="Community Channel">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {p.feedChannels.map((c, i) => <ChannelItemPW key={i} {...c} />)}
          </div>
        </PanelPW>
        <PanelPW title="Add to your feed">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {p.suggestions.map((s, i) => <SuggestionRow key={i} s={s} />)}
          </div>
        </PanelPW>
      </RailPW>
    </div>
  );
}

function ProfileWebApp() {
  useEffectPW(() => pfTagActiveNavPW("Profile"));
  return (
    <div className="app wa-screen">
      <TopNavPW active="Profile" user={ME_PW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigatePW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      <ProfileMain />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<ProfileWebApp />);
