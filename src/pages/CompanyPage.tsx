import PageIntro from "./PageIntro";
export default function CompanyPage() {
  return (
    <>
      <PageIntro
        eyebrow="COMPANY"
        title="Built around human connection."
        copy="HyperChat is a product of Streamheart Private Limited. We help live creators bring their audiences into the conversation."
      />
      <section
        className="section-shell light company-content"
        aria-labelledby="about-title"
      >
        <h2 id="about-title">A closer connection, live.</h2>
        <p>
          HyperChat gives viewers ways to participate through messages, voices,
          sounds, and on-stream interactions. Creators choose how those
          interactions become part of their broadcast.
        </p>
        <div className="overview-grid">
          <article>
            <h3>Creator questions</h3>
            <p>
              Ask about onboarding, setup, or bringing HyperChat to your
              channel.
            </p>
            <a href="mailto:ankit@hyperchat.space?subject=Creator%20enquiry">
              Contact the team
            </a>
          </article>
          <article>
            <h3>Need help?</h3>
            <p>
              Find help with OBS alerts, audio, voice messages, and moderation,
              or contact the team.
            </p>
            <a href="/support">Visit Support</a>
          </article>
          <article>
            <h3>Company</h3>
            <p>HyperChat is a product of Streamheart Private Limited.</p>
            <p>
              For company or partnership enquiries, contact our team by email.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
