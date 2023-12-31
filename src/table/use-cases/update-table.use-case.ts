import { Injectable } from '@nestjs/common';
import { asapScheduler, from, map, Observable, of, scheduled, tap, toArray } from 'rxjs';

import { Card } from '../../cards/cards.type';
import { DiscardCardsCommand, DiscardCardsUseCase } from '../../cards/use-cases/discard-cards.use-case.';
import { Hand } from '../../game/game.type';
import { EvaluateHandCommand, EvaluateHandUseCase } from '../../game/use-cases/evaluate-hand.use-case';
import { TableAction, TableActionDataDiscardCards, TableActionKind, TableActionResult } from '../table.type';

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
  constructor(
    public readonly discardCards: DiscardCardsUseCase,
    public readonly evaluateHandUseCase: EvaluateHandUseCase,
  ) {}

  exec(cmd: UpdateTableCommand): Observable<UpdateTableResult> {
    const { action } = cmd;

    switch (action.kind) {
      case TableActionKind.DiscardCards:
        return this.doDiscardCards(cmd, action.data as TableActionDataDiscardCards);
      case TableActionKind.Showdown:
        return this.doShowdown(cmd);
    }
  }

  private doDiscardCards(cmd: UpdateTableCommand, data: TableActionDataDiscardCards): Observable<UpdateTableResult> {
    const { deck, hands } = cmd;

    const { drawnCards, remainingCards } = this.discardCards.exec(new DiscardCardsCommand(deck, data.discardedCards));

    return of({
      hands,
      remainingCards,
      result: { drawnCards },
    });
  }

  private doShowdown(cmd: UpdateTableCommand): Observable<UpdateTableResult> {
    const { hands, deck } = cmd;

    return scheduled(from(hands), asapScheduler).pipe(
      map((hand) => this.evaluateHandUseCase.exec(new EvaluateHandCommand(hand))),
      toArray(),
      tap((result) => console.log(result)),
      map(() => ({
        hands,
        remainingCards: deck,
        result: {
          winnerHand: hands[0],
          handRank: {
            kind: 'FourOfAKind',
            fourRank: { kind: 'Ace', value: 12 },
            kicker: { kind: 'King', value: 11 },
          },
        },
      })),
    );
  }
}
