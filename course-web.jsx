/* ===========================================================================
   PROfinity — Course (web)
   Reached from "Continue learning" / "Start learning" on a My Learning course
   tile (MyLearning.html) via ?course=<slug>, or generic ?title=&instr=&pct=&
   price= for tiles that don't have bespoke content. Sidebar module nav (all
   groups expanded) + video player + Overview/Resources tabs + discussion.
   Suffixed -CW to avoid clashing with the mobile CourseDetail (-CD) globals.
   =========================================================================== */
const { useState: useStateCW, useEffect: useEffectCW } = React;
const DSCW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavCW, IconifyIcon: IconCW } = DSCW;

const ME_CW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goCW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateCW(label) {
  var u = { Home: "Newsfeed.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goCW(u);
}

/* ---------------------------------------------------------------- module completion progress -- */
function progressKeyCW(slug) { return "pf-lesson-progress-" + slug; }

function loadProgressCW(slug) {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKeyCW(slug)));
    if (saved && Array.isArray(saved.completed)) return saved;
  } catch (e) {}
  return { completed: [], activeIdx: 0 };
}

function saveProgressCW(slug, data) {
  try { localStorage.setItem(progressKeyCW(slug), JSON.stringify(data)); } catch (e) {}
}

/* ---------------------------------------------------------------- shared bullets -- */
const SCREENING_BULLETS_CW = [
  "Take a comprehensive medical history (bleeding disorders, neuromuscular diseases, medications).",
  "Screen for contraindications (pregnancy, active infections, known hypersensitivities).",
  "Assess psychological readiness and set realistic expectations."
];
const UPPER_LID_BULLETS_CW = [
  "Evaluate eyelid skin laxity and excess fat.",
  "Discuss surgical options (traditional vs. minimally invasive techniques).",
  "Ensure patient understands post-operative care and recovery."
];

const DEFAULT_RESOURCES_CW = [
  { name: "Course Handbook.pdf", size: "2.3 MB", ext: "pdf" },
  { name: "Contraindications Screening Form.pdf", size: "268 KB", ext: "pdf" },
  { name: "Patient Consent Template.docx", size: "88 KB", ext: "doc" },
  { name: "Post-Treatment Care Sheet.pdf", size: "245 KB", ext: "pdf" }
];

const DEFAULT_COMMENTS_CW = [
  { name: "Sarah Jenkins", time: "2 hours ago", likes: 12,
    text: "I found the section on eye complications really informative. Does anyone have any tips for managing patient anxiety during the procedure?" },
  { name: "Dr. Michael Chen", time: "Yesterday", likes: 8,
    text: "Great module! I've been using the cognitive training tools with my patients and have seen a significant improvement in their focus during sessions." },
  { name: "Emily R.", time: "3 days ago", likes: 5,
    text: "Where can I find the downloadable course handbook mentioned in the overview? I couldn't locate it in the Resources tab." }
];

/* ---------------------------------------------------------------- course data -- */
const COURSES_WEB = {
  "8d-lips": {
    slug: "8d-lips",
    title: "8D Lips",
    videoImage: "assets/clinic-treatment-collage.png",
    aboutParas: [
      "We don't like to say this upgrade is mandatory, but we HIGHLY RECOMMEND it!",
      "If you're going to invest in mastering advanced toxin technique, you really need to learn how to manage potential eye complications so you can deliver the best results and protect your practice."
    ],
    introParas: [
      "You will see a complete list of course modules below. Simply click to start your course.",
      "You can follow the course in any order, but will need to complete all modules in order to access your certificate. Please mark each module complete as you progress. Note, video modules need to be watched in full before they can be marked complete.",
      "You can access your downloadable course handbook and a variety of extra resources in the 'Course Downloads' tab.",
      "Click the 'Groups' tab for links to your Exclusive Support Groups."
    ],
    points: 1000,
    resources: DEFAULT_RESOURCES_CW,
    comments: DEFAULT_COMMENTS_CW,
    modulesNav: [
      { group: "Modules 1", items: [
        { title: "Diagnosis", desc: "How to diagnose, treat and most of all understand how to avoid Eyelid Ptosis from Botox treatment.", bullets: SCREENING_BULLETS_CW },
        { title: "Brow Ptosis", desc: "How to Select Patients & Conduct Medical Screening", bullets: SCREENING_BULLETS_CW }
      ]},
      { group: "Modules 2", items: [
        { title: "Upper Eyelid Lift", desc: "Indications and Surgical Techniques for Upper Eyelid Lift", bullets: UPPER_LID_BULLETS_CW }
      ]},
      { group: "Modules 3", items: [
        { title: "Lower Eyelid Surgery", desc: "Approaches and Considerations for Lower Eyelid Surgery", bullets: [
          "Assess lower eyelid for signs of aging and fat herniation.",
          "Discuss risks and benefits of surgical versus non-surgical treatments.",
          "Prepare patient for realistic outcomes and duration of results."
        ]},
        { title: "Blepharospasm Treatment", desc: "Understanding Blepharospasm and Its Management", bullets: [
          "Conduct neurological assessments to confirm diagnosis.",
          "Explore treatment options including botulinum toxin injections.",
          "Educate patients on the potential for recurrent symptoms."
        ]}
      ]},
      { group: "Modules 4", items: [
        { title: "Upper Eyelid Lift", desc: "Indications and Surgical Techniques for Upper Eyelid Lift", bullets: UPPER_LID_BULLETS_CW }
      ]},
      { group: "Bonus Module", items: [
        { title: "Bonus Module – Key Concepts", desc: "", bullets: [] }
      ]},
      { group: "End of Success Path Quiz", items: [
        { title: "Botulinum Toxin Complications – End Of Course Quiz", desc: "", bullets: [], kind: "quiz" }
      ]}
    ]
  }
};

function slugifyCW(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildGenericCourseWeb(params) {
  const title = params.get("title") || "Course";
  return {
    slug: slugifyCW(title),
    title: title,
    videoImage: "assets/clinic-lip-design.png",
    aboutParas: [
      "We don't like to say this course is essential, but we HIGHLY RECOMMEND it!",
      "Mastering this technique will help you deliver safer, more predictable results and protect your practice's reputation."
    ],
    introParas: [
      "You will see a complete list of course modules below. Simply click to start your course.",
      "You can follow the course in any order, but will need to complete all modules in order to access your certificate. Please mark each module complete as you progress."
    ],
    points: 1000,
    resources: DEFAULT_RESOURCES_CW,
    comments: DEFAULT_COMMENTS_CW,
    modulesNav: [
      { group: "Modules 1", items: [
        { title: "Getting Started", desc: "Foundations you need before your first patient session.", bullets: SCREENING_BULLETS_CW }
      ]},
      { group: "End of Success Path Quiz", items: [
        { title: `${title} – End Of Course Quiz`, desc: "", bullets: [], kind: "quiz" }
      ]}
    ]
  };
}

function getCourseWeb() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("course");
  if (slug && COURSES_WEB[slug]) return COURSES_WEB[slug];
  if (params.get("title")) return buildGenericCourseWeb(params);
  return COURSES_WEB["8d-lips"];
}

function flattenModulesCW(course) {
  const flat = [];
  course.modulesNav.forEach((g, gi) => {
    g.items.forEach((it, ii) => flat.push({ ...it, groupIndex: gi, groupTitle: g.group, indexInGroup: ii }));
  });
  return flat;
}

/* ---------------------------------------------------------------- video player -- */
function CWVideo({ image }) {
  const [playing, setPlaying] = useStateCW(false);
  return (
    <div className="cw-video" style={{ backgroundImage: `url(${image})` }}>
      <div className="cw-video-center">
        <button type="button" className="cw-video-side-btn" aria-label="Rewind 10 seconds">
          <IconCW name="lucide:rotate-ccw" size={20} color="#fff" />
          <span className="cw-video-side-num">10</span>
        </button>
        <button type="button" className="cw-video-play" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
          <IconCW name={playing ? "fluent:pause-16-filled" : "fluent:play-16-filled"} size={26} color="var(--brand-navy)" />
        </button>
        <button type="button" className="cw-video-side-btn" aria-label="Forward 10 seconds">
          <IconCW name="lucide:rotate-cw" size={20} color="#fff" />
          <span className="cw-video-side-num">10</span>
        </button>
      </div>
      <div className="cw-video-bar">
        <span className="cw-video-time">10:32</span>
        <span className="cw-video-scrub"><span style={{ width: "56%" }} /></span>
        <span className="cw-video-time">8:04</span>
        <button type="button" className="cw-video-icon-btn" aria-label="Fullscreen">
          <IconCW name="lucide:maximize" size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- sidebar module cards -- */
function CWSideItem({ item, isActive, isDone, expanded, onToggleExpand, onSetActive, onComplete }) {
  const hasBody = !!item.desc || item.bullets.length > 0;
  const isQuiz = item.kind === "quiz";
  return (
    <div className="cw-item-row">
      <div className="cw-item-rail">
        <span className={"cw-item-dot " + (isActive ? "active" : isDone ? "done" : "inactive")}>
          {isQuiz ? <IconCW name="lucide:file-question" size={12} color={isDone || isActive ? "#fff" : "var(--gray-450)"} />
            : (isDone || isActive) ? <IconCW name="lucide:check" size={11} color="#fff" /> : null}
        </span>
        <span className="cw-item-rail-line" />
      </div>
      <div className={"cw-card " + (isActive ? "cw-card-active" : "")}>
        <button type="button" className="cw-card-head" onClick={() => { onSetActive(); if (hasBody) onToggleExpand(); }}>
          <span className="cw-card-title">{item.title}</span>
          {hasBody && <IconCW name={expanded ? "lucide:chevron-up" : "lucide:chevron-down"} size={16} color="var(--gray-450)" />}
        </button>
        {expanded && hasBody && (
          <div className="cw-card-body">
            {item.desc && <p className="cw-card-desc">{item.desc}</p>}
            {item.bullets.length > 0 && (
              <ul className="cw-card-bullets">
                {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
            {isActive && (
              <button type="button" className="cw-card-complete" onClick={onComplete}>
                {isDone ? "Completed" : "Mark as Complete"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CWSide({ course, activeIdx, completed, expanded, onToggleExpand, onSetActive, onComplete }) {
  const [query, setQuery] = useStateCW("");
  let flatIdx = -1;
  const q = query.trim().toLowerCase();
  return (
    <aside className="cw-side">
      <label className="cw-side-search">
        <IconCW name="lucide:search" size={16} color="var(--gray-450)" />
        <input placeholder="Search lesson…" aria-label="Search lesson" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      {course.modulesNav.map((g, i) => {
        const groupHasMatch = !q || g.items.some((it) => it.title.toLowerCase().includes(q));
        if (!groupHasMatch) { flatIdx += g.items.length; return null; }
        return (
          <div className="cw-group" key={i}>
            <div className="cw-group-title">{g.group}</div>
            {g.items.map((it, j) => {
              flatIdx += 1;
              const idx = flatIdx;
              if (q && !it.title.toLowerCase().includes(q)) return null;
              return (
                <CWSideItem item={it} key={j} isActive={idx === activeIdx} isDone={completed.has(idx)}
                  expanded={expanded.has(idx)} onToggleExpand={() => onToggleExpand(idx)}
                  onSetActive={() => onSetActive(idx)} onComplete={() => onComplete(idx)} />
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}

/* ---------------------------------------------------------------- tabs -- */
function CWTabs({ tab, setTab, resourcesCount }) {
  return (
    <div className="cw-tabs" role="tablist">
      <button type="button" role="tab" aria-selected={tab === "Overview"} className={"cw-tab" + (tab === "Overview" ? " on" : "")} onClick={() => setTab("Overview")}>Overview</button>
      <button type="button" role="tab" aria-selected={tab === "Resources"} className={"cw-tab" + (tab === "Resources" ? " on" : "")} onClick={() => setTab("Resources")}>Resources ({resourcesCount})</button>
    </div>
  );
}

function CWResourceIcon({ ext }) {
  const map = { pdf: "lucide:file-text", doc: "lucide:file-type-2", ppt: "lucide:presentation" };
  return <IconCW name={map[ext] || "lucide:file"} size={18} color="var(--brand-gold)" />;
}

function CWResources({ resources }) {
  return (
    <div className="cw-res-list">
      {resources.map((r, i) => (
        <div className="cw-res" key={i}>
          <span className="cw-res-icon"><CWResourceIcon ext={r.ext} /></span>
          <div className="cw-res-body">
            <div className="cw-res-name">{r.name}</div>
            <div className="cw-res-meta">{r.size}</div>
          </div>
          <button type="button" className="cw-res-dl" aria-label={`Download ${r.name}`}>
            <IconCW name="lucide:download" size={16} color="var(--brand-navy)" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- discussion -- */
function CWCommentReply({ r }) {
  return (
    <div className="cw-reply">
      <div className="cw-cmt-avatar small">{r.name.slice(0, 1)}</div>
      <div className="cw-cmt-body">
        <div className="cw-cmt-head"><span className="cw-cmt-name">{r.name}</span><span className="cw-cmt-time">{r.time}</span></div>
        <div className="cw-cmt-text">{r.text}</div>
      </div>
    </div>
  );
}

function CWComment({ c, onToggleLike, onReply }) {
  const [replying, setReplying] = useStateCW(false);
  const [draft, setDraft] = useStateCW("");
  function submitReply() {
    if (!draft.trim()) return;
    onReply(draft.trim());
    setDraft("");
    setReplying(false);
  }
  return (
    <div className="cw-cmt">
      <div className="cw-cmt-avatar">{c.name.slice(0, 1)}</div>
      <div className="cw-cmt-body">
        <div className="cw-cmt-head"><span className="cw-cmt-name">{c.name}</span><span className="cw-cmt-time">{c.time}</span></div>
        <div className="cw-cmt-text">{c.text}</div>
        <div className="cw-cmt-actions">
          <button type="button" className={"cw-cmt-like" + (c.liked ? " liked" : "")} onClick={onToggleLike}>
            <IconCW name={c.liked ? "fluent:thumb-like-16-filled" : "lucide:thumbs-up"} size={14} color={c.liked ? "var(--brand-navy)" : "var(--gray-450)"} />
            {c.likes}
          </button>
          <button type="button" className="cw-cmt-reply-btn" onClick={() => setReplying((r) => !r)}>Reply</button>
        </div>
        {c.replies && c.replies.length > 0 && (
          <div className="cw-cmt-replies">
            {c.replies.map((r, i) => <CWCommentReply r={r} key={i} />)}
          </div>
        )}
        {replying && (
          <div className="cw-reply-composer">
            <input placeholder={`Reply to ${c.name}…`} value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitReply()} autoFocus />
            <button type="button" onClick={submitReply}>Post</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CWDiscussion({ comments, onAdd, onToggleLike, onReply }) {
  const [draft, setDraft] = useStateCW("");
  function submit() {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  }
  return (
    <div className="cw-discussion">
      <h2 className="cw-discussion-title">Discussion</h2>
      <div className="cw-composer">
        <IconCW name="lucide:message-circle" size={18} color="var(--gray-450)" />
        <input placeholder="Ask a question or leave a comment…" value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()} />
        <button type="button" className="cw-composer-post" onClick={submit}>Post</button>
      </div>
      <div className="cw-cmt-list">
        {comments.map((c, i) => (
          <CWComment c={c} key={i}
            onToggleLike={() => onToggleLike(i)}
            onReply={(text) => onReply(i, text)} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- overview -- */
function CWOverview({ course, activeItem, moduleNumber, isDone, hasNext, onComplete, onNext }) {
  return (
    <div className="cw-ov">
      <h2 className="cw-ov-heading">Module {moduleNumber}: {activeItem.title}</h2>
      <h3 className="cw-ov-sub">About this course</h3>
      {course.aboutParas.map((p, i) => <p key={"a" + i}>{p}</p>)}
      {course.introParas.map((p, i) => <p key={"i" + i}>{p}</p>)}

      <div className="cw-ov-actions">
        <button type="button" className="cw-btn-complete" onClick={onComplete}>{isDone ? "Completed" : "Complete"}</button>
        {hasNext && <button type="button" className="cw-btn-next" onClick={onNext}>Next</button>}
      </div>

      <div className="cw-points">
        <IconCW name="lucide:award" size={20} color="var(--brand-gold)" />
        Earn up to <strong>{course.points.toLocaleString()} Points</strong> + Certification upon completion.
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- app -- */
function CourseWebApp() {
  const course = getCourseWeb();
  const flat = flattenModulesCW(course);
  const totalItems = flat.length;
  const initialProgress = loadProgressCW(course.slug);
  const [activeIdx, setActiveIdx] = useStateCW(Math.min(initialProgress.activeIdx || 0, totalItems - 1));
  const [completed, setCompleted] = useStateCW(new Set(initialProgress.completed || []));
  const [expanded, setExpanded] = useStateCW(new Set(flat.map((_, i) => i).filter((i) => flat[i].desc || flat[i].bullets.length > 0)));
  const [tab, setTab] = useStateCW("Overview");
  const [comments, setComments] = useStateCW(() => course.comments.map((c) => ({ ...c, liked: false, replies: [] })));

  useEffectCW(() => { document.title = "PROfinity — " + course.title; }, []);
  useEffectCW(() => {
    saveProgressCW(course.slug, { completed: Array.from(completed), activeIdx });
  }, [completed, activeIdx]);

  function handleComplete(idx) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }
  function handleToggleExpand(idx) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }
  function handleSetActive(idx) { setActiveIdx(idx); }
  function handleNext() { setActiveIdx((i) => Math.min(i + 1, totalItems - 1)); }

  function handleAddComment(text) {
    setComments((all) => [{ name: ME_CW.name, time: "Just now", likes: 0, liked: false, text, replies: [] }, ...all]);
  }
  function handleToggleLike(i) {
    setComments((all) => all.map((c, idx) => idx === i ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) } : c));
  }
  function handleReply(i, text) {
    setComments((all) => all.map((c, idx) => idx === i ? { ...c, replies: [...c.replies, { name: ME_CW.name, time: "Just now", text }] } : c));
  }

  const activeItem = flat[activeIdx];
  const moduleNumber = activeItem.groupIndex + 1;
  const isDone = completed.has(activeIdx);
  const hasNext = activeIdx < totalItems - 1;

  return (
    <div className="app" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavCW active="My Learning" user={ME_CW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateCW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      <div className="cw-page" data-screen-label="Course (web)">
        <div className="cw-head-row">
          <button type="button" className="cw-back" aria-label="Back" onClick={() => goCW("MyLearning.html")}>
            <IconCW name="lucide:arrow-left" size={18} color="var(--text-primary)" />
          </button>
          <h1 className="cw-title">{course.title}</h1>
        </div>
        <div className="cw-crumb">
          <a onClick={() => goCW("MyLearning.html")}>Dashboard</a> / … / {course.title}
        </div>

        <div className="cw-grid">
          <CWSide course={course} activeIdx={activeIdx} completed={completed} expanded={expanded}
            onToggleExpand={handleToggleExpand} onSetActive={handleSetActive} onComplete={handleComplete} />

          <div className="cw-main">
            <CWVideo image={course.videoImage} />
            <CWTabs tab={tab} setTab={setTab} resourcesCount={course.resources.length} />

            {tab === "Overview" ? (
              <CWOverview course={course} activeItem={activeItem} moduleNumber={moduleNumber}
                isDone={isDone} hasNext={hasNext}
                onComplete={() => handleComplete(activeIdx)} onNext={handleNext} />
            ) : (
              <CWResources resources={course.resources} />
            )}

            <div className="cw-divider" />

            <CWDiscussion comments={comments} onAdd={handleAddComment} onToggleLike={handleToggleLike} onReply={handleReply} />
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<CourseWebApp />);
