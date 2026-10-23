import { ArrowUpRight } from "lucide-react";
import PageIntro from "./PageIntro";
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

export default function CreatorsPage() {
  return (
    <>
      <PageIntro
        eyebrow="FOR CREATORS"
        title="Your next chapter starts here."
        copy="Get to know the planned onboarding process, prepare your OBS setup, and find answers before you begin."
      />{" "}
      <section
        className="onboarding section-shell light"
        id="onboarding"
        aria-labelledby="onboarding-title"
      >
        <div className="section-label">
          <span>01 / CREATOR ONBOARDING</span>
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
              A clear path from introducing your channel to setting up your
              first interaction. Here is the planned V2 onboarding journey.
            </p>
            <span className="note-tag">PLANNED V2 ONBOARDING</span>
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
            preferences, and add your HyperChat browser sources to OBS. Check
            your alerts and audio before going live.
          </p>
          <div className="availability">
            V2 verification and activation are still being completed. This
            preview does not accept applications.
            <a
              className="onboarding-contact"
              href="mailto:ankit@hyperchat.space?subject=HyperChat%20creator%20onboarding"
            >
              Ask about creator onboarding{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section
        className="section-shell light page-faq"
        aria-labelledby="faq-title"
      >
        <h2 id="faq-title">Before you go live.</h2>
        <details>
          <summary>Can I apply through this preview?</summary>
          <p>
            Not yet. V2 verification and activation are still being completed.
            For onboarding questions, email{" "}
            <a href="mailto:ankit@hyperchat.space">ankit@hyperchat.space</a>.
          </p>
        </details>
        <details>
          <summary>Do I need to change where I stream?</summary>
          <p>
            No. HyperChat adds interactions to your existing broadcast through
            OBS browser sources.
          </p>
        </details>
        <details>
          <summary>What should I check in OBS?</summary>
          <p>
            After activation, add your creator browser sources, check the alert
            layout and audio levels, and review your moderation settings before
            going live.
          </p>
        </details>
        <details>
          <summary>How is a voice message different from TTS?</summary>
          <p>
            Text-to-speech reads typed words aloud using a generated voice. A
            voice message plays a recording made by the viewer.
          </p>
        </details>
      </section>
    </>
  );
}
