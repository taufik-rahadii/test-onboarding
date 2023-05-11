import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { MockType } from 'src/common/mock/mocktype';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/common/mock/repository-mock.factory';
import { OrderStatusEnum } from './enums/order-status.enum';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

describe('Order Service Test Spec', () => {
  let orderService: OrderService;
  let orderRepository: MockType<Repository<Order>>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(OrderDetail),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    orderService = app.get<OrderService>(OrderService);
    orderRepository = app.get(getRepositoryToken(Order));
  });

  describe('get order by id', () => {
    it('should return order from requested id', async () => {
      const order = [
        {
          id: '7ffd602d-54d0-48f7-b5d5-d9212c8c59f3',
          status: OrderStatusEnum.PAID,
          totalAmount: 3333,
          orderDetails: [
            {
              id: '7ffd602d-54d0-48f7-b5d5-d9212c8c59f3',
              product_id: '7ffd602d-54d0-48f7-b5d5-d9212c8c59f3',
              qty: 1,
              amount: 3333,
            },
          ],
        },
      ];

      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(order[0]),
      });

      expect(await orderService.getOrderById(order[0].id)).toMatchObject(
        order[0],
      );
    });

    it('should return null', async () => {
      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue({}),
      });

      expect(
        await orderService.getOrderById('7ffd602d-54d0-48f7-b5d5-d9212c8c59f3'),
      ).toMatchObject({});
    });
  });

  describe('create order', () => {
    it('should create new order', async () => {
      const payload: CreateOrderDto = {
        details: [
          {
            product_id: '7ffd602d-54d0-48f7-b5d5-d9212c8c59f3',
            qty: 3,
          },
        ],
      };
    });
  });
});
