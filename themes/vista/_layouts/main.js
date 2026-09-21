/*!
 * Vista behaviour: a navigation disclosure, a feature rail, and a theme
 * toggle.
 *
 * Every control is present and usable in the markup before this file
 * runs; this only upgrades them. The top-level menu items are links, so
 * the site navigates without any of it.
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

  ready(function () {
    var root = document.documentElement;
    var wide = window.matchMedia('(min-width: 64rem)');
    var hoverable = window.matchMedia('(hover: hover)');

    /* ssg 0.0.62 replaces the slot in-place. The published 0.0.56 search
       plugin appends its trigger at the end of <body> instead. Normalise the
       older output before interaction so the same header geometry is used by
       both generator versions. */
    var searchSlot = document.querySelector('[data-ssg-search]');
    var searchButton = document.getElementById('ssg-search-btn');
    if (searchSlot && searchButton) {
      searchSlot.replaceWith(searchButton);
    }

    /* ---------------- navigation disclosure ---------------- */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    var setNav = function (open) {
      if (!navToggle || !navMenu) {
        return;
      }
      navToggle.setAttribute('aria-expanded', String(open));
      navMenu.setAttribute('data-open', String(open));
    };

    if (navToggle && navMenu) {
      setNav(false);

      navToggle.addEventListener('click', function () {
        setNav(navToggle.getAttribute('aria-expanded') !== 'true');
      });

      /* Escape closes the menu and returns focus to the control that
         opened it, so keyboard users are never stranded inside it. */
      navMenu.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !event.defaultPrevented) {
          setNav(false);
          navToggle.focus();
        }
      });
    }

    /* ---------------- feature rail ---------------- */
    /* The rail is a scroll region first: the buttons only make that obvious
       with a mouse. Nothing auto-advances, so there is no timer to pause. */
    var rail = document.getElementById('featureRail');
    var railPrev = document.getElementById('railPrev');
    var railNext = document.getElementById('railNext');

    if (rail && railPrev && railNext) {
      var step = function () {
        var card = rail.querySelector('.rail-card');
        if (!card) return rail.clientWidth;
        var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
        return card.getBoundingClientRect().width + gap;
      };
      /* A control that cannot do anything says so rather than swallowing
         the press. */
      var syncRail = function () {
        var max = rail.scrollWidth - rail.clientWidth;
        railPrev.disabled = rail.scrollLeft <= 1;
        railNext.disabled = rail.scrollLeft >= max - 1;
      };
      railPrev.addEventListener('click', function () { rail.scrollBy({ left: -step() }); });
      railNext.addEventListener('click', function () { rail.scrollBy({ left: step() }); });
      rail.addEventListener('scroll', syncRail, { passive: true });
      window.addEventListener('resize', syncRail);
      syncRail();
    }

    /* ---------------- theme mode (system / light / dark) ---------------- */
    /* Three states, not two. A two-way switch gives no way back to following
       the operating system once it has been touched: the first click stamps
       `data-theme` and nothing ever removes it. "system" is therefore part of
       the cycle, represented by the *absence* of the attribute and of the
       stored value -- exactly what theme-init.js already expects. */
    var mode = document.getElementById('mode-toggle');
    var modeState = document.getElementById('mode-state');

    if (mode && modeState) {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      var order = ['system', 'light', 'dark'];
      var labels = {
        system: modeState.textContent.trim(),
        light: mode.getAttribute('data-label-light') || 'Light',
        dark: mode.getAttribute('data-label-dark') || 'Dark'
      };

      var current = function () {
        var set = root.getAttribute('data-theme');
        return set === 'light' || set === 'dark' ? set : 'system';
      };

      var apply = function (next) {
        if (next === 'system') {
          root.removeAttribute('data-theme');
          try {
            localStorage.removeItem('theme');
          } catch (e) {
            /* Storage unavailable: the choice applies for this page only. */
          }
        } else {
          root.setAttribute('data-theme', next);
          try {
            localStorage.setItem('theme', next);
          } catch (e) {
            /* Storage unavailable: the choice applies for this page only. */
          }
        }
        modeState.textContent = labels[next];
      };

      modeState.textContent = labels[current()];

      mode.addEventListener('click', function () {
        apply(order[(order.indexOf(current()) + 1) % order.length]);
      });

      /* While the visitor is following the OS, reflect its changes. */
      if (typeof prefersDark.addEventListener === 'function') {
        prefersDark.addEventListener('change', function () {
          if (!root.hasAttribute('data-theme')) {
            modeState.textContent = labels.system;
          }
        });
      }
    }
  });
})();
