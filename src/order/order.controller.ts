import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ResponseService } from 'src/response/response.service';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { ListOrderDto } from './dto/list-order.dto';
import { PaginationService } from 'src/utils/pagination.service';
import { Order } from './entities/order.entity';

@Controller('/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly responseService: ResponseService,
    private readonly paginateService: PaginationService<Order>,
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
      'Order not found',
    );
  }

  private async checkIsOrderPending(id: string) {
    const order = await this.orderService.getOrderById(id);
    return order.status === OrderStatusEnum.PENDING;
  }

  @Post()
  public async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(createOrderDto);

      return this.responseService.success(order, 'Order created');
    } catch (error) {
      return this.returnsInternalServerError();
    }
  }

  @Post(':id/finish')
  public async finishOrder(@Param() { id }: OrderIdDto) {
    try {
      if (!(await this.checkIsOrderPending(id)))
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          null,
          'Order has already been processed',
        );

      await this.orderService.updateOrderStatus(id, OrderStatusEnum.PAID);

      return this.responseService.success(
        { status: OrderStatusEnum.PAID },
        'Order paid successfully',
      );
    } catch (error) {
      return this.returnsInternalServerError();
    }
  }

  @Post(':id/cancel')
  public async cancelOrder(@Param() { id }: OrderIdDto) {
    try {
      if (!(await this.checkIsOrderPending(id)))
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          null,
          'Order has already been processed',
        );

      await this.orderService.updateOrderStatus(id, OrderStatusEnum.CANCELED);

      return this.responseService.success(
        { status: OrderStatusEnum.CANCELED },
        'Order canceled successfully',
      );
    } catch (error) {
      return this.returnsInternalServerError();
    }
  }

  @Get()
  public async listOrders(@Query() listOrderDto: ListOrderDto) {
    try {
      const paginate = this.paginateService.buildPaginateQuery(listOrderDto, [
        'status',
        'totalAmount',
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

      return this.responseService.successCollection(data, {
        page: Number(listOrderDto.page),
        size: Number(listOrderDto.size),
        total,
      });
    } catch (error) {
      return this.returnsInternalServerError();
    }
  }
}
