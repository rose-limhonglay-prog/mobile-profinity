/* ===========================================================================
   PROfinity — Katy · Daily Goal Reached · iPhone 17 Pro Max
   Full page (not a modal) that opens each time the day's earned points
   cross another 50-point mark (50, 100, 150 … — see daily-goal.js, which
   listens to pf:points-earned on every earning page and navigates here).
   Celebrates with the check-in doctor avatar (Lottie), shows today's total /
   day streak / actions, nudges Katy to keep earning and opens a
   Duolingo-style share sheet (shareable stat card + Instagram / Facebook /
   Messages / Save / More). Fixed navy palette so it reads the same in both themes.
   Suffixed -DG to avoid clashes with other pages.
   =========================================================================== */
const {
  useState: useStateDG,
  useEffect: useEffectDG,
  useRef: useRefDG,
  useMemo: useMemoDG
} = React;
const DSDG = window.ProfinityDesignSystem_c2b5cc;
const PF_DG = window.PFLoyalty;

/* Hero mascot: the same doctor-with-glasses avatar the daily check-in
   "Welcome back" screen uses (assets/lottie/checkin-welcome.json), replacing
   the earlier lottie.host falling-star comet. 800×600 (4:3) — .dg-hero is
   sized to match so the svg fills the box without letterboxing. */
const DG_LOTTIE = "assets/lottie/checkin-welcome.json?v=20260917d";
const DG_CONFETTI = "https://lottie.host/1b8bdd21-9711-48bb-873f-3889b01b43c8/jrTeYYuQqi.json";
const DG_GOAL = window.PFDailyGoal && window.PFDailyGoal.goal || window.PF_DAILY_GOAL || 50;
function goDG(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}

/* ?ret= is where "Keep earning" and the close button go back to — the page
   Katy was browsing when the goal tipped over. Only relative page names are
   honoured so the param can't be used to bounce somewhere else. Without it
   (opened directly) fall back to the same-origin page that linked here, and
   failing that the newsfeed. */
function returnUrlDG() {
  const raw = new URLSearchParams(location.search).get("ret") || "";
  const ok = /^[A-Za-z0-9_\-]+\.html(\?[^#]*)?$/.test(raw);
  if (ok) return raw;
  try {
    const r = new URL(document.referrer);
    const page = r.pathname.split("/").pop();
    if (r.origin === location.origin && /^[A-Za-z0-9_\-]+\.html$/.test(page) && page !== "DailyGoal.html") return page + r.search;
  } catch (e) {/* no referrer */}
  return "NewsfeedMobile.html";
}
function dayKeyDG(d) {
  const dt = d ? new Date(d) : new Date();
  return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}
function todayStatsDG(state) {
  const today = dayKeyDG();
  let points = 0,
    actions = 0;
  (state.ledger || []).forEach(t => {
    if (t.pointsDelta > 0 && dayKeyDG(t.ts) === today) {
      points += t.pointsDelta;
      actions += 1;
    }
  });
  /* daily-goal.js keeps its own tally for earns that never reach the ledger */
  try {
    const local = JSON.parse(localStorage.getItem("pf-daily-goal") || "null");
    if (local && local.day === today && local.earned > points) points = local.earned;
  } catch (e) {/* ignore */}
  const demo = new URLSearchParams(location.search).get("pts");
  if (demo && +demo > 0) points = +demo;
  return {
    points,
    actions
  };
}

/* Count-up for the headline number */
function useCountUpDG(target, ms) {
  const [v, setV] = useStateDG(0);
  useEffectDG(() => {
    let raf,
      t0 = null;
    const step = t => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / (ms || 900));
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const delay = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 350);
    return () => {
      clearTimeout(delay);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, ms]);
  return v;
}
function DgLottie() {
  const host = useRefDG(null);
  useEffectDG(() => {
    let anim,
      dead = false;
    const start = () => {
      if (dead || !window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: DG_LOTTIE
      });
    };
    if (window.lottie) start();else {
      const iv = setInterval(() => {
        if (window.lottie) {
          clearInterval(iv);
          start();
        }
      }, 120);
      setTimeout(() => clearInterval(iv), 8000);
    }
    return () => {
      dead = true;
      if (anim) anim.destroy();
    };
  }, []);
  return /*#__PURE__*/React.createElement("span", {
    ref: host,
    className: "dg-lottie",
    "aria-hidden": "true"
  });
}

/* Gold coin glyph for the Today tile (filled, so it reads as a coin rather
   than an outline) */
function CoinDG({
  size
}) {
  const sz = size || 18;
  return /*#__PURE__*/React.createElement("svg", {
    className: "dg-coin",
    width: sz,
    height: sz,
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "dgCoinG",
    x1: "4",
    y1: "3",
    x2: "20",
    y2: "21",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#ffe08a"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#e7a020"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10.5",
    fill: "url(#dgCoinG)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "7.6",
    fill: "none",
    stroke: "#b8730c",
    strokeWidth: "1.4",
    strokeOpacity: ".75"
  }), /*#__PURE__*/React.createElement("text", {
    x: "12",
    y: "16.2",
    textAnchor: "middle",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: "700",
    fontSize: "11.5",
    fill: "#8a5507"
  }, "P"));
}

/* Brand glyphs for the share sheet — drawn inline so nothing depends on an
   icon collection the preloader doesn't carry */
function BrandDG({
  k
}) {
  if (k === "profinity") return /*#__PURE__*/React.createElement("img", {
    className: "dg-sh-pf",
    src: "assets/profinity-icon-purple-gold.png",
    alt: ""
  });
  if (k === "instagram") return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "30",
    height: "30",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "20",
    rx: "5.5",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4.4",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.4",
    cy: "6.6",
    r: "1.25",
    fill: "#fff"
  }));
  if (k === "facebook") return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "34",
    height: "34",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M13.6 21v-7.9h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.8v3.1h2.7V21h3.1z"
  }));
  /* messages */
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "30",
    height: "30",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#2e5bff",
    d: "M12 3.5c-4.9 0-8.8 3.4-8.8 7.6 0 2.1 1 4 2.6 5.4L5.2 20l3.9-1.6c.9.3 1.9.4 2.9.4 4.9 0 8.8-3.4 8.8-7.6S16.9 3.5 12 3.5z"
  }));
}
const DG_SHARE_APPS = [{
  k: "profinity",
  label: "PROfinity"
}, {
  k: "instagram",
  label: "Instagram"
}, {
  k: "facebook",
  label: "Facebook"
}, {
  k: "messages",
  label: "Messages"
}];

/* Duolingo-style share screen: a light, shareable stat card on a dark
   backdrop, then a bottom sheet of destinations */
function DgShareSheet({
  first,
  points,
  streak,
  actions,
  onClose,
  onPick
}) {
  useEffectDG(() => {
    const onKey = e => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "dg-sh",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Share"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-card"
  }, /*#__PURE__*/React.createElement("p", {
    className: "dg-sh-say"
  }, "I’m smashing my daily goal on PROfinity!"), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-mascot",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(DgLottie, null)), /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-rows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-ri is-gold"
  }, /*#__PURE__*/React.createElement(CoinDG, {
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-rl"
  }, "Points earned"), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-rv"
  }, points)), /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-ri is-green"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:flame",
    size: 20,
    color: "#e8611a"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-rl"
  }, "Day streak"), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-rv"
  }, streak)), /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-ri is-blue"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:check-check",
    size: 20,
    color: "#1d8fd1"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-rl"
  }, "Actions today"), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-rv"
  }, actions))), /*#__PURE__*/React.createElement("img", {
    className: "dg-sh-logo",
    src: "assets/profinity-academy-logo-full.png",
    alt: "PROfinity Academy"
  })), /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-caption"
  }, "Goal reached!")), /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-sheet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-hd"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dg-sh-x",
    onClick: onClose,
    "aria-label": "Close share"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:x",
    size: 22,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-ti"
  }, "Share")), /*#__PURE__*/React.createElement("div", {
    className: "dg-sh-grid"
  }, DG_SHARE_APPS.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.k,
    type: "button",
    className: "dg-sh-app-btn is-" + a.k,
    onClick: () => onPick(a.k, a.label)
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-circ"
  }, /*#__PURE__*/React.createElement(BrandDG, {
    k: a.k
  })), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-lab"
  }, a.label))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dg-sh-app-btn is-plain",
    onClick: () => onPick("save", "Save")
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-circ"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:download",
    size: 26,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-lab"
  }, "Save")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "dg-sh-app-btn is-plain",
    onClick: () => onPick("more", "More")
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-circ"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:more-horizontal",
    size: 26,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dg-sh-lab"
  }, "More")))));
}

/* Full-frame confetti (lottie.host burst): plays DG_CONFETTI_PLAYS times,
   then fades the layer out and frees the animation. lottie-web's numeric
   `loop` is the number of *repeats*, so PLAYS - 1 repeats = PLAYS full runs. */
const DG_CONFETTI_PLAYS = 2;
function DgConfetti() {
  const host = useRefDG(null);
  useEffectDG(() => {
    let anim,
      dead = false;
    const start = () => {
      if (dead || !window.lottie || !host.current) return;
      anim = window.lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: DG_CONFETTI_PLAYS - 1,
        autoplay: true,
        path: DG_CONFETTI,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      });
      anim.addEventListener("complete", () => {
        const el = host.current;
        if (el) el.classList.add("is-done");
        const a = anim;
        anim = null;
        setTimeout(() => {
          if (a) a.destroy();
          if (el && el.classList.contains("is-done")) el.innerHTML = "";
        }, 700);
      });
    };
    if (window.lottie) start();else {
      const iv = setInterval(() => {
        if (window.lottie) {
          clearInterval(iv);
          start();
        }
      }, 120);
      setTimeout(() => clearInterval(iv), 8000);
    }
    return () => {
      dead = true;
      if (anim) anim.destroy();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: host,
    className: "dg-confetti",
    "aria-hidden": "true"
  });
}
function DailyGoalScreen() {
  const [state] = useStateDG(() => PF_DG.getState());
  const [toast, setToast] = useStateDG(null);
  const [sharing, setSharing] = useStateDG(false);
  const flash = m => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };
  const {
    points,
    actions
  } = useMemoDG(() => todayStatsDG(state), [state]);
  const shown = useCountUpDG(points, 1000);
  const streak = state.streak && state.streak.current || 0;
  const tier = state.user && state.user.membershipTier || "Confidence";
  const first = state.user && state.user.name ? state.user.name.split(" ")[0] : "";

  /* the 50-point mark just crossed — 50 the first time, then 100, 150 … */
  const mark = Math.max(DG_GOAL, Math.floor(points / DG_GOAL) * DG_GOAL);
  const ret = returnUrlDG();
  const shareText = "🔥 " + (streak > 0 ? streak + "-day streak on PROfinity and " : "") + points + " points banked today — daily goal smashed! Come and earn with me.";
  const shareUrl = location.origin + location.pathname.replace(/[^/]*$/, "") + "NewsfeedMobile.html";

  /* copy-to-clipboard fallback when there's no native share sheet */
  const copyShare = () => {
    const copy = shareText + " " + shareUrl;
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      flash("Copied — paste it anywhere");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copy).then(done, done);
      setTimeout(done, 600);
    } else {
      try {
        const ta = document.createElement("textarea");
        ta.value = copy;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      } catch (e) {/* ignore */}
      done();
    }
  };
  const nativeShare = fallback => {
    if (navigator.share) {
      navigator.share({
        title: "My PROfinity streak",
        text: shareText,
        url: shareUrl
      }).then(() => flash("Shared — nice one")).catch(err => {
        if (!err || err.name !== "AbortError") fallback();
      });
      return true;
    }
    return false;
  };
  const share = () => setSharing(true);
  /* Snapshot the share card (while the sheet is still mounted) to a PNG data
     URL. Resolves null if html2canvas is missing or the capture fails so
     callers can fall back to a text-only share. */
  const captureCard = () => {
    const el = document.querySelector(".dg-sh-card");
    if (!el || !window.html2canvas) return Promise.resolve(null);
    /* html2canvas can't paint the Lottie SVG (masks/clip-paths), so rasterise
       the live <svg> to a PNG first and drop that into the clone instead */
    const rasterMascot = () => new Promise(resolve => {
      const svg = el.querySelector(".dg-sh-mascot svg");
      if (!svg) return resolve(null);
      try {
        const r = svg.getBoundingClientRect();
        const xml = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
          try {
            const c = document.createElement("canvas");
            c.width = Math.round(r.width * 2);
            c.height = Math.round(r.height * 2);
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            resolve(c.toDataURL("image/png"));
          } catch (e) {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
      } catch (e) {
        resolve(null);
      }
    });
    return rasterMascot().then(mascotPng => {
      /* the clone restarts entrance animations from opacity 0 — switch them off */
      const onclone = doc => {
        doc.querySelectorAll(".dg-sh, .dg-sh-card, .dg-sh-card *").forEach(n => {
          n.style.animation = "none";
          n.style.opacity = "1";
          n.style.transform = "none";
        });
        const card = doc.querySelector(".dg-sh-card");
        if (card) card.style.boxShadow = "none";
        const m = doc.querySelector(".dg-sh-mascot");
        if (m && mascotPng) {
          m.innerHTML = "";
          const im = doc.createElement("img");
          im.src = mascotPng;
          im.style.cssText = "display:block;width:100%;height:100%";
          m.appendChild(im);
        }
      };
      /* The feed shows single images as a 1:1 square (object-fit: cover), so
         centre the card on a square navy backdrop rather than letting the
         top and bottom get cropped. */
      const squareUp = c => {
        const pad = 56,
          side = Math.max(c.width, c.height) + pad * 2;
        const out = document.createElement("canvas");
        out.width = side;
        out.height = side;
        const g = out.getContext("2d");
        const grad = g.createRadialGradient(side / 2, side * .3, side * .1, side / 2, side / 2, side * .8);
        grad.addColorStop(0, "#332d76");
        grad.addColorStop(1, "#14122f");
        g.fillStyle = grad;
        g.fillRect(0, 0, side, side);
        g.shadowColor = "rgba(0,0,0,.55)";
        g.shadowBlur = 60;
        g.shadowOffsetY = 24;
        g.drawImage(c, Math.round((side - c.width) / 2), Math.round((side - c.height) / 2));
        return out;
      };
      return window.html2canvas(el, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        onclone
      }).then(c => squareUp(c).toDataURL("image/png")).catch(() => null);
    });
  };
  /* "PROfinity" destination: post the card image into the same store the
     composer writes (pf-newsfeed-user-posts, read by NewsfeedMobile) and
     open the feed on it. Falls back to a navy text card if the snapshot fails. */
  const postToFeed = img => {
    const me = state.user && state.user.name || "Katy Wilson";
    const body = "🎯 Daily goal reached! " + points + " pts banked today" + (streak > 0 ? " · " + streak + "-day streak 🔥" : "") + ". Every point counts toward " + tier + " — who's earning with me?";
    const post = {
      id: "u" + Date.now(),
      author: {
        name: me,
        avatar: state.user && state.user.avatar || "assets/avatar-katy.jpg",
        seals: ["gb", "verified"]
      },
      time: "Just now",
      hashtags: ["dailygoal"],
      media: img ? [img] : [],
      body,
      bg: img ? null : {
        id: "navy",
        css: "linear-gradient(150deg,#292569,#3d3688)",
        fg: "#fff"
      },
      video: null,
      live: false,
      likes: "0",
      comments: "0",
      shares: "0",
      commentList: []
    };
    try {
      const existing = JSON.parse(localStorage.getItem("pf-newsfeed-user-posts")) || [];
      localStorage.setItem("pf-newsfeed-user-posts", JSON.stringify([post, ...existing]));
    } catch (e) {/* ignore */}
    flash("Posted to your feed");
    setTimeout(() => goDG("NewsfeedMobile.html"), 700);
  };
  /* Sheet destination tapped. Apps hand off to the OS share sheet when there
     is one; otherwise the text is copied ready to paste into that app. */
  const pickShare = (k, label) => {
    if (k === "profinity") {
      captureCard().then(img => {
        setSharing(false);
        postToFeed(img);
      });
      return;
    }
    if (k === "save") {
      captureCard().then(img => {
        setSharing(false);
        if (img) {
          try {
            const a = document.createElement("a");
            a.href = img;
            a.download = "profinity-daily-goal.png";
            document.body.appendChild(a);
            a.click();
            a.remove();
          } catch (e) {/* ignore */}
        }
        flash("Saved to Photos");
      });
      return;
    }
    setSharing(false);
    if (k === "more") {
      if (!nativeShare(copyShare)) copyShare();
      return;
    }
    if (k === "messages") {
      if (nativeShare(copyShare)) return;
      try {
        window.location.href = "sms:?&body=" + encodeURIComponent(shareText + " " + shareUrl);
      } catch (e) {/* ignore */}
      copyShare();
      return;
    }
    if (!nativeShare(() => {
      copyShare();
    })) {
      const copy = shareText + " " + shareUrl;
      const done = () => flash("Copied — paste it into " + label);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(copy).then(done, done);else copyShare();
    }
  };
  useEffectDG(() => {
    const onKey = e => {
      if (e.key === "Escape" && !sharing) goDG(ret);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ret, sharing]);

  /* announce the celebration once on mount — points-sound.js plays the streak fanfare */
  useEffectDG(() => {
    try {
      window.dispatchEvent(new CustomEvent("pf:daily-goal", {
        detail: {
          points,
          mark
        }
      }));
    } catch (e) {/* older WebView */}
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "dg-screen",
    "data-screen-label": "Daily Goal Reached"
  }, /*#__PURE__*/React.createElement(DgConfetti, null), /*#__PURE__*/React.createElement("span", {
    className: "dg-glow",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("button", {
    className: "dg-close",
    type: "button",
    "aria-label": "Close",
    onClick: () => goDG(ret)
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:x",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "dg-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dg-hero"
  }, /*#__PURE__*/React.createElement(DgLottie, null)), /*#__PURE__*/React.createElement("div", {
    className: "dg-kicker"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:target",
    size: 13,
    color: "currentColor"
  }), " Daily goal"), /*#__PURE__*/React.createElement("h1", {
    className: "dg-title"
  }, "Goal reached", first ? ", " + first : "", "!"), /*#__PURE__*/React.createElement("p", {
    className: "dg-sub"
  }, "You've banked ", /*#__PURE__*/React.createElement("b", null, points, " pts"), " today — ", mark > DG_GOAL ? "that's your " + mark + "-point mark, " + mark / DG_GOAL + "× your " + DG_GOAL + "-point goal" : "past your " + DG_GOAL + "-point goal", ". Every point from here still counts toward your ", tier, " tier and this week's leaderboard, so keep it rolling."), /*#__PURE__*/React.createElement("div", {
    className: "dg-stats",
    role: "list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dg-stat is-gold",
    role: "listitem",
    style: {
      "--d": "120ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-stat-h"
  }, "Today"), /*#__PURE__*/React.createElement("span", {
    className: "dg-stat-v"
  }, /*#__PURE__*/React.createElement(CoinDG, {
    size: 19
  }), " ", shown)), /*#__PURE__*/React.createElement("div", {
    className: "dg-stat is-green",
    role: "listitem",
    style: {
      "--d": "230ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-stat-h"
  }, "Streak"), /*#__PURE__*/React.createElement("span", {
    className: "dg-stat-v"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:flame",
    size: 18,
    color: "currentColor"
  }), " ", streak, /*#__PURE__*/React.createElement("small", null, streak === 1 ? " day" : " days"))), /*#__PURE__*/React.createElement("div", {
    className: "dg-stat is-blue",
    role: "listitem",
    style: {
      "--d": "340ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dg-stat-h"
  }, "Actions"), /*#__PURE__*/React.createElement("span", {
    className: "dg-stat-v"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:check-check",
    size: 18,
    color: "currentColor"
  }), " ", Math.max(actions, 1))))), /*#__PURE__*/React.createElement("div", {
    className: "dg-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dg-btn-share",
    type: "button",
    onClick: share,
    "aria-label": "Share"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:share",
    size: 20,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("button", {
    className: "dg-btn-cta",
    type: "button",
    onClick: () => goDG(ret)
  }, "Keep earning ", /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:arrow-right",
    size: 18,
    color: "currentColor"
  }))), sharing && /*#__PURE__*/React.createElement(DgShareSheet, {
    first: first,
    points: points,
    streak: streak,
    actions: Math.max(actions, 1),
    onClose: () => setSharing(false),
    onPick: pickShare
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "ml-toast dg-toast",
    role: "status"
  }, /*#__PURE__*/React.createElement(DSDG.IconifyIcon, {
    name: "lucide:check",
    size: 16,
    color: "#fff"
  }), toast));
}
function useDeviceScaleDG() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateDG(calc);
  useEffectDG(() => {
    const u = () => setScale(calc());
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return scale;
}
function useIsMobileDG() {
  const [mobile, setMobile] = useStateDG(() => window.matchMedia("(max-width:768px)").matches);
  useEffectDG(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = e => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function DailyGoalApp() {
  const mobile = useIsMobileDG();
  const scale = useDeviceScaleDG();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)"
  };
  if (mobile) return /*#__PURE__*/React.createElement("div", {
    className: "app",
    style: {
      ...vars,
      background: "#1b1848"
    }
  }, /*#__PURE__*/React.createElement(DailyGoalScreen, null));
  return /*#__PURE__*/React.createElement("div", {
    className: "app device-stage",
    style: {
      ...vars,
      backgroundColor: "rgb(217, 218, 225)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement(IOSDevice, {
    width: 440,
    height: 956,
    dark: true
  }, /*#__PURE__*/React.createElement(DailyGoalScreen, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(DailyGoalApp, null));
