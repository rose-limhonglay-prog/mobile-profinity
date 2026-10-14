/* ===========================================================================
   PROfinity — Minute Taker (web) · shared shell
   Web twin of minute-taker-mobile-shell.jsx (window.PFMT). One small runtime
   shared by the desktop Minute Taker pages (Dashboard · Start session ·
   Live session · Note review · Archive):
     · sidebar + header chrome (the 2026-10-12 dashboard restyle)
     · patient directory + the sessionStorage hand-off between pages
     · UI atoms: Avatar, StatusPill, Seg, useToast
   Exposes window.PFMTW. Classes prefixed mtw- (see minute-taker-web.css).
   Tokens are the --mtd-* set so the dashboard page keeps working unchanged.
   =========================================================================== */
(function () {
  const {
    useState,
    useRef
  } = React;

  /* ------------------------------------------------------------ helpers */
  function go(url) {
    (window.pfGo || function (u) {
      window.location.href = u;
    })(url);
  }
  function getParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
      return null;
    }
  }
  const CTX_KEY = "mtSession";
  function loadCtx() {
    try {
      return JSON.parse(sessionStorage.getItem(CTX_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function saveCtx(data) {
    try {
      sessionStorage.setItem(CTX_KEY, JSON.stringify(data));
    } catch (e) {}
  }
  function mergeCtx(patch) {
    saveCtx({
      ...loadCtx(),
      ...patch
    });
  }
  function fmtClock(totalSeconds, style) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (style === "words") return m + "m " + String(s).padStart(2, "0") + "s";
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }
  function todayLabel() {
    try {
      return new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long"
      });
    } catch (e) {
      return "";
    }
  }
  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }

  /* ------------------------------------------------------------ patients (same directory as mobile) */
  const PATIENTS = {
    "Sarah Jenkins": {
      id: "MT-84729",
      tone: "violet",
      gender: "Female",
      age: 38,
      dob: "12 Apr 1988",
      phone: "07700 900123",
      email: "s.jenkins@example.com",
      lastVisit: "3 weeks ago",
      visits: 6,
      allergies: [{
        label: "Penicillin",
        severity: "Severe"
      }, {
        label: "Latex",
        severity: "Mild"
      }],
      conditions: ["Hypertension", "Type 2 diabetes"],
      primer: "Follow-up on knee arthroscopy (3 weeks post-op). Focus on pain levels, mobility and any signs of infection."
    },
    "Eleanor Vance": {
      id: "MT-77213",
      tone: "teal",
      gender: "Female",
      age: 61,
      dob: "2 Mar 1965",
      phone: "07700 900234",
      email: "e.vance@example.com",
      lastVisit: "Today",
      visits: 11,
      allergies: [{
        label: "NKDA",
        severity: null
      }],
      conditions: ["Osteoarthritis", "Hypothyroidism"],
      primer: "Follow-up on cosmetic injectable series. Assess symmetry, bruising and satisfaction versus the prior session."
    },
    "Marcus Thorne": {
      id: "MT-77198",
      tone: "amber",
      gender: "Male",
      age: 45,
      dob: "19 Nov 1980",
      phone: "07700 900345",
      email: "m.thorne@example.com",
      lastVisit: "Today",
      visits: 1,
      allergies: [{
        label: "Sulfa drugs",
        severity: "Moderate"
      }],
      conditions: [],
      primer: "New patient consultation for laser resurfacing. Discuss downtime expectations and post-procedure care."
    },
    "David Cho": {
      id: "MT-77042",
      tone: "rose",
      gender: "Male",
      age: 29,
      dob: "30 Jun 1996",
      phone: "07700 900456",
      email: "d.cho@example.com",
      lastVisit: "Yesterday",
      visits: 3,
      allergies: [{
        label: "NKDA",
        severity: null
      }],
      conditions: ["Mild acne (ongoing)"],
      primer: "Second session of the acne treatment protocol. Check for irritation and compare against progress photos."
    },
    "Priya Natarajan": {
      id: "MT-77310",
      tone: "teal",
      gender: "Female",
      age: 34,
      dob: "8 Sep 1992",
      phone: "07700 900567",
      email: "p.natarajan@example.com",
      lastVisit: "5 days ago",
      visits: 2,
      allergies: [{
        label: "NKDA",
        severity: null
      }],
      conditions: ["Melasma"],
      primer: "Skin consult follow-up. Review pigmentation progress and discuss next steps for the treatment plan."
    },
    "Amir Khan": {
      id: "MT-76980",
      tone: "amber",
      gender: "Male",
      age: 52,
      dob: "21 Jan 1974",
      phone: "07700 900678",
      email: "a.khan@example.com",
      lastVisit: "2 months ago",
      visits: 4,
      allergies: [{
        label: "Aspirin",
        severity: "Mild"
      }],
      conditions: ["Rosacea"],
      primer: "Routine review of rosacea management. Check flare frequency and tolerance of the current regimen."
    }
  };
  const PATIENT_NAMES = Object.keys(PATIENTS);
  const BLANK_PATIENT = {
    id: null,
    tone: "slate",
    gender: "",
    age: "",
    dob: "",
    phone: "",
    email: "",
    lastVisit: null,
    visits: 0,
    allergies: [],
    conditions: [],
    primer: ""
  };
  function initials(name) {
    return String(name || "").trim().split(/\s+/).slice(0, 2).map(p => p[0] || "").join("").toUpperCase() || "?";
  }
  function toneFor(name) {
    return PATIENTS[name] && PATIENTS[name].tone || "slate";
  }

  /* ------------------------------------------------------------ atoms */
  function Avatar({
    name,
    tone,
    size = 40,
    isNew,
    className
  }) {
    const t = tone || toneFor(name);
    const style = {
      width: size,
      height: size,
      fontSize: Math.round(size * 0.36)
    };
    return /*#__PURE__*/React.createElement("span", {
      className: "mtw-avatar mtw-tone-" + (isNew ? "new" : t) + (className ? " " + className : ""),
      style: style,
      "aria-hidden": "true"
    }, isNew ? /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:user-plus",
      style: {
        fontSize: Math.round(size * 0.45)
      }
    }) : initials(name));
  }
  const STATUS = {
    "Note Ready": {
      cls: "info",
      icon: "lucide:sparkles",
      label: "Ready to review",
      cta: "Review note"
    },
    "Processing": {
      cls: "warn",
      icon: "lucide:loader-circle",
      label: "Writing note",
      cta: "Please wait"
    },
    "Saved": {
      cls: "ok",
      icon: "lucide:check",
      label: "Saved to EMR",
      cta: "View note"
    }
  };
  function StatusPill({
    status,
    compact
  }) {
    const m = STATUS[status] || {
      cls: "muted",
      icon: "lucide:circle",
      label: status
    };
    return /*#__PURE__*/React.createElement("span", {
      className: "mtw-pill mtw-pill-" + m.cls + (status === "Processing" ? " is-spin" : "")
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: m.icon
    }), compact ? status : m.label);
  }

  /* segmented control with sliding thumb (twin of the mobile mtnrm-seg) */
  function Seg({
    items,
    value,
    onChange,
    label,
    className
  }) {
    const i = Math.max(0, items.findIndex(it => it.key === value));
    return /*#__PURE__*/React.createElement("div", {
      className: "mtw-seg" + (className ? " " + className : ""),
      role: "tablist",
      "aria-label": label,
      style: {
        "--n": items.length,
        "--i": i
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtw-seg-thumb",
      "aria-hidden": "true"
    }), items.map(it => /*#__PURE__*/React.createElement("button", {
      key: it.key,
      type: "button",
      role: "tab",
      "aria-selected": value === it.key,
      className: "mtw-seg-btn" + (value === it.key ? " is-on" : ""),
      onClick: () => onChange(it.key)
    }, it.label, it.count !== undefined && /*#__PURE__*/React.createElement("em", null, it.count))));
  }
  function useToast() {
    const [msg, setMsg] = useState(null);
    const [tone, setTone] = useState("dark");
    const tRef = useRef(null);
    const show = (m, t) => {
      setMsg(m);
      setTone(t || "dark");
      clearTimeout(tRef.current);
      tRef.current = setTimeout(() => setMsg(null), 2200);
    };
    const node = /*#__PURE__*/React.createElement("div", {
      className: "mtw-toast" + (msg ? " is-on" : "") + " mtw-toast-" + tone,
      role: "status",
      "aria-live": "polite"
    }, msg && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: tone === "ok" ? "lucide:check-circle-2" : "lucide:info"
    }), msg));
    return {
      show,
      node
    };
  }

  /* ------------------------------------------------------------ chrome */
  const routes = {
    dashboard: "MinuteTakerDashboard.html",
    start: "MinuteTakerPatientContext.html",
    session: "MinuteTakerSession.html",
    review: "MinuteTakerNoteReview.html",
    archive: "MinuteTakerArchive.html",
    agents: "Agent.html"
  };
  const NAV = [{
    key: "Dashboard",
    icon: "lucide:layout-grid",
    href: routes.dashboard
  }, {
    key: "Patients",
    icon: "lucide:users",
    href: routes.start
  }, {
    key: "Archive",
    icon: "lucide:archive",
    href: routes.archive
  }];
  function Sidebar({
    active
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      className: "mtw-sidebar"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mtw-back",
      onClick: () => go(routes.agents)
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:arrow-left"
    }), "All agents"), /*#__PURE__*/React.createElement("div", {
      className: "mtw-logo"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtw-logo-mark"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:mic"
    })), /*#__PURE__*/React.createElement("span", null, "Minute Taker")), NAV.map(item => /*#__PURE__*/React.createElement("button", {
      key: item.key,
      className: "mtw-navitem" + (item.key === active ? " is-active" : ""),
      type: "button",
      onClick: item.key !== active ? () => go(item.href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.key))), /*#__PURE__*/React.createElement("div", {
      className: "mtw-side-foot"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:shield-check"
    }), /*#__PURE__*/React.createElement("span", null, "Recordings are kept with the note for 30 days. Notes save to the EMR automatically.")));
  }
  function Header({
    title,
    sub,
    right
  }) {
    return /*#__PURE__*/React.createElement("header", {
      className: "mtw-header"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:panel-left",
      class: "mtw-header-toggle"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mtw-header-title"
    }, title, sub && /*#__PURE__*/React.createElement("small", null, sub)), /*#__PURE__*/React.createElement("div", {
      className: "mtw-spacer"
    }), right, /*#__PURE__*/React.createElement("div", {
      className: "mtw-bell"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:bell"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mtw-bell-badge"
    }, "2")), /*#__PURE__*/React.createElement("div", {
      className: "mtw-user"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mtw-user-name"
    }, "Dr. Katie Smith"), /*#__PURE__*/React.createElement("div", {
      className: "mtw-user-role"
    }, "Clinician")), /*#__PURE__*/React.createElement("img", {
      className: "mtw-user-avatar",
      src: "assets/avatar-katy.jpg",
      alt: "Dr. Katie Smith"
    }));
  }

  /* Shell: sidebar + header around a page. `solo` drops the chrome (live session). */
  function Shell({
    active,
    title,
    sub,
    headerRight,
    className,
    children,
    solo
  }) {
    if (solo) return /*#__PURE__*/React.createElement("div", {
      className: "mtw-shell mtw-shell-solo" + (className ? " " + className : "")
    }, children);
    return /*#__PURE__*/React.createElement("div", {
      className: "mtw-shell" + (className ? " " + className : "")
    }, /*#__PURE__*/React.createElement(Sidebar, {
      active: active
    }), /*#__PURE__*/React.createElement("div", {
      className: "mtw-main"
    }, /*#__PURE__*/React.createElement(Header, {
      title: title || "Minute Taker",
      sub: sub,
      right: headerRight
    }), children));
  }
  window.PFMTW = {
    go,
    getParam,
    loadCtx,
    saveCtx,
    mergeCtx,
    fmtClock,
    todayLabel,
    greeting,
    PATIENTS,
    PATIENT_NAMES,
    BLANK_PATIENT,
    initials,
    toneFor,
    STATUS,
    Avatar,
    StatusPill,
    Seg,
    useToast,
    Sidebar,
    Header,
    Shell,
    routes
  };
})();
