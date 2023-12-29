import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import configuration from './config/configuration';
import { LoggerModule } from './lib/logger/logger.module';
import { LoggerOptions } from './lib/logger/logger.options';
import { HealthModule } from './health/health.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PinoLoggerModule.forRootAsync({
      providers: undefined,
      imports: [LoggerModule],
      inject: [LoggerOptions],
      useFactory: (loggerOptions: LoggerOptions) => loggerOptions.make(),
    }),
    HealthModule,
    CardsModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
