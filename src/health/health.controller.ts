import { Controller, Get, Injectable } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckError,
  HealthCheckService,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import * as process from 'process';

@Injectable()
export class UptimeIndicator extends HealthIndicator {
  get(): HealthIndicatorResult {
    try {
      return { uptime: { status: 'up', uptime: process.uptime() } };
    } catch (ex) {
      throw new HealthCheckError('Uptime failed', ex);
    }
  }
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly uptime: UptimeIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.uptime.get()]);
  }
}
