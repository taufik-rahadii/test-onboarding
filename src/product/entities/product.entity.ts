import { BaseEntity } from 'src/database/class/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
