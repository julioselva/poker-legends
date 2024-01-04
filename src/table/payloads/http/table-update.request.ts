import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, Matches, ValidateNested } from 'class-validator';

import { TableActionKind } from '../../table.type';
import { UpdateTableCommand } from '../../use-cases/update-table.use-case';
import { TableUpdateRequestCard } from './common-validations';

// ---- Common ----

// ---- Request ----
export interface TableUpdateRequest {
  action: { kind: TableActionKind };
  toCommand(): UpdateTableCommand<TableActionKind>;
}

// ---- DiscardCards ----
export class TableUpdateRequestActionDiscardCardsData {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => TableUpdateRequestCard)
  discardedCards: TableUpdateRequestCard[];
}

export class TableUpdateRequestActionDiscardCards {
  @IsString()
  @Matches(new RegExp(`^${TableActionKind.DiscardCards}$`))
  kind: TableActionKind.DiscardCards;

  @ValidateNested()
  @Type(() => TableUpdateRequestActionDiscardCardsData)
  data: TableUpdateRequestActionDiscardCardsData;
}

export class TableUpdateRequestDiscardCards implements TableUpdateRequest {
  @ValidateNested()
  @Type(() => TableUpdateRequestActionDiscardCards)
  action: TableUpdateRequestActionDiscardCards;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @ArrayMinSize(5, { each: true })
  @ArrayMaxSize(5, { each: true })
  @ValidateNested({ each: true })
  @Type(() => TableUpdateRequestCard)
  hands: TableUpdateRequestCard[][];

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(42)
  @ValidateNested({ each: true })
  @Type(() => TableUpdateRequestCard)
  deck: TableUpdateRequestCard[];

  toCommand(): UpdateTableCommand<TableActionKind.DiscardCards> {
    return new UpdateTableCommand(this.action, this.hands, this.deck);
  }
}

// ---- Showdown ----
export class TableUpdateRequestActionShowdownData {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @ArrayMinSize(5, { each: true })
  @ArrayMaxSize(5, { each: true })
  @ValidateNested({ each: true })
  @Type(() => TableUpdateRequestCard)
  hands: TableUpdateRequestCard[][];
}

export class TableUpdateRequestActionShowdown {
  @IsString()
  @Matches(new RegExp(`^${TableActionKind.Showdown}$`))
  kind: TableActionKind.Showdown;

  @ValidateNested()
  @Type(() => TableUpdateRequestActionShowdownData)
  data: TableUpdateRequestActionShowdownData;
}

export class TableUpdateRequestShowdown {
  @ValidateNested()
  @Type(() => TableUpdateRequestActionShowdown)
  action: TableUpdateRequestActionShowdown;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @ArrayMinSize(5, { each: true })
  @ArrayMaxSize(5, { each: true })
  @ValidateNested({ each: true })
  @Type(() => TableUpdateRequestCard)
  hands: TableUpdateRequestCard[][];

  toCommand(): UpdateTableCommand<TableActionKind.Showdown> {
    return new UpdateTableCommand(this.action, this.hands);
  }
}
