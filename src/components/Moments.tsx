import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StreamStage, { type PreviewKind } from "./StreamStage";
gsap.registerPlugin(ScrollTrigger);
const moments = [
  {
    kind: "support" as const,
    title: "A message that lands.",
    copy: "A viewer sends a little encouragement. An ordinary moment becomes a shared one.",
    label: "Support",
  },
  {
    kind: "sound" as const,
    title: "A sound that brings everyone in.",
    copy: "The perfect cue, at just the right time. A community makes a moment its own.",
    label: "Soundboard",
  },
  {
    kind: "voice" as const,
    title: "A voice behind the username.",
    copy: "A message carries a little more personality. The connection feels a little closer.",
    label: "Voice message",
  },
];
export default function Moments() {
  const root = useRef<HTMLElement>(null);
  const [kind, setKind] = useState<PreviewKind>("support");
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: ".moments-grid",
            start: "top 120px",
            end: () =>
              `bottom ${120 + (root.current?.querySelector<HTMLElement>(".moment-visual")?.offsetHeight ?? 550)}px`,
            pin: ".moment-visual",
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
          gsap.utils.toArray<HTMLElement>(".moment-beat").forEach((beat, i) =>
            ScrollTrigger.create({
              trigger: beat,
              start: "top 58%",
              end: "bottom 58%",
              onEnter: () => setKind(moments[i].kind),
              onEnterBack: () => setKind(moments[i].kind),
            }),
          );
        }, root);
        return () => ctx.revert();
      },
    );
    return () => media.revert();
  }, []);
  return (
    <section
      ref={root}
      className="moments section-shell"
      id="moments"
      aria-labelledby="moments-title"
    >
      <div className="section-label">
        <span>03 / THE SHARED MOMENT</span>
        <span>IMAGINE YOUR COMMUNITY HERE</span>
      </div>
      <h2 id="moments-title" data-reveal>
        Make every
        <br />
        <em>moment count.</em>
      </h2>
      <div className="moments-grid">
        <div className="moment-visual">
          <StreamStage kind={kind} />
          <div
            className="moment-controls"
            role="group"
            aria-label="Preview stream interactions"
          >
            {moments.map((m) => (
              <button
                key={m.kind}
                aria-pressed={kind === m.kind}
                onClick={() => setKind(m.kind)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="preview-note">
            Fictional studio and viewer names. Illustrative interactions, not
            endorsements.
          </p>
        </div>
        <div className="moment-beats">
          {moments.map((m, i) => (
            <article
              key={m.kind}
              className={`moment-beat ${kind === m.kind ? "current" : ""}`}
            >
              <span className="eyebrow">
                0{i + 1} / {m.label.toUpperCase()}
              </span>
              <h3>{m.title}</h3>
              <p>{m.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
