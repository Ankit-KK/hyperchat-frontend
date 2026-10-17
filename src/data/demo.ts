/** Fictional, browser-local examples. Never pass these records to a real API. */
export const demoInteractions = [
  {
    id: "demo-ari",
    name: "Ari",
    amount: 250,
    kind: "Message",
    status: "Shown on stream",
    message: "This made my evening. Keep creating!",
    time: "20:42",
  },
  {
    id: "demo-noor",
    name: "Noor",
    amount: 500,
    kind: "Voice",
    status: "Played on stream",
    message: "Thanks for making this space for us.",
    time: "20:38",
  },
  {
    id: "demo-sam",
    name: "Sam",
    amount: 100,
    kind: "Sound",
    status: "Played on stream",
    message: "A little applause for that moment.",
    time: "20:31",
  },
] as const;
export const formatAmount = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;
