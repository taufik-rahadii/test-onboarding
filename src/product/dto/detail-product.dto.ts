import { DetailUuid } from 'src/common/dto/detail-uuid.dto';
import { Product } from '../entities/product.entity';

export class DetailProductDto extends DetailUuid(new Product()) {}
