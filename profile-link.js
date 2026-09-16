/* ==========================================================================
   profile-link.js — one place that answers "where does tapping this person
   go?" for every avatar / author name across the app.

   Any surface that shows a member (feed post headers, comment rows, search
   results, leaderboard rows, lesson comments, DM info…) calls
   PFProfileLink.open(author) — or renders <PFProfileLink.Link author={…}>
   around the avatar / name — and lands on that member's profile:

     • Katy Wilson (the signed-in member)  → her own profile page
     • anyone else                          → ProfileMobile.html?id=<slug>
                                              (Profile.html on desktop pages)
                                              with name/avatar/role carried
                                              in the query so uncurated
                                              members still render
     • Profinity / brand accounts           → no link (not a person)

   The ?id= slug is the lower-cased, hyphenated name ("James Lee" →
   "james-lee"), which is exactly how ProfileMobile's curated
   PM_OTHER_USERS entries are keyed, so curated members get their rich
   profile and everyone else gets the minimal fallback. Load this before
   any bundle that uses it; bundles fall back to a plain span if it's
   missing so nothing breaks.
   ========================================================================== */
(function () {
  if (window.PFProfileLink) return;

  var ME = "Katy Wilson";
  var BRANDS = ["profinity", "profinity team", "profinity academy", "profinity business academy", "ava"];

  function slug(name) {
    return String(name || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function isBrand(name) {
    return BRANDS.indexOf(String(name || "").trim().toLowerCase()) >= 0;
  }

  /* Desktop shells link to Profile.html, phone shells to ProfileMobile.html.
     Feed bundles embedded in a phone shell set PF_EMBED; otherwise fall back
     to the page name (every desktop page in this repo ends in Web.html or
     is one of the named desktop-only pages). */
  var WEB_PAGES = /(^|\/)(Profile|Community|Agent|MyLearning|Admin[A-Za-z]*|ClinicianDirectory|CourseLanding|[A-Za-z]+Web)\.html$/;
  function isWeb(opts) {
    if (opts && typeof opts.web === "boolean") return opts.web;
    if (typeof window.PF_PROFILE_WEB === "boolean") return window.PF_PROFILE_WEB;
    if (window.PF_EMBED) return false;
    try { return WEB_PAGES.test(window.location.pathname); } catch (e) { return false; }
  }

  function currentPage() {
    try {
      var path = window.location.pathname.split("/").pop() || "";
      if (!/\.html$/.test(path) || /^ProfileMobile\.html$|^Profile\.html$/.test(path)) return "";
      return path + (window.location.search || "");
    } catch (e) { return ""; }
  }

  function normalize(author) {
    if (!author) return null;
    if (typeof author === "string") return { name: author };
    return author;
  }

  function url(author, opts) {
    var a = normalize(author);
    if (!a || !a.name) return null;
    if (isBrand(a.name)) return null;
    var page = isWeb(opts) ? "Profile.html" : "ProfileMobile.html";
    if (a.name === ME) return page;
    var q = "?id=" + encodeURIComponent(a.id || slug(a.name)) + "&name=" + encodeURIComponent(a.name);
    if (a.avatar) q += "&avatar=" + encodeURIComponent(a.avatar);
    if (a.role) q += "&role=" + encodeURIComponent(a.role);
    // where we came from: the profile keeps that page's tab lit in its
    // footer and its Back arrow returns there
    var from = (opts && opts.from) || currentPage();
    if (from) q += "&from=" + encodeURIComponent(from);
    return page + q;
  }

  function open(author, opts) {
    var u = url(author, opts);
    if (!u) return false;
    (window.pfGo || function (x) { window.location.href = x; })(u);
    return true;
  }

  /* React wrapper: <Link author={…} className="pf-prof-av|pf-prof-nm">…</Link>.
     Renders a reset <button> that opens the profile, or a plain <span> when
     the author has no profile (brand accounts, missing name). Clicks stop at
     the button so a parent card's own tap handler (expand, open post…)
     doesn't also fire. */
  function Link(props) {
    var R = window.React;
    var a = normalize(props.author);
    var u = url(a, { web: props.web });
    var cls = "pf-prof-link " + (props.className || "");
    if (!u) return R.createElement("span", { className: (props.className || "") + " pf-prof-nolink" }, props.children);
    var go = function (e) { e.preventDefault(); e.stopPropagation(); open(a, { web: props.web }); };
    // as="span" for spots already inside a <button> (nested buttons are invalid HTML)
    if (props.as === "span") {
      return R.createElement("span", {
        className: cls + " pf-prof-bound", role: "link", tabIndex: 0,
        "aria-label": props.label || ("View " + a.name + "'s profile"),
        onClick: go,
        onKeyDown: function (e) { if (e.key === "Enter" || e.key === " ") go(e); }
      }, props.children);
    }
    return R.createElement("button", {
      type: "button",
      className: cls,
      "aria-label": props.label || ("View " + a.name + "'s profile"),
      title: props.title,
      onClick: go,
      onKeyDown: function (e) { if (e.key === " ") e.preventDefault(); }
    }, props.children);
  }

  /* Decorate an already-rendered element (e.g. inside a design-system
     component we can't edit) so it behaves like a profile link. Returns a
     cleanup function. */
  function bind(el, author, opts) {
    if (!el) return function () {};
    var u = url(author, opts);
    if (!u) return function () {};
    var onClick = function (e) { e.preventDefault(); e.stopPropagation(); open(author, opts); };
    var onKey = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); open(author, opts); } };
    el.classList.add("pf-prof-link", "pf-prof-bound");
    el.setAttribute("role", "link");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", "View " + normalize(author).name + "'s profile");
    el.addEventListener("click", onClick);
    el.addEventListener("keydown", onKey);
    return function () {
      el.classList.remove("pf-prof-link", "pf-prof-bound");
      el.removeAttribute("role"); el.removeAttribute("tabindex"); el.removeAttribute("aria-label");
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    };
  }

  /* Shared styling so no page CSS has to know about these buttons. */
  var css = [
    ".pf-prof-link{cursor:pointer;-webkit-tap-highlight-color:transparent}",
    "button.pf-prof-link{appearance:none;-webkit-appearance:none;background:none;border:0;padding:0;margin:0;font:inherit;color:inherit;text-align:inherit;line-height:inherit;letter-spacing:inherit;display:inline-flex;align-items:center;gap:inherit;min-width:0;max-width:100%}",
    "button.pf-prof-av,span.pf-prof-av.pf-prof-bound{flex:none;border-radius:50%;display:inline-flex}",
    "button.pf-prof-nm{display:inline;text-decoration:none}",
    "button.pf-prof-nm:hover,.pf-prof-bound.pf-prof-nm:hover{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px}",
    "button.pf-prof-av:active,.pf-prof-bound.pf-prof-av:active{transform:scale(.96)}",
    ".pf-prof-link:focus-visible{outline:2px solid var(--brand-navy,#0C1928);outline-offset:2px;border-radius:8px}",
    "span.pf-prof-nolink{display:contents}"
  ].join("\n");
  function injectCss() {
    if (document.getElementById("pf-profile-link-css")) return;
    var s = document.createElement("style");
    s.id = "pf-profile-link-css";
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }
  if (document.head) injectCss(); else document.addEventListener("DOMContentLoaded", injectCss);

  window.PFProfileLink = { ME: ME, slug: slug, url: url, open: open, bind: bind, Link: Link, isBrand: isBrand, isMe: function (n) { return n === ME; } };
  window.pfProfileUrl = url;
  window.pfOpenProfile = open;
})();
