import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController, UptimeIndicator } from './health.controller';

@Module({
  imports: [TerminusModule],
  exports: [],
  controllers: [HealthController],
  providers: [UptimeIndicator],
})
export class HealthModule {}
