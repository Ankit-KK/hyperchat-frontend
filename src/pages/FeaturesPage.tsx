import ConnectedModeration from "../components/ConnectedModeration";
import WebhookRelay from "../components/ui/webhook-relay";
import CreatorControl from "../components/CreatorControl";
import CreatorFeatures from "../components/CreatorFeatures";
import InteractionStory from "../components/InteractionStory";
import PageIntro from "./PageIntro";
export default function FeaturesPage() {
  return (
    <>
      <PageIntro
        eyebrow="THE FEATURES"
        title="More ways to join the moment."
        copy="Explore audience interactions, on-stream alerts, and the controls that keep your broadcast yours."
      />
      <InteractionStory overview />
      <CreatorFeatures introduction="Pick a tool and try its local preview. Start with a message, then explore sound, media, and more." />
      <WebhookRelay />
      <ConnectedModeration />
      <CreatorControl />
    </>
  );
}
