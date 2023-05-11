import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { ListOrderDto } from './dto/list-order.dto';
import { PaginationService } from 'src/utils/pagination.service';
import { Order } from './entities/order.entity';
import { SetResponseMessage } from 'src/common/decorators/set-response-message.decorator.ts';

@Controller('/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paginateService: PaginationService<Order>,
  ) {}

  private async checkIsOrderPending(id: string) {
    const order = await this.orderService.getOrderById(id);
    return order.status === OrderStatusEnum.PENDING;
  }

  @Post()
  @SetResponseMessage('Order Created')
  public async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(createOrderDto);

      return order;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @Post(':id/finish')
  @SetResponseMessage('Order paid successfully')
  public async finishOrder(@Param() { id }: OrderIdDto) {
    try {
      if (!(await this.checkIsOrderPending(id)))
        throw new BadRequestException({
          message: 'Order has already been processed',
        });

      await this.orderService.updateOrderStatus(id, OrderStatusEnum.PAID);

      return { status: OrderStatusEnum.PAID };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @SetResponseMessage('Order canceled successfully')
  public async cancelOrder(@Param() { id }: OrderIdDto) {
    try {
      if (!(await this.checkIsOrderPending(id)))
        throw new BadRequestException({
          message: 'Order has already been processed',
        });

      await this.orderService.updateOrderStatus(id, OrderStatusEnum.CANCELED);

      return { status: OrderStatusEnum.CANCELED };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @Get()
  @SetResponseMessage('Success retrieve data')
  public async listOrders(@Query() listOrderDto: ListOrderDto) {
    try {
      const paginate = this.paginateService.buildPaginateQuery(listOrderDto, [
        'status',
      ]);

      const relations =
        listOrderDto.with_details === 'true' ? ['orderDetails'] : [];

      const { data, size: total } = await this.orderService.listOrders(
        paginate.skip,
        paginate.take,
        paginate.sort,
        paginate.where,
        relations,
      );

      return {
        pagination: this.paginateService.buildPaginationResponse(
          listOrderDto,
          total,
        ),
        content: data,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @SetResponseMessage('Success retrieve order')
  @Get(':id')
  public async getOrderById(@Param() { id }: OrderIdDto) {
    try {
      const order = await this.orderService.getOrderById(id, true);
      if (!order) throw new BadRequestException({ message: 'Order not found' });

      return order;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
