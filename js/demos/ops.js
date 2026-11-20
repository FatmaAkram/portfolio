import { $, $$ } from "../utils.js";

/* demo: request board with audit line */
export default function initOps() {
  var S = [
      ["Validating", "#A6E3DA"],
      ["Needs clarification", "#FFB7CF"],
      ["Signed off", "#FFE45C"],
    ],
    st = [2, 0, 1, 0],
    log = $("#ops-log");
  $$("#ops li").forEach(function (li, i) {
    var b = $(".pl", li),
      name = $("span", li).textContent;
    function paint() {
      b.textContent = S[st[i]][0];
      b.style.background = S[st[i]][1];
      b.setAttribute(
        "aria-label",
        name + ": " + S[st[i]][0] + ". Select to advance.",
      );
    }
    paint();
    b.addEventListener("click", function () {
      st[i] = (st[i] + 1) % 3;
      paint();
      var t = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      log.textContent =
        t + ", “" + name + "” moved to " + S[st[i]][0].toLowerCase() + ".";
    });
  });
}
