export interface ShowcaseCreator {
  id: string;
  name: string;
  initials: string;
  category: string;
}

const categories = ["Gaming", "Music", "Art & design", "Just chatting", "Learning"];

/** Fictional placeholders. Replace this list when approved creator profiles exist. */
export const showcaseCreators: ShowcaseCreator[] = Array.from({ length: 20 }, (_, i) => ({
  id: `creator-${i + 1}`,
  name: `Creator ${String(i + 1).padStart(2, "0")}`,
  initials: String(i + 1).padStart(2, "0"),
  category: categories[i % categories.length],
}));
