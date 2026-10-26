import "../components/ClosingEditorial.css";
import PlatformMetrics from "../components/PlatformMetrics";
import Partners from "../components/Partners";
import InteractionStory from "../components/InteractionStory";
import CreatorFeatures from "../components/CreatorFeatures";
import CreatorOnboarding from "../components/CreatorOnboarding";
import CreatorControl from "../components/CreatorControl";
import { ArrowUpRight } from "lucide-react";
import ProductHero from "../components/ProductHero";
import LiquidSculptureHero from "../components/ui/liquid-sculpture-hero";
import ScrollMorphHero from "../components/ui/scroll-morph-hero";
import { showcaseCreators } from "../data/showcase-creators";
export default function HomePage() {
  return (
    <>
      <ProductHero />
      <InteractionStory depth />
      <PlatformMetrics />
      <Partners compact />
      <CreatorFeatures depth />
      <ScrollMorphHero creators={showcaseCreators} />
      <CreatorOnboarding compact />
      <CreatorControl home />
      <section
        className="closing closing-liquid closing-editorial section-shell light"
        id="next"
        aria-labelledby="closing-title"
      >
        <div className="section-label">
          <span>05 / MORE THAN A MESSAGE</span>
          <span>MADE FOR THE MOMENTS BETWEEN</span>
        </div>
        <LiquidSculptureHero />
        <div className="closing-content" data-reveal>
          <div className="closing-heading">
          <span className="eyebrow">LET YOUR AUDIENCE BE PART OF IT.</span>
          <h2 id="closing-title">
            Make it <em>mean more.</em>
          </h2>
          </div>
          <div className="closing-invitation">
          <p>One message. One voice. A moment you share.</p>
          <a href="#interaction" className="button dark">
            Experience HyperChat <ArrowUpRight size={18} />
          </a>
          <span className="closing-preview-note">Explore the interactive preview.</span>
          </div>
        </div>
      </section>
    </>
  );
}
