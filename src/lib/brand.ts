import wordmark from "../assets/brand/hyperchat-intro.svg?raw";

// Shared geometry; lighter filled tones for charcoal surfaces, without an outline.
export const headerWordmark = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  wordmark.replace(/#221F1C|#8C847B/g, color => color === "#221F1C" ? "#8C847B" : "#D7CBB9"),
)}`;
