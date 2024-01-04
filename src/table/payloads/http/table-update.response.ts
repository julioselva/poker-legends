import { Expose } from 'class-transformer';

import { Card } from '../../../cards/cards.type';
import { Hand } from '../../../game/game.type';
import { TableActionKind, TableActionResult } from '../../table.type';
import { UpdateTableResult } from '../../use-cases/update-table.use-case';

// ---- Response ----
export interface TableUpdateResponse {
  action: { kind: TableActionKind };
}

// ---- Discard Cards ----
export class TableUpdateResponseDiscardCards implements TableUpdateResponse {
  @Expose()
  hands: Hand[];

  @Expose()
  remainingCards: Card[];

  @Expose()
  action: TableActionResult<TableActionKind.DiscardCards>;

  constructor(partial: Partial<UpdateTableResult<TableActionKind.DiscardCards>>) {
    Object.assign(this, partial);
  }
}

// ---- Showdown ----
export class TableUpdateResponseShowdown implements TableUpdateResponse {
  @Expose()
  action: TableActionResult<TableActionKind.Showdown>;

  constructor(partial: Partial<UpdateTableResult<TableActionKind.Showdown>>) {
    Object.assign(this, partial);
  }
}
