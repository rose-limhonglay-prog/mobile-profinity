/* ===========================================================================
   PROfinity — Katy · Ways to Earn (Screen 17) · iPhone 17 Pro Max
   Simple list of every point-earning action grouped by category with a tinted icon medallion and
   a navy 12px "+N pts" button that calls window.PFLoyalty.completeAction —
   a live run-through of the caps/velocity/silent-cap anti-cheat pipeline.
   Suffixed -WTE.
   =========================================================================== */
const {
  useState: useStateWTE,
  useMemo: useMemoWTE,
  useEffect: useEffectWTE,
  useRef: useRefWTE
} = React;
const DSWTE = window.ProfinityDesignSystem_c2b5cc;
const PF_WTE = window.PFLoyalty;
function goWTE(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
/* ?ret=<page> — where the back chevron goes (RewardsWeb.html sends members here) */
function retWTE() {
  try {
    const r = new URLSearchParams(location.search).get("ret");
    if (r && /^[A-Za-z0-9_./?=&-]+$/.test(r)) return r;
  } catch (e) {}
  return "RewardsDashboard.html";
}

/* one icon + pastel per action category — keys = the `category` strings in
   loyalty-engine.js DEFAULT_ACTIONS (points matrix v2, 2026-09-22). Order is
   the order the groups render in: habits first, then the things a member does
   most often, one-time set-up wins last. (Page restored 2026-10-09 at the
   user's request after being removed with the Rewards Store on 2026-09-24.) */
const WTE_CATEGORIES = {
  "Streaks": {
    icon: "lucide:flame",
    a: "#FFE3A3",
    b: "#FFC65C",
    ink: "#8A5303",
    blurb: "Small daily habits, big streaks"
  },
  "Community": {
    icon: "lucide:users",
    a: "#D2F5EA",
    b: "#8FE0C8",
    ink: "#137A5B",
    blurb: "Share what you know"
  },
  "Feed (Admin Posts)": {
    icon: "lucide:megaphone",
    a: "#FFD6E0",
    b: "#FFA3BC",
    ink: "#B0335A",
    blurb: "React to Dr Tim's posts"
  },
  "Learning": {
    icon: "lucide:graduation-cap",
    a: "#D9EAFF",
    b: "#A6CCFF",
    ink: "#1F5AA8",
    blurb: "Level up your skills"
  },
  "Events": {
    icon: "lucide:calendar-days",
    a: "#E7DFFF",
    b: "#C5B3FF",
    ink: "#5B3FBF",
    blurb: "Show up live"
  },
  "Social Growth & Referral": {
    icon: "lucide:user-plus",
    a: "#DDF3FF",
    b: "#9FDCFF",
    ink: "#0F6B9A",
    blurb: "Grow the network"
  },
  "Follower Milestones": {
    icon: "lucide:trending-up",
    a: "#FFF0C2",
    b: "#FFD666",
    ink: "#8A5303",
    blurb: "Milestones as your audience grows"
  },
  "Reviews": {
    icon: "lucide:star",
    a: "#FFF0C2",
    b: "#FFD666",
    ink: "#8A5303",
    blurb: "Help others choose well"
  },
  "Profile": {
    icon: "lucide:user-pen",
    a: "#E7DFFF",
    b: "#C5B3FF",
    ink: "#5B3FBF",
    blurb: "Tell your story"
  },
  "Credentials": {
    icon: "lucide:badge-check",
    a: "#D2F5EA",
    b: "#8FE0C8",
    ink: "#137A5B",
    blurb: "Prove your standing"
  },
  "Cross-Platform": {
    icon: "lucide:smartphone",
    a: "#D9EAFF",
    b: "#A6CCFF",
    ink: "#1F5AA8",
    blurb: "Web and app together"
  },
  "Onboarding": {
    icon: "lucide:id-card",
    a: "#DDF3FF",
    b: "#9FDCFF",
    ink: "#0F6B9A",
    blurb: "One-time set-up wins"
  },
  "Purchases": {
    icon: "lucide:shopping-bag",
    a: "#FFE2CF",
    b: "#FFB98A",
    ink: "#9A4A12",
    blurb: "Points back on every order"
  }
};
const WTE_CAT_ORDER = Object.keys(WTE_CATEGORIES);
const WTE_DEFAULT = {
  icon: "lucide:sparkles",
  a: "#FFE3A3",
  b: "#FFC65C",
  ink: "#8A5303",
  blurb: ""
};
const WTE_ACTION_ICONS = {
  evt_mobile_checkin: "lucide:calendar-check",
  evt_learning_streak: "lucide:book-open",
  evt_streak_7: "lucide:flame",
  evt_streak_30: "lucide:flame",
  evt_streak_365: "lucide:trophy",
  evt_create_post: "lucide:pen-line",
  evt_clinical_media_post: "lucide:camera",
  evt_case_study_share: "lucide:file-heart",
  evt_react_post: "lucide:heart",
  evt_comment_post: "lucide:message-circle",
  evt_share_post: "lucide:share-2",
  evt_likes_10: "lucide:thumbs-up",
  evt_likes_50: "lucide:thumbs-up",
  evt_best_answer: "lucide:award",
  evt_join_community: "lucide:users",
  evt_receive_comment: "lucide:message-circle",
  evt_receive_share: "lucide:share-2",
  evt_mention_user: "lucide:at-sign",
  evt_get_mentioned: "lucide:at-sign",
  evt_react_admin_post: "lucide:heart",
  evt_comment_admin_post: "lucide:message-circle",
  evt_share_admin_post: "lucide:share-2",
  evt_module_complete: "lucide:book-open",
  evt_course_complete: "lucide:graduation-cap",
  evt_first_certificate: "lucide:award",
  evt_course_quiz_100: "lucide:check-circle",
  evt_event_register: "lucide:calendar-check",
  evt_webinar_attend: "lucide:video",
  evt_conference_attend: "lucide:mic",
  evt_event_speak: "lucide:mic",
  evt_event_feedback: "lucide:message-square",
  evt_refer_colleague: "lucide:user-plus",
  evt_referee_verified: "lucide:badge-check",
  evt_follow_peer: "lucide:user-check",
  evt_followers_10: "lucide:trending-up",
  evt_followers_100: "lucide:trending-up",
  evt_followers_1000: "lucide:trending-up",
  evt_followers_10000: "lucide:trending-up",
  evt_followers_100000: "lucide:trending-up",
  evt_prod_review_submit: "lucide:star",
  evt_profile_picture: "lucide:image",
  evt_professional_title: "lucide:briefcase",
  evt_languages: "lucide:languages",
  evt_social_links: "lucide:link",
  evt_services_offered: "lucide:list-checks",
  evt_bio_write: "lucide:pen-line",
  evt_clinic_location: "lucide:map-pin",
  evt_profile_complete: "lucide:user-check",
  evt_license_verify: "lucide:badge-check",
  evt_certification_add: "lucide:award",
  evt_registry_connect: "lucide:id-card",
  evt_first_mobile_login: "lucide:smartphone",
  evt_daily_login: "lucide:log-in",
  evt_omnichannel_week: "lucide:monitor-smartphone",
  evt_push_enable: "lucide:bell",
  evt_signup: "lucide:user-plus",
  evt_virtual_tour: "lucide:compass",
  evt_onboarding_checklist: "lucide:list-checks",
  evt_verify_email: "lucide:mail-check",
  evt_notification_prefs: "lucide:bell",
  evt_purchase_item: "lucide:shopping-bag"
};
function catWTE(name) {
  return WTE_CATEGORIES[name] || WTE_DEFAULT;
}
function iconWTE(a) {
  return WTE_ACTION_ICONS[a.id] || catWTE(a.category).icon;
}

/* Actions that can never pay again (one-time lock / lifetime cap reached) read
   as completed instead of offering a button that only toasts a cap message. */
function isExhaustedWTE(action, state) {
  const c = (state.actionCounts || {})[action.id];
  if (!c) return false;
  if (action.oneTimeLock && c.lifetimeCount >= 1) return true;
  return action.lifetimeCap != null && c.lifetimeCount >= action.lifetimeCap;
}

/* little coin burst from the button that just paid out */
function burstWTE(root, el) {
  if (!root || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#F4AD3D", "#FFD76A", "#FF8FAE", "#5ED3B1", "#8DC5FF"];
  const rr = root.getBoundingClientRect(),
    r = el.getBoundingClientRect();
  const x = r.left + r.width / 2 - rr.left,
    y = r.top + r.height / 2 - rr.top;
  for (let i = 0; i < 16; i++) {
    const p = document.createElement("span");
    p.className = "wte-confetti";
    const size = 6 + Math.random() * 7;
    p.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + size + "px;height:" + size + "px;background:" + colors[i % colors.length] + ";border-radius:" + (Math.random() > .4 ? "50%" : "2px");
    root.appendChild(p);
    const ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.3,
      dist = 60 + Math.random() * 90;
    const a = p.animate([{
      transform: "translate(-50%,-50%) scale(1)",
      opacity: 1
    }, {
      transform: "translate(calc(-50% + " + (Math.cos(ang) * dist).toFixed(0) + "px), calc(-50% + " + (Math.sin(ang) * dist + 60).toFixed(0) + "px)) scale(.5)",
      opacity: 0
    }], {
      duration: 700 + Math.random() * 400,
      easing: "cubic-bezier(.15,.7,.3,1)",
      fill: "forwards"
    });
    a.onfinish = () => p.remove();
  }
}

/* ---- "How it works" (user 2026-10-13): tapping a row opens a sheet with a
   looping mini animation of the action — step chips light up one after the
   other, a tick lands on each, then "+N pts" floats into a points pill that
   bumps and counts up. One scene per category, a few per-action overrides.
   ?how=<actionId> deep-links the sheet open (demo / QA). ---- */
const WTE_SCENES = {
  "Streaks": [["lucide:smartphone", "Open the app"], ["lucide:calendar-check", "Tap Check in"], ["lucide:flame", "Streak grows"]],
  "Community": [["lucide:pen-line", "Write your post"], ["lucide:send", "Share it"], ["lucide:heart", "Members react"]],
  "Feed (Admin Posts)": [["lucide:megaphone", "Dr Tim posts"], ["lucide:heart", "React or reply"], ["lucide:check-circle", "Counted"]],
  "Learning": [["lucide:book-open", "Open a lesson"], ["lucide:play", "Watch & practise"], ["lucide:check-circle", "Module complete"]],
  "Events": [["lucide:calendar-days", "Register"], ["lucide:video", "Join live"], ["lucide:message-square", "Leave feedback"]],
  "Social Growth & Referral": [["lucide:user-plus", "Invite a colleague"], ["lucide:send", "They sign up"], ["lucide:badge-check", "Verified"]],
  "Follower Milestones": [["lucide:sparkles", "Share great work"], ["lucide:user-plus", "Clinicians follow"], ["lucide:trending-up", "Milestone hit"]],
  "Reviews": [["lucide:shopping-bag", "Open a product"], ["lucide:star", "Rate it"], ["lucide:pen-line", "Write 50+ characters"]],
  "Profile": [["lucide:user", "Open your profile"], ["lucide:user-pen", "Fill in the section"], ["lucide:check", "Save"]],
  "Credentials": [["lucide:file-text", "Upload the document"], ["lucide:shield-check", "We verify it"], ["lucide:badge-check", "Badge on profile"]],
  "Cross-Platform": [["lucide:monitor", "Use the web"], ["lucide:smartphone", "Use the app"], ["lucide:check-circle", "Both in one week"]],
  "Onboarding": [["lucide:list-checks", "Follow the checklist"], ["lucide:check", "Tick it off"], ["lucide:sparkles", "You're set up"]],
  "Purchases": [["lucide:shopping-bag", "Add to basket"], ["lucide:check-circle", "Checkout"], ["lucide:coins", "Points on the total"]]
};
const WTE_SCENE_OVERRIDES = {
  evt_mobile_checkin: [["lucide:smartphone", "Open the app"], ["lucide:calendar-check", "Tap Check in"], ["lucide:flame", "5 days in a row"]],
  evt_learning_streak: [["lucide:book-open", "Finish a module"], ["lucide:calendar-days", "Again tomorrow"], ["lucide:flame", "3 days in a week"]],
  evt_create_post: [["lucide:pen-line", "Write your post"], ["lucide:send", "Share it"], ["lucide:users", "Community sees it"]],
  evt_clinical_media_post: [["lucide:camera", "Add a photo or video"], ["lucide:send", "Post it"], ["lucide:heart", "Members react"]],
  evt_case_study_share: [["lucide:file-heart", "Write the case"], ["lucide:send", "Share it"], ["lucide:award", "Peers learn"]],
  evt_react_post: [["lucide:users", "Scroll the feed"], ["lucide:heart", "Tap react"], ["lucide:check-circle", "Counted"]],
  evt_comment_post: [["lucide:users", "Open a post"], ["lucide:message-circle", "Reply"], ["lucide:check-circle", "Counted"]],
  evt_share_post: [["lucide:users", "Find a post"], ["lucide:share-2", "Share it"], ["lucide:check-circle", "Counted"]],
  evt_course_complete: [["lucide:book-open", "Finish every module"], ["lucide:check-circle", "Pass the quiz"], ["lucide:award", "Certificate"]],
  evt_refer_colleague: [["lucide:user-plus", "Send your link"], ["lucide:send", "They sign up"], ["lucide:badge-check", "Verified"]],
  evt_follow_peer: [["lucide:users", "Find a peer"], ["lucide:user-check", "Follow"], ["lucide:check-circle", "Counted"]],
  evt_profile_picture: [["lucide:user", "Open your profile"], ["lucide:image", "Add a photo"], ["lucide:check", "Save"]],
  evt_profile_complete: [["lucide:user", "Open your profile"], ["lucide:user-pen", "Fill every section"], ["lucide:check", "100% complete"]],
  evt_push_enable: [["lucide:smartphone", "Open settings"], ["lucide:bell", "Allow notifications"], ["lucide:check", "Done"]],
  evt_verify_email: [["lucide:mail-check", "Check your inbox"], ["lucide:check", "Tap the link"], ["lucide:badge-check", "Verified"]],
  evt_purchase_item: [["lucide:shopping-bag", "Add to basket"], ["lucide:check-circle", "Checkout"], ["lucide:coins", "Points on the total"]]
};
function sceneWTE(a) {
  return WTE_SCENE_OVERRIDES[a.id] || WTE_SCENES[a.category] || [["lucide:sparkles", "Do the action"], ["lucide:check-circle", "We confirm it"], ["lucide:coins", "Points land"]];
}
function reduceMotionWTE() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

/* Dr Tim presenter (user 2026-10-13): the check-in avatar Lotties from
   assets/lottie — "welcome" while he walks through the steps, "happy"
   (arms up) the moment the points land. Raw JSON via lottie-web, cached per
   file; each instance gets its own copy because lottie-web mutates it. */
const WTE_DOC = {
  welcome: "assets/lottie/checkin-welcome.json",
  happy: "assets/lottie/checkin-happy.json"
};
const wteDocCache = {};
function loadDocWTE(src) {
  if (!wteDocCache[src]) wteDocCache[src] = fetch(src).then(r => r.json());
  return wteDocCache[src];
}
function DrTimWTE({
  mood,
  size
}) {
  const host = useRefWTE(null);
  useEffectWTE(() => {
    let anim,
      dead = false,
      iv;
    const src = WTE_DOC[mood] || WTE_DOC.welcome;
    loadDocWTE(src).then(data => {
      const start = () => {
        if (dead || !window.lottie || !host.current) return;
        anim = window.lottie.loadAnimation({
          container: host.current,
          renderer: "svg",
          loop: true,
          autoplay: !reduceMotionWTE(),
          animationData: JSON.parse(JSON.stringify(data)),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
          }
        });
        if (reduceMotionWTE()) anim.addEventListener("DOMLoaded", () => anim.goToAndStop(0, true));
      };
      if (window.lottie) start();else {
        iv = setInterval(() => {
          if (window.lottie) {
            clearInterval(iv);
            start();
          }
        }, 120);
        setTimeout(() => clearInterval(iv), 8000);
      }
    }).catch(() => {});
    return () => {
      dead = true;
      if (iv) clearInterval(iv);
      if (anim) anim.destroy();
    };
  }, [mood]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "wte-doc-anim",
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  });
}

/* phases: 0 reset · 1..n step n lights up and ticks · n+1 "+N" floats to the
   pill · n+2 pill bumped, hold · then loop */
function HowItWorksStage({
  steps,
  pts,
  ink,
  a,
  b
}) {
  const n = steps.length;
  const still = reduceMotionWTE();
  const [phase, setPhase] = useStateWTE(still ? n + 2 : 0);
  useEffectWTE(() => {
    if (still) return;
    let ph = 0;
    const tick = () => {
      ph = ph >= n + 2 ? 0 : ph + 1;
      setPhase(ph);
    };
    const iv = setInterval(tick, 950);
    return () => clearInterval(iv);
  }, [n, still]);
  const landed = phase >= n + 2;
  const say = phase === 0 ? "Here's how it works" : phase <= n ? "Step " + phase + ": " + steps[phase - 1][1] : phase === n + 1 ? "Points incoming…" : "That's +" + pts + " pts — nice!";
  return /*#__PURE__*/React.createElement("div", {
    className: "wte-stage" + (phase === n + 1 ? " is-float" : "") + (landed ? " is-landed" : ""),
    style: {
      "--wte-a": a,
      "--wte-b": b,
      "--wte-ink": ink
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wte-stage-doc"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-doc" + (landed ? " is-happy" : "")
  }, /*#__PURE__*/React.createElement(DrTimWTE, {
    mood: landed ? "happy" : "welcome",
    size: 56
  })), /*#__PURE__*/React.createElement("span", {
    className: "wte-stage-say",
    key: say
  }, say)), /*#__PURE__*/React.createElement("div", {
    className: "wte-stage-pill" + (landed ? " bump" : "")
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:coins",
    size: 13,
    color: "#3D2A00"
  }), /*#__PURE__*/React.createElement("span", null, landed ? pts : 0)), /*#__PURE__*/React.createElement("div", {
    className: "wte-stage-steps"
  }, steps.map((st, i) => {
    const idx = i + 1;
    const state = phase === 0 ? "idle" : phase === idx ? "active" : phase > idx ? "done" : "idle";
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      className: "wte-stage-link" + (phase > i ? " on" : "")
    }), /*#__PURE__*/React.createElement("div", {
      className: "wte-st is-" + state,
      style: {
        "--i": i
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "wte-st-ic"
    }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
      name: st[0],
      size: 20,
      color: "currentColor"
    }), /*#__PURE__*/React.createElement("span", {
      className: "wte-st-ring"
    }), /*#__PURE__*/React.createElement("span", {
      className: "wte-st-tick"
    }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
      name: "lucide:check",
      size: 10,
      color: "#fff"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "wte-st-lb"
    }, st[1])));
  })), /*#__PURE__*/React.createElement("span", {
    className: "wte-stage-float"
  }, "+", pts, " pts"));
}

/* Dr Tim demo "video" (user, 2026-10-19): a header button with his animated
   avatar opens a short auto-playing walkthrough of how the rewards work —
   five captioned scenes over ~18s with a segmented progress bar, play/pause
   and replay. Plain words, big type (members are mostly 60+). ?demo=1 opens it. */
const WTE_DEMO_SCENES = [{
  icon: "lucide:coins",
  say: "Earn points every day.",
  sub: "Check in, post, learn."
}, {
  icon: "lucide:gem",
  say: "Points move you up.",
  sub: "Jade to Sapphire."
}, {
  icon: "lucide:gift",
  say: "Each league unlocks a reward.",
  sub: "Six leagues, six rewards."
}, {
  icon: "lucide:ticket",
  say: "Redeem it on My Rewards.",
  sub: "Tap the reward, get your code."
}, {
  icon: "lucide:shield-check",
  say: "Your points never expire.",
  sub: "Keep earning, keep climbing."
}];
const WTE_DEMO_MS = 3600;
function RewardsDemoSheet({
  onClose
}) {
  const still = reduceMotionWTE();
  const n = WTE_DEMO_SCENES.length;
  const [i, setI] = useStateWTE(0);
  const [playing, setPlaying] = useStateWTE(!still);
  const [ended, setEnded] = useStateWTE(false);
  const [tick, setTick] = useStateWTE(0); // restarts the fill animation per scene
  useEffectWTE(() => {
    if (!playing || ended) return;
    const t = setTimeout(() => {
      if (i >= n - 1) {
        setEnded(true);
        setPlaying(false);
      } else {
        setI(i + 1);
        setTick(x => x + 1);
      }
    }, WTE_DEMO_MS);
    return () => clearTimeout(t);
  }, [i, playing, ended]);
  useEffectWTE(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const jump = k => {
    setI(k);
    setTick(x => x + 1);
    setEnded(false);
    setPlaying(!still);
  };
  const replay = () => jump(0);
  const toggle = () => {
    if (ended) return replay();
    setPlaying(p => !p);
    setTick(x => x + 1);
  };
  const sc = WTE_DEMO_SCENES[i];
  return /*#__PURE__*/React.createElement("div", {
    className: "wte-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "wte-sheet wte-demo",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "wte-demo-title",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-sheet-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wte-sheet-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wte-sheet-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-sheet-cat"
  }, "Dr Tim shows you"), /*#__PURE__*/React.createElement("h2", {
    id: "wte-demo-title"
  }, "How rewards work")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wte-sheet-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "wte-video" + (playing ? " is-playing" : "") + (ended ? " is-ended" : ""),
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-video-tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-video-dot"
  }), "Demo"), /*#__PURE__*/React.createElement("div", {
    className: "wte-video-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-video-doc" + (ended ? " is-happy" : "")
  }, /*#__PURE__*/React.createElement(DrTimWTE, {
    mood: ended ? "happy" : "welcome",
    size: 112
  })), /*#__PURE__*/React.createElement("div", {
    className: "wte-video-cap",
    key: i + ":" + ended
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-video-ic"
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: ended ? "lucide:party-popper" : sc.icon,
    size: 22,
    color: "#3D2A00"
  })), /*#__PURE__*/React.createElement("b", null, ended ? "That's it!" : sc.say), /*#__PURE__*/React.createElement("i", null, ended ? "Go and earn your first points." : sc.sub))), /*#__PURE__*/React.createElement("div", {
    className: "wte-video-bar",
    role: "progressbar",
    "aria-valuemin": 1,
    "aria-valuemax": n,
    "aria-valuenow": i + 1,
    "aria-label": "Scene " + (i + 1) + " of " + n
  }, WTE_DEMO_SCENES.map((s, k) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    className: "wte-video-seg" + (k < i || ended ? " is-done" : k === i ? " is-now" : ""),
    "aria-label": "Scene " + (k + 1),
    onClick: () => jump(k)
  }, /*#__PURE__*/React.createElement("span", {
    key: tick,
    className: "wte-video-fill",
    style: {
      animationDuration: WTE_DEMO_MS + "ms",
      animationPlayState: playing && !ended ? "running" : "paused"
    }
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wte-video-play",
    "aria-label": ended ? "Replay" : playing ? "Pause" : "Play",
    onClick: toggle
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: ended ? "lucide:rotate-ccw" : playing ? "lucide:pause" : "lucide:play",
    size: 20,
    color: "#fff"
  })), ended && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wte-video-replay",
    onClick: replay
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:rotate-ccw",
    size: 16,
    color: "currentColor"
  }), "Watch again")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wte-sheet-btn",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "currentColor"
  }), "Got it")));
}
function HowItWorksSheet({
  action,
  cat,
  projected,
  done,
  onEarn,
  onClose
}) {
  const steps = sceneWTE(action);
  useEffectWTE(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "wte-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "wte-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "wte-sheet-title",
    style: {
      "--wte-a": cat.a,
      "--wte-b": cat.b,
      "--wte-ink": cat.ink
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-sheet-handle",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wte-sheet-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-row-ic"
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: iconWTE(action),
    size: 19,
    color: cat.ink
  })), /*#__PURE__*/React.createElement("div", {
    className: "wte-sheet-tx"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-sheet-cat"
  }, action.category), /*#__PURE__*/React.createElement("h2", {
    id: "wte-sheet-title"
  }, action.label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wte-sheet-close",
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--gray-600)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "wte-sheet-kicker"
  }, "How it works"), /*#__PURE__*/React.createElement(HowItWorksStage, {
    steps: steps,
    pts: projected,
    ink: cat.ink,
    a: cat.a,
    b: cat.b
  }), /*#__PURE__*/React.createElement("ol", {
    className: "wte-steps"
  }, steps.map((st, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-steps-n"
  }, i + 1), /*#__PURE__*/React.createElement("span", null, st[1]))), /*#__PURE__*/React.createElement("li", {
    className: "wte-steps-pts"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-steps-n"
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:zap",
    size: 12,
    color: "#3D2A00"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "+", projected, " pts"), " land on your lifetime total the moment it's confirmed"))), done ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wte-sheet-btn is-done",
    disabled: true
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "currentColor"
  }), "Already earned") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wte-sheet-btn",
    onClick: e => onEarn(action, e.currentTarget)
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:zap",
    size: 16,
    color: "currentColor"
  }), "Earn +", projected, " pts now")));
}
function WaysToEarnScreen() {
  const [config] = useStateWTE(() => PF_WTE.getConfig());
  const [state, setState] = useStateWTE(() => PF_WTE.getState());
  const [toast, setToast] = useStateWTE(null);
  const screenRef = useRefWTE(null);
  /* "How it works" sheet — ?how=<actionId> opens it on load */
  const [howId, setHowId] = useStateWTE(() => {
    try {
      return new URLSearchParams(location.search).get("how");
    } catch (e) {
      return null;
    }
  });
  const [demoOpen, setDemoOpen] = useStateWTE(() => {
    try {
      return new URLSearchParams(location.search).get("demo") === "1";
    } catch (e) {
      return false;
    }
  });
  const closeHow = React.useCallback(() => setHowId(null), []);

  /* Stay in step with the rest of the prototype (Profile targets, Rewards
     Dashboard demo buttons, a second tab) — the engine lives in localStorage. */
  useEffectWTE(() => {
    const refresh = () => setState(PF_WTE.getState());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  const tier = state.user.membershipTier;
  const actions = useMemoWTE(() => config.actions.filter(a => a.active), [config]);
  const grouped = useMemoWTE(() => {
    const byCat = {};
    actions.forEach(a => {
      (byCat[a.category] = byCat[a.category] || []).push(a);
    });
    const order = WTE_CAT_ORDER.filter(c => byCat[c]).concat(Object.keys(byCat).filter(c => !WTE_CAT_ORDER.includes(c)));
    return order.map(c => ({
      name: c,
      items: byCat[c]
    }));
  }, [actions]);
  const earn = (action, el) => {
    const res = PF_WTE.completeAction(action.id);
    setState(PF_WTE.getState());
    if (res.capped) setToast({
      kind: "cap",
      text: action.label + ": " + res.capReason
    });else {
      burstWTE(screenRef.current, el);
      setToast({
        kind: "win",
        text: "+" + res.pointsAwarded + " pts · " + action.label
      });
      /* same event popPoints (app.jsx) fires so any header points pill / tally listening on the page bumps */
      try {
        window.dispatchEvent(new CustomEvent("pf:points-earned", {
          detail: {
            amount: res.pointsAwarded,
            label: action.label,
            actionId: action.id,
            booked: true
          }
        }));
      } catch (e) {/* older WebView */}
    }
    setTimeout(() => setToast(null), 2600);
    /* crossing the next threshold hands off to the Milestone Splash */
    if (window.PFRewards) window.PFRewards.fromAction(res);else if (res.leveledUp) setTimeout(() => goWTE("MilestoneSplash.html"), 900);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen wte-screen",
    "data-screen-label": "Ways to Earn",
    ref: screenRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goWTE(retWTE())
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, "Ways to Earn"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wte-demo-btn",
    "aria-label": "Watch how rewards work",
    "aria-haspopup": "dialog",
    onClick: () => setDemoOpen(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "wte-demo-av"
  }, /*#__PURE__*/React.createElement(DrTimWTE, {
    mood: "welcome",
    size: 44
  })), /*#__PURE__*/React.createElement("span", {
    className: "wte-demo-play",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: "lucide:play",
    size: 10,
    color: "#fff"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll wte-scroll"
  }, grouped.map((g, gi) => {
    const c = catWTE(g.name);
    return /*#__PURE__*/React.createElement("div", {
      key: g.name,
      className: "wte-group",
      style: {
        "--wte-a": c.a,
        "--wte-b": c.b,
        "--wte-ink": c.ink,
        "--wte-i": gi
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "wte-group-h"
    }, /*#__PURE__*/React.createElement("h2", null, g.name), c.blurb && /*#__PURE__*/React.createElement("span", {
      className: "wte-group-blurb"
    }, c.blurb)), /*#__PURE__*/React.createElement("div", {
      className: "wte-list"
    }, g.items.map(a => {
      const projected = Math.round(a.basePoints * PF_WTE.tierMultiplierFor(a, tier));
      const done = isExhaustedWTE(a, state);
      return /*#__PURE__*/React.createElement("div", {
        key: a.id,
        className: "wte-row" + (done ? " is-done" : ""),
        role: "button",
        tabIndex: 0,
        "aria-label": a.label + ". See how it works",
        onClick: () => setHowId(a.id),
        onKeyDown: e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setHowId(a.id);
          }
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "wte-row-ic"
      }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
        name: done ? "lucide:check" : iconWTE(a),
        size: 19,
        color: c.ink
      })), /*#__PURE__*/React.createElement("div", {
        className: "wte-row-main"
      }, /*#__PURE__*/React.createElement("span", {
        className: "ti"
      }, a.label), /*#__PURE__*/React.createElement("span", {
        className: "su"
      }, a.guardrail)), done ? /*#__PURE__*/React.createElement("span", {
        className: "wte-done",
        "aria-label": "Completed"
      }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
        name: "lucide:check",
        size: 14,
        color: "currentColor"
      }), " Done") : /*#__PURE__*/React.createElement("button", {
        className: "wte-earn",
        type: "button",
        "aria-label": "Earn " + projected + " points: " + a.label,
        onClick: e => {
          e.stopPropagation();
          earn(a, e.currentTarget);
        }
      }, "+", projected, " ", /*#__PURE__*/React.createElement("span", {
        className: "wte-pts-label"
      }, "pts")));
    })));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8
    }
  })), (() => {
    const a = howId ? actions.find(x => x.id === howId) : null;
    if (!a) return null;
    const c = catWTE(a.category);
    return /*#__PURE__*/React.createElement(HowItWorksSheet, {
      action: a,
      cat: c,
      projected: Math.round(a.basePoints * PF_WTE.tierMultiplierFor(a, tier)),
      done: isExhaustedWTE(a, state),
      onEarn: (act, el) => {
        earn(act, el);
        setHowId(null);
      },
      onClose: closeHow
    });
  })(), demoOpen && /*#__PURE__*/React.createElement(RewardsDemoSheet, {
    onClose: () => setDemoOpen(false)
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "ml-toast wte-toast " + toast.kind,
    role: "status"
  }, /*#__PURE__*/React.createElement(DSWTE.IconifyIcon, {
    name: toast.kind === "win" ? "lucide:zap" : "lucide:clock",
    size: 16,
    color: toast.kind === "win" ? "#FDBF38" : "#fff"
  }), toast.text));
}
function useDeviceScaleWTE() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateWTE(calc);
  useEffectWTE(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileWTE() {
  const [mobile, setMobile] = useStateWTE(() => window.matchMedia("(max-width:768px)").matches);
  useEffectWTE(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
/* App-wide theme: dark-mode-init.js stamps data-theme on <html> from pf-theme;
   follow it so the device frame's status bar / home indicator flip too. */
function useIsDarkWTE() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateWTE(read);
  useEffectWTE(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => mo.disconnect();
  }, []);
  return dark;
}
function WaysToEarnApp() {
  const mobile = useIsMobileWTE();
  const scale = useDeviceScaleWTE();
  const dark = useIsDarkWTE();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(WaysToEarnScreen, null));
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
    height: 956,
    dark: dark
  }, /*#__PURE__*/React.createElement(WaysToEarnScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(WaysToEarnApp, null));
