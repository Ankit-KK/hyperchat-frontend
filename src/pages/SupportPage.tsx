import PageIntro from "./PageIntro";

const topics = [
  {
    id: "obs-help",
    title: "OBS alerts & audio",
    questions: [
      {
        title: "My alert is not appearing in OBS. What should I check?",
        answer:
          "Check that your HyperChat browser source is in the active OBS scene, is visible, and is not covered by another source. Confirm you are using the current source link from your creator setup. Then check whether the interaction is waiting for moderation or behind other items in the queue.",
      },
      {
        title: "I can see an alert, but I cannot hear it.",
        answer:
          "First check whether the interaction includes audio. Review the browser source’s audio settings in OBS, check that the relevant mixer channel is not muted, and check its volume. If you use OBS audio monitoring, check the monitoring device and routing too. Monitor output and stream output can differ, so verify with a short local recording before going live.",
      },
      {
        title: "The layout does not fit my stream.",
        answer:
          "Check the browser source dimensions and its scale or crop within your OBS scene. Compare the overlay with your broadcast canvas and make sure important text stays inside the visible area. You can explore an illustrative size preview on the Features page.",
      },
    ],
  },
  {
    id: "voice-help",
    title: "Text-to-speech & voice messages",
    questions: [
      {
        title: "What is the difference between TTS and a voice message?",
        answer:
          "Text-to-speech (TTS) reads a viewer’s typed message using a generated voice. A voice message plays the viewer’s own recorded audio. The available interaction types depend on what the creator enables.",
      },
      {
        title: "Why does the website’s speech preview not play?",
        answer:
          "Choose Text-to-speech in the toolkit preview, then press Play voice preview. This example uses a local voice provided by your browser or device. If no local voice is available, the preview shows a message instead. Check your device volume and whether the browser tab is muted. This demo is not a sample of the production AI voices.",
      },
      {
        title: "Can I record a voice message on this preview website?",
        answer:
          "This public website does not record or submit voice messages. The recorded-voice feature lets viewers use their own recording where it is enabled on a creator’s interaction page. Typing a message into the TTS preview does not make it a recorded voice message.",
      },
    ],
  },
  {
    id: "moderation-help",
    title: "Moderation & the interaction queue",
    questions: [
      {
        title: "Why has an interaction not appeared yet?",
        answer:
          "An interaction may be waiting for approval or for earlier items in the queue. The creator’s settings and moderation decisions affect what appears and when. Sending an interaction does not guarantee an immediate on-stream appearance.",
      },
      {
        title: "Can a creator review messages before they appear?",
        answer:
          "Creator settings support manual review or automatic approval. With manual review, the moderation team decides which pending interactions can continue. The review queue on the Features page is a local example you can try without affecting a live stream.",
      },
      {
        title: "Do the demo buttons change a real creator’s stream?",
        answer:
          "No. The public previews use fictional interactions and local browser state. Approving, hiding, resetting, or playing an example here does not send anything to a creator’s broadcast.",
      },
    ],
  },
];

export default function SupportPage() {
  return (
    <>
      <PageIntro
        eyebrow="SUPPORT"
        title="Keep the moment going."
        copy="Find a starting point for alerts, audio, voice messages, and moderation. If you need a hand, our team is an email away."
      />
      <div className="section-shell light support-content">
        <nav className="support-topics" aria-label="Support topics">
          {topics.map((topic) => (
            <a key={topic.id} href={`#${topic.id}`}>
              {topic.title}
            </a>
          ))}
          <a href="#contact-support">Contact support</a>
        </nav>
        {topics.map((topic) => (
          <section
            key={topic.id}
            id={topic.id}
            className="page-faq support-topic"
            aria-labelledby={`${topic.id}-title`}
          >
            <h2 id={`${topic.id}-title`}>{topic.title}</h2>
            {topic.questions.map((question) => (
              <details key={question.title}>
                <summary>{question.title}</summary>
                <p>{question.answer}</p>
              </details>
            ))}
          </section>
        ))}
        <section
          id="contact-support"
          className="support-contact"
          aria-labelledby="contact-support-title"
        >
          <span className="eyebrow">LET’S WORK THROUGH IT</span>
          <h2 id="contact-support-title">Still need a hand?</h2>
          <p>
            Email a short description of the issue, what you expected, and what
            happened. Include your browser or OBS version and any error text; a
            screenshot can help.
          </p>
          <p>
            Please leave out passwords, access tokens, and private OBS source
            URLs.
          </p>
          <a
            className="button dark"
            href="mailto:ankit@hyperchat.space?subject=HyperChat%20support"
          >
            Email ankit@hyperchat.space
          </a>
          <p className="support-contact-note">
            Opens your email app. For onboarding questions, see{" "}
            <a href="/creators">For creators</a>. To try the local demos, visit{" "}
            <a href="/features">Features</a>.
          </p>
        </section>
      </div>
    </>
  );
}
