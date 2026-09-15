/* comment-share-prompt.jsx — shared "Share this comment?" verification.
   Used by every My Learning comment box (mobile Lesson + Course Detail
   Confidence, web Course + Lesson pages). The first time a member posts a
   lesson comment we ask whether it should also go to the private course
   newsfeed; once they tick "Remember my decision" the prompt stops and the
   saved choice is applied silently. One localStorage key is shared by all
   pages so the decision carries across mobile and web.
   Compile: npx babel comment-share-prompt.jsx -o comment-share-prompt.compiled.js --config-file ./babel.config.json */
(function () {
  const PREF_KEY = "pf_ls_comment_share_pref";
  const POSTS_KEY = "pf-newsfeed-user-posts";

  function readPref() {
    try {
      const raw = window.localStorage.getItem(PREF_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writePref(share) {
    try { window.localStorage.setItem(PREF_KEY, JSON.stringify({ share: !!share, at: Date.now() })); } catch (e) {}
  }
  function clearPref() {
    try { window.localStorage.removeItem(PREF_KEY); } catch (e) {}
  }

  /* Mirrors CreatePostMobile's addPost (same key so the Newsfeed Feed picks
     it up), tagged bucket "coursecomment" so app.jsx renders it through
     CourseCommentCard — the "X commented in course Y" treatment. */
  function shareToNewsfeed({ author, courseSlug, text }) {
    const post = {
      id: "u" + Date.now(),
      author: { name: author.name, avatar: author.avatar, seals: ["gb", "verified"] },
      time: "Just now", body: text, bucket: "coursecomment", course: courseSlug || "",
      likes: "0", comments: "0", shares: "0", commentList: []
    };
    try {
      const existing = JSON.parse(window.localStorage.getItem(POSTS_KEY)) || [];
      window.localStorage.setItem(POSTS_KEY, JSON.stringify([post, ...existing]));
    } catch (e) {}
  }

  const MegaphoneIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>);
  const HelpIcon = ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
    </svg>);

  const COPY = {
    title: "Share this comment?",
    desc: "Comments on lessons can also appear in the private course newsfeed so other course members can learn from the discussion.",
    toggle: "Also share to newsfeed",
    toggleSub: "Visible only to course members",
    remember: "Remember my decision",
    cancel: "Cancel",
    confirm: "Post comment",
    note: "Your comment will also be shared to the newsfeed."
  };

  /* variant: "sheet" (mobile bottom sheet, default) | "dialog" (web, centered) */
  function Modal({ variant = "sheet", className = "", onCancel, onConfirm }) {
    const [share, setShare] = React.useState(true);
    const [remember, setRemember] = React.useState(false);
    React.useEffect(() => {
      const onKey = (e) => { if (e.key === "Escape") onCancel(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onCancel]);
    return (
      <div className={"pf-cs-overlay " + variant + (className ? " " + className : "")} onClick={onCancel} data-testid="comment-share-prompt">
        <div className="pf-cs-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="pf-cs-title">
          <div className="pf-cs-icon"><MegaphoneIcon /></div>
          <h3 className="pf-cs-title" id="pf-cs-title">{COPY.title}</h3>
          <p className="pf-cs-desc">{COPY.desc}</p>

          <label className="pf-cs-toggle-row">
            <span className="pf-cs-toggle-text">
              <span className="pf-cs-toggle-label">{COPY.toggle}</span>
              <span className="pf-cs-toggle-sub">{COPY.toggleSub}</span>
            </span>
            <span className={"pf-cs-switch" + (share ? " on" : "")}>
              <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} aria-label={COPY.toggle} />
              <span className="pf-cs-knob" />
            </span>
          </label>

          <label className="pf-cs-remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            {COPY.remember}
          </label>

          <div className="pf-cs-actions">
            <button type="button" className="pf-cs-btn cancel" onClick={onCancel}>{COPY.cancel}</button>
            <button type="button" className="pf-cs-btn primary" onClick={() => onConfirm(share, remember)}>{COPY.confirm}</button>
          </div>
        </div>
      </div>);
  }

  /* Composer footnote shown under every lesson comment box. */
  function Note({ className = "" }) {
    return (
      <div className={"pf-cs-note" + (className ? " " + className : "")}>
        <HelpIcon />{COPY.note}
      </div>);
  }

  /* Hook: wraps a comment submit handler with the first-time prompt.
     onPost(text, shareToFeed) runs immediately when a remembered decision
     exists, otherwise after the member confirms in the modal.
     Returns { submit, modal } — render `modal` anywhere in the tree. */
  function useSharePrompt(onPost, opts) {
    const [pending, setPending] = React.useState(null);
    const submit = (text) => {
      const pref = readPref();
      if (pref) { onPost(text, !!pref.share); return; }
      setPending(text);
    };
    const cancel = React.useCallback(() => setPending(null), []);
    const modal = pending === null ? null :
      <Modal variant={(opts && opts.variant) || "sheet"} className={(opts && opts.className) || ""}
        onCancel={cancel}
        onConfirm={(share, remember) => {
          if (remember) writePref(share);
          onPost(pending, share);
          setPending(null);
        }} />;
    return { submit, modal, open: pending !== null };
  }

  window.PFCommentShare = { PREF_KEY, COPY, readPref, writePref, clearPref, shareToNewsfeed, Modal, Note, useSharePrompt };
})();
