import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./EntranceReveal.css";
import wordmarkLogo from "../assets/brand/hyperchat-intro.svg?raw";

const logoUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(wordmarkLogo)}`;

export default function EntranceReveal({ onComplete }: { onComplete: () => void }) {
  const [lightweight, setLightweight] = useState(() =>
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData),
  );
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const dismiss = () => setLeaving(true);
    const onMotion = () => { if (reduce.matches) dismiss(); };
    const onVisibility = () => { if (document.hidden) dismiss(); };
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.source !== "hyperchat-intro") return;
      if (event.data.type === "ready") setReady(true);
      if (event.data.type === "complete") dismiss();
      if (event.data.type === "fallback") setLightweight(true);
    };
    // An unavailable renderer or slow asset must never trap a visitor.
    const deadline = window.setTimeout(dismiss, 4500);
    window.addEventListener("message", onMessage);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", onMotion);
    return () => {
      clearTimeout(deadline);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("message", onMessage);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onMotion);
    };
  }, []);

  useEffect(() => {
    if (!lightweight) return;
    const timer = setTimeout(() => setLeaving(true), 1150);
    return () => clearTimeout(timer);
  }, [lightweight]);

  useLayoutEffect(() => {
    const position = () => {
      const brand = document.querySelector(".header .brand")?.getBoundingClientRect();
      if (!brand || !overlay.current) return;
      // Match the glass renderer’s settled width; keep the full word readable on phones.
      const logoWidth = Math.min(900, innerWidth * .88 / .68, innerHeight * 1.25) * .68 * .955;
      const badge = document.querySelector(".header .brand span")?.getBoundingClientRect();
      const destinationWidth = badge ? badge.left - brand.left - 8 : brand.width;
      overlay.current.style.setProperty("--flight-width", `${logoWidth}px`);
      overlay.current.style.setProperty("--dock-x", `${brand.left + destinationWidth / 2 - innerWidth / 2}px`);
      overlay.current.style.setProperty("--dock-y", `${brand.top + brand.height / 2 - innerHeight / 2}px`);
      overlay.current.style.setProperty("--dock-scale", `${destinationWidth / logoWidth}`);
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [lightweight]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => {
      frame.current?.contentWindow?.postMessage("hyperchat-intro:stop", "*");
      complete.current();
    }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1600);
    return () => clearTimeout(timer);
  }, [leaving]);

  return <div ref={overlay} className="entrance-reveal" data-lenis-prevent data-leaving={leaving} data-renderer={lightweight ? "light" : "glass"}
    role="dialog" aria-modal="true" aria-label="Welcome to HyperChat"
    onKeyDown={event => {
      if (event.key === "Escape") setLeaving(true);
      if (event.key === "Tab") { event.preventDefault(); skip.current?.focus(); }
    }}>
    <div className="entrance-logo" aria-hidden="true" data-light={lightweight}>
      <img className="entrance-monogram" src={logoUrl} alt="" width="1116" height="160" />
    </div>
    {!lightweight && <iframe ref={frame} src="/intro/glass-reveal.html" title="HyperChat glass animation"
      onLoad={() => frame.current?.contentWindow?.postMessage({ source: "hyperchat-intro", type: "init", logo: wordmarkLogo }, "*")}
      sandbox="allow-scripts" tabIndex={-1} aria-hidden="true" data-ready={ready} />}
    <button ref={skip} type="button" className="entrance-skip" onClick={() => setLeaving(true)}>Skip intro</button>
  </div>;
}
