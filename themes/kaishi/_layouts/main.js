/*!
 * Kaishi behaviour: a navigation disclosure, a theme toggle, and adoption
 * of the generator's search trigger into the header.
 *
 * Both controls are present and usable in the markup before this file
 * runs; this only upgrades them.
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

    /* ---------------- navigation disclosure ---------------- */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
      var setNav = function (open) {
        navToggle.setAttribute('aria-expanded', String(open));
        navMenu.setAttribute('data-open', String(open));
      };

      setNav(false);

      navToggle.addEventListener('click', function () {
        setNav(navToggle.getAttribute('aria-expanded') !== 'true');
      });

      /* Escape closes the menu and returns focus to the control that
         opened it, so keyboard users are never stranded inside it. */
      navMenu.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          setNav(false);
          navToggle.focus();
        }
      });

      document.addEventListener('click', function (event) {
        if (
          navToggle.getAttribute('aria-expanded') === 'true' &&
          !navMenu.contains(event.target) &&
          !navToggle.contains(event.target)
        ) {
          setNav(false);
        }
      });

      /* Re-opening the desktop layout must not leave the menu in the
         collapsed state the small-screen rules depend on. */
      var wide = window.matchMedia('(min-width: 48rem)');
      var syncWidth = function (mq) {
        if (mq.matches) {
          setNav(false);
        }
      };
      if (typeof wide.addEventListener === 'function') {
        wide.addEventListener('change', syncWidth);
      }
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


    /* ---------------- adopt the search trigger ----------------
     *
     * `ssg` injects #ssg-search-btn as `position: fixed` in the top-right
     * corner, after this script runs. Left there it floats above the page:
     * at narrow desktop widths it lands on top of the last navigation item,
     * and it can cover focused content. Moving it into the nav takes it out
     * of the fixed layer and lets it flow with the other header controls.
     *
     * The button does not exist yet at DOMContentLoaded, so this watches for
     * it and stops as soon as it lands — or after ten seconds, so a page
     * without search does not observe forever. */
    var nav = document.querySelector('.site-nav');

    function adoptSearch() {
      var btn = document.getElementById('ssg-search-btn');
      if (!btn || !nav || btn.parentNode === nav) return false;
      nav.appendChild(btn);
      btn.style.position = 'static';
      return true;
    }

    if (nav && !adoptSearch() && typeof MutationObserver === 'function') {
      var mo = new MutationObserver(function () {
        if (adoptSearch()) mo.disconnect();
      });
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () {
        mo.disconnect();
      }, 10000);
    }
  });
})();
