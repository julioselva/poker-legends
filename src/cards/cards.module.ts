import { Module } from '@nestjs/common';

import { DiscardCardsUseCase } from './use-cases/discard-cards.use-case.';
import { DrawCardsUseCase } from './use-cases/draw-cards.use-case.';
import { GenerateDeck } from './use-cases/generate-deck.use-case.';

@Module({
  imports: [],
  exports: [GenerateDeck, DrawCardsUseCase],
  controllers: [],
  providers: [GenerateDeck, DrawCardsUseCase, DiscardCardsUseCase],
})
export class CardsModule {}
