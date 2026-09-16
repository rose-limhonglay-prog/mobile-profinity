/* ===========================================================================
   PROfinity — Course (web)
   Desktop port of the mobile course reader (lesson-confidence.jsx →
   CourseDetail.html): the same course trees, monetisation, progress,
   resources, related courses, comments, Ava card and share sheet in a
   two-column desktop layout, plus the web-only strengths (breadcrumb,
   curriculum search, expand/collapse all, instructor, What's included).

   URL contract (every My Learning web page links here via PFLearn.courseUrl):
     ?course=<slug>                          bespoke tree (8d-lip-design, toxin-battle; 8d-lips is an alias)
     ?course=<slug>&title=&price=&dur=&instr= generic course built from its title
     ?title=&instr=&pct=                     legacy generic shape (no slug)
     &level=&module=&lesson=[&sub=]          pre-select a lesson (mobile shape)
     &play=1                                 open the lesson player (LessonWeb.html) straight away
     &share=1                                open the Share lesson modal

   Data + helpers come from course-data-web.js (window.PFCourseData); tier,
   purchases, completion (pf-lessons-done, shared with the phone) and URLs from
   learning-store-web.js (window.PFLearn). The lesson player is LessonWeb.html
   (lesson-web.jsx). Suffixed -CW because every page script shares one scope.
   =========================================================================== */
const { useState: useStateCW, useEffect: useEffectCW, useRef: useRefCW, useMemo: useMemoCW } = React;
const DSCW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavCW, IconifyIcon: IconCW, Avatar: AvatarCW } = DSCW;
const CD = window.PFCourseData;
const PFL = window.PFLearn;

const ME_CW = { name: CD.ME.fullName, role: CD.ME.role, avatar: CD.ME.avatar };
const CW_PARAMS = new URLSearchParams(window.location.search);

function goCW(url) { CD.go(url); }
/* Member → profile links (profile-link.js); inert pass-through if the script is absent. */
const ProfileLinkCW = (window.PFProfileLink && window.PFProfileLink.Link) || function ({ children }) { return children; };
function openProfileCW(a) { return !!(window.PFProfileLink && window.PFProfileLink.open(a)); }
function navigateCW(label) {
  const u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": PFL.myLearningUrl, Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goCW(u);
}

/* gold ink for DS icons — AA-safe on the light page, raw gold in dark mode */
const INK_CW = { gold: "var(--cd-gold)", text: "var(--cd-text)", muted: "var(--cd-text-3)", success: "var(--cd-success)", onNavy: "#FFFFFF", onGold: "var(--cd-on-gold)", heading: "var(--cd-heading)" };

const CW_COURSE = CD.resolveCourse(CW_PARAMS);

/* "2:10" + "6:48" … → "1h 40m" for the meta row when the URL carries no ?dur= */
function totalDurationCW(flat) {
  let secs = 0;
  flat.forEach((l) => { const m = /^(\d+):(\d\d)$/.exec(l.dur || ""); if (m) secs += Number(m[1]) * 60 + Number(m[2]); });
  if (!secs) return null;
  const mins = Math.round(secs / 60);
  return mins >= 60 ? Math.floor(mins / 60) + "h " + (mins % 60 ? (mins % 60) + "m" : "") : mins + "m";
}

/* ---------------------------------------------------------------- crumb -- */
function CWCrumb({ course }) {
  return (
    <div className="cw-crumb-row">
      <button type="button" className="cw-back-btn" aria-label="Back to My Learning" onClick={() => goCW(PFL.myLearningUrl)}>
        <IconCW name="lucide:arrow-left" size={19} color={INK_CW.heading} />
      </button>
      <span className="cw-crumb">
        <a onClick={() => goCW(PFL.myLearningUrl)}>My Learning</a> &nbsp;/&nbsp; <span>{course.title}</span>
      </span>
    </div>);
}

/* ---------------------------------------------------------------- hero -- */
function CWHero({ course, item, content, locked, started, curDone, next, onOpen, onContinue, onShare, onBuy, total }) {
  const fill = Math.round(item.groupPos / item.groupTotal * 100);
  const kindIcon = item.kind === "pdf" ? "lucide:file-text" : item.kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled";
  const continueLabel = !next ? (curDone ? "Course complete" : "Finish course") : started ? "Continue learning" : "Start learning";
  return (
    <section className="cw-card cw-hero-card" data-screen-label="Hero">
      <button type="button" className={"cw-still" + (locked ? " locked" : "")} onClick={onOpen}
        aria-label={locked ? "Buy this course to play " + item.name : (item.kind === "pdf" ? "Open " : item.kind === "quiz" ? "Start " : "Play ") + item.name}>
        <img src={course.still} alt="" />
        {/* no play button on a locked course — the image is browse-only */}
        {!locked && <span className={"cw-still-play" + (item.kind ? " doc" : "")} aria-hidden="true"><IconCW name={kindIcon} size={26} color="#0B1024" /></span>}
        <span className="cw-still-dur" aria-hidden="true"><IconCW name={item.kind === "pdf" ? "lucide:file-text" : "lucide:clock"} size={12} color="#fff" />{item.dur}</span>
        {locked && <span className="cw-still-lock" aria-hidden="true"><IconCW name="lucide:lock" size={14} color="#fff" />Paid course · £{course.price}</span>}
      </button>
      <div className="cw-hero-body">
        <span className="cd-eyebrow">{CD.eyebrow(item, course)}</span>
        <h1 className="cw-title">{item.name}</h1>
        {/* no lesson progress on a paid course that hasn't been bought yet */}
        {!locked && <>
          <div className="cw-prog-row">
            <span className="cw-prog-label">Lesson progress</span>
            <span className="cw-prog-count">{item.groupPos} of {item.groupTotal}</span>
          </div>
          <div className="cd-track" role="progressbar" aria-valuemin={0} aria-valuemax={item.groupTotal} aria-valuenow={item.groupPos} aria-label="Lesson progress"><span style={{ width: fill + "%" }} /></div>
        </>}
        <p className="cw-intro">{content.intro}</p>
        {locked ?
          <CWPaywall course={course} total={total} onBuy={onBuy} /> :
          <div className="cw-ctas" data-screen-label="CTAs">
            <button type="button" className="cd-btn cd-btn-fill" onClick={onContinue} disabled={!next && curDone}>
              {continueLabel}<IconCW name="lucide:arrow-right" size={17} color={INK_CW.onNavy} />
            </button>
            <button type="button" className="cd-btn cd-btn-outline" onClick={onShare}>
              <IconCW name="lucide:share-2" size={17} color={INK_CW.heading} />Share lesson
            </button>
          </div>}
      </div>
    </section>);
}

/* Shown on a paid course that hasn't been bought: what's inside, the price, and the one way in. */
function CWPaywall({ course, total, onBuy }) {
  return (
    <section className="cd-paywall" data-screen-label="Paid course">
      <span className="cd-paywall-ic"><IconCW name="lucide:lock" size={20} color={INK_CW.gold} /></span>
      <div className="cd-paywall-tx">
        <span className="cd-eyebrow">Paid course</span>
        <h3 className="cd-paywall-title">Buy to start this course</h3>
        <p className="cd-paywall-body">Browse every level, module and lesson below. Buy the course to start the lessons, download the resources and take the success path quiz.</p>
        <ul className="cd-paywall-list">
          <li><IconCW name="lucide:check" size={14} color={INK_CW.gold} strokeWidth={2.5} />{total} lessons across {course.levels.filter((l) => !l.quiz).length} levels</li>
          <li><IconCW name="lucide:check" size={14} color={INK_CW.gold} strokeWidth={2.5} />One-time payment · lifetime access</li>
          <li><IconCW name="lucide:check" size={14} color={INK_CW.gold} strokeWidth={2.5} />Certificate on completion</li>
        </ul>
        <div className="cd-paywall-row">
          <span className="cd-paywall-price"><small>One-time</small>£{course.price}</span>
          <button type="button" className="cd-btn cd-btn-gold" onClick={onBuy}>
            <IconCW name="lucide:shopping-bag" size={16} color={INK_CW.onGold} />Buy course
          </button>
        </div>
      </div>
    </section>);
}

/* ---------------------------------------------------------------- In this lesson -- */
function CWInThisLesson({ content }) {
  return (
    <section className="cw-card cw-pad" data-screen-label="In this lesson">
      <div className="cd-sec"><h2>In this lesson</h2></div>
      <p className="cd-body">{content.body}</p>
      <ul className="cd-points">
        {content.points.map((p, i) =>
          <li className="cd-point" key={i}>
            <span className="tick"><IconCW name="lucide:check" size={14} color={INK_CW.gold} strokeWidth={2.5} /></span>
            <span>{p}</span>
          </li>)}
      </ul>
    </section>);
}

/* ---------------------------------------------------------------- course content -- */
function CWMarker({ done, kind, locked }) {
  if (done) return <span className="cd-marker done"><IconCW name="lucide:check" size={15} color={INK_CW.success} strokeWidth={2.5} /></span>;
  if (locked) return <span className="cd-marker lock"><IconCW name="lucide:lock" size={13} color={INK_CW.muted} /></span>;
  const icon = kind === "pdf" ? "lucide:file-text" : kind === "quiz" ? "lucide:list-checks" : "fluent:play-16-filled";
  return <span className="cd-marker"><IconCW name={icon} size={13} color={INK_CW.gold} /></span>;
}

function CWLessonRow({ lesson, done, current, locked, onSelect, onOpen }) {
  return (
    <button type="button" className={"cd-lesson" + (done ? " done" : "") + (current ? " on" : "") + (locked ? " locked" : "")}
      aria-current={current ? "true" : undefined} onClick={onSelect} title={locked ? "Buy this course to start its lessons" : "Select lesson"}>
      <CWMarker done={done} kind={lesson.kind} locked={locked && !done} />
      <span className="cd-lesson-name">{lesson.name}</span>
      <span className="cd-lesson-dur">{lesson.dur}</span>
      {!locked &&
        <span className="cd-lesson-open" role="button" aria-label={"Open " + lesson.name} title="Open lesson"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}>
          <IconCW name="lucide:arrow-up-right" size={16} color={INK_CW.gold} />
        </span>}
    </button>);
}

function CWSubModule({ sub, done, currentName, locked, forceOpen, onSelect, onOpen }) {
  const [open, setOpen] = useStateCW(!!sub.open);
  const isOpen = forceOpen || open;
  return (
    <div className="cd-sub">
      <button type="button" className="cd-sub-hd" aria-expanded={isOpen} onClick={() => setOpen((o) => !o)}>
        <IconCW name={isOpen ? "lucide:folder-open" : "lucide:folder"} size={19} color={INK_CW.gold} />
        <span className="cd-sub-name">{sub.name}</span>
        <span className="cd-sub-n">{sub.lessons.length}</span>
        <IconCW name={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"} size={18} color={INK_CW.muted} />
      </button>
      {isOpen &&
        <div className="cd-sub-body">
          {sub.lessons.map((l) =>
            <CWLessonRow key={l.name} lesson={l} done={done.indexOf(l.name) !== -1} current={currentName === l.name} locked={locked}
              onSelect={() => onSelect(l.name)} onOpen={() => onOpen(l.name)} />)}
        </div>}
    </div>);
}

function CWSection({ section, done, currentName, locked, forceOpen, onSelect, onOpen }) {
  return (
    <div className="cd-section">
      <div className="cd-section-head">
        <span className="cd-section-name">{section.name}</span>
        {section.free && !locked && <span className="cd-tag">Free</span>}
        {locked && <span className="cd-tag paid">Paid</span>}
      </div>
      <p className="cd-section-desc">{section.desc}</p>
      {section.bullets && section.bullets.length > 0 && <ul className="cd-bullets">{section.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
      {section.lessons && section.lessons.length > 0 &&
        <div className="cd-lessons">
          {section.lessons.map((l) =>
            <CWLessonRow key={l.name} lesson={l} done={done.indexOf(l.name) !== -1} current={currentName === l.name} locked={locked}
              onSelect={() => onSelect(l.name)} onOpen={() => onOpen(l.name)} />)}
        </div>}
      {(section.subs || []).map((s) => <CWSubModule key={s.name} sub={s} done={done} currentName={currentName} locked={locked} forceOpen={forceOpen} onSelect={onSelect} onOpen={onOpen} />)}
    </div>);
}

function CWLevel({ level, fullLevel, open, onToggle, done, currentName, locked, forceOpen, onSelect, onOpen }) {
  const pct = CD.pct(CD.levelLessonNames(fullLevel), done);
  const empty = !level.sections || level.sections.length === 0;
  const isOpen = forceOpen || open;
  return (
    <div className="cd-level">
      <button type="button" className="cd-level-hd" aria-expanded={isOpen} onClick={onToggle}>
        <span className="cd-level-name">
          {!level.quiz && level.name && <small>{level.title}</small>}
          {level.quiz || !level.name ? level.title : level.name}
        </span>
        <span className="cd-level-pct">{pct}%</span>
        <IconCW name={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"} size={20} color="#FFFFFF" />
      </button>
      {isOpen && (empty ?
        <div className="cd-unlock">
          <span className="ic"><IconCW name="lucide:lock" size={16} color={INK_CW.muted} /></span>
          <span>{level.unlock || "Unlocks when you complete the previous level."}</span>
        </div> :
        <div className="cd-level-body">
          {level.sections.map((s) => <CWSection key={s.name} section={s} done={done} currentName={currentName} locked={locked} forceOpen={forceOpen} onSelect={onSelect} onOpen={onOpen} />)}
        </div>)}
    </div>);
}

/* Search filter: keep levels / sections / sub-modules that hold a matching
   lesson (or match by name themselves); locked "Unlocks when…" levels drop out. */
function filterCourseCW(course, q) {
  const hit = (s) => (s || "").toLowerCase().includes(q);
  const levels = course.levels.map((lvl) => {
    const sections = (lvl.sections || []).map((sec) => {
      const secHit = hit(sec.name);
      const lessons = sec.lessons.filter((l) => secHit || hit(l.name));
      const subs = (sec.subs || []).map((sub) => {
        const subHit = secHit || hit(sub.name);
        return { ...sub, lessons: sub.lessons.filter((l) => subHit || hit(l.name)) };
      }).filter((sub) => sub.lessons.length);
      return lessons.length || subs.length ? { ...sec, lessons, subs } : null;
    }).filter(Boolean);
    return sections.length || (hit(lvl.name) || hit(lvl.title)) && (lvl.sections || []).length ? { ...lvl, sections: sections.length ? sections : lvl.sections } : null;
  }).filter(Boolean);
  return { ...course, levels };
}

function CWCourseContent({ course, flat, done, currentName, locked, onSelect, onOpen }) {
  const [query, setQuery] = useStateCW("");
  const [openSet, setOpenSet] = useStateCW(() => new Set(course.levels.map((l, i) => l.open ? i : -1).filter((i) => i !== -1)));
  const q = query.trim().toLowerCase();
  const view = q ? filterCourseCW(course, q) : course;
  const doneCount = done.filter((n) => flat.some((l) => l.name === n)).length;
  const total = flat.length;
  const allOpen = openSet.size === course.levels.length;
  const toggle = (i) => setOpenSet((prev) => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const expandAll = () => setOpenSet(allOpen ? new Set() : new Set(course.levels.map((_, i) => i)));
  return (
    <section className="cw-card cw-pad" data-screen-label="Course content">
      <div className="cw-curr-head">
        <div className="cd-sec" style={{ margin: 0, flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
          <h2>Course content</h2>
          <span className="sub">{locked ? total + " lessons · buy to start" : doneCount + " of " + total + " completed"}</span>
        </div>
        <div className="cw-curr-tools">
          <label className="cw-search">
            <IconCW name="lucide:search" size={17} color={INK_CW.muted} />
            <input placeholder="Search lessons…" aria-label="Search lessons" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <button type="button" className="cw-expand-all" onClick={expandAll}>{allOpen ? "Collapse all" : "Expand all"}</button>
        </div>
      </div>
      <div className="cd-levels">
        {view.levels.length === 0 && <div className="cw-no-results">No lessons match "{query}".</div>}
        {view.levels.map((lvl) => {
          const i = course.levels.indexOf(course.levels.find((x) => x.title === lvl.title));
          return <CWLevel key={lvl.title} level={lvl} fullLevel={course.levels[i]} open={openSet.has(i)} onToggle={() => toggle(i)} forceOpen={!!q}
            done={done} currentName={currentName} locked={locked} onSelect={onSelect} onOpen={onOpen} />;
        })}
      </div>
    </section>);
}

/* ---------------------------------------------------------------- resources / related / instructor -- */
function CWResources({ onToast, locked, onLocked }) {
  return (
    <section className="cw-card cw-pad" data-screen-label="Resources">
      <div className="cd-sec"><h2>Resources</h2><span className="sub">{CD.RESOURCES.length} downloads</span></div>
      <div className="cd-res-list">
        {CD.RESOURCES.map((r) =>
          <button type="button" className="cd-res" key={r.name} onClick={() => locked ? onLocked() : onToast("Downloading " + r.name)}>
            <span className="cd-res-ic"><IconCW name="lucide:file-text" size={20} color={INK_CW.gold} /></span>
            <span className="cd-res-tx">
              <span className="cd-res-name">{r.name}</span>
              <span className="cd-res-meta">PDF · {r.size}</span>
            </span>
            <span className="cd-res-dl"><IconCW name={locked ? "lucide:lock" : "lucide:download"} size={16} color={locked ? INK_CW.muted : INK_CW.text} /></span>
          </button>)}
      </div>
    </section>);
}

function CWRelated({ course }) {
  const related = CD.RELATED.filter((c) => PFL.slugify(c.title) !== course.slug);
  if (!related.length) return null;
  return (
    <section className="cw-card cw-pad" data-screen-label="Related courses">
      <div className="cd-sec"><h2>Related courses</h2></div>
      <div className="cd-related">
        {related.map((c) => {
          const included = PFL.included(PFL.slugify(c.title));
          const price = included ? 0 : c.price;
          return (
            <button type="button" className="cd-course" key={c.title} onClick={() => goCW(CD.relatedUrl(c, price))}>
              <span className="cd-course-thumb"><img src={c.image} alt="" /><span className="cd-course-chip">{c.lessons} lessons</span></span>
              <span className="cd-course-tx">
                <span className="cd-course-eyebrow">{included ? "Included in your membership" : price ? "Paid course" : "Course"}</span>
                <span className="cd-course-title">{c.title}</span>
                {price > 0 && <span className="cd-course-price"><IconCW name="lucide:lock" size={11} color={INK_CW.gold} />£{price}</span>}
              </span>
              <span className="cd-course-arrow" aria-hidden="true"><IconCW name="lucide:arrow-right" size={18} color={INK_CW.onGold} /></span>
            </button>);
        })}
      </div>
    </section>);
}

function CWInstructor() {
  const t = CD.INSTRUCTOR;
  return (
    <section className="cw-card cw-pad cw-instructor" data-screen-label="Instructor">
      <div className="cd-sec"><h2>Your instructor</h2></div>
      <div className="cw-instructor-row">
        <img src={t.avatar} alt={t.name} />
        <div>
          <div className="cw-instructor-name">{t.name}</div>
          <div className="cw-instructor-role">{t.role}</div>
          <div className="cw-instructor-bio">{t.bio}</div>
        </div>
      </div>
    </section>);
}

/* ---------------------------------------------------------------- comments -- */
/* Render "@Name" mentions in comment text in gold. */
function CWCommentText({ text }) {
  const parts = text.split(/(@[A-Za-z.]+(?: [A-Z][A-Za-z.]+)?)/g);
  return <p className="cd-cmt-text">{parts.map((p, i) => p.charAt(0) === "@" ? <span key={i} className="cd-cmt-mention">{p}</span> : p)}</p>;
}

function CWComment({ c, onLike, onReply }) {
  return (
    <div className="cd-cmt">
      <ProfileLinkCW author={c.author} className="pf-prof-av"><AvatarCW name={c.author.name} src={c.author.avatar} size={38} /></ProfileLinkCW>
      <div className="cd-cmt-main">
        <div className="cd-cmt-meta"><span className="cd-cmt-name"><ProfileLinkCW author={c.author} className="pf-prof-nm">{c.author.name}</ProfileLinkCW></span><span className="cd-cmt-time">{c.time}</span></div>
        <CWCommentText text={c.text} />
        <div className="cd-cmt-actions">
          <button type="button" className={"cd-cmt-act" + (c.liked ? " on" : "")} aria-pressed={!!c.liked} onClick={onLike}>
            <IconCW name="lucide:heart" size={15} color={c.liked ? INK_CW.gold : INK_CW.muted} />Like{c.likes ? ` · ${c.likes}` : ""}
          </button>
          <button type="button" className="cd-cmt-act" onClick={onReply}><IconCW name="lucide:message-circle" size={15} color={INK_CW.muted} />Reply</button>
        </div>
      </div>
    </div>);
}

let _cwseq = 0;
function CWComments({ lessonName, courseSlug }) {
  const [comments, setComments] = useStateCW(() => CD.DEFAULT_COMMENTS.map((c) => ({ ...c, _id: "cw" + _cwseq++ })));
  const [draft, setDraft] = useStateCW("");
  const inputRef = useRefCW(null);
  const me = { name: CD.ME.name, avatar: CD.ME.avatar };
  /* First comment asks "Share this comment?" (shared prompt, window.PFCommentShare);
     after "Remember my decision" the saved choice is applied silently. */
  const prompt = window.PFCommentShare.useSharePrompt((text, share) => {
    setComments((all) => [{ author: me, time: "Just now", text, likes: 0, liked: false, sharedToNewsfeed: share, _id: "cw" + _cwseq++ }, ...all]);
    if (share) window.PFCommentShare.shareToNewsfeed({ author: me, courseSlug, text });
  }, { variant: "dialog" });
  const like = (id) => setComments((all) => all.map((c) => c._id === id ? { ...c, liked: !c.liked, likes: (c.likes || 0) + (c.liked ? -1 : 1) } : c));
  const reply = (c) => {
    setDraft("@" + c.author.name + " ");
    if (inputRef.current) { inputRef.current.focus(); inputRef.current.scrollIntoView({ block: "center", behavior: "smooth" }); }
  };
  const post = () => { const text = draft.trim(); if (!text) return; setDraft(""); prompt.submit(text); };
  return (
    <section className="cw-card cw-pad" data-screen-label="Comments">
      <div className="cd-sec"><h2>{comments.length} Comment{comments.length === 1 ? "" : "s"}</h2></div>
      <form className="cd-composer" onSubmit={(e) => { e.preventDefault(); post(); }}>
        <AvatarCW name={CD.ME.name} src={CD.ME.avatar} size={34} />
        <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={"Comment on " + lessonName + "…"} aria-label="Write a comment" />
        <button type="submit" className="cd-send" aria-label="Post comment" disabled={!draft.trim()}><IconCW name="lucide:send" size={17} color={INK_CW.onNavy} /></button>
      </form>
      <window.PFCommentShare.Note className="cd-composer-note" />
      <div className="cd-cmts">{comments.map((c) => <CWComment key={c._id} c={c} onLike={() => like(c._id)} onReply={() => reply(c)} />)}</div>
      {prompt.modal}
    </section>);
}

/* ---------------------------------------------------------------- Ava -- */
function CWAvaCard({ lessonName, courseTitle }) {
  return (
    <section className="cd-ava stack" data-screen-label="Talk this through with Ava">
      <span className="orb"><IconCW name="lucide:sparkles" size={22} color="#fff" /></span>
      <div className="tx">
        <div className="ti">Talk this through with Ava</div>
        <div className="su">Stuck on a landmark or unsure how this applies to your patients? Ava knows where you are in the course.</div>
        <button type="button" className="pf-coach-link" data-coach={`I'm on the lesson "${lessonName}" in ${courseTitle}. Quiz me on the key points and tell me what to practise next.`}>
          <IconCW name="lucide:sparkles" size={14} color="#fff" />Ask Ava
        </button>
      </div>
    </section>);
}

/* ---------------------------------------------------------------- share modal -- */
function CWShareModal({ item, course, url, onClose, onDone }) {
  useEffectCW(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const title = item.name + " · " + course.title;
  const shareNative = () => {
    if (navigator.share) { navigator.share({ title, text: "Take a look at this lesson on PROfinity", url }).catch(() => {}); onDone(""); return; }
    CD.copyText(url); onDone("Lesson link copied");
  };
  const tiles = [
    { k: "copy", label: "Copy link", icon: "lucide:link", run: () => { CD.copyText(url); onDone("Lesson link copied"); } },
    { k: "feed", label: "Newsfeed", icon: "lucide:newspaper", run: () => onDone("Shared to your newsfeed") },
    { k: "dm", label: "Messages", icon: "lucide:message-circle", run: () => goCW("Messages.html") },
    { k: "more", label: "More", icon: "lucide:more-horizontal", run: shareNative }];
  return (
    <div className="cd-share" role="dialog" aria-modal="true" aria-label="Share lesson" data-screen-label="Share lesson">
      <button type="button" className="cd-share-scrim" aria-label="Close" onClick={onClose} />
      <div className="cd-share-card">
        <div className="cd-share-hd">
          <h3>Share lesson</h3>
          <button type="button" className="cd-share-x" aria-label="Close" onClick={onClose}><IconCW name="lucide:x" size={18} color={INK_CW.text} /></button>
        </div>
        <div className="cd-share-prev">
          <img src={course.still} alt="" />
          <div className="cd-share-prev-tx">
            <span className="cd-share-prev-eyebrow">{CD.eyebrow(item, course)}</span>
            <span className="cd-share-prev-name">{item.name}</span>
            <span className="cd-share-prev-course">{course.title}</span>
          </div>
        </div>
        <div className="cd-share-sec">Send in Messages</div>
        <div className="cd-share-rail">
          {CD.SHARE_CONTACTS.map((c) =>
            <button type="button" className="cd-share-person" key={c.id} onClick={() => onDone("Lesson sent to " + c.name)}>
              <AvatarCW name={c.name} src={c.avatar} size={52} /><span>{c.name}</span>
            </button>)}
        </div>
        <div className="cd-share-sec">Share to</div>
        <div className="cd-share-tiles">
          {tiles.map((t) =>
            <button type="button" className="cd-share-tile" key={t.k} onClick={t.run}>
              <span className="cd-share-tile-ic"><IconCW name={t.icon} size={22} color={INK_CW.text} /></span><span>{t.label}</span>
            </button>)}
        </div>
        <div className="cd-share-link">
          <code>{url}</code>
          <button type="button" className="cd-btn cd-btn-fill" onClick={() => { CD.copyText(url); onDone("Lesson link copied"); }}>Copy</button>
        </div>
      </div>
    </div>);
}

/* ---------------------------------------------------------------- sidebar -- */
function CWSide({ course, flat, done, locked, purchased, started, curDone, next, onContinue, onBuy, item }) {
  const total = flat.length;
  const doneCount = flat.filter((l) => done.indexOf(l.name) !== -1).length;
  const pct = total ? Math.round(doneCount / total * 100) : 0;
  const included = PFL.included(course.slug);
  const levels = course.levels.filter((l) => !l.quiz).length;
  const continueLabel = !next ? (curDone ? "Course complete" : "Finish course") : started ? "Continue learning" : "Start learning";
  const access = locked ? { icon: "lucide:lock", text: "Paid course · £" + course.price, cls: " paid" } :
    included ? { icon: "fluent:shield-checkmark-16-filled", text: "Included in your membership", cls: "" } :
    purchased ? { icon: "lucide:badge-check", text: "Purchased · lifetime access", cls: "" } :
    { icon: "fluent:shield-checkmark-16-filled", text: "Free access", cls: "" };
  const meta = [
    { icon: "lucide:clock", key: "Duration", value: course.dur || totalDurationCW(flat) || "—" },
    { icon: "lucide:layers", key: "Levels", value: levels + " levels" },
    { icon: "lucide:play-circle", key: "Lessons", value: total + " lessons" },
    { icon: "lucide:award", key: "Certificate", value: "Included" }];
  return (
    <aside className="cw-side">
      <div className="cw-side-card" data-screen-label="Course card">
        <div className="cw-side-thumb"><img src={course.still} alt="" /></div>
        <div className="cw-side-body">
          <div className={"cw-access" + access.cls}><IconCW name={access.icon} size={20} color={locked ? INK_CW.gold : INK_CW.heading} />{access.text}</div>
          {!locked && <>
            <div className="cw-progress">
              <div className="cw-prog-row"><span className="cw-prog-label">Course progress</span><span className="cw-prog-count">{doneCount} of {total}</span></div>
              <div className="cd-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Course progress"><span style={{ width: pct + "%" }} /></div>
              <span className="cw-progress-label">{pct}% complete</span>
            </div>
            <button type="button" className="cd-btn cd-btn-fill cw-continue" onClick={onContinue} disabled={!next && curDone}>
              <IconCW name="fluent:play-16-filled" size={16} color={INK_CW.onNavy} />{continueLabel}
            </button>
          </>}
          {locked &&
            <button type="button" className="cd-btn cd-btn-gold cw-continue" onClick={onBuy}>
              <IconCW name="lucide:shopping-bag" size={16} color={INK_CW.onGold} />Buy course · £{course.price}
            </button>}
          <div className="cw-meta-grid">
            {meta.map((m) =>
              <div className="cw-meta-item" key={m.key}>
                <span className="cw-meta-key"><IconCW name={m.icon} size={15} color={INK_CW.heading} />{m.key}</span>
                <span className="cw-meta-val">{m.value}</span>
              </div>)}
          </div>
          <div className="cw-included">
            <div className="cw-included-h">What's included</div>
            {CD.INCLUDED.map((it) => <div className="cw-included-row" key={it.text}><IconCW name={it.icon} size={19} color={INK_CW.heading} />{it.text}</div>)}
          </div>
        </div>
      </div>
      <CWAvaCard lessonName={item.name} courseTitle={course.title} />
    </aside>);
}

/* ---------------------------------------------------------------- app -- */
function CourseWebApp() {
  const course = CW_COURSE;
  const flat = useMemoCW(() => CD.flatten(course), []);
  const [done, markDone] = PFL.useLessonsDone();
  const purchased = PFL.usePurchased();
  const isPurchased = purchased.indexOf(course.slug) !== -1;
  /* paid course, not bought yet: browse only — nothing plays until checkout */
  const locked = course.price > 0 && !isPurchased;

  /* current lesson = URL position → web resume pointer → first not-yet-completed → first */
  const [curIdx, setCurIdx] = useStateCW(() => {
    const fromUrl = CD.lessonIdxFromParams(flat, CW_PARAMS);
    if (fromUrl != null) return fromUrl;
    const saved = PFL.readProgress(course.slug);
    const doneNow = PFL.readDone();
    if (typeof saved.activeIdx === "number" && flat[saved.activeIdx] && doneNow.indexOf(flat[saved.activeIdx].name) === -1) return saved.activeIdx;
    const i = flat.findIndex((l) => doneNow.indexOf(l.name) === -1);
    return i === -1 ? 0 : i;
  });
  const cur = flat[curIdx];
  const content = CD.genericContent(cur);
  const curDone = done.indexOf(cur.name) !== -1;
  const next = flat[curIdx + 1] || null;
  const started = curIdx > 0 || flat.some((l) => done.indexOf(l.name) !== -1);

  const [toast, setToast] = useStateCW(null);
  const toastTimer = useRefCW(null);
  const showToast = (msg) => { setToast(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2200); };

  useEffectCW(() => { document.title = "PROfinity — My Learning · " + course.title; }, []);
  /* web resume pointer (completed = flat indices of the shared name-keyed store) */
  useEffectCW(() => {
    PFL.writeProgress(course.slug, { completed: flat.map((l, i) => done.indexOf(l.name) !== -1 ? i : -1).filter((i) => i !== -1), activeIdx: curIdx });
  }, [curIdx, done]);
  /* keep the URL on the selected lesson so refresh / share keep the place */
  const syncUrl = (i) => {
    try {
      const u = new URL(window.location.href);
      const it = flat[i];
      /* rebuilt so the query reads course → title/price/dur → position */
      const rest = new URLSearchParams(u.search);
      ["course", "level", "module", "lesson", "sub", "share", "play"].forEach((k) => rest.delete(k));
      const q = new URLSearchParams({ course: course.slug });
      rest.forEach((v, k) => q.set(k, v));
      q.set("level", it.li); q.set("module", it.si); q.set("lesson", it.ni);
      if (it.subIdx != null) q.set("sub", it.subIdx);
      u.search = q.toString();
      history.replaceState(history.state, "", u);
    } catch (e) {}
  };
  /* ?play=1 (LearningMobile / MyLearning deep links) — the player is its own page on the web */
  useEffectCW(() => {
    if (CW_PARAMS.get("play") === "1" && !PFL.locked(course.slug, CW_PARAMS.get("price"))) goCW(CD.lessonUrl(course, cur));
    else syncUrl(curIdx);
  }, []);

  const buyCourse = () => goCW(CD.checkoutUrl(course));
  const nudgeBuy = () => showToast("Buy this course to start its lessons");
  const openLesson = (i) => { if (locked) { nudgeBuy(); return; } goCW(CD.lessonUrl(course, flat[i])); };
  const selectLesson = (name) => {
    const i = flat.findIndex((l) => l.name === name);
    if (i === -1) return;
    if (flat[i].kind === "pdf" && !locked) { openLesson(i); return; }
    setCurIdx(i); syncUrl(i);
    if (locked) nudgeBuy();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openByName = (name) => { const i = flat.findIndex((l) => l.name === name); if (i !== -1) openLesson(i); };
  /* Continue — open the player on the current lesson (or the next one when the current is already ticked) */
  const continueLesson = () => { if (!next && curDone) return; openLesson(curDone && next ? curIdx + 1 : curIdx); };

  /* Share lesson — ?share=1 opens it on load for design review */
  const [shareOpen, setShareOpen] = useStateCW(() => CW_PARAMS.get("share") === "1");
  const shareUrl = (() => { try { const u = new URL(CD.lessonUrl(course, cur), window.location.href); return u.href; } catch (e) { return window.location.href; } })();
  const shareDone = (msg) => { setShareOpen(false); if (msg) showToast(msg); };

  return (
    <div className="app wa-screen cd-root" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavCW active="My Learning" user={ME_CW} logoSrc="assets/profinity-icon-purple-gold.png" onNavigate={navigateCW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="cw-page" data-screen-label={"Course (web) · " + (locked ? "locked" : "unlocked")}>
        <CWCrumb course={course} />
        <div className="cw-grid">
          <div className="cw-main">
            <CWHero course={course} item={cur} content={content} locked={locked} started={started} curDone={curDone} next={next} total={flat.length}
              onOpen={() => openLesson(curIdx)} onContinue={continueLesson} onShare={() => setShareOpen(true)} onBuy={buyCourse} />
            <CWInThisLesson content={content} />
            <CWCourseContent course={course} flat={flat} done={done} currentName={cur.name} locked={locked} onSelect={selectLesson} onOpen={openByName} />
            <CWResources onToast={showToast} locked={locked} onLocked={nudgeBuy} />
            <CWRelated course={course} />
            <CWInstructor />
            <CWComments lessonName={cur.name} courseSlug={course.slug} />
          </div>
          <CWSide course={course} flat={flat} done={done} locked={locked} purchased={isPurchased} started={started} curDone={curDone} next={next}
            onContinue={continueLesson} onBuy={buyCourse} item={cur} />
        </div>
      </div>

      {shareOpen && <CWShareModal item={cur} course={course} url={shareUrl} onClose={() => setShareOpen(false)} onDone={shareDone} />}
      {toast && <div className="cd-toast" role="status">{toast}</div>}
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CourseWebApp />);
