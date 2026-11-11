import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/** Loaded only for fine pointers with motion enabled; touch scrolling stays native. */
export function mountDesktopExperience(scope: HTMLDivElement) {
  let motionDisposed = false;
  const revealStyles = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]")).map(element => ({
    element, opacity: element.style.opacity, transform: element.style.transform,
  }));
  const scrolling = new Lenis({
    // Frame-rate-independent damping: responsive wheel input, a short settle.
    lerp: 0.16,
    syncTouch: false,
    anchors: false,
    allowNestedScroll: true,
    prevent: (node) => node.hasAttribute("data-lenis-prevent") || node.matches("textarea, select, [contenteditable='true']"),
  });
  scrolling.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => scrolling.raf(time * 1000);
  gsap.ticker.add(tick);
  scope.classList.add("experience-motion");
  const context = gsap.context((self) => {
    // Already-visible content (including direct hash destinations) stays visible.
    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]")
      .filter(element => element.getBoundingClientRect().top >= window.innerHeight * 0.92);
    gsap.set(reveals, { y: 16, opacity: 0 });
    const reveal = (elements: Element[]) => self.add(() => {
      gsap.to(elements, {
        y: 0, opacity: 1, duration: 0.55, stagger: 0.05,
        ease: "power3.out", overwrite: true, clearProps: "transform,opacity",
      });
    });
    ScrollTrigger.batch(reveals, {
      start: "top 92%", interval: 0.08, batchMax: 3, once: true,
      onEnter: reveal, onEnterBack: reveal,
    });
    gsap.utils.toArray<HTMLElement>(".section-label").forEach(label => {
      if (label.getBoundingClientRect().top < window.innerHeight * 0.94) return;
      gsap.fromTo(label, { "--section-rule": 0 }, {
        "--section-rule": 1, duration: 0.85, ease: "power2.out",
        scrollTrigger: { trigger: label, start: "top 94%", once: true },
      });
    });
    if (!CSS.supports("animation-timeline: scroll()")) gsap.to(".reading-progress", {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.15 },
    });
    if (scope.querySelector(".hero")) {
      gsap.to(".theatre-scene", {
        rotationY: 0, rotationX: 0, y: -18, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.65 },
      });
      gsap.to(".scene-word", {
        yPercent: -30, opacity: 0.45, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.65 },
      });
    }
  }, scope);
  // Tabbing into a pending reveal must never leave the focused control hidden.
  const focusReveal = (event: FocusEvent) => {
    if (!(event.target instanceof Element)) return;
    const reveal = event.target.closest<HTMLElement>("[data-reveal]");
    if (!reveal) return;
    gsap.killTweensOf(reveal);
    gsap.set(reveal, { clearProps: "transform,opacity" });
  };
  scope.addEventListener("focusin", focusReveal);
  // Creator list expansion and loaded content can change the page's height.
  const refresh = gsap.delayedCall(0.2, () => { if (!motionDisposed) { scrolling.resize(); ScrollTrigger.refresh(); } }).pause();
  let contentHeight = scope.offsetHeight;
  const sizing = new ResizeObserver(() => {
    const height = scope.offsetHeight;
    if (Math.abs(height - contentHeight) > 1) { contentHeight = height; refresh.restart(true); }
  });
  sizing.observe(scope);
  document.fonts.ready.then(() => { if (!motionDisposed) refresh.restart(true); });
  return { scrolling, destroy: () => {
    motionDisposed = true;
    sizing.disconnect();
    refresh.kill();
    scope.removeEventListener("focusin", focusReveal);
    context.revert();
    // Batched tweens can overwrite the initial set tween; explicitly restore
    // the original inline values as well when motion is disabled.
    revealStyles.forEach(({ element, opacity, transform }) => {
      element.style.opacity = opacity;
      element.style.transform = transform;
    });
    scope.classList.remove("experience-motion");
    gsap.ticker.remove(tick);
    scrolling.destroy();
  } };
}
