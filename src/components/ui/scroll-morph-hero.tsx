"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion,
  useScroll, useSpring, useTransform, type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ShowcaseCreator } from "@/data/showcase-creators";
import { selectShowcaseCreators } from "@/lib/creator-selection";
import { cn } from "@/lib/utils";
import "./scroll-morph-hero.css";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";
type Size = { width: number; height: number; mobile?: boolean };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number) => Math.min(1, Math.max(0, n));

function circleRadius(size: Size) {
  const mobile = size.mobile ?? size.width < 600;
  const edgeSpace = Math.hypot(mobile ? 50 : 84, mobile ? 72 : 118) / 2 + 16;
  return Math.max(20, Math.min(size.width * 0.34, size.height * 0.4, 290, Math.min(size.width, size.height) / 2 - edgeSpace));
}

function position(index: number, total: number, size: Size, phase: AnimationPhase, progress: number, mouse: number) {
  const mobile = size.mobile ?? size.width < 600;
  const cardWidth = mobile ? 50 : 84;
  const radius = circleRadius(size);
  if (phase === "scatter" && progress < 0.03) return {
    x: Math.sin(index * 17.3) * size.width * 0.4,
    y: Math.cos(index * 9.7) * size.height * 0.35,
    rotate: Math.sin(index * 7) * 65, scale: 0.7,
  };
  if (phase === "line" && progress < 0.03) return {
    x: (index - (total - 1) / 2) * Math.min(cardWidth + 8, size.width * 0.86 / total),
    y: 0, rotate: 0, scale: 1,
  };
  const morph = clamp(progress / 0.35);
  const shuffle = clamp((progress - 0.35) / 0.65);
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  // A shallow arch sweeps every card through the viewport, including the last.
  const spacing = mobile ? 80 : 128;
  const arcX = index * spacing - shuffle * (total - 1) * spacing + size.width * 0.2;
  const arcY = size.height * 0.18 + (arcX * arcX) / (size.width * 3.5);
  return {
    x: mix(Math.cos(angle) * radius, arcX + mouse, morph),
    y: mix(Math.sin(angle) * radius, arcY, morph),
    rotate: mix(index / total * 360, Math.atan(arcX / (size.width * 1.75)) * 180 / Math.PI, morph),
    scale: mix(1, mobile ? 1.3 : 1.65, morph),
  };
}

function CreatorCard({ creator, index, total, phase, size, progress, mouse, grid }: {
  creator: ShowcaseCreator; index: number; total: number; phase: AnimationPhase;
  size: Size; progress: MotionValue<number>; mouse: MotionValue<number>; grid: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const x = useSpring(0, { stiffness: 120, damping: 25 });
  const y = useSpring(0, { stiffness: 120, damping: 25 });
  const rotate = useSpring(0, { stiffness: 120, damping: 25 });
  const scale = useSpring(1, { stiffness: 120, damping: 25 });
  useEffect(() => {
    if (grid) return;
    const update = () => {
      const next = position(index, total, size, phase, progress.get(), mouse.get());
      x.set(next.x); y.set(next.y); rotate.set(next.rotate); scale.set(next.scale);
    };
    update();
    const stopProgress = progress.on("change", update);
    const stopMouse = mouse.on("change", update);
    return () => { stopProgress(); stopMouse(); };
  }, [grid, index, total, size, phase, progress, mouse, x, y, rotate, scale]);
  const back = flipped || hovered;
  return (
    <motion.div data-creator-id={creator.id} className={cn("showcase-card-position", grid && "showcase-card-grid")}
      style={grid ? undefined : { x, y, rotate, scale }}>
      <button type="button" className="showcase-card" data-tone={index % 4} data-ambassador={creator.ambassador || undefined}
        aria-pressed={flipped} tabIndex={grid ? 0 : -1}
        onClick={() => setFlipped((value) => !value)}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}>
        <motion.span className="showcase-card-inner"
          animate={{ rotateY: back ? 180 : 0 }} transition={{ duration: grid ? 0 : 0.45 }}>
          <span className="showcase-card-face showcase-card-front">
            {creator.image && !imageFailed ? <img className="showcase-portrait" src={creator.image} alt="" loading="lazy" decoding="async" width="320" height="320" onError={() => setImageFailed(true)} /> : <span className="showcase-card-mark">{creator.initials}</span>}
            {creator.ambassador && <span className="showcase-card-index">{grid ? "BRAND AMBASSADOR" : "AMBASSADOR"}</span>}{" "}
            <span className="showcase-card-name">{creator.name}</span>
          </span>
          <span className="showcase-card-face showcase-card-back">
            <span>CREATOR PROFILE</span>{" "}<strong>{creator.name}</strong>{" "}{creator.ambassador && <span>Brand ambassador</span>}
          </span>
        </motion.span>
      </button>
      {grid && <div className="showcase-grid-caption"><a href={creator.url} target="_blank" rel="noopener noreferrer">{creator.name} <ArrowUpRight size={12} aria-hidden="true" /><span className="sr-only"> — open creator page in new tab</span></a>{creator.ambassador && <span className="showcase-ambassador">Brand ambassador</span>}</div>}
    </motion.div>
  );
}

export default function ScrollMorphHero({ creators, className }: { creators: ShowcaseCreator[]; className?: string }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cardArea = useRef<HTMLDivElement>(null);
  const inView = useInView(section, { amount: "some", once: true });
  const reduced = useReducedMotion();
  const [list, setList] = useState(false);
  const grid = !!reduced || list;
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(24);
  const matching = creators.filter(creator => `${creator.name} ${creator.id}`.toLowerCase().includes(query.trim().toLowerCase()));
  const featured = useMemo(() => selectShowcaseCreators(creators), [creators]);
  const visibleCreators = grid ? matching.slice(0, limit) : featured;
  const [phase, setPhase] = useState<AnimationPhase>("scatter");
  const [size, setSize] = useState<Size>({ width: 1200, height: 800 });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const mouse = useMotionValue(0);
  const smoothMouse = useSpring(mouse, { stiffness: 80, damping: 25 });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.32], [1, 1, 0]);
  const arcOpacity = useTransform(scrollYProgress, [0.12, 0.35], [0, 1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value >= 0.35) setPhase((old) => old === "bottom-strip" ? old : "bottom-strip");
    else if (value > 0.03) setPhase((old) => old === "circle" ? old : "circle");
  });
  useEffect(() => {
    if (!inView || grid) return;
    const line = setTimeout(() => setPhase(scrollYProgress.get() > 0.03 ? "circle" : "line"), 100);
    const circle = setTimeout(() => setPhase(scrollYProgress.get() >= 0.35 ? "bottom-strip" : "circle"), 1300);
    return () => { clearTimeout(line); clearTimeout(circle); };
  }, [inView, grid, scrollYProgress]);
  useEffect(() => {
    if (!cardArea.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height, mobile: window.innerWidth <= 600 }));
    observer.observe(cardArea.current);
    return () => observer.disconnect();
  }, []);
  const openList = () => {
    setList((value) => !value);
    // Retain context when collapsing the tall scroll scene to a readable list.
    requestAnimationFrame(() => section.current?.scrollIntoView({ behavior: "instant", block: "start" }));
  };
  return (
    <section id="creator-showcase" ref={section} aria-labelledby="showcase-title"
      className={cn("creator-showcase", grid && "showcase-list", className)} data-phase={grid ? "grid" : phase}>
      <div ref={stage} className="showcase-stage"
        onPointerMove={(event) => {
          if (grid || event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          mouse.set(((event.clientX - rect.left) / rect.width * 2 - 1) * 24);
        }} onPointerLeave={() => mouse.set(0)}>
        <header className="showcase-topline">
          <span>THE CREATOR SHOWCASE</span><span>DIFFERENT STREAMS. SHARED MOMENTS.</span>
        </header>
        <div className="showcase-controls">
          <span className="showcase-demo-label">{creators.length} CREATORS · THREE BRAND AMBASSADORS</span>
          {!reduced && <button type="button" onClick={openList} aria-pressed={list}>
            {list ? "View scroll experience" : "View creator list"}<ArrowUpRight size={13} aria-hidden="true" />
          </button>}
        </div>
        <motion.div className="showcase-intro" style={grid ? undefined : { opacity: titleOpacity, width: Math.max(100, (circleRadius(size) * 2 - (size.mobile ? 72 : 118)) * .84) }}>
          <span className="showcase-eyebrow">DIFFERENT WORLDS. SHARED MOMENTS.</span>
          <h2 id="showcase-title">Every creator.<br /><em>A world of their own.</em></h2>
          <p>Different formats. The same chance to be part of the stream.</p>
        </motion.div>
        {!grid && <motion.div className="showcase-arc-copy" style={{ opacity: arcOpacity }} aria-hidden="true">
          <span className="showcase-eyebrow">A PLACE FOR EVERY KIND OF LIVE.</span>
          <p>Your kind of live.<br /><em>Their way to join in.</em></p>
          <span>A clutch finish. A final song. A conversation worth joining. Give viewers a way to respond in the moment.</span>
        </motion.div>}
        {grid && <div className="showcase-directory-controls"><label htmlFor="creator-search">Find a creator</label><input id="creator-search" type="search" value={query} placeholder="Search names or handles" onChange={event => { setQuery(event.target.value); setLimit(24); }} /><p role="status">{matching.length} {matching.length === 1 ? "creator" : "creators"}{matching.length === 0 ? " found. Try another name." : ` · showing ${Math.min(limit, matching.length)}`}</p></div>}
        <div className="showcase-cards" ref={cardArea}>
          {visibleCreators.map((creator, index) => <CreatorCard key={creator.id} creator={creator} index={index}
            total={visibleCreators.length} phase={phase} size={size} progress={scrollYProgress} mouse={smoothMouse} grid={grid} />)}
        </div>
        {grid && matching.length > limit && <button className="showcase-load-more" type="button" onClick={() => setLimit(value => value + 24)}>Show more creators <ArrowUpRight size={14} aria-hidden="true" /></button>}
        {!grid && <div className="showcase-bottom"><span>SCROLL TO EXPLORE ↓</span><span>HOVER OR TAP A CARD TO FLIP</span></div>}
        {!grid && <div className="showcase-progress" aria-hidden="true"><motion.div style={{ width: progressWidth }} /></div>}
      </div>
    </section>
  );
}
