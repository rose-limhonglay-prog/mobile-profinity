/* ===========================================================================
   PROfinity — Direct Message thread · iPhone 17 Pro Max mobile
   Full-page 1-on-1 conversation, opened from a Messages panel row on any
   mobile screen (?id=<contact id>&from=<page to return to>).
   Suffixed -DM to avoid global-scope clashes.
   =========================================================================== */
const { useState: useStateDM, useEffect: useEffectDM, useRef: useRefDM } = React;
const DSDM = window.ProfinityDesignSystem_c2b5cc;

function goDM(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }

function useDeviceScaleDM() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateDM(calc);
  useEffectDM(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}

function useIsMobileDM() {
  const [mobile, setMobile] = useStateDM(() => window.matchMedia('(max-width:768px)').matches);
  useEffectDM(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}

const DM_THREADS_SEED_DM = [
  { id: "tim", name: "Dr Tim Pearce", avatar: "assets/avatar-drtim.png", online: true,
    role: "Aesthetic Physician", seals: ["gb", "gold", "verified", "crown"],
    email: "tim.pearce@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@drtimpearce",
    media: ["assets/post1-img1.png", "assets/post1-img2.png", "assets/post1-img3.png", "assets/post1-img4.png"],
    files: [
      { name: "Revenue Analysis.pdf", size: "2.4 MB" },
      { name: "Expense Report.pdf", size: "1.2 MB" },
      { name: "Market Research.pdf", size: "3.1 MB" }],
    messages: [
      { me: false, text: "Hey Katy! I saw your post about the full-face rejuvenation case.", t: "10:12 AM" },
      { me: true, text: "Thank you! It was a great result, patient was thrilled.", t: "10:20 AM" },
      { me: false, text: "Do you mind if I share it with my team as a reference?", t: "10:25 AM" },
      { me: true, text: "Of course, go ahead — sharing the write-up now.", t: "10:28 AM" },
      { me: false, text: "Thanks for sharing the case study. Really helpful!", t: "10:30 AM" }] },
  { id: "sarah", name: "Dr Sarah Kim", avatar: null, online: true,
    role: "Clinical Nurse Specialist", seals: ["gb", "verified"],
    email: "sarah.kim@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@sarah_kim_aesthetics",
    media: ["assets/post2-img1.png", "assets/post2-img2.png", "assets/post2-img3.png"],
    files: [
      { name: "Protocol Updates Q3.pdf", size: "1.8 MB" },
      { name: "Patient Consent Form.pdf", size: "0.4 MB" }],
    messages: [
      { me: false, text: "Are you free to go over the Q3 protocol updates this week?", t: "9:40 AM" },
      { me: true, text: "Yes, Thursday afternoon works for me.", t: "9:52 AM" },
      { me: false, text: "Looking forward to our next meeting!", t: "11:00 AM" }] },
  { id: "emily", name: "Dr Emily Tran", avatar: null, online: false,
    role: "Aesthetic Physician", seals: ["gb", "gold", "verified"],
    email: "emily.tran@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@emily_tran_md",
    media: ["assets/post3-img1.png", "assets/post3-img2.png", "assets/post3-img3.png"],
    files: [
      { name: "Patient Satisfaction Data.pdf", size: "2.1 MB" },
      { name: "Age Group Trends.pdf", size: "0.9 MB" }],
    messages: [
      { me: false, text: "Just finished reviewing the patient satisfaction data.", t: "10:50 AM" },
      { me: false, text: "There's a trend worth flagging in the 45+ age group.", t: "11:05 AM" },
      { me: false, text: "I have some additional insights to share.", t: "11:15 AM" }] },
  { id: "james", name: "Dr James Brown", avatar: null, online: false,
    role: "Aesthetic Physician", seals: ["gb", "verified", "crown"],
    email: "james.brown@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@james_brown_aesthetics",
    media: ["assets/post4-img1.png", "assets/post4-img2.png", "assets/post4-img3.png"],
    files: [
      { name: "Full Results Deck.pdf", size: "4.6 MB" }],
    messages: [
      { me: true, text: "Sent over the full results deck this morning.", t: "11:05 AM" },
      { me: false, text: "Can we discuss the implications of the results?", t: "11:30 AM" }] },
  { id: "alex", name: "Dr Alex Chen", avatar: null, online: true,
    role: "Clinical Nurse Specialist", seals: ["gb", "gold", "verified"],
    email: "alex.chen@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@alex_chen_rn",
    media: ["assets/post5-img1.png", "assets/post5-img2.png", "assets/post5-img3.png"],
    files: [
      { name: "Dosing Charts.pdf", size: "1.5 MB" },
      { name: "Data Analysis Summary.pdf", size: "2.0 MB" }],
    messages: [
      { me: false, text: "The dosing charts you put together are excellent.", t: "11:40 AM" },
      { me: false, text: "Great work on the data analysis!", t: "11:45 AM" }] },
  { id: "miranda", name: "Miranda Pearce", avatar: "assets/avatar-miranda.jpg", online: false,
    role: "Practice Manager", seals: ["gb", "verified"],
    email: "miranda.pearce@allcaremedical.co.uk", clinic: "Allcare Medical", website: "allcaremed.com", instagram: "@miranda_pearce",
    media: ["assets/clinic-lip-design.png", "assets/clinic-toxin-guide.png", "assets/clinic-treatment-collage.png"],
    files: [
      { name: "Confidence Score Writeup.pdf", size: "1.1 MB" }],
    messages: [
      { me: true, text: "Sharing the confidence-score writeup with you now.", t: "11:50 AM" },
      { me: false, text: "Perfect, thank you — this is exactly what I needed.", t: "12:00 PM" }] }];

function getParam(name) {
  try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
}

const PF_GROUPS_KEY_DM = "pf-dm-groups";

function readDmGroupsDM() {
  try { return JSON.parse(localStorage.getItem(PF_GROUPS_KEY_DM)) || []; } catch (e) { return []; }
}

function writeDmGroupsDM(groups) {
  try { localStorage.setItem(PF_GROUPS_KEY_DM, JSON.stringify(groups)); } catch (e) {}
}

function groupDisplayNameDM(members) {
  const names = members.map((m) => m.name.replace(/^Dr\s+/, ""));
  return names.length > 2 ? names.slice(0, 2).join(", ") + " +" + (names.length - 2) : names.join(", ");
}

/* Deep links from elsewhere (live-stream chat, comments) may name someone
   who isn't a contact yet — seed an empty 1:1 thread from ?name=&avatar=
   so the conversation can start. A name matching an existing contact
   reuses that thread instead. */
function threadFromParamsDM() {
  const name = getParam("name");
  if (!name) return null;
  const known = DM_THREADS_SEED_DM.find((t) => t.name === name);
  if (known) return known;
  const id = getParam("id") || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return { id, name, avatar: getParam("avatar") || null, online: true, role: getParam("role") || "PROfinity member",
    seals: [], media: [], files: [], messages: [] };
}

function loadThreadDM(threadId) {
  const groups = readDmGroupsDM();
  const g = groups.find((x) => x.id === threadId);
  if (g) return g;
  return DM_THREADS_SEED_DM.find((t) => t.id === threadId) || threadFromParamsDM() || DM_THREADS_SEED_DM[0];
}

function persistGroupDM(thread) {
  if (!thread.isGroup) return;
  const groups = readDmGroupsDM();
  const i = groups.findIndex((g) => g.id === thread.id);
  if (i >= 0) groups[i] = thread; else groups.unshift(thread);
  writeDmGroupsDM(groups);
}

function GroupAvatarStackDM({ members, size }) {
  const s = size || 40;
  return (
    <span className="dm-group-av" style={{ width: s, height: s }}>
      {members.slice(0, 2).map((m, i) =>
        <span className="dm-group-av-item" key={m.id || i}>
          <DSDM.Avatar name={m.name} src={m.avatar} size={Math.round(s * 0.68)} />
        </span>
      )}
    </span>);
}

const DM_SAMPLE_REPLIES_DM = [
  "Got it, thanks for the update!",
  "Sounds good — let's touch base soon.",
  "Appreciate you sharing this with me.",
  "Perfect, I'll take a look and get back to you.",
  "Thanks! That's really helpful."];

function pickDmReplyDM() {
  return DM_SAMPLE_REPLIES_DM[Math.floor(Math.random() * DM_SAMPLE_REPLIES_DM.length)];
}

const DM_REACTIONS_DM = [
  { key: "like", emoji: "👍" },
  { key: "love", emoji: "❤️" },
  { key: "haha", emoji: "😂" },
  { key: "sad", emoji: "😢" },
  { key: "angry", emoji: "😠" }];

function DmReactionBarDM({ current, onPick }) {
  return (
    <div className="dm-reaction-bar" onClick={(e) => e.stopPropagation()}>
      {DM_REACTIONS_DM.map((r) =>
        <button key={r.key} className={"dm-reaction-opt" + (current === r.key ? " active" : "")}
          aria-label={"React with " + r.key} onClick={() => onPick(r.key)}>
          {r.emoji}
        </button>
      )}
    </div>);
}

function DmMsgActionsDM({ onEdit }) {
  return (
    <div className="dm-msg-actions" onClick={(e) => e.stopPropagation()}>
      <button className="dm-msg-action-opt" onClick={onEdit}>
        <DSDM.IconifyIcon name="lucide:pencil" size={15} color="var(--text-heading)" />
        Edit
      </button>
    </div>);
}

/* ===== Custom stickers (Genmoji-style) =====
   The composer's smile button opens a sheet where you describe a sticker
   and/or tap suggestions (your own avatar, ❤️, 🤔, 👑 …). Keywords in the
   description map to emoji; the result is composed client-side as a
   base + up to three accents on a soft gradient tile. Sent stickers render
   as bubble-less tiles in the thread and are remembered under "Your stickers". */
const ME_DM = { name: "Katy Wilson", avatar: "assets/avatar-katy.jpg" };

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
      <span className="dm-sticker-me"><DSDM.Avatar name={ME_DM.name} src={ME_DM.avatar} size={Math.round(size * 0.66)} /></span> :
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
              {k === "me" ? <DSDM.Avatar name={ME_DM.name} src={ME_DM.avatar} size={56} /> : <span className="dm-sticker-opt-emoji">{k}</span>}
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

function DmBubblesDM({ messages, showSender, typingName, onReact, onEditStart }) {
  const [pickerFor, setPickerFor] = useStateDM(null);
  const [actionsFor, setActionsFor] = useStateDM(null);

  return (
    <div className="dm-bubbles" onClick={() => { setPickerFor(null); setActionsFor(null); }}>
      {messages.map((m, i) => {
        const reaction = DM_REACTIONS_DM.find((r) => r.key === m.reaction);
        return (
          <div key={i} className={"dm-bubble-row" + (m.me ? " me" : "")}>
            {showSender && !m.me && m.sender && <span className="dm-bubble-sender">{m.sender}</span>}
            <span className="dm-bubble-wrap">
              {m.gif ?
              <span className={"dm-bubble dm-bubble-gif" + (m.me ? " me" : "")}
                onClick={(e) => {
                  e.stopPropagation();
                  setActionsFor(null);
                  if (!m.me) setPickerFor((cur) => cur === i ? null : i);
                }}>
                <img src={m.gif.src} alt={"GIF: " + m.gif.label} />
                <span className="dm-gif-badge">GIF</span>
              </span> :
              m.sticker ?
              <span className={"dm-bubble dm-bubble-sticker" + (m.me ? " me" : "")}
                onClick={(e) => {
                  e.stopPropagation();
                  setActionsFor(null);
                  if (!m.me) setPickerFor((cur) => cur === i ? null : i);
                }}>
                <DmStickerDM sticker={m.sticker} size={132} />
              </span> :
              <span className={"dm-bubble" + (m.me ? " me" : "")}
                onClick={(e) => {
                  e.stopPropagation();
                  if (m.me) {
                    setActionsFor((cur) => cur === i ? null : i);
                  } else {
                    setPickerFor((cur) => cur === i ? null : i);
                  }
                }}>
                {m.text}
              </span>}
              {reaction &&
              <span className="dm-bubble-reaction" aria-label={reaction.key + " reaction"}>{reaction.emoji}</span>}
              {pickerFor === i &&
              <DmReactionBarDM current={m.reaction} onPick={(key) => {
                onReact(i, key);
                setPickerFor(null);
              }} />}
              {actionsFor === i &&
              <DmMsgActionsDM onEdit={() => {
                onEditStart(i, m.text);
                setActionsFor(null);
              }} />}
            </span>
            <span className="dm-bubble-t">{m.t}{m.edited ? " · Edited" : ""}</span>
          </div>);

      })}
      {typingName &&
      <div className="dm-bubble-row dm-typing-row">
          <span className="dm-bubble-sender">{typingName}</span>
          <span className="dm-bubble dm-typing">
            Replying
            <span className="dm-typing-dots"><span></span><span></span><span></span></span>
          </span>
        </div>}

    </div>);
}

function DmMediaGridDM({ media }) {
  const shown = media.slice(0, 3);
  const rest = media.length - shown.length;
  return (
    <div className="dm-media-grid">
      {shown.map((src, i) => {
        const isLast = i === shown.length - 1;
        return (
          <span className="dm-media-item" key={i}>
            <img src={src} alt="" />
            {isLast && rest > 0 && <span className="dm-media-more">+{rest}</span>}
          </span>);
      })}
    </div>);
}

function DmFilesListDM({ files }) {
  return (
    <div className="dm-files-list">
      {files.map((f, i) =>
        <div className="dm-file-row" key={i}>
          <span className="dm-file-icon">
            <DSDM.IconifyIcon name="lucide:file-text" size={20} color="var(--ai-purple)" />
          </span>
          <span className="dm-file-meta">
            <span className="dm-file-name">{f.name}</span>
            <span className="dm-file-sub">PDF &nbsp;|&nbsp; {f.size}</span>
          </span>
        </div>
      )}
    </div>);
}

function DmMembersListDM({ members }) {
  return (
    <div className="dm-members-list">
      {members.map((m, i) =>
        <div className="dm-member-row" key={m.id || i}>
          <DSDM.Avatar name={m.name} src={m.avatar} size={44} />
          <span className="dm-member-name">{m.name}</span>
        </div>
      )}
    </div>);
}

function DmInfoScreen({ thread, onBack, onOpenProfile, onAddPeople }) {
  const [muted, setMuted] = useStateDM(false);

  if (thread.isGroup) {
    return (
      <div className="dm-info-screen" data-screen-label="Group Info (mobile)">
        <header className="dm-info-head">
          <button className="dm-page-back" aria-label="Back to conversation" onClick={onBack}>
            <DSDM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
          </button>
        </header>
        <div className="dm-info-scroll">
          <div className="dm-info-top">
            <GroupAvatarStackDM members={thread.members} size={104} />
            <div className="dm-info-name">
              <span className="nm">{thread.name}</span>
            </div>
            <span className="dm-info-role">{thread.members.length} members</span>

            <div className="dm-info-actions">
              <button className="dm-info-actbtn" onClick={onAddPeople}>
                <span className="ic"><DSDM.IconifyIcon name="lucide:user-plus" size={19} color="var(--text-heading)" /></span>
                Add People
              </button>
              <button className={"dm-info-actbtn" + (muted ? " active" : "")} onClick={() => setMuted((v) => !v)}>
                <span className="ic"><DSDM.IconifyIcon name={muted ? "lucide:bell-off" : "lucide:bell"} size={19} color="var(--text-heading)" /></span>
                {muted ? "Unmute" : "Mute"}
              </button>
            </div>
          </div>

          <section className="dm-info-sec">
            <div className="dm-info-sec-h">
              <h2>Members</h2>
              <span className="dm-info-membercount">{thread.members.length}</span>
            </div>
            <DmMembersListDM members={thread.members} />
          </section>
        </div>
      </div>);
  }

  return (
    <div className="dm-info-screen" data-screen-label="Contact Info (mobile)">
      <header className="dm-info-head">
        <button className="dm-page-back" aria-label="Back to conversation" onClick={onBack}>
          <DSDM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
      </header>
      <div className="dm-info-scroll">
        <div className="dm-info-top">
          <span className="dm-info-avwrap">
            <DSDM.Avatar name={thread.name} src={thread.avatar} size={104} />
            {thread.online && <span className="dm-online-dot lg" />}
          </span>
          <div className="dm-info-name">
            <span className="nm">{thread.name}</span>
            <DSDM.VerificationSeals seals={thread.seals} size={19} />
          </div>
          <span className="dm-info-role">{thread.role}</span>

          <div className="dm-info-actions">
            <button className="dm-info-actbtn" onClick={onOpenProfile}>
              <span className="ic"><DSDM.IconifyIcon name="lucide:user" size={19} color="var(--text-heading)" /></span>
              View Profile
            </button>
            <button className={"dm-info-actbtn" + (muted ? " active" : "")} onClick={() => setMuted((v) => !v)}>
              <span className="ic"><DSDM.IconifyIcon name={muted ? "lucide:bell-off" : "lucide:bell"} size={19} color="var(--text-heading)" /></span>
              {muted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>

        <section className="dm-info-sec">
          <h2>About</h2>
          <div className="dm-info-about">
            {thread.email &&
            <div className="dm-info-row">
              <DSDM.IconifyIcon name="lucide:mail" size={19} color="var(--brand-navy)" />
              <span>{thread.email}</span>
            </div>}
            {thread.clinic &&
            <div className="dm-info-row">
              <DSDM.IconifyIcon name="lucide:building-2" size={19} color="var(--brand-navy)" />
              <span>{thread.clinic}</span>
            </div>}
            {thread.website &&
            <div className="dm-info-row">
              <DSDM.IconifyIcon name="lucide:globe" size={19} color="var(--brand-navy)" />
              <span>{thread.website}</span>
            </div>}
            {thread.instagram &&
            <div className="dm-info-row">
              <DSDM.IconifyIcon name="mdi:instagram" size={19} color="var(--brand-navy)" />
              <span>{thread.instagram}</span>
            </div>}
          </div>
        </section>

        <section className="dm-info-sec">
          <div className="dm-info-sec-h">
            <h2>Shared Media</h2>
            <button className="dm-info-seeall">See All</button>
          </div>
          <DmMediaGridDM media={thread.media} />
        </section>

        <section className="dm-info-sec">
          <div className="dm-info-sec-h">
            <h2>Files</h2>
            <button className="dm-info-seeall">See All</button>
          </div>
          <DmFilesListDM files={thread.files} />
        </section>
      </div>
    </div>);
}

function DmAddPeopleScreen({ existingIds, onBack, onAdd }) {
  const [picked, setPicked] = useStateDM([]);
  const [query, setQuery] = useStateDM("");
  const candidates = DM_THREADS_SEED_DM.filter((c) => !existingIds.includes(c.id));
  const filtered = candidates.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  function toggle(id) {
    setPicked((all) => all.includes(id) ? all.filter((x) => x !== id) : [...all, id]);
  }

  return (
    <div className="dm-info-screen" data-screen-label="Add People (mobile)">
      <header className="dm-info-head dm-add-head">
        <button className="dm-page-back" aria-label="Back to group info" onClick={onBack}>
          <DSDM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
        <h2>Add People</h2>
      </header>
      <div className="dm-add-search">
        <input type="text" placeholder="Search people" aria-label="Search people" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="dm-add-list">
        {filtered.map((c) => {
          const on = picked.includes(c.id);
          return (
            <button key={c.id} className={"mp-new-row" + (on ? " on" : "")} onClick={() => toggle(c.id)}>
              <span className="mp-av"><DSDM.Avatar name={c.name} src={c.avatar} size={44} /></span>
              <span className="mp-new-name">{c.name}</span>
              <span className={"mp-new-check" + (on ? " on" : "")}>
                {on && <DSDM.IconifyIcon name="lucide:check" size={13} color="#fff" />}
              </span>
            </button>);
        })}
        {filtered.length === 0 && <div className="mp-new-empty">Everyone available is already in this group.</div>}
      </div>
      <div className="mp-new-footer">
        <span className="mp-new-count">{picked.length} selected</span>
        <button className="mp-new-create" disabled={picked.length === 0}
          onClick={() => onAdd(candidates.filter((c) => picked.includes(c.id)))}>
          Add
        </button>
      </div>
    </div>);
}

function DmPage() {
  const fromPage = getParam("from") || "NewsfeedMobile.html";
  const threadId = getParam("id") || (threadFromParamsDM() || DM_THREADS_SEED_DM[0]).id;
  const [thread, setThread] = useStateDM(() => loadThreadDM(threadId));
  const [messages, setMessages] = useStateDM(thread.messages);
  const [text, setText] = useStateDM("");
  const [view, setView] = useStateDM("chat");
  const [typingName, setTypingName] = useStateDM(null);
  const [editingIndex, setEditingIndex] = useStateDM(null);
  const [stickerOpen, setStickerOpen] = useStateDM(null); // null | "sticker" | "gif"
  const bodyRef = useRefDM(null);
  const replyTimerDM = useRefDM(null);

  useEffectDM(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typingName]);

  useEffectDM(() => {
    if (thread.isGroup) persistGroupDM({ ...thread, messages });
  }, [messages]);

  useEffectDM(() => () => { if (replyTimerDM.current) window.clearTimeout(replyTimerDM.current); }, []);

  function triggerReplyDM() {
    const replier = thread.isGroup ?
    thread.members[Math.floor(Math.random() * thread.members.length)] || { name: thread.name } :
    { name: thread.name };
    setTypingName(replier.name);
    if (replyTimerDM.current) window.clearTimeout(replyTimerDM.current);
    replyTimerDM.current = window.setTimeout(() => {
      setTypingName(null);
      setMessages((all) => [...all, thread.isGroup ?
      { me: false, text: pickDmReplyDM(), t: "Now", sender: replier.name } :
      { me: false, text: pickDmReplyDM(), t: "Now" }]);
    }, 1800);
  }

  function submit() {
    const v = text.trim();
    if (!v) return;
    if (editingIndex !== null) {
      setMessages((all) => all.map((m, i) => i === editingIndex ? { ...m, text: v, edited: true } : m));
      setEditingIndex(null);
      setText("");
      return;
    }
    setMessages((all) => [...all, { me: true, text: v, t: "Now" }]);
    setText("");
    triggerReplyDM();
  }

  function sendSticker(sticker) {
    setMessages((all) => [...all, { me: true, sticker, text: "Sticker", t: "Now" }]);
    setStickerOpen(null);
    triggerReplyDM();
  }

  function sendGif(gif) {
    setMessages((all) => [...all, { me: true, gif: { id: gif.id, src: gif.src, label: gif.label }, text: "GIF", t: "Now" }]);
    setStickerOpen(null);
    triggerReplyDM();
  }

  function reactToMessage(index, key) {
    setMessages((all) => all.map((m, i) => i === index ? { ...m, reaction: m.reaction === key ? null : key } : m));
  }

  function startEditMessage(index, currentText) {
    setEditingIndex(index);
    setText(currentText);
  }

  function cancelEditMessage() {
    setEditingIndex(null);
    setText("");
  }

  function addMembers(newContacts) {
    const added = newContacts.map((c) => ({ id: c.id, name: c.name, avatar: c.avatar }));
    setThread((t) => {
      const members = [...t.members, ...added];
      const next = { ...t, members, name: t.customName ? t.name : groupDisplayNameDM(members) };
      persistGroupDM({ ...next, messages });
      return next;
    });
    setView("info");
  }

  if (view === "addPeople") {
    return <DmAddPeopleScreen existingIds={thread.members.map((m) => m.id)}
      onBack={() => setView("info")} onAdd={addMembers} />;
  }

  if (view === "info") {
    return <DmInfoScreen thread={thread} onBack={() => setView("chat")}
      onAddPeople={() => setView("addPeople")}
      onOpenProfile={() => {
        if (!thread.isGroup && window.PFProfileLink && window.PFProfileLink.open({ name: thread.name, avatar: thread.avatar })) return;
        goDM("ClinicianDirectory.html?from=" + encodeURIComponent("DirectMessage.html?id=" + thread.id + "&from=" + fromPage));
      }} />;
  }

  return (
    <div className="dm-screen" data-screen-label="Direct Message (mobile)">
      <header className="dm-page-head">
        <button className="dm-page-back" aria-label="Back to messages" onClick={() => goDM(fromPage)}>
          <DSDM.IconifyIcon name="lucide:arrow-left" size={24} color="var(--gray-900)" />
        </button>
        <button className="dm-head-id" onClick={() => setView("info")}
          aria-label={thread.isGroup ? "View group info" : "View " + thread.name + "'s contact info"}>
          <span className="dm-head-av">
            {thread.isGroup ?
            <GroupAvatarStackDM members={thread.members} /> :

            <>
                <DSDM.Avatar name={thread.name} src={thread.avatar} size={40} />
                {thread.online && <span className="dm-online-dot" />}
              </>}
          </span>
          <span className="dm-head-main">
            <span className="dm-head-name">{thread.name}</span>
            <span className="dm-head-status">
              {thread.isGroup ? thread.members.length + " members" : thread.online ? "Active now" : "Offline"}
            </span>
          </span>
        </button>
        <button className="dm-page-back" aria-label="Voice call">
          <DSDM.IconifyIcon name="lucide:phone" size={20} color="var(--brand-navy)" />
        </button>
      </header>
      <div className="dm-body" ref={bodyRef}>
        <DmBubblesDM messages={messages} showSender={thread.isGroup} typingName={typingName} onReact={reactToMessage}
          onEditStart={startEditMessage} />
      </div>
      {editingIndex !== null &&
      <div className="dm-editing-banner">
        <span>Editing message</span>
        <button aria-label="Cancel edit" onClick={cancelEditMessage}>
          <DSDM.IconifyIcon name="lucide:x" size={16} color="var(--gray-450)" />
        </button>
      </div>}
      <div className="dm-input-bar">
        <button className="dm-attach" aria-label="Attach">
          <DSDM.IconifyIcon name="lucide:plus" size={20} color="var(--brand-navy)" />
        </button>
        <input type="text" placeholder={editingIndex !== null ? "Edit message..." : "Message..."} aria-label="Message" value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape" && editingIndex !== null) cancelEditMessage(); }} />
        {editingIndex === null && !text.trim() &&
        <button className="dm-attach dm-gif-btn" aria-label="Send a GIF" aria-expanded={stickerOpen === "gif"}
          onClick={() => setStickerOpen("gif")}>GIF</button>}
        {editingIndex === null &&
        <button className="dm-attach dm-sticker-btn" aria-label="Custom sticker" aria-expanded={stickerOpen === "sticker"}
          onClick={() => setStickerOpen("sticker")}>
          <DSDM.IconifyIcon name="lucide:smile-plus" size={20} color="var(--brand-navy)" />
        </button>}
        <button className={"dm-send" + (text.trim() ? " on" : "")} aria-label={editingIndex !== null ? "Save edit" : "Send"}
          disabled={!text.trim()} onClick={submit}>
          <DSDM.IconifyIcon name={editingIndex !== null ? "lucide:check" : "lucide:arrow-up"} size={18} color="#fff" />
        </button>
      </div>
      {stickerOpen &&
      <DmStickerSheetDM initialMode={stickerOpen} onClose={() => setStickerOpen(null)} onSend={sendSticker} onSendGif={sendGif} />}
    </div>);
}

function DirectMessageApp() {
  const mobile = useIsMobileDM();
  const scale = useDeviceScaleDM();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", backgroundColor: "rgb(217, 218, 225)" };
  if (mobile) {
    return <div className="app" style={{ ...vars, background: "var(--surface-page)" }}><DmPage /></div>;
  }
  return (
    <div className="app device-stage" style={vars}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956}><DmPage /></IOSDevice>
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<DirectMessageApp />);
