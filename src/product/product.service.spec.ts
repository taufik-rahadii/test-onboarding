import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MockType } from 'src/common/mock/mocktype';
import { Repository } from 'typeorm';
import { repositoryMockFactory } from 'src/common/mock/repository-mock.factory';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: MockType<Repository<Product>>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    productRepository = app.get(getRepositoryToken(Product));
    productService = app.get<ProductService>(ProductService);
  });

  describe('Create product', () => {
    it('should be return created order', async () => {
      const product: CreateProductDto = {
        name: 'New Product',
        price: 666,
        description: '',
      };

      expect(await productService.createProduct(product)).toMatchObject(
        product,
      );
    });
  });

  describe('List products', () => {
    it('should be return data and total count', async () => {
      const products = [
        {
          id: 'e9590a29-0882-4d06-bb5e-d8931b4ee75f',
          name: 'New Product',
          description: '',
          price: 666,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 'e9590a29-0882-4d06-bb5e-d8931b4ee75f',
          name: 'New Product',
          description: '',
          price: 666,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest
        .spyOn(productRepository, 'findAndCount')
        .mockReturnValue([products, products.length]);

      expect(
        await productService.listProduct(1, 2, { id: 'ASC' }),
      ).toMatchObject({ data: products, size: products.length });
    });
  });
});
