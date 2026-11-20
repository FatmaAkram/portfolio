/* Shared DOM helpers and environment flags used by every feature. */

export function $(s, r) {
  return (r || document).querySelector(s);
}

export function $$(s, r) {
  return [].slice.call((r || document).querySelectorAll(s));
}

export const root = document.documentElement;
export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasG = typeof gsap !== "undefined";
export const hasST = hasG && typeof ScrollTrigger !== "undefined";

export function sleep(ms) {
  return new Promise(function (r) {
    setTimeout(r, ms);
  });
}

export function cssv(n) {
  return getComputedStyle(root).getPropertyValue(n).trim();
}

/* Run one feature; if it throws, log it and keep the rest of the page working. */
export function safe(name, fn) {
  try {
    fn();
  } catch (e) {
    if (window.console) console.warn(name, e);
  }
}
