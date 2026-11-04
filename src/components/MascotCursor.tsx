import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMascotCursor } from "../hooks/useMascotCursor";
import { mascotConfig, mascotVideos } from "./mascotConfig";
import "./MascotCursor.css";

export default function MascotCursor() {
  const root = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem("hyperchat:companion") !== "hidden"; }
    catch { return true; }
  });
  useMascotCursor(root, enabled);
  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try { localStorage.setItem("hyperchat:companion", next ? "shown" : "hidden"); }
    catch { /* The preference still applies for this visit. */ }
  };
  if (typeof document === "undefined") return null;
  return createPortal(
    <><button type="button" className="companion-toggle" onClick={toggle}>
      {enabled ? "Hide companion" : "Show companion"}
    </button><div ref={root} className="mascot-cursor" aria-hidden="true" data-active="false">
      <span className="mascot-hotspot" />
      <div className="mascot-character" style={{ width: mascotConfig.width, height: mascotConfig.height }}>
        {Object.keys(mascotVideos).map((slot) => (
          <video
            key={slot}
            className="mascot-video"
            data-visible="false"
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            tabIndex={-1}
            style={{ width: mascotConfig.videoWidth }}
          />
        ))}
      </div>
      <div className="mascot-bubble" data-open="false" style={{ width: mascotConfig.bubbleWidth }} />
    </div></>,
    document.body,
  );
}
