/* ===========================================================================
   PROfinity — Shared mobile chrome (top bar + side menu + notifications)
   Self-contained; loaded on Learning/Profile/Community/Events mobile pages so
   they get the same header as the Newsfeed. Suffixed -C to avoid scope clashes;
   does NOT depend on window.PFApp. Exposes window.MobileChromeC.
   =========================================================================== */
(function () {
  const {
    useState: useStateC,
    useEffect: useEffectC
  } = React;
  const DSC = window.ProfinityDesignSystem_c2b5cc;
  function goC(url) {
    (window.pfGo || function (u) {
      window.location.href = u;
    })(url);
  }

  /* Same "pf-subscription-tier" key the newsfeed/community/membership pages
     read and write — this file doesn't load app.jsx, so it keeps its own
     tiny copy rather than depending on window.PFApp. */
  const PF_TIER_KEY_C = "pf-subscription-tier";
  /* A shell that pins a variant (window.PF_TIER, set before the app scripts
     load) wins over the stored tier — same rule as learning-mobile.jsx. */
  function getUserTierC() {
    if (window.PF_TIER) return window.PF_TIER;
    try {
      return localStorage.getItem(PF_TIER_KEY_C) || "free";
    } catch (e) {
      return "free";
    }
  }
  const ME_C = {
    name: "Katy Wilson",
    avatar: "assets/avatar-katy.jpg"
  };

  /* Membership ladder — the upgrade banner should point at the next rung up,
     not repeat the tier the viewer already holds. A free viewer (no tier,
     indexOf === -1) points at the first rung rather than reading as "top". */
  const SM_TIER_LADDER_C = ["confidence", "mastery", "freedom", "inner"];
  const SM_TIER_META_C = {
    confidence: {
      name: "Confidence"
    },
    mastery: {
      name: "Mastery"
    },
    freedom: {
      name: "Freedom"
    },
    inner: {
      name: "Inner Circle"
    }
  };
  const SM_TIER_RESOURCES_C = {
    confidence: [{
      label: "Community Chat",
      icon: "lucide:message-circle",
      href: "CommunityMobile.html"
    }, {
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
    }],
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
    inner: [{
      label: "Inner Circle roundtable",
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
  function smUnlockedTiersC(tier) {
    const i = SM_TIER_LADDER_C.indexOf(tier);
    if (i === -1) return [];
    return SM_TIER_LADDER_C.slice(0, i + 1).reverse();
  }
  /* The next rung up from `tier` — null once at the top of the ladder. */
  function smNextTierC(tier) {
    const i = SM_TIER_LADDER_C.indexOf(tier);
    if (i === SM_TIER_LADDER_C.length - 1) return null;
    return SM_TIER_LADDER_C[i + 1];
  }

  /* ===== header points pill ===================================================
     The member's lifetime gamification points, sat between the logo and the
     search icon. Icon is the smiling-face Lottie (lottie.host ArWGbXL6R3) fed
   as raw JSON through
     lottie-web (never the lottie.host /embed iframe — it caches hard and
     ignores re-publishes). Reads window.PFLoyalty when loyalty-engine.js is on
     the page and falls back to the engine's seeded headline otherwise; a
     `pf:points-earned` event (dispatched by popPoints in app.jsx) bumps the
     total live and books it in the engine so Rewards stays in step.
      The number reads gold (#D9A21B, #F5C542 in dark mode) and the earn tint is the artwork's amber (#FCC25D); the tooltip
     still reads lifetime points against the engine's beakerFullPoints scale. */
  const PTS_LOTTIE_SRCC = "https://lottie.host/f5203bff-edd1-4727-a629-2a619bbe4edc/ArWGbXL6R3.json";
  const PTS_LOTTIE_LIBC = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
  const PTS_FALLBACKC = 14000;
  const PTS_FULL_FALLBACKC = 20000;
  let ptsLottiePromiseC = null;
  function ptsLottieDataC() {
    if (!ptsLottiePromiseC) {
      ptsLottiePromiseC = fetch(PTS_LOTTIE_SRCC).then(r => r.ok ? r.json() : null).catch(() => {
        ptsLottiePromiseC = null;
        return null;
      });
    }
    return ptsLottiePromiseC;
  }
  /* Same data-pf-lottie marker as app.jsx / tour.js so the lib is injected once. */
  function ptsEnsureLottieLibC() {
    if (window.lottie || document.querySelector("script[data-pf-lottie]")) return;
    const sc = document.createElement("script");
    sc.src = PTS_LOTTIE_LIBC;
    sc.async = true;
    sc.setAttribute("data-pf-lottie", "1");
    document.head.appendChild(sc);
  }
  function ptsReduceMotionC() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function ptsReadTotalC() {
    const eng = window.PFLoyalty;
    if (eng) {
      try {
        return Math.max(0, Math.round(eng.getState().lifetimePoints || 0));
      } catch (e) {/* fall through */}
    }
    return PTS_FALLBACKC;
  }
  /* Lifetime points scale for the pill's tooltip — the engine's
     beakerFullPoints config (20,000), shared with the Rewards card. */
  function ptsReadFullC() {
    const eng = window.PFLoyalty;
    if (eng && eng.getConfig) {
      try {
        return Math.max(1, +eng.getConfig().beakerFullPoints || PTS_FULL_FALLBACKC);
      } catch (e) {/* fall through */}
    }
    return PTS_FULL_FALLBACKC;
  }
  function PointsIconC() {
    const host = React.useRef(null);
    const [ready, setReady] = useStateC(false);
    useEffectC(() => {
      let anim,
        iv,
        cancelled = false;
      const still = ptsReduceMotionC();
      function start() {
        if (cancelled || !window.lottie || !host.current) return;
        ptsLottieDataC().then(data => {
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
      ptsEnsureLottieLibC();
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:smile",
      size: 18,
      color: "#FCC25D"
    })), /*#__PURE__*/React.createElement("span", {
      ref: host,
      className: "m-pts-ic-anim" + (ready ? " on" : "")
    }));
  }

  /* Tweened display value: eases from the previous total to the new one so an
     earned +15 visibly ticks the counter up instead of jumping. */
  function usePointsCountUpC(target) {
    const [shown, setShown] = useStateC(target);
    const from = React.useRef(target);
    useEffectC(() => {
      const start = from.current;
      if (start === target) return;
      if (ptsReduceMotionC() || typeof requestAnimationFrame !== "function") {
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
  const PTS_TALLY_HOLDC = 2400;
  /* True when the header pill is actually on screen: it needs a box inside the
     viewport, no faded/hidden ancestor, and it must win a hit-test at its own
     centre — a header slid away with translateY(-100%) + pointer-events:none, a
     pill faded out in chrome-float, or any sheet / scrim lying over it
     (Comments, drawer, modal) all fail that. */
  function ptsPillVisibleC(el) {
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
  function ptsTallyHostC(el) {
    return el && el.closest && el.closest(".m-screen, .lm-screen, .ml-screen, .ag-screen, .cm-screen, .pm-screen, .ev-screen") || document.body;
  }
  /* Drops in under the status bar with the same icon, shows the same total
     counting up with the "+N" delta, and slides away PTS_TALLY_HOLDC after the
     last payout. Mounted on first use and then kept (hidden) so the Lottie
     isn't reloaded for every payout. */
  function PointsTallyC({
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
      onClick: () => goC("RewardsDashboard.html")
    }, /*#__PURE__*/React.createElement(PointsIconC, null), /*#__PURE__*/React.createElement("span", {
      key: bump,
      className: "m-pts-n" + (bump ? " pop" : "")
    }, shown.toLocaleString("en-GB")), delta && on && /*#__PURE__*/React.createElement("span", {
      key: delta.key,
      className: "m-pts-delta",
      "aria-hidden": "true"
    }, "+", delta.amt))), host);
  }
  function PointsPillC() {
    const [total, setTotal] = useStateC(ptsReadTotalC);
    const [full, setFull] = useStateC(ptsReadFullC);
    const [bump, setBump] = useStateC(0);
    // last payout, shown as a floating "+N" delta over the pill for ~1.4s
    const [delta, setDelta] = useStateC(null);
    // floating tally (PointsTallyC) shown when the pill itself isn't visible
    const pillRef = React.useRef(null);
    const [tally, setTally] = useStateC(false);
    const [tallyHost, setTallyHost] = useStateC(null);
    const tallyTimer = React.useRef(null);
    useEffectC(() => {
      const refresh = () => {
        setTotal(ptsReadTotalC());
        setFull(ptsReadFullC());
      };
      const onEarn = e => {
        const amt = e && e.detail ? Math.round(+e.detail.amount || 0) : 0;
        if (!amt) return;
        const eng = window.PFLoyalty;
        if (eng) {
          try {
            /* detail.booked: the sender already wrote the ledger entry itself
               (Profile's Today's Targets) — just re-read, don't award twice. */
            if (e.detail.booked) {/* already in the engine */} else if (eng.awardPoints) eng.awardPoints(amt, e.detail.label, e.detail.actionId);else eng.setState({
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
        if (!ptsPillVisibleC(pillRef.current)) {
          setTallyHost(h => h || ptsTallyHostC(pillRef.current));
          setTally(true);
          clearTimeout(tallyTimer.current);
          tallyTimer.current = setTimeout(() => setTally(false), PTS_TALLY_HOLDC);
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
    const shown = usePointsCountUpC(total);
    useEffectC(() => {
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
      onClick: () => goC("RewardsDashboard.html")
    }, /*#__PURE__*/React.createElement(PointsIconC, null), /*#__PURE__*/React.createElement("span", {
      key: bump,
      className: "m-pts-n" + (bump ? " pop" : "")
    }, shown.toLocaleString("en-GB")), delta && /*#__PURE__*/React.createElement("span", {
      key: delta.key,
      className: "m-pts-delta",
      "aria-hidden": "true"
    }, "+", delta.amt)), tallyHost && /*#__PURE__*/React.createElement(PointsTallyC, {
      host: tallyHost,
      on: tally,
      shown: shown,
      bump: bump,
      delta: delta
    }));
  }

  /* Hide-on-scroll header state shared by every page that mounts the
     newsfeed-style top bar. Scroll down past 40px → hidden (bar slides up);
     scroll back up a little → floating (transparent bar, frosted chip icons
     + logo over the content). Page roots toggle .chrome-hidden/.chrome-float. */
  function useHeaderHideC(scrollRef) {
    const [state, setState] = useStateC({
      hidden: false,
      floating: false
    });
    useEffectC(() => {
      const el = scrollRef && scrollRef.current;
      if (!el) return;
      let lastY = el.scrollTop;
      const onScroll = () => {
        const y = el.scrollTop;
        const dy = y - lastY;
        setState(prev => {
          let hidden = prev.hidden;
          if (y < 40) hidden = false;else if (dy > 6) hidden = true;else if (dy < -6) hidden = false;
          const floating = y > 40;
          return hidden === prev.hidden && floating === prev.floating ? prev : {
            hidden,
            floating
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
  function MTopBarC({
    onMenu,
    onBell,
    onMessages,
    dark
  }) {
    return /*#__PURE__*/React.createElement("header", {
      className: "m-top"
    }, /*#__PURE__*/React.createElement("button", {
      className: "m-burger",
      "aria-label": "Menu",
      onClick: onMenu
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:menu",
      size: 24,
      color: "var(--gray-700)"
    })), /*#__PURE__*/React.createElement("img", {
      src: "assets/profinity-icon-purple-gold.png",
      alt: "PROfinity Academy"
    }), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), /*#__PURE__*/React.createElement(PointsPillC, null), /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn",
      "aria-label": "Search",
      onClick: () => goC("SearchMobile.html")
    }, /*#__PURE__*/React.createElement(DSC.Icon, {
      name: "search",
      size: 20,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn",
      "aria-label": "Notifications",
      onClick: () => onBell && onBell()
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:bell",
      size: 20,
      color: "var(--brand-navy)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, "12")), /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn",
      "aria-label": "Messages",
      onClick: () => onMessages && onMessages()
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:message-circle",
      size: 20,
      color: "var(--brand-navy)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "dot"
    }, "12")));
  }
  const SM_EVENTS_C = [{
    d: "30",
    m: "JUN",
    label: "Technique Tuesday Webinar",
    t: "8:00 PM",
    access: "open"
  }, {
    d: "5",
    m: "JUL",
    label: "Confidence Masterclass",
    t: "6:00 PM",
    access: "members"
  }, {
    d: "12",
    m: "JUL",
    label: "Business Growth Workshop",
    t: "7:00 PM",
    access: "members"
  }];
  const SM_PROFILE_C = [{
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
  const NT_BADGE_C = {
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
  const NT_CATEGORIES_C = [{
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
  const NT_MENU_C = [{
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
  function NotifRowC({
    n
  }) {
    const b = NT_BADGE_C[n.type];
    const [menu, setMenu] = useStateC(false);
    useEffectC(() => {
      if (!menu) return;
      const close = () => setMenu(false);
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }, [menu]);
    return /*#__PURE__*/React.createElement("div", {
      className: "nt-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "nt-av"
    }, /*#__PURE__*/React.createElement(DSC.Avatar, {
      name: n.who,
      src: n.avatar,
      size: 56
    }), b && /*#__PURE__*/React.createElement("span", {
      className: "nt-badge",
      style: {
        background: b.bg
      }
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:more-vertical",
      size: 20,
      color: "var(--gray-450)"
    })), menu && /*#__PURE__*/React.createElement("div", {
      className: "nt-menu",
      role: "menu",
      onClick: e => e.stopPropagation()
    }, NT_MENU_C.map(m => /*#__PURE__*/React.createElement("button", {
      key: m.label,
      className: "nt-menu-item",
      role: "menuitem",
      onClick: () => setMenu(false)
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: m.icon,
      size: 19,
      color: "var(--gray-700)"
    }), m.label)))));
  }
  function NotifCategoryC({
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
    }, cat.count)), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: open ? "lucide:chevron-down" : "lucide:chevron-right",
      size: 20,
      color: "var(--gray-700)"
    })), open && /*#__PURE__*/React.createElement("div", {
      className: "nt-cat-items"
    }, cat.items.map((n, i) => /*#__PURE__*/React.createElement(NotifRowC, {
      key: i,
      n: n
    }))));
  }
  function NotificationsPanelC({
    open,
    onClose
  }) {
    const [openCats, setOpenCats] = useStateC(() => {
      const all = {};
      NT_CATEGORIES_C.forEach(cat => {
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:arrow-left",
      size: 24,
      color: "var(--gray-900)"
    })), /*#__PURE__*/React.createElement("h2", null, "Notifications")), /*#__PURE__*/React.createElement("div", {
      className: "nt-body"
    }, NT_CATEGORIES_C.map(cat => /*#__PURE__*/React.createElement(NotifCategoryC, {
      key: cat.key,
      cat: cat,
      open: !!openCats[cat.key],
      onToggle: () => toggleCat(cat.key)
    })))));
  }
  const DM_THREADS_SEED_C = [{
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
  const VOICE_CONFS_SEED_C = [{
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
  function avatarNameC(name) {
    return String(name || "").replace(/^(dr\.?|nurse|prof\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "");
  }
  function readDmGroupsC() {
    try {
      return JSON.parse(localStorage.getItem(PF_GROUPS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function groupDisplayNameC(members) {
    const names = members.map(m => m.name.replace(/^Dr\s+/, ""));
    return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
  }
  function createDmGroupC(members, customName) {
    const hasCustomName = !!(customName || "").trim();
    const group = {
      id: "group-" + Date.now(),
      isGroup: true,
      customName: hasCustomName,
      name: hasCustomName ? customName.trim() : groupDisplayNameC(members),
      members,
      messages: []
    };
    const groups = readDmGroupsC();
    groups.unshift(group);
    try {
      localStorage.setItem(PF_GROUPS_KEY, JSON.stringify(groups));
    } catch (e) {}
    return group;
  }
  function GroupAvatarStackC({
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
    }, /*#__PURE__*/React.createElement(DSC.Avatar, {
      name: avatarNameC(m.name),
      src: m.avatar,
      size: Math.round(s * 0.68)
    }))));
  }
  function MessagesRowC({
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
    }, c.isGroup ? /*#__PURE__*/React.createElement(GroupAvatarStackC, {
      members: c.members
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSC.Avatar, {
      name: avatarNameC(c.name),
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
    }, last ? last.text : c.isGroup ? c.members.length + " members" : ""), c.muted ? /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:bell-off",
      size: 16,
      color: "var(--gray-450)"
    }) : c.unread > 0 && /*#__PURE__*/React.createElement("span", {
      className: "mp-badge"
    }, c.unread))));
  }
  function NewConversationScreenC({
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.Icon, {
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
      }, /*#__PURE__*/React.createElement(DSC.Avatar, {
        name: avatarNameC(c.name),
        src: c.avatar,
        size: 44
      })), /*#__PURE__*/React.createElement("span", {
        className: "mp-new-name"
      }, c.name), /*#__PURE__*/React.createElement("span", {
        className: "mp-new-check" + (on ? " on" : "")
      }, on && /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
  function VoiceConfRowC({
    v
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "mp-row mp-vc-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mp-av mp-vc-icon"
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
  function MessagesPanelC({
    open,
    onClose
  }) {
    const [tab, setTab] = useStateC("messages");
    const [query, setQuery] = useStateC("");
    const [screen, setScreen] = useStateC("list");
    const [groups, setGroups] = useStateC([]);
    const [picked, setPicked] = useStateC([]);
    const [ncQuery, setNcQuery] = useStateC("");
    const [groupName, setGroupName] = useStateC("");
    useEffectC(() => {
      if (!open) {
        setQuery("");
        setScreen("list");
        setPicked([]);
        setNcQuery("");
        setGroupName("");
      } else {
        setGroups(readDmGroupsC());
      }
    }, [open]);
    const allThreads = [...groups, ...DM_THREADS_SEED_C];
    const filtered = allThreads.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
    const unreadTotal = DM_THREADS_SEED_C.reduce((n, t) => n + (t.unread || 0), 0);
    function openThread(id) {
      goC("Messages.html?t=" + id);
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
      const members = DM_THREADS_SEED_C.filter(c => picked.includes(c.id)).map(c => ({
        id: c.id,
        name: c.name,
        avatar: c.avatar
      }));
      const group = createDmGroupC(members, groupName);
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
      }, /*#__PURE__*/React.createElement(NewConversationScreenC, {
        contacts: DM_THREADS_SEED_C.filter(c => !c.isGroup),
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
      onClick: () => goC("Messages.html")
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:maximize-2",
      size: 20,
      color: "var(--gray-900)"
    })), /*#__PURE__*/React.createElement("button", {
      className: "mp-compose",
      "aria-label": "New message",
      onClick: () => setScreen("new")
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
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
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:phone",
      size: 16,
      color: tab === "voice" ? "var(--brand-navy)" : "var(--gray-450)"
    }), "Voice Conference", /*#__PURE__*/React.createElement("span", {
      className: "mp-tab-badge"
    }, VOICE_CONFS_SEED_C.length))), /*#__PURE__*/React.createElement("div", {
      className: "nt-search mp-search"
    }, /*#__PURE__*/React.createElement(DSC.Icon, {
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
    }, tab === "messages" ? filtered.map(c => /*#__PURE__*/React.createElement(MessagesRowC, {
      key: c.id,
      c: c,
      onOpen: () => openThread(c.id)
    })) : VOICE_CONFS_SEED_C.map(v => /*#__PURE__*/React.createElement(VoiceConfRowC, {
      key: v.id,
      v: v
    })))));
  }
  function SmSectionC({
    title
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sm-sec-h"
    }, title);
  }
  function DisplayToggleC({
    dark,
    onToggle
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "sm-display"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sm-display-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-display-title"
    }, "Display"), /*#__PURE__*/React.createElement("span", {
      className: "sm-display-sub"
    }, "Adjust the appearance of the app to reduce glare and give your eyes a break")), /*#__PURE__*/React.createElement("button", {
      className: "sm-display-toggle" + (dark ? " on" : ""),
      role: "switch",
      "aria-checked": dark,
      "aria-label": "Toggle dark mode",
      onClick: onToggle
    }, /*#__PURE__*/React.createElement("span", {
      className: "knob"
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: dark ? "lucide:moon" : "lucide:sun",
      size: 13,
      color: dark ? "var(--brand-navy)" : "var(--premium-orange)"
    }))));
  }
  function SmTierResourceRowC({
    r
  }) {
    return /*#__PURE__*/React.createElement("button", {
      className: "smt-resource",
      onClick: () => goC(r.href)
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: r.icon,
      size: 20,
      color: "var(--gray-900)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "smt-resource-label"
    }, r.label), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 20,
      color: "var(--gray-450)"
    }));
  }
  function SmTierCardC({
    tierKey,
    isOwn
  }) {
    const resources = SM_TIER_RESOURCES_C[tierKey];
    return /*#__PURE__*/React.createElement("div", {
      className: "smt-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "smt-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "smt-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "smt-name"
    }, SM_TIER_META_C[tierKey].name, " Path"), !isOwn && /*#__PURE__*/React.createElement("span", {
      className: "smt-pill"
    }, "INCLUDED"))), /*#__PURE__*/React.createElement("div", {
      className: "smt-resources"
    }, resources.map(r => /*#__PURE__*/React.createElement(SmTierResourceRowC, {
      key: r.label,
      r: r
    }))));
  }
  function SideMenuC({
    open,
    onClose,
    dark,
    onToggleDark
  }) {
    const tier = getUserTierC();
    const unlockedTiers = smUnlockedTiersC(tier);
    const nextTier = smNextTierC(tier);
    const showUpgrade = tier === "free" || tier === "confidence" || tier === "mastery";
    /* Bronze by default; silver once the next rung is Mastery; gold for
       Freedom / Inner Circle. */
    const upgradeMetal = nextTier === "mastery" ? "silver" : nextTier === "freedom" || nextTier === "inner" ? "gold" : "bronze";
    const upgradeIconColor = upgradeMetal === "silver" ? "#3F4650" : upgradeMetal === "gold" ? "#5A3A00" : "#fff";
    return /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-wrap" + (open ? " open" : ""),
      "aria-hidden": !open
    }, /*#__PURE__*/React.createElement("div", {
      className: "m-drawer-scrim",
      onClick: onClose
    }), /*#__PURE__*/React.createElement("aside", {
      className: "m-drawer" + (dark ? " sm-dark" : ""),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Menu"
    }, /*#__PURE__*/React.createElement("button", {
      className: "m-drawer-profile",
      onClick: () => goC("ProfileMobile.html")
    }, /*#__PURE__*/React.createElement(DSC.Avatar, {
      name: ME_C.name,
      src: ME_C.avatar,
      size: 56
    }), /*#__PURE__*/React.createElement("span", {
      className: "m-dp-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "m-dp-name"
    }, "Katy Wilson", /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:badge-check",
      size: 18,
      color: "var(--reaction-like)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "m-dp-role"
    }, "Registered Nurse")), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 22,
      color: "var(--gray-800)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "sm-body"
    }, showUpgrade && nextTier && /*#__PURE__*/React.createElement("button", {
      className: "sm-upgrade metal-" + upgradeMetal,
      onClick: () => goC("MembershipTier.html")
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-upgrade-icon"
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:gem",
      size: 20,
      color: upgradeIconColor
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-upgrade-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-upgrade-title"
    }, "Upgrade to ", SM_TIER_META_C[nextTier].name), /*#__PURE__*/React.createElement("span", {
      className: "sm-upgrade-sub"
    }, "Unlock more premium channels & courses")), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 20,
      color: upgradeIconColor
    })), unlockedTiers.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SmSectionC, {
      title: "My Membership"
    }), /*#__PURE__*/React.createElement("div", {
      className: "smt-list"
    }, unlockedTiers.map(tKey => /*#__PURE__*/React.createElement(SmTierCardC, {
      key: tKey,
      tierKey: tKey,
      isOwn: tKey === tier
    })))), /*#__PURE__*/React.createElement("button", {
      className: "sm-primary-card",
      onClick: () => goC("LearningMobile.html")
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-primary-icon"
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:graduation-cap",
      size: 22,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-primary-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-primary-title"
    }, "My Learning"), /*#__PURE__*/React.createElement("span", {
      className: "sm-primary-sub"
    }, "Courses, protocols & certificates")), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 20,
      color: "var(--gray-450)"
    })), unlockedTiers.includes("freedom") && /*#__PURE__*/React.createElement("button", {
      className: "sm-primary-card",
      onClick: () => goC("FreedomPathChat.html")
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-primary-icon"
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:rocket",
      size: 22,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "sm-primary-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-primary-title"
    }, "Freedom Path Chat"), /*#__PURE__*/React.createElement("span", {
      className: "sm-primary-sub"
    }, "Business, scaling & mentorship")), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 20,
      color: "var(--gray-450)"
    })), /*#__PURE__*/React.createElement(SmSectionC, {
      title: "Upcoming Events"
    }), /*#__PURE__*/React.createElement("div", {
      className: "sm-events"
    }, SM_EVENTS_C.slice(0, 2).map(e => /*#__PURE__*/React.createElement("button", {
      key: e.label,
      className: "sm-event",
      onClick: () => goC("EventsMobile.html")
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-date"
    }, /*#__PURE__*/React.createElement("b", null, e.d), /*#__PURE__*/React.createElement("i", null, e.m)), /*#__PURE__*/React.createElement("span", {
      className: "sm-event-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sm-event-name"
    }, e.label), /*#__PURE__*/React.createElement("span", {
      className: "sm-event-time"
    }, e.t)), /*#__PURE__*/React.createElement("span", {
      className: "sm-event-access" + (e.access === "members" ? " sm-event-access-members" : " sm-event-access-open")
    }, e.access === "members" ? "Members only" : "Open to all")))), /*#__PURE__*/React.createElement(SmSectionC, {
      title: "My Profile"
    }), /*#__PURE__*/React.createElement("button", {
      className: "sm-row sm-verify",
      onClick: () => goC("ProfileMobile.html")
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:book-open",
      size: 23,
      color: "var(--premium-orange)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-row-label"
    }, "Verify Profile"), /*#__PURE__*/React.createElement("span", {
      className: "sm-verify-pill",
      style: {
        backgroundColor: "rgb(206, 153, 87)"
      }
    }, "Not Verified")), /*#__PURE__*/React.createElement("nav", {
      className: "sm-list"
    }, SM_PROFILE_C.map(c => c.label === "Display Settings" ? /*#__PURE__*/React.createElement(DisplayToggleC, {
      key: c.label,
      dark: dark,
      onToggle: onToggleDark
    }) : /*#__PURE__*/React.createElement("button", {
      key: c.label,
      className: "sm-row",
      onClick: () => goC(c.href)
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: c.icon,
      size: 23,
      color: "var(--gray-900)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "sm-row-label"
    }, c.label), /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 20,
      color: "var(--gray-450)"
    })))), /*#__PURE__*/React.createElement("button", {
      className: "m-drawer-logout",
      onClick: () => goC("AuthMobile.html?view=signin")
    }, /*#__PURE__*/React.createElement(DSC.IconifyIcon, {
      name: "lucide:log-out",
      size: 22,
      color: "var(--error)"
    }), "Logout"))));
  }
  function MobileChromeC() {
    const [menuOpen, setMenuOpen] = useStateC(false);
    const [notifOpen, setNotifOpen] = useStateC(false);
    const [msgOpen, setMsgOpen] = useStateC(false);
    const [dark, setDark] = useStateC(() => {
      try {
        return localStorage.getItem("pf-mobile-dark") === "1";
      } catch (e) {
        return false;
      }
    });
    useEffectC(() => {
      try {
        localStorage.setItem("pf-mobile-dark", dark ? "1" : "0");
      } catch (e) {}
    }, [dark]);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MTopBarC, {
      onMenu: () => setMenuOpen(true),
      onBell: () => setNotifOpen(true),
      onMessages: () => setMsgOpen(true),
      dark: dark
    }), /*#__PURE__*/React.createElement(SideMenuC, {
      open: menuOpen,
      onClose: () => setMenuOpen(false),
      dark: dark,
      onToggleDark: () => setDark(v => !v)
    }), /*#__PURE__*/React.createElement(NotificationsPanelC, {
      open: notifOpen,
      onClose: () => setNotifOpen(false)
    }), /*#__PURE__*/React.createElement(MessagesPanelC, {
      open: msgOpen,
      onClose: () => setMsgOpen(false)
    }));
  }
  window.MobileChromeC = MobileChromeC;
  /* The side menu on its own — for pages that keep their own top bar but
     still open the shared drawer (the Confidence My Learning page). */
  window.PFSideMenuC = SideMenuC;
  /* Scroll-driven header state ({ hidden, floating }) — see useHeaderHideC. */
  window.PFUseHeaderHideC = useHeaderHideC;
  /* The header points icon (doctor Lottie) — exposed for other pages. */
  window.PFPointsIconC = PointsIconC;
  /* The header points pill itself — mounted by pages that keep their own top
     bar (ProfileMobile's PMTopBar) so the lifetime total reads the same. */
  window.PFPointsPillC = PointsPillC;
  /* The notifications + messages drawers — for pages with their own top bar
     that still want the shared bell / message-circle buttons to work. */
  window.PFNotificationsPanelC = NotificationsPanelC;
  window.PFMessagesPanelC = MessagesPanelC;
})();
