import { Module } from '@nestjs/common';

import { DrawCards } from './use-cases/draw-cards.use-case.';
import { GenerateDeck } from './use-cases/generate-deck.use-case.';

@Module({
  imports: [],
  exports: [],
  controllers: [],
  providers: [GenerateDeck, DrawCards],
})
export class CardsModule {}
