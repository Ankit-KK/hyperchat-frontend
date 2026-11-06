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
    id: "logo-header-transition", date: "2026-11-07", type: "Improved",
    title: "From first impression to the first moment.",
    description: "The HC reveal now moves from the centre toward the navigation as the homepage appears. Desktop and phones share the glass reveal. Only the transparent logo travels toward the header, with a slower 1.2-second handoff; reduced-motion preferences bypass the intro.",
    href: "/", linkLabel: "See the new entrance",
  },
  {
    id: "readable-first-load", date: "2026-11-06", type: "Improved",
    title: "Useful from the first load.",
    description: "Key pages now include readable summaries and navigation before the interactive experience loads, helping visitors and search engines understand the site. We also reduced the ClipWave logo’s download size by about 92% without changing its design.",
    href: "/features", linkLabel: "Explore HyperChat",
  },
  {
    id: "equal-ambassador-presence", date: "2026-11-05", type: "Fixed",
    title: "Three ambassadors. Equal presence.",
    description: "captain_vaani, Chiaa and Latifa lead the creator directory with equal-size cards. Shared links now highlight a creator’s existing card instead of placing one person in a separate spotlight.",
    href: "/creators#creator-showcase", linkLabel: "Meet the creators",
  },
  {
    id: "share-creator-links", date: "2026-11-05", type: "Added",
    title: "A creator worth sharing.",
    description: "Copy a direct link to any creator in the directory. Opening it selects and reveals their card, even beyond the first page of results. Copy confirmation and a manual-copy fallback make sharing easier.",
    href: "/creators#creator-showcase", linkLabel: "Find a creator to share",
  },
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
