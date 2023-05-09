import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseService } from 'src/response/response.service';
import { MainPagingDTO } from 'src/common/dto/main-paging.dto';
import { PaginationService } from 'src/utils/pagination.service';
import { Product } from './entities/product.entity';

@Controller('/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly responseService: ResponseService,
    private readonly paginationService: PaginationService<Product>,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return this.responseService.success(
        await this.productService.createProduct(createProductDto),
        'Created',
      );
    } catch (error) {
      return this.responseService.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        [],
        'Internal server error',
      );
    }
  }

  @Get()
  async listProduct(@Query() mainPagingDto: MainPagingDTO) {
    try {
      const paginate = this.paginationService.buildPaginateQuery(
        mainPagingDto,
        ['name', 'price'],
      );

      const productDatas = await this.productService.listProduct(
        paginate.skip,
        paginate.take,
        paginate.sort,
      );
      return this.responseService.successCollection(
        productDatas.data,
        {
          page: Number(mainPagingDto.page),
          size: Number(mainPagingDto.size),
          total: productDatas.size,
        },
        'Success',
      );
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
