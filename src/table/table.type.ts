import { Card } from '../cards/cards.type';
import { Hand, HandRanking } from '../game/game.type';

// ---- Action Discard Cards ----
export type TableActionDataDiscardCards = {
  discardedCards: Card[];
};

export type TableActionDiscardCards<T extends TableActionKind.DiscardCards> = {
  kind: T;
  data: TableActionDataDiscardCards;
};

export type TableActionDataDiscardCardsResult = {
  drawnCards: Card[];
};

export type TableActionDiscardCardsResult<T extends TableActionKind.DiscardCards> = {
  kind: T;
  result: TableActionDataDiscardCardsResult;
};

// ---- Action Showdown ----
export type TableActionShowdown<T extends TableActionKind.Showdown> = {
  kind: T;
};

export type TableActionDataShowdownResult = {
  winnerHand: Hand;
  handRanking: HandRanking;
};

export type TableActionShowdownResult<T extends TableActionKind.Showdown> = {
  kind: T;
  result: TableActionDataShowdownResult;
};

// ---- Action Command ----
export enum TableActionKind {
  DiscardCards = 'DISCARD_CARTS',
  Showdown = 'SHOWDOWN',
}

export type TableAction<T extends TableActionKind> = T extends TableActionKind.Showdown
  ? TableActionShowdown<T>
  : T extends TableActionKind.DiscardCards
    ? TableActionDiscardCards<T>
    : never;

export type TableActionResult<T extends TableActionKind> = T extends TableActionKind.Showdown
  ? TableActionShowdownResult<T>
  : T extends TableActionKind.DiscardCards
    ? TableActionDiscardCardsResult<T>
    : never;
