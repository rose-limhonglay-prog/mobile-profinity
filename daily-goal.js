/* ===========================================================================
   PROfinity — Daily goal trigger (plain JS, no React)
   Watches pf:points-earned (the same event the header points pill listens
   to) and tallies what Katy has earned today.
   The day's goal is a fixed ladder of marks — 280, 500, 750 and 1,000 points
   (user rule 2026-09-18; override with window.PF_DAILY_GOAL_MARKS). Each
   time today's total reaches the next mark it navigates to DailyGoal.html — a
   full page, not a modal — with ?ret= pointing back at the page she was on so
   "Keep earning" drops her straight back in. Fires once per mark per day (the
   last celebrated mark is stored) and the ladder starts again from 280 the
   next day. window.PFDailyGoal = { goal, marks, markFor, nextMark, today,
   show, reset }.
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-daily-goal";
  var MARKS = (Array.isArray(window.PF_DAILY_GOAL_MARKS) && window.PF_DAILY_GOAL_MARKS.length ? window.PF_DAILY_GOAL_MARKS : [280, 500, 750, 1000])
    .map(Number).filter(function (n) { return n > 0; }).sort(function (a, b) { return a - b; });
  var GOAL = MARKS[0];
  /* highest mark reached with `total` points (0 if none yet) / the next one to aim for (null when the ladder is done) */
  function markFor(total) { var m = 0; for (var i = 0; i < MARKS.length; i++) if (total >= MARKS[i]) m = MARKS[i]; return m; }
  function nextMark(total) { for (var i = 0; i < MARKS.length; i++) if (total < MARKS[i]) return MARKS[i]; return null; }
  /* the automatic first-open-of-the-day check-in (daily-checkin.js) is a
     welcome-back bonus, not activity — it must not tick the goal on its own */
  var SKIP = { evt_mobile_checkin: true };

  function dayKey(d) { var dt = d ? new Date(d) : new Date(); return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate(); }
  function read() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!s || s.day !== dayKey()) s = { day: dayKey(), earned: 0, milestone: 0 };
    /* older shape: { shown: true } meant the first 50 had been celebrated */
    if (typeof s.milestone !== "number") s.milestone = s.shown ? GOAL : 0;
    return s;
  }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  /* Gamification preference (Notification Settings → Gamification). Read
     straight from localStorage so this script doesn't depend on load order. */
  function gamiOn(k) { try { var s = JSON.parse(localStorage.getItem("pf-gamification")) || {}; return s[k] !== false; } catch (e) { return true; } }

  /* today's booked points straight from the loyalty ledger */
  function ledgerToday() {
    try {
      var st = window.PFLoyalty && window.PFLoyalty.getState();
      var today = dayKey(), sum = 0;
      ((st && st.ledger) || []).forEach(function (t) { if (t.pointsDelta > 0 && dayKey(t.ts) === today && !SKIP[t.actionId]) sum += t.pointsDelta; });
      return sum;
    } catch (e) { return 0; }
  }
  function today() { return Math.max(ledgerToday(), read().earned); }

  function currentPage() { return (location.pathname.split("/").pop() || "NewsfeedMobile.html") + location.search; }
  /* Remember how far the screen was scrolled so "Keep earning" / close on
     the Daily Goal page drops Katy back exactly where she was (the newsfeed
     restores via pfRestoreScroll in pagetrans.js on its next load). */
  function saveScroll() {
    if (!window.pfSaveScroll) return;
    var el = document.querySelector(".m-scroll");
    if (!el || !(el.scrollTop > 0)) {
      var all = document.querySelectorAll("*");
      for (var i = 0; i < all.length; i++) {
        var n = all[i];
        if (n.scrollTop > 0 && n.scrollHeight > n.clientHeight + 1) { el = n; break; }
      }
    }
    if (el) window.pfSaveScroll(el);
  }
  function show() {
    saveScroll();
    var url = "DailyGoal.html?ret=" + encodeURIComponent(currentPage());
    (window.pfGo || function (u) { window.location.href = u; })(url);
  }
  /* let the +pts pop / toast land first — then take her to the page. With the
     reward router (reward-router.js) on the page the crossing is handed over
     as a "major" instead: alone it still opens DailyGoal.html (Reward Splash
     Screen); together with a level-up / badge from the same action it becomes
     one Combined Celebration rather than two pages fighting to navigate. */
  function celebrate(mark) {
    if (window.PFRewards && window.PFRewards.major) { window.PFRewards.major({ type: "dailyGoal", key: String(mark), mark: mark }); return; }
    setTimeout(show, 1300);
  }

  function onEarn(e) {
    var amount = e && e.detail && Number(e.detail.amount) || 0;
    if (amount <= 0) return;
    if (e.detail && SKIP[e.detail.actionId]) return;
    var s = read();
    s.earned += amount;
    var total = Math.max(ledgerToday(), s.earned);
    /* highest mark on today's ladder reached so far; celebrate if it's a new one */
    var mark = markFor(total);
    if (mark >= GOAL && mark > s.milestone) { s.milestone = mark; write(s); if (gamiOn("dailyGoalPopup")) celebrate(mark); }
    else write(s);
  }
  window.addEventListener("pf:points-earned", onEarn);

  window.PFDailyGoal = {
    goal: GOAL,
    marks: MARKS.slice(),
    markFor: markFor,
    nextMark: nextMark,
    today: today,
    show: show,
    reset: function () { var s = read(); s.milestone = 0; s.earned = 0; write(s); }
  };
})();
