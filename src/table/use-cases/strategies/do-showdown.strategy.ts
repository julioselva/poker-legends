import { Injectable } from '@nestjs/common';
import { asapScheduler, from, map, Observable, scheduled, toArray } from 'rxjs';

import { Hand, HandRanking } from '../../../game/game.type';
import { EvaluateHandCommand, EvaluateHandUseCase } from '../../../game/use-cases/evaluate-hand.use-case';
import {
  EvaluateHandRankingCommand,
  EvaluateHandRankingsUseCase,
} from '../../../game/use-cases/evaluate-hand-rankings.use-case';
import { BetterMap } from '../../../lib/ts/BetterMap';
import { TableActionKind } from '../../table.type';
import { UpdateTableCommand, UpdateTableResult } from '../update-table.use-case';

@Injectable()
export class DoShowdownStrategy {
  constructor(
    public readonly evaluateHandUseCase: EvaluateHandUseCase,
    public readonly evaluateHandRankingsUseCase: EvaluateHandRankingsUseCase,
  ) {}

  exec(cmd: UpdateTableCommand<TableActionKind.Showdown>): Observable<UpdateTableResult<TableActionKind.Showdown>> {
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
