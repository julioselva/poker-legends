import { IsInt, IsNumber, Max, Min } from 'class-validator';

import { CreateTableCommand } from '../../use-cases/create-table.use-case';

export class TableCreateRequest {
  @IsNumber()
  @IsInt()
  @Min(2)
  @Max(5)
  tableOf: number;

  toCommand(): CreateTableCommand {
    return new CreateTableCommand(this.tableOf);
  }
}
