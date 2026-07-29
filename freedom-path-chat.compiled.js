/* ===========================================================================
   PROfinity — Freedom Path Chat · iPhone 17 Pro Max mobile
   Group chat for members who've unlocked the Freedom tier — business
   playbooks, mentor intros, and peer support between Freedom Path members.
   Opened from the mobile side menu (?from=<page to return to>).
   Suffixed -FPC to avoid global-scope clashes. Reuses direct-message.css'
   .dm-* classes since this is the same bubble/header/input-bar chat UI.
   =========================================================================== */
const {
  useState: useStateFPC,
  useEffect: useEffectFPC,
  useRef: useRefFPC
} = React;
const DSFPC = window.ProfinityDesignSystem_c2b5cc;
function goFPC(url) {
  (window.pfGo || function (u) {
    window.location.href = u;
  })(url);
}
function useDeviceScaleFPC() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [scale, setScale] = useStateFPC(calc);
  useEffectFPC(() => {
    const update = () => setScale(calc());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
function useIsMobileFPC() {
  const [mobile, setMobile] = useStateFPC(() => window.matchMedia('(max-width:768px)').matches);
  useEffectFPC(() => {
    const mq = window.matchMedia('(max-width:768px)');
    const h = e => setMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return mobile;
}
function getParamFPC(name) {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch (e) {
    return null;
  }
}
const FPC_MEMBERS = [{
  id: "tim",
  name: "Dr Tim Pearce",
  avatar: "assets/avatar-drtim.png"
}, {
  id: "amir",
  name: "Dr Amir Khan",
  avatar: "assets/avatar-amir-khan.jpg"
}, {
  id: "sarah",
  name: "Dr. Sarah Collins",
  avatar: "assets/avatar-sarah-collins.jpg"
}, {
  id: "mark",
  name: "Mark Ellis",
  avatar: "assets/avatar-mark-ellis.jpg"
}, {
  id: "priya",
  name: "Priya Shah",
  avatar: "assets/avatar-priya-shah.jpg"
}];
const FPC_SEED_MESSAGES = [{
  me: false,
  sender: "Dr Tim Pearce",
  text: "Welcome to the Freedom Path circle — this is where we talk business, not just technique.",
  t: "9:02 AM"
}, {
  me: false,
  sender: "Mark Ellis",
  text: "Just wrapped my first quarter using the pricing playbook from the resource hub — revenue's up 22%.",
  t: "9:14 AM"
}, {
  me: false,
  sender: "Priya Shah",
  text: "That's brilliant Mark! I'm still deciding between the associate hire vs. sub-contracting model.",
  t: "9:20 AM"
}, {
  me: false,
  sender: "Dr Amir Khan",
  text: "Happy to jump on a call about that Priya — went through the same decision last year.",
  t: "9:26 AM"
}, {
  me: false,
  sender: "Dr. Sarah Collins",
  text: "Reminder: 1:1 mentor sessions open up again next week, grab a slot before they fill.",
  t: "9:41 AM"
}];
const FPC_SAMPLE_REPLIES = ["Good question — let's dig into that on the next call.", "Same boat here, following this thread closely.", "Worth raising at the next mentor session too.", "Appreciate you sharing this with the group!", "That tracks with what I'm seeing in my own numbers."];
function pickFpcReply() {
  return FPC_SAMPLE_REPLIES[Math.floor(Math.random() * FPC_SAMPLE_REPLIES.length)];
}
const FPC_KEY = "pf-freedom-path-chat-messages";
function loadFpcMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(FPC_KEY));
    if (saved && saved.length) return saved;
  } catch (e) {}
  return FPC_SEED_MESSAGES;
}
function GroupAvatarStackFPC({
  members,
  size
}) {
  const s = size || 40;
  return /*#__PURE__*/React.createElement("span", {
    className: "dm-group-av",
    style: {
      width: s,
      height: s
    }
  }, members.slice(0, 2).map(m => /*#__PURE__*/React.createElement("span", {
    className: "dm-group-av-item",
    key: m.id
  }, /*#__PURE__*/React.createElement(DSFPC.Avatar, {
    name: m.name,
    src: m.avatar,
    size: Math.round(s * 0.68)
  }))));
}
function FpcBubbles({
  messages,
  typingName
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-bubbles"
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "dm-bubble-row" + (m.me ? " me" : "")
  }, !m.me && /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble-sender"
  }, m.sender), /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble" + (m.me ? " me" : "")
  }, m.text)), /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble-t"
  }, m.t))), typingName && /*#__PURE__*/React.createElement("div", {
    className: "dm-bubble-row dm-typing-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble-sender"
  }, typingName), /*#__PURE__*/React.createElement("span", {
    className: "dm-bubble dm-typing"
  }, "Replying", /*#__PURE__*/React.createElement("span", {
    className: "dm-typing-dots"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)))));
}
function FpcPage() {
  const fromPage = getParamFPC("from") || "NewsfeedMobile.html";
  const [messages, setMessages] = useStateFPC(loadFpcMessages);
  const [text, setText] = useStateFPC("");
  const [typingName, setTypingName] = useStateFPC(null);
  const bodyRef = useRefFPC(null);
  const replyTimerFPC = useRefFPC(null);
  useEffectFPC(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typingName]);
  useEffectFPC(() => {
    try {
      localStorage.setItem(FPC_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);
  useEffectFPC(() => () => {
    if (replyTimerFPC.current) window.clearTimeout(replyTimerFPC.current);
  }, []);
  function triggerReplyFPC() {
    const replier = FPC_MEMBERS[Math.floor(Math.random() * FPC_MEMBERS.length)];
    setTypingName(replier.name);
    if (replyTimerFPC.current) window.clearTimeout(replyTimerFPC.current);
    replyTimerFPC.current = window.setTimeout(() => {
      setTypingName(null);
      setMessages(all => [...all, {
        me: false,
        sender: replier.name,
        text: pickFpcReply(),
        t: "Now"
      }]);
    }, 1800);
  }
  function submit() {
    const v = text.trim();
    if (!v) return;
    setMessages(all => [...all, {
      me: true,
      sender: "You",
      text: v,
      t: "Now"
    }]);
    setText("");
    triggerReplyFPC();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "dm-screen",
    "data-screen-label": "Freedom Path Chat (mobile)"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dm-page-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dm-page-back",
    "aria-label": "Back",
    onClick: () => goFPC(fromPage)
  }, /*#__PURE__*/React.createElement(DSFPC.IconifyIcon, {
    name: "lucide:arrow-left",
    size: 24,
    color: "var(--gray-900)"
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-head-id"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-head-av"
  }, /*#__PURE__*/React.createElement(GroupAvatarStackFPC, {
    members: FPC_MEMBERS
  })), /*#__PURE__*/React.createElement("span", {
    className: "dm-head-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dm-head-name"
  }, "Freedom Path Chat"), /*#__PURE__*/React.createElement("span", {
    className: "dm-head-status"
  }, FPC_MEMBERS.length, " members · Freedom tier")))), /*#__PURE__*/React.createElement("div", {
    className: "dm-body",
    ref: bodyRef
  }, /*#__PURE__*/React.createElement(FpcBubbles, {
    messages: messages,
    typingName: typingName
  })), /*#__PURE__*/React.createElement("div", {
    className: "dm-input-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dm-attach",
    "aria-label": "Attach"
  }, /*#__PURE__*/React.createElement(DSFPC.IconifyIcon, {
    name: "lucide:plus",
    size: 20,
    color: "var(--brand-navy)"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Message the group...",
    "aria-label": "Message",
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") submit();
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "dm-send" + (text.trim() ? " on" : ""),
    "aria-label": "Send",
    disabled: !text.trim(),
    onClick: submit
  }, /*#__PURE__*/React.createElement(DSFPC.IconifyIcon, {
    name: "lucide:arrow-up",
    size: 18,
    color: "#fff"
  }))));
}
function FreedomPathChatApp() {
  const mobile = useIsMobileFPC();
  const scale = useDeviceScaleFPC();
  const vars = {
    "--action-primary": "var(--brand-navy)",
    "--action-primary-hover": "var(--brand-navy-700)",
    backgroundColor: "rgb(217, 218, 225)"
  };
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      style: {
        ...vars,
        background: "var(--surface-page)"
      }
    }, /*#__PURE__*/React.createElement(FpcPage, null));
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
  }, /*#__PURE__*/React.createElement(FpcPage, null))));
}
ReactDOM.createRoot(document.getElementById("pf-root")).render(/*#__PURE__*/React.createElement(FreedomPathChatApp, null));
