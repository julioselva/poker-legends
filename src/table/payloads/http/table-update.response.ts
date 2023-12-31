import { Expose } from 'class-transformer';

import { Card } from '../../../cards/cards.type';
import { Hand } from '../../../game/game.type';
import { TableActionKind, TableActionResult } from '../../table.type';
import { UpdateTableResult } from '../../use-cases/update-table.use-case';

export class TableUpdateResponse {
  @Expose()
  hands: Hand[];
  @Expose()
  remainingCards: Card[];
  @Expose()
  result: TableActionResult<TableActionKind>;

  constructor(partial: Partial<UpdateTableResult<TableActionKind>>) {
    Object.assign(this, partial);
  }
}
