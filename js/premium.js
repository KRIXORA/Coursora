/**
 * Premium interactions — site-wide polish
 * - Scroll progress bar
 * - Header elevates / densifies on scroll
 * - Pointer-driven 3D tilt on course & path cards (only while hovering)
 * - Magnetic pull on primary CTAs
 * - Reduced-motion safe
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Scroll progress ─────────────────────────────────────────── */
  const bar = document.querySelector(".scroll-progress__bar");
  const header = document.querySelector(".header");

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (header) header.classList.toggle("is-scrolled", doc.scrollTop > 12);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (reduce) return;

  /* ── 3D tilt on cards (pointer-driven, single card at a time) ── */
  const TILT_MAX = 7; // degrees
  const TILT_SCALE = 1.015;

  function attachTilt(el) {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = "1";

    let raf = 0;
    let targetRX = 0,
      targetRY = 0,
      curRX = 0,
      curRY = 0;
    let hovering = false;

    function frame() {
      curRX += (targetRX - curRX) * 0.14;
      curRY += (targetRY - curRY) * 0.14;
      el.style.transform = hovering
        ? `perspective(900px) rotateX(${curRX}deg) rotateY(${curRY}deg) scale(${TILT_SCALE}) translateY(-4px)`
        : "";
      if (hovering || Math.abs(curRX) > 0.05 || Math.abs(curRY) > 0.05) {
        raf = requestAnimationFrame(frame);
      } else {
        el.style.transform = "";
        raf = 0;
      }
    }

    el.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "touch") return;
      hovering = true;
      el.classList.add("is-tilting");
      if (!raf) raf = requestAnimationFrame(frame);
    });

    el.addEventListener("pointermove", (e) => {
      if (!hovering || e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0–1
      const py = (e.clientY - r.top) / r.height;
      targetRY = (px - 0.5) * 2 * TILT_MAX;
      targetRX = (0.5 - py) * 2 * TILT_MAX;
    });

    el.addEventListener("pointerleave", () => {
      hovering = false;
      el.classList.remove("is-tilting");
      targetRX = 0;
      targetRY = 0;
    });
  }

  function bindTilts() {
    document
      .querySelectorAll(".course-card, .learning-path-card")
      .forEach(attachTilt);
  }

  // Initial + after course re-renders
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindTilts);
  } else {
    bindTilts();
  }

  // Re-bind when course list mutates
  const list = document.getElementById("course-list");
  if (list && "MutationObserver" in window) {
    const mo = new MutationObserver(() => bindTilts());
    mo.observe(list, { childList: true });
  }

  // Learning paths grid may render async
  const paths = document.getElementById("learning-paths") || document.querySelector("[data-paths]");
  if (paths && "MutationObserver" in window) {
    new MutationObserver(() => bindTilts()).observe(paths, { childList: true, subtree: true });
  }

  /* ── Magnetic primary buttons ───────────────────────────────── */
  function attachMagnetic(el, strength = 0.28) {
    if (el.dataset.magBound) return;
    el.dataset.magBound = "1";
    el.classList.add("magnetic");

    el.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  }

  function bindMagnetic() {
    document
      .querySelectorAll(
        "#install-app-btn, form button[type='submit'], .course-card .details > a:first-of-type, #copy-link-btn, #open-command-palette"
      )
      .forEach((el) => attachMagnetic(el, 0.22));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindMagnetic);
  } else {
    bindMagnetic();
  }
  if (list && "MutationObserver" in window) {
    new MutationObserver(() => bindMagnetic()).observe(list, { childList: true });
  }
})();

/* ── Back to top ──────────────────────────────────────────────── */
(function () {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const SHOW_AFTER = 420; // px scrolled

  function update() {
    const y = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle("is-visible", y > SHOW_AFTER);
  }

  window.addEventListener("scroll", update, { passive: true });
  update();

  btn.addEventListener("click", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
})();


/* Home ambient parallax (subtle) */
(function () {
  if (!document.body.classList.contains("home-page")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const orbs = document.querySelectorAll(".home-ambient__orb");
  if (!orbs.length) return;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY * 0.03;
      orbs.forEach((o, i) => {
        o.style.transform = `translate3d(0, ${y * (i ? -0.5 : 1)}px, 0)`;
      });
    },
    { passive: true }
  );
})();
