import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class TableEFilter implements ExceptionFilter {
  catch<T extends Error>(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message = exception.message;
    const error = exception.name;

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error, message });
  }
}
