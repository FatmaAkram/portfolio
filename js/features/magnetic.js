import { $, $$, reduce, hasG } from "../utils.js";

export default function initMagnetic() {
  if (!hasG || reduce || !matchMedia("(hover:hover)").matches) return;
  $$(".mag").forEach(function (b) {
    b.addEventListener("pointermove", function (e) {
      var r = b.getBoundingClientRect();
      gsap.to(b, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.35,
        duration: 0.35,
        ease: "power2.out",
      });
    });
    b.addEventListener("pointerleave", function () {
      gsap.to(b, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1,.45)",
      });
    });
  });
  var cur = $("#cur"),
    qx = gsap.quickTo(cur, "x", { duration: 0.25, ease: "power3" }),
    qy = gsap.quickTo(cur, "y", { duration: 0.25, ease: "power3" });
  window.addEventListener("pointermove", function (e) {
    cur.classList.add("live");
    qx(e.clientX);
    qy(e.clientY);
  });
  document.addEventListener("pointerover", function (e) {
    var hit =
      e.target.closest && e.target.closest('a,button,.orb,[role="button"]');
    gsap.to(cur, {
      scale: hit ? 2.6 : 1,
      opacity: hit ? 0.55 : 1,
      duration: 0.25,
    });
  });
}
