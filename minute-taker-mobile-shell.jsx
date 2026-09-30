/* ===========================================================================
   PROfinity — Minute Taker (mobile) · shared shell
   One small runtime shared by the four mobile Minute Taker pages
   (Dashboard → Start Session → Live Session → Note Review):
     · iPhone device-stage wrapper (IOSDevice on desktop, full-bleed on phones)
     · theme-following (`data-theme` on <html> drives the IOSDevice status bar)
     · patient directory + the sessionStorage hand-off between pages
     · tiny UI atoms: Ic, Avatar, TopBar, StatusPill, useToast
   Exposes window.PFMT. Classes prefixed mt- (see minute-taker-mobile.css).
   =========================================================================== */
(function () {
  const { useState, useEffect, useRef } = React;
  const DS = window.ProfinityDesignSystem_c2b5cc;

  /* ------------------------------------------------------------ helpers */
  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
  function getParam(name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
  }
  const CTX_KEY = "mtSession";
  function loadCtx() { try { return JSON.parse(sessionStorage.getItem(CTX_KEY) || "{}"); } catch (e) { return {}; } }
  function saveCtx(data) { try { sessionStorage.setItem(CTX_KEY, JSON.stringify(data)); } catch (e) {} }
  function mergeCtx(patch) { saveCtx({ ...loadCtx(), ...patch }); }

  function fmtClock(totalSeconds, style) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (style === "words") return m + "m " + String(s).padStart(2, "0") + "s";
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }
  function todayLabel() {
    try {
      return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    } catch (e) { return ""; }
  }
  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }

  /* ------------------------------------------------------------ patients */
  const PATIENTS = {
    "Sarah Jenkins": { id: "MT-84729", tone: "violet", gender: "Female", age: 38, dob: "12 Apr 1988", phone: "07700 900123", email: "s.jenkins@example.com",
      lastVisit: "3 weeks ago", visits: 6,
      allergies: [{ label: "Penicillin", severity: "Severe" }, { label: "Latex", severity: "Mild" }],
      conditions: ["Hypertension", "Type 2 diabetes"],
      primer: "Follow-up on knee arthroscopy (3 weeks post-op). Focus on pain levels, mobility and any signs of infection." },
    "Eleanor Vance": { id: "MT-77213", tone: "teal", gender: "Female", age: 61, dob: "2 Mar 1965", phone: "07700 900234", email: "e.vance@example.com",
      lastVisit: "Today", visits: 11,
      allergies: [{ label: "NKDA", severity: null }],
      conditions: ["Osteoarthritis", "Hypothyroidism"],
      primer: "Follow-up on cosmetic injectable series. Assess symmetry, bruising and satisfaction versus the prior session." },
    "Marcus Thorne": { id: "MT-77198", tone: "amber", gender: "Male", age: 45, dob: "19 Nov 1980", phone: "07700 900345", email: "m.thorne@example.com",
      lastVisit: "Today", visits: 1,
      allergies: [{ label: "Sulfa drugs", severity: "Moderate" }],
      conditions: [],
      primer: "New patient consultation for laser resurfacing. Discuss downtime expectations and post-procedure care." },
    "David Cho": { id: "MT-77042", tone: "rose", gender: "Male", age: 29, dob: "30 Jun 1996", phone: "07700 900456", email: "d.cho@example.com",
      lastVisit: "Yesterday", visits: 3,
      allergies: [{ label: "NKDA", severity: null }],
      conditions: ["Mild acne (ongoing)"],
      primer: "Second session of the acne treatment protocol. Check for irritation and compare against progress photos." },
    "Priya Natarajan": { id: "MT-77310", tone: "teal", gender: "Female", age: 34, dob: "8 Sep 1992", phone: "07700 900567", email: "p.natarajan@example.com",
      lastVisit: "5 days ago", visits: 2,
      allergies: [{ label: "NKDA", severity: null }],
      conditions: ["Melasma"],
      primer: "Skin consult follow-up. Review pigmentation progress and discuss next steps for the treatment plan." },
    "Amir Khan": { id: "MT-76980", tone: "amber", gender: "Male", age: 52, dob: "21 Jan 1974", phone: "07700 900678", email: "a.khan@example.com",
      lastVisit: "2 months ago", visits: 4,
      allergies: [{ label: "Aspirin", severity: "Mild" }],
      conditions: ["Rosacea"],
      primer: "Routine review of rosacea management. Check flare frequency and tolerance of the current regimen." },
  };
  const PATIENT_NAMES = Object.keys(PATIENTS);
  const BLANK_PATIENT = { id: null, tone: "slate", gender: "", age: "", dob: "", phone: "", email: "", lastVisit: null, visits: 0, allergies: [], conditions: [], primer: "" };

  function initials(name) {
    return String(name || "").trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase() || "?";
  }
  function toneFor(name) { return (PATIENTS[name] && PATIENTS[name].tone) || "slate"; }

  /* ------------------------------------------------------------ hooks */
  function useIsMobile() {
    const [mobile, setMobile] = useState(() => window.matchMedia("(max-width:768px)").matches);
    useEffect(() => {
      const mq = window.matchMedia("(max-width:768px)");
      const h = (e) => setMobile(e.matches);
      mq.addEventListener("change", h);
      return () => mq.removeEventListener("change", h);
    }, []);
    return mobile;
  }
  function useDeviceScale() {
    const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
    const [scale, setScale] = useState(calc);
    useEffect(() => {
      const update = () => setScale(calc());
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);
    return scale;
  }
  function useDarkTheme() {
    const read = () => document.documentElement.getAttribute("data-theme") === "dark";
    const [dark, setDark] = useState(read);
    useEffect(() => {
      const obs = new MutationObserver(() => setDark(read()));
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => obs.disconnect();
    }, []);
    return dark;
  }
  function useToast() {
    const [msg, setMsg] = useState(null);
    const [tone, setTone] = useState("dark");
    const tRef = useRef(null);
    const show = (m, t) => {
      setMsg(m); setTone(t || "dark");
      clearTimeout(tRef.current);
      tRef.current = setTimeout(() => setMsg(null), 2200);
    };
    const node = (
      <div className={"mt-toast" + (msg ? " is-on" : "") + " mt-toast-" + tone} role="status" aria-live="polite">
        {msg && <>{tone === "ok" ? <Ic name="lucide:check-circle-2" size={16} /> : <Ic name="lucide:info" size={16} />}{msg}</>}
      </div>
    );
    return { show, node };
  }

  /* ------------------------------------------------------------ atoms */
  function Ic({ name, size = 18, color }) {
    return <DS.IconifyIcon name={name} size={size} color={color || "currentColor"} />;
  }

  function Avatar({ name, tone, size = 40, isNew, className }) {
    const t = tone || toneFor(name);
    const style = { width: size, height: size, fontSize: Math.round(size * 0.36) };
    return (
      <span className={"mt-avatar mt-tone-" + (isNew ? "new" : t) + (className ? " " + className : "")} style={style} aria-hidden="true">
        {isNew ? <Ic name="lucide:user-plus" size={Math.round(size * 0.45)} /> : initials(name)}
      </span>
    );
  }

  function TopBar({ left, title, sub, right }) {
    return (
      <header className="mt-top">
        <div className="mt-top-l">{left}</div>
        <div className="mt-top-c">
          <span className="mt-top-title">{title}</span>
          {sub && <span className="mt-top-sub">{sub}</span>}
        </div>
        <div className="mt-top-r">{right}</div>
      </header>
    );
  }
  function IconBtn({ icon, label, onClick, tone, disabled }) {
    return (
      <button type="button" className={"mt-iconbtn" + (tone ? " mt-iconbtn-" + tone : "")} onClick={onClick} aria-label={label} disabled={disabled}>
        <Ic name={icon} size={20} />
      </button>
    );
  }
  function TextBtn({ children, onClick, tone, disabled }) {
    return <button type="button" className={"mt-textbtn" + (tone ? " mt-textbtn-" + tone : "")} onClick={onClick} disabled={disabled}>{children}</button>;
  }

  const STATUS = {
    "Note Ready": { cls: "info", icon: "lucide:sparkles", label: "Ready to review" },
    "Processing": { cls: "warn", icon: "lucide:loader-circle", label: "Writing note" },
    "Saved": { cls: "ok", icon: "lucide:check", label: "Saved to EMR" },
  };
  function StatusPill({ status, compact }) {
    const m = STATUS[status] || { cls: "muted", icon: "lucide:circle", label: status };
    return (
      <span className={"mt-pill mt-pill-" + m.cls + (status === "Processing" ? " is-spin" : "")}>
        <Ic name={m.icon} size={12} />{compact ? status : m.label}
      </span>
    );
  }

  /* ------------------------------------------------------------ shell */
  function Shell({ children, label }) {
    const mobile = useIsMobile();
    const scale = useDeviceScale();
    const dark = useDarkTheme();
    const vars = { "--action-primary": "var(--ai-purple)", "--action-primary-hover": "var(--ai-purple-600)" };
    if (mobile) {
      return <div className="app mt-app" style={vars} data-screen-label={label}>{children}</div>;
    }
    return (
      <div className="app device-stage mt-stage" style={vars} data-screen-label={label}>
        <div style={{ transform: "scale(" + scale + ")", transformOrigin: "center center" }}>
          <IOSDevice width={440} height={956} dark={dark}>{children}</IOSDevice>
        </div>
      </div>
    );
  }

  window.PFMT = {
    go, getParam, loadCtx, saveCtx, mergeCtx, fmtClock, todayLabel, greeting,
    PATIENTS, PATIENT_NAMES, BLANK_PATIENT, initials, toneFor, STATUS,
    useIsMobile, useDeviceScale, useDarkTheme, useToast,
    Ic, Avatar, TopBar, IconBtn, TextBtn, StatusPill, Shell,
    routes: {
      dashboard: "MinuteTakerDashboardMobile.html",
      start: "MinuteTakerStartSessionMobile.html",
      session: "MinuteTakerSessionMobile.html",
      review: "MinuteTakerNoteReviewMobile.html",
      archive: "MinuteTakerArchive.html",
      agents: "AgentMobile.html",
    },
  };
})();
