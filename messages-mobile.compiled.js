/* ===========================================================================
   PROfinity — Messages (mobile) · iPhone 17 Pro Max
   Full inbox: Chats · Conference · People · Menu, plus in-page thread,
   profile (person / group), archived / requests / deleted / groups views.
   Renders inside the IOSDevice frame with the shared mobile chrome mounted
   (its top bar is hidden by CSS — this page carries its own header — but the
   side menu / notifications / messages drawers keep working).
   Suffixed -DM: Babel text/babel scripts share one global scope.
   MessagesWeb.html runs the same file compiled, with window.PF_DM_WEB = true
   (see DM_WEB below) — desktop three-column layout, messages-web.css.
   =========================================================================== */
const {
  useState: useStateDM,
  useEffect: useEffectDM,
  useRef: useRefDM,
  useMemo: useMemoDM,
  useCallback: useCallbackDM
} = React;
const DSDM = window.ProfinityDesignSystem_c2b5cc;
const MobileChromeDM = window.MobileChromeC;
function goDM(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function paramDM(name) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch (e) {
    return null;
  }
}

/* window.PF_DM_WEB = true (MessagesWeb.html) — the same app renders as a
   desktop two-pane messenger under the DS TopNav: icon rail · conversation
   list · open thread, with the bottom sheets shown as centred dialogs
   (messages-web.css). Mobile pages linked from here swap for their web twins. */
const DM_WEB = !!window.PF_DM_WEB;
const DM_WEB_HREFS = {
  "NewsfeedMobile.html": "NewsfeedWeb.html",
  "ProfileMobile.html": "Profile.html",
  "NotificationSettings.html": "NotificationSettingsWeb.html",
  "Messages.html": "MessagesWeb.html"
};
function hrefDM(url) {
  if (!DM_WEB) return url;
  const parts = String(url).split("?"),
    web = DM_WEB_HREFS[parts[0]];
  return web ? web + (parts[1] ? "?" + parts[1] : "") : url;
}
function navigateWebDM(label) {
  const u = {
    Home: "NewsfeedWeb.html",
    Community: "Community.html",
    "My Learning": "MyLearning.html",
    Agent: "Agent.html",
    Profile: "Profile.html",
    Rewards: "RewardsWeb.html"
  }[label];
  if (u) goDM(u);
}
/* A contact's profile page — profile-link.js when present (same slug rules
   as every other avatar), else the ?id=&name=&avatar=&role= viewer contract. */
function profileHrefDM(p, from) {
  const PL = window.PFProfileLink;
  if (PL && PL.url) {
    const u = PL.url({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      role: p.role
    }, {
      web: DM_WEB,
      from
    });
    if (u) return u;
  }
  const q = new URLSearchParams({
    id: p.id,
    name: p.name || ""
  });
  if (p.avatar) q.set("avatar", p.avatar);
  if (p.role) q.set("role", p.role);
  if (from) q.set("from", from);
  return (DM_WEB ? "Profile.html?" : "ProfileMobile.html?") + q.toString();
}

/* ---------------------------------------------------------------------------
   Time helpers — seeds are stored as "minutes ago" and resolved to epoch ms
   once at load, so the inbox always reads as live.
   --------------------------------------------------------------------------- */
const NOW_DM = Date.now();
const MIN_DM = 60 * 1000;
const EDIT_WINDOW_DM = 5 * MIN_DM;
const DAYS_DM = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_DM = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtClockDM(ts) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + (m < 10 ? "0" : "") + m + " " + ap;
}
function fmtListTimeDM(ts) {
  const d = new Date(ts),
    n = new Date();
  if (d.toDateString() === n.toDateString()) return fmtClockDM(ts);
  const y = new Date(n);
  y.setDate(n.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  if ((n - d) / 86400000 < 6) return DAYS_DM[d.getDay()];
  return d.getDate() + " " + MONTHS_DM[d.getMonth()];
}
function fmtCountdownDM(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + s % 60;
}
function presenceDM(p) {
  if (!p) return "";
  if (p.online) return "Active now";
  const m = p.lastActive || 0;
  if (m < 60) return "Active " + m + "m ago";
  if (m < 1440) return "Active " + Math.round(m / 60) + "h ago";
  if (m < 2880) return "Active yesterday";
  return "Active " + Math.round(m / 1440) + "d ago";
}

/* ---------------------------------------------------------------------------
   People — one photo per person. Only a handful of portraits exist in the
   design system; everyone else falls back to initials via DMFace.
   --------------------------------------------------------------------------- */
const ME_DM = {
  id: "me",
  name: "Katy Wilson",
  avatar: "assets/avatar-katy.jpg",
  role: "Registered Nurse",
  online: true,
  seals: ["gb", "verified"]
};
const PEOPLE_SEED_DM = [{
  id: "tim",
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  role: "Aesthetic Physician · Founder",
  online: true,
  seals: ["gb", "gold", "verified", "crown"],
  email: "tim.pearce@allcaremedical.co.uk",
  clinic: "Allcare Medical",
  website: "allcaremed.com",
  instagram: "@drtimpearce",
  media: ["assets/post1-img1.png", "assets/post1-img2.png", "assets/post1-img3.png"]
}, {
  id: "miranda",
  name: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  role: "Practice Manager",
  online: false,
  lastActive: 12,
  seals: ["gb", "verified"],
  email: "miranda.pearce@allcaremedical.co.uk",
  clinic: "Allcare Medical",
  website: "allcaremed.com",
  instagram: "@miranda_pearce",
  media: ["assets/clinic-lip-design.png", "assets/clinic-toxin-guide.png", "assets/clinic-treatment-collage.png"]
}, {
  id: "sarahc",
  name: "Dr. Sarah Collins",
  avatar: "assets/avatar-sarah-collins.jpg",
  role: "Aesthetic Physician",
  online: true,
  seals: ["gb", "gold", "verified"],
  email: "sarah.collins@collinsaesthetics.co.uk",
  clinic: "Collins Aesthetics",
  website: "collinsaesthetics.co.uk",
  instagram: "@drsarahcollins",
  media: ["assets/post2-img1.png", "assets/post2-img2.png", "assets/post2-img3.png"]
}, {
  id: "amir",
  name: "Dr Amir Khan",
  avatar: "assets/avatar-amir-khan.jpg",
  role: "Dental Surgeon",
  online: false,
  lastActive: 45,
  seals: ["gb", "verified"],
  email: "amir.khan@smilehouse.co.uk",
  clinic: "Smile House Dental",
  website: "smilehouse.co.uk",
  instagram: "@dramirkhan"
}, {
  id: "mark",
  name: "Mark Ellis",
  avatar: "assets/avatar-mark-ellis.jpg",
  role: "Clinic Owner",
  online: true,
  seals: ["gb"],
  email: "mark@ellisclinics.co.uk",
  clinic: "Ellis Clinics",
  website: "ellisclinics.co.uk",
  instagram: "@markellisclinics"
}, {
  id: "beth",
  name: "Nurse Beth",
  avatar: "assets/avatar-nurse-beth.jpg",
  role: "Aesthetic Nurse",
  online: false,
  lastActive: 180,
  seals: ["gb", "verified"],
  email: "beth@glowclinic.co.uk",
  clinic: "Glow Clinic",
  website: "glowclinic.co.uk",
  instagram: "@nursebeth.aesthetics"
}, {
  id: "priya",
  name: "Priya Shah",
  avatar: "assets/avatar-priya-shah.jpg",
  role: "Nurse Prescriber",
  online: true,
  seals: ["gb", "verified"],
  email: "priya@shahaesthetics.co.uk",
  clinic: "Shah Aesthetics",
  website: "shahaesthetics.co.uk",
  instagram: "@priyashah.np"
}, {
  id: "sarah",
  name: "Dr Sarah Kim",
  avatar: null,
  role: "Clinical Nurse Specialist",
  online: true,
  seals: ["gb", "verified"],
  email: "sarah.kim@allcaremedical.co.uk",
  clinic: "Allcare Medical",
  website: "allcaremed.com",
  instagram: "@sarah_kim_aesthetics"
}, {
  id: "emily",
  name: "Dr Emily Tran",
  avatar: null,
  role: "Aesthetic Physician",
  online: false,
  lastActive: 1440,
  seals: ["gb", "gold", "verified"],
  email: "emily.tran@allcaremedical.co.uk",
  clinic: "Allcare Medical",
  website: "allcaremed.com",
  instagram: "@emily_tran_md"
}, {
  id: "james",
  name: "Dr James Brown",
  avatar: null,
  role: "Aesthetic Physician",
  online: false,
  lastActive: 2900,
  seals: ["gb", "verified", "crown"],
  email: "james.brown@allcaremedical.co.uk",
  clinic: "Allcare Medical",
  website: "allcaremed.com",
  instagram: "@james_brown_aesthetics"
}, {
  id: "alex",
  name: "Dr Alex Chen",
  avatar: null,
  role: "Clinical Nurse Specialist",
  online: true,
  seals: ["gb", "gold", "verified"],
  email: "alex.chen@allcaremedical.co.uk",
  clinic: "Allcare Medical",
  website: "allcaremed.com",
  instagram: "@alex_chen_rn"
}, {
  id: "hannah",
  name: "Dr Hannah Reid",
  avatar: null,
  role: "GP with Special Interest",
  online: false,
  lastActive: 25,
  seals: ["gb"],
  email: "hannah.reid@reidmedical.co.uk",
  clinic: "Reid Medical",
  website: "reidmedical.co.uk",
  instagram: "@drhannahreid"
}, /* request senders — not followed yet */
{
  id: "omar",
  name: "Dr Omar Farouk",
  avatar: null,
  role: "Nurse Prescriber",
  online: false,
  lastActive: 95,
  seals: ["gb"],
  request: true
}, {
  id: "lucy",
  name: "Lucy Bennett",
  avatar: null,
  role: "Skin Therapist",
  online: true,
  seals: [],
  request: true
}];

/* Conversations — `ago` is minutes before load; resolved to `ts` by buildSeedDM. */
const CONVERSATIONS_SEED_DM = [{
  id: "tim",
  kind: "dm",
  personId: "tim",
  unread: 2,
  messages: [{
    from: "tim",
    text: "Hey Katy! I saw your post about the full-face rejuvenation case.",
    ago: 138
  }, {
    from: "me",
    text: "Thank you! It was a great result, patient was thrilled.",
    ago: 130
  }, {
    from: "tim",
    text: "Do you mind if I share it with my team as a reference?",
    ago: 125
  }, {
    from: "me",
    text: "Of course, go ahead — sharing the write-up now.",
    image: "assets/post1-img1.png",
    ago: 122
  }, {
    from: "tim",
    text: "Thanks for sharing the case study. Really helpful!",
    ago: 120,
    reactions: {
      "❤️": ["me"]
    }
  }, {
    from: "tim",
    text: "Could you also add the product volumes per zone? The team will ask.",
    ago: 18
  }]
}, {
  id: "g-casereview",
  kind: "group",
  name: "Clinical Case Review",
  memberIds: ["tim", "sarahc", "alex"],
  roles: {
    tim: "Admin",
    sarahc: "Moderator"
  },
  pinned: true,
  unread: 3,
  messages: [{
    from: "sarahc",
    text: "Uploading tonight's case: 34F, mid-face volume loss, 2ml Voluma.",
    image: "assets/post2-img1.png",
    ago: 95
  }, {
    from: "tim",
    text: "Great case. Watch the infraorbital hollow — go deep, small boluses.",
    ago: 90
  }, {
    from: "me",
    text: "Would you cannula or needle for the zygoma here?",
    ago: 84
  }, {
    from: "alex",
    text: "Cannula for the lateral cheek, needle for the bony apex.",
    ago: 80,
    reactions: {
      "👍": ["tim", "me"]
    }
  }, {
    from: "sarahc",
    text: "Agreed. I'll bring the 4-week follow-up photos to Thursday's call.",
    ago: 30
  }, {
    from: "tim",
    text: "Katy, can you present your lip case at the review too?",
    ago: 9
  }]
}, {
  id: "sarah",
  kind: "dm",
  personId: "sarah",
  unread: 1,
  messages: [{
    from: "sarah",
    text: "Are you free to go over the Q3 protocol updates this week?",
    ago: 200
  }, {
    from: "me",
    text: "Yes, Thursday afternoon works for me.",
    ago: 190
  }, {
    from: "sarah",
    text: "Looking forward to our next meeting!",
    ago: 60
  }]
}, {
  id: "emily",
  kind: "dm",
  personId: "emily",
  unread: 3,
  messages: [{
    from: "emily",
    text: "Just finished reviewing the patient satisfaction data.",
    ago: 75
  }, {
    from: "emily",
    text: "There's a trend worth flagging in the 45+ age group.",
    ago: 70
  }, {
    from: "emily",
    text: "I have some additional insights to share.",
    ago: 62
  }]
}, {
  id: "g-lipmasters",
  kind: "group",
  name: "8D Lip Masters",
  memberIds: ["beth", "priya", "miranda", "amir"],
  roles: {
    miranda: "Admin"
  },
  unread: 0,
  messages: [{
    from: "beth",
    text: "Anyone else finding the vermilion border tricky at 8D step 6?",
    ago: 1500
  }, {
    from: "priya",
    text: "Yes! Slower injection and less product helped me.",
    ago: 1490
  }, {
    from: "me",
    text: "Same — I switched to a 30G and it made a big difference.",
    ago: 1480,
    reactions: {
      "👍": ["beth", "priya"]
    }
  }, {
    from: "miranda",
    text: "Reminder: Technique Tuesday covers exactly this next week 🎉",
    ago: 1470
  }]
}, {
  id: "james",
  kind: "dm",
  personId: "james",
  unread: 0,
  muted: true,
  messages: [{
    from: "me",
    text: "Sent over the full results deck this morning.",
    ago: 2900
  }, {
    from: "james",
    text: "Can we discuss the implications of the results?",
    ago: 2880
  }]
},
/* Alex is the empty-conversation sample: a contact with no messages yet,
   so the list shows "Start the conversation" and the thread its empty state. */
{
  id: "alex",
  kind: "dm",
  personId: "alex",
  unread: 0,
  messages: []
}, {
  id: "miranda",
  kind: "dm",
  personId: "miranda",
  unread: 0,
  messages: [{
    from: "me",
    text: "Sharing the confidence-score writeup with you now.",
    ago: 4300
  }, {
    from: "miranda",
    text: "Perfect, thank you — this is exactly what I needed.",
    ago: 4290
  }]
}, {
  id: "amir",
  kind: "dm",
  personId: "amir",
  unread: 0,
  messages: [{
    from: "amir",
    text: "Katy, the dental block technique video is live in the Mastery library.",
    ago: 5800
  }, {
    from: "me",
    text: "Brilliant, watching it tonight. Thanks Amir!",
    ago: 5790
  }]
}, {
  id: "mark",
  kind: "dm",
  personId: "mark",
  unread: 0,
  messages: [{
    from: "mark",
    text: "Quick one — what CRM are you using for recall reminders?",
    ago: 7300
  }, {
    from: "me",
    text: "We moved to Pabau last quarter, happy to walk you through it.",
    ago: 7290
  }, {
    from: "mark",
    text: "That would be great, thanks!",
    ago: 7280
  }]
}, {
  id: "beth",
  kind: "dm",
  personId: "beth",
  unread: 0,
  messages: [{
    from: "beth",
    text: "Loved your consultation framework post 🙌",
    ago: 8700
  }, {
    from: "me",
    text: "Thanks Beth! Ping me if you want the template.",
    ago: 8690
  }]
}, {
  id: "priya",
  kind: "dm",
  personId: "priya",
  unread: 0,
  messages: [{
    from: "priya",
    text: "Are you going to the London masterclass in October?",
    ago: 10100
  }, {
    from: "me",
    text: "Booked! See you there.",
    ago: 10090
  }]
}, {
  id: "hannah",
  kind: "dm",
  personId: "hannah",
  unread: 0,
  archived: true,
  messages: [{
    from: "hannah",
    text: "Thanks for the referral pathway notes.",
    ago: 20000
  }, {
    from: "me",
    text: "Anytime, Hannah.",
    ago: 19990
  }]
}, {
  id: "g-cohort12",
  kind: "group",
  name: "Confidence Cohort 12",
  memberIds: ["sarah", "emily", "james", "hannah"],
  roles: {
    sarah: "Admin"
  },
  unread: 0,
  archived: true,
  messages: [{
    from: "emily",
    text: "Congrats everyone on completing the pathway!",
    ago: 40000
  }, {
    from: "me",
    text: "What a cohort 🎓",
    ago: 39990
  }]
}];
const REQUESTS_SEED_DM = [{
  id: "omar",
  personId: "omar",
  text: "Hi Katy — I'm a new nurse prescriber and loved your lip case write-up. Would you be open to a quick chat?",
  ago: 95
}, {
  id: "lucy",
  personId: "lucy",
  text: "Hello! Miranda suggested I reach out about clinic systems.",
  ago: 400
}];
const CONFERENCES_DM = [{
  id: "c1",
  name: "Case Study Discussion",
  hostId: "tim",
  speakerIds: ["rachel", "michelle"],
  attendeeIds: ["me", "jordan", "alexm", "nadia", "sarahc", "priya", "alex", "beth"],
  count: 100,
  live: true,
  startedAgo: 150,
  scope: "public",
  desc: "Easily engage in discussions! Anyone with the link can join without limits on the number of participants.",
  link: "profinity.app/voice/abc123"
}, {
  id: "c2",
  name: "Business Growth Sync",
  hostId: "miranda",
  speakerIds: ["mark"],
  attendeeIds: ["me", "priya"],
  count: 14,
  live: false,
  scope: "invited",
  when: "Tomorrow · 10:00 AM",
  desc: "Recall systems & retention — bring this month's numbers.",
  link: "profinity.app/voice/bgs204"
}, {
  id: "c3",
  name: "Complications Q&A",
  hostId: "tim",
  speakerIds: ["beth", "amir"],
  attendeeIds: ["me", "sarah", "emily"],
  count: 42,
  live: false,
  scope: "public",
  when: "Thu · 7:00 PM",
  desc: "Vascular occlusion protocol refresh, then open Q&A.",
  link: "profinity.app/voice/cqa771"
}, {
  id: "c4",
  name: "Monthly Team Sync",
  hostId: "miranda",
  ended: true,
  scope: "invited",
  when: "May 10, 2026 · 2:00 PM",
  count: 125,
  duration: 52 * 60 * 1000
}, {
  id: "c5",
  name: "Quarterly Review Meeting",
  hostId: "tim",
  ended: true,
  scope: "public",
  when: "July 15, 2026 · 11:00 AM",
  count: 79,
  duration: 68 * 60 * 1000
}, {
  id: "c6",
  name: "Project Kickoff",
  hostId: "mark",
  ended: true,
  scope: "invited",
  when: "June 30, 2026 · 9:00 AM",
  count: 50,
  duration: 41 * 60 * 1000
}, {
  id: "c7",
  name: "Annual Strategy Session",
  hostId: "tim",
  ended: true,
  scope: "public",
  when: "January 5, 2026 · 1:00 PM",
  count: 100,
  duration: 95 * 60 * 1000
}];
const REACTIONS_QUICK_DM = ["👍", "❤️", "😂", "😮", "🙏", "💉"];
const EMOJI_GROUPS_DM = [{
  key: "smileys",
  label: "Smileys",
  icon: "lucide:smile",
  emojis: ["😀", "😁", "😂", "🤣", "😊", "😍", "🤩", "😘", "😉", "🙂", "🤔", "😅", "🥲", "😎", "🤗", "😴", "😮", "🥳", "😢", "😡"]
}, {
  key: "gestures",
  label: "Gestures",
  icon: "lucide:hand",
  emojis: ["👍", "👎", "👏", "🙌", "🙏", "👋", "✌️", "🤞", "💪", "🤝", "👌", "🫶", "☝️", "✋", "🤙", "👀"]
}, {
  key: "hearts",
  label: "Hearts",
  icon: "lucide:heart",
  emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "🖤", "💖", "💗", "💓", "💞", "💕", "❣️", "💯", "✨"]
}, {
  key: "clinical",
  label: "Clinical",
  icon: "lucide:syringe",
  emojis: ["💉", "🩹", "🩺", "💊", "🧴", "🧪", "🧬", "🔬", "🩻", "🧑‍⚕️", "👩‍⚕️", "👨‍⚕️", "🏥", "🧤", "😷", "🫧"]
}];
const SAMPLE_REPLIES_DM = ["Got it, thanks for the update!", "Sounds good — let's touch base soon.", "Appreciate you sharing this with me.", "Perfect, I'll take a look and get back to you.", "Thanks! That's really helpful."];

/* ---------------------------------------------------------------------------
   Store — seed + localStorage persistence + groups created from the newsfeed
   Messages drawer ("pf-dm-groups").
   --------------------------------------------------------------------------- */
const STORE_KEY_DM = "pf-messages-v1";
const SEED_VERSION_DM = 4;
const PF_GROUPS_KEY_DM = "pf-dm-groups";
let MSG_SEQ_DM = 1;
function midDM() {
  return "m" + NOW_DM.toString(36) + "-" + MSG_SEQ_DM++;
}
function buildSeedDM() {
  return {
    v: SEED_VERSION_DM,
    people: [],
    conversations: CONVERSATIONS_SEED_DM.map(c => ({
      ...c,
      messages: c.messages.map(m => ({
        id: midDM(),
        from: m.from,
        text: m.text,
        image: m.image || null,
        ts: NOW_DM - m.ago * MIN_DM,
        reactions: m.reactions || {}
      }))
    })),
    requests: REQUESTS_SEED_DM.map(r => ({
      ...r,
      ts: NOW_DM - r.ago * MIN_DM
    })),
    deleted: []
  };
}
function readGroupsDM() {
  try {
    return JSON.parse(localStorage.getItem(PF_GROUPS_KEY_DM)) || [];
  } catch (e) {
    return [];
  }
}

/* Fold groups created in the newsfeed drawer into the store; members the
   roster doesn't know are added to store.people so every face resolves. */
function mergeExternalGroupsDM(store) {
  const groups = readGroupsDM();
  if (!groups.length) return store;
  const known = new Set(PEOPLE_SEED_DM.map(p => p.id).concat(store.people.map(p => p.id), ["me"]));
  const have = new Set(store.conversations.map(c => c.id).concat(store.deleted.map(c => c.id)));
  let people = store.people,
    conversations = store.conversations,
    changed = false;
  groups.forEach(g => {
    if (have.has(g.id)) return;
    changed = true;
    const memberIds = (g.members || []).map(m => {
      if (!known.has(m.id)) {
        known.add(m.id);
        people = people.concat([{
          id: m.id,
          name: m.name,
          avatar: m.avatar || null,
          role: "Member",
          online: false,
          lastActive: 60,
          seals: []
        }]);
      }
      return m.id;
    });
    conversations = [{
      id: g.id,
      kind: "group",
      name: g.name,
      memberIds,
      roles: {
        me: "Admin"
      },
      unread: 0,
      messages: (g.messages || []).map(m => ({
        id: midDM(),
        from: m.me ? "me" : memberIds.find(id => (people.concat(PEOPLE_SEED_DM).find(p => p.id === id) || {}).name === m.sender) || memberIds[0],
        text: m.text,
        ts: NOW_DM,
        reactions: {}
      }))
    }].concat(conversations);
  });
  return changed ? {
    ...store,
    people,
    conversations
  } : store;
}
function loadStoreDM() {
  let store = null;
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY_DM));
    if (saved && saved.v === SEED_VERSION_DM && Array.isArray(saved.conversations)) store = saved;
  } catch (e) {}
  if (!store) store = buildSeedDM();
  return mergeExternalGroupsDM(store);
}
function saveStoreDM(store) {
  try {
    // Large videos are kept as blob: URLs for this session only; a data: URL (small clip) persists.
    const out = {
      ...store,
      conversations: store.conversations.map(c => ({
        ...c,
        messages: c.messages.map(m => m.video && m.video.src && /^blob:/.test(m.video.src) ? {
          ...m,
          video: {
            ...m.video,
            src: null,
            poster: m.video.poster || null
          }
        } : m)
      }))
    };
    localStorage.setItem(STORE_KEY_DM, JSON.stringify(out));
  } catch (e) {}
  try {
    window.dispatchEvent(new CustomEvent("pf:messages-changed"));
  } catch (e) {} // header badge (web-messages-chrome.js)
}

/* ?id=<slug>&name=&avatar=&role= — the "Message" button contract shared with
   DirectMessage.html and the profile pages: make sure that person is in the
   roster and has a thread so the route initialiser can open it. ?t=<conversation>
   keeps working unchanged. */
function applyDeepLinkDM(store) {
  const id = paramDM("id");
  if (!id || paramDM("t")) return store;
  let out = store;
  const known = PEOPLE_SEED_DM.some(p => p.id === id) || store.people.some(p => p.id === id);
  if (!known) {
    const name = paramDM("name");
    if (!name) return store;
    out = {
      ...out,
      people: out.people.concat([{
        id,
        name,
        avatar: paramDM("avatar") || null,
        role: paramDM("role") || "Member",
        online: false,
        lastActive: 30,
        seals: []
      }])
    };
  }
  if (!out.conversations.some(c => c.kind === "dm" && c.personId === id)) {
    out = {
      ...out,
      conversations: [{
        id,
        kind: "dm",
        personId: id,
        unread: 0,
        messages: []
      }].concat(out.conversations)
    };
  }
  return out;
}

/* Message-level mutations shared by the Messages page and the floating chat
   popups (MessagesChromeDM) — each holds a store in state and passes its setter. */
function useStoreActionsDM(setStore) {
  return useMemoDM(() => {
    const updateConv = (id, fn) => setStore(s => ({
      ...s,
      conversations: s.conversations.map(c => c.id === id ? fn(c) : c)
    }));
    const updateMsg = (id, mid, fn) => updateConv(id, c => ({
      ...c,
      messages: c.messages.map(m => m.id === mid ? fn(m) : m)
    }));
    return {
      updateConv,
      sendMessage: (id, m) => updateConv(id, c => ({
        ...c,
        messages: c.messages.concat([{
          id: midDM(),
          from: m.from,
          text: m.text || "",
          image: m.image || null,
          video: m.video || null,
          sticker: m.sticker || null,
          gif: m.gif || null,
          ts: Date.now(),
          reactions: {}
        }])
      })),
      reactMessage: (id, mid, emoji) => updateMsg(id, mid, m => {
        const r = {
          ...(m.reactions || {})
        };
        const list = (r[emoji] || []).slice();
        const i = list.indexOf("me");
        if (i >= 0) list.splice(i, 1);else list.push("me");
        if (list.length) r[emoji] = list;else delete r[emoji];
        return {
          ...m,
          reactions: r
        };
      }),
      editMessage: (id, mid, text) => updateMsg(id, mid, m => ({
        ...m,
        text,
        edited: true
      })),
      deleteMessage: (id, mid) => updateMsg(id, mid, m => ({
        ...m,
        deleted: true,
        pinned: false,
        reactions: {}
      })),
      pinMessage: (id, mid) => updateMsg(id, mid, m => ({
        ...m,
        pinned: !m.pinned
      })),
      markRead: id => updateConv(id, c => c.unread ? {
        ...c,
        unread: 0
      } : c)
    };
  }, [setStore]);
}

/* Per-conversation customisation (Messenger's "Customize chat"): theme colours
   for my bubbles, the quick-send emoji and member nicknames. */
const CHAT_THEMES_DM = [{
  key: "navy",
  label: "Navy",
  color: "var(--brand-navy)",
  swatch: "#292569"
}, {
  key: "violet",
  label: "Violet",
  color: "#6C63FF",
  swatch: "#6C63FF"
}, {
  key: "ocean",
  label: "Ocean",
  color: "#0A66C2",
  swatch: "#0A66C2"
}, {
  key: "teal",
  label: "Teal",
  color: "#0F8B8D",
  swatch: "#0F8B8D"
}, {
  key: "forest",
  label: "Forest",
  color: "#2F6B3A",
  swatch: "#2F6B3A"
}, {
  key: "gold",
  label: "Gold",
  color: "#B7791F",
  swatch: "#B7791F"
}, {
  key: "rose",
  label: "Rose",
  color: "#D9376E",
  swatch: "#D9376E"
}, {
  key: "ink",
  label: "Ink",
  color: "#1F2937",
  swatch: "#1F2937"
}];
function themeVarsDM(c) {
  const t = CHAT_THEMES_DM.find(x => x.key === (c && c.theme));
  return t && t.key !== "navy" ? {
    "--dm-me": t.color
  } : undefined;
}
function nickDM(c, p) {
  return p ? c && c.nicknames && c.nicknames[p.id] || p.name : "";
}

/* ---------------------------------------------------------------------------
   Small hooks
   --------------------------------------------------------------------------- */
function useIsMobileDM() {
  const [mobile, setMobile] = useStateDM(() => window.matchMedia("(max-width:768px)").matches);
  useEffectDM(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function useDeviceScaleDM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateDM(calc);
  useEffectDM(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}
/* ticking clock — only while `active` (edit-window countdowns) */
function useNowDM(active) {
  const [now, setNow] = useStateDM(Date.now());
  useEffectDM(() => {
    if (!active) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [active]);
  return now;
}
/* long-press (≈480ms, cancels on drag) + context-menu key / right-click.
   Suppresses the trailing click once a long-press has fired. */
/* Photos picked from the device are downscaled to a JPEG data URL so a
   conversation with a few pictures still fits comfortably in localStorage. */
/* Video attachments: grab a poster frame (for the attach bar, bubble and quote) and decide how to keep the file.
   Clips up to VIDEO_INLINE_MAX_DM are read as data: URLs so they survive a reload; anything bigger stays a blob: URL for the session. */
const VIDEO_INLINE_MAX_DM = 2.5 * 1024 * 1024;
function videoPosterDM(src, timeoutMs = 2500) {
  return new Promise(resolve => {
    let done = false;
    const finish = v => {
      if (!done) {
        done = true;
        resolve(v);
      }
    };
    const t = setTimeout(() => finish(null), timeoutMs);
    try {
      const vid = document.createElement("video");
      vid.muted = true;
      vid.playsInline = true;
      vid.preload = "auto";
      vid.src = src;
      vid.onloadeddata = () => {
        try {
          vid.currentTime = Math.min(0.1, (vid.duration || 1) / 2);
        } catch (e) {
          finish(null);
        }
      };
      vid.onseeked = () => {
        try {
          const s = Math.min(1, 640 / Math.max(vid.videoWidth || 1, vid.videoHeight || 1));
          const cv = document.createElement("canvas");
          cv.width = Math.max(1, Math.round(vid.videoWidth * s));
          cv.height = Math.max(1, Math.round(vid.videoHeight * s));
          cv.getContext("2d").drawImage(vid, 0, 0, cv.width, cv.height);
          clearTimeout(t);
          finish(cv.toDataURL("image/jpeg", 0.78));
        } catch (e) {
          clearTimeout(t);
          finish(null);
        }
      };
      vid.onerror = () => {
        clearTimeout(t);
        finish(null);
      };
    } catch (e) {
      clearTimeout(t);
      finish(null);
    }
  });
}
function readVideoDM(file) {
  return new Promise(resolve => {
    const blob = URL.createObjectURL(file);
    const base = {
      name: file.name || "Video",
      size: file.size || 0,
      type: file.type || "video/mp4"
    };
    videoPosterDM(blob).then(poster => {
      if (file.size > VIDEO_INLINE_MAX_DM) {
        resolve({
          ...base,
          src: blob,
          poster,
          session: true
        });
        return;
      }
      const r = new FileReader();
      r.onload = () => {
        URL.revokeObjectURL(blob);
        resolve({
          ...base,
          src: r.result,
          poster,
          session: false
        });
      };
      r.onerror = () => resolve({
        ...base,
        src: blob,
        poster,
        session: true
      });
      r.readAsDataURL(file);
    });
  });
}
function fmtBytesDM(n) {
  return n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";
}
function shrinkImageDM(file, max = 1280) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * s)),
        h = Math.max(1, Math.round(img.height * s));
      try {
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        const out = cv.toDataURL("image/jpeg", 0.82);
        URL.revokeObjectURL(url);
        resolve(out);
      } catch (e) {
        resolve(url);
      }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}
/* Wrap every case-insensitive occurrence of q in <mark> for in-thread search. */
function highlightDM(text, q) {
  if (!q) return text;
  const lower = text.toLowerCase(),
    needle = q.toLowerCase();
  const out = [];
  let i = 0,
    k;
  while ((k = lower.indexOf(needle, i)) >= 0) {
    if (k > i) out.push(text.slice(i, k));
    out.push(/*#__PURE__*/React.createElement("mark", {
      key: k,
      className: "dm-hl"
    }, text.slice(k, k + needle.length)));
    i = k + needle.length;
  }
  if (i < text.length) out.push(text.slice(i));
  return out;
}
function usePressDM(onLongPress, enabled = true) {
  const st = useRefDM({
    timer: null,
    fired: false,
    x: 0,
    y: 0
  });
  const clear = () => {
    if (st.current.timer) {
      window.clearTimeout(st.current.timer);
      st.current.timer = null;
    }
  };
  if (!enabled) return {};
  return {
    onPointerDown: e => {
      if (e.button !== undefined && e.button !== 0) return;
      st.current.fired = false;
      st.current.x = e.clientX;
      st.current.y = e.clientY;
      clear();
      st.current.timer = window.setTimeout(() => {
        st.current.fired = true;
        st.current.timer = null;
        onLongPress();
      }, 480);
    },
    onPointerMove: e => {
      if (!st.current.timer) return;
      if (Math.abs(e.clientX - st.current.x) > 10 || Math.abs(e.clientY - st.current.y) > 10) clear();
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onClickCapture: e => {
      if (st.current.fired) {
        e.stopPropagation();
        e.preventDefault();
        st.current.fired = false;
      }
    },
    onContextMenu: e => {
      e.preventDefault();
      if (st.current.fired) {
        st.current.fired = false;
        return;
      }
      clear();
      onLongPress();
    }
  };
}
/* dock compaction — shrinks on scroll down, restores on scroll up */
function useScrollDockDM(resetKey) {
  const [compact, setCompact] = useStateDM(false);
  const lastY = useRefDM(0);
  useEffectDM(() => {
    setCompact(false);
    lastY.current = 0;
  }, [resetKey]);
  const onScroll = useCallbackDM(e => {
    const y = e.currentTarget.scrollTop;
    const dy = y - lastY.current;
    if (y < 24) setCompact(false);else if (dy > 6) setCompact(true);else if (dy < -6) setCompact(false);
    lastY.current = y;
  }, []);
  return [compact, onScroll];
}

/* ---------------------------------------------------------------------------
   People context — roster lookups resolve seeded + externally-added people
   --------------------------------------------------------------------------- */
const PeopleCtxDM = React.createContext({
  get: () => null,
  all: []
});
function usePeopleDM() {
  return React.useContext(PeopleCtxDM);
}
/* id of the conversation open in the right-hand pane (desktop) — rows highlight */
const ActiveConvCtxDM = React.createContext(null);

/* ---------------------------------------------------------------------------
   Faces — DMFace renders the portrait when one exists, otherwise the DS
   Avatar's initials. `size` is always passed by callers: an omitted size
   falls through to the DS 40px default that no CSS rule can reach.
   Honorifics are stripped so "Dr Sarah Kim" reads SK, not DS.
   --------------------------------------------------------------------------- */
function stripHonorificDM(name) {
  return String(name || "").replace(/^(dr\.?|nurse|prof\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "").trim();
}
function DMFace({
  name,
  src,
  size = 40,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement(DSDM.Avatar, {
    name: stripHonorificDM(name),
    src: src || undefined,
    size: size,
    className: className,
    style: {
      fontSize: Math.round(size * 0.38),
      ...(style || {})
    }
  });
}
/* Two overlapped faces for a group — each variant is absolutely positioned
   in its own rule; the front face gets a card-coloured ring. */
function GroupStackDM({
  members,
  size = 52
}) {
  const pair = (members || []).slice(0, 2);
  const f = Math.round(size * 0.68);
  return /*#__PURE__*/React.createElement("span", {
    className: "dm-stack",
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  }, pair[0] && /*#__PURE__*/React.createElement("span", {
    className: "dm-stack-a"
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: pair[0].name,
    src: pair[0].avatar,
    size: f
  })), pair[1] && /*#__PURE__*/React.createElement("span", {
    className: "dm-stack-b"
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: pair[1].name,
    src: pair[1].avatar,
    size: f
  })));
}
function ConvAvatarDM({
  c,
  size = 52,
  dot = true
}) {
  const people = usePeopleDM();
  if (c.kind === "group") return c.photo ? /*#__PURE__*/React.createElement("span", {
    className: "dm-facewrap",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: c.name,
    src: c.photo,
    size: size
  })) : /*#__PURE__*/React.createElement(GroupStackDM, {
    members: c.memberIds.map(people.get).filter(Boolean),
    size: size
  });
  const p = people.get(c.personId);
  return /*#__PURE__*/React.createElement("span", {
    className: "dm-facewrap",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: p ? p.name : "?",
    src: p && p.avatar,
    size: size
  }), dot && p && p.online && /*#__PURE__*/React.createElement("span", {
    className: "dm-online"
  }));
}

/* ---------------------------------------------------------------------------
   Conversation helpers
   --------------------------------------------------------------------------- */
function convNameDM(c, people) {
  return c.kind === "group" ? c.name : (people.get(c.personId) || {}).name || "Unknown";
}
function lastMsgDM(c) {
  return c.messages.length ? c.messages[c.messages.length - 1] : null;
}
function previewDM(c, people) {
  const m = lastMsgDM(c);
  if (!m) return c.kind === "group" ? c.memberIds.length + 1 + " members · say hello" : "Start the conversation";
  if (m.deleted) return m.from === "me" ? "You deleted a message" : "Message deleted";
  const who = m.from === "me" ? "You" : c.kind === "group" ? stripHonorificDM((people.get(m.from) || {}).name || "").split(" ")[0] : null;
  const body = m.gif ? "🎞 GIF" : m.sticker ? "✨ Sticker" : m.video ? "🎬 " + (m.text || "Video") : m.image ? "📷 " + (m.text || "Photo") : m.text;
  return who ? who + ": " + body : body;
}
function sortConvsDM(list) {
  return list.slice().sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    const ta = lastMsgDM(a) ? lastMsgDM(a).ts : 0,
      tb = lastMsgDM(b) ? lastMsgDM(b).ts : 0;
    return tb - ta;
  });
}

/* ---------------------------------------------------------------------------
   Sheet (bottom) — role=dialog, aria-modal, Esc closes, focus moves in and
   returns to the opener on close.
   --------------------------------------------------------------------------- */
function SheetDM({
  open,
  onClose,
  label,
  title,
  children,
  className
}) {
  const ref = useRefDM(null);
  useEffectDM(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = e => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => {
      const el = ref.current && ref.current.querySelector("button:not([disabled]), [href], input, [tabindex]:not([tabindex='-1'])");
      if (el) el.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      if (prev && prev.focus) prev.focus();
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet" + (className ? " " + className : ""),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": label || title,
    ref: ref
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-sheet-grab",
    "aria-hidden": "true"
  }), title && /*#__PURE__*/React.createElement("h3", {
    className: "dm-sheet-title"
  }, title), children));
}
function SheetActionDM({
  icon,
  label,
  sub,
  danger,
  disabled,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-sheet-act" + (danger ? " danger" : ""),
    disabled: disabled,
    onClick: onClick
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: icon,
    size: 21,
    color: danger ? "var(--error)" : "var(--text-heading)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-sheet-act-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-sheet-act-label"
  }, label), sub && /*#__PURE__*/React.createElement("span", {
    className: "dm-sheet-act-sub"
  }, sub)));
}
/* "+" popover in the thread composer: Messenger-style floating list anchored above the button */
function PlusMenuDM({
  items,
  onClose
}) {
  const ref = useRefDM(null);
  useEffectDM(() => {
    const onKey = e => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => {
      if (ref.current) ref.current.focus({
        preventScroll: true
      });
    }); // focus the menu, not a row — no row should look pre-selected
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-plus-menu",
    role: "menu",
    "aria-label": "Add to message",
    tabIndex: -1,
    ref: ref
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.label,
    type: "button",
    role: "menuitem",
    className: "dm-plus-item",
    onClick: it.onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-plus-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: it.icon,
    size: 22,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-plus-label"
  }, it.label))));
}
function ToastDM({
  toast
}) {
  if (!toast) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-toast",
    role: "status"
  }, toast.text);
}

/* ---------------------------------------------------------------------------
   Headers
   --------------------------------------------------------------------------- */
function BackHeaderDM({
  title,
  onBack,
  trailing,
  sub
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "dm-head dm-head-back"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn",
    "aria-label": "Back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-head-titlewrap"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "dm-head-title"
  }, title), sub && /*#__PURE__*/React.createElement("span", {
    className: "dm-head-sub"
  }, sub)), trailing || /*#__PURE__*/React.createElement("span", {
    className: "dm-head-spacer"
  }));
}
function SearchDM({
  value,
  onChange,
  placeholder
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-search"
  }, /*#__PURE__*/React.createElement(DSDM.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "search",
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    "aria-label": placeholder
  }), value && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-search-clear",
    "aria-label": "Clear search",
    onClick: () => onChange("")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 16,
    color: "var(--gray-500)"
  })));
}

/* ---------------------------------------------------------------------------
   Conversation row (+ long-press → actions sheet)
   --------------------------------------------------------------------------- */
function ConversationRowDM({
  c,
  onOpen,
  onActions
}) {
  const people = usePeopleDM();
  const activeId = React.useContext(ActiveConvCtxDM);
  const press = usePressDM(() => onActions(c));
  const last = lastMsgDM(c);
  const name = convNameDM(c, people);
  const row = /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-row" + (c.unread ? " unread" : "") + (activeId === c.id ? " on" : ""),
    "data-thread-id": c.id,
    onClick: () => onOpen(c),
    ...press,
    "aria-label": name + (c.unread ? ", " + c.unread + " unread" : "") + (DM_WEB ? ". Right-click for options." : ". Hold for options.")
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-row-av"
  }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
    c: c,
    size: 52
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-row-name"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "dm-row-meta"
  }, c.pinned && /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:pin",
    size: 13,
    color: "var(--brand-gold)"
  }), c.muted && /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:bell-off",
    size: 13,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-row-time"
  }, last ? fmtListTimeDM(last.ts) : ""))), /*#__PURE__*/React.createElement("span", {
    className: "dm-row-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-row-preview"
  }, previewDM(c, people)), c.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "dm-unread"
  }, c.unread))));
  if (!DM_WEB) return row;
  /* desktop: a hover "⋯" beside the row (long-press has no mouse equivalent; right-click still works) */
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-row-wrap"
  }, row, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-row-more",
    "aria-label": "Options for " + name,
    "aria-haspopup": "dialog",
    onClick: e => {
      e.stopPropagation();
      onActions(c);
    }
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 18,
    color: "var(--gray-600)"
  })));
}

/* ---------------------------------------------------------------------------
   Chats tab
   --------------------------------------------------------------------------- */
/* Active now — horizontal strip of people online right now; tapping a face
   opens (or starts) that person's thread. */
function ActiveNowDM({
  onOpen
}) {
  const people = usePeopleDM();
  const online = people.all.filter(p => p.online && !p.request).sort((a, b) => a.name.localeCompare(b.name));
  if (!online.length) return null;
  /* first name only, plus a last initial when two online people share it */
  const first = p => stripHonorificDM(p.name).split(" ")[0];
  const label = p => {
    const parts = stripHonorificDM(p.name).split(" ");
    const dup = online.some(o => o.id !== p.id && first(o) === parts[0]);
    return dup && parts[1] ? parts[0] + " " + parts[1][0] + "." : parts[0];
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "dm-active",
    "aria-label": "Active now"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-active-strip",
    role: "list"
  }, online.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    type: "button",
    role: "listitem",
    className: "dm-active-item",
    onClick: () => onOpen(p.id),
    "aria-label": "Message " + p.name + ", active now"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-facewrap",
    style: {
      width: 56,
      height: 56
    }
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: p.name,
    src: p.avatar,
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-online"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-active-name"
  }, label(p))))));
}
const INBOX_TABS_DM = [{
  key: "all",
  label: "All"
}, {
  key: "unread",
  label: "Unread"
}, {
  key: "groups",
  label: "Groups"
}];
function ChatsViewDM({
  convs,
  archivedCount,
  requestsCount,
  onOpen,
  onOpenPerson,
  onActions,
  onCompose,
  onArchived,
  onRequests,
  onScroll
}) {
  const people = usePeopleDM();
  const [inbox, setInbox] = useStateDM("all");
  const [q, setQ] = useStateDM("");
  const unread = convs.filter(c => c.unread > 0).length;
  const groups = convs.filter(c => c.kind === "group").length;
  const counts = {
    all: convs.length,
    unread,
    groups
  };
  const list = sortConvsDM(convs.filter(c => {
    if (inbox === "unread" && !c.unread) return false;
    if (inbox === "groups" && c.kind !== "group") return false;
    if (q && !convNameDM(c, people).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view",
    "data-screen-label": "Messages · Chats"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dm-head dm-head-inbox"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-head-row"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "dm-title"
  }, "Messages"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn dm-compose",
    "aria-label": "New message",
    onClick: onCompose
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:square-pen",
    size: 21,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dm-inboxtabs",
    role: "tablist",
    "aria-label": "Inbox filter"
  }, INBOX_TABS_DM.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    role: "tab",
    "aria-selected": inbox === t.key,
    className: "dm-inboxtab" + (inbox === t.key ? " on" : ""),
    onClick: () => setInbox(t.key)
  }, t.label, counts[t.key] > 0 && t.key !== "all" && /*#__PURE__*/React.createElement("span", {
    className: "dm-inboxtab-n"
  }, counts[t.key]))))), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll",
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement(SearchDM, {
    value: q,
    onChange: setQ,
    placeholder: "Search messages"
  }), /*#__PURE__*/React.createElement(ActiveNowDM, {
    onOpen: onOpenPerson
  }), requestsCount > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-linkrow",
    onClick: onRequests
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-linkrow-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:mail-plus",
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-linkrow-label"
  }, "Message requests"), /*#__PURE__*/React.createElement("span", {
    className: "dm-unread"
  }, requestsCount)), /*#__PURE__*/React.createElement("div", {
    className: "dm-list",
    role: "list"
  }, list.map(c => /*#__PURE__*/React.createElement(ConversationRowDM, {
    key: c.id,
    c: c,
    onOpen: onOpen,
    onActions: onActions
  })), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:message-circle-dashed",
    size: 40,
    color: "var(--gray-300)"
  }), /*#__PURE__*/React.createElement("b", null, q ? "No conversations match" : inbox === "unread" ? "You're all caught up" : "No group chats yet"), /*#__PURE__*/React.createElement("p", null, q ? "Try a different name." : inbox === "unread" ? "New messages will show up here." : "Create a group from the compose button."))), archivedCount > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-linkrow dm-linkrow-quiet",
    onClick: onArchived
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-linkrow-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:archive",
    size: 19,
    color: "var(--gray-500)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-linkrow-label"
  }, "Archived chats"), /*#__PURE__*/React.createElement("span", {
    className: "dm-linkrow-count"
  }, archivedCount), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  }))));
}

/* Generic list view with a back header (Archived · Group chats) */
function ListViewDM({
  title,
  sub,
  onBack,
  convs,
  onOpen,
  onActions,
  emptyIcon,
  emptyTitle,
  emptyBody,
  onScroll,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view",
    "data-screen-label": label || title
  }, /*#__PURE__*/React.createElement(BackHeaderDM, {
    title: title,
    sub: sub,
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll",
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-list",
    role: "list"
  }, sortConvsDM(convs).map(c => /*#__PURE__*/React.createElement(ConversationRowDM, {
    key: c.id,
    c: c,
    onOpen: onOpen,
    onActions: onActions
  })), convs.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: emptyIcon || "lucide:inbox",
    size: 40,
    color: "var(--gray-300)"
  }), /*#__PURE__*/React.createElement("b", null, emptyTitle), /*#__PURE__*/React.createElement("p", null, emptyBody)))));
}

/* Message requests — Accept / Decline */
function RequestsViewDM({
  requests,
  onBack,
  onAccept,
  onDecline,
  onScroll
}) {
  const people = usePeopleDM();
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view",
    "data-screen-label": "Message requests"
  }, /*#__PURE__*/React.createElement(BackHeaderDM, {
    title: "Message requests",
    sub: requests.length ? requests.length + " waiting" : null,
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll",
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement("p", {
    className: "dm-note"
  }, "People you don't follow yet. They won't know you've seen their message until you accept."), /*#__PURE__*/React.createElement("div", {
    className: "dm-list",
    role: "list"
  }, requests.map(r => {
    const p = people.get(r.personId) || {
      name: "Unknown"
    };
    return /*#__PURE__*/React.createElement("div", {
      key: r.id,
      className: "dm-req",
      role: "listitem"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dm-row-av"
    }, /*#__PURE__*/React.createElement(DMFace, {
      name: p.name,
      src: p.avatar,
      size: 52
    })), /*#__PURE__*/React.createElement("span", {
      className: "dm-req-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dm-row-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dm-row-name"
    }, p.name), /*#__PURE__*/React.createElement("span", {
      className: "dm-row-time"
    }, fmtListTimeDM(r.ts))), /*#__PURE__*/React.createElement("span", {
      className: "dm-req-role"
    }, p.role), /*#__PURE__*/React.createElement("span", {
      className: "dm-req-text"
    }, r.text), /*#__PURE__*/React.createElement("span", {
      className: "dm-req-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-btn dm-btn-ghost",
      onClick: () => onDecline(r)
    }, "Decline"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-btn dm-btn-navy",
      onClick: () => onAccept(r)
    }, "Accept"))));
  }), requests.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:mail-check",
    size: 40,
    color: "var(--gray-300)"
  }), /*#__PURE__*/React.createElement("b", null, "No requests"), /*#__PURE__*/React.createElement("p", null, "New requests from people you don't follow land here.")))));
}

/* Deleted chats — restore */
function DeletedViewDM({
  deleted,
  onBack,
  onRestore,
  onScroll
}) {
  const people = usePeopleDM();
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view",
    "data-screen-label": "Deleted chats"
  }, /*#__PURE__*/React.createElement(BackHeaderDM, {
    title: "Deleted chats",
    sub: deleted.length ? deleted.length + " recoverable" : null,
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll",
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement("p", {
    className: "dm-note"
  }, "Deleted chats are kept for 30 days, then removed for good."), /*#__PURE__*/React.createElement("div", {
    className: "dm-list",
    role: "list"
  }, sortConvsDM(deleted).map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "dm-req",
    role: "listitem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-row-av"
  }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
    c: c,
    size: 52,
    dot: false
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-req-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-row-name"
  }, convNameDM(c, people))), /*#__PURE__*/React.createElement("span", {
    className: "dm-req-role"
  }, c.messages.filter(m => !m.deleted).length, " messages")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost",
    onClick: () => onRestore(c)
  }, "Restore"))), deleted.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:trash-2",
    size: 40,
    color: "var(--gray-300)"
  }), /*#__PURE__*/React.createElement("b", null, "Nothing deleted"), /*#__PURE__*/React.createElement("p", null, "Chats you delete can be restored from here for 30 days.")))));
}

/* ---------------------------------------------------------------------------
   Compose — new message / new group (tickable rows)
   --------------------------------------------------------------------------- */
function PersonTickRowDM({
  p,
  on,
  onToggle,
  size = 44
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "checkbox",
    "aria-checked": on,
    className: "dm-tickrow" + (on ? " on" : ""),
    onClick: () => onToggle(p.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-facewrap",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: p.name,
    src: p.avatar,
    size: size
  }), p.online && /*#__PURE__*/React.createElement("span", {
    className: "dm-online sm"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-tickrow-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-tickrow-name"
  }, p.name), /*#__PURE__*/React.createElement("span", {
    className: "dm-tickrow-sub"
  }, p.role)), /*#__PURE__*/React.createElement("span", {
    className: "dm-tick",
    "aria-hidden": "true"
  }, on && /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:check",
    size: 14,
    color: "#fff"
  })));
}
function ComposeViewDM({
  people,
  onBack,
  onCreate
}) {
  const [q, setQ] = useStateDM("");
  const [picked, setPicked] = useStateDM([]);
  const [groupName, setGroupName] = useStateDM("");
  const list = people.filter(p => !p.request && p.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = id => setPicked(all => all.includes(id) ? all.filter(x => x !== id) : all.concat([id]));
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view",
    "data-screen-label": "New message"
  }, /*#__PURE__*/React.createElement(BackHeaderDM, {
    title: "New message",
    onBack: onBack
  }), /*#__PURE__*/React.createElement(SearchDM, {
    value: q,
    onChange: setQ,
    placeholder: "Search people"
  }), picked.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "dm-groupname"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: groupName,
    onChange: e => setGroupName(e.target.value),
    placeholder: "Name this group (optional)",
    "aria-label": "Group name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll dm-scroll-tight"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-list"
  }, list.map(p => /*#__PURE__*/React.createElement(PersonTickRowDM, {
    key: p.id,
    p: p,
    on: picked.includes(p.id),
    onToggle: toggle
  })), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement("b", null, "No people found")))), /*#__PURE__*/React.createElement("footer", {
    className: "dm-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-footer-count"
  }, picked.length, " selected"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-btn-grow",
    disabled: picked.length === 0,
    onClick: () => onCreate(picked, groupName)
  }, picked.length > 1 ? "Create group" : "Start chat")));
}

/* ---------------------------------------------------------------------------
   Thread
   --------------------------------------------------------------------------- */
function ReactionChipsDM({
  reactions,
  onToggle
}) {
  const entries = Object.keys(reactions || {}).filter(k => reactions[k].length);
  if (!entries.length) return null;
  return /*#__PURE__*/React.createElement("span", {
    className: "dm-reactions"
  }, entries.map(emoji => {
    const mine = reactions[emoji].includes("me");
    return /*#__PURE__*/React.createElement("button", {
      key: emoji,
      type: "button",
      className: "dm-reaction" + (mine ? " mine" : ""),
      "aria-pressed": mine,
      "aria-label": emoji + " " + reactions[emoji].length + (mine ? ", you reacted" : ""),
      onClick: () => onToggle(emoji)
    }, emoji, /*#__PURE__*/React.createElement("span", null, reactions[emoji].length));
  }));
}
function ReactionBarDM({
  current,
  onPick,
  onClose
}) {
  const ref = useRefDM(null);
  useEffectDM(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDoc);
    const raf = requestAnimationFrame(() => {
      const b = ref.current && ref.current.querySelector("button");
      if (b) b.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDoc);
      cancelAnimationFrame(raf);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-react-bar",
    role: "toolbar",
    "aria-label": "React",
    ref: ref
  }, REACTIONS_QUICK_DM.map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    type: "button",
    className: "dm-react-opt" + (current.includes(e) ? " on" : ""),
    "aria-label": "React " + e,
    "aria-pressed": current.includes(e),
    onClick: () => onPick(e)
  }, e)));
}
function BubbleDM({
  m,
  c,
  sender,
  showSender,
  onReact,
  onActions,
  reactOpen,
  setReactOpen,
  onOpenImage,
  highlight,
  isHit
}) {
  const mine = m.from === "me";
  const press = usePressDM(() => onActions(m), !m.deleted);
  const myReactions = Object.keys(m.reactions || {}).filter(k => m.reactions[k].includes("me"));
  const isGroup = c.kind === "group";
  const imgOnly = !!(m.image || m.video) && !m.text;
  const media = m.gif ? "GIF: " + m.gif.label + ". " : m.sticker ? "Sticker: " + m.sticker.label + ". " : m.video ? "Video. " : m.image ? "Photo. " : "";
  const label = (mine ? "You: " : sender ? sender.name + ": " : "") + media + (m.text || "") + (DM_WEB ? " Right-click for options." : " Hold for options.");
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-msg" + (mine ? " me" : "") + (isGroup && !mine ? " grouped" : "") + (showSender ? " first" : "") + (isHit ? " hit" : ""),
    "data-mid": m.id
  }, isGroup && !mine && /*#__PURE__*/React.createElement("span", {
    className: "dm-msg-av",
    "aria-hidden": !showSender
  }, showSender && sender && /*#__PURE__*/React.createElement(DMFace, {
    name: sender.name,
    src: sender.avatar,
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-msg-col"
  }, showSender && !mine && isGroup && sender && /*#__PURE__*/React.createElement("span", {
    className: "dm-msg-sender"
  }, nickDM(c, sender)), /*#__PURE__*/React.createElement("div", {
    className: "dm-msg-line"
  }, m.deleted ? /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble tomb",
    role: "note"
  }, mine ? "You deleted this message" : "This message was deleted") : m.gif ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-bubble dm-bubble-gif" + (mine ? " me" : ""),
    ...press,
    "aria-label": label
  }, /*#__PURE__*/React.createElement("img", {
    src: m.gif.src,
    alt: "",
    draggable: "false"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-gif-badge"
  }, "GIF")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-react-trigger",
    "aria-label": "Add reaction",
    "aria-expanded": reactOpen,
    onClick: e => {
      e.stopPropagation();
      setReactOpen(reactOpen ? null : m.id);
    }
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:smile-plus",
    size: 18,
    color: "var(--gray-500)"
  }))) : m.sticker ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-bubble dm-bubble-sticker" + (mine ? " me" : ""),
    ...press,
    "aria-label": label
  }, /*#__PURE__*/React.createElement(DmStickerDM, {
    sticker: m.sticker,
    size: 132
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-react-trigger",
    "aria-label": "Add reaction",
    "aria-expanded": reactOpen,
    onClick: e => {
      e.stopPropagation();
      setReactOpen(reactOpen ? null : m.id);
    }
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:smile-plus",
    size: 18,
    color: "var(--gray-500)"
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-bubble" + (mine ? " me" : "") + (m.image || m.video ? " has-img" : "") + (imgOnly ? " img-only" : ""),
    ...press,
    "aria-label": label,
    onClick: m.image && onOpenImage ? () => onOpenImage({
      kind: "image",
      src: m.image
    }) : m.video && m.video.src && onOpenImage ? () => onOpenImage({
      kind: "video",
      src: m.video.src,
      poster: m.video.poster
    }) : undefined
  }, m.image && /*#__PURE__*/React.createElement("img", {
    className: "dm-bubble-img",
    src: m.image,
    alt: "",
    draggable: "false"
  }), m.video && (m.video.src ? /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble-video",
    "aria-hidden": "true"
  }, m.video.poster ? /*#__PURE__*/React.createElement("img", {
    className: "dm-bubble-img",
    src: m.video.poster,
    alt: "",
    draggable: "false"
  }) : /*#__PURE__*/React.createElement("video", {
    className: "dm-bubble-img",
    src: m.video.src,
    muted: true,
    playsInline: true,
    preload: "metadata"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-video-play"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:play",
    size: 22,
    color: "#fff"
  }))) : /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble-video gone",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:video-off",
    size: 22,
    color: "var(--gray-500)"
  }), /*#__PURE__*/React.createElement("span", null, "Video no longer available"))), m.text && /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble-text"
  }, highlight ? highlightDM(m.text, highlight) : m.text)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-react-trigger",
    "aria-label": "Add reaction",
    "aria-expanded": reactOpen,
    onClick: e => {
      e.stopPropagation();
      setReactOpen(reactOpen ? null : m.id);
    }
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:smile-plus",
    size: 18,
    color: "var(--gray-500)"
  }))), DM_WEB && !m.deleted && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-msg-more",
    "aria-label": "Message options",
    "aria-haspopup": "dialog",
    onClick: e => {
      e.stopPropagation();
      onActions(m);
    }
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 18,
    color: "var(--gray-500)"
  })), reactOpen && /*#__PURE__*/React.createElement(ReactionBarDM, {
    current: myReactions,
    onPick: e => {
      onReact(m.id, e);
      setReactOpen(null);
    },
    onClose: () => setReactOpen(null)
  })), !m.deleted && /*#__PURE__*/React.createElement(ReactionChipsDM, {
    reactions: m.reactions,
    onToggle: e => onReact(m.id, e)
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-msg-time"
  }, fmtClockDM(m.ts), m.edited && !m.deleted ? " · Edited" : "")));
}
function EmojiPickerDM({
  onPick,
  onClose
}) {
  const [group, setGroup] = useStateDM("smileys");
  const g = EMOJI_GROUPS_DM.find(x => x.key === group);
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-emoji",
    role: "region",
    "aria-label": "Emoji picker"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-emoji-tabs",
    role: "tablist",
    "aria-label": "Emoji groups"
  }, EMOJI_GROUPS_DM.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.key,
    type: "button",
    role: "tab",
    "aria-selected": group === x.key,
    className: "dm-emoji-tab" + (group === x.key ? " on" : ""),
    onClick: () => setGroup(x.key)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: x.icon,
    size: 16,
    color: group === x.key ? "#fff" : "var(--gray-600)"
  }), x.label))), /*#__PURE__*/React.createElement("div", {
    className: "dm-emoji-grid",
    role: "tabpanel"
  }, g.emojis.map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    type: "button",
    className: "dm-emoji-btn",
    "aria-label": "Insert " + e,
    onClick: () => onPick(e)
  }, e))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-emoji-close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:keyboard",
    size: 18,
    color: "var(--gray-600)"
  }), " Keyboard"));
}

/* ---------------------------------------------------------------------------
   Custom stickers (Genmoji-style) + GIFs — sheet opened from the composer.
   Stickers: base emoji or your avatar + up to three accents on a gradient tile,
   composed from tapped suggestions and keywords in the description. GIFs come
   from the local library in assets/gifs. Sent as m.sticker / m.gif.
   --------------------------------------------------------------------------- */
const DM_STICKER_BGS_DM = ["linear-gradient(135deg,#ffd5e1,#e6d7ff)", "linear-gradient(135deg,#fde7c8,#ffd0d9)", "linear-gradient(135deg,#d6ecff,#e8d9ff)", "linear-gradient(135deg,#dff6e8,#d8ecff)", "linear-gradient(135deg,#fff1c9,#ffd9c7)"];
const DM_STICKER_SUGGESTIONS_DM = ["me", "❤️", "🤔", "👑"];
const DM_STICKER_MORE_DM = ["✨", "🔥", "🎉", "👍", "👏", "💉", "👄", "⭐", "😂", "😎", "💪", "🏆", "💰", "🚀", "🙏", "💯"];
const DM_STICKER_HATS_DM = ["👑", "🎩", "🎓", "🧢"];

/* Local GIF library (assets/gifs, generated in-repo). Tags drive search + chips. */
const DM_GIFS_DM = [{
  id: "thank-you",
  label: "Thank you!",
  tags: ["thanks", "thank you", "grateful", "pray", "reactions"]
}, {
  id: "congrats",
  label: "Congrats!",
  tags: ["congrats", "celebrate", "party", "win", "well done"]
}, {
  id: "love-it",
  label: "Love it",
  tags: ["love", "heart", "reactions", "yes"]
}, {
  id: "thinking",
  label: "Hmm…",
  tags: ["thinking", "hmm", "reactions", "wondering"]
}, {
  id: "on-fire",
  label: "On fire!",
  tags: ["fire", "hot", "amazing", "reactions"]
}, {
  id: "applause",
  label: "Bravo!",
  tags: ["clap", "applause", "congrats", "well done"]
}, {
  id: "lol",
  label: "LOL",
  tags: ["funny", "laugh", "lol", "haha", "reactions"]
}, {
  id: "mind-blown",
  label: "Mind blown",
  tags: ["wow", "mind blown", "funny", "reactions"]
}, {
  id: "party",
  label: "Party time",
  tags: ["party", "celebrate", "congrats", "fun"]
}, {
  id: "high-five",
  label: "High five!",
  tags: ["high five", "yes", "team", "celebrate"]
}, {
  id: "cheers",
  label: "Cheers!",
  tags: ["cheers", "celebrate", "congrats", "drink"]
}, {
  id: "wow",
  label: "Wow!",
  tags: ["wow", "shocked", "reactions"]
}, {
  id: "good-job",
  label: "Good job",
  tags: ["thumbs up", "yes", "good job", "thanks", "reactions"]
}, {
  id: "crown",
  label: "Queen",
  tags: ["crown", "queen", "boss", "love"]
}, {
  id: "syringe",
  label: "Inject away",
  tags: ["syringe", "injector", "clinic", "funny", "filler"]
}, {
  id: "rocket",
  label: "Let's go!",
  tags: ["rocket", "launch", "lets go", "growth", "yes"]
}].map(g => ({
  ...g,
  src: "assets/gifs/" + g.id + ".gif"
}));
const DM_GIF_CHIPS_DM = ["Trending", "Reactions", "Thanks", "Congrats", "Love", "Funny", "Yes"];
function filterGifsDM(query, chip) {
  const q = query.trim().toLowerCase();
  if (q) return DM_GIFS_DM.filter(g => g.label.toLowerCase().includes(q) || g.tags.some(t => t.includes(q)));
  if (!chip || chip === "Trending") return DM_GIFS_DM;
  const c = chip.toLowerCase();
  return DM_GIFS_DM.filter(g => g.tags.some(t => t.includes(c)));
}
const DM_STICKER_LEXICON_DM = {
  me: "me",
  myself: "me",
  selfie: "me",
  katy: "me",
  heart: "❤️",
  hearts: "❤️",
  love: "❤️",
  loving: "❤️",
  crown: "👑",
  queen: "👑",
  king: "👑",
  royal: "👑",
  think: "🤔",
  thinking: "🤔",
  hmm: "🤔",
  wondering: "🤔",
  syringe: "💉",
  injection: "💉",
  injector: "💉",
  filler: "💉",
  botox: "💉",
  toxin: "💉",
  lips: "👄",
  lip: "👄",
  kiss: "💋",
  kisses: "💋",
  star: "⭐",
  stars: "⭐",
  sparkle: "✨",
  sparkles: "✨",
  glow: "✨",
  magic: "✨",
  shine: "✨",
  fire: "🔥",
  hot: "🔥",
  lit: "🔥",
  money: "💰",
  cash: "💰",
  rich: "💰",
  revenue: "💰",
  laugh: "😂",
  laughing: "😂",
  lol: "😂",
  haha: "😂",
  funny: "😂",
  party: "🎉",
  celebrate: "🎉",
  celebration: "🎉",
  congrats: "🎉",
  congratulations: "🎉",
  thumbs: "👍",
  thumbsup: "👍",
  ok: "👍",
  okay: "👍",
  yes: "👍",
  agree: "👍",
  clap: "👏",
  clapping: "👏",
  applause: "👏",
  bravo: "👏",
  doctor: "🩺",
  nurse: "🩺",
  stethoscope: "🩺",
  clinic: "🏥",
  hospital: "🏥",
  rocket: "🚀",
  launch: "🚀",
  smile: "😊",
  smiling: "😊",
  happy: "😊",
  cool: "😎",
  sunglasses: "😎",
  shades: "😎",
  sad: "😢",
  cry: "😢",
  crying: "😢",
  angry: "😠",
  mad: "😠",
  wow: "😮",
  shocked: "😮",
  surprised: "😮",
  sleepy: "😴",
  tired: "😴",
  sleep: "😴",
  coffee: "☕",
  tea: "🍵",
  cake: "🎂",
  birthday: "🎂",
  trophy: "🏆",
  winner: "🏆",
  win: "🏆",
  champion: "🏆",
  medal: "🏅",
  gold: "🏅",
  flower: "🌸",
  flowers: "💐",
  rose: "🌹",
  sun: "☀️",
  sunny: "☀️",
  rainbow: "🌈",
  unicorn: "🦄",
  muscle: "💪",
  strong: "💪",
  flex: "💪",
  brain: "🧠",
  smart: "🧠",
  idea: "💡",
  lightbulb: "💡",
  book: "📚",
  books: "📚",
  study: "📚",
  learning: "📚",
  chart: "📈",
  growth: "📈",
  growing: "📈",
  target: "🎯",
  goal: "🎯",
  goals: "🎯",
  wave: "👋",
  hi: "👋",
  hello: "👋",
  hey: "👋",
  bye: "👋",
  pray: "🙏",
  thanks: "🙏",
  thank: "🙏",
  grateful: "🙏",
  please: "🙏",
  hundred: "💯",
  perfect: "💯",
  check: "✅",
  done: "✅",
  tick: "✅",
  hat: "🎩",
  graduate: "🎓",
  graduation: "🎓",
  cap: "🧢",
  mastery: "🏅",
  confidence: "✨",
  profinity: "👑"
};
function composeStickerDM(desc, picks) {
  const items = [];
  const push = v => {
    if (v && !items.includes(v)) items.push(v);
  };
  picks.forEach(push);
  desc.toLowerCase().split(/[^a-z0-9]+/).forEach(w => push(DM_STICKER_LEXICON_DM[w]));
  (desc.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]️?/gu) || []).forEach(push);
  if (!items.length) return null;
  const withMe = items.includes("me");
  const emojis = items.filter(x => x !== "me");
  const base = withMe ? "me" : emojis[0];
  const accents = (withMe ? emojis : emojis.slice(1)).slice(0, 3);
  const label = desc.trim() || (withMe ? "Me" + (accents.length ? " with " + accents.join(" ") : "") : emojis.join(" "));
  let h = 0;
  for (const c of label) h = h * 31 + c.codePointAt(0) >>> 0;
  return {
    kind: "sticker",
    base,
    accents,
    label,
    bg: h % DM_STICKER_BGS_DM.length
  };
}
function readRecentStickersDM() {
  try {
    return JSON.parse(window.localStorage.getItem("pf-dm-stickers") || "[]");
  } catch (e) {
    return [];
  }
}
function saveRecentStickerDM(s) {
  const list = [s, ...readRecentStickersDM().filter(x => x.label !== s.label)].slice(0, 12);
  try {
    window.localStorage.setItem("pf-dm-stickers", JSON.stringify(list));
  } catch (e) {/* private mode */}
  return list;
}
function DmStickerDM({
  sticker,
  size = 120
}) {
  const hat = sticker.accents.find(a => DM_STICKER_HATS_DM.includes(a));
  const rest = sticker.accents.filter(a => a !== hat);
  const corners = [{
    right: "-3%",
    top: "-4%"
  }, {
    left: "-4%",
    bottom: "0%"
  }, {
    right: "-2%",
    bottom: "-4%",
    transform: "rotate(12deg)"
  }];
  return /*#__PURE__*/React.createElement("span", {
    className: "dm-sticker",
    role: "img",
    "aria-label": "Sticker: " + sticker.label,
    style: {
      width: size,
      height: size,
      background: DM_STICKER_BGS_DM[sticker.bg],
      borderRadius: size * 0.28
    }
  }, sticker.base === "me" ? /*#__PURE__*/React.createElement("span", {
    className: "dm-sticker-me"
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: ME_DM.name,
    src: ME_DM.avatar,
    size: Math.round(size * 0.66)
  })) : /*#__PURE__*/React.createElement("span", {
    className: "dm-sticker-base",
    style: {
      fontSize: size * 0.56
    }
  }, sticker.base), hat && /*#__PURE__*/React.createElement("span", {
    className: "dm-sticker-accent hat",
    style: {
      fontSize: size * 0.34,
      top: sticker.base === "me" ? "-6%" : "-10%"
    }
  }, hat), rest.map((a, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "dm-sticker-accent",
    style: {
      fontSize: size * 0.3,
      ...corners[i]
    }
  }, a)));
}
function DmStickerSheetDM({
  onClose,
  onSend,
  onSendGif,
  initialMode = "sticker"
}) {
  const [mode, setMode] = useStateDM(initialMode);
  const [gifQuery, setGifQuery] = useStateDM("");
  const [gifChip, setGifChip] = useStateDM("Trending");
  const [gifPick, setGifPick] = useStateDM(null);
  const [desc, setDesc] = useStateDM("");
  const [picks, setPicks] = useStateDM([]);
  const [result, setResult] = useStateDM(null);
  const [busy, setBusy] = useStateDM(false);
  const [more, setMore] = useStateDM(false);
  const [recents] = useStateDM(readRecentStickersDM);
  const inputRef = useRefDM(null);
  useEffectDM(() => {
    const draft = composeStickerDM(desc, picks);
    if (!draft) {
      setResult(null);
      setBusy(false);
      return;
    }
    setBusy(true);
    const t = window.setTimeout(() => {
      setResult(draft);
      setBusy(false);
    }, 900);
    return () => window.clearTimeout(t);
  }, [desc, picks.join("|")]);
  useEffectDM(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  function togglePick(k) {
    setPicks(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);
  }
  function confirm() {
    if (!result || busy) return;
    saveRecentStickerDM(result);
    onSend(result);
  }
  const list = more ? [...DM_STICKER_SUGGESTIONS_DM, ...DM_STICKER_MORE_DM] : DM_STICKER_SUGGESTIONS_DM;
  const isGif = mode === "gif";
  const gifs = filterGifsDM(gifQuery, gifChip);
  const ready = isGif ? !!gifPick : !!result && !busy;
  function confirmGif() {
    if (gifPick) onSendGif(gifPick);
  }
  const onConfirm = isGif ? confirmGif : confirm;
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-sheet",
    role: "dialog",
    "aria-label": "Create a custom sticker",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dm-sticker-circ",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-seg",
    role: "tablist",
    "aria-label": "Sticker or GIF"
  }, /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": !isGif,
    className: !isGif ? "on" : "",
    onClick: () => setMode("sticker")
  }, "Sticker"), /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": isGif,
    className: isGif ? "on" : "",
    onClick: () => setMode("gif")
  }, "GIF")), /*#__PURE__*/React.createElement("button", {
    className: "dm-sticker-circ confirm" + (ready ? " on" : ""),
    "aria-label": isGif ? "Send GIF" : "Send sticker",
    disabled: !ready,
    onClick: onConfirm
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:check",
    size: 22,
    color: ready ? "#fff" : "var(--gray-450)"
  }))), isGif && /*#__PURE__*/React.createElement("div", {
    className: "dm-gif-pane"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-gif-search"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:search",
    size: 18,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search GIFs",
    "aria-label": "Search GIFs",
    value: gifQuery,
    onChange: e => setGifQuery(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") confirmGif();
    }
  }), gifQuery && /*#__PURE__*/React.createElement("button", {
    className: "dm-sticker-clear",
    "aria-label": "Clear search",
    onClick: () => setGifQuery("")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 14,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dm-gif-chips"
  }, DM_GIF_CHIPS_DM.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: "dm-gif-chip" + (gifChip === c && !gifQuery ? " on" : ""),
    onClick: () => {
      setGifChip(c);
      setGifQuery("");
    }
  }, c))), /*#__PURE__*/React.createElement("div", {
    className: "dm-gif-grid"
  }, gifs.map(g => /*#__PURE__*/React.createElement("button", {
    key: g.id,
    className: "dm-gif-tile" + (gifPick && gifPick.id === g.id ? " on" : ""),
    "aria-label": "GIF: " + g.label,
    "aria-pressed": !!gifPick && gifPick.id === g.id,
    onClick: () => setGifPick(cur => cur && cur.id === g.id ? null : g)
  }, /*#__PURE__*/React.createElement("img", {
    src: g.src,
    alt: g.label,
    loading: "lazy"
  }), gifPick && gifPick.id === g.id && /*#__PURE__*/React.createElement("span", {
    className: "dm-gif-tick"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:check",
    size: 14,
    color: "#fff"
  })))), gifs.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-gif-empty"
  }, "No GIFs match “", gifQuery, "”.")), /*#__PURE__*/React.createElement("p", {
    className: "dm-sticker-beta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-sticker-beta-tag"
  }, "GIF"), " Tap a GIF to select it, then send with the tick.")), !isGif && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-stage",
    onClick: () => inputRef.current && inputRef.current.focus()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-glow" + (busy ? " busy" : "")
  }), ready ? /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-result",
    key: result.label + result.base + result.accents.join("")
  }, /*#__PURE__*/React.createElement(DmStickerDM, {
    sticker: result,
    size: 196
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-sticker-caption"
  }, result.label)) : busy ? /*#__PURE__*/React.createElement("p", {
    className: "dm-sticker-hint busy"
  }, "Creating your sticker…") : /*#__PURE__*/React.createElement("p", {
    className: "dm-sticker-hint"
  }, "Describe a sticker or add a suggestion from the list.")), /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-sug-h"
  }, /*#__PURE__*/React.createElement("span", null, "Suggestions"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMore(m => !m)
  }, more ? "Show Less" : "Show More")), /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-sug" + (more ? " grid" : "")
  }, list.map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: "dm-sticker-opt" + (picks.includes(k) ? " on" : ""),
    "aria-label": k === "me" ? "Add yourself" : "Add " + k,
    "aria-pressed": picks.includes(k),
    onClick: () => togglePick(k)
  }, k === "me" ? /*#__PURE__*/React.createElement(DMFace, {
    name: ME_DM.name,
    src: ME_DM.avatar,
    size: 56
  }) : /*#__PURE__*/React.createElement("span", {
    className: "dm-sticker-opt-emoji"
  }, k))), !more && /*#__PURE__*/React.createElement("button", {
    className: "dm-sticker-opt",
    "aria-label": "Show more suggestions",
    onClick: () => setMore(true)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:smile-plus",
    size: 28,
    color: "var(--text-heading)"
  }))), more && recents.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-sug-h"
  }, /*#__PURE__*/React.createElement("span", null, "Your stickers")), /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-recents"
  }, recents.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "dm-sticker-recent",
    "aria-label": "Use sticker " + s.label,
    onClick: () => {
      setResult(s);
      setBusy(false);
    }
  }, /*#__PURE__*/React.createElement(DmStickerDM, {
    sticker: s,
    size: 56
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "dm-sticker-beta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-sticker-beta-tag"
  }, "BETA"), " Custom stickers may create unexpected results."), /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-compose"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-sticker-field"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:sparkles",
    size: 22,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "text",
    placeholder: "Describe a sticker",
    "aria-label": "Describe a sticker",
    value: desc,
    onChange: e => setDesc(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") confirm();
    }
  }), desc && /*#__PURE__*/React.createElement("button", {
    className: "dm-sticker-clear",
    "aria-label": "Clear description",
    onClick: () => setDesc("")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 14,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "dm-sticker-circ me" + (picks.includes("me") ? " on" : ""),
    "aria-label": "Add yourself to the sticker",
    "aria-pressed": picks.includes("me"),
    onClick: () => togglePick("me")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:user-round",
    size: 22,
    color: picks.includes("me") ? "#fff" : "var(--ai-purple)"
  }))))));
}
function ThreadViewDM({
  c,
  onBack,
  onProfile,
  onSend,
  onReact,
  onEdit,
  onDelete,
  onMenu,
  toast,
  searchOpen,
  onCloseSearch,
  onPin,
  onInfo,
  infoOpen,
  popup,
  onMinimize,
  onClose
}) {
  const people = usePeopleDM();
  const [text, setText] = useStateDM("");
  const [emojiOpen, setEmojiOpen] = useStateDM(false);
  const [reactOpen, setReactOpen] = useStateDM(null);
  const [actionsFor, setActionsFor] = useStateDM(null);
  const [editing, setEditing] = useStateDM(null);
  const [typing, setTyping] = useStateDM(null);
  const [attach, setAttach] = useStateDM(null); // pending photo (data URL) for the next message
  const [attachOpen, setAttachOpen] = useStateDM(false); // "+" popover: stickers / GIFs / emoji / photos
  const [stickerOpen, setStickerOpen] = useStateDM(null); // null | "sticker" | "gif" — custom sticker / GIF sheet
  const [lightbox, setLightbox] = useStateDM(null); // full-screen photo viewer
  const [q, setQ] = useStateDM(""); // in-conversation search
  const [hit, setHit] = useStateDM(0);
  const bodyRef = useRefDM(null);
  const inputRef = useRefDM(null);
  const fileRef = useRefDM(null);
  const camRef = useRefDM(null);
  const vidRef = useRefDM(null);
  const replyTimer = useRefDM(null);
  const now = useNowDM(!!actionsFor || editing !== null);
  const person = c.kind === "dm" ? people.get(c.personId) : null;
  const name = person ? nickDM(c, person) : convNameDM(c, people);
  const firstName = stripHonorificDM(name).split(" ")[0];
  const members = c.kind === "group" ? c.memberIds.map(people.get).filter(Boolean) : [];
  const onlineN = members.filter(p => p.online).length;
  const isEmpty = c.messages.length === 0;
  const needle = q.trim();
  const hits = needle ? c.messages.filter(m => !m.deleted && m.text && m.text.toLowerCase().includes(needle.toLowerCase())).map(m => m.id) : [];
  const hitId = hits.length ? hits[Math.min(hit, hits.length - 1)] : null;
  useEffectDM(() => {
    const el = bodyRef.current;
    if (el && !searchOpen) el.scrollTop = el.scrollHeight;
  }, [c.messages.length, typing, emojiOpen]);
  useEffectDM(() => () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
  }, []);
  // new query → jump to the most recent match
  useEffectDM(() => {
    setHit(Math.max(0, hits.length - 1));
  }, [needle]);
  useEffectDM(() => {
    if (!hitId || !bodyRef.current) return;
    const el = bodyRef.current.querySelector('[data-mid="' + hitId + '"]');
    if (el) el.scrollIntoView({
      block: "center",
      behavior: "smooth"
    });
  }, [hitId]);
  useEffectDM(() => {
    if (searchOpen) {
      setEmojiOpen(false);
      setActionsFor(null);
    } else setQ("");
  }, [searchOpen]);
  function stepHit(dir) {
    if (hits.length) setHit(i => (Math.min(i, hits.length - 1) + dir + hits.length) % hits.length);
  }
  function closeSearch() {
    setQ("");
    onCloseSearch && onCloseSearch();
  }
  function onPickFile(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    const done = a => {
      setAttach(a);
      setAttachOpen(false);
      requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
    };
    if (/^video\//.test(f.type)) {
      readVideoDM(f).then(v => {
        done({
          kind: "video",
          ...v
        });
        if (v.session) toast("Large video — kept for this session only");
      });
      return;
    }
    if (!/^image\//.test(f.type)) {
      toast("Only photos and videos are supported");
      return;
    }
    shrinkImageDM(f).then(url => done({
      kind: "image",
      src: url
    }));
  }
  function simulateReply() {
    const pool = c.kind === "group" ? members : [person].filter(Boolean);
    if (!pool.length) return;
    const who = pool[Math.floor(Math.random() * pool.length)];
    setTyping(who);
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      setTyping(null);
      onSend(c.id, {
        from: who.id,
        text: SAMPLE_REPLIES_DM[Math.floor(Math.random() * SAMPLE_REPLIES_DM.length)]
      });
    }, 1700);
  }
  function submit() {
    const v = text.trim();
    if (editing) {
      if (!v) return;
      onEdit(c.id, editing.id, v);
      setEditing(null);
      setText("");
      toast("Message edited");
      return;
    }
    if (!v && !attach) return;
    onSend(c.id, {
      from: "me",
      text: v,
      image: attach && attach.kind === "image" ? attach.src : null,
      video: attach && attach.kind === "video" ? {
        src: attach.src,
        poster: attach.poster || null,
        name: attach.name,
        size: attach.size
      } : null
    });
    setText("");
    setAttach(null);
    simulateReply();
  }
  function sendWave() {
    onSend(c.id, {
      from: "me",
      text: "👋"
    });
    simulateReply();
  }
  function sendSticker(sticker) {
    onSend(c.id, {
      from: "me",
      text: "",
      sticker
    });
    setStickerOpen(null);
    simulateReply();
  }
  function sendGif(gif) {
    onSend(c.id, {
      from: "me",
      text: "",
      gif: {
        id: gif.id,
        src: gif.src,
        label: gif.label
      }
    });
    setStickerOpen(null);
    simulateReply();
  }
  function openStickers(mode) {
    setEmojiOpen(false);
    setAttachOpen(false);
    inputRef.current && inputRef.current.blur();
    setStickerOpen(mode);
  }
  const canSend = !!text.trim() || !editing && !!attach;
  function startEdit(m) {
    setEditing(m);
    setText(m.text);
    setActionsFor(null);
    setEmojiOpen(false);
    requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
  }
  function cancelEdit() {
    setEditing(null);
    setText("");
  }
  function insertEmoji(e) {
    setText(t => t + e);
  }
  const actMsg = actionsFor ? c.messages.find(m => m.id === actionsFor.id) : null;
  const editLeft = actMsg ? EDIT_WINDOW_DM - (now - actMsg.ts) : 0;
  const canEdit = actMsg && actMsg.from === "me" && editLeft > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view dm-thread" + (popup ? " dm-thread-popup" : ""),
    style: themeVarsDM(c),
    "data-screen-label": "Thread · " + name
  }, searchOpen ? /*#__PURE__*/React.createElement("header", {
    className: "dm-head dm-thread-head dm-thread-search",
    role: "search"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn",
    "aria-label": "Close search",
    onClick: closeSearch
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-search dm-search-inline"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:search",
    size: 18,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "search",
    value: q,
    placeholder: "Search in " + (c.kind === "group" ? name : firstName) + "…",
    "aria-label": "Search in conversation",
    autoFocus: true,
    onChange: e => setQ(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") stepHit(e.shiftKey ? 1 : -1);
      if (e.key === "Escape") closeSearch();
    }
  }), q && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-search-clear",
    "aria-label": "Clear search",
    onClick: () => setQ("")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 16,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "dm-search-count",
    "aria-live": "polite"
  }, needle ? hits.length ? Math.min(hit, hits.length - 1) + 1 + "/" + hits.length : "0" : ""), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Older result",
    disabled: hits.length < 2,
    onClick: () => stepHit(-1)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-up",
    size: 22,
    color: hits.length < 2 ? "var(--gray-300)" : "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Newer result",
    disabled: hits.length < 2,
    onClick: () => stepHit(1)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-down",
    size: 22,
    color: hits.length < 2 ? "var(--gray-300)" : "var(--brand-navy)"
  }))) : /*#__PURE__*/React.createElement("header", {
    className: "dm-head dm-thread-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn",
    "aria-label": "Back to chats",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-thread-id",
    onClick: onProfile,
    "aria-label": c.kind === "group" ? "View group members" : "View " + name + "'s profile"
  }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
    c: c,
    size: 40
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-thread-idmain"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-thread-name"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "dm-thread-status"
  }, c.kind === "group" ? members.length + 1 + " members" + (onlineN ? " · " + onlineN + " online" : "") : presenceDM(person)))), DM_WEB ?
  /*#__PURE__*/
  /* Messenger-style tools: call · video, then info (page) or minimise · close (popup) */
  React.createElement("span", {
    className: "dm-thread-tools"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Call " + name,
    onClick: () => toast("Calling " + firstName + "…")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:phone",
    size: 20,
    color: "var(--dm-me, var(--brand-navy))"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Video call " + name,
    onClick: () => toast("Starting a video call with " + firstName + "…")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:video",
    size: 21,
    color: "var(--dm-me, var(--brand-navy))"
  })), popup ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Minimise chat",
    onClick: onMinimize
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:minus",
    size: 20,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Close chat",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-700)"
  }))) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm" + (infoOpen ? " on" : ""),
    "aria-label": "Conversation information",
    "aria-pressed": !!infoOpen,
    onClick: onInfo
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:info",
    size: 21,
    color: infoOpen ? "#fff" : "var(--dm-me, var(--brand-navy))"
  }))) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn",
    "aria-label": "Conversation settings",
    "aria-haspopup": "dialog",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:more-vertical",
    size: 22,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll dm-thread-body",
    ref: bodyRef,
    onClick: () => {
      setReactOpen(null);
    }
  }, searchOpen && needle && !hits.length && /*#__PURE__*/React.createElement("div", {
    className: "dm-search-none",
    role: "status"
  }, "No messages match “", needle, "”"), isEmpty && !typing ? /*#__PURE__*/React.createElement("div", {
    className: "dm-thread-empty"
  }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
    c: c,
    size: 84,
    dot: false
  }), /*#__PURE__*/React.createElement("b", null, c.kind === "group" ? "Welcome to " + name : "Say hello to " + firstName), /*#__PURE__*/React.createElement("p", null, c.kind === "group" ? "No messages yet — be the first to post something for the group." : "No messages yet. Send " + firstName + " a message or a photo to get the conversation going."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-btn-wave",
    onClick: sendWave
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "👋"), " Send a wave")) : /*#__PURE__*/React.createElement(React.Fragment, null, !isEmpty && /*#__PURE__*/React.createElement("div", {
    className: "dm-daychip"
  }, /*#__PURE__*/React.createElement("span", null, fmtListTimeDM(c.messages[0].ts) !== fmtClockDM(c.messages[0].ts) ? fmtListTimeDM(c.messages[0].ts) : "Today")), c.messages.map((m, i) => {
    const prev = c.messages[i - 1];
    const showSender = !prev || prev.from !== m.from || m.ts - prev.ts > 10 * MIN_DM;
    return /*#__PURE__*/React.createElement(BubbleDM, {
      key: m.id,
      m: m,
      c: c,
      sender: m.from === "me" ? ME_DM : people.get(m.from),
      showSender: showSender,
      onReact: onReact.bind(null, c.id),
      onActions: msg => setActionsFor(msg),
      reactOpen: reactOpen === m.id,
      setReactOpen: setReactOpen,
      onOpenImage: setLightbox,
      highlight: searchOpen ? needle : "",
      isHit: m.id === hitId
    });
  })), typing && /*#__PURE__*/React.createElement("div", {
    className: "dm-msg" + (c.kind === "group" ? " grouped first" : "")
  }, c.kind === "group" && /*#__PURE__*/React.createElement("span", {
    className: "dm-msg-av"
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: typing.name,
    src: typing.avatar,
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-msg-col"
  }, c.kind === "group" && /*#__PURE__*/React.createElement("span", {
    className: "dm-msg-sender"
  }, nickDM(c, typing)), /*#__PURE__*/React.createElement("div", {
    className: "dm-msg-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble dm-typing",
    "aria-label": typing.name + " is typing"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)))))), editing && /*#__PURE__*/React.createElement("div", {
    className: "dm-editbar",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:pencil",
    size: 16,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, "Editing message · ", fmtCountdownDM(EDIT_WINDOW_DM - (now - editing.ts)), " left"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Cancel edit",
    onClick: cancelEdit
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--gray-600)"
  }))), attach && !editing && /*#__PURE__*/React.createElement("div", {
    className: "dm-attach-bar",
    role: "status"
  }, attach.kind === "video" ? /*#__PURE__*/React.createElement("span", {
    className: "dm-attach-thumb video"
  }, attach.poster ? /*#__PURE__*/React.createElement("img", {
    src: attach.poster,
    alt: ""
  }) : /*#__PURE__*/React.createElement("video", {
    src: attach.src,
    muted: true,
    playsInline: true,
    preload: "metadata"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-video-play sm"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:play",
    size: 14,
    color: "#fff"
  }))) : /*#__PURE__*/React.createElement("img", {
    className: "dm-attach-thumb",
    src: attach.src,
    alt: "Attached photo"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-attach-text"
  }, attach.kind === "video" ? "Video attached" + (attach.size ? " · " + fmtBytesDM(attach.size) : "") : "Photo attached"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": attach.kind === "video" ? "Remove video" : "Remove photo",
    onClick: () => setAttach(null)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dm-composer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn dm-plus" + (attachOpen ? " open" : attach ? " on" : ""),
    "aria-label": attachOpen ? "Close menu" : "Add to message",
    "aria-haspopup": "menu",
    "aria-expanded": attachOpen,
    disabled: !!editing,
    onClick: () => {
      setEmojiOpen(false);
      inputRef.current && inputRef.current.blur();
      setAttachOpen(v => !v);
    }
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: attach && !attachOpen ? attach.kind === "video" ? "lucide:video" : "lucide:image-plus" : "lucide:plus",
    size: 22,
    color: editing ? "var(--gray-300)" : "var(--brand-navy)"
  })), attachOpen && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dm-plus-scrim",
    onClick: () => setAttachOpen(false)
  }), /*#__PURE__*/React.createElement(PlusMenuDM, {
    onClose: () => setAttachOpen(false),
    items: [{
      icon: "lucide:sticker",
      label: "Stickers",
      onClick: () => openStickers("sticker")
    }, {
      icon: "lucide:film",
      label: "GIFs",
      onClick: () => openStickers("gif")
    }, {
      icon: "lucide:smile",
      label: "Emoji",
      onClick: () => {
        setAttachOpen(false);
        setEmojiOpen(true);
      }
    }, {
      icon: "lucide:image",
      label: "Photo or video",
      onClick: () => {
        setAttachOpen(false);
        fileRef.current && fileRef.current.click();
      }
    }, {
      icon: "lucide:camera",
      label: "Take photo",
      onClick: () => {
        setAttachOpen(false);
        camRef.current && camRef.current.click();
      }
    }, {
      icon: "lucide:video",
      label: "Record video",
      onClick: () => {
        setAttachOpen(false);
        vidRef.current && vidRef.current.click();
      }
    }]
  })), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*,video/*",
    hidden: true,
    onChange: onPickFile
  }), /*#__PURE__*/React.createElement("input", {
    ref: camRef,
    type: "file",
    accept: "image/*",
    capture: "environment",
    hidden: true,
    onChange: onPickFile
  }), /*#__PURE__*/React.createElement("input", {
    ref: vidRef,
    type: "file",
    accept: "video/*",
    capture: "environment",
    hidden: true,
    onChange: onPickFile
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-composer-field"
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "text",
    value: text,
    placeholder: editing ? "Edit message…" : attach ? "Add a caption…" : "Message…",
    "aria-label": editing ? "Edit message" : "Message",
    onChange: e => setText(e.target.value),
    onFocus: () => setEmojiOpen(false),
    onKeyDown: e => {
      if (e.key === "Enter") submit();
      if (e.key === "Escape" && editing) cancelEdit();
    }
  })), DM_WEB && !canSend && !editing ?
  /*#__PURE__*/
  /* nothing typed → Messenger's quick emoji (customisable per chat) */
  React.createElement("button", {
    type: "button",
    className: "dm-send dm-quick",
    "aria-label": "Send " + (c.emoji || "👍"),
    onClick: () => {
      onSend(c.id, {
        from: "me",
        text: c.emoji || "👍"
      });
      simulateReply();
    }
  }, c.emoji || "👍") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-send" + (canSend ? " on" : ""),
    "aria-label": editing ? "Save edit" : "Send",
    disabled: !canSend,
    onClick: submit
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: editing ? "lucide:check" : "lucide:arrow-up",
    size: 20,
    color: "#fff"
  }))), emojiOpen && /*#__PURE__*/React.createElement(EmojiPickerDM, {
    onPick: insertEmoji,
    onClose: () => {
      setEmojiOpen(false);
      requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
    }
  }), !emojiOpen && /*#__PURE__*/React.createElement("div", {
    className: "dm-composer-safe",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement(SheetDM, {
    open: !!actMsg,
    onClose: () => setActionsFor(null),
    label: "Message options"
  }, actMsg && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-quote" + (actMsg.from === "me" ? " me" : "") + (actMsg.image || actMsg.video || actMsg.gif || actMsg.sticker ? " has-img" : "")
  }, actMsg.image && /*#__PURE__*/React.createElement("img", {
    className: "dm-sheet-quote-img",
    src: actMsg.image,
    alt: ""
  }), actMsg.video && (actMsg.video.poster ? /*#__PURE__*/React.createElement("img", {
    className: "dm-sheet-quote-img",
    src: actMsg.video.poster,
    alt: ""
  }) : actMsg.video.src ? /*#__PURE__*/React.createElement("video", {
    className: "dm-sheet-quote-img",
    src: actMsg.video.src,
    muted: true,
    playsInline: true,
    preload: "metadata"
  }) : null), actMsg.gif && /*#__PURE__*/React.createElement("img", {
    className: "dm-sheet-quote-img",
    src: actMsg.gif.src,
    alt: ""
  }), actMsg.sticker && /*#__PURE__*/React.createElement(DmStickerDM, {
    sticker: actMsg.sticker,
    size: 64
  }), actMsg.text || (actMsg.gif ? "GIF" : actMsg.sticker ? "Sticker" : actMsg.video ? "Video" : actMsg.image ? "Photo" : "")), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-reacts",
    role: "toolbar",
    "aria-label": "React"
  }, REACTIONS_QUICK_DM.map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    type: "button",
    className: "dm-react-opt" + ((actMsg.reactions[e] || []).includes("me") ? " on" : ""),
    "aria-label": "React " + e,
    onClick: () => {
      onReact(c.id, actMsg.id, e);
      setActionsFor(null);
    }
  }, e))), onPin && /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: actMsg.pinned ? "lucide:pin-off" : "lucide:pin",
    label: actMsg.pinned ? "Unpin message" : "Pin message",
    sub: actMsg.pinned ? null : "Shows under Chat info",
    onClick: () => {
      onPin(c.id, actMsg.id);
      setActionsFor(null);
      toast(actMsg.pinned ? "Message unpinned" : "Message pinned");
    }
  }), actMsg.text && /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:copy",
    label: "Copy text",
    onClick: () => {
      try {
        navigator.clipboard && navigator.clipboard.writeText(actMsg.text);
      } catch (e) {}
      setActionsFor(null);
      toast("Copied");
    }
  }), actMsg.image && /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:maximize-2",
    label: "View photo",
    onClick: () => {
      setActionsFor(null);
      setLightbox({
        kind: "image",
        src: actMsg.image
      });
    }
  }), actMsg.video && actMsg.video.src && /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:play",
    label: "Play video",
    onClick: () => {
      setActionsFor(null);
      setLightbox({
        kind: "video",
        src: actMsg.video.src,
        poster: actMsg.video.poster
      });
    }
  }), actMsg.from === "me" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:pencil",
    label: "Edit message",
    disabled: !canEdit || !!actMsg.gif || !!actMsg.sticker,
    sub: canEdit ? fmtCountdownDM(editLeft) + " left to edit" : "Edit window closed (5 min)",
    onClick: () => startEdit(actMsg)
  }), /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:trash-2",
    label: "Delete message",
    danger: true,
    onClick: () => {
      onDelete(c.id, actMsg.id);
      setActionsFor(null);
      toast("Message deleted");
    }
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-sheet-cancel",
    onClick: () => setActionsFor(null)
  }, "Cancel"))), stickerOpen && /*#__PURE__*/React.createElement(DmStickerSheetDM, {
    initialMode: stickerOpen,
    onClose: () => setStickerOpen(null),
    onSend: sendSticker,
    onSendGif: sendGif
  }), lightbox && /*#__PURE__*/React.createElement("div", {
    className: "dm-lightbox",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": lightbox.kind === "video" ? "Video" : "Photo",
    onClick: () => setLightbox(null)
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-lightbox-close",
    "aria-label": lightbox.kind === "video" ? "Close video" : "Close photo",
    autoFocus: true,
    onClick: () => setLightbox(null)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "#fff"
  })), lightbox.kind === "video" ? /*#__PURE__*/React.createElement("video", {
    src: lightbox.src,
    poster: lightbox.poster || undefined,
    controls: true,
    autoPlay: true,
    playsInline: true,
    onClick: e => e.stopPropagation()
  }) : /*#__PURE__*/React.createElement("img", {
    src: lightbox.src,
    alt: "",
    onClick: e => e.stopPropagation()
  })));
}

/* ---------------------------------------------------------------------------
   Profile — person or group (branch on kind)
   --------------------------------------------------------------------------- */
function ProfileViewDM({
  c,
  onBack,
  onToggleMute,
  onAddMembers,
  onLeave,
  onOpenThreadWith,
  toast
}) {
  const people = usePeopleDM();
  const membersRef = useRefDM(null);
  if (c.kind === "group") {
    const members = c.memberIds.map(people.get).filter(Boolean);
    const roleOf = id => (c.roles || {})[id] || "Member";
    const all = [{
      ...ME_DM,
      role: roleOf("me") === "Member" ? ME_DM.role : roleOf("me"),
      isMe: true
    }].concat(members);
    return /*#__PURE__*/React.createElement("div", {
      className: "dm-view",
      "data-screen-label": "Group profile"
    }, /*#__PURE__*/React.createElement(BackHeaderDM, {
      title: "",
      onBack: onBack
    }), /*#__PURE__*/React.createElement("div", {
      className: "dm-scroll dm-profile"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dm-profile-top"
    }, /*#__PURE__*/React.createElement(GroupStackDM, {
      members: members,
      size: 104
    }), /*#__PURE__*/React.createElement("h2", {
      className: "dm-profile-name"
    }, c.name), /*#__PURE__*/React.createElement("span", {
      className: "dm-profile-role"
    }, members.length + 1, " members · ", members.filter(p => p.online).length, " online"), /*#__PURE__*/React.createElement("div", {
      className: "dm-profile-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-pact",
      onClick: () => membersRef.current && membersRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
      name: "lucide:users",
      size: 20,
      color: "var(--brand-navy)"
    })), "View members"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-pact",
      onClick: onAddMembers
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
      name: "lucide:user-plus",
      size: 20,
      color: "var(--brand-navy)"
    })), "Add members"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-pact" + (c.muted ? " on" : ""),
      "aria-pressed": !!c.muted,
      onClick: onToggleMute
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
      name: c.muted ? "lucide:bell-off" : "lucide:bell",
      size: 20,
      color: "var(--brand-navy)"
    })), c.muted ? "Unmute" : "Mute"))), /*#__PURE__*/React.createElement("section", {
      className: "dm-psec",
      ref: membersRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "dm-psec-h"
    }, /*#__PURE__*/React.createElement("h3", null, "Members"), /*#__PURE__*/React.createElement("span", {
      className: "dm-psec-n"
    }, all.length)), /*#__PURE__*/React.createElement("div", {
      className: "dm-members",
      role: "list"
    }, all.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "dm-member",
      role: "listitem"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dm-facewrap",
      style: {
        width: 44,
        height: 44
      }
    }, /*#__PURE__*/React.createElement(DMFace, {
      name: p.name,
      src: p.avatar,
      size: 44
    }), p.online && /*#__PURE__*/React.createElement("span", {
      className: "dm-online sm"
    })), /*#__PURE__*/React.createElement("span", {
      className: "dm-member-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dm-member-name"
    }, p.name, p.isMe && /*#__PURE__*/React.createElement("span", {
      className: "dm-you"
    }, "You")), /*#__PURE__*/React.createElement("span", {
      className: "dm-member-sub"
    }, p.isMe ? ME_DM.role : p.role)), /*#__PURE__*/React.createElement("span", {
      className: "dm-role" + (roleOf(p.id) === "Admin" ? " admin" : roleOf(p.id) === "Moderator" ? " mod" : "")
    }, roleOf(p.id)), !p.isMe && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-iconbtn sm",
      "aria-label": "Message " + p.name,
      onClick: () => onOpenThreadWith(p.id)
    }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
      name: "lucide:message-circle",
      size: 19,
      color: "var(--brand-navy)"
    })))))), /*#__PURE__*/React.createElement("section", {
      className: "dm-psec"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-leave",
      onClick: onLeave
    }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
      name: "lucide:log-out",
      size: 20,
      color: "var(--error)"
    }), " Leave group")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 32
      }
    })));
  }
  const p = people.get(c.personId) || {
    name: "Unknown",
    seals: []
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view",
    "data-screen-label": "Contact profile"
  }, /*#__PURE__*/React.createElement(BackHeaderDM, {
    title: "",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll dm-profile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-profile-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-facewrap",
    style: {
      width: 104,
      height: 104
    }
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: p.name,
    src: p.avatar,
    size: 104
  }), p.online && /*#__PURE__*/React.createElement("span", {
    className: "dm-online lg"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "dm-profile-name"
  }, p.name, p.seals && p.seals.length > 0 && /*#__PURE__*/React.createElement(DSDM.VerificationSeals, {
    seals: p.seals,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-profile-role"
  }, p.role), /*#__PURE__*/React.createElement("span", {
    className: "dm-profile-presence"
  }, presenceDM(p)), /*#__PURE__*/React.createElement("div", {
    className: "dm-profile-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-pact",
    onClick: () => goDM(DM_WEB ? profileHrefDM(p, "MessagesWeb.html?t=" + c.id) : "ClinicianDirectory.html?from=" + encodeURIComponent("Messages.html?t=" + c.id))
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:user",
    size: 20,
    color: "var(--brand-navy)"
  })), "View Profile"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-pact" + (c.muted ? " on" : ""),
    "aria-pressed": !!c.muted,
    onClick: onToggleMute
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: c.muted ? "lucide:bell-off" : "lucide:bell",
    size: 20,
    color: "var(--brand-navy)"
  })), c.muted ? "Unmute" : "Mute"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-pact",
    onClick: () => toast("Calling " + stripHonorificDM(p.name).split(" ")[0] + "…")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:phone",
    size: 20,
    color: "var(--brand-navy)"
  })), "Call"))), /*#__PURE__*/React.createElement("section", {
    className: "dm-psec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-psec-h"
  }, /*#__PURE__*/React.createElement("h3", null, "About")), /*#__PURE__*/React.createElement("div", {
    className: "dm-about"
  }, p.email && /*#__PURE__*/React.createElement("div", {
    className: "dm-about-row"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:mail",
    size: 19,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, p.email)), p.clinic && /*#__PURE__*/React.createElement("div", {
    className: "dm-about-row"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:building-2",
    size: 19,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, p.clinic)), p.website && /*#__PURE__*/React.createElement("div", {
    className: "dm-about-row"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:globe",
    size: 19,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, p.website)), p.instagram && /*#__PURE__*/React.createElement("div", {
    className: "dm-about-row"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "mdi:instagram",
    size: 19,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, p.instagram)))), p.media && p.media.length > 0 && /*#__PURE__*/React.createElement("section", {
    className: "dm-psec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-psec-h"
  }, /*#__PURE__*/React.createElement("h3", null, "Shared media"), /*#__PURE__*/React.createElement("span", {
    className: "dm-psec-n"
  }, p.media.length)), /*#__PURE__*/React.createElement("div", {
    className: "dm-media"
  }, p.media.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: ""
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 32
    }
  })));
}

/* ---------------------------------------------------------------------------
   Chat info panel (desktop, right-hand column) — Messenger's conversation
   sidebar: identity, Mute · Search · More, then collapsible Chat info /
   Customize chat / Chat members / Media / Privacy sections. Customisation
   writes theme · emoji · nicknames · name · photo onto the conversation.
   --------------------------------------------------------------------------- */
function InfoSecDM({
  title,
  open,
  onToggle,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "dm-info-sec"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-info-sech",
    "aria-expanded": open,
    onClick: onToggle
  }, /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: open ? "lucide:chevron-up" : "lucide:chevron-down",
    size: 18,
    color: "var(--gray-500)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "dm-info-body"
  }, children));
}
function InfoRowDM({
  icon,
  label,
  sub,
  danger,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-info-row" + (danger ? " danger" : ""),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-info-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: icon,
    size: 19,
    color: danger ? "var(--error)" : "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-info-label"
  }, label, sub && /*#__PURE__*/React.createElement("small", null, sub)));
}
const CHAT_EMOJI_PICKS_DM = EMOJI_GROUPS_DM.reduce((all, g) => all.concat(g.emojis), []);
function InfoSheetsDM({
  c,
  sheet,
  onClose,
  onCustomize,
  toast,
  members
}) {
  const people = usePeopleDM();
  const [draft, setDraft] = useStateDM("");
  const [nicks, setNicks] = useStateDM({});
  const photoRef = useRefDM(null);
  useEffectDM(() => {
    setDraft(c.name || "");
    setNicks(c.nicknames || {});
  }, [sheet, c.id]);
  const pinned = c.messages.filter(m => m.pinned && !m.deleted);
  const everyone = [ME_DM].concat(c.kind === "group" ? members : [people.get(c.personId)].filter(Boolean));
  const senderOf = m => m.from === "me" ? ME_DM : people.get(m.from);
  const labelOf = m => m.text || (m.gif ? "GIF" : m.sticker ? "Sticker" : m.video ? "Video" : m.image ? "Photo" : "");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SheetDM, {
    open: sheet === "pinned",
    onClose: onClose,
    title: "Pinned messages",
    label: "Pinned messages",
    className: "dm-sheet-info"
  }, pinned.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:pin",
    size: 34,
    color: "var(--gray-300)"
  }), /*#__PURE__*/React.createElement("b", null, "No pinned messages"), /*#__PURE__*/React.createElement("p", null, "Open a message's options and choose Pin to keep it here.")) : /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-list"
  }, pinned.map(m => {
    const p = senderOf(m);
    return /*#__PURE__*/React.createElement("div", {
      key: m.id,
      className: "dm-pinned-row"
    }, /*#__PURE__*/React.createElement(DMFace, {
      name: p ? p.name : "?",
      src: p && p.avatar,
      size: 32
    }), /*#__PURE__*/React.createElement("span", {
      className: "dm-pinned-main"
    }, /*#__PURE__*/React.createElement("b", null, p ? nickDM(c, p) : ""), labelOf(m), /*#__PURE__*/React.createElement("span", {
      className: "t"
    }, fmtListTimeDM(m.ts), " · ", fmtClockDM(m.ts))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost dm-btn-grow",
    onClick: onClose
  }, "Done"))), /*#__PURE__*/React.createElement(SheetDM, {
    open: sheet === "name",
    onClose: onClose,
    title: "Change chat name",
    label: "Change chat name",
    className: "dm-sheet-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-groupname"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: draft,
    maxLength: 60,
    autoFocus: true,
    placeholder: "Group name",
    "aria-label": "Group name",
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter" && draft.trim()) {
        onCustomize({
          name: draft.trim()
        });
        toast("Chat name updated");
        onClose();
      }
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost dm-btn-grow",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-btn-grow",
    disabled: !draft.trim() || draft.trim() === c.name,
    onClick: () => {
      onCustomize({
        name: draft.trim()
      });
      toast("Chat name updated");
      onClose();
    }
  }, "Save"))), /*#__PURE__*/React.createElement(SheetDM, {
    open: sheet === "photo",
    onClose: onClose,
    title: "Change photo",
    label: "Change photo",
    className: "dm-sheet-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-photo-pick"
  }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
    c: c,
    size: 96,
    dot: false
  }), /*#__PURE__*/React.createElement("input", {
    ref: photoRef,
    type: "file",
    accept: "image/*",
    hidden: true,
    onChange: e => {
      const f = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!f) return;
      shrinkImageDM(f, 320).then(url => {
        onCustomize({
          photo: url
        });
        toast("Photo updated");
        onClose();
      });
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy",
    onClick: () => photoRef.current && photoRef.current.click()
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:image",
    size: 18,
    color: "#fff"
  }), "Upload photo"), c.photo && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost",
    onClick: () => {
      onCustomize({
        photo: null
      });
      toast("Photo removed");
      onClose();
    }
  }, "Remove photo"))), /*#__PURE__*/React.createElement(SheetDM, {
    open: sheet === "theme",
    onClose: onClose,
    title: "Change theme",
    label: "Change theme",
    className: "dm-sheet-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-theme-grid",
    role: "radiogroup",
    "aria-label": "Theme"
  }, CHAT_THEMES_DM.map(t => {
    const on = (c.theme || "navy") === t.key;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      role: "radio",
      "aria-checked": on,
      className: "dm-theme-opt" + (on ? " on" : ""),
      onClick: () => {
        onCustomize({
          theme: t.key
        });
        toast(t.label + " theme");
      }
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        background: t.swatch
      }
    }), t.label);
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost dm-btn-grow",
    onClick: onClose
  }, "Done"))), /*#__PURE__*/React.createElement(SheetDM, {
    open: sheet === "emoji",
    onClose: onClose,
    title: "Change emoji",
    label: "Change emoji",
    className: "dm-sheet-info"
  }, /*#__PURE__*/React.createElement("p", {
    className: "dm-sheet-body"
  }, "Sent with one tap when the message box is empty."), /*#__PURE__*/React.createElement("div", {
    className: "dm-emoji-pick",
    role: "radiogroup",
    "aria-label": "Quick emoji"
  }, CHAT_EMOJI_PICKS_DM.map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    type: "button",
    role: "radio",
    "aria-checked": (c.emoji || "👍") === e,
    className: (c.emoji || "👍") === e ? "on" : "",
    onClick: () => {
      onCustomize({
        emoji: e
      });
      toast("Emoji changed to " + e);
      onClose();
    }
  }, e)))), /*#__PURE__*/React.createElement(SheetDM, {
    open: sheet === "nicknames",
    onClose: onClose,
    title: "Edit nicknames",
    label: "Edit nicknames",
    className: "dm-sheet-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-list"
  }, everyone.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "dm-nick-row"
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: p.name,
    src: p.avatar,
    size: 40
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: nicks[p.id] || "",
    placeholder: p.name,
    "aria-label": "Nickname for " + p.name,
    maxLength: 40,
    onChange: e => setNicks(n => ({
      ...n,
      [p.id]: e.target.value
    }))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost dm-btn-grow",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-btn-grow",
    onClick: () => {
      const clean = {};
      Object.keys(nicks).forEach(k => {
        const v = String(nicks[k] || "").trim();
        if (v) clean[k] = v;
      });
      onCustomize({
        nicknames: clean
      });
      toast("Nicknames saved");
      onClose();
    }
  }, "Save"))));
}
function InfoPanelDM({
  c,
  onToggleMute,
  onSearch,
  onMore,
  onCustomize,
  onOpenThreadWith,
  onAddMembers,
  onLeave,
  onDelete,
  toast
}) {
  const people = usePeopleDM();
  const [open, setOpen] = useStateDM({
    info: true,
    custom: true,
    members: true,
    media: true,
    privacy: false
  });
  const [sheet, setSheet] = useStateDM(null);
  const toggle = k => setOpen(o => ({
    ...o,
    [k]: !o[k]
  }));
  const isGroup = c.kind === "group";
  const person = isGroup ? null : people.get(c.personId);
  const members = isGroup ? c.memberIds.map(people.get).filter(Boolean) : [];
  const name = isGroup ? c.name : nickDM(c, person);
  const pinned = c.messages.filter(m => m.pinned && !m.deleted);
  const theme = CHAT_THEMES_DM.find(t => t.key === (c.theme || "navy"));
  const roleOf = id => (c.roles || {})[id] || "Member";
  return /*#__PURE__*/React.createElement("aside", {
    className: "dm-info",
    "aria-label": "Conversation information"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll dm-info-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-info-top"
  }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
    c: c,
    size: 96,
    dot: false
  }), /*#__PURE__*/React.createElement("h2", {
    className: "dm-info-name"
  }, name, person && person.seals && person.seals.length > 0 && /*#__PURE__*/React.createElement(DSDM.VerificationSeals, {
    seals: person.seals,
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-info-sub"
  }, isGroup ? members.length + 1 + " members · " + members.filter(p => p.online).length + " online" : person ? person.role + " · " + presenceDM(person) : ""), /*#__PURE__*/React.createElement("div", {
    className: "dm-info-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-info-act",
    "aria-pressed": !!c.muted,
    onClick: onToggleMute
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: c.muted ? "lucide:bell-off" : "lucide:bell",
    size: 20,
    color: "var(--text-heading)"
  })), c.muted ? "Unmute" : "Mute"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-info-act",
    onClick: onSearch
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:search",
    size: 20,
    color: "var(--text-heading)"
  })), "Search"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-info-act",
    onClick: onMore,
    "aria-haspopup": "dialog"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 20,
    color: "var(--text-heading)"
  })), "More"))), /*#__PURE__*/React.createElement(InfoSecDM, {
    title: "Chat info",
    open: open.info,
    onToggle: () => toggle("info")
  }, /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:pin",
    label: "View pinned messages",
    sub: pinned.length ? pinned.length + " pinned" : null,
    onClick: () => setSheet("pinned")
  }), person && /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:user",
    label: "View profile",
    onClick: () => goDM(profileHrefDM(person, "MessagesWeb.html?t=" + c.id))
  }), person && person.email && /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:mail",
    label: "Email",
    sub: person.email,
    onClick: () => {
      try {
        navigator.clipboard && navigator.clipboard.writeText(person.email);
      } catch (e) {}
      toast("Email copied");
    }
  }), person && person.clinic && /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:building-2",
    label: person.clinic,
    sub: person.website || null,
    onClick: () => toast(person.clinic)
  })), /*#__PURE__*/React.createElement(InfoSecDM, {
    title: "Customize chat",
    open: open.custom,
    onToggle: () => toggle("custom")
  }, isGroup && /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:pencil",
    label: "Change chat name",
    onClick: () => setSheet("name")
  }), isGroup && /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:image",
    label: "Change photo",
    onClick: () => setSheet("photo")
  }), /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:palette",
    label: "Change theme",
    sub: theme ? theme.label : null,
    onClick: () => setSheet("theme")
  }), /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:thumbs-up",
    label: "Change emoji",
    sub: c.emoji || "👍",
    onClick: () => setSheet("emoji")
  }), /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:case-sensitive",
    label: "Edit nicknames",
    onClick: () => setSheet("nicknames")
  })), isGroup && /*#__PURE__*/React.createElement(InfoSecDM, {
    title: "Chat members",
    open: open.members,
    onToggle: () => toggle("members")
  }, [{
    ...ME_DM,
    isMe: true
  }].concat(members).map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "dm-info-member"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-facewrap",
    style: {
      width: 40,
      height: 40
    }
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: p.name,
    src: p.avatar,
    size: 40
  }), p.online && /*#__PURE__*/React.createElement("span", {
    className: "dm-online sm"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-info-member-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-info-member-name"
  }, nickDM(c, p), p.isMe && /*#__PURE__*/React.createElement("span", {
    className: "dm-you"
  }, "You")), /*#__PURE__*/React.createElement("span", {
    className: "dm-info-member-sub"
  }, roleOf(p.isMe ? "me" : p.id) === "Admin" ? "Group creator" : roleOf(p.id) === "Moderator" ? "Moderator" : p.role)), !p.isMe && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Message " + p.name,
    onClick: () => onOpenThreadWith(p.id)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 19,
    color: "var(--text-heading)"
  })))), /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:user-plus",
    label: "Add people",
    onClick: onAddMembers
  })), person && person.media && person.media.length > 0 && /*#__PURE__*/React.createElement(InfoSecDM, {
    title: "Media & files",
    open: open.media,
    onToggle: () => toggle("media")
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-media dm-info-media"
  }, person.media.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: ""
  })))), /*#__PURE__*/React.createElement(InfoSecDM, {
    title: "Privacy & support",
    open: open.privacy,
    onToggle: () => toggle("privacy")
  }, /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: c.muted ? "lucide:bell-off" : "lucide:bell",
    label: c.muted ? "Unmute notifications" : "Mute notifications",
    onClick: onToggleMute
  }), isGroup ? /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:log-out",
    label: "Leave group",
    danger: true,
    onClick: onLeave
  }) : /*#__PURE__*/React.createElement(InfoRowDM, {
    icon: "lucide:trash-2",
    label: "Delete chat",
    danger: true,
    onClick: onDelete
  }))), /*#__PURE__*/React.createElement(InfoSheetsDM, {
    c: c,
    sheet: sheet,
    onClose: () => setSheet(null),
    onCustomize: onCustomize,
    toast: toast,
    members: members
  }));
}

/* ---------------------------------------------------------------------------
   People tab — everyone you follow, Online / Offline
   --------------------------------------------------------------------------- */
function PeopleViewDM({
  people,
  onOpenThreadWith,
  onScroll
}) {
  const [q, setQ] = useStateDM("");
  const list = people.filter(p => !p.request && p.name.toLowerCase().includes(q.toLowerCase()));
  const online = list.filter(p => p.online).sort((a, b) => a.name.localeCompare(b.name));
  const offline = list.filter(p => !p.online).sort((a, b) => (a.lastActive || 0) - (b.lastActive || 0));
  const Row = ({
    p
  }) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-person",
    onClick: () => onOpenThreadWith(p.id),
    "aria-label": "Message " + p.name + ", " + presenceDM(p)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-facewrap",
    style: {
      width: 48,
      height: 48
    }
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: p.name,
    src: p.avatar,
    size: 48
  }), p.online && /*#__PURE__*/React.createElement("span", {
    className: "dm-online"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-person-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-person-name"
  }, p.name), /*#__PURE__*/React.createElement("span", {
    className: "dm-person-presence" + (p.online ? " on" : "")
  }, presenceDM(p))), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 20,
    color: "var(--gray-400)"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view",
    "data-screen-label": "Messages · People"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dm-head dm-head-plain"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "dm-title"
  }, "People"), /*#__PURE__*/React.createElement("span", {
    className: "dm-head-sub"
  }, people.filter(p => !p.request).length, " you follow")), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll",
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement(SearchDM, {
    value: q,
    onChange: setQ,
    placeholder: "Search people"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-sec-dot on"
  }), "Online", /*#__PURE__*/React.createElement("span", {
    className: "dm-sec-n"
  }, online.length)), /*#__PURE__*/React.createElement("div", {
    className: "dm-list"
  }, online.map(p => /*#__PURE__*/React.createElement(Row, {
    key: p.id,
    p: p
  })), online.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "dm-note"
  }, "No one online right now.")), /*#__PURE__*/React.createElement("div", {
    className: "dm-sec-h"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-sec-dot"
  }), "Offline", /*#__PURE__*/React.createElement("span", {
    className: "dm-sec-n"
  }, offline.length)), /*#__PURE__*/React.createElement("div", {
    className: "dm-list"
  }, offline.map(p => /*#__PURE__*/React.createElement(Row, {
    key: p.id,
    p: p
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  })));
}

/* ---------------------------------------------------------------------------
   Conference tab — live rooms + scheduled
   --------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------
   Voice Conference — list · live stage · participants · host a room
   The live call itself is owned by voice-call.js (window.PFVoiceCall,
   localStorage "pf-voice-call") so it follows the member around the app as a
   movable mini card; this tab is the full-size stage for it.
   --------------------------------------------------------------------------- */
const CONF_PEOPLE_DM = [{
  id: "rachel",
  name: "Dr Rachel Adams",
  role: "Researcher",
  avatar: null,
  online: true
}, {
  id: "michelle",
  name: "Michelle Avery",
  role: "Clinical Psychologist",
  avatar: null,
  online: true
}, {
  id: "jordan",
  name: "Jordan Avery",
  role: "Clinical Psychologist",
  avatar: null,
  online: true
}, {
  id: "alexm",
  name: "Alex Morgan",
  role: "Mental Health Specialist",
  avatar: null,
  online: true
}, {
  id: "nadia",
  name: "Nadia Hussain",
  role: "Aesthetic Nurse",
  avatar: null,
  online: true
}];
const CONF_ROOMS_KEY_DM = "pf-voice-rooms";
const CONF_SETTINGS_KEY_DM = "pf-voice-settings";
const CONF_DESC_DM = "Easily engage in discussions! Anyone with the link can join without limits on the number of participants.";
const CONF_SCOPES_DM = [{
  key: "public",
  label: "Public"
}, {
  key: "invited",
  label: "Invited"
}, {
  key: "ended",
  label: "Ended"
}];
const CONF_EMOJIS_DM = ["👍", "❤️", "👏", "😂", "🙌", "🔥", "💯", "🤔"];
const CONF_CHAT_SEED_DM = [{
  id: "cc1",
  from: "rachel",
  text: "Sharing the before / after slides in a sec.",
  ago: 4
}, {
  id: "cc2",
  from: "michelle",
  text: "Great case — was the cannula 22G or 25G?",
  ago: 3
}, {
  id: "cc3",
  from: "tim",
  text: "22G 70mm, fanning from a single lateral entry point.",
  ago: 2
}, {
  id: "cc4",
  from: "jordan",
  text: "🙌",
  ago: 1
}];
function confGetDM(people) {
  return id => people.get(id) || CONF_PEOPLE_DM.find(p => p.id === id) || null;
}
function pluralDM(n, word) {
  return n + " " + (n === 1 ? word : word + "s");
}
function confStartedAtDM(c) {
  return c.startedAt || NOW_DM - (c.startedAgo || 0) * 1000;
}
function fmtDurationDM(ms) {
  const s = Math.max(0, Math.floor(ms / 1000)),
    h = Math.floor(s / 3600),
    m = Math.floor(s % 3600 / 60),
    r = s % 60;
  const p = n => (n < 10 ? "0" : "") + n;
  return p(h) + ":" + p(m) + ":" + p(r);
}
function fmtConfDateDM(ts) {
  const d = new Date(ts);
  const h = d.getHours(),
    m = d.getMinutes();
  return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " · " + (h % 12 || 12) + ":" + (m < 10 ? "0" : "") + m + " " + (h < 12 ? "AM" : "PM");
}
function loadRoomsDM() {
  let mine = [];
  try {
    mine = JSON.parse(localStorage.getItem(CONF_ROOMS_KEY_DM)) || [];
  } catch (e) {
    mine = [];
  }
  if (!Array.isArray(mine)) mine = [];
  return mine.concat(CONFERENCES_DM);
}
function saveRoomsDM(rooms) {
  try {
    localStorage.setItem(CONF_ROOMS_KEY_DM, JSON.stringify(rooms.filter(r => r.mine)));
  } catch (e) {}
}
function loadConfSettingsDM() {
  try {
    return {
      noise: true,
      joinMuted: true,
      chime: true,
      ...(JSON.parse(localStorage.getItem(CONF_SETTINGS_KEY_DM)) || {})
    };
  } catch (e) {
    return {
      noise: true,
      joinMuted: true,
      chime: true
    };
  }
}

/* live call — PFVoiceCall when voice-call.js is on the page, else a tiny
   localStorage shim with the same shape */
function callApiDM() {
  if (window.PFVoiceCall) return window.PFVoiceCall;
  const KEY = "pf-voice-call";
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
      return null;
    }
  };
  const write = c => {
    try {
      if (c) localStorage.setItem(KEY, JSON.stringify(c));else localStorage.removeItem(KEY);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("pf:voice-call-changed", {
      detail: {
        call: c
      }
    }));
  };
  return {
    get: read,
    start: c => write({
      ...c,
      joinedAt: Date.now(),
      muted: c.muted !== false,
      hand: false
    }),
    end: () => write(null),
    set: p => {
      const c = read();
      if (c) write({
        ...c,
        ...p
      });
    },
    toggleMute() {
      const c = read();
      if (c) write({
        ...c,
        muted: !c.muted
      });
    },
    toggleHand() {
      const c = read();
      if (c) write({
        ...c,
        hand: !c.hand
      });
    },
    setOwner() {},
    url: c => (DM_WEB ? "MessagesWeb.html" : "Messages.html") + "?tab=conference" + (c ? "&conf=" + c.id : "")
  };
}
function useVoiceCallDM() {
  const [call, setCall] = useStateDM(() => callApiDM().get());
  useEffectDM(() => {
    const sync = () => setCall(callApiDM().get());
    window.addEventListener("pf:voice-call-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pf:voice-call-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return call;
}
function ConfLiveDM({
  small
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-live" + (small ? " sm" : "")
  }, /*#__PURE__*/React.createElement("i", null), "Live");
}
function ConfStatusPillDM({
  c
}) {
  if (c.ended) return /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-pill ended"
  }, "Ended");
  if (c.live) return /*#__PURE__*/React.createElement(ConfLiveDM, {
    small: true
  });
  return /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-pill sched"
  }, "Scheduled");
}

/* one room in the list */
function ConfCardDM({
  c,
  inCall,
  selected,
  onOpen
}) {
  const people = usePeopleDM();
  const get = confGetDM(people);
  const host = get(c.hostId);
  const hostName = c.mine ? "You" : host ? host.name : "";
  const now = useNowDM(!!c.live);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-card" + (c.live ? " live" : "") + (c.ended ? " ended" : "") + (inCall ? " in-call" : "") + (selected ? " on" : ""),
    onClick: () => onOpen(c),
    "aria-current": selected ? "true" : undefined,
    "aria-label": c.name + (c.live ? ", live" : c.ended ? ", ended" : ", scheduled")
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-card-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:audio-lines",
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-card-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-card-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-card-name"
  }, c.name), /*#__PURE__*/React.createElement(ConfStatusPillDM, {
    c: c
  })), c.live ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-card-sub"
  }, "Started by: ", hostName), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-card-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-time"
  }, fmtDurationDM(now - confStartedAtDM(c))), /*#__PURE__*/React.createElement("span", null, pluralDM(c.count, "Participant")), inCall && /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-incall"
  }, "In call"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-card-sub"
  }, c.when), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-card-meta"
  }, /*#__PURE__*/React.createElement("span", null, pluralDM(c.count, "Participant")), !c.ended && /*#__PURE__*/React.createElement("span", null, "Hosted by ", hostName)))), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  }));
}

/* ---- the list column / mobile home of the tab ---- */
function ConferenceViewDM({
  rooms,
  call,
  selectedId,
  onOpen,
  onHost,
  onSettings,
  onScroll
}) {
  const people = usePeopleDM();
  const get = confGetDM(people);
  const [scope, setScope] = useStateDM("public");
  const [q, setQ] = useStateDM("");
  const [allRecent, setAllRecent] = useStateDM(false);
  const match = c => {
    if (!q) return true;
    const h = get(c.hostId);
    return c.name.toLowerCase().includes(q.toLowerCase()) || h && h.name.toLowerCase().includes(q.toLowerCase());
  };
  const ended = rooms.filter(c => c.ended && match(c));
  const activeAll = rooms.filter(c => !c.ended);
  const active = activeAll.filter(c => (c.scope === scope || scope === "public" && c.mine) && match(c)).sort((a, b) => (call && a.id === call.id ? -1 : call && b.id === call.id ? 1 : 0) || (b.live ? 1 : 0) - (a.live ? 1 : 0));
  const counts = {
    public: activeAll.filter(c => c.scope === "public" || c.mine).length,
    invited: activeAll.filter(c => c.scope === "invited").length,
    ended: ended.length
  };
  const recent = allRecent ? ended : ended.slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view dm-vc-list",
    "data-screen-label": "Messages · Voice Conference"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dm-head dm-head-inbox"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-head-row"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "dm-title"
  }, "Voice Conference"), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-headbtns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm dm-vc-gear",
    "aria-label": "Conference settings",
    onClick: onSettings
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:settings-2",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-vc-hostbtn",
    onClick: onHost
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:plus",
    size: 17,
    color: "#fff"
  }), "Host a room"))), /*#__PURE__*/React.createElement("div", {
    className: "dm-inboxtabs",
    role: "tablist",
    "aria-label": "Conference filter"
  }, CONF_SCOPES_DM.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    role: "tab",
    "aria-selected": scope === t.key,
    className: "dm-inboxtab" + (scope === t.key ? " on" : ""),
    onClick: () => setScope(t.key)
  }, t.label, counts[t.key] > 0 && /*#__PURE__*/React.createElement("span", {
    className: "dm-inboxtab-n"
  }, counts[t.key]))))), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll",
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement(SearchDM, {
    value: q,
    onChange: setQ,
    placeholder: "Search conference"
  }), scope !== "ended" && /*#__PURE__*/React.createElement("div", {
    className: "dm-conflist dm-vc-cards"
  }, active.map(c => /*#__PURE__*/React.createElement(ConfCardDM, {
    key: c.id,
    c: c,
    inCall: !!call && call.id === c.id,
    selected: selectedId === c.id,
    onOpen: onOpen
  })), active.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:audio-lines",
    size: 40,
    color: "var(--gray-300)"
  }), /*#__PURE__*/React.createElement("b", null, q ? "No rooms match" : scope === "invited" ? "No invitations right now" : "No public rooms right now"), /*#__PURE__*/React.createElement("p", null, q ? "Try a different name." : "Host a room and share the link — anyone with it can join."))), (scope === "ended" || ended.length > 0) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dm-sec-h dm-vc-sec"
  }, scope === "ended" ? "Ended conferences" : "Recent Conference", scope !== "ended" && ended.length > 4 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-viewall",
    onClick: () => setAllRecent(v => !v)
  }, allRecent ? "Show less" : "View All")), /*#__PURE__*/React.createElement("div", {
    className: "dm-conflist dm-vc-cards dm-vc-cards-ended"
  }, (scope === "ended" ? ended : recent).map(c => /*#__PURE__*/React.createElement(ConfCardDM, {
    key: c.id,
    c: c,
    selected: selectedId === c.id,
    onOpen: onOpen
  })), scope === "ended" && ended.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement("b", null, q ? "No rooms match" : "Nothing has ended yet"), /*#__PURE__*/React.createElement("p", null, "Rooms you've hosted or joined show up here once they finish.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  })));
}

/* animated purple bars — deterministic heights so SSR-free renders match */
function ConfWaveDM({
  quiet
}) {
  const bars = Array.from({
    length: 34
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-wave" + (quiet ? " quiet" : ""),
    "aria-hidden": "true"
  }, bars.map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      "--h": (0.3 + (Math.sin(i * 1.7) + 1) / 2 * 0.7).toFixed(2),
      animationDelay: (i * 0.09 % 1.1).toFixed(2) + "s"
    }
  })));
}

/* ---- the stage: navy card + control bar ---- */
function ConferenceStageDM({
  c,
  call,
  onJoin,
  onLeave,
  onToggleMute,
  onToggleHand,
  onClose,
  onParticipants,
  onRemind,
  reminded,
  toast,
  onHostAgain
}) {
  const people = usePeopleDM();
  const get = confGetDM(people);
  const host = get(c.hostId);
  const inCall = !!call && call.id === c.id;
  const now = useNowDM(!!c.live);
  const [emojiOpen, setEmojiOpen] = useStateDM(false);
  const [chatOpen, setChatOpen] = useStateDM(false);
  const [bursts, setBursts] = useStateDM([]);
  const [chat, setChat] = useStateDM(() => CONF_CHAT_SEED_DM.map(m => ({
    ...m,
    ts: NOW_DM - m.ago * MIN_DM
  })));
  const [draft, setDraft] = useStateDM("");
  const [confirmLeave, setConfirmLeave] = useStateDM(false);
  const link = c.link || "profinity.app/voice/" + c.id;
  const copy = () => {
    const done = () => toast("Link copied");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText("https://" + link).then(done, done);else done();
  };
  const share = () => {
    if (navigator.share) navigator.share({
      title: c.name,
      text: "Join my voice conference on PROfinity",
      url: "https://" + link
    }).catch(() => {});else copy();
  };
  const react = e => {
    const id = Date.now() + Math.random();
    setBursts(b => b.concat([{
      id,
      e,
      x: 20 + Math.random() * 60
    }]));
    window.setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 1400);
  };
  const sendChat = () => {
    const t = draft.trim();
    if (!t) return;
    setChat(m => m.concat([{
      id: midDM(),
      from: "me",
      text: t,
      ts: Date.now()
    }]));
    setDraft("");
  };
  const elapsed = c.live ? fmtDurationDM(now - confStartedAtDM(c)) : c.ended && c.duration ? fmtDurationDM(c.duration) : null;
  const leave = () => {
    setConfirmLeave(false);
    onLeave();
  };
  /* phone: a peek at who's in the room sits between the card and the controls
     (desktop shows the full participants column instead) */
  const roomPeople = [c.mine ? ME_DM : host].concat((c.speakerIds || []).map(get), (c.attendeeIds || []).map(id => id === "me" ? ME_DM : get(id))).filter(Boolean).filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);
  const speakingNames = (c.speakerIds || []).map(get).filter(Boolean).slice(0, 2).map(p => stripHonorificDM(p.name).split(" ")[0]);
  const roomLine = c.live ? speakingNames.length ? speakingNames.join(" & ") + (speakingNames.length === 1 ? " is" : " are") + " speaking" : c.mine ? "Waiting for people to join" : "Listening in" : (host ? "Hosted by " + (c.mine ? "you" : host.name) : "") + " · " + pluralDM(c.count, "person").replace("persons", "people") + " going";
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view dm-vc-stage-view" + (inCall ? " in-call" : ""),
    "data-screen-label": "Conference · " + c.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-stage-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-card-stage",
    role: "region",
    "aria-label": c.name
  }, /*#__PURE__*/React.createElement("header", {
    className: "dm-vc-stage-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-stage-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:audio-lines",
    size: 18,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "dm-vc-stage-name"
  }, c.name), c.live && /*#__PURE__*/React.createElement(ConfLiveDM, null), elapsed && /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-stage-time",
    "aria-label": c.live ? "Elapsed" : "Duration"
  }, elapsed), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-stage-x",
    "aria-label": inCall ? "Minimise — keep the call going" : "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "dm-vc-stage-desc"
  }, c.desc || CONF_DESC_DM), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-stage-host",
    onClick: onParticipants,
    "aria-label": "Show participants"
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: c.mine ? ME_DM.name : host ? host.name : "Host",
    src: c.mine ? ME_DM.avatar : host ? host.avatar : null,
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-stage-host-main"
  }, /*#__PURE__*/React.createElement("b", null, c.mine ? "You" : host ? host.name : "Host"), /*#__PURE__*/React.createElement("span", null, c.ended ? "Hosted" : "Host", " · ", pluralDM(c.count, "participant"))), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "rgba(255,255,255,.7)"
  })), c.live ? /*#__PURE__*/React.createElement(ConfWaveDM, null) : /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-stage-when"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: c.ended ? "lucide:check" : "lucide:clock",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, c.ended ? "This conference has ended" : c.when), /*#__PURE__*/React.createElement("span", null, c.ended ? c.when : "You'll get a nudge when it starts"))), inCall && call.hand && /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-handchip"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:hand",
    size: 14,
    color: "#fff"
  }), "Your hand is raised"), !c.ended && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-linkbox"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-link"
  }, link), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-copy",
    "aria-label": "Copy link",
    onClick: copy
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:copy",
    size: 18,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-sharerow",
    onClick: share
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-sharerow-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:share-2",
    size: 18,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-sharerow-main"
  }, /*#__PURE__*/React.createElement("b", null, "Share Voice Conference Link"), /*#__PURE__*/React.createElement("span", null, "Share a link to let others join your conference.")))), bursts.map(b => /*#__PURE__*/React.createElement("span", {
    key: b.id,
    className: "dm-vc-burst",
    style: {
      left: b.x + "%"
    }
  }, b.e))), !DM_WEB && !c.ended && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-roomstrip",
    onClick: onParticipants,
    "aria-label": "Show all participants"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-faces"
  }, roomPeople.slice(0, 4).map(p => /*#__PURE__*/React.createElement(DMFace, {
    key: p.id,
    name: p.name,
    src: p.avatar,
    size: 34
  }))), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-roomstrip-main"
  }, /*#__PURE__*/React.createElement("b", null, "In the room"), /*#__PURE__*/React.createElement("span", null, roomLine)), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-roomstrip-n"
  }, c.count), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-400)"
  })), inCall ? /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-ctlwrap"
  }, emojiOpen && /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-emojis",
    role: "group",
    "aria-label": "Reactions"
  }, CONF_EMOJIS_DM.map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    type: "button",
    onClick: () => react(e),
    "aria-label": "React " + e
  }, e))), /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-ctl",
    role: "toolbar",
    "aria-label": "Call controls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-btn mic" + (call.muted ? " off" : ""),
    "aria-pressed": call.muted,
    "aria-label": call.muted ? "Unmute" : "Mute",
    onClick: onToggleMute
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: call.muted ? "lucide:mic-off" : "lucide:mic",
    size: 22,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-btn" + (emojiOpen ? " on" : ""),
    "aria-expanded": emojiOpen,
    "aria-label": "Send a reaction",
    onClick: () => setEmojiOpen(v => !v)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:smile",
    size: 22,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-btn",
    "aria-label": "Room chat",
    onClick: () => setChatOpen(true)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:message-square",
    size: 22,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-btn" + (call.hand ? " on" : ""),
    "aria-pressed": call.hand,
    "aria-label": call.hand ? "Lower hand" : "Raise hand",
    onClick: onToggleHand
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:hand",
    size: 22,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-vc-btn end",
    "aria-label": c.mine ? "End room" : "Leave conference",
    onClick: () => c.mine ? setConfirmLeave(true) : leave()
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:phone",
    size: 22,
    color: "#fff"
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-joinwrap"
  }, c.live && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-btn-grow dm-vc-join",
    onClick: onJoin
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:mic",
    size: 18,
    color: "#fff"
  }), "Join conference"), c.live && /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-joinnote"
  }, call ? "You'll leave your current room" : "You'll join muted", " · ", c.count, " in the room"), !c.live && !c.ended && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-grow " + (reminded ? "dm-btn-ghost on" : "dm-btn-navy"),
    "aria-pressed": !!reminded,
    onClick: onRemind
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: reminded ? "lucide:bell-ring" : "lucide:bell",
    size: 18,
    color: reminded ? "var(--brand-navy)" : "#fff"
  }), reminded ? "Reminder set" : "Remind me"), c.ended && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-endstats"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, c.count), "Participants"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, c.duration ? Math.round(c.duration / 60000) + "m" : "—"), "Duration"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, c.scope === "invited" ? "Invited" : "Public"), "Room")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-btn-grow",
    onClick: onHostAgain
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:plus",
    size: 18,
    color: "#fff"
  }), "Host a similar room")))), /*#__PURE__*/React.createElement(SheetDM, {
    open: chatOpen,
    onClose: () => setChatOpen(false),
    label: "Room chat",
    title: "Room chat",
    className: "dm-sheet-tall dm-vc-chatsheet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-list dm-vc-chatlist"
  }, chat.map(m => {
    const p = m.from === "me" ? ME_DM : get(m.from);
    return /*#__PURE__*/React.createElement("div", {
      key: m.id,
      className: "dm-vc-chatmsg" + (m.from === "me" ? " me" : "")
    }, /*#__PURE__*/React.createElement(DMFace, {
      name: p ? p.name : "?",
      src: p ? p.avatar : null,
      size: 28
    }), /*#__PURE__*/React.createElement("span", {
      className: "dm-vc-chatmsg-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dm-vc-chatmsg-name"
    }, m.from === "me" ? "You" : p ? p.name : "", " · ", fmtClockDM(m.ts)), /*#__PURE__*/React.createElement("span", {
      className: "dm-vc-chatmsg-text"
    }, m.text)));
  })), /*#__PURE__*/React.createElement("form", {
    className: "dm-vc-chatform",
    onSubmit: e => {
      e.preventDefault();
      sendChat();
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: draft,
    onChange: e => setDraft(e.target.value),
    placeholder: "Message the room",
    "aria-label": "Message the room"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "dm-vc-chatsend",
    disabled: !draft.trim(),
    "aria-label": "Send"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:arrow-up",
    size: 18,
    color: "#fff"
  })))), /*#__PURE__*/React.createElement(SheetDM, {
    open: confirmLeave,
    onClose: () => setConfirmLeave(false),
    label: "End room",
    className: "dm-sheet-confirm"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "dm-sheet-title"
  }, "End the room for everyone?"), /*#__PURE__*/React.createElement("p", {
    className: "dm-sheet-body"
  }, "You're hosting. Ending closes the room for all ", c.count, " participants; it will move to Ended conferences."), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost dm-btn-grow",
    onClick: () => setConfirmLeave(false)
  }, "Keep going"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-danger dm-btn-grow",
    onClick: leave
  }, "End room"))));
}

/* ---- participants (web column / mobile sheet body) ---- */
function ConfParticipantsDM({
  c,
  call,
  onClose
}) {
  const people = usePeopleDM();
  const get = confGetDM(people);
  const [q, setQ] = useStateDM("");
  const inCall = !!call && call.id === c.id;
  const host = c.mine ? {
    ...ME_DM,
    id: "me"
  } : get(c.hostId);
  const speakers = (c.speakerIds || []).map(get).filter(Boolean);
  const attendeesRaw = (c.attendeeIds || []).map(id => id === "me" ? ME_DM : get(id)).filter(Boolean);
  const attendees = c.mine || attendeesRaw.some(p => p.id === "me") ? [ME_DM].concat(attendeesRaw.filter(p => p.id !== "me")) : attendeesRaw;
  const match = p => !q || p.name.toLowerCase().includes(q.toLowerCase());
  const shown = 1 + speakers.length + attendees.length;
  const extra = Math.max(0, (c.count || shown) - shown);
  const Row = ({
    p,
    role,
    mic,
    hand
  }) => /*#__PURE__*/React.createElement("div", {
    className: "dm-member dm-vc-member",
    role: "listitem"
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: p.name,
    src: p.avatar,
    size: 40
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-member-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-member-name"
  }, p.name, p.id === "me" && /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-you"
  }, "(You)")), /*#__PURE__*/React.createElement("span", {
    className: "dm-member-sub"
  }, p.role)), hand && /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-handic",
    "aria-label": "Hand raised"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:hand",
    size: 16,
    color: "#fff"
  })), role && /*#__PURE__*/React.createElement("span", {
    className: "dm-role" + (role === "Host" ? " admin" : " mod")
  }, role), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-micic" + (mic ? " on" : ""),
    "aria-label": mic ? "Microphone on" : "Muted"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: mic ? "lucide:mic" : "lucide:mic-off",
    size: 16,
    color: "currentColor"
  })));
  const meMic = inCall ? !call.muted : false,
    meHand = inCall && call.hand;
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-people",
    "aria-label": "Participants"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dm-vc-people-head"
  }, onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", null, "Participants ", /*#__PURE__*/React.createElement("span", null, "(", c.count || shown, ")"))), /*#__PURE__*/React.createElement(SearchDM, {
    value: q,
    onChange: setQ,
    placeholder: "Search participant"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-people-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-people-sec"
  }, "Speaker"), /*#__PURE__*/React.createElement("div", {
    role: "list"
  }, host && match(host) && /*#__PURE__*/React.createElement(Row, {
    p: host,
    role: "Host",
    mic: c.mine ? meMic : c.live,
    hand: c.mine && meHand
  }), speakers.filter(match).map((p, i) => /*#__PURE__*/React.createElement(Row, {
    key: p.id,
    p: p,
    role: "Speaker",
    mic: c.live && i < 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-people-sec"
  }, "Other Attendees"), /*#__PURE__*/React.createElement("div", {
    role: "list"
  }, attendees.filter(match).map(p => /*#__PURE__*/React.createElement(Row, {
    key: p.id,
    p: p,
    mic: p.id === "me" ? meMic : false,
    hand: p.id === "me" && meHand
  })), q && ![host].concat(speakers, attendees).filter(Boolean).some(match) && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement("b", null, "No one matches"))), !q && extra > 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-more"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-faces"
  }, attendees.slice(0, 6).map(p => /*#__PURE__*/React.createElement(DMFace, {
    key: p.id,
    name: p.name,
    src: p.avatar,
    size: 30
  }))), /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-more-n"
  }, "+", extra))));
}

/* ---- host a room ---- */
function HostRoomSheetDM({
  open,
  onClose,
  onCreate,
  preset
}) {
  const [name, setName] = useStateDM("");
  const [desc, setDesc] = useStateDM("");
  const [scope, setScope] = useStateDM("public");
  useEffectDM(() => {
    if (open) {
      setName(preset ? preset.name : "");
      setDesc(preset ? preset.desc || "" : "");
      setScope(preset ? preset.scope : "public");
    }
  }, [open]);
  const ok = name.trim().length > 1;
  return /*#__PURE__*/React.createElement(SheetDM, {
    open: open,
    onClose: onClose,
    label: "Host a room",
    title: "Host a room",
    className: "dm-vc-hostsheet"
  }, /*#__PURE__*/React.createElement("label", {
    className: "dm-vc-field"
  }, /*#__PURE__*/React.createElement("span", null, "Room name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g. Case Study Discussion",
    maxLength: 60,
    autoFocus: true
  })), /*#__PURE__*/React.createElement("label", {
    className: "dm-vc-field"
  }, /*#__PURE__*/React.createElement("span", null, "What's it about? ", /*#__PURE__*/React.createElement("em", null, "optional")), /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: e => setDesc(e.target.value),
    placeholder: CONF_DESC_DM,
    rows: 3,
    maxLength: 200
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-field"
  }, /*#__PURE__*/React.createElement("span", null, "Who can join"), /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-seg",
    role: "radiogroup",
    "aria-label": "Who can join"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "radio",
    "aria-checked": scope === "public",
    className: scope === "public" ? "on" : "",
    onClick: () => setScope("public")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:globe",
    size: 16,
    color: "currentColor"
  }), "Public"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "radio",
    "aria-checked": scope === "invited",
    className: scope === "invited" ? "on" : "",
    onClick: () => setScope("invited")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:users",
    size: 16,
    color: "currentColor"
  }), "Invited only")), /*#__PURE__*/React.createElement("p", {
    className: "dm-vc-fieldnote"
  }, scope === "public" ? "Anyone with the link can join — no limit on participants." : "Only people you share the link with in Messages can join.")), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost dm-btn-grow",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-btn-grow",
    disabled: !ok,
    onClick: () => onCreate({
      name: name.trim(),
      desc: desc.trim(),
      scope
    })
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:mic",
    size: 18,
    color: "#fff"
  }), "Start room")));
}

/* ---- settings (gear) ---- */
function ConfSettingsSheetDM({
  open,
  onClose,
  settings,
  onChange
}) {
  const rows = [{
    key: "noise",
    label: "Noise suppression",
    sub: "Filter clinic background noise from your mic"
  }, {
    key: "joinMuted",
    label: "Join rooms muted",
    sub: "Turn your mic on when you're ready to speak"
  }, {
    key: "chime",
    label: "Join & leave chimes",
    sub: "A soft tone when people come and go"
  }];
  return /*#__PURE__*/React.createElement(SheetDM, {
    open: open,
    onClose: onClose,
    label: "Conference settings",
    title: "Conference settings"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-vc-settings"
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.key,
    className: "dm-vc-setrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-vc-setrow-main"
  }, /*#__PURE__*/React.createElement("b", null, r.label), /*#__PURE__*/React.createElement("span", null, r.sub)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": !!settings[r.key],
    "aria-label": r.label,
    className: "dm-vc-switch" + (settings[r.key] ? " on" : ""),
    onClick: () => onChange({
      ...settings,
      [r.key]: !settings[r.key]
    })
  }, /*#__PURE__*/React.createElement("i", null))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-sheet-cancel",
    onClick: onClose
  }, "Done"));
}

/* desktop right pane when the Conference tab has nothing selected */
function ConfEmptyPaneDM({
  onHost
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view dm-web-empty",
    "data-screen-label": "Conference · nothing selected"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-web-empty-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:audio-lines",
    size: 34,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("b", null, "Voice conference"), /*#__PURE__*/React.createElement("p", null, "Pick a room on the left to listen in, or host your own and share the link."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy",
    onClick: onHost
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:plus",
    size: 18,
    color: "#fff"
  }), "Host a room"));
}

/* ---------------------------------------------------------------------------
   Menu tab — inbox hub
   --------------------------------------------------------------------------- */
function MenuViewDM({
  counts,
  onNav,
  onScroll,
  onTestPush
}) {
  const rows = [{
    key: "requests",
    label: "Message requests",
    icon: "lucide:mail-plus",
    n: counts.requests,
    hi: counts.requests > 0
  }, {
    key: "archived",
    label: "Archived chats",
    icon: "lucide:archive",
    n: counts.archived
  }, {
    key: "deleted",
    label: "Deleted chats",
    icon: "lucide:trash-2",
    n: counts.deleted
  }, {
    key: "groups",
    label: "Group chats",
    icon: "lucide:users",
    n: counts.groups
  }];
  /* mobile: the shared chrome's own buttons; web: the TopNav bell / account menu */
  const openNotifications = () => {
    const b = document.querySelector(DM_WEB ? "#pf-notif-bell" : ".dm-screen .m-iconbtn[aria-label='Notifications']");
    if (b) b.click();
  };
  const openMainMenu = () => {
    const b = document.querySelector(DM_WEB ? ".pf-account-trigger" : ".dm-screen .m-burger");
    if (b) b.click();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view",
    "data-screen-label": "Messages · Menu"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dm-head dm-head-plain"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "dm-title"
  }, "Menu")), /*#__PURE__*/React.createElement("div", {
    className: "dm-scroll",
    onScroll: onScroll
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-me",
    onClick: () => goDM(hrefDM("ProfileMobile.html"))
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-facewrap",
    style: {
      width: 56,
      height: 56
    }
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: ME_DM.name,
    src: ME_DM.avatar,
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-online"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-me-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-me-name"
  }, ME_DM.name, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:badge-check",
    size: 18,
    color: "var(--reaction-like, #1D9BF0)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-me-role"
  }, ME_DM.role)), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-sec-h"
  }, "Inbox"), /*#__PURE__*/React.createElement("div", {
    className: "dm-menu"
  }, rows.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.key,
    type: "button",
    className: "dm-menu-row",
    onClick: () => onNav(r.key)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: r.icon,
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-label"
  }, r.label), r.n > 0 && /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-n" + (r.hi ? " hi" : "")
  }, r.n), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "dm-sec-h"
  }, "More"), /*#__PURE__*/React.createElement("div", {
    className: "dm-menu"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-menu-row",
    onClick: openNotifications
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:bell",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-label"
  }, "Notifications"), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-menu-row",
    onClick: () => goDM(hrefDM("NotificationSettings.html"))
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:settings-2",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-label"
  }, "Message settings"), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-menu-row",
    onClick: openMainMenu
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: DM_WEB ? "lucide:user-round" : "lucide:menu",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-label"
  }, DM_WEB ? "Account menu" : "Main menu"), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-400)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dm-sec-h"
  }, "Testing"), /*#__PURE__*/React.createElement("div", {
    className: "dm-menu"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-menu-row",
    onClick: onTestPush
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:bell-ring",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-label"
  }, "Preview a notification"), /*#__PURE__*/React.createElement("span", {
    className: "dm-menu-n"
  }, "sample"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  })));
}

/* ---------------------------------------------------------------------------
   Sample push banner (Messages page only, for testing) — an incoming message
   slides in under the Dynamic Island; tap opens the thread, auto-dismisses.
   --------------------------------------------------------------------------- */
const PUSH_SAMPLES_DM = [{
  convId: "sarahc",
  from: "sarahc",
  text: "Katy, are the follow-up photos from your lip case ready for Thursday? 📸"
}, {
  convId: "g-casereview",
  from: "tim",
  text: "Reminder — case review starts in 15 minutes. Bring your before/afters!"
}, {
  convId: "miranda",
  from: "miranda",
  text: "Your Technique Tuesday seat is confirmed. See you there!"
}];
function PushBannerDM({
  push,
  onOpen,
  onClose
}) {
  const people = usePeopleDM();
  const [leaving, setLeaving] = useStateDM(false);
  useEffectDM(() => {
    setLeaving(false);
    const t1 = window.setTimeout(() => setLeaving(true), 6400);
    const t2 = window.setTimeout(onClose, 6800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [push.id]);
  const sender = people.get(push.from);
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-push" + (leaving ? " leaving" : ""),
    role: "status",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-push-main",
    onClick: onOpen,
    "aria-label": "Open message from " + (sender ? sender.name : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-push-av"
  }, /*#__PURE__*/React.createElement(DMFace, {
    name: sender ? sender.name : "?",
    src: sender && sender.avatar,
    size: 44
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-push-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-push-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-push-app"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 12,
    color: "#fff"
  }), "Messages"), /*#__PURE__*/React.createElement("span", {
    className: "dm-push-time"
  }, "now")), /*#__PURE__*/React.createElement("span", {
    className: "dm-push-name"
  }, sender ? sender.name : "", push.convName ? /*#__PURE__*/React.createElement("span", {
    className: "dm-push-ctx"
  }, " · ", push.convName) : null), /*#__PURE__*/React.createElement("span", {
    className: "dm-push-text"
  }, push.text))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-push-close",
    "aria-label": "Dismiss notification",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:x",
    size: 16,
    color: "var(--gray-600)"
  })));
}

/* ---------------------------------------------------------------------------
   Dock — Home · Chats · Conference · People · Menu
   --------------------------------------------------------------------------- */
const DOCK_TABS_DM = [{
  key: "home",
  label: "Home",
  icon: "lucide:house"
}, {
  key: "chats",
  label: "Chats",
  icon: "lucide:message-circle"
}, {
  key: "conference",
  label: "Conference",
  icon: "lucide:audio-lines"
}, {
  key: "people",
  label: "People",
  icon: "lucide:users"
}, {
  key: "menu",
  label: "Menu",
  icon: "lucide:menu"
}];
function DockDM({
  tab,
  compact,
  unread,
  onTab
}) {
  const item = (t, i) => {
    const on = t.key === tab;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      className: "dm-dock-tab" + (on ? " on" : ""),
      style: {
        "--i": i
      },
      "aria-current": on ? "page" : undefined,
      onClick: () => t.key === "home" ? goDM(hrefDM("NewsfeedMobile.html")) : onTab(t.key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
      name: t.icon,
      size: 24,
      color: on ? "#fff" : "var(--gray-900)"
    }), t.key === "chats" && unread > 0 && !on && /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, unread)), /*#__PURE__*/React.createElement("span", {
      className: "lbl"
    }, t.label));
  };
  /* Home sits in its own glass pill; the four Messages tabs share a second
     pill so they read as one group — same footer on every Messages view. */
  return /*#__PURE__*/React.createElement("nav", {
    className: "dm-dock" + (compact ? " compact" : ""),
    "aria-label": "Messages navigation"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-dock-seg dm-dock-seg-home"
  }, item(DOCK_TABS_DM[0], 0)), /*#__PURE__*/React.createElement("div", {
    className: "dm-dock-seg dm-dock-seg-main"
  }, DOCK_TABS_DM.slice(1).map((t, i) => item(t, i + 1))));
}

/* Desktop rail — the dock's four Messages tabs stacked down the left of the
   card (Home is the TopNav's job there). */
function RailDM({
  tab,
  unread,
  requests,
  onTab
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "dm-rail",
    "aria-label": "Messages navigation"
  }, DOCK_TABS_DM.slice(1).map(t => {
    const on = t.key === tab;
    const n = t.key === "chats" ? unread : t.key === "menu" ? requests : 0;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      className: "dm-rail-tab" + (on ? " on" : ""),
      "aria-current": on ? "page" : undefined,
      onClick: () => onTab(t.key)
    }, /*#__PURE__*/React.createElement("span", {
      className: "ic"
    }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
      name: t.icon,
      size: 24,
      color: on ? "#fff" : "var(--gray-700)"
    }), n > 0 && !on && /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, n)), /*#__PURE__*/React.createElement("span", {
      className: "lbl"
    }, t.label));
  }));
}
/* Desktop right pane with nothing open */
function EmptyPaneDM({
  onCompose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-view dm-web-empty",
    "data-screen-label": "Messages · nothing selected"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-web-empty-ic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:messages-square",
    size: 34,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("b", null, "Your messages"), /*#__PURE__*/React.createElement("p", null, "Pick a conversation on the left, or start a new one."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy",
    onClick: onCompose
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:square-pen",
    size: 18,
    color: "#fff"
  }), "New message"));
}

/* ---------------------------------------------------------------------------
   App
   --------------------------------------------------------------------------- */
function MessagesAppDM() {
  const [store, setStore] = useStateDM(() => applyDeepLinkDM(loadStoreDM()));
  const [tab, setTab] = useStateDM(() => ["chats", "conference", "people", "menu"].includes(paramDM("tab")) ? paramDM("tab") : paramDM("conf") ? "conference" : "chats");
  const [route, setRoute] = useStateDM(() => {
    const t = paramDM("t") || paramDM("id");
    if (t) {
      const s = applyDeepLinkDM(loadStoreDM());
      const c = s.conversations.find(x => x.id === t || x.kind === "dm" && x.personId === t);
      if (c) return {
        name: "thread",
        id: c.id,
        from: "chats"
      };
    }
    if (paramDM("conf")) return {
      name: "conf",
      id: paramDM("conf")
    };
    if (paramDM("tab") === "conference") {
      const live = callApiDM().get();
      if (live) return {
        name: "conf",
        id: live.id
      };
    }
    if (paramDM("compose") !== null) return {
      name: "compose"
    };
    if (["archived", "groups", "requests", "deleted"].includes(paramDM("view"))) return {
      name: paramDM("view")
    };
    return {
      name: "list"
    };
  });
  const [infoOpen, setInfoOpen] = useStateDM(() => DM_WEB && window.innerWidth >= 1200); // desktop chat-info column
  const [rowActions, setRowActions] = useStateDM(null);
  const [threadSearch, setThreadSearch] = useStateDM(false); // "Search in conversation" from the options sheet
  const [addMembersFor, setAddMembersFor] = useStateDM(null);
  const [confirm, setConfirm] = useStateDM(null);
  const [toastState, setToastState] = useStateDM(null);
  const toastTimer = useRefDM(null);
  const [compact, onScroll] = useScrollDockDM(tab + ":" + route.name);
  const [push, setPush] = useStateDM(null);
  /* voice conference — the live call is shared app-wide via voice-call.js */
  const call = useVoiceCallDM();
  const [rooms, setRooms] = useStateDM(loadRoomsDM);
  const [hostOpen, setHostOpen] = useStateDM(null); // { preset? } while the Host a room sheet is up
  const [confSettingsOpen, setConfSettingsOpen] = useStateDM(false);
  const [confSettings, setConfSettings] = useStateDM(loadConfSettingsDM);
  const [reminders, setReminders] = useStateDM({});
  const [peopleOpen, setPeopleOpen] = useStateDM(false); // mobile participants sheet
  useEffectDM(() => saveRoomsDM(rooms), [rooms]);
  useEffectDM(() => {
    try {
      localStorage.setItem(CONF_SETTINGS_KEY_DM, JSON.stringify(confSettings));
    } catch (e) {}
  }, [confSettings]);
  useEffectDM(() => {
    if (route.name !== "thread") setThreadSearch(false);
  }, [route.name, route.id]);
  const pushSeq = useRefDM(0);
  useEffectDM(() => saveStoreDM(store), [store]);
  useEffectDM(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  /* keep the URL's ?t= in step so refresh / share lands on the same thread */
  useEffectDM(() => {
    try {
      const url = new URL(window.location.href);
      if (route.name === "thread" || route.name === "profile") url.searchParams.set("t", route.id);else url.searchParams.delete("t");
      if (tab !== "chats") url.searchParams.set("tab", tab);else url.searchParams.delete("tab");
      if (route.name === "conf") url.searchParams.set("conf", route.id);else url.searchParams.delete("conf");
      window.history.replaceState(null, "", url.pathname + (url.search || ""));
    } catch (e) {}
  }, [route, tab]);
  /* the full stage owns the live call while it's on screen — the movable mini
     card (voice-call.js) hides here and shows everywhere else */
  useEffectDM(() => {
    const api = window.PFVoiceCall;
    if (api) api.setOwner(!!call && route.name === "conf" && route.id === call.id);
  }, [call && call.id, route.name, route.id]);
  useEffectDM(() => () => {
    const api = window.PFVoiceCall;
    if (api) api.setOwner(false);
  }, []);

  /* roster: seed + externally-added people, deduped by id (a later override —
     e.g. an accepted request — replaces the seeded entry in place) */
  const allPeople = useMemoDM(() => {
    const map = new Map();
    PEOPLE_SEED_DM.concat(store.people).forEach(p => map.set(p.id, map.has(p.id) ? {
      ...map.get(p.id),
      ...p
    } : p));
    return Array.from(map.values());
  }, [store.people]);
  const peopleCtx = useMemoDM(() => {
    const map = {};
    allPeople.forEach(p => {
      map[p.id] = p;
    });
    map.me = ME_DM;
    return {
      get: id => map[id] || null,
      all: allPeople
    };
  }, [allPeople]);
  const toast = useCallbackDM(text => {
    setToastState({
      text,
      id: Date.now()
    });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastState(null), 1900);
  }, []);
  const convs = store.conversations;
  const active = convs.filter(c => !c.archived);
  const archived = convs.filter(c => c.archived);
  const unreadTotal = active.reduce((n, c) => n + (c.unread || 0), 0);
  const current = route.id ? convs.find(c => c.id === route.id) : null;

  /* ---- sample push (testing) — adds a real incoming message, then banners it ---- */
  const firePush = useCallbackDM(() => {
    const sample = PUSH_SAMPLES_DM[pushSeq.current % PUSH_SAMPLES_DM.length];
    pushSeq.current += 1;
    const msg = {
      id: midDM(),
      from: sample.from,
      text: sample.text,
      ts: Date.now(),
      reactions: {}
    };
    const inThread = route.name === "thread" && route.id === sample.convId;
    setStore(s => s.conversations.some(c => c.id === sample.convId) ? {
      ...s,
      conversations: s.conversations.map(c => c.id !== sample.convId ? c : {
        ...c,
        archived: false,
        unread: inThread ? 0 : (c.unread || 0) + 1,
        messages: c.messages.concat([msg])
      })
    } : /* no thread with this person yet — the incoming message starts one */
    {
      ...s,
      conversations: [{
        id: sample.convId,
        kind: "dm",
        personId: sample.from,
        unread: 1,
        messages: [msg]
      }].concat(s.conversations)
    });
    if (inThread) return;
    const conv = store.conversations.find(c => c.id === sample.convId);
    setPush({
      id: Date.now(),
      convId: sample.convId,
      from: sample.from,
      text: sample.text,
      convName: conv && conv.kind === "group" ? conv.name : null
    });
  }, [route, store.conversations]);
  useEffectDM(() => {
    if (paramDM("nopush") !== null) return;
    const t = window.setTimeout(() => firePush(), 6000);
    return () => window.clearTimeout(t);
  }, []);

  /* ---- mutations ---- */
  const {
    updateConv,
    sendMessage,
    reactMessage,
    editMessage,
    deleteMessage,
    pinMessage
  } = useStoreActionsDM(setStore);
  const openThread = (c, from) => {
    updateConv(c.id, x => ({
      ...x,
      unread: 0
    }));
    setRoute({
      name: "thread",
      id: c.id,
      from: from || route.name
    });
  };
  const openThreadWith = personId => {
    const existing = convs.find(c => c.kind === "dm" && c.personId === personId);
    if (existing) {
      if (existing.archived) updateConv(existing.id, x => ({
        ...x,
        archived: false
      }));
      openThread(existing, "list");
      return;
    }
    const c = {
      id: personId,
      kind: "dm",
      personId,
      unread: 0,
      messages: []
    };
    setStore(s => ({
      ...s,
      conversations: [c].concat(s.conversations)
    }));
    setRoute({
      name: "thread",
      id: c.id,
      from: "list"
    });
  };
  const togglePin = c => {
    updateConv(c.id, x => ({
      ...x,
      pinned: !x.pinned
    }));
    toast(c.pinned ? "Unpinned" : "Pinned to top");
  };
  const toggleArchive = c => {
    updateConv(c.id, x => ({
      ...x,
      archived: !x.archived,
      pinned: false
    }));
    toast(c.archived ? "Moved back to chats" : "Chat archived");
  };
  const toggleMute = c => {
    updateConv(c.id, x => ({
      ...x,
      muted: !x.muted
    }));
    toast(c.muted ? "Notifications on" : "Muted");
  };
  const deleteConv = c => {
    setStore(s => ({
      ...s,
      conversations: s.conversations.filter(x => x.id !== c.id),
      deleted: [{
        ...c,
        archived: false,
        pinned: false
      }].concat(s.deleted)
    }));
    if (route.id === c.id) setRoute({
      name: "list"
    });
    toast("Chat deleted");
  };
  const leaveGroup = c => {
    setStore(s => ({
      ...s,
      conversations: s.conversations.filter(x => x.id !== c.id)
    }));
    if (route.id === c.id) setRoute({
      name: "list"
    });
    toast("You left " + c.name);
  };
  const restoreConv = c => {
    setStore(s => ({
      ...s,
      deleted: s.deleted.filter(x => x.id !== c.id),
      conversations: [c].concat(s.conversations)
    }));
    toast("Chat restored");
  };
  const acceptRequest = r => {
    const c = {
      id: r.personId,
      kind: "dm",
      personId: r.personId,
      unread: 0,
      messages: [{
        id: midDM(),
        from: r.personId,
        text: r.text,
        ts: r.ts,
        reactions: {}
      }]
    };
    setStore(s => ({
      ...s,
      requests: s.requests.filter(x => x.id !== r.id),
      conversations: [c].concat(s.conversations.filter(x => x.id !== c.id)),
      people: s.people.map(p => p.id === r.personId ? {
        ...p,
        request: false
      } : p)
    }));
    /* seeded request senders live in PEOPLE_SEED_DM — mark them followed via an override */
    if (PEOPLE_SEED_DM.some(p => p.id === r.personId)) setStore(s => ({
      ...s,
      people: s.people.some(p => p.id === r.personId) ? s.people : s.people.concat([{
        ...PEOPLE_SEED_DM.find(p => p.id === r.personId),
        request: false
      }])
    }));
    setRoute({
      name: "thread",
      id: c.id,
      from: "requests"
    });
    toast("Request accepted");
  };
  const declineRequest = r => {
    setStore(s => ({
      ...s,
      requests: s.requests.filter(x => x.id !== r.id)
    }));
    toast("Request declined");
  };
  const createConversation = (ids, groupName) => {
    if (ids.length === 1) {
      openThreadWith(ids[0]);
      return;
    }
    const names = ids.map(id => stripHonorificDM((peopleCtx.get(id) || {}).name || "").split(" ")[0]);
    const name = (groupName || "").trim() || (names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", "));
    const c = {
      id: "g-" + Date.now().toString(36),
      kind: "group",
      name,
      memberIds: ids,
      roles: {
        me: "Admin"
      },
      unread: 0,
      messages: []
    };
    setStore(s => ({
      ...s,
      conversations: [c].concat(s.conversations)
    }));
    setRoute({
      name: "thread",
      id: c.id,
      from: "list"
    });
    toast("Group created");
  };
  const addMembers = (c, ids) => {
    if (!ids.length) return;
    if (c.kind === "group") {
      updateConv(c.id, x => ({
        ...x,
        memberIds: x.memberIds.concat(ids.filter(id => !x.memberIds.includes(id)))
      }));
      toast(ids.length + (ids.length === 1 ? " member added" : " members added"));
    } else {
      const memberIds = [c.personId].concat(ids.filter(id => id !== c.personId));
      const names = memberIds.map(id => stripHonorificDM((peopleCtx.get(id) || {}).name || "").split(" ")[0]);
      const g = {
        id: "g-" + Date.now().toString(36),
        kind: "group",
        name: names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", "),
        memberIds,
        roles: {
          me: "Admin"
        },
        unread: 0,
        messages: []
      };
      setStore(s => ({
        ...s,
        conversations: [g].concat(s.conversations)
      }));
      setRoute({
        name: "thread",
        id: g.id,
        from: "list"
      });
      toast("Group created");
    }
    setAddMembersFor(null);
  };

  /* ---- voice conference ---- */
  const confSel = route.name === "conf" ? rooms.find(r => r.id === route.id) || null : null;
  const openConf = c => {
    setTab("conference");
    setRoute({
      name: "conf",
      id: c.id
    });
  };
  const joinConf = c => {
    const host = confGetDM(peopleCtx)(c.hostId);
    callApiDM().start({
      id: c.id,
      name: c.name,
      hostId: c.hostId,
      hostName: c.mine ? ME_DM.name : host ? host.name : "",
      hostAvatar: c.mine ? ME_DM.avatar : host ? host.avatar : null,
      link: c.link,
      count: c.count,
      mine: !!c.mine,
      startedAt: confStartedAtDM(c),
      muted: confSettings.joinMuted !== false
    });
    toast(c.mine ? "Your room is live" : "Joined " + c.name);
  };
  const leaveConf = () => {
    const live = call;
    if (!live) return;
    const room = rooms.find(r => r.id === live.id);
    callApiDM().end();
    if (room && room.mine) {
      setRooms(rs => rs.map(r => r.id !== room.id ? r : {
        ...r,
        live: false,
        ended: true,
        when: fmtConfDateDM(room.startedAt),
        duration: Date.now() - room.startedAt
      }));
      toast("Room ended");
    } else toast("You left " + live.name);
  };
  const createRoom = ({
    name,
    desc,
    scope
  }) => {
    const room = {
      id: "r-" + Date.now().toString(36),
      name,
      desc,
      scope,
      hostId: "me",
      mine: true,
      live: true,
      startedAt: Date.now(),
      count: 1,
      speakerIds: [],
      attendeeIds: [],
      link: "profinity.app/voice/" + Math.random().toString(36).slice(2, 8)
    };
    setRooms(rs => [room].concat(rs));
    setHostOpen(null);
    joinConf(room);
    openConf(room);
  };

  /* ---- navigation ---- */
  const goTab = t => {
    setTab(t);
    if (t === "conference" && call) setRoute({
      name: "conf",
      id: call.id
    });else setRoute({
      name: "list"
    });
  };
  const back = () => {
    if (route.name === "conf") {
      setRoute({
        name: "list"
      });
      return;
    }
    if (route.name === "profile") {
      setRoute({
        name: "thread",
        id: route.id,
        from: route.from
      });
      return;
    }
    if (route.name === "thread") {
      const from = route.from;
      if (from === "archived" || from === "groups" || from === "requests" || from === "deleted") {
        setRoute({
          name: from
        });
        return;
      }
      if (from === "people") {
        setTab("people");
        setRoute({
          name: "list"
        });
        return;
      }
      setTab("chats");
      setRoute({
        name: "list"
      });
      return;
    }
    if (["archived", "requests", "deleted", "groups"].includes(route.name)) {
      setRoute({
        name: "list"
      });
      return;
    }
    setRoute({
      name: "list"
    });
  };
  const showDock = route.name !== "thread" && route.name !== "profile" && route.name !== "compose" && !(route.name === "conf" && confSel);
  const counts = {
    requests: store.requests.length,
    archived: archived.length,
    deleted: store.deleted.length,
    groups: active.filter(c => c.kind === "group").length
  };

  /* The detail (thread / profile) and the list it sits over are built apart so
     the desktop layout can show both at once; the phone shows one or the other. */
  const detail = route.name === "conf" && confSel ? /*#__PURE__*/React.createElement(ConferenceStageDM, {
    key: confSel.id,
    c: confSel,
    call: call,
    onJoin: () => joinConf(confSel),
    onLeave: leaveConf,
    onToggleMute: () => callApiDM().toggleMute(),
    onToggleHand: () => callApiDM().toggleHand(),
    onClose: back,
    onParticipants: () => DM_WEB ? setInfoOpen(v => !v) : setPeopleOpen(true),
    reminded: !!reminders[confSel.id],
    onRemind: () => {
      setReminders(r => ({
        ...r,
        [confSel.id]: !r[confSel.id]
      }));
      toast(reminders[confSel.id] ? "Reminder removed" : "We'll remind you");
    },
    toast: toast,
    onHostAgain: () => setHostOpen({
      preset: confSel
    })
  }) : route.name === "thread" && current ? /*#__PURE__*/React.createElement(ThreadViewDM, {
    key: current.id,
    c: current,
    onBack: back,
    onProfile: () => DM_WEB ? setInfoOpen(v => !v) : setRoute({
      name: "profile",
      id: current.id,
      from: route.from
    }),
    onSend: sendMessage,
    onReact: reactMessage,
    onEdit: editMessage,
    onDelete: deleteMessage,
    onPin: pinMessage,
    onMenu: () => setRowActions(current),
    toast: toast,
    searchOpen: threadSearch,
    onCloseSearch: () => setThreadSearch(false),
    onInfo: () => setInfoOpen(v => !v),
    infoOpen: infoOpen
  }) : route.name === "profile" && current ? /*#__PURE__*/React.createElement(ProfileViewDM, {
    c: current,
    onBack: back,
    onToggleMute: () => toggleMute(current),
    onAddMembers: () => setAddMembersFor(current),
    onLeave: () => setConfirm({
      kind: "leave",
      c: current
    }),
    onOpenThreadWith: id => openThreadWith(id),
    toast: toast
  }) : null;
  const listViewFor = (name, t) => {
    if (name === "compose") return /*#__PURE__*/React.createElement(ComposeViewDM, {
      people: allPeople,
      onBack: () => setRoute({
        name: "list"
      }),
      onCreate: createConversation
    });
    if (name === "archived") return /*#__PURE__*/React.createElement(ListViewDM, {
      title: "Archived chats",
      sub: archived.length ? archived.length + " archived" : null,
      onBack: back,
      convs: archived,
      onScroll: onScroll,
      onOpen: c => openThread(c, "archived"),
      onActions: setRowActions,
      emptyIcon: "lucide:archive",
      emptyTitle: "No archived chats",
      emptyBody: "Hold a conversation and choose Archive to tuck it away here."
    });
    if (name === "groups") return /*#__PURE__*/React.createElement(ListViewDM, {
      title: "Group chats",
      sub: counts.groups + " groups",
      onBack: back,
      convs: active.filter(c => c.kind === "group"),
      onScroll: onScroll,
      onOpen: c => openThread(c, "groups"),
      onActions: setRowActions,
      emptyIcon: "lucide:users",
      emptyTitle: "No group chats",
      emptyBody: "Pick two or more people from the compose button to start one."
    });
    if (name === "requests") return /*#__PURE__*/React.createElement(RequestsViewDM, {
      requests: store.requests,
      onBack: back,
      onAccept: acceptRequest,
      onDecline: declineRequest,
      onScroll: onScroll
    });
    if (name === "deleted") return /*#__PURE__*/React.createElement(DeletedViewDM, {
      deleted: store.deleted,
      onBack: back,
      onRestore: restoreConv,
      onScroll: onScroll
    });
    if (t === "people") return /*#__PURE__*/React.createElement(PeopleViewDM, {
      people: allPeople,
      onOpenThreadWith: id => {
        openThreadWith(id);
        setRoute(r => ({
          ...r,
          from: "people"
        }));
      },
      onScroll: onScroll
    });
    if (t === "conference") return /*#__PURE__*/React.createElement(ConferenceViewDM, {
      rooms: rooms,
      call: call,
      selectedId: route.name === "conf" ? route.id : null,
      onOpen: openConf,
      onHost: () => setHostOpen({}),
      onSettings: () => setConfSettingsOpen(true),
      onScroll: onScroll
    });
    if (t === "menu") return /*#__PURE__*/React.createElement(MenuViewDM, {
      counts: counts,
      onNav: k => setRoute({
        name: k
      }),
      onScroll: onScroll,
      onTestPush: () => {
        setTab("chats");
        setRoute({
          name: "list"
        });
        window.setTimeout(firePush, 350);
      }
    });
    return /*#__PURE__*/React.createElement(ChatsViewDM, {
      convs: active,
      archivedCount: archived.length,
      requestsCount: store.requests.length,
      onOpen: c => openThread(c, "list"),
      onOpenPerson: id => openThreadWith(id),
      onActions: setRowActions,
      onCompose: () => setRoute({
        name: "compose"
      }),
      onArchived: () => setRoute({
        name: "archived"
      }),
      onRequests: () => setRoute({
        name: "requests"
      }),
      onScroll: onScroll
    });
  };
  const view = detail || listViewFor(route.name, tab);
  /* desktop: the list column stays put while a thread is open beside it — it
     shows whichever list the thread was opened from */
  const inDetail = route.name === "thread" || route.name === "profile" || route.name === "conf" && !!confSel;
  const showInfo = DM_WEB && infoOpen && (route.name === "thread" && !!current || route.name === "conf" && !!confSel && !confSel.ended);
  const sideView = !inDetail ? view : listViewFor(["archived", "groups", "requests", "deleted"].includes(route.from) ? route.from : "list", route.from === "people" ? "people" : tab);
  const ra = rowActions ? convs.find(c => c.id === rowActions.id) : null;
  const addFor = addMembersFor ? convs.find(c => c.id === addMembersFor.id) : null;
  return /*#__PURE__*/React.createElement(PeopleCtxDM.Provider, {
    value: peopleCtx
  }, /*#__PURE__*/React.createElement(ActiveConvCtxDM.Provider, {
    value: inDetail ? route.id : null
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-screen" + (DM_WEB ? " dm-web" + (detail ? " has-detail" : "") + (showInfo ? " has-info" : "") : showDock ? " has-dock" : "") + (route.name === "conf" && confSel ? " has-stage" : ""),
    "data-screen-label": DM_WEB ? "Messages (web)" : "Messages (mobile)"
  }, !DM_WEB && MobileChromeDM && /*#__PURE__*/React.createElement(MobileChromeDM, null), DM_WEB ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RailDM, {
    tab: tab,
    unread: unreadTotal,
    requests: store.requests.length,
    onTab: goTab
  }), /*#__PURE__*/React.createElement("section", {
    className: "dm-web-side",
    "aria-label": "Conversations"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-main"
  }, sideView)), /*#__PURE__*/React.createElement("section", {
    className: "dm-web-main",
    "aria-label": "Conversation"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-main"
  }, detail || (tab === "conference" ? /*#__PURE__*/React.createElement(ConfEmptyPaneDM, {
    onHost: () => setHostOpen({})
  }) : /*#__PURE__*/React.createElement(EmptyPaneDM, {
    onCompose: () => setRoute({
      name: "compose"
    })
  })))), showInfo && route.name === "conf" && /*#__PURE__*/React.createElement(ConfParticipantsDM, {
    key: confSel.id,
    c: confSel,
    call: call
  }), showInfo && route.name === "thread" && /*#__PURE__*/React.createElement(InfoPanelDM, {
    key: current.id,
    c: current,
    onToggleMute: () => toggleMute(current),
    onSearch: () => setThreadSearch(true),
    onMore: () => setRowActions(current),
    onCustomize: patch => updateConv(current.id, c => ({
      ...c,
      ...patch
    })),
    onOpenThreadWith: id => openThreadWith(id),
    onAddMembers: () => setAddMembersFor(current),
    onLeave: () => setConfirm({
      kind: "leave",
      c: current
    }),
    onDelete: () => setConfirm({
      kind: "delete",
      c: current
    }),
    toast: toast
  })) : /*#__PURE__*/React.createElement("div", {
    className: "dm-main"
  }, view), !DM_WEB && showDock && /*#__PURE__*/React.createElement(DockDM, {
    tab: tab,
    compact: compact,
    unread: unreadTotal,
    onTab: goTab
  }), /*#__PURE__*/React.createElement(SheetDM, {
    open: !!ra,
    onClose: () => setRowActions(null),
    label: route.name === "thread" ? "Conversation settings" : "Conversation options"
  }, ra && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-head"
  }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
    c: ra,
    size: 44,
    dot: false
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-sheet-head-main"
  }, /*#__PURE__*/React.createElement("b", null, convNameDM(ra, peopleCtx)), /*#__PURE__*/React.createElement("span", null, ra.kind === "group" ? ra.memberIds.length + 1 + " members" : presenceDM(peopleCtx.get(ra.personId))))), route.name === "thread" && /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: ra.kind === "group" ? "lucide:users" : "lucide:user",
    label: ra.kind === "group" ? "View members" : "View profile",
    onClick: () => {
      setRowActions(null);
      setRoute({
        name: "profile",
        id: ra.id,
        from: route.from
      });
    }
  }), /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:search",
    label: "Search in conversation",
    disabled: !ra.messages.some(m => !m.deleted && m.text),
    sub: ra.messages.some(m => !m.deleted && m.text) ? "Find a message by keyword" : "Nothing to search yet",
    onClick: () => {
      setRowActions(null);
      if (route.name !== "thread") openThread(ra, ["archived", "groups"].includes(route.name) ? route.name : "list");
      setThreadSearch(true);
    }
  }), /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: ra.pinned ? "lucide:pin-off" : "lucide:pin",
    label: ra.pinned ? "Unpin" : "Pin",
    onClick: () => {
      togglePin(ra);
      setRowActions(null);
    }
  }), /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: ra.archived ? "lucide:archive-restore" : "lucide:archive",
    label: ra.archived ? "Unarchive" : "Archive",
    onClick: () => {
      toggleArchive(ra);
      setRowActions(null);
    }
  }), /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:user-plus",
    label: "Add members",
    sub: ra.kind === "dm" ? "Starts a group with " + stripHonorificDM(convNameDM(ra, peopleCtx)).split(" ")[0] : null,
    onClick: () => {
      setRowActions(null);
      setAddMembersFor(ra);
    }
  }), /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: ra.muted ? "lucide:bell" : "lucide:bell-off",
    label: ra.muted ? "Unmute" : "Mute",
    onClick: () => {
      toggleMute(ra);
      setRowActions(null);
    }
  }), ra.kind === "group" && /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:log-out",
    label: "Leave group",
    danger: true,
    onClick: () => {
      setRowActions(null);
      setConfirm({
        kind: "leave",
        c: ra
      });
    }
  }), /*#__PURE__*/React.createElement(SheetActionDM, {
    icon: "lucide:trash-2",
    label: "Delete",
    danger: true,
    onClick: () => {
      setRowActions(null);
      setConfirm({
        kind: "delete",
        c: ra
      });
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-sheet-cancel",
    onClick: () => setRowActions(null)
  }, "Cancel"))), /*#__PURE__*/React.createElement(AddMembersSheetDM, {
    c: addFor,
    people: allPeople,
    onClose: () => setAddMembersFor(null),
    onAdd: ids => addMembers(addFor, ids)
  }), /*#__PURE__*/React.createElement(SheetDM, {
    open: !!confirm,
    onClose: () => setConfirm(null),
    label: confirm && confirm.kind === "leave" ? "Leave group" : "Delete chat",
    className: "dm-sheet-confirm"
  }, confirm && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: "dm-sheet-title"
  }, confirm.kind === "leave" ? "Leave " + confirm.c.name + "?" : "Delete this chat?"), /*#__PURE__*/React.createElement("p", {
    className: "dm-sheet-body"
  }, confirm.kind === "leave" ? "You'll stop receiving messages from this group. An admin can add you back later." : "It moves to Deleted chats, where you can restore it for 30 days."), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost dm-btn-grow",
    onClick: () => setConfirm(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-danger dm-btn-grow",
    onClick: () => {
      if (confirm.kind === "leave") leaveGroup(confirm.c);else deleteConv(confirm.c);
      setConfirm(null);
    }
  }, confirm.kind === "leave" ? "Leave group" : "Delete")))), /*#__PURE__*/React.createElement(HostRoomSheetDM, {
    open: !!hostOpen,
    preset: hostOpen && hostOpen.preset,
    onClose: () => setHostOpen(null),
    onCreate: createRoom
  }), /*#__PURE__*/React.createElement(ConfSettingsSheetDM, {
    open: confSettingsOpen,
    onClose: () => setConfSettingsOpen(false),
    settings: confSettings,
    onChange: setConfSettings
  }), /*#__PURE__*/React.createElement(SheetDM, {
    open: peopleOpen && !!confSel,
    onClose: () => setPeopleOpen(false),
    label: "Participants",
    className: "dm-sheet-tall dm-vc-peoplesheet"
  }, confSel && /*#__PURE__*/React.createElement(ConfParticipantsDM, {
    c: confSel,
    call: call,
    onClose: () => setPeopleOpen(false)
  })), /*#__PURE__*/React.createElement(ToastDM, {
    toast: toastState
  }), push && /*#__PURE__*/React.createElement(PushBannerDM, {
    key: push.id,
    push: push,
    onClose: () => setPush(null),
    onOpen: () => {
      const c = store.conversations.find(x => x.id === push.convId);
      setPush(null);
      setTab("chats");
      if (c) openThread(c, "list");else openThreadWith(push.from);
    }
  }))));
}
function AddMembersSheetDM({
  c,
  people,
  onClose,
  onAdd
}) {
  const [picked, setPicked] = useStateDM([]);
  const [q, setQ] = useStateDM("");
  useEffectDM(() => {
    setPicked([]);
    setQ("");
  }, [c && c.id]);
  if (!c) return /*#__PURE__*/React.createElement(SheetDM, {
    open: false,
    onClose: onClose
  });
  const existing = c.kind === "group" ? c.memberIds : [c.personId];
  const list = people.filter(p => !p.request && !existing.includes(p.id) && p.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = id => setPicked(all => all.includes(id) ? all.filter(x => x !== id) : all.concat([id]));
  return /*#__PURE__*/React.createElement(SheetDM, {
    open: !!c,
    onClose: onClose,
    label: "Add members",
    title: "Add members",
    className: "dm-sheet-tall"
  }, /*#__PURE__*/React.createElement(SearchDM, {
    value: q,
    onChange: setQ,
    placeholder: "Search people"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-list"
  }, list.map(p => /*#__PURE__*/React.createElement(PersonTickRowDM, {
    key: p.id,
    p: p,
    on: picked.includes(p.id),
    onToggle: toggle
  })), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement("b", null, "Everyone you follow is already here"))), /*#__PURE__*/React.createElement("div", {
    className: "dm-sheet-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-ghost dm-btn-grow",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-btn dm-btn-navy dm-btn-grow",
    disabled: !picked.length,
    onClick: () => onAdd(picked)
  }, "Add", picked.length ? " (" + picked.length + ")" : "")));
}
function MessagesPageDM() {
  const mobile = useIsMobileDM();
  const scale = useDeviceScaleDM();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (DM_WEB) {
    /* Desktop: DS TopNav, then the messenger as a full-height three-column card */
    return /*#__PURE__*/React.createElement("div", {
      className: "app dm-web-app",
      style: vars
    }, /*#__PURE__*/React.createElement(DSDM.TopNav, {
      active: "Messages",
      user: {
        name: ME_DM.name,
        role: ME_DM.role,
        avatar: ME_DM.avatar
      },
      logoSrc: "assets/profinity-icon-purple-gold.png",
      onNavigate: navigateWebDM,
      style: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-default)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "dm-web-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dm-web-card"
    }, /*#__PURE__*/React.createElement(MessagesAppDM, null))));
  }
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app dm-app",
    style: vars
  }, /*#__PURE__*/React.createElement(MessagesAppDM, null));
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage dm-app",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "scale(" + scale + ")",
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(MessagesAppDM, null))));
}

/* ---------------------------------------------------------------------------
   Header chrome for every other desktop page. web-messages-chrome.js loads
   this bundle lazily with PF_DM_NO_MOUNT + PF_DM_WEB and calls
   PFMessagesDM.mountChrome(): the TopNav chat button's "Chats" dropdown and
   Messenger-style floating chat popups, on the same store as the page.
   --------------------------------------------------------------------------- */
const DROP_TABS_DM = [{
  key: "all",
  label: "All"
}, {
  key: "unread",
  label: "Unread"
}, {
  key: "groups",
  label: "Groups"
}];
function DropRowDM({
  c,
  onOpen
}) {
  const people = usePeopleDM();
  const last = lastMsgDM(c);
  const name = convNameDM(c, people);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-dd-row" + (c.unread ? " unread" : ""),
    onClick: () => onOpen(c),
    "aria-label": "Open chat with " + name + (c.unread ? ", " + c.unread + " unread" : "")
  }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
    c: c,
    size: 52
  }), /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-name"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-sub"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-preview"
  }, previewDM(c, people)), last && /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-time"
  }, " · ", fmtListTimeDM(last.ts)))), c.muted ? /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:bell-off",
    size: 16,
    color: "var(--gray-400)"
  }) : c.unread > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-dot",
    "aria-hidden": "true"
  }) : null);
}
function ChatsDropdownDM({
  store,
  onOpen,
  onClose,
  onMarkAllRead
}) {
  const people = usePeopleDM();
  const [tab, setTab] = useStateDM("all");
  const [q, setQ] = useStateDM("");
  const [menu, setMenu] = useStateDM(false);
  const ref = useRefDM(null);
  useEffectDM(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target) && !(e.target.closest && e.target.closest("#pf-msg-btn"))) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, []);
  const active = store.conversations.filter(c => !c.archived);
  const list = sortConvsDM(active.filter(c => (tab !== "unread" || c.unread) && (tab !== "groups" || c.kind === "group") && (!q || convNameDM(c, people).toLowerCase().includes(q.toLowerCase()))));
  const reqs = store.requests;
  const reqNames = reqs.map(r => stripHonorificDM((people.get(r.personId) || {}).name || "Someone").split(" ")[0]);
  const counts = {
    all: active.length,
    unread: active.filter(c => c.unread > 0).length,
    groups: active.filter(c => c.kind === "group").length
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-dd",
    role: "dialog",
    "aria-label": "Chats",
    ref: ref
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-dd-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Chats"), /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-tools"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-menuwrap"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "More options",
    "aria-haspopup": "menu",
    "aria-expanded": menu,
    onClick: () => setMenu(v => !v)
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 20,
    color: "var(--text-heading)"
  })), menu && /*#__PURE__*/React.createElement("div", {
    className: "dm-dd-menu",
    role: "menu"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "menuitem",
    onClick: () => {
      onMarkAllRead();
      setMenu(false);
    }
  }, "Mark all as read"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "menuitem",
    onClick: () => goDM("MessagesWeb.html?view=archived")
  }, "Archived chats"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "menuitem",
    onClick: () => goDM("MessagesWeb.html?view=requests")
  }, "Message requests"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "menuitem",
    onClick: () => goDM("NotificationSettingsWeb.html")
  }, "Message settings"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "See all in Messages",
    onClick: () => goDM("MessagesWeb.html")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:maximize-2",
    size: 18,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-iconbtn sm",
    "aria-label": "New message",
    onClick: () => goDM("MessagesWeb.html?compose=1")
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:square-pen",
    size: 19,
    color: "var(--text-heading)"
  })))), /*#__PURE__*/React.createElement(SearchDM, {
    value: q,
    onChange: setQ,
    placeholder: "Search Messages"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dm-dd-tabs",
    role: "tablist",
    "aria-label": "Filter chats"
  }, DROP_TABS_DM.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    role: "tab",
    "aria-selected": tab === t.key,
    className: "dm-dd-tab" + (tab === t.key ? " on" : ""),
    onClick: () => setTab(t.key)
  }, t.label, t.key !== "all" && counts[t.key] > 0 && /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-tab-n"
  }, counts[t.key])))), /*#__PURE__*/React.createElement("div", {
    className: "dm-dd-list"
  }, reqs.length > 0 && !q && tab === "all" && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dm-dd-row dm-dd-req",
    onClick: () => goDM("MessagesWeb.html?view=requests")
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-reqic"
  }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:mail-plus",
    size: 22,
    color: "var(--text-heading)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-name"
  }, "New message requests"), /*#__PURE__*/React.createElement("span", {
    className: "dm-dd-sub"
  }, /*#__PURE__*/React.createElement("b", null, "From ", reqNames[0], reqNames.length > 1 ? " and " + (reqNames.length - 1) + " more" : ""))), /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-500)"
  })), list.map(c => /*#__PURE__*/React.createElement(DropRowDM, {
    key: c.id,
    c: c,
    onOpen: onOpen
  })), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-empty"
  }, /*#__PURE__*/React.createElement("b", null, q ? "No conversations match" : tab === "unread" ? "You're all caught up" : "No group chats yet"))), /*#__PURE__*/React.createElement("a", {
    className: "dm-dd-foot",
    href: "MessagesWeb.html",
    onClick: e => {
      e.preventDefault();
      goDM("MessagesWeb.html");
    }
  }, "See all in Messages"));
}
function ChatPopupDM({
  c,
  index,
  actions,
  toast,
  onMinimize,
  onClose
}) {
  const people = usePeopleDM();
  const name = convNameDM(c, people);
  const expand = () => goDM("MessagesWeb.html?t=" + c.id);
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-popup",
    style: {
      right: 88 + index * 344
    },
    role: "dialog",
    "aria-label": "Chat with " + name
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-screen dm-web dm-popup-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dm-main"
  }, /*#__PURE__*/React.createElement(ThreadViewDM, {
    key: c.id,
    c: c,
    popup: true,
    onBack: onClose,
    onProfile: expand,
    onMenu: expand,
    onSend: actions.sendMessage,
    onReact: actions.reactMessage,
    onEdit: actions.editMessage,
    onDelete: actions.deleteMessage,
    onPin: actions.pinMessage,
    toast: toast,
    searchOpen: false,
    onMinimize: onMinimize,
    onClose: onClose
  }))));
}
function MessagesChromeDM({
  api,
  initialOpen
}) {
  const [store, setStore] = useStateDM(loadStoreDM);
  const [open, setOpen] = useStateDM(!!initialOpen);
  const [popups, setPopups] = useStateDM([]); // [{ id, min }], newest first, max 3
  const [toastState, setToastState] = useStateDM(null);
  const toastTimer = useRefDM(null);
  const actions = useStoreActionsDM(setStore);
  useEffectDM(() => saveStoreDM(store), [store]);
  useEffectDM(() => {
    const onStorage = e => {
      if (!e.key || e.key === STORE_KEY_DM) setStore(loadStoreDM());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);
  const allPeople = useMemoDM(() => {
    const map = new Map();
    PEOPLE_SEED_DM.concat(store.people).forEach(p => map.set(p.id, map.has(p.id) ? {
      ...map.get(p.id),
      ...p
    } : p));
    return Array.from(map.values());
  }, [store.people]);
  const peopleCtx = useMemoDM(() => {
    const map = {};
    allPeople.forEach(p => {
      map[p.id] = p;
    });
    map.me = ME_DM;
    return {
      get: id => map[id] || null,
      all: allPeople
    };
  }, [allPeople]);
  const toast = useCallbackDM(text => {
    setToastState({
      text,
      id: Date.now()
    });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastState(null), 1900);
  }, []);
  const openPopup = useCallbackDM(c => {
    actions.markRead(c.id);
    setPopups(all => [{
      id: c.id,
      min: false
    }].concat(all.filter(p => p.id !== c.id)).slice(0, 3));
    setOpen(false);
  }, [actions]);
  useEffectDM(() => {
    api.current = {
      toggle: () => setOpen(v => !v),
      open: () => setOpen(true),
      close: () => setOpen(false),
      openThread: id => {
        const c = store.conversations.find(x => x.id === id);
        if (c) openPopup(c);
      }
    };
  });
  const setMin = (id, min) => setPopups(all => all.map(p => p.id === id ? {
    ...p,
    min
  } : p));
  const closePopup = id => setPopups(all => all.filter(p => p.id !== id));
  const markAllRead = () => {
    setStore(s => ({
      ...s,
      conversations: s.conversations.map(c => c.unread ? {
        ...c,
        unread: 0
      } : c)
    }));
    toast("All caught up");
  };
  const shown = popups.filter(p => !p.min),
    mins = popups.filter(p => p.min);
  const convOf = id => store.conversations.find(x => x.id === id);
  return /*#__PURE__*/React.createElement(PeopleCtxDM.Provider, {
    value: peopleCtx
  }, open && /*#__PURE__*/React.createElement(ChatsDropdownDM, {
    store: store,
    onOpen: openPopup,
    onClose: () => setOpen(false),
    onMarkAllRead: markAllRead
  }), shown.map((p, i) => {
    const c = convOf(p.id);
    return c ? /*#__PURE__*/React.createElement(ChatPopupDM, {
      key: p.id,
      c: c,
      index: i,
      actions: actions,
      toast: toast,
      onMinimize: () => setMin(p.id, true),
      onClose: () => closePopup(p.id)
    }) : null;
  }), mins.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "dm-popup-mins",
    "aria-label": "Minimised chats"
  }, mins.map(p => {
    const c = convOf(p.id);
    if (!c) return null;
    return /*#__PURE__*/React.createElement("span", {
      key: p.id,
      className: "dm-popup-min"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-popup-min-btn",
      "aria-label": "Open chat with " + convNameDM(c, peopleCtx),
      onClick: () => setMin(p.id, false)
    }, /*#__PURE__*/React.createElement(ConvAvatarDM, {
      c: c,
      size: 48,
      dot: false
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "dm-popup-min-x",
      "aria-label": "Close chat",
      onClick: () => closePopup(p.id)
    }, /*#__PURE__*/React.createElement(DSDM.IconifyIcon, {
      name: "lucide:x",
      size: 12,
      color: "#fff"
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-screen dm-web dm-chrome-toast",
    "aria-hidden": !toastState
  }, /*#__PURE__*/React.createElement(ToastDM, {
    toast: toastState
  })));
}
function mountChromeDM(el, opts) {
  const api = {
    current: null
  };
  ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(MessagesChromeDM, {
    api: api,
    initialOpen: !!(opts && opts.open)
  }));
  const call = k => arg => {
    if (api.current) api.current[k](arg);
  };
  return {
    toggle: call("toggle"),
    open: call("open"),
    close: call("close"),
    openThread: call("openThread")
  };
}
window.PFMessagesDM = {
  mountChrome: mountChromeDM,
  load: loadStoreDM,
  save: saveStoreDM,
  STORE_KEY: STORE_KEY_DM,
  SEED_VERSION: SEED_VERSION_DM
};
if (!window.PF_DM_NO_MOUNT) ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MessagesPageDM, null));
