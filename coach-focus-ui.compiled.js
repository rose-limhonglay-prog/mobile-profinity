/* ===========================================================================
   PROfinity — AI Coach focus UI (shared by Profile mobile + web)
   Chrome-agnostic content blocks rendered inside each page's own sheets /
   modals (mobile .pm-wiz-* bottom sheets, web .pw-modal-* dialogs). Styles
   in coach-focus.css (cf- prefix). Logic + data in coach-focus.js
   (window.PFCoachFocus). Exposes window.PFCoachUI.
   =========================================================================== */
(function () {
  const {
    useState: useStateCF,
    useEffect: useEffectCF,
    useRef: useRefCF
  } = React;
  const DSCF = window.ProfinityDesignSystem_c2b5cc;
  const CF = window.PFCoachFocus;
  function Icon(p) {
    return /*#__PURE__*/React.createElement(DSCF.IconifyIcon, p);
  }
  function go(url) {
    (window.pfGo || function (u) {
      window.location.href = u;
    })(url);
  }
  function money(n) {
    return "£" + Number(n || 0).toLocaleString("en-GB");
  }

  /* Re-render when a free resource is opened or a course bought elsewhere. */
  function useCoachRefresh() {
    const [, setN] = useStateCF(0);
    useEffectCF(() => {
      const bump = () => setN(n => n + 1);
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
  function CFTrack({
    focus,
    web,
    tier
  }) {
    useCoachRefresh();
    const t = CF.track ? CF.track(focus, tier) : null;
    if (!t) return null;
    if (t.comingSoon) return /*#__PURE__*/React.createElement("div", {
      className: "cf-track soon"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-track-ic",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:route",
      size: 18,
      color: "var(--gray-500)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-track-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-track-eyebrow"
    }, "Your progression track"), /*#__PURE__*/React.createElement("span", {
      className: "cf-track-ti"
    }, t.domain, " Success Path — coming soon"), /*#__PURE__*/React.createElement("span", {
      className: "cf-track-su"
    }, "For now your door course is your track: Ava follows it in Today's Targets and tells you when the ", t.domain, " path opens.")));
    const p = t.path,
      pr = t.progress;
    const pct = pr && pr.total ? Math.round(pr.done / pr.total * 100) : 0;
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-track" + (t.locked ? " locked" : ""),
      onClick: () => go(CF.pathHubUrl(p, web, t.locked ? "sp=starter&tab=starter" : "")),
      "aria-label": t.locked ? "Preview the " + p.starterTitle : "Open the " + p.title + " Success Path"
    }, p.image ? /*#__PURE__*/React.createElement("span", {
      className: "cf-track-ic cf-track-thumb" + (t.locked ? " locked" : ""),
      style: {
        backgroundImage: "url(" + p.image + ")"
      },
      "aria-hidden": "true"
    }, t.locked && /*#__PURE__*/React.createElement("span", {
      className: "cf-track-thumb-lock"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:lock",
      size: 14,
      color: "#fff"
    }))) : /*#__PURE__*/React.createElement("span", {
      className: "cf-track-ic",
      "aria-hidden": "true"
    }, pr ? /*#__PURE__*/React.createElement("span", {
      className: "cf-track-ring",
      style: {
        "--pct": pct
      }
    }, /*#__PURE__*/React.createElement("b", null, pct, "%")) : /*#__PURE__*/React.createElement(Icon, {
      name: t.locked ? "lucide:lock" : "lucide:route",
      size: 18,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-track-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-track-eyebrow"
    }, "Your progression track", t.locked ? " · Confidence" : ""), /*#__PURE__*/React.createElement("span", {
      className: "cf-track-ti"
    }, t.locked ? p.starterTitle : p.title + " Success Path"), /*#__PURE__*/React.createElement("span", {
      className: "cf-track-su"
    }, t.locked ? "Preview the " + p.starterSkills + " Level 1 skills every lip injector needs — tick them and earn points with Confidence." : pr ? "Level " + pr.level + " · " + pr.levelTitle + " · " + pr.done + " of " + pr.total + " skills" + (pr.ready ? " · " + pr.ready + " ready to tick" : "") : p.levels + " levels · " + p.skills + " skills you tick when they're true in your clinic")), /*#__PURE__*/React.createElement("span", {
      className: "cf-track-cta"
    }, t.locked ? "Preview" : pr && pr.done ? "Continue" : "Start"));
  }

  /* ---------------------------------------------------------------- door -- */
  /* "Ava puts Katie at the door": one course (Basic can buy it directly) +
     one free resource to open today, so nobody leaves empty-handed. */
  /* quiet (Profile cards, 2026-10-07): no intro line and no Basic-pricing
     note on the card — that copy lives in the card's ⓘ popover instead. */
  function CFDoor({
    focus,
    web,
    tier,
    heading = true,
    showTrack = true,
    quiet = false
  }) {
    useCoachRefresh();
    if (!focus) return null;
    const course = focus.door.course,
      free = focus.door.free;
    const dom = CF.DOMAINS[focus.domain];
    const paid = CF.isPaid(tier);
    const includedLater = !course.owned && course.includedFrom && (tier === "free" || tier === "confidence");
    return /*#__PURE__*/React.createElement("div", {
      className: "cf-door"
    }, heading && /*#__PURE__*/React.createElement("div", {
      className: "cf-door-hd"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-kicker"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:door-open",
      size: 14,
      color: "var(--brand-gold)"
    }), "Your door"), /*#__PURE__*/React.createElement("span", {
      className: "cf-door-count"
    }, showTrack ? 3 : 2, " ways in")), heading && !quiet && /*#__PURE__*/React.createElement("p", {
      className: "cf-door-sub"
    }, showTrack ? "Three" : "Two", " ways to start on ", /*#__PURE__*/React.createElement("b", null, focus.domain), " today — pick whichever suits you."), /*#__PURE__*/React.createElement("ol", {
      className: "cf-door-list"
    }, /*#__PURE__*/React.createElement("li", {
      className: "cf-door-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cf-door-course",
      style: {
        "--cf-dom": dom.color,
        "--cf-dom-soft": dom.soft,
        "--cf-dom-text": dom.text
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-door-main",
      onClick: () => go(CF.courseUrl(course, web)),
      "aria-label": "View course: " + course.title
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-door-thumb",
      style: {
        backgroundImage: "url(" + course.image + ")"
      },
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "cf-door-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-door-eyebrow"
    }, course.owned ? course.included ? "Included in your membership" : "In your library" : "Recommended course · " + course.lessons + " lessons"), /*#__PURE__*/React.createElement("span", {
      className: "cf-door-ti"
    }, course.title), /*#__PURE__*/React.createElement("span", {
      className: "cf-door-bl"
    }, course.blurb))), /*#__PURE__*/React.createElement("div", {
      className: "cf-door-actions"
    }, course.owned ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-primary",
      onClick: () => go(CF.courseUrl(course, web))
    }, "Open course", /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:arrow-up-right",
      size: 16,
      color: "#fff"
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-ghost",
      onClick: () => go(CF.courseUrl(course, web))
    }, "View course"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-gold",
      onClick: () => go(CF.checkoutUrl(course, web)),
      "aria-label": "Buy " + course.title + " for " + money(course.price)
    }, "Buy ", money(course.price)))), includedLater && /*#__PURE__*/React.createElement("p", {
      className: "cf-door-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:sparkles",
      size: 12,
      color: "var(--ai-purple)"
    }), "Included free from ", course.includedFrom === "mastery" ? "Mastery" : "Confidence", " membership"), !paid && !course.owned && !includedLater && !quiet && /*#__PURE__*/React.createElement("p", {
      className: "cf-door-note"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:info",
      size: 12,
      color: "var(--gray-500)"
    }), "You can buy any course on Basic — no membership needed."))), /*#__PURE__*/React.createElement("li", {
      className: "cf-door-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cf-free" + (free.opened ? " done" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-free-ic",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: free.opened ? "lucide:file-check-2" : "lucide:file-down",
      size: 18,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-free-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-free-eyebrow"
    }, "Start free today"), /*#__PURE__*/React.createElement("span", {
      className: "cf-free-ti"
    }, free.title), /*#__PURE__*/React.createElement("span", {
      className: "cf-free-cap"
    }, "PDF guide · ", free.pages, " pages")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-free" + (free.opened ? " is-done" : ""),
      onClick: () => CF.openFree(free, web)
    }, free.opened ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:check",
      size: 13,
      color: "currentColor"
    }), "Saved") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:download",
      size: 14,
      color: "#fff"
    }), "Get it")))), showTrack && /*#__PURE__*/React.createElement("li", {
      className: "cf-door-item"
    }, /*#__PURE__*/React.createElement(CFTrack, {
      focus: focus,
      web: web,
      tier: tier
    }))));
  }

  /* --------------------------------------------------------- focus chip -- */
  function CFFocusChip({
    domain,
    size
  }) {
    const dom = CF.DOMAINS[domain];
    return /*#__PURE__*/React.createElement("span", {
      className: "cf-focus-chip" + (size === "lg" ? " lg" : size === "hero" ? " hero" : ""),
      style: {
        "--cf-dom": dom.color,
        "--cf-dom-soft": dom.soft,
        "--cf-dom-text": dom.text
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-focus-chip-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: dom.icon,
      size: size === "lg" || size === "hero" ? 20 : 14,
      color: "#fff"
    })), domain);
  }

  /* ------------------------------------------------------ upgrade tease -- */
  /* Basic: show exactly what she'd get next, built around HER focus, then a
     soft CTA. Never a dead end — the door above is always usable. */
  function CFUpgradeTease({
    focus,
    web,
    onPreview,
    title,
    compact
  }) {
    const items = [{
      key: focus ? focus.domain : "Clinical Skills",
      icon: "lucide:gauge",
      ti: (focus ? focus.domain : "Pillar") + " deep-dive",
      su: "Score your focus and confirm Ava's call"
    }, {
      key: "dreamVision",
      icon: "lucide:telescope",
      ti: "Dream & Vision + Personal Goals",
      su: "Every recommendation pointed at your dream clinic"
    }, {
      key: "ava",
      icon: "lucide:message-circle",
      ti: "Coach with Ava every day",
      su: "A weekly plan, check-ins and role-play"
    }, {
      key: "spiral",
      icon: "lucide:radar",
      ti: "Your full Prosperity Spiral",
      su: "All four pillars scored and tracked"
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "cf-tease" + (compact ? " compact" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "cf-tease-hd"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-tease-badge"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:crown",
      size: 13,
      color: "#8A5303"
    }), "Confidence"), /*#__PURE__*/React.createElement("h4", null, title || "Want a sharper plan?")), !compact && /*#__PURE__*/React.createElement("ul", {
      className: "cf-tease-list"
    }, items.map(it => /*#__PURE__*/React.createElement("li", {
      key: it.ti
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-tease-row",
      onClick: () => onPreview && it.key !== "ava" && it.key !== "spiral" ? onPreview(it.key) : go(CF.upgradeUrl(web))
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-tease-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 16,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-tease-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ti"
    }, it.ti), /*#__PURE__*/React.createElement("span", {
      className: "su"
    }, it.su)), /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:lock",
      size: 14,
      color: "var(--gray-400)"
    }))))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-upgrade",
      onClick: () => go(CF.upgradeUrl(web))
    }, "Unlock with Confidence · ", money(CF.CONFIDENCE_PRICE), "/mo"), /*#__PURE__*/React.createElement("p", {
      className: "cf-tease-foot"
    }, "30-day free trial · cancel anytime"));
  }

  /* -------------------------------------------------------- focus reveal -- */
  /* Result screen after "Where you are now" (and the body of the focus
     sheet opened from the hub banner / goal card). */
  function CFFocusReveal({
    focus,
    web,
    tier,
    assessState,
    onSharpen,
    onPreview,
    onRetake,
    onDone,
    onAskAva
  }) {
    if (!focus) return null;
    const paid = CF.isPaid(tier);
    const focusDone = assessState && assessState[focus.domain] && assessState[focus.domain].status === "completed";
    const dom = CF.DOMAINS[focus.domain];
    return /*#__PURE__*/React.createElement("div", {
      className: "cf-reveal",
      style: {
        "--cf-dom": dom.color,
        "--cf-dom-soft": dom.soft,
        "--cf-dom-text": dom.text
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cf-reveal-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-reveal-glow",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "cf-reveal-ava",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:sparkles",
      size: 20,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-kicker"
    }, "Ava found your focus"), /*#__PURE__*/React.createElement(CFFocusChip, {
      domain: focus.domain,
      size: "lg"
    })), /*#__PURE__*/React.createElement(CFDoor, {
      focus: focus,
      web: web,
      tier: tier
    }), focus.confirm && /*#__PURE__*/React.createElement("div", {
      className: "cf-confirm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-confirm-hd"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:message-circle-question",
      size: 18,
      color: "var(--ai-purple)"
    }), /*#__PURE__*/React.createElement("span", {
      className: "cf-kicker"
    }, "Ava has a question")), /*#__PURE__*/React.createElement("p", null, "Your ", /*#__PURE__*/React.createElement("b", null, focus.confirm.alt), " deep-dive scored ", focus.confirm.altScore, " — lower than ", focus.domain, " (", focus.confirm.focusScore, "). Is ", focus.confirm.alt.toLowerCase(), " actually what's holding you back?"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-ghost",
      onClick: () => onAskAva && onAskAva("My " + focus.confirm.alt + " score is lower than my " + focus.domain + " focus. Should I switch my focus?")
    }, "Ask Ava")), /*#__PURE__*/React.createElement("div", {
      className: "cf-milestone-card"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-milestone-wm",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:flag",
      size: 96,
      color: "currentColor"
    })), /*#__PURE__*/React.createElement("div", {
      className: "cf-milestone"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-milestone-ic",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:flag",
      size: 18,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      className: "cf-kicker"
    }, "Your next 90 days"), /*#__PURE__*/React.createElement("span", {
      className: "cf-milestone-ti"
    }, focus.milestone))), /*#__PURE__*/React.createElement("p", {
      className: "cf-reframe"
    }, focus.reframe)), paid ? /*#__PURE__*/React.createElement("div", {
      className: "cf-next"
    }, !focusDone && onSharpen && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-act cf-act-primary",
      onClick: () => onSharpen(focus.domain)
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-act-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:gauge",
      size: 18,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-act-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ti"
    }, "Sharpen it"), /*#__PURE__*/React.createElement("span", {
      className: "su"
    }, "Take the ", focus.domain, " deep-dive · 3 mins")), /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:chevron-right",
      size: 18,
      color: "rgba(255,255,255,.7)"
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-act cf-act-ai",
      onClick: () => onAskAva && onAskAva(CF.avaPrompt(focus))
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-act-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:sparkles",
      size: 18,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-act-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ti"
    }, "Ask Ava to plan my week"), /*#__PURE__*/React.createElement("span", {
      className: "su"
    }, "Seven days of steps toward this milestone")), /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:chevron-right",
      size: 18,
      color: "var(--ai-purple)"
    }))) : /*#__PURE__*/React.createElement(CFUpgradeTease, {
      focus: focus,
      web: web,
      onPreview: onPreview
    }), /*#__PURE__*/React.createElement("div", {
      className: "cf-reveal-foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-checkin"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:calendar-clock",
      size: 14,
      color: "currentColor"
    }), CF.checkInLabel(focus)), onRetake && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-link",
      onClick: onRetake
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:pencil-line",
      size: 13,
      color: "currentColor"
    }), "Update my answers")), onDone && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-ghost cf-btn-block cf-reveal-done",
      onClick: onDone
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:arrow-left",
      size: 16,
      color: "currentColor"
    }), "Back to Get to know you"));
  }

  /* ------------------------------------------------------ locked preview -- */
  /* Basic taps a locked questionnaire: first question visible, the rest
     blurred, what it unlocks (personalised to her focus) and the upgrade. */
  function CFLockedPreview({
    assessKey,
    def,
    focus,
    web,
    onClose
  }) {
    const meta = CF.META[assessKey] || {
      unlocks: []
    };
    const qs = def.questions;
    const first = qs[0];
    const rest = qs.slice(1, 3);
    const more = Math.max(0, qs.length - 3);
    const recommended = focus && focus.domain === assessKey;
    return /*#__PURE__*/React.createElement("div", {
      className: "cf-preview"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cf-preview-hd"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-preview-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: meta.icon || "lucide:compass",
      size: 20,
      color: "var(--brand-navy)"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-preview-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-tease-badge"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:lock",
      size: 12,
      color: "#8A5303"
    }), "Unlocks with Confidence"), /*#__PURE__*/React.createElement("span", {
      className: "cf-preview-ti"
    }, def.label), /*#__PURE__*/React.createElement("span", {
      className: "cf-preview-su"
    }, qs.length, " questions · ~", def.timeMin, " mins"))), recommended && /*#__PURE__*/React.createElement("div", {
      className: "cf-preview-ava"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:sparkles",
      size: 15,
      color: "var(--ai-purple)"
    }), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Ava recommends this one next."), " It scores your ", focus.domain, " focus so she can confirm it's really what's holding you back.")), /*#__PURE__*/React.createElement("div", {
      className: "cf-preview-q"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-preview-qn"
    }, "Question 1 of ", qs.length), /*#__PURE__*/React.createElement("p", {
      className: "cf-preview-qt"
    }, first.q), first.opts ? /*#__PURE__*/React.createElement("div", {
      className: "cf-preview-opts",
      "aria-hidden": "true"
    }, first.opts.slice(0, 4).map((o, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "cf-preview-opt"
    }, /*#__PURE__*/React.createElement("b", null, "ABCD"[i]), o))) : /*#__PURE__*/React.createElement("span", {
      className: "cf-preview-text",
      "aria-hidden": "true"
    }, "Your answer, in your words…")), /*#__PURE__*/React.createElement("div", {
      className: "cf-preview-blur",
      "aria-hidden": "true"
    }, rest.map((q, i) => /*#__PURE__*/React.createElement("p", {
      key: i
    }, /*#__PURE__*/React.createElement("span", null, "Q", i + 2), q.q)), more > 0 && /*#__PURE__*/React.createElement("p", {
      className: "more"
    }, "+ ", more, " more question", more === 1 ? "" : "s"), /*#__PURE__*/React.createElement("span", {
      className: "cf-preview-lock"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:lock",
      size: 18,
      color: "var(--brand-navy)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "cf-preview-unlocks"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-kicker"
    }, "What you'll get"), /*#__PURE__*/React.createElement("ul", null, meta.unlocks.map(u => /*#__PURE__*/React.createElement("li", {
      key: u
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:check",
      size: 14,
      color: "#1E7A5C"
    }), u)))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-upgrade cf-btn-block",
      onClick: () => go(CF.upgradeUrl(web))
    }, "Unlock with Confidence · ", money(CF.CONFIDENCE_PRICE), "/mo"), /*#__PURE__*/React.createElement("p", {
      className: "cf-tease-foot"
    }, "30-day free trial · cancel anytime"), onClose && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-link cf-preview-later",
      onClick: onClose
    }, "Not now"));
  }

  /* --------------------------------------------------------- hub banner -- */
  function CFHubBanner({
    focus,
    onOpenFocus,
    onStart
  }) {
    if (!focus) return /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-hub-banner start",
      onClick: onStart
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-hub-banner-ic"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:sparkles",
      size: 18,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-hub-banner-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ti"
    }, "Start here — Ava finds your focus"), /*#__PURE__*/React.createElement("span", {
      className: "su"
    }, "Answer \"Where you are now\" (2 mins, free) and Ava shows you the one place to start.")), /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:chevron-right",
      size: 18,
      color: "var(--brand-navy)"
    }));
    const dom = CF.DOMAINS[focus.domain];
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-hub-banner",
      onClick: onOpenFocus,
      style: {
        "--cf-dom": dom.color,
        "--cf-dom-soft": dom.soft
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-hub-banner-ic",
      style: {
        background: dom.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: dom.icon,
      size: 18,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-hub-banner-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ti"
    }, "Your coach focus: ", focus.domain), /*#__PURE__*/React.createElement("span", {
      className: "su"
    }, focus.milestone)), /*#__PURE__*/React.createElement("span", {
      className: "cf-hub-banner-cta"
    }, "See your door"));
  }

  /* -------------------------------------------------- Basic hub strip --- */
  function CFBasicStrip({
    web
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "cf-basic-strip"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:info",
      size: 16,
      color: "#8A5303"
    }), /*#__PURE__*/React.createElement("p", null, "You're on ", /*#__PURE__*/React.createElement("b", null, "Basic"), ": ", /*#__PURE__*/React.createElement("b", null, "Where you are now"), " is free and finds your focus. ", /*#__PURE__*/React.createElement("b", null, "Confidence"), " unlocks the other 6 questionnaires and full coaching with Ava."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-link",
      onClick: () => go(CF.upgradeUrl(web))
    }, "See plans"));
  }

  /* Demo-only tier preview (design review): sets the same key the
     Membership pages write and reloads so every card re-reads it. */
  function CFTierSwitch() {
    const cur = CF.tier();
    const opts = [["free", "Basic"], ["confidence", "Confidence"], ["mastery", "Mastery"]];
    return /*#__PURE__*/React.createElement("div", {
      className: "cf-tier-switch",
      role: "group",
      "aria-label": "Preview as membership tier (prototype only)"
    }, /*#__PURE__*/React.createElement("span", null, "Preview as"), opts.map(([k, l]) => /*#__PURE__*/React.createElement("button", {
      key: k,
      type: "button",
      className: cur === k || k === "mastery" && (cur === "freedom" || cur === "inner") ? "on" : "",
      "aria-pressed": cur === k,
      onClick: () => {
        CF.setPreviewTier(k);
        window.location.reload();
      }
    }, l)));
  }

  /* -------------------------------------------- text question (Personal) - */
  function CFTextAnswer({
    id,
    value,
    onChange
  }) {
    const ref = useRefCF(null);
    useEffectCF(() => {
      const el = ref.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = Math.max(120, el.scrollHeight) + "px";
    }, [value]);
    return /*#__PURE__*/React.createElement("textarea", {
      id: id,
      ref: ref,
      className: "cf-text-answer",
      rows: 4,
      value: value || "",
      placeholder: "Write as much or as little as you like…",
      onChange: e => onChange(e.target.value)
    });
  }
  function CFPersonalGoalsDone({
    answers,
    onDone,
    onAskAva,
    paid
  }) {
    const n = (answers || []).filter(a => a && String(a).trim()).length;
    return /*#__PURE__*/React.createElement("div", {
      className: "cf-reveal cf-pg-done"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cf-reveal-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-reveal-ava",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:heart-handshake",
      size: 20,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      className: "cf-kicker"
    }, "Saved for Ava"), /*#__PURE__*/React.createElement("h3", null, "Thank you for sharing your why"), /*#__PURE__*/React.createElement("p", {
      className: "cf-reveal-why"
    }, "You answered ", n, " of 5. Ava will use your words in your plan and check-ins — you can edit them any time from Get to know you.")), paid && onAskAva && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-ai cf-btn-block",
      onClick: () => onAskAva("Here's why I do this work. Use my personal goals to shape this week's plan.")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:sparkles",
      size: 16,
      color: "var(--ai-purple)"
    }), "Ask Ava to use these in my plan"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-navy cf-btn-block cf-reveal-done",
      onClick: onDone
    }, "Back to Get to know you"));
  }

  /* --------------------------------------------- Basic locked spiral --- */
  function CFLockedSpiral({
    web,
    focus
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "cf-locked-spiral"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cf-locked-spiral-grid",
      "aria-hidden": "true"
    }, CF.PILLARS.map(p => /*#__PURE__*/React.createElement("span", {
      key: p,
      className: "cf-ls-tile" + (focus && focus.domain === p ? " focus" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-ls-ring"
    }, /*#__PURE__*/React.createElement("span", null, "?")), /*#__PURE__*/React.createElement("span", {
      className: "cf-ls-name"
    }, p), focus && focus.domain === p && /*#__PURE__*/React.createElement("span", {
      className: "cf-ls-chip"
    }, "Your focus")))), /*#__PURE__*/React.createElement("div", {
      className: "cf-locked-spiral-veil"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cf-tease-badge"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lucide:lock",
      size: 12,
      color: "#8A5303"
    }), "Confidence"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "See all four pillars scored."), " Take the deep-dives and Ava tracks your whole Spiral — not just your focus."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "cf-btn cf-btn-upgrade",
      onClick: () => go(CF.upgradeUrl(web))
    }, "Unlock your Spiral")));
  }
  window.PFCoachUI = {
    CFDoor,
    CFTrack,
    CFFocusChip,
    CFUpgradeTease,
    CFFocusReveal,
    CFLockedPreview,
    CFHubBanner,
    CFBasicStrip,
    CFTierSwitch,
    CFTextAnswer,
    CFPersonalGoalsDone,
    CFLockedSpiral
  };
})();
