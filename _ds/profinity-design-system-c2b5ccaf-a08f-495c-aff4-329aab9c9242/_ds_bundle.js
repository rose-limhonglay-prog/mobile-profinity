/* @ds-bundle: {"format":3,"namespace":"ProfinityDesignSystem_c2b5cc","components":[{"name":"AgentMessage","sourcePath":"components/agent/AgentMessage.jsx"},{"name":"AppointmentCard","sourcePath":"components/agent/AppointmentCard.jsx"},{"name":"CourseCard","sourcePath":"components/agent/CourseCard.jsx"},{"name":"AgentCard","sourcePath":"components/agents/AgentCard.jsx"},{"name":"AgentHero","sourcePath":"components/agents/AgentHero.jsx"},{"name":"ChannelHeader","sourcePath":"components/community/ChannelHeader.jsx"},{"name":"ChannelItem","sourcePath":"components/community/ChannelItem.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconifyIcon","sourcePath":"components/core/IconifyIcon.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Spark","sourcePath":"components/core/Spark.jsx"},{"name":"SuggestionChip","sourcePath":"components/core/SuggestionChip.jsx"},{"name":"CommentItem","sourcePath":"components/feed/CommentItem.jsx"},{"name":"Composer","sourcePath":"components/feed/Composer.jsx"},{"name":"EventCard","sourcePath":"components/feed/EventCard.jsx"},{"name":"PostActions","sourcePath":"components/feed/PostActions.jsx"},{"name":"PostCard","sourcePath":"components/feed/PostCard.jsx"},{"name":"ReactionGroup","sourcePath":"components/feed/ReactionGroup.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"CourseTile","sourcePath":"components/learning/CourseTile.jsx"},{"name":"LevelBadge","sourcePath":"components/learning/LevelBadge.jsx"},{"name":"ProgressBar","sourcePath":"components/learning/ProgressBar.jsx"},{"name":"Tabs","sourcePath":"components/learning/Tabs.jsx"},{"name":"Logo","sourcePath":"components/navigation/Logo.jsx"},{"name":"TopNav","sourcePath":"components/navigation/TopNav.jsx"},{"name":"AchievementChip","sourcePath":"components/profile/AchievementChip.jsx"},{"name":"MembershipCard","sourcePath":"components/profile/MembershipCard.jsx"},{"name":"ProfileHeader","sourcePath":"components/profile/ProfileHeader.jsx"},{"name":"StatGroup","sourcePath":"components/profile/StatGroup.jsx"},{"name":"VerificationSeals","sourcePath":"components/profile/VerificationSeals.jsx"}],"sourceHashes":{"components/agent/AgentMessage.jsx":"ad918fd77d31","components/agent/AppointmentCard.jsx":"79568faf4feb","components/agent/CourseCard.jsx":"5da512290883","components/agents/AgentCard.jsx":"25c7a378f2d8","components/agents/AgentHero.jsx":"d6b911e5de3d","components/community/ChannelHeader.jsx":"18a1036a8433","components/community/ChannelItem.jsx":"3faa0ae2832f","components/core/Avatar.jsx":"fd918d739097","components/core/Badge.jsx":"b1dff183c0b0","components/core/Button.jsx":"fa911c1d161d","components/core/Card.jsx":"715f208a09d6","components/core/IconifyIcon.jsx":"a0d6cc28c5c6","components/core/Input.jsx":"6dc24ad8ffe5","components/core/Spark.jsx":"013e2f1c0b0e","components/core/SuggestionChip.jsx":"c03131c7730a","components/feed/CommentItem.jsx":"3385d3601b03","components/feed/Composer.jsx":"5adb0277d6b4","components/feed/EventCard.jsx":"5c8044c1a59d","components/feed/PostActions.jsx":"30e65ce8a6a8","components/feed/PostCard.jsx":"f8dc2bc605b6","components/feed/ReactionGroup.jsx":"0eb5182d0a86","components/icons/Icon.jsx":"f5a912aff4b4","components/learning/CourseTile.jsx":"2a78c1d29934","components/learning/LevelBadge.jsx":"67ce1fce29b1","components/learning/ProgressBar.jsx":"e6921f0837cd","components/learning/Tabs.jsx":"459f9784f58c","components/navigation/Logo.jsx":"529c1bcfadcd","components/navigation/TopNav.jsx":"1b2175476c4a","components/profile/AchievementChip.jsx":"64e266aeae4d","components/profile/MembershipCard.jsx":"d3ad5314e463","components/profile/ProfileHeader.jsx":"367038678a72","components/profile/StatGroup.jsx":"75177a7b2faa","components/profile/VerificationSeals.jsx":"2db466e3fc47","ui_kits/agent/App.jsx":"70e781c3e0bb","ui_kits/agent/ChatPanel.jsx":"4c422221a568","ui_kits/agent/ConversationRail.jsx":"5869874c4521","ui_kits/agent/RightRail.jsx":"104d3f4d7f29","ui_kits/agent/data.js":"d112dda74103","ui_kits/app/AgentsScreen.jsx":"9decf591e4e7","ui_kits/app/CommunityScreen.jsx":"bf2093708077","ui_kits/app/HomeScreen.jsx":"9b1b234a0985","ui_kits/app/LearningScreen.jsx":"fb6bf8b67c75","ui_kits/app/ProfileScreen.jsx":"3751805d1e0a","ui_kits/app/data.js":"c48c6a5ea3dc","ui_kits/app/kit.jsx":"3b69558507cf","ui_kits/app/main.jsx":"90491320b793"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ProfinityDesignSystem_c2b5cc = window.ProfinityDesignSystem_c2b5cc || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/agents/AgentHero.jsx
try { (() => {
/**
 * Agents page hero — the purple→magenta→coral gradient banner with a large
 * white title and supporting line.
 */
function AgentHero({
  title = "Profinity Agents",
  subtitle = "Manage and activate agents for your profile. Enhance your workflow with specialised AI assistants tailored to your needs.",
  radius = 0,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--agent-hero-gradient)",
      borderRadius: radius,
      padding: "64px 56px",
      color: "var(--white)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: 52,
      lineHeight: 1.05,
      letterSpacing: "var(--ls-tight)"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      maxWidth: 760,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-h3)",
      lineHeight: "var(--lh-normal)",
      color: "rgba(255,255,255,0.92)"
    }
  }, subtitle));
}
Object.assign(__ds_scope, { AgentHero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agents/AgentHero.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Circular user avatar with image, initials fallback, and optional status ring. */
function Avatar({
  src,
  name = "",
  size = 40,
  ring = false,
  style = {},
  ...rest
}) {
  const initials = name.split(" ").map(p => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      flexShrink: 0,
      background: "var(--brand-navy)",
      color: "var(--white)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: Math.round(size * 0.4),
      border: ring ? "2px solid var(--white)" : "none",
      boxShadow: ring ? "0 0 0 2px var(--brand-navy)" : "none",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  success: {
    color: "var(--success)",
    bg: "var(--success-bg)"
  },
  info: {
    color: "var(--info)",
    bg: "var(--info-bg)"
  },
  warning: {
    color: "var(--warning)",
    bg: "var(--warning-bg)"
  },
  error: {
    color: "var(--error)",
    bg: "var(--error-bg)"
  },
  agent: {
    color: "var(--ai-purple)",
    bg: "var(--ai-purple-200)"
  },
  neutral: {
    color: "var(--gray-600)",
    bg: "var(--gray-100)"
  }
};

/** Status badge / tag. Pill by default; set dot to show a leading status dot. */
function Badge({
  children,
  tone = "neutral",
  dot = false,
  style = {},
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 10px",
      background: t.bg,
      color: t.color,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-medium)",
      lineHeight: 1.4,
      borderRadius: "var(--r-pill)",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.color,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/agent/AppointmentCard.jsx
try { (() => {
const CalIcon = () => /*#__PURE__*/React.createElement("svg", {
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  style: {
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "4.5",
  width: "18",
  height: "16",
  rx: "2.5",
  stroke: "currentColor",
  strokeWidth: "1.7"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3 9h18M8 2.5v4M16 2.5v4",
  stroke: "currentColor",
  strokeWidth: "1.7",
  strokeLinecap: "round"
}));

/**
 * Appointment summary used in the Lumina studio rail.
 * Title, date row, and one or more attendee rows with status badges.
 */
function AppointmentCard({
  title,
  datetime,
  attendees = [],
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "var(--gray-500)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)"
    }
  }, /*#__PURE__*/React.createElement(CalIcon, null), datetime), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 2
    }
  }, attendees.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, a.name), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: a.status === "Confirmed" ? "agent" : "warning"
  }, a.status)))));
}
Object.assign(__ds_scope, { AppointmentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/AppointmentCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Profinity Button. Primary = AI purple (default agent action),
 * brand = navy, secondary = white/bordered, ghost = transparent.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeading = null,
  iconTrailing = null,
  fullWidth = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 14px",
      fontSize: "var(--fs-body)",
      height: 36,
      gap: 6
    },
    md: {
      padding: "10px 18px",
      fontSize: "var(--fs-body-lg)",
      height: 44,
      gap: 8
    },
    lg: {
      padding: "13px 22px",
      fontSize: "var(--fs-body-lg)",
      height: 52,
      gap: 8
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "var(--white)",
      border: "1px solid var(--action-primary)"
    },
    brand: {
      background: "var(--brand-navy)",
      color: "var(--white)",
      border: "1px solid var(--brand-navy)"
    },
    secondary: {
      background: "var(--white)",
      color: "var(--gray-600)",
      border: "1px solid var(--border-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--action-primary)",
      border: "1px solid transparent"
    }
  };
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  let bg = v.background;
  if (hover && !disabled) {
    if (variant === "primary") bg = "var(--action-primary-hover)";else if (variant === "brand") bg = "var(--brand-navy-700)";else if (variant === "secondary") bg = "var(--gray-50)";else if (variant === "ghost") bg = "var(--ai-purple-100)";
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      width: fullWidth ? "100%" : "auto",
      fontFamily: "var(--font-sans)",
      fontSize: s.fontSize,
      fontWeight: "var(--fw-medium)",
      lineHeight: 1,
      borderRadius: "var(--r-sm)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast)",
      whiteSpace: "nowrap",
      ...v,
      background: bg,
      ...style
    }
  }, rest), iconLeading, children, iconTrailing);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/agent/CourseCard.jsx
try { (() => {
const ArrowUpRight = () => /*#__PURE__*/React.createElement("svg", {
  width: "15",
  height: "15",
  viewBox: "0 0 24 24",
  fill: "none"
}, /*#__PURE__*/React.createElement("path", {
  d: "M7 17 17 7M9 7h8v8",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));

/**
 * Course recommendation row used inside Coach agent messages.
 * Square thumbnail, title + description, "View Course" action.
 */
function CourseCard({
  title,
  description,
  thumbnail,
  cta = "View Course",
  onView,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: 16,
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      borderRadius: "var(--r-sm)",
      background: thumbnail ? `center/cover no-repeat url(${thumbnail})` : "var(--brand-navy)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)",
      marginBottom: 4
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-snug)",
      color: "var(--gray-500)"
    }
  }, description)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    onClick: onView,
    iconTrailing: /*#__PURE__*/React.createElement(ArrowUpRight, null),
    style: {
      flexShrink: 0
    }
  }, cta));
}
Object.assign(__ds_scope, { CourseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/CourseCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** White surface card — 12px radius, hairline border, soft shadow. */
function Card({
  children,
  padding = 24,
  interactive = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-card)",
      padding,
      transition: "box-shadow var(--dur-normal) var(--ease-standard)",
      cursor: interactive ? "pointer" : "default",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconifyIcon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Ensure the Iconify web component runtime is loaded exactly once. */
let injected = false;
function ensureIconify() {
  if (injected || typeof document === "undefined") return;
  if (document.querySelector('script[data-iconify]')) {
    injected = true;
    return;
  }
  const s = document.createElement("script");
  s.src = "https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js";
  s.async = true;
  s.setAttribute("data-iconify", "");
  document.head.appendChild(s);
  injected = true;
}

/**
 * IconifyIcon — escape hatch over the Iconify <iconify-icon> web component.
 * Use the bespoke `Icon` (components/icons) for house glyphs; reach for this
 * when you need a glyph the brand set lacks. Pass any Iconify name ("set:name").
 * House fallback set is Lucide (line icons) to match the brand's stroke style.
 */
function IconifyIcon({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth,
  style = {},
  ...rest
}) {
  ensureIconify();
  return /*#__PURE__*/React.createElement("iconify-icon", _extends({
    icon: name,
    width: size,
    height: size,
    style: {
      color,
      display: "inline-block",
      flexShrink: 0,
      lineHeight: 0,
      ...style
    }
  }, strokeWidth != null ? {
    "stroke-width": strokeWidth
  } : {}, rest));
}
Object.assign(__ds_scope, { IconifyIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconifyIcon.jsx", error: String((e && e.message) || e) }); }

// components/community/ChannelHeader.jsx
try { (() => {
/**
 * Community channel header — banner image, channel name with a Follow action,
 * public/followers meta, and an "About This Channel" blurb.
 */
function ChannelHeader({
  banner,
  name,
  swatch = "var(--brand-navy)",
  followers,
  visibility = "Public channel",
  about,
  following = false,
  onFollow = () => {},
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      ...style
    }
  }, banner && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 230,
      borderRadius: "var(--r-md)",
      overflow: "hidden",
      border: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: banner,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 6,
      background: swatch,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      flex: 1,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h1)",
      color: "var(--text-primary)"
    }
  }, name), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: following ? "secondary" : "primary",
    onClick: onFollow
  }, following ? "Following" : "Follow")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 28,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--gray-600)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "lucide:globe",
    size: 20,
    color: "var(--gray-500)"
  }), visibility), followers != null && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-primary)"
    }
  }, followers), " Followers")), about && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)",
      marginBottom: 8
    }
  }, "About This Channel"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--gray-600)"
    }
  }, about)));
}
Object.assign(__ds_scope, { ChannelHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/community/ChannelHeader.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input with optional leading icon. Pill or rounded. Matches the agent composer / search field. */
function Input({
  icon = null,
  trailing = null,
  pill = false,
  style = {},
  wrapStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      padding: pill ? "12px 18px" : "10px 14px",
      background: "var(--surface-sunken)",
      border: `1px solid ${focus ? "var(--border-focus)" : "transparent"}`,
      borderRadius: pill ? "var(--r-pill)" : "var(--r-sm)",
      boxShadow: focus ? "0 0 0 3px var(--focus-ring)" : "none",
      transition: "box-shadow var(--dur-fast), border-color var(--dur-fast)",
      ...wrapStyle
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      color: "var(--gray-450)",
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)",
      minWidth: 0,
      ...style
    }
  }, rest)), trailing && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexShrink: 0
    }
  }, trailing));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Spark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The Profinity four-point AI "spark" — the signature agent mark. Inherits color via currentColor. */
function Spark({
  size = 16,
  color = "var(--ai-purple)",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      display: "inline-block",
      flexShrink: 0,
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("path", {
    d: "M12 2.2c.5 3.9 1.7 5.6 5.6 6.3-3.9.7-5.1 2.4-5.6 6.3-.5-3.9-1.7-5.6-5.6-6.3C10.3 7.8 11.5 6.1 12 2.2Z",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.4 13.6c.27 2 .9 2.9 2.9 3.2-2 .35-2.63 1.2-2.9 3.2-.27-2-.9-2.85-2.9-3.2 2-.3 2.63-1.2 2.9-3.2Z",
    fill: "currentColor"
  }));
}
Object.assign(__ds_scope, { Spark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Spark.jsx", error: String((e && e.message) || e) }); }

// components/agent/AgentMessage.jsx
try { (() => {
/**
 * A single agent / user message in the conversation.
 * role="assistant": agent name in navy + body, left aligned, no bubble.
 * role="user": right-aligned soft-purple bubble with timestamp.
 */
function AgentMessage({
  role = "assistant",
  agentName = "Profinity Coach AI",
  time,
  children,
  style = {}
}) {
  if (role === "user") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "flex-end",
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: "70%",
        background: "var(--ai-purple-200)",
        color: "var(--text-primary)",
        padding: "14px 18px",
        borderRadius: "16px 16px 4px 16px",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body-lg)",
        lineHeight: "var(--lh-normal)"
      }
    }, /*#__PURE__*/React.createElement("div", null, children), time && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        fontSize: "var(--fs-caption)",
        color: "var(--gray-500)",
        textAlign: "right"
      }
    }, time)));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Spark, {
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--brand-navy)"
    }
  }, agentName)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--text-primary)"
    }
  }, children));
}
Object.assign(__ds_scope, { AgentMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/AgentMessage.jsx", error: String((e && e.message) || e) }); }

// components/agents/AgentCard.jsx
try { (() => {
/**
 * Agent catalogue card — icon, "Included in…" premium badge, title (optionally
 * locked), description, a status line and a CTA (Notify Me / Learn More / waitlisted).
 */
function AgentCard({
  icon,
  badge = "Included in Premium",
  title,
  locked = false,
  description,
  status = "Coming Soon",
  cta = "Notify Me",
  ctaIcon = "lucide:bell",
  ctaDisabled = false,
  onCta = () => {},
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      padding: 22,
      gap: 14,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      background: icon ? `center/cover no-repeat url(${icon})` : "var(--spark-gradient)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, !icon && /*#__PURE__*/React.createElement(__ds_scope.Spark, {
    size: 24,
    color: "var(--white)"
  })), badge && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      background: "var(--premium-badge)",
      color: "var(--white)",
      borderRadius: "var(--r-pill)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-semibold)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "fluent:crown-16-filled",
    size: 14,
    color: "var(--white)"
  }), badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--ai-purple)"
    }
  }, title), locked && /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "lucide:lock",
    size: 16,
    color: "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-normal)",
      color: "var(--gray-600)"
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-default)",
      paddingTop: 14,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, status && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "lucide:clock",
    size: 18,
    color: "var(--gray-450)"
  }), status), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCta,
    disabled: ctaDisabled,
    style: {
      height: 46,
      width: "100%",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: ctaDisabled ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--white)",
      background: "var(--action-primary)",
      opacity: ctaDisabled ? 0.55 : 1
    }
  }, ctaIcon && /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: ctaIcon,
    size: 18,
    color: "var(--white)"
  }), cta)));
}
Object.assign(__ds_scope, { AgentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agents/AgentCard.jsx", error: String((e && e.message) || e) }); }

// components/core/SuggestionChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Suggestion chip used under agent messages and in the composer.
 * Soft-purple pill, hairline border, purple spark + label. Click to send.
 */
function SuggestionChip({
  children,
  icon,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 16px",
      background: hover ? "var(--ai-purple-200)" : "var(--ai-purple-100)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--r-pill)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)",
      color: "var(--ai-purple)",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background var(--dur-fast) var(--ease-standard)",
      ...style
    }
  }, rest), icon === undefined ? /*#__PURE__*/React.createElement(__ds_scope.Spark, {
    size: 18
  }) : icon, children);
}
Object.assign(__ds_scope, { SuggestionChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SuggestionChip.jsx", error: String((e && e.message) || e) }); }

// components/feed/ReactionGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const GLYPH = {
  like: {
    icon: "fluent:thumb-like-16-filled",
    bg: "var(--reaction-like)"
  },
  love: {
    icon: "fluent:heart-16-filled",
    bg: "var(--reaction-love)"
  },
  laugh: {
    icon: "fluent:emoji-laugh-16-filled",
    bg: "var(--reaction-laugh)"
  },
  insightful: {
    icon: "fluent:lightbulb-16-filled",
    bg: "var(--reaction-insightful)"
  }
};

/**
 * Facebook-style reaction cluster — overlapping coloured emoji circles + a count.
 * Used under feed posts and comments.
 */
function ReactionGroup({
  reactions = ["like", "love", "laugh"],
  count,
  size = 22,
  style = {},
  ...rest
}) {
  const list = reactions.filter(r => GLYPH[r]);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, list.map((r, i) => /*#__PURE__*/React.createElement("span", {
    key: r,
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: GLYPH[r].bg,
      border: "2px solid var(--white)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: i === 0 ? 0 : -size * 0.32,
      zIndex: list.length - i
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: GLYPH[r].icon,
    size: Math.round(size * 0.62),
    color: "var(--white)"
  })))), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)"
    }
  }, count));
}
Object.assign(__ds_scope, { ReactionGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/ReactionGroup.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Bespoke Profinity icon set — the icon map is inlined below as a top-level
// const (the same self-contained pattern every other component uses), so the
// bundler never has to resolve a cross-module export for the glyph data.

const ICONS = {
  "AlertCircle": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 11 6 C 11 5.448 10.552 5 10 5 C 9.448 5 9 5.448 9 6 L 10 6 L 11 6 Z M 9 10 C 9 10.552 9.448 11 10 11 C 10.552 11 11 10.552 11 10 L 10 10 L 9 10 Z M 10 13 C 9.448 13 9 13.448 9 14 C 9 14.552 9.448 15 10 15 L 10 14 L 10 13 Z M 10.01 15 C 10.562 15 11.01 14.552 11.01 14 C 11.01 13.448 10.562 13 10.01 13 L 10.01 14 L 10.01 15 Z M 20 10 L 19 10 C 19 14.971 14.971 19 10 19 L 10 20 L 10 21 C 16.075 21 21 16.075 21 10 L 20 10 Z M 10 20 L 10 19 C 5.029 19 1 14.971 1 10 L 0 10 L -1 10 C -1 16.075 3.925 21 10 21 L 10 20 Z M 0 10 L 1 10 C 1 5.029 5.029 1 10 1 L 10 0 L 10 -1 C 3.925 -1 -1 3.925 -1 10 L 0 10 Z M 10 0 L 10 1 C 14.971 1 19 5.029 19 10 L 20 10 L 21 10 C 21 3.925 16.075 -1 10 -1 L 10 0 Z M 10 6 L 9 6 L 9 10 L 10 10 L 11 10 L 11 6 L 10 6 Z M 10 14 L 10 15 L 10.01 15 L 10.01 14 L 10.01 13 L 10 13 L 10 14 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 2)\"/>"
  },
  "ArrowRight": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 0 6 C -0.552 6 -1 6.448 -1 7 C -1 7.552 -0.552 8 0 8 L 0 7 L 0 6 Z M 14 7 L 14.707 7.707 C 15.098 7.317 15.098 6.683 14.707 6.293 L 14 7 Z M 7.707 -0.707 C 7.317 -1.098 6.683 -1.098 6.293 -0.707 C 5.902 -0.317 5.902 0.317 6.293 0.707 L 7 0 L 7.707 -0.707 Z M 6.293 13.293 C 5.902 13.683 5.902 14.317 6.293 14.707 C 6.683 15.098 7.317 15.098 7.707 14.707 L 7 14 L 6.293 13.293 Z M 0 7 L 0 8 L 14 8 L 14 7 L 14 6 L 0 6 L 0 7 Z M 7 0 L 6.293 0.707 L 13.293 7.707 L 14 7 L 14.707 6.293 L 7.707 -0.707 L 7 0 Z M 14 7 L 13.293 6.293 L 6.293 13.293 L 7 14 L 7.707 14.707 L 14.707 7.707 L 14 7 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 5)\"/>"
  },
  "ArrowUp": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 6 14 C 6 14.552 6.448 15 7 15 C 7.552 15 8 14.552 8 14 L 7 14 L 6 14 Z M 7 0 L 7.707 -0.707 C 7.317 -1.098 6.683 -1.098 6.293 -0.707 L 7 0 Z M -0.707 6.293 C -1.098 6.683 -1.098 7.317 -0.707 7.707 C -0.317 8.098 0.317 8.098 0.707 7.707 L 0 7 L -0.707 6.293 Z M 13.293 7.707 C 13.683 8.098 14.317 8.098 14.707 7.707 C 15.098 7.317 15.098 6.683 14.707 6.293 L 14 7 L 13.293 7.707 Z M 7 14 L 8 14 L 8 0 L 7 0 L 6 0 L 6 14 L 7 14 Z M 0 7 L 0.707 7.707 L 7.707 0.707 L 7 0 L 6.293 -0.707 L -0.707 6.293 L 0 7 Z M 7 0 L 6.293 0.707 L 13.293 7.707 L 14 7 L 14.707 6.293 L 7.707 -0.707 L 7 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 5)\"/>"
  },
  "ArrowUpRightSize16": {
    viewBox: "0 0 16 16",
    body: "<path d=\"M -0.566 6.101 C -0.878 6.413 -0.878 6.92 -0.566 7.232 C -0.253 7.545 0.253 7.545 0.566 7.232 L 0 6.667 L -0.566 6.101 Z M 6.667 0 L 7.467 0 C 7.467 -0.442 7.108 -0.8 6.667 -0.8 L 6.667 0 Z M 0 -0.8 C -0.442 -0.8 -0.8 -0.442 -0.8 0 C -0.8 0.442 -0.442 0.8 0 0.8 L 0 0 L 0 -0.8 Z M 5.867 6.667 C 5.867 7.108 6.225 7.467 6.667 7.467 C 7.108 7.467 7.467 7.108 7.467 6.667 L 6.667 6.667 L 5.867 6.667 Z M 0 6.667 L 0.566 7.232 L 7.232 0.566 L 6.667 0 L 6.101 -0.566 L -0.566 6.101 L 0 6.667 Z M 0 0 L 0 0.8 L 6.667 0.8 L 6.667 0 L 6.667 -0.8 L 0 -0.8 L 0 0 Z M 6.667 0 L 5.867 0 L 5.867 6.667 L 6.667 6.667 L 7.467 6.667 L 7.467 0 L 6.667 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.667 4.667)\"/>"
  },
  "ArrowUpRightSize20": {
    viewBox: "0 0 20 20",
    body: "<path d=\"M -0.707 7.626 C -1.098 8.017 -1.098 8.65 -0.707 9.04 C -0.317 9.431 0.317 9.431 0.707 9.04 L 0 8.333 L -0.707 7.626 Z M 8.333 0 L 9.333 0 C 9.333 -0.552 8.886 -1 8.333 -1 L 8.333 0 Z M 0 -1 C -0.552 -1 -1 -0.552 -1 0 C -1 0.552 -0.552 1 0 1 L 0 0 L 0 -1 Z M 7.333 8.333 C 7.333 8.886 7.781 9.333 8.333 9.333 C 8.886 9.333 9.333 8.886 9.333 8.333 L 8.333 8.333 L 7.333 8.333 Z M 0 8.333 L 0.707 9.04 L 9.04 0.707 L 8.333 0 L 7.626 -0.707 L -0.707 7.626 L 0 8.333 Z M 0 0 L 0 1 L 8.333 1 L 8.333 0 L 8.333 -1 L 0 -1 L 0 0 Z M 8.333 0 L 7.333 0 L 7.333 8.333 L 8.333 8.333 L 9.333 8.333 L 9.333 0 L 8.333 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.833 5.833)\"/>"
  },
  "ArrowUpRightSize24": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M -0.884 9.116 C -1.372 9.604 -1.372 10.396 -0.884 10.884 C -0.396 11.372 0.396 11.372 0.884 10.884 L 0 10 L -0.884 9.116 Z M 10 0 L 11.25 0 C 11.25 -0.69 10.69 -1.25 10 -1.25 L 10 0 Z M 0 -1.25 C -0.69 -1.25 -1.25 -0.69 -1.25 0 C -1.25 0.69 -0.69 1.25 0 1.25 L 0 0 L 0 -1.25 Z M 8.75 10 C 8.75 10.69 9.31 11.25 10 11.25 C 10.69 11.25 11.25 10.69 11.25 10 L 10 10 L 8.75 10 Z M 0 10 L 0.884 10.884 L 10.884 0.884 L 10 0 L 9.116 -0.884 L -0.884 9.116 L 0 10 Z M 0 0 L 0 1.25 L 10 1.25 L 10 0 L 10 -1.25 L 0 -1.25 L 0 0 Z M 10 0 L 8.75 0 L 8.75 10 L 10 10 L 11.25 10 L 11.25 0 L 10 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 7 7)\"/>"
  },
  "ArrowUpRightSize32": {
    viewBox: "0 0 32 32",
    body: "<path d=\"M -1.061 12.273 C -1.646 12.858 -1.646 13.808 -1.061 14.394 C -0.475 14.98 0.475 14.98 1.061 14.394 L 0 13.333 L -1.061 12.273 Z M 13.333 0 L 14.833 0 C 14.833 -0.828 14.162 -1.5 13.333 -1.5 L 13.333 0 Z M 0 -1.5 C -0.828 -1.5 -1.5 -0.828 -1.5 0 C -1.5 0.828 -0.828 1.5 0 1.5 L 0 0 L 0 -1.5 Z M 11.833 13.333 C 11.833 14.162 12.505 14.833 13.333 14.833 C 14.162 14.833 14.833 14.162 14.833 13.333 L 13.333 13.333 L 11.833 13.333 Z M 0 13.333 L 1.061 14.394 L 14.394 1.061 L 13.333 0 L 12.273 -1.061 L -1.061 12.273 L 0 13.333 Z M 0 0 L 0 1.5 L 13.333 1.5 L 13.333 0 L 13.333 -1.5 L 0 -1.5 L 0 0 Z M 13.333 0 L 11.833 0 L 11.833 13.333 L 13.333 13.333 L 14.833 13.333 L 14.833 0 L 13.333 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 9.333 9.333)\"/>"
  },
  "ArrowUpRightSize40": {
    viewBox: "0 0 40 40",
    body: "<path d=\"M -1.237 15.429 C -1.921 16.113 -1.921 17.221 -1.237 17.904 C -0.554 18.588 0.554 18.588 1.237 17.904 L 0 16.667 L -1.237 15.429 Z M 16.667 0 L 18.417 0 C 18.417 -0.966 17.633 -1.75 16.667 -1.75 L 16.667 0 Z M 0 -1.75 C -0.966 -1.75 -1.75 -0.966 -1.75 0 C -1.75 0.966 -0.966 1.75 0 1.75 L 0 0 L 0 -1.75 Z M 14.917 16.667 C 14.917 17.633 15.7 18.417 16.667 18.417 C 17.633 18.417 18.417 17.633 18.417 16.667 L 16.667 16.667 L 14.917 16.667 Z M 0 16.667 L 1.237 17.904 L 17.904 1.237 L 16.667 0 L 15.429 -1.237 L -1.237 15.429 L 0 16.667 Z M 0 0 L 0 1.75 L 16.667 1.75 L 16.667 0 L 16.667 -1.75 L 0 -1.75 L 0 0 Z M 16.667 0 L 14.917 0 L 14.917 16.667 L 16.667 16.667 L 18.417 16.667 L 18.417 0 L 16.667 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 11.667 11.667)\"/>"
  },
  "ArrowUpRightSize48": {
    viewBox: "0 0 48 48",
    body: "<path d=\"M -1.414 18.586 C -2.195 19.367 -2.195 20.633 -1.414 21.414 C -0.633 22.195 0.633 22.195 1.414 21.414 L 0 20 L -1.414 18.586 Z M 20 0 L 22 0 C 22 -1.105 21.105 -2 20 -2 L 20 0 Z M 0 -2 C -1.105 -2 -2 -1.105 -2 0 C -2 1.105 -1.105 2 0 2 L 0 0 L 0 -2 Z M 18 20 C 18 21.105 18.895 22 20 22 C 21.105 22 22 21.105 22 20 L 20 20 L 18 20 Z M 0 20 L 1.414 21.414 L 21.414 1.414 L 20 0 L 18.586 -1.414 L -1.414 18.586 L 0 20 Z M 0 0 L 0 2 L 20 2 L 20 0 L 20 -2 L 0 -2 L 0 0 Z M 20 0 L 18 0 L 18 20 L 20 20 L 22 20 L 22 0 L 20 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 14 14)\"/>"
  },
  "BookmarkProperty1Book": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 7 15.019 L 2.8 16.821 C 2.133 17.105 1.5 17.051 0.9 16.659 C 0.3 16.267 0 15.712 0 14.994 L 0 2.003 C 0 1.452 0.196 0.98 0.587 0.588 C 0.979 0.196 1.45 0 2 0 L 12 0 C 12.55 0 13.021 0.196 13.413 0.588 C 13.804 0.98 14 1.452 14 2.003 L 14 14.994 C 14 15.712 13.7 16.267 13.1 16.659 C 12.5 17.051 11.867 17.105 11.2 16.821 L 7 15.019 Z M 7 12.816 L 12 14.969 L 12 2.003 L 2 2.003 L 2 14.969 L 7 12.816 Z M 7 2.003 L 2 2.003 L 12 2.003 L 7 2.003 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 3)\"/>"
  },
  "BookmarkProperty1Marked": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 7 15.019 L 2.8 16.821 C 2.133 17.105 1.5 17.051 0.9 16.659 C 0.3 16.267 0 15.712 0 14.994 L 0 2.003 C 0 1.452 0.196 0.98 0.588 0.588 C 0.979 0.196 1.45 0 2 0 L 12 0 C 12.55 0 13.021 0.196 13.413 0.588 C 13.804 0.98 14 1.452 14 2.003 L 14 14.994 C 14 15.712 13.7 16.267 13.1 16.659 C 12.5 17.051 11.867 17.105 11.2 16.821 L 7 15.019 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 3)\"/>"
  },
  "ChevronDown": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 0.707 -0.707 C 0.317 -1.098 -0.317 -1.098 -0.707 -0.707 C -1.098 -0.317 -1.098 0.317 -0.707 0.707 L 0 0 L 0.707 -0.707 Z M 6 6 L 5.293 6.707 C 5.683 7.098 6.317 7.098 6.707 6.707 L 6 6 Z M 12.707 0.707 C 13.098 0.317 13.098 -0.317 12.707 -0.707 C 12.317 -1.098 11.683 -1.098 11.293 -0.707 L 12 0 L 12.707 0.707 Z M 0 0 L -0.707 0.707 L 5.293 6.707 L 6 6 L 6.707 5.293 L 0.707 -0.707 L 0 0 Z M 6 6 L 6.707 6.707 L 12.707 0.707 L 12 0 L 11.293 -0.707 L 5.293 5.293 L 6 6 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6 9)\"/>"
  },
  "ChevronRightSize16": {
    viewBox: "0 0 16 16",
    body: "<path d=\"M -0.566 7.434 C -0.878 7.747 -0.878 8.253 -0.566 8.566 C -0.253 8.878 0.253 8.878 0.566 8.566 L 0 8 L -0.566 7.434 Z M 4 4 L 4.566 4.566 C 4.878 4.253 4.878 3.747 4.566 3.434 L 4 4 Z M 0.566 -0.566 C 0.253 -0.878 -0.253 -0.878 -0.566 -0.566 C -0.878 -0.253 -0.878 0.253 -0.566 0.566 L 0 0 L 0.566 -0.566 Z M 0 8 L 0.566 8.566 L 4.566 4.566 L 4 4 L 3.434 3.434 L -0.566 7.434 L 0 8 Z M 4 4 L 4.566 3.434 L 0.566 -0.566 L 0 0 L -0.566 0.566 L 3.434 4.566 L 4 4 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6 4)\"/>"
  },
  "ChevronRightSize20": {
    viewBox: "0 0 20 20",
    body: "<path d=\"M -0.707 9.293 C -1.098 9.683 -1.098 10.317 -0.707 10.707 C -0.317 11.098 0.317 11.098 0.707 10.707 L 0 10 L -0.707 9.293 Z M 5 5 L 5.707 5.707 C 6.098 5.317 6.098 4.683 5.707 4.293 L 5 5 Z M 0.707 -0.707 C 0.317 -1.098 -0.317 -1.098 -0.707 -0.707 C -1.098 -0.317 -1.098 0.317 -0.707 0.707 L 0 0 L 0.707 -0.707 Z M 0 10 L 0.707 10.707 L 5.707 5.707 L 5 5 L 4.293 4.293 L -0.707 9.293 L 0 10 Z M 5 5 L 5.707 4.293 L 0.707 -0.707 L 0 0 L -0.707 0.707 L 4.293 5.707 L 5 5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 7.500 5)\"/>"
  },
  "ChevronRightSize24": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M -0.884 11.116 C -1.372 11.604 -1.372 12.396 -0.884 12.884 C -0.396 13.372 0.396 13.372 0.884 12.884 L 0 12 L -0.884 11.116 Z M 6 6 L 6.884 6.884 C 7.372 6.396 7.372 5.604 6.884 5.116 L 6 6 Z M 0.884 -0.884 C 0.396 -1.372 -0.396 -1.372 -0.884 -0.884 C -1.372 -0.396 -1.372 0.396 -0.884 0.884 L 0 0 L 0.884 -0.884 Z M 0 12 L 0.884 12.884 L 6.884 6.884 L 6 6 L 5.116 5.116 L -0.884 11.116 L 0 12 Z M 6 6 L 6.884 5.116 L 0.884 -0.884 L 0 0 L -0.884 0.884 L 5.116 6.884 L 6 6 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 9 6)\"/>"
  },
  "ChevronRightSize32": {
    viewBox: "0 0 32 32",
    body: "<path d=\"M -1.061 14.939 C -1.646 15.525 -1.646 16.475 -1.061 17.061 C -0.475 17.646 0.475 17.646 1.061 17.061 L 0 16 L -1.061 14.939 Z M 8 8 L 9.061 9.061 C 9.646 8.475 9.646 7.525 9.061 6.939 L 8 8 Z M 1.061 -1.061 C 0.475 -1.646 -0.475 -1.646 -1.061 -1.061 C -1.646 -0.475 -1.646 0.475 -1.061 1.061 L 0 0 L 1.061 -1.061 Z M 0 16 L 1.061 17.061 L 9.061 9.061 L 8 8 L 6.939 6.939 L -1.061 14.939 L 0 16 Z M 8 8 L 9.061 6.939 L 1.061 -1.061 L 0 0 L -1.061 1.061 L 6.939 9.061 L 8 8 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 12 8)\"/>"
  },
  "ChevronRightSize40": {
    viewBox: "0 0 40 40",
    body: "<path d=\"M -1.237 18.763 C -1.921 19.446 -1.921 20.554 -1.237 21.237 C -0.554 21.921 0.554 21.921 1.237 21.237 L 0 20 L -1.237 18.763 Z M 10 10 L 11.237 11.237 C 11.921 10.554 11.921 9.446 11.237 8.763 L 10 10 Z M 1.237 -1.237 C 0.554 -1.921 -0.554 -1.921 -1.237 -1.237 C -1.921 -0.554 -1.921 0.554 -1.237 1.237 L 0 0 L 1.237 -1.237 Z M 0 20 L 1.237 21.237 L 11.237 11.237 L 10 10 L 8.763 8.763 L -1.237 18.763 L 0 20 Z M 10 10 L 11.237 8.763 L 1.237 -1.237 L 0 0 L -1.237 1.237 L 8.763 11.237 L 10 10 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 15 10)\"/>"
  },
  "ChevronRightSize48": {
    viewBox: "0 0 48 48",
    body: "<path d=\"M -1.414 22.586 C -2.195 23.367 -2.195 24.633 -1.414 25.414 C -0.633 26.195 0.633 26.195 1.414 25.414 L 0 24 L -1.414 22.586 Z M 12 12 L 13.414 13.414 C 14.195 12.633 14.195 11.367 13.414 10.586 L 12 12 Z M 1.414 -1.414 C 0.633 -2.195 -0.633 -2.195 -1.414 -1.414 C -2.195 -0.633 -2.195 0.633 -1.414 1.414 L 0 0 L 1.414 -1.414 Z M 0 24 L 1.414 25.414 L 13.414 13.414 L 12 12 L 10.586 10.586 L -1.414 22.586 L 0 24 Z M 12 12 L 13.414 10.586 L 1.414 -1.414 L 0 0 L -1.414 1.414 L 10.586 13.414 L 12 12 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 18 12)\"/>"
  },
  "HelpCircle": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 6.147 6.668 C 5.963 7.189 6.237 7.76 6.758 7.943 C 7.279 8.127 7.85 7.853 8.033 7.332 L 7.09 7 L 6.147 6.668 Z M 12.92 8 L 11.92 7.999 L 11.92 8 L 12.92 8 Z M 9.604 10.051 C 9.08 10.226 8.797 10.792 8.971 11.316 C 9.146 11.84 9.712 12.123 10.236 11.949 L 9.92 11 L 9.604 10.051 Z M 10 14 C 9.448 14 9 14.448 9 15 C 9 15.552 9.448 16 10 16 L 10 15 L 10 14 Z M 10.01 16 C 10.562 16 11.01 15.552 11.01 15 C 11.01 14.448 10.562 14 10.01 14 L 10.01 15 L 10.01 16 Z M 20 10 L 19 10 C 19 14.971 14.971 19 10 19 L 10 20 L 10 21 C 16.075 21 21 16.075 21 10 L 20 10 Z M 10 20 L 10 19 C 5.029 19 1 14.971 1 10 L 0 10 L -1 10 C -1 16.075 3.925 21 10 21 L 10 20 Z M 0 10 L 1 10 C 1 5.029 5.029 1 10 1 L 10 0 L 10 -1 C 3.925 -1 -1 3.925 -1 10 L 0 10 Z M 10 0 L 10 1 C 14.971 1 19 5.029 19 10 L 20 10 L 21 10 C 21 3.925 16.075 -1 10 -1 L 10 0 Z M 7.09 7 L 8.033 7.332 C 8.19 6.886 8.499 6.511 8.907 6.271 L 8.4 5.409 L 7.893 4.547 C 7.079 5.026 6.46 5.777 6.147 6.668 L 7.09 7 Z M 8.4 5.409 L 8.907 6.271 C 9.314 6.032 9.793 5.944 10.258 6.024 L 10.427 5.039 L 10.596 4.053 C 9.665 3.893 8.708 4.068 7.893 4.547 L 8.4 5.409 Z M 10.427 5.039 L 10.258 6.024 C 10.724 6.104 11.146 6.346 11.45 6.708 L 12.215 6.064 L 12.98 5.42 C 12.372 4.697 11.527 4.213 10.596 4.053 L 10.427 5.039 Z M 12.215 6.064 L 11.45 6.708 C 11.754 7.069 11.921 7.526 11.92 7.999 L 12.92 8 L 13.92 8.001 C 13.921 7.057 13.588 6.142 12.98 5.42 L 12.215 6.064 Z M 12.92 8 L 11.92 8 C 11.92 8.469 11.555 8.958 10.865 9.418 C 10.551 9.628 10.229 9.789 9.983 9.899 C 9.861 9.953 9.76 9.993 9.693 10.019 C 9.659 10.031 9.634 10.041 9.619 10.046 C 9.611 10.049 9.606 10.051 9.603 10.051 C 9.602 10.052 9.601 10.052 9.601 10.052 C 9.601 10.052 9.602 10.052 9.602 10.052 C 9.602 10.052 9.603 10.052 9.603 10.052 C 9.603 10.052 9.603 10.052 9.603 10.051 C 9.604 10.051 9.604 10.051 9.92 11 C 10.236 11.949 10.237 11.949 10.237 11.948 C 10.237 11.948 10.237 11.948 10.237 11.948 C 10.238 11.948 10.238 11.948 10.239 11.948 C 10.24 11.947 10.241 11.947 10.243 11.946 C 10.246 11.945 10.25 11.944 10.254 11.943 C 10.263 11.94 10.274 11.936 10.289 11.93 C 10.317 11.92 10.357 11.906 10.405 11.888 C 10.502 11.851 10.636 11.797 10.795 11.726 C 11.111 11.586 11.539 11.372 11.975 11.082 C 12.785 10.542 13.92 9.531 13.92 8 L 12.92 8 Z M 10 15 L 10 16 L 10.01 16 L 10.01 15 L 10.01 14 L 10 14 L 10 15 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 2)\"/>"
  },
  "IconsAdd": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 6 8 L 1 8 C 0.717 8 0.479 7.904 0.288 7.712 C 0.097 7.52 0.001 7.283 0 7 C -0.001 6.717 0.095 6.48 0.288 6.288 C 0.481 6.096 0.718 6 1 6 L 6 6 L 6 1 C 6 0.717 6.096 0.479 6.288 0.288 C 6.48 0.097 6.717 0.001 7 0 C 7.283 -0.001 7.52 0.095 7.713 0.288 C 7.906 0.481 8.001 0.718 8 1 L 8 6 L 13 6 C 13.283 6 13.521 6.096 13.713 6.288 C 13.905 6.48 14.001 6.717 14 7 C 13.999 7.283 13.903 7.52 13.712 7.713 C 13.521 7.906 13.283 8.001 13 8 L 8 8 L 8 13 C 8 13.283 7.904 13.521 7.712 13.713 C 7.52 13.905 7.283 14.001 7 14 C 6.717 13.999 6.48 13.903 6.288 13.712 C 6.096 13.521 6 13.283 6 13 L 6 8 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 5)\"/>"
  },
  "IconsArticle": {
    viewBox: "0 0 20 20",
    body: "<path d=\"M 2.595 17.946 L 11.484 17.946 C 13.217 17.946 14.079 17.068 14.079 15.326 L 14.079 7.726 L 8.019 7.726 C 6.948 7.726 6.445 7.215 6.445 6.144 L 6.445 0 L 2.595 0 C 0.871 0 0 0.887 0 2.629 L 0 15.326 C 0 17.076 0.871 17.946 2.595 17.946 Z M 8.044 6.579 L 13.987 6.579 C 13.929 6.236 13.686 5.901 13.293 5.491 L 8.672 0.795 C 8.287 0.394 7.935 0.151 7.584 0.092 L 7.584 6.128 C 7.584 6.429 7.743 6.579 8.044 6.579 Z M 3.817 11.351 C 3.474 11.351 3.231 11.108 3.231 10.781 C 3.231 10.455 3.474 10.212 3.817 10.212 L 10.27 10.212 C 10.605 10.212 10.865 10.455 10.865 10.781 C 10.865 11.108 10.605 11.35 10.271 11.35 L 3.817 11.351 Z M 3.817 14.54 C 3.474 14.54 3.231 14.297 3.231 13.97 C 3.231 13.644 3.474 13.401 3.817 13.401 L 10.27 13.401 C 10.605 13.401 10.865 13.644 10.865 13.97 C 10.865 14.297 10.605 14.54 10.271 14.54 L 3.817 14.54 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.960 1.027)\"/>"
  },
  "IconsCalendar": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 2 20 C 1.45 20 0.979 19.804 0.588 19.413 C 0.196 19.021 0 18.55 0 18 L 0 4 C 0 3.45 0.196 2.979 0.588 2.588 C 0.979 2.196 1.45 2 2 2 L 3 2 L 3 1 C 3 0.717 3.096 0.479 3.288 0.287 C 3.479 0.096 3.717 0 4 0 C 4.283 0 4.521 0.096 4.713 0.287 C 4.904 0.479 5 0.717 5 1 L 5 2 L 13 2 L 13 1 C 13 0.717 13.096 0.479 13.288 0.287 C 13.479 0.096 13.717 0 14 0 C 14.283 0 14.521 0.096 14.713 0.287 C 14.904 0.479 15 0.717 15 1 L 15 2 L 16 2 C 16.55 2 17.021 2.196 17.413 2.588 C 17.804 2.979 18 3.45 18 4 L 18 18 C 18 18.55 17.804 19.021 17.413 19.413 C 17.021 19.804 16.55 20 16 20 L 2 20 Z M 2 18 L 16 18 L 16 8 L 2 8 L 2 18 Z M 2 6 L 16 6 L 16 4 L 2 4 L 2 6 Z M 9 12 C 8.717 12 8.479 11.904 8.288 11.713 C 8.096 11.521 8 11.283 8 11 C 8 10.717 8.096 10.479 8.288 10.288 C 8.479 10.096 8.717 10 9 10 C 9.283 10 9.521 10.096 9.713 10.288 C 9.904 10.479 10 10.717 10 11 C 10 11.283 9.904 11.521 9.713 11.713 C 9.521 11.904 9.283 12 9 12 Z M 5 12 C 4.717 12 4.479 11.904 4.287 11.713 C 4.096 11.521 4 11.283 4 11 C 4 10.717 4.096 10.479 4.287 10.288 C 4.479 10.096 4.717 10 5 10 C 5.283 10 5.521 10.096 5.713 10.288 C 5.904 10.479 6 10.717 6 11 C 6 11.283 5.904 11.521 5.713 11.713 C 5.521 11.904 5.283 12 5 12 Z M 13 12 C 12.717 12 12.479 11.904 12.288 11.713 C 12.096 11.521 12 11.283 12 11 C 12 10.717 12.096 10.479 12.288 10.288 C 12.479 10.096 12.717 10 13 10 C 13.283 10 13.521 10.096 13.713 10.288 C 13.904 10.479 14 10.717 14 11 C 14 11.283 13.904 11.521 13.713 11.713 C 13.521 11.904 13.283 12 13 12 Z M 9 16 C 8.717 16 8.479 15.904 8.288 15.713 C 8.096 15.521 8 15.283 8 15 C 8 14.717 8.096 14.479 8.288 14.288 C 8.479 14.096 8.717 14 9 14 C 9.283 14 9.521 14.096 9.713 14.288 C 9.904 14.479 10 14.717 10 15 C 10 15.283 9.904 15.521 9.713 15.713 C 9.521 15.904 9.283 16 9 16 Z M 5 16 C 4.717 16 4.479 15.904 4.287 15.713 C 4.096 15.521 4 15.283 4 15 C 4 14.717 4.096 14.479 4.287 14.288 C 4.479 14.096 4.717 14 5 14 C 5.283 14 5.521 14.096 5.713 14.288 C 5.904 14.479 6 14.717 6 15 C 6 15.283 5.904 15.521 5.713 15.713 C 5.521 15.904 5.283 16 5 16 Z M 13 16 C 12.717 16 12.479 15.904 12.288 15.713 C 12.096 15.521 12 15.283 12 15 C 12 14.717 12.096 14.479 12.288 14.288 C 12.479 14.096 12.717 14 13 14 C 13.283 14 13.521 14.096 13.713 14.288 C 13.904 14.479 14 14.717 14 15 C 14 15.283 13.904 15.521 13.713 15.713 C 13.521 15.904 13.283 16 13 16 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 2)\"/>"
  },
  "IconsCamera": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 7.778 18 L 12.222 18 C 15.343 18 16.904 18 18.025 17.265 C 18.509 16.948 18.925 16.539 19.251 16.061 C 20 14.961 20 13.428 20 10.364 C 20 7.3 20 5.767 19.251 4.667 C 18.925 4.189 18.509 3.78 18.025 3.463 C 17.305 2.99 16.403 2.821 15.022 2.761 C 14.363 2.761 13.796 2.271 13.667 1.636 C 13.568 1.171 13.312 0.754 12.942 0.456 C 12.571 0.158 12.109 -0.003 11.634 0 L 8.366 0 C 7.378 0 6.527 0.685 6.333 1.636 C 6.204 2.271 5.637 2.761 4.978 2.761 C 3.598 2.821 2.696 2.991 1.975 3.463 C 1.492 3.78 1.075 4.189 0.75 4.667 C 0 5.767 0 7.299 0 10.364 C 0 13.429 0 14.96 0.749 16.061 C 1.073 16.537 1.489 16.946 1.975 17.265 C 3.096 18 4.657 18 7.778 18 Z M 10 6.273 C 7.699 6.273 5.833 8.104 5.833 10.363 C 5.833 12.622 7.7 14.456 10 14.456 C 12.3 14.456 14.167 12.624 14.167 10.365 C 14.167 8.106 12.3 6.273 10 6.273 Z M 10 7.909 C 8.62 7.909 7.5 9.008 7.5 10.364 C 7.5 11.719 8.62 12.818 10 12.818 C 11.38 12.818 12.5 11.719 12.5 10.364 C 12.5 9.009 11.38 7.909 10 7.909 Z M 14.722 7.091 C 14.722 6.639 15.095 6.273 15.556 6.273 L 16.666 6.273 C 17.126 6.273 17.5 6.639 17.5 7.091 C 17.498 7.31 17.409 7.519 17.253 7.672 C 17.097 7.826 16.886 7.911 16.667 7.909 L 15.556 7.909 C 15.448 7.91 15.34 7.89 15.239 7.849 C 15.139 7.809 15.047 7.749 14.97 7.673 C 14.892 7.597 14.83 7.506 14.788 7.407 C 14.745 7.307 14.723 7.2 14.722 7.091 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 2 3)\"/>"
  },
  "IconsCard": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 2.625 0 L 2.625 0.5 L 16.875 0.5 L 16.875 0 L 16.875 -0.5 L 2.625 -0.5 L 2.625 0 Z M 16.875 0 L 16.875 0.5 C 18.049 0.5 19 1.451 19 2.625 L 19.5 2.625 L 20 2.625 C 20 0.899 18.601 -0.5 16.875 -0.5 L 16.875 0 Z M 19.5 2.625 L 19 2.625 L 19 12.375 L 19.5 12.375 L 20 12.375 L 20 2.625 L 19.5 2.625 Z M 19.5 12.375 L 19 12.375 C 19 13.549 18.049 14.5 16.875 14.5 L 16.875 15 L 16.875 15.5 C 18.601 15.5 20 14.101 20 12.375 L 19.5 12.375 Z M 16.875 15 L 16.875 14.5 L 2.625 14.5 L 2.625 15 L 2.625 15.5 L 16.875 15.5 L 16.875 15 Z M 2.625 15 L 2.625 14.5 C 1.451 14.5 0.5 13.549 0.5 12.375 L 0 12.375 L -0.5 12.375 C -0.5 14.101 0.899 15.5 2.625 15.5 L 2.625 15 Z M 0 12.375 L 0.5 12.375 L 0.5 2.625 L 0 2.625 L -0.5 2.625 L -0.5 12.375 L 0 12.375 Z M 0 2.625 L 0.5 2.625 C 0.5 1.451 1.451 0.5 2.625 0.5 L 2.625 0 L 2.625 -0.5 C 0.899 -0.5 -0.5 0.899 -0.5 2.625 L 0 2.625 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 4.500)\"/><path d=\"M 3.75 5.063 L 3.75 4.125 C 3.232 4.125 2.813 4.545 2.813 5.063 L 3.75 5.063 Z M 6 5.063 L 6.938 5.063 C 6.938 4.545 6.518 4.125 6 4.125 L 6 5.063 Z M 6 6 L 6 6.938 C 6.518 6.938 6.938 6.518 6.938 6 L 6 6 Z M 3.75 6 L 2.813 6 C 2.813 6.518 3.232 6.938 3.75 6.938 L 3.75 6 Z M 0 0 L 0 0.938 L 19.5 0.938 L 19.5 0 L 19.5 -0.938 L 0 -0.938 L 0 0 Z M 3.75 5.063 L 3.75 6 L 6 6 L 6 5.063 L 6 4.125 L 3.75 4.125 L 3.75 5.063 Z M 6 5.063 L 5.063 5.063 L 5.063 6 L 6 6 L 6.938 6 L 6.938 5.063 L 6 5.063 Z M 6 6 L 6 5.063 L 3.75 5.063 L 3.75 6 L 3.75 6.938 L 6 6.938 L 6 6 Z M 3.75 6 L 4.688 6 L 4.688 5.063 L 3.75 5.063 L 2.813 5.063 L 2.813 6 L 3.75 6 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.250 9)\"/>"
  },
  "IconsCheck": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 5.288 8.775 L 13.763 0.3 C 13.963 0.1 14.197 0 14.463 0 C 14.73 0 14.963 0.1 15.163 0.3 C 15.363 0.5 15.463 0.738 15.463 1.013 C 15.463 1.288 15.363 1.526 15.163 1.725 L 5.988 10.925 C 5.788 11.125 5.555 11.225 5.288 11.225 C 5.022 11.225 4.788 11.125 4.588 10.925 L 0.288 6.625 C 0.088 6.425 -0.008 6.188 0 5.913 C 0.008 5.638 0.113 5.401 0.313 5.2 C 0.514 4.999 0.752 4.899 1.026 4.9 C 1.301 4.901 1.538 5.001 1.738 5.2 L 5.288 8.775 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4.262 6.375)\"/>"
  },
  "IconsClock": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 18 9 L 16.75 9 C 16.75 13.28 13.28 16.75 9 16.75 L 9 18 L 9 19.25 C 14.661 19.25 19.25 14.661 19.25 9 L 18 9 Z M 9 18 L 9 16.75 C 4.72 16.75 1.25 13.28 1.25 9 L 0 9 L -1.25 9 C -1.25 14.661 3.339 19.25 9 19.25 L 9 18 Z M 0 9 L 1.25 9 C 1.25 4.72 4.72 1.25 9 1.25 L 9 0 L 9 -1.25 C 3.339 -1.25 -1.25 3.339 -1.25 9 L 0 9 Z M 9 0 L 9 1.25 C 13.28 1.25 16.75 4.72 16.75 9 L 18 9 L 19.25 9 C 19.25 3.339 14.661 -1.25 9 -1.25 L 9 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/><path d=\"M 1.25 0 C 1.25 -0.69 0.69 -1.25 0 -1.25 C -0.69 -1.25 -1.25 -0.69 -1.25 0 L 0 0 L 1.25 0 Z M 0 5 L -1.25 5 C -1.25 5.69 -0.69 6.25 0 6.25 L 0 5 Z M 5 6.25 C 5.69 6.25 6.25 5.69 6.25 5 C 6.25 4.31 5.69 3.75 5 3.75 L 5 5 L 5 6.25 Z M 0 0 L -1.25 0 L -1.25 5 L 0 5 L 1.25 5 L 1.25 0 L 0 0 Z M 0 5 L 0 6.25 L 5 6.25 L 5 5 L 5 3.75 L 0 3.75 L 0 5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3) matrix(1 0 0 1 8 5)\"/>"
  },
  "IconsClose": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 6.575 7.975 L 1.675 12.875 C 1.492 13.058 1.258 13.15 0.975 13.15 C 0.692 13.15 0.458 13.058 0.275 12.875 C 0.092 12.692 0 12.458 0 12.175 C 0 11.892 0.092 11.658 0.275 11.475 L 5.175 6.575 L 0.275 1.675 C 0.092 1.492 0 1.258 0 0.975 C 0 0.692 0.092 0.458 0.275 0.275 C 0.458 0.092 0.692 0 0.975 0 C 1.258 0 1.492 0.092 1.675 0.275 L 6.575 5.175 L 11.475 0.275 C 11.658 0.092 11.892 0 12.175 0 C 12.458 0 12.692 0.092 12.875 0.275 C 13.058 0.458 13.15 0.692 13.15 0.975 C 13.15 1.258 13.058 1.492 12.875 1.675 L 7.975 6.575 L 12.875 11.475 C 13.058 11.658 13.15 11.892 13.15 12.175 C 13.15 12.458 13.058 12.692 12.875 12.875 C 12.692 13.058 12.458 13.15 12.175 13.15 C 11.892 13.15 11.658 13.058 11.475 12.875 L 6.575 7.975 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5.425 5.425)\"/>"
  },
  "IconsComment": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 7 20 C 6.735 20 6.48 19.895 6.293 19.707 C 6.105 19.52 6 19.265 6 19 L 6 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 0 2 C 0 1.47 0.211 0.961 0.586 0.586 C 0.961 0.211 1.47 0 2 0 L 18 0 C 18.53 0 19.039 0.211 19.414 0.586 C 19.789 0.961 20 1.47 20 2 L 20 14 C 20 14.53 19.789 15.039 19.414 15.414 C 19.039 15.789 18.53 16 18 16 L 11.9 16 L 8.2 19.71 C 8 19.9 7.75 20 7.5 20 L 7 20 Z M 8 14 L 8 17.08 L 11.08 14 L 18 14 L 18 2 L 2 2 L 2 14 L 8 14 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 2)\"/>"
  },
  "IconsDown": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 5.575 6.55 C 5.442 6.55 5.317 6.529 5.2 6.488 C 5.083 6.446 4.975 6.375 4.875 6.275 L 0.275 1.675 C 0.092 1.492 0 1.258 0 0.975 C 0 0.692 0.092 0.458 0.275 0.275 C 0.458 0.092 0.692 0 0.975 0 C 1.258 0 1.492 0.092 1.675 0.275 L 5.575 4.175 L 9.475 0.275 C 9.658 0.092 9.892 0 10.175 0 C 10.458 0 10.692 0.092 10.875 0.275 C 11.058 0.458 11.15 0.692 11.15 0.975 C 11.15 1.258 11.058 1.492 10.875 1.675 L 6.275 6.275 C 6.175 6.375 6.067 6.446 5.95 6.488 C 5.833 6.529 5.708 6.55 5.575 6.55 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6.425 8.425)\"/>"
  },
  "IconsEdit": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 2 16 L 3.425 16 L 13.2 6.225 L 11.775 4.8 L 2 14.575 L 2 16 Z M 0 18 L 0 13.75 L 13.2 0.575 C 13.4 0.392 13.621 0.25 13.863 0.15 C 14.105 0.05 14.359 0 14.625 0 C 14.891 0 15.149 0.05 15.4 0.15 C 15.651 0.25 15.867 0.4 16.05 0.6 L 17.425 2 C 17.625 2.183 17.771 2.4 17.863 2.65 C 17.955 2.9 18.001 3.15 18 3.4 C 18 3.667 17.954 3.921 17.863 4.163 C 17.772 4.405 17.626 4.626 17.425 4.825 L 4.25 18 L 0 18 Z M 12.475 5.525 L 11.775 4.8 L 13.2 6.225 L 12.475 5.525 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 3)\"/>"
  },
  "IconsLock": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 8 16 C 8.53 16 9.039 15.789 9.414 15.414 C 9.789 15.039 10 14.53 10 14 C 10 13.47 9.789 12.961 9.414 12.586 C 9.039 12.211 8.53 12 8 12 C 7.47 12 6.961 12.211 6.586 12.586 C 6.211 12.961 6 13.47 6 14 C 6 14.53 6.211 15.039 6.586 15.414 C 6.961 15.789 7.47 16 8 16 Z M 14 7 C 14.53 7 15.039 7.211 15.414 7.586 C 15.789 7.961 16 8.47 16 9 L 16 19 C 16 19.53 15.789 20.039 15.414 20.414 C 15.039 20.789 14.53 21 14 21 L 2 21 C 1.47 21 0.961 20.789 0.586 20.414 C 0.211 20.039 0 19.53 0 19 L 0 9 C 0 8.47 0.211 7.961 0.586 7.586 C 0.961 7.211 1.47 7 2 7 L 3 7 L 3 5 C 3 3.674 3.527 2.402 4.464 1.464 C 5.402 0.527 6.674 0 8 0 C 8.657 0 9.307 0.129 9.913 0.381 C 10.52 0.632 11.071 1 11.536 1.464 C 12 1.929 12.368 2.48 12.619 3.087 C 12.871 3.693 13 4.343 13 5 L 13 7 L 14 7 Z M 8 2 C 7.204 2 6.441 2.316 5.879 2.879 C 5.316 3.441 5 4.204 5 5 L 5 7 L 11 7 L 11 5 C 11 4.204 10.684 3.441 10.121 2.879 C 9.559 2.316 8.796 2 8 2 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 1)\"/>"
  },
  "IconsMenu": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 1 12 C 0.717 12 0.479 11.904 0.288 11.712 C 0.097 11.52 0.001 11.283 0 11 C -0.001 10.717 0.095 10.48 0.288 10.288 C 0.481 10.096 0.718 10 1 10 L 17 10 C 17.283 10 17.521 10.096 17.713 10.288 C 17.905 10.48 18.001 10.717 18 11 C 17.999 11.283 17.903 11.52 17.712 11.713 C 17.521 11.906 17.283 12.001 17 12 L 1 12 Z M 1 7 C 0.717 7 0.479 6.904 0.288 6.712 C 0.097 6.52 0.001 6.283 0 6 C -0.001 5.717 0.095 5.48 0.288 5.288 C 0.481 5.096 0.718 5 1 5 L 17 5 C 17.283 5 17.521 5.096 17.713 5.288 C 17.905 5.48 18.001 5.717 18 6 C 17.999 6.283 17.903 6.52 17.712 6.713 C 17.521 6.906 17.283 7.001 17 7 L 1 7 Z M 1 2 C 0.717 2 0.479 1.904 0.288 1.712 C 0.097 1.52 0.001 1.283 0 1 C -0.001 0.717 0.095 0.48 0.288 0.288 C 0.481 0.096 0.718 0 1 0 L 17 0 C 17.283 0 17.521 0.096 17.713 0.288 C 17.905 0.48 18.001 0.717 18 1 C 17.999 1.283 17.903 1.52 17.712 1.713 C 17.521 1.906 17.283 2.001 17 2 L 1 2 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 6)\"/>"
  },
  "IconsNotification": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 0.518 0.114 L 0.506 0.116 L 0.435 0.151 L 0.415 0.155 L 0.401 0.151 L 0.33 0.115 C 0.319 0.112 0.311 0.114 0.306 0.121 L 0.302 0.131 L 0.285 0.559 L 0.29 0.579 L 0.3 0.592 L 0.404 0.666 L 0.419 0.67 L 0.431 0.666 L 0.535 0.592 L 0.547 0.576 L 0.551 0.559 L 0.534 0.132 C 0.531 0.121 0.526 0.115 0.518 0.114 Z M 0.782 0.001 L 0.768 0.003 L 0.584 0.096 L 0.574 0.106 L 0.571 0.117 L 0.589 0.547 L 0.594 0.559 L 0.602 0.567 L 0.803 0.659 C 0.816 0.662 0.825 0.66 0.832 0.651 L 0.836 0.637 L 0.802 0.023 C 0.799 0.01 0.792 0.003 0.782 0.001 Z M 0.067 0.003 C 0.063 0 0.057 -0.001 0.052 0 C 0.047 0.002 0.043 0.005 0.04 0.009 L 0.034 0.023 L 0 0.637 C 0.001 0.649 0.006 0.657 0.017 0.661 L 0.032 0.659 L 0.233 0.566 L 0.243 0.558 L 0.246 0.547 L 0.264 0.117 L 0.261 0.105 L 0.251 0.095 L 0.067 0.003 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.062 2) matrix(1 0 0 1 9.014 21.144)\"/><path d=\"M 1.938 7 C 1.938 5.143 2.676 3.363 3.988 2.05 C 5.301 0.737 7.082 0 8.938 0 C 10.795 0 12.575 0.737 13.888 2.05 C 15.201 3.363 15.938 5.143 15.938 7 L 15.938 10.764 L 17.76 14.408 C 17.844 14.576 17.884 14.762 17.875 14.949 C 17.867 15.137 17.811 15.319 17.712 15.478 C 17.613 15.638 17.476 15.77 17.312 15.861 C 17.148 15.952 16.964 16 16.776 16 L 12.812 16 C 12.59 16.858 12.089 17.618 11.387 18.161 C 10.686 18.704 9.825 18.998 8.938 18.998 C 8.052 18.998 7.19 18.704 6.489 18.161 C 5.788 17.618 5.287 16.858 5.064 16 L 1.1 16 C 0.913 16 0.728 15.952 0.564 15.861 C 0.401 15.77 0.263 15.638 0.164 15.478 C 0.066 15.319 0.01 15.137 0.001 14.949 C -0.007 14.762 0.032 14.576 0.116 14.408 L 1.938 10.764 L 1.938 7 Z M 7.206 16 C 7.382 16.304 7.634 16.556 7.938 16.732 C 8.242 16.908 8.587 17 8.938 17 C 9.289 17 9.634 16.908 9.938 16.732 C 10.242 16.556 10.495 16.304 10.67 16 L 7.206 16 Z M 8.938 2 C 7.612 2 6.34 2.527 5.403 3.464 C 4.465 4.402 3.938 5.674 3.938 7 L 3.938 10.764 C 3.938 11.074 3.866 11.38 3.727 11.658 L 2.557 14 L 15.32 14 L 14.15 11.658 C 14.011 11.38 13.938 11.074 13.938 10.764 L 13.938 7 C 13.938 5.674 13.411 4.402 12.474 3.464 C 11.536 2.527 10.264 2 8.938 2 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 3.062 2)\"/>"
  },
  "IconsPercent": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 3.5 7 C 2.533 7 1.708 6.658 1.025 5.975 C 0.342 5.292 0 4.467 0 3.5 C 0 2.533 0.342 1.708 1.025 1.025 C 1.708 0.342 2.533 0 3.5 0 C 4.467 0 5.292 0.342 5.975 1.025 C 6.658 1.708 7 2.533 7 3.5 C 7 4.467 6.658 5.292 5.975 5.975 C 5.292 6.658 4.467 7 3.5 7 Z M 3.5 5 C 3.917 5 4.271 4.854 4.563 4.563 C 4.855 4.272 5.001 3.917 5 3.5 C 4.999 3.083 4.854 2.729 4.563 2.438 C 4.272 2.147 3.918 2.001 3.5 2 C 3.082 1.999 2.728 2.145 2.438 2.438 C 2.148 2.731 2.002 3.085 2 3.5 C 1.998 3.915 2.144 4.269 2.438 4.563 C 2.732 4.857 3.086 5.003 3.5 5 Z M 12.5 16 C 11.533 16 10.708 15.658 10.025 14.975 C 9.342 14.292 9 13.467 9 12.5 C 9 11.533 9.342 10.708 10.025 10.025 C 10.708 9.342 11.533 9 12.5 9 C 13.467 9 14.292 9.342 14.975 10.025 C 15.658 10.708 16 11.533 16 12.5 C 16 13.467 15.658 14.292 14.975 14.975 C 14.292 15.658 13.467 16 12.5 16 Z M 12.5 14 C 12.917 14 13.271 13.854 13.563 13.563 C 13.855 13.272 14.001 12.917 14 12.5 C 13.999 12.083 13.854 11.729 13.563 11.438 C 13.272 11.147 12.918 11.001 12.5 11 C 12.082 10.999 11.728 11.145 11.438 11.438 C 11.148 11.731 11.002 12.085 11 12.5 C 10.998 12.915 11.144 13.269 11.438 13.563 C 11.732 13.857 12.086 14.003 12.5 14 Z M 0.7 15.3 C 0.517 15.117 0.425 14.883 0.425 14.6 C 0.425 14.317 0.517 14.083 0.7 13.9 L 13.9 0.7 C 14.083 0.517 14.317 0.425 14.6 0.425 C 14.883 0.425 15.117 0.517 15.3 0.7 C 15.483 0.883 15.575 1.117 15.575 1.4 C 15.575 1.683 15.483 1.917 15.3 2.1 L 2.1 15.3 C 1.917 15.483 1.683 15.575 1.4 15.575 C 1.117 15.575 0.883 15.483 0.7 15.3 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 4)\"/>"
  },
  "IconsPremium": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 4 18 C 3.717 18 3.479 17.904 3.288 17.712 C 3.097 17.52 3.001 17.283 3 17 C 2.999 16.717 3.095 16.48 3.288 16.288 C 3.481 16.096 3.718 16 4 16 L 16 16 C 16.283 16 16.521 16.096 16.713 16.288 C 16.905 16.48 17.001 16.717 17 17 C 16.999 17.283 16.903 17.52 16.712 17.713 C 16.521 17.906 16.283 18.001 16 18 L 4 18 Z M 4.7 14.5 C 4.217 14.5 3.788 14.342 3.413 14.025 C 3.038 13.708 2.809 13.308 2.725 12.825 L 1.725 6.475 C 1.692 6.475 1.654 6.479 1.613 6.488 C 1.572 6.497 1.534 6.501 1.5 6.5 C 1.083 6.5 0.729 6.354 0.438 6.063 C 0.147 5.772 0.001 5.417 0 5 C -0.001 4.583 0.145 4.229 0.438 3.938 C 0.731 3.647 1.085 3.501 1.5 3.5 C 1.915 3.499 2.27 3.645 2.563 3.938 C 2.856 4.231 3.002 4.585 3 5 C 3 5.117 2.987 5.225 2.962 5.325 C 2.937 5.425 2.908 5.517 2.875 5.6 L 6 7 L 9.125 2.725 C 8.942 2.592 8.792 2.417 8.675 2.2 C 8.558 1.983 8.5 1.75 8.5 1.5 C 8.5 1.083 8.646 0.729 8.938 0.437 C 9.23 0.145 9.584 -0.001 10 0 C 10.416 0.001 10.77 0.147 11.063 0.438 C 11.356 0.729 11.501 1.083 11.5 1.5 C 11.5 1.75 11.442 1.983 11.325 2.2 C 11.208 2.417 11.058 2.592 10.875 2.725 L 14 7 L 17.125 5.6 C 17.092 5.517 17.062 5.425 17.037 5.325 C 17.012 5.225 16.999 5.117 17 5 C 17 4.583 17.146 4.229 17.438 3.937 C 17.73 3.645 18.084 3.499 18.5 3.5 C 18.916 3.501 19.27 3.647 19.563 3.938 C 19.856 4.229 20.001 4.583 20 5 C 19.999 5.417 19.853 5.771 19.563 6.063 C 19.273 6.355 18.919 6.501 18.5 6.5 C 18.467 6.5 18.429 6.496 18.388 6.488 C 18.347 6.48 18.309 6.476 18.275 6.475 L 17.275 12.825 C 17.192 13.308 16.963 13.708 16.588 14.025 C 16.213 14.342 15.784 14.5 15.3 14.5 L 4.7 14.5 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 2)\"/>"
  },
  "IconsProgress": {
    viewBox: "0 0 20 20",
    body: "<path d=\"M 17.926 3.584 C 8.587 17.152 11.784 3.324 3.889 9.941 L 5.684 17 L 3.665 17 L 0 2.59 L 1.85 1.926 C 10.699 -4.545 6.078 7.746 17.487 3.18 C 17.851 3.033 18.142 3.27 17.926 3.584 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1 2.000)\"/>"
  },
  "IconsProtocol": {
    viewBox: "0 0 20 20",
    body: "<path d=\"M 11.312 3.75 L 10.624 3.75 C 10.293 3.75 9.975 3.882 9.74 4.116 C 9.506 4.351 9.374 4.668 9.374 5 L 9.374 7.5 C 9.374 8.163 9.111 8.799 8.642 9.268 C 8.173 9.737 7.537 10 6.874 10 L 6.187 10 C 6.032 10.759 5.601 11.433 4.977 11.892 C 4.353 12.351 3.581 12.562 2.811 12.484 C 2.04 12.406 1.326 12.045 0.807 11.471 C 0.288 10.896 0 10.149 0 9.375 C 0 8.601 0.288 7.854 0.807 7.279 C 1.326 6.705 2.04 6.344 2.811 6.266 C 3.581 6.188 4.353 6.399 4.977 6.858 C 5.601 7.317 6.032 7.991 6.187 8.75 L 6.874 8.75 C 7.206 8.75 7.524 8.618 7.758 8.384 C 7.993 8.149 8.124 7.832 8.124 7.5 L 8.124 5 C 8.124 4.337 8.388 3.701 8.857 3.232 C 9.325 2.763 9.961 2.5 10.624 2.5 L 11.312 2.5 C 11.467 1.741 11.898 1.067 12.522 0.608 C 13.145 0.149 13.917 -0.062 14.688 0.016 C 15.458 0.094 16.172 0.455 16.692 1.029 C 17.211 1.604 17.499 2.351 17.499 3.125 C 17.499 3.899 17.211 4.646 16.692 5.221 C 16.172 5.795 15.458 6.156 14.688 6.234 C 13.917 6.312 13.145 6.101 12.522 5.642 C 11.898 5.183 11.467 4.509 11.312 3.75 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 1.251 3.750)\"/>"
  },
  "IconsRewards": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 14 3 C 14 4.02 12.814 4.92 11 5.462 C 9.866 5.802 8.487 6 7 6 C 5.513 6 4.134 5.801 3 5.462 C 1.187 4.92 0 4.02 0 3 C 0 1.343 3.134 0 7 0 C 10.866 0 14 1.343 14 3 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 5) matrix(1 0 0 1 4 0)\"/><path d=\"M 11 9.462 L 10.714 8.504 L 10.713 8.504 L 11 9.462 Z M 3 9.462 L 2.714 10.42 L 2.714 10.42 L 3 9.462 Z M 11 5.462 L 10.714 4.504 L 10.713 4.504 L 11 5.462 Z M 3 5.462 L 2.714 6.42 L 2.714 6.42 L 3 5.462 Z M 14 3 L 15 3 C 15 2.248 14.64 1.614 14.162 1.13 C 13.688 0.649 13.051 0.263 12.344 -0.041 C 10.925 -0.648 9.035 -1 7 -1 L 7 0 L 7 1 C 8.831 1 10.441 1.32 11.556 1.798 C 12.115 2.037 12.504 2.297 12.738 2.535 C 12.968 2.768 13 2.924 13 3 L 14 3 Z M 7 0 L 7 -1 C 4.965 -1 3.075 -0.648 1.656 -0.041 C 0.949 0.263 0.312 0.649 -0.162 1.13 C -0.64 1.614 -1 2.248 -1 3 L 0 3 L 1 3 C 1 2.924 1.032 2.768 1.262 2.535 C 1.496 2.297 1.885 2.037 2.444 1.798 C 3.559 1.32 5.169 1 7 1 L 7 0 Z M 14 3 L 13 3 L 13 7 L 14 7 L 15 7 L 15 3 L 14 3 Z M 14 7 L 13 7 C 13 7.091 12.949 7.313 12.554 7.631 C 12.165 7.943 11.546 8.255 10.714 8.504 L 11 9.462 L 11.286 10.42 C 12.268 10.127 13.149 9.718 13.806 9.19 C 14.458 8.667 15 7.929 15 7 L 14 7 Z M 11 9.462 L 10.713 8.504 C 9.684 8.813 8.403 9 7 9 L 7 10 L 7 11 C 8.571 11 10.048 10.791 11.287 10.42 L 11 9.462 Z M 7 10 L 7 9 C 5.597 9 4.316 8.812 3.286 8.504 L 3 9.462 L 2.714 10.42 C 3.952 10.79 5.429 11 7 11 L 7 10 Z M 3 9.462 L 3.286 8.504 C 2.455 8.255 1.836 7.943 1.446 7.631 C 1.051 7.313 1 7.091 1 7 L 0 7 L -1 7 C -1 7.929 -0.457 8.667 0.194 9.19 C 0.851 9.718 1.732 10.127 2.714 10.42 L 3 9.462 Z M 0 7 L 1 7 L 1 3 L 0 3 L -1 3 L -1 7 L 0 7 Z M 14 3 L 13 3 C 13 3.091 12.949 3.313 12.554 3.631 C 12.165 3.943 11.546 4.255 10.714 4.504 L 11 5.462 L 11.286 6.42 C 12.268 6.127 13.149 5.718 13.806 5.19 C 14.458 4.667 15 3.929 15 3 L 14 3 Z M 11 5.462 L 10.713 4.504 C 9.684 4.813 8.403 5 7 5 L 7 6 L 7 7 C 8.571 7 10.048 6.791 11.287 6.42 L 11 5.462 Z M 7 6 L 7 5 C 5.597 5 4.316 4.812 3.286 4.504 L 3 5.462 L 2.714 6.42 C 3.952 6.79 5.429 7 7 7 L 7 6 Z M 3 5.462 L 3.286 4.504 C 2.455 4.255 1.836 3.943 1.446 3.631 C 1.051 3.313 1 3.091 1 3 L 0 3 L -1 3 C -1 3.929 -0.457 4.667 0.194 5.19 C 0.851 5.718 1.732 6.127 2.714 6.42 L 3 5.462 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 5) matrix(1 0 0 1 4 0)\"/><path d=\"M 3 9.173 L 3.287 8.215 L 3.286 8.215 L 3 9.173 Z M 11 9.173 L 11.286 10.131 L 11.286 10.131 L 11 9.173 Z M 15 5.711 C 15 5.159 14.552 4.711 14 4.711 C 13.448 4.711 13 5.159 13 5.711 L 14 5.711 L 15 5.711 Z M 4.199 0.98 C 4.741 0.87 5.09 0.342 4.98 -0.199 C 4.87 -0.741 4.342 -1.09 3.801 -0.98 L 4 0 L 4.199 0.98 Z M 3 5.173 L 3.287 4.215 L 3.286 4.215 L 3 5.173 Z M 9.127 6.579 C 9.675 6.509 10.062 6.008 9.992 5.46 C 9.922 4.912 9.421 4.525 8.873 4.595 L 9 5.587 L 9.127 6.579 Z M 0 2.711 L -1 2.711 L -1 6.711 L 0 6.711 L 1 6.711 L 1 2.711 L 0 2.711 Z M 0 6.711 L -1 6.711 C -1 7.64 -0.457 8.378 0.194 8.901 C 0.851 9.429 1.732 9.838 2.714 10.131 L 3 9.173 L 3.286 8.215 C 2.455 7.966 1.836 7.654 1.446 7.342 C 1.051 7.024 1 6.802 1 6.711 L 0 6.711 Z M 3 9.173 L 2.713 10.131 C 3.952 10.502 5.429 10.711 7 10.711 L 7 9.711 L 7 8.711 C 5.597 8.711 4.316 8.524 3.287 8.215 L 3 9.173 Z M 7 9.711 L 7 10.711 C 8.571 10.711 10.048 10.501 11.286 10.131 L 11 9.173 L 10.714 8.215 C 9.684 8.523 8.403 8.711 7 8.711 L 7 9.711 Z M 11 9.173 L 11.286 10.131 C 12.268 9.838 13.149 9.429 13.806 8.901 C 14.457 8.378 15 7.64 15 6.711 L 14 6.711 L 13 6.711 C 13 6.802 12.949 7.024 12.554 7.342 C 12.164 7.654 11.545 7.966 10.714 8.215 L 11 9.173 Z M 14 6.711 L 15 6.711 L 15 5.711 L 14 5.711 L 13 5.711 L 13 6.711 L 14 6.711 Z M 0 2.711 L 1 2.711 C 1 2.605 1.078 2.311 1.667 1.92 C 2.229 1.546 3.096 1.204 4.199 0.98 L 4 0 L 3.801 -0.98 C 2.539 -0.723 1.406 -0.308 0.56 0.254 C -0.261 0.799 -1 1.62 -1 2.711 L 0 2.711 Z M 0 2.711 L -1 2.711 C -1 3.64 -0.457 4.378 0.194 4.901 C 0.851 5.429 1.732 5.838 2.714 6.131 L 3 5.173 L 3.286 4.215 C 2.455 3.966 1.836 3.654 1.446 3.342 C 1.051 3.024 1 2.802 1 2.711 L 0 2.711 Z M 3 5.173 L 2.713 6.131 C 3.952 6.502 5.429 6.711 7 6.711 L 7 5.711 L 7 4.711 C 5.597 4.711 4.316 4.524 3.287 4.215 L 3 5.173 Z M 7 5.711 L 7 6.711 C 7.736 6.711 8.449 6.665 9.127 6.579 L 9 5.587 L 8.873 4.595 C 8.283 4.671 7.654 4.711 7 4.711 L 7 5.711 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 5) matrix(1 0 0 1 0 4.289)\"/>"
  },
  "IconsSearch": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 12.501 11.001 L 11.711 11.001 L 11.431 10.731 C 12.056 10.005 12.513 9.15 12.769 8.227 C 13.025 7.304 13.073 6.336 12.911 5.391 C 12.441 2.611 10.121 0.391 7.321 0.051 C 6.337 -0.073 5.337 0.029 4.398 0.351 C 3.46 0.672 2.607 1.204 1.905 1.905 C 1.204 2.607 0.672 3.46 0.351 4.398 C 0.029 5.337 -0.073 6.337 0.051 7.321 C 0.391 10.121 2.611 12.441 5.391 12.911 C 6.336 13.073 7.304 13.025 8.227 12.769 C 9.15 12.513 10.005 12.056 10.731 11.431 L 11.001 11.711 L 11.001 12.501 L 15.251 16.751 C 15.661 17.161 16.331 17.161 16.741 16.751 C 17.151 16.341 17.151 15.671 16.741 15.261 L 12.501 11.001 Z M 6.501 11.001 C 4.011 11.001 2.001 8.991 2.001 6.501 C 2.001 4.011 4.011 2.001 6.501 2.001 C 8.991 2.001 11.001 4.011 11.001 6.501 C 11.001 8.991 8.991 11.001 6.501 11.001 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2.999 2.999)\"/>"
  },
  "IconsSetting": {
    viewBox: "0 0 16 16",
    body: "<path d=\"M 8 3 C 8.398 3 8.779 2.842 9.061 2.561 C 9.342 2.279 9.5 1.898 9.5 1.5 C 9.5 1.102 9.342 0.721 9.061 0.439 C 8.779 0.158 8.398 0 8 0 C 7.602 0 7.221 0.158 6.939 0.439 C 6.658 0.721 6.5 1.102 6.5 1.5 C 6.5 1.898 6.658 2.279 6.939 2.561 C 7.221 2.842 7.602 3 8 3 Z M 1.5 3 C 1.898 3 2.279 2.842 2.561 2.561 C 2.842 2.279 3 1.898 3 1.5 C 3 1.102 2.842 0.721 2.561 0.439 C 2.279 0.158 1.898 0 1.5 0 C 1.102 0 0.721 0.158 0.439 0.439 C 0.158 0.721 0 1.102 0 1.5 C 0 1.898 0.158 2.279 0.439 2.561 C 0.721 2.842 1.102 3 1.5 3 Z M 14.5 3 C 14.898 3 15.279 2.842 15.561 2.561 C 15.842 2.279 16 1.898 16 1.5 C 16 1.102 15.842 0.721 15.561 0.439 C 15.279 0.158 14.898 0 14.5 0 C 14.102 0 13.721 0.158 13.439 0.439 C 13.158 0.721 13 1.102 13 1.5 C 13 1.898 13.158 2.279 13.439 2.561 C 13.721 2.842 14.102 3 14.5 3 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 0 6)\"/>"
  },
  "IconsShare": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 15 20 C 14.167 20 13.458 19.708 12.875 19.125 C 12.292 18.542 12 17.833 12 17 C 12 16.9 12.025 16.667 12.075 16.3 L 5.05 12.2 C 4.783 12.45 4.475 12.646 4.125 12.788 C 3.775 12.93 3.4 13.001 3 13 C 2.167 13 1.458 12.708 0.875 12.125 C 0.292 11.542 0 10.833 0 10 C 0 9.167 0.292 8.458 0.875 7.875 C 1.458 7.292 2.167 7 3 7 C 3.4 7 3.775 7.071 4.125 7.213 C 4.475 7.355 4.783 7.551 5.05 7.8 L 12.075 3.7 C 12.042 3.583 12.021 3.471 12.013 3.363 C 12.005 3.255 12.001 3.134 12 3 C 12 2.167 12.292 1.458 12.875 0.875 C 13.458 0.292 14.167 0 15 0 C 15.833 0 16.542 0.292 17.125 0.875 C 17.708 1.458 18 2.167 18 3 C 18 3.833 17.708 4.542 17.125 5.125 C 16.542 5.708 15.833 6 15 6 C 14.6 6 14.225 5.929 13.875 5.787 C 13.525 5.645 13.217 5.449 12.95 5.2 L 5.925 9.3 C 5.958 9.417 5.979 9.529 5.988 9.638 C 5.997 9.747 6.001 9.867 6 10 C 5.999 10.133 5.995 10.254 5.988 10.363 C 5.981 10.472 5.96 10.585 5.925 10.7 L 12.95 14.8 C 13.217 14.55 13.525 14.354 13.875 14.213 C 14.225 14.072 14.6 14.001 15 14 C 15.833 14 16.542 14.292 17.125 14.875 C 17.708 15.458 18 16.167 18 17 C 18 17.833 17.708 18.542 17.125 19.125 C 16.542 19.708 15.833 20 15 20 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 2)\"/>"
  },
  "IconsStar": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 8.557 13.698 L 12.707 16.208 C 13.467 16.667 14.397 15.988 14.197 15.128 L 13.097 10.407 L 16.767 7.228 C 17.437 6.648 17.077 5.548 16.197 5.478 L 11.367 5.068 L 9.477 0.608 C 9.137 -0.202 7.977 -0.202 7.637 0.608 L 5.747 5.058 L 0.917 5.468 C 0.037 5.538 -0.323 6.638 0.347 7.218 L 4.017 10.398 L 2.917 15.118 C 2.717 15.977 3.647 16.657 4.407 16.198 L 8.557 13.698 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3.443 3.572)\"/>"
  },
  "Mail": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 10 9 L 9.427 9.819 C 9.771 10.06 10.229 10.06 10.573 9.819 L 10 9 Z M 2 0 L 2 1 L 18 1 L 18 0 L 18 -1 L 2 -1 L 2 0 Z M 18 0 L 18 1 C 18.548 1 19 1.452 19 2 L 20 2 L 21 2 C 21 0.348 19.652 -1 18 -1 L 18 0 Z M 20 2 L 19 2 L 19 14 L 20 14 L 21 14 L 21 2 L 20 2 Z M 20 14 L 19 14 C 19 14.548 18.548 15 18 15 L 18 16 L 18 17 C 19.652 17 21 15.652 21 14 L 20 14 Z M 18 16 L 18 15 L 2 15 L 2 16 L 2 17 L 18 17 L 18 16 Z M 2 16 L 2 15 C 1.452 15 1 14.548 1 14 L 0 14 L -1 14 C -1 15.652 0.348 17 2 17 L 2 16 Z M 0 14 L 1 14 L 1 2 L 0 2 L -1 2 L -1 14 L 0 14 Z M 0 2 L 1 2 C 1 1.452 1.452 1 2 1 L 2 0 L 2 -1 C 0.348 -1 -1 0.348 -1 2 L 0 2 Z M 20 2 L 19.427 1.181 L 9.427 8.181 L 10 9 L 10.573 9.819 L 20.573 2.819 L 20 2 Z M 10 9 L 10.573 8.181 L 0.573 1.181 L 0 2 L -0.573 2.819 L 9.427 9.819 L 10 9 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 2 4)\"/>"
  },
  "Plus": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 8 0 C 8 -0.552 7.552 -1 7 -1 C 6.448 -1 6 -0.552 6 0 L 7 0 L 8 0 Z M 6 14 C 6 14.552 6.448 15 7 15 C 7.552 15 8 14.552 8 14 L 7 14 L 6 14 Z M 0 6 C -0.552 6 -1 6.448 -1 7 C -1 7.552 -0.552 8 0 8 L 0 7 L 0 6 Z M 14 8 C 14.552 8 15 7.552 15 7 C 15 6.448 14.552 6 14 6 L 14 7 L 14 8 Z M 7 0 L 6 0 L 6 14 L 7 14 L 8 14 L 8 0 L 7 0 Z M 0 7 L 0 8 L 14 8 L 14 7 L 14 6 L 0 6 L 0 7 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 5 5)\"/>"
  },
  "User": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 15 18 C 15 18.552 15.448 19 16 19 C 16.552 19 17 18.552 17 18 L 16 18 L 15 18 Z M 12 12 L 12 11 L 12 12 Z M 4 12 L 4 11 L 4 12 Z M 0 16 L -1 16 L 0 16 Z M -1 18 C -1 18.552 -0.552 19 0 19 C 0.552 19 1 18.552 1 18 L 0 18 L -1 18 Z M 16 18 L 17 18 L 17 16 L 16 16 L 15 16 L 15 18 L 16 18 Z M 16 16 L 17 16 C 17 14.674 16.473 13.402 15.536 12.464 L 14.828 13.172 L 14.121 13.879 C 14.684 14.441 15 15.204 15 16 L 16 16 Z M 14.828 13.172 L 15.536 12.464 C 14.598 11.527 13.326 11 12 11 L 12 12 L 12 13 C 12.796 13 13.559 13.316 14.121 13.879 L 14.828 13.172 Z M 12 12 L 12 11 L 4 11 L 4 12 L 4 13 L 12 13 L 12 12 Z M 4 12 L 4 11 C 2.674 11 1.402 11.527 0.464 12.464 L 1.172 13.172 L 1.879 13.879 C 2.441 13.316 3.204 13 4 13 L 4 12 Z M 1.172 13.172 L 0.464 12.464 C -0.473 13.402 -1 14.674 -1 16 L 0 16 L 1 16 C 1 15.204 1.316 14.441 1.879 13.879 L 1.172 13.172 Z M 0 16 L -1 16 L -1 18 L 0 18 L 1 18 L 1 16 L 0 16 Z M 12 4 L 11 4 C 11 5.657 9.657 7 8 7 L 8 8 L 8 9 C 10.761 9 13 6.761 13 4 L 12 4 Z M 8 8 L 8 7 C 6.343 7 5 5.657 5 4 L 4 4 L 3 4 C 3 6.761 5.239 9 8 9 L 8 8 Z M 4 4 L 5 4 C 5 2.343 6.343 1 8 1 L 8 0 L 8 -1 C 5.239 -1 3 1.239 3 4 L 4 4 Z M 8 0 L 8 1 C 9.657 1 11 2.343 11 4 L 12 4 L 13 4 C 13 1.239 10.761 -1 8 -1 L 8 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 4 3)\"/>"
  },
  "X": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 12.707 0.707 C 13.098 0.317 13.098 -0.317 12.707 -0.707 C 12.317 -1.098 11.683 -1.098 11.293 -0.707 L 12 0 L 12.707 0.707 Z M -0.707 11.293 C -1.098 11.683 -1.098 12.317 -0.707 12.707 C -0.317 13.098 0.317 13.098 0.707 12.707 L 0 12 L -0.707 11.293 Z M 0.707 -0.707 C 0.317 -1.098 -0.317 -1.098 -0.707 -0.707 C -1.098 -0.317 -1.098 0.317 -0.707 0.707 L 0 0 L 0.707 -0.707 Z M 11.293 12.707 C 11.683 13.098 12.317 13.098 12.707 12.707 C 13.098 12.317 13.098 11.683 12.707 11.293 L 12 12 L 11.293 12.707 Z M 12 0 L 11.293 -0.707 L -0.707 11.293 L 0 12 L 0.707 12.707 L 12.707 0.707 L 12 0 Z M 0 0 L -0.707 0.707 L 11.293 12.707 L 12 12 L 12.707 11.293 L 0.707 -0.707 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 6 6)\"/>"
  }
};
const ALIASES = {
  search: "IconsSearch",
  comment: "IconsComment",
  share: "IconsShare",
  bell: "IconsNotification",
  notification: "IconsNotification",
  calendar: "IconsCalendar",
  clock: "IconsClock",
  close: "IconsClose",
  check: "IconsCheck",
  edit: "IconsEdit",
  lock: "IconsLock",
  menu: "IconsMenu",
  add: "IconsAdd",
  camera: "IconsCamera",
  card: "IconsCard",
  premium: "IconsPremium",
  progress: "IconsProgress",
  protocol: "IconsProtocol",
  rewards: "IconsRewards",
  setting: "IconsSetting",
  settings: "IconsSetting",
  star: "IconsStar",
  article: "IconsArticle",
  percent: "IconsPercent",
  down: "IconsDown",
  "chevron-down": "ChevronDown",
  "chevron-right": "ChevronRightSize24",
  "arrow-right": "ArrowRight",
  "arrow-up": "ArrowUp",
  "arrow-up-right": "ArrowUpRightSize24",
  help: "HelpCircle",
  "help-circle": "HelpCircle",
  alert: "AlertCircle",
  "alert-circle": "AlertCircle",
  mail: "Mail",
  user: "User",
  plus: "Plus",
  x: "X",
  bookmark: "BookmarkProperty1Book",
  "bookmark-filled": "BookmarkProperty1Marked"
};

/**
 * Profinity bespoke icon — renders a glyph from the brand's own line-icon set.
 * Friendly aliases map to raw layer names, so <Icon name="search" /> works as
 * well as <Icon name="IconsSearch" />. Single-colour glyphs paint with currentColor.
 */
function Icon({
  name,
  size = 20,
  color = "currentColor",
  style = {},
  ...rest
}) {
  const key = ICONS[name] ? name : ALIASES[name];
  const d = key && ICONS[key];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: d.viewBox,
    fill: "none",
    style: {
      color,
      display: "inline-block",
      flexShrink: 0,
      lineHeight: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: d.body
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/community/ChannelItem.jsx
try { (() => {
/**
 * Community channel list row. Supports a "#" prefix, a colour swatch, a
 * "5 new posts" sub-line, a count badge, a premium crown and an active state.
 */
function ChannelItem({
  name,
  hash = false,
  swatch,
  newPosts,
  count,
  premium = false,
  active = false,
  onClick = () => {},
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      padding: "12px 14px",
      background: active ? "var(--gray-75)" : hover ? "var(--gray-50)" : "transparent",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
      textAlign: "left",
      ...style
    }
  }, hash && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--brand-navy)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)"
    }
  }, "#"), swatch && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 4,
      background: swatch,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--brand-navy)"
    }
  }, name), newPosts && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      marginTop: 3,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      color: "var(--gray-500)"
    }
  }, newPosts, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--error)"
    }
  }))), premium && /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "fluent:crown-16-filled",
    size: 20,
    color: "var(--premium-orange)"
  }), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 24,
      height: 22,
      padding: "0 7px",
      borderRadius: "var(--r-pill)",
      background: "var(--error)",
      color: "var(--white)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-semibold)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, count));
}
Object.assign(__ds_scope, { ChannelItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/community/ChannelItem.jsx", error: String((e && e.message) || e) }); }

// components/feed/Composer.jsx
try { (() => {
function MediaTool({
  iconify,
  glyph,
  label
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background: hover ? "var(--gray-75)" : "transparent",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)",
      color: "var(--brand-navy)"
    }
  }, iconify ? /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: iconify,
    size: 20,
    color: "var(--brand-navy)"
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: glyph,
    size: 20,
    color: "var(--brand-navy)"
  }), label);
}

/**
 * Feed post composer — a prompt input plus Article / Photo / Camera / Video tools.
 * Matches the composer on the Home feed and Community channel pages.
 */
function Composer({
  placeholder = "Write an article or share an update…",
  onPost = () => {},
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 16px",
      background: "var(--white)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-sm)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "mail",
    size: 18,
    color: "var(--gray-450)"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: placeholder,
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)",
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "help",
    size: 18,
    color: "var(--gray-450)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onPost,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 16px",
      background: "var(--action-primary)",
      color: "var(--white)",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "article",
    size: 18,
    color: "var(--white)"
  }), "Article", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(MediaTool, {
    iconify: "lucide:image",
    label: "Photo"
  }), /*#__PURE__*/React.createElement(MediaTool, {
    iconify: "lucide:aperture",
    label: "Camera"
  }), /*#__PURE__*/React.createElement(MediaTool, {
    iconify: "lucide:video",
    label: "Video"
  })));
}
Object.assign(__ds_scope, { Composer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/Composer.jsx", error: String((e && e.message) || e) }); }

// components/feed/EventCard.jsx
try { (() => {
function MetaRow({
  glyph,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "var(--text-primary)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: glyph,
    size: 18,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", null, children));
}

/**
 * Event / webinar card — banner image, title, host, date & time, and a CTA.
 * Appears in the Home & Community right-rail "Events" lists and on profiles.
 */
function EventCard({
  image,
  title,
  hostLabel = "Host:",
  host,
  date,
  time,
  cta = "Join Now!",
  ctaVariant = "primary",
  onCta = () => {},
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      overflow: "hidden",
      ...style
    }
  }, image && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 150,
      background: `center/cover no-repeat url(${image})`,
      backgroundColor: "var(--gray-200)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)"
    }
  }, title), host && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)"
    }
  }, hostLabel, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)"
    }
  }, host)), date && /*#__PURE__*/React.createElement(MetaRow, {
    glyph: "calendar"
  }, date), time && /*#__PURE__*/React.createElement(MetaRow, {
    glyph: "clock"
  }, time), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCta,
    style: {
      marginTop: 4,
      height: 44,
      width: "100%",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--white)",
      background: ctaVariant === "brand" ? "var(--action-brand)" : "var(--action-primary)"
    }
  }, cta)));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/EventCard.jsx", error: String((e && e.message) || e) }); }

// components/feed/PostActions.jsx
try { (() => {
function Action({
  glyph,
  iconify,
  label,
  color = "var(--gray-500)",
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      background: hover ? "var(--gray-75)" : "transparent",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: active ? "var(--fw-semibold)" : "var(--fw-regular)",
      color: active ? color : "var(--gray-500)",
      transition: "background var(--dur-fast)"
    }
  }, iconify ? /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: iconify,
    size: 20,
    color: active ? color : "var(--gray-500)"
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: glyph,
    size: 20,
    color: active ? color : "var(--gray-500)"
  }), label != null && /*#__PURE__*/React.createElement("span", null, label));
}

/**
 * Engagement bar under a feed post — like / comment / share on the left,
 * an optional "Actioned" status and Save (bookmark) on the right.
 */
function PostActions({
  likes,
  comments,
  shares,
  liked = false,
  saved = false,
  actioned = false,
  onLike,
  onComment,
  onShare,
  onSave,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Action, {
    iconify: "fluent:thumb-like-16-filled",
    label: likes,
    active: liked,
    color: "var(--reaction-like)",
    onClick: onLike
  }), /*#__PURE__*/React.createElement(Action, {
    glyph: "comment",
    label: comments,
    onClick: onComment
  }), /*#__PURE__*/React.createElement(Action, {
    glyph: "share",
    label: shares,
    onClick: onShare
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, actioned && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      color: "var(--success)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "lucide:circle-check-big",
    size: 18,
    color: "var(--success)"
  }), "Actioned"), /*#__PURE__*/React.createElement(Action, {
    glyph: saved ? "bookmark-filled" : "bookmark",
    label: "Save",
    active: saved,
    color: "var(--ai-purple)",
    onClick: onSave
  })));
}
Object.assign(__ds_scope, { PostActions });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/PostActions.jsx", error: String((e && e.message) || e) }); }

// components/learning/LevelBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LEVELS = {
  Beginner: {
    bg: "var(--level-beginner)"
  },
  Intermediate: {
    bg: "var(--level-intermediate)"
  },
  Advance: {
    bg: "var(--level-advanced)"
  },
  Advanced: {
    bg: "var(--level-advanced)"
  }
};

/** Course difficulty pill — Beginner (green), Intermediate (gold), Advance (magenta). */
function LevelBadge({
  level = "Beginner",
  style = {},
  ...rest
}) {
  const l = LEVELS[level] || LEVELS.Beginner;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 14px",
      background: l.bg,
      color: "var(--white)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-semibold)",
      borderRadius: "var(--r-sm)",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), level);
}
Object.assign(__ds_scope, { LevelBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/learning/LevelBadge.jsx", error: String((e && e.message) || e) }); }

// components/learning/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Course progress bar — gold fill on a hairline track, with an optional
 * "20% Complete" / "0%" label. Used across My Learning.
 */
function ProgressBar({
  value = 0,
  label,
  showPercent = true,
  height = 7,
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      width: "100%",
      background: "var(--gray-200)",
      borderRadius: "var(--r-pill)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: pct + "%",
      background: "linear-gradient(90deg, #f4ad3d, #e7820a)",
      borderRadius: "var(--r-pill)",
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  })), (label || showPercent) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)"
    }
  }, label || pct + "% Complete"));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/learning/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/learning/CourseTile.jsx
try { (() => {
/**
 * Course card for My Learning — thumbnail with a level badge + play button,
 * title, description, instructor, progress and a CTA. Composes LevelBadge,
 * ProgressBar and a purple action button.
 */
function CourseTile({
  image,
  level,
  title,
  description,
  instructor,
  progress = 0,
  cta = "Start learning",
  active = false,
  onCta = () => {},
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-card)",
      border: active ? "2px solid var(--ai-purple)" : "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 190,
      background: `center/cover no-repeat url(${image})`,
      backgroundColor: "var(--brand-navy)"
    }
  }, level && /*#__PURE__*/React.createElement(__ds_scope.LevelBadge, {
    level: level,
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.92)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "var(--shadow-sm)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "fluent:play-16-filled",
    size: 22,
    color: "var(--ai-purple)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)"
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-snug)",
      color: "var(--gray-500)"
    }
  }, description), instructor && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)"
    }
  }, instructor), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: progress,
    style: {
      marginTop: 4
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCta,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      marginTop: 6,
      height: 46,
      width: "100%",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--white)",
      background: hover ? "var(--action-primary-hover)" : "var(--action-primary)",
      transition: "background var(--dur-fast)"
    }
  }, cta)));
}
Object.assign(__ds_scope, { CourseTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/learning/CourseTile.jsx", error: String((e && e.message) || e) }); }

// components/learning/Tabs.jsx
try { (() => {
/**
 * Underlined tab strip — navy active label with a navy underline, gray rest.
 * Used for the My Learning category tabs and other in-page section switches.
 */
function Tabs({
  tabs = [],
  active,
  onChange = () => {},
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 36,
      borderBottom: "1px solid var(--border-default)",
      ...style
    }
  }, tabs.map(t => {
    const isActive = t === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      type: "button",
      onClick: () => onChange(t),
      style: {
        position: "relative",
        padding: "0 0 14px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body-lg)",
        fontWeight: isActive ? "var(--fw-semibold)" : "var(--fw-medium)",
        color: isActive ? "var(--brand-navy)" : "var(--gray-500)",
        boxShadow: isActive ? "inset 0 -2.5px 0 0 var(--brand-navy)" : "none",
        whiteSpace: "nowrap"
      }
    }, t);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/learning/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Profinity logo. Pass the asset src (full lockup or icon mark).
 * Defaults assume assets relative to the page; override `src` as needed.
 */
function Logo({
  variant = "full",
  src,
  height,
  style = {},
  ...rest
}) {
  const defaults = {
    full: "assets/logos/profinity-academy-logo-full.png",
    icon: "assets/logos/profinity-icon.jpg"
  };
  const h = height || (variant === "icon" ? 40 : 44);
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src || defaults[variant],
    alt: "PROfinity Academy",
    style: {
      height: h,
      width: "auto",
      display: "block",
      borderRadius: variant === "icon" ? "var(--r-sm)" : 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Logo.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* line icons (Lucide-style, 1.7 stroke) for the center nav */
const I = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0",
  learning: "M4 5.5A1.5 1.5 0 0 1 5.5 4H19v15H6a2 2 0 0 0-2 2V5.5ZM6 19a2 2 0 0 0-2 2",
  community: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 0a3 3 0 1 0 0-6M3 20a6 6 0 0 1 12 0m2-3a6 6 0 0 1 4 3"
};
const NavIcon = ({
  d,
  active
}) => /*#__PURE__*/React.createElement("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  style: {
    color: active ? "var(--brand-navy)" : "var(--gray-450)"
  }
}, /*#__PURE__*/React.createElement("path", {
  d: d,
  stroke: "currentColor",
  strokeWidth: "1.7",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
const AgentIcon = ({
  active
}) => /*#__PURE__*/React.createElement("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  style: {
    color: active ? "var(--ai-purple)" : "var(--gray-450)"
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 3c.6 4.6 2 6.6 6.6 7.3-4.6.7-6 2.7-6.6 7.3-.6-4.6-2-6.6-6.6-7.3C10 9.6 11.4 7.6 12 3Z",
  fill: "currentColor"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19 15c.25 1.7.8 2.5 2.5 2.8-1.7.3-2.25 1.1-2.5 2.8-.25-1.7-.8-2.5-2.5-2.8 1.7-.3 2.25-1.1 2.5-2.8Z",
  fill: "currentColor"
}));
function CountBadge({
  children,
  top = -4,
  right = -4
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top,
      right,
      minWidth: 18,
      height: 18,
      padding: "0 4px",
      borderRadius: "var(--r-pill)",
      background: "var(--premium-orange)",
      color: "var(--white)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-micro)",
      fontWeight: "var(--fw-semibold)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1.5px solid var(--white)"
    }
  }, children);
}
function NavItem({
  icon,
  label,
  active,
  badge,
  onClick
}) {
  const isAgent = label === "Agent";
  const accent = isAgent ? "var(--ai-purple)" : "var(--brand-navy)";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      padding: "8px 16px",
      background: "none",
      cursor: "pointer",
      borderRadius: "var(--r-sm)",
      border: active ? `1.5px solid ${accent}` : "1.5px solid transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, icon, badge != null && /*#__PURE__*/React.createElement(CountBadge, null, badge)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      fontWeight: active ? "var(--fw-semibold)" : "var(--fw-regular)",
      color: active ? accent : "var(--gray-450)"
    }
  }, label));
}
function IconButton({
  glyph,
  badge,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      position: "relative",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 4,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: glyph,
    size: 26,
    color: "var(--brand-navy)"
  }), badge != null && /*#__PURE__*/React.createElement(CountBadge, {
    top: -2,
    right: -2
  }, badge));
}

/** Global top navigation bar for the Profinity web app (Home, Profile, My Learning, Community, Agent). */
function TopNav({
  active = "Home",
  user = {
    name: "Katy Wilson",
    role: "Nurse Practitioner"
  },
  logoSrc,
  notifications = 12,
  messages = 12,
  communityBadge = 12,
  onNavigate = () => {},
  style = {}
}) {
  const items = [{
    label: "Home",
    icon: /*#__PURE__*/React.createElement(NavIcon, {
      d: I.home,
      active: active === "Home"
    })
  }, {
    label: "Profile",
    icon: /*#__PURE__*/React.createElement(NavIcon, {
      d: I.profile,
      active: active === "Profile"
    })
  }, {
    label: "My Learning",
    icon: /*#__PURE__*/React.createElement(NavIcon, {
      d: I.learning,
      active: active === "My Learning"
    })
  }, {
    label: "Community",
    icon: /*#__PURE__*/React.createElement(NavIcon, {
      d: I.community,
      active: active === "Community"
    }),
    badge: communityBadge
  }, {
    label: "Agent",
    icon: /*#__PURE__*/React.createElement(AgentIcon, {
      active: active === "Agent"
    })
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 24,
      height: 84,
      padding: "0 28px",
      background: "var(--white)",
      boxShadow: "0 1px 4px rgba(12,12,13,0.05)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "full",
    src: logoSrc,
    height: 40,
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 260,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    pill: true,
    placeholder: "Search",
    icon: /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "search",
      size: 18
    })
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "0 auto"
    }
  }, items.map(it => /*#__PURE__*/React.createElement(NavItem, _extends({
    key: it.label
  }, it, {
    active: active === it.label,
    onClick: () => onNavigate(it.label)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    glyph: "notification",
    badge: notifications
  }), /*#__PURE__*/React.createElement(IconButton, {
    glyph: "comment",
    badge: messages
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)"
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      color: "var(--gray-500)"
    }
  }, user.role)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 20,
    color: "var(--gray-500)"
  }))));
}
Object.assign(__ds_scope, { TopNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopNav.jsx", error: String((e && e.message) || e) }); }

// components/profile/AchievementChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Achievement / credential chip — a navy seal glyph + label in a hairline pill.
 * Used in the profile achievements row (Complications Expert, Community Guide…).
 */
function AchievementChip({
  label,
  glyph = "fluent:ribbon-16-filled",
  seal = "var(--brand-navy)",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 16px",
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-primary)",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: seal,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: glyph,
    size: 14,
    color: "var(--white)"
  })), label);
}
Object.assign(__ds_scope, { AchievementChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/AchievementChip.jsx", error: String((e && e.message) || e) }); }

// components/profile/MembershipCard.jsx
try { (() => {
/**
 * Membership / subscription upsell card — gold gradient plan panel with a
 * price box and a purple "Subscribe Now" action. Sits in the Profile right rail.
 */
function MembershipCard({
  heading = "Subscription Plan",
  description = "Discover the latest insights in premium articles — expert knowledge and updates to keep you informed.",
  planName = "Membership Plan",
  tagline = "Unlock Premium Access & Exclusive Benefits",
  price = "£97",
  period = "/month",
  billing = "Billed monthly. Cancel anytime.",
  cta = "Subscribe Now",
  onSubscribe = () => {},
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-lg)",
      boxShadow: "var(--shadow-card)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "fluent:diamond-16-filled",
    size: 46,
    color: "var(--premium-gold)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)"
    }
  }, heading), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-normal)",
      color: "var(--gray-500)"
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--membership-gradient)",
      borderRadius: "var(--r-md)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--white)"
    }
  }, planName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "rgba(255,255,255,0.92)",
      marginBottom: 8
    }
  }, tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--white)",
      borderRadius: "var(--r-sm)",
      padding: "16px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-display)",
      color: "var(--text-primary)"
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--gray-500)"
    }
  }, period)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)",
      marginTop: 4
    }
  }, billing))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSubscribe,
    style: {
      height: 48,
      width: "100%",
      border: "none",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--white)",
      background: "var(--action-primary)"
    }
  }, cta, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "lucide:arrow-up-right",
    size: 18,
    color: "var(--white)"
  })));
}
Object.assign(__ds_scope, { MembershipCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/MembershipCard.jsx", error: String((e && e.message) || e) }); }

// components/profile/StatGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Profile statistics row — big bold numbers over muted labels
 * (e.g. 2402 Following · 1203 Followers · 120 Points).
 */
function StatGroup({
  stats = [],
  gap = 28,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap,
      ...style
    }
  }, rest), stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-h1)",
      color: "var(--text-primary)",
      lineHeight: 1.1
    }
  }, s.value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)",
      marginTop: 2
    }
  }, s.label))));
}
Object.assign(__ds_scope, { StatGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/StatGroup.jsx", error: String((e && e.message) || e) }); }

// components/profile/VerificationSeals.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SEALS = {
  gb: {
    flag: "circle-flags:gb"
  },
  verified: {
    bg: "var(--verify-check)",
    icon: "fluent:checkmark-12-filled"
  },
  crown: {
    bg: "var(--verify-crown)",
    iconify: "fluent:crown-16-filled"
  },
  gold: {
    bg: "var(--verify-gold)",
    iconify: "fluent:star-16-filled"
  },
  expert: {
    bg: "var(--brand-navy)",
    iconify: "fluent:ribbon-16-filled"
  }
};

/**
 * Row of small circular trust seals shown beside a member's name — UK flag,
 * verified tick, gold star, premium crown, expert ribbon.
 */
function VerificationSeals({
  seals = ["gb", "gold", "verified", "crown"],
  size = 20,
  gap = 5,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap,
      ...style
    }
  }, rest), seals.map((kind, i) => {
    const s = SEALS[kind];
    if (!s) return null;
    if (s.flag) {
      return /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
        key: i,
        name: s.flag,
        size: size,
        style: {
          borderRadius: "50%"
        }
      });
    }
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: size,
        height: size,
        borderRadius: "50%",
        background: s.bg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
      name: s.iconify || s.icon,
      size: Math.round(size * 0.62),
      color: "var(--white)"
    }));
  }));
}
Object.assign(__ds_scope, { VerificationSeals });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/VerificationSeals.jsx", error: String((e && e.message) || e) }); }

// components/feed/CommentItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * A single feed comment or reply. Renders nested replies inside a bordered,
 * indented container (the threaded look from the Home feed).
 */
function CommentItem({
  author,
  text,
  likes,
  comments,
  reactions,
  reactionCount,
  replies = [],
  avatarSize = 36,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: author?.name,
    src: author?.avatar,
    size: avatarSize,
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)"
    }
  }, author?.name), author?.seals && /*#__PURE__*/React.createElement(__ds_scope.VerificationSeals, {
    seals: author.seals,
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      color: "var(--gray-500)"
    }
  }, likes != null && /*#__PURE__*/React.createElement("span", null, likes, " Likes"), comments != null && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 12
    }
  }, comments, " Comments")), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "settings",
    size: 16,
    color: "var(--gray-400)",
    style: {
      transform: "rotate(90deg)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      lineHeight: "var(--lh-normal)",
      color: "var(--gray-600)",
      marginTop: 4
    }
  }, text), (reactions || reactionCount != null) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ReactionGroup, {
    reactions: reactions || ["like"],
    count: reactionCount,
    size: 20
  })), replies.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: 14,
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, replies.map((r, i) => /*#__PURE__*/React.createElement(CommentItem, _extends({
    key: i
  }, r, {
    avatarSize: 30
  }))))));
}
Object.assign(__ds_scope, { CommentItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/CommentItem.jsx", error: String((e && e.message) || e) }); }

// components/feed/PostCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Media({
  media
}) {
  if (!media || media.length === 0) return null;
  if (media.length === 1) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: "var(--r-md)",
        overflow: "hidden",
        border: "1px solid var(--border-default)"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: media[0],
      alt: "",
      style: {
        width: "100%",
        maxHeight: 380,
        objectFit: "cover",
        display: "block"
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      borderRadius: "var(--r-md)",
      overflow: "hidden"
    }
  }, media.slice(0, 4).map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: "",
    style: {
      width: "100%",
      height: 190,
      objectFit: "cover",
      display: "block"
    }
  })));
}

/**
 * The Profinity feed post — author header with trust seals, optional media,
 * a typed body (e.g. "CASE STUDY:"), the engagement bar, and threaded comments.
 * Composes Avatar, VerificationSeals, PostActions and CommentItem.
 */
function PostCard({
  author,
  withOthers,
  time,
  media,
  kind,
  kindIcon = "lucide:chart-pie",
  title,
  body,
  likes,
  comments,
  shares,
  liked,
  saved,
  actioned,
  commentList = [],
  onLike,
  onComment,
  onShare,
  onSave,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: author?.name,
    src: author?.avatar,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, author?.name), author?.seals && /*#__PURE__*/React.createElement(__ds_scope.VerificationSeals, {
    seals: author.seals,
    size: 18
  }), withOthers && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)"
    }
  }, "with ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)",
      fontWeight: "var(--fw-medium)"
    }
  }, withOthers))), time && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      color: "var(--gray-500)",
      marginTop: 2
    }
  }, time)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "settings",
    size: 20,
    color: "var(--gray-400)",
    style: {
      transform: "rotate(90deg)"
    }
  })), /*#__PURE__*/React.createElement(Media, {
    media: media
  }), (kind || title) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: kindIcon,
    size: 22,
    color: "var(--brand-navy)"
  }), kind && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--brand-navy)"
    }
  }, kind), title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)"
    }
  }, title)), body && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: "var(--lh-relaxed)",
      color: "var(--gray-600)"
    }
  }, body), /*#__PURE__*/React.createElement(__ds_scope.PostActions, {
    likes: likes,
    comments: comments,
    shares: shares,
    liked: liked,
    saved: saved,
    actioned: actioned,
    onLike: onLike,
    onComment: onComment,
    onShare: onShare,
    onSave: onSave,
    style: {
      borderTop: "1px solid var(--border-default)",
      paddingTop: 14
    }
  }), commentList.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      borderTop: "1px solid var(--border-default)",
      paddingTop: 18
    }
  }, commentList.map((c, i) => /*#__PURE__*/React.createElement(__ds_scope.CommentItem, _extends({
    key: i
  }, c)))));
}
Object.assign(__ds_scope, { PostCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feed/PostCard.jsx", error: String((e && e.message) || e) }); }

// components/profile/ProfileHeader.jsx
try { (() => {
function Contact({
  glyph,
  label
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: glyph,
    size: 20,
    color: "var(--brand-navy)"
  }), label);
}

/**
 * Profile summary card — name with trust seals, bio, the Following/Followers/
 * Points stats, a membership-certificate action, a contact row and the
 * achievements chips. Composes StatGroup, VerificationSeals and AchievementChip.
 */
function ProfileHeader({
  name,
  seals = ["gb", "gold", "verified", "crown"],
  bio,
  stats = [],
  certificate = "Membership Certificate",
  onCertificate = () => {},
  contacts = [],
  achievements = [],
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      padding: 28,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-h1)",
      color: "var(--text-primary)"
    }
  }, name), /*#__PURE__*/React.createElement(__ds_scope.VerificationSeals, {
    seals: seals,
    size: 22
  })), bio && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: "var(--lh-normal)",
      color: "var(--gray-600)",
      maxWidth: 520
    }
  }, bio)), stats.length > 0 && /*#__PURE__*/React.createElement(__ds_scope.StatGroup, {
    stats: stats
  })), certificate && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCertificate,
    style: {
      alignSelf: "flex-start",
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 16px",
      background: "var(--white)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--r-sm)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "fluent:ribbon-star-16-filled",
    size: 18,
    color: "var(--premium-orange)"
  }), certificate, /*#__PURE__*/React.createElement(__ds_scope.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: "var(--gray-500)"
  })), contacts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 32,
      flexWrap: "wrap"
    }
  }, contacts.map((c, i) => /*#__PURE__*/React.createElement(Contact, {
    key: i,
    glyph: c.glyph,
    label: c.label
  }))), achievements.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap"
    }
  }, achievements.map((a, i) => /*#__PURE__*/React.createElement(__ds_scope.AchievementChip, {
    key: i,
    label: a.label,
    glyph: a.glyph
  }))));
}
Object.assign(__ds_scope, { ProfileHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/profile/ProfileHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent/App.jsx
try { (() => {
const DS_A = window.ProfinityDesignSystem_c2b5cc;
function AgentSwitch({
  agent,
  onChange
}) {
  const opts = [{
    id: "coach",
    label: "Coach AI"
  }, {
    id: "lumina",
    label: "Lumina"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      background: "var(--surface-sunken)",
      borderRadius: "var(--r-pill)",
      padding: 4,
      gap: 4
    }
  }, opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.id,
    onClick: () => onChange(o.id),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      border: "none",
      cursor: "pointer",
      padding: "8px 16px",
      borderRadius: "var(--r-pill)",
      background: agent === o.id ? "var(--white)" : "transparent",
      boxShadow: agent === o.id ? "var(--shadow-xs)" : "none",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)",
      color: agent === o.id ? "var(--ai-purple)" : "var(--gray-500)"
    }
  }, /*#__PURE__*/React.createElement(DS_A.Spark, {
    size: 14,
    color: agent === o.id ? "var(--ai-purple)" : "var(--gray-400)"
  }), " ", o.label)));
}
function App() {
  const D = window.PFData;
  const [agent, setAgent] = React.useState("coach");
  const [activeConv, setActiveConv] = React.useState("c1");
  const chips = agent === "coach" ? D.coachChips : D.luminaChips;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(DS_A.TopNav, {
    active: "Agent",
    user: D.user,
    logoSrc: "../../assets/logos/profinity-academy-logo-full.jpg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 24px 0",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(AgentSwitch, {
    agent: agent,
    onChange: setAgent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      gap: 0,
      padding: "14px 24px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      minHeight: 0,
      background: "var(--white)",
      borderRadius: "var(--r-xl)",
      overflow: "hidden",
      border: "1px solid var(--border-default)",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement(ConversationRail, {
    agent: agent,
    conversations: D.conversations,
    patients: D.patients,
    activeId: activeConv,
    onSelect: setActiveConv,
    onNew: () => {}
  }), /*#__PURE__*/React.createElement(ChatPanel, {
    agent: agent,
    chips: chips
  }), agent === "coach" ? /*#__PURE__*/React.createElement(StudioRail, {
    files: D.studioFiles
  }) : /*#__PURE__*/React.createElement(AppointmentsRail, {
    appointments: D.appointments
  }))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent/ChatPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DS_C = window.ProfinityDesignSystem_c2b5cc;
function AttachIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      color: "var(--gray-450)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 11.5 12 19.5a4.5 4.5 0 0 1-6.5-6.5l8-8a3 3 0 0 1 4.3 4.3l-8 8a1.5 1.5 0 0 1-2.2-2.2l7.4-7.4",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function SendIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h13M12 5l7 7-7 7",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function ArrowUpRight() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 17 17 7M9 7h8v8",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function ChatHeader({
  agent
}) {
  const meta = agent === "coach" ? {
    name: "Profinity Coach AI",
    sub: "Unlock smarter marketing with your AI assistant"
  } : {
    name: "Lumina Patient Receptionist",
    sub: "Your AI partner for appointment bookings."
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 28px",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(DS_C.Spark, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-h1)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--brand-navy)"
    }
  }, meta.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, meta.sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--gray-450)",
      cursor: "pointer",
      fontSize: 22
    }
  }, "\u22EE")));
}
function CoachIntro({
  courses
}) {
  return /*#__PURE__*/React.createElement(DS_C.AgentMessage, {
    agentName: "Profinity Coach AI"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 16px"
    }
  }, "Absolutely! Based on your goal of improving your filler techniques and enhancing your full-face assessment skills, I recommend exploring the following learning resources available in My Learning:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontWeight: "var(--fw-semibold)",
      color: "var(--text-primary)",
      margin: "0 0 12px"
    }
  }, /*#__PURE__*/React.createElement(DS_C.Spark, {
    size: 16
  }), " Recommended course for you"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginBottom: 16
    }
  }, courses.map(c => /*#__PURE__*/React.createElement(DS_C.CourseCard, _extends({
    key: c.title
  }, c)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-sunken)",
      borderRadius: "var(--r-md)",
      padding: 18,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "var(--ai-purple)",
      fontWeight: "var(--fw-semibold)",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(DS_C.Spark, {
    size: 16
  }), " Why these courses?"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--ai-purple)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: "var(--lh-normal)"
    }
  }, "These modules align with your interest in advancing your filler expertise and can help you progress from performing individual treatments to delivering complete full-face rejuvenation plans.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 16px"
    }
  }, "Would you like me to open these courses in My Learning, or create a personalised learning pathway for you?"), /*#__PURE__*/React.createElement(DS_C.Button, {
    variant: "secondary",
    iconTrailing: /*#__PURE__*/React.createElement(ArrowUpRight, null)
  }, "Check My Learning"));
}
function LuminaIntro() {
  return /*#__PURE__*/React.createElement(DS_C.AgentMessage, {
    agentName: "Lumina Patient Receptionist"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--fs-display)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--text-primary)",
      lineHeight: 1.2
    }
  }, "Hi Katy!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontSize: "22px",
      fontWeight: "var(--fw-medium)"
    }
  }, "How can I help you with ", /*#__PURE__*/React.createElement("em", null, "appointments"), " today?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      color: "var(--gray-500)"
    }
  }, "Ask anything or try one of these to get started"));
}
function ChatPanel({
  agent,
  chips,
  onChip
}) {
  const D = window.PFData;
  const [messages, setMessages] = React.useState([]);
  const scroller = React.useRef(null);
  React.useEffect(() => {
    setMessages([]);
  }, [agent]);
  React.useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages]);
  function send(text) {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    setMessages(m => [...m, {
      role: "user",
      text,
      time: now
    }]);
    setTimeout(() => {
      const reply = agent === "coach" ? "Great question! I've pulled together some relevant modules from My Learning — take a look below and I can build a pathway whenever you're ready." : "Happy to help with that. I can see your upcoming consultations on the right — would you like to book, reschedule or cancel one?";
      setMessages(m => [...m, {
        role: "assistant",
        text: reply
      }]);
    }, 500);
  }
  return /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--white)",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(ChatHeader, {
    agent: agent
  }), /*#__PURE__*/React.createElement("div", {
    ref: scroller,
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "26px 28px",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }
  }, agent === "coach" ? /*#__PURE__*/React.createElement(CoachIntro, {
    courses: D.coachCourses
  }) : /*#__PURE__*/React.createElement(LuminaIntro, null), messages.map((m, i) => /*#__PURE__*/React.createElement(DS_C.AgentMessage, {
    key: i,
    role: m.role,
    time: m.time,
    agentName: agent === "coach" ? "Profinity Coach AI" : "Lumina Patient Receptionist"
  }, m.text))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 28px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 16
    }
  }, chips.map(c => /*#__PURE__*/React.createElement(DS_C.SuggestionChip, {
    key: c,
    onClick: () => send(c)
  }, c))), /*#__PURE__*/React.createElement(Composer, {
    onSend: send
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 12,
      fontSize: "var(--fs-caption)",
      fontStyle: "italic",
      color: "var(--gray-450)"
    }
  }, "AI can make mistakes. Verify important outputs.")));
}
function Composer({
  onSend
}) {
  const [val, setVal] = React.useState("");
  function submit() {
    onSend(val);
    setVal("");
  }
  return /*#__PURE__*/React.createElement(DS_C.Input, {
    pill: true,
    value: val,
    onChange: e => setVal(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") submit();
    },
    placeholder: "Ask Profinity Agent anything\u2026",
    icon: /*#__PURE__*/React.createElement(AttachIcon, null),
    trailing: /*#__PURE__*/React.createElement("button", {
      onClick: submit,
      style: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: val.trim() ? "var(--ai-purple)" : "var(--brand-navy)",
        color: "var(--white)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(SendIcon, null)),
    wrapStyle: {
      padding: "8px 8px 8px 18px"
    }
  });
}
window.ChatPanel = ChatPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent/ChatPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent/ConversationRail.jsx
try { (() => {
const DS = window.ProfinityDesignSystem_c2b5cc;
function PencilIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinejoin: "round"
  }));
}
function BackIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 5l-7 7 7 7",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function SearchIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7",
    stroke: "currentColor",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3.5-3.5",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }));
}
function ConversationRail({
  agent,
  conversations,
  patients,
  activeId,
  onSelect,
  onNew
}) {
  // group conversations
  const groups = {};
  conversations.forEach(c => {
    (groups[c.group] = groups[c.group] || []).push(c);
  });
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 320,
      flexShrink: 0,
      background: "var(--white)",
      borderRight: "1px solid var(--border-default)",
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 20px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)",
      display: "flex",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(BackIcon, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--text-primary)"
    }
  }, "Conversations History")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 20px 14px"
    }
  }, /*#__PURE__*/React.createElement(DS.Button, {
    fullWidth: true,
    iconLeading: agent === "coach" ? /*#__PURE__*/React.createElement(PencilIcon, null) : null,
    onClick: onNew
  }, agent === "coach" ? "New Chat" : "New Conversation")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 20px 14px"
    }
  }, /*#__PURE__*/React.createElement(DS.Input, {
    icon: /*#__PURE__*/React.createElement(SearchIcon, null),
    placeholder: "Search"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 12px 16px"
    }
  }, agent === "coach" ? Object.entries(groups).map(([g, items]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 8px 6px",
      fontSize: "var(--fs-caption)",
      color: "var(--gray-450)"
    }
  }, g), items.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => onSelect(c.id),
    style: {
      display: "block",
      width: "100%",
      textAlign: "left",
      border: "none",
      cursor: "pointer",
      padding: "10px 12px",
      borderRadius: "var(--r-sm)",
      marginBottom: 2,
      background: activeId === c.id ? "var(--ai-purple-100)" : "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: activeId === c.id ? "var(--ai-purple)" : "var(--text-primary)",
      fontWeight: activeId === c.id ? "var(--fw-medium)" : "var(--fw-regular)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, c.title)))) : patients.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      padding: "10px 8px",
      borderRadius: "var(--r-sm)",
      cursor: "pointer"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--gray-50)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement(DS.Avatar, {
    name: p.name,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)"
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-caption)",
      color: "var(--gray-450)",
      flexShrink: 0
    }
  }, p.time)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, p.note))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-default)",
      padding: "14px 20px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ai-purple)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body)",
      cursor: "pointer"
    }
  }, "View all conversations \u203A")));
}
window.ConversationRail = ConversationRail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent/ConversationRail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent/RightRail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DS_R = window.ProfinityDesignSystem_c2b5cc;
function UploadIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      color: "var(--ai-purple)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 16V5m0 0L8 9m4-4 4 4M5 19h14",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function PdfIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      color: "var(--ai-magenta)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 2h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 2v5h5",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }));
}
function PlusIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }));
}
function FileRow({
  name
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 0"
    }
  }, /*#__PURE__*/React.createElement(PdfIcon, null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-body)",
      color: "var(--text-primary)"
    }
  }, name));
}
function SectionLabel({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-semibold)",
      color: "var(--gray-450)",
      margin: "18px 0 6px"
    }
  }, children);
}
function StudioRail({
  files
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: railStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: titleStyle
  }, "Studio")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1.5px dashed var(--border-strong)",
      borderRadius: "var(--r-md)",
      padding: "26px 20px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(UploadIcon, null), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--ai-purple)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)"
    }
  }, "Upload files"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-caption)",
      color: "var(--gray-450)"
    }
  }, "PDF, DOCS, PPT, XLSX (max 25MB)"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(DS_R.Button, {
    size: "sm"
  }, "Browse files"))), /*#__PURE__*/React.createElement(SectionLabel, null, "Your Uploaded Files"), files.uploaded.map(f => /*#__PURE__*/React.createElement(FileRow, {
    key: f,
    name: f
  })), /*#__PURE__*/React.createElement(SectionLabel, null, "AI Generated Files"), files.generated.map(f => /*#__PURE__*/React.createElement(FileRow, {
    key: f,
    name: f
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ai-purple)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body)",
      cursor: "pointer"
    }
  }, "View all files \u203A")));
}
function AppointmentsRail({
  appointments
}) {
  const [tab, setTab] = React.useState("Upcoming");
  return /*#__PURE__*/React.createElement("aside", {
    style: railStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: titleStyle
  }, "Appointments"), /*#__PURE__*/React.createElement(DS_R.Button, {
    size: "sm",
    iconLeading: /*#__PURE__*/React.createElement(PlusIcon, null)
  }, "New")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24,
      borderBottom: "1px solid var(--border-default)",
      marginBottom: 18
    }
  }, ["Upcoming", "History"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0 0 12px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      fontWeight: "var(--fw-medium)",
      color: tab === t ? "var(--ai-purple)" : "var(--gray-500)",
      boxShadow: tab === t ? "inset 0 -2px 0 0 var(--ai-purple)" : "none"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, appointments.map((a, i) => /*#__PURE__*/React.createElement(DS_R.AppointmentCard, _extends({
    key: i
  }, a)))));
}
const railStyle = {
  width: 340,
  flexShrink: 0,
  background: "var(--white)",
  borderLeft: "1px solid var(--border-default)",
  padding: "24px 24px",
  height: "100%",
  overflowY: "auto"
};
const titleStyle = {
  margin: 0,
  fontSize: "var(--fs-h1)",
  fontWeight: "var(--fw-semibold)",
  color: "var(--text-primary)"
};
window.StudioRail = StudioRail;
window.AppointmentsRail = AppointmentsRail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent/RightRail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent/data.js
try { (() => {
// Mock data for the Profinity Agent UI kit
window.PFData = {
  user: {
    name: "Katy Wilson",
    role: "Nurse Practitioner"
  },
  conversations: [{
    id: "c1",
    title: "Marketing Campaign Performance",
    group: "This Week",
    active: true
  }, {
    id: "c2",
    title: "Competitor Analysis.pdf",
    group: "This Week"
  }, {
    id: "c3",
    title: "Social Media Engagement Report",
    group: "Last Week"
  }, {
    id: "c4",
    title: "Website Traffic Analysis.csv",
    group: "Last Week"
  }, {
    id: "c5",
    title: "Email Marketing Results.pptx",
    group: "Last Week"
  }, {
    id: "c6",
    title: "SEO Keyword Ranking.docx",
    group: "2 weeks ago"
  }, {
    id: "c7",
    title: "PPC Campaign Review.pdf",
    group: "2 weeks ago"
  }, {
    id: "c8",
    title: "Content Marketing Strategy.xlsx",
    group: "2 weeks ago"
  }],
  patients: [{
    name: "Catherine Linton",
    note: "Pretty good, just finished a project.",
    time: "6h"
  }, {
    name: "Thomas Hardy",
    note: "I've been busy with work.",
    time: "5h"
  }, {
    name: "Alice Johnson",
    note: "Just wrapped up a presentation.",
    time: "4h"
  }, {
    name: "Mark Twain",
    note: "Things are great! I just got back.",
    time: "3h"
  }, {
    name: "Harper Lee",
    note: "Just finished writing a short story.",
    time: "2h"
  }],
  coachCourses: [{
    title: "Dynamic Facial Structures",
    description: "Explore facial anatomy to enhance your artistic skills and understanding of human expressions."
  }, {
    title: "Advanced Lip Techniques",
    description: "Master the nuances of lip anatomy for precise techniques and aesthetics."
  }],
  appointments: [{
    title: "Consultation: Laser Resurfacing",
    datetime: "Nov 02, 2026 at 10:00 AM",
    attendees: [{
      name: "Katy Wilson",
      status: "Confirmed"
    }, {
      name: "Jane Harris",
      status: "Pending"
    }]
  }, {
    title: "Follow-up: Chemical Peel",
    datetime: "Nov 09, 2026 at 2:00 PM",
    attendees: [{
      name: "Katy Wilson",
      status: "Confirmed"
    }, {
      name: "Jane Harris",
      status: "Pending"
    }]
  }, {
    title: "Initial Visit: Microdermabrasion",
    datetime: "Nov 16, 2026 at 1:30 PM",
    attendees: [{
      name: "Katy Wilson",
      status: "Confirmed"
    }, {
      name: "Jane Harris",
      status: "Pending"
    }]
  }],
  studioFiles: {
    uploaded: ["Revenue Analysis.pdf", "Expense Report.pdf", "Market Research.pdf"],
    generated: ["Type 1 Diabetes.pdf", "Type 2 Diabetes.pdf"]
  },
  coachChips: ["Summary of My Course", "Suggested Course", "Whats New"],
  luminaChips: ["Book an appointment", "Reschedule", "Cancel Appointment", "Patient Information"]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent/data.js", error: String((e && e.message) || e) }); }

// ui_kits/app/AgentsScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Agents — gradient hero + agent catalogue grid.
const {
  AgentHero,
  AgentCard
} = window.ProfinityDesignSystem_c2b5cc;
function AgentsScreen() {
  const D = window.APP_DATA;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AgentHero, {
    radius: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "40px 32px 56px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24
    }
  }, D.agents.map((a, i) => /*#__PURE__*/React.createElement(AgentCard, _extends({
    key: i
  }, a))))));
}
window.AgentsScreen = AgentsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AgentsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/CommunityScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Community — channel view with sidebar, channel header, composer and posts.
const {
  ChannelHeader,
  Composer,
  PostCard,
  EventCard,
  ChannelItem,
  Input,
  Icon
} = window.ProfinityDesignSystem_c2b5cc;
function ChannelsSidebar({
  channels
}) {
  const {
    Panel
  } = window.Kit;
  const Label = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)",
      margin: "16px 6px 6px"
    }
  }, children);
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Channels",
    padding: 20
  }, /*#__PURE__*/React.createElement(Input, {
    pill: true,
    placeholder: "Search channel",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18
    })
  }), /*#__PURE__*/React.createElement(Label, null, "Following"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, channels.following.map((c, i) => /*#__PURE__*/React.createElement(ChannelItem, _extends({
    key: i
  }, c)))), /*#__PURE__*/React.createElement(Label, null, "Other Channels"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, channels.other.map((c, i) => /*#__PURE__*/React.createElement(ChannelItem, _extends({
    key: i
  }, c)))));
}
function CommunityScreen() {
  const {
    Panel,
    Rail,
    SortBy
  } = window.Kit;
  const D = window.APP_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "320px minmax(0,1fr) 320px",
      gap: 24,
      maxWidth: 1440,
      margin: "0 auto",
      padding: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Rail, null, /*#__PURE__*/React.createElement(ChannelsSidebar, {
    channels: D.channels
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    padding: 24
  }, /*#__PURE__*/React.createElement(ChannelHeader, _extends({}, D.channelHeader, {
    following: false
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Composer, null))), /*#__PURE__*/React.createElement(SortBy, {
    value: "All"
  }), D.posts.map((post, i) => /*#__PURE__*/React.createElement(PostCard, _extends({
    key: i
  }, post)))), /*#__PURE__*/React.createElement(Rail, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 2px",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h2)",
      color: "var(--text-primary)"
    }
  }, "Upcoming Events"), D.events.map((e, i) => /*#__PURE__*/React.createElement(EventCard, _extends({
    key: i
  }, e)))));
}
window.CommunityScreen = CommunityScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/CommunityScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Home — three-column community feed.
const {
  Composer,
  PostCard,
  EventCard,
  StatGroup,
  VerificationSeals,
  ChannelItem,
  Icon,
  IconifyIcon
} = window.ProfinityDesignSystem_c2b5cc;
function HomeProfileCard({
  p
}) {
  const {
    Panel
  } = window.Kit;
  return /*#__PURE__*/React.createElement(Panel, {
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-h2)",
      color: "var(--text-primary)"
    }
  }, p.name), /*#__PURE__*/React.createElement(VerificationSeals, {
    seals: p.seals,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--gray-600)",
      marginTop: 4,
      marginBottom: 20
    }
  }, p.title), /*#__PURE__*/React.createElement(StatGroup, {
    stats: p.stats,
    style: {
      justifyContent: "space-between"
    }
  }));
}
function TrendingCard({
  items
}) {
  const {
    Panel
  } = window.Kit;
  return /*#__PURE__*/React.createElement(Panel, {
    title: "Trending Among Clinicians"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, items.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)"
    }
  }, t.rank), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--brand-navy)",
      marginTop: 2
    }
  }, t.kind), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--gray-600)"
    }
  }, t.title)))));
}
function HomeScreen() {
  const {
    Panel,
    Rail,
    SortBy
  } = window.Kit;
  const D = window.APP_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "320px minmax(0,1fr) 320px",
      gap: 24,
      maxWidth: 1440,
      margin: "0 auto",
      padding: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(Rail, null, /*#__PURE__*/React.createElement(HomeProfileCard, {
    p: D.homeProfile
  }), /*#__PURE__*/React.createElement(Panel, {
    title: "Community Channel"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(ChannelItem, {
    name: "General",
    count: "5"
  }), /*#__PURE__*/React.createElement(ChannelItem, {
    name: "Industry Insights"
  }))), /*#__PURE__*/React.createElement(TrendingCard, {
    items: D.trending
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Composer, null), /*#__PURE__*/React.createElement(SortBy, {
    value: "All"
  }), D.posts.map((post, i) => /*#__PURE__*/React.createElement(PostCard, _extends({
    key: i
  }, post)))), /*#__PURE__*/React.createElement(Rail, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 2px",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h2)",
      color: "var(--text-primary)"
    }
  }, "My Events"), D.events.map((e, i) => /*#__PURE__*/React.createElement(EventCard, _extends({
    key: i
  }, e)))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LearningScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// My Learning — welcome header, tabs, search and course grid.
const {
  Tabs,
  CourseTile,
  Input,
  Icon
} = window.ProfinityDesignSystem_c2b5cc;
function LearningScreen() {
  const {
    Rail
  } = window.Kit;
  const D = window.APP_DATA;
  const [tab, setTab] = React.useState(D.learning.tabs[0]);
  const courses = D.learning.courses;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
      margin: "0 auto",
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: 44,
      color: "var(--brand-navy)",
      letterSpacing: "var(--ls-tight)"
    }
  }, "Welcome, Katy!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-h3)",
      color: "var(--brand-navy)"
    }
  }, "Your goal is to grow in aesthetics or medical school"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: D.learning.tabs,
    active: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search course\u2026",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 20
    }),
    wrapStyle: {
      background: "var(--white)",
      border: "1px solid var(--border-default)",
      padding: "16px 18px"
    }
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 28,
      background: "var(--surface-panel)",
      borderRadius: "var(--r-lg)",
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: 30,
      color: "var(--text-primary)"
    }
  }, "My Courses"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-link)"
    }
  }, "View All")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 20
    }
  }, courses.map((c, i) => /*#__PURE__*/React.createElement(CourseTile, _extends({
    key: i
  }, c))))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 20px",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h1)",
      color: "var(--text-primary)"
    }
  }, "Recommended Courses"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 20
    }
  }, courses.map((c, i) => /*#__PURE__*/React.createElement(CourseTile, _extends({
    key: i
  }, c, {
    active: false,
    progress: 0,
    cta: "Start learning"
  }))))));
}
window.LearningScreen = LearningScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LearningScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ProfileScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Profile — member profile with summit, actions, and a right rail.
const {
  ProfileHeader,
  MembershipCard,
  ChannelItem,
  Avatar,
  Button,
  Icon,
  IconifyIcon
} = window.ProfinityDesignSystem_c2b5cc;
function SummitCard({
  s
}) {
  const Meta = ({
    glyph,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: glyph,
    size: 20,
    color: "var(--brand-navy)"
  }), children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ai-purple-100)",
      borderRadius: "var(--r-md)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: "var(--fs-h1)",
      color: "var(--brand-navy)"
    }
  }, s.title), /*#__PURE__*/React.createElement(Meta, {
    glyph: "calendar"
  }, s.date), /*#__PURE__*/React.createElement(Meta, {
    glyph: "clock"
  }, s.time), /*#__PURE__*/React.createElement(Meta, {
    glyph: "protocol"
  }, s.location), /*#__PURE__*/React.createElement(Button, {
    variant: "brand",
    fullWidth: true
  }, "View Event Details"));
}
function VerifyBanner() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      background: "var(--gray-50)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: "50%",
      background: "var(--verify-check)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconifyIcon, {
    name: "fluent:checkmark-12-filled",
    size: 15,
    color: "var(--white)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, "Verify your medical credentials"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)",
      marginTop: 2
    }
  }, "Adding more credentials helps people know you're the real deal.")), /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20,
    color: "var(--gray-400)"
  }));
}
function SuggestionRow({
  s
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: s.name,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-primary)"
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      color: "var(--gray-500)"
    }
  }, s.place)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      border: "1px solid var(--ai-purple)",
      background: "var(--white)",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "add",
    size: 18,
    color: "var(--ai-purple)"
  })));
}
function ProfileScreen() {
  const {
    Panel,
    Rail
  } = window.Kit;
  const D = window.APP_DATA;
  const p = D.profile;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) 320px",
      gap: 24,
      maxWidth: 1320,
      margin: "0 auto",
      padding: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(ProfileHeader, {
    name: p.name,
    seals: p.seals,
    bio: p.bio,
    stats: p.stats,
    contacts: p.contacts,
    achievements: p.achievements
  }), /*#__PURE__*/React.createElement(Panel, {
    padding: 20
  }, /*#__PURE__*/React.createElement(SummitCard, {
    s: p.summit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    iconLeading: /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 18,
      color: "var(--white)"
    })
  }, "Edit Page"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    iconLeading: /*#__PURE__*/React.createElement(Icon, {
      name: "card",
      size: 18,
      color: "var(--gray-600)"
    })
  }, "Payments")), /*#__PURE__*/React.createElement(VerifyBanner, null)), /*#__PURE__*/React.createElement(Rail, null, /*#__PURE__*/React.createElement(MembershipCard, null), /*#__PURE__*/React.createElement(Panel, {
    title: "Community Channel"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, p.feedChannels.map((c, i) => /*#__PURE__*/React.createElement(ChannelItem, _extends({
    key: i
  }, c))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Add to your feed"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, p.suggestions.map((s, i) => /*#__PURE__*/React.createElement(SuggestionRow, {
    key: i,
    s: s
  }))))));
}
window.ProfileScreen = ProfileScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Sample content for the Profinity web-app UI kit. Attached to window.APP_DATA.
// Image paths are relative to ui_kits/app/index.html.
(function () {
  const IMG = "../../assets/images/";
  window.APP_DATA = {
    user: {
      name: "Katy Wilson",
      role: "Nurse Practitioner",
      avatar: IMG + "avatar-katy.jpg"
    },
    homeProfile: {
      name: "Katy Wilson",
      title: "Registered Nurse",
      seals: ["gb", "verified", "crown"],
      stats: [{
        value: "2402",
        label: "Following"
      }, {
        value: "1203",
        label: "Followers"
      }, {
        value: "120",
        label: "Points"
      }]
    },
    trending: [{
      rank: "#1 — Top Trending",
      kind: "Protocol",
      title: "Lip Reversal Protocol"
    }, {
      rank: "#2 — Top Trending",
      kind: "Case Study",
      title: "Tear Trough Correction"
    }, {
      rank: "#3 — Top Trending",
      kind: "Article",
      title: "MidFace Filler"
    }],
    posts: [{
      author: {
        name: "Dr Tim Pearce",
        avatar: IMG + "avatar-drtim.png",
        seals: ["gb", "gold", "verified", "crown"]
      },
      withOthers: "Miranda Pearce and 14 others",
      time: "1 Week Ago",
      kind: "CASE STUDY:",
      title: "Full-Face Rejuvenation",
      body: "Dr. Emily utilised a comprehensive full-face strategy, emphasising midface enhancement, support around the mouth, and delicate contouring methods. She implemented the 3-Step Confidence Framework within PROfinity.",
      media: [IMG + "post-beforeafter.png"],
      likes: "1.2K",
      comments: "150",
      shares: "150",
      actioned: true,
      commentList: [{
        author: {
          name: "Phoenix Baker",
          seals: ["gb"]
        },
        text: "This is an amazing protocol! It has helped us a lot in our research.",
        likes: "1.1K",
        comments: "300",
        reactions: ["like", "laugh", "love"],
        reactionCount: "1.2K",
        replies: [{
          author: {
            name: "Tokyo Jana"
          },
          text: "Completely agree — this is a game changer for my clinic.",
          likes: "1.1K",
          reactions: ["like"],
          reactionCount: "1.2K"
        }]
      }, {
        author: {
          name: "Luna Chen"
        },
        text: "The framework is so intuitive — it has genuinely changed how I plan consultations.",
        likes: "850",
        comments: "150",
        reactions: ["like"],
        reactionCount: "1.2K"
      }]
    }, {
      author: {
        name: "Katy Wilson",
        avatar: IMG + "avatar-katy.jpg",
        seals: ["gb", "verified"]
      },
      time: "2 Weeks Ago",
      kind: "DISCUSSION:",
      title: "Managing patient expectations",
      body: "What does everyone include in a first consultation to set realistic expectations? I have been refining my intake questions and would love to compare notes with the community.",
      likes: "640",
      comments: "92",
      shares: "30",
      commentList: [{
        author: {
          name: "Marcus Lee"
        },
        text: "I always start with a photo review and a clear treatment timeline.",
        likes: "210",
        reactions: ["like", "love"],
        reactionCount: "210"
      }]
    }],
    events: [{
      image: IMG + "event-technique-tuesday.png",
      title: "Technique Tuesday",
      host: "Dr Tim Pearce",
      date: "17 March 2026",
      time: "20:00 GMT • 16:00 ET",
      cta: "Join Now!"
    }, {
      image: IMG + "event-art-codes.png",
      title: "Art Codes Live Webinar",
      hostLabel: "Event By:",
      host: "Dr Tim Pearce",
      date: "18 March 2026",
      cta: "Learn More"
    }, {
      image: IMG + "event-art-codes.png",
      title: "Art Codes Recorded Webinar",
      hostLabel: "Event By:",
      host: "Dr Tim Pearce",
      date: "22 March 2026",
      cta: "Learn More"
    }],
    channels: {
      following: [{
        name: "General",
        newPosts: "5 new posts",
        active: true
      }, {
        name: "Industry Insights"
      }],
      other: [{
        name: "Growth Marketing",
        premium: true
      }, {
        name: "Case Studies",
        premium: true
      }]
    },
    channelHeader: {
      banner: IMG + "cover-gold-texture.png",
      name: "Announcements",
      followers: "1,203",
      visibility: "Public channel",
      about: "The Growth Marketing channel shares key announcements, insights and strategies to help you grow your business. We provide innovative, data-driven marketing solutions to boost engagement and achieve sustainable growth."
    },
    learning: {
      tabs: ["All Courses", "Free Resources", "New Courses", "Recommended Courses", "Upcoming Webinars", "Certification Programs"],
      courses: [{
        image: IMG + "course-protox.png",
        level: "Beginner",
        title: "8D Lip Design",
        description: "Discover a complete view of human anatomy for deeper learning and application.",
        instructor: "Dr Tim Pearce",
        progress: 20,
        cta: "Continue learning",
        active: true
      }, {
        image: IMG + "course-temple.png",
        level: "Intermediate",
        title: "Temple Filler",
        description: "Confidently inject temples & add youth back into your patients' face.",
        instructor: "Dr Tim Pearce",
        progress: 0,
        cta: "Start learning"
      }, {
        image: IMG + "course-8d-lip.png",
        level: "Advance",
        title: "Protox Course",
        description: "Elevate your botulinum toxin skills, 10x your confidence, and turn one patient into 100.",
        instructor: "Dr Tim Pearce",
        progress: 0,
        cta: "Start learning"
      }, {
        image: IMG + "course-temple.png",
        level: "Advance",
        title: "Tear Trough Mastery",
        description: "A safe, structured approach to the most requested under-eye correction.",
        instructor: "Dr Tim Pearce",
        progress: 0,
        cta: "Start learning"
      }]
    },
    profile: {
      name: "Katy Wilson",
      seals: ["gb", "gold", "verified", "crown"],
      bio: "Enhance patient satisfaction scores by 15% over the next 6 months through improved care and confident, evidence-led treatment planning.",
      stats: [{
        value: "2402",
        label: "Following"
      }, {
        value: "1203",
        label: "Followers"
      }, {
        value: "120",
        label: "Points"
      }],
      contacts: [{
        glyph: "lucide:mail",
        label: "katywilson@mail.com"
      }, {
        glyph: "lucide:building-2",
        label: "Allcare Medical"
      }, {
        glyph: "lucide:globe",
        label: "allcaremed.com"
      }, {
        glyph: "lucide:instagram",
        label: "@katywilson"
      }],
      achievements: [{
        label: "Complications Expert",
        glyph: "fluent:shield-16-filled"
      }, {
        label: "Community Guide",
        glyph: "fluent:compass-northwest-16-filled"
      }, {
        label: "Community Elder",
        glyph: "fluent:trophy-16-filled"
      }, {
        label: "Local Leader",
        glyph: "fluent:star-16-filled"
      }],
      summit: {
        title: "Dr Tim's Profinity Growth Summit 2026",
        date: "June 4–5, 2026",
        time: "9:00 AM – 5:00 PM",
        location: "Rome Convention Center, Rome Italy"
      },
      feedChannels: [{
        name: "Announcements",
        hash: true,
        swatch: "var(--brand-navy)",
        count: "10+"
      }, {
        name: "Viral News",
        hash: true,
        swatch: "var(--ai-purple)",
        count: "10+"
      }, {
        name: "Tips & Tricks",
        hash: true,
        swatch: "var(--brand-gold)",
        count: "10+"
      }, {
        name: "Community Highlights",
        hash: true,
        swatch: "var(--ai-magenta)",
        count: "10+"
      }],
      suggestions: [{
        name: "Caron Kiem",
        place: "London, United Kingdom"
      }, {
        name: "Sofia Chen",
        place: "Toronto, Canada"
      }, {
        name: "Marcus Lee",
        place: "Sydney, Australia"
      }]
    },
    agents: [{
      icon: IMG + "agent-assesspro.png",
      badge: "Included in Artcodes",
      title: "Assess Pro",
      locked: true,
      status: "",
      description: "A cutting-edge tool for detailed facial analysis, emotion recognition and identity verification. Perfect for security, healthcare and personalised marketing.",
      cta: "Learn More",
      ctaIcon: "lucide:arrow-right"
    }, {
      title: "Profinity Coach Agent",
      badge: "Included in Premium",
      status: "Coming Soon",
      description: "A versatile baseline assistant for general inquiries, scheduling and basic data retrieval. Perfect for getting started with automation.",
      cta: "Notify Me",
      ctaIcon: "lucide:bell"
    }, {
      title: "Lumina Patient Receptionist",
      badge: "Included in Premium",
      status: "Coming Soon",
      description: "An intelligent assistant specialised in appointment booking, patient support, scheduling and reminders. Ideal for a calmer front desk.",
      cta: "Notify Me",
      ctaIcon: "lucide:bell"
    }, {
      title: "Treatment Plan Generator",
      badge: "Included in Premium",
      status: "Coming Soon",
      description: "An advanced tool for building structured, patient-ready treatment plans in minutes. Ideal for clinicians seeking consistency.",
      cta: "Notify Me",
      ctaIcon: "lucide:bell"
    }, {
      title: "Minute Taker",
      badge: "Included in Premium",
      status: "Coming Soon",
      description: "An advanced tool for optimising schedules, meetings and reminders. Ideal for users looking to enhance their organisational skills.",
      cta: "Notify Me",
      ctaIcon: "lucide:bell"
    }, {
      title: "Profinity Marketing Assistant",
      badge: "Included in Premium",
      status: "Coming Soon",
      description: "An advanced AI tool focused on enhancing creativity for design projects — suggestions for layouts, colour palettes and typography.",
      cta: "Notify Me",
      ctaIcon: "lucide:bell"
    }, {
      title: "AI Phone Receptionist",
      badge: "Included in Premium",
      status: "Coming Soon",
      description: "An advanced AI tool designed for comprehensive data interpretation, insightful research and proactive strategy development.",
      cta: "You're On The Waitlist",
      ctaIcon: "lucide:check",
      ctaDisabled: true
    }, {
      title: "Finance",
      badge: "Included in Premium",
      status: "Coming Soon",
      description: "An intelligent chatbot designed to handle customer inquiries, complaints and feedback efficiently. Perfect for improving service.",
      cta: "Notify Me",
      ctaIcon: "lucide:bell"
    }]
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/app/kit.jsx
try { (() => {
// Shared layout helpers for the app UI kit. Exposes window.Kit.
const {
  Icon
} = window.ProfinityDesignSystem_c2b5cc;
function Panel({
  title,
  action,
  onAction,
  children,
  padding = 20,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      padding,
      ...style
    }
  }, (title || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-semibold)",
      fontSize: "var(--fs-h3)",
      color: "var(--brand-navy)"
    }
  }, title), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-link)"
    }
  }, action)), children);
}

// Vertical rail stack
function Rail({
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      ...style
    }
  }, children);
}

// "Sort by: All" control
function SortBy({
  value = "All"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      color: "var(--gray-500)"
    }
  }, "Sort by:", /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      color: "var(--text-primary)",
      fontWeight: "var(--fw-medium)"
    }
  }, value, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16,
    color: "var(--gray-500)"
  })));
}
window.Kit = {
  Panel,
  Rail,
  SortBy
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/kit.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/main.jsx
try { (() => {
// App shell — sticky TopNav + screen switching, persisted in localStorage.
// Wrapped in an IIFE so the shell isn't exposed as a global component.
(function () {
  const {
    TopNav
  } = window.ProfinityDesignSystem_c2b5cc;
  const STORE_KEY = "profinity_app_screen";
  function ProfinityWebApp() {
    const screens = {
      Home: window.HomeScreen,
      Profile: window.ProfileScreen,
      "My Learning": window.LearningScreen,
      Community: window.CommunityScreen,
      Agent: window.AgentsScreen
    };
    const initial = (() => {
      try {
        return localStorage.getItem(STORE_KEY) || "Home";
      } catch (e) {
        return "Home";
      }
    })();
    const [active, setActive] = React.useState(screens[initial] ? initial : "Home");
    const go = label => {
      setActive(label);
      try {
        localStorage.setItem(STORE_KEY, label);
      } catch (e) {}
      window.scrollTo({
        top: 0
      });
    };
    const Active = screens[active] || window.HomeScreen;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 50
      }
    }, /*#__PURE__*/React.createElement(TopNav, {
      active: active,
      logoSrc: "../../assets/logos/profinity-academy-logo-full.png",
      user: window.APP_DATA.user,
      onNavigate: go
    })), /*#__PURE__*/React.createElement("main", null, Active ? /*#__PURE__*/React.createElement(Active, null) : null));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(ProfinityWebApp, null));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/main.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AgentMessage = __ds_scope.AgentMessage;

__ds_ns.AppointmentCard = __ds_scope.AppointmentCard;

__ds_ns.CourseCard = __ds_scope.CourseCard;

__ds_ns.AgentCard = __ds_scope.AgentCard;

__ds_ns.AgentHero = __ds_scope.AgentHero;

__ds_ns.ChannelHeader = __ds_scope.ChannelHeader;

__ds_ns.ChannelItem = __ds_scope.ChannelItem;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconifyIcon = __ds_scope.IconifyIcon;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Spark = __ds_scope.Spark;

__ds_ns.SuggestionChip = __ds_scope.SuggestionChip;

__ds_ns.CommentItem = __ds_scope.CommentItem;

__ds_ns.Composer = __ds_scope.Composer;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.PostActions = __ds_scope.PostActions;

__ds_ns.PostCard = __ds_scope.PostCard;

__ds_ns.ReactionGroup = __ds_scope.ReactionGroup;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.CourseTile = __ds_scope.CourseTile;

__ds_ns.LevelBadge = __ds_scope.LevelBadge;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.TopNav = __ds_scope.TopNav;

__ds_ns.AchievementChip = __ds_scope.AchievementChip;

__ds_ns.MembershipCard = __ds_scope.MembershipCard;

__ds_ns.ProfileHeader = __ds_scope.ProfileHeader;

__ds_ns.StatGroup = __ds_scope.StatGroup;

__ds_ns.VerificationSeals = __ds_scope.VerificationSeals;

})();
