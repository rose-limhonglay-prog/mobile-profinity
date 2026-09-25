/* ===========================================================================
   PROfinity — Admin · Loyalty & Gamification · Reward Editor (Screen 3)
   Four tabs: Badges (Lifetime), Store Items (Spendable Credits), Leaderboard
   Prizes and the Milestone Path. Backed by window.PFLoyalty so edits are
   immediately reflected in Badge Gallery / Rewards Store / Leaderboard /
   Milestone Path on the Katy side.
   Classes prefixed rwd- to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateRWD,
  useRef: useRefRWD,
  useEffect: useEffectRWD
} = React;
const PF_RWD = window.PFLoyalty;
function goRWD(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const ADL_NAV_TOP = [{
  icon: "lucide:layout-grid",
  label: "Dashboard",
  href: "AdminDashboard.html"
}, {
  icon: "lucide:user",
  label: "Users",
  href: "AdminUsers.html"
}, {
  icon: "lucide:file-text",
  label: "Posts Management",
  href: "AdminPostsManagement.html"
}, {
  icon: "lucide:layout-dashboard",
  label: "Content Moderation",
  href: "AdminModeration.html"
}, {
  icon: "lucide:life-buoy",
  label: "Service Requests",
  href: "AdminServiceRequests.html"
}, {
  icon: "lucide:shield-check",
  label: "Verification",
  href: "AdminVerification.html"
}, {
  icon: "lucide:users-round",
  label: "Agents",
  href: "AdminAgents.html"
}, {
  icon: "lucide:calendar",
  label: "Events",
  href: "AdminEvents.html"
}, {
  icon: "lucide:map",
  label: "Product Mapping",
  href: "AdminProductMapping.html"
}, {
  icon: "lucide:bar-chart-3",
  label: "Analytics",
  href: "AdminAnalytics.html"
}, {
  icon: "lucide:smartphone",
  label: "App Versions",
  href: "AdminAppVersions.html"
}, {
  icon: "lucide:bell",
  label: "Push Notification",
  href: "AdminPushNotifications.html"
}, {
  icon: "lucide:badge-check",
  label: "Badges",
  href: "AdminBadges.html"
}, {
  icon: "lucide:clipboard-list",
  label: "Quizzes & Surveys",
  href: "AdminQuizEditor.html"
}, {
  icon: "lucide:receipt-text",
  label: "Transactions",
  href: "AdminTransactions.html",
  chevron: true
}, {
  icon: "lucide:table-2",
  label: "Courses",
  href: "AdminCourses.html",
  chevron: true
}, {
  icon: "lucide:users",
  label: "Community",
  href: "AdminCommunity.html",
  chevron: true
}];
const ADL_LOYALTY_SUBNAV = [{
  key: "actions",
  label: "Ways to Earn",
  href: "AdminActionsEditor.html"
}, {
  key: "tiers",
  label: "Tier Multipliers",
  href: "AdminTierMultipliers.html"
}, {
  key: "rewards",
  label: "Reward Editor",
  href: "AdminRewardEditor.html"
}, {
  key: "ledger",
  label: "Points Ledger",
  href: "AdminAuditLedger.html"
}, {
  key: "users",
  label: "User Diagnostics",
  href: "AdminUserDiagnostics.html"
}, {
  key: "overview",
  label: "System Overview",
  href: "AdminLoyaltyOverview.html"
}];
function AdlSidebar({
  activeLoyaltyKey
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "adl-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-icon-purple-gold.png",
    alt: "PROfinity Academy"
  })), ADL_NAV_TOP.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.label,
    className: "adl-navitem",
    type: "button",
    onClick: () => goRWD(item.href)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: item.icon
  }), /*#__PURE__*/React.createElement("span", null, item.label), item.chevron && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "adl-spacer"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down",
    class: "adl-chev"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-navgroup-label"
  }, "Loyalty & Gamification"), /*#__PURE__*/React.createElement("button", {
    className: "adl-navitem" + (activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goRWD("AdminActionsEditor.html")
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trophy"
  }), /*#__PURE__*/React.createElement("span", null, "Loyalty & Gamification")), /*#__PURE__*/React.createElement("div", {
    className: "adl-subnav"
  }, ADL_LOYALTY_SUBNAV.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    className: "adl-subnav-item" + (s.key === activeLoyaltyKey ? " is-active" : ""),
    type: "button",
    onClick: () => goRWD(s.href)
  }, /*#__PURE__*/React.createElement("span", null, s.label)))));
}
function AdlHeader({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "adl-header"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:panel-left",
    style: {
      fontSize: 22,
      color: "var(--gray-500)",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "adl-header-search"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Type to search..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "adl-bell"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "adl-bell-badge"
  }, "4")), /*#__PURE__*/React.createElement("div", {
    className: "adl-user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-user-name"
  }, "Dr Tim Pearce"), /*#__PURE__*/React.createElement("div", {
    className: "adl-user-role"
  }, "Admin")), /*#__PURE__*/React.createElement("img", {
    className: "adl-user-avatar",
    src: "assets/avatar-drtim.png",
    alt: "Dr Tim Pearce"
  }), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:chevron-down"
  }));
}

/* ------------------------------------------------------------- RWD tabs */
const RWD_TABS = [{
  key: "badges",
  label: "Badges"
}, {
  key: "store",
  label: "Store Items (Spendable Credits)"
}, {
  key: "leaderboard",
  label: "Leaderboard Prizes"
}, {
  key: "milestones",
  label: "Milestone Path"
}];
function rwdInitialTab() {
  try {
    const t = new URLSearchParams(window.location.search).get("tab");
    return RWD_TABS.some(x => x.key === t) ? t : "badges";
  } catch (e) {
    return "badges";
  }
}

/* ------------------------------------------------------ League badges
   The six gem badges members earn on mobile (league-engine.js, lowest →
   highest: Jade, Topaz, Ruby, Emerald, Amethyst, Sapphire). Same animated
   Lottie files as the Leaderboard rail; every gem plays so the admin can see
   exactly what the member sees. */
const RWD_LEAGUES = window.PFLeague && window.PFLeague.getLeagues() || [];
function RWDLottie({
  src,
  size,
  play = true
}) {
  const host = useRefRWD(null);
  const animRef = useRefRWD(null);
  useEffectRWD(() => {
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
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    style: {
      display: "block",
      width: size,
      height: size
    }
  });
}
function rwdRankLabel(i, n) {
  if (i === 0) return "Lowest";
  if (i === n - 1) return "Highest";
  return "Rank " + (i + 1);
}
function LeagueBadgesCard() {
  if (!RWD_LEAGUES.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "League Badges — earned with Lifetime Points"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "The six animated gem badges members see on the Leaderboard and Rewards pages, lowest to highest. Each league is a stop on the Milestone Path: it unlocks the moment a member’s Lifetime Points reach that milestone’s threshold, and the benefits listed there unlock with it. Edit the thresholds in the Milestone Path tab."))), /*#__PURE__*/React.createElement("div", {
    className: "rwd-league-grid"
  }, RWD_LEAGUES.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: l.key,
    className: "rwd-league-card",
    style: {
      "--lg-accent": l.accent,
      "--lg-deep": l.deep,
      "--lg-soft": l.soft
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "rwd-league-rank"
  }, rwdRankLabel(i, RWD_LEAGUES.length)), /*#__PURE__*/React.createElement("span", {
    className: "rwd-league-gem"
  }, /*#__PURE__*/React.createElement(RWDLottie, {
    src: l.lottie,
    size: 96
  })), /*#__PURE__*/React.createElement("span", {
    className: "rwd-league-name"
  }, l.name), /*#__PURE__*/React.createElement("span", {
    className: "rwd-league-req"
  }, l.requires === 0 ? "Starting league" : rwdFormat(l.requires) + " pts")))));
}
function BadgesTab({
  config,
  onUpdateAchievement
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rwd-stack"
  }, /*#__PURE__*/React.createElement(LeagueBadgesCard, null), /*#__PURE__*/React.createElement("div", {
    className: "adl-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Collectible Achievement Badges")), /*#__PURE__*/React.createElement("div", {
    className: "rwd-achievement-list"
  }, config.achievementBadges.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.key,
    className: "rwd-achievement-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rwd-achievement-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: b.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "rwd-achievement-main"
  }, /*#__PURE__*/React.createElement("input", {
    className: "rwd-achievement-name",
    value: b.name,
    onChange: e => onUpdateAchievement(b.key, {
      name: e.target.value
    })
  }), /*#__PURE__*/React.createElement("textarea", {
    className: "rwd-achievement-desc",
    value: b.description,
    onChange: e => onUpdateAchievement(b.key, {
      description: e.target.value
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "rwd-achievement-reward-row"
  }, /*#__PURE__*/React.createElement("label", null, "Linked reward / perk"), /*#__PURE__*/React.createElement("input", {
    value: b.reward,
    onChange: e => onUpdateAchievement(b.key, {
      reward: e.target.value
    })
  }))))))));
}
const RWD_CATEGORY_ICONS = {
  Signature: "lucide:sparkles",
  Experiences: "lucide:calendar",
  Clinical: "lucide:stethoscope",
  Vouchers: "lucide:ticket",
  Merch: "lucide:shirt"
};
function rwdCategoryIcon(category) {
  return RWD_CATEGORY_ICONS[category] || "lucide:gift";
}
function StoreTab({
  items,
  onUpdate,
  onAdd,
  onRemove
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-card",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head",
    style: {
      padding: "24px 24px 0",
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Store Items"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Special redeemable items priced in Spendable Credits.")), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy adl-btn-sm",
    type: "button",
    onClick: onAdd
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Add Item")), /*#__PURE__*/React.createElement("div", {
    className: "rwd-store-list"
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: "rwd-store-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rwd-store-card-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rwd-store-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: rwdCategoryIcon(it.category)
  })), /*#__PURE__*/React.createElement("input", {
    className: "rwd-store-name",
    value: it.name,
    placeholder: "Item name",
    onChange: e => onUpdate(it.id, {
      name: e.target.value
    })
  }), /*#__PURE__*/React.createElement("span", {
    className: "rwd-store-cost-pill"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:coins"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: it.cost,
    onChange: e => onUpdate(it.id, {
      cost: Number(e.target.value) || 0
    })
  }), /*#__PURE__*/React.createElement("span", null, "credits")), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-danger adl-btn-sm rwd-remove-btn",
    type: "button",
    onClick: () => onRemove(it.id),
    "aria-label": "Remove " + it.name
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trash-2"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rwd-store-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Category"), /*#__PURE__*/React.createElement("div", {
    className: "rwd-input-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:tag"
  }), /*#__PURE__*/React.createElement("input", {
    value: it.category,
    onChange: e => onUpdate(it.id, {
      category: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Inventory"), /*#__PURE__*/React.createElement("div", {
    className: "rwd-input-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:package"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Unlimited",
    value: it.inventory ?? "",
    onChange: e => onUpdate(it.id, {
      inventory: e.target.value === "" ? null : Number(e.target.value)
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Delivery Method"), /*#__PURE__*/React.createElement("div", {
    className: "rwd-input-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:truck"
  }), /*#__PURE__*/React.createElement("input", {
    value: it.delivery,
    onChange: e => onUpdate(it.id, {
      delivery: e.target.value
    })
  })))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Description"), /*#__PURE__*/React.createElement("textarea", {
    value: it.description,
    onChange: e => onUpdate(it.id, {
      description: e.target.value
    })
  })))), items.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "adl-cell-muted rwd-empty"
  }, "No store items yet — add one above.")));
}
const RWD_MEDAL_STYLES = [{
  background: "linear-gradient(135deg, #f7d774, #c9962b)",
  color: "#5b3d00"
}, {
  background: "linear-gradient(135deg, #e2e6ea, #adb5bd)",
  color: "#3a3f44"
}, {
  background: "linear-gradient(135deg, #e3ac7b, #a9673a)",
  color: "#4a2a10"
}];
function LeaderboardTab({
  prizes,
  onUpdate,
  onAdd,
  onRemove
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-card",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head",
    style: {
      padding: "24px 24px 0",
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Rolling 30-Day Leaderboard Prizes"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Prize tiers awarded to the top point-earners each rolling 30-day period.")), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy adl-btn-sm",
    type: "button",
    onClick: onAdd
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Add Prize Tier")), /*#__PURE__*/React.createElement("div", {
    className: "rwd-prize-list"
  }, prizes.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "rwd-prize-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rwd-prize-medal",
    style: RWD_MEDAL_STYLES[i]
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: i < 3 ? "lucide:trophy" : "lucide:award"
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field rwd-prize-rank"
  }, /*#__PURE__*/React.createElement("label", null, "Rank"), /*#__PURE__*/React.createElement("div", {
    className: "rwd-input-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:hash"
  }), /*#__PURE__*/React.createElement("input", {
    value: p.rank,
    placeholder: "e.g. 4–15",
    onChange: e => onUpdate(i, {
      rank: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field rwd-prize-prize"
  }, /*#__PURE__*/React.createElement("label", null, "Prize"), /*#__PURE__*/React.createElement("div", {
    className: "rwd-input-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:gift"
  }), /*#__PURE__*/React.createElement("input", {
    value: p.prize,
    placeholder: "Prize description",
    onChange: e => onUpdate(i, {
      prize: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-danger adl-btn-sm",
    type: "button",
    onClick: () => onRemove(i),
    "aria-label": "Remove rank " + p.rank
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trash-2"
  })))), prizes.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "adl-cell-muted rwd-empty"
  }, "No prize tiers yet — add one above.")));
}

/* ------------------------------------------------------ Milestone Path tab
   One linear ladder walked along the same Lifetime Points balance as the
   Level Badges. Each milestone carries a bundle of benefits that unlock
   automatically and permanently when the threshold is crossed — so there is
   no cost/inventory here, only title / description / delivery per benefit. */
function rwdFormat(n) {
  return (Number(n) || 0).toLocaleString("en-GB");
}
function MilestoneBenefitRow({
  benefit,
  index,
  onUpdate,
  onRemove,
  canRemove
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rwd-mp-benefit"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rwd-mp-benefit-idx"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:gift"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rwd-mp-benefit-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Benefit title"), /*#__PURE__*/React.createElement("input", {
    value: benefit.title,
    placeholder: "e.g. Course Credit — up to £250",
    onChange: e => onUpdate({
      title: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "adl-field"
  }, /*#__PURE__*/React.createElement("label", null, "Delivery"), /*#__PURE__*/React.createElement("div", {
    className: "rwd-input-icon"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:truck"
  }), /*#__PURE__*/React.createElement("input", {
    value: benefit.delivery || "",
    placeholder: "e.g. Voucher code, redeemable at checkout",
    onChange: e => onUpdate({
      delivery: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adl-field rwd-mp-benefit-desc"
  }, /*#__PURE__*/React.createElement("label", null, "Description"), /*#__PURE__*/React.createElement("textarea", {
    value: benefit.description || "",
    placeholder: "What the member gets, in one or two sentences.",
    onChange: e => onUpdate({
      description: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-danger adl-btn-sm rwd-remove-btn",
    type: "button",
    disabled: !canRemove,
    title: canRemove ? "Remove benefit" : "A milestone needs at least one benefit",
    onClick: onRemove,
    "aria-label": "Remove benefit " + (index + 1)
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:trash-2"
  })));
}
function MilestoneTab({
  path,
  levelBadges,
  onUpdate,
  onAdd,
  onRemove
}) {
  const sorted = path.slice().sort((a, b) => a.threshold - b.threshold);
  const maxLevel = levelBadges.reduce((m, b) => Math.max(m, b.threshold || 0), 0);
  const updateBenefit = (m, idx, patch) => onUpdate(m.key, {
    benefits: m.benefits.map((b, i) => i === idx ? {
      ...b,
      ...patch
    } : b)
  });
  const addBenefit = m => onUpdate(m.key, {
    benefits: (m.benefits || []).concat([{
      title: "",
      description: "",
      delivery: ""
    }])
  });
  const removeBenefit = (m, idx) => onUpdate(m.key, {
    benefits: m.benefits.filter((_, i) => i !== idx)
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "rwd-stack"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card rwd-mp-ladder-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head",
    style: {
      border: "none",
      padding: 0,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Ladder preview"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Same Lifetime Points balance as Level Badges (top Level Badge sits at ", rwdFormat(maxLevel), " pts). Points are never spent, so a reached milestone never locks again."))), /*#__PURE__*/React.createElement("div", {
    className: "rwd-mp-ladder"
  }, sorted.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: m.key,
    className: "rwd-mp-ladder-node"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rwd-mp-ladder-dot"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "rwd-mp-ladder-name"
  }, m.name || "Untitled"), /*#__PURE__*/React.createElement("span", {
    className: "rwd-mp-ladder-pts"
  }, rwdFormat(m.threshold), " pts"), /*#__PURE__*/React.createElement("span", {
    className: "rwd-mp-ladder-count"
  }, (m.benefits || []).length, " benefit", (m.benefits || []).length === 1 ? "" : "s"))), sorted.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "adl-cell-muted rwd-empty"
  }, "No milestones yet."))), /*#__PURE__*/React.createElement("div", {
    className: "adl-card",
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-card-head",
    style: {
      padding: "24px 24px 0",
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "adl-card-title-text"
  }, "Milestones"), /*#__PURE__*/React.createElement("div", {
    className: "adl-card-sub"
  }, "Every benefit in a bundle unlocks automatically the instant a member’s Lifetime Points reach the threshold. Milestones are listed in threshold order on the member’s Milestone Path page.")), /*#__PURE__*/React.createElement("button", {
    className: "adl-btn adl-btn-navy adl-btn-sm",
    type: "button",
    onClick: onAdd
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "lucide:plus"
  }), "Add Milestone")), /*#__PURE__*/React.createElement("div", {
    className: "rwd-store-list"
  }, sorted.map((m, i) => {
    const prev = sorted[i - 1];
    const outOfOrder = prev && prev.threshold === m.threshold;
    return /*#__PURE__*/React.createElement("div", {
      key: m.key,
      className: "rwd-store-card rwd-mp-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rwd-store-card-head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rwd-mp-step"
    }, i + 1), /*#__PURE__*/React.createElement("input", {
      className: "rwd-store-name",
      value: m.name,
      placeholder: "Milestone name",
      onChange: e => onUpdate(m.key, {
        name: e.target.value
      })
    }), /*#__PURE__*/React.createElement("span", {
      className: "rwd-store-cost-pill rwd-mp-pill"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:star"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      step: "100",
      value: m.threshold,
      onChange: e => onUpdate(m.key, {
        threshold: Math.max(0, Number(e.target.value) || 0)
      })
    }), /*#__PURE__*/React.createElement("span", null, "pts")), /*#__PURE__*/React.createElement("button", {
      className: "adl-btn adl-btn-danger adl-btn-sm rwd-remove-btn",
      type: "button",
      onClick: () => onRemove(m.key),
      "aria-label": "Remove " + m.name
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:trash-2"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "rwd-mp-meta"
    }, /*#__PURE__*/React.createElement("span", {
      className: "adl-field-hint"
    }, "Key: ", /*#__PURE__*/React.createElement("code", null, m.key), " (immutable)"), outOfOrder && /*#__PURE__*/React.createElement("span", {
      className: "rwd-mp-warn"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:triangle-alert"
    }), "Same threshold as “", prev.name, "” — members would unlock both at once.")), /*#__PURE__*/React.createElement("div", {
      className: "rwd-mp-benefits"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rwd-mp-benefits-head"
    }, /*#__PURE__*/React.createElement("span", null, "Benefit bundle"), /*#__PURE__*/React.createElement("button", {
      className: "adl-btn adl-btn-ghost adl-btn-sm",
      type: "button",
      onClick: () => addBenefit(m)
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:plus"
    }), "Add Benefit")), (m.benefits || []).map((b, bi) => /*#__PURE__*/React.createElement(MilestoneBenefitRow, {
      key: bi,
      benefit: b,
      index: bi,
      canRemove: m.benefits.length > 1,
      onUpdate: patch => updateBenefit(m, bi, patch),
      onRemove: () => removeBenefit(m, bi)
    })), (m.benefits || []).length === 0 && /*#__PURE__*/React.createElement("p", {
      className: "adl-cell-muted rwd-empty"
    }, "No benefits — add at least one so the milestone has something to unlock.")));
  }), sorted.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "adl-cell-muted rwd-empty"
  }, "No milestones yet — add one above."))));
}
function RewardEditorView() {
  const [config, setConfig] = useStateRWD(() => PF_RWD.getConfig());
  const [tab, setTab] = useStateRWD(rwdInitialTab);
  const updateLevel = (key, patch) => {
    const list = config.levelBadges.map(b => b.key === key ? {
      ...b,
      ...patch
    } : b);
    setConfig(PF_RWD.setLevelBadges(list));
  };
  const updateAchievement = (key, patch) => {
    const list = config.achievementBadges.map(b => b.key === key ? {
      ...b,
      ...patch
    } : b);
    setConfig(PF_RWD.setAchievementBadges(list));
  };
  const updateItem = (id, patch) => setConfig(PF_RWD.upsertStoreItem({
    id,
    ...patch
  }));
  const addItem = () => {
    const id = "item_" + Math.random().toString(36).slice(2, 7);
    setConfig(PF_RWD.upsertStoreItem({
      id,
      name: "New Reward Item",
      description: "",
      category: "Vouchers",
      cost: 500,
      inventory: null,
      delivery: "Email code"
    }));
  };
  const removeItem = id => setConfig(PF_RWD.setStoreItems(config.storeItems.filter(i => i.id !== id)));
  const updatePrize = (idx, patch) => {
    const list = config.leaderboardPrizes.map((p, i) => i === idx ? {
      ...p,
      ...patch
    } : p);
    setConfig(PF_RWD.setLeaderboardPrizes(list));
  };
  const addPrize = () => setConfig(PF_RWD.setLeaderboardPrizes(config.leaderboardPrizes.concat([{
    rank: "16–30",
    prize: "New prize tier"
  }])));
  const removePrize = idx => setConfig(PF_RWD.setLeaderboardPrizes(config.leaderboardPrizes.filter((_, i) => i !== idx)));
  const milestonePath = config.milestonePath || [];
  const updateMilestone = (key, patch) => setConfig(PF_RWD.upsertMilestone({
    key,
    ...patch
  }));
  const addMilestone = () => {
    const key = "ms_" + Math.random().toString(36).slice(2, 7);
    const top = milestonePath.reduce((m, x) => Math.max(m, x.threshold || 0), 0);
    setConfig(PF_RWD.upsertMilestone({
      key,
      name: "New Milestone",
      threshold: top + 10000,
      benefits: [{
        title: "",
        description: "",
        delivery: ""
      }]
    }));
  };
  const removeMilestone = key => setConfig(PF_RWD.setMilestonePath(milestonePath.filter(m => m.key !== key)));
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-view"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adl-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Reward Editor"), /*#__PURE__*/React.createElement("p", null, "Configure Badges, Store Items, Leaderboard Prizes and the Milestone Path."))), /*#__PURE__*/React.createElement("div", {
    className: "adl-tabs"
  }, RWD_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    className: "adl-tab-btn" + (tab === t.key ? " is-active" : ""),
    onClick: () => setTab(t.key)
  }, t.label))), tab === "badges" && /*#__PURE__*/React.createElement(BadgesTab, {
    config: config,
    onUpdateAchievement: updateAchievement
  }), tab === "store" && /*#__PURE__*/React.createElement(StoreTab, {
    items: config.storeItems,
    onUpdate: updateItem,
    onAdd: addItem,
    onRemove: removeItem
  }), tab === "leaderboard" && /*#__PURE__*/React.createElement(LeaderboardTab, {
    prizes: config.leaderboardPrizes,
    onUpdate: updatePrize,
    onAdd: addPrize,
    onRemove: removePrize
  }), tab === "milestones" && /*#__PURE__*/React.createElement(MilestoneTab, {
    path: milestonePath,
    levelBadges: config.levelBadges,
    onUpdate: updateMilestone,
    onAdd: addMilestone,
    onRemove: removeMilestone
  }));
}
function RewardEditorApp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "adl-shell"
  }, /*#__PURE__*/React.createElement(AdlSidebar, {
    activeLoyaltyKey: "rewards"
  }), /*#__PURE__*/React.createElement("main", {
    className: "adl-main"
  }, /*#__PURE__*/React.createElement(AdlHeader, {
    title: "Loyalty & Gamification — Reward Editor"
  }), /*#__PURE__*/React.createElement(RewardEditorView, null)));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(RewardEditorApp, null));
