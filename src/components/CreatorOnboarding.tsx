import { ArrowUpRight } from "lucide-react";
import "./OnboardingDepth.css";
const onboarding = [
  [
    "Introduce your channel",
    "Share your channel and the kind of live content you create when applications open.",
  ],
  [
    "A human review",
    "The HyperChat team reviews your application before inviting you to the next step.",
  ],
  [
    "Account setup",
    "If approved, follow your invitation to create your account and begin setup.",
  ],
  [
    "Didit verification",
    "Complete the identity check through Didit as part of the planned V2 onboarding process.",
  ],
  [
    "Activation",
    "After approval and verification, activate creator access and prepare your stream.",
  ],
];

export default function CreatorOnboarding({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      className={`onboarding section-shell light ${compact ? "onboarding-depth" : ""}`}
      id="onboarding"
      aria-labelledby="onboarding-title"
    >
      <div className="section-label">
        <span>
          {compact ? "03 / CREATOR ONBOARDING" : "01 / CREATOR ONBOARDING"}
        </span>
        <span>THOUGHTFUL FROM THE START</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2 id="onboarding-title">
          Your community.
          <br />
          <em>Your next step.</em>
        </h2>
        <div>
          <p>
            {compact
              ? "Creator access begins with an application and a human review."
              : "A clear path from introducing your channel to setting up your first interaction. Here is the planned V2 onboarding journey."}
          </p>
          <div className="onboarding-availability">
            <strong>V2 applications aren’t open yet.</strong>
            <p>Verification and activation are still being completed. You can email us about creator onboarding in the meantime.</p>
            <a
              className="onboarding-contact"
              href="mailto:ankit@hyperchat.space?subject=HyperChat%20creator%20onboarding"
            >
              Ask about creator onboarding <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <ol className="onboarding-steps">
        {onboarding.map(([title, copy], i) => (
          <li key={title} data-reveal>
            <span className="step-number">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>
        ))}
      </ol>
      <div className="setup-note">
        <span className="eyebrow">AFTER ACTIVATION</span>
        <p>
          Choose the interaction types viewers can use, set your moderation
          preferences, and add your HyperChat browser sources to OBS. Check your
          alerts and audio before going live.
        </p>

      </div>
    </section>
  );
}
