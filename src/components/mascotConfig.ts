/** Original supplied clips, selected after reviewing their motion and alpha. */
export const mascotVideos = {
  idle: "/mascot/mascot-1.webm",
  curious: "/mascot/mascot-5.webm",
  excited: "/mascot/mascot-6.webm",
  lookingUp: "/mascot/mascot-3.webm",
} as const;

export type MascotState = keyof typeof mascotVideos;

export const mascotConfig = {
  media: "(hover: hover) and (pointer: fine) and (min-width: 901px) and (min-height: 320px) and (prefers-reduced-motion: no-preference)",
  // The original 16:9 clips contain wide transparent margins. This viewport
  // shows a roughly 120–140px character without changing the video itself.
  width: 156,
  height: 168,
  videoWidth: 296,
  bubbleWidth: 224,
  introductionDelay: 1100,
  messageDuration: 5200,
  messageCooldown: 20000,
  hoverDwell: 350,
  stateDwell: 240,
  movementIdle: 750,
  excitementDuration: 2400,
  sessionKey: "hyperchat:mascot-introduction:v1",
} as const;

export const mascotMessages = {
  introduction: "Hey! I'm your little HyperChat companion.",
  movement: ["Psst... see something interesting?", "Go on, take a look."],
  hover: ["Ooh, what's this?", "Curious? Me too."],
} as const;
