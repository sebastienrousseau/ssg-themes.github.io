(function () {
  'use strict';
  var root = document.documentElement;
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  var mode = document.getElementById('mode-toggle');
  var state = document.getElementById('mode-state');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('data-open', String(open));
  }

  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });
  }

  if (mode && state) {
    var order = ['system', 'light', 'dark'];
    var labels = { system: 'System', light: mode.dataset.labelLight, dark: mode.dataset.labelDark };
    function current() {
      var value = root.getAttribute('data-theme');
      return value === 'light' || value === 'dark' ? value : 'system';
    }
    function apply(value) {
      if (value === 'system') {
        root.removeAttribute('data-theme');
        try { localStorage.removeItem('theme'); } catch (error) { /* no-op */ }
      } else {
        root.setAttribute('data-theme', value);
        try { localStorage.setItem('theme', value); } catch (error) { /* no-op */ }
      }
      state.textContent = labels[value];
    }
    state.textContent = labels[current()];
    mode.addEventListener('click', function () {
      apply(order[(order.indexOf(current()) + 1) % order.length]);
    });
  }

  /*
   * SSG adds its search widget after the theme script. Adopt the trigger into
   * the navigation row so it cannot cover adjacent controls or focused page
   * content. On compact layouts it becomes the final control in the disclosed
   * mobile menu instead of floating above the document.
   */
  if (menu && typeof MutationObserver === 'function') {
    var searchObserver;
    function placeSearch() {
      var button = document.getElementById('ssg-search-btn');
      if (!button) return false;
      if (button.parentNode !== menu) menu.appendChild(button);
      button.style.position = 'static';
      button.style.inset = 'auto';
      button.style.boxShadow = 'none';
      return true;
    }
    if (!placeSearch()) {
      searchObserver = new MutationObserver(function () {
        if (placeSearch()) searchObserver.disconnect();
      });
      searchObserver.observe(document.body, { childList: true, subtree: true });
    }
  }
})();
