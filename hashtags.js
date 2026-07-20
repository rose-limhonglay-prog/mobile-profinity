/* ===========================================================================
   PROfinity — Admin-managed hashtag buckets
   Single source of truth for the fixed hashtag list posts pick from. Plain
   JS (no JSX/build step) so it can load early on every page, same as
   pagetrans.js / dark-mode-init.js. Backed by localStorage so the Admin
   Panel's changes are visible on the next full page load everywhere else.
   =========================================================================== */
(function () {
  var STORAGE_KEY = "pf-admin-hashtags";

  var DEFAULT_HASHTAGS = [
    { slug: "case-study", label: "Case Study", icon: "lucide:chart-pie" },
    { slug: "protocol", label: "Protocol", icon: "lucide:clipboard-list" },
    { slug: "discussion", label: "Discussion", icon: "lucide:message-circle" },
    { slug: "community", label: "Community", icon: "lucide:users" },
    { slug: "masterclass", label: "Masterclass", icon: "lucide:play" },
    { slug: "reel", label: "Reel", icon: "lucide:smartphone" },
    { slug: "update", label: "Update", icon: "lucide:message-circle" },
    { slug: "business", label: "Business", icon: "lucide:briefcase" },
    { slug: "anatomy", label: "Anatomy", icon: "lucide:activity" },
    { slug: "course", label: "Course", icon: "lucide:graduation-cap" },
    { slug: "patient", label: "Patient", icon: "lucide:user" },
    { slug: "clinic", label: "Clinic", icon: "lucide:stethoscope" },
    { slug: "profinity", label: "Profinity", icon: "lucide:sparkles" },
    { slug: "healthcare", label: "Healthcare", icon: "lucide:heart-pulse" },
    { slug: "mastery", label: "Mastery", icon: "lucide:award" },
    { slug: "freedom", label: "Freedom", icon: "lucide:trending-up" },
    { slug: "confidence", label: "Confidence", icon: "lucide:users" },
    { slug: "inner-circle", label: "Inner Circle", icon: "lucide:gem" },
    { slug: "learning", label: "Learning", icon: "lucide:bookmark" }
  ];

  function slugify(label) {
    return String(label || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function readRaw() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function writeRaw(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function getAll() {
    var list = readRaw();
    if (!list) {
      list = DEFAULT_HASHTAGS.slice();
      writeRaw(list);
    }
    return list;
  }

  function add(tag) {
    var label = (tag && tag.label || "").trim();
    if (!label) return getAll();
    var slug = slugify(label);
    if (!slug) return getAll();
    var list = getAll();
    if (list.some(function (t) { return t.slug === slug; })) return list;
    list = list.concat([{ slug: slug, label: label, icon: (tag && tag.icon) || "lucide:hash" }]);
    writeRaw(list);
    return list;
  }

  function remove(slug) {
    var list = getAll().filter(function (t) { return t.slug !== slug; });
    writeRaw(list);
    return list;
  }

  function bySlug(slug) {
    return getAll().filter(function (t) { return t.slug === slug; })[0] || null;
  }

  window.PFHashtags = {
    DEFAULT_HASHTAGS: DEFAULT_HASHTAGS,
    getAll: getAll,
    add: add,
    remove: remove,
    bySlug: bySlug,
    slugify: slugify
  };
})();
