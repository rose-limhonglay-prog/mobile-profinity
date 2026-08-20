/* ===========================================================================
   PROfinity Academy — Newsfeed
   Composed from the bound Profinity Design System bundle
   (window.ProfinityDesignSystem_c2b5cc). Layout + a few rail cards the bundle
   doesn't ship are built here with DS primitives (Card/Avatar/Icon/Button/…)
   and DS tokens only. No raw hex, no restyled look-alikes of bundle parts.
   =========================================================================== */

/* Inline fallback for the admin-managed hashtag store (see hashtags.js) —
   some preview/embed contexts only load this file and drop other <script>
   tags, so app.jsx must be able to define window.PFHashtags itself rather
   than assume hashtags.js already ran. */
if (typeof window !== "undefined" && !window.PFHashtags) {
  (function () {
    var STORAGE_KEY = "pf-admin-hashtags";
    var DEFAULT_HASHTAGS = [
      { slug: "case-study", label: "Case Study", icon: "lucide:chart-pie" },
      { slug: "protocol", label: "Protocol", icon: "lucide:clipboard-list" },
      { slug: "discussion", label: "Discussion", icon: "lucide:message-circle" },
      { slug: "community", label: "Community", icon: "lucide:users" },
      { slug: "masterclass", label: "Masterclass", icon: "lucide:play" },
      { slug: "reel", label: "Reel", icon: "lucide:smartphone" },
      { slug: "update", label: "Update", icon: "lucide:message-circle" },
      { slug: "business", label: "Business", icon: "lucide:briefcase" },
      { slug: "anatomy", label: "Anatomy", icon: "lucide:activity" },
      { slug: "course", label: "Course", icon: "lucide:graduation-cap" },
      { slug: "patient", label: "Patient", icon: "lucide:user" },
      { slug: "clinic", label: "Clinic", icon: "lucide:stethoscope" },
      { slug: "profinity", label: "Profinity", icon: "lucide:sparkles" },
      { slug: "healthcare", label: "Healthcare", icon: "lucide:heart-pulse" },
      { slug: "mastery", label: "Mastery", icon: "lucide:award" },
      { slug: "freedom", label: "Freedom", icon: "lucide:trending-up" },
      { slug: "confidence", label: "Confidence", icon: "lucide:users" },
      { slug: "inner-circle", label: "Inner Circle", icon: "lucide:gem" },
      { slug: "learning", label: "Learning", icon: "lucide:bookmark" },
      { slug: "toxin", label: "Toxin", icon: "lucide:droplet" },
      { slug: "filler", label: "Filler", icon: "lucide:syringe" },
      { slug: "technique", label: "Technique", icon: "lucide:wand-2" },
      { slug: "rhinoplasty", label: "Rhinoplasty", icon: "lucide:scan-face" },
      { slug: "midface", label: "Midface", icon: "lucide:scan-face" },
      { slug: "jawline", label: "Jawline", icon: "lucide:scan-face" },
      { slug: "teartrough", label: "Tear Trough", icon: "lucide:scan-face" },
      { slug: "lips", label: "Lips", icon: "lucide:smile" },
      { slug: "cheeks", label: "Cheeks", icon: "lucide:scan-face" },
      { slug: "chin", label: "Chin", icon: "lucide:scan-face" },
      { slug: "temples", label: "Temples", icon: "lucide:scan-face" },
      { slug: "skin-quality", label: "Skin Quality", icon: "lucide:sparkles" },
      { slug: "fullface", label: "Full Face", icon: "lucide:scan-face" },
      { slug: "cannula", label: "Cannula", icon: "lucide:syringe" },
      { slug: "masseter", label: "Masseter", icon: "lucide:scan-face" },
      { slug: "vascular-occlusion", label: "Vascular Occlusion", icon: "lucide:alert-triangle" },
      { slug: "threadlift", label: "Thread Lift", icon: "lucide:zap" },
      { slug: "dosing", label: "Dosing", icon: "lucide:beaker" },
      { slug: "complications", label: "Complications", icon: "lucide:alert-triangle" },
      { slug: "qanda", label: "Q&A", icon: "lucide:help-circle" },
      { slug: "firstcase", label: "First Case", icon: "lucide:flag" },
      { slug: "mindset", label: "Mindset", icon: "lucide:brain" },
      { slug: "imposter-syndrome", label: "Imposter Syndrome", icon: "lucide:brain" },
      { slug: "wins", label: "Wins", icon: "lucide:trophy" },
      { slug: "hiring", label: "Hiring", icon: "lucide:user-plus" },
      { slug: "marketing", label: "Marketing", icon: "lucide:megaphone" },
      { slug: "pricing", label: "Pricing", icon: "lucide:dollar-sign" },
      { slug: "mentorship", label: "Mentorship", icon: "lucide:users" },
      { slug: "exit", label: "Exit", icon: "lucide:door-open" },
      { slug: "investment", label: "Investment", icon: "lucide:trending-up" },
      { slug: "poll", label: "Poll", icon: "lucide:bar-chart-2" },
      { slug: "questionnaire", label: "Questionnaire", icon: "lucide:list-checks" },
      { slug: "safety", label: "Safety", icon: "lucide:shield-check" }
    ];
    function slugify(label) {
      return String(label || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
    function readRaw() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
      } catch (e) { return null; }
    }
    function writeRaw(list) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
    }
    function getAll() {
      var list = readRaw();
      if (!list) { list = DEFAULT_HASHTAGS.slice(); writeRaw(list); return list; }
      var have = {};
      list.forEach(function (t) { have[t.slug] = true; });
      var missing = DEFAULT_HASHTAGS.filter(function (t) { return !have[t.slug]; });
      if (missing.length) { list = list.concat(missing); writeRaw(list); }
      return list;
    }
    function add(tag) {
      var label = (tag && tag.label || "").trim();
      if (!label) return getAll();
      var slug = slugify(label);
      if (!slug) return getAll();
      var list = getAll();
      if (list.some(function (t) { return t.slug === slug; })) return list;
      list = list.concat([{ slug: slug, label: label, icon: (tag && tag.icon) || "lucide:hash" }]);
      writeRaw(list);
      return list;
    }
    function remove(slug) {
      var list = getAll().filter(function (t) { return t.slug !== slug; });
      writeRaw(list);
      return list;
    }
    function bySlug(slug) {
      return getAll().filter(function (t) { return t.slug === slug; })[0] || null;
    }
    window.PFHashtags = { DEFAULT_HASHTAGS: DEFAULT_HASHTAGS, getAll: getAll, add: add, remove: remove, bySlug: bySlug, slugify: slugify };
  })();
}

const { useState, useRef, useEffect, useLayoutEffect, useMemo } = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav, PostCard, EventCard, MembershipCard, ChannelItem,
  Card, Avatar, Button, Icon, IconifyIcon, VerificationSeals, StatGroup, CommentItem, PostActions
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
  ffSqImg1Swap: "assets/ff-sqimg1-toxin-swap.jpg",
  p2img1: "assets/post2-img1.png",
  p2img2: "assets/post2-img2.png",
  p2img3: "assets/post2-img3.png",
  p3img1: "assets/post3-img1.png",
  p3img2: "assets/post3-img2.png",
  p3img3: "assets/post3-img3.png",
  p4img1: "assets/post4-img1.png",
  p4img2: "assets/post4-img2.png",
  p4img3: "assets/post4-img3.png",
  p4img3Followup: "assets/post4-img3-followup.jpg",
  p4img3Followup2: "assets/post4-img3-followup2.jpg",
  caseP1Img1: "assets/post-case-p1-img1.jpg",
  communityPoster: "assets/community-poster.png",
  chinPositions: "assets/chin-positions.png",
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
const ME = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg", tier: "Confidence" };

/* Membership ladder — each tier's upgrade banner should point at the next
   rung up, not repeat the tier the viewer is already in. A viewer with no
   tier yet (free) isn't on the ladder at all (indexOf === -1), so they point
   at the first rung rather than reading as "already at the top". */
const SM_TIER_LADDER = ["Confidence", "Mastery", "Freedom", "Inner Circle"];
function smNextTier(tier) {
  const i = SM_TIER_LADDER.indexOf(tier);
  if (i === SM_TIER_LADDER.length - 1) return null;
  return SM_TIER_LADDER[i + 1];
}
/* A viewer's paid tier unlocks every rung below it too. Returns the viewer's
   tier first (current, highlighted "YOUR TIER") followed by the rungs it
   includes, lowest last — e.g. "Freedom" -> ["Freedom","Mastery","Confidence"]. */
function smIncludedTiers(tier) {
  const i = SM_TIER_LADDER.indexOf(tier);
  if (i === -1) return [];
  return SM_TIER_LADDER.slice(0, i + 1).reverse();
}
const TIM = { name: "Dr Tim Pearce", avatar: "https://yt3.googleusercontent.com/HlxBYCZyQaKVlrTEJBC-7kM4rrkRH3i9lY9RJvAFPy5KqTEOs8nd8lWohPvrAS2XzIxjsHso=s900-c-k-c0x00ffffff-no-rj", seals: ["gb", "gold", "verified", "crown"] };
const MIRANDA = { name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", seals: ["gb", "verified", "gold"] };

/* Official Profinity Academy account — used as the author for knowledge-check
   quizzes/polls and any post explicitly opted out via channel/keepAuthor when
   PF_OFFICIAL_ONLY is set (the Home / Newsfeed surfaces). Every other post
   gets a random community member from RANDOM_AUTHOR_POOL below, so the free
   newsfeed reads as real community activity rather than a single broadcast
   account. */
const PROFINITY = { name: "Profinity", avatar: "assets/profinity-icon.jpg", seals: ["verified"] };

const RANDOM_AUTHOR_POOL = [
{ name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", seals: ["gb", "verified", "skinfluencer"] },
{ name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] },
{ name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] },
{ name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" },
{ name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", seals: ["skinfluencer"] },
{ name: "Jade Osei" },
{ name: "Dr Owen Clarke" }];


/* Deterministic per-post pick (not Math.random()) so a post's author stays
   stable across re-renders instead of reshuffling on every like/comment. */
function pickRandomAuthor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return RANDOM_AUTHOR_POOL[Math.abs(hash) % RANDOM_AUTHOR_POOL.length];
}

function officialize(list) {
  return list.map((p) => {
    if (p.channel || p.keepAuthor || p.bucket === "follow") return p;
    if (p.questionnaire || p.poll) return { ...p, author: PROFINITY, withOthers: null };
    return { ...p, author: pickRandomAuthor(p.id), withOthers: null };
  });
}

/* Every item below carries a bucket + access:"gated" — the same routing
   model as the architecture guide: a free viewer only ever sees the
   editorial POSTS in full; everything here resolves against the current
   preview persona + their bucket toggles (see resolveBucketFeed). */
const CHANNEL_POST = {
  id: "ch1",
  access: "gated", bucket: "confidence",
  author: { name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", seals: ["gb", "verified", "skinfluencer"] },
  channel: { name: "#Confidence · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr. Sarah Collins", byAvatar: "assets/avatar-sarah-collins.jpg", time: "2d" },
  time: "2 Days Ago", hashtags: ["confidence", "community"],
  media: [IMG.communityPoster],
  body: "Just shared my first lip-correction case in the Confidence channel — the support here is unreal. If you're nervous about posting your work, this is the place to start. 💜",
  likes: "842", comments: "96", shares: "40", actioned: false,
  commentList: [
  { author: { name: "Miranda P.", avatar: "assets/avatar-miranda.jpg", seals: ["gb", "verified"] }, text: "Welcome! This is exactly what the channel is for. 🙌",
    likes: "120", comments: "8", time: "2d", pills: [{ k: "like", n: "20" }, { k: "love", n: "6" }], reactions: ["like", "love"], reactionCount: "120" },
  { author: { name: "Luna Chen" }, text: "Beautiful result — thanks for being brave enough to share!",
    likes: "64", comments: "3", time: "1d", pills: [{ k: "like", n: "9" }], reactions: ["like"], reactionCount: "64" }]

};

const MASTERY_POST = {
  id: "ch2", access: "gated", bucket: "mastery",
  author: { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] },
  channel: { name: "#Mastery · Community", avatar: "assets/profinity-icon.jpg",
    by: "Priya Shah", byAvatar: "assets/avatar-priya-shah.jpg", time: "5h" },
  time: "5 Hours Ago", hashtags: ["mastery", "anatomy"],
  body: "Cannula vs needle for the tear trough — here's the decision tree I actually use chairside.",
  likes: "64", comments: "12", shares: "4", actioned: false,
  commentList: [
  { author: { name: "Dr Owen Clarke" }, text: "Saving this — cannula every time for me now but good to see the exceptions laid out.",
    likes: "18", comments: "2", time: "4h", pills: [{ k: "like", n: "18" }], reactions: ["like"], reactionCount: "18" },
  { author: { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" }, text: "The decision tree format is so much easier to teach juniors with, thank you!",
    likes: "9", comments: "0", time: "3h", pills: [{ k: "like", n: "9" }], reactions: ["like"], reactionCount: "9" }]

};

const FREEDOM_POST = {
  id: "ch3", access: "gated", bucket: "freedom",
  author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] },
  channel: { name: "#Freedom · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Amir Khan", byAvatar: "assets/avatar-amir-khan.jpg", time: "1d" },
  time: "1 Day Ago", hashtags: ["freedom", "business"],
  body: "How I went from one chair to three clinics in 18 months — the hiring order that mattered.",
  likes: "110", comments: "18", shares: "9", actioned: false,
  commentList: [
  { author: { name: "Dr Rachel Voss" }, text: "The order you hired in is the opposite of what I did — wish I'd read this first.",
    likes: "14", comments: "1", time: "20h", pills: [{ k: "like", n: "14" }], reactions: ["like"], reactionCount: "14" },
  { author: { name: "Leo Martins" }, text: "This is exactly the roadmap I needed before opening clinic two. Bookmarking.",
    likes: "11", comments: "0", time: "18h", pills: [{ k: "like", n: "11" }], reactions: ["like"], reactionCount: "11" }]

};

const INNER_POST = {
  id: "ch4", access: "gated", bucket: "inner",
  author: { name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", seals: ["gb", "gold", "verified", "crown"] },
  channel: { name: "#Inner Circle · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Tim Pearce", byAvatar: "assets/avatar-drtim.png", time: "3d" },
  time: "3 Days Ago", hashtags: ["inner-circle", "business"],
  body: "Inner Circle only: the exact deal structure behind my last clinic acquisition.",
  likes: "212", comments: "31", shares: "14", actioned: false, commentList: []
};

/* Extra channel posts — four more per bucket so each of the four paid
   channels (Confidence/Mastery/Freedom/Inner Circle) shows five posts. */
const CONFIDENCE_POST_2 = {
  id: "ch5", access: "gated", bucket: "confidence",
  author: { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" },
  channel: { name: "#Confidence · Community", avatar: "assets/profinity-icon.jpg",
    by: "Nurse Beth", byAvatar: "assets/avatar-nurse-beth.jpg", time: "6h" },
  time: "6 Hours Ago", hashtags: ["confidence", "firstcase"],
  body: "Posted my first toxin case here last week and the feedback genuinely changed how I show up with patients. Do it scared. 💪",
  likes: "301", comments: "44", shares: "12", actioned: false, commentList: []
};
const CONFIDENCE_POST_3 = {
  id: "ch6", access: "gated", bucket: "confidence",
  author: { name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", seals: ["skinfluencer"] },
  channel: { name: "#Confidence · Community", avatar: "assets/profinity-icon.jpg",
    by: "Mark Ellis", byAvatar: "assets/avatar-mark-ellis.jpg", time: "9h" },
  time: "9 Hours Ago", hashtags: ["confidence", "mindset"],
  body: "Anyone else get more nervous posting in here than actually doing the treatment? Curious how long that takes to fade.",
  likes: "88", comments: "27", shares: "3", actioned: false, commentList: []
};
const CONFIDENCE_POST_4 = {
  id: "ch7", access: "gated", bucket: "confidence",
  author: { name: "Jade Osei" },
  channel: { name: "#Confidence · Community", avatar: "assets/profinity-icon.jpg",
    by: "Jade Osei", time: "1d" },
  time: "1 Day Ago", hashtags: ["confidence", "imposter-syndrome"],
  body: "Two years qualified and still feel like I'm winging it half the time. This channel is the only place I say that out loud.",
  likes: "156", comments: "38", shares: "6", actioned: false, commentList: []
};
const CONFIDENCE_POST_5 = {
  id: "ch8", access: "gated", bucket: "confidence",
  author: { name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", seals: ["gb", "verified", "skinfluencer"] },
  channel: { name: "#Confidence · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr. Sarah Collins", byAvatar: "assets/avatar-sarah-collins.jpg", time: "2d" },
  time: "2 Days Ago", hashtags: ["confidence", "wins"],
  body: "Small win: a nervous first-time patient today told me she picked me because my page felt honest, not perfect. That's the whole point of showing the real work.",
  likes: "204", comments: "19", shares: "8", actioned: false, commentList: []
};

const MASTERY_POST_2 = {
  id: "ch9", access: "gated", bucket: "mastery",
  author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] },
  channel: { name: "#Mastery · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Amir Khan", byAvatar: "assets/avatar-amir-khan.jpg", time: "8h" },
  time: "8 Hours Ago", hashtags: ["mastery", "toxin"],
  body: "Masseter dosing chart I actually use — split by facial width and bite strength, not just weight. Posting the table below.",
  likes: "97", comments: "21", shares: "11", actioned: false, commentList: []
};
const MASTERY_POST_3 = {
  id: "ch10", access: "gated", bucket: "mastery",
  author: { name: "Dr Owen Clarke" },
  channel: { name: "#Mastery · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Owen Clarke", time: "1d" },
  time: "1 Day Ago", hashtags: ["mastery", "anatomy"],
  body: "Reminder from this week's cadaver lab: the danger zone for the temporal artery is closer to the brow than most training courses show.",
  likes: "142", comments: "26", shares: "19", actioned: false, commentList: []
};
const MASTERY_POST_4 = {
  id: "ch11", access: "gated", bucket: "mastery",
  author: { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] },
  channel: { name: "#Mastery · Community", avatar: "assets/profinity-icon.jpg",
    by: "Priya Shah", byAvatar: "assets/avatar-priya-shah.jpg", time: "2d" },
  time: "2 Days Ago", hashtags: ["mastery", "filler"],
  body: "Jawline filler placement question for the group: how many of you are going supraperiosteal along the mandible versus subcutaneous for definition?",
  likes: "76", comments: "33", shares: "5", actioned: false, commentList: []
};
const MASTERY_POST_5 = {
  id: "ch12", access: "gated", bucket: "mastery",
  author: { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" },
  channel: { name: "#Mastery · Community", avatar: "assets/profinity-icon.jpg",
    by: "Nurse Beth", byAvatar: "assets/avatar-nurse-beth.jpg", time: "3d" },
  time: "3 Days Ago", hashtags: ["mastery", "technique"],
  body: "Switched to cannula for the whole tear trough after last month's discussion here — zero bruising on all six patients since. Thank you all.",
  likes: "189", comments: "24", shares: "15", actioned: false, commentList: []
};

/* Rotating image pool + helpers for the extra Mastery-channel posts below —
   reuses the existing demo imagery so every gallery/video post has real
   assets without needing new files. */
const MASTERY_IMG_POOL = [
IMG.communityPoster, IMG.p1img1, IMG.p1img2, IMG.p1img3, IMG.p1img4,
IMG.p2img1, IMG.p2img2, IMG.p2img3, IMG.p3img1, IMG.p3img2, IMG.p3img3,
IMG.p4img1, IMG.p4img2, IMG.p4img3, IMG.p5img1, IMG.p5img2, IMG.p5img3,
IMG.p5img4, IMG.p5img5, IMG.p5img6, IMG.p5img7, IMG.p5img8, IMG.p5img9, IMG.p5img10];

function masteryGallery(offset) {
  return Array.from({ length: 5 }, (_, i) => MASTERY_IMG_POOL[(offset + i) % MASTERY_IMG_POOL.length]);
}

function masteryComment(name, text, likes, time, avatar) {
  return [{
    author: avatar ? { name, avatar } : { name }, text,
    likes, comments: "0", time, pills: [{ k: "like", n: likes }],
    reactions: ["like"], reactionCount: likes }];

}

function masteryPost({ id, author, time, chTime, hashtags, body, media, sample, likes, comments, shares, comment }) {
  return {
    id, access: "gated", bucket: "mastery", author,
    channel: { name: "#Mastery · Community", avatar: "assets/profinity-icon.jpg",
      by: author.name, byAvatar: author.avatar, time: chTime },
    time, hashtags, ...(media ? { media } : {}), ...(sample ? { sample } : {}),
    body, likes, comments, shares, actioned: false,
    commentList: masteryComment(comment.name, comment.text, comment.likes, comment.time, comment.avatar)
  };
}

const AMIR = { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] };
const PRIYA = { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] };
const OWEN = { name: "Dr Owen Clarke" };
const BETH = { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" };
const SARAH = { name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", seals: ["gb", "verified", "skinfluencer"] };
const RACHEL = { name: "Dr Rachel Voss" };
const LEO = { name: "Leo Martins" };
const MARK = { name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", seals: ["skinfluencer"] };
const JADE = { name: "Jade Osei" };
const NAOMI = { name: "Dr Naomi Reyes" };

const MASTERY_POST_6 = masteryPost({
  id: "ch21", author: PRIYA, time: "9 Hours Ago", chTime: "9h",
  hashtags: ["mastery", "rhinoplasty"],
  body: "Non-surgical rhinoplasty case, five stages from consult to 2-week review — dorsal hump camouflage plus tip projection with a single syringe.",
  media: masteryGallery(0),
  likes: "112", comments: "17", shares: "8",
  comment: { name: "Dr Owen Clarke", text: "That tip result is razor sharp — what gauge cannula did you use?", likes: "13", time: "8h" }
});

const MASTERY_POST_7 = masteryPost({
  id: "ch22", author: OWEN, time: "14 Hours Ago", chTime: "14h",
  hashtags: ["mastery", "midface"],
  body: "Full midface restoration, five-stage gallery — cheek, tear trough and jawline done across two sessions six weeks apart.",
  media: masteryGallery(5),
  likes: "134", comments: "22", shares: "10",
  comment: { name: "Priya Shah", text: "The staging between sessions is exactly the pacing I've been looking for — saving this.", likes: "16", time: "12h", avatar: "assets/avatar-priya-shah.jpg" }
});

const MASTERY_POST_8 = masteryPost({
  id: "ch23", author: SARAH, time: "1 Day Ago", chTime: "1d",
  hashtags: ["mastery", "jawline"],
  body: "Jawline contouring series — five angles showing the transition from soft to defined without losing feminine proportion.",
  media: masteryGallery(10),
  likes: "158", comments: "28", shares: "12",
  comment: { name: "Nurse Beth", text: "This is the balance I struggle to explain to patients — screenshotting for consults.", likes: "19", time: "20h", avatar: "assets/avatar-nurse-beth.jpg" }
});

const MASTERY_POST_9 = masteryPost({
  id: "ch24", author: BETH, time: "1 Day Ago", chTime: "22h",
  hashtags: ["mastery", "teartrough"],
  body: "Tear trough correction, five-image progression — cannula entry point marked on the first frame for anyone following along.",
  media: masteryGallery(15),
  likes: "121", comments: "20", shares: "9",
  comment: { name: "Dr Amir Khan", text: "Marking the entry point on the photo is such a small thing that helps so much — more of this please.", likes: "15", time: "18h", avatar: "assets/avatar-amir-khan.jpg" }
});

const MASTERY_POST_10 = masteryPost({
  id: "ch25", author: AMIR, time: "2 Days Ago", chTime: "2d",
  hashtags: ["mastery", "lips"],
  body: "Natural lip enhancement case, five stages — Russian technique on the upper, structural on the lower, patient's own proportions kept throughout.",
  media: masteryGallery(20),
  likes: "143", comments: "25", shares: "11",
  comment: { name: "Dr Rachel Voss", text: "Keeping her natural proportions instead of chasing trend lips is exactly why this looks so good.", likes: "17", time: "1d" }
});

const MASTERY_POST_11 = masteryPost({
  id: "ch26", author: RACHEL, time: "2 Days Ago", chTime: "1d",
  hashtags: ["mastery", "cheeks"],
  body: "Cheek augmentation for symmetry correction, five-image set — patient had noticeable left-right imbalance, resolved over two syringes.",
  media: masteryGallery(3),
  likes: "97", comments: "16", shares: "7",
  comment: { name: "Leo Martins", text: "Didn't realise how much a small asymmetry correction changes the whole face until this gallery.", likes: "10", time: "1d" }
});

const MASTERY_POST_12 = masteryPost({
  id: "ch27", author: LEO, time: "3 Days Ago", chTime: "2d",
  hashtags: ["mastery", "chin"],
  body: "Chin projection and profile balancing, five stages — small volume, big shift in the overall facial third proportions.",
  media: masteryGallery(8),
  likes: "88", comments: "14", shares: "6",
  comment: { name: "Mark Ellis", text: "Profile balancing like this is so underrated compared to lips and cheeks.", likes: "9", time: "2d", avatar: "assets/avatar-mark-ellis.jpg" }
});

const MASTERY_POST_13 = masteryPost({
  id: "ch28", author: MARK, time: "3 Days Ago", chTime: "3d",
  hashtags: ["mastery", "temples"],
  body: "Temple hollowing restoration, five-image series — cannula technique, supraperiosteal plane, immediate volume with minimal swelling by day 3.",
  media: masteryGallery(13),
  likes: "104", comments: "18", shares: "8",
  comment: { name: "Jade Osei", text: "Minimal swelling by day 3 is impressive for temples — what filler did you use here?", likes: "11", time: "2d" }
});

const MASTERY_POST_14 = masteryPost({
  id: "ch29", author: JADE, time: "4 Days Ago", chTime: "3d",
  hashtags: ["mastery", "skin-quality"],
  body: "Skin quality case, five-stage gallery combining microneedling with a light toxin layer — texture change alone sold this patient on the full protocol.",
  media: masteryGallery(18),
  likes: "79", comments: "13", shares: "5",
  comment: { name: "Dr Naomi Reyes", text: "The texture change between frame one and frame five is honestly the best result in this thread.", likes: "8", time: "3d" }
});

const MASTERY_POST_15 = masteryPost({
  id: "ch30", author: NAOMI, time: "4 Days Ago", chTime: "4d",
  hashtags: ["mastery", "fullface"],
  body: "Full-face liquid facelift, five-stage before-and-after — tear trough, cheek, jawline and lips done in a single structured session.",
  media: masteryGallery(23),
  likes: "167", comments: "31", shares: "14",
  comment: { name: "Dr. Sarah Collins", text: "Doing all four areas in one structured session and still keeping it natural is the real skill here.", likes: "18", time: "3d", avatar: "assets/avatar-sarah-collins.jpg" }
});

const MASTERY_POST_16 = masteryPost({
  id: "ch31", author: PRIYA, time: "5 Hours Ago", chTime: "5h",
  hashtags: ["mastery", "cannula"],
  sample: { type: "video", poster: IMG.p1img1, duration: "8:12" },
  body: "Full cannula entry-point walkthrough for the mid-face — camera angle shows exactly where I'm gauging depth against the periosteum.",
  likes: "168", comments: "27", shares: "13",
  comment: { name: "Dr Owen Clarke", text: "The close-up on the entry angle is the part every training course skips — thank you for this.", likes: "20", time: "3h" }
});

const MASTERY_POST_17 = masteryPost({
  id: "ch32", author: OWEN, time: "10 Hours Ago", chTime: "10h",
  hashtags: ["mastery", "masseter"],
  sample: { type: "video", poster: IMG.p2img1, duration: "6:45" },
  body: "Masseter injection walkthrough, split by facial width and bite strength — the dosing chart from last week's post, now demonstrated chairside.",
  likes: "121", comments: "19", shares: "9",
  comment: { name: "Nurse Beth", text: "Watching this after reading your dosing chart made the whole thing click.", likes: "14", time: "7h", avatar: "assets/avatar-nurse-beth.jpg" }
});

const MASTERY_POST_18 = masteryPost({
  id: "ch33", author: AMIR, time: "1 Day Ago", chTime: "1d",
  hashtags: ["mastery", "vascular-occlusion"],
  sample: { type: "video", poster: IMG.p3img1, duration: "10:20" },
  body: "Vascular occlusion management, real-time — recognising the early signs and the exact order I work through hyaluronidase, warmth and massage.",
  likes: "203", comments: "36", shares: "21",
  comment: { name: "Dr Rachel Voss", text: "Every injector needs to watch this before their next case, not just the ones who've had a scare.", likes: "27", time: "22h" }
});

const MASTERY_POST_19 = masteryPost({
  id: "ch34", author: BETH, time: "1 Day Ago", chTime: "18h",
  hashtags: ["mastery", "threadlift"],
  sample: { type: "video", poster: IMG.p4img1, duration: "5:30" },
  body: "Thread lift placement for the lower face — cog direction and vector planning explained before a single needle goes in.",
  likes: "94", comments: "15", shares: "6",
  comment: { name: "Priya Shah", text: "Planning the vectors out loud like this is such a good teaching habit — more of this please.", likes: "11", time: "15h", avatar: "assets/avatar-priya-shah.jpg" }
});

const MASTERY_POST_20 = masteryPost({
  id: "ch35", author: TIM, time: "2 Days Ago", chTime: "1d",
  hashtags: ["mastery", "masterclass"],
  sample: { type: "video", poster: IMG.communityPoster, duration: "22:05" },
  body: "Full replay of this month's Mastery masterclass — live injection walkthrough plus the Q&A that ran long because nobody wanted to leave.",
  likes: "276", comments: "48", shares: "30",
  comment: { name: "Dr Naomi Reyes", text: "The Q&A section alone was worth the whole session — thank you for keeping it in the replay.", likes: "24", time: "20h" }
});

const MASTERY_POST_21 = masteryPost({
  id: "ch36", author: OWEN, time: "6 Hours Ago", chTime: "6h",
  hashtags: ["mastery", "dosing"],
  media: [IMG.p2img2],
  body: "Updated masseter dosing infographic — printed this out for the treatment room, saves re-explaining the split every time.",
  likes: "72", comments: "11", shares: "5",
  comment: { name: "Nurse Beth", text: "Printing this for my room too, thank you!", likes: "9", time: "4h", avatar: "assets/avatar-nurse-beth.jpg" }
});

const MASTERY_POST_22 = masteryPost({
  id: "ch37", author: PRIYA, time: "11 Hours Ago", chTime: "11h",
  hashtags: ["mastery", "anatomy"],
  media: [IMG.p3img2],
  body: "Danger-zone reference sheet I keep pinned above my treatment chair — worth revisiting even years into practice.",
  likes: "86", comments: "14", shares: "6",
  comment: { name: "Dr Amir Khan", text: "Never a bad idea to keep this in view no matter how experienced you are.", likes: "12", time: "9h", avatar: "assets/avatar-amir-khan.jpg" }
});

const MASTERY_POST_23 = masteryPost({
  id: "ch38", author: AMIR, time: "2 Days Ago", chTime: "1d",
  hashtags: ["mastery", "complications"],
  sample: { type: "video", poster: IMG.p4img2, duration: "4:15" },
  body: "Short case discussion on a delayed nodule complication — timeline, what I tried first, and when I referred out.",
  likes: "118", comments: "21", shares: "10",
  comment: { name: "Dr Rachel Voss", text: "Appreciate you sharing the referral decision too, not just the successful part.", likes: "13", time: "22h" }
});

const MASTERY_POST_24 = masteryPost({
  id: "ch39", author: BETH, time: "3 Days Ago", chTime: "2d",
  hashtags: ["mastery", "qanda"],
  sample: { type: "video", poster: IMG.p3img3, duration: "15:50" },
  body: "Recorded Q&A from this week's Mastery drop-in — mostly temple and tear trough questions, timestamps in the comments.",
  likes: "103", comments: "17", shares: "7",
  comment: { name: "Jade Osei", text: "The temple question at the start was exactly what I needed answered, thank you!", likes: "10", time: "1d" }
});

const MASTERY_POST_25 = masteryPost({
  id: "ch40", author: RACHEL, time: "4 Days Ago", chTime: "3d",
  hashtags: ["mastery", "filler"],
  media: [IMG.p1img2],
  body: "Filler viscosity cheat sheet by treatment area — the one chart I wish someone had given me in year one.",
  likes: "91", comments: "15", shares: "6",
  comment: { name: "Leo Martins", text: "This should be handed out on day one of every training course.", likes: "12", time: "2d" }
});

const FREEDOM_POST_2 = {
  id: "ch13", access: "gated", bucket: "freedom",
  author: { name: "Dr Rachel Voss" },
  channel: { name: "#Freedom · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Rachel Voss", time: "5h" },
  time: "5 Hours Ago", hashtags: ["freedom", "hiring"],
  body: "Hired my first associate injector this month. The interview question that told me the most: \"walk me through a complication you caused.\"",
  likes: "134", comments: "22", shares: "9", actioned: false, commentList: []
};
const FREEDOM_POST_3 = {
  id: "ch14", access: "gated", bucket: "freedom",
  author: { name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", seals: ["skinfluencer"] },
  channel: { name: "#Freedom · Community", avatar: "assets/profinity-icon.jpg",
    by: "Mark Ellis", byAvatar: "assets/avatar-mark-ellis.jpg", time: "1d" },
  time: "1 Day Ago", hashtags: ["freedom", "marketing"],
  body: "Rebuilt my booking funnel around a single lead magnet — consult bookings up 40% in three weeks. Happy to share the exact sequence.",
  likes: "167", comments: "29", shares: "21", actioned: false, commentList: []
};
const FREEDOM_POST_4 = {
  id: "ch15", access: "gated", bucket: "freedom",
  author: { name: "Leo Martins" },
  channel: { name: "#Freedom · Community", avatar: "assets/profinity-icon.jpg",
    by: "Leo Martins", time: "2d" },
  time: "2 Days Ago", hashtags: ["freedom", "clinic"],
  body: "Just signed a second lease. The break clause negotiation alone saved me more than a year's rent if things go sideways — ask for it every time.",
  likes: "92", comments: "16", shares: "7", actioned: false, commentList: []
};
const FREEDOM_POST_5 = {
  id: "ch16", access: "gated", bucket: "freedom",
  author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] },
  channel: { name: "#Freedom · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Amir Khan", byAvatar: "assets/avatar-amir-khan.jpg", time: "3d" },
  time: "3 Days Ago", hashtags: ["freedom", "pricing"],
  body: "Raised prices 15% across the board this quarter with zero cancellations. The scripts I gave reception for handling the conversation made the difference.",
  likes: "148", comments: "25", shares: "13", actioned: false, commentList: []
};

const INNER_POST_2 = {
  id: "ch17", access: "gated", bucket: "inner",
  author: { name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", seals: ["gb", "gold", "verified", "crown"] },
  channel: { name: "#Inner Circle · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Tim Pearce", byAvatar: "assets/avatar-drtim.png", time: "7h" },
  time: "7 Hours Ago", hashtags: ["inner-circle", "mentorship"],
  body: "Opened up two more seats in this quarter's mentorship cohort for Inner Circle members only. Comment below if you want the details.",
  likes: "176", comments: "40", shares: "10", actioned: false, commentList: []
};
const INNER_POST_3 = {
  id: "ch18", access: "gated", bucket: "inner",
  author: { name: "Dr Naomi Reyes" },
  channel: { name: "#Inner Circle · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Naomi Reyes", time: "1d" },
  time: "1 Day Ago", hashtags: ["inner-circle", "exit"],
  body: "Closed the exit on my four-clinic group last month. Happy to break down the valuation multiple we actually landed on versus what the broker first quoted.",
  likes: "263", comments: "52", shares: "22", actioned: false, commentList: []
};
const INNER_POST_4 = {
  id: "ch19", access: "gated", bucket: "inner",
  author: { name: "James Whitfield" },
  channel: { name: "#Inner Circle · Community", avatar: "assets/profinity-icon.jpg",
    by: "James Whitfield", time: "2d" },
  time: "2 Days Ago", hashtags: ["inner-circle", "investment"],
  body: "Notes from the private roundtable last week: two of the PE-backed groups in the room are already pausing new-site acquisitions for next year.",
  likes: "198", comments: "34", shares: "17", actioned: false, commentList: []
};
const INNER_POST_5 = {
  id: "ch20", access: "gated", bucket: "inner",
  author: { name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", seals: ["gb", "gold", "verified", "crown"] },
  channel: { name: "#Inner Circle · Community", avatar: "assets/profinity-icon.jpg",
    by: "Dr Tim Pearce", byAvatar: "assets/avatar-drtim.png", time: "4d" },
  time: "4 Days Ago", hashtags: ["inner-circle", "business"],
  body: "The real reason most acquisitions fail isn't the price — it's the 90 days after completion. Breaking down our integration checklist at next month's roundtable.",
  likes: "231", comments: "29", shares: "18", actioned: false, commentList: []
};

/* Generic per-bucket post factory (mirrors masteryPost above) — used to add
   volume to the Confidence, Freedom and Inner Circle channels so every paid
   tier reads as an active community, not just Mastery. */
function tierComment(name, text, likes, time, avatar) {
  return [{
    author: avatar ? { name, avatar } : { name }, text,
    likes, comments: "0", time, pills: [{ k: "like", n: likes }],
    reactions: ["like"], reactionCount: likes }];

}
function tierPost(bucket, channelLabel) {
  return function ({ id, author, time, chTime, hashtags, body, media, sample, likes, comments, shares, comment }) {
    return {
      id, access: "gated", bucket, author,
      channel: { name: `#${channelLabel} · Community`, avatar: "assets/profinity-icon.jpg",
        by: author.name, byAvatar: author.avatar, time: chTime },
      time, hashtags, ...(media ? { media } : {}), ...(sample ? { sample } : {}),
      body, likes, comments, shares, actioned: false,
      commentList: tierComment(comment.name, comment.text, comment.likes, comment.time, comment.avatar)
    };
  };
}
const confidencePost = tierPost("confidence", "Confidence");
const freedomPost = tierPost("freedom", "Freedom");
const innerPost = tierPost("inner", "Inner Circle");

const CHLOE = { name: "Chloe Bennett" };
const FAISAL = { name: "Dr Faisal Rahman", seals: ["gb"] };
const BEN = { name: "Ben Foster" };
const LAYLA = { name: "Layla Hassan" };
const RUTH = { name: "Ruth Adeyemi" };
const ELENA = { name: "Dr Elena Vasquez", seals: ["verified"] };
const JAMES = { name: "James Whitfield" };

const CONFIDENCE_POST_6 = confidencePost({
  id: "ch41", author: CHLOE, time: "3 Hours Ago", chTime: "3h",
  hashtags: ["confidence", "firstcase"], media: masteryGallery(1),
  body: "First cannula case posted here and the channel talked me through every worry beforehand — five photos from consult to two-week review.",
  likes: "118", comments: "24", shares: "9",
  comment: { name: "Priya Shah", text: "This is exactly why we're all here — congratulations on posting it!", likes: "14", time: "2h", avatar: "assets/avatar-priya-shah.jpg" }
});

const CONFIDENCE_POST_7 = confidencePost({
  id: "ch42", author: FAISAL, time: "7 Hours Ago", chTime: "7h",
  hashtags: ["confidence", "mindset"],
  body: "Told a patient today I was still building confidence with a technique and she said that honesty was why she trusted me. Vulnerability sells better than bravado.",
  likes: "142", comments: "19", shares: "6",
  comment: { name: "Nurse Beth", text: "Saying this out loud to patients is harder than any injection technique, honestly.", likes: "12", time: "5h", avatar: "assets/avatar-nurse-beth.jpg" }
});

const CONFIDENCE_POST_8 = confidencePost({
  id: "ch43", author: PRIYA, time: "10 Hours Ago", chTime: "10h",
  hashtags: ["confidence", "reminders"], media: [IMG.p1img3],
  body: "Printed out the encouragement thread from last month and stuck it inside my treatment room door. Needed a reminder today.",
  likes: "96", comments: "11", shares: "4",
  comment: { name: "Jade Osei", text: "Doing this too from now on, what a good idea.", likes: "8", time: "8h" }
});

const CONFIDENCE_POST_9 = confidencePost({
  id: "ch44", author: BEN, time: "1 Day Ago", chTime: "22h",
  hashtags: ["confidence", "overthinking"],
  body: "How long did it take everyone to stop replaying a night's consults in your head before sleep? Two years in and mine still runs.",
  likes: "173", comments: "41", shares: "7",
  comment: { name: "Dr Owen Clarke", text: "Five years in and mine still does it sometimes. You're not alone in this.", likes: "22", time: "18h" }
});

const CONFIDENCE_POST_10 = confidencePost({
  id: "ch45", author: SARAH, time: "1 Day Ago", chTime: "20h",
  hashtags: ["confidence", "masterclass"], sample: { type: "video", poster: IMG.p2img3, duration: "9:40" },
  body: "Recorded panel from tonight's Confidence circle — three of us talking through the exact moment we stopped feeling like frauds.",
  likes: "204", comments: "37", shares: "16",
  comment: { name: "Mark Ellis", text: "The bit about the first year plateau was the whole panel for me.", likes: "19", time: "16h", avatar: "assets/avatar-mark-ellis.jpg" }
});

const CONFIDENCE_POST_11 = confidencePost({
  id: "ch46", author: LAYLA, time: "2 Days Ago", chTime: "1d",
  hashtags: ["confidence", "milestone"], media: masteryGallery(6),
  body: "My tenth post in this channel! Here's the case that finally made me stop deleting drafts before hitting submit.",
  likes: "131", comments: "28", shares: "10",
  comment: { name: "Dr. Sarah Collins", text: "Ten posts in and this quality — so glad you stopped deleting the drafts.", likes: "17", time: "22h", avatar: "assets/avatar-sarah-collins.jpg" }
});

const CONFIDENCE_POST_12 = confidencePost({
  id: "ch47", author: AMIR, time: "2 Days Ago", chTime: "1d",
  hashtags: ["confidence", "mentorship"],
  body: "Junior injector shadowing me today asked how I handle nerves before a big case. Told her honestly: I don't, I just start anyway.",
  likes: "158", comments: "23", shares: "9",
  comment: { name: "Ruth Adeyemi", text: "\"I just start anyway\" might be the most useful sentence in this whole channel.", likes: "15", time: "1d" }
});

const CONFIDENCE_POST_13 = confidencePost({
  id: "ch48", author: RUTH, time: "3 Days Ago", chTime: "2d",
  hashtags: ["confidence", "patientfeedback"], media: [IMG.p3img1],
  body: "Patient card that made my week: \"you explained everything twice without making me feel silly for asking.\"",
  likes: "112", comments: "14", shares: "5",
  comment: { name: "Chloe Bennett", text: "This is the kind of feedback that means more than any before-and-after.", likes: "10", time: "2d" }
});

const CONFIDENCE_POST_14 = confidencePost({
  id: "ch49", author: MARK, time: "3 Days Ago", chTime: "2d", sample: { type: "video", poster: IMG.p4img3, duration: "3:55" },
  hashtags: ["confidence", "nerves"],
  body: "Filmed myself talking through pre-case nerves for anyone who needs to hear it isn't just you.",
  likes: "147", comments: "26", shares: "13",
  comment: { name: "Dr Faisal Rahman", text: "Needed exactly this before tomorrow's list, thank you Mark.", likes: "13", time: "1d" }
});

const CONFIDENCE_POST_15 = confidencePost({
  id: "ch50", author: OWEN, time: "4 Days Ago", chTime: "3d",
  hashtags: ["confidence", "learning"],
  body: "Three years qualified and I still google things I definitely already know, chairside, between patients. This channel normalised that for me.",
  likes: "189", comments: "32", shares: "11",
  comment: { name: "Ben Foster", text: "The relief of reading this as someone one year in is enormous.", likes: "16", time: "3d" }
});

const CONFIDENCE_POST_16 = confidencePost({
  id: "ch51", author: ELENA, time: "4 Days Ago", chTime: "4d",
  hashtags: ["confidence", "growth"], media: masteryGallery(11),
  body: "Toxin case #3 in the confidence channel — used to only post my \"perfect\" work, now I post the ones I actually learned from.",
  likes: "104", comments: "18", shares: "6",
  comment: { name: "Dr Amir Khan", text: "The ones you learn from are always more useful to the rest of us anyway.", likes: "12", time: "3d", avatar: "assets/avatar-amir-khan.jpg" }
});

const CONFIDENCE_POST_17 = confidencePost({
  id: "ch52", author: JADE, time: "5 Days Ago", chTime: "4d",
  hashtags: ["confidence", "selfdoubt"],
  body: "A patient cancelled last minute today and my brain immediately decided it was because of my work. It wasn't. Anyone else do that math?",
  likes: "121", comments: "29", shares: "5",
  comment: { name: "Layla Hassan", text: "Every single time, and it's never actually about that. Hope the rest of your day was better.", likes: "14", time: "4d" }
});

const CONFIDENCE_POST_18 = confidencePost({
  id: "ch53", author: BETH, time: "5 Days Ago", chTime: "5d", media: [IMG.p5img4],
  hashtags: ["confidence", "peerreview"],
  body: "Whiteboard from tonight's peer review — writing \"good enough is not the same as unsafe\" where I can see it every shift.",
  likes: "99", comments: "15", shares: "7",
  comment: { name: "Priya Shah", text: "Stealing this for my own treatment room, thank you Beth.", likes: "11", time: "4d", avatar: "assets/avatar-priya-shah.jpg" }
});

const CONFIDENCE_POST_19 = confidencePost({
  id: "ch54", author: FAISAL, time: "6 Days Ago", chTime: "5d", sample: { type: "video", poster: IMG.communityPoster, duration: "12:30" },
  hashtags: ["confidence", "complications"],
  body: "Talking through the first complication I ever had and what actually helped me recover my nerve afterwards.",
  likes: "176", comments: "34", shares: "20",
  comment: { name: "Nurse Beth", text: "This is exactly the kind of honesty that makes this channel worth paying for.", likes: "21", time: "4d", avatar: "assets/avatar-nurse-beth.jpg" }
});

const CONFIDENCE_POST_20 = confidencePost({
  id: "ch55", author: NAOMI, time: "1 Week Ago", chTime: "6d",
  hashtags: ["confidence", "fullcircle"],
  body: "Six months since my last post here I was terrified to make. Today someone messaged saying it helped them post their first. Full circle.",
  likes: "215", comments: "38", shares: "17",
  comment: { name: "Dr Rachel Voss", text: "This is why we all keep showing up in this channel. Thank you for coming back to say it.", likes: "20", time: "5d" }
});

const FREEDOM_POST_6 = freedomPost({
  id: "ch56", author: CHLOE, time: "4 Hours Ago", chTime: "4h",
  hashtags: ["freedom", "renovation"], media: masteryGallery(16),
  body: "Renovation before-and-after on clinic two — five photos, six weeks, way over budget but worth it.",
  likes: "108", comments: "16", shares: "8",
  comment: { name: "Leo Martins", text: "Over budget every single time, but it always looks worth it in the after shots.", likes: "11", time: "3h" }
});

const FREEDOM_POST_7 = freedomPost({
  id: "ch57", author: FAISAL, time: "8 Hours Ago", chTime: "8h",
  hashtags: ["freedom", "associates"],
  body: "Switched from hourly to fixed day-rate for my associates. Retention up, arguments about clock-watching gone.",
  likes: "134", comments: "21", shares: "9",
  comment: { name: "Dr Rachel Voss", text: "Made the same switch in January, wish I'd done it years earlier.", likes: "13", time: "6h" }
});

const FREEDOM_POST_8 = freedomPost({
  id: "ch58", author: RACHEL, time: "12 Hours Ago", chTime: "12h", media: [IMG.p1img4],
  hashtags: ["freedom", "systems"],
  body: "New booking system dashboard live today — cut no-shows by a third in the first month alone.",
  likes: "149", comments: "24", shares: "12",
  comment: { name: "Mark Ellis", text: "Which system is this? Ours is still held together with reminder texts.", likes: "14", time: "9h", avatar: "assets/avatar-mark-ellis.jpg" }
});

const FREEDOM_POST_9 = freedomPost({
  id: "ch59", author: BEN, time: "1 Day Ago", chTime: "20h",
  hashtags: ["freedom", "expansion"],
  body: "Anyone else find the second location harder than the first? First one I could wing. Second one needed actual systems.",
  likes: "127", comments: "27", shares: "6",
  comment: { name: "Leo Martins", text: "Second one is always the hard one, third gets easier again once the systems exist.", likes: "12", time: "17h" }
});

const FREEDOM_POST_10 = freedomPost({
  id: "ch60", author: LEO, time: "1 Day Ago", chTime: "18h", sample: { type: "video", poster: IMG.p2img1, duration: "7:10" },
  hashtags: ["freedom", "sop"],
  body: "Walkthrough of the SOP folder I built for my clinic managers — every process from onboarding to end of day float count.",
  likes: "161", comments: "22", shares: "15",
  comment: { name: "Dr Amir Khan", text: "Documenting the float count process alone would save my managers an hour a week.", likes: "16", time: "14h", avatar: "assets/avatar-amir-khan.jpg" }
});

const FREEDOM_POST_11 = freedomPost({
  id: "ch61", author: LAYLA, time: "2 Days Ago", chTime: "1d",
  hashtags: ["freedom", "hiring"],
  body: "Fired my first employee this year. Should have done it four months earlier than I did — the team morale shift afterward was immediate.",
  likes: "118", comments: "31", shares: "7",
  comment: { name: "Ruth Adeyemi", text: "The delay is always longer than it should be, every time I've had to do it too.", likes: "13", time: "1d" }
});

const FREEDOM_POST_12 = freedomPost({
  id: "ch62", author: MARK, time: "2 Days Ago", chTime: "1d", media: masteryGallery(21),
  hashtags: ["freedom", "rebrand"],
  body: "Rebrand launch across all three locations — five shots from signage to new patient forms.",
  likes: "143", comments: "19", shares: "11",
  comment: { name: "Chloe Bennett", text: "The consistency across all three locations is what really sells the rebrand.", likes: "12", time: "20h" }
});

const FREEDOM_POST_13 = freedomPost({
  id: "ch63", author: RUTH, time: "3 Days Ago", chTime: "2d",
  hashtags: ["freedom", "suppliers"],
  body: "Negotiated my supplier contracts down 12% just by asking what the volume discount tiers actually were. Nobody offers it upfront.",
  likes: "137", comments: "20", shares: "14",
  comment: { name: "Dr Faisal Rahman", text: "Asked mine the same question this morning after reading this. Already saved 8%.", likes: "15", time: "2d" }
});

const FREEDOM_POST_14 = freedomPost({
  id: "ch64", author: AMIR, time: "3 Days Ago", chTime: "2d", sample: { type: "video", poster: IMG.p3img2, duration: "5:05" },
  hashtags: ["freedom", "objections"],
  body: "Recorded the exact script my reception team uses for price objections — word for word, feel free to steal it.",
  likes: "168", comments: "25", shares: "19",
  comment: { name: "Nurse Beth", text: "Handing this straight to my front desk tomorrow morning.", likes: "17", time: "1d", avatar: "assets/avatar-nurse-beth.jpg" }
});

const FREEDOM_POST_15 = freedomPost({
  id: "ch65", author: ELENA, time: "4 Days Ago", chTime: "3d",
  hashtags: ["freedom", "promotion"],
  body: "Promoted my most senior nurse to clinic manager instead of hiring externally. Best decision I made this year.",
  likes: "121", comments: "17", shares: "8",
  comment: { name: "Dr Owen Clarke", text: "Promoting from within always pays off more than people expect it to.", likes: "10", time: "3d" }
});

const FREEDOM_POST_16 = freedomPost({
  id: "ch66", author: OWEN, time: "4 Days Ago", chTime: "4d", media: [IMG.p4img1],
  hashtags: ["freedom", "financials"],
  body: "Financials review from Q2 — margins finally where I wanted them after cutting three underperforming treatment lines.",
  likes: "109", comments: "13", shares: "6",
  comment: { name: "Dr Rachel Voss", text: "Cutting the underperforming lines is always the hardest financial decision to make.", likes: "9", time: "3d" }
});

const FREEDOM_POST_17 = freedomPost({
  id: "ch67", author: JADE, time: "5 Days Ago", chTime: "4d",
  hashtags: ["freedom", "franchise"],
  body: "Considering franchising the brand versus opening owned locations. Anyone in here done both? Want the real trade-offs, not the theory.",
  likes: "133", comments: "36", shares: "9",
  comment: { name: "Leo Martins", text: "Done both — happy to jump on a call and walk you through the real trade-offs.", likes: "14", time: "4d" }
});

const FREEDOM_POST_18 = freedomPost({
  id: "ch68", author: BETH, time: "5 Days Ago", chTime: "5d", sample: { type: "video", poster: IMG.p5img1, duration: "15:00" },
  hashtags: ["freedom", "milestone"],
  body: "Filmed a walkthrough of clinic three on opening day — three locations, eighteen months, still can't quite believe it.",
  likes: "187", comments: "29", shares: "18",
  comment: { name: "Mark Ellis", text: "Eighteen months for three locations is an incredible pace — congratulations Beth.", likes: "19", time: "4d", avatar: "assets/avatar-mark-ellis.jpg" }
});

const FREEDOM_POST_19 = freedomPost({
  id: "ch69", author: RACHEL, time: "6 Days Ago", chTime: "5d",
  hashtags: ["freedom", "retention"],
  body: "Raised associate day rates to retain my best injector after a competitor tried to poach her. Cheaper than replacing her, every time.",
  likes: "124", comments: "18", shares: "7",
  comment: { name: "Dr Amir Khan", text: "Always cheaper to retain than replace — learned that one the expensive way.", likes: "11", time: "4d", avatar: "assets/avatar-amir-khan.jpg" }
});

const FREEDOM_POST_20 = freedomPost({
  id: "ch70", author: LEO, time: "1 Week Ago", chTime: "6d", media: masteryGallery(2),
  hashtags: ["freedom", "marketing"],
  body: "Five photos from the trade show booth this weekend — best lead-gen we've done all year, sharing the setup in case it helps.",
  likes: "115", comments: "16", shares: "10",
  comment: { name: "Ben Foster", text: "The booth setup alone is worth copying, thanks for sharing the photos.", likes: "10", time: "5d" }
});

const INNER_POST_6 = innerPost({
  id: "ch71", author: TIM, time: "6 Hours Ago", chTime: "6h",
  hashtags: ["inner-circle", "acquisition"],
  body: "Closed on clinic number four this week. The earn-out structure took longer to negotiate than the price itself.",
  likes: "248", comments: "33", shares: "19",
  comment: { name: "Dr Naomi Reyes", text: "The earn-out is always the real negotiation — congratulations on number four.", likes: "22", time: "4h" }
});

const INNER_POST_7 = innerPost({
  id: "ch72", author: NAOMI, time: "10 Hours Ago", chTime: "10h", sample: { type: "video", poster: IMG.communityPoster, duration: "18:20" },
  hashtags: ["inner-circle", "duediligence"],
  body: "Recorded my own walkthrough of the data room I built before going to market — saved months in due diligence.",
  likes: "196", comments: "27", shares: "21",
  comment: { name: "James Whitfield", text: "Wish I'd seen this before my own process — would have saved a huge amount of back and forth.", likes: "18", time: "8h" }
});

const INNER_POST_8 = innerPost({
  id: "ch73", author: JAMES, time: "1 Day Ago", chTime: "22h",
  hashtags: ["inner-circle", "privateequity"],
  body: "Private equity buyer walked from our deal at the eleventh hour over an EBITDA add-back disagreement. Happy to share where the number actually landed.",
  likes: "211", comments: "44", shares: "16",
  comment: { name: "Dr Tim Pearce", text: "The add-back disagreements are where most of these deals actually die — appreciate you sharing the detail.", likes: "24", time: "18h", avatar: "assets/avatar-drtim.png" }
});

const INNER_POST_9 = innerPost({
  id: "ch74", author: ELENA, time: "1 Day Ago", chTime: "20h",
  hashtags: ["inner-circle", "finance"],
  body: "Applied for my first acquisition loan through the lender three of you recommended at the roundtable. Approved in nine days.",
  likes: "167", comments: "20", shares: "12",
  comment: { name: "Dr Naomi Reyes", text: "Nine days is fast for that lender — glad the recommendation paid off.", likes: "14", time: "16h" }
});

const INNER_POST_10 = innerPost({
  id: "ch75", author: TIM, time: "2 Days Ago", chTime: "1d", media: [IMG.p2img2],
  hashtags: ["inner-circle", "dealstructure"],
  body: "Deal structure diagram from this quarter's acquisition — sharing the earn-out schedule with the group as promised.",
  likes: "223", comments: "31", shares: "20",
  comment: { name: "Dr Elena Vasquez", text: "The staged earn-out schedule is exactly the structure I've been trying to model for mine.", likes: "20", time: "22h" }
});

const INNER_POST_11 = innerPost({
  id: "ch76", author: FAISAL, time: "2 Days Ago", chTime: "1d",
  hashtags: ["inner-circle", "postexit"],
  body: "Six months post-exit and the hardest part wasn't the money, it was waking up without a clinic to run. Anyone else been through this?",
  likes: "189", comments: "38", shares: "9",
  comment: { name: "Dr Naomi Reyes", text: "Every word of this. Took me almost a year to feel settled after my own exit.", likes: "21", time: "1d" }
});

const INNER_POST_12 = innerPost({
  id: "ch77", author: RUTH, time: "3 Days Ago", chTime: "2d", sample: { type: "video", poster: IMG.p3img3, duration: "9:15" },
  hashtags: ["inner-circle", "mbo"],
  body: "Recorded walkthrough of how I structured the management buyout for my senior team instead of selling externally.",
  likes: "178", comments: "24", shares: "17",
  comment: { name: "James Whitfield", text: "Keeping it internal like this is undervalued compared to chasing the highest external bid.", likes: "16", time: "2d" }
});

const INNER_POST_13 = innerPost({
  id: "ch78", author: JAMES, time: "3 Days Ago", chTime: "2d",
  hashtags: ["inner-circle", "market"],
  body: "Two more PE-backed groups pausing acquisitions confirmed at last night's dinner. Multiples are compressing faster than the reports suggest.",
  likes: "202", comments: "41", shares: "23",
  comment: { name: "Dr Tim Pearce", text: "Matches what I'm hearing from three separate brokers this month.", likes: "23", time: "2d", avatar: "assets/avatar-drtim.png" }
});

const INNER_POST_14 = innerPost({
  id: "ch79", author: NAOMI, time: "4 Days Ago", chTime: "3d", media: [IMG.p4img2],
  hashtags: ["inner-circle", "valuation"],
  body: "Valuation bridge from the broker's first offer to what we actually closed at — six-figure gap, worth every hour of negotiation.",
  likes: "215", comments: "29", shares: "18",
  comment: { name: "Dr Elena Vasquez", text: "That gap is exactly why I'm not accepting the broker's first number on mine.", likes: "19", time: "3d" }
});

const INNER_POST_15 = innerPost({
  id: "ch80", author: TIM, time: "4 Days Ago", chTime: "4d",
  hashtags: ["inner-circle", "mentorship"],
  body: "Mentorship cohort applications close Friday. Three seats left for Inner Circle only, message me directly.",
  likes: "184", comments: "35", shares: "11",
  comment: { name: "Ruth Adeyemi", text: "Just sent my application in, hoping one of those three seats is still open.", likes: "15", time: "3d" }
});

const INNER_POST_16 = innerPost({
  id: "ch81", author: LAYLA, time: "5 Days Ago", chTime: "4d", sample: { type: "video", poster: IMG.p1img1, duration: "20:40" },
  hashtags: ["inner-circle", "exit"],
  body: "Filmed my own exit story for the group — eighteen months from first conversation with the buyer to completion.",
  likes: "231", comments: "39", shares: "22",
  comment: { name: "Dr Naomi Reyes", text: "Eighteen months is realistic and refreshing to hear compared to the six-month stories people usually tell.", likes: "20", time: "4d" }
});

const INNER_POST_17 = innerPost({
  id: "ch82", author: BEN, time: "5 Days Ago", chTime: "5d",
  hashtags: ["inner-circle", "jointventure"],
  body: "Considering a joint venture on clinic five rather than going it alone this time. Anyone structured a JV with an existing owner-operator?",
  likes: "142", comments: "26", shares: "10",
  comment: { name: "James Whitfield", text: "Structured one last year — happy to talk through the equity split we landed on.", likes: "13", time: "4d" }
});

const INNER_POST_18 = innerPost({
  id: "ch83", author: ELENA, time: "6 Days Ago", chTime: "5d",
  hashtags: ["inner-circle", "legal"],
  body: "Legal review flagged a non-compete clause in the term sheet that would've blocked my next move entirely. Read every line twice.",
  likes: "176", comments: "22", shares: "15",
  comment: { name: "Dr Faisal Rahman", text: "This is why I now pay for a second legal opinion on every term sheet, no exceptions.", likes: "17", time: "5d" }
});

const INNER_POST_19 = innerPost({
  id: "ch84", author: JAMES, time: "6 Days Ago", chTime: "6d", media: [IMG.p5img7],
  hashtags: ["inner-circle", "integration"],
  body: "Slide from the roundtable deck on integration timelines — the 90-day plan Tim mentioned, sharing with the group as promised.",
  likes: "159", comments: "19", shares: "13",
  comment: { name: "Dr Tim Pearce", text: "Glad this is useful beyond the room — the 90-day plan is worth revisiting every acquisition.", likes: "16", time: "5d", avatar: "assets/avatar-drtim.png" }
});

const INNER_POST_20 = innerPost({
  id: "ch85", author: TIM, time: "1 Week Ago", chTime: "6d", sample: { type: "video", poster: IMG.p1img2, duration: "25:10" },
  hashtags: ["inner-circle", "roundtable"],
  body: "This quarter's Inner Circle roundtable replay — full session on acquisition integration and the mistakes that actually cost money.",
  likes: "267", comments: "46", shares: "28",
  comment: { name: "Dr Naomi Reyes", text: "The section on the mistakes that cost money was worth the whole quarter's membership alone.", likes: "25", time: "5d" }
});

const COURSE_POST = {
  id: "crs1", access: "gated", bucket: "course", course: "protox",
  author: { name: "Profinity", avatar: "assets/profinity-icon.jpg" },
  time: "Just now", hashtags: ["course", "protocol"],
  body: "New in your PROTOX course — Module 3: Advanced cannula control for the mid-face.",
  likes: "38", comments: "6", shares: "2", actioned: false, commentList: []
};

const COURSE_COMMENT = {
  id: "crs2", access: "gated", bucket: "coursecomment", course: "protox",
  author: { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" },
  time: "2 Hours Ago", hashtags: ["course", "discussion"],
  body: "This finally made cannula depth click for me — thank you!",
  likes: "22", comments: "3", shares: "0", actioned: false, commentList: []
};

/* Social-proof upsell: another buyer's real-sounding lesson comment paired
   with a lesson-promo strip, so it reads as course activity while also
   nudging viewers who haven't bought/finished the course toward it. */
const COURSE_COMMENT_2 = {
  id: "crs3", access: "gated", bucket: "coursecomment", course: "protox",
  author: { name: "Jeniffer R", avatar: "assets/avatar-miranda.jpg", seals: ["gb", "verified", "crown", "gold"] },
  time: "1 Hour Ago", hashtags: ["course", "discussion"],
  body: "This finally made cannula depth and layering click for me — I tried the tear trough, and the results are incredibly smooth. Looking forward to putting this into practice…",
  lesson: { title: "Full-Face Rejuvenation Protocol", sub: "PROTOX Course · Module 4 · Lesson 2", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp-aTNLPnPGrav4xz2d8LBFNdjcVNPNBU2S1D8UEFlCA&s" },
  likes: "31", comments: "5", shares: "0", actioned: false, commentList: []
};

const MYLEARNING_POST = {
  id: "ml1", access: "gated", bucket: "mylearning",
  author: { name: "You", avatar: ME.avatar },
  time: "Just now", hashtags: ["learning"],
  body: "You saved: “The 7-point liquid facelift, explained”.",
  likes: "0", comments: "0", shares: "0", actioned: false, commentList: []
};

const GENERAL_MARK_POST = {
  id: "gm1", access: "gated", bucket: "general", from: "mark",
  author: { name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", seals: ["skinfluencer"] },
  time: "6 Hours Ago", hashtags: ["community", "discussion"],
  body: "Anyone else get butterflies before a big case day? How do you settle the nerves?",
  likes: "56", comments: "14", shares: "1", actioned: false, commentList: []
};

const FOLLOWSAVE_AMIR_POST = {
  id: "fs1", access: "gated", bucket: "followsave", from: "amir",
  author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified", "skinfluencer"] },
  time: "4 Hours Ago", hashtags: ["learning", "community"],
  body: "saved “Managing vascular occlusion, step by step” to their learning.",
  likes: "9", comments: "0", shares: "0", actioned: false, commentList: []
};

/* The full pool of gated bucket content the preview panel routes between —
   order here is the order it appears once resolved into the feed. */
const BUCKET_POSTS = [
CHANNEL_POST, CONFIDENCE_POST_2, CONFIDENCE_POST_3, CONFIDENCE_POST_4, CONFIDENCE_POST_5,
CONFIDENCE_POST_6, CONFIDENCE_POST_7, CONFIDENCE_POST_8, CONFIDENCE_POST_9, CONFIDENCE_POST_10,
CONFIDENCE_POST_11, CONFIDENCE_POST_12, CONFIDENCE_POST_13, CONFIDENCE_POST_14, CONFIDENCE_POST_15,
CONFIDENCE_POST_16, CONFIDENCE_POST_17, CONFIDENCE_POST_18, CONFIDENCE_POST_19, CONFIDENCE_POST_20,
MASTERY_POST, MASTERY_POST_2, MASTERY_POST_3, MASTERY_POST_4, MASTERY_POST_5,
MASTERY_POST_6, MASTERY_POST_7, MASTERY_POST_8, MASTERY_POST_9, MASTERY_POST_10,
MASTERY_POST_11, MASTERY_POST_12, MASTERY_POST_13, MASTERY_POST_14, MASTERY_POST_15,
MASTERY_POST_16, MASTERY_POST_17, MASTERY_POST_18, MASTERY_POST_19, MASTERY_POST_20,
MASTERY_POST_21, MASTERY_POST_22, MASTERY_POST_23, MASTERY_POST_24, MASTERY_POST_25,
FREEDOM_POST, FREEDOM_POST_2, FREEDOM_POST_3, FREEDOM_POST_4, FREEDOM_POST_5,
FREEDOM_POST_6, FREEDOM_POST_7, FREEDOM_POST_8, FREEDOM_POST_9, FREEDOM_POST_10,
FREEDOM_POST_11, FREEDOM_POST_12, FREEDOM_POST_13, FREEDOM_POST_14, FREEDOM_POST_15,
FREEDOM_POST_16, FREEDOM_POST_17, FREEDOM_POST_18, FREEDOM_POST_19, FREEDOM_POST_20,
INNER_POST, INNER_POST_2, INNER_POST_3, INNER_POST_4, INNER_POST_5,
INNER_POST_6, INNER_POST_7, INNER_POST_8, INNER_POST_9, INNER_POST_10,
INNER_POST_11, INNER_POST_12, INNER_POST_13, INNER_POST_14, INNER_POST_15,
INNER_POST_16, INNER_POST_17, INNER_POST_18, INNER_POST_19, INNER_POST_20,
COURSE_POST, COURSE_COMMENT, COURSE_COMMENT_2, GENERAL_MARK_POST, FOLLOWSAVE_AMIR_POST, MYLEARNING_POST];


/* Bucket types a free viewer is shown as a locked teaser (see
   resolveBucketFeed) — every paid channel plus course discussion
   (coursecomment) reads as genuine activity worth upselling.
   followsave and a viewer's own saves (mylearning) are simply omitted —
   they don't make a useful upsell tease. */
const TEASABLE_BUCKETS = new Set(["confidence", "mastery", "freedom", "inner", "course", "coursecomment", "general"]);

/* Human label + accent used on a locked teaser's badge. */
const BUCKET_META = {
  confidence: { label: "Confidence", color: "var(--info)" },
  mastery: { label: "Mastery", color: "var(--level-intermediate)" },
  freedom: { label: "Freedom", color: "var(--ai-purple)" },
  inner: { label: "Inner Circle", color: "var(--premium-gold-deep)" },
  course: { label: "Course", color: "var(--success)" },
  coursecomment: { label: "Confidence", color: "var(--info)" },
  general: { label: "General", color: "var(--gray-500)" },
  followsave: { label: "Activity", color: "var(--gray-500)" },
  mylearning: { label: "My Learning", color: "var(--premium-orange)" }
};

/* Solid pill background per bucket for the locked-teaser header tag —
   distinct from BUCKET_META's border-accent color, used elsewhere. */
const TEASER_PILL = {
  confidence: "var(--brand-navy)",
  mastery: "var(--level-intermediate)",
  freedom: "var(--ai-purple)",
  inner: "var(--brand-navy-900)",
  course: "var(--success)",
  coursecomment: "var(--brand-navy)",
  general: "var(--gray-500)"
};

/* CTA copy on a locked teaser's upgrade button — course discussion only
   needs base membership to join in, so it upsells the entry Confidence
   tier rather than the course purchase itself. */
const TEASER_CTA = {
  confidence: { title: "Start Your Trial", sub: "Join the expert network" },
  mastery: { title: "Start Your Trial", sub: "Elite mentorship & networking" },
  freedom: { title: "Start Your Trial", sub: "The Freedom Path — for the injector ready to build a business, not just a skill set." },
  inner: { title: "Start Your Trial", sub: "Join the top-tier roundtable and mentorship" },
  course: { title: "Start Your Trial", sub: "Join the expert network" },
  coursecomment: { title: "Start Your Trial", sub: "Join the expert network" },
  general: { title: "Start Your Trial", sub: "Join the expert network" }
};

/* The channel ladder in order — each tier includes everything below it.
   Used by UpgradeModal to show a "your plan vs. this tier" comparison when
   the viewer already holds a paid tier lower than the one gating a post,
   instead of the generic first-time-paywall copy. */
const TIER_LADDER = [
{ key: "confidence", name: "Confidence", color: "var(--info)", perks: ["Expert network & community feed", "Confidence channel discussions"] },
{ key: "mastery", name: "Mastery", color: "var(--level-intermediate)", perks: ["Elite mentorship & networking", "Mastery channel discussions"] },
{ key: "freedom", name: "Freedom", color: "var(--ai-purple)", perks: ["Build a business, not just a skill set", "Freedom channel discussions"] },
{ key: "inner", name: "Inner Circle", color: "var(--premium-gold-deep)", perks: ["Top-tier roundtable & mentorship", "Inner Circle channel discussions"] }];


const TIER_LADDER_MAP = TIER_LADDER.reduce((m, t, i) => {m[t.key] = { ...t, rank: i };return m;}, {});

const COURSE_NAMES = { protox: "PROTOX" };

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

/* Persisted "who's actually subscribed" state — there's no real auth/billing
   backend, so every surface that needs to know the viewer's tier (newsfeed,
   community, profile, the membership/checkout/apply pages) reads and writes
   this same localStorage key. Pages that don't load app.jsx keep their own
   tiny copy of get/setUserTier pointed at the same key. */
const PF_TIER_KEY = "pf-subscription-tier";
function getUserTier() {
  try { return localStorage.getItem(PF_TIER_KEY) || "free"; } catch (e) { return "free"; }
}
function setUserTier(tier) {
  try { localStorage.setItem(PF_TIER_KEY, tier); } catch (e) {}
}
const TIER_DISPLAY_NAME = { confidence: "Confidence", mastery: "Mastery", freedom: "Freedom", inner: "Inner Circle" };
ME.tier = TIER_DISPLAY_NAME[getUserTier()] || null;

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
  const teasedBuckets = new Set();
  BUCKET_POSTS.forEach((x) => {
    switch (x.bucket) {
      case "confidence":case "mastery":case "freedom":case "inner":
        if (persona.admin || persona.channels.includes(x.bucket)) {
          out.push({ item: { ...x, unlockBadge: true }, mode: "full" });
        } else {
          // a locked channel only needs one teaser card in the newsfeed to
          // upsell it — showing every gated post as a separate blocker card
          // clutters the feed for viewers already partway up the ladder.
          if (teasedBuckets.has(x.bucket)) break;
          teasedBuckets.add(x.bucket);
          out.push({ item: x, mode: "teaser" });
        }
        break;
      case "course":case "coursecomment":
        if (persona.admin || persona.paid) out.push({ item: x, mode: "full" });
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


/* Events are stored with a UTC instant and rendered in the viewer's own
   timezone (via the browser's Intl locale) rather than a fixed GMT/ET pair. */
function formatEventLocalDateTime(utcISO) {
  const d = new Date(utcISO);
  return {
    date: d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short" })
  };
}

const EVENTS = [
{
  image: "assets/event-thumbnail-1.png",
  title: "Technique Tuesday", host: "Dr Tim Pearce",
  ...formatEventLocalDateTime("2026-03-17T20:00:00Z"), cta: "Join Now!", ctaVariant: "primary"
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


const CASE_TITLE = "Achieve a 64% boost in patient satisfaction with our Full-Face Rejuvenation Protocol.";
const CASE_BODY =
"Dr. Tim employed a unique method targeting the tear troughs, cheekbones, and jawline. He adhered to the 3-Step Confidence Framework within PROfinity, combining precise dermal filler placement with complementary skin-quality treatments for a fully balanced result.";

const REPLY_A = {
  author: { name: "Tokyo Jana", seals: ["gb"] },
  text: "This is an amazing protocol! It has helped us a lot in our research.",
  reactions: ["like"], reactionCount: "1.2K", time: "5d", pills: [{ k: "like", n: "3" }]
};

/* Cycles through RANDOM_AUTHOR_POOL for each thread()'s first commenter (see
   pickRandomAuthor above) so the ~50 case-study posts that share this thread
   don't all read as "Miranda P. commented on everything". Plain incrementing
   counter is safe here (not a per-post hash) because thread() only ever runs
   once, in file order, while the post arrays are built at module load. */
let threadAuthorIndex = 0;
function thread(extra) {
  const firstAuthor = RANDOM_AUTHOR_POOL[threadAuthorIndex % RANDOM_AUTHOR_POOL.length];
  threadAuthorIndex++;
  return [
  {
    author: firstAuthor,
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

/* Random photo pool for the Home newsfeed — every real content photo already
   in assets/ (excludes avatars, logos, badges, textures, which aren't post
   photos). Shuffled once per page load and handed out without repeats until
   the deck runs out, so consecutive posts never show the same image. Add a
   filename to this list any time a new photo lands in assets/. */
const POST_PHOTO_POOL = [
IMG.p1img1, IMG.p1img2, IMG.p1img3, IMG.p1img4,
IMG.p2img1, IMG.p2img2, IMG.p2img3,
IMG.p3img1, IMG.p3img2, IMG.p3img3,
IMG.p4img1, IMG.p4img2, IMG.p4img3,
IMG.p5img1, IMG.p5img2, IMG.p5img3, IMG.p5img4, IMG.p5img5,
IMG.p5img6, IMG.p5img7, IMG.p5img8, IMG.p5img9, IMG.p5img10,
IMG.toxin, IMG.collage, IMG.lip, IMG.communityPoster];


function shuffledDeck(pool) {
  const a = pool.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Hands out `count` images at a time from a shuffled deck, reshuffling once
   exhausted — call once per post so images stay stable while the post is on
   screen but vary post-to-post and reload-to-reload. */
function makeImagePicker(pool) {
  let deck = shuffledDeck(pool);
  return function pick(count) {
    if (deck.length < count) deck = shuffledDeck(pool);
    return deck.splice(0, count);
  };
}

const nextPostImages = makeImagePicker(POST_PHOTO_POOL);

/* Quiz/poll content pool — individual entries are referenced by index from
   FEED_SEQUENCE (see below) at their designed slots, rather than always
   leading the feed. */
const PINNED_POSTS = [
{
  id: "p_quiz", author: PROFINITY, time: "6h",
  body: "Knowledge check ✅ — test yourself before this week's masterclass. Tap an answer to see if you're right.",
  questionnaire: {
    question: "Which facial danger zone carries the highest risk of vascular occlusion during tear trough filler injection?",
    options: [
    { label: "Angular artery, medial canthus region", correct: true },
    { label: "Superficial temporal artery", correct: false },
    { label: "Facial artery, nasolabial fold", correct: false },
    { label: "Supratrochlear artery", correct: false }]

  },
  likes: "980", comments: "64", shares: "22", actioned: false,
  commentList: thread("Got it right first try — this danger zone comes up constantly in the masterclass Q&A!")
},
{
  id: "p8", author: PROFINITY, time: "1d",
  body: "Quick poll for the community — we're planning next month's masterclass and want to focus where you need it most. Cast your vote 👇",
  poll: {
    question: "Which area do you find most challenging to treat confidently?",
    options: [
    { label: "Lips", pct: 29 },
    { label: "Tear troughs", pct: 42 },
    { label: "Chin & jawline", pct: 17 },
    { label: "Temples", pct: 12 }],

    votes: 1400
  },
  likes: "1.4K", comments: "96", shares: "40", actioned: false,
  commentList: thread("Tear troughs, hands down — hoping this becomes the next masterclass!")
}];

const EDITORIAL_POSTS = [
{
  id: "p7", author: TIM, withOthers: "Miranda Pearce and 14 others", time: "5 Days Ago", keepAuthor: true,
  hashtags: ["case-study", "anatomy", "patient"],
  sample: { type: "gallery", images: nextPostImages(10) },
  body: "Full 10-step before-and-after series from a complete facial rejuvenation — swipe through every stage of the treatment plan.",
  likes: "5.6K", comments: "430", shares: "390", actioned: false,
  commentList: thread("This step-by-step series is gold — thank you for sharing all 10!")
},
{
  id: "p6", author: MIRANDA, time: "4 Days Ago",
  hashtags: ["reel"],
  sample: { type: "vertical", image: nextPostImages(1)[0] },
  body: "A 30-second walkthrough of a lip refinement — saving this format for sharing straight to socials.",
  likes: "2.1K", comments: "140", shares: "320", actioned: false,
  commentList: thread("Perfect for Reels — the crop looks great.")
},
{
  id: "p1", author: TIM, withOthers: "Miranda Pearce and 14 others", time: "1 Week Ago",
  hashtags: ["case-study", "patient", "business", "clinic", "profinity", "healthcare"],
  title: CASE_TITLE,
  media: [IMG.caseP1Img1, IMG.p1img1, IMG.p1img2, IMG.p1img3],
  body: CASE_BODY, likes: "1.2K", comments: "150", shares: "150", actioned: true,
  commentList: thread()
},
{
  id: "p2", author: TIM, withOthers: "Miranda Pearce and 14 others", time: "1 Week Ago",
  hashtags: ["protocol", "business", "clinic"],
  media: nextPostImages(3),
  body: "This protocol shows the exact steps for safely correcting migrated or uneven lip filler using a structured, repeatable framework you can apply chairside.",
  likes: "1.2K", comments: "150", shares: "150", actioned: true,
  commentList: thread("This is exactly what I was looking for. Thank you!")
},
{
  id: "p3", author: MIRANDA, withOthers: "Dr Tim Pearce", time: "2 Weeks Ago",
  hashtags: ["discussion", "business"],
  media: nextPostImages(3),
  body: "Growing your clinic revenue doesn't require discounts. Here are 5 strategies top clinicians use to build a premium, referral-led practice.",
  likes: "1.2K", comments: "150", shares: "150", actioned: false,
  commentList: thread("So easy to follow — even on a busy clinic day!")
},
{
  id: "p4", author: MIRANDA, time: "2 Weeks Ago",
  hashtags: ["community", "confidence"],
  media: nextPostImages(3),
  body: "I've been terrified for months, but after studying the Toxin Confidence Pathway, I finally did it! Thank you everyone for your support — this community keeps me moving.",
  likes: "1.2K", comments: "150", shares: "150", actioned: false,
  commentList: thread("So proud of you — the leap is always the hardest part!")
},
{
  id: "p5", author: TIM, time: "3 Days Ago",
  hashtags: ["masterclass", "anatomy"],
  sample: { type: "video", poster: IMG.chinPositions, aspect: "square", duration: "12:40" },
  body: "Watch the full walkthrough of the Golden Ratio full-face assessment — every landmark, every measurement, explained step by step.",
  likes: "3.4K", comments: "210", shares: "180", actioned: false,
  commentList: thread("Watched it twice already — incredibly clear teaching.")
}];

/* Ten extra knowledge-check quizzes — a content pool FEED_SEQUENCE pulls
   specific entries from by index for its quiz slots. */
const QUIZ_POSTS = [
{
  id: "p_quiz2", author: PROFINITY, time: "9h",
  body: "Knowledge check ✅ — quick one on nerve anatomy. Tap an answer to see if you're right.",
  questionnaire: {
    question: "Which nerve exits at the mental foramen and must be avoided when injecting the chin and jawline?",
    options: [
    { label: "Mental nerve", correct: true },
    { label: "Marginal mandibular nerve", correct: false },
    { label: "Buccal nerve", correct: false },
    { label: "Zygomatic nerve", correct: false }]

  },
  likes: "742", comments: "51", shares: "18", actioned: false,
  commentList: thread("Mixed up the mental and marginal mandibular nerves for years — this one's a great reminder!")
},
{
  id: "p_quiz3", author: PROFINITY, time: "14h",
  body: "Knowledge check ✅ — safety first. Tap an answer to see if you're right.",
  questionnaire: {
    question: "What is the recommended first step if you suspect a vascular occlusion during filler injection?",
    options: [
    { label: "Stop injecting immediately and assess", correct: true },
    { label: "Massage the area vigorously", correct: false },
    { label: "Apply ice only and continue", correct: false },
    { label: "Wait 24 hours to see if it resolves", correct: false }]

  },
  likes: "1.1K", comments: "88", shares: "34", actioned: false,
  commentList: thread("This is drilled into us every masterclass and it still saves lives — stop first, always.")
},
{
  id: "p_quiz4", author: PROFINITY, time: "1d",
  body: "Knowledge check ✅ — toxin mechanism basics. Tap an answer to see if you're right.",
  questionnaire: {
    question: "Botulinum toxin type A works by blocking release of which neurotransmitter at the neuromuscular junction?",
    options: [
    { label: "Acetylcholine", correct: true },
    { label: "Dopamine", correct: false },
    { label: "Serotonin", correct: false },
    { label: "GABA", correct: false }]

  },
  likes: "890", comments: "42", shares: "15", actioned: false,
  commentList: thread("Good refresher — the mechanism question always comes up in patient consults too.")
},
{
  id: "p_quiz5", author: PROFINITY, time: "2d",
  body: "Knowledge check ✅ — cannula technique. Tap an answer to see if you're right.",
  questionnaire: {
    question: "Which layer should a cannula typically stay within to minimize risk when treating the tear trough?",
    options: [
    { label: "Supraperiosteal plane", correct: true },
    { label: "Intradermal layer", correct: false },
    { label: "Subdermal fat only", correct: false },
    { label: "Intramuscular plane", correct: false }]

  },
  likes: "1.3K", comments: "76", shares: "29", actioned: false,
  commentList: thread("Staying supraperiosteal changed my tear trough results overnight.")
},
{
  id: "p_quiz6", author: PROFINITY, time: "2d",
  body: "Knowledge check ✅ — full-face planning. Tap an answer to see if you're right.",
  questionnaire: {
    question: "In the “liquid facelift” concept, which combination of areas is most commonly addressed?",
    options: [
    { label: "Cheek, jawline, chin and temples", correct: true },
    { label: "Only the lips", correct: false },
    { label: "Only the forehead", correct: false },
    { label: "Only under-eye", correct: false }]

  },
  likes: "965", comments: "58", shares: "21", actioned: false,
  commentList: thread("Treating all four together is what actually gives that natural lift.")
},
{
  id: "p_quiz7", author: PROFINITY, time: "3d",
  body: "Knowledge check ✅ — patient expectations. Tap an answer to see if you're right.",
  questionnaire: {
    question: "What is the typical onset time for a visible botulinum toxin effect?",
    options: [
    { label: "3–14 days", correct: true },
    { label: "Immediately", correct: false },
    { label: "6 months", correct: false },
    { label: "24 hours guaranteed", correct: false }]

  },
  likes: "1.5K", comments: "94", shares: "37", actioned: false,
  commentList: thread("Setting this expectation upfront saves so many anxious follow-up messages!")
},
{
  id: "p_quiz8", author: PROFINITY, time: "3d",
  body: "Knowledge check ✅ — temple danger zones. Tap an answer to see if you're right.",
  questionnaire: {
    question: "Which structure is the key danger zone when injecting the temporal region?",
    options: [
    { label: "Superficial temporal artery / frontal branch of facial nerve", correct: true },
    { label: "Angular artery", correct: false },
    { label: "Supratrochlear artery", correct: false },
    { label: "Facial vein only", correct: false }]

  },
  likes: "812", comments: "47", shares: "16", actioned: false,
  commentList: thread("The temple is so underestimated as a danger zone — great question.")
},
{
  id: "p_quiz9", author: PROFINITY, time: "4d",
  body: "Knowledge check ✅ — reversal agents. Tap an answer to see if you're right.",
  questionnaire: {
    question: "Hyaluronidase is used to?",
    options: [
    { label: "Dissolve hyaluronic acid filler", correct: true },
    { label: "Numb the skin", correct: false },
    { label: "Reverse botulinum toxin", correct: false },
    { label: "Increase filler longevity", correct: false }]

  },
  likes: "1.2K", comments: "70", shares: "25", actioned: false,
  commentList: thread("Every clinic should keep this stocked and know the dosing cold.")
},
{
  id: "p_quiz10", author: PROFINITY, time: "5d",
  body: "Knowledge check ✅ — contraindications. Tap an answer to see if you're right.",
  questionnaire: {
    question: "Which patient factor is a contraindication to elective filler treatment on the day?",
    options: [
    { label: "Active infection at the injection site", correct: true },
    { label: "Being over 40", correct: false },
    { label: "Having had filler before", correct: false },
    { label: "Mild seasonal allergies", correct: false }]

  },
  likes: "930", comments: "53", shares: "19", actioned: false,
  commentList: thread("Always reschedule for active infection — not worth the risk.")
},
{
  id: "p_quiz11", author: PROFINITY, time: "6d",
  body: "Knowledge check ✅ — lip anatomy. Tap an answer to see if you're right.",
  questionnaire: {
    question: "For lip filler, which vessel is the primary danger zone clinicians must map before injecting?",
    options: [
    { label: "Labial artery", correct: true },
    { label: "Facial vein", correct: false },
    { label: "Superficial temporal artery", correct: false },
    { label: "Supratrochlear artery", correct: false }]

  },
  likes: "1.4K", comments: "81", shares: "30", actioned: false,
  commentList: thread("Mapping the labial artery chairside before every lip case, no exceptions.")
}];

/* ---- Free-newsfeed fixed sequence: net-new post-type demos ---- */
const TEXT_POST_1 = {
  id: "ff_text1", author: PROFINITY, time: "2h",
  hashtags: ["community", "discussion"],
  body: "What's one thing you wish someone had told you in your first year of injecting? Drop it below — the newest members in this community will thank you.",
  likes: "612", comments: "88", shares: "14", actioned: false,
  commentList: thread("Go slower than you think you need to — every single time.")
};

const SQUARE_IMG_POST_1 = {
  id: "ff_sqimg1", author: TIM, time: "3h",
  hashtags: ["clinic", "protocol"],
  media: [IMG.ffSqImg1Swap], aspect: "square",
  body: "Our toxin dosing reference, laid out the way we actually use it chairside — save this one.",
  likes: "740", comments: "52", shares: "38", actioned: false,
  commentList: thread("Printed this for the treatment room already — thank you!")
};

/* Sample long-form text post — body runs well past the old 3-line clamp so
   the "See more" toggle and the new 5-line default are easy to sanity-check
   against a real post in the feed. */
const SAMPLE_LONG_TEXT_POST = {
  id: "ff_longtext1", author: TIM, time: "45m",
  hashtags: ["technique", "mindset"],
  body: "Something I tell every injector I mentor: the technique is only half the job. The other half is reading the room — knowing when a patient needs more numbing time, when they need you to slow down and explain each step out loud, and when they just need you to be quietly confident so they can relax. I still remember my first year, second-guessing every entry point even when the anatomy was textbook-perfect, because I hadn't yet learned to trust the plan I'd already made in consult. That trust only comes from reps, and from being honest with yourself about the cases that didn't go the way you wanted. Save this one if you're still building that muscle — it gets easier, but only if you let the hard cases teach you something instead of just moving on.",
  likes: "301", comments: "27", shares: "11", actioned: false,
  commentList: thread("This is exactly the reminder I needed before my clinic day tomorrow.")
};

const PORTRAIT_IMG_POST_1 = {
  id: "ff_ptimg1", author: MIRANDA, time: "5h",
  hashtags: ["patient", "case-study"],
  media: [IMG.lip], aspect: "portrait",
  body: "Lip design case, full-face portrait crop — proportion first, volume second.",
  likes: "890", comments: "61", shares: "45", actioned: false,
  commentList: thread("The proportion-first approach is exactly why this looks so natural.")
};

const MASTERCLASS_UNLOCK_POST = {
  id: "ff_mc1", author: TIM, time: "1d",
  hashtags: ["masterclass"],
  sample: { type: "video", poster: IMG.chinPositions, duration: "24:10" },
  unlockBadge: true,
  body: "Free Technique Tuesday unlock — this month's live masterclass, open to every member for a limited time. Watch the full replay before it's gated again.",
  likes: "2.3K", comments: "184", shares: "260", actioned: false,
  commentList: thread("Grateful this one's open to everyone — shared it with my whole team.")
};

const TEXT_POST_2 = {
  id: "ff_text2", author: PROFINITY, time: "1d",
  hashtags: ["community", "mindset"],
  body: "Real talk: what's the last case that made you nervous, and how did you talk yourself through it? This community exists so nobody has to figure that out alone.",
  likes: "534", comments: "73", shares: "9", actioned: false,
  commentList: thread("Every case still gets my heart rate up a little — good to know it's not just me.")
};

const SQUARE_IMG_POST_2 = {
  id: "ff_sqimg2", author: TIM, time: "6h",
  hashtags: ["clinic", "protocol"],
  media: [IMG.p4img3Followup], aspect: "square",
  body: "Full treatment-day collage from the clinic — every station, one glance.",
  likes: "455", comments: "31", shares: "20", actioned: false,
  commentList: thread("Love seeing the whole day laid out like this.")
};

const PORTRAIT_IMG_POST_2 = {
  id: "ff_ptimg2", author: MIRANDA, time: "9h",
  hashtags: ["patient", "case-study"],
  media: [IMG.p4img3Followup2], aspect: "portrait",
  body: "Full-face portrait follow-up, six weeks post-treatment — settled and natural.",
  likes: "702", comments: "48", shares: "33", actioned: false,
  commentList: thread("Six weeks out and it still looks this natural — great result.")
};

const SQUARE_VIDEO_POST_2 = {
  id: "ff_sqvid2", author: TIM, time: "8h",
  hashtags: ["masterclass", "technique"],
  sample: { type: "video", poster: IMG.p3img2, aspect: "square", duration: "9:45" },
  body: "Quick chairside demo — marking the danger zone before a single needle goes in.",
  likes: "980", comments: "64", shares: "51", actioned: false,
  commentList: thread("Marking it out loud like this should be standard practice.")
};

const PORTRAIT_VIDEO_POST_2 = {
  id: "ff_ptvid2", author: MIRANDA, time: "10h",
  hashtags: ["reel"],
  sample: { type: "vertical", image: IMG.p2img3 },
  body: "60 seconds on why we always numb before we measure, not after.",
  likes: "1.3K", comments: "97", shares: "210", actioned: false,
  commentList: thread("Never thought about the order until this reel.")
};

const POLL_POST_2 = {
  id: "ff_poll2", author: PROFINITY, time: "1d",
  body: "Another quick poll — help us pick the next Technique Tuesday topic 👇",
  poll: {
    question: "Which topic should we cover at the next Technique Tuesday?",
    options: [
    { label: "Vascular occlusion management", pct: 38 },
    { label: "Full-face liquid facelift planning", pct: 27 },
    { label: "Cannula vs needle decision tree", pct: 22 },
    { label: "Building patient confidence pre-treatment", pct: 13 }],

    votes: 960
  },
  likes: "1.1K", comments: "70", shares: "26", actioned: false,
  commentList: thread("Vascular occlusion, please — always worth another deep dive.")
};

/* Cycle 3 — same post-type shape as cycle 2. */
const TEXT_POST_3 = {
  id: "ff_text3", author: PROFINITY, time: "4h",
  hashtags: ["community", "questions"],
  body: "If you could only keep one piece of equipment in your treatment room, what would it be and why? Curious what the veterans in here can't work without.",
  likes: "480", comments: "66", shares: "11", actioned: false,
  commentList: thread("My loupes, without question — everything else I could improvise around.")
};

const SQUARE_IMG_POST_3 = {
  id: "ff_sqimg3", author: TIM, time: "7h",
  hashtags: ["clinic", "reference"],
  media: [IMG.p3img3], aspect: "square",
  body: "Filler viscosity reference chart, printed and laminated for the treatment room — the one resource I wish I'd had in year one.",
  likes: "612", comments: "40", shares: "29", actioned: false,
  commentList: thread("Laminating mine tonight, thank you for sharing this.")
};

const PORTRAIT_IMG_POST_3 = {
  id: "ff_ptimg3", author: MIRANDA, time: "10h",
  hashtags: ["patient", "case-study"],
  media: [IMG.collage], aspect: "portrait",
  body: "Full treatment-day portrait recap — consult, plan, and result in one frame.",
  likes: "705", comments: "55", shares: "38", actioned: false,
  commentList: thread("Love seeing the whole journey in a single portrait like this.")
};

const SQUARE_VIDEO_POST_3 = {
  id: "ff_sqvid3", author: TIM, time: "9h",
  hashtags: ["masterclass", "technique"],
  sample: { type: "video", poster: IMG.p1img1, aspect: "square", duration: "7:30" },
  body: "Short demo on vector planning before the first needle goes in — plan the shape, then inject it.",
  likes: "860", comments: "58", shares: "44", actioned: false,
  commentList: thread("Planning the vectors out loud is such an underrated habit.")
};

const PORTRAIT_VIDEO_POST_3 = {
  id: "ff_ptvid3", author: MIRANDA, time: "11h",
  hashtags: ["reel"],
  sample: { type: "vertical", image: IMG.p4img1 },
  body: "45 seconds on the one consult question that changes how every patient hears their treatment plan.",
  likes: "1.1K", comments: "81", shares: "175", actioned: false,
  commentList: thread("Stealing this question for every consult from now on.")
};

const POLL_POST_3 = {
  id: "ff_poll3", author: PROFINITY, time: "1d",
  body: "Another quick poll for the group — what should the next free Technique Tuesday actually focus on? 👇",
  poll: {
    question: "Which format do you want more of at Technique Tuesday?",
    options: [
    { label: "Live Q&A", pct: 34 },
    { label: "Full case walkthroughs", pct: 31 },
    { label: "Quick technique demos", pct: 24 },
    { label: "Guest specialist sessions", pct: 11 }],

    votes: 1120
  },
  likes: "980", comments: "61", shares: "22", actioned: false,
  commentList: thread("Guest specialist sessions, please — would love an outside perspective.")
};

/* Cycle 4 — same shape again. */
const TEXT_POST_4 = {
  id: "ff_text4", author: PROFINITY, time: "5h",
  hashtags: ["community", "reflection"],
  body: "One year from now, what do you want to be able to say about your practice that you can't say today? Would love to read a few answers below.",
  likes: "398", comments: "52", shares: "7", actioned: false,
  commentList: thread("That I stopped second-guessing every consult before I even walk in.")
};

const SQUARE_IMG_POST_4 = {
  id: "ff_sqimg4", author: TIM, time: "6h",
  hashtags: ["clinic", "protocol"],
  media: [IMG.p2img2], aspect: "square",
  body: "Updated masseter dosing infographic — printed this for the treatment room, saves re-explaining the split every time.",
  likes: "540", comments: "36", shares: "25", actioned: false,
  commentList: thread("Printing this for my room too, thank you!")
};

const PORTRAIT_IMG_POST_4 = {
  id: "ff_ptimg4", author: MIRANDA, time: "8h",
  hashtags: ["patient", "case-study"],
  media: [IMG.chinPositions], aspect: "portrait",
  body: "Chin and profile balancing, full-face portrait — small volume, big shift in the overall proportions.",
  likes: "622", comments: "41", shares: "30", actioned: false,
  commentList: thread("The profile change here is so subtle and so effective.")
};

const SQUARE_VIDEO_POST_4 = {
  id: "ff_sqvid4", author: TIM, time: "7h",
  hashtags: ["masterclass", "safety"],
  sample: { type: "video", poster: IMG.p5img5, aspect: "square", duration: "11:05" },
  body: "Recognising the early signs of a vascular event, chairside — the exact order I work through before reaching for hyaluronidase.",
  likes: "1.2K", comments: "92", shares: "70", actioned: false,
  commentList: thread("Every injector should watch this before their next case.")
};

const PORTRAIT_VIDEO_POST_4 = {
  id: "ff_ptvid4", author: MIRANDA, time: "9h",
  hashtags: ["reel"],
  sample: { type: "vertical", image: IMG.p5img8 },
  body: "60 seconds on why I always photograph in the same three angles, every single patient, no exceptions.",
  likes: "980", comments: "70", shares: "160", actioned: false,
  commentList: thread("Consistent angles make before/afters so much more convincing — great tip.")
};

const POLL_POST_4 = {
  id: "ff_poll4", author: PROFINITY, time: "2d",
  body: "Last poll of the batch — help us decide what to record next for the free vault 👇",
  poll: {
    question: "Which recorded session would help you most right now?",
    options: [
    { label: "Complication management deep dive", pct: 36 },
    { label: "Consult scripting for nervous patients", pct: 26 },
    { label: "Advanced cannula technique", pct: 23 },
    { label: "Pricing & business systems", pct: 15 }],

    votes: 890
  },
  likes: "870", comments: "49", shares: "18", actioned: false,
  commentList: thread("Complication management, always — can't get enough safety content.")
};

/* Ten extra video posts appended to the end of the sequence for a deeper
   library to scroll through — reads as "every video uploaded to Profinity"
   rather than just the handful seeded per cycle above. */
const EXTRA_VIDEO_POST_1 = {
  id: "ff_vidmore1", author: TIM, time: "12h",
  hashtags: ["masterclass", "technique"],
  sample: { type: "video", poster: IMG.p1img3, duration: "14:20" },
  body: "Full breakdown of the mid-face assessment I run before any filler goes near the cheeks — landmarks first, product second.",
  likes: "1.6K", comments: "112", shares: "88", actioned: false,
  commentList: thread("The landmark walkthrough alone was worth the watch.")
};

const EXTRA_VIDEO_POST_2 = {
  id: "ff_vidmore2", author: MIRANDA, time: "14h",
  hashtags: ["reel"],
  sample: { type: "vertical", image: IMG.p1img4 },
  body: "30 seconds on the one thing I check before every toxin consult — most people skip it.",
  likes: "990", comments: "76", shares: "205", actioned: false,
  commentList: thread("Never skipping this step again after watching.")
};

const EXTRA_VIDEO_POST_3 = {
  id: "ff_vidmore3", author: TIM, time: "16h",
  hashtags: ["clinic", "safety"],
  sample: { type: "video", poster: IMG.p3img1, aspect: "square", duration: "10:05" },
  body: "Chairside walkthrough of the aspiration technique I use across every high-risk zone — slow, deliberate, no shortcuts.",
  likes: "1.3K", comments: "94", shares: "60", actioned: false,
  commentList: thread("Slow and deliberate — exactly the reminder I needed.")
};

const EXTRA_VIDEO_POST_4 = {
  id: "ff_vidmore4", author: MIRANDA, time: "18h",
  hashtags: ["patient", "case-study"],
  sample: { type: "video", poster: IMG.p4img2, duration: "8:50" },
  body: "Full consult-to-result video for a jawline contouring case — every question the patient asked, answered on camera.",
  likes: "1.1K", comments: "68", shares: "42", actioned: false,
  commentList: thread("Filming the actual consult questions is such a great idea.")
};

const EXTRA_VIDEO_POST_5 = {
  id: "ff_vidmore5", author: TIM, time: "20h",
  hashtags: ["masterclass", "anatomy"],
  sample: { type: "vertical", image: IMG.p5img2 },
  body: "60 seconds on why the temple should almost never be your first treatment area.",
  likes: "1.4K", comments: "101", shares: "230", actioned: false,
  commentList: thread("Wish someone told me this before my first temple case.")
};

const EXTRA_VIDEO_POST_6 = {
  id: "ff_vidmore6", author: MIRANDA, time: "22h",
  hashtags: ["clinic", "protocol"],
  sample: { type: "video", poster: IMG.p5img3, aspect: "square", duration: "13:15" },
  body: "Full run-through of our aftercare consult script — word for word, so nothing gets missed at checkout.",
  likes: "870", comments: "55", shares: "34", actioned: false,
  commentList: thread("Stealing this script for my own aftercare calls.")
};

const EXTRA_VIDEO_POST_7 = {
  id: "ff_vidmore7", author: TIM, time: "1d",
  hashtags: ["masterclass", "technique"],
  sample: { type: "video", poster: IMG.p5img4, duration: "17:40" },
  body: "Complete cannula entry-point selection guide — where I go in, why, and what changes the decision.",
  likes: "1.5K", comments: "128", shares: "96", actioned: false,
  commentList: thread("The entry-point decision tree finally makes sense to me.")
};

const EXTRA_VIDEO_POST_8 = {
  id: "ff_vidmore8", author: MIRANDA, time: "1d",
  hashtags: ["reel"],
  sample: { type: "vertical", image: IMG.p5img6 },
  body: "45 seconds on the after-photo mistake almost every new injector makes.",
  likes: "1.0K", comments: "82", shares: "190", actioned: false,
  commentList: thread("Guilty of this exact mistake — fixing it today.")
};

const EXTRA_VIDEO_POST_9 = {
  id: "ff_vidmore9", author: TIM, time: "1d",
  hashtags: ["clinic", "business"],
  sample: { type: "video", poster: IMG.p5img7, aspect: "square", duration: "9:30" },
  body: "How we structure the first-visit consult so every new patient leaves confident, not overwhelmed.",
  likes: "960", comments: "61", shares: "48", actioned: false,
  commentList: thread("This structure would've saved me so many awkward first visits.")
};

const EXTRA_VIDEO_POST_10 = {
  id: "ff_vidmore10", author: MIRANDA, time: "2d",
  hashtags: ["masterclass", "safety"],
  sample: { type: "video", poster: IMG.communityPoster, duration: "20:15" },
  body: "Full replay of our vascular occlusion emergency drill — the exact steps our whole team now runs on repeat.",
  likes: "1.8K", comments: "142", shares: "115", actioned: false,
  commentList: thread("Every clinic should be running this drill regularly.")
};

/* Tier-aware newsfeed sequences — every subscription tier (Free/Confidence/
   Mastery) walks the same designed post-format order (text, square image,
   vertical image, 5-image carousel, square video, event-registration,
   reel/vertical video, poll, quiz, paywall lock), but a paid tier blends in
   extra posts "sourced" from its own tier on top of everything the tier
   below it sees, and the sequence runs twice — once teasing the next tier
   up, once (repeat) teasing the tier after that. See cycleSlots() below. */
function cycleSlots({ text, sqImg, vertImg, carousel, sqVideo, event, reel, poll, quiz, lock }) {
  return [text, ...sqImg, ...vertImg, ...carousel, ...sqVideo, event, ...reel, poll, quiz, lock];
}

/* Gives a repeated-cycle post a distinct id from its first appearance, so two
   cycles that deliberately reuse the same tier-sourced content (see below)
   never collide on React key / interaction-state lookup. */
function reid(post, suffix) {
  return { ...post, id: post.id + suffix };
}
function reidAll(posts, suffix) {
  return posts.map((p) => reid(p, suffix));
}

/* ---- Free-tier pool: 5-image carousels + event-registration posts ---- */
const FREE_CAROUSEL5_1 = {
  id: "ff_car5_1", author: TIM, withOthers: "Miranda Pearce and 9 others", time: "6h",
  hashtags: ["case-study", "patient"],
  sample: { type: "gallery", images: masteryGallery(0) },
  body: "Five-stage before-and-after set from this week's full-face consult — swipe through the whole plan.",
  likes: "1.3K", comments: "112", shares: "84", actioned: false,
  commentList: thread("Swiped through all five — the progression is so clear.")
};
const FREE_CAROUSEL5_2 = {
  id: "ff_car5_2", author: MIRANDA, time: "8h",
  hashtags: ["clinic", "patient"],
  sample: { type: "gallery", images: masteryGallery(5) },
  body: "Five angles from today's jawline contouring case — same lighting, same distance, easiest way to judge a result honestly.",
  likes: "1.1K", comments: "94", shares: "70", actioned: false,
  commentList: thread("Same lighting and distance every time is such an underrated habit.")
};
const FREE_EVENTREG_1 = {
  id: "ff_evreg1", author: { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] }, time: "4h",
  eventReg: { title: EVENTS[0].title, date: EVENTS[0].date, time: EVENTS[0].time, going: "318" }
};
const FREE_EVENTREG_2 = {
  id: "ff_evreg2", author: { name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", seals: ["skinfluencer"] }, time: "9h",
  eventReg: { title: EVENTS[0].title, date: EVENTS[0].date, time: EVENTS[0].time, going: "276" }
};

/* ---- Confidence-tier pool — blended into every Confidence+ viewer's feed
   on top of the Free pool above ---- */
const CONFIDENCE_SQIMG_1 = {
  id: "cf_sqimg1", author: { name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", seals: ["gb", "verified", "skinfluencer"] }, time: "5h",
  hashtags: ["confidence", "protocol"],
  media: [IMG.p2img1], aspect: "square",
  body: "Confidence-channel favourite: my go-to consult checklist, laminated and taped inside every treatment room drawer.",
  likes: "410", comments: "36", shares: "18", actioned: false,
  commentList: thread("Taping mine up today — thank you for sharing this!")
};
const CONFIDENCE_SQIMG_2 = {
  id: "cf_sqimg2", author: { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] }, time: "7h",
  hashtags: ["confidence", "clinic"],
  media: [IMG.p3img2], aspect: "square",
  body: "Before/after photo setup, exactly as we shoot it — same stool height, same distance marker taped to the floor.",
  likes: "365", comments: "29", shares: "14", actioned: false,
  commentList: thread("The floor marker trick is so simple and I never thought of it.")
};
const CONFIDENCE_SQIMG_3 = {
  id: "cf_sqimg3", author: { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" }, time: "10h",
  hashtags: ["confidence", "reference"],
  media: [IMG.p4img1], aspect: "square",
  body: "Aftercare card we hand every patient at checkout — cut the follow-up questions in half since we started this.",
  likes: "298", comments: "24", shares: "20", actioned: false,
  commentList: thread("Making a version of this for our own front desk.")
};
const CONFIDENCE_VERTIMG_1 = {
  id: "cf_vertimg1", author: { name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", seals: ["skinfluencer"] }, time: "8h",
  hashtags: ["confidence", "case-study"],
  media: [IMG.p2img2], aspect: "portrait",
  body: "First solo cheek case since finishing the Confidence pathway — nerves the whole way through, worth every second.",
  likes: "520", comments: "42", shares: "26", actioned: false,
  commentList: thread("The nerves never fully go away, but it gets easier — great work.")
};
const CONFIDENCE_CAROUSEL5_1 = {
  id: "cf_car5_1", author: { name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", seals: ["gb", "verified", "skinfluencer"] }, time: "6h",
  hashtags: ["confidence", "case-study"],
  sample: { type: "gallery", images: masteryGallery(10) },
  body: "Five-frame consult-to-result set from a first-time toxin patient — talked through every step on camera for the Confidence channel.",
  likes: "480", comments: "38", shares: "22", actioned: false,
  commentList: thread("Talking it through on camera like this is so reassuring to watch.")
};
const CONFIDENCE_CAROUSEL5_2 = {
  id: "cf_car5_2", author: { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] }, time: "9h",
  hashtags: ["confidence", "patient"],
  sample: { type: "gallery", images: masteryGallery(15) },
  body: "Five-stage lip case, shot the exact way we teach in the Confidence pathway — proportion first, volume second, every time.",
  likes: "455", comments: "33", shares: "19", actioned: false,
  commentList: thread("Proportion-first is the one lesson that changed my results the most.")
};
const CONFIDENCE_SQVIDEO_1 = {
  id: "cf_sqvid1", author: { name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg" }, time: "7h",
  hashtags: ["confidence", "technique"],
  sample: { type: "video", poster: IMG.p2img3, aspect: "square", duration: "6:20" },
  body: "Chairside walkthrough of my consent conversation, word for word — shared for anyone still nervous about that part.",
  likes: "310", comments: "27", shares: "16", actioned: false,
  commentList: thread("The wording here is exactly what I've been missing.")
};
const CONFIDENCE_REEL_1 = {
  id: "cf_reel1", author: { name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", seals: ["skinfluencer"] }, time: "11h",
  hashtags: ["confidence", "reel"],
  sample: { type: "vertical", image: IMG.p3img3 },
  body: "30 seconds on the one line I say to every nervous first-time patient before we even sit down.",
  likes: "640", comments: "48", shares: "95", actioned: false,
  commentList: thread("Using this exact line in my consult room from tomorrow.")
};

/* ---- Mastery-tier pool — blended in on top of Free + Confidence for any
   Mastery+ viewer ---- */
const MASTERY_SQIMG_1 = {
  id: "ms_sqimg1", author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] }, time: "5h",
  hashtags: ["mastery", "protocol"],
  media: [IMG.p4img2], aspect: "square",
  body: "Masseter dosing chart split by facial width and bite strength — the version I actually use chairside, not the textbook one.",
  likes: "520", comments: "44", shares: "30", actioned: false,
  commentList: thread("This split is so much more useful than a flat dose chart.")
};
const MASTERY_SQIMG_2 = {
  id: "ms_sqimg2", author: { name: "Dr Owen Clarke" }, time: "9h",
  hashtags: ["mastery", "anatomy"],
  media: [IMG.p1img2], aspect: "square",
  body: "Danger-zone reference from this week's cadaver lab — the temporal artery sits closer to the brow than most training shows.",
  likes: "470", comments: "39", shares: "51", actioned: false,
  commentList: thread("Printing this straight after the cadaver lab notes, thank you.")
};
const MASTERY_VERTIMG_1 = {
  id: "ms_vertimg1", author: { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] }, time: "6h",
  hashtags: ["mastery", "case-study"],
  media: [IMG.p1img3], aspect: "portrait",
  body: "Full-face structure-volume-finesse sequence on a complex revision case — three passes, three very different products.",
  likes: "610", comments: "52", shares: "40", actioned: false,
  commentList: thread("The three-pass structure is exactly how I plan revisions now too.")
};
const MASTERY_VERTIMG_2 = {
  id: "ms_vertimg2", author: { name: "Jade Osei" }, time: "10h",
  hashtags: ["mastery", "technique"],
  media: [IMG.p3img1], aspect: "portrait",
  body: "Cannula entry-point mapped out on a real patient, full-face portrait crop — every mark explained in the caption.",
  likes: "455", comments: "35", shares: "28", actioned: false,
  commentList: thread("Mapping it out like this on a real face makes it click instantly.")
};
const MASTERY_CAROUSEL5_1 = {
  id: "ms_car5_1", author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] }, time: "7h",
  hashtags: ["mastery", "masterclass"],
  sample: { type: "gallery", images: masteryGallery(20) },
  body: "Five-frame full-face rebuild, structure to finesse — the sequencing logic from this month's Mastery masterclass, applied start to finish.",
  likes: "540", comments: "46", shares: "35", actioned: false,
  commentList: thread("Seeing the sequencing applied end to end just reorganised my whole plan.")
};
const MASTERY_CAROUSEL5_2 = {
  id: "ms_car5_2", author: { name: "Dr Owen Clarke" }, time: "12h",
  hashtags: ["mastery", "anatomy"],
  sample: { type: "gallery", images: masteryGallery(2) },
  body: "Five-angle vascular danger-zone map from this week's cadaver lab, printed for the treatment room wall.",
  likes: "495", comments: "41", shares: "44", actioned: false,
  commentList: thread("Printing this whole set for our team — invaluable reference.")
};
const MASTERY_CAROUSEL5_3 = {
  id: "ms_car5_3", author: { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] }, time: "13h",
  hashtags: ["mastery", "case-study"],
  sample: { type: "gallery", images: masteryGallery(7) },
  body: "Five-stage jawline revision — correcting a migrated filler case a colleague sent over, full technique breakdown in the caption.",
  likes: "515", comments: "43", shares: "37", actioned: false,
  commentList: thread("Revision cases like this are exactly what Mastery should be teaching.")
};
const MASTERY_SQVIDEO_1 = {
  id: "ms_sqvid1", author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] }, time: "8h",
  hashtags: ["mastery", "safety"],
  sample: { type: "video", poster: IMG.p5img4, aspect: "square", duration: "15:30" },
  body: "Full vascular occlusion emergency drill, run exactly the way our team rehearses it every quarter.",
  likes: "870", comments: "68", shares: "60", actioned: false,
  commentList: thread("Every clinic should be running this drill on repeat.")
};
const MASTERY_SQVIDEO_2 = {
  id: "ms_sqvid2", author: { name: "Jade Osei" }, time: "14h",
  hashtags: ["mastery", "technique"],
  sample: { type: "video", poster: IMG.p2img1, aspect: "square", duration: "10:50" },
  body: "Cannula vs needle decision tree for the tear trough, worked through on three real cases back to back.",
  likes: "705", comments: "55", shares: "48", actioned: false,
  commentList: thread("Seeing the decision tree applied to three real cases sealed it for me.")
};
const MASTERY_REEL_1 = {
  id: "ms_reel1", author: { name: "Dr Owen Clarke" }, time: "9h",
  hashtags: ["mastery", "reel"],
  sample: { type: "vertical", image: IMG.p4img3 },
  body: "45 seconds on the jawline hiring order that turned one chair into three clinics.",
  likes: "780", comments: "61", shares: "140", actioned: false,
  commentList: thread("Wish I'd seen this before opening my second location.")
};
const MASTERY_REEL_2 = {
  id: "ms_reel2", author: { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", seals: ["gb"] }, time: "15h",
  hashtags: ["mastery", "reel"],
  sample: { type: "vertical", image: IMG.p5img6 },
  body: "60 seconds on the full-face sequencing rule: structure first, volume second, finesse last — never the reverse.",
  likes: "820", comments: "64", shares: "155", actioned: false,
  commentList: thread("This ordering rule alone reorganised how I plan every full-face consult.")
};
const MASTERY_REEL_3 = {
  id: "ms_reel3", author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] }, time: "17h",
  hashtags: ["mastery", "reel"],
  sample: { type: "vertical", image: IMG.p5img9 },
  body: "30 seconds on the masseter dosing split most training courses skip entirely.",
  likes: "690", comments: "50", shares: "120", actioned: false,
  commentList: thread("Skipped by every course I've taken — glad it's finally spelled out.")
};

/* Free viewers: two designed cycles (Text/SqImg/VertImg/Carousel5/SqVideo/
   Event/Reel/Poll/Quiz/Lock), teasing Confidence then Mastery, followed by
   the rest of today's editorial/video library as scroll-depth filler. */
const FREE_FEED_SEQUENCE = [
...cycleSlots({
  text: TEXT_POST_1, sqImg: [SQUARE_IMG_POST_1], vertImg: [PORTRAIT_IMG_POST_1],
  carousel: [FREE_CAROUSEL5_1], sqVideo: [EDITORIAL_POSTS[6]] /* p5 */, event: FREE_EVENTREG_1,
  reel: [EDITORIAL_POSTS[1]] /* p6 */, poll: PINNED_POSTS[1], quiz: PINNED_POSTS[0],
  lock: CONFIDENCE_POST_2
}),
...cycleSlots({
  text: TEXT_POST_2, sqImg: [SQUARE_IMG_POST_2], vertImg: [PORTRAIT_IMG_POST_2],
  carousel: [FREE_CAROUSEL5_2], sqVideo: [SQUARE_VIDEO_POST_2], event: FREE_EVENTREG_2,
  reel: [PORTRAIT_VIDEO_POST_2], poll: POLL_POST_2, quiz: QUIZ_POSTS[0],
  lock: MASTERY_POST_2
}),
// Extra library — everything else already authored, kept as scroll-depth filler.
TEXT_POST_3, SQUARE_IMG_POST_3, PORTRAIT_IMG_POST_3, EDITORIAL_POSTS[3] /* p2: carousel */,
SQUARE_VIDEO_POST_3, PORTRAIT_VIDEO_POST_3, QUIZ_POSTS[1] /* p_quiz3 */, POLL_POST_3,
COURSE_COMMENT_2, MASTERCLASS_UNLOCK_POST,
TEXT_POST_4, SQUARE_IMG_POST_4, PORTRAIT_IMG_POST_4, EDITORIAL_POSTS[4] /* p3: carousel */,
SQUARE_VIDEO_POST_4, PORTRAIT_VIDEO_POST_4, QUIZ_POSTS[2] /* p_quiz4 */, POLL_POST_4,
EDITORIAL_POSTS[0] /* p7: 10-image gallery */, EDITORIAL_POSTS[5] /* p4: carousel */,
EXTRA_VIDEO_POST_1, EXTRA_VIDEO_POST_2, EXTRA_VIDEO_POST_3, EXTRA_VIDEO_POST_4, EXTRA_VIDEO_POST_5,
EXTRA_VIDEO_POST_6, EXTRA_VIDEO_POST_7, EXTRA_VIDEO_POST_8, EXTRA_VIDEO_POST_9, EXTRA_VIDEO_POST_10];

/* Confidence subscribers: Free pool blended with the Confidence pool at the
   spec'd ratio per slot, teasing Mastery then (repeat) Freedom. The repeat
   cycle reuses the same Confidence-sourced posts (reid'd to keep distinct
   keys) rather than authoring a second set, varying only the Free-sourced
   item and the Lock target. */
const CONFIDENCE_FEED_SEQUENCE = [
...cycleSlots({
  text: TEXT_POST_1,
  sqImg: [SQUARE_IMG_POST_1, CONFIDENCE_SQIMG_1, CONFIDENCE_SQIMG_2, CONFIDENCE_SQIMG_3],
  vertImg: [PORTRAIT_IMG_POST_1, CONFIDENCE_VERTIMG_1],
  carousel: [FREE_CAROUSEL5_1, CONFIDENCE_CAROUSEL5_1, CONFIDENCE_CAROUSEL5_2],
  sqVideo: [SQUARE_VIDEO_POST_2, CONFIDENCE_SQVIDEO_1],
  event: FREE_EVENTREG_1,
  reel: [PORTRAIT_VIDEO_POST_2, CONFIDENCE_REEL_1],
  poll: PINNED_POSTS[1], quiz: PINNED_POSTS[0],
  lock: MASTERY_POST_2
}),
...cycleSlots({
  text: TEXT_POST_2,
  sqImg: [SQUARE_IMG_POST_2, ...reidAll([CONFIDENCE_SQIMG_1, CONFIDENCE_SQIMG_2, CONFIDENCE_SQIMG_3], "_b")],
  vertImg: [PORTRAIT_IMG_POST_2, reid(CONFIDENCE_VERTIMG_1, "_b")],
  carousel: [FREE_CAROUSEL5_2, ...reidAll([CONFIDENCE_CAROUSEL5_1, CONFIDENCE_CAROUSEL5_2], "_b")],
  sqVideo: [SQUARE_VIDEO_POST_3, reid(CONFIDENCE_SQVIDEO_1, "_b")],
  event: FREE_EVENTREG_2,
  reel: [PORTRAIT_VIDEO_POST_3, reid(CONFIDENCE_REEL_1, "_b")],
  poll: POLL_POST_2, quiz: QUIZ_POSTS[0],
  lock: FREEDOM_POST_2
})];

/* Mastery+ subscribers (also used for Freedom/Inner Circle/Admin viewers —
   their own Lock slots simply resolve to "full" once unlocked): Free +
   Confidence + Mastery pools blended per the spec'd ratio, teasing Freedom
   then (repeat) Inner Circle. */
const MASTERY_FEED_SEQUENCE = [
...cycleSlots({
  text: TEXT_POST_1,
  sqImg: [SQUARE_IMG_POST_1, CONFIDENCE_SQIMG_1, CONFIDENCE_SQIMG_2, CONFIDENCE_SQIMG_3, MASTERY_SQIMG_1, MASTERY_SQIMG_2],
  vertImg: [PORTRAIT_IMG_POST_1, CONFIDENCE_VERTIMG_1, MASTERY_VERTIMG_1, MASTERY_VERTIMG_2],
  carousel: [FREE_CAROUSEL5_1, CONFIDENCE_CAROUSEL5_1, CONFIDENCE_CAROUSEL5_2, MASTERY_CAROUSEL5_1, MASTERY_CAROUSEL5_2, MASTERY_CAROUSEL5_3],
  sqVideo: [SQUARE_VIDEO_POST_2, CONFIDENCE_SQVIDEO_1, MASTERY_SQVIDEO_1, MASTERY_SQVIDEO_2],
  event: FREE_EVENTREG_1,
  reel: [PORTRAIT_VIDEO_POST_2, CONFIDENCE_REEL_1, MASTERY_REEL_1, MASTERY_REEL_2, MASTERY_REEL_3],
  poll: PINNED_POSTS[1], quiz: PINNED_POSTS[0],
  lock: FREEDOM_POST_2
}),
...cycleSlots({
  text: TEXT_POST_2,
  sqImg: [SQUARE_IMG_POST_2, ...reidAll([CONFIDENCE_SQIMG_1, CONFIDENCE_SQIMG_2, CONFIDENCE_SQIMG_3, MASTERY_SQIMG_1, MASTERY_SQIMG_2], "_c")],
  vertImg: [PORTRAIT_IMG_POST_2, ...reidAll([CONFIDENCE_VERTIMG_1, MASTERY_VERTIMG_1, MASTERY_VERTIMG_2], "_c")],
  carousel: [FREE_CAROUSEL5_2, ...reidAll([CONFIDENCE_CAROUSEL5_1, CONFIDENCE_CAROUSEL5_2, MASTERY_CAROUSEL5_1, MASTERY_CAROUSEL5_2, MASTERY_CAROUSEL5_3], "_c")],
  sqVideo: [SQUARE_VIDEO_POST_3, ...reidAll([CONFIDENCE_SQVIDEO_1, MASTERY_SQVIDEO_1, MASTERY_SQVIDEO_2], "_c")],
  event: FREE_EVENTREG_2,
  reel: [PORTRAIT_VIDEO_POST_3, ...reidAll([CONFIDENCE_REEL_1, MASTERY_REEL_1, MASTERY_REEL_2, MASTERY_REEL_3], "_c")],
  poll: POLL_POST_2, quiz: QUIZ_POSTS[0],
  lock: INNER_POST_2
})];

const TIER_FEED_SEQUENCES = {
  free: FREE_FEED_SEQUENCE, confidence: CONFIDENCE_FEED_SEQUENCE,
  mastery: MASTERY_FEED_SEQUENCE, freedom: MASTERY_FEED_SEQUENCE,
  inner: MASTERY_FEED_SEQUENCE, admin: MASTERY_FEED_SEQUENCE
};
/* De-duplicated union of every post appearing in any tier's sequence — used
   to seed interaction state and search so switching tiers via the live
   persona-preview switcher never loses a post's likes/comments state, and
   Search can still find posts that only some tiers' sequences contain. */
const ALL_FEED_SEQUENCE_POSTS = Object.values(
  [SAMPLE_LONG_TEXT_POST, ...FREE_FEED_SEQUENCE, ...CONFIDENCE_FEED_SEQUENCE, ...MASTERY_FEED_SEQUENCE].reduce(
    (m, p) => { m[p.id] = p; return m; }, {}
  )
);

/* Tier-tagged posts — genuine member activity carrying a coloured tierTag
   chip (see TierTagChip), stacked on top of the membership ladder: each
   tier sees its own tag plus every tag below it (tierTagPostsFor below).
   bucket:"follow" opts these out of officialize()'s author-swap so the real
   author shows, same as a channel post or keepAuthor, without also routing
   through resolveBucketFeed/TEASABLE_BUCKETS the way a channel post does. */
const TIER_TAG_POSTS = [
{
  id: "tt_confidence", author: { name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", seals: ["gb", "verified", "skinfluencer"] },
  bucket: "follow", tierTag: "confidence", time: "3h",
  hashtags: ["protocol", "case-study", "patient"],
  media: [IMG.toxin], aspect: "portrait",
  body: "Early vascular compromise doesn't always look dramatic — blanching can be subtle, and pain out of proportion on injection is often the first real signal, well before any change in skin colour. My chairside rule: if the pain doesn't match the injection, stop and reassess before you go any further. Hyaluronidase, a warm compress and your emergency protocol sheet should be within arm's reach on every filler list, not just the ones you're nervous about.",
  likes: "612", comments: "58", shares: "34", actioned: false,
  commentList: thread("Printing this out for the treatment room today — thank you.")
},
{
  id: "tt_mastery", author: { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", seals: ["gb", "verified"] },
  bucket: "follow", tierTag: "mastery", time: "6h",
  hashtags: ["masterclass", "anatomy", "case-study"],
  media: [IMG.collage], aspect: "portrait",
  body: "The order you treat a full face in changes the result as much as the products do. My sequence: structure first (temples, cheeks, jawline), volume second (mid-face, tear troughs), finesse last (lips, perioral, skin quality) — never the reverse. Treating lips before you've restored cheek support is the single most common reason a 'good' full-face plan reads as overfilled six weeks later.",
  likes: "845", comments: "76", shares: "52", actioned: false,
  commentList: thread("This sequencing logic just reorganised how I plan every full-face consult.")
},
{
  id: "tt_freedom", author: MIRANDA,
  bucket: "follow", tierTag: "freedom", time: "1d",
  hashtags: ["business", "discussion", "update"],
  body: "Rebuilt our rate card this quarter around treatment time rather than treatment type — a 45-minute full-face consult and plan is priced the same whether it ends in filler, toxin or both. It's simplified our front-desk conversations no end, and patients understand exactly what they're paying for. Happy to share the framework if it's useful — the numbers will vary by clinic, but the model behind them travels well.",
  likes: "1.2K", comments: "84", shares: "66", actioned: false,
  commentList: thread("Switching our card over to time-based pricing next quarter — makes so much sense.")
}];


/* Richest tier first — each tier below sees its own tag plus every tag
   below it (Confidence -> [confidence]; Mastery -> [mastery, confidence];
   Freedom/Inner Circle/Admin -> [freedom, mastery, confidence]). Free (or
   any unrecognised persona key) gets no tier-tagged posts at all. */
const TIER_TAG_LADDER = ["freedom", "mastery", "confidence"];
const TIER_TAG_RANK = { confidence: 0, mastery: 1, freedom: 2, inner: 2, admin: 2 };
function tierTagPostsFor(tier) {
  const rank = TIER_TAG_RANK[tier];
  if (rank === undefined) return [];
  const allowedTags = TIER_TAG_LADDER.slice(TIER_TAG_LADDER.length - 1 - rank);
  return allowedTags.map((tag) => TIER_TAG_POSTS.find((p) => p.tierTag === tag)).filter(Boolean);
}

/* ============================ SHARED BITS ================================ */
function SectionHead({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-h2)", color: "var(--text-primary)" }}>
        {children}
      </span>
      {action &&
      <a style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body)", color: "var(--action-primary)", cursor: "pointer" }}
      onClick={onAction}>
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
  const goToEvents = () => (window.pfGo || function (u) { window.location.href = u; })("EventsWeb.html");
  return (
    <aside className="rail" data-screen-label="Right sidebar">
      <Card padding={20}>
        <SectionHead action="See all" onAction={goToEvents}>My Events</SectionHead>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {EVENTS.map((e, i) => <EventCard key={i} {...e} onCta={goToEvents} />)}
        </div>
      </Card>
      <AddToFeed />
      <MembershipCard />
    </aside>);

}

/* ============================ FEED ======================================= */

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
              <iconify-icon icon={opt.icon} width="22" height="22"></iconify-icon>
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

/* Instagram-style "double tap to love": tracks tap timing per media element
   and, when a second tap lands within 300ms, cancels the pending single-tap
   action (play/pause, open fullscreen, …), fires the Love reaction, and pops
   a big heart at the tap point. Rendered via portal so it escapes any
   overflow:hidden/scrolling ancestor (video frame, swipeable gallery). */
function useDoubleTapLove(onLove) {
  const lastTap = useRef(0);
  const pending = useRef(null);
  const [heart, setHeart] = useState(null);
  const heartSeq = useRef(0);

  const wrap = (singleTap) => (e) => {
    const now = Date.now();
    const x = e.clientX,y = e.clientY;
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      clearTimeout(pending.current);
      const key = ++heartSeq.current;
      setHeart({ x, y, key });
      setTimeout(() => setHeart((h) => h && h.key === key ? null : h), 700);
      onLove();
      return;
    }
    lastTap.current = now;
    if (singleTap) pending.current = setTimeout(singleTap, 260);
  };

  const heartNode = heart && typeof document !== "undefined" && ReactDOM.createPortal(
    <span key={heart.key} className="sm-double-heart" style={{ left: heart.x, top: heart.y }}>
      <IconifyIcon name="fluent:heart-16-filled" size={96} color="var(--reaction-love)" />
    </span>,
    document.body
  );

  return { wrap, heartNode };
}

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

/* Shared hover-to-reveal reaction bar behaviour for any post card whose ref
   wraps a DS PostActions row: reveals the ReactionPicker on like-button
   hover, reflects the chosen reaction's icon/color back onto that button,
   and bursts floating emoji when a reaction is picked. */
function useReactionPicker(ref, reaction, onReact) {
  const [picker, setPicker] = useState(null);
  const hideT = useRef(null);

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
  const cancelHide = () => clearTimeout(hideT.current);

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

  useLayoutEffect(() => {
    const btn = likeButtonOf(ref.current);
    if (!btn) return;
    const icon = btn.querySelector("iconify-icon");
    const label = btn.querySelector("span");
    const r = REACTION_MAP[reaction];
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

  const pick = (key) => {
    const changing = reaction !== key;
    onReact(key);
    if (changing) burstReaction(ref.current, key);
    setPicker(null);
  };

  return { picker, pick, cancelHide, scheduleHide };
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

/* Post composer — "What's on your mind?" pill with quick-attach icons
   (Video / Photo / Reel) plus a Post button, matching the create-post-mobile
   flow's post shape so new posts render identically on both surfaces. Only
   Photo actually attaches (via post.media, rendered by MediaCarousel);
   Video/Reel focus the composer since there's no capture/upload pipeline
   for those yet. */
function ComposerIconButton({ icon, color, label, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, flexShrink: 0, borderRadius: "var(--r-pill)", border: "none", cursor: "pointer", background: "transparent" }}>
      <IconifyIcon name={icon} size={19} color={color} />
    </button>);

}

function PostComposer({ onPost }) {
  const [v, setV] = useState("");
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const firstName = (ME.name || "").split(" ")[0];
  const ready = v.trim().length > 0 || images.length > 0;

  const submit = () => {
    if (!ready) return;
    onPost({ body: v.trim(), media: images });
    setV(""); setImages([]);
  };

  const focusInput = () => { if (inputRef.current) inputRef.current.focus(); };

  const pickImages = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      Array.from(e.target.files || []).slice(0, Math.max(0, 5 - images.length)).forEach((f) => {
        const reader = new FileReader();
        reader.onload = () => setImages((prev) => [...prev, reader.result].slice(0, 5));
        reader.readAsDataURL(f);
      });
    };
    input.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-card)", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name={ME.name} src={ME.avatar} size={44} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, background: "var(--surface-sunken)", border: "1px solid var(--border-default)", borderRadius: "var(--r-pill)", padding: "9px 9px 9px 18px" }}>
          <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") submit();}}
          placeholder={"What's on your mind, " + firstName + "?"}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--fs-body-lg)", color: "var(--text-primary)", minWidth: 0 }} />
          <ComposerIconButton icon="lucide:video" color="var(--error)" label="Add video" onClick={focusInput} />
          <ComposerIconButton icon="lucide:image" color="var(--success)" label="Add photo" onClick={pickImages} />
          <ComposerIconButton icon="lucide:clapperboard" color="var(--reaction-love)" label="Add reel" onClick={focusInput} />
          <button type="button" onClick={submit} aria-label="New post"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, flexShrink: 0, borderRadius: "var(--r-pill)", border: "none", cursor: ready ? "pointer" : "default", background: ready ? "var(--action-primary)" : "var(--gray-200)", transition: "background var(--dur-fast)" }}>
            <IconifyIcon name="lucide:send" size={18} color={ready ? "var(--white)" : "var(--gray-500)"} />
          </button>
        </div>
      </div>
      {images.length > 0 &&
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingLeft: 56 }}>
        {images.map((src, i) =>
        <div key={i} style={{ position: "relative" }}>
            <img src={src} alt="" style={{ width: 72, height: 72, borderRadius: "var(--r-sm)", objectFit: "cover", display: "block" }} />
            <button type="button" aria-label="Remove image" onClick={() => setImages((imgs) => imgs.filter((_, j) => j !== i))}
          style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", border: "none", cursor: "pointer", background: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconifyIcon name="lucide:x" size={12} color="var(--white)" />
            </button>
          </div>
        )}
      </div>}
    </div>);

}

function LikedByRow() {
  return null;
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
            <div className="nm">
              {post.author.name}
              {post.author.seals && <VerificationSeals seals={post.author.seals} size={14} gap={3} />}
            </div>
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
                    <span className="nm">
                      {c.author.name}
                      {c.author.seals && <VerificationSeals seals={c.author.seals} size={14} gap={3} />}
                    </span>
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
                        <div className="row">
                          <span className="nm">
                            {rep.author.name}
                            {rep.author.seals && <VerificationSeals seals={rep.author.seals} size={14} gap={3} />}
                          </span>
                        </div>
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
function ClampText({ text, lines = 5, more = "See more", color = "var(--text-primary)" }) {
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
      style={{ ...(expanded ? null : { WebkitLineClamp: lines }), color }}>
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

/* Swipeable image carousel with dot indicators + counter for media posts.
   `aspect` ("square"|"portrait") only applies to single-image posts; multi-
   image carousels open a click-to-fullscreen viewer (own swipeable strip of
   the same images). */
function MediaCarousel({ images, aspect, onLoveReact }) {
  const [idx, setIdx] = useState(0);
  const [fs, setFs] = useState(false);
  const [fsIdx, setFsIdx] = useState(0);
  const ref = useRef(null);
  const fsRef = useRef(null);
  const { wrap, heartNode } = useDoubleTapLove(onLoveReact || (() => {}));
  useEffect(() => {
    if (!fs) return;
    const onKey = (e) => {if (e.key === "Escape") setFs(false);};
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [fs]);
  useEffect(() => {
    if (fs && fsRef.current) fsRef.current.scrollLeft = fsIdx * fsRef.current.clientWidth;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fs]);
  if (!images || images.length === 0) return null;
  const single = images.length === 1;
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild;
    const w = first ? first.offsetWidth + 8 : el.clientWidth * 0.74 + 8;
    setIdx(Math.round(el.scrollLeft / w));
  };
  const openFullscreen = (i) => {
    if (single) return;
    setFsIdx(i);
    setFs(true);
  };
  const onFsScroll = () => {
    const el = fsRef.current;
    if (!el) return;
    setFsIdx(Math.round(el.scrollLeft / el.clientWidth));
  };
  return (
    <div className="mc-wrap">
      <div className={"mc-scroll" + (single ? " mc-scroll-single" + (aspect ? " mc-aspect-" + aspect : "") : "")} ref={ref} onScroll={onScroll}>
        {images.map((src, i) =>
          <img key={i} src={src} alt={"Image " + (i + 1) + " of " + images.length} className="mc-img"
          onClick={wrap(() => openFullscreen(i))} />
        )}
      </div>
      {!single && <span className="mc-count">{idx + 1}/{images.length}</span>}
      {!single && <SlidingDots count={images.length} idx={idx} />}
      {heartNode}
      {fs &&
      <div className="sm-fs" onClick={(e) => {e.stopPropagation();}}>
          <div className="mc-fs-track" onScroll={onFsScroll} ref={fsRef}>
            {images.map((src, i) => <img key={i} src={src} alt={"Image " + (i + 1) + " of " + images.length} />)}
          </div>
          <button type="button" className="sm-fs-close" aria-label="Close fullscreen"
        onClick={() => setFs(false)}>
            <IconifyIcon name="lucide:x" size={24} color="var(--white)" />
          </button>
          <span className="mc-fs-count">{fsIdx + 1}/{images.length}</span>
        </div>
      }
    </div>
  );
}

/* Sample media for demo posts: a video player, a vertical reel, and a 10-image
   swipeable gallery. Rendered inside the DS PostCard's body slot. */
/* Floating avatars of people you follow who reacted — overlaid bottom-left on
   video/reel media (Facebook-style), each with a small reaction badge. */
const FOLLOW_REACTORS = [
{ name: "Daryll Cee", avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl_iS6ah90lEufyitkFEND2e98ccufb7spcgCLbb2gY1vw7151sSqjaXGp&s=10", rxn: "like" },
{ name: "Marco Ricci", avatar: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg", rxn: "heart" },
{ name: "Sofia Chen", avatar: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", rxn: "heart" }];

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
        <div className="chx-name">{channel.name}</div>
        <div className="chx-by">
          <Avatar name={channel.by} src={channel.byAvatar} size={22} />
          <span>{channel.by} · {channel.time} · </span>
          <span className="chx-flag">🇬🇧</span>
        </div>
      </div>
      <button type="button" className={"chx-join" + (joined ? " on" : "")} onClick={() => setJoined((j) => !j)}>
        {joined ? "Joined" : "Join"}
      </button>
    </div>);

}

function SampleMedia({ sample, postId, saved, onSave, onReport, onLoveReact, author, likes, commentsCount, shares, liked, comments, onLike, onComment, onShare }) {
  const galleryRef = useRef(null);
  const videoRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(() => (sample && sample.type === "vertical") || (postId != null && window.pfWasWatched && window.pfWasWatched(postId)));
  const [muted, setMuted] = useState(true);
  const openReel = () => {
    if (postId != null && window.pfMarkWatched) window.pfMarkWatched(postId);
    let el = videoRef.current;
    while (el && el.parentElement) {
      el = el.parentElement;
      if (el.scrollHeight > el.clientHeight + 1) {
        if (window.pfSaveScroll) window.pfSaveScroll(el);
        break;
      }
    }
    (window.pfGo || function (u) {window.location.href = u;})("ReelMobile.html");
  };
  const { wrap, heartNode } = useDoubleTapLove(onLoveReact || (() => {}));
  if (!sample) return null;

  if (sample.type === "video") {
    return (
      <>
        <div className={"sm-video" + (sample.aspect === "square" ? " sm-video-square" : "")}
        ref={videoRef}
        onClick={wrap(openReel)} role="button" tabIndex={0} aria-label="Open reel"
        onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault();openReel();}}}>
          <img src={sample.poster} alt="" />
          <button type="button" className="sm-mute" aria-label={muted ? "Unmute" : "Mute"}
          onClick={(e) => {e.stopPropagation();setMuted((m) => !m);}}>
            <IconifyIcon name={muted ? "lucide:volume-x" : "lucide:volume-2"} size={16} color="var(--white)" />
          </button>
          {!playing && <FloatingReactors />}
          <div className="sm-video-controls">
            <span className="sm-time">0:07</span>
            <span className="sm-track"><span className="sm-fill sm-video-fill" /></span>
            <span className="sm-time">0:15</span>
          </div>
        </div>
        {heartNode}
      </>);

  }

  if (sample.type === "vertical") {
    return (
      <>
        <div className={"sm-vertical sm-reel" + (playing ? " playing" : "")}
        ref={videoRef}
        onClick={wrap(openReel)} role="button" tabIndex={0} aria-label="Open reel"
        onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault();openReel();}}}>
          <img src={sample.image} alt="" />
          <span className={"sm-bigplay" + (playing ? " hide" : "")}>
            <IconifyIcon name="fluent:play-16-filled" size={30} color="var(--white)" />
          </span>
          <div className="sm-controls" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="sm-ctl" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
              <IconifyIcon name={playing ? "fluent:pause-16-filled" : "fluent:play-16-filled"} size={18} color="var(--white)" />
            </button>
            <span className="sm-time">0:12</span>
            <span className="sm-track"><span className="sm-fill" /></span>
            <span className="sm-time">0:30</span>
            <button type="button" className="sm-ctl" aria-label={muted ? "Unmute" : "Mute"} onClick={(e) => {e.stopPropagation();setMuted((m) => !m);}}>
              <IconifyIcon name={muted ? "lucide:volume-x" : "lucide:volume-2"} size={16} color="var(--white)" />
            </button>
          </div>
        </div>
        {heartNode}
      </>);

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
        <img key={i} src={src} alt={"Image " + (i + 1) + " of " + sample.images.length} onClick={wrap(null)} />
        )}
      </div>
      <span className="sm-count">{idx + 1}/{sample.images.length}</span>
      <SlidingDots count={sample.images.length} idx={idx} />
      {heartNode}
    </div>);

}

/* Community poll — Profinity posts a question with a fixed set of options;
   tapping any option casts the viewer's vote (once) and reveals the result
   bars for all options, with the viewer's own pick marked by a checkmark. */
function Poll({ poll }) {
  const [voted, setVoted] = useState(null);
  const answered = voted !== null;
  const totalVotes = poll.votes + (answered ? 1 : 0);

  return (
    <div className="pf-poll">
      <div className="pf-poll-q">
        <span className="pf-poll-badge">
          <IconifyIcon name="lucide:bar-chart-2" size={20} color="var(--white)" />
        </span>
        <span>{poll.question}</span>
      </div>
      <div className="pf-poll-opts">
        {poll.options.map((o, i) =>
        <button type="button" key={o.label}
        className={"pf-poll-opt" + (answered ? " answered" : "") + (voted === i ? " selected" : "")}
        disabled={answered}
        onClick={() => setVoted(i)}>
            {answered && <span className="pf-poll-fill" style={{ width: o.pct + "%" }} />}
            <span className="pf-poll-opt-row">
              {answered ?
            voted === i && <span className="pf-poll-check"><IconifyIcon name="lucide:check" size={12} color="var(--white)" /></span> :

            <span className="pf-poll-radio" />
            }
              <span className="pf-poll-label">{o.label}</span>
              {answered && <span className="pf-poll-pct">{o.pct}%</span>}
            </span>
          </button>
        )}
      </div>
      <div className="pf-poll-foot">
        {totalVotes.toLocaleString()} votes · {answered ? "Thanks for voting" : "Tap an option to vote"}
      </div>
    </div>);

}

/* Confetti burst — a fixed pool of celebratory pieces rendered only while
   `active`, each launched from the card's center and radiating outward
   before gravity takes over, with randomized angle/distance/spin/fall baked
   into inline vars so the CSS keyframes stay generic. Self-unmounts (via the
   parent clearing `active`) once the animation finishes so idle quiz cards
   keep zero nodes. */
function ConfettiBurst({ active }) {
  const pieces = useMemo(() => {
    if (!active) return [];
    const colors = ["var(--brand-gold)", "var(--brand-navy)", "var(--success)", "var(--info)", "var(--warning)"];
    return Array.from({ length: 48 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 140;
      return {
        id: i,
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius * 0.5,
        fall: 160 + Math.random() * 120,
        drift: (Math.random() - 0.5) * 50,
        rotate: (Math.random() - 0.5) * 720,
        delay: Math.random() * 0.25,
        duration: 1.8 + Math.random() * 0.9,
        color: colors[i % colors.length],
        w: 6 + Math.random() * 5
      };
    });
  }, [active]);

  if (!active) return null;

  return (
    <div className="pf-confetti" aria-hidden="true">
      {pieces.map((p) =>
      <span key={p.id} className="pf-confetti-piece"
      style={{
        "--pf-confetti-dx": p.dx + "px",
        "--pf-confetti-dy": p.dy + "px",
        "--pf-confetti-fall": p.fall + "px",
        "--pf-confetti-drift": p.drift + "px",
        "--pf-confetti-rotate": p.rotate + "deg",
        animationDelay: p.delay + "s",
        animationDuration: p.duration + "s",
        background: p.color,
        width: p.w + "px",
        height: p.w * 0.4 + "px"
      }} />
      )}
    </div>);

}

/* Community questionnaire — Profinity posts a knowledge-check question with one
   correct option; tapping any option locks in the viewer's answer and reveals
   whether they were right (their pick + the correct one both highlighted). */
function Questionnaire({ questionnaire: q }) {
  const [picked, setPicked] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const answered = picked !== null;
  const isCorrect = answered && q.options[picked].correct;

  useEffect(() => {
    if (!isCorrect) return;
    setCelebrate(true);
    const t = setTimeout(() => setCelebrate(false), 3200);
    return () => clearTimeout(t);
  }, [isCorrect]);

  return (
    <div className="pf-quiz">
      <ConfettiBurst active={celebrate} />
      <div className="pf-quiz-q">
        <span className="pf-quiz-badge">
          <IconifyIcon name="lucide:brain" size={20} color="var(--white)" />
        </span>
        <span>{q.question}</span>
      </div>
      <div className="pf-quiz-opts">
        {q.options.map((o, i) => {
          const state = answered && o.correct ? "correct" : answered && picked === i ? "incorrect" : "";
          return (
            <button type="button" key={o.label}
            className={"pf-quiz-opt" + (answered ? " answered" : "") + (state ? " " + state : "")}
            disabled={answered}
            onClick={() => setPicked(i)}>
              <span className="pf-quiz-opt-row">
                {state ?
                <span className={"pf-quiz-mark " + state}>
                    <IconifyIcon name={state === "correct" ? "lucide:check" : "lucide:x"} size={12} color="var(--white)" />
                  </span> :
                <span className="pf-quiz-radio" />
                }
                <span className="pf-quiz-label">{o.label}</span>
              </span>
            </button>);

        })}
      </div>
      <div className={"pf-quiz-foot" + (answered ? " " + (isCorrect ? "correct" : "incorrect") : "")}>
        {answered ?
        isCorrect ? "Correct! Nice work." : "Not quite — the correct answer is highlighted above." :
        <>Tap an option to answer <IconifyIcon name="lucide:wand-sparkles" size={14} color="var(--gray-500)" /></>
        }
      </div>
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
      <span>Liked by <span className="bub-likedby-name">Jessica Hue</span> and <span className="bub-likedby-name">others</span></span>
    </div>);

}

/* Confirmation sheet shown after a viewer reports a post from the post's
   "..." menu — reuses the saved-sheet slide-up shell (see useSaveFlow below)
   with a red flag icon in place of the gold bookmark. */
function ReportedModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="saved-overlay" onClick={onClose}>
      <div className="saved-sheet" onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Post reported">
        <div className="saved-handle" />
        <div className="saved-icon-wrap" style={{ background: "var(--error-bg)" }}>
          <IconifyIcon name="lucide:flag" size={30} color="var(--error)" />
        </div>
        <div className="saved-title">Reported</div>
        <div className="saved-desc">Thanks for letting us know. Our team will review this post and take action if it breaks our community guidelines.</div>
        <button type="button" className="saved-btn" style={{ background: "var(--error)" }} onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

/* Shared "..." menu for post cards that don't render through the DS PostCard
   (ChannelFeedCard, CourseCommentCard) — mirrors the menu PostCard itself
   opens from its own "..." icon, so every post gets the same two actions. */
function PostMoreMenu({ saved, onSave, onReport, iconColor = "var(--gray-400)" }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return (
    <div style={{ position: "relative", flex: "none", marginLeft: "auto" }}>
      <button type="button" aria-label="Post options" aria-haspopup="menu" aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", lineHeight: 0 }}>
        <IconifyIcon name="lucide:more-vertical" size={20} color={iconColor} />
      </button>
      {open &&
      <div className="pf-post-menu" role="menu" onClick={(e) => e.stopPropagation()}>
        <button type="button" role="menuitem" className="pf-post-menu-item"
          onClick={() => { setOpen(false); onSave && onSave(); }}>
          <IconifyIcon name={saved ? "lucide:bookmark-minus" : "lucide:bookmark"} size={18} color="var(--gray-700)" />
          {saved ? "Remove from saved" : "Save post"}
        </button>
        <button type="button" role="menuitem" className="pf-post-menu-item pf-post-menu-item--danger"
          onClick={() => { setOpen(false); onReport && onReport(); }}>
          <IconifyIcon name="lucide:flag" size={18} color="var(--error)" />
          Report post
        </button>
      </div>
      }
    </div>
  );
}

/* The same collections a viewer sees on the My Saved screen (my-saved.jsx's
   MS_COLLECTIONS) — kept in sync by hand since each page loads its own
   script and there's no shared module system here. */
const PF_COLLECTIONS = [
  { name: "Lip protocols", n: 14, img: "assets/course-lip.png" },
  { name: "Toxin techniques", n: 22, img: "assets/course-protox.png" },
  { name: "Watch later", n: 8, icon: "lucide:clock" },
  { name: "Complication cases", n: 11, img: "assets/chin-positions.png" },
  { name: "Full-face assessment", n: 6, img: "assets/post5-img1.png" },
  { name: "Business growth", n: 9, img: "assets/post3-img1.png" },
  { name: "Temple & midface", n: 5, img: "assets/course-temple.png" },
  { name: "Chairside handouts", n: 17, img: "assets/clinic-toxin-guide.png" },
];

/* Reel-style save flow shared by every post card: tapping Save shows a
   "Saved" toast with a Collections link; picking a collection from the
   sheet swaps it for a "Saved to <name>" toast with a View link. One
   instance lives on Feed itself (not per-card) so saving two different
   posts back-to-back can't stack two toasts on top of each other. */
function useSaveFlow() {
  const [toast, setToast] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const showToast = (cfg) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(cfg);
    timer.current = setTimeout(() => setToast(null), 3500);
  };
  const dismissToast = () => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  };
  return {
    toast, sheetOpen,
    notifySaved: () => showToast({ kind: "saved" }),
    notifyUnsaved: () => { dismissToast(); setSheetOpen(false); },
    openCollections: () => { dismissToast(); setSheetOpen(true); },
    closeSheet: () => setSheetOpen(false),
    chooseCollection: (name) => { setSheetOpen(false); showToast({ kind: "savedTo", collection: name }); }
  };
}

/* Renders the toast + "Save to collection" sheet for a useSaveFlow() result.
   Every post card mounts one of these alongside its own ReportedModal etc. */
function SaveFlowUI({ flow }) {
  const goToMySaved = () => (window.pfGo || function (u) { window.location.href = u; })("MySaved.html");
  return (
    <>
      {flow.toast &&
      <div className="pf-save-toast" role="status">
        <span className="pf-save-toast-ck"><IconifyIcon name="lucide:check" size={13} color="#0a0a0a" /></span>
        <span className="pf-save-toast-tx">{flow.toast.kind === "saved" ? "Saved" : `Saved to ${flow.toast.collection}`}</span>
        <button type="button" className="pf-save-toast-act" onClick={flow.toast.kind === "saved" ? flow.openCollections : goToMySaved}>
          {flow.toast.kind === "saved" ? "Collections" : "View"}
          <IconifyIcon name="lucide:chevron-right" size={16} color="#fff" />
        </button>
      </div>}
      {flow.sheetOpen &&
      <div className="saved-overlay" onClick={flow.closeSheet}>
        <div className="saved-sheet pf-save-sheet" onClick={(e) => e.stopPropagation()}
          role="dialog" aria-modal="true" aria-label="Save to collection">
          <div className="saved-handle" />
          <h3 className="pf-save-sheet-title">Save to collection</h3>
          <div className="pf-save-sheet-list">
            {PF_COLLECTIONS.map((c) =>
            <button key={c.name} type="button" className="pf-save-sheet-row" onClick={() => flow.chooseCollection(c.name)}>
                <span className="pf-save-sheet-thumb">
                  {c.img ? <img src={c.img} alt="" /> : <IconifyIcon name={c.icon} size={20} color="var(--gray-500)" />}
                </span>
                <span className="pf-save-sheet-info">
                  <span className="pf-save-sheet-nm">{c.name}<IconifyIcon name="lucide:lock" size={12} color="var(--gray-400)" /></span>
                  <span className="pf-save-sheet-n">{c.n} posts</span>
                </span>
                <span className="pf-save-sheet-plus"><IconifyIcon name="lucide:plus" size={18} color="var(--text-heading)" /></span>
              </button>
            )}
            <button type="button" className="pf-save-sheet-row" onClick={() => flow.chooseCollection("New collection")}>
              <span className="pf-save-sheet-thumb pf-save-sheet-thumb-new"><IconifyIcon name="lucide:plus" size={20} color="var(--brand-navy)" /></span>
              <span className="pf-save-sheet-info"><span className="pf-save-sheet-nm">Create new collection</span></span>
            </button>
          </div>
        </div>
      </div>}
    </>
  );
}

/* Resolves a post's stored hashtag slugs into the admin-managed tag objects
   (label + icon) the DS PostCard renders — slugs that no longer exist in the
   admin list (e.g. removed from the Admin Panel) are silently dropped. */
function resolveHashtags(slugs) {
  if (!slugs || !slugs.length || typeof window === "undefined" || !window.PFHashtags) return [];
  const all = window.PFHashtags.getAll();
  const map = all.reduce((m, t) => { m[t.slug] = t; return m; }, {});
  return slugs.map((s) => map[s]).filter(Boolean);
}

/* Reels get their own Instagram-style action row (heart/comment/send with
   counts, bookmark alone on the far right) instead of the shared DS
   PostActions row — the CSS hides that row for .is-reel posts. */
function ReelActionsRow({ likes, comments, shares, liked, saved, onLike, onComment, onShare, onSave }) {
  return (
    <div className="pf-reel-actions">
      <div className="pf-reel-actions-left">
        <button type="button" className="pf-reel-act" aria-label={liked ? "Unlike" : "Like"} onClick={onLike}>
          <IconifyIcon name={liked ? "fluent:heart-16-filled" : "lucide:heart"} size={24} color={liked ? "var(--reaction-love)" : "var(--text-primary)"} />
          <span>{likes}</span>
        </button>
        <button type="button" className="pf-reel-act" aria-label="Comment" onClick={onComment}>
          <IconifyIcon name="lucide:message-circle" size={23} color="var(--text-primary)" />
          <span>{comments}</span>
        </button>
        <button type="button" className="pf-reel-act" aria-label="Share" onClick={onShare}>
          <IconifyIcon name="lucide:send" size={22} color="var(--text-primary)" />
          <span>{shares}</span>
        </button>
      </div>
      <button type="button" className="pf-reel-save" aria-label={saved ? "Remove from saved" : "Save"} onClick={onSave}>
        <IconifyIcon name={saved ? "lucide:bookmark-check" : "lucide:bookmark"} size={24} color="var(--text-primary)" />
      </button>
    </div>);

}

/* Clicking a hashtag on a post (Newsfeed or Community) jumps to the Search
   page pre-filtered to every other post sharing that same tag. */
function goToHashtag(tag) {
  if (!tag || !tag.slug) return;
  const url = "SearchMobile.html?tag=" + encodeURIComponent(tag.slug);
  (window.pfGo || function (u) { window.location.href = u; })(url);
}

/* Tags carrying the bronze/silver/gold metal system — everything else on
   BUCKET_META (course, general, mylearning, …) keeps its plain accent color. */
const METAL_TIER_TAGS = ["confidence", "mastery", "freedom", "inner"];

/* Coloured tier chip shown next to a post's timestamp (see post.tierTag) —
   reuses ChannelFeedCard's pf-chcard-tag pill + BUCKET_META's per-tier
   colour rather than introducing a new visual pattern. Confidence/Mastery/
   Freedom render in their metal (bronze/silver/gold); Inner Circle stays navy. */
function TierTagChip({ tag }) {
  const meta = BUCKET_META[tag];
  if (!meta) return null;
  const isMetal = METAL_TIER_TAGS.includes(tag);
  return (
    <span className={"pf-chcard-tag pf-lock-chan" + (isMetal ? " tier-" + tag : "")}
      style={isMetal ? { marginTop: 0, marginLeft: 8 } : { color: meta.color, background: `color-mix(in srgb, ${meta.color} 15%, transparent)`, marginTop: 0, marginLeft: 8 }}>
      {meta.label}
    </span>);

}

/* Destinations unlock with the membership ladder: a viewer sees their own
   channel and every one below. Read from window.PF_TIER, falling back to
   the "pf-preview-tier" localStorage key used by the mobile preview pages,
   and finally to the viewer's real subscription tier so a genuinely free
   member only ever sees "My feed". */
const SHARE_TIER_ORDER = ["free", "confidence", "mastery", "freedom", "sovereign", "inner"];
function shareTier() {
  if (typeof window === "undefined") return "free";
  if (window.PF_TIER) return window.PF_TIER;
  try { const v = localStorage.getItem("pf-preview-tier"); if (v) return v; } catch (e) {}
  return getUserTier();
}
const SHARE_DESTINATIONS = [
  { k: "feed", label: "My feed", sub: "Everyone who follows you", icon: "lucide:rss", tier: 0 },
  { k: "confidence", label: "Confidence", sub: "Community channel", icon: "lucide:message-circle", tier: 1 },
  { k: "mastery", label: "Mastery", sub: "Community channel", icon: "lucide:crown", tier: 2 },
  { k: "complications", label: "Complications", sub: "Community channel", icon: "lucide:shield-alert", tier: 2 },
  { k: "freedom", label: "Freedom Path", sub: "Community channel", icon: "lucide:rocket", tier: 3 },
];
function ShareSheet({ post, onClose, onShare }) {
  const shRank = Math.max(0, SHARE_TIER_ORDER.indexOf(shareTier()));
  const dests = SHARE_DESTINATIONS.map((d) => ({ ...d, locked: d.tier > shRank }));
  const unlockedCount = dests.filter((d) => !d.locked).length;
  const [step, setStep] = useState("say"); // "say" | "where"
  const [pick, setPick] = useState("feed");
  const [caption, setCaption] = useState("");
  const cardRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    if (cardRef.current) cardRef.current.focus();
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (step === "where") setStep("say");else
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (prev && prev.focus) prev.focus();
    };
  }, [step]);
  const chosen = dests.find((d) => d.k === pick);
  const destText = chosen.k === "feed" ? "Share to Newsfeed" : chosen.label;
  const submit = () => onShare({ destKey: chosen.k, destLabel: chosen.label, caption: caption.trim() });
  const images = post && post.media ? post.media.slice(0, 2) : [];
  const sheet = (
    <div className="pf-share-overlay" role="dialog" aria-modal="true" aria-label="New post" ref={cardRef} tabIndex={-1}>
      <div className="pf-share-hd">
        <button type="button" className="pf-share-cancel" onClick={onClose}>Cancel</button>
        <span className="pf-share-title">New post</span>
        <span className="pf-share-hd-spacer" aria-hidden="true" />
      </div>
      <div className="pf-share-body">
        <div className="pf-share-crumb">
          <Avatar name={ME.name} src={ME.avatar} size={40} />
          <div className="pf-share-crumb-tx">
            <span className="me">{ME.name}</span>
            <IconifyIcon name="lucide:chevron-right" size={13} color="var(--gray-450)" />
            <button type="button" className="pf-share-dest-btn" disabled={unlockedCount <= 1}
              aria-haspopup="dialog" aria-expanded={step === "where"}
              onClick={() => setStep((s) => s === "where" ? "say" : "where")}>
              {destText}
              {unlockedCount > 1 && <IconifyIcon name="lucide:chevron-down" size={14} color="#A26301" />}
            </button>
          </div>
          {step === "where" &&
          <div className="pf-share-dd" role="radiogroup" aria-label="Destination">
            {dests.map((d) => (
              <button key={d.k} type="button" role="radio" aria-checked={!d.locked && pick === d.k}
                disabled={d.locked}
                className={"pf-share-dd-opt" + (d.locked ? " locked" : "") + (!d.locked && pick === d.k ? " on" : "")}
                onClick={() => { if (d.locked) return;setPick(d.k);setStep("say"); }}>
                <span className="ic">
                  <IconifyIcon name={d.locked ? "lucide:lock" : d.icon} size={18}
                    color={d.locked ? "var(--gray-450)" : "var(--brand-navy)"} />
                </span>
                <span className="tx"><b>{d.label}</b><i>{d.locked ? "Upgrade to share here" : d.sub}</i></span>
                {!d.locked && pick === d.k &&
                <span className="ck"><IconifyIcon name="lucide:check" size={12} color="#fff" /></span>
                }
              </button>
            ))}
          </div>
          }
        </div>
        <textarea className="pf-share-caption" placeholder="Share your thoughts…" rows={3}
          value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="pf-share-tools">
          <button type="button" className="pf-share-tool" aria-label="Add photo">
            <IconifyIcon name="lucide:image" size={20} color="var(--gray-500)" />
          </button>
          <button type="button" className="pf-share-tool" aria-label="Add sticker">
            <IconifyIcon name="lucide:sticker" size={20} color="var(--gray-500)" />
          </button>
          <button type="button" className="pf-share-tool" aria-label="More options">
            <IconifyIcon name="lucide:more-horizontal" size={20} color="var(--gray-500)" />
          </button>
        </div>
        {post &&
        <div className="pf-share-quote">
          <div className="pf-share-quote-hd">
            <Avatar name={post.author.name} src={post.author.avatar} size={30} />
            <span className="nm">{post.author.name}</span>
            <IconifyIcon name="lucide:badge-check" size={14} color="var(--info)" />
            <span className="tm">{post.time}</span>
          </div>
          {post.body && <p className="pf-share-quote-body">{post.body}</p>}
          {images.length > 0 &&
          <div className={"pf-share-quote-imgs pf-share-quote-imgs-" + images.length}>
            {images.map((src, i) => <img key={i} src={src} alt="" />)}
          </div>
          }
        </div>
        }
      </div>
      <div className="pf-share-ft">
        <button type="button" className="pf-share-ft-cancel" onClick={onClose}>Cancel</button>
        <button type="button" className="pf-share-cta" onClick={submit}>Post</button>
      </div>
      {step === "where" &&
      <button type="button" className="pf-share-scrim2" aria-label="Close" onClick={() => setStep("say")} />
      }
    </div>
  );
  const host = typeof document !== "undefined" &&
    document.querySelector(".m-screen, .cm-screen, .lm-screen, .pm-screen, .ev-screen");
  return host ? ReactDOM.createPortal(sheet, host) : sheet;
}

function FeedPost({ post, st, hideTags, onToggleLike, onReact, onDoubleTapLove, onShare, onSave, onAddComment, onAddReply }) {
  const ref = useRef(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyFor, setReplyFor] = useState(null);
  const [likesOpen, setLikesOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reportedOpen, setReportedOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const commentSheet = typeof window !== "undefined" && window.PF_COMMENT_SHEET;
  const { picker, pick, cancelHide, scheduleHide } = useReactionPicker(ref, st.reaction, onReact);

  const actionIcon = (idx) => {
    const btns = ref.current ? ref.current.querySelectorAll("button") : [];
    const b = btns[idx];
    return b ? b.querySelector("iconify-icon, svg") : null;
  };

  const handleLike = () => {
    const willReact = !st.reaction;
    onToggleLike();
    if (willReact) burstReaction(ref.current, "like");
  };
  const handleDoubleTapLove = () => {
    const willReact = !st.reaction;
    onDoubleTapLove();
    if (willReact) burstReaction(ref.current, "love");
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
  const doShare = ({ destKey, destLabel, caption }) => {
    setShareOpen(false);
    onShare(destKey === "feed" ? caption : "");
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
    setToast("Shared to " + destLabel);
    setTimeout(() => setToast(null), 2200);
  };
  const handleShare = () => setShareOpen(true);

  const comments = st.comments || [];
  const hasRegion = comments.length > 0 || composerOpen;
  const inlineBubbles = typeof window !== "undefined" && window.PF_INLINE_BUBBLES;
  const isReel = post.sample && post.sample.type === "vertical";

  return (
    <div className={"post-wrap" + (post.channel ? " has-chx" : "") + (isReel ? " is-reel" : "")} ref={ref}
    style={{ background: "var(--surface-card)", borderRadius: "var(--r-md)", overflow: "hidden", padding: "0px 16px" }}>
      {post.channel && <ChannelContext channel={post.channel} />}
      <PostCard {...post} commentList={[]}
      time={post.tierTag ? <>{post.time}<TierTagChip tag={post.tierTag} /></> : post.time}
      hashtags={hideTags || post.questionnaire || post.poll ? [] : resolveHashtags(post.hashtags)}
      title={post.author === PROFINITY ? null : post.title}
      body={post.questionnaire || post.poll ? null : post.bg
        ? <div className="pf-post-bg" style={{ background: post.bg.css, color: post.bg.fg }}>
            <ClampText text={post.body} lines={6} more={post.channel ? "Learn More" : "See more"} color={post.bg.fg} />
          </div>
        : <ClampText text={post.body} more={post.channel ? "Learn More" : "See more"} />}
      media={<div className="pf-media-bleed" style={{
        ...(post.unlockBadge ? { position: "relative" } : null),
        // cancel post-wrap's 16px horizontal padding so media bleeds
        // edge-to-edge with the card instead of sitting inset
        margin: "0 -16px"
      }}>
        {post.questionnaire
        ? <Questionnaire questionnaire={post.questionnaire} />
        : post.poll
        ? <Poll poll={post.poll} />
        : post.sample
        ? <SampleMedia sample={post.sample} postId={post.id}
          saved={st.saved} onSave={onSave} onReport={() => setReportedOpen(true)} onLoveReact={handleDoubleTapLove}
          author={post.author} likes={st.likes} commentsCount={st.commentsCount} shares={st.shares} liked={st.liked}
          comments={comments} onLike={handleLike} onComment={handleComment} onShare={handleShare} />
        : (post.media && post.media.length > 0) ? <MediaCarousel images={post.media} aspect={post.aspect} onLoveReact={handleDoubleTapLove} /> : null}
        {isReel &&
        <ReelActionsRow likes={st.likes} comments={st.commentsCount} shares={st.shares}
          liked={st.liked} saved={st.saved}
          onLike={handleLike} onComment={handleComment} onShare={handleShare} onSave={onSave} />}
        {post.unlockBadge &&
        <span className="pf-unlock-badge">
            <IconifyIcon name="lucide:lock-open" size={14} color="var(--brand-navy)" />Unlocked
          </span>
        }
      </div>}
      liked={st.liked} saved={st.saved} actioned={false} likes={st.likes} shares={st.shares} comments={st.commentsCount}
      onLike={handleLike} onSave={onSave} onComment={handleComment} onShare={handleShare}
      onReport={() => setReportedOpen(true)}
      onReactionsClick={() => setLikesOpen(true)}
      onHashtagClick={goToHashtag}
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
      <div>
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
      <ReactionPicker at={picker} onPick={pick} onEnter={cancelHide} onLeave={scheduleHide} />
      {likesOpen && <LikesModal onClose={() => setLikesOpen(false)} />}
      {sheetOpen &&
      <CommentsSheet post={post} comments={comments}
      onClose={() => setSheetOpen(false)} onAddComment={onAddComment} onAddReply={onAddReply} />
      }
      {reportedOpen && <ReportedModal onClose={() => setReportedOpen(false)} />}
      {shareOpen && <ShareSheet post={post} onClose={() => setShareOpen(false)} onShare={doShare} />}
      {toast && <div className="pf-share-toast" role="status">{toast}</div>}
    </div>);

}

/* A free viewer only ever gets a short real excerpt of a locked post — long
   enough to read as genuine, short enough to carry no real value — then a
   fixed filler line stands in for "the rest", blurred, rather than leaking
   any more of the real body. */
const TEASER_BLUR_FILLER = "The full post, product mentions, and technique detail continue from here.";
function teaserExcerpt(text, max = 120) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "");
}

/* Teasers must only ever be attributed to these trusted internal accounts,
   never to the real creator — keeps paid creators' content from being used
   as free bait. Picked deterministically from the post id so a given post
   doesn't relabel itself on every re-render. */
const TEASER_NAMES = ["Alicia", "Ash", "Tim Pearce", "Miranda Pearce"];
function teaserSourceName(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return TEASER_NAMES[hash % TEASER_NAMES.length];
}

/* Locked teaser card for gated content shown to a free-tier viewer: a
   name+initials-avatar header (never the real creator's photo) and a short
   real excerpt make it read as genuine activity, then a blurred filler line
   fades into the "premium members only" paywall panel — the only action is
   "Upgrade". */
function TeaserPost({ post, onUpgrade }) {
  const meta = BUCKET_META[post.bucket] || { label: "Members only" };
  const pillColor = TEASER_PILL[post.bucket] || "var(--gray-500)";
  const cta = TEASER_CTA[post.bucket] || TEASER_CTA.confidence;
  const author = { name: teaserSourceName(post.id || post.text || ""), avatar: null, seals: null };
  const time = post.channel ? post.channel.time : post.time;
  const isCourseComment = post.bucket === "coursecomment";
  return (
    <div className="post-wrap pf-teaser"
    style={{ background: "var(--surface-card)", borderRadius: "var(--r-md)", overflow: "hidden", padding: "0px 16px" }}>
      {isCourseComment &&
      <div className="pf-teaser-activity">
          <strong>{author.name}</strong> commented in course <strong>{COURSE_NAMES[post.course] || "the course"}</strong>
        </div>
      }
      <div className="pf-teaser-head">
        <Avatar name={author.name} src={author.avatar} size={44} />
        <div className="pf-teaser-head-main">
          <div className="pf-teaser-head-name">
            <span>{author.name}</span>
            {author.seals && <VerificationSeals seals={author.seals} size={16} />}
          </div>
          <div className="pf-teaser-head-sub">
            <span>{time}</span>
            <span className="pf-teaser-pill" style={{ background: pillColor }}>{meta.label}</span>
          </div>
        </div>
      </div>
      <div className="pf-teaser-body">
        <p className="pf-teaser-visible">{teaserExcerpt(post.body)}</p>
        <div className="pf-teaser-blurwrap">
          <p className="pf-teaser-blurred">{TEASER_BLUR_FILLER}</p>
          <div className="pf-teaser-fade" />
        </div>
        <div className="pf-teaser-gate">
          <div className="pf-teaser-gate-title">This content is for premium members only.</div>
          <div className="pf-teaser-gate-sub">Upgrade your plan to view this post and access exclusive content.</div>
          <button type="button" className="pf-teaser-cta" onClick={onUpgrade}>
            <span className="pf-teaser-cta-text">
              <span className="pf-teaser-cta-title">{cta.title}</span>
              <span className="pf-teaser-cta-sub">{cta.sub}</span>
            </span>
          </button>
        </div>
      </div>
    </div>);

}

/* Upcoming Event post — the DS EventCard (banner image, title, host, date,
   CTA — same one used in RightRail's "My Events" widget) dropped straight
   into the feed as its own card, labeled so it reads as an event rather than
   a regular update. */
function FeedEventCard({ post, event }) {
  const author = post && post.author;
  return (
    <div className="post-wrap pf-event-feed" style={{ background: "transparent", overflow: "visible", padding: "0px 16px" }}>
      {author &&
      <div className="pf-teaser-head">
        <Avatar name={author.name} src={author.avatar} size={44} />
        <div className="pf-teaser-head-main">
          <div className="pf-teaser-head-name">
            <span>{author.name}</span>
            {author.seals && <VerificationSeals seals={author.seals} size={16} />}
          </div>
          {post.time && <div className="pf-teaser-head-sub"><span>{post.time}</span></div>}
        </div>
      </div>}
      <EventCard {...event} />
    </div>);

}

/* Event-registration social proof — "{Name} has registered for {Event}."
   Author header (avatar/name/seals/time) + an EVENT tag, then a linked event
   summary card (title, date · time, attendee count) with its own Register
   CTA. Distinct from FeedEventCard: that one is an editorial "upcoming
   event" post; this one narrates a specific person's registration action. */
function EventRegPostCard({ post }) {
  const author = post.author;
  const ev = post.eventReg;
  const goToEvent = () => (window.pfGo || function (u) { window.location.href = u; })("EventsWeb.html");
  return (
    <div className="post-wrap pf-event-feed"
    style={{ background: "var(--surface-card)", borderRadius: "var(--r-md)", overflow: "hidden", padding: "0px 16px" }}>
      <div className="pf-teaser-head">
        <Avatar name={author.name} src={author.avatar} size={44} />
        <div className="pf-teaser-head-main">
          <div className="pf-teaser-head-name">
            <span>{author.name}</span>
            {author.seals && <VerificationSeals seals={author.seals} size={16} />}
          </div>
          <div className="pf-teaser-head-sub"><span>{post.time}</span></div>
        </div>
      </div>
      <div className="pf-event-feed-label">
        <IconifyIcon name="lucide:calendar-check" size={14} color="var(--premium-gold-deep)" />
        <span>EVENT</span>
      </div>
      <p className="pf-event-reg-headline"><b>{author.name}</b> has registered for <b>{ev.title}</b>.</p>
      <div className="pf-event-reg-card">
        <button type="button" className="pf-event-reg-main" onClick={goToEvent}>
          <span className="pf-event-reg-title">{ev.title}</span>
          <span className="pf-event-reg-sub">{ev.date} · {ev.time}</span>
          <span className="pf-event-reg-going">{ev.going} clinicians attending</span>
        </button>
        <button type="button" className="pf-event-reg-cta" onClick={goToEvent}>Register for this event</button>
      </div>
    </div>);

}

/* Compact community-channel post — how a paid member's channel content
   (Confidence/Mastery/Freedom/Inner Circle) surfaces merged into the main
   newsfeed: avatar + name + tier tag, body, then React/Reply/Save actions.
   Deliberately lighter than FeedPost — no media carousel, no full comment
   thread — this is "a tagged post in your feed", not the full community
   thread view (that still lives on the Community screen itself). */
function ChannelFeedCard({ post, st, onToggleLike, onReact, onDoubleTapLove, onSave, onShare, onAddComment, onAddReply }) {
  const meta = BUCKET_META[post.bucket] || { label: "Community", color: "var(--gray-500)" };
  const [replying, setReplying] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reportedOpen, setReportedOpen] = useState(false);
  const liked = !!st.reaction;
  const ref = useRef(null);
  const { picker, pick, cancelHide, scheduleHide } = useReactionPicker(ref, st.reaction, onReact);
  const comments = st.comments || [];
  const handleLike = () => {
    const willReact = !st.reaction;
    onToggleLike();
    if (willReact) burstReaction(ref.current, "like");
  };
  const handleDoubleTapLove = () => {
    const willReact = !st.reaction;
    onDoubleTapLove();
    if (willReact) burstReaction(ref.current, "love");
  };
  return (
    <div className="pf-chcard" ref={ref}
    style={{ background: "var(--surface-card)", borderRadius: "var(--r-md)", padding: "16px" }}>
      <div className="pf-chcard-head">
        <Avatar name={post.channel.by} src={post.channel.byAvatar} size={40} />
        <div>
          <div className="pf-chcard-name">{post.channel.by}</div>
          <div className="pf-chcard-tags">
            <span className="pf-chcard-tag pf-inline-chan">
              {meta.label}
            </span>
            {post.unlockBadge &&
            <span className="pf-chcard-unlock">
                <IconifyIcon name="lucide:lock-open" size={12} color="var(--brand-navy)" />Unlocked
              </span>
            }
          </div>
        </div>
        <PostMoreMenu saved={st.saved} onSave={onSave} onReport={() => setReportedOpen(true)} />
      </div>
      <p className="pf-chcard-body">{post.body}</p>
      {(post.sample || post.media && post.media.length > 0) &&
      <div className="pf-chcard-media pf-media-bleed" style={{ margin: "0 -16px 14px" }}>
        {post.sample ?
        <SampleMedia sample={post.sample} postId={post.id} onLoveReact={handleDoubleTapLove}
          saved={st.saved} onSave={onSave}
          author={{ name: post.channel.by, avatar: post.channel.byAvatar }}
          likes={st.likes} commentsCount={st.commentsCount} shares={st.shares} liked={liked}
          comments={comments} onLike={handleLike} onComment={() => setReplying((r) => !r)} onShare={onShare} /> :
        <MediaCarousel images={post.media} onLoveReact={handleDoubleTapLove} />}
      </div>}
      <PostActions likes={st.likes} comments={st.commentsCount} shares={st.shares}
      liked={liked} saved={st.saved} actioned={false}
      onLike={handleLike} onComment={() => setReplying((r) => !r)} onShare={onShare} onSave={onSave}
      onReactionsClick={() => setLikesOpen(true)}
      style={{ borderTop: "1px solid var(--border-default)", paddingTop: 14 }} />
      <div>
        <LikedByRow onOpen={() => setLikesOpen(true)} />
      </div>
      {comments.length > 0 &&
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
      {replying &&
      <CommentComposer placeholder="Write a reply…" autoFocus small
      onSubmit={(t) => {onAddComment(t);setReplying(false);}} />
      }
      <ReactionPicker at={picker} onPick={pick} onEnter={cancelHide} onLeave={scheduleHide} />
      {likesOpen && <LikesModal onClose={() => setLikesOpen(false)} />}
      {sheetOpen &&
      <CommentsSheet post={post} comments={comments}
      onClose={() => setSheetOpen(false)} onAddComment={onAddComment} onAddReply={onAddReply} />
      }
      {reportedOpen && <ReportedModal onClose={() => setReportedOpen(false)} />}
    </div>);

}

/* Full (unlocked) view of a coursecomment-bucket post: another member's
   comment left on a course lesson, shown with the same "commented in
   course X" header as the locked teaser, plus a lesson-promo strip below
   the comment — doubles as a soft upsell into that lesson for anyone who
   hasn't taken it yet, or a refresher link for those who have. */
function CourseCommentCard({ post, st, onToggleLike, onReact, onSave, onAddComment, onShare }) {
  const [replying, setReplying] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [reportedOpen, setReportedOpen] = useState(false);
  const liked = !!st.reaction;
  const lesson = post.lesson;
  const ref = useRef(null);
  const { picker, pick, cancelHide, scheduleHide } = useReactionPicker(ref, st.reaction, onReact);
  const handleLike = () => {
    const willReact = !st.reaction;
    onToggleLike();
    if (willReact) burstReaction(ref.current, "like");
  };
  return (
    <div className="post-wrap pf-ccard" ref={ref}
    style={{ background: "var(--surface-card)", borderRadius: "var(--r-md)", overflow: "hidden", padding: "0px 16px" }}>
      <div className="pf-teaser-activity">
        <strong>{post.author.name}</strong> commented in course <strong>{COURSE_NAMES[post.course] || "the course"}</strong>
      </div>
      <div className="pf-ccard-head">
        <Avatar name={post.author.name} src={post.author.avatar} size={44} />
        <div className="pf-ccard-head-main">
          <div className="pf-ccard-head-name">
            <span>{post.author.name}</span>
            {post.author.seals && <VerificationSeals seals={post.author.seals} size={16} />}
          </div>
          <div className="pf-chcard-tags">
            <div className="pf-ccard-head-time">{post.time}</div>
            {post.unlockBadge &&
            <span className="pf-chcard-unlock">
                <IconifyIcon name="lucide:lock-open" size={12} color="var(--brand-navy)" />Unlocked
              </span>
            }
          </div>
        </div>
        <PostMoreMenu saved={st.saved} onSave={onSave} onReport={() => setReportedOpen(true)} />
      </div>
      <div className="pf-ccard-body"><ClampText text={post.body} lines={4} /></div>
      {lesson &&
      <a className="pf-ccard-lesson" href="MyLearning.html" onClick={(e) => { if (!window.pfGo) return; e.preventDefault(); window.pfGo("MyLearning.html"); }}>
          <div className="pf-ccard-lesson-media"><img src={lesson.image} alt="" /></div>
          <div className="pf-ccard-lesson-bar">
            <span className="pf-ccard-lesson-icon">
              <IconifyIcon name="lucide:graduation-cap" size={17} color="var(--brand-navy)" />
            </span>
            <div className="pf-ccard-lesson-text">
              <div className="pf-ccard-lesson-title">{lesson.title}</div>
              <div className="pf-ccard-lesson-sub">{lesson.sub}</div>
            </div>
            <button type="button" className="pf-ccard-lesson-cta">Learn More</button>
          </div>
        </a>
      }
      <PostActions likes={st.likes} comments={st.commentsCount} shares={st.shares}
      liked={liked} saved={st.saved} actioned={false}
      onLike={handleLike} onComment={() => setReplying((r) => !r)} onShare={onShare} onSave={onSave}
      onReactionsClick={() => setLikesOpen(true)}
      style={{ borderTop: "1px solid var(--border-default)", paddingTop: 14 }} />
      {replying &&
      <CommentComposer placeholder="Write a reply…" autoFocus small
      onSubmit={(t) => {onAddComment(t);setReplying(false);}} />
      }
      <ReactionPicker at={picker} onPick={pick} onEnter={cancelHide} onLeave={scheduleHide} />
      {likesOpen && <LikesModal onClose={() => setLikesOpen(false)} />}
      {reportedOpen && <ReportedModal onClose={() => setReportedOpen(false)} />}
    </div>);

}

/* No purchase flow exists in this prototype yet, so the CTA is a stub that
   just routes to MembershipTier.html. label/bucket describe the post that
   triggered the paywall; currentTier is the viewer's own paid tier key
   (null for a free viewer). When the viewer already pays for a lower tier
   than the one gating this post, show a "your plan vs. this tier"
   comparison instead of the generic first-time-paywall copy — a paying
   member needs to see what the higher tier actually adds, not just be told
   to "upgrade". */
function UpgradeModal({ label, bucket, currentTier, onClose }) {
  const sheetRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const target = TIER_LADDER_MAP[bucket];
  const current = currentTier && TIER_LADDER_MAP[currentTier];
  const showCompare = target && current && current.rank < target.rank;

  const goToPlans = () => (window.pfGo || function (u) {window.location.href = u;})("MembershipTier.html");

  if (!showCompare) {
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
          <button type="button" className="saved-btn" style={{ background: "var(--premium-badge)" }}
            onClick={goToPlans}>See Membership Plans</button>
          <button type="button" className="saved-skip" onClick={onClose}>Maybe Later</button>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-overlay" onClick={onClose}>
      <div className="saved-sheet" ref={sheetRef} onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={"Upgrade to " + target.name}>
        <div className="saved-handle" />
        <div className="saved-icon-wrap">
          <IconifyIcon name="lucide:gem" size={30} color="var(--premium-orange)" />
        </div>
        <div className="saved-title">Upgrade to {target.name}</div>
        <div className="saved-desc">You're already a {current.name} member — {target.name} unlocks this post plus everything below.</div>
        <div className="pf-upgrade-compare">
          <div className="pf-upgrade-tier">
            <span className="pf-upgrade-tier-dot" style={{ background: current.color }} />
            <div className="pf-upgrade-tier-name">{current.name}</div>
            <div className="pf-upgrade-tier-badge">Your plan</div>
            <ul className="pf-upgrade-tier-perks">
              {current.perks.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
          <span className="pf-upgrade-compare-arrow">
            <IconifyIcon name="lucide:arrow-right" size={18} color="var(--gray-400)" />
          </span>
          <div className="pf-upgrade-tier highlight">
            <span className="pf-upgrade-tier-dot" style={{ background: target.color }} />
            <div className="pf-upgrade-tier-name">{target.name}</div>
            <div className="pf-upgrade-tier-badge on">£397</div>
            <ul className="pf-upgrade-tier-perks">
              {target.perks.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
        <div className="saved-divider" />
        <button type="button" className="saved-btn" style={{ background: "var(--premium-badge)" }}
          onClick={goToPlans}>Upgrade to {target.name}</button>
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

const PF_USER_POSTS_KEY = "pf-newsfeed-user-posts";
function readUserPosts() {
  try {
    const list = JSON.parse(localStorage.getItem(PF_USER_POSTS_KEY)) || [];
    return list.filter((p) => p && p.author && p.author.name && p.body);
  } catch (e) { return []; }
}

/* Event-registration social proof — one seed post (Rose Lim, a fixture
   clinician) plus this session's own registrations, written by
   EventsMobile's Register Now / Join Waitlist flow to "pf-event-regs"
   ({title, date, time, going}, newest first, capped at 3). */
const PF_EVENT_REGS_KEY = "pf-event-regs";
const EVENT_REG_SEED = [
  { id: "evreg_seed1", author: { name: "Rose Lim", avatar: null, seals: ["verified"] }, time: "1d",
    eventReg: { title: "Technique Tuesday", date: EVENTS[0].date, time: EVENTS[0].time, going: "342" } },
];
function readEventRegPosts() {
  try {
    const list = JSON.parse(localStorage.getItem(PF_EVENT_REGS_KEY)) || [];
    return list.filter((r) => r && r.title).map((r, i) => ({
      id: "evreg_" + i + "_" + r.title.replace(/\s+/g, ""),
      author: { name: ME.name, avatar: ME.avatar, seals: ["gb", "verified"] },
      time: "Just now",
      eventReg: { title: r.title, date: r.date, time: r.time, going: r.going || "0" },
    }));
  } catch (e) { return []; }
}

/* All posts across the app (own + editorial + gated) — used by Search to
   find posts by hashtag. Pulls from ALL_FEED_SEQUENCE_POSTS (the union of
   every tier's sequence) rather than a single fixed FEED_SEQUENCE, since the
   newsfeed itself is now tier-aware (see TIER_FEED_SEQUENCES). */
function getAllPosts() {
  return [...readUserPosts(), ...EVENT_REG_SEED, ...readEventRegPosts(), ...ALL_FEED_SEQUENCE_POSTS, ...BUCKET_POSTS, ...TIER_TAG_POSTS];
}

/* Event-registration cards ("X people going" teasers plus the two designed
   eventReg slots per tier sequence) otherwise stack at the very top of the
   feed (seed + up to 3 of your own registrations) and repeat every cycle —
   redundant well past what a single post type should occupy. Every tier's
   feed gets the same treatment: pull eventReg posts out of their natural
   slot and re-spread them every 10-20 posts instead, keeping relative order
   for everything else untouched. Any events that don't fit that spacing
   (feed shorter than events*minGap) spill to the end rather than being
   dropped, so a registration confirmation is never silently lost. */
function spreadEventPosts(items, minGap = 10, maxGap = 20) {
  const isEvent = ({ item }) => !!item.eventReg;
  const events = items.filter(isEvent);
  const rest = items.filter((x) => !isEvent(x));
  if (!events.length) return rest;
  const gap = Math.min(maxGap, Math.max(minGap, Math.floor(rest.length / (events.length + 1)) || minGap));
  const result = [];
  let ei = 0;
  rest.forEach((it, i) => {
    result.push(it);
    if (ei < events.length && (i + 1) % gap === 0) result.push(events[ei++]);
  });
  while (ei < events.length) result.push(events[ei++]);
  return result;
}

function Feed({ channel } = {}) {
  const [userPosts, setUserPosts] = useState(() => readUserPosts());
  /* Capped at 2 (newest first): the seed plus up to 3 of your own
     registrations could otherwise pin 4 eventReg cards in a row before
     spreadEventPosts even runs — 2 is enough "you're going" social proof
     without needing more events than a 40-60 post feed can spread thinly. */
  const [eventRegPosts] = useState(() => [...EVENT_REG_SEED, ...readEventRegPosts()].slice(0, 2));
  const [state, setState] = useState(() => {
    const m = {};
    /* Seeded from the union of every tier's sequence (not just the one the
       current viewer sees) so switching tiers via the live persona-preview
       switcher never leaves a post with no interaction state. */
    [...readUserPosts(), ...ALL_FEED_SEQUENCE_POSTS, ...BUCKET_POSTS, ...TIER_TAG_POSTS].forEach((p) => {m[p.id] = { liked: false, saved: false, actioned: p.actioned, likes: p.likes, base: p.likes, reaction: null, shares: p.shares, sharesBase: p.shares, comments: withIds(p.commentList), commentsCount: p.comments };});
    return m;
  });
  /* Defaults to whatever tier is actually persisted (set for real by the
     checkout/apply flows, or overridden here by the dev preview switcher —
     either way both write the same localStorage key, so newsfeed, community
     and the membership page all agree on "who's looking"). */
  const [viewerPersona, setViewerPersonaRaw] = useState(getUserTier);
  const setViewerPersona = (key) => { setUserTier(key); setViewerPersonaRaw(key); };
  const [bucketToggles, setBucketToggles] = useState({ course: false, save: false, mute: false });
  const [upgradeFor, setUpgradeFor] = useState(null);
  const saveFlow = useSaveFlow();

  const toggle = (id, key) => setState((s) => ({ ...s, [id]: { ...s[id], [key]: !s[id][key] } }));
  const toggleSave = (id) => {
    const willSave = !state[id].saved;
    toggle(id, "saved");
    if (willSave) saveFlow.notifySaved();else saveFlow.notifyUnsaved();
  };

  /* Composer submits straight into the feed — same post shape + localStorage
     key ("pf-newsfeed-user-posts") that CreatePostMobile writes, so posts
     made from either surface show up on both. */
  const addPost = ({ body, media }) => {
    const post = { id: "u" + Date.now(), author: { name: ME.name, avatar: ME.avatar, seals: ["gb", "verified"] },
      time: "Just now", body, media: media || [], likes: "0", comments: "0", shares: "0", commentList: [] };
    try { localStorage.setItem(PF_USER_POSTS_KEY, JSON.stringify([post, ...readUserPosts()])); } catch (e) {}
    setUserPosts((list) => [post, ...list]);
    setState((s) => ({ ...s, [post.id]: { liked: false, saved: false, actioned: post.actioned, likes: post.likes, base: post.likes, reaction: null, shares: post.shares, sharesBase: post.shares, comments: withIds(post.commentList), commentsCount: post.comments } }));
  };

  const viewerCurrent = PERSONA_MAP[viewerPersona] || PERSONA_MAP.confidence;
  const bucketResolved = resolveBucketFeed(viewerPersona, bucketToggles);
  /* Tier-tagged posts stack with the membership ladder: each tier sees its
     own tag plus every tag below it (see tierTagPostsFor). */
  const tierTagItems = tierTagPostsFor(viewerPersona).map((p) => ({ item: p, mode: "full" }));

  /* The main newsfeed is tier-aware: TIER_FEED_SEQUENCES picks the designed
     post-type sequence for the current viewer (see cycleSlots() and
     FREE/CONFIDENCE/MASTERY_FEED_SEQUENCE above) — any locally composed
     posts show up first, then that sequence plays out exactly as authored.
     Each sequence carries its own two paywall Lock slots (teasing the next
     tier up, then the tier after that); Freedom/Inner Circle/Admin viewers
     get the Mastery sequence, since its Lock slots resolve to "full" for
     them automatically once their channels include that bucket. */
  const rawSequence = TIER_FEED_SEQUENCES[viewerPersona] || FREE_FEED_SEQUENCE;
  const sequenceBase = typeof window !== "undefined" && window.PF_OFFICIAL_ONLY ? officialize(rawSequence) : rawSequence;
  /* Every deliberate Lock slot renders its own teaser when the viewer
     doesn't hold that tier — each tier's sequence has exactly two Lock
     posts by design (first cycle + repeat cycle), so no single-teaser cap
     is needed here the way the old random Hidden Post rotation required. */
  /* eventReg posts (top-pinned social proof + each tier sequence's two
     designed slots) are re-spread to a ~1-in-10-to-20 cadence by
     spreadEventPosts below, rather than left to stack at the top and repeat
     every cycle — see its comment for why. */
  const feedItems = spreadEventPosts([
  { item: SAMPLE_LONG_TEXT_POST, mode: "full" },
  ...userPosts.map((p) => ({ item: p, mode: "full" })),
  ...eventRegPosts.map((p) => ({ item: p, mode: "full" })),
  ...tierTagItems,
  ...sequenceBase.map((p) => {
    if (p.bucket && TEASABLE_BUCKETS.has(p.bucket)) {
      const unlocked = viewerCurrent.admin ||
      (p.bucket === "course" || p.bucket === "coursecomment" ?
      viewerCurrent.paid :
      viewerCurrent.channels.includes(p.bucket));
      if (unlocked) return { item: { ...p, unlockBadge: true }, mode: "full" };
      return { item: p, mode: "teaser" };
    }
    return { item: p, mode: "full" };
  })]);

  /* a channel (Confidence/Mastery/Freedom/Inner Circle) narrows the feed
     down to just that bucket's posts — used by the Community page's channel
     switcher so picking "Mastery" shows only Mastery posts, etc. Access
     still runs through resolveBucketFeed, so a channel the viewer hasn't
     unlocked renders its normal teaser/upgrade card instead of the post. */
  const visibleFeedItems = channel ?
  bucketResolved.filter(({ item: p }) => p.bucket === channel) :
  feedItems;

  return (
    <main className="feed" data-screen-label="Home feed">
      {!channel && !window.PF_EMBED && <PostComposer onPost={addPost} />}
      {!channel &&
      <FeedPreviewPanel persona={viewerPersona} onPersona={setViewerPersona}
      toggles={bucketToggles} onToggle={(k, v) => setBucketToggles((t) => ({ ...t, [k]: v }))} />
      }
      {visibleFeedItems.map(({ item: p, mode }) => {
        if (mode === "teaser") {
          return <TeaserPost key={p.id} post={p} onUpgrade={() => setUpgradeFor(p)} />;
        }
        if (p.eventReg) {
          return <EventRegPostCard key={p.id} post={p} />;
        }
        if (p.eventData) {
          return <FeedEventCard key={p.id} post={p} event={p.eventData} />;
        }
        const st = state[p.id] || {};
        const onToggleLike = () => setState((s) => {
          const cur = s[p.id];
          const reaction = cur.reaction ? null : "like";
          return { ...s, [p.id]: { ...cur, reaction, liked: !!reaction, likes: reaction ? bump(cur.base) : cur.base } };
        });
        const onAddComment = (text) => setState((s) => {
          const cur = s[p.id];
          const c = { _id: "c" + Date.now(), author: { name: ME.name, avatar: ME.avatar, seals: ["gb", "verified"] }, text, replies: [] };
          return { ...s, [p.id]: { ...cur, comments: [c, ...cur.comments], commentsCount: bump(cur.commentsCount) } };
        });
        const setReaction = (key) => setState((s) => {
          const cur = s[p.id];
          const reaction = cur.reaction === key ? null : key;
          return { ...s, [p.id]: { ...cur, reaction, liked: !!reaction, likes: reaction ? bump(cur.base) : cur.base } };
        });
        /* Instagram-style double-tap-to-love: always lands on Love, never
           toggles it back off (unlike the single-tap Like button above). */
        const onDoubleTapLove = () => setState((s) => {
          const cur = s[p.id];
          if (cur.reaction) return s;
          return { ...s, [p.id]: { ...cur, reaction: "love", liked: true, likes: bump(cur.base) } };
        });
        /* community-channel content (Confidence/Mastery/Freedom/Inner Circle)
           merges into this same paid newsfeed, just tagged with its channel —
           not split into a separate surface — so it gets the compact card. */
        if (p.channel) {
          return (
            <ChannelFeedCard key={p.id} post={p} st={st}
            onToggleLike={onToggleLike} onReact={setReaction} onDoubleTapLove={onDoubleTapLove} onAddComment={onAddComment}
            onAddReply={(cid, text) => setState((s) => {
              const cur = s[p.id];
              const comments = cur.comments.map((c) => c._id === cid ?
              { ...c, replies: [...(c.replies || []), { author: { name: ME.name, avatar: ME.avatar, seals: ["gb", "verified"] }, text }] } :
              c);
              return { ...s, [p.id]: { ...cur, comments, commentsCount: bump(cur.commentsCount) } };
            })}
            onSave={() => toggleSave(p.id)}
            onShare={() => setState((s) => {
              const cur = s[p.id];
              return { ...s, [p.id]: { ...cur, shares: bump(cur.sharesBase) } };
            })} />);

        }
        if (p.bucket === "coursecomment") {
          return (
            <CourseCommentCard key={p.id} post={p} st={st}
            onToggleLike={onToggleLike} onReact={setReaction} onAddComment={onAddComment}
            onSave={() => toggleSave(p.id)}
            onShare={() => setState((s) => {
              const cur = s[p.id];
              return { ...s, [p.id]: { ...cur, shares: bump(cur.sharesBase) } };
            })} />);

        }
        return (
          <FeedPost key={p.id} post={p} st={st}
          onToggleLike={onToggleLike}
          onReact={setReaction}
          onDoubleTapLove={onDoubleTapLove}
          onAddComment={onAddComment}
          onAddReply={(cid, text) => setState((s) => {
            const cur = s[p.id];
            const comments = cur.comments.map((c) => c._id === cid ?
            { ...c, replies: [...(c.replies || []), { author: { name: ME.name, avatar: ME.avatar, seals: ["gb", "verified"] }, text }] } :
            c);
            return { ...s, [p.id]: { ...cur, comments, commentsCount: bump(cur.commentsCount) } };
          })}
          onShare={(caption) => {
            setState((s) => {
              const cur = s[p.id];
              return { ...s, [p.id]: { ...cur, shares: bump(cur.sharesBase) } };
            });
            if (caption) addPost({ body: caption });
          }}
          onSave={() => toggleSave(p.id)} />);


      })}
      {upgradeFor &&
      <UpgradeModal label={(BUCKET_META[upgradeFor.bucket] || {}).label}
      bucket={upgradeFor.bucket}
      currentTier={viewerCurrent.paid && !viewerCurrent.admin ? viewerPersona : null}
      onClose={() => setUpgradeFor(null)} />
      }
      <SaveFlowUI flow={saveFlow} />
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
    <div className="app wa-screen"
    style={{
      "--action-primary": t.accent,
      "--action-primary-hover": "color-mix(in srgb, " + t.accent + ", var(--black) 12%)",
      "--r-md": t.radius + "px",
      "--feed-w": t.feedWidth + "px"
    }}>
      {!window.PF_EMBED && <TopNav active="Home" user={ME} logoSrc="assets/profinity-icon-purple-gold.png"
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
   duplicating the reaction/comment logic. CommentComposer + ReactTrigger are
   exposed so standalone pages (e.g. lesson detail) get the same comment
   composer + Like control instead of rebuilding them. */
window.PFApp = { Feed, EVENTS, ME, smNextTier, smIncludedTiers, pfTagActiveNav, LeftRail, RightRail, getAllPosts, CommentComposer, ReactTrigger, getUserTier, setUserTier, readEventRegPosts };

if (!window.PF_EMBED) {
  ReactDOM.createRoot(document.getElementById("pf-root")).render(<App />);
}