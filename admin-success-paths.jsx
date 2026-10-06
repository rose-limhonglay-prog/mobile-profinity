/* ===========================================================================
   PROfinity — Admin · Success Paths (content upload)
   The making team's 4-column handoff — activity · sub-course · milestone link
   · point value — edited in place or imported as CSV, validated against the
   course's modules, and published to members (PFSuccessPath.setContent →
   pf-sp-content-v1; the member pages re-read it live).
   Reuses the Admin Courses shell (admin-courses.css, crs- classes).
   Suffixed -ASP (shared global scope).
   =========================================================================== */
const { useState: useStateASP, useMemo: useMemoASP } = React;
const SPA = window.PFSuccessPath;
function goASP(u) { (window.pfGo || function (x) { window.location.href = x; })(u); }

/* Live 8D modules (Staging course 2616a619…, 20 modules) — sub-course must match one. */
const ASP_MODULES = ["Introduction", "Chapter 1: Establishing the Patient Goals", "Sculpting", "4mm", "Chapter 2: Establishing the Patient Risks", "Tenting",
  "Chapter 3: Aesthetic Analysis", "Chapter 4: Lip Anatomy", "Cannula", "Russian Lips", "Chapter 5: The Technical Core of Lip Injection", "Chapter 6: Technique Critique",
  "Restoration", "Chapter 7: Material Science and Tools", "Botulinum Toxin", "Chapter 8: Decision Making and Consent", "8D Lips Case Studies", "8D Profit Mini Course",
  "1 Minute Techniques At A Peak Guides", "Consultation Success Blueprint"];
const ASP_STREAMS = ["Consultation", "Injecting", "Side effects", "Complications"];

/* Same sidebar as the other admin pages (CRS_NAV in admin-courses.jsx), with
   Success Paths sitting under Courses as the active row. */
const ASP_NAV = [["lucide:layout-grid", "Dashboard", "AdminDashboard.html"], ["lucide:user", "Users", "AdminUsers.html"],
  ["lucide:file-text", "Posts Management", "AdminPostsManagement.html"], ["lucide:layout-dashboard", "Content Moderation", "AdminModeration.html"],
  ["lucide:life-buoy", "Service Requests", "AdminServiceRequests.html"], ["lucide:shield-check", "Verification", "AdminVerification.html"],
  ["lucide:users-round", "Agents", "AdminAgents.html"], ["lucide:calendar", "Events", "AdminEvents.html"], ["lucide:map", "Product Mapping", "AdminProductMapping.html"],
  ["lucide:bar-chart-3", "Analytics", "AdminAnalytics.html"], ["lucide:smartphone", "App Versions", "AdminAppVersions.html"], ["lucide:bell", "Push Notification", "AdminPushNotifications.html"],
  ["lucide:badge-check", "Badges", "AdminBadges.html"], ["lucide:clipboard-list", "Quizzes & Surveys", "AdminQuizEditor.html"], ["lucide:trophy", "Loyalty & Gamification", "AdminActionsEditor.html"],
  ["lucide:scroll-text", "Points Ledger", "AdminAuditLedger.html"], ["lucide:receipt-text", "Transactions", "AdminTransactions.html"],
  ["lucide:table-2", "Courses", "AdminCourses.html"], ["lucide:route", "Success Paths", null], ["lucide:users", "Community", "AdminCommunity.html"]];

function csvEsc(v) { v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
function parseCsv(text) {
  const rows = []; let row = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

function validate(ms, acts) {
  const errs = {};
  const mIds = ms.map((m) => m.id);
  acts.forEach((a, i) => {
    const e = [];
    if (!a.text || a.text.trim().length < 8) e.push("Activity text too short");
    if (ASP_MODULES.indexOf(a.subCourse) === -1) e.push("Sub-course doesn't match a module");
    if (mIds.indexOf(a.milestone) === -1) e.push("Unknown milestone");
    const p = +a.points; if (!(p >= 10 && p <= 100 && Math.round(p) === p)) e.push("Points 10–100");
    if (e.length) errs["a" + i] = e;
  });
  ms.forEach((m, i) => {
    const e = [];
    const n = acts.filter((a) => a.milestone === m.id).length;
    if (n < 2) e.push("Needs ≥ 2 activities");
    const p = +m.points; if (!(p >= 100 && p <= 500)) e.push("Points 100–500");
    if (!m.title) e.push("Title required");
    if (e.length) errs["m" + i] = e;
  });
  return errs;
}

function AdminSuccessPathsApp() {
  const slug = "8d-lip-design";
  const start = SPA.getContent(slug);
  const defaults = SPA.getDefaults(slug);
  const lessonMap = useMemoASP(() => { const m = {}; defaults.activities.forEach((a) => { (m[a.subCourse] = m[a.subCourse] || []).push.apply(m[a.subCourse], a.lessons); }); return m; }, []);
  const [ms, setMs] = useStateASP(start.milestones);
  const [acts, setActs] = useStateASP(start.activities);
  const [dirty, setDirty] = useStateASP(false);
  const [toast, setToast] = useStateASP(start.customised ? "Showing your published version" : null);
  const [csvOpen, setCsvOpen] = useStateASP(false);
  const [csvText, setCsvText] = useStateASP("");
  const errs = validate(ms, acts);
  const errCount = Object.keys(errs).length;
  const actPts = acts.reduce((s, a) => s + (+a.points || 0), 0), msPts = ms.reduce((s, m) => s + (+m.points || 0), 0);
  const say = (t) => { setToast(t); setTimeout(() => setToast(null), 2600); };

  const setA = (i, k, v) => { setActs(acts.map((a, j) => j === i ? { ...a, [k]: k === "points" ? v.replace(/[^0-9]/g, "") : v } : a)); setDirty(true); };
  const setM = (i, k, v) => { setMs(ms.map((m, j) => j === i ? { ...m, [k]: k === "points" ? v.replace(/[^0-9]/g, "") : v } : m)); setDirty(true); };
  const addRow = () => { setActs(acts.concat([{ id: "", milestone: ms[0].id, text: "", subCourse: ASP_MODULES[1], points: "40", lessons: [] }])); setDirty(true); };
  const delRow = (i) => { setActs(acts.filter((_, j) => j !== i)); setDirty(true); };

  const normalise = () => {
    const counters = {};
    return acts.map((a) => {
      const m = ms.filter((x) => x.id === a.milestone)[0];
      const lvl = m ? m.level : 0;
      counters[lvl] = (counters[lvl] || 0) + 1;
      const keep = defaults.activities.filter((d) => d.text === a.text)[0];
      return { ...a, id: "A" + lvl + "." + counters[lvl], points: +a.points, lessons: a.lessons && a.lessons.length ? a.lessons : keep ? keep.lessons : (lessonMap[a.subCourse] || []).slice(0, 1) };
    });
  };
  const publish = () => {
    if (errCount) { say("Fix " + errCount + " issue" + (errCount === 1 ? "" : "s") + " before publishing"); return; }
    const out = normalise();
    SPA.setContent(slug, { milestones: ms.map((m) => ({ ...m, points: +m.points })), activities: out });
    setActs(out); setDirty(false); say("Published — live on the 8D course, lessons and hub");
  };
  const exportCsv = () => {
    const lines = [["activity", "sub_course", "milestone", "points"].join(",")].concat(acts.map((a) => [a.text, a.subCourse, a.milestone, a.points].map(csvEsc).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const el = document.createElement("a"); el.href = url; el.download = "8d-lip-design-success-path.csv"; el.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importCsv = () => {
    const rows = parseCsv(csvText);
    if (!rows.length) { say("Nothing to import"); return; }
    const head = rows[0].map((h) => h.trim().toLowerCase());
    const body = /activity/.test(head[0]) ? rows.slice(1) : rows;
    const next = body.map((r) => ({ id: "", text: (r[0] || "").trim(), subCourse: (r[1] || "").trim(), milestone: (r[2] || "").trim().toUpperCase(), points: String(r[3] || "").trim(), lessons: [] }));
    setActs(next); setDirty(true); setCsvOpen(false); setCsvText(""); say("Imported " + next.length + " rows — review, then publish");
  };
  const resetAll = () => { SPA.resetContent(slug); const d = SPA.getDefaults(slug); setMs(d.milestones); setActs(d.activities); setDirty(false); say("Reset to the PRD draft"); };

  return (
    <div className="crs-shell">
      <aside className="crs-sidebar">
        <div className="crs-logo"><img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" /></div>
        {ASP_NAV.map(([ic, label, href]) =>
          <button key={label} type="button" className={"crs-navitem" + (!href ? " is-active" : "")} onClick={href ? () => goASP(href) : undefined}>
            <iconify-icon icon={ic}></iconify-icon><span>{label}</span>
          </button>)}
      </aside>
      <main className="crs-main">
        <header className="crs-header">
          <span className="crs-header-title">Courses · Success Paths</span>
          <div className="crs-spacer" />
          <div className="crs-user"><div className="crs-user-name">Dr Tim Pearce</div><div className="crs-user-role">Admin</div></div>
          <img className="crs-user-avatar" src="assets/avatar-drtim.png" alt="" />
        </header>
        <div className="crs-content asp">
          <div className="crs-page-head">
            <div>
              <h2>Success Paths</h2>
              <p className="asp-sub">Clinical · Technique Library · <b>8D Lip Design</b> (POC). Upload the making team's 4-column sheet, check it, publish.</p>
            </div>
            <div className="asp-actions">
              <button className="crs-btn asp-ghost" type="button" onClick={() => setCsvOpen(true)}><iconify-icon icon="lucide:upload"></iconify-icon>Import CSV</button>
              <button className="crs-btn asp-ghost" type="button" onClick={exportCsv}><iconify-icon icon="lucide:download"></iconify-icon>Export CSV</button>
              <button className="crs-btn asp-ghost" type="button" onClick={resetAll}>Reset</button>
              <button className="crs-btn crs-btn-navy" type="button" onClick={publish} disabled={!dirty && !errCount}><iconify-icon icon="lucide:send"></iconify-icon>{dirty ? "Publish changes" : "Published"}</button>
            </div>
          </div>

          <div className="asp-stats">
            <div className="asp-stat"><b>{ms.length}</b><span>Milestones</span></div>
            <div className="asp-stat"><b>{acts.length}</b><span>Activities</span></div>
            <div className="asp-stat"><b>{(actPts + msPts).toLocaleString("en-GB")}</b><span>Points available</span></div>
            <div className={"asp-stat" + (errCount ? " bad" : " good")}><b>{errCount || "✓"}</b><span>{errCount ? "Issues to fix" : "Ready to publish"}</span></div>
          </div>

          <div className="crs-card asp-card">
            <div className="crs-card-head"><span className="crs-card-title">Milestones</span><span className="asp-hint">Achieved automatically when all linked activities are ticked</span></div>
            <table className="asp-table">
              <thead><tr><th>ID</th><th>Level</th><th>Title</th><th>Proficiency statement</th><th>Sub-stream</th><th>Activities</th><th>Points</th></tr></thead>
              <tbody>{ms.map((m, i) =>
                <tr key={m.id} className={errs["m" + i] ? "err" : ""}>
                  <td className="mono">{m.id}</td><td>{m.level}</td>
                  <td><input value={m.title} onChange={(e) => setM(i, "title", e.target.value)} /></td>
                  <td><input value={m.statement} onChange={(e) => setM(i, "statement", e.target.value)} /></td>
                  <td><select value={m.subStream} onChange={(e) => setM(i, "subStream", e.target.value)}>{ASP_STREAMS.map((s) => <option key={s}>{s}</option>)}</select></td>
                  <td>{acts.filter((a) => a.milestone === m.id).length}{errs["m" + i] && <em>{errs["m" + i].join(" · ")}</em>}</td>
                  <td><input className="num" value={m.points} onChange={(e) => setM(i, "points", e.target.value)} /></td>
                </tr>)}</tbody>
            </table>
          </div>

          <div className="crs-card asp-card">
            <div className="crs-card-head"><span className="crs-card-title">Activities — the 4-column handoff</span><button className="crs-text-btn" type="button" onClick={addRow}>+ Add activity</button></div>
            <table className="asp-table">
              <thead><tr><th>#</th><th>Activity ("I can …")</th><th>Sub-course (module)</th><th>Milestone</th><th>Points</th><th></th></tr></thead>
              <tbody>{acts.map((a, i) =>
                <tr key={i} className={errs["a" + i] ? "err" : ""}>
                  <td className="mono">{a.id || "new"}</td>
                  <td><input value={a.text} onChange={(e) => setA(i, "text", e.target.value)} placeholder="I can …" />{errs["a" + i] && <em>{errs["a" + i].join(" · ")}</em>}</td>
                  <td><select value={ASP_MODULES.indexOf(a.subCourse) === -1 ? "" : a.subCourse} onChange={(e) => setA(i, "subCourse", e.target.value)}>
                    {ASP_MODULES.indexOf(a.subCourse) === -1 && <option value="">{a.subCourse || "—"} (no match)</option>}
                    {ASP_MODULES.map((s) => <option key={s}>{s}</option>)}</select></td>
                  <td><select value={a.milestone} onChange={(e) => setA(i, "milestone", e.target.value)}>{ms.map((m) => <option key={m.id} value={m.id}>{m.id} · L{m.level}</option>)}</select></td>
                  <td><input className="num" value={a.points} onChange={(e) => setA(i, "points", e.target.value)} /></td>
                  <td><button type="button" className="asp-del" aria-label="Delete row" onClick={() => delRow(i)}><iconify-icon icon="lucide:trash-2"></iconify-icon></button></td>
                </tr>)}</tbody>
            </table>
          </div>
          <p className="asp-foot">Publishing writes the path for all 8D members. Points already awarded are never reversed; renamed activities keep their ID and ticks. Production: rows land in <code>success_path_activities</code> and resolve sub-course → <code>course_modules.id</code> → lesson IDs.</p>
        </div>
      </main>
      {csvOpen &&
        <div className="asp-modal" role="dialog" aria-modal="true" aria-label="Import CSV" onClick={(e) => { if (e.target === e.currentTarget) setCsvOpen(false); }}>
          <div className="asp-modal-card">
            <h3>Import the handoff sheet</h3>
            <p>Four columns, in order: <b>activity, sub_course, milestone, points</b>. A header row is optional. Importing replaces the draft activities (nothing goes live until you publish).</p>
            <textarea value={csvText} onChange={(e) => setCsvText(e.target.value)} placeholder={'activity,sub_course,milestone,points\n"I can map the five zones of the lip",Chapter 4: Lip Anatomy,M1,40'} />
            <input type="file" accept=".csv,text/csv" onChange={(e) => { const f = e.target.files[0]; if (f) f.text().then(setCsvText); }} />
            <div className="asp-modal-row"><button className="crs-btn asp-ghost" type="button" onClick={() => setCsvOpen(false)}>Cancel</button><button className="crs-btn crs-btn-navy" type="button" onClick={importCsv}>Import rows</button></div>
          </div>
        </div>}
      {toast && <div className="asp-toast" role="status">{toast}</div>}
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AdminSuccessPathsApp />);
