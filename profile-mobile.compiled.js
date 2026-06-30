/* ===========================================================================
   PROfinity — Profile (mobile) · iPhone 17 Pro Max
   Composed on the bound DS bundle. Suffixed -PM to avoid global-scope clashes.
   =========================================================================== */
const {
  useState: useStatePM,
  useEffect: useEffectPM
} = React;
const DSPM = window.ProfinityDesignSystem_c2b5cc;
function goPM(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
const PM_ME = {
  name: "Katy Wilson",
  role: "Registered Nurse",
  avatar: "assets/avatar-katy.jpg",
  seals: ["gb", "verified", "crown", "gold"],
  bio: "Enhance patient satisfaction scores by 15% over the next 6 months through improved communication and personalized care planning.",
  followers: "1,546",
  following: "880",
  posts: "57",
  location: "London, United Kingdom",
  clinic: "Allcare Medical"
};
const PM_SERVICES = [{
  ti: "Botox (Anti-Wrinkle Injections)",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Dermal Fillers",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Lip Enhancement",
  su: "Career Academy: Dr Tim Pearce"
}, {
  ti: "Cheek & Jawline Contouring",
  su: "Career Academy: Dr Tim Pearce"
}];
const PM_EXPERIENCE = [{
  ti: "Registered Nurse",
  yrs: "12 years",
  org: "Generations Wellness Center",
  loc: "London, United Kingdom"
}, {
  ti: "Assistant Nurse",
  yrs: "12 years",
  org: "Generations Wellness Center",
  loc: "London, United Kingdom"
}];
const PM_LICENSES = ["The Ultimate Toxin Eye Complications Masterclass", "Anatomy360", "Pro Tox Course", "8D Lips Course", "Botox Foundations"];
const PM_ACTIVITY = [{
  name: "Katy Wilson",
  loc: "London, United Kingdom",
  time: "Today",
  avatar: "assets/avatar-katy.jpg",
  title: "Temple Filler Techniques",
  body: "One of the biggest challenges in clinical practice? Paperwork. Since switching to PROfinity, consent forms, treatment records, and post-consult notes are now digital, organized, and secure — saving me time and giving patients a clearer, more confident experience.\n#DigitalHealth #PatientCare #ClinicianTools #PROfinity",
  likes: "1.2K",
  comments: "150",
  shares: "150"
}, {
  name: "James Lee",
  loc: "Sydney, Australia",
  time: "Yesterday",
  avatar: null,
  title: "Advanced Suturing Techniques",
  body: "In my surgical practice, time is precious. That's why I was thrilled to discover the ease of digital record-keeping with PROfinity. Documentation has never been simpler — everything I need is just a few taps away.\n#Surgery #PatientSafety #MedicalTech #PROfinity",
  likes: "850",
  comments: "200",
  shares: "180"
}, {
  name: "Linda Garcia",
  loc: "Toronto, Canada",
  time: "Last Week",
  avatar: null,
  title: "Emerging Technologies in Dentistry",
  body: "The dental field is evolving rapidly, and so should our approach to documentation. From treatment plans to follow-up notes, everything is handled digitally — less clutter, more focus on patient interactions.\n#DentalCare #TechInDentistry #PROfinity #FutureOfHealthcare",
  likes: "1.5K",
  comments: "120",
  shares: "200"
}];
const PM_TABS = [{
  key: "Home",
  label: "Home",
  icon: "lucide:home",
  href: "NewsfeedMobile.html"
}, {
  key: "Profile",
  label: "Profile",
  icon: "lucide:user",
  href: null
}, {
  key: "Learning",
  label: "My Learning",
  icon: "lucide:book-open",
  href: "LearningMobile.html"
}, {
  key: "Community",
  label: "Community",
  icon: "lucide:users",
  href: "CommunityMobile.html",
  dot: "12"
}, {
  key: "Agent",
  label: "Agent",
  icon: "lucide:sparkles",
  href: "Agent.html"
}];
function PMTopBar() {
  return /*#__PURE__*/React.createElement("header", {
    className: "pm-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-burger",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:menu",
    size: 24,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("img", {
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  }), /*#__PURE__*/React.createElement("span", {
    className: "grow"
  }), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
    name: "search",
    size: 21,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:bell",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")), /*#__PURE__*/React.createElement("button", {
    className: "pm-iconbtn",
    "aria-label": "Messages"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 21,
    color: "var(--brand-navy)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "12")));
}
function PMTabBar() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "pm-tabs",
    "aria-label": "Primary"
  }, PM_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: "pm-tab" + (t.key === "Profile" ? " on" : ""),
    "aria-current": t.key === "Profile" ? "page" : undefined,
    onClick: () => t.href && goPM(t.href)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: t.icon,
    size: 23,
    color: t.key === "Profile" ? "var(--brand-navy)" : "var(--gray-450)"
  }), t.dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, t.dot)), t.label)));
}
function VerifyBanner() {
  const [open, setOpen] = useStatePM(true);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-verify"
  }, /*#__PURE__*/React.createElement("button", {
    className: "x",
    "aria-label": "Dismiss",
    onClick: () => setOpen(false)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "var(--gray-700)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hd"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "fluent:shield-checkmark-16-filled",
    size: 30,
    color: "var(--verify-check,#1f8ddb)"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "Verify your medical credentials"), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, "Adding more credentials helps people know you're the real deal."))), /*#__PURE__*/React.createElement("button", {
    className: "full",
    type: "button"
  }, "Edit Page"));
}
function PMSection({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", null, title), /*#__PURE__*/React.createElement("span", {
    className: "pm-sec-tools"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-tool",
    "aria-label": "Add to " + title
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:plus",
    size: 19,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "pm-tool",
    "aria-label": "Edit " + title
  }, /*#__PURE__*/React.createElement(DSPM.Icon, {
    name: "edit",
    size: 17,
    color: "var(--brand-navy)"
  })))), children);
}
function PMMentor() {
  const [done, setDone] = useStatePM(false);
  if (done) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor-hd"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "fluent:people-team-16-filled",
    size: 22,
    color: "var(--ai-purple)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "Find a mentor")), /*#__PURE__*/React.createElement("p", {
    className: "s"
  }, "Connecting with a mentor can accelerate your professional growth."), /*#__PURE__*/React.createElement("div", {
    className: "pm-mentor-act"
  }, /*#__PURE__*/React.createElement("button", {
    className: "no",
    onClick: () => setDone(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:x",
    size: 18,
    color: "var(--error)"
  }), "No"), /*#__PURE__*/React.createElement("button", {
    className: "yes",
    onClick: () => setDone(true)
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:check",
    size: 18,
    color: "var(--success)"
  }), "Yes")));
}
function PMPost({
  p
}) {
  const lines = p.body.split("\n");
  return /*#__PURE__*/React.createElement("article", {
    className: "pm-post"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-post-hd"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: p.name,
    src: p.avatar,
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    className: "pm-post-by"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, p.name, /*#__PURE__*/React.createElement("span", {
    className: "loc"
  }, p.loc)), /*#__PURE__*/React.createElement("span", {
    className: "tm"
  }, p.time)), /*#__PURE__*/React.createElement("button", {
    className: "pm-post-more",
    "aria-label": "More options"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 20,
    color: "var(--gray-450)"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "pm-post-ttl"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "pm-post-body"
  }, lines[0], lines[1] && /*#__PURE__*/React.createElement("span", {
    className: "tags"
  }, " ", lines[1])), /*#__PURE__*/React.createElement("div", {
    className: "pm-post-eng"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:thumbs-up",
    size: 17,
    color: "var(--gray-500)"
  }), p.likes), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:message-circle",
    size: 17,
    color: "var(--gray-500)"
  }), p.comments), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:share-2",
    size: 17,
    color: "var(--gray-500)"
  }), p.shares)));
}
function PMActivity() {
  return /*#__PURE__*/React.createElement("section", {
    className: "pm-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-sec-h"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "20px"
    }
  }, "Activity")), /*#__PURE__*/React.createElement("div", {
    className: "pm-activity"
  }, PM_ACTIVITY.map((p, i) => /*#__PURE__*/React.createElement(PMPost, {
    key: i,
    p: p
  }))), /*#__PURE__*/React.createElement("button", {
    className: "pm-showall",
    onClick: () => goPM("NewsfeedMobile.html")
  }, "Show all posts"));
}
function useDeviceScalePM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStatePM(calc);
  useEffectPM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobilePM() {
  const [mobile, setMobile] = useStatePM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectPM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function PMScreen() {
  const m = PM_ME;
  return /*#__PURE__*/React.createElement("div", {
    className: "pm-screen",
    "data-screen-label": "Profile (mobile)"
  }, /*#__PURE__*/React.createElement(PMTopBar, null), /*#__PURE__*/React.createElement("div", {
    className: "pm-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-avwrap"
  }, /*#__PURE__*/React.createElement(DSPM.Avatar, {
    name: m.name,
    src: m.avatar,
    size: 92,
    className: "pm-ig-av"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.posts), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "posts")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.followers), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "followers")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, m.following), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "following")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, m.name), /*#__PURE__*/React.createElement("span", {
    className: "pn"
  }, m.role), /*#__PURE__*/React.createElement(DSPM.VerificationSeals, {
    seals: ["verified", "crown", "gold"],
    size: 20
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/badge-m.svg",
    alt: "Member badge",
    width: "20",
    height: "20",
    style: {
      marginLeft: -5
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-bio"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "\uD83C\uDDEC\uD83C\uDDE7"), " Aesthetic Nurse Practitioner"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "bi"
  }, "\uD83D\uDC89"), " Botox \xB7 Fillers \xB7 Lip Enhancement"), /*#__PURE__*/React.createElement("p", null, m.bio)), /*#__PURE__*/React.createElement("a", {
    className: "pm-ig-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:link",
    size: 17,
    color: "var(--ai-purple)"
  }), "allcaremedical.co.uk"), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pm-chip"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:map-pin",
    size: 16,
    color: "var(--brand-navy)"
  }), m.location), /*#__PURE__*/React.createElement("span", {
    className: "pm-chip"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:building-2",
    size: 16,
    color: "var(--brand-navy)"
  }), m.clinic), /*#__PURE__*/React.createElement("span", {
    className: "pm-chip add"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:plus",
    size: 16,
    color: "var(--gray-500)"
  }), "Add")), /*#__PURE__*/React.createElement("div", {
    className: "pm-ig-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn",
    onClick: () => goPM("ProfileMobile.html")
  }, "Edit Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn"
  }, "Share Profile"), /*#__PURE__*/React.createElement("button", {
    className: "pm-ig-btn icon",
    "aria-label": "Add people"
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:user-plus",
    size: 20,
    color: "var(--brand-navy)"
  })))), /*#__PURE__*/React.createElement(VerifyBanner, null), /*#__PURE__*/React.createElement(PMMentor, null), /*#__PURE__*/React.createElement(PMActivity, null), /*#__PURE__*/React.createElement(PMSection, {
    title: "Services"
  }, PM_SERVICES.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, s.ti), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, s.su)))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Experience"
  }, PM_EXPERIENCE.map((e, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, e.ti), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, e.yrs), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, e.org), /*#__PURE__*/React.createElement("div", {
    className: "su flag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, "\uD83C\uDDEC\uD83C\uDDE7"), e.loc)))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Education"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow media"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-logo"
  }, "JH"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "Johns Hopkins University of USA"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Clinical Foundations of Medicine"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "1990 - 2020")))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Licenses & Certifications"
  }, PM_LICENSES.map((l, i) => /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow media",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-logo cert"
  }, "P"), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, l), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Profinity Academy"), /*#__PURE__*/React.createElement("div", {
    className: "su muted"
  }, "Issued January 2008"))))), /*#__PURE__*/React.createElement(PMSection, {
    title: "Language"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lang"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, "\uD83C\uDDEC\uD83C\uDDE7"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "English (UK)"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Primary")))), /*#__PURE__*/React.createElement("div", {
    className: "pm-lrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pm-lang"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fl"
  }, "\uD83C\uDDEE\uD83C\uDDF9"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ti"
  }, "Italian"), /*#__PURE__*/React.createElement("div", {
    className: "su"
  }, "Secondary"))))), /*#__PURE__*/React.createElement("button", {
    className: "pm-logout",
    onClick: () => goPM("NewsfeedMobile.html")
  }, /*#__PURE__*/React.createElement(DSPM.IconifyIcon, {
    name: "lucide:log-out",
    size: 20,
    color: "var(--error)"
  }), "Logout")), /*#__PURE__*/React.createElement(PMTabBar, null));
}
function ProfileMobileApp() {
  const mobile = useIsMobilePM();
  const scale = useDeviceScalePM();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement(PMScreen, null));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: vars
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956
  }, /*#__PURE__*/React.createElement(PMScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(ProfileMobileApp, null));