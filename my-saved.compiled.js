/* ===========================================================================
   PROfinity — My Saved (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -MS to avoid global-scope clashes.
   Collection tiles reuse the lm-col / lm-savedtabs classes from learning-mobile.css.
   =========================================================================== */
const {
  useState: useStateMS,
  useEffect: useEffectMS
} = React;
const DSMS = window.ProfinityDesignSystem_c2b5cc;
function goMS(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function msBackTarget() {
  const from = new URLSearchParams(window.location.search).get("from");
  if (from === "learning") return "LearningMobile.html";
  return /LearningMobile\.html/i.test(document.referrer) ? "LearningMobile.html" : "AccountSettings.html";
}
function useDeviceScaleMS() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateMS(calc);
  useEffectMS(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileMS() {
  const [mobile, setMobile] = useStateMS(() => window.matchMedia('(max-width:768px)').matches);
  useEffectMS(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
const MS_COLLECTIONS = [{
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
const MS_TABS = [{
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
function MSCollectionTile({
  c
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "lm-col" + (c.img ? "" : " empty")
  }, c.img ? /*#__PURE__*/React.createElement("img", {
    src: c.img,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "lm-col-blank",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm-col-veil",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm-col-meta"
  }, /*#__PURE__*/React.createElement(DSMS.IconifyIcon, {
    name: c.icon === "clock" ? "lucide:clock" : "lucide:bookmark",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lm-col-name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "lm-col-n"
  }, c.n, " saved")), /*#__PURE__*/React.createElement("span", {
    className: "lm-col-lock",
    "aria-label": "Private collection"
  }, /*#__PURE__*/React.createElement(DSMS.IconifyIcon, {
    name: "lucide:lock",
    size: 15,
    color: "#fff"
  })));
}
function MSNewCollectionSheet({
  onClose
}) {
  const [name, setName] = useStateMS("");
  const [makePublic, setMakePublic] = useStateMS(false);
  useEffectMS(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "mcs-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcs-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Create new collection",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcs-hd"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mcs-close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(DSMS.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", null, "Create new collection")), /*#__PURE__*/React.createElement("div", {
    className: "mcs-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcs-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcs-field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "mcs-name"
  }, "Name"), /*#__PURE__*/React.createElement("input", {
    id: "mcs-name",
    type: "text",
    placeholder: "Enter collection name",
    value: name,
    onChange: e => setName(e.target.value),
    autoFocus: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mcs-card"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mcs-row",
    type: "button"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcs-row-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcs-row-title"
  }, "Share with a friend"), /*#__PURE__*/React.createElement("span", {
    className: "mcs-row-sub"
  }, "They will be able to add their favorite posts.")), /*#__PURE__*/React.createElement("span", {
    className: "mcs-row-right"
  }, /*#__PURE__*/React.createElement(DSMS.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mcs-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcs-row-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcs-row-title"
  }, "Make public"), /*#__PURE__*/React.createElement("span", {
    className: "mcs-row-sub"
  }, "The collection will be shown on your profile.")), /*#__PURE__*/React.createElement("span", {
    className: "mcs-row-right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mcs-switch" + (makePublic ? " on" : ""),
    role: "switch",
    "aria-checked": makePublic,
    "aria-label": "Make public",
    onClick: () => setMakePublic(v => !v)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcs-knob"
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "mcs-cta",
    disabled: !name.trim(),
    onClick: onClose
  }, "Next"))));
}
function MySaved() {
  const [tab, setTab] = useStateMS("Collections");
  const [newCollectionOpen, setNewCollectionOpen] = useStateMS(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-screen",
    "data-screen-label": "My Saved (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ms-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ms-back",
    "aria-label": "Back",
    onClick: () => goMS(msBackTarget())
  }, /*#__PURE__*/React.createElement(DSMS.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "My Saved"), /*#__PURE__*/React.createElement("button", {
    className: "ms-back",
    "aria-label": "Search saved items"
  }, /*#__PURE__*/React.createElement(DSMS.IconifyIcon, {
    name: "lucide:search",
    size: 22,
    color: "var(--gray-900)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ms-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-savedtabs",
    role: "tablist",
    "aria-label": "Saved content"
  }, MS_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    role: "tab",
    "aria-selected": tab === t.k,
    className: "lm-st" + (tab === t.k ? " on" : ""),
    onClick: () => setTab(t.k)
  }, t.k, " ", /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, t.n)))), tab === "Collections" ? /*#__PURE__*/React.createElement("div", {
    className: "lm-colgrid"
  }, /*#__PURE__*/React.createElement("button", {
    className: "lm-col lm-col-new",
    "aria-label": "Create a new collection",
    onClick: () => setNewCollectionOpen(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-col-plus"
  }, /*#__PURE__*/React.createElement(DSMS.IconifyIcon, {
    name: "lucide:plus",
    size: 26,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lm-col-newtx"
  }, "New collection")), MS_COLLECTIONS.map(c => /*#__PURE__*/React.createElement(MSCollectionTile, {
    key: c.name,
    c: c
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "lm-saved-empty"
  }, /*#__PURE__*/React.createElement(DSMS.IconifyIcon, {
    name: "lucide:bookmark",
    size: 34,
    color: "var(--gray-400)"
  }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Nothing saved here yet"), "Tap the bookmark on any ", tab.toLowerCase().replace(/s$/, ""), " to keep it for later.")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24
    }
  })), newCollectionOpen && /*#__PURE__*/React.createElement(MSNewCollectionSheet, {
    onClose: () => setNewCollectionOpen(false)
  }));
}
function MySavedApp() {
  const mobile = useIsMobileMS();
  const scale = useDeviceScaleMS();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement(MySaved, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(MySaved, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MySavedApp, null));
