// ─────────────────────────────────────────────────────────────────────────
// Portfolio interactions — plain JS, no jQuery.
//   1. Reveal-on-scroll (IntersectionObserver)
//   2. Scroll-spy nav highlight
//   3. Sticky nav background swap on scroll
//   4. Cursor glow follower (desktop)
//   5. Theme toggle (persisted)
//   6. Footer year stamp
// ─────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ── 1. Reveal-on-scroll ─────────────────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    // Fallback — show everything.
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // ── 2. Scroll-spy nav ───────────────────────────────────────────────────
  const navLinks = document.querySelectorAll(".nav__links a");
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        // Use the entry with the largest visible ratio.
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((a) => {
              const active = a.getAttribute("href") === "#" + id;
              a.classList.toggle("is-active", active);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // ── 3. Nav background on scroll ─────────────────────────────────────────
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 16) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ── 4. Cursor glow (desktop, pointer:fine only) ─────────────────────────
  const glow = document.getElementById("cursorGlow");
  if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });
    const tick = () => {
      // Easing for smooth trail.
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ── 5. Theme toggle ─────────────────────────────────────────────────────
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const STORAGE_KEY = "portfolio-theme";

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
  };

  // Initial theme: stored → system → dark.
  let initial = "dark";
  try { initial = localStorage.getItem(STORAGE_KEY) || initial; } catch (_) {}
  if (!initial || initial === "system") {
    initial = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  applyTheme(initial);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  // ── 6. Year ─────────────────────────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
