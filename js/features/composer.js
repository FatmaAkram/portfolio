import { $ } from "../utils.js";

/* composer */
export default function initComposer() {
  var q = $("#q"),
    send = $("#send"),
    to = "mailto:fatma.ak.khater@gmail.com";
  function upd() {
    var v = q.value.trim();
    send.href = v
      ? to +
        "?subject=" +
        encodeURIComponent("Message from your portfolio") +
        "&body=" +
        encodeURIComponent(v)
      : to;
  }
  q.addEventListener("input", upd);
  q.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      upd();
      send.click();
    }
  });
}
