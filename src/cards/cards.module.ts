import { Module } from '@nestjs/common';

import { DiscardCardsUseCase } from './use-cases/discard-cards.use-case.';
import { DrawCardsUseCase } from './use-cases/draw-cards.use-case.';
import { GenerateDeckUseCase } from './use-cases/generate-deck.use-case.';

@Module({
  imports: [],
  exports: [GenerateDeckUseCase, DrawCardsUseCase, DiscardCardsUseCase],
  controllers: [],
  providers: [GenerateDeckUseCase, DrawCardsUseCase, DiscardCardsUseCase],
})
export class CardsModule {}
