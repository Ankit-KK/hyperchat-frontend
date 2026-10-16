import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Play, RotateCcw } from "lucide-react";
import StreamStage from "./StreamStage";
const steps = [
  "Viewer supports",
  "Alert is prepared",
  "Creator receives",
  "Audience sees",
];
const messages = [
  "Choose an example amount, then play the interaction.",
  "A fictional support event prepares an alert.",
  "The event reaches the creator’s stream setup.",
  "The audience sees the message alongside the broadcast.",
];
export default function InteractionDemo() {
  const [amount, setAmount] = useState(250);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clear(), []);
  const reset = () => {
    clear();
    setStep(0);
    setRunning(false);
  };
  const play = () => {
    clear();
    setStep(1);
    setRunning(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 150
      : 950;
    timers.current = [
      setTimeout(() => setStep(2), delay),
      setTimeout(() => {
        setStep(3);
        setRunning(false);
      }, delay * 2),
    ];
  };
  return (
    <div className="interaction-demo">
      <div className="demo-caption">
        <span>
          <i className="status-dot" /> TRY THE INTERACTION
        </span>
        <span>FICTIONAL EXAMPLE · NO PAYMENT</span>
      </div>
      <div className="demo-grid">
        <div className="support-preview">
          <div className="eyebrow">THE VIEWER’S SIDE</div>
          <div className="creator-avatar" aria-hidden="true">
            S
          </div>
          <h3>Support the studio.</h3>
          <p>A little encouragement goes a long way.</p>
          <fieldset disabled={running}>
            <legend>Example support amount</legend>
            <div className="amount-options">
              {[100, 250, 500].map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={amount === value}
                  onClick={() => {
                    reset();
                    setAmount(value);
                  }}
                >
                  ₹{value}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="example-message">
            <span>ARI’S EXAMPLE MESSAGE</span>
            <p>“This made my evening. Keep creating!”</p>
          </div>
          <button className="button dark" onClick={play} disabled={running}>
            {running
              ? "Following the interaction…"
              : step === 3
                ? "Play again"
                : "Play interaction"}
            <Play size={15} fill="currentColor" />
          </button>
          <span className="demo-disclaimer">
            Nothing is charged. No account is needed.
          </span>
        </div>
        <div className="broadcast-preview">
          <div className="preview-window-bar">
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>THE CREATOR’S STREAM</span>
            <ArrowRight size={15} />
          </div>
          <StreamStage visible={step === 3} amount={amount} />
          <div className="event-receipt">
            <span className={`receipt-icon ${step >= 2 ? "received" : ""}`}>
              <Check size={15} />
            </span>
            <span>
              {step >= 2
                ? "Example event received by creator"
                : "Waiting for your example interaction"}
            </span>
          </div>
        </div>
      </div>
      <ol className="interaction-steps">
        {steps.map((label, i) => (
          <li
            key={label}
            className={step >= i ? "active" : ""}
            aria-current={step === i ? "step" : undefined}
          >
            <span>0{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="demo-status">
        <p role="status">{messages[step]}</p>
        <button className="icon-text-button" onClick={reset}>
          <RotateCcw size={14} /> Reset demo
        </button>
      </div>
    </div>
  );
}
