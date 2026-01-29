console.log("Demo framework loaded.");

// main.js
// Zoom-in while scrolling (ScrollTrigger scrub)

(function init() {
    // Basic guard so the page doesn't crash if elements are missing
    const zoomTarget = document.querySelector("#zoomTarget");
    const zoomSection = document.querySelector("#zoom");
    const scrollTrack = document.querySelector(".scroll-track");
  
    if (!zoomTarget || !zoomSection || !scrollTrack) {
      console.warn("Zoom section elements not found. Skipping zoom init.");
      return;
    }
  
    // Make sure GSAP + ScrollTrigger are available (CDN loaded)
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("GSAP or ScrollTrigger not found. Did you add the CDN scripts?");
      return;
    }
  
    gsap.registerPlugin(ScrollTrigger);
  
    // Optional: reset any previous inline transforms (helps during iteration)
    gsap.set(zoomTarget, { clearProps: "transform" });
  
    // Core scrub animation:
    // - start when the zoom section hits the top
    // - end after a certain scroll distance (we tie it to the scroll-track)
    // - scrub: true means "scroll position = animation progress"
    gsap.to(zoomTarget, {
      scale: 2.0,              // adjust to taste (try 1.6–3.0)
      ease: "none",            // important for scrub; keeps it linear to scroll
      scrollTrigger: {
        trigger: scrollTrack,  // uses the long track as the scroll range
        start: "top top",
        end: "bottom top",
        scrub: true,
        // markers: true,      // turn on while debugging, then set false/remove
      },
    });
  })();
  
  markers: true;




  function initScrollMove() {
    const section = document.querySelector("#scroll-move");
    const left = document.querySelector("#moveLeft");
    const right = document.querySelector("#moveRight");
  
    if (!section || !left || !right) return;
  
    // Optional: clear transforms when you refresh during dev
    gsap.set([left, right], { clearProps: "transform" });
  
    // One timeline controls both items, synced to scrolling through this section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: true,
        // markers: true,
      },
    });
  
    // Move diagonally: (x, y)
    tl.to(left, { x: -100, y:-30, ease: "none" }, 0)
      .to(right, { x: 100, y:-30, ease: "none" }, 0);
  }
  
  initScrollMove();  

  function initZoom2Jump() {
    const section = document.querySelector("#zoom2");
    const cat = document.querySelector("#zoom2Cat");
  
    if (!section || !cat) {
      console.warn("Zoom2 elements not found. Skipping initZoom2Jump.");
      return;
    }
  
    // -----------------------------
    // EDIT VALUES HERE (tuning)
    // -----------------------------
    const CAT_START_SCALE = 0.75;  // cat looks "farther away"
    const JUMP_SCALE_PEAK = 1.55;  // overshoot scale (bigger = punchier)
    const JUMP_SCALE_FINAL = 1.45; // settle scale after overshoot
    const JUMP_X = 0;             // px: +right / -left
    const JUMP_Y = -30;           // px: -up / +down (small shift sells the jump)
    const JUMP_TIME = 0.18;       // seconds: fast hit
    const SETTLE_TIME = 0.12;     // seconds: quick settle
    // -----------------------------
  
    // Set initial "far" pose (important so jump has contrast)
    gsap.set(cat, {
      scale: CAT_START_SCALE,
      x: 0,
      y: 0,
    });
  
    let played = false;
  
    ScrollTrigger.create({
      trigger: section,
      start: "top center",     // EDIT: when the trigger should happen
      // end not necessary for a one-shot trigger
      // markers: true,        // uncomment to debug start position
      onEnter: () => {
        if (played) return;
        played = true;
  
        // Time-based “jump” animation (NOT scrubbed)
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
  
  // Call it once (alongside your other init functions)
  initZoom2Jump();
  
