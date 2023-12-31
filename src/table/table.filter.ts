import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { DiscardCardsThresholdOverflowE, NoMoreCardsLeftE } from '../cards/cards.error';
import { EmptyHandE } from '../game/game.error';
import { NotEnoughPlayersE, TooManyPlayersE } from './table.error';

@Catch(NotEnoughPlayersE, TooManyPlayersE, NoMoreCardsLeftE, DiscardCardsThresholdOverflowE, EmptyHandE)
export class TableEFilter implements ExceptionFilter {
  catch<T extends Error>(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = exception.message;
    const error = exception.name;
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).json({ message, error, status });
  }
}
