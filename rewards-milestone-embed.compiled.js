/* ===========================================================================
   PROfinity — Rewards page embeds (mobile RewardsDashboard + web RewardsWeb)
   Two sections that used to live behind buttons and now sit directly on the
   Rewards page (user request 2026-09-24 "put it outside"):
     · LeagueRail  — "<X> League · Your league · rolling 30-day points" title
                     over the six gem badges (locked ones greyed), tap → Leaderboard
     · MilestonePath — the vertical league/milestone journey with each badge's
                     benefit bundle; the member's next league is expanded, the
                     rest collapse to a one-line summary and toggle on tap; a
                     "?" opens the how-it-works sheet.
   Exposed on window.PFRewardsEmbed so both page bundles can render them.
   Classes prefixed rme-. Needs lottie-web, PFLeague and PFLoyalty on the page.
   =========================================================================== */
(function () {
  const {
    useState,
    useEffect,
    useRef,
    useMemo
  } = React;
  const DS = window.ProfinityDesignSystem_c2b5cc;
  const Icon = DS.IconifyIcon;
  const PF = window.PFLoyalty;
  const LG = window.PFLeague || null;
  const go = url => (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
  const fmt = n => PF && PF.formatNumber ? PF.formatNumber(n) : String(n);

  /* league gem from its raw Lottie JSON; parked on a mid frame unless `play` */
  function Gem({
    src,
    size,
    play,
    className
  }) {
    const host = useRef(null);
    const animRef = useRef(null);
    useEffect(() => {
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
        animRef.current = anim;
        anim.addEventListener("DOMLoaded", () => {
          if (!animRef.current) return;
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
        animRef.current = null;
        if (anim) anim.destroy();
      };
    }, [src]);
    useEffect(() => {
      const a = animRef.current;
      if (!a || !a.isLoaded) return;
      if (play) a.play();else a.goToAndStop(Math.floor(a.totalFrames * 0.4), true);
    }, [play]);
    return /*#__PURE__*/React.createElement("span", {
      ref: host,
      className: "rme-gem" + (className ? " " + className : ""),
      style: {
        width: size,
        height: size
      },
      "aria-hidden": "true"
    });
  }
  function useLeagueProgress() {
    const read = () => {
      try {
        return LG ? LG.getProgress() : null;
      } catch (e) {
        return null;
      }
    };
    const [p, setP] = useState(read);
    useEffect(() => {
      const refresh = () => setP(read());
      window.addEventListener("pf:points-earned", refresh);
      window.addEventListener("storage", refresh);
      document.addEventListener("pf:league-changed", refresh);
      return () => {
        window.removeEventListener("pf:points-earned", refresh);
        window.removeEventListener("storage", refresh);
        document.removeEventListener("pf:league-changed", refresh);
      };
    }, []);
    return p;
  }

  /* ------------------------------------------------------------ league rail */
  function LeagueRail({
    href
  }) {
    const p = useLeagueProgress();
    const railRef = useRef(null);
    useEffect(() => {
      const rail = railRef.current;
      if (!rail || !p) return;
      const el = rail.querySelector('[data-idx="' + p.index + '"]');
      if (!el) return;
      const left = el.offsetLeft - rail.clientWidth / 2 + el.offsetWidth / 2;
      rail.scrollTo({
        left: Math.max(0, left)
      });
    }, [p && p.index]);
    if (!p || !p.current) return null;
    const cur = p.current,
      leagues = p.leagues,
      mine = p.index;
    const target = href || "Leaderboard.html";
    return /*#__PURE__*/React.createElement("section", {
      className: "rme-league",
      style: {
        "--lg-accent": cur.accent,
        "--lg-deep": cur.deep,
        "--lg-soft": cur.soft
      },
      "aria-label": cur.name + " League",
      "data-screen-label": "League badges"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rme-league-head"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "rme-league-title",
      style: {
        color: cur.deep
      }
    }, cur.name, " League"), /*#__PURE__*/React.createElement("p", {
      className: "rme-league-sub"
    }, (p.preview ? "Preview · " : "Your league · ") + "rolling 30-day points")), /*#__PURE__*/React.createElement("div", {
      className: "rme-rail",
      ref: railRef
    }, leagues.map((l, i) => {
      const locked = i > mine,
        isMine = i === mine;
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        key: l.key,
        "data-idx": i,
        className: "rme-rail-item" + (isMine ? " mine" : "") + (locked ? " locked" : ""),
        style: {
          "--lg-accent": l.accent,
          "--lg-soft": l.soft
        },
        "aria-label": l.name + " League" + (locked ? ", locked · unlocks at " + fmt(l.requires) + " pts" : isMine ? ", your league" : ", earned") + ". Open the leaderboard",
        onClick: () => go(target)
      }, /*#__PURE__*/React.createElement("span", {
        className: "rme-rail-gem"
      }, /*#__PURE__*/React.createElement(Gem, {
        src: l.lottie,
        size: isMine ? 96 : 66,
        play: isMine
      }), locked && /*#__PURE__*/React.createElement("span", {
        className: "rme-rail-lock"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "lucide:lock",
        size: 16,
        color: "#fff"
      }))), isMine && /*#__PURE__*/React.createElement("span", {
        className: "rme-rail-you"
      }, "You"));
    })));
  }

  /* ------------------------------------------------------- help sheet ("?") */
  function HelpSheet({
    open,
    onClose
  }) {
    useEffect(() => {
      if (!open) return;
      const onKey = e => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "rme-scrim",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "rme-help",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "rme-help-title",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("span", {
      className: "rme-help-handle",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "rme-help-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rme-help-ic",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:milestone",
      size: 20,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("h2", {
      id: "rme-help-title"
    }, "How the path works"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "rme-help-close",
      "aria-label": "Close",
      onClick: onClose
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:x",
      size: 18,
      color: "var(--gray-600)"
    }))), /*#__PURE__*/React.createElement("p", {
      className: "rme-help-p"
    }, "One journey, no choices to make — each milestone is a league badge. Its full bundle of benefits unlocks automatically the moment your Lifetime Points reach it, and you keep it forever."), /*#__PURE__*/React.createElement("p", {
      className: "rme-help-p"
    }, "Points never get spent, so nothing here ever locks back up."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "rme-help-ok",
      onClick: onClose
    }, "Got it")));
  }

  /* ---------------------------------------------------------- path nodes */
  function whenLabel(iso) {
    if (!iso) return null;
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
  function leagueFor(key) {
    try {
      return LG && LG.getLeague ? LG.getLeague(key) : null;
    } catch (e) {
      return null;
    }
  }
  function Node({
    milestone,
    status,
    isLast,
    reachedAt,
    open,
    onToggle
  }) {
    const league = leagueFor(milestone.key);
    const vars = league ? {
      "--lg-accent": league.accent,
      "--lg-deep": league.deep,
      "--lg-soft": league.soft
    } : null;
    const reached = status === "passed" ? whenLabel(reachedAt) : null;
    const n = milestone.benefits.length;
    const summary = n ? n === 1 ? milestone.benefits[0].title : n + " benefits · " + milestone.benefits[0].title + " +" + (n - 1) : "No benefits listed";
    const tag = status === "passed" ? (milestone.threshold > 0 ? "Badge earned — yours for good" : "Your starting league") + (reached && milestone.threshold > 0 ? " · " + reached : "") : status === "current" ? "Next league — unlocks automatically" : "Locked";
    return /*#__PURE__*/React.createElement("div", {
      className: "rme-node rme-node-" + status + (league ? " rme-node-league" : "") + (open ? " is-open" : ""),
      style: vars
    }, /*#__PURE__*/React.createElement("div", {
      className: "rme-node-rail"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rme-node-dot rme-node-dot-" + status,
      "aria-hidden": "true"
    }, status === "passed" ? /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:check",
      size: 14,
      color: "#fff"
    }) : status === "current" ? /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:map-pin",
      size: 14,
      color: "#fff"
    }) : /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:lock",
      size: 13,
      color: "#fff"
    })), !isLast && /*#__PURE__*/React.createElement("span", {
      className: "rme-node-line rme-node-line-" + status,
      "aria-hidden": "true"
    })), /*#__PURE__*/React.createElement("div", {
      className: "rme-node-body"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "rme-node-head",
      "aria-expanded": open,
      onClick: onToggle,
      "aria-label": milestone.name + (league ? " League" : "") + ", " + (milestone.threshold > 0 ? fmt(milestone.threshold) + " points" : "start") + ". " + tag + ". " + (open ? "Hide" : "Show") + " benefits"
    }, league ? /*#__PURE__*/React.createElement(Gem, {
      src: league.lottie,
      size: 40,
      play: status === "current"
    }) : null, /*#__PURE__*/React.createElement("span", {
      className: "rme-node-tx"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rme-node-name"
    }, milestone.name, league ? /*#__PURE__*/React.createElement("small", null, " League") : null), /*#__PURE__*/React.createElement("span", {
      className: "rme-node-tag rme-node-tag-" + status
    }, tag), !open && /*#__PURE__*/React.createElement("span", {
      className: "rme-node-summary"
    }, summary)), /*#__PURE__*/React.createElement("span", {
      className: "rme-node-side"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rme-node-pts"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:star",
      size: 12,
      color: "currentColor"
    }), milestone.threshold > 0 ? fmt(milestone.threshold) + " pts" : "Start"), /*#__PURE__*/React.createElement("span", {
      className: "rme-node-chev",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:chevron-down",
      size: 16,
      color: "var(--gray-400)"
    })))), open && /*#__PURE__*/React.createElement("div", {
      className: "rme-benefits"
    }, milestone.benefits.map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "rme-benefit"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rme-benefit-ic",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: status === "locked" ? "lucide:lock" : "lucide:gift",
      size: 15,
      color: status === "locked" ? "var(--gray-400)" : "var(--brand-gold)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "rme-benefit-copy"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rme-benefit-title"
    }, b.title), /*#__PURE__*/React.createElement("div", {
      className: "rme-benefit-desc"
    }, b.description), b.delivery ? /*#__PURE__*/React.createElement("div", {
      className: "rme-benefit-delivery"
    }, b.delivery) : null))))));
  }

  /* ----------------------------------------------------------- the path */
  function MilestonePath({
    state: stateProp,
    title
  }) {
    const [own, setOwn] = useState(() => PF.getState());
    useEffect(() => {
      if (stateProp) return;
      const refresh = () => setOwn(PF.getState());
      window.addEventListener("pf:points-earned", refresh);
      window.addEventListener("storage", refresh);
      return () => {
        window.removeEventListener("pf:points-earned", refresh);
        window.removeEventListener("storage", refresh);
      };
    }, [stateProp]);
    const state = stateProp || own;
    const progress = useMemo(() => PF.getMilestoneProgress(state), [state]);
    const currentKey = progress.next ? progress.next.key : null;
    const [openKeys, setOpenKeys] = useState(null); // null = default (current only)
    const [helpOpen, setHelpOpen] = useState(false);
    const isOpen = key => openKeys ? openKeys.has(key) : key === currentKey;
    const toggle = key => setOpenKeys(prev => {
      const next = new Set(prev || (currentKey ? [currentKey] : []));
      if (next.has(key)) next.delete(key);else next.add(key);
      return next;
    });
    const passed = new Set(progress.passed.map(m => m.key));
    const reachedAt = state.milestonesReachedAt || {};
    const nextLg = progress.next ? leagueFor(progress.next.key) : null;
    return /*#__PURE__*/React.createElement("section", {
      className: "rme-path",
      "aria-label": title || "Milestone Path",
      "data-screen-label": "Milestone Path"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rme-path-head"
    }, /*#__PURE__*/React.createElement("h2", null, title || "Milestone Path"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "rme-help-btn",
      "aria-label": "How the Milestone Path works",
      "aria-haspopup": "dialog",
      "aria-expanded": helpOpen,
      onClick: () => setHelpOpen(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:circle-help",
      size: 20,
      color: "var(--gray-900)"
    }))), progress.next ? /*#__PURE__*/React.createElement("div", {
      className: "rme-next",
      style: nextLg ? {
        "--lg-accent": nextLg.accent,
        "--lg-deep": nextLg.deep
      } : null
    }, /*#__PURE__*/React.createElement("div", {
      className: "rme-next-top"
    }, /*#__PURE__*/React.createElement("span", null, fmt(state.lifetimePoints), " pts"), /*#__PURE__*/React.createElement("span", null, fmt(progress.next.threshold), " pts")), /*#__PURE__*/React.createElement("div", {
      className: "rme-next-track",
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": progress.pct
    }, /*#__PURE__*/React.createElement("div", {
      className: "rme-next-fill",
      style: {
        width: progress.pct + "%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "rme-next-note"
    }, fmt(progress.remaining), " pts to unlock ", /*#__PURE__*/React.createElement("b", null, progress.next.name, nextLg ? " League" : ""))) : /*#__PURE__*/React.createElement("div", {
      className: "rme-next rme-next-done"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:check-circle",
      size: 18,
      color: "var(--success)"
    }), /*#__PURE__*/React.createElement("div", {
      className: "rme-next-note"
    }, "You've walked the whole path — ", /*#__PURE__*/React.createElement("b", null, "every benefit is yours"), ".")), /*#__PURE__*/React.createElement("div", {
      className: "rme-nodes"
    }, progress.path.map((m, i) => {
      const status = passed.has(m.key) ? "passed" : m.key === currentKey ? "current" : "locked";
      return /*#__PURE__*/React.createElement(Node, {
        key: m.key,
        milestone: m,
        status: status,
        isLast: i === progress.path.length - 1,
        reachedAt: reachedAt[m.key],
        open: isOpen(m.key),
        onToggle: () => toggle(m.key)
      });
    })), /*#__PURE__*/React.createElement(HelpSheet, {
      open: helpOpen,
      onClose: () => setHelpOpen(false)
    }));
  }
  window.PFRewardsEmbed = {
    LeagueRail,
    MilestonePath,
    HelpSheet
  };
})();
