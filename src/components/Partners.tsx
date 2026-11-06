import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import "./Partners.css";

export default function Partners({ compact = false }: { compact?: boolean }) {
  const [badgeFailed, setBadgeFailed] = useState(false);
  return <section id="partners" className={`partners-section section-shell ${compact ? "partners-compact" : ""}`} aria-labelledby="partners-title">
    <div className="section-label"><span>PARTNERS & SUPPORT</span><span>BUILDING THE NEXT CHAPTER</span></div>
    <div className="partners-intro" data-reveal><h2 id="partners-title">Good company.<br/><em>Shared possibilities.</em></h2><p>Working with people and tools that help creators do more.</p></div>
    <div className="partners-grid">
      <article className="partner-card" data-reveal>
        <span className="eyebrow">OUR PARTNER</span>
        <div className="partner-brand"><img src="/partners/clipwave.webp" alt="ClipWave" width="440" height="331" loading="lazy" decoding="async" /></div>
        {!compact && <h3>Keep the moment going.</h3>}
        <p>ClipWave helps creators automatically generate stream clips, maintain public clip pages, and send clip notifications to Discord.</p>
        <a href="https://platform.clipwave.site/" target="_blank" rel="noopener noreferrer">Visit ClipWave <ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
      <article className="partner-card" data-reveal>
        <span className="eyebrow">OUR PARTNER</span>
        <div className="partner-brand"><img className="soraivy-logo" src="/partners/soraivy.webp" alt="Soraivy" width="760" height="298" loading="lazy" decoding="async" /></div>
        {!compact && <h3>Meet Soraivy.</h3>}
        <p>Soraivy is a creator-first video platform built in India, designed to help small and emerging creators grow faster and earn more.</p>
        <a href="https://soraivy.com/" target="_blank" rel="noopener noreferrer">Visit Soraivy <ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
      <article className="partner-card" data-reveal>
        <span className="eyebrow">SUPPORTED BY</span>
        <div className="partner-brand"><a className="grants-badge-link" href="https://elevenlabs.io/startup-grants" target="_blank" rel="noopener noreferrer" aria-label="ElevenLabs Grants (opens in a new tab)">{badgeFailed ? <span className="grants-wordmark">ElevenLabs<span> Grants</span></span> : <img className="grants-logo" src="https://eleven-public-cdn.elevenlabs.io/payloadcms/cy7rxce8uki-IIElevenLabsGrants%201.webp" alt="ElevenLabs Grants" loading="lazy" decoding="async" onError={() => setBadgeFailed(true)} />}</a></div>
        {!compact && <h3>Support for what’s next.</h3>}
        <p>HyperChat is supported by ElevenLabs Startup Grants.</p>
        <a href="https://elevenlabs.io/startup-grants" target="_blank" rel="noopener noreferrer">Explore ElevenLabs Grants <ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
    </div>
  </section>;
}
