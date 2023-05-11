import { IsBooleanString, IsOptional } from 'class-validator';
import { MainPagingDTO } from 'src/common/dto/main-paging.dto';

export class ListOrderDto extends MainPagingDTO {
  @IsOptional()
  @IsBooleanString()
  readonly with_details: string = 'false';
}
