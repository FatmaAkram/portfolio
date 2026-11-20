import { $, root } from "../utils.js";

const themeSubs = [];

/* Register a callback that runs whenever the light/dark theme changes. */
export function onThemeChange(fn) {
  themeSubs.push(fn);
}

export default function initTheme() {
  $("#theme").addEventListener("click", function () {
    var dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
  });
  var fire = function () {
    themeSubs.forEach(function (f) {
      f();
    });
  };
  new MutationObserver(fire).observe(root, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", fire);
}
