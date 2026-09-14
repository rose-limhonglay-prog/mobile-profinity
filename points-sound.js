/* ===========================================================================
   PROfinity — points-earned sound (plain JS, no React, no assets)
   Plays a short two-note "coin" chime on every successful pf:points-earned
   event — the same event the header points pill, the earn-streak splash and
   the Rewards dashboard already listen to, so every earn site (popPoints in
   app.jsx, Ways to Earn, Check-In Streak, badge claims, daily target) gets the
   sound without touching the dispatchers.

   • Synthesised with the Web Audio API, so it works offline and needs no CDN
     or audio file. To use a real clip instead, set
     `window.PF_POINTS_SOUND_SRC = "assets/sounds/points.mp3"` before this
     script loads and the clip is played (falls back to the synth on error).
   • Browsers block audio until the user has interacted with the page. Points
     are almost always earned from a tap, so the context is usually already
     unlocked; we also warm it up on the first pointerdown/keydown just in case.
   • Mute persists in localStorage under "pf-sound" ("off"). API for demos and
     a future settings toggle: window.PFPointsSound = { play, mute, unmute,
     toggle, enabled }. ?pointsound=0 mutes, ?pointsound=1 unmutes.
   • Debounced to one chime per 250ms so rapid multi-earns don't stack.
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-sound";
  var DEBOUNCE_MS = 250;
  var lastPlay = 0;

  function enabled() { try { return localStorage.getItem(KEY) !== "off"; } catch (e) { return true; } }
  function setEnabled(on) { try { on ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, "off"); } catch (e) {} }

  /* ---- Web Audio context (lazy, resumed on demand) ---- */
  var ctx = null;
  function getCtx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) { try { ctx = new AC(); } catch (e) { return null; } }
    if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }
  function warm() { getCtx(); }
  ["pointerdown", "touchstart", "keydown"].forEach(function (t) {
    window.addEventListener(t, warm, { passive: true, capture: true });
  });

  /* ---- the chime: two quick rising notes (E5 → B5) with a soft bell tail ---- */
  function note(c, freq, at, dur, gainPeak, type) {
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, at);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(gainPeak, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(c.destination);
    o.start(at); o.stop(at + dur + 0.02);
  }
  function synth(big) {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime + 0.01;
    /* fundamental + a quiet octave overtone for sparkle */
    note(c, 659.25, t,        0.16, 0.22, "sine");
    note(c, 1318.5, t,        0.10, 0.05, "triangle");
    note(c, 987.77, t + 0.09, 0.32, 0.26, "sine");
    note(c, 1975.5, t + 0.09, 0.18, 0.06, "triangle");
    if (big) { /* a third, higher note for bigger payouts (≥ 100 pts) */
      note(c, 1318.5, t + 0.20, 0.40, 0.22, "sine");
    }
  }

  /* ---- optional real clip ---- */
  var clip = null;
  function playClip(src) {
    try {
      if (!clip) { clip = new Audio(src); clip.preload = "auto"; }
      clip.currentTime = 0;
      var p = clip.play();
      if (p && p.catch) p.catch(function () { synth(false); });
    } catch (e) { synth(false); }
  }

  function play(amount) {
    if (!enabled()) return;
    var now = Date.now();
    if (now - lastPlay < DEBOUNCE_MS) return;
    lastPlay = now;
    var src = window.PF_POINTS_SOUND_SRC;
    if (src) playClip(src); else synth(Number(amount) >= 100);
  }

  function onEarn(e) {
    var amount = e && e.detail && Number(e.detail.amount) || 0;
    if (amount <= 0) return;
    play(amount);
  }
  window.addEventListener("pf:points-earned", onEarn);

  window.PFPointsSound = {
    play: function (amount) { lastPlay = 0; play(amount == null ? 10 : amount); },
    mute: function () { setEnabled(false); },
    unmute: function () { setEnabled(true); },
    toggle: function () { setEnabled(!enabled()); return enabled(); },
    enabled: enabled
  };

  var m = /[?&]pointsound=([01])/.exec(location.search);
  if (m) setEnabled(m[1] === "1");
})();
