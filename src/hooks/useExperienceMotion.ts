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
        anchors: true,
        prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      });
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
