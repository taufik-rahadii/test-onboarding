import { BaseEntity } from 'src/database/class/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { OrderStatusEnum } from '../enums/order-status.enum';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @Column()
  status: OrderStatusEnum;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails?: OrderDetail[];
}
