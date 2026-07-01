/* ===========================================================================
   PROfinity — Search · iPhone 17 Pro Max mobile
   Suffixed -SR to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStateSR,
  useEffect: useEffectSR
} = React;
const DSSR = window.ProfinityDesignSystem_c2b5cc;
function goSR(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleSR() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateSR(calc);
  useEffectSR(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileSR() {
  const [mobile, setMobile] = useStateSR(() => window.matchMedia('(max-width:768px)').matches);
  useEffectSR(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
const SR_RECENT = [{
  id: 1,
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  dot: "1 new comment on the latest post",
  ring: true
}, {
  id: 2,
  name: "Facial Aesthetics Hub",
  avatar: null,
  dot: "9+ new",
  ring: true
}, {
  id: 3,
  name: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  dot: null,
  ring: false
}, {
  id: 4,
  name: "PROfinity Business Academy",
  avatar: null,
  sub: "Business · 14K followers",
  dot: null,
  ring: false
}, {
  id: 5,
  name: "Katy Wilson",
  avatar: "assets/avatar-katy.jpg",
  dot: "1 new",
  ring: true
}, {
  id: 6,
  name: "Jane Harries",
  avatar: null,
  dot: "9+ new",
  ring: true
}];
const SR_PEOPLE = [{
  id: 1,
  name: "Dr Sarah Mitchell",
  avatar: "assets/avatar-miranda.jpg",
  mutual: 49,
  mutualAvatars: ["assets/avatar-drtim.png", "assets/avatar-katy.jpg"]
}, {
  id: 2,
  name: "Dr James Chen",
  avatar: null,
  mutual: 50,
  mutualAvatars: ["assets/avatar-miranda.jpg", "assets/avatar-drtim.png"]
}];
function SRRecentRow({
  r
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "sr-row",
    onClick: () => {}
  }, /*#__PURE__*/React.createElement("span", {
    className: "sr-av-wrap" + (r.ring ? " sr-av-ring" : "")
  }, /*#__PURE__*/React.createElement(DSSR.Avatar, {
    name: r.name,
    src: r.avatar,
    size: 44
  })), /*#__PURE__*/React.createElement("span", {
    className: "sr-row-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sr-row-name"
  }, r.name), r.sub && /*#__PURE__*/React.createElement("span", {
    className: "sr-row-sub"
  }, r.sub), r.dot && /*#__PURE__*/React.createElement("span", {
    className: "sr-dot-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sr-live-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sr-dot-text"
  }, r.dot))), /*#__PURE__*/React.createElement("button", {
    className: "sr-more",
    "aria-label": "More options",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(DSSR.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 20,
    color: "var(--gray-500)"
  })));
}
function SRPersonCard({
  p
}) {
  const [added, setAdded] = useStateSR(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "sr-person-card"
  }, p.avatar ? /*#__PURE__*/React.createElement("img", {
    className: "sr-person-photo",
    src: p.avatar,
    alt: p.name
  }) : /*#__PURE__*/React.createElement("div", {
    className: "sr-person-photo-placeholder"
  }, /*#__PURE__*/React.createElement(DSSR.Avatar, {
    name: p.name,
    size: 56
  })), /*#__PURE__*/React.createElement("div", {
    className: "sr-person-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sr-person-name"
  }, p.name), /*#__PURE__*/React.createElement("span", {
    className: "sr-mutual"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sr-mutual-avs"
  }, p.mutualAvatars.map((src, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "sr-mutual-av"
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: ""
  })))), /*#__PURE__*/React.createElement("span", {
    className: "sr-mutual-text"
  }, p.mutual, " mutual friends")), /*#__PURE__*/React.createElement("div", {
    className: "sr-person-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sr-btn-add" + (added ? " sr-btn-requested" : ""),
    onClick: () => setAdded(true)
  }, added ? "Requested" : "Add friend"), /*#__PURE__*/React.createElement("button", {
    className: "sr-btn-remove"
  }, "Remove"))));
}
function SearchPage() {
  const [query, setQuery] = useStateSR("");
  return /*#__PURE__*/React.createElement("div", {
    className: "sr-screen",
    "data-screen-label": "Search (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sr-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sr-back",
    "aria-label": "Back",
    onClick: () => goSR("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSSR.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 28,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sr-search-pill"
  }, /*#__PURE__*/React.createElement(DSSR.Icon, {
    name: "search",
    size: 17,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "search",
    placeholder: "Search",
    value: query,
    onChange: e => setQuery(e.target.value),
    autoFocus: true,
    "aria-label": "Search"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sr-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sr-sec"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sr-sec-title"
  }, "Recent"), /*#__PURE__*/React.createElement("button", {
    className: "sr-sec-link"
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    className: "sr-list"
  }, SR_RECENT.map(r => /*#__PURE__*/React.createElement(SRRecentRow, {
    key: r.id,
    r: r
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sr-sec"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sr-sec-title"
  }, "People you may know"), /*#__PURE__*/React.createElement("button", {
    className: "sr-sec-link"
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    className: "sr-people-grid"
  }, SR_PEOPLE.map(p => /*#__PURE__*/React.createElement(SRPersonCard, {
    key: p.id,
    p: p
  })))));
}
function SearchApp() {
  const mobile = useIsMobileSR();
  const scale = useDeviceScaleSR();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)",
    backgroundColor: "rgb(217, 218, 225)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(SearchPage, null));
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
  }, /*#__PURE__*/React.createElement(SearchPage, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(SearchApp, null));
