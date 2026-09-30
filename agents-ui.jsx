/* ===========================================================================
   PROfinity — Agents · shared UI (web + mobile)
   Catalogue card, spotlight cards, filter chips, detail sheet/dialog and the
   "how it works" strip. Reads window.PFAgents (agents-data.js). Exposes
   window.PFAgentsUI. Class prefix: agx-. Suffixed -AX to avoid scope clashes.
   =========================================================================== */
(function () {
  const { useState: useStateAX, useEffect: useEffectAX, useRef: useRefAX } = React;
  const DSAX = window.ProfinityDesignSystem_c2b5cc;
  const Ic = ({ name, size = 18, color, className }) => <DSAX.IconifyIcon name={name} size={size} color={color} className={className} />;
  const PFA = window.PFAgents;

  /* ------------------------------------------------------------ waitlist */
  function useWaitlistAX() {
    const [ids, setIds] = useStateAX(() => PFA.readWaitlist());
    useEffectAX(() => {
      const h = (e) => setIds((e.detail && e.detail.ids) || PFA.readWaitlist());
      window.addEventListener("pf:agent-waitlist", h);
      return () => window.removeEventListener("pf:agent-waitlist", h);
    }, []);
    return {
      ids,
      has: (id) => ids.indexOf(id) !== -1,
      toggle: (id) => (ids.indexOf(id) !== -1 ? PFA.leave(id) : PFA.join(id)),
    };
  }

  /* ------------------------------------------------------------ atoms */
  function AgentIcon({ agent, size = 52, radius = 16 }) {
    const t = PFA.TONES[agent.tone] || PFA.TONES.purple;
    return (
      <span className={"agx-ic agx-ic-" + agent.tone} style={{ width: size, height: size, borderRadius: radius, "--ic-bg": t.bg, "--ic-fg": t.fg }} aria-hidden="true">
        <Ic name={agent.icon} size={Math.round(size * 0.46)} />
      </span>
    );
  }

  function StatusPill({ agent, compact }) {
    if (agent.status === "available") {
      return <span className="agx-status is-live"><span className="agx-dot" />{compact ? "Available" : "Available now"}</span>;
    }
    return <span className="agx-status is-soon"><Ic name="lucide:clock" size={13} />{compact || !agent.eta ? "Coming soon" : "Coming " + agent.eta.toLowerCase()}</span>;
  }

  function Badge({ label }) {
    if (!label) return null;
    return <span className="agx-badge"><Ic name="fluent:crown-16-filled" size={12} />{label}</span>;
  }

  function NotifyButton({ agent, wl, size = "md", onJoin }) {
    const on = wl.has(agent.id);
    const [flash, setFlash] = useStateAX(false);
    const click = (e) => {
      e.stopPropagation();
      const was = on;
      wl.toggle(agent.id);
      if (!was) { setFlash(true); setTimeout(() => setFlash(false), 900); if (onJoin) onJoin(agent); }
    };
    return (
      <button type="button" className={"agx-notify agx-notify-" + size + (on ? " is-on" : "") + (flash ? " is-flash" : "")} onClick={click} aria-pressed={on}>
        <Ic name={on ? "lucide:check" : "lucide:bell"} size={size === "sm" ? 15 : 17} />
        {on ? "On the waitlist" : "Notify me"}
      </button>
    );
  }

  function Waiting({ agent, wl }) {
    if (agent.status !== "soon") return null;
    const n = (agent.waiting || 0) + (wl.has(agent.id) ? 1 : 0);
    return <span className="agx-waiting"><Ic name="lucide:users" size={13} />{n.toLocaleString()} waiting</span>;
  }

  /* ------------------------------------------------------------ live (available) card — dark spotlight treatment inside the grid */
  function LiveArt({ agent, mobile }) {
    if (agent.isAva) {
      return (
        <div className="agx-live-art">
          <div className="agx-face agx-face-ava">
            <span className="agx-face-ring r1" /><span className="agx-face-ring r2" />
            <span className="agx-ava-orb agx-ava-orb-lg" aria-hidden="true"><Ic name="lucide:sparkles" size={30} color="#fff" /></span>
          </div>
          <div className="agx-face-chip c1"><Ic name="lucide:list-checks" size={12} />Plan today</div>
          <div className="agx-face-chip c2"><Ic name="lucide:bar-chart-2" size={12} />Review progress</div>
        </div>
      );
    }
    if (agent.id !== "assess-pro") {
      const chips = agent.artChips || [];
      return (
        <div className="agx-live-art">
          <div className="agx-face agx-face-ava">
            <span className="agx-face-ring r1" /><span className="agx-face-ring r2" />
            <span className="agx-ava-orb agx-ava-orb-lg" aria-hidden="true"><Ic name={agent.icon} size={30} color="#fff" /></span>
          </div>
          {chips[0] && <div className="agx-face-chip c1"><Ic name={chips[0][0]} size={12} />{chips[0][1]}</div>}
          {chips[1] && <div className="agx-face-chip c2"><Ic name={chips[1][0]} size={12} />{chips[1][1]}</div>}
        </div>
      );
    }
    return (
      <div className="agx-live-art">
        <div className="agx-face">
          <span className="agx-face-ring r1" /><span className="agx-face-ring r2" />
          <span className="agx-face-line l1" /><span className="agx-face-line l2" /><span className="agx-face-line l3" />
          <span className="agx-face-pt p1" /><span className="agx-face-pt p2" /><span className="agx-face-pt p3" /><span className="agx-face-pt p4" /><span className="agx-face-pt p5" />
          <Ic name="lucide:scan-face" size={56} />
        </div>
        <div className="agx-face-chip c1"><Ic name="lucide:sparkles" size={12} />Symmetry 94%</div>
        <div className="agx-face-chip c2"><Ic name="lucide:trending-up" size={12} />Volume · mid-face</div>
      </div>
    );
  }

  function AgentCardLive({ agent, onOpen, mobile }) {
    const primary = () => (agent.isAva
      ? PFA.askAva("Which Profinity agent should I activate first for my clinic goals?", mobile)
      : (agent.href ? PFA.open(agent, mobile) : onOpen(agent)));
    const secondary = () => onOpen(agent, agent.isAva ? "info" : "demo");
    const detailCta = agent.isAva ? "Learn more" : "Watch demo";
    return (
      <article className={"agx-card agx-live agx-live-" + agent.tone} onClick={() => onOpen(agent)} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(agent); } }} aria-label={agent.name + " — available now"}>
        <div className="agx-spot-glow" aria-hidden="true" />
        <LiveArt agent={agent} mobile={mobile} />
        <div className="agx-live-kicker"><span className="agx-dot" />Available now · {agent.badge}</div>
        <h3 className="agx-live-title">{agent.isAva ? agent.shortName : agent.name}</h3>
        <p className="agx-live-tag">{agent.tagline}</p>
        <ul className="agx-spot-list agx-live-list">
          {agent.bullets.map((b, i) => <li key={i}><Ic name="lucide:check-circle-2" size={15} />{b}</li>)}
        </ul>
        <div className="agx-live-actions" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="agx-primary agx-primary-light agx-primary-sm" onClick={primary}>{agent.cta}<Ic name="lucide:arrow-right" size={15} /></button>
          <button type="button" className="agx-ghost agx-ghost-sm" onClick={secondary}>
            <Ic name={agent.isAva ? "lucide:info" : "lucide:play"} size={14} />{detailCta}
          </button>
        </div>
      </article>
    );
  }

  /* ------------------------------------------------------------ catalogue card */
  function AgentCardAX({ agent, wl, onOpen, mobile }) {
    const live = agent.status === "available";
    if (live) return <AgentCardLive agent={agent} onOpen={onOpen} mobile={mobile} />;
    const primary = () => {
      if (agent.isAva) return PFA.askAva("Which Profinity agent should I activate first for my clinic goals?", mobile);
      onOpen(agent);
    };
    return (
      <article className={"agx-card" + (live ? " is-live" : "")} onClick={() => onOpen(agent)} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(agent); } }}>
        <div className="agx-card-top">
          <AgentIcon agent={agent} size={mobile ? 48 : 52} radius={14} />
          <div className="agx-card-meta">
            <StatusPill agent={agent} compact={mobile} />
          </div>
        </div>
        <div className="agx-card-cat">{agent.category}</div>
        <h3 className="agx-card-title">{agent.name}</h3>
        <p className="agx-card-tag">{agent.tagline}</p>
        <p className="agx-card-desc">{agent.description}</p>
        <div className="agx-card-foot" onClick={(e) => e.stopPropagation()}>
          {live ? (
            <button type="button" className="agx-primary agx-primary-sm" onClick={primary}>
              {agent.cta || "Open"}<Ic name="lucide:arrow-right" size={15} />
            </button>
          ) : (
            <NotifyButton agent={agent} wl={wl} size="sm" />
          )}
          <span className="agx-card-foot-r">
            {live ? <Badge label={agent.badge} /> : <Waiting agent={agent} wl={wl} />}
          </span>
        </div>
      </article>
    );
  }

  /* ------------------------------------------------------------ spotlight cards */
  function SpotlightAssess({ agent, onOpen, mobile }) {
    return (
      <section className="agx-spot agx-spot-assess" aria-label="Assess Pro — available now">
        <div className="agx-spot-glow" aria-hidden="true" />
        <div className="agx-spot-body">
          <div className="agx-spot-kicker"><span className="agx-dot" />Available now · {agent.badge}</div>
          <h2 className="agx-spot-title">{agent.name}</h2>
          <p className="agx-spot-tag">{agent.tagline}</p>
          {!mobile && <p className="agx-spot-desc">{agent.description}</p>}
          <ul className="agx-spot-list">
            {agent.bullets.map((b, i) => <li key={i}><Ic name="lucide:check-circle-2" size={16} />{b}</li>)}
          </ul>
          <div className="agx-spot-actions">
            <button type="button" className="agx-primary agx-primary-light" onClick={() => onOpen(agent)}>
              {agent.cta}<Ic name="lucide:arrow-right" size={16} />
            </button>
            <button type="button" className="agx-ghost" onClick={() => onOpen(agent, "demo")}>
              <Ic name="lucide:play" size={15} />Watch 2-min demo
            </button>
          </div>
        </div>
        <div className="agx-spot-art" aria-hidden="true">
          <div className="agx-face">
            <span className="agx-face-ring r1" /><span className="agx-face-ring r2" />
            <span className="agx-face-line l1" /><span className="agx-face-line l2" /><span className="agx-face-line l3" />
            <span className="agx-face-pt p1" /><span className="agx-face-pt p2" /><span className="agx-face-pt p3" /><span className="agx-face-pt p4" /><span className="agx-face-pt p5" />
            <Ic name="lucide:scan-face" size={mobile ? 64 : 88} />
          </div>
          <div className="agx-face-chip c1"><Ic name="lucide:sparkles" size={12} />Symmetry 94%</div>
          <div className="agx-face-chip c2"><Ic name="lucide:trending-up" size={12} />Volume · mid-face</div>
        </div>
      </section>
    );
  }

  function SpotlightAva({ agent, mobile }) {
    const ask = (p) => PFA.askAva(p, mobile);
    return (
      <section className="agx-spot agx-spot-ava" aria-label="Ava, your coach — available now">
        <div className="agx-spot-body">
          <div className="agx-spot-kicker"><span className="agx-dot" />Live on My Learning</div>
          <div className="agx-ava-row">
            <span className="agx-ava-orb" aria-hidden="true"><Ic name="lucide:sparkles" size={22} color="#fff" /></span>
            <div>
              <h2 className="agx-spot-title">{agent.shortName}</h2>
              <p className="agx-spot-tag">{agent.tagline}</p>
            </div>
          </div>
          {!mobile && <p className="agx-spot-desc">{agent.description}</p>}
          <div className="agx-ava-chips">
            <button type="button" onClick={() => ask("Help me plan today's targets so I make progress on my clinic goal.")}><Ic name="lucide:list-checks" size={13} />Plan today</button>
            <button type="button" onClick={() => ask("Review my progress across the Prosperity Spiral and tell me what to focus on next.")}><Ic name="lucide:bar-chart-2" size={13} />Review progress</button>
            <button type="button" onClick={() => ask("Role-play a consultation with a nervous first-time lip filler patient.")}><Ic name="lucide:messages-square" size={13} />Rehearse a consult</button>
          </div>
          <div className="agx-spot-actions">
            <button type="button" className="agx-primary agx-primary-light" onClick={() => ask("Which Profinity agent should I activate first for my clinic goals?")}>
              {agent.cta}<Ic name="lucide:arrow-right" size={16} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------ filters */
  function FilterChips({ value, onChange, agents }) {
    const cats = PFA.CATEGORIES;
    const countFor = (c) => (c === "All" ? agents.length : agents.filter((a) => a.category === c).length);
    return (
      <div className="agx-filters">
        <div className="agx-chips" role="tablist" aria-label="Filter by role">
          {cats.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={value === c} className={"agx-chip" + (value === c ? " is-on" : "")} onClick={() => onChange(c)}>
              {c}<span className="agx-chip-n">{countFor(c)}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------ how it works */
  const STEPS = [
    { icon: "lucide:mouse-pointer-click", t: "Pick an agent", d: "Start with what costs you most today: missed calls, slow replies or unclear plans." },
    { icon: "lucide:plug-zap", t: "Connect your clinic", d: "Link your diary, treatment menu and socials once. Every agent shares the same setup." },
    { icon: "lucide:sparkles", t: "Ava keeps them aligned", d: "Your coach knows your goal and nudges each agent toward it, then reports back." },
  ];
  function HowItWorks({ mobile }) {
    return (
      <section className="agx-how" aria-label="How agents work">
        <div className="agx-sec-h">
          <span className="agx-eyebrow">How it works</span>
          <h2 className="agx-h2">One clinic setup, every agent.</h2>
        </div>
        <ol className="agx-steps">
          {STEPS.map((s, i) => (
            <li key={i} className="agx-step">
              <span className="agx-step-n">{i + 1}</span>
              <span className="agx-step-ic"><Ic name={s.icon} size={20} /></span>
              <div><h3>{s.t}</h3><p>{s.d}</p></div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  function RequestCard({ mobile }) {
    return (
      <section className="agx-request" aria-label="Suggest an agent">
        <div>
          <h3>Have an agent in mind?</h3>
          <p>Tell Ava what you keep doing by hand. The most-requested ideas move up the roadmap.</p>
        </div>
        <button type="button" className="agx-primary agx-primary-navy" onClick={() => PFA.askAva("I'd like to suggest a new Profinity agent. Here's the task I keep doing by hand: ", mobile)}>
          <Ic name="lucide:lightbulb" size={16} />Suggest an agent
        </button>
      </section>
    );
  }

  /* ------------------------------------------------------------ detail sheet / dialog */
  function AgentDetail({ agent, mode, wl, onClose, mobile }) {
    const boxRef = useRefAX(null);
    useEffectAX(() => {
      if (!agent) return;
      const k = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", k);
      const prev = document.body.style.overflow;
      if (!mobile) document.body.style.overflow = "hidden";
      return () => { window.removeEventListener("keydown", k); if (!mobile) document.body.style.overflow = prev; };
    }, [agent]);
    if (!agent) return null;
    const live = agent.status === "available";
    const t = PFA.TONES[agent.tone] || PFA.TONES.purple;
    return (
      <div className={"agx-scrim" + (mobile ? " is-sheet" : " is-dialog")} onClick={onClose}>
        <div ref={boxRef} className="agx-detail" role="dialog" aria-modal="true" aria-labelledby="agx-detail-title" onClick={(e) => e.stopPropagation()}
          style={{ "--ic-bg": t.bg, "--ic-fg": t.fg }}>
          {mobile && <span className="agx-handle" aria-hidden="true" />}
          <button type="button" className="agx-close" onClick={onClose} aria-label="Close"><Ic name="lucide:x" size={18} /></button>
          <div className="agx-detail-head">
            <AgentIcon agent={agent} size={mobile ? 56 : 64} radius={18} />
            <div className="agx-detail-headtx">
              <div className="agx-card-cat">{agent.category}</div>
              <h2 id="agx-detail-title" className="agx-detail-title">{agent.name}</h2>
              <div className="agx-detail-pills"><StatusPill agent={agent} /><Badge label={agent.badge} /></div>
            </div>
          </div>
          {mode === "demo" && (
            <div className="agx-demo" aria-label="Demo video">
              <div className="agx-demo-ph"><Ic name="lucide:play" size={26} color="#fff" /></div>
              <span>Demo video · 2:04</span>
            </div>
          )}
          <p className="agx-detail-tag">{agent.tagline}</p>
          <p className="agx-detail-desc">{agent.description}</p>
          <h4 className="agx-detail-h4">What it does</h4>
          <ul className="agx-detail-list">
            {agent.bullets.map((b, i) => <li key={i}><Ic name="lucide:check" size={15} />{b}</li>)}
          </ul>
          <dl className="agx-detail-facts">
            <div><dt>Best for</dt><dd>{agent.bestFor}</dd></div>
            <div><dt>Pricing</dt><dd>{agent.price}</dd></div>
            {agent.eta && <div><dt>Expected</dt><dd>{agent.eta}</dd></div>}
          </dl>
          <div className="agx-detail-foot">
            {live ? (
              agent.isAva
                ? <button type="button" className="agx-primary" onClick={() => PFA.askAva("Which Profinity agent should I activate first for my clinic goals?", mobile)}>{agent.cta}<Ic name="lucide:arrow-right" size={16} /></button>
                : <button type="button" className="agx-primary" onClick={() => PFA.open(agent, mobile)}>{agent.cta}<Ic name="lucide:arrow-right" size={16} /></button>
            ) : (
              <>
                <NotifyButton agent={agent} wl={wl} />
                <Waiting agent={agent} wl={wl} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------ toast */
  function useToastAX() {
    const [msg, setMsg] = useStateAX(null);
    const tRef = useRefAX(null);
    const show = (m) => { setMsg(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setMsg(null), 2400); };
    const node = <div className={"agx-toast" + (msg ? " is-on" : "")} role="status" aria-live="polite">{msg && <><Ic name="lucide:bell-ring" size={15} />{msg}</>}</div>;
    return { show, node };
  }

  window.PFAgentsUI = { useWaitlistAX, useToastAX, AgentIcon, StatusPill, Badge, NotifyButton, Waiting, AgentCardAX, AgentCardLive, SpotlightAssess, SpotlightAva, FilterChips, HowItWorks, RequestCard, AgentDetail };
})();
