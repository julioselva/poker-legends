import { Expose } from 'class-transformer';

import { Card } from '../../../cards/cards.type';
import { Hand } from '../../../game/game.type';
import { TableActionResult } from '../../table.type';
import { UpdateTableResult } from '../../use-cases/update-table.use-case';

export class TableUpdateResponse {
  @Expose()
  hands: Hand[];
  @Expose()
  remainingCards: Card[];
  @Expose()
  result: TableActionResult;

  constructor(partial: Partial<UpdateTableResult>) {
    Object.assign(this, partial);
  }
}
