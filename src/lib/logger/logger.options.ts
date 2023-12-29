import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Params as PinoParams } from 'nestjs-pino';

interface LoggerConfig {
  level: string;
  pretty: boolean;
}

@Injectable()
export class LoggerOptions {
  constructor(private readonly configService: ConfigService) {}

  make(): PinoParams {
    const loggerConfig = this.configService.get<LoggerConfig>('logger');
    const { level, pretty } = loggerConfig;

    return {
      pinoHttp: {
        level,
        transport: pretty ? { target: 'pino-pretty' } : undefined,
      },
    };
  }
}
