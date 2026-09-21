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
    var labels = { system: 'Theme', light: mode.dataset.labelLight, dark: mode.dataset.labelDark };
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

  /* Search is deliberately absent from Visage's compact, trust-led
   * navigation. Remove the generator widget instead of leaving a visually
   * hidden fixed control in the accessibility and layout trees. */
  var searchWidget = document.getElementById('ssg-search-widget');
  var searchButton = document.getElementById('ssg-search-btn');
  if (searchWidget) searchWidget.remove();
  else if (searchButton) searchButton.remove();
})();
