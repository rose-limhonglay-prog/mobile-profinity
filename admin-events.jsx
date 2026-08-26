/* ===========================================================================
   PROfinity — Admin · Events
   PRD: Admin Events Module Enhancement — unified Event model.
   List view (format-type filter, search, data table with computed
   Live/Active/Inactive status) + the full Create/Edit Event form (all
   fields from PRD §2) + a lightweight per-event Attendees drawer covering
   §3.2/§3.4's admin-side invite concerns. Classes prefixed evt-
   (list/table, unchanged from before) and evtf- (new form/drawer chrome)
   to avoid clashes with other pages.
   =========================================================================== */
const { useState: useStateEVT } = React;

function goEVT(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- nav data */
const EVT_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events", active: true },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:badge-check", label: "Badges" },
  { icon: "lucide:trophy", label: "Loyalty & Gamification", chevron: true },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

/* Single source of truth for "the admin user" — every event created here
   auto-assigns this person as Host (see EventFormModal's `host` field). */
const EVT_ADMIN_USER = { name: "Dr Tim Pearce", role: "Admin", email: "drtim@profinity.academy", avatar: "assets/avatar-drtim.png" };

const EVT_NAV_LINKS = {
  "Dashboard": "AdminDashboard.html",
  "Users": "AdminUsers.html",
  "Posts Management": "AdminPostsManagement.html",
  "Content Moderation": "AdminModeration.html",
  "Service Requests": "AdminServiceRequests.html",
  "Verification": "AdminVerification.html",
  "Agents": "AdminAgents.html",
  "Events": "AdminEvents.html",
  "Product Mapping": "AdminProductMapping.html",
  "Analytics": "AdminAnalytics.html",
  "App Versions": "AdminAppVersions.html",
  "Push Notification": "AdminPushNotifications.html",
  "Badges": "AdminBadges.html",
  "Loyalty & Gamification": "AdminActionsEditor.html",
  "Transactions": "AdminTransactions.html",
  "Courses": "AdminCourses.html",
  "Community": "AdminCommunity.html",
};

/* ------------------------------------------------------------- sidebar */
function EVTSidebar() {
  return (
    <aside className="evt-sidebar">
      <div className="evt-logo">
        <img src="assets/profinity-icon-purple-gold.png" alt="PROfinity Academy" />
      </div>
      {EVT_NAV.map((item) => {
        const href = EVT_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"evt-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goEVT(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="evt-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="evt-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function EVTHeader({ title }) {
  return (
    <header className="evt-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="evt-header-title">{title}</span>
      <div className="evt-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="evt-spacer" />
      <div className="evt-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="evt-bell-badge">4</span>
      </div>
      <div className="evt-user">
        <div className="evt-user-name">{EVT_ADMIN_USER.name}</div>
        <div className="evt-user-role">{EVT_ADMIN_USER.role}</div>
      </div>
      <img className="evt-user-avatar" src={EVT_ADMIN_USER.avatar} alt={EVT_ADMIN_USER.name} />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ===========================================================================
   PRD §2/§3 — unified event model helpers.
   Format Type: in_person | webinar.
   Audience Group: all | confidence | mastery | freedom.
   Invitation Mode: self_subscribe | admin_driven.
   Status is computed, not stored: Inactive (isActive=false) beats
   everything; otherwise Live while now is inside [startIso,endIso) per the
   §4.2 formula, else Active.
   =========================================================================== */
const EVT_AUDIENCE_GROUPS = [
  { key: "all", label: "All Users" },
  { key: "confidence", label: "Confidence Tier" },
  { key: "mastery", label: "Mastery Tier" },
  { key: "freedom", label: "Freedom Tier" },
];

/* Products available for live selling during an event — mirrors the
   catalogue on the Courses page (CRS_ROWS in admin-courses.jsx) so a host
   or speaker can sell any live course straight out of the session. */
const EVT_PRODUCTS = [
  { id: "p1", title: "Needle or Cannula Trade Off", cat: "Botox", price: "€ 57" },
  { id: "p2", title: "HTML Testing", cat: "Fillers", price: "€ 999" },
  { id: "p3", title: "The Dream Clinic Playbook", cat: "Business", price: "-" },
  { id: "p4", title: "Technique Tuesday Case Study", cat: "Consultation", price: "€ 0" },
  { id: "p5", title: "Dermal Filler Complications", cat: "Aesthetics", price: "€ 1000" },
  { id: "p6", title: "Botulinum Toxin Complications", cat: "Aesthetics", price: "€ 697" },
  { id: "p7", title: "Dermal Fillers Foundation Course", cat: "Aesthetics", price: "€ 249" },
];
const EVT_FORMAT_META = {
  in_person: { label: "In-Person", icon: "lucide:map-pin" },
  webinar: { label: "Webinar", icon: "lucide:video" },
  /* Super User Live streams (PRD §4.4 "Admin Event Sync") — read-only rows
     auto-logged from window.PFSuperUser, not created/edited from this form. */
  live: { label: "Live Stream", icon: "lucide:radio" },
};

/* PRD §4.4: "Launching a Live stream automatically creates a tracking
   record in the existing Admin Panel > Events Tab." These rows are derived
   live from window.PFSuperUser's session store (not persisted in EVT_SEED_ROWS)
   so every Super User Live stream — active or ended — shows up here without
   any admin action, and can't be edited/archived like a normal event (only
   an active one can be force-terminated, via evtTerminateLive below). */
function evtLiveRows() {
  if (typeof window === "undefined" || !window.PFSuperUser) return [];
  return window.PFSuperUser.getLiveEventRows().map((s) => ({
    id: s.id,
    sessionId: s.sessionId,
    title: s.title,
    formatType: "live",
    startIso: new Date(s.startedAt).toISOString(),
    endIso: s.endedAt ? new Date(s.endedAt).toISOString() : "",
    location: s.surfaceLabel,
    audienceGroup: "all",
    invitationMode: "self_subscribe",
    description: "",
    thumbnail: "",
    capacityEnabled: false,
    capacity: 0,
    booked: s.peakViewers,
    isActive: true,
    invited: 0,
    opened: s.comments,
    autoLogged: true,
    liveStatus: s.status, // "live" | "ended"
    terminatedByAdmin: s.terminatedByAdmin,
  }));
}
function evtFmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
function evtFmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }) + " GMT";
}
function evtComputeStatus(row) {
  if (row.autoLogged) {
    return row.liveStatus === "live" ?
    { key: "live", label: "Live", color: "var(--success)" } :
    { key: "inactive", label: row.terminatedByAdmin ? "Terminated" : "Ended", color: "#667085" };
  }
  if (!row.isActive) return { key: "inactive", label: "Inactive", color: "#667085" };
  const now = Date.now();
  const s = row.startIso ? new Date(row.startIso).getTime() : NaN;
  const e = row.endIso ? new Date(row.endIso).getTime() : NaN;
  if (!isNaN(s) && !isNaN(e) && now >= s && now < e) return { key: "live", label: "Live", color: "var(--success)" };
  return { key: "active", label: "Active", color: "var(--brand-navy)" };
}
function evtCapacityLabel(row) {
  if (row.autoLogged) return "Peak " + row.booked;
  if (!row.capacityEnabled) return "—";
  const sold = row.booked >= row.capacity;
  return (sold ? "Sold out · " : "") + row.booked + " / " + row.capacity;
}
function evtNewId() { return "evt" + Math.random().toString(36).slice(2, 9); }

/* --------------------------------------------------------------- seed data
   Five rows spanning every state a reviewer needs to see at a glance: an
   Open/Self-Subscribe in-person conference, a Specific-Tiers webinar, an
   Admin-Driven in-person workshop with capacity nearly full, a Webinar
   that is genuinely Live right now (real time, not a hand-set flag), and
   an Inactive/archived row. */
const EVT_SEED_ROWS = [
  {
    id: "evt-summit", title: "Profinity Clinic Growth Summit",
    formatType: "in_person", startIso: "2026-06-04T08:30:00Z", endIso: "2026-06-05T16:30:00Z",
    location: "Acquario Romano, Rome, Italy",
    audienceGroup: "all",
    invitationMode: "self_subscribe",
    description: "Two days of live clinic-growth strategy, hands-on technique labs and networking with the PROfinity community in Rome.",
    thumbnail: "clinic-growth-summit.jpg",
    capacityEnabled: true, capacity: 150, booked: 133,
    isActive: true,
    invited: 41, opened: 87,
    host: EVT_ADMIN_USER,
    speakers: [
      { id: "sp1", name: "Alicia", email: "alicia@profinity.academy" },
      { id: "sp2", name: "Ash", email: "ash@profinity.academy" },
    ],
    invitees: [],
  },
  {
    id: "evt-vip", title: "VIP Training: How To Build a THRIVING Clinic That Serves",
    formatType: "webinar", startIso: "2026-06-18T19:00:00Z", endIso: "2026-06-18T20:30:00Z",
    location: "",
    audienceGroup: "mastery",
    invitationMode: "self_subscribe",
    description: "A members-only masterclass on scaling a clinic without burning out the front desk.",
    thumbnail: "vip-training.jpg",
    capacityEnabled: false, capacity: 0, booked: 0,
    isActive: true,
    invited: 0, opened: 0,
  },
  {
    id: "evt-workshop", title: "High Ticket Workshop: Rome Intensive",
    formatType: "in_person", startIso: "2026-10-15T19:00:00Z", endIso: "2026-10-16T02:00:00Z",
    location: "Acquario Romano, Rome, Italy",
    audienceGroup: "freedom",
    invitationMode: "admin_driven",
    description: "Invitation-only intensive for top-tier practitioners — hands-on cadaver lab and 1:1 mentoring.",
    thumbnail: "rome-intensive.jpg",
    capacityEnabled: true, capacity: 40, booked: 33,
    isActive: true,
    invited: 40, opened: 36,
    host: EVT_ADMIN_USER,
    speakers: [{ id: "sp3", name: "Miranda Pearce", email: "miranda@profinity.academy" }],
    invitees: [],
  },
  {
    id: "evt-live", title: "PROfinity LIVE: Ask-Me-Anything",
    formatType: "webinar",
    startIso: new Date(new Date().setUTCHours(10, 0, 0, 0)).toISOString(),
    endIso: new Date(new Date().setUTCHours(23, 0, 0, 0)).toISOString(),
    location: "",
    audienceGroup: "all",
    invitationMode: "self_subscribe",
    description: "Open Q&A with Dr Tim Pearce — drop your questions in the chat.",
    thumbnail: "ama-live.jpg",
    capacityEnabled: false, capacity: 0, booked: 0,
    isActive: true,
    invited: 0, opened: 500,
  },
  {
    id: "evt-archived", title: "2025 Legacy Webinar: Year in Review",
    formatType: "webinar", startIso: "2025-12-10T18:00:00Z", endIso: "2025-12-10T19:00:00Z",
    location: "",
    audienceGroup: "all",
    invitationMode: "self_subscribe",
    description: "Archived — kept for reference only.",
    thumbnail: "",
    capacityEnabled: false, capacity: 0, booked: 0,
    isActive: false,
    invited: 0, opened: 0,
  },
];

/* ------------------------------------------------------- attendees (seed) */
const EVT_ATTENDEE_STATUSES = ["invited", "opened", "will_attend", "declined", "attended", "no_show"];
const EVT_ATTENDEE_LABELS = { invited: "Invited", opened: "Opened", will_attend: "Will Attend", declined: "Declined", attended: "Attended", no_show: "No-show" };
const EVT_ATTENDEES_SEED = {
  "evt-summit": [
    { id: "a1", name: "Priya Chandra", email: "priya@example.com", status: "attended" },
    { id: "a2", name: "Marcus Webb", email: "marcus@example.com", status: "will_attend" },
    { id: "a3", name: "Sarah Long", email: "sarah@example.com", status: "opened" },
  ],
  "evt-workshop": [
    { id: "a4", name: "Jordan Blake", email: "jordan@example.com", status: "will_attend" },
    { id: "a5", name: "Katy Wilson", email: "katy@example.com", status: "invited" },
  ],
};

/* ================================================================ form
   fields ================================================================ */
function EVTFormRow({ label, required, hint, children }) {
  return (
    <div className="evtf-row">
      <label className="evtf-label">{label}{required && <span className="req">*</span>}</label>
      {children}
      {hint && <span className="evtf-hint">{hint}</span>}
    </div>
  );
}

function EVTSwitch({ checked, onChange, label }) {
  return (
    <button type="button" className={"evtf-switch" + (checked ? " on" : "")} role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}>
      <span className="knob" />
      {label && <span className="lbl">{label}</span>}
    </button>
  );
}

/* Add-a-person mini-form + running list, shared by Speakers and Specific
   Invites below — mirrors AttendeesDrawer's inline invite pattern. */
function EVTPeopleManager({ people, onAdd, onRemove, addLabel, emptyLabel }) {
  const [name, setName] = useStateEVT("");
  const [email, setEmail] = useStateEVT("");
  const add = () => {
    if (!name.trim() || !email.trim()) return;
    onAdd({ id: evtNewId(), name: name.trim(), email: email.trim() });
    setName(""); setEmail("");
  };
  return (
    <div className="evtf-people">
      <div className="evtf-people-add">
        <input className="evtf-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        <input className="evtf-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button type="button" className="evtf-inline-btn" onClick={add}><iconify-icon icon="lucide:user-plus"></iconify-icon>{addLabel}</button>
      </div>
      {people.length > 0 ? (
        <div className="evtf-people-list">
          {people.map((p) => (
            <div className="evtf-att-row" key={p.id}>
              <span className="evtf-att-avatar">{p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}</span>
              <span className="evtf-att-tx">
                <span className="n">{p.name}</span>
                <span className="e">{p.email}</span>
              </span>
              <button type="button" className="evtf-att-remove" onClick={() => onRemove(p.id)}><iconify-icon icon="lucide:x"></iconify-icon></button>
            </div>
          ))}
        </div>
      ) : (
        <span className="evtf-hint">{emptyLabel}</span>
      )}
    </div>
  );
}

function EventFormModal({ initial, onClose, onSave }) {
  const blank = {
    id: null, title: "", formatType: "webinar", startIso: "", endIso: "",
    location: "", audienceGroup: "all",
    invitationMode: "self_subscribe", selectedAttendeesRaw: "", description: "",
    thumbnail: "", capacityEnabled: true, capacity: "", isActive: true,
    liveSellingEnabled: false, products: [],
    host: EVT_ADMIN_USER, speakers: [], invitees: [],
    booked: 0, invited: 0, opened: 0,
  };
  const [f, setF] = useStateEVT(() => Object.assign({}, blank, initial || {}, initial ? { selectedAttendeesRaw: "" } : {}));
  const [errors, setErrors] = useStateEVT({});
  const [productQuery, setProductQuery] = useStateEVT("");
  const set = (k, v) => setF((prev) => Object.assign({}, prev, { [k]: v }));
  const isEdit = !!(initial && initial.id);
  const showLocation = f.formatType === "in_person";
  const showCapacity = f.formatType === "in_person";
  const toggleProduct = (id) => set("products", f.products.includes(id) ? f.products.filter((x) => x !== id) : f.products.concat(id));
  const filteredProducts = EVT_PRODUCTS.filter((p) => p.title.toLowerCase().includes(productQuery.trim().toLowerCase()));

  const validate = () => {
    const e = {};
    if (!f.title.trim()) e.title = "Event title is required.";
    else if (f.title.length > 150) e.title = "Max 150 characters.";
    if (!f.startIso) e.startIso = "Start date & time is required.";
    if (!f.endIso) e.endIso = "End date & time is required.";
    if (f.startIso && f.endIso && new Date(f.endIso) <= new Date(f.startIso)) e.endIso = "End must be after start.";
    if (!f.description.trim()) e.description = "Description is required.";
    if (showLocation && !f.location.trim()) e.location = "Location is required for In-Person events.";
    if (showCapacity && f.capacityEnabled && !String(f.capacity).trim()) e.capacity = "Set the available capacity, or turn the switch off.";
    if (!isEdit && !f.thumbnail) e.thumbnail = "Upload a thumbnail image.";
    if (f.liveSellingEnabled && f.products.length === 0) e.products = "Select at least one product for the host to sell live.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const row = Object.assign({}, f, {
      id: f.id || evtNewId(),
      capacity: showCapacity && f.capacityEnabled ? Number(f.capacity) || 0 : 0,
      capacityEnabled: showCapacity ? f.capacityEnabled : false,
      location: showLocation ? f.location : "",
      products: f.liveSellingEnabled ? f.products : [],
    });
    onSave(row);
  };

  return (
    <div className="evtf-overlay" role="dialog" aria-modal="true" aria-label={isEdit ? "Edit event" : "Create event"}>
      <div className="evtf-scrim" onClick={onClose} />
      <div className="evtf-panel">
        <div className="evtf-head">
          <h2>{isEdit ? "Edit Event" : "Create Event"}</h2>
          <button className="evtf-x" type="button" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>

        <div className="evtf-body">
          <EVTFormRow label="Event Title" required hint="Max 150 characters.">
            <input className={"evtf-input" + (errors.title ? " err" : "")} maxLength={150} value={f.title}
              onChange={(e) => set("title", e.target.value)} placeholder="e.g. Profinity Clinic Growth Summit" />
            {errors.title && <span className="evtf-err">{errors.title}</span>}
          </EVTFormRow>

          <EVTFormRow label="Format Type" required>
            <div className="evtf-segmented" role="radiogroup">
              {["in_person", "webinar"].map((k) => (
                <button key={k} type="button" role="radio" aria-checked={f.formatType === k}
                  className={"evtf-seg-btn" + (f.formatType === k ? " on" : "")} onClick={() => set("formatType", k)}>
                  <iconify-icon icon={EVT_FORMAT_META[k].icon}></iconify-icon>{EVT_FORMAT_META[k].label}
                </button>
              ))}
            </div>
          </EVTFormRow>

          <div className="evtf-grid-2">
            <EVTFormRow label="Start Date & Time" required hint="Stored as GMT/UTC.">
              <input type="datetime-local" className={"evtf-input" + (errors.startIso ? " err" : "")}
                value={f.startIso ? f.startIso.slice(0, 16) : ""} onChange={(e) => set("startIso", e.target.value ? new Date(e.target.value).toISOString() : "")} />
              {errors.startIso && <span className="evtf-err">{errors.startIso}</span>}
            </EVTFormRow>
            <EVTFormRow label="End Date & Time" required hint="Must be after start.">
              <input type="datetime-local" className={"evtf-input" + (errors.endIso ? " err" : "")}
                value={f.endIso ? f.endIso.slice(0, 16) : ""} onChange={(e) => set("endIso", e.target.value ? new Date(e.target.value).toISOString() : "")} />
              {errors.endIso && <span className="evtf-err">{errors.endIso}</span>}
            </EVTFormRow>
          </div>

          <EVTFormRow label="Audience Group" required hint="Who this event is visible to.">
            <div className="evtf-chips" role="radiogroup">
              {EVT_AUDIENCE_GROUPS.map((g) => (
                <button key={g.key} type="button" role="radio" aria-checked={f.audienceGroup === g.key}
                  className={"evtf-chip" + (f.audienceGroup === g.key ? " on" : "")} onClick={() => set("audienceGroup", g.key)}>
                  {f.audienceGroup === g.key && <iconify-icon icon="lucide:check"></iconify-icon>}{g.label}
                </button>
              ))}
            </div>
          </EVTFormRow>

          <EVTFormRow label="Invitation Mode" required>
            <div className="evtf-radio-row" role="radiogroup">
              <label className="evtf-radio"><input type="radio" name="invite" checked={f.invitationMode === "self_subscribe"} onChange={() => set("invitationMode", "self_subscribe")} />Self-Subscribe — users register on the landing page</label>
              <label className="evtf-radio"><input type="radio" name="invite" checked={f.invitationMode === "admin_driven"} onChange={() => set("invitationMode", "admin_driven")} />Admin-Driven (Exclusive) — invite-only by admin</label>
            </div>
          </EVTFormRow>

          {f.invitationMode === "admin_driven" && (
            <EVTFormRow label="Selected Attendees" required hint="Paste emails (comma or newline separated) or import a CSV list.">
              <textarea className="evtf-textarea" rows={3} value={f.selectedAttendeesRaw}
                onChange={(e) => set("selectedAttendeesRaw", e.target.value)}
                placeholder="jane@clinic.com, mo@clinic.com&#10;or one email per line" />
              <button type="button" className="evtf-inline-btn"><iconify-icon icon="lucide:upload"></iconify-icon>Import CSV</button>
            </EVTFormRow>
          )}

          <EVTFormRow label="Event Host" hint="You're automatically assigned as the host of every event you create.">
            <div className="evtf-host-card">
              <img className="evtf-host-avatar" src={f.host.avatar} alt={f.host.name} />
              <span className="evtf-host-tx">
                <span className="n">{f.host.name}</span>
                <span className="e">{f.host.email}</span>
              </span>
              <span className="evtf-host-badge"><iconify-icon icon="lucide:crown"></iconify-icon>Host</span>
            </div>
          </EVTFormRow>

          <EVTFormRow label="Speakers" hint="Add anyone presenting or co-hosting this session alongside you.">
            <EVTPeopleManager people={f.speakers} addLabel="Add Speaker" emptyLabel="No speakers added yet."
              onAdd={(p) => set("speakers", f.speakers.concat(p))}
              onRemove={(id) => set("speakers", f.speakers.filter((p) => p.id !== id))} />
          </EVTFormRow>

          <EVTFormRow label="Specific Invites (optional)" hint="Hand-pick additional people to invite to this event, on top of anyone who registers.">
            <EVTPeopleManager people={f.invitees} addLabel="Add Invite" emptyLabel="No specific invites added yet."
              onAdd={(p) => set("invitees", f.invitees.concat(p))}
              onRemove={(id) => set("invitees", f.invitees.filter((p) => p.id !== id))} />
          </EVTFormRow>

          <EVTFormRow label="Live Selling" hint="Let the host or speaker sell products on-screen while this event is live.">
            <EVTSwitch checked={f.liveSellingEnabled} onChange={(v) => set("liveSellingEnabled", v)} label={f.liveSellingEnabled ? "On" : "Off"} />
          </EVTFormRow>

          {f.liveSellingEnabled && (
            <EVTFormRow label="Products" required hint="Courses from the Courses page the host/speaker can sell live.">
              {f.products.length > 0 && (
                <div className="evtf-chips evtf-selected-products">
                  {f.products.map((id) => {
                    const p = EVT_PRODUCTS.find((x) => x.id === id);
                    if (!p) return null;
                    return (
                      <span key={id} className="evtf-chip on evtf-product-chip">
                        {p.title}
                        <button type="button" className="evtf-chip-remove" onClick={() => toggleProduct(id)} aria-label={"Remove " + p.title}>
                          <iconify-icon icon="lucide:x"></iconify-icon>
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="evtf-product-search">
                <iconify-icon icon="lucide:search"></iconify-icon>
                <input placeholder="Search courses..." value={productQuery} onChange={(e) => setProductQuery(e.target.value)} />
              </div>
              <div className="evtf-product-list">
                {filteredProducts.map((p) => {
                  const on = f.products.includes(p.id);
                  return (
                    <button type="button" key={p.id} className={"evtf-product-row" + (on ? " is-on" : "")} onClick={() => toggleProduct(p.id)}>
                      <span className={"evtf-product-check" + (on ? " is-on" : "")}>{on && <iconify-icon icon="lucide:check"></iconify-icon>}</span>
                      <iconify-icon icon="lucide:graduation-cap"></iconify-icon>
                      <span className="evtf-product-name">{p.title}</span>
                      <span className="evtf-product-cat">{p.cat}</span>
                      <span className="evtf-product-price">{p.price}</span>
                    </button>
                  );
                })}
                {filteredProducts.length === 0 && <div className="evtf-product-empty">No courses match your search.</div>}
              </div>
              {f.products.length > 0 && <span className="evtf-hint">{f.products.length} product{f.products.length === 1 ? "" : "s"} selected.</span>}
              {errors.products && <span className="evtf-err">{errors.products}</span>}
            </EVTFormRow>
          )}

          <EVTFormRow label="Event Description" required>
            <div className="evtf-richtoolbar" aria-hidden="true">
              <button type="button"><iconify-icon icon="lucide:bold"></iconify-icon></button>
              <button type="button"><iconify-icon icon="lucide:italic"></iconify-icon></button>
              <button type="button"><iconify-icon icon="lucide:list"></iconify-icon></button>
              <button type="button"><iconify-icon icon="lucide:link"></iconify-icon></button>
              <button type="button"><iconify-icon icon="lucide:image"></iconify-icon></button>
            </div>
            <textarea className={"evtf-textarea" + (errors.description ? " err" : "")} rows={4} value={f.description}
              onChange={(e) => set("description", e.target.value)} placeholder="What is this event about?" />
            {errors.description && <span className="evtf-err">{errors.description}</span>}
          </EVTFormRow>

          {showLocation && (
            <EVTFormRow label="Event Location" required hint="Venue, address and any location instructions.">
              <input className={"evtf-input" + (errors.location ? " err" : "")} value={f.location}
                onChange={(e) => set("location", e.target.value)} placeholder="e.g. Acquario Romano, Rome, Italy" />
              {errors.location && <span className="evtf-err">{errors.location}</span>}
            </EVTFormRow>
          )}

          {showCapacity && (
            <>
              <EVTFormRow label="Capacity Limit">
                <EVTSwitch checked={f.capacityEnabled} onChange={(v) => set("capacityEnabled", v)} label={f.capacityEnabled ? "On" : "Off"} />
              </EVTFormRow>
              {f.capacityEnabled && (
                <EVTFormRow label="Available Invites / Capacity" required>
                  <input type="number" min="1" className={"evtf-input evtf-input-sm" + (errors.capacity ? " err" : "")} value={f.capacity}
                    onChange={(e) => set("capacity", e.target.value)} placeholder="e.g. 150" />
                  {errors.capacity && <span className="evtf-err">{errors.capacity}</span>}
                </EVTFormRow>
              )}
            </>
          )}

          <EVTFormRow label="Event Thumbnail" required={!isEdit} hint="PNG, JPG or WEBP. Max 5MB. Recommended 16:9.">
            <label className={"evtf-upload" + (errors.thumbnail ? " err" : "")}>
              <input type="file" accept="image/png,image/jpeg,image/webp" style={{ display: "none" }}
                onChange={(e) => set("thumbnail", e.target.files && e.target.files[0] ? e.target.files[0].name : f.thumbnail)} />
              <iconify-icon icon="lucide:image-plus"></iconify-icon>
              <span>{f.thumbnail || "Click to upload, or drag a file here"}</span>
            </label>
            {errors.thumbnail && <span className="evtf-err">{errors.thumbnail}</span>}
          </EVTFormRow>

          <EVTFormRow label="Status">
            <EVTSwitch checked={f.isActive} onChange={(v) => set("isActive", v)} label={f.isActive ? "Active" : "Inactive"} />
          </EVTFormRow>
        </div>

        <div className="evtf-foot">
          <button className="evt-btn evt-btn-ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="evt-btn evt-btn-navy" type="button" onClick={save}>
            <iconify-icon icon="lucide:check"></iconify-icon>{isEdit ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- attendees drawer */
function AttendeesDrawer({ row, attendees, onClose, onInvite }) {
  const [filter, setFilter] = useStateEVT("all");
  const [showInvite, setShowInvite] = useStateEVT(false);
  const [name, setName] = useStateEVT("");
  const [email, setEmail] = useStateEVT("");
  const list = attendees.filter((a) => filter === "all" || a.status === filter);
  return (
    <div className="evtf-overlay" role="dialog" aria-modal="true" aria-label={"Attendees — " + row.title}>
      <div className="evtf-scrim" onClick={onClose} />
      <div className="evtf-drawer">
        <div className="evtf-head">
          <div>
            <h2>Attendees</h2>
            <p className="evtf-sub">{row.title}</p>
          </div>
          <button className="evtf-x" type="button" onClick={onClose}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </div>
        <div className="evtf-drawer-filters">
          <button className={"evtf-chip" + (filter === "all" ? " on" : "")} onClick={() => setFilter("all")}>All ({attendees.length})</button>
          {EVT_ATTENDEE_STATUSES.map((s) => (
            <button key={s} className={"evtf-chip" + (filter === s ? " on" : "")} onClick={() => setFilter(s)}>{EVT_ATTENDEE_LABELS[s]}</button>
          ))}
        </div>
        <div className="evtf-drawer-list">
          {list.length === 0 && <div className="evtf-drawer-empty">No attendees in this status yet.</div>}
          {list.map((a) => (
            <div className="evtf-att-row" key={a.id}>
              <span className="evtf-att-avatar">{a.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>
              <span className="evtf-att-tx">
                <span className="n">{a.name}</span>
                <span className="e">{a.email}</span>
              </span>
              <span className={"evtf-att-status " + a.status}>{EVT_ATTENDEE_LABELS[a.status]}</span>
            </div>
          ))}
        </div>
        <div className="evtf-drawer-foot">
          {showInvite ? (
            <div className="evtf-invite-inline">
              <input className="evtf-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="evtf-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="evt-btn evt-btn-navy" type="button" onClick={() => { if (name.trim() && email.trim()) { onInvite(row.id, { id: evtNewId(), name, email, status: "invited" }); setName(""); setEmail(""); setShowInvite(false); } }}>Send Invite</button>
              <button className="evt-btn evt-btn-ghost" type="button" onClick={() => setShowInvite(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <button className="evt-btn evt-btn-navy" type="button" onClick={() => setShowInvite(true)}><iconify-icon icon="lucide:user-plus"></iconify-icon>Invite Attendee</button>
              <button className="evt-btn evt-btn-ghost" type="button"><iconify-icon icon="lucide:upload"></iconify-icon>Import CSV</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- row action menu */
function EVTRowMenu({ row, onEdit, onAttendees, onArchive, onClose }) {
  return (
    <div className="evt-row-menu" role="menu" onMouseLeave={onClose}>
      <button role="menuitem" onClick={() => onEdit(row)}><iconify-icon icon="lucide:pencil"></iconify-icon>Edit</button>
      <button role="menuitem" onClick={() => onAttendees(row)}><iconify-icon icon="lucide:users"></iconify-icon>View Attendees</button>
      <button role="menuitem" className="danger" onClick={() => onArchive(row)}>
        <iconify-icon icon={row.isActive ? "lucide:archive" : "lucide:archive-restore"}></iconify-icon>{row.isActive ? "Archive" : "Restore"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- view */
function EVTListView() {
  const [rows, setRows] = useStateEVT(EVT_SEED_ROWS);
  const [attendeesByEvent, setAttendeesByEvent] = useStateEVT(EVT_ATTENDEES_SEED);
  const [formatFilter, setFormatFilter] = useStateEVT("all");
  const [query, setQuery] = useStateEVT("");
  const [openMenuId, setOpenMenuId] = useStateEVT(null);
  const [formState, setFormState] = useStateEVT(null); // { mode: "create"|"edit", row }
  const [attendeesFor, setAttendeesFor] = useStateEVT(null); // row

  /* Re-render whenever a Super User Live stream starts/ends/updates
     elsewhere (PRD §4.4 Admin Event Sync) — window.PFSuperUser is plain
     localStorage, not React state. */
  const [, forceTick] = useStateEVT(0);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.PFSuperUser) return undefined;
    return window.PFSuperUser.subscribe(() => forceTick((v) => v + 1));
  }, []);

  const allRows = rows.concat(evtLiveRows());
  const visibleRows = allRows.filter((r) => {
    if (formatFilter !== "all" && r.formatType !== formatFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return r.title.toLowerCase().includes(q) || (r.location || "").toLowerCase().includes(q);
  }).sort((a, b) => new Date(b.startIso || 0) - new Date(a.startIso || 0));

  const saveRow = (row) => {
    setRows((prev) => {
      const exists = prev.some((r) => r.id === row.id);
      return exists ? prev.map((r) => (r.id === row.id ? Object.assign({}, r, row) : r)) : prev.concat(row);
    });
    setFormState(null);
  };
  const archiveRow = (row) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? Object.assign({}, r, { isActive: !r.isActive }) : r)));
    setOpenMenuId(null);
  };
  const inviteAttendee = (eventId, attendee) => {
    setAttendeesByEvent((prev) => Object.assign({}, prev, { [eventId]: (prev[eventId] || []).concat(attendee) }));
    setRows((prev) => prev.map((r) => (r.id === eventId ? Object.assign({}, r, { invited: (r.invited || 0) + 1 }) : r)));
  };
  /* Admin Termination Authority (PRD §4.3): forcefully end any ongoing
     Super User Live stream from here. */
  const terminateLive = (row) => {
    if (!window.PFSuperUser) return;
    window.PFSuperUser.endLive(row.sessionId, { terminatedByAdmin: true });
    forceTick((v) => v + 1);
  };

  const FORMAT_TABS = [
    { key: "all", label: "All", icon: "lucide:layout-grid" },
    { key: "in_person", label: "In-Person", icon: "lucide:map-pin" },
    { key: "webinar", label: "Webinar", icon: "lucide:video" },
    { key: "live", label: "Live Streams", icon: "lucide:radio" },
  ];

  return (
    <>
      <div className="evt-page-head">
        <div>
          <h1>Events</h1>
          <p>Manage conferences, in-person events, and webinars from one place.</p>
        </div>
      </div>

      <div className="evt-subnav">
        {FORMAT_TABS.map((t) => (
          <button key={t.key} type="button" className={"evt-subnav-btn" + (formatFilter === t.key ? " is-active" : "")} onClick={() => setFormatFilter(t.key)}>
            <iconify-icon icon={t.icon}></iconify-icon>{t.label}
          </button>
        ))}
      </div>

      <div className="evt-controls">
        <div className="evt-search-input-wrap">
          <iconify-icon icon="lucide:search"></iconify-icon>
          <input placeholder="Search title, location..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="evt-btn evt-btn-navy" type="button" onClick={() => setFormState({ mode: "create", row: null })}>
          <iconify-icon icon="lucide:plus"></iconify-icon>Create Event
        </button>
      </div>

      <div className="evt-table">
        <div className="evt-row-grid evt-thead">
          <span className="evt-th">EVENT</span>
          <span className="evt-th">TYPE</span>
          <span className="evt-th">DATE</span>
          <span className="evt-th">TIME</span>
          <span className="evt-th">LOCATION</span>
          <span className="evt-th">USERS</span>
          <span className="evt-th">INVITED</span>
          <span className="evt-th">OPENED</span>
          <span className="evt-th">STATUS</span>
          <span />
        </div>

        {visibleRows.map((r) => {
          const status = evtComputeStatus(r);
          const meta = EVT_FORMAT_META[r.formatType] || EVT_FORMAT_META.webinar;
          return (
            <div key={r.id} className="evt-row-grid evt-trow">
              <div className="evt-trow-title">
                <div className="evt-trow-title-main">{r.title}</div>
                {!r.autoLogged && (
                  <span className="evt-invite-tag evt-host-tag"><iconify-icon icon="lucide:user-check"></iconify-icon>Hosted by {(r.host && r.host.name) || EVT_ADMIN_USER.name}</span>
                )}
                {r.speakers && r.speakers.length > 0 && (
                  <span className="evt-invite-tag evt-speaker-tag"><iconify-icon icon="lucide:mic"></iconify-icon>{r.speakers.length} speaker{r.speakers.length === 1 ? "" : "s"}</span>
                )}
                {r.liveSellingEnabled && r.products && r.products.length > 0 && (
                  <span className="evt-invite-tag evt-products-tag" title={r.products.map((id) => { const p = EVT_PRODUCTS.find((x) => x.id === id); return p ? p.title : null; }).filter(Boolean).join(", ")}>
                    <iconify-icon icon="lucide:shopping-cart"></iconify-icon>{r.products.length} product{r.products.length === 1 ? "" : "s"} live
                  </span>
                )}
                {r.invitationMode === "admin_driven" && <span className="evt-invite-tag"><iconify-icon icon="lucide:mail-check"></iconify-icon>Invite only</span>}
                {r.autoLogged && <span className="evt-invite-tag evt-autolog-tag"><iconify-icon icon="lucide:zap"></iconify-icon>Auto-logged · Super User</span>}
              </div>
              <span className="evt-cell"><span className="evt-type-badge"><iconify-icon icon={meta.icon}></iconify-icon>{meta.label}</span></span>
              <span className="evt-cell">{evtFmtDate(r.startIso)}</span>
              <span className="evt-cell">{evtFmtTime(r.startIso)}</span>
              <span className="evt-cell evt-cell-location">{r.location || "—"}</span>
              <span className="evt-metric">{evtCapacityLabel(r)}</span>
              <span className="evt-metric">{r.invited}</span>
              <span className="evt-metric">{r.opened}</span>
              <div className="evt-status-pill">
                <span className="evt-status-dot" style={{ background: status.color }} />
                <span className="evt-status-label" style={{ color: status.color }}>{status.label}</span>
              </div>
              <span style={{ position: "relative" }}>
                {r.autoLogged ?
                (r.liveStatus === "live" &&
                <button type="button" className="evt-btn evt-btn-ghost evt-terminate-btn" onClick={() => terminateLive(r)}>
                  <iconify-icon icon="lucide:octagon-x"></iconify-icon>Terminate
                </button>
                ) :
                <>
                <iconify-icon icon="lucide:more-vertical" class="evt-row-more" onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}></iconify-icon>
                {openMenuId === r.id && (
                  <EVTRowMenu row={r}
                    onEdit={(row) => { setOpenMenuId(null); setFormState({ mode: "edit", row }); }}
                    onAttendees={(row) => { setOpenMenuId(null); setAttendeesFor(row); }}
                    onArchive={archiveRow}
                    onClose={() => setOpenMenuId(null)} />
                )}
                </>
                }
              </span>
            </div>
          );
        })}

        {visibleRows.length === 0 && (
          <div className="evt-empty">
            <iconify-icon icon="lucide:calendar-x"></iconify-icon>
            <span>No events match your search.</span>
          </div>
        )}
      </div>

      {formState && (
        <EventFormModal
          initial={formState.mode === "edit" ? formState.row : null}
          onClose={() => setFormState(null)}
          onSave={saveRow}
        />
      )}
      {attendeesFor && (
        <AttendeesDrawer
          row={attendeesFor}
          attendees={attendeesByEvent[attendeesFor.id] || []}
          onClose={() => setAttendeesFor(null)}
          onInvite={inviteAttendee}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------- root */
function EVTRoot() {
  return (
    <div className="evt-shell">
      <EVTSidebar />
      <main className="evt-main">
        <EVTHeader title="Events" />
        <div className="evt-content">
          <EVTListView />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<EVTRoot />);
