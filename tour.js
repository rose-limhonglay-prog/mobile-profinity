/* ===========================================================================
   PROfinity — post-signup virtual tour.
   A 5-step guided walkthrough that spans real pages: Home → Profile →
   My Learning → Community → AI Agents, then a completion summary.
   Runs in two flavors over the same script/copy shape: "mobile" (phone-frame
   screens, bottom tab dock) and "web" (desktop pages, TopNav header).

   State lives in localStorage so the tour survives navigation:
     pf-tour         "1" while the tour is running
     pf-tour-step    "welcome" | "1".."5" | "done"
     pf-tour-flavor  "mobile" | "web" (defaults to "mobile")
   Start it with:  window.PFTour.start()          (mobile)
                   window.PFTour.start("web")     (desktop)
   =========================================================================== */
(function () {
  var KEY = "pf-tour", STEP = "pf-tour-step", FLAVOR = "pf-tour-flavor";

  var STEPS_MOBILE = [
    { n: 1, page: "NewsfeedMobile.html", tab: "Home", title: "Welcome to your Home!",
      body: "This is your dashboard where you can see updates from the community, upcoming events, and recommended content just for you." },
    { n: 2, page: "ProfileMobile.html", tab: "Profile", title: "Complete your Professional Profile",
      body: "Your profile is your digital handshake. Fill in your details to unlock personalised course recommendations, connect with peers, and build trust within the Profinity community.",
      action: { label: "Edit my profile now", icon: "lucide:external-link" } },
    { n: 3, page: "LearningMobile.html", tab: "Learning", title: "Level Up Your Practice",
      body: "Access specialised pathways and expert-led content designed for medical aesthetics.",
      action: { label: "View Course (Preview)", icon: "lucide:arrow-right" } },
    { n: 4, page: "CommunityMobile.html", tab: "Community", title: "Join the Conversation",
      body: "Discover channels dedicated to specific specialties, procedures, and practice management. Find answers in Q&A or join circles to network with your peers.",
      action: { label: "Explore Channels", icon: "lucide:arrow-right" } },
    { n: 5, page: "NewsfeedMobile.html", tab: "Ava", title: "Meet Your AI Agents",
      body: "Profinity's AI Agents are here to assist you. Use LeadGen to draft outreach messages or the AI Coach to simulate client consultations.",
      prompt: "Draft a polite follow-up email for a client who enquired about Botox last week but hasn't booked." },
  ];

  var STEPS_WEB = [
    { n: 1, page: "NewsfeedWeb.html", tab: "Home", title: "Welcome to your Home!",
      body: "This is your dashboard where you can see updates from the community, upcoming events, and recommended content just for you." },
    { n: 2, page: "Profile.html", tab: "Profile", title: "Complete your Professional Profile",
      body: "Your profile is your digital handshake. Fill in your details to unlock personalised course recommendations, connect with peers, and build trust within the Profinity community.",
      action: { label: "Edit my profile now", icon: "lucide:external-link" } },
    { n: 3, page: "MyLearning.html", tab: "My Learning", title: "Level Up Your Practice",
      body: "Access specialised pathways and expert-led content designed for medical aesthetics.",
      action: { label: "View Course (Preview)", icon: "lucide:arrow-right" } },
    { n: 4, page: "Community.html", tab: "Community", title: "Join the Conversation",
      body: "Discover channels dedicated to specific specialties, procedures, and practice management. Find answers in Q&A or join circles to network with your peers.",
      action: { label: "Explore Channels", icon: "lucide:arrow-right" } },
    { n: 5, page: "Agent.html", tab: "Agent", title: "Meet Your AI Agents",
      body: "Profinity's AI Agents are here to assist you. Use LeadGen to draft outreach messages or the AI Coach to simulate client consultations.",
      prompt: "Draft a polite follow-up email for a client who enquired about Botox last week but hasn't booked." },
  ];

  var DONE = [
    "Home Dashboard Overview",
    "Professional Profile Setup",
    "Learning Center & Courses",
    "Community Channels",
    "AI Agent Interaction",
  ];

  var TOUR_POINTS = 250;
  var OWL_LOTTIE_SRC = "https://lottie.host/cc6c5973-9f61-481c-85ed-0fe2089a9176/CwHL9yTPJJ.json";
  var LOTTIE_LIB_SRC = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";

  /* Lazy-loads lottie-web (shared with auth-mobile.jsx's AULottie) only when
     the finish screen actually needs it — most tour pages never do. */
  function ensureLottie(cb) {
    if (window.lottie) { cb(); return; }
    if (!document.querySelector("script[data-pf-lottie]")) {
      var s = document.createElement("script");
      s.src = LOTTIE_LIB_SRC;
      s.setAttribute("data-pf-lottie", "1");
      document.head.appendChild(s);
    }
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (window.lottie) { clearInterval(iv); cb(); }
      else if (tries > 60) clearInterval(iv);
    }, 120);
  }

  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); localStorage.removeItem(STEP); localStorage.removeItem(FLAVOR); } catch (e) {} }

  function isWeb() { return read(FLAVOR) === "web"; }
  function STEPS() { return isWeb() ? STEPS_WEB : STEPS_MOBILE; }

  function here() { return (location.pathname.split("/").pop() || "").toLowerCase().replace(/\.html$/, ""); }
  function onPage(p) { return here() === p.toLowerCase().replace(/\.html$/, ""); }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function ico(name, size, color) {
    return '<iconify-icon icon="' + name + '" width="' + size + '" height="' + size +
      '" style="color:' + (color || "currentColor") + ';display:inline-block;flex-shrink:0;line-height:0"></iconify-icon>';
  }

  /* Reuses the site-wide .pf-confetti/.pf-confetti-piece keyframes (styles.css,
     loaded on every page) so the tour doesn't need its own copy — same math
     as app.jsx's ConfettiBurst, just built as a markup string. */
  function confettiHTML(count) {
    var colors = ["#CE9957", "#F2D08A", "#fff", "var(--success)", "var(--info)"];
    var pieces = "";
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var radius = 60 + Math.random() * 140;
      var w = 6 + Math.random() * 5;
      var vars = "--pf-confetti-dx:" + (Math.cos(angle) * radius) + "px;" +
        "--pf-confetti-dy:" + (Math.sin(angle) * radius * 0.5) + "px;" +
        "--pf-confetti-fall:" + (160 + Math.random() * 120) + "px;" +
        "--pf-confetti-drift:" + ((Math.random() - 0.5) * 50) + "px;" +
        "--pf-confetti-rotate:" + ((Math.random() - 0.5) * 720) + "deg;" +
        "animation-delay:" + (Math.random() * 0.25) + "s;" +
        "animation-duration:" + (1.8 + Math.random() * 0.9) + "s;" +
        "background:" + colors[i % colors.length] + ";" +
        "width:" + w + "px;height:" + (w * 0.4) + "px";
      pieces += '<span class="pf-confetti-piece" style="' + vars + '"></span>';
    }
    return '<div class="pf-confetti" aria-hidden="true">' + pieces + "</div>";
  }

  /* Eased count-up for a "+N points" reveal, matching auth-mobile.jsx's
     DailyReward animation. Skips straight to the total under reduced motion. */
  function animateCount(node, total, dur, delay) {
    if (!node) return;
    if (reduceMotion) { node.textContent = total.toLocaleString(); return; }
    var raf, t0 = null;
    setTimeout(function tick() {
      raf = requestAnimationFrame(function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(total * eased).toLocaleString();
        if (p < 1) raf = requestAnimationFrame(step);
      });
    }, delay);
  }
  var SCREEN_SEL = ".m-screen, .cm-screen, .lm-screen, .pm-screen, .ev-screen";
  var WEB_READY_SEL = "header nav";
  function readySel() { return isWeb() ? WEB_READY_SEL : SCREEN_SEL; }
  function host() { return document.querySelector(SCREEN_SEL) || document.body; }

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var LEAVE_MS = 200;

  /* Cross-fades the outgoing panel out instead of yanking it, for the
     same-page transitions (welcome → step 1, last step → finish summary,
     skip/close) — cross-page steps get a fresh DOM anyway, so this only
     ever matters when two tour panels share a page load. */
  function retire(node) {
    if (!node || !node.parentNode) return;
    node.classList.add("pf-tour-leaving");
    if (reduceMotion) { node.parentNode.removeChild(node); return; }
    setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, LEAVE_MS);
  }

  var root;
  function mount(node) {
    var old = root;
    root = node;
    /* Desktop pages scroll (unlike the bounded phone frame), so anchoring the
       tour to a positioned ancestor would place the bottom-anchored step card
       off past the fold. Attach straight to the viewport instead. */
    if (isWeb()) {
      node.classList.add("pf-tour-fixed");
      document.body.appendChild(node);
    } else {
      var h = host();
      if (h !== document.body && getComputedStyle(h).position === "static") h.style.position = "relative";
      h.appendChild(node);
    }
    retire(old);
  }

  /* Ring the dock tab (mobile) or TopNav item (web) this step is talking
     about, so the user sees where they are. The mobile dock itself must be
     raised: it is position:absolute;z-index:30, which forms a stacking
     context that traps any z-index on its children below the tour layer. */
  function spotlight(tab) {
    var prev = document.querySelectorAll(".pf-tour-spot, .pf-tour-lift");
    for (var i = 0; i < prev.length; i++) {
      prev[i].classList.remove("pf-tour-spot");
      prev[i].classList.remove("pf-tour-lift");
    }
    if (!tab) return;
    var tabs = document.querySelectorAll(".m-tab, .lm-tab, .cm-tab, .pm-tab, header nav button");
    for (var j = 0; j < tabs.length; j++) {
      if ((tabs[j].textContent || "").trim().toLowerCase().indexOf(tab.toLowerCase()) === 0) {
        tabs[j].classList.add("pf-tour-spot");
        var dock = tabs[j].closest(".m-tabs, .lm-tabs, .cm-tabs, .pm-tabs");
        if (dock) dock.classList.add("pf-tour-lift");
        return;
      }
    }
  }

  function skip() { clear(); spotlight(null); retire(root); root = null; }

  function go(page, step) {
    write(STEP, step);
    if (onPage(page)) render();
    else (window.pfGo || function (u) { location.href = u; })(page);
  }

  /* ------------------------------- welcome -------------------------------- */
  function welcome() {
    var slide = 0;
    var wrap = el("div", "pf-tour-overlay");
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Welcome to Profinity");
    var pills = ["Connect|lucide:users|Join a global network of clinicians who share insights",
                 "Learn|lucide:graduation-cap|Access expert-led content, webinars and case studies",
                 "Grow|lucide:trending-up|Enhance your skills and advance your career"];
    wrap.innerHTML =
      '<div class="pf-tour-welcome">' +
        '<button class="pf-tour-x light" aria-label="Skip tour">' + ico("lucide:x", 20, "#fff") + "</button>" +
        '<img class="pf-tour-mark" src="assets/profinity-diamond.png" alt="" />' +
        "<h2>Welcome to Profinity</h2>" +
        "<p>We're excited to have you here. Connect, learn, and grow with a community of expert clinicians and exclusive resources.</p>" +
        '<ul class="pf-tour-pills">' +
          pills.map(function (p) {
            var s = p.split("|");
            return '<li><span class="ic">' + ico(s[1], 22, "#CE9957") + "</span><span class=tx><b>" +
              s[0] + "</b><i>" + s[2] + "</i></span></li>";
          }).join("") +
        "</ul>" +
        '<div class="pf-tour-dots"><span class="on"></span><span></span></div>' +
        '<div class="pf-tour-wfoot"><button class="pf-tour-skip light">Skip tour</button>' +
        '<button class="pf-tour-next light">Next</button></div>' +
      "</div>";
    mount(wrap);
    var dots = wrap.querySelectorAll(".pf-tour-dots span");
    var next = wrap.querySelector(".pf-tour-next");
    wrap.querySelector(".pf-tour-x").addEventListener("click", skip);
    wrap.querySelector(".pf-tour-skip").addEventListener("click", skip);
    next.addEventListener("click", function () {
      if (slide === 0) {
        slide = 1;
        dots[0].classList.remove("on");
        dots[1].classList.add("on");
        next.textContent = "Let's Go";
      } else go(STEPS()[0].page, "1");
    });
  }

  /* -------------------------------- a step -------------------------------- */
  function step(s) {
    var wrap = el("div", "pf-tour-layer");
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", s.title);
    var bars = "";
    for (var i = 1; i <= 5; i++) bars += '<span class="' + (i <= s.n ? "on" : "") + '"></span>';
    wrap.innerHTML =
      '<div class="pf-tour-scrim"></div>' +
      '<div class="pf-tour-card">' +
        '<div class="pf-tour-hd"><span class="pf-tour-step">Step ' + s.n + " of 5" + "</span>" +
          '<button class="pf-tour-x" aria-label="Skip tour">' + ico("lucide:x", 18, "var(--gray-500)") + "</button></div>" +
        '<div class="pf-tour-bar" role="progressbar" aria-valuemin="1" aria-valuemax="5" aria-valuenow="' + s.n +
          '" aria-label="Tour progress, step ' + s.n + ' of 5">' + bars + "</div>" +
        "<h3>" + s.title + "</h3><p>" + s.body + "</p>" +
        (s.action ? '<button class="pf-tour-act">' + s.action.label + ico(s.action.icon, 16, "var(--brand-navy)") + "</button>" : "") +
        (s.prompt ? '<div class="pf-tour-prompt"><span class="k">TRY THIS EXAMPLE PROMPT:</span><i>"' + s.prompt + '"</i></div>' : "") +
        '<div class="pf-tour-foot"><button class="pf-tour-skip">Skip Tour</button>' +
        '<button class="pf-tour-next">' + (s.n === 5 ? "Finish Tour" : "Next") + ico("lucide:chevron-right", 17, "#fff") + "</button></div>" +
      "</div>";
    mount(wrap);
    spotlight(s.tab);
    wrap.querySelector(".pf-tour-x").addEventListener("click", skip);
    wrap.querySelector(".pf-tour-skip").addEventListener("click", skip);
    wrap.querySelector(".pf-tour-next").addEventListener("click", function () {
      if (s.n === 5) go(STEPS()[0].page, "done");
      else go(STEPS()[s.n].page, String(s.n + 1));
    });
    var act = wrap.querySelector(".pf-tour-act");
    if (act) act.addEventListener("click", function (e) { e.preventDefault(); });
  }

  /* ------------------------------- finished ------------------------------- */
  function finish() {
    var wrap = el("div", "pf-tour-overlay");
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Tour complete");
    wrap.innerHTML =
      '<div class="pf-tour-welcome">' +
        (reduceMotion ? "" : confettiHTML(32)) +
        '<button class="pf-tour-x light" aria-label="Close">' + ico("lucide:x", 20, "#fff") + "</button>" +
        '<div class="pf-tour-pts-burst" aria-hidden="true">' +
          (reduceMotion ?
            '<span class="pf-tour-pts-coin">' + ico("lucide:award", 40, "#CE9957") + "</span>" :
            '<span class="pf-tour-owl"></span>') +
        "</div>" +
        '<p class="pf-tour-pts-kicker">Tour Complete</p>' +
        '<p class="pf-tour-pts-num" aria-live="polite"><b>+<span class="pf-tour-pts-n">0</span></b><i>points</i></p>' +
        "<h2>Welcome to Profinity</h2>" +
        "<p>We're excited to have you here. Connect, learn, and grow with a community of expert clinicians and exclusive resources.</p>" +
        '<span class="pf-tour-donek">Steps completed</span>' +
        '<ul class="pf-tour-done">' +
          DONE.map(function (d) { return "<li>" + ico("lucide:check", 17, "#CE9957") + d + "</li>"; }).join("") +
        "</ul>" +
        '<button class="pf-tour-go">Let\'s Get Started</button>' +
      "</div>";
    mount(wrap);
    animateCount(wrap.querySelector(".pf-tour-pts-n"), TOUR_POINTS, 1100, 500);
    if (!reduceMotion) {
      ensureLottie(function () {
        var host = wrap.querySelector(".pf-tour-owl");
        if (host) window.lottie.loadAnimation({ container: host, renderer: "svg", loop: true, autoplay: true, path: OWL_LOTTIE_SRC });
      });
    }
    wrap.querySelector(".pf-tour-x").addEventListener("click", skip);
    wrap.querySelector(".pf-tour-go").addEventListener("click", skip);
  }

  function render() {
    if (read(KEY) !== "1") return;
    var st = read(STEP) || "welcome";
    if (st === "welcome") { if (onPage(STEPS()[0].page)) welcome(); return; }
    if (st === "done") { if (onPage(STEPS()[0].page)) finish(); return; }
    var s = STEPS()[parseInt(st, 10) - 1];
    if (s && onPage(s.page)) step(s);
  }

  window.PFTour = {
    start: function (flavor) {
      write(KEY, "1");
      write(STEP, "welcome");
      write(FLAVOR, flavor === "web" ? "web" : "mobile");
      go(STEPS()[0].page, "welcome");
    },
    stop: skip,
  };

  /* The React screens mount late (in-browser Babel), so wait for the screen
     root before rendering — mounting to <body> escapes the phone bezel. */
  function boot() {
    if (read(KEY) !== "1") return;
    var sel = readySel();
    if (document.querySelector(sel)) { render(); return; }
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (document.querySelector(sel)) { clearInterval(iv); render(); }
      else if (tries > 80) { clearInterval(iv); render(); }
    }, 120);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
