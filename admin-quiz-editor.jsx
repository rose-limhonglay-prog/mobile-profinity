/* ===========================================================================
   PROfinity — Admin · Quizzes & Surveys (its own main page — deliberately
   kept out of the Loyalty & Gamification group so admins don't confuse
   quiz content with the points/rewards settings)
   Two tabs:
   · Quiz Questions — the medical knowledge-check posts the newsfeed scatters
     through itself (see planFeedQuizzes / FeedQuizPost in app.jsx). Scored
     per question: a correct answer pays out once ever, a wrong one pays
     nothing but stays worth points next time round. Backed by
     window.PFQuizEngine (quiz-engine.js) so edits reach the feed on its next
     load — the engine's pool is the single source of truth.
   · Business Survey — the "Let's personalise your experience" onboarding
     wizard (survey.jsx). No right or wrong answers; edits land in the same
     localStorage key the wizard reads.
   Reuses the rwd-store-card / adl-field shell from admin-reward-editor.css.
   Classes prefixed qze- to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateQZE, useEffect: useEffectQZE, useMemo: useMemoQZE } = React;
const PF_QZE = window.PFQuizEngine;

function goQZE(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

const ADL_NAV_TOP = [
  { icon: "lucide:layout-grid", label: "Dashboard", href: "AdminDashboard.html" },
  { icon: "lucide:user", label: "Users", href: "AdminUsers.html" },
  { icon: "lucide:file-text", label: "Posts Management", href: "AdminPostsManagement.html" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation", href: "AdminModeration.html" },
  { icon: "lucide:life-buoy", label: "Service Requests", href: "AdminServiceRequests.html" },
  { icon: "lucide:shield-check", label: "Verification", href: "AdminVerification.html" },
  { icon: "lucide:users-round", label: "Agents", href: "AdminAgents.html" },
  { icon: "lucide:calendar", label: "Events", href: "AdminEvents.html" },
  { icon: "lucide:map", label: "Product Mapping", href: "AdminProductMapping.html" },
  { icon: "lucide:bar-chart-3", label: "Analytics", href: "AdminAnalytics.html" },
  { icon: "lucide:smartphone", label: "App Versions", href: "AdminAppVersions.html" },
  { icon: "lucide:bell", label: "Push Notification", href: "AdminPushNotifications.html" },
  { icon: "lucide:badge-check", label: "Badges", href: "AdminBadges.html" },
  { icon: "lucide:clipboard-list", label: "Quizzes & Surveys", href: "AdminQuizEditor.html", active: true },
  { icon: "lucide:receipt-text", label: "Transactions", href: "AdminTransactions.html", chevron: true },
  { icon: "lucide:table-2", label: "Courses", href: "AdminCourses.html", chevron: true },
  { icon: "lucide:users", label: "Community", href: "AdminCommunity.html", chevron: true }
];
const ADL_LOYALTY_SUBNAV = [
  { key: "actions", label: "Ways to Earn", href: "AdminActionsEditor.html" },
  { key: "tiers", label: "Tier Multipliers", href: "AdminTierMultipliers.html" },
  { key: "rewards", label: "Reward Editor", href: "AdminRewardEditor.html" },
  { key: "ledger", label: "Points Ledger", href: "AdminAuditLedger.html" },
  { key: "users", label: "User Diagnostics", href: "AdminUserDiagnostics.html" },
  { key: "overview", label: "System Overview", href: "AdminLoyaltyOverview.html" }
];

function AdlSidebar({ activeLoyaltyKey }) {
  return (
    <aside className="adl-sidebar">
      <div className="adl-logo"><img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" /></div>
      {ADL_NAV_TOP.map((item) => (
        <button key={item.label} className={"adl-navitem" + (item.active ? " is-active" : "")} type="button" onClick={item.active ? undefined : () => goQZE(item.href)}>
          <iconify-icon icon={item.icon}></iconify-icon>
          <span>{item.label}</span>
          {item.chevron && (<><span className="adl-spacer" /><iconify-icon icon="lucide:chevron-down" class="adl-chev"></iconify-icon></>)}
        </button>
      ))}
      <div className="adl-navgroup-label">Loyalty &amp; Gamification</div>
      <button className={"adl-navitem" + (activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goQZE("AdminActionsEditor.html")}>
        <iconify-icon icon="lucide:trophy"></iconify-icon>
        <span>Loyalty &amp; Gamification</span>
      </button>
      <div className="adl-subnav">
        {ADL_LOYALTY_SUBNAV.map((s) => (
          <button key={s.key} className={"adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : "")} type="button" onClick={() => goQZE(s.href)}>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function AdlHeader({ title }) {
  return (
    <header className="adl-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="adl-header-title">{title}</span>
      <div className="adl-header-search"><iconify-icon icon="lucide:search"></iconify-icon><input placeholder="Type to search..." /></div>
      <div className="adl-spacer" />
      <div className="adl-bell"><iconify-icon icon="lucide:bell"></iconify-icon><span className="adl-bell-badge">4</span></div>
      <div className="adl-user"><div className="adl-user-name">Dr Tim Pearce</div><div className="adl-user-role">Admin</div></div>
      <img className="adl-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

const QZE_TABS = [
  { key: "quiz", label: "Quiz Questions" },
  { key: "survey", label: "Business Survey" }
];
/* Who the feed post appears to come from — mirrors FEED_QUIZ_AUTHORS in app.jsx. */
const QZE_SOURCES = [
  { key: "course", label: "Course quiz (PROfinity)", hint: "Knowledge check ✅ — lifted from the course's own quiz." },
  { key: "tim", label: "Dr Tim Pearce", hint: "Quick one from me 🧠 — a new question written by Dr Tim." },
  { key: "alicia", label: "Alicia · Profinity team", hint: "Pop quiz from the Profinity team ✨ — written by Alicia." }
];
const QZE_COURSES = Object.keys(PF_QZE.COURSES).map((slug) => ({ slug, title: PF_QZE.COURSES[slug].title }))
  .sort((a, b) => a.title.localeCompare(b.title));

/* Mirrors feedQuizBody() in app.jsx so the preview shows the real opening
   line; returns [{ text, hl }] parts with the topic marked for highlighting. */
function hookPreviewQZE(q) {
  const topic = q.topic || "knowledge check";
  const course = (PF_QZE.COURSES[q.course] || {}).title || "the course";
  const T = { text: topic, hl: true };
  if (q.source === "tim") return [{ text: "Quick one from me 🧠 — " }, T, { text: ". Tap an answer and I'll tell you where this sits in " + course + "." }];
  if (q.source === "alicia") return [{ text: "Pop quiz from the Profinity team ✨ — " }, T, { text: ". Tap an answer to see if you're right." }];
  return [{ text: "Knowledge check ✅ — " }, T, { text: ", straight from the " + course + " quiz. Tap an answer to see if you're right." }];
}
/* The caption is the post text above the question card. Admins can write
   their own (q.caption); otherwise the feed's template line is suggested. */
function suggestedCaptionQZE(q) { return hookPreviewQZE(q).map((p) => p.text).join(""); }
function captionQZE(q) { return q.caption && String(q.caption).trim() ? q.caption : suggestedCaptionQZE(q); }
function uidQZE(prefix) { return (prefix || "q") + "-" + Math.random().toString(36).slice(2, 8); }
function slugQZE(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40); }

/* ---------------------------------------------------------- tallies -- */
/* Response tallies per question. Only this browser's own answers exist in
   the prototype (pf-feed-quiz / pf-survey-answers), so a deterministic
   seeded distribution stands in for the member base and the local answer is
   added on top — the numbers stay stable across reloads and shift when the
   admin answers a question themselves. */
function hashQZE(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rngQZE(seed) { let s = seed || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function distributeQZE(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const counts = weights.map((w) => Math.floor((w / sum) * total));
  let rem = total - counts.reduce((a, b) => a + b, 0);
  for (let i = 0; rem > 0; i = (i + 1) % counts.length, rem--) counts[i]++;
  return counts;
}
function quizTallyQZE(q) {
  const opts = q.options || [];
  if (!opts.length) return null;
  const r = rngQZE(hashQZE(q.key));
  const isNew = q.key.indexOf("new-") === 0;
  let total = isNew ? 0 : 300 + Math.floor(r() * 2200);
  const ci = opts.findIndex((o) => o.correct);
  const correctShare = 0.45 + r() * 0.4;
  const weights = opts.map((o, i) => (i === ci ? correctShare : ((1 - correctShare) * (0.4 + r())) ));
  const wrongSum = weights.reduce((a, w, i) => (i === ci ? a : a + w), 0) || 1;
  const norm = weights.map((w, i) => (i === ci ? correctShare : (w / wrongSum) * (1 - correctShare)));
  const counts = distributeQZE(total, ci >= 0 ? norm : opts.map(() => 1));
  const local = PF_QZE.readAnswered()[q.key];
  let mine = null;
  if (local) {
    const idx = local.last === "correct" ? ci : opts.findIndex((o) => !o.correct);
    if (idx >= 0) { counts[idx]++; total++; mine = idx; }
  }
  return { total, counts, correct: ci >= 0 ? counts[ci] : 0, mine };
}
function readSurveyAnswersQZE() {
  try { const v = JSON.parse(localStorage.getItem("pf-survey-answers") || "null"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}
function surveyTallyQZE(sq, idx) {
  const opts = (sq.opts || []).filter((o) => String(o || "").trim());
  if (!opts.length) return null;
  const r = rngQZE(hashQZE(sq.q || ("step" + idx)));
  let total = 842;
  const counts = distributeQZE(total, opts.map(() => 0.5 + r() * 1.5));
  const mineLabel = readSurveyAnswersQZE()[idx];
  let mine = null;
  const mi = mineLabel ? opts.indexOf(mineLabel) : -1;
  if (mi >= 0) { counts[mi]++; total++; mine = mi; }
  return { total, counts, mine };
}
function pctQZE(n, total) { return total ? Math.round((n / total) * 100) : 0; }

function TallyBars({ labels, counts, total, correctIdx, mine }) {
  const top = counts.indexOf(Math.max.apply(null, counts));
  return (
    <div className="qze-tally">
      {labels.map((label, i) => (
        <div key={i} className={"qze-tally-row" + (i === correctIdx ? " is-correct" : "") + (correctIdx == null && i === top ? " is-top" : "")}>
          <span className="qze-tally-letter">{String.fromCharCode(65 + i)}</span>
          <div>
            <div className="qze-tally-label"><span>{label || <em>Empty option</em>}</span>{i === mine && <em>· your answer</em>}</div>
            <div className="qze-tally-track"><div className="qze-tally-fill" style={{ width: pctQZE(counts[i], total) + "%" }} /></div>
          </div>
          <div className="qze-tally-num"><b>{pctQZE(counts[i], total)}%</b> · {counts[i].toLocaleString("en-GB")}</div>
        </div>
      ))}
    </div>
  );
}

/* Member-level respondents. Deterministic per question so the same people
   show up on every open; their option picks reproduce the tally counts
   exactly. The local answer (if any) is shown as Katy, the demo member. */
const QZE_MEMBERS = [
  { name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", tier: "Mastery" },
  { name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", tier: "Confidence" },
  { name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", tier: "Mastery" },
  { name: "Nurse Beth Lawson", avatar: "assets/avatar-nurse-beth.jpg", tier: "Free" },
  { name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", tier: "Confidence" },
  { name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", tier: "Mastery" },
  { name: "Jade Osei", tier: "Free" }, { name: "Dr Owen Clarke", tier: "Mastery" }, { name: "Hannah Reid", tier: "Confidence" },
  { name: "Tom Whitaker", tier: "Free" }, { name: "Dr Leila Haddad", tier: "Mastery" }, { name: "Chloe Bennett", tier: "Confidence" },
  { name: "Aisha Rahman", tier: "Free" }, { name: "Dr Marcus Lee", tier: "Mastery" }, { name: "Sophie Grant", tier: "Confidence" },
  { name: "Nurse Emma Doyle", tier: "Free" }, { name: "Dr Rachel Moore", tier: "Mastery" }, { name: "Ben Carter", tier: "Confidence" },
  { name: "Lucy Fairbairn", tier: "Free" }, { name: "Dr Nadia Iqbal", tier: "Mastery" }, { name: "Georgia Hall", tier: "Confidence" },
  { name: "Ryan O'Neill", tier: "Free" }, { name: "Dr Kemi Adeyemi", tier: "Mastery" }, { name: "Zara Malik", tier: "Confidence" },
  { name: "Nurse Holly Price", tier: "Free" }, { name: "Dr Daniel Foster", tier: "Mastery" }, { name: "Isla McKenzie", tier: "Confidence" },
  { name: "Freya Lindqvist", tier: "Free" }
];
const QZE_ME = { name: "Katy Morgan", avatar: "assets/avatar-katy.jpg", tier: "Confidence", me: true };
function agoQZE(mins) {
  if (mins < 60) return mins + "m ago";
  if (mins < 60 * 24) return Math.floor(mins / 60) + "h ago";
  const d = Math.floor(mins / (60 * 24));
  return d === 1 ? "Yesterday" : d < 7 ? d + "d ago" : Math.floor(d / 7) + "w ago";
}
function respondentsQZE(seedKey, counts, mine, cap) {
  const total = counts.reduce((a, b) => a + b, 0);
  const n = Math.min(total, cap || 600);
  const r = rngQZE(hashQZE("members:" + seedKey));
  /* option picks in tally proportion, shuffled */
  const picks = [];
  counts.forEach((c, i) => { for (let k = 0; k < Math.round((c / (total || 1)) * n); k++) picks.push(i); });
  while (picks.length < n) picks.push(counts.indexOf(Math.max.apply(null, counts)));
  picks.length = n;
  for (let i = picks.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = picks[i]; picks[i] = picks[j]; picks[j] = t; }
  let mins = 12;
  const rows = picks.map((opt, i) => {
    const m = QZE_MEMBERS[Math.floor(r() * QZE_MEMBERS.length)];
    mins += 20 + Math.floor(r() * 400);
    const suffix = i >= QZE_MEMBERS.length ? "" : "";
    return { id: seedKey + ":" + i, name: m.name + suffix, avatar: m.avatar || null, tier: m.tier, opt, ago: agoQZE(mins) };
  });
  if (mine != null) rows.unshift({ id: seedKey + ":me", name: QZE_ME.name, avatar: QZE_ME.avatar, tier: QZE_ME.tier, me: true, opt: mine, ago: "Just now" });
  return rows;
}
/* Course conversion from this question's post: members who tapped the
   course CTA after answering, and how many went on to buy. Seeded like the
   tally; non-owners only can buy, so paid is a slice of clicks. */
function courseFunnelQZE(q, tally) {
  if (!q.course || !PF_QZE.COURSES[q.course] || !tally || !tally.total) return null;
  const r = rngQZE(hashQZE("funnel:" + q.key));
  const total = tally.total;
  const clicks = Math.round(total * (0.22 + r() * 0.23));
  const clicksWrong = Math.min(clicks, Math.round((total - tally.correct) * (0.35 + r() * 0.3)));
  const paid = Math.round(clicks * (0.1 + r() * 0.15));
  const course = PF_QZE.courseFor(q);
  return { course, clicks, clicksWrong, clicksCorrect: clicks - clicksWrong, paid, revenue: paid * (course.price || 0) };
}
/* Mark which respondent rows clicked / bought so the list agrees with the
   funnel numbers (scaled when the list is capped). */
function applyFunnelQZE(rows, funnel, correctIdx, total) {
  if (!funnel) return rows;
  const scale = rows.length / (total || rows.length);
  const r = rngQZE(hashQZE("funnel-rows:" + rows.length + ":" + funnel.clicks));
  const shuffled = (idxs) => { const a = idxs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const out = rows.map((m) => ({ ...m }));
  const pick = (isCorrect, n) => shuffled(out.map((m, i) => (!m.me && (m.opt === correctIdx) === isCorrect ? i : -1)).filter((i) => i >= 0)).slice(0, n);
  const clicked = pick(true, Math.round(funnel.clicksCorrect * scale)).concat(pick(false, Math.round(funnel.clicksWrong * scale)));
  clicked.forEach((i) => { out[i].clicked = true; });
  shuffled(clicked).slice(0, Math.round(funnel.paid * scale)).forEach((i) => { out[i].bought = true; });
  return out;
}
function initialsQZE(name) { return name.replace(/^(Dr\.?|Nurse)\s+/i, "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(); }

function RespondentList({ rows, labels, correctIdx, total, funnel, chipLabels, plain }) {
  const [filter, setFilter] = useStateQZE("all");
  const [query, setQuery] = useStateQZE("");
  const [limit, setLimit] = useStateQZE(25);
  const graded = correctIdx != null && correctIdx >= 0;
  const shown = rows.filter((m) => {
    if (graded && filter === "correct" && m.opt !== correctIdx) return false;
    if (graded && filter === "wrong" && m.opt === correctIdx) return false;
    if (filter === "clicked" && !m.clicked) return false;
    if (filter === "bought" && !m.bought) return false;
    if (!graded && filter !== "all" && filter !== "clicked" && filter !== "bought" && m.opt !== Number(filter)) return false;
    if (query && m.name.toLowerCase().indexOf(query.toLowerCase()) === -1) return false;
    return true;
  });
  const nCorrect = graded ? rows.filter((m) => m.opt === correctIdx).length : 0;
  return (
    <div className="qze-members">
      <div className="qze-members-head">
        <div className="qze-panel-title" style={{ fontSize: 14 }}>Members</div>
        <div className="qze-search qze-members-search"><iconify-icon icon="lucide:search"></iconify-icon><input value={query} placeholder="Search members…" onChange={(e) => { setQuery(e.target.value); setLimit(25); }} /></div>
      </div>
      <div className="qze-filters" style={{ padding: 0, border: "none" }}>
        {graded ? (
          <>
            <button type="button" className={"qze-filter" + (filter === "all" ? " is-active" : "")} onClick={() => setFilter("all")}>All · {rows.length}</button>
            <button type="button" className={"qze-filter is-good" + (filter === "correct" ? " is-active" : "")} onClick={() => setFilter("correct")}><iconify-icon icon="lucide:check"></iconify-icon>Correct · {nCorrect}</button>
            <button type="button" className={"qze-filter is-bad" + (filter === "wrong" ? " is-active" : "")} onClick={() => setFilter("wrong")}><iconify-icon icon="lucide:x"></iconify-icon>Wrong · {rows.length - nCorrect}</button>
          </>
        ) : (
          <>
            <button type="button" className={"qze-filter" + (filter === "all" ? " is-active" : "")} onClick={() => setFilter("all")}>All · {rows.length}</button>
            {labels.map((l, i) => <button key={i} type="button" className={"qze-filter" + (filter === String(i) ? " is-active" : "")} onClick={() => setFilter(String(i))}>{chipLabels ? chipLabels[i] : String.fromCharCode(65 + i)} · {rows.filter((m) => m.opt === i).length}</button>)}
          </>
        )}
        {funnel && (
          <>
            <button type="button" className={"qze-filter is-navy" + (filter === "clicked" ? " is-active" : "")} onClick={() => setFilter("clicked")}><iconify-icon icon="lucide:mouse-pointer-click"></iconify-icon>Clicked course · {rows.filter((m) => m.clicked).length}</button>
            <button type="button" className={"qze-filter is-gold" + (filter === "bought" ? " is-active" : "")} onClick={() => setFilter("bought")}><iconify-icon icon="lucide:badge-pound-sterling"></iconify-icon>Bought · {rows.filter((m) => m.bought).length}</button>
          </>
        )}
      </div>
      <div className="qze-member-rows">
        {shown.slice(0, limit).map((m) => {
          const ok = graded ? m.opt === correctIdx : null;
          return (
            <div key={m.id} className={"qze-member" + (m.me ? " is-me" : "")}>
              {m.avatar ? <img className="qze-member-avatar" src={m.avatar} alt="" /> : <span className="qze-member-avatar qze-member-initials">{initialsQZE(m.name)}</span>}
              <div className="qze-member-main">
                <div className="qze-member-name">{m.name}{m.me && <span className="qze-member-me">this device</span>}<span className={"qze-member-tier is-" + m.tier.toLowerCase()}>{m.tier}</span></div>
                <div className="qze-member-answer">{!plain && <span className="qze-tally-letter" style={{ width: 18, height: 18, fontSize: 10 }}>{String.fromCharCode(65 + m.opt)}</span>}<span>{labels[m.opt] || "—"}</span></div>
              </div>
              <div className="qze-member-side">
                <span className="qze-member-badges">
                  {m.bought && <span className="qze-member-badge is-gold"><iconify-icon icon="lucide:badge-pound-sterling"></iconify-icon>Bought{funnel && funnel.course.price ? " · £" + funnel.course.price : ""}</span>}
                  {m.clicked && !m.bought && <span className="qze-member-badge is-navy"><iconify-icon icon="lucide:mouse-pointer-click"></iconify-icon>Clicked course</span>}
                  {graded && <span className={"qze-member-badge " + (ok ? "is-good" : "is-bad")}><iconify-icon icon={ok ? "lucide:check" : "lucide:x"}></iconify-icon>{ok ? "Correct" : "Wrong"}</span>}
                </span>
                <span className="qze-member-ago">{m.ago}</span>
              </div>
            </div>
          );
        })}
        {shown.length === 0 && <p className="adl-cell-muted qze-rows-empty">No members match.</p>}
      </div>
      {shown.length > limit && (
        <button type="button" className="qze-add-opt" style={{ alignSelf: "center" }} onClick={() => setLimit(limit + 50)}>Show more · {shown.length - limit} remaining</button>
      )}
      {total > rows.length && <div className="qze-tally-foot" style={{ textAlign: "center" }}>Showing the most recent {rows.length.toLocaleString("en-GB")} of {total.toLocaleString("en-GB")} answers.</div>}
    </div>
  );
}

function CourseFunnel({ q, funnel, total }) {
  if (!q.course) return null;
  if (!funnel) return null;
  const c = funnel.course;
  return (
    <div className="qze-funnel">
      <div className="qze-funnel-head">
        <div className="qze-panel-title" style={{ fontSize: 14 }}>Course conversion</div>
        <span className="qze-chip"><iconify-icon icon="lucide:book-open"></iconify-icon>{c.title}{c.price ? " · £" + c.price : ""}</span>
      </div>
      <div className="qze-funnel-steps">
        <div className="qze-funnel-step"><span className="qze-funnel-n">{total.toLocaleString("en-GB")}</span><span className="qze-funnel-l">answered</span></div>
        <iconify-icon icon="lucide:chevron-right" class="qze-funnel-arrow"></iconify-icon>
        <div className="qze-funnel-step is-navy"><span className="qze-funnel-n">{funnel.clicks.toLocaleString("en-GB")}</span><span className="qze-funnel-l">clicked the course</span><span className="qze-funnel-s">{pctQZE(funnel.clicks, total)}% of answers · {funnel.clicksWrong} after a wrong answer</span></div>
        <iconify-icon icon="lucide:chevron-right" class="qze-funnel-arrow"></iconify-icon>
        <div className="qze-funnel-step is-gold"><span className="qze-funnel-n">{funnel.paid.toLocaleString("en-GB")}</span><span className="qze-funnel-l">bought the course</span><span className="qze-funnel-s">{pctQZE(funnel.paid, funnel.clicks)}% of clicks · £{funnel.revenue.toLocaleString("en-GB")} revenue</span></div>
      </div>
    </div>
  );
}

/* Whole-survey view for the Intro screen: starts, completions, and where
   members drop off step by step. */
function surveyOverviewQZE(survey) {
  const qs = survey.questions || [];
  const r = rngQZE(hashQZE("survey-overview:" + qs.length + ":" + (survey.title || "")));
  const completed = 842 + (readSurveyAnswersQZE().length ? 1 : 0);
  const started = Math.round(completed * (1.25 + r() * 0.2));
  const reached = [];
  let cur = started;
  qs.forEach((_, i) => {
    reached.push(cur);
    const remaining = qs.length - i - 1;
    const drop = remaining ? Math.round((cur - completed) * (0.15 + r() * 0.3)) : cur - completed;
    cur = Math.max(completed, cur - drop);
  });
  return { started, completed, reached, avgMins: Math.round(2 + r() * 3) };
}
function SurveyOverviewBody({ survey }) {
  const qs = survey.questions || [];
  const o = surveyOverviewQZE(survey);
  const dropped = o.started - o.completed;
  const rows = respondentsQZE("survey-all:" + qs.length, [o.completed, dropped], readSurveyAnswersQZE().length ? 0 : null);
  return (
    <>
      <div className="qze-tally-sum">
        <div className="qze-tally-kpi"><b>{o.started.toLocaleString("en-GB")}</b><span>started the survey</span></div>
        <div className="qze-tally-kpi is-good"><b>{o.completed.toLocaleString("en-GB")}</b><span>completed all {qs.length} steps</span></div>
        <div className="qze-tally-kpi"><b>{pctQZE(o.completed, o.started)}%</b><span>completion rate</span></div>
        <div className="qze-tally-kpi"><b>{o.avgMins} min</b><span>average time to finish</span></div>
      </div>
      <div>
        <div className="qze-panel-title" style={{ fontSize: 14, marginBottom: 10 }}>Where members drop off</div>
        <div className="qze-tally">
          {qs.map((sq, i) => (
            <div key={i} className={"qze-tally-row" + (i === 0 ? " is-top" : "")}>
              <span className="qze-tally-letter">{i + 1}</span>
              <div>
                <div className="qze-tally-label"><span>{sq.q || "Untitled step"}</span>{i > 0 && o.reached[i - 1] - o.reached[i] > 0 && <em>−{(o.reached[i - 1] - o.reached[i]).toLocaleString("en-GB")} left here</em>}</div>
                <div className="qze-tally-track"><div className="qze-tally-fill" style={{ width: pctQZE(o.reached[i], o.started) + "%" }} /></div>
              </div>
              <div className="qze-tally-num"><b>{pctQZE(o.reached[i], o.started)}%</b> · {o.reached[i].toLocaleString("en-GB")}</div>
            </div>
          ))}
        </div>
        <div className="qze-tally-foot">Share of members who started the survey and reached each step. Per-step answers are under each step's own Responses button.</div>
      </div>
      <RespondentList rows={rows} labels={["Completed the survey", "Dropped off part-way"]} chipLabels={["Completed", "Dropped off"]} correctIdx={null} total={o.started} plain />
    </>
  );
}

function QuizResponsesBody({ q }) {
  const t = quizTallyQZE(q);
  const opts = q.options || [];
  const ci = opts.findIndex((o) => o.correct);
  const f = courseFunnelQZE(q, t);
  if (!t || !t.total) return <p className="adl-cell-muted" style={{ margin: 0 }}>No answers yet{q.active === false ? " — the question is hidden from the feed." : "."}</p>;
  return (
    <>
      <div className="qze-tally-sum">
        <div className="qze-tally-kpi"><b>{t.total.toLocaleString("en-GB")}</b><span>answers</span></div>
        <div className="qze-tally-kpi is-good"><b>{pctQZE(t.correct, t.total)}%</b><span>answered correctly</span></div>
        <div className="qze-tally-kpi is-bad"><b>{pctQZE(t.total - t.correct, t.total)}%</b><span>answered wrong</span></div>
        <div className="qze-tally-kpi"><b>{(t.correct * PF_QZE.pointsFor(q)).toLocaleString("en-GB")}</b><span>points paid out</span></div>
      </div>
      <TallyBars labels={opts.map((o) => o.label)} counts={t.counts} total={t.total} correctIdx={ci} mine={t.mine} />
      <div className="qze-tally-foot">Green bar is the correct answer. Includes answers given on this device.</div>
      <CourseFunnel q={q} funnel={f} total={t.total} />
      <RespondentList rows={applyFunnelQZE(respondentsQZE(q.key, t.counts, t.mine), f, ci, t.total)} labels={opts.map((o) => o.label)} correctIdx={ci} total={t.total} funnel={f} />
    </>
  );
}
function SurveyResponsesBody({ sq, idx }) {
  const t = surveyTallyQZE(sq, idx);
  const labels = (sq.opts || []).filter((o) => String(o || "").trim());
  if (!t) return <p className="adl-cell-muted" style={{ margin: 0 }}>Add options to see responses.</p>;
  return (
    <>
      <div className="qze-tally-sum">
        <div className="qze-tally-kpi"><b>{t.total.toLocaleString("en-GB")}</b><span>responses</span></div>
        <div className="qze-tally-kpi"><b>{labels[t.counts.indexOf(Math.max.apply(null, t.counts))]}</b><span>most common answer</span></div>
      </div>
      <TallyBars labels={labels} counts={t.counts} total={t.total} correctIdx={null} mine={t.mine} />
      <div className="qze-tally-foot">Navy bar is the most common answer. Includes the answer given on this device.</div>
      <RespondentList rows={respondentsQZE("survey:" + idx + ":" + (sq.q || ""), t.counts, t.mine)} labels={labels} correctIdx={null} total={t.total} />
    </>
  );
}

/* Sticky footer inside the editor card: explicit Save / Discard. Edits are
   held in a draft until saved, so nothing reaches the feed half-finished. */
function QzeSaveBar({ dirty, isNew, onSave, onDiscard, canSave, saveLabel, blocked }) {
  return (
    <div className={"qze-savebar" + (dirty ? " is-dirty" : "")}>
      <span className="qze-savebar-status">
        {dirty ? <><iconify-icon icon="lucide:circle-dot"></iconify-icon>{isNew ? "New — not saved yet" : "Unsaved changes"}</> : <><iconify-icon icon="lucide:check-circle-2"></iconify-icon>All changes saved</>}
        {dirty && blocked && <em> · {blocked}</em>}
      </span>
      <span className="qze-savebar-actions">
        {dirty && <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={onDiscard}>{isNew ? "Discard" : "Discard changes"}</button>}
        <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" disabled={!dirty || !canSave} onClick={onSave}><iconify-icon icon="lucide:save"></iconify-icon>{saveLabel || "Save"}</button>
      </span>
    </div>
  );
}

/* Centered modal (Esc / backdrop closes). */
function QzeModal({ title, sub, onClose, children }) {
  useEffectQZE(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="qze-modal-bg" onClick={onClose}>
      <div className="qze-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="qze-modal-head">
          <div><div className="qze-modal-title">{title}</div>{sub && <div className="qze-modal-sub">{sub}</div>}</div>
          <button type="button" className="qze-modal-x" aria-label="Close" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>
        <div className="qze-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Quiz tab -- */
/* Master/detail: a compact list of questions on the left, one sectioned
   editor in the middle, and a phone simulator on the right that renders the
   selected question exactly as the mobile feed will post it. */
const QZE_AUTHORS = {
  course: { name: "Profinity", avatar: "assets/profinity-icon.jpg" },
  tim: { name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png" },
  alicia: { name: "Alicia", avatar: null }
};
function sourceLabelQZE(src) { return (QZE_SOURCES.find((s) => s.key === src) || QZE_SOURCES[0]).label; }
function isReadyQZE(q) {
  return !!(q.question && String(q.question).trim() && (q.options || []).filter((o) => o && String(o.label || "").trim()).length >= 2 && (q.options || []).some((o) => o && o.correct));
}

function QuizListRow({ q, selected, onClick, draftTag }) {
  const hidden = q.active === false;
  const course = PF_QZE.COURSES[q.course];
  const ready = isReadyQZE(q);
  return (
    <button type="button" className={"qze-row" + (selected ? " is-selected" : "") + (hidden ? " is-hidden" : "")} onClick={onClick}>
      <span className={"qze-row-dot" + (hidden ? " is-off" : ready ? " is-on" : " is-warn")} aria-hidden="true" />
      <span className="qze-row-main">
        <span className="qze-row-q">{q.question && q.question.trim() ? q.question : <em>Untitled question</em>}</span>
        <span className="qze-row-meta">
          {draftTag && <span className="qze-row-draft">{draftTag}</span>}
          <span>{QZE_AUTHORS[q.source] ? QZE_AUTHORS[q.source].name : "Profinity"}</span>
          {course && <span>· {course.title}</span>}
          <span className="qze-row-pts">+{PF_QZE.pointsFor(q)}</span>
        </span>
      </span>
      <iconify-icon icon="lucide:chevron-right" class="qze-row-chev"></iconify-icon>
    </button>
  );
}

function QuizListPanel({ questions, selectedKey, onSelect, onAdd, onReset, custom, draft }) {
  const [filter, setFilter] = useStateQZE("all");
  const [query, setQuery] = useStateQZE("");
  const live = questions.filter((q) => q.active !== false).length;
  const shown = questions.filter((q) => {
    if (filter === "live" && q.active === false) return false;
    if (filter === "hidden" && q.active !== false) return false;
    if (query) {
      const hay = [q.question, q.topic, q.caption, q.lesson, q.key, (PF_QZE.COURSES[q.course] || {}).title, sourceLabelQZE(q.source)].join(" ").toLowerCase();
      if (hay.indexOf(query.toLowerCase()) === -1) return false;
    }
    return true;
  });
  return (
    <aside className="adl-card qze-list-panel">
      <div className="qze-list-head">
        <div>
          <div className="qze-panel-title">Questions</div>
          <div className="qze-panel-sub">{questions.length} in pool · {live} live · {questions.length - live} hidden</div>
        </div>
        <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={onAdd}><iconify-icon icon="lucide:plus"></iconify-icon>New</button>
      </div>
      <div className="qze-search qze-search-wide"><iconify-icon icon="lucide:search"></iconify-icon><input value={query} placeholder="Search questions, courses…" onChange={(e) => setQuery(e.target.value)} /></div>
      <div className="qze-filters">
        {[["all", "All"], ["live", "Live"], ["hidden", "Hidden"]].map(([k, l]) => (
          <button key={k} type="button" className={"qze-filter" + (filter === k ? " is-active" : "")} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      <div className="qze-rows">
        {draft && draft.isNew && (
          <QuizListRow q={draft.data} selected={draft.key === selectedKey} onClick={() => onSelect(draft.key)} draftTag="New · unsaved" />
        )}
        {shown.map((q) => <QuizListRow key={q.key} q={draft && !draft.isNew && draft.key === q.key ? draft.data : q} selected={q.key === selectedKey} onClick={() => onSelect(q.key)} draftTag={draft && draft.key === q.key ? "Unsaved" : null} />)}
        {shown.length === 0 && <p className="adl-cell-muted qze-rows-empty">{questions.length ? "No questions match." : "No questions yet — tap New."}</p>}
      </div>
      <div className="qze-list-foot">
        <span className="qze-panel-sub">{custom ? "Pool edited in this browser" : "Built-in question set"}</span>
        {custom && <button className="qze-linkbtn" type="button" onClick={onReset}><iconify-icon icon="lucide:rotate-ccw"></iconify-icon>Reset to defaults</button>}
      </div>
    </aside>
  );
}

function QzeSection({ n, title, sub, children }) {
  return (
    <section className="qze-section">
      <div className="qze-section-head">
        <span className="qze-section-n">{n}</span>
        <div><div className="qze-section-title">{title}</div>{sub && <div className="qze-section-sub">{sub}</div>}</div>
      </div>
      <div className="qze-section-body">{children}</div>
    </section>
  );
}

function QuizEditorPanel({ q, onUpdate, onRemove, dirty, isNew, onSave, onDiscard }) {
  const [showResponses, setShowResponses] = useStateQZE(false);
  if (!q) {
    return (
      <section className="adl-card qze-editor qze-editor-empty">
        <iconify-icon icon="lucide:mouse-pointer-click"></iconify-icon>
        <div className="qze-panel-title">Pick a question to edit</div>
        <p className="qze-panel-sub">Choose one from the list on the left, or tap New to write a fresh one.</p>
      </section>
    );
  }
  const opts = q.options || [];
  const hidden = q.active === false;
  const ready = isReadyQZE(q);
  const updateOption = (idx, patch) => onUpdate({ options: opts.map((o, i) => (i === idx ? { ...o, ...patch } : o)) });
  const setCorrect = (idx) => onUpdate({ options: opts.map((o, i) => ({ ...o, correct: i === idx })) });
  const addOption = () => onUpdate({ options: opts.concat([{ label: "", correct: false }]) });
  const removeOption = (idx) => {
    const next = opts.filter((_, i) => i !== idx);
    if (next.length && !next.some((o) => o.correct)) next[0] = { ...next[0], correct: true };
    onUpdate({ options: next });
  };
  const hasCorrect = opts.some((o) => o.correct);

  return (
    <section className="adl-card qze-editor">
      <div className="qze-editor-head">
        <div className="qze-editor-head-top">
          <div className="qze-editor-head-l">
            <span className="qze-eyebrow">Editing</span>
            <span className="qze-chip"><iconify-icon icon="lucide:hash"></iconify-icon>{q.key}</span>
            {!ready && <span className="qze-chip is-warn"><iconify-icon icon="lucide:alert-triangle"></iconify-icon>Incomplete — needs a question, 2+ answers and a correct one</span>}
          </div>
          <div className="qze-editor-head-r">
            <label className="qze-switch">
              <button type="button" className={"adl-toggle" + (!hidden ? " is-on" : "")} role="switch" aria-checked={!hidden} onClick={() => onUpdate({ active: hidden })}><span className="adl-toggle-knob" /></button>
              <span>{hidden ? "Hidden from feed" : "Shown in feed"}</span>
            </label>
            {!isNew && <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => setShowResponses(true)}><iconify-icon icon="lucide:bar-chart-3"></iconify-icon>Responses</button>}
            {!isNew && <button className="adl-btn adl-btn-danger adl-btn-sm" type="button" onClick={onRemove}><iconify-icon icon="lucide:trash-2"></iconify-icon>Delete</button>}
          </div>
        </div>
      </div>
      {showResponses && (
        <QzeModal title="Responses" sub={q.question || "This question"} onClose={() => setShowResponses(false)}>
          <QuizResponsesBody q={q} />
        </QzeModal>
      )}

      <QzeSection n="1" title="Question & answers" sub="What members are asked, and which answer is right.">
        <div className="adl-field">
          <label htmlFor={"qze-q-" + q.key}>Question</label>
          <textarea id={"qze-q-" + q.key} className="qze-question-input" value={q.question || ""} rows={3}
            placeholder="e.g. Which facial danger zone carries the highest risk of vascular occlusion during tear trough filler injection?"
            onChange={(e) => onUpdate({ question: e.target.value })} />
          <div className="adl-field-hint">Shown on the feed card. One or two lines works best.</div>
        </div>
        <div className="adl-field">
          <label>Answer options</label>
          <div className="qze-options">
            {opts.map((o, i) => (
              <div key={i} className={"qze-option-row" + (o.correct ? " is-correct" : "")}>
                <button type="button" className="qze-correct-radio" aria-label={o.correct ? "Correct answer" : "Mark as correct answer"} onClick={() => setCorrect(i)}>
                  {o.correct && <iconify-icon icon="lucide:check"></iconify-icon>}
                </button>
                <input value={o.label || ""} placeholder={"Answer " + (i + 1)} onChange={(e) => updateOption(i, { label: e.target.value })} />
                {o.correct && <span className="qze-correct-tag">Correct</span>}
                {opts.length > 2 && (
                  <button type="button" className="qze-opt-x" aria-label={"Remove answer " + (i + 1)} onClick={() => removeOption(i)}><iconify-icon icon="lucide:x"></iconify-icon></button>
                )}
              </div>
            ))}
            {opts.length < 6 && <button type="button" className="qze-add-opt" onClick={addOption}><iconify-icon icon="lucide:plus"></iconify-icon>Add answer</button>}
          </div>
          <div className="adl-field-hint">{hasCorrect ? "Tap the circle to change which answer is correct. Options are shown in this order." : "Tap the circle next to the correct answer — the question won't be posted until one is marked."}</div>
        </div>
      </QzeSection>

      <QzeSection n="2" title="How it's posted in the feed" sub="The post wraps the question card. Watch the phone on the right update as you type.">
        <div className="adl-field">
          <label>Posted as</label>
          <select value={q.source || "course"} onChange={(e) => onUpdate({ source: e.target.value })}>
            {QZE_SOURCES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div className="adl-field">
          <label>Caption <span className="qze-opt">the text above the question card</span></label>
          <textarea className="qze-caption-input" rows={3} value={captionQZE(q)} onChange={(e) => onUpdate({ caption: e.target.value })} />
          <div className="adl-field-hint">
            {q.caption && String(q.caption).trim()
              ? <>Your own caption. <button type="button" className="qze-linkbtn" onClick={() => onUpdate({ caption: "" })}>Use the suggested caption instead</button></>
              : "Suggested from the course and author above — edit it freely, or leave it as is."}
          </div>
        </div>
      </QzeSection>

      <QzeSection n="3" title="Linked course" sub="Where the answer is taught. Drives the button members see after answering.">
        <div className="adl-field">
          <label>Course</label>
          <select value={q.course || ""} onChange={(e) => onUpdate({ course: e.target.value })}>
            <option value="">— none —</option>
            {QZE_COURSES.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
          <div className="adl-field-hint">Members who own it get "Complete the course quiz" or "Revisit the lesson"; everyone else gets "Get the course".</div>
        </div>
        <div className="adl-field">
          <label>Lesson to revisit</label>
          <input value={q.lesson || ""} placeholder="e.g. Danger zones of the tear trough" onChange={(e) => onUpdate({ lesson: e.target.value })} />
          <div className="adl-field-hint">The lesson in this course that teaches the answer. Members who get it wrong see it, so they know exactly where to look.</div>
        </div>
      </QzeSection>

      <QzeSection n="4" title="Points" sub="Paid once, the first time a member gets it right. Wrong answers earn nothing.">
        <div className="adl-field qze-field-narrow">
          <label>Points for a correct answer</label>
          <div className="qze-points-input">
            <input type="number" min="0" step="5" value={q.points != null ? q.points : PF_QZE.POINTS} onChange={(e) => onUpdate({ points: Number(e.target.value) || 0 })} />
            <span>pts</span>
          </div>
          <div className="adl-field-hint">Default is {PF_QZE.POINTS}.</div>
        </div>
      </QzeSection>

      <QzeSaveBar dirty={dirty} isNew={isNew} onSave={onSave} onDiscard={onDiscard} canSave={ready || q.active === false} saveLabel={isNew ? "Save question" : "Save changes"}
        blocked={!ready && q.active !== false ? "finish the question or switch it to hidden before saving" : null} />
    </section>
  );
}

/* Phone simulator: the selected question rendered as the mobile feed posts
   it, with a switch between the unanswered card and the two post-answer
   outcomes (scenario() from the engine, so copy and CTA match the feed). */
function PhonePreview({ q }) {
  const [state, setState] = useStateQZE("before");
  useEffectQZE(() => { setState("before"); }, [q && q.key]);
  /* bring the outcome card into view once an answer state is picked */
  useEffectQZE(() => {
    const feed = document.querySelector(".qze-ph-feed");
    if (!feed) return;
    if (state === "before") { feed.scrollTop = 0; return; }
    const t = setTimeout(() => { const o = feed.querySelector(".qze-ph-outcome"); if (o) feed.scrollTop = Math.max(0, o.offsetTop - 120); }, 30);
    return () => clearTimeout(t);
  }, [state, q && q.key]);
  if (!q) return <aside className="qze-phone-col"><div className="qze-phone-empty">Select a question to preview it here.</div></aside>;
  const author = QZE_AUTHORS[q.source] || QZE_AUTHORS.course;
  const opts = (q.options || []).filter((o) => o && String(o.label || "").trim());
  const correctIdx = opts.findIndex((o) => o.correct);
  const wrongIdx = opts.findIndex((o) => !o.correct);
  const picked = state === "correct" ? correctIdx : state === "wrong" ? wrongIdx : -1;
  const answered = state !== "before";
  let sc = null;
  if (answered) { try { sc = PF_QZE.scenario(q, state === "correct", { known: false, surface: "mobile" }); } catch (e) { sc = null; } }
  const pts = PF_QZE.pointsFor(q);
  const body = captionQZE(q);
  return (
    <aside className="qze-phone-col">
      <div className="qze-phone-toolbar">
        <span className="qze-eyebrow">Feed preview</span>
        <div className="qze-seg">
          {[["before", "Unanswered"], ["correct", "Correct"], ["wrong", "Wrong"]].map(([k, l]) => (
            <button key={k} type="button" className={state === k ? "is-active" : ""} onClick={() => setState(k)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="qze-phone">
        <div className="qze-phone-screen">
          <div className="qze-ph-status"><span>9:41</span><span className="qze-ph-status-r"><i /><i /><i /></span></div>
          <div className="qze-ph-appbar"><img src="assets/profinity-icon-purple-gold.png" alt="" /><span>Newsfeed</span><span className="qze-ph-pill">1,240</span></div>
          <div className="qze-ph-feed">
            <div className="qze-ph-ghost"><span /><span style={{ width: "70%" }} /></div>
            <div className={"qze-ph-post" + (q.active === false ? " is-hidden" : "")}>
              <div className="qze-ph-author">
                {author.avatar ? <img src={author.avatar} alt="" /> : <span className="qze-ph-initial">{author.name[0]}</span>}
                <div><div className="qze-ph-name">{author.name} <iconify-icon icon="lucide:badge-check"></iconify-icon></div><div className="qze-ph-time">2h · #quiz</div></div>
              </div>
              <p className="qze-ph-body">{body}</p>
              <div className="qze-ph-quiz">
                <div className="qze-ph-quiz-q"><span className="qze-ph-quiz-badge"><iconify-icon icon="lucide:brain"></iconify-icon></span><span>{q.question && q.question.trim() ? q.question : "Your question will appear here"}</span></div>
                <div className="qze-ph-opts">
                  {opts.length ? opts.map((o, i) => {
                    let cls = "qze-ph-opt";
                    if (answered && o.correct) cls += " is-correct";
                    if (answered && i === picked && !o.correct) cls += " is-wrong";
                    return <div key={i} className={cls}><span className="qze-ph-opt-letter">{String.fromCharCode(65 + i)}</span><span>{o.label}</span>{answered && o.correct && <iconify-icon icon="lucide:check"></iconify-icon>}{answered && i === picked && !o.correct && <iconify-icon icon="lucide:x"></iconify-icon>}</div>;
                  }) : <div className="qze-ph-opt is-ghost">Add answer options…</div>}
                </div>
                {!answered && <div className="qze-ph-foot">Tap an option to answer · <b>+{pts} pts</b></div>}
                {answered && sc && (
                  <div className={"qze-ph-outcome is-" + sc.tone}>
                    <div className="qze-ph-outcome-head"><b>{sc.title}</b>{sc.chip && <span className={"qze-ph-chip is-" + sc.chip.kind}>{sc.chip.label}</span>}</div>
                    <p>{sc.body}</p>
                    {sc.course && (
                      <div className="qze-ph-course">
                        {sc.course.image ? <img src={sc.course.image} alt="" /> : <span className="qze-ph-course-img" />}
                        <div><div className="qze-ph-course-eyebrow">{sc.course.eyebrow}</div><div className="qze-ph-course-title">{sc.course.title}</div>{sc.course.lesson && <div className="qze-ph-course-lesson">{sc.course.lesson}</div>}<div className="qze-ph-course-meta">{sc.course.meta}</div></div>
                      </div>
                    )}
                    <div className="qze-ph-cta">{sc.cta.label}</div>
                  </div>
                )}
              </div>
              <div className="qze-ph-actions"><span><iconify-icon icon="lucide:heart"></iconify-icon>{q.likes || "0"}</span><span><iconify-icon icon="lucide:message-circle"></iconify-icon>{q.comments || "0"}</span><span><iconify-icon icon="lucide:share-2"></iconify-icon>{q.shares || "0"}</span></div>
            </div>
            <div className="qze-ph-ghost"><span /><span style={{ width: "55%" }} /></div>
          </div>
          <div className="qze-ph-tabbar">{["lucide:home", "lucide:compass", "lucide:plus-circle", "lucide:graduation-cap", "lucide:user"].map((ic, i) => <iconify-icon key={ic} icon={ic} class={i === 0 ? "is-active" : ""}></iconify-icon>)}</div>
        </div>
      </div>
      <p className="qze-phone-note">{q.active === false ? "This question is hidden — it won't be posted until you switch it on." : answered ? "What a member sees straight after tapping " + (state === "correct" ? "the right" : "a wrong") + " answer, as a non-owner of the course." : "How the question card sits in the mobile newsfeed."}</p>
    </aside>
  );
}

function QuizQuestionsTab({ questions, selectedKey, onSelect, q, draft, onUpdate, onAdd, onRemove, onReset, onSave, onDiscard, custom }) {
  return (
    <div className="qze-layout">
      <QuizListPanel questions={questions} selectedKey={selectedKey} onSelect={onSelect} onAdd={onAdd} onReset={onReset} custom={custom} draft={draft} />
      <QuizEditorPanel q={q} onUpdate={onUpdate} onRemove={onRemove} dirty={!!draft} isNew={!!(draft && draft.isNew)} onSave={onSave} onDiscard={onDiscard} />
      <PhonePreview q={q} />
    </div>
  );
}

/* ----------------------------------------------------------- Survey tab -- */
/* Same three-column shape as the quiz tab: steps on the left (plus an Intro
   row for the title/opening line), one step's editor in the middle, and the
   phone showing the wizard at that step. */
function SurveyListPanel({ survey, selected, onSelect, onAdd, onReset, custom }) {
  const qs = survey.questions || [];
  return (
    <aside className="adl-card qze-list-panel">
      <div className="qze-list-head">
        <div>
          <div className="qze-panel-title">Survey steps</div>
          <div className="qze-panel-sub">{qs.length} question{qs.length === 1 ? "" : "s"} · one per screen</div>
        </div>
        <button className="adl-btn adl-btn-navy adl-btn-sm" type="button" onClick={onAdd}><iconify-icon icon="lucide:plus"></iconify-icon>New</button>
      </div>
      <div className="qze-rows" style={{ paddingTop: 4 }}>
        <button type="button" className={"qze-row" + (selected === "intro" ? " is-selected" : "")} onClick={() => onSelect("intro")}>
          <span className="qze-row-n"><iconify-icon icon="lucide:sparkles"></iconify-icon></span>
          <span className="qze-row-main">
            <span className="qze-row-q">{survey.title || <em>Untitled survey</em>}</span>
            <span className="qze-row-meta"><span>Title &amp; opening line</span><span>· {surveyOverviewQZE(survey).completed.toLocaleString("en-GB")} completed</span></span>
          </span>
          <iconify-icon icon="lucide:chevron-right" class="qze-row-chev"></iconify-icon>
        </button>
        {qs.map((sq, i) => {
          const t = surveyTallyQZE(sq, i);
          return (
            <button key={i} type="button" className={"qze-row" + (selected === i ? " is-selected" : "")} onClick={() => onSelect(i)}>
              <span className="qze-row-n">{i + 1 < 10 ? "0" + (i + 1) : i + 1}</span>
              <span className="qze-row-main">
                <span className="qze-row-q">{sq.q && sq.q.trim() ? sq.q : <em>Untitled question</em>}</span>
                <span className="qze-row-meta"><span>{(sq.opts || []).filter((o) => String(o || "").trim()).length} options</span>{t && <span>· {t.total.toLocaleString("en-GB")} responses</span>}</span>
              </span>
              <iconify-icon icon="lucide:chevron-right" class="qze-row-chev"></iconify-icon>
            </button>
          );
        })}
      </div>
      <div className="qze-list-foot">
        <span className="qze-panel-sub">{custom ? "Survey edited in this browser" : "Built-in question set"}</span>
        {custom && <button className="qze-linkbtn" type="button" onClick={onReset}><iconify-icon icon="lucide:rotate-ccw"></iconify-icon>Reset to defaults</button>}
      </div>
    </aside>
  );
}

function SurveyEditorPanel({ survey, selected, onChange, onRemove, onMove, dirty, onSave, onDiscard }) {
  const [showResponses, setShowResponses] = useStateQZE(false);
  const qs = survey.questions || [];
  if (selected === "intro") {
    return (
      <section className="adl-card qze-editor">
        <div className="qze-editor-head">
          <div className="qze-editor-head-top">
            <div className="qze-editor-head-l"><span className="qze-eyebrow">Editing</span><span className="qze-chip"><iconify-icon icon="lucide:sparkles"></iconify-icon>Intro screen</span></div>
            <div className="qze-editor-head-r">
              <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => setShowResponses(true)}><iconify-icon icon="lucide:bar-chart-3"></iconify-icon>Responses</button>
            </div>
          </div>
        </div>
        {showResponses && (
          <QzeModal title="Survey responses" sub={survey.title || "Business Survey"} onClose={() => setShowResponses(false)}>
            <SurveyOverviewBody survey={survey} />
          </QzeModal>
        )}
        <QzeSection n="1" title="Title & opening line" sub="Shown above every step of the wizard, on the My Learning page for free members.">
          <div className="adl-field">
            <label>Title</label>
            <input value={survey.title || ""} placeholder="Let's personalise your experience" onChange={(e) => onChange({ ...survey, title: e.target.value })} />
          </div>
          <div className="adl-field">
            <label>Opening line</label>
            <input value={survey.sub || ""} placeholder="Help us tailor content and connections that matter most to you." onChange={(e) => onChange({ ...survey, sub: e.target.value })} />
            <div className="adl-field-hint">One sentence on why members should answer. Keep it warm and short.</div>
          </div>
        </QzeSection>
        <QzeSection n="2" title="How it's scored" sub="Nothing to set here — surveys have no right or wrong answers.">
          <p className="adl-cell-muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>Every option is a valid self-report. Answers are saved once the member finishes all {qs.length} steps and are used to tailor their free resources. Individual steps never pay points.</p>
        </QzeSection>
        <QzeSaveBar dirty={dirty} onSave={onSave} onDiscard={onDiscard} canSave={true} saveLabel="Save survey" />
      </section>
    );
  }
  const i = selected;
  const sq = qs[i];
  if (!sq) {
    return (
      <section className="adl-card qze-editor qze-editor-empty">
        <iconify-icon icon="lucide:mouse-pointer-click"></iconify-icon>
        <div className="qze-panel-title">Pick a step to edit</div>
        <p className="qze-panel-sub">Choose one from the list on the left, or tap New to add a question.</p>
      </section>
    );
  }
  const opts = sq.opts || [];
  const patch = (p) => onChange({ ...survey, questions: qs.map((x, k) => (k === i ? { ...x, ...p } : x)) });
  const setOpt = (k, v) => patch({ opts: opts.map((o, j) => (j === k ? v : o)) });
  const addOpt = () => patch({ opts: opts.concat([""]) });
  const removeOpt = (k) => patch({ opts: opts.filter((_, j) => j !== k) });
  const filled = opts.filter((o) => String(o || "").trim()).length;
  return (
    <section className="adl-card qze-editor">
      <div className="qze-editor-head">
        <div className="qze-editor-head-top">
          <div className="qze-editor-head-l">
            <span className="qze-eyebrow">Editing</span>
            <span className="qze-chip">Step {i + 1} of {qs.length}</span>
            {filled < 2 && <span className="qze-chip is-warn"><iconify-icon icon="lucide:alert-triangle"></iconify-icon>Needs at least 2 options</span>}
          </div>
          <div className="qze-editor-head-r">
            <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" disabled={i === 0} onClick={() => onMove(i, -1)} aria-label="Move earlier"><iconify-icon icon="lucide:arrow-up"></iconify-icon></button>
            <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" disabled={i === qs.length - 1} onClick={() => onMove(i, 1)} aria-label="Move later"><iconify-icon icon="lucide:arrow-down"></iconify-icon></button>
            <button className="adl-btn adl-btn-ghost adl-btn-sm" type="button" onClick={() => setShowResponses(true)}><iconify-icon icon="lucide:bar-chart-3"></iconify-icon>Responses</button>
            <button className="adl-btn adl-btn-danger adl-btn-sm" type="button" onClick={() => onRemove(i)}><iconify-icon icon="lucide:trash-2"></iconify-icon>Delete</button>
          </div>
        </div>
      </div>
      {showResponses && (
        <QzeModal title="Responses" sub={sq.q || ("Step " + (i + 1))} onClose={() => setShowResponses(false)}>
          <SurveyResponsesBody sq={sq} idx={i} />
        </QzeModal>
      )}
      <QzeSection n="1" title="Question" sub="What this step asks. Watch the phone on the right update as you type.">
        <div className="adl-field">
          <label>Question</label>
          <textarea className="qze-question-input" rows={2} value={sq.q || ""} placeholder="e.g. Which stage are you currently at in aesthetics?" onChange={(e) => patch({ q: e.target.value })} />
        </div>
      </QzeSection>
      <QzeSection n="2" title="Answer options" sub="Members pick one. There's no correct answer — every option is a valid self-report.">
        <div className="adl-field">
          <div className="qze-options">
            {opts.map((o, k) => (
              <div key={k} className="qze-option-row">
                <span className="qze-drag-n">{String.fromCharCode(65 + k)}</span>
                <input value={o} placeholder={"Option " + (k + 1)} onChange={(e) => setOpt(k, e.target.value)} />
                {opts.length > 2 && <button type="button" className="qze-opt-x" aria-label={"Remove option " + (k + 1)} onClick={() => removeOpt(k)}><iconify-icon icon="lucide:x"></iconify-icon></button>}
              </div>
            ))}
            {opts.length < 8 && <button type="button" className="qze-add-opt" onClick={addOpt}><iconify-icon icon="lucide:plus"></iconify-icon>Add option</button>}
          </div>
          <div className="adl-field-hint">Shown in this order. Blank options are dropped from the wizard.</div>
        </div>
      </QzeSection>
      <QzeSaveBar dirty={dirty} onSave={onSave} onDiscard={onDiscard} canSave={qs.every((x) => (x.opts || []).filter((o) => String(o || "").trim()).length >= 2)} saveLabel="Save survey"
        blocked={qs.every((x) => (x.opts || []).filter((o) => String(o || "").trim()).length >= 2) ? null : "every step needs at least 2 options"} />
    </section>
  );
}

function SurveyPhonePreview({ survey, selected }) {
  const qs = (survey.questions || []).map((x) => ({ q: x.q, opts: (x.opts || []).filter((o) => String(o || "").trim()) }));
  const step = selected === "intro" ? 0 : Math.min(selected, Math.max(qs.length - 1, 0));
  const cur = qs[step];
  const total = qs.length || 1;
  const pct = Math.round(((step + 1) / total) * 100);
  const picked = cur && cur.opts.length ? 0 : -1;
  return (
    <aside className="qze-phone-col">
      <div className="qze-phone-toolbar"><span className="qze-eyebrow">Wizard preview</span><span className="qze-chip">Step {step + 1} of {total}</span></div>
      <div className="qze-phone">
        <div className="qze-phone-screen">
          <div className="qze-ph-status"><span>9:41</span><span className="qze-ph-status-r"><i /><i /><i /></span></div>
          <div className="qze-ph-sv">
            <div className="qze-ph-sv-head"><img src="assets/profinity-icon-purple-gold.png" alt="" /><span className="qze-ph-sv-step">{step + 1}<i>/</i>{total}</span></div>
            <span className="qze-ph-sv-eyebrow"><i /> Personalise</span>
            <h3 className="qze-ph-sv-title">{survey.title || "Let's personalise your experience"}</h3>
            <p className="qze-ph-sv-sub">{survey.sub || "Help us tailor content and connections that matter most to you."}</p>
            <div className="qze-ph-sv-bar">{qs.map((_, i) => <span key={i} className={i < step ? "done" : i === step ? "cur" : ""} />)}<b>{pct}%</b></div>
            {cur ? (
              <>
                <div className="qze-ph-sv-q"><span className="qze-ph-sv-qn">{step + 1 < 10 ? "0" + (step + 1) : step + 1}</span><span>{cur.q && cur.q.trim() ? cur.q : "Your question will appear here"}</span></div>
                <div className="qze-ph-sv-opts">
                  {cur.opts.length ? cur.opts.map((o, i) => <div key={i} className={"qze-ph-sv-opt" + (i === picked ? " on" : "")}><span className="qze-ph-sv-radio" />{o}</div>) : <div className="qze-ph-sv-opt" style={{ color: "#9ca3af", fontStyle: "italic", borderStyle: "dashed" }}>Add answer options…</div>}
                </div>
              </>
            ) : <p className="qze-ph-sv-sub">Add a question to preview the wizard.</p>}
            <div className="qze-ph-sv-actions">
              {step > 0 && <span className="qze-ph-sv-back"><iconify-icon icon="lucide:chevron-left"></iconify-icon></span>}
              <span className="qze-ph-sv-continue">{step === total - 1 ? "See my summary" : "Continue"} →</span>
            </div>
          </div>
        </div>
      </div>
      <p className="qze-phone-note">{selected === "intro" ? "The title and opening line sit above every step." : "How step " + (step + 1) + " looks in the onboarding wizard on My Learning."}</p>
    </aside>
  );
}

function BusinessSurveyTab({ survey, selected, onSelect, onChange, onAdd, onRemove, onMove, onReset, custom, dirty, onSave, onDiscard }) {
  return (
    <div className="qze-layout">
      <SurveyListPanel survey={survey} selected={selected} onSelect={onSelect} onAdd={onAdd} onReset={onReset} custom={custom} />
      <SurveyEditorPanel survey={survey} selected={selected} onChange={onChange} onRemove={onRemove} onMove={onMove} dirty={dirty} onSave={onSave} onDiscard={onDiscard} />
      <SurveyPhonePreview survey={survey} selected={selected} />
    </div>
  );
}

/* ------------------------------------------------------------------ view -- */
function useToastQZE() {
  const [msg, setMsg] = useStateQZE(null);
  useEffectQZE(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1800);
    return () => clearTimeout(t);
  }, [msg]);
  return [msg, setMsg];
}

function QuizEditorView() {
  const [questions, setQuestionsState] = useStateQZE(() => PF_QZE.getQuestions());
  const [savedSurvey, setSavedSurvey] = useStateQZE(() => PF_QZE.getSurvey());
  const [surveyDraft, setSurveyDraft] = useStateQZE(null);          // whole-survey draft, null = clean
  const survey = surveyDraft || savedSurvey;
  const [tab, setTab] = useStateQZE(() => (new URLSearchParams(window.location.search).get("tab") === "survey" ? "survey" : "quiz"));
  const [selectedKey, setSelectedKey] = useStateQZE(() => {
    const want = new URLSearchParams(window.location.search).get("q");
    const list = PF_QZE.getQuestions();
    return (want && list.some((x) => x.key === want)) ? want : (list[0] ? list[0].key : null);
  });
  const [draft, setDraft] = useStateQZE(null);                      // { key, data, isNew } — unsaved quiz edits
  const [toast, setToast] = useToastQZE();

  const anyDirty = !!draft || !!surveyDraft;
  useEffectQZE(() => {
    if (!anyDirty) return;
    const h = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [anyDirty]);
  const confirmDiscard = () => !anyDirty || window.confirm("You have unsaved changes. Discard them?");

  /* ---- quiz ---- */
  const savedQ = questions.find((x) => x.key === selectedKey) || null;
  const q = draft && draft.key === selectedKey ? draft.data : savedQ;
  const selectQuestion = (key) => {
    if (key === selectedKey) return;
    if (draft && !confirmDiscard()) return;
    setDraft(null); setSelectedKey(key);
  };
  const updateQuestion = (patch) => {
    if (!q) return;
    setDraft({ key: q.key, isNew: !!(draft && draft.isNew), data: { ...q, ...patch } });
  };
  const addQuestion = () => {
    if (draft && !confirmDiscard()) return;
    const key = uidQZE("new");
    setDraft({ key, isNew: true, data: {
      key, source: "tim", topic: "", caption: "", course: "", lesson: "", question: "", points: PF_QZE.POINTS, active: false,
      options: [{ label: "", correct: true }, { label: "", correct: false }, { label: "", correct: false }, { label: "", correct: false }],
      likes: "0", comments: "0", shares: "0", chat: ""
    } });
    setSelectedKey(key);
    setTimeout(() => { const el = document.querySelector(".qze-question-input"); if (el) el.focus(); }, 60);
  };
  const saveQuestion = () => {
    if (!draft) return;
    const next = PF_QZE.upsertQuestion(draft.data);
    /* keep a freshly saved question at the top of the list */
    setQuestionsState(draft.isNew ? next.filter((x) => x.key === draft.key).concat(next.filter((x) => x.key !== draft.key)) : next);
    setDraft(null);
    setToast(draft.data.active === false ? "Saved · hidden until you switch it on" : "Saved · live in the feed on next load");
  };
  const discardQuestion = () => {
    if (!draft) return;
    if (draft.isNew) { const first = questions[0]; setSelectedKey(first ? first.key : null); }
    setDraft(null);
  };
  const removeQuestion = () => {
    if (!q) return;
    if (draft && draft.isNew) { discardQuestion(); return; }
    if (!window.confirm("Delete this question?" + (q.question ? "\n\n“" + q.question + "”" : ""))) return;
    const idx = questions.findIndex((x) => x.key === q.key);
    const next = PF_QZE.deleteQuestion(q.key);
    setQuestionsState(next); setDraft(null);
    const fallback = next[Math.min(idx, next.length - 1)];
    setSelectedKey(fallback ? fallback.key : null);
    setToast("Question deleted");
  };
  const resetQuestions = () => {
    if (!window.confirm("Reset the quiz pool to the built-in questions? Your edits in this browser will be lost.")) return;
    const next = PF_QZE.resetQuestions();
    setQuestionsState(next); setDraft(null); setSelectedKey(next[0] ? next[0].key : null); setToast("Quiz pool reset to defaults");
  };

  /* ---- survey ---- */
  const [surveySel, setSurveySel] = useStateQZE("intro");
  const changeSurvey = (sv) => setSurveyDraft(sv);
  const addSurveyQuestion = () => {
    const qs = (survey.questions || []).concat([{ q: "", opts: ["", ""] }]);
    changeSurvey({ ...survey, questions: qs }); setSurveySel(qs.length - 1);
    setTimeout(() => { const el = document.querySelector(".qze-question-input"); if (el) el.focus(); }, 60);
  };
  const removeSurveyQuestion = (i) => {
    const sq = (survey.questions || [])[i];
    if (!window.confirm("Remove step " + (i + 1) + "?" + (sq && sq.q ? "\n\n“" + sq.q + "”" : "") + "\n\nThe change applies when you save the survey.")) return;
    const qs = survey.questions.filter((_, k) => k !== i);
    changeSurvey({ ...survey, questions: qs });
    setSurveySel(qs.length ? Math.min(i, qs.length - 1) : "intro");
  };
  const moveSurveyQuestion = (i, dir) => {
    const qs = survey.questions.slice(); const to = i + dir;
    if (to < 0 || to >= qs.length) return;
    const t = qs[i]; qs[i] = qs[to]; qs[to] = t;
    changeSurvey({ ...survey, questions: qs }); setSurveySel(to);
  };
  const saveSurvey = () => {
    if (!surveyDraft) return;
    const clean = { ...surveyDraft, questions: (surveyDraft.questions || []).map((x) => ({ q: x.q, opts: (x.opts || []).filter((o) => String(o || "").trim()) })) };
    setSavedSurvey(PF_QZE.setSurvey(clean)); setSurveyDraft(null); setToast("Survey saved · wizard updated");
  };
  const discardSurvey = () => {
    setSurveyDraft(null);
    if (surveySel !== "intro" && surveySel >= (savedSurvey.questions || []).length) setSurveySel("intro");
  };
  const resetSurvey = () => {
    if (!window.confirm("Reset the Business Survey to its built-in questions?")) return;
    setSavedSurvey(PF_QZE.resetSurvey()); setSurveyDraft(null); setSurveySel("intro"); setToast("Survey reset to defaults");
  };
  const switchTab = (key) => { if (key === tab) return; if (!confirmDiscard()) return; setDraft(null); setSurveyDraft(null); setTab(key); };

  return (
    <div className="adl-view qze-view">
      <div className="adl-page-head">
        <div><h1>Quizzes &amp; Surveys</h1><p>Manage the medical knowledge-check questions the feed drops in between posts, and the business survey new members complete.</p></div>
      </div>
      <div className="adl-tabs">
        {QZE_TABS.map((t) => (
          <button key={t.key} type="button" className={"adl-tab-btn" + (tab === t.key ? " is-active" : "")} onClick={() => switchTab(t.key)}>{t.label}</button>
        ))}
      </div>
      {tab === "quiz" && <QuizQuestionsTab questions={questions} selectedKey={selectedKey} onSelect={selectQuestion} q={q} draft={draft} onUpdate={updateQuestion} onAdd={addQuestion} onRemove={removeQuestion} onReset={resetQuestions} onSave={saveQuestion} onDiscard={discardQuestion} custom={PF_QZE.isCustomPool()} />}
      {tab === "survey" && <BusinessSurveyTab survey={survey} selected={surveySel} onSelect={setSurveySel} onChange={changeSurvey} onAdd={addSurveyQuestion} onRemove={removeSurveyQuestion} onMove={moveSurveyQuestion} onReset={resetSurvey} custom={PF_QZE.isCustomSurvey()} dirty={!!surveyDraft} onSave={saveSurvey} onDiscard={discardSurvey} />}
      {toast && <div className="qze-toast" role="status"><iconify-icon icon="lucide:check"></iconify-icon>{toast}</div>}
    </div>
  );
}

function QuizEditorApp() {
  return (
    <div className="adl-shell">
      <AdlSidebar activeLoyaltyKey={null} />
      <main className="adl-main">
        <AdlHeader title="Quizzes & Surveys" />
        <QuizEditorView />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<QuizEditorApp />);
