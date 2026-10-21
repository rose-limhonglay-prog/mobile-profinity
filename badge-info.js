/* ===========================================================================
   PROfinity — Badge info sheet (MKT feedback, Oct 2026)
   Badges used to only show a tooltip. Tapping any badge (or the small (i)
   next to a badge row) now opens this sheet, which expands every badge the
   member holds into its name, what it means and how it's earned.

   Plain JS so every page can load it next to the DS bundle:
     window.PFBadgeInfo.open(["verified", "gold", ...], { focus: "gold", name: "Katy Wilson" })
   The DS VerificationSeals component calls it when it's present and falls
   back to the old tooltip when it isn't. Bottom sheet on phones, centred
   modal on wider screens. Copy below is draft — MKT to sign off.
   =========================================================================== */
(function () {
  if (window.PFBadgeInfo) return;

  var BADGES = {
    gb: {
      name: "Based in the United Kingdom",
      flag: "circle-flags:gb",
      about: "Shows the country this clinician practises in.",
      how: "Set from the clinic address on your profile."
    },
    verified: {
      name: "Verified Clinician",
      bg: "var(--verify-check, #1D8CF8)", icon: "fluent:checkmark-12-filled",
      about: "Their professional registration has been checked by the PROfinity team.",
      how: "Submit your registration details from your profile, and the PROfinity team reviews them."
    },
    crown: {
      name: "Membership Plan Subscriber",
      bg: "var(--verify-crown, #C8362F)", icon: "fluent:crown-16-filled",
      about: "An active member of a PROfinity membership plan, with access to members-only training and live sessions.",
      how: "Join a membership plan from the Membership page."
    },
    gold: {
      name: "Founding Member",
      bg: "var(--verify-gold, #E0A200)", icon: "fluent:star-16-filled",
      about: "One of the first clinicians to join PROfinity and help shape the community.",
      how: "Awarded to members who joined during the founding period. It can't be earned any more."
    },
    expert: {
      name: "PROfinity Expert",
      bg: "var(--brand-navy, #2A2569)", icon: "fluent:ribbon-16-filled",
      about: "A recognised educator who teaches or mentors on PROfinity.",
      how: "Invited by the PROfinity education team."
    },
    mastery: {
      name: "Mastery Badge",
      img: "assets/badge-m.svg",
      about: "A member of the Mastery programme, PROfinity's flagship training pathway.",
      how: "Join the Mastery programme from the Membership page."
    },
    skinfluencer: {
      name: "Skinfluencer",
      img: "assets/badge-skinfluencer.png",
      about: "Part of the Skinfluencers Lounge, recognised for sharing standout educational content.",
      how: "Selected by the PROfinity community team based on your posts."
    }
  };

  var CSS = "" +
    ".pfbi-ov{position:fixed;inset:0;z-index:2000;background:rgba(16,14,40,.45);display:flex;align-items:flex-end;justify-content:center;opacity:0;transition:opacity .2s ease;font-family:var(--font-sans,Poppins,sans-serif)}" +
    ".pfbi-ov.in{opacity:1}" +
    ".pfbi-card{width:100%;max-width:520px;max-height:82%;overflow:auto;background:var(--surface-card,#fff);color:var(--text-primary,#1b1b2f);border-radius:24px 24px 0 0;padding:10px 20px calc(24px + env(safe-area-inset-bottom));transform:translateY(24px);transition:transform .24s cubic-bezier(.2,.9,.3,1);box-shadow:0 -10px 40px rgba(16,14,40,.18)}" +
    ".pfbi-ov.in .pfbi-card{transform:none}" +
    ".pfbi-grab{width:40px;height:5px;border-radius:3px;background:var(--gray-300,#d5d5de);margin:0 auto 14px}" +
    ".pfbi-hd{display:flex;align-items:center;gap:10px;margin-bottom:4px}" +
    ".pfbi-hd h2{flex:1;margin:0;font-size:19px;font-weight:700;color:var(--text-heading,#2A2569)}" +
    ".pfbi-x{border:none;background:var(--surface-sunken,#f1f0f6);width:34px;height:34px;border-radius:50%;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:var(--gray-700,#444)}" +
    ".pfbi-sub{margin:0 0 14px;font-size:14px;color:var(--gray-500,#6b6b80)}" +
    ".pfbi-list{display:flex;flex-direction:column;gap:10px}" +
    ".pfbi-row{display:flex;gap:14px;align-items:flex-start;padding:14px;border-radius:16px;background:var(--surface-sunken,#f6f5fa);border:1.5px solid transparent;transition:border-color .2s,background .2s}" +
    ".pfbi-row.focus{border-color:var(--brand-navy,#2A2569);background:var(--surface-card,#fff)}" +
    ".pfbi-ic{flex:none;width:44px;height:44px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}" +
    ".pfbi-ic img{width:40px;height:auto;display:block}" +
    ".pfbi-tx{min-width:0}" +
    ".pfbi-nm{margin:0 0 3px;font-size:15px;font-weight:600;color:var(--text-heading,#2A2569)}" +
    ".pfbi-ab{margin:0;font-size:14px;line-height:1.45;color:var(--gray-600,#55556a)}" +
    ".pfbi-how{margin:8px 0 0;font-size:13px;line-height:1.4;color:var(--gray-500,#6b6b80);display:flex;gap:6px}" +
    ".pfbi-how b{font-weight:600;color:var(--gray-700,#444)}" +
    "@media (min-width:760px){.pfbi-ov{align-items:center}.pfbi-card{border-radius:20px;max-width:480px;padding:20px 24px 24px}.pfbi-grab{display:none}}" +
    /* the (i) affordance next to a badge row */
    ".pf-seal-info{border:none;background:none;padding:0 2px;margin-left:2px;cursor:pointer;display:inline-flex;align-items:center;color:var(--gray-400,#9a9aae);line-height:0}" +
    ".pf-seal-info:hover{color:var(--brand-navy,#2A2569)}";

  function injectCss() {
    if (document.getElementById("pfbi-css")) return;
    var st = document.createElement("style");
    st.id = "pfbi-css";
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function iconHtml(b) {
    if (b.img) return '<span class="pfbi-ic"><img src="' + b.img + '" alt=""></span>';
    if (b.flag) return '<span class="pfbi-ic"><iconify-icon icon="' + b.flag + '" width="44" height="44"></iconify-icon></span>';
    return '<span class="pfbi-ic" style="background:' + b.bg + '"><iconify-icon icon="' + b.icon + '" width="24" height="24" style="color:#fff"></iconify-icon></span>';
  }

  /* where to mount: inside the iOS phone frame when there is one, so the
     sheet stays in the device on the desktop preview */
  function host() {
    return document.querySelector(".m-screen, .cm-screen, .lm-screen, .ml-screen, .ag-screen, .pm-screen, .ev-screen") || document.body;
  }

  var current = null;
  function close() {
    if (!current) return;
    var ov = current; current = null;
    ov.classList.remove("in");
    document.removeEventListener("keydown", onKey);
    setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 220);
  }
  function onKey(e) { if (e.key === "Escape") close(); }

  function open(seals, opts) {
    opts = opts || {};
    injectCss();
    close();
    var list = (seals || []).filter(function (k) { return BADGES[k]; });
    if (!list.length) return;
    var h = host();
    var ov = document.createElement("div");
    ov.className = "pfbi-ov";
    if (h !== document.body) ov.style.position = "absolute";
    var who = opts.name ? esc(opts.name) + "'s badges" : (list.length === 1 ? "Badge" : "Badges");
    ov.innerHTML =
      '<div class="pfbi-card" role="dialog" aria-modal="true" aria-label="' + who + '">' +
        '<div class="pfbi-grab"></div>' +
        '<div class="pfbi-hd"><h2>' + who + '</h2><button type="button" class="pfbi-x" aria-label="Close"><iconify-icon icon="lucide:x" width="18" height="18"></iconify-icon></button></div>' +
        '<p class="pfbi-sub">Badges show a member’s verification, membership and community recognition.</p>' +
        '<div class="pfbi-list">' + list.map(function (k) {
          var b = BADGES[k];
          return '<div class="pfbi-row' + (opts.focus === k ? " focus" : "") + '" data-k="' + k + '">' + iconHtml(b) +
            '<div class="pfbi-tx"><p class="pfbi-nm">' + esc(b.name) + '</p><p class="pfbi-ab">' + esc(b.about) + '</p>' +
            '<p class="pfbi-how"><iconify-icon icon="lucide:info" width="14" height="14" style="flex:none;margin-top:2px"></iconify-icon><span><b>How it’s earned:</b> ' + esc(b.how) + '</span></p></div></div>';
        }).join("") + '</div>' +
      '</div>';
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    ov.querySelector(".pfbi-x").addEventListener("click", close);
    h.appendChild(ov);
    current = ov;
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(function () { ov.classList.add("in"); });
    if (opts.focus) {
      var f = ov.querySelector('.pfbi-row[data-k="' + opts.focus + '"]');
      if (f && f.scrollIntoView) setTimeout(function () { f.scrollIntoView({ block: "nearest" }); }, 60);
    }
  }

  window.PFBadgeInfo = { open: open, close: close, BADGES: BADGES };
})();
