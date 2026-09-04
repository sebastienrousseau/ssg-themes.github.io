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

    /* ---------------- theme toggle ---------------- */
    var themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

      var currentTheme = function () {
        return (
          root.getAttribute('data-theme') ||
          (prefersDark.matches ? 'dark' : 'light')
        );
      };

      /* The visible icon is chosen by CSS from [data-theme]; the only
         state this needs to publish is `aria-pressed`. */
      var syncPressed = function () {
        themeToggle.setAttribute(
          'aria-pressed',
          String(currentTheme() === 'dark')
        );
      };

      syncPressed();

      themeToggle.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try {
          localStorage.setItem('theme', next);
        } catch (e) {
          /* Storage unavailable: the choice applies for this page only. */
        }
        syncPressed();
      });

      /* Track the OS while the visitor has not made an explicit choice. */
      if (typeof prefersDark.addEventListener === 'function') {
        prefersDark.addEventListener('change', function () {
          if (!root.hasAttribute('data-theme')) {
            syncPressed();
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
