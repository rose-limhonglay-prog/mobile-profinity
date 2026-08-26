/* ===========================================================================
   PROfinity — My Saved (web)
   Desktop counterpart to MySaved.html (my-saved.jsx): same Collections/Courses/
   Posts/Resources tabs and lm-col-style collection tiles (image + gradient
   veil + name/count + lock badge), on the web page shell (TopNav + centered
   column) instead of the phone frame. Reached from MyLearning.html.
   Suffixed -SW to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateSW,
  useEffect: useEffectSW
} = React;
const DSSW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavSW,
  IconifyIcon: IconifySW,
  Icon: IconSW
} = DSSW;
const ME_SW = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function goSW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateSW(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goSW(u);
}

/* Same collections shown on the mobile My Saved screen (my-saved.jsx's
   MS_COLLECTIONS) — kept in sync by hand since each page loads its own copy. */
const SW_COLLECTIONS = [{
  name: "Lip protocols",
  n: 14,
  img: "assets/course-lip.png"
}, {
  name: "Toxin techniques",
  n: 22,
  img: "assets/course-protox.png"
}, {
  name: "Watch later",
  n: 8,
  img: null,
  icon: "clock"
}, {
  name: "Complication cases",
  n: 11,
  img: "assets/chin-positions.png"
}, {
  name: "Full-face assessment",
  n: 6,
  img: "assets/post5-img1.png"
}, {
  name: "Business growth",
  n: 9,
  img: "assets/post3-img1.png"
}, {
  name: "Temple & midface",
  n: 5,
  img: "assets/course-temple.png"
}, {
  name: "Chairside handouts",
  n: 17,
  img: "assets/clinic-toxin-guide.png"
}];
const SW_TABS = [{
  k: "Collections",
  n: 8
}, {
  k: "Courses",
  n: 26
}, {
  k: "Posts",
  n: 112
}, {
  k: "Resources",
  n: 34
}];
function SWCollectionTile({
  c
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "sw-col" + (c.img ? "" : " empty")
  }, c.img ? /*#__PURE__*/React.createElement("img", {
    src: c.img,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "sw-col-blank",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sw-col-veil",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sw-col-meta"
  }, /*#__PURE__*/React.createElement(IconifySW, {
    name: c.icon === "clock" ? "lucide:clock" : "lucide:bookmark",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sw-col-name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "sw-col-n"
  }, c.n, " saved")), /*#__PURE__*/React.createElement("span", {
    className: "sw-col-lock",
    "aria-label": "Private collection"
  }, /*#__PURE__*/React.createElement(IconifySW, {
    name: "lucide:lock",
    size: 15,
    color: "#fff"
  })));
}
function SWNewCollectionModal({
  onClose
}) {
  const [name, setName] = useStateSW("");
  const [makePublic, setMakePublic] = useStateSW(false);
  useEffectSW(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "sw-modal-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sw-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Create new collection",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "sw-modal-hd"
  }, /*#__PURE__*/React.createElement("h2", null, "Create new collection"), /*#__PURE__*/React.createElement("button", {
    className: "sw-modal-close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(IconifySW, {
    name: "lucide:x",
    size: 20,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sw-modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sw-modal-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sw-modal-field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "sw-cn-name"
  }, "Name"), /*#__PURE__*/React.createElement("input", {
    id: "sw-cn-name",
    type: "text",
    placeholder: "Enter collection name",
    value: name,
    onChange: e => setName(e.target.value),
    autoFocus: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sw-modal-card"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sw-modal-row",
    type: "button"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-modal-row-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-modal-row-title"
  }, "Share with a friend"), /*#__PURE__*/React.createElement("span", {
    className: "sw-modal-row-sub"
  }, "They will be able to add their favorite posts.")), /*#__PURE__*/React.createElement(IconifySW, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sw-modal-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-modal-row-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-modal-row-title"
  }, "Make public"), /*#__PURE__*/React.createElement("span", {
    className: "sw-modal-row-sub"
  }, "The collection will be shown on your profile.")), /*#__PURE__*/React.createElement("button", {
    className: "sw-switch" + (makePublic ? " on" : ""),
    role: "switch",
    "aria-checked": makePublic,
    "aria-label": "Make public",
    onClick: () => setMakePublic(v => !v)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-knob"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "sw-modal-cta",
    disabled: !name.trim(),
    onClick: onClose
  }, "Create collection"))));
}
function SavedWebApp() {
  const [tab, setTab] = useStateSW("Collections");
  const [query, setQuery] = useStateSW("");
  const [newCollectionOpen, setNewCollectionOpen] = useStateSW(false);
  const collections = SW_COLLECTIONS.filter(c => !query.trim() || c.name.toLowerCase().includes(query.trim().toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavSW, {
    active: "My Learning",
    user: ME_SW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateSW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sw-page",
    "data-screen-label": "My Saved"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "sw-back",
    onClick: () => goSW("MyLearning.html")
  }, /*#__PURE__*/React.createElement(IconifySW, {
    name: "lucide:arrow-left",
    size: 18,
    color: "var(--brand-navy)"
  }), "Back to My Learning"), /*#__PURE__*/React.createElement("div", {
    className: "sw-head"
  }, /*#__PURE__*/React.createElement("h1", null, "My Saved"), /*#__PURE__*/React.createElement("p", null, "Everything you’ve bookmarked — organised into collections for quick access.")), /*#__PURE__*/React.createElement("div", {
    className: "sw-toolbar"
  }, /*#__PURE__*/React.createElement("label", {
    className: "sw-search"
  }, /*#__PURE__*/React.createElement(IconSW, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search saved items…",
    "aria-label": "Search saved items",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "sw-tabs",
    role: "tablist",
    "aria-label": "Saved content"
  }, SW_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    role: "tab",
    "aria-selected": tab === t.k,
    className: "sw-tab" + (tab === t.k ? " on" : ""),
    onClick: () => setTab(t.k)
  }, t.k, " ", /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, t.n))))), tab === "Collections" ? collections.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "sw-empty"
  }, "No collections match your search.") : /*#__PURE__*/React.createElement("div", {
    className: "sw-colgrid"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sw-col sw-col-new",
    "aria-label": "Create a new collection",
    onClick: () => setNewCollectionOpen(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "sw-col-plus"
  }, /*#__PURE__*/React.createElement(IconifySW, {
    name: "lucide:plus",
    size: 28,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sw-col-newtx"
  }, "New collection")), collections.map(c => /*#__PURE__*/React.createElement(SWCollectionTile, {
    key: c.name,
    c: c
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "sw-saved-empty"
  }, /*#__PURE__*/React.createElement(IconifySW, {
    name: "lucide:bookmark",
    size: 38,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("h3", null, "Nothing saved here yet"), /*#__PURE__*/React.createElement("p", null, "Tap the bookmark on any ", tab.toLowerCase().replace(/s$/, ""), " to keep it for later."))), newCollectionOpen && /*#__PURE__*/React.createElement(SWNewCollectionModal, {
    onClose: () => setNewCollectionOpen(false)
  }));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(SavedWebApp, null));
