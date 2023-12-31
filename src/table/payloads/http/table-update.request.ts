import { Allow } from 'class-validator';

import { Card } from '../../../cards/cards.type';
import { Hand } from '../../../game/game.type';
import { TableAction, TableActionKind } from '../../table.type';
import { UpdateTableCommand } from '../../use-cases/update-table.use-case';

export class TableUpdateRequest {
  @Allow()
  hands: Hand[];
  @Allow()
  deck: Card[];
  @Allow()
  action: TableAction<TableActionKind>;

  toCommand(): UpdateTableCommand<TableActionKind> {
    return new UpdateTableCommand(this.hands, this.deck, this.action);
  }
}
