import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, AudioLines, Menu, X } from "lucide-react";

const links = [
  { href: "#about", text: "The idea" },
  { href: "#experience", text: "The experience" },
  { href: "#questions", text: "Good to know" },
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
      <a href="#main" className="brand" title="HyperChat home">
        <AudioLines size={27} strokeWidth={2.3} /> hyperchat<span>V2</span>
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
            onClick={() => setExpanded(false)}
          >
            {link.text}
          </a>
        ))}
      </nav>
      <a
        className="header-cta"
        href="#live-room"
        onClick={() => setExpanded(false)}
      >
        Enter a room <ArrowUpRight size={15} />
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
