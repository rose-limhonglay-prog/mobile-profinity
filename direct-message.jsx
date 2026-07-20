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

function loadThreadDM(threadId) {
  const groups = readDmGroupsDM();
  const g = groups.find((x) => x.id === threadId);
  if (g) return g;
  return DM_THREADS_SEED_DM.find((t) => t.id === threadId) || DM_THREADS_SEED_DM[0];
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
              </span>
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
            <div className="dm-info-row">
              <DSDM.IconifyIcon name="lucide:mail" size={19} color="var(--brand-navy)" />
              <span>{thread.email}</span>
            </div>
            <div className="dm-info-row">
              <DSDM.IconifyIcon name="lucide:building-2" size={19} color="var(--brand-navy)" />
              <span>{thread.clinic}</span>
            </div>
            <div className="dm-info-row">
              <DSDM.IconifyIcon name="lucide:globe" size={19} color="var(--brand-navy)" />
              <span>{thread.website}</span>
            </div>
            <div className="dm-info-row">
              <DSDM.IconifyIcon name="mdi:instagram" size={19} color="var(--brand-navy)" />
              <span>{thread.instagram}</span>
            </div>
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
  const threadId = getParam("id") || DM_THREADS_SEED_DM[0].id;
  const [thread, setThread] = useStateDM(() => loadThreadDM(threadId));
  const [messages, setMessages] = useStateDM(thread.messages);
  const [text, setText] = useStateDM("");
  const [view, setView] = useStateDM("chat");
  const [typingName, setTypingName] = useStateDM(null);
  const [editingIndex, setEditingIndex] = useStateDM(null);
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
      onOpenProfile={() => goDM("ClinicianDirectory.html?from=" + encodeURIComponent("DirectMessage.html?id=" + thread.id + "&from=" + fromPage))} />;
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
        <button className={"dm-send" + (text.trim() ? " on" : "")} aria-label={editingIndex !== null ? "Save edit" : "Send"}
          disabled={!text.trim()} onClick={submit}>
          <DSDM.IconifyIcon name={editingIndex !== null ? "lucide:check" : "lucide:arrow-up"} size={18} color="#fff" />
        </button>
      </div>
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
