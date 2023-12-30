import { Module } from '@nestjs/common';

import { EvaluateHandUseCase } from './use-cases/evaluate-hand.use-case';

@Module({
  imports: [],
  exports: [EvaluateHandUseCase],
  controllers: [],
  providers: [EvaluateHandUseCase],
})
export class GameModule {}
