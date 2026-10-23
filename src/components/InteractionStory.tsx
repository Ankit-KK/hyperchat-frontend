import { ArrowUpRight } from "lucide-react";
const steps = [
  [
    "Choose how to join in.",
    "On your creator page, viewers can send text, turn typed words into speech, or record a message in their own voice.",
  ],
  [
    "You set the boundaries.",
    "Your interaction preferences and moderation settings decide what can reach the stream. Review messages before they appear when approval is enabled.",
  ],
  [
    "Bring it into the stream.",
    "Eligible interactions join the queue and play through your OBS browser source as alerts and audio. Timing depends on your queue and moderation settings.",
  ],
];
export default function InteractionStory() {
  return (
    <section
      className="interaction-story section-shell light"
      id="how-it-works"
      aria-labelledby="story-title"
    >
      <div className="section-label">
        <span>01 / HOW IT WORKS</span>
        <span>YOUR PLATFORM. A CLOSER COMMUNITY.</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2 id="story-title">
          From their voice.
          <br />
          <em>To your stream.</em>
        </h2>
        <p>
          One creator page. Your existing stream.
          <br />
          Give your audience a way to join the moment, with you in control.
        </p>
      </div>
      <ol className="story-steps">
        {steps.map(([title, copy], i) => (
          <li key={title} data-reveal>
            <span className="story-index">
              0{i + 1}
              <ArrowUpRight size={16} />
            </span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
