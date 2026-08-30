/* Applies the stored colour scheme before first paint, so a reader who
 * chose one does not see the other flash first. Kept tiny and synchronous
 * for that reason; everything else is deferred. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  try {
    var saved = localStorage.getItem("quill-theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {
    /* Private mode and blocked storage both throw; the system scheme stands. */
  }
})();
