import { useState } from "react";
import { AudioLines, Orbit, Shapes } from "lucide-react";

const states = [
  {
    mode: "connection",
    label: "Connection",
    icon: Orbit,
    caption: "Distinct voices. Shared space.",
  },
  {
    mode: "voice",
    label: "Voice",
    icon: AudioLines,
    caption: "Every voice changes the shape.",
  },
  {
    mode: "presence",
    label: "Presence",
    icon: Shapes,
    caption: "A moment held together.",
  },
] as const;

export default function SceneControls() {
  const [active, setActive] = useState<(typeof states)[number]>(states[0]);
  return (
    <div className="scene-controls">
      <div className="scene-controls-heading">
        <span className="tiny-cross">+</span>
        <span>
          THE CONNECTION OBJECT <small>INTERACTIVE STUDY / 001</small>
        </span>
      </div>
      <div
        className="scene-options"
        role="group"
        aria-label="Explore the 3D sculpture"
      >
        {states.map((state) => (
          <button
            key={state.mode}
            aria-pressed={active.mode === state.mode}
            onClick={() => {
              setActive(state);
              window.dispatchEvent(
                new CustomEvent("hyperchat:scene-mode", {
                  detail: { mode: state.mode },
                }),
              );
            }}
          >
            <state.icon size={14} />
            <span>{state.label}</span>
          </button>
        ))}
      </div>
      <p aria-live="polite">{active.caption}</p>
    </div>
  );
}
