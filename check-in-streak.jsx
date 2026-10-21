/* ===========================================================================
   PROfinity — Katy · Check-In Streak ("5 in a row") · iPhone 17 Pro Max
   Celebrates the consecutive daily check-in streak the Mobile Check-In
   guardrail asks for: five day-slots on a connected track, each one playing
   the blue streak-flame Lottie once the day is banked, presented by the
   coffee-break Dr Tim (assets/lottie/drtim-coffee.json, same ring crop as the
   header points pill). Redesigned 2026-10-13 as a light cream + gold hero
   with the check-in action inside it (navy hero kept for dark mode). Check-in and
   the Streak Master milestone both run through window.PFLoyalty.
   Suffixed -CIS to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateCIS, useEffect: useEffectCIS, useRef: useRefCIS, useMemo: useMemoCIS } = React;
const DSCIS = window.ProfinityDesignSystem_c2b5cc;
const PF_CIS = window.PFLoyalty;

/* slot character: the blue streak flame (lottie.host COmLSCf8Io — the same
   one the Rewards header streak pill plays). Replaced the cheering Dr Tim
   avatar (assets/lottie/checkin-happy.json) on 2026-10-20 at the user's
   request ("change the Dr Tim animation to the fire animation"). */
const CIS_LOTTIE = "https://lottie.host/9f92eeef-b540-4344-afb9-0ea438a4f381/COmLSCf8Io.json";
const CIS_SLOTS = 5;
const CIS_DAY = 86400000;

function goCIS(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* Fetch the raw JSON once and hand every slot its own copy (lottie-web mutates
   animationData, so five instances can't share one object). */
let cisLottieData = null;
function loadCisLottie() {
  if (!cisLottieData) cisLottieData = fetch(CIS_LOTTIE).then((r) => r.json());
  return cisLottieData;
}
function CisLottie({ size, delay }) {
  const host = useRefCIS(null);
  useEffectCIS(() => {
    let anim, timer, dead = false;
    loadCisLottie().then((data) => {
      const start = () => {
        if (dead || !window.lottie || !host.current) return;
        anim = window.lottie.loadAnimation({ container: host.current, renderer: "svg", loop: true, autoplay: false, animationData: JSON.parse(JSON.stringify(data)),
          /* the flame is a square scene — fit it inside the round slot */
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" } });
        timer = setTimeout(() => { if (!dead && anim) anim.play(); }, delay || 0);
      };
      if (window.lottie) start();
      else {
        const iv = setInterval(() => { if (window.lottie) { clearInterval(iv); start(); } }, 120);
        setTimeout(() => clearInterval(iv), 8000);
      }
    }).catch(() => { /* offline: the slot keeps its gold ring */ });
    return () => { dead = true; if (timer) clearTimeout(timer); if (anim) anim.destroy(); };
  }, [delay]);
  return <span ref={host} className="cis-lottie" style={{ width: size, height: size }} aria-hidden="true" />;
}

/* (the coffee-break Dr Tim presenter that sat beside the headline was removed 2026-10-14 at the user's request) */

function sameDayCIS(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function dayLabelCIS(d, today) {
  if (sameDayCIS(d, today)) return "Today";
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}

/* Build the five slots: the streak's most recent days fill from the left,
   anything still to come is an empty ring with its weekday initial. */
function buildSlotsCIS(streak) {
  const today = new Date();
  const last = streak.lastCheckIn ? new Date(streak.lastCheckIn) : today;
  const filled = Math.min(streak.current || 0, CIS_SLOTS);
  const slots = [];
  for (let i = 0; i < CIS_SLOTS; i++) {
    const done = i < filled;
    const d = done
      ? new Date(last.getTime() - (filled - 1 - i) * CIS_DAY)
      : new Date(last.getTime() + (i - filled + 1) * CIS_DAY);
    slots.push({ i, done, date: d, label: dayLabelCIS(d, today), today: sameDayCIS(d, today) });
  }
  return slots;
}

/* Streak-at-risk banner — same card as the Rewards dashboard's StreakRiskBanner
   (rewards-dashboard.jsx). The streak lapses 24h after the last check-in, so it
   shows once the member hasn't checked in for 12h+ and counts down live; an
   explicit riskDeadline (demo button / server nudge) wins. Checking in or
   freezing clears riskDeadline in the engine, which hides it. */
const CIS_STREAK_WINDOW_MS = 24 * 3600000;
const CIS_STREAK_WARN_MS = 12 * 3600000;
function cisStreakDeadline(streak) {
  if (!streak || !streak.current || streak.frozen) return null;
  if (streak.riskDeadline) return new Date(streak.riskDeadline).getTime();
  const last = streak.lastCheckIn ? new Date(streak.lastCheckIn).getTime() : 0;
  if (!last || Date.now() - last < CIS_STREAK_WARN_MS) return null;
  return last + CIS_STREAK_WINDOW_MS;
}
function fmtClockCIS(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
function CisNotifPreview({ hoursLabel, body }) {
  return (
    <div className="cis-notif-preview" role="note">
      <div className="cis-notif-icon"><DSCIS.IconifyIcon name="lucide:bell-ring" size={16} color="#292569" /></div>
      <div className="cis-notif-body"><div className="cis-notif-title">PROfinity <span>{hoursLabel}</span></div><div className="cis-notif-text">{body}</div></div>
    </div>
  );
}
function CisStreakRiskBanner({ streak }) {
  const [now, setNow] = useStateCIS(() => Date.now());
  useEffectCIS(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const deadline = cisStreakDeadline(streak);
  if (!deadline) return null;
  const days = streak.current;
  return (
    <section className="cis-risk-banner" aria-label={"Your " + days + "-day streak is at risk"}>
      <div className="cis-risk-head"><DSCIS.IconifyIcon name="lucide:flame" size={22} color="#3D2A00" /><span>Your {days}-Day Streak is at Risk!</span></div>
      <div className="cis-risk-clock" aria-live="off">Expires in {fmtClockCIS(deadline - now)}</div>
      <div className="cis-notif-stack">
        <CisNotifPreview hoursLabel="· 6h before" body={"Don't lose your " + days + "-day streak — check in before it expires!"} />
        <CisNotifPreview hoursLabel="· 2h before" body={"Last call! Your streak expires in 2 hours."} />
      </div>
    </section>
  );
}

/* ---- streak calendar (user, 2026-10-14): tapping the five-day track opens a
   month view of every check-in day. Days come from the ledger's
   evt_mobile_checkin entries plus the current consecutive run ending at
   streak.lastCheckIn (the engine keeps no per-day history beyond that). */
function cisKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function cisCheckedDays(state) {
  const set = new Set();
  (state.ledger || []).forEach((t) => { if (t.actionId === "evt_mobile_checkin" && t.ts) set.add(cisKey(new Date(t.ts))); });
  const streak = state.streak || {};
  if (streak.current && streak.lastCheckIn) {
    const last = new Date(streak.lastCheckIn);
    for (let i = 0; i < streak.current; i++) { const d = new Date(last); d.setDate(last.getDate() - i); set.add(cisKey(d)); }
  }
  return set;
}
function CisCalendarSheet({ open, onClose, state }) {
  const today = new Date();
  const [cursor, setCursor] = useStateCIS(() => new Date(today.getFullYear(), today.getMonth(), 1));
  useEffectCIS(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const checked = cisCheckedDays(state);
  const streak = state.streak || { current: 0, longest: 0 };
  const y = cursor.getFullYear(), m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;                 /* Monday-first grid */
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);
  const inMonth = cells.filter((d) => d && checked.has(cisKey(d))).length;
  const monthLabel = cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const isFutureMonth = y > today.getFullYear() || (y === today.getFullYear() && m >= today.getMonth());
  return (
    <div className="cis-scrim" onClick={onClose}>
      <div className="cis-sheet" role="dialog" aria-modal="true" aria-labelledby="cis-cal-title" onClick={(e) => e.stopPropagation()}>
        <span className="cis-sheet-handle" aria-hidden="true" />
        <div className="cis-cal-head">
          <button type="button" className="cis-cal-nav" aria-label="Previous month" onClick={() => setCursor(new Date(y, m - 1, 1))}><DSCIS.IconifyIcon name="lucide:chevron-left" size={18} color="currentColor" /></button>
          <h3 id="cis-cal-title">{monthLabel}</h3>
          <button type="button" className="cis-cal-nav" aria-label="Next month" disabled={isFutureMonth} onClick={() => setCursor(new Date(y, m + 1, 1))}><DSCIS.IconifyIcon name="lucide:chevron-right" size={18} color="currentColor" /></button>
        </div>
        <div className="cis-cal-dow" aria-hidden="true">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="cis-cal-grid" role="grid" aria-label={"Check-ins in " + monthLabel}>
          {cells.map((d, i) => {
            if (!d) return <span key={i} className="cis-cal-cell is-blank" aria-hidden="true" />;
            const k = cisKey(d); const done = checked.has(k); const isToday = sameDayCIS(d, today); const future = d > today && !isToday;
            const prevDone = checked.has(cisKey(new Date(y, m, d.getDate() - 1))) && d.getDay() !== 1;
            const nextDone = checked.has(cisKey(new Date(y, m, d.getDate() + 1))) && d.getDay() !== 0;
            return (
              <span key={i} role="gridcell" className={"cis-cal-cell" + (done ? " is-done" : "") + (isToday ? " is-today" : "") + (future ? " is-future" : "") + (done && prevDone ? " link-l" : "") + (done && nextDone ? " link-r" : "")}
                aria-label={d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) + (done ? ": checked in" : "")}>
                <span className="cis-cal-day">{done ? <DSCIS.IconifyIcon name="lucide:check" size={14} color="currentColor" /> : d.getDate()}</span>
              </span>
            );
          })}
        </div>
        <div className="cis-cal-stats">
          <div><b>{inMonth}</b><span>check-ins this month</span></div>
          <div><b>{streak.current || 0}</b><span>current streak</span></div>
          <div><b>{streak.longest || streak.current || 0}</b><span>longest streak</span></div>
        </div>
        <p className="cis-cal-note"><DSCIS.IconifyIcon name="lucide:flame" size={13} color="currentColor" />Gold days are check-ins. Keep them touching to grow the streak.</p>
        <button type="button" className="ml-btn ml-btn-navy cis-cal-ok" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

function CheckInStreakScreen() {
  const [config] = useStateCIS(() => PF_CIS.getConfig());
  const [state, setState] = useStateCIS(() => PF_CIS.getState());
  const [toast, setToast] = useStateCIS(null);
  /* ?calendar=1 opens the streak calendar straight away (demo / screenshots) */
  const [calOpen, setCalOpen] = useStateCIS(() => { try { return new URLSearchParams(location.search).get("calendar") === "1"; } catch (e) { return false; } });
  const refresh = () => setState(PF_CIS.getState());

  /* Stay in step with the rest of the prototype — the engine lives in localStorage. */
  useEffectCIS(() => {
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const streak = state.streak || { current: 0, longest: 0 };
  const current = streak.current || 0;
  const slots = useMemoCIS(() => buildSlotsCIS(streak), [streak.current, streak.lastCheckIn]);
  const rowComplete = current >= CIS_SLOTS;
  const checkedInToday = !!streak.lastCheckIn && sameDayCIS(new Date(streak.lastCheckIn), new Date());

  const action = config.actions.find((a) => a.id === "evt_mobile_checkin");
  const tier = state.user.membershipTier;
  const projected = action ? Math.round(action.basePoints * PF_CIS.tierMultiplierFor(action, tier)) : 0;

  const master = (config.achievementBadges || config.achievements || []).find((a) => a.key === "streak_master") || { name: "Streak Master", criteria: { count: 30 }, reward: "" };
  const target = master.criteria.count;
  const toGo = Math.max(0, target - current);
  const pct = Math.min(100, Math.round((current / target) * 100));

  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2600); };

  const checkIn = () => {
    if (!action || checkedInToday) return;
    const res = PF_CIS.completeAction(action.id);
    refresh();
    if (res.capped) { flash(action.label + ": " + res.capReason); return; }
    flash("Checked in · +" + res.pointsAwarded + " pts");
    try { window.dispatchEvent(new CustomEvent("pf:points-earned", { detail: { amount: res.pointsAwarded, label: action.label, actionId: action.id, booked: true } })); } catch (e) { /* older WebView */ }
    if (window.PFRewards) window.PFRewards.fromAction(res); else if (res.leveledUp) setTimeout(() => goCIS("MilestoneSplash.html"), 900);
  };

  const headline = current === 0
    ? <>Start your <b>streak</b></>
    : <><b>{current}</b> in a row!</>;
  const sub = current === 0
    ? "Check in today to start your streak. Five days running clears the Mobile Check-In guardrail."
    : rowComplete
      ? (checkedInToday ? "Five days running and the Mobile Check-In guardrail is cleared. Come back tomorrow to keep the row alive." : "Five days running. Check in today to make it " + (current + 1) + " and keep the row alive.")
      : (CIS_SLOTS - current) + " more " + (CIS_SLOTS - current === 1 ? "day" : "days") + " to make it five in a row.";

  return (
    <div className="ml-screen cis-screen pf-funbg" data-screen-label="Check-In Streak">
      <div className="ml-top">
        <button className="ml-back" aria-label="Back" onClick={() => goCIS("RewardsDashboard.html")}><DSCIS.IconifyIcon name="lucide:chevron-left" size={24} color="var(--gray-900)" /></button>
        <h1>Check-In Streak</h1>
        <span />
      </div>
      <div className="ml-scroll cis-scroll">
        <section className="cis-hero" aria-label={current + " day check-in streak"}>
          <div className="cis-hero-top">
            {/* streak calendar lives top-right of the hero (user, 2026-10-14) */}
            <button type="button" className="cis-cal-btn" aria-label="View streak calendar" aria-haspopup="dialog" aria-expanded={calOpen} onClick={() => setCalOpen(true)}>
              <DSCIS.IconifyIcon name="lucide:calendar-days" size={20} color="currentColor" />
            </button>
            <div className="cis-hero-tx">
              <div className="cis-kicker"><DSCIS.IconifyIcon name="lucide:flame" size={12} color="currentColor" /> Daily check-in</div>
              <h2>{headline}</h2>
              <p className="cis-hero-sub">{sub}</p>
            </div>
          </div>

          <button type="button" className="cis-row" aria-label="Last five check-in days. Open the streak calendar" aria-haspopup="dialog" aria-expanded={calOpen} onClick={() => setCalOpen(true)}>
            {slots.map((s) => (
              <React.Fragment key={s.i}>
                {s.i > 0 && <span className={"cis-link" + (s.done ? " on" : "")} aria-hidden="true" />}
                <span className={"cis-slot" + (s.done ? " is-done" : "") + (s.today ? " is-today" : "")} style={{ "--d": (s.i * 110) + "ms" }}>
                  <span className="cis-slot-art">
                    {s.done
                      ? <><CisLottie size={50} delay={s.i * 180} /><span className="cis-slot-tick"><DSCIS.IconifyIcon name="lucide:check" size={11} color="#fff" /></span></>
                      : <span className="cis-slot-empty">{s.label === "Today" ? <DSCIS.IconifyIcon name="lucide:calendar-check" size={20} color="currentColor" /> : s.date.toLocaleDateString("en-GB", { weekday: "narrow" })}</span>}
                  </span>
                  <span className="cis-slot-day">{s.label}</span>
                </span>
              </React.Fragment>
            ))}
          </button>


          <div className="cis-act">
            {/* no "Checked in today" pill once booked — just the note (user, 2026-10-14) */}
            {!checkedInToday && <button className="ml-btn ml-btn-navy cis-cta" type="button" onClick={checkIn} aria-label={"Check in today for " + projected + " points"}><DSCIS.IconifyIcon name="lucide:zap" size={18} color="currentColor" /> Check in today <span className="cis-cta-pts">· +{projected} pts</span></button>}
            <p className="cis-cta-note">{checkedInToday ? "Your streak is safe until tomorrow." : "Check in once a day to keep the row growing."}</p>
          </div>
        </section>

        <CisStreakRiskBanner streak={streak} />

        <div className="ml-card cis-stats" aria-label="Streak stats">
          <div className="cis-stat">
            <span className="cis-stat-ico"><DSCIS.IconifyIcon name="lucide:flame" size={16} color="currentColor" /></span>
            <span className="cis-stat-value">{current} {current === 1 ? "day" : "days"}</span>
            <span className="cis-stat-label">Current streak</span>
          </div>
          <div className="cis-stat">
            <span className="cis-stat-ico"><DSCIS.IconifyIcon name="lucide:trophy" size={16} color="currentColor" /></span>
            <span className="cis-stat-value">{streak.longest || current} days</span>
            <span className="cis-stat-label">Longest streak</span>
          </div>
          <div className="cis-stat">
            <span className="cis-stat-ico"><DSCIS.IconifyIcon name="lucide:zap" size={16} color="currentColor" /></span>
            <span className="cis-stat-value">+{projected}</span>
            <span className="cis-stat-label">Pts per check-in</span>
          </div>
        </div>

        <div className="ml-sec-h"><h2>Next milestone</h2></div>
        <div className="ml-card cis-milestone">
          <div className="cis-milestone-head">
            <span className="cis-milestone-ico"><DSCIS.IconifyIcon name={master.icon || "lucide:flame"} size={20} color="currentColor" /></span>
            <span className="cis-milestone-main"><span className="ti">{master.name} badge</span><span className="su">{master.description || ("Reach a " + target + "-day check-in streak.")}</span></span>
            <span className="cis-milestone-count">{Math.min(current, target)}<small>/{target}</small></span>
          </div>
          <div className="ml-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={target} aria-valuenow={Math.min(current, target)}><div className="ml-progress-fill" style={{ width: pct + "%" }} /></div>
          <div className="cis-milestone-foot">{toGo > 0 ? <><b>{toGo} more {toGo === 1 ? "day" : "days"}</b>{master.reward ? " unlocks " + master.reward : ""}</> : <><b>Unlocked</b>{master.reward ? " — " + master.reward : ""}</>}</div>
        </div>

        <div className="ml-demo-bar">
          <button className="ml-demo-btn" type="button" onClick={() => { PF_CIS.setState({ streak: Object.assign({}, streak, { current: 3, lastCheckIn: new Date(Date.now() - 20 * 3600000).toISOString(), frozen: false }) }); refresh(); }}>Demo: 3 of 5</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_CIS.setState({ streak: Object.assign({}, streak, { current: 5, lastCheckIn: new Date(Date.now() - 20 * 3600000).toISOString(), frozen: false }) }); refresh(); }}>Demo: 5 in a row</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_CIS.setStreakAtRisk(6); refresh(); }}>Demo: streak at risk</button>
          <button className="ml-demo-btn" type="button" onClick={() => { PF_CIS.resetDemo(); refresh(); flash("Demo data reset."); }}>Reset demo data</button>
        </div>
        <div style={{ height: 8 }} />
      </div>
      <CisCalendarSheet open={calOpen} onClose={() => setCalOpen(false)} state={state} />
      {toast && <div className="ml-toast" role="status"><DSCIS.IconifyIcon name="lucide:zap" size={16} color="#fff" />{toast}</div>}
    </div>
  );
}

function useDeviceScaleCIS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateCIS(calc);
  useEffectCIS(() => { const u = () => setScale(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return scale;
}
function useIsMobileCIS() {
  const [mobile, setMobile] = useStateCIS(() => window.matchMedia("(max-width:768px)").matches);
  useEffectCIS(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setMobile(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return mobile;
}
/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkCIS() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateCIS(read);
  useEffectCIS(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

function CheckInStreakApp() {
  const mobile = useIsMobileCIS();
  const scale = useDeviceScaleCIS();
  const dark = useIsDarkCIS();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><CheckInStreakScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><CheckInStreakScreen /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CheckInStreakApp />);
