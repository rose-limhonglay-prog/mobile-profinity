/* ===========================================================================
   PROfinity — Messages (mobile) · iPhone 17 Pro Max
   Full inbox: Chats · Conference · People · Menu, plus in-page thread,
   profile (person / group), archived / requests / deleted / groups views.
   Renders inside the IOSDevice frame with the shared mobile chrome mounted
   (its top bar is hidden by CSS — this page carries its own header — but the
   side menu / notifications / messages drawers keep working).
   Suffixed -DM: Babel text/babel scripts share one global scope.
   =========================================================================== */
const { useState: useStateDM, useEffect: useEffectDM, useRef: useRefDM, useMemo: useMemoDM, useCallback: useCallbackDM } = React;
const DSDM = window.ProfinityDesignSystem_c2b5cc;
const MobileChromeDM = window.MobileChromeC;

function goDM(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function paramDM(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }

/* ---------------------------------------------------------------------------
   Time helpers — seeds are stored as "minutes ago" and resolved to epoch ms
   once at load, so the inbox always reads as live.
   --------------------------------------------------------------------------- */
const NOW_DM = Date.now();
const MIN_DM = 60 * 1000;
const EDIT_WINDOW_DM = 5 * MIN_DM;
const DAYS_DM = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_DM = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtClockDM(ts) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + (m < 10 ? "0" : "") + m + " " + ap;
}
function fmtListTimeDM(ts) {
  const d = new Date(ts), n = new Date();
  if (d.toDateString() === n.toDateString()) return fmtClockDM(ts);
  const y = new Date(n); y.setDate(n.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  if ((n - d) / 86400000 < 6) return DAYS_DM[d.getDay()];
  return d.getDate() + " " + MONTHS_DM[d.getMonth()];
}
function fmtCountdownDM(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
}
function presenceDM(p) {
  if (!p) return "";
  if (p.online) return "Active now";
  const m = p.lastActive || 0;
  if (m < 60) return "Active " + m + "m ago";
  if (m < 1440) return "Active " + Math.round(m / 60) + "h ago";
  if (m < 2880) return "Active yesterday";
  return "Active " + Math.round(m / 1440) + "d ago";
}

/* ---------------------------------------------------------------------------
   People — one photo per person. Only a handful of portraits exist in the
   design system; everyone else falls back to initials via DMFace.
   --------------------------------------------------------------------------- */
const ME_DM = { id: "me", name: "Katy Wilson", avatar: "assets/avatar-katy.jpg", role: "Registered Nurse", online: true, seals: ["gb", "verified"] };

const PEOPLE_SEED_DM = [
  { id: "tim", name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", role: "Aesthetic Physician · Founder", online: true, seals: ["gb", "gold", "verified", "crown"],
    email: "tim.pearce@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@drtimpearce",
    media: ["assets/post1-img1.png", "assets/post1-img2.png", "assets/post1-img3.png"] },
  { id: "miranda", name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", role: "Practice Manager", online: false, lastActive: 12, seals: ["gb", "verified"],
    email: "miranda.pearce@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@miranda_pearce",
    media: ["assets/clinic-lip-design.png", "assets/clinic-toxin-guide.png", "assets/clinic-treatment-collage.png"] },
  { id: "sarahc", name: "Dr. Sarah Collins", avatar: "assets/avatar-sarah-collins.jpg", role: "Aesthetic Physician", online: true, seals: ["gb", "gold", "verified"],
    email: "sarah.collins@collinsaesthetics.co.uk", clinic: "Collins Aesthetics", website: "collinsaesthetics.co.uk", instagram: "@drsarahcollins",
    media: ["assets/post2-img1.png", "assets/post2-img2.png", "assets/post2-img3.png"] },
  { id: "amir", name: "Dr Amir Khan", avatar: "assets/avatar-amir-khan.jpg", role: "Dental Surgeon", online: false, lastActive: 45, seals: ["gb", "verified"],
    email: "amir.khan@smilehouse.co.uk", clinic: "Smile House Dental", website: "smilehouse.co.uk", instagram: "@dramirkhan" },
  { id: "mark", name: "Mark Ellis", avatar: "assets/avatar-mark-ellis.jpg", role: "Clinic Owner", online: true, seals: ["gb"],
    email: "mark@ellisclinics.co.uk", clinic: "Ellis Clinics", website: "ellisclinics.co.uk", instagram: "@markellisclinics" },
  { id: "beth", name: "Nurse Beth", avatar: "assets/avatar-nurse-beth.jpg", role: "Aesthetic Nurse", online: false, lastActive: 180, seals: ["gb", "verified"],
    email: "beth@glowclinic.co.uk", clinic: "Glow Clinic", website: "glowclinic.co.uk", instagram: "@nursebeth.aesthetics" },
  { id: "priya", name: "Priya Shah", avatar: "assets/avatar-priya-shah.jpg", role: "Nurse Prescriber", online: true, seals: ["gb", "verified"],
    email: "priya@shahaesthetics.co.uk", clinic: "Shah Aesthetics", website: "shahaesthetics.co.uk", instagram: "@priyashah.np" },
  { id: "sarah", name: "Dr Sarah Kim", avatar: null, role: "Clinical Nurse Specialist", online: true, seals: ["gb", "verified"],
    email: "sarah.kim@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@sarah_kim_aesthetics" },
  { id: "emily", name: "Dr Emily Tran", avatar: null, role: "Aesthetic Physician", online: false, lastActive: 1440, seals: ["gb", "gold", "verified"],
    email: "emily.tran@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@emily_tran_md" },
  { id: "james", name: "Dr James Brown", avatar: null, role: "Aesthetic Physician", online: false, lastActive: 2900, seals: ["gb", "verified", "crown"],
    email: "james.brown@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@james_brown_aesthetics" },
  { id: "alex", name: "Dr Alex Chen", avatar: null, role: "Clinical Nurse Specialist", online: true, seals: ["gb", "gold", "verified"],
    email: "alex.chen@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@alex_chen_rn" },
  { id: "hannah", name: "Dr Hannah Reid", avatar: null, role: "GP with Special Interest", online: false, lastActive: 25, seals: ["gb"],
    email: "hannah.reid@reidmedical.co.uk", clinic: "Reid Medical", website: "reidmedical.co.uk", instagram: "@drhannahreid" },
  /* request senders — not followed yet */
  { id: "omar", name: "Dr Omar Farouk", avatar: null, role: "Nurse Prescriber", online: false, lastActive: 95, seals: ["gb"], request: true },
  { id: "lucy", name: "Lucy Bennett", avatar: null, role: "Skin Therapist", online: true, seals: [], request: true }];

/* Conversations — `ago` is minutes before load; resolved to `ts` by buildSeedDM. */
const CONVERSATIONS_SEED_DM = [
  { id: "tim", kind: "dm", personId: "tim", unread: 2, messages: [
    { from: "tim", text: "Hey Katy! I saw your post about the full-face rejuvenation case.", ago: 138 },
    { from: "me", text: "Thank you! It was a great result, patient was thrilled.", ago: 130 },
    { from: "tim", text: "Do you mind if I share it with my team as a reference?", ago: 125 },
    { from: "me", text: "Of course, go ahead — sharing the write-up now.", image: "assets/post1-img1.png", ago: 122 },
    { from: "tim", text: "Thanks for sharing the case study. Really helpful!", ago: 120, reactions: { "❤️": ["me"] } },
    { from: "tim", text: "Could you also add the product volumes per zone? The team will ask.", ago: 18 }] },
  { id: "g-casereview", kind: "group", name: "Clinical Case Review", memberIds: ["tim", "sarahc", "alex"], roles: { tim: "Admin", sarahc: "Moderator" }, pinned: true, unread: 3, messages: [
    { from: "sarahc", text: "Uploading tonight's case: 34F, mid-face volume loss, 2ml Voluma.", image: "assets/post2-img1.png", ago: 95 },
    { from: "tim", text: "Great case. Watch the infraorbital hollow — go deep, small boluses.", ago: 90 },
    { from: "me", text: "Would you cannula or needle for the zygoma here?", ago: 84 },
    { from: "alex", text: "Cannula for the lateral cheek, needle for the bony apex.", ago: 80, reactions: { "👍": ["tim", "me"] } },
    { from: "sarahc", text: "Agreed. I'll bring the 4-week follow-up photos to Thursday's call.", ago: 30 },
    { from: "tim", text: "Katy, can you present your lip case at the review too?", ago: 9 }] },
  { id: "sarah", kind: "dm", personId: "sarah", unread: 1, messages: [
    { from: "sarah", text: "Are you free to go over the Q3 protocol updates this week?", ago: 200 },
    { from: "me", text: "Yes, Thursday afternoon works for me.", ago: 190 },
    { from: "sarah", text: "Looking forward to our next meeting!", ago: 60 }] },
  { id: "emily", kind: "dm", personId: "emily", unread: 3, messages: [
    { from: "emily", text: "Just finished reviewing the patient satisfaction data.", ago: 75 },
    { from: "emily", text: "There's a trend worth flagging in the 45+ age group.", ago: 70 },
    { from: "emily", text: "I have some additional insights to share.", ago: 62 }] },
  { id: "g-lipmasters", kind: "group", name: "8D Lip Masters", memberIds: ["beth", "priya", "miranda", "amir"], roles: { miranda: "Admin" }, unread: 0, messages: [
    { from: "beth", text: "Anyone else finding the vermilion border tricky at 8D step 6?", ago: 1500 },
    { from: "priya", text: "Yes! Slower injection and less product helped me.", ago: 1490 },
    { from: "me", text: "Same — I switched to a 30G and it made a big difference.", ago: 1480, reactions: { "👍": ["beth", "priya"] } },
    { from: "miranda", text: "Reminder: Technique Tuesday covers exactly this next week 🎉", ago: 1470 }] },
  { id: "james", kind: "dm", personId: "james", unread: 0, muted: true, messages: [
    { from: "me", text: "Sent over the full results deck this morning.", ago: 2900 },
    { from: "james", text: "Can we discuss the implications of the results?", ago: 2880 }] },
  /* Alex is the empty-conversation sample: a contact with no messages yet,
     so the list shows "Start the conversation" and the thread its empty state. */
  { id: "alex", kind: "dm", personId: "alex", unread: 0, messages: [] },
  { id: "miranda", kind: "dm", personId: "miranda", unread: 0, messages: [
    { from: "me", text: "Sharing the confidence-score writeup with you now.", ago: 4300 },
    { from: "miranda", text: "Perfect, thank you — this is exactly what I needed.", ago: 4290 }] },
  { id: "amir", kind: "dm", personId: "amir", unread: 0, messages: [
    { from: "amir", text: "Katy, the dental block technique video is live in the Mastery library.", ago: 5800 },
    { from: "me", text: "Brilliant, watching it tonight. Thanks Amir!", ago: 5790 }] },
  { id: "mark", kind: "dm", personId: "mark", unread: 0, messages: [
    { from: "mark", text: "Quick one — what CRM are you using for recall reminders?", ago: 7300 },
    { from: "me", text: "We moved to Pabau last quarter, happy to walk you through it.", ago: 7290 },
    { from: "mark", text: "That would be great, thanks!", ago: 7280 }] },
  { id: "beth", kind: "dm", personId: "beth", unread: 0, messages: [
    { from: "beth", text: "Loved your consultation framework post 🙌", ago: 8700 },
    { from: "me", text: "Thanks Beth! Ping me if you want the template.", ago: 8690 }] },
  { id: "priya", kind: "dm", personId: "priya", unread: 0, messages: [
    { from: "priya", text: "Are you going to the London masterclass in October?", ago: 10100 },
    { from: "me", text: "Booked! See you there.", ago: 10090 }] },
  { id: "hannah", kind: "dm", personId: "hannah", unread: 0, archived: true, messages: [
    { from: "hannah", text: "Thanks for the referral pathway notes.", ago: 20000 },
    { from: "me", text: "Anytime, Hannah.", ago: 19990 }] },
  { id: "g-cohort12", kind: "group", name: "Confidence Cohort 12", memberIds: ["sarah", "emily", "james", "hannah"], roles: { sarah: "Admin" }, unread: 0, archived: true, messages: [
    { from: "emily", text: "Congrats everyone on completing the pathway!", ago: 40000 },
    { from: "me", text: "What a cohort 🎓", ago: 39990 }] }];

const REQUESTS_SEED_DM = [
  { id: "omar", personId: "omar", text: "Hi Katy — I'm a new nurse prescriber and loved your lip case write-up. Would you be open to a quick chat?", ago: 95 },
  { id: "lucy", personId: "lucy", text: "Hello! Miranda suggested I reach out about clinic systems.", ago: 400 }];

const CONFERENCES_DM = [
  { id: "c1", name: "Clinical Case Review", hostId: "tim", participantIds: ["tim", "sarahc", "alex", "priya"], listening: 12, live: true, when: "Live now", topic: "Mid-face volume loss · cannula vs needle" },
  { id: "c2", name: "Business Growth Sync", hostId: "miranda", participantIds: ["miranda", "mark"], live: false, when: "Tomorrow · 10:00 AM", topic: "Recall systems & retention" },
  { id: "c3", name: "Complications Q&A", hostId: "tim", participantIds: ["tim", "beth", "amir"], live: false, when: "Thu · 7:00 PM", topic: "Vascular occlusion protocol refresh" }];

const REACTIONS_QUICK_DM = ["👍", "❤️", "😂", "😮", "🙏", "💉"];
const EMOJI_GROUPS_DM = [
  { key: "smileys", label: "Smileys", icon: "lucide:smile", emojis: ["😀", "😁", "😂", "🤣", "😊", "😍", "🤩", "😘", "😉", "🙂", "🤔", "😅", "🥲", "😎", "🤗", "😴", "😮", "🥳", "😢", "😡"] },
  { key: "gestures", label: "Gestures", icon: "lucide:hand", emojis: ["👍", "👎", "👏", "🙌", "🙏", "👋", "✌️", "🤞", "💪", "🤝", "👌", "🫶", "☝️", "✋", "🤙", "👀"] },
  { key: "hearts", label: "Hearts", icon: "lucide:heart", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "🖤", "💖", "💗", "💓", "💞", "💕", "❣️", "💯", "✨"] },
  { key: "clinical", label: "Clinical", icon: "lucide:syringe", emojis: ["💉", "🩹", "🩺", "💊", "🧴", "🧪", "🧬", "🔬", "🩻", "🧑‍⚕️", "👩‍⚕️", "👨‍⚕️", "🏥", "🧤", "😷", "🫧"] }];

const SAMPLE_REPLIES_DM = [
  "Got it, thanks for the update!",
  "Sounds good — let's touch base soon.",
  "Appreciate you sharing this with me.",
  "Perfect, I'll take a look and get back to you.",
  "Thanks! That's really helpful."];

/* ---------------------------------------------------------------------------
   Store — seed + localStorage persistence + groups created from the newsfeed
   Messages drawer ("pf-dm-groups").
   --------------------------------------------------------------------------- */
const STORE_KEY_DM = "pf-messages-v1";
const SEED_VERSION_DM = 4;
const PF_GROUPS_KEY_DM = "pf-dm-groups";
let MSG_SEQ_DM = 1;
function midDM() { return "m" + NOW_DM.toString(36) + "-" + (MSG_SEQ_DM++); }

function buildSeedDM() {
  return {
    v: SEED_VERSION_DM,
    people: [],
    conversations: CONVERSATIONS_SEED_DM.map((c) => ({
      ...c,
      messages: c.messages.map((m) => ({ id: midDM(), from: m.from, text: m.text, image: m.image || null, ts: NOW_DM - m.ago * MIN_DM, reactions: m.reactions || {} }))
    })),
    requests: REQUESTS_SEED_DM.map((r) => ({ ...r, ts: NOW_DM - r.ago * MIN_DM })),
    deleted: []
  };
}
function readGroupsDM() { try { return JSON.parse(localStorage.getItem(PF_GROUPS_KEY_DM)) || []; } catch (e) { return []; } }

/* Fold groups created in the newsfeed drawer into the store; members the
   roster doesn't know are added to store.people so every face resolves. */
function mergeExternalGroupsDM(store) {
  const groups = readGroupsDM();
  if (!groups.length) return store;
  const known = new Set(PEOPLE_SEED_DM.map((p) => p.id).concat(store.people.map((p) => p.id), ["me"]));
  const have = new Set(store.conversations.map((c) => c.id).concat(store.deleted.map((c) => c.id)));
  let people = store.people, conversations = store.conversations, changed = false;
  groups.forEach((g) => {
    if (have.has(g.id)) return;
    changed = true;
    const memberIds = (g.members || []).map((m) => {
      if (!known.has(m.id)) { known.add(m.id); people = people.concat([{ id: m.id, name: m.name, avatar: m.avatar || null, role: "Member", online: false, lastActive: 60, seals: [] }]); }
      return m.id;
    });
    conversations = [{
      id: g.id, kind: "group", name: g.name, memberIds, roles: { me: "Admin" }, unread: 0,
      messages: (g.messages || []).map((m) => ({ id: midDM(), from: m.me ? "me" : (memberIds.find((id) => (people.concat(PEOPLE_SEED_DM).find((p) => p.id === id) || {}).name === m.sender) || memberIds[0]), text: m.text, ts: NOW_DM, reactions: {} }))
    }].concat(conversations);
  });
  return changed ? { ...store, people, conversations } : store;
}
function loadStoreDM() {
  let store = null;
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY_DM));
    if (saved && saved.v === SEED_VERSION_DM && Array.isArray(saved.conversations)) store = saved;
  } catch (e) {}
  if (!store) store = buildSeedDM();
  return mergeExternalGroupsDM(store);
}
function saveStoreDM(store) { try { localStorage.setItem(STORE_KEY_DM, JSON.stringify(store)); } catch (e) {} }

/* ---------------------------------------------------------------------------
   Small hooks
   --------------------------------------------------------------------------- */
function useIsMobileDM() {
  const [mobile, setMobile] = useStateDM(() => window.matchMedia("(max-width:768px)").matches);
  useEffectDM(() => {
    const mq = window.matchMedia("(max-width:768px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
function useDeviceScaleDM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateDM(calc);
  useEffectDM(() => {
    const update = () => setScale(calc());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}
/* ticking clock — only while `active` (edit-window countdowns) */
function useNowDM(active) {
  const [now, setNow] = useStateDM(Date.now());
  useEffectDM(() => {
    if (!active) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [active]);
  return now;
}
/* long-press (≈480ms, cancels on drag) + context-menu key / right-click.
   Suppresses the trailing click once a long-press has fired. */
/* Photos picked from the device are downscaled to a JPEG data URL so a
   conversation with a few pictures still fits comfortably in localStorage. */
function shrinkImageDM(file, max = 1280) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * s)), h = Math.max(1, Math.round(img.height * s));
      try {
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        const out = cv.toDataURL("image/jpeg", 0.82);
        URL.revokeObjectURL(url);
        resolve(out);
      } catch (e) { resolve(url); }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}
/* Wrap every case-insensitive occurrence of q in <mark> for in-thread search. */
function highlightDM(text, q) {
  if (!q) return text;
  const lower = text.toLowerCase(), needle = q.toLowerCase();
  const out = []; let i = 0, k;
  while ((k = lower.indexOf(needle, i)) >= 0) {
    if (k > i) out.push(text.slice(i, k));
    out.push(<mark key={k} className="dm-hl">{text.slice(k, k + needle.length)}</mark>);
    i = k + needle.length;
  }
  if (i < text.length) out.push(text.slice(i));
  return out;
}

function usePressDM(onLongPress, enabled = true) {
  const st = useRefDM({ timer: null, fired: false, x: 0, y: 0 });
  const clear = () => { if (st.current.timer) { window.clearTimeout(st.current.timer); st.current.timer = null; } };
  if (!enabled) return {};
  return {
    onPointerDown: (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      st.current.fired = false; st.current.x = e.clientX; st.current.y = e.clientY;
      clear();
      st.current.timer = window.setTimeout(() => { st.current.fired = true; st.current.timer = null; onLongPress(); }, 480);
    },
    onPointerMove: (e) => {
      if (!st.current.timer) return;
      if (Math.abs(e.clientX - st.current.x) > 10 || Math.abs(e.clientY - st.current.y) > 10) clear();
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onClickCapture: (e) => { if (st.current.fired) { e.stopPropagation(); e.preventDefault(); st.current.fired = false; } },
    onContextMenu: (e) => { e.preventDefault(); if (st.current.fired) { st.current.fired = false; return; } clear(); onLongPress(); }
  };
}
/* dock compaction — shrinks on scroll down, restores on scroll up */
function useScrollDockDM(resetKey) {
  const [compact, setCompact] = useStateDM(false);
  const lastY = useRefDM(0);
  useEffectDM(() => { setCompact(false); lastY.current = 0; }, [resetKey]);
  const onScroll = useCallbackDM((e) => {
    const y = e.currentTarget.scrollTop;
    const dy = y - lastY.current;
    if (y < 24) setCompact(false);
    else if (dy > 6) setCompact(true);
    else if (dy < -6) setCompact(false);
    lastY.current = y;
  }, []);
  return [compact, onScroll];
}

/* ---------------------------------------------------------------------------
   People context — roster lookups resolve seeded + externally-added people
   --------------------------------------------------------------------------- */
const PeopleCtxDM = React.createContext({ get: () => null, all: [] });
function usePeopleDM() { return React.useContext(PeopleCtxDM); }

/* ---------------------------------------------------------------------------
   Faces — DMFace renders the portrait when one exists, otherwise the DS
   Avatar's initials. `size` is always passed by callers: an omitted size
   falls through to the DS 40px default that no CSS rule can reach.
   Honorifics are stripped so "Dr Sarah Kim" reads SK, not DS.
   --------------------------------------------------------------------------- */
function stripHonorificDM(name) { return String(name || "").replace(/^(dr\.?|nurse|prof\.?|mr\.?|mrs\.?|ms\.?)\s+/i, "").trim(); }
function DMFace({ name, src, size = 40, className, style }) {
  return (
    <DSDM.Avatar name={stripHonorificDM(name)} src={src || undefined} size={size} className={className}
      style={{ fontSize: Math.round(size * 0.38), ...(style || {}) }} />);
}
/* Two overlapped faces for a group — each variant is absolutely positioned
   in its own rule; the front face gets a card-coloured ring. */
function GroupStackDM({ members, size = 52 }) {
  const pair = (members || []).slice(0, 2);
  const f = Math.round(size * 0.68);
  return (
    <span className="dm-stack" style={{ width: size, height: size }} aria-hidden="true">
      {pair[0] && <span className="dm-stack-a"><DMFace name={pair[0].name} src={pair[0].avatar} size={f} /></span>}
      {pair[1] && <span className="dm-stack-b"><DMFace name={pair[1].name} src={pair[1].avatar} size={f} /></span>}
    </span>);
}
function ConvAvatarDM({ c, size = 52, dot = true }) {
  const people = usePeopleDM();
  if (c.kind === "group") return <GroupStackDM members={c.memberIds.map(people.get).filter(Boolean)} size={size} />;
  const p = people.get(c.personId);
  return (
    <span className="dm-facewrap" style={{ width: size, height: size }}>
      <DMFace name={p ? p.name : "?"} src={p && p.avatar} size={size} />
      {dot && p && p.online && <span className="dm-online" />}
    </span>);
}

/* ---------------------------------------------------------------------------
   Conversation helpers
   --------------------------------------------------------------------------- */
function convNameDM(c, people) { return c.kind === "group" ? c.name : ((people.get(c.personId) || {}).name || "Unknown"); }
function lastMsgDM(c) { return c.messages.length ? c.messages[c.messages.length - 1] : null; }
function previewDM(c, people) {
  const m = lastMsgDM(c);
  if (!m) return c.kind === "group" ? c.memberIds.length + 1 + " members · say hello" : "Start the conversation";
  if (m.deleted) return m.from === "me" ? "You deleted a message" : "Message deleted";
  const who = m.from === "me" ? "You" : c.kind === "group" ? stripHonorificDM((people.get(m.from) || {}).name || "").split(" ")[0] : null;
  const body = m.gif ? "🎞 GIF" : m.sticker ? "✨ Sticker" : m.image ? "📷 " + (m.text || "Photo") : m.text;
  return who ? who + ": " + body : body;
}
function sortConvsDM(list) {
  return list.slice().sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    const ta = lastMsgDM(a) ? lastMsgDM(a).ts : 0, tb = lastMsgDM(b) ? lastMsgDM(b).ts : 0;
    return tb - ta;
  });
}

/* ---------------------------------------------------------------------------
   Sheet (bottom) — role=dialog, aria-modal, Esc closes, focus moves in and
   returns to the opener on close.
   --------------------------------------------------------------------------- */
function SheetDM({ open, onClose, label, title, children, className }) {
  const ref = useRefDM(null);
  useEffectDM(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    document.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => {
      const el = ref.current && ref.current.querySelector("button:not([disabled]), [href], input, [tabindex]:not([tabindex='-1'])");
      if (el) el.focus();
    });
    return () => { document.removeEventListener("keydown", onKey); cancelAnimationFrame(raf); if (prev && prev.focus) prev.focus(); };
  }, [open]);
  if (!open) return null;
  return (
    <div className="dm-sheet-wrap">
      <div className="dm-scrim" onClick={onClose} />
      <div className={"dm-sheet" + (className ? " " + className : "")} role="dialog" aria-modal="true" aria-label={label || title} ref={ref}>
        <span className="dm-sheet-grab" aria-hidden="true" />
        {title && <h3 className="dm-sheet-title">{title}</h3>}
        {children}
      </div>
    </div>);
}
function SheetActionDM({ icon, label, sub, danger, disabled, onClick }) {
  return (
    <button type="button" className={"dm-sheet-act" + (danger ? " danger" : "")} disabled={disabled} onClick={onClick}>
      <DSDM.IconifyIcon name={icon} size={21} color={danger ? "var(--error)" : "var(--text-heading)"} />
      <span className="dm-sheet-act-main">
        <span className="dm-sheet-act-label">{label}</span>
        {sub && <span className="dm-sheet-act-sub">{sub}</span>}
      </span>
    </button>);
}
function ToastDM({ toast }) {
  if (!toast) return null;
  return <div className="dm-toast" role="status">{toast.text}</div>;
}

/* ---------------------------------------------------------------------------
   Headers
   --------------------------------------------------------------------------- */
function BackHeaderDM({ title, onBack, trailing, sub }) {
  return (
    <header className="dm-head dm-head-back">
      <button type="button" className="dm-iconbtn" aria-label="Back" onClick={onBack}>
        <DSDM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
      </button>
      <span className="dm-head-titlewrap">
        <h1 className="dm-head-title">{title}</h1>
        {sub && <span className="dm-head-sub">{sub}</span>}
      </span>
      {trailing || <span className="dm-head-spacer" />}
    </header>);
}
function SearchDM({ value, onChange, placeholder }) {
  return (
    <div className="dm-search">
      <DSDM.Icon name="search" size={20} color="var(--gray-450)" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value && <button type="button" className="dm-search-clear" aria-label="Clear search" onClick={() => onChange("")}>
        <DSDM.IconifyIcon name="lucide:x" size={16} color="var(--gray-500)" />
      </button>}
    </div>);
}

/* ---------------------------------------------------------------------------
   Conversation row (+ long-press → actions sheet)
   --------------------------------------------------------------------------- */
function ConversationRowDM({ c, onOpen, onActions }) {
  const people = usePeopleDM();
  const press = usePressDM(() => onActions(c));
  const last = lastMsgDM(c);
  const name = convNameDM(c, people);
  return (
    <button type="button" className={"dm-row" + (c.unread ? " unread" : "")} data-thread-id={c.id} onClick={() => onOpen(c)} {...press}
      aria-label={name + (c.unread ? ", " + c.unread + " unread" : "") + ". Hold for options."}>
      <span className="dm-row-av"><ConvAvatarDM c={c} size={52} /></span>
      <span className="dm-row-main">
        <span className="dm-row-top">
          <span className="dm-row-name">{name}</span>
          <span className="dm-row-meta">
            {c.pinned && <DSDM.IconifyIcon name="lucide:pin" size={13} color="var(--brand-gold)" />}
            {c.muted && <DSDM.IconifyIcon name="lucide:bell-off" size={13} color="var(--gray-450)" />}
            <span className="dm-row-time">{last ? fmtListTimeDM(last.ts) : ""}</span>
          </span>
        </span>
        <span className="dm-row-bottom">
          <span className="dm-row-preview">{previewDM(c, people)}</span>
          {c.unread > 0 && <span className="dm-unread">{c.unread}</span>}
        </span>
      </span>
    </button>);
}

/* ---------------------------------------------------------------------------
   Chats tab
   --------------------------------------------------------------------------- */
/* Active now — horizontal strip of people online right now; tapping a face
   opens (or starts) that person's thread. */
function ActiveNowDM({ onOpen }) {
  const people = usePeopleDM();
  const online = people.all.filter((p) => p.online && !p.request).sort((a, b) => a.name.localeCompare(b.name));
  if (!online.length) return null;
  /* first name only, plus a last initial when two online people share it */
  const first = (p) => stripHonorificDM(p.name).split(" ")[0];
  const label = (p) => {
    const parts = stripHonorificDM(p.name).split(" ");
    const dup = online.some((o) => o.id !== p.id && first(o) === parts[0]);
    return dup && parts[1] ? parts[0] + " " + parts[1][0] + "." : parts[0];
  };
  return (
    <section className="dm-active" aria-label="Active now">
      <div className="dm-active-strip" role="list">
        {online.map((p) =>
          <button key={p.id} type="button" role="listitem" className="dm-active-item" onClick={() => onOpen(p.id)} aria-label={"Message " + p.name + ", active now"}>
            <span className="dm-facewrap" style={{ width: 56, height: 56 }}>
              <DMFace name={p.name} src={p.avatar} size={56} />
              <span className="dm-online" />
            </span>
            <span className="dm-active-name">{label(p)}</span>
          </button>)}
      </div>
    </section>);
}

const INBOX_TABS_DM = [{ key: "all", label: "All" }, { key: "unread", label: "Unread" }, { key: "groups", label: "Groups" }];

function ChatsViewDM({ convs, archivedCount, requestsCount, onOpen, onOpenPerson, onActions, onCompose, onArchived, onRequests, onScroll }) {
  const people = usePeopleDM();
  const [inbox, setInbox] = useStateDM("all");
  const [q, setQ] = useStateDM("");
  const unread = convs.filter((c) => c.unread > 0).length;
  const groups = convs.filter((c) => c.kind === "group").length;
  const counts = { all: convs.length, unread, groups };
  const list = sortConvsDM(convs.filter((c) => {
    if (inbox === "unread" && !c.unread) return false;
    if (inbox === "groups" && c.kind !== "group") return false;
    if (q && !convNameDM(c, people).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }));
  return (
    <div className="dm-view" data-screen-label="Messages · Chats">
      <header className="dm-head dm-head-inbox">
        <div className="dm-head-row">
          <h1 className="dm-title">Messages</h1>
          <button type="button" className="dm-iconbtn dm-compose" aria-label="New message" onClick={onCompose}>
            <DSDM.IconifyIcon name="lucide:square-pen" size={21} color="var(--brand-navy)" />
          </button>
        </div>
        {/* inbox filter — sits under the title */}
        <div className="dm-inboxtabs" role="tablist" aria-label="Inbox filter">
          {INBOX_TABS_DM.map((t) =>
            <button key={t.key} type="button" role="tab" aria-selected={inbox === t.key} className={"dm-inboxtab" + (inbox === t.key ? " on" : "")} onClick={() => setInbox(t.key)}>
              {t.label}{counts[t.key] > 0 && t.key !== "all" && <span className="dm-inboxtab-n">{counts[t.key]}</span>}
            </button>)}
        </div>
      </header>
      <div className="dm-scroll" onScroll={onScroll}>
        <SearchDM value={q} onChange={setQ} placeholder="Search messages" />
        <ActiveNowDM onOpen={onOpenPerson} />
        {requestsCount > 0 &&
          <button type="button" className="dm-linkrow" onClick={onRequests}>
            <span className="dm-linkrow-ic"><DSDM.IconifyIcon name="lucide:mail-plus" size={19} color="var(--brand-navy)" /></span>
            <span className="dm-linkrow-label">Message requests</span>
            <span className="dm-unread">{requestsCount}</span>
          </button>}
        <div className="dm-list" role="list">
          {list.map((c) => <ConversationRowDM key={c.id} c={c} onOpen={onOpen} onActions={onActions} />)}
          {list.length === 0 &&
            <div className="dm-empty">
              <DSDM.IconifyIcon name="lucide:message-circle-dashed" size={40} color="var(--gray-300)" />
              <b>{q ? "No conversations match" : inbox === "unread" ? "You're all caught up" : "No group chats yet"}</b>
              <p>{q ? "Try a different name." : inbox === "unread" ? "New messages will show up here." : "Create a group from the compose button."}</p>
            </div>}
        </div>
        {archivedCount > 0 &&
          <button type="button" className="dm-linkrow dm-linkrow-quiet" onClick={onArchived}>
            <span className="dm-linkrow-ic"><DSDM.IconifyIcon name="lucide:archive" size={19} color="var(--gray-500)" /></span>
            <span className="dm-linkrow-label">Archived chats</span>
            <span className="dm-linkrow-count">{archivedCount}</span>
            <DSDM.IconifyIcon name="lucide:chevron-right" size={18} color="var(--gray-400)" />
          </button>}
      </div>
    </div>);
}

/* Generic list view with a back header (Archived · Group chats) */
function ListViewDM({ title, sub, onBack, convs, onOpen, onActions, emptyIcon, emptyTitle, emptyBody, onScroll, label }) {
  return (
    <div className="dm-view" data-screen-label={label || title}>
      <BackHeaderDM title={title} sub={sub} onBack={onBack} />
      <div className="dm-scroll" onScroll={onScroll}>
        <div className="dm-list" role="list">
          {sortConvsDM(convs).map((c) => <ConversationRowDM key={c.id} c={c} onOpen={onOpen} onActions={onActions} />)}
          {convs.length === 0 &&
            <div className="dm-empty">
              <DSDM.IconifyIcon name={emptyIcon || "lucide:inbox"} size={40} color="var(--gray-300)" />
              <b>{emptyTitle}</b><p>{emptyBody}</p>
            </div>}
        </div>
      </div>
    </div>);
}

/* Message requests — Accept / Decline */
function RequestsViewDM({ requests, onBack, onAccept, onDecline, onScroll }) {
  const people = usePeopleDM();
  return (
    <div className="dm-view" data-screen-label="Message requests">
      <BackHeaderDM title="Message requests" sub={requests.length ? requests.length + " waiting" : null} onBack={onBack} />
      <div className="dm-scroll" onScroll={onScroll}>
        <p className="dm-note">People you don't follow yet. They won't know you've seen their message until you accept.</p>
        <div className="dm-list" role="list">
          {requests.map((r) => {
            const p = people.get(r.personId) || { name: "Unknown" };
            return (
              <div key={r.id} className="dm-req" role="listitem">
                <span className="dm-row-av"><DMFace name={p.name} src={p.avatar} size={52} /></span>
                <span className="dm-req-main">
                  <span className="dm-row-top"><span className="dm-row-name">{p.name}</span><span className="dm-row-time">{fmtListTimeDM(r.ts)}</span></span>
                  <span className="dm-req-role">{p.role}</span>
                  <span className="dm-req-text">{r.text}</span>
                  <span className="dm-req-actions">
                    <button type="button" className="dm-btn dm-btn-ghost" onClick={() => onDecline(r)}>Decline</button>
                    <button type="button" className="dm-btn dm-btn-navy" onClick={() => onAccept(r)}>Accept</button>
                  </span>
                </span>
              </div>);
          })}
          {requests.length === 0 &&
            <div className="dm-empty"><DSDM.IconifyIcon name="lucide:mail-check" size={40} color="var(--gray-300)" /><b>No requests</b><p>New requests from people you don't follow land here.</p></div>}
        </div>
      </div>
    </div>);
}

/* Deleted chats — restore */
function DeletedViewDM({ deleted, onBack, onRestore, onScroll }) {
  const people = usePeopleDM();
  return (
    <div className="dm-view" data-screen-label="Deleted chats">
      <BackHeaderDM title="Deleted chats" sub={deleted.length ? deleted.length + " recoverable" : null} onBack={onBack} />
      <div className="dm-scroll" onScroll={onScroll}>
        <p className="dm-note">Deleted chats are kept for 30 days, then removed for good.</p>
        <div className="dm-list" role="list">
          {sortConvsDM(deleted).map((c) =>
            <div key={c.id} className="dm-req" role="listitem">
              <span className="dm-row-av"><ConvAvatarDM c={c} size={52} dot={false} /></span>
              <span className="dm-req-main">
                <span className="dm-row-top"><span className="dm-row-name">{convNameDM(c, people)}</span></span>
                <span className="dm-req-role">{c.messages.filter((m) => !m.deleted).length} messages</span>
              </span>
              <button type="button" className="dm-btn dm-btn-ghost" onClick={() => onRestore(c)}>Restore</button>
            </div>)}
          {deleted.length === 0 &&
            <div className="dm-empty"><DSDM.IconifyIcon name="lucide:trash-2" size={40} color="var(--gray-300)" /><b>Nothing deleted</b><p>Chats you delete can be restored from here for 30 days.</p></div>}
        </div>
      </div>
    </div>);
}

/* ---------------------------------------------------------------------------
   Compose — new message / new group (tickable rows)
   --------------------------------------------------------------------------- */
function PersonTickRowDM({ p, on, onToggle, size = 44 }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} className={"dm-tickrow" + (on ? " on" : "")} onClick={() => onToggle(p.id)}>
      <span className="dm-facewrap" style={{ width: size, height: size }}>
        <DMFace name={p.name} src={p.avatar} size={size} />
        {p.online && <span className="dm-online sm" />}
      </span>
      <span className="dm-tickrow-main">
        <span className="dm-tickrow-name">{p.name}</span>
        <span className="dm-tickrow-sub">{p.role}</span>
      </span>
      <span className="dm-tick" aria-hidden="true">{on && <DSDM.IconifyIcon name="lucide:check" size={14} color="#fff" />}</span>
    </button>);
}
function ComposeViewDM({ people, onBack, onCreate }) {
  const [q, setQ] = useStateDM("");
  const [picked, setPicked] = useStateDM([]);
  const [groupName, setGroupName] = useStateDM("");
  const list = people.filter((p) => !p.request && p.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id) => setPicked((all) => all.includes(id) ? all.filter((x) => x !== id) : all.concat([id]));
  return (
    <div className="dm-view" data-screen-label="New message">
      <BackHeaderDM title="New message" onBack={onBack} />
      <SearchDM value={q} onChange={setQ} placeholder="Search people" />
      {picked.length > 1 &&
        <div className="dm-groupname">
          <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Name this group (optional)" aria-label="Group name" />
        </div>}
      <div className="dm-scroll dm-scroll-tight">
        <div className="dm-list">
          {list.map((p) => <PersonTickRowDM key={p.id} p={p} on={picked.includes(p.id)} onToggle={toggle} />)}
          {list.length === 0 && <div className="dm-empty"><b>No people found</b></div>}
        </div>
      </div>
      <footer className="dm-footer">
        <span className="dm-footer-count">{picked.length} selected</span>
        <button type="button" className="dm-btn dm-btn-navy dm-btn-grow" disabled={picked.length === 0} onClick={() => onCreate(picked, groupName)}>
          {picked.length > 1 ? "Create group" : "Start chat"}
        </button>
      </footer>
    </div>);
}

/* ---------------------------------------------------------------------------
   Thread
   --------------------------------------------------------------------------- */
function ReactionChipsDM({ reactions, onToggle }) {
  const entries = Object.keys(reactions || {}).filter((k) => reactions[k].length);
  if (!entries.length) return null;
  return (
    <span className="dm-reactions">
      {entries.map((emoji) => {
        const mine = reactions[emoji].includes("me");
        return (
          <button key={emoji} type="button" className={"dm-reaction" + (mine ? " mine" : "")} aria-pressed={mine}
            aria-label={emoji + " " + reactions[emoji].length + (mine ? ", you reacted" : "")} onClick={() => onToggle(emoji)}>
            {emoji}<span>{reactions[emoji].length}</span>
          </button>);
      })}
    </span>);
}
function ReactionBarDM({ current, onPick, onClose }) {
  const ref = useRefDM(null);
  useEffectDM(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDoc);
    const raf = requestAnimationFrame(() => { const b = ref.current && ref.current.querySelector("button"); if (b) b.focus(); });
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDoc); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="dm-react-bar" role="toolbar" aria-label="React" ref={ref}>
      {REACTIONS_QUICK_DM.map((e) =>
        <button key={e} type="button" className={"dm-react-opt" + (current.includes(e) ? " on" : "")} aria-label={"React " + e} aria-pressed={current.includes(e)} onClick={() => onPick(e)}>{e}</button>)}
    </div>);
}

function BubbleDM({ m, c, sender, showSender, onReact, onActions, reactOpen, setReactOpen, onOpenImage, highlight, isHit }) {
  const mine = m.from === "me";
  const press = usePressDM(() => onActions(m), !m.deleted);
  const myReactions = Object.keys(m.reactions || {}).filter((k) => m.reactions[k].includes("me"));
  const isGroup = c.kind === "group";
  const imgOnly = !!m.image && !m.text;
  const media = m.gif ? "GIF: " + m.gif.label + ". " : m.sticker ? "Sticker: " + m.sticker.label + ". " : m.image ? "Photo. " : "";
  const label = (mine ? "You: " : (sender ? sender.name + ": " : "")) + media + (m.text || "") + " Hold for options.";
  return (
    <div className={"dm-msg" + (mine ? " me" : "") + (isGroup && !mine ? " grouped" : "") + (showSender ? " first" : "") + (isHit ? " hit" : "")} data-mid={m.id}>
      {isGroup && !mine &&
        <span className="dm-msg-av" aria-hidden={!showSender}>
          {showSender && sender && <DMFace name={sender.name} src={sender.avatar} size={28} />}
        </span>}
      <div className="dm-msg-col">
        {showSender && !mine && isGroup && sender && <span className="dm-msg-sender">{sender.name}</span>}
        <div className="dm-msg-line">
          {m.deleted ?
            <span className="dm-bubble tomb" role="note">{mine ? "You deleted this message" : "This message was deleted"}</span> :
            m.gif ?
            <>
              <button type="button" className={"dm-bubble dm-bubble-gif" + (mine ? " me" : "")} {...press} aria-label={label}>
                <img src={m.gif.src} alt="" draggable="false" />
                <span className="dm-gif-badge">GIF</span>
              </button>
              <button type="button" className="dm-react-trigger" aria-label="Add reaction" aria-expanded={reactOpen}
                onClick={(e) => { e.stopPropagation(); setReactOpen(reactOpen ? null : m.id); }}>
                <DSDM.IconifyIcon name="lucide:smile-plus" size={18} color="var(--gray-500)" />
              </button>
            </> :
            m.sticker ?
            <>
              <button type="button" className={"dm-bubble dm-bubble-sticker" + (mine ? " me" : "")} {...press} aria-label={label}>
                <DmStickerDM sticker={m.sticker} size={132} />
              </button>
              <button type="button" className="dm-react-trigger" aria-label="Add reaction" aria-expanded={reactOpen}
                onClick={(e) => { e.stopPropagation(); setReactOpen(reactOpen ? null : m.id); }}>
                <DSDM.IconifyIcon name="lucide:smile-plus" size={18} color="var(--gray-500)" />
              </button>
            </> :
            <>
              <button type="button" className={"dm-bubble" + (mine ? " me" : "") + (m.image ? " has-img" : "") + (imgOnly ? " img-only" : "")} {...press}
                aria-label={label} onClick={m.image && onOpenImage ? () => onOpenImage(m.image) : undefined}>
                {m.image && <img className="dm-bubble-img" src={m.image} alt="" draggable="false" />}
                {m.text && <span className="dm-bubble-text">{highlight ? highlightDM(m.text, highlight) : m.text}</span>}
              </button>
              <button type="button" className="dm-react-trigger" aria-label="Add reaction" aria-expanded={reactOpen}
                onClick={(e) => { e.stopPropagation(); setReactOpen(reactOpen ? null : m.id); }}>
                <DSDM.IconifyIcon name="lucide:smile-plus" size={18} color="var(--gray-500)" />
              </button>
            </>}
          {reactOpen && <ReactionBarDM current={myReactions} onPick={(e) => { onReact(m.id, e); setReactOpen(null); }} onClose={() => setReactOpen(null)} />}
        </div>
        {!m.deleted && <ReactionChipsDM reactions={m.reactions} onToggle={(e) => onReact(m.id, e)} />}
        <span className="dm-msg-time">{fmtClockDM(m.ts)}{m.edited && !m.deleted ? " · Edited" : ""}</span>
      </div>
    </div>);
}

function EmojiPickerDM({ onPick, onClose }) {
  const [group, setGroup] = useStateDM("smileys");
  const g = EMOJI_GROUPS_DM.find((x) => x.key === group);
  return (
    <div className="dm-emoji" role="region" aria-label="Emoji picker">
      <div className="dm-emoji-tabs" role="tablist" aria-label="Emoji groups">
        {EMOJI_GROUPS_DM.map((x) =>
          <button key={x.key} type="button" role="tab" aria-selected={group === x.key} className={"dm-emoji-tab" + (group === x.key ? " on" : "")} onClick={() => setGroup(x.key)}>
            <DSDM.IconifyIcon name={x.icon} size={16} color={group === x.key ? "#fff" : "var(--gray-600)"} />
            {x.label}
          </button>)}
      </div>
      <div className="dm-emoji-grid" role="tabpanel">
        {g.emojis.map((e) => <button key={e} type="button" className="dm-emoji-btn" aria-label={"Insert " + e} onClick={() => onPick(e)}>{e}</button>)}
      </div>
      <button type="button" className="dm-emoji-close" onClick={onClose}>
        <DSDM.IconifyIcon name="lucide:keyboard" size={18} color="var(--gray-600)" /> Keyboard
      </button>
    </div>);
}

/* ---------------------------------------------------------------------------
   Custom stickers (Genmoji-style) + GIFs — sheet opened from the composer.
   Stickers: base emoji or your avatar + up to three accents on a gradient tile,
   composed from tapped suggestions and keywords in the description. GIFs come
   from the local library in assets/gifs. Sent as m.sticker / m.gif.
   --------------------------------------------------------------------------- */
const DM_STICKER_BGS_DM = [
  "linear-gradient(135deg,#ffd5e1,#e6d7ff)",
  "linear-gradient(135deg,#fde7c8,#ffd0d9)",
  "linear-gradient(135deg,#d6ecff,#e8d9ff)",
  "linear-gradient(135deg,#dff6e8,#d8ecff)",
  "linear-gradient(135deg,#fff1c9,#ffd9c7)"];

const DM_STICKER_SUGGESTIONS_DM = ["me", "❤️", "🤔", "👑"];
const DM_STICKER_MORE_DM = ["✨", "🔥", "🎉", "👍", "👏", "💉", "👄", "⭐", "😂", "😎", "💪", "🏆", "💰", "🚀", "🙏", "💯"];
const DM_STICKER_HATS_DM = ["👑", "🎩", "🎓", "🧢"];

/* Local GIF library (assets/gifs, generated in-repo). Tags drive search + chips. */
const DM_GIFS_DM = [
  { id: "thank-you", label: "Thank you!", tags: ["thanks", "thank you", "grateful", "pray", "reactions"] },
  { id: "congrats", label: "Congrats!", tags: ["congrats", "celebrate", "party", "win", "well done"] },
  { id: "love-it", label: "Love it", tags: ["love", "heart", "reactions", "yes"] },
  { id: "thinking", label: "Hmm…", tags: ["thinking", "hmm", "reactions", "wondering"] },
  { id: "on-fire", label: "On fire!", tags: ["fire", "hot", "amazing", "reactions"] },
  { id: "applause", label: "Bravo!", tags: ["clap", "applause", "congrats", "well done"] },
  { id: "lol", label: "LOL", tags: ["funny", "laugh", "lol", "haha", "reactions"] },
  { id: "mind-blown", label: "Mind blown", tags: ["wow", "mind blown", "funny", "reactions"] },
  { id: "party", label: "Party time", tags: ["party", "celebrate", "congrats", "fun"] },
  { id: "high-five", label: "High five!", tags: ["high five", "yes", "team", "celebrate"] },
  { id: "cheers", label: "Cheers!", tags: ["cheers", "celebrate", "congrats", "drink"] },
  { id: "wow", label: "Wow!", tags: ["wow", "shocked", "reactions"] },
  { id: "good-job", label: "Good job", tags: ["thumbs up", "yes", "good job", "thanks", "reactions"] },
  { id: "crown", label: "Queen", tags: ["crown", "queen", "boss", "love"] },
  { id: "syringe", label: "Inject away", tags: ["syringe", "injector", "clinic", "funny", "filler"] },
  { id: "rocket", label: "Let's go!", tags: ["rocket", "launch", "lets go", "growth", "yes"] }].
map((g) => ({ ...g, src: "assets/gifs/" + g.id + ".gif" }));
const DM_GIF_CHIPS_DM = ["Trending", "Reactions", "Thanks", "Congrats", "Love", "Funny", "Yes"];

function filterGifsDM(query, chip) {
  const q = query.trim().toLowerCase();
  if (q) return DM_GIFS_DM.filter((g) => g.label.toLowerCase().includes(q) || g.tags.some((t) => t.includes(q)));
  if (!chip || chip === "Trending") return DM_GIFS_DM;
  const c = chip.toLowerCase();
  return DM_GIFS_DM.filter((g) => g.tags.some((t) => t.includes(c)));
}

const DM_STICKER_LEXICON_DM = {
  me: "me", myself: "me", selfie: "me", katy: "me",
  heart: "❤️", hearts: "❤️", love: "❤️", loving: "❤️",
  crown: "👑", queen: "👑", king: "👑", royal: "👑",
  think: "🤔", thinking: "🤔", hmm: "🤔", wondering: "🤔",
  syringe: "💉", injection: "💉", injector: "💉", filler: "💉", botox: "💉", toxin: "💉",
  lips: "👄", lip: "👄", kiss: "💋", kisses: "💋",
  star: "⭐", stars: "⭐", sparkle: "✨", sparkles: "✨", glow: "✨", magic: "✨", shine: "✨",
  fire: "🔥", hot: "🔥", lit: "🔥", money: "💰", cash: "💰", rich: "💰", revenue: "💰",
  laugh: "😂", laughing: "😂", lol: "😂", haha: "😂", funny: "😂",
  party: "🎉", celebrate: "🎉", celebration: "🎉", congrats: "🎉", congratulations: "🎉",
  thumbs: "👍", thumbsup: "👍", ok: "👍", okay: "👍", yes: "👍", agree: "👍",
  clap: "👏", clapping: "👏", applause: "👏", bravo: "👏",
  doctor: "🩺", nurse: "🩺", stethoscope: "🩺", clinic: "🏥", hospital: "🏥",
  rocket: "🚀", launch: "🚀", smile: "😊", smiling: "😊", happy: "😊",
  cool: "😎", sunglasses: "😎", shades: "😎", sad: "😢", cry: "😢", crying: "😢",
  angry: "😠", mad: "😠", wow: "😮", shocked: "😮", surprised: "😮",
  sleepy: "😴", tired: "😴", sleep: "😴", coffee: "☕", tea: "🍵",
  cake: "🎂", birthday: "🎂", trophy: "🏆", winner: "🏆", win: "🏆", champion: "🏆",
  medal: "🏅", gold: "🏅", flower: "🌸", flowers: "💐", rose: "🌹",
  sun: "☀️", sunny: "☀️", rainbow: "🌈", unicorn: "🦄",
  muscle: "💪", strong: "💪", flex: "💪", brain: "🧠", smart: "🧠",
  idea: "💡", lightbulb: "💡", book: "📚", books: "📚", study: "📚", learning: "📚",
  chart: "📈", growth: "📈", growing: "📈", target: "🎯", goal: "🎯", goals: "🎯",
  wave: "👋", hi: "👋", hello: "👋", hey: "👋", bye: "👋",
  pray: "🙏", thanks: "🙏", thank: "🙏", grateful: "🙏", please: "🙏",
  hundred: "💯", perfect: "💯", check: "✅", done: "✅", tick: "✅",
  hat: "🎩", graduate: "🎓", graduation: "🎓", cap: "🧢",
  mastery: "🏅", confidence: "✨", profinity: "👑" };

function composeStickerDM(desc, picks) {
  const items = [];
  const push = (v) => { if (v && !items.includes(v)) items.push(v); };
  picks.forEach(push);
  desc.toLowerCase().split(/[^a-z0-9]+/).forEach((w) => push(DM_STICKER_LEXICON_DM[w]));
  (desc.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]️?/gu) || []).forEach(push);
  if (!items.length) return null;
  const withMe = items.includes("me");
  const emojis = items.filter((x) => x !== "me");
  const base = withMe ? "me" : emojis[0];
  const accents = (withMe ? emojis : emojis.slice(1)).slice(0, 3);
  const label = desc.trim() || (withMe ? "Me" + (accents.length ? " with " + accents.join(" ") : "") : emojis.join(" "));
  let h = 0;
  for (const c of label) h = (h * 31 + c.codePointAt(0)) >>> 0;
  return { kind: "sticker", base, accents, label, bg: h % DM_STICKER_BGS_DM.length };
}

function readRecentStickersDM() {
  try { return JSON.parse(window.localStorage.getItem("pf-dm-stickers") || "[]"); } catch (e) { return []; }
}
function saveRecentStickerDM(s) {
  const list = [s, ...readRecentStickersDM().filter((x) => x.label !== s.label)].slice(0, 12);
  try { window.localStorage.setItem("pf-dm-stickers", JSON.stringify(list)); } catch (e) { /* private mode */ }
  return list;
}

function DmStickerDM({ sticker, size = 120 }) {
  const hat = sticker.accents.find((a) => DM_STICKER_HATS_DM.includes(a));
  const rest = sticker.accents.filter((a) => a !== hat);
  const corners = [{ right: "-3%", top: "-4%" }, { left: "-4%", bottom: "0%" }, { right: "-2%", bottom: "-4%", transform: "rotate(12deg)" }];
  return (
    <span className="dm-sticker" role="img" aria-label={"Sticker: " + sticker.label}
      style={{ width: size, height: size, background: DM_STICKER_BGS_DM[sticker.bg], borderRadius: size * 0.28 }}>
      {sticker.base === "me" ?
      <span className="dm-sticker-me"><DMFace name={ME_DM.name} src={ME_DM.avatar} size={Math.round(size * 0.66)} /></span> :
      <span className="dm-sticker-base" style={{ fontSize: size * 0.56 }}>{sticker.base}</span>}
      {hat &&
      <span className="dm-sticker-accent hat" style={{ fontSize: size * 0.34, top: sticker.base === "me" ? "-6%" : "-10%" }}>{hat}</span>}
      {rest.map((a, i) =>
      <span key={i} className="dm-sticker-accent" style={{ fontSize: size * 0.3, ...corners[i] }}>{a}</span>
      )}
    </span>);
}

function DmStickerSheetDM({ onClose, onSend, onSendGif, initialMode = "sticker" }) {
  const [mode, setMode] = useStateDM(initialMode);
  const [gifQuery, setGifQuery] = useStateDM("");
  const [gifChip, setGifChip] = useStateDM("Trending");
  const [gifPick, setGifPick] = useStateDM(null);
  const [desc, setDesc] = useStateDM("");
  const [picks, setPicks] = useStateDM([]);
  const [result, setResult] = useStateDM(null);
  const [busy, setBusy] = useStateDM(false);
  const [more, setMore] = useStateDM(false);
  const [recents] = useStateDM(readRecentStickersDM);
  const inputRef = useRefDM(null);

  useEffectDM(() => {
    const draft = composeStickerDM(desc, picks);
    if (!draft) { setResult(null); setBusy(false); return; }
    setBusy(true);
    const t = window.setTimeout(() => { setResult(draft); setBusy(false); }, 900);
    return () => window.clearTimeout(t);
  }, [desc, picks.join("|")]);

  useEffectDM(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function togglePick(k) {
    setPicks((p) => p.includes(k) ? p.filter((x) => x !== k) : [...p, k]);
  }
  function confirm() {
    if (!result || busy) return;
    saveRecentStickerDM(result);
    onSend(result);
  }

  const list = more ? [...DM_STICKER_SUGGESTIONS_DM, ...DM_STICKER_MORE_DM] : DM_STICKER_SUGGESTIONS_DM;
  const isGif = mode === "gif";
  const gifs = filterGifsDM(gifQuery, gifChip);
  const ready = isGif ? !!gifPick : !!result && !busy;
  function confirmGif() { if (gifPick) onSendGif(gifPick); }
  const onConfirm = isGif ? confirmGif : confirm;

  return (
    <div className="dm-sticker-overlay" onClick={onClose}>
      <div className="dm-sticker-sheet" role="dialog" aria-label="Create a custom sticker" onClick={(e) => e.stopPropagation()}>
        <div className="dm-sticker-top">
          <button className="dm-sticker-circ" aria-label="Close" onClick={onClose}>
            <DSDM.IconifyIcon name="lucide:x" size={22} color="var(--text-heading)" />
          </button>
          <div className="dm-sticker-seg" role="tablist" aria-label="Sticker or GIF">
            <button role="tab" aria-selected={!isGif} className={!isGif ? "on" : ""} onClick={() => setMode("sticker")}>Sticker</button>
            <button role="tab" aria-selected={isGif} className={isGif ? "on" : ""} onClick={() => setMode("gif")}>GIF</button>
          </div>
          <button className={"dm-sticker-circ confirm" + (ready ? " on" : "")} aria-label={isGif ? "Send GIF" : "Send sticker"}
            disabled={!ready} onClick={onConfirm}>
            <DSDM.IconifyIcon name="lucide:check" size={22} color={ready ? "#fff" : "var(--gray-450)"} />
          </button>
        </div>

        {isGif &&
        <div className="dm-gif-pane">
            <div className="dm-gif-search">
              <DSDM.IconifyIcon name="lucide:search" size={18} color="var(--gray-450)" />
              <input type="text" placeholder="Search GIFs" aria-label="Search GIFs" value={gifQuery}
                onChange={(e) => setGifQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmGif(); }} />
              {gifQuery &&
              <button className="dm-sticker-clear" aria-label="Clear search" onClick={() => setGifQuery("")}>
                  <DSDM.IconifyIcon name="lucide:x" size={14} color="var(--gray-450)" />
                </button>}
            </div>
            <div className="dm-gif-chips">
              {DM_GIF_CHIPS_DM.map((c) =>
            <button key={c} className={"dm-gif-chip" + (gifChip === c && !gifQuery ? " on" : "")}
              onClick={() => { setGifChip(c); setGifQuery(""); }}>{c}</button>
            )}
            </div>
            <div className="dm-gif-grid">
              {gifs.map((g) =>
            <button key={g.id} className={"dm-gif-tile" + (gifPick && gifPick.id === g.id ? " on" : "")}
              aria-label={"GIF: " + g.label} aria-pressed={!!gifPick && gifPick.id === g.id}
              onClick={() => setGifPick((cur) => cur && cur.id === g.id ? null : g)}>
                  <img src={g.src} alt={g.label} loading="lazy" />
                  {gifPick && gifPick.id === g.id &&
              <span className="dm-gif-tick"><DSDM.IconifyIcon name="lucide:check" size={14} color="#fff" /></span>}
                </button>
            )}
              {gifs.length === 0 && <div className="dm-gif-empty">No GIFs match “{gifQuery}”.</div>}
            </div>
            <p className="dm-sticker-beta"><span className="dm-sticker-beta-tag">GIF</span> Tap a GIF to select it, then send with the tick.</p>
          </div>}

        {!isGif && <>
        <div className="dm-sticker-stage" onClick={() => inputRef.current && inputRef.current.focus()}>
          <div className={"dm-sticker-glow" + (busy ? " busy" : "")} />
          {ready ?
          <div className="dm-sticker-result" key={result.label + result.base + result.accents.join("")}>
              <DmStickerDM sticker={result} size={196} />
              <span className="dm-sticker-caption">{result.label}</span>
            </div> :
          busy ?
          <p className="dm-sticker-hint busy">Creating your sticker…</p> :
          <p className="dm-sticker-hint">Describe a sticker or add a suggestion from the list.</p>}
        </div>

        <div className="dm-sticker-sug-h">
          <span>Suggestions</span>
          <button onClick={() => setMore((m) => !m)}>{more ? "Show Less" : "Show More"}</button>
        </div>
        <div className={"dm-sticker-sug" + (more ? " grid" : "")}>
          {list.map((k) =>
          <button key={k} className={"dm-sticker-opt" + (picks.includes(k) ? " on" : "")}
            aria-label={k === "me" ? "Add yourself" : "Add " + k} aria-pressed={picks.includes(k)} onClick={() => togglePick(k)}>
              {k === "me" ? <DMFace name={ME_DM.name} src={ME_DM.avatar} size={56} /> : <span className="dm-sticker-opt-emoji">{k}</span>}
            </button>
          )}
          {!more &&
          <button className="dm-sticker-opt" aria-label="Show more suggestions" onClick={() => setMore(true)}>
              <DSDM.IconifyIcon name="lucide:smile-plus" size={28} color="var(--text-heading)" />
            </button>}
        </div>

        {more && recents.length > 0 &&
        <>
            <div className="dm-sticker-sug-h"><span>Your stickers</span></div>
            <div className="dm-sticker-recents">
              {recents.map((s, i) =>
            <button key={i} className="dm-sticker-recent" aria-label={"Use sticker " + s.label}
              onClick={() => { setResult(s); setBusy(false); }}>
                  <DmStickerDM sticker={s} size={56} />
                </button>
            )}
            </div>
          </>}

        <p className="dm-sticker-beta"><span className="dm-sticker-beta-tag">BETA</span> Custom stickers may create unexpected results.</p>

        <div className="dm-sticker-compose">
          <div className="dm-sticker-field">
            <DSDM.IconifyIcon name="lucide:sparkles" size={22} color="var(--ai-purple)" />
            <input ref={inputRef} type="text" placeholder="Describe a sticker" aria-label="Describe a sticker" value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirm(); }} />
            {desc &&
            <button className="dm-sticker-clear" aria-label="Clear description" onClick={() => setDesc("")}>
                <DSDM.IconifyIcon name="lucide:x" size={14} color="var(--gray-450)" />
              </button>}
          </div>
          <button className={"dm-sticker-circ me" + (picks.includes("me") ? " on" : "")} aria-label="Add yourself to the sticker"
            aria-pressed={picks.includes("me")} onClick={() => togglePick("me")}>
            <DSDM.IconifyIcon name="lucide:user-round" size={22} color={picks.includes("me") ? "#fff" : "var(--ai-purple)"} />
          </button>
        </div>
        </>}
      </div>
    </div>);
}

function ThreadViewDM({ c, onBack, onProfile, onSend, onReact, onEdit, onDelete, onMenu, toast, searchOpen, onCloseSearch }) {
  const people = usePeopleDM();
  const [text, setText] = useStateDM("");
  const [emojiOpen, setEmojiOpen] = useStateDM(false);
  const [reactOpen, setReactOpen] = useStateDM(null);
  const [actionsFor, setActionsFor] = useStateDM(null);
  const [editing, setEditing] = useStateDM(null);
  const [typing, setTyping] = useStateDM(null);
  const [attach, setAttach] = useStateDM(null);          // pending photo (data URL) for the next message
  const [attachOpen, setAttachOpen] = useStateDM(false); // "+" sheet: library / camera / GIF / sticker
  const [stickerOpen, setStickerOpen] = useStateDM(null); // null | "sticker" | "gif" — custom sticker / GIF sheet
  const [lightbox, setLightbox] = useStateDM(null);      // full-screen photo viewer
  const [q, setQ] = useStateDM("");                       // in-conversation search
  const [hit, setHit] = useStateDM(0);
  const bodyRef = useRefDM(null);
  const inputRef = useRefDM(null);
  const fileRef = useRefDM(null);
  const camRef = useRefDM(null);
  const replyTimer = useRefDM(null);
  const now = useNowDM(!!actionsFor || editing !== null);

  const name = convNameDM(c, people);
  const firstName = stripHonorificDM(name).split(" ")[0];
  const person = c.kind === "dm" ? people.get(c.personId) : null;
  const members = c.kind === "group" ? c.memberIds.map(people.get).filter(Boolean) : [];
  const onlineN = members.filter((p) => p.online).length;
  const isEmpty = c.messages.length === 0;

  const needle = q.trim();
  const hits = needle ? c.messages.filter((m) => !m.deleted && m.text && m.text.toLowerCase().includes(needle.toLowerCase())).map((m) => m.id) : [];
  const hitId = hits.length ? hits[Math.min(hit, hits.length - 1)] : null;

  useEffectDM(() => { const el = bodyRef.current; if (el && !searchOpen) el.scrollTop = el.scrollHeight; }, [c.messages.length, typing, emojiOpen]);
  useEffectDM(() => () => { if (replyTimer.current) window.clearTimeout(replyTimer.current); }, []);
  // new query → jump to the most recent match
  useEffectDM(() => { setHit(Math.max(0, hits.length - 1)); }, [needle]);
  useEffectDM(() => {
    if (!hitId || !bodyRef.current) return;
    const el = bodyRef.current.querySelector('[data-mid="' + hitId + '"]');
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [hitId]);
  useEffectDM(() => { if (searchOpen) { setEmojiOpen(false); setActionsFor(null); } else setQ(""); }, [searchOpen]);

  function stepHit(dir) { if (hits.length) setHit((i) => (Math.min(i, hits.length - 1) + dir + hits.length) % hits.length); }
  function closeSearch() { setQ(""); onCloseSearch && onCloseSearch(); }

  function onPickFile(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (!/^image\//.test(f.type)) { toast("Only photos are supported for now"); return; }
    shrinkImageDM(f).then((url) => {
      setAttach(url); setAttachOpen(false);
      requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
    });
  }

  function simulateReply() {
    const pool = c.kind === "group" ? members : [person].filter(Boolean);
    if (!pool.length) return;
    const who = pool[Math.floor(Math.random() * pool.length)];
    setTyping(who);
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      setTyping(null);
      onSend(c.id, { from: who.id, text: SAMPLE_REPLIES_DM[Math.floor(Math.random() * SAMPLE_REPLIES_DM.length)] });
    }, 1700);
  }
  function submit() {
    const v = text.trim();
    if (editing) { if (!v) return; onEdit(c.id, editing.id, v); setEditing(null); setText(""); toast("Message edited"); return; }
    if (!v && !attach) return;
    onSend(c.id, { from: "me", text: v, image: attach });
    setText("");
    setAttach(null);
    simulateReply();
  }
  function sendWave() { onSend(c.id, { from: "me", text: "👋" }); simulateReply(); }
  function sendSticker(sticker) { onSend(c.id, { from: "me", text: "", sticker }); setStickerOpen(null); simulateReply(); }
  function sendGif(gif) { onSend(c.id, { from: "me", text: "", gif: { id: gif.id, src: gif.src, label: gif.label } }); setStickerOpen(null); simulateReply(); }
  function openStickers(mode) { setEmojiOpen(false); setAttachOpen(false); inputRef.current && inputRef.current.blur(); setStickerOpen(mode); }
  const canSend = !!text.trim() || (!editing && !!attach);
  function startEdit(m) { setEditing(m); setText(m.text); setActionsFor(null); setEmojiOpen(false); requestAnimationFrame(() => inputRef.current && inputRef.current.focus()); }
  function cancelEdit() { setEditing(null); setText(""); }
  function insertEmoji(e) { setText((t) => t + e); }

  const actMsg = actionsFor ? c.messages.find((m) => m.id === actionsFor.id) : null;
  const editLeft = actMsg ? EDIT_WINDOW_DM - (now - actMsg.ts) : 0;
  const canEdit = actMsg && actMsg.from === "me" && editLeft > 0;

  return (
    <div className="dm-view dm-thread" data-screen-label={"Thread · " + name}>
      {searchOpen ?
      <header className="dm-head dm-thread-head dm-thread-search" role="search">
        <button type="button" className="dm-iconbtn" aria-label="Close search" onClick={closeSearch}>
          <DSDM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
        <div className="dm-search dm-search-inline">
          <DSDM.IconifyIcon name="lucide:search" size={18} color="var(--gray-450)" />
          <input type="search" value={q} placeholder={"Search in " + (c.kind === "group" ? name : firstName) + "…"} aria-label="Search in conversation" autoFocus
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") stepHit(e.shiftKey ? 1 : -1); if (e.key === "Escape") closeSearch(); }} />
          {q && <button type="button" className="dm-search-clear" aria-label="Clear search" onClick={() => setQ("")}>
            <DSDM.IconifyIcon name="lucide:x" size={16} color="var(--gray-600)" />
          </button>}
        </div>
        <span className="dm-search-count" aria-live="polite">{needle ? (hits.length ? (Math.min(hit, hits.length - 1) + 1) + "/" + hits.length : "0") : ""}</span>
        <button type="button" className="dm-iconbtn sm" aria-label="Older result" disabled={hits.length < 2} onClick={() => stepHit(-1)}>
          <DSDM.IconifyIcon name="lucide:chevron-up" size={22} color={hits.length < 2 ? "var(--gray-300)" : "var(--brand-navy)"} />
        </button>
        <button type="button" className="dm-iconbtn sm" aria-label="Newer result" disabled={hits.length < 2} onClick={() => stepHit(1)}>
          <DSDM.IconifyIcon name="lucide:chevron-down" size={22} color={hits.length < 2 ? "var(--gray-300)" : "var(--brand-navy)"} />
        </button>
      </header> :
      <header className="dm-head dm-thread-head">
        <button type="button" className="dm-iconbtn" aria-label="Back to chats" onClick={onBack}>
          <DSDM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
        <button type="button" className="dm-thread-id" onClick={onProfile} aria-label={c.kind === "group" ? "View group members" : "View " + name + "'s profile"}>
          <ConvAvatarDM c={c} size={40} />
          <span className="dm-thread-idmain">
            <span className="dm-thread-name">{name}</span>
            <span className="dm-thread-status">
              {c.kind === "group" ? (members.length + 1) + " members" + (onlineN ? " · " + onlineN + " online" : "") : presenceDM(person)}
            </span>
          </span>
        </button>
        <button type="button" className="dm-iconbtn" aria-label="Conversation settings" aria-haspopup="dialog" onClick={onMenu}>
          <DSDM.IconifyIcon name="lucide:more-vertical" size={22} color="var(--brand-navy)" />
        </button>
      </header>}

      <div className="dm-scroll dm-thread-body" ref={bodyRef} onClick={() => { setReactOpen(null); }}>
        {searchOpen && needle && !hits.length &&
          <div className="dm-search-none" role="status">No messages match “{needle}”</div>}
        {isEmpty && !typing ?
          <div className="dm-thread-empty">
            <ConvAvatarDM c={c} size={84} dot={false} />
            <b>{c.kind === "group" ? "Welcome to " + name : "Say hello to " + firstName}</b>
            <p>{c.kind === "group" ?
              "No messages yet — be the first to post something for the group." :
              "No messages yet. Send " + firstName + " a message or a photo to get the conversation going."}</p>
            <button type="button" className="dm-btn dm-btn-navy dm-btn-wave" onClick={sendWave}>
              <span aria-hidden="true">👋</span> Send a wave
            </button>
          </div> :
          <>
            {!isEmpty && <div className="dm-daychip"><span>{fmtListTimeDM(c.messages[0].ts) !== fmtClockDM(c.messages[0].ts) ? fmtListTimeDM(c.messages[0].ts) : "Today"}</span></div>}
            {c.messages.map((m, i) => {
              const prev = c.messages[i - 1];
              const showSender = !prev || prev.from !== m.from || (m.ts - prev.ts) > 10 * MIN_DM;
              return (
                <BubbleDM key={m.id} m={m} c={c} sender={m.from === "me" ? ME_DM : people.get(m.from)} showSender={showSender}
                  onReact={onReact.bind(null, c.id)} onActions={(msg) => setActionsFor(msg)}
                  reactOpen={reactOpen === m.id} setReactOpen={setReactOpen}
                  onOpenImage={setLightbox} highlight={searchOpen ? needle : ""} isHit={m.id === hitId} />);
            })}
          </>}
        {typing &&
          <div className={"dm-msg" + (c.kind === "group" ? " grouped first" : "")}>
            {c.kind === "group" && <span className="dm-msg-av"><DMFace name={typing.name} src={typing.avatar} size={28} /></span>}
            <div className="dm-msg-col">
              {c.kind === "group" && <span className="dm-msg-sender">{typing.name}</span>}
              <div className="dm-msg-line"><span className="dm-bubble dm-typing" aria-label={typing.name + " is typing"}><i /><i /><i /></span></div>
            </div>
          </div>}
      </div>

      {editing &&
        <div className="dm-editbar" role="status">
          <DSDM.IconifyIcon name="lucide:pencil" size={16} color="var(--brand-navy)" />
          <span>Editing message · {fmtCountdownDM(EDIT_WINDOW_DM - (now - editing.ts))} left</span>
          <button type="button" className="dm-iconbtn sm" aria-label="Cancel edit" onClick={cancelEdit}><DSDM.IconifyIcon name="lucide:x" size={18} color="var(--gray-600)" /></button>
        </div>}

      {attach && !editing &&
        <div className="dm-attach-bar" role="status">
          <img className="dm-attach-thumb" src={attach} alt="Attached photo" />
          <span className="dm-attach-text">Photo attached</span>
          <button type="button" className="dm-iconbtn sm" aria-label="Remove photo" onClick={() => setAttach(null)}>
            <DSDM.IconifyIcon name="lucide:x" size={18} color="var(--gray-600)" />
          </button>
        </div>}

      <div className="dm-composer">
        <button type="button" className={"dm-iconbtn" + (attach ? " on" : "")} aria-label="Add photo" aria-haspopup="dialog" disabled={!!editing}
          onClick={() => { setEmojiOpen(false); setAttachOpen(true); }}>
          <DSDM.IconifyIcon name={attach ? "lucide:image-plus" : "lucide:plus"} size={22} color={editing ? "var(--gray-300)" : "var(--brand-navy)"} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
        <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={onPickFile} />
        <div className="dm-composer-field">
          <input ref={inputRef} type="text" value={text} placeholder={editing ? "Edit message…" : attach ? "Add a caption…" : "Message…"} aria-label={editing ? "Edit message" : "Message"}
            onChange={(e) => setText(e.target.value)} onFocus={() => setEmojiOpen(false)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape" && editing) cancelEdit(); }} />
          {!editing && !text.trim() &&
          <button type="button" className="dm-gif-btn" aria-label="Send a GIF" aria-haspopup="dialog" onClick={() => openStickers("gif")}>GIF</button>}
          {!editing &&
          <button type="button" className="dm-iconbtn sm dm-sticker-btn" aria-label="Custom sticker" aria-haspopup="dialog" onClick={() => openStickers("sticker")}>
            <DSDM.IconifyIcon name="lucide:sticker" size={21} color="var(--ai-purple)" />
          </button>}
          <button type="button" className={"dm-iconbtn sm dm-emoji-toggle" + (emojiOpen ? " on" : "")} aria-label={emojiOpen ? "Hide emoji" : "Emoji"} aria-expanded={emojiOpen}
            onClick={() => { setEmojiOpen((v) => !v); if (emojiOpen) requestAnimationFrame(() => inputRef.current && inputRef.current.focus()); else inputRef.current && inputRef.current.blur(); }}>
            <DSDM.IconifyIcon name="lucide:smile" size={21} color={emojiOpen ? "#fff" : "var(--gray-600)"} />
          </button>
        </div>
        <button type="button" className={"dm-send" + (canSend ? " on" : "")} aria-label={editing ? "Save edit" : "Send"} disabled={!canSend} onClick={submit}>
          <DSDM.IconifyIcon name={editing ? "lucide:check" : "lucide:arrow-up"} size={20} color="#fff" />
        </button>
      </div>
      {emojiOpen && <EmojiPickerDM onPick={insertEmoji} onClose={() => { setEmojiOpen(false); requestAnimationFrame(() => inputRef.current && inputRef.current.focus()); }} />}
      {!emojiOpen && <div className="dm-composer-safe" aria-hidden="true" />}

      {/* message actions — long-press */}
      <SheetDM open={!!actMsg} onClose={() => setActionsFor(null)} label="Message options">
        {actMsg &&
          <>
            <div className={"dm-sheet-quote" + (actMsg.from === "me" ? " me" : "") + (actMsg.image || actMsg.gif || actMsg.sticker ? " has-img" : "")}>
              {actMsg.image && <img className="dm-sheet-quote-img" src={actMsg.image} alt="" />}
              {actMsg.gif && <img className="dm-sheet-quote-img" src={actMsg.gif.src} alt="" />}
              {actMsg.sticker && <DmStickerDM sticker={actMsg.sticker} size={64} />}
              {actMsg.text || (actMsg.gif ? "GIF" : actMsg.sticker ? "Sticker" : actMsg.image ? "Photo" : "")}
            </div>
            <div className="dm-sheet-reacts" role="toolbar" aria-label="React">
              {REACTIONS_QUICK_DM.map((e) =>
                <button key={e} type="button" className={"dm-react-opt" + ((actMsg.reactions[e] || []).includes("me") ? " on" : "")} aria-label={"React " + e}
                  onClick={() => { onReact(c.id, actMsg.id, e); setActionsFor(null); }}>{e}</button>)}
            </div>
            {actMsg.text && <SheetActionDM icon="lucide:copy" label="Copy text" onClick={() => { try { navigator.clipboard && navigator.clipboard.writeText(actMsg.text); } catch (e) {} setActionsFor(null); toast("Copied"); }} />}
            {actMsg.image && <SheetActionDM icon="lucide:maximize-2" label="View photo" onClick={() => { setActionsFor(null); setLightbox(actMsg.image); }} />}
            {actMsg.from === "me" &&
              <>
                <SheetActionDM icon="lucide:pencil" label="Edit message" disabled={!canEdit || !!actMsg.gif || !!actMsg.sticker}
                  sub={canEdit ? fmtCountdownDM(editLeft) + " left to edit" : "Edit window closed (5 min)"} onClick={() => startEdit(actMsg)} />
                <SheetActionDM icon="lucide:trash-2" label="Delete message" danger onClick={() => { onDelete(c.id, actMsg.id); setActionsFor(null); toast("Message deleted"); }} />
              </>}
            <button type="button" className="dm-sheet-cancel" onClick={() => setActionsFor(null)}>Cancel</button>
          </>}
      </SheetDM>

      {/* "+" — add a photo to the message */}
      <SheetDM open={attachOpen} onClose={() => setAttachOpen(false)} label="Add to message" title="Add to message">
        <SheetActionDM icon="lucide:image" label="Photo library" sub="Choose a photo from your device" onClick={() => fileRef.current && fileRef.current.click()} />
        <SheetActionDM icon="lucide:camera" label="Take photo" sub="Open the camera" onClick={() => camRef.current && camRef.current.click()} />
        <SheetActionDM icon="lucide:film" label="GIF" sub="Search and send a GIF" onClick={() => openStickers("gif")} />
        <SheetActionDM icon="lucide:sticker" label="Custom sticker" sub="Describe a sticker or build one from suggestions" onClick={() => openStickers("sticker")} />
        <button type="button" className="dm-sheet-cancel" onClick={() => setAttachOpen(false)}>Cancel</button>
      </SheetDM>

      {/* custom sticker / GIF sheet */}
      {stickerOpen &&
        <DmStickerSheetDM initialMode={stickerOpen} onClose={() => setStickerOpen(null)} onSend={sendSticker} onSendGif={sendGif} />}

      {/* full-screen photo viewer */}
      {lightbox &&
        <div className="dm-lightbox" role="dialog" aria-modal="true" aria-label="Photo" onClick={() => setLightbox(null)}>
          <button type="button" className="dm-lightbox-close" aria-label="Close photo" autoFocus onClick={() => setLightbox(null)}>
            <DSDM.IconifyIcon name="lucide:x" size={22} color="#fff" />
          </button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
        </div>}
    </div>);
}

/* ---------------------------------------------------------------------------
   Profile — person or group (branch on kind)
   --------------------------------------------------------------------------- */
function ProfileViewDM({ c, onBack, onToggleMute, onAddMembers, onLeave, onOpenThreadWith, toast }) {
  const people = usePeopleDM();
  const membersRef = useRefDM(null);
  if (c.kind === "group") {
    const members = c.memberIds.map(people.get).filter(Boolean);
    const roleOf = (id) => (c.roles || {})[id] || "Member";
    const all = [{ ...ME_DM, role: roleOf("me") === "Member" ? ME_DM.role : roleOf("me"), isMe: true }].concat(members);
    return (
      <div className="dm-view" data-screen-label="Group profile">
        <BackHeaderDM title="" onBack={onBack} />
        <div className="dm-scroll dm-profile">
          <div className="dm-profile-top">
            <GroupStackDM members={members} size={104} />
            <h2 className="dm-profile-name">{c.name}</h2>
            <span className="dm-profile-role">{members.length + 1} members · {members.filter((p) => p.online).length} online</span>
            <div className="dm-profile-actions">
              <button type="button" className="dm-pact" onClick={() => membersRef.current && membersRef.current.scrollIntoView({ behavior: "smooth", block: "start" })}>
                <span className="ic"><DSDM.IconifyIcon name="lucide:users" size={20} color="var(--brand-navy)" /></span>View members
              </button>
              <button type="button" className="dm-pact" onClick={onAddMembers}>
                <span className="ic"><DSDM.IconifyIcon name="lucide:user-plus" size={20} color="var(--brand-navy)" /></span>Add members
              </button>
              <button type="button" className={"dm-pact" + (c.muted ? " on" : "")} aria-pressed={!!c.muted} onClick={onToggleMute}>
                <span className="ic"><DSDM.IconifyIcon name={c.muted ? "lucide:bell-off" : "lucide:bell"} size={20} color="var(--brand-navy)" /></span>{c.muted ? "Unmute" : "Mute"}
              </button>
            </div>
          </div>
          <section className="dm-psec" ref={membersRef}>
            <div className="dm-psec-h"><h3>Members</h3><span className="dm-psec-n">{all.length}</span></div>
            <div className="dm-members" role="list">
              {all.map((p) =>
                <div key={p.id} className="dm-member" role="listitem">
                  <span className="dm-facewrap" style={{ width: 44, height: 44 }}>
                    <DMFace name={p.name} src={p.avatar} size={44} />
                    {p.online && <span className="dm-online sm" />}
                  </span>
                  <span className="dm-member-main">
                    <span className="dm-member-name">{p.name}{p.isMe && <span className="dm-you">You</span>}</span>
                    <span className="dm-member-sub">{p.isMe ? ME_DM.role : p.role}</span>
                  </span>
                  <span className={"dm-role" + (roleOf(p.id) === "Admin" ? " admin" : roleOf(p.id) === "Moderator" ? " mod" : "")}>{roleOf(p.id)}</span>
                  {!p.isMe && <button type="button" className="dm-iconbtn sm" aria-label={"Message " + p.name} onClick={() => onOpenThreadWith(p.id)}>
                    <DSDM.IconifyIcon name="lucide:message-circle" size={19} color="var(--brand-navy)" />
                  </button>}
                </div>)}
            </div>
          </section>
          <section className="dm-psec">
            <button type="button" className="dm-leave" onClick={onLeave}>
              <DSDM.IconifyIcon name="lucide:log-out" size={20} color="var(--error)" /> Leave group
            </button>
          </section>
          <div style={{ height: 32 }} />
        </div>
      </div>);
  }
  const p = people.get(c.personId) || { name: "Unknown", seals: [] };
  return (
    <div className="dm-view" data-screen-label="Contact profile">
      <BackHeaderDM title="" onBack={onBack} />
      <div className="dm-scroll dm-profile">
        <div className="dm-profile-top">
          <span className="dm-facewrap" style={{ width: 104, height: 104 }}>
            <DMFace name={p.name} src={p.avatar} size={104} />
            {p.online && <span className="dm-online lg" />}
          </span>
          <h2 className="dm-profile-name">{p.name}{p.seals && p.seals.length > 0 && <DSDM.VerificationSeals seals={p.seals} size={18} />}</h2>
          <span className="dm-profile-role">{p.role}</span>
          <span className="dm-profile-presence">{presenceDM(p)}</span>
          <div className="dm-profile-actions">
            <button type="button" className="dm-pact" onClick={() => goDM("ClinicianDirectory.html?from=" + encodeURIComponent("Messages.html?t=" + c.id))}>
              <span className="ic"><DSDM.IconifyIcon name="lucide:user" size={20} color="var(--brand-navy)" /></span>View Profile
            </button>
            <button type="button" className={"dm-pact" + (c.muted ? " on" : "")} aria-pressed={!!c.muted} onClick={onToggleMute}>
              <span className="ic"><DSDM.IconifyIcon name={c.muted ? "lucide:bell-off" : "lucide:bell"} size={20} color="var(--brand-navy)" /></span>{c.muted ? "Unmute" : "Mute"}
            </button>
            <button type="button" className="dm-pact" onClick={() => toast("Calling " + stripHonorificDM(p.name).split(" ")[0] + "…")}>
              <span className="ic"><DSDM.IconifyIcon name="lucide:phone" size={20} color="var(--brand-navy)" /></span>Call
            </button>
          </div>
        </div>
        <section className="dm-psec">
          <div className="dm-psec-h"><h3>About</h3></div>
          <div className="dm-about">
            {p.email && <div className="dm-about-row"><DSDM.IconifyIcon name="lucide:mail" size={19} color="var(--brand-navy)" /><span>{p.email}</span></div>}
            {p.clinic && <div className="dm-about-row"><DSDM.IconifyIcon name="lucide:building-2" size={19} color="var(--brand-navy)" /><span>{p.clinic}</span></div>}
            {p.website && <div className="dm-about-row"><DSDM.IconifyIcon name="lucide:globe" size={19} color="var(--brand-navy)" /><span>{p.website}</span></div>}
            {p.instagram && <div className="dm-about-row"><DSDM.IconifyIcon name="mdi:instagram" size={19} color="var(--brand-navy)" /><span>{p.instagram}</span></div>}
          </div>
        </section>
        {p.media && p.media.length > 0 &&
          <section className="dm-psec">
            <div className="dm-psec-h"><h3>Shared media</h3><span className="dm-psec-n">{p.media.length}</span></div>
            <div className="dm-media">{p.media.map((src, i) => <img key={i} src={src} alt="" />)}</div>
          </section>}
        <div style={{ height: 32 }} />
      </div>
    </div>);
}

/* ---------------------------------------------------------------------------
   People tab — everyone you follow, Online / Offline
   --------------------------------------------------------------------------- */
function PeopleViewDM({ people, onOpenThreadWith, onScroll }) {
  const [q, setQ] = useStateDM("");
  const list = people.filter((p) => !p.request && p.name.toLowerCase().includes(q.toLowerCase()));
  const online = list.filter((p) => p.online).sort((a, b) => a.name.localeCompare(b.name));
  const offline = list.filter((p) => !p.online).sort((a, b) => (a.lastActive || 0) - (b.lastActive || 0));
  const Row = ({ p }) =>
    <button type="button" className="dm-person" onClick={() => onOpenThreadWith(p.id)} aria-label={"Message " + p.name + ", " + presenceDM(p)}>
      <span className="dm-facewrap" style={{ width: 48, height: 48 }}>
        <DMFace name={p.name} src={p.avatar} size={48} />
        {p.online && <span className="dm-online" />}
      </span>
      <span className="dm-person-main">
        <span className="dm-person-name">{p.name}</span>
        <span className={"dm-person-presence" + (p.online ? " on" : "")}>{presenceDM(p)}</span>
      </span>
      <DSDM.IconifyIcon name="lucide:message-circle" size={20} color="var(--gray-400)" />
    </button>;
  return (
    <div className="dm-view" data-screen-label="Messages · People">
      <header className="dm-head dm-head-plain"><h1 className="dm-title">People</h1><span className="dm-head-sub">{people.filter((p) => !p.request).length} you follow</span></header>
      <div className="dm-scroll" onScroll={onScroll}>
        <SearchDM value={q} onChange={setQ} placeholder="Search people" />
        <div className="dm-sec-h"><span className="dm-sec-dot on" />Online<span className="dm-sec-n">{online.length}</span></div>
        <div className="dm-list">{online.map((p) => <Row key={p.id} p={p} />)}{online.length === 0 && <p className="dm-note">No one online right now.</p>}</div>
        <div className="dm-sec-h"><span className="dm-sec-dot" />Offline<span className="dm-sec-n">{offline.length}</span></div>
        <div className="dm-list">{offline.map((p) => <Row key={p.id} p={p} />)}</div>
        <div style={{ height: 16 }} />
      </div>
    </div>);
}

/* ---------------------------------------------------------------------------
   Conference tab — live rooms + scheduled
   --------------------------------------------------------------------------- */
function ConferenceViewDM({ onScroll, toast }) {
  const people = usePeopleDM();
  const [open, setOpen] = useStateDM(null);
  const [joined, setJoined] = useStateDM(null);
  const [reminders, setReminders] = useStateDM({});
  const live = CONFERENCES_DM.filter((c) => c.live);
  const upcoming = CONFERENCES_DM.filter((c) => !c.live);
  const Card = ({ conf }) => {
    const parts = conf.participantIds.map(people.get).filter(Boolean);
    const host = people.get(conf.hostId);
    return (
      <div className={"dm-conf" + (conf.live ? " live" : "")}>
        <button type="button" className="dm-conf-main" onClick={() => setOpen(conf)} aria-label={conf.name + ", " + conf.when}>
          <span className="dm-conf-top">
            <span className="dm-conf-name">{conf.name}</span>
            {conf.live ? <span className="dm-live"><i />LIVE</span> : <span className="dm-conf-when">{conf.when}</span>}
          </span>
          <span className="dm-conf-topic">{conf.topic}</span>
          <span className="dm-conf-people">
            <span className="dm-faces">{parts.slice(0, 4).map((p) => <DMFace key={p.id} name={p.name} src={p.avatar} size={28} />)}</span>
            <span className="dm-conf-host">Hosted by {host ? host.name : ""}{conf.live && conf.listening ? " · " + conf.listening + " listening" : ""}</span>
          </span>
        </button>
        {conf.live ?
          <button type="button" className={"dm-btn " + (joined === conf.id ? "dm-btn-ghost" : "dm-btn-navy")} onClick={() => { setJoined(joined === conf.id ? null : conf.id); toast(joined === conf.id ? "Left the room" : "Joined " + conf.name); }}>
            {joined === conf.id ? "Leave" : "Join"}
          </button> :
          <button type="button" className={"dm-btn dm-btn-ghost" + (reminders[conf.id] ? " on" : "")} aria-pressed={!!reminders[conf.id]}
            onClick={() => { setReminders((r) => ({ ...r, [conf.id]: !r[conf.id] })); toast(reminders[conf.id] ? "Reminder removed" : "We'll remind you"); }}>
            <DSDM.IconifyIcon name={reminders[conf.id] ? "lucide:bell-ring" : "lucide:bell"} size={17} color="var(--brand-navy)" />{reminders[conf.id] ? "Reminding" : "Remind me"}
          </button>}
      </div>);
  };
  return (
    <div className="dm-view" data-screen-label="Messages · Conference">
      <header className="dm-head dm-head-plain"><h1 className="dm-title">Conference</h1><span className="dm-head-sub">Voice rooms with people you follow</span></header>
      <div className="dm-scroll" onScroll={onScroll}>
        <div className="dm-sec-h">Live now<span className="dm-sec-n">{live.length}</span></div>
        <div className="dm-conflist">{live.map((c) => <Card key={c.id} conf={c} />)}</div>
        <div className="dm-sec-h">Scheduled<span className="dm-sec-n">{upcoming.length}</span></div>
        <div className="dm-conflist">{upcoming.map((c) => <Card key={c.id} conf={c} />)}</div>
        <div className="dm-pad">
          <DSDM.Button variant="brand" fullWidth iconLeading={<DSDM.IconifyIcon name="lucide:mic" size={18} color="#fff" />} onClick={() => toast("Conference rooms open to Mastery members")}>Start a conference</DSDM.Button>
        </div>
        <div style={{ height: 16 }} />
      </div>
      <SheetDM open={!!open} onClose={() => setOpen(null)} label={open ? open.name : "Conference"}>
        {open &&
          <>
            <div className="dm-sheet-head">
              <span className="dm-sheet-ic"><DSDM.IconifyIcon name="lucide:radio" size={22} color="var(--brand-navy)" /></span>
              <span className="dm-sheet-head-main"><b>{open.name}</b><span>{open.when} · {open.topic}</span></span>
            </div>
            <div className="dm-members" role="list">
              {open.participantIds.map(people.get).filter(Boolean).map((p) =>
                <div key={p.id} className="dm-member" role="listitem">
                  <DMFace name={p.name} src={p.avatar} size={40} />
                  <span className="dm-member-main"><span className="dm-member-name">{p.name}</span><span className="dm-member-sub">{p.role}</span></span>
                  <span className={"dm-role" + (p.id === open.hostId ? " admin" : "")}>{p.id === open.hostId ? "Host" : "Speaker"}</span>
                </div>)}
            </div>
            <button type="button" className={"dm-btn dm-btn-grow " + (joined === open.id ? "dm-btn-ghost" : "dm-btn-navy")} style={{ marginTop: 12 }}
              onClick={() => { if (open.live) { setJoined(joined === open.id ? null : open.id); toast(joined === open.id ? "Left the room" : "Joined " + open.name); } else { setReminders((r) => ({ ...r, [open.id]: true })); toast("We'll remind you"); } setOpen(null); }}>
              {open.live ? (joined === open.id ? "Leave room" : "Join room") : "Remind me"}
            </button>
          </>}
      </SheetDM>
    </div>);
}

/* ---------------------------------------------------------------------------
   Menu tab — inbox hub
   --------------------------------------------------------------------------- */
function MenuViewDM({ counts, onNav, onScroll, onTestPush }) {
  const rows = [
    { key: "requests", label: "Message requests", icon: "lucide:mail-plus", n: counts.requests, hi: counts.requests > 0 },
    { key: "archived", label: "Archived chats", icon: "lucide:archive", n: counts.archived },
    { key: "deleted", label: "Deleted chats", icon: "lucide:trash-2", n: counts.deleted },
    { key: "groups", label: "Group chats", icon: "lucide:users", n: counts.groups }];
  const clickChrome = (sel) => { const b = document.querySelector(".dm-screen " + sel); if (b) b.click(); };
  return (
    <div className="dm-view" data-screen-label="Messages · Menu">
      <header className="dm-head dm-head-plain"><h1 className="dm-title">Menu</h1></header>
      <div className="dm-scroll" onScroll={onScroll}>
        <button type="button" className="dm-me" onClick={() => goDM("ProfileMobile.html")}>
          <span className="dm-facewrap" style={{ width: 56, height: 56 }}><DMFace name={ME_DM.name} src={ME_DM.avatar} size={56} /><span className="dm-online" /></span>
          <span className="dm-me-main">
            <span className="dm-me-name">{ME_DM.name}<DSDM.IconifyIcon name="lucide:badge-check" size={18} color="var(--reaction-like, #1D9BF0)" /></span>
            <span className="dm-me-role">{ME_DM.role}</span>
          </span>
          <DSDM.IconifyIcon name="lucide:chevron-right" size={22} color="var(--gray-450)" />
        </button>
        <div className="dm-sec-h">Inbox</div>
        <div className="dm-menu">
          {rows.map((r) =>
            <button key={r.key} type="button" className="dm-menu-row" onClick={() => onNav(r.key)}>
              <span className="dm-menu-ic"><DSDM.IconifyIcon name={r.icon} size={21} color="var(--brand-navy)" /></span>
              <span className="dm-menu-label">{r.label}</span>
              {r.n > 0 && <span className={"dm-menu-n" + (r.hi ? " hi" : "")}>{r.n}</span>}
              <DSDM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
            </button>)}
        </div>
        <div className="dm-sec-h">More</div>
        <div className="dm-menu">
          <button type="button" className="dm-menu-row" onClick={() => clickChrome(".m-iconbtn[aria-label='Notifications']")}>
            <span className="dm-menu-ic"><DSDM.IconifyIcon name="lucide:bell" size={21} color="var(--brand-navy)" /></span>
            <span className="dm-menu-label">Notifications</span>
            <DSDM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
          </button>
          <button type="button" className="dm-menu-row" onClick={() => goDM("NotificationSettings.html")}>
            <span className="dm-menu-ic"><DSDM.IconifyIcon name="lucide:settings-2" size={21} color="var(--brand-navy)" /></span>
            <span className="dm-menu-label">Message settings</span>
            <DSDM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
          </button>
          <button type="button" className="dm-menu-row" onClick={() => clickChrome(".m-burger")}>
            <span className="dm-menu-ic"><DSDM.IconifyIcon name="lucide:menu" size={21} color="var(--brand-navy)" /></span>
            <span className="dm-menu-label">Main menu</span>
            <DSDM.IconifyIcon name="lucide:chevron-right" size={20} color="var(--gray-400)" />
          </button>
        </div>
        <div className="dm-sec-h">Testing</div>
        <div className="dm-menu">
          <button type="button" className="dm-menu-row" onClick={onTestPush}>
            <span className="dm-menu-ic"><DSDM.IconifyIcon name="lucide:bell-ring" size={21} color="var(--brand-navy)" /></span>
            <span className="dm-menu-label">Preview a notification</span>
            <span className="dm-menu-n">sample</span>
          </button>
        </div>
        <div style={{ height: 16 }} />
      </div>
    </div>);
}

/* ---------------------------------------------------------------------------
   Sample push banner (Messages page only, for testing) — an incoming message
   slides in under the Dynamic Island; tap opens the thread, auto-dismisses.
   --------------------------------------------------------------------------- */
const PUSH_SAMPLES_DM = [
  { convId: "sarahc", from: "sarahc", text: "Katy, are the follow-up photos from your lip case ready for Thursday? 📸" },
  { convId: "g-casereview", from: "tim", text: "Reminder — case review starts in 15 minutes. Bring your before/afters!" },
  { convId: "miranda", from: "miranda", text: "Your Technique Tuesday seat is confirmed. See you there!" }];

function PushBannerDM({ push, onOpen, onClose }) {
  const people = usePeopleDM();
  const [leaving, setLeaving] = useStateDM(false);
  useEffectDM(() => {
    setLeaving(false);
    const t1 = window.setTimeout(() => setLeaving(true), 6400);
    const t2 = window.setTimeout(onClose, 6800);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [push.id]);
  const sender = people.get(push.from);
  return (
    <div className={"dm-push" + (leaving ? " leaving" : "")} role="status" aria-live="polite">
      <button type="button" className="dm-push-main" onClick={onOpen} aria-label={"Open message from " + (sender ? sender.name : "") }>
        <span className="dm-push-av"><DMFace name={sender ? sender.name : "?"} src={sender && sender.avatar} size={44} /></span>
        <span className="dm-push-body">
          <span className="dm-push-top">
            <span className="dm-push-app"><DSDM.IconifyIcon name="lucide:message-circle" size={12} color="#fff" />Messages</span>
            <span className="dm-push-time">now</span>
          </span>
          <span className="dm-push-name">{sender ? sender.name : ""}{push.convName ? <span className="dm-push-ctx"> · {push.convName}</span> : null}</span>
          <span className="dm-push-text">{push.text}</span>
        </span>
      </button>
      <button type="button" className="dm-push-close" aria-label="Dismiss notification" onClick={onClose}>
        <DSDM.IconifyIcon name="lucide:x" size={16} color="var(--gray-600)" />
      </button>
    </div>);
}

/* ---------------------------------------------------------------------------
   Dock — Home · Chats · Conference · People · Menu
   --------------------------------------------------------------------------- */
const DOCK_TABS_DM = [
  { key: "home", label: "Home", icon: "lucide:house" },
  { key: "chats", label: "Chats", icon: "lucide:message-circle" },
  { key: "conference", label: "Conference", icon: "lucide:audio-lines" },
  { key: "people", label: "People", icon: "lucide:users" },
  { key: "menu", label: "Menu", icon: "lucide:menu" }];

function DockDM({ tab, compact, unread, onTab }) {
  const item = (t, i) => {
    const on = t.key === tab;
    return (
      <button key={t.key} type="button" className={"dm-dock-tab" + (on ? " on" : "")} style={{ "--i": i }} aria-current={on ? "page" : undefined}
        onClick={() => t.key === "home" ? goDM("NewsfeedMobile.html") : onTab(t.key)}>
        <span className="ic">
          <DSDM.IconifyIcon name={t.icon} size={24} color={on ? "#fff" : "var(--gray-900)"} />
          {t.key === "chats" && unread > 0 && !on && <span className="dot">{unread}</span>}
        </span>
        <span className="lbl">{t.label}</span>
      </button>);
  };
  /* Home sits in its own glass pill; the four Messages tabs share a second
     pill so they read as one group — same footer on every Messages view. */
  return (
    <nav className={"dm-dock" + (compact ? " compact" : "")} aria-label="Messages navigation">
      <div className="dm-dock-seg dm-dock-seg-home">{item(DOCK_TABS_DM[0], 0)}</div>
      <div className="dm-dock-seg dm-dock-seg-main">{DOCK_TABS_DM.slice(1).map((t, i) => item(t, i + 1))}</div>
    </nav>);
}

/* ---------------------------------------------------------------------------
   App
   --------------------------------------------------------------------------- */
function MessagesAppDM() {
  const [store, setStore] = useStateDM(loadStoreDM);
  const [tab, setTab] = useStateDM(() => ["chats", "conference", "people", "menu"].includes(paramDM("tab")) ? paramDM("tab") : "chats");
  const [route, setRoute] = useStateDM(() => {
    const t = paramDM("t");
    if (t) {
      const s = loadStoreDM();
      if (s.conversations.some((c) => c.id === t)) return { name: "thread", id: t, from: "chats" };
    }
    return { name: "list" };
  });
  const [rowActions, setRowActions] = useStateDM(null);
  const [threadSearch, setThreadSearch] = useStateDM(false); // "Search in conversation" from the options sheet
  const [addMembersFor, setAddMembersFor] = useStateDM(null);
  const [confirm, setConfirm] = useStateDM(null);
  const [toastState, setToastState] = useStateDM(null);
  const toastTimer = useRefDM(null);
  const [compact, onScroll] = useScrollDockDM(tab + ":" + route.name);
  const [push, setPush] = useStateDM(null);
  useEffectDM(() => { if (route.name !== "thread") setThreadSearch(false); }, [route.name, route.id]);
  const pushSeq = useRefDM(0);

  useEffectDM(() => saveStoreDM(store), [store]);
  useEffectDM(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  /* keep the URL's ?t= in step so refresh / share lands on the same thread */
  useEffectDM(() => {
    try {
      const url = new URL(window.location.href);
      if (route.name === "thread" || route.name === "profile") url.searchParams.set("t", route.id); else url.searchParams.delete("t");
      if (tab !== "chats") url.searchParams.set("tab", tab); else url.searchParams.delete("tab");
      window.history.replaceState(null, "", url.pathname + (url.search || ""));
    } catch (e) {}
  }, [route, tab]);

  /* roster: seed + externally-added people, deduped by id (a later override —
     e.g. an accepted request — replaces the seeded entry in place) */
  const allPeople = useMemoDM(() => {
    const map = new Map();
    PEOPLE_SEED_DM.concat(store.people).forEach((p) => map.set(p.id, map.has(p.id) ? { ...map.get(p.id), ...p } : p));
    return Array.from(map.values());
  }, [store.people]);
  const peopleCtx = useMemoDM(() => {
    const map = {}; allPeople.forEach((p) => { map[p.id] = p; }); map.me = ME_DM;
    return { get: (id) => map[id] || null, all: allPeople };
  }, [allPeople]);

  const toast = useCallbackDM((text) => {
    setToastState({ text, id: Date.now() });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastState(null), 1900);
  }, []);

  const convs = store.conversations;
  const active = convs.filter((c) => !c.archived);
  const archived = convs.filter((c) => c.archived);
  const unreadTotal = active.reduce((n, c) => n + (c.unread || 0), 0);
  const current = route.id ? convs.find((c) => c.id === route.id) : null;

  /* ---- sample push (testing) — adds a real incoming message, then banners it ---- */
  const firePush = useCallbackDM(() => {
    const sample = PUSH_SAMPLES_DM[pushSeq.current % PUSH_SAMPLES_DM.length];
    pushSeq.current += 1;
    const msg = { id: midDM(), from: sample.from, text: sample.text, ts: Date.now(), reactions: {} };
    const inThread = route.name === "thread" && route.id === sample.convId;
    setStore((s) => s.conversations.some((c) => c.id === sample.convId) ?
      { ...s, conversations: s.conversations.map((c) => c.id !== sample.convId ? c : {
        ...c, archived: false, unread: inThread ? 0 : (c.unread || 0) + 1, messages: c.messages.concat([msg]) }) } :
      /* no thread with this person yet — the incoming message starts one */
      { ...s, conversations: [{ id: sample.convId, kind: "dm", personId: sample.from, unread: 1, messages: [msg] }].concat(s.conversations) });
    if (inThread) return;
    const conv = store.conversations.find((c) => c.id === sample.convId);
    setPush({ id: Date.now(), convId: sample.convId, from: sample.from, text: sample.text, convName: conv && conv.kind === "group" ? conv.name : null });
  }, [route, store.conversations]);
  useEffectDM(() => {
    if (paramDM("nopush") !== null) return;
    const t = window.setTimeout(() => firePush(), 6000);
    return () => window.clearTimeout(t);
  }, []);

  /* ---- mutations ---- */
  const updateConv = (id, fn) => setStore((s) => ({ ...s, conversations: s.conversations.map((c) => c.id === id ? fn(c) : c) }));
  const openThread = (c, from) => {
    updateConv(c.id, (x) => ({ ...x, unread: 0 }));
    setRoute({ name: "thread", id: c.id, from: from || route.name });
  };
  const openThreadWith = (personId) => {
    const existing = convs.find((c) => c.kind === "dm" && c.personId === personId);
    if (existing) { if (existing.archived) updateConv(existing.id, (x) => ({ ...x, archived: false })); openThread(existing, "list"); return; }
    const c = { id: personId, kind: "dm", personId, unread: 0, messages: [] };
    setStore((s) => ({ ...s, conversations: [c].concat(s.conversations) }));
    setRoute({ name: "thread", id: c.id, from: "list" });
  };
  const sendMessage = (id, m) => updateConv(id, (c) => ({ ...c, messages: c.messages.concat([{ id: midDM(), from: m.from, text: m.text || "", image: m.image || null, sticker: m.sticker || null, gif: m.gif || null, ts: Date.now(), reactions: {} }]) }));
  const reactMessage = (id, mid, emoji) => updateConv(id, (c) => ({
    ...c, messages: c.messages.map((m) => {
      if (m.id !== mid) return m;
      const r = { ...(m.reactions || {}) };
      const list = (r[emoji] || []).slice();
      const i = list.indexOf("me");
      if (i >= 0) list.splice(i, 1); else list.push("me");
      if (list.length) r[emoji] = list; else delete r[emoji];
      return { ...m, reactions: r };
    })
  }));
  const editMessage = (id, mid, text) => updateConv(id, (c) => ({ ...c, messages: c.messages.map((m) => m.id === mid ? { ...m, text, edited: true } : m) }));
  const deleteMessage = (id, mid) => updateConv(id, (c) => ({ ...c, messages: c.messages.map((m) => m.id === mid ? { ...m, deleted: true, reactions: {} } : m) }));

  const togglePin = (c) => { updateConv(c.id, (x) => ({ ...x, pinned: !x.pinned })); toast(c.pinned ? "Unpinned" : "Pinned to top"); };
  const toggleArchive = (c) => { updateConv(c.id, (x) => ({ ...x, archived: !x.archived, pinned: false })); toast(c.archived ? "Moved back to chats" : "Chat archived"); };
  const toggleMute = (c) => { updateConv(c.id, (x) => ({ ...x, muted: !x.muted })); toast(c.muted ? "Notifications on" : "Muted"); };
  const deleteConv = (c) => {
    setStore((s) => ({ ...s, conversations: s.conversations.filter((x) => x.id !== c.id), deleted: [{ ...c, archived: false, pinned: false }].concat(s.deleted) }));
    if (route.id === c.id) setRoute({ name: "list" });
    toast("Chat deleted");
  };
  const leaveGroup = (c) => {
    setStore((s) => ({ ...s, conversations: s.conversations.filter((x) => x.id !== c.id) }));
    if (route.id === c.id) setRoute({ name: "list" });
    toast("You left " + c.name);
  };
  const restoreConv = (c) => { setStore((s) => ({ ...s, deleted: s.deleted.filter((x) => x.id !== c.id), conversations: [c].concat(s.conversations) })); toast("Chat restored"); };
  const acceptRequest = (r) => {
    const c = { id: r.personId, kind: "dm", personId: r.personId, unread: 0, messages: [{ id: midDM(), from: r.personId, text: r.text, ts: r.ts, reactions: {} }] };
    setStore((s) => ({ ...s, requests: s.requests.filter((x) => x.id !== r.id), conversations: [c].concat(s.conversations.filter((x) => x.id !== c.id)),
      people: s.people.map((p) => p.id === r.personId ? { ...p, request: false } : p) }));
    /* seeded request senders live in PEOPLE_SEED_DM — mark them followed via an override */
    if (PEOPLE_SEED_DM.some((p) => p.id === r.personId)) setStore((s) => ({ ...s, people: s.people.some((p) => p.id === r.personId) ? s.people : s.people.concat([{ ...PEOPLE_SEED_DM.find((p) => p.id === r.personId), request: false }]) }));
    setRoute({ name: "thread", id: c.id, from: "requests" });
    toast("Request accepted");
  };
  const declineRequest = (r) => { setStore((s) => ({ ...s, requests: s.requests.filter((x) => x.id !== r.id) })); toast("Request declined"); };
  const createConversation = (ids, groupName) => {
    if (ids.length === 1) { openThreadWith(ids[0]); return; }
    const names = ids.map((id) => stripHonorificDM((peopleCtx.get(id) || {}).name || "").split(" ")[0]);
    const name = (groupName || "").trim() || (names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", "));
    const c = { id: "g-" + Date.now().toString(36), kind: "group", name, memberIds: ids, roles: { me: "Admin" }, unread: 0, messages: [] };
    setStore((s) => ({ ...s, conversations: [c].concat(s.conversations) }));
    setRoute({ name: "thread", id: c.id, from: "list" });
    toast("Group created");
  };
  const addMembers = (c, ids) => {
    if (!ids.length) return;
    if (c.kind === "group") {
      updateConv(c.id, (x) => ({ ...x, memberIds: x.memberIds.concat(ids.filter((id) => !x.memberIds.includes(id))) }));
      toast(ids.length + (ids.length === 1 ? " member added" : " members added"));
    } else {
      const memberIds = [c.personId].concat(ids.filter((id) => id !== c.personId));
      const names = memberIds.map((id) => stripHonorificDM((peopleCtx.get(id) || {}).name || "").split(" ")[0]);
      const g = { id: "g-" + Date.now().toString(36), kind: "group", name: names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", "), memberIds, roles: { me: "Admin" }, unread: 0, messages: [] };
      setStore((s) => ({ ...s, conversations: [g].concat(s.conversations) }));
      setRoute({ name: "thread", id: g.id, from: "list" });
      toast("Group created");
    }
    setAddMembersFor(null);
  };

  /* ---- navigation ---- */
  const goTab = (t) => { setTab(t); setRoute({ name: "list" }); };
  const back = () => {
    if (route.name === "profile") { setRoute({ name: "thread", id: route.id, from: route.from }); return; }
    if (route.name === "thread") {
      const from = route.from;
      if (from === "archived" || from === "groups" || from === "requests" || from === "deleted") { setRoute({ name: from }); return; }
      if (from === "people") { setTab("people"); setRoute({ name: "list" }); return; }
      setTab("chats"); setRoute({ name: "list" }); return;
    }
    if (["archived", "requests", "deleted", "groups"].includes(route.name)) { setRoute({ name: "list" }); return; }
    setRoute({ name: "list" });
  };

  const showDock = route.name !== "thread" && route.name !== "profile" && route.name !== "compose";
  const counts = { requests: store.requests.length, archived: archived.length, deleted: store.deleted.length, groups: active.filter((c) => c.kind === "group").length };

  let view = null;
  if (route.name === "thread" && current) {
    view = <ThreadViewDM key={current.id} c={current} onBack={back} onProfile={() => setRoute({ name: "profile", id: current.id, from: route.from })}
      onSend={sendMessage} onReact={reactMessage} onEdit={editMessage} onDelete={deleteMessage}
      onMenu={() => setRowActions(current)} toast={toast} searchOpen={threadSearch} onCloseSearch={() => setThreadSearch(false)} />;
  } else if (route.name === "profile" && current) {
    view = <ProfileViewDM c={current} onBack={back} onToggleMute={() => toggleMute(current)} onAddMembers={() => setAddMembersFor(current)}
      onLeave={() => setConfirm({ kind: "leave", c: current })} onOpenThreadWith={(id) => openThreadWith(id)} toast={toast} />;
  } else if (route.name === "compose") {
    view = <ComposeViewDM people={allPeople} onBack={() => setRoute({ name: "list" })} onCreate={createConversation} />;
  } else if (route.name === "archived") {
    view = <ListViewDM title="Archived chats" sub={archived.length ? archived.length + " archived" : null} onBack={back} convs={archived} onScroll={onScroll}
      onOpen={(c) => openThread(c, "archived")} onActions={setRowActions} emptyIcon="lucide:archive" emptyTitle="No archived chats" emptyBody="Hold a conversation and choose Archive to tuck it away here." />;
  } else if (route.name === "groups") {
    view = <ListViewDM title="Group chats" sub={counts.groups + " groups"} onBack={back} convs={active.filter((c) => c.kind === "group")} onScroll={onScroll}
      onOpen={(c) => openThread(c, "groups")} onActions={setRowActions} emptyIcon="lucide:users" emptyTitle="No group chats" emptyBody="Pick two or more people from the compose button to start one." />;
  } else if (route.name === "requests") {
    view = <RequestsViewDM requests={store.requests} onBack={back} onAccept={acceptRequest} onDecline={declineRequest} onScroll={onScroll} />;
  } else if (route.name === "deleted") {
    view = <DeletedViewDM deleted={store.deleted} onBack={back} onRestore={restoreConv} onScroll={onScroll} />;
  } else if (tab === "people") {
    view = <PeopleViewDM people={allPeople} onOpenThreadWith={(id) => { openThreadWith(id); setRoute((r) => ({ ...r, from: "people" })); }} onScroll={onScroll} />;
  } else if (tab === "conference") {
    view = <ConferenceViewDM onScroll={onScroll} toast={toast} />;
  } else if (tab === "menu") {
    view = <MenuViewDM counts={counts} onNav={(k) => setRoute({ name: k })} onScroll={onScroll} onTestPush={() => { setTab("chats"); setRoute({ name: "list" }); window.setTimeout(firePush, 350); }} />;
  } else {
    view = <ChatsViewDM convs={active} archivedCount={archived.length} requestsCount={store.requests.length}
      onOpen={(c) => openThread(c, "list")} onOpenPerson={(id) => openThreadWith(id)} onActions={setRowActions} onCompose={() => setRoute({ name: "compose" })}
      onArchived={() => setRoute({ name: "archived" })} onRequests={() => setRoute({ name: "requests" })} onScroll={onScroll} />;
  }

  const ra = rowActions ? convs.find((c) => c.id === rowActions.id) : null;
  const addFor = addMembersFor ? convs.find((c) => c.id === addMembersFor.id) : null;

  return (
    <PeopleCtxDM.Provider value={peopleCtx}>
      <div className={"dm-screen" + (showDock ? " has-dock" : "")} data-screen-label="Messages (mobile)">
        {MobileChromeDM && <MobileChromeDM />}
        <div className="dm-main">{view}</div>
        {showDock && <DockDM tab={tab} compact={compact} unread={unreadTotal} onTab={goTab} />}

        {/* conversation long-press actions */}
        <SheetDM open={!!ra} onClose={() => setRowActions(null)} label={route.name === "thread" ? "Conversation settings" : "Conversation options"}>
          {ra &&
            <>
              <div className="dm-sheet-head">
                <ConvAvatarDM c={ra} size={44} dot={false} />
                <span className="dm-sheet-head-main"><b>{convNameDM(ra, peopleCtx)}</b><span>{ra.kind === "group" ? (ra.memberIds.length + 1) + " members" : presenceDM(peopleCtx.get(ra.personId))}</span></span>
              </div>
              {route.name === "thread" &&
                <SheetActionDM icon={ra.kind === "group" ? "lucide:users" : "lucide:user"} label={ra.kind === "group" ? "View members" : "View profile"}
                  onClick={() => { setRowActions(null); setRoute({ name: "profile", id: ra.id, from: route.from }); }} />}
              <SheetActionDM icon="lucide:search" label="Search in conversation" disabled={!ra.messages.some((m) => !m.deleted && m.text)}
                sub={ra.messages.some((m) => !m.deleted && m.text) ? "Find a message by keyword" : "Nothing to search yet"}
                onClick={() => {
                  setRowActions(null);
                  if (route.name !== "thread") openThread(ra, ["archived", "groups"].includes(route.name) ? route.name : "list");
                  setThreadSearch(true);
                }} />
              <SheetActionDM icon={ra.pinned ? "lucide:pin-off" : "lucide:pin"} label={ra.pinned ? "Unpin" : "Pin"} onClick={() => { togglePin(ra); setRowActions(null); }} />
              <SheetActionDM icon={ra.archived ? "lucide:archive-restore" : "lucide:archive"} label={ra.archived ? "Unarchive" : "Archive"} onClick={() => { toggleArchive(ra); setRowActions(null); }} />
              <SheetActionDM icon="lucide:user-plus" label="Add members" sub={ra.kind === "dm" ? "Starts a group with " + stripHonorificDM(convNameDM(ra, peopleCtx)).split(" ")[0] : null} onClick={() => { setRowActions(null); setAddMembersFor(ra); }} />
              <SheetActionDM icon={ra.muted ? "lucide:bell" : "lucide:bell-off"} label={ra.muted ? "Unmute" : "Mute"} onClick={() => { toggleMute(ra); setRowActions(null); }} />
              {ra.kind === "group" && <SheetActionDM icon="lucide:log-out" label="Leave group" danger onClick={() => { setRowActions(null); setConfirm({ kind: "leave", c: ra }); }} />}
              <SheetActionDM icon="lucide:trash-2" label="Delete" danger onClick={() => { setRowActions(null); setConfirm({ kind: "delete", c: ra }); }} />
              <button type="button" className="dm-sheet-cancel" onClick={() => setRowActions(null)}>Cancel</button>
            </>}
        </SheetDM>

        {/* add members */}
        <AddMembersSheetDM c={addFor} people={allPeople} onClose={() => setAddMembersFor(null)} onAdd={(ids) => addMembers(addFor, ids)} />

        {/* confirm leave / delete */}
        <SheetDM open={!!confirm} onClose={() => setConfirm(null)} label={confirm && confirm.kind === "leave" ? "Leave group" : "Delete chat"} className="dm-sheet-confirm">
          {confirm &&
            <>
              <h3 className="dm-sheet-title">{confirm.kind === "leave" ? "Leave " + confirm.c.name + "?" : "Delete this chat?"}</h3>
              <p className="dm-sheet-body">{confirm.kind === "leave" ? "You'll stop receiving messages from this group. An admin can add you back later." : "It moves to Deleted chats, where you can restore it for 30 days."}</p>
              <div className="dm-sheet-btns">
                <button type="button" className="dm-btn dm-btn-ghost dm-btn-grow" onClick={() => setConfirm(null)}>Cancel</button>
                <button type="button" className="dm-btn dm-btn-danger dm-btn-grow" onClick={() => { if (confirm.kind === "leave") leaveGroup(confirm.c); else deleteConv(confirm.c); setConfirm(null); }}>
                  {confirm.kind === "leave" ? "Leave group" : "Delete"}
                </button>
              </div>
            </>}
        </SheetDM>

        <ToastDM toast={toastState} />
        {push && <PushBannerDM key={push.id} push={push} onClose={() => setPush(null)}
          onOpen={() => { const c = store.conversations.find((x) => x.id === push.convId); setPush(null); setTab("chats"); if (c) openThread(c, "list"); else openThreadWith(push.from); }} />}
      </div>
    </PeopleCtxDM.Provider>);
}

function AddMembersSheetDM({ c, people, onClose, onAdd }) {
  const [picked, setPicked] = useStateDM([]);
  const [q, setQ] = useStateDM("");
  useEffectDM(() => { setPicked([]); setQ(""); }, [c && c.id]);
  if (!c) return <SheetDM open={false} onClose={onClose} />;
  const existing = c.kind === "group" ? c.memberIds : [c.personId];
  const list = people.filter((p) => !p.request && !existing.includes(p.id) && p.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id) => setPicked((all) => all.includes(id) ? all.filter((x) => x !== id) : all.concat([id]));
  return (
    <SheetDM open={!!c} onClose={onClose} label="Add members" title="Add members" className="dm-sheet-tall">
      <SearchDM value={q} onChange={setQ} placeholder="Search people" />
      <div className="dm-sheet-list">
        {list.map((p) => <PersonTickRowDM key={p.id} p={p} on={picked.includes(p.id)} onToggle={toggle} />)}
        {list.length === 0 && <div className="dm-empty"><b>Everyone you follow is already here</b></div>}
      </div>
      <div className="dm-sheet-btns">
        <button type="button" className="dm-btn dm-btn-ghost dm-btn-grow" onClick={onClose}>Cancel</button>
        <button type="button" className="dm-btn dm-btn-navy dm-btn-grow" disabled={!picked.length} onClick={() => onAdd(picked)}>Add{picked.length ? " (" + picked.length + ")" : ""}</button>
      </div>
    </SheetDM>);
}

function MessagesPageDM() {
  const mobile = useIsMobileDM();
  const scale = useDeviceScaleDM();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app dm-app" style={vars}><MessagesAppDM /></div>;
  return (
    <div className="app device-stage dm-app" style={vars}>
      <div style={{ transform: "scale(" + scale + ")", transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><MessagesAppDM /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<MessagesPageDM />);
