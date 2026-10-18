import { useRef } from "react";
import { createPortal } from "react-dom";
import { useMascotCursor } from "../hooks/useMascotCursor";
import { mascotConfig } from "./mascotConfig";
import "./MascotCursor.css";

export default function MascotCursor() {
  const root = useRef<HTMLDivElement>(null);
  useMascotCursor(root);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div ref={root} className="mascot-cursor" aria-hidden="true" data-active="false">
      <span className="mascot-hotspot" />
      <div className="mascot-character" style={{ width: mascotConfig.width, height: mascotConfig.height }}>
        {[0, 1, 2, 3].map((slot) => (
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
    </div>,
    document.body,
  );
}
