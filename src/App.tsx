import { lazy, Suspense, useRef } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Navigation from "./components/Navigation";
import SceneControls from "./components/SceneControls";
import InteractionDemo from "./components/InteractionDemo";
import CreatorFeatures from "./components/CreatorFeatures";
import Moments from "./components/Moments";
import { useExperienceMotion } from "./hooks/useExperienceMotion";
const Sculpture = lazy(() => import("./components/Sculpture"));

const onboarding = [
  ["Apply", "Tell HyperChat about you and your channel."],
  ["Manual review", "The team reviews your creator application."],
  [
    "Account setup",
    "Approved creators receive an invitation to set up their account.",
  ],
  [
    "Didit verification",
    "Complete identity verification as part of the planned V2 process.",
  ],
  [
    "Activation",
    "Creator access is activated after approval and verification.",
  ],
];

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  useExperienceMotion(root);
  return (
    <div ref={root} className="site-root">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="reading-progress" aria-hidden="true" />
      <div className="atmosphere" aria-hidden="true" />
      <div className="scene-word" aria-hidden="true">
        HYPERCHAT
      </div>
      <Suspense
        fallback={
          <div className="sculpture scene-loading" aria-hidden="true" />
        }
      >
        <Sculpture />
      </Suspense>
      <div className="grain" aria-hidden="true" />
      <Navigation />
      <main id="main" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-top eyebrow">
            <span>
              <i className="status-dot" /> BUILT AROUND YOUR AUDIENCE
            </span>
            <span>CREATOR CONNECTION / V.02</span>
          </div>
          <div className="hero-content">
            <span className="eyebrow hero-kicker">
              A LITTLE SUPPORT. A SHARED MOMENT.
            </span>
            <h1 id="hero-title">
              Your Stream.
              <br />
              Your Community.
              <br />
              <em>Your HyperChat.</em>
            </h1>
            <p>
              Turn viewer support into on-stream moments.
              <br className="desktop-break" /> Donations, alerts, and audience
              interactions —<br className="desktop-break" /> alongside the
              platform you already stream on.
            </p>
            <div className="hero-actions">
              <a href="#interaction" className="button ivory">
                See it in action <ArrowUpRight size={18} />
              </a>
              <a href="#onboarding" className="text-link">
                For creators <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <SceneControls />
          <div className="hero-bottom eyebrow">
            <a href="#interaction">
              <span className="round-icon">
                <ArrowDown size={16} />
              </span>{" "}
              SCROLL INTO THE MOMENT
            </a>
            <span>YOUR BROADCAST. A CLOSER COMMUNITY.</span>
          </div>
        </section>
        <section
          className="interaction section-shell light"
          id="interaction"
          aria-labelledby="interaction-title"
        >
          <div className="section-label">
            <span>01 / THE CONNECTION</span>
            <span>FROM ONE VIEWER TO EVERYONE</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2 id="interaction-title">
              Every interaction
              <br />
              <em>matters.</em>
            </h2>
            <p>
              A message of support becomes part of the show.
              <br />
              Follow its journey from viewer to stream.
            </p>
          </div>
          <InteractionDemo />
          <div className="section-foot">
            <span>ONE SMALL GESTURE. A MOMENT SHARED.</span>
            <span>INTERACTIVE PRODUCT PREVIEW ↗</span>
          </div>
        </section>
        <CreatorFeatures />
        <Moments />
        <section
          className="onboarding section-shell light"
          id="onboarding"
          aria-labelledby="onboarding-title"
        >
          <div className="section-label">
            <span>04 / YOUR NEXT CHAPTER</span>
            <span>THOUGHTFUL FROM THE START</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2 id="onboarding-title">
              Your community.
              <br />
              <em>Your next step.</em>
            </h2>
            <div>
              <p>
                Creator access begins with an application and a human review.
              </p>
              <span className="note-tag">PLANNED V2 ONBOARDING</span>
            </div>
          </div>
          <ol className="onboarding-steps">
            {onboarding.map(([title, copy], i) => (
              <li key={title} data-reveal>
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
          <div className="setup-note">
            <span className="eyebrow">AFTER ACTIVATION</span>
            <p>
              Set your donation preferences, choose your moderation settings,
              and connect your OBS browser sources. Then bring HyperChat into
              your broadcast.
            </p>
            <span className="availability">
              V2 verification and activation are still being completed. This
              preview does not accept applications.
            </span>
          </div>
        </section>
        <section
          className="control section-shell"
          id="control"
          aria-labelledby="control-title"
        >
          <div className="section-label">
            <span>05 / YOUR SPACE, YOUR SAY</span>
            <span>SAFETY & CONTROL</span>
          </div>
          <div className="control-grid">
            <div data-reveal>
              <ShieldCheck className="control-icon" size={42} strokeWidth={1} />
              <h2 id="control-title">
                Keep the energy.
                <br />
                <em>Set the boundaries.</em>
              </h2>
              <p>
                Your community has its own rhythm.
                <br />
                Choose how interactions reach your stream.
              </p>
            </div>
            <div className="control-list">
              <article data-reveal>
                <SlidersHorizontal size={22} />
                <div>
                  <h3>Review before the spotlight.</h3>
                  <p>
                    Choose manual review or automatic approval. Hide messages
                    and manage the moderation queue.
                  </p>
                </div>
              </article>
              <article data-reveal>
                <Users size={22} />
                <div>
                  <h3>Make room for your team.</h3>
                  <p>
                    Manage moderator permissions and banned donors with controls
                    scoped to your creator account.
                  </p>
                </div>
              </article>
              <article data-reveal>
                <Check size={22} />
                <div>
                  <h3>Keep access in your hands.</h3>
                  <p>
                    Manage your OBS connection tokens and revoke access when
                    your setup changes.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section
          className="closing section-shell light"
          id="next"
          aria-labelledby="closing-title"
        >
          <div className="section-label">
            <span>06 / MORE THAN A MESSAGE</span>
            <span>MADE FOR THE MOMENTS BETWEEN</span>
          </div>
          <div className="closing-content" data-reveal>
            <span className="eyebrow">LET YOUR AUDIENCE BE PART OF IT.</span>
            <h2 id="closing-title">
              Make it <em>mean more.</em>
            </h2>
            <a href="#interaction" className="button dark">
              Experience HyperChat <ArrowUpRight size={18} />
            </a>
            <p>Explore the preview. See what a little support can become.</p>
          </div>
          <div className="closing-word" aria-hidden="true">
            HYPERCHAT
          </div>
        </section>
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} HyperChat</span>
        <span>CREATOR TOOLS. HUMAN CONNECTION.</span>
        <a href="#main">
          Back to top <ArrowUp size={15} />
        </a>
      </footer>
    </div>
  );
}
