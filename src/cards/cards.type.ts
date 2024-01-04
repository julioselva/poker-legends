// ---- Card Rank ----
export const CardRanks = [
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Jack',
  'Queen',
  'King',
  'Ace',
] as const;

export type CardRank = (typeof CardRanks)[number];

// ---- Card Suit ----
export const CardSuits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'] as const;

export type CardSuit = (typeof CardSuits)[number];

// ---- Card ----
export type Card = {
  suit: CardSuit;
  rank: CardRank;
};
