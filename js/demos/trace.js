import { $$ } from "../utils.js";

/* demo: summary to source */
export default function initTrace() {
  $$("#w-trace button").forEach(function (b) {
    var t = document.getElementById(b.dataset.s);
    var on = function () {
      $$("#w-trace .on").forEach(function (e) {
        e.classList.remove("on");
      });
      b.classList.add("on");
      t.classList.add("on");
    };
    b.addEventListener("mouseenter", on);
    b.addEventListener("focus", on);
    b.addEventListener("click", on);
  });
}
