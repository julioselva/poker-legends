import { Card } from '../cards/cards.type';
import { Hand, HandRanking } from '../game/game.type';

// ---- Action Data Discard Cards ----
export type TableActionDataDiscardCards = {
  discardedCards: Card[];
};

export type TableActionDataDiscardCardsResult = {
  drawnCards: Card[];
};

// ---- Action Showdown ----
export type TableActionShowdownResult = {
  winnerHand: Hand;
  handRanking: HandRanking;
};

// ---- Action Command ----
export enum TableActionKind {
  DiscardCards = 'DISCARD_CARTS',
  Showdown = 'SHOWDOWN',
}

export type TableActionData = TableActionDataDiscardCards;

export type TableAction = {
  kind: TableActionKind;
  data: TableActionData;
};

// ---- Action Result ----
export type TableActionResult = TableActionDataDiscardCardsResult | TableActionShowdownResult;
