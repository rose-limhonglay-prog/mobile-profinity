/* ===========================================================================
   PROfinity — Lesson (web)
   Full video-player lesson view reached from a curriculum row or "Continue
   Learning" on CourseWeb.html via ?course=<slug>&lesson=<flatIdx> (or generic
   ?title=&lesson=). Video with theater mode, Overview (numbered steps +
   comments) / Resources tabs, sticky Previous/Mark-complete/Next footer
   (Next is gated until the lesson is marked complete), and a collapsible
   Course outline + Ask Ava sidebar. Shares its localStorage progress key with
   course-web.jsx so completion stays in sync between the two pages. This is
   the desktop counterpart of the mobile lesson.jsx/lesson.css (iPhone-framed)
   pair — kept as a separate file/route since that page is reached from a
   completely different mobile flow (CourseDetail.html → Module.html →
   SubModule.html → Lesson.html) with its own data model. Suffixed -LW to
   avoid clashing with other page globals (including the mobile lesson.jsx's
   own -LS suffix).
   =========================================================================== */
const { useState: useStateLW, useEffect: useEffectLW, useRef: useRefLW } = React;
const DSLW = window.ProfinityDesignSystem_c2b5cc;
const { TopNav: TopNavLW, IconifyIcon: IconLW, Spark: SparkLW } = DSLW;

const ME_LW = { name: "Katy Wilson", role: "Nurse Practitioner", avatar: "assets/avatar-katy.jpg" };

function goLW(url) { (window.pfGo || function (u) { window.location.href = u; })(url); }
function navigateLW(label) {
  var u = { Home: "Newsfeed.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
  if (u) goLW(u);
}

/* ---------------------------------------------------------------- shared progress (same key as course-web.jsx) -- */
function progressKeyLW(slug) { return "pf-lesson-progress-" + slug; }
function loadProgressLW(slug) {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKeyLW(slug)));
    if (saved && Array.isArray(saved.completed)) return saved;
  } catch (e) {}
  return { completed: [], activeIdx: 0 };
}
function saveProgressLW(slug, data) {
  try { localStorage.setItem(progressKeyLW(slug), JSON.stringify(data)); } catch (e) {}
}

/* ---------------------------------------------------------------- shared bullets (mirrors course-web.jsx) -- */
const SCREENING_BULLETS_LW = [
  "Take a comprehensive medical history (bleeding disorders, neuromuscular diseases, medications).",
  "Screen for contraindications (pregnancy, active infections, known hypersensitivities).",
  "Assess psychological readiness and set realistic expectations."
];
const UPPER_LID_BULLETS_LW = [
  "Evaluate eyelid skin laxity and excess fat.",
  "Discuss surgical options (traditional vs. minimally invasive techniques).",
  "Ensure patient understands post-operative care and recovery."
];

const DEFAULT_RESOURCES_LW = [
  { name: "Course Handbook.pdf", size: "2.3 MB", ext: "pdf" },
  { name: "Contraindications Screening Form.pdf", size: "268 KB", ext: "pdf" },
  { name: "Patient Consent Template.docx", size: "88 KB", ext: "doc" },
  { name: "Post-Treatment Care Sheet.pdf", size: "245 KB", ext: "pdf" }
];

/* ---------------------------------------------------------------- course data (mirrors course-web.jsx) -- */
const COURSES_LW = {
  "8d-lips": {
    slug: "8d-lips",
    title: "8D Lips",
    bannerImage: "assets/clinic-treatment-collage.png",
    points: 1000,
    resources: DEFAULT_RESOURCES_LW,
    sections: [
      { title: "Module 1", lessons: [
        { name: "Diagnosis", kind: "video", desc: "How to diagnose, treat and most of all understand how to avoid Eyelid Ptosis from Botox treatment.", bullets: SCREENING_BULLETS_LW },
        { name: "Brow Ptosis", kind: "video", desc: "How to Select Patients & Conduct Medical Screening", bullets: SCREENING_BULLETS_LW }
      ] },
      { title: "Module 2", lessons: [
        { name: "Welcome & how to use this module", kind: "video", dur: "2:10",
          desc: "A short orientation before you start injecting. This module is built to be worked through in order — the two lessons here set up the safety framework, then each folder takes one part of the technique in depth.",
          bullets: [
            "Watch these two orientation lessons first — they set the safety baseline everything else assumes.",
            "Work the Injection Techniques folder in order; each technique builds on the needle control before it.",
            "Use the Case Studies to see the decisions in context, then keep the Downloads to hand in clinic."
          ] },
        { name: "Safety essentials (watch first)", kind: "video", dur: "6:48",
          desc: "The non-negotiables before any lip treatment: anatomy you must know, the signs that mean stop, and the protocol you follow if something changes mid-treatment.",
          bullets: [
            "Know the vascular anatomy of the lip and the danger zones by heart.",
            "Aspirate, inject slowly, and stop at the first sign of blanching or disproportionate pain.",
            "Keep hyaluronidase and the occlusion protocol within reach for every appointment."
          ] }
      ], subs: [
        { title: "Injection Techniques", lessons: [
          { name: "Linear threading technique", kind: "video", dur: "4:32" },
          { name: "Tenting technique", kind: "video", dur: "3:58" },
          { name: "Cannula approach", kind: "video", dur: "6:11" }
        ] },
        { title: "Case Studies", lessons: [
          { name: "Case 1: thin lips, first treatment", kind: "video", dur: "7:20" },
          { name: "Case 2: correction of migrated filler", kind: "video", dur: "9:05" }
        ] },
        { title: "Downloads & Resources", lessons: [
          { name: "Technique recipe cards", kind: "pdf" },
          { name: "Consent form templates", kind: "pdf" }
        ] }
      ] },
      { title: "Module 3", lessons: [
        { name: "Upper Eyelid Lift", kind: "video", desc: "Indications and Surgical Techniques for Upper Eyelid Lift", bullets: UPPER_LID_BULLETS_LW },
        { name: "Lower Eyelid Surgery", kind: "video", desc: "Approaches and Considerations for Lower Eyelid Surgery", bullets: [
          "Assess lower eyelid for signs of aging and fat herniation.",
          "Discuss risks and benefits of surgical versus non-surgical treatments.",
          "Prepare patient for realistic outcomes and duration of results."
        ] }
      ] },
      { title: "Module 4", lessons: [
        { name: "Blepharospasm Treatment", kind: "video", desc: "Understanding Blepharospasm and Its Management", bullets: [
          "Conduct neurological assessments to confirm diagnosis.",
          "Explore treatment options including botulinum toxin injections.",
          "Educate patients on the potential for recurrent symptoms."
        ] }
      ] },
      { title: "Bonus Module", lessons: [
        { name: "Bonus Module – Key Concepts", kind: "video" }
      ] },
      { title: "End of Success Path Quiz", lessons: [
        { name: "Botulinum Toxin Complications – End Of Course Quiz", kind: "quiz" }
      ] }
    ]
  }
};

function slugifyLW(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildGenericCourseLW(params) {
  const title = params.get("title") || "Course";
  return {
    slug: slugifyLW(title),
    title: title,
    bannerImage: "assets/clinic-lip-design.png",
    points: 1000,
    resources: DEFAULT_RESOURCES_LW,
    sections: [
      { title: "Module 1", lessons: [
        { name: "Getting Started", kind: "video", desc: "Foundations you need before your first patient session.", bullets: SCREENING_BULLETS_LW }
      ] },
      { title: "End of Success Path Quiz", lessons: [
        { name: title + " – End Of Course Quiz", kind: "quiz" }
      ] }
    ]
  };
}

function getCourseLW() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("course");
  if (slug && COURSES_LW[slug]) return COURSES_LW[slug];
  if (params.get("title")) return buildGenericCourseLW(params);
  return COURSES_LW["8d-lips"];
}

function courseUrlLW(course) {
  return COURSES_LW[course.slug] ? "CourseWeb.html?course=" + course.slug : "CourseWeb.html?title=" + encodeURIComponent(course.title);
}

/* ---------------------------------------------------------------- flatten -- */
function flattenSectionsLW(course) {
  const flat = [];
  course.sections.forEach((sec, si) => {
    sec.lessons.forEach((l) => { Object.assign(l, { sectionIndex: si, sectionTitle: sec.title, flatIdx: flat.length }); flat.push(l); });
    (sec.subs || []).forEach((sub) => {
      sub.lessons.forEach((l) => { Object.assign(l, { sectionIndex: si, sectionTitle: sec.title, subTitle: sub.title, flatIdx: flat.length }); flat.push(l); });
    });
  });
  return flat;
}

const DEFAULT_COMMENTS_LW = [
  { name: "Dr. Maya Chen", initials: "MC", time: "2h ago", text: "Great breakdown of the anatomy. I've found that a quick review of the patient's history before the procedure makes all the difference." },
  { name: "Dr. Jordan Lee", initials: "JL", time: "5h ago", text: "The contraindication checklist is super helpful. Does anyone have a favourite way to document consent for first-time patients?" },
  { name: "Sarah Patel", initials: "SP", time: "1d ago", text: "The case-study visuals are excellent. Would love to see more before/after examples in future modules." }
];

function initialsOfLW(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

/* ---------------------------------------------------------------- crumb -- */
function LWCrumb({ course, current, outlineVisible, onToggleOutline }) {
  return (
    <div className="lw-crumb-row">
      <button type="button" className="lw-back-btn" aria-label="Back to course" onClick={() => goLW(courseUrlLW(course))}>
        <IconLW name="lucide:arrow-left" size={19} color="var(--brand-navy)" />
      </button>
      <span className="lw-crumb">
        <a onClick={() => goLW("MyLearning.html")}>My Learning</a> &nbsp;/&nbsp;{" "}
        <a onClick={() => goLW(courseUrlLW(course))}>{course.title}</a> &nbsp;/&nbsp;{" "}
        <span className="current">{current.sectionTitle}: {current.name}</span>
      </span>
      <div className="lw-spacer" />
      <button type="button" className="lw-outline-toggle" onClick={onToggleOutline}>
        <IconLW name="lucide:list" size={17} />{outlineVisible ? "Hide outline" : "Course outline"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- video media -- */
function LWMedia({ course, current, playing, onTogglePlay, theater, onToggleTheater, onNext }) {
  return (
    <div className="lw-media">
      <img src={course.bannerImage} alt="Lesson video" style={{ height: theater ? "min(76vh, 780px)" : "440px" }} />
      <span className="lw-media-label">
        <span className="lw-media-context">{current.subTitle || current.sectionTitle}</span>
        <span className="lw-media-name">{current.name}</span>
      </span>
      <button type="button" className="lw-media-play" aria-label={playing ? "Pause" : "Play"} onClick={onTogglePlay}>
        <IconLW name={playing ? "lucide:pause" : "lucide:play"} size={36} color="#fff" />
      </button>
      <div className="lw-media-bar">
        <button type="button" className="lw-media-btn" aria-label={playing ? "Pause" : "Play"} onClick={onTogglePlay}>
          <IconLW name={playing ? "lucide:pause" : "lucide:play"} size={24} color="#fff" />
        </button>
        <span className="lw-media-time">10:32</span>
        <span className="lw-media-scrub"><span style={{ width: "56%" }} /></span>
        <span className="lw-media-time dim">8:04</span>
        <button type="button" className="lw-media-btn" aria-label="Next lesson" onClick={onNext}>
          <IconLW name="lucide:skip-forward" size={22} color="#fff" />
        </button>
        <button type="button" className="lw-media-btn" aria-label={theater ? "Exit large view" : "Enlarge video"} onClick={onToggleTheater}>
          <IconLW name={theater ? "lucide:minimize" : "lucide:maximize"} size={22} color="#fff" />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- overview tab -- */
function LWSteps({ current }) {
  const bullets = current.bullets || [];
  if (bullets.length === 0) return null;
  return (
    <React.Fragment>
      <h3 className="lw-h3">{current.sectionTitle} success steps</h3>
      <div className="lw-steps">
        {bullets.map((text, i) => (
          <div className="lw-step" key={i}>
            <span className="lw-step-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="lw-step-text">{text}</span>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

function LWCommentRow({ c, onToggleLike }) {
  return (
    <div className="lw-comment">
      <div className="lw-comment-head">
        <span className="lw-comment-avatar">{c.initials}</span>
        <span className="lw-comment-meta">
          <span className="lw-comment-name">{c.name}</span>
          <span className="lw-comment-time">{c.time}</span>
        </span>
      </div>
      <p className="lw-comment-text">{c.text}</p>
      <div className="lw-comment-actions">
        <button type="button" className={c.liked ? "liked" : ""} onClick={onToggleLike}>{c.liked ? "Liked" : "Like"}{c.likes ? " · " + c.likes : ""}</button>
        <button type="button">Reply</button>
      </div>
    </div>
  );
}

function LWOverview({ current, comments, onAddComment, onToggleLike }) {
  const [draft, setDraft] = useStateLW("");
  function submit() {
    if (!draft.trim()) return;
    onAddComment(draft.trim());
    setDraft("");
  }
  return (
    <div>
      <h1 className="lw-h1">{current.name}</h1>
      <p className="lw-desc">{current.desc || "How to work through this part of the course."}</p>

      <LWSteps current={current} />

      <div className="lw-divider" />

      <h3 className="lw-h3">{comments.length} Comment{comments.length === 1 ? "" : "s"}</h3>
      <div className="lw-composer">
        <img src={ME_LW.avatar} alt="" />
        <input placeholder="Leave a comment…" aria-label="Leave a comment" value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()} />
        <button type="button" onClick={submit}>Post</button>
      </div>
      <div className="lw-composer-note">
        <IconLW name="lucide:info" size={15} color="var(--gray-400)" />Your comment will also be shared to the newsfeed.
      </div>

      <div className="lw-comments">
        {comments.map((c, i) => <LWCommentRow c={c} key={i} onToggleLike={() => onToggleLike(i)} />)}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- resources tab -- */
function LWDocIcon({ ext }) {
  const map = { pdf: "lucide:file-text", doc: "lucide:file-type-2", ppt: "lucide:presentation" };
  return <IconLW name={map[ext] || "lucide:file"} size={21} color="var(--brand-gold)" />;
}

function LWResources({ resources }) {
  return (
    <div className="lw-docs">
      {resources.map((r, i) => (
        <div className="lw-doc" key={i}>
          <span className="lw-doc-icon"><LWDocIcon ext={r.ext} /></span>
          <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            <span className="lw-doc-title">{r.name}</span>
            <span className="lw-doc-meta">{r.size}</span>
          </span>
          <IconLW name="lucide:download" size={20} color="var(--brand-navy)" />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- footer -- */
function LWFooter({ idx, isDone, hasNext, onPrev, onComplete, onNext }) {
  return (
    <div className="lw-footer">
      <button type="button" className="lw-btn-prev" disabled={idx === 0} onClick={onPrev}>Previous</button>
      <div style={{ flex: 1 }} />
      <button type="button" className={"lw-btn-complete" + (isDone ? " done" : "")} onClick={onComplete}>
        <IconLW name={isDone ? "lucide:circle-check-big" : "lucide:check"} size={18} />
        {isDone ? "Completed" : "Mark as complete"}
      </button>
      <button type="button" className={"lw-btn-next" + (isDone ? " ready" : "")}
        title={isDone ? "" : "Mark this lesson complete to continue"} onClick={onNext}>
        {!hasNext ? "Finish course" : "Next lesson"}<IconLW name="lucide:arrow-right" size={18} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- outline sidebar -- */
function LWOutlineRow({ lesson, isCurrent, isDone, sub, onSelect }) {
  const icon = isDone ? "lucide:circle-check-big" : lesson.kind === "pdf" ? "lucide:file-text" : isCurrent ? "lucide:circle-play" : "lucide:play";
  const color = isDone ? "var(--success)" : isCurrent ? "var(--brand-navy)" : "var(--gray-450)";
  return (
    <button type="button" className={"lw-outline-row" + (sub ? " sub" : "") + (isCurrent ? " current" : "")} onClick={onSelect}>
      <IconLW name={icon} size={16} color={color} />
      <span className="lw-outline-row-name">{lesson.name}</span>
      <span className="lw-outline-row-dur">{lesson.dur || (lesson.kind === "pdf" ? "PDF" : lesson.kind === "quiz" ? "Quiz" : "")}</span>
    </button>
  );
}

function LWOutlineList({ course, currentFlatIdx, completed, onSelect }) {
  return (
    <div className="lw-outline-list">
      {course.sections.map((sec, si) => (
        <div key={si}>
          <div className="lw-outline-module">{sec.title}</div>
          {sec.lessons.map((l) => (
            <LWOutlineRow key={l.flatIdx} lesson={l} isCurrent={l.flatIdx === currentFlatIdx} isDone={completed.has(l.flatIdx)}
              onSelect={() => onSelect(l.flatIdx)} />
          ))}
          {(sec.subs || []).map((sub, subi) => (
            <div key={subi}>
              <div className="lw-outline-folder">
                <IconLW name="lucide:folder" size={17} color="var(--brand-gold)" />{sub.title}
              </div>
              {sub.lessons.map((l) => (
                <LWOutlineRow key={l.flatIdx} lesson={l} sub isCurrent={l.flatIdx === currentFlatIdx} isDone={completed.has(l.flatIdx)}
                  onSelect={() => onSelect(l.flatIdx)} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function LWOutlineAside({ course, flat, currentFlatIdx, completed, onSelect }) {
  const current = flat[currentFlatIdx];
  const inModule = flat.filter((l) => l.sectionTitle === current.sectionTitle);
  const posInModule = inModule.indexOf(current) + 1;
  const pct = flat.length ? Math.round((completed.size / flat.length) * 100) : 0;
  return (
    <aside className="lw-outline">
      <div className="lw-outline-card">
        <div className="lw-outline-head">
          <div className="lw-outline-head-row">
            <span className="lw-outline-title">Course outline</span>
            <span className="lw-outline-pos">{posInModule} of {inModule.length} in module</span>
          </div>
          <span className="lw-outline-bar"><span style={{ width: pct + "%" }} /></span>
          <div className="lw-outline-pct">{pct}% complete</div>
        </div>
        <LWOutlineList course={course} currentFlatIdx={currentFlatIdx} completed={completed} onSelect={onSelect} />
      </div>

      <div className="lw-ava-card">
        <div className="lw-ava-head">
          <SparkLW size={20} color="var(--brand-gold)" />
          <span>Stuck on this lesson?</span>
        </div>
        <p className="lw-ava-desc">Ask Ava to explain the technique in her own words, or quiz you on it.</p>
        <button type="button" className="lw-ava-btn" onClick={() => goLW("Agent.html")}>
          Ask Ava<IconLW name="lucide:arrow-up-right" size={16} />
        </button>
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------------- app -- */
function LessonWebApp() {
  const course = getCourseLW();
  const flat = flattenSectionsLW(course);
  const totalItems = flat.length;
  const params = new URLSearchParams(window.location.search);
  const requestedIdx = parseInt(params.get("lesson"), 10);
  const initialProgress = loadProgressLW(course.slug);
  const startIdx = !isNaN(requestedIdx) ? Math.min(Math.max(requestedIdx, 0), totalItems - 1) : Math.min(initialProgress.activeIdx || 0, totalItems - 1);

  const [idx, setIdx] = useStateLW(startIdx);
  const [tab, setTab] = useStateLW("overview");
  const [playing, setPlaying] = useStateLW(true);
  const [theater, setTheater] = useStateLW(false);
  const [outlineVisible, setOutlineVisible] = useStateLW(false);
  const [completed, setCompleted] = useStateLW(new Set(initialProgress.completed || []));
  const [comments, setComments] = useStateLW(() => DEFAULT_COMMENTS_LW.map((c) => ({ ...c, liked: false, likes: 0 })));
  const [toast, setToast] = useStateLW(null);
  const toastTimer = useRefLW(null);

  const current = flat[idx];

  useEffectLW(() => { document.title = "PROfinity — " + current.name; }, [idx]);
  useEffectLW(() => {
    saveProgressLW(course.slug, { completed: Array.from(completed), activeIdx: idx });
  }, [completed, idx]);
  useEffectLW(() => () => clearTimeout(toastTimer.current), []);

  function showToast(text) {
    clearTimeout(toastTimer.current);
    setToast(text);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function selectLesson(nextIdx) {
    setIdx(nextIdx);
    setTab("overview");
    setPlaying(true);
  }
  function handlePrev() { if (idx > 0) selectLesson(idx - 1); }
  function handleComplete() {
    if (completed.has(idx)) return;
    setCompleted((prev) => new Set(prev).add(idx));
    showToast("Lesson marked complete");
  }
  function handleNext() {
    if (!completed.has(idx)) { showToast("Mark this lesson complete first"); return; }
    const nextLesson = flat[idx + 1];
    if (!nextLesson) { goLW(courseUrlLW(course)); return; }
    const movingModule = nextLesson.sectionTitle !== current.sectionTitle;
    selectLesson(idx + 1);
    showToast(movingModule ? "Module complete — opening " + nextLesson.sectionTitle : "Next lesson");
  }
  function handleAddComment(text) {
    setComments((all) => [{ name: ME_LW.name, initials: initialsOfLW(ME_LW.name), time: "Just now", text, liked: false, likes: 0 }, ...all]);
  }
  function handleToggleLike(i) {
    setComments((all) => all.map((c, ci) => ci === i ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) } : c));
  }

  const isDone = completed.has(idx);
  const hasNext = idx < totalItems - 1;
  const gridCols = outlineVisible ? "minmax(0,1fr) 380px" : "minmax(0,1fr)";

  return (
    <div className="app" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" }}>
      <TopNavLW active="My Learning" user={ME_LW} logoSrc="assets/profinity-icon-purple-gold.png"
        onNavigate={navigateLW}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />

      {toast && (
        <div role="status" className="lw-toast">
          <IconLW name="lucide:circle-check-big" size={20} color="var(--success)" />
          {toast}
        </div>
      )}

      <div className="lw-page" data-screen-label="Lesson (web)">
        <LWCrumb course={course} current={current} outlineVisible={outlineVisible} onToggleOutline={() => setOutlineVisible((v) => !v)} />

        <div className="lw-grid" style={{ gridTemplateColumns: gridCols }}>
          <div style={{ minWidth: 0 }}>
            <section className="lw-card">
              <LWMedia course={course} current={current} playing={playing} onTogglePlay={() => setPlaying((p) => !p)}
                theater={theater} onToggleTheater={() => setTheater((t) => !t)} onNext={handleNext} />

              <div className="lw-tabs" role="tablist">
                <button type="button" role="tab" aria-selected={tab === "overview"} className={"lw-tab" + (tab === "overview" ? " on" : "")} onClick={() => setTab("overview")}>Overview</button>
                <button type="button" role="tab" aria-selected={tab === "resources"} className={"lw-tab" + (tab === "resources" ? " on" : "")} onClick={() => setTab("resources")}>Resources ({course.resources.length})</button>
              </div>

              <div className="lw-body">
                {tab === "overview" ? (
                  <LWOverview current={current} comments={comments} onAddComment={handleAddComment} onToggleLike={handleToggleLike} />
                ) : (
                  <LWResources resources={course.resources} />
                )}
              </div>
            </section>

            <LWFooter idx={idx} isDone={isDone} hasNext={hasNext}
              onPrev={handlePrev} onComplete={handleComplete} onNext={handleNext} />
          </div>

          {outlineVisible && (
            <LWOutlineAside course={course} flat={flat} currentFlatIdx={idx} completed={completed} onSelect={selectLesson} />
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(<LessonWebApp />);
