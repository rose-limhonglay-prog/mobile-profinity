/* ===========================================================================
   PROfinity — Admin · Agents
   Hub for the AI agents members see in the Agents catalogue (agents-data.js).
   Overview table at AdminAgents.html; one sub page per agent at
   AdminAgents.html?agent=<id> (also listed in the sidebar under Agents).
   Edits are saved to PFAgents.admin (localStorage "pf-admin-agents") and the
   member Agents page reflects them immediately. Suffixed -AGT.
   =========================================================================== */
const { useState: useStateAGT, useEffect: useEffectAGT, useMemo: useMemoAGT } = React;
const PFA_A = window.PFAgents;

function goAGT(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function paramAGT(name) { try { return new URLSearchParams(window.location.search).get(name) || ""; } catch (e) { return ""; } }

/* ------------------------------------------------------------- sidebar */
const AGT_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard", href: "AdminDashboard.html" },
  { icon: "lucide:user", label: "Users", href: "AdminUsers.html" },
  { icon: "lucide:file-text", label: "Posts Management", href: "AdminPostsManagement.html" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation", href: "AdminModeration.html" },
  { icon: "lucide:life-buoy", label: "Service Requests", href: "AdminServiceRequests.html" },
  { icon: "lucide:shield-check", label: "Verification", href: "AdminVerification.html" },
  { icon: "lucide:users-round", label: "Agents", href: "AdminAgents.html", group: true },
  { icon: "lucide:calendar", label: "Events", href: "AdminEvents.html" },
  { icon: "lucide:map", label: "Product Mapping", href: "AdminProductMapping.html" },
  { icon: "lucide:bar-chart-3", label: "Analytics", href: "AdminAnalytics.html" },
  { icon: "lucide:smartphone", label: "App Versions", href: "AdminAppVersions.html" },
  { icon: "lucide:bell", label: "Push Notification", href: "AdminPushNotifications.html" },
  { icon: "lucide:badge-check", label: "Badges", href: "AdminBadges.html" },
  { icon: "lucide:clipboard-list", label: "Quizzes & Surveys", href: "AdminQuizEditor.html" },
  { icon: "lucide:trophy", label: "Loyalty & Gamification", href: "AdminActionsEditor.html", chevron: true },
  { icon: "lucide:scroll-text", label: "Points Ledger", href: "AdminAuditLedger.html" },
  { icon: "lucide:receipt-text", label: "Transactions", href: "AdminTransactions.html", chevron: true },
  { icon: "lucide:table-2", label: "Courses", href: "AdminCourses.html", chevron: true },
  { icon: "lucide:users", label: "Community", href: "AdminCommunity.html", chevron: true },
];

function agtShort(a) { return a.shortName || a.name; }

function AGTSidebar({ activeId }) {
  return (
    <aside className="agt-sidebar">
      <div className="agt-logo"><img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" /></div>
      {AGT_NAV.map((item) => {
        if (item.group) {
          return (
            <React.Fragment key={item.label}>
              <button className={"agt-navitem" + (!activeId ? " is-active" : " is-parent")} type="button" onClick={activeId ? () => goAGT(item.href) : undefined}>
                <iconify-icon icon={item.icon}></iconify-icon>
                <span>{item.label}</span>
                <span className="agt-spacer" />
                <iconify-icon icon="lucide:chevron-up" class="agt-chev"></iconify-icon>
              </button>
              <div className="agt-subnav">
                {PFA_A.ALL.map((a) => (
                  <button key={a.id} className={"agt-subnav-item" + (a.id === activeId ? " is-active" : "")} type="button" onClick={() => goAGT("AdminAgents.html?agent=" + a.id)}>
                    <span className={"agt-subdot is-" + (a.hidden ? "hidden" : a.status)} aria-hidden="true" />
                    <span className="agt-subnav-text">{agtShort(a)}</span>
                  </button>
                ))}
              </div>
            </React.Fragment>
          );
        }
        return (
          <button key={item.label} className="agt-navitem" type="button" onClick={() => goAGT(item.href)}>
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (<><span className="agt-spacer" /><iconify-icon icon="lucide:chevron-down" class="agt-chev"></iconify-icon></>)}
          </button>
        );
      })}
    </aside>
  );
}

function AGTHeader({ title }) {
  return (
    <header className="agt-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="agt-header-title">{title}</span>
      <div className="agt-header-search"><iconify-icon icon="lucide:search"></iconify-icon><input placeholder="Type to search..." /></div>
      <div className="agt-spacer" />
      <div className="agt-bell"><iconify-icon icon="lucide:bell"></iconify-icon><span className="agt-bell-badge">4</span></div>
      <div className="agt-user"><div className="agt-user-name">Dr Tim Pearce</div><div className="agt-user-role">Admin</div></div>
      <img className="agt-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ------------------------------------------------------------- helpers */
const AGT_BADGES = ["Included in Premium", "Included with Artcodes", "Included with membership", "Add-on"];
const AGT_TIERS = ["Confidence", "Mastery", "Freedom", "Sovereign"];
/* per-agent consoles that already exist elsewhere in the admin */
const AGT_CONSOLES = {
  minutes: [
    { label: "Minute Taker admin", sub: "Clinician accounts, consent and EMR connections", href: "MinuteTakerAdmin.html", icon: "lucide:settings-2" },
    { label: "Usage & billing", sub: "Sessions, minutes transcribed and plan usage", href: "MinuteTakerUsage.html", icon: "lucide:gauge" },
  ],
  coach: [
    { label: "Quizzes & Surveys", sub: "Questions Ava pulls into the feed and Get to know you", href: "AdminQuizEditor.html", icon: "lucide:clipboard-list" },
    { label: "Success Paths", sub: "Skills and nudges Ava coaches towards", href: "AdminSuccessPaths.html", icon: "lucide:route" },
  ],
};

/* deterministic mock numbers so each agent's page is stable between loads */
function seedAGT(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
function statsAGT(a) {
  const h = seedAGT(a.id);
  const local = PFA_A.isWaiting(a.id) ? 1 : 0;
  if (a.status === "available") {
    const members = 180 + (h % 420);
    return { members, sessions: members * (3 + (h % 5)), rating: (4.5 + ((h % 5) / 10)).toFixed(1), waitlist: 0, trend: 4 + (h % 19) };
  }
  return { members: 0, sessions: 0, rating: null, waitlist: (a.waiting || 0) + local, trend: 2 + (h % 14) };
}
const AGT_NAMES = ["Dr Sarah Mitchell", "Dr Amira Hassan", "Nurse Jo Carter", "Dr Priya Shah", "Dr Ben Okafor", "Laura Kent RN", "Dr Hannah Lowe", "Dr Marcus Reid", "Dr Chloe Barnes", "Dr Omar Farouk"];
function recentWaitAGT(a) {
  const h = seedAGT(a.id + "w");
  return Array.from({ length: 5 }).map((_, i) => ({ name: AGT_NAMES[(h + i * 3) % AGT_NAMES.length], when: ["2 min ago", "1 h ago", "Yesterday", "2 days ago", "4 days ago"][i], tier: AGT_TIERS[(h + i) % 2 + 1] }));
}

function AGTIcon({ agent, size = 44 }) {
  const t = PFA_A.TONES[agent.tone] || PFA_A.TONES.purple;
  return <span className="agt-aicon" style={{ width: size, height: size, background: t.bg, color: t.fg }} aria-hidden="true"><iconify-icon icon={agent.icon}></iconify-icon></span>;
}
function AGTStatusPill({ agent }) {
  if (agent.hidden) return <span className="agt-pill is-hidden"><iconify-icon icon="lucide:eye-off"></iconify-icon>Hidden</span>;
  if (agent.status === "available") return <span className="agt-pill is-live"><span className="agt-pill-dot" />Live</span>;
  return <span className="agt-pill is-soon"><iconify-icon icon="lucide:clock"></iconify-icon>Coming {agent.eta || "soon"}</span>;
}

function useToastAGT() {
  const [msg, setMsg] = useStateAGT(null);
  const show = (m) => { setMsg(m); window.clearTimeout(show.t); show.t = window.setTimeout(() => setMsg(null), 2400); };
  const node = <div className={"agt-toast" + (msg ? " is-on" : "")} role="status" aria-live="polite">{msg && <><iconify-icon icon="lucide:check-circle-2"></iconify-icon>{msg}</>}</div>;
  return { show, node };
}

/* ------------------------------------------------------------- overview */
function AGTOverview({ agents, onOpen }) {
  const live = agents.filter((a) => a.status === "available" && !a.hidden).length;
  const soon = agents.filter((a) => a.status !== "available" && !a.hidden).length;
  const hidden = agents.filter((a) => a.hidden).length;
  const waitlist = agents.reduce((n, a) => n + statsAGT(a).waitlist, 0);
  const [q, setQ] = useStateAGT("");
  const rows = agents.filter((a) => !q.trim() || (a.name + " " + a.category).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="agt-view">
      <div className="agt-page-head">
        <div>
          <h1>Agents</h1>
          <p>Everything members see in the Agents catalogue. Open an agent to edit its listing, availability, pricing and waitlist.</p>
        </div>
        <div className="agt-page-head-actions">
          <button className="agt-btn agt-btn-outline-navy" type="button" onClick={() => goAGT("Agent.html")}><iconify-icon icon="lucide:external-link"></iconify-icon>View member catalogue</button>
        </div>
      </div>

      <div className="agt-tiles">
        <div className="agt-tile"><span className="agt-tile-ic is-live"><iconify-icon icon="lucide:zap"></iconify-icon></span><div><strong>{live}</strong><span>Live agents</span></div></div>
        <div className="agt-tile"><span className="agt-tile-ic is-soon"><iconify-icon icon="lucide:clock"></iconify-icon></span><div><strong>{soon}</strong><span>Coming soon</span></div></div>
        <div className="agt-tile"><span className="agt-tile-ic is-wait"><iconify-icon icon="lucide:bell-ring"></iconify-icon></span><div><strong>{waitlist.toLocaleString()}</strong><span>Notify-me votes</span></div></div>
        <div className="agt-tile"><span className="agt-tile-ic is-hidden"><iconify-icon icon="lucide:eye-off"></iconify-icon></span><div><strong>{hidden}</strong><span>Hidden from catalogue</span></div></div>
      </div>

      <div className="agt-table">
        <div className="agt-table-bar">
          <div className="agt-search"><iconify-icon icon="lucide:search"></iconify-icon><input placeholder="Filter agents…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <span className="agt-table-count">{rows.length} of {agents.length}</span>
        </div>
        <div className="agt-row-grid agt-thead">
          <span className="agt-th">AGENT</span><span className="agt-th">CATEGORY</span><span className="agt-th">STATUS</span><span className="agt-th">ACCESS</span><span className="agt-th">USAGE</span><span className="agt-th"></span>
        </div>
        {rows.map((a) => {
          const st = statsAGT(a);
          return (
            <button key={a.id} type="button" className={"agt-row-grid agt-trow" + (a.hidden ? " is-hidden" : "")} onClick={() => onOpen(a.id)}>
              <span className="agt-cell-agent"><AGTIcon agent={a} size={40} /><span><strong>{a.name}</strong><small>{a.tagline}</small></span></span>
              <span className="agt-cell-muted">{a.category}</span>
              <span><AGTStatusPill agent={a} /></span>
              <span className="agt-cell-access"><strong>{a.badge}</strong><small>{a.price}</small></span>
              <span className="agt-cell-usage">{a.status === "available" ? <><strong>{st.members}</strong><small>members · {st.sessions.toLocaleString()} sessions</small></> : <><strong>{st.waitlist}</strong><small>waiting · +{st.trend}% this week</small></>}</span>
              <span className="agt-cell-go">{PFA_A.admin.isEdited(a.id) && <span className="agt-edited">Edited</span>}<iconify-icon icon="lucide:chevron-right"></iconify-icon></span>
            </button>
          );
        })}
        {rows.length === 0 && <div className="agt-empty"><span className="agt-empty-icon"><iconify-icon icon="lucide:search-x"></iconify-icon></span><p className="agt-empty-text">No agents match that filter.</p></div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- agent page */
function pickAGT(a) {
  const d = {};
  PFA_A.admin.EDITABLE.forEach((k) => { d[k] = a[k] === undefined ? (k === "hidden" || k === "featured" ? false : k === "bullets" ? [] : "") : a[k]; });
  d.bullets = (d.bullets || []).slice(); while (d.bullets.length < 3) d.bullets.push("");
  return d;
}

function AGTAgentPage({ agent, toast, onSaved }) {
  const [draft, setDraft] = useStateAGT(() => pickAGT(agent));
  const [savedAt, setSavedAt] = useStateAGT(null);
  useEffectAGT(() => { setDraft(pickAGT(agent)); }, [agent.id]);
  const clean = useMemoAGT(() => pickAGT(agent), [agent]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(clean);
  const edited = PFA_A.admin.isEdited(agent.id);
  const st = statsAGT(agent);
  const consoles = AGT_CONSOLES[agent.id] || [];
  const set = (k) => (e) => setDraft({ ...draft, [k]: e && e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e });
  const setBullet = (i) => (e) => { const b = draft.bullets.slice(); b[i] = e.target.value; setDraft({ ...draft, bullets: b }); };

  function save() {
    const patch = { ...draft, bullets: draft.bullets.filter((x) => x.trim()) };
    PFA_A.admin.save(agent.id, patch);
    setSavedAt(new Date());
    toast.show("Saved · members see this immediately");
    onSaved();
  }
  function reset() { PFA_A.admin.reset(agent.id); toast.show("Reset to the default listing"); onSaved(); }

  const memberHref = agent.href ? agent.href.web : "Agent.html";
  return (
    <div className="agt-view">
      <div className="agt-crumbs"><button type="button" onClick={() => goAGT("AdminAgents.html")}>Agents</button><iconify-icon icon="lucide:chevron-right"></iconify-icon><span>{agtShort(agent)}</span></div>
      <div className="agt-page-head agt-agent-head">
        <div className="agt-agent-id">
          <AGTIcon agent={agent} size={56} />
          <div>
            <h1>{draft.name || agent.name}</h1>
            <p>{agent.category} · <AGTStatusPill agent={{ ...agent, status: draft.status, eta: draft.eta, hidden: draft.hidden }} />{edited && <span className="agt-edited">Edited</span>}</p>
          </div>
        </div>
        <div className="agt-page-head-actions">
          <button className="agt-btn agt-btn-outline-navy" type="button" onClick={() => goAGT(memberHref)}><iconify-icon icon="lucide:external-link"></iconify-icon>Open member view</button>
          {edited && <button className="agt-btn agt-btn-ghost" type="button" onClick={reset}><iconify-icon icon="lucide:rotate-ccw"></iconify-icon>Reset</button>}
          <button className="agt-btn agt-btn-primary" type="button" onClick={save} disabled={!dirty}><iconify-icon icon="lucide:check"></iconify-icon>{dirty ? "Save changes" : savedAt ? "Saved" : "No changes"}</button>
        </div>
      </div>

      <div className="agt-grid">
        <div className="agt-col-main">
          <section className="agt-card">
            <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:text"></iconify-icon>Listing</span><span className="agt-card-sub">What members read on the catalogue card and detail sheet</span></div>
            <div className="agt-form-grid">
              <label className="agt-field"><span>Name</span><input value={draft.name} onChange={set("name")} /></label>
              <label className="agt-field"><span>Short name <small>shown on compact cards</small></span><input value={draft.shortName} placeholder={agent.name} onChange={set("shortName")} /></label>
              <label className="agt-field agt-span-2"><span>Tagline</span><input value={draft.tagline} onChange={set("tagline")} /></label>
              <label className="agt-field agt-span-2"><span>Description</span><textarea rows={3} value={draft.description} onChange={set("description")} /></label>
              {draft.bullets.slice(0, 3).map((b, i) => (
                <label key={i} className={"agt-field" + (i === 2 ? " agt-span-2" : "")}><span>Highlight {i + 1}</span><input value={b} onChange={setBullet(i)} /></label>
              ))}
              <label className="agt-field"><span>Best for</span><input value={draft.bestFor} onChange={set("bestFor")} /></label>
              <label className="agt-field"><span>Button label <small>live agents only</small></span><input value={draft.cta} placeholder={"Open " + agent.name} onChange={set("cta")} /></label>
            </div>
          </section>

          <section className="agt-card">
            <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:toggle-right"></iconify-icon>Availability</span><span className="agt-card-sub">Controls which card members get and whether the agent can be opened</span></div>
            <div className="agt-radios">
              {[
                { v: "available", t: "Live", s: "Members can open the agent now. Shown with the dark spotlight card." },
                { v: "soon", t: "Coming soon", s: "Shown with a Notify me button and the release window below." },
              ].map((o) => (
                <label key={o.v} className={"agt-radio" + (draft.status === o.v ? " is-on" : "")}>
                  <input type="radio" name="status" value={o.v} checked={draft.status === o.v} onChange={() => setDraft({ ...draft, status: o.v })} />
                  <span className="agt-radio-mark" /><span><strong>{o.t}</strong><small>{o.s}</small></span>
                </label>
              ))}
            </div>
            <div className="agt-form-grid">
              <label className="agt-field"><span>Release window <small>coming soon only</small></span><input value={draft.eta} placeholder="e.g. Spring 2026" disabled={draft.status === "available"} onChange={set("eta")} /></label>
              <div className="agt-switches">
                <label className="agt-switch"><span><strong>Featured</strong><small>Pinned to the top row of the catalogue</small></span><input type="checkbox" checked={!!draft.featured} onChange={set("featured")} /><i /></label>
                <label className="agt-switch"><span><strong>Hidden from catalogue</strong><small>Members cannot see or open it</small></span><input type="checkbox" checked={!!draft.hidden} onChange={set("hidden")} /><i /></label>
              </div>
            </div>
          </section>

          <section className="agt-card">
            <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:badge-pound-sterling"></iconify-icon>Pricing &amp; access</span><span className="agt-card-sub">The badge on the card and the price line under it</span></div>
            <div className="agt-form-grid">
              <label className="agt-field"><span>Access badge</span>
                <select value={draft.badge} onChange={set("badge")}>{AGT_BADGES.map((b) => <option key={b} value={b}>{b}</option>)}</select>
              </label>
              <label className="agt-field"><span>Price line</span><input value={draft.price} placeholder="e.g. Starts at £57/mo" onChange={set("price")} /></label>
              <div className="agt-field agt-span-2"><span>Included for tiers</span>
                <div className="agt-chips">{AGT_TIERS.map((t, i) => <span key={t} className={"agt-chip" + (i >= 1 ? " is-on" : "")}>{i >= 1 && <iconify-icon icon="lucide:check"></iconify-icon>}{t}</span>)}</div>
                <small className="agt-help">Tier inclusion follows the membership ladder in Loyalty &amp; Gamification. Change it there.</small>
              </div>
            </div>
          </section>
        </div>

        <div className="agt-col-side">
          <section className="agt-card">
            <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:activity"></iconify-icon>{agent.status === "available" ? "Usage · 30 days" : "Waitlist"}</span></div>
            {agent.status === "available" ? (
              <div className="agt-stats">
                <div><strong>{st.members}</strong><span>Active members</span></div>
                <div><strong>{st.sessions.toLocaleString()}</strong><span>Sessions</span></div>
                <div><strong>{st.rating}<em>/5</em></strong><span>Avg. rating</span></div>
                <div><strong className="is-up">+{st.trend}%</strong><span>vs last month</span></div>
              </div>
            ) : (
              <>
                <div className="agt-stats agt-stats-2">
                  <div><strong>{st.waitlist}</strong><span>Notify-me votes</span></div>
                  <div><strong className="is-up">+{st.trend}%</strong><span>this week</span></div>
                </div>
                <ul className="agt-waitlist">
                  {recentWaitAGT(agent).map((w) => <li key={w.name}><span className="agt-wava">{w.name.replace(/^(Dr|Nurse)\s+/, "").split(" ").map((p) => p[0]).join("").slice(0, 2)}</span><span className="agt-wname">{w.name}<small>{w.tier} · {w.when}</small></span></li>)}
                </ul>
                <button className="agt-btn agt-btn-outline-navy agt-btn-block" type="button" onClick={() => goAGT("AdminPushNotifications.html")}><iconify-icon icon="lucide:send"></iconify-icon>Notify the waitlist</button>
              </>
            )}
          </section>

          {consoles.length > 0 && (
            <section className="agt-card">
              <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:layout-panel-left"></iconify-icon>Agent console</span></div>
              <div className="agt-links">
                {consoles.map((c) => (
                  <button key={c.href} type="button" className="agt-link" onClick={() => goAGT(c.href)}>
                    <span className="agt-link-ic"><iconify-icon icon={c.icon}></iconify-icon></span>
                    <span className="agt-link-text"><strong>{c.label}</strong><small>{c.sub}</small></span>
                    <iconify-icon icon="lucide:arrow-up-right"></iconify-icon>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="agt-card">
            <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:link"></iconify-icon>Member links</span></div>
            <div className="agt-links">
              <button type="button" className="agt-link" onClick={() => goAGT("Agent.html")}><span className="agt-link-ic"><iconify-icon icon="lucide:monitor"></iconify-icon></span><span className="agt-link-text"><strong>Web catalogue</strong><small>Agent.html</small></span><iconify-icon icon="lucide:arrow-up-right"></iconify-icon></button>
              <button type="button" className="agt-link" onClick={() => goAGT("AgentMobile.html")}><span className="agt-link-ic"><iconify-icon icon="lucide:smartphone"></iconify-icon></span><span className="agt-link-text"><strong>Mobile catalogue</strong><small>AgentMobile.html</small></span><iconify-icon icon="lucide:arrow-up-right"></iconify-icon></button>
              {agent.href && <button type="button" className="agt-link" onClick={() => goAGT(agent.href.web)}><span className="agt-link-ic"><iconify-icon icon={agent.icon}></iconify-icon></span><span className="agt-link-text"><strong>Open {agtShort(agent)}</strong><small>{agent.href.web}</small></span><iconify-icon icon="lucide:arrow-up-right"></iconify-icon></button>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- data-only agent pages (user: Minute Taker shows data, not listing forms) */
const AGT_DATA_ONLY = ["minutes"];
const AGT_PERIODS = [{ key: "7", label: "7 days", days: 7 }, { key: "30", label: "30 days", days: 30 }, { key: "90", label: "90 days", days: 90 }];
function rngAGT(seed) { let x = seed || 1; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }
function fmtDayAGT(daysAgo) { const d = new Date(); d.setDate(d.getDate() - daysAgo); return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }
function seriesAGT(id, days) {
  const r = rngAGT(seedAGT(id + ":" + days));
  return Array.from({ length: days }).map((_, i) => {
    const daysAgo = days - 1 - i; const d = new Date(); d.setDate(d.getDate() - daysAgo);
    const wk = d.getDay() === 0 || d.getDay() === 6;
    const base = wk ? 14 : 44; return { daysAgo, label: fmtDayAGT(daysAgo), value: Math.round(base + r() * (wk ? 10 : 26)) };
  });
}
const AGT_CLINICIANS = ["Dr Katie Smith", "Dr Sarah Mitchell", "Nurse Jo Carter", "Dr Amira Hassan", "Dr Ben Okafor", "Laura Kent RN"];
const AGT_SESSION_TYPES = ["Injectables follow-up", "New patient consult", "Post-op review", "Skin consult", "Acne protocol", "Rosacea review", "Team meeting"];

function AGTBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const ticks = [0, Math.round(max / 2), max];
  const every = data.length > 31 ? 15 : data.length > 7 ? 7 : 1;
  return (
    <div className="agt-chart" role="img" aria-label={"Sessions per day for the last " + data.length + " days"}>
      <div className="agt-chart-y">{ticks.slice().reverse().map((t) => <span key={t}>{t}</span>)}</div>
      <div className="agt-chart-plot">
        <div className="agt-chart-grid"><i /><i /><i /></div>
        <div className="agt-chart-bars">
          {data.map((d) => (
            <div key={d.daysAgo} className="agt-bar-slot" tabIndex={0}>
              <i className="agt-bar" style={{ height: Math.max(2, Math.round(100 * d.value / max)) + "%" }} />
              <span className="agt-bar-tip"><strong>{d.value} sessions</strong>{d.label}</span>
            </div>
          ))}
        </div>
        <div className="agt-chart-x">{data.map((d, i) => <span key={d.daysAgo}>{(i % every === 0 || (i === data.length - 1 && i % every >= 3)) ? d.label : ""}</span>)}</div>
      </div>
    </div>
  );
}

function AGTAgentData({ agent }) {
  const [period, setPeriod] = useStateAGT("30");
  const days = AGT_PERIODS.find((p) => p.key === period).days;
  const data = useMemoAGT(() => seriesAGT(agent.id, days), [agent.id, days]);
  const sessions = data.reduce((n, d) => n + d.value, 0);
  const h = seedAGT(agent.id);
  const clinicians = 24 + (h % 30);
  const minutes = sessions * 31;
  const saved = Math.round(sessions * 0.82), ready = Math.round(sessions * 0.09), processing = Math.round(sessions * 0.03), archived = Math.round(sessions * 0.41);
  const avgWrite = "1m 54s", voice = "98%";
  const formats = [{ k: "Assessment", v: 58 }, { k: "Data", v: 27 }, { k: "Summary", v: 15 }];
  const r = rngAGT(h + days);
  const top = AGT_CLINICIANS.map((c, i) => ({ name: c, sessions: Math.round(sessions * (0.3 - i * 0.045) * (0.9 + r() * 0.2)), write: (() => { const sec = Math.round(60 + r() * 100); return Math.floor(sec / 60) + "m " + String(sec % 60).padStart(2, "0") + "s"; })(), saved: 78 + Math.round(r() * 18) })).sort((a, b) => b.sessions - a.sessions);
  const recent = Array.from({ length: 8 }).map((_, i) => ({ when: ["Just now", "12 min ago", "48 min ago", "2 h ago", "3 h ago", "Yesterday 16:15", "Yesterday 14:00", "Yesterday 09:30"][i], clinician: AGT_CLINICIANS[(h + i) % AGT_CLINICIANS.length], patient: "MT-" + (77000 + ((h * (i + 3)) % 900)), type: AGT_SESSION_TYPES[(h + i * 2) % AGT_SESSION_TYPES.length], dur: (18 + ((h * (i + 1)) % 40)) + " min", status: i === 0 ? "Processing" : i < 3 ? "Note ready" : "Saved to EMR" }));
  const consoles = AGT_CONSOLES[agent.id] || [];
  const memberHref = agent.href ? agent.href.web : "Agent.html";
  const funnel = [{ k: "Recorded", v: sessions }, { k: "Note written", v: saved + ready }, { k: "Saved to EMR", v: saved }, { k: "Archived", v: archived }];
  return (
    <div className="agt-view">
      <div className="agt-crumbs"><button type="button" onClick={() => goAGT("AdminAgents.html")}>Agents</button><iconify-icon icon="lucide:chevron-right"></iconify-icon><span>{agtShort(agent)}</span></div>
      <div className="agt-page-head agt-agent-head">
        <div className="agt-agent-id">
          <AGTIcon agent={agent} size={56} />
          <div><h1>{agent.name}</h1><p>{agent.category} · <AGTStatusPill agent={agent} /><span className="agt-cell-muted">Usage data · updates every few minutes</span></p></div>
        </div>
        <div className="agt-page-head-actions">
          <div className="agt-seg" role="tablist" aria-label="Period">
            {AGT_PERIODS.map((p) => <button key={p.key} type="button" role="tab" aria-selected={period === p.key} className={"agt-seg-btn" + (period === p.key ? " is-on" : "")} onClick={() => setPeriod(p.key)}>{p.label}</button>)}
          </div>
          <button className="agt-btn agt-btn-outline-navy" type="button" onClick={() => goAGT(memberHref)}><iconify-icon icon="lucide:external-link"></iconify-icon>Open member view</button>
        </div>
      </div>

      <div className="agt-tiles agt-tiles-6">
        <div className="agt-tile"><span className="agt-tile-ic is-live"><iconify-icon icon="lucide:users"></iconify-icon></span><div><strong>{clinicians}</strong><span>Active clinicians</span></div></div>
        <div className="agt-tile"><span className="agt-tile-ic is-wait"><iconify-icon icon="lucide:mic"></iconify-icon></span><div><strong>{sessions.toLocaleString()}</strong><span>Sessions</span></div></div>
        <div className="agt-tile"><span className="agt-tile-ic is-wait"><iconify-icon icon="lucide:audio-lines"></iconify-icon></span><div><strong>{(minutes / 60).toFixed(0)}<em> h</em></strong><span>Audio transcribed</span></div></div>
        <div className="agt-tile"><span className="agt-tile-ic is-live"><iconify-icon icon="lucide:file-check-2"></iconify-icon></span><div><strong>{saved.toLocaleString()}</strong><span>Notes saved to EMR</span></div></div>
        <div className="agt-tile"><span className="agt-tile-ic is-soon"><iconify-icon icon="lucide:timer"></iconify-icon></span><div><strong>{avgWrite}</strong><span>Avg. write-up</span></div></div>
        <div className="agt-tile"><span className="agt-tile-ic is-live"><iconify-icon icon="lucide:shield-check"></iconify-icon></span><div><strong>{voice}</strong><span>Voice match</span></div></div>
      </div>

      <section className="agt-card">
        <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:bar-chart-3"></iconify-icon>Sessions per day</span><span className="agt-card-sub">{sessions.toLocaleString()} in the last {days} days · weekends run lighter</span></div>
        <AGTBarChart data={data} />
      </section>

      <div className="agt-grid agt-grid-even">
        <section className="agt-card">
          <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:filter"></iconify-icon>Note pipeline</span><span className="agt-card-sub">{processing} still being written</span></div>
          <div className="agt-funnel">
            {funnel.map((f) => (
              <div key={f.k} className="agt-funnel-row"><span className="agt-funnel-label">{f.k}</span><span className="agt-funnel-track"><i style={{ width: Math.round(100 * f.v / (sessions || 1)) + "%" }} /></span><strong>{f.v.toLocaleString()}</strong><small>{Math.round(100 * f.v / (sessions || 1))}%</small></div>
            ))}
          </div>
        </section>
        <section className="agt-card">
          <div className="agt-card-head"><span className="agt-card-title"><iconify-icon icon="lucide:layout-list"></iconify-icon>Note formats</span><span className="agt-card-sub">Format chosen when the note was saved</span></div>
          <div className="agt-funnel">
            {formats.map((f) => (
              <div key={f.k} className="agt-funnel-row"><span className="agt-funnel-label">{f.k}</span><span className="agt-funnel-track"><i style={{ width: f.v + "%" }} /></span><strong>{Math.round(saved * f.v / 100).toLocaleString()}</strong><small>{f.v}%</small></div>
            ))}
          </div>
          {consoles.length > 0 && (
            <div className="agt-links agt-links-inline">
              {consoles.map((c) => <button key={c.href} type="button" className="agt-link" onClick={() => goAGT(c.href)}><span className="agt-link-ic"><iconify-icon icon={c.icon}></iconify-icon></span><span className="agt-link-text"><strong>{c.label}</strong><small>{c.sub}</small></span><iconify-icon icon="lucide:arrow-up-right"></iconify-icon></button>)}
            </div>
          )}
        </section>
      </div>

      <div className="agt-grid agt-grid-even">
        <section className="agt-card agt-card-flush">
          <div className="agt-card-head agt-card-head-pad"><span className="agt-card-title"><iconify-icon icon="lucide:trophy"></iconify-icon>Top clinicians</span></div>
          <div className="agt-row-grid agt-thead agt-grid-clin"><span className="agt-th">CLINICIAN</span><span className="agt-th">SESSIONS</span><span className="agt-th">AVG. WRITE-UP</span><span className="agt-th">SAVED</span></div>
          {top.map((c) => <div key={c.name} className="agt-row-grid agt-grid-clin agt-drow"><span className="agt-cell-agent"><span className="agt-wava">{c.name.replace(/^(Dr|Nurse)\s+/, "").split(" ").map((p) => p[0]).join("").slice(0, 2)}</span><strong>{c.name}</strong></span><span className="agt-cell-muted">{c.sessions}</span><span className="agt-cell-muted">{c.write}</span><span className="agt-cell-muted">{c.saved}%</span></div>)}
        </section>
        <section className="agt-card agt-card-flush">
          <div className="agt-card-head agt-card-head-pad"><span className="agt-card-title"><iconify-icon icon="lucide:history"></iconify-icon>Recent sessions</span><span className="agt-card-sub">Patient IDs only · no clinical content</span></div>
          <div className="agt-row-grid agt-thead agt-grid-recent"><span className="agt-th">WHEN</span><span className="agt-th">CLINICIAN</span><span className="agt-th">SESSION</span><span className="agt-th">STATUS</span></div>
          {recent.map((x, i) => <div key={i} className="agt-row-grid agt-grid-recent agt-drow"><span className="agt-cell-muted">{x.when}</span><span className="agt-cell-access"><strong>{x.clinician}</strong><small>{x.patient} · {x.dur}</small></span><span className="agt-cell-muted">{x.type}</span><span><span className={"agt-pill " + (x.status === "Saved to EMR" ? "is-live" : x.status === "Note ready" ? "is-soon" : "is-hidden")}>{x.status}</span></span></div>)}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- root */
function AGTRoot() {
  const toast = useToastAGT();
  const [tick, setTick] = useStateAGT(0);
  const activeId = paramAGT("agent");
  const agent = activeId ? PFA_A.byId(activeId) : null;
  const agents = PFA_A.ALL.slice();
  return (
    <div className="agt-shell">
      <AGTSidebar activeId={agent ? agent.id : ""} />
      <main className="agt-main">
        <AGTHeader title={agent ? "Agents · " + agtShort(agent) : "Agents"} />
        <div className="agt-content">
          {agent
            ? (AGT_DATA_ONLY.includes(agent.id)
              ? <AGTAgentData key={agent.id} agent={agent} />
              : <AGTAgentPage key={agent.id + ":" + tick} agent={agent} toast={toast} onSaved={() => setTick((t) => t + 1)} />)
            : activeId
              ? <div className="agt-view"><div className="agt-empty"><span className="agt-empty-icon"><iconify-icon icon="lucide:bot-off"></iconify-icon></span><p className="agt-empty-text">No agent called "{activeId}".</p><button className="agt-btn agt-btn-outline-navy" type="button" onClick={() => goAGT("AdminAgents.html")}>Back to Agents</button></div></div>
              : <AGTOverview agents={agents} onOpen={(id) => goAGT("AdminAgents.html?agent=" + id)} />}
        </div>
      </main>
      {toast.node}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AGTRoot />);
