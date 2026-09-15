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
   • Three voices: coin chime (every earn), welcome chime (daily check-in,
     detail.actionId evt_mobile_checkin / detail.sound "checkin") and the
     streak fanfare (pf:five-in-a-row splash, pf:daily-goal page); plus
     "correct" (poll vote / right quiz answer), "wrong" (pf:answer-wrong, no
     points) and "post" (shared a post — fuller coin chime).
   • Sound styles: the user can pick how the three voices sound from the
     Gamification section of Notification Settings — Coin (default), Bell,
     Arcade, Soft or Bubble. Stored under "pf-sound-theme". Every voice is
     re-coloured by the style (waveform, pitch, length, pitch sweep) so the
     whole set stays a family. API: themes(), getTheme(), setTheme(id),
     preview(kind, themeId) — preview ignores mute/debounce for the settings
     page's "Play" buttons. ?soundtheme=bell etc. switches for demos.
   • window.PFGamification = { get, set, on } — the shared "pf-gamification"
     store the popups (points pill, "5 in a row", daily goal, check-in modal)
     read: { pointsPopup, streakPopup, dailyGoalPopup }, all default true.
   =========================================================================== */
(function () {
  "use strict";
  var KEY = "pf-sound";
  var THEME_KEY = "pf-sound-theme";
  var GAMI_KEY = "pf-gamification";
  var DEBOUNCE_MS = 250;
  var lastPlay = 0;

  /* ---- sound styles ----
     wave/over: oscillator types for the fundamental and the sparkle overtone.
     pitch/dur/gain: multipliers applied to every note. sweep: optional pitch
     glide (× fundamental) across the first 60% of each note — the "Bubble"
     pop. Everything else in the three voices stays the same, so a style
     changes the character of the whole set at once. */
  var THEMES = {
    coin:   { id: "coin",   label: "Coin",   desc: "Bright two-note chime",      wave: "sine",     over: "triangle", pitch: 1,    dur: 1,   gain: 1 },
    bell:   { id: "bell",   label: "Bell",   desc: "Glassy, long ring",          wave: "sine",     over: "sine",     pitch: 1.5,  dur: 2.1, gain: 0.85 },
    arcade: { id: "arcade", label: "Arcade", desc: "Retro 8-bit blips",          wave: "square",   over: "square",   pitch: 1,    dur: 0.7, gain: 0.32 },
    soft:   { id: "soft",   label: "Soft",   desc: "Warm, low and gentle",       wave: "triangle", over: "sine",     pitch: 0.5,  dur: 1.5, gain: 0.9 },
    bubble: { id: "bubble", label: "Bubble", desc: "Playful rising pops",        wave: "sine",     over: "sine",     pitch: 0.75, dur: 0.75, gain: 1, sweep: 1.9 }
  };
  var THEME_ORDER = ["coin", "bell", "arcade", "soft", "bubble"];
  function getTheme() { try { var t = localStorage.getItem(THEME_KEY); return THEMES[t] ? t : "coin"; } catch (e) { return "coin"; } }
  function setTheme(id) { if (!THEMES[id]) return; try { id === "coin" ? localStorage.removeItem(THEME_KEY) : localStorage.setItem(THEME_KEY, id); } catch (e) {} }
  /* the style used while a note is being scheduled (preview can override) */
  var T = THEMES.coin;

  /* ---- shared gamification store (popups) ---- */
  function gamiGet() { var s = {}; try { s = JSON.parse(localStorage.getItem(GAMI_KEY)) || {}; } catch (e) {} return { pointsPopup: s.pointsPopup !== false, streakPopup: s.streakPopup !== false, dailyGoalPopup: s.dailyGoalPopup !== false }; }
  function gamiSet(patch) { var s = gamiGet(); Object.keys(patch || {}).forEach(function (k) { s[k] = !!patch[k]; }); try { localStorage.setItem(GAMI_KEY, JSON.stringify(s)); } catch (e) {} try { window.dispatchEvent(new CustomEvent("pf:gamification-changed", { detail: s })); } catch (e) {} return s; }
  window.PFGamification = { get: gamiGet, set: gamiSet, on: function (k) { return gamiGet()[k] !== false; }, KEY: GAMI_KEY };

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
    /* "sine" is the fundamental, "triangle" the sparkle overtone — the active
       sound style re-colours both */
    o.type = type === "triangle" ? T.over : T.wave;
    freq = freq * T.pitch; dur = dur * T.dur; gainPeak = gainPeak * T.gain;
    o.frequency.setValueAtTime(freq, at);
    if (T.sweep) o.frequency.exponentialRampToValueAtTime(freq * T.sweep, at + dur * 0.6);
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

  /* ---- the welcome chime: daily check-in (first open of the day) ----
     A warmer, longer rising arpeggio (C5 → E5 → G5 → C6) with a soft bell
     shimmer on the top note, so the "welcome back" bonus is unmistakably
     different from the quick two-note coin chime. To use a real clip set
     `window.PF_CHECKIN_SOUND_SRC` before this script loads. */
  function synthCheckin() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime + 0.01;
    var steps = [523.25, 659.25, 783.99, 1046.5];
    for (var i = 0; i < steps.length; i++) {
      var at = t + i * 0.11, last = i === steps.length - 1;
      note(c, steps[i], at, last ? 0.75 : 0.28, last ? 0.28 : 0.2, "sine");
      note(c, steps[i] * 2, at, last ? 0.45 : 0.16, 0.045, "triangle");
    }
    /* bell shimmer: a fifth above the top note, fading slowly */
    note(c, 1567.98, t + 0.36, 0.9, 0.07, "sine");
    note(c, 2093.0, t + 0.42, 0.7, 0.035, "triangle");
  }

  /* ---- the streak fanfare: "5 in a row" splash + Daily Goal page ----
     Same warm family as the check-in chime, but bigger: a quick G5→B5→D6
     triplet, a held G6 with a bell shimmer on top, and a soft low "thump"
     underneath so it lands like a celebration rather than a ping. To use a
     real clip set `window.PF_STREAK_SOUND_SRC` before this script loads. */
  function synthStreak() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime + 0.01;
    /* soft low thump */
    note(c, 130.81, t, 0.32, 0.22, "sine");
    note(c, 261.63, t, 0.18, 0.08, "triangle");
    /* rising triplet */
    var steps = [783.99, 987.77, 1174.66];
    for (var i = 0; i < steps.length; i++) {
      note(c, steps[i], t + 0.04 + i * 0.09, 0.26, 0.2, "sine");
      note(c, steps[i] * 2, t + 0.04 + i * 0.09, 0.14, 0.04, "triangle");
    }
    /* held top note + shimmer */
    var top = t + 0.04 + steps.length * 0.09;
    note(c, 1567.98, top, 0.95, 0.3, "sine");
    note(c, 3135.96, top, 0.5, 0.045, "triangle");
    note(c, 2349.32, top + 0.08, 0.8, 0.07, "sine");
    /* second, softer echo of the chord for sparkle */
    note(c, 1174.66, top + 0.22, 0.6, 0.1, "sine");
    note(c, 1975.53, top + 0.30, 0.55, 0.06, "sine");
  }

  /* ---- quiz / poll answers ----
     "correct": a bright, quick major-triad sparkle (C6 E6 G6 → held C7) —
     clearly a "yes!", shorter than the streak fanfare.
     "wrong":   a soft two-tone descending "bonk" (A3 → F3), gentle, no buzz. */
  function synthCorrect() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime + 0.01;
    var steps = [1046.5, 1318.5, 1567.98];
    for (var i = 0; i < steps.length; i++) {
      note(c, steps[i], t + i * 0.07, 0.22, 0.18, "sine");
      note(c, steps[i] * 2, t + i * 0.07, 0.12, 0.035, "triangle");
    }
    var top = t + steps.length * 0.07;
    note(c, 2093.0, top, 0.6, 0.22, "sine");
    note(c, 3135.96, top + 0.05, 0.45, 0.04, "triangle");
  }
  function synthWrong() {
    var c = getCtx();
    if (!c) return;
    var t = c.currentTime + 0.01;
    note(c, 220.0, t,        0.22, 0.16, "triangle");
    note(c, 174.61, t + 0.16, 0.42, 0.18, "triangle");
    note(c, 87.31,  t + 0.16, 0.36, 0.06, "sine");
  }

  /* ---- optional real clip ---- */
  var clips = {};
  function playClip(src, fallback) {
    fallback = fallback || function () { synth(false); };
    try {
      var clip = clips[src] || (clips[src] = new Audio(src));
      clip.preload = "auto";
      clip.currentTime = 0;
      var p = clip.play();
      if (p && p.catch) p.catch(fallback);
    } catch (e) { fallback(); }
  }

  /* Browsers keep a fresh document's AudioContext suspended until the user has
     interacted with the site. Notes scheduled on a suspended context are NOT
     dropped — they queue up and all burst out on the first tap, which reads
     as "the sound plays when I click the button". So: if the context can't run
     right now, skip the sound entirely rather than play it late. (Once the
     user has tapped anywhere on the site in this session, same-origin pages
     opened afterwards start with audio unlocked and everything plays on cue.) */
  function canPlayNow() {
    var c = getCtx();
    if (!c) return false;
    if (c.state === "running") return true;
    try { c.resume(); } catch (e) {}
    return c.state === "running";
  }

  function play(amount, kind) {
    if (!enabled()) return;
    var now = Date.now();
    if (now - lastPlay < DEBOUNCE_MS) return;
    if (!canPlayNow()) return;
    lastPlay = now;
    T = THEMES[getTheme()];
    voice(amount, kind);
  }
  function voice(amount, kind) {
    if (kind === "checkin") {
      var csrc = window.PF_CHECKIN_SOUND_SRC;
      if (csrc) playClip(csrc, synthCheckin); else synthCheckin();
      return;
    }
    if (kind === "streak") {
      var ssrc = window.PF_STREAK_SOUND_SRC;
      if (ssrc) playClip(ssrc, synthStreak); else synthStreak();
      return;
    }
    if (kind === "correct") {
      var ksrc = window.PF_CORRECT_SOUND_SRC;
      if (ksrc) playClip(ksrc, synthCorrect); else synthCorrect();
      return;
    }
    if (kind === "wrong") {
      var wsrc = window.PF_WRONG_SOUND_SRC;
      if (wsrc) playClip(wsrc, synthWrong); else synthWrong();
      return;
    }
    if (kind === "post") { synth(true); return; }   /* sharing a post: the fuller three-note coin chime */
    var src = window.PF_POINTS_SOUND_SRC;
    if (src) playClip(src); else synth(Number(amount) >= 100);
  }

  function onEarn(e) {
    var amount = e && e.detail && Number(e.detail.amount) || 0;
    if (amount <= 0) return;
    var d = e.detail || {};
    /* detail.sound "none": the sender plays its own sound when its popup opens
       (daily-checkin.js plays the welcome chime as the modal appears) */
    if (d.sound === "none") return;
    /* the daily check-in bonus gets its own welcome chime */
    var kind = d.sound || (d.actionId === "evt_mobile_checkin" ? "checkin" : null);
    play(amount, kind);
  }
  window.addEventListener("pf:points-earned", onEarn);

  /* ---- celebration moments ----
     "5 in a row" (earn-streak.js) fires right after a points earn, so let the
     coin chime finish before the fanfare. The Daily Goal page (daily-goal.jsx)
     fires on mount. Sounds always trigger when the popup shows — never later
     on a tap (see canPlayNow). */
  function playStreak(delayMs) {
    if (!enabled()) return;
    var fire = function () { lastPlay = 0; play(0, "streak"); };
    if (delayMs) setTimeout(fire, delayMs); else fire();
  }
  window.addEventListener("pf:five-in-a-row", function () { playStreak(300); });
  /* wrong quiz answer (app.jsx popWrong): no points, just the sound */
  window.addEventListener("pf:answer-wrong", function () { lastPlay = 0; play(0, "wrong"); });
  window.addEventListener("pf:daily-goal", function () { playStreak(120); });

  window.PFPointsSound = {
    play: function (amount) { lastPlay = 0; play(amount == null ? 10 : amount); },
    playCheckin: function () { lastPlay = 0; play(50, "checkin"); },
    playStreak: function () { playStreak(0); },
    playCorrect: function () { lastPlay = 0; play(0, "correct"); },
    playWrong: function () { lastPlay = 0; play(0, "wrong"); },
    mute: function () { setEnabled(false); },
    unmute: function () { setEnabled(true); },
    toggle: function () { setEnabled(!enabled()); return enabled(); },
    enabled: enabled,
    /* sound styles (Notification Settings → Gamification) */
    themes: function () { return THEME_ORDER.map(function (id) { var t = THEMES[id]; return { id: id, label: t.label, desc: t.desc }; }); },
    getTheme: getTheme,
    setTheme: setTheme,
    /* preview(kind, themeId): kind "points" | "checkin" | "streak". Ignores
       mute and the debounce so the settings page can audition styles. */
    preview: function (kind, themeId) {
      if (!canPlayNow()) return false;
      T = THEMES[themeId] || THEMES[getTheme()];
      voice(kind === "points" ? 10 : 50, kind === "points" ? null : kind);
      lastPlay = Date.now();
      return true;
    }
  };

  var mt = /[?&]soundtheme=([a-z]+)/.exec(location.search);
  if (mt) setTheme(mt[1]);

  var m = /[?&]pointsound=([01])/.exec(location.search);
  if (m) setEnabled(m[1] === "1");
})();
