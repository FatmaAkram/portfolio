import { $, reduce, sleep } from "../utils.js";

/* demo: streaming answer */
export default function initStream() {
  var q = $("#s-q"),
    a = $("#s-a"),
    src = $("#s-src"),
    mk = $("#s-mk"),
    run = 0;
  var Q = "Can I expense a flight upgrade?",
    A =
      "Only on flights longer than six hours, and your manager has to approve it.";
  function chip() {
    var c = document.createElement("span");
    c.className = "chip1";
    c.textContent = "1";
    a.appendChild(c);
  }
  async function play() {
    var me = ++run;
    q.textContent = "";
    a.textContent = "";
    q.classList.remove("in");
    src.classList.remove("in");
    mk.classList.remove("on");
    if (reduce) {
      q.textContent = Q;
      q.classList.add("in");
      a.textContent = A;
      chip();
      src.classList.add("in");
      mk.classList.add("on");
      return;
    }
    await sleep(350);
    if (me !== run) return;
    q.classList.add("in");
    for (var i = 1; i <= Q.length; i++) {
      q.textContent = Q.slice(0, i);
      await sleep(24);
      if (me !== run) return;
    }
    await sleep(450);
    var w = A.split(" ");
    for (i = 1; i <= w.length; i++) {
      a.textContent = w.slice(0, i).join(" ");
      await sleep(70 + Math.random() * 60);
      if (me !== run) return;
    }
    chip();
    await sleep(450);
    if (me !== run) return;
    src.classList.add("in");
    await sleep(450);
    if (me !== run) return;
    mk.classList.add("on");
  }
  $("#re-stream").addEventListener("click", play);
  var io = new IntersectionObserver(
    function (en) {
      if (en[0].isIntersecting) {
        play();
        io.disconnect();
      }
    },
    { threshold: 0.5 },
  );
  io.observe($("#w-stream"));
}
