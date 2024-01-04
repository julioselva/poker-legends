import { Body, Controller, Post, Put, UseFilters } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

import { ReducerValidationPipe } from '../lib/nest/reducer-validation.pipe';
import { TableCreateRequest } from './payloads/http/table-create.request';
import { TableCreateResponse } from './payloads/http/table-create.response';
import {
  TableUpdateRequest,
  TableUpdateRequestDiscardCards,
  TableUpdateRequestShowdown,
} from './payloads/http/table-update.request';
import {
  TableUpdateResponse,
  TableUpdateResponseDiscardCards,
  TableUpdateResponseShowdown,
} from './payloads/http/table-update.response';
import { TableEFilter } from './table.filter';
import { TableActionKind } from './table.type';
import { CreateTableUseCase } from './use-cases/create-table.use-case';
import { UpdateTableResult, UpdateTableUseCase } from './use-cases/update-table.use-case';

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
  update(
    @Body(new ReducerValidationPipe([TableUpdateRequestDiscardCards, TableUpdateRequestShowdown], { transform: true }))
    body: TableUpdateRequest,
  ): Observable<TableUpdateResponse> {
    return this.updateTableUseCase.exec(body.toCommand()).pipe(
      map((result) => {
        switch (result.action.kind) {
          case TableActionKind.DiscardCards:
            return new TableUpdateResponseDiscardCards(result as UpdateTableResult<TableActionKind.DiscardCards>);
          case TableActionKind.Showdown:
            return new TableUpdateResponseShowdown(result as UpdateTableResult<TableActionKind.Showdown>);
        }
      }),
    );
  }
}
