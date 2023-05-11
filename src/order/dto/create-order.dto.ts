import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateOrderDetailDto } from './create-order-detail.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  details: CreateOrderDetailDto[];
}
