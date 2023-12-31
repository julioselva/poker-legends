import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { HealthModule } from '../../src/health/health.module';

describe('Health/Check', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('v1');
    app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();
  });

  it(`GET => /v1/health`, () => {
    return request(app.getHttpServer()).get('/v1/health').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
