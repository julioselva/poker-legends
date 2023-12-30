import { Card, CardRank, CardSuit } from '../cards/cards.type';

export type Hand = Card[];

export type HighCard = { kind: 'HighCard'; cards: Hand };

export type OnePair = { kind: 'OnePair'; pairRank: CardRank; kickers: Hand };

export type TwoPair = {
  kind: 'TwoPair';
  highPairRank: CardRank;
  lowPairRank: CardRank;
  kicker: Hand;
};

export type ThreeOfAKind = {
  kind: 'ThreeOfAKind';
  threeRank: CardRank;
  kickers: Hand;
};

export type Straight = { kind: 'Straight'; highestRank: CardRank };

export type Flush = { kind: 'Flush'; suit: CardSuit; cards: Hand };

export type FullHouse = {
  kind: 'FullHouse';
  threeRank: CardRank;
  pairRank: CardRank;
};

export type FourOfAKind = {
  kind: 'FourOfAKind';
  fourRank: CardRank;
  kicker: CardRank;
};

export type StraightFlush = {
  kind: 'StraightFlush';
  highestRank: CardRank;
  suit: CardSuit;
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
