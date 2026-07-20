/* ===========================================================================
   PROfinity — Admin Panel (mobile) · iPhone 17 Pro Max
   Manages the fixed, admin-curated hashtag ("bucket") list every post picks
   from — the only place new hashtags can be created. Composed on the bound
   DS bundle. Suffixed -AP to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateAP
} = React;
const DSAP = window.ProfinityDesignSystem_c2b5cc;
function goAP(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const AP_SUB_STORAGE_KEY = "pf-admin-subscriber-post";
const AP_TIERS = [{
  key: "confidence",
  name: "Confidence"
}, {
  key: "mastery",
  name: "Mastery"
}, {
  key: "builder",
  name: "Builder"
}, {
  key: "sovereign",
  name: "Sovereign"
}];
const AP_SUB_DEFAULTS = {
  confidence: true,
  mastery: true,
  builder: true,
  sovereign: true
};
function apReadSubscriberSettings() {
  try {
    const raw = localStorage.getItem(AP_SUB_STORAGE_KEY);
    if (!raw) return {
      ...AP_SUB_DEFAULTS
    };
    return {
      ...AP_SUB_DEFAULTS,
      ...JSON.parse(raw)
    };
  } catch (e) {
    return {
      ...AP_SUB_DEFAULTS
    };
  }
}
function apWriteSubscriberSettings(settings) {
  try {
    localStorage.setItem(AP_SUB_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {}
}
function useDeviceScaleAP() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateAP(calc);
  React.useEffect(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileAP() {
  const [mobile, setMobile] = useStateAP(() => window.matchMedia('(max-width:768px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function APRow({
  tag,
  onRemove
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ap-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ap-row-icon"
  }, /*#__PURE__*/React.createElement(DSAP.IconifyIcon, {
    name: tag.icon || "lucide:hash",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ap-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ap-row-label"
  }, tag.label), /*#__PURE__*/React.createElement("span", {
    className: "ap-row-slug"
  }, "#", tag.slug)), /*#__PURE__*/React.createElement("button", {
    className: "ap-row-del",
    "aria-label": "Remove " + tag.label,
    onClick: () => onRemove(tag.slug)
  }, /*#__PURE__*/React.createElement(DSAP.IconifyIcon, {
    name: "lucide:trash-2",
    size: 18,
    color: "var(--error)"
  })));
}
function APToggle({
  label,
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "ap-switch" + (on ? " on" : ""),
    onClick: onToggle,
    role: "switch",
    "aria-checked": on,
    "aria-label": label
  }, /*#__PURE__*/React.createElement("span", {
    className: "ap-knob"
  }));
}
function AdminPanel() {
  const [tags, setTags] = useStateAP(() => window.PFHashtags.getAll());
  const [label, setLabel] = useStateAP("");
  const [subSettings, setSubSettings] = useStateAP(() => apReadSubscriberSettings());
  const toggleCanPost = tierKey => {
    setSubSettings(prev => {
      const next = {
        ...prev,
        [tierKey]: !prev[tierKey]
      };
      apWriteSubscriberSettings(next);
      return next;
    });
  };
  const slug = window.PFHashtags.slugify(label);
  const isDuplicate = slug && tags.some(t => t.slug === slug);
  const canAdd = slug.length > 0 && !isDuplicate;
  const handleAdd = () => {
    if (!canAdd) return;
    setTags(window.PFHashtags.add({
      label: label.trim()
    }));
    setLabel("");
  };
  const handleRemove = s => {
    setTags(window.PFHashtags.remove(s));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ap-screen",
    "data-screen-label": "Admin Panel (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "ap-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ap-back",
    "aria-label": "Back",
    onClick: () => goAP("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSAP.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 26,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Admin Panel")), /*#__PURE__*/React.createElement("div", {
    className: "ap-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ap-sec-h"
  }, "Hashtag Buckets"), /*#__PURE__*/React.createElement("p", {
    className: "ap-sec-desc"
  }, "Manage the hashtags available across the app. Members pick from this list when posting — they can't create their own. Each hashtag acts as a bucket for filtering, search and recommendations throughout the Newsfeed."), /*#__PURE__*/React.createElement("div", {
    className: "ap-add-row"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "ap-add-input",
    placeholder: "New hashtag, e.g. Skincare",
    value: label,
    onChange: e => setLabel(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") handleAdd();
    },
    "aria-label": "New hashtag label"
  }), /*#__PURE__*/React.createElement("button", {
    className: "ap-add-btn",
    disabled: !canAdd,
    onClick: handleAdd
  }, "Add")), isDuplicate && /*#__PURE__*/React.createElement("p", {
    className: "ap-add-warn"
  }, "#", slug, " already exists."), /*#__PURE__*/React.createElement("div", {
    className: "ap-list"
  }, tags.map(t => /*#__PURE__*/React.createElement(APRow, {
    key: t.slug,
    tag: t,
    onRemove: handleRemove
  })), tags.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "ap-empty"
  }, "No hashtags yet — add one above.")), /*#__PURE__*/React.createElement("div", {
    className: "ap-sec-h"
  }, "Subscriber Permissions"), /*#__PURE__*/React.createElement("p", {
    className: "ap-sec-desc"
  }, "Control which membership tiers can create posts in the community. Mastery is set up the same way as Confidence."), /*#__PURE__*/React.createElement("div", {
    className: "ap-list"
  }, AP_TIERS.map(tier => /*#__PURE__*/React.createElement("div", {
    className: "ap-row",
    key: tier.key
  }, /*#__PURE__*/React.createElement("span", {
    className: "ap-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ap-row-label"
  }, tier.name), /*#__PURE__*/React.createElement("span", {
    className: "ap-row-slug"
  }, "Can post in community")), /*#__PURE__*/React.createElement(APToggle, {
    label: tier.name + " can post",
    on: !!subSettings[tier.key],
    onToggle: () => toggleCanPost(tier.key)
  }))))));
}
function AdminPanelApp() {
  const mobile = useIsMobileAP();
  const scale = useDeviceScaleAP();
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
    }, /*#__PURE__*/React.createElement(AdminPanel, null));
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
  }, /*#__PURE__*/React.createElement(AdminPanel, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AdminPanelApp, null));
