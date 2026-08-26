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
const {
  useState: useStateEVT
} = React;
function goEVT(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- nav data */
const EVT_NAV = [{
  icon: "lucide:layout-grid",
  label: "Dashboard"
}, {
  icon: "lucide:user",
  label: "Users"
}, {
  icon: "lucide:file-text",
  label: "Posts Management"
}, {
  icon: "lucide:layout-dashboard",
  label: "Content Moderation"
}, {
  icon: "lucide:life-buoy",
  label: "Service Requests"
}, {
  icon: "lucide:shield-check",
  label: "Verification"
}, {
  icon: "lucide:users-round",
  label: "Agents"
}, {
  icon: "lucide:calendar",
  label: "Events",
  active: true
}, {
  icon: "lucide:map",
  label: "Product Mapping"
}, {
  icon: "lucide:bar-chart-3",
  label: "Analytics"
}, {
  icon: "lucide:smartphone",
  label: "App Versions"
}, {
  icon: "lucide:bell",
  label: "Push Notification"
}, {
  icon: "lucide:badge-check",
  label: "Badges"
}, {
  icon: "lucide:trophy",
  label: "Loyalty & Gamification",
  chevron: true
}, {
  icon: "lucide:receipt-text",
  label: "Transactions",
  chevron: true
}, {
  icon: "lucide:table-2",
  label: "Courses",
  chevron: true
}, {
  icon: "lucide:users",
  label: "Community",
  chevron: true
}];

/* Single source of truth for "the admin user" — every event created here
   auto-assigns this person as Host (see EventFormModal's `host` field). */
const EVT_ADMIN_USER = {
  name: "Dr Tim Pearce",
  role: "Admin",
  email: "drtim@profinity.academy",
  avatar: "assets/avatar-drtim.png"
};
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
  "Community": "AdminCommunity.html"
};

/* ------------------------------------------------------------- sidebar */
function EVTSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "evt-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  })), EVT_NAV.map(item => {
    const href = EVT_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "evt-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => goEVT(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "evt-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "evt-chev"
    })));
  }));
}
function EVTHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "evt-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "evt-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "evt-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "evt-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "evt-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "evt-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "evt-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-user-name"
  }, EVT_ADMIN_USER.name), /*#__PURE__*/React.createElement("div", {
    className: "evt-user-role"
  }, EVT_ADMIN_USER.role)), /*#__PURE__*/React.createElement("img", {
    className: "evt-user-avatar",
    src: EVT_ADMIN_USER.avatar,
    alt: EVT_ADMIN_USER.name
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
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
const EVT_AUDIENCE_GROUPS = [{
  key: "all",
  label: "All Users"
}, {
  key: "confidence",
  label: "Confidence Tier"
}, {
  key: "mastery",
  label: "Mastery Tier"
}, {
  key: "freedom",
  label: "Freedom Tier"
}];

/* Products available for live selling during an event — mirrors the
   catalogue on the Courses page (CRS_ROWS in admin-courses.jsx) so a host
   or speaker can sell any live course straight out of the session. */
const EVT_PRODUCTS = [{
  id: "p1",
  title: "Needle or Cannula Trade Off",
  cat: "Botox",
  price: "€ 57"
}, {
  id: "p2",
  title: "HTML Testing",
  cat: "Fillers",
  price: "€ 999"
}, {
  id: "p3",
  title: "The Dream Clinic Playbook",
  cat: "Business",
  price: "-"
}, {
  id: "p4",
  title: "Technique Tuesday Case Study",
  cat: "Consultation",
  price: "€ 0"
}, {
  id: "p5",
  title: "Dermal Filler Complications",
  cat: "Aesthetics",
  price: "€ 1000"
}, {
  id: "p6",
  title: "Botulinum Toxin Complications",
  cat: "Aesthetics",
  price: "€ 697"
}, {
  id: "p7",
  title: "Dermal Fillers Foundation Course",
  cat: "Aesthetics",
  price: "€ 249"
}];
const EVT_FORMAT_META = {
  in_person: {
    label: "In-Person",
    icon: "lucide:map-pin"
  },
  webinar: {
    label: "Webinar",
    icon: "lucide:video"
  },
  /* Super User Live streams (PRD §4.4 "Admin Event Sync") — read-only rows
     auto-logged from window.PFSuperUser, not created/edited from this form. */
  live: {
    label: "Live Stream",
    icon: "lucide:radio"
  }
};

/* PRD §4.4: "Launching a Live stream automatically creates a tracking
   record in the existing Admin Panel > Events Tab." These rows are derived
   live from window.PFSuperUser's session store (not persisted in EVT_SEED_ROWS)
   so every Super User Live stream — active or ended — shows up here without
   any admin action, and can't be edited/archived like a normal event (only
   an active one can be force-terminated, via evtTerminateLive below). */
function evtLiveRows() {
  if (typeof window === "undefined" || !window.PFSuperUser) return [];
  return window.PFSuperUser.getLiveEventRows().map(s => ({
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
    liveStatus: s.status,
    // "live" | "ended"
    terminatedByAdmin: s.terminatedByAdmin
  }));
}
function evtFmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}
function evtFmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC"
  }) + " GMT";
}
function evtComputeStatus(row) {
  if (row.autoLogged) {
    return row.liveStatus === "live" ? {
      key: "live",
      label: "Live",
      color: "var(--success)"
    } : {
      key: "inactive",
      label: row.terminatedByAdmin ? "Terminated" : "Ended",
      color: "#667085"
    };
  }
  if (!row.isActive) return {
    key: "inactive",
    label: "Inactive",
    color: "#667085"
  };
  const now = Date.now();
  const s = row.startIso ? new Date(row.startIso).getTime() : NaN;
  const e = row.endIso ? new Date(row.endIso).getTime() : NaN;
  if (!isNaN(s) && !isNaN(e) && now >= s && now < e) return {
    key: "live",
    label: "Live",
    color: "var(--success)"
  };
  return {
    key: "active",
    label: "Active",
    color: "var(--brand-navy)"
  };
}
function evtCapacityLabel(row) {
  if (row.autoLogged) return "Peak " + row.booked;
  if (!row.capacityEnabled) return "—";
  const sold = row.booked >= row.capacity;
  return (sold ? "Sold out · " : "") + row.booked + " / " + row.capacity;
}
function evtNewId() {
  return "evt" + Math.random().toString(36).slice(2, 9);
}

/* --------------------------------------------------------------- seed data
   Five rows spanning every state a reviewer needs to see at a glance: an
   Open/Self-Subscribe in-person conference, a Specific-Tiers webinar, an
   Admin-Driven in-person workshop with capacity nearly full, a Webinar
   that is genuinely Live right now (real time, not a hand-set flag), and
   an Inactive/archived row. */
const EVT_SEED_ROWS = [{
  id: "evt-summit",
  title: "Profinity Clinic Growth Summit",
  formatType: "in_person",
  startIso: "2026-06-04T08:30:00Z",
  endIso: "2026-06-05T16:30:00Z",
  location: "Acquario Romano, Rome, Italy",
  audienceGroup: "all",
  invitationMode: "self_subscribe",
  description: "Two days of live clinic-growth strategy, hands-on technique labs and networking with the PROfinity community in Rome.",
  thumbnail: "clinic-growth-summit.jpg",
  capacityEnabled: true,
  capacity: 150,
  booked: 133,
  isActive: true,
  invited: 41,
  opened: 87,
  host: EVT_ADMIN_USER,
  speakers: [{
    id: "sp1",
    name: "Alicia",
    email: "alicia@profinity.academy"
  }, {
    id: "sp2",
    name: "Ash",
    email: "ash@profinity.academy"
  }],
  invitees: []
}, {
  id: "evt-vip",
  title: "VIP Training: How To Build a THRIVING Clinic That Serves",
  formatType: "webinar",
  startIso: "2026-06-18T19:00:00Z",
  endIso: "2026-06-18T20:30:00Z",
  location: "",
  audienceGroup: "mastery",
  invitationMode: "self_subscribe",
  description: "A members-only masterclass on scaling a clinic without burning out the front desk.",
  thumbnail: "vip-training.jpg",
  capacityEnabled: false,
  capacity: 0,
  booked: 0,
  isActive: true,
  invited: 0,
  opened: 0
}, {
  id: "evt-workshop",
  title: "High Ticket Workshop: Rome Intensive",
  formatType: "in_person",
  startIso: "2026-10-15T19:00:00Z",
  endIso: "2026-10-16T02:00:00Z",
  location: "Acquario Romano, Rome, Italy",
  audienceGroup: "freedom",
  invitationMode: "admin_driven",
  description: "Invitation-only intensive for top-tier practitioners — hands-on cadaver lab and 1:1 mentoring.",
  thumbnail: "rome-intensive.jpg",
  capacityEnabled: true,
  capacity: 40,
  booked: 33,
  isActive: true,
  invited: 40,
  opened: 36,
  host: EVT_ADMIN_USER,
  speakers: [{
    id: "sp3",
    name: "Miranda Pearce",
    email: "miranda@profinity.academy"
  }],
  invitees: []
}, {
  id: "evt-live",
  title: "PROfinity LIVE: Ask-Me-Anything",
  formatType: "webinar",
  startIso: new Date(new Date().setUTCHours(10, 0, 0, 0)).toISOString(),
  endIso: new Date(new Date().setUTCHours(23, 0, 0, 0)).toISOString(),
  location: "",
  audienceGroup: "all",
  invitationMode: "self_subscribe",
  description: "Open Q&A with Dr Tim Pearce — drop your questions in the chat.",
  thumbnail: "ama-live.jpg",
  capacityEnabled: false,
  capacity: 0,
  booked: 0,
  isActive: true,
  invited: 0,
  opened: 500
}, {
  id: "evt-archived",
  title: "2025 Legacy Webinar: Year in Review",
  formatType: "webinar",
  startIso: "2025-12-10T18:00:00Z",
  endIso: "2025-12-10T19:00:00Z",
  location: "",
  audienceGroup: "all",
  invitationMode: "self_subscribe",
  description: "Archived — kept for reference only.",
  thumbnail: "",
  capacityEnabled: false,
  capacity: 0,
  booked: 0,
  isActive: false,
  invited: 0,
  opened: 0
}];

/* ------------------------------------------------------- attendees (seed) */
const EVT_ATTENDEE_STATUSES = ["invited", "opened", "will_attend", "declined", "attended", "no_show"];
const EVT_ATTENDEE_LABELS = {
  invited: "Invited",
  opened: "Opened",
  will_attend: "Will Attend",
  declined: "Declined",
  attended: "Attended",
  no_show: "No-show"
};
const EVT_ATTENDEES_SEED = {
  "evt-summit": [{
    id: "a1",
    name: "Priya Chandra",
    email: "priya@example.com",
    status: "attended"
  }, {
    id: "a2",
    name: "Marcus Webb",
    email: "marcus@example.com",
    status: "will_attend"
  }, {
    id: "a3",
    name: "Sarah Long",
    email: "sarah@example.com",
    status: "opened"
  }],
  "evt-workshop": [{
    id: "a4",
    name: "Jordan Blake",
    email: "jordan@example.com",
    status: "will_attend"
  }, {
    id: "a5",
    name: "Katy Wilson",
    email: "katy@example.com",
    status: "invited"
  }]
};

/* ================================================================ form
   fields ================================================================ */
function EVTFormRow({
  label,
  required,
  hint,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "evtf-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "evtf-label"
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), children, hint && /*#__PURE__*/React.createElement("span", {
    className: "evtf-hint"
  }, hint));
}
function EVTSwitch({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "evtf-switch" + (checked ? " on" : ""),
    role: "switch",
    "aria-checked": checked,
    onClick: () => onChange(!checked)
  }, /*#__PURE__*/React.createElement("span", {
    className: "knob"
  }), label && /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, label));
}

/* Add-a-person mini-form + running list, shared by Speakers and Specific
   Invites below — mirrors AttendeesDrawer's inline invite pattern. */
function EVTPeopleManager({
  people,
  onAdd,
  onRemove,
  addLabel,
  emptyLabel
}) {
  const [name, setName] = useStateEVT("");
  const [email, setEmail] = useStateEVT("");
  const add = () => {
    if (!name.trim() || !email.trim()) return;
    onAdd({
      id: evtNewId(),
      name: name.trim(),
      email: email.trim()
    });
    setName("");
    setEmail("");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "evtf-people"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-people-add"
  }, /*#__PURE__*/React.createElement("input", {
    className: "evtf-input",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Full name"
  }), /*#__PURE__*/React.createElement("input", {
    className: "evtf-input",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "Email"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "evtf-inline-btn",
    onClick: add
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:user-plus"
  }), addLabel)), people.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "evtf-people-list"
  }, people.map(p => /*#__PURE__*/React.createElement("div", {
    className: "evtf-att-row",
    key: p.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "evtf-att-avatar"
  }, p.name.split(" ").map(s => s[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("span", {
    className: "evtf-att-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, p.name), /*#__PURE__*/React.createElement("span", {
    className: "e"
  }, p.email)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "evtf-att-remove",
    onClick: () => onRemove(p.id)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))))) : /*#__PURE__*/React.createElement("span", {
    className: "evtf-hint"
  }, emptyLabel));
}
function EventFormModal({
  initial,
  onClose,
  onSave
}) {
  const blank = {
    id: null,
    title: "",
    formatType: "webinar",
    startIso: "",
    endIso: "",
    location: "",
    audienceGroup: "all",
    invitationMode: "self_subscribe",
    selectedAttendeesRaw: "",
    description: "",
    thumbnail: "",
    capacityEnabled: true,
    capacity: "",
    isActive: true,
    liveSellingEnabled: false,
    products: [],
    host: EVT_ADMIN_USER,
    speakers: [],
    invitees: [],
    booked: 0,
    invited: 0,
    opened: 0
  };
  const [f, setF] = useStateEVT(() => Object.assign({}, blank, initial || {}, initial ? {
    selectedAttendeesRaw: ""
  } : {}));
  const [errors, setErrors] = useStateEVT({});
  const [productQuery, setProductQuery] = useStateEVT("");
  const set = (k, v) => setF(prev => Object.assign({}, prev, {
    [k]: v
  }));
  const isEdit = !!(initial && initial.id);
  const showLocation = f.formatType === "in_person";
  const showCapacity = f.formatType === "in_person";
  const toggleProduct = id => set("products", f.products.includes(id) ? f.products.filter(x => x !== id) : f.products.concat(id));
  const filteredProducts = EVT_PRODUCTS.filter(p => p.title.toLowerCase().includes(productQuery.trim().toLowerCase()));
  const validate = () => {
    const e = {};
    if (!f.title.trim()) e.title = "Event title is required.";else if (f.title.length > 150) e.title = "Max 150 characters.";
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
      products: f.liveSellingEnabled ? f.products : []
    });
    onSave(row);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "evtf-overlay",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": isEdit ? "Edit event" : "Create event"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "evtf-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-head"
  }, /*#__PURE__*/React.createElement("h2", null, isEdit ? "Edit Event" : "Create Event"), /*#__PURE__*/React.createElement("button", {
    className: "evtf-x",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "evtf-body"
  }, /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Event Title",
    required: true,
    hint: "Max 150 characters."
  }, /*#__PURE__*/React.createElement("input", {
    className: "evtf-input" + (errors.title ? " err" : ""),
    maxLength: 150,
    value: f.title,
    onChange: e => set("title", e.target.value),
    placeholder: "e.g. Profinity Clinic Growth Summit"
  }), errors.title && /*#__PURE__*/React.createElement("span", {
    className: "evtf-err"
  }, errors.title)), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Format Type",
    required: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-segmented",
    role: "radiogroup"
  }, ["in_person", "webinar"].map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    role: "radio",
    "aria-checked": f.formatType === k,
    className: "evtf-seg-btn" + (f.formatType === k ? " on" : ""),
    onClick: () => set("formatType", k)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: EVT_FORMAT_META[k].icon
  }), EVT_FORMAT_META[k].label)))), /*#__PURE__*/React.createElement("div", {
    className: "evtf-grid-2"
  }, /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Start Date & Time",
    required: true,
    hint: "Stored as GMT/UTC."
  }, /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    className: "evtf-input" + (errors.startIso ? " err" : ""),
    value: f.startIso ? f.startIso.slice(0, 16) : "",
    onChange: e => set("startIso", e.target.value ? new Date(e.target.value).toISOString() : "")
  }), errors.startIso && /*#__PURE__*/React.createElement("span", {
    className: "evtf-err"
  }, errors.startIso)), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "End Date & Time",
    required: true,
    hint: "Must be after start."
  }, /*#__PURE__*/React.createElement("input", {
    type: "datetime-local",
    className: "evtf-input" + (errors.endIso ? " err" : ""),
    value: f.endIso ? f.endIso.slice(0, 16) : "",
    onChange: e => set("endIso", e.target.value ? new Date(e.target.value).toISOString() : "")
  }), errors.endIso && /*#__PURE__*/React.createElement("span", {
    className: "evtf-err"
  }, errors.endIso))), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Audience Group",
    required: true,
    hint: "Who this event is visible to."
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-chips",
    role: "radiogroup"
  }, EVT_AUDIENCE_GROUPS.map(g => /*#__PURE__*/React.createElement("button", {
    key: g.key,
    type: "button",
    role: "radio",
    "aria-checked": f.audienceGroup === g.key,
    className: "evtf-chip" + (f.audienceGroup === g.key ? " on" : ""),
    onClick: () => set("audienceGroup", g.key)
  }, f.audienceGroup === g.key && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), g.label)))), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Invitation Mode",
    required: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-radio-row",
    role: "radiogroup"
  }, /*#__PURE__*/React.createElement("label", {
    className: "evtf-radio"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "invite",
    checked: f.invitationMode === "self_subscribe",
    onChange: () => set("invitationMode", "self_subscribe")
  }), "Self-Subscribe — users register on the landing page"), /*#__PURE__*/React.createElement("label", {
    className: "evtf-radio"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "invite",
    checked: f.invitationMode === "admin_driven",
    onChange: () => set("invitationMode", "admin_driven")
  }), "Admin-Driven (Exclusive) — invite-only by admin"))), f.invitationMode === "admin_driven" && /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Selected Attendees",
    required: true,
    hint: "Paste emails (comma or newline separated) or import a CSV list."
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "evtf-textarea",
    rows: 3,
    value: f.selectedAttendeesRaw,
    onChange: e => set("selectedAttendeesRaw", e.target.value),
    placeholder: "jane@clinic.com, mo@clinic.com\nor one email per line"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "evtf-inline-btn"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:upload"
  }), "Import CSV")), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Event Host",
    hint: "You're automatically assigned as the host of every event you create."
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-host-card"
  }, /*#__PURE__*/React.createElement("img", {
    className: "evtf-host-avatar",
    src: f.host.avatar,
    alt: f.host.name
  }), /*#__PURE__*/React.createElement("span", {
    className: "evtf-host-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, f.host.name), /*#__PURE__*/React.createElement("span", {
    className: "e"
  }, f.host.email)), /*#__PURE__*/React.createElement("span", {
    className: "evtf-host-badge"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:crown"
  }), "Host"))), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Speakers",
    hint: "Add anyone presenting or co-hosting this session alongside you."
  }, /*#__PURE__*/React.createElement(EVTPeopleManager, {
    people: f.speakers,
    addLabel: "Add Speaker",
    emptyLabel: "No speakers added yet.",
    onAdd: p => set("speakers", f.speakers.concat(p)),
    onRemove: id => set("speakers", f.speakers.filter(p => p.id !== id))
  })), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Specific Invites (optional)",
    hint: "Hand-pick additional people to invite to this event, on top of anyone who registers."
  }, /*#__PURE__*/React.createElement(EVTPeopleManager, {
    people: f.invitees,
    addLabel: "Add Invite",
    emptyLabel: "No specific invites added yet.",
    onAdd: p => set("invitees", f.invitees.concat(p)),
    onRemove: id => set("invitees", f.invitees.filter(p => p.id !== id))
  })), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Live Selling",
    hint: "Let the host or speaker sell products on-screen while this event is live."
  }, /*#__PURE__*/React.createElement(EVTSwitch, {
    checked: f.liveSellingEnabled,
    onChange: v => set("liveSellingEnabled", v),
    label: f.liveSellingEnabled ? "On" : "Off"
  })), f.liveSellingEnabled && /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Products",
    required: true,
    hint: "Courses from the Courses page the host/speaker can sell live."
  }, f.products.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "evtf-chips evtf-selected-products"
  }, f.products.map(id => {
    const p = EVT_PRODUCTS.find(x => x.id === id);
    if (!p) return null;
    return /*#__PURE__*/React.createElement("span", {
      key: id,
      className: "evtf-chip on evtf-product-chip"
    }, p.title, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "evtf-chip-remove",
      onClick: () => toggleProduct(id),
      "aria-label": "Remove " + p.title
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:x"
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "evtf-product-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search courses...",
    value: productQuery,
    onChange: e => setProductQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "evtf-product-list"
  }, filteredProducts.map(p => {
    const on = f.products.includes(p.id);
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: p.id,
      className: "evtf-product-row" + (on ? " is-on" : ""),
      onClick: () => toggleProduct(p.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "evtf-product-check" + (on ? " is-on" : "")
    }, on && /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:check"
    })), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:graduation-cap"
    }), /*#__PURE__*/React.createElement("span", {
      className: "evtf-product-name"
    }, p.title), /*#__PURE__*/React.createElement("span", {
      className: "evtf-product-cat"
    }, p.cat), /*#__PURE__*/React.createElement("span", {
      className: "evtf-product-price"
    }, p.price));
  }), filteredProducts.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "evtf-product-empty"
  }, "No courses match your search.")), f.products.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "evtf-hint"
  }, f.products.length, " product", f.products.length === 1 ? "" : "s", " selected."), errors.products && /*#__PURE__*/React.createElement("span", {
    className: "evtf-err"
  }, errors.products)), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Event Description",
    required: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-richtoolbar",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bold"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:italic"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:list"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:link"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:image"
  }))), /*#__PURE__*/React.createElement("textarea", {
    className: "evtf-textarea" + (errors.description ? " err" : ""),
    rows: 4,
    value: f.description,
    onChange: e => set("description", e.target.value),
    placeholder: "What is this event about?"
  }), errors.description && /*#__PURE__*/React.createElement("span", {
    className: "evtf-err"
  }, errors.description)), showLocation && /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Event Location",
    required: true,
    hint: "Venue, address and any location instructions."
  }, /*#__PURE__*/React.createElement("input", {
    className: "evtf-input" + (errors.location ? " err" : ""),
    value: f.location,
    onChange: e => set("location", e.target.value),
    placeholder: "e.g. Acquario Romano, Rome, Italy"
  }), errors.location && /*#__PURE__*/React.createElement("span", {
    className: "evtf-err"
  }, errors.location)), showCapacity && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Capacity Limit"
  }, /*#__PURE__*/React.createElement(EVTSwitch, {
    checked: f.capacityEnabled,
    onChange: v => set("capacityEnabled", v),
    label: f.capacityEnabled ? "On" : "Off"
  })), f.capacityEnabled && /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Available Invites / Capacity",
    required: true
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    className: "evtf-input evtf-input-sm" + (errors.capacity ? " err" : ""),
    value: f.capacity,
    onChange: e => set("capacity", e.target.value),
    placeholder: "e.g. 150"
  }), errors.capacity && /*#__PURE__*/React.createElement("span", {
    className: "evtf-err"
  }, errors.capacity))), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Event Thumbnail",
    required: !isEdit,
    hint: "PNG, JPG or WEBP. Max 5MB. Recommended 16:9."
  }, /*#__PURE__*/React.createElement("label", {
    className: "evtf-upload" + (errors.thumbnail ? " err" : "")
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/png,image/jpeg,image/webp",
    style: {
      display: "none"
    },
    onChange: e => set("thumbnail", e.target.files && e.target.files[0] ? e.target.files[0].name : f.thumbnail)
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:image-plus"
  }), /*#__PURE__*/React.createElement("span", null, f.thumbnail || "Click to upload, or drag a file here")), errors.thumbnail && /*#__PURE__*/React.createElement("span", {
    className: "evtf-err"
  }, errors.thumbnail)), /*#__PURE__*/React.createElement(EVTFormRow, {
    label: "Status"
  }, /*#__PURE__*/React.createElement(EVTSwitch, {
    checked: f.isActive,
    onChange: v => set("isActive", v),
    label: f.isActive ? "Active" : "Inactive"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "evtf-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "evt-btn evt-btn-ghost",
    type: "button",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "evt-btn evt-btn-navy",
    type: "button",
    onClick: save
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), isEdit ? "Save Changes" : "Create Event"))));
}

/* --------------------------------------------------------- attendees drawer */
function AttendeesDrawer({
  row,
  attendees,
  onClose,
  onInvite
}) {
  const [filter, setFilter] = useStateEVT("all");
  const [showInvite, setShowInvite] = useStateEVT(false);
  const [name, setName] = useStateEVT("");
  const [email, setEmail] = useStateEVT("");
  const list = attendees.filter(a => filter === "all" || a.status === filter);
  return /*#__PURE__*/React.createElement("div", {
    className: "evtf-overlay",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Attendees — " + row.title
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "evtf-drawer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evtf-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Attendees"), /*#__PURE__*/React.createElement("p", {
    className: "evtf-sub"
  }, row.title)), /*#__PURE__*/React.createElement("button", {
    className: "evtf-x",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "evtf-drawer-filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "evtf-chip" + (filter === "all" ? " on" : ""),
    onClick: () => setFilter("all")
  }, "All (", attendees.length, ")"), EVT_ATTENDEE_STATUSES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: "evtf-chip" + (filter === s ? " on" : ""),
    onClick: () => setFilter(s)
  }, EVT_ATTENDEE_LABELS[s]))), /*#__PURE__*/React.createElement("div", {
    className: "evtf-drawer-list"
  }, list.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "evtf-drawer-empty"
  }, "No attendees in this status yet."), list.map(a => /*#__PURE__*/React.createElement("div", {
    className: "evtf-att-row",
    key: a.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "evtf-att-avatar"
  }, a.name.split(" ").map(p => p[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("span", {
    className: "evtf-att-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, a.name), /*#__PURE__*/React.createElement("span", {
    className: "e"
  }, a.email)), /*#__PURE__*/React.createElement("span", {
    className: "evtf-att-status " + a.status
  }, EVT_ATTENDEE_LABELS[a.status])))), /*#__PURE__*/React.createElement("div", {
    className: "evtf-drawer-foot"
  }, showInvite ? /*#__PURE__*/React.createElement("div", {
    className: "evtf-invite-inline"
  }, /*#__PURE__*/React.createElement("input", {
    className: "evtf-input",
    placeholder: "Full name",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "evtf-input",
    placeholder: "Email",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    className: "evt-btn evt-btn-navy",
    type: "button",
    onClick: () => {
      if (name.trim() && email.trim()) {
        onInvite(row.id, {
          id: evtNewId(),
          name,
          email,
          status: "invited"
        });
        setName("");
        setEmail("");
        setShowInvite(false);
      }
    }
  }, "Send Invite"), /*#__PURE__*/React.createElement("button", {
    className: "evt-btn evt-btn-ghost",
    type: "button",
    onClick: () => setShowInvite(false)
  }, "Cancel")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "evt-btn evt-btn-navy",
    type: "button",
    onClick: () => setShowInvite(true)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:user-plus"
  }), "Invite Attendee"), /*#__PURE__*/React.createElement("button", {
    className: "evt-btn evt-btn-ghost",
    type: "button"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:upload"
  }), "Import CSV")))));
}

/* --------------------------------------------------------- row action menu */
function EVTRowMenu({
  row,
  onEdit,
  onAttendees,
  onArchive,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "evt-row-menu",
    role: "menu",
    onMouseLeave: onClose
  }, /*#__PURE__*/React.createElement("button", {
    role: "menuitem",
    onClick: () => onEdit(row)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Edit"), /*#__PURE__*/React.createElement("button", {
    role: "menuitem",
    onClick: () => onAttendees(row)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  }), "View Attendees"), /*#__PURE__*/React.createElement("button", {
    role: "menuitem",
    className: "danger",
    onClick: () => onArchive(row)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: row.isActive ? "lucide:archive" : "lucide:archive-restore"
  }), row.isActive ? "Archive" : "Restore"));
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
    return window.PFSuperUser.subscribe(() => forceTick(v => v + 1));
  }, []);
  const allRows = rows.concat(evtLiveRows());
  const visibleRows = allRows.filter(r => {
    if (formatFilter !== "all" && r.formatType !== formatFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return r.title.toLowerCase().includes(q) || (r.location || "").toLowerCase().includes(q);
  }).sort((a, b) => new Date(b.startIso || 0) - new Date(a.startIso || 0));
  const saveRow = row => {
    setRows(prev => {
      const exists = prev.some(r => r.id === row.id);
      return exists ? prev.map(r => r.id === row.id ? Object.assign({}, r, row) : r) : prev.concat(row);
    });
    setFormState(null);
  };
  const archiveRow = row => {
    setRows(prev => prev.map(r => r.id === row.id ? Object.assign({}, r, {
      isActive: !r.isActive
    }) : r));
    setOpenMenuId(null);
  };
  const inviteAttendee = (eventId, attendee) => {
    setAttendeesByEvent(prev => Object.assign({}, prev, {
      [eventId]: (prev[eventId] || []).concat(attendee)
    }));
    setRows(prev => prev.map(r => r.id === eventId ? Object.assign({}, r, {
      invited: (r.invited || 0) + 1
    }) : r));
  };
  /* Admin Termination Authority (PRD §4.3): forcefully end any ongoing
     Super User Live stream from here. */
  const terminateLive = row => {
    if (!window.PFSuperUser) return;
    window.PFSuperUser.endLive(row.sessionId, {
      terminatedByAdmin: true
    });
    forceTick(v => v + 1);
  };
  const FORMAT_TABS = [{
    key: "all",
    label: "All",
    icon: "lucide:layout-grid"
  }, {
    key: "in_person",
    label: "In-Person",
    icon: "lucide:map-pin"
  }, {
    key: "webinar",
    label: "Webinar",
    icon: "lucide:video"
  }, {
    key: "live",
    label: "Live Streams",
    icon: "lucide:radio"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "evt-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Events"), /*#__PURE__*/React.createElement("p", null, "Manage conferences, in-person events, and webinars from one place."))), /*#__PURE__*/React.createElement("div", {
    className: "evt-subnav"
  }, FORMAT_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    className: "evt-subnav-btn" + (formatFilter === t.key ? " is-active" : ""),
    onClick: () => setFormatFilter(t.key)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: t.icon
  }), t.label))), /*#__PURE__*/React.createElement("div", {
    className: "evt-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-search-input-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search title, location...",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    className: "evt-btn evt-btn-navy",
    type: "button",
    onClick: () => setFormState({
      mode: "create",
      row: null
    })
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Create Event")), /*#__PURE__*/React.createElement("div", {
    className: "evt-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "evt-row-grid evt-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "EVENT"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "TYPE"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "DATE"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "TIME"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "LOCATION"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "USERS"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "INVITED"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "OPENED"), /*#__PURE__*/React.createElement("span", {
    className: "evt-th"
  }, "STATUS"), /*#__PURE__*/React.createElement("span", null)), visibleRows.map(r => {
    const status = evtComputeStatus(r);
    const meta = EVT_FORMAT_META[r.formatType] || EVT_FORMAT_META.webinar;
    return /*#__PURE__*/React.createElement("div", {
      key: r.id,
      className: "evt-row-grid evt-trow"
    }, /*#__PURE__*/React.createElement("div", {
      className: "evt-trow-title"
    }, /*#__PURE__*/React.createElement("div", {
      className: "evt-trow-title-main"
    }, r.title), !r.autoLogged && /*#__PURE__*/React.createElement("span", {
      className: "evt-invite-tag evt-host-tag"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:user-check"
    }), "Hosted by ", r.host && r.host.name || EVT_ADMIN_USER.name), r.speakers && r.speakers.length > 0 && /*#__PURE__*/React.createElement("span", {
      className: "evt-invite-tag evt-speaker-tag"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:mic"
    }), r.speakers.length, " speaker", r.speakers.length === 1 ? "" : "s"), r.liveSellingEnabled && r.products && r.products.length > 0 && /*#__PURE__*/React.createElement("span", {
      className: "evt-invite-tag evt-products-tag",
      title: r.products.map(id => {
        const p = EVT_PRODUCTS.find(x => x.id === id);
        return p ? p.title : null;
      }).filter(Boolean).join(", ")
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:shopping-cart"
    }), r.products.length, " product", r.products.length === 1 ? "" : "s", " live"), r.invitationMode === "admin_driven" && /*#__PURE__*/React.createElement("span", {
      className: "evt-invite-tag"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:mail-check"
    }), "Invite only"), r.autoLogged && /*#__PURE__*/React.createElement("span", {
      className: "evt-invite-tag evt-autolog-tag"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:zap"
    }), "Auto-logged · Super User")), /*#__PURE__*/React.createElement("span", {
      className: "evt-cell"
    }, /*#__PURE__*/React.createElement("span", {
      className: "evt-type-badge"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: meta.icon
    }), meta.label)), /*#__PURE__*/React.createElement("span", {
      className: "evt-cell"
    }, evtFmtDate(r.startIso)), /*#__PURE__*/React.createElement("span", {
      className: "evt-cell"
    }, evtFmtTime(r.startIso)), /*#__PURE__*/React.createElement("span", {
      className: "evt-cell evt-cell-location"
    }, r.location || "—"), /*#__PURE__*/React.createElement("span", {
      className: "evt-metric"
    }, evtCapacityLabel(r)), /*#__PURE__*/React.createElement("span", {
      className: "evt-metric"
    }, r.invited), /*#__PURE__*/React.createElement("span", {
      className: "evt-metric"
    }, r.opened), /*#__PURE__*/React.createElement("div", {
      className: "evt-status-pill"
    }, /*#__PURE__*/React.createElement("span", {
      className: "evt-status-dot",
      style: {
        background: status.color
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "evt-status-label",
      style: {
        color: status.color
      }
    }, status.label)), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative"
      }
    }, r.autoLogged ? r.liveStatus === "live" && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "evt-btn evt-btn-ghost evt-terminate-btn",
      onClick: () => terminateLive(r)
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:octagon-x"
    }), "Terminate") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:more-vertical",
      class: "evt-row-more",
      onClick: () => setOpenMenuId(openMenuId === r.id ? null : r.id)
    }), openMenuId === r.id && /*#__PURE__*/React.createElement(EVTRowMenu, {
      row: r,
      onEdit: row => {
        setOpenMenuId(null);
        setFormState({
          mode: "edit",
          row
        });
      },
      onAttendees: row => {
        setOpenMenuId(null);
        setAttendeesFor(row);
      },
      onArchive: archiveRow,
      onClose: () => setOpenMenuId(null)
    }))));
  }), visibleRows.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "evt-empty"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:calendar-x"
  }), /*#__PURE__*/React.createElement("span", null, "No events match your search."))), formState && /*#__PURE__*/React.createElement(EventFormModal, {
    initial: formState.mode === "edit" ? formState.row : null,
    onClose: () => setFormState(null),
    onSave: saveRow
  }), attendeesFor && /*#__PURE__*/React.createElement(AttendeesDrawer, {
    row: attendeesFor,
    attendees: attendeesByEvent[attendeesFor.id] || [],
    onClose: () => setAttendeesFor(null),
    onInvite: inviteAttendee
  }));
}

/* ------------------------------------------------------------- root */
function EVTRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "evt-shell"
  }, /*#__PURE__*/React.createElement(EVTSidebar, null), /*#__PURE__*/React.createElement("main", {
    className: "evt-main"
  }, /*#__PURE__*/React.createElement(EVTHeader, {
    title: "Events"
  }), /*#__PURE__*/React.createElement("div", {
    className: "evt-content"
  }, /*#__PURE__*/React.createElement(EVTListView, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(EVTRoot, null));
