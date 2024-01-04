import { Card, CardRank, CardSuit } from '../cards/cards.type';

export type Hand = Card[];

// ---- Hand Ranking ----
export type HighCard = {
  kind: 'HighCard';
  card: Card;
  value: 0;
};

export type OnePair = {
  kind: 'OnePair';
  pairRank: CardRank;
  kickers: Hand;
  value: 1;
};

export type TwoPair = {
  kind: 'TwoPair';
  highPairRank: CardRank;
  lowPairRank: CardRank;
  kicker: Card;
  value: 2;
};

export type ThreeOfAKind = {
  kind: 'ThreeOfAKind';
  threeRank: CardRank;
  kickers: Hand;
  value: 3;
};

export type Straight = {
  kind: 'Straight';
  highestRank: CardRank;
  value: 4;
};

export type Flush = {
  kind: 'Flush';
  suit: CardSuit;
  cards: Hand;
  value: 5;
};

export type FullHouse = {
  kind: 'FullHouse';
  threeRank: CardRank;
  pairRank: CardRank;
  value: 6;
};

export type FourOfAKind = {
  kind: 'FourOfAKind';
  fourRank: CardRank;
  kicker: CardRank;
  value: 7;
};

export type StraightFlush = {
  kind: 'StraightFlush';
  highestRank: CardRank;
  suit: CardSuit;
  value: 8;
};

export type HandRanking =
  | HighCard
  | OnePair
  | TwoPair
  | ThreeOfAKind
  | Straight
  | Flush
  | FullHouse
  | FourOfAKind
  | StraightFlush;

// ---- Ranking Values -----
export enum CardRankingPower {
  Two = 0,
  Three = 1,
  Four = 2,
  Five = 3,
  Six = 4,
  Seven = 5,
  Eight = 6,
  Nine = 7,
  Ten = 8,
  Jack = 9,
  Queen = 10,
  King = 11,
  Ace = 12,
}
