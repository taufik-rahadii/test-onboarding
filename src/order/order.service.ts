import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { ProductService } from 'src/product/product.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  private async detailWitAmount(
    details: CreateOrderDetailDto[],
  ): Promise<OrderDetail[]> {
    const products = await this.productRepo.find({
      where: {
        id: In(details.map((d) => d.product_id)),
      },
      select: ['price', 'id'],
      cache: true,
    });

    const orderDetails: OrderDetail[] = details.map((d) =>
      this.orderDetailRepository.create({
        ...d,
        productId: d.product_id,
        amount:
          products.find((product) => product.id === d.product_id).price * d.qty,
      }),
    );

    return orderDetails;
  }

  public async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const orderDetails = await this.detailWitAmount(createOrderDto.details);
      const totalAmount = orderDetails.reduce((a, b) => a + b.amount, 0);

      const order = await this.orderRepository.save([
        {
          orderDetails,
          totalAmount: totalAmount,
          status: OrderStatusEnum.PENDING,
        },
      ]);

      return order;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
