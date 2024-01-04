import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Card } from '../../cards/cards.type';
import { Hand } from '../../game/game.type';
import { TableAction, TableActionKind, TableActionResult } from '../table.type';
import { DoDiscardCardsStrategy } from './strategies/do-discard-cards.strategy';
import { DoShowdownStrategy } from './strategies/do-showdown.strategy';

// ---- Command ----
export class UpdateTableCommand<T extends TableActionKind> {
  constructor(
    public readonly action: TableAction<T>,
    public readonly hands: Hand[],
    public readonly deck?: Card[],
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
