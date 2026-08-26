/* ===========================================================================
   PROfinity — Reels (full-screen vertical video) · iPhone 17 Pro Max
   Swipe vertically between reels. Suffixed -RL to stay clear of other pages.
   =========================================================================== */
const DSRL = window.ProfinityDesignSystem_c2b5cc;
const {
  useState: useStateRL,
  useEffect: useEffectRL,
  useRef: useRefRL
} = React;
const IconRL = ({
  n,
  size = 30,
  color = "#fff"
}) => /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
  name: n,
  size: size,
  color: color
});
function goRL(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleRL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRL(calc);
  useEffectRL(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileRL() {
  const [mobile, setMobile] = useStateRL(() => window.matchMedia('(max-width:768px)').matches);
  useEffectRL(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
const RL_REELS = [{
  id: "r1",
  media: "assets/post5-img8.png",
  author: {
    name: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    seals: ["gb", "verified", "gold"]
  },
  caption: "60 seconds on why I always photograph in the same three angles, every single patient, no exceptions.",
  tags: ["#reel", "#consult", "#protocol"],
  likes: "980",
  comments: "70",
  shares: "160",
  saves: "1.2K",
  dur: 30
}, {
  id: "r2",
  media: "assets/post2-img3.png",
  author: {
    name: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    seals: ["gb", "verified", "gold"]
  },
  caption: "60 seconds on why we always numb before we measure, not after.",
  tags: ["#reel", "#technique"],
  likes: "1.3K",
  comments: "97",
  shares: "210",
  saves: "1.6K",
  dur: 24
}, {
  id: "r3",
  media: "assets/post5-img2.png",
  author: {
    name: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    seals: ["gb", "gold", "verified", "crown"]
  },
  caption: "60 seconds on why the temple should almost never be your first treatment area.",
  tags: ["#temples", "#advanced", "#mastery"],
  likes: "1.4K",
  comments: "101",
  shares: "230",
  saves: "1.8K",
  dur: 36
}];
const RL_COLLECTIONS = [{
  name: "Watch later",
  n: 0,
  icon: "lucide:clock"
}, {
  name: "Lip protocols",
  n: 14,
  img: "assets/course-lip.png"
}, {
  name: "Toxin techniques",
  n: 22,
  img: "assets/course-protox.png"
}, {
  name: "Complication cases",
  n: 11,
  img: "assets/chin-positions.png"
}, {
  name: "Full-face assessment",
  n: 6,
  img: "assets/post5-img1.png"
}, {
  name: "Temple & midface",
  n: 5,
  img: "assets/course-temple.png"
}];
function RLCollectionTile({
  c,
  onPick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "rl-col" + (c.img ? "" : " empty"),
    onClick: () => onPick(c.name)
  }, c.img ? /*#__PURE__*/React.createElement("img", {
    src: c.img,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "rl-col-blank",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "rl-col-veil",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "rl-col-meta"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: c.icon === "lucide:clock" ? "lucide:clock" : "lucide:bookmark",
    size: 18,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    className: "rl-col-name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "rl-col-n"
  }, c.n, " posts")), /*#__PURE__*/React.createElement("span", {
    className: "rl-col-lock",
    "aria-label": "Private collection"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:lock",
    size: 13,
    color: "#fff"
  })));
}
function ReelAction({
  icon,
  label,
  count,
  active,
  accent,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "rl-act" + (active ? " on" : ""),
    onClick: onClick,
    "aria-label": label,
    "aria-pressed": active
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-act-ic"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: icon,
    size: 30,
    color: active ? accent : "#fff"
  })), count != null && /*#__PURE__*/React.createElement("span", {
    className: "rl-act-n"
  }, count));
}
function Reel({
  reel,
  active
}) {
  const [playing, setPlaying] = useStateRL(true);
  const [pct, setPct] = useStateRL(0);
  const [liked, setLiked] = useStateRL(false);
  const [loved, setLoved] = useStateRL(false);
  const [burst, setBurst] = useStateRL(null);
  const [saved, setSaved] = useStateRL(false);
  const [toast, setToast] = useStateRL(null);
  const [sheetOpen, setSheetOpen] = useStateRL(false);
  const [following, setFollowing] = useStateRL(false);
  const lastTap = useRefRL(0);
  const toastTimer = useRefRL(null);
  const showToast = cfg => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(cfg);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  const dismissToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  };
  const onSaveClick = () => {
    if (saved) {
      setSaved(false);
      dismissToast();
      return;
    }
    setSaved(true);
    showToast({
      kind: "saved"
    });
  };
  const openCollections = () => {
    dismissToast();
    setSheetOpen(true);
  };
  const chooseCollection = name => {
    setSheetOpen(false);
    showToast({
      kind: "savedTo",
      collection: name
    });
  };
  useEffectRL(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  /* single tap = pause/play · double tap anywhere = Love reaction (with heart burst) */
  const onTap = e => {
    const now = Date.now();
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      setLoved(true);
      setBurst({
        x,
        y,
        k: now
      });
      setTimeout(() => setBurst(b => b && b.k === now ? null : b), 900);
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current === now) {
          lastTap.current = 0;
          setPlaying(v => !v);
        }
      }, 300);
    }
  };
  useEffectRL(() => {
    if (!playing || !active) return undefined;
    const step = 100 / (reel.dur * 4);
    const t = setInterval(() => setPct(p => p + step >= 100 ? 0 : p + step), 250);
    return () => clearInterval(t);
  }, [playing, active, reel.dur]);
  return /*#__PURE__*/React.createElement("div", {
    className: "rl-item",
    "data-screen-label": "Reel · " + reel.author.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "rl-media"
  }, /*#__PURE__*/React.createElement("img", {
    src: reel.media,
    alt: reel.caption
  })), /*#__PURE__*/React.createElement("span", {
    className: "rl-scrim-t"
  }), /*#__PURE__*/React.createElement("span", {
    className: "rl-scrim-b"
  }), /*#__PURE__*/React.createElement("button", {
    className: "rl-tap",
    "aria-label": playing ? "Pause video — double tap to love" : "Play video — double tap to love",
    onClick: onTap
  }), !playing && /*#__PURE__*/React.createElement("span", {
    className: "rl-play"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:play",
    size: 32
  })), burst && /*#__PURE__*/React.createElement("span", {
    className: "rl-burst",
    key: burst.k,
    style: {
      left: burst.x,
      top: burst.y
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "fluent-emoji-flat:red-heart",
    size: 92
  }), [0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("i", {
    className: "rl-spark",
    key: i,
    style: {
      "--a": i * 60 + "deg"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rl-rail-actions"
  }, /*#__PURE__*/React.createElement(ReelAction, {
    icon: loved ? "fluent:heart-16-filled" : liked ? "fluent:thumb-like-16-filled" : "fluent:thumb-like-16-regular",
    label: loved ? "Loved" : "Like",
    count: reel.likes,
    active: liked || loved,
    accent: loved ? "var(--reaction-love,#F0425F)" : "var(--reaction-like,#2E86FF)",
    onClick: () => loved ? setLoved(false) : setLiked(v => !v)
  }), /*#__PURE__*/React.createElement(ReelAction, {
    icon: "lucide:message-circle",
    label: "Comments",
    count: reel.comments
  }), /*#__PURE__*/React.createElement(ReelAction, {
    icon: "lucide:share-2",
    label: "Share",
    count: reel.shares
  }), /*#__PURE__*/React.createElement(ReelAction, {
    icon: saved ? "fluent:bookmark-16-filled" : "lucide:bookmark",
    label: "Save",
    count: reel.saves,
    active: saved,
    accent: "#FFD60A",
    onClick: onSaveClick
  }), /*#__PURE__*/React.createElement(ReelAction, {
    icon: "lucide:more-horizontal",
    label: "More options"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rl-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rl-author"
  }, /*#__PURE__*/React.createElement("span", {
    className: "av"
  }, /*#__PURE__*/React.createElement("img", {
    src: reel.author.avatar,
    alt: ""
  })), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, reel.author.name), /*#__PURE__*/React.createElement(DSRL.VerificationSeals, {
    seals: reel.author.seals,
    size: 17
  }), /*#__PURE__*/React.createElement("button", {
    className: "rl-follow" + (following ? " on" : ""),
    onClick: () => setFollowing(v => !v),
    "aria-pressed": following
  }, following ? "Following" : "Follow")), /*#__PURE__*/React.createElement("p", {
    className: "rl-cap"
  }, reel.caption), /*#__PURE__*/React.createElement("div", {
    className: "rl-tags"
  }, reel.tags.map(t => /*#__PURE__*/React.createElement("span", {
    className: "rl-tag",
    key: t
  }, t)))), /*#__PURE__*/React.createElement("span", {
    className: "rl-track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-track-fill",
    style: {
      width: pct + "%"
    }
  })), toast && /*#__PURE__*/React.createElement("div", {
    className: "rl-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-toast-ck"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:check",
    size: 13,
    color: "#0a0a0a"
  })), /*#__PURE__*/React.createElement("span", {
    className: "rl-toast-tx"
  }, toast.kind === "saved" ? "Saved" : `Saved to ${toast.collection}`), /*#__PURE__*/React.createElement("button", {
    className: "rl-toast-act",
    onClick: toast.kind === "saved" ? openCollections : () => goRL("MySaved.html")
  }, toast.kind === "saved" ? "Collections" : "View", /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:chevron-right",
    size: 16,
    color: "#fff"
  }))), sheetOpen && /*#__PURE__*/React.createElement("div", {
    className: "rl-sheet-overlay",
    onClick: () => setSheetOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "rl-sheet",
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Save to collection"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-sheet-drag",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "rl-sheet-title"
  }, "Save to collection"), /*#__PURE__*/React.createElement("div", {
    className: "rl-sheet-grid"
  }, /*#__PURE__*/React.createElement("button", {
    className: "rl-col rl-col-new",
    "aria-label": "Create a new collection",
    onClick: () => chooseCollection("New collection")
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-col-plus"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:plus",
    size: 22,
    color: "var(--brand-navy,#292569)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "rl-col-newtx"
  }, "New collection")), RL_COLLECTIONS.map(c => /*#__PURE__*/React.createElement(RLCollectionTile, {
    key: c.name,
    c: c,
    onPick: chooseCollection
  }))))));
}
function ReelApp() {
  const mobile = useIsMobileRL();
  const scale = useDeviceScaleRL();
  const railRef = useRefRL(null);
  const [idx, setIdx] = useStateRL(0);
  const [kb, setKb] = useStateRL(false);
  useEffectRL(() => {
    const el = railRef.current;
    if (!el) return undefined;
    const onScroll = () => setIdx(Math.round(el.scrollTop / el.clientHeight));
    el.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const back = () => {
    const r = document.referrer;
    goRL(r && /Newsfeed/i.test(r) ? r : "NewsfeedMobile.html");
  };
  const screen = /*#__PURE__*/React.createElement("div", {
    className: "rl-screen",
    "data-screen-label": "Reels (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "rl-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "rl-gbtn",
    "aria-label": "Back",
    onClick: back
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:arrow-left",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "rl-gbtn",
    "aria-label": "Search reels"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:search",
    size: 21
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rl-rail",
    ref: railRef
  }, RL_REELS.map((r, i) => /*#__PURE__*/React.createElement(Reel, {
    key: r.id,
    reel: r,
    active: i === idx
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rl-bar" + (kb ? " kb" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "rl-input"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Add a comment…",
    "aria-label": "Add a comment",
    onFocus: () => setKb(true),
    onBlur: () => setKb(false)
  }), /*#__PURE__*/React.createElement("button", {
    className: "rl-ibtn",
    "aria-label": "Mention someone"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:at-sign",
    size: 20,
    color: "rgba(255,255,255,.75)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "rl-ibtn",
    "aria-label": "Add emoji"
  }, /*#__PURE__*/React.createElement(IconRL, {
    n: "lucide:smile",
    size: 20,
    color: "rgba(255,255,255,.75)"
  })))), kb && /*#__PURE__*/React.createElement("div", {
    className: "rl-kb"
  }, /*#__PURE__*/React.createElement(IOSKeyboard, null)));
  const vars = {
    "--action-primary": "var(--brand-navy)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: vars
    }, screen);
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
  }, screen)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ReelApp, null));
