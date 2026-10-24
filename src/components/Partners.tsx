import { ArrowUpRight } from "lucide-react";

export default function Partners() {
  return <section id="partners" className="partners-section section-shell" aria-labelledby="partners-title">
    <div className="section-label"><span>PARTNERS & SUPPORT</span><span>BUILDING THE NEXT CHAPTER</span></div>
    <div className="partners-intro"><h2 id="partners-title">Good company.<br/><em>Shared possibilities.</em></h2><p>Working with people and tools that help creators do more.</p></div>
    <div className="partners-grid">
      <article className="partner-card">
        <span className="eyebrow">OUR PARTNER</span>
        <div className="partner-brand"><img src="/partners/clipwave.png" alt="ClipWave" width="851" height="640" loading="lazy" decoding="async" /></div>
        <h3>Keep the moment going.</h3>
        <p>ClipWave helps creators automatically generate stream clips, maintain public clip pages, and send clip notifications to Discord.</p>
        <a href="https://platform.clipwave.site/" target="_blank" rel="noopener noreferrer">Visit ClipWave <ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
      <article className="partner-card">
        <span className="eyebrow">SUPPORTED BY</span>
        <div className="partner-brand"><span className="grants-wordmark">ElevenLabs<span>Grants</span></span></div>
        <h3>Support for what’s next.</h3>
        <p>HyperChat is supported by ElevenLabs Startup Grants.</p>
        <a href="https://elevenlabs.io/startup-grants" target="_blank" rel="noopener noreferrer">Explore ElevenLabs Grants <ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
    </div>
  </section>;
}
