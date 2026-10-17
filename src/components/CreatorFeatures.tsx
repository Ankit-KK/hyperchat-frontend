import { useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  SupportPreview,
  AlertPreview,
  SoundboardPreview,
  HistoryPreview,
  ModerationPreview,
  ObsPreview,
} from "./CreatorPreviews";
const features = [
  {
    id: "interactions",
    name: "Viewer interactions",
    heading: "Give every interaction a voice.",
    copy: "Text, voice, sound, images, GIFs, and video. Let your audience join in through the interactions you choose to enable.",
    detail:
      "Try a device-generated voice example. Available interaction types depend on creator settings.",
    label: "01 / PARTICIPATION",
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
    name: "Interaction history",
    heading: "Keep track of the conversation.",
    copy: "Find an interaction, revisit its context, and export your records. The details are there when you need them.",
    detail:
      "Explore fictional records here. Creator reporting is part of the documented V2 toolkit.",
    label: "04 / INSIGHT",
  },
  {
    id: "moderation",
    name: "Community moderation",
    heading: "Your stream. Your boundaries.",
    copy: "Review interactions, hide messages, and manage viewer restrictions with your moderation team.",
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
            {active === 0 && <SupportPreview />}
            {active === 1 && <AlertPreview />}
            {active === 2 && <SoundboardPreview />}
            {active === 3 && <HistoryPreview />}
            {active === 4 && <ModerationPreview />}
            {active === 5 && <ObsPreview />}
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
