/* ===========================================================================
   PROfinity — Admin · Verification (desktop console)
   Single ID-document review card: clinician identity + license details,
   front-ID document preview, and approve/reject actions.
   Suffixed -VER to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateVer } = React;

function goVer(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- sidebar */
const VER_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification", active: true },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events" },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions" },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const VER_NAV_LINKS = {
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
  "Transactions": "AdminTransactions.html",
  "Courses": "AdminCourses.html",
  "Community": "AdminCommunity.html",
};

function VerSidebar() {
  return (
    <aside className="ver-sidebar">
      <div className="ver-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {VER_NAV.map((item) => {
        const href = VER_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"ver-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goVer(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="ver-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="ver-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function VerHeader({ title }) {
  return (
    <header className="ver-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="ver-header-title">{title}</span>
      <div className="ver-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="ver-spacer" />
      <div className="ver-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="ver-bell-badge">4</span>
      </div>
      <div className="ver-user">
        <div className="ver-user-name">Dr Tim Pearce</div>
        <div className="ver-user-role">Admin</div>
      </div>
      <img className="ver-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* ------------------------------------------------------------- mock data */
const VER_RECORD = {
  name: "Helena Halliwell",
  subtitle: "helena.halliwell@profinity.academy · Clinician",
  status: "DRAFT",
  frontIdPath: "a1b2c3d4-e5f6-47a8-9b0c-d1e2f3a4b5c6.jpg",
  backIdPath: "",
};

const VER_FIELDS = [
  { key: "idFullName", label: "ID Full Name", value: "" },
  { key: "dob", label: "Date of Birth", value: "" },
  { key: "nationality", label: "Nationality", value: "" },
  { key: "placeOfBirth", label: "Place of Birth", value: "" },
  { key: "dateOfIssue", label: "Date of Issue", value: "" },
  { key: "dateOfExpiry", label: "Date of Expiry", value: "" },
  { key: "license", label: "License", value: "" },
  { key: "licensedCountry", label: "Licensed Country", value: "" },
  { key: "frontIdPath", label: "Front ID Path", value: VER_RECORD.frontIdPath, mono: true },
  { key: "backIdPath", label: "Back ID Path", value: VER_RECORD.backIdPath },
  { key: "submitted", label: "Submitted", value: "" },
  { key: "updated", label: "Updated", value: "23/7/2026 05:29" },
];

const VER_STATUS_META = {
  DRAFT: { color: "var(--gray-500)", bg: "var(--gray-100)" },
};

/* ------------------------------------------------------------- copy hook */
function verCopy(text, setFlag) {
  if (!text) return;
  const done = () => { setFlag(true); setTimeout(() => setFlag(false), 1600); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, done);
  } else {
    done();
  }
}

/* ------------------------------------------------------------- detail card */
function VerDetailCard() {
  const [copiedFront, setCopiedFront] = useStateVer(false);
  const [copiedBack, setCopiedBack] = useStateVer(false);
  const statusMeta = VER_STATUS_META[VER_RECORD.status] || VER_STATUS_META.DRAFT;
  const hasBackPath = !!VER_RECORD.backIdPath;

  return (
    <div className="ver-card">
      <div className="ver-card-head">
        <div className="ver-card-head-id">
          <div className="ver-card-name">{VER_RECORD.name}</div>
          <div className="ver-card-sub">{VER_RECORD.subtitle}</div>
        </div>
        <span className="ver-status-pill" style={{ background: statusMeta.bg, color: statusMeta.color }}>
          {VER_RECORD.status}
        </span>
      </div>

      <div className="ver-field-grid">
        {VER_FIELDS.map((f) => {
          const empty = !f.value;
          return (
            <div className="ver-field" key={f.key}>
              <div className="ver-field-label">{f.label}</div>
              <div className={"ver-field-value" + (f.mono ? " ver-mono" : "") + (empty ? " is-empty" : "")}>
                {empty ? "—" : f.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ver-doc-section">
        <div className="ver-doc-label">
          <iconify-icon icon="lucide:image"></iconify-icon>
          Front ID
        </div>
        <div className="ver-doc-preview">
          <span>Document preview</span>
        </div>
      </div>

      <div className="ver-card-footer">
        <button
          className="ver-btn ver-btn-outline"
          type="button"
          onClick={() => verCopy(VER_RECORD.frontIdPath, setCopiedFront)}
        >
          <iconify-icon icon={copiedFront ? "lucide:check" : "lucide:copy"}></iconify-icon>
          {copiedFront ? "Copied!" : "Copy front path"}
        </button>
        <button
          className="ver-btn ver-btn-outline"
          type="button"
          disabled={!hasBackPath}
          onClick={() => hasBackPath && verCopy(VER_RECORD.backIdPath, setCopiedBack)}
        >
          <iconify-icon icon={copiedBack ? "lucide:check" : "lucide:copy"}></iconify-icon>
          {copiedBack ? "Copied!" : "Copy back path"}
        </button>
        <div className="ver-spacer" />
        <button className="ver-btn ver-btn-danger-outline" type="button">
          <iconify-icon icon="lucide:x"></iconify-icon>
          Reject
        </button>
        <button className="ver-btn ver-btn-navy" type="button">
          <iconify-icon icon="lucide:check"></iconify-icon>
          Approve
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- root view */
function VerView() {
  const [refreshing, setRefreshing] = useStateVer(false);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="ver-view">
      <div className="ver-page-head">
        <div>
          <h1>Verification</h1>
          <p>Review clinician-submitted ID documents before granting verified status.</p>
        </div>
        <div className="ver-page-head-actions">
          <button className="ver-btn ver-btn-navy" type="button" onClick={handleRefresh}>
            <iconify-icon icon="lucide:refresh-cw" class={refreshing ? "ver-spin" : ""}></iconify-icon>
            Refresh
          </button>
        </div>
      </div>

      <VerDetailCard />
    </div>
  );
}

function VerRoot() {
  return (
    <div className="ver-shell">
      <VerSidebar />
      <main className="ver-main">
        <VerHeader title="Verification" />
        <div className="ver-content">
          <VerView />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<VerRoot />);
