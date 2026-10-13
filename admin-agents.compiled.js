/* ===========================================================================
   PROfinity — Admin · Agents
   Hub for the AI agents members see in the Agents catalogue (agents-data.js).
   Overview table at AdminAgents.html; one sub page per agent at
   AdminAgents.html?agent=<id> (also listed in the sidebar under Agents).
   Edits are saved to PFAgents.admin (localStorage "pf-admin-agents") and the
   member Agents page reflects them immediately. Suffixed -AGT.
   =========================================================================== */
const {
  useState: useStateAGT,
  useEffect: useEffectAGT,
  useMemo: useMemoAGT
} = React;
const PFA_A = window.PFAgents;
function goAGT(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function paramAGT(name) {
  try {
    return new URLSearchParams(window.location.search).get(name) || "";
  } catch (e) {
    return "";
  }
}

/* ------------------------------------------------------------- sidebar */
const AGT_NAV = [{
  icon: "lucide:layout-grid",
  label: "Dashboard",
  href: "AdminDashboard.html"
}, {
  icon: "lucide:user",
  label: "Users",
  href: "AdminUsers.html"
}, {
  icon: "lucide:file-text",
  label: "Posts Management",
  href: "AdminPostsManagement.html"
}, {
  icon: "lucide:layout-dashboard",
  label: "Content Moderation",
  href: "AdminModeration.html"
}, {
  icon: "lucide:life-buoy",
  label: "Service Requests",
  href: "AdminServiceRequests.html"
}, {
  icon: "lucide:shield-check",
  label: "Verification",
  href: "AdminVerification.html"
}, {
  icon: "lucide:users-round",
  label: "Agents",
  href: "AdminAgents.html",
  group: true
}, {
  icon: "lucide:calendar",
  label: "Events",
  href: "AdminEvents.html"
}, {
  icon: "lucide:map",
  label: "Product Mapping",
  href: "AdminProductMapping.html"
}, {
  icon: "lucide:bar-chart-3",
  label: "Analytics",
  href: "AdminAnalytics.html"
}, {
  icon: "lucide:smartphone",
  label: "App Versions",
  href: "AdminAppVersions.html"
}, {
  icon: "lucide:bell",
  label: "Push Notification",
  href: "AdminPushNotifications.html"
}, {
  icon: "lucide:badge-check",
  label: "Badges",
  href: "AdminBadges.html"
}, {
  icon: "lucide:clipboard-list",
  label: "Quizzes & Surveys",
  href: "AdminQuizEditor.html"
}, {
  icon: "lucide:trophy",
  label: "Loyalty & Gamification",
  href: "AdminActionsEditor.html",
  chevron: true
}, {
  icon: "lucide:scroll-text",
  label: "Points Ledger",
  href: "AdminAuditLedger.html"
}, {
  icon: "lucide:receipt-text",
  label: "Transactions",
  href: "AdminTransactions.html",
  chevron: true
}, {
  icon: "lucide:table-2",
  label: "Courses",
  href: "AdminCourses.html",
  chevron: true
}, {
  icon: "lucide:users",
  label: "Community",
  href: "AdminCommunity.html",
  chevron: true
}];
function agtShort(a) {
  return a.shortName || a.name;
}
function AGTSidebar({
  activeId
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "agt-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  })), AGT_NAV.map(item => {
    if (item.group) {
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: item.label
      }, /*#__PURE__*/React.createElement("button", {
        className: "agt-navitem" + (!activeId ? " is-active" : " is-parent"),
        type: "button",
        onClick: activeId ? () => goAGT(item.href) : undefined
      }, /*#__PURE__*/React.createElement("iconify-icon", {
        icon: item.icon
      }), /*#__PURE__*/React.createElement("span", null, item.label), /*#__PURE__*/React.createElement("span", {
        className: "agt-spacer"
      }), /*#__PURE__*/React.createElement("iconify-icon", {
        icon: "lucide:chevron-up",
        class: "agt-chev"
      })), /*#__PURE__*/React.createElement("div", {
        className: "agt-subnav"
      }, PFA_A.ALL.map(a => /*#__PURE__*/React.createElement("button", {
        key: a.id,
        className: "agt-subnav-item" + (a.id === activeId ? " is-active" : ""),
        type: "button",
        onClick: () => goAGT("AdminAgents.html?agent=" + a.id)
      }, /*#__PURE__*/React.createElement("span", {
        className: "agt-subdot is-" + (a.hidden ? "hidden" : a.status),
        "aria-hidden": "true"
      }), /*#__PURE__*/React.createElement("span", {
        className: "agt-subnav-text"
      }, agtShort(a))))));
    }
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "agt-navitem",
      type: "button",
      onClick: () => goAGT(item.href)
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "agt-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "agt-chev"
    })));
  }));
}
function AGTHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "agt-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "agt-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "agt-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "agt-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "agt-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "agt-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "agt-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "agt-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "agt-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ------------------------------------------------------------- helpers */
const AGT_BADGES = ["Included in Premium", "Included with Artcodes", "Included with membership", "Add-on"];
const AGT_TIERS = ["Confidence", "Mastery", "Freedom", "Sovereign"];
/* per-agent consoles that already exist elsewhere in the admin */
const AGT_CONSOLES = {
  minutes: [{
    label: "Minute Taker admin",
    sub: "Clinician accounts, consent and EMR connections",
    href: "MinuteTakerAdmin.html",
    icon: "lucide:settings-2"
  }, {
    label: "Usage & billing",
    sub: "Sessions, minutes transcribed and plan usage",
    href: "MinuteTakerUsage.html",
    icon: "lucide:gauge"
  }],
  coach: [{
    label: "Quizzes & Surveys",
    sub: "Questions Ava pulls into the feed and Get to know you",
    href: "AdminQuizEditor.html",
    icon: "lucide:clipboard-list"
  }, {
    label: "Success Paths",
    sub: "Skills and nudges Ava coaches towards",
    href: "AdminSuccessPaths.html",
    icon: "lucide:route"
  }]
};

/* deterministic mock numbers so each agent's page is stable between loads */
function seedAGT(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = h * 31 + str.charCodeAt(i) >>> 0;
  return h;
}
function statsAGT(a) {
  const h = seedAGT(a.id);
  const local = PFA_A.isWaiting(a.id) ? 1 : 0;
  if (a.status === "available") {
    const members = 180 + h % 420;
    return {
      members,
      sessions: members * (3 + h % 5),
      rating: (4.5 + h % 5 / 10).toFixed(1),
      waitlist: 0,
      trend: 4 + h % 19
    };
  }
  return {
    members: 0,
    sessions: 0,
    rating: null,
    waitlist: (a.waiting || 0) + local,
    trend: 2 + h % 14
  };
}
const AGT_NAMES = ["Dr Sarah Mitchell", "Dr Amira Hassan", "Nurse Jo Carter", "Dr Priya Shah", "Dr Ben Okafor", "Laura Kent RN", "Dr Hannah Lowe", "Dr Marcus Reid", "Dr Chloe Barnes", "Dr Omar Farouk"];
function recentWaitAGT(a) {
  const h = seedAGT(a.id + "w");
  return Array.from({
    length: 5
  }).map((_, i) => ({
    name: AGT_NAMES[(h + i * 3) % AGT_NAMES.length],
    when: ["2 min ago", "1 h ago", "Yesterday", "2 days ago", "4 days ago"][i],
    tier: AGT_TIERS[(h + i) % 2 + 1]
  }));
}
function AGTIcon({
  agent,
  size = 44
}) {
  const t = PFA_A.TONES[agent.tone] || PFA_A.TONES.purple;
  return /*#__PURE__*/React.createElement("span", {
    className: "agt-aicon",
    style: {
      width: size,
      height: size,
      background: t.bg,
      color: t.fg
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: agent.icon
  }));
}
function AGTStatusPill({
  agent
}) {
  if (agent.hidden) return /*#__PURE__*/React.createElement("span", {
    className: "agt-pill is-hidden"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:eye-off"
  }), "Hidden");
  if (agent.status === "available") return /*#__PURE__*/React.createElement("span", {
    className: "agt-pill is-live"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-pill-dot"
  }), "Live");
  return /*#__PURE__*/React.createElement("span", {
    className: "agt-pill is-soon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock"
  }), "Coming ", agent.eta || "soon");
}
function useToastAGT() {
  const [msg, setMsg] = useStateAGT(null);
  const show = m => {
    setMsg(m);
    window.clearTimeout(show.t);
    show.t = window.setTimeout(() => setMsg(null), 2400);
  };
  const node = /*#__PURE__*/React.createElement("div", {
    className: "agt-toast" + (msg ? " is-on" : ""),
    role: "status",
    "aria-live": "polite"
  }, msg && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check-circle-2"
  }), msg));
  return {
    show,
    node
  };
}

/* ------------------------------------------------------------- overview */
function AGTOverview({
  agents,
  onOpen
}) {
  const live = agents.filter(a => a.status === "available" && !a.hidden).length;
  const soon = agents.filter(a => a.status !== "available" && !a.hidden).length;
  const hidden = agents.filter(a => a.hidden).length;
  const waitlist = agents.reduce((n, a) => n + statsAGT(a).waitlist, 0);
  const [q, setQ] = useStateAGT("");
  const rows = agents.filter(a => !q.trim() || (a.name + " " + a.category).toLowerCase().includes(q.trim().toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "agt-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Agents"), /*#__PURE__*/React.createElement("p", null, "Everything members see in the Agents catalogue. Open an agent to edit its listing, availability, pricing and waitlist.")), /*#__PURE__*/React.createElement("div", {
    className: "agt-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "agt-btn agt-btn-outline-navy",
    type: "button",
    onClick: () => goAGT("Agent.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:external-link"
  }), "View member catalogue"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tiles"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-live"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:zap"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, live), /*#__PURE__*/React.createElement("span", null, "Live agents"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-soon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:clock"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, soon), /*#__PURE__*/React.createElement("span", null, "Coming soon"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-wait"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell-ring"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, waitlist.toLocaleString()), /*#__PURE__*/React.createElement("span", null, "Notify-me votes"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-hidden"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:eye-off"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, hidden), /*#__PURE__*/React.createElement("span", null, "Hidden from catalogue")))), /*#__PURE__*/React.createElement("div", {
    className: "agt-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-table-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Filter agents…",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("span", {
    className: "agt-table-count"
  }, rows.length, " of ", agents.length)), /*#__PURE__*/React.createElement("div", {
    className: "agt-row-grid agt-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "AGENT"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "CATEGORY"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "STATUS"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "ACCESS"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "USAGE"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  })), rows.map(a => {
    const st = statsAGT(a);
    return /*#__PURE__*/React.createElement("button", {
      key: a.id,
      type: "button",
      className: "agt-row-grid agt-trow" + (a.hidden ? " is-hidden" : ""),
      onClick: () => onOpen(a.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "agt-cell-agent"
    }, /*#__PURE__*/React.createElement(AGTIcon, {
      agent: a,
      size: 40
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, a.name), /*#__PURE__*/React.createElement("small", null, a.tagline))), /*#__PURE__*/React.createElement("span", {
      className: "agt-cell-muted"
    }, a.category), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(AGTStatusPill, {
      agent: a
    })), /*#__PURE__*/React.createElement("span", {
      className: "agt-cell-access"
    }, /*#__PURE__*/React.createElement("strong", null, a.badge), /*#__PURE__*/React.createElement("small", null, a.price)), /*#__PURE__*/React.createElement("span", {
      className: "agt-cell-usage"
    }, a.status === "available" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, st.members), /*#__PURE__*/React.createElement("small", null, "members · ", st.sessions.toLocaleString(), " sessions")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, st.waitlist), /*#__PURE__*/React.createElement("small", null, "waiting · +", st.trend, "% this week"))), /*#__PURE__*/React.createElement("span", {
      className: "agt-cell-go"
    }, PFA_A.admin.isEdited(a.id) && /*#__PURE__*/React.createElement("span", {
      className: "agt-edited"
    }, "Edited"), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-right"
    })));
  }), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "agt-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-empty-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search-x"
  })), /*#__PURE__*/React.createElement("p", {
    className: "agt-empty-text"
  }, "No agents match that filter."))));
}

/* ------------------------------------------------------------- agent page */
function pickAGT(a) {
  const d = {};
  PFA_A.admin.EDITABLE.forEach(k => {
    d[k] = a[k] === undefined ? k === "hidden" || k === "featured" ? false : k === "bullets" ? [] : "" : a[k];
  });
  d.bullets = (d.bullets || []).slice();
  while (d.bullets.length < 3) d.bullets.push("");
  return d;
}
function AGTAgentPage({
  agent,
  toast,
  onSaved
}) {
  const [draft, setDraft] = useStateAGT(() => pickAGT(agent));
  const [savedAt, setSavedAt] = useStateAGT(null);
  useEffectAGT(() => {
    setDraft(pickAGT(agent));
  }, [agent.id]);
  const clean = useMemoAGT(() => pickAGT(agent), [agent]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(clean);
  const edited = PFA_A.admin.isEdited(agent.id);
  const st = statsAGT(agent);
  const consoles = AGT_CONSOLES[agent.id] || [];
  const set = k => e => setDraft({
    ...draft,
    [k]: e && e.target ? e.target.type === "checkbox" ? e.target.checked : e.target.value : e
  });
  const setBullet = i => e => {
    const b = draft.bullets.slice();
    b[i] = e.target.value;
    setDraft({
      ...draft,
      bullets: b
    });
  };
  function save() {
    const patch = {
      ...draft,
      bullets: draft.bullets.filter(x => x.trim())
    };
    PFA_A.admin.save(agent.id, patch);
    setSavedAt(new Date());
    toast.show("Saved · members see this immediately");
    onSaved();
  }
  function reset() {
    PFA_A.admin.reset(agent.id);
    toast.show("Reset to the default listing");
    onSaved();
  }
  const memberHref = agent.href ? agent.href.web : "Agent.html";
  return /*#__PURE__*/React.createElement("div", {
    className: "agt-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-crumbs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => goAGT("AdminAgents.html")
  }, "Agents"), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  }), /*#__PURE__*/React.createElement("span", null, agtShort(agent))), /*#__PURE__*/React.createElement("div", {
    className: "agt-page-head agt-agent-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-agent-id"
  }, /*#__PURE__*/React.createElement(AGTIcon, {
    agent: agent,
    size: 56
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, draft.name || agent.name), /*#__PURE__*/React.createElement("p", null, agent.category, " · ", /*#__PURE__*/React.createElement(AGTStatusPill, {
    agent: {
      ...agent,
      status: draft.status,
      eta: draft.eta,
      hidden: draft.hidden
    }
  }), edited && /*#__PURE__*/React.createElement("span", {
    className: "agt-edited"
  }, "Edited")))), /*#__PURE__*/React.createElement("div", {
    className: "agt-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "agt-btn agt-btn-outline-navy",
    type: "button",
    onClick: () => goAGT(memberHref)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:external-link"
  }), "Open member view"), edited && /*#__PURE__*/React.createElement("button", {
    className: "agt-btn agt-btn-ghost",
    type: "button",
    onClick: reset
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:rotate-ccw"
  }), "Reset"), /*#__PURE__*/React.createElement("button", {
    className: "agt-btn agt-btn-primary",
    type: "button",
    onClick: save,
    disabled: !dirty
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), dirty ? "Save changes" : savedAt ? "Saved" : "No changes"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-col-main"
  }, /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:text"
  }), "Listing"), /*#__PURE__*/React.createElement("span", {
    className: "agt-card-sub"
  }, "What members read on the catalogue card and detail sheet")), /*#__PURE__*/React.createElement("div", {
    className: "agt-form-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "agt-field"
  }, /*#__PURE__*/React.createElement("span", null, "Name"), /*#__PURE__*/React.createElement("input", {
    value: draft.name,
    onChange: set("name")
  })), /*#__PURE__*/React.createElement("label", {
    className: "agt-field"
  }, /*#__PURE__*/React.createElement("span", null, "Short name ", /*#__PURE__*/React.createElement("small", null, "shown on compact cards")), /*#__PURE__*/React.createElement("input", {
    value: draft.shortName,
    placeholder: agent.name,
    onChange: set("shortName")
  })), /*#__PURE__*/React.createElement("label", {
    className: "agt-field agt-span-2"
  }, /*#__PURE__*/React.createElement("span", null, "Tagline"), /*#__PURE__*/React.createElement("input", {
    value: draft.tagline,
    onChange: set("tagline")
  })), /*#__PURE__*/React.createElement("label", {
    className: "agt-field agt-span-2"
  }, /*#__PURE__*/React.createElement("span", null, "Description"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: draft.description,
    onChange: set("description")
  })), draft.bullets.slice(0, 3).map((b, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    className: "agt-field" + (i === 2 ? " agt-span-2" : "")
  }, /*#__PURE__*/React.createElement("span", null, "Highlight ", i + 1), /*#__PURE__*/React.createElement("input", {
    value: b,
    onChange: setBullet(i)
  }))), /*#__PURE__*/React.createElement("label", {
    className: "agt-field"
  }, /*#__PURE__*/React.createElement("span", null, "Best for"), /*#__PURE__*/React.createElement("input", {
    value: draft.bestFor,
    onChange: set("bestFor")
  })), /*#__PURE__*/React.createElement("label", {
    className: "agt-field"
  }, /*#__PURE__*/React.createElement("span", null, "Button label ", /*#__PURE__*/React.createElement("small", null, "live agents only")), /*#__PURE__*/React.createElement("input", {
    value: draft.cta,
    placeholder: "Open " + agent.name,
    onChange: set("cta")
  })))), /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:toggle-right"
  }), "Availability"), /*#__PURE__*/React.createElement("span", {
    className: "agt-card-sub"
  }, "Controls which card members get and whether the agent can be opened")), /*#__PURE__*/React.createElement("div", {
    className: "agt-radios"
  }, [{
    v: "available",
    t: "Live",
    s: "Members can open the agent now. Shown with the dark spotlight card."
  }, {
    v: "soon",
    t: "Coming soon",
    s: "Shown with a Notify me button and the release window below."
  }].map(o => /*#__PURE__*/React.createElement("label", {
    key: o.v,
    className: "agt-radio" + (draft.status === o.v ? " is-on" : "")
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "status",
    value: o.v,
    checked: draft.status === o.v,
    onChange: () => setDraft({
      ...draft,
      status: o.v
    })
  }), /*#__PURE__*/React.createElement("span", {
    className: "agt-radio-mark"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, o.t), /*#__PURE__*/React.createElement("small", null, o.s))))), /*#__PURE__*/React.createElement("div", {
    className: "agt-form-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "agt-field"
  }, /*#__PURE__*/React.createElement("span", null, "Release window ", /*#__PURE__*/React.createElement("small", null, "coming soon only")), /*#__PURE__*/React.createElement("input", {
    value: draft.eta,
    placeholder: "e.g. Spring 2026",
    disabled: draft.status === "available",
    onChange: set("eta")
  })), /*#__PURE__*/React.createElement("div", {
    className: "agt-switches"
  }, /*#__PURE__*/React.createElement("label", {
    className: "agt-switch"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Featured"), /*#__PURE__*/React.createElement("small", null, "Pinned to the top row of the catalogue")), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!draft.featured,
    onChange: set("featured")
  }), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("label", {
    className: "agt-switch"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Hidden from catalogue"), /*#__PURE__*/React.createElement("small", null, "Members cannot see or open it")), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!draft.hidden,
    onChange: set("hidden")
  }), /*#__PURE__*/React.createElement("i", null))))), /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:badge-pound-sterling"
  }), "Pricing & access"), /*#__PURE__*/React.createElement("span", {
    className: "agt-card-sub"
  }, "The badge on the card and the price line under it")), /*#__PURE__*/React.createElement("div", {
    className: "agt-form-grid"
  }, /*#__PURE__*/React.createElement("label", {
    className: "agt-field"
  }, /*#__PURE__*/React.createElement("span", null, "Access badge"), /*#__PURE__*/React.createElement("select", {
    value: draft.badge,
    onChange: set("badge")
  }, AGT_BADGES.map(b => /*#__PURE__*/React.createElement("option", {
    key: b,
    value: b
  }, b)))), /*#__PURE__*/React.createElement("label", {
    className: "agt-field"
  }, /*#__PURE__*/React.createElement("span", null, "Price line"), /*#__PURE__*/React.createElement("input", {
    value: draft.price,
    placeholder: "e.g. Starts at £57/mo",
    onChange: set("price")
  })), /*#__PURE__*/React.createElement("div", {
    className: "agt-field agt-span-2"
  }, /*#__PURE__*/React.createElement("span", null, "Included for tiers"), /*#__PURE__*/React.createElement("div", {
    className: "agt-chips"
  }, AGT_TIERS.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "agt-chip" + (i >= 1 ? " is-on" : "")
  }, i >= 1 && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  }), t))), /*#__PURE__*/React.createElement("small", {
    className: "agt-help"
  }, "Tier inclusion follows the membership ladder in Loyalty & Gamification. Change it there."))))), /*#__PURE__*/React.createElement("div", {
    className: "agt-col-side"
  }, /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:activity"
  }), agent.status === "available" ? "Usage · 30 days" : "Waitlist")), agent.status === "available" ? /*#__PURE__*/React.createElement("div", {
    className: "agt-stats"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, st.members), /*#__PURE__*/React.createElement("span", null, "Active members")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, st.sessions.toLocaleString()), /*#__PURE__*/React.createElement("span", null, "Sessions")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, st.rating, /*#__PURE__*/React.createElement("em", null, "/5")), /*#__PURE__*/React.createElement("span", null, "Avg. rating")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "is-up"
  }, "+", st.trend, "%"), /*#__PURE__*/React.createElement("span", null, "vs last month"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "agt-stats agt-stats-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, st.waitlist), /*#__PURE__*/React.createElement("span", null, "Notify-me votes")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "is-up"
  }, "+", st.trend, "%"), /*#__PURE__*/React.createElement("span", null, "this week"))), /*#__PURE__*/React.createElement("ul", {
    className: "agt-waitlist"
  }, recentWaitAGT(agent).map(w => /*#__PURE__*/React.createElement("li", {
    key: w.name
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-wava"
  }, w.name.replace(/^(Dr|Nurse)\s+/, "").split(" ").map(p => p[0]).join("").slice(0, 2)), /*#__PURE__*/React.createElement("span", {
    className: "agt-wname"
  }, w.name, /*#__PURE__*/React.createElement("small", null, w.tier, " · ", w.when))))), /*#__PURE__*/React.createElement("button", {
    className: "agt-btn agt-btn-outline-navy agt-btn-block",
    type: "button",
    onClick: () => goAGT("AdminPushNotifications.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:send"
  }), "Notify the waitlist"))), consoles.length > 0 && /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:layout-panel-left"
  }), "Agent console")), /*#__PURE__*/React.createElement("div", {
    className: "agt-links"
  }, consoles.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.href,
    type: "button",
    className: "agt-link",
    onClick: () => goAGT(c.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-link-ic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: c.icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "agt-link-text"
  }, /*#__PURE__*/React.createElement("strong", null, c.label), /*#__PURE__*/React.createElement("small", null, c.sub)), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-up-right"
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:link"
  }), "Member links")), /*#__PURE__*/React.createElement("div", {
    className: "agt-links"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "agt-link",
    onClick: () => goAGT("Agent.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-link-ic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:monitor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "agt-link-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Web catalogue"), /*#__PURE__*/React.createElement("small", null, "Agent.html")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-up-right"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "agt-link",
    onClick: () => goAGT("AgentMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-link-ic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:smartphone"
  })), /*#__PURE__*/React.createElement("span", {
    className: "agt-link-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Mobile catalogue"), /*#__PURE__*/React.createElement("small", null, "AgentMobile.html")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-up-right"
  })), agent.href && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "agt-link",
    onClick: () => goAGT(agent.href.web)
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-link-ic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: agent.icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "agt-link-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Open ", agtShort(agent)), /*#__PURE__*/React.createElement("small", null, agent.href.web)), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-up-right"
  })))))));
}

/* ------------------------------------------------------------- data-only agent pages (user: Minute Taker shows data, not listing forms) */
const AGT_DATA_ONLY = ["minutes"];
const AGT_PERIODS = [{
  key: "7",
  label: "7 days",
  days: 7
}, {
  key: "30",
  label: "30 days",
  days: 30
}, {
  key: "90",
  label: "90 days",
  days: 90
}];
function rngAGT(seed) {
  let x = seed || 1;
  return () => {
    x = x * 1664525 + 1013904223 >>> 0;
    return x / 4294967296;
  };
}
function fmtDayAGT(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short"
  });
}
function seriesAGT(id, days) {
  const r = rngAGT(seedAGT(id + ":" + days));
  return Array.from({
    length: days
  }).map((_, i) => {
    const daysAgo = days - 1 - i;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const wk = d.getDay() === 0 || d.getDay() === 6;
    const base = wk ? 14 : 44;
    return {
      daysAgo,
      label: fmtDayAGT(daysAgo),
      value: Math.round(base + r() * (wk ? 10 : 26))
    };
  });
}
const AGT_CLINICIANS = ["Dr Katie Smith", "Dr Sarah Mitchell", "Nurse Jo Carter", "Dr Amira Hassan", "Dr Ben Okafor", "Laura Kent RN"];
const AGT_SESSION_TYPES = ["Injectables follow-up", "New patient consult", "Post-op review", "Skin consult", "Acne protocol", "Rosacea review", "Team meeting"];
function AGTBarChart({
  data
}) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  const ticks = [0, Math.round(max / 2), max];
  const every = data.length > 31 ? 15 : data.length > 7 ? 7 : 1;
  return /*#__PURE__*/React.createElement("div", {
    className: "agt-chart",
    role: "img",
    "aria-label": "Sessions per day for the last " + data.length + " days"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-chart-y"
  }, ticks.slice().reverse().map(t => /*#__PURE__*/React.createElement("span", {
    key: t
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "agt-chart-plot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-chart-grid"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "agt-chart-bars"
  }, data.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.daysAgo,
    className: "agt-bar-slot",
    tabIndex: 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "agt-bar",
    style: {
      height: Math.max(2, Math.round(100 * d.value / max)) + "%"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "agt-bar-tip"
  }, /*#__PURE__*/React.createElement("strong", null, d.value, " sessions"), d.label)))), /*#__PURE__*/React.createElement("div", {
    className: "agt-chart-x"
  }, data.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: d.daysAgo
  }, i % every === 0 || i === data.length - 1 && i % every >= 3 ? d.label : "")))));
}
function AGTAgentData({
  agent
}) {
  const [period, setPeriod] = useStateAGT("30");
  const days = AGT_PERIODS.find(p => p.key === period).days;
  const data = useMemoAGT(() => seriesAGT(agent.id, days), [agent.id, days]);
  const sessions = data.reduce((n, d) => n + d.value, 0);
  const h = seedAGT(agent.id);
  const clinicians = 24 + h % 30;
  const minutes = sessions * 31;
  const saved = Math.round(sessions * 0.82),
    ready = Math.round(sessions * 0.09),
    processing = Math.round(sessions * 0.03),
    archived = Math.round(sessions * 0.41);
  const avgWrite = "1m 54s",
    voice = "98%";
  const formats = [{
    k: "Assessment",
    v: 58
  }, {
    k: "Data",
    v: 27
  }, {
    k: "Summary",
    v: 15
  }];
  const r = rngAGT(h + days);
  const top = AGT_CLINICIANS.map((c, i) => ({
    name: c,
    sessions: Math.round(sessions * (0.3 - i * 0.045) * (0.9 + r() * 0.2)),
    write: (() => {
      const sec = Math.round(60 + r() * 100);
      return Math.floor(sec / 60) + "m " + String(sec % 60).padStart(2, "0") + "s";
    })(),
    saved: 78 + Math.round(r() * 18)
  })).sort((a, b) => b.sessions - a.sessions);
  const recent = Array.from({
    length: 8
  }).map((_, i) => ({
    when: ["Just now", "12 min ago", "48 min ago", "2 h ago", "3 h ago", "Yesterday 16:15", "Yesterday 14:00", "Yesterday 09:30"][i],
    clinician: AGT_CLINICIANS[(h + i) % AGT_CLINICIANS.length],
    patient: "MT-" + (77000 + h * (i + 3) % 900),
    type: AGT_SESSION_TYPES[(h + i * 2) % AGT_SESSION_TYPES.length],
    dur: 18 + h * (i + 1) % 40 + " min",
    status: i === 0 ? "Processing" : i < 3 ? "Note ready" : "Saved to EMR"
  }));
  const consoles = AGT_CONSOLES[agent.id] || [];
  const memberHref = agent.href ? agent.href.web : "Agent.html";
  const funnel = [{
    k: "Recorded",
    v: sessions
  }, {
    k: "Note written",
    v: saved + ready
  }, {
    k: "Saved to EMR",
    v: saved
  }, {
    k: "Archived",
    v: archived
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "agt-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-crumbs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => goAGT("AdminAgents.html")
  }, "Agents"), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  }), /*#__PURE__*/React.createElement("span", null, agtShort(agent))), /*#__PURE__*/React.createElement("div", {
    className: "agt-page-head agt-agent-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-agent-id"
  }, /*#__PURE__*/React.createElement(AGTIcon, {
    agent: agent,
    size: 56
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, agent.name), /*#__PURE__*/React.createElement("p", null, agent.category, " · ", /*#__PURE__*/React.createElement(AGTStatusPill, {
    agent: agent
  }), /*#__PURE__*/React.createElement("span", {
    className: "agt-cell-muted"
  }, "Usage data · updates every few minutes")))), /*#__PURE__*/React.createElement("div", {
    className: "agt-page-head-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-seg",
    role: "tablist",
    "aria-label": "Period"
  }, AGT_PERIODS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.key,
    type: "button",
    role: "tab",
    "aria-selected": period === p.key,
    className: "agt-seg-btn" + (period === p.key ? " is-on" : ""),
    onClick: () => setPeriod(p.key)
  }, p.label))), /*#__PURE__*/React.createElement("button", {
    className: "agt-btn agt-btn-outline-navy",
    type: "button",
    onClick: () => goAGT(memberHref)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:external-link"
  }), "Open member view"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tiles agt-tiles-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-live"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:users"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, clinicians), /*#__PURE__*/React.createElement("span", null, "Active clinicians"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-wait"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:mic"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, sessions.toLocaleString()), /*#__PURE__*/React.createElement("span", null, "Sessions"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-wait"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:audio-lines"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, (minutes / 60).toFixed(0), /*#__PURE__*/React.createElement("em", null, " h")), /*#__PURE__*/React.createElement("span", null, "Audio transcribed"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-live"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:file-check-2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, saved.toLocaleString()), /*#__PURE__*/React.createElement("span", null, "Notes saved to EMR"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-soon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:timer"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, avgWrite), /*#__PURE__*/React.createElement("span", null, "Avg. write-up"))), /*#__PURE__*/React.createElement("div", {
    className: "agt-tile"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-tile-ic is-live"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:shield-check"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, voice), /*#__PURE__*/React.createElement("span", null, "Voice match")))), /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bar-chart-3"
  }), "Sessions per day"), /*#__PURE__*/React.createElement("span", {
    className: "agt-card-sub"
  }, sessions.toLocaleString(), " in the last ", days, " days · weekends run lighter")), /*#__PURE__*/React.createElement(AGTBarChart, {
    data: data
  })), /*#__PURE__*/React.createElement("div", {
    className: "agt-grid agt-grid-even"
  }, /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:filter"
  }), "Note pipeline"), /*#__PURE__*/React.createElement("span", {
    className: "agt-card-sub"
  }, processing, " still being written")), /*#__PURE__*/React.createElement("div", {
    className: "agt-funnel"
  }, funnel.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.k,
    className: "agt-funnel-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-funnel-label"
  }, f.k), /*#__PURE__*/React.createElement("span", {
    className: "agt-funnel-track"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: Math.round(100 * f.v / (sessions || 1)) + "%"
    }
  })), /*#__PURE__*/React.createElement("strong", null, f.v.toLocaleString()), /*#__PURE__*/React.createElement("small", null, Math.round(100 * f.v / (sessions || 1)), "%"))))), /*#__PURE__*/React.createElement("section", {
    className: "agt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:layout-list"
  }), "Note formats"), /*#__PURE__*/React.createElement("span", {
    className: "agt-card-sub"
  }, "Format chosen when the note was saved")), /*#__PURE__*/React.createElement("div", {
    className: "agt-funnel"
  }, formats.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.k,
    className: "agt-funnel-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-funnel-label"
  }, f.k), /*#__PURE__*/React.createElement("span", {
    className: "agt-funnel-track"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: f.v + "%"
    }
  })), /*#__PURE__*/React.createElement("strong", null, Math.round(saved * f.v / 100).toLocaleString()), /*#__PURE__*/React.createElement("small", null, f.v, "%")))), consoles.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "agt-links agt-links-inline"
  }, consoles.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.href,
    type: "button",
    className: "agt-link",
    onClick: () => goAGT(c.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-link-ic"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: c.icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "agt-link-text"
  }, /*#__PURE__*/React.createElement("strong", null, c.label), /*#__PURE__*/React.createElement("small", null, c.sub)), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:arrow-up-right"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "agt-grid agt-grid-even"
  }, /*#__PURE__*/React.createElement("section", {
    className: "agt-card agt-card-flush"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head agt-card-head-pad"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), "Top clinicians")), /*#__PURE__*/React.createElement("div", {
    className: "agt-row-grid agt-thead agt-grid-clin"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "CLINICIAN"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "SESSIONS"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "AVG. WRITE-UP"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "SAVED")), top.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    className: "agt-row-grid agt-grid-clin agt-drow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-cell-agent"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-wava"
  }, c.name.replace(/^(Dr|Nurse)\s+/, "").split(" ").map(p => p[0]).join("").slice(0, 2)), /*#__PURE__*/React.createElement("strong", null, c.name)), /*#__PURE__*/React.createElement("span", {
    className: "agt-cell-muted"
  }, c.sessions), /*#__PURE__*/React.createElement("span", {
    className: "agt-cell-muted"
  }, c.write), /*#__PURE__*/React.createElement("span", {
    className: "agt-cell-muted"
  }, c.saved, "%")))), /*#__PURE__*/React.createElement("section", {
    className: "agt-card agt-card-flush"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-card-head agt-card-head-pad"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-card-title"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:history"
  }), "Recent sessions"), /*#__PURE__*/React.createElement("span", {
    className: "agt-card-sub"
  }, "Patient IDs only · no clinical content")), /*#__PURE__*/React.createElement("div", {
    className: "agt-row-grid agt-thead agt-grid-recent"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "WHEN"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "CLINICIAN"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "SESSION"), /*#__PURE__*/React.createElement("span", {
    className: "agt-th"
  }, "STATUS")), recent.map((x, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "agt-row-grid agt-grid-recent agt-drow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-cell-muted"
  }, x.when), /*#__PURE__*/React.createElement("span", {
    className: "agt-cell-access"
  }, /*#__PURE__*/React.createElement("strong", null, x.clinician), /*#__PURE__*/React.createElement("small", null, x.patient, " · ", x.dur)), /*#__PURE__*/React.createElement("span", {
    className: "agt-cell-muted"
  }, x.type), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "agt-pill " + (x.status === "Saved to EMR" ? "is-live" : x.status === "Note ready" ? "is-soon" : "is-hidden")
  }, x.status)))))));
}

/* ------------------------------------------------------------- root */
function AGTRoot() {
  const toast = useToastAGT();
  const [tick, setTick] = useStateAGT(0);
  const activeId = paramAGT("agent");
  const agent = activeId ? PFA_A.byId(activeId) : null;
  const agents = PFA_A.ALL.slice();
  return /*#__PURE__*/React.createElement("div", {
    className: "agt-shell"
  }, /*#__PURE__*/React.createElement(AGTSidebar, {
    activeId: agent ? agent.id : ""
  }), /*#__PURE__*/React.createElement("main", {
    className: "agt-main"
  }, /*#__PURE__*/React.createElement(AGTHeader, {
    title: agent ? "Agents · " + agtShort(agent) : "Agents"
  }), /*#__PURE__*/React.createElement("div", {
    className: "agt-content"
  }, agent ? AGT_DATA_ONLY.includes(agent.id) ? /*#__PURE__*/React.createElement(AGTAgentData, {
    key: agent.id,
    agent: agent
  }) : /*#__PURE__*/React.createElement(AGTAgentPage, {
    key: agent.id + ":" + tick,
    agent: agent,
    toast: toast,
    onSaved: () => setTick(t => t + 1)
  }) : activeId ? /*#__PURE__*/React.createElement("div", {
    className: "agt-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agt-empty"
  }, /*#__PURE__*/React.createElement("span", {
    className: "agt-empty-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bot-off"
  })), /*#__PURE__*/React.createElement("p", {
    className: "agt-empty-text"
  }, "No agent called \"", activeId, "\"."), /*#__PURE__*/React.createElement("button", {
    className: "agt-btn agt-btn-outline-navy",
    type: "button",
    onClick: () => goAGT("AdminAgents.html")
  }, "Back to Agents"))) : /*#__PURE__*/React.createElement(AGTOverview, {
    agents: agents,
    onOpen: id => goAGT("AdminAgents.html?agent=" + id)
  }))), toast.node);
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AGTRoot, null));
