/* real-device.js — "real phone browser" mode for the mobile shells.
   ---------------------------------------------------------------------------
   The mobile designs render inside the IOSDevice bezel (ios-frame.jsx) so they
   can be reviewed on a desktop. Opened in an actual phone browser that frame is
   a fixed 440×956 box with a fake status bar / Dynamic Island / home indicator
   under the real ones. This script flips on a "real device" mode:

     • IOSDevice drops the bezel chrome and fills the viewport (ios-frame.jsx)
     • real-device.css re-bases every status-bar clearance on
       env(safe-area-inset-*) and lets the body scroll-lock to the screen
     • the viewport meta gets maximum-scale=1 (no focus zoom), plus the
       Add-to-Home-Screen metas + manifest so the site runs standalone

   ON when:  the page is served from the mobile-web host
             (profinity-mobileweb.vercel.app, or any host containing "mobileweb",
             or locally http://localhost:3002 — `npm run dev:mobileweb`)
   Force:    ?realdevice=1 / ?realdevice=0 — sticks in localStorage for the
             rest of the browsing session, so the whole flow can be tested
             on localhost or the main design link.

   Must run in <head> before the stylesheets paint. Exposes
   window.PF_REAL_DEVICE (boolean) + window.PFRealDevice {on, standalone}. */
(function () {
  var HOST_RE = /(^|[.-])mobileweb([.-]|$)/i;
  var forced = null;
  try {
    var q = new URLSearchParams(location.search).get('realdevice');
    if (q === '1' || q === '0') { forced = q; localStorage.setItem('pf-real-device', q); }
    else {
      var s = localStorage.getItem('pf-real-device');
      if (s === '1' || s === '0') forced = s;
    }
  } catch (e) {}
  // Local twin of the mobile-web host: `npm run dev:mobileweb` serves the same
  // files on port 3002 (localhost:3000 stays the native-app bezel). Any
  // *.localhost name containing "mobileweb" works too (Chrome resolves them).
  var MOBILE_WEB_PORT = '3002';
  var host = HOST_RE.test(location.hostname) || location.port === MOBILE_WEB_PORT;
  // "mobile web" preview (desktop): the bezel shows the screens inside Safari
  // (IOSSafariBar in ios-frame.jsx). ?mobileweb=1 / ?mobileweb=0 force it for one load.
  // The host/port decides; ?mobileweb=1/0 overrides for THIS load only (it
  // used to stick in localStorage, which made localhost:3000 show the mobile
  // web version after one test — the stale key is cleared here).
  var mw = null;
  try {
    localStorage.removeItem('pf-mobile-web');
    var mq = new URLSearchParams(location.search).get('mobileweb');
    if (mq === '1' || mq === '0') mw = mq;
  } catch (e) {}
  var mobileWeb = mw !== null ? mw === '1' : host;
  // phone-sized viewports only: on a desktop/tablet the mobile-web host keeps
  // the bezel preview (the shells themselves switch to a frameless layout at
  // the same 768px breakpoint — see useIsMobile* in the mobile jsx files)
  var narrow = true;
  try { narrow = window.matchMedia('(max-width: 768px)').matches; } catch (e) {}
  var on = (forced !== null ? forced === '1' : mobileWeb) && narrow;

  var standalone = false;
  try {
    standalone = navigator.standalone === true ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  } catch (e) {}

  window.PF_MOBILE_WEB = mobileWeb;
  window.PF_REAL_DEVICE = on;
  if (mobileWeb) document.documentElement.setAttribute('data-mobile-web', '1');
  // "Get the app" banner (IOSAppBanner in ios-frame.jsx) on the DESKTOP
  // mobile-web preview only: it mirrors Safari's native Smart App Banner,
  // which real phones get from the apple-itunes-app meta injected below.
  // Flag the html before paint so real-device.css can hand the status-bar
  // clearance to the banner. ?appbanner=1 forces it back, ?appbanner=0 hides.
  var banner = mobileWeb && !on && !standalone;
  try {
    var bq = new URLSearchParams(location.search).get('appbanner');
    if (bq === '1') { banner = mobileWeb; localStorage.removeItem('pf-app-banner-dismissed'); }
    else if (bq === '0') banner = false;
    else if (banner && localStorage.getItem('pf-app-banner-dismissed')) banner = false;
  } catch (e) {}
  if (banner) document.documentElement.setAttribute('data-pf-appbn', '1');
  window.PFRealDevice = { on: on, mobileWeb: mobileWeb, host: host, narrow: narrow, standalone: standalone, forced: forced !== null, banner: banner };
  if (!on) return;

  var root = document.documentElement;
  root.setAttribute('data-real-device', '1');
  if (standalone) root.setAttribute('data-standalone', '1');

  var head = document.head || document.getElementsByTagName('head')[0];
  function addMeta(name, content, media) {
    if (document.querySelector('meta[name="' + name + '"]' + (media ? '[media]' : ''))) return;
    var m = document.createElement('meta');
    m.setAttribute('name', name); m.setAttribute('content', content);
    if (media) m.setAttribute('media', media);
    head.appendChild(m);
  }
  // Safari's native Smart App Banner ("PROfinity Academy — Free on the App
  // Store · Download"). Replace the placeholder id with the real listing's.
  addMeta('apple-itunes-app', 'app-id=' + (window.PF_APP_STORE_ID || '0000000000'));
  function addLink(rel, href, extra) {
    if (document.querySelector('link[rel="' + rel + '"]')) return;
    var l = document.createElement('link');
    l.setAttribute('rel', rel); l.setAttribute('href', href);
    for (var k in (extra || {})) l.setAttribute(k, extra[k]);
    head.appendChild(l);
  }

  // viewport — device width, no pinch/focus zoom (keeps the designed type sizes), full-bleed
  var vp = document.querySelector('meta[name="viewport"]');
  var vpContent = 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover';
  if (vp) vp.setAttribute('content', vpContent);
  else addMeta('viewport', vpContent);

  // Add to Home Screen → standalone app; translucent status bar overlays the
  // page so env(safe-area-inset-top) gives the designs their status-bar inset back
  addMeta('apple-mobile-web-app-capable', 'yes');
  addMeta('mobile-web-app-capable', 'yes');
  addMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  addMeta('apple-mobile-web-app-title', 'PROfinity');
  addMeta('theme-color', '#FFFFFF', '(prefers-color-scheme: light)');
  addMeta('theme-color', '#08071a', '(prefers-color-scheme: dark)');
  addLink('manifest', 'manifest.webmanifest');
  addLink('apple-touch-icon', 'assets/app-icon-512.png');
}());
