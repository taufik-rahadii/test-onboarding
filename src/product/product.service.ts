import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

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

  public async listProduct(
    skip: number,
    take: number,
    order: FindOptionsOrder<Product>,
  ) {
    try {
      const [data, size] = await this.productRepo.findAndCount({
        skip,
        take,
        order,
      });

      return { data, size };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  public async getProductById(id: string) {
    try {
      const product = await this.productRepo.findOne({
        where: { id },
      });

      return product;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
