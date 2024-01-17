import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { CardsModule } from './cards/cards.module';
import configuration from './config/configuration';
import { GameModule } from './game/game.module';
import { HandModule } from './hand/hand.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './lib/logger/logger.module';
import { LoggerOptions } from './lib/logger/logger.options';
import { TableModule } from './table/table.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PinoLoggerModule.forRootAsync({
      imports: [LoggerModule],
      inject: [LoggerOptions],
      useFactory: (loggerOptions: LoggerOptions) => loggerOptions.make(),
    }),
    HealthModule,
    CardsModule,
    GameModule,
    HandModule,
    TableModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
