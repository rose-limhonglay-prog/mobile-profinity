/* ===========================================================================
   PROfinity — Success Path UI (shared by mobile + web)
   Components over window.PFSuccessPath (success-path.js). Exposed as
   window.PFSuccessPathUI so host pages drop them in with one line:
     CourseCard   course-landing summary (placement option A, compact)
     PathView     milestones + activities (placement option A, full)
     PathSheet    full-screen PathView over the mobile course page
     LessonCard   "Builds towards…" activity card in a lesson (option B)
     Hub          the SuccessPath.html / SuccessPathWeb.html screen body
   Inline SVG icons only (no iconify preload needed). Classes prefixed sp-.
   Hooks suffixed SP because every page script shares one global scope.
   =========================================================================== */
const { useState: useStateSP, useEffect: useEffectSP, useRef: useRefSP } = React;
const SPE = window.PFSuccessPath;

/* ------------------------------------------------------------ icons -- */
const SP_PATHS = {
  check: "M20 6 9 17l-5-5",
  lock: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z",
  chevR: "m9 18 6-6-6-6",
  chevD: "m6 9 6 6 6-6",
  chevL: "m15 18-6-6 6-6",
  x: "M18 6 6 18M6 6l12 12",
  play: "M8 5v14l11-7z",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
  spark: "M12 3l1.8 4.9L19 9.7l-4.9 1.8L12 16.5l-1.8-5L5 9.7l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15V9a4 4 0 0 1 4-4h4M18 9v6a4 4 0 0 1-4 4h-4",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  undo: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3",
  arrowR: "M5 12h14M13 5l7 7-7 7",
  cal: "M3 5h18v16H3zM16 3v4M8 3v4M3 10h18",
  bot: "M12 8V4H8M4 12h16v8H4zM2 14v2M22 14v2M9 16h.01M15 16h.01"
};
function IcSP({ n, s = 16, c = "currentColor", w = 2 }) {
  return <svg className="sp-ic" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={SP_PATHS[n]} /></svg>;
}

/* ------------------------------------------------------------ state -- */
function useSP(slug) {
  const read = () => (SPE ? SPE.compute(slug) : null);
  const [s, setS] = useStateSP(read);
  useEffectSP(() => {
    if (!SPE) return;
    const sync = () => setS(read());
    window.addEventListener(SPE.EVT, sync);
    window.addEventListener("pf-lessons-done", sync);
    window.addEventListener("focus", sync);
    return () => { window.removeEventListener(SPE.EVT, sync); window.removeEventListener("pf-lessons-done", sync); window.removeEventListener("focus", sync); };
  }, [slug]);
  return s;
}
function fmtDateSP(iso) { try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); } catch (e) { return ""; } }
function fmtN(n) { return (+n || 0).toLocaleString("en-GB"); }

function RingSP({ pct, size = 64, stroke = 6, label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg className="sp-ring" width={size} height={size} viewBox={"0 0 " + size + " " + size} role="img" aria-label={pct + "% of skills ticked"}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--sp-track)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--sp-gold-strong)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"} style={{ transition: "stroke-dashoffset .6s ease" }} />
      <text x="50%" y="50%" dy=".35em" textAnchor="middle" className="sp-ring-n">{label != null ? label : pct + "%"}</text>
    </svg>);
}
function LevelPipsSP({ milestones }) {
  return (
    <div className="sp-pips" aria-hidden="true">
      {milestones.map((m) => <span key={m.id} className={"sp-pip sp-pip-" + m.status} title={"Level " + m.level + " · " + m.title}>{m.status === "achieved" ? <IcSP n="check" s={11} w={3} /> : m.level}</span>)}
    </div>);
}

/* float "+N" from an element */
function floatPtsSP(anchor, amount) {
  if (!anchor || !amount) return;
  try {
    const r = anchor.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "sp-float"; el.textContent = "+" + amount + " pts";
    el.style.left = (r.left + r.width / 2) + "px"; el.style.top = (r.top - 6) + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  } catch (e) {}
}

/* ------------------------------------------------------ tick confirm -- */
function TickSheetSP({ slug, activity, variant, onClose }) {
  const btn = useRefSP(null);
  if (!activity) return null;
  const yes = () => {
    const res = SPE.tick(slug, activity.id);
    if (res && res.points) floatPtsSP(btn.current, res.points);
    onClose(res);
  };
  return (
    <div className={"sp-overlay sp-overlay-" + variant} role="dialog" aria-modal="true" aria-label="Confirm skill" onClick={(e) => { if (e.target === e.currentTarget) onClose(null); }}>
      <div className="sp-sheet">
        <span className="sp-handle" aria-hidden="true" />
        <p className="sp-eyebrow">Level {activity.level} · {activity.id}</p>
        <h3 className="sp-sheet-t">Is this true in your clinic now?</h3>
        <p className="sp-quote">“{activity.text}”</p>
        <p className="sp-sheet-s">Only tick it once you've done it with a real patient. You can untick it later if it stops feeling true.</p>
        <div className="sp-sheet-pts"><IcSP n="spark" s={16} /> +{activity.points} points</div>
        <div className="sp-row">
          <button type="button" className="sp-btn sp-btn-ghost" onClick={() => onClose(null)}>Not yet</button>
          <button type="button" ref={btn} className="sp-btn sp-btn-gold" onClick={yes}><IcSP n="check" s={16} w={2.6} />Yes, tick it</button>
        </div>
      </div>
    </div>);
}

/* ------------------------------------------------------------- goal -- */
function GoalSheetSP({ slug, variant, onClose }) {
  const s = useSP(slug);
  const [m, setM] = useStateSP(() => (s && s.goal ? s.goal.milestone : (s && s.current ? s.current.id : "M1")));
  const [d, setD] = useStateSP(30);
  if (!s) return null;
  const save = () => {
    const date = new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
    SPE.setGoal(slug, m, date);
    onClose(true);
  };
  const skip = () => { SPE.markSeen(slug, "goalSkipped"); onClose(false); };
  const avail = s.milestones.filter((x) => x.status !== "upgrade");
  return (
    <div className={"sp-overlay sp-overlay-" + variant} role="dialog" aria-modal="true" aria-label="Set your goal" onClick={(e) => { if (e.target === e.currentTarget) skip(); }}>
      <div className="sp-sheet">
        <span className="sp-handle" aria-hidden="true" />
        <div className="sp-goal-ic"><IcSP n="target" s={22} /></div>
        <h3 className="sp-sheet-t">Set your 8D goal</h3>
        <p className="sp-sheet-s">Members who set a goal are <b>50% more likely</b> to reach it. Optional — takes 10 seconds.</p>
        <p className="sp-label">I want to reach</p>
        <div className="sp-chips">
          {avail.map((x) => <button type="button" key={x.id} className={"sp-chip" + (m === x.id ? " on" : "")} aria-pressed={m === x.id} onClick={() => setM(x.id)}>Level {x.level} · {x.title}</button>)}
        </div>
        <p className="sp-label">By</p>
        <div className="sp-chips">
          {[[14, "2 weeks"], [30, "1 month"], [90, "3 months"]].map(([n, l]) => <button type="button" key={n} className={"sp-chip" + (d === n ? " on" : "")} aria-pressed={d === n} onClick={() => setD(n)}>{l}</button>)}
        </div>
        <div className="sp-row">
          <button type="button" className="sp-btn sp-btn-ghost" onClick={skip}>Skip for now</button>
          <button type="button" className="sp-btn sp-btn-navy" onClick={save}><IcSP n="target" s={16} />Set goal</button>
        </div>
      </div>
    </div>);
}

/* ------------------------------------------------------- activity row -- */
function ActivityRowSP({ a, onTick, onOpenLesson, onUpgrade, slug }) {
  const lessonsLeft = a.lessonsTotal - a.lessonsDone;
  const firstLeft = (a.lessons || []).filter((n) => SPE.readDone().indexOf(n) === -1)[0];
  return (
    <li className={"sp-act sp-act-" + a.status}>
      <span className="sp-act-mk" aria-hidden="true">
        {a.status === "done" ? <IcSP n="check" s={14} w={3} /> : a.status === "ready" ? <IcSP n="spark" s={13} /> : <IcSP n="lock" s={12} />}
      </span>
      <div className="sp-act-body">
        <p className="sp-act-t">{a.text}</p>
        <p className="sp-act-meta">
          <span>{a.subCourse}</span><span className="sp-dot">·</span><span className="sp-act-pts">+{a.points} pts</span>
        </p>
        {a.status === "locked" &&
          <p className="sp-act-hint">
            Watch {lessonsLeft === 1 ? "1 more lesson" : lessonsLeft + " more lessons"} to unlock
            {firstLeft && onOpenLesson && <button type="button" className="sp-link" onClick={() => onOpenLesson(firstLeft)}><IcSP n="play" s={11} />{firstLeft}</button>}
            <button type="button" className="sp-link sp-demo" onClick={() => SPE.watchLessons(slug, a.id)} title="Prototype only">Demo: mark watched</button>
          </p>}
        {a.status === "upgrade" &&
          <p className="sp-act-hint">Part of the full 8D Lip Design path. <button type="button" className="sp-link" onClick={onUpgrade}>Unlock with Mastery</button></p>}
        {a.status === "done" &&
          <p className="sp-act-hint sp-ok">Ticked {fmtDateSP(a.tickedAt)} <button type="button" className="sp-link sp-quiet" onClick={() => SPE.untick(slug, a.id)} aria-label={"Untick " + a.id}><IcSP n="undo" s={11} />Untick</button></p>}
      </div>
      {a.status === "ready" && <button type="button" className="sp-tick" onClick={() => onTick(a)} aria-label={"Tick: " + a.text}>Tick</button>}
    </li>);
}

/* ------------------------------------------------------------ path -- */
function MilestoneSP({ m, open, onToggle, children, isGoal }) {
  return (
    <section className={"sp-ms sp-ms-" + m.status + (open ? " open" : "")}>
      <button type="button" className="sp-ms-hd" aria-expanded={open} onClick={onToggle}>
        <span className="sp-medal" aria-hidden="true">{m.status === "achieved" ? <IcSP n="trophy" s={20} /> : m.status === "upgrade" ? <IcSP n="lock" s={16} /> : <b>{m.level}</b>}</span>
        <span className="sp-ms-tx">
          <span className="sp-ms-k">Level {m.level} · {m.subStream}{isGoal && <em className="sp-goal-tag"><IcSP n="target" s={11} />Your goal</em>}</span>
          <span className="sp-ms-t">{m.title}</span>
          <span className="sp-bar"><span style={{ width: m.pct + "%" }} /></span>
          <span className="sp-ms-sub">
            {m.status === "achieved" ? "Achieved " + fmtDateSP(m.achievedAt) + " · +" + m.points + " pts" :
             m.status === "upgrade" ? m.total + " skills · locked" :
             m.done + " of " + m.total + " skills" + "" + " · " + m.points + " pts"}
          </span>
        </span>
        <IcSP n={open ? "chevD" : "chevR"} s={18} />
      </button>
      {open && <div className="sp-ms-body"><p className="sp-quote sp-quote-sm">“{m.statement}”</p>{children}</div>}
    </section>);
}

function PathView({ slug, variant = "mobile", onOpenLesson, onUpgrade, only, header = true }) {
  const s = useSP(slug);
  const [openId, setOpenId] = useStateSP(null);
  const [ticking, setTicking] = useStateSP(null);
  const [goalOpen, setGoalOpen] = useStateSP(false);
  useEffectSP(() => {
    if (!s || openId) return;
    const first = s.milestones.filter((m) => (!only || only.indexOf(m.id) !== -1) && (m.ready || m.status === "progress" || m.status === "open"))[0];
    setOpenId(first ? first.id : s.milestones[0].id);
  }, [!!s]);
  if (!s) return null;
  const upgrade = onUpgrade || (() => { window.location.href = "MembershipTier.html"; });
  const list = s.milestones.filter((m) => !only || only.indexOf(m.id) !== -1);
  const shown = only ? list.reduce((t, m) => t + m.total, 0) : s.total;
  const shownDone = only ? list.reduce((t, m) => t + m.done, 0) : s.done;
  const pct = shown ? Math.round(shownDone / shown * 100) : 0;
  return (
    <div className={"sp-root sp-path sp-" + variant}>
      {header &&
      <div className="sp-sum">
        <RingSP pct={pct} />
        <div className="sp-sum-tx">
          <p className="sp-eyebrow">{only ? "Free Starter Path" : "Success Path · " + s.title}</p>
          <p className="sp-sum-t">{s.current ? "Level " + s.current.level + " · " + s.current.title : "Path complete"}</p>
          <p className="sp-sum-s">{shownDone} of {shown} skills · <b>{fmtN(s.earned)}</b> pts earned</p>
        </div>
      </div>}
      {header && !only &&
        <button type="button" className={"sp-goal" + (s.goal ? " set" : "")} onClick={() => setGoalOpen(true)}>
          <IcSP n="target" s={16} />
          {s.goal && s.goalMilestone ? <span>Goal: <b>Level {s.goalMilestone.level}</b> by {fmtDateSP(s.goal.date)} {s.goalMilestone.status === "achieved" ? "· met 🎉" : "· " + (s.goalMilestone.total - s.goalMilestone.done) + " skills to go"}</span>
            : <span><b>Set a goal</b> — you're 50% more likely to get there</span>}
          <IcSP n="chevR" s={16} />
        </button>}
      <div className="sp-ms-list">
        {list.map((m) =>
          <MilestoneSP key={m.id} m={m} open={openId === m.id} onToggle={() => setOpenId(openId === m.id ? null : m.id)} isGoal={s.goal && s.goal.milestone === m.id}>
            <ul className="sp-acts">
              {m.activities.map((a) => <ActivityRowSP key={a.id} a={a} slug={slug} onTick={setTicking} onOpenLesson={onOpenLesson} onUpgrade={upgrade} />)}
            </ul>
          </MilestoneSP>)}
      </div>
      {ticking && <TickSheetSP slug={slug} activity={ticking} variant={variant} onClose={() => setTicking(null)} />}
      {goalOpen && <GoalSheetSP slug={slug} variant={variant} onClose={() => setGoalOpen(false)} />}
    </div>);
}

/* ------------------------------------------------ course card (opt A) -- */
function CourseCard({ slug, variant = "mobile", onOpen }) {
  const s = useSP(slug);
  if (!s) return null;
  return (
    <section className={"sp-root sp-card sp-coursecard sp-" + variant} data-screen-label="Success Path card">
      <div className="sp-cc-top">
        <span className="sp-cc-ic"><IcSP n="route" s={18} /></span>
        <div className="sp-cc-tx">
          <p className="sp-eyebrow">Success Path</p>
          <p className="sp-cc-t">{s.current ? "Level " + s.current.level + " · " + s.current.title : "All 5 levels achieved"}</p>
        </div>
        <RingSP pct={s.pct} size={48} stroke={5} />
      </div>
      <LevelPipsSP milestones={s.milestones} />
      <p className="sp-cc-s">{s.done} of {s.total} skills · {s.achieved} of {s.milestones.length} levels · <b>{fmtN(s.earned)}</b> pts</p>
      
      <button type="button" className="sp-btn sp-btn-navy sp-btn-block" onClick={onOpen}>View my Success Path<IcSP n="arrowR" s={16} /></button>
    </section>);
}

/* ------------------------------------------ full-screen sheet (mobile) -- */
function PathSheet({ slug, onClose, onOpenLesson }) {
  const s = useSP(slug);
  return (
    <div className="sp-root sp-fullsheet" role="dialog" aria-modal="true" aria-label="Success Path" data-screen-label="Success Path (course)">
      <header className="sp-fs-top">
        <button type="button" className="sp-iconbtn" aria-label="Back to course" onClick={onClose}><IcSP n="chevL" s={22} /></button>
        <h2>Success Path</h2>
        <a className="sp-iconbtn" href={"SuccessPath.html?course=" + slug} aria-label="Open Success Path hub"><IcSP n="route" s={18} /></a>
      </header>
      <div className="sp-fs-scroll">
        {/* same journey UI as the My Learning hub (user, 2026-10-06) */}
        {s && <div className="sp-hub2 sp-mobile sp-fs-hero"><HeroStatsSP s={s} only={null} /></div>}
        <PathJourney slug={slug} variant="mobile" onOpenLesson={onOpenLesson ? (n) => { onClose(); onOpenLesson(n); } : null} />
        <div style={{ height: 24 }} />
      </div>
    </div>);
}

/* ---------------------------------------------- lesson card (opt B) -- */
function LessonCard({ slug, lessonName, variant = "mobile", onOpenPath }) {
  const s = useSP(slug);
  const [ticking, setTicking] = useStateSP(null);
  if (!s) return null;
  const acts = s.activities.filter((a) => (a.lessons || []).indexOf(lessonName) !== -1);
  if (!acts.length) return null;
  return (
    <section className={"sp-root sp-card sp-lessoncard sp-" + variant} data-screen-label="Success Path · lesson skill">
      {acts.map((a) => {
        const m = s.milestones.filter((x) => x.id === a.milestone)[0];
        const left = a.lessonsTotal - a.lessonsDone;
        const thisDone = SPE.readDone().indexOf(lessonName) !== -1;
        const n = s.activities.indexOf(a) + 1;
        return (
          <div key={a.id} className={"sp-lc sp-lc-" + a.status}>
            <p className="sp-eyebrow"><IcSP n="route" s={12} /> Builds towards Level {m.level} · {m.title}</p>
            {/* same wording as the hub's skill cards: no "I can…" statement */}
            <p className="sp-lc-t2">Skill {n} of {s.activities.length} · {a.subCourse}</p>
            {a.status === "ready" && <p className="sp-lc-s"><IcSP n="spark" s={13} />Completing… · +{a.points} pts</p>}
            {a.status === "done" && <p className="sp-lc-s sp-ok"><IcSP n="check" s={14} w={3} />Completed {fmtDateSP(a.tickedAt)} · +{a.points} pts banked</p>}
            {a.status === "locked" && <p className="sp-lc-s"><IcSP n="lock" s={13} />{!thisDone ? (left === 1 ? "Complete this lesson to complete the skill" : "Complete this lesson and " + (left - 1) + " more to complete the skill") : "Complete " + left + " more linked " + (left === 1 ? "lesson" : "lessons") + " to complete the skill"}</p>}
            {a.status === "upgrade" && <p className="sp-lc-s"><IcSP n="lock" s={13} />Unlock the full 8D path to complete this skill</p>}
            <div className="sp-lc-foot">
              <span className="sp-mini-bar"><span style={{ width: m.pct + "%" }} /></span>
              <span>{m.done}/{m.total} skills in Level {m.level}</span>
              {onOpenPath && <button type="button" className="sp-link" onClick={onOpenPath}>View path<IcSP n="chevR" s={12} /></button>}
            </div>
          </div>);
      })}
      {ticking && <TickSheetSP slug={slug} activity={ticking} variant={variant} onClose={() => setTicking(null)} />}
    </section>);
}

/* ---------------------------------------------------------- coach -- */
function CoachCard({ slug, variant }) {
  const ask = () => {
    const prompt = "Help me set a realistic 8D Lip Design goal and tell me which skill to work on first.";
    if (window.PFAva && window.PFAva.open) window.PFAva.open(prompt);
    else window.location.href = variant === "web" ? "Agent.html" : "AgentMobile.html";
  };
  return (
    <section className="sp-root sp-card sp-coach">
      <span className="sp-coach-ic"><IcSP n="bot" s={20} /></span>
      <div>
        <p className="sp-eyebrow">Ava · your AI coach</p>
        <p className="sp-coach-t">Your biggest constraint right now: <b>clinical confidence with lips</b>.</p>
        <p className="sp-coach-s">From your onboarding answers (least confident: lip filler). I've routed you into the 8D Lip Design path — start with Level 1.</p>
        <button type="button" className="sp-link" onClick={ask}>Ask Ava about my plan<IcSP n="chevR" s={12} /></button>
      </div>
    </section>);
}

function SuggestedSP({ variant }) {
  const list = (SPE && SPE.SUGGESTED) || [];
  return list.map((p) =>
    <section key={p.slug} className="sp-root sp-card sp-suggest">
      <div className="sp-sg-top"><span className="sp-sg-lock"><IcSP n="lock" s={14} /></span><p className="sp-eyebrow">Suggested by Ava · {p.tier}</p></div>
      <p className="sp-sg-t">{p.title}</p>
      <p className="sp-sg-s">{p.why}</p>
      <p className="sp-sg-m">{p.milestones} levels · {p.activities} skills · content locked</p>
      <button type="button" className="sp-btn sp-btn-ghost sp-btn-block" onClick={() => { window.location.href = "MembershipTier.html"; }}>Upgrade to {p.tier} to unlock</button>
    </section>);
}

/* ------------------------------------------------------------- map -- */
/* Milestone-map view (user reference, 2026-10-05): one winding trail. Each
   level is a section; the lessons linked to a skill are the stones that lead
   to it; the skill card carries the "I can…" statement, step pips and the
   "This is true for me now" tick, which only unlocks once every linked
   lesson is complete. Same engine + state as the list view (PathView). */
const { useLayoutEffect: useLayoutEffectSP } = React;
function lessonMetaSP(slug) {
  const L = window.PFLearnShared;
  const cur = L && L.curriculum ? L.curriculum(slug) : null;
  const flat = cur && L.flatten ? L.flatten(cur) : [];
  const m = {};
  flat.forEach((l) => { m[l.name] = l; });
  return m;
}
function waypointsSP(s, only, done) {
  const wp = [];
  const seen = {};
  let n = 0;
  wp.push({ k: "start", id: "start", done: true });
  s.milestones.filter((m) => !only || only.indexOf(m.id) !== -1).forEach((m) => {
    wp.push({ k: "section", id: "sec-" + m.id, m: m, done: m.status === "achieved" });
    m.activities.forEach((a) => {
      (a.lessons || []).forEach((name) => {
        if (seen[name]) return;
        seen[name] = true;
        wp.push({ k: "lesson", id: "l-" + name, name: name, done: done.indexOf(name) !== -1, act: a });
      });
      n += 1;
      wp.push({ k: "act", id: "a-" + a.id, a: a, m: m, n: n, done: a.status === "done" });
    });
  });
  wp.push({ k: "finish", id: "finish", done: wp.every((w) => w.k === "section" || w.done), total: n });
  return wp;
}
function ActStatusSP({ a }) {
  const left = a.lessonsTotal - a.lessonsDone;
  return (
    <p className="sp-m-status">
      <span className="sp-m-pips" aria-hidden="true">{(a.lessons || []).map((n, i) => <i key={n} className={i < a.lessonsDone ? "on" : ""} />)}</span>
      {a.status === "done" ? "Ticked " + fmtDateSP(a.tickedAt) + " · +" + a.points + " pts" :
       a.status === "ready" ? "Every step done — tick it when it's true in clinic" :
       a.status === "upgrade" ? "Part of the full path" :
       left === 1 ? "1 step to go" : left + " steps to go"}
    </p>);
}
function PathMap({ slug, variant = "mobile", onOpenLesson, onUpgrade, only, nextRef }) {
  const s = useSP(slug);
  const [tickDone, setTickDone] = useStateSP(() => SPE.readDone());
  const trail = useRefSP(null);
  const svgRef = useRefSP(null);
  const pinRef = useRefSP(null);
  const [geom, setGeom] = useStateSP({ w: 0, h: 0, segs: [], pin: null });
  /* skill details live in a popover: hover on a pointer device, tap on touch
     (user, 2026-10-05 — "keep the map, show the details on hover") */
  const [open, setOpen] = useStateSP(null);
  const canHover = useRefSP(typeof matchMedia === "function" && matchMedia("(hover: hover)").matches);
  useEffectSP(() => {
    if (!open) return;
    const away = (e) => { if (!e.target.closest || !e.target.closest(".sp-m")) setOpen(null); };
    const key = (e) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("pointerdown", away); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", key); };
  }, [open]);
  useEffectSP(() => {
    const sync = () => setTickDone(SPE.readDone());
    window.addEventListener("pf-lessons-done", sync); window.addEventListener(SPE.EVT, sync);
    return () => { window.removeEventListener("pf-lessons-done", sync); window.removeEventListener(SPE.EVT, sync); };
  }, []);
  const done = tickDone;
  const wp = s ? waypointsSP(s, only, done) : [];
  const anchors = wp.filter((w) => w.k !== "section");
  const nextIdx = anchors.findIndex((w, i) => i > 0 && !w.done);
  const next = nextIdx > 0 ? anchors[nextIdx] : null;
  if (nextRef) nextRef.current = next;

  /* zigzag offsets + bezier connectors, re-measured on resize and state change */
  const layout = () => {
    const el = trail.current; if (!el) return;
    const W = el.clientWidth, narrow = W < 600;
    const rows = Array.from(el.querySelectorAll("[data-wp]"));
    rows.forEach((r) => {
      const idx = +r.dataset.wp, w = Math.min(+r.dataset.w, W), isAct = r.dataset.k === "act";
      const x = 0.5 + 0.45 * Math.sin(idx * 0.78);
      let pad = narrow ? (isAct ? 0 : x * 0.3 * (W - w)) : x * (W - w);
      if (isAct && !narrow) pad = (+r.dataset.n % 2 ? 0.08 : 0.5) * (W - w);
      r.style.paddingLeft = Math.max(0, pad) + "px";
      /* which side the details popover opens on: away from the nearer edge */
      if (isAct) r.dataset.side = narrow ? "below" : (pad > (W - w) / 2 ? "left" : "right");
    });
    const tr = el.getBoundingClientRect();
    const pts = Array.from(el.querySelectorAll(".sp-anchor")).map((a) => { const r = a.getBoundingClientRect(); return [r.left - tr.left + r.width / 2, r.top - tr.top + r.height / 2]; });
    const segs = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], dy = (b[1] - a[1]) / 2;
      segs.push({ d: "M" + a[0] + " " + a[1] + " C" + a[0] + " " + (a[1] + dy) + " " + b[0] + " " + (b[1] - dy) + " " + b[0] + " " + b[1], on: !!(anchors[i + 1] && anchors[i + 1].done) });
    }
    /* "You are here" floats above the next lesson stone. A ready skill needs
       no pin: its node pulses gold and its label already says "Ready to tick",
       and on the compact map a pin would sit on the neighbouring row. */
    const isActNext = !!(anchors[nextIdx] && anchors[nextIdx].k === "act");
    const pin = nextIdx > 0 && pts[nextIdx] && !isActNext ? { x: pts[nextIdx][0], y: pts[nextIdx][1] - 28, below: false } : null;
    setGeom({ w: W, h: el.scrollHeight, segs, pin });
  };
  /* observers registered once must call the latest layout (fresh anchors /
     next waypoint), not the closure from the first render */
  const layoutRef = useRefSP(layout);
  layoutRef.current = layout;
  useLayoutEffectSP(layout, [wp.length, done.length, s && s.done, s && s.ready, only ? only.join() : ""]);
  useEffectSP(() => {
    const run = () => layoutRef.current();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(run) : null;
    if (ro && trail.current) ro.observe(trail.current);
    window.addEventListener("resize", run);
    const t = setTimeout(run, 300);
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", run); clearTimeout(t); };
  }, []);
  if (!s) return null;
  const meta = lessonMetaSP(slug);
  const upgrade = onUpgrade || (() => { window.location.href = "MembershipTier.html"; });
  const toggle = (a, box) => {
    if (a.status === "done") { SPE.untick(slug, a.id); return; }
    if (a.status === "upgrade") { upgrade(); return; }
    if (a.status !== "ready") return;
    const res = SPE.tick(slug, a.id);
    if (res && res.points) floatPtsSP(box, res.points);
  };
  const stepLabel = (w) => {
    const l = meta[w.name];
    return l && l.dur ? (/^\d/.test(l.dur) ? l.dur.replace(/:\d\d$/, "") + " min lesson" : l.dur) : "Lesson";
  };
  let idx = -1;
  return (
    <div className={"sp-root sp-map sp-" + variant} ref={trail}>
      <svg className="sp-map-svg" width={geom.w} height={geom.h} aria-hidden="true">
        <defs><linearGradient id="spTrailGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--sp-gold-strong)" /><stop offset="1" stopColor="#FDC35D" /></linearGradient></defs>
        {geom.segs.map((sg, i) => <path key={"b" + i} className="sp-seg-base" d={sg.d} />)}
        {geom.segs.map((sg, i) => <path key={"f" + i} className={"sp-seg-fill" + (sg.on ? " on" : "")} d={sg.d} />)}
      </svg>
      {geom.pin && <span className={"sp-map-pin" + (geom.pin.below ? " below" : "")} ref={pinRef} style={{ left: geom.pin.x, top: geom.pin.y }}>{next && next.k === "act" && next.a.status === "ready" ? "Tick me" : "You are here"}</span>}
      {wp.map((w) => {
        if (w.k === "section") {
          return (
            <div key={w.id} id={"sp-" + w.id} className={"sp-map-sec sp-map-sec-" + w.m.status}>
              <p className="sp-eyebrow">Level {w.m.level} · {w.m.subStream}{w.m.status === "achieved" && <em className="sp-goal-tag"><IcSP n="trophy" s={11} />Achieved</em>}</p>
              <h2>{w.m.title}</h2>
              <p className="sp-map-sec-s">“{w.m.statement}”</p>
              <p className="sp-map-sec-m">{w.m.done} of {w.m.total} skills · {w.m.points} pts when all are ticked</p>
            </div>);
        }
        idx += 1;
        if (w.k === "start") return (
          <div key={w.id} className="sp-map-row" data-wp={idx} data-w="200" data-k="start"><div className="sp-map-node sp-map-start"><span className="sp-anchor sp-map-dot"><IcSP n="route" s={20} /></span><span>Start here</span></div></div>);
        if (w.k === "finish") return (
          <div key={w.id} className="sp-map-row" data-wp={idx} data-w="280" data-k="finish"><div className={"sp-map-node sp-map-finish" + (w.done ? " done" : "")}><span className="sp-anchor sp-map-dot"><IcSP n="trophy" s={24} /></span><span>{s.title} path complete<small>{w.done ? "All " + w.total + " skills ticked" : "Tick all " + w.total + " skills"}</small></span></div></div>);
        if (w.k === "lesson") return (
          <div key={w.id} id={"sp-" + w.id} className="sp-map-row" data-wp={idx} data-w="320" data-k="lesson">
            <button type="button" className={"sp-step" + (w.done ? " done" : "")} onClick={() => onOpenLesson && onOpenLesson(w.name)} aria-label={w.name + (w.done ? ", completed" : "")}>
              <span className="sp-anchor sp-stone">{w.done ? <IcSP n="check" s={16} w={3} /> : <IcSP n="play" s={14} />}</span>
              <span className="sp-step-tx"><b>{w.name}</b><i>{w.done ? "Completed" : stepLabel(w)}</i></span>
            </button>
          </div>);
        const a = w.a;
        const isOpen = open === a.id;
        const left = a.lessonsTotal - a.lessonsDone;
        const brief = a.status === "done" ? "Ticked · +" + a.points + " pts" : a.status === "ready" ? "Ready to tick" : a.status === "upgrade" ? "Locked · full path" : (left === 1 ? "1 step to go" : left + " steps to go");
        const hoverProps = canHover.current ? { onMouseEnter: () => setOpen(a.id), onMouseLeave: () => setOpen((o) => (o === a.id ? null : o)) } : {};
        return (
          <div key={w.id} id={"sp-" + w.id} className={"sp-map-row" + (isOpen ? " sp-row-open" : "")} data-wp={idx} data-w="330" data-k="act" data-n={w.n}>
            <div className={"sp-m sp-m-" + a.status + (isOpen ? " open" : "")} {...hoverProps}>
              <button type="button" className="sp-m-head" aria-expanded={isOpen} aria-controls={"sp-pop-" + a.id} onClick={() => setOpen(isOpen ? null : a.id)} onFocus={() => setOpen(a.id)}>
                <span className="sp-anchor sp-mnode" aria-hidden="true">{a.status === "done" ? <IcSP n="check" s={24} w={3} /> : a.status === "upgrade" ? <IcSP n="lock" s={18} /> : <b>{w.n}</b>}</span>
                <span className="sp-m-label"><b>“{a.text}”</b><i>Skill {w.n} of {s.total} · {brief}</i></span>
              </button>
              {isOpen &&
              <div className="sp-mcard sp-mpop" id={"sp-pop-" + a.id} role="dialog" aria-label={"Skill " + w.n}>
                <p className="sp-m-meta">Skill {w.n} of {s.total}<span className="sp-chip">{a.subCourse}</span></p>
                <p className="sp-m-ican">“{a.text}”</p>
                <ActStatusSP a={a} />
                <button type="button" className="sp-m-tick" role="checkbox" aria-checked={a.status === "done"} disabled={a.status === "locked"} onClick={(e) => toggle(a, e.currentTarget.querySelector(".sp-m-box"))}>
                  <span className="sp-m-box"><IcSP n="check" s={20} w={3} /></span>
                  <span className="sp-m-tick-tx"><strong>This is true for me now</strong>
                    <small>{a.status === "done" ? "Ticked — tap to untick" : a.status === "ready" ? "+" + a.points + " points" : a.status === "upgrade" ? "Unlock the full path to tick this skill" : "Unlocks when you finish the steps above"}</small></span>
                </button>
                {a.status === "locked" && <button type="button" className="sp-link sp-demo sp-m-demo" onClick={() => SPE.watchLessons(slug, a.id)} title="Prototype only">Demo: mark the steps watched</button>}
              </div>}
            </div>
          </div>);
      })}
    </div>);
}

/* sticky "Your progress" panel beside the map (web) / above it (mobile) */
/* ------------------------------------------------------- journey -- */
/* Straight vertical journey (user, 2026-10-05 — "the map is still
   confusing"): one spine, Level markers on it, each skill a station card
   that lists the lessons that unlock it and carries the tick. The current
   station (ready, or the next locked one) is open; ticked and future ones
   collapse to a single line. Same engine, same ids as the map, so the
   Up next card and level links scroll to the same places. */
function statusPillSP(a) {
  const left = a.lessonsTotal - a.lessonsDone;
  if (a.status === "done") return { cls: "done", text: "Completed" };
  if (a.status === "ready") return { cls: "ready", text: "Completing…" };
  if (a.status === "upgrade") return { cls: "lock", text: "Locked" };
  return { cls: "todo", text: left === 1 ? "1 lesson to watch" : left + " lessons to watch" };
}
/* No self-declared tick (user, 2026-10-05): the skill completes on its own
   once its lessons are watched in the course, and Dr Tim's splash takes over. */
/* 2026-10-07 (user): the card IS the task — eyebrow, the "I can…" statement,
   status pill and a tick box on the card itself. No body, no lesson rows, no
   auto-complete note. Tick/untick in place (SPE.tick force, no lesson gate). */
function JourneySkill({ a, n, total, slug, onUpgrade }) {
  const pill = statusPillSP(a);
  const isDone = a.status === "done";
  const tickToggle = (e) => {
    if (isDone) { SPE.untick(slug, a.id); return; }
    if (a.status === "upgrade") { onUpgrade && onUpgrade(); return; }
    const box = e.currentTarget;
    const res = SPE.tick(slug, a.id, { force: true });
    if (res && res.points) floatPtsSP(box, res.points);
  };
  return (
    <div id={"sp-a-" + a.id} className={"sp-j-item sp-j-skill sp-j-" + a.status + (isDone ? " done sp-m-done" : "")}>
      <span className="sp-j-node" aria-hidden="true">{isDone ? <IcSP n="check" s={18} w={3} /> : a.status === "upgrade" ? <IcSP n="lock" s={14} /> : <b>{n}</b>}</span>
      <div className="sp-j-card">
        <div className="sp-j-head sp-j-head-tick">
          <button type="button" className="sp-m-box sp-j-box" role="checkbox" aria-checked={isDone} aria-label={(isDone ? "Untick: " : "Tick: ") + a.text} onClick={tickToggle}>
            {a.status === "upgrade" && !isDone ? <IcSP n="lock" s={16} /> : <IcSP n="check" s={20} w={3} />}
          </button>
          <span className="sp-j-head-tx">
            <span className="sp-j-meta">Skill {n} of {total} · {a.subCourse}</span>
            <span className="sp-j-title">{a.text}</span>
          </span>
          <span className={"sp-j-pill sp-j-pill-" + pill.cls}>{pill.cls === "done" && <IcSP n="check" s={11} w={3} />}{pill.text}</span>
        </div>
      </div>
    </div>);
}
function PathJourney({ slug, variant = "mobile", onOpenLesson, onUpgrade, only }) {
  const s = useSP(slug);
  const [openIds, setOpenIds] = useStateSP(null);
  const [, bump] = useStateSP(0);
  /* ?skill=<id> (from the splash's "Proceed" on another page) and the
     splash's go-skill event on this page open that station and scroll to it */
  const focusSkill = (id) => {
    if (!id) return;
    setOpenIds((o) => (o || []).concat([id]));
    setTimeout(() => { const el = document.getElementById("sp-a-" + id); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 80);
  };
  useEffectSP(() => {
    const sync = () => bump((x) => x + 1);
    const onEvt = (e) => { sync(); if (e && e.detail && e.detail.type === "go-skill") focusSkill(e.detail.id); };
    window.addEventListener("pf-lessons-done", sync); window.addEventListener(SPE.EVT, onEvt);
    const want = new URLSearchParams(window.location.search).get("skill");
    if (want) setTimeout(() => focusSkill(want), 400);
    return () => { window.removeEventListener("pf-lessons-done", sync); window.removeEventListener(SPE.EVT, onEvt); };
  }, []);
  if (!s) return null;
  const meta = lessonMetaSP(slug);
  const upgrade = onUpgrade || (() => { window.location.href = "MembershipTier.html"; });
  const levels = levelListSP(s, only);
  const acts = [].concat.apply([], levels.map((m) => m.activities));
  const nextAct = acts.filter((a) => a.status === "ready")[0] || acts.filter((a) => a.status === "locked")[0] || null;
  /* open = the next skill to work on (plus anything the member or the splash opened) */
  const defaults = acts.filter((a) => a.status === "ready" || (nextAct && a.id === nextAct.id)).map((a) => a.id);
  const open = openIds ? defaults.concat(openIds.filter((id) => defaults.indexOf(id) === -1)).filter((id) => openIds.indexOf(id) !== -1 || !openIds.length || defaults.indexOf(id) !== -1) : defaults;
  const toggle = (id) => setOpenIds(open.indexOf(id) !== -1 ? open.filter((x) => x !== id) : open.concat([id]));
  const total = acts.length, doneN = acts.filter((a) => a.status === "done").length;
  let n = 0;
  return (
    <div className={"sp-root sp-j sp-" + variant}>
      <div className="sp-j-item sp-j-start done">
        <span className="sp-j-node sp-j-node-start" aria-hidden="true"><IcSP n="route" s={16} /></span>
        <p className="sp-j-startline">Start here · work down the path, one skill at a time</p>
      </div>
      {levels.map((m) =>
        <React.Fragment key={m.id}>
          <div id={"sp-sec-" + m.id} className={"sp-j-item sp-j-level sp-j-level-" + m.status + (m.status === "achieved" ? " done" : "")}>
            <span className="sp-j-node sp-j-medal" aria-hidden="true">{m.status === "achieved" ? <IcSP n="trophy" s={18} /> : m.status === "upgrade" ? <IcSP n="lock" s={14} /> : <b>{m.level}</b>}</span>
            <div className="sp-j-level-tx">
              <p className="sp-eyebrow">Level {m.level} · {m.subStream}</p>
              <h2>{m.title}</h2>
              <p className="sp-j-level-s">“{m.statement}”</p>
              <p className="sp-j-level-m">
                <span className="sp-bar"><span style={{ width: m.pct + "%" }} /></span>
                {m.status === "achieved" ? "Achieved " + fmtDateSP(m.achievedAt) + " · +" + m.points + " pts" : m.done + " of " + m.total + " skills · +" + m.points + " pts when all are ticked"}
              </p>
            </div>
          </div>
          {m.activities.map((a) => { n += 1; return (
            <JourneySkill key={a.id} a={a} n={n} total={total} slug={slug} onUpgrade={upgrade} />); })}
        </React.Fragment>)}
      <div className={"sp-j-item sp-j-finish" + (doneN === total ? " done" : "")}>
        <span className="sp-j-node sp-j-node-finish" aria-hidden="true"><IcSP n="trophy" s={20} /></span>
        <p className="sp-j-startline"><b>{doneN === total ? "Path complete" : s.title + " path complete"}</b><br />{doneN === total ? "All " + total + " skills ticked." : "Tick all " + total + " skills · " + doneN + " done so far"}</p>
      </div>
    </div>);
}

/* hub redesign (user, 2026-10-05): the numbers live in the hero, the levels
   in an overview strip, and this card is purely "what do I do next" */
function levelListSP(s, only) { return s.milestones.filter((m) => !only || only.indexOf(m.id) !== -1); }
function scrollToSP(id, block) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: block || "center" }); }
function HeroStatsSP({ s, only }) {
  const list = levelListSP(s, only);
  const total = list.reduce((t, m) => t + m.total, 0), done = list.reduce((t, m) => t + m.done, 0);
  const pct = total ? Math.round(done / total * 100) : 0;
  return (
    <div className="sp-hero-stats" data-screen-label="Your progress">
      <RingSP pct={pct} size={72} stroke={7} />
      <p className="sp-stat"><b>{done}<span className="sp-of">/{total}</span></b><span>skills completed</span></p>
      <p className="sp-stat"><b>{list.filter((m) => m.status === "achieved").length}<span className="sp-of">/{list.length}</span></b><span>levels achieved</span></p>
      <p className="sp-stat sp-stat-pts"><b>{fmtN(s.earned)}</b><span>points earned</span></p>
    </div>);
}
function LevelStrip({ s, only }) {
  const list = levelListSP(s, only);
  const current = s.current;
  return (
    <div className="sp-levels" role="list" aria-label="Levels">
      {list.map((m) =>
        <button type="button" role="listitem" key={m.id} className={"sp-lv sp-lv-" + m.status + (current && current.id === m.id ? " is-current" : "")} onClick={() => scrollToSP("sp-sec-" + m.id, "start")} aria-label={"Level " + m.level + " · " + m.title + " · " + m.done + " of " + m.total + " skills"}>
          <span className="sp-lv-top">
            <span className="sp-lv-medal" aria-hidden="true">{m.status === "achieved" ? <IcSP n="check" s={13} w={3} /> : m.status === "upgrade" ? <IcSP n="lock" s={11} /> : m.level}</span>
            <span className="sp-lv-k">Level {m.level}</span>
          </span>
          <span className="sp-lv-t">{m.title}</span>
          <span className="sp-bar"><span style={{ width: m.pct + "%" }} /></span>
          <span className="sp-lv-m">{m.status === "achieved" ? "Achieved · +" + m.points + " pts" : m.status === "upgrade" ? "Locked" : m.done + " of " + m.total + " skills"}</span>
        </button>)}
    </div>);
}
function ProgressPanel({ slug, only, nextRef, variant, onGoal }) {
  const s = useSP(slug);
  if (!s) return null;
  const list = levelListSP(s, only);
  const total = list.reduce((t, m) => t + m.total, 0), done = list.reduce((t, m) => t + m.done, 0);
  /* computed from state (not the map's ref): on mobile this card renders
     above the map, before the ref is filled */
  const anchors = waypointsSP(s, only, SPE.readDone()).filter((w) => w.k !== "section");
  const next = anchors.find((w, i) => i > 0 && !w.done) || null;
  return (
    <section className="sp-root sp-card sp-nextcard" data-screen-label="Up next">
      <p className="sp-eyebrow">Up next</p>
      {next ?
        <button type="button" className="sp-next" onClick={() => scrollToSP("sp-" + next.id)}>
          <small>{next.k === "act" ? (next.a.status === "ready" ? "Ready to tick · +" + next.a.points + " pts" : "Next skill") : next.k === "finish" ? "Almost there" : "Watch next"}</small>
          <b>{next.k === "lesson" ? next.name : next.k === "act" ? "“" + next.a.text + "”" : "Finish the path"}</b>
        </button> :
        <p className="sp-progress-done"><IcSP n="trophy" s={16} />Every skill on this path is ticked.</p>}
      {!only && onGoal &&
        <button type="button" className={"sp-goal" + (s.goal ? " set" : "")} onClick={onGoal}>
          <IcSP n="target" s={16} />
          {s.goal && s.goalMilestone ? <span>Goal: <b>Level {s.goalMilestone.level}</b> by {fmtDateSP(s.goal.date)} {s.goalMilestone.status === "achieved" ? "· met 🎉" : "· " + (s.goalMilestone.total - s.goalMilestone.done) + " skills to go"}</span>
            : <span><b>Set a goal</b> — you're 50% more likely to get there</span>}
          <IcSP n="chevR" s={16} />
        </button>}
      <p className="sp-nextcard-m">{done} of {total} skills ticked · <b>{fmtN(s.earned)}</b> pts earned</p>
    </section>);
}

/* ------------------------------------------------------------- hub -- */
function Hub({ slug = "8d-lip-design", variant = "mobile", onBack }) {
  const s = useSP(slug);
  const q = new URLSearchParams(window.location.search);
  const [tab, setTab] = useStateSP(() => (SPE && SPE.view() === "starter") || q.get("tab") === "starter" ? "starter" : "full");
  const [goalOpen, setGoalOpen] = useStateSP(() => q.get("goal") === "1");
  /* Map (default) or List; ?view=list opens the list. The map's "next up"
     waypoint is shared with the progress panel through a ref. */
  const [view, setView] = useStateSP(() => (q.get("view") === "list" ? "list" : "map"));
  const nextRef = useRefSP(null);
  if (!s) return null;
  const starter = s.view === "starter";
  const openLesson = (name) => {
    const cur = window.PFLearnShared && window.PFLearnShared.curriculum(slug);
    const flat = cur ? window.PFLearnShared.flatten(cur) : [];
    const l = flat.filter((x) => x.name === name)[0];
    const qs = l ? "&level=" + l.li + "&module=" + l.si + "&lesson=" + l.ni + (l.subIdx != null ? "&sub=" + l.subIdx : "") : "";
    window.location.href = (variant === "web" ? "LessonWeb.html?course=" : "CourseDetail.html?play=1&course=") + slug + qs;
  };
  const courseUrl = (variant === "web" ? "CourseWeb.html?course=" : "CourseDetail.html?course=") + slug;
  const only = tab === "starter" ? ["M1"] : null;
  const skillsN = levelListSP(s, only).reduce((t, m) => t + m.total, 0);
  const levelsN = levelListSP(s, only).length;
  return (
    <div className={"sp-root sp-hub sp-hub2 sp-" + variant}>
      <header className="sp-hero">
        <div className="sp-hero-tx">
          <p className="sp-eyebrow">Success Path · Clinical skills</p>
          <h1 className="sp-hub-t">{tab === "starter" ? "Free Starter Path" : s.title}</h1>
          <p className="sp-hub-s">{tab === "starter"
            ? "Five skills every lip injector needs, included with your Confidence membership. Your progress carries straight into the full 8D path."
            : skillsN + " skills across " + levelsN + " levels. Watch each skill's lessons in the course and it completes on its own — every skill and every level earns points."}</p>
          <div className="sp-paths" role="tablist" aria-label="Path">
            <button type="button" role="tab" aria-selected={tab === "full"} className={"sp-path-pill" + (tab === "full" ? " on" : "")} onClick={() => setTab("full")}>8D Lip Design</button>
            <button type="button" role="tab" aria-selected={tab === "starter"} className={"sp-path-pill" + (tab === "starter" ? " on" : "")} onClick={() => setTab("starter")}><IcSP n="gift" s={13} />Free Starter Path</button>
          </div>
        </div>
        <HeroStatsSP s={s} only={only} />
      </header>

      {tab === "full" && starter &&
        <div className="sp-card sp-starter-note warn"><IcSP n="lock" s={18} /><p><b>Viewing as a Tier 1 member without 8D Lip Design.</b> Level 1 is free; Levels 2–5 unlock with the course or Mastery.</p></div>}

      {/* web (user, 2026-10-05 — "place the map in the centre"): the side
          cards become a row under the hero and the path takes a centred column */}
      {variant === "web" &&
        <div className="sp-hub-row">
          <CoachCard slug={slug} variant={variant} />
          <SuggestedSP variant={variant} />
        </div>}
      <div className="sp-hub-grid">
        <div className="sp-hub-main">
          <div className="sp-map-head">
            <div>
              <h2 className="sp-h2">Your path</h2>
              <p>Each skill lists the lessons that unlock it. Watch them in the course and the skill completes on its own.</p>
            </div>
          </div>
          <PathJourney key={"journey-" + tab} slug={slug} variant={variant} only={only} onOpenLesson={openLesson} />
          <div className="sp-hub-links">
            <a className="sp-link" href={courseUrl}>Open the 8D Lip Design course<IcSP n="chevR" s={12} /></a>
          </div>
          {/* dev-only controls (user, 2026-10-05): Reset lives here, nowhere in the member UI */}
          <section className="sp-root sp-demo-card" data-screen-label="Dev only">
            <p className="sp-eyebrow">Dev only</p>
            <div className="sp-demo-row">
              <button type="button" className="sp-chip" onClick={() => { SPE.reset(slug); SPE.resetLessons(slug); }}><IcSP n="undo" s={12} />Reset path</button>
              <button type="button" className="sp-chip" onClick={() => { const n = (s.activities || []).filter((a) => a.status === "locked")[0]; if (n) SPE.watchLessons(slug, n.id); }}>Complete next skill's lessons</button>
              <button type="button" className="sp-chip" onClick={() => SPE.setView(starter ? "full" : "starter")}>{starter ? "View as 8D owner" : "View as Tier 1 (no 8D)"}</button>
              <button type="button" className="sp-chip" onClick={() => setGoalOpen(true)}>Goal sheet</button>
            </div>
          </section>
        </div>
        {variant !== "web" &&
          <aside className="sp-hub-side">
            <CoachCard slug={slug} variant={variant} />
            <SuggestedSP variant={variant} />
          </aside>}
      </div>
      {goalOpen && <GoalSheetSP slug={slug} variant={variant} onClose={() => setGoalOpen(false)} />}
    </div>);
}

window.PFSuccessPathUI = { CourseCard, PathView, PathMap, PathJourney, ProgressPanel, PathSheet, LessonCard, Hub, CoachCard, GoalSheet: GoalSheetSP, useSP, Icon: IcSP };
