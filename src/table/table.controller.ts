import { Body, Controller, Post, Put, UseFilters } from '@nestjs/common';

import { TableCreateRequest } from './payloads/http/table-create.request';
import { TableCreateResponse } from './payloads/http/table-create.response';
import { TableUpdateRequest } from './payloads/http/table-update.request';
import { TableUpdateResponse } from './payloads/http/table-update.response';
import { TableEFilter } from './table.filter';
import { CreateTableUseCase } from './use-cases/create-table.use-case';
import { UpdateTableUseCase } from './use-cases/update-table.use-case';

@UseFilters(TableEFilter)
@Controller('table')
export class TableController {
  constructor(
    public readonly createTableUseCase: CreateTableUseCase,
    public readonly updateTableUseCase: UpdateTableUseCase,
  ) {}

  @Post()
  create(@Body() body: TableCreateRequest): TableCreateResponse {
    const result = this.createTableUseCase.exec(body.toCommand());
    return new TableCreateResponse(result);
  }

  @Put()
  update(@Body() body: TableUpdateRequest): TableUpdateResponse {
    const result = this.updateTableUseCase.exec(body.toCommand());
    return new TableUpdateResponse(result);
  }
}
