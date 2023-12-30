import { Card } from '../cards/cards.type';
import { Hand } from '../game/game.type';

// ---- Action Data Discard Cards ----
export type TableActionDataDiscardCards = {
  discardedCards: Card[];
};

export type TableActionDataDiscardCardsResult = {
  drawnCards: Card[];
};

// ---- Action Data Fold ----
export type TableActionDataFold = {
  currentHand: Hand;
};

export type TableActionDataFoldResult = undefined;

// ---- Action Command ----
export enum TableActionKind {
  DiscardCards,
  Fold,
}

export type TableActionData = TableActionDataDiscardCards | TableActionDataFold;

export type TableAction = {
  kind: TableActionKind;
  data: TableActionData;
};

// ---- Action Result ----
export type TableActionResult =
  | TableActionDataDiscardCardsResult
  | TableActionDataFoldResult;
