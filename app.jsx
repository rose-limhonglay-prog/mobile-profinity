/* ===========================================================================
   PROfinity Academy — Newsfeed
   Composed from the bound Profinity Design System bundle
   (window.ProfinityDesignSystem_c2b5cc). Layout + a few rail cards the bundle
   doesn't ship are built here with DS primitives (Card/Avatar/Icon/Button/…)
   and DS tokens only. No raw hex, no restyled look-alikes of bundle parts.
   =========================================================================== */
const { useState, useRef, useEffect, useLayoutEffect } = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav, PostCard, EventCard, MembershipCard, ChannelItem,
  Card, Avatar, Button, Icon, IconifyIcon, VerificationSeals, StatGroup, CommentItem
} = DS;

/* ---- real on-brand imagery (from the Profinity Design System assets) ----- */
const IMG = {
  toxin: "assets/clinic-toxin-guide.png",
  collage: "assets/clinic-treatment-collage.png",
  lip: "assets/clinic-lip-design.png",
  gold: "assets/texture-gold.png",
  courseLip: "assets/course-lip.png",
  courseProtox: "assets/course-protox.png",
  courseTemple: "assets/course-temple.png",
  artCodes: "assets/event-art-codes.png",
  techTuesday: "assets/event-technique-tuesday.png",
  drTim: "assets/avatar-drtim.png",
  p1img1: "assets/post1-img1.png",
  p1img2: "assets/post1-img2.png",
  p1img3: "assets/post1-img3.png",
  p1img4: "assets/post1-img4.png",
  p2img1: "assets/post2-img1.png",
  p2img2: "assets/post2-img2.png",
  p2img3: "assets/post2-img3.png",
  p3img1: "assets/post3-img1.png",
  p3img2: "assets/post3-img2.png",
  p3img3: "assets/post3-img3.png",
  p4img1: "assets/post4-img1.png",
  p4img2: "assets/post4-img2.png",
  p4img3: "assets/post4-img3.png",
  communityPoster: "assets/community-poster.png",
  p5img1: "assets/post5-img1.png",
  p5img2: "assets/post5-img2.png",
  p5img3: "assets/post5-img3.png",
  p5img4: "assets/post5-img4.png",
  p5img5: "assets/post5-img5.png",
  p5img6: "assets/post5-img6.png",
  p5img7: "assets/post5-img7.png",
  p5img8: "assets/post5-img8.png",
  p5img9: "assets/post5-img9.png",
  p5img10: "assets/post5-img10.png",
};

/* ============================ DATA ======================================= */
const ME = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };
const TIM = { name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", seals: ["gb", "gold", "verified", "crown"] };
const MIRANDA = { name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", seals: ["gb", "verified", "gold"] };

/* Official Profinity Academy account — the sole author when PF_OFFICIAL_ONLY
   is set (the Home / Newsfeed surfaces). */
const PROFINITY = { name: "Profinity", avatar: "assets/profinity-icon.jpg", seals: ["verified", "gold"] };
function officialize(list) {
  return list.map((p) => p.channel ? p : { ...p, author: PROFINITY, withOthers: null });
}

/* Every item below carries a bucket + access:"gated" — the same routing
   model as the architecture guide: a free viewer only ever sees the
   editorial POSTS in full; everything here resolves against the current
   preview persona + their bucket toggles (see resolveBucketFeed). */
const CHANNEL_POST = {
  id: "ch1",
  access: "gated", bucket: "confidence",
  author: { name: "Dr. Sarah Collins", avatar: "assets/avatar-katy.jpg", seals: ["gb", "verified"] },
  channel: { name: "#Confidence · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr. Sarah Collins", byAvatar: "assets/avatar-katy.jpg", time: "2d" },
  time: "2 Days Ago", kind: "CONFIDENCE:", kindIcon: "lucide:users",
  media: [IMG.communityPoster],
  body: "Just shared my first lip-correction case in the Confidence channel — the support here is unreal. If you're nervous about posting your work, this is the place to start. 💜",
  likes: "842", comments: "96", shares: "40", actioned: false,
  commentList: [
  { author: { name: "Phoenix Baker", seals: ["gb", "verified"] }, text: "Welcome! This is exactly what the channel is for. 🙌",
    likes: "120", comments: "8", time: "2d", pills: [{ k: "like", n: "20" }, { k: "love", n: "6" }], reactions: ["like", "love"], reactionCount: "120" },
  { author: { name: "Luna Chen" }, text: "Beautiful result — thanks for being brave enough to share!",
    likes: "64", comments: "3", time: "1d", pills: [{ k: "like", n: "9" }], reactions: ["like"], reactionCount: "64" }]

};

const MASTERY_POST = {
  id: "ch2", access: "gated", bucket: "mastery",
  author: { name: "Priya Shah", avatar: "assets/avatar-katy.jpg", seals: ["gb"] },
  channel: { name: "#Mastery · Community", avatar: "assets/profinity-icon.jpg",
    by: "Priya Shah", byAvatar: "assets/avatar-katy.jpg", time: "5h" },
  time: "5 Hours Ago", kind: "MASTERY:", kindIcon: "lucide:award",
  body: "Cannula vs needle for the tear trough — here's the decision tree I actually use chairside.",
  likes: "64", comments: "12", shares: "4", actioned: false, commentList: []
};

const FREEDOM_POST = {
  id: "ch3", access: "gated", bucket: "freedom",
  author: { name: "Dr Amir Khan", avatar: "assets/avatar-drtim.png", seals: ["gb", "verified"] },
  channel: { name: "#Freedom · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Amir Khan", byAvatar: "assets/avatar-drtim.png", time: "1d" },
  time: "1 Day Ago", kind: "FREEDOM:", kindIcon: "lucide:trending-up",
  body: "How I went from one chair to three clinics in 18 months — the hiring order that mattered.",
  likes: "110", comments: "18", shares: "9", actioned: false, commentList: []
};

const INNER_POST = {
  id: "ch4", access: "gated", bucket: "inner",
  author: { name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", seals: ["gb", "gold", "verified", "crown"] },
  channel: { name: "#Inner Circle · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Tim Pearce", byAvatar: "assets/avatar-drtim.png", time: "3d" },
  time: "3 Days Ago", kind: "INNER CIRCLE:", kindIcon: "lucide:gem",
  body: "Inner Circle only: the exact deal structure behind my last clinic acquisition.",
  likes: "212", comments: "31", shares: "14", actioned: false, commentList: []
};

const COURSE_POST = {
  id: "crs1", access: "gated", bucket: "course", course: "protox",
  author: { name: "PROTOX", avatar: "assets/course-protox.png" },
  time: "Just now", kind: "PROTOX COURSE:", kindIcon: "lucide:graduation-cap",
  body: "New in your PROTOX course — Module 3: Advanced cannula control for the mid-face.",
  likes: "38", comments: "6", shares: "2", actioned: false, commentList: []
};

const COURSE_COMMENT = {
  id: "crs2", access: "gated", bucket: "coursecomment", course: "protox",
  author: { name: "Nurse Beth", avatar: "assets/avatar-katy.jpg" },
  time: "2 Hours Ago", kind: "PROTOX · DISCUSSION:", kindIcon: "lucide:message-circle",
  body: "This finally made cannula depth click for me — thank you!",
  likes: "22", comments: "3", shares: "0", actioned: false, commentList: []
};

const MYLEARNING_POST = {
  id: "ml1", access: "gated", bucket: "mylearning",
  author: { name: "You", avatar: ME.avatar },
  time: "Just now", kind: "MY LEARNING:", kindIcon: "lucide:bookmark",
  body: "You saved: “The 7-point liquid facelift, explained”.",
  likes: "0", comments: "0", shares: "0", actioned: false, commentList: []
};

const GENERAL_MARK_POST = {
  id: "gm1", access: "gated", bucket: "general", from: "mark",
  author: { name: "Mark Ellis", avatar: "assets/avatar-katy.jpg" },
  time: "6 Hours Ago", kind: "GENERAL:", kindIcon: "lucide:message-circle",
  body: "Anyone else get butterflies before a big case day? How do you settle the nerves?",
  likes: "56", comments: "14", shares: "1", actioned: false, commentList: []
};

const FOLLOWSAVE_AMIR_POST = {
  id: "fs1", access: "gated", bucket: "followsave", from: "amir",
  author: { name: "Dr Amir Khan", avatar: "assets/avatar-drtim.png", seals: ["gb", "verified"] },
  time: "4 Hours Ago", kind: "AMIR SAVED:", kindIcon: "lucide:bookmark",
  body: "saved “Managing vascular occlusion, step by step” to their learning.",
  likes: "9", comments: "0", shares: "0", actioned: false, commentList: []
};

/* The full pool of gated bucket content the preview panel routes between —
   order here is the order it appears once resolved into the feed. */
const BUCKET_POSTS = [
CHANNEL_POST, MASTERY_POST, FREEDOM_POST, INNER_POST,
COURSE_POST, COURSE_COMMENT, GENERAL_MARK_POST, FOLLOWSAVE_AMIR_POST, MYLEARNING_POST];


/* Bucket types a free viewer is shown as a marketing teaser (see
   resolveBucketFeed). Discussion/activity buckets (coursecomment,
   followsave) and a viewer's own saves (mylearning) are simply omitted —
   they don't make a useful upsell tease. */
const TEASABLE_BUCKETS = new Set(["confidence", "mastery", "freedom", "inner", "course", "general"]);

/* Human label + accent used on a locked teaser's badge. */
const BUCKET_META = {
  confidence: { label: "Confidence", color: "var(--info)" },
  mastery: { label: "Mastery", color: "var(--level-intermediate)" },
  freedom: { label: "Freedom", color: "var(--ai-purple)" },
  inner: { label: "Inner Circle", color: "var(--premium-gold-deep)" },
  course: { label: "PROTOX Course", color: "var(--assess-teal)" },
  coursecomment: { label: "PROTOX Course", color: "var(--assess-teal)" },
  general: { label: "General", color: "var(--gray-500)" },
  followsave: { label: "Activity", color: "var(--gray-500)" },
  mylearning: { label: "My Learning", color: "var(--premium-orange)" }
};

/* Preview personas — the same ladder as the architecture guide's simulator.
   channels lists every channel bucket that persona holds (each higher tier
   includes every tier below it); paid/admin gate the free-tier teaser path. */
const PERSONAS = [
{ key: "free", name: "Free user", desc: "Editorial + teasers only.", channels: [], paid: false, admin: false },
{ key: "confidence", name: "Paid · Confidence", desc: "Every paid user starts here.", channels: ["confidence"], paid: true, admin: false },
{ key: "mastery", name: "Mastery member", desc: "Confidence + Mastery.", channels: ["confidence", "mastery"], paid: true, admin: false },
{ key: "freedom", name: "Freedom member", desc: "Confidence + Mastery + Freedom.", channels: ["confidence", "mastery", "freedom"], paid: true, admin: false },
{ key: "inner", name: "Inner Circle", desc: "All four channels.", channels: ["confidence", "mastery", "freedom", "inner"], paid: true, admin: false },
{ key: "admin", name: "Admin", desc: "Sees everything.", channels: ["confidence", "mastery", "freedom", "inner"], paid: true, admin: true }];

const PERSONA_MAP = PERSONAS.reduce((m, p) => {m[p.key] = p;return m;}, {});

/* The actual routing logic: given who's looking + their bucket toggles,
   resolve which BUCKET_POSTS are visible, and in what mode. Mirrors the
   architecture guide's resolveFeed() 1:1. */
function resolveBucketFeed(personaKey, toggles) {
  const persona = PERSONA_MAP[personaKey] || PERSONA_MAP.confidence;
  if (!persona.paid && !persona.admin) {
    return BUCKET_POSTS.
    filter((x) => TEASABLE_BUCKETS.has(x.bucket)).
    map((item) => ({ item, mode: "teaser" }));
  }
  const out = [];
  BUCKET_POSTS.forEach((x) => {
    switch (x.bucket) {
      case "confidence":case "mastery":case "freedom":case "inner":
        if (persona.admin || persona.channels.includes(x.bucket)) out.push({ item: x, mode: "full" });
        break;
      case "course":case "coursecomment":
        if (persona.admin || x.course === "protox" && toggles.course) out.push({ item: x, mode: "full" });
        break;
      case "mylearning":
        if (persona.admin || toggles.save) out.push({ item: x, mode: "full" });
        break;
      case "general":case "followsave":
        if (x.from === "mark" && toggles.mute && !persona.admin) return;
        out.push({ item: x, mode: "full" });
        break;
    }
  });
  return out;
}

const PROFILE = {
  name: "Katy Wilson", role: "Registered Nurse", avatar: "assets/avatar-katy.jpg", seals: ["gb", "verified", "gold"],
  stats: [
  { value: "2,402", label: "Following" },
  { value: "1,203", label: "Followers" },
  { value: "120", label: "Points" }]

};

const CHANNEL_GROUPS = [
{ title: "Community Channel", rooms: [
  { name: "General", newPosts: "5 new posts", count: 5 },
  { name: "Industry Insights", newPosts: "2 new posts" }]
},
{ title: "Clinical Forum", rooms: [
  { name: "Case Studies", newPosts: "5 new posts", count: 5 },
  { name: "Growth Marketing", premium: true }]
}];


const TRENDING = [
{ rank: 1, kind: "Protocol", title: "Lip Reversal Protocol", media: IMG.lip },
{ rank: 2, kind: "Case Study", title: "Tear Trough Correction", media: IMG.toxin },
{ rank: 3, kind: "Article", title: "MidFace Filler Complications", media: IMG.collage }];


const FOLLOWS = [
{ name: "Caron Kiem", loc: "London, United Kingdom" },
{ name: "Sofia Chen", loc: "Toronto, Canada" },
{ name: "Liam O'Connor", loc: "Dublin, Ireland" },
{ name: "Amina El-Masri", loc: "Cairo, Egypt" }];


const EVENTS = [
{
  image: "assets/event-technique-tuesday.png",
  title: "Technique Tuesday", host: "Dr Tim Pearce",
  date: "17 March 2026", time: "20:00 GMT • 16:00 ET", cta: "Join Now!", ctaVariant: "primary"
},
{
  image: "assets/event-art-codes.png",
  title: "Art Codes Live Webinar", hostLabel: "Event by:", host: "Dr Tim Pearce",
  date: "18 March 2026", cta: "View Event Details", ctaVariant: "brand"
},
{
  image: "assets/event-art-codes.png",
  title: "Art Codes Recorded Webinar", hostLabel: "Event by:", host: "Dr Tim Pearce",
  date: "22 March 2026", cta: "View Event Details", ctaVariant: "brand"
}];


const CASE_BODY =
"Dr. Emily utilised a comprehensive full-face strategy, emphasising midface enhancement, support around the mouth, and delicate contouring methods. She implemented the 3-Step Confidence Framework within PROfinity.";

const REPLY_A = {
  author: { name: "Tokyo Jana", seals: ["gb"] },
  text: "This is an amazing protocol! It has helped us a lot in our research.",
  reactions: ["like"], reactionCount: "1.2K", time: "5d", pills: [{ k: "like", n: "3" }]
};

function thread(extra) {
  return [
  {
    author: { name: "Phoenix Baker", seals: ["gb", "verified"] },
    text: "This is an amazing protocol! It has helped us a lot in our research.",
    likes: "1.1K", comments: "300", time: "1w", pills: [{ k: "like", n: "12" }, { k: "love", n: "5" }],
    reactions: ["like", "love", "laugh"], reactionCount: "1.2K",
    replies: [REPLY_A]
  },
  {
    author: { name: "Luna Chen" },
    text: extra || "The interface is so intuitive — a genuine game changer for the clinic!",
    likes: "850", comments: "150", time: "3d", pills: [{ k: "like", n: "8" }],
    reactions: ["like"], reactionCount: "1.2K"
  }];

}

const POSTS = [
{
  id: "p1", author: TIM, withOthers: "Miranda Pearce and 14 others", time: "1 Week Ago",
  kind: "CASE STUDY:", kindIcon: "lucide:chart-pie",
  media: [IMG.p1img1, IMG.p1img2, IMG.p1img3, IMG.p1img4],
  body: CASE_BODY, likes: "1.2K", comments: "150", shares: "150", actioned: true,
  commentList: thread()
},
{
  id: "p2", author: TIM, withOthers: "Miranda Pearce and 14 others", time: "1 Week Ago",
  kind: "PROTOCOL:", kindIcon: "lucide:clipboard-list",
  media: [IMG.p2img1, IMG.p2img2, IMG.p2img3],
  body: "This protocol shows the exact steps for safely correcting migrated or uneven lip filler using a structured, repeatable framework you can apply chairside.",
  likes: "1.2K", comments: "150", shares: "150", actioned: true,
  commentList: thread("This is exactly what I was looking for. Thank you!")
},
{
  id: "p3", author: MIRANDA, withOthers: "Dr Tim Pearce", time: "2 Weeks Ago",
  kind: "DISCUSSION:", kindIcon: "lucide:trending-up",
  media: [IMG.p3img1, IMG.p3img2, IMG.p3img3],
  body: "Growing your clinic revenue doesn't require discounts. Here are 5 strategies top clinicians use to build a premium, referral-led practice.",
  likes: "1.2K", comments: "150", shares: "150", actioned: false,
  commentList: thread("So easy to follow — even on a busy clinic day!")
},
{
  id: "p4", author: MIRANDA, time: "2 Weeks Ago",
  kind: "COMMUNITY:", kindIcon: "lucide:users",
  media: [IMG.p4img1, IMG.p4img2, IMG.p4img3],
  body: "I've been terrified for months, but after studying the Toxin Confidence Pathway, I finally did it! Thank you everyone for your support — this community keeps me moving.",
  likes: "1.2K", comments: "150", shares: "150", actioned: false,
  commentList: thread("So proud of you — the leap is always the hardest part!")
},
{
  id: "p5", author: TIM, time: "3 Days Ago",
  kind: "MASTERCLASS:", kindIcon: "lucide:play",
  sample: { type: "video", poster: IMG.p5img1, duration: "12:40" },
  body: "Watch the full walkthrough of the Golden Ratio full-face assessment — every landmark, every measurement, explained step by step.",
  likes: "3.4K", comments: "210", shares: "180", actioned: false,
  commentList: thread("Watched it twice already — incredibly clear teaching.")
},
{
  id: "p6", author: MIRANDA, time: "4 Days Ago",
  kind: "REEL:", kindIcon: "lucide:smartphone",
  sample: { type: "vertical", image: IMG.p5img2 },
  body: "A 30-second vertical reel of a lip refinement — saving this format for sharing straight to socials.",
  likes: "2.1K", comments: "140", shares: "320", actioned: false,
  commentList: thread("Perfect for Reels — the vertical crop looks great.")
},
{
  id: "p7", author: TIM, withOthers: "Miranda Pearce and 14 others", time: "5 Days Ago",
  kind: "CASE STUDY:", kindIcon: "lucide:images",
  sample: { type: "gallery", images: [IMG.p5img1, IMG.p5img2, IMG.p5img3, IMG.p5img4, IMG.p5img5, IMG.p5img6, IMG.p5img7, IMG.p5img8, IMG.p5img9, IMG.p5img10] },
  body: "Full 10-step before-and-after series from a complete facial rejuvenation — swipe through every stage of the treatment plan.",
  likes: "5.6K", comments: "430", shares: "390", actioned: false,
  commentList: thread("This step-by-step series is gold — thank you for sharing all 10!")
}];


/* ============================ SHARED BITS ================================ */
function SectionHead({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-h2)", color: "var(--text-primary)" }}>
        {children}
      </span>
      {action &&
      <a style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body)", color: "var(--action-primary)", cursor: "pointer" }}>
          {action}
        </a>
      }
    </div>);

}

/* ============================ LEFT RAIL ================================== */
function ProfileCard() {
  const p = PROFILE;
  return (
    <Card padding={0} style={{ overflow: "hidden", paddingBottom: 20 }}>
      <div style={{ height: 92, background: "linear-gradient(120deg, var(--ai-purple-200), var(--brand-gold-100))" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 18px", marginTop: -42 }}>
        <Avatar name={p.name} src={p.avatar} size={84} ring style={{ border: "4px solid var(--surface-card)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-h2)", color: "var(--text-heading)" }}>{p.name}</span>
          <VerificationSeals seals={p.seals} size={16} />
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--gray-500)", marginTop: 3 }}>{p.role}</div>
        <StatGroup stats={p.stats} gap={24} style={{ marginTop: 18, width: "100%", justifyContent: "space-around" }} />
      </div>
    </Card>);

}

function ChannelGroup({ group }) {
  return (
    <Card padding={16}>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-h3)", color: "var(--text-heading)", padding: "4px 6px 8px" }}>
        {group.title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {group.rooms.map((r, i) => <ChannelItem key={i} {...r} />)}
      </div>
    </Card>);

}

function Trending() {
  return (
    <Card padding={20}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
        <IconifyIcon name="lucide:trending-up" size={22} color="var(--reaction-like)" />
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-body-lg)", color: "var(--text-heading)" }}>
          Trending Among Clinicians
        </span>
      </div>
      {TRENDING.map((t, i) =>
      <a key={i} style={{ display: "block", padding: "14px 0", borderTop: i ? "1px solid var(--border-default)" : "none", cursor: "pointer" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-caption)", color: "var(--gray-500)", marginBottom: 9 }}>
            #{t.rank} – <span style={{ color: "var(--text-primary)", fontWeight: "var(--fw-semibold)" }}>Top Trending</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img src={t.media} alt="" style={{ width: 56, height: 56, borderRadius: "var(--r-sm)", objectFit: "cover", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-body-lg)", color: "var(--text-heading)" }}>{t.kind}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--gray-600)", marginTop: 2 }}>{t.title}</div>
            </div>
          </div>
        </a>
      )}
    </Card>);

}

function StoreButton({ iconify, small, big }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{
      display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "10px 16px",
      borderRadius: "var(--r-sm)", border: "1px solid var(--brand-navy)", cursor: "pointer",
      background: h ? "var(--brand-navy-700)" : "var(--brand-navy)", color: "var(--white)",
      transition: "background var(--dur-fast)"
    }}>
      <IconifyIcon name={iconify} size={26} color="var(--white)" />
      <span style={{ textAlign: "left", lineHeight: 1.15 }}>
        <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "var(--fs-micro)", opacity: 0.8 }}>{small}</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body-lg)", fontWeight: "var(--fw-bold)" }}>{big}</span>
      </span>
    </button>);

}

function Download() {
  return (
    <Card padding={20} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-h3)", color: "var(--text-primary)", marginBottom: 14 }}>
        Download Now
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <StoreButton iconify="lucide:play" small="GET IT ON" big="Google Play" />
        <StoreButton iconify="lucide:apple" small="Download on the" big="App Store" />
      </div>
    </Card>);

}

function LeftRail() {
  return (
    <aside className="rail" data-screen-label="Left sidebar">
      <ProfileCard />
      {CHANNEL_GROUPS.map((g, i) => <ChannelGroup key={i} group={g} />)}
      <Trending />
      <Download />
    </aside>);

}

/* ============================ RIGHT RAIL ================================= */
function FollowItem({ f }) {
  const [following, setFollowing] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      <Avatar name={f.name} size={52} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body-lg)", color: "var(--text-heading)" }}>{f.name}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-caption)", color: "var(--gray-500)" }}>{f.loc}</div>
      </div>
      <button type="button" onClick={() => setFollowing((v) => !v)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
        fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-body)",
        color: following ? "var(--gray-500)" : "var(--action-primary)"
      }}>
        {following ? "Following" : "Follow"}
        <IconifyIcon name={following ? "lucide:check" : "lucide:plus"} size={16} color={following ? "var(--gray-500)" : "var(--action-primary)"} />
      </button>
    </div>);

}

function AddToFeed() {
  return (
    <Card padding={20}>
      <SectionHead>Add to your feed</SectionHead>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {FOLLOWS.map((f, i) => <FollowItem key={i} f={f} />)}
      </div>
    </Card>);

}

function RightRail() {
  return (
    <aside className="rail" data-screen-label="Right sidebar">
      <Card padding={20}>
        <SectionHead action="See all">My Events</SectionHead>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {EVENTS.map((e, i) => <EventCard key={i} {...e} />)}
        </div>
      </Card>
      <AddToFeed />
      <MembershipCard />
    </aside>);

}

/* ============================ FEED ======================================= */
function SortBar({ value, onCycle }) {
  return (
    <div className="pf-sortbar" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, padding: "0 4px",
      fontFamily: "var(--font-sans)", fontSize: "var(--fs-body-lg)", color: "var(--gray-500)" }}>
      Sort by:
      <button type="button" onClick={onCycle}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
        fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-body-lg)", color: "var(--text-primary)" }}>
        {value}
        <Icon name="chevron-down" size={16} color="var(--gray-500)" />
      </button>
    </div>);

}

const SORTS = ["All", "Latest", "Top", "Following"];

/* Facebook-style reaction set — colorful 3D Fluent Emoji + per-reaction accent. */
const REACTIONS = [
{ key: "like", label: "Like", icon: "fluent-emoji-flat:thumbs-up", flat: "fluent:thumb-like-16-filled", color: "--reaction-like" },
{ key: "love", label: "Love", icon: "fluent-emoji-flat:red-heart", flat: "fluent:heart-16-filled", color: "--reaction-love" },
{ key: "laugh", label: "Laugh", icon: "fluent-emoji-flat:grinning-squinting-face", flat: "fluent:emoji-laugh-16-filled", color: "--premium-orange" },
{ key: "wow", label: "Wow", icon: "fluent-emoji-flat:face-with-open-mouth", flat: "fluent:emoji-16-filled", color: "--premium-orange" },
{ key: "cry", label: "Cry", icon: "fluent-emoji-flat:crying-face", flat: "fluent:emoji-sad-16-filled", color: "--premium-orange" },
{ key: "angry", label: "Angry", icon: "fluent-emoji-flat:pouting-face", flat: "fluent:emoji-angry-16-filled", color: "--error" }];

const REACTION_MAP = REACTIONS.reduce((m, r) => {m[r.key] = r;return m;}, {});

/* Compact reaction control for a comment: tap toggles Like; hover/long-press
   opens the mini reaction picker; picking one colours the label + shows its emoji. */
function CommentReact() {
  const [reaction, setReaction] = useState(null);
  const [open, setOpen] = useState(false);
  const hideT = useRef(null);
  const show = () => {clearTimeout(hideT.current);setOpen(true);};
  const hide = () => {hideT.current = setTimeout(() => setOpen(false), 220);};
  const r = reaction ? REACTION_MAP[reaction] : null;
  return (
    <span className="cmt-react" onMouseEnter={show} onMouseLeave={hide}>
      <button type="button" className={"cmt-link cmt-react-btn" + (r ? " on" : "")}
      style={r ? { color: "var(" + r.color + ")" } : null}
      onClick={() => setReaction(reaction ? null : "like")}>
        {r ?
        <span className="cmt-react-cur">
            <iconify-icon icon={r.icon} width="16" height="16"></iconify-icon>{r.label}
          </span> :
        "Like"}
      </button>
      {open &&
      <span className="cmt-react-pop" role="menu" aria-label="React to comment"
      onMouseEnter={show} onMouseLeave={hide}>
          {REACTIONS.map((opt) =>
        <button key={opt.key} type="button" role="menuitem" aria-label={opt.label}
        className="cmt-react-opt" data-react={opt.key}
        onClick={() => {setReaction(opt.key);setOpen(false);}}>
              <iconify-icon icon={opt.icon} width="30" height="30"></iconify-icon>
            </button>
        )}
        </span>
      }
    </span>);

}

function cssVar(name) {
  const cs = getComputedStyle(document.querySelector(".app") || document.body);
  return cs.getPropertyValue(name).trim() || "currentColor";
}

/* The post's like button is the first <button> inside the DS PostActions row
   (the inline-styled flex row with space-between). Selecting by that avoids
   matching the post menu "…" or a ChannelContext "Join"/avatar button. */
function likeButtonOf(wrap) {
  if (!wrap) return null;
  const bar = wrap.querySelector('[style*="space-between"]');
  return (bar || wrap).querySelector("button");
}

/* Burst of floating reaction glyphs + a springy pop on the like icon. */
function burstReaction(wrap, key) {burstFrom(likeButtonOf(wrap), key);}

function burstFrom(btn, key) {
  if (!btn || typeof window === "undefined") return;
  const r = REACTION_MAP[key] || REACTION_MAP.like;
  const color = cssVar(r.color);

  const icon = btn.querySelector("iconify-icon");
  if (icon && icon.animate) {
    icon.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.6)" }, { transform: "scale(0.9)" }, { transform: "scale(1)" }],
      { duration: 460, easing: "cubic-bezier(.34,1.56,.64,1)" }
    );
  }

  const rect = btn.getBoundingClientRect();
  const cx = rect.left + 16,cy = rect.top + rect.height / 2;
  for (let i = 0; i < 7; i++) {
    const size = 13 + Math.random() * 10;
    const el = document.createElement("iconify-icon");
    el.setAttribute("icon", r.icon);
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;left:" + cx + "px;top:" + cy + "px;width:" + size + "px;height:" + size +
    "px;pointer-events:none;z-index:9999;line-height:0;will-change:transform,opacity;color:" + color + ";";
    document.body.appendChild(el);
    const dx = (Math.random() - 0.5) * 96,dy = -56 - Math.random() * 74;
    const anim = el.animate(
      [
      { transform: "translate(-50%,-50%) scale(.3)", opacity: 0 },
      { transform: "translate(calc(-50% + " + dx * 0.35 + "px),calc(-50% + " + dy * 0.35 + "px)) scale(1)", opacity: 1, offset: 0.28 },
      { transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(.55)", opacity: 0 }],

      { duration: 740 + Math.random() * 280, easing: "cubic-bezier(.22,.61,.36,1)" }
    );
    anim.onfinish = () => el.remove();
    setTimeout(() => el.remove(), 1500);
  }
}

/* Facebook-style floating reaction bar — colorful 3D emoji, springy stagger-in,
   hover lift + label tooltip. */
function ReactionPicker({ at, onPick, onEnter, onLeave }) {
  if (!at) return null;
  return ReactDOM.createPortal(
    <div style={{ position: "fixed", left: 0, right: 0, bottom: at.bottom, zIndex: 9999, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div onMouseEnter={onEnter} onMouseLeave={onLeave} className="pf-react-bar"
      role="menu" aria-label="Pick a reaction"
      style={{ pointerEvents: "auto" }}>
        {REACTIONS.map((r, i) =>
        <button key={r.key} type="button" role="menuitem" aria-label={r.label}
        onClick={() => onPick(r.key)} className="pf-react-opt" data-react={r.key}
        style={{ animationDelay: i * 35 + "ms" }}>
            <span className="pf-react-label">{r.label}</span>
            <IconifyIcon name={r.icon} size={40} />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

/* assigns stable ids to seeded comments so replies can target them */
let _cseq = 0;

/* Inline "Like" control for a comment / reply: hover (or focus) opens the same
   animated reaction bar, picking fires the burst and reflects the choice. */
function ReactTrigger() {
  const [reaction, setReaction] = useState(null);
  const [at, setAt] = useState(null);
  const btnRef = useRef(null);
  const hideT = useRef(null);

  const open = () => {
    clearTimeout(hideT.current);
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setAt({ bottom: window.innerHeight - rect.top + 8 });
  };
  const scheduleHide = () => {clearTimeout(hideT.current);hideT.current = setTimeout(() => setAt(null), 240);};
  const pick = (key) => {setReaction(key);burstFrom(btnRef.current, key);setAt(null);};
  const toggleDefault = () => {
    if (reaction) {setReaction(null);} else
    {setReaction("like");burstFrom(btnRef.current, "like");}
  };

  const r = reaction ? REACTION_MAP[reaction] : null;
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button ref={btnRef} type="button" className="cmt-react-link"
      aria-label={r ? "Reacted: " + r.label + ". Change reaction" : "Like this comment"}
      onMouseEnter={open} onMouseLeave={scheduleHide}
      onFocus={open} onBlur={scheduleHide}
      onClick={toggleDefault}
      style={{ color: r ? "var(" + r.color + ")" : "var(--gray-500)" }}>
        {r && <IconifyIcon name={r.icon} size={16} />}
        {r ? r.label : "Like"}
      </button>
      <ReactionPicker at={at} onPick={pick} onEnter={() => clearTimeout(hideT.current)} onLeave={scheduleHide} />
    </span>);

}

function withIds(list) {
  return (list || []).map((c) => ({ ...c, _id: "c" + _cseq++, replies: (c.replies || []).map((r) => ({ ...r })) }));
}

/* Inline comment / reply composer built from DS primitives. */
function CommentComposer({ placeholder, onSubmit, autoFocus, small }) {
  const [v, setV] = useState("");
  const submit = () => {const t = v.trim();if (!t) return;onSubmit(t);setV("");};
  const ready = v.trim().length > 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
      <Avatar name={ME.name} src={ME.avatar} size={small ? 30 : 36} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: "var(--r-pill)", padding: "7px 7px 7px 16px" }}>
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") submit();}}
        placeholder={placeholder} autoFocus={autoFocus}
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--text-primary)", minWidth: 0 }} />
        <button type="button" onClick={submit} aria-label="Post comment"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, flexShrink: 0, borderRadius: "var(--r-pill)", border: "none", cursor: ready ? "pointer" : "default", background: ready ? "var(--action-primary)" : "var(--gray-200)", transition: "background var(--dur-fast)" }}>
          <IconifyIcon name="lucide:send" size={16} color={ready ? "var(--white)" : "var(--gray-500)"} />
        </button>
      </div>
    </div>);

}

/* Minimal post composer (input only) — replaces the DS Composer's media row. */
function PostComposer({ onPost }) {
  const [v, setV] = useState("");
  const submit = () => {const t = v.trim();if (!t) return;onPost(t);setV("");};
  const ready = v.trim().length > 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-card)", padding: 16 }}>
      <Avatar name={ME.name} src={ME.avatar} size={44} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: "var(--r-pill)", padding: "9px 9px 9px 18px" }}>
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") submit();}}
        placeholder="Write an article or share an update…"
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--fs-body-lg)", color: "var(--text-primary)", minWidth: 0 }} />
        <button type="button" onClick={submit} aria-label="Post"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, flexShrink: 0, borderRadius: "var(--r-pill)", border: "none", cursor: ready ? "pointer" : "default", background: ready ? "var(--action-primary)" : "var(--gray-200)", transition: "background var(--dur-fast)" }}>
          <IconifyIcon name="lucide:send" size={18} color={ready ? "var(--white)" : "var(--gray-500)"} />
        </button>
      </div>
    </div>);

}

const LIKED_BY = ["Jessica Hue", "Marco Ricci", "Sofia Chen"];
function LikedByRow({ onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="likedby-row"
    aria-label="See who reacted to this post" aria-haspopup="dialog"
    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0 4px", background: "none", border: "none", cursor: "pointer" }}>
      <span style={{ display: "inline-flex" }}>
        {LIKED_BY.map((n, i) =>
        <span key={i} style={{ marginLeft: i === 0 ? 0 : -10, border: "2px solid var(--surface-card)", borderRadius: "50%", display: "inline-flex" }}>
            <Avatar name={n} size={26} />
          </span>
        )}
      </span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--gray-600)" }}>
        Liked by <b style={{ color: "var(--text-primary)", fontWeight: "var(--fw-semibold)" }}>Jessica Hue</b> and <b style={{ color: "var(--text-primary)", fontWeight: "var(--fw-semibold)" }}>others</b>
      </span>
    </button>);

}

/* ---- Likes modal: who reacted, split into people-you-follow / others ----- */
const LIKE_TABS = [
{ key: "all", label: "All", count: "1.2K" },
{ key: "like", icon: "fluent:thumb-like-16-filled", color: "--reaction-like", count: "1.1K" },
{ key: "heart", icon: "fluent:heart-16-filled", color: "--reaction-love", count: "89" },
{ key: "wow", icon: "fluent-emoji-flat:face-with-open-mouth", color: "--reaction-laugh", count: "12" }];

const LIKES_FOLLOW = [
{ name: "Dr. Sarah Jenkins", title: "Board Certified Plastic Surgeon" },
{ name: "Dr. Michael Aris", title: "Aesthetic Physician" },
{ name: "Dr. David Miller", title: "Consultant Dermatologist" }];

const LIKES_OTHERS = [
{ name: "Dr. Sarah Jenkins", title: "Board Certified Plastic Surgeon" },
{ name: "Dr. Michael Aris", title: "Aesthetic Physician" }];


function LikePerson({ p, following }) {
  const [on, setOn] = useState(following);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0" }}>
      <span style={{ position: "relative", flexShrink: 0 }}>
        <Avatar name={p.name} size={48} />
        <span style={{ position: "absolute", right: -1, bottom: -1, width: 18, height: 18, borderRadius: "50%", background: "var(--verify-check)", border: "2px solid var(--surface-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconifyIcon name="fluent:checkmark-12-filled" size={9} color="var(--white)" />
        </span>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-body-lg)", color: "var(--text-primary)" }}>{p.name}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--gray-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
      </div>
      {on ?
      <button type="button" onClick={() => setOn(false)}
      style={{ flexShrink: 0, padding: "10px 20px", borderRadius: "var(--r-pill)", border: "none", cursor: "pointer", background: "var(--surface-sunken)", color: "var(--text-primary)", fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body)" }}>
          Following
        </button> :

      <button type="button" onClick={() => setOn(true)}
      style={{ flexShrink: 0, padding: "12px 28px", borderRadius: "var(--r-sm)", border: "none", cursor: "pointer", background: "var(--brand-navy)", color: "var(--white)", fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body-lg)" }}>
          Follow
        </button>
      }
    </div>);

}

function LikesModal({ onClose }) {
  const [tab, setTab] = useState("all");
  const sheetRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const prevFocus = document.activeElement;
    if (closeRef.current) closeRef.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {onClose();return;}
      if (e.key === "Tab" && sheetRef.current) {
        // simple focus trap
        const f = sheetRef.current.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0],last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();} else
        if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, []);

  return (
    <div className="likes-overlay" onClick={onClose}>
      <div className="likes-sheet" ref={sheetRef} onClick={(e) => e.stopPropagation()}
      role="dialog" aria-modal="true" aria-labelledby="likes-title">
        <div className="likes-handle" />
        <div className="likes-head">
          <span className="likes-title" id="likes-title">Likes</span>
          <button type="button" className="likes-x" aria-label="Close likes dialog" ref={closeRef} onClick={onClose}>
            <IconifyIcon name="lucide:x" size={20} color="var(--text-primary)" />
          </button>
        </div>
        <div className="likes-tabs" role="tablist" aria-label="Filter by reaction">
          {LIKE_TABS.map((t) =>
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key}
          aria-label={(t.label || t.key) + " reactions, " + t.count}
          className={"likes-tab" + (tab === t.key ? " on" : "")} onClick={() => setTab(t.key)}>
              {t.icon && <IconifyIcon name={t.icon} size={20} color={"var(" + t.color + ")"} />}
              {t.label && <span>{t.label}</span>}
              <span className="cnt">{t.count}</span>
            </button>
          )}
        </div>
        <div className="likes-body">
          <div className="likes-sec-label">People you follow</div>
          {LIKES_FOLLOW.map((p, i) => <LikePerson key={i} p={p} following />)}
          <div className="likes-divider" />
          <div className="likes-sec-label">Others</div>
          {LIKES_OTHERS.map((p, i) => <LikePerson key={i} p={p} following={false} />)}
        </div>
      </div>
    </div>);

}

const PF_CMT_TIMES = ["2h", "1h", "45m", "20m", "12m", "5m", "2m"];

/* Slide-up Comments sheet (mobile). Shows the post reference, the full comment
   thread with timestamps + Like/Reply, and an "Add a comment" composer.
   Rendered position:absolute so it stays inside the phone frame. */
function CommentsSheet({ post, comments, onClose, onAddComment, onAddReply }) {
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  const [replyFor, setReplyFor] = useState(null);
  useEffect(() => {
    const prev = document.activeElement;
    if (closeRef.current) closeRef.current.focus();
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    document.addEventListener("keydown", onKey);
    return () => {document.removeEventListener("keydown", onKey);if (prev && prev.focus) prev.focus();};
  }, []);
  return (
    <div className="cmtsheet-overlay" onClick={onClose}>
      <div className="cmtsheet" ref={sheetRef} onClick={(e) => e.stopPropagation()}
      role="dialog" aria-modal="true" aria-label="Comments">
        <div className="cmtsheet-handle" />
        <div className="cmtsheet-head">
          <span className="cmtsheet-title">Comments</span>
          <button type="button" className="cmtsheet-x" aria-label="Close comments" ref={closeRef} onClick={onClose}>
            <IconifyIcon name="lucide:x" size={20} color="var(--text-primary)" />
          </button>
        </div>
        <div className="cmtsheet-post">
          <Avatar name={post.author.name} src={post.author.avatar} size={40} />
          <div className="cmtsheet-post-tx">
            <div className="nm">{post.author.name}</div>
            <div className="sn">{post.body}</div>
          </div>
        </div>
        <div className="cmtsheet-body">
          {comments.map((c, i) =>
          <div key={c._id} className="cmtsheet-item">
              <Avatar name={c.author.name} src={c.author.avatar} size={36} />
              <div className="cmtsheet-main">
                <div className="cmtsheet-bubble">
                  <div className="row">
                    <span className="nm">{c.author.name}</span>
                    <span className="tm">{c.time || PF_CMT_TIMES[i % PF_CMT_TIMES.length]}</span>
                  </div>
                  <div className="tx">{c.text}</div>
                </div>
                <div className="cmtsheet-acts">
                  <CommentReact />
                  <button type="button" className="cmt-link" onClick={() => setReplyFor(replyFor === c._id ? null : c._id)}>Reply</button>
                </div>
                {(c.replies || []).map((rep, j) =>
              <div key={j} className="cmtsheet-item reply">
                    <Avatar name={rep.author.name} src={rep.author.avatar} size={30} />
                    <div className="cmtsheet-main">
                      <div className="cmtsheet-bubble">
                        <div className="row"><span className="nm">{rep.author.name}</span></div>
                        <div className="tx">{rep.text}</div>
                      </div>
                    </div>
                  </div>
              )}
                {replyFor === c._id &&
              <CommentComposer small autoFocus placeholder={"Reply to " + c.author.name + "…"}
              onSubmit={(t) => {onAddReply(c._id, t);setReplyFor(null);}} />
              }
              </div>
            </div>
          )}
        </div>
        <div className="cmtsheet-foot">
          <CommentComposer placeholder="Add a comment…" onSubmit={onAddComment} />
        </div>
      </div>
    </div>);

}

/* Clamp the post body to a few lines with a "See more" / "See less" toggle.
   Passed as the `body` node to the DS PostCard (which renders {body} as-is). */
function ClampText({ text, lines = 3, more = "See more" }) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setOverflowing(el.scrollHeight - el.clientHeight > 2);
  }, [text]);
  return (
    <span className="pf-clampwrap">
      <span ref={ref} className={"pf-clamp" + (expanded ? " open" : "")}
      style={{ ...(expanded ? null : { WebkitLineClamp: lines }), color: "var(--text-primary)" }}>
        {text}
      </span>
      {(overflowing || expanded) &&
      <button type="button" className="pf-seemore" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "See less" : more}
        </button>
      }
    </span>);

}

/* Compact sliding dot indicator — max 5 visible, edge dots scale down when count > 5.
   For many-image posts the active dot is always centred; the 1/N counter tracks exact position. */
function SlidingDots({ count, idx }) {
  const MAX = 5;
  if (count <= MAX) {
    return (
      <div className="mc-dots">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={"mc-dot" + (i === idx ? " on" : "")} />
        ))}
      </div>
    );
  }
  // >5 images: always 5 dots, center is always the active/coloured one.
  const SCALES = [0.57, 0.78, 1, 0.78, 0.57];
  return (
    <div className="mc-dots">
      {SCALES.map((scale, pos) => (
        <span key={pos}
          className={"mc-dot" + (pos === 2 ? " on" : "")}
          style={{ transform: `scale(${scale})` }} />
      ))}
    </div>
  );
}

/* Swipeable image carousel with dot indicators + counter for media posts. */
function MediaCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  if (!images || images.length === 0) return null;
  const single = images.length === 1;
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild;
    const w = first ? first.offsetWidth + 8 : el.clientWidth * 0.74 + 8;
    setIdx(Math.round(el.scrollLeft / w));
  };
  return (
    <div className="mc-wrap">
      <div className={"mc-scroll" + (single ? " mc-scroll-single" : "")} ref={ref} onScroll={onScroll}>
        {images.map((src, i) =>
          <img key={i} src={src} alt={"Image " + (i + 1) + " of " + images.length} className="mc-img" />
        )}
      </div>
      {!single && <span className="mc-count">{idx + 1}/{images.length}</span>}
      {!single && <SlidingDots count={images.length} idx={idx} />}
    </div>
  );
}

/* Sample media for demo posts: a video player, a vertical reel, and a 10-image
   swipeable gallery. Rendered inside the DS PostCard's body slot. */
/* Floating avatars of people you follow who reacted — overlaid bottom-left on
   video/reel media (Facebook-style), each with a small reaction badge. */
const FOLLOW_REACTORS = [
{ name: "Daryll Cee", avatar: "assets/avatar-drtim.png", rxn: "like" },
{ name: "Marco Ricci", avatar: "assets/avatar-katy.jpg", rxn: "heart" },
{ name: "Sofia Chen", avatar: "assets/avatar-drtim.png", rxn: "heart" }];

const RXN_BADGE = {
  like: { icon: "fluent-emoji-flat:thumbs-up", bg: "var(--reaction-like)" },
  heart: { icon: "fluent-emoji-flat:red-heart", bg: "var(--reaction-love)" }
};
function FloatingReactors() {
  const [removed, setRemoved] = useState({});
  const drag = useRef(null);

  const onDown = (i, e) => {
    const pt = e.touches ? e.touches[0] : e;
    drag.current = { i, x0: pt.clientX, y0: pt.clientY, el: e.currentTarget };
    e.currentTarget.style.transition = "none";
    e.stopPropagation();
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - drag.current.x0;
    const dy = pt.clientY - drag.current.y0;
    drag.current.dist = Math.hypot(dx, dy);
    drag.current.el.style.transform = "translate(" + dx + "px," + dy + "px)";
    drag.current.el.style.opacity = String(Math.max(0, 1 - drag.current.dist / 140));
  };
  const onUp = () => {
    if (!drag.current) return;
    const { i, el, dist } = drag.current;
    if (dist > 70) {
      setRemoved((r) => ({ ...r, [i]: true })); // dragged far enough → dismiss
    } else {
      el.style.transition = "transform .2s ease, opacity .2s ease";
      el.style.transform = "";
      el.style.opacity = "";
    }
    drag.current = null;
  };

  const visible = FOLLOW_REACTORS.map((p, i) => ({ p, i })).filter(({ i }) => !removed[i]);
  if (!visible.length) return null;

  return (
    <div className="sm-reactors" onClick={(e) => e.stopPropagation()}
    onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
    onTouchMove={onMove} onTouchEnd={onUp}
    aria-label="People you follow who reacted — drag one away to hide it">
      {visible.map(({ p, i }) => {
        const b = RXN_BADGE[p.rxn] || RXN_BADGE.like;
        return (
          <span className="sm-reactor" key={i} title="Drag away to hide"
          onMouseDown={(e) => onDown(i, e)} onTouchStart={(e) => onDown(i, e)}>
            <Avatar name={p.name} src={p.avatar} size={54} />
            <span className="sm-reactor-badge" style={{ background: b.bg }}>
              <iconify-icon icon={b.icon} width="16" height="16"></iconify-icon>
            </span>
          </span>);

      })}
    </div>);

}

/* Channel context strip — shown above a post that someone you follow made in a
   channel (Facebook group-post style): channel avatar + name + Join, then poster. */
function ChannelContext({ channel }) {
  const [joined, setJoined] = useState(false);
  return (
    <div className="chx">
      <span className="chx-av"><Avatar name={channel.name} src={channel.avatar} size={42} /></span>
      <div className="chx-main">
        <div className="chx-name" style={{ fontWeight: "600", fontSize: "15px" }}>{channel.name}</div>
        <div className="chx-by">
          <Avatar name={channel.by} src={channel.byAvatar} size={22} />
          <span><b>{channel.by}</b> · {channel.time} · </span>
          <span className="chx-flag">🇬🇧</span>
        </div>
      </div>
      <button type="button" className={"chx-join" + (joined ? " on" : "")} onClick={() => setJoined((j) => !j)}>
        {joined ? "Joined" : "Join"}
      </button>
    </div>);

}

function SampleMedia({ sample }) {
  const galleryRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(sample && sample.type === "vertical");
  const [muted, setMuted] = useState(true);
  const [fs, setFs] = useState(false);
  useEffect(() => {
    if (!fs) return;
    const onKey = (e) => {if (e.key === "Escape") setFs(false);};
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [fs]);
  if (!sample) return null;

  if (sample.type === "video") {
    return (
      <div className="sm-video" onClick={() => setPlaying((p) => !p)}>
        <img src={sample.poster} alt="" />
        <span className={"sm-play" + (playing ? " on" : "")}>
          <IconifyIcon name={playing ? "fluent:pause-16-filled" : "fluent:play-16-filled"} size={26} color="var(--brand-navy)" />
        </span>
        <button type="button" className="sm-mute" aria-label={muted ? "Unmute" : "Mute"}
        onClick={(e) => {e.stopPropagation();setMuted((m) => !m);}}>
          <IconifyIcon name={muted ? "lucide:volume-x" : "lucide:volume-2"} size={16} color="var(--white)" />
        </button>
        <FloatingReactors />
        <span className="sm-badge"><IconifyIcon name="lucide:video" size={14} color="var(--white)" />{sample.duration}</span>
      </div>);

  }

  if (sample.type === "vertical") {
    return (
      <div className={"sm-vertical sm-reel" + (playing ? " playing" : "")} onClick={() => setPlaying((p) => !p)}>
        <img src={sample.image} alt="" />
        <span className="sm-badge sm-badge-tr"><IconifyIcon name="lucide:smartphone" size={14} color="var(--white)" />Reel</span>
        <span className="sm-mute" onClick={(e) => {e.stopPropagation();setMuted((m) => !m);}}>
          <IconifyIcon name={muted ? "lucide:volume-x" : "lucide:volume-2"} size={16} color="var(--white)" />
        </span>
        <span className={"sm-bigplay" + (playing ? " hide" : "")}>
          <IconifyIcon name="fluent:play-16-filled" size={30} color="var(--white)" />
        </span>
        <FloatingReactors />
        <div className="sm-controls" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="sm-ctl" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
            <IconifyIcon name={playing ? "fluent:pause-16-filled" : "fluent:play-16-filled"} size={18} color="var(--white)" />
          </button>
          <span className="sm-time">0:12</span>
          <span className="sm-track"><span className="sm-fill" /></span>
          <span className="sm-time">0:30</span>
          <button type="button" className="sm-ctl" aria-label="Fullscreen" onClick={(e) => {e.stopPropagation();setFs(true);}}>
            <IconifyIcon name="lucide:maximize-2" size={16} color="var(--white)" />
          </button>
        </div>
        {fs &&
        <div className="sm-fs" onClick={(e) => {e.stopPropagation();}}>
            <img src={sample.image} alt="" />
            <button type="button" className="sm-fs-close" aria-label="Close fullscreen"
          onClick={() => setFs(false)}>
              <IconifyIcon name="lucide:x" size={24} color="var(--white)" />
            </button>
            <button type="button" className="sm-fs-mute" aria-label={muted ? "Unmute" : "Mute"}
          onClick={() => setMuted((m) => !m)}>
              <IconifyIcon name={muted ? "lucide:volume-x" : "lucide:volume-2"} size={20} color="var(--white)" />
            </button>
            <div className="sm-fs-bar">
              <button type="button" className="sm-ctl" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
                <IconifyIcon name={playing ? "fluent:pause-16-filled" : "fluent:play-16-filled"} size={22} color="var(--white)" />
              </button>
              <span className="sm-time">0:12</span>
              <span className="sm-track"><span className="sm-fill" /></span>
              <span className="sm-time">0:30</span>
            </div>
          </div>
        }
      </div>);

  }

  // gallery
  const onScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    const w = el.clientWidth * 0.82 + 8;
    setIdx(Math.round(el.scrollLeft / w));
  };
  return (
    <div className="sm-gallery-wrap">
      <div className="sm-gallery" ref={galleryRef} onScroll={onScroll}>
        {sample.images.map((src, i) =>
        <img key={i} src={src} alt={"Image " + (i + 1) + " of " + sample.images.length} />
        )}
      </div>
      <span className="sm-count">{idx + 1}/{sample.images.length}</span>
      <SlidingDots count={sample.images.length} idx={idx} />
    </div>);

}

const PILL_EMOJI = {
  like: "fluent-emoji-flat:thumbs-up",
  love: "fluent-emoji-flat:red-heart",
  laugh: "fluent-emoji-flat:face-with-tears-of-joy"
};

/* Facebook-style inline comment thread (mobile newsfeed). Each comment is a
   grey bubble (bold name + text) with a reaction-pill row + Reply + timestamp
   beneath it; replies indent under their parent with a "View N more replies"
   link, and a "Write a comment…" composer sits at the foot. */
function InlineBubbleThread({ comments, onAddComment, onAddReply }) {
  const [replyFor, setReplyFor] = useState(null);
  const [showReplies, setShowReplies] = useState({});

  const Pills = ({ pills }) => !pills || !pills.length ? null :
  <span className="bub-pills">
      {pills.map((p, i) =>
    <span className="bub-pill" key={i}>
          <iconify-icon icon={PILL_EMOJI[p.k] || PILL_EMOJI.like} width="16" height="16"></iconify-icon>{p.n}
        </span>
    )}
    </span>;


  const Bubble = ({ c, isReply }) =>
  <div className={"bub-row" + (isReply ? " reply" : "")}>
      <Avatar name={c.author.name} src={c.author.avatar} size={isReply ? 34 : 40} />
      <div className="bub-main">
        <div className="bub">
          <div className="bub-name">{c.author.name}</div>
          <div className="bub-tx">{c.text}</div>
        </div>
        <div className="bub-acts">
          <Pills pills={c.pills} />
          <button type="button" className="bub-reply" onClick={() => setReplyFor(replyFor === c._id ? null : c._id)}>Reply</button>
          {c.time && <span className="bub-time">{c.time}</span>}
        </div>
      </div>
    </div>;


  return (
    <div className="bub-thread">
      <LikedByRowInline />
      {comments.map((c) => {
        const reps = c.replies || [];
        const open = showReplies[c._id];
        return (
          <div key={c._id} className="bub-block">
            <Bubble c={c} />
            {reps.length > 0 &&
            <div className="bub-replies">
                {(open ? reps : reps.slice(0, 1)).map((rep, i) => <Bubble key={i} c={{ ...rep, _id: c._id }} isReply />)}
                {reps.length > 1 && !open &&
              <button type="button" className="bub-more" onClick={() => setShowReplies((s) => ({ ...s, [c._id]: true }))}>
                    View {reps.length - 1} more {reps.length - 1 === 1 ? "reply" : "replies"}
                  </button>
              }
              </div>
            }
            {replyFor === c._id &&
            <div className="bub-replycompose">
                <CommentComposer small autoFocus placeholder={"Reply to " + c.author.name + "…"}
              onSubmit={(t) => {onAddReply(c._id, t);setReplyFor(null);}} />
              </div>
            }
          </div>);

      })}
      <div className="bub-compose">
        <CommentComposer placeholder="Write a comment…" onSubmit={onAddComment} />
      </div>
    </div>);

}

/* compact "Liked by" row used inside the inline bubble thread */
function LikedByRowInline() {
  return (
    <div className="bub-likedby">
      <span className="bub-likedby-avs">
        {["Jessica Hue", "Marco Ricci", "Sofia Chen"].map((n, i) =>
        <span key={i} style={{ marginLeft: i ? -10 : 0, border: "2px solid var(--surface-card)", borderRadius: "50%", display: "inline-flex" }}>
            <Avatar name={n} size={26} />
          </span>
        )}
      </span>
      <span>Liked by <b>Jessica Hue</b> and <b>others</b></span>
    </div>);

}

function SavedModal({ onClose }) {
  const sheetRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="saved-overlay" onClick={onClose}>
      <div className="saved-sheet" ref={sheetRef} onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Post saved">
        <div className="saved-handle" />
        <div className="saved-icon-wrap">
          <IconifyIcon name="lucide:bookmark-check" size={30} color="var(--brand-gold)" />
        </div>
        <div className="saved-title">Saved!</div>
        <div className="saved-desc">Your post has been saved to your collection.</div>
        <div className="saved-divider" />
        <div className="saved-where">
          <span className="saved-where-av" />
          <div className="saved-where-tx">
            <div className="saved-where-path">Profile  →  Settings  →  My Saved</div>
            <div className="saved-where-sub">Find all your saved posts here</div>
          </div>
        </div>
        <button type="button" className="saved-btn" onClick={onClose}>View Saved</button>
        <button type="button" className="saved-skip" onClick={onClose}>Maybe Later</button>
      </div>
    </div>
  );
}

function FeedPost({ post, st, onToggleLike, onReact, onShare, onSave, onAddComment, onAddReply }) {
  const ref = useRef(null);
  const [picker, setPicker] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyFor, setReplyFor] = useState(null);
  const [likesOpen, setLikesOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [savedSheetOpen, setSavedSheetOpen] = useState(false);
  const commentSheet = typeof window !== "undefined" && window.PF_COMMENT_SHEET;
  const hideT = useRef(null);

  const actionIcon = (idx) => {
    const btns = ref.current ? ref.current.querySelectorAll("button") : [];
    const b = btns[idx];
    return b ? b.querySelector("iconify-icon, svg") : null;
  };

  const show = () => {
    clearTimeout(hideT.current);
    const btn = likeButtonOf(ref.current);
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setPicker({ bottom: window.innerHeight - r.top + 8 });
  };
  const scheduleHide = () => {
    clearTimeout(hideT.current);
    hideT.current = setTimeout(() => setPicker(null), 280);
  };

  // hover the DS like button to reveal the picker
  useEffect(() => {
    const btn = likeButtonOf(ref.current);
    if (!btn) return undefined;
    btn.addEventListener("mouseenter", show);
    btn.addEventListener("mouseleave", scheduleHide);
    return () => {
      btn.removeEventListener("mouseenter", show);
      btn.removeEventListener("mouseleave", scheduleHide);
      clearTimeout(hideT.current);
    };
  }, []);

  // reflect the chosen reaction back onto the DS like button (survives re-renders)
  useLayoutEffect(() => {
    const btn = likeButtonOf(ref.current);
    if (!btn) return;
    const icon = btn.querySelector("iconify-icon");
    const label = btn.querySelector("span");
    const r = REACTION_MAP[st.reaction];
    if (r) {
      const col = cssVar(r.color);
      if (icon) {icon.setAttribute("icon", r.icon);icon.style.color = col;}
      if (label) {label.style.color = col;label.style.fontWeight = "var(--fw-semibold)";}
      btn.dataset.reacted = r.key;
    } else if (btn.dataset.reacted) {
      if (icon) {icon.setAttribute("icon", "fluent:thumb-like-16-filled");icon.style.color = "";}
      if (label) {label.style.color = "";label.style.fontWeight = "";}
      delete btn.dataset.reacted;
    }
  });

  const handleLike = () => {
    const willReact = !st.reaction;
    onToggleLike();
    if (willReact) burstReaction(ref.current, "like");
  };
  const pick = (key) => {
    const changing = st.reaction !== key;
    onReact(key);
    if (changing) burstReaction(ref.current, key);
    setPicker(null);
  };
  const handleComment = () => {
    const g = actionIcon(1);
    if (g && g.animate) {
      g.animate(
        [{ transform: "rotate(0)" }, { transform: "rotate(-17deg)" }, { transform: "rotate(13deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(0)" }],
        { duration: 520, easing: "ease-in-out" }
      );
    }
    setComposerOpen((o) => !o);
    if (commentSheet) {setSheetOpen(true);setComposerOpen(false);}
  };
  const handleSave = () => {
    const willSave = !st.saved;
    onSave();
    if (willSave) setSavedSheetOpen(true);
  };

  const handleShare = () => {
    onShare();
    const g = actionIcon(2);
    if (g && g.animate) {
      g.animate(
        [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: "translate(8px,-10px) scale(1.28)", opacity: 0.35, offset: 0.5 },
        { transform: "translate(-3px,2px) scale(1)", opacity: 1, offset: 0.78 },
        { transform: "translate(0,0) scale(1)", opacity: 1 }],

        { duration: 560, easing: "cubic-bezier(.34,1.56,.64,1)" }
      );
    }
  };

  const comments = st.comments || [];
  const hasRegion = comments.length > 0 || composerOpen;
  const inlineBubbles = typeof window !== "undefined" && window.PF_INLINE_BUBBLES;

  return (
    <div className={"post-wrap" + (post.channel ? " has-chx" : "")} ref={ref}
    style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", padding: "0px 16px" }}>
      {post.channel && <ChannelContext channel={post.channel} />}
      <PostCard {...post} commentList={[]} media={[]}
      body={post.sample
        ? <span className="pf-clampwrap"><SampleMedia sample={post.sample} /><ClampText text={post.body} /></span>
        : (post.media && post.media.length > 0)
          ? <span className="pf-clampwrap"><MediaCarousel images={post.media} /><ClampText text={post.body} more={post.channel ? "Learn More" : "See more"} /></span>
          : <ClampText text={post.body} more={post.channel ? "Learn More" : "See more"} />}
      liked={st.liked} saved={st.saved} actioned={false} likes={st.likes} shares={st.shares} comments={st.commentsCount}
      onLike={handleLike} onSave={handleSave} onComment={handleComment} onShare={handleShare}
      style={{ boxShadow: "none", border: "none", borderRadius: 0, background: "transparent" }} />
      {inlineBubbles && hasRegion &&
      <div className="comments-region" style={{ borderTop: "1px solid var(--border-default)", padding: "4px 16px 16px" }}>
          {composerOpen &&
        <CommentComposer placeholder="Write a comment…" autoFocus onSubmit={(t) => onAddComment(t)} />
        }
          <InlineBubbleThread comments={comments} onAddComment={onAddComment} onAddReply={onAddReply} />
        </div>
      }
      {!commentSheet && !inlineBubbles && hasRegion &&
      <div className="comments-region" style={{ borderTop: "1px solid var(--border-default)", padding: "6px 24px 20px" }}>
          <LikedByRow onOpen={() => setLikesOpen(true)} />
          {composerOpen &&
        <CommentComposer placeholder="Write a comment…" autoFocus onSubmit={(t) => onAddComment(t)} />
        }
          {comments.map((c) =>
        <div key={c._id} style={{ marginTop: 16 }}>
              <CommentItem {...c} reactions={null} reactionCount={null} replies={[]} />
              <div className="cmt-actions" style={{ marginLeft: 48 }}>
                <ReactTrigger />
                <span className="cmt-dot">·</span>
                <button type="button" className="cmt-link"
            onClick={() => setReplyFor(replyFor === c._id ? null : c._id)}>Reply</button>
              </div>
              {c.replies && c.replies.length > 0 &&
          <div className="cmt-replies" style={{ marginLeft: 48 }}>
                  {c.replies.map((rep, i) =>
            <div key={i}>
                      <CommentItem {...rep} reactions={null} reactionCount={null} replies={[]} avatarSize={30} />
                      <div className="cmt-actions" style={{ marginLeft: 42 }}>
                        <ReactTrigger />
                        <span className="cmt-dot">·</span>
                        <button type="button" className="cmt-link"
                onClick={() => setReplyFor(replyFor === c._id ? null : c._id)}>Reply</button>
                      </div>
                    </div>
            )}
                </div>
          }
              {replyFor === c._id &&
          <div style={{ marginLeft: 48 }}>
                  <CommentComposer small autoFocus placeholder={"Reply to " + c.author.name + "…"}
            onSubmit={(t) => {onAddReply(c._id, t);setReplyFor(null);}} />
                </div>
          }
            </div>
        )}
        </div>
      }
      {commentSheet &&
      <div style={{ borderTop: "1px solid var(--border-default)" }}>
        <LikedByRow onOpen={() => setLikesOpen(true)} />
      </div>
      }
      {commentSheet && comments.length > 0 &&
      <div className="comments-region cm-preview-region" style={{ padding: "0px", margin: "8px 0px 0px" }}>
          <div className="cmt-preview" role="button" tabIndex={0}
        onClick={() => setSheetOpen(true)}
        onKeyDown={(e) => {if (e.key === "Enter") setSheetOpen(true);}}>
            <CommentItem {...comments[0]} reactions={null} reactionCount={null} replies={[]} />
          </div>
          {comments.length > 1 &&
        <button type="button" className="cmt-viewmore" onClick={() => setSheetOpen(true)}>
              View all {comments.length} comments
            </button>
        }
        </div>
      }
      <ReactionPicker at={picker} onPick={pick} onEnter={() => clearTimeout(hideT.current)} onLeave={scheduleHide} />
      {likesOpen && <LikesModal onClose={() => setLikesOpen(false)} />}
      {sheetOpen &&
      <CommentsSheet post={post} comments={comments}
      onClose={() => setSheetOpen(false)} onAddComment={onAddComment} onAddReply={onAddReply} />
      }
      {savedSheetOpen && <SavedModal onClose={() => setSavedSheetOpen(false)} />}
    </div>);

}

/* Short, pre-truncated preview text for locked content — a free viewer only
   ever gets this snippet, never the full body (the real body sits unused
   below it, exactly as a real free-tier API response would omit it). */
function snippetOf(text, max) {
  if (!text) return text;
  // always cut to ~60% of the source length (capped at `max`) so a short
  // post never slips through whole just because it's under the char cap.
  const limit = Math.min(max, Math.max(20, Math.floor(text.length * 0.6)));
  if (text.length <= limit) return text;
  return text.slice(0, limit).replace(/\s+\S*$/, "") + "…";
}

/* Locked teaser card for gated content shown to a free-tier viewer: it
   advertises that the post exists (channel strip, snippet) but carries no
   interaction — the only action is "Upgrade". */
function TeaserPost({ post, onUpgrade }) {
  const meta = BUCKET_META[post.bucket] || { label: "Members only", color: "var(--premium-orange)" };
  return (
    <div className={"post-wrap pf-teaser" + (post.channel ? " has-chx" : "")}
    style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", padding: "0px 16px" }}>
      {post.channel && <ChannelContext channel={post.channel} />}
      <div className="pf-teaser-body">
        <span className="pf-teaser-badge" style={{ color: meta.color, borderColor: meta.color }}>
          <IconifyIcon name="lucide:lock" size={12} color={meta.color} />
          {meta.label} · Members only
        </span>
        <p className="pf-teaser-snippet">{snippetOf(post.body, 90)}</p>
        <button type="button" className="pf-teaser-cta" onClick={onUpgrade}>
          <IconifyIcon name="lucide:lock" size={15} color="#fff" />
          Upgrade to unlock this post
        </button>
      </div>
    </div>);

}

/* "Only action is Upgrade" — no purchase flow exists in this prototype yet,
   so this is a stub confirmation reusing the SavedModal sheet pattern. */
function UpgradeModal({ label, onClose }) {
  const sheetRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="saved-overlay" onClick={onClose}>
      <div className="saved-sheet" ref={sheetRef} onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Upgrade to unlock">
        <div className="saved-handle" />
        <div className="saved-icon-wrap">
          <IconifyIcon name="lucide:lock" size={30} color="var(--premium-orange)" />
        </div>
        <div className="saved-title">Unlock {label || "this content"}</div>
        <div className="saved-desc">Upgrade your membership to read this post in full, react, comment and post here yourself.</div>
        <div className="saved-divider" />
        <button type="button" className="saved-btn" style={{ background: "var(--premium-badge)" }} onClick={onClose}>See Membership Plans</button>
        <button type="button" className="saved-skip" onClick={onClose}>Maybe Later</button>
      </div>
    </div>
  );
}

/* One bucket toggle row inside the preview panel — a switch that's forced
   off + disabled for a free persona (they hold no buckets to toggle). */
function PreviewToggle({ label, sub, checked, disabled, onChange }) {
  return (
    <label className={"pf-pt-row" + (disabled ? " disabled" : "")}>
      <span className="pf-pt-text">
        <span className="pf-pt-label">{label}</span>
        <span className="pf-pt-sub">{sub}</span>
      </span>
      <span className={"pf-pt-switch" + (checked && !disabled ? " on" : "")}>
        <input type="checkbox" checked={!!checked && !disabled} disabled={disabled}
        onChange={(e) => onChange(e.target.checked)} />
        <span className="pf-pt-knob" />
      </span>
    </label>);

}

/* Dev-facing preview panel — lets the team see any persona's actual feed
   (bucket-merged, tier-gated, free-tier teasers) without a real auth/paywall
   backend. Collapsed by default and defaults to Paid · Confidence, so
   nothing changes for the normal signed-in view. */
function FeedPreviewPanel({ persona, onPersona, toggles, onToggle }) {
  const [open, setOpen] = useState(false);
  const current = PERSONA_MAP[persona] || PERSONA_MAP.confidence;
  const isFree = !current.paid && !current.admin;
  return (
    <div className="pf-preview">
      <button type="button" className="pf-preview-bar" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="pf-preview-label">Previewing as</span>
        <span className="pf-preview-current">{current.name}</span>
        <IconifyIcon name={open ? "lucide:chevron-up" : "lucide:chevron-down"} size={16} color="var(--gray-500)" />
      </button>
      {open &&
      <div className="pf-preview-panel">
          <p className="pf-preview-sec">Who's looking?</p>
          <div className="pf-preview-personas">
            {PERSONAS.map((p) =>
          <button key={p.key} type="button" className={"pf-preview-persona" + (p.key === persona ? " on" : "")}
          onClick={() => onPersona(p.key)}>
                <span className="pf-pp-name">{p.name}</span>
                <span className="pf-pp-desc">{p.desc}</span>
              </button>
          )}
          </div>
          <p className="pf-preview-sec">Their buckets</p>
          <PreviewToggle label="Bought the PROTOX course" sub="Unlocks its lessons + other buyers' comments."
        checked={toggles.course} disabled={isFree} onChange={(v) => onToggle("course", v)} />
          <PreviewToggle label="Saved an article to My Learning" sub="Resurfaces it in the feed."
        checked={toggles.save} disabled={isFree} onChange={(v) => onToggle("save", v)} />
          <PreviewToggle label={"Unfollowed “Mark”"} sub="Removes his posts and his saves — nothing else."
        checked={toggles.mute} disabled={isFree} onChange={(v) => onToggle("mute", v)} />
        </div>
      }
    </div>);

}

function Feed() {
  const [posts, setPosts] = useState(
    typeof window !== "undefined" && window.PF_OFFICIAL_ONLY ?
    officialize(POSTS) :
    POSTS
  );
  const [state, setState] = useState(() => {
    const m = {};
    [...POSTS, ...BUCKET_POSTS].forEach((p) => {m[p.id] = { liked: false, saved: false, actioned: p.actioned, likes: p.likes, base: p.likes, reaction: null, shares: p.shares, sharesBase: p.shares, comments: withIds(p.commentList), commentsCount: p.comments };});
    return m;
  });
  const [sort, setSort] = useState("All");
  const [viewerPersona, setViewerPersona] = useState("confidence");
  const [bucketToggles, setBucketToggles] = useState({ course: false, save: false, mute: false });
  const [upgradeFor, setUpgradeFor] = useState(null);

  const toggle = (id, key) => setState((s) => ({ ...s, [id]: { ...s[id], [key]: !s[id][key] } }));

  const addPost = (text) => {
    const id = "u" + Date.now();
    setPosts((ps) => [{
      id, author: { name: ME.name, avatar: ME.avatar, seals: ["gb", "verified"] }, time: "Just now",
      kind: "UPDATE:", kindIcon: "lucide:message-circle", media: [], body: text,
      likes: "0", comments: "0", shares: "0", commentList: []
    }, ...ps]);
    setState((s) => ({ ...s, [id]: { liked: false, saved: false, actioned: false, likes: "0", base: "0", reaction: null, shares: "0", sharesBase: "0", comments: [], commentsCount: "0" } }));
  };

  /* the bucket-merged block (channel ladder / course / My Learning / general)
     is spliced in right after the first editorial post, exactly where the
     single hard-coded CHANNEL_POST used to sit — everything else about the
     editorial list is untouched. */
  const bucketResolved = resolveBucketFeed(viewerPersona, bucketToggles);
  const feedItems = posts.length ?
  [
  { item: posts[0], mode: "full" },
  ...bucketResolved,
  ...posts.slice(1).map((p) => ({ item: p, mode: "full" }))] :

  bucketResolved;

  return (
    <main className="feed" data-screen-label="Home feed">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <FeedPreviewPanel persona={viewerPersona} onPersona={setViewerPersona}
        toggles={bucketToggles} onToggle={(k, v) => setBucketToggles((t) => ({ ...t, [k]: v }))} />
        <SortBar value={sort} onCycle={() => setSort(SORTS[(SORTS.indexOf(sort) + 1) % SORTS.length])} />
      </div>
      {feedItems.map(({ item: p, mode }) => {
        if (mode === "teaser") {
          return <TeaserPost key={p.id} post={p} onUpgrade={() => setUpgradeFor(p)} />;
        }
        const st = state[p.id] || {};
        const setReaction = (key) => setState((s) => {
          const cur = s[p.id];
          const reaction = cur.reaction === key ? null : key;
          return { ...s, [p.id]: { ...cur, reaction, liked: !!reaction, likes: reaction ? bump(cur.base) : cur.base } };
        });
        return (
          <FeedPost key={p.id} post={p} st={st}
          onToggleLike={() => setState((s) => {
            const cur = s[p.id];
            const reaction = cur.reaction ? null : "like";
            return { ...s, [p.id]: { ...cur, reaction, liked: !!reaction, likes: reaction ? bump(cur.base) : cur.base } };
          })}
          onReact={setReaction}
          onAddComment={(text) => setState((s) => {
            const cur = s[p.id];
            const c = { _id: "c" + Date.now(), author: { name: ME.name, avatar: ME.avatar, seals: ["gb", "verified"] }, text, replies: [] };
            return { ...s, [p.id]: { ...cur, comments: [c, ...cur.comments], commentsCount: bump(cur.commentsCount) } };
          })}
          onAddReply={(cid, text) => setState((s) => {
            const cur = s[p.id];
            const comments = cur.comments.map((c) => c._id === cid ?
            { ...c, replies: [...(c.replies || []), { author: { name: ME.name, avatar: ME.avatar, seals: ["gb", "verified"] }, text }] } :
            c);
            return { ...s, [p.id]: { ...cur, comments, commentsCount: bump(cur.commentsCount) } };
          })}
          onShare={() => setState((s) => {
            const cur = s[p.id];
            return { ...s, [p.id]: { ...cur, shares: bump(cur.sharesBase) } };
          })}
          onSave={() => toggle(p.id, "saved")} />);


      })}
      {upgradeFor &&
      <UpgradeModal label={(BUCKET_META[upgradeFor.bucket] || {}).label}
      onClose={() => setUpgradeFor(null)} />
      }
    </main>);

}

function bump(v) {
  if (typeof v === "string" && /k/i.test(v)) return v; // already abbreviated
  const n = parseInt(v, 10);
  return isNaN(n) ? v : String(n + 1);
}

/* ============================ APP ======================================== */
const ACCENTS = ["var(--brand-navy)", "var(--ai-purple)", "var(--assess-teal)", "var(--premium-orange)"];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "var(--brand-navy)",
  "radius": 12,
  "feedWidth": 600
} /*EDITMODE-END*/;

function pfTagActiveNav(activeLabel) {
  document.querySelectorAll("#pf-root nav > button").forEach((b) => {
    const label = b.textContent.replace(/[0-9]/g, "").trim();
    const active = label === activeLabel;
    b.style.setProperty("-webkit-appearance", "none", "important");
    b.style.setProperty("appearance", "none", "important");
    b.style.setProperty("background", active ? "rgb(225, 223, 242)" : "none", "important");
    b.style.setProperty("transition", "background .18s ease", "important");
    // the current page's icon stays filled to match the highlight
    const path = b.querySelector("svg path");
    if (path) path.style.setProperty("fill", active ? "currentColor" : "", "important");
  });
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => pfTagActiveNav("Home"));
  return (
    <div className="app"
    style={{
      "--action-primary": t.accent,
      "--action-primary-hover": "color-mix(in srgb, " + t.accent + ", var(--black) 12%)",
      "--r-md": t.radius + "px",
      "--feed-w": t.feedWidth + "px"
    }}>
      {!window.PF_EMBED && <TopNav active="Home" user={ME} logoSrc="assets/profinity-academy-logo-full.png"
      onNavigate={(label) => {var u = { Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];if (u) (window.pfGo || function (x) {window.location.href = x;})(u);}}
      style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />}
      <div className="page">
        <LeftRail />
        <Feed />
        <RightRail />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand" />
        <TweakColor label="Action accent" value={t.accent} options={ACCENTS}
        onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Layout" />
        <TweakSlider label="Card radius" value={t.radius} min={6} max={20} unit="px"
        onChange={(v) => setTweak("radius", v)} />
        <TweakSlider label="Feed width" value={t.feedWidth} min={540} max={680} step={10} unit="px"
        onChange={(v) => setTweak("feedWidth", v)} />
      </TweaksPanel>
    </div>);

}

/* Expose the feed + events so other pages (Community) can reuse them without
   duplicating the reaction/comment logic. */
window.PFApp = { Feed, EVENTS, ME, pfTagActiveNav, LeftRail, RightRail };

if (!window.PF_EMBED) {
  ReactDOM.createRoot(document.getElementById("pf-root")).render(<App />);
}