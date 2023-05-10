import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ResponseService } from 'src/response/response.service';
import { PaginationService } from 'src/utils/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService, ResponseService, PaginationService],
  controllers: [ProductController],
  exports: [TypeOrmModule, ProductService],
})
export class ProductModule {}
