/* Apply stored theme immediately to prevent flash of wrong theme.
   Must run before first paint — include as first <script> in <head>. */
(function () {
  try {
    var t = localStorage.getItem('pf-theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (e) {}
}());
