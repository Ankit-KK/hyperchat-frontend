import { lazy, Suspense, useRef } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowDownRight,
  Asterisk,
  ArrowUp,
  AudioLines,
  Radio,
  MoveUpRight,
} from "lucide-react";
import Navigation from "./components/Navigation";
import SceneControls from "./components/SceneControls";
import Faq from "./components/Faq";
import LiveRoom from "./components/LiveRoom";
import { useExperienceMotion } from "./hooks/useExperienceMotion";
const Sculpture = lazy(() => import("./components/Sculpture"));

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  useExperienceMotion(root);

  return (
    <div ref={root}>
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
          <div className="sculpture scene-loading" aria-hidden="true">
            <span>SHAPING A CONNECTION</span>
          </div>
        }
      >
        <Sculpture />
      </Suspense>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-top">
            <span className="eyebrow">
              <span className="status-dot" /> A NEW FREQUENCY OF CONNECTION
            </span>
            <span className="edition">
              INDEPENDENT VOICES / SHARED POSSIBILITIES
            </span>
          </div>
          <div className="hero-content">
            <div className="hero-index">
              <span className="index-line" /> THE HUMAN SIDE OF LIVE
            </div>
            <h1 id="hero-title">
              Less distance.
              <br />
              More <em>presence.</em>
            </h1>
            <p>
              A space for voices to meet, stories to unfold,
              <br className="desktop-break" /> and moments to become something
              shared.
            </p>
            <div className="hero-actions">
              <a href="#live-room" className="button ivory">
                Find your frequency <ArrowUpRight size={18} />
              </a>
              <a href="#about" className="subtle-link">
                Discover HyperChat{" "}
                <ArrowDownRight size={15} aria-hidden="true" />
              </a>
            </div>
            <span className="hero-footnote">
              OPEN MINDS. OPEN CONVERSATIONS.
            </span>
          </div>
          <SceneControls />
          <div className="hero-bottom">
            <a href="#about" className="scroll-link">
              <span className="round-icon">
                <ArrowDown size={15} />
              </span>{" "}
              SCROLL TO TUNE IN
            </a>
            <span>REAL PEOPLE. REAL TIME. REAL CONNECTION.</span>
            <span className="coordinates">A NEW CHAPTER — V.02</span>
          </div>
        </section>
        <section className="intro section-shell" id="about">
          <div className="section-label" data-reveal>
            <span>01 / THE IDEA</span>
            <span>BUILT AROUND PEOPLE</span>
          </div>
          <div className="intro-grid">
            <h2 data-reveal>
              The internet is loud.
              <br />
              Let’s make it
              <br />
              <em>feel closer.</em>
            </h2>
            <div className="intro-copy" data-reveal>
              <span className="mini-mark">
                <AudioLines size={38} />
              </span>
              <p>
                Some moments deserve more than a like. A conversation that goes
                somewhere. A voice that feels familiar. That feeling of being
                part of it.
              </p>
              <p>
                HyperChat is being built for those moments. A more human way to
                go live, find your people, and be here. Together.
              </p>
              <a className="text-link" href="#live-room">
                Step into a conversation <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="manifesto" data-reveal>
            <span>LESS BROADCAST.</span>
            <span>MORE BACK-AND-FORTH.</span>
            <AudioLines size={22} />
          </div>
        </section>
        <section className="experience section-shell" id="experience">
          <div className="section-label" data-reveal>
            <span>02 / THE EXPERIENCE</span>
            <span>DESIGNED TO BRING YOU IN</span>
          </div>
          <div className="experience-heading" data-reveal>
            <h2>
              Don’t just watch.
              <br />
              <em>Be part of it.</em>
            </h2>
            <p>
              From the first hello to the last
              <br />
              “one more minute.”
            </p>
          </div>
          <div className="experience-grid">
            <article className="feature-card conversation" data-reveal>
              <div className="card-visual">
                <div className="signal-label">
                  <span className="status-dot" /> A CONVERSATION IN MOTION
                </div>
                <div className="waveform" aria-hidden="true">
                  {Array.from({ length: 39 }, (_, i) => (
                    <i
                      key={i}
                      style={{
                        height: `${14 + Math.abs(Math.sin(i * 1.7)) * 65}%`,
                        animationDelay: `${i * 0.06}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="visual-bottom">
                  <span>YOUR VOICE BELONGS HERE</span>
                  <Radio size={19} />
                </div>
              </div>
              <div className="card-copy">
                <span className="card-number">01</span>
                <h3>Live, with feeling.</h3>
                <p>
                  A shared space for spontaneous conversation. Less performing.
                  More being yourself.
                </p>
                <a href="#live-room" className="card-link">
                  Try a conversation <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
            <article className="feature-card connection" data-reveal>
              <div className="card-visual orbital">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="orbit orbit-three" />
                <div className="orbit-center">
                  <AudioLines size={36} />
                </div>
                <span className="orbit-node node-one" />
                <span className="orbit-node node-two" />
                <span className="signal-label">
                  DIFFERENT WORLDS. SAME WAVELENGTH.
                </span>
                <span className="orbital-foot">
                  A LITTLE CLOSER, EVERY DAY.
                </span>
              </div>
              <div className="card-copy">
                <span className="card-number">02</span>
                <h3>Your kind of people.</h3>
                <p>
                  Follow your curiosity. Find familiar energy. Build connections
                  that outlast the stream.
                </p>
                <a href="#live-room" className="card-link">
                  Explore the rooms <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          </div>
          <div className="experience-principles" data-reveal>
            <div>
              <span>01</span>Come as you are.
            </div>
            <div>
              <span>02</span>Stay curious.
            </div>
            <div>
              <span>03</span>Make room for others.
            </div>
          </div>
        </section>
        <section className="interlude">
          <div data-reveal>
            <span className="eyebrow">A SMALL REMINDER</span>
            <h2>
              Great things happen
              <br />
              when we <em>show up.</em>
            </h2>
            <span className="interlude-note">
              BRING YOUR VOICE. WE’LL MAKE ROOM.
            </span>
            <a
              className="interlude-link"
              href="#live-room"
              aria-label="Enter the listening room"
            >
              <ArrowDown size={21} />
            </a>
          </div>
          <span className="interlude-symbol" aria-hidden="true">
            <Asterisk size={90} strokeWidth={1} />
          </span>
        </section>
        <LiveRoom />
        <Faq />
        <section className="next section-shell" id="next">
          <div className="section-label">
            <span>05 / THIS IS JUST THE BEGINNING</span>
            <span className="eyebrow">
              <span className="status-dot" /> IN DEVELOPMENT
            </span>
          </div>
          <div data-reveal>
            <h2>
              The next chapter
              <br />
              sounds like <em>us.</em>
            </h2>
            <p>
              A new space for live connection is taking shape.
              <br />
              Come curious. Leave a little more connected.
            </p>
            <a className="button dark" href="#live-room">
              Make yourself at home <MoveUpRight size={18} />
            </a>
          </div>
          <span className="next-stamp" aria-hidden="true">
            <AudioLines size={60} />
          </span>
        </section>
      </main>
      <footer className="footer">
        <a className="brand" href="#main">
          <AudioLines size={24} /> hyperchat<span>V2</span>
        </a>
        <span>BE HERE. TOGETHER.</span>
        <a href="#main">
          Back to the top <ArrowUp size={15} />
        </a>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} HyperChat. All rights reserved.
          </span>
          <span>INDEPENDENT VOICES. SHARED POSSIBILITIES.</span>
        </div>
      </footer>
    </div>
  );
}
