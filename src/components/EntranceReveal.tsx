import { useEffect, useRef, useState } from "react";
import "./EntranceReveal.css";
import hcLogo from "../assets/brand/hc-intro.svg?raw";

const logoUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(hcLogo)}`;

export default function EntranceReveal({ onComplete }: { onComplete: () => void }) {
  const [lightweight, setLightweight] = useState(() =>
    matchMedia("(max-width: 900px), (pointer: coarse)").matches ||
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData),
  );
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
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
    const timer = setTimeout(() => setLeaving(true), 1600);
    return () => clearTimeout(timer);
  }, [lightweight]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => {
      frame.current?.contentWindow?.postMessage("hyperchat-intro:stop", "*");
      complete.current();
    }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420);
    return () => clearTimeout(timer);
  }, [leaving]);

  return <div className="entrance-reveal" data-lenis-prevent data-leaving={leaving} data-renderer={lightweight ? "light" : "glass"}
    role="dialog" aria-modal="true" aria-label="Welcome to HyperChat"
    onKeyDown={event => {
      if (event.key === "Escape") setLeaving(true);
      if (event.key === "Tab") { event.preventDefault(); skip.current?.focus(); }
    }}>
    {lightweight && <div className="entrance-logo" aria-hidden="true">
      <img className="entrance-monogram" src={logoUrl} alt="" width="400" height="292" />
    </div>}
    {!lightweight && <iframe ref={frame} src="/intro/glass-reveal.html" title="HyperChat glass animation"
      onLoad={() => frame.current?.contentWindow?.postMessage({ source: "hyperchat-intro", type: "init", logo: hcLogo }, "*")}
      sandbox="allow-scripts" tabIndex={-1} aria-hidden="true" data-ready={ready} />}
    <button ref={skip} type="button" className="entrance-skip" onClick={() => setLeaving(true)}>Skip intro</button>
  </div>;
}
