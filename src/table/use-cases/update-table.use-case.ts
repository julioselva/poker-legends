import { Injectable } from '@nestjs/common';

import { Card } from '../../cards/cards.type';
import {
  DiscardCardsCommand,
  DiscardCardsUseCase,
} from '../../cards/use-cases/discard-cards.use-case.';
import { Hand } from '../../game/game.type';
import {
  TableAction,
  TableActionDataDiscardCards,
  TableActionKind,
  TableActionResult,
} from '../table.type';

// ---- Command ----
export class UpdateTableCommand {
  constructor(
    public readonly hands: Hand[],
    public readonly deck: Card[],
    public readonly action: TableAction,
  ) {}
}

// ---- Result ----
export class UpdateTableResult {
  hands: Hand[];
  remainingCards: Card[];
  result: TableActionResult;
}

@Injectable()
export class UpdateTableUseCase {
  constructor(public readonly discardCards: DiscardCardsUseCase) {}

  exec(cmd: UpdateTableCommand): UpdateTableResult {
    console.log(cmd);

    const { action } = cmd;

    switch (action.kind) {
      case TableActionKind.DiscardCards:
        return this.doDiscardCards(
          cmd,
          action.data as TableActionDataDiscardCards,
        );
    }
  }

  private doDiscardCards(
    cmd: UpdateTableCommand,
    data: TableActionDataDiscardCards,
  ): UpdateTableResult {
    const { deck, hands } = cmd;

    const { drawnCards, remainingCards } = this.discardCards.exec(
      new DiscardCardsCommand(deck, data.discardedCards),
    );

    return {
      hands,
      remainingCards,
      result: { drawnCards },
    };
  }
}
