import { $$, reduce, hasST } from "../utils.js";
import { orbIntro } from "./orb.js";

/* scroll motion */
export default function initScrollMotion() {
  if (!hasST || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(orbIntro, {
    v: 1,
    duration: 2,
    ease: "expo.out",
    scrollTrigger: { trigger: "#orb", start: "top 78%", once: true },
  });
  gsap.set(".rv", { opacity: 0 });
  ScrollTrigger.batch(".rv", {
    start: "top 92%",
    once: true,
    onEnter: function (b) {
      gsap.fromTo(
        b,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          overwrite: true,
        },
      );
    },
  });
  $$(".h2, .txt h3").forEach(function (h) {
    gsap.from(h, {
      opacity: 0,
      y: 24,
      filter: "blur(8px)",
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: h, start: "top 92%", once: true },
    });
  });
  $$(".facts div").forEach(function (d) {
    gsap.from(d, {
      opacity: 0,
      x: -14,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: d, start: "top 94%", once: true },
    });
  });
}
