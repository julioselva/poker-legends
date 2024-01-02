import { Module } from '@nestjs/common';

import { CardsModule } from '../cards/cards.module';
import { GameModule } from '../game/game.module';
import { TableController } from './table.controller';
import { CreateTableUseCase } from './use-cases/create-table.use-case';
import { DoDiscardCardsStrategy } from './use-cases/strategies/do-discard-cards.strategy';
import { DoShowdownStrategy } from './use-cases/strategies/do-showdown.strategy';
import { UpdateTableUseCase } from './use-cases/update-table.use-case';

@Module({
  imports: [CardsModule, GameModule],
  exports: [],
  controllers: [TableController],
  providers: [CreateTableUseCase, UpdateTableUseCase, DoDiscardCardsStrategy, DoShowdownStrategy],
})
export class TableModule {}
