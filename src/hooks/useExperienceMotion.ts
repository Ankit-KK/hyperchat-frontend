import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function useExperienceMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let disposed = false;
    const media = gsap.matchMedia();
    document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.05,
        anchors: false,
        prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      });
      // Native hash jumps and browser/test scrolls can precede Lenis's next frame.
      // Sync to the real position before calculating an anchor destination.
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
        lenis.resize();
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        if (location.hash !== url.hash) history.pushState(null, "", url.hash);
        lenis.scrollTo(target);
      };
      window.addEventListener("click", anchor);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          });
        });
        gsap.to(".reading-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
        if (root.current?.querySelector(".hero")) {
          gsap.to(".theatre-scene", {
            rotationY: 0,
            rotationX: 0,
            y: -12,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
          gsap.to(".scene-word", {
            yPercent: -30,
            opacity: 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      }, root);
      return () => {
        window.removeEventListener("click", anchor);
        context.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => {
      disposed = true;
      media.revert();
    };
  }, [root]);
}
