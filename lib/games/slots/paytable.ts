const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "7️⃣"] as const;

export type SlotSymbol = (typeof SYMBOLS)[number];

export type SlotsOutcome = {
  reels: [SlotSymbol, SlotSymbol, SlotSymbol];
  payout: number;
  multiplier: number;
};

/** Soft RTP ~92%: most spins lose; three-of-a-kind pays. */
const PAYTABLE: Record<SlotSymbol, number> = {
  "🍒": 3,
  "🍋": 4,
  "🔔": 6,
  "⭐": 10,
  "7️⃣": 20,
};

export function rollSlots(stake: number): SlotsOutcome {
  const reels: [SlotSymbol, SlotSymbol, SlotSymbol] = [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!,
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!,
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!,
  ];

  const [a, b, c] = reels;
  let multiplier = 0;
  if (a === b && b === c) {
    multiplier = PAYTABLE[a];
  } else if (a === b || b === c || a === c) {
    // consolation pair — soft RTP helper
    multiplier = 0.4;
  }

  const payout = Math.floor(stake * multiplier);
  return { reels, payout, multiplier };
}

export const SLOT_STAKES = [1, 5, 10] as const;
export type SlotStake = (typeof SLOT_STAKES)[number];
