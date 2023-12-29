import { Module } from '@nestjs/common';

import { LoggerOptions } from './logger.options';

@Module({
  imports: [],
  exports: [LoggerOptions],
  controllers: [],
  providers: [LoggerOptions],
})
export class LoggerModule {}
