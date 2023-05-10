import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseService } from 'src/response/response.service';
import { MainPagingDTO } from 'src/common/dto/main-paging.dto';
import { PaginationService } from 'src/utils/pagination.service';
import { Product } from './entities/product.entity';
import { DetailProductDto } from './dto/detail-product.dto';
import { MessageService } from 'src/message/message.service';

@Controller('/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly responseService: ResponseService,
    private readonly paginationService: PaginationService<Product>,
    private readonly messageService: MessageService,
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

  @Get('/:id')
  public async getProductById(@Param() { id }: DetailProductDto) {
    try {
      const product = await this.productService.getProductById(id);

      if (!product) {
        return this.responseService.error(
          HttpStatus.NOT_FOUND,
          null,
          `Product with id ${id} was not found`,
        );
      }

      return this.responseService.success(product, 'Success');
    } catch (error) {
      console.log(error);

      throw this.responseService.error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        [...error],
        'Internal server error',
      );
    }
  }
}
