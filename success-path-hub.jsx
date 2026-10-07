/* ===========================================================================
   PROfinity — Success Path hub (SuccessPath.html mobile · SuccessPathWeb.html)
   The member's Success Paths inside My Learning: the 8D Lip Design path, the
   Tier 1 Free Starter Path, Ava's routing card and a locked coach suggestion.
   Body = window.PFSuccessPathUI.Hub; this file only adds the page chrome.
   window.SP_HUB_VARIANT = "mobile" | "web" (set by the HTML shell).
   ?course=<slug> · ?goal=1 opens the goal sheet · ?sp=starter views as Tier 1.
   Suffixed -SH (shared global scope).
   =========================================================================== */
const { useState: useStateSH, useEffect: useEffectSH } = React;
const UISH = window.PFSuccessPathUI;
const VARIANT_SH = window.SP_HUB_VARIANT || "mobile";
const SLUG_SH = new URLSearchParams(location.search).get("course") || "8d-lip-design";
function goSH(u) { (window.pfGo || function (x) { window.location.href = x; })(u); }

function SPMobileScreen() {
  return (
    <div className="ml-screen sp-screen" data-screen-label="Success Path hub (mobile)">
      <div className="ml-top">
        {/* the path belongs to its course (user, 2026-10-06): back goes to the 8D course page */}
        <button className="ml-back" aria-label="Back to the course" onClick={() => goSH("CourseDetail.html?course=" + SLUG_SH)}><UISH.Icon n="chevL" s={22} /></button>
        <h1>Success Path<small className="sp-fs-sub">{(window.PFSuccessPath && window.PFSuccessPath.compute(SLUG_SH) || {}).shortTitle || ""}</small></h1>
      </div>
      <div className="ml-scroll sp-hub-scroll">
        <UISH.Hub slug={SLUG_SH} variant="mobile" />
        <div style={{ height: 28 }} />
      </div>
    </div>);
}
function useScaleSH() {
  const calc = () => Math.min(1, (window.innerHeight - 40) / 956);
  const [s, setS] = useStateSH(calc);
  useEffectSH(() => { const u = () => setS(calc()); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  return s;
}
function useIsMobileSH() {
  const [m, setM] = useStateSH(() => window.matchMedia("(max-width:768px)").matches);
  useEffectSH(() => { const mq = window.matchMedia("(max-width:768px)"); const h = (e) => setM(e.matches); mq.addEventListener("change", h); return () => mq.removeEventListener("change", h); }, []);
  return m;
}
function useDarkSH() {
  const read = () => document.documentElement.getAttribute("data-theme") === "dark";
  const [d, setD] = useStateSH(read);
  useEffectSH(() => { const mo = new MutationObserver(() => setD(read())); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] }); return () => mo.disconnect(); }, []);
  return d;
}
function SPHubMobileApp() {
  const mobile = useIsMobileSH(), scale = useScaleSH(), dark = useDarkSH();
  const vars = { "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)" };
  if (mobile) return <div className="app" style={{ ...vars, background: "var(--surface-page)", height: "100vh" }}><SPMobileScreen /></div>;
  return (
    <div className="app device-stage" style={{ ...vars, backgroundColor: dark ? "#05081a" : "rgb(217, 218, 225)" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        <IOSDevice width={440} height={956} dark={dark}><SPMobileScreen /></IOSDevice>
      </div>
    </div>);
}

function SPHubWebApp() {
  const DS = window.ProfinityDesignSystem_c2b5cc;
  const CD = window.PFCourseData;
  const ME = CD && CD.ME ? { name: CD.ME.fullName, role: CD.ME.role, avatar: CD.ME.avatar } : { name: "Katy Wilson", role: "Nurse Practitioner" };
  const nav = (label) => {
    const u = { Home: "NewsfeedWeb.html", Profile: "Profile.html", "My Learning": "MyLearning.html", Community: "Community.html", Agent: "Agent.html" }[label];
    if (u) goSH(u);
  };
  useEffectSH(() => { document.title = "PROfinity — My Learning · Success Path"; }, []);
  return (
    <div className="app wa-screen" style={{ "--action-primary": "var(--brand-navy)", "--action-primary-hover": "var(--brand-navy-700)", minHeight: "100vh", background: "var(--surface-page)" }}>
      {DS && DS.TopNav && <DS.TopNav active="My Learning" user={ME} logoSrc="assets/profinity-icon-purple-gold.png" onNavigate={nav}
        style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-default)" }} />}
      <div className="sp-web-page" data-screen-label="Success Path hub (web)">
        <nav className="sp-crumb" aria-label="Breadcrumb"><a href="MyLearning.html">My Learning</a><span>/</span><a href={"CourseWeb.html?course=" + SLUG_SH}>8D Lip Design</a><span>/</span><span>Success Path</span></nav>
        <UISH.Hub slug={SLUG_SH} variant="web" />
      </div>
    </div>);
}

ReactDOM.createRoot(document.getElementById("pf-root")).render(VARIANT_SH === "web" ? <SPHubWebApp /> : <SPHubMobileApp />);
