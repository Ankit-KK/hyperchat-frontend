import { ArrowUpRight } from "lucide-react";
const steps = [
  [
    "An audience with a voice.",
    "A viewer chooses how to support you: a message, a voice interaction, or an available sound.",
  ],
  [
    "A moment on your terms.",
    "Your creator settings and moderation choices shape what reaches the broadcast.",
  ],
  [
    "Something everyone shares.",
    "Approved interactions become alerts and audio in your existing stream setup.",
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
        <span>01 / FROM SUPPORT TO SCREEN</span>
        <span>YOUR PLATFORM. A CLOSER COMMUNITY.</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2 id="story-title">
          A little support.
          <br />
          <em>A lasting connection.</em>
        </h2>
        <p>
          You bring the broadcast.
          <br />
          Give your audience a way to be part of it.
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
