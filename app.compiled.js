function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ===========================================================================
   PROfinity Academy — Newsfeed
   Composed from the bound Profinity Design System bundle
   (window.ProfinityDesignSystem_c2b5cc). Layout + a few rail cards the bundle
   doesn't ship are built here with DS primitives (Card/Avatar/Icon/Button/…)
   and DS tokens only. No raw hex, no restyled look-alikes of bundle parts.
   =========================================================================== */
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
  CommentItem
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
  drTim: "assets/avatar-drtim.png"
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
  avatar: "assets/profinity-diamond.png",
  seals: ["verified", "gold"]
};
function officialize(list) {
  return list.map(p => p.channel ? p : {
    ...p,
    author: PROFINITY,
    withOthers: null
  });
}

/* A member you follow posted in the Confidence channel — surfaced in Home. */
const CHANNEL_POST = {
  id: "ch1",
  author: {
    name: "Dr. Sarah Collins",
    avatar: "assets/avatar-katy.jpg",
    seals: ["gb", "verified"]
  },
  channel: {
    name: "#Confidence · Community",
    avatar: "assets/profinity-icon.jpg",
    by: "Dr. Sarah Collins",
    byAvatar: "assets/avatar-katy.jpg",
    time: "2d"
  },
  time: "2 Days Ago",
  kind: "COMMUNITY:",
  kindIcon: "lucide:users",
  media: ["assets/clinic-lip-design.png"],
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
const CASE_BODY = "Dr. Emily utilised a comprehensive full-face strategy, emphasising midface enhancement, support around the mouth, and delicate contouring methods. She implemented the 3-Step Confidence Framework within PROfinity.";
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
      seals: ["gb", "verified"]
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
  kind: "CASE STUDY:",
  kindIcon: "lucide:chart-pie",
  media: [IMG.collage, IMG.techTuesday],
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
  kind: "PROTOCOL:",
  kindIcon: "lucide:clipboard-list",
  media: [IMG.courseLip, IMG.lip],
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
  kind: "DISCUSSION:",
  kindIcon: "lucide:trending-up",
  media: [IMG.artCodes],
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
  kind: "COMMUNITY:",
  kindIcon: "lucide:users",
  media: [IMG.courseProtox, IMG.toxin],
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
  kind: "MASTERCLASS:",
  kindIcon: "lucide:play",
  sample: {
    type: "video",
    poster: IMG.drTim,
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
  kind: "REEL:",
  kindIcon: "lucide:smartphone",
  sample: {
    type: "vertical",
    image: IMG.courseLip
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
  kind: "CASE STUDY:",
  kindIcon: "lucide:images",
  sample: {
    type: "gallery",
    images: [IMG.collage, IMG.courseTemple, IMG.lip, IMG.courseLip, IMG.toxin, IMG.courseProtox, IMG.gold, IMG.artCodes, IMG.techTuesday, IMG.drTim]
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
  }, group.rooms.map((r, i) => /*#__PURE__*/React.createElement(ChannelItem, _extends({
    key: i
  }, r)))));
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
  }, "#", t.rank, " \u2013 ", /*#__PURE__*/React.createElement("span", {
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
  }, EVENTS.map((e, i) => /*#__PURE__*/React.createElement(EventCard, _extends({
    key: i
  }, e))))), /*#__PURE__*/React.createElement(AddToFeed, null), /*#__PURE__*/React.createElement(MembershipCard, null));
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
  key: "care",
  label: "Care",
  icon: "fluent-emoji-flat:hugging-face",
  flat: "fluent:emoji-16-filled",
  color: "--premium-orange"
}, {
  key: "haha",
  label: "Haha",
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
  key: "sad",
  label: "Sad",
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
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    className: "pf-react-bar",
    role: "menu",
    "aria-label": "Pick a reaction",
    style: {
      position: "fixed",
      left: at.x,
      top: at.y - 10,
      transform: "translateY(-100%)",
      zIndex: 200
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
  }))));
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
      x: rect.left - 6,
      y: rect.top
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
    placeholder: "Write an article or share an update\u2026",
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
  }, "Liked by ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--text-primary)",
      fontWeight: "var(--fw-semibold)"
    }
  }, "Jessica Hue"), " and ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--text-primary)",
      fontWeight: "var(--fw-semibold)"
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
  }, post.author.name), /*#__PURE__*/React.createElement("div", {
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
  }, c.author.name), /*#__PURE__*/React.createElement("span", {
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
  }, rep.author.name)), /*#__PURE__*/React.createElement("div", {
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
    placeholder: "Add a comment\u2026",
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
      color: "rgb(0, 0, 0)"
    }
  }, text), (overflowing || expanded) && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-seemore",
    onClick: () => setExpanded(v => !v)
  }, expanded ? "See less" : more));
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
    "aria-label": "People you follow who reacted \u2014 drag one away to hide it"
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
    className: "chx-name",
    style: {
      fontWeight: "600",
      fontSize: "15px"
    }
  }, channel.name), /*#__PURE__*/React.createElement("div", {
    className: "chx-by"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: channel.by,
    src: channel.byAvatar,
    size: 22
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, channel.by), " \xB7 ", channel.time, " \xB7 "), /*#__PURE__*/React.createElement("span", {
    className: "chx-flag"
  }, "\uD83C\uDDEC\uD83C\uDDE7"))), /*#__PURE__*/React.createElement("button", {
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
  }, idx + 1, "/", sample.images.length));
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
    placeholder: "Write a comment\u2026",
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
  })))), /*#__PURE__*/React.createElement("span", null, "Liked by ", /*#__PURE__*/React.createElement("b", null, "Jessica Hue"), " and ", /*#__PURE__*/React.createElement("b", null, "others")));
}
function FeedPost({
  post,
  st,
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
      x: r.left - 6,
      y: r.top
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
  }), /*#__PURE__*/React.createElement(PostCard, _extends({}, post, {
    commentList: [],
    media: post.sample ? [] : post.media,
    body: post.sample ? /*#__PURE__*/React.createElement("span", {
      className: "pf-clampwrap"
    }, /*#__PURE__*/React.createElement(SampleMedia, {
      sample: post.sample
    }), /*#__PURE__*/React.createElement(ClampText, {
      text: post.body
    })) : /*#__PURE__*/React.createElement(ClampText, {
      text: post.body,
      more: post.channel ? "Learn More" : "See more"
    }),
    liked: st.liked,
    saved: st.saved,
    actioned: false,
    likes: st.likes,
    shares: st.shares,
    comments: st.commentsCount,
    onLike: handleLike,
    onSave: onSave,
    onComment: handleComment,
    onShare: handleShare,
    style: {
      boxShadow: "none",
      border: "none",
      borderRadius: 0,
      background: "transparent"
    }
  })), inlineBubbles && hasRegion && /*#__PURE__*/React.createElement("div", {
    className: "comments-region",
    style: {
      borderTop: "1px solid var(--border-default)",
      padding: "4px 16px 16px"
    }
  }, composerOpen && /*#__PURE__*/React.createElement(CommentComposer, {
    placeholder: "Write a comment\u2026",
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
    placeholder: "Write a comment\u2026",
    autoFocus: true,
    onSubmit: t => onAddComment(t)
  }), comments.map(c => /*#__PURE__*/React.createElement("div", {
    key: c._id,
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(CommentItem, _extends({}, c, {
    reactions: null,
    reactionCount: null,
    replies: []
  })), /*#__PURE__*/React.createElement("div", {
    className: "cmt-actions",
    style: {
      marginLeft: 48
    }
  }, /*#__PURE__*/React.createElement(ReactTrigger, null), /*#__PURE__*/React.createElement("span", {
    className: "cmt-dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
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
  }, /*#__PURE__*/React.createElement(CommentItem, _extends({}, rep, {
    reactions: null,
    reactionCount: null,
    replies: [],
    avatarSize: 30
  })), /*#__PURE__*/React.createElement("div", {
    className: "cmt-actions",
    style: {
      marginLeft: 42
    }
  }, /*#__PURE__*/React.createElement(ReactTrigger, null), /*#__PURE__*/React.createElement("span", {
    className: "cmt-dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
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
  }))))), commentSheet && comments.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "comments-region cm-preview-region",
    style: {
      padding: "0px",
      margin: "24px 0px 0px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmt-preview",
    role: "button",
    tabIndex: 0,
    onClick: () => setSheetOpen(true),
    onKeyDown: e => {
      if (e.key === "Enter") setSheetOpen(true);
    }
  }, /*#__PURE__*/React.createElement(CommentItem, _extends({}, comments[0], {
    reactions: null,
    reactionCount: null,
    replies: []
  }))), comments.length > 1 && /*#__PURE__*/React.createElement("button", {
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
  }));
}
function Feed() {
  const [posts, setPosts] = useState(typeof window !== "undefined" && window.PF_OFFICIAL_ONLY ? [officialize(POSTS)[0], CHANNEL_POST, ...officialize(POSTS).slice(1)] : POSTS);
  const [state, setState] = useState(() => {
    const m = {};
    [...POSTS, CHANNEL_POST].forEach(p => {
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
  const toggle = (id, key) => setState(s => ({
    ...s,
    [id]: {
      ...s[id],
      [key]: !s[id][key]
    }
  }));
  const addPost = text => {
    const id = "u" + Date.now();
    setPosts(ps => [{
      id,
      author: {
        name: ME.name,
        avatar: ME.avatar,
        seals: ["gb", "verified"]
      },
      time: "Just now",
      kind: "UPDATE:",
      kindIcon: "lucide:message-circle",
      media: [],
      body: text,
      likes: "0",
      comments: "0",
      shares: "0",
      commentList: []
    }, ...ps]);
    setState(s => ({
      ...s,
      [id]: {
        liked: false,
        saved: false,
        actioned: false,
        likes: "0",
        base: "0",
        reaction: null,
        shares: "0",
        sharesBase: "0",
        comments: [],
        commentsCount: "0"
      }
    }));
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "feed",
    "data-screen-label": "Home feed"
  }, /*#__PURE__*/React.createElement(SortBar, {
    value: sort,
    onCycle: () => setSort(SORTS[(SORTS.indexOf(sort) + 1) % SORTS.length])
  }), posts.map(p => {
    const st = state[p.id] || {};
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
      onToggleLike: () => setState(s => {
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
      }),
      onReact: setReaction,
      onAddComment: text => setState(s => {
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
      }),
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
  }, /*#__PURE__*/React.createElement(TopNav, {
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
   duplicating the reaction/comment logic. */
window.PFApp = {
  Feed,
  EVENTS,
  ME,
  pfTagActiveNav,
  LeftRail,
  RightRail
};
if (!window.PF_EMBED) {
  ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(App, null));
}