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
    heading: "Let viewers join in their own way.",
    copy: "A typed message, text read aloud with AI text-to-speech, or a recording in the viewer’s own voice. Enable the interaction types that fit your community, including sounds, images, GIFs, and video.",
    detail:
      "Try Message or Text-to-speech in the preview. The speech demo uses a device-generated voice; recorded voice messages use the viewer’s own recording.",
    label: "01 / PARTICIPATION",
  },
  {
    id: "alerts",
    name: "On-stream alerts",
    heading: "Bring the moment on screen.",
    copy: "Turn audience messages and media into on-stream alerts. Adjust their appearance to fit your layout and keep the interaction part of the broadcast.",
    detail: "Try the overlay sizes in this preview to see how an alert fits the broadcast area.",
    label: "02 / ALERTS",
  },
  {
    id: "soundboard",
    name: "Soundboard",
    heading: "An inside joke. On cue.",
    copy: "Give viewers sounds they can use to react with your community—from a familiar cue to an inside joke everyone recognizes.",
    detail:
      "Play the example tones here. Custom Soundboard access depends on creator eligibility and acceptance of the current terms.",
    label: "03 / SOUND",
  },
  {
    id: "reporting",
    name: "Interaction history",
    heading: "Keep track of the conversation.",
    copy: "Search for a viewer or interaction, check its status, and export records when you need a closer look after the stream.",
    detail:
      "Try filtering the fictional records and downloading an example CSV. This preview does not access creator data.",
    label: "04 / INSIGHT",
  },
  {
    id: "moderation",
    name: "Community moderation",
    heading: "Your stream. Your boundaries.",
    copy: "Decide what reaches your audience. Review incoming interactions with your moderation team, approve messages, or hide content that does not belong on your stream.",
    detail: "Creator settings support manual review or automatic approval. Try Approve, Hide, and Undo in the example queue.",
    label: "05 / CONTROL",
  },
  {
    id: "obs",
    name: "OBS connection",
    heading: "Part of your existing setup.",
    copy: "Add HyperChat browser sources to your OBS scene to bring in alerts and audio while you keep streaming on your existing platform.",
    detail:
      "Toggle alerts and audio in this illustration. Your actual source links come from your creator setup.",
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
          Choose how viewers participate.
          <br />
          Shape what appears on stream, and stay in control as it happens.
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
        Explore local examples of the creator tools. Feature availability depends on
        creator access, settings, and rollout.
      </p>
    </section>
  );
}
