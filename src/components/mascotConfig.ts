/** Original supplied clips, selected after reviewing their motion and alpha. */
export const mascotVideos = {
  idle: "/mascot/mascot-1.webm",
  curious: "/mascot/mascot-5.webm",
  excited: "/mascot/mascot-6.webm",
  moving: "/mascot/mascot-2.webm",
  celebrating: "/mascot/mascot-7.webm",
  tilting: "/mascot/mascot-8.webm",
  leaning: "/mascot/mascot-9.webm",
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
  stateDwell: 160,
  followTime: 28,
  movementIdle: 750,
  excitementDuration: 2400,
  sessionKey: "hyperchat:mascot-introduction:v1",
} as const;

export const mascotMessages = {
  introduction: [
    "Hey! I'm your little HyperChat companion.",
    "Oh, hey! Welcome to HyperChat.",
    "Psst... you're gonna like it here.",
  ],

  movement: [
    "Psst... see something interesting?",
    "Go on, take a look.",
    "Small interactions. Big smiles.",
    "Your next shared moment starts here.",
    "Ooh, shiny... what's that?",
    "Don't mind me. Just vibing.",
  ],

  hover: [
    "Ooh, what's this?",
    "Curious? Me too.",
    "This one caught your eye!",
    "Go ahead. Explore a little.",
    "Psst... check this out.",
    "Wait, this looks interesting.",
  ],

  features: [
    "Your stream. Your rules.",
    "Let's make your stream a little louder.",
    "Your viewers have things to say.",
    "Make every donation count.",
    "Your chat is about to get interesting.",
    "Make your viewers part of the show.",
  ],

  donationAlerts: [
    "Every donation deserves its moment.",
    "UPI donations, but make them visible.",
    "Let's put those donations on screen.",
  ],

  voiceMessages: [
    "Text trolling is so last season.",
    "Your viewers have a voice. Literally.",
    "Oh no... they can send their voice now.",
  ],

  textToSpeech: [
    "What if your donations talked back?",
    "Let the messages speak for themselves.",
    "Careful what you let chat say.",
  ],

  hypersounds: [
    "Jumpscare incoming. Probably.",
    "A little sound. A lot of chaos.",
    "Let's make some noise.",
  ],

  hyperEmotes: [
    "Words are overrated sometimes.",
    "One emote. A thousand reactions.",
    "Tiny emotes. Huge energy.",
  ],

  leaderboards: [
    "Who's carrying this stream?",
    "Every supporter deserves a little spotlight.",
    "Let's see who's at the top.",
  ],

  pricing: [
    "Take a peek at the plans.",
    "Find the plan that fits your stream.",
    "Your next upgrade might be right here.",
  ],

  callsToAction: [
    "Ready to give your stream an upgrade?",
    "Let's get your page set up.",
    "Come on, let's make something cool.",
  ],
} as const;
