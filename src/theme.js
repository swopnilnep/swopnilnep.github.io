// Flip and persist the light/dark theme. Default follows the OS; a manual
// choice is stored in localStorage and re-applied (flash-free) by a small
// inline script in each page's <head>.
(function () {
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var el = document.documentElement;
    var cur = el.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    el.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();
