export type GameMeta = {
  id: string;
  title: string;
  description: string;
  href: string;
  minBet: number;
  enabled: boolean;
};

export const gameRegistry: GameMeta[] = [
  {
    id: "slots",
    title: "Slots",
    description: "Classic 3-reel slots. Bet gold, chase a payout.",
    href: "/games/slots",
    minBet: 1,
    enabled: true,
  },
];
