import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ResponseService } from 'src/response/response.service';

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

  @Post()
  public async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(createOrderDto);

      return this.responseService.success(order, 'Order created');
    } catch (error) {
      return this.returnsInternalServerError();
    }
  }
}
