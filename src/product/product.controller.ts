import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { MainPagingDTO } from 'src/common/dto/main-paging.dto';
import { PaginationService } from 'src/utils/pagination.service';
import { Product } from './entities/product.entity';
import { DetailProductDto } from './dto/detail-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SetResponseMessage } from 'src/common/decorators/set-response-message.decorator.ts';

@Controller('/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly paginationService: PaginationService<Product>,
  ) {}

  @Post()
  @SetResponseMessage('Product created')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.createProduct(createProductDto);
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @Get()
  @SetResponseMessage('Success retrieve data')
  async listProduct(@Query() mainPagingDto: MainPagingDTO) {
    try {
      const paginate = this.paginationService.buildPaginateQuery(
        mainPagingDto,
        ['name'],
      );

      const productDatas = await this.productService.listProduct(
        paginate.skip,
        paginate.take,
        paginate.sort,
      );

      return {
        pagination: this.paginationService.buildPaginationResponse(
          mainPagingDto,
          productDatas.size,
        ),
        content: productDatas.data,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @Get('/:id')
  @SetResponseMessage('Success retrieve data')
  public async getProductById(@Param() { id }: DetailProductDto) {
    try {
      const product = await this.productService.getProductById(id);

      if (!product) throw new NotFoundException('Product not found');

      return product;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @Put(':id')
  @SetResponseMessage('Success update product')
  public async updateProduct(
    @Param() { id }: DetailProductDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await this.productService.getProductById(id);

      if (!product)
        throw new NotFoundException({ message: 'Product not found' });

      await this.productService.updateProduct(id, updateProductDto);

      return { status: true };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @Delete(':id')
  @SetResponseMessage('Product deleted')
  public async deleteProduct(@Param() { id }: DetailProductDto) {
    try {
      const product = await this.productService.getProductById(id);

      if (!product)
        throw new NotFoundException({ message: 'Product not found' });

      await this.productService.deleteProduct(id);

      return { status: true };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
