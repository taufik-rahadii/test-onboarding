import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { OrderDirection } from 'src/common/dto/main-paging.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  public async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      const product = this.productRepo.create(createProductDto);

      return await this.productRepo.save(product);
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
