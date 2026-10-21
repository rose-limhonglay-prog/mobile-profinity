/* PROfinity — Rewards settings (user, 2026-10-20: "create another settings
   that is related to the rewards… sound effects, sound background, the user
   can lower the volume or totally mute").
   RewardsSettings.html (mobile, PF loyalty shell) and RewardsSettingsWeb.html
   (desktop, window.PF_RS_WEB) run this one bundle. Opened from the gear on the
   Rewards header (mobilechrome.jsx / web-rewards-chrome.js).
   Everything applies immediately (sliders need live feedback):
     • Sound effects  → PFPointsSound enabled / getVolume / setVolume / preview / themes
     • Background music → PFRewardsMusic setOn / getVolume / setVolume (plays
       on this page too, so the slider is heard at once)
     • Pop-ups → PFGamification pointsPopup / streakPopup / dailyGoalPopup */
const { useState: useStateRS, useEffect: useEffectRS, useRef: useRefRS } = React;
const DSRS = window.ProfinityDesignSystem_c2b5cc;
const RS_WEB = !!window.PF_RS_WEB;
const ME_RS = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goRS(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function paramRS(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }
function retRS() {
  const r = paramRS("ret");
  if (r && /^[A-Za-z0-9_./?=&-]+$/.test(r)) return r;
  return RS_WEB ? "RewardsWeb.html" : "RewardsDashboard.html";
}
const SND = () => window.PFPointsSound || null;
const MUS = () => window.PFRewardsMusic || null;
const GAMI = () => window.PFGamification || null;

function readRS() {
  const s = SND(), m = MUS(), g = GAMI();
  const gg = g ? g.get() : { pointsPopup: true, streakPopup: true, dailyGoalPopup: true };
  return {
    sfxOn: s ? s.enabled() : true, sfxVol: s ? s.getVolume() : 1, theme: s ? s.getTheme() : "coin",
    musicOn: m ? m.wantsMusic() : true, musicVol: m ? m.getVolume() : 1, tune: m && m.getTune ? m.getTune() : "sunny",
    pointsPopup: gg.pointsPopup !== false, streakPopup: gg.streakPopup !== false, dailyGoalPopup: gg.dailyGoalPopup !== false
  };
}

/* ---- bits ---- */
/* cute switch (user, 2026-10-20 "make the toggle cute"): gold gradient track
   with tiny stars when on, a bouncy knob with a little face — smiling when
   on, dozing ("z") when off */
function SwitchRS({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={"rs-switch" + (on ? " on" : "")} onClick={() => onChange(!on)}>
      <span className="rs-switch-stars" aria-hidden="true"><i /><i /><i /></span>
      <span className="rs-switch-knob" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" className="rs-face">
          {on ? (
            <g className="rs-face-awake">
              <circle cx="8.5" cy="10" r="1.6" fill="#3D2A00" /><circle cx="15.5" cy="10" r="1.6" fill="#3D2A00" />
              <path d="M8 14.5 Q12 18.5 16 14.5" stroke="#3D2A00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <circle cx="5.6" cy="13.4" r="1.6" fill="#FF9AB0" opacity=".8" /><circle cx="18.4" cy="13.4" r="1.6" fill="#FF9AB0" opacity=".8" />
            </g>
          ) : (
            <g className="rs-face-asleep">
              <path d="M6.5 10.5 Q8.5 12 10.5 10.5" stroke="#8E8CA3" strokeWidth="1.7" fill="none" strokeLinecap="round" />
              <path d="M13.5 10.5 Q15.5 12 17.5 10.5" stroke="#8E8CA3" strokeWidth="1.7" fill="none" strokeLinecap="round" />
              <circle cx="12" cy="15.6" r="1.3" fill="#8E8CA3" />
              <text x="16" y="7.5" fontSize="6" fontWeight="800" fill="#B3B1C6" fontFamily="var(--font-sans)">z</text>
            </g>
          )}
        </svg>
      </span>
    </button>);
}
function SliderRS({ value, onInput, onCommit, label, disabled, icon }) {
  const pct = Math.round(value * 100);
  return (
    <div className={"rs-slider" + (disabled ? " is-disabled" : "")}>
      <span className="rs-slider-ic" aria-hidden="true"><DSRS.IconifyIcon name={pct === 0 ? "lucide:volume-x" : pct < 50 ? "lucide:volume-1" : "lucide:volume-2"} size={20} color="currentColor" /></span>
      <input type="range" min="0" max="100" step="5" value={pct} disabled={disabled} aria-label={label + " volume"} aria-valuetext={pct + "%"}
        onChange={(e) => onInput(+e.target.value / 100)}
        onPointerUp={(e) => onCommit && onCommit(+e.target.value / 100)} onKeyUp={(e) => onCommit && onCommit(+e.target.value / 100)} />
      <span className="rs-slider-pct">{pct}%</span>
    </div>);
}
function RowRS({ icon, tone, title, sub, right }) {
  return (
    <div className="rs-row">
      <span className={"rs-row-ic rs-row-ic-" + (tone || "gold")} aria-hidden="true"><DSRS.IconifyIcon name={icon} size={20} color="currentColor" /></span>
      <span className="rs-row-tx"><b>{title}</b>{sub ? <i>{sub}</i> : null}</span>
      {right}
    </div>);
}

function RewardsSettingsView() {
  const [st, setSt] = useStateRS(readRS);
  const previewT = useRefRS(null);
  useEffectRS(() => { const t = setTimeout(() => setSt(readRS()), 200); return () => clearTimeout(t); }, []); // engines may mount after us
  const patch = (p) => setSt((prev) => ({ ...prev, ...p }));

  /* sound effects */
  const setSfxOn = (on) => { const s = SND(); if (s) { on ? s.unmute() : s.mute(); } patch({ sfxOn: on }); if (on && s && s.preview) setTimeout(() => s.preview("points"), 60); };
  const setSfxVol = (v) => { const s = SND(); if (s) s.setVolume(v); patch({ sfxVol: v }); };
  const previewSfx = () => { const s = SND(); if (!s || !st.sfxOn) return; clearTimeout(previewT.current); previewT.current = setTimeout(() => s.preview && s.preview("points"), 120); };
  const setTheme = (id) => { const s = SND(); if (s) { s.setTheme(id); patch({ theme: id }); if (st.sfxOn && s.preview) s.preview("points", id); } };
  const themes = (SND() && SND().themes) ? SND().themes() : [];

  /* background music */
  const setMusicOn = (on) => { const m = MUS(); if (m) m.setOn(on); patch({ musicOn: on }); };
  const setMusicVol = (v) => { const m = MUS(); if (m) { m.setVolume(v); if (st.musicOn) m.start(); } patch({ musicVol: v }); };
  const setTune = (id) => { const m = MUS(); if (m && m.setTune) m.setTune(id); patch({ tune: id }); };
  const tunes = (MUS() && MUS().tunes) ? MUS().tunes() : [];

  /* pop-ups */
  const setGami = (k, on) => { const g = GAMI(); if (g) g.set({ [k]: on }); patch({ [k]: on }); };

  return (
    <div className="rs-body">
      <section className="ml-card rs-card" aria-label="Sound effects">
        <RowRS icon="lucide:sparkles" tone="gold" title="Sound effects" sub="Coin chimes, fanfares and the check-in welcome"
          right={<SwitchRS on={st.sfxOn} onChange={setSfxOn} label="Sound effects" />} />
        <SliderRS value={st.sfxVol} onInput={setSfxVol} onCommit={previewSfx} label="Sound effects" disabled={!st.sfxOn} />
        <div className="rs-sub">
          <span className="rs-sub-h">Chime style</span>
          <div className="rs-chips" role="radiogroup" aria-label="Chime style">
            {themes.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={st.theme === t.id} className={"rs-chip" + (st.theme === t.id ? " on" : "")} disabled={!st.sfxOn} onClick={() => setTheme(t.id)} title={t.desc}>{t.label}</button>
            ))}
          </div>
        </div>
        <button type="button" className="rs-test" disabled={!st.sfxOn} onClick={() => { const s = SND(); if (s && s.preview) s.preview("points"); }}>
          <DSRS.IconifyIcon name="lucide:play" size={16} color="currentColor" />Play a test sound
        </button>
      </section>

      <section className="ml-card rs-card" aria-label="Background music">
        <RowRS icon="lucide:music" tone="violet" title="Background music" sub="The little tune on the Rewards pages"
          right={<SwitchRS on={st.musicOn} onChange={setMusicOn} label="Background music" />} />
        <SliderRS value={st.musicVol} onInput={setMusicVol} label="Background music" disabled={!st.musicOn} />
        <div className="rs-sub">
          <span className="rs-sub-h">Tune</span>
          <div className="rs-chips rs-tunes" role="radiogroup" aria-label="Background tune">
            {tunes.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={st.tune === t.id} className={"rs-chip rs-tune" + (st.tune === t.id ? " on" : "")} disabled={!st.musicOn} onClick={() => setTune(t.id)}>
                <b>{t.label}</b><i>{t.desc}</i>
              </button>
            ))}
          </div>
        </div>
        <p className="rs-note">Plays only while you're on the Rewards pages. Pick a tune or slide to hear it change.</p>
      </section>

      <section className="ml-card rs-card" aria-label="Pop-ups">
        <RowRS icon="lucide:party-popper" tone="pink" title="Pop-ups" sub="Little celebrations when you earn" />
        <div className="rs-list">
          <div className="rs-item"><span><b>Points pop-up</b><i>"+15" when you earn points</i></span><SwitchRS on={st.pointsPopup} onChange={(v) => setGami("pointsPopup", v)} label="Points pop-up" /></div>
          <div className="rs-item"><span><b>Streak celebration</b><i>5 in a row and the daily welcome</i></span><SwitchRS on={st.streakPopup} onChange={(v) => setGami("streakPopup", v)} label="Streak celebration" /></div>
          <div className="rs-item"><span><b>Daily goal</b><i>When you reach the day's target</i></span><SwitchRS on={st.dailyGoalPopup} onChange={(v) => setGami("dailyGoalPopup", v)} label="Daily goal pop-up" /></div>
        </div>
      </section>

      <p className="rs-foot"><DSRS.IconifyIcon name="lucide:bell" size={14} color="currentColor" />Notification settings for everything else are under Account.</p>
    </div>
  );
}

/* ---- mobile shell ---- */
function useIsMobileRS() {
  const [mobile, setMobile] = useStateRS(() => window.matchMedia("(max-width:768px)").matches);
  useEffectRS(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}
function useDeviceScaleRS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRS(calc);
  useEffectRS(() => { const update = () => setScale(calc()); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update); }, []);
  return scale;
}
function useIsDarkRS() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateRS(read);
  useEffectRS(() => { const obs = new MutationObserver(() => setDark(read())); obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] }); return () => obs.disconnect(); }, []);
  return dark;
}
function RewardsSettingsScreen() {
  return (
    <div className="ml-screen rs-screen pf-funbg" data-screen-label="Rewards settings">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goRS(retRS())}><DSRS.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Rewards settings</h1>
        <span />
      </div>
      <div className="ml-scroll rs-scroll"><RewardsSettingsView /></div>
    </div>
  );
}
function RewardsSettingsMobile() {
  const mobile = useIsMobileRS();
  const scale = useDeviceScaleRS();
  const dark = useIsDarkRS();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><RewardsSettingsScreen /></div>;
  const IOSDevice = window.IOSDevice; // ios-frame.compiled.js global, as on every loyalty drill-in
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: "scale(" + scale + ")", transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><RewardsSettingsScreen /></IOSDevice>
      </div>
    </div>
  );
}
/* ---- web shell ---- */
function RewardsSettingsWeb() {
  const { TopNav } = DSRS;
  useEffectRS(() => { document.body.classList.add("pf-funbg"); return () => document.body.classList.remove("pf-funbg"); }, []);
  const navigate = (label) => { const u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html", Rewards: "RewardsWeb.html" }[label]; if (u) goRS(u); };
  return (
    <>
      <TopNav active="Rewards" user={ME_RS} logoSrc="assets/profinity-icon-purple-gold.png" onNavigate={navigate} style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />
      <div className="rs-page" data-screen-label="Rewards settings">
        <button type="button" className="rs-crumb" onClick={() => goRS(retRS())}><DSRS.IconifyIcon name="lucide:chevron-left" size={16} color="currentColor" />Back to Rewards</button>
        <h1 className="rs-page-title">Rewards settings</h1>
        <p className="rs-page-sub">Sounds, music and pop-ups for your points and rewards.</p>
        <RewardsSettingsView />
      </div>
    </>
  );
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(RS_WEB ? <RewardsSettingsWeb /> : <RewardsSettingsMobile />);
