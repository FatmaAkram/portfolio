import { reduce, hasG } from "../utils.js";

/* hero: a calm entrance, then the highlighter and the handwritten note draw in once */
export default function initHero() {
  if (!hasG || reduce) return;
  gsap
    .timeline()
    .from(
      ".hero .hx",
      {
        opacity: 0,
        y: 22,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      },
      0.15,
    )
    .from("#tab", { opacity: 0, duration: 0.9, ease: "power2.out" }, 0.3)
    .fromTo(
      "#swash",
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" },
      0.8,
    )
    .from(".note", { opacity: 0, duration: 0.3 }, 1.5)
    .fromTo(
      "#arrow",
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" },
      1.55,
    );
}
