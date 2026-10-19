/*
 * Control Centre: navigation drawer, colour mode, header search and the
 * flows that join each list entry to the status ring. Every feature here is
 * an enhancement: without this file the sidebar is a plain list of links,
 * the mode follows the system, the search field stays hidden and the ring
 * is shown without its flows.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function initMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;
    function setMenu(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('data-open', String(open));
    }
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
  }

  function initMode() {
    var mode = document.getElementById('mode-toggle');
    var state = document.getElementById('mode-state');
    if (!mode || !state) return;
    var order = ['system', 'light', 'dark'];
    var labels = {
      system: state.getAttribute('data-label-system'),
      light: mode.getAttribute('data-label-light'),
      dark: mode.getAttribute('data-label-dark')
    };
    function current() {
      var value = root.getAttribute('data-theme');
      return value === 'light' || value === 'dark' ? value : 'system';
    }
    function store(value) {
      try {
        if (value === 'system') localStorage.removeItem('theme');
        else localStorage.setItem('theme', value);
      } catch (error) { /* Storage can be unavailable. */ }
    }
    function apply(value) {
      if (value === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', value);
      store(value);
      state.textContent = labels[value];
      drawFlows();
    }
    state.textContent = labels[current()];
    mode.addEventListener('click', function () {
      apply(order[(order.indexOf(current()) + 1) % order.length]);
    });
  }

  /*
   * The generator injects its own search dialog after this script. The
   * header field hands its query to that dialog, so there is one search
   * implementation and one index. The dialog clears its input when it
   * opens, so the query is written back once it reports itself active.
   * The generator's own floating trigger is detached once the field takes
   * over: a second, hidden search control would still be in the DOM. Its
   * click listener survives detaching, and the dialog's keyboard shortcut
   * is bound on the document, not on the button.
   */
  var trigger = null;

  function handOver(field) {
    var button = trigger;
    var overlay = document.getElementById('ssg-search-overlay');
    var input = document.getElementById('ssg-search-input');
    if (!button || !overlay || !input) return;
    var query = field.value;
    var watch = new MutationObserver(function () {
      if (!overlay.classList.contains('active')) return;
      watch.disconnect();
      input.value = query;
      input.dispatchEvent(new Event('input'));
      field.value = '';
    });
    watch.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    button.click();
  }

  function initSearch() {
    var form = document.querySelector('.cc-search');
    var field = document.getElementById('cc-search-q');
    if (!form || !field) return;
    function ready() {
      var found = document.getElementById('ssg-search-btn');
      if (!found) return false;
      trigger = found;
      if (found.parentNode) found.parentNode.removeChild(found);
      root.classList.add('has-search');
      return true;
    }
    if (!ready()) {
      var seen = new MutationObserver(function () {
        if (ready()) seen.disconnect();
      });
      seen.observe(document.body, { childList: true, subtree: true });
    }
    field.addEventListener('input', function () {
      if (field.value.trim()) handOver(field);
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      handOver(field);
    });
  }

  /* --- flows between the lists and the ring ---------------------------
   * Each flow is drawn in one of the two empty grid columns between a list
   * and the ring, never over text, so contrast tools measure every label
   * against its own solid ground. */
  var map = document.querySelector('.cc-map');

  function sevOf(node) {
    var match = /sev-([a-z]+)/.exec(node.className);
    return match ? match[1] : 'low';
  }

  function curve(x1, y1, x2, y2) {
    var mid = (x1 + x2) / 2;
    return 'M' + x1 + ' ' + y1 + ' C' + mid + ' ' + y1 + ' ' + mid + ' ' + y2 + ' ' + x2 + ' ' + y2;
  }

  function drawGap(svg, nodes, ring, listOnLeft) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var box = svg.getBoundingClientRect();
    if (!box.width || !box.height) return;
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    var cy = ring.top + ring.height / 2 - box.top;
    nodes.forEach(function (node, i) {
      var r = node.getBoundingClientRect();
      var ny = r.top + r.height / 2 - box.top;
      var ry = cy + (i - (nodes.length - 1) / 2) * ring.height * 0.12;
      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', listOnLeft ? curve(0, ny, box.width, ry) : curve(0, ry, box.width, ny));
      path.setAttribute('class', 'cc-flow sev-' + sevOf(node));
      svg.appendChild(path);
    });
  }

  function drawFlows() {
    if (!map) return;
    var dial = map.querySelector('.cc-ring-dial');
    var gapIn = map.querySelector('.cc-flows-in');
    var gapOut = map.querySelector('.cc-flows-out');
    if (!dial || !gapIn || !gapOut) return;
    var ring = dial.getBoundingClientRect();
    drawGap(gapIn, Array.prototype.slice.call(map.querySelectorAll('.cc-list-in .cc-node')), ring, true);
    drawGap(gapOut, Array.prototype.slice.call(map.querySelectorAll('.cc-list-out .cc-node')), ring, false);
  }

  function initFlows() {
    if (!map) return;
    drawFlows();
    if (typeof ResizeObserver === 'function') new ResizeObserver(drawFlows).observe(map);
    else window.addEventListener('resize', drawFlows);
  }

  initMenu();
  initMode();
  initSearch();
  initFlows();
})();
