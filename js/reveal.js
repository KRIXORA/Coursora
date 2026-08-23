// ==========================================================
// SCROLL REVEAL — portfolio (krixora-portfolio.vercel.app) jaisa
// professional one-time reveal effect, IntersectionObserver se.
//
// Continuous scroll-tracking (jaise CSS animation-timeline: view())
// use nahi kiya kyunki wo bahut zyada elements (jaise 100+ course
// cards) ke saath scroll lag karta hai. IntersectionObserver har
// element ke liye sirf ek baar fire hota hai, phir unobserve ho
// jaata hai — halka aur smooth, chahe kitne bhi cards hon.
// ==========================================================

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Group ke andar har item ko thoda-thoda delay dete hain, taaki
// cascade/stagger effect aaye (ek-ek karke reveal hone jaisa)
const applyRevealStagger = () => {
  const STAGGER_STEP_MS = 60;
  const STAGGER_MAX_STEPS = 8;

  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const items = group.querySelectorAll("[data-reveal], [data-reveal-scale]");
    items.forEach((item, index) => {
      const step = Math.min(index, STAGGER_MAX_STEPS);
      item.style.transitionDelay = `${step * STAGGER_STEP_MS}ms`;
    });
  });
};

// Isko dobara call karna safe hai — jaise naye course cards render
// hone ke baad, taaki wo bhi reveal ho sakein
function initScrollReveal() {
  applyRevealStagger();

  const targets = [...document.querySelectorAll("[data-reveal], [data-reveal-scale]")];
  if (!targets.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  targets.forEach((el) => {
    // Agar already revealed hai (dobara call hone par), dobara observe mat karo
    if (!el.classList.contains("is-revealed")) {
      observer.observe(el);
    }
  });
}

// Static content (jo page load pe hi maujood hai) ke liye turant chalao
document.addEventListener("DOMContentLoaded", initScrollReveal);
