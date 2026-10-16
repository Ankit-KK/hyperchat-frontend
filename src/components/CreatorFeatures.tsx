import { useState, type KeyboardEvent } from "react";
import {
  ArrowUpRight,
  AudioLines,
  Check,
  CheckCheck,
  Link,
  ShieldCheck,
} from "lucide-react";
const features = [
  {
    id: "support",
    name: "Donations & support",
    heading: "Support with a story.",
    copy: "Give viewers a way to support your work and leave a message that belongs in the moment.",
    detail:
      "Donation messages, voice interactions, and creator-specific options.",
    label: "01 / SUPPORT",
  },
  {
    id: "alerts",
    name: "On-stream alerts",
    heading: "Bring the moment on screen.",
    copy: "Make audience interactions part of your broadcast with visual alerts and audio events.",
    detail: "Overlay appearance and scale can be configured for your stream.",
    label: "02 / ALERTS",
  },
  {
    id: "soundboard",
    name: "Soundboard",
    heading: "An inside joke. On cue.",
    copy: "Give your community another way to join in through soundboard interactions.",
    detail:
      "Custom Soundboard requires creator eligibility and acceptance of the current terms.",
    label: "03 / SOUND",
  },
  {
    id: "reporting",
    name: "Creator reporting",
    heading: "Understand your support.",
    copy: "Review donation history, see support totals, and export records from your creator dashboard.",
    detail: "Donation reporting, including daily and monthly totals.",
    label: "04 / INSIGHT",
  },
  {
    id: "moderation",
    name: "Community moderation",
    heading: "Your stream. Your boundaries.",
    copy: "Review interactions, hide messages, and manage donor restrictions with your moderation team.",
    detail: "Choose manual review or automatic approval in creator settings.",
    label: "05 / CONTROL",
  },
  {
    id: "obs",
    name: "OBS connection",
    heading: "Part of your existing setup.",
    copy: "Connect HyperChat browser sources to OBS to bring audience alerts and audio into your broadcast.",
    detail:
      "You stream on your existing platform. HyperChat adds the interactions.",
    label: "06 / BROADCAST",
  },
];
export default function CreatorFeatures() {
  const [active, setActive] = useState(0);
  const [moderated, setModerated] = useState(false);
  const [played, setPlayed] = useState(false);
  const feature = features[active];
  const keydown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = (index + 1) % features.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = (index + features.length - 1) % features.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = features.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`feature-tab-${next}`)?.focus();
  };
  return (
    <section
      className="creators section-shell"
      id="creators"
      aria-labelledby="creators-title"
    >
      <div className="section-label">
        <span>02 / THE CREATOR’S TOOLKIT</span>
        <span>YOUR STREAM, WITH MORE POSSIBILITY</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2 id="creators-title">
          Built for <em>creators.</em>
        </h2>
        <p>
          The tools around the broadcast.
          <br />
          The connection at the heart of it.
        </p>
      </div>
      <div className="features-layout">
        <div
          className="feature-tabs"
          role="tablist"
          aria-label="Creator capabilities"
          aria-orientation="vertical"
        >
          {features.map((item, i) => (
            <button
              key={item.id}
              role="tab"
              id={`feature-tab-${i}`}
              aria-controls="feature-panel"
              aria-selected={active === i}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => keydown(e, i)}
            >
              <span>0{i + 1}</span>
              {item.name}
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="feature-panel"
          aria-labelledby={`feature-tab-${active}`}
          tabIndex={0}
          className="feature-panel"
        >
          <div className="feature-visual" key={feature.id}>
            <div className="mini-ui-header">
              <span>HYPERCHAT / {feature.name.toUpperCase()}</span>
              <span>ILLUSTRATIVE UI</span>
            </div>
            {active === 0 && (
              <div className="support-visual">
                <span className="large-amount">
                  ₹250<span>EXAMPLE SUPPORT</span>
                </span>
                <div className="mini-message">
                  <span className="small-avatar">A</span>
                  <div>
                    <strong>Ari</strong>
                    <p>“Here for what you create.”</p>
                  </div>
                  <CheckCheck size={19} />
                </div>
              </div>
            )}
            {active === 1 && (
              <div className="alert-visual">
                <span className="fine-line" />
                <div className="sample-alert">
                  <AudioLines size={30} />
                  <div>
                    <span>A MOMENT OF SUPPORT</span>
                    <strong>Ari sent ₹250</strong>
                    <p>Here for what you create.</p>
                  </div>
                </div>
                <span className="visual-hint">
                  YOUR OVERLAY. YOUR BROADCAST.
                </span>
              </div>
            )}
            {active === 2 && (
              <div className="sound-visual">
                <div className="waveform" aria-hidden="true">
                  {Array.from({ length: 33 }, (_, i) => (
                    <i
                      key={i}
                      style={{
                        height: `${16 + Math.abs(Math.sin(i * 1.9)) * 65}%`,
                      }}
                    />
                  ))}
                </div>
                <button
                  className="button ivory"
                  onClick={() => setPlayed(!played)}
                  aria-pressed={played}
                >
                  {played ? "Selected: applause" : "Select example sound"}
                  <AudioLines size={17} />
                </button>
                <span className="visual-hint">
                  {played
                    ? "Example sound selected · visual preview only"
                    : "A REPRESENTATIVE SOUNDBOARD SELECTION"}
                </span>
              </div>
            )}
            {active === 3 && (
              <div className="report-visual">
                <div>
                  <span>EXAMPLE DONATION HISTORY</span>
                  <strong>
                    Every gesture,
                    <br />
                    in perspective.
                  </strong>
                </div>
                <div className="bar-chart" aria-hidden="true">
                  {[25, 42, 31, 68, 49, 84, 65, 95, 71].map((h, i) => (
                    <i key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <span className="visual-hint">
                  ILLUSTRATIVE CHART · NOT PLATFORM METRICS
                </span>
              </div>
            )}
            {active === 4 && (
              <div className="moderation-visual">
                <ShieldCheck size={30} />
                <span className="eyebrow">EXAMPLE REVIEW QUEUE</span>
                <p>
                  {moderated
                    ? "Message hidden in this preview."
                    : "“Here for what you create.”"}
                </p>
                <button
                  className="button ivory"
                  aria-pressed={moderated}
                  onClick={() => setModerated(!moderated)}
                >
                  {moderated
                    ? "Example message hidden"
                    : "Hide example message"}
                  <Check size={16} />
                </button>
                <span className="visual-hint" role="status">
                  {moderated
                    ? "Hidden in this preview. Click again to restore."
                    : "Try a creator control. No live data is changed."}
                </span>
              </div>
            )}
            {active === 5 && (
              <div className="obs-visual">
                <span className="connection-node">HyperChat</span>
                <div className="connection-line">
                  <Link size={21} />
                </div>
                <span className="connection-node">OBS</span>
                <span className="visual-hint">
                  ALERTS + AUDIO → YOUR BROADCAST
                </span>
              </div>
            )}
          </div>
          <div className="feature-description">
            <span className="eyebrow">{feature.label}</span>
            <h3>{feature.heading}</h3>
            <p>{feature.copy}</p>
            <small>{feature.detail}</small>
          </div>
        </div>
      </div>
      <p className="capability-note">
        A preview of documented V2 capabilities. Availability depends on creator
        access, configuration, and rollout.
      </p>
    </section>
  );
}
