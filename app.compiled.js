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
    var DEFAULT_HASHTAGS = [{
      slug: "case-study",
      label: "Case Study",
      icon: "lucide:chart-pie"
    }, {
      slug: "protocol",
      label: "Protocol",
      icon: "lucide:clipboard-list"
    }, {
      slug: "discussion",
      label: "Discussion",
      icon: "lucide:message-circle"
    }, {
      slug: "community",
      label: "Community",
      icon: "lucide:users"
    }, {
      slug: "masterclass",
      label: "Masterclass",
      icon: "lucide:play"
    }, {
      slug: "reel",
      label: "Reel",
      icon: "lucide:smartphone"
    }, {
      slug: "update",
      label: "Update",
      icon: "lucide:message-circle"
    }, {
      slug: "business",
      label: "Business",
      icon: "lucide:briefcase"
    }, {
      slug: "anatomy",
      label: "Anatomy",
      icon: "lucide:activity"
    }, {
      slug: "course",
      label: "Course",
      icon: "lucide:graduation-cap"
    }, {
      slug: "patient",
      label: "Patient",
      icon: "lucide:user"
    }, {
      slug: "clinic",
      label: "Clinic",
      icon: "lucide:stethoscope"
    }, {
      slug: "profinity",
      label: "Profinity",
      icon: "lucide:sparkles"
    }, {
      slug: "healthcare",
      label: "Healthcare",
      icon: "lucide:heart-pulse"
    }, {
      slug: "mastery",
      label: "Mastery",
      icon: "lucide:award"
    }, {
      slug: "freedom",
      label: "Freedom",
      icon: "lucide:trending-up"
    }, {
      slug: "confidence",
      label: "Confidence",
      icon: "lucide:users"
    }, {
      slug: "inner-circle",
      label: "Inner Circle",
      icon: "lucide:gem"
    }, {
      slug: "learning",
      label: "Learning",
      icon: "lucide:bookmark"
    }];
    function slugify(label) {
      return String(label || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
    function readRaw() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        return null;
      }
    }
    function writeRaw(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
    }
    function getAll() {
      var list = readRaw();
      if (!list) {
        list = DEFAULT_HASHTAGS.slice();
        writeRaw(list);
      }
      return list;
    }
    function add(tag) {
      var label = (tag && tag.label || "").trim();
      if (!label) return getAll();
      var slug = slugify(label);
      if (!slug) return getAll();
      var list = getAll();
      if (list.some(function (t) {
        return t.slug === slug;
      })) return list;
      list = list.concat([{
        slug: slug,
        label: label,
        icon: tag && tag.icon || "lucide:hash"
      }]);
      writeRaw(list);
      return list;
    }
    function remove(slug) {
      var list = getAll().filter(function (t) {
        return t.slug !== slug;
      });
      writeRaw(list);
      return list;
    }
    function bySlug(slug) {
      return getAll().filter(function (t) {
        return t.slug === slug;
      })[0] || null;
    }
    window.PFHashtags = {
      DEFAULT_HASHTAGS: DEFAULT_HASHTAGS,
      getAll: getAll,
      add: add,
      remove: remove,
      bySlug: bySlug,
      slugify: slugify
    };
  })();
}
const {
  useState,
  useRef,
  useEffect,
  useLayoutEffect
} = React;
const DS = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav,
  PostCard,
  EventCard,
  MembershipCard,
  ChannelItem,
  Card,
  Avatar,
  Button,
  Icon,
  IconifyIcon,
  VerificationSeals,
  StatGroup,
  CommentItem,
  PostActions
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
  p5img10: "assets/post5-img10.png"
};

/* ============================ DATA ======================================= */
const ME = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
const TIM = {
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  seals: ["gb", "gold", "verified", "crown"]
};
const MIRANDA = {
  name: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  seals: ["gb", "verified", "gold"]
};

/* Official Profinity Academy account — the sole author when PF_OFFICIAL_ONLY
   is set (the Home / Newsfeed surfaces). */
const PROFINITY = {
  name: "Profinity",
  avatar: "assets/profinity-icon.jpg",
  seals: ["verified"]
};
function officialize(list) {
  return list.map(p => p.channel ? p : {
    ...p,
    author: PROFINITY,
    withOthers: null
  });
}

/* Every item below carries a bucket + access:"gated" — the same routing
   model as the architecture guide: a free viewer only ever sees the
   editorial POSTS in full; everything here resolves against the current
   preview persona + their bucket toggles (see resolveBucketFeed). */
const CHANNEL_POST = {
  id: "ch1",
  access: "gated",
  bucket: "confidence",
  author: {
    name: "Dr. Sarah Collins",
    avatar: "assets/avatar-sarah-collins.jpg",
    seals: ["gb", "verified", "skinfluencer"]
  },
  channel: {
    name: "#Confidence · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr. Sarah Collins",
    byAvatar: "assets/avatar-sarah-collins.jpg",
    time: "2d"
  },
  time: "2 Days Ago",
  hashtags: ["confidence", "community"],
  media: [IMG.communityPoster],
  body: "Just shared my first lip-correction case in the Confidence channel — the support here is unreal. If you're nervous about posting your work, this is the place to start. 💜",
  likes: "842",
  comments: "96",
  shares: "40",
  actioned: false,
  commentList: [{
    author: {
      name: "Phoenix Baker",
      seals: ["gb", "verified"]
    },
    text: "Welcome! This is exactly what the channel is for. 🙌",
    likes: "120",
    comments: "8",
    time: "2d",
    pills: [{
      k: "like",
      n: "20"
    }, {
      k: "love",
      n: "6"
    }],
    reactions: ["like", "love"],
    reactionCount: "120"
  }, {
    author: {
      name: "Luna Chen"
    },
    text: "Beautiful result — thanks for being brave enough to share!",
    likes: "64",
    comments: "3",
    time: "1d",
    pills: [{
      k: "like",
      n: "9"
    }],
    reactions: ["like"],
    reactionCount: "64"
  }]
};
const MASTERY_POST = {
  id: "ch2",
  access: "gated",
  bucket: "mastery",
  author: {
    name: "Priya Shah",
    avatar: "assets/avatar-priya-shah.jpg",
    seals: ["gb"]
  },
  channel: {
    name: "#Mastery · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Priya Shah",
    byAvatar: "assets/avatar-priya-shah.jpg",
    time: "5h"
  },
  time: "5 Hours Ago",
  hashtags: ["mastery", "anatomy"],
  body: "Cannula vs needle for the tear trough — here's the decision tree I actually use chairside.",
  likes: "64",
  comments: "12",
  shares: "4",
  actioned: false,
  commentList: []
};
const FREEDOM_POST = {
  id: "ch3",
  access: "gated",
  bucket: "freedom",
  author: {
    name: "Dr Amir Khan",
    avatar: "assets/avatar-amir-khan.jpg",
    seals: ["gb", "verified"]
  },
  channel: {
    name: "#Freedom · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Amir Khan",
    byAvatar: "assets/avatar-amir-khan.jpg",
    time: "1d"
  },
  time: "1 Day Ago",
  hashtags: ["freedom", "business"],
  body: "How I went from one chair to three clinics in 18 months — the hiring order that mattered.",
  likes: "110",
  comments: "18",
  shares: "9",
  actioned: false,
  commentList: []
};
const INNER_POST = {
  id: "ch4",
  access: "gated",
  bucket: "inner",
  author: {
    name: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    seals: ["gb", "gold", "verified", "crown"]
  },
  channel: {
    name: "#Inner Circle · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Tim Pearce",
    byAvatar: "assets/avatar-drtim.png",
    time: "3d"
  },
  time: "3 Days Ago",
  hashtags: ["inner-circle", "business"],
  body: "Inner Circle only: the exact deal structure behind my last clinic acquisition.",
  likes: "212",
  comments: "31",
  shares: "14",
  actioned: false,
  commentList: []
};

/* Extra channel posts — four more per bucket so each of the four paid
   channels (Confidence/Mastery/Freedom/Inner Circle) shows five posts. */
const CONFIDENCE_POST_2 = {
  id: "ch5",
  access: "gated",
  bucket: "confidence",
  author: {
    name: "Nurse Beth",
    avatar: "assets/avatar-nurse-beth.jpg"
  },
  channel: {
    name: "#Confidence · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Nurse Beth",
    byAvatar: "assets/avatar-nurse-beth.jpg",
    time: "6h"
  },
  time: "6 Hours Ago",
  hashtags: ["confidence", "firstcase"],
  body: "Posted my first toxin case here last week and the feedback genuinely changed how I show up with patients. Do it scared. 💪",
  likes: "301",
  comments: "44",
  shares: "12",
  actioned: false,
  commentList: []
};
const CONFIDENCE_POST_3 = {
  id: "ch6",
  access: "gated",
  bucket: "confidence",
  author: {
    name: "Mark Ellis",
    avatar: "assets/avatar-mark-ellis.jpg",
    seals: ["skinfluencer"]
  },
  channel: {
    name: "#Confidence · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Mark Ellis",
    byAvatar: "assets/avatar-mark-ellis.jpg",
    time: "9h"
  },
  time: "9 Hours Ago",
  hashtags: ["confidence", "mindset"],
  body: "Anyone else get more nervous posting in here than actually doing the treatment? Curious how long that takes to fade.",
  likes: "88",
  comments: "27",
  shares: "3",
  actioned: false,
  commentList: []
};
const CONFIDENCE_POST_4 = {
  id: "ch7",
  access: "gated",
  bucket: "confidence",
  author: {
    name: "Jade Osei"
  },
  channel: {
    name: "#Confidence · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Jade Osei",
    time: "1d"
  },
  time: "1 Day Ago",
  hashtags: ["confidence", "imposter-syndrome"],
  body: "Two years qualified and still feel like I'm winging it half the time. This channel is the only place I say that out loud.",
  likes: "156",
  comments: "38",
  shares: "6",
  actioned: false,
  commentList: []
};
const CONFIDENCE_POST_5 = {
  id: "ch8",
  access: "gated",
  bucket: "confidence",
  author: {
    name: "Dr. Sarah Collins",
    avatar: "assets/avatar-sarah-collins.jpg",
    seals: ["gb", "verified", "skinfluencer"]
  },
  channel: {
    name: "#Confidence · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr. Sarah Collins",
    byAvatar: "assets/avatar-sarah-collins.jpg",
    time: "2d"
  },
  time: "2 Days Ago",
  hashtags: ["confidence", "wins"],
  body: "Small win: a nervous first-time patient today told me she picked me because my page felt honest, not perfect. That's the whole point of showing the real work.",
  likes: "204",
  comments: "19",
  shares: "8",
  actioned: false,
  commentList: []
};
const MASTERY_POST_2 = {
  id: "ch9",
  access: "gated",
  bucket: "mastery",
  author: {
    name: "Dr Amir Khan",
    avatar: "assets/avatar-amir-khan.jpg",
    seals: ["gb", "verified"]
  },
  channel: {
    name: "#Mastery · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Amir Khan",
    byAvatar: "assets/avatar-amir-khan.jpg",
    time: "8h"
  },
  time: "8 Hours Ago",
  hashtags: ["mastery", "toxin"],
  body: "Masseter dosing chart I actually use — split by facial width and bite strength, not just weight. Posting the table below.",
  likes: "97",
  comments: "21",
  shares: "11",
  actioned: false,
  commentList: []
};
const MASTERY_POST_3 = {
  id: "ch10",
  access: "gated",
  bucket: "mastery",
  author: {
    name: "Dr Owen Clarke"
  },
  channel: {
    name: "#Mastery · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Owen Clarke",
    time: "1d"
  },
  time: "1 Day Ago",
  hashtags: ["mastery", "anatomy"],
  body: "Reminder from this week's cadaver lab: the danger zone for the temporal artery is closer to the brow than most training courses show.",
  likes: "142",
  comments: "26",
  shares: "19",
  actioned: false,
  commentList: []
};
const MASTERY_POST_4 = {
  id: "ch11",
  access: "gated",
  bucket: "mastery",
  author: {
    name: "Priya Shah",
    avatar: "assets/avatar-priya-shah.jpg",
    seals: ["gb"]
  },
  channel: {
    name: "#Mastery · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Priya Shah",
    byAvatar: "assets/avatar-priya-shah.jpg",
    time: "2d"
  },
  time: "2 Days Ago",
  hashtags: ["mastery", "filler"],
  body: "Jawline filler placement question for the group: how many of you are going supraperiosteal along the mandible versus subcutaneous for definition?",
  likes: "76",
  comments: "33",
  shares: "5",
  actioned: false,
  commentList: []
};
const MASTERY_POST_5 = {
  id: "ch12",
  access: "gated",
  bucket: "mastery",
  author: {
    name: "Nurse Beth",
    avatar: "assets/avatar-nurse-beth.jpg"
  },
  channel: {
    name: "#Mastery · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Nurse Beth",
    byAvatar: "assets/avatar-nurse-beth.jpg",
    time: "3d"
  },
  time: "3 Days Ago",
  hashtags: ["mastery", "technique"],
  body: "Switched to cannula for the whole tear trough after last month's discussion here — zero bruising on all six patients since. Thank you all.",
  likes: "189",
  comments: "24",
  shares: "15",
  actioned: false,
  commentList: []
};
const FREEDOM_POST_2 = {
  id: "ch13",
  access: "gated",
  bucket: "freedom",
  author: {
    name: "Dr Rachel Voss"
  },
  channel: {
    name: "#Freedom · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Rachel Voss",
    time: "5h"
  },
  time: "5 Hours Ago",
  hashtags: ["freedom", "hiring"],
  body: "Hired my first associate injector this month. The interview question that told me the most: \"walk me through a complication you caused.\"",
  likes: "134",
  comments: "22",
  shares: "9",
  actioned: false,
  commentList: []
};
const FREEDOM_POST_3 = {
  id: "ch14",
  access: "gated",
  bucket: "freedom",
  author: {
    name: "Mark Ellis",
    avatar: "assets/avatar-mark-ellis.jpg",
    seals: ["skinfluencer"]
  },
  channel: {
    name: "#Freedom · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Mark Ellis",
    byAvatar: "assets/avatar-mark-ellis.jpg",
    time: "1d"
  },
  time: "1 Day Ago",
  hashtags: ["freedom", "marketing"],
  body: "Rebuilt my booking funnel around a single lead magnet — consult bookings up 40% in three weeks. Happy to share the exact sequence.",
  likes: "167",
  comments: "29",
  shares: "21",
  actioned: false,
  commentList: []
};
const FREEDOM_POST_4 = {
  id: "ch15",
  access: "gated",
  bucket: "freedom",
  author: {
    name: "Leo Martins"
  },
  channel: {
    name: "#Freedom · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Leo Martins",
    time: "2d"
  },
  time: "2 Days Ago",
  hashtags: ["freedom", "clinic"],
  body: "Just signed a second lease. The break clause negotiation alone saved me more than a year's rent if things go sideways — ask for it every time.",
  likes: "92",
  comments: "16",
  shares: "7",
  actioned: false,
  commentList: []
};
const FREEDOM_POST_5 = {
  id: "ch16",
  access: "gated",
  bucket: "freedom",
  author: {
    name: "Dr Amir Khan",
    avatar: "assets/avatar-amir-khan.jpg",
    seals: ["gb", "verified"]
  },
  channel: {
    name: "#Freedom · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Amir Khan",
    byAvatar: "assets/avatar-amir-khan.jpg",
    time: "3d"
  },
  time: "3 Days Ago",
  hashtags: ["freedom", "pricing"],
  body: "Raised prices 15% across the board this quarter with zero cancellations. The scripts I gave reception for handling the conversation made the difference.",
  likes: "148",
  comments: "25",
  shares: "13",
  actioned: false,
  commentList: []
};
const INNER_POST_2 = {
  id: "ch17",
  access: "gated",
  bucket: "inner",
  author: {
    name: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    seals: ["gb", "gold", "verified", "crown"]
  },
  channel: {
    name: "#Inner Circle · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Tim Pearce",
    byAvatar: "assets/avatar-drtim.png",
    time: "7h"
  },
  time: "7 Hours Ago",
  hashtags: ["inner-circle", "mentorship"],
  body: "Opened up two more seats in this quarter's mentorship cohort for Inner Circle members only. Comment below if you want the details.",
  likes: "176",
  comments: "40",
  shares: "10",
  actioned: false,
  commentList: []
};
const INNER_POST_3 = {
  id: "ch18",
  access: "gated",
  bucket: "inner",
  author: {
    name: "Dr Naomi Reyes"
  },
  channel: {
    name: "#Inner Circle · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Naomi Reyes",
    time: "1d"
  },
  time: "1 Day Ago",
  hashtags: ["inner-circle", "exit"],
  body: "Closed the exit on my four-clinic group last month. Happy to break down the valuation multiple we actually landed on versus what the broker first quoted.",
  likes: "263",
  comments: "52",
  shares: "22",
  actioned: false,
  commentList: []
};
const INNER_POST_4 = {
  id: "ch19",
  access: "gated",
  bucket: "inner",
  author: {
    name: "James Whitfield"
  },
  channel: {
    name: "#Inner Circle · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "James Whitfield",
    time: "2d"
  },
  time: "2 Days Ago",
  hashtags: ["inner-circle", "investment"],
  body: "Notes from the private roundtable last week: two of the PE-backed groups in the room are already pausing new-site acquisitions for next year.",
  likes: "198",
  comments: "34",
  shares: "17",
  actioned: false,
  commentList: []
};
const INNER_POST_5 = {
  id: "ch20",
  access: "gated",
  bucket: "inner",
  author: {
    name: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    seals: ["gb", "gold", "verified", "crown"]
  },
  channel: {
    name: "#Inner Circle · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr Tim Pearce",
    byAvatar: "assets/avatar-drtim.png",
    time: "4d"
  },
  time: "4 Days Ago",
  hashtags: ["inner-circle", "business"],
  body: "The real reason most acquisitions fail isn't the price — it's the 90 days after completion. Breaking down our integration checklist at next month's roundtable.",
  likes: "231",
  comments: "29",
  shares: "18",
  actioned: false,
  commentList: []
};
const COURSE_POST = {
  id: "crs1",
  access: "gated",
  bucket: "course",
  course: "protox",
  author: {
    name: "Profinity",
    avatar: "assets/profinity-icon.jpg"
  },
  time: "Just now",
  hashtags: ["course", "protocol"],
  body: "New in your PROTOX course — Module 3: Advanced cannula control for the mid-face.",
  likes: "38",
  comments: "6",
  shares: "2",
  actioned: false,
  commentList: []
};
const COURSE_COMMENT = {
  id: "crs2",
  access: "gated",
  bucket: "coursecomment",
  course: "protox",
  author: {
    name: "Nurse Beth",
    avatar: "assets/avatar-nurse-beth.jpg"
  },
  time: "2 Hours Ago",
  hashtags: ["course", "discussion"],
  body: "This finally made cannula depth click for me — thank you!",
  likes: "22",
  comments: "3",
  shares: "0",
  actioned: false,
  commentList: []
};

/* Social-proof upsell: another buyer's real-sounding lesson comment paired
   with a lesson-promo strip, so it reads as course activity while also
   nudging viewers who haven't bought/finished the course toward it. */
const COURSE_COMMENT_2 = {
  id: "crs3",
  access: "gated",
  bucket: "coursecomment",
  course: "protox",
  author: {
    name: "Jeniffer R",
    avatar: "assets/avatar-miranda.jpg",
    seals: ["gb", "verified", "crown", "gold"]
  },
  time: "1 Hour Ago",
  hashtags: ["course", "discussion"],
  body: "This finally made cannula depth and layering click for me — I tried the tear trough, cheekbone and jawline sequence chairside today and saw a real jump in patient satisfaction. Thank you Dr. Tim!",
  lesson: {
    title: "Full-Face Rejuvenation Protocol",
    sub: "PROTOX Course · Module 4 · Lesson 2",
    image: IMG.p1img1
  },
  likes: "31",
  comments: "5",
  shares: "0",
  actioned: false,
  commentList: []
};
const MYLEARNING_POST = {
  id: "ml1",
  access: "gated",
  bucket: "mylearning",
  author: {
    name: "You",
    avatar: ME.avatar
  },
  time: "Just now",
  hashtags: ["learning"],
  body: "You saved: “The 7-point liquid facelift, explained”.",
  likes: "0",
  comments: "0",
  shares: "0",
  actioned: false,
  commentList: []
};
const GENERAL_MARK_POST = {
  id: "gm1",
  access: "gated",
  bucket: "general",
  from: "mark",
  author: {
    name: "Mark Ellis",
    avatar: "assets/avatar-mark-ellis.jpg",
    seals: ["skinfluencer"]
  },
  time: "6 Hours Ago",
  hashtags: ["community", "discussion"],
  body: "Anyone else get butterflies before a big case day? How do you settle the nerves?",
  likes: "56",
  comments: "14",
  shares: "1",
  actioned: false,
  commentList: []
};
const FOLLOWSAVE_AMIR_POST = {
  id: "fs1",
  access: "gated",
  bucket: "followsave",
  from: "amir",
  author: {
    name: "Dr Amir Khan",
    avatar: "assets/avatar-amir-khan.jpg",
    seals: ["gb", "verified", "skinfluencer"]
  },
  time: "4 Hours Ago",
  hashtags: ["learning", "community"],
  body: "saved “Managing vascular occlusion, step by step” to their learning.",
  likes: "9",
  comments: "0",
  shares: "0",
  actioned: false,
  commentList: []
};

/* The full pool of gated bucket content the preview panel routes between —
   order here is the order it appears once resolved into the feed. */
const BUCKET_POSTS = [CHANNEL_POST, CONFIDENCE_POST_2, CONFIDENCE_POST_3, CONFIDENCE_POST_4, CONFIDENCE_POST_5, MASTERY_POST, MASTERY_POST_2, MASTERY_POST_3, MASTERY_POST_4, MASTERY_POST_5, FREEDOM_POST, FREEDOM_POST_2, FREEDOM_POST_3, FREEDOM_POST_4, FREEDOM_POST_5, INNER_POST, INNER_POST_2, INNER_POST_3, INNER_POST_4, INNER_POST_5, COURSE_POST, COURSE_COMMENT, COURSE_COMMENT_2, GENERAL_MARK_POST, FOLLOWSAVE_AMIR_POST, MYLEARNING_POST];

/* Bucket types a free viewer is shown as a locked teaser (see
   resolveBucketFeed) — every paid channel plus course discussion
   (coursecomment) reads as genuine activity worth upselling.
   followsave and a viewer's own saves (mylearning) are simply omitted —
   they don't make a useful upsell tease. */
const TEASABLE_BUCKETS = new Set(["confidence", "mastery", "freedom", "inner", "course", "coursecomment", "general"]);

/* Human label + accent used on a locked teaser's badge. */
const BUCKET_META = {
  confidence: {
    label: "Confidence",
    color: "var(--info)"
  },
  mastery: {
    label: "Mastery",
    color: "var(--level-intermediate)"
  },
  freedom: {
    label: "Freedom",
    color: "var(--ai-purple)"
  },
  inner: {
    label: "Inner Circle",
    color: "var(--premium-gold-deep)"
  },
  course: {
    label: "Course",
    color: "var(--success)"
  },
  coursecomment: {
    label: "Course",
    color: "var(--success)"
  },
  general: {
    label: "General",
    color: "var(--gray-500)"
  },
  followsave: {
    label: "Activity",
    color: "var(--gray-500)"
  },
  mylearning: {
    label: "My Learning",
    color: "var(--premium-orange)"
  }
};

/* Solid pill background per bucket for the locked-teaser header tag —
   distinct from BUCKET_META's border-accent color, used elsewhere. */
const TEASER_PILL = {
  confidence: "var(--brand-navy)",
  mastery: "var(--level-intermediate)",
  freedom: "var(--ai-purple)",
  inner: "var(--brand-navy-900)",
  course: "var(--success)",
  coursecomment: "var(--success)",
  general: "var(--gray-500)"
};

/* CTA copy on a locked teaser's upgrade button — course discussion only
   needs base membership to join in, so it upsells the entry Confidence
   tier rather than the course purchase itself. */
const TEASER_CTA = {
  confidence: {
    title: "Unlock Confidence",
    sub: "Join the expert network"
  },
  mastery: {
    title: "Upgrade to unlock Mastery",
    sub: "Elite mentorship & networking"
  },
  freedom: {
    title: "Upgrade to unlock Freedom",
    sub: "The Freedom Path — for the injector ready to build a business, not just a skill set."
  },
  inner: {
    title: "Upgrade to unlock Inner Circle",
    sub: "Join the top-tier roundtable and mentorship"
  },
  course: {
    title: "Unlock Confidence",
    sub: "Join the expert network"
  },
  coursecomment: {
    title: "Unlock Confidence",
    sub: "Join the expert network"
  },
  general: {
    title: "Unlock Confidence",
    sub: "Join the expert network"
  }
};

/* The channel ladder in order — each tier includes everything below it.
   Used by UpgradeModal to show a "your plan vs. this tier" comparison when
   the viewer already holds a paid tier lower than the one gating a post,
   instead of the generic first-time-paywall copy. */
const TIER_LADDER = [{
  key: "confidence",
  name: "Confidence",
  color: "var(--info)",
  perks: ["Expert network & community feed", "Confidence channel discussions"]
}, {
  key: "mastery",
  name: "Mastery",
  color: "var(--level-intermediate)",
  perks: ["Elite mentorship & networking", "Mastery channel discussions"]
}, {
  key: "freedom",
  name: "Freedom",
  color: "var(--ai-purple)",
  perks: ["Build a business, not just a skill set", "Freedom channel discussions"]
}, {
  key: "inner",
  name: "Inner Circle",
  color: "var(--premium-gold-deep)",
  perks: ["Top-tier roundtable & mentorship", "Inner Circle channel discussions"]
}];
const TIER_LADDER_MAP = TIER_LADDER.reduce((m, t, i) => {
  m[t.key] = {
    ...t,
    rank: i
  };
  return m;
}, {});
const COURSE_NAMES = {
  protox: "PROTOX"
};

/* Preview personas — the same ladder as the architecture guide's simulator.
   channels lists every channel bucket that persona holds (each higher tier
   includes every tier below it); paid/admin gate the free-tier teaser path. */
const PERSONAS = [{
  key: "free",
  name: "Free user",
  desc: "Editorial + teasers only.",
  channels: [],
  paid: false,
  admin: false
}, {
  key: "confidence",
  name: "Paid · Confidence",
  desc: "Every paid user starts here.",
  channels: ["confidence"],
  paid: true,
  admin: false
}, {
  key: "mastery",
  name: "Mastery member",
  desc: "Confidence + Mastery.",
  channels: ["confidence", "mastery"],
  paid: true,
  admin: false
}, {
  key: "freedom",
  name: "Freedom member",
  desc: "Confidence + Mastery + Freedom.",
  channels: ["confidence", "mastery", "freedom"],
  paid: true,
  admin: false
}, {
  key: "inner",
  name: "Inner Circle",
  desc: "All four channels.",
  channels: ["confidence", "mastery", "freedom", "inner"],
  paid: true,
  admin: false
}, {
  key: "admin",
  name: "Admin",
  desc: "Sees everything.",
  channels: ["confidence", "mastery", "freedom", "inner"],
  paid: true,
  admin: true
}];
const PERSONA_MAP = PERSONAS.reduce((m, p) => {
  m[p.key] = p;
  return m;
}, {});

/* The actual routing logic: given who's looking + their bucket toggles,
   resolve which BUCKET_POSTS are visible, and in what mode. Mirrors the
   architecture guide's resolveFeed() 1:1. */
function resolveBucketFeed(personaKey, toggles) {
  const persona = PERSONA_MAP[personaKey] || PERSONA_MAP.confidence;
  if (!persona.paid && !persona.admin) {
    return BUCKET_POSTS.filter(x => TEASABLE_BUCKETS.has(x.bucket)).map(item => ({
      item,
      mode: "teaser"
    }));
  }
  const out = [];
  BUCKET_POSTS.forEach(x => {
    switch (x.bucket) {
      case "confidence":
      case "mastery":
      case "freedom":
      case "inner":
        if (persona.admin || persona.channels.includes(x.bucket)) out.push({
          item: x,
          mode: "full"
        });else out.push({
          item: x,
          mode: "teaser"
        });
        break;
      case "course":
      case "coursecomment":
        if (persona.admin || persona.paid) out.push({
          item: x,
          mode: "full"
        });
        break;
      case "mylearning":
        if (persona.admin || toggles.save) out.push({
          item: x,
          mode: "full"
        });
        break;
      case "general":
      case "followsave":
        if (x.from === "mark" && toggles.mute && !persona.admin) return;
        out.push({
          item: x,
          mode: "full"
        });
        break;
    }
  });
  return out;
}
const PROFILE = {
  name: "Katy Wilson",
  role: "Registered Nurse",
  avatar: "assets/avatar-katy.jpg",
  seals: ["gb", "verified", "gold"],
  stats: [{
    value: "2,402",
    label: "Following"
  }, {
    value: "1,203",
    label: "Followers"
  }, {
    value: "120",
    label: "Points"
  }]
};
const CHANNEL_GROUPS = [{
  title: "Community Channel",
  rooms: [{
    name: "General",
    newPosts: "5 new posts",
    count: 5
  }, {
    name: "Industry Insights",
    newPosts: "2 new posts"
  }]
}, {
  title: "Clinical Forum",
  rooms: [{
    name: "Case Studies",
    newPosts: "5 new posts",
    count: 5
  }, {
    name: "Growth Marketing",
    premium: true
  }]
}];
const TRENDING = [{
  rank: 1,
  kind: "Protocol",
  title: "Lip Reversal Protocol",
  media: IMG.lip
}, {
  rank: 2,
  kind: "Case Study",
  title: "Tear Trough Correction",
  media: IMG.toxin
}, {
  rank: 3,
  kind: "Article",
  title: "MidFace Filler Complications",
  media: IMG.collage
}];
const FOLLOWS = [{
  name: "Caron Kiem",
  loc: "London, United Kingdom"
}, {
  name: "Sofia Chen",
  loc: "Toronto, Canada"
}, {
  name: "Liam O'Connor",
  loc: "Dublin, Ireland"
}, {
  name: "Amina El-Masri",
  loc: "Cairo, Egypt"
}];
const EVENTS = [{
  image: "assets/event-technique-tuesday.png",
  title: "Technique Tuesday",
  host: "Dr Tim Pearce",
  date: "17 March 2026",
  time: "20:00 GMT • 16:00 ET",
  cta: "Join Now!",
  ctaVariant: "primary"
}, {
  image: "assets/event-art-codes.png",
  title: "Art Codes Live Webinar",
  hostLabel: "Event by:",
  host: "Dr Tim Pearce",
  date: "18 March 2026",
  cta: "View Event Details",
  ctaVariant: "brand"
}, {
  image: "assets/event-art-codes.png",
  title: "Art Codes Recorded Webinar",
  hostLabel: "Event by:",
  host: "Dr Tim Pearce",
  date: "22 March 2026",
  cta: "View Event Details",
  ctaVariant: "brand"
}];
const CASE_TITLE = "Achieve a 64% boost in patient satisfaction with our Full-Face Rejuvenation Protocol.";
const CASE_BODY = "Dr. Tim employed a unique method targeting the tear troughs, cheekbones, and jawline. He adhered to the 3-Step Confidence Framework within PROfinity, combining precise dermal filler placement with complementary skin-quality treatments for a fully balanced result.";
const REPLY_A = {
  author: {
    name: "Tokyo Jana",
    seals: ["gb"]
  },
  text: "This is an amazing protocol! It has helped us a lot in our research.",
  reactions: ["like"],
  reactionCount: "1.2K",
  time: "5d",
  pills: [{
    k: "like",
    n: "3"
  }]
};
function thread(extra) {
  return [{
    author: {
      name: "Phoenix Baker",
      seals: ["gb", "verified", "skinfluencer"]
    },
    text: "This is an amazing protocol! It has helped us a lot in our research.",
    likes: "1.1K",
    comments: "300",
    time: "1w",
    pills: [{
      k: "like",
      n: "12"
    }, {
      k: "love",
      n: "5"
    }],
    reactions: ["like", "love", "laugh"],
    reactionCount: "1.2K",
    replies: [REPLY_A]
  }, {
    author: {
      name: "Luna Chen"
    },
    text: extra || "The interface is so intuitive — a genuine game changer for the clinic!",
    likes: "850",
    comments: "150",
    time: "3d",
    pills: [{
      k: "like",
      n: "8"
    }],
    reactions: ["like"],
    reactionCount: "1.2K"
  }];
}
const POSTS = [{
  id: "p1",
  author: TIM,
  withOthers: "Miranda Pearce and 14 others",
  time: "1 Week Ago",
  hashtags: ["case-study", "patient", "business", "clinic", "profinity", "healthcare"],
  title: CASE_TITLE,
  media: [IMG.p1img1, IMG.p1img2, IMG.p1img3, IMG.p1img4],
  body: CASE_BODY,
  likes: "1.2K",
  comments: "150",
  shares: "150",
  actioned: true,
  commentList: thread()
}, {
  id: "p2",
  author: TIM,
  withOthers: "Miranda Pearce and 14 others",
  time: "1 Week Ago",
  hashtags: ["protocol", "business", "clinic"],
  media: [IMG.p2img1, IMG.p2img2, IMG.p2img3],
  body: "This protocol shows the exact steps for safely correcting migrated or uneven lip filler using a structured, repeatable framework you can apply chairside.",
  likes: "1.2K",
  comments: "150",
  shares: "150",
  actioned: true,
  commentList: thread("This is exactly what I was looking for. Thank you!")
}, {
  id: "p3",
  author: MIRANDA,
  withOthers: "Dr Tim Pearce",
  time: "2 Weeks Ago",
  hashtags: ["discussion", "business"],
  media: [IMG.p3img1, IMG.p3img2, IMG.p3img3],
  body: "Growing your clinic revenue doesn't require discounts. Here are 5 strategies top clinicians use to build a premium, referral-led practice.",
  likes: "1.2K",
  comments: "150",
  shares: "150",
  actioned: false,
  commentList: thread("So easy to follow — even on a busy clinic day!")
}, {
  id: "p4",
  author: MIRANDA,
  time: "2 Weeks Ago",
  hashtags: ["community", "confidence"],
  media: [IMG.p4img1, IMG.p4img2, IMG.p4img3],
  body: "I've been terrified for months, but after studying the Toxin Confidence Pathway, I finally did it! Thank you everyone for your support — this community keeps me moving.",
  likes: "1.2K",
  comments: "150",
  shares: "150",
  actioned: false,
  commentList: thread("So proud of you — the leap is always the hardest part!")
}, {
  id: "p5",
  author: TIM,
  time: "3 Days Ago",
  hashtags: ["masterclass", "anatomy"],
  sample: {
    type: "video",
    poster: IMG.p5img1,
    duration: "12:40"
  },
  body: "Watch the full walkthrough of the Golden Ratio full-face assessment — every landmark, every measurement, explained step by step.",
  likes: "3.4K",
  comments: "210",
  shares: "180",
  actioned: false,
  commentList: thread("Watched it twice already — incredibly clear teaching.")
}, {
  id: "p6",
  author: MIRANDA,
  time: "4 Days Ago",
  hashtags: ["reel"],
  sample: {
    type: "vertical",
    image: IMG.p5img2
  },
  body: "A 30-second vertical reel of a lip refinement — saving this format for sharing straight to socials.",
  likes: "2.1K",
  comments: "140",
  shares: "320",
  actioned: false,
  commentList: thread("Perfect for Reels — the vertical crop looks great.")
}, {
  id: "p7",
  author: TIM,
  withOthers: "Miranda Pearce and 14 others",
  time: "5 Days Ago",
  hashtags: ["case-study", "anatomy", "patient"],
  sample: {
    type: "gallery",
    images: [IMG.p5img1, IMG.p5img2, IMG.p5img3, IMG.p5img4, IMG.p5img5, IMG.p5img6, IMG.p5img7, IMG.p5img8, IMG.p5img9, IMG.p5img10]
  },
  body: "Full 10-step before-and-after series from a complete facial rejuvenation — swipe through every stage of the treatment plan.",
  likes: "5.6K",
  comments: "430",
  shares: "390",
  actioned: false,
  commentList: thread("This step-by-step series is gold — thank you for sharing all 10!")
}];

/* ============================ SHARED BITS ================================ */
function SectionHead({
  children,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-h2)",
      color: "var(--text-primary)"
    }
  }, children), action && /*#__PURE__*/React.createElement("a", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body)",
      color: "var(--action-primary)",
      cursor: "pointer"
    }
  }, action));
}

/* ============================ LEFT RAIL ================================== */
function ProfileCard() {
  const p = PROFILE;
  return /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: "hidden",
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 92,
      background: "linear-gradient(120deg, var(--ai-purple-200), var(--brand-gold-100))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "0 18px",
      marginTop: -42
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name,
    src: p.avatar,
    size: 84,
    ring: true,
    style: {
      border: "4px solid var(--surface-card)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-h2)",
      color: "var(--text-heading)"
    }
  }, p.name), /*#__PURE__*/React.createElement(VerificationSeals, {
    seals: p.seals,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)",
      marginTop: 3
    }
  }, p.role), /*#__PURE__*/React.createElement(StatGroup, {
    stats: p.stats,
    gap: 24,
    style: {
      marginTop: 18,
      width: "100%",
      justifyContent: "space-around"
    }
  })));
}
function ChannelGroup({
  group
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: 16
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-heading)",
      padding: "4px 6px 8px"
    }
  }, group.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, group.rooms.map((r, i) => /*#__PURE__*/React.createElement(ChannelItem, {
    key: i,
    ...r
  }))));
}
function Trending() {
  return /*#__PURE__*/React.createElement(Card, {
    padding: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:trending-up",
    size: 22,
    color: "var(--reaction-like)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-heading)"
    }
  }, "Trending Among Clinicians")), TRENDING.map((t, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    style: {
      display: "block",
      padding: "14px 0",
      borderTop: i ? "1px solid var(--border-default)" : "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      color: "var(--gray-500)",
      marginBottom: 9
    }
  }, "#", t.rank, " – ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)",
      fontWeight: "var(--fw-semibold)"
    }
  }, "Top Trending")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: t.media,
    alt: "",
    style: {
      width: 56,
      height: 56,
      borderRadius: "var(--r-sm)",
      objectFit: "cover",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-heading)"
    }
  }, t.kind), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-600)",
      marginTop: 2
    }
  }, t.title))))));
}
function StoreButton({
  iconify,
  small,
  big
}) {
  const [h, setH] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      width: "100%",
      padding: "10px 16px",
      borderRadius: "var(--r-sm)",
      border: "1px solid var(--brand-navy)",
      cursor: "pointer",
      background: h ? "var(--brand-navy-700)" : "var(--brand-navy)",
      color: "var(--white)",
      transition: "background var(--dur-fast)"
    }
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: iconify,
    size: 26,
    color: "var(--white)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "left",
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      opacity: 0.8
    }
  }, small), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      fontWeight: "var(--fw-bold)"
    }
  }, big)));
}
function Download() {
  return /*#__PURE__*/React.createElement(Card, {
    padding: 20,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)",
      marginBottom: 14
    }
  }, "Download Now"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement(StoreButton, {
    iconify: "lucide:play",
    small: "GET IT ON",
    big: "Google Play"
  }), /*#__PURE__*/React.createElement(StoreButton, {
    iconify: "lucide:apple",
    small: "Download on the",
    big: "App Store"
  })));
}
function LeftRail() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "rail",
    "data-screen-label": "Left sidebar"
  }, /*#__PURE__*/React.createElement(ProfileCard, null), CHANNEL_GROUPS.map((g, i) => /*#__PURE__*/React.createElement(ChannelGroup, {
    key: i,
    group: g
  })), /*#__PURE__*/React.createElement(Trending, null), /*#__PURE__*/React.createElement(Download, null));
}

/* ============================ RIGHT RAIL ================================= */
function FollowItem({
  f
}) {
  const [following, setFollowing] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 13
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: f.name,
    size: 52
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-heading)"
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      color: "var(--gray-500)"
    }
  }, f.loc)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setFollowing(v => !v),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-body)",
      color: following ? "var(--gray-500)" : "var(--action-primary)"
    }
  }, following ? "Following" : "Follow", /*#__PURE__*/React.createElement(IconifyIcon, {
    name: following ? "lucide:check" : "lucide:plus",
    size: 16,
    color: following ? "var(--gray-500)" : "var(--action-primary)"
  })));
}
function AddToFeed() {
  return /*#__PURE__*/React.createElement(Card, {
    padding: 20
  }, /*#__PURE__*/React.createElement(SectionHead, null, "Add to your feed"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, FOLLOWS.map((f, i) => /*#__PURE__*/React.createElement(FollowItem, {
    key: i,
    f: f
  }))));
}
function RightRail() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "rail",
    "data-screen-label": "Right sidebar"
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 20
  }, /*#__PURE__*/React.createElement(SectionHead, {
    action: "See all"
  }, "My Events"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, EVENTS.map((e, i) => /*#__PURE__*/React.createElement(EventCard, {
    key: i,
    ...e
  })))), /*#__PURE__*/React.createElement(AddToFeed, null), /*#__PURE__*/React.createElement(MembershipCard, null));
}

/* ============================ FEED ======================================= */
function SortBar({
  value,
  onCycle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pf-sortbar",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 8,
      padding: "0 4px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--gray-500)"
    }
  }, "Sort by:", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCycle,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, value, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--gray-500)"
  })));
}
const SORTS = ["All", "Latest", "Top", "Following"];

/* Facebook-style reaction set — colorful 3D Fluent Emoji + per-reaction accent. */
const REACTIONS = [{
  key: "like",
  label: "Like",
  icon: "fluent-emoji-flat:thumbs-up",
  flat: "fluent:thumb-like-16-filled",
  color: "--reaction-like"
}, {
  key: "love",
  label: "Love",
  icon: "fluent-emoji-flat:red-heart",
  flat: "fluent:heart-16-filled",
  color: "--reaction-love"
}, {
  key: "laugh",
  label: "Laugh",
  icon: "fluent-emoji-flat:grinning-squinting-face",
  flat: "fluent:emoji-laugh-16-filled",
  color: "--premium-orange"
}, {
  key: "wow",
  label: "Wow",
  icon: "fluent-emoji-flat:face-with-open-mouth",
  flat: "fluent:emoji-16-filled",
  color: "--premium-orange"
}, {
  key: "cry",
  label: "Cry",
  icon: "fluent-emoji-flat:crying-face",
  flat: "fluent:emoji-sad-16-filled",
  color: "--premium-orange"
}, {
  key: "angry",
  label: "Angry",
  icon: "fluent-emoji-flat:pouting-face",
  flat: "fluent:emoji-angry-16-filled",
  color: "--error"
}];
const REACTION_MAP = REACTIONS.reduce((m, r) => {
  m[r.key] = r;
  return m;
}, {});

/* Compact reaction control for a comment: tap toggles Like; hover/long-press
   opens the mini reaction picker; picking one colours the label + shows its emoji. */
function CommentReact() {
  const [reaction, setReaction] = useState(null);
  const [open, setOpen] = useState(false);
  const hideT = useRef(null);
  const show = () => {
    clearTimeout(hideT.current);
    setOpen(true);
  };
  const hide = () => {
    hideT.current = setTimeout(() => setOpen(false), 220);
  };
  const r = reaction ? REACTION_MAP[reaction] : null;
  return /*#__PURE__*/React.createElement("span", {
    className: "cmt-react",
    onMouseEnter: show,
    onMouseLeave: hide
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cmt-link cmt-react-btn" + (r ? " on" : ""),
    style: r ? {
      color: "var(" + r.color + ")"
    } : null,
    onClick: () => setReaction(reaction ? null : "like")
  }, r ? /*#__PURE__*/React.createElement("span", {
    className: "cmt-react-cur"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: r.icon,
    width: "16",
    height: "16"
  }), r.label) : "Like"), open && /*#__PURE__*/React.createElement("span", {
    className: "cmt-react-pop",
    role: "menu",
    "aria-label": "React to comment",
    onMouseEnter: show,
    onMouseLeave: hide
  }, REACTIONS.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.key,
    type: "button",
    role: "menuitem",
    "aria-label": opt.label,
    className: "cmt-react-opt",
    "data-react": opt.key,
    onClick: () => {
      setReaction(opt.key);
      setOpen(false);
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: opt.icon,
    width: "30",
    height: "30"
  })))));
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
function burstReaction(wrap, key) {
  burstFrom(likeButtonOf(wrap), key);
}
function burstFrom(btn, key) {
  if (!btn || typeof window === "undefined") return;
  const r = REACTION_MAP[key] || REACTION_MAP.like;
  const color = cssVar(r.color);
  const icon = btn.querySelector("iconify-icon");
  if (icon && icon.animate) {
    icon.animate([{
      transform: "scale(1)"
    }, {
      transform: "scale(1.6)"
    }, {
      transform: "scale(0.9)"
    }, {
      transform: "scale(1)"
    }], {
      duration: 460,
      easing: "cubic-bezier(.34,1.56,.64,1)"
    });
  }
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + 16,
    cy = rect.top + rect.height / 2;
  for (let i = 0; i < 7; i++) {
    const size = 13 + Math.random() * 10;
    const el = document.createElement("iconify-icon");
    el.setAttribute("icon", r.icon);
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;left:" + cx + "px;top:" + cy + "px;width:" + size + "px;height:" + size + "px;pointer-events:none;z-index:9999;line-height:0;will-change:transform,opacity;color:" + color + ";";
    document.body.appendChild(el);
    const dx = (Math.random() - 0.5) * 96,
      dy = -56 - Math.random() * 74;
    const anim = el.animate([{
      transform: "translate(-50%,-50%) scale(.3)",
      opacity: 0
    }, {
      transform: "translate(calc(-50% + " + dx * 0.35 + "px),calc(-50% + " + dy * 0.35 + "px)) scale(1)",
      opacity: 1,
      offset: 0.28
    }, {
      transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(.55)",
      opacity: 0
    }], {
      duration: 740 + Math.random() * 280,
      easing: "cubic-bezier(.22,.61,.36,1)"
    });
    anim.onfinish = () => el.remove();
    setTimeout(() => el.remove(), 1500);
  }
}

/* Facebook-style floating reaction bar — colorful 3D emoji, springy stagger-in,
   hover lift + label tooltip. */
function ReactionPicker({
  at,
  onPick,
  onEnter,
  onLeave
}) {
  if (!at) return null;
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: at.bottom,
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    className: "pf-react-bar",
    role: "menu",
    "aria-label": "Pick a reaction",
    style: {
      pointerEvents: "auto"
    }
  }, REACTIONS.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: r.key,
    type: "button",
    role: "menuitem",
    "aria-label": r.label,
    onClick: () => onPick(r.key),
    className: "pf-react-opt",
    "data-react": r.key,
    style: {
      animationDelay: i * 35 + "ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-react-label"
  }, r.label), /*#__PURE__*/React.createElement(IconifyIcon, {
    name: r.icon,
    size: 40
  }))))), document.body);
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
    setAt({
      bottom: window.innerHeight - rect.top + 8
    });
  };
  const scheduleHide = () => {
    clearTimeout(hideT.current);
    hideT.current = setTimeout(() => setAt(null), 240);
  };
  const pick = key => {
    setReaction(key);
    burstFrom(btnRef.current, key);
    setAt(null);
  };
  const toggleDefault = () => {
    if (reaction) {
      setReaction(null);
    } else {
      setReaction("like");
      burstFrom(btnRef.current, "like");
    }
  };
  const r = reaction ? REACTION_MAP[reaction] : null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("button", {
    ref: btnRef,
    type: "button",
    className: "cmt-react-link",
    "aria-label": r ? "Reacted: " + r.label + ". Change reaction" : "Like this comment",
    onMouseEnter: open,
    onMouseLeave: scheduleHide,
    onFocus: open,
    onBlur: scheduleHide,
    onClick: toggleDefault,
    style: {
      color: r ? "var(" + r.color + ")" : "var(--gray-500)"
    }
  }, r && /*#__PURE__*/React.createElement(IconifyIcon, {
    name: r.icon,
    size: 16
  }), r ? r.label : "Like"), /*#__PURE__*/React.createElement(ReactionPicker, {
    at: at,
    onPick: pick,
    onEnter: () => clearTimeout(hideT.current),
    onLeave: scheduleHide
  }));
}
function withIds(list) {
  return (list || []).map(c => ({
    ...c,
    _id: "c" + _cseq++,
    replies: (c.replies || []).map(r => ({
      ...r
    }))
  }));
}

/* Inline comment / reply composer built from DS primitives. */
function CommentComposer({
  placeholder,
  onSubmit,
  autoFocus,
  small
}) {
  const [v, setV] = useState("");
  const submit = () => {
    const t = v.trim();
    if (!t) return;
    onSubmit(t);
    setV("");
  };
  const ready = v.trim().length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: ME.name,
    src: ME.avatar,
    size: small ? 30 : 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-pill)",
      padding: "7px 7px 7px 16px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: v,
    onChange: e => setV(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") submit();
    },
    placeholder: placeholder,
    autoFocus: autoFocus,
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)",
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: submit,
    "aria-label": "Post comment",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: "var(--r-pill)",
      border: "none",
      cursor: ready ? "pointer" : "default",
      background: ready ? "var(--action-primary)" : "var(--gray-200)",
      transition: "background var(--dur-fast)"
    }
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:send",
    size: 16,
    color: ready ? "var(--white)" : "var(--gray-500)"
  }))));
}

/* Minimal post composer (input only) — replaces the DS Composer's media row. */
function PostComposer({
  onPost
}) {
  const [v, setV] = useState("");
  const submit = () => {
    const t = v.trim();
    if (!t) return;
    onPost(t);
    setV("");
  };
  const ready = v.trim().length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: ME.name,
    src: ME.avatar,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "var(--surface-sunken)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-pill)",
      padding: "9px 9px 9px 18px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: v,
    onChange: e => setV(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") submit();
    },
    placeholder: "Write an article or share an update…",
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)",
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: submit,
    "aria-label": "Post",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 38,
      height: 38,
      flexShrink: 0,
      borderRadius: "var(--r-pill)",
      border: "none",
      cursor: ready ? "pointer" : "default",
      background: ready ? "var(--action-primary)" : "var(--gray-200)",
      transition: "background var(--dur-fast)"
    }
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:send",
    size: 18,
    color: ready ? "var(--white)" : "var(--gray-500)"
  }))));
}
const LIKED_BY = ["Jessica Hue", "Marco Ricci", "Sofia Chen"];
function LikedByRow({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onOpen,
    className: "likedby-row",
    "aria-label": "See who reacted to this post",
    "aria-haspopup": "dialog",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 0 4px",
      background: "none",
      border: "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, LIKED_BY.map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      marginLeft: i === 0 ? 0 : -10,
      border: "2px solid var(--surface-card)",
      borderRadius: "50%",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: n,
    size: 26
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-600)"
    }
  }, "Liked by ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)"
    }
  }, "Jessica Hue"), " and ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)"
    }
  }, "others")));
}

/* ---- Likes modal: who reacted, split into people-you-follow / others ----- */
const LIKE_TABS = [{
  key: "all",
  label: "All",
  count: "1.2K"
}, {
  key: "like",
  icon: "fluent:thumb-like-16-filled",
  color: "--reaction-like",
  count: "1.1K"
}, {
  key: "heart",
  icon: "fluent:heart-16-filled",
  color: "--reaction-love",
  count: "89"
}, {
  key: "wow",
  icon: "fluent-emoji-flat:face-with-open-mouth",
  color: "--reaction-laugh",
  count: "12"
}];
const LIKES_FOLLOW = [{
  name: "Dr. Sarah Jenkins",
  title: "Board Certified Plastic Surgeon"
}, {
  name: "Dr. Michael Aris",
  title: "Aesthetic Physician"
}, {
  name: "Dr. David Miller",
  title: "Consultant Dermatologist"
}];
const LIKES_OTHERS = [{
  name: "Dr. Sarah Jenkins",
  title: "Board Certified Plastic Surgeon"
}, {
  name: "Dr. Michael Aris",
  title: "Aesthetic Physician"
}];
function LikePerson({
  p,
  following
}) {
  const [on, setOn] = useState(following);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name,
    size: 48
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -1,
      bottom: -1,
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "var(--verify-check)",
      border: "2px solid var(--surface-card)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "fluent:checkmark-12-filled",
    size: 9,
    color: "var(--white)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, p.title)), on ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOn(false),
    style: {
      flexShrink: 0,
      padding: "10px 20px",
      borderRadius: "var(--r-pill)",
      border: "none",
      cursor: "pointer",
      background: "var(--surface-sunken)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body)"
    }
  }, "Following") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOn(true),
    style: {
      flexShrink: 0,
      padding: "12px 28px",
      borderRadius: "var(--r-sm)",
      border: "none",
      cursor: "pointer",
      background: "var(--brand-navy)",
      color: "var(--white)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)"
    }
  }, "Follow"));
}
function LikesModal({
  onClose
}) {
  const [tab, setTab] = useState("all");
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    const prevFocus = document.activeElement;
    if (closeRef.current) closeRef.current.focus();
    const onKey = e => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && sheetRef.current) {
        // simple focus trap
        const f = sheetRef.current.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "likes-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "likes-sheet",
    ref: sheetRef,
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "likes-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "likes-handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "likes-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "likes-title",
    id: "likes-title"
  }, "Likes"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "likes-x",
    "aria-label": "Close likes dialog",
    ref: closeRef,
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--text-primary)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "likes-tabs",
    role: "tablist",
    "aria-label": "Filter by reaction"
  }, LIKE_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    role: "tab",
    "aria-selected": tab === t.key,
    "aria-label": (t.label || t.key) + " reactions, " + t.count,
    className: "likes-tab" + (tab === t.key ? " on" : ""),
    onClick: () => setTab(t.key)
  }, t.icon && /*#__PURE__*/React.createElement(IconifyIcon, {
    name: t.icon,
    size: 20,
    color: "var(" + t.color + ")"
  }), t.label && /*#__PURE__*/React.createElement("span", null, t.label), /*#__PURE__*/React.createElement("span", {
    className: "cnt"
  }, t.count)))), /*#__PURE__*/React.createElement("div", {
    className: "likes-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "likes-sec-label"
  }, "People you follow"), LIKES_FOLLOW.map((p, i) => /*#__PURE__*/React.createElement(LikePerson, {
    key: i,
    p: p,
    following: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "likes-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "likes-sec-label"
  }, "Others"), LIKES_OTHERS.map((p, i) => /*#__PURE__*/React.createElement(LikePerson, {
    key: i,
    p: p,
    following: false
  })))));
}
const PF_CMT_TIMES = ["2h", "1h", "45m", "20m", "12m", "5m", "2m"];

/* Slide-up Comments sheet (mobile). Shows the post reference, the full comment
   thread with timestamps + Like/Reply, and an "Add a comment" composer.
   Rendered position:absolute so it stays inside the phone frame. */
function CommentsSheet({
  post,
  comments,
  onClose,
  onAddComment,
  onAddReply
}) {
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  const [replyFor, setReplyFor] = useState(null);
  useEffect(() => {
    const prev = document.activeElement;
    if (closeRef.current) closeRef.current.focus();
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prev && prev.focus) prev.focus();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet",
    ref: sheetRef,
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Comments"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cmtsheet-title"
  }, "Comments"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cmtsheet-x",
    "aria-label": "Close comments",
    ref: closeRef,
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--text-primary)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-post"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: post.author.name,
    src: post.author.avatar,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-post-tx"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, post.author.name, post.author.seals && /*#__PURE__*/React.createElement(VerificationSeals, {
    seals: post.author.seals,
    size: 14,
    gap: 3
  })), /*#__PURE__*/React.createElement("div", {
    className: "sn"
  }, post.body))), /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-body"
  }, comments.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c._id,
    className: "cmtsheet-item"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: c.author.name,
    src: c.author.avatar,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-bubble"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, c.author.name, c.author.seals && /*#__PURE__*/React.createElement(VerificationSeals, {
    seals: c.author.seals,
    size: 14,
    gap: 3
  })), /*#__PURE__*/React.createElement("span", {
    className: "tm"
  }, c.time || PF_CMT_TIMES[i % PF_CMT_TIMES.length])), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, c.text)), /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-acts"
  }, /*#__PURE__*/React.createElement(CommentReact, null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cmt-link",
    onClick: () => setReplyFor(replyFor === c._id ? null : c._id)
  }, "Reply")), (c.replies || []).map((rep, j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    className: "cmtsheet-item reply"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: rep.author.name,
    src: rep.author.avatar,
    size: 30
  }), /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-bubble"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, rep.author.name, rep.author.seals && /*#__PURE__*/React.createElement(VerificationSeals, {
    seals: rep.author.seals,
    size: 14,
    gap: 3
  }))), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, rep.text))))), replyFor === c._id && /*#__PURE__*/React.createElement(CommentComposer, {
    small: true,
    autoFocus: true,
    placeholder: "Reply to " + c.author.name + "…",
    onSubmit: t => {
      onAddReply(c._id, t);
      setReplyFor(null);
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "cmtsheet-foot"
  }, /*#__PURE__*/React.createElement(CommentComposer, {
    placeholder: "Add a comment…",
    onSubmit: onAddComment
  }))));
}

/* Clamp the post body to a few lines with a "See more" / "See less" toggle.
   Passed as the `body` node to the DS PostCard (which renders {body} as-is). */
function ClampText({
  text,
  lines = 3,
  more = "See more"
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setOverflowing(el.scrollHeight - el.clientHeight > 2);
  }, [text]);
  return /*#__PURE__*/React.createElement("span", {
    className: "pf-clampwrap"
  }, /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: "pf-clamp" + (expanded ? " open" : ""),
    style: {
      ...(expanded ? null : {
        WebkitLineClamp: lines
      }),
      color: "var(--text-primary)"
    }
  }, text), (overflowing || expanded) && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-seemore",
    onClick: () => setExpanded(v => !v)
  }, expanded ? "See less" : more));
}

/* Compact sliding dot indicator — max 5 visible, edge dots scale down when count > 5.
   For many-image posts the active dot is always centred; the 1/N counter tracks exact position. */
function SlidingDots({
  count,
  idx
}) {
  const MAX = 5;
  if (count <= MAX) {
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-dots"
    }, Array.from({
      length: count
    }, (_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "mc-dot" + (i === idx ? " on" : "")
    })));
  }
  // >5 images: always 5 dots, center is always the active/coloured one.
  const SCALES = [0.57, 0.78, 1, 0.78, 0.57];
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-dots"
  }, SCALES.map((scale, pos) => /*#__PURE__*/React.createElement("span", {
    key: pos,
    className: "mc-dot" + (pos === 2 ? " on" : ""),
    style: {
      transform: `scale(${scale})`
    }
  })));
}

/* Swipeable image carousel with dot indicators + counter for media posts. */
function MediaCarousel({
  images
}) {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "mc-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-scroll" + (single ? " mc-scroll-single" : ""),
    ref: ref,
    onScroll: onScroll
  }, images.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: "Image " + (i + 1) + " of " + images.length,
    className: "mc-img"
  }))), !single && /*#__PURE__*/React.createElement("span", {
    className: "mc-count"
  }, idx + 1, "/", images.length), !single && /*#__PURE__*/React.createElement(SlidingDots, {
    count: images.length,
    idx: idx
  }));
}

/* Sample media for demo posts: a video player, a vertical reel, and a 10-image
   swipeable gallery. Rendered inside the DS PostCard's body slot. */
/* Floating avatars of people you follow who reacted — overlaid bottom-left on
   video/reel media (Facebook-style), each with a small reaction badge. */
const FOLLOW_REACTORS = [{
  name: "Daryll Cee",
  avatar: "assets/avatar-drtim.png",
  rxn: "like"
}, {
  name: "Marco Ricci",
  avatar: "assets/avatar-katy.jpg",
  rxn: "heart"
}, {
  name: "Sofia Chen",
  avatar: "assets/avatar-drtim.png",
  rxn: "heart"
}];
const RXN_BADGE = {
  like: {
    icon: "fluent-emoji-flat:thumbs-up",
    bg: "var(--reaction-like)"
  },
  heart: {
    icon: "fluent-emoji-flat:red-heart",
    bg: "var(--reaction-love)"
  }
};
function FloatingReactors() {
  const [removed, setRemoved] = useState({});
  const drag = useRef(null);
  const onDown = (i, e) => {
    const pt = e.touches ? e.touches[0] : e;
    drag.current = {
      i,
      x0: pt.clientX,
      y0: pt.clientY,
      el: e.currentTarget
    };
    e.currentTarget.style.transition = "none";
    e.stopPropagation();
  };
  const onMove = e => {
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
    const {
      i,
      el,
      dist
    } = drag.current;
    if (dist > 70) {
      setRemoved(r => ({
        ...r,
        [i]: true
      })); // dragged far enough → dismiss
    } else {
      el.style.transition = "transform .2s ease, opacity .2s ease";
      el.style.transform = "";
      el.style.opacity = "";
    }
    drag.current = null;
  };
  const visible = FOLLOW_REACTORS.map((p, i) => ({
    p,
    i
  })).filter(({
    i
  }) => !removed[i]);
  if (!visible.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-reactors",
    onClick: e => e.stopPropagation(),
    onMouseMove: onMove,
    onMouseUp: onUp,
    onMouseLeave: onUp,
    onTouchMove: onMove,
    onTouchEnd: onUp,
    "aria-label": "People you follow who reacted — drag one away to hide it"
  }, visible.map(({
    p,
    i
  }) => {
    const b = RXN_BADGE[p.rxn] || RXN_BADGE.like;
    return /*#__PURE__*/React.createElement("span", {
      className: "sm-reactor",
      key: i,
      title: "Drag away to hide",
      onMouseDown: e => onDown(i, e),
      onTouchStart: e => onDown(i, e)
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: p.name,
      src: p.avatar,
      size: 54
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-reactor-badge",
      style: {
        background: b.bg
      }
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: b.icon,
      width: "16",
      height: "16"
    })));
  }));
}

/* Channel context strip — shown above a post that someone you follow made in a
   channel (Facebook group-post style): channel avatar + name + Join, then poster. */
function ChannelContext({
  channel
}) {
  const [joined, setJoined] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "chx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chx-av"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: channel.name,
    src: channel.avatar,
    size: 42
  })), /*#__PURE__*/React.createElement("div", {
    className: "chx-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chx-name"
  }, channel.name), /*#__PURE__*/React.createElement("div", {
    className: "chx-by"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: channel.by,
    src: channel.byAvatar,
    size: 22
  }), /*#__PURE__*/React.createElement("span", null, channel.by, " · ", channel.time, " · "), /*#__PURE__*/React.createElement("span", {
    className: "chx-flag"
  }, "🇬🇧"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chx-join" + (joined ? " on" : ""),
    onClick: () => setJoined(j => !j)
  }, joined ? "Joined" : "Join"));
}
function SampleMedia({
  sample
}) {
  const galleryRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(sample && sample.type === "vertical");
  const [muted, setMuted] = useState(true);
  const [fs, setFs] = useState(false);
  useEffect(() => {
    if (!fs) return;
    const onKey = e => {
      if (e.key === "Escape") setFs(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [fs]);
  if (!sample) return null;
  if (sample.type === "video") {
    return /*#__PURE__*/React.createElement("div", {
      className: "sm-video",
      onClick: () => setPlaying(p => !p)
    }, /*#__PURE__*/React.createElement("img", {
      src: sample.poster,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-play" + (playing ? " on" : "")
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: playing ? "fluent:pause-16-filled" : "fluent:play-16-filled",
      size: 26,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sm-mute",
      "aria-label": muted ? "Unmute" : "Mute",
      onClick: e => {
        e.stopPropagation();
        setMuted(m => !m);
      }
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: muted ? "lucide:volume-x" : "lucide:volume-2",
      size: 16,
      color: "var(--white)"
    })), /*#__PURE__*/React.createElement(FloatingReactors, null), /*#__PURE__*/React.createElement("span", {
      className: "sm-badge"
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:video",
      size: 14,
      color: "var(--white)"
    }), sample.duration));
  }
  if (sample.type === "vertical") {
    return /*#__PURE__*/React.createElement("div", {
      className: "sm-vertical sm-reel" + (playing ? " playing" : ""),
      onClick: () => setPlaying(p => !p)
    }, /*#__PURE__*/React.createElement("img", {
      src: sample.image,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-badge sm-badge-tr"
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:smartphone",
      size: 14,
      color: "var(--white)"
    }), "Reel"), /*#__PURE__*/React.createElement("span", {
      className: "sm-mute",
      onClick: e => {
        e.stopPropagation();
        setMuted(m => !m);
      }
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: muted ? "lucide:volume-x" : "lucide:volume-2",
      size: 16,
      color: "var(--white)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-bigplay" + (playing ? " hide" : "")
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "fluent:play-16-filled",
      size: 30,
      color: "var(--white)"
    })), /*#__PURE__*/React.createElement(FloatingReactors, null), /*#__PURE__*/React.createElement("div", {
      className: "sm-controls",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sm-ctl",
      "aria-label": playing ? "Pause" : "Play",
      onClick: () => setPlaying(p => !p)
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: playing ? "fluent:pause-16-filled" : "fluent:play-16-filled",
      size: 18,
      color: "var(--white)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-time"
    }, "0:12"), /*#__PURE__*/React.createElement("span", {
      className: "sm-track"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-fill"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-time"
    }, "0:30"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sm-ctl",
      "aria-label": "Fullscreen",
      onClick: e => {
        e.stopPropagation();
        setFs(true);
      }
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:maximize-2",
      size: 16,
      color: "var(--white)"
    }))), fs && /*#__PURE__*/React.createElement("div", {
      className: "sm-fs",
      onClick: e => {
        e.stopPropagation();
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: sample.image,
      alt: ""
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sm-fs-close",
      "aria-label": "Close fullscreen",
      onClick: () => setFs(false)
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:x",
      size: 24,
      color: "var(--white)"
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sm-fs-mute",
      "aria-label": muted ? "Unmute" : "Mute",
      onClick: () => setMuted(m => !m)
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: muted ? "lucide:volume-x" : "lucide:volume-2",
      size: 20,
      color: "var(--white)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sm-fs-bar"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "sm-ctl",
      "aria-label": playing ? "Pause" : "Play",
      onClick: () => setPlaying(p => !p)
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: playing ? "fluent:pause-16-filled" : "fluent:play-16-filled",
      size: 22,
      color: "var(--white)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-time"
    }, "0:12"), /*#__PURE__*/React.createElement("span", {
      className: "sm-track"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-fill"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-time"
    }, "0:30"))));
  }

  // gallery
  const onScroll = () => {
    const el = galleryRef.current;
    if (!el) return;
    const w = el.clientWidth * 0.82 + 8;
    setIdx(Math.round(el.scrollLeft / w));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-gallery-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-gallery",
    ref: galleryRef,
    onScroll: onScroll
  }, sample.images.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: "Image " + (i + 1) + " of " + sample.images.length
  }))), /*#__PURE__*/React.createElement("span", {
    className: "sm-count"
  }, idx + 1, "/", sample.images.length), /*#__PURE__*/React.createElement(SlidingDots, {
    count: sample.images.length,
    idx: idx
  }));
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
function InlineBubbleThread({
  comments,
  onAddComment,
  onAddReply
}) {
  const [replyFor, setReplyFor] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const Pills = ({
    pills
  }) => !pills || !pills.length ? null : /*#__PURE__*/React.createElement("span", {
    className: "bub-pills"
  }, pills.map((p, i) => /*#__PURE__*/React.createElement("span", {
    className: "bub-pill",
    key: i
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: PILL_EMOJI[p.k] || PILL_EMOJI.like,
    width: "16",
    height: "16"
  }), p.n)));
  const Bubble = ({
    c,
    isReply
  }) => /*#__PURE__*/React.createElement("div", {
    className: "bub-row" + (isReply ? " reply" : "")
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: c.author.name,
    src: c.author.avatar,
    size: isReply ? 34 : 40
  }), /*#__PURE__*/React.createElement("div", {
    className: "bub-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bub"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bub-name"
  }, c.author.name), /*#__PURE__*/React.createElement("div", {
    className: "bub-tx"
  }, c.text)), /*#__PURE__*/React.createElement("div", {
    className: "bub-acts"
  }, /*#__PURE__*/React.createElement(Pills, {
    pills: c.pills
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "bub-reply",
    onClick: () => setReplyFor(replyFor === c._id ? null : c._id)
  }, "Reply"), c.time && /*#__PURE__*/React.createElement("span", {
    className: "bub-time"
  }, c.time))));
  return /*#__PURE__*/React.createElement("div", {
    className: "bub-thread"
  }, /*#__PURE__*/React.createElement(LikedByRowInline, null), comments.map(c => {
    const reps = c.replies || [];
    const open = showReplies[c._id];
    return /*#__PURE__*/React.createElement("div", {
      key: c._id,
      className: "bub-block"
    }, /*#__PURE__*/React.createElement(Bubble, {
      c: c
    }), reps.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "bub-replies"
    }, (open ? reps : reps.slice(0, 1)).map((rep, i) => /*#__PURE__*/React.createElement(Bubble, {
      key: i,
      c: {
        ...rep,
        _id: c._id
      },
      isReply: true
    })), reps.length > 1 && !open && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "bub-more",
      onClick: () => setShowReplies(s => ({
        ...s,
        [c._id]: true
      }))
    }, "View ", reps.length - 1, " more ", reps.length - 1 === 1 ? "reply" : "replies")), replyFor === c._id && /*#__PURE__*/React.createElement("div", {
      className: "bub-replycompose"
    }, /*#__PURE__*/React.createElement(CommentComposer, {
      small: true,
      autoFocus: true,
      placeholder: "Reply to " + c.author.name + "…",
      onSubmit: t => {
        onAddReply(c._id, t);
        setReplyFor(null);
      }
    })));
  }), /*#__PURE__*/React.createElement("div", {
    className: "bub-compose"
  }, /*#__PURE__*/React.createElement(CommentComposer, {
    placeholder: "Write a comment…",
    onSubmit: onAddComment
  })));
}

/* compact "Liked by" row used inside the inline bubble thread */
function LikedByRowInline() {
  return /*#__PURE__*/React.createElement("div", {
    className: "bub-likedby"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bub-likedby-avs"
  }, ["Jessica Hue", "Marco Ricci", "Sofia Chen"].map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      marginLeft: i ? -10 : 0,
      border: "2px solid var(--surface-card)",
      borderRadius: "50%",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: n,
    size: 26
  })))), /*#__PURE__*/React.createElement("span", null, "Liked by ", /*#__PURE__*/React.createElement("span", {
    className: "bub-likedby-name"
  }, "Jessica Hue"), " and ", /*#__PURE__*/React.createElement("span", {
    className: "bub-likedby-name"
  }, "others")));
}
function SavedModal({
  onClose
}) {
  const sheetRef = useRef(null);
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "saved-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "saved-sheet",
    ref: sheetRef,
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Post saved"
  }, /*#__PURE__*/React.createElement("div", {
    className: "saved-handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "saved-icon-wrap"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:bookmark-check",
    size: 30,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "saved-title"
  }, "Saved!"), /*#__PURE__*/React.createElement("div", {
    className: "saved-desc"
  }, "Your post has been saved to your collection."), /*#__PURE__*/React.createElement("div", {
    className: "saved-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "saved-where"
  }, /*#__PURE__*/React.createElement("span", {
    className: "saved-where-av"
  }), /*#__PURE__*/React.createElement("div", {
    className: "saved-where-tx"
  }, /*#__PURE__*/React.createElement("div", {
    className: "saved-where-path"
  }, "Profile  →  Settings  →  My Saved"), /*#__PURE__*/React.createElement("div", {
    className: "saved-where-sub"
  }, "Find all your saved posts here"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "saved-btn",
    onClick: onClose
  }, "View Saved"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "saved-skip",
    onClick: onClose
  }, "Maybe Later")));
}

/* Resolves a post's stored hashtag slugs into the admin-managed tag objects
   (label + icon) the DS PostCard renders — slugs that no longer exist in the
   admin list (e.g. removed from the Admin Panel) are silently dropped. */
function resolveHashtags(slugs) {
  if (!slugs || !slugs.length || typeof window === "undefined" || !window.PFHashtags) return [];
  const all = window.PFHashtags.getAll();
  const map = all.reduce((m, t) => {
    m[t.slug] = t;
    return m;
  }, {});
  return slugs.map(s => map[s]).filter(Boolean);
}

/* Clicking a hashtag on a post (Newsfeed or Community) jumps to the Search
   page pre-filtered to every other post sharing that same tag. */
function goToHashtag(tag) {
  if (!tag || !tag.slug) return;
  const url = "SearchMobile.html?tag=" + encodeURIComponent(tag.slug);
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function FeedPost({
  post,
  st,
  hideTags,
  onToggleLike,
  onReact,
  onShare,
  onSave,
  onAddComment,
  onAddReply
}) {
  const ref = useRef(null);
  const [picker, setPicker] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyFor, setReplyFor] = useState(null);
  const [likesOpen, setLikesOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [savedSheetOpen, setSavedSheetOpen] = useState(false);
  const commentSheet = typeof window !== "undefined" && window.PF_COMMENT_SHEET;
  const hideT = useRef(null);
  const actionIcon = idx => {
    const btns = ref.current ? ref.current.querySelectorAll("button") : [];
    const b = btns[idx];
    return b ? b.querySelector("iconify-icon, svg") : null;
  };
  const show = () => {
    clearTimeout(hideT.current);
    const btn = likeButtonOf(ref.current);
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setPicker({
      bottom: window.innerHeight - r.top + 8
    });
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
      if (icon) {
        icon.setAttribute("icon", r.icon);
        icon.style.color = col;
      }
      if (label) {
        label.style.color = col;
        label.style.fontWeight = "var(--fw-semibold)";
      }
      btn.dataset.reacted = r.key;
    } else if (btn.dataset.reacted) {
      if (icon) {
        icon.setAttribute("icon", "fluent:thumb-like-16-filled");
        icon.style.color = "";
      }
      if (label) {
        label.style.color = "";
        label.style.fontWeight = "";
      }
      delete btn.dataset.reacted;
    }
  });
  const handleLike = () => {
    const willReact = !st.reaction;
    onToggleLike();
    if (willReact) burstReaction(ref.current, "like");
  };
  const pick = key => {
    const changing = st.reaction !== key;
    onReact(key);
    if (changing) burstReaction(ref.current, key);
    setPicker(null);
  };
  const handleComment = () => {
    const g = actionIcon(1);
    if (g && g.animate) {
      g.animate([{
        transform: "rotate(0)"
      }, {
        transform: "rotate(-17deg)"
      }, {
        transform: "rotate(13deg)"
      }, {
        transform: "rotate(-6deg)"
      }, {
        transform: "rotate(0)"
      }], {
        duration: 520,
        easing: "ease-in-out"
      });
    }
    setComposerOpen(o => !o);
    if (commentSheet) {
      setSheetOpen(true);
      setComposerOpen(false);
    }
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
      g.animate([{
        transform: "translate(0,0) scale(1)",
        opacity: 1
      }, {
        transform: "translate(8px,-10px) scale(1.28)",
        opacity: 0.35,
        offset: 0.5
      }, {
        transform: "translate(-3px,2px) scale(1)",
        opacity: 1,
        offset: 0.78
      }, {
        transform: "translate(0,0) scale(1)",
        opacity: 1
      }], {
        duration: 560,
        easing: "cubic-bezier(.34,1.56,.64,1)"
      });
    }
  };
  const comments = st.comments || [];
  const hasRegion = comments.length > 0 || composerOpen;
  const inlineBubbles = typeof window !== "undefined" && window.PF_INLINE_BUBBLES;
  return /*#__PURE__*/React.createElement("div", {
    className: "post-wrap" + (post.channel ? " has-chx" : ""),
    ref: ref,
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
      padding: "0px 16px"
    }
  }, post.channel && /*#__PURE__*/React.createElement(ChannelContext, {
    channel: post.channel
  }), /*#__PURE__*/React.createElement(PostCard, {
    ...post,
    commentList: [],
    hashtags: hideTags ? [] : resolveHashtags(post.hashtags),
    title: post.title,
    body: /*#__PURE__*/React.createElement(ClampText, {
      text: post.body,
      more: post.channel ? "Learn More" : "See more"
    }),
    media: post.sample ? /*#__PURE__*/React.createElement(SampleMedia, {
      sample: post.sample
    }) : post.media && post.media.length > 0 ? /*#__PURE__*/React.createElement(MediaCarousel, {
      images: post.media
    }) : null,
    liked: st.liked,
    saved: st.saved,
    actioned: false,
    likes: st.likes,
    shares: st.shares,
    comments: st.commentsCount,
    onLike: handleLike,
    onSave: handleSave,
    onComment: handleComment,
    onShare: handleShare,
    onHashtagClick: goToHashtag,
    style: {
      boxShadow: "none",
      border: "none",
      borderRadius: 0,
      background: "transparent"
    }
  }), inlineBubbles && hasRegion && /*#__PURE__*/React.createElement("div", {
    className: "comments-region",
    style: {
      borderTop: "1px solid var(--border-default)",
      padding: "4px 16px 16px"
    }
  }, composerOpen && /*#__PURE__*/React.createElement(CommentComposer, {
    placeholder: "Write a comment…",
    autoFocus: true,
    onSubmit: t => onAddComment(t)
  }), /*#__PURE__*/React.createElement(InlineBubbleThread, {
    comments: comments,
    onAddComment: onAddComment,
    onAddReply: onAddReply
  })), !commentSheet && !inlineBubbles && hasRegion && /*#__PURE__*/React.createElement("div", {
    className: "comments-region",
    style: {
      borderTop: "1px solid var(--border-default)",
      padding: "6px 24px 20px"
    }
  }, /*#__PURE__*/React.createElement(LikedByRow, {
    onOpen: () => setLikesOpen(true)
  }), composerOpen && /*#__PURE__*/React.createElement(CommentComposer, {
    placeholder: "Write a comment…",
    autoFocus: true,
    onSubmit: t => onAddComment(t)
  }), comments.map(c => /*#__PURE__*/React.createElement("div", {
    key: c._id,
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(CommentItem, {
    ...c,
    reactions: null,
    reactionCount: null,
    replies: []
  }), /*#__PURE__*/React.createElement("div", {
    className: "cmt-actions",
    style: {
      marginLeft: 48
    }
  }, /*#__PURE__*/React.createElement(ReactTrigger, null), /*#__PURE__*/React.createElement("span", {
    className: "cmt-dot"
  }, "·"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cmt-link",
    onClick: () => setReplyFor(replyFor === c._id ? null : c._id)
  }, "Reply")), c.replies && c.replies.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cmt-replies",
    style: {
      marginLeft: 48
    }
  }, c.replies.map((rep, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement(CommentItem, {
    ...rep,
    reactions: null,
    reactionCount: null,
    replies: [],
    avatarSize: 30
  }), /*#__PURE__*/React.createElement("div", {
    className: "cmt-actions",
    style: {
      marginLeft: 42
    }
  }, /*#__PURE__*/React.createElement(ReactTrigger, null), /*#__PURE__*/React.createElement("span", {
    className: "cmt-dot"
  }, "·"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cmt-link",
    onClick: () => setReplyFor(replyFor === c._id ? null : c._id)
  }, "Reply"))))), replyFor === c._id && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 48
    }
  }, /*#__PURE__*/React.createElement(CommentComposer, {
    small: true,
    autoFocus: true,
    placeholder: "Reply to " + c.author.name + "…",
    onSubmit: t => {
      onAddReply(c._id, t);
      setReplyFor(null);
    }
  }))))), commentSheet && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement(LikedByRow, {
    onOpen: () => setLikesOpen(true)
  })), commentSheet && comments.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "comments-region cm-preview-region",
    style: {
      padding: "0px",
      margin: "8px 0px 0px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmt-preview",
    role: "button",
    tabIndex: 0,
    onClick: () => setSheetOpen(true),
    onKeyDown: e => {
      if (e.key === "Enter") setSheetOpen(true);
    }
  }, /*#__PURE__*/React.createElement(CommentItem, {
    ...comments[0],
    reactions: null,
    reactionCount: null,
    replies: []
  })), comments.length > 1 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "cmt-viewmore",
    onClick: () => setSheetOpen(true)
  }, "View all ", comments.length, " comments")), /*#__PURE__*/React.createElement(ReactionPicker, {
    at: picker,
    onPick: pick,
    onEnter: () => clearTimeout(hideT.current),
    onLeave: scheduleHide
  }), likesOpen && /*#__PURE__*/React.createElement(LikesModal, {
    onClose: () => setLikesOpen(false)
  }), sheetOpen && /*#__PURE__*/React.createElement(CommentsSheet, {
    post: post,
    comments: comments,
    onClose: () => setSheetOpen(false),
    onAddComment: onAddComment,
    onAddReply: onAddReply
  }), savedSheetOpen && /*#__PURE__*/React.createElement(SavedModal, {
    onClose: () => setSavedSheetOpen(false)
  }));
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

/* Locked teaser card for gated content shown to a free-tier viewer: a real
   post header (avatar/name/seals/tier pill) and a short real excerpt make it
   read as genuine activity, then a blurred filler line fades into the
   "premium members only" paywall panel — the only action is "Upgrade". */
function TeaserPost({
  post,
  onUpgrade
}) {
  const meta = BUCKET_META[post.bucket] || {
    label: "Members only"
  };
  const pillColor = TEASER_PILL[post.bucket] || "var(--gray-500)";
  const cta = TEASER_CTA[post.bucket] || TEASER_CTA.confidence;
  const author = post.channel ? {
    name: post.channel.by,
    avatar: post.channel.byAvatar,
    seals: post.author && post.author.seals
  } : post.author;
  const time = post.channel ? post.channel.time : post.time;
  const isCourseComment = post.bucket === "coursecomment";
  return /*#__PURE__*/React.createElement("div", {
    className: "post-wrap pf-teaser",
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
      padding: "0px 16px"
    }
  }, isCourseComment && /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-activity"
  }, /*#__PURE__*/React.createElement("strong", null, author.name), " commented in course ", /*#__PURE__*/React.createElement("strong", null, COURSE_NAMES[post.course] || "the course")), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-head"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: author.name,
    src: author.avatar,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-head-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-head-name"
  }, /*#__PURE__*/React.createElement("span", null, author.name), author.seals && /*#__PURE__*/React.createElement(VerificationSeals, {
    seals: author.seals,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-head-sub"
  }, /*#__PURE__*/React.createElement("span", null, time), /*#__PURE__*/React.createElement("span", {
    className: "pf-teaser-pill",
    style: {
      background: pillColor
    }
  }, meta.label)))), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pf-teaser-visible"
  }, teaserExcerpt(post.body)), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-blurwrap"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pf-teaser-blurred"
  }, TEASER_BLUR_FILLER), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-fade"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-gate"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-teaser-diamond"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:gem",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-gate-title"
  }, "This content is for premium members only."), /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-gate-sub"
  }, "Upgrade your plan to view this post and access exclusive content."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-teaser-cta",
    onClick: onUpgrade
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:gem",
    size: 18,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pf-teaser-cta-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-teaser-cta-title"
  }, cta.title), /*#__PURE__*/React.createElement("span", {
    className: "pf-teaser-cta-sub"
  }, cta.sub))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-teaser-learnmore",
    onClick: onUpgrade
  }, "Learn More"))));
}

/* Compact community-channel post — how a paid member's channel content
   (Confidence/Mastery/Freedom/Inner Circle) surfaces merged into the main
   newsfeed: avatar + name + tier tag, body, then React/Reply/Save actions.
   Deliberately lighter than FeedPost — no media carousel, no full comment
   thread — this is "a tagged post in your feed", not the full community
   thread view (that still lives on the Community screen itself). */
function ChannelFeedCard({
  post,
  st,
  onToggleLike,
  onSave,
  onShare,
  onAddComment
}) {
  const meta = BUCKET_META[post.bucket] || {
    label: "Community",
    color: "var(--gray-500)"
  };
  const [replying, setReplying] = useState(false);
  const liked = !!st.reaction;
  return /*#__PURE__*/React.createElement("div", {
    className: "pf-chcard",
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      padding: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-chcard-head"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: post.channel.by,
    src: post.channel.byAvatar,
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pf-chcard-name"
  }, post.channel.by), /*#__PURE__*/React.createElement("span", {
    className: "pf-chcard-tag",
    style: {
      color: meta.color,
      background: `color-mix(in srgb, ${meta.color} 15%, transparent)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-chcard-dot",
    style: {
      background: meta.color
    }
  }), meta.label))), /*#__PURE__*/React.createElement("p", {
    className: "pf-chcard-body"
  }, post.body), post.media && post.media.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pf-chcard-media"
  }, /*#__PURE__*/React.createElement("img", {
    src: post.media[0],
    alt: ""
  })), /*#__PURE__*/React.createElement(PostActions, {
    likes: st.likes,
    comments: st.commentsCount,
    shares: st.shares,
    liked: liked,
    saved: st.saved,
    actioned: false,
    onLike: onToggleLike,
    onComment: () => setReplying(r => !r),
    onShare: onShare,
    onSave: onSave,
    style: {
      borderTop: "1px solid var(--border-default)",
      paddingTop: 14
    }
  }), replying && /*#__PURE__*/React.createElement(CommentComposer, {
    placeholder: "Write a reply…",
    autoFocus: true,
    small: true,
    onSubmit: t => {
      onAddComment(t);
      setReplying(false);
    }
  }));
}

/* Full (unlocked) view of a coursecomment-bucket post: another member's
   comment left on a course lesson, shown with the same "commented in
   course X" header as the locked teaser, plus a lesson-promo strip below
   the comment — doubles as a soft upsell into that lesson for anyone who
   hasn't taken it yet, or a refresher link for those who have. */
function CourseCommentCard({
  post,
  st,
  onToggleLike,
  onSave,
  onAddComment,
  onShare
}) {
  const [replying, setReplying] = useState(false);
  const liked = !!st.reaction;
  const lesson = post.lesson;
  return /*#__PURE__*/React.createElement("div", {
    className: "post-wrap pf-ccard",
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
      padding: "0px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-teaser-activity"
  }, /*#__PURE__*/React.createElement("strong", null, post.author.name), " commented in course ", /*#__PURE__*/React.createElement("strong", null, COURSE_NAMES[post.course] || "the course")), /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-head"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: post.author.name,
    src: post.author.avatar,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-head-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-head-name"
  }, /*#__PURE__*/React.createElement("span", null, post.author.name), post.author.seals && /*#__PURE__*/React.createElement(VerificationSeals, {
    seals: post.author.seals,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-head-time"
  }, post.time))), /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-body"
  }, /*#__PURE__*/React.createElement(ClampText, {
    text: post.body,
    lines: 4
  })), lesson && /*#__PURE__*/React.createElement("a", {
    className: "pf-ccard-lesson",
    href: "MyLearning.html",
    onClick: e => {
      if (!window.pfGo) return;
      e.preventDefault();
      window.pfGo("MyLearning.html");
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-lesson-media"
  }, /*#__PURE__*/React.createElement("img", {
    src: lesson.image,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-lesson-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-ccard-lesson-icon"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:graduation-cap",
    size: 17,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-lesson-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-lesson-title"
  }, lesson.title), /*#__PURE__*/React.createElement("div", {
    className: "pf-ccard-lesson-sub"
  }, lesson.sub)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-ccard-lesson-cta"
  }, "Learn More"))), /*#__PURE__*/React.createElement(PostActions, {
    likes: st.likes,
    comments: st.commentsCount,
    shares: st.shares,
    liked: liked,
    saved: st.saved,
    actioned: false,
    onLike: onToggleLike,
    onComment: () => setReplying(r => !r),
    onShare: onShare,
    onSave: onSave,
    style: {
      borderTop: "1px solid var(--border-default)",
      paddingTop: 14
    }
  }), replying && /*#__PURE__*/React.createElement(CommentComposer, {
    placeholder: "Write a reply…",
    autoFocus: true,
    small: true,
    onSubmit: t => {
      onAddComment(t);
      setReplying(false);
    }
  }));
}

/* No purchase flow exists in this prototype yet, so the CTA is a stub that
   just routes to MembershipTier.html. label/bucket describe the post that
   triggered the paywall; currentTier is the viewer's own paid tier key
   (null for a free viewer). When the viewer already pays for a lower tier
   than the one gating this post, show a "your plan vs. this tier"
   comparison instead of the generic first-time-paywall copy — a paying
   member needs to see what the higher tier actually adds, not just be told
   to "upgrade". */
function UpgradeModal({
  label,
  bucket,
  currentTier,
  onClose
}) {
  const sheetRef = useRef(null);
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const target = TIER_LADDER_MAP[bucket];
  const current = currentTier && TIER_LADDER_MAP[currentTier];
  const showCompare = target && current && current.rank < target.rank;
  const goToPlans = () => (window.pfGo || function (u) {
    window.location.href = u;
  })("MembershipTier.html");
  if (!showCompare) {
    return /*#__PURE__*/React.createElement("div", {
      className: "saved-overlay",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "saved-sheet",
      ref: sheetRef,
      onClick: e => e.stopPropagation(),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Upgrade to unlock"
    }, /*#__PURE__*/React.createElement("div", {
      className: "saved-handle"
    }), /*#__PURE__*/React.createElement("div", {
      className: "saved-icon-wrap"
    }, /*#__PURE__*/React.createElement(IconifyIcon, {
      name: "lucide:lock",
      size: 30,
      color: "var(--premium-orange)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "saved-title"
    }, "Unlock ", label || "this content"), /*#__PURE__*/React.createElement("div", {
      className: "saved-desc"
    }, "Upgrade your membership to read this post in full, react, comment and post here yourself."), /*#__PURE__*/React.createElement("div", {
      className: "saved-divider"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "saved-btn",
      style: {
        background: "var(--premium-badge)"
      },
      onClick: goToPlans
    }, "See Membership Plans"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "saved-skip",
      onClick: onClose
    }, "Maybe Later")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "saved-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "saved-sheet",
    ref: sheetRef,
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Upgrade to " + target.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "saved-handle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "saved-icon-wrap"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:gem",
    size: 30,
    color: "var(--premium-orange)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "saved-title"
  }, "Upgrade to ", target.name), /*#__PURE__*/React.createElement("div", {
    className: "saved-desc"
  }, "You're already a ", current.name, " member — ", target.name, " unlocks this post plus everything below."), /*#__PURE__*/React.createElement("div", {
    className: "pf-upgrade-compare"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-upgrade-tier"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-upgrade-tier-dot",
    style: {
      background: current.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pf-upgrade-tier-name"
  }, current.name), /*#__PURE__*/React.createElement("div", {
    className: "pf-upgrade-tier-badge"
  }, "Your plan"), /*#__PURE__*/React.createElement("ul", {
    className: "pf-upgrade-tier-perks"
  }, current.perks.map((p, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, p)))), /*#__PURE__*/React.createElement("span", {
    className: "pf-upgrade-compare-arrow"
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-upgrade-tier highlight"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-upgrade-tier-dot",
    style: {
      background: target.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pf-upgrade-tier-name"
  }, target.name), /*#__PURE__*/React.createElement("div", {
    className: "pf-upgrade-tier-badge on"
  }, "£397"), /*#__PURE__*/React.createElement("ul", {
    className: "pf-upgrade-tier-perks"
  }, target.perks.map((p, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, p))))), /*#__PURE__*/React.createElement("div", {
    className: "saved-divider"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "saved-btn",
    style: {
      background: "var(--premium-badge)"
    },
    onClick: goToPlans
  }, "Upgrade to ", target.name), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "saved-skip",
    onClick: onClose
  }, "Maybe Later")));
}

/* One bucket toggle row inside the preview panel — a switch that's forced
   off + disabled for a free persona (they hold no buckets to toggle). */
function PreviewToggle({
  label,
  sub,
  checked,
  disabled,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "pf-pt-row" + (disabled ? " disabled" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-pt-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-pt-label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "pf-pt-sub"
  }, sub)), /*#__PURE__*/React.createElement("span", {
    className: "pf-pt-switch" + (checked && !disabled ? " on" : "")
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked && !disabled,
    disabled: disabled,
    onChange: e => onChange(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", {
    className: "pf-pt-knob"
  })));
}

/* Dev-facing preview panel — lets the team see any persona's actual feed
   (bucket-merged, tier-gated, free-tier teasers) without a real auth/paywall
   backend. Collapsed by default and defaults to Paid · Confidence, so
   nothing changes for the normal signed-in view. */
function FeedPreviewPanel({
  persona,
  onPersona,
  toggles,
  onToggle
}) {
  const [open, setOpen] = useState(false);
  const current = PERSONA_MAP[persona] || PERSONA_MAP.confidence;
  const isFree = !current.paid && !current.admin;
  return /*#__PURE__*/React.createElement("div", {
    className: "pf-preview"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-preview-bar",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-preview-label"
  }, "Previewing as"), /*#__PURE__*/React.createElement("span", {
    className: "pf-preview-current"
  }, current.name), /*#__PURE__*/React.createElement(IconifyIcon, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 16,
    color: "var(--gray-500)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "pf-preview-panel"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pf-preview-sec"
  }, "Who's looking?"), /*#__PURE__*/React.createElement("div", {
    className: "pf-preview-personas"
  }, PERSONAS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.key,
    type: "button",
    className: "pf-preview-persona" + (p.key === persona ? " on" : ""),
    onClick: () => onPersona(p.key)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-pp-name"
  }, p.name), /*#__PURE__*/React.createElement("span", {
    className: "pf-pp-desc"
  }, p.desc)))), /*#__PURE__*/React.createElement("p", {
    className: "pf-preview-sec"
  }, "Their buckets"), /*#__PURE__*/React.createElement(PreviewToggle, {
    label: "Bought the PROTOX course",
    sub: "Unlocks its lessons + other buyers' comments.",
    checked: toggles.course,
    disabled: isFree,
    onChange: v => onToggle("course", v)
  }), /*#__PURE__*/React.createElement(PreviewToggle, {
    label: "Saved an article to My Learning",
    sub: "Resurfaces it in the feed.",
    checked: toggles.save,
    disabled: isFree,
    onChange: v => onToggle("save", v)
  }), /*#__PURE__*/React.createElement(PreviewToggle, {
    label: "Unfollowed “Mark”",
    sub: "Removes his posts and his saves — nothing else.",
    checked: toggles.mute,
    disabled: isFree,
    onChange: v => onToggle("mute", v)
  })));
}
const PF_USER_POSTS_KEY = "pf-newsfeed-user-posts";
function readUserPosts() {
  try {
    return JSON.parse(localStorage.getItem(PF_USER_POSTS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

/* All posts across the app (own + editorial + gated) — used by Search to
   find posts by hashtag. */
function getAllPosts() {
  return [...readUserPosts(), ...POSTS, ...BUCKET_POSTS];
}
function Feed({
  channel
} = {}) {
  const [posts, setPosts] = useState(() => {
    const base = typeof window !== "undefined" && window.PF_OFFICIAL_ONLY ? officialize(POSTS) : POSTS;
    return [...readUserPosts(), ...base];
  });
  const [state, setState] = useState(() => {
    const m = {};
    [...readUserPosts(), ...POSTS, ...BUCKET_POSTS].forEach(p => {
      m[p.id] = {
        liked: false,
        saved: false,
        actioned: p.actioned,
        likes: p.likes,
        base: p.likes,
        reaction: null,
        shares: p.shares,
        sharesBase: p.shares,
        comments: withIds(p.commentList),
        commentsCount: p.comments
      };
    });
    return m;
  });
  const [sort, setSort] = useState("All");
  const [viewerPersona, setViewerPersona] = useState("confidence");
  const [bucketToggles, setBucketToggles] = useState({
    course: false,
    save: false,
    mute: false
  });
  const [upgradeFor, setUpgradeFor] = useState(null);
  const toggle = (id, key) => setState(s => ({
    ...s,
    [id]: {
      ...s[id],
      [key]: !s[id][key]
    }
  }));

  /* the bucket-merged block (channel ladder / course / My Learning / general)
     is spliced in right after the first editorial post, exactly where the
     single hard-coded CHANNEL_POST used to sit — everything else about the
     editorial list is untouched. */
  const viewerCurrent = PERSONA_MAP[viewerPersona] || PERSONA_MAP.confidence;
  const isFreeViewer = !viewerCurrent.paid && !viewerCurrent.admin;
  const bucketResolved = resolveBucketFeed(viewerPersona, bucketToggles);
  const feedItems = posts.length ? [{
    item: posts[0],
    mode: "full"
  }, ...bucketResolved, ...posts.slice(1).map(p => ({
    item: p,
    mode: "full"
  }))] : bucketResolved;

  /* a channel (Confidence/Mastery/Freedom/Inner Circle) narrows the feed
     down to just that bucket's posts — used by the Community page's channel
     switcher so picking "Mastery" shows only Mastery posts, etc. Access
     still runs through resolveBucketFeed, so a channel the viewer hasn't
     unlocked renders its normal teaser/upgrade card instead of the post. */
  const visibleFeedItems = channel ? bucketResolved.filter(({
    item: p
  }) => p.bucket === channel) : feedItems;
  return /*#__PURE__*/React.createElement("main", {
    className: "feed",
    "data-screen-label": "Home feed"
  }, !channel && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(FeedPreviewPanel, {
    persona: viewerPersona,
    onPersona: setViewerPersona,
    toggles: bucketToggles,
    onToggle: (k, v) => setBucketToggles(t => ({
      ...t,
      [k]: v
    }))
  }), /*#__PURE__*/React.createElement(SortBar, {
    value: sort,
    onCycle: () => setSort(SORTS[(SORTS.indexOf(sort) + 1) % SORTS.length])
  })), visibleFeedItems.map(({
    item: p,
    mode
  }) => {
    if (mode === "teaser") {
      return /*#__PURE__*/React.createElement(TeaserPost, {
        key: p.id,
        post: p,
        onUpgrade: () => setUpgradeFor(p)
      });
    }
    const st = state[p.id] || {};
    const onToggleLike = () => setState(s => {
      const cur = s[p.id];
      const reaction = cur.reaction ? null : "like";
      return {
        ...s,
        [p.id]: {
          ...cur,
          reaction,
          liked: !!reaction,
          likes: reaction ? bump(cur.base) : cur.base
        }
      };
    });
    const onAddComment = text => setState(s => {
      const cur = s[p.id];
      const c = {
        _id: "c" + Date.now(),
        author: {
          name: ME.name,
          avatar: ME.avatar,
          seals: ["gb", "verified"]
        },
        text,
        replies: []
      };
      return {
        ...s,
        [p.id]: {
          ...cur,
          comments: [c, ...cur.comments],
          commentsCount: bump(cur.commentsCount)
        }
      };
    });
    /* community-channel content (Confidence/Mastery/Freedom/Inner Circle)
       merges into this same paid newsfeed, just tagged with its channel —
       not split into a separate surface — so it gets the compact card. */
    if (p.channel) {
      return /*#__PURE__*/React.createElement(ChannelFeedCard, {
        key: p.id,
        post: p,
        st: st,
        onToggleLike: onToggleLike,
        onAddComment: onAddComment,
        onSave: () => toggle(p.id, "saved"),
        onShare: () => setState(s => {
          const cur = s[p.id];
          return {
            ...s,
            [p.id]: {
              ...cur,
              shares: bump(cur.sharesBase)
            }
          };
        })
      });
    }
    if (p.bucket === "coursecomment") {
      return /*#__PURE__*/React.createElement(CourseCommentCard, {
        key: p.id,
        post: p,
        st: st,
        onToggleLike: onToggleLike,
        onAddComment: onAddComment,
        onSave: () => toggle(p.id, "saved"),
        onShare: () => setState(s => {
          const cur = s[p.id];
          return {
            ...s,
            [p.id]: {
              ...cur,
              shares: bump(cur.sharesBase)
            }
          };
        })
      });
    }
    const setReaction = key => setState(s => {
      const cur = s[p.id];
      const reaction = cur.reaction === key ? null : key;
      return {
        ...s,
        [p.id]: {
          ...cur,
          reaction,
          liked: !!reaction,
          likes: reaction ? bump(cur.base) : cur.base
        }
      };
    });
    return /*#__PURE__*/React.createElement(FeedPost, {
      key: p.id,
      post: p,
      st: st,
      hideTags: isFreeViewer,
      onToggleLike: onToggleLike,
      onReact: setReaction,
      onAddComment: onAddComment,
      onAddReply: (cid, text) => setState(s => {
        const cur = s[p.id];
        const comments = cur.comments.map(c => c._id === cid ? {
          ...c,
          replies: [...(c.replies || []), {
            author: {
              name: ME.name,
              avatar: ME.avatar,
              seals: ["gb", "verified"]
            },
            text
          }]
        } : c);
        return {
          ...s,
          [p.id]: {
            ...cur,
            comments,
            commentsCount: bump(cur.commentsCount)
          }
        };
      }),
      onShare: () => setState(s => {
        const cur = s[p.id];
        return {
          ...s,
          [p.id]: {
            ...cur,
            shares: bump(cur.sharesBase)
          }
        };
      }),
      onSave: () => toggle(p.id, "saved")
    });
  }), upgradeFor && /*#__PURE__*/React.createElement(UpgradeModal, {
    label: (BUCKET_META[upgradeFor.bucket] || {}).label,
    bucket: upgradeFor.bucket,
    currentTier: viewerCurrent.paid && !viewerCurrent.admin ? viewerPersona : null,
    onClose: () => setUpgradeFor(null)
  }));
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
  document.querySelectorAll("#pf-root nav > button").forEach(b => {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      "--action-primary": t.accent,
      "--action-primary-hover": "color-mix(in srgb, " + t.accent + ", var(--black) 12%)",
      "--r-md": t.radius + "px",
      "--feed-w": t.feedWidth + "px"
    }
  }, !window.PF_EMBED && /*#__PURE__*/React.createElement(TopNav, {
    active: "Home",
    user: ME,
    logoSrc: "assets/profinity-academy-logo-full.png",
    onNavigate: label => {
      var u = {
        Profile: "Profile.html",
        "My Learning": "MyLearning.html",
        Community: "Community.html",
        Agent: "Agent.html"
      }[label];
      if (u) (window.pfGo || function (x) {
        window.location.href = x;
      })(u);
    },
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement(LeftRail, null), /*#__PURE__*/React.createElement(Feed, null), /*#__PURE__*/React.createElement(RightRail, null)), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Brand"
  }), /*#__PURE__*/React.createElement(TweakColor, {
    label: "Action accent",
    value: t.accent,
    options: ACCENTS,
    onChange: v => setTweak("accent", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Layout"
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Card radius",
    value: t.radius,
    min: 6,
    max: 20,
    unit: "px",
    onChange: v => setTweak("radius", v)
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Feed width",
    value: t.feedWidth,
    min: 540,
    max: 680,
    step: 10,
    unit: "px",
    onChange: v => setTweak("feedWidth", v)
  })));
}

/* Expose the feed + events so other pages (Community) can reuse them without
   duplicating the reaction/comment logic. CommentComposer + ReactTrigger are
   exposed so standalone pages (e.g. lesson detail) get the same comment
   composer + Like control instead of rebuilding them. */
window.PFApp = {
  Feed,
  EVENTS,
  ME,
  pfTagActiveNav,
  LeftRail,
  RightRail,
  getAllPosts,
  CommentComposer,
  ReactTrigger
};
if (!window.PF_EMBED) {
  ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(App, null));
}
