import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const links = [
  { href: "/features", text: "Features" },
  { href: "/creators", text: "For creators" },
  { href: "/company", text: "Company & support" },
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
        hyperchat<span>V2</span>
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
        Creator access <ArrowUpRight size={15} />
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
