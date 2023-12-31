import { Module } from '@nestjs/common';

import { EvaluateHandUseCase } from './use-cases/evaluate-hand.use-case';
import { EvaluateHandRankingsUseCase } from './use-cases/evaluate-hand-rankings.use-case';

@Module({
  imports: [],
  exports: [EvaluateHandUseCase, EvaluateHandRankingsUseCase],
  controllers: [],
  providers: [EvaluateHandUseCase, EvaluateHandRankingsUseCase],
})
export class GameModule {}
