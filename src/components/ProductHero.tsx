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
  "A local preview. Your words stay in this browser.",
  "Your example interaction reaches the creator.",
  "The example message clears the creator’s queue.",
  "Your words are now part of the scene.",
];
export default function ProductHero() {
  const { step, running, play, reset } = useDemoSequence();
  const [message, setMessage] = useState(
    "This made my evening. Keep creating!",
  );
  return (
    <section className="hero" id="interaction" aria-labelledby="hero-title">
      <div className="hero-top eyebrow">
        <span>
          <i className="status-dot" /> LIVE CREATOR ENGAGEMENT.
        </span>
        <span>THE NEXT CHAPTER / V.02</span>
      </div>
      <div className="hero-layout">
        <div className="hero-content">
          <span className="hero-kicker eyebrow">
            SMALL INTERACTIONS. SHARED EXPERIENCES.
          </span>
          <h1 id="hero-title">
            Your stream.
            <br />
            Their voice.
            <br />
            <em>A shared moment.</em>
          </h1>
          <p>
            The interaction platform for live creators. Bring messages,
            text-to-speech, recorded voices, and sounds into your existing
            stream.
          </p>
          <div className="hero-actions">
            <button
              className="button ivory"
              onClick={play}
              disabled={running || !message.trim()}
            >
              {running
                ? "Following the moment…"
                : step === 3
                  ? "Play it again"
                  : "Try an interaction"}
              <Play size={14} fill="currentColor" />
            </button>
            <a href="#creators" className="text-link">
              Explore the tools <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div
          className="product-theatre"
          aria-label="Interactive HyperChat platform preview"
        >
          <div className="theatre-caption">
            <span>YOUR AUDIENCE. YOUR STREAM. HYPERCHAT.</span>
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
                <span>THE INTERACTION PLATFORM</span>
                <span>
                  hyperchat<span className="chrome-edition"> V2</span>
                </span>
              </div>
              <StreamStage
                visible={step === 3}
                message={message.trim()}
                step={step}
              />
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
              <label className="message-label" htmlFor="example-message">
                Make the moment yours.
              </label>
              <textarea
                id="example-message"
                aria-label="Your example message"
                className="message-input"
                aria-describedby="message-hint"
                maxLength={96}
                rows={3}
                value={message}
                disabled={running}
                onChange={(event) => {
                  reset();
                  setMessage(event.target.value);
                }}
              />
              <div className="message-hint" id="message-hint">
                <span>Try your own words</span>
                <span>{message.length}/96</span>
              </div>
              <div className="ticket-foot">
                <span>
                  {step > 0
                    ? "EXAMPLE INTERACTION SENT"
                    : "TEXT · TTS · VOICE · SOUND"}
                </span>
                {step > 0 ? <Check size={14} /> : <ArrowUpRight size={14} />}
              </div>
            </div>
            <div className={`event-receipt ${step >= 2 ? "received" : ""}`}>
              <span>
                <Check size={12} />
              </span>
              {step >= 2
                ? "Example interaction received"
                : "Awaiting the moment"}
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
            {["Audience joins", "Creator chooses", "The stream reacts"].map(
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
