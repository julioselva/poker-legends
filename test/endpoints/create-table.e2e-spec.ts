import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { response } from 'express';
import * as request from 'supertest';

import { TableCreateResponse } from '../../src/table/payloads/http/table-create.response';
import { NotEnoughPlayersE, TooManyPlayersE } from '../../src/table/table.error';
import { TableModule } from '../../src/table/table.module';
import { CreateTableUseCase } from '../../src/table/use-cases/create-table.use-case';
import clearAllMocks = jest.clearAllMocks;
import { NoMoreCardsLeftE } from '../../src/cards/cards.error';

describe('Table/CreateTable', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TableModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('v1');
    app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();
  });

  describe('should succeed creating the table', () => {
    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer())
        .post('/v1/table')
        .send({ tableOf: 2 })
        .expect(201)
        .expect((response) => validateTableOfN(2, response.body as TableCreateResponse));
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer())
        .post('/v1/table')
        .send({ tableOf: 3 })
        .expect(201)
        .expect((response) => validateTableOfN(3, response.body as TableCreateResponse));
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer())
        .post('/v1/table')
        .send({ tableOf: 4 })
        .expect(201)
        .expect((response) => validateTableOfN(4, response.body as TableCreateResponse));
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer())
        .post('/v1/table')
        .send({ tableOf: 5 })
        .expect(201)
        .expect((response) => validateTableOfN(5, response.body as TableCreateResponse));
    });
  });

  describe('should fail due to the request validation', () => {
    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').expect(400);
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').send({ tableOf: -1000 }).expect(400);
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').send({ tableOf: -5 }).expect(400);
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').send({ tableOf: -0 }).expect(400);
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').send({ tableOf: 0 }).expect(400);
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').send({ tableOf: 1 }).expect(400);
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').send({ tableOf: 6 }).expect(400);
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').send({ tableOf: 7 }).expect(400);
    });

    it(`POST => /v1/table`, () => {
      return request(app.getHttpServer()).post('/v1/table').send({ tableOf: 1000 }).expect(400);
    });
  });

  describe.only('should be caught by the exception filter', () => {
    it(`POST => /v1/table`, () => {
      jest.spyOn(app.get<CreateTableUseCase>(CreateTableUseCase), 'exec').mockImplementation(() => {
        throw new NotEnoughPlayersE();
      });

      return request(app.getHttpServer())
        .post('/v1/table')
        .send({ tableOf: 5 })
        .expect(500)
        .expect((response) => {
          expect(response.body).toHaveProperty('error');
          expect(response.body['error']).toBe('NotEnoughPlayersE');
        });
    });

    it(`POST => /v1/table`, () => {
      jest.spyOn(app.get<CreateTableUseCase>(CreateTableUseCase), 'exec').mockImplementation(() => {
        throw new TooManyPlayersE();
      });

      return request(app.getHttpServer())
        .post('/v1/table')
        .send({ tableOf: 5 })
        .expect(500)
        .expect((response) => {
          expect(response.body).toHaveProperty('error');
          expect(response.body['error']).toBe('TooManyPlayersE');
        });
    });

    it(`POST => /v1/table`, () => {
      jest.spyOn(app.get<CreateTableUseCase>(CreateTableUseCase), 'exec').mockImplementation(() => {
        throw new NoMoreCardsLeftE();
      });

      return request(app.getHttpServer())
        .post('/v1/table')
        .send({ tableOf: 5 })
        .expect(500)
        .expect((response) => {
          expect(response.body).toHaveProperty('error');
          expect(response.body['error']).toBe('NoMoreCardsLeftE');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

function validateTableOfN(n: number, { hands, remainingCards, ...remainingArgs }: TableCreateResponse) {
  expect(remainingArgs).toMatchObject({});

  expect(hands).toBeDefined();
  expect(hands).toBeInstanceOf(Array);
  expect(hands).toHaveLength(n);

  expect(remainingCards).toBeDefined();
  expect(remainingCards).toBeInstanceOf(Array);
  expect(remainingCards).toHaveLength(52 - n * 5);

  const allCards = hands.flat().concat(remainingCards);

  expect(hasDuplicates(allCards)).not.toBeTruthy();
}

function hasDuplicates<T>(list: T[]): boolean {
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (isEqual(list[i], list[j])) {
        return true;
      }
    }
  }
  return false;
}

function isEqual<T>(obj1: T, obj2: T): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
