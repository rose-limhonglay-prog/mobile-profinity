/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · User Directory & Diagnostics
   (Screen 5). Diagnostic view for a selected clinician: account balances,
   streak status (freeze / restore), badge progress & entitlements, and
   recent ledger activity. Katy Moore is the live-simulated profile in this
   prototype; the other 119 directory rows are a deterministic seeded mock
   directory (search / filter / sort / 12-per-page pagination) whose edits
   live in React state for the session only.
   Classes prefixed diag- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateDIAG,
  useMemo: useMemoDIAG,
  useEffect: useEffectDIAG
} = React;
const PF_DIAG = window.PFLoyalty;
function goDIAG(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const ADL_NAV_TOP = [{
  icon: "lucide:layout-grid",
  label: "Dashboard",
  href: "AdminDashboard.html"
}, {
  icon: "lucide:user",
  label: "Users",
  href: "AdminUsers.html"
}, {
  icon: "lucide:file-text",
  label: "Posts Management",
  href: "AdminPostsManagement.html"
}, {
  icon: "lucide:layout-dashboard",
  label: "Content Moderation",
  href: "AdminModeration.html"
}, {
  icon: "lucide:life-buoy",
  label: "Service Requests",
  href: "AdminServiceRequests.html"
}, {
  icon: "lucide:shield-check",
  label: "Verification",
  href: "AdminVerification.html"
}, {
  icon: "lucide:users-round",
  label: "Agents",
  href: "AdminAgents.html"
}, {
  icon: "lucide:calendar",
  label: "Events",
  href: "AdminEvents.html"
}, {
  icon: "lucide:map",
  label: "Product Mapping",
  href: "AdminProductMapping.html"
}, {
  icon: "lucide:bar-chart-3",
  label: "Analytics",
  href: "AdminAnalytics.html"
}, {
  icon: "lucide:smartphone",
  label: "App Versions",
  href: "AdminAppVersions.html"
}, {
  icon: "lucide:bell",
  label: "Push Notification",
  href: "AdminPushNotifications.html"
}, {
  icon: "lucide:badge-check",
  label: "Badges",
  href: "AdminBadges.html"
}, {
  icon: "lucide:clipboard-list",
  label: "Quizzes & Surveys",
  href: "AdminQuizEditor.html"
}, {
  icon: "lucide:receipt-text",
  label: "Transactions",
  href: "AdminTransactions.html",
  chevron: true
}, {
  icon: "lucide:table-2",
  label: "Courses",
  href: "AdminCourses.html",
  chevron: true
}, {
  icon: "lucide:users",
  label: "Community",
  href: "AdminCommunity.html",
  chevron: true
}];
const ADL_LOYALTY_SUBNAV = [{
  key: "actions",
  label: "Ways to Earn",
  href: "AdminActionsEditor.html"
}, {
  key: "tiers",
  label: "Tier Multipliers",
  href: "AdminTierMultipliers.html"
}, {
  key: "rewards",
  label: "Reward Editor",
  href: "AdminRewardEditor.html"
}, {
  key: "ledger",
  label: "Points Ledger",
  href: "AdminAuditLedger.html"
}, {
  key: "users",
  label: "User Diagnostics",
  href: "AdminUserDiagnostics.html"
}, {
  key: "overview",
  label: "System Overview",
  href: "AdminLoyaltyOverview.html"
}];
function AdlSidebar({
  activeLoyaltyKey
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "adl-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  })), ADL_NAV_TOP.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "adl-navitem",
    type: "button",
    onClick: () => goDIAG(item.href)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "adl-spacer"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down",
    class: "adl-chev"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-navgroup-label"
  }, "Loyalty & Gamification"), /*#__PURE__*/React.createElement("button", {
    className: "adl-navitem" + (activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goDIAG("AdminActionsEditor.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), /*#__PURE__*/React.createElement("span", null, "Loyalty & Gamification")), /*#__PURE__*/React.createElement("div", {
    className: "adl-subnav"
  }, ADL_LOYALTY_SUBNAV.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goDIAG(s.href)
  }, /*#__PURE__*/React.createElement("span", null, s.label)))));
}
function AdlHeader({
  title,
  search,
  onSearch
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "adl-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "adl-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search members by name, email or clinic...",
    value: search || "",
    onChange: e => onSearch && onSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "adl-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "adl-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "adl-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "adl-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ------------------------------------------------------------- helpers */
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  });
}
function fmtDateLong(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function fmtAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return h + "h ago";
  const d = Math.floor(h / 24);
  if (d < 30) return d + "d ago";
  const m = Math.floor(d / 30);
  return m < 12 ? m + "mo ago" : Math.floor(m / 12) + "y ago";
}
function initialsOf(name) {
  return name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const DIAG_TIERS = ["Basic", "Confidence", "Mastery", "Freedom"];
const DIAG_STATUSES = ["Active", "At risk", "Frozen", "Dormant"];
const DIAG_AVATAR_HUES = ["#1f1a4d", "#6c63ff", "#0f766e", "#b45309", "#9d174d", "#1d4ed8", "#4d7c0f", "#7c2d12"];

/* ---------------------------------------------------- seeded directory */
const DIAG_FIRST = ["Amelia", "Oliver", "Isla", "George", "Ava", "Noah", "Freya", "Leo", "Grace", "Arthur", "Poppy", "Oscar", "Ella", "Harry", "Chloe", "Jack", "Mia", "Charlie", "Evie", "Jacob", "Lily", "Alfie", "Zara", "Theo", "Rosie", "Finley", "Hana", "Reuben", "Nadia", "Elliot", "Imogen", "Kai", "Yasmin", "Rory", "Tara", "Idris", "Maya", "Jonah", "Sienna", "Aaron", "Layla", "Callum", "Nia", "Ezra", "Aisha", "Hugo", "Esme", "Louis", "Rhea", "Sam"];
const DIAG_LAST = ["Bennett", "Osei", "Reid", "Hussain", "Walsh", "Okafor", "Patel", "Murray", "Fletcher", "Kaur", "Doyle", "Ahmed", "Grant", "Nakamura", "Byrne", "Novak", "Whitfield", "Chen", "Moreno", "Holt", "Adebayo", "Lindqvist", "Brennan", "Sato", "Ferreira", "Quinn", "Iqbal", "Dawson", "Rahman", "Kowalski", "Mensah", "Barlow", "Sharma", "Hart", "Oduya", "Marsh", "Costa", "Gill", "Blake", "Rossi"];
const DIAG_CLINICS = ["Lumière Aesthetics", "Glow Clinic", "Skin Atelier", "The Facial Room", "Halo Skin Studio", "Bloom Aesthetics", "Pure Derm", "Radiance Clinic", "Northside Skin", "Velvet Aesthetics", "The Skin Lab", "Serene Clinic", "Aura Medical", "Rejuva Clinic", "Bare Skin Studio", "Ember Aesthetics", "Harbour Skin Clinic", "Meridian Derm", "Elysian Aesthetics", "Clear Skin Co"];
const DIAG_TOWNS = ["Manchester", "Leeds", "Bristol", "Glasgow", "Birmingham", "Cardiff", "Edinburgh", "Liverpool", "Nottingham", "Brighton", "Sheffield", "Newcastle", "Oxford", "Belfast", "Bath", "Norwich", "Exeter", "Chester", "York", "Reading"];
const DIAG_PHOTO_MEMBERS = [{
  name: "Miranda Pearce",
  email: "miranda.pearce@gmail.com",
  clinic: "Dr Tim Pearce Clinic",
  town: "Manchester",
  membershipTier: "Mastery",
  avatar: "assets/avatar-miranda.jpg"
}, {
  name: "Amir Khan",
  email: "amir.khan@gmail.com",
  clinic: "Khan Aesthetics",
  town: "Leeds",
  membershipTier: "Confidence",
  avatar: "assets/avatar-amir-khan.jpg"
}, {
  name: "Priya Shah",
  email: "priya.shah@gmail.com",
  clinic: "Shah Skin Clinic",
  town: "London",
  membershipTier: "Freedom",
  avatar: "assets/avatar-priya-shah.jpg"
}, {
  name: "Mark Ellis",
  email: "mark.ellis@gmail.com",
  clinic: "Ellis Medical",
  town: "Bristol",
  membershipTier: "Basic",
  avatar: "assets/avatar-mark-ellis.jpg"
}, {
  name: "Sarah Collins",
  email: "sarah.collins@gmail.com",
  clinic: "Collins Aesthetics",
  town: "Glasgow",
  membershipTier: "Mastery",
  avatar: "assets/avatar-sarah-collins.jpg"
}, {
  name: "Beth Turner",
  email: "beth.turner@gmail.com",
  clinic: "Turner Skin Studio",
  town: "Cardiff",
  membershipTier: "Confidence",
  avatar: "assets/avatar-nurse-beth.jpg"
}, {
  name: "Katy Nguyen",
  email: "katy.nguyen@gmail.com",
  clinic: "Nguyen Derm",
  town: "Brighton",
  membershipTier: "Freedom",
  avatar: "assets/avatar-katy.jpg"
}];
function diagFillProfile(base, rnd) {
  const tier = base.membershipTier;
  const range = {
    Basic: [120, 1800],
    Confidence: [1500, 9000],
    Mastery: [8000, 26000],
    Freedom: [18000, 62000]
  }[tier] || [100, 2000];
  const lifetimePoints = base.lifetimePoints != null ? base.lifetimePoints : Math.round(range[0] + rnd() * (range[1] - range[0]));
  const spendableCredits = base.spendableCredits != null ? base.spendableCredits : Math.round(lifetimePoints * (0.12 + rnd() * 0.18));
  const expiringCredits = base.expiringCredits != null ? base.expiringCredits : rnd() < 0.55 ? Math.round(spendableCredits * rnd() * 0.3) : 0;
  const r = rnd();
  const status = base.status || (r < 0.68 ? "Active" : r < 0.82 ? "At risk" : r < 0.88 ? "Frozen" : "Dormant");
  const streakLongest = base.streakLongest != null ? base.streakLongest : Math.round(3 + rnd() * (tier === "Basic" ? 20 : tier === "Confidence" ? 45 : 90));
  let streakCurrent = base.streakCurrent != null ? base.streakCurrent : Math.round(rnd() * streakLongest);
  if (status === "Dormant") streakCurrent = 0;
  if (status === "At risk" && streakCurrent < 1) streakCurrent = 1 + Math.round(rnd() * 5);
  const joinedDaysAgo = Math.round(30 + rnd() * 900);
  const lastDays = status === "Dormant" ? 35 + rnd() * 120 : status === "At risk" ? 1.1 + rnd() * 0.8 : rnd() * 0.9;
  const unlocked = [];
  if (lifetimePoints > 300) unlocked.push("first_blood");
  if (streakLongest >= 30) unlocked.push("streak_master");
  if (tier !== "Basic" && rnd() < 0.5) unlocked.push("high_roller");
  if (tier === "Freedom" || tier === "Mastery" && rnd() < 0.4) unlocked.push("community_pillar");
  if (rnd() < 0.25) unlocked.push("master_reviewer");
  return Object.assign({}, base, {
    id: base.id || "u_" + hashStr(base.email).toString(36),
    lifetimePoints,
    spendableCredits,
    expiringCredits,
    status,
    streakCurrent,
    streakLongest,
    unlocked,
    joined: new Date(Date.now() - joinedDaysAgo * 86400000).toISOString(),
    lastActive: new Date(Date.now() - lastDays * 86400000).toISOString(),
    live: false
  });
}
function buildDiagDirectory() {
  const rnd = mulberry32(20260922);
  const out = [];
  const seen = new Set();
  PF_DIAG.MOCK_DIRECTORY.forEach((u, i) => {
    seen.add(u.email);
    out.push(diagFillProfile(Object.assign({
      clinic: DIAG_CLINICS[i % DIAG_CLINICS.length],
      town: DIAG_TOWNS[i * 3 % DIAG_TOWNS.length],
      avatar: null
    }, u), rnd));
  });
  DIAG_PHOTO_MEMBERS.forEach(u => {
    seen.add(u.email);
    out.push(diagFillProfile(u, rnd));
  });
  let guard = 0;
  while (out.length < 119 && guard++ < 2000) {
    const first = DIAG_FIRST[Math.floor(rnd() * DIAG_FIRST.length)];
    const last = DIAG_LAST[Math.floor(rnd() * DIAG_LAST.length)];
    const ci = Math.floor(rnd() * DIAG_CLINICS.length);
    const clinic = DIAG_CLINICS[ci];
    const domain = clinic.toLowerCase().replace(/[^a-z]/g, "") + (rnd() < 0.5 ? ".co.uk" : ".com");
    const email = (first + "." + last).toLowerCase() + "@" + domain;
    if (seen.has(email)) continue;
    seen.add(email);
    const t = rnd();
    const membershipTier = t < 0.36 ? "Basic" : t < 0.7 ? "Confidence" : t < 0.92 ? "Mastery" : "Freedom";
    out.push(diagFillProfile({
      name: first + " " + last,
      email,
      clinic,
      town: DIAG_TOWNS[Math.floor(rnd() * DIAG_TOWNS.length)],
      membershipTier,
      avatar: null
    }, rnd));
  }
  return out;
}
const DIAG_DIRECTORY = buildDiagDirectory();
function liveProfile() {
  const st = PF_DIAG.getState();
  const s = st.streak || {};
  const frozen = s.frozen && s.frozenUntil && new Date(s.frozenUntil) > new Date();
  const status = frozen ? "Frozen" : s.riskDeadline ? "At risk" : "Active";
  return {
    id: "u_katy",
    name: st.user.name + " Moore",
    email: st.user.email,
    clinic: "Luma Aesthetics",
    town: "London",
    membershipTier: st.user.membershipTier,
    avatar: "assets/avatar-katy.jpg",
    live: true,
    status,
    lifetimePoints: st.lifetimePoints,
    spendableCredits: st.spendableCredits,
    expiringCredits: st.expiringCredits || 0,
    streakCurrent: s.current || 0,
    streakLongest: s.longest || 0,
    frozenUntil: s.frozenUntil || null,
    unlocked: st.unlockedAchievements || [],
    joined: new Date(Date.now() - 412 * 86400000).toISOString(),
    lastActive: s.lastCheckIn || new Date().toISOString(),
    ledger: (st.ledger || []).slice().sort((a, b) => new Date(b.ts) - new Date(a.ts))
  };
}
function mockLedger(p, cfg) {
  const rnd = mulberry32(hashStr(p.email));
  const acts = (cfg.actions || []).filter(a => a.active);
  if (!acts.length) return [];
  const mult = (cfg.tierMultipliers || {})[p.membershipTier] || 1;
  const n = p.status === "Dormant" ? 4 : 9;
  let cursor = new Date(p.lastActive).getTime();
  return Array.from({
    length: n
  }, (_, i) => {
    const a = acts[Math.floor(rnd() * acts.length)];
    const pts = Math.round(a.basePoints * mult);
    const ts = new Date(cursor).toISOString();
    cursor -= (0.4 + rnd() * 1.6) * 86400000;
    return {
      id: p.id + "_l" + i,
      ts,
      label: a.label,
      pointsDelta: pts,
      creditsDelta: Math.round(pts / 10)
    };
  });
}

/* --------------------------------------------------------- small parts */
function DiagAvatar({
  profile,
  size
}) {
  const px = size || 40;
  if (profile.avatar) return /*#__PURE__*/React.createElement("img", {
    className: "diag-avatar",
    src: profile.avatar,
    alt: "",
    style: {
      width: px,
      height: px
    }
  });
  const hue = DIAG_AVATAR_HUES[hashStr(profile.email) % DIAG_AVATAR_HUES.length];
  return /*#__PURE__*/React.createElement("span", {
    className: "diag-avatar diag-avatar-initials",
    style: {
      width: px,
      height: px,
      fontSize: Math.round(px * 0.34),
      background: hue
    }
  }, initialsOf(profile.name));
}
function DiagTierPill({
  tier,
  size
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "diag-tier diag-tier-" + tier.toLowerCase() + (size === "lg" ? " is-lg" : "")
  }, tier);
}
function DiagStatusPill({
  status
}) {
  const icon = {
    Active: "lucide:check",
    "At risk": "lucide:alert-triangle",
    Frozen: "lucide:snowflake",
    Dormant: "lucide:moon"
  }[status] || "lucide:circle";
  return /*#__PURE__*/React.createElement("span", {
    className: "diag-status diag-status-" + status.toLowerCase().replace(/\s+/g, "-")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: icon
  }), status);
}
function DiagPager({
  page,
  pages,
  from,
  to,
  total,
  onPage
}) {
  const items = [];
  const push = v => items.push(v);
  if (pages <= 7) {
    for (let i = 1; i <= pages; i++) push(i);
  } else {
    push(1);
    if (page > 3) push("…a");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) push(i);
    if (page < pages - 2) push("…b");
    push(pages);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-pager"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-pager-info"
  }, total === 0 ? "No members" : from + "–" + to + " of " + total), /*#__PURE__*/React.createElement("div", {
    className: "diag-pager-btns"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "diag-pager-btn",
    disabled: page <= 1,
    onClick: () => onPage(page - 1),
    "aria-label": "Previous page"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-left"
  })), items.map(it => typeof it === "number" ? /*#__PURE__*/React.createElement("button", {
    key: it,
    type: "button",
    className: "diag-pager-num" + (it === page ? " is-active" : ""),
    onClick: () => onPage(it)
  }, it) : /*#__PURE__*/React.createElement("span", {
    key: it,
    className: "diag-pager-ellipsis"
  }, "…")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "diag-pager-btn",
    disabled: page >= pages,
    onClick: () => onPage(page + 1),
    "aria-label": "Next page"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  }))));
}
const DIAG_PAGE_SIZE = 12;
const DIAG_SORTS = [{
  key: "name",
  label: "A–Z"
}, {
  key: "points",
  label: "Points"
}, {
  key: "streak",
  label: "Streak"
}, {
  key: "recent",
  label: "Recent"
}];
function DiagDirectory({
  profiles,
  selectedId,
  onSelect,
  search,
  setSearch
}) {
  const [tier, setTier] = useStateDIAG("all");
  const [status, setStatus] = useStateDIAG("all");
  const [sort, setSort] = useStateDIAG("name");
  const [page, setPage] = useStateDIAG(1);
  const filtered = useMemoDIAG(() => {
    const q = search.trim().toLowerCase();
    let list = profiles.filter(p => (tier === "all" || p.membershipTier === tier) && (status === "all" || p.status === status) && (!q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || (p.clinic || "").toLowerCase().includes(q) || (p.town || "").toLowerCase().includes(q)));
    list = list.slice().sort((a, b) => {
      if (a.live !== b.live) return a.live ? -1 : 1;
      if (sort === "points") return b.lifetimePoints - a.lifetimePoints;
      if (sort === "streak") return b.streakCurrent - a.streakCurrent;
      if (sort === "recent") return new Date(b.lastActive) - new Date(a.lastActive);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [profiles, search, tier, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / DIAG_PAGE_SIZE));
  const safePage = Math.min(page, pages);
  useEffectDIAG(() => {
    setPage(1);
  }, [search, tier, status, sort]);
  const start = (safePage - 1) * DIAG_PAGE_SIZE;
  const rows = filtered.slice(start, start + DIAG_PAGE_SIZE);
  const counts = useMemoDIAG(() => DIAG_STATUSES.reduce((m, s) => {
    m[s] = profiles.filter(p => p.status === s).length;
    return m;
  }, {}), [profiles]);
  const hasFilter = search.trim() || tier !== "all" || status !== "all";
  return /*#__PURE__*/React.createElement("aside", {
    className: "diag-dir"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-dir-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "diag-dir-title"
  }, "Members"), /*#__PURE__*/React.createElement("div", {
    className: "diag-dir-sub"
  }, profiles.length.toLocaleString("en-GB"), " clinicians · ", counts["At risk"], " at risk · ", counts.Frozen, " frozen")), hasFilter && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "diag-link-btn",
    onClick: () => {
      setSearch("");
      setTier("all");
      setStatus("all");
    }
  }, "Clear")), /*#__PURE__*/React.createElement("div", {
    className: "diag-dir-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search name, email or clinic",
    value: search,
    onChange: e => setSearch(e.target.value)
  }), search && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "diag-dir-search-clear",
    "aria-label": "Clear search",
    onClick: () => setSearch("")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "diag-dir-filters"
  }, /*#__PURE__*/React.createElement("label", {
    className: "diag-select"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:crown"
  }), /*#__PURE__*/React.createElement("select", {
    value: tier,
    onChange: e => setTier(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Tier"), DIAG_TIERS.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("label", {
    className: "diag-select"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:activity"
  }), /*#__PURE__*/React.createElement("select", {
    value: status,
    onChange: e => setStatus(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Status"), DIAG_STATUSES.map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s
  }, s)))), /*#__PURE__*/React.createElement("label", {
    className: "diag-select"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-up-down"
  }), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value)
  }, DIAG_SORTS.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.key,
    value: s.key
  }, s.label))))), /*#__PURE__*/React.createElement("div", {
    className: "diag-dir-list"
  }, rows.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    type: "button",
    className: "diag-dir-row" + (p.id === selectedId ? " is-active" : ""),
    onClick: () => onSelect(p.id)
  }, /*#__PURE__*/React.createElement(DiagAvatar, {
    profile: p,
    size: 40
  }), /*#__PURE__*/React.createElement("span", {
    className: "diag-dir-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-dir-name"
  }, p.name, p.live && /*#__PURE__*/React.createElement("span", {
    className: "diag-live"
  }, "live")), /*#__PURE__*/React.createElement("span", {
    className: "diag-dir-email"
  }, p.email)), /*#__PURE__*/React.createElement("span", {
    className: "diag-dir-side"
  }, /*#__PURE__*/React.createElement(DiagTierPill, {
    tier: p.membershipTier
  }), /*#__PURE__*/React.createElement("span", {
    className: "diag-dir-pts"
  }, PF_DIAG.formatNumber(p.lifetimePoints), " pts")))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "diag-dir-empty"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:user-search"
  }), /*#__PURE__*/React.createElement("b", null, "No members match"), /*#__PURE__*/React.createElement("span", null, "Try a different name, email or clear the filters."))), /*#__PURE__*/React.createElement(DiagPager, {
    page: safePage,
    pages: pages,
    from: filtered.length ? start + 1 : 0,
    to: Math.min(start + DIAG_PAGE_SIZE, filtered.length),
    total: filtered.length,
    onPage: setPage
  }));
}
function DiagQuickAdjust({
  open,
  onClose,
  onSubmit
}) {
  const [type, setType] = useStateDIAG("add_points");
  const [amount, setAmount] = useStateDIAG("");
  const [reason, setReason] = useStateDIAG("");
  const [error, setError] = useStateDIAG(null);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-adjust"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-adjust-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:sliders-horizontal"
  }), "Manual adjustment ", /*#__PURE__*/React.createElement("span", null, "logged to the Points Ledger with your admin ID")), /*#__PURE__*/React.createElement("div", {
    className: "diag-adjust-form"
  }, /*#__PURE__*/React.createElement("select", {
    value: type,
    onChange: e => setType(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "add_points"
  }, "Add points"), /*#__PURE__*/React.createElement("option", {
    value: "deduct_points"
  }, "Deduct points"), /*#__PURE__*/React.createElement("option", {
    value: "add_credits"
  }, "Add credits"), /*#__PURE__*/React.createElement("option", {
    value: "deduct_credits"
  }, "Deduct credits")), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    placeholder: "Amount",
    value: amount,
    onChange: e => setAmount(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Reason (required for audit)",
    value: reason,
    onChange: e => setReason(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy adl-btn-sm",
    type: "button",
    onClick: () => {
      const res = onSubmit({
        type,
        amount,
        reason
      });
      if (res && !res.ok) {
        setError(res.reason);
        return;
      }
      setError(null);
      setAmount("");
      setReason("");
      onClose();
    }
  }, "Apply"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: onClose
  }, "Cancel")), error && /*#__PURE__*/React.createElement("div", {
    className: "diag-adjust-error"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:alert-circle"
  }), error));
}
function DiagStat({
  icon,
  label,
  value,
  sub,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-stat" + (tone ? " is-" + tone : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-stat-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-stat-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "diag-stat-label"
  }, label)), /*#__PURE__*/React.createElement("span", {
    className: "diag-stat-value"
  }, value), sub && /*#__PURE__*/React.createElement("span", {
    className: "diag-stat-sub"
  }, sub));
}

/* ---------------------------------------------------------- main view */
function UserDiagnosticsView({
  search,
  setSearch
}) {
  const [config] = useStateDIAG(() => PF_DIAG.getConfig());
  const [tick, setTick] = useStateDIAG(0);
  const [edits, setEdits] = useStateDIAG({});
  const [selectedId, setSelectedId] = useStateDIAG("u_katy");
  const [adjustOpen, setAdjustOpen] = useStateDIAG(false);
  const [toast, setToast] = useStateDIAG(null);
  const live = useMemoDIAG(() => liveProfile(), [tick]);
  const profiles = useMemoDIAG(() => [live].concat(DIAG_DIRECTORY.map(p => edits[p.id] ? Object.assign({}, p, edits[p.id]) : p)), [live, edits]);
  const selected = profiles.find(p => p.id === selectedId) || live;
  const isLive = selected.live;
  const ledger = useMemoDIAG(() => isLive ? selected.ledger : (selected.ledgerExtra || []).concat(mockLedger(selected, config)), [selected, config, isLive]);
  const badgeProgress = PF_DIAG.getBadgeProgress({
    lifetimePoints: selected.lifetimePoints
  });
  const levels = (config.levelBadges || []).slice().sort((a, b) => a.threshold - b.threshold);
  const multiplier = (config.tierMultipliers || {})[selected.membershipTier] || 1;
  const flash = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };
  const refresh = () => setTick(t => t + 1);
  const patchMock = fn => setEdits(e => {
    const cur = Object.assign({}, selected, e[selected.id] || {});
    return Object.assign({}, e, {
      [selected.id]: Object.assign({}, e[selected.id] || {}, fn(cur))
    });
  });
  useEffectDIAG(() => {
    setAdjustOpen(false);
  }, [selectedId]);
  const applyAdjust = ({
    type,
    amount,
    reason
  }) => {
    if (isLive) {
      const res = PF_DIAG.manualAdjust({
        type,
        amount,
        reason,
        adminId: "admin_drtim"
      });
      if (!res.ok) return res;
      refresh();
      flash("Adjustment applied to " + selected.name + " and logged to the ledger.");
      return res;
    }
    const amt = Math.abs(Number(amount) || 0);
    if (!amt) return {
      ok: false,
      reason: "Amount must be greater than 0."
    };
    if (!reason.trim()) return {
      ok: false,
      reason: "Adjustment reason is required for audit logging."
    };
    const pts = type === "add_points" ? amt : type === "deduct_points" ? -amt : 0;
    const cr = type === "add_credits" ? amt : type === "deduct_credits" ? -amt : 0;
    patchMock(cur => ({
      lifetimePoints: Math.max(0, cur.lifetimePoints + pts),
      spendableCredits: Math.max(0, cur.spendableCredits + cr),
      ledgerExtra: [{
        id: "adj_" + Date.now(),
        ts: new Date().toISOString(),
        label: "Manual adjustment · " + reason.trim(),
        pointsDelta: pts,
        creditsDelta: cr
      }].concat(cur.ledgerExtra || [])
    }));
    flash("Adjustment applied to " + selected.name + ".");
    return {
      ok: true
    };
  };
  const freeze = () => {
    if (isLive) {
      PF_DIAG.freezeStreak(2);
      refresh();
    } else patchMock(() => ({
      status: "Frozen",
      frozenUntil: new Date(Date.now() + 2 * 86400000).toISOString()
    }));
    flash(selected.name.split(" ")[0] + "'s streak is frozen for 2 days.");
  };
  const restore = () => {
    if (isLive) {
      PF_DIAG.restoreBrokenStreak();
      refresh();
      flash("Streak restored to " + PF_DIAG.getState().streak.longest + " days.");
      return;
    }
    patchMock(cur => ({
      streakCurrent: cur.streakLongest,
      status: "Active",
      lastActive: new Date().toISOString()
    }));
    flash("Streak restored to " + selected.streakLongest + " days.");
  };
  const toggleBadge = (b, unlocked) => {
    const next = unlocked ? selected.unlocked.filter(k => k !== b.key) : selected.unlocked.concat([b.key]);
    if (isLive) {
      PF_DIAG.setState({
        unlockedAchievements: next
      });
      refresh();
    } else patchMock(() => ({
      unlocked: next
    }));
    flash((unlocked ? "Revoked " : "Granted ") + b.name + (unlocked ? " from " : " to ") + selected.name + ".");
  };
  const streakDots = Array.from({
    length: 7
  }, (_, i) => i < Math.min(7, selected.streakCurrent));
  const streakNote = selected.status === "Frozen" ? "Streak is frozen" + (selected.frozenUntil ? " until " + fmtDateLong(selected.frozenUntil) : "") + " — missed days won't break it." : selected.status === "At risk" ? "No check-in yet today. The streak breaks at midnight unless they check in or you freeze it." : selected.status === "Dormant" ? "No activity for " + fmtAgo(selected.lastActive).replace(" ago", "") + ". Restoring the streak brings back their best run." : selected.streakCurrent > 0 ? "Checked in " + fmtAgo(selected.lastActive).toLowerCase() + ". Streak is safe for today." : "No active streak yet.";
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view diag-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "User Directory & Diagnostics"), /*#__PURE__*/React.createElement("p", null, "Pick any clinician to inspect balances, streak health, badge entitlements and recent ledger activity — and fix things on the spot.")), /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: () => goDIAG("AdminAuditLedger.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:scroll-text"
  }), "Points Ledger"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: () => goDIAG("AdminUsers.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  }), "All users"))), toast && /*#__PURE__*/React.createElement("div", {
    className: "diag-toast"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle-2"
  }), /*#__PURE__*/React.createElement("span", null, toast)), /*#__PURE__*/React.createElement("div", {
    className: "diag-grid"
  }, /*#__PURE__*/React.createElement(DiagDirectory, {
    profiles: profiles,
    selectedId: selected.id,
    onSelect: setSelectedId,
    search: search,
    setSearch: setSearch
  }), /*#__PURE__*/React.createElement("div", {
    className: "diag-main",
    key: selected.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card diag-hero"
  }, /*#__PURE__*/React.createElement(DiagAvatar, {
    profile: selected,
    size: 72
  }), /*#__PURE__*/React.createElement("div", {
    className: "diag-hero-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-hero-top"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "diag-hero-name"
  }, selected.name, selected.live && /*#__PURE__*/React.createElement("span", {
    className: "diag-live"
  }, "live")), /*#__PURE__*/React.createElement(DiagTierPill, {
    tier: selected.membershipTier,
    size: "lg"
  }), /*#__PURE__*/React.createElement(DiagStatusPill, {
    status: selected.status
  })), /*#__PURE__*/React.createElement("div", {
    className: "diag-hero-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mail"
  }), selected.email), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:building-2"
  }), selected.clinic, selected.town ? " · " + selected.town : ""), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar"
  }), "Member since ", fmtDateLong(selected.joined)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock"
  }), "Last active ", fmtAgo(selected.lastActive).toLowerCase()))), /*#__PURE__*/React.createElement("div", {
    className: "diag-hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy adl-btn-sm",
    type: "button",
    onClick: () => setAdjustOpen(o => !o)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Add / Deduct"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    onClick: () => goDIAG("Profile.html?id=" + encodeURIComponent(selected.id) + "&name=" + encodeURIComponent(selected.name))
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:external-link"
  }), "View profile"))), /*#__PURE__*/React.createElement(DiagQuickAdjust, {
    open: adjustOpen,
    onClose: () => setAdjustOpen(false),
    onSubmit: applyAdjust
  }), /*#__PURE__*/React.createElement("div", {
    className: "diag-stats"
  }, /*#__PURE__*/React.createElement(DiagStat, {
    icon: "lucide:coins",
    label: "Points",
    value: PF_DIAG.formatNumber(selected.lifetimePoints),
    sub: (badgeProgress.current ? badgeProgress.current.name : "Unranked") + " level · " + multiplier.toFixed(1) + "× " + selected.membershipTier + " multiplier"
  }), /*#__PURE__*/React.createElement(DiagStat, {
    icon: "lucide:wallet",
    label: "Credits",
    value: PF_DIAG.formatNumber(selected.spendableCredits),
    sub: "Available in the Rewards Store",
    tone: "good"
  }), /*#__PURE__*/React.createElement(DiagStat, {
    icon: "lucide:hourglass",
    label: "Expiring",
    value: PF_DIAG.formatNumber(selected.expiringCredits || 0),
    sub: selected.expiringCredits ? "Expire within 30 days" : "Nothing expiring soon",
    tone: selected.expiringCredits ? "warn" : ""
  }), /*#__PURE__*/React.createElement(DiagStat, {
    icon: "lucide:flame",
    label: "Streak",
    value: selected.streakCurrent + (selected.streakCurrent === 1 ? " day" : " days"),
    sub: "Best run " + selected.streakLongest + " days",
    tone: selected.status === "Frozen" ? "cool" : selected.status === "At risk" ? "warn" : ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "diag-card-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card diag-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Streak health"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Daily check-in streak and recovery tools")), /*#__PURE__*/React.createElement(DiagStatusPill, {
    status: selected.status
  })), /*#__PURE__*/React.createElement("div", {
    className: "diag-streak-dots"
  }, streakDots.map((on, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "diag-streak-dot" + (on ? " is-on" : "") + (selected.status === "Frozen" && on ? " is-frozen" : "")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: on ? "lucide:check" : "lucide:minus"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "diag-streak-dots-label"
  }, "Last 7 days")), /*#__PURE__*/React.createElement("p", {
    className: "diag-streak-note"
  }, streakNote), /*#__PURE__*/React.createElement("div", {
    className: "diag-streak-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    disabled: selected.status === "Frozen",
    onClick: freeze
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:snowflake"
  }), "Freeze 2 days"), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-ghost adl-btn-sm",
    type: "button",
    disabled: selected.streakCurrent >= selected.streakLongest,
    onClick: restore
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:rotate-ccw"
  }), "Restore best run"))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card diag-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Level badge"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Earned automatically from lifetime points")), /*#__PURE__*/React.createElement("span", {
    className: "diag-level-now",
    style: {
      "--lvl": badgeProgress.current ? badgeProgress.current.color : "var(--gray-400)"
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:award"
  }), badgeProgress.current ? badgeProgress.current.name : "Unranked")), /*#__PURE__*/React.createElement("div", {
    className: "diag-level-bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: badgeProgress.pct + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "diag-level-caption"
  }, badgeProgress.next ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, PF_DIAG.formatNumber(Math.max(0, badgeProgress.next.threshold - selected.lifetimePoints)), " pts"), " to ", badgeProgress.next.name, " · ", badgeProgress.pct, "% there") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, "Top level reached"), " · every level badge unlocked")), /*#__PURE__*/React.createElement("div", {
    className: "diag-level-track"
  }, levels.map(l => {
    const done = selected.lifetimePoints >= l.threshold;
    return /*#__PURE__*/React.createElement("span", {
      key: l.key,
      className: "diag-level-step" + (done ? " is-done" : ""),
      style: {
        "--lvl": l.color
      }
    }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("span", null, l.name), /*#__PURE__*/React.createElement("small", null, PF_DIAG.formatNumber(l.threshold)));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Achievement badges"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, selected.unlocked.length, " of ", config.achievementBadges.length, " unlocked · grant or revoke manually"))), /*#__PURE__*/React.createElement("div", {
    className: "diag-achievement-grid"
  }, config.achievementBadges.map(b => {
    const unlocked = selected.unlocked.includes(b.key);
    return /*#__PURE__*/React.createElement("div", {
      key: b.key,
      className: "diag-achievement" + (unlocked ? " is-unlocked" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "diag-achievement-icon"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: b.icon
    })), /*#__PURE__*/React.createElement("span", {
      className: "diag-achievement-body"
    }, /*#__PURE__*/React.createElement("b", null, b.name), /*#__PURE__*/React.createElement("span", null, b.description)), /*#__PURE__*/React.createElement("button", {
      className: "diag-achievement-toggle" + (unlocked ? " is-revoke" : ""),
      type: "button",
      onClick: () => toggleBadge(b, unlocked)
    }, unlocked ? "Revoke" : "Grant"));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-table diag-ledger"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head diag-ledger-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Recent ledger activity"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Latest ", Math.min(ledger.length, 10), " entries", isLive ? " · live simulation" : "")), /*#__PURE__*/React.createElement("button", {
    className: "diag-link-btn",
    type: "button",
    onClick: () => goDIAG("AdminAuditLedger.html")
  }, "Open full ledger", /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-right"
  }))), ledger.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "adl-row-grid adl-thead diag-ledger-grid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "Action"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th"
  }, "When"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th diag-right"
  }, "Points"), /*#__PURE__*/React.createElement("span", {
    className: "adl-th diag-right"
  }, "Credits")), ledger.slice(0, 10).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "adl-row-grid adl-trow diag-ledger-grid"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-cell diag-ledger-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-ledger-dot" + (t.pointsDelta < 0 || t.creditsDelta < 0 ? " is-neg" : "")
  }), t.label), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell-muted"
  }, fmtDate(t.ts), " · ", fmtAgo(t.ts).toLowerCase()), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell diag-right diag-delta" + (t.pointsDelta > 0 ? " is-pos" : t.pointsDelta < 0 ? " is-neg" : "")
  }, t.pointsDelta > 0 ? "+" + PF_DIAG.formatNumber(t.pointsDelta) : t.pointsDelta ? PF_DIAG.formatNumber(t.pointsDelta) : "—"), /*#__PURE__*/React.createElement("span", {
    className: "adl-cell diag-right diag-delta" + (t.creditsDelta > 0 ? " is-pos" : t.creditsDelta < 0 ? " is-neg" : "")
  }, t.creditsDelta > 0 ? "+" + PF_DIAG.formatNumber(t.creditsDelta) : t.creditsDelta ? PF_DIAG.formatNumber(t.creditsDelta) : "—"))), ledger.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "diag-ledger-empty"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:inbox"
  }), "No ledger activity yet for this member.")))));
}
function UserDiagnosticsApp() {
  const [search, setSearch] = useStateDIAG("");
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-shell"
  }, /*#__PURE__*/React.createElement(AdlSidebar, {
    activeLoyaltyKey: "users"
  }), /*#__PURE__*/React.createElement("main", {
    className: "adl-main"
  }, /*#__PURE__*/React.createElement(AdlHeader, {
    title: "Loyalty & Gamification — User Diagnostics",
    search: search,
    onSearch: setSearch
  }), /*#__PURE__*/React.createElement(UserDiagnosticsView, {
    search: search,
    setSearch: setSearch
  })));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(UserDiagnosticsApp, null));
