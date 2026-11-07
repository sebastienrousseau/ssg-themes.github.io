/*!
 * Gallery category filter.
 *
 * Every theme tile is in the HTML, so the page is complete without
 * JavaScript (the filter bar is hidden under `html.no-js`). This script
 * turns the bar's chips into toggle buttons that show one category at a
 * time. A tile's category is the text of its `.eyebrow`, and each chip's
 * count is computed here from the tiles, never typed into the markup, so
 * adding a theme cannot leave a stale number behind.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  function categoryOf(tile) {
    var eyebrow = tile.querySelector('.eyebrow');
    return eyebrow ? eyebrow.textContent.trim() : '';
  }

  function matches(tile, filter) {
    return filter === 'all' || categoryOf(tile) === filter;
  }

  function label(chips, tiles) {
    chips.forEach(function (chip) {
      var filter = chip.getAttribute('data-filter') || 'all';
      var count = tiles.filter(function (t) { return matches(t, filter); }).length;
      chip.textContent = chip.textContent.trim() + ' (' + count + ')';
    });
  }

  function apply(chip, chips, tiles, status) {
    var filter = chip.getAttribute('data-filter') || 'all';
    var shown = 0;
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
    });
    tiles.forEach(function (tile) {
      tile.hidden = !matches(tile, filter);
      if (!tile.hidden) shown += 1;
    });
    if (status) status.textContent = shown + ' / ' + tiles.length;
  }

  /* The bar is sticky, so it could cover whatever the keyboard focuses
     next (WCAG 2.4.11, focus not obscured). It steps aside while focus is
     outside it and comes back on the next pointer move. */
  function yieldToFocus(bar) {
    document.addEventListener('focusin', function (e) {
      if (bar.contains(e.target)) {
        bar.removeAttribute('data-yield');
      } else {
        bar.setAttribute('data-yield', 'true');
      }
    });
    document.addEventListener('focusout', function () {
      bar.removeAttribute('data-yield');
    });
    document.addEventListener('pointermove', function () {
      if (!bar.contains(document.activeElement)) bar.removeAttribute('data-yield');
    }, { passive: true });
  }

  ready(function () {
    var bar = document.querySelector('.sc-filter-bar');
    if (!bar) return;
    var chips = toArray(bar.querySelectorAll('.sc-filter-chip[data-filter]'));
    var tiles = toArray(document.querySelectorAll('.section-promo .tile-wrapper'));
    var status = document.getElementById('filterStatus');
    label(chips, tiles);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () { apply(chip, chips, tiles, status); });
    });
    yieldToFocus(bar);
  });
})();
