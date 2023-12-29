import { Logger as Writer } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';

/* eslint-disable max-len */
const serverArt = `
.------..------..------..------..------.     .------..------..------..------..------..------..------.
|P.--. ||O.--. ||K.--. ||E.--. ||R.--. |.-.  |L.--. ||E.--. ||G.--. ||E.--. ||N.--. ||D.--. ||S.--. |
| :/\\: || :/\\: || :/\\: || (\\/) || :(): ((5)) | :/\\: || (\\/) || :/\\: || (\\/) || :(): || :/\\: || :/\\: |
| (__) || :\\/: || :\\/: || :\\/: || ()() |'-.-.| (__) || :\\/: || :\\/: || :\\/: || ()() || (__) || :\\/: |
| '--'P|| '--'O|| '--'K|| '--'E|| '--'R| ((1)) '--'L|| '--'E|| '--'G|| '--'E|| '--'N|| '--'D|| '--'S|
\`------'\`------'\`------'\`------'\`------'  '-'\`------'\`------'\`------'\`------'\`------'\`------'\`------'`;
/* eslint-enable max-len */

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('http.port');
  const root = 'v1';

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(root);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.enableCors({ origin: '*' });

  const logger = new Writer('bootstrap');
  await app.listen(port, () =>
    logger.log(`${serverArt}\nHttp application started at port: ${port}.`),
  );
}
bootstrap();
