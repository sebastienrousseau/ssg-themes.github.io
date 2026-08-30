/* Progressive enhancement only. Without JavaScript the navigation is a
 * plain list and the colour scheme follows the system: nothing here is
 * required to read the blog. */
(function () {
  "use strict";

  var root = document.documentElement;

  /* Measured layout chrome. The masthead's height depends on how many rows
   * it wraps to, which depends on how long the translated labels are, and
   * the generator injects its search button after load as position:fixed.
   * Both are measured rather than assumed, so anchor offsets stay correct
   * at any width and in any language. */
  function syncChrome() {
    var head = document.querySelector(".masthead");
    if (head) {
      var h = head.getBoundingClientRect().height;
      root.style.setProperty("--masthead-h", Math.ceil(h) + "px");
      root.style.setProperty(
        "--masthead-pos",
        h > window.innerHeight * 0.25 ? "relative" : "sticky"
      );
    }
    var btn = document.getElementById("ssg-search-btn");
    var tools = document.querySelector(".masthead-tools");
    if (btn && tools && btn.parentNode !== tools) {
      /* Adopting the button into the header takes it out of the fixed layer,
       * where it could sit on top of focused content. */
      tools.appendChild(btn);
    }
  }

  syncChrome();
  window.addEventListener("resize", syncChrome, { passive: true });
  if (window.ResizeObserver && document.querySelector(".masthead")) {
    new ResizeObserver(syncChrome).observe(document.querySelector(".masthead"));
  }
  if (window.MutationObserver) {
    var mo = new MutationObserver(function () {
      if (document.getElementById("ssg-search-btn")) { syncChrome(); mo.disconnect(); }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 10000);
  }

  /* 2.4.12 for elements taller than the viewport. scroll-padding-top only
   * applies when the browser decides to scroll at all; an element taller
   * than the screen is always partly in view, so focus leaves its top edge
   * under the sticky masthead. */
  document.addEventListener("focusin", function (event) {
    var el = event.target;
    if (!el || typeof el.getBoundingClientRect !== "function") return;
    var head = document.querySelector(".masthead");
    if (!head) return;
    var pos = window.getComputedStyle(head).position;
    if (pos !== "sticky" && pos !== "fixed") return;
    var clear = head.getBoundingClientRect().bottom + 8;
    var top = el.getBoundingClientRect().top;
    if (top < clear) window.scrollBy(0, top - clear);
  });

  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var mode = document.getElementById("mode-toggle");
  var state = document.getElementById("mode-state");
  if (!mode || !state) return;

  /* The cycle includes "system" deliberately: a two-way switch gives no way
   * back to following the operating system once it has been touched. */
  var order = ["system", "light", "dark"];
  var labels = {
    system: state.textContent.trim(),
    light: mode.getAttribute("data-label-light") || "Light",
    dark: mode.getAttribute("data-label-dark") || "Dark"
  };

  function current() {
    var set = root.getAttribute("data-theme");
    return set === "light" || set === "dark" ? set : "system";
  }

  function apply(next) {
    if (next === "system") {
      root.removeAttribute("data-theme");
      try { localStorage.removeItem("quill-theme"); } catch (e) {}
    } else {
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("quill-theme", next); } catch (e) {}
    }
    state.textContent = labels[next];
  }

  state.textContent = labels[current()];
  mode.addEventListener("click", function () {
    apply(order[(order.indexOf(current()) + 1) % order.length]);
  });
})();
