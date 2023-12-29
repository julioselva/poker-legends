export type CardSuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';

export type CardRank =
  | 'Ace'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'Jack'
  | 'Queen'
  | 'King';

export type Card = {
  suit: CardSuit;
  rank: CardRank;
};
