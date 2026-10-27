import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./experience-motion.css";

gsap.registerPlugin(ScrollTrigger);

export function useExperienceMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const scope = root.current;
      if (!scope) return;
      let disposed = false;
      const revealStyles = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]")).map(element => ({
        element, opacity: element.style.opacity, transform: element.style.transform,
      }));
      const lenis = new Lenis({
        // Frame-rate-independent damping: responsive wheel input, a short settle.
        lerp: 0.12,
        syncTouch: false,
        anchors: false,
        allowNestedScroll: true,
        prevent: (node) => node.hasAttribute("data-lenis-prevent") || node.matches("textarea, select, [contenteditable='true']"),
      });
      const temporaryFocus = new Map<HTMLElement, () => void>();
      const focusDestination = (target: HTMLElement) => {
        if (!target.hasAttribute("tabindex") && !target.matches("a, button, input, select, textarea")) {
          target.setAttribute("tabindex", "-1");
          const restore = () => { target.removeAttribute("tabindex"); target.removeEventListener("blur", restore); temporaryFocus.delete(target); };
          temporaryFocus.set(target, restore);
          target.addEventListener("blur", restore, { once: true });
        }
        target.focus({ preventScroll: true });
      };
      const anchor = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.composedPath().find(node => node instanceof HTMLAnchorElement) as HTMLAnchorElement | undefined;
        if (!link || link.target === "_blank" || link.hasAttribute("download") || link.classList.contains("skip-link")) return;
        const url = new URL(link.href);
        if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
        let target: HTMLElement | null;
        try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
        if (!target) return;
        event.preventDefault();
        // Keep native history, CSS scroll padding and scroll margins authoritative.
        lenis.resize();
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        if (location.hash !== url.hash) history.pushState(null, "", url.hash);
        const duration = Math.min(1.25, Math.max(0.55, Math.abs(target.getBoundingClientRect().top) / 4200));
        lenis.scrollTo(target, {
          duration,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
          onComplete: () => { if (!disposed && target?.isConnected) focusDestination(target); },
        });
      };
      window.addEventListener("click", anchor);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      scope.classList.add("experience-motion");
      const context = gsap.context((self) => {
        // Already-visible content (including direct hash destinations) stays visible.
        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]")
          .filter(element => element.getBoundingClientRect().top >= window.innerHeight * 0.92);
        gsap.set(reveals, { y: 22, opacity: 0 });
        const reveal = (elements: Element[]) => self.add(() => {
          gsap.to(elements, {
            y: 0, opacity: 1, duration: 0.72, stagger: 0.075,
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
        gsap.to(".reading-progress", {
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
      }, root);
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
      const refresh = gsap.delayedCall(0.2, () => { if (!disposed) ScrollTrigger.refresh(); }).pause();
      let contentHeight = scope.offsetHeight;
      const sizing = new ResizeObserver(() => {
        const height = scope.offsetHeight;
        if (Math.abs(height - contentHeight) > 1) { contentHeight = height; refresh.restart(true); }
      });
      sizing.observe(scope);
      document.fonts.ready.then(() => { if (!disposed) refresh.restart(true); });
      return () => {
        disposed = true;
        sizing.disconnect();
        refresh.kill();
        scope.removeEventListener("focusin", focusReveal);
        window.removeEventListener("click", anchor);
        temporaryFocus.forEach(restore => restore());
        context.revert();
        // Batched tweens can overwrite the initial set tween; explicitly restore
        // the original inline values as well when motion is disabled.
        revealStyles.forEach(({ element, opacity, transform }) => {
          element.style.opacity = opacity;
          element.style.transform = transform;
        });
        scope.classList.remove("experience-motion");
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, [root]);
}
