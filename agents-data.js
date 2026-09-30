/* ===========================================================================
   PROfinity — Agents catalogue (shared by Agent.html + AgentMobile.html)
   One source of truth for the eight agents, their copy, status, pricing and
   the member's "Notify me" waitlist (persisted in localStorage so AdminAgents
   can read it later). Plain JS — exposes window.PFAgents.
   =========================================================================== */
(function () {
  "use strict";

  var WAITLIST_KEY = "pf-agent-waitlist";

  /* tone → tile colours (light). Dark-mode remaps live in dark-mode.css. */
  var TONES = {
    teal:   { bg: "#E3F0F2", fg: "#25515C" },
    purple: { bg: "#ECE6FD", fg: "#5B51F0" },
    rose:   { bg: "#FBE9F6", fg: "#B4359E" },
    gold:   { bg: "#F7EFE3", fg: "#8A5303" },
    green:  { bg: "#E7F6EE", fg: "#1F7A52" },
    blue:   { bg: "#EAF2FF", fg: "#2457B8" },
    slate:  { bg: "#EDEFF4", fg: "#3B4664" },
  };

  var AGENTS = [
    {
      id: "assess-pro", name: "Assess Pro", category: "Clinical", tone: "teal", icon: "lucide:scan-face",
      status: "available", badge: "Included with Artcodes", price: "Starts at £97/mo", featured: true,
      tagline: "Facial assessment your patients can actually see.",
      description: "Photograph, map and track your patients' faces, then turn the analysis into a treatment conversation they understand. Every consultation ends with a clear, visual plan.",
      bullets: [
        "Guided photo capture with lighting and angle checks",
        "Facial mapping, symmetry and ageing analysis in seconds",
        "Before-and-after tracking across every visit",
      ],
      bestFor: "Consultations, treatment planning and results tracking",
      cta: "Open Assess Pro",
    },
    {
      id: "coach", name: "Profinity Coach (Ava)", shortName: "Ava, your coach", category: "Growth", tone: "purple", icon: "lucide:sparkles",
      status: "available", badge: "Included in Premium", price: "Included with membership", featured: true, isAva: true,
      tagline: "Your business coach, on call every day.",
      description: "Ava knows your clinic goal, your Prosperity Spiral scores and what you learned this week. Ask her to plan today's targets, review your progress or rehearse a tricky patient conversation.",
      bullets: [
        "Daily targets tied to your revenue goal",
        "Progress reviews across Sales, Marketing, Clinical Skills and Business Systems",
        "Consultation role-play with instant feedback",
      ],
      bestFor: "Daily focus, accountability and skills practice",
      cta: "Ask Ava",
    },
    {
      id: "lumina", name: "Lumina Patients Receptionist", category: "Front desk", tone: "rose", icon: "lucide:message-circle-heart",
      status: "soon", eta: "Early 2026", badge: "Included in Premium", price: "Starts at £57/mo", waiting: 212,
      tagline: "Every enquiry answered, every consultation booked.",
      description: "Lumina replies to patient enquiries on your website, Instagram and WhatsApp in your clinic's voice, answers treatment questions, qualifies the lead and books the consultation straight into your diary.",
      bullets: [
        "Replies in under a minute, day or night",
        "Knows your treatments, prices and availability",
        "Hands sensitive conversations to your team",
      ],
      bestFor: "Clinics losing leads to slow replies",
    },
    {
      id: "phone", name: "AI Phone Receptionist", category: "Front desk", tone: "blue", icon: "lucide:phone-call",
      status: "soon", eta: "Early 2026", badge: "Included in Premium", price: "Starts at £57/mo", waiting: 168,
      tagline: "Never miss a call while you are with a patient.",
      description: "A natural-sounding receptionist that answers every call to the clinic, handles bookings, reschedules and common questions, and transfers anything complex to you with a written summary.",
      bullets: [
        "24/7 answering on your existing clinic number",
        "Books, moves and confirms appointments",
        "Call summaries sent to your inbox",
      ],
      bestFor: "Solo practitioners and small front-desk teams",
    },
    {
      id: "treatment-plan", name: "Treatment Plan Generator", category: "Clinical", tone: "teal", icon: "lucide:clipboard-list",
      status: "soon", eta: "Spring 2026", badge: "Included in Premium", price: "Starts at £97/mo", waiting: 143,
      tagline: "From consultation notes to a plan you can hand over.",
      description: "Turns your consultation notes and Assess Pro findings into a staged treatment plan with pricing, timing and aftercare, formatted to your clinic's branding and ready to send.",
      bullets: [
        "Staged plans across multiple visits",
        "Pulls pricing from your treatment menu",
        "Patient-friendly language, clinician-approved",
      ],
      bestFor: "Turning consultations into booked treatment courses",
    },
    {
      id: "marketing", name: "Profinity Marketing Assistant", category: "Growth", tone: "gold", icon: "lucide:megaphone",
      status: "soon", eta: "Spring 2026", badge: "Included in Premium", price: "Included with membership", waiting: 301,
      tagline: "A month of content from one treatment story.",
      description: "Plans your content calendar, drafts posts and emails in your voice, and repurposes a single before-and-after into Instagram, email and website copy that stays compliant.",
      bullets: [
        "Content calendar built around your goals",
        "Captions, reels scripts and email drafts",
        "Advertising-compliance checks built in",
      ],
      bestFor: "Practitioners who post inconsistently",
    },
    {
      id: "minutes", name: "Minute Taker", category: "Operations", tone: "slate", icon: "lucide:mic",
      status: "available", badge: "Included in Premium", price: "Starts at £57/mo", featured: true, cta: "Open Minute Taker",
      href: { mobile: "MinuteTakerDashboardMobile.html", web: "MinuteTakerDashboard.html" },
      artChips: [["lucide:file-text", "Notes in 2 min"], ["lucide:list-checks", "3 actions assigned"]],
      tagline: "Meetings and consultations, written up for you.",
      description: "Records team meetings and consultations, then writes the notes, decisions, actions and follow-ups so nothing gets lost between visits or shifts.",
      bullets: [
        "Clean notes within minutes of the meeting",
        "Action items assigned to the right person",
        "Searchable history across every session",
      ],
      bestFor: "Clinic owners running a growing team",
    },
    {
      id: "finance", name: "Finance", category: "Finance", tone: "green", icon: "lucide:coins",
      status: "soon", eta: "Summer 2026", badge: "Included in Premium", price: "Starts at £77/mo", waiting: 187,
      tagline: "Know which treatments actually make money.",
      description: "Tracks revenue per treatment, product costs and payment plans, and shows you in plain English where your margin is, so pricing decisions stop being guesswork.",
      bullets: [
        "Revenue and margin per treatment",
        "Stock and product-cost tracking",
        "Monthly summary written for humans",
      ],
      bestFor: "Owners who want clarity without spreadsheets",
    },
  ];

  var CATEGORIES = ["All", "Front desk", "Clinical", "Growth", "Operations", "Finance"];

  function readWaitlist() {
    try { var v = JSON.parse(localStorage.getItem(WAITLIST_KEY) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  }
  function writeWaitlist(ids) {
    try { localStorage.setItem(WAITLIST_KEY, JSON.stringify(ids)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent("pf:agent-waitlist", { detail: { ids: ids } })); } catch (e) {}
  }
  function isWaiting(id) { return readWaitlist().indexOf(id) !== -1; }
  function join(id) {
    var ids = readWaitlist();
    if (ids.indexOf(id) === -1) { ids.push(id); writeWaitlist(ids); }
    return ids;
  }
  function leave(id) {
    var ids = readWaitlist().filter(function (x) { return x !== id; });
    writeWaitlist(ids);
    return ids;
  }

  function counts() {
    var a = 0, s = 0;
    AGENTS.forEach(function (x) { if (x.status === "available") a++; else s++; });
    return { available: a, soon: s, total: AGENTS.length };
  }

  /* Ask Ava — coach.js only mounts on My Learning, so fall back to its deep link. */
  /* Agents with their own pages (href.mobile / href.web) open there; the rest hand off to Ava. */
  function open(agent, mobile) {
    var href = agent && agent.href && (mobile ? agent.href.mobile : agent.href.web);
    if (href) { (window.pfGo || function (u) { window.location.href = u; })(href); return true; }
    return askAva("Open " + agent.name + " and walk me through my first session.", mobile);
  }
  function askAva(prompt, mobile) {
    if (window.PFAva && window.PFAva.open) { window.PFAva.open(prompt); return; }
    var page = mobile ? "LearningMobile.html" : "MyLearning.html";
    var url = page + "?ava=" + encodeURIComponent(prompt || "1");
    (window.pfGo || function (u) { window.location.href = u; })(url);
  }

  window.PFAgents = {
    AGENTS: AGENTS, CATEGORIES: CATEGORIES, TONES: TONES, WAITLIST_KEY: WAITLIST_KEY,
    readWaitlist: readWaitlist, isWaiting: isWaiting, join: join, leave: leave, counts: counts, askAva: askAva, open: open,
    byId: function (id) { return AGENTS.filter(function (a) { return a.id === id; })[0] || null; },
  };
})();
