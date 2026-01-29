// scripts/main.js
console.log("Demo framework loaded.");

function ensureGSAP() {
  if (typeof gsap === "undefined") {
    console.warn("GSAP not found. Check the gsap CDN script tag in index.html.");
    return false;
  }
  if (typeof ScrollTrigger === "undefined") {
    console.warn("ScrollTrigger not found. Check the ScrollTrigger CDN script tag in index.html.");
    return false;
  }
  gsap.registerPlugin(ScrollTrigger);
  return true;
}

/**
 * 1) Zoom while scrolling (scrubbed)
 * - Scroll position continuously controls the scale (scrub)
 * - Trigger range is the section's .scroll-track (the one inside #zoom)
 */
function initZoomScrub() {
  const zoomTarget = document.querySelector("#zoomTarget");
  const zoomSection = document.querySelector("#zoom");
  if (!zoomSection || !zoomTarget) {
    console.warn("Zoom scrub elements not found (#zoom, #zoomTarget). Skipping initZoomScrub.");
    return;
  }

  // IMPORTANT: select the scroll-track ONLY inside the zoom section (avoids conflicts)
  const scrollTrack = zoomSection.querySelector(".scroll-track");
  if (!scrollTrack) {
    console.warn("Zoom scrub .scroll-track not found inside #zoom. Skipping initZoomScrub.");
    return;
  }

  // Reset transforms (helps during iteration)
  gsap.set(zoomTarget, { clearProps: "transform" });

  // EDIT HERE: scale value
  gsap.to(zoomTarget, {
    scale: 2.0, // EDIT: how much it zooms (try 1.6–3.0)
    ease: "none",
    scrollTrigger: {
      trigger: scrollTrack,
      start: "top top",
      end: "bottom top",
      scrub: true,
      // markers: true, // DEBUG: show start/end markers
    },
  });
}

/**
 * 2) Scroll to move (scrubbed)
 * - Normal page scroll already moves content.
 * - This adds extra horizontal motion synced to scroll through #scroll-move.
 */
function initScrollMove() {
  const section = document.querySelector("#scroll-move");
  const left = document.querySelector("#moveLeft");
  const right = document.querySelector("#moveRight");

  if (!section || !left || !right) {
    console.warn("Scroll-move elements not found (#scroll-move, #moveLeft, #moveRight). Skipping initScrollMove.");
    return;
  }

  // Reset transforms (helps during iteration)
  gsap.set([left, right], { clearProps: "transform" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: true,
      // markers: true, // DEBUG
    },
  });

  // EDIT HERE: horizontal distances
  tl.to(left, { x: -100, ease: "none" }, 0)
    .to(right, { x: 100, ease: "none" }, 0);

  // If you ever want diagonal, add y here (example):
  // tl.to(left, { x: -100, y: -30, ease: "none" }, 0)
  //   .to(right, { x: 100, y: -30, ease: "none" }, 0);
}

/**
 * 3) Zoom2 “jump” (triggered once, NOT scrubbed)
 * - Scroll only decides WHEN it triggers (when #zoom2 hits start line)
 * - Animation plays at its own speed (fast “jump” forward)
 */
function initZoom2Jump() {
  const section = document.querySelector("#zoom2");
  const cat = document.querySelector("#zoom2Cat");

  if (!section || !cat) {
    console.warn("Zoom2 elements not found (#zoom2, #zoom2Cat). Skipping initZoom2Jump.");
    return;
  }

  // -----------------------------
  // EDIT VALUES HERE (tuning)
  // -----------------------------
  const CAT_START_SCALE = 0.75;  // EDIT: smaller = farther away
  const JUMP_SCALE_PEAK = 1.55;  // EDIT: overshoot (bigger = punchier)
  const JUMP_SCALE_FINAL = 1.45; // EDIT: final scale after settle
  const JUMP_X = 0;             // EDIT: +right / -left
  const JUMP_Y = -30;           // EDIT: -up / +down (small shift sells “jump”)
  const JUMP_TIME = 0.18;       // EDIT: seconds, fast hit
  const SETTLE_TIME = 0.12;     // EDIT: seconds, quick settle
  // -----------------------------

  // Set initial “far” pose
  gsap.set(cat, {
    scale: CAT_START_SCALE,
    x: 0,
    y: 0,
  });

  let played = false;

  ScrollTrigger.create({
    trigger: section,
    start: "top center", // EDIT: when it should trigger
    // markers: true,     // DEBUG: show trigger line
    onEnter: () => {
      if (played) return;
      played = true;

      const tl = gsap.timeline();

      tl.to(cat, {
        scale: JUMP_SCALE_PEAK,
        x: JUMP_X,
        y: JUMP_Y,
        duration: JUMP_TIME,
        ease: "power3.out",
      }).to(cat, {
        scale: JUMP_SCALE_FINAL,
        duration: SETTLE_TIME,
        ease: "power2.out",
      });
    },
  });
}

/**
 * Entry point
 * - Register plugin once
 * - Initialize each section independently (one section failing won’t break others)
 */
function init() {
  const ok = ensureGSAP();
  if (!ok) return;

  initZoomScrub();
  initScrollMove();
  initZoom2Jump();
}

init();
