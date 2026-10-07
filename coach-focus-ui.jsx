/* ===========================================================================
   PROfinity — AI Coach focus UI (shared by Profile mobile + web)
   Chrome-agnostic content blocks rendered inside each page's own sheets /
   modals (mobile .pm-wiz-* bottom sheets, web .pw-modal-* dialogs). Styles
   in coach-focus.css (cf- prefix). Logic + data in coach-focus.js
   (window.PFCoachFocus). Exposes window.PFCoachUI.
   =========================================================================== */
(function () {
  const { useState: useStateCF, useEffect: useEffectCF, useRef: useRefCF } = React;
  const DSCF = window.ProfinityDesignSystem_c2b5cc;
  const CF = window.PFCoachFocus;
  function Icon(p) { return <DSCF.IconifyIcon {...p} />; }
  function go(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
  function money(n) { return "£" + Number(n || 0).toLocaleString("en-GB"); }

  /* Re-render when a free resource is opened or a course bought elsewhere. */
  function useCoachRefresh() {
    const [, setN] = useStateCF(0);
    useEffectCF(() => {
      const bump = () => setN((n) => n + 1);
      window.addEventListener("pf:coach-focus", bump);
      window.addEventListener("storage", bump);
      window.addEventListener("focus", bump);
      window.addEventListener("pf-sp-change", bump);
      return () => {
        window.removeEventListener("pf:coach-focus", bump);
        window.removeEventListener("storage", bump);
        window.removeEventListener("focus", bump);
        window.removeEventListener("pf-sp-change", bump);
      };
    }, []);
  }

  /* ------------------------------------------------- progression track -- */
  /* After the door: where Katie tracks her growth. Clinical Skills → the 8D
     Lip Design Success Path (Basic: locked preview of the Free Starter
     Path); other focuses → "coming soon", the door course is the track. */
  function CFTrack({ focus, web, tier }) {
    useCoachRefresh();
    const t = CF.track ? CF.track(focus, tier) : null;
    if (!t) return null;
    if (t.comingSoon) return (
      <div className="cf-track soon">
        <span className="cf-track-ic" aria-hidden="true"><Icon name="lucide:route" size={18} color="var(--gray-500)" /></span>
        <span className="cf-track-copy">
          <span className="cf-track-eyebrow">Your progression track</span>
          <span className="cf-track-ti">{t.domain} Success Path — coming soon</span>
          <span className="cf-track-su">For now your door course is your track: Ava follows it in Today's Targets and tells you when the {t.domain} path opens.</span>
        </span>
      </div>);
    const p = t.path, pr = t.progress;
    const pct = pr && pr.total ? Math.round(pr.done / pr.total * 100) : 0;
    return (
      <button type="button" className={"cf-track" + (t.locked ? " locked" : "")}
        onClick={() => go(CF.pathHubUrl(p, web, t.locked ? "sp=starter&tab=starter" : ""))}
        aria-label={(t.locked ? "Preview the " + p.starterTitle : "Open the " + p.title + " Success Path")}>
        <span className="cf-track-ic" aria-hidden="true">
          {pr ? <span className="cf-track-ring" style={{ "--pct": pct }}><b>{pct}%</b></span> : <Icon name={t.locked ? "lucide:lock" : "lucide:route"} size={18} color="#fff" />}
        </span>
        <span className="cf-track-copy">
          <span className="cf-track-eyebrow">Your progression track{t.locked ? " · Confidence" : ""}</span>
          <span className="cf-track-ti">{t.locked ? p.starterTitle : p.title + " Success Path"}</span>
          <span className="cf-track-su">{t.locked ?
            "Preview the " + p.starterSkills + " Level 1 skills every lip injector needs — tick them and earn points with Confidence." :
            pr ? "Level " + pr.level + " · " + pr.levelTitle + " · " + pr.done + " of " + pr.total + " skills" + (pr.ready ? " · " + pr.ready + " ready to tick" : "") :
            p.levels + " levels · " + p.skills + " skills you tick when they're true in your clinic"}</span>
        </span>
        <span className="cf-track-cta">{t.locked ? "Preview" : pr && pr.done ? "Continue" : "Start"}</span>
      </button>);
  }

  /* ---------------------------------------------------------------- door -- */
  /* "Ava puts Katie at the door": one course (Basic can buy it directly) +
     one free resource to open today, so nobody leaves empty-handed. */
  /* quiet (Profile cards, 2026-10-07): no intro line and no Basic-pricing
     note on the card — that copy lives in the card's ⓘ popover instead. */
  function CFDoor({ focus, web, tier, heading = true, showTrack = true, quiet = false }) {
    useCoachRefresh();
    if (!focus) return null;
    const course = focus.door.course, free = focus.door.free;
    const dom = CF.DOMAINS[focus.domain];
    const paid = CF.isPaid(tier);
    const includedLater = !course.owned && course.includedFrom && (tier === "free" || tier === "confidence");
    return (
      <div className="cf-door">
        {heading &&
        <div className="cf-door-hd">
            <span className="cf-kicker"><Icon name="lucide:door-open" size={14} color="var(--brand-gold)" />Your door</span>
            <span className="cf-door-count">{showTrack ? 3 : 2} ways in</span>
          </div>}
        {heading && !quiet && <p className="cf-door-sub">{showTrack ? "Three" : "Two"} ways to start on <b>{focus.domain}</b> today — pick whichever suits you.</p>}
        <ol className="cf-door-list">
        <li className="cf-door-item"><span className="cf-door-num" aria-label="Entry 1 of 3">1</span>
        <div className="cf-door-course" style={{ "--cf-dom": dom.color, "--cf-dom-soft": dom.soft, "--cf-dom-text": dom.text }}>
          <button type="button" className="cf-door-main" onClick={() => go(CF.courseUrl(course, web))}
            aria-label={"View course: " + course.title}>
            <span className="cf-door-thumb" style={{ backgroundImage: "url(" + course.image + ")" }} aria-hidden="true" />
            <span className="cf-door-copy">
              <span className="cf-door-eyebrow">{course.owned ? (course.included ? "Included in your membership" : "In your library") : "Recommended course · " + course.lessons + " lessons"}</span>
              <span className="cf-door-ti">{course.title}</span>
              <span className="cf-door-bl">{course.blurb}</span>
            </span>
          </button>
          <div className="cf-door-actions">
            {course.owned ?
            <button type="button" className="cf-btn cf-btn-primary" onClick={() => go(CF.courseUrl(course, web))}>
                Open course<Icon name="lucide:arrow-up-right" size={16} color="#fff" />
              </button> :
            <>
                <button type="button" className="cf-btn cf-btn-ghost" onClick={() => go(CF.courseUrl(course, web))}>View course</button>
                <button type="button" className="cf-btn cf-btn-gold" onClick={() => go(CF.checkoutUrl(course, web))}
                  aria-label={"Buy " + course.title + " for " + money(course.price)}>Buy {money(course.price)}</button>
              </>}
          </div>
          {includedLater && <p className="cf-door-note"><Icon name="lucide:sparkles" size={12} color="var(--ai-purple)" />Included free from {course.includedFrom === "mastery" ? "Mastery" : "Confidence"} membership</p>}
          {!paid && !course.owned && !includedLater && !quiet && <p className="cf-door-note"><Icon name="lucide:info" size={12} color="var(--gray-500)" />You can buy any course on Basic — no membership needed.</p>}
        </div>
        </li>

        <li className="cf-door-item"><span className="cf-door-num" aria-label="Entry 2 of 3">2</span>
        <div className={"cf-free" + (free.opened ? " done" : "")}>
          <span className="cf-free-ic" aria-hidden="true"><Icon name={free.opened ? "lucide:file-check-2" : "lucide:file-down"} size={18} color="var(--brand-navy)" /></span>
          <span className="cf-free-copy">
            <span className="cf-free-eyebrow">Start free today</span>
            <span className="cf-free-ti">{free.title}</span>
            <span className="cf-free-cap">PDF guide · {free.pages} pages</span>
          </span>
          <button type="button" className={"cf-btn cf-btn-free" + (free.opened ? " is-done" : "")} onClick={() => CF.openFree(free, web)}>
            {free.opened ? <><Icon name="lucide:check" size={13} color="currentColor" />Saved</> : <><Icon name="lucide:download" size={14} color="#fff" />Get it</>}
          </button>
        </div>
        </li>
        {showTrack && <li className="cf-door-item"><span className="cf-door-num" aria-label="Entry 3 of 3">3</span><CFTrack focus={focus} web={web} tier={tier} /></li>}
        </ol>
      </div>);
  }

  /* --------------------------------------------------------- focus chip -- */
  function CFFocusChip({ domain, size }) {
    const dom = CF.DOMAINS[domain];
    return (
      <span className={"cf-focus-chip" + (size === "lg" ? " lg" : size === "hero" ? " hero" : "")} style={{ "--cf-dom": dom.color, "--cf-dom-soft": dom.soft, "--cf-dom-text": dom.text }}>
        <span className="cf-focus-chip-ic"><Icon name={dom.icon} size={size === "lg" || size === "hero" ? 20 : 14} color="#fff" /></span>{domain}
      </span>);
  }

  /* ------------------------------------------------------ upgrade tease -- */
  /* Basic: show exactly what she'd get next, built around HER focus, then a
     soft CTA. Never a dead end — the door above is always usable. */
  function CFUpgradeTease({ focus, web, onPreview, title, compact }) {
    const items = [
      { key: focus ? focus.domain : "Clinical Skills", icon: "lucide:gauge", ti: (focus ? focus.domain : "Pillar") + " deep-dive", su: "Score your focus and confirm Ava's call" },
      { key: "dreamVision", icon: "lucide:telescope", ti: "Dream & Vision + Personal Goals", su: "Every recommendation pointed at your dream clinic" },
      { key: "ava", icon: "lucide:message-circle", ti: "Coach with Ava every day", su: "A weekly plan, check-ins and role-play" },
      { key: "spiral", icon: "lucide:radar", ti: "Your full Prosperity Spiral", su: "All four pillars scored and tracked" }
    ];
    return (
      <div className={"cf-tease" + (compact ? " compact" : "")}>
        <div className="cf-tease-hd">
          <span className="cf-tease-badge"><Icon name="lucide:crown" size={13} color="#8A5303" />Confidence</span>
          <h4>{title || "Want a sharper plan?"}</h4>
        </div>
        {!compact &&
        <ul className="cf-tease-list">
            {items.map((it) =>
          <li key={it.ti}>
                <button type="button" className="cf-tease-row" onClick={() => onPreview && it.key !== "ava" && it.key !== "spiral" ? onPreview(it.key) : go(CF.upgradeUrl(web))}>
                  <span className="cf-tease-ic"><Icon name={it.icon} size={16} color="var(--brand-navy)" /></span>
                  <span className="cf-tease-copy"><span className="ti">{it.ti}</span><span className="su">{it.su}</span></span>
                  <Icon name="lucide:lock" size={14} color="var(--gray-400)" />
                </button>
              </li>)}
          </ul>}
        <button type="button" className="cf-btn cf-btn-upgrade" onClick={() => go(CF.upgradeUrl(web))}>
          Unlock with Confidence · {money(CF.CONFIDENCE_PRICE)}/mo
        </button>
        <p className="cf-tease-foot">30-day free trial · cancel anytime</p>
      </div>);
  }

  /* -------------------------------------------------------- focus reveal -- */
  /* Result screen after "Where you are now" (and the body of the focus
     sheet opened from the hub banner / goal card). */
  function CFFocusReveal({ focus, web, tier, assessState, onSharpen, onPreview, onRetake, onDone, onAskAva }) {
    if (!focus) return null;
    const paid = CF.isPaid(tier);
    const focusDone = assessState && assessState[focus.domain] && assessState[focus.domain].status === "completed";
    const dom = CF.DOMAINS[focus.domain];
    return (
      <div className="cf-reveal" style={{ "--cf-dom": dom.color, "--cf-dom-soft": dom.soft, "--cf-dom-text": dom.text }}>
        <div className="cf-reveal-hero">
          <span className="cf-reveal-glow" aria-hidden="true" />
          <span className="cf-reveal-ava" aria-hidden="true"><Icon name="lucide:sparkles" size={20} color="#fff" /></span>
          <span className="cf-kicker">Ava found your focus</span>
          <CFFocusChip domain={focus.domain} size="lg" />
        </div>

        <CFDoor focus={focus} web={web} tier={tier} />

        {focus.confirm &&
        <div className="cf-confirm">
            <span className="cf-confirm-hd"><Icon name="lucide:message-circle-question" size={18} color="var(--ai-purple)" /><span className="cf-kicker">Ava has a question</span></span>
            <p>Your <b>{focus.confirm.alt}</b> deep-dive scored {focus.confirm.altScore} — lower than {focus.domain} ({focus.confirm.focusScore}). Is {focus.confirm.alt.toLowerCase()} actually what's holding you back?</p>
            <button type="button" className="cf-btn cf-btn-ghost" onClick={() => onAskAva && onAskAva("My " + focus.confirm.alt + " score is lower than my " + focus.domain + " focus. Should I switch my focus?")}>Ask Ava</button>
          </div>}

        {/* milestone card (restyled 2026-10-07): warm gold card, flag badge,
            reframe as a pull-quote underneath */}
        <div className="cf-milestone-card">
          <span className="cf-milestone-wm" aria-hidden="true"><Icon name="lucide:flag" size={96} color="currentColor" /></span>
          <div className="cf-milestone">
            <span className="cf-milestone-ic" aria-hidden="true"><Icon name="lucide:flag" size={18} color="#fff" /></span>
            <span>
              <span className="cf-kicker">Your next 90 days</span>
              <span className="cf-milestone-ti">{focus.milestone}</span>
            </span>
          </div>
          <p className="cf-reframe">{focus.reframe}</p>
        </div>

        {paid ?
        <div className="cf-next">
            {!focusDone && onSharpen &&
          <button type="button" className="cf-act cf-act-primary" onClick={() => onSharpen(focus.domain)}>
                <span className="cf-act-ic"><Icon name="lucide:gauge" size={18} color="#fff" /></span>
                <span className="cf-act-copy"><span className="ti">Sharpen it</span><span className="su">Take the {focus.domain} deep-dive · 3 mins</span></span>
                <Icon name="lucide:chevron-right" size={18} color="rgba(255,255,255,.7)" />
              </button>}
            <button type="button" className="cf-act cf-act-ai" onClick={() => onAskAva && onAskAva(CF.avaPrompt(focus))}>
              <span className="cf-act-ic"><Icon name="lucide:sparkles" size={18} color="#fff" /></span>
              <span className="cf-act-copy"><span className="ti">Ask Ava to plan my week</span><span className="su">Seven days of steps toward this milestone</span></span>
              <Icon name="lucide:chevron-right" size={18} color="var(--ai-purple)" />
            </button>
          </div> :
        <CFUpgradeTease focus={focus} web={web} onPreview={onPreview} />}

        <div className="cf-reveal-foot">
          <span className="cf-checkin"><Icon name="lucide:calendar-clock" size={14} color="currentColor" />{CF.checkInLabel(focus)}</span>
          {onRetake && <button type="button" className="cf-link" onClick={onRetake}><Icon name="lucide:pencil-line" size={13} color="currentColor" />Update my answers</button>}
        </div>
        {onDone && <button type="button" className="cf-btn cf-btn-ghost cf-btn-block cf-reveal-done" onClick={onDone}><Icon name="lucide:arrow-left" size={16} color="currentColor" />Back to Get to know you</button>}
      </div>);
  }

  /* ------------------------------------------------------ locked preview -- */
  /* Basic taps a locked questionnaire: first question visible, the rest
     blurred, what it unlocks (personalised to her focus) and the upgrade. */
  function CFLockedPreview({ assessKey, def, focus, web, onClose }) {
    const meta = CF.META[assessKey] || { unlocks: [] };
    const qs = def.questions;
    const first = qs[0];
    const rest = qs.slice(1, 3);
    const more = Math.max(0, qs.length - 3);
    const recommended = focus && focus.domain === assessKey;
    return (
      <div className="cf-preview">
        <div className="cf-preview-hd">
          <span className="cf-preview-ic"><Icon name={meta.icon || "lucide:compass"} size={20} color="var(--brand-navy)" /></span>
          <span className="cf-preview-copy">
            <span className="cf-tease-badge"><Icon name="lucide:lock" size={12} color="#8A5303" />Unlocks with Confidence</span>
            <span className="cf-preview-ti">{def.label}</span>
            <span className="cf-preview-su">{qs.length} questions · ~{def.timeMin} mins</span>
          </span>
        </div>
        {recommended &&
        <div className="cf-preview-ava">
            <Icon name="lucide:sparkles" size={15} color="var(--ai-purple)" />
            <p><b>Ava recommends this one next.</b> It scores your {focus.domain} focus so she can confirm it's really what's holding you back.</p>
          </div>}

        <div className="cf-preview-q">
          <span className="cf-preview-qn">Question 1 of {qs.length}</span>
          <p className="cf-preview-qt">{first.q}</p>
          {first.opts ?
          <div className="cf-preview-opts" aria-hidden="true">
              {first.opts.slice(0, 4).map((o, i) => <span key={i} className="cf-preview-opt"><b>{"ABCD"[i]}</b>{o}</span>)}
            </div> :
          <span className="cf-preview-text" aria-hidden="true">Your answer, in your words…</span>}
        </div>
        <div className="cf-preview-blur" aria-hidden="true">
          {rest.map((q, i) => <p key={i}><span>Q{i + 2}</span>{q.q}</p>)}
          {more > 0 && <p className="more">+ {more} more question{more === 1 ? "" : "s"}</p>}
          <span className="cf-preview-lock"><Icon name="lucide:lock" size={18} color="var(--brand-navy)" /></span>
        </div>

        <div className="cf-preview-unlocks">
          <span className="cf-kicker">What you'll get</span>
          <ul>{meta.unlocks.map((u) => <li key={u}><Icon name="lucide:check" size={14} color="#1E7A5C" />{u}</li>)}</ul>
        </div>
        <button type="button" className="cf-btn cf-btn-upgrade cf-btn-block" onClick={() => go(CF.upgradeUrl(web))}>
          Unlock with Confidence · {money(CF.CONFIDENCE_PRICE)}/mo
        </button>
        <p className="cf-tease-foot">30-day free trial · cancel anytime</p>
        {onClose && <button type="button" className="cf-link cf-preview-later" onClick={onClose}>Not now</button>}
      </div>);
  }

  /* --------------------------------------------------------- hub banner -- */
  function CFHubBanner({ focus, onOpenFocus, onStart }) {
    if (!focus) return (
      <button type="button" className="cf-hub-banner start" onClick={onStart}>
        <span className="cf-hub-banner-ic"><Icon name="lucide:sparkles" size={18} color="#fff" /></span>
        <span className="cf-hub-banner-copy">
          <span className="ti">Start here — Ava finds your focus</span>
          <span className="su">Answer "Where you are now" (2 mins, free) and Ava shows you the one place to start.</span>
        </span>
        <Icon name="lucide:chevron-right" size={18} color="var(--brand-navy)" />
      </button>);
    const dom = CF.DOMAINS[focus.domain];
    return (
      <button type="button" className="cf-hub-banner" onClick={onOpenFocus} style={{ "--cf-dom": dom.color, "--cf-dom-soft": dom.soft }}>
        <span className="cf-hub-banner-ic" style={{ background: dom.color }}><Icon name={dom.icon} size={18} color="#fff" /></span>
        <span className="cf-hub-banner-copy">
          <span className="ti">Your coach focus: {focus.domain}</span>
          <span className="su">{focus.milestone}</span>
        </span>
        <span className="cf-hub-banner-cta">See your door</span>
      </button>);
  }

  /* -------------------------------------------------- Basic hub strip --- */
  function CFBasicStrip({ web }) {
    return (
      <div className="cf-basic-strip">
        <Icon name="lucide:info" size={16} color="#8A5303" />
        <p>You're on <b>Basic</b>: <b>Where you are now</b> is free and finds your focus. <b>Confidence</b> unlocks the other 6 questionnaires and full coaching with Ava.</p>
        <button type="button" className="cf-link" onClick={() => go(CF.upgradeUrl(web))}>See plans</button>
      </div>);
  }

  /* Demo-only tier preview (design review): sets the same key the
     Membership pages write and reloads so every card re-reads it. */
  function CFTierSwitch() {
    const cur = CF.tier();
    const opts = [["free", "Basic"], ["confidence", "Confidence"], ["mastery", "Mastery"]];
    return (
      <div className="cf-tier-switch" role="group" aria-label="Preview as membership tier (prototype only)">
        <span>Preview as</span>
        {opts.map(([k, l]) =>
        <button key={k} type="button" className={cur === k || (k === "mastery" && (cur === "freedom" || cur === "inner")) ? "on" : ""}
          aria-pressed={cur === k} onClick={() => { CF.setPreviewTier(k); window.location.reload(); }}>{l}</button>)}
      </div>);
  }

  /* -------------------------------------------- text question (Personal) - */
  function CFTextAnswer({ id, value, onChange }) {
    const ref = useRefCF(null);
    useEffectCF(() => {
      const el = ref.current; if (!el) return;
      el.style.height = "auto"; el.style.height = Math.max(120, el.scrollHeight) + "px";
    }, [value]);
    return (
      <textarea id={id} ref={ref} className="cf-text-answer" rows={4} value={value || ""}
        placeholder="Write as much or as little as you like…" onChange={(e) => onChange(e.target.value)} />);
  }

  function CFPersonalGoalsDone({ answers, onDone, onAskAva, paid }) {
    const n = (answers || []).filter((a) => a && String(a).trim()).length;
    return (
      <div className="cf-reveal cf-pg-done">
        <div className="cf-reveal-hero">
          <span className="cf-reveal-ava" aria-hidden="true"><Icon name="lucide:heart-handshake" size={20} color="#fff" /></span>
          <span className="cf-kicker">Saved for Ava</span>
          <h3>Thank you for sharing your why</h3>
          <p className="cf-reveal-why">You answered {n} of 5. Ava will use your words in your plan and check-ins — you can edit them any time from Get to know you.</p>
        </div>
        {paid && onAskAva && <button type="button" className="cf-btn cf-btn-ai cf-btn-block" onClick={() => onAskAva("Here's why I do this work. Use my personal goals to shape this week's plan.")}><Icon name="lucide:sparkles" size={16} color="var(--ai-purple)" />Ask Ava to use these in my plan</button>}
        <button type="button" className="cf-btn cf-btn-navy cf-btn-block cf-reveal-done" onClick={onDone}>Back to Get to know you</button>
      </div>);
  }

  /* --------------------------------------------- Basic locked spiral --- */
  function CFLockedSpiral({ web, focus }) {
    return (
      <div className="cf-locked-spiral">
        <div className="cf-locked-spiral-grid" aria-hidden="true">
          {CF.PILLARS.map((p) =>
          <span key={p} className={"cf-ls-tile" + (focus && focus.domain === p ? " focus" : "")}>
              <span className="cf-ls-ring"><span>?</span></span>
              <span className="cf-ls-name">{p}</span>
              {focus && focus.domain === p && <span className="cf-ls-chip">Your focus</span>}
            </span>)}
        </div>
        <div className="cf-locked-spiral-veil">
          <span className="cf-tease-badge"><Icon name="lucide:lock" size={12} color="#8A5303" />Confidence</span>
          <p><b>See all four pillars scored.</b> Take the deep-dives and Ava tracks your whole Spiral — not just your focus.</p>
          <button type="button" className="cf-btn cf-btn-upgrade" onClick={() => go(CF.upgradeUrl(web))}>Unlock your Spiral</button>
        </div>
      </div>);
  }

  window.PFCoachUI = { CFDoor, CFTrack, CFFocusChip, CFUpgradeTease, CFFocusReveal, CFLockedPreview, CFHubBanner, CFBasicStrip, CFTierSwitch, CFTextAnswer, CFPersonalGoalsDone, CFLockedSpiral };
})();
