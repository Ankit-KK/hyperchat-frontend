import { ArrowUpRight, MessageCircle, Mic, Image, Check, ShieldCheck, AudioLines } from "lucide-react";
import "./StoryDepth.css";
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
function StepIllustration({ step }: { step: number }) {
  return <div className={`story-visual story-visual-${step}`} aria-hidden="true">
    {step === 0 ? <div className="story-message-card"><span className="story-mini-label">FROM YOUR AUDIENCE</span><div className="story-mini-person"><span>A</span><strong>Ari <small>Example viewer</small></strong></div><div className="story-mini-message">This made my evening.<br/>Keep creating!</div><div className="story-mini-formats"><MessageCircle size={15}/><Mic size={15}/><Image size={15}/><AudioLines size={15}/></div></div>
    : step === 1 ? <div className="story-review-card"><span className="story-mini-label"><ShieldCheck size={13}/> CREATOR REVIEW</span><div className="story-review-row"><span className="story-review-dot"/><span>Ari’s message<small>Ready for your review</small></span></div><div className="story-review-sample"><Check size={14}/> Approved example</div><span className="story-mini-foot">YOUR SETTINGS. YOUR CALL.</span></div>
    : <div className="story-broadcast"><div className="story-broadcast-chrome"><i/><i/><i/><span>YOUR EXISTING STREAM</span></div><div className="story-broadcast-stage"><span className="story-stage-label">A MOMENT TOGETHER</span><div className="story-mini-alert"><MessageCircle size={18}/><span><strong>Ari joined the moment</strong><small>This made my evening.</small></span></div><AudioLines className="story-wave" size={25}/></div></div>}
  </div>;
}
export default function InteractionStory({ depth = false }: { depth?: boolean }) {
  return (
    <section
      className={`interaction-story section-shell light ${depth ? "story-depth" : ""}`}
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
            {depth && <StepIllustration step={i} />}
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
