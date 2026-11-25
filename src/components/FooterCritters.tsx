import { lazy, Suspense, useEffect, useRef, useState, Component, type ReactNode } from "react";
import "./FooterCritters.css";
const Scene = lazy(() => import("./ui/footer-critter-scene"));
class CritterBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="footer-critters-loading">Our little companions couldn’t load. The footer links are still available.</p> : this.props.children; }
}
export default function FooterCritters() {
  const root = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: "400px" });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className="footer-critters" aria-label="Playful footer companions">
    {nearby && <CritterBoundary><Suspense fallback={<p className="footer-critters-loading" role="status">A little company is on its way…</p>}><Scene /></Suspense></CritterBoundary>}
  </div>;
}
