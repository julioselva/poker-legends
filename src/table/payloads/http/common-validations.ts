import { IsIn } from 'class-validator';

import { CardRank, CardRanks, CardSuit, CardSuits } from '../../../cards/cards.type';

// ---- Card ----
export class TableUpdateRequestCard {
  @IsIn(CardSuits)
  suit: CardSuit;

  @IsIn(CardRanks)
  rank: CardRank;
}
