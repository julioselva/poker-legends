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
import { DoDiscardCardsStrategy } from './strategies/do-discard-cards.strategy';
import { DoShowdownStrategy } from './strategies/do-showdown.strategy';

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
    private readonly doDiscardCardsStrategy: DoDiscardCardsStrategy,
    private readonly doShowdownStrategy: DoShowdownStrategy,
  ) {}

  exec(cmd: UpdateTableCommand<TableActionKind>): Observable<UpdateTableResult<TableActionKind>> {
    const { action } = cmd;

    switch (action.kind) {
      case TableActionKind.DiscardCards:
        return this.doDiscardCardsStrategy.exec(cmd as UpdateTableCommand<TableActionKind.DiscardCards>);
      case TableActionKind.Showdown:
        return this.doShowdownStrategy.exec(cmd as UpdateTableCommand<TableActionKind.Showdown>);
    }
  }
}
