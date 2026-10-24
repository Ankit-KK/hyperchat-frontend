import { useLayoutEffect, type ReactNode, type RefObject } from "react";
import { useExperienceMotion } from "../hooks/useExperienceMotion";

/** Mount motion only after a lazy page has committed its actual content. */
export default function PageExperience({ root, children }: { root: RefObject<HTMLDivElement | null>; children: ReactNode }) {
  useExperienceMotion(root);
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!location.hash) return;
      try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: "instant", block: "start" }); }
      catch { /* An invalid fragment must not prevent a page from rendering. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return children;
}
