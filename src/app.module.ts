import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { LoggerModule } from './lib/logger/logger.module';
import { LoggerOptions } from './lib/logger/logger.options';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PinoLoggerModule.forRootAsync({
      providers: undefined,
      imports: [LoggerModule],
      inject: [LoggerOptions],
      useFactory: (loggerOptions: LoggerOptions) => loggerOptions.make(),
    }),
  ],
  exports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
