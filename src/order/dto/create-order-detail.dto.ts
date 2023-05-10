import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { IsExists } from 'src/common/validator/is-exists.validator';
import { Product } from 'src/product/entities/product.entity';

export class CreateOrderDetailDto {
  @IsUUID()
  @IsNotEmpty()
  @IsExists('id', Product, {
    message: ({ value }) => `Product with given id '${value}' is not exists`,
  })
  product_id: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  qty: number;
}
