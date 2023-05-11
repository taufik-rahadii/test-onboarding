import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
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

  public async updateOrderStatus(id: string, status: OrderStatusEnum) {
    try {
      const order = await this.orderRepository.update(id, {
        status,
      });

      return order;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  public async getOrderById(id: string, withDetails = false) {
    try {
      const order = this.orderRepository
        .createQueryBuilder('order')
        .where('order.id = :id', { id });
      if (withDetails) {
        order
          .leftJoinAndSelect('order.orderDetails', 'orderDetails')
          .leftJoinAndSelect('orderDetails.product', 'product');
      }

      return await order.getOne();
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  public async listOrders(
    skip: number,
    take: number,
    order: FindOptionsOrder<Order>,
    where: FindOptionsWhere<Order> | FindOptionsWhere<Order>[],
    relations: string[],
  ) {
    try {
      const [data, size] = await this.orderRepository.findAndCount({
        skip,
        take,
        order,
        where,
        relations,
      });

      return { data, size };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
