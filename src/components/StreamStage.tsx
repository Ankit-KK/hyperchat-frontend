import { AudioLines, Heart, Radio } from "lucide-react";
export type PreviewKind = "support" | "sound" | "voice";
export const eventCopy = {
  support: {
    label: "A LITTLE LOVE FOR THE STREAM",
    name: "Ari",
    detail: "This made my evening. Keep creating!",
    type: "MESSAGE OF SUPPORT",
  },
  sound: {
    label: "THE COMMUNITY HAS A SOUNDTRACK",
    name: "Sam",
    detail: "A little applause for that moment.",
    type: "SOUNDBOARD INTERACTION",
  },
  voice: {
    label: "A MESSAGE WITH A HUMAN TOUCH",
    name: "Noor",
    detail: "Thanks for making this space for us.",
    type: "VOICE MESSAGE",
  },
};
export default function StreamStage({
  kind = "support",
  visible = true,
  amount = 250,
}: {
  kind?: PreviewKind;
  visible?: boolean;
  amount?: number;
}) {
  const event = eventCopy[kind];
  return (
    <div className="stream-stage" data-event={kind}>
      <div className="stream-topline">
        <span>
          <Radio size={13} /> STUDIO SESSION
        </span>
        <span>FICTIONAL STREAM</span>
      </div>
      <div className="studio-art" aria-hidden="true">
        <div className="studio-disc disc-back" />
        <div className="studio-disc disc-front" />
        <div className="studio-plinth" />
        <div className="studio-shadow" />
      </div>
      <div className="stream-title">
        <span>THE OPEN STUDIO</span>
        <strong>
          Good things.
          <br />
          <em>In the making.</em>
        </strong>
      </div>
      <div
        className={`stream-alert ${visible ? "visible" : ""}`}
        aria-hidden={!visible}
      >
        <div className="alert-symbol">
          {kind === "support" ? <Heart size={22} /> : <AudioLines size={22} />}
        </div>
        <div>
          <span className="alert-meta">{event.type}</span>
          <strong>
            {event.name}{" "}
            {kind === "support"
              ? `sent ₹${amount}`
              : kind === "sound"
                ? "sent a sound"
                : "sent a voice message"}
          </strong>
          <p>{event.detail}</p>
        </div>
      </div>
      <div className="stream-bottomline">
        <span>REPRESENTATIVE OVERLAY</span>
        <span>HYPERCHAT / PREVIEW</span>
      </div>
    </div>
  );
}
