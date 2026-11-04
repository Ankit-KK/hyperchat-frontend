import { useEffect, useRef, useState } from "react";
import "./EntranceReveal.css";

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
    <div className="entrance-logo" data-hidden={!lightweight && ready} aria-hidden="true">
      <svg className="entrance-monogram" viewBox="0 0 590 320" focusable="false">
        <defs><mask id="entrance-hc-cut"><rect width="590" height="320" fill="white"/><path d="M470 142 700 55 700 230Z" fill="black"/></mask></defs>
        <g mask="url(#entrance-hc-cut)" fill="currentColor">
          <g className="entrance-h"><rect width="98" height="285" rx="10"/><rect x="40" y="103" width="200" height="70"/></g>
          <g className="entrance-c"><path fillRule="evenodd" d="M305 0H495A95 95 0 0 1 590 95V190A95 95 0 0 1 495 285H305A95 95 0 0 1 210 190V95A95 95 0 0 1 305 0ZM345 65H455A45 45 0 0 1 500 110V170A45 45 0 0 1 455 215H345A45 45 0 0 1 300 170V110A45 45 0 0 1 345 65Z"/><path d="M262 250 375 318 375 250Z"/></g>
        </g>
      </svg>
      <span className="entrance-wordmark">HYPERCHAT</span>
    </div>
    {!lightweight && <iframe ref={frame} src="/intro/glass-reveal.html" title="HyperChat glass animation"
      sandbox="allow-scripts" tabIndex={-1} aria-hidden="true" data-ready={ready} />}
    <button ref={skip} type="button" className="entrance-skip" onClick={() => setLeaving(true)}>Skip intro</button>
  </div>;
}
