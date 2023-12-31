// ---- Card Rank ----
export const CardRanks = [
  { kind: 'Two', value: 0 },
  { kind: 'Three', value: 1 },
  { kind: 'Four', value: 2 },
  { kind: 'Five', value: 3 },
  { kind: 'Six', value: 4 },
  { kind: 'Seven', value: 5 },
  { kind: 'Eight', value: 6 },
  { kind: 'Nine', value: 7 },
  { kind: 'Ten', value: 8 },
  { kind: 'Jack', value: 9 },
  { kind: 'Queen', value: 10 },
  { kind: 'King', value: 11 },
  { kind: 'Ace', value: 12 },
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
