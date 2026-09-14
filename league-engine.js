/* ===========================================================================
   PROfinity — League engine (plain JS, no React)
   Six gem badges, lowest to highest: Jade → Topaz → Ruby → Emerald →
   Amethyst → Sapphire. A member's badge is earned through milestones
   (hitting today's target, adding friends, creating posts, engaging with
   the community, check-in streaks, finishing lessons) rather than points:
   each league needs a cumulative number of completed milestones. Counters
   live in localStorage ("pf-league"); where another store already knows the
   answer (loyalty streak/ledger, pf-newsfeed-user-posts, pf-lessons-done)
   the engine reads that too and takes the larger value.
   window.PFLeague = { LEAGUES, MILESTONES, getLeagues, getCurrent, getLeague,
     getMilestones, getProgress, getCounters, bump, set, reset, previewKey }.
   ?league=<key> previews the rail as if the member held that badge.
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-league";

  var LEAGUES = [
    { key: "jade",     name: "Jade",     requires: 0,  accent: "#1FA98A", deep: "#127A62", soft: "#E3F6F0",
      lottie: "https://lottie.host/f9f46fed-e810-492a-8132-3e171a4f7a22/ZQcQTQrSLM.json" },
    { key: "topaz",    name: "Topaz",    requires: 2,  accent: "#E1A400", deep: "#9C6F00", soft: "#FCF3D6",
      lottie: "https://lottie.host/cd6e01c6-e557-4a0e-be79-ef3e9774ba6a/izU4VyNT95.json" },
    { key: "ruby",     name: "Ruby",     requires: 4,  accent: "#D9414E", deep: "#A0222E", soft: "#FCE6E8",
      lottie: "https://lottie.host/1c375f17-8ea4-4be3-b426-ac3de1fbf527/lj00ETZ4Tr.json" },
    { key: "emerald",  name: "Emerald",  requires: 6,  accent: "#2FA84F", deep: "#1C7A36", soft: "#E4F5E8",
      lottie: "https://lottie.host/889d1827-7a3b-4716-9dcc-09c49a1e9f77/AhzhBXLLyK.json" },
    { key: "amethyst", name: "Amethyst", requires: 8,  accent: "#8B45E0", deep: "#5E2AA3", soft: "#F0E7FB",
      lottie: "https://lottie.host/ef508495-0d88-451e-b041-36b97feee3fd/VgYXWyzmGC.json" },
    { key: "sapphire", name: "Sapphire", requires: 10, accent: "#2E63E6", deep: "#1C43A8", soft: "#E5ECFC",
      lottie: "https://lottie.host/8b3b8e49-07ab-40d2-a35a-1c5ac3147e80/ueUzxpkfkp.json" }
  ];

  /* counter keys: targets (days today's 50-pt target was hit), friends, posts,
     engagements (likes/comments/shares), streak (longest check-in run), lessons */
  var MILESTONES = [
    { id: "target_1",   counter: "targets",     target: 1,  icon: "lucide:target",         label: "Hit today's target once" },
    { id: "friend_1",   counter: "friends",     target: 1,  icon: "lucide:user-plus",      label: "Add your first friend" },
    { id: "post_1",     counter: "posts",       target: 1,  icon: "lucide:pen-line",       label: "Create your first post" },
    { id: "engage_10",  counter: "engagements", target: 10, icon: "lucide:heart",          label: "Engage 10 times" },
    { id: "streak_5",   counter: "streak",      target: 5,  icon: "lucide:flame",          label: "Reach a 5-day check-in streak" },
    { id: "lesson_1",   counter: "lessons",     target: 1,  icon: "lucide:book-open",      label: "Complete a lesson" },
    { id: "target_7",   counter: "targets",     target: 7,  icon: "lucide:target",         label: "Hit today's target 7 times" },
    { id: "friend_5",   counter: "friends",     target: 5,  icon: "lucide:users",          label: "Add 5 friends" },
    { id: "post_5",     counter: "posts",       target: 5,  icon: "lucide:pen-line",       label: "Create 5 posts" },
    { id: "engage_50",  counter: "engagements", target: 50, icon: "lucide:message-circle", label: "Engage 50 times" },
    { id: "streak_30",  counter: "streak",      target: 30, icon: "lucide:flame",          label: "Reach a 30-day check-in streak" },
    { id: "lesson_5",   counter: "lessons",     target: 5,  icon: "lucide:graduation-cap", label: "Complete 5 lessons" }
  ];

  /* one mock field per league (rolling 30-day points); the member is merged
     into whichever league she holds — shared by Leaderboard, Profile, Dashboard */
  var LEAGUE_FIELDS = {
    sapphire: [
      { name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", points: 9840, trend: "up" },
      { name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", points: 8120, trend: "up" },
      { name: "Sofia Alarcón", points: 6790, trend: "down" },
      { name: "Marcus Webb", points: 6120, trend: "up" },
      { name: "Eleanor Pena", points: 5480, trend: "flat" },
      { name: "Jonas Adeyemi", points: 5310, trend: "down" },
      { name: "Grace Lindqvist", points: 4980, trend: "up" },
    ],
    amethyst: [
      { name: "Hana Kobayashi", points: 4400, trend: "flat" },
      { name: "Ravi Chandran", points: 3920, trend: "down" },
      { name: "Olivia Marsh", points: 3510, trend: "up" },
      { name: "Deniz Aydın", points: 3105, trend: "flat" },
      { name: "Lucas Moreau", points: 2960, trend: "up" },
      { name: "Isabella Rossi", points: 2740, trend: "down" },
      { name: "Chen Wei", points: 2580, trend: "up" },
    ],
    emerald: [
      { name: "Priya Nandwani", points: 2640, trend: "down" },
      { name: "Liam O'Connor", points: 2210, trend: "up" },
      { name: "Amara Okafor", points: 1890, trend: "flat" },
      { name: "Ben Fischer", points: 1655, trend: "down" },
      { name: "Noor Haddad", points: 1420, trend: "up" },
      { name: "Elena Petrova", points: 1380, trend: "flat" },
      { name: "Kwame Mensah", points: 1210, trend: "up" },
    ],
    ruby: [
      { name: "Yusuf Demir", points: 2860, trend: "up" },
      { name: "Charlotte Hughes", points: 2440, trend: "flat" },
      { name: "Mateo Silva", points: 1980, trend: "down" },
      { name: "Aisha Bello", points: 1720, trend: "up" },
      { name: "Tom Whitfield", points: 1490, trend: "down" },
      { name: "Sakura Ito", points: 1310, trend: "up" },
      { name: "Daniel Kim", points: 1150, trend: "flat" },
      { name: "Freya Nilsson", points: 990, trend: "up" },
      { name: "Omar Farouk", points: 870, trend: "down" },
    ],
    topaz: [
      { name: "Zoe Carter", points: 1480, trend: "up" },
      { name: "Arjun Patel", points: 1320, trend: "flat" },
      { name: "Mia Andersson", points: 1190, trend: "up" },
      { name: "Leo Fontaine", points: 1040, trend: "down" },
      { name: "Nadia Rahman", points: 920, trend: "up" },
      { name: "Ethan Brooks", points: 810, trend: "flat" },
      { name: "Chloe Martin", points: 700, trend: "down" },
    ],
    jade: [
      { name: "Sam Okoye", points: 760, trend: "up" },
      { name: "Ines Costa", points: 640, trend: "flat" },
      { name: "Ravi Shah", points: 590, trend: "up" },
      { name: "Lily Zhang", points: 520, trend: "down" },
      { name: "Jack Murphy", points: 470, trend: "up" },
      { name: "Ana Duarte", points: 410, trend: "flat" },
      { name: "Finn O'Brien", points: 350, trend: "up" },
    ],
  };

  /* the member's league board with her merged in and ranked */
  function getStandings(me) {
    var p = getProgress();
    var rows = (LEAGUE_FIELDS[p.current.key] || []).map(function (r) { return Object.assign({}, r, { isMe: false }); });
    if (me) rows.push({ name: me.name, avatar: me.avatar || null, points: Number(me.points) || 0, trend: "up", isMe: true });
    rows.sort(function (a, b) { return b.points - a.points; });
    rows = rows.map(function (r, i) { return Object.assign({}, r, { rank: i + 1 }); });
    var idx = rows.findIndex(function (r) { return r.isMe; });
    return { league: p.current, rows: rows, me: idx >= 0 ? rows[idx] : null, above: idx > 0 ? rows[idx - 1] : null, below: idx >= 0 ? rows[idx + 1] || null : null };
  }

  /* Katy's seed: 4 milestones done → Ruby, two short of Emerald */
  var SEED = { targets: 3, friends: 2, posts: 0, engagements: 14, streak: 0, lessons: 0 };

  function read() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!s || typeof s !== "object") { s = Object.assign({}, SEED); write(s); }
    return s;
  }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  /* live counters from stores other pages already write */
  function derived() {
    var d = {};
    try {
      var st = window.PFLoyalty && window.PFLoyalty.getState();
      if (st && st.streak) d.streak = Math.max(st.streak.longest || 0, st.streak.current || 0);
    } catch (e) {}
    try {
      var posts = JSON.parse(localStorage.getItem("pf-newsfeed-user-posts")) || [];
      d.posts = posts.filter(function (p) { return p && p.body; }).length;
    } catch (e) {}
    try {
      var done = JSON.parse(localStorage.getItem("pf-lessons-done"));
      if (Array.isArray(done)) d.lessons = done.length;
      else if (done && typeof done === "object") d.lessons = Object.keys(done).filter(function (k) { return done[k]; }).length;
    } catch (e) {}
    return d;
  }

  function getCounters() {
    var s = read(), d = derived(), out = {};
    ["targets", "friends", "posts", "engagements", "streak", "lessons"].forEach(function (k) {
      out[k] = Math.max(Number(s[k]) || 0, Number(d[k]) || 0);
    });
    return out;
  }

  function getMilestones() {
    var c = getCounters();
    return MILESTONES.map(function (m) {
      var have = c[m.counter] || 0;
      return Object.assign({}, m, { have: have, done: have >= m.target, pct: Math.min(100, Math.round(have / m.target * 100)) });
    });
  }

  function previewKey() {
    try {
      var q = new URLSearchParams(location.search).get("league");
      return q && LEAGUES.some(function (l) { return l.key === q; }) ? q : null;
    } catch (e) { return null; }
  }

  function indexFor(doneCount) {
    var idx = 0;
    LEAGUES.forEach(function (l, i) { if (doneCount >= l.requires) idx = i; });
    return idx;
  }

  function getProgress() {
    var ms = getMilestones();
    var done = ms.filter(function (m) { return m.done; }).length;
    var idx = indexFor(done);
    var pv = previewKey();
    if (pv) idx = LEAGUES.findIndex(function (l) { return l.key === pv; });
    var cur = LEAGUES[idx], next = LEAGUES[idx + 1] || null;
    var need = next ? Math.max(0, next.requires - done) : 0;
    var span = next ? next.requires - cur.requires : 1;
    var pct = next ? Math.max(0, Math.min(100, Math.round((done - cur.requires) / span * 100))) : 100;
    return { index: idx, current: cur, next: next, done: done, need: need, pct: pct, total: MILESTONES.length, preview: !!pv };
  }
  function getCurrent() { return getProgress().current; }
  function getLeague(key) { return LEAGUES.filter(function (l) { return l.key === key; })[0] || null; }
  function getLeagues() { return LEAGUES.slice(); }

  function announce(before) {
    var after = getProgress();
    try {
      document.dispatchEvent(new CustomEvent("pf:league-changed", { detail: { from: before.current, to: after.current, up: after.index > before.index } }));
    } catch (e) {}
    return after;
  }
  function bump(counter, n) {
    var before = getProgress();
    var s = read();
    s[counter] = (Number(s[counter]) || 0) + (n == null ? 1 : Number(n));
    write(s);
    return announce(before);
  }
  function set(counter, value) {
    var before = getProgress();
    var s = read();
    s[counter] = Number(value) || 0;
    write(s);
    return announce(before);
  }
  function reset() { write(Object.assign({}, SEED)); return getProgress(); }

  window.PFLeague = {
    LEAGUES: LEAGUES, MILESTONES: MILESTONES, FIELDS: LEAGUE_FIELDS, getStandings: getStandings,
    getLeagues: getLeagues, getCurrent: getCurrent, getLeague: getLeague,
    getMilestones: getMilestones, getProgress: getProgress, getCounters: getCounters,
    bump: bump, set: set, reset: reset, previewKey: previewKey
  };
})();
