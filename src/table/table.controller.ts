import { Body, Controller, Post } from '@nestjs/common';

import { TableCreateRequest } from './payloads/http/table-create.request';
import { TableCreateResponse } from './payloads/http/table-create.response';
import {
  CreateTableResult,
  CreateTableUseCase,
} from './use-cases/create-table.use-case';

@Controller('table')
export class TableController {
  constructor(public readonly createTableUseCase: CreateTableUseCase) {}

  @Post()
  create(@Body() body: TableCreateRequest) {
    const result = this.createTableUseCase.exec(body.toCommand());
    return new TableCreateResponse(result);
  }
}
