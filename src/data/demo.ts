/** Fictional, browser-local examples. Never pass these records to a real API. */
export const demoDonations = [
  {
    id: "demo-ari",
    name: "Ari",
    amount: 250,
    kind: "Message",
    message: "This made my evening. Keep creating!",
    time: "20:42",
  },
  {
    id: "demo-noor",
    name: "Noor",
    amount: 500,
    kind: "Voice",
    message: "Thanks for making this space for us.",
    time: "20:38",
  },
  {
    id: "demo-sam",
    name: "Sam",
    amount: 100,
    kind: "Soundboard",
    message: "A little applause for that moment.",
    time: "20:31",
  },
] as const;
export const formatAmount = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;
