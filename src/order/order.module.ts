import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { ResponseService } from 'src/response/response.service';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([Order, OrderDetail])],
  providers: [ResponseService, OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
