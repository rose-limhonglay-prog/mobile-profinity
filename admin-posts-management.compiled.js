/* ===========================================================================
   PROfinity — Admin · Posts Management (desktop console)
   Search / filter / paginate every community post, toggle pin, feature and
   visibility per row, and create new posts. Shares the sidebar/header shell
   pattern with admin-push-notifications.jsx. Suffixed -APM to avoid
   global-scope clashes.
   =========================================================================== */
const {
  useState: useStateAPM,
  useMemo: useMemoAPM,
  useEffect: useEffectAPM
} = React;
function apmGoTo(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ------------------------------------------------------------- sidebar */
const APM_NAV = [{
  icon: "lucide:layout-grid",
  label: "Dashboard"
}, {
  icon: "lucide:user",
  label: "Users"
}, {
  icon: "lucide:file-text",
  label: "Posts Management",
  active: true
}, {
  icon: "lucide:layout-dashboard",
  label: "Content Moderation"
}, {
  icon: "lucide:book-open",
  label: "Science Articles"
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
  label: "Events"
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
const APM_NAV_LINKS = {
  "Posts Management": "AdminPostsManagement.html",
  "Push Notification": "AdminPushNotifications.html"
};
function APMSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "apm-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), APM_NAV.map(item => {
    const href = APM_NAV_LINKS[item.label];
    return /*#__PURE__*/React.createElement("button", {
      key: item.label,
      className: "apm-navitem" + (item.active ? " is-active" : ""),
      type: "button",
      onClick: href && !item.active ? () => apmGoTo(href) : undefined
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: item.icon
    }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "apm-spacer"
    }), /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:chevron-down",
      class: "apm-chev"
    })));
  }));
}
function APMHeader() {
  return /*#__PURE__*/React.createElement("header", {
    className: "apm-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apm-header-title"
  }, "Posts Management"), /*#__PURE__*/React.createElement("div", {
    className: "apm-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "apm-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "apm-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "apm-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "apm-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "apm-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "apm-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ----------------------------------------------------------------- data */
const APM_TYPES = ["Scheduled", "Real-time", "Published", "Poll", "Quiz"];
const APM_TYPE_META = {
  Scheduled: {
    icon: "lucide:clock",
    color: "var(--premium-orange)",
    bg: "var(--warning-bg)"
  },
  "Real-time": {
    icon: "lucide:zap",
    color: "var(--success)",
    bg: "var(--success-bg)"
  },
  Published: {
    icon: "lucide:check",
    color: "var(--info)",
    bg: "var(--info-bg)"
  },
  Poll: {
    icon: "lucide:bar-chart-2",
    color: "var(--ai-purple)",
    bg: "var(--ai-purple-100)"
  },
  Quiz: {
    icon: "lucide:award",
    color: "var(--ai-purple)",
    bg: "var(--ai-purple-100)"
  }
};
const APM_STATUS_META = {
  Visible: {
    color: "var(--success)",
    bg: "var(--success-bg)"
  },
  Hidden: {
    color: "var(--gray-500)",
    bg: "var(--gray-100)"
  }
};
const APM_CATEGORIES = ["General", "Case Study", "Protocol", "Discussion", "Masterclass", "Business", "Anatomy", "Patient", "Clinic", "Healthcare", "Community"];
const APM_AUDIENCE_OPTS = ["Everyone", "Members Only", "Patients Only", "Clinicians Only", "Only Me"];
const APM_POST_CATEGORIES = ["Protocol", "Case Study", "Discussion", "Masterclass", "Business", "Anatomy", "Patient", "Clinic", "Healthcare", "Community"];
const APM_POST_TOPICS = ["Exercise", "Diet", "Sleep", "Recovery", "Regenerative Therapy (Clinic)", "Regenerative Therapy (Home)", "Social Connection", "Supplement & Medication"];
const APM_BASE_POSTS = [{
  id: "e3e332bb",
  title: "Needle or cannula?",
  content: "Needle or cannula?",
  category: "General",
  type: "Scheduled",
  created: "Yesterday",
  scheduled: "23 Jul 2026 · 11:43 BST",
  status: "Visible"
}, {
  id: "44040562",
  title: "✨ Great Cheek Filler Start…",
  content: "✨ Great Cheek Filler Starts Before The Needle",
  category: "General",
  type: "Scheduled",
  created: "Yesterday",
  scheduled: "22 Jul 2026 · 20:42 BST",
  status: "Visible"
}, {
  id: "9ea3a8fe",
  title: "Lip filler migration isn't just a…",
  content: "Lip filler migration isn't just about how much filler you use",
  category: "General",
  type: "Scheduled",
  created: "Yesterday",
  scheduled: "22 Jul 2026 · 11:40 BST",
  status: "Visible"
}, {
  id: "05c421b3",
  title: "⚠ Temple Filler: Is Your \"Sa…",
  content: "⚠ Temple Filler: Is Your \"Safer\" Technique Creating New Risk?",
  category: "General",
  type: "Scheduled",
  created: "Yesterday",
  scheduled: "21 Jul 2026 · 20:37 BST",
  status: "Visible"
}, {
  id: "71092768",
  title: "One of the biggest mistakes i…",
  content: "One of the biggest mistakes in aesthetics…",
  category: "General",
  type: "Real-time",
  created: "Yesterday",
  scheduled: "—",
  status: "Visible"
}, {
  id: "a1b2c3d4",
  title: "Understanding tear trough anatomy",
  content: "A quick guide to safe tear trough treatment…",
  category: "Anatomy",
  type: "Published",
  created: "2 days ago",
  scheduled: "20 Jul 2026 · 09:15 BST",
  status: "Visible"
}, {
  id: "f5e6d7c8",
  title: "Poll: Which cannula gauge do you prefer?",
  content: "Poll: Which cannula gauge do you prefer?",
  category: "Discussion",
  type: "Poll",
  created: "3 days ago",
  scheduled: "19 Jul 2026 · 14:02 BST",
  status: "Visible"
}, {
  id: "c3d4e5f6",
  title: "Quiz: Which dermal layer do fillers target?",
  content: "Quiz: Which dermal layer do fillers target?",
  category: "Masterclass",
  type: "Quiz",
  created: "5 days ago",
  scheduled: "17 Jul 2026 · 13:30 BST",
  status: "Visible"
}, {
  id: "b7a8c9d0",
  title: "Case Study: Correcting Asymmetric Marionette Lines",
  content: "A step-by-step breakdown of a corrective marionette line case.",
  category: "Case Study",
  type: "Published",
  created: "1 week ago",
  scheduled: "16 Jul 2026 · 10:00 BST",
  status: "Visible"
}, {
  id: "d1e2f3a4",
  title: "New consent form templates now live",
  content: "Updated consent templates covering the latest MHRA guidance.",
  category: "Protocol",
  type: "Published",
  created: "1 week ago",
  scheduled: "15 Jul 2026 · 08:30 BST",
  status: "Visible"
}, {
  id: "e5f6a7b8",
  title: "Reminder: CPD hours are due end of month",
  content: "Make sure your CPD log is up to date before the deadline.",
  category: "Business",
  type: "Real-time",
  created: "1 week ago",
  scheduled: "—",
  status: "Visible"
}, {
  id: "a9b0c1d2",
  title: "Managing vascular occlusion — a refresher",
  content: "Recognising early signs and the emergency response protocol.",
  category: "Protocol",
  type: "Scheduled",
  created: "8 Jul 2026",
  scheduled: "24 Jul 2026 · 09:00 BST",
  status: "Visible"
}, {
  id: "c3d4e5a6",
  title: "Poll: Your go-to product for tear troughs?",
  content: "Poll: Your go-to product for tear troughs?",
  category: "Discussion",
  type: "Poll",
  created: "6 Jul 2026",
  scheduled: "14 Jul 2026 · 16:20 BST",
  status: "Hidden"
}, {
  id: "f7a8b9c0",
  title: "Reported: inappropriate promotional content",
  content: "Flagged by three members for unauthorised product promotion.",
  category: "Community",
  type: "Published",
  created: "5 Jul 2026",
  scheduled: "13 Jul 2026 · 12:00 BST",
  status: "Hidden"
}, {
  id: "b1c2d3e4",
  title: "Masterclass replay: Full Face Balancing",
  content: "Catch up on last week's live masterclass session.",
  category: "Masterclass",
  type: "Published",
  created: "3 Jul 2026",
  scheduled: "12 Jul 2026 · 18:00 BST",
  status: "Visible"
}, {
  id: "d5e6f7a8",
  title: "Patient consultation red flags checklist",
  content: "Ten warning signs to screen for before treatment.",
  category: "Patient",
  type: "Scheduled",
  created: "2 Jul 2026",
  scheduled: "25 Jul 2026 · 09:30 BST",
  status: "Visible"
}, {
  id: "e9f0a1b2",
  title: "Clinic spotlight: Converting consults to bookings",
  content: "How one member doubled their consult-to-booking rate.",
  category: "Clinic",
  type: "Real-time",
  created: "1 Jul 2026",
  scheduled: "—",
  status: "Visible"
}, {
  id: "a3b4c5d6",
  title: "Quiz: Anatomy of the mid-face",
  content: "Test your knowledge of mid-face anatomy.",
  category: "Anatomy",
  type: "Quiz",
  created: "29 Jun 2026",
  scheduled: "10 Jul 2026 · 11:00 BST",
  status: "Visible"
}, {
  id: "c7d8e9f0",
  title: "Healthcare compliance update: record keeping",
  content: "What's changing in patient record retention requirements.",
  category: "Healthcare",
  type: "Published",
  created: "28 Jun 2026",
  scheduled: "9 Jul 2026 · 09:00 BST",
  status: "Visible"
}, {
  id: "b3c4d5e6",
  title: "Business: pricing your first Botox clinic",
  content: "A pricing framework for practitioners just starting out.",
  category: "Business",
  type: "Scheduled",
  created: "26 Jun 2026",
  scheduled: "26 Jul 2026 · 10:00 BST",
  status: "Visible"
}, {
  id: "d9e0f1a2",
  title: "Discussion: cannula vs needle for tear troughs",
  content: "Share your preferred technique and why.",
  category: "Discussion",
  type: "Real-time",
  created: "24 Jun 2026",
  scheduled: "—",
  status: "Visible"
}, {
  id: "f1a2b3c4",
  title: "Community meetup — London, September",
  content: "Join fellow members for an evening of networking.",
  category: "Community",
  type: "Published",
  created: "22 Jun 2026",
  scheduled: "5 Jul 2026 · 19:00 BST",
  status: "Visible"
}, {
  id: "a5b6c7d8",
  title: "Case Study: Non-surgical rhinoplasty follow-up",
  content: "Six-month follow-up results and lessons learned.",
  category: "Case Study",
  type: "Published",
  created: "20 Jun 2026",
  scheduled: "2 Jul 2026 · 10:00 BST",
  status: "Hidden"
}, {
  id: "e1f2a3b4",
  title: "Poll: Best CPD topic for next quarter?",
  content: "Poll: Best CPD topic for next quarter?",
  category: "Discussion",
  type: "Poll",
  created: "18 Jun 2026",
  scheduled: "28 Jun 2026 · 15:00 BST",
  status: "Visible"
}];
const APM_EMPTY_DRAFT = () => ({
  tab: "post",
  audience: "Everyone",
  postCategory: "Protocol",
  content: "",
  topics: [],
  photos: [],
  video: null,
  qpType: "Poll",
  question: "",
  options: ["", ""],
  correctIndex: 0
});

/* ---------------------------------------------------------------- pills */
function APMTypePill({
  type
}) {
  const m = APM_TYPE_META[type] || APM_TYPE_META.Published;
  return /*#__PURE__*/React.createElement("div", {
    className: "apm-type-pill",
    style: {
      background: m.bg,
      color: m.color
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: m.icon
  }), /*#__PURE__*/React.createElement("span", null, type));
}
function APMStatusPill({
  status
}) {
  const m = APM_STATUS_META[status] || APM_STATUS_META.Visible;
  return /*#__PURE__*/React.createElement("div", {
    className: "apm-status-pill",
    style: {
      background: m.bg
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "apm-status-dot",
    style: {
      background: m.color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "apm-status-label",
    style: {
      color: m.color
    }
  }, status));
}

/* ---------------------------------------------------------------- table */
function APMRow({
  post,
  onTogglePin,
  onToggleFeature,
  onToggleVisibility
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "apm-row-grid apm-trow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apm-id-cell"
  }, post.id), /*#__PURE__*/React.createElement("div", {
    className: "apm-trow-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-trow-title-main"
  }, post.title), /*#__PURE__*/React.createElement("div", {
    className: "apm-trow-title-sub"
  }, post.content)), /*#__PURE__*/React.createElement("span", {
    className: "apm-cat-pill"
  }, post.category), /*#__PURE__*/React.createElement(APMTypePill, {
    type: post.type
  }), /*#__PURE__*/React.createElement("span", {
    className: "apm-meta-cell"
  }, post.created), /*#__PURE__*/React.createElement("span", {
    className: "apm-meta-cell"
  }, post.scheduled), /*#__PURE__*/React.createElement(APMStatusPill, {
    status: post.status
  }), /*#__PURE__*/React.createElement("div", {
    className: "apm-action-cell"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-action-btn" + (post.pinned ? " is-on" : ""),
    "aria-label": post.pinned ? "Unpin post" : "Pin post",
    onClick: () => onTogglePin(post.id)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pin"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-action-btn" + (post.featured ? " is-on" : ""),
    "aria-label": post.featured ? "Unfeature post" : "Feature post",
    onClick: () => onToggleFeature(post.id)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:home"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-action-btn" + (post.status === "Hidden" ? " is-danger" : ""),
    "aria-label": post.status === "Hidden" ? "Unhide post" : "Hide post",
    onClick: () => onToggleVisibility(post.id)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: post.status === "Hidden" ? "lucide:eye" : "lucide:eye-off"
  }))));
}

/* --------------------------------------------------------------- pill select */
function APMPillSelect({
  value,
  options,
  icon,
  onChange
}) {
  const [open, setOpen] = useStateAPM(false);
  useEffectAPM(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    className: "apm-pill-select",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-pill-select-btn",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: icon
  }), /*#__PURE__*/React.createElement("span", null, value), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down",
    style: {
      transition: "transform .15s",
      transform: open ? "rotate(180deg)" : "none"
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "apm-pill-select-menu",
    role: "listbox"
  }, options.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt,
    type: "button",
    role: "option",
    "aria-selected": opt === value,
    className: "apm-pill-select-opt" + (opt === value ? " is-active" : ""),
    onClick: () => {
      onChange(opt);
      setOpen(false);
    }
  }, opt))));
}

/* --------------------------------------------------------------- modal */
function APMCreateModal({
  onClose,
  onCreate
}) {
  const [draft, setDraft] = useStateAPM(APM_EMPTY_DRAFT);
  const set = patch => setDraft(st => ({
    ...st,
    ...patch
  }));
  const toggleTopic = t => setDraft(st => ({
    ...st,
    topics: st.topics.includes(t) ? st.topics.filter(x => x !== t) : [...st.topics, t]
  }));
  const addPhoto = dataUrl => setDraft(st => ({
    ...st,
    photos: [...st.photos, dataUrl].slice(0, 4)
  }));
  const removePhoto = i => setDraft(st => ({
    ...st,
    photos: st.photos.filter((_, j) => j !== i)
  }));
  const removeVideo = () => setDraft(st => ({
    ...st,
    video: null
  }));
  const pickFile = (accept, capture) => new Promise(resolve => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    if (capture) input.capture = capture;
    input.onchange = e => resolve((e.target.files || [])[0] || null);
    input.click();
  });
  const readAsDataUrl = file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
  const handlePhotoPick = async () => {
    const file = await pickFile("image/*");
    if (!file) return;
    addPhoto(await readAsDataUrl(file));
  };
  const handleCameraPick = async () => {
    const file = await pickFile("image/*", "environment");
    if (!file) return;
    addPhoto(await readAsDataUrl(file));
  };
  const handleVideoPick = async () => {
    const file = await pickFile("video/*");
    if (!file) return;
    set({
      video: {
        name: file.name
      }
    });
  };
  const updateOption = (i, v) => setDraft(st => ({
    ...st,
    options: st.options.map((o, j) => j === i ? v : o)
  }));
  const addOption = () => setDraft(st => ({
    ...st,
    options: [...st.options, ""]
  }));
  const removeOption = i => setDraft(st => ({
    ...st,
    options: st.options.filter((_, j) => j !== i),
    correctIndex: st.correctIndex === i ? 0 : st.correctIndex > i ? st.correctIndex - 1 : st.correctIndex
  }));
  const filledOptionCount = draft.options.filter(o => o.trim().length > 0).length;
  const canSubmit = draft.tab === "post" ? draft.content.trim().length > 0 && draft.topics.length > 0 : draft.question.trim().length > 0 && filledOptionCount >= 2;
  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate(draft);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "apm-modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-modal apm-modal-post"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-modal-head"
  }, /*#__PURE__*/React.createElement("h2", null, "New Post"), /*#__PURE__*/React.createElement("button", {
    className: "apm-modal-close",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "apm-modal-tabs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-modal-tab" + (draft.tab === "post" ? " is-active" : ""),
    onClick: () => set({
      tab: "post"
    })
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:pencil"
  }), "Post"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-modal-tab" + (draft.tab === "quizpoll" ? " is-active" : ""),
    onClick: () => set({
      tab: "quizpoll"
    })
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:award"
  }), "Quiz / Poll")), draft.tab === "post" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "apm-audience-row"
  }, /*#__PURE__*/React.createElement(APMPillSelect, {
    value: draft.audience,
    options: APM_AUDIENCE_OPTS,
    icon: "lucide:globe",
    onChange: v => set({
      audience: v
    })
  }), /*#__PURE__*/React.createElement(APMPillSelect, {
    value: draft.postCategory,
    options: APM_POST_CATEGORIES,
    icon: "lucide:clipboard-list",
    onChange: v => set({
      postCategory: v
    })
  })), /*#__PURE__*/React.createElement("textarea", {
    className: "apm-share-textarea",
    placeholder: "What do you want to share?",
    value: draft.content,
    onChange: e => set({
      content: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "apm-topics-block"
  }, /*#__PURE__*/React.createElement("label", {
    className: "apm-field-label"
  }, "Select category ", /*#__PURE__*/React.createElement("span", {
    className: "apm-req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "apm-topics-grid"
  }, APM_POST_TOPICS.map(t => /*#__PURE__*/React.createElement("label", {
    key: t,
    className: "apm-topic-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: draft.topics.includes(t),
    onChange: () => toggleTopic(t)
  }), /*#__PURE__*/React.createElement("span", {
    className: "apm-topic-box"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  })), /*#__PURE__*/React.createElement("span", null, t))))), (draft.photos.length > 0 || draft.video) && /*#__PURE__*/React.createElement("div", {
    className: "apm-attach-preview"
  }, draft.photos.map((src, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "apm-attach-thumb"
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: ""
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Remove photo",
    onClick: () => removePhoto(i)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  })))), draft.video && /*#__PURE__*/React.createElement("div", {
    className: "apm-attach-thumb apm-attach-thumb-video"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:video"
  }), /*#__PURE__*/React.createElement("span", null, draft.video.name), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Remove video",
    onClick: removeVideo
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "apm-attach-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-attach-group"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-attach-link",
    onClick: handlePhotoPick
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:image"
  }), "Photo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-attach-link",
    onClick: handleCameraPick
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:camera"
  }), "Camera")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-attach-link",
    onClick: handleVideoPick
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:video"
  }), "Video")), /*#__PURE__*/React.createElement("button", {
    className: "apm-modal-submit",
    type: "button",
    disabled: !canSubmit,
    onClick: handleSubmit
  }, "Post")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "apm-audience-row apm-audience-row-solo"
  }, /*#__PURE__*/React.createElement(APMPillSelect, {
    value: draft.audience,
    options: APM_AUDIENCE_OPTS,
    icon: "lucide:globe",
    onChange: v => set({
      audience: v
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "apm-qp-type-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-qp-type-card" + (draft.qpType === "Poll" ? " is-active" : ""),
    onClick: () => set({
      qpType: "Poll"
    })
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bar-chart-2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "apm-qp-type-name"
  }, "Poll"), /*#__PURE__*/React.createElement("span", {
    className: "apm-qp-type-sub"
  }, "Members vote on options")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-qp-type-card" + (draft.qpType === "Quiz" ? " is-active" : ""),
    onClick: () => set({
      qpType: "Quiz"
    })
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:award"
  }), /*#__PURE__*/React.createElement("span", {
    className: "apm-qp-type-name"
  }, "Quiz"), /*#__PURE__*/React.createElement("span", {
    className: "apm-qp-type-sub"
  }, "One correct answer"))), /*#__PURE__*/React.createElement("label", {
    className: "apm-field-label"
  }, "Question"), /*#__PURE__*/React.createElement("input", {
    className: "apm-input",
    style: {
      marginBottom: draft.qpType === "Quiz" ? 10 : 18
    },
    placeholder: "e.g. Which filler technique do you use most?",
    value: draft.question,
    onChange: e => set({
      question: e.target.value
    })
  }), draft.qpType === "Quiz" && /*#__PURE__*/React.createElement("p", {
    className: "apm-qp-hint"
  }, "Tap the circle to mark the correct answer."), /*#__PURE__*/React.createElement("div", {
    className: "apm-qp-options"
  }, draft.options.map((opt, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "apm-qp-option-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-qp-option-mark" + (draft.qpType === "Quiz" && draft.correctIndex === i ? " is-correct" : ""),
    onClick: () => draft.qpType === "Quiz" && set({
      correctIndex: i
    }),
    "aria-label": draft.qpType === "Quiz" ? "Mark correct answer" : undefined
  }, draft.qpType === "Quiz" && draft.correctIndex === i && /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:check"
  })), /*#__PURE__*/React.createElement("input", {
    className: "apm-input apm-qp-option-input",
    placeholder: "Option " + (i + 1),
    value: opt,
    onChange: e => updateOption(i, e.target.value)
  }), draft.options.length > 2 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-qp-option-rm",
    "aria-label": "Remove option",
    onClick: () => removeOption(i)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:x"
  }))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "apm-qp-addopt",
    onClick: addOption
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Add option"), /*#__PURE__*/React.createElement("button", {
    className: "apm-modal-submit",
    type: "button",
    disabled: !canSubmit,
    onClick: handleSubmit
  }, "Publish to Feed"))));
}

/* ----------------------------------------------------------------- root */
function AdminPostsManagement() {
  const [posts, setPosts] = useStateAPM(APM_BASE_POSTS);
  const [query, setQuery] = useStateAPM("");
  const [typeFilter, setTypeFilter] = useStateAPM("all");
  const [statusFilter, setStatusFilter] = useStateAPM("all");
  const [perPage, setPerPage] = useStateAPM("10");
  const [page, setPage] = useStateAPM(1);
  const [showCreate, setShowCreate] = useStateAPM(false);
  const filtered = useMemoAPM(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(p => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (q && !(p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [posts, query, typeFilter, statusFilter]);
  const perPageNum = parseInt(perPage, 10);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPageNum));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * perPageNum;
  const pageRows = filtered.slice(startIdx, startIdx + perPageNum);
  const setFilteredPage = n => setPage(Math.max(1, Math.min(n, pageCount)));
  const handleQuery = v => {
    setQuery(v);
    setPage(1);
  };
  const handleTypeFilter = v => {
    setTypeFilter(v);
    setPage(1);
  };
  const handleStatusFilter = v => {
    setStatusFilter(v);
    setPage(1);
  };
  const togglePin = id => setPosts(st => st.map(p => p.id === id ? {
    ...p,
    pinned: !p.pinned
  } : p));
  const toggleFeature = id => setPosts(st => st.map(p => p.id === id ? {
    ...p,
    featured: !p.featured
  } : p));
  const toggleVisibility = id => setPosts(st => st.map(p => p.id === id ? {
    ...p,
    status: p.status === "Hidden" ? "Visible" : "Hidden"
  } : p));
  const handleRefresh = () => {
    setQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setPage(1);
  };
  const handleCreate = draft => {
    const isQP = draft.tab === "quizpoll";
    const title = isQP ? (draft.qpType === "Quiz" ? "Quiz: " : "Poll: ") + draft.question.trim() : draft.content.trim();
    const newPost = {
      id: Math.random().toString(16).slice(2, 10),
      title,
      content: title,
      category: isQP ? "General" : draft.postCategory,
      type: isQP ? draft.qpType : "Published",
      created: "Just now",
      scheduled: "—",
      status: "Visible"
    };
    setPosts(st => [newPost, ...st]);
    setShowCreate(false);
    setPage(1);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "apm-shell"
  }, /*#__PURE__*/React.createElement(APMSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "apm-main"
  }, /*#__PURE__*/React.createElement(APMHeader, null), /*#__PURE__*/React.createElement("div", {
    className: "apm-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-page-head"
  }, /*#__PURE__*/React.createElement("h1", null, "Posts Management"), /*#__PURE__*/React.createElement("div", {
    className: "apm-page-head-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apm-btn apm-btn-navy",
    type: "button",
    onClick: () => setShowCreate(true)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Create Post"), /*#__PURE__*/React.createElement("button", {
    className: "apm-btn apm-btn-ghost",
    type: "button",
    onClick: handleRefresh
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:refresh-cw"
  }), "Refresh"))), /*#__PURE__*/React.createElement("div", {
    className: "apm-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-search-input-wrap"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search posts by title, content or category...",
    value: query,
    onChange: e => handleQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "apm-filter-select"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apm-filter-select-label"
  }, "Content Type"), /*#__PURE__*/React.createElement("select", {
    value: typeFilter,
    onChange: e => handleTypeFilter(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Posts"), APM_TYPES.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t))), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "apm-filter-select"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apm-filter-select-label"
  }, "Status"), /*#__PURE__*/React.createElement("select", {
    value: statusFilter,
    onChange: e => handleStatusFilter(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "All Status"), /*#__PURE__*/React.createElement("option", {
    value: "Visible"
  }, "Visible"), /*#__PURE__*/React.createElement("option", {
    value: "Hidden"
  }, "Hidden")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "apm-info-banner"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:info"
  }), /*#__PURE__*/React.createElement("span", null, "Showing ", /*#__PURE__*/React.createElement("strong", null, filtered.length === 0 ? 0 : startIdx + 1, "–", Math.min(startIdx + perPageNum, filtered.length)), " of ", /*#__PURE__*/React.createElement("strong", null, filtered.length), " posts")), /*#__PURE__*/React.createElement("div", {
    className: "apm-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-row-grid apm-thead"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apm-th"
  }, "ID"), /*#__PURE__*/React.createElement("span", {
    className: "apm-th"
  }, "CONTENT"), /*#__PURE__*/React.createElement("span", {
    className: "apm-th"
  }, "CATEGORY"), /*#__PURE__*/React.createElement("span", {
    className: "apm-th"
  }, "TYPE"), /*#__PURE__*/React.createElement("span", {
    className: "apm-th"
  }, "CREATED"), /*#__PURE__*/React.createElement("span", {
    className: "apm-th"
  }, "SCHEDULED"), /*#__PURE__*/React.createElement("span", {
    className: "apm-th"
  }, "STATUS"), /*#__PURE__*/React.createElement("span", {
    className: "apm-th"
  }, "ACTION")), pageRows.map(p => /*#__PURE__*/React.createElement(APMRow, {
    key: p.id,
    post: p,
    onTogglePin: togglePin,
    onToggleFeature: toggleFeature,
    onToggleVisibility: toggleVisibility
  })), pageRows.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "apm-empty-row"
  }, "No posts match your filters."), /*#__PURE__*/React.createElement("div", {
    className: "apm-pagination"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apm-pageinfo"
  }, /*#__PURE__*/React.createElement("span", null, "Show"), /*#__PURE__*/React.createElement("div", {
    className: "apm-pp-select-wrap"
  }, /*#__PURE__*/React.createElement("select", {
    className: "apm-pp-select",
    value: perPage,
    onChange: e => {
      setPerPage(e.target.value);
      setPage(1);
    }
  }, /*#__PURE__*/React.createElement("option", null, "10"), /*#__PURE__*/React.createElement("option", null, "20"), /*#__PURE__*/React.createElement("option", null, "50")), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  })), /*#__PURE__*/React.createElement("span", null, "posts per page")), /*#__PURE__*/React.createElement("div", {
    className: "apm-pagebtns"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--gray-600)"
    }
  }, "Showing ", filtered.length === 0 ? 0 : startIdx + 1, "–", Math.min(startIdx + perPageNum, filtered.length), " of ", filtered.length, " posts"), /*#__PURE__*/React.createElement("div", {
    className: "apm-pagebtn-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: "apm-pagebtn",
    disabled: safePage <= 1,
    type: "button",
    onClick: () => setFilteredPage(safePage - 1)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-left"
  })), Array.from({
    length: pageCount
  }, (_, i) => i + 1).slice(0, 5).map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    className: "apm-pagebtn" + (n === safePage ? " is-active" : ""),
    type: "button",
    onClick: () => setFilteredPage(n)
  }, n)), /*#__PURE__*/React.createElement("button", {
    className: "apm-pagebtn",
    disabled: safePage >= pageCount,
    type: "button",
    onClick: () => setFilteredPage(safePage + 1)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-right"
  })))))))), showCreate && /*#__PURE__*/React.createElement(APMCreateModal, {
    onClose: () => setShowCreate(false),
    onCreate: handleCreate
  }));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AdminPostsManagement, null));
