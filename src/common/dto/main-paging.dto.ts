import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export enum OrderDirection {
  ASC,
  DESC,
}

export class MainPagingDTO {
  @IsNumberString()
  page: number;

  @IsNumberString()
  size: number;

  @IsString()
  @IsOptional()
  search: string;

  @IsString()
  sort: string;

  @IsString()
  @IsIn(Object.values(OrderDirection))
  order: OrderDirection;
}
