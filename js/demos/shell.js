import { $, reduce } from "../utils.js";

/* demo: micro-frontend shell */
export default function initShell() {
  var names = ["Chat", "Admin", "Sources", "Entities", "Settings"],
    ver = [14, 8, 21, 5, 11],
    box = $("#apps"),
    next = 0,
    busy = false;
  names.forEach(function (n, i) {
    var d = document.createElement("div");
    d.className = "app";
    d.innerHTML = "<b>" + n + "</b><span>v2." + ver[i] + "</span>";
    box.appendChild(d);
  });
  $("#deploy").addEventListener("click", function () {
    if (busy) return;
    busy = true;
    var i = next;
    next = (next + 1) % names.length;
    var el = box.children[i];
    el.classList.add("dep");
    setTimeout(
      function () {
        el.classList.remove("dep");
        ver[i]++;
        $("span", el).textContent = "v2." + ver[i];
        el.classList.add("new");
        setTimeout(function () {
          el.classList.remove("new");
          busy = false;
        }, 900);
      },
      reduce ? 50 : 1400,
    );
  });
}
