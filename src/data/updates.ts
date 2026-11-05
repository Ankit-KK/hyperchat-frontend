export type ChangeType = "Added" | "Improved" | "Fixed";
export interface WebsiteUpdate {
  id: string;
  date: string;
  type: ChangeType;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

// Website changes only. Dates follow the implementation history, not backend releases.
// Add new entries at the top; filters and counts update automatically.
export const websiteUpdates: WebsiteUpdate[] = [
  {
    id: "audio-preview", date: "2026-11-04", type: "Fixed",
    title: "Audio that knows when to pause.",
    description: "Voice and sound previews now stop when you leave the page or switch tabs. If playback cannot start, clearer feedback helps you try again.",
    href: "/features", linkLabel: "Try the audio previews",
  },
  {
    id: "glass-entrance", date: "2026-11-04", type: "Added",
    title: "A little anticipation. A softer arrival.",
    description: "The homepage opens with a glass HC reveal on desktop and a lighter version on phones, then fades into the page. Skip it anytime; reduced-motion preferences bypass it automatically.",
    href: "/", linkLabel: "See the homepage",
  },
  {
    id: "companion-control", date: "2026-11-04", type: "Improved",
    title: "Your companion. Your choice.",
    description: "Show or hide the desktop mascot from the footer. Your choice is remembered in this browser for your next visit.",
    href: "#footer", linkLabel: "Find companion controls",
  },
  {
    id: "mobile-reading", date: "2026-11-03", type: "Improved",
    title: "More room for the small screen.",
    description: "Larger mobile text, a compact four-step OBS preview and collapsible contents on policy pages make the website easier to explore on your phone.",
    href: "/features", linkLabel: "Explore the features",
  },
  {
    id: "soraivy", date: "2026-11-02", type: "Added",
    title: "Meet Soraivy.",
    description: "Our partners now include Soraivy, a creator-first video platform built in India, designed to help small and emerging creators grow faster and earn more.",
    href: "/company", linkLabel: "Meet our partners",
  },
];
