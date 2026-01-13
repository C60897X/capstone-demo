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