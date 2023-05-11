import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ResponseService } from 'src/response/response.service';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { ListOrderDto } from './dto/list-order.dto';
import { PaginationService } from 'src/utils/pagination.service';
import { Order } from './entities/order.entity';
import { Response } from 'express';

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
  public async finishOrder(@Param() { id }: OrderIdDto, @Res() res: Response) {
    try {
      if (!(await this.checkIsOrderPending(id)))
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              null,
              'Order has already been processed',
            ),
          );

      await this.orderService.updateOrderStatus(id, OrderStatusEnum.PAID);

      res.json(
        this.responseService.success(
          { status: OrderStatusEnum.PAID },
          'Order paid successfully',
        ),
      );
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.returnsInternalServerError());
    }
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  public async cancelOrder(@Param() { id }: OrderIdDto, @Res() res: Response) {
    try {
      if (!(await this.checkIsOrderPending(id)))
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              null,
              'Order has already been processed',
            ),
          );

      await this.orderService.updateOrderStatus(id, OrderStatusEnum.CANCELED);

      res.json(
        this.responseService.success(
          { status: OrderStatusEnum.CANCELED },
          'Order canceled successfully',
        ),
      );
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.returnsInternalServerError());
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

  @Get(':id')
  public async getOrderById(
    @Param() { id }: OrderIdDto,
    @Res() response: Response,
  ) {
    try {
      const order = await this.orderService.getOrderById(id, true);
      if (!order) response.status(404).json(this.returnsNotFoundError());

      response.json(
        this.responseService.success(order, 'Success retrieve order'),
      );
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.returnsInternalServerError());
    }
  }
}
