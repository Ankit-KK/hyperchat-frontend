import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { headerWordmark as brandWordmark } from "../lib/brand";
const links = [
  { href: "/features", text: "Features" },
  { href: "/creators", text: "For creators" },
  { href: "/company", text: "Company" },
  { href: "/whats-new", text: "What’s new" },
  { href: "/support", text: "Support" },
];
export default function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && expanded) {
        setExpanded(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [expanded]);
  return (
    <header className="header">
      <a href="/" className="brand" title="HyperChat home">
        <img className="header-wordmark" src={brandWordmark} alt="HyperChat" width="750" height="104" />
      </a>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={`navigation ${expanded ? "expanded" : ""}`}
      >
        {links.map((link) => (
          <a
            href={link.href}
            key={link.href}
            aria-current={
              window.location.pathname.replace(/\/$/, "") === link.href
                ? "page"
                : undefined
            }
            onClick={() => setExpanded(false)}
          >
            {link.text}
          </a>
        ))}
      </nav>
      <a
        className="header-cta"
        href="/creators#onboarding"
        onClick={() => setExpanded(false)}
      >
        Creator onboarding <ArrowUpRight size={15} />
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={expanded ? "Close navigation" : "Open navigation"}
        aria-expanded={expanded}
        aria-controls="main-navigation"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <X /> : <Menu />}
      </button>
    </header>
  );
}
