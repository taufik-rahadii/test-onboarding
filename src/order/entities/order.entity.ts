import { BaseEntity } from 'src/database/class/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { ColumnNumericTransformer } from 'src/database/helper/column_numberic_transformer';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @Column()
  status: OrderStatusEnum;

  @Column({
    type: 'bigint',
    transformer: new ColumnNumericTransformer(),
  })
  totalAmount: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: ['insert'],
  })
  orderDetails?: OrderDetail[];
}
