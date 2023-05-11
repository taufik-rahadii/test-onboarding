import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseService } from 'src/response/response.service';
import { MainPagingDTO } from 'src/common/dto/main-paging.dto';
import { PaginationService } from 'src/utils/pagination.service';
import { Product } from './entities/product.entity';
import { DetailProductDto } from './dto/detail-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@Controller('/product')
export class ProductController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly productService: ProductService,
    private readonly paginationService: PaginationService<Product>,
  ) {}

  private returnsInternalServerError() {
    return this.responseService.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Internal server error',
    );
  }

  private returnsNotFoundError() {
    return this.responseService.error(
      HttpStatus.NOT_FOUND,
      null,
      'Product Not Found',
    );
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return this.responseService.success(
        await this.productService.createProduct(createProductDto),
        'Created',
      );
    } catch (error) {
      return this.returnsInternalServerError();
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
      return this.returnsInternalServerError();
    }
  }

  @Get('/:id')
  public async getProductById(
    @Param() { id }: DetailProductDto,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productService.getProductById(id);

      if (!product)
        res.status(HttpStatus.BAD_REQUEST).json(this.returnsNotFoundError());

      res.json(this.responseService.success(product, 'Success'));
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.returnsInternalServerError());
    }
  }

  @Put(':id')
  public async updateProduct(
    @Param() { id }: DetailProductDto,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productService.getProductById(id);

      if (!product)
        res.status(HttpStatus.BAD_REQUEST).json(this.returnsNotFoundError());

      await this.productService.updateProduct(id, updateProductDto);

      res.json(
        this.responseService.success({ status: true }, 'Product updated'),
      );
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.returnsInternalServerError());
    }
  }

  @Delete(':id')
  public async deleteProduct(
    @Param() { id }: DetailProductDto,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productService.getProductById(id);

      if (!product)
        res.status(HttpStatus.BAD_REQUEST).json(this.returnsNotFoundError());

      await this.productService.deleteProduct(id);

      res.json(
        this.responseService.success({ status: true }, 'Product deleted'),
      );
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.returnsInternalServerError());
    }
  }
}
