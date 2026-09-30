/* ===========================================================================
   PROfinity — Agents · shared UI (web + mobile)
   Catalogue card, spotlight cards, filter chips, detail sheet/dialog and the
   "how it works" strip. Reads window.PFAgents (agents-data.js). Exposes
   window.PFAgentsUI. Class prefix: agx-. Suffixed -AX to avoid scope clashes.
   =========================================================================== */
(function () {
  const {
    useState: useStateAX,
    useEffect: useEffectAX,
    useRef: useRefAX
  } = React;
  const DSAX = window.ProfinityDesignSystem_c2b5cc;
  const Ic = ({
    name,
    size = 18,
    color,
    className
  }) => /*#__PURE__*/React.createElement(DSAX.IconifyIcon, {
    name: name,
    size: size,
    color: color,
    className: className
  });
  const PFA = window.PFAgents;

  /* ------------------------------------------------------------ waitlist */
  function useWaitlistAX() {
    const [ids, setIds] = useStateAX(() => PFA.readWaitlist());
    useEffectAX(() => {
      const h = e => setIds(e.detail && e.detail.ids || PFA.readWaitlist());
      window.addEventListener("pf:agent-waitlist", h);
      return () => window.removeEventListener("pf:agent-waitlist", h);
    }, []);
    return {
      ids,
      has: id => ids.indexOf(id) !== -1,
      toggle: id => ids.indexOf(id) !== -1 ? PFA.leave(id) : PFA.join(id)
    };
  }

  /* ------------------------------------------------------------ atoms */
  function AgentIcon({
    agent,
    size = 52,
    radius = 16
  }) {
    const t = PFA.TONES[agent.tone] || PFA.TONES.purple;
    return /*#__PURE__*/React.createElement("span", {
      className: "agx-ic agx-ic-" + agent.tone,
      style: {
        width: size,
        height: size,
        borderRadius: radius,
        "--ic-bg": t.bg,
        "--ic-fg": t.fg
      },
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: agent.icon,
      size: Math.round(size * 0.46)
    }));
  }
  function StatusPill({
    agent,
    compact
  }) {
    if (agent.status === "available") {
      return /*#__PURE__*/React.createElement("span", {
        className: "agx-status is-live"
      }, /*#__PURE__*/React.createElement("span", {
        className: "agx-dot"
      }), compact ? "Available" : "Available now");
    }
    return /*#__PURE__*/React.createElement("span", {
      className: "agx-status is-soon"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:clock",
      size: 13
    }), compact || !agent.eta ? "Coming soon" : "Coming " + agent.eta.toLowerCase());
  }
  function Badge({
    label
  }) {
    if (!label) return null;
    return /*#__PURE__*/React.createElement("span", {
      className: "agx-badge"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "fluent:crown-16-filled",
      size: 12
    }), label);
  }
  function NotifyButton({
    agent,
    wl,
    size = "md",
    onJoin
  }) {
    const on = wl.has(agent.id);
    const [flash, setFlash] = useStateAX(false);
    const click = e => {
      e.stopPropagation();
      const was = on;
      wl.toggle(agent.id);
      if (!was) {
        setFlash(true);
        setTimeout(() => setFlash(false), 900);
        if (onJoin) onJoin(agent);
      }
    };
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-notify agx-notify-" + size + (on ? " is-on" : "") + (flash ? " is-flash" : ""),
      onClick: click,
      "aria-pressed": on
    }, /*#__PURE__*/React.createElement(Ic, {
      name: on ? "lucide:check" : "lucide:bell",
      size: size === "sm" ? 15 : 17
    }), on ? "On the waitlist" : "Notify me");
  }
  function Waiting({
    agent,
    wl
  }) {
    if (agent.status !== "soon") return null;
    const n = (agent.waiting || 0) + (wl.has(agent.id) ? 1 : 0);
    return /*#__PURE__*/React.createElement("span", {
      className: "agx-waiting"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:users",
      size: 13
    }), n.toLocaleString(), " waiting");
  }

  /* ------------------------------------------------------------ live (available) card — dark spotlight treatment inside the grid */
  function LiveArt({
    agent,
    mobile
  }) {
    if (agent.isAva) {
      return /*#__PURE__*/React.createElement("div", {
        className: "agx-live-art"
      }, /*#__PURE__*/React.createElement("div", {
        className: "agx-face agx-face-ava"
      }, /*#__PURE__*/React.createElement("span", {
        className: "agx-face-ring r1"
      }), /*#__PURE__*/React.createElement("span", {
        className: "agx-face-ring r2"
      }), /*#__PURE__*/React.createElement("span", {
        className: "agx-ava-orb agx-ava-orb-lg",
        "aria-hidden": "true"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "lucide:sparkles",
        size: 30,
        color: "#fff"
      }))), /*#__PURE__*/React.createElement("div", {
        className: "agx-face-chip c1"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "lucide:list-checks",
        size: 12
      }), "Plan today"), /*#__PURE__*/React.createElement("div", {
        className: "agx-face-chip c2"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: "lucide:bar-chart-2",
        size: 12
      }), "Review progress"));
    }
    if (agent.id !== "assess-pro") {
      const chips = agent.artChips || [];
      return /*#__PURE__*/React.createElement("div", {
        className: "agx-live-art"
      }, /*#__PURE__*/React.createElement("div", {
        className: "agx-face agx-face-ava"
      }, /*#__PURE__*/React.createElement("span", {
        className: "agx-face-ring r1"
      }), /*#__PURE__*/React.createElement("span", {
        className: "agx-face-ring r2"
      }), /*#__PURE__*/React.createElement("span", {
        className: "agx-ava-orb agx-ava-orb-lg",
        "aria-hidden": "true"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: agent.icon,
        size: 30,
        color: "#fff"
      }))), chips[0] && /*#__PURE__*/React.createElement("div", {
        className: "agx-face-chip c1"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: chips[0][0],
        size: 12
      }), chips[0][1]), chips[1] && /*#__PURE__*/React.createElement("div", {
        className: "agx-face-chip c2"
      }, /*#__PURE__*/React.createElement(Ic, {
        name: chips[1][0],
        size: 12
      }), chips[1][1]));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "agx-live-art"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-face"
    }, /*#__PURE__*/React.createElement("span", {
      className: "agx-face-ring r1"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-ring r2"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-line l1"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-line l2"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-line l3"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p1"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p2"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p3"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p4"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p5"
    }), /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:scan-face",
      size: 56
    })), /*#__PURE__*/React.createElement("div", {
      className: "agx-face-chip c1"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:sparkles",
      size: 12
    }), "Symmetry 94%"), /*#__PURE__*/React.createElement("div", {
      className: "agx-face-chip c2"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:trending-up",
      size: 12
    }), "Volume · mid-face"));
  }
  function AgentCardLive({
    agent,
    onOpen,
    mobile
  }) {
    const primary = () => agent.isAva ? PFA.askAva("Which Profinity agent should I activate first for my clinic goals?", mobile) : agent.href ? PFA.open(agent, mobile) : onOpen(agent);
    const secondary = () => onOpen(agent, agent.isAva ? "info" : "demo");
    const detailCta = agent.isAva ? "Learn more" : "Watch demo";
    return /*#__PURE__*/React.createElement("article", {
      className: "agx-card agx-live agx-live-" + agent.tone,
      onClick: () => onOpen(agent),
      role: "button",
      tabIndex: 0,
      onKeyDown: e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(agent);
        }
      },
      "aria-label": agent.name + " — available now"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-glow",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement(LiveArt, {
      agent: agent,
      mobile: mobile
    }), /*#__PURE__*/React.createElement("div", {
      className: "agx-live-kicker"
    }, /*#__PURE__*/React.createElement("span", {
      className: "agx-dot"
    }), "Available now · ", agent.badge), /*#__PURE__*/React.createElement("h3", {
      className: "agx-live-title"
    }, agent.isAva ? agent.shortName : agent.name), /*#__PURE__*/React.createElement("p", {
      className: "agx-live-tag"
    }, agent.tagline), /*#__PURE__*/React.createElement("ul", {
      className: "agx-spot-list agx-live-list"
    }, agent.bullets.map((b, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:check-circle-2",
      size: 15
    }), b))), /*#__PURE__*/React.createElement("div", {
      className: "agx-live-actions",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-primary agx-primary-light agx-primary-sm",
      onClick: primary
    }, agent.cta, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:arrow-right",
      size: 15
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-ghost agx-ghost-sm",
      onClick: secondary
    }, /*#__PURE__*/React.createElement(Ic, {
      name: agent.isAva ? "lucide:info" : "lucide:play",
      size: 14
    }), detailCta)));
  }

  /* ------------------------------------------------------------ catalogue card */
  function AgentCardAX({
    agent,
    wl,
    onOpen,
    mobile
  }) {
    const live = agent.status === "available";
    if (live) return /*#__PURE__*/React.createElement(AgentCardLive, {
      agent: agent,
      onOpen: onOpen,
      mobile: mobile
    });
    const primary = () => {
      if (agent.isAva) return PFA.askAva("Which Profinity agent should I activate first for my clinic goals?", mobile);
      onOpen(agent);
    };
    return /*#__PURE__*/React.createElement("article", {
      className: "agx-card" + (live ? " is-live" : ""),
      onClick: () => onOpen(agent),
      role: "button",
      tabIndex: 0,
      onKeyDown: e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(agent);
        }
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-card-top"
    }, /*#__PURE__*/React.createElement(AgentIcon, {
      agent: agent,
      size: mobile ? 48 : 52,
      radius: 14
    }), /*#__PURE__*/React.createElement("div", {
      className: "agx-card-meta"
    }, /*#__PURE__*/React.createElement(StatusPill, {
      agent: agent,
      compact: mobile
    }))), /*#__PURE__*/React.createElement("div", {
      className: "agx-card-cat"
    }, agent.category), /*#__PURE__*/React.createElement("h3", {
      className: "agx-card-title"
    }, agent.name), /*#__PURE__*/React.createElement("p", {
      className: "agx-card-tag"
    }, agent.tagline), /*#__PURE__*/React.createElement("p", {
      className: "agx-card-desc"
    }, agent.description), /*#__PURE__*/React.createElement("div", {
      className: "agx-card-foot",
      onClick: e => e.stopPropagation()
    }, live ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-primary agx-primary-sm",
      onClick: primary
    }, agent.cta || "Open", /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:arrow-right",
      size: 15
    })) : /*#__PURE__*/React.createElement(NotifyButton, {
      agent: agent,
      wl: wl,
      size: "sm"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-card-foot-r"
    }, live ? /*#__PURE__*/React.createElement(Badge, {
      label: agent.badge
    }) : /*#__PURE__*/React.createElement(Waiting, {
      agent: agent,
      wl: wl
    }))));
  }

  /* ------------------------------------------------------------ spotlight cards */
  function SpotlightAssess({
    agent,
    onOpen,
    mobile
  }) {
    return /*#__PURE__*/React.createElement("section", {
      className: "agx-spot agx-spot-assess",
      "aria-label": "Assess Pro — available now"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-glow",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-kicker"
    }, /*#__PURE__*/React.createElement("span", {
      className: "agx-dot"
    }), "Available now · ", agent.badge), /*#__PURE__*/React.createElement("h2", {
      className: "agx-spot-title"
    }, agent.name), /*#__PURE__*/React.createElement("p", {
      className: "agx-spot-tag"
    }, agent.tagline), !mobile && /*#__PURE__*/React.createElement("p", {
      className: "agx-spot-desc"
    }, agent.description), /*#__PURE__*/React.createElement("ul", {
      className: "agx-spot-list"
    }, agent.bullets.map((b, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:check-circle-2",
      size: 16
    }), b))), /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-primary agx-primary-light",
      onClick: () => onOpen(agent)
    }, agent.cta, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:arrow-right",
      size: 16
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-ghost",
      onClick: () => onOpen(agent, "demo")
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:play",
      size: 15
    }), "Watch 2-min demo"))), /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-art",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-face"
    }, /*#__PURE__*/React.createElement("span", {
      className: "agx-face-ring r1"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-ring r2"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-line l1"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-line l2"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-line l3"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p1"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p2"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p3"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p4"
    }), /*#__PURE__*/React.createElement("span", {
      className: "agx-face-pt p5"
    }), /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:scan-face",
      size: mobile ? 64 : 88
    })), /*#__PURE__*/React.createElement("div", {
      className: "agx-face-chip c1"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:sparkles",
      size: 12
    }), "Symmetry 94%"), /*#__PURE__*/React.createElement("div", {
      className: "agx-face-chip c2"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:trending-up",
      size: 12
    }), "Volume · mid-face")));
  }
  function SpotlightAva({
    agent,
    mobile
  }) {
    const ask = p => PFA.askAva(p, mobile);
    return /*#__PURE__*/React.createElement("section", {
      className: "agx-spot agx-spot-ava",
      "aria-label": "Ava, your coach — available now"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-kicker"
    }, /*#__PURE__*/React.createElement("span", {
      className: "agx-dot"
    }), "Live on My Learning"), /*#__PURE__*/React.createElement("div", {
      className: "agx-ava-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "agx-ava-orb",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:sparkles",
      size: 22,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      className: "agx-spot-title"
    }, agent.shortName), /*#__PURE__*/React.createElement("p", {
      className: "agx-spot-tag"
    }, agent.tagline))), !mobile && /*#__PURE__*/React.createElement("p", {
      className: "agx-spot-desc"
    }, agent.description), /*#__PURE__*/React.createElement("div", {
      className: "agx-ava-chips"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => ask("Help me plan today's targets so I make progress on my clinic goal.")
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:list-checks",
      size: 13
    }), "Plan today"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => ask("Review my progress across the Prosperity Spiral and tell me what to focus on next.")
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:bar-chart-2",
      size: 13
    }), "Review progress"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => ask("Role-play a consultation with a nervous first-time lip filler patient.")
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:messages-square",
      size: 13
    }), "Rehearse a consult")), /*#__PURE__*/React.createElement("div", {
      className: "agx-spot-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-primary agx-primary-light",
      onClick: () => ask("Which Profinity agent should I activate first for my clinic goals?")
    }, agent.cta, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:arrow-right",
      size: 16
    })))));
  }

  /* ------------------------------------------------------------ filters */
  function FilterChips({
    value,
    onChange,
    agents
  }) {
    const cats = PFA.CATEGORIES;
    const countFor = c => c === "All" ? agents.length : agents.filter(a => a.category === c).length;
    return /*#__PURE__*/React.createElement("div", {
      className: "agx-filters"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-chips",
      role: "tablist",
      "aria-label": "Filter by role"
    }, cats.map(c => /*#__PURE__*/React.createElement("button", {
      key: c,
      type: "button",
      role: "tab",
      "aria-selected": value === c,
      className: "agx-chip" + (value === c ? " is-on" : ""),
      onClick: () => onChange(c)
    }, c, /*#__PURE__*/React.createElement("span", {
      className: "agx-chip-n"
    }, countFor(c))))));
  }

  /* ------------------------------------------------------------ how it works */
  const STEPS = [{
    icon: "lucide:mouse-pointer-click",
    t: "Pick an agent",
    d: "Start with what costs you most today: missed calls, slow replies or unclear plans."
  }, {
    icon: "lucide:plug-zap",
    t: "Connect your clinic",
    d: "Link your diary, treatment menu and socials once. Every agent shares the same setup."
  }, {
    icon: "lucide:sparkles",
    t: "Ava keeps them aligned",
    d: "Your coach knows your goal and nudges each agent toward it, then reports back."
  }];
  function HowItWorks({
    mobile
  }) {
    return /*#__PURE__*/React.createElement("section", {
      className: "agx-how",
      "aria-label": "How agents work"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-sec-h"
    }, /*#__PURE__*/React.createElement("span", {
      className: "agx-eyebrow"
    }, "How it works"), /*#__PURE__*/React.createElement("h2", {
      className: "agx-h2"
    }, "One clinic setup, every agent.")), /*#__PURE__*/React.createElement("ol", {
      className: "agx-steps"
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      className: "agx-step"
    }, /*#__PURE__*/React.createElement("span", {
      className: "agx-step-n"
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      className: "agx-step-ic"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: s.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, s.t), /*#__PURE__*/React.createElement("p", null, s.d))))));
  }
  function RequestCard({
    mobile
  }) {
    return /*#__PURE__*/React.createElement("section", {
      className: "agx-request",
      "aria-label": "Suggest an agent"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Have an agent in mind?"), /*#__PURE__*/React.createElement("p", null, "Tell Ava what you keep doing by hand. The most-requested ideas move up the roadmap.")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-primary agx-primary-navy",
      onClick: () => PFA.askAva("I'd like to suggest a new Profinity agent. Here's the task I keep doing by hand: ", mobile)
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:lightbulb",
      size: 16
    }), "Suggest an agent"));
  }

  /* ------------------------------------------------------------ detail sheet / dialog */
  function AgentDetail({
    agent,
    mode,
    wl,
    onClose,
    mobile
  }) {
    const boxRef = useRefAX(null);
    useEffectAX(() => {
      if (!agent) return;
      const k = e => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", k);
      const prev = document.body.style.overflow;
      if (!mobile) document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", k);
        if (!mobile) document.body.style.overflow = prev;
      };
    }, [agent]);
    if (!agent) return null;
    const live = agent.status === "available";
    const t = PFA.TONES[agent.tone] || PFA.TONES.purple;
    return /*#__PURE__*/React.createElement("div", {
      className: "agx-scrim" + (mobile ? " is-sheet" : " is-dialog"),
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      ref: boxRef,
      className: "agx-detail",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "agx-detail-title",
      onClick: e => e.stopPropagation(),
      style: {
        "--ic-bg": t.bg,
        "--ic-fg": t.fg
      }
    }, mobile && /*#__PURE__*/React.createElement("span", {
      className: "agx-handle",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-close",
      onClick: onClose,
      "aria-label": "Close"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:x",
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      className: "agx-detail-head"
    }, /*#__PURE__*/React.createElement(AgentIcon, {
      agent: agent,
      size: mobile ? 56 : 64,
      radius: 18
    }), /*#__PURE__*/React.createElement("div", {
      className: "agx-detail-headtx"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-card-cat"
    }, agent.category), /*#__PURE__*/React.createElement("h2", {
      id: "agx-detail-title",
      className: "agx-detail-title"
    }, agent.name), /*#__PURE__*/React.createElement("div", {
      className: "agx-detail-pills"
    }, /*#__PURE__*/React.createElement(StatusPill, {
      agent: agent
    }), /*#__PURE__*/React.createElement(Badge, {
      label: agent.badge
    })))), mode === "demo" && /*#__PURE__*/React.createElement("div", {
      className: "agx-demo",
      "aria-label": "Demo video"
    }, /*#__PURE__*/React.createElement("div", {
      className: "agx-demo-ph"
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:play",
      size: 26,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", null, "Demo video · 2:04")), /*#__PURE__*/React.createElement("p", {
      className: "agx-detail-tag"
    }, agent.tagline), /*#__PURE__*/React.createElement("p", {
      className: "agx-detail-desc"
    }, agent.description), /*#__PURE__*/React.createElement("h4", {
      className: "agx-detail-h4"
    }, "What it does"), /*#__PURE__*/React.createElement("ul", {
      className: "agx-detail-list"
    }, agent.bullets.map((b, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:check",
      size: 15
    }), b))), /*#__PURE__*/React.createElement("dl", {
      className: "agx-detail-facts"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Best for"), /*#__PURE__*/React.createElement("dd", null, agent.bestFor)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Pricing"), /*#__PURE__*/React.createElement("dd", null, agent.price)), agent.eta && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Expected"), /*#__PURE__*/React.createElement("dd", null, agent.eta))), /*#__PURE__*/React.createElement("div", {
      className: "agx-detail-foot"
    }, live ? agent.isAva ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-primary",
      onClick: () => PFA.askAva("Which Profinity agent should I activate first for my clinic goals?", mobile)
    }, agent.cta, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:arrow-right",
      size: 16
    })) : /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "agx-primary",
      onClick: () => PFA.open(agent, mobile)
    }, agent.cta, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:arrow-right",
      size: 16
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NotifyButton, {
      agent: agent,
      wl: wl
    }), /*#__PURE__*/React.createElement(Waiting, {
      agent: agent,
      wl: wl
    })))));
  }

  /* ------------------------------------------------------------ toast */
  function useToastAX() {
    const [msg, setMsg] = useStateAX(null);
    const tRef = useRefAX(null);
    const show = m => {
      setMsg(m);
      clearTimeout(tRef.current);
      tRef.current = setTimeout(() => setMsg(null), 2400);
    };
    const node = /*#__PURE__*/React.createElement("div", {
      className: "agx-toast" + (msg ? " is-on" : ""),
      role: "status",
      "aria-live": "polite"
    }, msg && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Ic, {
      name: "lucide:bell-ring",
      size: 15
    }), msg));
    return {
      show,
      node
    };
  }
  window.PFAgentsUI = {
    useWaitlistAX,
    useToastAX,
    AgentIcon,
    StatusPill,
    Badge,
    NotifyButton,
    Waiting,
    AgentCardAX,
    AgentCardLive,
    SpotlightAssess,
    SpotlightAva,
    FilterChips,
    HowItWorks,
    RequestCard,
    AgentDetail
  };
})();
