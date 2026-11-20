import { $, $$ } from "../utils.js";

/* bottom tab bar with sliding indicator */
export default function initTabBar() {
  var tab = $("#tab"),
    ind = $("i", tab),
    links = $$("a", tab),
    map = {};
  function move() {
    var a = $("a.on", tab);
    if (!a) return;
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = "translateX(" + a.offsetLeft + "px)";
  }
  links.forEach(function (a) {
    map[a.getAttribute("href").slice(1)] = a;
  });
  var secs = Object.keys(map)
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  function spy() {
    var cur = secs[0],
      mid = window.innerHeight * 0.3;
    secs.forEach(function (s) {
      if (s.getBoundingClientRect().top <= mid) cur = s;
    });
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4
    )
      cur = secs[secs.length - 1];
    var a = map[cur.id];
    if (!a.classList.contains("on")) {
      links.forEach(function (l) {
        l.classList.remove("on");
      });
      a.classList.add("on");
      move();
    }
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();
  move();
  window.addEventListener("resize", move);
  window.addEventListener("load", move);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(move);
}
