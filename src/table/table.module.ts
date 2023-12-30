import { Module } from '@nestjs/common';

import { CardsModule } from '../cards/cards.module';
import { TableController } from './table.controller';
import { CreateTableUseCase } from './use-cases/create-table.use-case';

@Module({
  imports: [CardsModule],
  exports: [],
  controllers: [TableController],
  providers: [CreateTableUseCase],
})
export class TableModule {}
