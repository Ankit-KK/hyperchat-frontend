import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Play,
  RotateCcw,
  Send,
} from "lucide-react";
import StreamStage from "./StreamStage";
import { useDemoSequence } from "../hooks/useDemoSequence";
import { useState } from "react";
const statuses = [
  "Try a fictional interaction. No payment or account needed.",
  "Ari’s example support is received.",
  "The approved example event reaches the stream.",
  "Ari’s message is now on screen for the audience.",
];
export default function ProductHero() {
  const { step, running, play, reset } = useDemoSequence();
  const [amount, setAmount] = useState(250);
  return (
    <section className="hero" id="interaction" aria-labelledby="hero-title">
      <div className="hero-top eyebrow">
        <span>
          <i className="status-dot" /> CREATOR TOOLS. HUMAN CONNECTION.
        </span>
        <span>THE NEXT CHAPTER / V.02</span>
      </div>
      <div className="hero-layout">
        <div className="hero-content">
          <span className="hero-kicker eyebrow">
            YOUR AUDIENCE HAS SOMETHING TO ADD.
          </span>
          <h1 id="hero-title">
            Your stream.
            <br />
            Their support.
            <br />
            <em>A shared moment.</em>
          </h1>
          <p>
            Donations, alerts, and audience interactions.
            <br className="desktop-break" /> HyperChat brings your community
            into the broadcast you already create.
          </p>
          <div className="hero-actions">
            <button className="button ivory" onClick={play} disabled={running}>
              {running
                ? "Following the moment…"
                : step === 3
                  ? "Play it again"
                  : "Try the moment"}
              <Play size={14} fill="currentColor" />
            </button>
            <a href="#creators" className="text-link">
              Explore the tools <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div
          className="product-theatre"
          aria-label="Interactive broadcast preview"
        >
          <div className="theatre-caption">
            <span>YOUR STREAM, WITH HYPERCHAT</span>
            <span>INTERACTIVE PREVIEW ↗</span>
          </div>
          <div
            className={`theatre-scene ${running ? "is-playing" : ""}`}
            data-stage={step}
          >
            <div className="broadcast-frame">
              <div className="broadcast-chrome">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <span>CREATOR VIEW</span>
                <span>
                  hyperchat<span className="chrome-edition"> V2</span>
                </span>
              </div>
              <StreamStage visible={step === 3} amount={amount} />
            </div>
            <div className="viewer-ticket">
              <div className="ticket-top">
                <span className="viewer-avatar">A</span>
                <div>
                  <strong>Ari</strong>
                  <span>EXAMPLE VIEWER</span>
                </div>
                <Send size={14} />
              </div>
              <p>
                “This made my evening.
                <br />
                Keep creating!”
              </p>
              <fieldset disabled={running}>
                <legend>Example support amount</legend>
                <div className="amount-options">
                  {[100, 250, 500].map((value) => (
                    <button
                      key={value}
                      type="button"
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
              <div className="ticket-foot">
                <span>
                  {step > 0 ? "EXAMPLE SUPPORT SENT" : "READY WHEN YOU ARE"}
                </span>
                {step > 0 ? <Check size={14} /> : <ArrowUpRight size={14} />}
              </div>
            </div>
            <div className={`event-receipt ${step >= 2 ? "received" : ""}`}>
              <span>
                <Check size={12} />
              </span>
              {step >= 2 ? "Example event received" : "Awaiting the moment"}
            </div>
          </div>
          <div className="theatre-status">
            <p role="status">{statuses[step]}</p>
            <button
              onClick={reset}
              className="icon-text-button"
              aria-label="Reset demo"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
          <ol className="moment-route" aria-label="Interaction progress">
            {["Viewer support", "Creator receives", "Audience sees"].map(
              (label, i) => (
                <li
                  key={label}
                  className={step > i ? "active" : ""}
                  aria-current={step === i + 1 ? "step" : undefined}
                >
                  <span>0{i + 1}</span>
                  {label}
                </li>
              ),
            )}
          </ol>
        </div>
      </div>
      <div className="hero-bottom eyebrow">
        <a href="#how-it-works">
          <ArrowDown size={15} /> MADE FOR THE MOMENTS BETWEEN
        </a>
        <span>YOU KEEP STREAMING. WE BRING THE INTERACTION.</span>
      </div>
    </section>
  );
}
