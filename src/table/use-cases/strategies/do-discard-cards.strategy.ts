import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { DiscardCardsCommand, DiscardCardsUseCase } from '../../../cards/use-cases/discard-cards.use-case.';
import { TableActionKind } from '../../table.type';
import { UpdateTableCommand, UpdateTableResult } from '../update-table.use-case';

@Injectable()
export class DoDiscardCardsStrategy {
  constructor(public readonly discardCards: DiscardCardsUseCase) {}
  exec(
    cmd: UpdateTableCommand<TableActionKind.DiscardCards>,
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
}
