import { $, $$ } from "../utils.js";

/* demo: entities */
export default function initEntities() {
  var box = $("#w-ent");
  $$(".chip", box).forEach(function (c) {
    c.addEventListener("click", function () {
      var was = c.getAttribute("aria-pressed") === "true";
      $$(".chip", box).forEach(function (o) {
        o.setAttribute("aria-pressed", "false");
      });
      if (was) box.removeAttribute("data-only");
      else {
        c.setAttribute("aria-pressed", "true");
        box.setAttribute("data-only", c.dataset.t);
      }
    });
  });
}
