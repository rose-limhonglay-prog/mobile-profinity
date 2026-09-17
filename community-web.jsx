/* ===========================================================================
   PROfinity — Community (desktop web)
   Layout ported from the design system's app UI kit (ui_kits/app/CommunityScreen.jsx
   inside _ds_bundle.js) — channel sidebar + composer + post feed + events rail —
   using the DS's own PostCard/ChannelHeader/ChannelItem/Composer/EventCard/Input/Icon
   primitives and its window.APP_DATA sample content. The post column is the
   shared newsfeed Feed (window.PFApp.Feed from app.jsx, loaded with
   PF_NO_MOUNT) in channel mode, so the four tier channels, their gated
   posts and the per-channel admin-pinned accordion match the mobile page. Not mounted via
   window.CommunityScreen directly: that function's own module destructures
   window.ProfinityDesignSystem_c2b5cc before the bundle finishes populating it
   (its ui_kits section runs before the bundle's final component-export block),
   so every component it references resolves to undefined. Destructuring here,
   in a separate script tag that runs after the whole bundle has loaded, doesn't
   have that problem. Same "own TopNav + DS primitives" pattern as agents.jsx.
   =========================================================================== */
const { useEffect: useEffectCW } = React;
const DS_CW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavCW, ChannelHeader: ChannelHeaderCW, Composer: ComposerCW, PostCard: PostCardCW, EventCard: EventCardCW, ChannelItem: ChannelItemCW, Input: InputCW, Icon: IconCW } = DS_CW;
const { Panel: PanelCW } = window.Kit;

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
    b.style.setProperty("background", active ? "var(--pf-nav-active-bg, rgb(225, 223, 242))" : "none", "important");
    b.style.setProperty("transition", "background .18s ease", "important");
    const path = b.querySelector("svg path");
    if (path) path.style.setProperty("fill", active ? "currentColor" : "", "important");
  });
}

function navigateCW(label) {
  var u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Agent: "Agent.html" }[label];
  if (u) (window.pfGo || function (x) { window.location.href = x; })(u);
}

/* The four paid Community channels — same keys/buckets as the mobile
   Community page (community-mobile.jsx CM_CHANNEL_BUCKET), so the shared
   Feed (window.PFApp.Feed, channel mode) renders the same channel posts and
   the same per-channel admin-pinned accordion here. */
const CW_CHANNELS = [
  { key: "confidence", name: "Confidence", about: "Your safe space to post first cases, ask the questions you're nervous about and get feedback from mentors who remember their first syringe.", followers: "1,203" },
  { key: "mastery", name: "Mastery", about: "Advanced technique, complication management and live case reviews for injectors ready to go deeper than the basics.", followers: "864" },
  { key: "freedom", name: "Freedom", about: "Business, scaling and mentorship — pricing, hiring and the systems that turn a busy chair into a clinic that runs without you.", followers: "412" },
  { key: "inner", name: "Inner Circle", about: "Dr Tim Pearce's private roundtable: deal structures, acquisitions and the conversations that don't happen anywhere else.", followers: "96" }];
const CW_CHANNEL_MAP = CW_CHANNELS.reduce((m, c) => { m[c.key] = c; return m; }, {});
const { useState: useStateCW } = React;

function ChannelsSidebar({ active, onPick }) {
  const Label = ({ children }) => (
    <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--gray-500)", margin: "16px 6px 6px" }}>
      {children}
    </div>
  );
  /* Channels the viewer's tier unlocks list first; the rest sit under
     "Other Channels" with the premium crown (they still open — the Feed
     shows its locked teasers + upgrade card, exactly like mobile). */
  const PFA = window.PFApp;
  const unlocked = PFA ? PFA.smIncludedTiers(PFA.getUserTier()) : [];
  const mine = CW_CHANNELS.filter((c) => unlocked.includes(c.key));
  const other = CW_CHANNELS.filter((c) => !unlocked.includes(c.key));
  const item = (c) => <ChannelItemCW key={c.key} name={c.name} active={c.key === active} premium={!unlocked.includes(c.key)} onClick={() => onPick(c.key)} />;
  return (
    <PanelCW title="Channels" padding={20}>
      <InputCW pill placeholder="Search channel" icon={<IconCW name="search" size={18} />} />
      {mine.length > 0 && <>
        <Label>My Channels</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{mine.map(item)}</div>
      </>}
      {other.length > 0 && <>
        <Label>{mine.length ? "Other Channels" : "Channels"}</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{other.map(item)}</div>
      </>}
    </PanelCW>
  );
}

function CommunityMain() {
  const D = window.APP_DATA;
  const [channel, setChannel] = useStateCW((() => {
    try { const b = new URLSearchParams(location.search).get("channel"); return b && CW_CHANNEL_MAP[b] ? b : "confidence"; } catch (e) { return "confidence"; }
  })());
  const meta = CW_CHANNEL_MAP[channel];
  const Feed = window.PFApp && window.PFApp.Feed;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px minmax(0,1fr) 320px", gap: 24, maxWidth: 1440, margin: "0 auto", padding: 24, alignItems: "start" }}>
      {/* Both side rails use styles.css's .rail: pinned under the top nav
          while the feed column scrolls with the page, each with its own
          scroll only if it outgrows the viewport (the events list does). */}
      <div className="rail cw-rail">
        <ChannelsSidebar active={channel} onPick={setChannel} />
      </div>
      <div className="cw-main" style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
        <PanelCW padding={24}>
          <ChannelHeaderCW banner={D.channelHeader.banner} name={"#" + meta.name} followers={meta.followers}
            visibility="Members channel" about={meta.about} following={false} />
          <div style={{ marginTop: 20 }}>
            <ComposerCW />
          </div>
        </PanelCW>
        {/* shared newsfeed Feed in channel mode: this channel's posts (or
            locked teasers), with the admin Pinned Posts accordion on top */}
        {Feed ? <Feed key={channel} channel={channel} /> : D.posts.map((post, i) => <PostCardCW key={i} {...post} />)}
      </div>
      <div className="rail cw-rail cw-rail-events">
        <h2 style={{ margin: "0 0 2px", fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-h2)", color: "var(--text-primary)" }}>
          Upcoming Events
        </h2>
        {D.events.map((e, i) => <EventCardCW key={i} {...e} />)}
      </div>
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
