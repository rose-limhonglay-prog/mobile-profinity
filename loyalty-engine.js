/* ===========================================================================
   PROfinity — Loyalty / Gamification & Anti-Cheat Engine (shared, client-side)
   Plain JS (no JSX/build step) so it loads early on every page, same as
   pagetrans.js / hashtags.js. Backed by localStorage so Admin config changes
   and Katy's earn/redeem actions are visible everywhere else on next render —
   this is a client-only simulation standing in for the real ledger/backend
   described in the Technical & Design Specification (v3.0); it reproduces the
   spec's rules (tier multipliers, caps/velocity, silent-cap anti-cheat,
   points→credits conversion, immutable ledger) so the prototype behaves the
   way the shipped system will, without a server.

   NOTE: this shares state across pages on the SAME origin (e.g. running the
   whole prototype from one local dev server). The live Admin and Katy demos
   are deployed to two different Vercel domains, so browser storage does not
   cross between them there — that split only matters for a live public link;
   click-through review from one origin (localhost, or a single combined
   deployment) sees the full simulated economy in sync.
   =========================================================================== */
(function () {
  var CONFIG_KEY = "pf-loyalty-config-v1";
  var STATE_KEY = "pf-loyalty-state-v1";

  var TIER_KEYS = ["Basic", "Confidence", "Mastery", "Freedom"];

  /* ------------------------------------------------------------ defaults */

  var DEFAULT_ACTIONS = [
    { id: "evt_prod_review_submit", label: "Write a Product Review", category: "Reviews", basePoints: 150, dailyCap: 3, weeklyCap: 10, lifetimeCap: null, velocitySeconds: 600, minCharacters: 50, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "Max 1 completion per 10 minutes; 50-character floor.", linkedReward: "badge:master_reviewer" },
    { id: "evt_license_verify", label: "Verify Medical License", category: "Onboarding", basePoints: 200, dailyCap: null, weeklyCap: null, lifetimeCap: 1, velocitySeconds: 0, minCharacters: 0, requiresMedia: true, requiresApproval: true, holdDays: 1, platforms: ["web", "ios", "android"], active: true, oneTimeLock: true, guardrail: "Manual admin review or API validation.", linkedReward: null },
    { id: "evt_bio_write", label: "Write Bio / About", category: "Profile", basePoints: 60, dailyCap: 1, weeklyCap: 3, lifetimeCap: null, velocitySeconds: 0, minCharacters: 100, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "100 char floor + duplication check.", linkedReward: null },
    { id: "evt_case_study_share", label: "Share Case Study", category: "Community", basePoints: 150, dailyCap: 2, weeklyCap: 5, lifetimeCap: null, velocitySeconds: 60, minCharacters: 0, requiresMedia: true, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "Deduplication of uploaded case files.", linkedReward: "badge:community_pillar" },
    { id: "evt_comment_post", label: "Comment on Post", category: "Social", basePoints: 10, dailyCap: 20, weeklyCap: null, lifetimeCap: null, velocitySeconds: 120, minCharacters: 15, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "Min 15 chars; 2-min cooling cooldown.", linkedReward: null },
    { id: "evt_react_post", label: "React to Post", category: "Social", basePoints: 10, dailyCap: 30, weeklyCap: null, lifetimeCap: null, velocitySeconds: 3, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "Max 30/day; minimum 3s between.", linkedReward: null },
    { id: "evt_course_complete", label: "Complete Course", category: "Learning", basePoints: 200, dailyCap: null, weeklyCap: null, lifetimeCap: null, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "Requires assessment pass.", linkedReward: null },
    { id: "evt_webinar_attend", label: "Attend Webinar", category: "Learning", basePoints: 100, dailyCap: null, weeklyCap: null, lifetimeCap: null, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "Attendance duration verified >= 60% of session.", linkedReward: null },
    { id: "evt_mobile_checkin", label: "Mobile Check-In", category: "Habit", basePoints: 50, dailyCap: 1, weeklyCap: 7, lifetimeCap: null, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["ios", "android"], active: true, oneTimeLock: false, guardrail: "Consecutive 5-day streak check.", linkedReward: null },
    { id: "evt_refer_colleague", label: "Refer a Colleague", category: "Social", basePoints: 200, dailyCap: null, weeklyCap: 3, lifetimeCap: null, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 2, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "Unique device/email fraud screen.", linkedReward: null },
    { id: "evt_profile_complete", label: "Complete Profile 100%", category: "Onboarding", basePoints: 300, dailyCap: null, weeklyCap: null, lifetimeCap: 1, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: true, guardrail: "One-time lock upon profile completion.", linkedReward: null, overrides: { Basic: 1.0, Confidence: 1.0, Mastery: 1.0, Freedom: 1.0 } },
    { id: "evt_purchase_item", label: "Purchase Item", category: "Purchases", basePoints: 300, dailyCap: null, weeklyCap: null, lifetimeCap: null, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false, holdDays: 0, platforms: ["web", "ios", "android"], active: true, oneTimeLock: false, guardrail: "Points processed strictly server-side from order total.", linkedReward: null, overrides: { Confidence: 1.2 } }
  ];

  var DEFAULT_TIER_MULTIPLIERS = { Basic: 1.0, Confidence: 1.5, Mastery: 2.0, Freedom: 3.0 };

  var DEFAULT_LEVEL_BADGES = [
    { key: "bronze", name: "Bronze", threshold: 1000, color: "#b06a3a" },
    { key: "silver", name: "Silver", threshold: 5000, color: "#8a94a6" },
    { key: "gold", name: "Gold", threshold: 10000, color: "#e2a300" },
    { key: "platinum", name: "Platinum", threshold: 20000, color: "#5b6b8c" },
    { key: "diamond", name: "Diamond", threshold: 50000, color: "#3f8fd1", splashTitle: "Sapphire Collector", splashPerks: ["2.0x permanent multiplier", "VIP Store Access", "Monthly Bonus Box"] }
  ];

  var DEFAULT_ACHIEVEMENT_BADGES = [
    { key: "first_blood", name: "First Blood", icon: "lucide:zap", description: "Complete your very first point-earning action.", criteria: { type: "actionCount", actionId: null, count: 1 }, reward: "50 bonus credits" },
    { key: "high_roller", name: "High Roller", icon: "lucide:gem", description: "Redeem 3 items from the Rewards Store.", criteria: { type: "redeemCount", count: 3 }, reward: "VIP Store Access" },
    { key: "streak_master", name: "Streak Master", icon: "lucide:flame", description: "Reach a 30-day check-in streak.", criteria: { type: "streak", count: 30 }, reward: "1.5x multiplier for 7 days" },
    { key: "community_pillar", name: "Community Pillar", icon: "lucide:users", description: "Share 10 case studies with the community.", criteria: { type: "actionCount", actionId: "evt_case_study_share", count: 10 }, reward: "Featured Clinician spotlight" },
    { key: "master_reviewer", name: "Master Reviewer", icon: "lucide:star", description: "Write 10 product reviews.", criteria: { type: "actionCount", actionId: "evt_prod_review_submit", count: 10 }, reward: "5,000 bonus credits + 2x multiplier" }
  ];

  var DEFAULT_STORE_ITEMS = [
    { id: "dinner_drtim", name: "Dinner with Dr Tim Pearce", description: "An exclusive dining experience with the platform founder. Subject to strict quarterly availability.", cost: 25000, category: "Signature", image: "assets/avatar-drtim.png", inventory: 2, delivery: "Concierge booking" },
    { id: "mentorship_1on1", name: "1-on-1 Personal Mentorship", description: "A 45-minute clinical or business consulting session with leadership.", cost: 5500, category: "Signature", inventory: 6, delivery: "Calendar booking link" },
    { id: "event_seats", name: "Exclusive Special Event Seats", description: "Priority VIP seating at live aesthetic workshops or annual conferences.", cost: 10000, category: "Experiences", inventory: 10, delivery: "E-ticket via email" },
    { id: "clinical_tools", name: "Aesthetic Clinical Tools", description: "Access to premium procedural video sets and clinical intake templates.", cost: 3000, category: "Clinical", inventory: null, delivery: "Instant digital unlock" },
    { id: "amazon_voucher_25", name: "Amazon Voucher — £25", description: "Digital gift voucher, delivered by email.", cost: 800, category: "Vouchers", inventory: null, delivery: "Email code" },
    { id: "spotify_premium_3mo", name: "Spotify Premium — 3 Months", description: "3 months of Spotify Premium.", cost: 600, category: "Vouchers", inventory: null, delivery: "Email code" },
    { id: "pf_hoodie", name: "PROfinity Branded Hoodie", description: "Exclusive branded clinic wear.", cost: 1200, category: "Merch", inventory: 40, delivery: "Ships to clinic address" }
  ];

  var DEFAULT_LEADERBOARD_PRIZES = [
    { rank: "1", prize: "1:1 Mentorship with Dr Tim Pearce" },
    { rank: "2–3", prize: "Exclusive Special Event Seat" },
    { rank: "4–15", prize: "500 bonus Spendable Credits" }
  ];

  var DEFAULT_CONFIG = {
    creditConversionRate: 0.10,
    creditExpiryMonths: 12,
    streakFreezeCost: 500,
    tierMultipliers: DEFAULT_TIER_MULTIPLIERS,
    actions: DEFAULT_ACTIONS,
    levelBadges: DEFAULT_LEVEL_BADGES,
    achievementBadges: DEFAULT_ACHIEVEMENT_BADGES,
    storeItems: DEFAULT_STORE_ITEMS,
    leaderboardPrizes: DEFAULT_LEADERBOARD_PRIZES
  };

  var KATY = { name: "Katy", email: "katy.moore@lumaaesthetics.com", membershipTier: "Confidence" };

  var MOCK_DIRECTORY = [
    { name: "Eleanor Pena", email: "eleanor.pena@brightskinclinic.com", membershipTier: "Mastery", lifetimePoints: 12450, spendableCredits: 3200, expiringCredits: 450, streakCurrent: 12, streakLongest: 45 },
    { name: "Marcus Webb", email: "marcus.webb@webbaesthetics.com", membershipTier: "Freedom", lifetimePoints: 48200, spendableCredits: 9100, expiringCredits: 900, streakCurrent: 31, streakLongest: 60 },
    { name: "Priya Nandwani", email: "priya.n@glowclinic.co.uk", membershipTier: "Basic", lifetimePoints: 780, spendableCredits: 60, expiringCredits: 0, streakCurrent: 1, streakLongest: 4 },
    { name: "Sofia Alarcón", email: "sofia@alarconderm.com", membershipTier: "Confidence", lifetimePoints: 6300, spendableCredits: 1450, expiringCredits: 120, streakCurrent: 8, streakLongest: 22 }
  ];

  function nowIso() { return new Date().toISOString(); }
  function uid(prefix) { return (prefix || "id") + "_" + Math.random().toString(36).slice(2, 10); }

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  /* ------------------------------------------------------------- config */

  function getConfig() {
    var cfg = readJSON(CONFIG_KEY, null);
    if (!cfg) { cfg = JSON.parse(JSON.stringify(DEFAULT_CONFIG)); writeJSON(CONFIG_KEY, cfg); }
    // backfill any keys added after a user's config was first seeded
    var merged = Object.assign({}, DEFAULT_CONFIG, cfg);
    return merged;
  }
  function setConfig(patch) {
    var cfg = Object.assign({}, getConfig(), patch);
    writeJSON(CONFIG_KEY, cfg);
    return cfg;
  }
  function upsertAction(action) {
    var cfg = getConfig();
    var list = cfg.actions.slice();
    var idx = list.findIndex(function (a) { return a.id === action.id; });
    if (idx >= 0) list[idx] = Object.assign({}, list[idx], action); else list.push(action);
    return setConfig({ actions: list });
  }
  function setTierMultipliers(obj) { return setConfig({ tierMultipliers: Object.assign({}, getConfig().tierMultipliers, obj) }); }
  function setStoreItems(list) { return setConfig({ storeItems: list }); }
  function upsertStoreItem(item) {
    var cfg = getConfig();
    var list = cfg.storeItems.slice();
    var idx = list.findIndex(function (i) { return i.id === item.id; });
    if (idx >= 0) list[idx] = Object.assign({}, list[idx], item); else list.push(item);
    return setStoreItems(list);
  }
  function setAchievementBadges(list) { return setConfig({ achievementBadges: list }); }
  function setLevelBadges(list) { return setConfig({ levelBadges: list }); }
  function setLeaderboardPrizes(list) { return setConfig({ leaderboardPrizes: list }); }

  /* -------------------------------------------------------------- state */

  function seedState() {
    var seedTs = Date.now() - 6 * 86400000;
    var ledger = [];
    function push(actionId, label, points, credits, daysAgo, flags) {
      ledger.push({
        id: uid("txn"), ts: new Date(Date.now() - daysAgo * 86400000 - Math.random() * 3600000).toISOString(),
        actionId: actionId, label: label, pointsDelta: points, creditsDelta: credits,
        guardrailFlags: flags || null, adminId: null, adjustmentReason: null
      });
    }
    push("evt_profile_complete", "Complete Profile 100%", 300, 30, 6);
    push("evt_bio_write", "Write Bio / About", 90, 9, 6);
    push("evt_case_study_share", "Share Case Study", 225, 23, 5);
    push("evt_mobile_checkin", "Mobile Check-In", 75, 8, 5);
    push("evt_mobile_checkin", "Mobile Check-In", 75, 8, 4);
    push("evt_course_complete", "Complete Course", 300, 30, 4);
    push("evt_comment_post", "Comment on Post", 15, 2, 3);
    push("evt_react_post", "React to Post", 0, 0, 3, "CAP_REACHED");
    push("evt_mobile_checkin", "Mobile Check-In", 75, 8, 3);
    push("evt_webinar_attend", "Attend Webinar", 150, 15, 2);
    push("evt_mobile_checkin", "Mobile Check-In", 75, 8, 2);
    push("evt_prod_review_submit", "Write a Product Review", 225, 23, 1);
    push("evt_mobile_checkin", "Mobile Check-In", 75, 8, 1);
    push("evt_mobile_checkin", "Mobile Check-In", 75, 8, 0.1);
    ledger.sort(function (a, b) { return new Date(a.ts) - new Date(b.ts); });

    var lifetimePoints = ledger.reduce(function (s, t) { return s + Math.max(0, t.pointsDelta); }, 0) + 6215; // headline round number incl. earlier history not itemised
    var credits = ledger.reduce(function (s, t) { return s + t.creditsDelta; }, 0) + 3271;

    return {
      user: KATY,
      lifetimePoints: 14000,
      spendableCredits: 3450,
      expiringCredits: 450,
      rollingPoints30: 2100,
      streak: { current: 5, longest: 45, lastCheckIn: new Date(Date.now() - 20 * 3600000).toISOString(), frozen: false, riskDeadline: null },
      unlockedAchievements: ["first_blood"],
      redeemedVouchers: [],
      ledger: ledger,
      actionCounts: {}
    };
  }

  function getState() {
    var st = readJSON(STATE_KEY, null);
    if (!st) { st = seedState(); writeJSON(STATE_KEY, st); }
    return st;
  }
  function setState(patch) {
    var st = Object.assign({}, getState(), patch);
    writeJSON(STATE_KEY, st);
    return st;
  }
  function resetDemo() {
    writeJSON(STATE_KEY, seedState());
    writeJSON(CONFIG_KEY, JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
    return getState();
  }

  /* --------------------------------------------------------- calculations */

  function getActionById(id) {
    return getConfig().actions.filter(function (a) { return a.id === id; })[0] || null;
  }

  function tierMultiplierFor(action, tier) {
    var cfg = getConfig();
    if (action && action.overrides && action.overrides[tier] != null) return action.overrides[tier];
    return (cfg.tierMultipliers[tier] != null) ? cfg.tierMultipliers[tier] : 1.0;
  }

  function dayKey(d) { var dt = d ? new Date(d) : new Date(); return dt.toISOString().slice(0, 10); }
  function weekKey(d) {
    var dt = d ? new Date(d) : new Date();
    var onejan = new Date(dt.getFullYear(), 0, 1);
    var week = Math.ceil((((dt - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return dt.getFullYear() + "-W" + week;
  }

  function getBadgeProgress(state) {
    state = state || getState();
    var levels = getConfig().levelBadges.slice().sort(function (a, b) { return a.threshold - b.threshold; });
    var current = null, next = null;
    for (var i = 0; i < levels.length; i++) {
      if (state.lifetimePoints >= levels[i].threshold) current = levels[i]; else { next = levels[i]; break; }
    }
    if (!next) next = null;
    var floor = current ? current.threshold : 0;
    var ceiling = next ? next.threshold : (current ? current.threshold : levels[0].threshold);
    var span = Math.max(1, ceiling - floor);
    var pct = next ? Math.max(0, Math.min(100, Math.round(((state.lifetimePoints - floor) / span) * 100))) : 100;
    return { current: current, next: next, pct: pct, remaining: next ? Math.max(0, next.threshold - state.lifetimePoints) : 0 };
  }

  /* --------------------------------------------------------- mutations */

  function completeAction(actionId, opts) {
    opts = opts || {};
    var action = getActionById(actionId);
    if (!action) return { ok: false, reason: "Unknown action." };
    if (!action.active) return { ok: false, reason: "Action is currently disabled." };

    var state = getState();
    var counts = state.actionCounts[actionId] || { day: null, dayCount: 0, week: null, weekCount: 0, lifetimeCount: 0, lastTs: 0 };
    var today = dayKey(), thisWeek = weekKey();
    if (counts.day !== today) { counts.day = today; counts.dayCount = 0; }
    if (counts.week !== thisWeek) { counts.week = thisWeek; counts.weekCount = 0; }

    var capped = false, capReason = "";
    var sinceLastMs = Date.now() - (counts.lastTs || 0);
    if (action.oneTimeLock && counts.lifetimeCount >= 1) { capped = true; capReason = "One-time action already completed."; }
    else if (action.lifetimeCap != null && counts.lifetimeCount >= action.lifetimeCap) { capped = true; capReason = "Lifetime cap reached."; }
    else if (action.dailyCap != null && counts.dayCount >= action.dailyCap) { capped = true; capReason = "Daily cap reached."; }
    else if (action.weeklyCap != null && counts.weekCount >= action.weeklyCap) { capped = true; capReason = "Weekly cap reached."; }
    else if (action.velocitySeconds && sinceLastMs < action.velocitySeconds * 1000) { capped = true; capReason = "Velocity cooldown active."; }

    var pointsAwarded = 0, creditsAwarded = 0, flags = null;
    if (capped) {
      flags = "CAP_REACHED";
    } else {
      var mult = tierMultiplierFor(action, state.user.membershipTier);
      pointsAwarded = Math.round(action.basePoints * mult);
      creditsAwarded = Math.round(pointsAwarded * getConfig().creditConversionRate);
      counts.dayCount += 1; counts.weekCount += 1; counts.lifetimeCount += 1; counts.lastTs = Date.now();
    }

    var txn = {
      id: uid("txn"), ts: nowIso(), actionId: actionId, label: action.label,
      pointsDelta: pointsAwarded, creditsDelta: creditsAwarded,
      guardrailFlags: flags, adminId: null, adjustmentReason: null
    };

    var newCounts = Object.assign({}, state.actionCounts); newCounts[actionId] = counts;
    var newLedger = state.ledger.concat([txn]);
    var newLifetime = state.lifetimePoints + Math.max(0, pointsAwarded);
    var newCredits = state.spendableCredits + creditsAwarded;
    var newRolling = state.rollingPoints30 + Math.max(0, pointsAwarded);

    var prevBadge = getBadgeProgress(state).current;
    var patchedState = setState({
      lifetimePoints: newLifetime, spendableCredits: newCredits, rollingPoints30: newRolling,
      ledger: newLedger, actionCounts: newCounts
    });

    // streak nudge for check-in style actions
    if (actionId === "evt_mobile_checkin") checkIn();

    // achievement + level-up detection
    var newBadge = getBadgeProgress(patchedState).current;
    var leveledUp = newBadge && (!prevBadge || newBadge.key !== prevBadge.key);
    var newlyUnlocked = evaluateAchievements(patchedState);

    return {
      ok: true, capped: capped, capReason: capped ? capReason : null,
      pointsAwarded: pointsAwarded, creditsAwarded: creditsAwarded, txn: txn,
      leveledUp: !!leveledUp, newLevel: leveledUp ? newBadge : null,
      newlyUnlockedAchievements: newlyUnlocked
    };
  }

  function evaluateAchievements(state) {
    state = state || getState();
    var cfg = getConfig();
    var unlocked = state.unlockedAchievements.slice();
    var newly = [];
    cfg.achievementBadges.forEach(function (b) {
      if (unlocked.indexOf(b.key) !== -1) return;
      var c = b.criteria, met = false;
      if (c.type === "actionCount") {
        var count = state.ledger.filter(function (t) { return t.pointsDelta > 0 && (c.actionId ? t.actionId === c.actionId : true); }).length;
        met = count >= c.count;
      } else if (c.type === "redeemCount") {
        met = state.redeemedVouchers.length >= c.count;
      } else if (c.type === "streak") {
        met = state.streak.longest >= c.count || state.streak.current >= c.count;
      }
      if (met) { unlocked.push(b.key); newly.push(b); }
    });
    if (newly.length) setState({ unlockedAchievements: unlocked });
    return newly;
  }

  function redeemItem(itemId) {
    var item = getConfig().storeItems.filter(function (i) { return i.id === itemId; })[0];
    if (!item) return { ok: false, reason: "Item not found." };
    var state = getState();
    if (state.spendableCredits < item.cost) return { ok: false, reason: "Not enough Spendable Credits." };
    if (item.inventory != null && item.inventory <= 0) return { ok: false, reason: "Out of stock." };

    var code = "PF-" + item.id.slice(0, 3).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    var txn = { id: uid("txn"), ts: nowIso(), actionId: "redeem:" + itemId, label: "Redeemed: " + item.name, pointsDelta: 0, creditsDelta: -item.cost, guardrailFlags: null, adminId: null, adjustmentReason: null };
    var voucher = { code: code, itemId: itemId, itemName: item.name, redeemedAt: nowIso() };

    var newState = setState({
      spendableCredits: state.spendableCredits - item.cost,
      ledger: state.ledger.concat([txn]),
      redeemedVouchers: state.redeemedVouchers.concat([voucher])
    });

    if (item.inventory != null) {
      var cfg = getConfig();
      var items = cfg.storeItems.map(function (i) { return i.id === itemId ? Object.assign({}, i, { inventory: i.inventory - 1 }) : i; });
      setStoreItems(items);
    }

    var newlyUnlocked = evaluateAchievements(newState);
    return { ok: true, voucher: voucher, txn: txn, newlyUnlockedAchievements: newlyUnlocked };
  }

  function manualAdjust(opts) {
    opts = opts || {};
    var type = opts.type; // 'add_points' | 'deduct_points' | 'add_credits' | 'deduct_credits'
    var amount = Math.abs(Number(opts.amount) || 0);
    var reason = (opts.reason || "").trim();
    var adminId = opts.adminId || "admin_drtim";
    if (!amount) return { ok: false, reason: "Amount must be greater than 0." };
    if (!reason) return { ok: false, reason: "Adjustment reason is required for audit logging." };

    var state = getState();
    var pointsDelta = 0, creditsDelta = 0;
    if (type === "add_points") pointsDelta = amount;
    else if (type === "deduct_points") pointsDelta = -amount;
    else if (type === "add_credits") creditsDelta = amount;
    else if (type === "deduct_credits") creditsDelta = -amount;
    else return { ok: false, reason: "Unknown adjustment type." };

    var txn = {
      id: uid("txn"), ts: nowIso(), actionId: null, label: "Manual adjustment",
      pointsDelta: pointsDelta, creditsDelta: creditsDelta, guardrailFlags: null,
      adminId: adminId, adjustmentReason: reason
    };

    return { ok: true, txn: txn, newState: setState({
      lifetimePoints: Math.max(0, state.lifetimePoints + pointsDelta),
      spendableCredits: Math.max(0, state.spendableCredits + creditsDelta),
      ledger: state.ledger.concat([txn])
    }) };
  }

  function checkIn() {
    var state = getState();
    var last = state.streak.lastCheckIn ? new Date(state.streak.lastCheckIn) : null;
    var hoursSince = last ? (Date.now() - last.getTime()) / 3600000 : 999;
    var current = state.streak.current;
    if (hoursSince > 48) current = 1; else if (hoursSince > 12) current = current + 1; // else same-day, no increment
    var longest = Math.max(state.streak.longest, current);
    return setState({ streak: Object.assign({}, state.streak, { current: current, longest: longest, lastCheckIn: nowIso(), riskDeadline: null }) });
  }

  function setStreakAtRisk(hoursFromNow) {
    var state = getState();
    var deadline = new Date(Date.now() + (hoursFromNow || 6) * 3600000).toISOString();
    return setState({ streak: Object.assign({}, state.streak, { riskDeadline: deadline }) });
  }

  function freezeStreak(days) {
    var state = getState();
    return setState({ streak: Object.assign({}, state.streak, { frozen: true, frozenUntil: new Date(Date.now() + (days || 2) * 86400000).toISOString(), riskDeadline: null }) });
  }

  function spendCreditsToFreezeStreak() {
    var state = getState();
    var cost = getConfig().streakFreezeCost;
    if (state.spendableCredits < cost) return { ok: false, reason: "Not enough credits to freeze streak." };
    var txn = { id: uid("txn"), ts: nowIso(), actionId: "streak_freeze_purchase", label: "Streak Freeze (self-serve)", pointsDelta: 0, creditsDelta: -cost, guardrailFlags: null, adminId: null, adjustmentReason: null };
    setState({ spendableCredits: state.spendableCredits - cost, ledger: state.ledger.concat([txn]) });
    freezeStreak(2);
    return { ok: true };
  }

  function restoreBrokenStreak(days) {
    var state = getState();
    return setState({ streak: Object.assign({}, state.streak, { current: days || state.streak.longest, riskDeadline: null }) });
  }

  function formatNumber(n) { return Math.round(n).toLocaleString("en-GB"); }

  window.PFLoyalty = {
    TIER_KEYS: TIER_KEYS,
    MOCK_DIRECTORY: MOCK_DIRECTORY,
    getConfig: getConfig, setConfig: setConfig,
    upsertAction: upsertAction, setTierMultipliers: setTierMultipliers,
    setStoreItems: setStoreItems, upsertStoreItem: upsertStoreItem,
    setAchievementBadges: setAchievementBadges, setLevelBadges: setLevelBadges,
    setLeaderboardPrizes: setLeaderboardPrizes,
    getState: getState, setState: setState, resetDemo: resetDemo,
    getActionById: getActionById, tierMultiplierFor: tierMultiplierFor,
    getBadgeProgress: getBadgeProgress,
    completeAction: completeAction, redeemItem: redeemItem, manualAdjust: manualAdjust,
    checkIn: checkIn, setStreakAtRisk: setStreakAtRisk, freezeStreak: freezeStreak,
    spendCreditsToFreezeStreak: spendCreditsToFreezeStreak, restoreBrokenStreak: restoreBrokenStreak,
    evaluateAchievements: evaluateAchievements,
    formatNumber: formatNumber
  };
})();
