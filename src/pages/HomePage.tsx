import { ArrowUpRight } from "lucide-react";
import ProductHero from "../components/ProductHero";
import LiquidSculptureHero from "../components/ui/liquid-sculpture-hero";
import ScrollMorphHero from "../components/ui/scroll-morph-hero";
import { showcaseCreators } from "../data/showcase-creators";
export default function HomePage() {
  return (
    <>
      <ProductHero />
      <section
        className="section-shell light home-overview"
        id="overview"
        aria-labelledby="overview-title"
      >
        <div className="section-label">
          <span>01 / MADE FOR LIVE</span>
          <span>SMALL INTERACTIONS. SHARED EXPERIENCES.</span>
        </div>
        <h2 id="overview-title">Their voice. Your way.</h2>
        <div className="overview-grid">
          <article>
            <h3>Let viewers join in.</h3>
            <p>
              Messages, text-to-speech, recorded voices, and sounds bring your
              audience into the moment.
            </p>
          </article>
          <article>
            <h3>Keep your stream yours.</h3>
            <p>
              Choose interaction types and moderation settings that fit your
              community.
            </p>
          </article>
          <article>
            <h3>Stay in your setup.</h3>
            <p>
              Bring alerts and audio into your existing broadcast with OBS
              browser sources.
            </p>
          </article>
        </div>
        <a className="text-link" href="/features">
          Explore the features <ArrowUpRight size={16} />
        </a>
      </section>
      <ScrollMorphHero creators={showcaseCreators} />{" "}
      <section
        className="closing closing-liquid section-shell light"
        id="next"
        aria-labelledby="closing-title"
      >
        <div className="section-label">
          <span>03 / MORE THAN A MESSAGE</span>
          <span>MADE FOR THE MOMENTS BETWEEN</span>
        </div>
        <LiquidSculptureHero />
        <div className="closing-content" data-reveal>
          <span className="eyebrow">LET YOUR AUDIENCE BE PART OF IT.</span>
          <h2 id="closing-title">
            Make it <em>mean more.</em>
          </h2>
          <a href="#interaction" className="button dark">
            Experience HyperChat <ArrowUpRight size={18} />
          </a>
          <p>Explore the preview. See what a small interaction can become.</p>
        </div>
      </section>
    </>
  );
}
