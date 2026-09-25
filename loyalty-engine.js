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

  var TIER_KEYS = ["Basic", "Confidence", "Mastery", "Freedom", "Sovereign"];

  /* ------------------------------------------------------------ defaults */

  /* Ways to Earn catalog — the points matrix v2.1 (2026-09-22). Each row
     carries the Reward UI it fires (see reward-router.js KINDS):
       indicator    Points Indicator — the "+N" float, pill count-up, coin chime
       streak       Streak Screen   — the "Welcome back · Day N in a row" takeover
       goalReached  Goal Reached    — DailyGoal.html at the day's ladder marks
       rewardSplash Reward Splash   — 2.5s in-page overlay
       major        Major Celebration Splash — full-page, one big reward
       combined     Combined Celebration — full-page, several rewards
     status: live | partial | planned — whether the earn site exists yet. */
  var ALL = ["web", "ios", "android"], WEB = ["web"], MOBILE = ["ios", "android"];
  function act(id, label, category, basePoints, celebration, platforms, o) {
    return Object.assign({ id: id, label: label, category: category, basePoints: basePoints, celebration: celebration, platforms: platforms,
      dailyCap: null, weeklyCap: null, lifetimeCap: null, velocitySeconds: 0, minCharacters: 0, requiresMedia: false, requiresApproval: false,
      holdDays: 0, active: true, oneTimeLock: false, guardrail: "", linkedReward: null, status: "planned" }, o || {});
  }
  var DEFAULT_ACTIONS = [
    /* Onboarding */
    act("evt_signup", "Sign Up / Create Account", "Onboarding", 100, "rewardSplash", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Unique device/email; max 1 per lifetime account. Award on completed account creation, not on starting the form." }),
    act("evt_virtual_tour", "Complete Virtual Tour", "Onboarding", 100, "rewardSplash", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Max 1 per lifetime account." }),
    act("evt_onboarding_checklist", "Complete Onboarding Checklist", "Onboarding", 120, "rewardSplash", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Lifetime-locked once all steps are done." }),
    act("evt_verify_email", "Verify Email Address", "Onboarding", 50, "indicator", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Lifetime-locked; awarded on verification-link click, not on send." }),
    act("evt_notification_prefs", "Set Notification Preferences", "Onboarding", 20, "indicator", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Lifetime-locked; edits award 0." }),
    /* Profile */
    act("evt_profile_picture", "Add Profile Picture", "Profile", 50, "indicator", ALL, { oneTimeLock: true, lifetimeCap: 1, requiresMedia: true, guardrail: "Editing the photo later awards 0." }),
    act("evt_professional_title", "Add Professional Title / Headline", "Profile", 40, "indicator", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Lifetime-locked." }),
    act("evt_languages", "Add Languages Spoken", "Profile", 40, "indicator", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Lifetime-locked." }),
    act("evt_social_links", "Add Social Links", "Profile", 50, "indicator", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Lifetime-locked." }),
    act("evt_services_offered", "List Services Offered", "Profile", 60, "indicator", WEB, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Must populate at least 3 distinct services." }),
    act("evt_bio_write", "Write Bio / About", "Profile", 60, "indicator", WEB, { dailyCap: 1, weeklyCap: 3, minCharacters: 100, status: "live", guardrail: "100-character floor + duplicate-text check." }),
    act("evt_clinic_location", "Add Clinic / Location", "Profile", 40, "indicator", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Lifetime-locked." }),
    act("evt_profile_complete", "Complete Profile 100%", "Profile", 200, "rewardSplash", WEB, { oneTimeLock: true, lifetimeCap: 1, status: "live", guardrail: "All foundational fields + avatar populated. One-time lock upon completion." }),
    /* Credentials */
    act("evt_license_verify", "Verify Medical License", "Credentials", 500, "rewardSplash", WEB, { oneTimeLock: true, lifetimeCap: 1, requiresMedia: true, requiresApproval: true, holdDays: 1, status: "live", guardrail: "Manual admin review or API validation required." }),
    act("evt_certification_add", "Add Certification / Qualification", "Credentials", 80, "indicator", WEB, { lifetimeCap: 5, requiresMedia: true, guardrail: "Document upload + dedup check. Max 5 lifetime." }),
    act("evt_registry_connect", "Connect Professional Registry ID", "Credentials", 160, "indicator", WEB, { oneTimeLock: true, lifetimeCap: 1, guardrail: "External registry validation." }),
    /* Feed (Admin Posts) */
    act("evt_react_admin_post", "React to Admin Post", "Feed (Admin Posts)", 10, "indicator", MOBILE, { dailyCap: 10, velocitySeconds: 3, status: "partial", guardrail: "Min 3s between reactions." }),
    act("evt_comment_admin_post", "Comment on Admin Post", "Feed (Admin Posts)", 10, "indicator", ALL, { dailyCap: 3, minCharacters: 15, status: "partial", guardrail: "Comment >15 chars; copy-paste blocks score 0." }),
    act("evt_share_admin_post", "Share Admin Post", "Feed (Admin Posts)", 20, "indicator", ALL, { dailyCap: 2, guardrail: "Same target shared once per day." }),
    /* Community */
    act("evt_create_post", "Create a Community Post", "Community", 20, "indicator", ALL, { dailyCap: 3, minCharacters: 15, status: "partial", guardrail: "Min length + dedup check." }),
    act("evt_clinical_media_post", "Post a Clinical Photo / Video", "Community", 40, "indicator", ALL, { dailyCap: 2, requiresMedia: true, guardrail: "Media hash dedup; re-upload scores 0." }),
    act("evt_case_study_share", "Share a Clinical Case Study", "Community", 150, "rewardSplash", WEB, { weeklyCap: 1, requiresMedia: true, status: "live", guardrail: "Dedup check; re-uploading a deleted file = 0.", linkedReward: "badge:community_pillar" }),
    act("evt_react_post", "React to a Community Post", "Community", 10, "indicator", MOBILE, { dailyCap: 30, velocitySeconds: 3, status: "live", guardrail: "Max 30/day; minimum 3s between reactions." }),
    act("evt_comment_post", "Reply to a Discussion", "Community", 10, "indicator", ALL, { dailyCap: 5, velocitySeconds: 120, minCharacters: 15, status: "partial", guardrail: "2-min cooling-off between scored replies." }),
    act("evt_share_post", "Share a Post", "Community", 25, "indicator", ALL, { dailyCap: 10, velocitySeconds: 10, status: "live", guardrail: "Max 10 reshares a day; 10-second cooldown." }),
    act("evt_likes_10", "Receive 10 Likes on a Post", "Community", 50, "rewardSplash", ALL, { guardrail: "Organic check; self-account likes excluded." }),
    act("evt_likes_50", "Receive 50 Likes on a Post", "Community", 150, "rewardSplash", ALL, { guardrail: "Organic check; self-account likes excluded." }),
    act("evt_best_answer", "Answer Marked Best Answer", "Community", 60, "indicator", ALL, { dailyCap: 1, guardrail: "Admin/OP-designated only." }),
    act("evt_join_community", "Join a Community", "Community", 20, "indicator", ALL, { lifetimeCap: 3, guardrail: "Lifetime cap of 3 awards." }),
    act("evt_receive_comment", "Receive a Comment", "Community", 5, "indicator", ALL, { guardrail: "No cap in spec — recommend a daily cap + self-account exclusion." }),
    act("evt_receive_share", "Receive a Share", "Community", 10, "indicator", ALL, { guardrail: "No cap in spec — recommend a daily cap + self-account exclusion." }),
    act("evt_mention_user", "Mention a User", "Community", 5, "indicator", ALL, { dailyCap: 5, guardrail: "Reciprocal-spam and self-mention excluded." }),
    act("evt_get_mentioned", "Get Mentioned", "Community", 5, "indicator", ALL, { guardrail: "No cap in spec — recommend a daily cap + self-account exclusion." }),
    /* Learning */
    act("evt_module_complete", "Complete a Module", "Learning", 10, "indicator", WEB, { dailyCap: 5, guardrail: "Time-on-page >= 60% of average reading speed." }),
    act("evt_course_complete", "Complete a Full Course", "Learning", 200, "rewardSplash", WEB, { status: "live", guardrail: "All modules + assessment passed." }),
    act("evt_first_certificate", "Earn First Certificate", "Learning", 400, "rewardSplash", WEB, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Triggered on assessment success." }),
    act("evt_course_quiz_100", "Achieve 100% on Course Quiz", "Learning", 40, "indicator", WEB, { dailyCap: 2, guardrail: "First attempt only." }),
    /* Events */
    act("evt_event_register", "Register for an Event", "Events", 20, "indicator", ALL, { weeklyCap: 5, guardrail: "No-show forfeits attendance points." }),
    act("evt_webinar_attend", "Attend a Live Webinar / Event", "Events", 100, "indicator", ALL, { status: "live", guardrail: "Verified check-in / attendance duration >= 60% of session." }),
    act("evt_conference_attend", "Attend Annual Conference", "Events", 500, "major", ALL, { guardrail: "Validated ticket / on-site check-in." }),
    act("evt_event_speak", "Speak / Host at an Event", "Events", 300, "rewardSplash", WEB, { requiresApproval: true, guardrail: "Manual admin approval." }),
    act("evt_event_feedback", "Submit Post-Event Feedback", "Events", 20, "indicator", ALL, { guardrail: "One scored response per event." }),
    /* Cross-Platform */
    act("evt_first_mobile_login", "First Mobile App Log-In", "Cross-Platform", 200, "rewardSplash", MOBILE, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Device-ID mapping prevents multi-account farming." }),
    act("evt_daily_login", "Daily App Login (Web or Mobile)", "Cross-Platform", 10, "streak", ALL, { dailyCap: 1, guardrail: "One scored login per calendar day; distinct from First Mobile App Log-In and the check-in streak." }),
    act("evt_omnichannel_week", "Omnichannel Week", "Cross-Platform", 50, "indicator", ALL, { weeklyCap: 1, guardrail: ">= 1 web + >= 1 mobile session within 7 days." }),
    act("evt_push_enable", "Enable Push Notifications", "Cross-Platform", 20, "indicator", MOBILE, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Lifetime-locked." }),
    /* Social Growth & Referral */
    act("evt_refer_colleague", "Refer a Colleague Who Joins", "Social Growth & Referral", 200, "rewardSplash", ALL, { holdDays: 2, status: "live", guardrail: "Max 10 per month. Unique device/email fraud screen." }),
    act("evt_referee_verified", "Referred Colleague Verifies License", "Social Growth & Referral", 150, "rewardSplash", WEB, { guardrail: "Awarded only after the referee passes verification." }),
    act("evt_follow_peer", "Follow / Connect with a Peer", "Social Growth & Referral", 10, "indicator", ALL, { dailyCap: 10, guardrail: "Reciprocal-spam and self-follow excluded." }),
    /* Streaks */
    act("evt_mobile_checkin", "Daily Mobile Check-In Streak", "Streaks", 50, "streak", MOBILE, { dailyCap: 1, weeklyCap: 7, status: "partial", guardrail: "Per 5 consecutive days. Resets to 0 if midnight passes with no mobile open." }),
    act("evt_learning_streak", "Continuous Learning Streak", "Streaks", 100, "streak", WEB, { weeklyCap: 1, guardrail: ">= 1 completed module/day for 3 days within a week." }),
    act("evt_streak_7", "7-Day Streak Milestone", "Streaks", 100, "streak", ALL, { weeklyCap: 1, guardrail: "Awarded once per unbroken 7-day activity streak." }),
    act("evt_streak_30", "30-Day Streak Milestone", "Streaks", 500, "streak", ALL, { guardrail: "Awarded once per unbroken 30-day activity streak." }),
    act("evt_streak_365", "365-Day Streak Milestone", "Streaks", 5000, "major", ALL, { guardrail: "Awarded once per unbroken 365-day activity streak." }),
    /* Follower Milestones */
    act("evt_followers_10", "Reach 10 Followers", "Follower Milestones", 100, "rewardSplash", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Organic check; self-follow and bot accounts excluded." }),
    act("evt_followers_100", "Reach 100 Followers", "Follower Milestones", 500, "rewardSplash", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Organic check; self-follow and bot accounts excluded." }),
    act("evt_followers_1000", "Reach 1,000 Followers", "Follower Milestones", 2000, "rewardSplash", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Organic check; self-follow and bot accounts excluded." }),
    act("evt_followers_10000", "Reach 10,000 Followers", "Follower Milestones", 10000, "major", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Organic check; self-follow and bot accounts excluded." }),
    act("evt_followers_100000", "Reach 100,000 Followers", "Follower Milestones", 50000, "major", ALL, { oneTimeLock: true, lifetimeCap: 1, guardrail: "Organic check; self-follow and bot accounts excluded." }),
    /* Reviews / Purchases (live in prototype, kept from v2.0) */
    act("evt_prod_review_submit", "Write a Product Review", "Reviews", 150, "indicator", ALL, { dailyCap: 3, weeklyCap: 10, velocitySeconds: 600, minCharacters: 50, status: "live", guardrail: "Max 1 completion per 10 minutes; 50-character floor.", linkedReward: "badge:master_reviewer" }),
    act("evt_purchase_item", "Purchase Item", "Purchases", 300, "indicator", ALL, { status: "live", guardrail: "Points processed strictly server-side from order total." })
  ];
  /* bump when DEFAULT_ACTIONS changes so a cached config re-seeds the rows
     that come from the matrix (a member's own switched-off state is kept;
     actions an admin added by hand stay untouched) */
  var ACTIONS_CATALOG_VERSION = 3;

  var DEFAULT_TIER_MULTIPLIERS = { Basic: 1.0, Confidence: 1.5, Mastery: 2.0, Freedom: 3.0, Sovereign: 4.5 };

  var DEFAULT_LEVEL_BADGES = [
    { key: "bronze", name: "Bronze", threshold: 2000, color: "#b06a3a", celebration: "rewardSplash" },
    { key: "silver", name: "Silver", threshold: 5000, color: "#8a94a6", celebration: "rewardSplash" },
    { key: "gold", name: "Gold", threshold: 10000, color: "#e2a300", celebration: "rewardSplash" },
    { key: "platinum", name: "Platinum", threshold: 20000, color: "#5b6b8c", celebration: "rewardSplash" },
    { key: "diamond", name: "Diamond", threshold: 50000, color: "#3f8fd1", celebration: "major", splashTitle: "Sapphire Collector", splashPerks: ["2.0x permanent multiplier", "VIP Store Access", "Monthly Bonus Box"] }
  ];

  /* Milestone Path: ONE linear journey every member walks along the same
     Lifetime Points balance as the Level Badges above. Since 2026-09-24 the
     milestones ARE the six league badges (league-engine.js): Jade → Topaz →
     Ruby → Emerald → Amethyst → Sapphire, so the league a member holds and
     "how far to the next league" are read straight off these thresholds
     (PFLeague matches by `key`). Each milestone's `benefits` unlock
     automatically and permanently the instant lifetimePoints crosses
     `threshold` — nothing to choose, nothing to redeem, and points never get
     spent so nothing here locks back up. */
  var DEFAULT_MILESTONE_PATH = [
    { key: "jade", name: "Jade", threshold: 0, benefits: [
      { title: "Jade League Leaderboard", description: "Your starting league. Compete with fellow newcomers on the Jade board and start banking points from day one.", delivery: "Active from your first check-in" }
    ] },
    { key: "topaz", name: "Topaz", threshold: 1500, benefits: [
      { title: "Aesthetic Clinical Tools Bundle", description: "Premium procedural video sets and clinical intake templates, unlocked in your account.", delivery: "Instant digital unlock" }
    ] },
    { key: "ruby", name: "Ruby", threshold: 6000, benefits: [
      { title: "Course Credit — up to £250", description: "Applied automatically toward any course in the PROfinity catalogue.", delivery: "Voucher code, redeemable at checkout" },
      { title: "Priority Directory Placement (30 days)", description: "Your profile is boosted to the top of the Clinician Directory for 30 days.", delivery: "Applied automatically to your profile" }
    ] },
    { key: "emerald", name: "Emerald", threshold: 15000, benefits: [
      { title: "Permanent 10% Discount", description: "10% off every course and product in the PROfinity catalogue, for good.", delivery: "Applied automatically at checkout" },
      { title: "1-on-1 Personal Mentorship Session", description: "A 45-minute clinical or business consulting session with leadership.", delivery: "Calendar booking link" }
    ] },
    { key: "amethyst", name: "Amethyst", threshold: 30000, benefits: [
      { title: "Course Credit — up to £1,000", description: "Applied automatically toward any course, bundle, or certification in the PROfinity catalogue.", delivery: "Voucher code, redeemable at checkout" }
    ] },
    { key: "sapphire", name: "Sapphire", threshold: 60000, benefits: [
      { title: "Dinner with Dr Tim Pearce", description: "An exclusive dining and mentorship experience with the platform founder. Subject to quarterly availability.", delivery: "Concierge booking" },
      { title: "Exclusive Event Seat", description: "Priority VIP seating at a live aesthetic workshop or the annual conference.", delivery: "E-ticket via email" }
    ] }
  ];
  /* bump when DEFAULT_MILESTONE_PATH changes shape so a member's cached
     config is re-seeded (admin edits made after that still stick) */
  var MILESTONE_PATH_VERSION = 2;

  var DEFAULT_ACHIEVEMENT_BADGES = [
    { key: "first_blood", name: "First Blood", icon: "lucide:zap", description: "Complete your very first point-earning action.", criteria: { type: "actionCount", actionId: null, count: 1 }, reward: "50 bonus credits" },
    { key: "high_roller", name: "High Roller", icon: "lucide:gem", description: "Complete 3 courses end to end.", criteria: { type: "actionCount", actionId: "evt_course_complete", count: 3 }, reward: "2x multiplier for 7 days" },
    { key: "streak_master", name: "Streak Master", icon: "lucide:flame", description: "Reach a 30-day check-in streak.", criteria: { type: "streak", count: 30 }, reward: "1.5x multiplier for 7 days" },
    { key: "community_pillar", name: "Community Pillar", icon: "lucide:users", description: "Share 10 case studies with the community.", criteria: { type: "actionCount", actionId: "evt_case_study_share", count: 10 }, reward: "Featured Clinician spotlight" },
    { key: "master_reviewer", name: "Master Reviewer", icon: "lucide:star", description: "Write 10 product reviews.", criteria: { type: "actionCount", actionId: "evt_prod_review_submit", count: 10 }, reward: "5,000 bonus credits + 2x multiplier" }
  ];

  /* Every reward is a discount on a specific course. `image` is the same
     thumbnail the course cards use (allcourses-confidence / lesson-confidence)
     and `course.slug` matches CourseCheckout.html?course=<slug>. */
  var DEFAULT_STORE_ITEMS = [
    { id: "disc_temple_filler", name: "Temple Filler", description: "Restore temple volume safely with cannula and needle approaches.", cost: 1200, category: "Filler", image: "assets/course-temple-filler.webp", inventory: null, delivery: "Applied automatically at checkout",
      course: { slug: "temple-filler", title: "Temple Filler", price: 342, discountPct: 20 } },
    { id: "disc_advanced_lip", name: "Advanced Lip Techniques", description: "Layered volume, borders and perioral balance built on 8D.", cost: 1800, category: "Lips", image: "assets/course-advanced-lip-techniques.jpg", inventory: 20, delivery: "Applied automatically at checkout",
      course: { slug: "advanced-lip-techniques", title: "Advanced Lip Techniques", price: 342, discountPct: 25 } },
    { id: "disc_complications", name: "Complications Management", description: "Recognise, prevent and manage vascular and other complications.", cost: 3800, category: "Safety", image: "assets/course-complications.jpg", inventory: null, delivery: "Applied automatically at checkout",
      course: { slug: "complications-management", title: "Complications Management", price: 450, discountPct: 30 } },
    { id: "disc_cheek_contouring", name: "Cheek Contouring", description: "Midface support, projection and natural-looking lift.", cost: 1000, category: "Filler", image: "assets/course-cheek-contouring.jpg", inventory: null, delivery: "Applied automatically at checkout",
      course: { slug: "cheek-contouring", title: "Cheek Contouring", price: 246, discountPct: 20 } },
    { id: "disc_jawline", name: "Jawline Sculpting", description: "Define the mandibular border and chin with structural filler.", cost: 1200, category: "Filler", image: "assets/course-jawline-sculpting.jpg", inventory: null, delivery: "Applied automatically at checkout",
      course: { slug: "jawline-sculpting", title: "Jawline Sculpting", price: 294, discountPct: 20 } },
    { id: "disc_tear_trough", name: "Tear Trough Treatment", description: "Assess, select and treat the infraorbital hollow safely.", cost: 900, category: "Filler", image: "assets/course-tear-trough.jpg", inventory: null, delivery: "Applied automatically at checkout",
      course: { slug: "tear-trough-treatment", title: "Tear Trough Treatment", price: 342, discountPct: 15 } },
    { id: "disc_full_face", name: "Full Face Rejuvenation", description: "The complete assessment-to-treatment masterclass across every region.", cost: 5500, category: "Masterclass", image: "assets/course-full-face-rejuvenation.jpg", inventory: 5, delivery: "Applied automatically at checkout",
      course: { slug: "full-face-rejuvenation", title: "Full Face Rejuvenation", price: 480, discountPct: 40 } },
    { id: "disc_membership", name: "PROfinity Membership", description: "A year of Mastery access, live mentoring and every course included.", cost: 4000, category: "Membership", image: "assets/course-membership-banner.jpg", inventory: null, delivery: "Applied automatically at checkout",
      course: { slug: "profinity-membership", title: "PROfinity Membership", price: 199, discountPct: 10 } }
  ];
  /* bump when DEFAULT_STORE_ITEMS changes shape so a member's cached config
     picks up the new catalog (admin edits made after that still stick) */
  var STORE_CATALOG_VERSION = 2;
  var COURSE_DISCOUNTS_KEY = "pf-course-discounts";

  var DEFAULT_LEADERBOARD_PRIZES = [
    { rank: "1", prize: "1:1 Mentorship with Dr Tim Pearce" },
    { rank: "2–3", prize: "Exclusive Special Event Seat" },
    { rank: "4–15", prize: "500 bonus points" }
  ];

  var DEFAULT_CONFIG = {
    creditConversionRate: 0.10,
    weeklyPointsTarget: 500,   // Mon–Sun points goal (getWeekPoints); no longer drives the beaker
    beakerFullPoints: 20000,   // lifetime points at which the beaker mascot (header pill, Rewards card) reads full
    creditExpiryMonths: 12,
    streakFreezeCost: 500,
    tierMultipliers: DEFAULT_TIER_MULTIPLIERS,
    actions: DEFAULT_ACTIONS,
    levelBadges: DEFAULT_LEVEL_BADGES,
    milestonePath: DEFAULT_MILESTONE_PATH,
    milestonePathVersion: MILESTONE_PATH_VERSION,
    achievementBadges: DEFAULT_ACHIEVEMENT_BADGES,
    storeItems: DEFAULT_STORE_ITEMS,
    storeCatalogVersion: STORE_CATALOG_VERSION,
    actionsCatalogVersion: ACTIONS_CATALOG_VERSION,
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
    // a cached config from before the store became course discounts still
    // holds the old catalog — swap it for the current defaults once
    if (cfg.storeCatalogVersion !== STORE_CATALOG_VERSION) {
      cfg = Object.assign({}, cfg, { storeItems: JSON.parse(JSON.stringify(DEFAULT_STORE_ITEMS)), storeCatalogVersion: STORE_CATALOG_VERSION });
      writeJSON(CONFIG_KEY, cfg);
    }
    // the Milestone Path became the six league badges: re-seed it once
    if (cfg.milestonePathVersion !== MILESTONE_PATH_VERSION) {
      cfg = Object.assign({}, cfg, { milestonePath: JSON.parse(JSON.stringify(DEFAULT_MILESTONE_PATH)), milestonePathVersion: MILESTONE_PATH_VERSION });
      writeJSON(CONFIG_KEY, cfg);
    }
    // the points matrix moved on: re-seed every default row (keeping the
    // member's switched-off state), leave hand-added actions alone
    if (cfg.actionsCatalogVersion !== ACTIONS_CATALOG_VERSION) {
      var byId = {};
      (cfg.actions || []).forEach(function (a) { if (a && a.id) byId[a.id] = a; });
      var reseeded = DEFAULT_ACTIONS.map(function (d) {
        var prev = byId[d.id]; var row = JSON.parse(JSON.stringify(d));
        if (prev && prev.active === false) row.active = false;
        return row;
      });
      var defaultIds = DEFAULT_ACTIONS.map(function (d) { return d.id; });
      var custom = (cfg.actions || []).filter(function (a) { return a && a.id && defaultIds.indexOf(a.id) < 0; })
        .map(function (a) { return a.celebration ? a : Object.assign({}, a, { celebration: "indicator" }); });
      cfg = Object.assign({}, cfg, { actions: reseeded.concat(custom), actionsCatalogVersion: ACTIONS_CATALOG_VERSION,
        tierMultipliers: Object.assign({}, DEFAULT_TIER_MULTIPLIERS, cfg.tierMultipliers || {}),
        levelBadges: (cfg.levelBadges || DEFAULT_LEVEL_BADGES).map(function (b) {
          var d = DEFAULT_LEVEL_BADGES.filter(function (x) { return x.key === b.key; })[0];
          return d ? Object.assign({}, b, { threshold: d.threshold, celebration: d.celebration }) : b;
        }) });
      writeJSON(CONFIG_KEY, cfg);
    }
    // actions added after a user's config was first seeded (e.g. Share a
    // Post) get appended so Ways to Earn and the ledger know about them
    if (Array.isArray(cfg.actions)) {
      var have = cfg.actions.map(function (a) { return a && a.id; });
      var missing = DEFAULT_ACTIONS.filter(function (a) { return have.indexOf(a.id) < 0; });
      if (missing.length) { cfg = Object.assign({}, cfg, { actions: cfg.actions.concat(JSON.parse(JSON.stringify(missing))) }); writeJSON(CONFIG_KEY, cfg); }
    }
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
  function setMilestonePath(list) { return setConfig({ milestonePath: list }); }
  function upsertMilestone(milestone) {
    var cfg = getConfig();
    var list = (cfg.milestonePath || []).slice();
    var idx = list.findIndex(function (m) { return m.key === milestone.key; });
    if (idx >= 0) list[idx] = Object.assign({}, list[idx], milestone); else list.push(milestone);
    return setMilestonePath(list);
  }

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
      // Katy sits at 14,000 pts: Jade (0), Topaz (1,500) and Ruby (6,000) already passed — 1,000 pts short of Emerald
      milestonesReachedAt: { jade: new Date(Date.now() - 120 * 86400000).toISOString(), topaz: new Date(Date.now() - 62 * 86400000).toISOString(), ruby: new Date(Date.now() - 11 * 86400000).toISOString() },
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
  /* a brand-new member: zero points, no streak, empty ledger — Jade League.
     Used by the dashboards' "new member view" demo (?new=1). */
  function newMemberState() {
    return {
      user: KATY, lifetimePoints: 0, spendableCredits: 0, expiringCredits: 0, rollingPoints30: 0,
      streak: { current: 0, longest: 0, lastCheckIn: null, frozen: false, riskDeadline: null },
      unlockedAchievements: [], milestonesReachedAt: {}, redeemedVouchers: [], ledger: [], actionCounts: {}
    };
  }
  function resetNewMember() { writeJSON(STATE_KEY, newMemberState()); return getState(); }

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

  /* Milestone Path progress — same Lifetime Points balance, separate ladder
     and naming from Level Badges. `passed` is every milestone at or below the
     member's current points (i.e. every benefit bundle they already hold). */
  function getMilestoneProgress(state) {
    state = state || getState();
    var path = (getConfig().milestonePath || []).slice().sort(function (a, b) { return a.threshold - b.threshold; });
    var pts = state.lifetimePoints || 0;
    var current = null, next = null;
    for (var i = 0; i < path.length; i++) {
      if (pts >= path[i].threshold) current = path[i]; else { next = path[i]; break; }
    }
    var floor = current ? current.threshold : 0;
    var ceiling = next ? next.threshold : (current ? current.threshold : (path[0] ? path[0].threshold : 1));
    var span = Math.max(1, ceiling - floor);
    var pct = next ? Math.max(0, Math.min(100, Math.round(((pts - floor) / span) * 100))) : 100;
    var passed = path.filter(function (m) { return pts >= m.threshold; });
    return { current: current, next: next, pct: pct, remaining: next ? Math.max(0, next.threshold - pts) : 0, passed: passed, path: path };
  }

  /* Records any Milestone Path entries newly crossed between `beforePoints`
     and `afterState.lifetimePoints` (timestamped for a future Milestone
     Unlocked moment) and returns them in threshold order. */
  function detectAndRecordMilestones(beforePoints, afterState) {
    var path = getConfig().milestonePath || [];
    var reached = Object.assign({}, afterState.milestonesReachedAt || {});
    var newly = [];
    path.forEach(function (m) {
      if (afterState.lifetimePoints >= m.threshold && beforePoints < m.threshold) { reached[m.key] = nowIso(); newly.push(m); }
    });
    if (newly.length) {
      setState({ milestonesReachedAt: reached });
      try { window.dispatchEvent(new CustomEvent("pf:milestone-reached", { detail: { milestones: newly } })); } catch (e) { /* older WebView */ }
    }
    newly.sort(function (a, b) { return a.threshold - b.threshold; });
    return newly;
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
    var newlyReachedMilestones = detectAndRecordMilestones(state.lifetimePoints, patchedState);

    return {
      ok: true, capped: capped, capReason: capped ? capReason : null,
      pointsAwarded: pointsAwarded, creditsAwarded: creditsAwarded, txn: txn,
      leveledUp: !!leveledUp, newLevel: leveledUp ? newBadge : null,
      newlyUnlockedAchievements: newlyUnlocked, newlyReachedMilestones: newlyReachedMilestones
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
    var voucher = { code: code, itemId: itemId, itemName: item.name, redeemedAt: nowIso(), course: item.course || null };
    if (item.course && item.course.slug) {
      var discounts = readJSON(COURSE_DISCOUNTS_KEY, {});
      discounts[item.course.slug] = { pct: item.course.discountPct, code: code, itemName: item.name, redeemedAt: voucher.redeemedAt };
      writeJSON(COURSE_DISCOUNTS_KEY, discounts);
    }

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

    var newState = setState({
      lifetimePoints: Math.max(0, state.lifetimePoints + pointsDelta),
      spendableCredits: Math.max(0, state.spendableCredits + creditsDelta),
      ledger: state.ledger.concat([txn])
    });
    var newlyReachedMilestones = detectAndRecordMilestones(state.lifetimePoints, newState);
    return { ok: true, txn: txn, newState: getState(), newlyReachedMilestones: newlyReachedMilestones };
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

  /* Points earned since 00:00 Monday of the current week (positive ledger
     deltas only). Drives the fill level of the header beaker. */
  function weekStartMs(now) {
    var d = now ? new Date(now) : new Date();
    var dow = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow).getTime();
  }
  function getWeekPoints(state) {
    state = state || getState();
    var from = weekStartMs();
    return (state.ledger || []).reduce(function (s, t) {
      var ts = new Date(t.ts).getTime();
      return s + (t.pointsDelta > 0 && ts >= from ? t.pointsDelta : 0);
    }, 0);
  }
  /* Book a payout that was already decided elsewhere (the newsfeed's fixed
     +15 like/comment reward) so it shows in the ledger, lifetime total and
     this week's beaker fill. Skips the caps — those live in completeAction. */
  function awardPoints(amount, label, actionId) {
    amount = Math.max(0, Math.round(+amount || 0));
    if (!amount) return getState();
    var state = getState();
    var credits = Math.round(amount * getConfig().creditConversionRate);
    var txn = {
      id: uid("txn"), ts: nowIso(), actionId: actionId || "evt_react_post", label: label || "Newsfeed engagement",
      pointsDelta: amount, creditsDelta: credits, guardrailFlags: null, adminId: null, adjustmentReason: null
    };
    var newState = setState({
      lifetimePoints: state.lifetimePoints + amount,
      spendableCredits: state.spendableCredits + credits,
      rollingPoints30: (state.rollingPoints30 || 0) + amount,
      ledger: state.ledger.concat([txn])
    });
    detectAndRecordMilestones(state.lifetimePoints, newState);
    return getState();
  }

  function getCourseDiscount(slug) { var d = readJSON(COURSE_DISCOUNTS_KEY, {}); return d[slug] || null; }
  window.PFLoyalty = {
    getCourseDiscount: getCourseDiscount,
    TIER_KEYS: TIER_KEYS,
    MOCK_DIRECTORY: MOCK_DIRECTORY,
    getConfig: getConfig, setConfig: setConfig,
    upsertAction: upsertAction, setTierMultipliers: setTierMultipliers,
    setStoreItems: setStoreItems, upsertStoreItem: upsertStoreItem,
    setAchievementBadges: setAchievementBadges, setLevelBadges: setLevelBadges,
    setLeaderboardPrizes: setLeaderboardPrizes,
    setMilestonePath: setMilestonePath, upsertMilestone: upsertMilestone,
    getState: getState, setState: setState, resetDemo: resetDemo, resetNewMember: resetNewMember,
    getActionById: getActionById, tierMultiplierFor: tierMultiplierFor,
    getBadgeProgress: getBadgeProgress, getMilestoneProgress: getMilestoneProgress,
    completeAction: completeAction, redeemItem: redeemItem, manualAdjust: manualAdjust,
    checkIn: checkIn, setStreakAtRisk: setStreakAtRisk, freezeStreak: freezeStreak,
    spendCreditsToFreezeStreak: spendCreditsToFreezeStreak, restoreBrokenStreak: restoreBrokenStreak,
    evaluateAchievements: evaluateAchievements,
    getWeekPoints: getWeekPoints, awardPoints: awardPoints,
    formatNumber: formatNumber
  };
})();
