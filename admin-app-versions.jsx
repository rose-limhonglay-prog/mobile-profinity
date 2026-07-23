/* ===========================================================================
   PROfinity — Admin · App Versions (desktop console)
   Per-platform release list: current/mandatory update tracking for iOS and
   Android. Classes prefixed apv- to avoid clashes with other pages.
   =========================================================================== */

function goAPV(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

/* ------------------------------------------------------------- mock data */
const APV_IOS_VERSIONS = [
  { v: "v1.9.1", current: true, mandatory: true, notes: "This staging update includes improvements to membership claim access, including smoother WooCommerce membership takeover and card reuse handling, fixes for web verification date formatting, better image loading for agent cards on mobile, and enhanced interactive HTML course previews so course content displays more reliably across devices." },
  { v: "v1.8.5", current: false, mandatory: false, notes: "This update improves the learning experience by adding support for migrated LearnDash course access, better handling for claimed and mylearning courses, and fixes around course identifiers to prevent access or content mismatches. We also refined course detail, quiz, certificate, and web learning screens for a more reliable experience, plus included platform dependency updates for better overall app stability." },
  { v: "v1.8.0", current: false, mandatory: false, notes: "This update adds richer post formatting, clickable images in comments and replies, auto-play videos, improved verification banners, better saved post handling, and fixes for likes, comments, shares, and community post interactions." },
  { v: "v1.7.3", current: false, mandatory: false, notes: "This update introduces interactive community polls, pinned posts, improved mentions and notifications, enhanced premium content access, and profile completion reminders. We've also improved course performance, membership and trial management, clinician discovery, video experiences, and overall app reliability." },
  { v: "v1.6.1", current: false, mandatory: false, notes: "Discover a smoother Profinity experience with a new mobile onboarding tour, improved reactions for posts, comments, and replies with haptic feedback, selectable post and comment text, better reply threading, comment photo support, enhanced post sharing, improved course PDF and video playback, clearer video thumbnails, membership trial updates, refreshed colors, profile improvements, and general performance and stability fixes." },
  { v: "v1.6.0", current: false, mandatory: false, notes: "" },
];

const APV_ANDROID_VERSIONS = [];

/* ------------------------------------------------------------- sidebar */
const APV_NAV = [
  { icon: "lucide:layout-grid", label: "Dashboard" },
  { icon: "lucide:user", label: "Users" },
  { icon: "lucide:file-text", label: "Posts Management" },
  { icon: "lucide:layout-dashboard", label: "Content Moderation" },
  { icon: "lucide:life-buoy", label: "Service Requests" },
  { icon: "lucide:shield-check", label: "Verification" },
  { icon: "lucide:users-round", label: "Agents" },
  { icon: "lucide:calendar", label: "Events" },
  { icon: "lucide:map", label: "Product Mapping" },
  { icon: "lucide:bar-chart-3", label: "Analytics" },
  { icon: "lucide:smartphone", label: "App Versions", active: true },
  { icon: "lucide:bell", label: "Push Notification" },
  { icon: "lucide:receipt-text", label: "Transactions", chevron: true },
  { icon: "lucide:table-2", label: "Courses", chevron: true },
  { icon: "lucide:users", label: "Community", chevron: true },
];

const APV_NAV_LINKS = {
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

function APVSidebar() {
  return (
    <aside className="apv-sidebar">
      <div className="apv-logo">
        <img src="assets/profinity-academy-logo-full.png" alt="PROfinity Academy" />
      </div>
      {APV_NAV.map((item) => {
        const href = APV_NAV_LINKS[item.label];
        return (
          <button
            key={item.label}
            className={"apv-navitem" + (item.active ? " is-active" : "")}
            type="button"
            onClick={href && !item.active ? () => goAPV(href) : undefined}
          >
            <iconify-icon icon={item.icon}></iconify-icon>
            <span>{item.label}</span>
            {item.chevron && (
              <>
                <span className="apv-spacer" />
                <iconify-icon icon="lucide:chevron-down" class="apv-chev"></iconify-icon>
              </>
            )}
          </button>
        );
      })}
    </aside>
  );
}

function APVHeader({ title }) {
  return (
    <header className="apv-header">
      <iconify-icon icon="lucide:panel-left" style={{ fontSize: 22, color: "var(--gray-500)", cursor: "pointer" }}></iconify-icon>
      <span className="apv-header-title">{title}</span>
      <div className="apv-header-search">
        <iconify-icon icon="lucide:search"></iconify-icon>
        <input placeholder="Type to search..." />
      </div>
      <div className="apv-spacer" />
      <div className="apv-bell">
        <iconify-icon icon="lucide:bell"></iconify-icon>
        <span className="apv-bell-badge">4</span>
      </div>
      <div className="apv-user">
        <div className="apv-user-name">Dr Tim Pearce</div>
        <div className="apv-user-role">Admin</div>
      </div>
      <img className="apv-user-avatar" src="assets/avatar-drtim.png" alt="Dr Tim Pearce" />
      <iconify-icon icon="lucide:chevron-down"></iconify-icon>
    </header>
  );
}

/* --------------------------------------------------------- version card */
function APVVersionCard({ item }) {
  return (
    <div className={"apv-version-card" + (item.current ? " is-current" : "")}>
      <div className="apv-version-main">
        <div className="apv-version-top">
          <span className="apv-version-num">{item.v}</span>
          {item.current && (
            <span className="apv-badge apv-badge-current">CURRENT</span>
          )}
          {item.mandatory && (
            <span className="apv-badge apv-badge-mandatory">MANDATORY</span>
          )}
        </div>
        {item.notes && <p className="apv-version-notes">{item.notes}</p>}
      </div>
      <button className="apv-version-more" type="button" aria-label="Version actions">
        <iconify-icon icon="lucide:more-horizontal"></iconify-icon>
      </button>
    </div>
  );
}

/* --------------------------------------------------------- platform section */
function APVPlatformSection({ icon, iconColor, iconBg, label, versions, emptyText }) {
  return (
    <div className="apv-platform-section">
      <div className="apv-section-head">
        <span className="apv-section-icon" style={{ color: iconColor, background: iconBg }}>
          <iconify-icon icon={icon}></iconify-icon>
        </span>
        <span className="apv-section-label">{label}</span>
        {versions.length > 0 && <span className="apv-section-count">{versions.length} version{versions.length === 1 ? "" : "s"}</span>}
      </div>

      {versions.length > 0 ? (
        <div className="apv-version-list">
          {versions.map((item) => (
            <APVVersionCard key={item.v} item={item} />
          ))}
        </div>
      ) : (
        <div className="apv-section-empty">{emptyText}</div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- root */
function AppVersionsRoot() {
  return (
    <div className="apv-shell">
      <APVSidebar />
      <main className="apv-main">
        <APVHeader title="App Versions" />
        <div className="apv-content">
          <div className="apv-page-head">
            <div>
              <h1>App Versions</h1>
              <p>
                Track the current release for each platform, and control whether members are shown a
                mandatory update prompt (blocking, must update to continue) or an advisory one
                (dismissible, update recommended). Only one version per platform is marked current at a time.
              </p>
            </div>
            <div className="apv-page-head-actions">
              <button className="apv-btn apv-btn-navy" type="button" onClick={() => {}}>
                <iconify-icon icon="lucide:plus"></iconify-icon>Add version
              </button>
            </div>
          </div>

          <APVPlatformSection
            icon="mdi:apple"
            iconColor="var(--gray-700)"
            iconBg="var(--gray-100)"
            label="iOS"
            versions={APV_IOS_VERSIONS}
            emptyText="No iOS versions added yet."
          />

          <APVPlatformSection
            icon="mdi:android"
            iconColor="var(--success)"
            iconBg="var(--success-bg)"
            label="Android"
            versions={APV_ANDROID_VERSIONS}
            emptyText="No Android versions added yet."
          />
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<AppVersionsRoot />);
