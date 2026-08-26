/* ===========================================================================
   PROfinity — Account Settings (web)
   Desktop settings surface at /settings. Ports the mobile Account Settings
   screen (account-settings.jsx) — profile shortcuts + the Display/dark-mode
   card — onto the same TopNav shell used by NotificationSettingsWeb.
   Suffixed -ASW to avoid clashing with the mobile Account Settings (-AS).
   =========================================================================== */
const {
  useState: useStateASW
} = React;
const DSASW = window.ProfinityDesignSystem_c2b5cc;
const {
  TopNav: TopNavASW,
  IconifyIcon: IconASW
} = DSASW;
const ME_ASW = {
  name: "Katy Wilson",
  role: "Nurse Practitioner",
  avatar: "assets/avatar-katy.jpg"
};
function goASW(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function navigateASW(label) {
  var u = {
    Home: "NewsfeedWeb.html",
    Profile: "Profile.html",
    "My Learning": "MyLearning.html",
    Community: "Community.html",
    Agent: "Agent.html"
  }[label];
  if (u) goASW(u);
}
function useDarkModeASW() {
  const [dark, setDark] = useStateASW(() => {
    try {
      return localStorage.getItem("pf-theme") === "dark";
    } catch (e) {
      return false;
    }
  });
  function toggle() {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem("pf-theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    } catch (e) {}
  }
  return [dark, toggle];
}
const ASW_ITEMS_BEFORE = [{
  label: "Edit Profile",
  icon: "lucide:user",
  desc: "Update your photo, bio and credentials.",
  href: "Profile.html"
}, {
  label: "My Saved",
  icon: "lucide:bookmark",
  desc: "Posts, lessons and events you've bookmarked.",
  href: null
}, {
  label: "Notifications",
  icon: "lucide:bell",
  desc: "Choose what updates you receive and how.",
  href: "NotificationSettingsWeb.html"
}];
const ASW_ITEMS_AFTER = [{
  label: "Privacy & Security",
  icon: "lucide:shield",
  desc: "Manage password, sign-in and data sharing.",
  href: null
}];
function AswRow({
  icon,
  label,
  desc,
  href
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "asw-row" + (href ? "" : " asw-row-disabled"),
    onClick: () => href && goASW(href),
    disabled: !href
  }, /*#__PURE__*/React.createElement("span", {
    className: "asw-row-icon"
  }, /*#__PURE__*/React.createElement(IconASW, {
    name: icon,
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "asw-row-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "asw-row-label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "asw-row-desc"
  }, desc)), href && /*#__PURE__*/React.createElement(IconASW, {
    name: "lucide:chevron-right",
    size: 18,
    color: "var(--gray-450)"
  }));
}
function AswDarkSwitch({
  on,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "asw-switch" + (on ? " on" : ""),
    onClick: onToggle,
    role: "switch",
    "aria-checked": on,
    "aria-label": on ? "Switch to light mode" : "Switch to dark mode"
  }, /*#__PURE__*/React.createElement("span", {
    className: "asw-knob"
  }, /*#__PURE__*/React.createElement(IconASW, {
    name: on ? "lucide:moon" : "lucide:sun",
    size: 13,
    color: on ? "#1A1736" : "var(--gray-450)"
  })));
}
function AccountSettingsWeb() {
  const [dark, toggleDark] = useDarkModeASW();
  return /*#__PURE__*/React.createElement("div", {
    className: "app wa-screen",
    style: {
      "--action-primary": "var(--brand-navy)",
      "--action-primary-hover": "var(--brand-navy-700)"
    }
  }, /*#__PURE__*/React.createElement(TopNavASW, {
    user: ME_ASW,
    logoSrc: "assets/profinity-icon-purple-gold.png",
    onNavigate: navigateASW,
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid var(--border-default)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "nsw-page",
    "data-screen-label": "Account Settings (web)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nsw-head-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nsw-back",
    "aria-label": "Back",
    onClick: () => goASW("NewsfeedWeb.html")
  }, /*#__PURE__*/React.createElement(IconASW, {
    name: "lucide:arrow-left",
    size: 18,
    color: "var(--text-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nsw-head-titles"
  }, /*#__PURE__*/React.createElement("h1", null, "Settings"), /*#__PURE__*/React.createElement("p", null, "Manage your profile, notifications and how PROfinity looks."))), /*#__PURE__*/React.createElement("div", {
    className: "nsw-crumb"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => goASW("NewsfeedWeb.html")
  }, "Home"), " / Settings"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "asw-verify",
    onClick: () => goASW("Profile.html")
  }, /*#__PURE__*/React.createElement(IconASW, {
    name: "lucide:badge-check",
    size: 20,
    color: "var(--premium-orange)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "asw-verify-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "asw-row-label"
  }, "Verify your medical credentials"), /*#__PURE__*/React.createElement("span", {
    className: "asw-row-desc"
  }, "Adding more credentials helps people know you're the real deal.")), /*#__PURE__*/React.createElement("span", {
    className: "asw-verify-pill"
  }, "Not Verified")), /*#__PURE__*/React.createElement("div", {
    className: "nsw-grid"
  }, /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, "My Profile")), /*#__PURE__*/React.createElement("div", {
    className: "asw-list"
  }, ASW_ITEMS_BEFORE.map(item => /*#__PURE__*/React.createElement(AswRow, {
    key: item.label,
    ...item
  })))), /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Appearance")), /*#__PURE__*/React.createElement("div", {
    className: "nsw-card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "asw-display-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "asw-row-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "asw-row-label"
  }, "Dark mode"), /*#__PURE__*/React.createElement("span", {
    className: "asw-row-desc"
  }, "Adjust the appearance of the app to reduce glare and give your eyes a break.")), /*#__PURE__*/React.createElement(AswDarkSwitch, {
    on: dark,
    onToggle: toggleDark
  })))), /*#__PURE__*/React.createElement("section", {
    className: "nsw-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "nsw-card-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Privacy")), /*#__PURE__*/React.createElement("div", {
    className: "asw-list"
  }, ASW_ITEMS_AFTER.map(item => /*#__PURE__*/React.createElement(AswRow, {
    key: item.label,
    ...item
  }))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "asw-logout",
    onClick: () => goASW("AuthWeb.html?view=loggedout")
  }, /*#__PURE__*/React.createElement(IconASW, {
    name: "lucide:log-out",
    size: 18,
    color: "var(--brand-navy)"
  }), "Log out"), /*#__PURE__*/React.createElement("div", {
    className: "asw-footer"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Privacy Policy"))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(AccountSettingsWeb, null));
