import { lazy, Suspense, useEffect, useRef } from "react";
import PushpinTearFooter from "./components/ui/pushpin-tear-footer";
import Navigation from "./components/Navigation";
import MascotCursor from "./components/MascotCursor";
import PageExperience from "./components/PageExperience";
import PageLoadBoundary from "./components/PageLoadBoundary";

const NotFoundPage = lazy(() => import("./components/ui/phosphor-crt-404"));

const DemoSignupPage = lazy(() => import("./pages/DemoSignupPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const FeaturesPage = lazy(() => import("./pages/FeaturesPage"));
const CreatorsPage = lazy(() => import("./pages/CreatorsPage"));
const CompanyPage = lazy(() => import("./pages/CompanyPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const legalTitles: Record<string, string> = {
  "/privacy-policy": "Privacy Policy",
  "/terms-and-conditions": "Creator Terms",
  "/viewer-terms": "Viewer Interaction Terms",
  "/cancellation-refunds": "Refund & Cancellation Policy",
};

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const titles: Record<string, string> = {
    "/": "Your stream. Your community.",
    "/features": "Features",
    "/creators": "For creators",
    "/company": "Company",
    "/support": "Support",
    "/demo-signup": "Signup preview",
  };
  useEffect(() => {
    document.title = `HyperChat — ${titles[path] ?? legalTitles[path] ?? "Page not found"}`;
  }, [path]);
  const page =
    path === "/demo-signup" ? (<DemoSignupPage />) : path === "/" ? (
      <HomePage />
    ) : path === "/features" ? (
      <FeaturesPage />
    ) : path === "/creators" ? (
      <CreatorsPage />
    ) : path === "/support" ? (
      <SupportPage />
    ) : path === "/company" ? (
      <CompanyPage />
    ) : legalTitles[path] ? (
      <LegalPage path={path} />
    ) : (
      <NotFoundPage />
    );

  const root = useRef<HTMLDivElement>(null);
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
        <PageLoadBoundary>
          <Suspense fallback={<div className="page-loading section-shell" role="status">Loading page…</div>}>
            <PageExperience root={root}>{page}</PageExperience>
          </Suspense>
        </PageLoadBoundary>
      </main>
      <PushpinTearFooter />
    </div>
  );
}
