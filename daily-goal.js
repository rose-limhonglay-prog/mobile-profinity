/* ===========================================================================
   PROfinity — Daily goal trigger (plain JS, no React)
   Watches pf:points-earned (the same event the header points pill and the
   "5 in a row" splash listen to) and tallies what Katy has earned today.
   Each time today's total crosses another 50-point mark (50, 100, 150 …)
   it navigates to DailyGoal.html — a full page, not a modal — with ?ret=
   pointing back at the page she was on so "Keep earning" drops her straight
   back in. Fires once per milestone per day (the last celebrated milestone
   is stored). window.PFDailyGoal = { goal, today, show, reset }.
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-daily-goal";
  var GOAL = window.PF_DAILY_GOAL || 50;

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

  /* today's booked points straight from the loyalty ledger */
  function ledgerToday() {
    try {
      var st = window.PFLoyalty && window.PFLoyalty.getState();
      var today = dayKey(), sum = 0;
      ((st && st.ledger) || []).forEach(function (t) { if (t.pointsDelta > 0 && dayKey(t.ts) === today) sum += t.pointsDelta; });
      return sum;
    } catch (e) { return 0; }
  }
  function today() { return Math.max(ledgerToday(), read().earned); }

  function currentPage() { return (location.pathname.split("/").pop() || "NewsfeedMobile.html") + location.search; }
  function show() {
    var url = "DailyGoal.html?ret=" + encodeURIComponent(currentPage());
    (window.pfGo || function (u) { window.location.href = u; })(url);
  }
  /* let the +pts pop / toast land, and if the "5 in a row" splash is up let
     Katy dismiss that first — then take her to the page */
  function celebrate() {
    var t0 = Date.now();
    var tick = function () {
      var fiar = document.querySelector(".pf-fiar-root.is-open");
      if (fiar && Date.now() - t0 < 60000) { setTimeout(tick, 400); return; }
      show();
    };
    setTimeout(tick, 1300);
  }

  function onEarn(e) {
    var amount = e && e.detail && Number(e.detail.amount) || 0;
    if (amount <= 0) return;
    var s = read();
    s.earned += amount;
    var total = Math.max(ledgerToday(), s.earned);
    /* highest 50-point mark reached so far today; celebrate if it's a new one */
    var mark = Math.floor(total / GOAL) * GOAL;
    if (mark >= GOAL && mark > s.milestone) { s.milestone = mark; write(s); celebrate(); }
    else write(s);
  }
  window.addEventListener("pf:points-earned", onEarn);

  window.PFDailyGoal = {
    goal: GOAL,
    today: today,
    show: show,
    reset: function () { var s = read(); s.milestone = 0; s.earned = 0; write(s); }
  };
})();
