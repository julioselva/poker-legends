import { Expose } from 'class-transformer';

import { Card } from '../../../cards/cards.type';
import { Hand } from '../../../game/game.type';
import { CreateTableResult } from '../../use-cases/create-table.use-case';

export class TableCreateResponse {
  @Expose()
  hands: Hand[];
  @Expose()
  remainingCards: Card[];

  constructor(partial: Partial<CreateTableResult>) {
    Object.assign(this, partial);
  }
}
