import { $, $$, reduce } from "../utils.js";

/* demo: connectors */
export default function initConnectors() {
  $$("#cn .sw").forEach(function (s) {
    s.addEventListener("click", function () {
      var li = s.parentNode,
        sm = $("small", li),
        on = s.getAttribute("aria-checked") !== "true";
      s.setAttribute("aria-checked", on ? "true" : "false");
      clearTimeout(li._t);
      if (on) {
        li.classList.add("on");
        sm.textContent = "Syncing…";
        li._t = setTimeout(
          function () {
            sm.textContent = "Synced, " + s.dataset.n + " files";
          },
          reduce ? 0 : 1550,
        );
      } else {
        li.classList.remove("on");
        sm.textContent = "Not connected";
      }
    });
  });
}
