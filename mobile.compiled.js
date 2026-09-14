/* ===========================================================================
   PROfinity — Home (Newsfeed) · iPhone 17 Pro Max mobile
   Reuses the desktop Feed (window.PFApp.Feed — full reaction/comment/animation
   stack) inside the IOSDevice frame, with a mobile top bar + bottom tab bar.
   Shares one global scope with app.jsx, so names here are suffixed -M.
   =========================================================================== */
const {
  useState: useStateM,
  useEffect: useEffectM,
  useRef: useRefM,
  useLayoutEffect: useLayoutEffectM,
  forwardRef: forwardRefM
} = React;
const DSM = window.ProfinityDesignSystem_c2b5cc;
const PFAM = window.PFApp;
function go(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const M_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: null
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Learning",
  label: "Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: "ProfileMobile.html"
}, {
  key: "Agent",
  label: "Ava",
  icon: "lucide:sparkles",
  href: "AgentMobile.html"
}, {
  key: "Rewards",
  label: "Rewards",
  icon: "lucide:gift",
  href: "RewardsDashboard.html"
}];
const PUSH_NOTIF = {
  app: "PROfinity Academy",
  icon: "assets/profinity-icon.jpg",
  title: "Weekly Rewards are here!",
  body: "Your weekly rewards have been calculated. Open the app to claim your bonuses before they expire this Sunday.",
  cta: "Claim Rewards"
};
function PushNotifBanner() {
  const [open, setOpen] = useStateM(true);
  const [expanded, setExpanded] = useStateM(false);
  useEffectM(() => {
    if (expanded) return;
    const t = setTimeout(() => setOpen(false), 7000);
    return () => clearTimeout(t);
  }, [expanded]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "m-push" + (expanded ? " expanded" : ""),
    role: "alert",
    "aria-label": PUSH_NOTIF.title,
    onClick: () => setExpanded(e => !e)
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-push-row"
  }, /*#__PURE__*/React.createElement("img", {
    className: "m-push-icon",
    src: PUSH_NOTIF.icon,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-push-app"
  }, PUSH_NOTIF.app), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-push-time"
  }, "now")), /*#__PURE__*/React.createElement("div", {
    className: "m-push-title"
  }, PUSH_NOTIF.title), /*#__PURE__*/React.createElement("p", {
    className: "m-push-body"
  }, PUSH_NOTIF.body), expanded && /*#__PURE__*/React.createElement("div", {
    className: "m-push-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-push-cta",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
    }
  }, PUSH_NOTIF.cta), /*#__PURE__*/React.createElement("button", {
    className: "m-push-dismiss",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
    }
  }, "Dismiss")), /*#__PURE__*/React.createElement("span", {
    className: "m-push-handle",
    role: "button",
    "aria-label": "Dismiss notification",
    onClick: e => {
      e.stopPropagation();
      setOpen(false);
    }
  }));
}

/* ===== header points pill ===================================================
   The member's lifetime gamification points, sat between the logo and the
   search icon. Icon is the syringe Lottie (lottie.host TbrupntywS) fed
   as raw JSON through
   lottie-web (never the lottie.host /embed iframe — it caches hard and
   ignores re-publishes). Reads window.PFLoyalty when loyalty-engine.js is on
   the page and falls back to the engine's seeded headline otherwise; a
   `pf:points-earned` event (dispatched by popPoints in app.jsx) bumps the
   total live and books it in the engine so Rewards stays in step.

   The number reads in the artwork's syringe red (#E9293A, #FE6559 in dark mode); the tooltip
   still reads lifetime points against the engine's beakerFullPoints scale. */
const PTS_LOTTIE_SRCM = "https://lottie.host/10797cf0-5c4b-4f1a-8412-5631c9593ded/TbrupntywS.json";
const PTS_LOTTIE_LIBM = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
const PTS_FALLBACKM = 14000;
const PTS_FULL_FALLBACKM = 20000;
let ptsLottiePromiseM = null;
function ptsLottieDataM() {
  if (!ptsLottiePromiseM) {
    ptsLottiePromiseM = fetch(PTS_LOTTIE_SRCM).then(r => r.ok ? r.json() : null).catch(() => {
      ptsLottiePromiseM = null;
      return null;
    });
  }
  return ptsLottiePromiseM;
}
/* Same data-pf-lottie marker as app.jsx / tour.js so the lib is injected once. */
function ptsEnsureLottieLibM() {
  if (window.lottie || document.querySelector("script[data-pf-lottie]")) return;
  const sc = document.createElement("script");
  sc.src = PTS_LOTTIE_LIBM;
  sc.async = true;
  sc.setAttribute("data-pf-lottie", "1");
  document.head.appendChild(sc);
}
function ptsReduceMotionM() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
function ptsReadTotalM() {
  const eng = window.PFLoyalty;
  if (eng) {
    try {
      return Math.max(0, Math.round(eng.getState().lifetimePoints || 0));
    } catch (e) {/* fall through */}
  }
  return PTS_FALLBACKM;
}
/* Lifetime points scale for the pill's tooltip — the engine's
   beakerFullPoints config (20,000), shared with the Rewards card. */
function ptsReadFullM() {
  const eng = window.PFLoyalty;
  if (eng && eng.getConfig) {
    try {
      return Math.max(1, +eng.getConfig().beakerFullPoints || PTS_FULL_FALLBACKM);
    } catch (e) {/* fall through */}
  }
  return PTS_FULL_FALLBACKM;
}
function PointsIconM() {
  const host = useRefM(null);
  const [ready, setReady] = useStateM(false);
  useEffectM(() => {
    let anim,
      iv,
      cancelled = false;
    const still = ptsReduceMotionM();
    function start() {
      if (cancelled || !window.lottie || !host.current) return;
      ptsLottieDataM().then(data => {
        if (!data || cancelled || !host.current) return;
        anim = window.lottie.loadAnimation({
          container: host.current,
          renderer: "svg",
          loop: !still,
          autoplay: !still,
          animationData: data,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: false
          }
        });
        anim.addEventListener("DOMLoaded", () => {
          if (cancelled) return;
          if (still) anim.goToAndStop(0, true);
          setReady(true);
        });
      });
    }
    ptsEnsureLottieLibM();
    if (window.lottie) start();else {
      iv = setInterval(() => {
        if (window.lottie) {
          clearInterval(iv);
          iv = null;
          start();
        }
      }, 120);
      setTimeout(() => {
        if (iv) clearInterval(iv);
      }, 8000);
    }
    return () => {
      cancelled = true;
      if (anim) anim.destroy();
      if (iv) clearInterval(iv);
    };
  }, []);
  return /*#__PURE__*/React.createElement("span", {
    className: "m-pts-ic",
    "aria-hidden": "true"
  }, !ready && /*#__PURE__*/React.createElement("span", {
    className: "m-pts-ic-fb"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:syringe",
    size: 18,
    color: "#E9293A"
  })), /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "m-pts-ic-anim" + (ready ? " on" : "")
  }));
}

/* Tweened display value: eases from the previous total to the new one so an
   earned +15 visibly ticks the counter up instead of jumping. */
function usePointsCountUpM(target) {
  const [shown, setShown] = useStateM(target);
  const from = useRefM(target);
  useEffectM(() => {
    const start = from.current;
    if (start === target) return;
    if (ptsReduceMotionM() || typeof requestAnimationFrame !== "function") {
      from.current = target;
      setShown(target);
      return;
    }
    const t0 = performance.now(),
      dur = 650;
    let raf;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur),
        e = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + (target - start) * e);
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = target;
    };
  }, [target]);
  return shown;
}

/* ---- floating tally: the pill's stand-in while the header can't be seen ----
   Hold time after the last payout before the tally slides away. */
const PTS_TALLY_HOLDM = 2400;
/* True when the header pill is actually on screen: it needs a box inside the
   viewport, no faded/hidden ancestor, and it must win a hit-test at its own
   centre — a header slid away with translateY(-100%) + pointer-events:none, a
   pill faded out in chrome-float, or any sheet / scrim lying over it
   (Comments, drawer, modal) all fail that. */
function ptsPillVisibleM(el) {
  if (!el || typeof document === "undefined" || !document.elementFromPoint) return true;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return false;
  const cx = r.left + r.width / 2,
    cy = r.top + r.height / 2;
  if (cx < 0 || cy < 0 || cx >= window.innerWidth || cy >= window.innerHeight) return false;
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (cs.opacity === "0" || cs.visibility === "hidden" || cs.display === "none") return false;
  }
  const hit = document.elementFromPoint(cx, cy);
  return !!(hit && el.contains(hit));
}
/* Screen root the tally is portaled into: escapes the hidden header's
   transform and (z-index 9800) floats above the Comments sheet. */
function ptsTallyHostM(el) {
  return el && el.closest && el.closest(".m-screen, .lm-screen, .ml-screen, .ag-screen, .cm-screen, .pm-screen, .ev-screen") || document.body;
}
/* Drops in under the status bar with the same icon, shows the same total
   counting up with the "+N" delta, and slides away PTS_TALLY_HOLDM after the
   last payout. Mounted on first use and then kept (hidden) so the Lottie
   isn't reloaded for every payout. */
function PointsTallyM({
  host,
  on,
  shown,
  bump,
  delta
}) {
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "m-pts-tally" + (on ? " on" : ""),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    tabIndex: -1,
    className: "m-pts" + (delta && on ? " earn" : ""),
    onClick: () => go("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(PointsIconM, null), /*#__PURE__*/React.createElement("span", {
    key: bump,
    className: "m-pts-n" + (bump ? " pop" : "")
  }, shown.toLocaleString("en-GB")), delta && on && /*#__PURE__*/React.createElement("span", {
    key: delta.key,
    className: "m-pts-delta",
    "aria-hidden": "true"
  }, "+", delta.amt))), host);
}
function PointsPillM() {
  const [total, setTotal] = useStateM(ptsReadTotalM);
  const [full, setFull] = useStateM(ptsReadFullM);
  const [bump, setBump] = useStateM(0);
  // last payout, shown as a floating "+N" delta over the pill for ~1.4s
  const [delta, setDelta] = useStateM(null);
  // floating tally (PointsTallyM) shown when the pill itself isn't visible
  const pillRef = useRefM(null);
  const [tally, setTally] = useStateM(false);
  const [tallyHost, setTallyHost] = useStateM(null);
  const tallyTimer = useRefM(null);
  useEffectM(() => {
    const refresh = () => {
      setTotal(ptsReadTotalM());
      setFull(ptsReadFullM());
    };
    const onEarn = e => {
      const amt = e && e.detail ? Math.round(+e.detail.amount || 0) : 0;
      if (!amt) return;
      const eng = window.PFLoyalty;
      if (eng) {
        try {
          if (eng.awardPoints) eng.awardPoints(amt, e.detail.label, e.detail.actionId);else eng.setState({
            lifetimePoints: (eng.getState().lifetimePoints || 0) + amt
          });
          refresh();
        } catch (err) {
          setTotal(t => t + amt);
        }
      } else {
        setTotal(t => t + amt);
      }
      setBump(b => b + 1);
      setDelta({
        amt,
        key: Date.now()
      });
      if (!ptsPillVisibleM(pillRef.current)) {
        setTallyHost(h => h || ptsTallyHostM(pillRef.current));
        setTally(true);
        clearTimeout(tallyTimer.current);
        tallyTimer.current = setTimeout(() => setTally(false), PTS_TALLY_HOLDM);
      }
    };
    /* Another tab (Rewards, Profile) changed the shared engine state. */
    const onStorage = e => {
      if (!e.key || e.key === "pf-loyalty-state-v1" || e.key === "pf-loyalty-config-v1") refresh();
    };
    window.addEventListener("pf:points-earned", onEarn);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("pf:points-earned", onEarn);
      window.removeEventListener("storage", onStorage);
      clearTimeout(tallyTimer.current);
    };
  }, []);
  const shown = usePointsCountUpM(total);
  useEffectM(() => {
    if (!delta) return;
    const t = setTimeout(() => setDelta(null), 1500);
    return () => clearTimeout(t);
  }, [delta]);
  const fill = Math.min(1, total / full);
  const label = total.toLocaleString("en-GB") + " points, " + Math.round(fill * 100) + "% of " + full.toLocaleString("en-GB") + ". Open rewards";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    ref: pillRef,
    type: "button",
    className: "m-pts" + (delta ? " earn" : ""),
    "aria-label": label,
    title: total.toLocaleString("en-GB") + " / " + full.toLocaleString("en-GB") + " pts",
    onClick: () => go("RewardsDashboard.html")
  }, /*#__PURE__*/React.createElement(PointsIconM, null), /*#__PURE__*/React.createElement("span", {
    key: bump,
    className: "m-pts-n" + (bump ? " pop" : "")
  }, shown.toLocaleString("en-GB")), delta && /*#__PURE__*/React.createElement("span", {
    key: delta.key,
    className: "m-pts-delta",
    "aria-hidden": "true"
  }, "+", delta.amt)), tallyHost && /*#__PURE__*/React.createElement(PointsTallyM, {
    host: tallyHost,
    on: tally,
    shown: shown,
    bump: bump,
    delta: delta
  }));
}
const MTopBar = forwardRefM(function MTopBar({
  onMenu,
  onBell,
  onMessages
}, ref) {
  const [showNotif, setShowNotif] = useStateM(true);
  useEffectM(() => {
    const t = setTimeout(() => setShowNotif(false), 5000);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    ref: ref,
    className: "m-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-burger",
    "aria-label": "Menu",
    onClick: onMenu
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:menu",
    size: 24,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement(PointsPillM, null), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Search",
    onClick: () => go("SearchMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.Icon, {
    name: "search",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Notifications",
    onClick: () => {
      setShowNotif(false);
      onBell && onBell();
    }
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:bell",
    size: 20,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")), /*#__PURE__*/React.createElement("button", {
    className: "m-iconbtn",
    "aria-label": "Messages",
    onClick: () => {
      setShowNotif(false);
      onMessages && onMessages();
    }
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 20,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")), showNotif && /*#__PURE__*/React.createElement("div", {
    className: "m-notif",
    role: "status",
    onClick: () => setShowNotif(false)
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-notif-item"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 17,
    color: "var(--white)"
  }), "71"), /*#__PURE__*/React.createElement("span", {
    className: "m-notif-sep"
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-notif-item"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:heart",
    size: 17,
    color: "var(--white)"
  }), "179"), /*#__PURE__*/React.createElement("span", {
    className: "m-notif-sep"
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-notif-item"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:user-plus",
    size: 17,
    color: "var(--white)"
  }), "48")));
});

/* Paid tier ladder, low → high. A viewer's own tier unlocks every rung below
   it too. "sovereign" aligns with the pricing-tier naming used by
   membership-tier.jsx (its "sovereign" plan maps to this same top rung). */
const SM_TIER_LADDER_M = ["confidence", "mastery", "freedom", "sovereign"];
const SM_TIER_META_M = {
  confidence: {
    name: "Confidence"
  },
  mastery: {
    name: "Mastery"
  },
  freedom: {
    name: "Freedom"
  },
  sovereign: {
    name: "Sovereign"
  }
};

/* Tiers that get the single "My Membership" summary card + dedicated chat
   card in the drawer, as opposed to sovereign's stacked tier-card ladder
   (SmTierCard), which shows every tier a sovereign viewer has unlocked. */
const SM_MEMBERSHIP_TIERS_M = ["confidence", "mastery", "freedom"];

/* Rows inside the "My Membership" card — identical across confidence/mastery/
   freedom; freedom appends one extra row (SM_FREEDOM_LECTURE_ROW_M). */
const SM_MEMBERSHIP_ROWS_M = [{
  label: "Membership Training",
  icon: "lucide:graduation-cap",
  href: "LearningMobile.html"
}, {
  label: "Technique Tuesday",
  icon: "lucide:calendar-check",
  href: "EventsMobile.html"
}, {
  label: "Complications Help",
  icon: "lucide:shield-alert",
  href: "DirectMessage.html"
}, {
  label: "AI Coach",
  icon: "lucide:sparkles",
  href: "LearningMobile.html"
}];
const SM_FREEDOM_LECTURE_ROW_M = {
  label: "Freedom Path Lectures",
  icon: "lucide:presentation",
  href: "LearningMobile.html"
};

/* Upgrade-CTA label keyed by the viewer's CURRENT tier — not derivable from
   the next tier's own display name, since mastery's target reads "Freedom
   Path" while freedom's target reads plain "Sovereign". */
const SM_UPGRADE_LABEL_M = {
  free: "Confidence",
  confidence: "Mastery",
  mastery: "Freedom Path",
  freedom: "Sovereign"
};

/* Metal keyed by the viewer's CURRENT tier — which metal the upgrade CTA
   (next rung up) renders in. Bronze by default; silver once the next rung
   is Mastery; gold for Freedom Path / Sovereign. */
const SM_UPGRADE_METAL_M = {
  free: "bronze",
  confidence: "silver",
  mastery: "gold",
  freedom: "gold"
};
/* Metal keyed by a viewer's OWN tier — drives the "My Membership" ribbon. */
const SM_TIER_METAL_M = {
  confidence: "bronze",
  mastery: "silver",
  freedom: "gold"
};
const SM_METAL_ICON_COLOR_M = {
  bronze: "#fff",
  silver: "#3F4650",
  gold: "#5A3A00"
};

/* Accent color per tier, used for the tier-card "YOUR TIER" pill. */
const SM_TIER_COLOR_M = {
  confidence: "var(--info)",
  mastery: "var(--level-intermediate)",
  freedom: "var(--ai-purple)",
  sovereign: "var(--premium-gold-deep)"
};

/* Chat-card label per tier — always routes to CommunityMobile.html. Rendered
   as the first row inside SmMembershipCard, not a separate card. */
const SM_CHAT_LABEL_M = {
  confidence: "Community Chat",
  mastery: "Mastery Chat",
  freedom: "Freedom Path Chat"
};
/* Unread-count badge for that same chat row. Mastery/freedom reuse the counts
   already spec'd for their SM_TIER_RESOURCES_M lounge/circle equivalents. */
const SM_CHAT_BADGE_M = {
  confidence: "10+",
  mastery: 6,
  freedom: "10+"
};
const SM_TIER_RESOURCES_M = {
  confidence: SM_MEMBERSHIP_ROWS_M,
  mastery: [{
    label: "Mastery lounge",
    icon: "lucide:message-circle",
    n: 6,
    href: "CommunityMobile.html"
  }, {
    label: "Advanced masterclasses",
    icon: "lucide:graduation-cap",
    n: 9,
    href: "LearningMobile.html"
  }, {
    label: "Complication library",
    icon: "lucide:file-text",
    n: 18,
    href: "LearningMobile.html"
  }, {
    label: "Live case reviews",
    icon: "lucide:calendar",
    n: 3,
    href: "EventsMobile.html"
  }],
  freedom: [{
    label: "Freedom circle",
    icon: "lucide:message-circle",
    n: 2,
    href: "CommunityMobile.html"
  }, {
    label: "Business playbooks",
    icon: "lucide:graduation-cap",
    n: 7,
    href: "LearningMobile.html"
  }, {
    label: "1:1 mentor sessions",
    icon: "lucide:calendar",
    n: 1,
    href: "EventsMobile.html"
  }],
  sovereign: [{
    label: "Sovereign roundtable",
    icon: "lucide:message-circle",
    n: 4,
    href: "CommunityMobile.html"
  }, {
    label: "Executive mentorship",
    icon: "lucide:calendar",
    n: 1,
    href: "EventsMobile.html"
  }, {
    label: "Legacy case archive",
    icon: "lucide:file-text",
    n: 9,
    href: "LearningMobile.html"
  }, {
    label: "Founder office hours",
    icon: "lucide:calendar",
    n: 2,
    href: "EventsMobile.html"
  }]
};

/* Tiers unlocked by a viewer on `tier`, highest first. Free (no match) unlocks none. */
function smUnlockedTiersM(tier) {
  const i = SM_TIER_LADDER_M.indexOf(tier);
  if (i === -1) return [];
  return SM_TIER_LADDER_M.slice(0, i + 1).reverse();
}
/* The next rung up from `tier` — null once at the top of the ladder. A free
   viewer (tier not on the ladder, i === -1) points at the first rung. */
function smNextTierM(tier) {
  const i = SM_TIER_LADDER_M.indexOf(tier);
  if (i === SM_TIER_LADDER_M.length - 1) return null;
  return SM_TIER_LADDER_M[i + 1];
}
/* window.PF_TIER is set per newsfeed variant page to preview a given tier.
   Falls back to the shared subscription-tier localStorage key from app.jsx
   so today's single NewsfeedMobile.html keeps working unset. */
function smReadTierM() {
  if (window.PF_TIER) return window.PF_TIER;
  try {
    const t = PFAM.getUserTier ? PFAM.getUserTier() : "free";
    return t === "inner" ? "sovereign" : t;
  } catch (e) {
    return "free";
  }
}
const SM_EVENTS = [{
  d: "30",
  m: "JUN",
  label: "Technique Tuesday Webinar",
  t: "8:00 PM",
  access: "open",
  hosts: [{
    name: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png"
  }, {
    name: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg"
  }]
}, {
  d: "5",
  m: "JUL",
  label: "Confidence Masterclass",
  t: "6:00 PM",
  access: "members"
}];
const SM_PROFILE_BEFORE_M = [{
  label: "Edit Profile",
  icon: "lucide:book-open",
  href: "ProfileMobile.html"
}, {
  label: "Account Settings",
  icon: "lucide:graduation-cap",
  href: null
}, {
  label: "Payments",
  icon: "lucide:credit-card",
  href: "PaymentsMobile.html"
}, {
  label: "My Saved",
  icon: "lucide:bookmark",
  href: "MySaved.html"
}, {
  label: "Notifications",
  icon: "lucide:calendar",
  href: "NotificationSettings.html"
}, {
  label: "Privacy & Security",
  icon: "lucide:book-open",
  href: null
}, {
  label: "Display Settings",
  icon: "lucide:cpu",
  href: "DisplaySettings.html"
}];
const NT_BADGE = {
  comment: {
    icon: "fluent:chat-16-filled",
    bg: "var(--brand-navy)"
  },
  reply: {
    icon: "fluent:arrow-reply-16-filled",
    bg: "var(--ai-purple)"
  },
  pinned: {
    icon: "fluent:pin-16-filled",
    bg: "var(--brand-gold)"
  },
  love: {
    icon: "fluent:heart-16-filled",
    bg: "var(--reaction-love)"
  },
  like: {
    icon: "fluent:thumb-like-16-filled",
    bg: "var(--reaction-like)"
  },
  follow: {
    icon: "fluent:person-add-16-filled",
    bg: "var(--ai-purple)"
  },
  appointment: {
    icon: "fluent:calendar-checkmark-16-filled",
    bg: "var(--success)"
  }
};
const NT_CATEGORIES = [{
  key: "comments",
  label: "Comments",
  count: 3,
  items: [{
    who: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    action: "commented on your post",
    detail: "“This is a nice article Katy!”",
    t: "2d ago",
    type: "comment"
  }, {
    who: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    action: "commented on your post",
    detail: "“This is exactly what we needed”",
    t: "3d ago",
    type: "comment"
  }, {
    who: "Dr. Sarah Collins",
    avatar: "assets/avatar-sarah-collins.jpg",
    action: "commented on your post",
    detail: "“Love the new protocol direction”",
    t: "5d ago",
    type: "comment"
  }]
}, {
  key: "replies",
  label: "Replies",
  count: 3,
  items: [{
    who: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    action: "replied to your comment",
    detail: "“Agreed, the results speak for themselves”",
    t: "1d ago",
    type: "reply"
  }, {
    who: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    action: "replied to your comment",
    detail: "“Thanks for clarifying the protocol!”",
    t: "4d ago",
    type: "reply"
  }]
}, {
  key: "pinned",
  label: "Pinned Posts",
  count: 2,
  items: [{
    who: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png",
    action: "pinned your post",
    detail: "“Full-Face Rejuvenation Increased Patient Satisfaction +64%”",
    t: "1w ago",
    type: "pinned"
  }]
}, {
  key: "likes",
  label: "Likes",
  count: 12,
  items: [{
    who: "Miranda Pearce",
    avatar: "assets/avatar-miranda.jpg",
    action: "liked on your comment",
    detail: "“Full-Face Rejuvenation Increased Patient Satisfaction +64%”",
    t: "2h ago",
    type: "love"
  }, {
    who: "Dr. Sarah Collins",
    avatar: "assets/avatar-sarah-collins.jpg",
    action: "liked your post",
    detail: null,
    t: "6h ago",
    type: "like"
  }]
}, {
  key: "appointments",
  label: "Appointments",
  count: 1,
  items: [{
    who: "Jane Harries",
    avatar: null,
    action: "booked new appointment",
    detail: "February 12, 2026, 6:00 PM",
    t: "1d ago",
    rsvp: true,
    type: "appointment"
  }]
}];
const NT_MENU = [{
  label: "Turn off notifications like this",
  icon: "lucide:bell-off"
}, {
  label: "Mute this notification",
  icon: "lucide:volume-x"
}, {
  label: "Hide this notification",
  icon: "lucide:eye-off"
}, {
  label: "Report a problem",
  icon: "lucide:flag"
}, {
  label: "Notification settings",
  icon: "lucide:settings"
}];
function NotifRow({
  n
}) {
  const b = NT_BADGE[n.type];
  const [menu, setMenu] = useStateM(false);
  useEffectM(() => {
    if (!menu) return;
    const close = () => setMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menu]);
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-av"
  }, /*#__PURE__*/React.createElement(DSM.Avatar, {
    name: n.who,
    src: n.avatar,
    size: 56
  }), b && /*#__PURE__*/React.createElement("span", {
    className: "nt-badge",
    style: {
      background: b.bg
    }
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: b.icon,
    size: 14,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nt-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nt-text"
  }, /*#__PURE__*/React.createElement("b", null, n.who), " ", /*#__PURE__*/React.createElement("span", {
    className: "nt-action"
  }, n.action), " ", n.detail && /*#__PURE__*/React.createElement("span", {
    className: "nt-q"
  }, n.detail)), /*#__PURE__*/React.createElement("div", {
    className: "nt-time"
  }, n.t), n.rsvp && /*#__PURE__*/React.createElement("div", {
    className: "nt-rsvp"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-reject"
  }, "Reject"), /*#__PURE__*/React.createElement("button", {
    className: "nt-accept"
  }, "Accept"))), /*#__PURE__*/React.createElement("div", {
    className: "nt-more-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-more",
    "aria-label": "More options",
    "aria-haspopup": "menu",
    "aria-expanded": menu,
    onClick: e => {
      e.stopPropagation();
      setMenu(m => !m);
    }
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:more-vertical",
    size: 20,
    color: "var(--gray-450)"
  })), menu && /*#__PURE__*/React.createElement("div", {
    className: "nt-menu",
    role: "menu",
    onClick: e => e.stopPropagation()
  }, NT_MENU.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.label,
    className: "nt-menu-item",
    role: "menuitem",
    onClick: () => setMenu(false)
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: m.icon,
    size: 19,
    color: "var(--gray-700)"
  }), m.label)))));
}
function NotifCategory({
  cat,
  open,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "nt-cat-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-cat",
    "aria-expanded": open,
    onClick: onToggle
  }, /*#__PURE__*/React.createElement("span", {
    className: "nt-cat-label"
  }, cat.label, " ", /*#__PURE__*/React.createElement("span", {
    className: "nt-cat-count"
  }, cat.count)), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: open ? "lucide:chevron-down" : "lucide:chevron-right",
    size: 20,
    color: "var(--gray-700)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "nt-cat-items"
  }, cat.items.map((n, i) => /*#__PURE__*/React.createElement(NotifRow, {
    key: i,
    n: n
  }))));
}
function NotificationsPanel({
  open,
  onClose
}) {
  const [openCats, setOpenCats] = useStateM(() => {
    const all = {};
    NT_CATEGORIES.forEach(cat => {
      all[cat.key] = true;
    });
    return all;
  });
  function toggleCat(key) {
    setOpenCats(s => ({
      ...s,
      [key]: !s[key]
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer nt-panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nt-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-back",
    "aria-label": "Back",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", null, "Notifications")), /*#__PURE__*/React.createElement("div", {
    className: "nt-body"
  }, NT_CATEGORIES.map(cat => /*#__PURE__*/React.createElement(NotifCategory, {
    key: cat.key,
    cat: cat,
    open: !!openCats[cat.key],
    onToggle: () => toggleCat(cat.key)
  })))));
}
const DM_THREADS_SEED = [{
  id: "tim",
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png",
  online: true,
  unread: 2,
  messages: [{
    me: false,
    text: "Hey Katy! I saw your post about the full-face rejuvenation case.",
    t: "10:12 AM"
  }, {
    me: true,
    text: "Thank you! It was a great result, patient was thrilled.",
    t: "10:20 AM"
  }, {
    me: false,
    text: "Do you mind if I share it with my team as a reference?",
    t: "10:25 AM"
  }, {
    me: true,
    text: "Of course, go ahead — sharing the write-up now.",
    t: "10:28 AM"
  }, {
    me: false,
    text: "Thanks for sharing the case study. Really helpful!",
    t: "10:30 AM"
  }]
}, {
  id: "sarah",
  name: "Dr Sarah Kim",
  avatar: null,
  online: true,
  unread: 1,
  messages: [{
    me: false,
    text: "Are you free to go over the Q3 protocol updates this week?",
    t: "9:40 AM"
  }, {
    me: true,
    text: "Yes, Thursday afternoon works for me.",
    t: "9:52 AM"
  }, {
    me: false,
    text: "Looking forward to our next meeting!",
    t: "11:00 AM"
  }]
}, {
  id: "emily",
  name: "Dr Emily Tran",
  avatar: null,
  online: false,
  unread: 3,
  messages: [{
    me: false,
    text: "Just finished reviewing the patient satisfaction data.",
    t: "10:50 AM"
  }, {
    me: false,
    text: "There's a trend worth flagging in the 45+ age group.",
    t: "11:05 AM"
  }, {
    me: false,
    text: "I have some additional insights to share.",
    t: "11:15 AM"
  }]
}, {
  id: "james",
  name: "Dr James Brown",
  avatar: null,
  online: false,
  unread: 0,
  muted: true,
  messages: [{
    me: true,
    text: "Sent over the full results deck this morning.",
    t: "11:05 AM"
  }, {
    me: false,
    text: "Can we discuss the implications of the results?",
    t: "11:30 AM"
  }]
}, {
  id: "alex",
  name: "Dr Alex Chen",
  avatar: null,
  online: true,
  unread: 0,
  messages: [{
    me: false,
    text: "The dosing charts you put together are excellent.",
    t: "11:40 AM"
  }, {
    me: false,
    text: "Great work on the data analysis!",
    t: "11:45 AM"
  }]
}, {
  id: "miranda",
  name: "Miranda Pearce",
  avatar: "assets/avatar-miranda.jpg",
  online: false,
  unread: 0,
  messages: [{
    me: true,
    text: "Sharing the confidence-score writeup with you now.",
    t: "11:50 AM"
  }, {
    me: false,
    text: "Perfect, thank you — this is exactly what I needed.",
    t: "12:00 PM"
  }]
}, {
  id: "sarahc",
  name: "Dr. Sarah Collins",
  avatar: "assets/avatar-sarah-collins.jpg",
  online: true,
  unread: 0,
  messages: [{
    me: false,
    text: "Uploading tonight's case: 34F, mid-face volume loss, 2ml Voluma.",
    t: "Yesterday"
  }, {
    me: true,
    text: "Brilliant — I'll review before Thursday's call.",
    t: "Yesterday"
  }]
}, {
  id: "g-casereview",
  isGroup: true,
  name: "Clinical Case Review",
  unread: 3,
  members: [{
    id: "tim",
    name: "Dr Tim Pearce",
    avatar: "assets/avatar-drtim.png"
  }, {
    id: "sarahc",
    name: "Dr. Sarah Collins",
    avatar: "assets/avatar-sarah-collins.jpg"
  }, {
    id: "alex",
    name: "Dr Alex Chen",
    avatar: null
  }],
  messages: [{
    me: false,
    sender: "Dr Tim Pearce",
    text: "Katy, can you present your lip case at the review too?",
    t: "9m"
  }]
}, {
  id: "amir",
  name: "Dr Amir Khan",
  avatar: "assets/avatar-amir-khan.jpg",
  online: false,
  unread: 0,
  messages: [{
    me: false,
    text: "Katy, the dental block technique video is live in the Mastery library.",
    t: "Mon"
  }, {
    me: true,
    text: "Brilliant, watching it tonight. Thanks Amir!",
    t: "Mon"
  }]
}, {
  id: "mark",
  name: "Mark Ellis",
  avatar: "assets/avatar-mark-ellis.jpg",
  online: true,
  unread: 0,
  messages: [{
    me: false,
    text: "Quick one — what CRM are you using for recall reminders?",
    t: "Sun"
  }, {
    me: true,
    text: "We moved to Pabau last quarter, happy to walk you through it.",
    t: "Sun"
  }]
}, {
  id: "beth",
  name: "Nurse Beth",
  avatar: "assets/avatar-nurse-beth.jpg",
  online: false,
  unread: 0,
  messages: [{
    me: false,
    text: "Loved your consultation framework post 🙌",
    t: "Sat"
  }, {
    me: true,
    text: "Thanks Beth! Ping me if you want the template.",
    t: "Sat"
  }]
}, {
  id: "priya",
  name: "Priya Shah",
  avatar: "assets/avatar-priya-shah.jpg",
  online: true,
  unread: 0,
  messages: [{
    me: false,
    text: "Are you going to the London masterclass in October?",
    t: "Fri"
  }, {
    me: true,
    text: "Booked! See you there.",
    t: "Fri"
  }]
}, {
  id: "hannah",
  name: "Dr Hannah Reid",
  avatar: null,
  online: false,
  unread: 0,
  messages: [{
    me: false,
    text: "Thanks for the referral pathway notes.",
    t: "2 Sep"
  }, {
    me: true,
    text: "Anytime, Hannah.",
    t: "2 Sep"
  }]
}];
const VOICE_CONFS_SEED = [{
  id: "vc1",
  name: "Clinical Case Review",
  who: "Dr Tim Pearce, Dr Sarah Kim +3",
  t: "Today, 4:00 PM",
  live: true
}, {
  id: "vc2",
  name: "Business Growth Sync",
  who: "Miranda Pearce, Dr Alex Chen",
  t: "Tomorrow, 10:00 AM",
  live: false
}];
const PF_GROUPS_KEY = "pf-dm-groups";

/* The DS Avatar takes the first letter of the first two words — strip the
   honorific so "Dr Sarah Kim" reads SK, not DS. */
function avatarNameM(name) {
  return String(name || "").replace(/^(dr\.?|nurse|prof\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "");
}
function readDmGroupsM() {
  try {
    return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function groupDisplayNameM(members) {
  const names = members.map(m => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}
function createDmGroupM(members, customName) {
  const hasCustomName = !!(customName || "").trim();
  const group = {
    id: "group-" + Date.now(),
    isGroup: true,
    customName: hasCustomName,
    name: hasCustomName ? customName.trim() : groupDisplayNameM(members),
    members,
    messages: []
  };
  const groups = readDmGroupsM();
  groups.unshift(group);
  try {
    localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {}
  return group;
}
function GroupAvatarStackM({
  members,
  size
}) {
  const s = size || 52;
  return /*#__PURE__*/React.createElement("span", {
    className: "mp-group-av",
    style: {
      width: s,
      height: s
    }
  }, members.slice(0, 2).map((m, i) => /*#__PURE__*/React.createElement("span", {
    className: "mp-group-av-item",
    key: m.id || i
  }, /*#__PURE__*/React.createElement(DSM.Avatar, {
    name: avatarNameM(m.name),
    src: m.avatar,
    size: Math.round(s * 0.68)
  }))));
}
function MessagesRow({
  c,
  onOpen
}) {
  const last = c.messages && c.messages.length ? c.messages[c.messages.length - 1] : null;
  return /*#__PURE__*/React.createElement("button", {
    className: "mp-row",
    "data-thread-id": c.id,
    onClick: onOpen
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av"
  }, c.isGroup ? /*#__PURE__*/React.createElement(GroupAvatarStackM, {
    members: c.members
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSM.Avatar, {
    name: avatarNameM(c.name),
    src: c.avatar,
    size: 52
  }), c.online && /*#__PURE__*/React.createElement("span", {
    className: "dm-online-dot"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "mp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-name"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "mp-time"
  }, last ? last.t : "")), /*#__PURE__*/React.createElement("span", {
    className: "mp-row-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-preview"
  }, last ? last.text : c.isGroup ? c.members.length + " members" : ""), c.muted ? /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:bell-off",
    size: 16,
    color: "var(--gray-450)"
  }) : c.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "mp-badge"
  }, c.unread))));
}
function NewConversationScreenM({
  contacts,
  picked,
  onToggle,
  query,
  onQuery,
  groupName,
  onGroupName,
  onBack,
  onCreate
}) {
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  const count = picked.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-new",
    "data-screen-label": "New Conversation"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nt-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-back",
    "aria-label": "Back to messages",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "20px",
      fontWeight: "700"
    }
  }, "New Conversation")), /*#__PURE__*/React.createElement("div", {
    className: "nt-search mp-search"
  }, /*#__PURE__*/React.createElement(DSM.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search people",
    "aria-label": "Search people",
    value: query,
    onChange: e => onQuery(e.target.value)
  })), count > 1 && /*#__PURE__*/React.createElement("div", {
    className: "mp-new-namewrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "mp-new-nameinput",
    placeholder: "Name this group (optional)",
    "aria-label": "Group name",
    value: groupName,
    onChange: e => onGroupName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mp-new-list"
  }, filtered.map(c => {
    const on = picked.includes(c.id);
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      className: "mp-new-row" + (on ? " on" : ""),
      onClick: () => onToggle(c.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mp-av"
    }, /*#__PURE__*/React.createElement(DSM.Avatar, {
      name: avatarNameM(c.name),
      src: c.avatar,
      size: 44
    })), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-name"
    }, c.name), /*#__PURE__*/React.createElement("span", {
      className: "mp-new-check" + (on ? " on" : "")
    }, on && /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
      name: "lucide:check",
      size: 13,
      color: "#fff"
    })));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "mp-new-empty"
  }, "No people found.")), /*#__PURE__*/React.createElement("div", {
    className: "mp-new-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-new-count"
  }, count, " selected"), /*#__PURE__*/React.createElement("button", {
    className: "mp-new-create",
    disabled: count === 0,
    onClick: onCreate
  }, count > 1 ? "Create Group" : "Start Chat")));
}
function VoiceConfRow({
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mp-row mp-vc-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-av mp-vc-icon"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:phone-call",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "mp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-name"
  }, v.name), v.live && /*#__PURE__*/React.createElement("span", {
    className: "mp-vc-live"
  }, "LIVE")), /*#__PURE__*/React.createElement("span", {
    className: "mp-row-bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mp-preview"
  }, v.who)), /*#__PURE__*/React.createElement("span", {
    className: "mp-vc-time"
  }, v.t)));
}
function MessagesPanel({
  open,
  onClose
}) {
  const [tab, setTab] = useStateM("messages");
  const [query, setQuery] = useStateM("");
  const [screen, setScreen] = useStateM("list");
  const [groups, setGroups] = useStateM([]);
  const [picked, setPicked] = useStateM([]);
  const [ncQuery, setNcQuery] = useStateM("");
  const [groupName, setGroupName] = useStateM("");
  useEffectM(() => {
    if (!open) {
      setQuery("");
      setScreen("list");
      setPicked([]);
      setNcQuery("");
      setGroupName("");
    } else {
      setGroups(readDmGroupsM());
    }
  }, [open]);
  const allThreads = [...groups, ...DM_THREADS_SEED];
  const filtered = allThreads.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const unreadTotal = DM_THREADS_SEED.reduce((n, t) => n + (t.unread || 0), 0);
  function openThread(id) {
    go("Messages.html?t=" + id);
  }
  function togglePick(id) {
    setPicked(all => all.includes(id) ? all.filter(x => x !== id) : [...all, id]);
  }
  function handleCreate() {
    if (picked.length === 0) return;
    if (picked.length === 1) {
      openThread(picked[0]);
      return;
    }
    const members = DM_THREADS_SEED.filter(c => picked.includes(c.id)).map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar
    }));
    const group = createDmGroupM(members, groupName);
    openThread(group.id);
  }
  if (screen === "new") {
    return /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-wrap" + (open ? " open" : ""),
      "aria-hidden": !open
    }, /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("aside", {
      className: "m-drawer nt-panel mp-panel",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "New Conversation"
    }, /*#__PURE__*/React.createElement(NewConversationScreenM, {
      contacts: DM_THREADS_SEED.filter(c => !c.isGroup),
      picked: picked,
      onToggle: togglePick,
      query: ncQuery,
      onQuery: setNcQuery,
      groupName: groupName,
      onGroupName: setGroupName,
      onBack: () => setScreen("list"),
      onCreate: handleCreate
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer nt-panel mp-panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Messages"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nt-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nt-back",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "26px",
      fontWeight: "700"
    }
  }, "Messages"), /*#__PURE__*/React.createElement("button", {
    className: "mp-expand",
    "aria-label": "Open Messages",
    onClick: () => go("Messages.html")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:maximize-2",
    size: 20,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "mp-compose",
    "aria-label": "New message",
    onClick: () => setScreen("new")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:square-pen",
    size: 20,
    color: "var(--gray-900)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mp-tabs",
    role: "tablist",
    "aria-label": "Messages or voice conference"
  }, /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": tab === "messages",
    className: "mp-tab" + (tab === "messages" ? " on" : ""),
    onClick: () => setTab("messages")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 16,
    color: tab === "messages" ? "var(--brand-navy)" : "var(--gray-450)"
  }), "Messages", unreadTotal > 0 && /*#__PURE__*/React.createElement("span", {
    className: "mp-tab-badge"
  }, unreadTotal)), /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": tab === "voice",
    className: "mp-tab" + (tab === "voice" ? " on" : ""),
    onClick: () => setTab("voice")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:phone",
    size: 16,
    color: tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"
  }), "Voice Conference", /*#__PURE__*/React.createElement("span", {
    className: "mp-tab-badge"
  }, VOICE_CONFS_SEED.length))), /*#__PURE__*/React.createElement("div", {
    className: "nt-search mp-search"
  }, /*#__PURE__*/React.createElement(DSM.Icon, {
    name: "search",
    size: 20,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search messages",
    "aria-label": "Search messages",
    value: query,
    onChange: e => setQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "nt-body mp-body"
  }, tab === "messages" ? filtered.map(c => /*#__PURE__*/React.createElement(MessagesRow, {
    key: c.id,
    c: c,
    onOpen: () => openThread(c.id)
  })) : VOICE_CONFS_SEED.map(v => /*#__PURE__*/React.createElement(VoiceConfRow, {
    key: v.id,
    v: v
  })))));
}
function useDarkModeM() {
  const [dark, setDark] = useStateM(() => {
    try {
      return localStorage.getItem('pf-theme') === 'dark';
    } catch (e) {
      return false;
    }
  });
  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem('pf-theme', next ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    } catch (e) {}
  }
  return [dark, toggle];
}
function SmDarkSwitch({
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "sm-switch" + (on ? " on" : ""),
    onClick: onToggle,
    role: "switch",
    "aria-checked": on,
    "aria-label": on ? "Switch to light mode" : "Switch to dark mode"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-knob"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: on ? "lucide:moon" : "lucide:sun",
    size: 13,
    color: on ? "#1A1736" : "var(--gray-450)"
  })));
}
function SmDisplayCard({
  dark,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-display-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm-display-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-display-label"
  }, "Display"), /*#__PURE__*/React.createElement(SmDarkSwitch, {
    on: dark,
    onToggle: onToggle
  })), /*#__PURE__*/React.createElement("p", {
    className: "sm-display-desc"
  }, "Adjust the appearance of the app to reduce glare and give your eyes a break"));
}
function SmSection({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sm-sec-h"
  }, title);
}
function SmTierResourceRow({
  r
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "smt-resource",
    onClick: () => go(r.href)
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: r.icon,
    size: 20,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "smt-resource-label"
  }, r.label), r.n != null && /*#__PURE__*/React.createElement("span", {
    className: "smt-badge"
  }, r.n), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  }));
}
function SmTierCard({
  tierKey,
  isOwn
}) {
  const resources = SM_TIER_RESOURCES_M[tierKey];
  const color = SM_TIER_COLOR_M[tierKey];
  return /*#__PURE__*/React.createElement("div", {
    className: "smt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "smt-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "smt-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "smt-name"
  }, SM_TIER_META_M[tierKey].name, " Path")), isOwn ? /*#__PURE__*/React.createElement("span", {
    className: "smt-pill smt-pill-yours",
    style: {
      color,
      borderColor: color
    }
  }, "YOUR TIER") : /*#__PURE__*/React.createElement("span", {
    className: "smt-pill"
  }, "INCLUDED")), /*#__PURE__*/React.createElement("div", {
    className: "smt-resources"
  }, resources.map(r => /*#__PURE__*/React.createElement(SmTierResourceRow, {
    key: r.label,
    r: r
  }))));
}
function SmMembershipCard({
  tier
}) {
  const chatRow = {
    label: SM_CHAT_LABEL_M[tier],
    icon: "lucide:message-circle",
    href: "CommunityMobile.html",
    n: SM_CHAT_BADGE_M[tier]
  };
  const rows = tier === "freedom" ? [SM_FREEDOM_LECTURE_ROW_M, chatRow, ...SM_MEMBERSHIP_ROWS_M] : [chatRow, ...SM_MEMBERSHIP_ROWS_M];
  const metal = SM_TIER_METAL_M[tier];
  return /*#__PURE__*/React.createElement("div", {
    className: "smt-card sm-membership-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "smt-head sm-membership-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-membership-title"
  }, "MY MEMBERSHIP"), /*#__PURE__*/React.createElement("span", {
    className: "sm-memb-ribbon sm-memb-ribbon-" + metal
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-memb-ribbon-text"
  }, SM_TIER_META_M[tier].name, " Path"))), /*#__PURE__*/React.createElement("div", {
    className: "smt-resources"
  }, rows.map(r => /*#__PURE__*/React.createElement(SmTierResourceRow, {
    key: r.label,
    r: r
  }))));
}
function SideMenu({
  open,
  onClose
}) {
  const [dark, toggleDark] = useDarkModeM();
  const tier = smReadTierM();
  const unlockedTiers = smUnlockedTiersM(tier);
  const nextTier = smNextTierM(tier);
  const showMyMembership = SM_MEMBERSHIP_TIERS_M.includes(tier);
  const showTierCards = !showMyMembership && unlockedTiers.length > 0;
  const burgerRefM = useRefM(null);
  useEffectM(() => {
    if (!open) return;
    burgerRefM.current = document.querySelector('.m-burger');
    const onKey = e => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      burgerRefM.current && burgerRefM.current.focus();
    };
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-wrap" + (open ? " open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-drawer-scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "m-drawer",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-profile",
    onClick: () => go("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.Avatar, {
    name: PFAM.ME.name,
    src: PFAM.ME.avatar,
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-dp-name"
  }, "Katy Wilson", /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:badge-check",
    size: 18,
    color: "var(--reaction-like)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "m-dp-role"
  }, "Registered Nurse")), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 22,
    color: "var(--gray-800)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sm-body"
  }, nextTier && (() => {
    const upgradeMetal = SM_UPGRADE_METAL_M[tier] || "bronze";
    const upgradeIconColor = SM_METAL_ICON_COLOR_M[upgradeMetal];
    return /*#__PURE__*/React.createElement("button", {
      className: "sm-upgrade metal-" + upgradeMetal,
      onClick: () => go("MembershipTier.html")
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-upgrade-icon"
    }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
      name: "lucide:gem",
      size: 20,
      color: upgradeIconColor
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-upgrade-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-upgrade-title"
    }, "Upgrade to ", SM_UPGRADE_LABEL_M[tier]), /*#__PURE__*/React.createElement("span", {
      className: "sm-upgrade-sub"
    }, "Unlock more premium channels & courses")), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 20,
      color: upgradeIconColor
    }));
  })(), showMyMembership && /*#__PURE__*/React.createElement(SmMembershipCard, {
    tier: tier
  }), showTierCards && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SmSection, {
    title: "My Membership"
  }), /*#__PURE__*/React.createElement("div", {
    className: "smt-list"
  }, unlockedTiers.map(tKey => /*#__PURE__*/React.createElement(SmTierCard, {
    key: tKey,
    tierKey: tKey,
    isOwn: tKey === tier
  })))), /*#__PURE__*/React.createElement("button", {
    className: "sm-primary-card",
    onClick: () => go("LearningMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-primary-icon"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:graduation-cap",
    size: 22,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "sm-primary-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-primary-title"
  }, "My Learning"), /*#__PURE__*/React.createElement("span", {
    className: "sm-primary-sub"
  }, "Courses, protocols & certificates")), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })), /*#__PURE__*/React.createElement(SmSection, {
    title: "Upcoming Events"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sm-events"
  }, SM_EVENTS.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.label,
    className: "sm-event",
    onClick: () => go("EventsMobile.html")
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-date"
  }, /*#__PURE__*/React.createElement("b", null, e.d), /*#__PURE__*/React.createElement("i", null, e.m)), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sm-event-name"
  }, e.label), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-time"
  }, e.t), e.hosts && /*#__PURE__*/React.createElement("span", {
    className: "sm-event-hosts"
  }, /*#__PURE__*/React.createElement(GroupAvatarStackM, {
    members: e.hosts,
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-hosts-label"
  }, "Dr Tim Pearce & Miranda Pearce"))), /*#__PURE__*/React.createElement("span", {
    className: "sm-event-access" + (e.access === "members" ? " sm-event-access-members" : " sm-event-access-open")
  }, e.access === "members" ? "Members only" : "Open to all")))), /*#__PURE__*/React.createElement(SmSection, {
    title: "My Profile"
  }), /*#__PURE__*/React.createElement("button", {
    className: "sm-row sm-verify",
    onClick: () => go("ProfileMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:book-open",
    size: 23,
    color: "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, "Verify Profile"), /*#__PURE__*/React.createElement("span", {
    className: "sm-verify-pill"
  }, "Not Verified")), /*#__PURE__*/React.createElement("nav", {
    className: "sm-list"
  }, SM_PROFILE_BEFORE_M.map(c => c.label === "Display Settings" ? /*#__PURE__*/React.createElement(SmDisplayCard, {
    key: c.label,
    dark: dark,
    onToggle: toggleDark
  }) : /*#__PURE__*/React.createElement("button", {
    key: c.label,
    className: "sm-row",
    onClick: () => c.href && go(c.href)
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: c.icon,
    size: 23,
    color: "var(--gray-900)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sm-row-label"
  }, c.label), /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:chevron-right",
    size: 20,
    color: "var(--gray-450)"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "m-drawer-logout",
    onClick: () => go("AuthMobile.html?view=signin")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:log-out",
    size: 22,
    color: "var(--error)"
  }), "Logout"))));
}
const MTabBar = forwardRefM(function MTabBar({
  compact
}, ref) {
  return /*#__PURE__*/React.createElement("nav", {
    ref: ref,
    className: "m-tabs" + (compact ? " m-tabs-compact" : ""),
    "aria-label": "Primary"
  }, M_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "m-tab" + (t.key === "Home" ? " on" : ""),
    "aria-current": t.key === "Home" ? "page" : undefined,
    onClick: () => t.href && go(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: t.icon,
    size: 20,
    color: t.key === "Home" ? "#fff" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, t.label))));
});
function useHeaderHideM(scrollRef) {
  const [state, setState] = useStateM({
    hidden: false,
    floating: false
  });
  useEffectM(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const dy = y - lastY;
      setState(prev => {
        let hidden = prev.hidden;
        if (y < 40) hidden = false;else if (dy > 6) hidden = true;else if (dy < -6) hidden = false;
        return {
          hidden,
          floating: y > 40
        };
      });
      lastY = y;
    };
    el.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}

/* Pull-to-refresh: drag down from the top of a scroll container past
   THRESHOLD to fire onRefresh. Tracks the finger with pointer events (works
   for touch and mouse-drag alike) rather than native scroll, since a nested
   .m-scroll div never sees the browser's own overscroll-triggered refresh.
   onRefresh may return a promise — the spinner holds at THRESHOLD height
   until it resolves, then the pulled content collapses back to 0. */
function usePullToRefreshM(scrollRef, onRefresh) {
  const THRESHOLD = 64;
  const MAX = 90;
  const [pull, setPullM] = useStateM(0);
  const [dragging, setDraggingM] = useStateM(false);
  const [refreshing, setRefreshingM] = useStateM(false);
  const dragRefM = useRefM({
    active: false,
    startY: 0
  });
  const busyRefM = useRefM(false);
  const onRefreshRefM = useRefM(onRefresh);
  onRefreshRefM.current = onRefresh;
  useEffectM(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onDown = e => {
      if (busyRefM.current || el.scrollTop > 0) return;
      dragRefM.current = {
        active: true,
        startY: e.clientY
      };
      setDraggingM(true);
    };
    const onMove = e => {
      if (!dragRefM.current.active) return;
      const dy = e.clientY - dragRefM.current.startY;
      if (dy <= 0 || el.scrollTop > 0) {
        dragRefM.current.active = false;
        setDraggingM(false);
        setPullM(0);
        return;
      }
      e.preventDefault();
      setPullM(Math.min(MAX, dy * 0.45));
    };
    const onUp = () => {
      if (!dragRefM.current.active) return;
      dragRefM.current.active = false;
      setDraggingM(false);
      setPullM(p => {
        if (p < THRESHOLD) return 0;
        busyRefM.current = true;
        setRefreshingM(true);
        Promise.resolve(onRefreshRefM.current()).then(() => {
          busyRefM.current = false;
          setRefreshingM(false);
          setPullM(0);
        });
        return THRESHOLD;
      });
    };
    el.addEventListener("pointerdown", onDown, {
      passive: true
    });
    el.addEventListener("pointermove", onMove, {
      passive: false
    });
    el.addEventListener("pointerup", onUp, {
      passive: true
    });
    el.addEventListener("pointercancel", onUp, {
      passive: true
    });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);
  return {
    pull,
    dragging,
    refreshing,
    threshold: THRESHOLD
  };
}
function MobileHome() {
  const [menuOpen, setMenuOpen] = useStateM(false);
  const [notifOpen, setNotifOpen] = useStateM(false);
  const [msgOpen, setMsgOpen] = useStateM(false);
  const scrollRefM = useRefM(null);
  const headerRefM = useRefM(null);
  const tabsRefM = useRefM(null);
  const [headerH, setHeaderH] = useStateM(0);
  const [tabsH, setTabsH] = useStateM(0);
  const [feedKeyM, setFeedKeyM] = useStateM(0);
  const {
    hidden: chromeHidden,
    floating: chromeFloat
  } = useHeaderHideM(scrollRefM);
  /* Same reset the newsfeed applies on an actual browser reload (see
     app.jsx's clearUserPostsOnReload) — dropping the composed-post pin and
     remounting Feed puts the designed per-block sequence back on top,
     without a full page navigation. */
  const handleRefreshM = () => new Promise(resolve => {
    try {
      localStorage.removeItem("pf-newsfeed-user-posts");
    } catch (e) {}
    setTimeout(() => {
      setFeedKeyM(k => k + 1);
      if (scrollRefM.current) scrollRefM.current.scrollTop = 0;
      resolve();
    }, 600);
  });
  const {
    pull,
    dragging,
    refreshing
  } = usePullToRefreshM(scrollRefM, handleRefreshM);
  useEffectM(() => {
    const el = scrollRefM.current;
    if (!el || !window.pfRestoreScroll) return;
    window.pfRestoreScroll(el);
  }, []);
  useLayoutEffectM(() => {
    const el = headerRefM.current;
    if (!el) return;
    const measure = () => setHeaderH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffectM(() => {
    const el = tabsRefM.current;
    if (!el) return;
    const measure = () => setTabsH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "m-screen" + (chromeHidden ? " chrome-hidden" : "") + (chromeFloat ? " chrome-float" : ""),
    "data-screen-label": "Home (mobile)"
  }, /*#__PURE__*/React.createElement(PushNotifBanner, null), /*#__PURE__*/React.createElement(MTopBar, {
    ref: headerRefM,
    onMenu: () => setMenuOpen(true),
    onBell: () => setNotifOpen(true),
    onMessages: () => setMsgOpen(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: "m-scroll",
    ref: scrollRefM,
    style: {
      paddingTop: chromeHidden ? 0 : headerH,
      paddingBottom: tabsH + 34,
      "--m-stick": chromeHidden ? "58px" : "0px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-pull-refresh",
    style: {
      height: pull,
      transition: dragging ? "none" : "height .25s cubic-bezier(.22,.61,.36,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-pull-spinner" + (refreshing ? " is-spinning" : ""),
    style: !refreshing ? {
      transform: `rotate(${pull * 3.2}deg)`
    } : undefined
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:refresh-cw",
    size: 18,
    color: "var(--brand-navy)"
  }))), /*#__PURE__*/React.createElement(PFAM.Feed, {
    key: feedKeyM
  })), /*#__PURE__*/React.createElement(MTabBar, {
    ref: tabsRefM,
    compact: chromeHidden
  }), /*#__PURE__*/React.createElement("button", {
    className: "m-fab" + (chromeHidden ? " m-fab-compact" : ""),
    "aria-label": "Share a Post",
    onClick: () => go("CreatePostMobile.html")
  }, /*#__PURE__*/React.createElement(DSM.IconifyIcon, {
    name: "lucide:plus",
    size: 16,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "Share a Post")), /*#__PURE__*/React.createElement(SideMenu, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }), /*#__PURE__*/React.createElement(NotificationsPanel, {
    open: notifOpen,
    onClose: () => setNotifOpen(false)
  }), /*#__PURE__*/React.createElement(MessagesPanel, {
    open: msgOpen,
    onClose: () => setMsgOpen(false)
  }));
}
function useDeviceScaleM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateM(calc);
  useEffectM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileM() {
  const [mobile, setMobile] = useStateM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function MobileApp() {
  const mobile = useIsMobileM();
  const scale = useDeviceScaleM();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(MobileHome, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(MobileHome, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(MobileApp, null));
