import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ResponseService } from 'src/response/response.service';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderStatusEnum } from './enums/order-status.enum';

@Controller('/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly responseService: ResponseService,
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
}
