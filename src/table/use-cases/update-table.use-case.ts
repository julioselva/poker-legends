import { Injectable } from '@nestjs/common';
import { asapScheduler, from, map, Observable, of, scheduled, toArray } from 'rxjs';

import { Card } from '../../cards/cards.type';
import { DiscardCardsCommand, DiscardCardsUseCase } from '../../cards/use-cases/discard-cards.use-case.';
import { Hand, HandRanking } from '../../game/game.type';
import { EvaluateHandCommand, EvaluateHandUseCase } from '../../game/use-cases/evaluate-hand.use-case';
import {
  EvaluateHandRankingCommand,
  EvaluateHandRankingsUseCase,
} from '../../game/use-cases/evaluate-hand-rankings.use-case';
import { BetterMap } from '../../lib/ts/BetterMap';
import { TableAction, TableActionKind, TableActionResult } from '../table.type';

// ---- Command ----
export class UpdateTableCommand<T extends TableActionKind> {
  constructor(
    public readonly hands: Hand[],
    public readonly deck: Card[],
    public readonly action: TableAction<T>,
  ) {}
}

// ---- Result ----
export class UpdateTableResult<T extends TableActionKind> {
  hands: Hand[];
  remainingCards: Card[];
  action: TableActionResult<T>;
}

@Injectable()
export class UpdateTableUseCase {
  constructor(
    public readonly discardCards: DiscardCardsUseCase,
    public readonly evaluateHandUseCase: EvaluateHandUseCase,
    public readonly evaluateHandRankingsUseCase: EvaluateHandRankingsUseCase,
  ) {}

  exec(cmd: UpdateTableCommand<TableActionKind>): Observable<UpdateTableResult<TableActionKind>> {
    const { action } = cmd;

    switch (action.kind) {
      case TableActionKind.DiscardCards:
        return this.doDiscardCards(cmd as UpdateTableCommand<TableActionKind.DiscardCards>);
      case TableActionKind.Showdown:
        return this.doShowdown(cmd as UpdateTableCommand<TableActionKind.Showdown>);
    }
  }

  private doDiscardCards<T extends TableActionKind.DiscardCards>(
    cmd: UpdateTableCommand<T>,
  ): Observable<UpdateTableResult<TableActionKind.DiscardCards>> {
    const { deck, hands, action } = cmd;
    const { data } = action;

    const { drawnCards, remainingCards } = this.discardCards.exec(new DiscardCardsCommand(deck, data.discardedCards));

    return of({
      hands,
      remainingCards,
      action: { kind: TableActionKind.DiscardCards, result: { drawnCards } },
    });
  }

  private doShowdown<T extends TableActionKind.Showdown>(
    cmd: UpdateTableCommand<T>,
  ): Observable<UpdateTableResult<TableActionKind.Showdown>> {
    const { hands, deck } = cmd;

    return scheduled(from(hands), asapScheduler).pipe(
      map((hand) => this.evaluateHandUseCase.exec(new EvaluateHandCommand(hand))),
      toArray(),
      map((result) => new BetterMap<Hand, HandRanking>(...result)),
      map((mapped) => this.evaluateHandRankingsUseCase.exec(new EvaluateHandRankingCommand(mapped))),
      map(([hand, handRanking]) => ({
        hands,
        remainingCards: deck,
        action: {
          kind: TableActionKind.Showdown,
          result: {
            winnerHand: hand,
            handRanking,
          },
        },
      })),
    );
  }
}
