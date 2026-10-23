import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import Navigation from "./components/Navigation";
import MascotCursor from "./components/MascotCursor";
import { useExperienceMotion } from "./hooks/useExperienceMotion";

import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import CreatorsPage from "./pages/CreatorsPage";
import CompanyPage from "./pages/CompanyPage";
import SupportPage from "./pages/SupportPage";
import PageIntro from "./pages/PageIntro";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const titles: Record<string, string> = {
    "/": "Your stream. Your community.",
    "/features": "Features",
    "/creators": "For creators",
    "/company": "Company",
    "/support": "Support",
  };
  useEffect(() => {
    document.title = `HyperChat — ${titles[path] ?? "Page not found"}`;
  }, [path]);
  const page =
    path === "/" ? (
      <HomePage />
    ) : path === "/features" ? (
      <FeaturesPage />
    ) : path === "/creators" ? (
      <CreatorsPage />
    ) : path === "/support" ? (
      <SupportPage />
    ) : path === "/company" ? (
      <CompanyPage />
    ) : (
      <>
        <PageIntro
          eyebrow="404"
          title="This page isn’t here."
          copy="Find your way back to HyperChat."
        />
        <a className="button" href="/">
          Back to home
        </a>
      </>
    );

  const root = useRef<HTMLDivElement>(null);
  useExperienceMotion(root);
  return (
    <div ref={root} className="site-root">
      <MascotCursor />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="reading-progress" aria-hidden="true" />
      <div className="atmosphere" aria-hidden="true" />
      {path === "/" && (
        <svg
          className="scene-word"
          viewBox="0 0 1500 240"
          aria-hidden="true"
          focusable="false"
        >
          <text
            x="750"
            y="190"
            textAnchor="middle"
            fontSize="230"
            letterSpacing="-17"
            fill="currentColor"
          >
            HYPERCHAT
          </text>
        </svg>
      )}
      <div className="grain" aria-hidden="true" />
      <Navigation />
      <main id="main" tabIndex={-1}>
        {page}
      </main>
      <footer className="footer">
        <div className="footer-company">
          <span>© {new Date().getFullYear()} HyperChat</span>
          <p>HyperChat is a product of Streamheart Private Limited.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/features">Features</a>
          <a href="/creators">For creators</a>
          <a href="/company">Company</a>
          <a href="/support">Support</a>
          <a href="https://www.hyperchat.space/privacy-policy">Privacy</a>
          <a href="https://www.hyperchat.space/terms-and-conditions">Terms</a>
          <a href="https://www.hyperchat.space/cancellation-refunds">Refunds</a>
          <a href="mailto:ankit@hyperchat.space">ankit@hyperchat.space</a>
        </nav>
        <a href="#main">
          Back to top <ArrowUp size={15} />
        </a>
      </footer>
    </div>
  );
}
