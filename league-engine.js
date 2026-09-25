/* ===========================================================================
   PROfinity — League engine (plain JS, no React)
   Six gem badges, lowest to highest: Jade → Topaz → Ruby → Emerald →
   Amethyst → Sapphire. Since 2026-09-24 a member's badge is earned with
   Lifetime Points: the six leagues ARE the six stops on the Milestone Path
   (loyalty-engine.js DEFAULT_MILESTONE_PATH, admin-editable), so each
   league's `requires` is that milestone's points threshold (matched by key;
   the built-in values below are only the fallback when PFLoyalty is absent)
   and "how far to the next league" is simply points remaining.
   API on window.PFLeague: LEAGUES, FIELDS, getLeagues, getCurrent, getLeague,
   getProgress, getStandings, check, previewKey.
   Fires document "pf:league-changed" {from, to, up} when a points booking
   (window "pf:points-earned" / cross-tab storage) moves the member's league.
   ?league=<key> previews the rail as if the member held that badge.
   =========================================================================== */
(function () {
  "use strict";
  var LAST_KEY = "pf-league-last"; // last league index seen, for change detection

  var LEAGUES = [
    { key: "jade",     name: "Jade",     requires: 0,  accent: "#1FA98A", deep: "#127A62", soft: "#E3F6F0",
      lottie: "https://lottie.host/f9f46fed-e810-492a-8132-3e171a4f7a22/ZQcQTQrSLM.json" },
    { key: "topaz",    name: "Topaz",    requires: 1500,  accent: "#E1A400", deep: "#9C6F00", soft: "#FCF3D6",
      lottie: "https://lottie.host/cd6e01c6-e557-4a0e-be79-ef3e9774ba6a/izU4VyNT95.json" },
    { key: "ruby",     name: "Ruby",     requires: 6000,  accent: "#D9414E", deep: "#A0222E", soft: "#FCE6E8",
      lottie: "https://lottie.host/1c375f17-8ea4-4be3-b426-ac3de1fbf527/lj00ETZ4Tr.json" },
    { key: "emerald",  name: "Emerald",  requires: 15000,  accent: "#2FA84F", deep: "#1C7A36", soft: "#E4F5E8",
      lottie: "https://lottie.host/889d1827-7a3b-4716-9dcc-09c49a1e9f77/AhzhBXLLyK.json" },
    { key: "amethyst", name: "Amethyst", requires: 30000,  accent: "#8B45E0", deep: "#5E2AA3", soft: "#F0E7FB",
      lottie: "https://lottie.host/ef508495-0d88-451e-b041-36b97feee3fd/VgYXWyzmGC.json" },
    { key: "sapphire", name: "Sapphire", requires: 60000, accent: "#2E63E6", deep: "#1C43A8", soft: "#E5ECFC",
      lottie: "https://lottie.host/8b3b8e49-07ab-40d2-a35a-1c5ac3147e80/ueUzxpkfkp.json" }
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

  /* --- points-based progress --------------------------------------------- */
  function loyaltyPoints() {
    try { return Math.max(0, Math.round(Number(window.PFLoyalty.getState().lifetimePoints) || 0)); } catch (e) { return 0; }
  }
  /* each league's points threshold = its Milestone Path entry (by key); the
     built-in `requires` is only the fallback */
  function thresholds() {
    var byKey = {};
    try {
      (window.PFLoyalty.getConfig().milestonePath || []).forEach(function (m) {
        if (m && m.key && typeof m.threshold === "number") byKey[m.key] = m.threshold;
      });
    } catch (e) {}
    return LEAGUES.map(function (l) { return typeof byKey[l.key] === "number" ? byKey[l.key] : l.requires; });
  }
  function getLeagues() {
    var th = thresholds();
    return LEAGUES.map(function (l, i) { return Object.assign({}, l, { requires: th[i], threshold: th[i] }); });
  }

  function previewKey() {
    try {
      var q = new URLSearchParams(location.search).get("league");
      return q && LEAGUES.some(function (l) { return l.key === q; }) ? q : null;
    } catch (e) { return null; }
  }

  function indexFor(leagues, pts) {
    var idx = 0;
    leagues.forEach(function (l, i) { if (pts >= l.requires) idx = i; });
    return idx;
  }

  /* { index, current, next, points, need (pts to next), pct, total, preview, leagues } */
  function getProgress() {
    var leagues = getLeagues();
    var pts = loyaltyPoints();
    var idx = indexFor(leagues, pts);
    var pv = previewKey();
    if (pv) idx = leagues.findIndex(function (l) { return l.key === pv; });
    var cur = leagues[idx], next = leagues[idx + 1] || null;
    var need = next ? Math.max(0, next.requires - pts) : 0;
    var span = next ? Math.max(1, next.requires - cur.requires) : 1;
    var pct = next ? Math.max(0, Math.min(100, Math.round((pts - cur.requires) / span * 100))) : 100;
    return { index: idx, current: cur, next: next, points: pts, need: need, pct: pct, total: leagues.length, preview: !!pv, leagues: leagues };
  }
  function getCurrent() { return getProgress().current; }
  function getLeague(key) { return getLeagues().filter(function (l) { return l.key === key; })[0] || null; }

  /* --- change detection --------------------------------------------------- */
  function readLast() { try { var v = localStorage.getItem(LAST_KEY); return v == null ? null : Number(v); } catch (e) { return null; } }
  function writeLast(i) { try { localStorage.setItem(LAST_KEY, String(i)); } catch (e) {} }
  /* compare the member's real league (ignoring ?league= preview) with the last
     one seen and announce a move; returns the current progress */
  function check() {
    var leagues = getLeagues(), pts = loyaltyPoints();
    var idx = indexFor(leagues, pts), last = readLast();
    if (last == null) { writeLast(idx); return getProgress(); }
    if (idx !== last) {
      writeLast(idx);
      try {
        document.dispatchEvent(new CustomEvent("pf:league-changed", { detail: { from: leagues[last] || null, to: leagues[idx], up: idx > last } }));
      } catch (e) {}
    }
    return getProgress();
  }
  try {
    window.addEventListener("pf:points-earned", function () { check(); });
    window.addEventListener("storage", function (e) { if (!e || !e.key || /^pf-loyalty/.test(e.key)) check(); });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { check(); });
    else setTimeout(check, 0);
  } catch (e) {}

  window.PFLeague = {
    LEAGUES: LEAGUES, FIELDS: LEAGUE_FIELDS, getStandings: getStandings,
    getLeagues: getLeagues, getCurrent: getCurrent, getLeague: getLeague,
    getProgress: getProgress, check: check, previewKey: previewKey
  };
})();
