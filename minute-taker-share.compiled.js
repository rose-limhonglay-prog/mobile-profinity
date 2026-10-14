/* ===========================================================================
   PROfinity — Minute Taker · Share a clinical note (shared mobile + web)
   One component for both shells: <Share variant="sheet" /> on the mobile
   pages (window.PFMT) and <Share variant="modal" /> on the web pages
   (window.PFMTW). Channels: Email · Text · WhatsApp · Messenger · Telegram ·
   Copy link · More (native share). Email + Text open a small form with the
   patient's contact pre-filled; the others hand off to the app / clipboard.
   Every send is logged in localStorage "pf-mt-shares". Classes prefixed mtsh-.
   Exposes window.PFMTShare = { CHANNELS, contactFor, noteLink, log, history, Share }.
   =========================================================================== */
(function () {
  const {
    useState,
    useEffect,
    useRef
  } = React;
  const STORE = "pf-mt-shares";
  function shell() {
    return window.PFMT || window.PFMTW || {};
  }
  function contactFor(name) {
    const p = (shell().PATIENTS || {})[name] || {};
    const slug = String(name || "patient").trim().toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "");
    return {
      email: p.email || slug + "@example.com",
      phone: p.phone || ""
    };
  }
  function noteLink(id) {
    const key = String(id || "MT-00000").toLowerCase().replace(/[^a-z0-9]/g, "");
    return "https://app.profinity.com/notes/" + key + "?k=" + key.split("").reverse().join("").slice(0, 6);
  }
  function history() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "[]");
    } catch (e) {
      return [];
    }
  }
  function log(entry) {
    try {
      const list = history();
      list.unshift({
        ...entry,
        at: Date.now()
      });
      localStorage.setItem(STORE, JSON.stringify(list.slice(0, 50)));
    } catch (e) {/* storage unavailable */}
    try {
      window.dispatchEvent(new CustomEvent("pf:mt-shared", {
        detail: entry
      }));
    } catch (e) {/* no-op */}
  }
  function openExternal(url) {
    try {
      window.open(url, "_blank", "noopener");
    } catch (e) {/* popup blocked */}
  }
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      } catch (e2) {
        return false;
      }
    }
  }
  const CHANNELS = [{
    key: "email",
    label: "Email",
    icon: "lucide:mail",
    tone: "email",
    form: true
  }, {
    key: "sms",
    label: "Text",
    icon: "lucide:message-square",
    tone: "sms",
    form: true
  }, {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "mdi:whatsapp",
    tone: "whatsapp",
    url: (t, u) => "https://wa.me/?text=" + encodeURIComponent(t + " " + u)
  }, {
    key: "messenger",
    label: "Messenger",
    icon: "mdi:facebook-messenger",
    tone: "messenger",
    url: (t, u) => "https://www.messenger.com/share?link=" + encodeURIComponent(u)
  }, {
    key: "telegram",
    label: "Telegram",
    icon: "mdi:send",
    tone: "telegram",
    url: (t, u) => "https://t.me/share/url?url=" + encodeURIComponent(u) + "&text=" + encodeURIComponent(t)
  }, {
    key: "copy",
    label: "Copy link",
    icon: "lucide:link",
    tone: "copy"
  }, {
    key: "more",
    label: "More",
    icon: "lucide:ellipsis",
    tone: "more"
  }];
  function defaultText(patient, note) {
    const first = String(patient || "there").split(" ")[0];
    const when = note && note.date ? String(note.date).replace(/^Today/, "today").replace(/^Yesterday/, "yesterday") : "today";
    return "Hi " + first + ", here is your clinical note from " + when + ". The link is private and expires in 7 days.";
  }
  function Share({
    variant = "sheet",
    patient,
    id,
    note,
    hasRecording,
    initialChannel,
    onClose,
    onToast
  }) {
    const isSheet = variant === "sheet";
    const contact = contactFor(patient);
    const link = noteLink(id);
    const [channel, setChannel] = useState(() => CHANNELS.find(c => c.key === initialChannel && c.form) ? initialChannel : null);
    const [to, setTo] = useState(contact.email);
    const [phone, setPhone] = useState(contact.phone);
    const [subject, setSubject] = useState("Your clinical note · " + (note && note.date || "today"));
    const [message, setMessage] = useState(() => defaultText(patient, note));
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(null);
    const firstField = useRef(null);
    const toast = (m, t) => {
      if (onToast) onToast(m, t);
    };
    useEffect(() => {
      const esc = e => {
        if (e.key === "Escape") onClose && onClose();
      };
      document.addEventListener("keydown", esc);
      return () => document.removeEventListener("keydown", esc);
    }, [onClose]);
    useEffect(() => {
      if (channel && firstField.current) firstField.current.focus();
    }, [channel]);
    function pick(c) {
      const text = subject + " — " + link;
      if (c.form) {
        setChannel(c.key);
        return;
      }
      if (c.key === "copy") {
        copy(link).then(ok => {
          toast(ok ? "Link copied" : "Couldn't copy the link");
          log({
            channel: "copy",
            patient,
            id,
            link
          });
        });
        return;
      }
      if (c.key === "more") {
        if (navigator.share) {
          navigator.share({
            title: subject,
            text: message,
            url: link
          }).then(() => {
            log({
              channel: "native",
              patient,
              id,
              link
            });
            toast("Shared");
          }).catch(() => {});
        } else {
          copy(link).then(() => toast("No share menu here · link copied instead"));
        }
        return;
      }
      if (c.url) {
        openExternal(c.url(message, link));
        log({
          channel: c.key,
          patient,
          id,
          link
        });
        toast("Opening " + c.label + "…");
      }
    }
    function send(e) {
      if (e) e.preventDefault();
      if (sending) return;
      const target = channel === "email" ? to.trim() : phone.trim();
      if (!target) {
        toast(channel === "email" ? "Add an email address first" : "Add a mobile number first", "warn");
        return;
      }
      setSending(true);
      window.setTimeout(() => {
        /* everything is attached automatically (user, 2026-10-14): secure link always, PDF on email, never the recording */
        log({
          channel,
          patient,
          id,
          link,
          to: target,
          attachPdf: channel === "email",
          withAudio: false
        });
        setSending(false);
        setSent(target);
        toast(channel === "email" ? "Note emailed to " + target : "Note texted to " + target, "ok");
      }, 900);
    }
    const active = CHANNELS.find(c => c.key === channel);
    const Avatar = shell().Avatar;
    return /*#__PURE__*/React.createElement("div", {
      className: "mtsh-scrim" + (isSheet ? " is-sheet" : " is-modal"),
      onClick: onClose
    }, /*#__PURE__*/React.createElement("div", {
      className: "mtsh-panel" + (isSheet ? " is-sheet" : " is-modal"),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Share the clinical note for " + patient,
      onClick: e => e.stopPropagation()
    }, isSheet && /*#__PURE__*/React.createElement("span", {
      className: "mtsh-grab",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "mtsh-head"
    }, channel ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mtsh-back",
      "aria-label": "Back to share options",
      onClick: () => {
        setChannel(null);
        setSent(null);
      }
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:arrow-left"
    })) : Avatar ? /*#__PURE__*/React.createElement(Avatar, {
      name: patient,
      size: 40
    }) : null, /*#__PURE__*/React.createElement("div", {
      className: "mtsh-title"
    }, /*#__PURE__*/React.createElement("strong", null, channel ? channel === "email" ? "Email the note" : "Text the note" : "Share clinical note"), /*#__PURE__*/React.createElement("span", null, patient, note && note.type ? " · " + note.type : "", note && note.date ? " · " + note.date : "")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mtsh-x",
      "aria-label": "Close",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:x"
    }))), !channel && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "mtsh-link"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtsh-link-ic"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:lock"
    })), /*#__PURE__*/React.createElement("span", {
      className: "mtsh-link-text"
    }, /*#__PURE__*/React.createElement("strong", null, "Private link · expires in 7 days"), /*#__PURE__*/React.createElement("span", null, link.replace("https://", ""))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mtsh-link-copy",
      onClick: () => pick(CHANNELS[5])
    }, "Copy")), /*#__PURE__*/React.createElement("div", {
      className: "mtsh-channels",
      role: "list",
      "aria-label": "Share via"
    }, CHANNELS.map(c => /*#__PURE__*/React.createElement("button", {
      key: c.key,
      type: "button",
      role: "listitem",
      className: "mtsh-chan mtsh-chan-" + c.tone,
      onClick: () => pick(c)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtsh-chan-ic"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: c.icon
    })), /*#__PURE__*/React.createElement("span", {
      className: "mtsh-chan-label"
    }, c.label)))), /*#__PURE__*/React.createElement("div", {
      className: "mtsh-foot"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:shield-check"
    }), /*#__PURE__*/React.createElement("span", null, "Only the approved note is shared, never the raw transcript or the recording. Each send is logged against the patient record."))), channel && !sent && /*#__PURE__*/React.createElement("form", {
      className: "mtsh-form",
      onSubmit: send
    }, channel === "email" ? /*#__PURE__*/React.createElement("label", {
      className: "mtsh-field"
    }, /*#__PURE__*/React.createElement("span", null, "To"), /*#__PURE__*/React.createElement("input", {
      ref: firstField,
      type: "email",
      inputMode: "email",
      autoComplete: "off",
      value: to,
      onChange: e => setTo(e.target.value),
      placeholder: "patient@email.com"
    })) : /*#__PURE__*/React.createElement("label", {
      className: "mtsh-field"
    }, /*#__PURE__*/React.createElement("span", null, "To"), /*#__PURE__*/React.createElement("input", {
      ref: firstField,
      type: "tel",
      inputMode: "tel",
      autoComplete: "off",
      value: phone,
      onChange: e => setPhone(e.target.value),
      placeholder: "Mobile number"
    })), /*#__PURE__*/React.createElement("label", {
      className: "mtsh-field"
    }, /*#__PURE__*/React.createElement("span", null, "Message"), /*#__PURE__*/React.createElement("textarea", {
      rows: 4,
      value: message,
      onChange: e => setMessage(e.target.value)
    })), /*#__PURE__*/React.createElement("div", {
      className: "mtsh-auto"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtsh-attach-ic"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:paperclip"
    })), /*#__PURE__*/React.createElement("span", null, channel === "email" ? "The note (PDF) and a secure link are attached automatically." : "A secure link to the note is included automatically.")), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "mtsh-send" + (sending ? " is-busy" : ""),
      disabled: sending
    }, sending ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "mtsh-spin",
      "aria-hidden": "true"
    }), "Sending…") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: channel === "email" ? "lucide:send" : "lucide:message-square"
    }), channel === "email" ? "Send email" : "Send text"))), channel && sent && /*#__PURE__*/React.createElement("div", {
      className: "mtsh-done",
      role: "status"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mtsh-done-ic"
    }, /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "lucide:check"
    })), /*#__PURE__*/React.createElement("h3", null, channel === "email" ? "Email sent" : "Text sent"), /*#__PURE__*/React.createElement("p", null, patient.split(" ")[0], " will receive the note at ", /*#__PURE__*/React.createElement("strong", null, sent), ". The link expires in 7 days and this send has been logged on the record."), /*#__PURE__*/React.createElement("div", {
      className: "mtsh-done-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mtsh-ghost",
      onClick: () => {
        setChannel(null);
        setSent(null);
      }
    }, "Share another way"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "mtsh-send",
      onClick: onClose
    }, "Done")))));
  }
  window.PFMTShare = {
    CHANNELS,
    contactFor,
    noteLink,
    log,
    history,
    Share
  };
})();
