/* ===========================================================================
   PROfinity — Community (desktop web)
   Layout ported from the design system's app UI kit (ui_kits/app/CommunityScreen.jsx
   inside _ds_bundle.js) — channel sidebar + composer + post feed + events rail —
   using the DS's own PostCard/ChannelHeader/ChannelItem/Composer/EventCard/Input/Icon
   primitives and its window.APP_DATA sample content. Not mounted via
   window.CommunityScreen directly: that function's own module destructures
   window.ProfinityDesignSystem_c2b5cc before the bundle finishes populating it
   (its ui_kits section runs before the bundle's final component-export block),
   so every component it references resolves to undefined. Destructuring here,
   in a separate script tag that runs after the whole bundle has loaded, doesn't
   have that problem. Same "own TopNav + DS primitives" pattern as agents.jsx.
   =========================================================================== */
const { useEffect: useEffectCW } = React;
const DS_CW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavCW, ChannelHeader, Composer, PostCard, EventCard, ChannelItem, Input: InputCW, Icon: IconCW } = DS_CW;
const { Panel: PanelCW, Rail: RailCW } = window.Kit;

const ME_CW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

/* The app UI kit's sample data was authored to be served from
   ui_kits/app/index.html, so its image paths are "../../assets/images/…".
   Served from the site root instead, that resolves nowhere — repoint every
   such path at this app's real /assets (with a few explicit renames where
   the kit's sample filename doesn't exist here under any name). */
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

function pfTagActiveNavCW(activeLabel) {
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

function navigateCW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Agent: "Agent.html" }[label];
  if (u) (window.pfGo || function (x) { window.location.href = x; })(u);
}

function ChannelsSidebar({ channels }) {
  const Label = ({ children }) => (
    <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--gray-500)", margin: "16px 6px 6px" }}>
      {children}
    </div>
  );
  return (
    <PanelCW title="Channels" padding={20}>
      <InputCW pill placeholder="Search channel" icon={<IconCW name="search" size={18} />} />
      <Label>Following</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {channels.following.map((c, i) => <ChannelItem key={i} {...c} />)}
      </div>
      <Label>Other Channels</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {channels.other.map((c, i) => <ChannelItem key={i} {...c} />)}
      </div>
    </PanelCW>
  );
}

function CommunityMain() {
  const D = window.APP_DATA;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px minmax(0,1fr) 320px", gap: 24, maxWidth: 1440, margin: "0 auto", padding: 24, alignItems: "start" }}>
      <RailCW>
        <ChannelsSidebar channels={D.channels} />
      </RailCW>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
        <PanelCW padding={24}>
          <ChannelHeader {...D.channelHeader} following={false} />
          <div style={{ marginTop: 20 }}>
            <Composer />
          </div>
        </PanelCW>
        {D.posts.map((post, i) => <PostCard key={i} {...post} />)}
      </div>
      <RailCW>
        <h2 style={{ margin: "0 0 2px", fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-h2)", color: "var(--text-primary)" }}>
          Upcoming Events
        </h2>
        {D.events.map((e, i) => <EventCard key={i} {...e} />)}
      </RailCW>
    </div>
  );
}

function CommunityWebApp() {
  useEffectCW(() => pfTagActiveNavCW("Community"));
  return (
    <div className="app wa-screen">
      <TopNavCW active="Community" user={ME_CW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateCW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      <CommunityMain />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CommunityWebApp />);
