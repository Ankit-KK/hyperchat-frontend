export interface ShowcaseCreator {
  id: string;
  name: string;
  initials: string;
  category: string;
  moment: string;
}

const formats = [
  { category: "Gaming", moment: "A sound cue for the clutch finish." },
  { category: "Music", moment: "A recorded message after the final song." },
  { category: "Art & design", moment: "A viewer’s reaction to the finished piece." },
  { category: "Just chatting", moment: "A typed thought, read aloud to the room." },
  { category: "Learning", moment: "An audience question that starts a discussion." },
];

/** Fictional placeholders. Replace this list when approved creator profiles exist. */
export const showcaseCreators: ShowcaseCreator[] = Array.from({ length: 20 }, (_, i) => ({
  id: `creator-${i + 1}`,
  name: `Creator ${String(i + 1).padStart(2, "0")}`,
  initials: String(i + 1).padStart(2, "0"),
  ...formats[i % formats.length],
}));
