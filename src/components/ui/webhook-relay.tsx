import "react-isokit/styles.css";
import "./webhook-relay.css";
import InteractionFlow from "./interaction-flow";

export default function WebhookRelay() {
  return <section id="integrations" className="section-shell light integration-section" aria-labelledby="integration-title">
    <div className="integration-heading"><span className="eyebrow">CONNECTED TO YOUR STREAM</span><h2 id="integration-title">From their message.<br/>To your live moment.</h2><p>Bring HyperChat into OBS with a browser source. Your audience interacts, you choose what goes through, and the alert becomes part of your broadcast.</p></div>
    <InteractionFlow />
    <ol className="integration-steps">{[
      ["VIEWER", "Their interaction", "Viewers send text, TTS, their own recorded voice, or sounds where enabled."],
      ["HYPERCHAT", "Your creator controls", "Your settings determine moderation and what can continue through the queue."],
      ["OBS", "Your browser source", "Add your HyperChat source to OBS and check visibility and audio before going live."],
      ["LIVE", "A shared moment", "Approved interactions can appear on stream, subject to the queue and your settings."],
    ].map(([label,title,copy],i)=><li key={label}><span>0{i+1} / {label}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
    <p className="integration-note">Illustrative demo with automatic approval for the sample. Your creator settings determine actual moderation. No message is sent to a creator or connected to OBS. <a href="/support#obs-help">Need help with OBS? ↗</a></p>
  </section>;
}
