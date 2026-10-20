/* ===========================================================================
   PROfinity — Reward landing page (one page per league perk, 2026-10-13)
   RewardLanding.html?reward=<leagueKey>&ret=<page>   (phone, IOSDevice stage)
   RewardLandingWeb.html?reward=<leagueKey>&ret=<page> (desktop, window.PF_RL_WEB)
   Shows ONE Milestone Path perk: league gem hero, what it is, how you get it,
   where you stand (locked → progress + Ways to Earn; unlocked → "Redeem this
   perk"; redeemed → ticket with the voucher code + the place it's used) and
   the other perks on the path. Redeeming calls PFLoyalty.redeemPerk and plays
   the celebration overlay (confetti burst + gem pop + fanfare via
   pf:perk-redeemed in points-sound.js). ?celebrate=1 replays the overlay for
   screenshots. Reached from the Milestone Path (embed + MilestonePath.html).
   Suffixed -RL, classes rl-.
   =========================================================================== */
const {
  useState: useStateRL,
  useEffect: useEffectRL,
  useRef: useRefRL,
  useMemo: useMemoRL
} = React;
const DSRL = window.ProfinityDesignSystem_c2b5cc;
const PF_RL = window.PFLoyalty;
const LG_RL = window.PFLeague || null;
const RL_WEB = !!window.PF_RL_WEB;
const ME_RL = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function goRL(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function paramRL(name) {
  try {
    return new URLSearchParams(location.search).get(name);
  } catch (e) {
    return null;
  }
}
function retRL() {
  const r = paramRL("ret");
  if (r && /^[A-Za-z0-9_./?=&-]+$/.test(r)) return r;
  return RL_WEB ? "RewardsWeb.html" : "RewardsDashboard.html";
}
function fmtRL(n) {
  return PF_RL.formatNumber(n);
}
function whenRL(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return null;
  }
}
function leagueRL(key) {
  try {
    return LG_RL && LG_RL.getLeague ? LG_RL.getLeague(key) : null;
  } catch (e) {
    return null;
  }
}
function useIsDarkRL() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [dark, setDark] = useStateRL(read);
  useEffectRL(() => {
    const obs = new MutationObserver(() => setDark(read()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* league gem (raw JSON via lottie-web); loops when `play`, else parks on a mid frame */
function GemRL({
  src,
  size,
  play,
  className
}) {
  const host = useRefRL(null);
  useEffectRL(() => {
    let anim, t;
    const start = () => {
      if (!window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: src
      });
      anim.addEventListener("DOMLoaded", () => {
        if (play) anim.play();else anim.goToAndStop(Math.floor(anim.totalFrames * 0.4), true);
      });
    };
    if (window.lottie) start();else {
      t = setInterval(() => {
        if (window.lottie) {
          clearInterval(t);
          start();
        }
      }, 120);
      setTimeout(() => clearInterval(t), 8000);
    }
    return () => {
      clearInterval(t);
      if (anim) anim.destroy();
    };
  }, [src, play]);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "rl-gem" + (className ? " " + className : ""),
    style: {
      width: size,
      height: size
    },
    "aria-hidden": "true"
  });
}

/* where a redeemed perk is used — keyed off its copy, same map the old
   Milestone Path sheet used */
function perkActionRL(b) {
  const t = ((b.title || "") + " " + (b.delivery || "")).toLowerCase();
  if (/mastery|membership|subscri/.test(t)) return {
    label: "Upgrade to Mastery",
    href: "MembershipTier.html",
    icon: "lucide:crown",
    next: ["Pick the Mastery tier on the membership page.", "Paste the code at checkout — 5% comes straight off.", "One use, no expiry; the code is saved here."]
  };
  if (/credit|discount|voucher|checkout/.test(t)) return {
    label: "Use it at checkout",
    href: RL_WEB ? "AllCoursesWeb.html" : "AllCoursesMobile.html",
    icon: "lucide:book-open",
    next: ["Paste the code at checkout for any course in the catalogue.", "It's applied once, to one order, and never expires.", "The code is saved here if you need it again."]
  };
  if (/mentorship|dinner|concierge|calendar/.test(t)) return {
    label: "Book via concierge",
    href: RL_WEB ? "ChatSupportWeb.html" : "ChatSupport.html",
    icon: "lucide:calendar",
    next: ["Our concierge will message you to find a date.", "Quote your code when they do.", "One session — pick a moment that counts."]
  };
  if (/leaderboard/.test(t)) return {
    label: "Open the leaderboard",
    href: "Leaderboard.html",
    icon: "lucide:bar-chart-3",
    next: ["Your board is live from your first check-in.", "Rolling 30-day points decide your place.", "Climb it to unlock the next league perk."]
  };
  if (/bundle|digital|tools/.test(t)) return {
    label: "Open My Learning",
    href: RL_WEB ? "MyLearning.html" : "LearningMobile.html",
    icon: "lucide:book-open",
    next: ["The bundle is added to your library straight away.", "Find it under My Learning → Resources.", "Yours to keep — download anything you like."]
  };
  return {
    label: "See the Milestone Path",
    href: RL_WEB ? "RewardsWeb.html" : "MilestonePath.html",
    icon: "lucide:milestone",
    next: ["We'll email you the details within a day.", "Your code is saved here if you need it again.", "Keep earning — the next league is waiting."]
  };
}

/* ---------------------------------------------------- celebration overlay */
function burstRL(root, colors) {
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const w = root.clientWidth,
    h = root.clientHeight;
  const cx = w / 2,
    cy = h * 0.36;
  for (let i = 0; i < 90; i++) {
    const p = document.createElement("span");
    p.className = "rl-confetti";
    const size = 6 + Math.random() * 9;
    const round = Math.random() > 0.5;
    p.style.cssText = "left:" + cx + "px;top:" + cy + "px;width:" + size + "px;height:" + (round ? size : size * 0.5) + "px;background:" + colors[i % colors.length] + ";border-radius:" + (round ? "50%" : "2px");
    root.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * Math.min(w, h) * 0.55;
    const dx = Math.cos(ang) * dist,
      dy = Math.sin(ang) * dist * 0.8;
    const a = p.animate([{
      transform: "translate(0,0) rotate(0deg) scale(.4)",
      opacity: 0
    }, {
      opacity: 1,
      offset: 0.08
    }, {
      transform: "translate(" + dx.toFixed(0) + "px," + dy.toFixed(0) + "px) rotate(" + (Math.random() * 720 - 360).toFixed(0) + "deg) scale(1)",
      opacity: 1,
      offset: 0.55
    }, {
      transform: "translate(" + (dx * 1.1).toFixed(0) + "px," + (dy + 220 + Math.random() * 200).toFixed(0) + "px) rotate(" + (Math.random() * 900 - 450).toFixed(0) + "deg) scale(.9)",
      opacity: 0
    }], {
      duration: 1900 + Math.random() * 900,
      delay: Math.random() * 180,
      easing: "cubic-bezier(.15,.7,.3,1)",
      fill: "forwards"
    });
    a.onfinish = () => p.remove();
  }
}
function CelebrationRL({
  perk,
  league,
  voucher,
  onDone
}) {
  const root = useRefRL(null);
  const [copied, setCopied] = useStateRL(false);
  useEffectRL(() => {
    const colors = [league ? league.accent : "#FDBF38", league ? league.deep : "#292569", "#FDBF38", "#FF8FAE", "#5ED3B1", "#8DC5FF", "#FFD76A"];
    const t1 = setTimeout(() => burstRL(root.current, colors), 220);
    const t2 = setTimeout(() => burstRL(root.current, colors), 1100);
    const onKey = e => {
      if (e.key === "Escape") onDone();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  const copy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "rl-cele",
    ref: root,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "rl-cele-title",
    "data-screen-label": "Perk redeemed"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-cele-glow",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rl-cele-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rl-cele-gem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-cele-ring r1",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "rl-cele-ring r2",
    "aria-hidden": "true"
  }), league ? /*#__PURE__*/React.createElement(GemRL, {
    src: league.lottie,
    size: RL_WEB ? 150 : 132,
    play: true
  }) : /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:gift",
    size: 64,
    color: "var(--brand-gold)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "rl-cele-check",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:check",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "rl-cele-kicker"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:party-popper",
    size: 14,
    color: "currentColor"
  }), "Perk redeemed"), /*#__PURE__*/React.createElement("h2", {
    id: "rl-cele-title"
  }, "It's yours, Katy!"), /*#__PURE__*/React.createElement("p", {
    className: "rl-cele-sub"
  }, perk.benefit.title), /*#__PURE__*/React.createElement("div", {
    className: "rl-ticket rl-cele-ticket"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-ticket-label"
  }, "Your code"), /*#__PURE__*/React.createElement("code", {
    className: "rl-ticket-code"
  }, voucher.code), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rl-ticket-copy",
    onClick: copy,
    "aria-label": "Copy code"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: copied ? "lucide:check" : "lucide:copy",
    size: 14,
    color: "currentColor"
  }), copied ? "Copied" : "Copy")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ml-btn ml-btn-navy rl-cta rl-cele-cta",
    onClick: onDone
  }, "Show my reward", /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 16,
    color: "#fff"
  }))));
}

/* ---------------------------------------------------------------- page */
function RewardLandingView() {
  const [state, setState] = useStateRL(() => PF_RL.getState());
  const key = paramRL("reward") || (() => {
    try {
      const p = PF_RL.getMilestoneProgress();
      return (p.next || p.current || p.path[0]).key;
    } catch (e) {
      return "jade";
    }
  })();
  const perk = useMemoRL(() => PF_RL.getPerk(key, state), [key, state]);
  const [celebrate, setCelebrate] = useStateRL(() => paramRL("celebrate") === "1");
  const [justRedeemed, setJustRedeemed] = useStateRL(null);
  const [toast, setToast] = useStateRL(null);
  const [copied, setCopied] = useStateRL(false);
  const toastRef = useRefRL(null);
  useEffectRL(() => {
    const refresh = () => setState(PF_RL.getState());
    window.addEventListener("pf:points-earned", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("pf:points-earned", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const showToast = (text, icon) => {
    setToast({
      text,
      icon: icon || "lucide:check"
    });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2000);
  };
  if (!perk || !perk.benefit) {
    return /*#__PURE__*/React.createElement("div", {
      className: "rl-empty ml-empty"
    }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
      name: "lucide:gift",
      size: 28,
      color: "var(--gray-400)"
    }), /*#__PURE__*/React.createElement("p", null, "That reward isn't on the Milestone Path any more."), /*#__PURE__*/React.createElement("button", {
      className: "ml-btn ml-btn-navy ml-btn-sm",
      type: "button",
      onClick: () => goRL(retRL())
    }, "Back to Rewards"));
  }
  const m = perk.milestone,
    b = perk.benefit;
  const league = leagueRL(key);
  const vars = league ? {
    "--lg-accent": league.accent,
    "--lg-deep": league.deep,
    "--lg-soft": league.soft
  } : null;
  const locked = perk.status === "locked";
  const redeemed = perk.status === "redeemed";
  const voucher = perk.voucher || justRedeemed;
  const action = perkActionRL(b);
  const pts = state.lifetimePoints || 0;
  function redeem() {
    const res = PF_RL.redeemPerk(key);
    if (!res.ok) {
      showToast(res.reason, "lucide:lock");
      return;
    }
    setJustRedeemed(res.voucher);
    setState(PF_RL.getState());
    setCelebrate(true);
  }
  const copy = () => {
    if (!voucher) return;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  const otherPerks = perk.path.filter(x => x.key !== key);
  const statusOf = x => {
    try {
      return PF_RL.getPerk(x.key, state).status;
    } catch (e) {
      return "locked";
    }
  };
  const landing = k => (RL_WEB ? "RewardLandingWeb.html" : "RewardLanding.html") + "?reward=" + encodeURIComponent(k) + "&ret=" + encodeURIComponent(retRL());
  const hero = /*#__PURE__*/React.createElement("section", {
    className: "rl-hero rl-hero-" + perk.status,
    style: vars,
    "aria-label": b.title
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-hero-orb o1",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "rl-hero-orb o2",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rl-hero-gem"
  }, league ? /*#__PURE__*/React.createElement(GemRL, {
    src: league.lottie,
    size: RL_WEB ? 128 : 112,
    play: !locked
  }) : /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:gift",
    size: 56,
    color: "var(--brand-gold)"
  }), locked ? /*#__PURE__*/React.createElement("span", {
    className: "rl-hero-lock",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:lock",
    size: 14,
    color: "#fff"
  })) : null), /*#__PURE__*/React.createElement("span", {
    className: "rl-league-chip"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:star",
    size: 12,
    color: "currentColor"
  }), m.name, league ? " League" : "", " · ", m.threshold > 0 ? fmtRL(m.threshold) + " pts" : "Start"), /*#__PURE__*/React.createElement("h1", {
    className: "rl-title"
  }, b.title), /*#__PURE__*/React.createElement("p", {
    className: "rl-desc"
  }, b.description), /*#__PURE__*/React.createElement("span", {
    className: "rl-status-pill is-" + perk.status
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: redeemed ? "lucide:ticket" : locked ? "lucide:lock" : "lucide:check-circle",
    size: 13,
    color: "currentColor"
  }), redeemed ? "Redeemed · ready to use" : locked ? fmtRL(perk.remaining) + " pts to unlock" : "Unlocked — yours for good"));
  const standing = /*#__PURE__*/React.createElement("section", {
    className: "ml-card rl-card rl-standing is-" + perk.status,
    style: vars
  }, locked ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "rl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-card-ic"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:lock",
    size: 16,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Unlocks at ", fmtRL(m.threshold), " pts"), /*#__PURE__*/React.createElement("i", null, fmtRL(pts), " lifetime pts · ", fmtRL(perk.remaining), " to go"))), /*#__PURE__*/React.createElement("div", {
    className: "ml-progress-track rl-track",
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": perk.pct
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-progress-fill",
    style: {
      width: perk.pct + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "rl-track-ends"
  }, /*#__PURE__*/React.createElement("span", null, perk.prev ? perk.prev.name : "Start"), /*#__PURE__*/React.createElement("span", null, m.name)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ml-btn ml-btn-navy rl-cta",
    onClick: () => goRL((RL_WEB ? "WaysToEarn.html?ret=" : "WaysToEarn.html?ret=") + encodeURIComponent(landing(key)))
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:sparkles",
    size: 16,
    color: "#fff"
  }), "Earn points faster"), /*#__PURE__*/React.createElement("p", {
    className: "rl-note"
  }, "Points are lifetime — never spent, never expired. The perk unlocks the moment you cross the line.")) : redeemed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "rl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-card-ic is-ok"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:ticket",
    size: 16,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Ready to use"), /*#__PURE__*/React.createElement("i", null, "Redeemed ", whenRL(voucher.redeemedAt), perk.reachedAt ? " · earned " + whenRL(perk.reachedAt) : ""))), /*#__PURE__*/React.createElement("div", {
    className: "rl-ticket"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-ticket-label"
  }, "Your code"), /*#__PURE__*/React.createElement("code", {
    className: "rl-ticket-code"
  }, voucher.code), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rl-ticket-copy",
    onClick: copy,
    "aria-label": "Copy code"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: copied ? "lucide:check" : "lucide:copy",
    size: 14,
    color: "currentColor"
  }), copied ? "Copied" : "Copy")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ml-btn ml-btn-navy rl-cta",
    onClick: () => goRL(action.href)
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: action.icon,
    size: 16,
    color: "#fff"
  }), action.label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ml-btn ml-btn-ghost rl-cta rl-cta-ghost",
    onClick: () => showToast("Code sent to your inbox", "lucide:mail")
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:mail",
    size: 16,
    color: "currentColor"
  }), "Email me the code")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "rl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-card-ic is-ok"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:check-circle",
    size: 16,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Unlocked — yours for good"), /*#__PURE__*/React.createElement("i", null, perk.reachedAt ? "Earned " + whenRL(perk.reachedAt) : "Earned with your " + m.name + " badge"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ml-btn ml-btn-navy rl-cta rl-cta-redeem",
    onClick: redeem
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:gift",
    size: 18,
    color: "#fff"
  }), "Redeem this perk"), /*#__PURE__*/React.createElement("p", {
    className: "rl-note"
  }, "One tap mints your code. Nothing is spent — your points stay exactly where they are.")));
  const details = /*#__PURE__*/React.createElement("section", {
    className: "ml-card rl-card rl-details"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rl-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-row-ic"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:gift",
    size: 15,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "How you get it"), /*#__PURE__*/React.createElement("i", null, b.delivery || "Unlocked in your account"))), /*#__PURE__*/React.createElement("div", {
    className: "rl-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-row-ic"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:trophy",
    size: 15,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Who unlocks it"), /*#__PURE__*/React.createElement("i", null, m.threshold > 0 ? "Every member who reaches " + fmtRL(m.threshold) + " lifetime points" : "Every member, from their first check-in"))), /*#__PURE__*/React.createElement("div", {
    className: "rl-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-row-ic"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:shield-check",
    size: 15,
    color: "var(--brand-gold)"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "One-time perk"), /*#__PURE__*/React.createElement("i", null, "Redeem it once, keep it for good. Nothing ever locks back up."))));
  const next = /*#__PURE__*/React.createElement("section", {
    className: "ml-card rl-card rl-next"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "rl-h3"
  }, "What happens next"), /*#__PURE__*/React.createElement("ol", {
    className: "rl-steps"
  }, action.next.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "rl-step-n"
  }, i + 1), /*#__PURE__*/React.createElement("span", null, t)))));
  const more = /*#__PURE__*/React.createElement("section", {
    className: "rl-more"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "rl-h3 rl-more-h"
  }, "More on the path"), /*#__PURE__*/React.createElement("div", {
    className: "rl-more-list"
  }, otherPerks.map(x => {
    const lg = leagueRL(x.key);
    const st = statusOf(x);
    const xb = (x.benefits || [])[0];
    return /*#__PURE__*/React.createElement("button", {
      key: x.key,
      type: "button",
      className: "rl-more-item is-" + st,
      style: lg ? {
        "--lg-accent": lg.accent,
        "--lg-deep": lg.deep,
        "--lg-soft": lg.soft
      } : null,
      onClick: () => goRL(landing(x.key))
    }, /*#__PURE__*/React.createElement("span", {
      className: "rl-more-gem"
    }, lg ? /*#__PURE__*/React.createElement(GemRL, {
      src: lg.lottie,
      size: 40,
      play: false
    }) : /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
      name: "lucide:gift",
      size: 20,
      color: "var(--brand-gold)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "rl-more-tx"
    }, /*#__PURE__*/React.createElement("b", null, xb ? xb.title : x.name), /*#__PURE__*/React.createElement("i", null, x.name, lg ? " League" : "", " · ", st === "redeemed" ? "Redeemed" : st === "unlocked" ? "Ready to redeem" : fmtRL(x.threshold) + " pts")), /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
      name: "lucide:chevron-right",
      size: 16,
      color: "var(--gray-400)"
    }));
  })));
  const body = RL_WEB ? /*#__PURE__*/React.createElement("div", {
    className: "rl-web-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rl-web-main"
  }, hero, standing, more), /*#__PURE__*/React.createElement("aside", {
    className: "rl-web-side"
  }, details, next)) : /*#__PURE__*/React.createElement(React.Fragment, null, hero, standing, details, next, more, /*#__PURE__*/React.createElement("div", {
    className: "rl-spacer"
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, body, celebrate && voucher && /*#__PURE__*/React.createElement(CelebrationRL, {
    perk: perk,
    league: league,
    voucher: voucher,
    onDone: () => {
      setCelebrate(false);
      if (paramRL("celebrate")) {
        try {
          history.replaceState(null, "", location.pathname + "?reward=" + encodeURIComponent(key) + "&ret=" + encodeURIComponent(retRL()));
        } catch (e) {}
      }
    }
  }), celebrate && !voucher && /*#__PURE__*/React.createElement(CelebrationRL, {
    perk: perk,
    league: league,
    voucher: {
      code: "PF-" + key.slice(0, 3).toUpperCase() + "-DEMO-CODE",
      redeemedAt: new Date().toISOString()
    },
    onDone: () => setCelebrate(false)
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "ml-toast rl-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: toast.icon,
    size: 16,
    color: "#fff"
  }), toast.text));
}
function useIsMobileRL() {
  const [mobile, setMobile] = useStateRL(() => window.matchMedia("(max-width:768px)").matches);
  useEffectRL(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function useDeviceScaleRL() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateRL(calc);
  useEffectRL(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}
function RewardLandingScreen() {
  const title = (() => {
    try {
      const p = PF_RL.getPerk(paramRL("reward") || "");
      return p && p.milestone ? p.milestone.name + " perk" : "Reward";
    } catch (e) {
      return "Reward";
    }
  })();
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-screen rl-screen pf-funbg",
    "data-screen-label": "Reward"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ml-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ml-back",
    "aria-label": "Back",
    onClick: () => goRL(retRL())
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "ml-scroll rl-scroll"
  }, /*#__PURE__*/React.createElement(RewardLandingView, null)));
}
function RewardLandingMobile() {
  const mobile = useIsMobileRL();
  const scale = useDeviceScaleRL();
  const dark = useIsDarkRL();
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
  }, /*#__PURE__*/React.createElement(RewardLandingScreen, null));
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "scale(" + scale + ")",
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956,
    dark: dark
  }, /*#__PURE__*/React.createElement(RewardLandingScreen, null))));
}
function RewardLandingWeb() {
  const {
    TopNav
  } = DSRL;
  /* fun rewards background (2026-10-20): the page is a centred column, so the
     wash goes on <body> — rewards-fun-bg.css styles body.pf-funbg */
  useEffectRL(() => {
    document.body.classList.add("pf-funbg");
    return () => document.body.classList.remove("pf-funbg");
  }, []);
  const navigate = label => {
    const u = {
      Home: "NewsfeedWeb.html",
      Profile: "Profile.html",
      "My Learning": "MyLearning.html",
      Community: "Community.html",
      Agent: "Agent.html",
      Rewards: "RewardsWeb.html"
    }[label];
    if (u) goRL(u);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopNav, {
    active: "Rewards",
    user: ME_RL,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigate,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "rl-page",
    "data-screen-label": "Reward"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rl-crumb",
    onClick: () => goRL(retRL())
  }, /*#__PURE__*/React.createElement(DSRL.IconifyIcon, {
    name: "lucide:chevron-left",
    size: 16,
    color: "currentColor"
  }), "Back to Rewards"), /*#__PURE__*/React.createElement(RewardLandingView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(RL_WEB ? /*#__PURE__*/React.createElement(RewardLandingWeb, null) : /*#__PURE__*/React.createElement(RewardLandingMobile, null));
