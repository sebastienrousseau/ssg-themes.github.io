/*!
 * Gallery carousel controls.
 *
 * The track is an ordinary scroll region: it scrolls with a trackpad, a
 * touch drag, the arrow keys once focused, and the two buttons below. The
 * buttons only exist to make that obvious with a mouse — nothing here is
 * required to reach a theme, and nothing advances on its own.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  ready(function () {
    var track = document.getElementById('themeTrack');
    var prev = document.getElementById('trackPrev');
    var next = document.getElementById('trackNext');
    if (!track || !prev || !next) return;

    var step = function () {
      var slide = track.querySelector('.sc-slide');
      if (!slide) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return slide.getBoundingClientRect().width + gap;
    };

    /* A button that cannot do anything must say so, rather than looking
       live and swallowing the press. */
    var sync = function () {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= max - 1;
    };

    prev.addEventListener('click', function () { track.scrollBy({ left: -step() }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step() }); });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
})();
