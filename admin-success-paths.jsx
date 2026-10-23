/* ===========================================================================
   PROfinity — Admin · Success Paths
   List first: one table row per Success Path (course, levels, skills, points,
   status). Opening a row (?path=<slug>) shows the path's details — path info,
   a Levels table and a Skills table (statement, level, module, the lessons
   that unlock it, points). New Success Path creates a draft for any course
   in the catalogue; drafts are invisible to members until the first Publish
   (PFSuccessPath.setContent → pf-sp-content-v1; member pages re-read live).
   Reuses the Admin Courses shell (admin-courses.css, crs- classes).
   Suffixed -ASP (shared global scope). Rebuilt 2026-10-22 (user: list, then
   details; no phone preview).
   =========================================================================== */
const { useState: useStateASP, useMemo: useMemoASP, useEffect: useEffectASP } = React;
const SPA = window.PFSuccessPath;
const LSH = window.PFLearnShared;
function goASP(u) { (window.pfGo || function (x) { window.location.href = x; })(u); }

/* Live 8D modules (Staging course 2616a619…, 20 modules). Other courses use their curriculum sections. */
const ASP_MODULES_8D = ["Introduction", "Chapter 1: Establishing the Patient Goals", "Sculpting", "4mm", "Chapter 2: Establishing the Patient Risks", "Tenting",
  "Chapter 3: Aesthetic Analysis", "Chapter 4: Lip Anatomy", "Cannula", "Russian Lips", "Chapter 5: The Technical Core of Lip Injection", "Chapter 6: Technique Critique",
  "Restoration", "Chapter 7: Material Science and Tools", "Botulinum Toxin", "Chapter 8: Decision Making and Consent", "8D Lips Case Studies", "8D Profit Mini Course",
  "1 Minute Techniques At A Peak Guides", "Consultation Success Blueprint"];
const ASP_STREAMS = ["Consultation", "Injecting", "Side effects", "Complications"];
const ASP_DOMAINS = ["Clinical Skills", "Sales", "Marketing", "Business Systems"];

/* Same sidebar as the other admin pages, Success Paths active (after Courses). */
const ASP_NAV = [["lucide:layout-grid", "Dashboard", "AdminDashboard.html"], ["lucide:user", "Users", "AdminUsers.html"],
  ["lucide:file-text", "Posts Management", "AdminPostsManagement.html"], ["lucide:layout-dashboard", "Content Moderation", "AdminModeration.html"],
  ["lucide:life-buoy", "Service Requests", "AdminServiceRequests.html"], ["lucide:shield-check", "Verification", "AdminVerification.html"],
  ["lucide:users-round", "Agents", "AdminAgents.html"], ["lucide:calendar", "Events", "AdminEvents.html"], ["lucide:map", "Product Mapping", "AdminProductMapping.html"],
  ["lucide:bar-chart-3", "Analytics", "AdminAnalytics.html"], ["lucide:smartphone", "App Versions", "AdminAppVersions.html"], ["lucide:bell", "Push Notification", "AdminPushNotifications.html"],
  ["lucide:badge-check", "Badges", "AdminBadges.html"], ["lucide:clipboard-list", "Quizzes & Surveys", "AdminQuizEditor.html"], ["lucide:trophy", "Loyalty & Gamification", "AdminActionsEditor.html"],
  ["lucide:scroll-text", "Points Ledger", "AdminAuditLedger.html"], ["lucide:receipt-text", "Transactions", "AdminTransactions.html"],
  ["lucide:table-2", "Courses", "AdminCourses.html"], ["lucide:route", "Success Paths", null], ["lucide:users", "Community", "AdminCommunity.html"]];

const ROMAN_ASP = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const romanASP = (n) => ROMAN_ASP[n] || String(n);
const fmtASP = (n) => (+n || 0).toLocaleString("en-GB");
const fmtDateASP = (iso) => { if (!iso) return "—"; try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return "—"; } };

/* ------------------------------------------------------------ courses -- */
/* Every course the member app knows (catalogue + related pool), by slug. */
function coursesASP() {
  const out = {}; const push = (c) => { const slug = c.slug || (LSH ? LSH.slug(c.title) : c.title); if (!out[slug]) out[slug] = { slug, title: c.title, cat: c.cat || "" }; };
  if (LSH) { (LSH.CATALOG || []).forEach(push); (LSH.RELATED_POOL || []).forEach(push); }
  if (!out["8d-lip-design"]) out["8d-lip-design"] = { slug: "8d-lip-design", title: "8D Lip Design", cat: "Lips & Perioral" };
  return Object.keys(out).map((k) => out[k]).sort((a, b) => a.title.localeCompare(b.title));
}
function courseCurriculumASP(slug) {
  if (!LSH) return null;
  const c = LSH.curriculum ? LSH.curriculum(slug) : null;
  if (c) return c;
  const info = LSH.courseInfo ? LSH.courseInfo(slug) : { title: slug };
  return LSH.genericCourse ? LSH.genericCourse(info.title, slug, { dur: info.dur, image: info.image }) : null;
}
/* Lessons grouped like the course page lists them. Lesson names are the
   completion keys (pf-lessons-done), so skills must link to these. */
function lessonGroupsASP(slug) {
  const c = courseCurriculumASP(slug);
  if (!c) return [];
  const groups = [];
  (c.levels || []).forEach((lv) => {
    (lv.sections || []).forEach((sec) => {
      const names = (sec.lessons || []).map((l) => l.name);
      (sec.subs || []).forEach((sub) => (sub.lessons || []).forEach((l) => names.push(l.name)));
      if (names.length) groups.push({ key: lv.title + " · " + sec.name, label: (lv.title ? lv.title + " · " : "") + sec.name, section: sec.name, lessons: names });
    });
  });
  return groups;
}
function modulesASP(slug, groups) {
  if (slug === "8d-lip-design") return ASP_MODULES_8D;
  const seen = {}; return groups.map((g) => g.section).filter((n) => seen[n] ? false : (seen[n] = true));
}

/* -------------------------------------------------------------- csv -- */
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

/* -------------------------------------------------------- validation -- */
function validateASP(meta, ms, acts, allLessons) {
  const errs = {};
  if (!meta.title || !meta.title.trim()) errs.path = ["Give the path a title"];
  if (!ms.length) errs.levels = ["Add at least one level"];
  const mIds = ms.map((m) => m.id);
  acts.forEach((a) => {
    const e = [];
    if (!a.text || a.text.trim().length < 8) e.push("Write the skill as an “I can …” statement");
    if (!a.subCourse) e.push("Pick a module");
    if (mIds.indexOf(a.milestone) === -1) e.push("Unknown level");
    const p = +a.points; if (!(p >= 10 && p <= 100 && Math.round(p) === p)) e.push("Points 10–100");
    if (!a.lessons || !a.lessons.length) e.push("Link at least one lesson");
    else { const miss = a.lessons.filter((l) => allLessons.indexOf(l) === -1); if (miss.length) e.push("Not in the course: " + miss.join(", ")); }
    if (e.length) errs[a.key] = e;
  });
  ms.forEach((m) => {
    const e = [];
    const n = acts.filter((a) => a.milestone === m.id).length;
    if (n < 2) e.push("Needs at least 2 skills");
    const p = +m.points; if (!(p >= 100 && p <= 500)) e.push("Points 100–500");
    if (!m.title || !m.title.trim()) e.push("Name required");
    if (!m.statement || !m.statement.trim()) e.push("Statement required");
    if (e.length) errs[m.id] = e;
  });
  return errs;
}

/* ------------------------------------------------------------- shell -- */
function ShellASP({ title, children }) {
  return (
    <div className="crs-shell asp">
      <aside className="crs-sidebar">
        <div className="crs-logo"><img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" /></div>
        {ASP_NAV.map(([ic, label, href]) =>
          <button key={label} type="button" className={"crs-navitem" + (!href ? " is-active" : "")} onClick={href ? () => goASP(href) : undefined}>
            <iconify-icon icon={ic}></iconify-icon><span>{label}</span>
          </button>)}
      </aside>
      <main className="crs-main">
        <header className="crs-header">
          <span className="crs-header-title">{title}</span>
          <div className="crs-spacer" />
          <div className="crs-user"><div className="crs-user-name">Dr Tim Pearce</div><div className="crs-user-role">Admin</div></div>
          <img className="crs-user-avatar" src="assets/avatar-drtim.png" alt="" />
        </header>
        <div className="crs-content"><div className="crs-view">{children}</div></div>
      </main>
    </div>);
}
function StatusChipASP({ p }) {
  const live = !p.draft;
  return <span className={"asp-chip " + (live ? "is-live" : "is-draft")}><iconify-icon icon={live ? "lucide:radio" : "lucide:file-pen"}></iconify-icon>{live ? "Live" : "Draft"}</span>;
}

/* --------------------------------------------------------------- list -- */
function PathsListASP({ onOpen, onNew }) {
  const rows = useMemoASP(() => SPA.list().map((p) => { const c = SPA.getContent(p.slug) || { milestones: [], activities: [] }; const info = coursesASP().find((x) => x.slug === p.slug);
    return { ...p, course: info ? info.title : p.slug, cat: info ? info.cat : "", levels: c.milestones.length, skills: c.activities.length,
      points: c.activities.reduce((s, a) => s + (+a.points || 0), 0) + c.milestones.reduce((s, m) => s + (+m.points || 0), 0), updatedAt: c.updatedAt }; }), []);
  const [q, setQ] = useStateASP("");
  const shown = rows.filter((r) => !q || (r.title + " " + r.course).toLowerCase().indexOf(q.toLowerCase()) !== -1);
  return (
    <>
      <div className="crs-page-head asp-head">
        <div><h2>Success Paths</h2><p className="asp-sub">One skills journey per course. Members see it on the course page, inside each lesson and on the Success Path page.</p></div>
        <div className="asp-actions"><button className="crs-btn crs-btn-navy" type="button" onClick={onNew}><iconify-icon icon="lucide:plus"></iconify-icon>New Success Path</button></div>
      </div>
      <div className="crs-card asp-card">
        <div className="crs-card-head">
          <span className="crs-card-title">{rows.length} path{rows.length === 1 ? "" : "s"}</span>
          <label className="asp-search"><iconify-icon icon="lucide:search"></iconify-icon><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search paths" /></label>
        </div>
        <table className="asp-table asp-table-list">
          <thead><tr><th>Path</th><th>Course</th><th>Levels</th><th>Skills</th><th>Points</th><th>Status</th><th>Last published</th><th></th></tr></thead>
          <tbody>
            {shown.map((r) =>
              <tr key={r.slug} className="asp-rowlink" onClick={() => onOpen(r.slug)}>
                <td><b className="asp-td-title">{r.title}</b><small className="asp-td-sub">{r.custom ? "Created in admin" : "Built-in"}</small></td>
                <td>{r.course}{r.cat && <small className="asp-td-sub">{r.cat}</small>}</td>
                <td>{r.levels}</td><td>{r.skills}</td><td>{fmtASP(r.points)}</td>
                <td><StatusChipASP p={r} /></td>
                <td>{fmtDateASP(r.updatedAt)}</td>
                <td className="asp-td-chev"><iconify-icon icon="lucide:chevron-right"></iconify-icon></td>
              </tr>)}
            {!shown.length && <tr><td colSpan={8} className="asp-td-empty">No paths match “{q}”.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="asp-foot">A Draft path is only visible here. Publish it from its details page to show it to members on that course.</p>
    </>);
}

/* ---------------------------------------------------------- new modal -- */
function NewPathModalASP({ onClose, onCreate }) {
  const courses = useMemoASP(coursesASP, []);
  const taken = useMemoASP(() => SPA.list().map((p) => p.slug), []);
  const free = courses.filter((c) => taken.indexOf(c.slug) === -1);
  const [slug, setSlug] = useStateASP(free[0] ? free[0].slug : "");
  const course = free.find((c) => c.slug === slug);
  const [title, setTitle] = useStateASP(course ? course.title : "");
  const [shortTitle, setShortTitle] = useStateASP("");
  const [domain, setDomain] = useStateASP(ASP_DOMAINS[0]);
  const [levels, setLevels] = useStateASP("3");
  const pick = (s) => { setSlug(s); const c = free.find((x) => x.slug === s); if (c) setTitle(c.title); };
  const create = () => { if (!course || !title.trim()) return; onCreate({ slug, title: title.trim(), shortTitle: shortTitle.trim() || title.trim(), domain, levels: +levels }); };
  return (
    <div className="asp-modal" role="dialog" aria-modal="true" aria-label="New Success Path" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="asp-modal-card">
        <h3>New Success Path</h3>
        <p>Pick the course the path belongs to. It starts as a draft — members only see it once you publish.</p>
        <label className="asp-field"><span className="asp-field-l">Course</span>
          <select value={slug} onChange={(e) => pick(e.target.value)}>{free.map((c) => <option key={c.slug} value={c.slug}>{c.title}{c.cat ? " · " + c.cat : ""}</option>)}</select>
          {!free.length && <span className="asp-field-h">Every course in the catalogue already has a path.</span>}
        </label>
        <div className="asp-grid2">
          <label className="asp-field"><span className="asp-field-l">Path title</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label className="asp-field"><span className="asp-field-l">Short title</span><input value={shortTitle} onChange={(e) => setShortTitle(e.target.value)} placeholder={title} /><span className="asp-field-h">Shown under “Success Path” in the app header.</span></label>
        </div>
        <div className="asp-grid2">
          <label className="asp-field"><span className="asp-field-l">Domain</span><select value={domain} onChange={(e) => setDomain(e.target.value)}>{ASP_DOMAINS.map((d) => <option key={d}>{d}</option>)}</select></label>
          <label className="asp-field"><span className="asp-field-l">Start with</span><select value={levels} onChange={(e) => setLevels(e.target.value)}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} empty level{n === 1 ? "" : "s"}</option>)}</select></label>
        </div>
        <div className="asp-modal-row"><button className="crs-btn asp-ghost" type="button" onClick={onClose}>Cancel</button><button className="crs-btn crs-btn-navy" type="button" disabled={!course || !title.trim()} onClick={create}>Create draft</button></div>
      </div>
    </div>);
}

/* ------------------------------------------------------------ details -- */
function draftFromASP(c) {
  return {
    meta: { title: c.title || "", shortTitle: c.shortTitle || "", kicker: c.kicker || "Success Path", domain: c.domain || "Clinical Skills", blurb: c.blurb || "" },
    ms: c.milestones.map((m) => ({ ...m, points: String(m.points) })),
    acts: c.activities.map((a, i) => ({ ...a, key: a.id || "k" + i, points: String(a.points), lessons: (a.lessons || []).slice() }))
  };
}
function ErrNoteASP({ list }) { return list ? <em className="asp-err">{list.join(" · ")}</em> : null; }

function LessonsCellASP({ a, groups, allLessons, onChange }) {
  const [adding, setAdding] = useStateASP("");
  const add = (name) => { if (!name) return; if ((a.lessons || []).indexOf(name) === -1) onChange((a.lessons || []).concat([name])); setAdding(""); };
  return (
    <div className="asp-chips">
      {(a.lessons || []).map((l) =>
        <span key={l} className={"asp-lchip" + (allLessons.indexOf(l) === -1 ? " is-bad" : "")} title={allLessons.indexOf(l) === -1 ? "Not in the course" : l}>
          <span className="asp-lchip-t">{l}</span>
          <button type="button" aria-label={"Remove " + l} onClick={() => onChange(a.lessons.filter((x) => x !== l))}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </span>)}
      <select className="asp-lesson-add" value={adding} onChange={(ev) => add(ev.target.value)} aria-label="Add a lesson">
        <option value="">+ Lesson</option>
        {groups.map((g) => <optgroup key={g.key} label={g.label}>{g.lessons.filter((l) => (a.lessons || []).indexOf(l) === -1).map((l) => <option key={l} value={l}>{l}</option>)}</optgroup>)}
      </select>
    </div>);
}

function PathDetailsASP({ slug, onBack, say }) {
  const start = useMemoASP(() => SPA.getContent(slug), [slug]);
  const groups = useMemoASP(() => lessonGroupsASP(slug), [slug]);
  const allLessons = useMemoASP(() => [].concat.apply([], groups.map((g) => g.lessons)), [groups]);
  const modules = useMemoASP(() => modulesASP(slug, groups), [slug, groups]);
  const d0 = useMemoASP(() => draftFromASP(start), [start]);
  const [meta, setMetaRaw] = useStateASP(d0.meta);
  const [ms, setMsRaw] = useStateASP(d0.ms);
  const [acts, setActsRaw] = useStateASP(d0.acts);
  const [dirty, setDirty] = useStateASP(false);
  const [draft, setDraft] = useStateASP(!!start.draft);
  const [csvOpen, setCsvOpen] = useStateASP(false);
  const [csvText, setCsvText] = useStateASP("");
  const setMeta = (v) => { setMetaRaw(v); setDirty(true); };
  const setMs = (v) => { setMsRaw(v); setDirty(true); };
  const setActs = (v) => { setActsRaw(v); setDirty(true); };
  const errs = validateASP(meta, ms, acts, allLessons);
  const errCount = Object.keys(errs).length;
  const actPts = acts.reduce((s, a) => s + (+a.points || 0), 0), msPts = ms.reduce((s, m) => s + (+m.points || 0), 0);
  const custom = !SPA.isDefault(slug);
  const courseInfo = coursesASP().find((c) => c.slug === slug);

  useEffectASP(() => {
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h); return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const upMeta = (k) => (e) => setMeta({ ...meta, [k]: e.target.value });
  const setM = (id, k, v) => setMs(ms.map((m) => m.id === id ? { ...m, [k]: k === "points" ? String(v).replace(/[^0-9]/g, "") : v } : m));
  const setA = (key, k, v) => setActs(acts.map((a) => a.key === key ? { ...a, [k]: k === "points" ? String(v).replace(/[^0-9]/g, "") : v } : a));
  const addLevel = () => { let n = ms.length + 1; while (ms.some((m) => m.id === "M" + n)) n++; setMs(ms.concat([{ id: "M" + n, level: ms.length + 1, title: "", statement: "", subStream: ASP_STREAMS[1], points: "250" }])); };
  const delLevel = (id) => {
    const n = acts.filter((a) => a.milestone === id).length;
    if (n && !window.confirm("Delete this level and its " + n + " skill" + (n === 1 ? "" : "s") + "?")) return;
    setMsRaw(ms.filter((m) => m.id !== id)); setActsRaw(acts.filter((a) => a.milestone !== id)); setDirty(true);
  };
  const moveLevel = (i, dir) => { const j = i + dir; if (j < 0 || j >= ms.length) return; const list = ms.slice(); [list[i], list[j]] = [list[j], list[i]]; setMs(list); };
  const addSkill = (milestone) => setActs(acts.concat([{ key: "k" + Date.now(), id: "", milestone: milestone || (ms[0] && ms[0].id) || "", text: "", subCourse: "", points: "40", lessons: [] }]));
  const delSkill = (key) => setActs(acts.filter((a) => a.key !== key));
  const moveSkill = (key, dir) => {
    const i = acts.findIndex((a) => a.key === key); const same = acts.map((a, j) => ({ a, j })).filter((x) => x.a.milestone === acts[i].milestone);
    const pos = same.findIndex((x) => x.j === i); const tgt = same[pos + dir]; if (!tgt) return;
    const list = acts.slice(); list[i] = tgt.a; list[tgt.j] = acts[i]; setActs(list);
  };
  const normalise = () => {
    const levels = ms.map((m, i) => ({ ...m, level: i + 1, points: +m.points }));
    const counters = {}, out = [];
    levels.forEach((m) => acts.filter((a) => a.milestone === m.id).forEach((a) => {
      counters[m.level] = (counters[m.level] || 0) + 1;
      out.push({ id: a.id || "A" + m.level + "." + counters[m.level], milestone: m.id, text: a.text.trim(), subCourse: a.subCourse, points: +a.points, lessons: a.lessons.slice() });
    }));
    return { levels, out };
  };
  const save = (publish) => {
    if (publish && errCount) { say("Fix " + errCount + " issue" + (errCount === 1 ? "" : "s") + " before publishing"); return; }
    const { levels, out } = normalise();
    SPA.setContent(slug, { ...meta, milestones: levels, activities: out, draft: publish ? false : draft });
    const fresh = draftFromASP(SPA.getContent(slug));
    setMetaRaw(fresh.meta); setMsRaw(fresh.ms); setActsRaw(fresh.acts); setDirty(false); if (publish) setDraft(false);
    say(publish ? "Published — live for members on " + (courseInfo ? courseInfo.title : slug) : "Draft saved");
  };
  const discard = () => { const fresh = draftFromASP(SPA.getContent(slug)); setMetaRaw(fresh.meta); setMsRaw(fresh.ms); setActsRaw(fresh.acts); setDirty(false); say("Changes discarded"); };
  const resetAll = () => {
    if (!window.confirm("Reset this path to the built-in content? Members' ticks and points are kept.")) return;
    SPA.resetContent(slug); const fresh = draftFromASP(SPA.getContent(slug));
    setMetaRaw(fresh.meta); setMsRaw(fresh.ms); setActsRaw(fresh.acts); setDirty(false); say("Reset to the built-in path");
  };
  const deletePath = () => {
    if (!window.confirm("Delete this Success Path? It disappears from the course for every member. Points already awarded stay.")) return;
    SPA.resetContent(slug); setDirty(false); say("Success Path deleted"); onBack();
  };
  const exportCsv = () => {
    const lines = [["activity", "sub_course", "milestone", "points", "lessons"].join(",")].concat(acts.map((a) => [a.text, a.subCourse, a.milestone, a.points, (a.lessons || []).join(" | ")].map(csvEsc).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const el = document.createElement("a"); el.href = url; el.download = slug + "-success-path.csv"; el.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importCsv = () => {
    const rows = parseCsv(csvText);
    if (!rows.length) { say("Nothing to import"); return; }
    const head = rows[0].map((h) => h.trim().toLowerCase());
    const body = /activity/.test(head[0]) ? rows.slice(1) : rows;
    const next = body.map((r, i) => ({ key: "i" + Date.now() + "_" + i, id: "", text: (r[0] || "").trim(), subCourse: (r[1] || "").trim(), milestone: (r[2] || "").trim().toUpperCase(), points: String(r[3] || "").trim(),
      lessons: (r[4] || "").split("|").map((x) => x.trim()).filter(Boolean) }));
    setActs(next); setCsvOpen(false); setCsvText(""); say("Imported " + next.length + " skills — review, then publish");
  };

  let skillNo = 0;
  return (
    <>
      <button type="button" className="asp-back" onClick={() => { if (dirty && !window.confirm("Leave without saving your changes?")) return; onBack(); }}><iconify-icon icon="lucide:arrow-left"></iconify-icon>Success Paths</button>
      <div className="crs-page-head asp-head">
        <div>
          <div className="asp-title-row"><h2>{meta.title || "Untitled path"}</h2><StatusChipASP p={{ draft }} />{dirty && <span className="asp-chip is-warn"><iconify-icon icon="lucide:pencil-line"></iconify-icon>Unsaved changes</span>}</div>
          <p className="asp-sub">{courseInfo ? courseInfo.title : slug}{courseInfo && courseInfo.cat ? " · " + courseInfo.cat : ""} · {ms.length} level{ms.length === 1 ? "" : "s"} · {acts.length} skill{acts.length === 1 ? "" : "s"} · {fmtASP(actPts + msPts)} points available{errCount ? " · " + errCount + " issue" + (errCount === 1 ? "" : "s") + " to fix" : ""}</p>
        </div>
        <div className="asp-actions">
          <button className="crs-btn asp-ghost" type="button" onClick={() => setCsvOpen(true)}><iconify-icon icon="lucide:upload"></iconify-icon>Import CSV</button>
          <button className="crs-btn asp-ghost" type="button" onClick={exportCsv}><iconify-icon icon="lucide:download"></iconify-icon>Export CSV</button>
          {custom ? <button className="crs-btn asp-ghost asp-danger" type="button" onClick={deletePath}><iconify-icon icon="lucide:trash-2"></iconify-icon>Delete</button>
            : <button className="crs-btn asp-ghost" type="button" onClick={resetAll}>Reset</button>}
          {draft && <button className="crs-btn asp-ghost" type="button" disabled={!dirty} onClick={() => save(false)}>Save draft</button>}
          <button className="crs-btn crs-btn-navy" type="button" disabled={!dirty && !draft} onClick={() => save(true)}><iconify-icon icon="lucide:send"></iconify-icon>Publish</button>
        </div>
      </div>

      <div className="crs-card asp-card">
        <div className="crs-card-head"><span className="crs-card-title">Path details</span><span className="asp-hint">What members read at the top of the path</span></div>
        <div className="asp-card-body">
          <div className="asp-grid4">
            <label className="asp-field"><span className="asp-field-l">Path title</span><input value={meta.title} onChange={upMeta("title")} /><ErrNoteASP list={errs.path} /></label>
            <label className="asp-field"><span className="asp-field-l">Short title</span><input value={meta.shortTitle} onChange={upMeta("shortTitle")} placeholder={meta.title} /></label>
            <label className="asp-field"><span className="asp-field-l">Eyebrow</span><input value={meta.kicker} onChange={upMeta("kicker")} /></label>
            <label className="asp-field"><span className="asp-field-l">Domain</span><select value={meta.domain} onChange={upMeta("domain")}>{ASP_DOMAINS.map((d) => <option key={d}>{d}</option>)}</select></label>
          </div>
          <label className="asp-field"><span className="asp-field-l">Intro copy</span><textarea rows={2} value={meta.blurb} onChange={upMeta("blurb")} placeholder="One or two sentences. The skill and level counts are added automatically." /></label>
        </div>
      </div>

      <div className="crs-card asp-card">
        <div className="crs-card-head"><span className="crs-card-title">Levels</span><span className="asp-hint">Achieved automatically when every skill in the level is ticked</span></div>
        <table className="asp-table">
          <thead><tr><th>Level</th><th>Name</th><th>Proficiency statement</th><th>Sub-stream</th><th>Skills</th><th>Points</th><th></th></tr></thead>
          <tbody>
            {ms.map((m, i) =>
              <tr key={m.id} className={errs[m.id] ? "err" : ""}>
                <td><span className="asp-medal">{romanASP(i + 1)}</span></td>
                <td><input value={m.title} onChange={(e) => setM(m.id, "title", e.target.value)} placeholder="Read the lips" /></td>
                <td><input className="asp-wide" value={m.statement} onChange={(e) => setM(m.id, "statement", e.target.value)} placeholder="I assess the lip before I pick up a needle." /><ErrNoteASP list={errs[m.id]} /></td>
                <td><select value={m.subStream} onChange={(e) => setM(m.id, "subStream", e.target.value)}>{ASP_STREAMS.map((s) => <option key={s}>{s}</option>)}</select></td>
                <td className="asp-td-n">{acts.filter((a) => a.milestone === m.id).length}</td>
                <td><input className="asp-num" inputMode="numeric" value={m.points} onChange={(e) => setM(m.id, "points", e.target.value)} /></td>
                <td className="asp-td-tools">
                  <button type="button" className="asp-iconbtn" aria-label="Move up" disabled={i === 0} onClick={() => moveLevel(i, -1)}><iconify-icon icon="lucide:chevron-up"></iconify-icon></button>
                  <button type="button" className="asp-iconbtn" aria-label="Move down" disabled={i === ms.length - 1} onClick={() => moveLevel(i, 1)}><iconify-icon icon="lucide:chevron-down"></iconify-icon></button>
                  <button type="button" className="asp-iconbtn asp-iconbtn-del" aria-label="Delete level" onClick={() => delLevel(m.id)}><iconify-icon icon="lucide:trash-2"></iconify-icon></button>
                </td>
              </tr>)}
            {!ms.length && <tr><td colSpan={7} className="asp-td-empty">No levels yet. <ErrNoteASP list={errs.levels} /></td></tr>}
          </tbody>
        </table>
        <div className="asp-card-foot"><button type="button" className="crs-text-btn" onClick={addLevel}><iconify-icon icon="lucide:plus"></iconify-icon> Add level</button></div>
      </div>

      <div className="crs-card asp-card">
        <div className="crs-card-head"><span className="crs-card-title">Skills</span><span className="asp-hint">A skill unlocks when its linked lessons are watched, then ticks itself and awards its points</span></div>
        <table className="asp-table asp-table-skills">
          <thead><tr><th>#</th><th>Skill (“I can …”)</th><th>Module</th><th>Lessons that unlock it</th><th>Points</th><th></th></tr></thead>
          <tbody>
            {ms.map((m, i) => {
              const mine = acts.filter((a) => a.milestone === m.id);
              return (
                <React.Fragment key={m.id}>
                  <tr className="asp-tr-level"><td colSpan={5}><span className="asp-medal asp-medal-sm">{romanASP(i + 1)}</span>Level {romanASP(i + 1)}{m.title ? " · " + m.title : ""}<small>{mine.length} skill{mine.length === 1 ? "" : "s"}</small></td>
                    <td className="asp-td-tools"><button type="button" className="crs-text-btn" onClick={() => addSkill(m.id)}><iconify-icon icon="lucide:plus"></iconify-icon> Add skill</button></td></tr>
                  {mine.map((a, j) => { skillNo += 1; return (
                    <tr key={a.key} className={errs[a.key] ? "err" : ""}>
                      <td className="mono">{skillNo}</td>
                      <td><textarea rows={2} value={a.text} onChange={(e) => setA(a.key, "text", e.target.value)} placeholder="I can …" /><ErrNoteASP list={errs[a.key]} /></td>
                      <td>
                        <select value={modules.indexOf(a.subCourse) === -1 ? "" : a.subCourse} onChange={(e) => setA(a.key, "subCourse", e.target.value)}>
                          {modules.indexOf(a.subCourse) === -1 && <option value="">{a.subCourse ? a.subCourse + " (no match)" : "Choose…"}</option>}
                          {modules.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <select className="asp-level-pick" value={a.milestone} onChange={(e) => setA(a.key, "milestone", e.target.value)} aria-label="Level">{ms.map((x, k) => <option key={x.id} value={x.id}>Level {romanASP(k + 1)}</option>)}</select>
                      </td>
                      <td><LessonsCellASP a={a} groups={groups} allLessons={allLessons} onChange={(l) => setA(a.key, "lessons", l)} /></td>
                      <td><input className="asp-num" inputMode="numeric" value={a.points} onChange={(e) => setA(a.key, "points", e.target.value)} /></td>
                      <td className="asp-td-tools">
                        <button type="button" className="asp-iconbtn" aria-label="Move up" disabled={j === 0} onClick={() => moveSkill(a.key, -1)}><iconify-icon icon="lucide:chevron-up"></iconify-icon></button>
                        <button type="button" className="asp-iconbtn" aria-label="Move down" disabled={j === mine.length - 1} onClick={() => moveSkill(a.key, 1)}><iconify-icon icon="lucide:chevron-down"></iconify-icon></button>
                        <button type="button" className="asp-iconbtn asp-iconbtn-del" aria-label="Delete skill" onClick={() => delSkill(a.key)}><iconify-icon icon="lucide:trash-2"></iconify-icon></button>
                      </td>
                    </tr>); })}
                  {!mine.length && <tr><td colSpan={6} className="asp-td-empty">No skills in this level yet.</td></tr>}
                </React.Fragment>);
            })}
            {!ms.length && <tr><td colSpan={6} className="asp-td-empty">Add a level first, then its skills.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="asp-foot">Publishing writes the path for every member on the course. Points already awarded are never reversed; renamed skills keep their ID and ticks. Production: rows land in <code>success_path_activities</code> and lessons resolve to <code>course_lessons.id</code>.</p>

      {dirty &&
        <div className="asp-savebar" role="region" aria-label="Unsaved changes">
          <span className="asp-savebar-tx"><iconify-icon icon="lucide:pencil-line"></iconify-icon>Unsaved changes{errCount ? " · " + errCount + " issue" + (errCount === 1 ? "" : "s") + " to fix" : ""}</span>
          <span className="asp-savebar-btns">
            <button className="crs-btn asp-ghost" type="button" onClick={discard}>Discard</button>
            {draft && <button className="crs-btn asp-ghost" type="button" onClick={() => save(false)}>Save draft</button>}
            <button className="crs-btn crs-btn-navy" type="button" onClick={() => save(true)} disabled={!!errCount}><iconify-icon icon="lucide:send"></iconify-icon>Publish</button>
          </span>
        </div>}
      {csvOpen &&
        <div className="asp-modal" role="dialog" aria-modal="true" aria-label="Import CSV" onClick={(e) => { if (e.target === e.currentTarget) setCsvOpen(false); }}>
          <div className="asp-modal-card">
            <h3>Import the handoff sheet</h3>
            <p>Columns, in order: <b>activity, sub_course, milestone, points, lessons</b> (lessons separated by <code>|</code>). A header row is optional. Importing replaces the draft skills — nothing goes live until you publish.</p>
            <textarea value={csvText} onChange={(e) => setCsvText(e.target.value)} placeholder={'activity,sub_course,milestone,points,lessons\n"I can map the five zones of the lip",Chapter 4: Lip Anatomy,M1,40,Lip anatomy essentials'} />
            <input type="file" accept=".csv,text/csv" onChange={(e) => { const f = e.target.files[0]; if (f) f.text().then(setCsvText); }} />
            <div className="asp-modal-row"><button className="crs-btn asp-ghost" type="button" onClick={() => setCsvOpen(false)}>Cancel</button><button className="crs-btn crs-btn-navy" type="button" onClick={importCsv}>Import rows</button></div>
          </div>
        </div>}
    </>);
}

/* ---------------------------------------------------------------- app -- */
function AdminSuccessPathsApp() {
  const [slug, setSlugRaw] = useStateASP(() => { const s = new URLSearchParams(location.search).get("path"); return s && SPA.getContent(s) ? s : null; });
  const [newOpen, setNewOpen] = useStateASP(false);
  const [toast, setToast] = useStateASP(null);
  const say = (t) => { setToast(t); setTimeout(() => setToast(null), 2800); };
  const setSlug = (s) => {
    setSlugRaw(s);
    try { const u = new URL(location.href); if (s) u.searchParams.set("path", s); else u.searchParams.delete("path"); history.replaceState(null, "", u); } catch (e) {}
    window.scrollTo(0, 0);
  };
  const createPath = ({ slug: s, title, shortTitle, domain, levels }) => {
    const names = ["Foundations", "Core technique", "Advanced practice", "Mastery", "Expert"];
    const ms = []; for (let i = 0; i < levels; i++) ms.push({ id: "M" + (i + 1), level: i + 1, title: names[i] || "Level " + (i + 1), statement: "", subStream: ASP_STREAMS[1], points: 150 + i * 50 });
    SPA.setContent(s, { title, shortTitle, kicker: "Success Path", domain, blurb: "", milestones: ms, activities: [], draft: true });
    setNewOpen(false); setSlug(s); say("Draft created — add the skills, then publish");
  };
  return (
    <ShellASP title={slug ? "Success Paths · Details" : "Success Paths"}>
      {slug ? <PathDetailsASP key={slug} slug={slug} onBack={() => setSlug(null)} say={say} /> : <PathsListASP onOpen={setSlug} onNew={() => setNewOpen(true)} />}
      {newOpen && <NewPathModalASP onClose={() => setNewOpen(false)} onCreate={createPath} />}
      {toast && <div className="asp-toast" role="status">{toast}</div>}
    </ShellASP>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AdminSuccessPathsApp />);
