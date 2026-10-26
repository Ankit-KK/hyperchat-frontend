import "./CreatorTermsOverview.css";
import CreatorOnboarding from "../components/CreatorOnboarding";
import PageIntro from "./PageIntro";
export default function CreatorsPage() {
  return (
    <>
      <PageIntro
        eyebrow="FOR CREATORS"
        title="Your next chapter starts here."
        copy="Get to know the planned onboarding process, prepare your OBS setup, and find answers before you begin."
      />{" "}
      <section className="creator-terms-overview section-shell light" aria-labelledby="creator-terms-title">
        <div className="section-label"><span>THE PRACTICAL DETAILS</span><span>FEES & PAYOUTS</span></div>
        <h2 id="creator-terms-title">Know where you stand.</h2>
        <dl className="creator-terms-facts">
          <div><dt>Platform fee</dt><dd>11<span>%</span></dd></div>
          <div><dt>Payout schedule</dt><dd>Monthly</dd></div>
          <div><dt>International payments</dt><dd>Accepted</dd></div>
        </dl>
        <p>For creator eligibility and settlement conditions, read our <a href="/terms-and-conditions">Creator Terms</a>. Questions? <a href="mailto:ankit@hyperchat.space?subject=Creator%20fees%20and%20payouts">Contact the team</a>.</p>
      </section>
      <CreatorOnboarding />
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
