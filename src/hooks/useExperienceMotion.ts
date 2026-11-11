import { useEffect, type RefObject } from "react";
import type Lenis from "lenis";
import "./experience-motion.css";


export function useExperienceMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let disposed = false;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
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
    const interrupt = () => {
      if (!lenis || lenis.isStopped) return;
      lenis.stop();
      lenis.start();
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
      interrupt();
      lenis?.resize();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      if (!lenis) {
        focusDestination(target);
        target.scrollIntoView({ behavior: reduceMotion.matches ? "instant" : "smooth", block: "start" });
        return;
      }
      const distance = Math.abs(target.getBoundingClientRect().top);
      const duration = Math.min(1.15, Math.max(0.4, 0.35 + distance / 6500));
      lenis.scrollTo(target, {
        duration,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => { if (!disposed && target?.isConnected) focusDestination(target); },
      });
    };
    window.addEventListener("click", anchor);

    // Yield immediately to native keyboard/focus/history navigation. Otherwise a
    // still-running anchor tween can pull the viewport back after a user's action.
    const keyboard = (event: KeyboardEvent) => {
      const editable = event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])");
      if (event.key === "Tab" || event.key === "Escape" || (!editable && ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key))) interrupt();
    };
    const visibility = () => { if (document.hidden) interrupt(); };
    window.addEventListener("keydown", keyboard);
    window.addEventListener("popstate", interrupt);
    window.addEventListener("pagehide", interrupt);
    document.addEventListener("visibilitychange", visibility);
    root.current?.addEventListener("focusin", interrupt);
    const scope = root.current;
    const media = matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    let generation = 0;
    let destroyMotion: (() => void) | undefined;
    const configureMotion = () => {
      const current = ++generation;
      destroyMotion?.();
      destroyMotion = undefined;
      lenis = null;
      if (!media.matches || !scope) return;
      void import("./desktop-experience").then(({ mountDesktopExperience }) => {
        if (disposed || current !== generation) return;
        const experience = mountDesktopExperience(scope);
        lenis = experience.scrolling;
        destroyMotion = experience.destroy;
      }).catch(() => {
        // An unavailable enhancement must leave native scrolling and links usable.
      });
    };
    media.addEventListener("change", configureMotion);
    configureMotion();

    return () => {
      disposed = true;
      window.removeEventListener("click", anchor);
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("popstate", interrupt);
      window.removeEventListener("pagehide", interrupt);
      document.removeEventListener("visibilitychange", visibility);
      scope?.removeEventListener("focusin", interrupt);
      temporaryFocus.forEach(restore => restore());
      media.removeEventListener("change", configureMotion);
      destroyMotion?.();
    };
  }, [root]);
}
