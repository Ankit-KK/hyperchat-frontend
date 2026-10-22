"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { EngineOptions, LiquidEngine } from "@/lib/liquid-sculpture-engine";
import "./liquid-sculpture-hero.css";

const options: EngineOptions = {
  interactive: true, strength: .8, radius: 150, density: .55, dotSize: 1,
  spread: .75, turbulence: .6, returnSpeed: 1.2, streaks: true,
  restStyle: "image", ambient: false, ambientIntensity: 0, speed: 1,
  intro: false, reducedMotion: false, bg: [243/255,237/255,226/255],
  imgBg: null, liquid: .65,
};

/** Decorative finale adapted from the supplied Sculpture Hero. No duplicate hero copy. */
export default function LiquidSculptureHero() {
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const engineRef = useRef<LiquidEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const root = stage.current!;
    const img = image.current!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let disposed = false;
    let intersecting = false;
    let generation = 0;
    let loading = false;
    let failed = false;
    let canvas: HTMLCanvasElement | undefined;
    const destroy = () => {
      generation++;
      loading = false;
      engineRef.current?.destroy();
      engineRef.current = null;
      canvas?.remove();
      canvas = undefined;
      setReady(false);
    };
    const fail = () => { failed = true; destroy(); setStaticMode(true); };
    const resize = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      engineRef.current?.resize(width, height, { x: 0, y: 0, w: width, h: height });
    };
    const sync = async () => {
      if (disposed) return;
      if (motion.matches || connection?.saveData) {
        destroy();
        setStaticMode(true);
        return;
      }
      const visible = intersecting && !document.hidden;
      engineRef.current?.setVisible(visible);
      if (!visible || engineRef.current || loading || failed) return;
      setStaticMode(false);
      loading = true;
      const version = ++generation;
      try {
        const { LiquidEngine } = await import("@/lib/liquid-sculpture-engine");
        await img.decode();
        if (disposed || version !== generation) return;
        canvas = document.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        root.appendChild(canvas);
        const engine = new LiquidEngine(canvas, options, fail);
        engineRef.current = engine;
        engine.setVisible(intersecting && !document.hidden);
        engine.onFirstFrame = () => { if (!disposed && version === generation) setReady(true); };
        resize();
        engine.setImage(img);
      } catch { if (!disposed && version === generation) fail(); }
      finally { if (version === generation) loading = false; }
    };
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; void sync(); });
    observer.observe(root);
    const sizing = new ResizeObserver(resize);
    sizing.observe(root);
    const pointer = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("button, a")) return;
      const bounds = root.getBoundingClientRect();
      const type = event.type === "pointerdown" ? "down" : event.type === "pointerup" || event.type === "pointercancel" ? "up" : event.type === "pointerleave" ? "leave" : "move";
      engineRef.current?.pointer(type, event.clientX-bounds.left, event.clientY-bounds.top, event.pointerType === "touch");
    };
    const events = ["pointermove", "pointerdown", "pointerup", "pointercancel", "pointerleave"] as const;
    events.forEach((event) => root.addEventListener(event, pointer, { passive: true }));
    const change = () => { void sync(); };
    motion.addEventListener("change", change);
    document.addEventListener("visibilitychange", change);
    void sync();
    return () => {
      disposed = true;
      observer.disconnect(); sizing.disconnect();
      motion.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", change);
      events.forEach((event) => root.removeEventListener(event, pointer));
      destroy();
    };
  }, []);

  const stir = () => {
    const root = stage.current;
    if (!root) return;
    engineRef.current?.pointer("down", root.clientWidth * .52, root.clientHeight * .48, false);
    engineRef.current?.pointer("up", root.clientWidth * .52, root.clientHeight * .48, false);
  };

  return <div className="closing-sculpture" data-renderer={ready ? "webgl" : "image"}>
    <div className="liquid-sculpture-stage" ref={stage}>
      <img ref={image} src="/sculpture/hyperchat-wordmark.webp" width="1000" height="220" loading="lazy" decoding="async"
        alt="HYPERCHAT — an interactive wordmark in stone." />
    </div>
    <div className="liquid-sculpture-caption">
      <span>{staticMode ? "A SMALL CONNECTION. A LASTING IMPRESSION." : "MOVE OR TOUCH TO MAKE A CONNECTION."}</span>
      {ready && <button type="button" onClick={stir}>Bring HyperChat to life <ArrowUpRight size={12} aria-hidden="true" /></button>}
    </div>
  </div>;
}
