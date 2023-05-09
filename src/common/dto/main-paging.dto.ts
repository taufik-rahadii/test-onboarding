import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum OrderDirection {
  ASC,
  DESC,
}

export class MainPagingDTO {
  @IsNumber()
  page: 0;

  @IsNumber()
  size: 10;

  @IsString()
  search: string;

  @IsString()
  sort: string;

  @IsString()
  @IsIn(Object.values(OrderDirection))
  order: OrderDirection;
}
