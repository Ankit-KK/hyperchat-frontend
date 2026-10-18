import {
  AudioLines,
  Check,
  MessageCircle,
  Mic,
  Monitor,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import "./PlatformPreview.css";

const formats = [
  { label: "Text", icon: MessageCircle },
  { label: "TTS", icon: Volume2 },
  { label: "Voice", icon: Mic },
  { label: "Sound", icon: AudioLines },
];

export default function StreamStage({
  visible = false,
  message,
  step = 0,
}: {
  visible?: boolean;
  message: string;
  step?: number;
}) {
  return (
    <div className="stream-stage platform-stage" data-platform-step={step}>
      <div
        className="platform-diagram"
        role="img"
        aria-label="Audience messages, text-to-speech, recorded voice, and sounds pass through HyperChat creator controls into your existing stream."
      >
        <div className="platform-composition" aria-hidden="true">
          <div className="platform-audience">
            <span className="platform-people">
              <span>A</span>
              <span>N</span>
              <span>S</span>
            </span>
            <span>Your audience</span>
            <span className="platform-audience-line" />
          </div>
          <div className="platform-connector platform-connector-in">
            <span />
          </div>
          <div className="platform-card">
            <div className="platform-card-heading">
              <span>
                hyperchat<span className="platform-version"> V2</span>
              </span>
              <span className="platform-interaction-dot" />
            </div>
            <p>The interaction layer.</p>
            <div className="platform-formats">
              {formats.map(({ label, icon: Icon }) => (
                <span key={label}>
                  <Icon strokeWidth={1.4} />
                  {label}
                </span>
              ))}
            </div>
            <div className="platform-control">
              <span>
                <ShieldCheck /> Creator controls
              </span>
              <span>
                {step >= 2 ? (
                  <Check />
                ) : (
                  <span className="platform-control-dot" />
                )}
                {step >= 2 ? "Approved" : "Review queue"}
              </span>
            </div>
          </div>
          <div className="platform-connector platform-connector-out">
            <span />
          </div>
          <div className="platform-stream">
            <Monitor strokeWidth={1.4} />
            <div>
              <strong>Your existing stream</strong>
              <span>ADD WITH AN OBS OVERLAY</span>
            </div>
            <AudioLines className="platform-stream-signal" />
          </div>
        </div>
      </div>
      <div
        className={`stream-alert ${visible ? "visible" : ""}`}
        aria-hidden={!visible}
      >
        <span className="alert-symbol">
          <MessageCircle size={19} />
        </span>
        <div>
          <span className="alert-meta">A FEW WORDS. A SHARED MOMENT.</span>
          <strong>Ari joined the conversation</strong>
          <p>{message}</p>
        </div>
        <span className="alert-signature">hyperchat</span>
      </div>
    </div>
  );
}
