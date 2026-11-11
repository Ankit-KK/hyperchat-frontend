import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import "./CreatorSignupCta.css";

export default function CreatorSignupCta({ lightSurface = false }: { lightSurface?: boolean }) {
  const noteId = useId();
  return (
    <div className={`creator-signup-cta${lightSurface ? " creator-signup-cta-light" : ""}`}>
      <a className={`button ${lightSurface ? "dark" : "ivory"}`} href="/demo-signup" aria-describedby={noteId}>
        Join HyperChat <ArrowUpRight size={18} aria-hidden="true" />
      </a>
      <p id={noteId}>Signup preview only. No account is created.</p>
    </div>
  );
}
