/* PROfinity — cute looping background music for the Rewards pages ONLY
   (user, 2026-10-20 "add fun and cute background music in the rewards page
   only", then "keep the music background in other pages in the rewards page",
   then "make the sound just continue when I go to the other rewards pages").
   Included on the rewards shells only: RewardsDashboard / RewardsWeb /
   MilestonePath / Leaderboard / WaysToEarn / CheckInStreak / RewardLanding(.Web).

   • No audio asset: a tiny Web Audio sequencer plays an 8-bar chiptune-style
     tune (C-major pentatonic melody, bouncy bass, soft ticks) at 132 BPM and
     loops it. Triangle + a whisper of square for the melody, sine bass, a
     low-pass on the master so it stays soft behind the coin chimes.
   • Browsers keep audio suspended until the member has touched the page, so
     the loop starts on the first pointer / key gesture after load. It pauses
     when the tab is hidden and resumes when it comes back.
   • Continuity across the rewards pages: every page is its own document, so
     the audio engine can't survive a navigation. Instead the leaving page
     keeps its scheduled notes sounding until the document goes and parks the
     wall-clock moment its loop cycle began (sessionStorage); the next page
     works out where the tune would be NOW and starts there at once (a
     same-origin navigation carries the gesture in Chrome / desktop Safari).
   • Its own switch "pf-rewards-music" ("off") and volume "pf-rewards-music-volume"
     (0..1) — both on RewardsSettings(.Web).html; independent of the sound-effects
     mute so the two can be set separately. A small floating
     ♪ button (bottom-right, above the tab bar on the dashboard) toggles the
     tune and remembers the choice. Points chimes (pf:points-earned) duck the
     music for a second so they stay audible.
   • API: window.PFRewardsMusic = { start, stop, toggle, isOn } */
(function () {
  if (window.PFRewardsMusic) return;
  function store(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  var KEY = "pf-rewards-music";     // "off" = member switched the tune off
  var VOL_KEY = "pf-rewards-music-volume"; // 0..1, 1 = default (Rewards settings page)
  var SOUND_KEY = "pf-sound";        // the sound-EFFECTS mute from points-sound.js — separate from the music (Rewards settings has its own switches)
  var LOOP = 64;                     // every tune: 8 bars × 8 eighths
  var MASTER = 0.085;
  var TUNE_KEY = "pf-rewards-music-tune";

  /* ---- the tunes (8ths; "-" = rest, "." = hold previous note). Four to pick
     from on the Rewards settings page (user, 2026-10-20 "add 3 more background
     music that the user can change"). wave/sq = melody oscillator + square
     whisper mix, perc = "full" | "soft" (bar booms only) | "none",
     vib = gentle vibrato depth in Hz. */
  function seq(s) { return s.trim().split(/\s+/); }
  var TUNES = {
    sunny: { id: "sunny", label: "Sunny", desc: "Bright and bouncy", bpm: 132, wave: "triangle", sq: 0.12, perc: "full", gain: 1,
      mel: seq("E5 G5 A5 G5 E5 D5 C5 -   D5 E5 G5 E5 D5 C5 A4 -   C5 E5 G5 A5 C6 A5 G5 E5   G5 E5 D5 E5 C5 .  -  -   " +
               "E5 G5 A5 G5 E5 D5 C5 -   D5 E5 G5 E5 D5 C5 A4 -   C5 E5 G5 A5 C6 A5 G5 A5   G5 A5 C6 .  G5 .  -  -"),
      bass: seq("C3 - G3 - C3 - G3 -   A2 - E3 - A2 - E3 -   F3 - C3 - F3 - C3 -   G3 - D3 - G3 - D3 -   " +
                "C3 - G3 - C3 - G3 -   A2 - E3 - A2 - E3 -   F3 - C3 - F3 - C3 -   G3 - D3 - C3 - - -") },
    lullaby: { id: "lullaby", label: "Lullaby", desc: "Slow music-box", bpm: 84, wave: "triangle", sq: 0, perc: "none", gain: 0.9,
      mel: seq("C5 .  E5 .  G5 .  E5 .   A4 .  C5 .  E5 .  C5 .   F4 .  A4 .  C5 .  A4 .   G4 .  B4 .  D5 .  B4 .   " +
               "C5 .  E5 .  G5 .  C6 .   A5 .  G5 .  E5 .  C5 .   D5 .  E5 .  F5 .  D5 .   C5 .  .  .  -  -  -  -"),
      bass: seq("C3 . . . . . . .   A2 . . . . . . .   F2 . . . . . . .   G2 . . . . . . .   " +
                "C3 . . . . . . .   A2 . . . . . . .   F2 . . . G2 . . .   C3 . . . . . . .") },
    bounce: { id: "bounce", label: "Bounce", desc: "Quick and playful", bpm: 150, wave: "triangle", sq: 0.22, perc: "full", gain: 0.95,
      mel: seq("C5 C5 E5 G5 A5 G5 E5 C5   D5 D5 F5 A5 G5 F5 D5 -   E5 E5 G5 B5 C6 B5 G5 E5   D5 E5 D5 C5 G4 -  -  -   " +
               "C5 C5 E5 G5 A5 G5 E5 C5   A5 A5 C6 A5 G5 E5 D5 -   E5 G5 A5 C6 D6 C6 A5 G5   A5 G5 E5 D5 C5 .  -  -"),
      bass: seq("C3 - C3 - G2 - G2 -   D3 - D3 - A2 - A2 -   E3 - E3 - B2 - B2 -   G2 - G2 - G2 - - -   " +
                "C3 - C3 - G2 - G2 -   A2 - A2 - E3 - E3 -   F3 - F3 - G3 - G3 -   C3 - - - C3 - - -") },
    calm: { id: "calm", label: "Calm", desc: "Soft and dreamy", bpm: 96, wave: "sine", sq: 0, perc: "soft", gain: 1.1, vib: 4,
      mel: seq("E5 . . . G5 . . .   A5 . . . G5 . . .   E5 . . . D5 . . .   C5 . . . . . . .   " +
               "D5 . . . E5 . . .   G5 . . . E5 . . .   D5 . . . C5 . . .   A4 . . . . . . ."),
      bass: seq("C3 . . . . . . .   F2 . . . . . . .   A2 . . . . . . .   G2 . . . . . . .   " +
                "C3 . . . . . . .   F2 . . . . . . .   A2 . . . G2 . . .   C3 . . . . . . .") }
  };
  var TUNE_ORDER = ["sunny", "lullaby", "bounce", "calm"];
  function getTune() { var t = store(TUNE_KEY); return TUNES[t] ? t : "sunny"; }
  var T = TUNES.sunny, STEP = 60 / T.bpm / 2, LOOP_S = LOOP * STEP;
  function useTune(id) { T = TUNES[id] || TUNES.sunny; STEP = 60 / T.bpm / 2; LOOP_S = LOOP * STEP; }

  var NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function hz(n) {
    var m = /^([A-G])(#?)(\d)$/.exec(n); if (!m) return 0;
    var midi = 12 * (parseInt(m[3], 10) + 1) + NOTE[m[1]] + (m[2] ? 1 : 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /* ---- state ---- */
  var ac = null, master = null, duck = null, noiseBuf = null;
  var timer = null, anchorTimer = null, nextTime = 0, step = 0, running = false, armed = false, btn = null;
  function wantsMusic() { return store(KEY) !== "off"; }
  function isOn() { return wantsMusic(); }
  function getVolume() { var v = parseFloat(store(VOL_KEY)); return isNaN(v) ? 1 : Math.max(0, Math.min(1, v)); }
  function setVolume(v) {
    v = Math.max(0, Math.min(1, +v || 0));
    try { v >= 0.999 ? localStorage.removeItem(VOL_KEY) : localStorage.setItem(VOL_KEY, String(v)); } catch (e) {}
    if (master && ac) master.gain.setTargetAtTime(MASTER * T.gain * v, ac.currentTime, 0.05);
  }
  function setTune(id) {
    if (!TUNES[id]) return;
    try { id === "sunny" ? localStorage.removeItem(TUNE_KEY) : localStorage.setItem(TUNE_KEY, id); } catch (e) {}
    var was = running; if (was) { clearInterval(timer); timer = null; running = false; }
    useTune(id); try { sessionStorage.removeItem(POS_KEY); } catch (e) {}
    if (master && ac) master.gain.setTargetAtTime(MASTER * T.gain * getVolume(), ac.currentTime, 0.05);
    if (was || isOn()) start();
  }

  function ensureContext() {
    if (ac) return ac;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ac = new AC();
    master = ac.createGain(); master.gain.value = MASTER * T.gain * getVolume();
    duck = ac.createGain(); duck.gain.value = 1;
    var lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3800; lp.Q.value = 0.6;
    duck.connect(master); master.connect(lp); lp.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.05), ac.sampleRate);
    var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    return ac;
  }

  /* ---- voices ---- */
  function melody(t, f, len) {
    var g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.55, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.22, t + len * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.03);
    var o1 = ac.createOscillator(); o1.type = T.wave; o1.frequency.value = f;
    var o2 = ac.createOscillator(); o2.type = "square"; o2.frequency.value = f; // the chiptune whisper
    var g2 = ac.createGain(); g2.gain.value = T.sq;
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(duck);
    if (T.vib) { var lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 5.2; lg.gain.value = T.vib; lfo.connect(lg); lg.connect(o1.frequency); lfo.start(t); lfo.stop(t + len + 0.05); }
    o1.start(t); o2.start(t); o1.stop(t + len + 0.05); o2.stop(t + len + 0.05);
  }
  function bass(t, f, len) {
    var g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len * 0.9);
    var o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f;
    o.connect(g); g.connect(duck); o.start(t); o.stop(t + len);
  }
  function tick(t, loud) {
    var s = ac.createBufferSource(); s.buffer = noiseBuf;
    var hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6000;
    var g = ac.createGain(); g.gain.value = loud ? 0.22 : 0.12;
    s.connect(hp); hp.connect(g); g.connect(duck); s.start(t);
  }
  function boom(t) {
    var o = ac.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.09);
    var g = ac.createGain(); g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g); g.connect(duck); o.start(t); o.stop(t + 0.14);
  }

  /* ---- continuity across pages: where is the tune right now? ---- */
  var POS_KEY = "pf-rewards-music-pos", RESUME_WINDOW_MS = 45000;
  function posNow() { // seconds into the loop at this instant
    var ahead = nextTime - ac.currentTime;          // audio already scheduled beyond "now"
    var pos = step * STEP - ahead;                   // step = index of the NEXT unscheduled step
    return ((pos % LOOP_S) + LOOP_S) % LOOP_S;
  }
  function savePos() {
    try {
      if (running && ac) sessionStorage.setItem(POS_KEY, JSON.stringify({ anchor: Date.now() - posNow() * 1000, at: Date.now(), tune: T.id }));
      else sessionStorage.removeItem(POS_KEY);
    } catch (e) {}
  }
  function loadPos() { // → { step, wait } for the first step to schedule, or null
    try {
      var v = JSON.parse(sessionStorage.getItem(POS_KEY) || "null"); if (!v || !v.anchor) return null;
      if (Date.now() - (v.at || 0) > RESUME_WINDOW_MS || (v.tune && v.tune !== T.id)) return null;
      var pos = ((((Date.now() - v.anchor) / 1000) % LOOP_S) + LOOP_S) % LOOP_S;
      var s = Math.floor(pos / STEP), frac = pos - s * STEP;
      return { step: (s + 1) % LOOP, wait: STEP - frac };   // skip the partly-elapsed step, land on the next beat
    } catch (e) { return null; }
  }
  function hasRecentPos() { return !!loadPos(); }

  /* ---- sequencer (lookahead scheduling) ---- */
  function noteLen(arr, i) { var n = 1; while (arr[(i + n) % LOOP] === "." && n < 8) n++; return n * STEP * 0.92; }
  function scheduleStep(i, t) {
    var m = T.mel[i]; if (m && m !== "-" && m !== ".") melody(t, hz(m), noteLen(T.mel, i));
    var b = T.bass[i]; if (b && b !== "-" && b !== ".") bass(t, hz(b), T.perc === "none" ? noteLen(T.bass, i) * 0.9 : STEP * 1.6);
    if (T.perc === "full") { if (i % 4 === 0) boom(t); else if (i % 2 === 1) tick(t, i % 8 === 5); }
    else if (T.perc === "soft") { if (i % 8 === 0) boom(t); }
  }
  function pump() {
    while (nextTime < ac.currentTime + 0.25) { scheduleStep(step, nextTime); nextTime += STEP; step = (step + 1) % LOOP; }
  }
  function start() {
    if (!isOn()) return false;
    if (!ensureContext()) return false;
    if (ac.state === "suspended") { ac.resume().catch(function () {}); }
    if (running) return true;
    if (T.id !== getTune()) useTune(getTune());
    var pos = loadPos();
    running = true; step = pos ? pos.step : 0; nextTime = ac.currentTime + (pos ? pos.wait : 0.05);
    timer = setInterval(function () { if (ac.state === "running") pump(); }, 60);
    // keep the loop anchor fresh while playing so a sudden navigation resumes accurately
    if (!anchorTimer) anchorTimer = setInterval(function () { if (running && ac.state === "running") savePos(); }, 1000);
    paint(); return true;
  }
  function stop(keepPlaying) {
    running = false; clearInterval(timer); timer = null;
    if (keepPlaying) return;   // leaving the page: let the already-scheduled notes play out until the document goes
    if (ac && ac.state === "running") ac.suspend().catch(function () {});
    paint();
  }
  function toggle() {
    var on = !wantsMusic();
    try { on ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, "off"); } catch (e) {}
    if (on) { if (!start()) paint(); } else { stop(); savePos(); }
  }

  /* ---- the floating ♪ switch ---- */
  /* "tabbar" = the Rewards dashboard (bottom tab bar to clear), "plain" = a
     drill-in page (Leaderboard, Ways to Earn, …) with no tab bar, "" = web */
  function mobileShell() { return document.querySelector(".lm-screen") ? "tabbar" : document.querySelector(".ml-screen") ? "plain" : ""; }
  function paint() {
    if (!btn) return;
    var shell = mobileShell(); // the React shell mounts after DOMContentLoaded, so re-check
    btn.classList.toggle("is-mobile", shell === "tabbar"); btn.classList.toggle("is-mobile-plain", shell === "plain");
    var on = isOn() && running;
    btn.classList.toggle("is-off", !on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "Background music on. Turn off" : "Background music off. Turn on");
    btn.title = on ? "Music on" : "Music off";
    var ic = btn.querySelector("iconify-icon"); if (ic) ic.setAttribute("icon", on ? "lucide:music" : "lucide:volume-x");
    var fb = btn.querySelector(".pf-rmusic-fb"); if (fb) fb.textContent = on ? "♪" : "♪̸";
  }
  function addButton() {
    if (btn || !document.body) return;
    btn = document.createElement("button");
    btn.type = "button"; btn.id = "pf-rmusic"; btn.className = "pf-rmusic";
    btn.innerHTML = window.customElements && customElements.get("iconify-icon")
      ? '<iconify-icon icon="lucide:music" width="18" height="18"></iconify-icon>'
      : '<span class="pf-rmusic-fb">♪</span>';
    btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    document.body.appendChild(btn); paint();
    setTimeout(paint, 400); setTimeout(paint, 1500);
  }

  /* ---- boot: arm on the first gesture, follow tab visibility + mute ---- */
  function arm() {
    if (armed) return; armed = true;
    var kick = function () { if (isOn()) start(); };
    ["pointerdown", "touchend", "keydown"].forEach(function (ev) { window.addEventListener(ev, kick, { passive: true }); });
    // a same-origin navigation carries the gesture over in Chrome / desktop
    // Safari, so when the previous rewards page parked a position, pick the
    // tune up at once; otherwise try quietly after a beat (stays suspended if
    // the browser wants a gesture, and the first tap starts it)
    if (hasRecentPos()) kick(); else setTimeout(kick, 400);
    document.addEventListener("visibilitychange", function () {
      if (!ac) return;
      if (document.hidden) { if (running) ac.suspend().catch(function () {}); }
      else if (running && isOn()) ac.resume().catch(function () {});
    });
    window.addEventListener("storage", function (e) {
      if (e.key === KEY) { isOn() ? start() : stop(); }
      if (e.key === VOL_KEY && master && ac) master.gain.setTargetAtTime(MASTER * T.gain * getVolume(), ac.currentTime, 0.05);
      if (e.key === TUNE_KEY && getTune() !== T.id) setTune(getTune());
    });
    window.addEventListener("pf:points-earned", function () {
      if (!ac || !running || ac.state !== "running") return;
      var t = ac.currentTime;
      duck.gain.cancelScheduledValues(t); duck.gain.setValueAtTime(duck.gain.value, t);
      duck.gain.linearRampToValueAtTime(0.35, t + 0.05); duck.gain.linearRampToValueAtTime(1, t + 1.3);
    });
    window.addEventListener("pagehide", function () { savePos(); stop(true); });
    window.addEventListener("beforeunload", savePos);
  }
  function boot() { useTune(getTune()); addButton(); arm(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  window.PFRewardsMusic = { start: start, stop: stop, toggle: toggle, isOn: function () { return isOn() && running; },
    wantsMusic: wantsMusic, getVolume: getVolume, setVolume: setVolume,
    tunes: function () { return TUNE_ORDER.map(function (id) { var t = TUNES[id]; return { id: id, label: t.label, desc: t.desc }; }); },
    getTune: getTune, setTune: setTune,
    setOn: function (on) { try { on ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, "off"); } catch (e) {} if (on) { if (!start()) paint(); } else { stop(); savePos(); } } };
})();
